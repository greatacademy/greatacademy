import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  gcd,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
  union,
} from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { annotate, at, guides, shift } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** plus writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
function plus(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** front writes a coefficient in front of a factor: "", "-", "2". */
function front(a: Coefficient): string {
  const v = toQ(a);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return v.toLatex();
}

/** shifted writes v - h: "x - 3", "x + 2", "x". */
const shifted = (h: Coefficient, v = "x") => linear(1, toQ(h).neg(), v);

/** fracL writes a/den with the sign in front: "\frac{3}{x - 2}", "-\frac{3}{x - 2}". */
const fracL = (a: number, den: string) => (a < 0 ? `-\\frac{${-a}}{${den}}` : `\\frac{${a}}{${den}}`);

/** recipL writes a/(v - h) + k. */
const recipL = (a: number, h: Coefficient, k: Coefficient, v = "x") => `${fracL(a, shifted(h, v))}${plus(k)}`;

/** linRecipL writes a/(bv + c) + k. */
const linRecipL = (a: number, b: number, c: number, k: Coefficient, v = "x") => `${fracL(a, linear(b, c, v))}${plus(k)}`;

/** pt writes an ordered pair: "(3, -\frac{1}{2})". */
const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** pn writes an integer, in parentheses when it is negative: "3", "(-3)". */
const pn = (v: number) => (v < 0 ? `(${v})` : String(v));

/** pq writes a number, in parentheses when it is negative: "\frac{3}{4}", "\left(-\frac{3}{4}\right)". */
const pq = (c: Coefficient) => (toQ(c).sign() < 0 ? `\\left(${num(c)}\\right)` : num(c));

/** quot writes top over bottom and then its value, or only the value when the two read the same: "\frac{12}{-4} = -3". */
function quot(top: number, bottom: number): string {
  const value = num(Q.of(top, bottom));
  const shown = `\\frac{${top}}{${bottom}}`;
  return bottom === 1 || shown === value ? value : `${shown} = ${value}`;
}

/** put writes x − h with a number put in for x: "4 - 3", "-1 + 2". */
const put = (x: Coefficient, h: Coefficient) => `${num(x)}${plus(toQ(h).neg())}`;

/** recipAt writes a/(x − h) + k with a number put in for x, and gives its value. */
function recipAt(a: number, h: Coefficient, k: Coefficient, x: Coefficient): [latex: string, value: Q] {
  return [
    `${fracL(a, put(x, h))}${plus(k)}`,
    Q.of(a)
      .div(toQ(x).sub(toQ(h)))
      .add(toQ(k)),
  ];
}

/** lineAt writes mx + n with a number put in for x: "2 \cdot (-3) + 1". */
const lineAt = (mm: number, n: number, x: number) => `${mm === 1 ? "" : mm === -1 ? "-" : `${mm} \\cdot `}${pn(x)}${plus(n)}`;

/** tryX lists inputs to check an answer with, simplest first. */
const tryX = [2, 3, 1, -1, -2, 4, 5, -3, 6, -4];

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// Sets of real numbers.

/** iv is the interval between lo and hi (infinite when undefined), closed at the ends as given. */
function iv(lo: Coefficient | undefined, hi: Coefficient | undefined, loClosed = true, hiClosed = true): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined && loClosed,
    hiClosed: hi !== undefined && hiClosed,
  };
}

/** allBut is the set of all real numbers except p. */
const allBut = (p: Coefficient): RealSet => union(iv(undefined, p, false, false), iv(p, undefined, false, false));

const setText = (set: RealSet) => `$${intervalLatex(set)}$`;

// Graphs.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** ptL writes a point label with a typographic minus sign: "(1, −2)". */
const ptL = ([x, y]: Point) => `(${x}, ${y})`.replaceAll("-", "−");

/** awayFrom is the direction from the center (h, k) toward the point, where its label goes. */
const awayFrom = ([x, y]: Point, h: number, k: number): Compass => (y >= k ? (x >= h ? "ne" : "nw") : x >= h ? "se" : "sw");

const compassOffsets: Record<Compass, Point> = {
  n: [0, -1],
  ne: [0.71, -0.71],
  e: [1, 0],
  se: [0.71, 0.71],
  s: [0, 1],
  sw: [-0.71, 0.71],
  w: [-1, 0],
  nw: [-0.71, -0.71],
};

/**
 * labelDir picks the direction of a point label in the view: the first of the preferred directions whose label box,
 * placed as plane places it, avoids the curve, the asymptotes, the axes with their numbers, the other points and the
 * edges; the one with the fewest conflicts when none is free. It also returns that number of conflicts, 0 when free.
 */
function labelDir(f: (x: number) => number, h: number, k: number, p: Point, others: readonly Point[], prefer: Compass): [Compass, number] {
  const s = 260 / (view.xMax - view.xMin);
  const sx = (x: number) => 22 + (x - view.xMin) * s;
  const sy = (y: number) => 22 + (view.yMax - y) * s;
  const size = 22 * 2 + 260;
  const curve: Point[] = [];
  for (let i = 0; i <= 600; i++) {
    const x = view.xMin + ((view.xMax - view.xMin) * i) / 600;
    const y = f(x);
    if (Number.isFinite(y) && y >= view.yMin && y <= view.yMax) curve.push([sx(x), sy(y)]);
  }
  const dots = others.map(([x, y]): Point => [sx(x), sy(y)]);
  // The boxes of the numbers on the axes, as plane writes them: [x0, x1, y0, y1].
  const numbers: [number, number, number, number][] = [];
  for (let i = view.xMin; i <= view.xMax; i++) {
    if (i === 0) continue;
    const w = 3 * String(i).length;
    numbers.push([sx(i) - w, sx(i) + w, sy(0) + 5, sy(0) + 15]);
    numbers.push([sx(0) - 5 - 2 * w, sx(0) - 5, sy(i) - 5, sy(i) + 5]);
  }
  const len = ptL(p).length;
  const order: Compass[] = [prefer, "ne", "nw", "se", "sw", "e", "w", "n", "s"];
  let best = prefer;
  let fewest = Number.POSITIVE_INFINITY;
  for (const dir of order) {
    const u = compassOffsets[dir];
    const d = 9 + Math.abs(u[0]) * 3.2 * len;
    const cx = sx(p[0]) + u[0] * d;
    const by = sy(p[1]) + u[1] * d + 4;
    const [x0, x1, y0, y1] = [cx - 3.2 * len - 1, cx + 3.2 * len + 1, by - 10, by + 2];
    const inside = ([x, y]: Point, r = 0) => x >= x0 - r && x <= x1 + r && y >= y0 - r && y <= y1 + r;
    const crossesX = (v: number) => v >= x0 && v <= x1;
    const crossesY = (v: number) => v >= y0 && v <= y1;
    let conflicts = 0;
    if (curve.some((q) => inside(q, 1))) conflicts += 4;
    if ((h !== 0 && crossesX(sx(h))) || (k !== 0 && crossesY(sy(k)))) conflicts += 2;
    if (crossesX(sx(0)) || crossesY(sy(0))) conflicts += 1;
    if (numbers.some(([a0, a1, b0, b1]) => a0 <= x1 && a1 >= x0 && b0 <= y1 && b1 >= y0)) conflicts += 2;
    if (dots.some((q) => inside(q, 5))) conflicts += 2;
    if (x0 < 2 || x1 > size + 8 || y0 < 2 || y1 > size - 2) conflicts += 4;
    if (conflicts === 0) return [dir, 0];
    if (conflicts < fewest) {
      fewest = conflicts;
      best = dir;
    }
  }
  return [best, fewest];
}

/** recipFigure draws y = a/(x − h) + k with its asymptotes dashed (unless they are axes) and labeled points. */
function recipFigure(a: number, h: number, k: number, pts: readonly Point[]): Figure {
  const f = (x: number) => a / (x - h) + k;
  const marks: PlaneMark[] = [];
  if (h !== 0) marks.push({ kind: "line", a: [h, 0], b: [h, 1], dashed: true });
  if (k !== 0) marks.push({ kind: "line", a: [0, k], b: [1, k], dashed: true });
  marks.push({ kind: "curve", f, to: h - 1e-6, accent: true });
  marks.push({ kind: "curve", f, from: h + 1e-6, accent: true });
  for (const p of pts) {
    const others = pts.filter((q) => q !== p);
    marks.push({ kind: "point", at: p, label: ptL(p), dir: labelDir(f, h, k, p, others, awayFrom(p, h, k))[0] });
  }
  const vEn = h === 0 ? "the y-axis" : `the dashed vertical line x = ${h}`;
  const hEn = k === 0 ? "the x-axis" : `the dashed horizontal line y = ${k}`;
  const vZh = h === 0 ? "y 轴" : `竖直虚线 x = ${h}`;
  const hZh = k === 0 ? "x 轴" : `水平虚线 y = ${k}`;
  const list = pts.map(ptL);
  return {
    svg: plane(view, marks),
    alt: t(
      `A curve with two branches, ${a > 0 ? "upper right and lower left" : "upper left and lower right"} of the point (${h}, ${k}), each approaching ${vEn} and ${hEn}${list.length ? `. Marked points: ${list.join(", ")}` : ""}.`,
      `一条由两支组成的曲线，分别位于点 (${h}, ${k}) 的${a > 0 ? "右上方和左下方" : "左上方和右下方"}，每一支都逐渐靠近${vZh}和${hZh}${list.length ? `。标出的点：${list.join("、")}` : ""}。`,
    ),
  };
}

/** freePoints keeps the points of y = a/(x − h) + k whose labels fit in the view without touching anything. */
function freePoints(a: number, h: number, k: number, pts: readonly Point[]): Point[] {
  const f = (x: number) => a / (x - h) + k;
  return pts.filter((p) => labelDir(f, h, k, p, [], awayFrom(p, h, k))[1] === 0);
}

/** latticePoints lists the points of y = a/(x − h) + k with integer coordinates, inside [-5, 5]² and off the axes. */
function latticePoints(a: number, h: number, k: number): Point[] {
  const out: Point[] = [];
  for (let d = -Math.abs(a); d <= Math.abs(a); d++) {
    if (d === 0 || a % d !== 0) continue;
    const [x, y] = [h + d, k + a / d];
    if (x !== 0 && y !== 0 && Math.abs(x) <= 5 && Math.abs(y) <= 5) out.push([x, y]);
  }
  return out;
}

// Descriptions of transformations.

const unitsEn = (n: number) => `$${Math.abs(n)}$ unit${Math.abs(n) === 1 ? "" : "s"}`;

/** shiftX describes a horizontal shift by h. */
const shiftX = (h: number): Text =>
  h > 0 ? t(`shift right ${unitsEn(h)}`, `向右平移 $${h}$ 个单位`) : t(`shift left ${unitsEn(h)}`, `向左平移 $${-h}$ 个单位`);

/** shiftY describes a vertical shift by k. */
const shiftY = (k: number): Text =>
  k > 0 ? t(`shift up ${unitsEn(k)}`, `向上平移 $${k}$ 个单位`) : t(`shift down ${unitsEn(k)}`, `向下平移 $${-k}$ 个单位`);

/** scaleY describes multiplying the outputs by a: a stretch by |a| and, when a < 0, a reflection in the x-axis. */
function scaleY(a: number): Text[] {
  const out: Text[] = [];
  if (Math.abs(a) !== 1) out.push(t(`stretch vertically by a factor of $${Math.abs(a)}$`, `竖直方向伸长为原来的 $${Math.abs(a)}$ 倍`));
  if (a < 0) out.push(t("reflect in the $x$-axis", "关于 $x$ 轴翻折"));
  return out;
}

/** opsText joins operations into a sentence: "Shift right 2 units, then shift up 1 unit." */
function opsText(ops: readonly Text[]): Text {
  const en = ops.map((o) => o.en).join(", then ");
  return t(`${en.charAt(0).toUpperCase()}${en.slice(1)}.`, `${ops.map((o) => o["zh-CN"]).join("，再")}。`);
}

// 5.19.1 Graphing reciprocal functions.

/** graphingReciprocalFunctions introduces the graph of y = k/x: its points, its branches and its asymptotes. */
export const graphingReciprocalFunctions: TopicDef = {
  id: "graphing-reciprocal-functions",
  title: t("Graphing Reciprocal Functions", "倒数函数的图象"),
  summary: t(
    "Find points on the graph of $y = \\frac{k}{x}$, describe its two branches and asymptotes, and read $k$ from the graph.",
    "求 $y = \\frac{k}{x}$ 图象上的点，描述它的两支和渐近线，并由图象读出 $k$。",
  ),
  prerequisites: ["inverse-variation", "unbounded-behavior-of-functions-near-a-point"],
  encompasses: [{ topic: "inverse-variation", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Sharing a fixed amount makes each share smaller as the number of sharers grows: $8$ cookies shared by $x$ children give each child $y = \\frac{8}{x}$ cookies. Taken for every real $x \\ne 0$, this is a **reciprocal function**, and its graph is made of the points with $xy = 8$, such as $(1, 8)$, $(2, 4)$, $(4, 2)$ and $(-2, -4)$.

Check: $(-2)(-4) = 8$, so $(-2, -4)$ is on the graph. No point has $x = 0$, because $\\frac{8}{0}$ is not defined, and no point has $y = 0$, because $xy = 8 \\ne 0$.

In this lesson we find points on the graph of $y = \\frac{k}{x}$, describe its two branches and its asymptotes, and read $k$ from a graph.`,
    `一定的量平均分，分的人越多，每份越小：$8$ 块饼干分给 $x$ 个孩子，每人得 $y = \\frac{8}{x}$ 块。对每个实数 $x \\ne 0$ 都这样取值，就是一个**倒数函数**，它的图象由满足 $xy = 8$ 的点组成，例如 $(1, 8)$、$(2, 4)$、$(4, 2)$ 和 $(-2, -4)$。

检验：$(-2)(-4) = 8$，所以 $(-2, -4)$ 在图象上。没有横坐标为 $0$ 的点，因为 $\\frac{8}{0}$ 无意义；也没有纵坐标为 $0$ 的点，因为 $xy = 8 \\ne 0$。

这节课我们求 $y = \\frac{k}{x}$ 图象上的点，描述它的两支和渐近线，并由图象读出 $k$。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-the-graph-of-k-over-x",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        `The **reciprocal function** $f(x) = \\frac{1}{x}$, and more generally $f(x) = \\frac{k}{x}$ with $k \\ne 0$, is defined for every $x$ except $0$. Multiplying $y = \\frac{k}{x}$ by $x$ shows why one coordinate gives the other: a point $(x, y)$ lies on the graph exactly when $xy = k$. So divide $k$ by the coordinate you know.

On $y = \\frac{6}{x}$, at $x = 4$:

$$y = \\frac{6}{4} = \\frac{3}{2}$$

To find where $y = -2$, divide $6$ by $-2$:

$$x = \\frac{6}{-2} = -3$$

Check: $4 \\cdot \\frac{3}{2} = 6$ and $(-3)(-2) = 6$. The figure shows $y = \\frac{6}{x}$ through $(2, 3)$ and $(-3, -2)$.

> **Watch out.** Divide $k$ by the coordinate, not the coordinate by $k$: $\\frac{4}{6}$ is wrong. Do not multiply them: $6 \\cdot 4 = 24$ is not on the graph. Keep the sign: when $k > 0$ both coordinates have the same sign, and when $k < 0$ opposite signs.`,
        `**倒数函数** $f(x) = \\frac{1}{x}$，以及更一般的 $f(x) = \\frac{k}{x}$（$k \\ne 0$），对除 $0$ 以外的每个 $x$ 都有定义。把 $y = \\frac{k}{x}$ 两边乘以 $x$，就看出为什么一个坐标能给出另一个：点 $(x, y)$ 在图象上，当且仅当 $xy = k$。所以用 $k$ 除以已知的坐标即可。

在 $y = \\frac{6}{x}$ 上，$x = 4$ 时：

$$y = \\frac{6}{4} = \\frac{3}{2}$$

要求 $y = -2$ 的位置，用 $6$ 除以 $-2$：

$$x = \\frac{6}{-2} = -3$$

检验：$4 \\cdot \\frac{3}{2} = 6$，$(-3)(-2) = 6$。图中是经过 $(2, 3)$ 和 $(-3, -2)$ 的 $y = \\frac{6}{x}$ 的图象。

> **注意。** 用 $k$ 除以坐标，而不是用坐标除以 $k$：$\\frac{4}{6}$ 是错的。不要相乘：$6 \\cdot 4 = 24$ 不在图象上。注意符号：$k > 0$ 时两个坐标同号，$k < 0$ 时异号。`,
      ),
      figure: recipFigure(6, 0, 0, [
        [2, 3],
        [-3, -2],
      ]),
      keyPrerequisites: ["inverse-variation"],
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const given = rng.nonZero(-6, 6);
        const fn = fracL(k, "x");
        if (rng.bool()) {
          const y = Q.of(k, given);
          return numberProblem({
            prompt: t(
              `The point $(${given}, y)$ lies on the graph of $y = ${fn}$. Find $y$.`,
              `点 $(${given}, y)$ 在 $y = ${fn}$ 的图象上。求 $y$。`,
            ),
            answer: y,
            solveFor: "y",
            wrong: [Q.of(given, k), Q.of(k * given), y.neg()],
            solution: walked(
              [
                [
                  ["Use the equation", "利用方程"],
                  t(`Every point of the graph has $xy = ${k}$, so this point gives`, `图象上的每个点都满足 $xy = ${k}$，所以这个点给出`),
                  [`${pn(given)} \\cdot y = ${k}`],
                ],
                [["Solve", "求解"], t(`Divide both sides by $${given}$:`, `两边除以 $${given}$：`), [`y = ${quot(k, given)}`]],
              ],
              t(
                `$${given} \\cdot ${pq(y)} = ${k}$, the constant of $y = ${fn}$.`,
                `$${given} \\cdot ${pq(y)} = ${k}$，正是 $y = ${fn}$ 中的常数。`,
              ),
            ),
          });
        }
        const x = Q.of(k, given);
        return numberProblem({
          prompt: t(
            `The point $(x, ${given})$ lies on the graph of $y = ${fn}$. Find $x$.`,
            `点 $(x, ${given})$ 在 $y = ${fn}$ 的图象上。求 $x$。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(given, k), Q.of(k * given), x.neg()],
          solution: walked(
            [
              [
                ["Use the equation", "利用方程"],
                t(`Every point of the graph has $xy = ${k}$, so this point gives`, `图象上的每个点都满足 $xy = ${k}$，所以这个点给出`),
                [`x \\cdot ${pn(given)} = ${k}`],
              ],
              [["Solve", "求解"], t(`Divide both sides by $${given}$:`, `两边除以 $${given}$：`), [`x = ${quot(k, given)}`]],
            ],
            t(
              `$${pq(x)} \\cdot ${pn(given)} = ${k}$, the constant of $y = ${fn}$.`,
              `$${pq(x)} \\cdot ${pn(given)} = ${k}$，正是 $y = ${fn}$ 中的常数。`,
            ),
          ),
        });
      },
    },
    {
      id: "branches-and-asymptotes",
      figure: algebraDrawings2["graphing-reciprocal-functions#branches-and-asymptotes"],
      title: t("Branches and asymptotes", "两支与渐近线"),
      explanation: t(
        `The graph of $y = \\frac{k}{x}$ has two separate **branches**. Since $xy = k$, $x$ and $y$ have the same sign when $k > 0$ and opposite signs when $k < 0$:

- $k > 0$: the branches lie in quadrants I and III;
- $k < 0$: they lie in quadrants II and IV.

Near $x = 0$ the divisor is tiny, so the value is huge in size, and the $y$-axis is a **vertical asymptote**. Far out the divisor is huge, so $\\frac{k}{x} \\to 0$, and the $x$-axis is a **horizontal asymptote**.

For $y = -\\frac{4}{x}$ as $x \\to 0^{+}$, try small positive inputs: $\\frac{-4}{0.01} = -400$ and $\\frac{-4}{0.001} = -4000$, so $y \\to -\\infty$. As $x \\to 0^{-}$ the signs flip and $y \\to \\infty$.

Check: $k = -4 < 0$, so the branch right of $0$ lies in quadrant IV, below the $x$-axis, as $y \\to -\\infty$ says.

> **Watch out.** The side of $0$ matters: the two sides go to opposite infinities. Near $x = 0$ the value is huge, not close to $0$; it is far out that $y \\to 0$. And $y = k$ only at $x = 1$, so $y$ does not approach $k$.`,
        `$y = \\frac{k}{x}$ 的图象由分开的两**支**组成。因为 $xy = k$，当 $k > 0$ 时 $x$ 与 $y$ 同号，当 $k < 0$ 时异号：

- $k > 0$：两支位于第一、三象限；
- $k < 0$：两支位于第二、四象限。

在 $x = 0$ 附近除数很小，函数值的绝对值很大，所以 $y$ 轴是**竖直渐近线**。远处除数很大，$\\frac{k}{x} \\to 0$，所以 $x$ 轴是**水平渐近线**。

对 $y = -\\frac{4}{x}$，当 $x \\to 0^{+}$ 时，代入很小的正数：$\\frac{-4}{0.01} = -400$，$\\frac{-4}{0.001} = -4000$，所以 $y \\to -\\infty$。当 $x \\to 0^{-}$ 时符号相反，$y \\to \\infty$。

检验：$k = -4 < 0$，所以 $0$ 右侧的一支在第四象限，位于 $x$ 轴下方，与 $y \\to -\\infty$ 相符。

> **注意。** 要看是 $0$ 的哪一侧：两侧趋向相反的无穷。在 $x = 0$ 附近函数值的绝对值很大，而不是接近 $0$；远处才有 $y \\to 0$。$y = k$ 只在 $x = 1$ 处成立，$y$ 并不趋近 $k$。`,
      ),
      keyPrerequisites: ["unbounded-behavior-of-functions-near-a-point"],
      generate(rng) {
        const k = rng.nonZero(-20, 20);
        const fn = fracL(k, "x");
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const options = [
            t("Quadrants I and III", "第一、三象限"),
            t("Quadrants II and IV", "第二、四象限"),
            t("Quadrants I and II", "第一、二象限"),
            t("Quadrants III and IV", "第三、四象限"),
          ];
          return reasoned(
            choiceProblem({
              prompt: t(`In which quadrants does the graph of $y = ${fn}$ lie?`, `$y = ${fn}$ 的图象位于哪些象限？`),
              options,
              correct: k > 0 ? 0 : 1,
              solution: walked(
                [
                  [["The sign of the product", "乘积的符号"], t("Every point of the graph has", "图象上的每个点都满足"), [`xy = ${k}`]],
                  [
                    ["The quadrants", "所在象限"],
                    k > 0
                      ? t(
                          "The product is positive, so $x$ and $y$ have the same sign: both positive in quadrant I, or both negative in quadrant III.",
                          "乘积为正，所以 $x$ 与 $y$ 同号：同为正在第一象限，同为负在第三象限。",
                        )
                      : t(
                          "The product is negative, so $x$ and $y$ have opposite signs: $x < 0 < y$ in quadrant II, or $y < 0 < x$ in quadrant IV.",
                          "乘积为负，所以 $x$ 与 $y$ 异号：$x < 0 < y$ 在第二象限，$y < 0 < x$ 在第四象限。",
                        ),
                  ],
                ],
                t(
                  `The points $(1, ${k})$ and $(-1, ${-k})$ lie on the graph, in quadrants ${k > 0 ? "I and III" : "IV and II"}.`,
                  `点 $(1, ${k})$ 和 $(-1, ${-k})$ 在图象上，分别位于第${k > 0 ? "一、三" : "四、二"}象限。`,
                ),
              ),
            }),
            [
              [
                options[0]!.en,
                `That is where the branches lie when $k > 0$. Here $xy = ${k}$ is negative, so $x$ and $y$ have opposite signs.`,
                `那是 $k > 0$ 时两支的位置。这里 $xy = ${k}$ 为负，$x$ 与 $y$ 异号。`,
              ],
              [
                options[1]!.en,
                `That is where the branches lie when $k < 0$. Here $xy = ${k}$ is positive, so $x$ and $y$ have the same sign.`,
                `那是 $k < 0$ 时两支的位置。这里 $xy = ${k}$ 为正，$x$ 与 $y$ 同号。`,
              ],
              [
                options[2]!.en,
                "Both of these quadrants lie above the $x$-axis. But $\\frac{k}{x}$ changes sign when $x$ does, so one branch lies above the $x$-axis and the other below it.",
                "这两个象限都在 $x$ 轴上方。而 $\\frac{k}{x}$ 随 $x$ 变号，所以一支在 $x$ 轴上方，另一支在下方。",
              ],
              [
                options[3]!.en,
                "Both of these quadrants lie below the $x$-axis. But $\\frac{k}{x}$ changes sign when $x$ does, so one branch lies above the $x$-axis and the other below it.",
                "这两个象限都在 $x$ 轴下方。而 $\\frac{k}{x}$ 随 $x$ 变号，所以一支在 $x$ 轴上方，另一支在下方。",
              ],
            ],
          );
        }
        const options = [m("y \\to \\infty"), m("y \\to -\\infty"), m("y \\to 0"), m(`y \\to ${k}`)];
        if (kind === 3) {
          const toPlus = rng.bool();
          const where = toPlus ? "\\infty" : "-\\infty";
          return reasoned(
            choiceProblem({
              prompt: t(`What happens to $y = ${fn}$ as $x \\to ${where}$?`, `当 $x \\to ${where}$ 时，$y = ${fn}$ 怎样变化？`),
              options,
              correct: 2,
              solution: walked(
                [
                  [
                    ["Try large inputs", "代入很大的数"],
                    t(
                      `Put in $x = ${toPlus ? "" : "-"}1000$ and $x = ${toPlus ? "" : "-"}100{,}000$:`,
                      `代入 $x = ${toPlus ? "" : "-"}1000$ 和 $x = ${toPlus ? "" : "-"}100{,}000$：`,
                    ),
                    [
                      `\\frac{${k}}{${toPlus ? "" : "-"}1000} = ${num(Q.of(k, toPlus ? 1000 : -1000))}`,
                      `\\frac{${k}}{${toPlus ? "" : "-"}100{,}000} = ${num(Q.of(k, toPlus ? 100000 : -100000))}`,
                    ],
                  ],
                  [
                    ["Read the trend", "看出趋势"],
                    t(
                      `Dividing $${k}$ by numbers larger and larger in size gives quotients closer and closer to $0$:`,
                      `用 $${k}$ 除以绝对值越来越大的数，商越来越接近 $0$：`,
                    ),
                    ["y \\to 0"],
                  ],
                ],
                t(
                  `$\\frac{${k}}{x} = 0$ has no solution, because $${k} \\ne 0$. So the graph approaches the $x$-axis, its horizontal asymptote, without ever meeting it.`,
                  `$\\frac{${k}}{x} = 0$ 无解，因为 $${k} \\ne 0$。所以图象逐渐靠近水平渐近线 $x$ 轴，但永远不与它相交。`,
                ),
              ),
            }),
            [
              [
                options[0]!.en,
                `The values do not grow: dividing $${k}$ by numbers larger and larger in size makes the quotient smaller and smaller in size.`,
                `函数值并不增大：用 $${k}$ 除以绝对值越来越大的数，商的绝对值越来越小。`,
              ],
              [
                options[1]!.en,
                `The values do not grow: dividing $${k}$ by numbers larger and larger in size makes the quotient smaller and smaller in size.`,
                `函数值并不增大：用 $${k}$ 除以绝对值越来越大的数，商的绝对值越来越小。`,
              ],
              [
                options[3]!.en,
                `$y = ${k}$ only at $x = 1$. Far from the origin $\\frac{${k}}{x}$ is close to $0$, not to $${k}$.`,
                `只有 $x = 1$ 时 $y = ${k}$。远离原点时 $\\frac{${k}}{x}$ 接近 $0$，而不是 $${k}$。`,
              ],
            ],
          );
        }
        const right = kind === 1;
        const sign = right === k > 0 ? 1 : -1;
        const side = right ? "0^{+}" : "0^{-}";
        const [tiny, tinier] = right ? ["0.01", "0.001"] : ["-0.01", "-0.001"];
        const signWrong = t(
          `The sign is wrong: $${k}$ is ${k > 0 ? "positive" : "negative"} and $x$ is ${right ? "positive" : "negative"}, so the quotient is ${sign > 0 ? "positive" : "negative"}.`,
          `符号不对：$${k}$ 为${k > 0 ? "正" : "负"}，$x$ 为${right ? "正" : "负"}，所以商为${sign > 0 ? "正" : "负"}。`,
        );
        return reasoned(
          choiceProblem({
            prompt: t(`What happens to $y = ${fn}$ as $x \\to ${side}$?`, `当 $x \\to ${side}$ 时，$y = ${fn}$ 怎样变化？`),
            options,
            correct: sign > 0 ? 0 : 1,
            solution: walked(
              [
                [
                  ["Try inputs near 0", "代入接近 0 的数"],
                  t(
                    `Put in $x = ${tiny}$ and $x = ${tinier}$, just ${right ? "right" : "left"} of $0$:`,
                    `代入 $0$ ${right ? "右" : "左"}侧附近的 $x = ${tiny}$ 和 $x = ${tinier}$：`,
                  ),
                  [`\\frac{${k}}{${tiny}} = ${(right ? 100 : -100) * k}`, `\\frac{${k}}{${tinier}} = ${(right ? 1000 : -1000) * k}`],
                ],
                [
                  ["Read the trend", "看出趋势"],
                  t(
                    `Dividing by a tiny ${right ? "positive" : "negative"} number gives a ${sign > 0 ? "huge positive" : "huge negative"} number, and the closer $x$ is to $0$, the larger it is in size:`,
                    `除以很小的${right ? "正" : "负"}数得到${sign > 0 ? "很大的正数" : "绝对值很大的负数"}，$x$ 越接近 $0$，绝对值越大：`,
                  ),
                  [`y \\to ${sign > 0 ? "\\infty" : "-\\infty"}`],
                ],
              ],
              t(
                `The signs agree: $${k}$ is ${k > 0 ? "positive" : "negative"} and $x$ is ${right ? "positive" : "negative"}, so $\\frac{${k}}{x}$ is ${sign > 0 ? "positive" : "negative"}.`,
                `符号相符：$${k}$ 为${k > 0 ? "正" : "负"}，$x$ 为${right ? "正" : "负"}，所以 $\\frac{${k}}{x}$ 为${sign > 0 ? "正" : "负"}。`,
              ),
            ),
          }),
          [
            [options[0]!.en, signWrong.en, signWrong["zh-CN"]],
            [options[1]!.en, signWrong.en, signWrong["zh-CN"]],
            [
              options[2]!.en,
              "That is what happens as $x \\to \\pm\\infty$. Near $x = 0$ the divisor is tiny, so the quotient is huge in size.",
              "那是 $x \\to \\pm\\infty$ 时的情形。在 $x = 0$ 附近除数很小，所以商的绝对值很大。",
            ],
            [
              options[3]!.en,
              `$y = ${k}$ at $x = 1$, which is not near $0$. Dividing by a tiny number gives a number huge in size.`,
              `$x = 1$ 时 $y = ${k}$，而 $1$ 并不接近 $0$。除以很小的数，得到绝对值很大的数。`,
            ],
          ],
        );
      },
    },
    {
      id: "the-constant-from-a-graph",
      figure: algebraDrawings2["graphing-reciprocal-functions#the-constant-from-a-graph"],
      title: t("Finding k from a graph", "由图象求 k"),
      explanation: t(
        `Every point of the graph of $y = \\frac{k}{x}$ has $xy = k$, so one point read from the graph gives $k$: multiply its coordinates. Choose a point where the graph crosses grid lines, so both coordinates are exact.

If the graph passes through $(-2, 3)$, then

$$k = -2 \\cdot 3 = -6$$

and the function is $y = -\\frac{6}{x}$.

Check: at $x = -2$, $y = \\frac{-6}{-2} = 3$. The branches lie in quadrants II and IV, as they must when $k < 0$.

> **Watch out.** Multiply the coordinates; dividing or adding them does not give $k$. Keep the signs: a graph in quadrants II and IV has $k < 0$.`,
        `$y = \\frac{k}{x}$ 图象上的每个点都满足 $xy = k$，所以由图象读出一个点就能求出 $k$：把它的坐标相乘。选图象经过格点的地方，两个坐标都准确。

若图象经过 $(-2, 3)$，则

$$k = -2 \\cdot 3 = -6$$

函数是 $y = -\\frac{6}{x}$。

检验：$x = -2$ 时 $y = \\frac{-6}{-2} = 3$。两支位于第二、四象限，与 $k < 0$ 相符。

> **注意。** 坐标要相乘；相除或相加都得不到 $k$。注意符号：位于第二、四象限的图象 $k < 0$。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-4, 4);
          q = rng.nonZero(-4, 4);
        } while (Math.abs(p * q) < 2 || freePoints(p * q, 0, 0, [[p, q]]).length === 0);
        const k = p * q;
        return annotate(
          {
            ...numberProblem({
              prompt: t("The graph of $y = \\frac{k}{x}$ is shown. Find $k$.", "下图是 $y = \\frac{k}{x}$ 的图象。求 $k$。"),
              answer: k,
              solveFor: "k",
              wrong: [Q.of(p, q), Q.of(p + q), Q.of(-k)],
              solution: walked(
                [
                  [
                    ["Read a point", "读出一个点"],
                    t(`The marked point of the graph is $(${p}, ${q})$.`, `图象上标出的点是 $(${p}, ${q})$。`),
                  ],
                  [
                    ["Multiply its coordinates", "坐标相乘"],
                    t("Every point of the graph has $xy = k$:", "图象上的每个点都满足 $xy = k$："),
                    [`k = ${p} \\cdot ${pn(q)} = ${k}`],
                  ],
                ],
                t(
                  `$y = ${fracL(k, "x")}$ gives $y = \\frac{${k}}{${p}} = ${q}$ at $x = ${p}$, the marked point. Its branches lie in quadrants ${k > 0 ? "I and III, as they must for $k > 0$" : "II and IV, as they must for $k < 0$"}.`,
                  `$y = ${fracL(k, "x")}$ 在 $x = ${p}$ 时给出 $y = \\frac{${k}}{${p}} = ${q}$，正是标出的点。两支位于第${k > 0 ? "一、三象限，与 $k > 0$ 相符" : "二、四象限，与 $k < 0$ 相符"}。`,
                ),
              ),
            }),
            figure: recipFigure(k, 0, 0, [[p, q]]),
          },
          view,
          guides([p, q], at([p, q])),
          `The point ${at([p, q])} gives k = ${p} · ${q} = ${k}.`,
          `点 ${at([p, q])} 给出 k = ${p} · ${q} = ${k}。`,
        );
      },
    },
  ],
};

// 5.19.2 Graph transformations of reciprocal functions.

/** graphTransformationsOfReciprocalFunctions translates the graph of y = 1/x and moves its asymptotes. */
export const graphTransformationsOfReciprocalFunctions: TopicDef = {
  id: "graph-transformations-of-reciprocal-functions",
  title: t("Graph Transformations of Reciprocal Functions", "倒数函数图象的变换"),
  summary: t(
    "Translate the graph of $y = \\frac{1}{x}$: find the asymptotes of $y = \\frac{a}{x - h} + k$, write translated functions and match them with graphs.",
    "平移 $y = \\frac{1}{x}$ 的图象：求 $y = \\frac{a}{x - h} + k$ 的渐近线，写出平移后的函数，并与图象配对。",
  ),
  prerequisites: ["graphing-reciprocal-functions", "combining-graph-transformations-two-operations"],
  encompasses: [{ topic: "combining-graph-transformations-two-operations", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Moving a graph moves everything on it, the asymptotes included. Shifting $y = \\frac{1}{x}$ right $1$ unit and up $2$ units gives $y = \\frac{1}{x - 1} + 2$. The point $(1, 1)$ moves to $(2, 3)$, and the asymptotes $x = 0$ and $y = 0$ move to $x = 1$ and $y = 2$.

Check: $\\frac{1}{2 - 1} + 2 = 3$, so $(2, 3)$ is on the new graph.

In this lesson we find the asymptotes of $y = \\frac{a}{x - h} + k$, write the functions of translated graphs, and match graphs with functions.`,
    `移动图象会移动图象上的一切，渐近线也不例外。把 $y = \\frac{1}{x}$ 向右平移 $1$ 个单位、向上平移 $2$ 个单位，得到 $y = \\frac{1}{x - 1} + 2$。点 $(1, 1)$ 移到 $(2, 3)$，渐近线 $x = 0$ 和 $y = 0$ 移到 $x = 1$ 和 $y = 2$。

检验：$\\frac{1}{2 - 1} + 2 = 3$，所以 $(2, 3)$ 在新图象上。

这节课我们求 $y = \\frac{a}{x - h} + k$ 的渐近线，写出平移后图象对应的函数，并把图象与函数配对。`,
  ),
  knowledgePoints: [
    {
      id: "asymptotes-of-translated-reciprocals",
      figure: algebraDrawings2["graph-transformations-of-reciprocal-functions#asymptotes-of-translated-reciprocals"],
      title: t("The asymptotes move with the graph", "渐近线随图象移动"),
      explanation: t(
        `The graph of $y = \\frac{a}{x - h} + k$ is the graph of $y = \\frac{a}{x}$ shifted $h$ units right and $k$ units up, so its asymptotes move with it:

- the vertical asymptote is $x = h$, where the denominator is $0$;
- the horizontal asymptote is $y = k$, because far out the fraction is close to $0$, so $y$ is close to $k$.

For $y = \\frac{5}{x + 2} - 3$, the denominator is $0$ where

$$x + 2 = 0 \\implies x = -2$$

and the constant added is $-3$, so the asymptotes are $x = -2$ and $y = -3$. The numerator $a$ moves neither.

Check: at $x = 98$, $y = \\frac{5}{100} - 3 = -2.95$, close to $-3$; at $x = -2$ the denominator is $0$.

> **Watch out.** $x + 2 = x - (-2)$, so the vertical asymptote is $x = -2$, not $x = 2$. The number in the denominator gives the vertical asymptote and the number added outside gives the horizontal one; do not swap them. The numerator moves neither asymptote.`,
        `$y = \\frac{a}{x - h} + k$ 的图象是把 $y = \\frac{a}{x}$ 的图象向右平移 $h$ 个单位、向上平移 $k$ 个单位得到的，所以渐近线也随之移动：

- 竖直渐近线是 $x = h$，即分母为 $0$ 处；
- 水平渐近线是 $y = k$，因为远处分式接近 $0$，所以 $y$ 接近 $k$。

对 $y = \\frac{5}{x + 2} - 3$，分母为 $0$ 处是

$$x + 2 = 0 \\implies x = -2$$

加上的常数是 $-3$，所以渐近线是 $x = -2$ 和 $y = -3$。分子 $a$ 不会移动渐近线。

检验：$x = 98$ 时 $y = \\frac{5}{100} - 3 = -2.95$，接近 $-3$；$x = -2$ 时分母为 $0$。

> **注意。** $x + 2 = x - (-2)$，所以竖直渐近线是 $x = -2$，不是 $x = 2$。分母里的数给出竖直渐近线，外面加的数给出水平渐近线，不要对调。分子不移动任何一条渐近线。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const h = rng.nonZero(-9, 9);
        const k = rng.nonZero(-9, 9);
        const g = recipL(a, h, k);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`What is the vertical asymptote of the graph of $y = ${g}$?`, `$y = ${g}$ 的图象的竖直渐近线是什么？`),
            answer: h,
            solveFor: "x",
            wrong: [-h, k, a],
            solution: walked(
              [
                [
                  ["Find where the denominator is 0", "找分母为 0 处"],
                  t(
                    "The function is not defined where the denominator is $0$, and near there the values grow without bound:",
                    "分母为 $0$ 处函数无定义，在它附近函数值无界增长：",
                  ),
                  [`${shifted(h)} = 0`],
                ],
                [
                  ["Solve", "求解"],
                  t(`${h > 0 ? "Add" : "Subtract"} $${Math.abs(h)}$ on both sides:`, `两边${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$：`),
                  [`x = ${h}`],
                ],
              ],
              t(
                `At $x = ${h}$ the denominator is $${put(h, h)} = 0$, so $y = ${g}$ is not defined there.`,
                `$x = ${h}$ 时分母为 $${put(h, h)} = 0$，所以 $y = ${g}$ 在那里无定义。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(`What is the horizontal asymptote of the graph of $y = ${g}$?`, `$y = ${g}$ 的图象的水平渐近线是什么？`),
          answer: k,
          solveFor: "y",
          wrong: [-k, h, a, a + k],
          solution: walked(
            [
              [
                ["Look far out", "看远处"],
                t(
                  "As $x \\to \\pm\\infty$ the denominator grows in size, so the fraction approaches $0$ but never equals it:",
                  "当 $x \\to \\pm\\infty$ 时分母的绝对值越来越大，所以分式趋近 $0$ 但永远不等于 $0$：",
                ),
                [`${fracL(a, shifted(h))} \\to 0`],
              ],
              [
                ["Add the constant", "加上常数"],
                t(`So $y$ approaches $${k}$, and the horizontal asymptote is`, `所以 $y$ 趋近 $${k}$，水平渐近线是`),
                [`y = ${k}`],
              ],
            ],
            t(
              `At $x = ${h + 100}$, $y = ${recipAt(a, h, k, h + 100)[0]} = ${fracL(a, "100")}${plus(k)}$, only $\\frac{${Math.abs(a)}}{100}$ away from $${k}$.`,
              `$x = ${h + 100}$ 时 $y = ${recipAt(a, h, k, h + 100)[0]} = ${fracL(a, "100")}${plus(k)}$，与 $${k}$ 只差 $\\frac{${Math.abs(a)}}{100}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "equations-of-translated-reciprocals",
      figure: algebraDrawings3["graph-transformations-of-reciprocal-functions#equations-of-translated-reciprocals"],
      title: t("Writing translated functions", "写出平移后的函数"),
      explanation: t(
        `Translate $f(x) = \\frac{a}{x}$ the same way as any graph. A shift $h$ units right replaces $x$ by $x - h$, because the new graph reaches at $x$ the value the old one had at $x - h$. A shift $k$ units up adds $k$ to every output. Shifting $f(x) = \\frac{2}{x}$ $4$ units left and $1$ unit up gives

$$g(x) = \\frac{2}{x + 4} + 1$$

Check: the point $(1, 2)$ of $f$ moves to $(-3, 3)$, and $g(-3) = \\frac{2}{1} + 1 = 3$. The asymptotes moved from $x = 0$ and $y = 0$ to $x = -4$ and $y = 1$.

> **Watch out.** A shift left uses $x + 4$, not $x - 4$. The vertical shift is added outside the fraction, not put in the denominator. The order of the two shifts does not change the result.`,
        `像平移任何图象一样平移 $f(x) = \\frac{a}{x}$。向右平移 $h$ 个单位就把 $x$ 换成 $x - h$，因为新图象在 $x$ 处取到旧图象在 $x - h$ 处的值。向上平移 $k$ 个单位就给每个输出加上 $k$。把 $f(x) = \\frac{2}{x}$ 向左平移 $4$ 个单位、向上平移 $1$ 个单位，得到

$$g(x) = \\frac{2}{x + 4} + 1$$

检验：$f$ 上的点 $(1, 2)$ 移到 $(-3, 3)$，而 $g(-3) = \\frac{2}{1} + 1 = 3$。渐近线从 $x = 0$、$y = 0$ 移到了 $x = -4$、$y = 1$。

> **注意。** 向左平移用 $x + 4$，不是 $x - 4$。竖直平移量加在分式外面，不放进分母。两次平移的先后不影响结果。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4, 5, 6, -1, -2, -3]);
        const h = rng.nonZero(-7, 7);
        const k = rng.nonZero(-7, 7);
        const ops = rng.bool() ? [shiftX(h), shiftY(k)] : [shiftY(k), shiftX(h)];
        const d = opsText(ops);
        const f = fracL(a, "x");
        const answer = recipL(a, h, k);
        const [gAt, gVal] = recipAt(a, h, k, 1 + h);
        return expressionProblem({
          prompt: t(
            `Start with the graph of $f(x) = ${f}$. ${d.en} Write the function $g$ of the new graph.`,
            `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}写出所得图象对应的函数 $g$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [recipL(a, -h, k), recipL(a, h, -k), recipL(a, k, h), recipL(a, -h, -k), `${f}${plus(h + k)}`],
          solution: walked(
            [
              [
                ["Shift horizontally", "水平平移"],
                t(
                  `Shifting ${h > 0 ? "right" : "left"} ${unitsEn(h)} replaces $x$ by $${shifted(h)}$:`,
                  `${h > 0 ? "向右" : "向左"}平移 $${Math.abs(h)}$ 个单位，把 $x$ 换成 $${shifted(h)}$：`,
                ),
                [`${f} \\to ${fracL(a, shifted(h))}`],
              ],
              [
                ["Shift vertically", "竖直平移"],
                t(
                  `Shifting ${k > 0 ? "up" : "down"} ${unitsEn(k)} adds $${k}$ to every output:`,
                  `${k > 0 ? "向上" : "向下"}平移 $${Math.abs(k)}$ 个单位，给每个输出加上 $${k}$：`,
                ),
                [`g(x) = ${answer}`],
              ],
            ],
            t(
              `The point $(1, ${a})$ of $f$ moves to $(${1 + h}, ${a + k})$, and $g(${1 + h}) = ${gAt} = ${num(gVal)}$.`,
              `$f$ 上的点 $(1, ${a})$ 移到 $(${1 + h}, ${a + k})$，而 $g(${1 + h}) = ${gAt} = ${num(gVal)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "translations-from-a-graph",
      figure: algebraDrawings2["graph-transformations-of-reciprocal-functions#translations-from-a-graph"],
      title: t("Matching graphs and functions", "图象与函数配对"),
      explanation: t(
        `To match a graph with a function $y = \\frac{1}{x - h} + k$, read the asymptotes. Where they cross, at $(h, k)$, is the center of the graph: the image of the origin, where the asymptotes of $y = \\frac{1}{x}$ cross. If the dashed asymptotes are $x = 3$ and $y = -2$, the center is $(3, -2)$ and the function is

$$y = \\frac{1}{x - 3} - 2$$

Check: $(4, -1)$, one unit right of and above the center, is the image of $(1, 1)$, and $\\frac{1}{4 - 3} - 2 = -1$.

> **Watch out.** The center $(3, -2)$ gives $x - 3$ in the denominator, with the sign changed. The vertical asymptote goes into the denominator and the horizontal one is added; do not swap them.`,
        `要把图象与函数 $y = \\frac{1}{x - h} + k$ 配对，先读出渐近线。它们的交点 $(h, k)$ 是图象的中心，即原点（$y = \\frac{1}{x}$ 两条渐近线的交点）平移后的位置。若虚线渐近线是 $x = 3$ 和 $y = -2$，中心是 $(3, -2)$，函数为

$$y = \\frac{1}{x - 3} - 2$$

检验：在中心右上方各一个单位的点 $(4, -1)$ 是 $(1, 1)$ 平移后的点，而 $\\frac{1}{4 - 3} - 2 = -1$。

> **注意。** 中心 $(3, -2)$ 在分母里给出 $x - 3$，符号相反。竖直渐近线进分母，水平渐近线加在外面，不要对调。`,
      ),
      generate(rng) {
        let h: number;
        let k: number;
        do {
          h = rng.int(-3, 3);
          k = rng.int(-3, 3);
        } while (h === 0 && k === 0);
        const y = (hh: number, kk: number) => m(`y = ${recipL(1, hh, kk)}`);
        const moves = [...(h !== 0 ? [shiftX(h)] : []), ...(k !== 0 ? [shiftY(k)] : [])];
        return annotate(
          {
            ...reasoned(
              oneOf(
                rng,
                t("Which function has the graph shown?", "哪个函数的图象如下图所示？"),
                y(h, k),
                [y(-h, k), y(h, -k), y(k, h), y(-h, -k), y(-k, -h)],
                walked(
                  [
                    [
                      ["Read the asymptotes", "读出渐近线"],
                      t(
                        `The asymptotes are $x = ${h}$ and $y = ${k}$, so the center of the graph, where they cross, is $(${h}, ${k})$.`,
                        `渐近线是 $x = ${h}$ 和 $y = ${k}$，所以它们的交点，即图象的中心，是 $(${h}, ${k})$。`,
                      ),
                    ],
                    [
                      ["Translate the basic graph", "平移基本图象"],
                      t(
                        `The graph is $y = \\frac{1}{x}$ with its center moved from the origin: ${moves.map((o) => o.en).join(" and ")}.`,
                        `图象是把 $y = \\frac{1}{x}$ 的中心从原点移过来：${moves.map((o) => o["zh-CN"]).join("，")}。`,
                      ),
                      [`y = ${recipL(1, h, k)}`],
                    ],
                  ],
                  t(
                    `The point $(1, 1)$ of $y = \\frac{1}{x}$ moves to $(${h + 1}, ${k + 1})$, and $${recipAt(1, h, k, h + 1)[0]} = ${k + 1}$.`,
                    `$y = \\frac{1}{x}$ 上的点 $(1, 1)$ 移到 $(${h + 1}, ${k + 1})$，而 $${recipAt(1, h, k, h + 1)[0]} = ${k + 1}$。`,
                  ),
                ),
              ),
              [
                [
                  y(-h, k).en,
                  `Its vertical asymptote is $x = ${-h}$, not $x = ${h}$: the sign of $h$ flips inside $x - h$.`,
                  `它的竖直渐近线是 $x = ${-h}$，不是 $x = ${h}$：$x - h$ 里 $h$ 要变号。`,
                ],
                [
                  y(h, -k).en,
                  `Its horizontal asymptote is $y = ${-k}$, not $y = ${k}$.`,
                  `它的水平渐近线是 $y = ${-k}$，不是 $y = ${k}$。`,
                ],
                [
                  y(k, h).en,
                  `This swaps the two asymptotes: its center is $(${k}, ${h})$.`,
                  `它把两条渐近线对调了：中心是 $(${k}, ${h})$。`,
                ],
                [
                  y(-h, -k).en,
                  `Its center is $(${-h}, ${-k})$, the reflection of the true center through the origin.`,
                  `它的中心是 $(${-h}, ${-k})$，是真正中心关于原点的对称点。`,
                ],
                [
                  y(-k, -h).en,
                  `Its center is $(${-k}, ${-h})$: the asymptotes are swapped and both signs are flipped.`,
                  `它的中心是 $(${-k}, ${-h})$：两条渐近线对调了，符号也都变了。`,
                ],
              ],
            ),
            figure: recipFigure(1, h, k, freePoints(1, h, k, latticePoints(1, h, k))),
          },
          view,
          shift([0, 0], [h, k]),
          `The center of the graph moves from the origin to ${at([h, k])}.`,
          `图象的中心从原点移到 ${at([h, k])}。`,
        );
      },
    },
  ],
  diagnostic: "equations-of-translated-reciprocals",
};

// 5.19.3 Combining graph transformations of reciprocal functions.

/** combiningGraphTransformationsOfReciprocalFunctions stretches, reflects and translates the graph of y = 1/x. */
export const combiningGraphTransformationsOfReciprocalFunctions: TopicDef = {
  id: "combining-graph-transformations-of-reciprocal-functions",
  title: t("Combining Graph Transformations of Reciprocal Functions", "倒数函数图象的复合变换"),
  summary: t(
    "Move points of $y = \\frac{1}{x}$ under $y = \\frac{a}{x - h} + k$, write functions from several transformations, and find the function of a graph.",
    "求 $y = \\frac{1}{x}$ 上的点在 $y = \\frac{a}{x - h} + k$ 下的位置，由多步变换写出函数，并求图象对应的函数。",
  ),
  prerequisites: ["graph-transformations-of-reciprocal-functions", "combining-reflections-with-other-graph-transformations"],
  encompasses: [
    { topic: "graph-transformations-of-reciprocal-functions", weight: 0.6 },
    { topic: "combining-reflections-with-other-graph-transformations", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Stretches and reflections combine with shifts. $y = -\\frac{2}{x + 1} + 3$ is $y = \\frac{1}{x}$ shifted left $1$ unit, with its outputs multiplied by $-2$ (a stretch by $2$ and a reflection in the $x$-axis), then shifted up $3$ units. Follow the point $(1, 1)$ through the three steps: $(1, 1) \\to (0, 1) \\to (0, -2) \\to (0, 1)$.

Check: $-\\frac{2}{0 + 1} + 3 = 1$, so $(0, 1)$ is on the graph.

In this lesson we move points of $y = \\frac{1}{x}$ under several transformations, write functions from a list of transformations, and find the function of a graph.`,
    `伸缩和翻折可以与平移组合。$y = -\\frac{2}{x + 1} + 3$ 是把 $y = \\frac{1}{x}$ 向左平移 $1$ 个单位，把输出乘以 $-2$（伸长为 $2$ 倍并关于 $x$ 轴翻折），再向上平移 $3$ 个单位。跟踪点 $(1, 1)$ 经过这三步：$(1, 1) \\to (0, 1) \\to (0, -2) \\to (0, 1)$。

检验：$-\\frac{2}{0 + 1} + 3 = 1$，所以 $(0, 1)$ 在图象上。

这节课我们求 $y = \\frac{1}{x}$ 上的点经过多步变换后的位置，由一串变换写出函数，并求图象对应的函数。`,
  ),
  knowledgePoints: [
    {
      id: "moving-points-of-the-reciprocal-graph",
      figure: algebraDrawings3["combining-graph-transformations-of-reciprocal-functions#moving-points-of-the-reciprocal-graph"],
      title: t("Moving points", "点的移动"),
      explanation: t(
        `$g(x) = \\frac{a}{x - h} + k$ is $a \\cdot f(x - h) + k$ for $f(x) = \\frac{1}{x}$: shift right $h$, multiply the outputs by $a$ (a stretch, with a reflection when $a < 0$), then shift up $k$. The shift changes only $x$ and the other two steps change only $y$, so the point $(x, y)$ of $f$ moves to $(x + h, ay + k)$.

For $g(x) = -\\frac{4}{x - 1} + 2$, the point $\\left(2, \\frac{1}{2}\\right)$ of $y = \\frac{1}{x}$ moves to

$$\\left(2 + 1, \\; -4 \\cdot \\frac{1}{2} + 2\\right) = (3, 0)$$

Check: $g(3) = -\\frac{4}{3 - 1} + 2 = 0$.

> **Watch out.** The $x - h$ in the formula moves points right by $h$: add $h$ to $x$, do not subtract it. Multiply $y$ by $a$ first and then add $k$; adding first gives $a(y + k)$. Do not forget the factor $a$, and do not multiply $x$ by it.`,
        `对 $f(x) = \\frac{1}{x}$，$g(x) = \\frac{a}{x - h} + k$ 就是 $a \\cdot f(x - h) + k$：向右平移 $h$，把输出乘以 $a$（伸缩，$a < 0$ 时还要翻折），再向上平移 $k$。平移只改变 $x$，另外两步只改变 $y$，所以 $f$ 上的点 $(x, y)$ 变到 $(x + h, ay + k)$。

对 $g(x) = -\\frac{4}{x - 1} + 2$，$y = \\frac{1}{x}$ 上的点 $\\left(2, \\frac{1}{2}\\right)$ 变到

$$\\left(2 + 1, \\; -4 \\cdot \\frac{1}{2} + 2\\right) = (3, 0)$$

检验：$g(3) = -\\frac{4}{3 - 1} + 2 = 0$。

> **注意。** 式子里的 $x - h$ 让点向右移 $h$：$x$ 要加上 $h$，不是减去。先把 $y$ 乘以 $a$ 再加 $k$；先加会得到 $a(y + k)$。不要漏掉因数 $a$，也不要拿它去乘 $x$。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -1, -2, -3, -4, -6]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-6, 6);
        const x0 = rng.pick([1, -1, 2, -2, 3, -3, 4]);
        const y0 = Q.of(1, x0);
        const g = recipL(a, h, k);
        const ay = y0.mul(Q.of(a));
        const [gAt, gVal] = recipAt(a, h, k, x0 + h);
        return pointProblem({
          prompt: t(
            `The point $${pt(x0, y0)}$ lies on the graph of $f(x) = \\frac{1}{x}$. To which point does it move on the graph of $g(x) = ${g}$?`,
            `点 $${pt(x0, y0)}$ 在 $f(x) = \\frac{1}{x}$ 的图象上。在 $g(x) = ${g}$ 的图象上，它变到哪个点？`,
          ),
          answer: [Q.of(x0 + h), ay.add(Q.of(k))],
          wrong: [
            [Q.of(x0 - h), ay.add(Q.of(k))],
            [Q.of(x0 + h), y0.add(Q.of(k)).mul(Q.of(a))],
            [Q.of(x0 + h), y0.add(Q.of(k))],
            [Q.of(x0 * a + h), y0.add(Q.of(k))],
          ],
          solution: walked(
            [
              [
                ["Read the parameters", "读出参数"],
                t(
                  `Here $a = ${a}$, $h = ${h}$ and $k = ${k}$, so the point $(x, y)$ of $f$ moves to $(x + h, ay + k)$.`,
                  `这里 $a = ${a}$，$h = ${h}$，$k = ${k}$，所以 $f$ 上的点 $(x, y)$ 变到 $(x + h, ay + k)$。`,
                ),
              ],
              [["Move the x-coordinate", "移动横坐标"], t("Add $h$:", "加上 $h$："), [`${x0}${plus(h)} = ${x0 + h}`]],
              [
                ["Move the y-coordinate", "移动纵坐标"],
                t("Multiply by $a$, then add $k$:", "乘以 $a$，再加上 $k$："),
                [`${a} \\cdot ${pq(y0)}${plus(k)} = ${num(ay.add(Q.of(k)))}`],
              ],
            ],
            t(
              `$g(${x0 + h}) = ${gAt} = ${num(gVal)}$, so $${pt(x0 + h, ay.add(Q.of(k)))}$ is on the graph of $g$.`,
              `$g(${x0 + h}) = ${gAt} = ${num(gVal)}$，所以 $${pt(x0 + h, ay.add(Q.of(k)))}$ 在 $g$ 的图象上。`,
            ),
          ),
        });
      },
    },
    {
      id: "functions-from-several-transformations",
      figure: algebraDrawings3["combining-graph-transformations-of-reciprocal-functions#functions-from-several-transformations"],
      title: t("Writing the function", "写出函数"),
      explanation: t(
        `Apply the transformations to $f(x) = \\frac{1}{x}$ in the order given. Multiplying the outputs by $a$ multiplies **everything** built so far, including any shift added before it, because every output is multiplied:

- shift right $2$, stretch by $3$, then shift down $1$: $\\frac{1}{x - 2} \\to \\frac{3}{x - 2} \\to \\frac{3}{x - 2} - 1$;
- shift right $2$, shift down $1$, then stretch by $3$: $\\frac{1}{x - 2} - 1 \\to 3\\left(\\frac{1}{x - 2} - 1\\right) = \\frac{3}{x - 2} - 3$.

A reflection in the $x$-axis multiplies by $-1$ in the same way.

Check the second with the point $(1, 1)$ of $f$: $(1, 1) \\to (3, 1) \\to (3, 0) \\to (3, 0)$, and $\\frac{3}{3 - 2} - 3 = 0$.

> **Watch out.** When the stretch comes after the vertical shift, the shift is multiplied too. A shift right still gives $x - h$. A reflection changes the sign of the numerator, and a stretch multiplies the numerator, not the $x$ in the denominator.`,
        `按给定的顺序对 $f(x) = \\frac{1}{x}$ 作变换。把输出乘以 $a$ 时，要乘以此前得到的**整个**式子，包括之前加上的平移量，因为每个输出都要乘：

- 向右平移 $2$，伸长为 $3$ 倍，再向下平移 $1$：$\\frac{1}{x - 2} \\to \\frac{3}{x - 2} \\to \\frac{3}{x - 2} - 1$；
- 向右平移 $2$，向下平移 $1$，再伸长为 $3$ 倍：$\\frac{1}{x - 2} - 1 \\to 3\\left(\\frac{1}{x - 2} - 1\\right) = \\frac{3}{x - 2} - 3$。

关于 $x$ 轴翻折同样是乘以 $-1$。

用 $f$ 上的点 $(1, 1)$ 检验第二种：$(1, 1) \\to (3, 1) \\to (3, 0) \\to (3, 0)$，而 $\\frac{3}{3 - 2} - 3 = 0$。

> **注意。** 伸缩在竖直平移之后时，平移量也要乘。向右平移仍然得到 $x - h$。翻折改变分子的符号，伸缩乘的是分子，而不是分母里的 $x$。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -1, -2, -3, -4]);
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-5, 5);
        const shiftFirst = rng.bool(0.4);
        const ops = shiftFirst ? [shiftX(h), shiftY(k), ...scaleY(a)] : [shiftX(h), ...scaleY(a), shiftY(k)];
        const kk = shiftFirst ? a * k : k;
        const answer = recipL(a, h, kk);
        const d = opsText(ops);
        const trace = shiftFirst
          ? `(1, 1) \\to (${1 + h}, 1) \\to (${1 + h}, ${1 + k}) \\to (${1 + h}, ${a * (1 + k)})`
          : `(1, 1) \\to (${1 + h}, 1) \\to (${1 + h}, ${a}) \\to (${1 + h}, ${a + k})`;
        const [gAt, gVal] = recipAt(a, h, kk, 1 + h);
        return expressionProblem({
          prompt: t(
            `Start with the graph of $f(x) = \\frac{1}{x}$. ${d.en} Write the function $g$ of the new graph.`,
            `从 $f(x) = \\frac{1}{x}$ 的图象开始，${d["zh-CN"]}写出所得图象对应的函数 $g$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [
            recipL(a, -h, kk),
            recipL(a, h, shiftFirst ? k : a * k),
            recipL(-a, h, kk),
            `\\frac{1}{${linear(a, -a * h)}}${plus(kk)}`,
            recipL(Math.abs(a), h, k),
          ],
          solution: walked(
            shiftFirst
              ? [
                  [
                    ["Shift", "平移"],
                    t(
                      `Shifting ${h > 0 ? "right" : "left"} replaces $x$ by $${shifted(h)}$, and shifting ${k > 0 ? "up" : "down"} adds $${k}$:`,
                      `${h > 0 ? "向右" : "向左"}平移把 $x$ 换成 $${shifted(h)}$，${k > 0 ? "向上" : "向下"}平移加上 $${k}$：`,
                    ),
                    [`\\frac{1}{x} \\to ${recipL(1, h, 0)} \\to ${recipL(1, h, k)}`],
                  ],
                  [
                    ["Multiply the outputs", "乘以输出"],
                    t(
                      `Multiplying by $${a}$ multiplies the whole expression, the $${k}$ included:`,
                      `乘以 $${a}$ 要乘整个式子，连 $${k}$ 一起乘：`,
                    ),
                    [`${a === -1 ? "-" : a}\\left(${recipL(1, h, k)}\\right) = ${answer}`],
                  ],
                ]
              : [
                  [
                    ["Shift horizontally", "水平平移"],
                    t(
                      `Shifting ${h > 0 ? "right" : "left"} replaces $x$ by $${shifted(h)}$:`,
                      `${h > 0 ? "向右" : "向左"}平移把 $x$ 换成 $${shifted(h)}$：`,
                    ),
                    [`\\frac{1}{x} \\to ${recipL(1, h, 0)}`],
                  ],
                  [
                    ["Multiply the outputs", "乘以输出"],
                    t(`Multiplying the outputs by $${a}$ multiplies the numerator:`, `把输出乘以 $${a}$，就是把分子乘以 $${a}$：`),
                    [`${recipL(1, h, 0)} \\to ${recipL(a, h, 0)}`],
                  ],
                  [
                    ["Shift vertically", "竖直平移"],
                    t(`Shifting ${k > 0 ? "up" : "down"} adds $${k}$:`, `${k > 0 ? "向上" : "向下"}平移加上 $${k}$：`),
                    [`${recipL(a, h, 0)} \\to ${answer}`],
                  ],
                ],
            t(
              `Follow the point $(1, 1)$ of $f$ through the steps, $${trace}$. The formula agrees: $g(${1 + h}) = ${gAt} = ${num(gVal)}$.`,
              `跟踪 $f$ 上的点 $(1, 1)$ 经过各步：$${trace}$。解析式也给出 $g(${1 + h}) = ${gAt} = ${num(gVal)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "functions-from-graphs",
      figure: algebraDrawings2["combining-graph-transformations-of-reciprocal-functions#functions-from-graphs"],
      title: t("The function of a graph", "图象对应的函数"),
      explanation: t(
        `To write $y = \\frac{a}{x - h} + k$ for a graph, read the asymptotes $x = h$ and $y = k$, then find $a$ from one more point $(x, y)$ of the graph. Subtract $k$ and multiply by $x - h$:

$$y - k = \\frac{a}{x - h} \\implies a = (y - k)(x - h)$$

If the asymptotes are $x = -1$ and $y = 2$ and the graph passes through $\\left(1, \\frac{1}{2}\\right)$, then $a = \\left(\\frac{1}{2} - 2\\right)(1 + 1) = -3$, and the function is

$$y = -\\frac{3}{x + 1} + 2$$

Check: at $x = 1$, $-\\frac{3}{2} + 2 = \\frac{1}{2}$, the point on the graph.

> **Watch out.** The sign of $h$ flips inside $x - h$. Find $a$ from $y - k$, not from $y$ alone. A graph in the upper left and lower right of its center has $a < 0$.`,
        `要写出图象的函数 $y = \\frac{a}{x - h} + k$，先读出渐近线 $x = h$ 和 $y = k$，再用图象上另一个点 $(x, y)$ 求 $a$。两边减去 $k$ 再乘以 $x - h$：

$$y - k = \\frac{a}{x - h} \\implies a = (y - k)(x - h)$$

若渐近线是 $x = -1$ 和 $y = 2$，且图象经过 $\\left(1, \\frac{1}{2}\\right)$，则 $a = \\left(\\frac{1}{2} - 2\\right)(1 + 1) = -3$，函数为

$$y = -\\frac{3}{x + 1} + 2$$

检验：$x = 1$ 时 $-\\frac{3}{2} + 2 = \\frac{1}{2}$，正是图象上的点。

> **注意。** $x - h$ 里 $h$ 要变号。用 $y - k$ 求 $a$，不能只用 $y$。图象在中心的左上方和右下方时 $a < 0$。`,
      ),
      generate(rng) {
        for (;;) {
          const a = rng.pick([1, 2, 3, 4, 6, -1, -2, -3, -4, -6]);
          const h = rng.int(-3, 3);
          const k = rng.int(-3, 3);
          const free = freePoints(a, h, k, latticePoints(a, h, k));
          if (free.length === 0) continue;
          const [x0, y0] = rng.pick(free);
          const other = free.filter(([x]) => x > h !== x0 > h);
          const shown: Point[] = other.length ? [[x0, y0], rng.pick(other)] : [[x0, y0]];
          const answer = recipL(a, h, k);
          const sub = (v: number) => (v < 0 ? `(${v})` : String(v));
          const second = shown[1];
          const x1 = second ? second[0] : x0;
          const [fAt, fVal] = recipAt(a, h, k, x1);
          return annotate(
            {
              ...expressionProblem({
                prompt: t(
                  "The graph of $f(x) = \\frac{a}{x - h} + k$ is shown. Find $f(x)$.",
                  "下图是 $f(x) = \\frac{a}{x - h} + k$ 的图象。求 $f(x)$。",
                ),
                answer,
                prefix: "f(x) =",
                wrong: [recipL(a, -h, k), recipL(a, h, -k), recipL(-a, h, k), recipL(y0, h, k), recipL(a, k, h)],
                solution: walked(
                  [
                    [
                      ["Read the asymptotes", "读出渐近线"],
                      t(
                        `The asymptotes are $x = ${h}$ and $y = ${k}$, so $h = ${h}$ and $k = ${k}$.`,
                        `渐近线是 $x = ${h}$ 和 $y = ${k}$，所以 $h = ${h}$，$k = ${k}$。`,
                      ),
                    ],
                    [
                      ["Find the numerator", "求分子"],
                      t(
                        `The graph passes through $(${x0}, ${y0})$. Put it in and solve for $a$:`,
                        `图象经过 $(${x0}, ${y0})$。代入并解出 $a$：`,
                      ),
                      [`${y0} = \\frac{a}{${x0} - ${sub(h)}} + ${sub(k)}`, `a = (${y0} - ${sub(k)})(${x0} - ${sub(h)}) = ${a}`],
                    ],
                    [["Write the function", "写出函数"], t("Put the three numbers into the form:", "把三个数代入："), [`f(x) = ${answer}`]],
                  ],
                  t(
                    `$f(${x1}) = ${fAt} = ${num(fVal)}$, the ${second ? "other " : ""}marked point $(${x1}, ${num(fVal)})$ of the graph.`,
                    `$f(${x1}) = ${fAt} = ${num(fVal)}$，正是图象上标出的${second ? "另一个" : ""}点 $(${x1}, ${num(fVal)})$。`,
                  ),
                ),
              }),
              figure: recipFigure(a, h, k, shown),
            },
            view,
            [...shift([0, 0], [h, k]), { kind: "point", at: [x0, y0], tone: "result" }],
            `The center is ${at([h, k])}, and the point ${at([x0, y0])} gives a = ${a}.`,
            `中心是 ${at([h, k])}，点 ${at([x0, y0])} 给出 a = ${a}。`,
          );
        }
      },
    },
  ],
  diagnostic: "functions-from-graphs",
};

// 5.19.4 Domain and range of transformed reciprocal functions.

/** domainAndRangeOfTransformedReciprocalFunctions finds the domains and ranges of a/(bx + c) + k and related functions. */
export const domainAndRangeOfTransformedReciprocalFunctions: TopicDef = {
  id: "domain-and-range-of-transformed-reciprocal-functions",
  title: t("Domain and Range of Transformed Reciprocal Functions", "变换后倒数函数的定义域与值域"),
  summary: t(
    "Find the domain and range of $f(x) = \\frac{a}{bx + c} + k$ from its asymptotes, of $\\frac{px + q}{x - h}$ by splitting it, and on a restricted domain.",
    "由渐近线求 $f(x) = \\frac{a}{bx + c} + k$ 的定义域与值域，拆分后求 $\\frac{px + q}{x - h}$ 的值域，以及在限定定义域上的值域。",
  ),
  prerequisites: [
    "combining-graph-transformations-of-reciprocal-functions",
    "the-domain-and-range-of-transformed-functions",
    "splitting-rational-expressions-into-terms",
  ],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.C.7.D"],
  intro: t(
    `A reciprocal function misses one input and one output. For $f(x) = \\frac{2}{x - 4} + 1$, the input $4$ makes the denominator $0$, and the output $1$ would need $\\frac{2}{x - 4} = 0$, which never happens. So the domain is all real numbers except $4$, and the range is all real numbers except $1$. These are the two asymptotes.

Check: every other output is reached. For $3$, solve $\\frac{2}{x - 4} = 2$, so $x - 4 = 1$ and $x = 5$; indeed $f(5) = \\frac{2}{1} + 1 = 3$.

In this lesson we find the domain and range of $f(x) = \\frac{a}{bx + c} + k$, the range of a quotient of linear expressions, and the range on an interval.`,
    `倒数函数缺一个输入，也缺一个输出。对 $f(x) = \\frac{2}{x - 4} + 1$，输入 $4$ 使分母为 $0$；输出 $1$ 需要 $\\frac{2}{x - 4} = 0$，这永远不会发生。所以定义域是除 $4$ 以外的全体实数，值域是除 $1$ 以外的全体实数。这正是两条渐近线。

检验：其他输出都能取到。要得到 $3$，解 $\\frac{2}{x - 4} = 2$，得 $x - 4 = 1$，$x = 5$；确实 $f(5) = \\frac{2}{1} + 1 = 3$。

这节课我们求 $f(x) = \\frac{a}{bx + c} + k$ 的定义域与值域、一次式之商的值域，以及区间上的值域。`,
  ),
  knowledgePoints: [
    {
      id: "the-domain-of-a-transformed-reciprocal",
      figure: algebraDrawings3["domain-and-range-of-transformed-reciprocal-functions#the-domain-of-a-transformed-reciprocal"],
      title: t("The domain", "定义域"),
      explanation: t(
        `$f(x) = \\frac{a}{bx + c} + k$ is defined for every $x$ except where the denominator is $0$, because division by $0$ is not defined; that $x$ is the vertical asymptote. For $f(x) = \\frac{3}{2x - 5} + 1$, set the denominator to $0$ and solve:

$$2x - 5 = 0 \\implies x = \\frac{5}{2}$$

So the domain is all real numbers except $\\frac{5}{2}$, that is $\\left(-\\infty, \\frac{5}{2}\\right) \\cup \\left(\\frac{5}{2}, \\infty\\right)$.

Check: $2 \\cdot \\frac{5}{2} - 5 = 0$, while at $x = 3$ the denominator is $1$ and $f(3) = 4$.

> **Watch out.** Solve $bx + c = 0$ all the way: $x = \\frac{5}{2}$, not $-\\frac{5}{2}$ or $5$. The constant $k$ limits the range, not the domain. And one number is missing, so the domain is not all real numbers.`,
        `$f(x) = \\frac{a}{bx + c} + k$ 对除分母为 $0$ 处以外的每个 $x$ 都有定义，因为除以 $0$ 无意义；这个 $x$ 就是竖直渐近线。对 $f(x) = \\frac{3}{2x - 5} + 1$，令分母为 $0$ 并求解：

$$2x - 5 = 0 \\implies x = \\frac{5}{2}$$

所以定义域是除 $\\frac{5}{2}$ 以外的全体实数，即 $\\left(-\\infty, \\frac{5}{2}\\right) \\cup \\left(\\frac{5}{2}, \\infty\\right)$。

检验：$2 \\cdot \\frac{5}{2} - 5 = 0$；而 $x = 3$ 时分母为 $1$，$f(3) = 4$。

> **注意。** 要把 $bx + c = 0$ 解完：$x = \\frac{5}{2}$，不是 $-\\frac{5}{2}$ 或 $5$。常数 $k$ 限制的是值域，不是定义域。缺了一个数，所以定义域不是全体实数。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 2, 3, 4, -1, -2]);
        const c = rng.nonZero(-9, 9);
        const k = rng.int(-6, 6);
        const p = Q.of(-c, b);
        const f = linRecipL(a, b, c, k);
        const answer = allBut(p);
        return intervalProblem({
          prompt: t(`Find the domain of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的定义域，用区间记号表示。`),
          set: answer,
          form: "interval",
          wrong: [allBut(p.neg()), allBut(Q.of(-c)), allBut(k), realLine, union(iv(p, undefined, false))],
          solution: walked(
            [
              [
                ["Set the denominator to 0", "令分母为 0"],
                t("The function is defined everywhere except where the denominator is $0$:", "函数除分母为 $0$ 处外处处有定义："),
                [`${linear(b, c)} = 0`],
              ],
              [
                ["Solve", "求解"],
                t("Solve for $x$:", "解出 $x$："),
                b === 1 ? [`x = ${num(p)}`] : [`${linear(b, 0)} = ${-c}`, `x = ${num(p)}`],
              ],
              [
                ["Write the domain", "写出定义域"],
                t(
                  `Every real number except $${num(p)}$ is allowed, so the domain is ${setText(answer)}.`,
                  `除 $${num(p)}$ 以外的实数都可以，所以定义域是 ${setText(answer)}。`,
                ),
              ],
            ],
            t(
              `At $x = ${num(p)}$ the denominator is $${b === 1 ? "" : b === -1 ? "-" : `${b} \\cdot `}${pq(p)}${plus(c)} = 0$, so $f\\left(${num(p)}\\right)$ is not defined.`,
              `$x = ${num(p)}$ 时分母为 $${b === 1 ? "" : b === -1 ? "-" : `${b} \\cdot `}${pq(p)}${plus(c)} = 0$，所以 $f\\left(${num(p)}\\right)$ 无定义。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-range-of-a-transformed-reciprocal",
      figure: algebraDrawings3["domain-and-range-of-transformed-reciprocal-functions#the-range-of-a-transformed-reciprocal"],
      title: t("The range", "值域"),
      explanation: t(
        `The fraction $\\frac{a}{bx + c}$ is never $0$, because its numerator $a$ is not $0$. Every other value $v$ is reached: solve $bx + c = \\frac{a}{v}$. So $f(x) = \\frac{a}{bx + c} + k$ takes every value except $k$, the horizontal asymptote.

For $f(x) = -\\frac{2}{x + 6} - 4$, the range is all real numbers except $-4$:

$$(-\\infty, -4) \\cup (-4, \\infty)$$

Check: to reach $-2$, solve $-\\frac{2}{x + 6} = 2$, so $x + 6 = -1$ and $x = -7$; indeed $f(-7) = 2 - 4 = -2$. But $-4$ would need $-\\frac{2}{x + 6} = 0$, which has no solution.

> **Watch out.** The value missing from the range is the horizontal asymptote $k$; the vertical asymptote is missing from the domain. Keep the sign of $k$. Neither $a$, $b$ nor $c$ changes the range.`,
        `分式 $\\frac{a}{bx + c}$ 永远不为 $0$，因为分子 $a$ 不为 $0$。其他每个值 $v$ 都能取到：解 $bx + c = \\frac{a}{v}$ 即可。所以 $f(x) = \\frac{a}{bx + c} + k$ 能取到除 $k$（水平渐近线）以外的每个值。

对 $f(x) = -\\frac{2}{x + 6} - 4$，值域是除 $-4$ 以外的全体实数：

$$(-\\infty, -4) \\cup (-4, \\infty)$$

检验：要得到 $-2$，解 $-\\frac{2}{x + 6} = 2$，得 $x + 6 = -1$，$x = -7$；确实 $f(-7) = 2 - 4 = -2$。而 $-4$ 需要 $-\\frac{2}{x + 6} = 0$，无解。

> **注意。** 值域缺的是水平渐近线 $k$；竖直渐近线是定义域缺的数。注意 $k$ 的符号。$a$、$b$、$c$ 都不改变值域。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 1, 2, 3, -1, -2]);
        const c = rng.nonZero(-9, 9);
        const k = rng.nonZero(-9, 9);
        const f = linRecipL(a, b, c, k);
        const x1 = Q.of(1 - c, b);
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
          set: allBut(k),
          form: "interval",
          wrong: [allBut(Q.of(-c, b)), allBut(-k), allBut(a), allBut(a + k), realLine],
          solution: walked(
            [
              [
                ["The fraction", "分式"],
                t(
                  `The numerator of $${fracL(a, linear(b, c))}$ is $${a} \\ne 0$, so the fraction is never $0$. Any other value $v$ is reached: solve $${linear(b, c)} = \\frac{${a}}{v}$.`,
                  `$${fracL(a, linear(b, c))}$ 的分子 $${a} \\ne 0$，所以分式永远不为 $0$。其他任何值 $v$ 都能取到：解 $${linear(b, c)} = \\frac{${a}}{v}$ 即可。`,
                ),
              ],
              [
                ["Add the constant", "加上常数"],
                t(
                  `Adding $${k}$ moves the missing value from $0$ to $${k}$, the horizontal asymptote. The range is ${setText(allBut(k))}.`,
                  `加上 $${k}$ 后，缺的值从 $0$ 变成水平渐近线 $${k}$。值域是 ${setText(allBut(k))}。`,
                ),
              ],
            ],
            t(
              `At $x = ${num(x1)}$ the denominator is $1$, so $f(x) = ${a}${plus(k)} = ${a + k}$ is reached. But $f(x) = ${k}$ would need $${fracL(a, linear(b, c))} = 0$, which has no solution.`,
              `$x = ${num(x1)}$ 时分母为 $1$，所以能取到 $f(x) = ${a}${plus(k)} = ${a + k}$。而 $f(x) = ${k}$ 需要 $${fracL(a, linear(b, c))} = 0$，无解。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-range-of-a-quotient-of-linear-expressions",
      figure: algebraDrawings3["domain-and-range-of-transformed-reciprocal-functions#the-range-of-a-quotient-of-linear-expressions"],
      title: t("Quotients of linear expressions", "一次式之商"),
      explanation: t(
        `To find the range of $f(x) = \\frac{px + q}{x - h}$, split it into a constant plus a reciprocal function, whose range we know. Write the numerator as a multiple of the denominator plus a remainder:

$$\\frac{2x + 1}{x - 3} = \\frac{2(x - 3) + 7}{x - 3} = 2 + \\frac{7}{x - 3}$$

Now it is $\\frac{7}{x - 3}$ shifted up $2$, so the horizontal asymptote is $y = 2$ and the range is $(-\\infty, 2) \\cup (2, \\infty)$.

Check: at $x = 4$, $\\frac{2 \\cdot 4 + 1}{4 - 3} = 9$ and $2 + \\frac{7}{1} = 9$, so the split is right.

> **Watch out.** The missing value is the coefficient of $x$ in the numerator, $2$, not the $3$ missing from the domain and not the constant $1$. Keep its sign.`,
        `要求 $f(x) = \\frac{px + q}{x - h}$ 的值域，先把它拆成常数加倒数函数，倒数函数的值域我们已经知道。把分子写成分母的倍数加余数：

$$\\frac{2x + 1}{x - 3} = \\frac{2(x - 3) + 7}{x - 3} = 2 + \\frac{7}{x - 3}$$

它就是把 $\\frac{7}{x - 3}$ 向上平移 $2$，所以水平渐近线是 $y = 2$，值域是 $(-\\infty, 2) \\cup (2, \\infty)$。

检验：$x = 4$ 时 $\\frac{2 \\cdot 4 + 1}{4 - 3} = 9$，$2 + \\frac{7}{1} = 9$，拆分正确。

> **注意。** 缺的值是分子中 $x$ 的系数 $2$，不是定义域缺的 $3$，也不是常数 $1$。注意它的符号。`,
      ),
      keyPrerequisites: ["splitting-rational-expressions-into-terms"],
      generate(rng) {
        const p = rng.nonZero(-6, 6);
        const h = rng.nonZero(-7, 7);
        let q = rng.nonZero(-9, 9);
        if (q + p * h === 0) q += 1;
        const r = q + p * h;
        const f = `\\frac{${linear(p, q)}}{${shifted(h)}}`;
        const [atTop, atVal] = [p * (h + 1) + q, p + r];
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
          set: allBut(p),
          form: "interval",
          wrong: [allBut(h), allBut(q), allBut(-p), allBut(r), realLine],
          solution: walked(
            [
              [
                ["Split the numerator", "拆分子"],
                t(`Write the numerator as $${p}$ times the denominator plus a remainder:`, `把分子写成分母的 $${p}$ 倍加余数：`),
                [`${linear(p, q)} = ${p}(${shifted(h)})${plus(r)}`],
              ],
              [
                ["Split the fraction", "拆分式"],
                t("Divide each part by the denominator:", "每部分都除以分母："),
                [`\\frac{${linear(p, q)}}{${shifted(h)}} = ${fracL(r, shifted(h))}${plus(p)}`],
              ],
              [
                ["Read the range", "读出值域"],
                t(
                  `The fraction takes every value except $0$, so $f$ takes every value except $${p}$. The range is ${setText(allBut(p))}.`,
                  `分式能取到除 $0$ 以外的每个值，所以 $f$ 能取到除 $${p}$ 以外的每个值。值域是 ${setText(allBut(p))}。`,
                ),
              ],
            ],
            t(
              `Substitute $x = ${h + 1}$. The original gives $\\frac{${atTop}}{1} = ${atVal}$, and the split form gives $${fracL(r, "1")}${plus(p)} = ${atVal}$. The values agree.`,
              `代入 $x = ${h + 1}$。原式得 $\\frac{${atTop}}{1} = ${atVal}$，拆分后的式子得 $${fracL(r, "1")}${plus(p)} = ${atVal}$。两者相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-range-on-a-restricted-domain",
      figure: algebraDrawings3["domain-and-range-of-transformed-reciprocal-functions#the-range-on-a-restricted-domain"],
      title: t("The range on an interval", "区间上的值域"),
      explanation: t(
        `On an interval that does not contain the vertical asymptote, $f(x) = \\frac{a}{x - h} + k$ lies on a single branch, which only rises or only falls. So its least and greatest values are at the ends of the interval, and every value between them is reached.

For $f(x) = \\frac{6}{x - 1} + 2$ on $3 \\le x \\le 7$:

$$f(3) = \\frac{6}{2} + 2 = 5, \\quad f(7) = \\frac{6}{6} + 2 = 3$$

so the range is $[3, 5]$.

Check: a point inside, $f(4) = \\frac{6}{3} + 2 = 4$, lies between $3$ and $5$.

> **Watch out.** The ends are included, so the brackets are closed. The asymptote $y = 2$ is not reached on this interval, so it is not an end of the range. Shift before dividing: $f(3) = \\frac{6}{3 - 1} + 2$, not $\\frac{6}{3} + 2$.`,
        `在不包含竖直渐近线的区间上，$f(x) = \\frac{a}{x - h} + k$ 只在一支上，这一支只升或只降。所以它的最小值和最大值在区间的两端取到，两者之间的每个值也都能取到。

对 $3 \\le x \\le 7$ 上的 $f(x) = \\frac{6}{x - 1} + 2$：

$$f(3) = \\frac{6}{2} + 2 = 5, \\quad f(7) = \\frac{6}{6} + 2 = 3$$

所以值域是 $[3, 5]$。

检验：区间内的一点 $f(4) = \\frac{6}{3} + 2 = 4$，在 $3$ 和 $5$ 之间。

> **注意。** 两端都取到，所以用闭区间。在这个区间上取不到渐近线 $y = 2$，它不是值域的端点。先平移再相除：$f(3) = \\frac{6}{3 - 1} + 2$，不是 $\\frac{6}{3} + 2$。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-12, 12);
        const h = rng.int(-4, 4);
        const k = rng.int(-5, 5);
        const right = rng.bool();
        const near = rng.int(1, 4);
        const far = near + rng.int(1, 5);
        const [lo, hi] = right ? [h + near, h + far] : [h - far, h - near];
        const at = (x: number) => Q.of(a, x - h).add(Q.of(k));
        const [u, v] = [at(lo), at(hi)];
        const [min, max] = u.cmp(v) <= 0 ? [u, v] : [v, u];
        const answer = union(iv(min, max));
        const f = recipL(a, h, k);
        const noShift = (x: number) => (x === 0 ? undefined : Q.of(a, x).add(Q.of(k)));
        const [s, w] = [noShift(lo), noShift(hi)];
        const wrong: RealSet[] = [
          union(iv(min, max, false, false)),
          allBut(k),
          union(max.cmp(Q.of(k)) > 0 ? iv(Q.of(k), max) : iv(min, Q.of(k))),
        ];
        if (s && w) wrong.push(union(iv(s.cmp(w) <= 0 ? s : w, s.cmp(w) <= 0 ? w : s)));
        const inside = hi - lo >= 2 ? Q.of(lo + 1) : Q.of(lo + hi, 2);
        const [insideAt, insideVal] = recipAt(a, h, k, inside);
        const [loAt] = recipAt(a, h, k, lo);
        const [hiAt] = recipAt(a, h, k, hi);
        return intervalProblem({
          prompt: t(
            `Find the range of $f(x) = ${f}$ for $${lo} \\le x \\le ${hi}$. Write it in interval notation.`,
            `求 $f(x) = ${f}$ 在 $${lo} \\le x \\le ${hi}$ 上的值域，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong,
          solution: walked(
            [
              [
                ["Check the asymptote", "看渐近线"],
                t(
                  `The vertical asymptote $x = ${h}$ lies ${right ? "left" : "right"} of the interval, so there $f$ stays on one branch, which is ${u.cmp(v) < 0 ? "increasing" : "decreasing"}.`,
                  `竖直渐近线 $x = ${h}$ 在区间${right ? "左" : "右"}侧，所以 $f$ 在区间上只在一支上，这一支${u.cmp(v) < 0 ? "递增" : "递减"}。`,
                ),
              ],
              [
                ["Evaluate at the ends", "求端点处的值"],
                t("The least and greatest values are at the ends:", "最小值和最大值在两端取到："),
                [`f(${lo}) = ${loAt} = ${num(u)}`, `f(${hi}) = ${hiAt} = ${num(v)}`],
              ],
              [
                ["Write the range", "写出值域"],
                t(`Both ends are included, so the range is ${setText(answer)}.`, `两端都取到，所以值域是 ${setText(answer)}。`),
              ],
            ],
            t(
              `A point inside, $f\\left(${num(inside)}\\right) = ${insideAt} = ${num(insideVal)}$, lies between $${num(min)}$ and $${num(max)}$.`,
              `区间内的一点 $f\\left(${num(inside)}\\right) = ${insideAt} = ${num(insideVal)}$，在 $${num(min)}$ 和 $${num(max)}$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

// 5.19.5 Inverses of reciprocal functions.

/** inversesOfReciprocalFunctions finds, evaluates and describes the inverses of a/(bx + c) + k. */
export const inversesOfReciprocalFunctions: TopicDef = {
  id: "inverses-of-reciprocal-functions",
  title: t("Inverses of Reciprocal Functions", "倒数函数的反函数"),
  summary: t(
    "Find and evaluate the inverse of $f(x) = \\frac{a}{bx + c} + k$, give its domain and range, and find reciprocal functions that are their own inverses.",
    "求 $f(x) = \\frac{a}{bx + c} + k$ 的反函数及其值，给出反函数的定义域与值域，并找出以自身为反函数的倒数函数。",
  ),
  prerequisites: ["domain-and-range-of-transformed-reciprocal-functions", "calculating-the-inverse-of-a-function"],
  encompasses: [{ topic: "calculating-the-inverse-of-a-function", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.A"],
  intro: t(
    `Undoing a reciprocal function gives another reciprocal function. $f(x) = \\frac{3}{x} + 1$ divides $3$ by the input and adds $1$. To undo it, subtract $1$ and divide $3$ by the result, so $f^{-1}(x) = \\frac{3}{x - 1}$.

Check: $f(3) = \\frac{3}{3} + 1 = 2$, and $f^{-1}(2) = \\frac{3}{2 - 1} = 3$, back to the start.

In this lesson we find and evaluate the inverse of a reciprocal function, give its domain and range, and find reciprocal functions that are their own inverses.`,
    `倒数函数的反函数还是倒数函数。$f(x) = \\frac{3}{x} + 1$ 用 $3$ 除以输入再加 $1$。要把它撤销，就先减去 $1$，再用 $3$ 除以结果，所以 $f^{-1}(x) = \\frac{3}{x - 1}$。

检验：$f(3) = \\frac{3}{3} + 1 = 2$，而 $f^{-1}(2) = \\frac{3}{2 - 1} = 3$，回到了起点。

这节课我们求倒数函数的反函数及其值，给出反函数的定义域与值域，并找出以自身为反函数的倒数函数。`,
  ),
  knowledgePoints: [
    {
      id: "inverse-formulas",
      figure: algebraDrawings3["inverses-of-reciprocal-functions#inverse-formulas"],
      title: t("The inverse formula", "反函数的解析式"),
      explanation: t(
        `The inverse sends outputs back to inputs, so swap $x$ and $y$; then isolate the fraction, take reciprocals, and solve for $y$. For $f(x) = \\frac{6}{2x + 1} - 3$:

$$x = \\frac{6}{2y + 1} - 3, \\quad x + 3 = \\frac{6}{2y + 1}, \\quad 2y + 1 = \\frac{6}{x + 3}, \\quad y = \\frac{6}{2(x + 3)} - \\frac{1}{2}$$

so $f^{-1}(x) = \\frac{3}{x + 3} - \\frac{1}{2}$. The inverse is again a reciprocal function: its vertical asymptote $x = -3$ is the horizontal asymptote of $f$, and the other way round.

Check: $f(0) = \\frac{6}{1} - 3 = 3$, and $f^{-1}(3) = \\frac{3}{6} - \\frac{1}{2} = 0$.

> **Watch out.** Move the $-3$ with its sign changed: $x + 3$, not $x - 3$. Subtract the $1$ before dividing by $2$, so the constant is $-\\frac{1}{2}$. Swapping alone is not enough: the answer must be solved for $y$.`,
        `反函数把输出送回输入，所以先交换 $x$ 与 $y$，再把分式单独留在一边，两边取倒数，最后解出 $y$。对 $f(x) = \\frac{6}{2x + 1} - 3$：

$$x = \\frac{6}{2y + 1} - 3, \\quad x + 3 = \\frac{6}{2y + 1}, \\quad 2y + 1 = \\frac{6}{x + 3}, \\quad y = \\frac{6}{2(x + 3)} - \\frac{1}{2}$$

所以 $f^{-1}(x) = \\frac{3}{x + 3} - \\frac{1}{2}$。反函数仍是倒数函数：它的竖直渐近线 $x = -3$ 是 $f$ 的水平渐近线，反之亦然。

检验：$f(0) = \\frac{6}{1} - 3 = 3$，而 $f^{-1}(3) = \\frac{3}{6} - \\frac{1}{2} = 0$。

> **注意。** 移项时 $-3$ 要变号：得 $x + 3$，不是 $x - 3$。先减去 $1$ 再除以 $2$，所以常数是 $-\\frac{1}{2}$。只交换不够，还要解出 $y$。`,
      ),
      keyPrerequisites: ["calculating-the-inverse-of-a-function"],
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([2, 3, 4, -1, -2, -3]);
        const c = rng.nonZero(-9, 9);
        const k = rng.nonZero(-7, 7);
        const f = linRecipL(a, b, c, k);
        const shift = Q.of(-c, b);
        // a / (b(x - k)) in lowest terms, with a positive coefficient of x.
        const g = gcd(Math.abs(a), Math.abs(b)) * Math.sign(b);
        const [ra, rb] = [a / g, b / g];
        const answer = `${fracL(ra, linear(rb, -rb * k))}${plus(shift)}`;
        const x1 = tryX.find((x) => b * x + c !== 0) ?? 2;
        const fx1 = Q.of(a, b * x1 + c).add(Q.of(k));
        const back = Q.of(ra)
          .div(Q.of(rb).mul(fx1.sub(Q.of(k))))
          .add(shift);
        return expressionProblem({
          prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [
            f,
            `${fracL(ra, linear(rb, -rb * k))}${plus(shift.neg())}`,
            `${fracL(a, linear(1, -k))}${plus(-c)}`,
            `${fracL(ra, linear(rb, rb * k))}${plus(shift)}`,
            `${fracL(a, linear(b, -k))}${plus(shift)}`,
          ],
          solution: walked(
            [
              [
                ["Swap x and y", "交换 x 与 y"],
                t("Write $y = f(x)$ and swap $x$ and $y$:", "写出 $y = f(x)$，再交换 $x$ 与 $y$："),
                [`x = ${linRecipL(a, b, c, k, "y")}`],
              ],
              [
                ["Isolate the fraction", "把分式单独留下"],
                t(`${k > 0 ? "Subtract" : "Add"} $${Math.abs(k)}$ on both sides:`, `两边${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$：`),
                [`${linear(1, -k)} = ${fracL(a, linear(b, c, "y"))}`],
              ],
              [
                ["Take reciprocals", "取倒数"],
                t(
                  `Both sides are nonzero, so turn both upside down and multiply by $${a}$:`,
                  `两边都不为 $0$，所以两边取倒数，再乘以 $${a}$：`,
                ),
                [`${linear(b, c, "y")} = ${fracL(a, linear(1, -k))}`],
              ],
              [
                ["Solve for y", "解出 y"],
                t(
                  `${c > 0 ? "Subtract" : "Add"} $${Math.abs(c)}$, then divide by $${b}$ and write the fraction in lowest terms:`,
                  `${c > 0 ? "减去" : "加上"} $${Math.abs(c)}$，再除以 $${b}$，并把分式约到最简：`,
                ),
                [`${linear(b, 0, "y")} = ${fracL(a, linear(1, -k))}${plus(-c)}`, `y = ${answer}`],
              ],
            ],
            t(
              `Take $x = ${x1}$. Then $f(${x1}) = ${num(fx1)}$, and the answer gives $f^{-1}\\left(${num(fx1)}\\right) = ${num(back)}$, the input we started with.`,
              `取 $x = ${x1}$。则 $f(${x1}) = ${num(fx1)}$，而结果给出 $f^{-1}\\left(${num(fx1)}\\right) = ${num(back)}$，回到了开始的输入。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-the-inverse",
      title: t("Evaluating the inverse", "求反函数的值"),
      explanation: t(
        `$f^{-1}(v)$ is the input that $f$ sends to $v$, so it can be found without the inverse formula: solve $f(x) = v$. For $f(x) = \\frac{4}{x - 2} + 1$, find $f^{-1}(3)$:

$$\\frac{4}{x - 2} + 1 = 3, \\quad \\frac{4}{x - 2} = 2, \\quad x - 2 = 2, \\quad x = 4$$

so $f^{-1}(3) = 4$.

Check: $f(4) = \\frac{4}{2} + 1 = 3$.

> **Watch out.** $f^{-1}(3)$ is not $f(3)$: solve for the input instead of putting $3$ in. From $\\frac{4}{x - 2} = 2$ comes $x - 2 = \\frac{4}{2}$, not $\\frac{2}{4}$. Then add the $2$ back; do not subtract it or forget it.`,
        `$f^{-1}(v)$ 是被 $f$ 送到 $v$ 的输入，所以不用反函数的解析式也能求：解 $f(x) = v$。对 $f(x) = \\frac{4}{x - 2} + 1$，求 $f^{-1}(3)$：

$$\\frac{4}{x - 2} + 1 = 3, \\quad \\frac{4}{x - 2} = 2, \\quad x - 2 = 2, \\quad x = 4$$

所以 $f^{-1}(3) = 4$。

检验：$f(4) = \\frac{4}{2} + 1 = 3$。

> **注意。** $f^{-1}(3)$ 不是 $f(3)$：要解出输入，而不是把 $3$ 代进去。由 $\\frac{4}{x - 2} = 2$ 得 $x - 2 = \\frac{4}{2}$，不是 $\\frac{2}{4}$。最后要把 $2$ 加回去，不要减去或漏掉。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-12, 12);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-6, 6);
        const d = rng.nonZero(-6, 6);
        const v = k + d;
        const answer = Q.of(a, d).add(Q.of(h));
        const wrong: Q[] = [Q.of(h).sub(Q.of(a, d)), Q.of(d, a).add(Q.of(h)), Q.of(a, d)];
        if (v !== h) wrong.push(Q.of(a, v - h).add(Q.of(k)));
        const den = Q.of(a, d);
        const parts: Step[] = [
          [
            ["Set up the equation", "列方程"],
            t(`$f^{-1}(${v})$ is the input that $f$ sends to $${v}$, so solve`, `$f^{-1}(${v})$ 是被 $f$ 送到 $${v}$ 的输入，所以解方程`),
            [`${recipL(a, h, k)} = ${v}`],
          ],
        ];
        if (k !== 0) {
          parts.push([
            ["Isolate the fraction", "把分式单独留下"],
            t(`${k > 0 ? "Subtract" : "Add"} $${Math.abs(k)}$ on both sides:`, `两边${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$：`),
            [`${fracL(a, shifted(h))} = ${d}`],
          ]);
        }
        parts.push([
          ["Solve", "求解"],
          t(
            `Multiply both sides by $${shifted(h)}$ and divide by $${d}$, then ${h > 0 ? "add" : "subtract"} $${Math.abs(h)}$:`,
            `两边乘以 $${shifted(h)}$ 再除以 $${d}$，然后${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$：`,
          ),
          [`${shifted(h)} = ${quot(a, d)}`, `x = ${num(answer)}`],
        ]);
        return numberProblem({
          prompt: t(`Let $f(x) = ${recipL(a, h, k)}$. Find $f^{-1}(${v})$.`, `设 $f(x) = ${recipL(a, h, k)}$。求 $f^{-1}(${v})$。`),
          answer,
          wrong,
          solution: walked(
            parts,
            t(
              `At $x = ${num(answer)}$ the denominator is $${put(answer, h)} = ${num(den)}$, so $f(x) = ${a} \\div ${pq(den)}${plus(k)} = ${k !== 0 ? `${d}${plus(k)} = ` : ""}${v}$.`,
              `$x = ${num(answer)}$ 时分母为 $${put(answer, h)} = ${num(den)}$，所以 $f(x) = ${a} \\div ${pq(den)}${plus(k)} = ${k !== 0 ? `${d}${plus(k)} = ` : ""}${v}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "domain-and-range-of-the-inverse",
      title: t("Domain and range of the inverse", "反函数的定义域与值域"),
      explanation: t(
        `An inverse swaps inputs and outputs, so the domain of $f^{-1}$ is the range of $f$, and the range of $f^{-1}$ is the domain of $f$. For $f(x) = \\frac{5}{3x - 6} + 4$:

- the domain of $f$ excludes $x = 2$, where $3x - 6 = 0$, so the range of $f^{-1}$ is $(-\\infty, 2) \\cup (2, \\infty)$;
- the range of $f$ excludes $4$, the horizontal asymptote, so the domain of $f^{-1}$ is $(-\\infty, 4) \\cup (4, \\infty)$.

Check: $f(3) = \\frac{5}{3} + 4 = \\frac{17}{3}$, so $f^{-1}\\left(\\frac{17}{3}\\right) = 3$. The input $\\frac{17}{3}$ is not $4$ and the output $3$ is not $2$, as the two sets say.

> **Watch out.** Do not copy the domain of $f$ as the domain of $f^{-1}$: the two sets trade places. Keep the signs: $3x - 6 = 0$ at $x = 2$, and the asymptote is $y = 4$.`,
        `反函数交换输入与输出，所以 $f^{-1}$ 的定义域是 $f$ 的值域，$f^{-1}$ 的值域是 $f$ 的定义域。对 $f(x) = \\frac{5}{3x - 6} + 4$：

- $f$ 的定义域不含使 $3x - 6 = 0$ 的 $x = 2$，所以 $f^{-1}$ 的值域是 $(-\\infty, 2) \\cup (2, \\infty)$；
- $f$ 的值域不含水平渐近线 $4$，所以 $f^{-1}$ 的定义域是 $(-\\infty, 4) \\cup (4, \\infty)$。

检验：$f(3) = \\frac{5}{3} + 4 = \\frac{17}{3}$，所以 $f^{-1}\\left(\\frac{17}{3}\\right) = 3$。输入 $\\frac{17}{3}$ 不是 $4$，输出 $3$ 不是 $2$，与两个集合相符。

> **注意。** 不要把 $f$ 的定义域照抄成 $f^{-1}$ 的定义域：两个集合要互换。注意符号：$3x - 6 = 0$ 时 $x = 2$，渐近线是 $y = 4$。`,
      ),
      keyPrerequisites: ["domain-and-range-of-inverse-functions"],
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 2, 3, -1, -2]);
        const c = rng.nonZero(-9, 9);
        let k = rng.nonZero(-9, 9);
        const p = Q.of(-c, b);
        if (p.eq(Q.of(k))) k = k === 9 ? 8 : k + 1;
        const f = linRecipL(a, b, c, k);
        const askDomain = rng.bool();
        const answer = askDomain ? allBut(k) : allBut(p);
        const x1 = Q.of(1 - c, b);
        return intervalProblem({
          prompt: t(
            `Let $f(x) = ${f}$. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$. Write it in interval notation.`,
            `设 $f(x) = ${f}$。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong: askDomain ? [allBut(p), allBut(-k), allBut(p.neg()), realLine] : [allBut(k), allBut(p.neg()), allBut(-k), realLine],
          solution: askDomain
            ? walked(
                [
                  [
                    ["Swap the roles", "交换角色"],
                    t(
                      "The inverse swaps inputs and outputs, so the domain of $f^{-1}$ is the range of $f$.",
                      "反函数交换输入与输出，所以 $f^{-1}$ 的定义域是 $f$ 的值域。",
                    ),
                  ],
                  [
                    ["Find the range of f", "求 f 的值域"],
                    t(
                      `The fraction $${fracL(a, linear(b, c))}$ takes every value except $0$, so $f$ takes every value except $${k}$, the horizontal asymptote. The domain of $f^{-1}$ is ${setText(answer)}.`,
                      `分式 $${fracL(a, linear(b, c))}$ 能取到除 $0$ 以外的每个值，所以 $f$ 能取到除水平渐近线 $${k}$ 以外的每个值。$f^{-1}$ 的定义域是 ${setText(answer)}。`,
                    ),
                  ],
                ],
                t(
                  `$f\\left(${num(x1)}\\right) = ${a}${plus(k)} = ${a + k}$, so $f^{-1}(${a + k})$ is defined. No $x$ gives $f(x) = ${k}$, since that needs $${fracL(a, linear(b, c))} = 0$.`,
                  `$f\\left(${num(x1)}\\right) = ${a}${plus(k)} = ${a + k}$，所以 $f^{-1}(${a + k})$ 有定义。没有 $x$ 使 $f(x) = ${k}$，因为那需要 $${fracL(a, linear(b, c))} = 0$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Swap the roles", "交换角色"],
                    t(
                      "The inverse swaps inputs and outputs, so the range of $f^{-1}$ is the domain of $f$.",
                      "反函数交换输入与输出，所以 $f^{-1}$ 的值域是 $f$ 的定义域。",
                    ),
                  ],
                  [
                    ["Find the domain of f", "求 f 的定义域"],
                    t("$f$ is not defined only where its denominator is $0$:", "$f$ 只在分母为 $0$ 处无定义："),
                    [`${linear(b, c)} = 0 \\implies x = ${num(p)}`],
                  ],
                  [
                    ["Write the range", "写出值域"],
                    t(`The range of $f^{-1}$ is ${setText(answer)}.`, `$f^{-1}$ 的值域是 ${setText(answer)}。`),
                  ],
                ],
                t(
                  `$f^{-1}$ never outputs $${num(p)}$, since that would need $f\\left(${num(p)}\\right)$, and there the denominator is $${b === 1 ? "" : b === -1 ? "-" : `${b} \\cdot `}${pq(p)}${plus(c)} = 0$.`,
                  `$f^{-1}$ 永远输出不了 $${num(p)}$，因为那需要 $f\\left(${num(p)}\\right)$，而那里分母为 $${b === 1 ? "" : b === -1 ? "-" : `${b} \\cdot `}${pq(p)}${plus(c)} = 0$。`,
                ),
              ),
        });
      },
    },
    {
      id: "functions-that-are-their-own-inverses",
      figure: algebraDrawings3["inverses-of-reciprocal-functions#functions-that-are-their-own-inverses"],
      title: t("Functions that are their own inverses", "以自身为反函数的函数"),
      explanation: t(
        `The inverse of $f(x) = \\frac{a}{x - h} + k$ is $f^{-1}(x) = \\frac{a}{x - k} + h$: swapping $x$ and $y$ makes $h$ and $k$ trade places. So $f$ is its own inverse exactly when $h = k$, that is, when the center $(h, k)$, where the asymptotes cross, lies on the line $y = x$. Then the graph is symmetric about $y = x$. The simplest example is $f(x) = \\frac{1}{x}$.

For $f(x) = \\frac{4}{2x - 6} + c$, the denominator is $0$ at $x = 3$, and the horizontal asymptote is $y = c$, so $f$ is its own inverse when $c = 3$.

Check: with $c = 3$, $f(5) = \\frac{4}{4} + 3 = 4$ and $f(4) = \\frac{4}{2} + 3 = 5$, so applying $f$ twice returns $5$.

> **Watch out.** Solve $2x - 6 = 0$ for the asymptote: $c = 3$, not $6$ and not $-3$. The numerator does not matter.`,
        `$f(x) = \\frac{a}{x - h} + k$ 的反函数是 $f^{-1}(x) = \\frac{a}{x - k} + h$：交换 $x$ 与 $y$ 使 $h$ 与 $k$ 互换位置。所以 $f$ 以自身为反函数当且仅当 $h = k$，也就是两条渐近线的交点（中心）$(h, k)$ 在直线 $y = x$ 上。这时图象关于 $y = x$ 对称。最简单的例子是 $f(x) = \\frac{1}{x}$。

对 $f(x) = \\frac{4}{2x - 6} + c$，分母在 $x = 3$ 处为 $0$，水平渐近线是 $y = c$，所以当 $c = 3$ 时 $f$ 以自身为反函数。

检验：$c = 3$ 时，$f(5) = \\frac{4}{4} + 3 = 4$，$f(4) = \\frac{4}{2} + 3 = 5$，作用两次回到 $5$。

> **注意。** 要解 $2x - 6 = 0$ 求渐近线：$c = 3$，不是 $6$，也不是 $-3$。分子无关紧要。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 2, 3, 4, -1, -2]);
        const p = rng.nonZero(-9, 9);
        const answer = Q.of(p, b);
        const x1 = tryX.find((x) => b * x - p !== 0) ?? 2;
        const y1 = Q.of(a, b * x1 - p).add(answer);
        const back = Q.of(a)
          .div(Q.of(b).mul(y1).sub(Q.of(p)))
          .add(answer);
        return numberProblem({
          prompt: t(
            `Find the value of $c$ for which $f(x) = ${fracL(a, linear(b, -p))} + c$ is its own inverse.`,
            `求 $c$ 的值，使 $f(x) = ${fracL(a, linear(b, -p))} + c$ 以自身为反函数。`,
          ),
          answer,
          solveFor: "c",
          wrong: [Q.of(p), answer.neg(), Q.of(b, p), Q.of(a)],
          solution: walked(
            [
              [
                ["The vertical asymptote", "竖直渐近线"],
                t("The vertical asymptote is where the denominator is $0$:", "竖直渐近线在分母为 $0$ 处："),
                [`${linear(b, -p)} = 0 \\implies x = ${num(answer)}`],
              ],
              [
                ["The horizontal asymptote", "水平渐近线"],
                t(
                  "Far out the fraction approaches $0$, so the horizontal asymptote is $y = c$.",
                  "远处分式趋近 $0$，所以水平渐近线是 $y = c$。",
                ),
              ],
              [
                ["Put the center on y = x", "让中心落在 y = x 上"],
                t(
                  `The function is its own inverse when the center $\\left(${num(answer)}, c\\right)$, where the asymptotes cross, lies on the line $y = x$:`,
                  `当两条渐近线的交点（中心）$\\left(${num(answer)}, c\\right)$ 在直线 $y = x$ 上时，函数以自身为反函数：`,
                ),
                [`c = ${num(answer)}`],
              ],
            ],
            t(
              `With $c = ${num(answer)}$, $f(${x1}) = ${num(y1)}$ and $f\\left(${num(y1)}\\right) = ${num(back)}$. Applying $f$ twice returns the input.`,
              `$c = ${num(answer)}$ 时，$f(${x1}) = ${num(y1)}$，$f\\left(${num(y1)}\\right) = ${num(back)}$。作用两次回到原来的输入。`,
            ),
          ),
        });
      },
    },
  ],
};

// 5.19.6 Finding intersections of lines and reciprocal functions.

/** quadL writes ax^2 + bx + c. */
const quadL = (a: number, b: number, c: number) => poly([a, "x^{2}"], [b, "x"], [c, ""]);

/** factorsL writes m(x − r)(x − s). */
const factorsL = (mm: number, r: number, s: number) => `${front(mm)}(${shifted(r)})(${shifted(s)})`;

/** findingIntersectionsOfLinesAndReciprocalFunctions solves systems of a line and a reciprocal function. */
export const findingIntersectionsOfLinesAndReciprocalFunctions: TopicDef = {
  id: "finding-intersections-of-lines-and-reciprocal-functions",
  title: t("Finding Intersections of Lines and Reciprocal Functions", "求直线与倒数函数图象的交点"),
  summary: t(
    "Find where a line meets the graph of a reciprocal function by clearing the fraction and solving a quadratic, and count the intersection points with the discriminant.",
    "去分母后解一元二次方程，求直线与倒数函数图象的交点，并用判别式数交点个数。",
  ),
  prerequisites: ["combining-graph-transformations-of-reciprocal-functions", "finding-intersections-of-lines-and-quadratic-functions"],
  encompasses: [
    { topic: "finding-intersections-of-lines-and-quadratic-functions", weight: 0.3 },
    { topic: "solving-systems-of-nonlinear-equations", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.REI.C.7", "CCSS.HSA.REI.D.11"],
  intro: t(
    `Where a line crosses the graph of a reciprocal function, both equations hold at once. For $y = 2x - 2$ and $y = \\frac{4}{x}$, set the expressions equal and multiply by $x$:

$$\\frac{4}{x} = 2x - 2 \\implies 4 = 2x^{2} - 2x \\implies 2(x - 2)(x + 1) = 0$$

So $x = 2$ or $x = -1$, giving the points $(2, 2)$ and $(-1, -4)$.

Check: $(-1)(-4) = 4$, and $2(-1) - 2 = -4$, so $(-1, -4)$ lies on both graphs.

In this lesson we find where lines meet $y = \\frac{k}{x}$ and transformed reciprocal functions, and count the intersection points with the discriminant.`,
    `直线与倒数函数图象的交点同时满足两个方程。对 $y = 2x - 2$ 和 $y = \\frac{4}{x}$，令两个表达式相等，再两边乘以 $x$：

$$\\frac{4}{x} = 2x - 2 \\implies 4 = 2x^{2} - 2x \\implies 2(x - 2)(x + 1) = 0$$

所以 $x = 2$ 或 $x = -1$，交点是 $(2, 2)$ 和 $(-1, -4)$。

检验：$(-1)(-4) = 4$，且 $2(-1) - 2 = -4$，所以 $(-1, -4)$ 在两个图象上。

这节课我们求直线与 $y = \\frac{k}{x}$ 以及变换后倒数函数的交点，并用判别式数交点个数。`,
  ),
  knowledgePoints: [
    {
      id: "intersections-with-k-over-x",
      figure: algebraDrawings2["finding-intersections-of-lines-and-reciprocal-functions#intersections-with-k-over-x"],
      title: t("Lines and y = k/x", "直线与 y = k/x"),
      explanation: t(
        `At an intersection point both equations give the same $y$, so set the expressions equal. To find where the line $y = x + 1$ meets $y = \\frac{6}{x}$, multiply by $x$, which is never $0$ on the graph:

$$\\frac{6}{x} = x + 1 \\implies 6 = x^{2} + x \\implies x^{2} + x - 6 = 0 \\implies (x + 3)(x - 2) = 0$$

At $x = 2$, $y = 3$; at $x = -3$, $y = -2$. The intersection points are $(2, 3)$ and $(-3, -2)$.

Check: $2 \\cdot 3 = 6$ and $2 + 1 = 3$, so $(2, 3)$ is on both graphs.

> **Watch out.** Each $x$ has its own $y$: do not pair one solution with the other point. Keep the order $(x, y)$ and the signs; $(3, 2)$ and $(-2, 3)$ are not on the graph.`,
        `在交点处两个方程给出同一个 $y$，所以令两个表达式相等。要求直线 $y = x + 1$ 与 $y = \\frac{6}{x}$ 的交点，两边乘以 $x$（图象上 $x$ 永远不为 $0$）：

$$\\frac{6}{x} = x + 1 \\implies 6 = x^{2} + x \\implies x^{2} + x - 6 = 0 \\implies (x + 3)(x - 2) = 0$$

$x = 2$ 时 $y = 3$；$x = -3$ 时 $y = -2$。交点是 $(2, 3)$ 和 $(-3, -2)$。

检验：$2 \\cdot 3 = 6$，$2 + 1 = 3$，所以 $(2, 3)$ 在两个图象上。

> **注意。** 每个 $x$ 有它自己的 $y$：不要把一个解和另一个交点混在一起。坐标按 $(x, y)$ 的顺序写，注意符号；$(3, 2)$ 和 $(-2, 3)$ 都不在图象上。`,
      ),
      generate(rng) {
        const [r, s] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], 2) as [number, number];
        const mm = rng.pick([1, -1, 2, -2]);
        const n = -mm * (r + s);
        const k = -mm * r * s;
        const askLeft = rng.bool();
        const x = askLeft ? Math.min(r, s) : Math.max(r, s);
        const other = x === r ? s : r;
        const y = k / x;
        const line = linear(mm, n);
        return pointProblem({
          prompt: t(
            `The line $y = ${line}$ meets the graph of $y = ${fracL(k, "x")}$ at two points. Find the intersection point that is farther to the ${askLeft ? "left" : "right"}.`,
            `直线 $y = ${line}$ 与 $y = ${fracL(k, "x")}$ 的图象交于两点。求较${askLeft ? "左" : "右"}边的交点。`,
          ),
          answer: [x, y],
          wrong: [
            [other, k / other],
            [-x, y],
            [x, -y],
            [y, x],
          ],
          solution: walked(
            [
              [
                ["Set the expressions equal", "令两式相等"],
                t("At an intersection point both equations give the same $y$:", "在交点处两个方程给出同一个 $y$："),
                [`${fracL(k, "x")} = ${line}`],
              ],
              [
                ["Clear the fraction", "去分母"],
                t(
                  "Multiply by $x$, which is never $0$ on the graph, and move everything to one side:",
                  "两边乘以 $x$（图象上 $x$ 永远不为 $0$），再把所有项移到一边：",
                ),
                [`${k} = ${quadL(mm, n, 0)}`, `${quadL(mm, n, -k)} = 0`],
              ],
              [
                ["Factor", "因式分解"],
                t("Factor the quadratic:", "把二次式因式分解："),
                [`${factorsL(mm, r, s)} = 0`, `x_{1} = ${r}, \\quad x_{2} = ${s}`],
              ],
              [
                ["Pick the point", "选出交点"],
                t(
                  `The ${askLeft ? "smaller" : "larger"} solution is $x = ${x}$, and there`,
                  `较${askLeft ? "小" : "大"}的解是 $x = ${x}$，此时`,
                ),
                [`y = \\frac{${k}}{${x}} = ${y}`],
              ],
            ],
            t(
              `The point $${pt(x, y)}$ is on both graphs: $${x} \\cdot ${pn(y)} = ${k}$, and the line gives $${lineAt(mm, n, x)} = ${y}$.`,
              `点 $${pt(x, y)}$ 在两个图象上：$${x} \\cdot ${pn(y)} = ${k}$，直线也给出 $${lineAt(mm, n, x)} = ${y}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "intersections-with-transformed-reciprocals",
      title: t("Lines and transformed reciprocal functions", "直线与变换后的倒数函数"),
      explanation: t(
        `For $y = \\frac{a}{x - h} + k$, first move $k$ to the line's side, so the fraction stands alone, then multiply by $x - h$. Where does $y = x - 1$ meet $y = \\frac{2}{x - 3} + 1$?

$$\\frac{2}{x - 3} = x - 2 \\implies 2 = (x - 2)(x - 3) \\implies x^{2} - 5x + 4 = 0 \\implies (x - 1)(x - 4) = 0$$

The $x$-coordinates are $1$ and $4$. Neither is $3$, where the function is not defined, so both are valid.

Check: at $x = 4$ the line gives $4 - 1 = 3$, and the function gives $\\frac{2}{1} + 1 = 3$.

> **Watch out.** The roots of $(x - 1)(x - 4)$ are $1$ and $4$, not $-1$ and $-4$. The answers are values of $x$, not of $x - 3$. Keep both solutions, and never give the excluded value $x = 3$.`,
        `对 $y = \\frac{a}{x - h} + k$，先把 $k$ 移到直线一边，让分式单独留下，再两边乘以 $x - h$。$y = x - 1$ 与 $y = \\frac{2}{x - 3} + 1$ 在哪里相交？

$$\\frac{2}{x - 3} = x - 2 \\implies 2 = (x - 2)(x - 3) \\implies x^{2} - 5x + 4 = 0 \\implies (x - 1)(x - 4) = 0$$

横坐标是 $1$ 和 $4$。都不是使函数无定义的 $3$，所以都成立。

检验：$x = 4$ 时直线给出 $4 - 1 = 3$，函数给出 $\\frac{2}{1} + 1 = 3$。

> **注意。** $(x - 1)(x - 4)$ 的根是 $1$ 和 $4$，不是 $-1$ 和 $-4$。答案是 $x$ 的值，不是 $x - 3$ 的值。两个解都要写，也绝不能写被排除的 $x = 3$。`,
      ),
      generate(rng) {
        const h = rng.int(-3, 3);
        const [dr, ds] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], 2) as [number, number];
        const r = h + dr;
        const s = h + ds;
        const mm = rng.pick([1, -1, 2, -2]);
        const c = mm * (h - r - s);
        const a = -mm * dr * ds;
        const k = rng.int(-4, 4);
        const n = c + k;
        const g = recipL(a, h, k);
        const line = linear(mm, n);
        const [fAt, fVal] = recipAt(a, h, k, r);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points where the line $y = ${line}$ meets the graph of $y = ${g}$.`,
            `求直线 $y = ${line}$ 与 $y = ${g}$ 的图象交点的横坐标。`,
          ),
          values: [String(r), String(s)],
          wrong: [[String(-r), String(-s)], [String(dr), String(ds)], [String(r)], [String(h)]],
          solution: walked(
            [
              [
                ["Isolate the fraction", "把分式单独留下"],
                k === 0
                  ? t("Set the expressions equal:", "令两个表达式相等：")
                  : t(`Set the expressions equal and move $${k}$ to the line's side:`, `令两个表达式相等，并把 $${k}$ 移到直线一边：`),
                [`${fracL(a, shifted(h))} = ${linear(mm, c)}`],
              ],
              [
                ["Clear the fraction", "去分母"],
                t(`Multiply by $${shifted(h)}$ and move everything to one side:`, `两边乘以 $${shifted(h)}$，再把所有项移到一边：`),
                [`${a} = (${linear(mm, c)})(${shifted(h)})`, `${quadL(mm, c - mm * h, -c * h - a)} = 0`],
              ],
              [["Factor", "因式分解"], t("Factor the quadratic:", "把二次式因式分解："), [`${factorsL(mm, r, s)} = 0`]],
              [
                ["Keep the valid solutions", "保留有效的解"],
                t(
                  `Neither $${r}$ nor $${s}$ is $${h}$, where the function is not defined, so $x = ${r}$ and $x = ${s}$.`,
                  `$${r}$ 和 $${s}$ 都不是使函数无定义的 $${h}$，所以 $x = ${r}$，$x = ${s}$。`,
                ),
              ],
            ],
            t(
              `At $x = ${r}$ the line gives $${lineAt(mm, n, r)} = ${mm * r + n}$, and the function gives $${fAt} = ${num(fVal)}$. The values agree.`,
              `$x = ${r}$ 时直线给出 $${lineAt(mm, n, r)} = ${mm * r + n}$，函数给出 $${fAt} = ${num(fVal)}$。两者相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-intersections-with-reciprocals",
      figure: algebraDrawings3["finding-intersections-of-lines-and-reciprocal-functions#counting-intersections-with-reciprocals"],
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        `Setting $\\frac{k}{x} = mx + n$ and multiplying by $x$ gives the quadratic equation $mx^{2} + nx - k = 0$. Each real solution is the $x$ of one intersection point, and none is $0$ because $k \\ne 0$. So its discriminant $n^{2} + 4mk$ counts the points: two when it is positive, one when it is $0$ (the line is **tangent** to a branch), none when it is negative.

For $y = \\frac{2}{x}$ and $y = -x + 1$, the equation is $-x^{2} + x - 2 = 0$, and

$$1^{2} - 4(-1)(-2) = -7 < 0$$

so the line misses the graph.

Check: $x^{2} - x + 2 = \\left(x - \\frac{1}{2}\\right)^{2} + \\frac{7}{4}$ is always positive, so $-x^{2} + x - 2$ is never $0$.

> **Watch out.** The constant term is $-k$, so watch its sign in $b^{2} - 4ac$. A zero discriminant means exactly one point, not two. A negative one means no points at all.`,
        `令 $\\frac{k}{x} = mx + n$ 并两边乘以 $x$，得到一元二次方程 $mx^{2} + nx - k = 0$。它的每个实数解都是一个交点的横坐标，而且因为 $k \\ne 0$，没有一个解是 $0$。所以它的判别式 $n^{2} + 4mk$ 决定交点个数：为正时两个，为 $0$ 时一个（直线与一支**相切**），为负时没有。

对 $y = \\frac{2}{x}$ 和 $y = -x + 1$，方程是 $-x^{2} + x - 2 = 0$，而

$$1^{2} - 4(-1)(-2) = -7 < 0$$

所以直线与图象不相交。

检验：$x^{2} - x + 2 = \\left(x - \\frac{1}{2}\\right)^{2} + \\frac{7}{4}$ 恒为正，所以 $-x^{2} + x - 2$ 永远不为 $0$。

> **注意。** 常数项是 $-k$，算 $b^{2} - 4ac$ 时注意它的符号。判别式为零表示恰有一个交点，不是两个。为负表示一个交点也没有。`,
      ),
      generate(rng) {
        const target = rng.pick([-1, 0, 1] as const);
        let mm: number;
        let k: number;
        let n: number;
        if (target === 0) {
          const p = rng.nonZero(-4, 4);
          const ds = [1, 2, 3, 4, 6, 8, 9, 12, 16].filter((d) => (p * p) % d === 0);
          mm = rng.sign() * rng.pick(ds);
          k = -(p * p) / mm;
          n = 2 * p;
        } else {
          mm = rng.nonZero(-3, 3);
          const kAbs = rng.int(1, 6);
          if (target < 0) {
            k = -Math.sign(mm) * kAbs;
            const bound = Math.floor(Math.sqrt(4 * Math.abs(mm * k) - 1));
            n = rng.int(-bound, bound);
          } else {
            k = rng.sign() * kAbs;
            if (mm * k > 0) n = rng.int(-9, 9);
            else n = rng.sign() * (Math.floor(Math.sqrt(4 * Math.abs(mm * k))) + 1 + rng.int(0, 3));
          }
        }
        const d = n * n + 4 * mm * k;
        const rhs = n === 0 ? `${front(mm)}x` : linear(mm, n);
        const touch = Q.of(-n, 2 * mm);
        const line = n === 0 ? `y = ${front(mm)}x` : `y = ${linear(mm, n)}`;
        const options = [t("None", "没有交点"), t("Exactly one", "恰有一个"), t("Two", "两个")];
        return reasoned(
          choiceProblem({
            prompt: t(
              `How many points do the line $${line}$ and the graph of $y = ${fracL(k, "x")}$ have in common?`,
              `直线 $${line}$ 与 $y = ${fracL(k, "x")}$ 的图象有几个公共点？`,
            ),
            options,
            correct: Math.sign(d) + 1,
            solution: walked(
              [
                [
                  ["Clear the fraction", "去分母"],
                  t(
                    "Set the expressions equal, multiply by $x$ and move everything to one side:",
                    "令两个表达式相等，两边乘以 $x$ 并把所有项移到一边：",
                  ),
                  [`${fracL(k, "x")} = ${rhs}`, `${quadL(mm, n, -k)} = 0`],
                ],
                [
                  ["Compute the discriminant", "计算判别式"],
                  t(`Here $a = ${mm}$, $b = ${n}$ and $c = ${-k}$:`, `这里 $a = ${mm}$，$b = ${n}$，$c = ${-k}$：`),
                  [`b^{2} - 4ac = ${pn(n)}^{2} - 4 \\cdot ${pn(mm)} \\cdot ${pn(-k)} = ${d}`],
                ],
                [
                  ["Count the points", "数交点"],
                  d > 0
                    ? t(
                        "The discriminant is positive, so the equation has two real solutions: two common points.",
                        "判别式为正，方程有两个实数解：有两个公共点。",
                      )
                    : d === 0
                      ? t(
                          "The discriminant is zero, so the equation has one repeated solution: exactly one common point, where the line is tangent to the graph.",
                          "判别式为零，方程有一个重根：恰有一个公共点，直线与图象相切。",
                        )
                      : t(
                          "The discriminant is negative, so the equation has no real solutions: no common points.",
                          "判别式为负，方程没有实数解：没有公共点。",
                        ),
                ],
              ],
              d > 0
                ? t(
                    `Neither solution is $0$, because $x = 0$ makes the left side $${-k}$, not $0$. So each solution gives a point of the graph.`,
                    `两个解都不是 $0$，因为 $x = 0$ 时左边是 $${-k} \\ne 0$。所以每个解都给出图象上的一个点。`,
                  )
                : d === 0
                  ? t(
                      `The repeated solution is $x = ${num(touch)}$. There the line gives $y = ${num(Q.of(mm).mul(touch).add(Q.of(n)))}$ and the graph gives $y = ${k} \\div ${pq(touch)} = ${num(Q.of(k).div(touch))}$, the one common point.`,
                      `重根是 $x = ${num(touch)}$。此时直线给出 $y = ${num(Q.of(mm).mul(touch).add(Q.of(n)))}$，图象给出 $y = ${k} \\div ${pq(touch)} = ${num(Q.of(k).div(touch))}$，正是那个公共点。`,
                    )
                  : t(
                      `$\\sqrt{${d}}$ is not a real number, so $x = \\frac{${-n} \\pm \\sqrt{${d}}}{${2 * mm}}$ has no real value.`,
                      `$\\sqrt{${d}}$ 不是实数，所以 $x = \\frac{${-n} \\pm \\sqrt{${d}}}{${2 * mm}}$ 没有实数值。`,
                    ),
            ),
          }),
          [
            [
              options[0]!.en,
              `The discriminant is ${d > 0 ? `$${d}$, which is positive` : "$0$"}, so the quadratic has ${d > 0 ? "two real solutions" : "a real solution"} and the line meets the graph.`,
              `判别式${d > 0 ? ` $${d}$ 为正` : "为 $0$"}，方程${d > 0 ? "有两个实数解" : "有实数解"}，直线与图象相交。`,
            ],
            [
              options[1]!.en,
              d > 0
                ? "A positive discriminant gives two different solutions, not one."
                : "A negative discriminant gives no real solution. Exactly one point needs the discriminant to be $0$.",
              d > 0 ? "判别式为正时有两个不同的解，而不是一个。" : "判别式为负时没有实数解。恰有一个交点需要判别式为 $0$。",
            ],
            [
              options[2]!.en,
              d === 0
                ? "A zero discriminant gives one repeated solution: the line only touches the graph."
                : "A negative discriminant gives no real solutions, so the line misses both branches.",
              d === 0 ? "判别式为零时只有一个重根：直线只与图象相切。" : "判别式为负时没有实数解，直线与两支都不相交。",
            ],
          ],
        );
      },
    },
  ],
  diagnostic: "intersections-with-transformed-reciprocals",
};

/** algebraIIReciprocalFunctionsTopics are the topics of Algebra II module 5.19, Reciprocal Functions, in teaching order. */
export const algebraIIReciprocalFunctionsTopics: readonly TopicDef[] = [
  graphingReciprocalFunctions,
  graphTransformationsOfReciprocalFunctions,
  combiningGraphTransformationsOfReciprocalFunctions,
  domainAndRangeOfTransformedReciprocalFunctions,
  inversesOfReciprocalFunctions,
  findingIntersectionsOfLinesAndReciprocalFunctions,
];
