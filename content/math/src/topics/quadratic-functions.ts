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

import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** front writes a constant factor before a power or parentheses: "", "-", "3" or "\frac{1}{2}". */
function front(k: Coefficient): string {
  const v = toQ(k);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return num(v);
}

/** tail writes a constant added after an expression: "", " + 3" or " - \frac{1}{2}". */
function tail(c: Coefficient): string {
  const v = toQ(c);
  return v.isZero() ? "" : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`;
}

/** sq writes (x − h)², or x² when h = 0. */
const sq = (h: Coefficient, v = "x") => (toQ(h).isZero() ? `${v}^{2}` : `(${linear(1, toQ(h).neg(), v)})^{2}`);

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
  const p = paren(x);
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

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** sqrtSurd is √k for a rational k ≥ 0, in simplest form. */
function sqrtSurd(k: Q): Surd {
  if (k.isZero()) return surd(Q.zero);
  const [c, m] = simplifyRadical(Number(k.n * k.d));
  return surd(Q.zero, Q.of(c, k.d), BigInt(m));
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

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

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
  return `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${d}`;
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

export const graphingElementaryQuadraticFunctions: TopicDef = {
  id: "graphing-elementary-quadratic-functions",
  title: t("Graphing Elementary Quadratic Functions", "画简单二次函数的图象"),
  summary: t(
    "Graph $y = ax^{2}$ with $a > 0$ from a table of values, and see how $a$ changes the shape of the parabola.",
    "由函数值表画出 $y = ax^{2}$（$a > 0$）的图象，并了解 $a$ 如何改变抛物线的形状。",
  ),
  prerequisites: ["graphs-of-functions"],
  encompasses: [
    { topic: "graphs-of-functions", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSF.IF.C.7.A"],
  knowledgePoints: [
    {
      id: "tables-of-values",
      title: t("Tables of values", "函数值表"),
      explanation: t(
        "The simplest **quadratic function** is $y = x^{2}$. To graph it, make a table of values:\n\n$$\\begin{array}{c|ccccccc} x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 9 & 4 & 1 & 0 & 1 & 4 & 9 \\end{array}$$\n\nPlotting the points and joining them with a smooth curve gives a U-shaped curve called a **parabola**. Its lowest point, $(0, 0)$, is the **vertex**. Since $(-x)^{2} = x^{2}$, the inputs $x$ and $-x$ give the same output.\n\nFor $y = ax^{2}$, square $x$ first, then multiply by $a$: for $y = 3x^{2}$ and $x = -2$, $y = 3 \\cdot (-2)^{2} = 3 \\cdot 4 = 12$, not $(3 \\cdot (-2))^{2} = 36$.",
        "最简单的**二次函数**是 $y = x^{2}$。画它的图象时，先列函数值表：\n\n$$\\begin{array}{c|ccccccc} x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 9 & 4 & 1 & 0 & 1 & 4 & 9 \\end{array}$$\n\n描出这些点，再用光滑的曲线连接，就得到一条 U 形曲线，叫做**抛物线**。它的最低点 $(0, 0)$ 叫做**顶点**。因为 $(-x)^{2} = x^{2}$，输入 $x$ 与 $-x$ 得到相同的输出。\n\n对 $y = ax^{2}$，先把 $x$ 平方，再乘以 $a$：对 $y = 3x^{2}$ 和 $x = -2$，$y = 3 \\cdot (-2)^{2} = 3 \\cdot 4 = 12$，而不是 $(3 \\cdot (-2))^{2} = 36$。",
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
        return numberProblem({
          prompt: fn
            ? t(`Let $f(x) = ${front(a)}x^{2}$. Find $f(${x})$.`, `设 $f(x) = ${front(a)}x^{2}$。求 $f(${x})$。`)
            : t(`For $y = ${front(a)}x^{2}$, find $y$ when $x = ${x}$.`, `对 $y = ${front(a)}x^{2}$，求 $x = ${x}$ 时 $y$ 的值。`),
          answer: y,
          wrong: [y.neg(), a.mul(X).mul(a.mul(X)), a.mul(Q.of(2 * x))],
          solution: t(
            `Square first, then multiply by $${num(a)}$:${steps(`${plugIn(a, 0, 0, x)} = ${a.eq(Q.one) ? "" : `${num(a)} \\cdot `}${x * x} = ${num(y)}`)}`,
            `先平方，再乘以 $${num(a)}$：${steps(`${plugIn(a, 0, 0, x)} = ${a.eq(Q.one) ? "" : `${num(a)} \\cdot `}${x * x} = ${num(y)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-a-from-a-point",
      title: t("Finding $a$ from a point", "由一个点求 $a$"),
      explanation: t(
        "If the graph of $y = ax^{2}$ passes through a point, the coordinates of the point satisfy the equation. Substitute them and solve for $a$. Through $(3, 18)$:\n\n$$18 = a \\cdot 3^{2} = 9a \\quad\\Rightarrow\\quad a = \\frac{18}{9} = 2$$\n\nDivide by the **square** of the $x$-coordinate, not by the $x$-coordinate itself.",
        "如果 $y = ax^{2}$ 的图象经过某点，这个点的坐标满足方程。代入后解出 $a$。经过 $(3, 18)$ 时：\n\n$$18 = a \\cdot 3^{2} = 9a \\quad\\Rightarrow\\quad a = \\frac{18}{9} = 2$$\n\n要除以 $x$ 坐标的**平方**，而不是 $x$ 坐标本身。",
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
        return numberProblem({
          prompt: t(
            `The graph of $y = ax^{2}$ passes through the point $${pt(p, q)}$. Find $a$.`,
            `$y = ax^{2}$ 的图象经过点 $${pt(p, q)}$。求 $a$。`,
          ),
          answer: a,
          wrong: [q.div(Q.of(p)), Q.of(p * p).div(q), q.mul(Q.of(p * p)), q.div(Q.of(2 * p))],
          solution: t(
            `Substitute $x = ${p}$ and $y = ${num(q)}$:${steps(`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p === 1 ? "" : p * p}a`, `a = \\frac{${num(q)}}{${p * p}} = ${num(a)}`)}`,
            `代入 $x = ${p}$，$y = ${num(q)}$：${steps(`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p === 1 ? "" : p * p}a`, `a = \\frac{${num(q)}}{${p * p}} = ${num(a)}`)}`,
          ),
        });
      },
    },
    {
      id: "narrow-and-wide-parabolas",
      title: t("Narrow and wide parabolas", "窄的与宽的抛物线"),
      explanation: t(
        "For $a > 0$, the larger $a$ is, the faster $ax^{2}$ grows as $x$ moves away from $0$, so the **narrower** the parabola. In the figure, $y = 3x^{2}$ is narrower than $y = x^{2}$, and $y = \\frac{1}{3}x^{2}$ is wider: at $x = 1$ the three graphs are at heights $3$, $1$ and $\\frac{1}{3}$.",
        "当 $a > 0$ 时，$a$ 越大，$x$ 离开 $0$ 时 $ax^{2}$ 增长得越快，抛物线就越**窄**。图中 $y = 3x^{2}$ 比 $y = x^{2}$ 窄，$y = \\frac{1}{3}x^{2}$ 比它宽：在 $x = 1$ 处，三条图象的高度分别是 $3$、$1$ 和 $\\frac{1}{3}$。",
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
        const [a1, a2] = rng.sample(positiveAs, 2) as [Q, Q];
        const narrow = rng.bool();
        const bigger = a1.cmp(a2) > 0 ? 0 : 1;
        const correct = narrow ? bigger : 1 - bigger;
        const options = [a1, a2].map((a) => same(`$y = ${front(a)}x^{2}$`));
        const pick = correct === 0 ? a1 : a2;
        return choiceProblem({
          prompt: narrow
            ? t(
                `Which is narrower: the graph of $y = ${front(a1)}x^{2}$ or the graph of $y = ${front(a2)}x^{2}$?`,
                `$y = ${front(a1)}x^{2}$ 与 $y = ${front(a2)}x^{2}$ 的图象，哪个更窄？`,
              )
            : t(
                `Which is wider: the graph of $y = ${front(a1)}x^{2}$ or the graph of $y = ${front(a2)}x^{2}$?`,
                `$y = ${front(a1)}x^{2}$ 与 $y = ${front(a2)}x^{2}$ 的图象，哪个更宽？`,
              ),
          options,
          correct,
          solution: t(
            `The ${narrow ? "larger" : "smaller"} coefficient gives the ${narrow ? "narrower" : "wider"} parabola: $${num(pick)}$ is ${narrow ? "larger" : "smaller"} than $${num(correct === 0 ? a2 : a1)}$, so $y = ${front(pick)}x^{2}$ is ${narrow ? "narrower" : "wider"}.`,
            `系数越${narrow ? "大" : "小"}，抛物线越${narrow ? "窄" : "宽"}：$${num(pick)}$ ${narrow ? "大于" : "小于"} $${num(correct === 0 ? a2 : a1)}$，所以 $y = ${front(pick)}x^{2}$ 更${narrow ? "窄" : "宽"}。`,
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
  knowledgePoints: [
    {
      id: "opening-up-or-down",
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        "Multiplying every output by $-1$ reflects a graph in the $x$-axis: $y = -x^{2}$ is $y = x^{2}$ turned upside down. So the graph of $y = ax^{2}$\n\n- opens **upward** when $a > 0$, and its vertex $(0, 0)$ is the **lowest** point;\n- opens **downward** when $a < 0$, and its vertex $(0, 0)$ is the **highest** point.",
        "把每个输出都乘以 $-1$，图象就关于 $x$ 轴翻折：$y = -x^{2}$ 是把 $y = x^{2}$ 上下颠倒。所以 $y = ax^{2}$ 的图象\n\n- 当 $a > 0$ 时开口**向上**，顶点 $(0, 0)$ 是**最低**点；\n- 当 $a < 0$ 时开口**向下**，顶点 $(0, 0)$ 是**最高**点。",
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
            `Here $a = ${num(a)}$ is ${up ? "positive" : "negative"}, so the parabola opens ${up ? "upward" : "downward"} and its vertex $(0, 0)$ is its ${up ? "lowest" : "highest"} point.`,
            `这里 $a = ${num(a)}$ 是${up ? "正" : "负"}数，所以抛物线开口向${up ? "上" : "下"}，顶点 $(0, 0)$ 是最${up ? "低" : "高"}点。`,
          ),
        });
      },
    },
    {
      id: "reflecting-in-the-x-axis",
      title: t("Reflecting in the $x$-axis", "关于 $x$ 轴翻折"),
      explanation: t(
        "Reflecting in the $x$-axis keeps every $x$-coordinate and changes the sign of every $y$-coordinate: the point $(2, 12)$ goes to $(2, -12)$. So the reflection of $y = ax^{2}$ is $y = -ax^{2}$; for example, $y = 3x^{2}$ becomes $y = -3x^{2}$, and $y = -\\frac{1}{2}x^{2}$ becomes $y = \\frac{1}{2}x^{2}$.",
        "关于 $x$ 轴翻折时，每个点的 $x$ 坐标不变，$y$ 坐标变号：点 $(2, 12)$ 变为 $(2, -12)$。所以 $y = ax^{2}$ 翻折后是 $y = -ax^{2}$；例如 $y = 3x^{2}$ 变为 $y = -3x^{2}$，$y = -\\frac{1}{2}x^{2}$ 变为 $y = \\frac{1}{2}x^{2}$。",
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
              `Every output changes sign, so the new graph is $y = -(${front(a) === "-" ? "-" : front(a)}x^{2}) = ${front(a.neg())}x^{2}$.`,
              `每个输出都变号，所以新图象是 $y = -(${front(a) === "-" ? "-" : front(a)}x^{2}) = ${front(a.neg())}x^{2}$。`,
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
            `Reflecting in the $x$-axis keeps $x = ${p}$ and changes the sign of $y$: the point is $${pt(p, q.neg())}$.`,
            `关于 $x$ 轴翻折时 $x = ${p}$ 不变，$y$ 变号：所求点是 $${pt(p, q.neg())}$。`,
          ),
        });
      },
    },
    {
      id: "finding-a-from-a-graph",
      title: t("Finding $a$ from a graph", "由图象求 $a$"),
      explanation: t(
        "To find $a$ from the graph of $y = ax^{2}$, read a point of the graph with integer coordinates other than the vertex, substitute it, and solve. If the graph opens downward and passes through $(2, -2)$:\n\n$$-2 = a \\cdot 2^{2} = 4a \\quad\\Rightarrow\\quad a = -\\frac{1}{2}$$\n\nA graph that opens downward must give a negative $a$.",
        "要由 $y = ax^{2}$ 的图象求 $a$，先读出图象上除顶点外一个坐标为整数的点，代入后求解。若图象开口向下并经过 $(2, -2)$：\n\n$$-2 = a \\cdot 2^{2} = 4a \\quad\\Rightarrow\\quad a = -\\frac{1}{2}$$\n\n开口向下的图象一定给出负的 $a$。",
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
        return {
          ...numberProblem({
            prompt: t("The graph of $y = ax^{2}$ passes through the marked point. Find $a$.", "$y = ax^{2}$ 的图象经过标出的点。求 $a$。"),
            answer: a,
            wrong: [a.neg(), q.div(Q.of(p)), Q.of(p * p).div(q)],
            solution: t(
              `The marked point is $${pt(p, q)}$. Substitute it:${steps(`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p === 1 ? "" : p * p}a`, `a = ${num(a)}`)}`,
              `标出的点是 $${pt(p, q)}$。代入：${steps(`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p === 1 ? "" : p * p}a`, `a = ${num(a)}`)}`,
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
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "the-y-intercept",
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        "The graph of any **quadratic function** $y = ax^{2} + bx + c$ with $a \\ne 0$ is a parabola. It opens upward when $a > 0$ and downward when $a < 0$.\n\nThe graph meets the $y$-axis where $x = 0$, and there $y = a \\cdot 0^{2} + b \\cdot 0 + c = c$. So the $y$-intercept is $(0, c)$: for $y = 2x^{2} - 5x + 3$ it is $(0, 3)$.",
        "任何**二次函数** $y = ax^{2} + bx + c$（$a \\ne 0$）的图象都是抛物线。$a > 0$ 时开口向上，$a < 0$ 时开口向下。\n\n图象在 $x = 0$ 处与 $y$ 轴相交，此时 $y = a \\cdot 0^{2} + b \\cdot 0 + c = c$。所以 $y$ 轴截距是 $(0, c)$：$y = 2x^{2} - 5x + 3$ 的 $y$ 轴截距是 $(0, 3)$。",
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
            `On the $y$-axis $x = 0$, so $y = ${c}$: the point is $(0, ${c})$.`,
            `在 $y$ 轴上 $x = 0$，所以 $y = ${c}$：交点是 $(0, ${c})$。`,
          ),
        });
      },
    },
    {
      id: "points-on-the-graph",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "A point lies on the graph of $y = ax^{2} + bx + c$ exactly when its coordinates satisfy the equation. Is $(-2, 13)$ on $y = 2x^{2} - 3x - 1$?\n\n$$2 \\cdot (-2)^{2} - 3 \\cdot (-2) - 1 = 8 + 6 - 1 = 13$$\n\nThe output is $13$, so yes. Keep the parentheses around a negative input: $(-2)^{2} = 4$.",
        "点在 $y = ax^{2} + bx + c$ 的图象上，当且仅当它的坐标满足方程。$(-2, 13)$ 在 $y = 2x^{2} - 3x - 1$ 上吗？\n\n$$2 \\cdot (-2)^{2} - 3 \\cdot (-2) - 1 = 8 + 6 - 1 = 13$$\n\n输出是 $13$，所以在。负的输入要加括号：$(-2)^{2} = 4$。",
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
        return choiceProblem({
          prompt: t(
            `Does the point $${pt(p, q)}$ lie on the graph of $y = ${quad(a, b, c)}$?`,
            `点 $${pt(p, q)}$ 在 $y = ${quad(a, b, c)}$ 的图象上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `Substitute $x = ${p}$:${steps(`${plugIn(a, b, c, p)} = ${num(value)}`)}${on ? `The output is $${num(q)}$, so the point lies on the graph.` : `The output is $${num(value)}$, not $${num(q)}$, so the point does not lie on the graph.`}`,
            `代入 $x = ${p}$：${steps(`${plugIn(a, b, c, p)} = ${num(value)}`)}${on ? `输出是 $${num(q)}$，所以点在图象上。` : `输出是 $${num(value)}$，不是 $${num(q)}$，所以点不在图象上。`}`,
          ),
        });
      },
    },
    {
      id: "matching-a-graph",
      title: t("Matching an equation to a graph", "由图象选方程"),
      explanation: t(
        "To match an equation to a parabola, check the features that are easy to read:\n\n1. the direction: upward needs $a > 0$, downward $a < 0$;\n2. the $y$-intercept: the graph crosses the $y$-axis at $(0, c)$;\n3. if two equations still fit, test another point of the graph, such as the vertex.",
        "要为抛物线选出方程，先检查容易读出的特征：\n\n1. 开口方向：向上要求 $a > 0$，向下要求 $a < 0$；\n2. $y$ 轴截距：图象与 $y$ 轴交于 $(0, c)$；\n3. 若仍有两个方程符合，再检验图象上的另一点，比如顶点。",
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
        return {
          ...choiceProblem({
            prompt: t("Which equation has the graph shown?", "图中的图象是哪个方程的图象？"),
            options,
            correct: order.indexOf(0),
            solution: t(
              `The parabola opens ${up ? "upward" : "downward"}, so $a ${up ? ">" : "<"} 0$, and it crosses the $y$-axis at $(0, ${c})$, so $c = ${c}$. Of the two equations left, only $y = ${quad(a, b, c)}$ passes through the vertex $(${h}, ${k})$: ${steps(`${plugIn(a, b, c, h)} = ${k}`)}`,
              `抛物线开口向${up ? "上" : "下"}，所以 $a ${up ? ">" : "<"} 0$；它与 $y$ 轴交于 $(0, ${c})$，所以 $c = ${c}$。剩下的两个方程中，只有 $y = ${quad(a, b, c)}$ 经过顶点 $(${h}, ${k})$：${steps(`${plugIn(a, b, c, h)} = ${k}`)}`,
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
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "roots-by-factoring",
      title: t("Roots by factoring", "用因式分解求零点"),
      explanation: t(
        "The **roots** of $f(x) = ax^{2} + bx + c$ are the solutions of $f(x) = 0$; they are the $x$-coordinates of the points where the parabola meets the $x$-axis. For $f(x) = x^{2} - 2x - 8$:\n\n$$x^{2} - 2x - 8 = 0 \\Rightarrow (x - 4)(x + 2) = 0 \\Rightarrow x = 4 \\text{ or } x = -2$$\n\nSo the graph crosses the $x$-axis at $(4, 0)$ and $(-2, 0)$.",
        "$f(x) = ax^{2} + bx + c$ 的**零点**是 $f(x) = 0$ 的解，也就是抛物线与 $x$ 轴交点的横坐标。对 $f(x) = x^{2} - 2x - 8$：\n\n$$x^{2} - 2x - 8 = 0 \\Rightarrow (x - 4)(x + 2) = 0 \\Rightarrow x = 4 \\text{ 或 } x = -2$$\n\n所以图象与 $x$ 轴交于 $(4, 0)$ 和 $(-2, 0)$。",
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
            `Set the function equal to $0$ and factor:${steps(`${fx} = 0`, `${front(a)}${factor(r)}${factor(s)} = 0`)}So the roots are $x = ${r}$ and $x = ${s}$.`,
            `令函数值为 $0$ 并分解因式：${steps(`${fx} = 0`, `${front(a)}${factor(r)}${factor(s)} = 0`)}所以零点是 $x = ${r}$ 和 $x = ${s}$。`,
          ),
        });
      },
    },
    {
      id: "roots-from-factored-form",
      title: t("Roots from factored form", "由因式分解形式求零点"),
      explanation: t(
        "When the function is already a product, set each factor equal to $0$. A constant factor in front never equals $0$, so it gives no root:\n\n$$f(x) = -3(2x - 5)(x + 4) \\quad\\Rightarrow\\quad 2x - 5 = 0 \\text{ or } x + 4 = 0$$\n\nThe roots are $x = \\frac{5}{2}$ and $x = -4$. Watch the signs: the factor $x + 4$ gives $-4$, not $4$.",
        "函数已经是乘积时，令每个因式等于 $0$。前面的常数因子不会等于 $0$，不给出零点：\n\n$$f(x) = -3(2x - 5)(x + 4) \\quad\\Rightarrow\\quad 2x - 5 = 0 \\text{ 或 } x + 4 = 0$$\n\n零点是 $x = \\frac{5}{2}$ 和 $x = -4$。注意符号：因式 $x + 4$ 给出 $-4$，不是 $4$。",
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
        return solutionsProblem({
          prompt: t(`Find the roots of $f(x) = ${fx}$.`, `求 $f(x) = ${fx}$ 的零点。`),
          values: [num(r), String(s)],
          wrong: [
            [num(r.neg()), String(-s)],
            [String(-q), String(s)],
            [String(k), num(r), String(s)],
          ],
          solution: t(
            `Set each factor with $x$ equal to $0$:${steps(`${linear(p, q)} = 0 \\Rightarrow x = ${num(r)}`, `${linear(1, -s)} = 0 \\Rightarrow x = ${s}`)}The constant $${k}$ is never $0$. The roots are $x = ${num(r)}$ and $x = ${s}$.`,
            `令每个含 $x$ 的因式等于 $0$：${steps(`${linear(p, q)} = 0 \\Rightarrow x = ${num(r)}`, `${linear(1, -s)} = 0 \\Rightarrow x = ${s}`)}常数 $${k}$ 不会等于 $0$。零点是 $x = ${num(r)}$ 和 $x = ${s}$。`,
          ),
        });
      },
    },
    {
      id: "roots-with-the-quadratic-formula",
      title: t("Roots with the quadratic formula", "用求根公式求零点"),
      explanation: t(
        "When $ax^{2} + bx + c$ does not factor over the integers, find the roots with the quadratic formula\n\n$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$\n\nFor $f(x) = x^{2} - 4x + 1$: $x = \\frac{4 \\pm \\sqrt{16 - 4}}{2} = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$. The graph crosses the $x$-axis at $x = 2 + \\sqrt{3} \\approx 3.73$ and $x = 2 - \\sqrt{3} \\approx 0.27$.",
        "当 $ax^{2} + bx + c$ 不能在整数范围内分解时，用求根公式\n\n$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$\n\n求零点。对 $f(x) = x^{2} - 4x + 1$：$x = \\frac{4 \\pm \\sqrt{16 - 4}}{2} = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$。图象与 $x$ 轴交于 $x = 2 + \\sqrt{3} \\approx 3.73$ 和 $x = 2 - \\sqrt{3} \\approx 0.27$。",
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
        return solutionsProblem({
          prompt: t(`Find the roots of $f(x) = ${quad(a, b, c)}$.`, `求 $f(x) = ${quad(a, b, c)}$ 的零点。`),
          values: roots,
          wrong,
          solution: t(
            `The expression does not factor over the integers, so use the formula with $a = ${a}$, $b = ${b}$, $c = ${c}$:${steps(`x = \\frac{${-b} \\pm \\sqrt{${d}}}{${2 * a}}`)}The roots are ${listed(roots).en}.`,
            `它不能在整数范围内分解，所以用公式，$a = ${a}$，$b = ${b}$，$c = ${c}$：${steps(`x = \\frac{${-b} \\pm \\sqrt{${d}}}{${2 * a}}`)}零点是 ${listed(roots)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

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
    { topic: "roots-of-quadratic-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.4.B", "CCSS.HSF.IF.C.8.A"],
  knowledgePoints: [
    {
      id: "counting-x-intercepts",
      title: t("Counting $x$-intercepts", "数与 $x$ 轴的交点"),
      explanation: t(
        "The $x$-intercepts of $y = ax^{2} + bx + c$ are the real solutions of $ax^{2} + bx + c = 0$, so the discriminant $b^{2} - 4ac$ counts them:\n\n- positive: the parabola crosses the $x$-axis twice;\n- zero: it touches the $x$-axis at one point, its vertex;\n- negative: it does not meet the $x$-axis.\n\nFor $y = 2x^{2} - 3x + 4$: $9 - 32 = -23 < 0$, so no $x$-intercepts.",
        "$y = ax^{2} + bx + c$ 与 $x$ 轴的交点对应 $ax^{2} + bx + c = 0$ 的实数解，所以判别式 $b^{2} - 4ac$ 决定交点个数：\n\n- 为正：抛物线与 $x$ 轴相交两次；\n- 为零：与 $x$ 轴相切于一点，即顶点；\n- 为负：与 $x$ 轴没有交点。\n\n对 $y = 2x^{2} - 3x + 4$：$9 - 32 = -23 < 0$，所以与 $x$ 轴没有交点。",
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [a, b, c] = drawBySign(rng, sign);
        const d = b * b - 4 * a * c;
        return choiceProblem({
          prompt: t(
            `How many $x$-intercepts does the graph of $y = ${quad(a, b, c)}$ have?`,
            `$y = ${quad(a, b, c)}$ 的图象与 $x$ 轴有几个交点？`,
          ),
          options: interceptOptions,
          correct: sign + 1,
          solution: t(
            `Compute the discriminant:${steps(discriminantSteps(a, b, c))}It is ${countWords(d).en}.`,
            `计算判别式：${steps(discriminantSteps(a, b, c))}它${countWords(d)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "the-discriminant-from-a-graph",
      title: t("The sign of the discriminant from a graph", "由图象判断判别式的符号"),
      explanation: t(
        "Read the argument backwards: count the points where the parabola meets the $x$-axis.\n\n- Two crossings: $b^{2} - 4ac > 0$.\n- The vertex on the $x$-axis: $b^{2} - 4ac = 0$.\n- No meeting point: $b^{2} - 4ac < 0$. This happens when the vertex is above the $x$-axis and the parabola opens upward, or below it and the parabola opens downward.",
        "反过来推理：数一数抛物线与 $x$ 轴的交点。\n\n- 相交两次：$b^{2} - 4ac > 0$。\n- 顶点在 $x$ 轴上：$b^{2} - 4ac = 0$。\n- 没有交点：$b^{2} - 4ac < 0$。顶点在 $x$ 轴上方且开口向上，或顶点在 $x$ 轴下方且开口向下时就是这样。",
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
        return {
          ...choiceProblem({
            prompt: t(
              "The graph of $y = ax^{2} + bx + c$ is shown. What is true of its discriminant?",
              "如图是 $y = ax^{2} + bx + c$ 的图象。它的判别式满足什么？",
            ),
            options,
            correct: 1 - sign,
            solution: t(
              `The parabola ${meets.en}, so ${options[1 - sign]!.en}.`,
              `抛物线${meets["zh-CN"]}，所以 ${options[1 - sign]!["zh-CN"]}。`,
            ),
          }),
          figure: parabolaFigure(a, h, k),
        };
      },
    },
    {
      id: "touching-the-x-axis",
      title: t("Parabolas that touch the $x$-axis", "与 $x$ 轴相切的抛物线"),
      explanation: t(
        "A parabola touches the $x$-axis at exactly one point when its discriminant is $0$. To find the constant $c$ for which $y = 2x^{2} - 12x + c$ does this:\n\n$$(-12)^{2} - 4 \\cdot 2 \\cdot c = 0 \\Rightarrow 144 - 8c = 0 \\Rightarrow c = 18$$",
        "抛物线与 $x$ 轴恰有一个交点（相切），当且仅当判别式为 $0$。求使 $y = 2x^{2} - 12x + c$ 满足这一点的常数 $c$：\n\n$$(-12)^{2} - 4 \\cdot 2 \\cdot c = 0 \\Rightarrow 144 - 8c = 0 \\Rightarrow c = 18$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-12, 12);
        const c = Q.of(b * b, 4 * a);
        return numberProblem({
          prompt: t(
            `Find the value of $c$ for which the graph of $y = ${quad(a, b, 0)} + c$ meets the $x$-axis at exactly one point.`,
            `求 $c$ 的值，使 $y = ${quad(a, b, 0)} + c$ 的图象与 $x$ 轴恰有一个交点。`,
          ),
          answer: c,
          wrong: [c.neg(), Q.of(b * b, 2 * a), Q.of(b, 2 * a), Q.of(b * b, a)],
          solution: t(
            `Set the discriminant equal to $0$:${steps(`${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot c = 0`, `${b * b} ${4 * a > 0 ? "-" : "+"} ${Math.abs(4 * a)}c = 0`, `c = ${num(c)}`)}`,
            `令判别式等于 $0$：${steps(`${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot c = 0`, `${b * b} ${4 * a > 0 ? "-" : "+"} ${Math.abs(4 * a)}c = 0`, `c = ${num(c)}`)}`,
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

export const theAxisOfSymmetryOfAParabola: TopicDef = {
  id: "the-axis-of-symmetry-of-a-parabola",
  title: t("The Axis of Symmetry of a Parabola", "抛物线的对称轴"),
  summary: t(
    "Find the axis of symmetry of a parabola from its graph or with $x = -\\frac{b}{2a}$, and use it to find mirror-image points.",
    "从图象或用 $x = -\\frac{b}{2a}$ 求抛物线的对称轴，并用它求对称点。",
  ),
  prerequisites: ["graphs-of-general-quadratic-functions"],
  encompasses: [{ topic: "graphs-of-general-quadratic-functions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.A", "CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "the-axis-from-a-graph",
      title: t("The axis of symmetry from a graph", "从图象读对称轴"),
      explanation: t(
        "Every parabola is symmetric about the vertical line through its vertex, its **axis of symmetry**: folding the graph along this line makes the two halves match. If the vertex is $(h, k)$, the axis of symmetry is the line $x = h$.\n\nIn the figure the vertex is $(2, -3)$, so the axis of symmetry is $x = 2$. It is a vertical line, so its equation names an $x$-value, not the $y$-value $-3$.",
        "每条抛物线都关于经过顶点的竖直线对称，这条线叫做**对称轴**：沿它对折，两半完全重合。若顶点是 $(h, k)$，对称轴就是直线 $x = h$。\n\n图中顶点是 $(2, -3)$，所以对称轴是 $x = 2$。它是竖直线，方程给出的是 $x$ 值，而不是 $y$ 值 $-3$。",
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
        return {
          ...numberProblem({
            prompt: t("What is the equation of the axis of symmetry of the parabola shown?", "图中抛物线的对称轴方程是什么？"),
            answer: h,
            solveFor: "x",
            wrong: [k, -h],
            solution: t(
              `The vertex is $(${h}, ${k})$, so the axis of symmetry is the vertical line $x = ${h}$.`,
              `顶点是 $(${h}, ${k})$，所以对称轴是竖直线 $x = ${h}$。`,
            ),
          }),
          figure: parabolaFigure(a, h, k),
        };
      },
    },
    {
      id: "the-axis-from-the-equation",
      title: t("The formula for the axis of symmetry", "对称轴公式"),
      explanation: t(
        "The axis of symmetry of $y = ax^{2} + bx + c$ is\n\n$$x = -\\frac{b}{2a}$$\n\nFor $y = 3x^{2} + 12x - 1$: $x = -\\frac{12}{2 \\cdot 3} = -2$. Mind the sign: with $b = -10$ and $a = 2$, $x = -\\frac{-10}{4} = \\frac{5}{2}$. The axis need not pass through grid points.",
        "$y = ax^{2} + bx + c$ 的对称轴是\n\n$$x = -\\frac{b}{2a}$$\n\n对 $y = 3x^{2} + 12x - 1$：$x = -\\frac{12}{2 \\cdot 3} = -2$。注意符号：$b = -10$，$a = 2$ 时，$x = -\\frac{-10}{4} = \\frac{5}{2}$。对称轴不一定经过格点。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(-9, 9);
        const h = Q.of(-b, 2 * a);
        return numberProblem({
          prompt: t(`Find the axis of symmetry of the graph of $y = ${quad(a, b, c)}$.`, `求 $y = ${quad(a, b, c)}$ 的图象的对称轴。`),
          answer: h,
          solveFor: "x",
          wrong: [h.neg(), Q.of(-b, a), Q.of(-2 * a, b), Q.of(c)],
          solution: t(
            `Here $a = ${a}$ and $b = ${b}$:${steps(`x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${num(h)}`)}`,
            `这里 $a = ${a}$，$b = ${b}$：${steps(`x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${num(h)}`)}`,
          ),
        });
      },
    },
    {
      id: "mirror-points",
      title: t("Mirror-image points", "对称点"),
      explanation: t(
        "Two points of a parabola at the same height are mirror images across the axis of symmetry, at the same distance from it on opposite sides. If the axis is $x = 1$ and $(4, 7)$ is on the parabola, $4$ is $3$ to the right of $1$, so $(1 - 3, 7) = (-2, 7)$ is on it too. In general the mirror image of $(p, q)$ across $x = h$ is $(2h - p, q)$.\n\nThis gives a quick second point from the $y$-intercept: $(0, c)$ is mirrored to $(2h, c)$.",
        "抛物线上同一高度的两个点关于对称轴对称，它们在对称轴两侧且到对称轴的距离相等。若对称轴是 $x = 1$，$(4, 7)$ 在抛物线上，$4$ 在 $1$ 右边 $3$ 个单位，所以 $(1 - 3, 7) = (-2, 7)$ 也在抛物线上。一般地，$(p, q)$ 关于 $x = h$ 的对称点是 $(2h - p, q)$。\n\n由 $y$ 轴截距可以很快得到第二个点：$(0, c)$ 的对称点是 $(2h, c)$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const h = rng.nonZero(-6, 6);
          let p: number;
          do p = rng.int(-9, 9);
          while (p === h || p === 2 * h - p || p === -p);
          const q = rng.int(-12, 12);
          return pointProblem({
            prompt: t(
              `A parabola has axis of symmetry $x = ${h}$ and passes through $${pt(p, q)}$. Find the other point of the parabola with $y$-coordinate $${q}$.`,
              `一条抛物线的对称轴是 $x = ${h}$，且经过 $${pt(p, q)}$。求抛物线上 $y$ 坐标为 $${q}$ 的另一点。`,
            ),
            answer: [2 * h - p, q],
            wrong: [
              [-p, q],
              [p, -q],
              [h - p, q],
            ],
            solution: t(
              `The point $x = ${p}$ is $${Math.abs(p - h)}$ to the ${p > h ? "right" : "left"} of the axis, so its mirror image is $${Math.abs(p - h)}$ to the ${p > h ? "left" : "right"}: $x = ${2 * h - p}$. The point is $${pt(2 * h - p, q)}$.`,
              `$x = ${p}$ 在对称轴${p > h ? "右" : "左"}边 $${Math.abs(p - h)}$ 个单位，所以对称点在${p > h ? "左" : "右"}边 $${Math.abs(p - h)}$ 个单位：$x = ${2 * h - p}$。所求点是 $${pt(2 * h - p, q)}$。`,
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
            `The axis of symmetry is $x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${h}$. The mirror image of $(0, ${c})$ across it is $(2 \\cdot ${paren(h)}, ${c}) = ${pt(2 * h, c)}$.`,
            `对称轴是 $x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${h}$。$(0, ${c})$ 关于它的对称点是 $(2 \\cdot ${paren(h)}, ${c}) = ${pt(2 * h, c)}$。`,
          ),
        });
      },
    },
  ],
};

export const theAverageOfTheRootsFormula: TopicDef = {
  id: "the-average-of-the-roots-formula",
  title: t("The Average of the Roots Formula", "根的平均值公式"),
  summary: t(
    "Use the fact that the axis of symmetry lies halfway between the roots to find the axis, the vertex or a missing root.",
    "利用对称轴位于两个零点正中间，求对称轴、顶点或缺少的零点。",
  ),
  prerequisites: ["the-axis-of-symmetry-of-a-parabola", "roots-of-quadratic-functions"],
  encompasses: [
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.4 },
    { topic: "roots-of-quadratic-functions", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.8.A", "CCSS.HSA.APR.B.3"],
  knowledgePoints: [
    {
      id: "the-axis-from-the-roots",
      title: t("The axis of symmetry from the roots", "由零点求对称轴"),
      explanation: t(
        "The two $x$-intercepts of a parabola are at the same height, $0$, so they are mirror images across the axis of symmetry. The axis lies halfway between them, at the **average of the roots**:\n\n$$x = \\frac{r + s}{2}$$\n\nFor $y = 2(x - 5)(x + 1)$ the roots are $5$ and $-1$, so the axis is $x = \\frac{5 + (-1)}{2} = 2$.",
        "抛物线与 $x$ 轴的两个交点高度相同（都是 $0$），所以它们关于对称轴对称。对称轴位于它们正中间，即**两根的平均值**处：\n\n$$x = \\frac{r + s}{2}$$\n\n对 $y = 2(x - 5)(x + 1)$，零点是 $5$ 和 $-1$，所以对称轴是 $x = \\frac{5 + (-1)}{2} = 2$。",
      ),
      generate(rng) {
        const [r, s] = distinctRoots(rng, 9);
        const a = rng.pick([1, -1, 2, -2, 3, Q.of(1, 2), -4]);
        const h = Q.of(r + s, 2);
        const expanded = rng.bool(0.35) && toQ(a).eq(Q.one);
        const fx = expanded ? quad(1, -(r + s), r * s) : `${front(a)}${factor(r)}${factor(s)}`;
        return numberProblem({
          prompt: t(`Find the axis of symmetry of the graph of $y = ${fx}$.`, `求 $y = ${fx}$ 的图象的对称轴。`),
          answer: h,
          solveFor: "x",
          wrong: [h.neg(), Q.of(r + s), Q.of(r - s, 2)],
          solution: t(
            `${expanded ? `Factor: $y = ${factor(r)}${factor(s)}$. ` : ""}The roots are $${r}$ and $${s}$, so the axis is at their average:${steps(`x = \\frac{${r} + ${paren(s)}}{2} = ${num(h)}`)}`,
            `${expanded ? `分解因式：$y = ${factor(r)}${factor(s)}$。` : ""}零点是 $${r}$ 和 $${s}$，所以对称轴在它们的平均值处：${steps(`x = \\frac{${r} + ${paren(s)}}{2} = ${num(h)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-vertex-from-the-roots",
      title: t("The vertex from the roots", "由零点求顶点"),
      explanation: t(
        "The vertex lies on the axis of symmetry. So to find the vertex of $y = a(x - r)(x - s)$, average the roots to get its $x$-coordinate, then substitute it to get the $y$-coordinate. For $y = 2(x - 5)(x + 1)$:\n\n$$x = \\frac{5 + (-1)}{2} = 2, \\qquad y = 2(2 - 5)(2 + 1) = 2 \\cdot (-3) \\cdot 3 = -18$$\n\nThe vertex is $(2, -18)$.",
        "顶点在对称轴上。所以求 $y = a(x - r)(x - s)$ 的顶点时，先取两根的平均值得到横坐标，再代入得到纵坐标。对 $y = 2(x - 5)(x + 1)$：\n\n$$x = \\frac{5 + (-1)}{2} = 2, \\qquad y = 2(2 - 5)(2 + 1) = 2 \\cdot (-3) \\cdot 3 = -18$$\n\n顶点是 $(2, -18)$。",
      ),
      generate(rng) {
        let r: number;
        let s: number;
        do [r, s] = distinctRoots(rng, 9);
        while ((r + s) % 2 !== 0);
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const h = (r + s) / 2;
        const k = a * (h - r) * (h - s);
        return pointProblem({
          prompt: t(
            `Find the vertex of the parabola $y = ${front(a)}${factor(r)}${factor(s)}$.`,
            `求抛物线 $y = ${front(a)}${factor(r)}${factor(s)}$ 的顶点。`,
          ),
          answer: [h, k],
          wrong: [
            [h, -k],
            [-h, k],
            [h, a * r * s],
          ],
          solution: t(
            `The $x$-coordinate is the average of the roots $${r}$ and $${s}$:${steps(`x = \\frac{${r} + ${paren(s)}}{2} = ${h}`, `y = ${front(a)}(${h} ${r > 0 ? "-" : "+"} ${Math.abs(r)})(${h} ${s > 0 ? "-" : "+"} ${Math.abs(s)}) = ${k}`)}The vertex is $${pt(h, k)}$.`,
            `横坐标是零点 $${r}$ 和 $${s}$ 的平均值：${steps(`x = \\frac{${r} + ${paren(s)}}{2} = ${h}`, `y = ${front(a)}(${h} ${r > 0 ? "-" : "+"} ${Math.abs(r)})(${h} ${s > 0 ? "-" : "+"} ${Math.abs(s)}) = ${k}`)}顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "the-other-root",
      title: t("Finding the other root", "求另一个零点"),
      explanation: t(
        "If the axis of symmetry is $x = h$ and one root is $r$, the other root $s$ satisfies $\\frac{r + s}{2} = h$, so\n\n$$s = 2h - r$$\n\nWith axis $x = -1$ and root $3$: $s = 2 \\cdot (-1) - 3 = -5$. Check: $-5$ and $3$ are both $4$ from $-1$.",
        "若对称轴是 $x = h$，一个零点是 $r$，另一个零点 $s$ 满足 $\\frac{r + s}{2} = h$，所以\n\n$$s = 2h - r$$\n\n对称轴 $x = -1$，零点 $3$：$s = 2 \\cdot (-1) - 3 = -5$。检验：$-5$ 和 $3$ 到 $-1$ 的距离都是 $4$。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        let r: number;
        do r = rng.int(-10, 10);
        while (r === h);
        const s = 2 * h - r;
        return numberProblem({
          prompt: t(
            `A parabola has axis of symmetry $x = ${h}$ and crosses the $x$-axis at $(${r}, 0)$. At what other value of $x$ does it cross the $x$-axis?`,
            `一条抛物线的对称轴是 $x = ${h}$，且与 $x$ 轴交于 $(${r}, 0)$。它还在 $x$ 取何值处与 $x$ 轴相交？`,
          ),
          answer: s,
          solveFor: "x",
          wrong: [-r, h - r, r - 2 * h, 2 * h + r],
          solution: t(
            `The roots average to $${h}$:${steps(`\\frac{${r} + s}{2} = ${h}`, `s = 2 \\cdot ${paren(h)} - ${paren(r)} = ${s}`)}`,
            `两根的平均值是 $${h}$：${steps(`\\frac{${r} + s}{2} = ${h}`, `s = 2 \\cdot ${paren(h)} - ${paren(r)} = ${s}`)}`,
          ),
        });
      },
    },
  ],
};

export const theVertexFormOfAParabola: TopicDef = {
  id: "the-vertex-form-of-a-parabola",
  title: t("The Vertex Form of a Parabola", "抛物线的顶点式"),
  summary: t(
    "Read the vertex, the axis of symmetry and the extreme value from $y = a(x - h)^{2} + k$, and expand it to standard form.",
    "从 $y = a(x - h)^{2} + k$ 读出顶点、对称轴和最值，并把它展开成一般式。",
  ),
  prerequisites: ["the-axis-of-symmetry-of-a-parabola", "squaring-binomials"],
  encompasses: [
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.3 },
    { topic: "squaring-binomials", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.8.A", "CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "reading-the-vertex",
      title: t("Reading the vertex", "读出顶点"),
      explanation: t(
        "A quadratic function in **vertex form** is\n\n$$y = a(x - h)^{2} + k$$\n\nIts graph is the parabola $y = ax^{2}$ moved so that its vertex is at $(h, k)$; the axis of symmetry is $x = h$. Read $h$ with the opposite sign of the number in the parentheses: $y = 3(x + 2)^{2} - 5$ is $3(x - (-2))^{2} + (-5)$, so the vertex is $(-2, -5)$.",
        "**顶点式**的二次函数是\n\n$$y = a(x - h)^{2} + k$$\n\n它的图象是把抛物线 $y = ax^{2}$ 平移，使顶点位于 $(h, k)$；对称轴是 $x = h$。$h$ 与括号里的数符号相反：$y = 3(x + 2)^{2} - 5$ 即 $3(x - (-2))^{2} + (-5)$，所以顶点是 $(-2, -5)$。",
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        const h = rng.nonZero(-9, 9);
        const k = rng.nonZero(-12, 12);
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
            `Write it as $y = ${front(a)}(x - ${paren(h)})^{2} + ${paren(k)}$: $h = ${h}$ and $k = ${k}$, so the vertex is $${pt(h, k)}$.`,
            `把它写成 $y = ${front(a)}(x - ${paren(h)})^{2} + ${paren(k)}$：$h = ${h}$，$k = ${k}$，所以顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "maximum-and-minimum-values",
      title: t("Maximum and minimum values", "最大值与最小值"),
      explanation: t(
        "Since $(x - h)^{2} \\ge 0$, with equality only at $x = h$:\n\n- if $a > 0$, $y \\ge k$: the function has a **minimum value** $k$, at $x = h$;\n- if $a < 0$, $y \\le k$: the function has a **maximum value** $k$, at $x = h$.\n\nFor $f(x) = -2(x - 3)^{2} + 7$ the maximum value is $7$, reached at $x = 3$. The extreme value is $k$, a $y$-value; $h$ only tells where it occurs.",
        "因为 $(x - h)^{2} \\ge 0$，且只在 $x = h$ 时取等号：\n\n- 若 $a > 0$，$y \\ge k$：函数有**最小值** $k$，在 $x = h$ 处取得；\n- 若 $a < 0$，$y \\le k$：函数有**最大值** $k$，在 $x = h$ 处取得。\n\n对 $f(x) = -2(x - 3)^{2} + 7$，最大值是 $7$，在 $x = 3$ 处取得。最值是 $k$，是一个 $y$ 值；$h$ 只说明在哪里取得。",
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
        return choiceProblem({
          prompt: t(
            `Which describes the function $f(x) = ${vertexForm(a, h, k)}$?`,
            `关于函数 $f(x) = ${vertexForm(a, h, k)}$，下列哪项正确？`,
          ),
          options: shown.map((i) => options[i]!),
          correct: shown.indexOf(up ? 0 : 1),
          solution: t(
            `Here $a = ${num(a)}$ is ${up ? "positive, so the parabola opens upward" : "negative, so the parabola opens downward"} and the vertex $${pt(h, k)}$ is its ${up ? "lowest" : "highest"} point. The ${up ? "minimum" : "maximum"} value is $${k}$, at $x = ${h}$.`,
            `这里 $a = ${num(a)}$ 是${up ? "正数，抛物线开口向上" : "负数，抛物线开口向下"}，顶点 $${pt(h, k)}$ 是最${up ? "低" : "高"}点。${up ? "最小值" : "最大值"}是 $${k}$，在 $x = ${h}$ 处取得。`,
          ),
        });
      },
    },
    {
      id: "expanding-vertex-form",
      title: t("From vertex form to standard form", "由顶点式化为一般式"),
      explanation: t(
        "To write $y = a(x - h)^{2} + k$ in standard form, square the binomial, distribute $a$, and add $k$:\n\n$$y = 2(x - 3)^{2} + 1 = 2(x^{2} - 6x + 9) + 1 = 2x^{2} - 12x + 18 + 1 = 2x^{2} - 12x + 19$$\n\nMultiply every term of the square by $a$, including the constant $9$.",
        "要把 $y = a(x - h)^{2} + k$ 写成一般式，先把二项式平方，再乘以 $a$，最后加上 $k$：\n\n$$y = 2(x - 3)^{2} + 1 = 2(x^{2} - 6x + 9) + 1 = 2x^{2} - 12x + 18 + 1 = 2x^{2} - 12x + 19$$\n\n平方展开后的每一项都要乘以 $a$，包括常数 $9$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const h = rng.nonZero(-7, 7);
        const k = rng.int(-12, 12);
        const b = -2 * a * h;
        const c = a * h * h + k;
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
            `Square, distribute and combine:${steps(`y = ${front(a)}(${quad(1, -2 * h, h * h)})${tail(k)}`, `y = ${quad(a, b, a * h * h)}${tail(k)}`, `y = ${quad(a, b, c)}`)}`,
            `平方、分配、合并：${steps(`y = ${front(a)}(${quad(1, -2 * h, h * h)})${tail(k)}`, `y = ${quad(a, b, a * h * h)}${tail(k)}`, `y = ${quad(a, b, c)}`)}`,
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
  encompasses: [
    { topic: "completing-the-square-with-leading-coefficients", weight: 0.5 },
    { topic: "the-vertex-form-of-a-parabola", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.8.A"],
  knowledgePoints: [
    {
      id: "completing-the-square",
      title: t("Completing the square", "配方"),
      explanation: t(
        "To write $y = x^{2} + bx + c$ in vertex form, add and subtract $\\left(\\frac{b}{2}\\right)^{2}$ to make a perfect square:\n\n$$y = x^{2} - 6x + 11 = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$\n\nSo $h = 3$, $k = 2$, and the vertex is $(3, 2)$. Half of $b = -6$ is $-3$, which gives $(x - 3)^{2}$.",
        "要把 $y = x^{2} + bx + c$ 写成顶点式，加上再减去 $\\left(\\frac{b}{2}\\right)^{2}$，凑成完全平方：\n\n$$y = x^{2} - 6x + 11 = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$\n\n所以 $h = 3$，$k = 2$，顶点是 $(3, 2)$。$b = -6$ 的一半是 $-3$，得到 $(x - 3)^{2}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-12, 12);
        const b = -2 * h;
        const c = h * h + k;
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
            `Half of $${b}$ is $${-h}$, and $${paren(-h)}^{2} = ${h * h}$:${steps(`y = (${quad(1, b, h * h)}) - ${h * h}${tail(c)}`, `y = ${vertexForm(1, h, k)}`)}So $h = ${h}$ and $k = ${k}$.`,
            `$${b}$ 的一半是 $${-h}$，$${paren(-h)}^{2} = ${h * h}$：${steps(`y = (${quad(1, b, h * h)}) - ${h * h}${tail(c)}`, `y = ${vertexForm(1, h, k)}`)}所以 $h = ${h}$，$k = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("With a leading coefficient", "二次项系数不为 1"),
      explanation: t(
        "When $a \\ne 1$, factor $a$ out of the $x$-terms first, complete the square inside, and multiply the subtracted square by $a$ when taking it out:\n\n$$y = 2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9) - 2 \\cdot 9 + 5 = 2(x + 3)^{2} - 13$$\n\nThe vertex is $(-3, -13)$. Forgetting the factor $2$ in $2 \\cdot 9$ is the usual slip.",
        "当 $a \\ne 1$ 时，先从含 $x$ 的项中提出 $a$，在括号内配方，把减去的平方移出括号时要乘以 $a$：\n\n$$y = 2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9) - 2 \\cdot 9 + 5 = 2(x + 3)^{2} - 13$$\n\n顶点是 $(-3, -13)$。常见的错误是漏掉 $2 \\cdot 9$ 中的因数 $2$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-12, 12);
        const b = -2 * a * h;
        const c = a * h * h + k;
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
            `Factor $${a}$ out of the $x$-terms and complete the square:${steps(`y = ${front(a)}(${quad(1, -2 * h, 0)})${tail(c)}`, `y = ${front(a)}(${quad(1, -2 * h, h * h)}) - ${paren(a)} \\cdot ${h * h}${tail(c)}`, `y = ${vertexForm(a, h, k)}`)}So $h = ${h}$ and $k = ${k}$.`,
            `从含 $x$ 的项中提出 $${a}$ 并配方：${steps(`y = ${front(a)}(${quad(1, -2 * h, 0)})${tail(c)}`, `y = ${front(a)}(${quad(1, -2 * h, h * h)}) - ${paren(a)} \\cdot ${h * h}${tail(c)}`, `y = ${vertexForm(a, h, k)}`)}所以 $h = ${h}$，$k = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "from-the-vertex-and-a-point",
      title: t("From the vertex and a point", "由顶点和一点求方程"),
      explanation: t(
        "If a parabola has vertex $(h, k)$, its equation is $y = a(x - h)^{2} + k$ for some $a$. Substitute another point of the parabola to find $a$. With vertex $(1, -4)$ and the point $(3, 4)$:\n\n$$4 = a(3 - 1)^{2} - 4 \\Rightarrow 8 = 4a \\Rightarrow a = 2$$\n\nso $y = 2(x - 1)^{2} - 4$. Do not forget to move $k$ before dividing.",
        "若抛物线的顶点是 $(h, k)$，它的方程就是 $y = a(x - h)^{2} + k$，$a$ 待定。代入抛物线上的另一点求 $a$。顶点 $(1, -4)$，经过点 $(3, 4)$：\n\n$$4 = a(3 - 1)^{2} - 4 \\Rightarrow 8 = 4a \\Rightarrow a = 2$$\n\n所以 $y = 2(x - 1)^{2} - 4$。除以系数之前别忘了先移项 $k$。",
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
        const work = steps(
          `${num(q)} = a(${p} - ${paren(h)})^{2}${tail(k)}`,
          `${num(q.sub(Q.of(k)))} = ${d * d === 1 ? "" : d * d}a`,
          `a = ${num(a)}`,
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
            `${graph ? `The vertex is $${pt(h, k)}$ and the other point is $${pt(p, q)}$. ` : ""}Substitute the point into $y = a(x - ${paren(h)})^{2}${tail(k)}$:${work}So $y = ${answer}$.`,
            `${graph ? `顶点是 $${pt(h, k)}$，另一点是 $${pt(p, q)}$。` : ""}把点代入 $y = a(x - ${paren(h)})^{2}${tail(k)}$：${work}所以 $y = ${answer}$。`,
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
    { topic: "the-vertex-form-of-a-parabola", weight: 0.3 },
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.3 },
    { topic: "domain-of-a-function", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  knowledgePoints: [
    {
      id: "from-a-graph",
      title: t("Domain and range from a graph", "从图象求定义域和值域"),
      explanation: t(
        "Every real number can be squared, so the **domain** of a quadratic function is all real numbers, $\\mathbb{R}$. The **range** depends on the vertex $(h, k)$:\n\n- opening upward, the outputs are $k$ and everything above: the range is $[k, \\infty)$;\n- opening downward, the range is $(-\\infty, k]$.\n\nThe bracket at $k$ is closed, because the vertex is on the graph.",
        "每个实数都可以平方，所以二次函数的**定义域**是全体实数 $\\mathbb{R}$。**值域**取决于顶点 $(h, k)$：\n\n- 开口向上时，输出是 $k$ 及其上方所有的数：值域是 $[k, \\infty)$；\n- 开口向下时，值域是 $(-\\infty, k]$。\n\n$k$ 处用闭括号，因为顶点在图象上。",
      ),
      generate(rng) {
        let v: { a: Q; h: number; k: number };
        do v = drawVertex(rng);
        while (v.h === v.k);
        const { a, h, k } = v;
        const up = a.sign() > 0;
        const set = ray(k, up);
        return {
          ...intervalProblem({
            prompt: t("Find the range of the quadratic function whose graph is shown.", "求图中二次函数的值域。"),
            set,
            wrong: [ray(k, !up), ray(k, up, false), realLine, ray(h, up)],
            solution: t(
              `The parabola opens ${up ? "upward" : "downward"} from its vertex $${pt(h, k)}$, so the outputs are $${k}$ and every number ${up ? "above" : "below"} it: the range is $${intervalLatex(set)}$.`,
              `抛物线从顶点 $${pt(h, k)}$ 开口向${up ? "上" : "下"}，所以输出是 $${k}$ 及所有${up ? "大于" : "小于"}它的数：值域是 $${intervalLatex(set)}$。`,
            ),
          }),
          figure: parabolaFigure(a, h, k),
        };
      },
    },
    {
      id: "from-vertex-form",
      title: t("Domain and range from vertex form", "由顶点式求定义域和值域"),
      explanation: t(
        "In $f(x) = a(x - h)^{2} + k$ the vertex is $(h, k)$ and the sign of $a$ gives the direction. For $f(x) = -3(x + 1)^{2} + 4$: the parabola opens downward from $(-1, 4)$, so the range is $(-\\infty, 4]$. The domain is $\\mathbb{R}$, as for every quadratic function.",
        "在 $f(x) = a(x - h)^{2} + k$ 中，顶点是 $(h, k)$，$a$ 的符号决定开口方向。对 $f(x) = -3(x + 1)^{2} + 4$：抛物线从 $(-1, 4)$ 开口向下，所以值域是 $(-\\infty, 4]$。与所有二次函数一样，定义域是 $\\mathbb{R}$。",
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        const h = rng.nonZero(-9, 9);
        let k: number;
        do k = rng.int(-12, 12);
        while (k === h || k === -h);
        const up = a.sign() > 0;
        if (rng.bool(0.2)) {
          return intervalProblem({
            prompt: t(`Find the domain of $f(x) = ${vertexForm(a, h, k)}$.`, `求 $f(x) = ${vertexForm(a, h, k)}$ 的定义域。`),
            set: realLine,
            wrong: [ray(k, up), ray(h, up)],
            solution: t(
              "Any real number can be substituted for $x$, so the domain is $\\mathbb{R}$.",
              "$x$ 可以取任何实数，所以定义域是 $\\mathbb{R}$。",
            ),
          });
        }
        const set = ray(k, up);
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${vertexForm(a, h, k)}$.`, `求 $f(x) = ${vertexForm(a, h, k)}$ 的值域。`),
          set,
          wrong: [ray(k, !up), ray(-k, up), ray(h, up), ray(-h, up), realLine],
          solution: t(
            `The vertex is $${pt(h, k)}$ and $a = ${num(a)}$ is ${up ? "positive" : "negative"}, so $f$ has ${up ? "minimum" : "maximum"} value $${k}$. The range is $${intervalLatex(set)}$.`,
            `顶点是 $${pt(h, k)}$，$a = ${num(a)}$ 是${up ? "正" : "负"}数，所以 $f$ 的${up ? "最小" : "最大"}值是 $${k}$。值域是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
    {
      id: "from-standard-form",
      title: t("Range from standard form", "由一般式求值域"),
      explanation: t(
        "For $f(x) = ax^{2} + bx + c$, find the vertex first: its $x$-coordinate is $-\\frac{b}{2a}$, and its $y$-coordinate is the value of $f$ there. For $f(x) = 2x^{2} - 8x + 3$:\n\n$$x = -\\frac{-8}{4} = 2, \\qquad f(2) = 8 - 16 + 3 = -5$$\n\nThe parabola opens upward, so the range is $[-5, \\infty)$. The $y$-intercept $3$ is not the minimum.",
        "对 $f(x) = ax^{2} + bx + c$，先求顶点：横坐标是 $-\\frac{b}{2a}$，纵坐标是 $f$ 在该处的值。对 $f(x) = 2x^{2} - 8x + 3$：\n\n$$x = -\\frac{-8}{4} = 2, \\qquad f(2) = 8 - 16 + 3 = -5$$\n\n抛物线开口向上，所以值域是 $[-5, \\infty)$。$y$ 轴截距 $3$ 不是最小值。",
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
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${quad(a, b, c)}$.`, `求 $f(x) = ${quad(a, b, c)}$ 的值域。`),
          set,
          wrong: [ray(c, up), ray(k, !up), ray(h, up), realLine],
          solution: t(
            `The vertex is at $x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${h}$, and${steps(`f(${h}) = ${plugIn(a, b, c, h)} = ${k}`)}The parabola opens ${up ? "upward" : "downward"}, so the range is $${intervalLatex(set)}$.`,
            `顶点横坐标 $x = -\\frac{${b}}{2 \\cdot ${paren(a)}} = ${h}$，且${steps(`f(${h}) = ${plugIn(a, b, c, h)} = ${k}`)}抛物线开口向${up ? "上" : "下"}，所以值域是 $${intervalLatex(set)}$。`,
          ),
        });
      },
    },
  ],
};

// Module: intersections.

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
  knowledgePoints: [
    {
      id: "substituting-into-the-quadratic",
      title: t("Substituting into the quadratic", "代入二次方程"),
      explanation: t(
        "A system such as\n\n$$y = x^{2} - 3x + 1, \\qquad y = x - 2$$\n\nis **nonlinear** because one equation is not linear. Substitute the expression for $y$ and solve the quadratic equation:\n\n$$x^{2} - 3x + 1 = x - 2 \\Rightarrow x^{2} - 4x + 3 = 0 \\Rightarrow (x - 1)(x - 3) = 0$$\n\nso $x = 1$ or $x = 3$. A nonlinear system can have more than one solution.",
        "像\n\n$$y = x^{2} - 3x + 1, \\qquad y = x - 2$$\n\n这样的方程组是**非线性**的，因为有一个方程不是一次方程。代入 $y$ 的表达式，解所得的一元二次方程：\n\n$$x^{2} - 3x + 1 = x - 2 \\Rightarrow x^{2} - 4x + 3 = 0 \\Rightarrow (x - 1)(x - 3) = 0$$\n\n所以 $x = 1$ 或 $x = 3$。非线性方程组可以有不止一个解。",
      ),
      generate(rng) {
        const [r, s] = distinctRoots(rng, 7);
        const m = rng.nonZero(-5, 5);
        const n = rng.int(-9, 9);
        const b = m - (r + s);
        const c = n + r * s;
        const standard = rng.bool(0.3) && m === -1;
        const line = standard ? `x + y = ${n}` : `y = ${linear(m, n)}`;
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of all solutions of the system $y = ${quad(1, b, c)}$, $${line}$.`,
            `求方程组 $y = ${quad(1, b, c)}$，$${line}$ 所有解的 $x$ 坐标。`,
          ),
          values: [String(r), String(s)],
          wrong: [[String(-r), String(-s)], [String(r)], [String(s)]],
          solution: t(
            `${standard ? `The line is $y = ${linear(m, n)}$. ` : ""}Set the two expressions for $y$ equal:${steps(`${quad(1, b, c)} = ${linear(m, n)}`, `${quad(1, -(r + s), r * s)} = 0`, `${factor(r)}${factor(s)} = 0`)}So $x = ${r}$ or $x = ${s}$.`,
            `${standard ? `直线即 $y = ${linear(m, n)}$。` : ""}令 $y$ 的两个表达式相等：${steps(`${quad(1, b, c)} = ${linear(m, n)}`, `${quad(1, -(r + s), r * s)} = 0`, `${factor(r)}${factor(s)} = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-solutions",
      title: t("Finding the solutions as ordered pairs", "求出有序数对形式的解"),
      explanation: t(
        "A solution of a system is an ordered pair $(x, y)$. After finding the $x$-values, substitute each into the **linear** equation, which is easier, to get its $y$. In the system above, $y = x - 2$ gives\n\n$$x = 1: y = -1, \\qquad x = 3: y = 1$$\n\nThe solutions are $(1, -1)$ and $(3, 1)$.",
        "方程组的解是有序数对 $(x, y)$。求出 $x$ 值后，把每个值代入较简单的**一次**方程求 $y$。上面的方程组中，由 $y = x - 2$ 得\n\n$$x = 1: y = -1, \\qquad x = 3: y = 1$$\n\n解是 $(1, -1)$ 和 $(3, 1)$。",
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
            `Set the expressions equal:${steps(`${quad(a, b, c)} = ${linear(m, n)}`, `${front(a)}${factor(r)}${factor(s)} = 0`)}so $x = ${r}$ or $x = ${s}$. The ${larger ? "larger" : "smaller"} is $x = ${x}$, and $y = ${linear(m, n).replace(/x/g, `(${x})`)} = ${y}$. The solution is $${pt(x, y)}$.`,
            `令两个表达式相等：${steps(`${quad(a, b, c)} = ${linear(m, n)}`, `${front(a)}${factor(r)}${factor(s)} = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。较${larger ? "大" : "小"}的是 $x = ${x}$，$y = ${linear(m, n).replace(/x/g, `(${x})`)} = ${y}$。解是 $${pt(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "two-parabolas",
      title: t("Two quadratic equations", "两个二次方程"),
      explanation: t(
        "When both equations are quadratic, setting them equal can cancel the $x^{2}$ terms and leave a linear equation:\n\n$$x^{2} + 3x - 2 = x^{2} - x + 6 \\Rightarrow 4x = 8 \\Rightarrow x = 2$$\n\nThen $y = 2^{2} + 3 \\cdot 2 - 2 = 8$, and the only solution is $(2, 8)$.",
        "当两个方程都是二次方程时，令它们相等可能使 $x^{2}$ 项抵消，只剩一次方程：\n\n$$x^{2} + 3x - 2 = x^{2} - x + 6 \\Rightarrow 4x = 8 \\Rightarrow x = 2$$\n\n于是 $y = 2^{2} + 3 \\cdot 2 - 2 = 8$，唯一的解是 $(2, 8)$。",
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
            `Set the expressions equal; the $x^{2}$ terms cancel:${steps(`${quad(a, b1, c1)} = ${quad(a, b2, c2)}`, `${linear(b1 - b2, 0)} = ${c2 - c1}`, `x = ${x0}`)}Then${steps(`y = ${plugIn(a, b1, c1, x0)} = ${y0}`)}The solution is $${pt(x0, y0)}$.`,
            `令两个表达式相等，$x^{2}$ 项抵消：${steps(`${quad(a, b1, c1)} = ${quad(a, b2, c2)}`, `${linear(b1 - b2, 0)} = ${c2 - c1}`, `x = ${x0}`)}于是${steps(`y = ${plugIn(a, b1, c1, x0)} = ${y0}`)}解是 $${pt(x0, y0)}$。`,
          ),
        });
      },
    },
  ],
};

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
    { topic: "the-discriminant-of-a-quadratic-function", weight: 0.4 },
    { topic: "quadratic-equations-with-one-real-solution", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.7", "CCSS.HSA.REI.D.11"],
  knowledgePoints: [
    {
      id: "intersection-points",
      title: t("Intersection points", "交点"),
      explanation: t(
        "The points where a line meets a parabola are the solutions of the system of their equations. In the figure, the line $y = x + 1$ meets $y = x^{2} - 1$ where\n\n$$x^{2} - 1 = x + 1 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$\n\nAt $x = 2$, $y = 3$; at $x = -1$, $y = 0$. The intersection points are $(2, 3)$ and $(-1, 0)$.",
        "直线与抛物线的交点就是它们的方程组成的方程组的解。图中直线 $y = x + 1$ 与 $y = x^{2} - 1$ 相交于\n\n$$x^{2} - 1 = x + 1 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$\n\n$x = 2$ 时 $y = 3$；$x = -1$ 时 $y = 0$。交点是 $(2, 3)$ 和 $(-1, 0)$。",
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
        const lineText = m === 0 ? `y = ${n}` : `y = ${linear(m, n)}`;
        const problem = pointProblem({
          prompt: t(
            `The line $${lineText}$ meets the parabola $y = ${quad(a, b, c)}$ at two points. Find the intersection point that is farther to the ${askLeft ? "left" : "right"}.`,
            `直线 $${lineText}$ 与抛物线 $y = ${quad(a, b, c)}$ 交于两点。求较${askLeft ? "左" : "右"}边的交点。`,
          ),
          answer: [x, m * x + n],
          wrong: [
            [other, m * other + n],
            [x, a * x * x],
            [-x, m * x + n],
          ],
          solution: t(
            `Set the expressions equal:${steps(`${quad(a, b, c)} = ${linear(m, n)}`, `${front(a)}${factor(r)}${factor(s)} = 0`)}so $x = ${r}$ or $x = ${s}$. The ${askLeft ? "smaller" : "larger"} is $x = ${x}$, and on the line $y = ${m * x + n}$. The point is $${pt(x, m * x + n)}$.`,
            `令两个表达式相等：${steps(`${quad(a, b, c)} = ${linear(m, n)}`, `${front(a)}${factor(r)}${factor(s)} = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。较${askLeft ? "小" : "大"}的是 $x = ${x}$，在直线上 $y = ${m * x + n}$。交点是 $${pt(x, m * x + n)}$。`,
          ),
        });
        return problem;
      },
    },
    {
      id: "counting-intersections",
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        "Setting the equations of a line and a parabola equal and moving everything to one side gives a quadratic equation; its discriminant counts the intersection points. For $y = x^{2} + 1$ and $y = 2x - 3$:\n\n$$x^{2} + 1 = 2x - 3 \\Rightarrow x^{2} - 2x + 4 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 4 = -12 < 0$$\n\nso the line misses the parabola. A discriminant of $0$ means the line touches the parabola at one point: it is **tangent** to it.",
        "令直线与抛物线的方程相等，并把所有项移到一边，得到一元二次方程；它的判别式决定交点个数。对 $y = x^{2} + 1$ 和 $y = 2x - 3$：\n\n$$x^{2} + 1 = 2x - 3 \\Rightarrow x^{2} - 2x + 4 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 4 = -12 < 0$$\n\n所以直线与抛物线不相交。判别式为 $0$ 表示直线与抛物线只有一个公共点：它与抛物线**相切**。",
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
        return choiceProblem({
          prompt: t(
            `How many points do the line $${lineText}$ and the parabola $y = ${quad(a, b, c)}$ have in common?`,
            `直线 $${lineText}$ 与抛物线 $y = ${quad(a, b, c)}$ 有几个公共点？`,
          ),
          options,
          correct: sign + 1,
          solution: t(
            `Set the expressions equal and move everything to one side:${steps(`${quad(a, B, C)} = 0`, discriminantSteps(a, B, C))}The discriminant is ${d > 0 ? "positive: two points" : d === 0 ? "zero: exactly one point, where the line is tangent" : "negative: no common points"}.`,
            `令两个表达式相等并把所有项移到一边：${steps(`${quad(a, B, C)} = 0`, discriminantSteps(a, B, C))}判别式${d > 0 ? "为正：有两个公共点" : d === 0 ? "为零：恰有一个公共点，直线与抛物线相切" : "为负：没有公共点"}。`,
          ),
        });
      },
    },
    {
      id: "tangent-lines",
      title: t("Tangent lines", "切线"),
      explanation: t(
        "To find the constant $k$ for which the line $y = mx + k$ is tangent to a parabola, set the equations equal, collect terms, and make the discriminant $0$. For $y = x^{2} + 2x + 3$ and $y = 4x + k$:\n\n$$x^{2} - 2x + (3 - k) = 0, \\qquad (-2)^{2} - 4(3 - k) = 0 \\Rightarrow 4k - 8 = 0 \\Rightarrow k = 2$$",
        "要求使直线 $y = mx + k$ 与抛物线相切的常数 $k$，先令两个方程相等并整理，再令判别式为 $0$。对 $y = x^{2} + 2x + 3$ 和 $y = 4x + k$：\n\n$$x^{2} - 2x + (3 - k) = 0, \\qquad (-2)^{2} - 4(3 - k) = 0 \\Rightarrow 4k - 8 = 0 \\Rightarrow k = 2$$",
      ),
      generate(rng) {
        const b = rng.int(-8, 8);
        const c = rng.int(-9, 9);
        let m: number;
        do m = rng.int(-6, 6);
        while (m === b);
        const e = b - m;
        const k = Q.of(c).sub(Q.of(e * e, 4));
        return numberProblem({
          prompt: t(
            `Find the value of $k$ for which the line $y = ${m === 0 ? "" : `${front(m)}x + `}k$ is tangent to the parabola $y = ${quad(1, b, c)}$.`,
            `求 $k$ 的值，使直线 $y = ${m === 0 ? "" : `${front(m)}x + `}k$ 与抛物线 $y = ${quad(1, b, c)}$ 相切。`,
          ),
          answer: k,
          wrong: [Q.of(c).add(Q.of(e * e, 4)), Q.of(e * e, 4), Q.of(c).sub(Q.of(e * e, 2)), Q.of(c - e)],
          solution: t(
            `Set the expressions equal and collect terms:${steps(`${quad(1, e, 0)} + (${c} - k) = 0`)}It is tangent when the discriminant is $0$:${steps(`${paren(e)}^{2} - 4(${c} - k) = 0`, `k = ${c} - \\frac{${e * e}}{4} = ${num(k)}`)}`,
            `令两个表达式相等并整理：${steps(`${quad(1, e, 0)} + (${c} - k) = 0`)}相切时判别式为 $0$：${steps(`${paren(e)}^{2} - 4(${c} - k) = 0`, `k = ${c} - \\frac{${e * e}}{4} = ${num(k)}`)}`,
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
    { topic: "graphs-of-general-quadratic-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "height-of-a-dropped-object",
      title: t("The height of a dropped object", "下落物体的高度"),
      explanation: t(
        "An object dropped from a height $h_{0}$ falls faster and faster. Ignoring air resistance, its height $t$ seconds later is\n\n$$h = -16t^{2} + h_{0} \\text{ (feet)} \\qquad \\text{or} \\qquad h = -5t^{2} + h_{0} \\text{ (meters)}$$\n\nwhere $-5$ rounds $-4.9$. Dropped from $200$ feet, after $3$ seconds it is at $h = -16 \\cdot 3^{2} + 200 = -144 + 200 = 56$ feet. The graph against $t$ is half of a downward parabola with vertex $(0, h_{0})$.",
        "从高度 $h_{0}$ 处落下的物体越落越快。忽略空气阻力，$t$ 秒后它的高度是\n\n$$h = -16t^{2} + h_{0}\\text{（英尺）} \\qquad \\text{或} \\qquad h = -5t^{2} + h_{0}\\text{（米）}$$\n\n其中 $-5$ 是 $-4.9$ 的近似。从 $200$ 英尺高处落下，$3$ 秒后高度是 $h = -16 \\cdot 3^{2} + 200 = -144 + 200 = 56$ 英尺。以 $t$ 为横轴，它的图象是顶点为 $(0, h_{0})$、开口向下的抛物线的一半。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const time = rng.int(1, 6);
        const fall = u.g * time * time;
        const h0 = fall + rng.int(1, 40) * (u === feet ? 5 : 2);
        const obj = rng.pick(motionObjects);
        const h = h0 - fall;
        return numberProblem({
          prompt: t(
            `${obj.en} is dropped from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = -${u.g}t^{2} + ${h0}$ ${u.en}. How high is it after $${time}$ seconds?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处落下，$t$ 秒后它的高度是 $h = -${u.g}t^{2} + ${h0}$ ${u.zh}。$${time}$ 秒后它有多高？`,
          ),
          answer: h,
          unit: u.unit,
          wrong: [h0 - u.g * time, h0 + fall, fall, h0 - (u.g * time) ** 2],
          solution: t(
            `Substitute $t = ${time}$:${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${fall} + ${h0} = ${h}`)}It is $${h}$ ${u.en} high.`,
            `代入 $t = ${time}$：${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${fall} + ${h0} = ${h}`)}高度是 $${h}$ ${u.zh}。`,
          ),
        });
      },
    },
    {
      id: "time-to-fall",
      title: t("How long it takes to fall", "下落所用的时间"),
      explanation: t(
        "To find when a dropped object reaches a height, set $h$ equal to that height and solve by taking square roots. It lands when $h = 0$: dropped from $144$ feet,\n\n$$-16t^{2} + 144 = 0 \\Rightarrow t^{2} = 9 \\Rightarrow t = \\pm 3$$\n\nTime after the drop is positive, so it lands after $3$ seconds.",
        "要求下落物体何时到达某一高度，令 $h$ 等于该高度，再用开平方法求解。落地时 $h = 0$：从 $144$ 英尺高处落下，\n\n$$-16t^{2} + 144 = 0 \\Rightarrow t^{2} = 9 \\Rightarrow t = \\pm 3$$\n\n落下后的时间是正数，所以 $3$ 秒后落地。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const time = rng.int(1, 8);
        const ground = rng.bool(0.6);
        const level = ground ? 0 : rng.int(1, 30) * (u === feet ? 4 : 5);
        const h0 = u.g * time * time + level;
        const obj = rng.pick(motionObjects);
        const target = ground ? t("hit the ground", "落地") : t(`reach a height of $${level}$ ${u.en}`, `到达 $${level}$ ${u.zh}的高度`);
        return numberProblem({
          prompt: t(
            `${obj.en} is dropped from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = -${u.g}t^{2} + ${h0}$ ${u.en}. After how many seconds does it ${target.en}?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处落下，$t$ 秒后它的高度是 $h = -${u.g}t^{2} + ${h0}$ ${u.zh}。它在多少秒后${target["zh-CN"]}？`,
          ),
          answer: time,
          unit: "s",
          wrong: [time * time, -time, Q.of(h0, u.g), Q.of(h0 - level, 2 * u.g)],
          solution: t(
            `Set $h = ${level}$:${steps(`-${u.g}t^{2} + ${h0} = ${level}`, `t^{2} = \\frac{${h0 - level}}{${u.g}} = ${time * time}`, `t = \\pm ${time}`)}Time is positive, so $t = ${time}$ seconds.`,
            `令 $h = ${level}$：${steps(`-${u.g}t^{2} + ${h0} = ${level}`, `t^{2} = \\frac{${h0 - level}}{${u.g}} = ${time * time}`, `t = \\pm ${time}`)}时间是正数，所以 $t = ${time}$ 秒。`,
          ),
        });
      },
    },
    {
      id: "thrown-downward",
      title: t("Objects thrown downward", "向下抛出的物体"),
      explanation: t(
        "An object thrown **downward** with speed $v$ starts out moving down, so the model has a term $-vt$:\n\n$$h = -16t^{2} - vt + h_{0}$$\n\nThrown down at $32$ feet per second from $240$ feet, it lands when\n\n$$-16t^{2} - 32t + 240 = 0 \\Rightarrow -16(t^{2} + 2t - 15) = 0 \\Rightarrow -16(t + 5)(t - 3) = 0$$\n\nso after $3$ seconds; $t = -5$ is rejected.",
        "以速度 $v$ **向下**抛出的物体一开始就向下运动，所以模型中有一项 $-vt$：\n\n$$h = -16t^{2} - vt + h_{0}$$\n\n从 $240$ 英尺高处以每秒 $32$ 英尺的速度向下抛出，落地时\n\n$$-16t^{2} - 32t + 240 = 0 \\Rightarrow -16(t^{2} + 2t - 15) = 0 \\Rightarrow -16(t + 5)(t - 3) = 0$$\n\n所以 $3$ 秒后落地；舍去 $t = -5$。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const land = rng.int(1, 6);
        const s = rng.int(land + 1, land + 6);
        const v = u.g * (s - land);
        const h0 = u.g * land * s;
        const obj = rng.pick(motionObjects);
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown downward at $${v}$ ${u.en} per second from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = ${quad(-u.g, -v, h0, "t")}$ ${u.en}. After how many seconds does it hit the ground?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处以每秒 $${v}$ ${u.zh}的速度向下抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, -v, h0, "t")}$ ${u.zh}。它在多少秒后落地？`,
          ),
          answer: land,
          unit: "s",
          wrong: [s, -s, s - land],
          solution: t(
            `It hits the ground when $h = 0$:${steps(`${quad(-u.g, -v, h0, "t")} = 0`, `-${u.g}(${quad(1, s - land, -land * s, "t")}) = 0`, `-${u.g}(t + ${s})(t - ${land}) = 0`)}So $t = ${land}$ or $t = -${s}$. Time is positive, so it lands after $${land}$ seconds.`,
            `落地时 $h = 0$：${steps(`${quad(-u.g, -v, h0, "t")} = 0`, `-${u.g}(${quad(1, s - land, -land * s, "t")}) = 0`, `-${u.g}(t + ${s})(t - ${land}) = 0`)}所以 $t = ${land}$ 或 $t = -${s}$。时间是正数，所以 $${land}$ 秒后落地。`,
          ),
        });
      },
    },
  ],
};

export const modelingUpwardsVerticalMotion: TopicDef = {
  id: "modeling-upwards-vertical-motion",
  title: t("Modeling Upwards Vertical Motion", "向上竖直运动的建模"),
  summary: t(
    "Find the maximum height of an object thrown upward, when it reaches it, when it is at a given height and when it lands.",
    "求向上抛出的物体的最大高度、到达最大高度的时间、位于某一高度的时间和落地时间。",
  ),
  prerequisites: ["modeling-downwards-vertical-motion", "the-axis-of-symmetry-of-a-parabola"],
  encompasses: [
    { topic: "modeling-downwards-vertical-motion", weight: 0.4 },
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.4 },
    { topic: "modeling-with-quadratic-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "time-to-the-maximum-height",
      title: t("When it reaches its maximum height", "何时到达最大高度"),
      explanation: t(
        "An object thrown **upward** with speed $v$ from height $h_{0}$ has height\n\n$$h = -16t^{2} + vt + h_{0}$$\n\nThe graph is a downward parabola, so the object is highest at the vertex, on the axis of symmetry $t = -\\frac{b}{2a}$. For $h = -16t^{2} + 48t + 6$: $t = -\\frac{48}{2 \\cdot (-16)} = 1.5$ seconds.",
        "以速度 $v$ 从高度 $h_{0}$ 处**向上**抛出的物体，高度为\n\n$$h = -16t^{2} + vt + h_{0}$$\n\n图象是开口向下的抛物线，所以物体在顶点处最高，即对称轴 $t = -\\frac{b}{2a}$ 处。对 $h = -16t^{2} + 48t + 6$：$t = -\\frac{48}{2 \\cdot (-16)} = 1.5$ 秒。",
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
            `The maximum is at the vertex:${steps(`t = -\\frac{${v}}{2 \\cdot (-${u.g})} = ${num(peak)}`)}It is highest after $${num(peak)}$ seconds.`,
            `最大值在顶点处取得：${steps(`t = -\\frac{${v}}{2 \\cdot (-${u.g})} = ${num(peak)}`)}$${num(peak)}$ 秒后最高。`,
          ),
        });
      },
    },
    {
      id: "the-maximum-height",
      title: t("The maximum height", "最大高度"),
      explanation: t(
        "The maximum height is the $h$-coordinate of the vertex: find the time of the vertex, then substitute it. For $h = -16t^{2} + 64t + 5$:\n\n$$t = -\\frac{64}{-32} = 2, \\qquad h = -16 \\cdot 2^{2} + 64 \\cdot 2 + 5 = -64 + 128 + 5 = 69$$\n\nThe maximum height is $69$ feet, reached after $2$ seconds.",
        "最大高度是顶点的 $h$ 坐标：先求顶点对应的时间，再代入。对 $h = -16t^{2} + 64t + 5$：\n\n$$t = -\\frac{64}{-32} = 2, \\qquad h = -16 \\cdot 2^{2} + 64 \\cdot 2 + 5 = -64 + 128 + 5 = 69$$\n\n最大高度是 $69$ 英尺，在 $2$ 秒后达到。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const peak = u === feet ? Q.of(rng.int(1, 10), 2) : Q.of(rng.int(1, 6));
        const v = Q.of(2 * u.g).mul(peak);
        const h0 = rng.int(0, 40);
        const top = Q.of(u.g).mul(peak).mul(peak).add(Q.of(h0));
        const obj = rng.pick(motionObjects);
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. What is its maximum height?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它的最大高度是多少？`,
          ),
          answer: top,
          unit: u.unit,
          wrong: [top.sub(Q.of(h0)), peak, v.mul(peak).add(Q.of(h0)), Q.of(u.g).mul(peak).mul(peak).neg().add(Q.of(h0))],
          solution: t(
            `The vertex is at $t = -\\frac{${num(v)}}{2 \\cdot (-${u.g})} = ${num(peak)}$. Substitute:${steps(`h = ${plugIn(-u.g, v, h0, peak)} = ${num(top)}`)}The maximum height is $${num(top)}$ ${u.en}.`,
            `顶点在 $t = -\\frac{${num(v)}}{2 \\cdot (-${u.g})} = ${num(peak)}$ 处。代入：${steps(`h = ${plugIn(-u.g, v, h0, peak)} = ${num(top)}`)}最大高度是 $${num(top)}$ ${u.zh}。`,
          ),
        });
      },
    },
    {
      id: "time-to-land",
      title: t("When it lands", "何时落地"),
      explanation: t(
        "The object lands when $h = 0$. Factor out the coefficient of $t^{2}$ and solve:\n\n$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$\n\nThe negative solution is a time before the throw, so the object lands after $3$ seconds. Thrown from the ground, $h_{0} = 0$ and one solution is $t = 0$, the moment of the throw.",
        "物体落地时 $h = 0$。提出 $t^{2}$ 的系数后求解：\n\n$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$\n\n负数解是抛出之前的时间，所以物体在 $3$ 秒后落地。从地面抛出时 $h_{0} = 0$，有一个解是 $t = 0$，即抛出的时刻。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const land = rng.int(2, 9);
        const s = rng.int(0, land - 1);
        const v = u.g * (land - s);
        const h0 = u.g * land * s;
        const obj = rng.pick(motionObjects);
        const factored = s === 0 ? `-${u.g}t(t - ${land})` : `-${u.g}(t - ${land})(t + ${s})`;
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. After how many seconds does it hit the ground?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它在多少秒后落地？`,
          ),
          answer: land,
          unit: "s",
          wrong: [-s, Q.of(land - s, 2), land - s, s],
          solution: t(
            `It lands when $h = 0$:${steps(`${quad(-u.g, v, h0, "t")} = 0`, `${factored} = 0`)}So $t = ${land}$ or $t = ${s === 0 ? 0 : -s}$. ${s === 0 ? "At $t = 0$ it is thrown" : "The negative time is before the throw"}, so it lands after $${land}$ seconds.`,
            `落地时 $h = 0$：${steps(`${quad(-u.g, v, h0, "t")} = 0`, `${factored} = 0`)}所以 $t = ${land}$ 或 $t = ${s === 0 ? 0 : -s}$。${s === 0 ? "$t = 0$ 是抛出的时刻" : "负的时间在抛出之前"}，所以 $${land}$ 秒后落地。`,
          ),
        });
      },
    },
    {
      id: "times-at-a-height",
      title: t("When it is at a given height", "何时位于某一高度"),
      explanation: t(
        "Below its maximum, the object passes each height twice: once going up and once coming down. Set $h$ equal to the height and solve:\n\n$$-16t^{2} + 64t + 10 = 58 \\Rightarrow -16t^{2} + 64t - 48 = 0 \\Rightarrow -16(t - 1)(t - 3) = 0$$\n\nIt is at $58$ feet after $1$ second, going up, and after $3$ seconds, coming down. Both times count.",
        "在最大高度以下，物体会两次经过同一高度：一次上升，一次下降。令 $h$ 等于该高度并求解：\n\n$$-16t^{2} + 64t + 10 = 58 \\Rightarrow -16t^{2} + 64t - 48 = 0 \\Rightarrow -16(t - 1)(t - 3) = 0$$\n\n它在 $1$ 秒后（上升时）和 $3$ 秒后（下降时）位于 $58$ 英尺高处。两个时间都符合。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const t1 = rng.int(1, 4);
        const t2 = rng.int(t1 + 1, t1 + 4);
        const v = u.g * (t1 + t2);
        const h0 = rng.int(0, 20);
        const level = h0 + u.g * t1 * t2;
        const obj = rng.pick(motionObjects);
        return solutionsProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. At what times is it $${level}$ ${u.en} high?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它在什么时刻位于 $${level}$ ${u.zh}高处？`,
          ),
          values: [String(t1), String(t2)],
          variable: "t",
          wrong: [[String(t1)], [String(t2)], [String(-t1), String(-t2)]],
          solution: t(
            `Set $h = ${level}$:${steps(`${quad(-u.g, v, h0, "t")} = ${level}`, `${quad(-u.g, v, h0 - level, "t")} = 0`, `-${u.g}(t - ${t1})(t - ${t2}) = 0`)}It is at that height at $t = ${t1}$ (going up) and $t = ${t2}$ (coming down).`,
            `令 $h = ${level}$：${steps(`${quad(-u.g, v, h0, "t")} = ${level}`, `${quad(-u.g, v, h0 - level, "t")} = 0`, `-${u.g}(t - ${t1})(t - ${t2}) = 0`)}它在 $t = ${t1}$（上升时）和 $t = ${t2}$（下降时）位于该高度。`,
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
  knowledgePoints: [
    {
      id: "writing-the-model",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        "The height of an object moving only under gravity, with initial height $h_{0}$ and initial velocity $v_{0}$ (positive upward, negative downward), is\n\n$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$\n\nwith $g = 32$ ft/s², giving $-16t^{2}$, or $g \\approx 10$ m/s², giving $-5t^{2}$. Thrown upward at $40$ ft/s from $6$ ft: $h(t) = -16t^{2} + 40t + 6$. The coefficient of $t^{2}$ is half of $g$, not $g$.",
        "只受重力作用的物体，初始高度为 $h_{0}$、初速度为 $v_{0}$（向上为正，向下为负），它的高度是\n\n$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$\n\n其中 $g = 32$ ft/s²，得到 $-16t^{2}$；或 $g \\approx 10$ m/s²，得到 $-5t^{2}$。从 $6$ 英尺高处以 $40$ ft/s 向上抛出：$h(t) = -16t^{2} + 40t + 6$。$t^{2}$ 的系数是 $g$ 的一半，而不是 $g$。",
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const v = rng.int(1, 20) * (u === feet ? 4 : 2);
        const h0 = rng.int(0, 60);
        const up = rng.bool(0.7);
        const v0 = up ? v : -v;
        const obj = rng.pick(motionObjects);
        const from = h0 === 0 ? t("from the ground", "从地面") : t(`from a height of $${h0}$ ${u.en}`, `从 $${h0}$ ${u.zh}高处`);
        return expressionProblem({
          prompt: t(
            `${obj.en} is thrown ${up ? "upward" : "downward"} at $${v}$ ${u.en} per second ${from.en}. Using $g = ${u === feet ? "32 \\text{ ft/s}^{2}" : "10 \\text{ m/s}^{2}"}$, write its height $h(t)$ in ${u.en} after $t$ seconds.`,
            `${obj["zh-CN"]}${from["zh-CN"]}以每秒 $${v}$ ${u.zh}的速度向${up ? "上" : "下"}抛出。取 $g = ${u === feet ? "32 \\text{ ft/s}^{2}" : "10 \\text{ m/s}^{2}"}$，写出 $t$ 秒后它的高度 $h(t)$（单位：${u.zh}）。`,
          ),
          answer: quad(-u.g, v0, h0, "t"),
          prefix: "h(t) =",
          wrong: [quad(-2 * u.g, v0, h0, "t"), quad(u.g, v0, h0, "t"), quad(-u.g, -v0, h0, "t"), quad(-u.g, h0, v0, "t")],
          solution: t(
            `Here $-\\frac{1}{2}g = -${u.g}$, $v_{0} = ${v0}$ ${up ? "(upward)" : "(downward, so negative)"} and $h_{0} = ${h0}$:${steps(`h(t) = ${quad(-u.g, v0, h0, "t")}`)}`,
            `这里 $-\\frac{1}{2}g = -${u.g}$，$v_{0} = ${v0}$${up ? "（向上）" : "（向下，所以为负）"}，$h_{0} = ${h0}$：${steps(`h(t) = ${quad(-u.g, v0, h0, "t")}`)}`,
          ),
        });
      },
    },
    {
      id: "time-above-a-height",
      title: t("How long it stays above a height", "高于某一高度的时长"),
      explanation: t(
        "The object is above a height between the two times it passes that height. Solve $h(t) = H$ and subtract the times. For $h = -16t^{2} + 96t$ and $H = 128$:\n\n$$-16t^{2} + 96t - 128 = 0 \\Rightarrow -16(t - 2)(t - 4) = 0$$\n\nIt is above $128$ feet from $t = 2$ to $t = 4$, for $4 - 2 = 2$ seconds.",
        "物体在两次经过某一高度之间高于该高度。解 $h(t) = H$，再把两个时间相减。对 $h = -16t^{2} + 96t$，$H = 128$：\n\n$$-16t^{2} + 96t - 128 = 0 \\Rightarrow -16(t - 2)(t - 4) = 0$$\n\n它从 $t = 2$ 到 $t = 4$ 高于 $128$ 英尺，共 $4 - 2 = 2$ 秒。",
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
        "When $h(t) = 0$ does not factor, use the quadratic formula and keep the positive solution. Divide by the coefficient of $t^{2}$ first to get simpler numbers. For $h = -5t^{2} + 5t + 20$:\n\n$$-5(t^{2} - t - 4) = 0 \\Rightarrow t = \\frac{1 \\pm \\sqrt{1 + 16}}{2} = \\frac{1 \\pm \\sqrt{17}}{2}$$\n\nOnly $t = \\frac{1 + \\sqrt{17}}{2} \\approx 2.56$ is positive, so it lands after about $2.56$ seconds.",
        "当 $h(t) = 0$ 不能分解时，用求根公式并保留正数解。先提出 $t^{2}$ 的系数，使数字更简单。对 $h = -5t^{2} + 5t + 20$：\n\n$$-5(t^{2} - t - 4) = 0 \\Rightarrow t = \\frac{1 \\pm \\sqrt{1 + 16}}{2} = \\frac{1 \\pm \\sqrt{17}}{2}$$\n\n只有 $t = \\frac{1 + \\sqrt{17}}{2} \\approx 2.56$ 是正数，所以大约 $2.56$ 秒后落地。",
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
        return solutionsProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. Find the exact time when it hits the ground.`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。求它落地的准确时刻。`,
          ),
          values: [roots[0]!],
          variable: "t",
          wrong: [roots, [roots[1]!]],
          solution: t(
            `Set $h = 0$ and divide by $-${u.g}$:${steps(`${quad(1, -p, -q, "t")} = 0`, `t = \\frac{${p} \\pm \\sqrt{${p * p + 4 * q}}}{2}`)}Only the solution with $+$ is positive, so $t = ${roots[0]}$ seconds.`,
            `令 $h = 0$，两边除以 $-${u.g}$：${steps(`${quad(1, -p, -q, "t")} = 0`, `t = \\frac{${p} \\pm \\sqrt{${p * p + 4 * q}}}{2}`)}只有取 $+$ 的解是正数，所以 $t = ${roots[0]}$ 秒。`,
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
  return numberProblem({
    prompt: t(
      `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${h}$ ${u.en}. For how many seconds is it higher than $${num(level)}$ ${u.en}?`,
      `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${h}$ ${u.zh}。它高于 $${num(level)}$ ${u.zh}的时间有多少秒？`,
    ),
    answer: span,
    unit: "s",
    wrong: [t2, t1, t1.add(t2)],
    solution: t(
      `Set $h = ${num(level)}$:${steps(`${quad(-u.g, v, Q.of(h0).sub(level), "t")} = 0`, `-${u.g}${factor(t1, "t")}${factor(t2, "t")} = 0`)}It is above that height from $t = ${num(t1)}$ to $t = ${num(t2)}$, for $${num(t2)} - ${num(t1)} = ${num(span)}$ seconds.`,
      `令 $h = ${num(level)}$：${steps(`${quad(-u.g, v, Q.of(h0).sub(level), "t")} = 0`, `-${u.g}${factor(t1, "t")}${factor(t2, "t")} = 0`)}它从 $t = ${num(t1)}$ 到 $t = ${num(t2)}$ 高于该高度，共 $${num(t2)} - ${num(t1)} = ${num(span)}$ 秒。`,
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
  encompasses: [
    { topic: "arithmetic-of-functions", weight: 0.4 },
    { topic: "modeling-with-linear-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.A.1.B", "CCSS.HSA.CED.A.2"],
  knowledgePoints: [
    {
      id: "computing-profit",
      title: t("Computing profit", "计算利润"),
      explanation: t(
        "When a business makes and sells $x$ items:\n\n- the **revenue** $R(x)$ is the money it takes in;\n- the **cost** $C(x)$ is the money it spends, usually a **fixed cost** paid anyway plus a **variable cost** for each item;\n- the **profit** is what is left: $P(x) = R(x) - C(x)$.\n\nWith $R(x) = 25x$ and $C(x) = 400 + 9x$, selling $30$ items gives $R(30) = 750$ and $C(30) = 670$, so the profit is $750 - 670 = 80$ dollars. A negative profit is a loss.",
        "企业生产并售出 $x$ 件商品时：\n\n- **收入** $R(x)$ 是收进的钱；\n- **成本** $C(x)$ 是花出的钱，通常是无论如何都要付的**固定成本**加上每件商品的**可变成本**；\n- **利润**是剩下的钱：$P(x) = R(x) - C(x)$。\n\n若 $R(x) = 25x$，$C(x) = 400 + 9x$，售出 $30$ 件时 $R(30) = 750$，$C(30) = 670$，利润是 $750 - 670 = 80$ 元。利润为负表示亏损。",
      ),
      generate(rng) {
        const price = rng.int(8, 40);
        const variable = rng.int(2, price - 2);
        const fixed = rng.int(5, 60) * 10;
        const n = rng.int(5, 80);
        const R = price * n;
        const C = fixed + variable * n;
        return numberProblem({
          prompt: t(
            `A company's revenue and cost, in dollars, for $x$ items are $R(x) = ${price}x$ and $C(x) = ${fixed} + ${variable}x$. Find its profit when it makes and sells $${n}$ items.`,
            `某公司生产并售出 $x$ 件商品的收入和成本（单位：元）为 $R(x) = ${price}x$，$C(x) = ${fixed} + ${variable}x$。求生产并售出 $${n}$ 件时的利润。`,
          ),
          answer: R - C,
          wrong: [R + C, R - fixed, R - variable * n, C - R],
          solution: t(
            `${steps(`R(${n}) = ${price} \\cdot ${n} = ${R}`, `C(${n}) = ${fixed} + ${variable} \\cdot ${n} = ${C}`, `P(${n}) = ${R} - ${C} = ${R - C}`)}The profit is $${R - C}$ dollars${R - C < 0 ? ", a loss" : ""}.`,
            `${steps(`R(${n}) = ${price} \\cdot ${n} = ${R}`, `C(${n}) = ${fixed} + ${variable} \\cdot ${n} = ${C}`, `P(${n}) = ${R} - ${C} = ${R - C}`)}利润是 $${R - C}$ 元${R - C < 0 ? "，即亏损" : ""}。`,
          ),
        });
      },
    },
    {
      id: "the-profit-function",
      title: t("The profit function", "利润函数"),
      explanation: t(
        "To find the profit function, subtract the **whole** cost function, in parentheses:\n\n$$P(x) = (-2x^{2} + 90x) - (15x + 300) = -2x^{2} + 90x - 15x - 300 = -2x^{2} + 75x - 300$$\n\nEvery term of $C(x)$ changes sign, including the fixed cost.",
        "求利润函数时，要减去**整个**成本函数，并加上括号：\n\n$$P(x) = (-2x^{2} + 90x) - (15x + 300) = -2x^{2} + 90x - 15x - 300 = -2x^{2} + 75x - 300$$\n\n$C(x)$ 的每一项都要变号，包括固定成本。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(30, 150);
        const m = rng.int(3, 25);
        const F = rng.int(5, 80) * 10;
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
            `Subtract the whole cost function:${steps(`P(x) = (${quad(-a, b, 0)}) - (${linear(m, F)})`, `P(x) = ${quad(-a, b - m, -F)}`)}`,
            `减去整个成本函数：${steps(`P(x) = (${quad(-a, b, 0)}) - (${linear(m, F)})`, `P(x) = ${quad(-a, b - m, -F)}`)}`,
          ),
        });
      },
    },
    {
      id: "revenue-from-a-price-function",
      title: t("Revenue from price and demand", "由价格与需求求收入"),
      explanation: t(
        "Revenue is the price of each item times the number sold. If selling more items requires a lower price, the price is a function of $x$, such as $p(x) = 60 - 2x$, and\n\n$$R(x) = x \\cdot p(x) = x(60 - 2x) = 60x - 2x^{2}$$\n\nSo revenue is a quadratic function of the number of items.",
        "收入等于每件商品的价格乘以售出的件数。若要多卖就得降价，价格就是 $x$ 的函数，例如 $p(x) = 60 - 2x$，于是\n\n$$R(x) = x \\cdot p(x) = x(60 - 2x) = 60x - 2x^{2}$$\n\n所以收入是件数的二次函数。",
      ),
      generate(rng) {
        const a = rng.int(20, 200);
        const b = rng.pick([1, 2, 3, 4, 5, Q.of(1, 2)]);
        const item = rng.pick(goods);
        const B = toQ(b);
        return expressionProblem({
          prompt: t(
            `A shop can sell $x$ ${item.en} per week when it sets the price at $p(x) = ${poly([a, ""], [B.neg(), "x"])}$ dollars each. Write its weekly revenue $R(x)$.`,
            `当每件${item.zh}定价 $p(x) = ${poly([a, ""], [B.neg(), "x"])}$ 元时，商店每周能卖出 $x$ 件。写出它每周的收入 $R(x)$。`,
          ),
          answer: quad(B.neg(), a, 0),
          simplified: true,
          prefix: "R(x) =",
          wrong: [linear(B.neg(), a), quad(B, a, 0), quad(B.neg(), 0, a), quad(0, toQ(a).sub(B), 0)],
          solution: t(
            `Multiply the price by the number sold:${steps(`R(x) = x(${poly([a, ""], [B.neg(), "x"])}) = ${quad(B.neg(), a, 0)}`)}`,
            `价格乘以售出件数：${steps(`R(x) = x(${poly([a, ""], [B.neg(), "x"])}) = ${quad(B.neg(), a, 0)}`)}`,
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
  knowledgePoints: [
    {
      id: "cost-functions",
      title: t("Cost functions", "成本函数"),
      explanation: t(
        "A cost function adds the fixed cost, paid however many items are made, to the variable cost of $x$ items. A bakery paying $\\$1200$ a month in rent and $\\$4$ in ingredients per cake has\n\n$$C(x) = 4x + 1200$$\n\nThe cost per item multiplies $x$; the fixed cost is the constant term.",
        "成本函数等于固定成本（无论生产多少件都要付）加上 $x$ 件商品的可变成本。一家面包店每月房租 $1200$ 元，每个蛋糕原料 $4$ 元，则\n\n$$C(x) = 4x + 1200$$\n\n每件的成本乘以 $x$；固定成本是常数项。",
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const fixed = rng.int(3, 90) * 50;
        const v = rng.int(2, 30);
        return expressionProblem({
          prompt: t(
            `A workshop making ${item.en} pays $\\$${fixed}$ a month in fixed costs, and each of its ${item.en} costs $\\$${v}$ to make. Write the monthly cost $C(x)$ of making $x$ ${item.en}.`,
            `一家生产${item.zh}的工坊每月固定成本为 $${fixed}$ 元，每件${item.zh}的制作成本为 $${v}$ 元。写出每月生产 $x$ 件${item.zh}的成本 $C(x)$。`,
          ),
          answer: linear(v, fixed),
          prefix: "C(x) =",
          wrong: [linear(fixed, v), linear(v, -fixed), linear(v + fixed, 0), linear(v, 0)],
          solution: t(
            `The variable cost is $${v}x$ and the fixed cost $${fixed}$:${steps(`C(x) = ${linear(v, fixed)}`)}`,
            `可变成本是 $${v}x$，固定成本是 $${fixed}$：${steps(`C(x) = ${linear(v, fixed)}`)}`,
          ),
        });
      },
    },
    {
      id: "profit-functions",
      title: t("Profit functions from a description", "根据描述写利润函数"),
      explanation: t(
        "Build the revenue and the cost, then subtract. Selling each lamp for $\\$35$, with $\\$500$ fixed costs and $\\$20$ per lamp:\n\n$$P(x) = 35x - (20x + 500) = 15x - 500$$\n\nEach lamp adds $35 - 20 = 15$ dollars, and the fixed cost is subtracted once.",
        "先写出收入和成本，再相减。每盏台灯售价 $35$ 元，固定成本 $500$ 元，每盏成本 $20$ 元：\n\n$$P(x) = 35x - (20x + 500) = 15x - 500$$\n\n每盏台灯带来 $35 - 20 = 15$ 元，固定成本只减一次。",
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const fixed = rng.int(3, 60) * 50;
        const v = rng.int(2, 30);
        const p = v + rng.int(2, 30);
        return expressionProblem({
          prompt: t(
            `A company sells ${item.en} for $\\$${p}$ each. Its fixed costs are $\\$${fixed}$, and each item costs $\\$${v}$ to make. Write the profit $P(x)$ from making and selling $x$ ${item.en}.`,
            `某公司以每件 $${p}$ 元的价格出售${item.zh}。它的固定成本是 $${fixed}$ 元，每件的制作成本是 $${v}$ 元。写出生产并售出 $x$ 件${item.zh}的利润 $P(x)$。`,
          ),
          answer: linear(p - v, -fixed),
          prefix: "P(x) =",
          wrong: [linear(p - v, fixed), linear(p + v, -fixed), linear(p, -fixed - v), linear(p - v, 0)],
          solution: t(
            `Revenue is $${p}x$ and cost is $${linear(v, fixed)}$:${steps(`P(x) = ${p}x - (${linear(v, fixed)}) = ${linear(p - v, -fixed)}`)}`,
            `收入是 $${p}x$，成本是 $${linear(v, fixed)}$：${steps(`P(x) = ${p}x - (${linear(v, fixed)}) = ${linear(p - v, -fixed)}`)}`,
          ),
        });
      },
    },
    {
      id: "revenue-with-price-changes",
      title: t("Revenue when the price changes", "价格变化时的收入"),
      explanation: t(
        "A theater sells $300$ tickets at $\\$12$. For each $\\$1$ increase in price it sells $15$ fewer tickets. After $n$ increases of $\\$1$ the price is $12 + n$ and the number sold is $300 - 15n$, so\n\n$$R(n) = (12 + n)(300 - 15n) = -15n^{2} + 120n + 3600$$\n\nRevenue is price times number sold, so it is a quadratic function of $n$.",
        "一家剧院以 $12$ 元的票价能卖出 $300$ 张票。票价每提高 $1$ 元，就少卖 $15$ 张。提价 $n$ 次（每次 $1$ 元）后，票价是 $12 + n$，售出 $300 - 15n$ 张，所以\n\n$$R(n) = (12 + n)(300 - 15n) = -15n^{2} + 120n + 3600$$\n\n收入等于价格乘以销量，所以它是 $n$ 的二次函数。",
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const p = rng.int(5, 40);
        const k = rng.int(2, 20);
        const q = k * rng.int(5, 30);
        return expressionProblem({
          prompt: t(
            `A store sells $${q}$ ${item.en} a week at $\\$${p}$ each. For each $\\$1$ increase in price, it sells $${k}$ fewer. Write the weekly revenue $R(n)$ after $n$ increases of $\\$1$.`,
            `一家商店以每件 $${p}$ 元的价格每周卖出 $${q}$ 件${item.zh}。价格每提高 $1$ 元，就少卖 $${k}$ 件。写出提价 $n$ 次（每次 $1$ 元）后每周的收入 $R(n)$。`,
          ),
          answer: quad(-k, q - k * p, p * q, "n"),
          prefix: "R(n) =",
          wrong: [
            `(${poly([p, ""], [1, "n"])})(${poly([q, ""], [k, "n"])})`,
            `(${poly([p, ""], [-1, "n"])})(${poly([q, ""], [-k, "n"])})`,
            linear(-k, p * q, "n"),
            `(${poly([p, ""], [1, "n"])})(${q} - ${k})`,
          ],
          solution: t(
            `The price is $${poly([p, ""], [1, "n"])}$ and the number sold is $${poly([q, ""], [-k, "n"])}$:${steps(`R(n) = (${poly([p, ""], [1, "n"])})(${poly([q, ""], [-k, "n"])})`, `R(n) = ${quad(-k, q - k * p, p * q, "n")}`)}`,
            `价格是 $${poly([p, ""], [1, "n"])}$，销量是 $${poly([q, ""], [-k, "n"])}$：${steps(`R(n) = (${poly([p, ""], [1, "n"])})(${poly([q, ""], [-k, "n"])})`, `R(n) = ${quad(-k, q - k * p, p * q, "n")}`)}`,
          ),
        });
      },
    },
  ],
};

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
    { topic: "revenue-cost-and-profit-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.SSE.B.3"],
  knowledgePoints: [
    {
      id: "the-most-profitable-quantity",
      title: t("The most profitable quantity", "利润最大时的件数"),
      explanation: t(
        "A profit function such as $P(x) = -2x^{2} + 160x - 1800$ is a downward parabola, so profit is greatest at the vertex:\n\n$$x = -\\frac{b}{2a} = -\\frac{160}{2 \\cdot (-2)} = 40$$\n\nMaking and selling $40$ items gives the most profit. Producing more than that lowers the profit again.",
        "像 $P(x) = -2x^{2} + 160x - 1800$ 这样的利润函数，图象是开口向下的抛物线，所以利润在顶点处最大：\n\n$$x = -\\frac{b}{2a} = -\\frac{160}{2 \\cdot (-2)} = 40$$\n\n生产并售出 $40$ 件时利润最大。再多生产，利润反而会下降。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const h = rng.int(10, 90);
        const b = 2 * a * h;
        const F = rng.int(1, Math.floor((a * h * h) / 100)) * 50;
        const item = rng.pick(goods);
        return numberProblem({
          prompt: t(
            `The weekly profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, b, -F)}$. How many ${item.en} should be made and sold each week to maximize the profit?`,
            `每周生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, b, -F)}$。每周应生产并售出多少件${item.zh}才能使利润最大？`,
          ),
          answer: h,
          wrong: [2 * h, -h, a * h * h - F, Q.of(b, a)],
          solution: t(
            `The parabola opens downward, so the maximum is at the vertex:${steps(`x = -\\frac{${b}}{2 \\cdot (-${a})} = ${h}`)}`,
            `抛物线开口向下，所以最大值在顶点处：${steps(`x = -\\frac{${b}}{2 \\cdot (-${a})} = ${h}`)}`,
          ),
        });
      },
    },
    {
      id: "the-maximum-profit",
      title: t("The maximum profit", "最大利润"),
      explanation: t(
        "The maximum profit is the value of $P$ at the vertex. For $P(x) = -2x^{2} + 160x - 1800$, the vertex is at $x = 40$:\n\n$$P(40) = -2 \\cdot 40^{2} + 160 \\cdot 40 - 1800 = -3200 + 6400 - 1800 = 1400$$\n\nThe maximum profit is $\\$1400$. It is a value of $P$, not the number of items.",
        "最大利润是 $P$ 在顶点处的值。对 $P(x) = -2x^{2} + 160x - 1800$，顶点在 $x = 40$ 处：\n\n$$P(40) = -2 \\cdot 40^{2} + 160 \\cdot 40 - 1800 = -3200 + 6400 - 1800 = 1400$$\n\n最大利润是 $1400$ 元。它是 $P$ 的值，而不是件数。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const h = rng.int(5, 60);
        const b = 2 * a * h;
        const F = rng.int(1, Math.max(1, Math.floor((a * h * h) / 50))) * 25;
        const top = a * h * h - F;
        const item = rng.pick(goods);
        return numberProblem({
          prompt: t(
            `The monthly profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, b, -F)}$. What is the maximum monthly profit?`,
            `每月生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, b, -F)}$。每月的最大利润是多少？`,
          ),
          answer: top,
          wrong: [h, top + F, b * h - F, -a * h * h - b * h - F],
          solution: t(
            `The vertex is at $x = -\\frac{${b}}{2 \\cdot (-${a})} = ${h}$. Substitute:${steps(`P(${h}) = ${plugIn(-a, b, -F, h)} = ${top}`)}The maximum profit is $\\$${top}$.`,
            `顶点在 $x = -\\frac{${b}}{2 \\cdot (-${a})} = ${h}$ 处。代入：${steps(`P(${h}) = ${plugIn(-a, b, -F, h)} = ${top}`)}最大利润是 $${top}$ 元。`,
          ),
        });
      },
    },
    {
      id: "break-even-points",
      title: t("Break-even points", "盈亏平衡点"),
      explanation: t(
        "A **break-even point** is a quantity where profit is $0$: revenue equals cost. They are the roots of $P$, or the solutions of $R(x) = C(x)$. For $P(x) = -2x^{2} + 200x - 1800$:\n\n$$-2(x^{2} - 100x + 900) = 0 \\Rightarrow -2(x - 10)(x - 90) = 0$$\n\nThe business breaks even at $10$ and at $90$ items. The most profitable quantity is halfway between them, at the average of the roots: $\\frac{10 + 90}{2} = 50$.",
        "**盈亏平衡点**是利润为 $0$（收入等于成本）时的件数。它们是 $P$ 的零点，也是 $R(x) = C(x)$ 的解。对 $P(x) = -2x^{2} + 200x - 1800$：\n\n$$-2(x^{2} - 100x + 900) = 0 \\Rightarrow -2(x - 10)(x - 90) = 0$$\n\n企业在 $10$ 件和 $90$ 件时盈亏平衡。利润最大的件数位于两者正中间，即两根的平均值：$\\frac{10 + 90}{2} = 50$。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const r = rng.int(2, 40);
        const s = r + rng.int(4, 60);
        const viaRC = rng.bool();
        const item = rng.pick(goods);
        const values = [String(r), String(s)];
        const wrong = [[String(-r), String(-s)], [String(r)], [String(s)], [num(Q.of(r + s, 2))]];
        if (viaRC) {
          const m = rng.int(3, 20);
          const F = a * r * s;
          const b = a * (r + s) + m;
          return solutionsProblem({
            prompt: t(
              `The revenue and cost in dollars of making and selling $x$ ${item.en} are $R(x) = ${quad(-a, b, 0)}$ and $C(x) = ${linear(m, F)}$. Find the break-even points.`,
              `生产并售出 $x$ 件${item.zh}的收入和成本（单位：元）为 $R(x) = ${quad(-a, b, 0)}$，$C(x) = ${linear(m, F)}$。求盈亏平衡点。`,
            ),
            values,
            wrong,
            solution: t(
              `Set revenue equal to cost:${steps(`${quad(-a, b, 0)} = ${linear(m, F)}`, `${quad(-a, b - m, -F)} = 0`, `${front(-a)}(x - ${r})(x - ${s}) = 0`)}The break-even points are $x = ${r}$ and $x = ${s}$ ${item.en}.`,
              `令收入等于成本：${steps(`${quad(-a, b, 0)} = ${linear(m, F)}`, `${quad(-a, b - m, -F)} = 0`, `${front(-a)}(x - ${r})(x - ${s}) = 0`)}盈亏平衡点是 $x = ${r}$ 和 $x = ${s}$ 件${item.zh}。`,
            ),
          });
        }
        return solutionsProblem({
          prompt: t(
            `The profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, a * (r + s), -a * r * s)}$. Find the break-even points.`,
            `生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, a * (r + s), -a * r * s)}$。求盈亏平衡点。`,
          ),
          values,
          wrong,
          solution: t(
            `Set the profit equal to $0$ and factor:${steps(`${quad(-a, a * (r + s), -a * r * s)} = 0`, `${front(-a)}(x - ${r})(x - ${s}) = 0`)}The break-even points are $x = ${r}$ and $x = ${s}$ ${item.en}.`,
            `令利润为 $0$ 并分解因式：${steps(`${quad(-a, a * (r + s), -a * r * s)} = 0`, `${front(-a)}(x - ${r})(x - ${s}) = 0`)}盈亏平衡点是 $x = ${r}$ 和 $x = ${s}$ 件${item.zh}。`,
          ),
        });
      },
    },
    {
      id: "profitable-quantities",
      title: t("When the business makes a profit", "何时盈利"),
      explanation: t(
        "A downward profit parabola is above the $x$-axis between its roots. So the business makes a profit, $P(x) > 0$, exactly for quantities strictly between the two break-even points. With break-even points $10$ and $90$, it profits for $10 < x < 90$, the interval $(10, 90)$; at $10$ and $90$ the profit is $0$, not positive.",
        "开口向下的利润抛物线在两个零点之间位于 $x$ 轴上方。所以企业盈利（$P(x) > 0$）恰好是件数严格位于两个盈亏平衡点之间的时候。若盈亏平衡点是 $10$ 和 $90$，则 $10 < x < 90$ 时盈利，即区间 $(10, 90)$；在 $10$ 和 $90$ 处利润为 $0$，不是正数。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const r = rng.int(2, 40);
        const s = r + rng.int(4, 60);
        const item = rng.pick(goods);
        const set = union({ lo: Q.of(r), hi: Q.of(s), loClosed: false, hiClosed: false });
        return intervalProblem({
          prompt: t(
            `The profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, a * (r + s), -a * r * s)}$. For which values of $x$ is the profit positive?`,
            `生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, a * (r + s), -a * r * s)}$。$x$ 取哪些值时利润为正？`,
          ),
          set,
          wrong: [
            union({ lo: Q.of(r), hi: Q.of(s), loClosed: true, hiClosed: true }),
            union({ hi: Q.of(r), loClosed: false, hiClosed: false }, { lo: Q.of(s), loClosed: false, hiClosed: false }),
            ray(r, true, false),
          ],
          solution: t(
            `Factor:${steps(`P(x) = ${front(-a)}(x - ${r})(x - ${s})`)}The parabola opens downward, so it is above the $x$-axis between its roots: $${r} < x < ${s}$, the interval $${intervalLatex(set)}$.`,
            `分解因式：${steps(`P(x) = ${front(-a)}(x - ${r})(x - ${s})`)}抛物线开口向下，所以在两个零点之间位于 $x$ 轴上方：$${r} < x < ${s}$，即区间 $${intervalLatex(set)}$。`,
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
