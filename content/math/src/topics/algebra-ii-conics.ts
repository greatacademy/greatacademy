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
import { conicDrawings } from "../explanation-drawings-conics.ts";
import { choiceProblem, equationProblem, numberProblem, pointProblem, solutionsProblem, steps, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** label is the bold label of step i in both locales, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** said is a closing check paragraph in both locales. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

/** both is the same displayed work after an English and a Chinese lead-in. */
const both = (en: string, zh: string, ...lines: readonly string[]) => {
  const work = steps(...lines).trimEnd();
  return t(`${en}${work}`, `${zh}${work}`);
};

/** quarter writes c/4 as a fraction and, when it simplifies, its simplest form: "\frac{6}{4} = \frac{3}{2}". */
function quarter(c: number): string {
  const f = `\\frac{${c}}{4}`;
  const v = num(Q.of(c, 4));
  return v === f ? f : `${f} = ${v}`;
}

/** disp is displayed work that closes a paragraph. */
const disp = (...lines: readonly string[]) => steps(...lines).trimEnd();

/** pm writes a signed number as an added term: "+ 3" or "- 3". */
const pm = (n: Coefficient) => (toQ(n).sign() < 0 ? `- ${num(toQ(n).neg())}` : `+ ${num(n)}`);

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

/** vertexByFormula checks the vertex (h, k) of x = ay² + by + c with y = −b/(2a) and substitution. */
function vertexByFormula(a: number, b: number, c: number, k: number, h: number): Text {
  const work = disp(`y = -\\frac{b}{2a} = \\frac{${-b}}{${2 * a}} = ${k}`, `x = ${plugIn(a, b, c, k)} = ${h}`);
  return said(
    `The vertex of $x = ay^{2} + by + c$ is at $y = -\\frac{b}{2a}$, which gives the same point:${work}`,
    `$x = ay^{2} + by + c$ 的顶点在 $y = -\\frac{b}{2a}$ 处，同样得到这个点：${work}`,
  );
}

/** generalCheck checks the vertex of a general form with −D/2 and by substituting it into the original equation. */
function generalCheck(g: GeneralForm): Text {
  const [u, s, r] = g.vertical ? ["x", g.h, g.k] : ["y", g.k, g.h];
  const work = disp(`${u} = -\\frac{D}{2} = \\frac{${2 * s}}{2} = ${s}`, `${s * s} ${pm(-2 * s * s)} ${pm(-g.c * r)} ${pm(g.F)} = 0`);
  return said(
    `The $${u}$-coordinate of the vertex is also $-\\frac{D}{2}$, half the opposite of the coefficient of $${u}$. Substituting the vertex into the original equation gives $0$, so it is on the parabola:${work}`,
    `顶点的${g.vertical ? "横" : "纵"}坐标也等于 $-\\frac{D}{2}$，即 $${u}$ 的系数的相反数的一半。把顶点代入原方程得 $0$，所以它在抛物线上：${work}`,
  );
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
  intro: t(
    `You know the vertex form $y = a(x - h)^{2} + k$ of a parabola. Parabolas are also **conic sections**, the curves a plane cuts from a cone, and in that setting a parabola is written with the square alone on one side. This form shows a number $p$ that will later locate the focus and the directrix, and it extends to parabolas that open sideways.

Take $x^{2} = -8y$. Solving for $y$ gives the familiar form:

$$y = -\\frac{1}{8}x^{2}.$$

The leading coefficient is negative, so the parabola opens downward. In the new form $4p = -8$ gives $p = -2$, and a negative $p$ says the same thing.`,
    `你已经知道抛物线的顶点式 $y = a(x - h)^{2} + k$。抛物线也是**圆锥曲线**，即用平面截圆锥得到的曲线；在这种观点下，抛物线写成平方项单独在一边的形式。这种形式给出一个数 $p$，以后用它确定焦点和准线，而且它还能推广到开口朝向侧面的抛物线。

以 $x^{2} = -8y$ 为例。解出 $y$，得到熟悉的形式：

$$y = -\\frac{1}{8}x^{2}.$$

二次项系数为负，所以抛物线开口向下。在新的形式中，由 $4p = -8$ 得 $p = -2$，$p$ 为负说明的是同一件事。`,
  ),
  knowledgePoints: [
    {
      id: "opening-up-or-down",
      figure: conicDrawings["upward-and-downward-opening-parabolas#opening-up-or-down"],
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        "As a **conic section**, a parabola with vertex at the origin and a vertical axis of symmetry is written\n\n$$x^{2} = 4py$$\n\nSolving for $y$ gives $y = \\frac{1}{4p}x^{2}$, so the parabola opens **upward** when $p > 0$ and **downward** when $p < 0$. Moving the vertex to $(h, k)$ gives $(x - h)^{2} = 4p(y - k)$, which opens the same way.\n\nFor $-x^{2} = 6y$, first multiply both sides by $-1$: $x^{2} = -6y$, so $4p = -6$, $p = -\\frac{3}{2} < 0$, and the parabola opens downward.\n\n> **Watch out.** In $8y = x^{2}$ the sides are swapped, but it is still $x^{2} = 8y$ with $4p = 8$, and it opens upward.",
        "作为**圆锥曲线**，顶点在原点、对称轴竖直的抛物线写成\n\n$$x^{2} = 4py$$\n\n解出 $y$ 得 $y = \\frac{1}{4p}x^{2}$，所以 $p > 0$ 时抛物线开口**向上**，$p < 0$ 时开口**向下**。把顶点移到 $(h, k)$ 得 $(x - h)^{2} = 4p(y - k)$，开口方向不变。\n\n对 $-x^{2} = 6y$，先两边同乘 $-1$：$x^{2} = -6y$，所以 $4p = -6$，$p = -\\frac{3}{2} < 0$，抛物线开口向下。\n\n> **注意。** $8y = x^{2}$ 只是两边对调，它仍是 $x^{2} = 8y$，$4p = 8$，开口向上。",
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
          solution: join(
            label(1, "Find 4p", "求 4p"),
            rewrite,
            para,
            label(2, "Read the sign", "看符号"),
            t(
              `So $p = \\frac{${fourP}}{4}$ is ${up ? "positive" : "negative"}, and the parabola opens ${up ? "upward" : "downward"}.`,
              `所以 $p = \\frac{${fourP}}{4}$ 为${up ? "正" : "负"}，抛物线开口${up ? "向上" : "向下"}。`,
            ),
            said(
              `Solve for $y$ instead. The coefficient of the square, $\\frac{1}{4p}$, has the same sign as $p$. It is ${up ? "positive, so the graph opens upward" : "negative, so the graph opens downward"} as well: $y = ${form === 3 ? vertexForm(Q.of(1, c), h, k) : `${front(Q.of(1, fourP))}x^{2}`}$.`,
              `改为解出 $y$。平方项的系数 $\\frac{1}{4p}$ 与 $p$ 同号，为${up ? "正，所以图象同样开口向上" : "负，所以图象同样开口向下"}：$y = ${form === 3 ? vertexForm(Q.of(1, c), h, k) : `${front(Q.of(1, fourP))}x^{2}`}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-p",
      title: t("Finding p", "求 p"),
      explanation: t(
        "To write $y = ax^{2}$ in the form $x^{2} = 4py$, divide both sides by $a$ (multiply by $\\frac{1}{a}$) to isolate $x^{2}$, then compare the coefficients of $y$:\n\n$$y = \\frac{1}{12}x^{2} \\Rightarrow x^{2} = 12y \\Rightarrow 4p = 12 \\Rightarrow p = 3$$\n\nSo $p = \\frac{1}{4a}$. Remember to divide the coefficient of $y$ by $4$: $12$ is $4p$, not $p$.\n\n> **Watch out.** $p$ is the coefficient of $y$ divided by $4$. In $x^{2} = 20y$, $p = 5$, not $20$.",
        "要把 $y = ax^{2}$ 写成 $x^{2} = 4py$ 的形式，两边除以 $a$（乘以 $\\frac{1}{a}$）使 $x^{2}$ 单独在一边，再比较 $y$ 的系数：\n\n$$y = \\frac{1}{12}x^{2} \\Rightarrow x^{2} = 12y \\Rightarrow 4p = 12 \\Rightarrow p = 3$$\n\n所以 $p = \\frac{1}{4a}$。记得把 $y$ 的系数除以 $4$：$12$ 是 $4p$，不是 $p$。\n\n> **注意。** $p$ 是 $y$ 的系数除以 $4$。在 $x^{2} = 20y$ 中 $p = 5$，不是 $20$。",
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
          solution: join(
            label(1, "Isolate x²", "使 x² 单独在一边"),
            both(`Multiply both sides by $${c}$:`, `两边同乘 $${c}$：`, `x^{2} = ${scaled(c, 0, "y")}`),
            para,
            label(2, "Compare with x² = 4py", "与 x² = 4py 比较"),
            both(
              "The coefficient of $y$ is $4p$, so divide it by $4$:",
              "$y$ 的系数是 $4p$，所以把它除以 $4$：",
              `4p = ${c}`,
              `p = ${quarter(c)}`,
            ),
            said(
              `The shortcut $p = \\frac{1}{4a}$ gives the same value: $\\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}$.`,
              `用捷径 $p = \\frac{1}{4a}$ 也得到同样的值：$\\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "equation-from-a-graph",
      figure: conicDrawings["upward-and-downward-opening-parabolas#equation-from-a-graph"],
      title: t("The equation from a graph", "由图象求方程"),
      explanation: t(
        "To find the equation of a parabola that opens upward or downward from its graph, read the vertex $(h, k)$, write $(x - h)^{2} = 4p(y - k)$, and substitute another point to find $4p$. With vertex $(1, -2)$ and the point $(3, 0)$:\n\n$$(3 - 1)^{2} = 4p(0 - (-2)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\nSo the equation is $(x - 1)^{2} = 2(y + 2)$.\n\n> **Watch out.** Substitute the other point, not the vertex: the vertex makes both sides $0$ and says nothing about $4p$.",
        "要由图象求开口向上或向下的抛物线的方程，先读出顶点 $(h, k)$，写出 $(x - h)^{2} = 4p(y - k)$，再代入另一点求 $4p$。顶点 $(1, -2)$，经过点 $(3, 0)$：\n\n$$(3 - 1)^{2} = 4p(0 - (-2)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\n所以方程是 $(x - 1)^{2} = 2(y + 2)$。\n\n> **注意。** 要代入另一点，而不是顶点：顶点使两边都为 $0$，求不出 $4p$。",
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
            solution: join(
              label(1, "Read the graph", "读图"),
              t(
                `The vertex is $${pt(h, k)}$, so $h = ${h}$ and $k = ${k}$. The other marked point is $${pt(x1, y1)}$.`,
                `顶点是 $${pt(h, k)}$，所以 $h = ${h}$，$k = ${k}$。另一个标出的点是 $${pt(x1, y1)}$。`,
              ),
              para,
              label(2, "Find 4p", "求 4p"),
              both(
                "Substitute the other point into $(x - h)^{2} = 4p(y - k)$:",
                "把另一点代入 $(x - h)^{2} = 4p(y - k)$：",
                `(${x1} - ${paren(h)})^{2} = 4p(${y1} - ${paren(k)})`,
                `${d * d} = 4p \\cdot ${paren(e)}`,
                `4p = ${num(c)}`,
              ),
              para,
              label(3, "Write the equation", "写出方程"),
              t(`The equation is $${verticalConic(h, k, c)}$.`, `方程是 $${verticalConic(h, k, c)}$。`),
              said(
                `At the vertex both sides are $0$. At $${pt(x1, y1)}$ the left side is $${d * d}$ and the right side is $${num(c)} \\cdot ${paren(e)} = ${d * d}$. The parabola opens ${e > 0 ? "upward" : "downward"}, and $4p = ${num(c)}$ is ${e > 0 ? "positive" : "negative"}, as it should be.`,
                `在顶点处两边都是 $0$。在 $${pt(x1, y1)}$ 处左边是 $${d * d}$，右边是 $${num(c)} \\cdot ${paren(e)} = ${d * d}$。抛物线开口${e > 0 ? "向上" : "向下"}，$4p = ${num(c)}$ 也为${e > 0 ? "正" : "负"}，正应如此。`,
              ),
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `You have written parabolas that open up or down as $x^{2} = 4py$. Swapping the roles of $x$ and $y$ gives parabolas that open to the left or right. They are not graphs of functions of $x$, since one $x$ can give two values of $y$, yet they are the same curves turned on their side.

Take $y^{2} = 8x$. At $x = 2$:

$$y^{2} = 16, \\quad y = 4 \\text{ or } y = -4.$$

So $(2, 4)$ and $(2, -4)$ both lie on it, one above the other. Here $4p = 8 > 0$, and the parabola opens to the right.`,
    `你已经把开口向上或向下的抛物线写成 $x^{2} = 4py$。交换 $x$ 与 $y$ 的角色，就得到开口向左或向右的抛物线。它们不是 $x$ 的函数的图象，因为一个 $x$ 可能对应两个 $y$；但它们仍是同样的曲线，只是横了过来。

以 $y^{2} = 8x$ 为例。当 $x = 2$ 时：

$$y^{2} = 16, \\quad y = 4 \\text{ 或 } y = -4.$$

所以 $(2, 4)$ 和 $(2, -4)$ 都在它上面，一上一下。这里 $4p = 8 > 0$，抛物线开口向右。`,
  ),
  knowledgePoints: [
    {
      id: "opening-in-four-directions",
      title: t("Opening in four directions", "四种开口方向"),
      explanation: t(
        "Swapping $x$ and $y$ turns a parabola on its side. The parabola $y^{2} = 4px$ opens **to the right** when $p > 0$ and **to the left** when $p < 0$; its axis of symmetry is horizontal. The squared variable tells the axis: if $x$ is squared the parabola opens up or down, if $y$ is squared it opens left or right. Then the sign of $p$ (or of $a$ in $x = ay^{2}$) gives the direction.\n\n$x = -\\frac{1}{2}y^{2}$ has $y$ squared and a negative coefficient, so it opens to the left.\n\n> **Watch out.** Look at which variable is squared, not at which side it is on: $y^{2} = -4x$ and $x = -\\frac{1}{4}y^{2}$ both open to the left.",
        "交换 $x$ 与 $y$，抛物线就“躺倒”了。抛物线 $y^{2} = 4px$ 当 $p > 0$ 时开口**向右**，$p < 0$ 时开口**向左**；它的对称轴是水平的。看哪个变量被平方就知道对称轴的方向：$x$ 被平方时抛物线开口向上或向下，$y$ 被平方时开口向左或向右。再由 $p$（或 $x = ay^{2}$ 中 $a$）的符号判断方向。\n\n$x = -\\frac{1}{2}y^{2}$ 中 $y$ 被平方且系数为负，所以开口向左。\n\n> **注意。** 看哪个变量被平方，而不是它在哪一边：$y^{2} = -4x$ 与 $x = -\\frac{1}{4}y^{2}$ 都开口向左。",
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
        // A test point: the squared variable 2 past the vertex, and the other coordinate it gives.
        const [vh, vk] = form === 4 ? [h, k] : [0, 0];
        const other = [Q.of(4, c), Q.of(4, c), a.mul(Q.of(4)), Q.of(-4, c), Q.of(4, c).add(Q.of(h)), a.mul(Q.of(4))][form]!;
        const [sqVar, otherVar, sqValue] = vertical ? ["x", "y", vh + 2] : ["y", "x", vk + 2];
        const side = [t("above", "上方"), t("below", "下方"), t("to the left of", "左侧"), t("to the right of", "右侧")][
          directionIndex(vertical, positive)
        ]!;
        const axisReason: Reason = [
          "",
          vertical
            ? "A parabola opens left or right only when $y$ is squared; here $x$ is squared."
            : "A parabola opens up or down only when $x$ is squared; here $y$ is squared.",
          vertical
            ? "只有 $y$ 被平方时抛物线才开口向左或向右；这里被平方的是 $x$。"
            : "只有 $x$ 被平方时抛物线才开口向上或向下；这里被平方的是 $y$。",
        ];
        const reasons: Reason[] = directions.map((d, i) =>
          i < 2 === vertical
            ? [
                d.en,
                `This is the way it opens when the sign is ${positive ? "negative" : "positive"}; here it is ${positive ? "positive" : "negative"}.`,
                `这是符号为${positive ? "负" : "正"}时的开口方向；这里为${positive ? "正" : "负"}。`,
              ]
            : [d.en, axisReason[1], axisReason[2]],
        );
        return reasoned(
          choiceProblem({
            prompt: t(`Which way does the parabola $${equation}$ open?`, `抛物线 $${equation}$ 的开口方向是？`),
            options: directions,
            correct: directionIndex(vertical, positive),
            solution: join(
              label(1, "Find the axis", "找对称轴"),
              t(
                vertical
                  ? "$x$ is squared, so the axis of symmetry is vertical and the parabola opens up or down."
                  : "$y$ is squared, so the axis of symmetry is horizontal and the parabola opens left or right.",
                vertical
                  ? "$x$ 被平方，所以对称轴是竖直的，抛物线开口向上或向下。"
                  : "$y$ 被平方，所以对称轴是水平的，抛物线开口向左或向右。",
              ),
              para,
              label(2, "Read the sign", "看符号"),
              t(
                `Here ${why.en}, which is ${positive ? "positive" : "negative"}. The parabola opens ${way.en}.`,
                `这里 ${why["zh-CN"]}，为${positive ? "正" : "负"}。抛物线开口${way["zh-CN"]}。`,
              ),
              said(
                `Put $${sqVar} = ${sqValue}$ into the equation. It gives $${otherVar} = ${num(other)}$, ${side.en} the vertex $${pt(vh, vk)}$, so the curve goes ${way.en} from the vertex.`,
                `把 $${sqVar} = ${sqValue}$ 代入方程，得 $${otherVar} = ${num(other)}$，在顶点 $${pt(vh, vk)}$ 的${side["zh-CN"]}，所以曲线从顶点${way["zh-CN"]}延伸。`,
              ),
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "points-on-a-horizontal-parabola",
      figure: conicDrawings["left-and-right-opening-parabolas#points-on-a-horizontal-parabola"],
      title: t("Points on a horizontal parabola", "开口向左右的抛物线上的点"),
      explanation: t(
        "In $x = ay^{2} + by + c$, the input is $y$ and the output is $x$. To find the point with a given $y$-coordinate, substitute $y$ and compute $x$. For $x = y^{2} - 2y + 3$ and $y = -1$:\n\n$$x = (-1)^{2} - 2 \\cdot (-1) + 3 = 6$$\n\nSo the point is $(6, -1)$: the $x$-coordinate comes first even though it was computed last.\n\n> **Watch out.** Write the point with the computed $x$ first. For $y = -1$ and $x = 6$ the point is $(6, -1)$; $(-1, 6)$ is a different point.",
        "在 $x = ay^{2} + by + c$ 中，输入是 $y$，输出是 $x$。要求某个 $y$ 坐标对应的点，就代入 $y$ 算出 $x$。对 $x = y^{2} - 2y + 3$，$y = -1$：\n\n$$x = (-1)^{2} - 2 \\cdot (-1) + 3 = 6$$\n\n所以点是 $(6, -1)$：$x$ 坐标虽然是后算出来的，仍然写在前面。\n\n> **注意。** 写点时把算出的 $x$ 放在前面。$y = -1$、$x = 6$ 对应的点是 $(6, -1)$；$(-1, 6)$ 是另一个点。",
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
          solution: join(
            label(1, "Substitute the y-coordinate", "代入 y 坐标"),
            both(`Here $y$ is the input. Substitute $y = ${y}$:`, `这里 $y$ 是输入。代入 $y = ${y}$：`, `x = ${plugIn(a, b, c, y)} = ${x}`),
            para,
            label(2, "Write the point", "写出点"),
            t(
              `The $x$-coordinate is written first even though it was computed last: the point is $${pt(x, y)}$.`,
              `$x$ 坐标虽然是后算出来的，仍写在前面：所求点是 $${pt(x, y)}$。`,
            ),
            said(
              `Group the $y$-terms instead, as $x - c = y(ay + b)$. At $${pt(x, y)}$ the left side is $${x} - ${paren(c)} = ${x - c}$ and the right side is $${paren(y)} \\cdot ${paren(a * y + b)} = ${y * (a * y + b)}$.`,
              `改为把含 $y$ 的项合在一起：$x - c = y(ay + b)$。在 $${pt(x, y)}$ 处左边是 $${x} - ${paren(c)} = ${x - c}$，右边是 $${paren(y)} \\cdot ${paren(a * y + b)} = ${y * (a * y + b)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "horizontal-equation-from-a-graph",
      figure: conicDrawings["left-and-right-opening-parabolas#horizontal-equation-from-a-graph"],
      title: t("The equation from a graph", "由图象求方程"),
      explanation: t(
        "A parabola that opens to the left or right with vertex $(h, k)$ is $(y - k)^{2} = 4p(x - h)$; note that $k$ goes with $y$ and $h$ with $x$. Substitute another point to find $4p$. With vertex $(-1, 2)$ and the point $(1, 4)$:\n\n$$(4 - 2)^{2} = 4p(1 - (-1)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\nSo the equation is $(y - 2)^{2} = 2(x + 1)$.\n\n> **Watch out.** In $(y - k)^{2} = 4p(x - h)$ the vertex is still $(h, k)$: the number with $y$ is the second coordinate.",
        "顶点为 $(h, k)$、开口向左或向右的抛物线是 $(y - k)^{2} = 4p(x - h)$；注意 $k$ 和 $y$ 在一起，$h$ 和 $x$ 在一起。代入另一点求 $4p$。顶点 $(-1, 2)$，经过点 $(1, 4)$：\n\n$$(4 - 2)^{2} = 4p(1 - (-1)) \\Rightarrow 4 = 4p \\cdot 2 \\Rightarrow 4p = 2$$\n\n所以方程是 $(y - 2)^{2} = 2(x + 1)$。\n\n> **注意。** 在 $(y - k)^{2} = 4p(x - h)$ 中顶点仍是 $(h, k)$：与 $y$ 在一起的数是第二个坐标。",
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
            solution: join(
              label(1, "Read the graph", "读图"),
              t(
                `The vertex is $${pt(h, k)}$, so $h = ${h}$ goes with $x$ and $k = ${k}$ goes with $y$. The other marked point is $${pt(x1, y1)}$.`,
                `顶点是 $${pt(h, k)}$，所以 $h = ${h}$ 与 $x$ 在一起，$k = ${k}$ 与 $y$ 在一起。另一个标出的点是 $${pt(x1, y1)}$。`,
              ),
              para,
              label(2, "Find 4p", "求 4p"),
              both(
                "Substitute the other point into $(y - k)^{2} = 4p(x - h)$:",
                "把另一点代入 $(y - k)^{2} = 4p(x - h)$：",
                `(${y1} - ${paren(k)})^{2} = 4p(${x1} - ${paren(h)})`,
                `${d * d} = 4p \\cdot ${paren(e)}`,
                `4p = ${num(c)}`,
              ),
              para,
              label(3, "Write the equation", "写出方程"),
              t(`The equation is $${horizontalConic(h, k, c)}$.`, `方程是 $${horizontalConic(h, k, c)}$。`),
              said(
                `At the vertex both sides are $0$. At $${pt(x1, y1)}$ the left side is $${d * d}$ and the right side is $${num(c)} \\cdot ${paren(e)} = ${d * d}$. The parabola opens ${e > 0 ? "to the right" : "to the left"}, and $4p = ${num(c)}$ is ${e > 0 ? "positive" : "negative"}, as it should be.`,
                `在顶点处两边都是 $0$。在 $${pt(x1, y1)}$ 处左边是 $${d * d}$，右边是 $${num(c)} \\cdot ${paren(e)} = ${d * d}$。抛物线开口${e > 0 ? "向右" : "向左"}，$4p = ${num(c)}$ 也为${e > 0 ? "正" : "负"}，正应如此。`,
              ),
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
  encompasses: [{ topic: "the-vertex-form-of-a-parabola", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `You can now recognize parabolas that open in any of the four directions. Each one turns at its **vertex**, which lies on its axis of symmetry. The vertex is the starting point for sketching a parabola and for finding its focus.

Take $(y - 4)^{2} = -2(x + 1)$. Write both brackets as subtractions:

$$(y - 4)^{2} = -2(x - (-1)).$$

The number subtracted from $x$ is $-1$ and the number subtracted from $y$ is $4$, so the vertex is $(-1, 4)$. Since $y$ is squared and $4p = -2 < 0$, the parabola opens to the left from there.`,
    `你已经能认出四种开口方向的抛物线。每条抛物线都在**顶点**处转弯，顶点在对称轴上。画抛物线的草图、求它的焦点，都从顶点出发。

以 $(y - 4)^{2} = -2(x + 1)$ 为例。把两个括号都写成减法：

$$(y - 4)^{2} = -2(x - (-1)).$$

从 $x$ 中减去的数是 $-1$，从 $y$ 中减去的数是 $4$，所以顶点是 $(-1, 4)$。由于 $y$ 被平方且 $4p = -2 < 0$，抛物线从顶点向左开口。`,
  ),
  knowledgePoints: [
    {
      id: "vertex-of-a-vertical-parabola",
      figure: conicDrawings["the-vertex-of-a-parabola#vertex-of-a-vertical-parabola"],
      title: t("Parabolas opening up or down", "开口向上或向下的抛物线"),
      explanation: t(
        "The parabola $(x - h)^{2} = 4p(y - k)$ has its vertex at $(h, k)$: the number subtracted from $x$ is the $x$-coordinate and the number subtracted from $y$ is the $y$-coordinate. Read each with the opposite sign of the number in its parentheses:\n\n$$(x + 3)^{2} = 8(y - 5) \\text{ is } (x - (-3))^{2} = 8(y - 5)$$\n\nSo the vertex is $(-3, 5)$. The factor $4p = 8$ does not change the vertex.\n\n> **Watch out.** Read each coordinate with the opposite sign: $(x - 4)^{2} = 2(y + 1)$ has vertex $(4, -1)$, not $(-4, 1)$.",
        "抛物线 $(x - h)^{2} = 4p(y - k)$ 的顶点是 $(h, k)$：从 $x$ 中减去的数是横坐标，从 $y$ 中减去的数是纵坐标。每个坐标都与括号里的数符号相反：\n\n$$(x + 3)^{2} = 8(y - 5) \\text{ 即 } (x - (-3))^{2} = 8(y - 5)$$\n\n所以顶点是 $(-3, 5)$。系数 $4p = 8$ 不影响顶点。\n\n> **注意。** 每个坐标都取括号里的数的相反数：$(x - 4)^{2} = 2(y + 1)$ 的顶点是 $(4, -1)$，不是 $(-4, 1)$。",
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
          solution: join(
            label(1, "Write both brackets as subtractions", "把两个括号都写成减法"),
            both(
              "Match the form $(x - h)^{2} = 4p(y - k)$:",
              "对照形式 $(x - h)^{2} = 4p(y - k)$：",
              `(x - ${paren(h)})^{2} = ${front(c)}(y - ${paren(k)})`,
            ),
            para,
            label(2, "Read the vertex", "读出顶点"),
            t(
              `So $h = ${h}$ and $k = ${k}$, and the vertex is $${pt(h, k)}$. The factor $${c}$ does not move it.`,
              `所以 $h = ${h}$，$k = ${k}$，顶点是 $${pt(h, k)}$。系数 $${c}$ 不影响顶点。`,
            ),
            said(
              `Substitute $x = ${h}$: the left side becomes $0$, so $y - ${paren(k)} = 0$ and $y = ${k}$. The parabola meets its axis only at $${pt(h, k)}$, which is the vertex.`,
              `代入 $x = ${h}$：左边为 $0$，所以 $y - ${paren(k)} = 0$，$y = ${k}$。抛物线与对称轴只交于 $${pt(h, k)}$，这正是顶点。`,
            ),
          ),
        });
      },
    },
    {
      id: "vertex-of-a-horizontal-parabola",
      figure: conicDrawings["the-vertex-of-a-parabola#vertex-of-a-horizontal-parabola"],
      title: t("Parabolas opening left or right", "开口向左或向右的抛物线"),
      explanation: t(
        "For a parabola opening left or right, the squared binomial contains $y$, so it gives the **$y$-coordinate** of the vertex:\n\n- $(y - k)^{2} = 4p(x - h)$ has vertex $(h, k)$;\n- $x = a(y - k)^{2} + h$ has vertex $(h, k)$.\n\nFor $x = 2(y - 1)^{2} - 4$, the vertex is $(-4, 1)$, not $(1, -4)$: the constant $-4$ is the $x$-coordinate.\n\n> **Watch out.** In $x = a(y - k)^{2} + h$ the constant $h$ is the $x$-coordinate, so it goes first in the vertex.",
        "对开口向左或向右的抛物线，被平方的二项式里是 $y$，所以它给出顶点的 **$y$ 坐标**：\n\n- $(y - k)^{2} = 4p(x - h)$ 的顶点是 $(h, k)$；\n- $x = a(y - k)^{2} + h$ 的顶点是 $(h, k)$。\n\n对 $x = 2(y - 1)^{2} - 4$，顶点是 $(-4, 1)$，而不是 $(1, -4)$：常数 $-4$ 是横坐标。\n\n> **注意。** 在 $x = a(y - k)^{2} + h$ 中常数 $h$ 是横坐标，所以写顶点时它在前面。",
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
          solution: join(
            label(1, "Find the squared variable", "找被平方的变量"),
            t(
              "$y$ is squared, so the parabola opens left or right, and the squared binomial gives the $y$-coordinate of the vertex.",
              "$y$ 被平方，所以抛物线开口向左或向右，被平方的二项式给出顶点的纵坐标。",
            ),
            para,
            label(2, "Read the vertex", "读出顶点"),
            t(
              `Here ${why.en}, so the vertex is $${pt(h, k)}$, with the $x$-coordinate first.`,
              `这里${why["zh-CN"]}，所以顶点是 $${pt(h, k)}$，横坐标写在前面。`,
            ),
            said(
              `Substitute $y = ${k}$: the square becomes $0$, which leaves $x = ${h}$. The parabola meets its axis $y = ${k}$ only at $${pt(h, k)}$, which is the vertex.`,
              `代入 $y = ${k}$：平方为 $0$，剩下 $x = ${h}$。抛物线与对称轴 $y = ${k}$ 只交于 $${pt(h, k)}$，这正是顶点。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-axis-of-symmetry",
      figure: conicDrawings["the-vertex-of-a-parabola#the-axis-of-symmetry"],
      title: t("The axis of symmetry", "对称轴"),
      explanation: t(
        "The axis of symmetry passes through the vertex $(h, k)$ in the direction the parabola opens:\n\n- a parabola opening up or down has the vertical axis $x = h$;\n- a parabola opening left or right has the horizontal axis $y = k$.\n\n$(y + 2)^{2} = -6(x - 1)$ opens to the left with vertex $(1, -2)$, so its axis of symmetry is $y = -2$.\n\n> **Watch out.** A parabola opening left or right has a horizontal axis $y = k$, not $x = h$.",
        "对称轴经过顶点 $(h, k)$，方向与抛物线的开口方向一致：\n\n- 开口向上或向下的抛物线，对称轴是竖直的 $x = h$；\n- 开口向左或向右的抛物线，对称轴是水平的 $y = k$。\n\n$(y + 2)^{2} = -6(x - 1)$ 开口向左，顶点是 $(1, -2)$，所以对称轴是 $y = -2$。\n\n> **注意。** 开口向左或向右的抛物线，对称轴是水平的 $y = k$，不是 $x = h$。",
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
          solution: join(
            label(1, "Read the vertex", "读出顶点"),
            t(`The vertex is $${pt(h, k)}$.`, `顶点是 $${pt(h, k)}$。`),
            para,
            label(2, "Find the direction of the axis", "确定对称轴的方向"),
            t(
              `${vertical ? "$x$ is squared, so the parabola opens up or down and its axis is the vertical line through the vertex" : "$y$ is squared, so the parabola opens left or right and its axis is the horizontal line through the vertex"}: $${answer}$.`,
              `${vertical ? "$x$ 被平方，抛物线开口向上或向下，对称轴是过顶点的竖直直线" : "$y$ 被平方，抛物线开口向左或向右，对称轴是过顶点的水平直线"}：$${answer}$。`,
            ),
            said(
              vertical
                ? `The points with $x = ${h - 1}$ and $x = ${h + 1}$ give the same square $(x - ${paren(h)})^{2} = 1$, so they have the same $y$. They are mirror images in $x = ${h}$.`
                : `The points with $y = ${k - 1}$ and $y = ${k + 1}$ give the same square $(y - ${paren(k)})^{2} = 1$, so they have the same $x$. They are mirror images in $y = ${k}$.`,
              vertical
                ? `$x = ${h - 1}$ 与 $x = ${h + 1}$ 给出同样的平方 $(x - ${paren(h)})^{2} = 1$，所以对应的 $y$ 相同。这两点关于 $x = ${h}$ 对称。`
                : `$y = ${k - 1}$ 与 $y = ${k + 1}$ 给出同样的平方 $(y - ${paren(k)})^{2} = 1$，所以对应的 $x$ 相同。这两点关于 $y = ${k}$ 对称。`,
            ),
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
  intro: t(
    `You can read the vertex from a conic form, and you have completed the square to write $y = ax^{2} + bx + c$ in vertex form. Parabolas are often given expanded, and completing the square brings them back to a form whose vertex can be read.

Take $x = y^{2} + 6y + 5$. Half of $6$ is $3$, so add and subtract $9$:

$$x = (y^{2} + 6y + 9) - 9 + 5 = (y + 3)^{2} - 4.$$

The vertex is $(-4, -3)$: the constant $-4$ is the $x$-coordinate.`,
    `你已经能从圆锥曲线形式读出顶点，也用配方法把 $y = ax^{2} + bx + c$ 写成顶点式。抛物线常以展开的形式给出，配方能把它变回可以直接读出顶点的形式。

以 $x = y^{2} + 6y + 5$ 为例。$6$ 的一半是 $3$，所以加上再减去 $9$：

$$x = (y^{2} + 6y + 9) - 9 + 5 = (y + 3)^{2} - 4.$$

顶点是 $(-4, -3)$：常数 $-4$ 是横坐标。`,
  ),
  knowledgePoints: [
    {
      id: "completing-the-square-in-y",
      figure: conicDrawings["calculating-the-vertex-of-a-parabola-by-completing-the-square#completing-the-square-in-y"],
      title: t("Completing the square in y", "对 y 配方"),
      explanation: t(
        "To find the vertex of $x = y^{2} + by + c$, complete the square in $y$ exactly as for $y = x^{2} + bx + c$, with the roles of $x$ and $y$ swapped:\n\n$$x = y^{2} - 4y + 1 = (y^{2} - 4y + 4) - 4 + 1 = (y - 2)^{2} - 3$$\n\nThis is $x = (y - k)^{2} + h$ with $k = 2$ and $h = -3$, so the vertex is $(-3, 2)$.\n\n> **Watch out.** When you add the square inside, subtract it as well, so the right side keeps its value.",
        "要求 $x = y^{2} + by + c$ 的顶点，像对 $y = x^{2} + bx + c$ 那样对 $y$ 配方，只是 $x$ 与 $y$ 的角色互换：\n\n$$x = y^{2} - 4y + 1 = (y^{2} - 4y + 4) - 4 + 1 = (y - 2)^{2} - 3$$\n\n这就是 $x = (y - k)^{2} + h$，其中 $k = 2$，$h = -3$，所以顶点是 $(-3, 2)$。\n\n> **注意。** 在括号内加上平方的同时也要减去它，右边的值才不变。",
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
          solution: join(
            label(1, "Complete the square in y", "对 y 配方"),
            both(
              `Add and subtract $${k * k}$, the square of half the coefficient of $y$ inside the brackets:`,
              `在括号内加上再减去 $${k * k}$，即 $y$ 的系数一半的平方：`,
              `x = ${front(a)}(${quad(1, -2 * k, 0, "y")})${tail(c)}`,
              `x = ${front(a)}(${quad(1, -2 * k, k * k, "y")}) ${a > 0 ? "-" : "+"} ${k * k}${tail(c)}`,
              `x = ${vertexForm(a, k, h, "y")}`,
            ),
            para,
            label(2, "Read the vertex", "读出顶点"),
            t(
              `This is $x = a(y - k)^{2} + h$ with $k = ${k}$ and $h = ${h}$, so the vertex is $${pt(h, k)}$.`,
              `这就是 $x = a(y - k)^{2} + h$，其中 $k = ${k}$，$h = ${h}$，所以顶点是 $${pt(h, k)}$。`,
            ),
            vertexByFormula(a, b, c, k, h),
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      figure: conicDrawings["calculating-the-vertex-of-a-parabola-by-completing-the-square#with-a-leading-coefficient"],
      title: t("With a leading coefficient", "二次项系数不为 1"),
      explanation: t(
        "When the coefficient of $y^{2}$ is not $1$, factor it out of the $y$-terms, complete the square inside, and multiply the square you take out by that coefficient:\n\n$$x = 2y^{2} + 12y + 13 = 2(y^{2} + 6y + 9) - 2 \\cdot 9 + 13 = 2(y + 3)^{2} - 5$$\n\nThe vertex is $(-5, -3)$.\n\n> **Watch out.** The number added inside the brackets is multiplied by the coefficient in front: subtract $a$ times it, not the number alone.",
        "当 $y^{2}$ 的系数不为 $1$ 时，先从含 $y$ 的项中提出它，在括号内配方，移出括号的平方要乘以这个系数：\n\n$$x = 2y^{2} + 12y + 13 = 2(y^{2} + 6y + 9) - 2 \\cdot 9 + 13 = 2(y + 3)^{2} - 5$$\n\n顶点是 $(-5, -3)$。\n\n> **注意。** 括号内加上的数要乘以括号前的系数：减去的是它的 $a$ 倍，而不是这个数本身。",
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
          solution: join(
            label(1, "Factor out the leading coefficient", "提出二次项系数"),
            both(`Factor $${a}$ out of the $y$-terms:`, `从含 $y$ 的项中提出 $${a}$：`, `x = ${a}(${quad(1, -2 * k, 0, "y")})${tail(c)}`),
            para,
            label(2, "Complete the square", "配方"),
            both(
              `Add $${k * k}$ inside the brackets. That adds $${paren(a)} \\cdot ${k * k}$ in all, so subtract it outside:`,
              `在括号内加上 $${k * k}$，相当于总共加了 $${paren(a)} \\cdot ${k * k}$，所以在括号外减去它：`,
              `x = ${a}(${quad(1, -2 * k, k * k, "y")}) - ${paren(a)} \\cdot ${k * k}${tail(c)}`,
              `x = ${vertexForm(a, k, h, "y")}`,
            ),
            para,
            label(3, "Read the vertex", "读出顶点"),
            t(`Here $k = ${k}$ and $h = ${h}$, so the vertex is $${pt(h, k)}$.`, `这里 $k = ${k}$，$h = ${h}$，所以顶点是 $${pt(h, k)}$。`),
            vertexByFormula(a, b, c, k, h),
          ),
        });
      },
    },
    {
      id: "from-the-general-form",
      figure: conicDrawings["calculating-the-vertex-of-a-parabola-by-completing-the-square#from-the-general-form"],
      title: t("From the general form", "由一般方程求顶点"),
      explanation: t(
        "A parabola may be written with everything on one side, such as $x^{2} - 6x - 4y + 1 = 0$. Keep the terms of the squared variable on one side, move the rest to the other, and complete the square:\n\n$$x^{2} - 6x = 4y - 1 \\Rightarrow x^{2} - 6x + 9 = 4y + 8 \\Rightarrow (x - 3)^{2} = 4(y + 2)$$\n\nFactor the coefficient of $y$ out on the right. The vertex is $(3, -2)$. If $y$ is the squared variable, do the same with $y$, and the result is $(y - k)^{2} = 4p(x - h)$.\n\n> **Watch out.** Factor the coefficient of the other variable out on the right: $4y + 8 = 4(y + 2)$, so $k = -2$, not $-8$.",
        "抛物线也可能把所有项写在一边，如 $x^{2} - 6x - 4y + 1 = 0$。把被平方的变量的项留在一边，其余移到另一边，再配方：\n\n$$x^{2} - 6x = 4y - 1 \\Rightarrow x^{2} - 6x + 9 = 4y + 8 \\Rightarrow (x - 3)^{2} = 4(y + 2)$$\n\n右边要提出 $y$ 的系数。顶点是 $(3, -2)$。若被平方的是 $y$，就对 $y$ 做同样的事，结果是 $(y - k)^{2} = 4p(x - h)$。\n\n> **注意。** 右边要提出另一个变量的系数：$4y + 8 = 4(y + 2)$，所以 $k = -2$，不是 $-8$。",
      ),
      generate(rng) {
        const g = drawGeneralForm(rng, rng.bool());
        const how = completeTheSquareText(g);
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $${g.equation}$.`, `求抛物线 $${g.equation}$ 的顶点。`),
          answer: [g.h, g.k],
          wrong: [[-g.h, -g.k], [g.k, g.h], g.vertical ? [g.h, g.F] : [g.F, g.k]],
          solution: join(
            label(1, "Complete the square", "配方"),
            t(how.en.trimEnd(), how["zh-CN"].trimEnd()),
            para,
            label(2, "Read the vertex", "读出顶点"),
            t(
              `This is $${g.vertical ? "(x - h)^{2} = 4p(y - k)" : "(y - k)^{2} = 4p(x - h)"}$, so the vertex is $${pt(g.h, g.k)}$.`,
              `这就是 $${g.vertical ? "(x - h)^{2} = 4p(y - k)" : "(y - k)^{2} = 4p(x - h)"}$，所以顶点是 $${pt(g.h, g.k)}$。`,
            ),
            generalCheck(g),
          ),
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
  intro: t(
    `You know the vertex of a parabola, and the Pythagorean theorem gives the distance between two points. A parabola can also be defined without any equation: it is every point as far from a fixed point, the **focus**, as from a fixed line, the **directrix**. This is why parabolic mirrors and dishes gather light and signals at one point.

Take the focus $(0, 2)$, the directrix $y = -2$ and the point $(4, 2)$. Its distance to the focus is $4$, and its distance to the directrix is

$$|2 - (-2)| = 4.$$

The two distances agree, so $(4, 2)$ is on this parabola, which is $x^{2} = 8y$.`,
    `你已经知道抛物线的顶点，也会用勾股定理求两点间的距离。抛物线也可以不用方程来定义：它是到一个定点（**焦点**）和到一条定直线（**准线**）距离相等的所有点。正因如此，抛物面镜和天线能把光和信号汇聚到一点。

取焦点 $(0, 2)$、准线 $y = -2$ 和点 $(4, 2)$。它到焦点的距离是 $4$，到准线的距离是

$$|2 - (-2)| = 4.$$

两个距离相等，所以 $(4, 2)$ 在这条抛物线上，这条抛物线就是 $x^{2} = 8y$。`,
  ),
  knowledgePoints: [
    {
      id: "equal-distances",
      title: t("Equal distances", "距离相等"),
      explanation: t(
        "A **parabola** is the set of all points that are the same distance from a fixed point, the **focus**, and a fixed line, the **directrix**. The vertex lies halfway between them, and $p$ is the signed distance from the vertex to the focus.\n\nThe distance from $P(x_0, y_0)$ to a horizontal line $y = d$ is $|y_0 - d|$, and to a vertical line $x = d$ it is $|x_0 - d|$. So for a point on a parabola, the distance to the focus can be found without the distance formula. In the figure, the focus is $F(0, 1)$, the directrix is $y = -1$, and $P(2, 1)$ is on the parabola: $P$ is $|1 - (-1)| = 2$ from the directrix, so $PF = 2$ too.\n\n> **Watch out.** The distance to a horizontal line $y = d$ uses only $y$-coordinates. It is $|y_0 - d|$, never negative.",
        "**抛物线**是到一个定点（**焦点**）和一条定直线（**准线**）距离相等的所有点的集合。顶点位于两者正中间，$p$ 是从顶点到焦点的有向距离。\n\n点 $P(x_0, y_0)$ 到水平直线 $y = d$ 的距离是 $|y_0 - d|$，到竖直直线 $x = d$ 的距离是 $|x_0 - d|$。所以对抛物线上的点，不用距离公式也能求出它到焦点的距离。图中焦点是 $F(0, 1)$，准线是 $y = -1$，$P(2, 1)$ 在抛物线上：$P$ 到准线的距离是 $|1 - (-1)| = 2$，所以 $PF = 2$。\n\n> **注意。** 到水平直线 $y = d$ 的距离只用纵坐标，是 $|y_0 - d|$，不会是负数。",
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
          solution: join(
            label(1, "Use the definition", "用定义"),
            t(
              "Every point of the parabola is as far from the focus as from the directrix, so $PF$ equals the distance from $P$ to the directrix.",
              "抛物线上每一点到焦点的距离都等于它到准线的距离，所以 $PF$ 等于 $P$ 到准线的距离。",
            ),
            para,
            label(2, "Measure to the directrix", "量到准线的距离"),
            both(
              `The directrix is ${vertical ? "horizontal, so subtract the $y$-coordinates" : "vertical, so subtract the $x$-coordinates"}:`,
              `准线是${vertical ? "水平的，所以把纵坐标相减" : "竖直的，所以把横坐标相减"}：`,
              `|${along} - ${paren(vertical ? k - p : h - p)}| = ${distance}`,
            ),
            para,
            t(`So $PF = ${distance}$.`, `所以 $PF = ${distance}$。`),
            said(
              `The distance formula gives the same length:${disp(`PF = \\sqrt{(${P[0]} - ${paren(focus[0]!)})^{2} + (${P[1]} - ${paren(focus[1]!)})^{2}} = \\sqrt{${distance * distance}} = ${distance}`)}`,
              `用距离公式也得到同样的长度：${disp(`PF = \\sqrt{(${P[0]} - ${paren(focus[0]!)})^{2} + (${P[1]} - ${paren(focus[1]!)})^{2}} = \\sqrt{${distance * distance}} = ${distance}`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "is-the-point-on-the-parabola",
      figure: conicDrawings["the-focus-directrix-property-of-a-parabola#is-the-point-on-the-parabola"],
      title: t("Is the point on the parabola?", "点是否在抛物线上"),
      explanation: t(
        "To test whether a point $P$ lies on the parabola with a given focus and directrix, compute both distances and compare them. The distance to the focus comes from the distance formula $PF = \\sqrt{(x_0 - x_F)^{2} + (y_0 - y_F)^{2}}$; comparing squares avoids square roots.\n\nFocus $F(1, 2)$, directrix $y = -2$, point $P(5, 3)$:\n\n$$PF^{2} = (5 - 1)^{2} + (3 - 2)^{2} = 17, \\qquad d = |3 - (-2)| = 5, \\quad d^{2} = 25$$\n\n$17 \\ne 25$, so $P$ is not on the parabola.\n\n> **Watch out.** Compare like with like: compare $PF^{2}$ with $d^{2}$, not with $d$.",
        "要检验点 $P$ 是否在给定焦点和准线的抛物线上，就算出两个距离并比较。到焦点的距离用距离公式 $PF = \\sqrt{(x_0 - x_F)^{2} + (y_0 - y_F)^{2}}$；比较平方可以避免开方。\n\n焦点 $F(1, 2)$，准线 $y = -2$，点 $P(5, 3)$：\n\n$$PF^{2} = (5 - 1)^{2} + (3 - 2)^{2} = 17, \\qquad d = |3 - (-2)| = 5, \\quad d^{2} = 25$$\n\n$17 \\ne 25$，所以 $P$ 不在抛物线上。\n\n> **注意。** 要同类相比：把 $PF^{2}$ 与 $d^{2}$ 比较，而不是与 $d$ 比较。",
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
        const sideL = vertical ? (x0 - h) ** 2 : (y0 - k) ** 2;
        const sideR = vertical ? 4 * p * (y0 - k) : 4 * p * (x0 - h);
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
          solution: join(
            label(1, "Square both distances", "求两个距离的平方"),
            t(
              `Use the distance formula for the focus and the difference of ${vertical ? "$y$" : "$x$"}-coordinates for the directrix, squared to avoid square roots:${work.trimEnd()}`,
              `到焦点用距离公式，到准线用${vertical ? "纵" : "横"}坐标之差，都取平方以免开方：${work.trimEnd()}`,
            ),
            para,
            label(2, "Compare", "比较"),
            t(
              on ? `Both are $${pf2}$, so the point is on the parabola.` : `$${pf2} \\ne ${d * d}$, so the point is not on the parabola.`,
              on ? `两者都是 $${pf2}$，所以点在抛物线上。` : `$${pf2} \\ne ${d * d}$，所以点不在抛物线上。`,
            ),
            said(
              `The vertex is halfway between the focus and the directrix, at $${pt(h, k)}$, and $4p = ${4 * p}$, so the parabola is $${vertical ? verticalConic(h, k, 4 * p) : horizontalConic(h, k, 4 * p)}$. At the point its two sides are $${sideL}$ and $${sideR}$, which are ${on ? "equal" : "not equal"}, as found.`,
              `顶点在焦点与准线的正中间，是 $${pt(h, k)}$，$4p = ${4 * p}$，所以抛物线是 $${vertical ? verticalConic(h, k, 4 * p) : horizontalConic(h, k, 4 * p)}$。在这一点，方程两边分别是 $${sideL}$ 和 $${sideR}$，${on ? "相等" : "不相等"}，与上面一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "equation-from-the-focus-and-directrix",
      figure: conicDrawings["the-focus-directrix-property-of-a-parabola#equation-from-the-focus-and-directrix"],
      title: t("The equation from the focus and directrix", "由焦点和准线求方程"),
      explanation: t(
        "Setting the two distances equal gives the equation. For focus $(0, p)$ and directrix $y = -p$:\n\n$$\\sqrt{x^{2} + (y - p)^{2}} = |y + p| \\Rightarrow x^{2} + y^{2} - 2py + p^{2} = y^{2} + 2py + p^{2} \\Rightarrow x^{2} = 4py$$\n\nIn general, the vertex is halfway between the focus and the directrix, and $p$ is the signed distance from the vertex to the focus. Focus $(2, 1)$ and directrix $y = -3$: the vertex is $(2, -1)$, the focus is $2$ above it so $p = 2$, and the equation is $(x - 2)^{2} = 8(y + 1)$. With a vertical directrix $x = d$ the parabola opens left or right: $(y - k)^{2} = 4p(x - h)$.\n\n> **Watch out.** The vertex is halfway between the focus and the directrix, not at the focus. So $p$ is half the distance from the focus to the directrix.",
        "令两个距离相等就得到方程。对焦点 $(0, p)$ 和准线 $y = -p$：\n\n$$\\sqrt{x^{2} + (y - p)^{2}} = |y + p| \\Rightarrow x^{2} + y^{2} - 2py + p^{2} = y^{2} + 2py + p^{2} \\Rightarrow x^{2} = 4py$$\n\n一般地，顶点在焦点与准线的正中间，$p$ 是从顶点到焦点的有向距离。焦点 $(2, 1)$，准线 $y = -3$：顶点是 $(2, -1)$，焦点在它上方 $2$ 个单位，所以 $p = 2$，方程是 $(x - 2)^{2} = 8(y + 1)$。若准线是竖直的 $x = d$，抛物线开口向左或向右：$(y - k)^{2} = 4p(x - h)$。\n\n> **注意。** 顶点在焦点与准线的正中间，而不是在焦点处。所以 $p$ 是焦点到准线距离的一半。",
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
        const [ex, ey] = vertical ? [h + 2 * p, k + p] : [h + p, k + 2 * p];
        const latus = vertical
          ? `(${ex} - ${paren(h)})^{2} = ${4 * p * p} = ${4 * p}(${ey} - ${paren(k)})`
          : `(${ey} - ${paren(k)})^{2} = ${4 * p * p} = ${4 * p}(${ex} - ${paren(h)})`;
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
          solution: join(
            label(1, "Find the vertex", "求顶点"),
            both(
              `The vertex is halfway between the focus and the directrix, on the axis ${vertical ? `$x = ${h}$` : `$y = ${k}$`} through the focus:`,
              `顶点在焦点与准线的正中间，位于过焦点的对称轴 ${vertical ? `$x = ${h}$` : `$y = ${k}$`} 上：`,
              midpoint,
            ),
            para,
            label(2, "Find p", "求 p"),
            t(
              `The vertex is $${pt(h, k)}$ and the focus is $${Math.abs(p)}$ ${vertical ? (p > 0 ? "above" : "below") : p > 0 ? "to the right of" : "to the left of"} it, so $p = ${p}$ and $4p = ${4 * p}$.`,
              `顶点是 $${pt(h, k)}$，焦点在它${vertical ? (p > 0 ? "上方" : "下方") : p > 0 ? "右方" : "左方"} $${Math.abs(p)}$ 个单位，所以 $p = ${p}$，$4p = ${4 * p}$。`,
            ),
            para,
            label(3, "Write the equation", "写出方程"),
            t(
              `The directrix is ${vertical ? "horizontal, so $x$ is squared" : "vertical, so $y$ is squared"}. The equation is $${answer}$.`,
              `准线是${vertical ? "水平的，所以 $x$ 被平方" : "竖直的，所以 $y$ 被平方"}。方程是 $${answer}$。`,
            ),
            said(
              `Take the point $${pt(ex, ey)}$, level with the focus. It is $${2 * Math.abs(p)}$ from the focus and $${2 * Math.abs(p)}$ from the directrix, so it must satisfy the equation, and it does:${disp(latus)}`,
              `取与焦点平齐的点 $${pt(ex, ey)}$。它到焦点和到准线的距离都是 $${2 * Math.abs(p)}$，所以它应满足方程，确实如此：${disp(latus)}`,
            ),
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

/**
 * focusCheck checks a focus and directrix with the point level with the focus: it lies on the parabola and is 2|p| from both.
 */
function focusCheck(vertical: boolean, h: number, k: number, p: Q): Text {
  const [fx, fy] = focusOf(vertical, h, k, p.mul(Q.of(4)));
  const two = p.mul(Q.of(2));
  const [ex, ey] = vertical ? [Q.of(h).add(two), Q.of(k).add(p)] : [Q.of(h).add(p), Q.of(k).add(two)];
  const line = directrixOf(vertical, h, k, p.mul(Q.of(4)));
  const far = num(two.abs());
  const sides = num(p.mul(p).mul(Q.of(4)));
  return said(
    `The point $${pt(ex, ey)}$, level with the focus, is on the parabola: in the conic form both sides equal $${sides}$ there. It is $${far}$ from the focus $${pt(fx, fy)}$ and $${far}$ from the directrix $${line}$, as every point of a parabola must be.`,
    `与焦点平齐的点 $${pt(ex, ey)}$ 在抛物线上：在圆锥曲线形式中，它使两边都等于 $${sides}$。它到焦点 $${pt(fx, fy)}$ 的距离是 $${far}$，到准线 $${line}$ 的距离也是 $${far}$，正符合抛物线上每一点的性质。`,
  );
}

/** calculatingTheFocusOfAParabola finds the focus from the conic form, the vertex form and the general form. */
export const calculatingTheFocusOfAParabola: TopicDef = {
  id: "calculating-the-focus-of-a-parabola",
  title: t("Calculating the Focus of a Parabola", "求抛物线的焦点"),
  summary: t(
    "Find the focus of a parabola $p$ units from the vertex along its axis, from the conic form, from $y = a(x - h)^{2} + k$ with $p = \\frac{1}{4a}$, and from the general form.",
    "焦点在对称轴上、距顶点 $p$ 个单位；由圆锥曲线形式、由 $y = a(x - h)^{2} + k$（$p = \\frac{1}{4a}$）以及由一般方程求焦点。",
  ),
  prerequisites: ["the-focus-directrix-property-of-a-parabola", "calculating-the-vertex-of-a-parabola-by-completing-the-square"],
  encompasses: [{ topic: "calculating-the-vertex-of-a-parabola-by-completing-the-square", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `You know that a parabola is the set of points as far from its focus as from its directrix, and that the vertex lies halfway between them. Finding the focus from an equation tells you where a parabolic dish or mirror concentrates what it collects.

Take $(y - 2)^{2} = 12(x - 1)$. The vertex is $(1, 2)$ and $4p = 12$, so $p = 3$. The parabola opens to the right, so move $3$ to the right of the vertex:

$$(1 + 3, 2) = (4, 2).$$

The focus is $(4, 2)$, inside the curve.`,
    `你已经知道抛物线是到焦点和到准线距离相等的点的集合，顶点在两者正中间。由方程求出焦点，就知道抛物面天线或镜子把收集到的东西汇聚到哪里。

以 $(y - 2)^{2} = 12(x - 1)$ 为例。顶点是 $(1, 2)$，$4p = 12$，所以 $p = 3$。抛物线开口向右，所以从顶点向右移 $3$：

$$(1 + 3, 2) = (4, 2).$$

焦点是 $(4, 2)$，在曲线内侧。`,
  ),
  knowledgePoints: [
    {
      id: "focus-from-the-conic-form",
      figure: conicDrawings["calculating-the-focus-of-a-parabola#focus-from-the-conic-form"],
      title: t("From the conic form", "由圆锥曲线形式求焦点"),
      explanation: t(
        "The focus lies on the axis of symmetry, $p$ units from the vertex, inside the parabola:\n\n- $(x - h)^{2} = 4p(y - k)$ has focus $(h, k + p)$;\n- $(y - k)^{2} = 4p(x - h)$ has focus $(h + p, k)$.\n\nFor $(x + 1)^{2} = -12(y - 4)$: the vertex is $(-1, 4)$, $4p = -12$ so $p = -3$, and the focus is $(-1, 4 + (-3)) = (-1, 1)$. Divide the coefficient by $4$ before moving from the vertex.\n\n> **Watch out.** The focus is inside the parabola, on the side it opens toward. A focus outside the curve means the sign of $p$ is wrong.",
        "焦点在对称轴上、距顶点 $p$ 个单位，位于抛物线内侧：\n\n- $(x - h)^{2} = 4p(y - k)$ 的焦点是 $(h, k + p)$；\n- $(y - k)^{2} = 4p(x - h)$ 的焦点是 $(h + p, k)$。\n\n对 $(x + 1)^{2} = -12(y - 4)$：顶点是 $(-1, 4)$，$4p = -12$，所以 $p = -3$，焦点是 $(-1, 4 + (-3)) = (-1, 1)$。从顶点出发移动之前，先把系数除以 $4$。\n\n> **注意。** 焦点在抛物线内侧，位于开口的一侧。焦点若落在曲线外侧，说明 $p$ 的符号错了。",
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
          solution: join(
            label(1, "Read the vertex and p", "读出顶点和 p"),
            t(
              `The vertex is $${pt(h, k)}$ and $4p = ${c}$, so $p = ${quarter(c)}$.`,
              `顶点是 $${pt(h, k)}$，$4p = ${c}$，所以 $p = ${quarter(c)}$。`,
            ),
            para,
            label(2, "Move from the vertex", "从顶点出发移动"),
            both(
              `The parabola opens ${directionWords(vertical, c > 0).en}, so add $p$ to the ${vertical ? "$y$" : "$x$"}-coordinate of the vertex:`,
              `抛物线开口${directionWords(vertical, c > 0)["zh-CN"]}，所以把 $p$ 加到顶点的${vertical ? "纵" : "横"}坐标上：`,
              vertical ? `\\left(${h}, ${k} ${pm(p)}\\right) = ${pt(fx, fy)}` : `\\left(${h} ${pm(p)}, ${k}\\right) = ${pt(fx, fy)}`,
            ),
            focusCheck(vertical, h, k, p),
          ),
        });
      },
    },
    {
      id: "focus-from-the-vertex-form",
      figure: conicDrawings["calculating-the-focus-of-a-parabola#focus-from-the-vertex-form"],
      title: t("From the vertex form", "由顶点式求焦点"),
      explanation: t(
        "To find the focus of $y = a(x - h)^{2} + k$, divide by $a$: $(x - h)^{2} = \\frac{1}{a}(y - k)$, so $4p = \\frac{1}{a}$ and\n\n$$p = \\frac{1}{4a}$$\n\nFor $y = 2(x - 3)^{2} + 1$: $p = \\frac{1}{8}$, and the focus is $\\left(3, 1 + \\frac{1}{8}\\right) = \\left(3, \\frac{9}{8}\\right)$. Likewise $x = a(y - k)^{2} + h$ has focus $\\left(h + \\frac{1}{4a}, k\\right)$.\n\n> **Watch out.** $p = \\frac{1}{4a}$, not $4a$: for $y = 2x^{2}$, $p = \\frac{1}{8}$.",
        "要求 $y = a(x - h)^{2} + k$ 的焦点，两边除以 $a$：$(x - h)^{2} = \\frac{1}{a}(y - k)$，所以 $4p = \\frac{1}{a}$，\n\n$$p = \\frac{1}{4a}$$\n\n对 $y = 2(x - 3)^{2} + 1$：$p = \\frac{1}{8}$，焦点是 $\\left(3, 1 + \\frac{1}{8}\\right) = \\left(3, \\frac{9}{8}\\right)$。同样，$x = a(y - k)^{2} + h$ 的焦点是 $\\left(h + \\frac{1}{4a}, k\\right)$。\n\n> **注意。** $p = \\frac{1}{4a}$，不是 $4a$：对 $y = 2x^{2}$，$p = \\frac{1}{8}$。",
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
          solution: join(
            label(1, "Find p", "求 p"),
            both(
              `The vertex is $${pt(h, k)}$ and $a = ${num(a)}$, so`,
              `顶点是 $${pt(h, k)}$，$a = ${num(a)}$，所以`,
              `p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}`,
            ),
            para,
            label(2, "Move from the vertex", "从顶点出发移动"),
            both(
              `The parabola opens ${directionWords(vertical, a.sign() > 0).en}, so add $p$ to the ${vertical ? "$y$" : "$x$"}-coordinate of the vertex:`,
              `抛物线开口${directionWords(vertical, a.sign() > 0)["zh-CN"]}，所以把 $p$ 加到顶点的${vertical ? "纵" : "横"}坐标上：`,
              vertical ? `\\left(${h}, ${k} ${pm(p)}\\right) = ${pt(fx, fy)}` : `\\left(${h} ${pm(p)}, ${k}\\right) = ${pt(fx, fy)}`,
            ),
            focusCheck(vertical, h, k, p),
          ),
        });
      },
    },
    {
      id: "focus-from-the-general-form",
      figure: conicDrawings["calculating-the-focus-of-a-parabola#focus-from-the-general-form"],
      title: t("From the general form", "由一般方程求焦点"),
      explanation: t(
        "When the equation is in general form, first complete the square to reach the conic form, then read the vertex and $p$:\n\n$$y^{2} + 4y - 8x + 20 = 0 \\Rightarrow y^{2} + 4y + 4 = 8x - 16 \\Rightarrow (y + 2)^{2} = 8(x - 2)$$\n\nThe vertex is $(2, -2)$ and $4p = 8$, so $p = 2$ and the focus is $(4, -2)$.\n\n> **Watch out.** Complete the square before reading the focus. The coefficients of the general form are not $h$, $k$ or $4p$.",
        "方程是一般形式时，先配方化成圆锥曲线形式，再读出顶点和 $p$：\n\n$$y^{2} + 4y - 8x + 20 = 0 \\Rightarrow y^{2} + 4y + 4 = 8x - 16 \\Rightarrow (y + 2)^{2} = 8(x - 2)$$\n\n顶点是 $(2, -2)$，$4p = 8$，所以 $p = 2$，焦点是 $(4, -2)$。\n\n> **注意。** 先配方，再读焦点。一般方程的系数不是 $h$、$k$ 或 $4p$。",
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
          solution: join(
            label(1, "Complete the square", "配方"),
            t(how.en.trimEnd(), how["zh-CN"].trimEnd()),
            para,
            label(2, "Read the vertex and p", "读出顶点和 p"),
            t(
              `The vertex is $${pt(g.h, g.k)}$ and $4p = ${g.c}$, so $p = ${quarter(g.c)}$.`,
              `顶点是 $${pt(g.h, g.k)}$，$4p = ${g.c}$，所以 $p = ${quarter(g.c)}$。`,
            ),
            para,
            label(3, "Move from the vertex", "从顶点出发移动"),
            t(
              `The parabola opens ${directionWords(g.vertical, g.c > 0).en}, so the focus is $${pt(fx, fy)}$.`,
              `抛物线开口${directionWords(g.vertical, g.c > 0)["zh-CN"]}，所以焦点是 $${pt(fx, fy)}$。`,
            ),
            focusCheck(g.vertical, g.h, g.k, p),
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
  encompasses: [{ topic: "calculating-the-focus-of-a-parabola", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.2"],
  intro: t(
    `You can find the focus of a parabola $p$ units from its vertex. The directrix is the other half of the definition: it lies $p$ units on the opposite side, and together with the focus it fixes the parabola completely.

Take $x^{2} = -4(y - 3)$. The vertex is $(0, 3)$ and $4p = -4$, so $p = -1$ and the focus is $(0, 2)$, below the vertex. The directrix is the same distance above it:

$$y = 3 - (-1) = 4.$$

The vertex $(0, 3)$ is halfway between the focus and the line $y = 4$.`,
    `你已经会求距顶点 $p$ 个单位的焦点。准线是定义的另一半：它在另一侧、距顶点 $p$ 个单位，与焦点一起完全确定抛物线。

以 $x^{2} = -4(y - 3)$ 为例。顶点是 $(0, 3)$，$4p = -4$，所以 $p = -1$，焦点是 $(0, 2)$，在顶点下方。准线在顶点上方同样远处：

$$y = 3 - (-1) = 4.$$

顶点 $(0, 3)$ 正在焦点与直线 $y = 4$ 的中间。`,
  ),
  knowledgePoints: [
    {
      id: "directrix-from-the-conic-form",
      figure: conicDrawings["calculating-the-directrix-of-a-parabola#directrix-from-the-conic-form"],
      title: t("From the conic form", "由圆锥曲线形式求准线"),
      explanation: t(
        "The directrix is perpendicular to the axis of symmetry, $p$ units from the vertex on the side away from the focus, outside the parabola:\n\n- $(x - h)^{2} = 4p(y - k)$ has directrix $y = k - p$;\n- $(y - k)^{2} = 4p(x - h)$ has directrix $x = h - p$.\n\nFor $(y - 1)^{2} = 6(x + 2)$: the vertex is $(-2, 1)$, $p = \\frac{6}{4} = \\frac{3}{2}$, and the directrix is $x = -2 - \\frac{3}{2} = -\\frac{7}{2}$. A parabola opening left or right has a vertical directrix $x = \\ldots$.\n\n> **Watch out.** The directrix is a line, so the answer is an equation such as $y = 2$, not a point.",
        "准线垂直于对称轴，在远离焦点的一侧、距顶点 $p$ 个单位，位于抛物线外侧：\n\n- $(x - h)^{2} = 4p(y - k)$ 的准线是 $y = k - p$；\n- $(y - k)^{2} = 4p(x - h)$ 的准线是 $x = h - p$。\n\n对 $(y - 1)^{2} = 6(x + 2)$：顶点是 $(-2, 1)$，$p = \\frac{6}{4} = \\frac{3}{2}$，准线是 $x = -2 - \\frac{3}{2} = -\\frac{7}{2}$。开口向左或向右的抛物线，准线是竖直的 $x = \\ldots$。\n\n> **注意。** 准线是一条直线，所以答案是像 $y = 2$ 这样的方程，而不是一个点。",
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
          solution: join(
            label(1, "Read the vertex and p", "读出顶点和 p"),
            t(
              `The vertex is $${pt(h, k)}$ and $4p = ${c}$, so $p = ${quarter(c)}$.`,
              `顶点是 $${pt(h, k)}$，$4p = ${c}$，所以 $p = ${quarter(c)}$。`,
            ),
            para,
            label(2, "Move away from the focus", "向远离焦点的方向移动"),
            both(
              `The directrix is a ${vertical ? "horizontal" : "vertical"} line on the side away from the focus, so subtract $p$:`,
              `准线是在远离焦点一侧的${vertical ? "水平" : "竖直"}直线，所以减去 $p$：`,
              `${answer.replace(/ = .*/, "")} = ${vertical ? k : h} - ${paren(p)} = ${answer.replace(/^. = /, "")}`,
            ),
            focusCheck(vertical, h, k, p),
          ),
        });
      },
    },
    {
      id: "directrix-from-the-vertex-form",
      figure: conicDrawings["calculating-the-directrix-of-a-parabola#directrix-from-the-vertex-form"],
      title: t("From the vertex form", "由顶点式求准线"),
      explanation: t(
        "For $y = a(x - h)^{2} + k$, $p = \\frac{1}{4a}$ and the directrix is $y = k - \\frac{1}{4a}$. For $y = -\\frac{1}{8}(x + 1)^{2} + 3$: $p = \\frac{1}{4 \\cdot (-\\frac{1}{8})} = -2$, and the directrix is $y = 3 - (-2) = 5$, above the downward-opening parabola. Likewise $x = a(y - k)^{2} + h$ has directrix $x = h - \\frac{1}{4a}$.\n\n> **Watch out.** Subtract $p$ from the vertex, do not add it: the directrix is on the side away from the focus.",
        "对 $y = a(x - h)^{2} + k$，$p = \\frac{1}{4a}$，准线是 $y = k - \\frac{1}{4a}$。对 $y = -\\frac{1}{8}(x + 1)^{2} + 3$：$p = \\frac{1}{4 \\cdot (-\\frac{1}{8})} = -2$，准线是 $y = 3 - (-2) = 5$，在这条开口向下的抛物线上方。同样，$x = a(y - k)^{2} + h$ 的准线是 $x = h - \\frac{1}{4a}$。\n\n> **注意。** 从顶点减去 $p$，不要加上：准线在远离焦点的一侧。",
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
          solution: join(
            label(1, "Find p", "求 p"),
            both(
              `The vertex is $${pt(h, k)}$ and $a = ${num(a)}$, so`,
              `顶点是 $${pt(h, k)}$，$a = ${num(a)}$，所以`,
              `p = \\frac{1}{4a} = \\frac{1}{4 \\cdot ${paren(a)}} = ${num(p)}`,
            ),
            para,
            label(2, "Move away from the focus", "向远离焦点的方向移动"),
            both(
              `The directrix is a ${vertical ? "horizontal" : "vertical"} line on the side away from the focus, so subtract $p$:`,
              `准线是在远离焦点一侧的${vertical ? "水平" : "竖直"}直线，所以减去 $p$：`,
              `${answer.replace(/ = .*/, "")} = ${vertical ? k : h} - ${paren(p)} = ${answer.replace(/^. = /, "")}`,
            ),
            focusCheck(vertical, h, k, p),
          ),
        });
      },
    },
    {
      id: "directrix-from-the-vertex-and-focus",
      figure: conicDrawings["calculating-the-directrix-of-a-parabola#directrix-from-the-vertex-and-focus"],
      title: t("From the vertex and focus", "由顶点和焦点求准线"),
      explanation: t(
        "The vertex is the midpoint between the focus and the directrix, so the directrix is as far beyond the vertex as the focus is on the other side. Vertex $(2, 1)$ and focus $(2, 4)$: the focus is $3$ above the vertex, so the directrix is $3$ below it, $y = 1 - 3 = -2$. If the vertex and focus have the same $y$-coordinate, the axis is horizontal and the directrix is a vertical line $x = \\ldots$.\n\n> **Watch out.** The directrix is perpendicular to the axis. If the vertex and focus share their $x$-coordinate, the directrix is $y = \\ldots$, not $x = \\ldots$.",
        "顶点是焦点与准线的中点，所以准线在顶点另一侧，与顶点的距离等于焦点到顶点的距离。顶点 $(2, 1)$，焦点 $(2, 4)$：焦点在顶点上方 $3$ 个单位，所以准线在顶点下方 $3$ 个单位，$y = 1 - 3 = -2$。若顶点与焦点的纵坐标相同，对称轴是水平的，准线是竖直直线 $x = \\ldots$。\n\n> **注意。** 准线垂直于对称轴。若顶点与焦点的横坐标相同，准线是 $y = \\ldots$，而不是 $x = \\ldots$。",
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
          solution: join(
            label(1, "Find p", "求 p"),
            t(
              `The vertex and focus share their ${vertical ? "$x$" : "$y$"}-coordinate, so the axis is ${vertical ? "vertical" : "horizontal"}. The focus is $${Math.abs(p)}$ ${vertical ? (p > 0 ? "above" : "below") : p > 0 ? "to the right of" : "to the left of"} the vertex, so $p = ${p}$.`,
              `顶点与焦点的${vertical ? "横" : "纵"}坐标相同，所以对称轴是${vertical ? "竖直" : "水平"}的。焦点在顶点${vertical ? (p > 0 ? "上方" : "下方") : p > 0 ? "右方" : "左方"} $${Math.abs(p)}$ 个单位，所以 $p = ${p}$。`,
            ),
            para,
            label(2, "Go the same distance the other way", "向另一侧走同样的距离"),
            both(
              `The directrix is $${Math.abs(p)}$ ${Math.abs(p) === 1 ? "unit" : "units"} on the other side of the vertex:`,
              `准线在顶点另一侧 $${Math.abs(p)}$ 个单位处：`,
              `${vertical ? "y" : "x"} = ${vertical ? k : h} - ${paren(p)} = ${vertical ? k - p : h - p}`,
            ),
            focusCheck(vertical, h, k, Q.of(p)),
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
  encompasses: [{ topic: "roots-of-quadratic-functions", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `You have found the roots of quadratic functions, where a graph crosses the $x$-axis. For a parabola opening left or right the roles change: setting $y = 0$ gives one $x$-intercept, and setting $x = 0$ gives a quadratic equation for the $y$-intercepts. Intercepts anchor a sketch of the parabola.

Take $x = y^{2} - 2y - 3$. At $y = 0$ it gives $x = -3$, so the $x$-intercept is $(-3, 0)$. At $x = 0$:

$$y^{2} - 2y - 3 = 0, \\quad (y - 3)(y + 1) = 0.$$

The $y$-intercepts are $(0, 3)$ and $(0, -1)$.`,
    `你已经会求二次函数的根，也就是图象与 $x$ 轴的交点。对开口向左或向右的抛物线，角色互换了：令 $y = 0$ 得到唯一一个与 $x$ 轴的交点，令 $x = 0$ 得到求与 $y$ 轴交点的一元二次方程。这些交点是画抛物线草图的依据。

以 $x = y^{2} - 2y - 3$ 为例。$y = 0$ 时 $x = -3$，所以与 $x$ 轴的交点是 $(-3, 0)$。令 $x = 0$：

$$y^{2} - 2y - 3 = 0, \\quad (y - 3)(y + 1) = 0.$$

与 $y$ 轴的交点是 $(0, 3)$ 和 $(0, -1)$。`,
  ),
  knowledgePoints: [
    {
      id: "the-x-intercept-of-a-horizontal-parabola",
      figure: conicDrawings["calculating-intercepts-of-parabolas#the-x-intercept-of-a-horizontal-parabola"],
      title: t("The x-intercept of a horizontal parabola", "开口向左右的抛物线与 x 轴的交点"),
      explanation: t(
        "Every point of the $x$-axis has $y = 0$. A parabola $x = ay^{2} + by + c$ gives exactly one $x$ for each $y$, so it crosses the $x$-axis exactly once, where $y = 0$:\n\n$$x = 2(0)^{2} - 3(0) + 5 = 5$$\n\nSo $x = 2y^{2} - 3y + 5$ has $x$-intercept $(5, 0)$. For $x = -(y - 2)^{2} + 1$: $x = -(0 - 2)^{2} + 1 = -3$, so the $x$-intercept is $(-3, 0)$.\n\n> **Watch out.** An $x$-intercept has $y = 0$, so write it as $(x, 0)$, not $(0, x)$.",
        "$x$ 轴上每一点都有 $y = 0$。抛物线 $x = ay^{2} + by + c$ 对每个 $y$ 恰好给出一个 $x$，所以它与 $x$ 轴恰有一个交点，在 $y = 0$ 处：\n\n$$x = 2(0)^{2} - 3(0) + 5 = 5$$\n\n所以 $x = 2y^{2} - 3y + 5$ 与 $x$ 轴的交点是 $(5, 0)$。对 $x = -(y - 2)^{2} + 1$：$x = -(0 - 2)^{2} + 1 = -3$，所以与 $x$ 轴的交点是 $(-3, 0)$。\n\n> **注意。** 与 $x$ 轴的交点有 $y = 0$，所以写成 $(x, 0)$，不是 $(0, x)$。",
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
            solution: join(
              label(1, "Set y = 0", "令 y = 0"),
              t(
                "Every point of the $x$-axis has $y = 0$, and a parabola $x = \\ldots$ gives one $x$ for each $y$, so there is exactly one $x$-intercept.",
                "$x$ 轴上每一点都有 $y = 0$；抛物线 $x = \\ldots$ 对每个 $y$ 只给出一个 $x$，所以与 $x$ 轴恰有一个交点。",
              ),
              para,
              label(2, "Compute x", "算出 x"),
              both("Substitute $y = 0$:", "代入 $y = 0$：", `x = ${front(a)}(0 - ${paren(k)})^{2}${tail(h)} = ${x}`),
              para,
              t(`So the $x$-intercept is $${pt(x, 0)}$.`, `所以与 $x$ 轴的交点是 $${pt(x, 0)}$。`),
              said(
                `Expand the square instead. At $y = 0$ only the constant term is left, and it is $${x}$: $x = ${quad(a, -2 * a * k, a * k * k + h, "y")}$.`,
                `改为把平方展开。$y = 0$ 时只剩常数项，它是 $${x}$：$x = ${quad(a, -2 * a * k, a * k * k + h, "y")}$。`,
              ),
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
          solution: join(
            label(1, "Set y = 0", "令 y = 0"),
            t(
              "Every point of the $x$-axis has $y = 0$, and a parabola $x = \\ldots$ gives one $x$ for each $y$, so there is exactly one $x$-intercept.",
              "$x$ 轴上每一点都有 $y = 0$；抛物线 $x = \\ldots$ 对每个 $y$ 只给出一个 $x$，所以与 $x$ 轴恰有一个交点。",
            ),
            para,
            label(2, "Compute x", "算出 x"),
            both(
              "Substitute $y = 0$. Every term with $y$ vanishes:",
              "代入 $y = 0$，含 $y$ 的项都为零：",
              `x = ${plugIn(a, b, c, 0)} = ${c}`,
            ),
            para,
            t(`So the $x$-intercept is $${pt(c, 0)}$.`, `所以与 $x$ 轴的交点是 $${pt(c, 0)}$。`),
            said(
              `Group the $y$-terms instead, as $x - ${paren(c)} = y(${linear(a, b, "y")})$. On the $x$-axis $y = 0$, so the right side is $0$ and $x = ${c}$.`,
              `改为把含 $y$ 的项合在一起：$x - ${paren(c)} = y(${linear(a, b, "y")})$。在 $x$ 轴上 $y = 0$，右边为 $0$，所以 $x = ${c}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-y-intercepts-of-a-horizontal-parabola",
      figure: conicDrawings["calculating-intercepts-of-parabolas#the-y-intercepts-of-a-horizontal-parabola"],
      title: t("The y-intercepts of a horizontal parabola", "开口向左右的抛物线与 y 轴的交点"),
      explanation: t(
        "Points of the $y$-axis have $x = 0$, so the $y$-intercepts of $x = ay^{2} + by + c$ come from solving the quadratic equation $ay^{2} + by + c = 0$: there may be two, one or none.\n\n$$x = y^{2} - y - 6: \\quad y^{2} - y - 6 = 0 \\Rightarrow (y - 3)(y + 2) = 0$$\n\nSo the $y$-intercepts are $(0, 3)$ and $(0, -2)$. When the vertex is on the same side of the $y$-axis as the direction the parabola opens, such as $x = (y - 1)^{2} + 4$, the parabola never reaches the $y$-axis.\n\n> **Watch out.** The answer asks for $y$-coordinates. Solve $ay^{2} + by + c = 0$; the constant $c$ is the $x$-intercept, not a $y$-intercept.",
        "$y$ 轴上的点有 $x = 0$，所以 $x = ay^{2} + by + c$ 与 $y$ 轴的交点由一元二次方程 $ay^{2} + by + c = 0$ 求得：可能有两个、一个或没有。\n\n$$x = y^{2} - y - 6: \\quad y^{2} - y - 6 = 0 \\Rightarrow (y - 3)(y + 2) = 0$$\n\n所以与 $y$ 轴的交点是 $(0, 3)$ 和 $(0, -2)$。若顶点在 $y$ 轴的一侧，而抛物线又朝这一侧开口，如 $x = (y - 1)^{2} + 4$，抛物线就碰不到 $y$ 轴。\n\n> **注意。** 题目要的是纵坐标。解 $ay^{2} + by + c = 0$；常数 $c$ 给出的是与 $x$ 轴的交点，不是与 $y$ 轴的交点。",
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
              `Find the $y$-coordinates of the $y$-intercepts of the parabola $x = ${quad(a, b, c, "y")}$. Type none if there are none.`,
              `求抛物线 $x = ${quad(a, b, c, "y")}$ 与 $y$ 轴交点的纵坐标。若没有交点，请输入 none。`,
            ),
            values: [num(r), num(s)],
            variable: "y",
            wrong: [[num(-r), num(-s)], [num(c)], []],
            solution: join(
              label(1, "Set x = 0", "令 x = 0"),
              both(
                "Points of the $y$-axis have $x = 0$. Set $x = 0$ and factor:",
                "$y$ 轴上的点有 $x = 0$。令 $x = 0$ 并分解因式：",
                `${quad(a, b, c, "y")} = 0`,
                `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`,
              ),
              para,
              label(2, "Read the intercepts", "读出交点"),
              t(
                `A product is $0$ when a factor is $0$, so $y = ${r}$ or $y = ${s}$. The $y$-intercepts are $${pt(0, r)}$ and $${pt(0, s)}$.`,
                `乘积为 $0$ 时有一个因式为 $0$，所以 $y = ${r}$ 或 $y = ${s}$。与 $y$ 轴的交点是 $${pt(0, r)}$ 和 $${pt(0, s)}$。`,
              ),
              said(
                `Substitute each value back into $x = ${quad(a, b, c, "y")}$. Both give $x = 0$:${disp(`${plugIn(a, b, c, r)} = 0`, `${plugIn(a, b, c, s)} = 0`)}`,
                `把两个值分别代回 $x = ${quad(a, b, c, "y")}$，都得到 $x = 0$：${disp(`${plugIn(a, b, c, r)} = 0`, `${plugIn(a, b, c, s)} = 0`)}`,
              ),
            ),
          });
        }
        const k = rng.nonZero(-5, 5);
        const h = (a > 0 ? 1 : -1) * rng.int(1, 9);
        const b = -2 * a * k;
        const c = a * k * k + h;
        return solutionsProblem({
          prompt: t(
            `Find the $y$-coordinates of the $y$-intercepts of the parabola $x = ${quad(a, b, c, "y")}$. Type none if there are none.`,
            `求抛物线 $x = ${quad(a, b, c, "y")}$ 与 $y$ 轴交点的纵坐标。若没有交点，请输入 none。`,
          ),
          values: [],
          variable: "y",
          wrong: [[num(k)], [num(c)]],
          solution: join(
            label(1, "Complete the square", "配方"),
            t(
              `The quadratic does not factor, so complete the square in $y$: $x = ${vertexForm(a, k, h, "y")}$.`,
              `这个二次式不能分解，所以对 $y$ 配方：$x = ${vertexForm(a, k, h, "y")}$。`,
            ),
            para,
            label(2, "Set x = 0", "令 x = 0"),
            both("Points of the $y$-axis have $x = 0$:", "$y$ 轴上的点有 $x = 0$：", `${sq(k, "y")} = ${num(Q.of(-h, a))}`),
            para,
            t(
              `A square cannot be negative, so there are no $y$-intercepts: $\\varnothing$. The vertex $${pt(h, k)}$ is on the ${h > 0 ? "right" : "left"} of the $y$-axis and the parabola opens ${a > 0 ? "to the right" : "to the left"}, away from it.`,
              `平方不可能是负数，所以与 $y$ 轴没有交点：$\\varnothing$。顶点 $${pt(h, k)}$ 在 $y$ 轴${h > 0 ? "右" : "左"}侧，抛物线又开口${a > 0 ? "向右" : "向左"}，背离 $y$ 轴。`,
            ),
            said(
              `The discriminant of $${quad(a, b, c, "y")} = 0$ is negative, so the equation has no real solutions:${disp(`b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${b * b - 4 * a * c}`)}`,
              `$${quad(a, b, c, "y")} = 0$ 的判别式为负，所以方程没有实数解：${disp(`b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${b * b - 4 * a * c}`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "x-intercepts-from-the-conic-form",
      figure: conicDrawings["calculating-intercepts-of-parabolas#x-intercepts-from-the-conic-form"],
      title: t("x-intercepts from the conic form", "由圆锥曲线形式求与 x 轴的交点"),
      explanation: t(
        "To find the $x$-intercepts of $(x - h)^{2} = 4p(y - k)$, substitute $y = 0$ and take square roots:\n\n$$(x - 1)^{2} = 4(0 - (-3)) = 12 \\Rightarrow x - 1 = \\pm\\sqrt{12} = \\pm 2\\sqrt{3} \\Rightarrow x = 1 \\pm 2\\sqrt{3}$$\n\nIf the right side is negative there are no $x$-intercepts, and if it is $0$ the vertex is on the $x$-axis.\n\n> **Watch out.** A square root gives two values, $\\pm$. If the right side is negative there is no intercept at all.",
        "要求 $(x - h)^{2} = 4p(y - k)$ 与 $x$ 轴的交点，代入 $y = 0$ 再开平方：\n\n$$(x - 1)^{2} = 4(0 - (-3)) = 12 \\Rightarrow x - 1 = \\pm\\sqrt{12} = \\pm 2\\sqrt{3} \\Rightarrow x = 1 \\pm 2\\sqrt{3}$$\n\n若右边为负，就与 $x$ 轴没有交点；若为 $0$，顶点就在 $x$ 轴上。\n\n> **注意。** 开平方得到正负两个值 $\\pm$。若右边为负，就根本没有交点。",
      ),
      generate(rng) {
        const c = rng.nonZero(-8, 8);
        const h = rng.int(-5, 5);
        const k = (rng.bool(0.8) ? -Math.sign(c) : Math.sign(c)) * rng.int(1, 6);
        const n = -c * k;
        const values = pmRoot(h, n);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the $x$-intercepts of the parabola $${verticalConic(h, k, c)}$. Type none if there are none.`,
            `求抛物线 $${verticalConic(h, k, c)}$ 与 $x$ 轴交点的横坐标。若没有交点，请输入 none。`,
          ),
          values,
          wrong: [pmRoot(h, -n), pmRoot(-h, n), n > 0 ? [num(h + n), num(h - n)] : [num(h)]],
          solution: join(
            label(1, "Set y = 0", "令 y = 0"),
            both(
              "Points of the $x$-axis have $y = 0$. Substitute it:",
              "$x$ 轴上的点有 $y = 0$。代入：",
              `${sq(h)} = ${c}(0 - ${paren(k)}) = ${n}`,
            ),
            para,
            label(2, n < 0 ? "Look at the sign" : "Take square roots", n < 0 ? "看符号" : "开平方"),
            t(
              n < 0
                ? "A square cannot be negative, so there are no $x$-intercepts: $\\varnothing$."
                : n === 0
                  ? `The square is $0$ only when $x = ${h}$.`
                  : `So $x - ${paren(h)} = \\pm\\sqrt{${n}}$, which gives $x = ${values.join("$ or $x = ")}$.`,
              n < 0
                ? "平方不可能是负数，所以与 $x$ 轴没有交点：$\\varnothing$。"
                : n === 0
                  ? `只有 $x = ${h}$ 时平方为 $0$。`
                  : `所以 $x - ${paren(h)} = \\pm\\sqrt{${n}}$，得 $x = ${values.join("$ 或 $x = ")}$。`,
            ),
            said(
              n < 0
                ? `The vertex $${pt(h, k)}$ is ${k > 0 ? "above" : "below"} the $x$-axis and the parabola opens ${c > 0 ? "upward" : "downward"}, away from the axis, so it never reaches it.`
                : n === 0
                  ? `The vertex $${pt(h, k)}$ is on the $x$-axis, so it is the only intercept.`
                  : `The vertex $${pt(h, k)}$ is ${k > 0 ? "above" : "below"} the $x$-axis and the parabola opens ${c > 0 ? "upward" : "downward"}, toward the axis, so it crosses it twice. The two crossings are mirror images in the axis of symmetry $x = ${h}$, each $\\sqrt{${n}}$ from it.`,
              n < 0
                ? `顶点 $${pt(h, k)}$ 在 $x$ 轴${k > 0 ? "上方" : "下方"}，抛物线开口${c > 0 ? "向上" : "向下"}，背离 $x$ 轴，所以永远碰不到它。`
                : n === 0
                  ? `顶点 $${pt(h, k)}$ 在 $x$ 轴上，所以它是唯一的交点。`
                  : `顶点 $${pt(h, k)}$ 在 $x$ 轴${k > 0 ? "上方" : "下方"}，抛物线开口${c > 0 ? "向上" : "向下"}，朝向 $x$ 轴，所以与它相交两次。两个交点关于对称轴 $x = ${h}$ 对称，到它的距离都是 $\\sqrt{${n}}$。`,
            ),
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
  encompasses: [{ topic: "finding-intersections-of-lines-and-quadratic-functions", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.7"],
  intro: t(
    `You have found where a line meets the graph of a quadratic function by substituting and solving. The same idea finds where a line meets a parabola opening left or right, and here it is easier to solve the line for $x$.

Take $x = y^{2}$ and the line $y = x - 2$, which is $x = y + 2$. Substitute:

$$y + 2 = y^{2}, \\quad (y - 2)(y + 1) = 0.$$

So $y = 2$ or $y = -1$, and the line gives $x = 4$ or $x = 1$. The intersection points are $(4, 2)$ and $(1, -1)$.`,
    `你已经会用代入法求直线与二次函数图象的交点。同样的方法也能求直线与开口向左或向右的抛物线的交点，这时把直线方程解出 $x$ 更方便。

以 $x = y^{2}$ 和直线 $y = x - 2$（即 $x = y + 2$）为例。代入：

$$y + 2 = y^{2}, \\quad (y - 2)(y + 1) = 0.$$

所以 $y = 2$ 或 $y = -1$，由直线得 $x = 4$ 或 $x = 1$。交点是 $(4, 2)$ 和 $(1, -1)$。`,
  ),
  knowledgePoints: [
    {
      id: "vertical-lines",
      figure: conicDrawings["intersections-of-parabolas-with-lines#vertical-lines"],
      title: t("Vertical lines", "竖直直线"),
      explanation: t(
        "A vertical line $x = d$ can meet a parabola opening left or right at two points. Substitute $x = d$ and solve for $y$:\n\n$$x = (y - 1)^{2} - 3, \\; x = 6: \\quad 6 = (y - 1)^{2} - 3 \\Rightarrow (y - 1)^{2} = 9 \\Rightarrow y = 4 \\text{ or } y = -2$$\n\nThe intersection points are $(6, 4)$ and $(6, -2)$; both have $x = 6$.\n\n> **Watch out.** Both intersection points have the line's $x$-coordinate. Keep it first when you write the point.",
        "竖直直线 $x = d$ 可能与开口向左或向右的抛物线交于两点。代入 $x = d$ 并解出 $y$：\n\n$$x = (y - 1)^{2} - 3, \\; x = 6: \\quad 6 = (y - 1)^{2} - 3 \\Rightarrow (y - 1)^{2} = 9 \\Rightarrow y = 4 \\text{ 或 } y = -2$$\n\n交点是 $(6, 4)$ 和 $(6, -2)$；它们的横坐标都是 $6$。\n\n> **注意。** 两个交点的横坐标都等于直线的 $x$。写点时把它放在前面。",
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
          solution: join(
            label(1, "Substitute the line", "代入直线"),
            both(
              `Every point of the line has $x = ${x}$. Substitute it and isolate the square:`,
              `直线上每一点都有 $x = ${x}$。代入并使平方单独在一边：`,
              `${x} = ${vertexForm(a, k, h, "y")}`,
              `${sq(k, "y")} = ${d * d}`,
            ),
            para,
            label(2, "Take square roots", "开平方"),
            t(
              `So $y = ${k} + ${d} = ${k + d}$ or $y = ${k} - ${d} = ${k - d}$. The greater is $y = ${k + d}$, and the point is $${pt(x, k + d)}$.`,
              `所以 $y = ${k} + ${d} = ${k + d}$ 或 $y = ${k} - ${d} = ${k - d}$。较大的是 $y = ${k + d}$，交点是 $${pt(x, k + d)}$。`,
            ),
            said(
              `Substitute $y = ${k + d}$ into the parabola. It gives back the line's $x$:${disp(`x = ${front(a)}(${k + d} - ${paren(k)})^{2}${tail(h)} = ${x}`)}`,
              `把 $y = ${k + d}$ 代入抛物线，得到的正是直线的 $x$：${disp(`x = ${front(a)}(${k + d} - ${paren(k)})^{2}${tail(h)} = ${x}`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "slanted-lines",
      title: t("Slanted lines", "斜直线"),
      explanation: t(
        "To intersect $x = ay^{2} + by + c$ with a line, solve the line for $x$ and substitute, which leaves a quadratic equation in $y$. For $x = y^{2} - 2y - 1$ and $x - y = 3$:\n\n$$x = y + 3 \\Rightarrow y + 3 = y^{2} - 2y - 1 \\Rightarrow y^{2} - 3y - 4 = 0 \\Rightarrow (y - 4)(y + 1) = 0$$\n\nAt $y = 4$, $x = 7$; at $y = -1$, $x = 2$. The intersection points are $(7, 4)$ and $(2, -1)$.\n\n> **Watch out.** After finding $y$, get $x$ from the line, which is simpler than the parabola, and keep each $x$ with its own $y$.",
        "要求 $x = ay^{2} + by + c$ 与直线的交点，先把直线方程解出 $x$ 再代入，得到关于 $y$ 的一元二次方程。对 $x = y^{2} - 2y - 1$ 与 $x - y = 3$：\n\n$$x = y + 3 \\Rightarrow y + 3 = y^{2} - 2y - 1 \\Rightarrow y^{2} - 3y - 4 = 0 \\Rightarrow (y - 4)(y + 1) = 0$$\n\n$y = 4$ 时 $x = 7$；$y = -1$ 时 $x = 2$。交点是 $(7, 4)$ 和 $(2, -1)$。\n\n> **注意。** 求出 $y$ 后，用直线方程求 $x$，比用抛物线方程简单；每个 $x$ 要与它对应的 $y$ 配对。",
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
          solution: join(
            label(1, "Solve the line for x", "把直线方程解出 x"),
            t(`Move the $y$-term to the right: $x = ${linear(m, n, "y")}$.`, `把含 $y$ 的项移到右边：$x = ${linear(m, n, "y")}$。`),
            para,
            label(2, "Substitute and factor", "代入并分解因式"),
            both(
              "Substitute into the parabola, collect terms on one side and factor:",
              "代入抛物线方程，把各项移到一边再分解因式：",
              `${linear(m, n, "y")} = ${quad(a, b, c, "y")}`,
              `${quad(a, b - m, c - n, "y")} = 0`,
              `${front(a)}${factorOf(r, "y")}${factorOf(s, "y")} = 0`,
            ),
            para,
            label(3, "Find the point", "求交点"),
            t(
              `So $y = ${r}$ or $y = ${s}$. The greater is $y = ${top}$, and on the line $x = ${m * top + n}$. The point is $${pt(m * top + n, top)}$.`,
              `所以 $y = ${r}$ 或 $y = ${s}$。较大的是 $y = ${top}$，在直线上 $x = ${m * top + n}$。交点是 $${pt(m * top + n, top)}$。`,
            ),
            said(
              `The point must be on both curves. It satisfies the parabola and the line:${disp(`${plugIn(a, b, c, top)} = ${m * top + n}`, `${m * top + n} - ${paren(m)} \\cdot ${paren(top)} = ${n}`)}`,
              `这个点必须同时在两条曲线上。它满足抛物线方程和直线方程：${disp(`${plugIn(a, b, c, top)} = ${m * top + n}`, `${m * top + n} - ${paren(m)} \\cdot ${paren(top)} = ${n}`)}`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-intersection-points",
      figure: conicDrawings["intersections-of-parabolas-with-lines#counting-intersection-points"],
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        "After substituting, the discriminant of the quadratic equation in $y$ counts the intersection points: two if it is positive, one if it is $0$ (the line is **tangent** to the parabola), none if it is negative. For $x = y^{2} + 3$ and $x - 2y = 1$:\n\n$$2y + 1 = y^{2} + 3 \\Rightarrow y^{2} - 2y + 2 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 2 = -4 < 0$$\n\nSo the line misses the parabola.\n\n> **Watch out.** Use the discriminant of the equation you get after substituting and collecting terms, not of the parabola's own equation.",
        "代入后，关于 $y$ 的一元二次方程的判别式决定交点个数：为正有两个，为 $0$ 有一个（直线与抛物线**相切**），为负则没有。对 $x = y^{2} + 3$ 与 $x - 2y = 1$：\n\n$$2y + 1 = y^{2} + 3 \\Rightarrow y^{2} - 2y + 2 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 2 = -4 < 0$$\n\n所以直线与抛物线不相交。\n\n> **注意。** 要用代入并整理后所得方程的判别式，而不是抛物线自身方程的判别式。",
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [A, B, C] = drawBySign(rng, sign);
        const m = rng.nonZero(-4, 4);
        const n = rng.int(-8, 8);
        const b = B + m;
        const c = C + n;
        const d = B * B - 4 * A * C;
        const square = disp(`${sq(Q.of(-B, 2 * A), "y")} = ${num(Q.of(d, 4 * A * A))}`);
        return reasoned(
          choiceProblem({
            prompt: t(
              `How many points do the line $${lineXmy(m, n)}$ and the parabola $x = ${quad(A, b, c, "y")}$ have in common?`,
              `直线 $${lineXmy(m, n)}$ 与抛物线 $x = ${quad(A, b, c, "y")}$ 有几个公共点？`,
            ),
            options: [t("None", "没有交点"), t("Exactly one", "恰有一个"), t("Two", "两个")],
            correct: sign + 1,
            solution: join(
              label(1, "Substitute the line", "代入直线"),
              both(
                `Solve the line for $x$, substitute $x = ${linear(m, n, "y")}$ and move everything to one side:`,
                `把直线方程解出 $x$，代入 $x = ${linear(m, n, "y")}$ 并把所有项移到一边：`,
                `${quad(A, B, C, "y")} = 0`,
              ),
              para,
              label(2, "Find the discriminant", "求判别式"),
              both(
                "Each solution $y$ gives one common point. Count them with",
                "每个解 $y$ 对应一个公共点。用判别式数解的个数：",
                `b^{2} - 4ac = ${paren(B)}^{2} - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${d}`,
              ),
              para,
              t(
                `The discriminant is ${d > 0 ? "positive: two points" : d === 0 ? "zero: exactly one point, where the line is tangent" : "negative: no common points"}.`,
                `判别式${d > 0 ? "为正：有两个公共点" : d === 0 ? "为零：恰有一个公共点，直线与抛物线相切" : "为负：没有公共点"}。`,
              ),
              said(
                `${A === 1 ? "Complete the square" : `Divide by $${A}$ and complete the square`} instead. A square equal to ${d > 0 ? "a positive number has two solutions" : d === 0 ? "zero has one solution" : "a negative number has none"}:${square}`,
                `改为${A === 1 ? "" : `两边除以 $${A}$ 再`}配方。平方等于${d > 0 ? "正数时有两个解" : d === 0 ? "零时只有一个解" : "负数时无解"}：${square}`,
              ),
            ),
          }),
          [
            ["None", `That needs a negative discriminant; here it is $${d}$.`, `那需要判别式为负；这里是 $${d}$。`],
            [
              "Exactly one",
              `That needs a discriminant of $0$, where the line is tangent; here it is $${d}$.`,
              `那需要判别式为 $0$，即直线与抛物线相切；这里是 $${d}$。`,
            ],
            ["Two", `That needs a positive discriminant; here it is $${d}$.`, `那需要判别式为正；这里是 $${d}$。`],
          ],
        );
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
