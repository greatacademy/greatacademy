import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
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

import { choiceProblem, expressionProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";

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

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

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
  encompasses: [
    { topic: "inverse-variation", weight: 0.4 },
    { topic: "unbounded-behavior-of-functions-near-a-point", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "points-on-the-graph-of-k-over-x",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "The **reciprocal function** $f(x) = \\frac{1}{x}$, and more generally $f(x) = \\frac{k}{x}$ with $k \\ne 0$, is defined for every $x$ except $0$. A point $(x, y)$ lies on the graph of $y = \\frac{k}{x}$ exactly when $xy = k$.\n\nOn $y = \\frac{6}{x}$: at $x = 4$, $y = \\frac{6}{4} = \\frac{3}{2}$. To find where $y = -2$, solve $\\frac{6}{x} = -2$: $x = \\frac{6}{-2} = -3$.\n\nThe figure shows $y = \\frac{6}{x}$ through $(2, 3)$ and $(-3, -2)$.",
        "**倒数函数** $f(x) = \\frac{1}{x}$，以及更一般的 $f(x) = \\frac{k}{x}$（$k \\ne 0$），对除 $0$ 以外的每个 $x$ 都有定义。点 $(x, y)$ 在 $y = \\frac{k}{x}$ 的图象上，当且仅当 $xy = k$。\n\n在 $y = \\frac{6}{x}$ 上：$x = 4$ 时 $y = \\frac{6}{4} = \\frac{3}{2}$。要求 $y = -2$ 的位置，解 $\\frac{6}{x} = -2$：$x = \\frac{6}{-2} = -3$。\n\n图中是经过 $(2, 3)$ 和 $(-3, -2)$ 的 $y = \\frac{6}{x}$ 的图象。",
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
            solution: both("Substitute the $x$-coordinate:", "代入横坐标：", `y = \\frac{${k}}{${given}} = ${num(y)}`),
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
          solution: both(
            "Since $xy = k$ on the graph, divide $k$ by the $y$-coordinate:",
            "图象上 $xy = k$，所以用 $k$ 除以纵坐标：",
            `${given}x = ${k}`,
            `x = ${num(x)}`,
          ),
        });
      },
    },
    {
      id: "branches-and-asymptotes",
      title: t("Branches and asymptotes", "两支与渐近线"),
      explanation: t(
        "The graph of $y = \\frac{k}{x}$ has two separate **branches**. Since $xy = k$, $x$ and $y$ have the same sign when $k > 0$ and opposite signs when $k < 0$:\n\n- $k > 0$: the branches lie in quadrants I and III;\n- $k < 0$: they lie in quadrants II and IV.\n\nNear $x = 0$ the value grows without bound, so the $y$-axis is a **vertical asymptote**. As $x \\to \\infty$ or $x \\to -\\infty$, $\\frac{k}{x} \\to 0$, so the $x$-axis is a **horizontal asymptote**. For $y = -\\frac{4}{x}$: as $x \\to 0^{+}$, $y \\to -\\infty$, and as $x \\to 0^{-}$, $y \\to \\infty$.",
        "$y = \\frac{k}{x}$ 的图象由分开的两**支**组成。因为 $xy = k$，当 $k > 0$ 时 $x$ 与 $y$ 同号，当 $k < 0$ 时异号：\n\n- $k > 0$：两支位于第一、三象限；\n- $k < 0$：两支位于第二、四象限。\n\n在 $x = 0$ 附近函数值无界增长，所以 $y$ 轴是**竖直渐近线**。当 $x \\to \\infty$ 或 $x \\to -\\infty$ 时 $\\frac{k}{x} \\to 0$，所以 $x$ 轴是**水平渐近线**。对 $y = -\\frac{4}{x}$：当 $x \\to 0^{+}$ 时 $y \\to -\\infty$，当 $x \\to 0^{-}$ 时 $y \\to \\infty$。",
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
          return choiceProblem({
            prompt: t(`In which quadrants does the graph of $y = ${fn}$ lie?`, `$y = ${fn}$ 的图象位于哪些象限？`),
            options,
            correct: k > 0 ? 0 : 1,
            solution: t(
              `On the graph $xy = ${k}$, which is ${k > 0 ? "positive, so $x$ and $y$ have the same sign: quadrants I and III" : "negative, so $x$ and $y$ have opposite signs: quadrants II and IV"}.`,
              `图象上 $xy = ${k}$，${k > 0 ? "为正，所以 $x$ 与 $y$ 同号：第一、三象限" : "为负，所以 $x$ 与 $y$ 异号：第二、四象限"}。`,
            ),
          });
        }
        const options = [m("y \\to \\infty"), m("y \\to -\\infty"), m("y \\to 0"), m(`y \\to ${k}`)];
        if (kind === 3) {
          const toPlus = rng.bool();
          const where = toPlus ? "\\infty" : "-\\infty";
          return choiceProblem({
            prompt: t(`What happens to $y = ${fn}$ as $x \\to ${where}$?`, `当 $x \\to ${where}$ 时，$y = ${fn}$ 怎样变化？`),
            options,
            correct: 2,
            solution: t(
              `Dividing $${k}$ by larger and larger numbers gives values closer and closer to $0$: $y \\to 0$. The $x$-axis is the horizontal asymptote.`,
              `用 $${k}$ 除以绝对值越来越大的数，结果越来越接近 $0$：$y \\to 0$。$x$ 轴是水平渐近线。`,
            ),
          });
        }
        const right = kind === 1;
        const sign = right === k > 0 ? 1 : -1;
        const side = right ? "0^{+}" : "0^{-}";
        return choiceProblem({
          prompt: t(`What happens to $y = ${fn}$ as $x \\to ${side}$?`, `当 $x \\to ${side}$ 时，$y = ${fn}$ 怎样变化？`),
          options,
          correct: sign > 0 ? 0 : 1,
          solution: t(
            `For $x$ just ${right ? "right" : "left"} of $0$, $x$ is a tiny ${right ? "positive" : "negative"} number, and $${k}$ divided by it is a ${sign > 0 ? "huge positive" : "huge negative"} number: $y \\to ${sign > 0 ? "\\infty" : "-\\infty"}$.`,
            `$x$ 在 $0$ 的${right ? "右" : "左"}侧附近时是很小的${right ? "正" : "负"}数，$${k}$ 除以它得到${sign > 0 ? "很大的正数" : "绝对值很大的负数"}：$y \\to ${sign > 0 ? "\\infty" : "-\\infty"}$。`,
          ),
        });
      },
    },
    {
      id: "the-constant-from-a-graph",
      title: t("Finding k from a graph", "由图象求 k"),
      explanation: t(
        "Every point of the graph of $y = \\frac{k}{x}$ has $xy = k$. So one point read from the graph gives $k$: if the graph passes through $(-2, 3)$, then $k = -2 \\cdot 3 = -6$ and the function is $y = -\\frac{6}{x}$. Check with the branches: they lie in quadrants II and IV, as they must when $k < 0$.",
        "$y = \\frac{k}{x}$ 图象上的每个点都满足 $xy = k$。所以由图象读出一个点就能求出 $k$：若图象经过 $(-2, 3)$，则 $k = -2 \\cdot 3 = -6$，函数是 $y = -\\frac{6}{x}$。用两支的位置检验：它们位于第二、四象限，与 $k < 0$ 相符。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-4, 4);
          q = rng.nonZero(-4, 4);
        } while (Math.abs(p * q) < 2 || freePoints(p * q, 0, 0, [[p, q]]).length === 0);
        const k = p * q;
        return {
          ...numberProblem({
            prompt: t("The graph of $y = \\frac{k}{x}$ is shown. Find $k$.", "下图是 $y = \\frac{k}{x}$ 的图象。求 $k$。"),
            answer: k,
            solveFor: "k",
            wrong: [Q.of(p, q), Q.of(p + q), Q.of(-k)],
            solution: both(
              `The graph passes through $(${p}, ${q})$, and $xy = k$ on the graph:`,
              `图象经过 $(${p}, ${q})$，而图象上 $xy = k$：`,
              `k = ${p} \\cdot ${q < 0 ? `(${q})` : q} = ${k}`,
            ),
          }),
          figure: recipFigure(k, 0, 0, [[p, q]]),
        };
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
  encompasses: [
    { topic: "graphing-reciprocal-functions", weight: 0.5 },
    { topic: "combining-graph-transformations-two-operations", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "asymptotes-of-translated-reciprocals",
      title: t("The asymptotes move with the graph", "渐近线随图象移动"),
      explanation: t(
        "The graph of $y = \\frac{a}{x - h} + k$ is the graph of $y = \\frac{a}{x}$ shifted $h$ units right and $k$ units up, so its asymptotes move too:\n\n- the vertical asymptote is $x = h$, where the denominator is $0$;\n- the horizontal asymptote is $y = k$, the value the fraction never adds.\n\nFor $y = \\frac{5}{x + 2} - 3$: $x + 2 = 0$ at $x = -2$, so the asymptotes are $x = -2$ and $y = -3$. The numerator $a$ moves neither.",
        "$y = \\frac{a}{x - h} + k$ 的图象是把 $y = \\frac{a}{x}$ 的图象向右平移 $h$ 个单位、向上平移 $k$ 个单位得到的，所以渐近线也随之移动：\n\n- 竖直渐近线是 $x = h$，即分母为 $0$ 处；\n- 水平渐近线是 $y = k$，因为分式永远不为 $0$，函数值取不到 $k$。\n\n对 $y = \\frac{5}{x + 2} - 3$：$x = -2$ 时 $x + 2 = 0$，所以渐近线是 $x = -2$ 和 $y = -3$。分子 $a$ 不会移动渐近线。",
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
            solution: both(
              "The vertical asymptote is where the denominator is $0$:",
              "竖直渐近线在分母为 $0$ 处：",
              `${shifted(h)} = 0 \\implies x = ${h}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`What is the horizontal asymptote of the graph of $y = ${g}$?`, `$y = ${g}$ 的图象的水平渐近线是什么？`),
          answer: k,
          solveFor: "y",
          wrong: [-k, h, a, a + k],
          solution: t(
            `The fraction $${fracL(a, shifted(h))}$ gets close to $0$ as $x \\to \\pm\\infty$ but is never $0$, so $y$ gets close to $${k}$: the horizontal asymptote is $y = ${k}$.`,
            `当 $x \\to \\pm\\infty$ 时分式 $${fracL(a, shifted(h))}$ 趋近 $0$ 但永远不等于 $0$，所以 $y$ 趋近 $${k}$：水平渐近线是 $y = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "equations-of-translated-reciprocals",
      title: t("Writing translated functions", "写出平移后的函数"),
      explanation: t(
        "Translate $f(x) = \\frac{a}{x}$ the same way as any graph: a shift $h$ units right replaces $x$ by $x - h$, and a shift $k$ units up adds $k$. Shifting $f(x) = \\frac{2}{x}$ $4$ units left and $1$ unit up gives\n\n$$g(x) = \\frac{2}{x + 4} + 1$$\n\nCheck with the asymptotes: they moved from $x = 0$ and $y = 0$ to $x = -4$ and $y = 1$.",
        "像平移任何图象一样平移 $f(x) = \\frac{a}{x}$：向右平移 $h$ 个单位就把 $x$ 换成 $x - h$，向上平移 $k$ 个单位就加上 $k$。把 $f(x) = \\frac{2}{x}$ 向左平移 $4$ 个单位、向上平移 $1$ 个单位，得到\n\n$$g(x) = \\frac{2}{x + 4} + 1$$\n\n用渐近线检验：它们从 $x = 0$、$y = 0$ 移到了 $x = -4$、$y = 1$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4, 5, 6, -1, -2, -3]);
        const h = rng.nonZero(-7, 7);
        const k = rng.nonZero(-7, 7);
        const ops = rng.bool() ? [shiftX(h), shiftY(k)] : [shiftY(k), shiftX(h)];
        const d = opsText(ops);
        const f = fracL(a, "x");
        const answer = recipL(a, h, k);
        return expressionProblem({
          prompt: t(
            `Start with the graph of $f(x) = ${f}$. ${d.en} Write the function $g$ of the new graph.`,
            `从 $f(x) = ${f}$ 的图象开始，${d["zh-CN"]}写出所得图象对应的函数 $g$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [recipL(a, -h, k), recipL(a, h, -k), recipL(a, k, h), recipL(a, -h, -k), `${f}${plus(h + k)}`],
          solution: both(
            `Shifting ${h > 0 ? "right" : "left"} replaces $x$ by $${shifted(h)}$, and shifting ${k > 0 ? "up" : "down"} adds $${k}$:`,
            `${h > 0 ? "向右" : "向左"}平移把 $x$ 换成 $${shifted(h)}$，${k > 0 ? "向上" : "向下"}平移加上 $${k}$：`,
            `g(x) = ${answer}`,
          ),
        });
      },
    },
    {
      id: "translations-from-a-graph",
      title: t("Matching graphs and functions", "图象与函数配对"),
      explanation: t(
        "To match a graph with a function $y = \\frac{1}{x - h} + k$, read the asymptotes. Where they cross, at $(h, k)$, is the center of the graph, the image of the origin. If the dashed asymptotes are $x = 3$ and $y = -2$, the function is\n\n$$y = \\frac{1}{x - 3} - 2$$\n\nThe points $(4, -1)$ and $(2, -3)$, one unit from the center in each direction, are the images of $(1, 1)$ and $(-1, -1)$.",
        "要把图象与函数 $y = \\frac{1}{x - h} + k$ 配对，先读出渐近线。它们的交点 $(h, k)$ 是图象的中心，即原点平移后的位置。若虚线渐近线是 $x = 3$ 和 $y = -2$，则函数为\n\n$$y = \\frac{1}{x - 3} - 2$$\n\n点 $(4, -1)$ 和 $(2, -3)$ 在中心的两个方向上各距一个单位，是 $(1, 1)$ 和 $(-1, -1)$ 平移后的点。",
      ),
      generate(rng) {
        let h: number;
        let k: number;
        do {
          h = rng.int(-3, 3);
          k = rng.int(-3, 3);
        } while (h === 0 && k === 0);
        const y = (hh: number, kk: number) => m(`y = ${recipL(1, hh, kk)}`);
        return {
          ...oneOf(
            rng,
            t("Which function has the graph shown?", "哪个函数的图象如下图所示？"),
            y(h, k),
            [y(-h, k), y(h, -k), y(k, h), y(-h, -k), y(-k, -h)],
            t(
              `The asymptotes are $x = ${h}$ and $y = ${k}$, so the graph is $y = \\frac{1}{x}$ shifted to the center $(${h}, ${k})$: $y = ${recipL(1, h, k)}$.`,
              `渐近线是 $x = ${h}$ 和 $y = ${k}$，所以图象是把 $y = \\frac{1}{x}$ 平移到中心 $(${h}, ${k})$：$y = ${recipL(1, h, k)}$。`,
            ),
          ),
          figure: recipFigure(1, h, k, freePoints(1, h, k, latticePoints(1, h, k))),
        };
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
  knowledgePoints: [
    {
      id: "moving-points-of-the-reciprocal-graph",
      title: t("Moving points", "点的移动"),
      explanation: t(
        "$g(x) = \\frac{a}{x - h} + k$ is $a \\cdot f(x - h) + k$ for $f(x) = \\frac{1}{x}$: shift right $h$, multiply the outputs by $a$ (a stretch, with a reflection when $a < 0$), then shift up $k$. So the point $(x, y)$ of $f$ moves to $(x + h, ay + k)$.\n\nFor $g(x) = -\\frac{4}{x - 1} + 2$, the point $\\left(2, \\frac{1}{2}\\right)$ of $y = \\frac{1}{x}$ moves to\n\n$$\\left(2 + 1, \\; -4 \\cdot \\frac{1}{2} + 2\\right) = (3, 0)$$",
        "对 $f(x) = \\frac{1}{x}$，$g(x) = \\frac{a}{x - h} + k$ 就是 $a \\cdot f(x - h) + k$：向右平移 $h$，把输出乘以 $a$（伸缩，$a < 0$ 时还要翻折），再向上平移 $k$。所以 $f$ 上的点 $(x, y)$ 变到 $(x + h, ay + k)$。\n\n对 $g(x) = -\\frac{4}{x - 1} + 2$，$y = \\frac{1}{x}$ 上的点 $\\left(2, \\frac{1}{2}\\right)$ 变到\n\n$$\\left(2 + 1, \\; -4 \\cdot \\frac{1}{2} + 2\\right) = (3, 0)$$",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -1, -2, -3, -4, -6]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-6, 6);
        const x0 = rng.pick([1, -1, 2, -2, 3, -3, 4]);
        const y0 = Q.of(1, x0);
        const g = recipL(a, h, k);
        const ay = y0.mul(Q.of(a));
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
          solution: both(
            `Here $a = ${a}$, $h = ${h}$ and $k = ${k}$, so $(x, y)$ moves to $(x + h, ay + k)$:`,
            `这里 $a = ${a}$，$h = ${h}$，$k = ${k}$，所以 $(x, y)$ 变到 $(x + h, ay + k)$：`,
            `\\left(${x0}${plus(h)}, \\; ${a} \\cdot ${num(y0)}${plus(k)}\\right) = ${pt(x0 + h, ay.add(Q.of(k)))}`,
          ),
        });
      },
    },
    {
      id: "functions-from-several-transformations",
      title: t("Writing the function", "写出函数"),
      explanation: t(
        "Apply the transformations to $f(x) = \\frac{1}{x}$ in the order given. Multiplying the outputs by $a$ multiplies **everything** built so far, including any shift added before it:\n\n- shift right $2$, stretch by $3$, then shift down $1$: $\\frac{1}{x - 2} \\to \\frac{3}{x - 2} \\to \\frac{3}{x - 2} - 1$;\n- shift right $2$, shift down $1$, then stretch by $3$: $\\frac{1}{x - 2} - 1 \\to 3\\left(\\frac{1}{x - 2} - 1\\right) = \\frac{3}{x - 2} - 3$.\n\nA reflection in the $x$-axis multiplies by $-1$ in the same way.",
        "按给定的顺序对 $f(x) = \\frac{1}{x}$ 作变换。把输出乘以 $a$ 时，要乘以此前得到的**整个**式子，包括之前加上的平移量：\n\n- 向右平移 $2$，伸长为 $3$ 倍，再向下平移 $1$：$\\frac{1}{x - 2} \\to \\frac{3}{x - 2} \\to \\frac{3}{x - 2} - 1$；\n- 向右平移 $2$，向下平移 $1$，再伸长为 $3$ 倍：$\\frac{1}{x - 2} - 1 \\to 3\\left(\\frac{1}{x - 2} - 1\\right) = \\frac{3}{x - 2} - 3$。\n\n关于 $x$ 轴翻折同样是乘以 $-1$。",
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
          solution: shiftFirst
            ? both(
                "The shifts come first, and then the outputs are multiplied by",
                "先平移，再把输出乘以",
                `${a}: \\quad ${a}\\left(${recipL(1, h, k)}\\right) = ${answer}`,
              )
            : both(
                "Shift horizontally, multiply the outputs, then shift vertically:",
                "先水平平移，再乘输出，最后竖直平移：",
                `\\frac{1}{x} \\to ${recipL(1, h, 0)} \\to ${recipL(a, h, 0)} \\to ${answer}`,
              ),
        });
      },
    },
    {
      id: "functions-from-graphs",
      title: t("The function of a graph", "图象对应的函数"),
      explanation: t(
        "To write $y = \\frac{a}{x - h} + k$ for a graph, read the asymptotes $x = h$ and $y = k$, then find $a$ from one more point $(x, y)$ of the graph: $y - k = \\frac{a}{x - h}$, so $a = (y - k)(x - h)$.\n\nIf the asymptotes are $x = -1$ and $y = 2$ and the graph passes through $(1, \\frac{1}{2})$, then $a = \\left(\\frac{1}{2} - 2\\right)(1 + 1) = -3$:\n\n$$y = -\\frac{3}{x + 1} + 2$$",
        "要写出图象的函数 $y = \\frac{a}{x - h} + k$，先读出渐近线 $x = h$ 和 $y = k$，再用图象上另一个点 $(x, y)$ 求 $a$：$y - k = \\frac{a}{x - h}$，所以 $a = (y - k)(x - h)$。\n\n若渐近线是 $x = -1$ 和 $y = 2$，且图象经过 $(1, \\frac{1}{2})$，则 $a = \\left(\\frac{1}{2} - 2\\right)(1 + 1) = -3$：\n\n$$y = -\\frac{3}{x + 1} + 2$$",
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
          return {
            ...expressionProblem({
              prompt: t(
                "The graph of $f(x) = \\frac{a}{x - h} + k$ is shown. Find $f(x)$.",
                "下图是 $f(x) = \\frac{a}{x - h} + k$ 的图象。求 $f(x)$。",
              ),
              answer,
              prefix: "f(x) =",
              wrong: [recipL(a, -h, k), recipL(a, h, -k), recipL(-a, h, k), recipL(y0, h, k), recipL(a, k, h)],
              solution: both(
                `The asymptotes are $x = ${h}$ and $y = ${k}$, so $h = ${h}$ and $k = ${k}$. The graph passes through $(${x0}, ${y0})$, so`,
                `渐近线是 $x = ${h}$ 和 $y = ${k}$，所以 $h = ${h}$，$k = ${k}$。图象经过 $(${x0}, ${y0})$，所以`,
                `${y0} = \\frac{a}{${x0} - ${sub(h)}} + ${sub(k)}`,
                `a = (${y0} - ${sub(k)})(${x0} - ${sub(h)}) = ${a}`,
                `f(x) = ${answer}`,
              ),
            }),
            figure: recipFigure(a, h, k, shown),
          };
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
  encompasses: [
    { topic: "combining-graph-transformations-of-reciprocal-functions", weight: 0.3 },
    { topic: "the-domain-and-range-of-transformed-functions", weight: 0.3 },
    { topic: "splitting-rational-expressions-into-terms", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "the-domain-of-a-transformed-reciprocal",
      title: t("The domain", "定义域"),
      explanation: t(
        "$f(x) = \\frac{a}{bx + c} + k$ is defined for every $x$ except where the denominator is $0$, the vertical asymptote. For $f(x) = \\frac{3}{2x - 5} + 1$:\n\n$$2x - 5 = 0 \\implies x = \\frac{5}{2}$$\n\nso the domain is all real numbers except $\\frac{5}{2}$: $\\left(-\\infty, \\frac{5}{2}\\right) \\cup \\left(\\frac{5}{2}, \\infty\\right)$.",
        "$f(x) = \\frac{a}{bx + c} + k$ 对除分母为 $0$ 处（竖直渐近线）以外的每个 $x$ 都有定义。对 $f(x) = \\frac{3}{2x - 5} + 1$：\n\n$$2x - 5 = 0 \\implies x = \\frac{5}{2}$$\n\n所以定义域是除 $\\frac{5}{2}$ 以外的全体实数：$\\left(-\\infty, \\frac{5}{2}\\right) \\cup \\left(\\frac{5}{2}, \\infty\\right)$。",
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
          solution: both(
            "The function is not defined where the denominator is $0$:",
            "分母为 $0$ 处函数无定义：",
            `${linear(b, c)} = 0 \\implies x = ${num(p)}`,
          ),
        });
      },
    },
    {
      id: "the-range-of-a-transformed-reciprocal",
      title: t("The range", "值域"),
      explanation: t(
        "The fraction $\\frac{a}{bx + c}$ takes every value except $0$: to get a value $v \\ne 0$, solve $bx + c = \\frac{a}{v}$. So $f(x) = \\frac{a}{bx + c} + k$ takes every value except $k$, the horizontal asymptote.\n\nFor $f(x) = -\\frac{2}{x + 6} - 4$, the range is all real numbers except $-4$: $(-\\infty, -4) \\cup (-4, \\infty)$. Neither $a$, $b$ nor $c$ changes it.",
        "分式 $\\frac{a}{bx + c}$ 能取到除 $0$ 以外的每个值：要得到值 $v \\ne 0$，解 $bx + c = \\frac{a}{v}$ 即可。所以 $f(x) = \\frac{a}{bx + c} + k$ 能取到除 $k$（水平渐近线）以外的每个值。\n\n对 $f(x) = -\\frac{2}{x + 6} - 4$，值域是除 $-4$ 以外的全体实数：$(-\\infty, -4) \\cup (-4, \\infty)$。$a$、$b$、$c$ 都不改变它。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 1, 2, 3, -1, -2]);
        const c = rng.nonZero(-9, 9);
        const k = rng.nonZero(-9, 9);
        const f = linRecipL(a, b, c, k);
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
          set: allBut(k),
          form: "interval",
          wrong: [allBut(Q.of(-c, b)), allBut(-k), allBut(a), allBut(a + k), realLine],
          solution: t(
            `The fraction $${fracL(a, linear(b, c))}$ takes every value except $0$, so $f(x)$ takes every value except $${k}$, the horizontal asymptote. The range is ${setText(allBut(k))}.`,
            `分式 $${fracL(a, linear(b, c))}$ 能取到除 $0$ 以外的每个值，所以 $f(x)$ 能取到除水平渐近线 $${k}$ 以外的每个值。值域是 ${setText(allBut(k))}。`,
          ),
        });
      },
    },
    {
      id: "the-range-of-a-quotient-of-linear-expressions",
      title: t("Quotients of linear expressions", "一次式之商"),
      explanation: t(
        "To find the range of $f(x) = \\frac{px + q}{x - h}$, split it into a constant plus a reciprocal function. Write the numerator as a multiple of the denominator plus a remainder:\n\n$$\\frac{2x + 1}{x - 3} = \\frac{2(x - 3) + 7}{x - 3} = 2 + \\frac{7}{x - 3}$$\n\nNow it is $\\frac{7}{x - 3}$ shifted up $2$: the horizontal asymptote is $y = 2$, and the range is $(-\\infty, 2) \\cup (2, \\infty)$.",
        "要求 $f(x) = \\frac{px + q}{x - h}$ 的值域，先把它拆成常数加倒数函数。把分子写成分母的倍数加余数：\n\n$$\\frac{2x + 1}{x - 3} = \\frac{2(x - 3) + 7}{x - 3} = 2 + \\frac{7}{x - 3}$$\n\n它就是把 $\\frac{7}{x - 3}$ 向上平移 $2$：水平渐近线是 $y = 2$，值域是 $(-\\infty, 2) \\cup (2, \\infty)$。",
      ),
      keyPrerequisites: ["splitting-rational-expressions-into-terms"],
      generate(rng) {
        const p = rng.nonZero(-6, 6);
        const h = rng.nonZero(-7, 7);
        let q = rng.nonZero(-9, 9);
        if (q + p * h === 0) q += 1;
        const r = q + p * h;
        const f = `\\frac{${linear(p, q)}}{${shifted(h)}}`;
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${f}$. Write it in interval notation.`, `求 $f(x) = ${f}$ 的值域，用区间记号表示。`),
          set: allBut(p),
          form: "interval",
          wrong: [allBut(h), allBut(q), allBut(-p), allBut(r), realLine],
          solution: t(
            `Split off a constant:${steps(`\\frac{${linear(p, q)}}{${shifted(h)}} = \\frac{${p}(${shifted(h)})${plus(r)}}{${shifted(h)}} = ${fracL(r, shifted(h))}${plus(p)}`)}The fraction takes every value except $0$, so $f$ takes every value except $${p}$: the range is ${setText(allBut(p))}.`,
            `先拆出常数：${steps(`\\frac{${linear(p, q)}}{${shifted(h)}} = \\frac{${p}(${shifted(h)})${plus(r)}}{${shifted(h)}} = ${fracL(r, shifted(h))}${plus(p)}`)}分式能取到除 $0$ 以外的每个值，所以 $f$ 能取到除 $${p}$ 以外的每个值：值域是 ${setText(allBut(p))}。`,
          ),
        });
      },
    },
    {
      id: "the-range-on-a-restricted-domain",
      title: t("The range on an interval", "区间上的值域"),
      explanation: t(
        "On an interval that does not contain the vertical asymptote, $f(x) = \\frac{a}{x - h} + k$ lies on a single branch, which only rises or only falls. So its least and greatest values are at the ends of the interval.\n\nFor $f(x) = \\frac{6}{x - 1} + 2$ on $3 \\le x \\le 7$: $f(3) = \\frac{6}{2} + 2 = 5$ and $f(7) = \\frac{6}{6} + 2 = 3$, so the range is $[3, 5]$.",
        "在不包含竖直渐近线的区间上，$f(x) = \\frac{a}{x - h} + k$ 只在一支上，这一支只升或只降。所以它的最小值和最大值在区间的两端取到。\n\n对 $3 \\le x \\le 7$ 上的 $f(x) = \\frac{6}{x - 1} + 2$：$f(3) = \\frac{6}{2} + 2 = 5$，$f(7) = \\frac{6}{6} + 2 = 3$，所以值域是 $[3, 5]$。",
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
        const wrong: RealSet[] = [union(iv(min, max, false, false)), allBut(k), union(iv(Q.of(k), max))];
        if (s && w) wrong.push(union(iv(s.cmp(w) <= 0 ? s : w, s.cmp(w) <= 0 ? w : s)));
        return intervalProblem({
          prompt: t(
            `Find the range of $f(x) = ${f}$ for $${lo} \\le x \\le ${hi}$. Write it in interval notation.`,
            `求 $f(x) = ${f}$ 在 $${lo} \\le x \\le ${hi}$ 上的值域，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong,
          solution: t(
            `The asymptote $x = ${h}$ is outside the interval, so $f$ is ${u.cmp(v) < 0 ? "increasing" : "decreasing"} on it and its extreme values are at the ends:${steps(`f(${lo}) = ${num(u)}, \\quad f(${hi}) = ${num(v)}`)}The range is ${setText(answer)}.`,
            `渐近线 $x = ${h}$ 不在区间内，所以 $f$ 在区间上${u.cmp(v) < 0 ? "递增" : "递减"}，最值在两端取到：${steps(`f(${lo}) = ${num(u)}, \\quad f(${hi}) = ${num(v)}`)}值域是 ${setText(answer)}。`,
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
  encompasses: [
    { topic: "calculating-the-inverse-of-a-function", weight: 0.4 },
    { topic: "domain-and-range-of-transformed-reciprocal-functions", weight: 0.4 },
    { topic: "domain-and-range-of-inverse-functions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.A"],
  knowledgePoints: [
    {
      id: "inverse-formulas",
      title: t("The inverse formula", "反函数的解析式"),
      explanation: t(
        "Swap $x$ and $y$, isolate the fraction, take reciprocals, and solve for $y$. For $f(x) = \\frac{6}{2x + 1} - 3$:\n\n$$x = \\frac{6}{2y + 1} - 3, \\quad x + 3 = \\frac{6}{2y + 1}, \\quad 2y + 1 = \\frac{6}{x + 3}, \\quad y = \\frac{6}{2(x + 3)} - \\frac{1}{2}$$\n\nso $f^{-1}(x) = \\frac{3}{x + 3} - \\frac{1}{2}$. The inverse is again a reciprocal function: its vertical asymptote $x = -3$ is the horizontal asymptote of $f$, and the other way round.",
        "交换 $x$ 与 $y$，把分式单独留在一边，两边取倒数，再解出 $y$。对 $f(x) = \\frac{6}{2x + 1} - 3$：\n\n$$x = \\frac{6}{2y + 1} - 3, \\quad x + 3 = \\frac{6}{2y + 1}, \\quad 2y + 1 = \\frac{6}{x + 3}, \\quad y = \\frac{6}{2(x + 3)} - \\frac{1}{2}$$\n\n所以 $f^{-1}(x) = \\frac{3}{x + 3} - \\frac{1}{2}$。反函数仍是倒数函数：它的竖直渐近线 $x = -3$ 是 $f$ 的水平渐近线，反之亦然。",
      ),
      keyPrerequisites: ["calculating-the-inverse-of-a-function"],
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([2, 3, 4, -1, -2, -3]);
        const c = rng.nonZero(-9, 9);
        const k = rng.nonZero(-7, 7);
        const f = linRecipL(a, b, c, k);
        const shift = Q.of(-c, b);
        const answer = `${fracL(a, linear(b, -b * k))}${plus(shift)}`;
        return expressionProblem({
          prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
          answer,
          prefix: "f^{-1}(x) =",
          wrong: [
            f,
            `${fracL(a, linear(b, -b * k))}${plus(shift.neg())}`,
            `${fracL(a, linear(1, -k))}${plus(-c)}`,
            `${fracL(a, linear(b, b * k))}${plus(shift)}`,
            `${fracL(a, linear(b, -k))}${plus(shift)}`,
          ],
          solution: both(
            "Swap $x$ and $y$, isolate the fraction, take reciprocals and solve for $y$:",
            "交换 $x$ 与 $y$，把分式单独留在一边，两边取倒数，再解出 $y$：",
            `x = ${linRecipL(a, b, c, k, "y")}`,
            `${linear(1, -k)} = ${fracL(a, linear(b, c, "y"))}`,
            `${linear(b, c, "y")} = ${fracL(a, linear(1, -k))}`,
            `y = ${answer}`,
          ),
        });
      },
    },
    {
      id: "evaluating-the-inverse",
      title: t("Evaluating the inverse", "求反函数的值"),
      explanation: t(
        "$f^{-1}(v)$ is the input that $f$ sends to $v$, so it can be found without the inverse formula: solve $f(x) = v$. For $f(x) = \\frac{4}{x - 2} + 1$, find $f^{-1}(3)$:\n\n$$\\frac{4}{x - 2} + 1 = 3, \\quad \\frac{4}{x - 2} = 2, \\quad x - 2 = 2, \\quad x = 4$$\n\nso $f^{-1}(3) = 4$. Check: $f(4) = \\frac{4}{2} + 1 = 3$.",
        "$f^{-1}(v)$ 是被 $f$ 送到 $v$ 的输入，所以不用反函数的解析式也能求：解 $f(x) = v$。对 $f(x) = \\frac{4}{x - 2} + 1$，求 $f^{-1}(3)$：\n\n$$\\frac{4}{x - 2} + 1 = 3, \\quad \\frac{4}{x - 2} = 2, \\quad x - 2 = 2, \\quad x = 4$$\n\n所以 $f^{-1}(3) = 4$。检验：$f(4) = \\frac{4}{2} + 1 = 3$。",
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
        return numberProblem({
          prompt: t(`Let $f(x) = ${recipL(a, h, k)}$. Find $f^{-1}(${v})$.`, `设 $f(x) = ${recipL(a, h, k)}$。求 $f^{-1}(${v})$。`),
          answer,
          wrong,
          solution: both(
            `$f^{-1}(${v})$ is the solution of $f(x) = ${v}$:`,
            `$f^{-1}(${v})$ 是方程 $f(x) = ${v}$ 的解：`,
            `${recipL(a, h, k)} = ${v}`,
            `${fracL(a, shifted(h))} = ${d}`,
            `${shifted(h)} = ${num(Q.of(a, d))}`,
            `x = ${num(answer)}`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-of-the-inverse",
      title: t("Domain and range of the inverse", "反函数的定义域与值域"),
      explanation: t(
        "An inverse swaps inputs and outputs, so the domain of $f^{-1}$ is the range of $f$, and the range of $f^{-1}$ is the domain of $f$. For $f(x) = \\frac{5}{3x - 6} + 4$:\n\n- the domain of $f$ excludes $x = 2$, so the range of $f^{-1}$ is $(-\\infty, 2) \\cup (2, \\infty)$;\n- the range of $f$ excludes $4$, so the domain of $f^{-1}$ is $(-\\infty, 4) \\cup (4, \\infty)$.",
        "反函数交换输入与输出，所以 $f^{-1}$ 的定义域是 $f$ 的值域，$f^{-1}$ 的值域是 $f$ 的定义域。对 $f(x) = \\frac{5}{3x - 6} + 4$：\n\n- $f$ 的定义域不含 $x = 2$，所以 $f^{-1}$ 的值域是 $(-\\infty, 2) \\cup (2, \\infty)$；\n- $f$ 的值域不含 $4$，所以 $f^{-1}$ 的定义域是 $(-\\infty, 4) \\cup (4, \\infty)$。",
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
        return intervalProblem({
          prompt: t(
            `Let $f(x) = ${f}$. Find the ${askDomain ? "domain" : "range"} of $f^{-1}$. Write it in interval notation.`,
            `设 $f(x) = ${f}$。求 $f^{-1}$ 的${askDomain ? "定义域" : "值域"}，用区间记号表示。`,
          ),
          set: answer,
          form: "interval",
          wrong: askDomain ? [allBut(p), allBut(-k), allBut(p.neg()), realLine] : [allBut(k), allBut(p.neg()), allBut(-k), realLine],
          solution: askDomain
            ? t(
                `The domain of $f^{-1}$ is the range of $f$, which excludes only the horizontal asymptote $y = ${k}$: ${setText(answer)}.`,
                `$f^{-1}$ 的定义域是 $f$ 的值域，它只不含水平渐近线 $y = ${k}$：${setText(answer)}。`,
              )
            : t(
                `The range of $f^{-1}$ is the domain of $f$, which excludes only $x = ${num(p)}$, where $${linear(b, c)} = 0$: ${setText(answer)}.`,
                `$f^{-1}$ 的值域是 $f$ 的定义域，它只不含使 $${linear(b, c)} = 0$ 的 $x = ${num(p)}$：${setText(answer)}。`,
              ),
        });
      },
    },
    {
      id: "functions-that-are-their-own-inverses",
      title: t("Functions that are their own inverses", "以自身为反函数的函数"),
      explanation: t(
        "The inverse of $f(x) = \\frac{a}{x - h} + k$ is $f^{-1}(x) = \\frac{a}{x - k} + h$: the numbers $h$ and $k$ trade places. So $f$ is its own inverse exactly when $h = k$, that is, when the center $(h, k)$, where the asymptotes cross, lies on the line $y = x$. Then the graph is symmetric about $y = x$. The simplest example is $f(x) = \\frac{1}{x}$.\n\nFor $f(x) = \\frac{4}{2x - 6} + c$, the vertical asymptote is $x = 3$ and the horizontal one $y = c$, so $f$ is its own inverse when $c = 3$.",
        "$f(x) = \\frac{a}{x - h} + k$ 的反函数是 $f^{-1}(x) = \\frac{a}{x - k} + h$：数 $h$ 与 $k$ 互换位置。所以 $f$ 以自身为反函数当且仅当 $h = k$，也就是两条渐近线的交点（中心）$(h, k)$ 在直线 $y = x$ 上。这时图象关于 $y = x$ 对称。最简单的例子是 $f(x) = \\frac{1}{x}$。\n\n对 $f(x) = \\frac{4}{2x - 6} + c$，竖直渐近线是 $x = 3$，水平渐近线是 $y = c$，所以当 $c = 3$ 时 $f$ 以自身为反函数。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.pick([1, 1, 2, 3, 4, -1, -2]);
        const p = rng.nonZero(-9, 9);
        const answer = Q.of(p, b);
        return numberProblem({
          prompt: t(
            `Find the value of $c$ for which $f(x) = ${fracL(a, linear(b, -p))} + c$ is its own inverse.`,
            `求 $c$ 的值，使 $f(x) = ${fracL(a, linear(b, -p))} + c$ 以自身为反函数。`,
          ),
          answer,
          solveFor: "c",
          wrong: [Q.of(p), answer.neg(), Q.of(b, p), Q.of(a)],
          solution: both(
            "The vertical asymptote is where the denominator is $0$, and the horizontal asymptote is $y = c$. The function is its own inverse when they cross on the line $y = x$, that is, when $c$ equals",
            "竖直渐近线在分母为 $0$ 处，水平渐近线是 $y = c$。当它们的交点在直线 $y = x$ 上，即 $c$ 等于下面的值时，函数以自身为反函数：",
            `${linear(b, -p)} = 0 \\implies x = ${num(answer)}`,
            `c = ${num(answer)}`,
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
    { topic: "finding-intersections-of-lines-and-quadratic-functions", weight: 0.5 },
    { topic: "solving-systems-of-nonlinear-equations", weight: 0.3 },
    { topic: "graphing-reciprocal-functions", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.REI.C.7", "CCSS.HSA.REI.D.11"],
  knowledgePoints: [
    {
      id: "intersections-with-k-over-x",
      title: t("Lines and y = k/x", "直线与 y = k/x"),
      explanation: t(
        "To find where the line $y = x + 1$ meets $y = \\frac{6}{x}$, set the expressions equal and multiply by $x$, which is never $0$ on the graph:\n\n$$\\frac{6}{x} = x + 1 \\implies 6 = x^{2} + x \\implies x^{2} + x - 6 = 0 \\implies (x + 3)(x - 2) = 0$$\n\nAt $x = 2$, $y = 3$; at $x = -3$, $y = -2$. The intersection points are $(2, 3)$ and $(-3, -2)$.",
        "要求直线 $y = x + 1$ 与 $y = \\frac{6}{x}$ 的交点，令两个表达式相等，再两边乘以 $x$（图象上 $x$ 永远不为 $0$）：\n\n$$\\frac{6}{x} = x + 1 \\implies 6 = x^{2} + x \\implies x^{2} + x - 6 = 0 \\implies (x + 3)(x - 2) = 0$$\n\n$x = 2$ 时 $y = 3$；$x = -3$ 时 $y = -2$。交点是 $(2, 3)$ 和 $(-3, -2)$。",
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
          solution: t(
            `Set the expressions equal and multiply by $x$:${steps(`${fracL(k, "x")} = ${line}`, `${k} = ${quadL(mm, n, 0)}`, `${quadL(mm, n, -k)} = 0`, `${factorsL(mm, r, s)} = 0`)}so $x = ${r}$ or $x = ${s}$. The ${askLeft ? "smaller" : "larger"} is $x = ${x}$, where $y = \\frac{${k}}{${x}} = ${y}$. The point is $${pt(x, y)}$.`,
            `令两个表达式相等，再两边乘以 $x$：${steps(`${fracL(k, "x")} = ${line}`, `${k} = ${quadL(mm, n, 0)}`, `${quadL(mm, n, -k)} = 0`, `${factorsL(mm, r, s)} = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。较${askLeft ? "小" : "大"}的是 $x = ${x}$，此时 $y = \\frac{${k}}{${x}} = ${y}$。交点是 $${pt(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "intersections-with-transformed-reciprocals",
      title: t("Lines and transformed reciprocal functions", "直线与变换后的倒数函数"),
      explanation: t(
        "For $y = \\frac{a}{x - h} + k$, first move $k$ to the line's side, then multiply by $x - h$. Where does $y = x - 1$ meet $y = \\frac{2}{x - 3} + 1$?\n\n$$\\frac{2}{x - 3} = x - 2 \\implies 2 = (x - 2)(x - 3) \\implies x^{2} - 5x + 4 = 0 \\implies (x - 1)(x - 4) = 0$$\n\nThe $x$-coordinates are $1$ and $4$. Neither is $3$, where the function is not defined, so both are valid.",
        "对 $y = \\frac{a}{x - h} + k$，先把 $k$ 移到直线一边，再两边乘以 $x - h$。$y = x - 1$ 与 $y = \\frac{2}{x - 3} + 1$ 在哪里相交？\n\n$$\\frac{2}{x - 3} = x - 2 \\implies 2 = (x - 2)(x - 3) \\implies x^{2} - 5x + 4 = 0 \\implies (x - 1)(x - 4) = 0$$\n\n横坐标是 $1$ 和 $4$。都不是使函数无定义的 $3$，所以都成立。",
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
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points where the line $y = ${line}$ meets the graph of $y = ${g}$.`,
            `求直线 $y = ${line}$ 与 $y = ${g}$ 的图象交点的横坐标。`,
          ),
          values: [String(r), String(s)],
          wrong: [[String(-r), String(-s)], [String(dr), String(ds)], [String(r)], [String(h)]],
          solution: t(
            `Move $${k}$ to the line's side and multiply by $${shifted(h)}$:${steps(`${fracL(a, shifted(h))} = ${linear(mm, c)}`, `${a} = (${linear(mm, c)})(${shifted(h)})`, `${quadL(mm, c - mm * h, -c * h - a)} = 0`, `${factorsL(mm, r, s)} = 0`)}Neither $${r}$ nor $${s}$ is $${h}$, so $x = ${r}$ and $x = ${s}$.`,
            `把 $${k}$ 移到直线一边，再两边乘以 $${shifted(h)}$：${steps(`${fracL(a, shifted(h))} = ${linear(mm, c)}`, `${a} = (${linear(mm, c)})(${shifted(h)})`, `${quadL(mm, c - mm * h, -c * h - a)} = 0`, `${factorsL(mm, r, s)} = 0`)}$${r}$ 和 $${s}$ 都不等于 $${h}$，所以 $x = ${r}$，$x = ${s}$。`,
          ),
        });
      },
    },
    {
      id: "counting-intersections-with-reciprocals",
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        "Setting $\\frac{k}{x} = mx + n$ and multiplying by $x$ gives the quadratic equation $mx^{2} + nx - k = 0$. Its discriminant $n^{2} + 4mk$ counts the intersection points: two when it is positive, one when it is $0$ (the line is **tangent** to a branch), none when it is negative.\n\nFor $y = \\frac{2}{x}$ and $y = -x + 1$: $-x^{2} + x - 2 = 0$, with discriminant $1^{2} - 4(-1)(-2) = -7 < 0$, so the line misses the graph.",
        "令 $\\frac{k}{x} = mx + n$ 并两边乘以 $x$，得到一元二次方程 $mx^{2} + nx - k = 0$。它的判别式 $n^{2} + 4mk$ 决定交点个数：为正时两个，为 $0$ 时一个（直线与一支**相切**），为负时没有。\n\n对 $y = \\frac{2}{x}$ 和 $y = -x + 1$：$-x^{2} + x - 2 = 0$，判别式 $1^{2} - 4(-1)(-2) = -7 < 0$，所以直线与图象不相交。",
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
        const line = n === 0 ? `y = ${front(mm)}x` : `y = ${linear(mm, n)}`;
        const options = [t("None", "没有交点"), t("Exactly one", "恰有一个"), t("Two", "两个")];
        return choiceProblem({
          prompt: t(
            `How many points do the line $${line}$ and the graph of $y = ${fracL(k, "x")}$ have in common?`,
            `直线 $${line}$ 与 $y = ${fracL(k, "x")}$ 的图象有几个公共点？`,
          ),
          options,
          correct: Math.sign(d) + 1,
          solution: t(
            `Set the expressions equal, multiply by $x$ and move everything to one side:${steps(`${quadL(mm, n, -k)} = 0`, `${n < 0 ? `(${n})` : n}^{2} - 4 \\cdot ${mm < 0 ? `(${mm})` : mm} \\cdot ${-k < 0 ? `(${-k})` : -k} = ${d}`)}The discriminant is ${d > 0 ? "positive: two points" : d === 0 ? "zero: exactly one point, where the line is tangent to the graph" : "negative: no common points"}.`,
            `令两个表达式相等，两边乘以 $x$ 并把所有项移到一边：${steps(`${quadL(mm, n, -k)} = 0`, `${n < 0 ? `(${n})` : n}^{2} - 4 \\cdot ${mm < 0 ? `(${mm})` : mm} \\cdot ${-k < 0 ? `(${-k})` : -k} = ${d}`)}判别式${d > 0 ? "为正：有两个公共点" : d === 0 ? "为零：恰有一个公共点，直线与图象相切" : "为负：没有公共点"}。`,
          ),
        });
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
