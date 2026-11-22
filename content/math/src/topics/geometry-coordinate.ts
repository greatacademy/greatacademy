import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  paren,
  plane,
  poly,
  Q,
  radical,
  simplifyRadical,
} from "@ga/subject-math";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { coordinateDrawings } from "../explanation-drawings-solids.ts";
import { graphFigure, legs, overlay, plain, at as plainAt, riseOf, riseRun, root, sideLabels } from "../graph-figures.ts";
import {
  equationProblem,
  expressionProblem,
  numberProblem,
  pointLatex,
  pointProblem,
  radicalProblem,
  solutionsProblem,
  steps,
  why,
} from "../problems.ts";
import { chain, evalAt, stepLabel } from "../solution-kit.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

function gcd(a: number, b: number): number {
  let [m, n] = [Math.abs(a), Math.abs(b)];
  while (n !== 0) [m, n] = [n, m % n];
  return m;
}

/** fracSlopes are the slopes p/q in lowest terms with 0 < |p| ≤ 5 and q from 2 to 4. */
const fracSlopes: readonly Q[] = [2, 3, 4].flatMap((d) =>
  [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((n) => gcd(n, d) === 1).map((n) => Q.of(n, d)),
);

/** pickSlope draws a nonzero slope other than ±1: an integer from −5 to 5, or a fraction from fracSlopes. */
function pickSlope(rng: Rng): Q {
  return rng.bool(0.45) ? Q.of(rng.sign() * rng.int(2, 5)) : rng.pick(fracSlopes);
}

/** si writes y = mx + b. */
const si = (m: Coefficient, b: Coefficient) => `y = ${linear(m, b)}`;

/** std writes Ax + By = C. */
const std = (a: Coefficient, b: Coefficient, c: Coefficient) => `${poly([a, "x"], [b, "y"])} = ${num(c)}`;

/** coefficient writes m before a parenthesis: "" for 1, "-" for −1. */
function coefficient(m: Coefficient): string {
  const v = toQ(m);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return num(v);
}

/** ps writes the point-slope form y − k = m(x − h). */
const ps = (m: Coefficient, h: Coefficient, k: Coefficient) =>
  `${linear(1, toQ(k).neg(), "y")} = ${coefficient(m)}(${linear(1, toQ(h).neg())})`;

/** standardOf scales ax + by = c to integers without a common factor and a positive leading coefficient. */
function standardOf(a: Coefficient, b: Coefficient, c: Coefficient): [number, number, number] {
  const qs = [a, b, c].map(toQ);
  const bgcd = (x: bigint, y: bigint): bigint => {
    let [m, n] = [x < 0n ? -x : x, y < 0n ? -y : y];
    while (n !== 0n) [m, n] = [n, m % n];
    return m;
  };
  let l = 1n;
  for (const v of qs) l = (l * v.d) / bgcd(l, v.d);
  let ints = qs.map((v) => v.n * (l / v.d));
  const g = ints.reduce((acc, v) => bgcd(acc, v), 0n);
  ints = ints.map((v) => v / g);
  if (ints[0]! < 0n || (ints[0] === 0n && ints[1]! < 0n)) ints = ints.map((v) => -v);
  return [Number(ints[0]), Number(ints[1]), Number(ints[2])];
}

/** stdOfLine writes y = mx + b in standard form. */
const stdOfLine = (m: Q, b: Coefficient) => std(...standardOf(m.neg(), 1, b));

/** lineIn writes the line y = mx + b in slope-intercept or standard form. */
const lineIn = (m: Q, b: Coefficient, standard: boolean) => (standard ? stdOfLine(m, b) : si(m, b));

/** interceptThrough is the y-intercept of the line of slope m through (h, k). */
const interceptThrough = (m: Q, h: number, k: number) => Q.of(k).sub(m.mul(Q.of(h)));

/** slopeOf explains the slope of the line y = mx + b as it is written in the prompt: read off, or after solving for y. */
function slopeOf(m: Q, b: Coefficient, standard: boolean): Text {
  if (!standard)
    return t(
      `The line $${si(m, b)}$ is in slope-intercept form, so its slope is the coefficient of $x$: $m = ${num(m)}$.`,
      `直线 $${si(m, b)}$ 是斜截式，斜率就是 $x$ 的系数：$m = ${num(m)}$。`,
    );
  const [A, B, C] = standardOf(m.neg(), 1, b);
  const work = steps(...[`${poly([B, "y"])} = ${poly([-A, "x"], [C, ""])}`, si(m, b)].filter((l, i, all) => l !== all[i - 1]));
  const divide = B === 1 ? t("", "") : t(` and divide by $${B}$`, `，再除以 $${B}$`);
  return t(
    `Solve $${stdOfLine(m, b)}$ for $y$ to read its slope: move the $x$-term to the right side${divide.en}:${work}So its slope is $m = ${num(m)}$.`,
    `把 $${stdOfLine(m, b)}$ 解出 $y$ 来读斜率：把含 $x$ 的项移到右边${divide["zh-CN"]}：${work}所以它的斜率是 $m = ${num(m)}$。`,
  );
}

/** pointOff draws an integer point (h, k) that is not on y = mx + b. */
function pointOff(rng: Rng, m: Q, b: Q, max = 8): [number, number] {
  for (;;) {
    const h = rng.int(-max, max);
    const k = rng.int(-max, max);
    if (!interceptThrough(m, h, k).eq(b)) return [h, k];
  }
}

/** pt writes a named point in LaTeX: "A(3, -2)". */
const pt = (name: string, p: readonly Coefficient[]) => `${name}${pointLatex(p)}`;

/** plainPt writes a point for alt text: "(3, -2)". */
const plainPt = (p: Point) => `(${p[0]}, ${p[1]})`;

/** rootSteps writes √n = k√m, or just √n = k, for a solution. */
function rootSteps(n: number): string {
  const [k, m] = simplifyRadical(n);
  if (m === 1) return `\\sqrt{${n}} = ${k}`;
  if (k === 1) return `\\sqrt{${n}}`;
  return `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`;
}

/** rootTex writes √n in simplest radical form. */
function rootTex(n: number): string {
  const [k, m] = simplifyRadical(n);
  return radical(k, m);
}

/** distanceSteps writes the distance formula for A and B down to √n. */
function distanceSteps(a: Point, b: Point): string {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  return `\\sqrt{(${b[0]} - ${paren(a[0])})^2 + (${b[1]} - ${paren(a[1])})^2} = \\sqrt{${paren(dx)}^2 + ${paren(dy)}^2} = ${rootSteps(dx * dx + dy * dy)}`;
}

/** sq is the squared distance between two points. */
const sq = (a: Point, b: Point) => (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;

const compassPoints: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** away is the compass direction from c towards p, for a label outside a figure. */
function away(p: Point, c: Point): Compass {
  const a = Math.atan2(p[1] - c[1], p[0] - c[0]);
  return compassPoints[(((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8) as 0]!;
}

/** fitView is a window of the coordinate plane around the points and the origin, with a margin of one unit. */
function fitView(points: readonly Point[]): PlaneView {
  const xs = [0, ...points.map((p) => p[0])];
  const ys = [0, ...points.map((p) => p[1])];
  const v = { xMin: Math.min(...xs) - 1, xMax: Math.max(...xs) + 1, yMin: Math.min(...ys) - 1, yMax: Math.max(...ys) + 1 };
  const span = Math.max(v.xMax - v.xMin, v.yMax - v.yMin);
  return { ...v, labelEvery: span > 14 ? 2 : 1 };
}

/** shapeFigure draws a polygon (or a segment, for two points) with its named vertices in the coordinate plane. */
function shapeFigure(names: readonly string[], pts: readonly Point[], en: string, zh: string, extra: readonly PlaneMark[] = []): Figure {
  const c: Point = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const marks: PlaneMark[] = [...extra];
  const sides = pts.length === 2 ? 1 : pts.length;
  for (let i = 0; i < sides; i++) marks.push({ kind: "segment", a: pts[i]!, b: pts[(i + 1) % pts.length]!, accent: true });
  pts.forEach((p, i) => {
    marks.push({ kind: "point", at: p, label: names[i]!, dir: away(p, c) });
  });
  return { svg: plane(fitView(pts), marks), alt: t(en, zh) };
}

/** listPts writes named points for alt text: "A(1, 2), B(3, 4)". */
const listPts = (names: readonly string[], pts: readonly Point[]) => pts.map((p, i) => `${names[i]}${plainPt(p)}`).join(", ");

/** listTex writes named points in LaTeX for a prompt: "$A(1, 2)$, $B(3, 4)$ and $C(5, 6)$". */
function listTex(names: readonly string[], pts: readonly Point[], and: string): string {
  const items = pts.map((p, i) => `$${pt(names[i]!, p)}$`);
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

/** listZh writes named points in LaTeX for a Chinese prompt: "$A(1, 2)$、$B(3, 4)$、$C(5, 6)$". */
const listZh = (names: readonly string[], pts: readonly Point[]) => pts.map((p, i) => `$${pt(names[i]!, p)}$`).join("、");

/** triples are the legs and hypotenuses of small Pythagorean triangles. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
];

/** smallTriples are the triples that keep a figure small. */
const smallTriples = triples.slice(0, 4);

/** radicalSum writes a sum of square roots √n in simplest radical form, combining like radicals: "5 + 2\sqrt{2} + \sqrt{13}". */
function radicalSum(ns: readonly number[]): string {
  const byRadicand = new Map<number, number>();
  for (const n of ns) {
    const [k, m] = simplifyRadical(n);
    byRadicand.set(m, (byRadicand.get(m) ?? 0) + k);
  }
  return [...byRadicand.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([m, k]) => radical(k, m))
    .join(" + ");
}

/** flip reflects the offset (x, y) across the axes by the signs sx and sy and moves it to o. */
const flip =
  (o: Point, sx: number, sy: number) =>
  (p: Point): Point => [o[0] + sx * p[0], o[1] + sy * p[1]];

const half = (n: number) => Q.of(n, 2);

// ---------------------------------------------------------------------------
// Equations of parallel and perpendicular lines
// ---------------------------------------------------------------------------

/** lineOf draws the whole line of slope m through p, as the given line or, in the result color, as the answer. */
const lineOf = (p: Point, m: Q, answer = false): PlaneMark =>
  answer ? { kind: "line", a: p, b: riseOf(p, m), tone: "result" } : { kind: "line", a: p, b: riseOf(p, m), accent: true };

/** uprightOf draws the vertical line x = c or the horizontal line y = c, as the given line or as the answer. */
const uprightOf = (vertical: boolean, c: number, answer = false): PlaneMark => ({
  kind: "line",
  a: vertical ? [c, 0] : [0, c],
  b: vertical ? [c, 1] : [1, c],
  ...(answer ? { tone: "result" as const } : { accent: true }),
});

/** squareCorner draws the small square that marks a right angle at p between the directions u and v. */
function squareCorner(p: Point, u: Point, v: Point, size: number): PlaneMark {
  const [lu, lv] = [Math.hypot(u[0], u[1]), Math.hypot(v[0], v[1])];
  const a: Point = [p[0] + (u[0] / lu) * size, p[1] + (u[1] / lu) * size];
  const b: Point = [p[0] + (v[0] / lv) * size, p[1] + (v[1] / lv) * size];
  return { kind: "path", points: [a, [a[0] + b[0] - p[0], a[1] + b[1] - p[1]], b] };
}

/** cornerSize is the side of a right-angle mark that reads well in a view. */
const cornerSize = (v: PlaneView) => Math.max(v.xMax - v.xMin, v.yMax - v.yMin) / 22;

/** meet is the point where the lines y = m1·x + b1 and y = m2·x + b2 of different slopes cross. */
function meet(m1: Q, b1: Q, m2: Q, b2: Q): Point {
  const x = b2.sub(b1).div(m1.sub(m2));
  return [x.toNumber(), m1.mul(x).add(b1).toNumber()];
}

/** onLine writes the substitution of (h, k) into y − k = m(x − h): both sides are 0. */
function onLine(m: Q, h: number, k: number): Text {
  return t(
    `put $x = ${h}$ and $y = ${k}$ into $${ps(m, h, k)}$: the left side is $${k} - ${paren(k)} = 0$ and the right side is $${num(m)}(${h} - ${paren(h)}) = 0$, so the line passes through $${pointLatex([h, k])}$`,
    `把 $x = ${h}$，$y = ${k}$ 代入 $${ps(m, h, k)}$：左边 $${k} - ${paren(k)} = 0$，右边 $${num(m)}(${h} - ${paren(h)}) = 0$，所以直线经过 $${pointLatex([h, k])}$`,
  );
}

/** psWork writes the point-slope form through (h, k) with slope m, first as substituted when a sign flips. */
function psWork(m: Q, h: number, k: number): Text {
  const raw = `y - ${paren(k)} = ${num(m)}(x - ${paren(h)})`;
  const answer = ps(m, h, k);
  if (h >= 0 && k >= 0) return t(steps(answer), steps(answer));
  return t(
    `${steps(raw)}Subtracting a negative number is adding its opposite:${steps(answer)}`,
    `${steps(raw)}减去一个负数等于加上它的相反数：${steps(answer)}`,
  );
}

/** solveForY writes y − k = m(x − h) solved for y: distribute the slope, then move k to the right side. */
function solveForY(m: Q, h: number, k: number): string {
  const b = interceptThrough(m, h, k);
  return steps(...[ps(m, h, k), `${linear(1, -k, "y")} = ${linear(m, m.mul(Q.of(-h)))}`, si(m, b)].filter((l, i, all) => l !== all[i - 1]));
}

/** toStandard writes how y = mx + b becomes Ax + By = C: the x-term moves left, then both sides are scaled to integers with A > 0. */
function toStandard(m: Q, b: Q): Text {
  const [, B] = standardOf(m.neg(), 1, b);
  const moved = `${poly([m.neg(), "x"], [1, "y"])} = ${num(b)}`;
  const move = t(
    `Bring the $x$-term to the left side by ${m.sign() > 0 ? "subtracting" : "adding"} $${poly([m.abs(), "x"])}$ on both sides:${steps(moved)}`,
    `两边同时${m.sign() > 0 ? "减去" : "加上"} $${poly([m.abs(), "x"])}$，把含 $x$ 的项移到左边：${steps(moved)}`,
  );
  if (B === 1) return move;
  const why =
    B === -1
      ? t("so that the coefficient of $x$ is positive", "使 $x$ 的系数为正")
      : B < 0
        ? t("to clear the fractions and make the coefficient of $x$ positive", "去分母并使 $x$ 的系数为正")
        : t("to clear the fractions", "去分母");
  const answer = stdOfLine(m, b);
  return t(
    `${move.en}Multiply both sides by $${B}$ ${why.en}:${steps(answer)}`,
    `${move["zh-CN"]}两边同乘 $${B}$，${why["zh-CN"]}：${steps(answer)}`,
  );
}

/** stdCheck writes the check that (h, k) satisfies the standard form of y = mx + b, and that the slope read from it is s. */
function stdCheck(m: Q, b: Q, h: number, k: number): Text {
  const [A, B, C] = standardOf(m.neg(), 1, b);
  const sub = `${A} \\cdot ${paren(h)} ${B < 0 ? "-" : "+"} ${Math.abs(B)} \\cdot ${paren(k)} = ${A * h + B * k}`;
  const slope = Math.abs(B) === 1 ? num(m) : chain(B < 0 ? `\\frac{${A}}{${-B}}` : `-\\frac{${A}}{${B}}`, num(m));
  return t(
    `**Check.** Put the point in: $${sub}$, which is $C = ${C}$. The slope of $Ax + By = C$ is $-\\frac{A}{B}$, here $${slope}$.`,
    `**检验。** 代入这个点：$${sub}$，正是 $C = ${C}$。$Ax + By = C$ 的斜率是 $-\\frac{A}{B}$，这里是 $${slope}$。`,
  );
}

/** linesFigure draws the given line through g and g2 and the answer line through p and p2, each with the run and the rise between its two points, and the point p. */
function linesFigure(
  given: readonly [Point, Point],
  answer: readonly [Point, Point],
  en: string,
  zh: string,
  more: readonly PlaneMark[] = [],
  extra: readonly Point[] = [],
): Figure {
  const [g, g2] = given;
  const [p, p2] = answer;
  return graphFigure(
    fitView([g, g2, p, p2, ...extra]),
    [
      { kind: "line", a: g, b: g2, accent: true },
      { kind: "line", a: p, b: p2, tone: "result" },
      ...riseRun(g, g2),
      ...riseRun(p, p2),
      ...more,
      { kind: "point", at: p, label: plainPt(p), dir: away(p, p2) },
    ],
    en,
    zh,
  );
}

/** perpendicularFigure draws the line of slope m through g, the answer of slope −1/m through p, their slope triangles and the right angle where they meet. */
function perpendicularFigure(g: Point, m: Q, p: Point, en: string, zh: string, more: readonly PlaneMark[] = []): Figure {
  const s = Q.one.div(m).neg();
  const b1 = interceptThrough(m, g[0], g[1]);
  const b2 = interceptThrough(s, p[0], p[1]);
  const f = meet(m, b1, s, b2);
  const view = fitView([g, riseOf(g, m), p, riseOf(p, s), f]);
  const corner = squareCorner(f, [Number(m.d), Number(m.n)], [Number(s.d), Number(s.n)], cornerSize(view));
  return linesFigure([g, riseOf(g, m)], [p, riseOf(p, s)], en, zh, [corner, ...more], [f]);
}

/** uprightFigure draws a given vertical or horizontal line, the answer line through p, the right angle where they meet when they are perpendicular, and p. */
function uprightFigure(givenVertical: boolean, c: number, answerVertical: boolean, p: Point, en: string, zh: string): Figure {
  const f: Point = givenVertical ? [c, p[1]] : [p[0], c];
  const view = fitView([p, f]);
  const marks: PlaneMark[] = [uprightOf(givenVertical, c), uprightOf(answerVertical, answerVertical ? p[0] : p[1], true)];
  if (givenVertical !== answerVertical) {
    const toward: Point = [p[0] - f[0], p[1] - f[1]];
    const v: Point = toward[0] === 0 && toward[1] === 0 ? (answerVertical ? [0, 1] : [1, 0]) : toward;
    marks.push(squareCorner(f, givenVertical ? [0, 1] : [1, 0], v, cornerSize(view)));
  }
  marks.push({ kind: "point", at: p, label: plainPt(p), dir: "ne" });
  return graphFigure(view, marks, en, zh);
}

/** findingEquationsOfParallelLines writes equations of parallel lines in every form, including horizontal and vertical lines. */
export const findingEquationsOfParallelLines: TopicDef = {
  id: "finding-equations-of-parallel-lines",
  title: t("Finding Equations of Parallel Lines", "求平行线的方程"),
  summary: t(
    "Write the equation of a line through a point parallel to a given line, in point-slope or standard form, including horizontal and vertical lines.",
    "写出过一点且与已知直线平行的直线方程，用点斜式或标准式表示，包括水平和竖直的直线。",
  ),
  prerequisites: ["parallel-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "parallel-lines-in-the-coordinate-plane", weight: 0.5 },
    { topic: "point-slope-form", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.5"],
  intro: t(
    `Two lines in the plane are **parallel** when they never meet. The direction of a slanted line is its slope, the rise for each step of run, so two lines that never meet must climb at the same rate: if one were steeper, it would sooner or later catch up with the other and cross it. Parallel lines have **equal slopes**, and lines with equal slopes are parallel (or the same line).

That is all it takes to write a parallel line. Take the line $y = -3x + 2$ and the point $(2, 1)$, which is not on it. The parallel line through $(2, 1)$ has the same slope $-3$, so in point-slope form it is

$$y - 1 = -3(x - 2).$$

{{figure 0}}

Both lines have the same slope triangle, a run of $1$ and a fall of $3$, but they cross the $y$-axis at different heights: expanding the new equation gives $y = -3x + 7$, with $y$-intercept $7$ instead of $2$. Only the slope carries over from the given line; the point fixes where the new line lies.

In this lesson we read the slope of the given line whatever form it is written in, write the parallel line in point-slope, slope-intercept and standard form, and treat vertical lines, which have no slope, on their own.`,
    `平面上两条永不相交的直线叫作**平行线**。斜线的方向由斜率决定，也就是每向右走一步上升多少。两条永不相交的直线必须以同样的速度上升：如果其中一条更陡，它迟早会追上另一条并与之相交。所以平行线的**斜率相等**；反过来，斜率相等的两条直线平行（或者重合）。

有了这一点，写平行线就很容易了。取直线 $y = -3x + 2$ 和不在它上面的点 $(2, 1)$。过 $(2, 1)$ 的平行线斜率也是 $-3$，用点斜式写出就是

$$y - 1 = -3(x - 2).$$

{{figure 0}}

两条直线的斜率三角形一样：向右 $1$，下降 $3$；但它们与 $y$ 轴交在不同的高度：把新方程展开得 $y = -3x + 7$，$y$ 轴截距是 $7$ 而不是 $2$。从已知直线继承下来的只有斜率，新直线的位置由那个点决定。

这节课我们会从各种形式的方程中读出已知直线的斜率，用点斜式、斜截式和标准式写出平行线，并单独处理没有斜率的竖直直线。`,
  ),
  introFigures: [
    linesFigure(
      [
        [0, 2],
        [1, -1],
      ],
      [
        [2, 1],
        [3, -2],
      ],
      "The line y = −3x + 2 and the parallel line through (2, 1), y = −3x + 7, each with a run of 1 and a fall of 3.",
      "直线 y = −3x + 2 和过 (2, 1) 的平行线 y = −3x + 7，两者都是向右 1、下降 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "parallel-line-in-point-slope-form",
      figure: geometryDrawings2["finding-equations-of-parallel-lines#parallel-line-in-point-slope-form"],
      title: t("A parallel line in point-slope form", "用点斜式写平行线"),
      explanation: t(
        `A line parallel to a given line has the **same slope**. So the work has two parts: read the slope $m$ off the given equation, then put it with the new point $(h, k)$ into point-slope form, $y - k = m(x - h)$.

The slope can be read directly only from slope-intercept form, where it is the coefficient of $x$; an equation in standard form is solved for $y$ first. For the line through $(-2, 5)$ parallel to $3x - 6y = 4$:

$$-6y = -3x + 4 \\qquad\\Rightarrow\\qquad y = \\frac{1}{2}x - \\frac{2}{3},$$

so the slope is $\\frac{1}{2}$. With $h = -2$ and $k = 5$, the parallel line is

$$y - 5 = \\frac{1}{2}(x + 2).$$

The constant $-\\frac{2}{3}$ of the given line plays no part: it tells where that line crosses the $y$-axis, and the new line crosses somewhere else.

> **Watch out.** Keep the slope exactly as it is. Its opposite, $-\\frac{1}{2}$, gives a line that falls where the other rises, and its negative reciprocal, $-2$, gives a perpendicular line. Then subtract the point's coordinates, each with its own variable: $(-2, 5)$ gives $y - 5$ and $x + 2$, not $y + 5$ and $x - 2$, and not $y + 2$ and $x - 5$.`,
        `与已知直线平行的直线**斜率相同**。所以分两步：从已知方程读出斜率 $m$，再把它和新的点 $(h, k)$ 一起代入点斜式 $y - k = m(x - h)$。

只有斜截式能直接读出斜率（$x$ 的系数）；标准式的方程要先解出 $y$。求过 $(-2, 5)$ 且与 $3x - 6y = 4$ 平行的直线：

$$-6y = -3x + 4 \\qquad\\Rightarrow\\qquad y = \\frac{1}{2}x - \\frac{2}{3},$$

所以斜率是 $\\frac{1}{2}$。取 $h = -2$，$k = 5$，平行线是

$$y - 5 = \\frac{1}{2}(x + 2).$$

已知直线的常数项 $-\\frac{2}{3}$ 在这里用不上：它说明那条直线与 $y$ 轴交在哪里，而新直线交在别处。

> **注意。** 斜率要原样保留。取相反数 $-\\frac{1}{2}$，得到的直线一条上升一条下降；取负倒数 $-2$，得到的是垂线。然后减去点的坐标，并且各配各的变量：$(-2, 5)$ 给出 $y - 5$ 和 $x + 2$，不是 $y + 5$ 和 $x - 2$，也不是 $y + 2$ 和 $x - 5$。`,
      ),
      keyPrerequisites: ["point-slope-form"],
      generate(rng) {
        const m = pickSlope(rng);
        const b0 = Q.of(rng.int(-8, 8));
        const standard = rng.bool(0.6);
        const [h, k] = pointOff(rng, m, b0);
        const given = lineIn(m, b0, standard);
        const answer = ps(m, h, k);
        const perp = Q.one.div(m).neg();
        const reason = slopeOf(m, b0, standard);
        const work = psWork(m, h, k);
        const check = onLine(m, h, k);
        const g: Point = [0, b0.toNumber()];
        return {
          ...equationProblem({
            prompt: t(
              `Write in point-slope form the equation of the line through $${pointLatex([h, k])}$ parallel to $${given}$.`,
              `用点斜式写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 平行的直线方程。`,
            ),
            answer,
            form: "point-slope",
            wrong: [ps(m.neg(), h, k), ps(perp, h, k), ps(m, -h, -k), ps(m, k, h)],
            solution: t(
              `${stepLabel(1, "The slope of the given line", "已知直线的斜率").en} ${reason.en}

${stepLabel(2, "The parallel line", "平行线").en} A parallel line has the same slope, $m = ${num(m)}$. The point gives $x_1 = ${h}$ and $y_1 = ${k}$; put them into $y - y_1 = m(x - x_1)$:${work.en}Both lines have the same slope triangle, so they never meet:

{{figure 0}}

**Check.** To be sure the line goes through the point, ${check.en}. Its slope $${num(m)}$ is the slope of the given line.`,
              `${stepLabel(1, "The slope of the given line", "已知直线的斜率")["zh-CN"]}${reason["zh-CN"]}

${stepLabel(2, "The parallel line", "平行线")["zh-CN"]}平行线的斜率相同，$m = ${num(m)}$。由点得 $x_1 = ${h}$，$y_1 = ${k}$，代入 $y - y_1 = m(x - x_1)$：${work["zh-CN"]}两条直线的斜率三角形相同，所以永不相交：

{{figure 0}}

**检验。** 确认直线经过这个点：${check["zh-CN"]}。它的斜率 $${num(m)}$ 正是已知直线的斜率。`,
            ),
          }),
          solutionFigures: [
            linesFigure(
              [g, riseOf(g, m)],
              [[h, k], riseOf([h, k], m)],
              `The given line through ${plainPt(g)} and the parallel line through ${plainPt([h, k])}, both of slope ${plain(m)}.`,
              `已知直线过 ${plainPt(g)}，平行线过 ${plainPt([h, k])}，斜率都是 ${plain(m)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "parallel-line-in-standard-form",
      figure: geometryDrawings2["finding-equations-of-parallel-lines#parallel-line-in-standard-form"],
      title: t("A parallel line in standard form", "用标准式写平行线"),
      explanation: t(
        `Standard form $Ax + By = C$ hides the slope, so the line is built in a form that shows it and rewritten at the end:

1. Write the parallel line in point-slope form, with the slope of the given line and the new point.
2. Solve for $y$: distribute the slope, then move the constant.
3. Bring the $x$-term to the left side, and multiply both sides by the number that makes $A$, $B$ and $C$ integers without a common factor, with $A > 0$.

The line through $(4, 1)$ parallel to $y = -\\frac{2}{3}x + 5$ has slope $-\\frac{2}{3}$:

$$y - 1 = -\\frac{2}{3}(x - 4) \\;\\Rightarrow\\; y = -\\frac{2}{3}x + \\frac{11}{3} \\;\\Rightarrow\\; \\frac{2}{3}x + y = \\frac{11}{3} \\;\\Rightarrow\\; 2x + 3y = 11.$$

Multiplying by $3$ in the last step changes how the equation looks, not which points satisfy it. The result keeps the left side of the given line up to a multiple, $2x + 3y$, and changes only $C$: that is what parallel lines look like in standard form.

> **Watch out.** The answer is a new line. If you end with the given equation, or a multiple of it, the old $y$-intercept was kept instead of the new point being used. And when you move the constant, $y - 1 = \\dots$ becomes $y = \\dots + 1$: the sign changes as the term crosses the equals sign.`,
        `标准式 $Ax + By = C$ 看不出斜率，所以先用能看出斜率的形式写出直线，最后再改写：

1. 用已知直线的斜率和新的点写出平行线的点斜式。
2. 解出 $y$：用分配律展开，再移常数项。
3. 把含 $x$ 的项移到左边，两边同乘一个数，使 $A$、$B$、$C$ 是没有公因数的整数，且 $A > 0$。

过 $(4, 1)$ 且与 $y = -\\frac{2}{3}x + 5$ 平行的直线斜率是 $-\\frac{2}{3}$：

$$y - 1 = -\\frac{2}{3}(x - 4) \\;\\Rightarrow\\; y = -\\frac{2}{3}x + \\frac{11}{3} \\;\\Rightarrow\\; \\frac{2}{3}x + y = \\frac{11}{3} \\;\\Rightarrow\\; 2x + 3y = 11.$$

最后一步两边乘 $3$，只改变方程的样子，不改变哪些点满足它。结果的左边 $2x + 3y$ 与已知直线的左边成倍数关系，只有 $C$ 变了：这就是平行线在标准式中的样子。

> **注意。** 答案是一条新的直线。如果最后得到的是已知方程或它的倍数，说明你沿用了原来的 $y$ 轴截距，没有用新的点。移常数项时，$y - 1 = \\dots$ 变成 $y = \\dots + 1$：项越过等号要变号。`,
      ),
      keyPrerequisites: ["standard-form"],
      generate(rng) {
        const m = pickSlope(rng);
        const b0 = Q.of(rng.int(-8, 8));
        const standard = rng.bool();
        const [h, k] = pointOff(rng, m, b0);
        const given = lineIn(m, b0, standard);
        const b = interceptThrough(m, h, k);
        const answer = stdOfLine(m, b);
        const perp = Q.one.div(m).neg();
        const reason = slopeOf(m, b0, standard);
        const rewrite = toStandard(m, b);
        const check = stdCheck(m, b, h, k);
        const g: Point = [0, b0.toNumber()];
        return {
          ...equationProblem({
            prompt: t(
              `Write in standard form $Ax + By = C$ the equation of the line through $${pointLatex([h, k])}$ parallel to $${given}$.`,
              `用标准式 $Ax + By = C$ 写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 平行的直线方程。`,
            ),
            answer,
            form: "standard",
            wrong: [
              stdOfLine(m, b0),
              stdOfLine(m.neg(), interceptThrough(m.neg(), h, k)),
              stdOfLine(perp, interceptThrough(perp, h, k)),
              stdOfLine(m, Q.of(k).add(m.mul(Q.of(h)))),
            ],
            solution: t(
              `${stepLabel(1, "The slope", "斜率").en} ${reason.en}

${stepLabel(2, "Point-slope form, solved for y", "点斜式，解出 y").en} The parallel line has the same slope and passes through $${pointLatex([h, k])}$. Distribute the slope and move the constant to the right side:${solveForY(m, h, k)}{{figure 0}}

${stepLabel(3, "Standard form", "标准式").en} ${rewrite.en}${check.en}`,
              `${stepLabel(1, "The slope", "斜率")["zh-CN"]}${reason["zh-CN"]}

${stepLabel(2, "Point-slope form, solved for y", "点斜式，解出 y")["zh-CN"]}平行线斜率相同，并且经过 $${pointLatex([h, k])}$。用分配律展开，再把常数项移到右边：${solveForY(m, h, k)}{{figure 0}}

${stepLabel(3, "Standard form", "标准式")["zh-CN"]}${rewrite["zh-CN"]}${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            linesFigure(
              [g, riseOf(g, m)],
              [[h, k], riseOf([h, k], m)],
              `The given line and the parallel line through ${plainPt([h, k])}, both of slope ${plain(m)}, with y-intercepts ${plain(b0)} and ${plain(b)}.`,
              `已知直线和过 ${plainPt([h, k])} 的平行线，斜率都是 ${plain(m)}，y 轴截距分别是 ${plain(b0)} 和 ${plain(b)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "parallel-to-a-line-through-two-points",
      figure: geometryDrawings2["finding-equations-of-parallel-lines#parallel-to-a-line-through-two-points"],
      title: t("Parallel to a line through two points", "与过两点的直线平行"),
      explanation: t(
        `When the given line is described by two of its points, its slope comes from the slope formula, rise over run between them. The parallel line has that slope too, and its $y$-intercept $b$ comes from substituting the new point into $y = mx + b$.

The line through $A(1, -2)$ and $B(5, 4)$ rises $4 - (-2) = 6$ over a run of $5 - 1 = 4$, so its slope is $\\frac{6}{4} = \\frac{3}{2}$. For the parallel line through $(2, 7)$, put $x = 2$ and $y = 7$ into $y = \\frac{3}{2}x + b$:

$$7 = \\frac{3}{2} \\cdot 2 + b = 3 + b \\;\\Rightarrow\\; b = 4, \\qquad y = \\frac{3}{2}x + 4.$$

The points $A$ and $B$ are used only for the slope; they are not on the new line.

> **Watch out.** The slope is rise over run, $\\frac{y_2 - y_1}{x_2 - x_1}$: run over rise, $\\frac{4}{6}$, is a different slope. And find $b$ from the new point: the line through $A$ and $B$ themselves, $y = \\frac{3}{2}x - \\frac{7}{2}$, is the given line, not a parallel one. In $7 = 3 + b$, subtract $3$, so $b = 7 - 3$, not $7 + 3$.`,
        `如果已知直线由它上面的两点给出，就用斜率公式求斜率，也就是两点间的竖直变化除以水平变化。平行线的斜率也是它，而 $y$ 轴截距 $b$ 由把新的点代入 $y = mx + b$ 求得。

过 $A(1, -2)$ 和 $B(5, 4)$ 的直线，水平变化 $5 - 1 = 4$ 时上升 $4 - (-2) = 6$，所以斜率是 $\\frac{6}{4} = \\frac{3}{2}$。求过 $(2, 7)$ 的平行线，把 $x = 2$，$y = 7$ 代入 $y = \\frac{3}{2}x + b$：

$$7 = \\frac{3}{2} \\cdot 2 + b = 3 + b \\;\\Rightarrow\\; b = 4, \\qquad y = \\frac{3}{2}x + 4.$$

点 $A$、$B$ 只用来求斜率，它们不在新直线上。

> **注意。** 斜率是竖直变化除以水平变化 $\\frac{y_2 - y_1}{x_2 - x_1}$；反过来的 $\\frac{4}{6}$ 是另一个斜率。$b$ 要用新的点来求：过 $A$、$B$ 本身的直线 $y = \\frac{3}{2}x - \\frac{7}{2}$ 就是已知直线，不是它的平行线。在 $7 = 3 + b$ 中要减去 $3$，所以 $b = 7 - 3$，不是 $7 + 3$。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        let dx: number;
        let dy: number;
        do {
          dx = rng.nonZero(-6, 6);
          dy = rng.nonZero(-6, 6);
        } while (Math.abs(dx) === Math.abs(dy));
        const A: Point = [rng.int(-6, 4), rng.int(-6, 4)];
        const B: Point = [A[0] + dx, A[1] + dy];
        const m = Q.of(dy, dx);
        const b0 = interceptThrough(m, A[0], A[1]);
        const [h, k] = pointOff(rng, m, b0, 7);
        const b = interceptThrough(m, h, k);
        const answer = si(m, b);
        const inv = Q.of(dx, dy);
        const perp = inv.neg();
        const slope = chain(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}}`, `\\frac{${dy}}{${dx}}`, num(m));
        const mh = m.mul(Q.of(h));
        const find = steps(
          `${k} = ${evalAt(m, h, 0)} + b`,
          ...(h === 0 ? [] : [`${k} = ${num(mh)} + b`]),
          `b = ${k} - ${paren(mh)} = ${num(b)}`,
        );
        return {
          ...equationProblem({
            prompt: t(
              `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ parallel to the line through $${pt("A", A)}$ and $${pt("B", B)}$.`,
              `用斜截式写出过点 $${pointLatex([h, k])}$ 且与过 $${pt("A", A)}$、$${pt("B", B)}$ 的直线平行的直线方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [
              si(inv, interceptThrough(inv, h, k)),
              si(perp, interceptThrough(perp, h, k)),
              si(m, b0),
              si(m, Q.of(k).add(m.mul(Q.of(h)))),
            ],
            solution: t(
              `${stepLabel(1, "The slope of AB", "AB 的斜率").en} From $A$ to $B$ the run is $${dx}$ and the rise is $${dy}$:${steps(slope)}${stepLabel(2, "The y-intercept", "y 轴截距").en} The parallel line has the same slope, so it is $y = ${num(m)}x + b$. It passes through $${pointLatex([h, k])}$; substitute $x = ${h}$ and $y = ${k}$ to find $b$:${find}So the line is $${answer}$. It moves by the same steps as $AB$:

{{figure 0}}

**Check.** At $x = ${h}$ the line gives $y = ${evalAt(m, h, b)} = ${k}$, the $y$-coordinate of the point.`,
              `${stepLabel(1, "The slope of AB", "AB 的斜率")["zh-CN"]}从 $A$ 到 $B$，水平变化 $${dx}$，竖直变化 $${dy}$：${steps(slope)}${stepLabel(2, "The y-intercept", "y 轴截距")["zh-CN"]}平行线斜率相同，所以它是 $y = ${num(m)}x + b$。它经过 $${pointLatex([h, k])}$，代入 $x = ${h}$，$y = ${k}$ 求 $b$：${find}所以直线是 $${answer}$。它与 $AB$ 按同样的步子移动：

{{figure 0}}

**检验。** 当 $x = ${h}$ 时，直线给出 $y = ${evalAt(m, h, b)} = ${k}$，正是这个点的纵坐标。`,
            ),
          }),
          solutionFigures: [
            linesFigure(
              [A, B],
              [
                [h, k],
                [h + dx, k + dy],
              ],
              `Line AB through ${plainPt(A)} and ${plainPt(B)}, and the parallel line through ${plainPt([h, k])}, each with a run of ${dx} and a rise of ${dy}.`,
              `过 ${plainPt(A)} 和 ${plainPt(B)} 的直线 AB，以及过 ${plainPt([h, k])} 的平行线，水平变化都是 ${dx}，竖直变化都是 ${dy}。`,
              [
                { kind: "point", at: A, label: "A", dir: away(A, B) },
                { kind: "point", at: B, label: "B", dir: away(B, A) },
              ],
            ),
          ],
        };
      },
    },
    {
      id: "parallel-horizontal-and-vertical-lines",
      figure: geometryDrawings2["finding-equations-of-parallel-lines#parallel-horizontal-and-vertical-lines"],
      title: t("Parallel horizontal and vertical lines", "平行的水平线与竖直线"),
      explanation: t(
        `A vertical line has no slope, since its run is $0$, so equal slopes cannot decide what is parallel to it. Look instead at what stays the same along the line. Every point of the vertical line $x = -1$ has $x$-coordinate $-1$. A line parallel to it is vertical too, and through $(h, k)$ every point has $x$-coordinate $h$: the line is $x = h$. In the same way, along a horizontal line the $y$-coordinate stays the same, so the horizontal line through $(h, k)$ is $y = k$.

The $y$-axis is the vertical line $x = 0$ and the $x$-axis is the horizontal line $y = 0$. So the line through $(3, -4)$ parallel to $x = -1$ is $x = 3$, and the line through $(3, -4)$ parallel to the $x$-axis is $y = -4$.

> **Watch out.** A vertical line is written with $x$, a horizontal line with $y$. The line through $(3, -4)$ parallel to $x = -1$ is $x = 3$, not $y = -4$, which is horizontal. Take the coordinate that matches the letter: $x = 3$ uses the $x$-coordinate $3$, not $-4$.`,
        `竖直直线的水平变化是 $0$，没有斜率，所以不能用“斜率相等”来判断与它平行的直线。换个角度，看沿着直线什么保持不变。竖直直线 $x = -1$ 上每一点的 $x$ 坐标都是 $-1$。与它平行的直线也是竖直的；过 $(h, k)$ 时，它上面每一点的 $x$ 坐标都是 $h$：这条直线是 $x = h$。同样，沿水平直线 $y$ 坐标不变，所以过 $(h, k)$ 的水平直线是 $y = k$。

$y$ 轴就是竖直直线 $x = 0$，$x$ 轴就是水平直线 $y = 0$。所以过 $(3, -4)$ 且与 $x = -1$ 平行的直线是 $x = 3$，过 $(3, -4)$ 且与 $x$ 轴平行的直线是 $y = -4$。

> **注意。** 竖直直线用 $x$ 写，水平直线用 $y$ 写。过 $(3, -4)$ 且与 $x = -1$ 平行的直线是 $x = 3$，不是水平的 $y = -4$。取与字母对应的坐标：$x = 3$ 用的是横坐标 $3$，不是 $-4$。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let h = rng.int(-9, 9);
        let k = rng.int(-9, 9);
        let c = rng.int(-9, 9);
        if (kind === 2 && h === 0) h = 4;
        if (kind === 3 && k === 0) k = -3;
        const own = kind === 0 ? h : k;
        if (c === own) c = own === 9 ? 8 : own + 1;
        const vertical = kind === 0 || kind === 2;
        const at0 = kind >= 2 ? 0 : c;
        const given = [
          t(`$x = ${c}$`, `$x = ${c}$`),
          t(`$y = ${c}$`, `$y = ${c}$`),
          t("the $y$-axis", "$y$ 轴"),
          t("the $x$-axis", "$x$ 轴"),
        ][kind]!;
        const answer = vertical ? `x = ${h}` : `y = ${k}`;
        const own2 = vertical ? h : k;
        const v = vertical ? "x" : "y";
        const first =
          kind >= 2
            ? t(
                `${given.en[0]!.toUpperCase()}${given.en.slice(1)} is the ${vertical ? "vertical" : "horizontal"} line $${v} = 0$: every point of it has $${v}$-coordinate $0$.`,
                `${given["zh-CN"]}就是${vertical ? "竖直" : "水平"}直线 $${v} = 0$：它上面每一点的 $${v}$ 坐标都是 $0$。`,
              )
            : t(
                `Every point of $${v} = ${c}$ has $${v}$-coordinate $${c}$, so it is a ${vertical ? "vertical" : "horizontal"} line.`,
                `$${v} = ${c}$ 上每一点的 $${v}$ 坐标都是 $${c}$，所以它是一条${vertical ? "竖直" : "水平"}直线。`,
              );
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the line through $${pointLatex([h, k])}$ parallel to ${given.en}.`,
              `写出过点 $${pointLatex([h, k])}$ 且与${given["zh-CN"]}平行的直线方程。`,
            ),
            answer,
            wrong: vertical ? [`y = ${k}`, `x = ${k}`, `y = ${h}`] : [`x = ${h}`, `y = ${h}`, `x = ${k}`],
            solution: t(
              `${stepLabel(1, "The given line", "已知直线").en} ${first.en}

${stepLabel(2, "The parallel line", "平行线").en} A line parallel to it is ${vertical ? "vertical" : "horizontal"} too, so its $${v}$-coordinate is the same at every point. Through $${pointLatex([h, k])}$ that coordinate is $${own2}$:${steps(answer)}{{figure 0}}

**Check.** The point $${pointLatex([h, k])}$ has $${v} = ${own2}$, so it lies on $${answer}$; and $${own2} \\ne ${at0}$, so the two lines are different and never meet.`,
              `${stepLabel(1, "The given line", "已知直线")["zh-CN"]}${first["zh-CN"]}

${stepLabel(2, "The parallel line", "平行线")["zh-CN"]}与它平行的直线也是${vertical ? "竖直" : "水平"}的，所以它上面每一点的 $${v}$ 坐标都相同。过 $${pointLatex([h, k])}$ 时，这个坐标是 $${own2}$：${steps(answer)}{{figure 0}}

**检验。** 点 $${pointLatex([h, k])}$ 的 $${v} = ${own2}$，所以在 $${answer}$ 上；又 $${own2} \\ne ${at0}$，两条直线不同，永不相交。`,
            ),
          }),
          solutionFigures: [
            uprightFigure(
              vertical,
              at0,
              vertical,
              [h, k],
              `The given line ${v} = ${at0} and the parallel line ${answer} through ${plainPt([h, k])}.`,
              `已知直线 ${v} = ${at0} 和过 ${plainPt([h, k])} 的平行线 ${answer}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** perpendicularSlope writes how the negative reciprocal of m is found: flip the fraction, change the sign. */
function perpendicularSlope(m: Q): Text {
  const p = Q.one.div(m).neg();
  const flipped = Q.one.div(m);
  return t(
    `A perpendicular line has the negative reciprocal slope: flip $${num(m)}$ to $${num(flipped)}$ and change the sign, which gives $${num(p)}$.`,
    `垂线的斜率是负倒数：把 $${num(m)}$ 取倒数得 $${num(flipped)}$，再改变符号，得到 $${num(p)}$。`,
  );
}

/** productCheck writes that the slopes m and p of perpendicular lines multiply to −1. */
const productCheck = (m: Q, p: Q) => `${num(m)} \\cdot ${paren(p)} = ${num(m.mul(p))}`;

/** findingEquationsOfPerpendicularLines writes equations of perpendicular lines in every form, including horizontal and vertical lines. */
export const findingEquationsOfPerpendicularLines: TopicDef = {
  id: "finding-equations-of-perpendicular-lines",
  title: t("Finding Equations of Perpendicular Lines", "求垂线的方程"),
  summary: t(
    "Write the equation of a line through a point perpendicular to a given line, in point-slope or standard form, including horizontal and vertical lines.",
    "写出过一点且与已知直线垂直的直线方程，用点斜式或标准式表示，包括水平和竖直的直线。",
  ),
  prerequisites: ["perpendicular-lines-in-the-coordinate-plane", "finding-equations-of-parallel-lines"],
  encompasses: [
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.5 },
    { topic: "point-slope-form", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.5"],
  intro: t(
    `A parallel line keeps the slope of the given line. A **perpendicular** line, one that meets it at a right angle, needs a different slope, and a quarter turn shows which. The line $y = \\frac{2}{3}x$ climbs with a run of $3$ and a rise of $2$. Turn the line a quarter turn counterclockwise about the origin: the run of $3$ to the right becomes a climb of $3$, and the rise of $2$ becomes a move of $2$ to the left.

{{figure 0}}

So the turned line has run $-2$ and rise $3$, and its slope is $\\frac{3}{-2} = -\\frac{3}{2}$: the run and the rise traded places, and one of them changed sign. The slope of a perpendicular line is the **negative reciprocal** of the given slope, and the product of the two slopes is $-1$:

$$\\frac{2}{3} \\cdot \\left(-\\frac{3}{2}\\right) = -1.$$

To write a perpendicular line, then, flip the given slope, change its sign, and use point-slope form with the new point, just as for a parallel line. In this lesson we do that in point-slope, standard and slope-intercept form, and treat horizontal and vertical lines, which are perpendicular to each other although a vertical line has no slope.`,
    `平行线沿用已知直线的斜率。**垂线**与已知直线成直角相交，需要另一个斜率；把直线转四分之一圈就能看出是哪个。直线 $y = \\frac{2}{3}x$ 每向右 $3$ 上升 $2$。把它绕原点逆时针转四分之一圈：向右的 $3$ 变成向上的 $3$，向上的 $2$ 变成向左的 $2$。

{{figure 0}}

所以转过之后的直线水平变化 $-2$、竖直变化 $3$，斜率是 $\\frac{3}{-2} = -\\frac{3}{2}$：水平变化与竖直变化交换了位置，其中一个改变了符号。垂线的斜率是已知斜率的**负倒数**，两个斜率的乘积是 $-1$：

$$\\frac{2}{3} \\cdot \\left(-\\frac{3}{2}\\right) = -1.$$

所以写垂线时，把已知斜率取倒数、变号，再和新的点一起代入点斜式，与写平行线一样。这节课我们用点斜式、标准式和斜截式写垂线，并处理水平线与竖直线：竖直直线虽然没有斜率，但它与水平直线互相垂直。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 4, yMin: -1, yMax: 4 },
      [
        { kind: "line", a: [0, 0], b: [3, 2], accent: true },
        { kind: "line", a: [0, 0], b: [-2, 3], tone: "result" },
        ...riseRun([0, 0], [3, 2]),
        ...riseRun([0, 0], [-2, 3]),
        squareCorner([0, 0], [3, 2], [-2, 3], 0.35),
      ],
      "The line y = (2/3)x with a run of 3 and a rise of 2, and the line turned a quarter turn about the origin, with a run of −2 and a rise of 3; they meet at a right angle.",
      "直线 y = (2/3)x，水平变化 3、竖直变化 2；以及绕原点转四分之一圈后的直线，水平变化 −2、竖直变化 3；两线成直角。",
    ),
  ],
  knowledgePoints: [
    {
      id: "perpendicular-line-in-point-slope-form",
      figure: geometryDrawings2["finding-equations-of-perpendicular-lines#perpendicular-line-in-point-slope-form"],
      title: t("A perpendicular line in point-slope form", "用点斜式写垂线"),
      explanation: t(
        `A line perpendicular to a line of slope $m$ has the **negative reciprocal** slope $-\\frac{1}{m}$: flip the fraction, then change its sign. With that slope and the point $(h, k)$, the line is $y - k = -\\frac{1}{m}(x - h)$.

For the line through $(1, -3)$ perpendicular to $2x + 5y = 10$, first solve for $y$ to see the slope:

$$5y = -2x + 10 \\qquad\\Rightarrow\\qquad y = -\\frac{2}{5}x + 2.$$

The slope is $-\\frac{2}{5}$. Flipped it is $-\\frac{5}{2}$, and with the sign changed $\\frac{5}{2}$; indeed $-\\frac{2}{5} \\cdot \\frac{5}{2} = -1$. Through $(1, -3)$:

$$y + 3 = \\frac{5}{2}(x - 1).$$

> **Watch out.** Do both halves of "negative reciprocal". Flipping alone gives $-\\frac{5}{2}$, changing the sign alone gives $\\frac{2}{5}$, and keeping $-\\frac{2}{5}$ gives a parallel line; none of them meets the given line at a right angle. Multiply the two slopes to be sure: perpendicular slopes give $-1$. Then the point $(1, -3)$ is subtracted: $y + 3$ and $x - 1$.`,
        `与斜率为 $m$ 的直线垂直的直线，斜率是**负倒数** $-\\frac{1}{m}$：先取倒数，再改变符号。用这个斜率和点 $(h, k)$，直线就是 $y - k = -\\frac{1}{m}(x - h)$。

求过 $(1, -3)$ 且与 $2x + 5y = 10$ 垂直的直线，先解出 $y$ 看斜率：

$$5y = -2x + 10 \\qquad\\Rightarrow\\qquad y = -\\frac{2}{5}x + 2.$$

斜率是 $-\\frac{2}{5}$。取倒数得 $-\\frac{5}{2}$，再变号得 $\\frac{5}{2}$；确实 $-\\frac{2}{5} \\cdot \\frac{5}{2} = -1$。过 $(1, -3)$：

$$y + 3 = \\frac{5}{2}(x - 1).$$

> **注意。** “负倒数”的两步都要做。只取倒数得 $-\\frac{5}{2}$，只变号得 $\\frac{2}{5}$，保持 $-\\frac{2}{5}$ 不变则得到平行线；它们都不与已知直线成直角。把两个斜率相乘来确认：互相垂直的斜率乘积是 $-1$。然后减去点 $(1, -3)$ 的坐标：$y + 3$ 和 $x - 1$。`,
      ),
      generate(rng) {
        const m = pickSlope(rng);
        const p = Q.one.div(m).neg();
        const b0 = Q.of(rng.int(-8, 8));
        const standard = rng.bool(0.6);
        const h = rng.int(-8, 8);
        const k = rng.int(-8, 8);
        const given = lineIn(m, b0, standard);
        const answer = ps(p, h, k);
        const reason = slopeOf(m, b0, standard);
        const turn = perpendicularSlope(m);
        const work = psWork(p, h, k);
        const check = onLine(p, h, k);
        const g: Point = [0, b0.toNumber()];
        return {
          ...equationProblem({
            prompt: t(
              `Write in point-slope form the equation of the line through $${pointLatex([h, k])}$ perpendicular to $${given}$.`,
              `用点斜式写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 垂直的直线方程。`,
            ),
            answer,
            form: "point-slope",
            wrong: [ps(m, h, k), ps(Q.one.div(m), h, k), ps(m.neg(), h, k), ps(p, -h, -k)],
            solution: t(
              `${stepLabel(1, "The slope of the given line", "已知直线的斜率").en} ${reason.en}

${stepLabel(2, "The perpendicular slope", "垂线的斜率").en} ${turn.en}

${stepLabel(3, "The line", "直线").en} Put $m = ${num(p)}$, $x_1 = ${h}$ and $y_1 = ${k}$ into $y - y_1 = m(x - x_1)$:${work.en}{{figure 0}}

**Check.** The slopes multiply to $-1$, $${productCheck(m, p)}$, so the lines are perpendicular. And ${check.en}.`,
              `${stepLabel(1, "The slope of the given line", "已知直线的斜率")["zh-CN"]}${reason["zh-CN"]}

${stepLabel(2, "The perpendicular slope", "垂线的斜率")["zh-CN"]}${turn["zh-CN"]}

${stepLabel(3, "The line", "直线")["zh-CN"]}把 $m = ${num(p)}$，$x_1 = ${h}$，$y_1 = ${k}$ 代入 $y - y_1 = m(x - x_1)$：${work["zh-CN"]}{{figure 0}}

**检验。** 两个斜率的乘积是 $-1$：$${productCheck(m, p)}$，所以两线垂直。另外，${check["zh-CN"]}。`,
            ),
          }),
          solutionFigures: [
            perpendicularFigure(
              g,
              m,
              [h, k],
              `The given line of slope ${plain(m)} and the perpendicular line through ${plainPt([h, k])} of slope ${plain(p)}, meeting at a right angle.`,
              `斜率为 ${plain(m)} 的已知直线，和过 ${plainPt([h, k])}、斜率为 ${plain(p)} 的垂线，两线成直角。`,
            ),
          ],
        };
      },
    },
    {
      id: "perpendicular-line-in-standard-form",
      figure: geometryDrawings2["finding-equations-of-perpendicular-lines#perpendicular-line-in-standard-form"],
      title: t("A perpendicular line in standard form", "用标准式写垂线"),
      explanation: t(
        `For an answer in standard form, find the perpendicular slope, write the line in point-slope form, solve for $y$, and then rearrange into $Ax + By = C$ with integers without a common factor and $A > 0$. Each step changes only the look of the equation, so the line stays the one through the point with the perpendicular slope.

The line through $(2, 3)$ perpendicular to $y = 4x - 1$: the slope $4$ is $\\frac{4}{1}$, so the negative reciprocal is $-\\frac{1}{4}$, and

$$y - 3 = -\\frac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\frac{1}{4}x + \\frac{7}{2} \\;\\Rightarrow\\; \\frac{1}{4}x + y = \\frac{7}{2} \\;\\Rightarrow\\; x + 4y = 14.$$

The last step multiplies both sides by $4$. Notice how the coefficients of the given line, $-4x + y$, appear swapped and with one sign changed in $x + 4y$: perpendicular lines in standard form look like that.

> **Watch out.** The negative reciprocal of $4$ is $-\\frac{1}{4}$, not $\\frac{1}{4}$ and not $-4$. When $y - 3 = -\\frac{1}{4}(x - 2)$ is distributed, the slope multiplies both terms: $-\\frac{1}{4} \\cdot (-2) = +\\frac{1}{2}$; then $3$ is added, giving $\\frac{7}{2}$. Adding the point's constant with the wrong sign moves the line off the point.`,
        `要用标准式作答，先求垂线的斜率，写出点斜式，解出 $y$，再整理成 $Ax + By = C$，其中系数是没有公因数的整数且 $A > 0$。每一步只改变方程的样子，所以直线始终是过这个点、以垂线斜率倾斜的那条。

过 $(2, 3)$ 且与 $y = 4x - 1$ 垂直的直线：斜率 $4$ 就是 $\\frac{4}{1}$，负倒数是 $-\\frac{1}{4}$，于是

$$y - 3 = -\\frac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\frac{1}{4}x + \\frac{7}{2} \\;\\Rightarrow\\; \\frac{1}{4}x + y = \\frac{7}{2} \\;\\Rightarrow\\; x + 4y = 14.$$

最后一步两边同乘 $4$。注意已知直线的系数 $-4x + y$ 在 $x + 4y$ 中交换了位置，并且有一个变了号：互相垂直的直线在标准式中就是这样。

> **注意。** $4$ 的负倒数是 $-\\frac{1}{4}$，不是 $\\frac{1}{4}$，也不是 $-4$。展开 $y - 3 = -\\frac{1}{4}(x - 2)$ 时，斜率要乘括号里的两项：$-\\frac{1}{4} \\cdot (-2) = +\\frac{1}{2}$；再加上 $3$，得 $\\frac{7}{2}$。点的常数项符号弄错，直线就不再经过这个点。`,
      ),
      keyPrerequisites: ["standard-form"],
      generate(rng) {
        const m = pickSlope(rng);
        const p = Q.one.div(m).neg();
        const b0 = Q.of(rng.int(-8, 8));
        const standard = rng.bool();
        const h = rng.int(-8, 8);
        const k = rng.int(-8, 8);
        const given = lineIn(m, b0, standard);
        const b = interceptThrough(p, h, k);
        const answer = stdOfLine(p, b);
        const inv = Q.one.div(m);
        const reason = slopeOf(m, b0, standard);
        const turn = perpendicularSlope(m);
        const rewrite = toStandard(p, b);
        const check = stdCheck(p, b, h, k);
        const g: Point = [0, b0.toNumber()];
        return {
          ...equationProblem({
            prompt: t(
              `Write in standard form $Ax + By = C$ the equation of the line through $${pointLatex([h, k])}$ perpendicular to $${given}$.`,
              `用标准式 $Ax + By = C$ 写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 垂直的直线方程。`,
            ),
            answer,
            form: "standard",
            wrong: [
              stdOfLine(m, interceptThrough(m, h, k)),
              stdOfLine(inv, interceptThrough(inv, h, k)),
              stdOfLine(p, Q.of(k).add(p.mul(Q.of(h)))),
            ],
            solution: t(
              `${stepLabel(1, "The perpendicular slope", "垂线的斜率").en} ${reason.en} ${turn.en}

${stepLabel(2, "Point-slope form, solved for y", "点斜式，解出 y").en} Through $${pointLatex([h, k])}$ with slope $${num(p)}$; distribute the slope and move the constant to the right side:${solveForY(p, h, k)}{{figure 0}}

${stepLabel(3, "Standard form", "标准式").en} ${rewrite.en}${check.en} It is perpendicular to the given line: $${productCheck(m, p)}$.`,
              `${stepLabel(1, "The perpendicular slope", "垂线的斜率")["zh-CN"]}${reason["zh-CN"]}${turn["zh-CN"]}

${stepLabel(2, "Point-slope form, solved for y", "点斜式，解出 y")["zh-CN"]}过 $${pointLatex([h, k])}$、斜率为 $${num(p)}$；用分配律展开，再把常数项移到右边：${solveForY(p, h, k)}{{figure 0}}

${stepLabel(3, "Standard form", "标准式")["zh-CN"]}${rewrite["zh-CN"]}${check["zh-CN"]}它与已知直线垂直：$${productCheck(m, p)}$。`,
            ),
          }),
          solutionFigures: [
            perpendicularFigure(
              g,
              m,
              [h, k],
              `The given line of slope ${plain(m)} and the perpendicular line through ${plainPt([h, k])} of slope ${plain(p)}.`,
              `斜率为 ${plain(m)} 的已知直线，和过 ${plainPt([h, k])}、斜率为 ${plain(p)} 的垂线。`,
            ),
          ],
        };
      },
    },
    {
      id: "perpendicular-to-a-line-through-two-points",
      figure: coordinateDrawings["perpendicular-to-a-line-through-two-points"],
      title: t("Perpendicular to a line through two points", "与过两点的直线垂直"),
      explanation: t(
        `When the given line is described by two points, there are three steps: its slope from the slope formula, the negative reciprocal of that slope, and the $y$-intercept from substituting the new point into $y = mx + b$.

The line through $A(-1, 2)$ and $B(3, 4)$ rises $4 - 2 = 2$ over a run of $3 - (-1) = 4$, so its slope is $\\frac{2}{4} = \\frac{1}{2}$. Flipping gives $2$ and changing the sign $-2$. Through $(1, 5)$:

$$5 = -2 \\cdot 1 + b \\;\\Rightarrow\\; b = 5 + 2 = 7, \\qquad y = -2x + 7.$$

Turned a quarter turn, the slope triangle of $AB$, a run of $4$ and a rise of $2$, becomes a run of $2$ and a fall of $4$: that is the slope $-2$.

> **Watch out.** The slope of $AB$ is rise over run, $\\frac{2}{4}$, and the perpendicular slope comes from that: flip it and change the sign. Using the slope of $AB$ itself gives a parallel line, and flipping without changing the sign gives a line that is not perpendicular. In $5 = -2 + b$, add $2$ to both sides: $b = 7$, not $3$.`,
        `如果已知直线由两点给出，就分三步：用斜率公式求它的斜率，取这个斜率的负倒数，再把新的点代入 $y = mx + b$ 求截距。

过 $A(-1, 2)$ 和 $B(3, 4)$ 的直线，水平变化 $3 - (-1) = 4$ 时上升 $4 - 2 = 2$，斜率是 $\\frac{2}{4} = \\frac{1}{2}$。取倒数得 $2$，变号得 $-2$。过 $(1, 5)$：

$$5 = -2 \\cdot 1 + b \\;\\Rightarrow\\; b = 5 + 2 = 7, \\qquad y = -2x + 7.$$

把 $AB$ 的斜率三角形（水平变化 $4$、上升 $2$）转四分之一圈，就变成水平变化 $2$、下降 $4$：这正是斜率 $-2$。

> **注意。** $AB$ 的斜率是竖直变化除以水平变化 $\\frac{2}{4}$，垂线的斜率由它得到：取倒数并变号。直接用 $AB$ 的斜率得到的是平行线；只取倒数不变号，得到的直线并不垂直。在 $5 = -2 + b$ 中，两边加 $2$：$b = 7$，不是 $3$。`,
      ),
      generate(rng) {
        let dx: number;
        let dy: number;
        do {
          dx = rng.nonZero(-6, 6);
          dy = rng.nonZero(-6, 6);
        } while (Math.abs(dx) === Math.abs(dy));
        const A: Point = [rng.int(-6, 4), rng.int(-6, 4)];
        const B: Point = [A[0] + dx, A[1] + dy];
        const m = Q.of(dy, dx);
        const p = Q.of(-dx, dy);
        const h = rng.int(-7, 7);
        const k = rng.int(-7, 7);
        const b = interceptThrough(p, h, k);
        const answer = si(p, b);
        const inv = Q.of(dx, dy);
        const slope = chain(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}}`, `\\frac{${dy}}{${dx}}`, num(m));
        const ph = p.mul(Q.of(h));
        const find = steps(
          `${k} = ${evalAt(p, h, 0)} + b`,
          ...(h === 0 ? [] : [`${k} = ${num(ph)} + b`]),
          `b = ${k} - ${paren(ph)} = ${num(b)}`,
        );
        const turn = perpendicularSlope(m);
        return {
          ...equationProblem({
            prompt: t(
              `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ perpendicular to the line through $${pt("A", A)}$ and $${pt("B", B)}$.`,
              `用斜截式写出过点 $${pointLatex([h, k])}$ 且与过 $${pt("A", A)}$、$${pt("B", B)}$ 的直线垂直的直线方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [si(m, interceptThrough(m, h, k)), si(inv, interceptThrough(inv, h, k)), si(p, Q.of(k).add(p.mul(Q.of(h))))],
            solution: t(
              `${stepLabel(1, "The slope of AB", "AB 的斜率").en} From $A$ to $B$ the run is $${dx}$ and the rise is $${dy}$:${steps(slope)}${stepLabel(2, "The perpendicular slope", "垂线的斜率").en} ${turn.en}

${stepLabel(3, "The y-intercept", "y 轴截距").en} The line is $y = ${num(p)}x + b$ and passes through $${pointLatex([h, k])}$:${find}So the line is $${answer}$.

{{figure 0}}

**Check.** The slopes multiply to $-1$, $${productCheck(m, p)}$; and at $x = ${h}$ the line gives $y = ${evalAt(p, h, b)} = ${k}$.`,
              `${stepLabel(1, "The slope of AB", "AB 的斜率")["zh-CN"]}从 $A$ 到 $B$，水平变化 $${dx}$，竖直变化 $${dy}$：${steps(slope)}${stepLabel(2, "The perpendicular slope", "垂线的斜率")["zh-CN"]}${turn["zh-CN"]}

${stepLabel(3, "The y-intercept", "y 轴截距")["zh-CN"]}直线是 $y = ${num(p)}x + b$，并且经过 $${pointLatex([h, k])}$：${find}所以直线是 $${answer}$。

{{figure 0}}

**检验。** 两个斜率的乘积是 $-1$：$${productCheck(m, p)}$；当 $x = ${h}$ 时，直线给出 $y = ${evalAt(p, h, b)} = ${k}$。`,
            ),
          }),
          solutionFigures: [
            perpendicularFigure(
              A,
              m,
              [h, k],
              `Line AB through ${plainPt(A)} and ${plainPt(B)}, of slope ${plain(m)}, and the perpendicular line through ${plainPt([h, k])}, of slope ${plain(p)}.`,
              `过 ${plainPt(A)} 和 ${plainPt(B)}、斜率为 ${plain(m)} 的直线 AB，以及过 ${plainPt([h, k])}、斜率为 ${plain(p)} 的垂线。`,
              [
                { kind: "point", at: A, label: "A", dir: away(A, B) },
                { kind: "point", at: B, label: "B", dir: away(B, A) },
              ],
            ),
          ],
        };
      },
    },
    {
      id: "perpendicular-horizontal-and-vertical-lines",
      figure: coordinateDrawings["perpendicular-horizontal-and-vertical-lines"],
      title: t("Perpendicular horizontal and vertical lines", "互相垂直的水平线与竖直线"),
      explanation: t(
        `The grid lines of the plane meet at right angles, so every horizontal line is perpendicular to every vertical line. The slope rule cannot show this, because a vertical line has no slope; the picture does.

So a line perpendicular to a **vertical** line is horizontal. Along a horizontal line the $y$-coordinate stays the same, so through $(h, k)$ it is $y = k$. A line perpendicular to a **horizontal** line is vertical, and through $(h, k)$ it is $x = h$.

The line through $(-5, 2)$ perpendicular to $x = 4$ is horizontal: $y = 2$. It meets $x = 4$ at $(4, 2)$, at a right angle. The line through $(-5, 2)$ perpendicular to the $x$-axis is vertical: $x = -5$.

> **Watch out.** Perpendicular swaps the direction: perpendicular to $x = 4$, a vertical line, means horizontal, so the answer is written with $y$. Writing $x = -5$ gives a line parallel to $x = 4$. And take the coordinate that matches the letter: $y = 2$ uses the $y$-coordinate of $(-5, 2)$.`,
        `平面上的网格线互相垂直，所以每条水平直线都与每条竖直直线垂直。斜率的规则说明不了这一点，因为竖直直线没有斜率；但图一看便知。

所以与**竖直**直线垂直的直线是水平的。沿水平直线 $y$ 坐标不变，所以过 $(h, k)$ 的这条直线是 $y = k$。与**水平**直线垂直的直线是竖直的，过 $(h, k)$ 时是 $x = h$。

过 $(-5, 2)$ 且与 $x = 4$ 垂直的直线是水平的：$y = 2$。它与 $x = 4$ 交于 $(4, 2)$，成直角。过 $(-5, 2)$ 且与 $x$ 轴垂直的直线是竖直的：$x = -5$。

> **注意。** 垂直会交换方向：与竖直直线 $x = 4$ 垂直，意味着是水平的，所以答案用 $y$ 来写。写成 $x = -5$，得到的是与 $x = 4$ 平行的直线。还要取与字母对应的坐标：$y = 2$ 用的是 $(-5, 2)$ 的纵坐标。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const c = rng.int(-9, 9);
        const at0 = kind >= 2 ? 0 : c;
        const given = [
          t(`$x = ${c}$`, `$x = ${c}$`),
          t(`$y = ${c}$`, `$y = ${c}$`),
          t("the $y$-axis", "$y$ 轴"),
          t("the $x$-axis", "$x$ 轴"),
        ][kind]!;
        const givenVertical = kind === 0 || kind === 2;
        const answer = givenVertical ? `y = ${k}` : `x = ${h}`;
        const [gv, av] = givenVertical ? ["x", "y"] : ["y", "x"];
        const own = givenVertical ? k : h;
        const f: Point = givenVertical ? [at0, k] : [h, at0];
        const first =
          kind >= 2
            ? t(
                `${given.en[0]!.toUpperCase()}${given.en.slice(1)} is the ${givenVertical ? "vertical" : "horizontal"} line $${gv} = 0$.`,
                `${given["zh-CN"]}就是${givenVertical ? "竖直" : "水平"}直线 $${gv} = 0$。`,
              )
            : t(
                `Every point of $${gv} = ${c}$ has $${gv}$-coordinate $${c}$, so it is a ${givenVertical ? "vertical" : "horizontal"} line.`,
                `$${gv} = ${c}$ 上每一点的 $${gv}$ 坐标都是 $${c}$，所以它是一条${givenVertical ? "竖直" : "水平"}直线。`,
              );
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the line through $${pointLatex([h, k])}$ perpendicular to ${given.en}.`,
              `写出过点 $${pointLatex([h, k])}$ 且与${given["zh-CN"]}垂直的直线方程。`,
            ),
            answer,
            wrong: givenVertical ? [`x = ${h}`, `y = ${h}`, `x = ${k}`] : [`y = ${k}`, `x = ${k}`, `y = ${h}`],
            solution: t(
              `${stepLabel(1, "The given line", "已知直线").en} ${first.en}

${stepLabel(2, "The perpendicular line", "垂线").en} A line perpendicular to a ${givenVertical ? "vertical" : "horizontal"} line is ${givenVertical ? "horizontal" : "vertical"}, so its $${av}$-coordinate is the same at every point. Through $${pointLatex([h, k])}$ that coordinate is $${own}$:${steps(answer)}{{figure 0}}

**Check.** The point $${pointLatex([h, k])}$ has $${av} = ${own}$, so it lies on $${answer}$. The two lines cross at $${pointLatex(f)}$, where a ${givenVertical ? "horizontal" : "vertical"} line meets a ${givenVertical ? "vertical" : "horizontal"} one at a right angle.`,
              `${stepLabel(1, "The given line", "已知直线")["zh-CN"]}${first["zh-CN"]}

${stepLabel(2, "The perpendicular line", "垂线")["zh-CN"]}与${givenVertical ? "竖直" : "水平"}直线垂直的直线是${givenVertical ? "水平" : "竖直"}的，所以它上面每一点的 $${av}$ 坐标都相同。过 $${pointLatex([h, k])}$ 时，这个坐标是 $${own}$：${steps(answer)}{{figure 0}}

**检验。** 点 $${pointLatex([h, k])}$ 的 $${av} = ${own}$，所以在 $${answer}$ 上。两条直线交于 $${pointLatex(f)}$，${givenVertical ? "水平线与竖直线" : "竖直线与水平线"}在那里成直角。`,
            ),
          }),
          solutionFigures: [
            uprightFigure(
              givenVertical,
              at0,
              !givenVertical,
              [h, k],
              `The given line ${gv} = ${at0} and the perpendicular line ${answer} through ${plainPt([h, k])}, crossing at ${plainPt(f)}.`,
              `已知直线 ${gv} = ${at0} 和过 ${plainPt([h, k])} 的垂线 ${answer}，交于 ${plainPt(f)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Midpoints and partitions
// ---------------------------------------------------------------------------

/** midpointOf is the midpoint of A and B. */
const midpointOf = (a: Point, b: Point): [Q, Q] => [half(a[0] + b[0]), half(a[1] + b[1])];

/** midpointSteps averages the coordinates of A and B, one step for each coordinate. */
function midpointSteps(a: Point, b: Point): Text {
  const [mx, my] = midpointOf(a, b);
  const x = chain(`x_M = \\frac{${a[0]} + ${paren(b[0])}}{2}`, `\\frac{${a[0] + b[0]}}{2}`, num(mx));
  const y = chain(`y_M = \\frac{${a[1]} + ${paren(b[1])}}{2}`, `\\frac{${a[1] + b[1]}}{2}`, num(my));
  return t(
    `${stepLabel(1, "Average the x-coordinates", "求横坐标的平均数").en}${steps(x)}${stepLabel(2, "Average the y-coordinates", "求纵坐标的平均数").en}${steps(y)}So $M = ${pointLatex([mx, my])}$.`,
    `${stepLabel(1, "Average the x-coordinates", "求横坐标的平均数")["zh-CN"]}${steps(x)}${stepLabel(2, "Average the y-coordinates", "求纵坐标的平均数")["zh-CN"]}${steps(y)}所以 $M = ${pointLatex([mx, my])}$。`,
  );
}

/** halvesCheck writes the check that M is as far from B as from A: both moves change the coordinates by the same amounts. */
function halvesCheck(a: Point, b: Point): Text {
  const [mx, my] = midpointOf(a, b);
  const first = `(${num(mx.sub(Q.of(a[0])))}, ${num(my.sub(Q.of(a[1])))})`;
  const second = `(${num(Q.of(b[0]).sub(mx))}, ${num(Q.of(b[1]).sub(my))})`;
  return t(
    `**Check.** From $A$ to $M$ the coordinates change by $${first}$, and from $M$ to $B$ by $${second}$: the same two moves, so $M$ lies on $\\overline{AB}$ as far from $B$ as from $A$.`,
    `**检验。** 从 $A$ 到 $M$，坐标变化 $${first}$；从 $M$ 到 $B$，坐标变化 $${second}$：两段移动完全相同，所以 $M$ 在 $\\overline{AB}$ 上，到 $A$、$B$ 的距离相等。`,
  );
}

/** legsOf draws the run and the rise from a to b as dashed legs labeled with their lengths, leaving out a leg of length 0. */
function legsOf(a: Point, b: Point): PlaneMark[] {
  const corner: Point = [b[0], a[1]];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const marks: PlaneMark[] = [];
  if (dx !== 0)
    marks.push(
      { kind: "segment", a, b: corner, dashed: true, tone: "action" },
      { kind: "label", at: [(a[0] + b[0]) / 2, a[1]], text: String(Math.abs(dx)), dir: dy >= 0 ? "s" : "n" },
    );
  if (dy !== 0)
    marks.push(
      { kind: "segment", a: corner, b, dashed: true, tone: "action" },
      { kind: "label", at: [b[0], (a[1] + b[1]) / 2], text: String(Math.abs(dy)), dir: dx >= 0 ? "e" : "w" },
    );
  return marks;
}

/** halvesFigure draws AB with the run and the rise from A to its midpoint M and from M to B, and M as the result. */
function halvesFigure(a: Point, b: Point, en: string, zh: string): Figure {
  const m: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return shapeFigure(["A", "B"], [a, b], en, zh, [
    ...legsOf(a, m),
    ...legsOf(m, b),
    { kind: "point", at: m, label: "M", dir: away(m, [m[0] + b[1] - a[1], m[1] - b[0] + a[0]]), tone: "result" },
  ]);
}

/** midpointWrong are the points typical mistakes produce for the midpoint of A and B. */
function midpointWrong(a: Point, b: Point): Coefficient[][] {
  const [mx, my] = midpointOf(a, b);
  return [
    [half(b[0] - a[0]), half(b[1] - a[1])],
    [a[0] + b[0], a[1] + b[1]],
    [my, mx],
  ];
}

/** midpointsInTheCoordinatePlane finds midpoints of segments, and an endpoint from the midpoint. */
export const midpointsInTheCoordinatePlane: TopicDef = {
  id: "midpoints-in-the-coordinate-plane",
  title: t("Midpoints in the Coordinate Plane", "坐标平面中的中点"),
  summary: t(
    "Find the midpoint of a segment from its endpoints or its graph, and a missing endpoint from the midpoint.",
    "由端点坐标或图像求线段的中点，并由中点求未知端点。",
  ),
  prerequisites: ["the-coordinate-plane", "operations-with-rational-numbers"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.GPE.B.6"],
  intro: t(
    `On a number line, the point halfway between $2$ and $8$ is their average, $\\frac{2 + 8}{2} = 5$: it is $3$ from each of them. A segment in the plane can be split in half the same way, one coordinate at a time.

Going from $A(1, 1)$ to $B(7, 5)$ we move $6$ to the right and $4$ up. Halfway along, we have made half of each move, $3$ to the right and $2$ up, which reaches $(4, 3)$. The second half is the same two moves again, and ends at $B$:

{{figure 0}}

The $x$-coordinate $4$ is halfway between $1$ and $7$, the average $\\frac{1 + 7}{2}$, and the $y$-coordinate $3$ is the average $\\frac{1 + 5}{2}$. So the **midpoint** of a segment has as coordinates the averages of the endpoints' coordinates.

In this lesson we find midpoints from the coordinates of the endpoints and from a graph, and work backwards from a midpoint and one endpoint to the other endpoint.`,
    `在数轴上，$2$ 和 $8$ 正中间的点是它们的平均数 $\\frac{2 + 8}{2} = 5$：它到两数的距离都是 $3$。平面上的线段也可以这样对半分，一次处理一个坐标。

从 $A(1, 1)$ 走到 $B(7, 5)$，要向右走 $6$，向上走 $4$。走到一半时，两个方向都只走了一半：向右 $3$，向上 $2$，到达 $(4, 3)$。后一半再重复同样的两步，就到达 $B$：

{{figure 0}}

横坐标 $4$ 在 $1$ 和 $7$ 的正中间，是平均数 $\\frac{1 + 7}{2}$；纵坐标 $3$ 是平均数 $\\frac{1 + 5}{2}$。所以线段**中点**的坐标，就是两个端点坐标的平均数。

这节课我们由端点坐标或图像求中点，并反过来由中点和一个端点求另一个端点。`,
  ),
  introFigures: [
    halvesFigure(
      [1, 1],
      [7, 5],
      "The segment from A(1, 1) to B(7, 5). Its midpoint M(4, 3) is 3 to the right of and 2 above A, and B is 3 to the right of and 2 above M.",
      "从 A(1, 1) 到 B(7, 5) 的线段。中点 M(4, 3) 在 A 右边 3、上方 2 处，B 又在 M 右边 3、上方 2 处。",
    ),
  ],
  knowledgePoints: [
    {
      id: "the-midpoint-formula",
      title: t("The midpoint formula", "中点公式"),
      explanation: t(
        `The **midpoint** $M$ of a segment is the point halfway between its endpoints. Halfway in the plane means halfway in each direction, so each coordinate of $M$ is the average of the endpoints' coordinates: for $A(x_1, y_1)$ and $B(x_2, y_2)$,

$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$

For $A(-3, 4)$ and $B(6, -2)$:

$$x_M = \\frac{-3 + 6}{2} = \\frac{3}{2}, \\qquad y_M = \\frac{4 + (-2)}{2} = 1,$$

so $M = \\left(\\frac{3}{2}, 1\\right)$. A midpoint need not have whole-number coordinates: here $\\frac{3}{2}$ is halfway between $-3$ and $6$, $4\\frac{1}{2}$ from each.

> **Watch out.** Add the coordinates, then halve: $\\frac{x_1 + x_2}{2}$. Halving the difference, $\\frac{6 - (-3)}{2} = \\frac{9}{2}$, gives how far $M$ is from each end across, not where $M$ is. Do not forget to divide by $2$, and keep the order $(x, y)$: the average of the $x$-coordinates comes first.`,
        `线段的**中点** $M$ 是两个端点正中间的点。在平面上“正中间”意味着两个方向都在正中间，所以 $M$ 的每个坐标都是两个端点对应坐标的平均数：对 $A(x_1, y_1)$ 和 $B(x_2, y_2)$，

$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$

对 $A(-3, 4)$ 和 $B(6, -2)$：

$$x_M = \\frac{-3 + 6}{2} = \\frac{3}{2}, \\qquad y_M = \\frac{4 + (-2)}{2} = 1,$$

所以 $M = \\left(\\frac{3}{2}, 1\\right)$。中点的坐标不一定是整数：这里 $\\frac{3}{2}$ 在 $-3$ 和 $6$ 的正中间，到两者都是 $4\\frac{1}{2}$。

> **注意。** 先相加，再除以 $2$：$\\frac{x_1 + x_2}{2}$。把差除以 $2$，$\\frac{6 - (-3)}{2} = \\frac{9}{2}$，得到的是 $M$ 在水平方向上离两端多远，而不是 $M$ 的位置。别忘了除以 $2$，还要保持 $(x, y)$ 的顺序：横坐标的平均数在前。`,
      ),
      generate(rng) {
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        let B: Point;
        do B = [rng.int(-9, 9), rng.int(-9, 9)];
        while (B[0] === A[0] && B[1] === A[1]);
        const work = midpointSteps(A, B);
        const check = halvesCheck(A, B);
        const M = midpointOf(A, B);
        return {
          ...pointProblem({
            prompt: t(
              `Find the midpoint of the segment with endpoints $${pt("A", A)}$ and $${pt("B", B)}$.`,
              `求以 $${pt("A", A)}$ 和 $${pt("B", B)}$ 为端点的线段的中点。`,
            ),
            answer: M,
            wrong: midpointWrong(A, B),
            solution: t(
              `Halfway from $A$ to $B$ is halfway in each direction, so each coordinate of the midpoint $M$ is an average.

${work.en}

{{figure 0}}

${check.en}`,
              `从 $A$ 到 $B$ 的正中间，就是两个方向都在正中间，所以中点 $M$ 的每个坐标都是平均数。

${work["zh-CN"]}

{{figure 0}}

${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            halvesFigure(
              A,
              B,
              `The midpoint M${plainAt([M[0].toNumber(), M[1].toNumber()])} splits AB into two equal moves.`,
              `中点 M${plainAt([M[0].toNumber(), M[1].toNumber()])} 把 AB 分成两段相同的移动。`,
            ),
          ],
        };
      },
    },
    {
      id: "midpoint-from-a-graph",
      figure: coordinateDrawings["midpoint-from-a-graph"],
      title: t("The midpoint of a graphed segment", "由图像求中点"),
      explanation: t(
        `To find the midpoint of a segment drawn on a grid, read the coordinates of its endpoints first, then average them. Read each point across, then up: from the origin, count along the $x$-axis to the point's column for $x$, then up or down to its row for $y$.

A segment from $A(-4, 1)$ to $B(2, 5)$ has midpoint

$$\\left(\\frac{-4 + 2}{2}, \\frac{1 + 5}{2}\\right) = (-1, 3).$$

On the grid you can see it: from $A$ to $B$ is $6$ across and $4$ up, and $(-1, 3)$ is $3$ across and $2$ up from $A$.

> **Watch out.** A point is written $(x, y)$, across first. Reading the endpoints as $(y, x)$ gives a midpoint with its coordinates swapped, $(3, -1)$ here, which is a different point. Then add before you halve: half the difference of the coordinates is a distance, not a position.`,
        `求网格上一条线段的中点，先读出两个端点的坐标，再求平均数。读点时先横后纵：从原点出发，沿 $x$ 轴数到点所在的列得到 $x$，再向上或向下数到它所在的行得到 $y$。

从 $A(-4, 1)$ 到 $B(2, 5)$ 的线段，中点是

$$\\left(\\frac{-4 + 2}{2}, \\frac{1 + 5}{2}\\right) = (-1, 3).$$

在网格上也看得出来：从 $A$ 到 $B$ 横向 $6$、向上 $4$，而 $(-1, 3)$ 在 $A$ 横向 $3$、向上 $2$ 处。

> **注意。** 点写作 $(x, y)$，横坐标在前。如果把端点读成 $(y, x)$，算出的中点坐标就会颠倒，这里会得到 $(3, -1)$，那是另一个点。然后先加后除：坐标之差的一半是距离，不是位置。`,
      ),
      generate(rng) {
        const A: Point = [rng.int(-6, 6), rng.int(-6, 6)];
        let B: Point;
        do B = [A[0] + 2 * rng.int(-4, 4), A[1] + 2 * rng.int(-4, 4)];
        while ((B[0] === A[0] && B[1] === A[1]) || Math.abs(B[0]) > 6 || Math.abs(B[1]) > 6);
        const work = midpointSteps(A, B);
        const check = halvesCheck(A, B);
        const M: Point = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        return {
          ...pointProblem({
            prompt: t("Find the midpoint of $\\overline{AB}$.", "求 $\\overline{AB}$ 的中点。"),
            answer: midpointOf(A, B),
            wrong: midpointWrong(A, B),
            solution: t(
              `Read the endpoints from the graph, across then up: $${pt("A", A)}$ and $${pt("B", B)}$. Then average their coordinates.

${work.en}

{{figure 0}}

${check.en}`,
              `先横后纵，从图中读出端点：$${pt("A", A)}$ 和 $${pt("B", B)}$。再求它们坐标的平均数。

${work["zh-CN"]}

{{figure 0}}

${check["zh-CN"]}`,
            ),
          }),
          figure: shapeFigure(
            ["A", "B"],
            [A, B],
            `Segment AB in the coordinate plane, from ${listPts(["A", "B"], [A, B])}.`,
            `坐标平面中的线段 AB，端点为 ${listPts(["A", "B"], [A, B])}。`,
          ),
          solutionFigures: [halvesFigure(A, B, `The midpoint of AB is ${plainAt(M)}.`, `AB 的中点是 ${plainAt(M)}。`)],
        };
      },
    },
    {
      id: "finding-an-endpoint",
      title: t("Finding an endpoint from the midpoint", "由中点求端点"),
      explanation: t(
        `If $M$ is the midpoint of $\\overline{AB}$, the move from $A$ to $M$ is half of the segment, and the same move again carries $M$ to $B$. So find the change from $A$ to $M$, and add it to $M$. In one formula, $B = M + (M - A) = 2M - A$, coordinate by coordinate:

$$x_B = 2x_M - x_A, \\qquad y_B = 2y_M - y_A.$$

With $A(1, -3)$ and $M(4, 2)$: from $A$ to $M$ is $3$ to the right and $5$ up, so $B$ is another $3$ to the right and $5$ up from $M$, at $(7, 7)$. The formula agrees: $(2 \\cdot 4 - 1, 2 \\cdot 2 - (-3)) = (7, 7)$.

> **Watch out.** $B$ is not between $A$ and $M$: it lies beyond $M$, as far past $M$ as $A$ is before it. Averaging $A$ and $M$ gives the point halfway to $M$, and $M - A$ alone is only the move, not a point. Subtract in the right order too: $2A - M$ lands on the far side of $A$.`,
        `若 $M$ 是 $\\overline{AB}$ 的中点，从 $A$ 到 $M$ 是线段的一半，再走一次同样的移动就从 $M$ 到达 $B$。所以先求从 $A$ 到 $M$ 的变化量，再把它加到 $M$ 上。写成一个公式就是 $B = M + (M - A) = 2M - A$，逐个坐标计算：

$$x_B = 2x_M - x_A, \\qquad y_B = 2y_M - y_A.$$

已知 $A(1, -3)$ 与 $M(4, 2)$：从 $A$ 到 $M$ 是向右 $3$、向上 $5$，所以 $B$ 在 $M$ 再向右 $3$、向上 $5$ 处，即 $(7, 7)$。公式给出同样的结果：$(2 \\cdot 4 - 1, 2 \\cdot 2 - (-3)) = (7, 7)$。

> **注意。** $B$ 不在 $A$ 和 $M$ 之间，而是在 $M$ 的另一侧，与 $M$ 的距离等于 $A$ 与 $M$ 的距离。求 $A$ 和 $M$ 的平均数得到的是到 $M$ 一半处的点；$M - A$ 只是移动量，不是点。相减的顺序也要对：$2A - M$ 会落到 $A$ 的另一侧。`,
      ),
      generate(rng) {
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        let M: Point;
        do M = [rng.int(-8, 8), rng.int(-8, 8)];
        while (M[0] === A[0] && M[1] === A[1]);
        const B: Point = [2 * M[0] - A[0], 2 * M[1] - A[1]];
        const [dx, dy] = [M[0] - A[0], M[1] - A[1]];
        const change = steps(`${chain(`(${M[0]} - ${paren(A[0])}, ${M[1]} - ${paren(A[1])})`, `(${dx}, ${dy})`)}`);
        const again = steps(`B = (${M[0]} + ${paren(dx)}, ${M[1]} + ${paren(dy)}) = ${pointLatex(B)}`);
        const back = `\\left(\\frac{${A[0]} + ${paren(B[0])}}{2}, \\frac{${A[1]} + ${paren(B[1])}}{2}\\right) = \\left(\\frac{${A[0] + B[0]}}{2}, \\frac{${A[1] + B[1]}}{2}\\right) = ${pointLatex(M)}`;
        return {
          ...pointProblem({
            prompt: t(
              `$M${pointLatex(M)}$ is the midpoint of $\\overline{AB}$, and $${pt("A", A)}$. Find the coordinates of $B$.`,
              `$M${pointLatex(M)}$ 是 $\\overline{AB}$ 的中点，且 $${pt("A", A)}$。求 $B$ 的坐标。`,
            ),
            answer: B,
            wrong: [midpointOf(A, M), [M[0] - A[0], M[1] - A[1]], [2 * A[0] - M[0], 2 * A[1] - M[1]]],
            solution: t(
              `${stepLabel(1, "The move from A to M", "从 A 到 M 的移动").en} It is half of the segment. Subtract the coordinates of $A$ from those of $M$:${change}${stepLabel(2, "The same move again", "再走一次").en} The second half of the segment is the same move, from $M$ to $B$:${again}{{figure 0}}

**Check.** The midpoint of $A$ and the $B$ found must be $M$: $${back}$.`,
              `${stepLabel(1, "The move from A to M", "从 A 到 M 的移动")["zh-CN"]}这是线段的一半。用 $M$ 的坐标减去 $A$ 的坐标：${change}${stepLabel(2, "The same move again", "再走一次")["zh-CN"]}线段的后一半是同样的移动，从 $M$ 到 $B$：${again}{{figure 0}}

**检验。** $A$ 与求出的 $B$ 的中点必须是 $M$：$${back}$。`,
            ),
          }),
          solutionFigures: [
            shapeFigure(
              ["A", "B"],
              [A, B],
              `From A${plainPt(A)} to M${plainPt(M)} and the same move again reaches B${plainPt(B)}.`,
              `从 A${plainPt(A)} 到 M${plainPt(M)}，再走一次同样的移动到达 B${plainPt(B)}。`,
              [
                { kind: "arrow", from: A, to: M, tone: "action" },
                { kind: "arrow", from: M, to: B, tone: "action" },
                ...legsOf(A, M),
                ...legsOf(M, B),
                { kind: "point", at: M, label: "M", dir: away(M, [M[0] + dy, M[1] - dx]) },
                { kind: "point", at: B, tone: "result" },
              ],
            ),
          ],
        };
      },
    },
  ],
};

/** fractionsOfTheWay are the fractions k/n in lowest terms with n from 3 to 5. */
const fractionsOfTheWay: readonly (readonly [number, number])[] = [
  [1, 3],
  [2, 3],
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
];

/** ratios are the ratios a : b in lowest terms with a + b from 3 to 7. */
const partRatios: readonly (readonly [number, number])[] = [
  [1, 2],
  [2, 1],
  [1, 3],
  [3, 1],
  [2, 3],
  [3, 2],
  [1, 4],
  [4, 1],
  [3, 4],
  [4, 3],
  [2, 5],
  [5, 2],
];

/** stepVector draws a nonzero step (u, v) with A + n·(u, v) inside −12 to 12. */
function stepVector(rng: Rng, a: Point, n: number): [number, number] {
  for (;;) {
    const u = rng.int(-3, 3);
    const v = rng.int(-3, 3);
    if ((u !== 0 || v !== 0) && Math.abs(a[0] + n * u) <= 12 && Math.abs(a[1] + n * v) <= 12) return [u, v];
  }
}

/** partOfChange writes the fraction k/n of the change (n·u, n·v): (k·u, k·v). */
const partOfChange = (k: number, n: number, u: number, v: number) =>
  `\\frac{${k}}{${n}} \\cdot (${n * u}, ${n * v}) = (${k * u}, ${k * v})`;

/** addTo writes A plus the move (du, dv), equal to the point P. */
const addTo = (name: string, a: Point, du: number, dv: number) =>
  `${name} = (${a[0]} + ${paren(du)}, ${a[1]} + ${paren(dv)}) = ${pointLatex([a[0] + du, a[1] + dv])}`;

/** partitioningLineSegments finds the point that divides a segment in a given fraction or ratio. */
export const partitioningLineSegments: TopicDef = {
  id: "partitioning-line-segments",
  title: t("Partitioning Line Segments", "线段的定比分点"),
  summary: t(
    "Find the point a given fraction of the way along a segment, the point that divides it in a given ratio, and an endpoint from such a point.",
    "求线段上从一端起若干分之几处的点、按给定比分割线段的点，并由分点求端点。",
  ),
  prerequisites: ["midpoints-in-the-coordinate-plane", "ratios"],
  encompasses: [{ topic: "ratios", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.6"],
  intro: t(
    `The midpoint is the point halfway along a segment: from $A$ we make half of the move to $B$. Any other fraction works the same way.

Take $A(2, 1)$ and $B(8, 4)$. The move from $A$ to $B$ is $6$ to the right and $3$ up. Cut it into $3$ equal steps of $2$ to the right and $1$ up: one step from $A$ is $(4, 2)$, two steps is $(6, 3)$, and three steps is $B$.

{{figure 0}}

So the point $\\frac{1}{3}$ of the way from $A$ to $B$ is $(4, 2)$: we added $\\frac{1}{3}$ of the move to $A$. It also splits the segment into two pieces of $1$ step and $2$ steps, so it is the point $P$ with $AP : PB = 1 : 2$. Fractions of the way and ratios of the pieces describe the same points.

In this lesson we find the point a fraction of the way along a segment, the point that divides it in a given ratio, and an endpoint from such a point.`,
    `中点是线段上一半处的点：从 $A$ 出发，走到 $B$ 的移动只走一半。其他分数也是同样的道理。

取 $A(2, 1)$ 和 $B(8, 4)$。从 $A$ 到 $B$ 是向右 $6$、向上 $3$。把它分成 $3$ 个相同的小步，每步向右 $2$、向上 $1$：从 $A$ 走一步到 $(4, 2)$，两步到 $(6, 3)$，三步到 $B$。

{{figure 0}}

所以从 $A$ 到 $B$ 的 $\\frac{1}{3}$ 处的点是 $(4, 2)$：我们把移动量的 $\\frac{1}{3}$ 加到了 $A$ 上。它把线段分成 $1$ 步和 $2$ 步两段，所以它也是满足 $AP : PB = 1 : 2$ 的点 $P$。“若干分之几处”和“两段之比”描述的是同样的点。

这节课我们求线段上若干分之几处的点、按给定比分割线段的点，并由分点求端点。`,
  ),
  introFigures: [
    partition(
      [2, 1],
      [8, 4],
      2,
      1,
      3,
      1,
      "A(2, 1) to B(8, 4) in 3 equal steps of (2, 1); one step from A is P(4, 2).",
      "从 A(2, 1) 到 B(8, 4) 分成 3 个相同的步子 (2, 1)；从 A 走一步是 P(4, 2)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "a-fraction-of-the-way",
      title: t("A fraction of the way along a segment", "线段上若干分之几处的点"),
      explanation: t(
        `To go a fraction $f$ of the way from $A$ to $B$, start at $A$ and make the fraction $f$ of the move to $B$. In coordinates: find the change from $A$ to $B$, take $f$ of each part, and add the result to $A$:

$$P = \\big(x_A + f(x_B - x_A),\\; y_A + f(y_B - y_A)\\big).$$

From $A(1, 2)$ to $B(10, 8)$ the change is $(9, 6)$. Two thirds of it is $(6, 4)$, so the point $\\frac{2}{3}$ of the way from $A$ to $B$ is $(1 + 6, 2 + 4) = (7, 6)$. The midpoint is the case $f = \\frac{1}{2}$.

> **Watch out.** Start at $A$ and add a fraction of the change. Multiplying $B$ by $f$, $\\frac{2}{3} \\cdot (10, 8)$, measures from the origin, not from $A$. And the fraction is counted from the endpoint named first: going back $\\frac{2}{3}$ of the way from $B$ gives the point $\\frac{1}{3}$ of the way from $A$.`,
        `要找从 $A$ 到 $B$ 的 $f$ 处的点，就从 $A$ 出发，走到 $B$ 的移动只走其中的 $f$。用坐标来说：先求从 $A$ 到 $B$ 的变化量，每个分量取 $f$ 倍，再加到 $A$ 上：

$$P = \\big(x_A + f(x_B - x_A),\\; y_A + f(y_B - y_A)\\big).$$

从 $A(1, 2)$ 到 $B(10, 8)$ 的变化量是 $(9, 6)$，它的 $\\frac{2}{3}$ 是 $(6, 4)$，所以从 $A$ 到 $B$ 的 $\\frac{2}{3}$ 处的点是 $(1 + 6, 2 + 4) = (7, 6)$。中点就是 $f = \\frac{1}{2}$ 的情形。

> **注意。** 从 $A$ 出发，加上变化量的若干分之几。直接用 $f$ 乘 $B$，$\\frac{2}{3} \\cdot (10, 8)$，是从原点量起，不是从 $A$ 量起。分数要从先说的那个端点算起：从 $B$ 往回走 $\\frac{2}{3}$，得到的是从 $A$ 起 $\\frac{1}{3}$ 处的点。`,
      ),
      generate(rng) {
        const [k, n] = rng.pick(fractionsOfTheWay);
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const B: Point = [A[0] + n * u, A[1] + n * v];
        const P: Point = [A[0] + k * u, A[1] + k * v];
        const f = `\\frac{${k}}{${n}}`;
        const change = chain(`(${B[0]} - ${paren(A[0])}, ${B[1]} - ${paren(A[1])})`, `(${n * u}, ${n * v})`);
        const rest = n - k;
        return {
          ...pointProblem({
            prompt: t(
              `Find the point $P$ that is $${f}$ of the way from $${pt("A", A)}$ to $${pt("B", B)}$.`,
              `求从 $${pt("A", A)}$ 到 $${pt("B", B)}$ 的 $${f}$ 处的点 $P$。`,
            ),
            answer: P,
            wrong: [[B[0] - k * u, B[1] - k * v], [Q.of(k * B[0], n), Q.of(k * B[1], n)], midpointOf(A, B)],
            solution: t(
              `${stepLabel(1, "The change from A to B", "从 A 到 B 的变化量").en} Subtract the coordinates of $A$ from those of $B$:${steps(change)}${stepLabel(2, "The fraction of it", "取其中的几分之几").en} Take $${f}$ of each part:${steps(partOfChange(k, n, u, v))}${stepLabel(3, "Add it to A", "加到 A 上").en} Starting at $A$ and making that move:${steps(addTo("P", A, k * u, k * v))}{{figure 0}}

**Check.** The rest of the way, $\\frac{${rest}}{${n}}$ of the change, is $(${rest * u}, ${rest * v})$, and it must carry $P$ to $B$: $(${P[0]} + ${paren(rest * u)}, ${P[1]} + ${paren(rest * v)}) = ${pointLatex(B)}$.`,
              `${stepLabel(1, "The change from A to B", "从 A 到 B 的变化量")["zh-CN"]}用 $B$ 的坐标减去 $A$ 的坐标：${steps(change)}${stepLabel(2, "The fraction of it", "取其中的几分之几")["zh-CN"]}每个分量取 $${f}$：${steps(partOfChange(k, n, u, v))}${stepLabel(3, "Add it to A", "加到 A 上")["zh-CN"]}从 $A$ 出发走这一段：${steps(addTo("P", A, k * u, k * v))}{{figure 0}}

**检验。** 剩下的路程是变化量的 $\\frac{${rest}}{${n}}$，即 $(${rest * u}, ${rest * v})$，它应当把 $P$ 带到 $B$：$(${P[0]} + ${paren(rest * u)}, ${P[1]} + ${paren(rest * v)}) = ${pointLatex(B)}$。`,
            ),
          }),
          solutionFigures: [
            partition(
              A,
              B,
              u,
              v,
              n,
              k,
              `Cut AB into ${n} equal steps of (${u}, ${v}): ${k} steps from A is ${plainAt(P)}.`,
              `把 AB 分成 ${n} 个相同的步子 (${u}, ${v})：从 A 走 ${k} 步到达 ${plainAt(P)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "partitioning-in-a-ratio",
      title: t("Partitioning a segment in a ratio", "按比分割线段"),
      explanation: t(
        `A point $P$ on $\\overline{AB}$ with $AP : PB = a : b$ splits the segment into $a + b$ equal parts, $a$ of them between $A$ and $P$ and $b$ between $P$ and $B$. So $P$ is $\\frac{a}{a + b}$ of the way from $A$ to $B$, and it is found as in the last step.

For $A(-2, 7)$, $B(8, -3)$ and $AP : PB = 2 : 3$, the segment has $2 + 3 = 5$ parts and $P$ is $\\frac{2}{5}$ of the way. The change is $(10, -10)$, two fifths of it is $(4, -4)$, so $P = (-2 + 4, 7 - 4) = (2, 3)$.

> **Watch out.** In $AP : PB = 2 : 3$, the fraction from $A$ is $\\frac{2}{2 + 3} = \\frac{2}{5}$, not $\\frac{2}{3}$: the $3$ counts the parts of $\\overline{PB}$, not of the whole segment. And the first number goes with $A$: the point with $AP : PB = 3 : 2$ is $\\frac{3}{5}$ of the way from $A$, closer to $B$.`,
        `$\\overline{AB}$ 上的点 $P$ 满足 $AP : PB = a : b$，就是把线段分成 $a + b$ 等份，其中 $a$ 份在 $A$ 与 $P$ 之间，$b$ 份在 $P$ 与 $B$ 之间。所以 $P$ 在从 $A$ 到 $B$ 的 $\\frac{a}{a + b}$ 处，可以像上一步那样求出。

对 $A(-2, 7)$、$B(8, -3)$ 且 $AP : PB = 2 : 3$，线段共 $2 + 3 = 5$ 份，$P$ 在 $\\frac{2}{5}$ 处。变化量是 $(10, -10)$，它的五分之二是 $(4, -4)$，所以 $P = (-2 + 4, 7 - 4) = (2, 3)$。

> **注意。** 在 $AP : PB = 2 : 3$ 中，从 $A$ 算起的分数是 $\\frac{2}{2 + 3} = \\frac{2}{5}$，不是 $\\frac{2}{3}$：$3$ 数的是 $\\overline{PB}$ 的份数，不是整条线段的份数。第一个数对应 $A$：满足 $AP : PB = 3 : 2$ 的点在从 $A$ 起 $\\frac{3}{5}$ 处，离 $B$ 更近。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(partRatios);
        const n = a + b;
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const B: Point = [A[0] + n * u, A[1] + n * v];
        const P: Point = [A[0] + a * u, A[1] + a * v];
        const f = `\\frac{${a}}{${n}}`;
        const change = chain(`(${B[0]} - ${paren(A[0])}, ${B[1]} - ${paren(A[1])})`, `(${n * u}, ${n * v})`);
        return {
          ...pointProblem({
            prompt: t(
              `Point $P$ lies on $\\overline{AB}$ with $AP : PB = ${a} : ${b}$, where $${pt("A", A)}$ and $${pt("B", B)}$. Find the coordinates of $P$.`,
              `点 $P$ 在 $\\overline{AB}$ 上，且 $AP : PB = ${a} : ${b}$，其中 $${pt("A", A)}$，$${pt("B", B)}$。求 $P$ 的坐标。`,
            ),
            answer: P,
            wrong: [
              [A[0] + b * u, A[1] + b * v],
              [Q.of(A[0]).add(Q.of(a * n * u, b)), Q.of(A[1]).add(Q.of(a * n * v, b))],
              midpointOf(A, B),
            ],
            solution: t(
              `${stepLabel(1, "The fraction of the way", "所在的位置").en} The ratio $${a} : ${b}$ splits $\\overline{AB}$ into $${a} + ${b} = ${n}$ equal parts, $${a}$ of them from $A$ to $P$. So $P$ is $${f}$ of the way from $A$ to $B$.

${stepLabel(2, "That fraction of the change", "变化量的相应部分").en} The change from $A$ to $B$ is $${change}$, and $${f}$ of it is${steps(partOfChange(a, n, u, v))}${stepLabel(3, "Add it to A", "加到 A 上").en}${steps(addTo("P", A, a * u, a * v))}{{figure 0}}

**Check.** From $A$ to $P$ the change is $(${a * u}, ${a * v})$, which is $${a}$ steps of $(${u}, ${v})$, and from $P$ to $B$ it is $(${b * u}, ${b * v})$, which is $${b}$ such steps: the pieces are in the ratio $${a} : ${b}$.`,
              `${stepLabel(1, "The fraction of the way", "所在的位置")["zh-CN"]}比 $${a} : ${b}$ 把 $\\overline{AB}$ 分成 $${a} + ${b} = ${n}$ 等份，从 $A$ 到 $P$ 占 $${a}$ 份。所以 $P$ 在从 $A$ 到 $B$ 的 $${f}$ 处。

${stepLabel(2, "That fraction of the change", "变化量的相应部分")["zh-CN"]}从 $A$ 到 $B$ 的变化量是 $${change}$，它的 $${f}$ 是${steps(partOfChange(a, n, u, v))}${stepLabel(3, "Add it to A", "加到 A 上")["zh-CN"]}${steps(addTo("P", A, a * u, a * v))}{{figure 0}}

**检验。** 从 $A$ 到 $P$ 的变化量是 $(${a * u}, ${a * v})$，即 $${a}$ 个 $(${u}, ${v})$；从 $P$ 到 $B$ 是 $(${b * u}, ${b * v})$，即 $${b}$ 个：两段之比正是 $${a} : ${b}$。`,
            ),
          }),
          solutionFigures: [
            partition(
              A,
              B,
              u,
              v,
              n,
              a,
              `Cut AB into ${n} equal steps: ${a} steps from A and ${b} steps from B is ${plainAt(P)}.`,
              `把 AB 分成 ${n} 等份：离 A ${a} 份、离 B ${b} 份的点是 ${plainAt(P)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "an-endpoint-from-a-partition-point",
      title: t("An endpoint from a partition point", "由分点求端点"),
      explanation: t(
        `If $AP : PB = a : b$, the segment $\\overline{AP}$ holds $a$ of the $a + b$ equal parts of $\\overline{AB}$. Dividing the change from $A$ to $P$ by $a$ gives one part; adding $a + b$ parts to $A$ then reaches $B$.

For $A(1, 1)$, $P(5, 3)$ and $AP : PB = 2 : 1$: the change from $A$ to $P$ is $(4, 2)$, so one part is $\\frac{1}{2}(4, 2) = (2, 1)$. The whole segment has $2 + 1 = 3$ parts, so $B = (1 + 3 \\cdot 2, 1 + 3 \\cdot 1) = (7, 4)$. Equivalently, $B$ is one more part beyond $P$: $(5 + 2, 3 + 1) = (7, 4)$.

> **Watch out.** $P$ is the midpoint only when the ratio is $1 : 1$, so doubling, $2P - A$, works only then. Divide the change from $A$ to $P$ by $a$, the number of parts $\\overline{AP}$ holds, not by $b$, and count all $a + b$ parts from $A$ to reach $B$.`,
        `若 $AP : PB = a : b$，则 $\\overline{AP}$ 占 $\\overline{AB}$ 的 $a + b$ 等份中的 $a$ 份。把从 $A$ 到 $P$ 的变化量除以 $a$ 得到一份，再从 $A$ 加上 $a + b$ 份，就到达 $B$。

对 $A(1, 1)$、$P(5, 3)$ 且 $AP : PB = 2 : 1$：从 $A$ 到 $P$ 的变化量是 $(4, 2)$，所以一份是 $\\frac{1}{2}(4, 2) = (2, 1)$。整条线段共 $2 + 1 = 3$ 份，所以 $B = (1 + 3 \\cdot 2, 1 + 3 \\cdot 1) = (7, 4)$。也可以说，$B$ 在 $P$ 之外再走一份：$(5 + 2, 3 + 1) = (7, 4)$。

> **注意。** 只有比是 $1 : 1$ 时 $P$ 才是中点，加倍的做法 $2P - A$ 只在那时成立。把从 $A$ 到 $P$ 的变化量除以 $a$（$\\overline{AP}$ 所占的份数），而不是除以 $b$；再从 $A$ 数满 $a + b$ 份才到 $B$。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(partRatios);
        const n = a + b;
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const P: Point = [A[0] + a * u, A[1] + a * v];
        const B: Point = [A[0] + n * u, A[1] + n * v];
        const change = chain(`(${P[0]} - ${paren(A[0])}, ${P[1]} - ${paren(A[1])})`, `(${a * u}, ${a * v})`);
        const part = a === 1 ? `(${u}, ${v})` : `\\frac{1}{${a}} \\cdot (${a * u}, ${a * v}) = (${u}, ${v})`;
        const marks: PlaneMark[] = [{ kind: "arrow", from: A, to: P, tone: "action" }];
        for (let i = 1; i < n; i++) if (i !== a) marks.push({ kind: "point", at: [A[0] + i * u, A[1] + i * v] });
        marks.push(
          { kind: "point", at: P, label: "P", dir: away(P, [P[0] + v, P[1] - u]), accent: true },
          { kind: "point", at: B, tone: "result" },
        );
        return {
          ...pointProblem({
            prompt: t(
              `Point $${pt("P", P)}$ lies on $\\overline{AB}$ with $AP : PB = ${a} : ${b}$, where $${pt("A", A)}$. Find the coordinates of $B$.`,
              `点 $${pt("P", P)}$ 在 $\\overline{AB}$ 上，且 $AP : PB = ${a} : ${b}$，其中 $${pt("A", A)}$。求 $B$ 的坐标。`,
            ),
            answer: B,
            wrong: [
              [2 * P[0] - A[0], 2 * P[1] - A[1]],
              [A[0] + b * u, A[1] + b * v],
              [Q.of(A[0]).add(Q.of(n * a * u, b)), Q.of(A[1]).add(Q.of(n * a * v, b))],
            ],
            solution: t(
              `${stepLabel(1, "One part", "一份").en} The ratio $${a} : ${b}$ cuts $\\overline{AB}$ into $${n}$ equal parts, and $\\overline{AP}$ holds $${a}$ of them. The change from $A$ to $P$ is $${change}$, so one part is${steps(part)}${stepLabel(2, "All the parts from A", "从 A 起的全部份数").en} $B$ is $${n}$ parts from $A$:${steps(`B = (${A[0]} + ${n} \\cdot ${paren(u)}, ${A[1]} + ${n} \\cdot ${paren(v)}) = ${pointLatex(B)}`)}{{figure 0}}

**Check.** $P$ must be $\\frac{${a}}{${n}}$ of the way from $A$ to the $B$ found. The change from $A$ to $B$ is $(${n * u}, ${n * v})$, and $${partOfChange(a, n, u, v)}$, which carries $A$ to $${pointLatex(P)}$.`,
              `${stepLabel(1, "One part", "一份")["zh-CN"]}比 $${a} : ${b}$ 把 $\\overline{AB}$ 分成 $${n}$ 等份，$\\overline{AP}$ 占其中 $${a}$ 份。从 $A$ 到 $P$ 的变化量是 $${change}$，所以一份是${steps(part)}${stepLabel(2, "All the parts from A", "从 A 起的全部份数")["zh-CN"]}$B$ 离 $A$ 共 $${n}$ 份：${steps(`B = (${A[0]} + ${n} \\cdot ${paren(u)}, ${A[1]} + ${n} \\cdot ${paren(v)}) = ${pointLatex(B)}`)}{{figure 0}}

**检验。** $P$ 应当在从 $A$ 到所求 $B$ 的 $\\frac{${a}}{${n}}$ 处。从 $A$ 到 $B$ 的变化量是 $(${n * u}, ${n * v})$，而 $${partOfChange(a, n, u, v)}$，它把 $A$ 带到 $${pointLatex(P)}$。`,
            ),
          }),
          solutionFigures: [
            shapeFigure(
              ["A", "B"],
              [A, B],
              `AB in ${n} equal steps of (${u}, ${v}): P${plainPt(P)} is ${a} steps from A, and B is ${plainPt(B)}.`,
              `AB 分成 ${n} 个相同的步子 (${u}, ${v})：P${plainPt(P)} 离 A ${a} 步，B 是 ${plainPt(B)}。`,
              marks,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Distances
// ---------------------------------------------------------------------------

const distanceExample: Figure = {
  svg: plane({ xMin: -3, xMax: 5, yMin: -1, yMax: 10 }, [
    { kind: "segment", a: [-2, 1], b: [4, 1], dashed: true },
    { kind: "segment", a: [4, 1], b: [4, 9], dashed: true },
    { kind: "segment", a: [-2, 1], b: [4, 9], accent: true },
    { kind: "point", at: [-2, 1], label: "A", dir: "nw" },
    { kind: "point", at: [4, 9], label: "B", dir: "ne" },
    { kind: "label", at: [1, 1], text: "6", dir: "s" },
    { kind: "label", at: [4, 5], text: "8", dir: "e" },
  ]),
  alt: t(
    "Points A(-2, 1) and B(4, 9) joined by a segment, with a horizontal leg of 6 and a vertical leg of 8 forming a right triangle.",
    "点 A(-2, 1) 与 B(4, 9) 之间的线段，以及长 6 的水平直角边和长 8 的竖直直角边组成的直角三角形。",
  ),
};

/** runRise writes the run and the rise from A to B as differences of coordinates. */
function runRise(a: Point, b: Point): string {
  return steps(`x_2 - x_1 = ${b[0]} - ${paren(a[0])} = ${b[0] - a[0]}`, `y_2 - y_1 = ${b[1]} - ${paren(a[1])} = ${b[1] - a[1]}`);
}

/** decimal2 writes a number rounded to two decimal places. */
const decimal2 = (x: number) => (Math.round(x * 100) / 100).toFixed(2);

/** theDistanceFormula finds distances between points of the plane, and a missing coordinate from a distance. */
export const theDistanceFormula: TopicDef = {
  id: "the-distance-formula",
  title: t("The Distance Formula", "距离公式"),
  summary: t(
    "Find the distance between two points of the plane, exactly or in simplest radical form, and a missing coordinate from a distance.",
    "求平面上两点之间的距离（精确值或最简根式），并由距离求未知坐标。",
  ),
  prerequisites: ["the-pythagorean-theorem", "the-coordinate-plane"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.5 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.8.G.B.8", "CCSS.HSG.GPE.B.7"],
  intro: t(
    `Along a grid line, a distance is a difference of coordinates: from $(1, 2)$ to $(6, 2)$ is $6 - 1 = 5$ units. A slanted segment does not follow the grid, but it is the hypotenuse of a right triangle whose legs do.

From $(1, 1)$ to $(4, 5)$ the run is $4 - 1 = 3$ and the rise is $5 - 1 = 4$. These are the legs of a right triangle, and the segment is its hypotenuse:

{{figure 0}}

By the Pythagorean theorem, the distance $d$ satisfies $d^2 = 3^2 + 4^2 = 25$, so $d = 5$. Nothing here depends on these particular points: for any $(x_1, y_1)$ and $(x_2, y_2)$ the legs are $x_2 - x_1$ and $y_2 - y_1$, which gives the **distance formula**

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

In this lesson we use it for distances that are whole numbers, for distances in simplest radical form, and backwards, to find a coordinate from a known distance.`,
    `沿着网格线，距离就是坐标之差：从 $(1, 2)$ 到 $(6, 2)$ 是 $6 - 1 = 5$ 个单位。斜的线段不沿着网格，但它是一个直角三角形的斜边，而这个三角形的两条直角边沿着网格。

从 $(1, 1)$ 到 $(4, 5)$，水平变化 $4 - 1 = 3$，竖直变化 $5 - 1 = 4$。它们是直角三角形的两条直角边，线段是斜边：

{{figure 0}}

由勾股定理，距离 $d$ 满足 $d^2 = 3^2 + 4^2 = 25$，所以 $d = 5$。这里的推理不依赖于具体的点：对任意 $(x_1, y_1)$ 和 $(x_2, y_2)$，两条直角边是 $x_2 - x_1$ 和 $y_2 - y_1$，于是得到**距离公式**

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

这节课我们用它求整数距离、用最简根式表示的距离，并反过来由已知距离求坐标。`,
  ),
  introFigures: [
    shapeFigure(
      ["", ""],
      [
        [1, 1],
        [4, 5],
      ],
      "The segment from (1, 1) to (4, 5) is the hypotenuse of a right triangle with a horizontal leg of 3 and a vertical leg of 4.",
      "从 (1, 1) 到 (4, 5) 的线段是一个直角三角形的斜边，水平直角边长 3，竖直直角边长 4。",
      [...legs([1, 1], [4, 5]), { kind: "label", at: [2.5, 3], text: "5", dir: "nw" }],
    ),
  ],
  knowledgePoints: [
    {
      id: "distance-with-a-whole-number-answer",
      title: t("The distance formula", "距离公式"),
      explanation: t(
        `The segment from $A(x_1, y_1)$ to $B(x_2, y_2)$ is the hypotenuse of a right triangle whose legs are the run $x_2 - x_1$ and the rise $y_2 - y_1$. By the Pythagorean theorem the square of the hypotenuse is the sum of the squares of the legs, so

$$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

For $A(-2, 1)$ and $B(4, 9)$ the run is $4 - (-2) = 6$ and the rise is $9 - 1 = 8$, so

$$AB = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

The order of the points does not matter: from $B$ to $A$ the run and rise are $-6$ and $-8$, and their squares are the same.

> **Watch out.** Square the run and the rise before adding: $6 + 8 = 14$ is the walk along the two legs, which is always longer than the hypotenuse. Combining the signed differences, $-6 + 8$, is wrong for the same reason. And finish with the square root: $100$ is the square of the distance, not the distance.`,
        `从 $A(x_1, y_1)$ 到 $B(x_2, y_2)$ 的线段是一个直角三角形的斜边，两条直角边是水平变化 $x_2 - x_1$ 和竖直变化 $y_2 - y_1$。由勾股定理，斜边的平方等于两条直角边的平方和，所以

$$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

对 $A(-2, 1)$ 和 $B(4, 9)$，水平变化 $4 - (-2) = 6$，竖直变化 $9 - 1 = 8$，所以

$$AB = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

两点的先后顺序无关紧要：从 $B$ 到 $A$，水平和竖直变化是 $-6$ 和 $-8$，平方后完全一样。

> **注意。** 先把水平变化和竖直变化平方，再相加：$6 + 8 = 14$ 是沿两条直角边走的路程，总比斜边长。把带符号的差直接合起来，$-6 + 8$，也是错的。最后要开平方：$100$ 是距离的平方，不是距离。`,
      ),
      figure: distanceExample,
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        const B: Point = [A[0] + rng.sign() * p, A[1] + rng.sign() * q];
        const [dx, dy] = [B[0] - A[0], B[1] - A[1]];
        return {
          ...numberProblem({
            prompt: t(
              `Find the distance between $${pt("A", A)}$ and $${pt("B", B)}$.`,
              `求 $${pt("A", A)}$ 与 $${pt("B", B)}$ 之间的距离。`,
            ),
            answer: c,
            mistakes: [
              why(
                p + q,
                "You added the horizontal and vertical distances. They are the legs of a right triangle: square them, add, and take the square root.",
                "你把水平距离和竖直距离直接相加了。它们是直角三角形的两条直角边：先平方，再相加，然后开平方。",
              ),
              why(c * c, "That is the distance squared. Take the square root.", "这是距离的平方，还要开平方。"),
              why(
                Math.abs(dx + dy),
                "You combined the coordinate differences without squaring them. Square each one first.",
                "你没有平方就把坐标差合在一起了。要先把每个差平方。",
              ),
            ],
            solution: t(
              `${stepLabel(1, "The run and the rise", "水平变化和竖直变化").en} Subtract the coordinates of $A$ from those of $B$:${runRise(A, B)}They are the legs of a right triangle whose hypotenuse is $\\overline{AB}$:

{{figure 0}}

${stepLabel(2, "The Pythagorean theorem", "勾股定理").en} Square the legs, add, and take the square root:${steps(`AB = ${distanceSteps(A, B)}`)}**Check.** A hypotenuse is longer than either leg but shorter than the two legs together: $${Math.max(p, q)} < ${c} < ${p} + ${q} = ${p + q}$.`,
              `${stepLabel(1, "The run and the rise", "水平变化和竖直变化")["zh-CN"]}用 $B$ 的坐标减去 $A$ 的坐标：${runRise(A, B)}它们是以 $\\overline{AB}$ 为斜边的直角三角形的两条直角边：

{{figure 0}}

${stepLabel(2, "The Pythagorean theorem", "勾股定理")["zh-CN"]}两条直角边平方、相加，再开平方：${steps(`AB = ${distanceSteps(A, B)}`)}**检验。** 斜边比任何一条直角边都长，但比两条直角边之和短：$${Math.max(p, q)} < ${c} < ${p} + ${q} = ${p + q}$。`,
            ),
          }),
          solutionFigures: [
            shapeFigure(
              ["A", "B"],
              [A, B],
              `The legs are ${p} and ${q}, so the distance is ${c}.`,
              `两条直角边是 ${p} 和 ${q}，所以距离是 ${c}。`,
              legs(A, B),
            ),
          ],
        };
      },
    },
    {
      id: "distance-in-simplest-radical-form",
      title: t("Distances in simplest radical form", "用最简根式表示距离"),
      explanation: t(
        `Usually the sum of the squares of the run and the rise is not a perfect square, and the distance is irrational. Write it in simplest radical form: take the largest perfect square out of the root, using $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$.

For $A(3, -1)$ and $B(-1, 3)$ the run is $-4$ and the rise is $4$:

$$AB = \\sqrt{(-4)^2 + 4^2} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}.$$

As a decimal $4\\sqrt{2} \\approx 5.66$, a little more than the legs of $4$ and well less than their sum, $8$.

> **Watch out.** Subtract the coordinates, $x_2 - x_1$; their sum, $3 + (-1)$, is not a side of the triangle. The squares are added, never subtracted, even when a difference is negative, since a square is never negative. And $\\sqrt{32}$ is not finished: its factor $16$ is a perfect square, so it simplifies to $4\\sqrt{2}$.`,
        `通常水平变化与竖直变化的平方和不是完全平方数，距离是无理数。这时写成最简根式：利用 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$，把根号里最大的完全平方因数开出来。

对 $A(3, -1)$ 和 $B(-1, 3)$，水平变化 $-4$，竖直变化 $4$：

$$AB = \\sqrt{(-4)^2 + 4^2} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}.$$

化成小数，$4\\sqrt{2} \\approx 5.66$，比直角边 $4$ 稍长，又远小于两边之和 $8$。

> **注意。** 坐标要相减，$x_2 - x_1$；它们的和 $3 + (-1)$ 不是三角形的边。两个平方相加，绝不相减；差即使是负数，平方也不会是负数。$\\sqrt{32}$ 还没有化完：它的因数 $16$ 是完全平方数，所以要化成 $4\\sqrt{2}$。`,
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        let A: Point;
        let B: Point;
        let n: number;
        do {
          A = [rng.int(-8, 8), rng.int(-8, 8)];
          B = [A[0] + rng.nonZero(-8, 8), A[1] + rng.nonZero(-8, 8)];
          n = sq(A, B);
        } while (Number.isInteger(Math.sqrt(n)) || Math.abs(B[0]) > 10 || Math.abs(B[1]) > 10);
        const [dx, dy] = [B[0] - A[0], B[1] - A[1]];
        const sumSq = (A[0] + B[0]) ** 2 + (A[1] + B[1]) ** 2;
        const diffSq = Math.abs(dx * dx - dy * dy);
        const [k, r] = simplifyRadical(n);
        const formula = `AB = \\sqrt{(${B[0]} - ${paren(A[0])})^2 + (${B[1]} - ${paren(A[1])})^2} = \\sqrt{${paren(dx)}^2 + ${paren(dy)}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = \\sqrt{${n}}`;
        const simplify =
          k === 1
            ? t(
                `The factors of $${n}$ include no perfect square other than $1$, so $\\sqrt{${n}}$ is already in simplest form.`,
                `$${n}$ 的因数中除 $1$ 以外没有完全平方数，所以 $\\sqrt{${n}}$ 已经是最简根式。`,
              )
            : t(
                `The largest perfect square dividing $${n}$ is $${k * k}$, since $${n} = ${k * k} \\cdot ${r}$:${steps(rootSteps(n))}`,
                `整除 $${n}$ 的最大完全平方数是 $${k * k}$，因为 $${n} = ${k * k} \\cdot ${r}$：${steps(rootSteps(n))}`,
              );
        const [lo, hi] = [Math.max(Math.abs(dx), Math.abs(dy)), Math.abs(dx) + Math.abs(dy)];
        const back =
          k === 1
            ? t("", "")
            : t(
                ` Squaring the answer gives back $${n}$: $(${radical(k, r)})^2 = ${k * k} \\cdot ${r} = ${n}$.`,
                `把答案平方得回 $${n}$：$(${radical(k, r)})^2 = ${k * k} \\cdot ${r} = ${n}$。`,
              );
        return {
          ...radicalProblem({
            prompt: t(
              `Find the distance between $${pt("A", A)}$ and $${pt("B", B)}$. Write it in simplest radical form.`,
              `求 $${pt("A", A)}$ 与 $${pt("B", B)}$ 之间的距离，用最简根式表示。`,
            ),
            answer: simplifyRadical(n),
            wrong: [
              `\\sqrt{${n}}`,
              String(Math.abs(dx) + Math.abs(dy)),
              ...(sumSq > 0 ? [rootTex(sumSq)] : []),
              ...(diffSq > 0 ? [rootTex(diffSq)] : []),
            ],
            solution: t(
              `${stepLabel(1, "The legs", "直角边").en} From $A$ to $B$ the run is $${dx}$ and the rise is $${dy}$, the legs of a right triangle with hypotenuse $\\overline{AB}$:

{{figure 0}}

${stepLabel(2, "The distance formula", "距离公式").en}${steps(formula)}${stepLabel(3, "Simplify", "化简").en} ${simplify.en}

**Check.**${back.en} As a decimal $\\sqrt{${n}} \\approx ${decimal2(Math.sqrt(n))}$, longer than the longer leg, $${lo}$, and shorter than the two legs together, $${hi}$, as a hypotenuse must be.`,
              `${stepLabel(1, "The legs", "直角边")["zh-CN"]}从 $A$ 到 $B$，水平变化 $${dx}$，竖直变化 $${dy}$，它们是以 $\\overline{AB}$ 为斜边的直角三角形的两条直角边：

{{figure 0}}

${stepLabel(2, "The distance formula", "距离公式")["zh-CN"]}${steps(formula)}${stepLabel(3, "Simplify", "化简")["zh-CN"]}${simplify["zh-CN"]}

**检验。**${back["zh-CN"]}化成小数，$\\sqrt{${n}} \\approx ${decimal2(Math.sqrt(n))}$，比较长的直角边 $${lo}$ 长，又比两条直角边之和 $${hi}$ 短，斜边正应如此。`,
            ),
          }),
          solutionFigures: [
            shapeFigure(
              ["A", "B"],
              [A, B],
              `The legs are ${Math.abs(dx)} and ${Math.abs(dy)}, so the distance is ${root(n)}.`,
              `两条直角边是 ${Math.abs(dx)} 和 ${Math.abs(dy)}，所以距离是 ${root(n)}。`,
              legs(A, B),
            ),
          ],
        };
      },
    },
    {
      id: "finding-a-missing-coordinate",
      title: t("A missing coordinate from a distance", "由距离求未知坐标"),
      explanation: t(
        `If a distance is known but a coordinate is not, put the distance into the formula and solve. Squaring both sides removes the square root; then subtract the square that is known, and take square roots. There are usually **two** answers, one on each side, because a leg of $4$ can go up or down.

The point $(4, y)$ is $5$ units from $(1, 2)$:

$$(4 - 1)^2 + (y - 2)^2 = 5^2 \\;\\Rightarrow\\; 9 + (y - 2)^2 = 25 \\;\\Rightarrow\\; (y - 2)^2 = 16 \\;\\Rightarrow\\; y - 2 = \\pm 4,$$

so $y = 2 + 4 = 6$ or $y = 2 - 4 = -2$. Both $(4, 6)$ and $(4, -2)$ are $5$ units from $(1, 2)$: a run of $3$ with a rise of $4$ or a fall of $4$.

> **Watch out.** Keep both signs: $y - 2 = 4$ and $y - 2 = -4$ both work. Subtract the known square before taking the root: $(y - 2)^2$ is $25 - 9 = 16$, not $25$. And the root gives $y - 2$, not $y$: add $2$ back, $y = 2 \\pm 4$.`,
        `如果已知距离而某个坐标未知，就把距离代入公式求解。两边平方去掉根号，减去已知的平方，再开平方。通常有**两个**答案，分别在两侧，因为长 $4$ 的直角边可以向上，也可以向下。

点 $(4, y)$ 到 $(1, 2)$ 的距离是 $5$：

$$(4 - 1)^2 + (y - 2)^2 = 5^2 \\;\\Rightarrow\\; 9 + (y - 2)^2 = 25 \\;\\Rightarrow\\; (y - 2)^2 = 16 \\;\\Rightarrow\\; y - 2 = \\pm 4,$$

所以 $y = 2 + 4 = 6$ 或 $y = 2 - 4 = -2$。$(4, 6)$ 和 $(4, -2)$ 到 $(1, 2)$ 的距离都是 $5$：水平变化 $3$，竖直方向上升 $4$ 或下降 $4$。

> **注意。** 正负两个符号都要保留：$y - 2 = 4$ 和 $y - 2 = -4$ 都成立。开平方之前先减去已知的平方：$(y - 2)^2$ 等于 $25 - 9 = 16$，不是 $25$。开方得到的是 $y - 2$，不是 $y$：还要加回 $2$，$y = 2 \\pm 4$。`,
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const unknownY = rng.bool();
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const known = (unknownY ? A[0] : A[1]) + rng.sign() * p;
        const base = unknownY ? A[1] : A[0];
        const v = unknownY ? "y" : "x";
        const other = unknownY ? `(${known}, y)` : `(x, ${known})`;
        const kb = unknownY ? A[0] : A[1];
        const d = known - kb;
        const square = unknownY
          ? `(${known} - ${paren(kb)})^2 + (y - ${paren(base)})^2`
          : `(x - ${paren(base)})^2 + (${known} - ${paren(kb)})^2`;
        const shifted = `(${linear(1, -base, v)})`;
        const squared = unknownY ? `${paren(d)}^2 + ${shifted}^2 = ${c * c}` : `${shifted}^2 + ${paren(d)}^2 = ${c * c}`;
        const values = [String(base + q), String(base - q)];
        const ends = [base + q, base - q].map((w): Point => (unknownY ? [known, w] : [w, known]));
        const solve =
          base === 0
            ? t(`so $${v} = ${q}$ or $${v} = ${-q}$.`, `所以 $${v} = ${q}$ 或 $${v} = ${-q}$。`)
            : t(
                `${base > 0 ? `Add $${base}$ to` : `Subtract $${-base}$ from`} both sides: $${v} = ${base} + ${q} = ${base + q}$ or $${v} = ${base} - ${q} = ${base - q}$.`,
                `两边${base > 0 ? `加上 $${base}$` : `减去 $${-base}$`}：$${v} = ${base} + ${q} = ${base + q}$ 或 $${v} = ${base} - ${q} = ${base - q}$。`,
              );
        const [runSize, riseSize] = unknownY ? [Math.abs(d), q] : [q, Math.abs(d)];
        const back = `\\sqrt{${runSize ** 2} + ${riseSize ** 2}} = \\sqrt{${c * c}} = ${c}`;
        return {
          ...solutionsProblem({
            prompt: t(
              `The point $${other}$ is $${c}$ units from $${pointLatex(A)}$. Find all possible values of $${v}$.`,
              `点 $${other}$ 到 $${pointLatex(A)}$ 的距离是 $${c}$。求 $${v}$ 的所有可能值。`,
            ),
            values,
            variable: v,
            wrong: [[String(base + q)], [String(base - q)], [String(base + c), String(base - c)], [String(q), String(-q)]],
            solution: t(
              `${stepLabel(1, "Square the distance formula", "把距离公式平方").en} The distance is $${c}$, so the sum of the squares of the run and the rise is $${c}^2$:${steps(`${square} = ${c}^2`, squared)}${stepLabel(2, "Subtract the known square", "减去已知的平方").en} Subtract $${d * d}$ from both sides:${steps(`${shifted}^2 = ${c * c} - ${d * d} = ${q * q}`)}${stepLabel(3, "Take square roots", "开平方").en} A number squared is $${q * q}$ when it is $${q}$ or $${-q}$:${steps(`${linear(1, -base, v)} = \\pm ${q}`)}${solve.en}

{{figure 0}}

**Check.** For either value the run and the rise are $${runSize}$ and $${riseSize}$ in size, so the distance is $${back}$.`,
              `${stepLabel(1, "Square the distance formula", "把距离公式平方")["zh-CN"]}距离是 $${c}$，所以水平变化与竖直变化的平方和是 $${c}^2$：${steps(`${square} = ${c}^2`, squared)}${stepLabel(2, "Subtract the known square", "减去已知的平方")["zh-CN"]}两边减去 $${d * d}$：${steps(`${shifted}^2 = ${c * c} - ${d * d} = ${q * q}`)}${stepLabel(3, "Take square roots", "开平方")["zh-CN"]}平方等于 $${q * q}$ 的数是 $${q}$ 和 $${-q}$：${steps(`${linear(1, -base, v)} = \\pm ${q}`)}${solve["zh-CN"]}

{{figure 0}}

**检验。** 无论取哪个值，水平变化和竖直变化的大小都是 $${runSize}$ 和 $${riseSize}$，所以距离是 $${back}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              fitView([A, ...ends]),
              [
                ...ends.flatMap((end): PlaneMark[] => [
                  { kind: "segment", a: A, b: end, tone: "action" },
                  ...legsOf(A, end),
                  { kind: "point", at: end, label: plainPt(end), dir: away(end, A), tone: "result" },
                ]),
                { kind: "point", at: A, label: "A", dir: unknownY ? (d > 0 ? "w" : "e") : d > 0 ? "s" : "n", accent: true },
              ],
              `Two points at distance ${c} from A${plainPt(A)}: ${ends.map(plainPt).join(" and ")}.`,
              `与 A${plainPt(A)} 距离为 ${c} 的点有两个：${ends.map(plainPt).join(" 和 ")}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** PerpSetup is a point P, a slanted line through F, and F, the foot of the perpendicular from P. */
interface PerpSetup {
  readonly P: Point;
  readonly F: Point;
  readonly m: Q;
  readonly b: Q;
  /** n is the squared distance PF. */
  readonly n: number;
  readonly standard: boolean;
}

/** perpSetup draws a point and a slanted line whose closest point to it has integer coordinates. */
function perpSetup(rng: Rng): PerpSetup {
  let dx: number;
  let dy: number;
  do {
    dx = rng.int(1, 4);
    dy = rng.nonZero(-4, 4);
  } while (gcd(dx, dy) !== 1);
  const F: Point = [rng.int(-5, 5), rng.int(-5, 5)];
  const s = rng.nonZero(-2, 2);
  const P: Point = [F[0] - s * dy, F[1] + s * dx];
  const m = Q.of(dy, dx);
  return { P, F, m, b: interceptThrough(m, F[0], F[1]), n: s * s * (dx * dx + dy * dy), standard: rng.bool() };
}

/** footSteps explains in four steps how to find the foot of the perpendicular from P to the line. */
function footSteps(s: PerpSetup): Text {
  const { P, F, m, b } = s;
  const p = Q.one.div(m).neg();
  const bp = interceptThrough(p, P[0], P[1]);
  const pp = p.mul(Q.of(P[0]));
  const reason = slopeOf(m, b, s.standard);
  const turn = perpendicularSlope(m);
  const through = steps(`${P[1]} = ${evalAt(p, P[0], 0)} + b`, `b = ${P[1]} - ${paren(pp)} = ${num(bp)}`);
  const diff = m.sub(p);
  const meetAt = steps(
    `${linear(m, b)} = ${linear(p, bp)}`,
    `${linear(diff, 0)} = ${num(bp.sub(b))}`,
    ...(diff.eq(Q.one) ? [] : [`x = ${num(bp.sub(b))} \\div ${paren(diff)} = ${F[0]}`]),
  );
  const yStep = steps(`y = ${evalAt(m, F[0], b)} = ${F[1]}`);
  return t(
    `${stepLabel(1, "The slope of the line", "直线的斜率").en} ${reason.en}

${stepLabel(2, "The perpendicular through P", "过 P 的垂线").en} ${turn.en} Substitute $P${pointLatex(P)}$ into $y = ${num(p)}x + b$:${through}so the perpendicular is $${si(p, bp)}$.

${stepLabel(3, "Where the lines meet", "两线的交点").en} At the foot both equations hold, so set them equal and solve for $x$:${meetAt}${stepLabel(4, "The y-coordinate", "纵坐标").en} Put $x = ${F[0]}$ into the line:${yStep}So the foot of the perpendicular is $F${pointLatex(F)}$.`,
    `${stepLabel(1, "The slope of the line", "直线的斜率")["zh-CN"]}${reason["zh-CN"]}

${stepLabel(2, "The perpendicular through P", "过 P 的垂线")["zh-CN"]}${turn["zh-CN"]}把 $P${pointLatex(P)}$ 代入 $y = ${num(p)}x + b$：${through}所以垂线是 $${si(p, bp)}$。

${stepLabel(3, "Where the lines meet", "两线的交点")["zh-CN"]}垂足同时满足两个方程，令它们相等，解出 $x$：${meetAt}${stepLabel(4, "The y-coordinate", "纵坐标")["zh-CN"]}把 $x = ${F[0]}$ 代入直线方程：${yStep}所以垂足是 $F${pointLatex(F)}$。`,
  );
}

/** footFigure draws the line, P, the perpendicular from P with the right angle at its foot F as the result, and more marks. */
function footFigure(s: PerpSetup, en: string, zh: string, more: readonly PlaneMark[] = []): Figure {
  const { P, F, m } = s;
  const view = fitView([P, F]);
  return graphFigure(
    view,
    [
      lineOf(F, m),
      { kind: "line", a: P, b: F, dashed: true },
      { kind: "segment", a: P, b: F, tone: "action" },
      squareCorner(F, [Number(m.d), Number(m.n)], [P[0] - F[0], P[1] - F[1]], cornerSize(view)),
      ...more,
      { kind: "point", at: P, label: "P", dir: away(P, F) },
      { kind: "point", at: F, label: "F", dir: away(F, P), tone: "result" },
    ],
    en,
    zh,
  );
}

/** theShortestDistanceBetweenAPointAndALine finds the foot of the perpendicular and the distance from a point to a line. */
export const theShortestDistanceBetweenAPointAndALine: TopicDef = {
  id: "the-shortest-distance-between-a-point-and-a-line",
  title: t("The Shortest Distance Between a Point and a Line", "点到直线的最短距离"),
  summary: t(
    "Find the distance from a point to a horizontal or vertical line, the foot of the perpendicular to a slanted line, and the distance to it.",
    "求点到水平线或竖直线的距离、点到斜线的垂足，以及点到斜线的距离。",
  ),
  prerequisites: ["the-distance-formula", "finding-equations-of-perpendicular-lines", "intersection-of-two-lines"],
  encompasses: [
    { topic: "the-distance-formula", weight: 0.5 },
    { topic: "finding-equations-of-perpendicular-lines", weight: 0.4 },
    { topic: "intersection-of-two-lines", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.GPE.B.5"],
  intro: t(
    `A point and a line are joined by many segments, one to each point of the line. The **distance from the point to the line** is the length of the shortest of them, and the shortest is the one that meets the line at a right angle.

Take $P(2, 5)$ and the line $y = 1$. The segment straight down from $P$ meets the line at $F(2, 1)$ and has length $5 - 1 = 4$. Any other segment, say to $Q(5, 1)$, is the hypotenuse of the right triangle $PFQ$, whose leg $PF$ is $4$:

{{figure 0}}

so it is longer: $PQ = \\sqrt{3^2 + 4^2} = 5$. The same argument works for every point of the line other than $F$, and for every line: the perpendicular segment is a leg, every other segment a hypotenuse.

So the distance from a point to a line is measured along the perpendicular, and the point where it meets the line is the **foot of the perpendicular**. For a horizontal or vertical line the perpendicular follows the grid. For a slanted line we write the perpendicular through the point, with the negative reciprocal slope, find where it meets the line, and measure with the distance formula.`,
    `一个点和一条直线之间可以连出许多线段，直线上每个点都有一条。**点到直线的距离**是其中最短那条的长度，而最短的那条与直线成直角。

取 $P(2, 5)$ 和直线 $y = 1$。从 $P$ 竖直向下的线段与直线交于 $F(2, 1)$，长 $5 - 1 = 4$。任何别的线段，比如到 $Q(5, 1)$ 的那条，是直角三角形 $PFQ$ 的斜边，而直角边 $PF$ 长 $4$：

{{figure 0}}

所以它更长：$PQ = \\sqrt{3^2 + 4^2} = 5$。对直线上 $F$ 以外的每个点、对每条直线，道理都一样：垂线段是直角边，其他线段都是斜边。

所以点到直线的距离沿垂线来量，垂线与直线的交点叫**垂足**。对水平线或竖直线，垂线沿着网格。对斜线，先写出过该点、斜率为负倒数的垂线，求出它与直线的交点，再用距离公式量出距离。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
      [
        uprightOf(false, 1),
        { kind: "segment", a: [2, 5], b: [2, 1], tone: "result" },
        { kind: "segment", a: [2, 5], b: [5, 1], dashed: true, tone: "action" },
        squareCorner([2, 1], [1, 0], [0, 1], 0.35),
        { kind: "label", at: [2, 3], text: "4", dir: "w" },
        { kind: "label", at: [3.5, 3], text: "5", dir: "ne" },
        { kind: "point", at: [2, 5], label: "P", dir: "n" },
        { kind: "point", at: [2, 1], label: "F", dir: "sw" },
        { kind: "point", at: [5, 1], label: "Q", dir: "se" },
      ],
      "The point P(2, 5) above the line y = 1. The perpendicular segment PF to F(2, 1) has length 4; the slanted segment PQ to Q(5, 1) has length 5.",
      "直线 y = 1 上方的点 P(2, 5)。到 F(2, 1) 的垂线段 PF 长 4；到 Q(5, 1) 的斜线段 PQ 长 5。",
    ),
  ],
  knowledgePoints: [
    {
      id: "distance-to-horizontal-and-vertical-lines",
      figure: coordinateDrawings["distance-to-horizontal-and-vertical-lines"],
      title: t("Distance to a horizontal or vertical line", "点到水平线或竖直线的距离"),
      explanation: t(
        `The shortest segment from a point to a line is perpendicular to the line. To a **vertical** line $x = a$ that segment is horizontal, so only the $x$-coordinate changes along it, and the distance from $(x_0, y_0)$ is $|x_0 - a|$. To a **horizontal** line $y = c$ the segment is vertical, and the distance is $|y_0 - c|$. The absolute value makes the distance positive whichever side of the line the point is on.

The point $(-3, 5)$ is $|-3 - 4| = 7$ units from $x = 4$: the foot of the perpendicular is $(4, 5)$, $7$ to the right. It is $|5 - (-1)| = 6$ units from $y = -1$.

> **Watch out.** Use the coordinate that changes along the perpendicular: for the vertical line $x = 4$, the $x$-coordinate $-3$, not the $y$-coordinate $5$. Then subtract the line's number: $|-3 - 4| = 7$. Adding them, $|-3 + 4| = 1$, or adding their sizes, $3 + 4$, gives the right answer only by accident.`,
        `从点到直线的最短线段垂直于这条直线。到**竖直**直线 $x = a$ 的这条线段是水平的，沿着它只有 $x$ 坐标变化，所以点 $(x_0, y_0)$ 到它的距离是 $|x_0 - a|$。到**水平**直线 $y = c$ 的线段是竖直的，距离是 $|y_0 - c|$。无论点在直线的哪一侧，绝对值都保证距离为正。

点 $(-3, 5)$ 到 $x = 4$ 的距离是 $|-3 - 4| = 7$：垂足是 $(4, 5)$，在右边 $7$ 处。它到 $y = -1$ 的距离是 $|5 - (-1)| = 6$。

> **注意。** 用沿垂线变化的那个坐标：对竖直直线 $x = 4$，用横坐标 $-3$，不用纵坐标 $5$。然后减去直线的数：$|-3 - 4| = 7$。把它们相加，$|-3 + 4| = 1$，或者把大小相加，$3 + 4$，只是碰巧才会对。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const P: [number, number] = [rng.int(-9, 9), rng.int(-9, 9)];
        const vertical = kind === 0 || kind === 2;
        let c = kind >= 2 ? 0 : rng.int(-9, 9);
        const own = vertical ? P[0] : P[1];
        if (kind < 2 && c === own) c = own === 9 ? 8 : own + 1;
        if (kind >= 2 && own === 0) P[vertical ? 0 : 1] = rng.pick([-5, -3, 4, 6]);
        const coord = vertical ? P[0] : P[1];
        const otherCoord = vertical ? P[1] : P[0];
        const answer = Math.abs(coord - c);
        const given = [
          t(`the line $x = ${c}$`, `直线 $x = ${c}$`),
          t(`the line $y = ${c}$`, `直线 $y = ${c}$`),
          t("the $y$-axis", "$y$ 轴"),
          t("the $x$-axis", "$x$ 轴"),
        ][kind]!;
        const lineEq = `${vertical ? "x" : "y"} = ${c}`;
        const v = vertical ? "x" : "y";
        const F: Point = vertical ? [c, P[1]] : [P[0], c];
        const view = fitView([P, F]);
        const figure: Figure = {
          svg: plane(view, [uprightOf(vertical, c), { kind: "point", at: P, label: "P", dir: "ne" }]),
          alt: t(`The point P${plainPt(P)} and the line ${lineEq}.`, `点 P${plainPt(P)} 和直线 ${lineEq}。`),
        };
        const name =
          kind >= 2
            ? t(
                `${given.en === "the $y$-axis" ? "The $y$-axis" : "The $x$-axis"} is the line $${lineEq}$, which`,
                `${given["zh-CN"]}就是直线 $${lineEq}$，它`,
              )
            : t(`The line $${lineEq}$`, `直线 $${lineEq}$ `);
        return {
          ...numberProblem({
            prompt: t(
              `Find the distance from the point $P${pointLatex(P)}$ to ${given.en}.`,
              `求点 $P${pointLatex(P)}$ 到${given["zh-CN"]}的距离。`,
            ),
            answer,
            wrong: [Math.abs(otherCoord - c), Math.abs(coord + c), Math.abs(coord) + Math.abs(c)],
            solution: t(
              `${stepLabel(1, "The direction of the perpendicular", "垂线的方向").en} ${name.en} is${vertical ? "vertical" : "horizontal"}, so the shortest segment from $P$ to it is ${vertical ? "horizontal" : "vertical"}. It ends at the foot $F${pointLatex(F)}$, which has the line's $${v}$-coordinate and keeps the other coordinate of $P$.

${stepLabel(2, `The change in ${v}`, `${v} 的变化`).en} Only the $${v}$-coordinate changes from $P$ to $F$:${steps(`|${coord} - ${paren(c)}| = ${answer}`)}{{figure 0}}

**Check.** $F${pointLatex(F)}$ lies on $${lineEq}$, and the distance formula gives the same length: $PF = \\sqrt{${paren(F[0] - P[0])}^2 + ${paren(F[1] - P[1])}^2} = \\sqrt{${answer * answer}} = ${answer}$.`,
              `${stepLabel(1, "The direction of the perpendicular", "垂线的方向")["zh-CN"]}${name["zh-CN"]}是${vertical ? "竖直" : "水平"}的，所以从 $P$ 到它的最短线段是${vertical ? "水平" : "竖直"}的。它的终点是垂足 $F${pointLatex(F)}$：$${v}$ 坐标取直线的值，另一个坐标与 $P$ 相同。

${stepLabel(2, `The change in ${v}`, `${v} 的变化`)["zh-CN"]}从 $P$ 到 $F$ 只有 $${v}$ 坐标变化：${steps(`|${coord} - ${paren(c)}| = ${answer}`)}{{figure 0}}

**检验。** $F${pointLatex(F)}$ 在 $${lineEq}$ 上，用距离公式算得同样的长度：$PF = \\sqrt{${paren(F[0] - P[0])}^2 + ${paren(F[1] - P[1])}^2} = \\sqrt{${answer * answer}} = ${answer}$。`,
            ),
          }),
          figure,
          solutionFigures: [
            overlay(
              figure,
              view,
              [
                { kind: "arrow", from: P, to: F, tone: "action" },
                squareCorner(F, vertical ? [0, 1] : [1, 0], [P[0] - F[0], P[1] - F[1]], cornerSize(view)),
                { kind: "label", at: [(P[0] + F[0]) / 2, (P[1] + F[1]) / 2], text: String(answer), dir: vertical ? "s" : "e" },
                { kind: "point", at: F, label: "F", dir: vertical ? (P[0] > c ? "w" : "e") : P[1] > c ? "s" : "n", tone: "result" },
              ],
              `The perpendicular from P meets the line at F${plainPt(F)}; the distance is ${answer}.`,
              `从 P 作的垂线与直线交于 F${plainPt(F)}；距离是 ${answer}。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-foot-of-the-perpendicular",
      figure: coordinateDrawings["the-foot-of-the-perpendicular"],
      title: t("The foot of the perpendicular", "垂足"),
      explanation: t(
        `The point of a line closest to a point $P$ is the **foot of the perpendicular** $F$: where the line through $P$ perpendicular to the given line meets it. Finding it combines two earlier skills:

1. Write the perpendicular through $P$, with the negative reciprocal slope.
2. Solve the two equations together: at their intersection both hold, so set the right sides equal.

For $P(1, 7)$ and $y = 2x$: the perpendicular slope is $-\\frac{1}{2}$, and substituting $P$ into $y = -\\frac{1}{2}x + b$ gives $7 = -\\frac{1}{2} + b$, so $b = \\frac{15}{2}$. Setting $2x = -\\frac{1}{2}x + \\frac{15}{2}$ gives $\\frac{5}{2}x = \\frac{15}{2}$, so $x = 3$, and then $y = 2 \\cdot 3 = 6$: $F = (3, 6)$.

> **Watch out.** Dropping straight down from $P$ to the line, to $(1, 2)$ here, or moving straight across to it, gives a point of the line but not the closest one: those segments are perpendicular to the axes, not to the line. Only for a horizontal or vertical line is the foot directly below or beside $P$. And write the point as $(x, y)$ with the $x$ you solved for first.`,
        `直线上离点 $P$ 最近的点是**垂足** $F$：过 $P$ 作已知直线的垂线，垂线与已知直线的交点。求垂足要用到两个学过的技能：

1. 用负倒数斜率写出过 $P$ 的垂线。
2. 把两个方程联立：交点同时满足两个方程，所以令右边相等。

对 $P(1, 7)$ 和 $y = 2x$：垂线斜率是 $-\\frac{1}{2}$，把 $P$ 代入 $y = -\\frac{1}{2}x + b$ 得 $7 = -\\frac{1}{2} + b$，所以 $b = \\frac{15}{2}$。令 $2x = -\\frac{1}{2}x + \\frac{15}{2}$，得 $\\frac{5}{2}x = \\frac{15}{2}$，$x = 3$，于是 $y = 2 \\cdot 3 = 6$：$F = (3, 6)$。

> **注意。** 从 $P$ 竖直落到直线上（这里是 $(1, 2)$），或者水平移到直线上，得到的点虽在直线上，却不是最近的：那些线段垂直于坐标轴，而不是垂直于直线。只有直线是水平或竖直时，垂足才在 $P$ 的正下方或正侧方。写点时按 $(x, y)$ 的顺序，先写解出的 $x$。`,
      ),
      keyPrerequisites: ["intersection-of-two-lines"],
      generate(rng) {
        const s = perpSetup(rng);
        const { P, F, m, b } = s;
        const line = lineIn(m, b, s.standard);
        const wrong: Coefficient[][] = [
          [P[0], m.mul(Q.of(P[0])).add(b)],
          [F[1], F[0]],
        ];
        wrong.push([Q.of(P[1]).sub(b).div(m), P[1]]);
        const foot = footSteps(s);
        const p = Q.one.div(m).neg();
        const [rx, ry] = [F[0] - P[0], F[1] - P[1]];
        return {
          ...pointProblem({
            prompt: t(
              `Find the point on the line $${line}$ that is closest to $P${pointLatex(P)}$.`,
              `求直线 $${line}$ 上离点 $P${pointLatex(P)}$ 最近的点。`,
            ),
            answer: F,
            wrong,
            solution: t(
              `The closest point is the foot of the perpendicular from $P$.

${foot.en}

{{figure 0}}

**Check.** $F$ is on the line: $${evalAt(m, F[0], b)} = ${F[1]}$. And $\\overline{PF}$ is perpendicular to it: its slope is $\\frac{${ry}}{${rx}} = ${num(p)}$, and $${productCheck(m, p)}$.`,
              `最近的点就是从 $P$ 作垂线的垂足。

${foot["zh-CN"]}

{{figure 0}}

**检验。** $F$ 在直线上：$${evalAt(m, F[0], b)} = ${F[1]}$。$\\overline{PF}$ 与直线垂直：它的斜率是 $\\frac{${ry}}{${rx}} = ${num(p)}$，且 $${productCheck(m, p)}$。`,
            ),
          }),
          solutionFigures: [
            footFigure(
              s,
              `The perpendicular from P${plainPt(P)} meets the line at F${plainPt(F)}.`,
              `从 P${plainPt(P)} 作的垂线与直线交于 F${plainPt(F)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "distance-from-a-point-to-a-line",
      figure: coordinateDrawings["distance-from-a-point-to-a-line"],
      title: t("The distance from a point to a line", "点到直线的距离"),
      explanation: t(
        `To find the distance from $P$ to a slanted line, find the foot of the perpendicular $F$ as before, then the length $PF$ with the distance formula.

For $P(1, 7)$ and $y = 2x$, the foot is $F(3, 6)$, so the distance is

$$PF = \\sqrt{(3 - 1)^2 + (6 - 7)^2} = \\sqrt{4 + 1} = \\sqrt{5}.$$

There is also a formula that skips the foot: the distance from $(x_0, y_0)$ to the line $Ax + By = C$ is $\\frac{|Ax_0 + By_0 - C|}{\\sqrt{A^2 + B^2}}$. It makes a good check. Here the line is $2x - y = 0$, so the distance is $\\frac{|2 \\cdot 1 - 7|}{\\sqrt{4 + 1}} = \\frac{5}{\\sqrt{5}} = \\sqrt{5}$.

> **Watch out.** The vertical gap from $P$ to the line, $7 - 2 = 5$ here, is not the distance: that segment is vertical, not perpendicular to the line, so it is longer. The same goes for the horizontal gap. And finish with the square root: $PF^2 = 5$, so $PF = \\sqrt{5}$, not $5$.`,
        `求点 $P$ 到一条斜线的距离，先像前面那样求垂足 $F$，再用距离公式求 $PF$。

对 $P(1, 7)$ 和 $y = 2x$，垂足是 $F(3, 6)$，所以距离是

$$PF = \\sqrt{(3 - 1)^2 + (6 - 7)^2} = \\sqrt{4 + 1} = \\sqrt{5}.$$

还有一个不用求垂足的公式：点 $(x_0, y_0)$ 到直线 $Ax + By = C$ 的距离是 $\\frac{|Ax_0 + By_0 - C|}{\\sqrt{A^2 + B^2}}$，很适合用来检验。这里直线是 $2x - y = 0$，所以距离是 $\\frac{|2 \\cdot 1 - 7|}{\\sqrt{4 + 1}} = \\frac{5}{\\sqrt{5}} = \\sqrt{5}$。

> **注意。** 从 $P$ 到直线的竖直距离，这里是 $7 - 2 = 5$，并不是所求距离：那条线段是竖直的，不垂直于直线，所以更长。水平距离也一样。最后要开平方：$PF^2 = 5$，所以 $PF = \\sqrt{5}$，不是 $5$。`,
      ),
      generate(rng) {
        const s = perpSetup(rng);
        const { P, F, m, b, n } = s;
        const line = lineIn(m, b, s.standard);
        const vertical = Q.of(P[1])
          .sub(m.mul(Q.of(P[0])).add(b))
          .abs();
        const horizontal = Q.of(P[0]).sub(Q.of(P[1]).sub(b).div(m)).abs();
        const foot = footSteps(s);
        const dist = steps(`PF = ${distanceSteps(P, F)}`);
        const [A, B, C] = standardOf(m.neg(), 1, b);
        const N = A * P[0] + B * P[1] - C;
        const S = A * A + B * B;
        const formula = `\\frac{|${A} \\cdot ${paren(P[0])} ${B < 0 ? "-" : "+"} ${Math.abs(B)} \\cdot ${paren(P[1])} - ${paren(C)}|}{\\sqrt{${A}^2 + ${paren(B)}^2}} = \\frac{${Math.abs(N)}}{\\sqrt{${S}}} = \\sqrt{\\frac{${N * N}}{${S}}} = ${rootSteps(n)}`;
        return {
          ...radicalProblem({
            prompt: t(
              `Find the distance from the point $P${pointLatex(P)}$ to the line $${line}$. Write it in simplest radical form.`,
              `求点 $P${pointLatex(P)}$ 到直线 $${line}$ 的距离，用最简根式表示。`,
            ),
            answer: simplifyRadical(n),
            wrong: [num(vertical), num(horizontal), String(n)],
            solution: t(
              `The distance is measured along the perpendicular, so first find its foot $F$.

${foot.en}

${stepLabel(5, "The distance PF", "距离 PF").en} Use the distance formula from $P$ to $F$:${dist}{{figure 0}}

**Check.** In standard form the line is $${std(A, B, C)}$, and the point-to-line formula gives the same distance:${steps(formula)}`,
              `距离沿垂线来量，所以先求垂足 $F$。

${foot["zh-CN"]}

${stepLabel(5, "The distance PF", "距离 PF")["zh-CN"]}用距离公式求 $P$ 到 $F$ 的距离：${dist}{{figure 0}}

**检验。** 直线的标准式是 $${std(A, B, C)}$，用点到直线的距离公式得到同样的距离：${steps(formula)}`,
            ),
          }),
          solutionFigures: [
            footFigure(
              s,
              `The perpendicular from P${plainPt(P)} meets the line at F${plainPt(F)}, at distance ${root(n)}.`,
              `从 P${plainPt(P)} 作的垂线与直线交于 F${plainPt(F)}，距离是 ${root(n)}。`,
              legsOf(P, F),
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Perimeters and areas
// ---------------------------------------------------------------------------

/** Shape is a polygon with named vertices. */
interface Shape {
  readonly names: readonly string[];
  readonly pts: readonly Point[];
  readonly kind: Text;
}

/** wholeShape draws a polygon whose sides are horizontal, vertical or hypotenuses of Pythagorean triangles. */
function wholeShape(rng: Rng): Shape {
  const [p, q] = rng.pick(smallTriples);
  const T = flip([rng.int(-4, 1), rng.int(-4, 1)], rng.sign(), rng.sign());
  const kind = rng.int(0, 3);
  if (kind === 0)
    return {
      names: ["A", "B", "C"],
      pts: [T([0, 0]), T([p, 0]), T([p, q])],
      kind: t("triangle", "三角形"),
    };
  if (kind === 1)
    return {
      names: ["A", "B", "C"],
      pts: [T([0, 0]), T([2 * p, 0]), T([p, q])],
      kind: t("triangle", "三角形"),
    };
  if (kind === 2) {
    const w = rng.int(2, 6);
    return {
      names: ["A", "B", "C", "D"],
      pts: [T([0, 0]), T([w, 0]), T([w + p, q]), T([p, q])],
      kind: t("parallelogram", "平行四边形"),
    };
  }
  return {
    names: ["A", "B", "C", "D"],
    pts: [T([0, 0]), T([p, -q]), T([2 * p, 0]), T([p, q])],
    kind: t("rhombus", "菱形"),
  };
}

/** sides are the squared side lengths of a polygon. */
const sidesOf = (pts: readonly Point[]) => pts.map((p, i) => sq(p, pts[(i + 1) % pts.length]!));

/** sideSteps writes the length of each side of a polygon. */
function sideSteps(s: Shape): string {
  return steps(
    ...s.pts.map((p, i) => {
      const j = (i + 1) % s.pts.length;
      return `${s.names[i]}${s.names[j]} = ${distanceSteps(p, s.pts[j]!)}`;
    }),
  );
}

/** shapeName writes "triangle ABC" or "parallelogram ABCD". */
const shapeName = (s: Shape) => t(`${s.kind.en} $${s.names.join("")}$`, `${s.kind["zh-CN"]} $${s.names.join("")}$`);

/** shapeFigureOf draws a shape in the coordinate plane. */
const shapeFigureOf = (s: Shape) =>
  shapeFigure(
    s.names,
    s.pts,
    `A ${s.kind.en} with vertices ${listPts(s.names, s.pts)}.`,
    `一个${s.kind["zh-CN"]}，顶点为 ${listPts(s.names, s.pts)}。`,
  );

/** taxiOf adds the runs and the rises of all the sides of a polygon, as positive numbers. */
const taxiOf = (pts: readonly Point[]) =>
  pts.reduce((acc, p, i) => {
    const r = pts[(i + 1) % pts.length]!;
    return acc + Math.abs(r[0] - p[0]) + Math.abs(r[1] - p[1]);
  }, 0);

/** taxiCheck writes why the perimeter is less than the sum of the runs and rises of the sides. */
const taxiCheck = (pts: readonly Point[]) => {
  const T = taxiOf(pts);
  return t(
    `Each slanted side is the hypotenuse of a right triangle, so it is shorter than its run and rise together; the perimeter must be less than the sum of all the runs and rises, $${T}$`,
    `每条斜着的边都是一个直角三角形的斜边，比它的水平变化与竖直变化之和短；所以周长一定小于所有水平变化与竖直变化之和 $${T}$`,
  );
};

/** decimalOf is the value of a sum of square roots. */
const decimalOf = (ns: readonly number[]) => ns.reduce((a, n) => a + Math.sqrt(n), 0);

/** calculatingPerimetersInThePlane finds perimeters of polygons from the coordinates of their vertices. */
export const calculatingPerimetersInThePlane: TopicDef = {
  id: "calculating-perimeters-in-the-plane",
  title: t("Calculating Perimeters in the Plane", "求坐标平面中图形的周长"),
  summary: t(
    "Find the perimeter of a polygon from the coordinates of its vertices, as a whole number or in simplest radical form.",
    "由顶点坐标求多边形的周长，结果为整数或最简根式。",
  ),
  prerequisites: ["the-distance-formula", "perimeter", "adding-and-subtracting-radicals"],
  encompasses: [
    { topic: "the-distance-formula", weight: 0.6 },
    { topic: "perimeter", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.7"],
  intro: t(
    `The perimeter of a polygon is the distance around it: the sum of the lengths of its sides. When the vertices are given by coordinates, each side is a segment between two known points, so its length comes from the distance formula.

Take the triangle with vertices $(0, 0)$, $(3, 0)$ and $(0, 4)$. Two sides lie along the axes: from $(0, 0)$ to $(3, 0)$ is $3$, and from $(0, 0)$ to $(0, 4)$ is $4$. The third side is slanted; its run is $-3$ and its rise $4$, so its length is $\\sqrt{9 + 16} = 5$:

{{figure 0}}

The perimeter is $3 + 4 + 5 = 12$. In this lesson the sides are sometimes whole numbers and sometimes square roots; then each is simplified and like radicals are combined.`,
    `多边形的周长是绕它一圈的长度，也就是各边长度之和。顶点用坐标给出时，每条边都是两个已知点之间的线段，所以它的长度可以用距离公式求出。

看顶点为 $(0, 0)$、$(3, 0)$、$(0, 4)$ 的三角形。两条边在坐标轴上：从 $(0, 0)$ 到 $(3, 0)$ 长 $3$，从 $(0, 0)$ 到 $(0, 4)$ 长 $4$。第三条边是斜的，水平变化 $-3$，竖直变化 $4$，所以它长 $\\sqrt{9 + 16} = 5$：

{{figure 0}}

周长是 $3 + 4 + 5 = 12$。这节课里，边长有时是整数，有时是平方根；是平方根时，先把每条边化简，再合并同类根式。`,
  ),
  introFigures: [
    shapeFigure(
      ["", "", ""],
      [
        [0, 0],
        [3, 0],
        [0, 4],
      ],
      "The triangle with vertices (0, 0), (3, 0) and (0, 4), with sides 3, 5 and 4.",
      "顶点为 (0, 0)、(3, 0)、(0, 4) 的三角形，三边长 3、5、4。",
      sideLabels(
        [
          [0, 0],
          [3, 0],
          [0, 4],
        ],
        ["3", "5", "4"],
      ),
    ),
  ],
  knowledgePoints: [
    {
      id: "perimeters-with-whole-number-sides",
      figure: coordinateDrawings["perimeters-with-whole-number-sides"],
      title: t("Perimeters with whole-number sides", "边长为整数的周长"),
      explanation: t(
        `The perimeter of a polygon is the sum of its side lengths. In the coordinate plane, find each side with the distance formula; a horizontal or vertical side is just the difference of the coordinates that change. Go around the polygon in order, $AB$, $BC$, … and back to the first vertex, so that no side is missed.

Triangle $A(0, 0)$, $B(6, 0)$, $C(6, 8)$ has $AB = 6$ and $BC = 8$ along the grid, and $CA = \\sqrt{6^2 + 8^2} = 10$, so its perimeter is $6 + 8 + 10 = 24$.

> **Watch out.** A slanted side is not its run plus its rise: $CA$ is $10$, not $6 + 8 = 14$, so counting grid steps overstates the perimeter. Remember the side that closes the polygon, from the last vertex back to the first. And the perimeter is the whole way around, not half of it.`,
        `多边形的周长是各边长度之和。在坐标平面中，用距离公式求每条边；水平或竖直的边只需把变化的坐标相减。按顺序绕多边形一圈，$AB$、$BC$……最后回到第一个顶点，这样就不会漏掉边。

三角形 $A(0, 0)$、$B(6, 0)$、$C(6, 8)$ 中，$AB = 6$ 和 $BC = 8$ 沿着网格，$CA = \\sqrt{6^2 + 8^2} = 10$，所以周长是 $6 + 8 + 10 = 24$。

> **注意。** 斜着的边不等于它的水平变化加竖直变化：$CA$ 是 $10$，不是 $6 + 8 = 14$，数网格步数会把周长算大。别忘了把多边形封口的那条边，从最后一个顶点回到第一个顶点。周长是绕一整圈，不是半圈。`,
      ),
      generate(rng) {
        const s = wholeShape(rng);
        const sides = sidesOf(s.pts).map((n) => Math.sqrt(n));
        const answer = sides.reduce((a, b) => a + b, 0);
        const taxi = taxiOf(s.pts);
        const name = shapeName(s);
        const four = s.pts.length === 4;
        const pair = t(
          four
            ? ` Also, opposite sides of a ${s.kind.en} are equal, so $P = 2(AB + BC) = 2(${sides[0]} + ${sides[1]}) = ${2 * (sides[0]! + sides[1]!)}$.`
            : "",
          four
            ? `另外，${s.kind["zh-CN"]}的对边相等，所以 $P = 2(AB + BC) = 2(${sides[0]} + ${sides[1]}) = ${2 * (sides[0]! + sides[1]!)}$。`
            : "",
        );
        const bound = taxiCheck(s.pts);
        return {
          ...numberProblem({
            prompt: t(
              `Find the perimeter of ${name.en} with vertices ${listTex(s.names, s.pts, "and")}.`,
              `求${name["zh-CN"]}的周长，顶点为 ${listZh(s.names, s.pts)}。`,
            ),
            answer,
            wrong: [taxi, answer / 2, sides.slice(0, -1).reduce((a, b) => a + b, 0)],
            solution: t(
              `${stepLabel(1, "Each side", "每条边").en} Go around the ${s.kind.en} and use the distance formula on each side, including the last one back to $A$:${sideSteps(s)}{{figure 0}}

${stepLabel(2, "Add the sides", "把各边相加").en} The perimeter is $${sides.join(" + ")} = ${answer}$.

**Check.** ${bound.en}, and $${answer} < ${taxi}$.${pair.en}`,
              `${stepLabel(1, "Each side", "每条边")["zh-CN"]}绕${s.kind["zh-CN"]}一圈，对每条边用距离公式，包括最后回到 $A$ 的那条：${sideSteps(s)}{{figure 0}}

${stepLabel(2, "Add the sides", "把各边相加")["zh-CN"]}周长是 $${sides.join(" + ")} = ${answer}$。

**检验。** ${bound["zh-CN"]}，而 $${answer} < ${taxi}$。${pair["zh-CN"]}`,
            ),
          }),
          figure: shapeFigureOf(s),
          solutionFigures: [
            shapeFigure(
              s.names,
              s.pts,
              `The sides are ${sides.join(", ")}, so the perimeter is ${answer}.`,
              `各边是 ${sides.join("、")}，所以周长是 ${answer}。`,
              sideLabels(s.pts, sides.map(String)),
            ),
          ],
        };
      },
    },
    {
      id: "perimeters-in-simplest-radical-form",
      figure: coordinateDrawings["perimeters-in-simplest-radical-form"],
      title: t("Perimeters in simplest radical form", "用最简根式表示周长"),
      explanation: t(
        `When some sides are irrational, write each side in simplest radical form, then add: whole numbers combine with whole numbers, and like radicals, with the same number under the root, combine by adding their coefficients, just as $2x + 2x = 4x$.

Triangle $A(0, 0)$, $B(4, 0)$, $C(2, 4)$ has $AB = 4$, $BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20} = 2\\sqrt{5}$ and $CA = \\sqrt{(-2)^2 + (-4)^2} = 2\\sqrt{5}$, so its perimeter is $4 + 2\\sqrt{5} + 2\\sqrt{5} = 4 + 4\\sqrt{5}$.

> **Watch out.** Simplify each root before adding, or like radicals are hidden: $\\sqrt{20} + \\sqrt{20}$ is $4\\sqrt{5}$. Roots do not add under one sign: $\\sqrt{20} + \\sqrt{20}$ is not $\\sqrt{40}$. And a slanted side is not its run plus its rise.`,
        `有的边长是无理数时，先把每条边写成最简根式，再相加：整数与整数合并；同类根式（根号里的数相同）把系数相加来合并，就像 $2x + 2x = 4x$。

三角形 $A(0, 0)$、$B(4, 0)$、$C(2, 4)$ 中，$AB = 4$，$BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20} = 2\\sqrt{5}$，$CA = \\sqrt{(-2)^2 + (-4)^2} = 2\\sqrt{5}$，所以周长是 $4 + 2\\sqrt{5} + 2\\sqrt{5} = 4 + 4\\sqrt{5}$。

> **注意。** 相加前先把每个根式化简，否则看不出哪些是同类根式：$\\sqrt{20} + \\sqrt{20}$ 等于 $4\\sqrt{5}$。根式不能合到一个根号下相加：$\\sqrt{20} + \\sqrt{20}$ 不是 $\\sqrt{40}$。斜着的边也不等于它的水平变化加竖直变化。`,
      ),
      keyPrerequisites: ["adding-and-subtracting-radicals"],
      generate(rng) {
        let s: Shape;
        let ns: number[];
        for (;;) {
          const A: Point = [rng.int(-5, 3), rng.int(-5, 3)];
          const u: Point = [rng.int(-2, 5), rng.int(-2, 5)];
          const v: Point = [rng.int(-5, 2), rng.int(1, 5)];
          if (u[0] * v[1] - u[1] * v[0] === 0) continue;
          if (rng.bool()) {
            s = {
              names: ["A", "B", "C"],
              pts: [A, [A[0] + u[0], A[1] + u[1]], [A[0] + v[0], A[1] + v[1]]],
              kind: t("triangle", "三角形"),
            };
          } else {
            s = {
              names: ["A", "B", "C", "D"],
              pts: [A, [A[0] + u[0], A[1] + u[1]], [A[0] + u[0] + v[0], A[1] + u[1] + v[1]], [A[0] + v[0], A[1] + v[1]]],
              kind: t("parallelogram", "平行四边形"),
            };
          }
          ns = sidesOf(s.pts);
          if (ns.some((n) => !Number.isInteger(Math.sqrt(n)))) break;
        }
        const answer = radicalSum(ns);
        const terms = ns.map(rootTex).join(" + ");
        const total = ns.reduce((a, b) => a + b, 0);
        const taxi = taxiOf(s.pts);
        const name = shapeName(s);
        const value = decimal2(decimalOf(ns));
        const bound = taxiCheck(s.pts);
        const four = s.pts.length === 4;
        const pair = t(
          four ? " Opposite sides of a parallelogram are equal, and indeed $AB = CD$ and $BC = DA$." : "",
          four ? "平行四边形的对边相等，确实有 $AB = CD$、$BC = DA$。" : "",
        );
        return {
          ...expressionProblem({
            prompt: t(
              `Find the perimeter of ${name.en} with vertices ${listTex(s.names, s.pts, "and")}. Write it in simplest radical form.`,
              `求${name["zh-CN"]}的周长，顶点为 ${listZh(s.names, s.pts)}。用最简根式表示。`,
            ),
            answer,
            radical: true,
            wrong: [ns.map((n) => `\\sqrt{${n}}`).join(" + "), rootTex(total), String(taxi)],
            solution: t(
              `${stepLabel(1, "Each side", "每条边").en} Use the distance formula on each side, simplifying each root:${sideSteps(s)}{{figure 0}}

${stepLabel(2, "Add, combining like terms", "相加并合并同类项").en} Whole numbers add to whole numbers, and roots of the same number add their coefficients:${steps(`${terms} = ${answer}`)}**Check.** As a decimal $${terms} \\approx ${value}$, and the simplified form $${answer}$ is also about $${value}$.${pair.en} ${bound.en}, and $${value} < ${taxi}$.`,
              `${stepLabel(1, "Each side", "每条边")["zh-CN"]}对每条边用距离公式，并化简每个根式：${sideSteps(s)}{{figure 0}}

${stepLabel(2, "Add, combining like terms", "相加并合并同类项")["zh-CN"]}整数与整数相加，根号里数相同的根式把系数相加：${steps(`${terms} = ${answer}`)}**检验。** 化成小数，$${terms} \\approx ${value}$，化简后的 $${answer}$ 也约等于 $${value}$。${pair["zh-CN"]}${bound["zh-CN"]}，而 $${value} < ${taxi}$。`,
            ),
          }),
          figure: shapeFigureOf(s),
          solutionFigures: [
            shapeFigure(
              s.names,
              s.pts,
              `The sides are ${ns.map(root).join(", ")}.`,
              `各边是 ${ns.map(root).join("、")}。`,
              sideLabels(s.pts, ns.map(root)),
            ),
          ],
        };
      },
    },
  ],
};

/** boxCorners are the right triangles between a convex polygon and the rectangle around it, one for each slanted side. */
function boxCorners(pts: readonly Point[]): Point[][] {
  const area2 = pts.reduce((acc, p, i) => {
    const q = pts[(i + 1) % pts.length]!;
    return acc + p[0] * q[1] - q[0] * p[1];
  }, 0);
  const turn = area2 > 0 ? 1 : -1;
  const out: Point[][] = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length]!;
    if (p[0] === q[0] || p[1] === q[1]) return;
    const c1: Point = [q[0], p[1]];
    const cross = (q[0] - p[0]) * (c1[1] - p[1]) - (q[1] - p[1]) * (c1[0] - p[0]);
    out.push([p, cross * turn < 0 ? c1 : [p[0], q[1]], q]);
  });
  return out;
}

/** boxSize is the width and the height of the rectangle around some points. */
function boxSize(pts: readonly Point[]): [number, number] {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
}

/** boxSubtraction writes the area of a convex polygon as the rectangle around it minus the right triangles at its corners. */
function boxSubtraction(pts: readonly Point[]): { readonly lines: string; readonly area: Q; readonly W: number; readonly H: number } {
  const [W, H] = boxSize(pts);
  const legsAt = boxCorners(pts).map((c): [number, number] => [Math.abs(c[2]![0] - c[0]![0]), Math.abs(c[2]![1] - c[0]![1])]);
  const halves = legsAt.map(([a, b]) => half(a * b));
  const area = halves.reduce((acc, h) => acc.sub(h), Q.of(W * H));
  const lines = steps(
    ...legsAt.map(([a, b], i) => `\\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${halves[i]!.toLatex()}`),
    `${W} \\cdot ${H} - ${halves.map((h) => h.toLatex()).join(" - ")} = ${area.toLatex()}`,
  );
  return { lines, area, W, H };
}

/** boxFigure draws a shape with the dashed rectangle around it. */
function boxFigure(s: Shape, en: string, zh: string, more: readonly PlaneMark[] = []): Figure {
  const xs = s.pts.map((p) => p[0]);
  const ys = s.pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const corners: Point[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ];
  const box: PlaneMark[] = corners.map((p, i) => ({ kind: "segment", a: p, b: corners[(i + 1) % 4]!, dashed: true }));
  return shapeFigure(s.names, s.pts, en, zh, [...more, ...box]);
}

/** cutCorners shades the right triangles of the box around a figure that lie outside it, and the figure as the result. */
const cutCorners = (pts: readonly Point[], corners: readonly (readonly Point[])[]): PlaneMark[] => [
  ...corners.map((points): PlaneMark => ({ kind: "polygon", points, tone: "action" })),
  { kind: "polygon", points: pts, tone: "result" },
];

/** squareOf writes the square of a coordinate change, with parentheses around a negative number or a fraction. */
const squareOf = (q: Q) => (q.d === 1n && q.sign() >= 0 ? `${num(q)}^2` : `\\left(${num(q)}\\right)^2`);

/** calculatingAreasOfRectanglesInThePlane finds areas of rectangles and squares from the coordinates of their vertices. */
export const calculatingAreasOfRectanglesInThePlane: TopicDef = {
  id: "calculating-areas-of-rectangles-in-the-plane",
  title: t("Calculating Areas of Rectangles in the Plane", "求坐标平面中矩形的面积"),
  summary: t(
    "Find the area of a rectangle or a square from the coordinates of its vertices, whether or not its sides are horizontal and vertical.",
    "由顶点坐标求矩形或正方形的面积，无论它的边是否水平或竖直。",
  ),
  prerequisites: ["the-distance-formula", "area-of-rectangles-and-squares"],
  encompasses: [
    { topic: "the-distance-formula", weight: 0.4 },
    { topic: "area-of-rectangles-and-squares", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.GPE.B.7"],
  intro: t(
    `The area of a rectangle is its length times its width: that many unit squares fit inside it. In the coordinate plane the length and width come from the coordinates of the vertices.

The rectangle with vertices $(1, 1)$, $(5, 1)$, $(5, 4)$ and $(1, 4)$ runs from $x = 1$ to $x = 5$ and from $y = 1$ to $y = 4$, so it is $5 - 1 = 4$ wide and $4 - 1 = 3$ tall. Its area is $4 \\cdot 3 = 12$, and indeed $12$ grid squares fill it:

{{figure 0}}

When the sides are horizontal and vertical, the lengths are differences of coordinates. When the rectangle is tilted, its sides are slanted segments, measured with the distance formula; the area is still length times width. For a square, two vertices are enough.`,
    `矩形的面积是长乘宽：里面能放下这么多个单位正方形。在坐标平面中，长和宽由顶点的坐标得到。

顶点为 $(1, 1)$、$(5, 1)$、$(5, 4)$、$(1, 4)$ 的矩形从 $x = 1$ 到 $x = 5$、从 $y = 1$ 到 $y = 4$，所以宽 $5 - 1 = 4$，高 $4 - 1 = 3$。它的面积是 $4 \\cdot 3 = 12$，里面确实正好有 $12$ 个网格小方块：

{{figure 0}}

边水平和竖直时，边长就是坐标之差。矩形倾斜时，它的边是斜线段，用距离公式来量；面积仍然是长乘宽。对正方形，知道两个顶点就够了。`,
  ),
  introFigures: [
    shapeFigure(
      ["", "", "", ""],
      [
        [1, 1],
        [5, 1],
        [5, 4],
        [1, 4],
      ],
      "The rectangle with vertices (1, 1), (5, 1), (5, 4) and (1, 4), 4 wide and 3 tall, filled by 12 grid squares.",
      "顶点为 (1, 1)、(5, 1)、(5, 4)、(1, 4) 的矩形，宽 4、高 3，里面有 12 个网格小方块。",
      [
        {
          kind: "polygon",
          points: [
            [1, 1],
            [5, 1],
            [5, 4],
            [1, 4],
          ],
          tone: "result",
        },
        ...sideLabels(
          [
            [1, 1],
            [5, 1],
            [5, 4],
            [1, 4],
          ],
          ["4", "3", "", ""],
        ),
      ],
    ),
  ],
  knowledgePoints: [
    {
      id: "rectangles-with-horizontal-and-vertical-sides",
      figure: coordinateDrawings["rectangles-with-horizontal-and-vertical-sides"],
      title: t("Rectangles with horizontal and vertical sides", "边水平、竖直的矩形"),
      explanation: t(
        `When the sides of a rectangle are horizontal and vertical, a horizontal side keeps its $y$-coordinate and changes only $x$, so the width is the difference of the $x$-coordinates. In the same way the height is the difference of the $y$-coordinates. Two opposite vertices are enough: one gives the smallest $x$ and $y$, the other the largest.

The rectangle with vertices $A(-3, -1)$, $B(4, -1)$, $C(4, 5)$ and $D(-3, 5)$ has width $4 - (-3) = 7$ and height $5 - (-1) = 6$, so its area is $7 \\cdot 6 = 42$.

> **Watch out.** Area multiplies; perimeter adds. $7 + 6$ and $2(7 + 6)$ are lengths, not areas. Count the gaps between grid lines, not the grid lines themselves: from $x = -3$ to $x = 4$ there are $7$ units, though $8$ grid lines; $(7 + 1)(6 + 1)$ counts lattice points, not unit squares.`,
        `矩形的边水平和竖直时，水平的边 $y$ 坐标不变、只有 $x$ 变化，所以宽是 $x$ 坐标之差。同样，高是 $y$ 坐标之差。知道两个相对的顶点就够了：一个给出最小的 $x$ 和 $y$，另一个给出最大的。

顶点为 $A(-3, -1)$、$B(4, -1)$、$C(4, 5)$、$D(-3, 5)$ 的矩形，宽为 $4 - (-3) = 7$，高为 $5 - (-1) = 6$，所以面积是 $7 \\cdot 6 = 42$。

> **注意。** 面积是相乘，周长才是相加。$7 + 6$ 和 $2(7 + 6)$ 是长度，不是面积。数的是网格线之间的间隔，不是网格线本身：从 $x = -3$ 到 $x = 4$ 有 $7$ 个单位，却有 $8$ 条网格线；$(7 + 1)(6 + 1)$ 数的是格点，不是单位正方形。`,
      ),
      generate(rng) {
        const x1 = rng.int(-8, 4);
        const y1 = rng.int(-8, 4);
        const w = rng.int(2, 9);
        const h = rng.int(2, 9);
        const [x2, y2] = [x1 + w, y1 + h];
        const pts: Point[] = [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
        ];
        const names = ["A", "B", "C", "D"];
        const opposite = rng.bool();
        const prompt = opposite
          ? t(
              `A rectangle has sides parallel to the axes and opposite vertices $${pointLatex([x1, y2])}$ and $${pointLatex([x2, y1])}$. Find its area.`,
              `一个矩形的边与坐标轴平行，两个相对的顶点是 $${pointLatex([x1, y2])}$ 和 $${pointLatex([x2, y1])}$。求它的面积。`,
            )
          : t(
              `Find the area of rectangle $ABCD$ with vertices ${listTex(names, pts, "and")}.`,
              `求矩形 $ABCD$ 的面积，顶点为 ${listZh(names, pts)}。`,
            );
        const corners = opposite
          ? t(
              ` The other two vertices are $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$.`,
              `另外两个顶点是 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。`,
            )
          : t("", "");
        const solutionNames = opposite ? pts.map(plainPt) : names;
        const area = w * h;
        const problem = numberProblem({
          prompt,
          answer: area,
          wrong: [2 * (w + h), w + h, (w + 1) * (h + 1)],
          solution: t(
            `${stepLabel(1, "The width", "宽").en} The sides are horizontal and vertical, so the rectangle runs from $x = ${x1}$ to $x = ${x2}$:${steps(`w = ${x2} - ${paren(x1)} = ${w}`)}${stepLabel(2, "The height", "高").en} It runs from $y = ${y1}$ to $y = ${y2}$:${steps(`h = ${y2} - ${paren(y1)} = ${h}`)}${corners.en}

{{figure 0}}

${stepLabel(3, "Multiply", "相乘").en}${steps(`A = w \\cdot h = ${w} \\cdot ${h} = ${area}`)}**Check.** The diagonal from $${pointLatex([x1, y1])}$ to $${pointLatex([x2, y2])}$ cuts the rectangle into two right triangles with legs $${w}$ and $${h}$, each of area $\\frac{1}{2} \\cdot ${w} \\cdot ${h} = ${half(area).toLatex()}$; together they make $2 \\cdot ${half(area).toLatex()} = ${area}$.`,
            `${stepLabel(1, "The width", "宽")["zh-CN"]}边水平和竖直，矩形从 $x = ${x1}$ 延伸到 $x = ${x2}$：${steps(`w = ${x2} - ${paren(x1)} = ${w}`)}${stepLabel(2, "The height", "高")["zh-CN"]}它从 $y = ${y1}$ 延伸到 $y = ${y2}$：${steps(`h = ${y2} - ${paren(y1)} = ${h}`)}${corners["zh-CN"]}

{{figure 0}}

${stepLabel(3, "Multiply", "相乘")["zh-CN"]}${steps(`A = w \\cdot h = ${w} \\cdot ${h} = ${area}`)}**检验。** 从 $${pointLatex([x1, y1])}$ 到 $${pointLatex([x2, y2])}$ 的对角线把矩形分成两个直角三角形，直角边都是 $${w}$ 和 $${h}$，每个面积 $\\frac{1}{2} \\cdot ${w} \\cdot ${h} = ${half(area).toLatex()}$；合起来是 $2 \\cdot ${half(area).toLatex()} = ${area}$。`,
          ),
        });
        const solutionFigures = [
          shapeFigure(
            solutionNames,
            pts,
            `The rectangle is ${w} wide and ${h} tall, so its area is ${area}.`,
            `矩形宽 ${w}、高 ${h}，所以面积是 ${area}。`,
            [
              { kind: "polygon", points: pts, tone: "result" },
              { kind: "segment", a: pts[0]!, b: pts[2]!, dashed: true, tone: "action" },
              ...sideLabels(pts, [String(w), String(h), "", ""]),
            ],
          ),
        ];
        return opposite
          ? { ...problem, solutionFigures }
          : {
              ...problem,
              figure: shapeFigure(
                names,
                pts,
                `Rectangle ABCD with vertices ${listPts(names, pts)}.`,
                `矩形 ABCD，顶点为 ${listPts(names, pts)}。`,
              ),
              solutionFigures,
            };
      },
    },
    {
      id: "tilted-rectangles",
      figure: coordinateDrawings["tilted-rectangles"],
      title: t("Tilted rectangles", "倾斜的矩形"),
      explanation: t(
        `When the sides are slanted, the area is still length times width, but the length and the width are slanted segments: find them with the distance formula, then multiply. Two adjacent sides are enough, since opposite sides of a rectangle are equal.

Rectangle $A(0, 0)$, $B(2, 1)$, $C(0, 5)$, $D(-2, 4)$ has $AB = \\sqrt{2^2 + 1^2} = \\sqrt{5}$ and $BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20}$, so its area is $\\sqrt{5} \\cdot \\sqrt{20} = \\sqrt{100} = 10$. The product of two roots is the root of the product.

> **Watch out.** The rectangle with horizontal and vertical sides drawn around it, here $4$ by $5$, is larger than the tilted one: $20$ is not the answer. Multiply the side lengths, not their squares: $5 \\cdot 20 = 100$ is the square of the area. And area multiplies the sides; $5 + 20$ means nothing here.`,
        `边是斜的时，面积仍然是长乘宽，只是长和宽都是斜线段：用距离公式求出它们，再相乘。只需两条相邻的边，因为矩形的对边相等。

矩形 $A(0, 0)$、$B(2, 1)$、$C(0, 5)$、$D(-2, 4)$ 中，$AB = \\sqrt{2^2 + 1^2} = \\sqrt{5}$，$BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20}$，所以面积是 $\\sqrt{5} \\cdot \\sqrt{20} = \\sqrt{100} = 10$。两个根式的积等于积的根式。

> **注意。** 在它外面画出的边水平、竖直的矩形（这里是 $4 \\times 5$）比倾斜的矩形大：$20$ 不是答案。要乘边长，不是边长的平方：$5 \\cdot 20 = 100$ 是面积的平方。面积是两边相乘；$5 + 20$ 在这里没有意义。`,
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        let u: Point;
        let v: Point;
        do {
          const a = rng.int(1, 4);
          const b = rng.nonZero(-4, 4);
          const g = gcd(a, b);
          const j = rng.int(1, 3) * rng.sign();
          u = [a, b];
          v = [(-j * b) / g, (j * a) / g];
        } while (Math.abs(v[0]) > 6 || Math.abs(v[1]) > 6);
        const A: Point = [rng.int(-4, 2), rng.int(-4, 2)];
        const pts: Point[] = [A, [A[0] + u[0], A[1] + u[1]], [A[0] + u[0] + v[0], A[1] + u[1] + v[1]], [A[0] + v[0], A[1] + v[1]]];
        const names = ["A", "B", "C", "D"];
        const [n1, n2] = [sq(pts[0]!, pts[1]!), sq(pts[1]!, pts[2]!)];
        const area = Math.round(Math.sqrt(n1 * n2));
        const [W, H] = boxSize(pts);
        const box = W * H;
        const s: Shape = { names, pts, kind: t("rectangle", "矩形") };
        const cut = boxSubtraction(pts);
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of rectangle $ABCD$ with vertices ${listTex(names, pts, "and")}.`,
              `求矩形 $ABCD$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer: area,
            wrong: [box, n1 * n2, n1 + n2],
            solution: t(
              `${stepLabel(1, "The length and the width", "长和宽").en} The sides are slanted, so use the distance formula on two adjacent sides:${steps(`AB = ${distanceSteps(pts[0]!, pts[1]!)}`, `BC = ${distanceSteps(pts[1]!, pts[2]!)}`)}${stepLabel(2, "Multiply", "相乘").en} The product of two square roots is the square root of the product:${steps(`AB \\cdot BC = \\sqrt{${n1}} \\cdot \\sqrt{${n2}} = \\sqrt{${n1 * n2}} = ${area}`)}**Check.** Measure it another way: the rectangle with horizontal and vertical sides around $ABCD$ is $${W}$ by $${H}$, and cutting off the four right triangles at its corners leaves $ABCD$:${cut.lines}{{figure 0}}`,
              `${stepLabel(1, "The length and the width", "长和宽")["zh-CN"]}边是斜的，所以对两条相邻的边用距离公式：${steps(`AB = ${distanceSteps(pts[0]!, pts[1]!)}`, `BC = ${distanceSteps(pts[1]!, pts[2]!)}`)}${stepLabel(2, "Multiply", "相乘")["zh-CN"]}两个平方根的积等于积的平方根：${steps(`AB \\cdot BC = \\sqrt{${n1}} \\cdot \\sqrt{${n2}} = \\sqrt{${n1 * n2}} = ${area}`)}**检验。** 换一种方法：包住 $ABCD$、边水平和竖直的矩形是 $${W} \\times ${H}$，去掉四个角上的直角三角形，剩下的就是 $ABCD$：${cut.lines}{{figure 0}}`,
            ),
          }),
          figure: shapeFigure(
            names,
            pts,
            `Rectangle ABCD with vertices ${listPts(names, pts)}.`,
            `矩形 ABCD，顶点为 ${listPts(names, pts)}。`,
          ),
          solutionFigures: [
            boxFigure(
              s,
              `Rectangle ABCD with sides ${root(n1)} and ${root(n2)}, inside the ${W} by ${H} box; the box minus the four shaded corner triangles is ${area}.`,
              `矩形 ABCD 的两边是 ${root(n1)} 和 ${root(n2)}，外面是 ${W} × ${H} 的矩形；去掉四个涂色的角上三角形，剩下 ${area}。`,
              [...cutCorners(pts, boxCorners(pts)), ...sideLabels(pts, [root(n1), root(n2), "", ""])],
            ),
          ],
        };
      },
    },
    {
      id: "squares-from-two-vertices",
      title: t("Squares from two vertices", "由两个顶点求正方形面积"),
      explanation: t(
        `Two vertices are enough for the area of a square, but it matters which two.

- **Adjacent** vertices give a side $s$, and the area is $s^2$. With $A(1, 2)$ and $B(4, 4)$, $s^2 = 3^2 + 2^2 = 13$, so the area is $13$: the distance formula gives $s^2$ before the square root, so there is no need to take it.
- **Opposite** vertices give a diagonal $d$. The diagonal cuts the square into two right triangles with legs $s$ and $s$, so $d^2 = s^2 + s^2 = 2s^2$ and the area is $s^2 = \\frac{d^2}{2}$. With $A(1, 2)$ and $C(4, 4)$, the area is $\\frac{13}{2}$.

> **Watch out.** Read the prompt for *adjacent* or *opposite*: using the diagonal as a side doubles the area, and halving a side's square halves it. Dividing $d^2$ by $4$ treats the diagonal as twice a side, which it is not. And the run times the rise, $3 \\cdot 2$, is not the area of a tilted square.`,
        `已知两个顶点就能求正方形的面积，但要看是哪两个顶点。

- **相邻**的两个顶点给出边长 $s$，面积是 $s^2$。对 $A(1, 2)$ 与 $B(4, 4)$，$s^2 = 3^2 + 2^2 = 13$，所以面积是 $13$：距离公式在开平方之前给出的正是 $s^2$，所以不必开平方。
- **相对**的两个顶点给出对角线 $d$。对角线把正方形分成两个直角边都是 $s$ 的直角三角形，所以 $d^2 = s^2 + s^2 = 2s^2$，面积 $s^2 = \\frac{d^2}{2}$。对 $A(1, 2)$ 与 $C(4, 4)$，面积是 $\\frac{13}{2}$。

> **注意。** 看清题目说的是*相邻*还是*相对*：把对角线当作边，面积会算成两倍；把边的平方再除以 $2$，面积会算成一半。把 $d^2$ 除以 $4$ 等于把对角线当成边长的两倍，这不对。水平变化乘竖直变化 $3 \\cdot 2$ 也不是倾斜正方形的面积。`,
      ),
      generate(rng) {
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const B: Point = [A[0] + rng.nonZero(-7, 7), A[1] + rng.nonZero(-7, 7)];
        const n = sq(A, B);
        const diagonal = rng.bool();
        const [sdx, sdy] = [B[0] - A[0], B[1] - A[1]];
        const [dx, dy] = [Math.abs(sdx), Math.abs(sdy)];
        const answer = diagonal ? Q.of(n, 2) : Q.of(n);
        if (diagonal) {
          const run = Q.of(sdx - sdy, 2);
          const rise = Q.of(sdx + sdy, 2);
          const Bv: Point = [A[0] + run.toNumber(), A[1] + rise.toNumber()];
          const Dv: Point = [A[0] + rise.toNumber(), A[1] - run.toNumber()];
          const side = run.mul(run).add(rise.mul(rise));
          const pts: Point[] = [A, Bv, B, Dv];
          return {
            ...numberProblem({
              prompt: t(
                `Square $ABCD$ has opposite vertices $${pt("A", A)}$ and $${pt("C", B)}$. Find its area.`,
                `正方形 $ABCD$ 的两个相对顶点是 $${pt("A", A)}$ 和 $${pt("C", B)}$。求它的面积。`,
              ),
              answer,
              wrong: [n, dx * dy, Q.of(n, 4)],
              solution: t(
                `${stepLabel(1, "The diagonal", "对角线").en} $A$ and $C$ are opposite vertices, so $\\overline{AC}$ is a diagonal. Keep its square from the distance formula:${steps(`AC^2 = ${paren(sdx)}^2 + ${paren(sdy)}^2 = ${n}`)}${stepLabel(2, "From the diagonal to the area", "由对角线求面积").en} The diagonal cuts the square into two right triangles whose legs are both sides $s$, so $AC^2 = s^2 + s^2 = 2s^2$. The area is $s^2$, half of $AC^2$:${steps(`s^2 = \\frac{AC^2}{2} = \\frac{${n}}{2} = ${answer.toLatex()}`)}{{figure 0}}

**Check.** Find the side itself. From the center of the square, half of $\\overrightarrow{AC}$ turned a quarter turn reaches $B$, so from $A$ to $B$ the run is $\\frac{${sdx} - ${paren(sdy)}}{2} = ${num(run)}$ and the rise is $\\frac{${sdx} + ${paren(sdy)}}{2} = ${num(rise)}$. Then $AB^2 = ${squareOf(run)} + ${squareOf(rise)} = ${side.toLatex()}$, the same area.`,
                `${stepLabel(1, "The diagonal", "对角线")["zh-CN"]}$A$ 和 $C$ 是相对的顶点，所以 $\\overline{AC}$ 是对角线。保留距离公式中它的平方：${steps(`AC^2 = ${paren(sdx)}^2 + ${paren(sdy)}^2 = ${n}`)}${stepLabel(2, "From the diagonal to the area", "由对角线求面积")["zh-CN"]}对角线把正方形分成两个直角三角形，直角边都是边长 $s$，所以 $AC^2 = s^2 + s^2 = 2s^2$。面积是 $s^2$，即 $AC^2$ 的一半：${steps(`s^2 = \\frac{AC^2}{2} = \\frac{${n}}{2} = ${answer.toLatex()}`)}{{figure 0}}

**检验。** 直接求出边。从正方形的中心出发，把 $\\overrightarrow{AC}$ 的一半转四分之一圈就到达 $B$，所以从 $A$ 到 $B$ 的水平变化是 $\\frac{${sdx} - ${paren(sdy)}}{2} = ${num(run)}$，竖直变化是 $\\frac{${sdx} + ${paren(sdy)}}{2} = ${num(rise)}$。于是 $AB^2 = ${squareOf(run)} + ${squareOf(rise)} = ${side.toLatex()}$，面积相同。`,
              ),
            }),
            solutionFigures: [
              shapeFigure(
                ["A", "B", "C", "D"],
                pts,
                `Square ABCD with the diagonal AC; its area is half the square of AC, ${plain(answer)}.`,
                `正方形 ABCD 和对角线 AC；面积是 AC 平方的一半，即 ${plain(answer)}。`,
                [
                  { kind: "polygon", points: pts, tone: "result" },
                  { kind: "segment", a: A, b: B, dashed: true, tone: "action" },
                  ...legsOf(A, B),
                ],
              ),
            ],
          };
        }
        const C: Point = [B[0] - sdy, B[1] + sdx];
        const D: Point = [A[0] - sdy, A[1] + sdx];
        const pts: Point[] = [A, B, C, D];
        const S = dx + dy;
        return {
          ...numberProblem({
            prompt: t(
              `Square $ABCD$ has adjacent vertices $${pt("A", A)}$ and $${pt("B", B)}$. Find its area.`,
              `正方形 $ABCD$ 的两个相邻顶点是 $${pt("A", A)}$ 和 $${pt("B", B)}$。求它的面积。`,
            ),
            answer,
            wrong: [Q.of(n, 2), dx * dy, (dx + dy) ** 2],
            solution: t(
              `${stepLabel(1, "The side", "边").en} $A$ and $B$ are adjacent vertices, so $\\overline{AB}$ is a side $s$. The distance formula gives its square before any root is taken:${steps(`AB^2 = ${paren(sdx)}^2 + ${paren(sdy)}^2 = ${dx * dx} + ${dy * dy} = ${n}`)}${stepLabel(2, "The area", "面积").en} The area of a square is $s^2 = AB^2$, so it is $${n}$; there is no need to take the square root and square it again.

{{figure 0}}

**Check.** The square fits in a box with horizontal and vertical sides of length $${dx} + ${dy} = ${S}$. Cutting off the four right triangles at its corners, each with legs $${dx}$ and $${dy}$, leaves the square:${steps(`${S}^2 - 4 \\cdot \\tfrac{1}{2} \\cdot ${dx} \\cdot ${dy} = ${S * S} - ${2 * dx * dy} = ${n}`)}`,
              `${stepLabel(1, "The side", "边")["zh-CN"]}$A$ 和 $B$ 是相邻的顶点，所以 $\\overline{AB}$ 是一条边 $s$。距离公式在开平方之前给出的正是它的平方：${steps(`AB^2 = ${paren(sdx)}^2 + ${paren(sdy)}^2 = ${dx * dx} + ${dy * dy} = ${n}`)}${stepLabel(2, "The area", "面积")["zh-CN"]}正方形的面积是 $s^2 = AB^2$，所以是 $${n}$；不必先开平方再平方回来。

{{figure 0}}

**检验。** 这个正方形正好放进一个边水平、竖直，边长 $${dx} + ${dy} = ${S}$ 的大正方形。去掉四个角上直角边为 $${dx}$ 和 $${dy}$ 的直角三角形，剩下的就是原正方形：${steps(`${S}^2 - 4 \\cdot \\tfrac{1}{2} \\cdot ${dx} \\cdot ${dy} = ${S * S} - ${2 * dx * dy} = ${n}`)}`,
            ),
          }),
          solutionFigures: [
            boxFigure(
              { names: ["A", "B", "C", "D"], pts, kind: t("square", "正方形") },
              `Square ABCD inside the ${S} by ${S} box; the box minus the four shaded corner triangles is ${n}.`,
              `正方形 ABCD 在 ${S} × ${S} 的大正方形里；去掉四个涂色的角上三角形，剩下 ${n}。`,
              cutCorners(pts, boxCorners(pts)),
            ),
          ],
        };
      },
    },
  ],
};

/** partition draws the n equal steps from A to B, and the point k steps along as the result. */
function partition(A: Point, B: Point, u: number, v: number, n: number, k: number, en: string, zh: string): Figure {
  const marks: PlaneMark[] = [{ kind: "arrow", from: A, to: [A[0] + k * u, A[1] + k * v], tone: "action" }];
  for (let i = 1; i < n; i++) if (i !== k) marks.push({ kind: "point", at: [A[0] + i * u, A[1] + i * v] });
  marks.push({ kind: "point", at: [A[0] + k * u, A[1] + k * v], label: "P", dir: "se", tone: "result" });
  return shapeFigure(["A", "B"], [A, B], en, zh, marks);
}

/** shoelace writes the shoelace formula for the area of a polygon, term by term. */
function shoelace(pts: readonly Point[]): { readonly lines: string; readonly area: Q } {
  const pairs = pts.map((p, i) => [p, pts[(i + 1) % pts.length]!] as const);
  const products = pairs.map(([p, q]) => `${paren(p[0])} \\cdot ${paren(q[1])} - ${paren(q[0])} \\cdot ${paren(p[1])}`);
  const values = pairs.map(([p, q]) => p[0] * q[1] - q[0] * p[1]);
  const sum = values.reduce((a, b) => a + b, 0);
  const area = half(Math.abs(sum));
  const lines = steps(
    `\\tfrac{1}{2}\\left|${products.map((p) => `(${p})`).join(" + ")}\\right|`,
    `= \\tfrac{1}{2}\\left|${values.map((v, i) => (i === 0 ? String(v) : v < 0 ? `- ${-v}` : `+ ${v}`)).join(" ")}\\right| = \\tfrac{1}{2} \\cdot ${Math.abs(sum)} = ${area.toLatex()}`,
  );
  return { lines, area };
}

/** shoelaceCheck writes the check of an area by the shoelace formula. */
function shoelaceCheck(pts: readonly Point[]): Text {
  const { lines } = shoelace(pts);
  return t(
    `**Check.** The shoelace formula finds the area from the coordinates alone: around the polygon, add $x_1y_2 - x_2y_1$ for each side, then halve the absolute value.${lines}`,
    `**检验。** 鞋带公式只用坐标就能求面积：绕多边形一圈，对每条边加上 $x_1y_2 - x_2y_1$，再取绝对值的一半。${lines}`,
  );
}

/** calculatingAreasOfTrianglesAndQuadrilateralsInThePlane finds areas of triangles and quadrilaterals from their vertices. */
export const calculatingAreasOfTrianglesAndQuadrilateralsInThePlane: TopicDef = {
  id: "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
  title: t("Calculating Areas of Triangles and Quadrilaterals in the Plane", "求坐标平面中三角形与四边形的面积"),
  summary: t(
    "Find the area of a triangle or a quadrilateral from the coordinates of its vertices, with a horizontal or vertical base or by subtracting from the rectangle around it.",
    "由顶点坐标求三角形或四边形的面积：利用水平或竖直的底，或从外接矩形中减去多余部分。",
  ),
  prerequisites: ["calculating-areas-of-rectangles-in-the-plane", "area-of-triangles"],
  encompasses: [{ topic: "area-of-triangles", weight: 0.6 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.B.7"],
  intro: t(
    `The area of a triangle is half its base times its height, $A = \\frac{1}{2}bh$, where the height is measured at a right angle to the base. On the grid that is easy when the base is horizontal: its length is a difference of $x$-coordinates, and the height is a difference of $y$-coordinates.

The triangle with vertices $(1, 1)$, $(7, 1)$ and $(3, 5)$ has a horizontal base of $7 - 1 = 6$. The third vertex is $5 - 1 = 4$ above the line of the base, so the height is $4$:

{{figure 0}}

and the area is $\\frac{1}{2} \\cdot 6 \\cdot 4 = 12$. The triangle is half of a $6$ by $4$ rectangle.

When no side lies along the grid, the height is hard to measure. Then we draw the rectangle with horizontal and vertical sides around the figure and subtract the right triangles at its corners, whose legs can be read off the grid. The same works for quadrilaterals.`,
    `三角形的面积是底乘高的一半，$A = \\frac{1}{2}bh$，其中高要与底成直角来量。在网格上，底是水平的时候最容易：底长是 $x$ 坐标之差，高是 $y$ 坐标之差。

顶点为 $(1, 1)$、$(7, 1)$、$(3, 5)$ 的三角形有一条水平的底，长 $7 - 1 = 6$。第三个顶点在底所在直线上方 $5 - 1 = 4$ 处，所以高是 $4$：

{{figure 0}}

面积是 $\\frac{1}{2} \\cdot 6 \\cdot 4 = 12$。这个三角形是 $6 \\times 4$ 矩形的一半。

如果没有边沿着网格，高就不好量。这时画出包住图形、边水平和竖直的矩形，再减去四个角上的直角三角形；它们的直角边可以从网格上读出。四边形也可以这样做。`,
  ),
  introFigures: [
    shapeFigure(
      ["", "", ""],
      [
        [1, 1],
        [7, 1],
        [3, 5],
      ],
      "The triangle with vertices (1, 1), (7, 1) and (3, 5): a horizontal base of 6 and a height of 4 from (3, 5) down to (3, 1).",
      "顶点为 (1, 1)、(7, 1)、(3, 5) 的三角形：水平的底长 6，从 (3, 5) 向下到 (3, 1) 的高为 4。",
      [
        { kind: "segment", a: [3, 5], b: [3, 1], dashed: true, tone: "action" },
        squareCorner([3, 1], [1, 0], [0, 1], 0.3),
        { kind: "label", at: [3, 3], text: "4", dir: "e" },
        { kind: "label", at: [4, 1], text: "6", dir: "s" },
      ],
    ),
  ],
  knowledgePoints: [
    {
      id: "triangles-with-a-horizontal-or-vertical-side",
      figure: coordinateDrawings["triangles-with-a-horizontal-or-vertical-side"],
      title: t("A horizontal or vertical base", "水平或竖直的底"),
      explanation: t(
        `If one side of a triangle is horizontal, use it as the base: its length is the difference of the $x$-coordinates. The height must be perpendicular to the base, so it is vertical: the difference between the $y$-coordinate of the third vertex and that of the base. Then $A = \\frac{1}{2}bh$. For a vertical side, swap the roles of $x$ and $y$. The foot of the height may lie outside the base; the height is the same.

For $A(-2, 1)$, $B(5, 1)$ and $C(3, 7)$: the base $AB = 5 - (-2) = 7$, the height is $7 - 1 = 6$, so the area is $\\frac{1}{2} \\cdot 7 \\cdot 6 = 21$.

> **Watch out.** Do not forget the $\\frac{1}{2}$: $7 \\cdot 6 = 42$ is the rectangle, twice the triangle. The height is measured from the line of the base, not from the axis: subtract the base's $y$-coordinate, $7 - 1$, rather than using $7$. And area multiplies base and height; it never adds them.`,
        `如果三角形的一条边是水平的，就把它当作底：底长是 $x$ 坐标之差。高必须垂直于底，所以是竖直的：第三个顶点的 $y$ 坐标与底的 $y$ 坐标之差。于是 $A = \\frac{1}{2}bh$。竖直的边则把 $x$ 与 $y$ 的作用互换。高的垂足可能落在底的延长线上，高不变。

对 $A(-2, 1)$、$B(5, 1)$、$C(3, 7)$：底 $AB = 5 - (-2) = 7$，高是 $7 - 1 = 6$，所以面积是 $\\frac{1}{2} \\cdot 7 \\cdot 6 = 21$。

> **注意。** 别忘了 $\\frac{1}{2}$：$7 \\cdot 6 = 42$ 是矩形，是三角形的两倍。高要从底所在的直线量起，不是从坐标轴量起：要减去底的 $y$ 坐标，$7 - 1$，而不是直接用 $7$。面积是底乘高，绝不是底加高。`,
      ),
      generate(rng) {
        const base = rng.int(2, 9);
        const height = rng.nonZero(-8, 8);
        const level = rng.nonZero(-5, 5);
        const start = rng.int(-6, 2);
        const apex = rng.int(-4, 7);
        const vertical = rng.bool();
        const P = (along: number, across: number): Point => (vertical ? [across, along] : [along, across]);
        const pts: Point[] = [P(start, level), P(start + base, level), P(apex, level + height)];
        const names = ["A", "B", "C"];
        const h = Math.abs(height);
        const answer = Q.of(base * h, 2);
        const [ax, ac] = vertical ? ["y", "x"] : ["x", "y"];
        const third = level + height;
        const foot = P(apex, level);
        const outside = apex < start || apex > start + base;
        const nearEnd = P(apex < start ? start : start + base, level);
        const cut = boxSubtraction(pts);
        const view = fitView(pts);
        const footNote = outside
          ? t(
              `The foot of the height, $${pointLatex(foot)}$, lies on the line of the base beyond $${apex < start ? "A" : "B"}$; that does not change the height.`,
              `高的垂足 $${pointLatex(foot)}$ 落在底的延长线上，在 $${apex < start ? "A" : "B"}$ 之外；这不影响高的大小。`,
            )
          : t("", "");
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of triangle $ABC$ with vertices ${listTex(names, pts, "and")}.`,
              `求三角形 $ABC$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [base * h, Q.of(base * Math.abs(third), 2), Q.of(base + h, 2)],
            solution: t(
              `${stepLabel(1, "The base", "底").en} $A$ and $B$ both have $${ac} = ${level}$, so $\\overline{AB}$ is ${vertical ? "vertical" : "horizontal"}. Use it as the base; only $${ax}$ changes along it:${steps(`b = ${start + base} - ${paren(start)} = ${base}`)}${stepLabel(2, "The height", "高").en} The height is perpendicular to the base, so it runs ${vertical ? "horizontally" : "vertically"} from $C$ to the line $${ac} = ${level}$. Its length is the change in $${ac}$:${steps(`h = |${third} - ${paren(level)}| = ${h}`)}${footNote.en}

{{figure 0}}

${stepLabel(3, "The area", "面积").en}${steps(`A = \\tfrac{1}{2}bh = \\tfrac{1}{2} \\cdot ${base} \\cdot ${h} = ${answer.toLatex()}`)}**Check.** Measure it another way: the rectangle with horizontal and vertical sides around the triangle is $${cut.W}$ by $${cut.H}$, and cutting off the right triangles outside $ABC$ leaves the same area:${cut.lines}`,
              `${stepLabel(1, "The base", "底")["zh-CN"]}$A$ 和 $B$ 的 $${ac}$ 坐标都是 $${level}$，所以 $\\overline{AB}$ 是${vertical ? "竖直" : "水平"}的。把它当作底；沿着它只有 $${ax}$ 变化：${steps(`b = ${start + base} - ${paren(start)} = ${base}`)}${stepLabel(2, "The height", "高")["zh-CN"]}高垂直于底，所以从 $C$ ${vertical ? "水平" : "竖直"}地量到直线 $${ac} = ${level}$。它的长度是 $${ac}$ 的变化：${steps(`h = |${third} - ${paren(level)}| = ${h}`)}${footNote["zh-CN"]}

{{figure 0}}

${stepLabel(3, "The area", "面积")["zh-CN"]}${steps(`A = \\tfrac{1}{2}bh = \\tfrac{1}{2} \\cdot ${base} \\cdot ${h} = ${answer.toLatex()}`)}**检验。** 换一种方法：包住三角形、边水平和竖直的矩形是 $${cut.W} \\times ${cut.H}$，去掉 $ABC$ 外面的直角三角形，剩下的面积相同：${cut.lines}`,
            ),
          }),
          figure: shapeFigure(
            names,
            pts,
            `Triangle ABC with vertices ${listPts(names, pts)}.`,
            `三角形 ABC，顶点为 ${listPts(names, pts)}。`,
          ),
          solutionFigures: [
            shapeFigure(
              names,
              pts,
              `The base AB is ${base} and the height from C is ${h}, so the area is ${plain(answer)}.`,
              `底 AB 是 ${base}，从 C 作的高是 ${h}，所以面积是 ${plain(answer)}。`,
              [
                { kind: "polygon", points: pts, tone: "result" },
                ...(outside ? [{ kind: "segment", a: nearEnd, b: foot, dashed: true } as const] : []),
                { kind: "segment", a: pts[2]!, b: foot, dashed: true, tone: "action" },
                squareCorner(foot, vertical ? [0, 1] : [1, 0], [pts[2]![0] - foot[0], pts[2]![1] - foot[1]], cornerSize(view)),
                {
                  kind: "label",
                  at: [(pts[2]![0] + foot[0]) / 2, (pts[2]![1] + foot[1]) / 2],
                  text: String(h),
                  dir: vertical ? "n" : "e",
                },
                {
                  kind: "label",
                  at: P(start + base / 2, level),
                  text: String(base),
                  dir: vertical ? (height > 0 ? "w" : "e") : height > 0 ? "s" : "n",
                },
              ],
            ),
          ],
        };
      },
    },
    {
      id: "triangles-by-subtracting-from-a-rectangle",
      title: t("Triangles by subtracting from a rectangle", "用外接矩形求三角形面积"),
      explanation: t(
        `When no side is horizontal or vertical, neither the base nor the height can be read off the grid. Instead draw the smallest rectangle with horizontal and vertical sides around the triangle. Each vertex touches its edge, and between each side of the triangle and the rectangle lies a right triangle whose legs follow the grid. The triangle is what remains of the rectangle after removing those three right triangles.

For $A(0, 0)$, $B(6, 2)$, $C(2, 5)$: the rectangle is $6$ by $5$, area $30$. The right triangles have areas $\\frac{1}{2} \\cdot 6 \\cdot 2 = 6$, $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$ and $\\frac{1}{2} \\cdot 2 \\cdot 5 = 5$, so the area of $ABC$ is $30 - 6 - 6 - 5 = 13$.

> **Watch out.** The rectangle is not the answer, and neither is half of it: the triangle is half the rectangle only when one of its sides is a side of the rectangle. Subtract all three corner triangles, and halve each product of legs, since each is a right triangle, not a rectangle.`,
        `如果没有水平或竖直的边，底和高都不能从网格上读出。这时画出包住三角形、边水平和竖直的最小矩形。每个顶点都在矩形的边上，三角形的每条边与矩形之间夹着一个直角三角形，它的直角边沿着网格。从矩形中去掉这三个直角三角形，剩下的就是原三角形。

对 $A(0, 0)$、$B(6, 2)$、$C(2, 5)$：外接矩形是 $6 \\times 5$，面积 $30$。三个直角三角形的面积分别是 $\\frac{1}{2} \\cdot 6 \\cdot 2 = 6$、$\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$、$\\frac{1}{2} \\cdot 2 \\cdot 5 = 5$，所以 $ABC$ 的面积是 $30 - 6 - 6 - 5 = 13$。

> **注意。** 矩形的面积不是答案，它的一半也不是：只有三角形的一条边就是矩形的边时，三角形才是矩形的一半。三个角上的三角形都要减去；每个都是直角三角形，不是矩形，所以直角边的乘积要除以 $2$。`,
      ),
      figure: boxFigure(
        {
          names: ["A", "B", "C"],
          pts: [
            [0, 0],
            [6, 2],
            [2, 5],
          ],
          kind: t("triangle", "三角形"),
        },
        "Triangle A(0, 0), B(6, 2), C(2, 5) inside the dashed 6 by 5 rectangle around it.",
        "三角形 A(0, 0)、B(6, 2)、C(2, 5)，以及包住它的 6 × 5 虚线矩形。",
      ),
      generate(rng) {
        const W = rng.int(3, 8);
        const H = rng.int(3, 8);
        const q = rng.int(1, H - 1);
        const r = rng.int(1, W - 1);
        const T = flip([rng.int(-4, 0), rng.int(-4, 0)], rng.sign(), rng.sign());
        const pts: Point[] = [T([0, 0]), T([W, q]), T([r, H])];
        const names = ["A", "B", "C"];
        const parts = [W * q, (W - r) * (H - q), r * H];
        const answer = Q.of(W * H).sub(Q.of(parts[0]! + parts[1]! + parts[2]!, 2));
        const s: Shape = { names, pts, kind: t("triangle", "三角形") };
        const legs = [
          [W, q],
          [W - r, H - q],
          [r, H],
        ];
        const areas = legs.map(([a, b]) => `\\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${Q.of(a! * b!, 2).toLatex()}`);
        const minus = parts.map((p) => Q.of(p, 2).toLatex()).join(" - ");
        const check = shoelaceCheck(pts);
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of triangle $ABC$ with vertices ${listTex(names, pts, "and")}.`,
              `求三角形 $ABC$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [W * H, Q.of(W * H, 2), Q.of(W * H).sub(Q.of(parts[0]! + parts[1]!, 2))],
            solution: t(
              `${stepLabel(1, "The rectangle around it", "外接矩形").en} The $x$-coordinates run over $${W}$ units and the $y$-coordinates over $${H}$, so the rectangle around the triangle is $${W}$ by $${H}$, with area $${W * H}$.

{{figure 0}}

${stepLabel(2, "The corner triangles", "角上的三角形").en} Each side of $ABC$ is the hypotenuse of a right triangle in the rectangle; its legs are the run and the rise of that side:${steps(...areas)}${stepLabel(3, "Subtract", "相减").en} What is left of the rectangle is $ABC$:${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}${check.en}`,
              `${stepLabel(1, "The rectangle around it", "外接矩形")["zh-CN"]}$x$ 坐标跨越 $${W}$ 个单位，$y$ 坐标跨越 $${H}$ 个单位，所以包住三角形的矩形是 $${W} \\times ${H}$，面积为 $${W * H}$。

{{figure 0}}

${stepLabel(2, "The corner triangles", "角上的三角形")["zh-CN"]}$ABC$ 的每条边都是矩形里一个直角三角形的斜边，直角边就是这条边的水平变化和竖直变化：${steps(...areas)}${stepLabel(3, "Subtract", "相减")["zh-CN"]}矩形剩下的部分就是 $ABC$：${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}${check["zh-CN"]}`,
            ),
          }),
          figure: boxFigure(s, `Triangle ABC with vertices ${listPts(names, pts)}.`, `三角形 ABC，顶点为 ${listPts(names, pts)}。`),
          solutionFigures: [
            boxFigure(
              s,
              `The ${W} by ${H} box minus the three shaded right triangles leaves an area of ${plain(answer)}.`,
              `${W} × ${H} 的矩形减去三个涂色的直角三角形，剩下的面积是 ${plain(answer)}。`,
              cutCorners(pts, boxCorners(pts)),
            ),
          ],
        };
      },
    },
    {
      id: "areas-of-quadrilaterals",
      figure: coordinateDrawings["areas-of-quadrilaterals"],
      title: t("Areas of quadrilaterals", "四边形的面积"),
      explanation: t(
        `The same idea works for a quadrilateral whose vertices each touch a different side of the rectangle around it: subtract from the rectangle the four right triangles at its corners. Each corner triangle has a side of the quadrilateral as its hypotenuse, and that side's run and rise as its legs.

For $A(2, 0)$, $B(6, 3)$, $C(4, 6)$, $D(0, 2)$: the rectangle is $6$ by $6$, area $36$. The corner triangles have areas $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$, $\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$, $\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$ and $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$, so the area of $ABCD$ is $36 - 6 - 3 - 8 - 2 = 17$.

> **Watch out.** The corner pieces are triangles: subtract half of each product of legs, not the whole product ($36 - 12 - 6 - 16 - 4$ would be negative). Neither the rectangle nor half of it is the answer.`,
        `四边形的四个顶点分别在外接矩形的四条边上时，同样的方法也适用：从外接矩形中减去四个角上的直角三角形。每个角上三角形的斜边是四边形的一条边，直角边是这条边的水平变化和竖直变化。

对 $A(2, 0)$、$B(6, 3)$、$C(4, 6)$、$D(0, 2)$：外接矩形是 $6 \\times 6$，面积 $36$。四个角上的三角形面积分别是 $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$、$\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$、$\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$、$\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$，所以 $ABCD$ 的面积是 $36 - 6 - 3 - 8 - 2 = 17$。

> **注意。** 角上的是三角形：要减去直角边乘积的一半，而不是整个乘积（$36 - 12 - 6 - 16 - 4$ 会是负数）。矩形的面积和它的一半都不是答案。`,
      ),
      generate(rng) {
        const W = rng.int(4, 8);
        const H = rng.int(4, 8);
        const a = rng.int(1, W - 1);
        const b = rng.int(1, H - 1);
        const c = rng.int(1, W - 1);
        const d = rng.int(1, H - 1);
        const T = flip([rng.int(-4, 0), rng.int(-4, 0)], rng.sign(), rng.sign());
        const pts: Point[] = [T([a, 0]), T([W, b]), T([c, H]), T([0, d])];
        const names = ["A", "B", "C", "D"];
        const legs = [
          [W - a, b],
          [W - c, H - b],
          [c, H - d],
          [a, d],
        ];
        const parts = legs.map(([x, y]) => x! * y!);
        const sum = parts.reduce((x, y) => x + y, 0);
        const answer = Q.of(W * H).sub(Q.of(sum, 2));
        const s: Shape = { names, pts, kind: t("quadrilateral", "四边形") };
        const areas = legs.map(([x, y]) => `\\tfrac{1}{2} \\cdot ${x} \\cdot ${y} = ${Q.of(x! * y!, 2).toLatex()}`);
        const minus = parts.map((p) => Q.of(p, 2).toLatex()).join(" - ");
        const check = shoelaceCheck(pts);
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of quadrilateral $ABCD$ with vertices ${listTex(names, pts, "and")}.`,
              `求四边形 $ABCD$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [W * H, Q.of(W * H, 2), W * H - sum],
            solution: t(
              `${stepLabel(1, "The rectangle around it", "外接矩形").en} The $x$-coordinates run over $${W}$ units and the $y$-coordinates over $${H}$, so the rectangle around the quadrilateral is $${W}$ by $${H}$, with area $${W * H}$. Each vertex lies on a different side of it.

{{figure 0}}

${stepLabel(2, "The corner triangles", "角上的三角形").en} Each side of $ABCD$ cuts off a right triangle at a corner of the rectangle, with the run and the rise of that side as legs:${steps(...areas)}${stepLabel(3, "Subtract", "相减").en}${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}${check.en}`,
              `${stepLabel(1, "The rectangle around it", "外接矩形")["zh-CN"]}$x$ 坐标跨越 $${W}$ 个单位，$y$ 坐标跨越 $${H}$ 个单位，所以包住四边形的矩形是 $${W} \\times ${H}$，面积为 $${W * H}$。每个顶点各在它的一条边上。

{{figure 0}}

${stepLabel(2, "The corner triangles", "角上的三角形")["zh-CN"]}$ABCD$ 的每条边在矩形的一个角上切出一个直角三角形，直角边是这条边的水平变化和竖直变化：${steps(...areas)}${stepLabel(3, "Subtract", "相减")["zh-CN"]}${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}${check["zh-CN"]}`,
            ),
          }),
          figure: boxFigure(s, `Quadrilateral ABCD with vertices ${listPts(names, pts)}.`, `四边形 ABCD，顶点为 ${listPts(names, pts)}。`),
          solutionFigures: [
            boxFigure(
              s,
              `The ${W} by ${H} box minus the four shaded right triangles leaves an area of ${plain(answer)}.`,
              `${W} × ${H} 的矩形减去四个涂色的直角三角形，剩下的面积是 ${plain(answer)}。`,
              cutCorners(pts, boxCorners(pts)),
            ),
          ],
        };
      },
    },
  ],
};

/** coordinateGeometryTopics are the topics of coordinate geometry in the Geometry course, in teaching order. */
export const coordinateGeometryTopics: readonly TopicDef[] = [
  findingEquationsOfParallelLines,
  findingEquationsOfPerpendicularLines,
  midpointsInTheCoordinatePlane,
  partitioningLineSegments,
  theDistanceFormula,
  theShortestDistanceBetweenAPointAndALine,
  calculatingPerimetersInThePlane,
  calculatingAreasOfRectanglesInThePlane,
  calculatingAreasOfTrianglesAndQuadrilateralsInThePlane,
];
