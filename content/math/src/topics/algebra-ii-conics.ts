import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  paren,
  plane,
  poly,
  Q,
  simplifyRadical,
  surd,
  surdLatex,
} from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointProblem, solutionsProblem, steps, yesNo } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

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

/** sq writes (v − h)², or v² when h = 0. */
const sq = (h: Coefficient, v = "x") => (toQ(h).isZero() ? `${v}^{2}` : `(${linear(1, toQ(h).neg(), v)})^{2}`);

/** vertexForm writes a(v − h)² + k. */
const vertexForm = (a: Coefficient, h: Coefficient, k: Coefficient, v = "x") => `${front(a)}${sq(h, v)}${tail(k)}`;

/** quad writes av² + bv + c. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** scaled writes c(v − k), or cv when k = 0. */
function scaled(c: Coefficient, k: Coefficient, v: string): string {
  const K = toQ(k);
  return K.isZero() ? `${front(c)}${v}` : `${front(c)}(${linear(1, K.neg(), v)})`;
}

/** verticalConic writes (x − h)² = c(y − k), a parabola with vertex (h, k) and 4p = c. */
const verticalConic = (h: Coefficient, k: Coefficient, c: Coefficient) => `${sq(h, "x")} = ${scaled(c, k, "y")}`;

/** horizontalConic writes (y − k)² = c(x − h), a parabola with vertex (h, k) and 4p = c. */
const horizontalConic = (h: Coefficient, k: Coefficient, c: Coefficient) => `${sq(k, "y")} = ${scaled(c, h, "x")}`;

/** pt writes the point (x, y). */
const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** factorOf writes the factor (v − r). */
const factorOf = (r: Coefficient, v: string) => `(${linear(1, toQ(r).neg(), v)})`;

/** plugIn writes av² + bv + c with a number substituted: "2 \cdot (-3)^{2} - 4 \cdot (-3) + 1". */
function plugIn(a: number, b: number, c: number, x: number): string {
  const p = paren(x);
  const term = (k: number, body: string, first: boolean) => {
    if (k === 0) return "";
    const abs = Math.abs(k);
    const coef = abs === 1 ? body : `${abs} \\cdot ${body}`;
    if (first) return k < 0 ? `-${coef}` : coef;
    return k < 0 ? ` - ${coef}` : ` + ${coef}`;
  };
  return `${term(a, `${p}^{2}`, true)}${term(b, p, a === 0)}${tail(c)}`;
}

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** verticalCurve draws y = a(x − h)² + k. */
function verticalCurve(a: Q, h: number, k: number): PlaneMark {
  const A = a.toNumber();
  return { kind: "curve", f: (x) => A * (x - h) ** 2 + k, accent: true };
}

/** horizontalCurve draws x = a(y − k)² + h as short segments, since a curve mark is a graph y = f(x). */
function horizontalCurve(a: Q, h: number, k: number): PlaneMark[] {
  const A = a.toNumber();
  const n = 160;
  const x = (y: number) => A * (y - k) ** 2 + h;
  const marks: PlaneMark[] = [];
  for (let i = 0; i < n; i++) {
    const y0 = view.yMin + ((view.yMax - view.yMin) * i) / n;
    const y1 = view.yMin + ((view.yMax - view.yMin) * (i + 1)) / n;
    marks.push({ kind: "segment", a: [x(y0), y0], b: [x(y1), y1], accent: true });
  }
  return marks;
}

/** parabolaFigure draws a parabola with vertex (h, k) and a(…)² = …, vertical or horizontal, with its vertex and one more point marked. */
function parabolaFigure(vertical: boolean, a: Q, h: number, k: number, other: readonly [number, number]): Figure {
  const curve = vertical ? [verticalCurve(a, h, k)] : horizontalCurve(a, h, k);
  const way = vertical
    ? a.sign() > 0
      ? ["upward", "上"]
      : ["downward", "下"]
    : a.sign() > 0
      ? ["to the right", "右"]
      : ["to the left", "左"];
  return {
    svg: plane(view, [...curve, { kind: "point", at: [h, k] }, { kind: "point", at: other }]),
    alt: t(
      `A parabola opening ${way[0]} with its vertex (${h}, ${k}) and the point (${other[0]}, ${other[1]}) marked.`,
      `一条开口向${way[1]}的抛物线，标出了顶点 (${h}, ${k}) 和点 (${other[0]}, ${other[1]})。`,
    ),
  };
}

/** directions are the four ways a parabola can open, in a fixed order: up, down, left, right. */
const directions: readonly Text[] = [t("Upward", "向上"), t("Downward", "向下"), t("To the left", "向左"), t("To the right", "向右")];

/** directionIndex is the index in directions of a parabola with a vertical or horizontal axis and the sign of p. */
const directionIndex = (vertical: boolean, positive: boolean) => (vertical ? (positive ? 0 : 1) : positive ? 3 : 2);

/** directionWords names the way a parabola opens. */
function directionWords(vertical: boolean, positive: boolean): Text {
  return [t("upward", "向上"), t("downward", "向下"), t("to the left", "向左"), t("to the right", "向右")][
    directionIndex(vertical, positive)
  ]!;
}

/** graphPairs are [|d|, e] with d²/e an integer: a point d across the axis and e along it from the vertex. */
const graphPairs: readonly (readonly [number, number])[] = [
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 4],
  [3, 1],
  [3, 3],
  [4, 2],
  [4, 4],
];

/** drawGraph draws a vertex (h, k) and a point d across the axis and e along it, all inside the view. */
function drawGraph(rng: Rng): { h: number; k: number; d: number; e: number; c: Q } {
  for (;;) {
    const [dd, ee] = rng.pick(graphPairs);
    const d = dd * rng.sign();
    const e = ee * rng.sign();
    const h = rng.int(-3, 3);
    const k = rng.int(-3, 3);
    if (Math.abs(h + d) <= 5 && Math.abs(k + e) <= 5) return { h, k, d, e, c: Q.of(d * d, e) };
  }
}

/** signedAs are leading coefficients of parabolas with a simple focal length. */
const signedAs: readonly Q[] = [1, 2, 3, 4, 5, 6]
  .flatMap((n) => [Q.of(1, n), Q.of(-1, n)])
  .concat([Q.of(2), Q.of(-2), Q.of(1, 8), Q.of(-1, 8)]);

/** GeneralForm is a parabola written x² + Dx + Ey + F = 0 (vertical) or y² + Dy + Ex + F = 0 (horizontal). */
interface GeneralForm {
  readonly vertical: boolean;
  readonly h: number;
  readonly k: number;
  readonly c: number;
  readonly equation: string;
  /** work completes the square, in display lines. */
  readonly work: string;
  readonly F: number;
}

/** drawGeneralForm draws a parabola in general form with vertex (h, k) and 4p = c. */
function drawGeneralForm(rng: Rng, vertical: boolean): GeneralForm {
  const c = rng.nonZero(-8, 8);
  const h = vertical ? rng.nonZero(-6, 6) : rng.int(-6, 6);
  const k = vertical ? rng.int(-6, 6) : rng.nonZero(-6, 6);
  const [u, w, s, r] = vertical ? ["x", "y", h, k] : ["y", "x", k, h];
  const D = -2 * s;
  const F = s * s + c * r;
  const equation = `${poly([1, `${u}^{2}`], [D, u], [-c, w], [F, ""])} = 0`;
  const work = steps(
    `${quad(1, D, 0, u)} = ${linear(c, -F, w)}`,
    `${quad(1, D, s * s, u)} = ${linear(c, s * s - F, w)}`,
    vertical ? verticalConic(h, k, c) : horizontalConic(h, k, c),
  );
  return { vertical, h, k, c, equation, work, F };
}

/** completeTheSquareText explains completing the square for a general form. */
function completeTheSquareText(g: GeneralForm): Text {
  const u = g.vertical ? "x" : "y";
  return t(
    `Keep the $${u}$-terms on the left, move the rest to the right, and add the square of half the coefficient of $${u}$ to both sides:${g.work}`,
    `把含 $${u}$ 的项留在左边，其余移到右边，两边同时加上 $${u}$ 的系数一半的平方：${g.work}`,
  );
}

// Module: parabolas as conic sections.

/** upwardAndDownwardOpeningParabolas writes parabolas with a vertical axis as x² = 4py and reads their direction from p. */
export const upwardAndDownwardOpeningParabolas: TopicDef = {
  id: "upward-and-downward-opening-parabolas",
  title: t("Upward and Downward Opening Parabolas", "开口向上和向下的抛物线"),
  summary: t(
    "Write a parabola with a vertical axis as $(x - h)^{2} = 4p(y - k)$, tell from the sign of $p$ whether it opens upward or downward, and find its equation from a graph.",
    "把对称轴竖直的抛物线写成 $(x - h)^{2} = 4p(y - k)$，由 $p$ 的符号判断开口向上还是向下，并由图象求方程。",
  ),
  prerequisites: ["the-vertex-form-of-a-parabola"],
  encompasses: [
    { topic: "the-vertex-form-of-a-parabola", weight: 0.3 },
    { topic: "vertical-reflections-of-quadratic-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "opening-up-or-down",
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        "As a **conic section**, a parabola with vertex at the origin and a vertical axis of symmetry is written\n\n$$x^{2} = 4py$$\n\nSolving for $y$ gives $y = \\frac{1}{4p}x^{2}$, so the parabola opens **upward** when $p > 0$ and **downward** when $p < 0$. Moving the vertex to $(h, k)$ gives $(x - h)^{2} = 4p(y - k)$, which opens the same way.\n\nFor $-x^{2} = 6y$, first multiply both sides by $-1$: $x^{2} = -6y$, so $4p = -6$, $p = -\\frac{3}{2} < 0$, and the parabola opens downward.",
        "作为**圆锥曲线**，顶点在原点、对称轴竖直的抛物线写成\n\n$$x^{2} = 4py$$\n\n解出 $y$ 得 $y = \\frac{1}{4p}x^{2}$，所以 $p > 0$ 时抛物线开口**向上**，$p < 0$ 时开口**向下**。把顶点移到 $(h, k)$ 得 $(x - h)^{2} = 4p(y - k)$，开口方向不变。\n\n对 $-x^{2} = 6y$，先两边同乘 $-1$：$x^{2} = -6y$，所以 $4p = -6$，$p = -\\frac{3}{2} < 0$，抛物线开口向下。",
      ),
      generate(rng) {
        const c = rng.nonZero(-12, 12);
        const form = rng.int(0, 3);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const fourP = form === 2 ? -c : c;
        const equation = [
          `x^{2} = ${scaled(c, 0, "y")}`,
          `${scaled(c, 0, "y")} = x^{2}`,
          `-x^{2} = ${scaled(c, 0, "y")}`,
          verticalConic(h, k, c),
        ][form]!;
        const up = fourP > 0;
        const rewrite =
          form === 2
            ? t(
                `Multiply both sides by $-1$: $x^{2} = ${scaled(fourP, 0, "y")}$, so $4p = ${fourP}$.`,
                `两边同乘 $-1$：$x^{2} = ${scaled(fourP, 0, "y")}$，所以 $4p = ${fourP}$。`,
              )
            : t(
                `Compare with $${form === 3 ? "(x - h)^{2} = 4p(y - k)" : "x^{2} = 4py"}$: $4p = ${c}$.`,
                `与 $${form === 3 ? "(x - h)^{2} = 4p(y - k)" : "x^{2} = 4py"}$ 比较：$4p = ${c}$。`,
              );
        return choiceProblem({
          prompt: t(`Which way does the parabola $${equation}$ open?`, `抛物线 $${equation}$ 的开口方向是？`),
          options: directions.slice(0, 2),
          correct: up ? 0 : 1,
          solution: t(
            `${rewrite.en} So $p$ is ${up ? "positive" : "negative"} and the parabola opens ${up ? "upward" : "downward"}.`,
            `${rewrite["zh-CN"]}所以 $p$ 为${up ? "正" : "负"}，抛物线开口${up ? "向上" : "向下"}。`,
          ),
        });
      },
    },
    {
      id: "finding-p",
      title: t("Finding p", "求 p"),
      explanation: t(
        "To write $y = ax^{2}$ in the form $x^{2} = 4py$, divide both sides by $a$ (multiply by $\\frac{1}{a}$) to isolate $x^{2}$, then compare the coefficients of $y$:\n\n$$y = \\frac{1}{12}x^{2} \\Rightarrow x^{2} = 12y \\Rightarrow 4p = 12 \\Rightarrow p = 3$$\n\nSo $p = \\frac{1}{4a}$. Remember to divide the coefficient of $y$ by $4$: $12$ is $4p$, not $p$.",
        "要把 $y = ax^{2}$ 写成 $x^{2} = 4py$ 的形式，两边除以 $a$（乘以 $\\frac{1}{a}$）使 $x^{2}$ 单独在一边，再比较 $y$ 的系数：\n\n$$y = \\frac{1}{12}x^{2} \\Rightarrow x^{2} = 12y \\Rightarrow 4p = 12 \\Rightarrow p = 3$$\n\n所以 $p = \\frac{1}{4a}$。记得把 $y$ 的系数除以 $4$：$12$ 是 $4p$，不是 $p$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-20, 20);
        const a = Q.of(1, c);
        const p = Q.of(c, 4);
        return numberProblem({
          prompt: t(
            `The parabola $y = ${front(a)}x^{2}$ is written in the form $x^{2} = 4py$. Find $p$.`,
            `把抛物线 $y = ${front(a)}x^{2}$ 写成 $x^{2} = 4py$ 的形式。求 $p$。`,
          ),
          answer: p,
          wrong: [Q.of(c), a, a.mul(Q.of(4)), p.neg(), Q.of(4, c)],
          solution: t(
            `Multiply both sides by $${c}$ to isolate $x^{2}$:${steps(`x^{2} = ${scaled(c, 0, "y")}`, `4p = ${c}`, `p = ${num(p)}`)}`,
            `两边同乘 $${c}$，使 $x^{2}$ 单独在一边：${steps(`x^{2} = ${scaled(c, 0, "y")}`, `4p = ${c}`, `p = ${num(p)}`)}`,
          ),
        });
      },
    },
    {
      id: "equation-from-a-graph",
      title: t("The equation from a graph", "由图象求方程"),
      explanation: t(
        "To find the equation of a parabola that opens upward or downward from its graph, read the vertex $(h, k)$, write $(x - h)^{2} = 4p(y - k)$, and substitute another point to find $4p$. With vertex $(1, -2)$ and the point $(3, 0)$:\n\n$$(3 - 1)^{2} = 4p(0 - (-2)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\nso the equation is $(x - 1)^{2} = 2(y + 2)$.",
        "要由图象求开口向上或向下的抛物线的方程，先读出顶点 $(h, k)$，写出 $(x - h)^{2} = 4p(y - k)$，再代入另一点求 $4p$。顶点 $(1, -2)$，经过点 $(3, 0)$：\n\n$$(3 - 1)^{2} = 4p(0 - (-2)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\n所以方程是 $(x - 1)^{2} = 2(y + 2)$。",
      ),
      generate(rng) {
        const { h, k, d, e, c } = drawGraph(rng);
        const [x1, y1] = [h + d, k + e];
        return {
          ...equationProblem({
            prompt: t(
              "The vertex of the parabola and one more point of it are marked. Write its equation in the form $(x - h)^{2} = 4p(y - k)$.",
              "图中标出了抛物线的顶点和另一点。把它的方程写成 $(x - h)^{2} = 4p(y - k)$ 的形式。",
            ),
            answer: verticalConic(h, k, c),
            wrong: [verticalConic(h, k, c.neg()), horizontalConic(h, k, c), verticalConic(h, k, Q.one.div(c)), verticalConic(-h, -k, c)],
            solution: t(
              `The vertex is $${pt(h, k)}$ and the other point is $${pt(x1, y1)}$. Substitute it:${steps(`(${x1} - ${paren(h)})^{2} = 4p(${y1} - ${paren(k)})`, `${d * d} = 4p \\cdot ${paren(e)}`, `4p = ${num(c)}`)}So the equation is $${verticalConic(h, k, c)}$.`,
              `顶点是 $${pt(h, k)}$，另一点是 $${pt(x1, y1)}$。代入：${steps(`(${x1} - ${paren(h)})^{2} = 4p(${y1} - ${paren(k)})`, `${d * d} = 4p \\cdot ${paren(e)}`, `4p = ${num(c)}`)}所以方程是 $${verticalConic(h, k, c)}$。`,
            ),
          }),
          figure: parabolaFigure(true, Q.one.div(c), h, k, [x1, y1]),
        };
      },
    },
  ],
};

/** leftAndRightOpeningParabolas extends conic parabolas to a horizontal axis: y² = 4px. */
export const leftAndRightOpeningParabolas: TopicDef = {
  id: "left-and-right-opening-parabolas",
  title: t("Left and Right Opening Parabolas", "开口向左和向右的抛物线"),
  summary: t(
    "Recognize parabolas $(y - k)^{2} = 4p(x - h)$ and $x = a(y - k)^{2} + h$ that open to the left or right, find points on them, and find their equation from a graph.",
    "认识开口向左或向右的抛物线 $(y - k)^{2} = 4p(x - h)$ 与 $x = a(y - k)^{2} + h$，求其上的点，并由图象求方程。",
  ),
  prerequisites: ["upward-and-downward-opening-parabolas"],
  encompasses: [{ topic: "upward-and-downward-opening-parabolas", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "opening-in-four-directions",
      title: t("Opening in four directions", "四种开口方向"),
      explanation: t(
        "Swapping $x$ and $y$ turns a parabola on its side:\n\n$$y^{2} = 4px$$\n\nopens **to the right** when $p > 0$ and **to the left** when $p < 0$; its axis of symmetry is horizontal. The squared variable tells the axis: if $x$ is squared the parabola opens up or down, if $y$ is squared it opens left or right. Then the sign of $p$ (or of $a$ in $x = ay^{2}$) gives the direction.\n\n$x = -\\frac{1}{2}y^{2}$ has $y$ squared and a negative coefficient, so it opens to the left.",
        "交换 $x$ 与 $y$，抛物线就“躺倒”了：\n\n$$y^{2} = 4px$$\n\n当 $p > 0$ 时开口**向右**，$p < 0$ 时开口**向左**；它的对称轴是水平的。看哪个变量被平方就知道对称轴的方向：$x$ 被平方时抛物线开口向上或向下，$y$ 被平方时开口向左或向右。再由 $p$（或 $x = ay^{2}$ 中 $a$）的符号判断方向。\n\n$x = -\\frac{1}{2}y^{2}$ 中 $y$ 被平方且系数为负，所以开口向左。",
      ),
      figure: {
        svg: plane(view, horizontalCurve(Q.of(1, 4), 0, 0)),
        alt: t("The parabola y² = 4x, opening to the right with its vertex at the origin.", "抛物线 y² = 4x，顶点在原点，开口向右。"),
      },
      generate(rng) {
        const c = rng.nonZero(-12, 12);
        const a = rng.pick(signedAs);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const form = rng.int(0, 5);
        const cases: readonly [string, boolean, boolean, Text][] = [
          [`x^{2} = ${scaled(c, 0, "y")}`, true, c > 0, t(`$x$ is squared and $4p = ${c}$`, `$x$ 被平方，$4p = ${c}$`)],
          [`y^{2} = ${scaled(c, 0, "x")}`, false, c > 0, t(`$y$ is squared and $4p = ${c}$`, `$y$ 被平方，$4p = ${c}$`)],
          [`x = ${front(a)}y^{2}`, false, a.sign() > 0, t(`$y$ is squared and $a = ${num(a)}$`, `$y$ 被平方，$a = ${num(a)}$`)],
          [
            `-y^{2} = ${scaled(c, 0, "x")}`,
            false,
            c < 0,
            t(
              `$y$ is squared, and $y^{2} = ${scaled(-c, 0, "x")}$ gives $4p = ${-c}$`,
              `$y$ 被平方，由 $y^{2} = ${scaled(-c, 0, "x")}$ 得 $4p = ${-c}$`,
            ),
          ],
          [horizontalConic(h, k, c), false, c > 0, t(`$y$ is squared and $4p = ${c}$`, `$y$ 被平方，$4p = ${c}$`)],
          [`y = ${front(a)}x^{2}`, true, a.sign() > 0, t(`$x$ is squared and $a = ${num(a)}$`, `$x$ 被平方，$a = ${num(a)}$`)],
        ];
        const [equation, vertical, positive, why] = cases[form]!;
        const way = directionWords(vertical, positive);
        return choiceProblem({
          prompt: t(`Which way does the parabola $${equation}$ open?`, `抛物线 $${equation}$ 的开口方向是？`),
          options: directions,
          correct: directionIndex(vertical, positive),
          solution: t(
            `Here ${why.en}, which is ${positive ? "positive" : "negative"}. The parabola opens ${way.en}.`,
            `这里${why["zh-CN"]}，为${positive ? "正" : "负"}。抛物线开口${way["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "points-on-a-horizontal-parabola",
      title: t("Points on a horizontal parabola", "开口向左右的抛物线上的点"),
      explanation: t(
        "In $x = ay^{2} + by + c$, the input is $y$ and the output is $x$. To find the point with a given $y$-coordinate, substitute $y$ and compute $x$. For $x = y^{2} - 2y + 3$ and $y = -1$:\n\n$$x = (-1)^{2} - 2 \\cdot (-1) + 3 = 6$$\n\nso the point is $(6, -1)$: the $x$-coordinate comes first even though it was computed last.",
        "在 $x = ay^{2} + by + c$ 中，输入是 $y$，输出是 $x$。要求某个 $y$ 坐标对应的点，就代入 $y$ 算出 $x$。对 $x = y^{2} - 2y + 3$，$y = -1$：\n\n$$x = (-1)^{2} - 2 \\cdot (-1) + 3 = 6$$\n\n所以点是 $(6, -1)$：$x$ 坐标虽然是后算出来的，仍然写在前面。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3]);
        const b = rng.int(-6, 6);
        const c = rng.int(-9, 9);
        const y = rng.nonZero(-4, 4);
        const x = a * y * y + b * y + c;
        return pointProblem({
          prompt: t(
            `Find the point on the parabola $x = ${quad(a, b, c, "y")}$ whose $y$-coordinate is $${y}$.`,
            `求抛物线 $x = ${quad(a, b, c, "y")}$ 上 $y$ 坐标为 $${y}$ 的点。`,
          ),
          answer: [x, y],
          wrong: [
            [y, x],
            [-a * y * y + b * y + c, y],
            [a * y * y - b * y + c, y],
          ],
          solution: t(
            `Substitute $y = ${y}$:${steps(`x = ${plugIn(a, b, c, y)} = ${x}`)}The point is $${pt(x, y)}$.`,
            `代入 $y = ${y}$：${steps(`x = ${plugIn(a, b, c, y)} = ${x}`)}所求点是 $${pt(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "horizontal-equation-from-a-graph",
      title: t("The equation from a graph", "由图象求方程"),
      explanation: t(
        "A parabola that opens to the left or right with vertex $(h, k)$ is $(y - k)^{2} = 4p(x - h)$; note that $k$ goes with $y$ and $h$ with $x$. Substitute another point to find $4p$. With vertex $(-1, 2)$ and the point $(1, 4)$:\n\n$$(4 - 2)^{2} = 4p(1 - (-1)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\nso the equation is $(y - 2)^{2} = 2(x + 1)$.",
        "顶点为 $(h, k)$、开口向左或向右的抛物线是 $(y - k)^{2} = 4p(x - h)$；注意 $k$ 和 $y$ 在一起，$h$ 和 $x$ 在一起。代入另一点求 $4p$。顶点 $(-1, 2)$，经过点 $(1, 4)$：\n\n$$(4 - 2)^{2} = 4p(1 - (-1)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\n所以方程是 $(y - 2)^{2} = 2(x + 1)$。",
      ),
      generate(rng) {
        const g = drawGraph(rng);
        const [h, k, d, e, c] = [g.k, g.h, g.d, g.e, g.c];
        const [x1, y1] = [h + e, k + d];
        return {
          ...equationProblem({
            prompt: t(
              "The vertex of the parabola and one more point of it are marked. Write its equation in the form $(y - k)^{2} = 4p(x - h)$.",
              "图中标出了抛物线的顶点和另一点。把它的方程写成 $(y - k)^{2} = 4p(x - h)$ 的形式。",
            ),
            answer: horizontalConic(h, k, c),
            wrong: [horizontalConic(h, k, c.neg()), verticalConic(h, k, c), horizontalConic(k, h, c), horizontalConic(-h, -k, c)],
            solution: t(
              `The vertex is $${pt(h, k)}$ and the other point is $${pt(x1, y1)}$. Substitute it:${steps(`(${y1} - ${paren(k)})^{2} = 4p(${x1} - ${paren(h)})`, `${d * d} = 4p \\cdot ${paren(e)}`, `4p = ${num(c)}`)}So the equation is $${horizontalConic(h, k, c)}$.`,
              `顶点是 $${pt(h, k)}$，另一点是 $${pt(x1, y1)}$。代入：${steps(`(${y1} - ${paren(k)})^{2} = 4p(${x1} - ${paren(h)})`, `${d * d} = 4p \\cdot ${paren(e)}`, `4p = ${num(c)}`)}所以方程是 $${horizontalConic(h, k, c)}$。`,
            ),
          }),
          figure: parabolaFigure(false, Q.one.div(c), h, k, [x1, y1]),
        };
      },
    },
  ],
};

/** theVertexOfAParabola reads the vertex and the axis of symmetry from the conic forms of parabolas in both orientations. */
export const theVertexOfAParabola: TopicDef = {
  id: "the-vertex-of-a-parabola",
  title: t("The Vertex of a Parabola", "抛物线的顶点"),
  summary: t(
    "Read the vertex and the axis of symmetry from $(x - h)^{2} = 4p(y - k)$, $(y - k)^{2} = 4p(x - h)$ and $x = a(y - k)^{2} + h$.",
    "从 $(x - h)^{2} = 4p(y - k)$、$(y - k)^{2} = 4p(x - h)$ 和 $x = a(y - k)^{2} + h$ 读出顶点和对称轴。",
  ),
  prerequisites: ["left-and-right-opening-parabolas"],
  encompasses: [
    { topic: "left-and-right-opening-parabolas", weight: 0.3 },
    { topic: "the-vertex-form-of-a-parabola", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "vertex-of-a-vertical-parabola",
      title: t("Parabolas opening up or down", "开口向上或向下的抛物线"),
      explanation: t(
        "The parabola $(x - h)^{2} = 4p(y - k)$ has its vertex at $(h, k)$: the number subtracted from $x$ is the $x$-coordinate and the number subtracted from $y$ is the $y$-coordinate. Read each with the opposite sign of the number in its parentheses:\n\n$$(x + 3)^{2} = 8(y - 5) \\text{ is } (x - (-3))^{2} = 8(y - 5)$$\n\nso the vertex is $(-3, 5)$. The factor $4p = 8$ does not change the vertex.",
        "抛物线 $(x - h)^{2} = 4p(y - k)$ 的顶点是 $(h, k)$：从 $x$ 中减去的数是横坐标，从 $y$ 中减去的数是纵坐标。每个坐标都与括号里的数符号相反：\n\n$$(x + 3)^{2} = 8(y - 5) \\text{ 即 } (x - (-3))^{2} = 8(y - 5)$$\n\n所以顶点是 $(-3, 5)$。系数 $4p = 8$ 不影响顶点。",
      ),
      generate(rng) {
        let h: number;
        let k: number;
        do {
          h = rng.nonZero(-9, 9);
          k = rng.nonZero(-9, 9);
        } while (Math.abs(h) === Math.abs(k));
        const c = rng.nonZero(-12, 12);
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $${verticalConic(h, k, c)}$.`, `求抛物线 $${verticalConic(h, k, c)}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [-h, -k],
            [h, -k],
            [-h, k],
            [k, h],
          ],
          solution: t(
            `Write it as $(x - ${paren(h)})^{2} = ${front(c)}(y - ${paren(k)})$: $h = ${h}$ and $k = ${k}$, so the vertex is $${pt(h, k)}$.`,
            `把它写成 $(x - ${paren(h)})^{2} = ${front(c)}(y - ${paren(k)})$：$h = ${h}$，$k = ${k}$，所以顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "vertex-of-a-horizontal-parabola",
      title: t("Parabolas opening left or right", "开口向左或向右的抛物线"),
      explanation: t(
        "For a parabola opening left or right, the squared binomial contains $y$, so it gives the **$y$-coordinate** of the vertex:\n\n- $(y - k)^{2} = 4p(x - h)$ has vertex $(h, k)$;\n- $x = a(y - k)^{2} + h$ has vertex $(h, k)$.\n\nFor $x = 2(y - 1)^{2} - 4$, the vertex is $(-4, 1)$, not $(1, -4)$: the constant $-4$ is the $x$-coordinate.",
        "对开口向左或向右的抛物线，被平方的二项式里是 $y$，所以它给出顶点的 **$y$ 坐标**：\n\n- $(y - k)^{2} = 4p(x - h)$ 的顶点是 $(h, k)$；\n- $x = a(y - k)^{2} + h$ 的顶点是 $(h, k)$。\n\n对 $x = 2(y - 1)^{2} - 4$，顶点是 $(-4, 1)$，而不是 $(1, -4)$：常数 $-4$ 是横坐标。",
      ),
      generate(rng) {
        let h: number;
        let k: number;
        do {
          h = rng.nonZero(-9, 9);
          k = rng.nonZero(-9, 9);
        } while (Math.abs(h) === Math.abs(k));
        const conic = rng.bool();
        const c = rng.nonZero(-12, 12);
        const a = rng.pick(signedAs);
        const equation = conic ? horizontalConic(h, k, c) : `x = ${vertexForm(a, k, h, "y")}`;
        const why = conic
          ? t(
              `the number subtracted from $x$ is $${h}$ and the number subtracted from $y$ is $${k}$`,
              `从 $x$ 中减去的数是 $${h}$，从 $y$ 中减去的数是 $${k}$`,
            )
          : t(
              `the constant $${h}$ is the $x$-coordinate and the number subtracted from $y$ is $${k}$`,
              `常数 $${h}$ 是横坐标，从 $y$ 中减去的数是 $${k}$`,
            );
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [k, h],
            [-h, -k],
            [h, -k],
            [-k, h],
          ],
          solution: t(`Here ${why.en}, so the vertex is $${pt(h, k)}$.`, `这里${why["zh-CN"]}，所以顶点是 $${pt(h, k)}$。`),
        });
      },
    },
    {
      id: "the-axis-of-symmetry",
      title: t("The axis of symmetry", "对称轴"),
      explanation: t(
        "The axis of symmetry passes through the vertex $(h, k)$ in the direction the parabola opens:\n\n- a parabola opening up or down has the vertical axis $x = h$;\n- a parabola opening left or right has the horizontal axis $y = k$.\n\n$(y + 2)^{2} = -6(x - 1)$ opens to the left with vertex $(1, -2)$, so its axis of symmetry is $y = -2$.",
        "对称轴经过顶点 $(h, k)$，方向与抛物线的开口方向一致：\n\n- 开口向上或向下的抛物线，对称轴是竖直的 $x = h$；\n- 开口向左或向右的抛物线，对称轴是水平的 $y = k$。\n\n$(y + 2)^{2} = -6(x - 1)$ 开口向左，顶点是 $(1, -2)$，所以对称轴是 $y = -2$。",
      ),
      generate(rng) {
        let h: number;
        let k: number;
        do {
          h = rng.nonZero(-9, 9);
          k = rng.nonZero(-9, 9);
        } while (Math.abs(h) === Math.abs(k));
        const vertical = rng.bool();
        const conic = rng.bool();
        const c = rng.nonZero(-12, 12);
        const a = rng.pick(signedAs);
        const equation = vertical
          ? conic
            ? verticalConic(h, k, c)
            : `y = ${vertexForm(a, h, k)}`
          : conic
            ? horizontalConic(h, k, c)
            : `x = ${vertexForm(a, k, h, "y")}`;
        const answer = vertical ? `x = ${h}` : `y = ${k}`;
        return equationProblem({
          prompt: t(`Find the axis of symmetry of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的对称轴。`),
          answer,
          wrong: vertical ? [`y = ${k}`, `x = ${-h}`, `x = ${k}`, `y = ${h}`] : [`x = ${h}`, `y = ${-k}`, `y = ${h}`, `x = ${k}`],
          solution: t(
            `The vertex is $${pt(h, k)}$ and ${vertical ? "$x$ is squared, so the parabola opens up or down and its axis is vertical" : "$y$ is squared, so the parabola opens left or right and its axis is horizontal"}: $${answer}$.`,
            `顶点是 $${pt(h, k)}$，${vertical ? "$x$ 被平方，抛物线开口向上或向下，对称轴是竖直的" : "$y$ 被平方，抛物线开口向左或向右，对称轴是水平的"}：$${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheVertexOfAParabolaByCompletingTheSquare finds the vertex of x = ay² + by + c and of general second-degree equations. */
export const calculatingTheVertexOfAParabolaByCompletingTheSquare: TopicDef = {
  id: "calculating-the-vertex-of-a-parabola-by-completing-the-square",
  title: t("Calculating the Vertex of a Parabola by Completing the Square", "用配方法求抛物线的顶点"),
  summary: t(
    "Complete the square to find the vertex of $x = ay^{2} + by + c$ and of parabolas written as $x^{2} + Dx + Ey + F = 0$ or $y^{2} + Dy + Ex + F = 0$.",
    "用配方法求 $x = ay^{2} + by + c$ 以及写成 $x^{2} + Dx + Ey + F = 0$ 或 $y^{2} + Dy + Ex + F = 0$ 的抛物线的顶点。",
  ),
  prerequisites: ["the-vertex-of-a-parabola", "writing-the-equation-of-a-parabola-in-vertex-form"],
  encompasses: [
    { topic: "writing-the-equation-of-a-parabola-in-vertex-form", weight: 0.5 },
    { topic: "the-vertex-of-a-parabola", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.2", "CCSS.HSF.IF.C.8.A"],
  knowledgePoints: [
    {
      id: "completing-the-square-in-y",
      title: t("Completing the square in y", "对 y 配方"),
      explanation: t(
        "To find the vertex of $x = y^{2} + by + c$, complete the square in $y$ exactly as for $y = x^{2} + bx + c$, with the roles of $x$ and $y$ swapped:\n\n$$x = y^{2} - 4y + 1 = (y^{2} - 4y + 4) - 4 + 1 = (y - 2)^{2} - 3$$\n\nThis is $x = (y - k)^{2} + h$ with $k = 2$ and $h = -3$, so the vertex is $(-3, 2)$.",
        "要求 $x = y^{2} + by + c$ 的顶点，像对 $y = x^{2} + bx + c$ 那样对 $y$ 配方，只是 $x$ 与 $y$ 的角色互换：\n\n$$x = y^{2} - 4y + 1 = (y^{2} - 4y + 4) - 4 + 1 = (y - 2)^{2} - 3$$\n\n这就是 $x = (y - k)^{2} + h$，其中 $k = 2$，$h = -3$，所以顶点是 $(-3, 2)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1]);
        const k = rng.nonZero(-6, 6);
        const h = rng.int(-9, 9);
        const b = -2 * a * k;
        const c = a * k * k + h;
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $x = ${quad(a, b, c, "y")}$.`, `求抛物线 $x = ${quad(a, b, c, "y")}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [k, h],
            [c, k],
            [h, -k],
          ],
          solution: t(
            `Complete the square in $y$:${steps(`x = ${front(a)}(${quad(1, -2 * k, 0, "y")})${tail(c)}`, `x = ${front(a)}(${quad(1, -2 * k, k * k, "y")}) ${a > 0 ? "-" : "+"} ${k * k}${tail(c)}`, `x = ${vertexForm(a, k, h, "y")}`)}So $k = ${k}$, $h = ${h}$, and the vertex is $${pt(h, k)}$.`,
            `对 $y$ 配方：${steps(`x = ${front(a)}(${quad(1, -2 * k, 0, "y")})${tail(c)}`, `x = ${front(a)}(${quad(1, -2 * k, k * k, "y")}) ${a > 0 ? "-" : "+"} ${k * k}${tail(c)}`, `x = ${vertexForm(a, k, h, "y")}`)}所以 $k = ${k}$，$h = ${h}$，顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("With a leading coefficient", "二次项系数不为 1"),
      explanation: t(
        "When the coefficient of $y^{2}$ is not $1$, factor it out of the $y$-terms, complete the square inside, and multiply the square you take out by that coefficient:\n\n$$x = 2y^{2} + 12y + 13 = 2(y^{2} + 6y + 9) - 2 \\cdot 9 + 13 = 2(y + 3)^{2} - 5$$\n\nThe vertex is $(-5, -3)$.",
        "当 $y^{2}$ 的系数不为 $1$ 时，先从含 $y$ 的项中提出它，在括号内配方，移出括号的平方要乘以这个系数：\n\n$$x = 2y^{2} + 12y + 13 = 2(y^{2} + 6y + 9) - 2 \\cdot 9 + 13 = 2(y + 3)^{2} - 5$$\n\n顶点是 $(-5, -3)$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, -2, -3, -4]);
        const k = rng.nonZero(-5, 5);
        const h = rng.int(-9, 9);
        const b = -2 * a * k;
        const c = a * k * k + h;
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $x = ${quad(a, b, c, "y")}$.`, `求抛物线 $x = ${quad(a, b, c, "y")}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [k, h],
            [c - k * k, k],
            [h, -k],
          ],
          solution: t(
            `Factor $${a}$ out of the $y$-terms and complete the square:${steps(`x = ${a}(${quad(1, -2 * k, 0, "y")})${tail(c)}`, `x = ${a}(${quad(1, -2 * k, k * k, "y")}) - ${paren(a)} \\cdot ${k * k}${tail(c)}`, `x = ${vertexForm(a, k, h, "y")}`)}The vertex is $${pt(h, k)}$.`,
            `从含 $y$ 的项中提出 $${a}$ 并配方：${steps(`x = ${a}(${quad(1, -2 * k, 0, "y")})${tail(c)}`, `x = ${a}(${quad(1, -2 * k, k * k, "y")}) - ${paren(a)} \\cdot ${k * k}${tail(c)}`, `x = ${vertexForm(a, k, h, "y")}`)}顶点是 $${pt(h, k)}$。`,
          ),
        });
      },
    },
    {
      id: "from-the-general-form",
      title: t("From the general form", "由一般方程求顶点"),
      explanation: t(
        "A parabola may be written with everything on one side, such as $x^{2} - 6x - 4y + 1 = 0$. Keep the terms of the squared variable on one side, move the rest to the other, and complete the square:\n\n$$x^{2} - 6x = 4y - 1 \\Rightarrow x^{2} - 6x + 9 = 4y + 8 \\Rightarrow (x - 3)^{2} = 4(y + 2)$$\n\nFactor the coefficient of $y$ out on the right. The vertex is $(3, -2)$. If $y$ is the squared variable, do the same with $y$, and the result is $(y - k)^{2} = 4p(x - h)$.",
        "抛物线也可能把所有项写在一边，如 $x^{2} - 6x - 4y + 1 = 0$。把被平方的变量的项留在一边，其余移到另一边，再配方：\n\n$$x^{2} - 6x = 4y - 1 \\Rightarrow x^{2} - 6x + 9 = 4y + 8 \\Rightarrow (x - 3)^{2} = 4(y + 2)$$\n\n右边要提出 $y$ 的系数。顶点是 $(3, -2)$。若被平方的是 $y$，就对 $y$ 做同样的事，结果是 $(y - k)^{2} = 4p(x - h)$。",
      ),
      generate(rng) {
        const g = drawGeneralForm(rng, rng.bool());
        const how = completeTheSquareText(g);
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $${g.equation}$.`, `求抛物线 $${g.equation}$ 的顶点。`),
          answer: [g.h, g.k],
          wrong: [[-g.h, -g.k], [g.k, g.h], g.vertical ? [g.h, g.F] : [g.F, g.k]],
          solution: t(`${how.en}The vertex is $${pt(g.h, g.k)}$.`, `${how["zh-CN"]}顶点是 $${pt(g.h, g.k)}$。`),
        });
      },
    },
  ],
};

/** theFocusDirectrixPropertyOfAParabola defines a parabola by its focus and directrix and derives its equation. */
export const theFocusDirectrixPropertyOfAParabola: TopicDef = {
  id: "the-focus-directrix-property-of-a-parabola",
  title: t("The Focus-Directrix Property of a Parabola", "抛物线的焦点–准线性质"),
  summary: t(
    "A parabola is the set of points equally far from a point, the focus, and a line, the directrix. Use this to find distances, test points and write the equation from the focus and directrix.",
    "抛物线是到一个定点（焦点）和一条定直线（准线）距离相等的点的集合。用它求距离、检验点，并由焦点和准线写出方程。",
  ),
  prerequisites: ["the-vertex-of-a-parabola", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "the-vertex-of-a-parabola", weight: 0.3 },
    { topic: "the-pythagorean-theorem", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "equal-distances",
      title: t("Equal distances", "距离相等"),
      explanation: t(
        "A **parabola** is the set of all points that are the same distance from a fixed point, the **focus**, and a fixed line, the **directrix**. The vertex lies halfway between them, and $p$ is the signed distance from the vertex to the focus.\n\nThe distance from $P(x_0, y_0)$ to a horizontal line $y = d$ is $|y_0 - d|$, and to a vertical line $x = d$ it is $|x_0 - d|$. So for a point on a parabola, the distance to the focus can be found without the distance formula. In the figure, the focus is $F(0, 1)$, the directrix is $y = -1$, and $P(2, 1)$ is on the parabola: $P$ is $|1 - (-1)| = 2$ from the directrix, so $PF = 2$ too.",
        "**抛物线**是到一个定点（**焦点**）和一条定直线（**准线**）距离相等的所有点的集合。顶点位于两者正中间，$p$ 是从顶点到焦点的有向距离。\n\n点 $P(x_0, y_0)$ 到水平直线 $y = d$ 的距离是 $|y_0 - d|$，到竖直直线 $x = d$ 的距离是 $|x_0 - d|$。所以对抛物线上的点，不用距离公式也能求出它到焦点的距离。图中焦点是 $F(0, 1)$，准线是 $y = -1$，$P(2, 1)$ 在抛物线上：$P$ 到准线的距离是 $|1 - (-1)| = 2$，所以 $PF = 2$。",
      ),
      figure: {
        svg: plane(view, [
          verticalCurve(Q.of(1, 4), 0, 0),
          { kind: "line", a: [0, -1], b: [1, -1], dashed: true },
          { kind: "segment", a: [2, 1], b: [0, 1] },
          { kind: "segment", a: [2, 1], b: [2, -1] },
          { kind: "point", at: [0, 1], label: "F", dir: "nw" },
          { kind: "point", at: [2, 1], label: "P", dir: "e" },
          { kind: "point", at: [2, -1] },
        ]),
        alt: t(
          "The parabola x² = 4y with focus F(0, 1) and the dashed directrix y = −1. The point P(2, 1) on the parabola is joined to F and to the point (2, −1) on the directrix; both segments have length 2.",
          "抛物线 x² = 4y，焦点 F(0, 1)，虚线为准线 y = −1。抛物线上的点 P(2, 1) 与 F 以及准线上的点 (2, −1) 相连，两条线段长都是 2。",
        ),
      },
      generate(rng) {
        const vertical = rng.bool();
        const p = rng.pick([1, 2, 3, -1, -2, -3]);
        const s = rng.pick([1, 2, -1, -2]);
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const focus = vertical ? [h, k + p] : [h + p, k];
        const line = vertical ? `y = ${k - p}` : `x = ${h - p}`;
        const P = vertical ? [h + 2 * p * s, k + p * s * s] : [h + p * s * s, k + 2 * p * s];
        const along = vertical ? P[1]! : P[0]!;
        const distance = Math.abs(p) * (s * s + 1);
        return numberProblem({
          prompt: t(
            `A parabola has focus $F${pt(focus[0]!, focus[1]!)}$ and directrix $${line}$. The point $P${pt(P[0]!, P[1]!)}$ lies on the parabola. Find the distance $PF$.`,
            `一条抛物线的焦点是 $F${pt(focus[0]!, focus[1]!)}$，准线是 $${line}$。点 $P${pt(P[0]!, P[1]!)}$ 在抛物线上。求距离 $PF$。`,
          ),
          answer: distance,
          wrong: [Math.abs(p * (s * s - 1)), Math.abs(2 * p * s), Math.abs(p) * s * s, Math.abs(along)],
          solution: t(
            `Every point of the parabola is as far from the focus as from the directrix. The distance from $P$ to the directrix is${steps(`|${along} - ${paren(vertical ? k - p : h - p)}| = ${distance}`)}so $PF = ${distance}$.`,
            `抛物线上每一点到焦点的距离都等于它到准线的距离。$P$ 到准线的距离是${steps(`|${along} - ${paren(vertical ? k - p : h - p)}| = ${distance}`)}所以 $PF = ${distance}$。`,
          ),
        });
      },
    },
    {
      id: "is-the-point-on-the-parabola",
      title: t("Is the point on the parabola?", "点是否在抛物线上"),
      explanation: t(
        "To test whether a point $P$ lies on the parabola with a given focus and directrix, compute both distances and compare them. The distance to the focus comes from the distance formula $PF = \\sqrt{(x_0 - x_F)^{2} + (y_0 - y_F)^{2}}$; comparing squares avoids square roots.\n\nFocus $F(1, 2)$, directrix $y = -2$, point $P(5, 3)$:\n\n$$PF^{2} = (5 - 1)^{2} + (3 - 2)^{2} = 17, \\qquad d = |3 - (-2)| = 5, \\quad d^{2} = 25$$\n\n$17 \\ne 25$, so $P$ is not on the parabola.",
        "要检验点 $P$ 是否在给定焦点和准线的抛物线上，就算出两个距离并比较。到焦点的距离用距离公式 $PF = \\sqrt{(x_0 - x_F)^{2} + (y_0 - y_F)^{2}}$；比较平方可以避免开方。\n\n焦点 $F(1, 2)$，准线 $y = -2$，点 $P(5, 3)$：\n\n$$PF^{2} = (5 - 1)^{2} + (3 - 2)^{2} = 17, \\qquad d = |3 - (-2)| = 5, \\quad d^{2} = 25$$\n\n$17 \\ne 25$，所以 $P$ 不在抛物线上。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const on = rng.bool();
        const p = rng.pick([1, 2, 3, -1, -2, -3]);
        const s = rng.pick([1, 2, -1, -2]);
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const shift = on ? 0 : rng.pick([-2, -1, 1, 2]);
        const [fx, fy] = vertical ? [h, k + p] : [h + p, k];
        const directrix = vertical ? k - p : h - p;
        const [x0, y0] = vertical ? [h + 2 * p * s, k + p * s * s + shift] : [h + p * s * s + shift, k + 2 * p * s];
        const pf2 = (x0 - fx) ** 2 + (y0 - fy) ** 2;
        const along = vertical ? y0 : x0;
        const d = Math.abs(along - directrix);
        const work = steps(
          `PF^{2} = (${x0} - ${paren(fx)})^{2} + (${y0} - ${paren(fy)})^{2} = ${pf2}`,
          `d = |${along} - ${paren(directrix)}| = ${d}, \\quad d^{2} = ${d * d}`,
        );
        return choiceProblem({
          prompt: t(
            `A parabola has focus $${pt(fx, fy)}$ and directrix $${vertical ? "y" : "x"} = ${directrix}$. Is the point $${pt(x0, y0)}$ on the parabola?`,
            `一条抛物线的焦点是 $${pt(fx, fy)}$，准线是 $${vertical ? "y" : "x"} = ${directrix}$。点 $${pt(x0, y0)}$ 在这条抛物线上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `Compare the squared distances to the focus and to the directrix:${work}${on ? "They are equal, so the point is on the parabola." : `$${pf2} \\ne ${d * d}$, so the point is not on the parabola.`}`,
            `比较到焦点和到准线的距离的平方：${work}${on ? "两者相等，所以点在抛物线上。" : `$${pf2} \\ne ${d * d}$，所以点不在抛物线上。`}`,
          ),
        });
      },
    },
    {
      id: "equation-from-the-focus-and-directrix",
      title: t("The equation from the focus and directrix", "由焦点和准线求方程"),
      explanation: t(
        "Setting the two distances equal gives the equation. For focus $(0, p)$ and directrix $y = -p$:\n\n$$\\sqrt{x^{2} + (y - p)^{2}} = |y + p| \\Rightarrow x^{2} + y^{2} - 2py + p^{2} = y^{2} + 2py + p^{2} \\Rightarrow x^{2} = 4py$$\n\nIn general, the vertex is halfway between the focus and the directrix, and $p$ is the signed distance from the vertex to the focus. Focus $(2, 1)$ and directrix $y = -3$: the vertex is $(2, -1)$, the focus is $2$ above it so $p = 2$, and the equation is $(x - 2)^{2} = 8(y + 1)$. With a vertical directrix $x = d$ the parabola opens left or right: $(y - k)^{2} = 4p(x - h)$.",
        "令两个距离相等就得到方程。对焦点 $(0, p)$ 和准线 $y = -p$：\n\n$$\\sqrt{x^{2} + (y - p)^{2}} = |y + p| \\Rightarrow x^{2} + y^{2} - 2py + p^{2} = y^{2} + 2py + p^{2} \\Rightarrow x^{2} = 4py$$\n\n一般地，顶点在焦点与准线的正中间，$p$ 是从顶点到焦点的有向距离。焦点 $(2, 1)$，准线 $y = -3$：顶点是 $(2, -1)$，焦点在它上方 $2$ 个单位，所以 $p = 2$，方程是 $(x - 2)^{2} = 8(y + 1)$。若准线是竖直的 $x = d$，抛物线开口向左或向右：$(y - k)^{2} = 4p(x - h)$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const p = rng.nonZero(-4, 4);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const conic = vertical ? verticalConic : horizontalConic;
        const [fx, fy] = vertical ? [h, k + p] : [h + p, k];
        const directrix = vertical ? `y = ${k - p}` : `x = ${h - p}`;
        const answer = conic(h, k, 4 * p);
        const midpoint = vertical ? `k = \\frac{${k + p} + ${paren(k - p)}}{2} = ${k}` : `h = \\frac{${h + p} + ${paren(h - p)}}{2} = ${h}`;
        return equationProblem({
          prompt: t(
            `Write the equation of the parabola with focus $${pt(fx, fy)}$ and directrix $${directrix}$.`,
            `写出焦点为 $${pt(fx, fy)}$、准线为 $${directrix}$ 的抛物线的方程。`,
          ),
          answer,
          wrong: [
            conic(h, k, -4 * p),
            conic(h, k, 2 * p),
            conic(h, k, p),
            vertical ? verticalConic(fx, fy, 4 * p) : horizontalConic(fx, fy, 4 * p),
            vertical ? horizontalConic(h, k, 4 * p) : verticalConic(h, k, 4 * p),
          ],
          solution: t(
            `The vertex is halfway between the focus and the directrix:${steps(midpoint)}so the vertex is $${pt(h, k)}$, and the focus is $${Math.abs(p)}$ ${vertical ? (p > 0 ? "above" : "below") : p > 0 ? "to the right of" : "to the left of"} it: $p = ${p}$ and $4p = ${4 * p}$. The equation is $${answer}$.`,
            `顶点在焦点与准线的正中间：${steps(midpoint)}所以顶点是 $${pt(h, k)}$，焦点在它${vertical ? (p > 0 ? "上方" : "下方") : p > 0 ? "右方" : "左方"} $${Math.abs(p)}$ 个单位：$p = ${p}$，$4p = ${4 * p}$。方程是 $${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** focusOf is the focus of a parabola with vertex (h, k) and 4p = c, opening up or down when vertical. */
const focusOf = (vertical: boolean, h: Coefficient, k: Coefficient, c: Coefficient): [Q, Q] => {
  const p = toQ(c).div(Q.of(4));
  return vertical ? [toQ(h), toQ(k).add(p)] : [toQ(h).add(p), toQ(k)];
};

/** calculatingTheFocusOfAParabola finds the focus from the conic form, the vertex form and the general form. */
export const calculatingTheFocusOfAParabola: TopicDef = {
  id: "calculating-the-focus-of-a-parabola",
  title: t("Calculating the Focus of a Parabola", "求抛物线的焦点"),
  summary: t(
    "Find the focus of a parabola $p$ units from the vertex along its axis, from the conic form, from $y = a(x - h)^{2} + k$ with $p = \\frac{1}{4a}$, and from the general form.",
    "焦点在对称轴上、距顶点 $p$ 个单位；由圆锥曲线形式、由 $y = a(x - h)^{2} + k$（$p = \\frac{1}{4a}$）以及由一般方程求焦点。",
  ),
  prerequisites: ["the-focus-directrix-property-of-a-parabola", "calculating-the-vertex-of-a-parabola-by-completing-the-square"],
  encompasses: [
    { topic: "the-focus-directrix-property-of-a-parabola", weight: 0.4 },
    { topic: "calculating-the-vertex-of-a-parabola-by-completing-the-square", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "focus-from-the-conic-form",
      title: t("From the conic form", "由圆锥曲线形式求焦点"),
      explanation: t(
        "The focus lies on the axis of symmetry, $p$ units from the vertex, inside the parabola:\n\n- $(x - h)^{2} = 4p(y - k)$ has focus $(h, k + p)$;\n- $(y - k)^{2} = 4p(x - h)$ has focus $(h + p, k)$.\n\nFor $(x + 1)^{2} = -12(y - 4)$: the vertex is $(-1, 4)$, $4p = -12$ so $p = -3$, and the focus is $(-1, 4 + (-3)) = (-1, 1)$. Divide the coefficient by $4$ before moving from the vertex.",
        "焦点在对称轴上、距顶点 $p$ 个单位，位于抛物线内侧：\n\n- $(x - h)^{2} = 4p(y - k)$ 的焦点是 $(h, k + p)$；\n- $(y - k)^{2} = 4p(x - h)$ 的焦点是 $(h + p, k)$。\n\n对 $(x + 1)^{2} = -12(y - 4)$：顶点是 $(-1, 4)$，$4p = -12$，所以 $p = -3$，焦点是 $(-1, 4 + (-3)) = (-1, 1)$。从顶点出发移动之前，先把系数除以 $4$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const c = rng.nonZero(-12, 12);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const p = Q.of(c, 4);
        const [fx, fy] = focusOf(vertical, h, k, c);
        const equation = vertical ? verticalConic(h, k, c) : horizontalConic(h, k, c);
        return pointProblem({
          prompt: t(`Find the focus of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的焦点。`),
          answer: [fx, fy],
          wrong: [focusOf(vertical, h, k, 4 * c), focusOf(vertical, h, k, -c), focusOf(!vertical, h, k, c), [Q.of(h), Q.of(k)]],
          solution: t(
            `The vertex is $${pt(h, k)}$ and $4p = ${c}$, so $p = ${num(p)}$. The parabola opens ${directionWords(vertical, c > 0).en}, so the focus is $${pt(fx, fy)}$.`,
            `顶点是 $${pt(h, k)}$，$4p = ${c}$，所以 $p = ${num(p)}$。抛物线开口${directionWords(vertical, c > 0)["zh-CN"]}，所以焦点是 $${pt(fx, fy)}$。`,
          ),
        });
      },
    },
    {
      id: "focus-from-the-vertex-form",
      title: t("From the vertex form", "由顶点式求焦点"),
      explanation: t(
        "To find the focus of $y = a(x - h)^{2} + k$, divide by $a$: $(x - h)^{2} = \\frac{1}{a}(y - k)$, so $4p = \\frac{1}{a}$ and\n\n$$p = \\frac{1}{4a}$$\n\nFor $y = 2(x - 3)^{2} + 1$: $p = \\frac{1}{8}$, and the focus is $\\left(3, 1 + \\frac{1}{8}\\right) = \\left(3, \\frac{9}{8}\\right)$. Likewise $x = a(y - k)^{2} + h$ has focus $\\left(h + \\frac{1}{4a}, k\\right)$.",
        "要求 $y = a(x - h)^{2} + k$ 的焦点，两边除以 $a$：$(x - h)^{2} = \\frac{1}{a}(y - k)$，所以 $4p = \\frac{1}{a}$，\n\n$$p = \\frac{1}{4a}$$\n\n对 $y = 2(x - 3)^{2} + 1$：$p = \\frac{1}{8}$，焦点是 $\\left(3, 1 + \\frac{1}{8}\\right) = \\left(3, \\frac{9}{8}\\right)$。同样，$x = a(y - k)^{2} + h$ 的焦点是 $\\left(h + \\frac{1}{4a}, k\\right)$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const a = rng.pick(signedAs);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const c = Q.one.div(a);
        const p = c.div(Q.of(4));
        const [fx, fy] = focusOf(vertical, h, k, c);
        const equation = vertical ? `y = ${vertexForm(a, h, k)}` : `x = ${vertexForm(a, k, h, "y")}`;
        return pointProblem({
          prompt: t(`Find the focus of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的焦点。`),
          answer: [fx, fy],
          wrong: [
            focusOf(vertical, h, k, a.mul(Q.of(4))),
            focusOf(vertical, h, k, a.mul(Q.of(16))),
            focusOf(vertical, h, k, c.mul(Q.of(4))),
            focusOf(vertical, h, k, c.neg()),
          ],
          solution: t(
            `The vertex is $${pt(h, k)}$ and $a = ${num(a)}$, so${steps(`p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}`)}The parabola opens ${directionWords(vertical, a.sign() > 0).en}, and the focus is $${pt(fx, fy)}$.`,
            `顶点是 $${pt(h, k)}$，$a = ${num(a)}$，所以${steps(`p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}`)}抛物线开口${directionWords(vertical, a.sign() > 0)["zh-CN"]}，焦点是 $${pt(fx, fy)}$。`,
          ),
        });
      },
    },
    {
      id: "focus-from-the-general-form",
      title: t("From the general form", "由一般方程求焦点"),
      explanation: t(
        "When the equation is in general form, first complete the square to reach the conic form, then read the vertex and $p$:\n\n$$y^{2} + 4y - 8x + 20 = 0 \\Rightarrow y^{2} + 4y + 4 = 8x - 16 \\Rightarrow (y + 2)^{2} = 8(x - 2)$$\n\nThe vertex is $(2, -2)$ and $4p = 8$, so $p = 2$ and the focus is $(4, -2)$.",
        "方程是一般形式时，先配方化成圆锥曲线形式，再读出顶点和 $p$：\n\n$$y^{2} + 4y - 8x + 20 = 0 \\Rightarrow y^{2} + 4y + 4 = 8x - 16 \\Rightarrow (y + 2)^{2} = 8(x - 2)$$\n\n顶点是 $(2, -2)$，$4p = 8$，所以 $p = 2$，焦点是 $(4, -2)$。",
      ),
      generate(rng) {
        const g = drawGeneralForm(rng, rng.bool());
        const how = completeTheSquareText(g);
        const p = Q.of(g.c, 4);
        const [fx, fy] = focusOf(g.vertical, g.h, g.k, g.c);
        return pointProblem({
          prompt: t(`Find the focus of the parabola $${g.equation}$.`, `求抛物线 $${g.equation}$ 的焦点。`),
          answer: [fx, fy],
          wrong: [
            [Q.of(g.h), Q.of(g.k)],
            focusOf(g.vertical, g.h, g.k, 4 * g.c),
            focusOf(g.vertical, g.h, g.k, -g.c),
            focusOf(!g.vertical, g.h, g.k, g.c),
          ],
          solution: t(
            `${how.en}The vertex is $${pt(g.h, g.k)}$ and $4p = ${g.c}$, so $p = ${num(p)}$ and the focus is $${pt(fx, fy)}$.`,
            `${how["zh-CN"]}顶点是 $${pt(g.h, g.k)}$，$4p = ${g.c}$，所以 $p = ${num(p)}$，焦点是 $${pt(fx, fy)}$。`,
          ),
        });
      },
    },
  ],
};

/** directrixOf writes the directrix of a parabola with vertex (h, k) and 4p = c, opening up or down when vertical. */
const directrixOf = (vertical: boolean, h: Coefficient, k: Coefficient, c: Coefficient): string => {
  const p = toQ(c).div(Q.of(4));
  return vertical ? `y = ${num(toQ(k).sub(p))}` : `x = ${num(toQ(h).sub(p))}`;
};

/** calculatingTheDirectrixOfAParabola finds the directrix from the conic form, the vertex form, and the vertex and focus. */
export const calculatingTheDirectrixOfAParabola: TopicDef = {
  id: "calculating-the-directrix-of-a-parabola",
  title: t("Calculating the Directrix of a Parabola", "求抛物线的准线"),
  summary: t(
    "Find the directrix, the line $p$ units from the vertex on the side opposite the focus, from the conic form, from the vertex form, and from the vertex and focus.",
    "准线是在焦点对侧、距顶点 $p$ 个单位的直线；由圆锥曲线形式、顶点式以及由顶点和焦点求准线。",
  ),
  prerequisites: ["calculating-the-focus-of-a-parabola"],
  encompasses: [{ topic: "calculating-the-focus-of-a-parabola", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.2"],
  knowledgePoints: [
    {
      id: "directrix-from-the-conic-form",
      title: t("From the conic form", "由圆锥曲线形式求准线"),
      explanation: t(
        "The directrix is perpendicular to the axis of symmetry, $p$ units from the vertex on the side away from the focus, outside the parabola:\n\n- $(x - h)^{2} = 4p(y - k)$ has directrix $y = k - p$;\n- $(y - k)^{2} = 4p(x - h)$ has directrix $x = h - p$.\n\nFor $(y - 1)^{2} = 6(x + 2)$: the vertex is $(-2, 1)$, $p = \\frac{6}{4} = \\frac{3}{2}$, and the directrix is $x = -2 - \\frac{3}{2} = -\\frac{7}{2}$. A parabola opening left or right has a vertical directrix $x = \\ldots$.",
        "准线垂直于对称轴，在远离焦点的一侧、距顶点 $p$ 个单位，位于抛物线外侧：\n\n- $(x - h)^{2} = 4p(y - k)$ 的准线是 $y = k - p$；\n- $(y - k)^{2} = 4p(x - h)$ 的准线是 $x = h - p$。\n\n对 $(y - 1)^{2} = 6(x + 2)$：顶点是 $(-2, 1)$，$p = \\frac{6}{4} = \\frac{3}{2}$，准线是 $x = -2 - \\frac{3}{2} = -\\frac{7}{2}$。开口向左或向右的抛物线，准线是竖直的 $x = \\ldots$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const c = rng.nonZero(-12, 12);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const p = Q.of(c, 4);
        const equation = vertical ? verticalConic(h, k, c) : horizontalConic(h, k, c);
        const answer = directrixOf(vertical, h, k, c);
        return equationProblem({
          prompt: t(`Find the directrix of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的准线。`),
          answer,
          wrong: [
            directrixOf(vertical, h, k, -c),
            directrixOf(vertical, h, k, 4 * c),
            directrixOf(!vertical, h, k, c),
            vertical ? `x = ${h}` : `y = ${k}`,
          ],
          solution: t(
            `The vertex is $${pt(h, k)}$ and $p = \\frac{${c}}{4} = ${num(p)}$. The directrix is on the side away from the focus:${steps(`${answer.replace(/ = .*/, "")} = ${vertical ? k : h} - ${paren(p)} = ${answer.replace(/^. = /, "")}`)}`,
            `顶点是 $${pt(h, k)}$，$p = \\frac{${c}}{4} = ${num(p)}$。准线在远离焦点的一侧：${steps(`${answer.replace(/ = .*/, "")} = ${vertical ? k : h} - ${paren(p)} = ${answer.replace(/^. = /, "")}`)}`,
          ),
        });
      },
    },
    {
      id: "directrix-from-the-vertex-form",
      title: t("From the vertex form", "由顶点式求准线"),
      explanation: t(
        "For $y = a(x - h)^{2} + k$, $p = \\frac{1}{4a}$ and the directrix is $y = k - \\frac{1}{4a}$. For $y = -\\frac{1}{8}(x + 1)^{2} + 3$: $p = \\frac{1}{4 \\cdot (-\\frac{1}{8})} = -2$, and the directrix is $y = 3 - (-2) = 5$, above the downward-opening parabola. Likewise $x = a(y - k)^{2} + h$ has directrix $x = h - \\frac{1}{4a}$.",
        "对 $y = a(x - h)^{2} + k$，$p = \\frac{1}{4a}$，准线是 $y = k - \\frac{1}{4a}$。对 $y = -\\frac{1}{8}(x + 1)^{2} + 3$：$p = \\frac{1}{4 \\cdot (-\\frac{1}{8})} = -2$，准线是 $y = 3 - (-2) = 5$，在这条开口向下的抛物线上方。同样，$x = a(y - k)^{2} + h$ 的准线是 $x = h - \\frac{1}{4a}$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const a = rng.pick(signedAs);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const c = Q.one.div(a);
        const p = c.div(Q.of(4));
        const equation = vertical ? `y = ${vertexForm(a, h, k)}` : `x = ${vertexForm(a, k, h, "y")}`;
        const answer = directrixOf(vertical, h, k, c);
        return equationProblem({
          prompt: t(`Find the directrix of the parabola $${equation}$.`, `求抛物线 $${equation}$ 的准线。`),
          answer,
          wrong: [
            directrixOf(vertical, h, k, c.neg()),
            directrixOf(vertical, h, k, a.mul(Q.of(4))),
            directrixOf(vertical, h, k, c.mul(Q.of(4))),
            directrixOf(!vertical, h, k, c),
          ],
          solution: t(
            `The vertex is $${pt(h, k)}$ and $p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}$, so the directrix is $${answer}$.`,
            `顶点是 $${pt(h, k)}$，$p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}$，所以准线是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "directrix-from-the-vertex-and-focus",
      title: t("From the vertex and focus", "由顶点和焦点求准线"),
      explanation: t(
        "The vertex is the midpoint between the focus and the directrix, so the directrix is as far beyond the vertex as the focus is on the other side. Vertex $(2, 1)$ and focus $(2, 4)$: the focus is $3$ above the vertex, so the directrix is $3$ below it, $y = 1 - 3 = -2$. If the vertex and focus have the same $y$-coordinate, the axis is horizontal and the directrix is a vertical line $x = \\ldots$.",
        "顶点是焦点与准线的中点，所以准线在顶点另一侧，与顶点的距离等于焦点到顶点的距离。顶点 $(2, 1)$，焦点 $(2, 4)$：焦点在顶点上方 $3$ 个单位，所以准线在顶点下方 $3$ 个单位，$y = 1 - 3 = -2$。若顶点与焦点的纵坐标相同，对称轴是水平的，准线是竖直直线 $x = \\ldots$。",
      ),
      generate(rng) {
        const vertical = rng.bool();
        const p = rng.nonZero(-5, 5);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const [fx, fy] = vertical ? [h, k + p] : [h + p, k];
        const answer = vertical ? `y = ${k - p}` : `x = ${h - p}`;
        return equationProblem({
          prompt: t(
            `A parabola has vertex $${pt(h, k)}$ and focus $${pt(fx, fy)}$. Find its directrix.`,
            `一条抛物线的顶点是 $${pt(h, k)}$，焦点是 $${pt(fx, fy)}$。求它的准线。`,
          ),
          answer,
          wrong: vertical
            ? [`y = ${k + p}`, `y = ${k - 2 * p}`, `x = ${h}`, `x = ${h - p}`]
            : [`x = ${h + p}`, `x = ${h - 2 * p}`, `y = ${k}`, `y = ${k - p}`],
          solution: t(
            `The focus is $${Math.abs(p)}$ ${vertical ? (p > 0 ? "above" : "below") : p > 0 ? "to the right of" : "to the left of"} the vertex, so $p = ${p}$ and the directrix is $${Math.abs(p)}$ units on the other side: $${answer}$.`,
            `焦点在顶点${vertical ? (p > 0 ? "上方" : "下方") : p > 0 ? "右方" : "左方"} $${Math.abs(p)}$ 个单位，所以 $p = ${p}$，准线在另一侧 $${Math.abs(p)}$ 个单位处：$${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** pmRoot lists center ± √n in simplest form: two values, one when n = 0, none when n < 0. */
function pmRoot(center: number, n: number): string[] {
  if (n < 0) return [];
  if (n === 0) return [num(center)];
  const [c, m] = simplifyRadical(n);
  if (m === 1) return [num(center + c), num(center - c)];
  return [surdLatex(surd(Q.of(center), Q.of(c), BigInt(m))), surdLatex(surd(Q.of(center), Q.of(-c), BigInt(m)))];
}

/** calculatingInterceptsOfParabolas finds where parabolas, especially those opening left or right, cross the axes. */
export const calculatingInterceptsOfParabolas: TopicDef = {
  id: "calculating-intercepts-of-parabolas",
  title: t("Calculating Intercepts of Parabolas", "求抛物线与坐标轴的交点"),
  summary: t(
    "Find the $x$-intercept and the $y$-intercepts of a parabola opening left or right, and the $x$-intercepts of a parabola in conic form.",
    "求开口向左或向右的抛物线与 $x$ 轴、$y$ 轴的交点，以及圆锥曲线形式的抛物线与 $x$ 轴的交点。",
  ),
  prerequisites: ["the-vertex-of-a-parabola", "roots-of-quadratic-functions"],
  encompasses: [
    { topic: "roots-of-quadratic-functions", weight: 0.4 },
    { topic: "the-vertex-of-a-parabola", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "the-x-intercept-of-a-horizontal-parabola",
      title: t("The x-intercept of a horizontal parabola", "开口向左右的抛物线与 x 轴的交点"),
      explanation: t(
        "Every point of the $x$-axis has $y = 0$. A parabola $x = ay^{2} + by + c$ gives exactly one $x$ for each $y$, so it crosses the $x$-axis exactly once, where $y = 0$:\n\n$$x = 2(0)^{2} - 3(0) + 5 = 5$$\n\nso $x = 2y^{2} - 3y + 5$ has $x$-intercept $(5, 0)$. For $x = -(y - 2)^{2} + 1$: $x = -(0 - 2)^{2} + 1 = -3$, so the $x$-intercept is $(-3, 0)$.",
        "$x$ 轴上每一点都有 $y = 0$。抛物线 $x = ay^{2} + by + c$ 对每个 $y$ 恰好给出一个 $x$，所以它与 $x$ 轴恰有一个交点，在 $y = 0$ 处：\n\n$$x = 2(0)^{2} - 3(0) + 5 = 5$$\n\n所以 $x = 2y^{2} - 3y + 5$ 与 $x$ 轴的交点是 $(5, 0)$。对 $x = -(y - 2)^{2} + 1$：$x = -(0 - 2)^{2} + 1 = -3$，所以与 $x$ 轴的交点是 $(-3, 0)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const vertex = rng.bool();
        if (vertex) {
          const k = rng.nonZero(-5, 5);
          const h = rng.int(-9, 9);
          const x = a * k * k + h;
          return pointProblem({
            prompt: t(
              `Find the $x$-intercept of the parabola $x = ${vertexForm(a, k, h, "y")}$.`,
              `求抛物线 $x = ${vertexForm(a, k, h, "y")}$ 与 $x$ 轴的交点。`,
            ),
            answer: [x, 0],
            wrong: [
              [h, 0],
              [0, x],
              [h - a * k * k, 0],
            ],
            solution: t(
              `Substitute $y = 0$:${steps(`x = ${front(a)}(0 - ${paren(k)})^{2}${tail(h)} = ${x}`)}The $x$-intercept is $${pt(x, 0)}$.`,
              `代入 $y = 0$：${steps(`x = ${front(a)}(0 - ${paren(k)})^{2}${tail(h)} = ${x}`)}与 $x$ 轴的交点是 $${pt(x, 0)}$。`,
            ),
          });
        }
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        return pointProblem({
          prompt: t(
            `Find the $x$-intercept of the parabola $x = ${quad(a, b, c, "y")}$.`,
            `求抛物线 $x = ${quad(a, b, c, "y")}$ 与 $x$ 轴的交点。`,
          ),
          answer: [c, 0],
          wrong: [
            [0, c],
            [a + b + c, 0],
            [b, 0],
          ],
          solution: t(
            `Substitute $y = 0$: every term with $y$ vanishes and $x = ${c}$. The $x$-intercept is $${pt(c, 0)}$.`,
            `代入 $y = 0$：含 $y$ 的项都为零，$x = ${c}$。与 $x$ 轴的交点是 $${pt(c, 0)}$。`,
          ),
        });
      },
    },
    {
      id: "the-y-intercepts-of-a-horizontal-parabola",
      title: t("The y-intercepts of a horizontal parabola", "开口向左右的抛物线与 y 轴的交点"),
      explanation: t(
        "Points of the $y$-axis have $x = 0$, so the $y$-intercepts of $x = ay^{2} + by + c$ come from solving the quadratic equation $ay^{2} + by + c = 0$: there may be two, one or none.\n\n$$x = y^{2} - y - 6: \\quad y^{2} - y - 6 = 0 \\Rightarrow (y - 3)(y + 2) = 0$$\n\nso the $y$-intercepts are $(0, 3)$ and $(0, -2)$. When the vertex is on the same side of the $y$-axis as the direction the parabola opens, such as $x = (y - 1)^{2} + 4$, the parabola never reaches the $y$-axis.",
        "$y$ 轴上的点有 $x = 0$，所以 $x = ay^{2} + by + c$ 与 $y$ 轴的交点由一元二次方程 $ay^{2} + by + c = 0$ 求得：可能有两个、一个或没有。\n\n$$x = y^{2} - y - 6: \\quad y^{2} - y - 6 = 0 \\Rightarrow (y - 3)(y + 2) = 0$$\n\n所以与 $y$ 轴的交点是 $(0, 3)$ 和 $(0, -2)$。若顶点在 $y$ 轴的一侧，而抛物线又朝这一侧开口，如 $x = (y - 1)^{2} + 4$，抛物线就碰不到 $y$ 轴。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2]);
        if (rng.bool(0.7)) {
          let r: number;
          let s: number;
          do {
            r = rng.int(-6, 6);
            s = rng.int(-6, 6);
          } while (r === s || r === -s);
          const b = -a * (r + s);
          const c = a * r * s;
          return solutionsProblem({
            prompt: t(
              `Find the $y$-coordinates of the $y$-intercepts of the parabola $x = ${quad(a, b, c, "y")}$. Write $\\varnothing$ if there are none.`,
              `求抛物线 $x = ${quad(a, b, c, "y")}$ 与 $y$ 轴交点的纵坐标。若没有交点，写 $\\varnothing$。`,
            ),
            values: [num(r), num(s)],
            variable: "y",
            wrong: [[num(-r), num(-s)], [num(c)], []],
            solution: t(
              `Set $x = 0$ and factor:${steps(`${quad(a, b, c, "y")} = 0`, `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`)}so $y = ${r}$ or $y = ${s}$: the $y$-intercepts are $${pt(0, r)}$ and $${pt(0, s)}$.`,
              `令 $x = 0$ 并分解因式：${steps(`${quad(a, b, c, "y")} = 0`, `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`)}所以 $y = ${r}$ 或 $y = ${s}$：与 $y$ 轴的交点是 $${pt(0, r)}$ 和 $${pt(0, s)}$。`,
            ),
          });
        }
        const k = rng.nonZero(-5, 5);
        const h = (a > 0 ? 1 : -1) * rng.int(1, 9);
        const b = -2 * a * k;
        const c = a * k * k + h;
        return solutionsProblem({
          prompt: t(
            `Find the $y$-coordinates of the $y$-intercepts of the parabola $x = ${quad(a, b, c, "y")}$. Write $\\varnothing$ if there are none.`,
            `求抛物线 $x = ${quad(a, b, c, "y")}$ 与 $y$ 轴交点的纵坐标。若没有交点，写 $\\varnothing$。`,
          ),
          values: [],
          variable: "y",
          wrong: [[num(k)], [num(c)]],
          solution: t(
            `Complete the square: $x = ${vertexForm(a, k, h, "y")}$. Setting $x = 0$ gives $${sq(k, "y")} = ${num(Q.of(-h, a))}$, and a square cannot be negative: there are no $y$-intercepts, $\\varnothing$. The vertex $${pt(h, k)}$ is on the ${h > 0 ? "right" : "left"} of the $y$-axis and the parabola opens ${a > 0 ? "to the right" : "to the left"}.`,
            `配方：$x = ${vertexForm(a, k, h, "y")}$。令 $x = 0$ 得 $${sq(k, "y")} = ${num(Q.of(-h, a))}$，平方不可能是负数：与 $y$ 轴没有交点，$\\varnothing$。顶点 $${pt(h, k)}$ 在 $y$ 轴${h > 0 ? "右" : "左"}侧，抛物线开口${a > 0 ? "向右" : "向左"}。`,
          ),
        });
      },
    },
    {
      id: "x-intercepts-from-the-conic-form",
      title: t("x-intercepts from the conic form", "由圆锥曲线形式求与 x 轴的交点"),
      explanation: t(
        "To find the $x$-intercepts of $(x - h)^{2} = 4p(y - k)$, substitute $y = 0$ and take square roots:\n\n$$(x - 1)^{2} = 4(0 - (-3)) = 12 \\Rightarrow x - 1 = \\pm\\sqrt{12} = \\pm 2\\sqrt{3} \\Rightarrow x = 1 \\pm 2\\sqrt{3}$$\n\nIf the right side is negative there are no $x$-intercepts, and if it is $0$ the vertex is on the $x$-axis.",
        "要求 $(x - h)^{2} = 4p(y - k)$ 与 $x$ 轴的交点，代入 $y = 0$ 再开平方：\n\n$$(x - 1)^{2} = 4(0 - (-3)) = 12 \\Rightarrow x - 1 = \\pm\\sqrt{12} = \\pm 2\\sqrt{3} \\Rightarrow x = 1 \\pm 2\\sqrt{3}$$\n\n若右边为负，就与 $x$ 轴没有交点；若为 $0$，顶点就在 $x$ 轴上。",
      ),
      generate(rng) {
        const c = rng.nonZero(-8, 8);
        const h = rng.int(-5, 5);
        const k = (rng.bool(0.8) ? -Math.sign(c) : Math.sign(c)) * rng.int(1, 6);
        const n = -c * k;
        const values = pmRoot(h, n);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the $x$-intercepts of the parabola $${verticalConic(h, k, c)}$. Write $\\varnothing$ if there are none.`,
            `求抛物线 $${verticalConic(h, k, c)}$ 与 $x$ 轴交点的横坐标。若没有交点，写 $\\varnothing$。`,
          ),
          values,
          wrong: [pmRoot(h, -n), pmRoot(-h, n), n > 0 ? [num(h + n), num(h - n)] : [num(h)]],
          solution: t(
            `Substitute $y = 0$:${steps(`${sq(h)} = ${c}(0 - ${paren(k)}) = ${n}`)}${n < 0 ? "A square cannot be negative, so there are no $x$-intercepts: $\\varnothing$." : `Take square roots: $x = ${values.join("$ or $x = ")}$.`}`,
            `代入 $y = 0$：${steps(`${sq(h)} = ${c}(0 - ${paren(k)}) = ${n}`)}${n < 0 ? "平方不可能是负数，所以与 $x$ 轴没有交点：$\\varnothing$。" : `开平方：$x = ${values.join("$ 或 $x = ")}$。`}`,
          ),
        });
      },
    },
  ],
};

/** drawBySign draws ay² + by + c with integer coefficients whose discriminant has the given sign. */
function drawBySign(rng: Rng, sign: -1 | 0 | 1): [number, number, number] {
  if (sign === 0) {
    const a = rng.nonZero(-3, 3);
    const k = rng.nonZero(-5, 5);
    return [a, -2 * a * k, a * k * k];
  }
  for (;;) {
    const a = rng.nonZero(-3, 3);
    const b = rng.int(-10, 10);
    const c = rng.nonZero(-12, 12);
    if (Math.sign(b * b - 4 * a * c) === sign) return [a, b, c];
  }
}

/** lineXmy writes the line x − my = n. */
const lineXmy = (m: number, n: number) => `${poly([1, "x"], [-m, "y"])} = ${n}`;

/** intersectionsOfParabolasWithLines finds where lines meet parabolas opening left or right. */
export const intersectionsOfParabolasWithLines: TopicDef = {
  id: "intersections-of-parabolas-with-lines",
  title: t("Intersections of Parabolas With Lines", "抛物线与直线的交点"),
  summary: t(
    "Find where vertical and slanted lines meet a parabola opening left or right, and count the intersection points with the discriminant.",
    "求竖直直线和斜直线与开口向左或向右的抛物线的交点，并用判别式数交点个数。",
  ),
  prerequisites: ["calculating-intercepts-of-parabolas", "finding-intersections-of-lines-and-quadratic-functions"],
  encompasses: [
    { topic: "finding-intersections-of-lines-and-quadratic-functions", weight: 0.4 },
    { topic: "calculating-intercepts-of-parabolas", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.7"],
  knowledgePoints: [
    {
      id: "vertical-lines",
      title: t("Vertical lines", "竖直直线"),
      explanation: t(
        "A vertical line $x = d$ can meet a parabola opening left or right at two points. Substitute $x = d$ and solve for $y$:\n\n$$x = (y - 1)^{2} - 3, \\; x = 6: \\quad 6 = (y - 1)^{2} - 3 \\Rightarrow (y - 1)^{2} = 9 \\Rightarrow y = 4 \\text{ or } y = -2$$\n\nThe intersection points are $(6, 4)$ and $(6, -2)$; both have $x = 6$.",
        "竖直直线 $x = d$ 可能与开口向左或向右的抛物线交于两点。代入 $x = d$ 并解出 $y$：\n\n$$x = (y - 1)^{2} - 3, \\; x = 6: \\quad 6 = (y - 1)^{2} - 3 \\Rightarrow (y - 1)^{2} = 9 \\Rightarrow y = 4 \\text{ 或 } y = -2$$\n\n交点是 $(6, 4)$ 和 $(6, -2)$；它们的横坐标都是 $6$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1, 2, -2]);
        const d = rng.int(1, 3);
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const x = h + a * d * d;
        return pointProblem({
          prompt: t(
            `The line $x = ${x}$ meets the parabola $x = ${vertexForm(a, k, h, "y")}$ at two points. Find the one with the greater $y$-coordinate.`,
            `直线 $x = ${x}$ 与抛物线 $x = ${vertexForm(a, k, h, "y")}$ 交于两点。求纵坐标较大的那个交点。`,
          ),
          answer: [x, k + d],
          wrong: [
            [x, k - d],
            [k + d, x],
            [x, d],
            [x, -k + d],
          ],
          solution: t(
            `Substitute $x = ${x}$:${steps(`${x} = ${vertexForm(a, k, h, "y")}`, `${sq(k, "y")} = ${d * d}`)}so $y = ${k} + ${d} = ${k + d}$ or $y = ${k} - ${d} = ${k - d}$. The greater is $y = ${k + d}$, and the point is $${pt(x, k + d)}$.`,
            `代入 $x = ${x}$：${steps(`${x} = ${vertexForm(a, k, h, "y")}`, `${sq(k, "y")} = ${d * d}`)}所以 $y = ${k} + ${d} = ${k + d}$ 或 $y = ${k} - ${d} = ${k - d}$。较大的是 $y = ${k + d}$，交点是 $${pt(x, k + d)}$。`,
          ),
        });
      },
    },
    {
      id: "slanted-lines",
      title: t("Slanted lines", "斜直线"),
      explanation: t(
        "To intersect $x = ay^{2} + by + c$ with a line, solve the line for $x$ and substitute, which leaves a quadratic equation in $y$. For $x = y^{2} - 2y - 1$ and $x - y = 3$:\n\n$$x = y + 3 \\Rightarrow y + 3 = y^{2} - 2y - 1 \\Rightarrow y^{2} - 3y - 4 = 0 \\Rightarrow (y - 4)(y + 1) = 0$$\n\nAt $y = 4$, $x = 7$; at $y = -1$, $x = 2$. The intersection points are $(7, 4)$ and $(2, -1)$.",
        "要求 $x = ay^{2} + by + c$ 与直线的交点，先把直线方程解出 $x$ 再代入，得到关于 $y$ 的一元二次方程。对 $x = y^{2} - 2y - 1$ 与 $x - y = 3$：\n\n$$x = y + 3 \\Rightarrow y + 3 = y^{2} - 2y - 1 \\Rightarrow y^{2} - 3y - 4 = 0 \\Rightarrow (y - 4)(y + 1) = 0$$\n\n$y = 4$ 时 $x = 7$；$y = -1$ 时 $x = 2$。交点是 $(7, 4)$ 和 $(2, -1)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, -1]);
        const m = rng.nonZero(-3, 3);
        const n = rng.int(-6, 6);
        let r: number;
        let s: number;
        do {
          r = rng.int(-5, 5);
          s = rng.int(-5, 5);
        } while (r === s);
        const b = m - a * (r + s);
        const c = n + a * r * s;
        const top = Math.max(r, s);
        const low = Math.min(r, s);
        return pointProblem({
          prompt: t(
            `The line $${lineXmy(m, n)}$ meets the parabola $x = ${quad(a, b, c, "y")}$ at two points. Find the one with the greater $y$-coordinate.`,
            `直线 $${lineXmy(m, n)}$ 与抛物线 $x = ${quad(a, b, c, "y")}$ 交于两点。求纵坐标较大的那个交点。`,
          ),
          answer: [m * top + n, top],
          wrong: [
            [m * low + n, low],
            [top, m * top + n],
            [a * top * top + b * top, top],
          ],
          solution: t(
            `Solve the line for $x$: $x = ${linear(m, n, "y")}$. Substitute and collect terms:${steps(`${linear(m, n, "y")} = ${quad(a, b, c, "y")}`, `${quad(a, b - m, c - n, "y")} = 0`, `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`)}so $y = ${r}$ or $y = ${s}$. The greater is $y = ${top}$, and on the line $x = ${m * top + n}$. The point is $${pt(m * top + n, top)}$.`,
            `把直线方程解出 $x$：$x = ${linear(m, n, "y")}$。代入并整理：${steps(`${linear(m, n, "y")} = ${quad(a, b, c, "y")}`, `${quad(a, b - m, c - n, "y")} = 0`, `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`)}所以 $y = ${r}$ 或 $y = ${s}$。较大的是 $y = ${top}$，在直线上 $x = ${m * top + n}$。交点是 $${pt(m * top + n, top)}$。`,
          ),
        });
      },
    },
    {
      id: "counting-intersection-points",
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        "After substituting, the discriminant of the quadratic equation in $y$ counts the intersection points: two if it is positive, one if it is $0$ (the line is **tangent** to the parabola), none if it is negative. For $x = y^{2} + 3$ and $x - 2y = 1$:\n\n$$2y + 1 = y^{2} + 3 \\Rightarrow y^{2} - 2y + 2 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 2 = -4 < 0$$\n\nso the line misses the parabola.",
        "代入后，关于 $y$ 的一元二次方程的判别式决定交点个数：为正有两个，为 $0$ 有一个（直线与抛物线**相切**），为负则没有。对 $x = y^{2} + 3$ 与 $x - 2y = 1$：\n\n$$2y + 1 = y^{2} + 3 \\Rightarrow y^{2} - 2y + 2 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 2 = -4 < 0$$\n\n所以直线与抛物线不相交。",
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [A, B, C] = drawBySign(rng, sign);
        const m = rng.nonZero(-4, 4);
        const n = rng.int(-8, 8);
        const b = B + m;
        const c = C + n;
        const d = B * B - 4 * A * C;
        return choiceProblem({
          prompt: t(
            `How many points do the line $${lineXmy(m, n)}$ and the parabola $x = ${quad(A, b, c, "y")}$ have in common?`,
            `直线 $${lineXmy(m, n)}$ 与抛物线 $x = ${quad(A, b, c, "y")}$ 有几个公共点？`,
          ),
          options: [t("None", "没有交点"), t("Exactly one", "恰有一个"), t("Two", "两个")],
          correct: sign + 1,
          solution: t(
            `Substitute $x = ${linear(m, n, "y")}$ and move everything to one side:${steps(`${quad(A, B, C, "y")} = 0`, `b^{2} - 4ac = ${paren(B)}^{2} - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${d}`)}The discriminant is ${d > 0 ? "positive: two points" : d === 0 ? "zero: exactly one point, where the line is tangent" : "negative: no common points"}.`,
            `代入 $x = ${linear(m, n, "y")}$ 并把所有项移到一边：${steps(`${quad(A, B, C, "y")} = 0`, `b^{2} - 4ac = ${paren(B)}^{2} - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${d}`)}判别式${d > 0 ? "为正：有两个公共点" : d === 0 ? "为零：恰有一个公共点，直线与抛物线相切" : "为负：没有公共点"}。`,
          ),
        });
      },
    },
  ],
};

/** conicTopics are the topics of the parabolas-as-conic-sections module of Algebra II, in teaching order. */
export const conicTopics: readonly TopicDef[] = [
  upwardAndDownwardOpeningParabolas,
  leftAndRightOpeningParabolas,
  theVertexOfAParabola,
  calculatingTheVertexOfAParabolaByCompletingTheSquare,
  theFocusDirectrixPropertyOfAParabola,
  calculatingTheFocusOfAParabola,
  calculatingTheDirectrixOfAParabola,
  calculatingInterceptsOfParabolas,
  intersectionsOfParabolasWithLines,
];
