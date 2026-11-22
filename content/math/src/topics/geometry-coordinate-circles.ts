import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  linear,
  type Mark,
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
  sketch,
  surd,
  surdLatex,
} from "@ga/subject-math";
import { chordDrawings, planeCircleDrawings } from "../explanation-drawings-circles.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { away, graphFigure, legs, overlay, plain, at as plainPt } from "../graph-figures.ts";
import {
  choiceProblem,
  equationProblem,
  numberProblem,
  pointLatex,
  pointProblem,
  radicalProblem,
  solutionsProblem,
  steps,
  yesNo,
} from "../problems.ts";
import { evalAt, stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

function gcd(a: number, b: number): number {
  let [m, n] = [Math.abs(a), Math.abs(b)];
  while (n !== 0) [m, n] = [n, m % n];
  return m;
}

/** sqTerm writes (v − h)², or v² when h is 0. */
const sqTerm = (v: string, h: Coefficient) => (toQ(h).isZero() ? `${v}^{2}` : `(${linear(1, toQ(h).neg(), v)})^{2}`);

/** circleEq writes the standard form (x − h)² + (y − k)² = r². */
const circleEq = (h: Coefficient, k: Coefficient, r2: Coefficient) => `${sqTerm("x", h)} + ${sqTerm("y", k)} = ${num(r2)}`;

/** generalEq writes x² + y² + Dx + Ey + F = 0, with a common leading coefficient a. */
const generalEq = (D: number, E: number, F: number, a = 1) =>
  `${poly([a, "x^{2}"], [a, "y^{2}"], [a * D, "x"], [a * E, "y"], [a * F, ""])} = 0`;

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** rootTex writes √n in simplest radical form (n ≥ 0). */
function rootTex(n: number): string {
  if (n === 0) return "0";
  const [k, m] = simplifyRadical(n);
  return radical(k, m);
}

/** rootAnswer is √n as the [coefficient, radicand] answer of a radical problem. */
const rootAnswer = (n: number): [number, number] => simplifyRadical(n);

/** pm lists the numbers c ± √s in simplest form: none when s < 0, one when s = 0. */
function pm(c: number, s: number): string[] {
  if (s < 0) return [];
  if (s === 0) return [String(c)];
  const [k, m] = simplifyRadical(s);
  if (m === 1) return [String(c + k), String(c - k)];
  return [surdLatex(surd(Q.of(c), Q.of(k), BigInt(m))), surdLatex(surd(Q.of(c), Q.of(-k), BigInt(m)))];
}

/** pmTex writes c ± √s in LaTeX. */
function pmTex(c: number, s: number): string {
  const root = rootTex(s);
  return c === 0 ? `\\pm ${root}` : `${c} \\pm ${root}`;
}

/** si writes y = mx + b. */
const si = (m: Coefficient, b: Coefficient) => `y = ${linear(m, b)}`;

/** lineThrough writes y = mx + b for the line of slope m through p. */
const lineThrough = (m: Q, p: Point) => si(m, Q.of(p[1]).sub(m.mul(Q.of(p[0]))));

/** latticePoints are the points with integer coordinates on x² + y² = r2. */
function latticePoints(r2: number): Point[] {
  const out: Point[] = [];
  const m = Math.floor(Math.sqrt(r2));
  for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) if (x * x + y * y === r2) out.push([x, y]);
  return out;
}

/** latticeR2 are values of r² whose circles about the origin pass through at least eight points with nonzero integer coordinates. */
const latticeR2: readonly number[] = [5, 10, 13, 17, 25, 26, 29, 34, 37, 41, 45, 50, 52, 53, 58, 61, 65, 85];

/** offAxis are the lattice points on x² + y² = r2 with both coordinates nonzero. */
const offAxis = (r2: number) => latticePoints(r2).filter(([x, y]) => x !== 0 && y !== 0);

/** integerRadii are radii r whose circles x² + y² = r² pass through points with both coordinates nonzero. */
const integerRadii: readonly number[] = [5, 10, 13, 15, 17, 20, 25];

/** ChordLine is a line y = mx + b with integer m and b meeting x² + y² = r2 at the lattice points p and q, p to the left of q. */
interface ChordLine {
  readonly r2: number;
  readonly p: Point;
  readonly q: Point;
  readonly m: number;
  readonly b: number;
}

/** chordLines are the lines with integer slope from −3 to 3 (not 0) through two lattice points of a circle about the origin. */
const chordLines: readonly ChordLine[] = latticeR2.flatMap((r2) => {
  const pts = latticePoints(r2);
  const out: ChordLine[] = [];
  for (const p of pts)
    for (const q of pts) {
      const dx = q[0] - p[0];
      if (dx <= 0 || (q[1] - p[1]) % dx !== 0) continue;
      const m = (q[1] - p[1]) / dx;
      const b = p[1] - m * p[0];
      if (m !== 0 && Math.abs(m) <= 3 && Math.abs(b) <= 12) out.push({ r2, p, q, m, b });
    }
  return out;
});

/** pickCenter draws a center with coordinates from −lim to lim, not the origin. */
function pickCenter(rng: Rng, lim = 6): [number, number] {
  const h = rng.int(-lim, lim);
  const k = h === 0 ? rng.nonZero(-lim, lim) : rng.int(-lim, lim);
  return [h, k];
}

/** pickRadius draws a radius: an integer from 2 to 12, or k√m in simplest form. It returns r in LaTeX and r². */
function pickRadius(rng: Rng): { tex: string; r2: number; r?: number } {
  if (rng.bool(0.6)) {
    const r = rng.int(2, 12);
    return { tex: String(r), r2: r * r, r };
  }
  const k = rng.int(1, 4);
  const m = rng.pick([2, 3, 5, 6, 7, 10]);
  return { tex: radical(k, m), r2: k * k * m };
}

/** planeCircle marks a circle of radius r about (h, k) in the coordinate plane. */
function planeCircle(h: number, k: number, r: number): PlaneMark[] {
  const n = 120;
  const at = (i: number): Point => [h + r * Math.cos((2 * Math.PI * i) / n), k + r * Math.sin((2 * Math.PI * i) / n)];
  return Array.from({ length: n }, (_, i): PlaneMark => ({ kind: "segment", a: at(i), b: at(i + 1), accent: true }));
}

/** viewAround is a window of the plane that shows the circle of radius r about (h, k) and the origin. */
function viewAround(h: number, k: number, r: number): PlaneView {
  const xMin = Math.min(-1, h - r - 1);
  const xMax = Math.max(1, h + r + 1);
  const yMin = Math.min(-1, k - r - 1);
  const yMax = Math.max(1, k + r + 1);
  return { xMin, xMax, yMin, yMax, labelEvery: Math.max(xMax - xMin, yMax - yMin) > 14 ? 2 : 1 };
}

/** exampleFigure draws a worked example in the coordinate plane. */
const exampleFigure = (view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): Figure => ({
  svg: plane(view, marks),
  alt: t(en, zh),
});

/** throughAPointFigure shows x² + y² = 34 and its radius to (−3, 5). */
const throughAPointFigure = exampleFigure(
  { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
  [
    ...planeCircle(0, 0, Math.sqrt(34)),
    { kind: "segment", a: [0, 0], b: [-3, 5] },
    { kind: "point", at: [0, 0] },
    { kind: "point", at: [-3, 5], label: "(−3, 5)", dir: "w" },
  ],
  "The circle x² + y² = 34 centered at the origin, with its radius drawn to the point (−3, 5) on the circle.",
  "以原点为圆心的圆 x² + y² = 34，画出了到圆上点 (−3, 5) 的半径。",
);

/** centerAndPointFigure shows the circle about (2, −1) through (5, 3), with the legs 3 and 4 of its radius. */
const centerAndPointFigure = exampleFigure(
  { xMin: -4, xMax: 8, yMin: -7, yMax: 5 },
  [
    ...planeCircle(2, -1, 5),
    { kind: "segment", a: [2, -1], b: [5, 3] },
    { kind: "segment", a: [2, -1], b: [5, -1], dashed: true },
    { kind: "segment", a: [5, -1], b: [5, 3], dashed: true },
    { kind: "label", at: [3.5, -1], text: "3", dir: "s" },
    { kind: "label", at: [5, 1], text: "4", dir: "e" },
    { kind: "point", at: [2, -1], label: "(2, −1)", dir: "sw" },
    { kind: "point", at: [5, 3], label: "P(5, 3)", dir: "ne" },
  ],
  "The circle with center (2, −1) through P(5, 3). The radius to P is the hypotenuse of a right triangle with a horizontal leg of 3 and a vertical leg of 4, so the radius is 5.",
  "圆心为 (2, −1)、经过 P(5, 3) 的圆。到 P 的半径是一个直角三角形的斜边，该三角形的水平直角边为 3，竖直直角边为 4，所以半径为 5。",
);

/** diameterFigure shows the circle with diameter from (−1, 2) to (5, 10) and its center (2, 6). */
const diameterFigure = exampleFigure(
  { xMin: -4, xMax: 8, yMin: 0, yMax: 12, labelEvery: 2 },
  [
    ...planeCircle(2, 6, 5),
    { kind: "segment", a: [-1, 2], b: [5, 10] },
    { kind: "point", at: [-1, 2], label: "A(−1, 2)", dir: "w" },
    { kind: "point", at: [5, 10], label: "B(5, 10)", dir: "e" },
    { kind: "point", at: [2, 6], label: "(2, 6)", dir: "e" },
  ],
  "The circle with diameter AB from A(−1, 2) to B(5, 10); its center (2, 6) is the midpoint of AB.",
  "以 A(−1, 2) 到 B(5, 10) 的线段 AB 为直径的圆；圆心 (2, 6) 是 AB 的中点。",
);

/** xInterceptsFigure shows (x − 2)² + (y + 3)² = 25 crossing the x-axis at −2 and 6. */
const xInterceptsFigure = exampleFigure(
  { xMin: -4, xMax: 8, yMin: -9, yMax: 3 },
  [
    ...planeCircle(2, -3, 5),
    { kind: "point", at: [2, -3], label: "(2, −3)", dir: "s" },
    { kind: "point", at: [-2, 0], label: "−2", dir: "nw" },
    { kind: "point", at: [6, 0], label: "6", dir: "ne" },
  ],
  "The circle (x − 2)² + (y + 3)² = 25 with center (2, −3); it crosses the x-axis at x = −2 and x = 6.",
  "圆 (x − 2)² + (y + 3)² = 25，圆心为 (2, −3)；它与 x 轴交于 x = −2 和 x = 6。",
);

/** slantedLineFigure shows x² + y² = 25 and y = x + 1 meeting at (−4, −3) and (3, 4). */
const slantedLineFigure = exampleFigure(
  { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
  [
    ...planeCircle(0, 0, 5),
    { kind: "line", a: [0, 1], b: [1, 2] },
    { kind: "point", at: [-4, -3], label: "(−4, −3)", dir: "w" },
    { kind: "point", at: [3, 4], label: "(3, 4)", dir: "w" },
  ],
  "The circle x² + y² = 25 and the line y = x + 1, which meet at (−4, −3) and (3, 4).",
  "圆 x² + y² = 25 与直线 y = x + 1 交于 (−4, −3) 和 (3, 4)。",
);

/** tangentFigure shows the tangent y = −(3/4)x + 9 to (x − 1)² + (y − 2)² = 25 at P(4, 6), perpendicular to the radius. */
const tangentFigure = exampleFigure(
  { xMin: -5, xMax: 9, yMin: -4, yMax: 10, labelEvery: 2 },
  [
    ...planeCircle(1, 2, 5),
    { kind: "segment", a: [1, 2], b: [4, 6] },
    { kind: "line", a: [0, 9], b: [4, 6] },
    { kind: "point", at: [1, 2], label: "(1, 2)", dir: "s" },
    { kind: "point", at: [4, 6], label: "P(4, 6)", dir: "e" },
  ],
  "The circle with center (1, 2) and radius 5, the radius to P(4, 6) with slope 4/3, and the tangent line at P, which is perpendicular to that radius and has slope −3/4.",
  "圆心为 (1, 2)、半径为 5 的圆，到 P(4, 6) 的半径（斜率为 4/3），以及在 P 处的切线，它与该半径垂直，斜率为 −3/4。",
);

/** axisTangentsFigure shows the vertical tangent x = 1 and the horizontal tangent y = −2 to (x + 2)² + (y − 1)² = 9. */
const axisTangentsFigure = exampleFigure(
  { xMin: -6, xMax: 3, yMin: -4, yMax: 5 },
  [
    ...planeCircle(-2, 1, 3),
    { kind: "line", a: [1, 0], b: [1, 1], dashed: true },
    { kind: "line", a: [0, -2], b: [1, -2], dashed: true },
    { kind: "point", at: [-2, 1], label: "(−2, 1)", dir: "n" },
    { kind: "point", at: [1, 1], label: "(1, 1)", dir: "e" },
    { kind: "point", at: [-2, -2], label: "(−2, −2)", dir: "sw" },
  ],
  "The circle with center (−2, 1) and radius 3, with the dashed vertical tangent x = 1 at its rightmost point (1, 1) and the dashed horizontal tangent y = −2 at its lowest point (−2, −2).",
  "圆心为 (−2, 1)、半径为 3 的圆，在最右点 (1, 1) 处画出了竖直切线 x = 1（虚线），在最低点 (−2, −2) 处画出了水平切线 y = −2（虚线）。",
);

const insideOnOutside: readonly Text[] = [
  t("Inside the circle", "在圆内"),
  t("On the circle", "在圆上"),
  t("Outside the circle", "在圆外"),
];

/** squaredDistance writes the steps (a − c)² + (b − d)² = n for the squared distance from (c, d) to (a, b). */
function squaredDistance(from: Point, to: Point): string {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  return `(${to[0]} - ${paren(from[0])})^{2} + (${to[1]} - ${paren(from[1])})^{2} = ${paren(dx)}^{2} + ${paren(dy)}^{2} = ${dx * dx + dy * dy}`;
}

/** decimal2 writes a number rounded to two decimal places. */
const decimal2 = (x: number) => (Math.round(x * 100) / 100).toFixed(2);

/** rootPlain writes the square root of n in simplest radical form for a drawing. */
function rootPlain(n: number): string {
  const [k, m] = simplifyRadical(n);
  return m === 1 ? String(k) : `${k === 1 ? "" : k}√${m}`;
}

/** circleMark draws the circle of radius r about c as the given curve. */
const circleMark = (c: Point, r: number): PlaneMark => ({ kind: "circle", center: c, r, accent: true });

/** radiusMarks draws the radius from the center c to the point p of the circle, with its run and rise as dashed legs. */
const radiusMarks = (c: Point, p: Point): PlaneMark[] => [
  { kind: "segment", a: c, b: p, tone: "action" },
  ...(c[0] === p[0] || c[1] === p[1] ? [] : legs(c, p)),
];

/** substituted writes the left side of (x − h)² + (y − k)² = r² at the point p, down to its value. */
function substituted(h: number, k: number, p: Point): string {
  const [dx, dy] = [p[0] - h, p[1] - k];
  return `(${p[0]} - ${paren(h)})^{2} + (${p[1]} - ${paren(k)})^{2} = ${paren(dx)}^{2} + ${paren(dy)}^{2} = ${dx * dx + dy * dy}`;
}

/** squareBack writes that squaring a radius in simplest radical form gives back r², or nothing for a whole radius. */
function squareBack(r2: number): Text {
  const [k, m] = simplifyRadical(r2);
  if (m === 1) return t(`$${k}^{2} = ${r2}$`, `$${k}^{2} = ${r2}$`);
  return t(
    k === 1 ? `$(${radical(k, m)})^{2} = ${r2}$` : `$(${radical(k, m)})^{2} = ${k}^{2} \\cdot ${m} = ${r2}$`,
    k === 1 ? `$(${radical(k, m)})^{2} = ${r2}$` : `$(${radical(k, m)})^{2} = ${k}^{2} \\cdot ${m} = ${r2}$`,
  );
}

/** rootSteps writes √n = √(a²) · √m = a√m, or the shorter form when there is nothing to take out. */
function rootSteps(n: number): string {
  const [k, m] = simplifyRadical(n);
  if (m === 1) return `\\sqrt{${n}} = ${k}`;
  if (k === 1) return `\\sqrt{${n}}`;
  return `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`;
}

// ---------------------------------------------------------------------------
// Circles in the coordinate plane
// ---------------------------------------------------------------------------

/** circlesInTheCoordinatePlane reads circles drawn on the grid: their centers, their radii, and where points lie. */
export const circlesInTheCoordinatePlane: TopicDef = {
  id: "circles-in-the-coordinate-plane",
  title: t("Circles in the Coordinate Plane", "坐标平面中的圆"),
  summary: t(
    "Read the center and radius of a circle from its graph, find a radius with the Pythagorean theorem, and locate points inside, on or outside a circle.",
    "从图象读出圆心和半径，用勾股定理求半径，并判断点在圆内、圆上还是圆外。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem", "the-coordinate-plane"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "circles", weight: 0.3 },
    { topic: "the-coordinate-plane", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `A circle is the set of all points at the same distance, the **radius**, from one point, the **center**. On the coordinate plane we can measure that distance with coordinates.

Take the circle with center $(-1, 1)$ and radius $5$. Along the grid lines its points are easy to find: $5$ to the right is $(4, 1)$, $5$ up is $(-1, 6)$, and likewise $(-6, 1)$ and $(-1, -4)$. But the circle also passes through points off those lines, such as $(2, 5)$:

{{figure 0}}

From the center to $(2, 5)$ the run is $3$ and the rise is $4$, so the distance is $\\sqrt{3^{2} + 4^{2}} = 5$, the radius. The Pythagorean theorem measures every radius, slanted or not.

So a circle on the grid is known by its center and its radius. In this lesson we read both from a graph, find a radius from the center and one point, and decide whether a point lies inside, on or outside a circle by comparing its distance from the center with the radius.`,
    `圆是到一个点（**圆心**）距离都相等的所有点组成的图形，这个距离叫**半径**。在坐标平面上，这个距离可以用坐标来量。

看圆心为 $(-1, 1)$、半径为 $5$ 的圆。沿网格线，它上面的点很好找：向右 $5$ 是 $(4, 1)$，向上 $5$ 是 $(-1, 6)$，同样还有 $(-6, 1)$ 和 $(-1, -4)$。但圆也经过不在这些线上的点，比如 $(2, 5)$：

{{figure 0}}

从圆心到 $(2, 5)$，水平变化 $3$，竖直变化 $4$，所以距离是 $\\sqrt{3^{2} + 4^{2}} = 5$，正是半径。无论半径斜不斜，勾股定理都能量出它。

所以网格上的圆由圆心和半径确定。这节课我们从图象读出这两者，由圆心和圆上一点求半径，并通过比较点到圆心的距离与半径，判断点在圆内、圆上还是圆外。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -7, xMax: 5, yMin: -5, yMax: 7 },
      [
        circleMark([-1, 1], 5),
        { kind: "segment", a: [-1, 1], b: [4, 1], dashed: true },
        { kind: "segment", a: [-1, 1], b: [-1, 6], dashed: true },
        ...radiusMarks([-1, 1], [2, 5]),
        { kind: "point", at: [-1, 1], label: "(−1, 1)", dir: "sw" },
        { kind: "point", at: [4, 1], label: "(4, 1)", dir: "e" },
        { kind: "point", at: [-1, 6], label: "(−1, 6)", dir: "n" },
        { kind: "point", at: [2, 5], label: "(2, 5)", dir: "ne", tone: "result" },
      ],
      "The circle with center (−1, 1) and radius 5. Radii run along the grid to (4, 1) and (−1, 6), and a slanted radius to (2, 5) has a run of 3 and a rise of 4.",
      "圆心为 (−1, 1)、半径为 5 的圆。沿网格的半径通向 (4, 1) 和 (−1, 6)，通向 (2, 5) 的斜半径水平变化 3、竖直变化 4。",
    ),
  ],
  knowledgePoints: [
    {
      id: "center-and-radius-from-a-graph",
      figure: planeCircleDrawings["center-and-radius-from-a-graph"],
      title: t("Center and radius from a graph", "从图象读圆心和半径"),
      explanation: t(
        `A circle in the coordinate plane is fixed by its **center** $(h, k)$ and its **radius** $r$.

- The center is midway between the leftmost and rightmost points of the circle, and midway between its lowest and highest points, because each of those pairs is the two ends of a diameter.
- The radius is the distance from the center to any point of the circle. Count it along a grid line: from the center straight right to the circle, for example.

If a circle's leftmost point is $(-1, 2)$ and its rightmost point is $(7, 2)$, its center is at $x = \\frac{-1 + 7}{2} = 3$, so it is $(3, 2)$, and its radius is $7 - 3 = 4$.

> **Watch out.** Write the center as $(x, y)$: the horizontal coordinate first. Watch the signs of the coordinates, and do not take the leftmost point of the circle for its center. The radius goes from the center to the circle, half the distance across: $8$ here is the diameter, and counting grid lines instead of the gaps between them gives one too many.`,
        `坐标平面中的圆由**圆心** $(h, k)$ 和**半径** $r$ 确定。

- 圆心位于圆的最左点和最右点的正中间，也位于最低点和最高点的正中间，因为每一对点都是一条直径的两端。
- 半径是圆心到圆上任意一点的距离。可以沿网格线数，例如从圆心向右数到圆上。

若一个圆的最左点是 $(-1, 2)$，最右点是 $(7, 2)$，则圆心的横坐标是 $\\frac{-1 + 7}{2} = 3$，圆心是 $(3, 2)$，半径是 $7 - 3 = 4$。

> **注意。** 圆心按 $(x, y)$ 写：横坐标在前。注意坐标的正负号，也不要把圆的最左点当成圆心。半径是从圆心到圆上的距离，是横跨圆的距离的一半：这里的 $8$ 是直径；数网格线而不是数格子间隔，会多数一个。`,
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const r = rng.int(1, 5);
        const view = viewAround(h, k, r);
        const askCenter = rng.bool();
        const marks: PlaneMark[] = [...planeCircle(h, k, r), ...(askCenter ? [] : [{ kind: "point" as const, at: [h, k] as Point }])];
        const figure: Figure = {
          svg: plane(view, marks),
          alt: askCenter
            ? t(`A circle of radius ${r} centered at (${h}, ${k}).`, `一个半径为 ${r}、圆心为 (${h}, ${k}) 的圆。`)
            : t(`A circle of radius ${r} with its center (${h}, ${k}) marked.`, `一个半径为 ${r} 的圆，标出了圆心 (${h}, ${k})。`),
        };
        const C: Point = [h, k];
        const [L, R, D, U]: [Point, Point, Point, Point] = [
          [h - r, k],
          [h + r, k],
          [h, k - r],
          [h, k + r],
        ];
        if (askCenter)
          return {
            ...pointProblem({
              prompt: t("What is the center of the circle?", "这个圆的圆心是哪一点？"),
              answer: [h, k],
              wrong: [
                [k, h],
                [-h, -k],
                [h - r, k],
              ],
              solution: t(
                `${stepLabel(1, "The x-coordinate", "横坐标").en} The leftmost and rightmost points of the circle are $${pointLatex(L)}$ and $${pointLatex(R)}$, the ends of a horizontal diameter. The center is midway between them:${steps(`x = \\frac{${L[0]} + ${paren(R[0])}}{2} = ${h}`)}${stepLabel(2, "The y-coordinate", "纵坐标").en} The lowest and highest points are $${pointLatex(D)}$ and $${pointLatex(U)}$, the ends of a vertical diameter:${steps(`y = \\frac{${D[1]} + ${paren(U[1])}}{2} = ${k}`)}So the center is $${pointLatex(C)}$.

{{figure 0}}

**Check.** The center is the same distance from all four points: $${R[0]} - ${paren(h)} = ${r}$ to the right and left, and $${U[1]} - ${paren(k)} = ${r}$ up and down. That common distance, $${r}$, is the radius.`,
                `${stepLabel(1, "The x-coordinate", "横坐标")["zh-CN"]}圆的最左点和最右点是 $${pointLatex(L)}$ 和 $${pointLatex(R)}$，它们是一条水平直径的两端。圆心在它们的正中间：${steps(`x = \\frac{${L[0]} + ${paren(R[0])}}{2} = ${h}`)}${stepLabel(2, "The y-coordinate", "纵坐标")["zh-CN"]}最低点和最高点是 $${pointLatex(D)}$ 和 $${pointLatex(U)}$，它们是一条竖直直径的两端：${steps(`y = \\frac{${D[1]} + ${paren(U[1])}}{2} = ${k}`)}所以圆心是 $${pointLatex(C)}$。

{{figure 0}}

**检验。** 圆心到这四个点的距离都相同：向左、向右都是 $${R[0]} - ${paren(h)} = ${r}$，向上、向下都是 $${U[1]} - ${paren(k)} = ${r}$。这个共同的距离 $${r}$ 就是半径。`,
              ),
            }),
            figure,
            solutionFigures: [
              overlay(
                figure,
                view,
                [
                  { kind: "segment", a: L, b: R, dashed: true, tone: "action" },
                  { kind: "segment", a: D, b: U, dashed: true, tone: "action" },
                  { kind: "point", at: L, label: plainPt(L), dir: "w" },
                  { kind: "point", at: R, label: plainPt(R), dir: "e" },
                  { kind: "point", at: C, label: plainPt(C), dir: "ne", tone: "result" },
                ],
                `The horizontal and vertical diameters cross at the center (${h}, ${k}).`,
                `水平直径和竖直直径相交于圆心 (${h}, ${k})。`,
              ),
            ],
          };
        return {
          ...numberProblem({
            prompt: t("The center of the circle is marked. What is the radius of the circle?", "图中标出了圆心。这个圆的半径是多少？"),
            answer: r,
            wrong: [2 * r, r * r, r + 1],
            solution: t(
              `${stepLabel(1, "Go along a grid line", "沿网格线走").en} The center is $${pointLatex(C)}$. Straight to its right the circle crosses the horizontal grid line through the center at $${pointLatex(R)}$.

{{figure 0}}

${stepLabel(2, "Subtract", "相减").en} Along that line only $x$ changes, so the radius is${steps(`r = ${R[0]} - ${paren(h)} = ${r}`)}**Check.** Straight up, the circle is at $${pointLatex(U)}$, and $${U[1]} - ${paren(k)} = ${r}$ as well. The whole width of the circle, from $x = ${L[0]}$ to $x = ${R[0]}$, is $${2 * r}$, the diameter, twice the radius.`,
              `${stepLabel(1, "Go along a grid line", "沿网格线走")["zh-CN"]}圆心是 $${pointLatex(C)}$。从它向右，圆与过圆心的水平网格线交于 $${pointLatex(R)}$。

{{figure 0}}

${stepLabel(2, "Subtract", "相减")["zh-CN"]}沿这条线只有 $x$ 变化，所以半径是${steps(`r = ${R[0]} - ${paren(h)} = ${r}`)}**检验。** 向正上方，圆在 $${pointLatex(U)}$，同样 $${U[1]} - ${paren(k)} = ${r}$。圆的整个宽度从 $x = ${L[0]}$ 到 $x = ${R[0]}$，是 $${2 * r}$，即直径，是半径的两倍。`,
            ),
          }),
          figure,
          solutionFigures: [
            overlay(
              figure,
              view,
              [
                { kind: "arrow", from: C, to: R, tone: "action" },
                { kind: "segment", a: C, b: U, dashed: true },
                { kind: "label", at: [h + r / 2, k], text: String(r), dir: "s" },
                { kind: "point", at: R, label: plainPt(R), dir: "e", tone: "result" },
              ],
              `From the center (${h}, ${k}) straight right to (${h + r}, ${k}) is ${r}.`,
              `从圆心 (${h}, ${k}) 向右到 (${h + r}, ${k}) 是 ${r}。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-the-center-and-a-point",
      figure: planeCircleDrawings["radius-from-the-center-and-a-point"],
      title: t("The radius from the center and a point", "由圆心和圆上一点求半径"),
      explanation: t(
        `The radius is the distance from the center to a point of the circle. Draw a right triangle whose legs are the horizontal and vertical changes between the two points; the radius is its hypotenuse, so the Pythagorean theorem gives it.

A circle with center $(1, -2)$ passes through $(4, 4)$. The legs are $4 - 1 = 3$ and $4 - (-2) = 6$, so

$$r^{2} = 3^{2} + 6^{2} = 45, \\qquad r = \\sqrt{45} = \\sqrt{9} \\cdot \\sqrt{5} = 3\\sqrt{5}.$$

> **Watch out.** The radius is not the sum of the legs, $3 + 6$: a hypotenuse is shorter than the two legs together. The squares of the legs are added, never subtracted. And $45$ is $r^{2}$; finish with the square root and simplify it.`,
        `半径是圆心到圆上一点的距离。以两点之间的水平变化量和竖直变化量为直角边画一个直角三角形，半径就是它的斜边，所以用勾股定理求。

圆心为 $(1, -2)$ 的圆经过 $(4, 4)$。两条直角边是 $4 - 1 = 3$ 和 $4 - (-2) = 6$，所以

$$r^{2} = 3^{2} + 6^{2} = 45, \\qquad r = \\sqrt{45} = \\sqrt{9} \\cdot \\sqrt{5} = 3\\sqrt{5}.$$

> **注意。** 半径不是两条直角边之和 $3 + 6$：斜边比两条直角边之和短。两条直角边的平方相加，绝不相减。$45$ 是 $r^{2}$，最后还要开平方并化简。`,
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const [h, k] = [rng.int(-8, 8), rng.int(-8, 8)];
        const [dx, dy] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const s = Math.abs(dx) + Math.abs(dy);
        const lo = Math.max(Math.abs(dx), Math.abs(dy));
        const back = squareBack(r2);
        const C: Point = [h, k];
        return {
          ...radicalProblem({
            prompt: t(
              `A circle has center $${pointLatex([h, k])}$ and passes through $${pointLatex(p)}$. Find its radius in simplest radical form.`,
              `一个圆的圆心是 $${pointLatex([h, k])}$，且经过点 $${pointLatex(p)}$。求它的半径（化为最简根式）。`,
            ),
            answer: rootAnswer(r2),
            wrong: [String(r2), String(s), rootTex(Math.abs(dx * dx - dy * dy) || 1)],
            solution: t(
              `${stepLabel(1, "The legs", "直角边").en} From the center to the point the run is $${p[0]} - ${paren(h)} = ${dx}$ and the rise is $${p[1]} - ${paren(k)} = ${dy}$. The radius is the hypotenuse of the right triangle with these legs:

{{figure 0}}

${stepLabel(2, "The Pythagorean theorem", "勾股定理").en}${steps(`r^{2} = ${squaredDistance(C, p)}`, `r = ${rootSteps(r2)}`)}**Check.** Squaring the answer gives back $r^{2}$: ${back.en}. As a decimal $r \\approx ${decimal2(Math.sqrt(r2))}$, longer than the longer leg, $${lo}$, and shorter than the legs together, $${s}$.`,
              `${stepLabel(1, "The legs", "直角边")["zh-CN"]}从圆心到这一点，水平变化 $${p[0]} - ${paren(h)} = ${dx}$，竖直变化 $${p[1]} - ${paren(k)} = ${dy}$。半径是以它们为直角边的直角三角形的斜边：

{{figure 0}}

${stepLabel(2, "The Pythagorean theorem", "勾股定理")["zh-CN"]}${steps(`r^{2} = ${squaredDistance(C, p)}`, `r = ${rootSteps(r2)}`)}**检验。** 把答案平方得回 $r^{2}$：${back["zh-CN"]}。化成小数 $r \\approx ${decimal2(Math.sqrt(r2))}$，比较长的直角边 $${lo}$ 长，又比两条直角边之和 $${s}$ 短。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                ...radiusMarks(C, p),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, p) },
                { kind: "point", at: p, label: plainPt(p), dir: away(p, C), tone: "result" },
              ],
              `The radius from (${h}, ${k}) to ${plainPt(p)} has legs ${Math.abs(dx)} and ${Math.abs(dy)}, so it is ${rootPlain(r2)}.`,
              `从 (${h}, ${k}) 到 ${plainPt(p)} 的半径，两条直角边是 ${Math.abs(dx)} 和 ${Math.abs(dy)}，所以长 ${rootPlain(r2)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "inside-on-or-outside",
      figure: planeCircleDrawings["circles-in-the-coordinate-plane#inside-on-or-outside"],
      title: t("Inside, on or outside", "圆内、圆上还是圆外"),
      explanation: t(
        `To locate a point $P$, compare its distance $d$ from the center with the radius: the points of the circle are exactly those at distance $r$, the points inside are closer, and the points outside are farther. Comparing the **squares** avoids square roots, and since both are positive, squaring keeps the order: with $d^{2} = (\\Delta x)^{2} + (\\Delta y)^{2}$,

- $d^{2} < r^{2}$: $P$ is inside the circle;
- $d^{2} = r^{2}$: $P$ is on the circle;
- $d^{2} > r^{2}$: $P$ is outside the circle.

For the circle with center $(2, 1)$ and radius $5$, the point $(6, 4)$ has $d^{2} = 4^{2} + 3^{2} = 25 = 5^{2}$: it is on the circle. The point $(7, 3)$ has $d^{2} = 5^{2} + 2^{2} = 29 > 25$: it is outside.

> **Watch out.** Compare $d^{2}$ with $r^{2}$, not with $r$: $29$ against $5$ would put every point outside. Square the changes in $x$ and $y$ before adding them; their plain sum is not a distance.`,
        `要判断点 $P$ 的位置，比较它到圆心的距离 $d$ 与半径：圆上的点到圆心的距离恰好是 $r$，圆内的点更近，圆外的点更远。比较它们的**平方**可以避免开方；两者都是正数，平方不改变大小关系：设 $d^{2} = (\\Delta x)^{2} + (\\Delta y)^{2}$，

- $d^{2} < r^{2}$：$P$ 在圆内；
- $d^{2} = r^{2}$：$P$ 在圆上；
- $d^{2} > r^{2}$：$P$ 在圆外。

对圆心为 $(2, 1)$、半径为 $5$ 的圆，点 $(6, 4)$ 满足 $d^{2} = 4^{2} + 3^{2} = 25 = 5^{2}$，在圆上；点 $(7, 3)$ 满足 $d^{2} = 5^{2} + 2^{2} = 29 > 25$，在圆外。

> **注意。** 要拿 $d^{2}$ 和 $r^{2}$ 比，不是和 $r$ 比：拿 $29$ 和 $5$ 比，所有的点都会算到圆外。$x$ 和 $y$ 的变化量要先平方再相加；直接相加得到的不是距离。`,
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const kind = rng.int(0, 2);
        let r: number;
        let dx: number;
        let dy: number;
        if (kind === 1) {
          r = rng.pick(integerRadii.slice(0, 5));
          [dx, dy] = rng.pick(offAxis(r * r));
        } else {
          r = rng.int(3, 10);
          const r2 = r * r;
          [dx, dy] = kind === 0 ? [1, 1] : [r, 1];
          for (let i = 0; i < 40; i++) {
            const [a, b] = [rng.nonZero(-r, r), rng.nonZero(-r, r)];
            const d2 = a * a + b * b;
            if (kind === 0 ? d2 < r2 && 2 * d2 > r2 : d2 > r2 && d2 < 2 * r2) {
              [dx, dy] = [a, b];
              break;
            }
          }
        }
        const p: Point = [h + dx, k + dy];
        const C: Point = [h, k];
        const d2 = dx * dx + dy * dy;
        const rel = ["<", "=", ">"][kind]!;
        const d = Math.sqrt(d2);
        const dTex = Number.isInteger(d) ? String(d) : `\\sqrt{${d2}} \\approx ${decimal2(d)}`;
        const where = insideOnOutside[kind]!;
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `A circle has center $${pointLatex([h, k])}$ and radius $${r}$. Where is the point $${pointLatex(p)}$?`,
                `一个圆的圆心是 $${pointLatex([h, k])}$，半径是 $${r}$。点 $${pointLatex(p)}$ 在哪里？`,
              ),
              options: insideOnOutside,
              correct: kind,
              solution: t(
                `${stepLabel(1, "The squared distance", "距离的平方").en} The run from the center to the point is $${dx}$ and the rise is $${dy}$, so the squared distance is${steps(`d^{2} = ${squaredDistance(C, p)}`)}${stepLabel(2, "Compare with the squared radius", "与半径的平方比较").en} The squared radius is $${r}^{2} = ${r * r}$, and $${d2} ${rel} ${r * r}$. So the point is ${where.en.toLowerCase()}.

{{figure 0}}

**Check.** With the square roots taken, the distance is $d = ${dTex}$ against the radius $${r}$: the same comparison, $d ${rel} ${r}$.`,
                `${stepLabel(1, "The squared distance", "距离的平方")["zh-CN"]}从圆心到这一点，水平变化 $${dx}$，竖直变化 $${dy}$，所以距离的平方是${steps(`d^{2} = ${squaredDistance(C, p)}`)}${stepLabel(2, "Compare with the squared radius", "与半径的平方比较")["zh-CN"]}半径的平方是 $${r}^{2} = ${r * r}$，而 $${d2} ${rel} ${r * r}$。所以该点${where["zh-CN"]}。

{{figure 0}}

**检验。** 开平方后，距离 $d = ${dTex}$，半径是 $${r}$：比较结果相同，$d ${rel} ${r}$。`,
              ),
            }),
            [
              [
                insideOnOutside[0]!.en,
                `Inside needs $d^{2} < ${r}^{2}$, but $d^{2} = ${d2}$ and $${r}^{2} = ${r * r}$.`,
                `在圆内要求 $d^{2} < ${r}^{2}$，但 $d^{2} = ${d2}$，$${r}^{2} = ${r * r}$。`,
              ],
              [
                insideOnOutside[1]!.en,
                `On the circle needs $d^{2} = ${r}^{2}$, but $d^{2} = ${d2}$ and $${r}^{2} = ${r * r}$.`,
                `在圆上要求 $d^{2} = ${r}^{2}$，但 $d^{2} = ${d2}$，$${r}^{2} = ${r * r}$。`,
              ],
              [
                insideOnOutside[2]!.en,
                `Outside needs $d^{2} > ${r}^{2}$, but $d^{2} = ${d2}$ and $${r}^{2} = ${r * r}$.`,
                `在圆外要求 $d^{2} > ${r}^{2}$，但 $d^{2} = ${d2}$，$${r}^{2} = ${r * r}$。`,
              ],
            ],
          ),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.max(r, d)),
              [
                circleMark(C, r),
                ...radiusMarks(C, p),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, p) },
                { kind: "point", at: p, label: `P${plainPt(p)}`, dir: away(p, C), tone: "result" },
              ],
              `The point P${plainPt(p)} at squared distance ${d2} from the center, ${where.en.toLowerCase()} of radius ${r}.`,
              `点 P${plainPt(p)} 到圆心距离的平方是 ${d2}，${where["zh-CN"]}（半径 ${r}）。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Equations of circles
// ---------------------------------------------------------------------------

/** equationsOfCirclesCenteredAtTheOrigin writes and reads x² + y² = r². */
export const equationsOfCirclesCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-circles-centered-at-the-origin",
  title: t("Equations of Circles Centered at the Origin", "圆心在原点的圆的方程"),
  summary: t(
    "Write and read the equation $x^{2} + y^{2} = r^{2}$ of a circle centered at the origin.",
    "写出并读懂圆心在原点的圆的方程 $x^{2} + y^{2} = r^{2}$。",
  ),
  prerequisites: ["circles-in-the-coordinate-plane"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `An equation in $x$ and $y$ describes the points whose coordinates make it true. A circle should then have an equation that its points satisfy and no other point does.

Take the circle with center $(0, 0)$ and radius $5$. Its point $(3, 4)$ has run $3$ and rise $4$ from the origin, and $3^{2} + 4^{2} = 25 = 5^{2}$:

{{figure 0}}

The same holds for any point $(x, y)$ of this circle: the run is $x$, the rise is $y$, and the radius $5$ is the hypotenuse, so $x^{2} + y^{2} = 25$. A point not on the circle is closer or farther, so its $x^{2} + y^{2}$ is less or more than $25$. So $x^{2} + y^{2} = 25$ is the equation of the circle.

In general, the circle of radius $r$ about the origin is $x^{2} + y^{2} = r^{2}$. We will write it from the radius or from a point, and read the radius from it.`,
    `一个关于 $x$ 和 $y$ 的方程描述的是坐标使它成立的那些点。于是圆应该有这样一个方程：圆上的点都满足它，别的点都不满足。

看圆心为 $(0, 0)$、半径为 $5$ 的圆。圆上的点 $(3, 4)$ 距原点水平变化 $3$、竖直变化 $4$，而 $3^{2} + 4^{2} = 25 = 5^{2}$：

{{figure 0}}

对这个圆上的任何点 $(x, y)$ 都一样：水平变化是 $x$，竖直变化是 $y$，半径 $5$ 是斜边，所以 $x^{2} + y^{2} = 25$。不在圆上的点更近或更远，它的 $x^{2} + y^{2}$ 就小于或大于 $25$。所以 $x^{2} + y^{2} = 25$ 就是这个圆的方程。

一般地，以原点为圆心、半径为 $r$ 的圆是 $x^{2} + y^{2} = r^{2}$。我们将由半径或圆上一点写出它，并从方程读出半径。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
      [
        circleMark([0, 0], 5),
        ...radiusMarks([0, 0], [3, 4]),
        { kind: "point", at: [0, 0], label: "O", dir: "sw" },
        { kind: "point", at: [3, 4], label: "(3, 4)", dir: "ne", tone: "result" },
      ],
      "The circle of radius 5 about the origin, with the radius to (3, 4) as the hypotenuse of a right triangle with legs 3 and 4.",
      "以原点为圆心、半径为 5 的圆；到 (3, 4) 的半径是直角边为 3 和 4 的直角三角形的斜边。",
    ),
  ],
  knowledgePoints: [
    {
      id: "equation-from-the-radius",
      figure: planeCircleDrawings["equation-from-the-radius"],
      title: t("The equation from the radius", "由半径写方程"),
      explanation: t(
        `A point $(x, y)$ is on the circle with center $(0, 0)$ and radius $r$ exactly when its distance from the origin is $r$. By the Pythagorean theorem that distance is $\\sqrt{x^{2} + y^{2}}$, so squaring both sides gives the equation of the circle:

$$x^{2} + y^{2} = r^{2}.$$

The right side is the **square** of the radius. The circle of radius $6$ is $x^{2} + y^{2} = 36$; the circle of radius $2\\sqrt{3}$ is $x^{2} + y^{2} = (2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$.

> **Watch out.** Square the radius: $x^{2} + y^{2} = 6$ is the circle of radius $\\sqrt{6}$, not $6$. Doubling the radius, $2 \\cdot 6 = 12$, is not squaring it, and neither is doubling its square. For $2\\sqrt{3}$, square both factors: $2^{2} \\cdot 3$.`,
        `点 $(x, y)$ 在圆心为 $(0, 0)$、半径为 $r$ 的圆上，当且仅当它到原点的距离是 $r$。由勾股定理，这个距离是 $\\sqrt{x^{2} + y^{2}}$，两边平方得到圆的方程：

$$x^{2} + y^{2} = r^{2}.$$

右边是半径的**平方**。半径为 $6$ 的圆是 $x^{2} + y^{2} = 36$；半径为 $2\\sqrt{3}$ 的圆是 $x^{2} + y^{2} = (2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$。

> **注意。** 半径要平方：$x^{2} + y^{2} = 6$ 是半径为 $\\sqrt{6}$ 的圆，不是半径为 $6$ 的圆。把半径乘以 $2$（$2 \\cdot 6 = 12$）不是平方，把平方再乘以 $2$ 也不是。对 $2\\sqrt{3}$，两个因数都要平方：$2^{2} \\cdot 3$。`,
      ),
      generate(rng) {
        const r = pickRadius(rng);
        const answer = circleEq(0, 0, r.r2);
        const [k, m] = simplifyRadical(r.r2);
        const rr = Math.sqrt(r.r2);
        const sqr =
          m === 1 ? `${k}^{2} = ${r.r2}` : k === 1 ? `(${r.tex})^{2} = ${r.r2}` : `(${r.tex})^{2} = ${k}^{2} \\cdot ${m} = ${r.r2}`;
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the circle with center $(0, 0)$ and radius $${r.tex}$.`,
              `写出圆心为 $(0, 0)$、半径为 $${r.tex}$ 的圆的方程。`,
            ),
            answer,
            wrong: [circleEq(0, 0, r.r ?? k * m), circleEq(0, 0, 2 * (r.r ?? k * m)), circleEq(0, 0, 2 * r.r2)],
            solution: t(
              `${stepLabel(1, "The form of the equation", "方程的形式").en} A point $(x, y)$ is on the circle when its distance from the origin is the radius, so by the Pythagorean theorem $x^{2} + y^{2} = r^{2}$.

${stepLabel(2, "Square the radius", "把半径平方").en}${steps(sqr)}So the circle is${steps(answer)}{{figure 0}}

**Check.** The circle crosses the positive $x$-axis at $(${r.tex}, 0)$, one radius from the origin. Substituting it: $${r.r ? r.tex : `(${r.tex})`}^{2} + 0^{2} = ${r.r2}$, so it satisfies the equation.`,
              `${stepLabel(1, "The form of the equation", "方程的形式")["zh-CN"]}点 $(x, y)$ 到原点的距离等于半径时在圆上，所以由勾股定理 $x^{2} + y^{2} = r^{2}$。

${stepLabel(2, "Square the radius", "把半径平方")["zh-CN"]}${steps(sqr)}所以圆的方程是${steps(answer)}{{figure 0}}

**检验。** 圆与 $x$ 轴正半轴交于 $(${r.tex}, 0)$，距原点一个半径。代入：$${r.r ? r.tex : `(${r.tex})`}^{2} + 0^{2} = ${r.r2}$，满足方程。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(0, 0, rr),
              [
                circleMark([0, 0], rr),
                { kind: "segment", a: [0, 0], b: [rr, 0], tone: "action" },
                { kind: "label", at: [rr / 2, 0], text: r.r ? String(r.r) : rootPlain(r.r2), dir: "n" },
                { kind: "point", at: [0, 0], label: "O", dir: "sw" },
                { kind: "point", at: [rr, 0], dir: "se", tone: "result" },
              ],
              `The circle of radius ${rootPlain(r.r2)} about the origin: x² + y² = ${r.r2}.`,
              `以原点为圆心、半径为 ${rootPlain(r.r2)} 的圆：x² + y² = ${r.r2}。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-the-equation",
      title: t("The radius from the equation", "由方程求半径"),
      explanation: t(
        `In $x^{2} + y^{2} = c$ the right side is $r^{2}$, so the radius is $r = \\sqrt{c}$, simplified. The form only reads this way when $x^{2}$ and $y^{2}$ have coefficient $1$; if they have a common coefficient, divide both sides by it first:

$$3x^{2} + 3y^{2} = 24 \\;\\Rightarrow\\; x^{2} + y^{2} = 8 \\;\\Rightarrow\\; r = \\sqrt{8} = \\sqrt{4} \\cdot \\sqrt{2} = 2\\sqrt{2}.$$

> **Watch out.** The number on the right is $r^{2}$, not $r$: take its square root. Halving it does not undo squaring. And divide by the common coefficient before taking the root: $\\sqrt{24}$ is not the radius of $3x^{2} + 3y^{2} = 24$.`,
        `在 $x^{2} + y^{2} = c$ 中右边是 $r^{2}$，所以半径 $r = \\sqrt{c}$，再化简。只有 $x^{2}$ 和 $y^{2}$ 的系数是 $1$ 时才能这样读；如果它们有相同的系数，先两边同除以它：

$$3x^{2} + 3y^{2} = 24 \\;\\Rightarrow\\; x^{2} + y^{2} = 8 \\;\\Rightarrow\\; r = \\sqrt{8} = \\sqrt{4} \\cdot \\sqrt{2} = 2\\sqrt{2}.$$

> **注意。** 右边的数是 $r^{2}$，不是 $r$：要开平方。除以 $2$ 并不能抵消平方。开方前先除以公共系数：$\\sqrt{24}$ 不是 $3x^{2} + 3y^{2} = 24$ 的半径。`,
      ),
      generate(rng) {
        const c = rng.int(2, 150);
        const a = rng.bool(0.3) ? rng.int(2, 4) : 1;
        const eq = `${poly([a, "x^{2}"], [a, "y^{2}"])} = ${a * c}`;
        const back = squareBack(c);
        const rr = Math.sqrt(c);
        const first =
          a === 1
            ? t(
                `${stepLabel(1, "Read r squared", "读出 r 的平方").en} The equation has the form $x^{2} + y^{2} = r^{2}$, so $r^{2} = ${c}$.`,
                `${stepLabel(1, "Read r squared", "读出 r 的平方")["zh-CN"]}方程的形式是 $x^{2} + y^{2} = r^{2}$，所以 $r^{2} = ${c}$。`,
              )
            : t(
                `${stepLabel(1, "Divide by the common coefficient", "除以公共系数").en} The form $x^{2} + y^{2} = r^{2}$ needs coefficient $1$ on $x^{2}$ and $y^{2}$, so divide both sides by $${a}$:${steps(`x^{2} + y^{2} = ${c}`)}So $r^{2} = ${c}$.`,
                `${stepLabel(1, "Divide by the common coefficient", "除以公共系数")["zh-CN"]}形式 $x^{2} + y^{2} = r^{2}$ 要求 $x^{2}$ 和 $y^{2}$ 的系数是 $1$，所以两边同除以 $${a}$：${steps(`x^{2} + y^{2} = ${c}`)}所以 $r^{2} = ${c}$。`,
              );
        return {
          ...radicalProblem({
            prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
            answer: rootAnswer(c),
            wrong: [String(c), ...(c % 2 === 0 ? [String(c / 2)] : []), ...(a > 1 ? [rootTex(a * c)] : [])],
            solution: t(
              `${first.en}

${stepLabel(2, "Take the square root", "开平方").en} The radius is positive:${steps(`r = ${rootSteps(c)}`)}{{figure 0}}

**Check.** Squaring the radius gives back the right side: ${back.en}. The circle crosses the $x$-axis at $x = \\pm ${rootTex(c)} \\approx \\pm ${decimal2(rr)}$, and indeed $${decimal2(rr)}^{2} \\approx ${c}$.`,
              `${first["zh-CN"]}

${stepLabel(2, "Take the square root", "开平方")["zh-CN"]}半径是正数：${steps(`r = ${rootSteps(c)}`)}{{figure 0}}

**检验。** 把半径平方得回右边：${back["zh-CN"]}。圆与 $x$ 轴交于 $x = \\pm ${rootTex(c)} \\approx \\pm ${decimal2(rr)}$，确实 $${decimal2(rr)}^{2} \\approx ${c}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(0, 0, rr),
              [
                circleMark([0, 0], rr),
                { kind: "segment", a: [0, 0], b: [rr, 0], tone: "action" },
                { kind: "label", at: [rr / 2, 0], text: rootPlain(c), dir: "n" },
                { kind: "point", at: [0, 0], label: "O", dir: "sw" },
                { kind: "point", at: [rr, 0], dir: "se", tone: "result" },
              ],
              `The circle x² + y² = ${c} has radius ${rootPlain(c)}.`,
              `圆 x² + y² = ${c} 的半径是 ${rootPlain(c)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "equation-through-a-point",
      title: t("The circle through a point", "过一点的圆"),
      explanation: t(
        `A circle centered at the origin that passes through $(a, b)$ has that point at distance $r$ from the origin, so $r^{2} = a^{2} + b^{2}$: substitute the point into $x^{2} + y^{2} = r^{2}$. Through $(-3, 5)$:

$$r^{2} = (-3)^{2} + 5^{2} = 9 + 25 = 34, \\qquad x^{2} + y^{2} = 34.$$

There is no need to find $r$ itself, since the equation uses $r^{2}$.

> **Watch out.** Square each coordinate before adding: $3 + 5 = 8$ and $(-3 + 5)^{2} = 4$ are not $r^{2}$. The square of a negative coordinate is positive. And the center stays at the origin: the point goes into $r^{2}$, not into the brackets.`,
        `圆心在原点且经过 $(a, b)$ 的圆，这个点到原点的距离是 $r$，所以 $r^{2} = a^{2} + b^{2}$：把这个点代入 $x^{2} + y^{2} = r^{2}$。经过 $(-3, 5)$ 时：

$$r^{2} = (-3)^{2} + 5^{2} = 9 + 25 = 34, \\qquad x^{2} + y^{2} = 34.$$

方程用的是 $r^{2}$，所以不必求出 $r$ 本身。

> **注意。** 每个坐标先平方再相加：$3 + 5 = 8$ 和 $(-3 + 5)^{2} = 4$ 都不是 $r^{2}$。负坐标的平方是正数。圆心仍在原点：这个点用来求 $r^{2}$，不放进括号里。`,
      ),
      figure: throughAPointFigure,
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a === 0 ? rng.nonZero(-9, 9) : rng.int(-9, 9);
        const r2 = a * a + b * b;
        const answer = circleEq(0, 0, r2);
        const rr = Math.sqrt(r2);
        const P: Point = [a, b];
        const Q2: Point = [-a, -b];
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the circle centered at the origin that passes through $${pointLatex([a, b])}$.`,
              `写出圆心在原点且经过点 $${pointLatex([a, b])}$ 的圆的方程。`,
            ),
            answer,
            wrong: [circleEq(0, 0, Math.abs(a) + Math.abs(b)), circleEq(0, 0, (a + b) * (a + b) || 1), circleEq(a, b, r2)],
            solution: t(
              `${stepLabel(1, "The squared radius", "半径的平方").en} The point is on the circle, so its distance from the origin is the radius. Its run and rise from the origin are its coordinates:${steps(`r^{2} = ${paren(a)}^{2} + ${paren(b)}^{2} = ${a * a} + ${b * b} = ${r2}`)}${stepLabel(2, "The equation", "方程").en} The center is the origin, so the circle is $${answer}$.

{{figure 0}}

**Check.** The point opposite $${pointLatex(P)}$ across the center, $${pointLatex(Q2)}$, must be on the circle too, at the other end of a diameter: $${paren(-a)}^{2} + ${paren(-b)}^{2} = ${r2}$. It is.`,
              `${stepLabel(1, "The squared radius", "半径的平方")["zh-CN"]}这个点在圆上，所以它到原点的距离就是半径。它相对原点的水平变化和竖直变化就是它的坐标：${steps(`r^{2} = ${paren(a)}^{2} + ${paren(b)}^{2} = ${a * a} + ${b * b} = ${r2}`)}${stepLabel(2, "The equation", "方程")["zh-CN"]}圆心是原点，所以圆的方程是 $${answer}$。

{{figure 0}}

**检验。** 与 $${pointLatex(P)}$ 关于圆心对称的点 $${pointLatex(Q2)}$ 在一条直径的另一端，也应该在圆上：$${paren(-a)}^{2} + ${paren(-b)}^{2} = ${r2}$。确实如此。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(0, 0, rr),
              [
                circleMark([0, 0], rr),
                ...radiusMarks([0, 0], P),
                { kind: "segment", a: [0, 0], b: Q2, dashed: true },
                { kind: "point", at: [0, 0], label: "O", dir: away([0, 0], P) === "sw" ? "ne" : "sw" },
                { kind: "point", at: P, label: plainPt(P), dir: away(P, [0, 0]), tone: "result" },
                { kind: "point", at: Q2, label: plainPt(Q2), dir: away(Q2, [0, 0]) },
              ],
              `The circle x² + y² = ${r2} through ${plainPt(P)} and the opposite point ${plainPt(Q2)}.`,
              `经过 ${plainPt(P)} 和对称点 ${plainPt(Q2)} 的圆 x² + y² = ${r2}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** equationsOfCircles reads and writes the standard form (x − h)² + (y − k)² = r². */
export const equationsOfCircles: TopicDef = {
  id: "equations-of-circles",
  title: t("Equations of Circles", "圆的方程"),
  summary: t(
    "Use the standard form $(x - h)^{2} + (y - k)^{2} = r^{2}$: read the center and radius, and write the equation from a center and a radius, a point or a diameter.",
    "使用标准方程 $(x - h)^{2} + (y - k)^{2} = r^{2}$：读出圆心和半径，并由圆心与半径、圆上一点或直径写出方程。",
  ),
  prerequisites: ["equations-of-circles-centered-at-the-origin", "midpoints-in-the-coordinate-plane"],
  encompasses: [
    { topic: "equations-of-circles-centered-at-the-origin", weight: 0.5 },
    { topic: "midpoints-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `When the center is not the origin, the run and the rise of a radius are no longer the coordinates of its end: they are differences from the center.

Take the circle with center $(2, 1)$ and radius $5$. Its point $(5, 5)$ has run $5 - 2 = 3$ and rise $5 - 1 = 4$, and $3^{2} + 4^{2} = 25$:

{{figure 0}}

For any point $(x, y)$ of the circle the run is $x - 2$ and the rise is $y - 1$, so the Pythagorean theorem gives $(x - 2)^{2} + (y - 1)^{2} = 25$. This is the **standard form** of the equation of a circle with center $(h, k)$ and radius $r$:

$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$

The center can be read from the brackets and the radius from the right side; and from a center with a radius, a point or a diameter we can write the equation.`,
    `圆心不在原点时，半径的水平变化和竖直变化不再是端点的坐标，而是与圆心坐标的差。

看圆心为 $(2, 1)$、半径为 $5$ 的圆。圆上的点 $(5, 5)$ 的水平变化是 $5 - 2 = 3$，竖直变化是 $5 - 1 = 4$，而 $3^{2} + 4^{2} = 25$：

{{figure 0}}

对圆上任意点 $(x, y)$，水平变化是 $x - 2$，竖直变化是 $y - 1$，所以由勾股定理得 $(x - 2)^{2} + (y - 1)^{2} = 25$。这就是圆心为 $(h, k)$、半径为 $r$ 的圆的**标准方程**：

$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$

圆心可以从括号里读出，半径从右边读出；反过来，由圆心和半径、圆上一点或直径，也能写出方程。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -4, xMax: 8, yMin: -5, yMax: 7 },
      [
        circleMark([2, 1], 5),
        ...radiusMarks([2, 1], [5, 5]),
        { kind: "point", at: [2, 1], label: "(2, 1)", dir: "sw" },
        { kind: "point", at: [5, 5], label: "(5, 5)", dir: "ne", tone: "result" },
      ],
      "The circle with center (2, 1) and radius 5; the radius to (5, 5) has a run of 3 and a rise of 4.",
      "圆心为 (2, 1)、半径为 5 的圆；到 (5, 5) 的半径水平变化 3、竖直变化 4。",
    ),
  ],
  knowledgePoints: [
    {
      id: "center-and-radius-from-standard-form",
      figure: planeCircleDrawings["center-and-radius-from-standard-form"],
      title: t("Center and radius from the standard form", "由标准方程读圆心和半径"),
      explanation: t(
        `A point $(x, y)$ is on the circle with center $(h, k)$ and radius $r$ when its horizontal and vertical distances from the center, $x - h$ and $y - k$, satisfy the Pythagorean theorem. This gives the **standard form** of the equation of a circle:

$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$

The center's coordinates appear with **minus signs**: $(x + 4)^{2} + (y - 1)^{2} = 18$ is $(x - (-4))^{2} + (y - 1)^{2} = 18$, so the center is $(-4, 1)$ and the radius is $\\sqrt{18} = 3\\sqrt{2}$.

> **Watch out.** $(x + 4)$ means $h = -4$, not $4$: the sign in the bracket is the opposite of the coordinate. Keep the order, $x$ first. The right side is $r^{2}$; the radius is its square root, not the number itself or half of it.`,
        `点 $(x, y)$ 在圆心为 $(h, k)$、半径为 $r$ 的圆上，当且仅当它到圆心的水平距离 $x - h$ 与竖直距离 $y - k$ 满足勾股定理。这就得到圆的**标准方程**：

$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$

圆心坐标前是**减号**：$(x + 4)^{2} + (y - 1)^{2} = 18$ 就是 $(x - (-4))^{2} + (y - 1)^{2} = 18$，所以圆心是 $(-4, 1)$，半径是 $\\sqrt{18} = 3\\sqrt{2}$。

> **注意。** $(x + 4)$ 表示 $h = -4$，不是 $4$：括号里的符号与坐标的符号相反。顺序别弄反，$x$ 在前。右边是 $r^{2}$；半径是它的平方根，不是这个数本身，也不是它的一半。`,
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 9);
        const c = rng.int(1, 100);
        const eq = circleEq(h, k, c);
        const rr = Math.sqrt(c);
        const C: Point = [h, k];
        const figure = (en: string, zh: string, more: readonly PlaneMark[]) =>
          graphFigure(
            viewAround(h, k, rr),
            [circleMark(C, rr), ...more, { kind: "point", at: C, label: plainPt(C), dir: "sw", tone: "result" }],
            en,
            zh,
          );
        if (rng.bool())
          return {
            ...pointProblem({
              prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
              answer: [h, k],
              wrong: [
                [-h, -k],
                [h, -k],
                [-h, k],
                [k, h],
              ],
              solution: t(
                `${stepLabel(1, "Write both brackets as subtractions", "把两个括号都写成减法").en} The standard form subtracts the center's coordinates, so rewrite any plus sign as subtracting a negative:${steps(`(x - ${paren(h)})^{2} + (y - ${paren(k)})^{2} = ${c}`)}${stepLabel(2, "Read the center", "读出圆心").en} Now $h = ${h}$ and $k = ${k}$, so the center is $${pointLatex(C)}$.

{{figure 0}}

**Check.** Substitute the center: $(${h} - ${paren(h)})^{2} + (${k} - ${paren(k)})^{2} = 0$. Both brackets vanish only at the center, the one point at distance $0$ from itself.`,
                `${stepLabel(1, "Write both brackets as subtractions", "把两个括号都写成减法")["zh-CN"]}标准方程减去的是圆心的坐标，所以把加号改写成减去一个负数：${steps(`(x - ${paren(h)})^{2} + (y - ${paren(k)})^{2} = ${c}`)}${stepLabel(2, "Read the center", "读出圆心")["zh-CN"]}现在 $h = ${h}$，$k = ${k}$，所以圆心是 $${pointLatex(C)}$。

{{figure 0}}

**检验。** 代入圆心：$(${h} - ${paren(h)})^{2} + (${k} - ${paren(k)})^{2} = 0$。两个括号同时为 $0$ 的只有圆心，它到自身的距离是 $0$。`,
              ),
            }),
            solutionFigures: [figure(`The circle has center (${h}, ${k}).`, `圆的圆心是 (${h}, ${k})。`, [])],
          };
        const back = squareBack(c);
        const rightPt = Number.isInteger(rr) ? pointLatex([h + rr, k]) : `(${h === 0 ? "" : `${h} + `}${rootTex(c)}, ${k})`;
        return {
          ...radicalProblem({
            prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
            answer: rootAnswer(c),
            wrong: [String(c), ...(c % 2 === 0 ? [String(c / 2)] : [])],
            solution: t(
              `${stepLabel(1, "Read r squared", "读出 r 的平方").en} The equation is in standard form, so its right side is the square of the radius: $r^{2} = ${c}$.

${stepLabel(2, "Take the square root", "开平方").en}${steps(`r = ${rootSteps(c)}`)}{{figure 0}}

**Check.** Squaring gives back the right side: ${back.en}. The point $${rightPt}$, one radius to the right of the center, satisfies the equation: its brackets are $${Number.isInteger(rr) ? rr : `(${rootTex(c)})`}^{2} = ${c}$ and $0^{2}$.`,
              `${stepLabel(1, "Read r squared", "读出 r 的平方")["zh-CN"]}方程是标准方程，右边是半径的平方：$r^{2} = ${c}$。

${stepLabel(2, "Take the square root", "开平方")["zh-CN"]}${steps(`r = ${rootSteps(c)}`)}{{figure 0}}

**检验。** 平方后得回右边：${back["zh-CN"]}。圆心右边一个半径处的点 $${rightPt}$ 满足方程：两个括号分别是 $${Number.isInteger(rr) ? rr : `(${rootTex(c)})`}^{2} = ${c}$ 和 $0^{2}$。`,
            ),
          }),
          solutionFigures: [
            figure(`The circle has radius ${rootPlain(c)}.`, `圆的半径是 ${rootPlain(c)}。`, [
              { kind: "segment", a: C, b: [h + rr, k], tone: "action" },
              { kind: "label", at: [h + rr / 2, k], text: rootPlain(c), dir: "n" },
            ]),
          ],
        };
      },
    },
    {
      id: "equation-from-center-and-radius",
      title: t("The equation from the center and radius", "由圆心和半径写方程"),
      explanation: t(
        `Substitute $h$, $k$ and $r^{2}$ into $(x - h)^{2} + (y - k)^{2} = r^{2}$. For center $(5, -2)$ and radius $\\sqrt{7}$:

$$(x - 5)^{2} + (y - (-2))^{2} = (\\sqrt{7})^{2} \\;\\Rightarrow\\; (x - 5)^{2} + (y + 2)^{2} = 7.$$

Subtracting a negative coordinate gives a plus sign, and the radius is squared.

> **Watch out.** The brackets subtract the center: center $(5, -2)$ gives $(x - 5)$ and $(y + 2)$, not $(x + 5)$ and $(y - 2)$. Keep $h$ with $x$ and $k$ with $y$. And the right side is $r^{2}$, not $r$ or $2r^{2}$.`,
        `把 $h$、$k$ 和 $r^{2}$ 代入 $(x - h)^{2} + (y - k)^{2} = r^{2}$。圆心为 $(5, -2)$、半径为 $\\sqrt{7}$ 时：

$$(x - 5)^{2} + (y - (-2))^{2} = (\\sqrt{7})^{2} \\;\\Rightarrow\\; (x - 5)^{2} + (y + 2)^{2} = 7.$$

减去负坐标得到加号，半径要平方。

> **注意。** 括号里减去的是圆心坐标：圆心 $(5, -2)$ 得 $(x - 5)$ 和 $(y + 2)$，不是 $(x + 5)$ 和 $(y - 2)$。$h$ 跟 $x$，$k$ 跟 $y$，别对调。右边是 $r^{2}$，不是 $r$，也不是 $2r^{2}$。`,
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 9);
        const r = pickRadius(rng);
        const answer = circleEq(h, k, r.r2);
        const [a, m] = simplifyRadical(r.r2);
        const rr = Math.sqrt(r.r2);
        const C: Point = [h, k];
        const sq = r.r ? r.tex : `(${r.tex})`;
        const right = r.r ? pointLatex([h + r.r, k]) : `(${h === 0 ? "" : `${h} + `}${r.tex}, ${k})`;
        const sqr =
          m === 1 ? `${a}^{2} = ${r.r2}` : a === 1 ? `(${r.tex})^{2} = ${r.r2}` : `(${r.tex})^{2} = ${a}^{2} \\cdot ${m} = ${r.r2}`;
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the circle with center $${pointLatex([h, k])}$ and radius $${r.tex}$.`,
              `写出圆心为 $${pointLatex([h, k])}$、半径为 $${r.tex}$ 的圆的方程。`,
            ),
            answer,
            wrong: [circleEq(-h, -k, r.r2), circleEq(h, k, r.r ?? a * m), circleEq(k, h, r.r2), circleEq(h, k, 2 * r.r2)],
            solution: t(
              `${stepLabel(1, "The brackets", "括号").en} Put the center into the standard form, subtracting $h = ${h}$ from $x$ and $k = ${k}$ from $y$:${steps(`(x - ${paren(h)})^{2} + (y - ${paren(k)})^{2} = r^{2}`)}${stepLabel(2, "The right side", "右边").en} The right side is the square of the radius:${steps(sqr)}So the circle is${steps(answer)}{{figure 0}}

**Check.** The point $${right}$ is one radius to the right of the center, so it must satisfy the equation: its brackets are $${sq}^{2} = ${r.r2}$ and $0^{2}$, which add to the right side. And the center itself makes both brackets $0$.`,
              `${stepLabel(1, "The brackets", "括号")["zh-CN"]}把圆心代入标准方程，$x$ 减去 $h = ${h}$，$y$ 减去 $k = ${k}$：${steps(`(x - ${paren(h)})^{2} + (y - ${paren(k)})^{2} = r^{2}`)}${stepLabel(2, "The right side", "右边")["zh-CN"]}右边是半径的平方：${steps(sqr)}所以圆的方程是${steps(answer)}{{figure 0}}

**检验。** 点 $${right}$ 在圆心右边一个半径处，应满足方程：两个括号分别是 $${sq}^{2} = ${r.r2}$ 和 $0^{2}$，相加正是右边。圆心本身使两个括号都为 $0$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, rr),
              [
                circleMark(C, rr),
                { kind: "segment", a: C, b: [h + rr, k], tone: "action" },
                { kind: "label", at: [h + rr / 2, k], text: rootPlain(r.r2), dir: "n" },
                { kind: "point", at: C, label: plainPt(C), dir: "sw" },
              ],
              `The circle with center (${h}, ${k}) and radius ${rootPlain(r.r2)}.`,
              `圆心为 (${h}, ${k})、半径为 ${rootPlain(r.r2)} 的圆。`,
            ),
          ],
        };
      },
    },
    {
      id: "equation-from-center-and-a-point",
      title: t("The equation from the center and a point", "由圆心和圆上一点写方程"),
      explanation: t(
        `If the circle passes through a point $P$, then the radius is the distance from the center to $P$, and $r^{2}$ is its square: the sum of the squares of the run and the rise. For center $(2, -1)$ and $P(5, 3)$:

$$r^{2} = (5 - 2)^{2} + (3 - (-1))^{2} = 9 + 16 = 25,$$

so the circle is $(x - 2)^{2} + (y + 1)^{2} = 25$.

> **Watch out.** The center goes into the brackets, not the point: $(x - 5)^{2} + (y - 3)^{2}$ is a circle about $P$. The squared radius uses the changes from the center, $5 - 2$ and $3 - (-1)$, squared and added; not the plain sum $3 + 4$, and not the coordinates of $P$ alone.`,
        `若圆经过点 $P$，则半径是圆心到 $P$ 的距离，$r^{2}$ 是它的平方：水平变化与竖直变化的平方和。圆心为 $(2, -1)$、$P(5, 3)$ 时：

$$r^{2} = (5 - 2)^{2} + (3 - (-1))^{2} = 9 + 16 = 25,$$

所以圆的方程是 $(x - 2)^{2} + (y + 1)^{2} = 25$。

> **注意。** 放进括号的是圆心，不是这个点：$(x - 5)^{2} + (y - 3)^{2}$ 是以 $P$ 为圆心的圆。半径的平方用的是相对圆心的变化 $5 - 2$ 和 $3 - (-1)$，平方后相加；不是直接相加 $3 + 4$，也不是只用 $P$ 的坐标。`,
      ),
      figure: centerAndPointFigure,
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const dx = rng.int(-7, 7);
        const dy = dx === 0 ? rng.nonZero(-7, 7) : rng.int(-7, 7);
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const answer = circleEq(h, k, r2);
        const C: Point = [h, k];
        const q: Point = [h - dx, k - dy];
        return {
          ...equationProblem({
            prompt: t(
              `Write the equation of the circle with center $${pointLatex([h, k])}$ that passes through $${pointLatex(p)}$.`,
              `写出圆心为 $${pointLatex([h, k])}$ 且经过点 $${pointLatex(p)}$ 的圆的方程。`,
            ),
            answer,
            wrong: [
              circleEq(-h, -k, r2),
              circleEq(p[0], p[1], r2),
              circleEq(h, k, Math.abs(dx) + Math.abs(dy)),
              circleEq(h, k, p[0] * p[0] + p[1] * p[1] || 1),
            ],
            solution: t(
              `${stepLabel(1, "The squared radius", "半径的平方").en} The radius is the distance from the center to the point, so its square is the sum of the squares of the run and the rise:${steps(`r^{2} = ${squaredDistance(C, p)}`)}{{figure 0}}

${stepLabel(2, "The equation", "方程").en} Put the center into the brackets and $r^{2}$ on the right:${steps(answer)}**Check.** Substitute the point into the equation you wrote: $${substituted(h, k, p)}$, which is the right side. The point opposite it across the center, $${pointLatex(q)}$, gives $${substituted(h, k, q)}$ too.`,
              `${stepLabel(1, "The squared radius", "半径的平方")["zh-CN"]}半径是圆心到这个点的距离，它的平方是水平变化与竖直变化的平方和：${steps(`r^{2} = ${squaredDistance(C, p)}`)}{{figure 0}}

${stepLabel(2, "The equation", "方程")["zh-CN"]}把圆心放进括号，右边写 $r^{2}$：${steps(answer)}**检验。** 把这个点代入写出的方程：$${substituted(h, k, p)}$，正是右边。关于圆心与它对称的点 $${pointLatex(q)}$ 也得到 $${substituted(h, k, q)}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                ...radiusMarks(C, p),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, p) },
                { kind: "point", at: p, label: plainPt(p), dir: away(p, C), tone: "result" },
              ],
              `The radius from (${h}, ${k}) to ${plainPt(p)} has squared length ${r2}.`,
              `从 (${h}, ${k}) 到 ${plainPt(p)} 的半径，长度的平方是 ${r2}。`,
            ),
          ],
        };
      },
    },
    {
      id: "equation-from-a-diameter",
      title: t("The equation from a diameter", "由直径写方程"),
      explanation: t(
        `The center of a circle is the midpoint of every diameter, since it is the same distance, $r$, from both ends. The **midpoint** of the segment from $(x_1, y_1)$ to $(x_2, y_2)$ averages the coordinates:

$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$

For the diameter from $A(-1, 2)$ to $B(5, 10)$, the center is $(2, 6)$, and $r^{2}$ is the squared distance from the center to $A$: $(-1 - 2)^{2} + (2 - 6)^{2} = 25$. The circle is $(x - 2)^{2} + (y - 6)^{2} = 25$.

> **Watch out.** The squared length of the whole diameter, $100$, is $(2r)^{2} = 4r^{2}$, not $r^{2}$: measure from the center to one end. The center is the midpoint, not an endpoint, and not half the difference of the endpoints.`,
        `圆心是每条直径的中点，因为它到两端的距离都是 $r$。从 $(x_1, y_1)$ 到 $(x_2, y_2)$ 的线段的**中点**取坐标的平均数：

$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$

对从 $A(-1, 2)$ 到 $B(5, 10)$ 的直径，圆心是 $(2, 6)$，$r^{2}$ 是圆心到 $A$ 的距离的平方：$(-1 - 2)^{2} + (2 - 6)^{2} = 25$。圆的方程是 $(x - 2)^{2} + (y - 6)^{2} = 25$。

> **注意。** 整条直径长度的平方 $100$ 是 $(2r)^{2} = 4r^{2}$，不是 $r^{2}$：要从圆心量到一端。圆心是中点，不是端点，也不是两端点之差的一半。`,
      ),
      figure: diameterFigure,
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const dx = rng.int(-6, 6);
        const dy = dx === 0 ? rng.nonZero(-6, 6) : rng.int(-6, 6);
        const a: Point = [h + dx, k + dy];
        const b: Point = [h - dx, k - dy];
        const r2 = dx * dx + dy * dy;
        const answer = circleEq(h, k, r2);
        const C: Point = [h, k];
        return {
          ...equationProblem({
            prompt: t(
              `The segment from $A${pointLatex(a)}$ to $B${pointLatex(b)}$ is a diameter of a circle. Write the equation of the circle.`,
              `从 $A${pointLatex(a)}$ 到 $B${pointLatex(b)}$ 的线段是一个圆的直径。写出这个圆的方程。`,
            ),
            answer,
            wrong: [circleEq(h, k, 4 * r2), circleEq(dx, dy, r2), circleEq(a[0], a[1], 4 * r2), circleEq(-h, -k, r2)],
            solution: t(
              `${stepLabel(1, "The center", "圆心").en} The center is the midpoint of the diameter $AB$:${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(C)}`)}${stepLabel(2, "The squared radius", "半径的平方").en} The radius goes from the center to one end, $A$:${steps(`r^{2} = ${squaredDistance(C, a)}`)}{{figure 0}}

${stepLabel(3, "The equation", "方程").en}${steps(answer)}**Check.** The other end is on the circle too: $${substituted(h, k, b)}$. And the whole diameter is twice the radius: $AB^{2} = ${paren(b[0] - a[0])}^{2} + ${paren(b[1] - a[1])}^{2} = ${4 * r2} = 4 \\cdot ${r2}$.`,
              `${stepLabel(1, "The center", "圆心")["zh-CN"]}圆心是直径 $AB$ 的中点：${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(C)}`)}${stepLabel(2, "The squared radius", "半径的平方")["zh-CN"]}半径从圆心到一端 $A$：${steps(`r^{2} = ${squaredDistance(C, a)}`)}{{figure 0}}

${stepLabel(3, "The equation", "方程")["zh-CN"]}${steps(answer)}**检验。** 另一端也在圆上：$${substituted(h, k, b)}$。整条直径是半径的两倍：$AB^{2} = ${paren(b[0] - a[0])}^{2} + ${paren(b[1] - a[1])}^{2} = ${4 * r2} = 4 \\cdot ${r2}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a, b, dashed: true },
                ...radiusMarks(C, a),
                { kind: "point", at: a, label: "A", dir: away(a, C) },
                { kind: "point", at: b, label: "B", dir: away(b, C) },
                { kind: "point", at: C, label: plainPt(C), dir: dx * dy > 0 ? "se" : "ne", tone: "result" },
              ],
              `The center (${h}, ${k}) is the midpoint of AB, and the radius to A has squared length ${r2}.`,
              `圆心 (${h}, ${k}) 是 AB 的中点，到 A 的半径长度的平方是 ${r2}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Completing the square
// ---------------------------------------------------------------------------

/** completedSquareFigure shows x² + y² − 6x + 4y − 12 = 0, the circle with center (3, −2) and radius 5. */
const completedSquareFigure = exampleFigure(
  { xMin: -3, xMax: 9, yMin: -8, yMax: 4 },
  [
    ...planeCircle(3, -2, 5),
    { kind: "segment", a: [3, -2], b: [8, -2] },
    { kind: "label", at: [5.5, -2], text: "5", dir: "s" },
    { kind: "point", at: [3, -2], label: "(3, −2)", dir: "nw" },
  ],
  "The circle x² + y² − 6x + 4y − 12 = 0, which completing the square turns into (x − 3)² + (y + 2)² = 25: center (3, −2) and radius 5.",
  "圆 x² + y² − 6x + 4y − 12 = 0，配方后化为 (x − 3)² + (y + 2)² = 25：圆心为 (3, −2)，半径为 5。",
);

/** completionSteps works x² + y² + Dx + Ey + F = 0, with D = −2h and E = −2k, into standard form in three labeled steps, the first numbered first. */
function completionSteps(h: number, k: number, F: number, first = 1): Text {
  const r2 = h * h + k * k - F;
  // A variable with no linear term needs no grouping and no added square.
  const group = (c: number, v: string, constant: number) => (c === 0 ? `${v}^{2}` : `(${quad(1, -2 * c, constant, v)})`);
  const halves = (
    [
      [h, "x"],
      [k, "y"],
    ] as const
  )
    .filter(([c]) => c !== 0)
    .map(([c, v]) => [
      `$${v}$: $\\frac{${-2 * c}}{2} = ${-c}$, $${paren(-c)}^{2} = ${c * c}$`,
      `$${v}$：$\\frac{${-2 * c}}{2} = ${-c}$，$${paren(-c)}^{2} = ${c * c}$`,
    ]);
  const s1 = stepLabel(first, "Group and move the constant", "分组并移项");
  const s2 = stepLabel(first + 1, "Complete each square", "分别配方");
  const s3 = stepLabel(first + 2, "Write the squares", "写成平方");
  const l1 = steps(`${group(h, "x", 0)} + ${group(k, "y", 0)} = ${-F}`);
  const l2 = steps(`${group(h, "x", h * h)} + ${group(k, "y", k * k)} = ${poly([-F, ""], [h * h, ""], [k * k, ""])}`);
  const l3 = steps(`${sqTerm("x", h)} + ${sqTerm("y", k)} = ${r2}`);
  return t(
    `${s1.en} Put the $x$ terms together, the $y$ terms together, and the constant on the right:${l1}${s2.en} Halve the coefficient of each linear term and square it: ${halves.map((p) => p[0]).join("; ")}. Add these squares to **both** sides:${l2}${s3.en} Each bracket is now a perfect square:${l3}`,
    `${s1["zh-CN"]}把含 $x$ 的项放在一起、含 $y$ 的项放在一起，常数移到右边：${l1}${s2["zh-CN"]}把每个一次项的系数减半再平方：${halves.map((p) => p[1]).join("；")}。把这些平方数加到**两边**：${l2}${s3["zh-CN"]}每个括号现在都是完全平方：${l3}`,
  );
}

/** shortcutR2 writes r² = (D/2)² + (E/2)² − F for the general form with D = −2h and E = −2k. */
function shortcutR2(h: number, k: number, F: number): string {
  return `\\left(\\frac{${-2 * h}}{2}\\right)^{2} + \\left(\\frac{${-2 * k}}{2}\\right)^{2} - ${paren(F)} = ${h * h} + ${k * k} - ${paren(F)} = ${h * h + k * k - F}`;
}

/** circleFigure draws the circle with center (h, k) and squared radius r2 with a radius to the right, labeled. */
function circleFigure(h: number, k: number, r2: number, en: string, zh: string): Figure {
  const rr = Math.sqrt(r2);
  return graphFigure(
    viewAround(h, k, rr),
    [
      circleMark([h, k], rr),
      { kind: "segment", a: [h, k], b: [h + rr, k], tone: "action" },
      { kind: "label", at: [h + rr / 2, k], text: rootPlain(r2), dir: "n" },
      { kind: "point", at: [h, k], label: plainPt([h, k]), dir: "s", tone: "result" },
    ],
    en,
    zh,
  );
}

/** determiningCirclePropertiesByCompletingTheSquare turns the general form of a circle back into its standard form. */
export const determiningCirclePropertiesByCompletingTheSquare: TopicDef = {
  id: "determining-circle-properties-by-completing-the-square",
  title: t("Determining Circle Properties by Completing the Square", "用配方法确定圆的性质"),
  summary: t(
    "Complete the square in $x$ and in $y$ to find the center and radius of $x^{2} + y^{2} + Dx + Ey + F = 0$, and tell whether it is a circle at all.",
    "对 $x$ 和 $y$ 分别配方，求 $x^{2} + y^{2} + Dx + Ey + F = 0$ 的圆心和半径，并判断它是否表示圆。",
  ),
  prerequisites: ["equations-of-circles", "completing-the-square"],
  encompasses: [
    { topic: "equations-of-circles", weight: 0.6 },
    { topic: "completing-the-square", weight: 0.6 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `Expanding the standard form of a circle hides its center and radius. The circle with center $(-2, 1)$ and radius $3$ is $(x + 2)^{2} + (y - 1)^{2} = 9$; multiplying out the squares gives

$$x^{2} + 4x + 4 + y^{2} - 2y + 1 = 9 \\;\\Rightarrow\\; x^{2} + y^{2} + 4x - 2y - 4 = 0.$$

This is the **general form** $x^{2} + y^{2} + Dx + Ey + F = 0$. Neither $(-2, 1)$ nor $3$ can be read from it directly.

To get them back we undo the expansion: **complete the square** in $x$ and in $y$. Half of $4$ is $2$ and $2^{2} = 4$; half of $-2$ is $-1$ and $(-1)^{2} = 1$. Adding $4$ and $1$ to both sides of $x^{2} + 4x + y^{2} - 2y = 4$ rebuilds

$$(x + 2)^{2} + (y - 1)^{2} = 9,$$

the circle we started with:

{{figure 0}}

In this lesson we find the center and the radius this way, handle a common coefficient on $x^{2}$ and $y^{2}$, and see that some equations of this form are a single point, or no points at all.`,
    `把圆的标准方程展开，圆心和半径就看不出来了。圆心为 $(-2, 1)$、半径为 $3$ 的圆是 $(x + 2)^{2} + (y - 1)^{2} = 9$；把平方展开得

$$x^{2} + 4x + 4 + y^{2} - 2y + 1 = 9 \\;\\Rightarrow\\; x^{2} + y^{2} + 4x - 2y - 4 = 0.$$

这就是**一般方程** $x^{2} + y^{2} + Dx + Ey + F = 0$。从它不能直接读出 $(-2, 1)$ 和 $3$。

要找回它们，就把展开倒过来：对 $x$ 和 $y$ 分别**配方**。$4$ 的一半是 $2$，$2^{2} = 4$；$-2$ 的一半是 $-1$，$(-1)^{2} = 1$。在 $x^{2} + 4x + y^{2} - 2y = 4$ 两边加上 $4$ 和 $1$，就重新得到

$$(x + 2)^{2} + (y - 1)^{2} = 9,$$

正是开始的那个圆：

{{figure 0}}

这节课我们用这种方法求圆心和半径，处理 $x^{2}$ 和 $y^{2}$ 有公共系数的情形，还会看到这种形式的方程有时只表示一个点，甚至没有点。`,
  ),
  introFigures: [
    circleFigure(
      -2,
      1,
      9,
      "The circle x² + y² + 4x − 2y − 4 = 0, which is (x + 2)² + (y − 1)² = 9: center (−2, 1) and radius 3.",
      "圆 x² + y² + 4x − 2y − 4 = 0，即 (x + 2)² + (y − 1)² = 9：圆心 (−2, 1)，半径 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "center-by-completing-the-square",
      title: t("The center from the general form", "由一般方程求圆心"),
      explanation: t(
        `Expanding the standard form gives the **general form** $x^{2} + y^{2} + Dx + Ey + F = 0$. To go back, complete the square in $x$ and in $y$: half of each linear coefficient, squared, is the number that makes a perfect square, and it must be added to **both** sides to keep the equation true.

$$x^{2} + y^{2} - 6x + 4y - 12 = 0$$

$$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$

$$(x - 3)^{2} + (y + 2)^{2} = 25$$

The center is $(3, -2)$ and the radius is $5$. Each center coordinate is minus half the coefficient of its variable: $-\\frac{-6}{2} = 3$ and $-\\frac{4}{2} = -2$.

> **Watch out.** $(x - 3)^{2}$ means the center's $x$-coordinate is $+3$: the sign flips from the bracket. The center is half the coefficient, not the coefficient itself: $-6x$ gives $3$, not $6$. And keep $x$ first.`,
        `把标准方程展开得到**一般方程** $x^{2} + y^{2} + Dx + Ey + F = 0$。要化回去，就对 $x$ 和 $y$ 分别配方：每个一次项系数的一半再平方，就是凑成完全平方所需的数，而且必须加到**两边**，方程才仍然成立。

$$x^{2} + y^{2} - 6x + 4y - 12 = 0$$

$$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$

$$(x - 3)^{2} + (y + 2)^{2} = 25$$

圆心是 $(3, -2)$，半径是 $5$。圆心的每个坐标都是对应变量系数一半的相反数：$-\\frac{-6}{2} = 3$，$-\\frac{4}{2} = -2$。

> **注意。** $(x - 3)^{2}$ 表示圆心的横坐标是 $+3$：从括号读出时符号要反过来。圆心坐标是系数的一半，不是系数本身：$-6x$ 给出 $3$，不是 $6$。$x$ 坐标写在前面。`,
      ),
      figure: completedSquareFigure,
      keyPrerequisites: ["completing-the-square"],
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const r2 = rng.int(1, 60);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F);
        const work = completionSteps(h, k, F);
        const half = (c: number) => `-\\frac{${-2 * c}}{2} = ${c}`;
        return {
          ...pointProblem({
            prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
            answer: [h, k],
            wrong: [
              [-h, -k],
              [-2 * h, -2 * k],
              [2 * h, 2 * k],
              [k, h],
            ],
            solution: t(
              `${work.en}The standard form subtracts the center's coordinates, so the center is $${pointLatex([h, k])}$.

{{figure 0}}

**Check.** Each center coordinate is minus half the coefficient of its variable in the general form: $${half(h)}$ and $${half(k)}$.`,
              `${work["zh-CN"]}标准方程减去的是圆心坐标，所以圆心是 $${pointLatex([h, k])}$。

{{figure 0}}

**检验。** 圆心的每个坐标都是一般方程中对应变量系数一半的相反数：$${half(h)}$，$${half(k)}$。`,
            ),
          }),
          solutionFigures: [
            circleFigure(
              h,
              k,
              r2,
              `The circle has center (${h}, ${k}) and radius ${rootPlain(r2)}.`,
              `圆心 (${h}, ${k})，半径 ${rootPlain(r2)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-by-completing-the-square",
      title: t("The radius from the general form", "由一般方程求半径"),
      explanation: t(
        `After completing the square, the right side is $r^{2}$. It collects the constant you moved **and** both squares you added, since each was added to both sides:

$$x^{2} + y^{2} + 8x - 2y + 9 = 0$$

$$(x + 4)^{2} + (y - 1)^{2} = -9 + 16 + 1 = 8,$$

so $r = \\sqrt{8} = 2\\sqrt{2}$.

> **Watch out.** Moving $+9$ to the right makes it $-9$; and the added $16$ and $1$ belong on the right too. Forgetting either one gives the wrong $r^{2}$. Finally, $8$ is $r^{2}$: take its square root.`,
        `配方之后右边就是 $r^{2}$。它包括移过去的常数，**以及**加上的两个平方数，因为它们都加在了两边：

$$x^{2} + y^{2} + 8x - 2y + 9 = 0$$

$$(x + 4)^{2} + (y - 1)^{2} = -9 + 16 + 1 = 8,$$

所以 $r = \\sqrt{8} = 2\\sqrt{2}$。

> **注意。** 把 $+9$ 移到右边变成 $-9$；加上的 $16$ 和 $1$ 也要加到右边。漏掉哪一个，$r^{2}$ 都会错。最后，$8$ 是 $r^{2}$：还要开平方。`,
      ),
      keyPrerequisites: ["completing-the-square"],
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const r2 = rng.int(1, 80);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F);
        const wrong = [String(r2)];
        for (const v of [-F, r2 - h * h, r2 - k * k]) if (v > 0) wrong.push(rootTex(v));
        const work = completionSteps(h, k, F);
        return {
          ...radicalProblem({
            prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
            answer: rootAnswer(r2),
            wrong,
            solution: t(
              `${work.en}${stepLabel(4, "Take the square root", "开平方").en} The right side is $r^{2}$:${steps(`r = ${rootSteps(r2)}`)}{{figure 0}}

**Check.** For $x^{2} + y^{2} + Dx + Ey + F = 0$, completing the square always gives $r^{2} = \\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$. Here${steps(`r^{2} = ${shortcutR2(h, k, F)}`)}the same $r^{2}$.`,
              `${work["zh-CN"]}${stepLabel(4, "Take the square root", "开平方")["zh-CN"]}右边是 $r^{2}$：${steps(`r = ${rootSteps(r2)}`)}{{figure 0}}

**检验。** 对 $x^{2} + y^{2} + Dx + Ey + F = 0$ 配方，总是得到 $r^{2} = \\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$。这里${steps(`r^{2} = ${shortcutR2(h, k, F)}`)}与上面的 $r^{2}$ 相同。`,
            ),
          }),
          solutionFigures: [
            circleFigure(
              h,
              k,
              r2,
              `The circle has center (${h}, ${k}) and radius ${rootPlain(r2)}.`,
              `圆心 (${h}, ${k})，半径 ${rootPlain(r2)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "equal-leading-coefficients",
      title: t("Equal leading coefficients", "二次项系数相同"),
      explanation: t(
        `Completing the square needs $x^{2}$ and $y^{2}$ with coefficient $1$. When they share another coefficient, divide the **whole** equation by it first, then complete the square:

$$2x^{2} + 2y^{2} - 4x + 12y - 12 = 0 \\;\\Rightarrow\\; x^{2} + y^{2} - 2x + 6y - 6 = 0$$

$$(x - 1)^{2} + (y + 3)^{2} = 6 + 1 + 9 = 16,$$

so the center is $(1, -3)$ and the radius is $4$.

> **Watch out.** Divide every term, the constant too, before halving the coefficients: halving $-4$ and $12$ from the original gives the center $(2, -6)$, twice too far. And the radius comes from the divided equation; $\\sqrt{2 \\cdot 16}$ is not it.`,
        `配方要求 $x^{2}$ 和 $y^{2}$ 的系数是 $1$。当它们有另一个相同的系数时，先把**整个**方程除以这个系数，再配方：

$$2x^{2} + 2y^{2} - 4x + 12y - 12 = 0 \\;\\Rightarrow\\; x^{2} + y^{2} - 2x + 6y - 6 = 0$$

$$(x - 1)^{2} + (y + 3)^{2} = 6 + 1 + 9 = 16,$$

所以圆心是 $(1, -3)$，半径是 $4$。

> **注意。** 先把每一项（包括常数项）都除以系数，再把一次项系数减半：直接用原方程的 $-4$ 和 $12$ 减半，得到圆心 $(2, -6)$，远了一倍。半径要从除过的方程求；$\\sqrt{2 \\cdot 16}$ 不是半径。`,
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const [h, k] = pickCenter(rng, 6);
        const r2 = rng.int(1, 50);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F, a);
        const s1 = stepLabel(1, "Divide by the common coefficient", "除以公共系数");
        const work = completionSteps(h, k, F, 2);
        const intro = t(
          `${s1.en} Completing the square needs coefficient $1$ on $x^{2}$ and $y^{2}$, so divide every term by $${a}$:${steps(generalEq(-2 * h, -2 * k, F))}${work.en}`,
          `${s1["zh-CN"]}配方要求 $x^{2}$ 和 $y^{2}$ 的系数是 $1$，所以每一项都除以 $${a}$：${steps(generalEq(-2 * h, -2 * k, F))}${work["zh-CN"]}`,
        );
        const fig = circleFigure(
          h,
          k,
          r2,
          `The circle with center (${h}, ${k}) and radius ${rootPlain(r2)}.`,
          `圆心 (${h}, ${k})、半径 ${rootPlain(r2)} 的圆。`,
        );
        const halfA = (c: number) => `-\\frac{${-2 * a * c}}{2 \\cdot ${a}} = ${c}`;
        if (rng.bool())
          return {
            ...pointProblem({
              prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
              answer: [h, k],
              wrong: [
                [-h, -k],
                [a * h, a * k],
                [-2 * h, -2 * k],
              ],
              solution: t(
                `${intro.en}So the center is $${pointLatex([h, k])}$.

{{figure 0}}

**Check.** In the original equation each center coordinate is minus the linear coefficient divided by twice the leading coefficient: $${halfA(h)}$ and $${halfA(k)}$.`,
                `${intro["zh-CN"]}所以圆心是 $${pointLatex([h, k])}$。

{{figure 0}}

**检验。** 在原方程中，圆心的每个坐标等于一次项系数除以二次项系数的两倍再取相反数：$${halfA(h)}$，$${halfA(k)}$。`,
              ),
            }),
            solutionFigures: [fig],
          };
        const [c, m] = simplifyRadical(r2);
        return {
          ...radicalProblem({
            prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
            answer: [c, m],
            wrong: [rootTex(a * r2), radical(a * c, m), String(r2)],
            solution: t(
              `${intro.en}${stepLabel(5, "Take the square root", "开平方").en}${steps(`r = ${rootSteps(r2)}`)}{{figure 0}}

**Check.** The divided equation has $D = ${-2 * h}$, $E = ${-2 * k}$ and $F = ${F}$, and $r^{2} = \\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$:${steps(`r^{2} = ${shortcutR2(h, k, F)}`)}`,
              `${intro["zh-CN"]}${stepLabel(5, "Take the square root", "开平方")["zh-CN"]}${steps(`r = ${rootSteps(r2)}`)}{{figure 0}}

**检验。** 除过的方程中 $D = ${-2 * h}$，$E = ${-2 * k}$，$F = ${F}$，而 $r^{2} = \\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$：${steps(`r^{2} = ${shortcutR2(h, k, F)}`)}`,
            ),
          }),
          solutionFigures: [fig],
        };
      },
    },
    {
      id: "circle-point-or-nothing",
      figure: gradeDrawings5["determining-circle-properties-by-completing-the-square#circle-point-or-nothing"],
      title: t("A circle, a point or nothing", "圆、一个点还是没有点"),
      explanation: t(
        `Not every equation $x^{2} + y^{2} + Dx + Ey + F = 0$ is a circle. Complete the square to get $(x - h)^{2} + (y - k)^{2} = c$. The left side is the squared distance from $(x, y)$ to $(h, k)$, so:

- $c > 0$: a circle with radius $\\sqrt{c}$;
- $c = 0$: only the single point $(h, k)$, since a sum of squares is $0$ only when both are $0$;
- $c < 0$: no points at all, since a sum of squares is never negative.

For example $x^{2} + y^{2} - 2x + 4y + 9 = 0$ becomes $(x - 1)^{2} + (y + 2)^{2} = -4$: no point satisfies it.

> **Watch out.** Decide by the right side **after** completing the square, not by the sign of $F$: $x^{2} + y^{2} - 2x + 4y + 9 = 0$ has a positive constant on the left, yet the right side ends up $-4$. A right side of $0$ is not a circle of radius $0$ to be counted as a circle; it is one point.`,
        `并不是每个方程 $x^{2} + y^{2} + Dx + Ey + F = 0$ 都表示圆。配方得到 $(x - h)^{2} + (y - k)^{2} = c$。左边是 $(x, y)$ 到 $(h, k)$ 距离的平方，所以：

- $c > 0$：半径为 $\\sqrt{c}$ 的圆；
- $c = 0$：只有一个点 $(h, k)$，因为平方和为 $0$ 当且仅当两个平方都为 $0$；
- $c < 0$：没有任何点，因为平方和不可能为负。

例如 $x^{2} + y^{2} - 2x + 4y + 9 = 0$ 化为 $(x - 1)^{2} + (y + 2)^{2} = -4$：没有点满足它。

> **注意。** 要看配方**之后**右边的符号，而不是 $F$ 的符号：$x^{2} + y^{2} - 2x + 4y + 9 = 0$ 左边的常数是正的，配方后右边却是 $-4$。右边为 $0$ 时不能当作半径为 $0$ 的圆算成圆，它只是一个点。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const [h, k] = pickCenter(rng, 7);
        const r2 = kind === 0 ? rng.int(1, 50) : kind === 1 ? 0 : -rng.int(1, 30);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F);
        const options = [t("A circle", "一个圆"), t("A single point", "一个点"), t("No points", "没有点")];
        const verdict = [
          t(
            `${stepLabel(4, "Read the right side", "看右边").en} The right side is positive, so the graph is a circle with center $${pointLatex([h, k])}$ and radius $${rootTex(Math.max(r2, 1))}$.`,
            `${stepLabel(4, "Read the right side", "看右边")["zh-CN"]}右边是正数，所以图形是圆心为 $${pointLatex([h, k])}$、半径为 $${rootTex(Math.max(r2, 1))}$ 的圆。`,
          ),
          t(
            `${stepLabel(4, "Read the right side", "看右边").en} The right side is $0$. A sum of two squares is $0$ only when both squares are $0$, so only the point $${pointLatex([h, k])}$ satisfies the equation.`,
            `${stepLabel(4, "Read the right side", "看右边")["zh-CN"]}右边是 $0$。两个平方之和为 $0$ 当且仅当两个平方都为 $0$，所以只有点 $${pointLatex([h, k])}$ 满足方程。`,
          ),
          t(
            `${stepLabel(4, "Read the right side", "看右边").en} The right side is negative, but a sum of squares is never negative, so no point satisfies the equation.`,
            `${stepLabel(4, "Read the right side", "看右边")["zh-CN"]}右边是负数，而平方和不可能为负，所以没有点满足方程。`,
          ),
        ][kind]!;
        const work = completionSteps(h, k, F);
        const check = t(
          `**Check.** Completing the square always gives the right side $\\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$:${steps(shortcutR2(h, k, F))}which is ${kind === 0 ? "positive" : kind === 1 ? "zero" : "negative"}, as found.`,
          `**检验。** 配方后右边总是 $\\left(\\frac{D}{2}\\right)^{2} + \\left(\\frac{E}{2}\\right)^{2} - F$：${steps(shortcutR2(h, k, F))}它是${kind === 0 ? "正数" : kind === 1 ? "零" : "负数"}，与上面一致。`,
        );
        const figures: Figure[] =
          kind === 0
            ? [
                circleFigure(
                  h,
                  k,
                  r2,
                  `The graph is the circle with center (${h}, ${k}) and radius ${rootPlain(r2)}.`,
                  `图形是圆心 (${h}, ${k})、半径 ${rootPlain(r2)} 的圆。`,
                ),
              ]
            : kind === 1
              ? [
                  graphFigure(
                    viewAround(h, k, 1),
                    [{ kind: "point", at: [h, k], label: plainPt([h, k]), dir: "ne", tone: "result" }],
                    `The graph is the single point (${h}, ${k}).`,
                    `图形只是一个点 (${h}, ${k})。`,
                  ),
                ]
              : [];
        const fig = kind === 2 ? "" : "\n\n{{figure 0}}";
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(`What is the graph of $${eq}$?`, `$${eq}$ 的图形是什么？`),
              options,
              correct: kind,
              solution: t(`${work.en}${verdict.en}${fig}\n\n${check.en}`, `${work["zh-CN"]}${verdict["zh-CN"]}${fig}\n\n${check["zh-CN"]}`),
            }),
            [
              [
                options[0]!.en,
                `A circle needs a positive right side after completing the square, and here it is $${r2}$.`,
                `配方后右边为正才是圆，而这里它是 $${r2}$。`,
              ],
              [
                options[1]!.en,
                `A single point needs a right side of $0$ after completing the square, and here it is $${r2}$.`,
                `配方后右边为 $0$ 才是一个点，而这里它是 $${r2}$。`,
              ],
              [
                options[2]!.en,
                `No points needs a negative right side after completing the square, and here it is $${r2}$.`,
                `配方后右边为负才没有点，而这里它是 $${r2}$。`,
              ],
            ],
          ),
          ...(figures.length > 0 && { solutionFigures: figures }),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Intercepts and intersections
// ---------------------------------------------------------------------------

/** interceptProblem asks where (x − h)² + (y − k)² = r2 meets the axis of the variable v. */
function interceptProblem(rng: Rng, v: "x" | "y"): Problem {
  const [h, k] = [rng.int(-8, 8), rng.int(-6, 6)];
  // c is the coordinate along the axis, o the other one, which is 0 on the axis.
  const [c, o] = v === "x" ? [h, k] : [k, h];
  const roll = rng.next();
  let s: number;
  if (roll < 0.12 && o !== 0) s = 0;
  else if (roll < 0.24 && Math.abs(o) >= 2) s = -rng.int(1, o * o - 1);
  else s = rng.bool(0.5) ? rng.int(1, 7) ** 2 : rng.int(2, 40);
  const r2 = s + o * o;
  const eq = circleEq(h, k, r2);
  const w = v === "x" ? "y" : "x";
  const values = pm(c, s);
  const sq = sqTerm(v, c);
  const sub = `${sq} + ${paren(-o)}^{2} = ${r2}`;
  const lines = [sub, `${sq} = ${r2} - ${o * o} = ${s}`];
  const s2 = stepLabel(2, "Solve for the coordinate", `解出 ${v}`);
  const tail =
    s < 0
      ? t(
          `${s2.en} A square cannot be negative, so no $${v}$ works: the circle does not meet the $${v}$-axis.`,
          `${s2["zh-CN"]}平方不可能为负，所以没有 $${v}$ 满足：圆与 $${v}$ 轴没有交点。`,
        )
      : s === 0
        ? t(
            `${s2.en} A square is $0$ only when its base is $0$, so $${v} = ${c}$: the circle touches the axis at one point.`,
            `${s2["zh-CN"]}平方为 $0$ 当且仅当底数为 $0$，所以 $${v} = ${c}$：圆与坐标轴只有一个公共点。`,
          )
        : t(
            c === 0
              ? `${s2.en} Take both square roots:${steps(`${v} = ${pmTex(c, s)}`)}`
              : `${s2.en} Take both square roots, then add $${c}$:${steps(`${v} - ${paren(c)} = \\pm ${rootTex(s)}`, `${v} = ${pmTex(c, s)}`)}`,
            c === 0
              ? `${s2["zh-CN"]}取正负两个平方根：${steps(`${v} = ${pmTex(c, s)}`)}`
              : `${s2["zh-CN"]}取正负两个平方根，再加上 $${c}$：${steps(`${v} - ${paren(c)} = \\pm ${rootTex(s)}`, `${v} = ${pmTex(c, s)}`)}`,
          );
  const d = Math.abs(o);
  const check =
    s > 0
      ? t(
          `**Check.** Both values make $${v} - ${paren(c)} = \\pm ${rootTex(s)}$, and with $${w} = 0$ the left side becomes $(\\pm ${rootTex(s)})^{2} + ${paren(-o)}^{2} = ${s} + ${o * o} = ${r2}$, the right side.`,
          `**检验。** 两个值都使 $${v} - ${paren(c)} = \\pm ${rootTex(s)}$，又 $${w} = 0$，左边是 $(\\pm ${rootTex(s)})^{2} + ${paren(-o)}^{2} = ${s} + ${o * o} = ${r2}$，正是右边。`,
        )
      : s === 0
        ? t(
            `**Check.** The center is $${d}$ from the $${v}$-axis, and the radius is $\\sqrt{${r2}} = ${d}$: exactly the distance, so the axis just touches the circle.`,
            `**检验。** 圆心到 $${v}$ 轴的距离是 $${d}$，半径是 $\\sqrt{${r2}} = ${d}$：恰好相等，所以坐标轴与圆相切。`,
          )
        : t(
            `**Check.** The center is $${d}$ from the $${v}$-axis, but the radius is only $\\sqrt{${r2}} \\approx ${decimal2(Math.sqrt(r2))}$: $${r2} < ${d}^{2} = ${d * d}$, so the circle stays clear of the axis.`,
            `**检验。** 圆心到 $${v}$ 轴的距离是 $${d}$，而半径只有 $\\sqrt{${r2}} \\approx ${decimal2(Math.sqrt(r2))}$：$${r2} < ${d}^{2} = ${d * d}$，所以圆碰不到这条坐标轴。`,
          );
  const along = (u: number): Point => (v === "x" ? [u, 0] : [0, u]);
  const hits = s < 0 ? [] : s === 0 ? [c] : [c + Math.sqrt(s), c - Math.sqrt(s)];
  const C: Point = [h, k];
  const figure = graphFigure(
    viewAround(h, k, Math.sqrt(r2)),
    [
      circleMark(C, Math.sqrt(r2)),
      ...(o === 0 ? [] : [{ kind: "segment" as const, a: C, b: along(c), dashed: true }]),
      { kind: "point", at: C, label: plainPt(C), dir: o > 0 ? "n" : "s" },
      ...hits.map((u): PlaneMark => ({ kind: "point", at: along(u), tone: "result" })),
    ],
    s < 0
      ? `The circle with center (${h}, ${k}) and radius ${rootPlain(r2)} does not reach the ${v}-axis.`
      : `The circle with center (${h}, ${k}) and radius ${rootPlain(r2)} meets the ${v}-axis at ${hits.length === 1 ? `${v} = ${c}` : `${v} = ${c} ± ${rootPlain(s)}`}.`,
    s < 0
      ? `圆心 (${h}, ${k})、半径 ${rootPlain(r2)} 的圆碰不到 ${v} 轴。`
      : `圆心 (${h}, ${k})、半径 ${rootPlain(r2)} 的圆与 ${v} 轴交于 ${hits.length === 1 ? `${v} = ${c}` : `${v} = ${c} ± ${rootPlain(s)}`}。`,
  );
  const s1 = stepLabel(1, `Set ${w} = 0`, `令 ${w} = 0`);
  const axis = v === "x" ? t("$x$-intercepts", "$x$ 轴截距") : t("$y$-intercepts", "$y$ 轴截距");
  return {
    ...solutionsProblem({
      prompt: t(
        `Find the ${axis.en} of the circle $${eq}$. Enter the values of $${v}$, or "no solution" if there are none.`,
        `求圆 $${eq}$ 的${axis["zh-CN"]}。输入 $${v}$ 的值；若没有，输入“无解”。`,
      ),
      values,
      variable: v,
      wrong: [pm(c, r2 + o * o), pm(-c, s), pm(c, r2), [String(c)]],
      solution: t(
        `${s1.en} Every point of the $${v}$-axis has $${w} = 0$. Substitute it and move the constant square to the right:${steps(...lines)}${tail.en}

{{figure 0}}

${check.en}`,
        `${s1["zh-CN"]}$${v}$ 轴上的每个点都满足 $${w} = 0$。代入，并把常数平方移到右边：${steps(...lines)}${tail["zh-CN"]}

{{figure 0}}

${check["zh-CN"]}`,
      ),
    }),
    solutionFigures: [figure],
  };
}

/** calculatingCircleIntercepts finds where a circle crosses the axes. */
export const calculatingCircleIntercepts: TopicDef = {
  id: "calculating-circle-intercepts",
  title: t("Calculating Circle Intercepts", "求圆的截距"),
  summary: t(
    "Find where a circle crosses the $x$-axis and the $y$-axis from its standard or general form.",
    "由圆的标准方程或一般方程求它与 $x$ 轴、$y$ 轴的交点。",
  ),
  prerequisites: ["determining-circle-properties-by-completing-the-square", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "solving-equations-with-square-roots", weight: 0.4 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.1"],
  intro: t(
    `Where does a circle cross the axes? A point is on the $x$-axis exactly when its $y$-coordinate is $0$, and it is on the circle when it satisfies the circle's equation. So the crossings satisfy both: put $y = 0$ into the equation and solve for $x$.

Take $(x - 1)^{2} + (y - 2)^{2} = 13$, the circle with center $(1, 2)$ and radius $\\sqrt{13}$. With $y = 0$:

$$(x - 1)^{2} + 4 = 13 \\;\\Rightarrow\\; (x - 1)^{2} = 9 \\;\\Rightarrow\\; x - 1 = \\pm 3,$$

so it crosses the $x$-axis at $x = 4$ and $x = -2$. With $x = 0$ instead, $1 + (y - 2)^{2} = 13$ gives $y = 2 \\pm 2\\sqrt{3}$ on the $y$-axis:

{{figure 0}}

A square has two roots, so a circle usually crosses an axis twice. It touches an axis once when the square comes out $0$, and misses it when the square would have to be negative. In this lesson we find the intercepts from the standard form and from the general form.`,
    `圆与坐标轴交在哪里？点在 $x$ 轴上当且仅当它的纵坐标是 $0$，点在圆上当且仅当它满足圆的方程。所以交点两者都满足：把 $y = 0$ 代入方程，解出 $x$。

看 $(x - 1)^{2} + (y - 2)^{2} = 13$，即圆心 $(1, 2)$、半径 $\\sqrt{13}$ 的圆。令 $y = 0$：

$$(x - 1)^{2} + 4 = 13 \\;\\Rightarrow\\; (x - 1)^{2} = 9 \\;\\Rightarrow\\; x - 1 = \\pm 3,$$

所以它与 $x$ 轴交于 $x = 4$ 和 $x = -2$。改令 $x = 0$，由 $1 + (y - 2)^{2} = 13$ 得它与 $y$ 轴交于 $y = 2 \\pm 2\\sqrt{3}$：

{{figure 0}}

一个正数有两个平方根，所以圆通常与坐标轴交于两点。平方等于 $0$ 时只交于一点（相切），平方要等于负数时则没有交点。这节课我们由标准方程和一般方程求截距。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -4, xMax: 6, yMin: -3, yMax: 7 },
      [
        circleMark([1, 2], Math.sqrt(13)),
        { kind: "point", at: [1, 2], label: "(1, 2)", dir: "ne" },
        { kind: "point", at: [4, 0], label: "4", dir: "se", tone: "result" },
        { kind: "point", at: [-2, 0], label: "−2", dir: "sw", tone: "result" },
        { kind: "point", at: [0, 2 + 2 * Math.sqrt(3)], label: "2 + 2√3", dir: "nw", tone: "result" },
        { kind: "point", at: [0, 2 - 2 * Math.sqrt(3)], label: "2 − 2√3", dir: "sw", tone: "result" },
      ],
      "The circle (x − 1)² + (y − 2)² = 13 crosses the x-axis at −2 and 4 and the y-axis at 2 ± 2√3.",
      "圆 (x − 1)² + (y − 2)² = 13 与 x 轴交于 −2 和 4，与 y 轴交于 2 ± 2√3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "x-intercepts",
      title: t("$x$-intercepts", "$x$ 轴截距"),
      explanation: t(
        `Points on the $x$-axis have $y = 0$. Substitute $y = 0$ into the equation of the circle and solve for $x$ with square roots. For $(x - 2)^{2} + (y + 3)^{2} = 25$:

$$(x - 2)^{2} + 3^{2} = 25 \\;\\Rightarrow\\; (x - 2)^{2} = 16 \\;\\Rightarrow\\; x - 2 = \\pm 4,$$

so the $x$-intercepts are $x = 6$ and $x = -2$. If the squared term equals $0$ the circle touches the axis once; if it equals a negative number, the circle misses the axis.

> **Watch out.** Set $y = 0$, not $x = 0$: the $x$-intercepts lie on the $x$-axis. $(0 + 3)^{2}$ is $+9$, which is subtracted from $25$, not added. And keep both roots, $+4$ and $-4$, then add the $2$ back to each.`,
        `$x$ 轴上的点满足 $y = 0$。把 $y = 0$ 代入圆的方程，用开平方解出 $x$。对 $(x - 2)^{2} + (y + 3)^{2} = 25$：

$$(x - 2)^{2} + 3^{2} = 25 \\;\\Rightarrow\\; (x - 2)^{2} = 16 \\;\\Rightarrow\\; x - 2 = \\pm 4,$$

所以 $x$ 轴截距是 $x = 6$ 和 $x = -2$。若平方项等于 $0$，圆与坐标轴只有一个公共点；若等于负数，圆与坐标轴没有交点。

> **注意。** 令 $y = 0$，不是 $x = 0$：$x$ 轴截距在 $x$ 轴上。$(0 + 3)^{2}$ 是 $+9$，要从 $25$ 中减去，不是加上。正负两个根 $+4$ 和 $-4$ 都要保留，再各自加回 $2$。`,
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      figure: xInterceptsFigure,
      generate: (rng) => interceptProblem(rng, "x"),
    },
    {
      id: "y-intercepts",
      title: t("$y$-intercepts", "$y$ 轴截距"),
      explanation: t(
        `Points on the $y$-axis have $x = 0$. For $(x + 1)^{2} + (y - 4)^{2} = 10$:

$$1^{2} + (y - 4)^{2} = 10 \\;\\Rightarrow\\; (y - 4)^{2} = 9 \\;\\Rightarrow\\; y = 4 \\pm 3,$$

so the $y$-intercepts are $y = 7$ and $y = 1$. When the right side is not a perfect square, leave the answer in simplest radical form: $(y - 4)^{2} = 8$ gives $y = 4 \\pm 2\\sqrt{2}$.

> **Watch out.** With $x = 0$, the bracket $(0 + 1)$ squares to $1$; do not drop it. The center's $y$-coordinate is $4$, so add $4$ to the roots, not $-4$. And $\\pm 3$ gives two intercepts, not just $y = 4 + 3$.`,
        `$y$ 轴上的点满足 $x = 0$。对 $(x + 1)^{2} + (y - 4)^{2} = 10$：

$$1^{2} + (y - 4)^{2} = 10 \\;\\Rightarrow\\; (y - 4)^{2} = 9 \\;\\Rightarrow\\; y = 4 \\pm 3,$$

所以 $y$ 轴截距是 $y = 7$ 和 $y = 1$。若右边不是完全平方数，答案写成最简根式：$(y - 4)^{2} = 8$ 得 $y = 4 \\pm 2\\sqrt{2}$。

> **注意。** 令 $x = 0$ 后，括号 $(0 + 1)$ 平方得 $1$，不能丢掉。圆心的纵坐标是 $4$，所以根要加上 $4$，不是 $-4$。$\\pm 3$ 给出两个截距，不只是 $y = 4 + 3$。`,
      ),
      generate: (rng) => interceptProblem(rng, "y"),
    },
    {
      id: "intercepts-from-the-general-form",
      title: t("Intercepts from the general form", "由一般方程求截距"),
      explanation: t(
        `In the general form there is no need to complete the square. Substitute $0$ for the other variable directly: its square and its linear term both vanish, leaving a quadratic equation in one variable. For $x^{2} + y^{2} - 2x + 6y - 8 = 0$, setting $y = 0$ gives

$$x^{2} - 2x - 8 = 0 \\;\\Rightarrow\\; (x - 4)(x + 2) = 0,$$

so the $x$-intercepts are $x = 4$ and $x = -2$.

> **Watch out.** The roots have the opposite signs of the numbers in the factors: $(x + 2) = 0$ gives $x = -2$. Both factors give an intercept. And set the right variable to $0$: for the $x$-intercepts the $y$ terms go.`,
        `在一般方程中不必配方。直接把另一个变量换成 $0$：它的平方项和一次项都消失，剩下一个一元二次方程。对 $x^{2} + y^{2} - 2x + 6y - 8 = 0$，令 $y = 0$ 得

$$x^{2} - 2x - 8 = 0 \\;\\Rightarrow\\; (x - 4)(x + 2) = 0,$$

所以 $x$ 轴截距是 $x = 4$ 和 $x = -2$。

> **注意。** 根的符号与因式里的数相反：$(x + 2) = 0$ 得 $x = -2$。两个因式都给出截距。还要让正确的变量为 $0$：求 $x$ 轴截距时去掉的是 $y$ 的项。`,
      ),
      keyPrerequisites: ["solving-quadratic-equations-by-factoring"],
      generate(rng) {
        const v = rng.pick(["x", "y"] as const);
        const w = v === "x" ? "y" : "x";
        const x1 = rng.int(-9, 9);
        let x2 = rng.int(-9, 8);
        if (x2 >= x1) x2++;
        const D = -(x1 + x2);
        const F = x1 * x2;
        const E = 2 * rng.nonZero(-6, 6);
        const eq = v === "x" ? generalEq(D, E, F) : generalEq(E, D, F);
        const axis = v === "x" ? t("$x$-intercepts", "$x$ 轴截距") : t("$y$-intercepts", "$y$ 轴截距");
        const factored = `(${linear(1, -x1, v)})(${linear(1, -x2, v)}) = 0`;
        const s1 = stepLabel(1, `Set ${w} = 0`, `令 ${w} = 0`);
        const s2 = stepLabel(2, "Factor", "因式分解");
        const C: Point = v === "x" ? [-D / 2, -E / 2] : [-E / 2, -D / 2];
        const r2 = (D * D + E * E) / 4 - F;
        const along = (u: number): Point => (v === "x" ? [u, 0] : [0, u]);
        const sumTex = `${x1} + ${paren(x2)} = ${x1 + x2}${D === 0 ? "" : ` = -${paren(D)}`}`;
        return {
          ...solutionsProblem({
            prompt: t(
              `Find the ${axis.en} of the circle $${eq}$. Enter the values of $${v}$.`,
              `求圆 $${eq}$ 的${axis["zh-CN"]}。输入 $${v}$ 的值。`,
            ),
            values: [String(x1), String(x2)],
            variable: v,
            wrong: [[String(-x1), String(-x2)], [String(x1)], [String(-x1), String(x2)]],
            solution: t(
              `${s1.en} On the $${v}$-axis $${w} = 0$, so the $${w}^{2}$ term and the $${w}$ term vanish:${steps(`${quad(1, D, F, v)} = 0`)}${s2.en} Find two numbers with product $${F}$ and sum $${D}$: $${-x1}$ and $${-x2}$.${steps(factored)}A product is $0$ when a factor is $0$, so $${v} = ${x1}$ or $${v} = ${x2}$.

{{figure 0}}

**Check.** The roots of $${quad(1, D, F, v)} = 0$ add to minus the middle coefficient and multiply to the constant: $${sumTex}$ and $${x1} \\cdot ${paren(x2)} = ${F}$.`,
              `${s1["zh-CN"]}在 $${v}$ 轴上 $${w} = 0$，所以 $${w}^{2}$ 项和 $${w}$ 的一次项都消失：${steps(`${quad(1, D, F, v)} = 0`)}${s2["zh-CN"]}找积为 $${F}$、和为 $${D}$ 的两个数：$${-x1}$ 和 $${-x2}$。${steps(factored)}积为 $0$ 时某个因式为 $0$，所以 $${v} = ${x1}$ 或 $${v} = ${x2}$。

{{figure 0}}

**检验。** $${quad(1, D, F, v)} = 0$ 的两根之和等于一次项系数的相反数，两根之积等于常数项：$${sumTex}$，$${x1} \\cdot ${paren(x2)} = ${F}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(C[0], C[1], Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "point", at: C },
                {
                  kind: "point",
                  at: along(x1),
                  label: String(x1),
                  dir: v === "x" ? (C[1] > 0 ? "s" : "n") : C[0] > 0 ? "w" : "e",
                  tone: "result",
                },
                {
                  kind: "point",
                  at: along(x2),
                  label: String(x2),
                  dir: v === "x" ? (C[1] > 0 ? "s" : "n") : C[0] > 0 ? "w" : "e",
                  tone: "result",
                },
              ],
              `The circle crosses the ${v}-axis at ${x1} and ${x2}.`,
              `圆与 ${v} 轴交于 ${x1} 和 ${x2}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** lineSubstitution writes the steps of substituting y = mx + c0 into (x − h)² + (y − k)² = r2, down to the factored quadratic with roots x1 < x2. */
function lineSubstitution(h: number, k: number, r2: number, m: number, c0: number, x1: number, x2: number): string {
  const e = c0 - k;
  const inner = e === 0 ? linear(m, 0) : linear(m, e);
  const first =
    k === 0
      ? `${sqTerm("x", h)} + (${linear(m, c0)})^{2} = ${r2}`
      : `${sqTerm("x", h)} + (${linear(m, c0)} ${k > 0 ? "-" : "+"} ${Math.abs(k)})^{2} = ${r2}`;
  const lines = [first];
  if (k !== 0) lines.push(`${sqTerm("x", h)} + ${inner === "x" ? "x^{2}" : `(${inner})^{2}`} = ${r2}`);
  lines.push(`${quad(1 + m * m, 2 * m * e - 2 * h, h * h + e * e - r2)} = 0`);
  lines.push(`${quad(1, -(x1 + x2), x1 * x2)} = 0`);
  lines.push(`(${linear(1, -x1)})(${linear(1, -x2)}) = 0`);
  return steps(...lines);
}

/** lineMark draws the line through p in the direction (u, v). */
const lineMark = (p: Point, u: number, v: number, tone: "action" | "result" = "action"): PlaneMark => ({
  kind: "line",
  a: p,
  b: [p[0] + u, p[1] + v],
  tone,
});

/** intersectionsOfCirclesWithLines finds where a line meets a circle by substitution. */
export const intersectionsOfCirclesWithLines: TopicDef = {
  id: "intersections-of-circles-with-lines",
  title: t("Intersections of Circles with Lines", "圆与直线的交点"),
  summary: t(
    "Find where a horizontal, vertical or slanted line meets a circle by substitution.",
    "用代入法求水平、竖直或倾斜的直线与圆的交点。",
  ),
  prerequisites: ["calculating-circle-intercepts", "solving-systems-of-nonlinear-equations"],
  encompasses: [
    { topic: "calculating-circle-intercepts", weight: 0.6 },
    { topic: "solving-systems-of-nonlinear-equations", weight: 0.5 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.REI.C.7"],
  intro: t(
    `A point where a line meets a circle lies on both, so its coordinates satisfy both equations at once. That makes the crossing points the solutions of a system, and **substitution** solves it: the line says what $y$ is, so put that into the circle.

Take the circle $x^{2} + y^{2} = 10$ and the line $y = x + 2$. Replacing $y$ by $x + 2$:

$$x^{2} + (x + 2)^{2} = 10 \\;\\Rightarrow\\; 2x^{2} + 4x - 6 = 0 \\;\\Rightarrow\\; x^{2} + 2x - 3 = 0 \\;\\Rightarrow\\; (x + 3)(x - 1) = 0.$$

So $x = -3$ or $x = 1$, and the line gives $y = -1$ and $y = 3$: the points $(-3, -1)$ and $(1, 3)$. Both are on the circle, since $9 + 1 = 10$ and $1 + 9 = 10$.

{{figure 0}}

A quadratic has two, one or no real solutions, matching a line that cuts a circle twice, touches it once, or misses it. In this lesson we intersect circles with horizontal and vertical lines, then with slanted lines.`,
    `直线与圆的交点同时在两者上，所以它的坐标同时满足两个方程。于是交点就是一个方程组的解，可以用**代入法**来解：直线告诉我们 $y$ 等于什么，把它代入圆的方程。

看圆 $x^{2} + y^{2} = 10$ 和直线 $y = x + 2$。把 $y$ 换成 $x + 2$：

$$x^{2} + (x + 2)^{2} = 10 \\;\\Rightarrow\\; 2x^{2} + 4x - 6 = 0 \\;\\Rightarrow\\; x^{2} + 2x - 3 = 0 \\;\\Rightarrow\\; (x + 3)(x - 1) = 0.$$

所以 $x = -3$ 或 $x = 1$，由直线得 $y = -1$ 和 $y = 3$：交点是 $(-3, -1)$ 和 $(1, 3)$。它们都在圆上，因为 $9 + 1 = 10$，$1 + 9 = 10$。

{{figure 0}}

一元二次方程有两个、一个或没有实数解，正对应直线与圆交于两点、相切于一点或不相交。这节课我们先求圆与水平线、竖直线的交点，再求圆与倾斜直线的交点。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
      [
        circleMark([0, 0], Math.sqrt(10)),
        lineMark([1, 3], 1, 1),
        { kind: "point", at: [-3, -1], label: "(−3, −1)", dir: "nw", tone: "result" },
        { kind: "point", at: [1, 3], label: "(1, 3)", dir: "se", tone: "result" },
      ],
      "The circle x² + y² = 10 and the line y = x + 2 meet at (−3, −1) and (1, 3).",
      "圆 x² + y² = 10 与直线 y = x + 2 交于 (−3, −1) 和 (1, 3)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "horizontal-and-vertical-lines",
      title: t("Horizontal and vertical lines", "水平线与竖直线"),
      explanation: t(
        `The intercepts are the intersections with the lines $y = 0$ and $x = 0$; any horizontal or vertical line works the same way, since it fixes one coordinate. Where $x = 4$ meets $(x - 1)^{2} + (y + 2)^{2} = 13$:

$$3^{2} + (y + 2)^{2} = 13 \\;\\Rightarrow\\; (y + 2)^{2} = 4 \\;\\Rightarrow\\; y = -2 \\pm 2,$$

so the intersection points are $(4, 0)$ and $(4, -4)$.

> **Watch out.** Substitute the line's value into its own variable: $x = 4$ goes into the $x$ bracket, giving $(4 - 1)^{2} = 9$, which is then subtracted from $13$. Keep both roots, and add the center's coordinate, $-2$, with its sign.`,
        `截距就是圆与直线 $y = 0$、$x = 0$ 的交点；任何水平线或竖直线都可以同样处理，因为它固定了一个坐标。求 $x = 4$ 与 $(x - 1)^{2} + (y + 2)^{2} = 13$ 的交点：

$$3^{2} + (y + 2)^{2} = 13 \\;\\Rightarrow\\; (y + 2)^{2} = 4 \\;\\Rightarrow\\; y = -2 \\pm 2,$$

所以交点是 $(4, 0)$ 和 $(4, -4)$。

> **注意。** 直线给出的值要代入它自己的变量：$x = 4$ 放进 $x$ 的括号，得 $(4 - 1)^{2} = 9$，再从 $13$ 中减去。两个根都要保留，加上圆心坐标 $-2$ 时注意符号。`,
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const d = rng.nonZero(-5, 5);
        const s = rng.bool() ? rng.int(1, 6) ** 2 : rng.int(2, 30);
        const r2 = s + d * d;
        const eq = circleEq(h, k, r2);
        const vertical = rng.bool();
        const [v, fixed, c] = vertical ? (["y", h + d, k] as const) : (["x", k + d, h] as const);
        const u = vertical ? "x" : "y";
        const line = `${u} = ${fixed}`;
        const sq = `(${linear(1, -c, v)})^{2}`;
        const sub = vertical ? `(${fixed} - ${paren(h)})^{2} + ${sq} = ${r2}` : `${sq} + (${fixed} - ${paren(k)})^{2} = ${r2}`;
        const s1 = stepLabel(1, "Substitute the line", "代入直线");
        const s2 = stepLabel(2, "Isolate the square", "把平方项单独留下");
        const s3 = stepLabel(3, "Take square roots", "开平方");
        const roots = c === 0 ? [`${v} = ${pmTex(c, s)}`] : [`${linear(1, -c, v)} = \\pm ${rootTex(s)}`, `${v} = ${pmTex(c, s)}`];
        const rs = Math.sqrt(s);
        const C: Point = [h, k];
        const pt = (w: number): Point => (vertical ? [fixed, w] : [w, fixed]);
        const sqrtS = Number.isInteger(rs) ? String(rs) : rootTex(s);
        return {
          ...solutionsProblem({
            prompt: t(
              `The line $${line}$ meets the circle $${eq}$ at two points. Find their $${v}$-coordinates.`,
              `直线 $${line}$ 与圆 $${eq}$ 交于两点。求这两点的 $${v}$ 坐标。`,
            ),
            values: pm(c, s),
            variable: v,
            wrong: [pm(c, r2 + d * d), pm(-c, s), pm(c, r2)],
            solution: t(
              `${s1.en} Every point of the line has $${line}$; put it into the $${u}$ bracket:${steps(sub)}${s2.en} The fixed bracket is $${paren(d)}^{2} = ${d * d}$; subtract it from both sides:${steps(`${sq} = ${r2} - ${d * d} = ${s}`)}${s3.en} Keep both square roots:${steps(...roots)}{{figure 0}}

**Check.** Each point has $${u}$-bracket $${paren(d)}^{2} = ${d * d}$ and $${v}$-bracket $(\\pm ${sqrtS})^{2} = ${s}$, which add to $${r2}$: both points satisfy the circle's equation, and both lie on $${line}$.`,
              `${s1["zh-CN"]}直线上每个点都满足 $${line}$；把它代入 $${u}$ 的括号：${steps(sub)}${s2["zh-CN"]}这个固定的括号是 $${paren(d)}^{2} = ${d * d}$，两边同时减去它：${steps(`${sq} = ${r2} - ${d * d} = ${s}`)}${s3["zh-CN"]}正负两个平方根都要保留：${steps(...roots)}{{figure 0}}

**检验。** 每个交点的 $${u}$ 括号是 $${paren(d)}^{2} = ${d * d}$，$${v}$ 括号是 $(\\pm ${sqrtS})^{2} = ${s}$，相加得 $${r2}$：两点都满足圆的方程，也都在 $${line}$ 上。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                lineMark(pt(c), vertical ? 0 : 1, vertical ? 1 : 0),
                { kind: "point", at: C, label: plainPt(C), dir: vertical ? (d > 0 ? "w" : "e") : d > 0 ? "s" : "n" },
                { kind: "point", at: pt(c + rs), tone: "result" },
                { kind: "point", at: pt(c - rs), tone: "result" },
              ],
              `The line ${line} crosses the circle at ${v} = ${c} ± ${rootPlain(s)}.`,
              `直线 ${line} 与圆交于 ${v} = ${c} ± ${rootPlain(s)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "slanted-lines-and-circles-about-the-origin",
      title: t("Slanted lines", "倾斜的直线"),
      explanation: t(
        `To intersect $y = mx + b$ with a circle, substitute $mx + b$ for $y$ in the circle's equation: the points on both are exactly those whose $y$ is $mx + b$ and that satisfy the circle. Expanding gives a quadratic equation in $x$; its solutions are the $x$-coordinates of the intersection points. For $y = x + 1$ and $x^{2} + y^{2} = 25$:

$$x^{2} + (x + 1)^{2} = 25 \\;\\Rightarrow\\; 2x^{2} + 2x - 24 = 0 \\;\\Rightarrow\\; x^{2} + x - 12 = 0,$$

$$(x + 4)(x - 3) = 0,$$

so $x = -4$ or $x = 3$, and the line gives the points $(-4, -3)$ and $(3, 4)$.

> **Watch out.** Square the whole binomial: $(x + 1)^{2} = x^{2} + 2x + 1$, not $x^{2} + 1$. The roots of $(x + 4)(x - 3) = 0$ are $-4$ and $3$, with the signs flipped. The question asks for $x$-coordinates; the $y$-values $-3$ and $4$ are a different pair.`,
        `求 $y = mx + b$ 与圆的交点时，把圆的方程中的 $y$ 换成 $mx + b$：同时在两者上的点，正是 $y$ 等于 $mx + b$ 且满足圆的方程的点。展开得到关于 $x$ 的一元二次方程，它的解就是交点的 $x$ 坐标。对 $y = x + 1$ 和 $x^{2} + y^{2} = 25$：

$$x^{2} + (x + 1)^{2} = 25 \\;\\Rightarrow\\; 2x^{2} + 2x - 24 = 0 \\;\\Rightarrow\\; x^{2} + x - 12 = 0,$$

$$(x + 4)(x - 3) = 0,$$

所以 $x = -4$ 或 $x = 3$，由直线得交点 $(-4, -3)$ 和 $(3, 4)$。

> **注意。** 整个二项式都要平方：$(x + 1)^{2} = x^{2} + 2x + 1$，不是 $x^{2} + 1$。$(x + 4)(x - 3) = 0$ 的根是 $-4$ 和 $3$，符号相反。题目要的是 $x$ 坐标；$y$ 值 $-3$ 和 $4$ 是另一组数。`,
      ),
      keyPrerequisites: ["solving-systems-of-nonlinear-equations"],
      figure: slantedLineFigure,
      generate(rng) {
        const { r2, p, q, m, b } = rng.pick(chordLines);
        const line = si(m, b);
        const eq = circleEq(0, 0, r2);
        const s1 = stepLabel(1, "Substitute and expand", "代入并展开");
        const s2 = stepLabel(2, "Solve", "求解");
        const rr = Math.sqrt(r2);
        return {
          ...solutionsProblem({
            prompt: t(
              `Find the $x$-coordinates of the points where the line $${line}$ meets the circle $${eq}$.`,
              `求直线 $${line}$ 与圆 $${eq}$ 的交点的 $x$ 坐标。`,
            ),
            values: [String(p[0]), String(q[0])],
            // A slip gives the y-values, the negated x-values or one root only; on a chord of slope -1 or 1
            // the first two can coincide with the x-values or with each other, so they are compared as sets.
            wrong: [[p[1], q[1]], [-p[0], -q[0]], [q[0]]]
              .filter((w, i, all) => {
                const same = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((v) => b.includes(v));
                return !same(w, [p[0], q[0]]) && !all.slice(0, i).some((earlier) => same(w, earlier));
              })
              .map((w) => w.map(String)),
            solution: t(
              `${s1.en} Replace $y$ by $${linear(m, b)}$, square the binomial, collect terms, and divide by $${1 + m * m}$:${lineSubstitution(0, 0, r2, m, b, p[0], q[0])}${s2.en} A product is $0$ when a factor is $0$, so $x = ${p[0]}$ or $x = ${q[0]}$.

{{figure 0}}

**Check.** The line gives the points $${pointLatex(p)}$ and $${pointLatex(q)}$. Substituted into the circle: $${paren(p[0])}^{2} + ${paren(p[1])}^{2} = ${r2}$ and $${paren(q[0])}^{2} + ${paren(q[1])}^{2} = ${r2}$. Both are on it.`,
              `${s1["zh-CN"]}把 $y$ 换成 $${linear(m, b)}$，展开平方，合并同类项，再除以 $${1 + m * m}$：${lineSubstitution(0, 0, r2, m, b, p[0], q[0])}${s2["zh-CN"]}积为 $0$ 时某个因式为 $0$，所以 $x = ${p[0]}$ 或 $x = ${q[0]}$。

{{figure 0}}

**检验。** 由直线得交点 $${pointLatex(p)}$ 和 $${pointLatex(q)}$。代入圆的方程：$${paren(p[0])}^{2} + ${paren(p[1])}^{2} = ${r2}$，$${paren(q[0])}^{2} + ${paren(q[1])}^{2} = ${r2}$。两点都在圆上。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(0, 0, rr),
              [
                circleMark([0, 0], rr),
                lineMark(p, q[0] - p[0], q[1] - p[1]),
                { kind: "point", at: p, label: plainPt(p), dir: away(p, q), tone: "result" },
                { kind: "point", at: q, label: plainPt(q), dir: away(q, p), tone: "result" },
              ],
              `The line ${line.replace(/\s/g, " ")} meets the circle x² + y² = ${r2} at ${plainPt(p)} and ${plainPt(q)}.`,
              `直线与圆 x² + y² = ${r2} 交于 ${plainPt(p)} 和 ${plainPt(q)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "intersection-points",
      figure: planeCircleDrawings["intersection-points"],
      title: t("Intersection points", "交点"),
      explanation: t(
        `For a circle not centered at the origin, substitute the same way, then find each $y$ from the line. It helps to simplify $y - k$ first. For $y = 2x - 1$ and $(x - 1)^{2} + (y - 1)^{2} = 5$: $y - 1 = 2x - 2$, so

$$(x - 1)^{2} + (2x - 2)^{2} = 5 \\;\\Rightarrow\\; 5x^{2} - 10x + 5 = 5 \\;\\Rightarrow\\; x(x - 2) = 0.$$

With $x = 0$ the line gives $y = -1$, and with $x = 2$ it gives $y = 3$: the points are $(0, -1)$ and $(2, 3)$.

> **Watch out.** Get each $y$ from the line, not by plugging $x$ into the circle, which gives two $y$-values for one $x$. Write the point as $(x, y)$ in that order, and pair each $x$ with its own $y$.`,
        `圆心不在原点时，同样代入，再由直线方程求出每个 $y$。先化简 $y - k$ 会更方便。对 $y = 2x - 1$ 和 $(x - 1)^{2} + (y - 1)^{2} = 5$：$y - 1 = 2x - 2$，所以

$$(x - 1)^{2} + (2x - 2)^{2} = 5 \\;\\Rightarrow\\; 5x^{2} - 10x + 5 = 5 \\;\\Rightarrow\\; x(x - 2) = 0.$$

$x = 0$ 时由直线得 $y = -1$，$x = 2$ 时得 $y = 3$：交点是 $(0, -1)$ 和 $(2, 3)$。

> **注意。** 每个 $y$ 要由直线求，不要把 $x$ 代入圆的方程，那样一个 $x$ 会得到两个 $y$。交点按 $(x, y)$ 的顺序写，每个 $x$ 配它自己的 $y$。`,
      ),
      generate(rng) {
        const { r2, p, q, m, b } = rng.pick(chordLines);
        const [h, k] = pickCenter(rng, 5);
        const P: Point = [p[0] + h, p[1] + k];
        const R: Point = [q[0] + h, q[1] + k];
        const c0 = b + k - m * h;
        const line = si(m, c0);
        const eq = circleEq(h, k, r2);
        const s1 = stepLabel(1, "Substitute and factor", "代入并因式分解");
        const s2 = stepLabel(2, "Find y from the line", "由直线求 y");
        const yAt = `${evalAt(m, R[0], c0)} = ${R[1]}`;
        const C: Point = [h, k];
        const rr = Math.sqrt(r2);
        return {
          ...pointProblem({
            prompt: t(
              `The line $${line}$ meets the circle $${eq}$ at two points. Find the intersection point with the greater $x$-coordinate.`,
              `直线 $${line}$ 与圆 $${eq}$ 交于两点。求 $x$ 坐标较大的那个交点。`,
            ),
            answer: R,
            wrong: [P, [R[1], R[0]], q, [R[0], m * R[0] - c0]],
            solution: t(
              `${s1.en} Replace $y$ by $${linear(m, c0)}$ in the circle, simplify the $y$ bracket, expand and factor:${lineSubstitution(h, k, r2, m, c0, P[0], R[0])}The solutions are $x = ${P[0]}$ and $x = ${R[0]}$; the greater is $x = ${R[0]}$.

${s2.en} The point is on the line, so${steps(`y = ${yAt}`)}The point is $${pointLatex(R)}$.

{{figure 0}}

**Check.** Substitute it into the circle's equation: $${substituted(h, k, R)}$, the right side.`,
              `${s1["zh-CN"]}把圆的方程中的 $y$ 换成 $${linear(m, c0)}$，化简 $y$ 的括号，展开并因式分解：${lineSubstitution(h, k, r2, m, c0, P[0], R[0])}解是 $x = ${P[0]}$ 和 $x = ${R[0]}$；较大的是 $x = ${R[0]}$。

${s2["zh-CN"]}这个点在直线上，所以${steps(`y = ${yAt}`)}交点是 $${pointLatex(R)}$。

{{figure 0}}

**检验。** 代入圆的方程：$${substituted(h, k, R)}$，正是右边。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, rr),
              [
                circleMark(C, rr),
                lineMark(P, R[0] - P[0], R[1] - P[1]),
                { kind: "point", at: C },
                { kind: "point", at: P, label: plainPt(P), dir: away(P, R) },
                { kind: "point", at: R, label: plainPt(R), dir: away(R, P), tone: "result" },
              ],
              `The line meets the circle at ${plainPt(P)} and ${plainPt(R)}.`,
              `直线与圆交于 ${plainPt(P)} 和 ${plainPt(R)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Tangents and diameters
// ---------------------------------------------------------------------------

/** slopeTex writes the slope between two points as a fraction and its value. */
const slopeTex = (a: Point, b: Point) =>
  `\\frac{${b[1]} - ${paren(a[1])}}{${b[0]} - ${paren(a[0])}} = ${num(Q.of(b[1] - a[1], b[0] - a[0]))}`;

/** pickOffset draws a vector with both components nonzero from −lim to lim. */
const pickOffset = (rng: Rng, lim = 6): [number, number] => [rng.nonZero(-lim, lim), rng.nonZero(-lim, lim)];

/** qParen writes a rational number, in brackets when it is negative. */
const qParen = (q: Q) => (q.sign() < 0 ? `\\left(${num(q)}\\right)` : num(q));

/** slopeProduct writes m₁ · m₂ = −1 for two perpendicular slopes. */
const slopeProduct = (a: Q, b: Q) => `${qParen(a)} \\cdot ${qParen(b)} = ${num(a.mul(b))}`;

/** equationsOfTangentLinesToCircles finds tangents from the radius they are perpendicular to. */
export const equationsOfTangentLinesToCircles: TopicDef = {
  id: "equations-of-tangent-lines-to-circles",
  title: t("Equations of Tangent Lines to Circles", "圆的切线方程"),
  summary: t(
    "Use the fact that a tangent is perpendicular to the radius at the point of tangency to find its slope and equation.",
    "利用切线垂直于过切点的半径，求切线的斜率和方程。",
  ),
  prerequisites: ["equations-of-circles", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.6 },
    { topic: "equations-of-circles", weight: 0.4 },
    { topic: "slope-intercept-form", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.5"],
  intro: t(
    `A **tangent line** touches a circle at exactly one point. In geometry we proved that it is **perpendicular to the radius** at that point: if it leaned toward the center, it would cut into the circle and meet it twice. On the coordinate plane, perpendicular lines have slopes whose product is $-1$, so the radius tells us the tangent's slope.

Take the circle $(x - 2)^{2} + (y + 1)^{2} = 10$ and its point $P(5, 0)$. The radius from the center $(2, -1)$ to $P$ has slope $\\frac{0 - (-1)}{5 - 2} = \\frac{1}{3}$, so the tangent at $P$ has slope $-3$. It passes through $P$, so $0 = -3 \\cdot 5 + b$ gives $b = 15$:

$$y = -3x + 15.$$

{{figure 0}}

Indeed $\\frac{1}{3} \\cdot (-3) = -1$. In this lesson we find the slope of a tangent, its equation, and the tangents at the top, bottom and sides of a circle, where the radius is vertical or horizontal.`,
    `**切线**与圆恰好有一个公共点。几何中已经证明：切线**垂直于过切点的半径**；如果它向圆心倾斜，就会切进圆里，与圆交于两点。在坐标平面上，互相垂直的直线斜率之积是 $-1$，所以由半径就能知道切线的斜率。

看圆 $(x - 2)^{2} + (y + 1)^{2} = 10$ 和圆上的点 $P(5, 0)$。从圆心 $(2, -1)$ 到 $P$ 的半径斜率是 $\\frac{0 - (-1)}{5 - 2} = \\frac{1}{3}$，所以过 $P$ 的切线斜率是 $-3$。切线经过 $P$，由 $0 = -3 \\cdot 5 + b$ 得 $b = 15$：

$$y = -3x + 15.$$

{{figure 0}}

确实 $\\frac{1}{3} \\cdot (-3) = -1$。这节课我们求切线的斜率和方程，以及圆的最高点、最低点、最左点和最右点处的切线，那里的半径是竖直或水平的。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -2, xMax: 7, yMin: -5, yMax: 4 },
      [
        circleMark([2, -1], Math.sqrt(10)),
        { kind: "segment", a: [2, -1], b: [5, 0], tone: "action" },
        lineMark([5, 0], -1, 3, "result"),
        { kind: "point", at: [2, -1], label: "(2, −1)", dir: "sw" },
        { kind: "point", at: [5, 0], label: "P(5, 0)", dir: "e", tone: "result" },
      ],
      "The circle with center (2, −1) through P(5, 0); the radius to P has slope 1/3 and the tangent at P, y = −3x + 15, has slope −3.",
      "圆心 (2, −1)、经过 P(5, 0) 的圆；到 P 的半径斜率为 1/3，过 P 的切线 y = −3x + 15 斜率为 −3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "slope-of-a-tangent-line",
      title: t("The slope of a tangent line", "切线的斜率"),
      explanation: t(
        `A **tangent line** touches a circle at exactly one point, the point of tangency. A tangent is **perpendicular to the radius** drawn to the point of tangency. So its slope is the negative reciprocal of the slope of that radius: flip the fraction and change its sign.

The circle $(x - 1)^{2} + (y - 2)^{2} = 25$ has center $(1, 2)$. At $P(4, 6)$ the radius has slope $\\frac{6 - 2}{4 - 1} = \\frac{4}{3}$, so the tangent at $P$ has slope $-\\frac{3}{4}$.

> **Watch out.** $\\frac{4}{3}$ is the slope of the radius, not of the tangent. Both steps are needed: the reciprocal alone, $\\frac{3}{4}$, is not perpendicular, and neither is the opposite alone, $-\\frac{4}{3}$.`,
        `**切线**与圆恰好有一个公共点，即切点。切线**垂直于过切点的半径**，所以切线的斜率是这条半径斜率的负倒数：把分数倒过来，再改变符号。

圆 $(x - 1)^{2} + (y - 2)^{2} = 25$ 的圆心是 $(1, 2)$。在 $P(4, 6)$ 处，半径的斜率是 $\\frac{6 - 2}{4 - 1} = \\frac{4}{3}$，所以过 $P$ 的切线斜率是 $-\\frac{3}{4}$。

> **注意。** $\\frac{4}{3}$ 是半径的斜率，不是切线的斜率。两步都不能少：只取倒数 $\\frac{3}{4}$ 不垂直，只变号 $-\\frac{4}{3}$ 也不垂直。`,
      ),
      keyPrerequisites: ["perpendicular-lines-in-the-coordinate-plane"],
      figure: tangentFigure,
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [dx, dy] = pickOffset(rng);
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const radiusSlope = Q.of(dy, dx);
        const answer = Q.of(-dx, dy);
        const C: Point = [h, k];
        return {
          ...numberProblem({
            prompt: t(
              `The point $P${pointLatex(p)}$ lies on the circle $${circleEq(h, k, r2)}$. Find the slope of the tangent line to the circle at $P$.`,
              `点 $P${pointLatex(p)}$ 在圆 $${circleEq(h, k, r2)}$ 上。求圆在 $P$ 处的切线的斜率。`,
            ),
            answer,
            wrong: [radiusSlope, Q.of(dx, dy), radiusSlope.neg()],
            solution: t(
              `${stepLabel(1, "The slope of the radius", "半径的斜率").en} The center is $${pointLatex(C)}$, so the radius to $P$ has slope${steps(`m_{r} = ${slopeTex(C, p)}`)}${stepLabel(2, "The perpendicular slope", "垂直的斜率").en} The tangent is perpendicular to the radius at $P$, so its slope is the negative reciprocal: flip $${num(radiusSlope)}$ and change the sign, $${num(answer)}$.

{{figure 0}}

**Check.** Perpendicular slopes multiply to $-1$: $${slopeProduct(radiusSlope, answer)}$.`,
              `${stepLabel(1, "The slope of the radius", "半径的斜率")["zh-CN"]}圆心是 $${pointLatex(C)}$，所以到 $P$ 的半径斜率是${steps(`m_{r} = ${slopeTex(C, p)}`)}${stepLabel(2, "The perpendicular slope", "垂直的斜率")["zh-CN"]}切线在 $P$ 处垂直于半径，所以它的斜率是负倒数：把 $${num(radiusSlope)}$ 倒过来并变号，得 $${num(answer)}$。

{{figure 0}}

**检验。** 互相垂直的斜率之积是 $-1$：$${slopeProduct(radiusSlope, answer)}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a: C, b: p, tone: "action" },
                lineMark(p, -dy, dx, "result"),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, p) },
                { kind: "point", at: p, label: "P", dir: away(p, C), tone: "result" },
              ],
              `The radius to P${plainPt(p)} has slope ${plain(radiusSlope)}; the tangent at P is perpendicular to it, with slope ${plain(answer)}.`,
              `到 P${plainPt(p)} 的半径斜率为 ${plain(radiusSlope)}；过 P 的切线与它垂直，斜率为 ${plain(answer)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "equation-of-a-tangent-line",
      title: t("The equation of a tangent line", "切线的方程"),
      explanation: t(
        `Find the tangent's slope from the radius, then use the point of tangency to find $b$ in $y = mx + b$: the tangent passes through that point. For $(x - 1)^{2} + (y - 2)^{2} = 25$ at $P(4, 6)$ the slope is $-\\frac{3}{4}$, and

$$6 = -\\frac{3}{4} \\cdot 4 + b \\;\\Rightarrow\\; b = 9,$$

so the tangent line is $y = -\\frac{3}{4}x + 9$.

> **Watch out.** The tangent passes through $P$, not through the center: substituting $(1, 2)$ gives a parallel line through the middle of the circle. Use the perpendicular slope, not the radius's own slope, and keep the sign of $b$ as solved.`,
        `先由半径求出切线的斜率，再用切点求 $y = mx + b$ 中的 $b$：切线经过切点。对 $(x - 1)^{2} + (y - 2)^{2} = 25$ 在 $P(4, 6)$ 处，斜率是 $-\\frac{3}{4}$，且

$$6 = -\\frac{3}{4} \\cdot 4 + b \\;\\Rightarrow\\; b = 9,$$

所以切线是 $y = -\\frac{3}{4}x + 9$。

> **注意。** 切线经过 $P$，而不经过圆心：代入 $(1, 2)$ 得到的是穿过圆中间的一条平行线。要用垂直的斜率，而不是半径本身的斜率；$b$ 的符号按解出的结果保留。`,
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [dx, dy] = pickOffset(rng);
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const m = Q.of(-dx, dy);
        const b = Q.of(p[1]).sub(m.mul(Q.of(p[0])));
        const answer = si(m, b);
        const radiusSlope = Q.of(dy, dx);
        const C: Point = [h, k];
        const mp = m.mul(Q.of(p[0]));
        return {
          ...equationProblem({
            prompt: t(
              `Write in slope-intercept form the equation of the line tangent to the circle $${circleEq(h, k, r2)}$ at $P${pointLatex(p)}$.`,
              `写出圆 $${circleEq(h, k, r2)}$ 在点 $P${pointLatex(p)}$ 处的切线的斜截式方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [lineThrough(radiusSlope, p), lineThrough(m, [h, k]), lineThrough(m.neg(), p), si(m, b.neg())],
            solution: t(
              `${stepLabel(1, "The slope of the radius", "半径的斜率").en} From the center $${pointLatex(C)}$ to $P$:${steps(`m_{r} = ${slopeTex(C, p)}`)}${stepLabel(2, "The slope of the tangent", "切线的斜率").en} The tangent is perpendicular to the radius, so its slope is the negative reciprocal, $m = ${num(m)}$.

${stepLabel(3, "Find b", "求 b").en} The tangent passes through $P$, so substitute $P$ into $y = mx + b$:${steps(`${p[1]} = ${num(m)} \\cdot ${paren(p[0])} + b`, `${p[1]} = ${num(mp)} + b`, `b = ${num(b)}`)}So the tangent line is $${answer}$.

{{figure 0}}

**Check.** The slopes multiply to $-1$, $${slopeProduct(radiusSlope, m)}$, and $P$ is on the line: $${evalAt(m, p[0], b)} = ${p[1]}$.`,
              `${stepLabel(1, "The slope of the radius", "半径的斜率")["zh-CN"]}从圆心 $${pointLatex(C)}$ 到 $P$：${steps(`m_{r} = ${slopeTex(C, p)}`)}${stepLabel(2, "The slope of the tangent", "切线的斜率")["zh-CN"]}切线垂直于半径，所以它的斜率是负倒数 $m = ${num(m)}$。

${stepLabel(3, "Find b", "求 b")["zh-CN"]}切线经过 $P$，把 $P$ 代入 $y = mx + b$：${steps(`${p[1]} = ${num(m)} \\cdot ${paren(p[0])} + b`, `${p[1]} = ${num(mp)} + b`, `b = ${num(b)}`)}所以切线是 $${answer}$。

{{figure 0}}

**检验。** 两个斜率之积是 $-1$：$${slopeProduct(radiusSlope, m)}$；$P$ 在直线上：$${evalAt(m, p[0], b)} = ${p[1]}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a: C, b: p, tone: "action" },
                lineMark(p, -dy, dx, "result"),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, p) },
                { kind: "point", at: p, label: `P${plainPt(p)}`, dir: away(p, C), tone: "result" },
              ],
              `The tangent at P${plainPt(p)}, perpendicular to the radius from (${h}, ${k}), has slope ${plain(m)} and y-intercept ${plain(b)}.`,
              `过 P${plainPt(p)} 的切线垂直于从 (${h}, ${k}) 出发的半径，斜率为 ${plain(m)}，纵截距为 ${plain(b)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "horizontal-and-vertical-tangents",
      title: t("Horizontal and vertical tangents", "水平切线与竖直切线"),
      explanation: t(
        `At the highest and lowest points of a circle the radius is vertical, so the tangent, perpendicular to it, is **horizontal**; at the leftmost and rightmost points the radius is horizontal, so the tangent is **vertical**. A vertical line has no slope, so write it as $x = c$; a horizontal line is $y = c$.

The circle $(x + 2)^{2} + (y - 1)^{2} = 9$ has center $(-2, 1)$ and radius $3$. At its rightmost point $(1, 1)$ the tangent is the vertical line $x = 1$; at its lowest point $(-2, -2)$ the tangent is $y = -2$.

> **Watch out.** At $(1, 1)$ the tangent is $x = 1$, not $y = 1$: $y = 1$ is the horizontal line through the center, along the radius. The tangent goes through the point of tangency, not the center, and not one more radius beyond it.`,
        `在圆的最高点和最低点，半径是竖直的，所以与之垂直的切线是**水平**的；在最左点和最右点，半径是水平的，所以切线是**竖直**的。竖直线没有斜率，写成 $x = c$；水平线写成 $y = c$。

圆 $(x + 2)^{2} + (y - 1)^{2} = 9$ 的圆心是 $(-2, 1)$，半径是 $3$。在最右点 $(1, 1)$ 的切线是竖直线 $x = 1$；在最低点 $(-2, -2)$ 的切线是 $y = -2$。

> **注意。** 在 $(1, 1)$ 处的切线是 $x = 1$，不是 $y = 1$：$y = 1$ 是过圆心的水平线，沿着半径。切线经过切点，不经过圆心，也不在切点外再隔一个半径的地方。`,
      ),
      figure: axisTangentsFigure,
      generate(rng) {
        const [h, k] = [rng.int(-7, 7), rng.int(-7, 7)];
        const r = rng.int(1, 9);
        const dir = rng.int(0, 3);
        const [dx, dy] = (
          [
            [r, 0],
            [0, r],
            [-r, 0],
            [0, -r],
          ] as const
        )[dir]!;
        const p: Point = [h + dx, k + dy];
        const vertical = dy === 0;
        const answer = vertical ? `x = ${p[0]}` : `y = ${p[1]}`;
        const C: Point = [h, k];
        const where = t(["rightmost", "highest", "leftmost", "lowest"][dir]!, ["最右", "最高", "最左", "最低"][dir]!);
        const radius = vertical
          ? t("horizontal, so the tangent, perpendicular to it, is vertical", "是水平的，所以与它垂直的切线是竖直的")
          : t("vertical, so the tangent, perpendicular to it, is horizontal", "是竖直的，所以与它垂直的切线是水平的");
        const other = vertical ? "y" : "x";
        const own = vertical ? "x" : "y";
        const otherC = vertical ? k : h;
        const sub = vertical
          ? `(${p[0]} - ${paren(h)})^{2} + ${sqTerm("y", k)} = ${r * r}`
          : `${sqTerm("x", h)} + (${p[1]} - ${paren(k)})^{2} = ${r * r}`;
        const rest = vertical ? `${sqTerm("y", k)} = 0` : `${sqTerm("x", h)} = 0`;
        return {
          ...equationProblem({
            prompt: t(
              `The point $P${pointLatex(p)}$ lies on the circle $${circleEq(h, k, r * r)}$. Write the equation of the tangent line at $P$.`,
              `点 $P${pointLatex(p)}$ 在圆 $${circleEq(h, k, r * r)}$ 上。写出过 $P$ 的切线方程。`,
            ),
            answer,
            wrong: vertical ? [`y = ${p[1]}`, `x = ${h}`, `x = ${p[0] + dx}`] : [`x = ${p[0]}`, `y = ${k}`, `y = ${p[1] + dy}`],
            solution: t(
              `${stepLabel(1, "The direction of the radius", "半径的方向").en} The center is $${pointLatex(C)}$ and the radius is $${r}$, which makes $P$ the ${where.en} point of the circle; the radius to $P$ is ${radius.en}.

${stepLabel(2, "The line through P", "过 P 的直线").en} The tangent passes through $P$, so every point of it has the same $${own}$-coordinate as $P$:${steps(answer)}{{figure 0}}

**Check.** Substitute $${answer}$ into the circle:${steps(sub, rest)}so $${other} = ${otherC}$ is the only solution: the line meets the circle at $P$ alone, as a tangent must.`,
              `${stepLabel(1, "The direction of the radius", "半径的方向")["zh-CN"]}圆心是 $${pointLatex(C)}$，半径是 $${r}$，因此 $P$ 是圆的${where["zh-CN"]}点；到 $P$ 的半径${radius["zh-CN"]}。

${stepLabel(2, "The line through P", "过 P 的直线")["zh-CN"]}切线经过 $P$，所以它上面每个点的 $${own}$ 坐标都与 $P$ 相同：${steps(answer)}{{figure 0}}

**检验。** 把 $${answer}$ 代入圆的方程：${steps(sub, rest)}所以只有 $${other} = ${otherC}$ 一个解：这条直线与圆只交于 $P$，正是切线。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, r),
              [
                circleMark(C, r),
                { kind: "segment", a: C, b: p, tone: "action" },
                lineMark(p, vertical ? 0 : 1, vertical ? 1 : 0, "result"),
                { kind: "point", at: C, label: plainPt(C), dir: vertical ? "n" : "e" },
                { kind: "point", at: p, label: `P${plainPt(p)}`, dir: (["se", "ne", "sw", "se"] as const)[dir]!, tone: "result" },
              ],
              `At P${plainPt(p)} the radius is ${vertical ? "horizontal" : "vertical"}, so the tangent ${answer} is ${vertical ? "vertical" : "horizontal"}.`,
              `在 P${plainPt(p)} 处半径是${vertical ? "水平" : "竖直"}的，所以切线 ${answer} 是${vertical ? "竖直" : "水平"}的。`,
            ),
          ],
        };
      },
    },
  ],
};

/** perpendicularBisectorsOfDiametersInTheCoordinatePlane works with a diameter, its perpendicular bisector and the perpendicular diameter. */
export const perpendicularBisectorsOfDiametersInTheCoordinatePlane: TopicDef = {
  id: "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
  title: t("Perpendicular Bisectors of Diameters in the Coordinate Plane", "坐标平面中直径的垂直平分线"),
  summary: t(
    "Find the other end of a diameter, the perpendicular bisector of a diameter, and the endpoints of the perpendicular diameter.",
    "求直径的另一端点、直径的垂直平分线，以及与之垂直的直径的端点。",
  ),
  prerequisites: ["equations-of-circles", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.3 },
    { topic: "equations-of-circles", weight: 0.4 },
    { topic: "midpoints-in-the-coordinate-plane", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5", "CCSS.HSG.GPE.B.4"],
  intro: t(
    `A **diameter** is a chord through the center, so the center is its midpoint: the step from one end to the center repeats from the center to the other end.

Take the circle with center $(1, 1)$ and the diameter from $A(-2, 0)$: the step from $A$ to the center is $3$ right and $1$ up, so the other end is $B(4, 2)$. The diameter has slope $\\frac{1}{3}$.

Its **perpendicular bisector** passes through the midpoint, the center, with the negative reciprocal slope $-3$. That line is itself a diameter's line. Turning the step $(3, 1)$ a quarter turn gives $(-1, 3)$, which has slope $-3$ and the same length, so the perpendicular diameter runs from $(0, 4)$ to $(2, -2)$:

{{figure 0}}

The two diameters cross at the center at right angles. In this lesson we find the other end of a diameter, the equation of its perpendicular bisector, and the ends of the perpendicular diameter.`,
    `**直径**是过圆心的弦，所以圆心是它的中点：从一端到圆心的位移，再从圆心走一次就到另一端。

看圆心为 $(1, 1)$ 的圆和从 $A(-2, 0)$ 出发的直径：从 $A$ 到圆心是向右 $3$、向上 $1$，所以另一端是 $B(4, 2)$。这条直径的斜率是 $\\frac{1}{3}$。

它的**垂直平分线**经过中点（圆心），斜率是负倒数 $-3$。这条线本身也是一条直径所在的直线。把位移 $(3, 1)$ 旋转四分之一圈得到 $(-1, 3)$，斜率为 $-3$，长度不变，所以垂直的直径从 $(0, 4)$ 到 $(2, -2)$：

{{figure 0}}

两条直径在圆心处垂直相交。这节课我们求直径的另一端点、直径的垂直平分线方程，以及与之垂直的直径的端点。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 5, yMin: -3, yMax: 5 },
      [
        circleMark([1, 1], Math.sqrt(10)),
        { kind: "segment", a: [-2, 0], b: [4, 2], tone: "action" },
        { kind: "segment", a: [0, 4], b: [2, -2], tone: "result" },
        { kind: "point", at: [-2, 0], label: "A", dir: "w" },
        { kind: "point", at: [4, 2], label: "B", dir: "e" },
        { kind: "point", at: [1, 1], label: "(1, 1)", dir: "se" },
        { kind: "point", at: [0, 4], label: "(0, 4)", dir: "nw", tone: "result" },
        { kind: "point", at: [2, -2], label: "(2, −2)", dir: "se", tone: "result" },
      ],
      "The diameter from A(−2, 0) to B(4, 2) of the circle with center (1, 1), and the perpendicular diameter from (0, 4) to (2, −2).",
      "圆心 (1, 1) 的圆的直径 A(−2, 0) 到 B(4, 2)，以及与之垂直的直径 (0, 4) 到 (2, −2)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "the-other-endpoint-of-a-diameter",
      figure: planeCircleDrawings["the-other-endpoint-of-a-diameter"],
      title: t("The other endpoint of a diameter", "直径的另一端点"),
      explanation: t(
        `The center $M$ is the midpoint of a diameter $AB$, so the step from $A$ to $M$ repeats from $M$ to $B$. For the circle $(x - 2)^{2} + (y + 1)^{2} = 25$ and $A(5, 3)$: from $A$ to $M(2, -1)$ is $3$ left and $4$ down, so

$$B = (2 - 3, -1 - 4) = (-1, -5).$$

In one formula, $B = (2h - x_A, 2k - y_A)$.

> **Watch out.** Read the center from the equation with the signs flipped: $(y + 1)$ means $k = -1$. $B$ is not the point opposite $A$ through the origin, $(-5, -3)$, unless the center is the origin; and averaging $A$ with the center gives a point halfway along the radius, not the far end.`,
        `圆心 $M$ 是直径 $AB$ 的中点，所以从 $A$ 到 $M$ 的位移再从 $M$ 走一次就到 $B$。对圆 $(x - 2)^{2} + (y + 1)^{2} = 25$ 和 $A(5, 3)$：从 $A$ 到 $M(2, -1)$ 是向左 $3$、向下 $4$，所以

$$B = (2 - 3, -1 - 4) = (-1, -5).$$

写成公式就是 $B = (2h - x_A, 2k - y_A)$。

> **注意。** 从方程读圆心时符号要反过来：$(y + 1)$ 表示 $k = -1$。除非圆心是原点，$B$ 不是 $A$ 关于原点的对称点 $(-5, -3)$；把 $A$ 和圆心取平均，得到的是半径的中点，不是另一端。`,
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 7);
        const dx = rng.int(-7, 7);
        const dy = dx === 0 ? rng.nonZero(-7, 7) : rng.int(-7, 7);
        const a: Point = [h + dx, k + dy];
        const b: Point = [h - dx, k - dy];
        const r2 = dx * dx + dy * dy;
        const M: Point = [h, k];
        return {
          ...pointProblem({
            prompt: t(
              `$AB$ is a diameter of the circle $${circleEq(h, k, r2)}$, with $A${pointLatex(a)}$. Find $B$.`,
              `$AB$ 是圆 $${circleEq(h, k, r2)}$ 的直径，$A${pointLatex(a)}$。求 $B$。`,
            ),
            answer: b,
            wrong: [
              [-a[0], -a[1]],
              [-b[0], -b[1]],
              [-dx, -dy],
              [Q.of(a[0] + h, 2), Q.of(a[1] + k, 2)],
            ],
            solution: t(
              `${stepLabel(1, "The step from A to the center", "从 A 到圆心的位移").en} The center is $M${pointLatex(M)}$, the midpoint of $AB$. From $A$ to $M$ the coordinates change by${steps(`${h} - ${paren(a[0])} = ${-dx}, \\quad ${k} - ${paren(a[1])} = ${-dy}`)}${stepLabel(2, "Repeat the step", "再走一次").en} The same change from $M$ lands on $B$:${steps(`B = (${h} + ${paren(-dx)}, ${k} + ${paren(-dy)}) = ${pointLatex(b)}`)}{{figure 0}}

**Check.** $M$ is the midpoint of $AB$: $\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}$. And $B$ is on the circle: $${substituted(h, k, b)}$.`,
              `${stepLabel(1, "The step from A to the center", "从 A 到圆心的位移")["zh-CN"]}圆心 $M${pointLatex(M)}$ 是 $AB$ 的中点。从 $A$ 到 $M$，坐标的变化是${steps(`${h} - ${paren(a[0])} = ${-dx}, \\quad ${k} - ${paren(a[1])} = ${-dy}`)}${stepLabel(2, "Repeat the step", "再走一次")["zh-CN"]}从 $M$ 再变化同样的量就到 $B$：${steps(`B = (${h} + ${paren(-dx)}, ${k} + ${paren(-dy)}) = ${pointLatex(b)}`)}{{figure 0}}

**检验。** $M$ 是 $AB$ 的中点：$\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}$。$B$ 在圆上：$${substituted(h, k, b)}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(M, Math.sqrt(r2)),
                { kind: "arrow", from: a, to: M, tone: "action" },
                { kind: "arrow", from: M, to: b, tone: "action" },
                { kind: "point", at: a, label: "A", dir: away(a, M) },
                { kind: "point", at: M, label: "M", dir: dx * dy > 0 ? "se" : "ne" },
                { kind: "point", at: b, label: `B${plainPt(b)}`, dir: away(b, M), tone: "result" },
              ],
              `The step from A${plainPt(a)} to the center M(${h}, ${k}), repeated, lands on B${plainPt(b)}.`,
              `从 A${plainPt(a)} 到圆心 M(${h}, ${k}) 的位移再走一次，就到 B${plainPt(b)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "perpendicular-bisector-of-a-diameter",
      figure: planeCircleDrawings["perpendicular-bisector-of-a-diameter"],
      title: t("The perpendicular bisector of a diameter", "直径的垂直平分线"),
      explanation: t(
        `The **perpendicular bisector** of a segment passes through its midpoint and is perpendicular to it. For a diameter, the midpoint is the center, so the perpendicular bisector of a diameter is the line through the center with the negative reciprocal slope; it contains another diameter.

For the diameter from $A(-1, 1)$ to $B(5, 5)$: the center is $(2, 3)$, the slope of $AB$ is $\\frac{4}{6} = \\frac{2}{3}$, so the bisector has slope $-\\frac{3}{2}$, and $3 = -\\frac{3}{2} \\cdot 2 + b$ gives $y = -\\frac{3}{2}x + 6$.

> **Watch out.** The bisector passes through the midpoint, not through $A$ or $B$. Its slope is the negative reciprocal of $\\frac{2}{3}$; the slope $\\frac{2}{3}$ itself gives the diameter's own line, and $\\frac{3}{2}$ or $-\\frac{2}{3}$ alone is not perpendicular.`,
        `线段的**垂直平分线**经过线段的中点并与线段垂直。直径的中点就是圆心，所以直径的垂直平分线是过圆心、斜率为负倒数的直线；它包含另一条直径。

对从 $A(-1, 1)$ 到 $B(5, 5)$ 的直径：圆心是 $(2, 3)$，$AB$ 的斜率是 $\\frac{4}{6} = \\frac{2}{3}$，所以垂直平分线的斜率是 $-\\frac{3}{2}$，由 $3 = -\\frac{3}{2} \\cdot 2 + b$ 得 $y = -\\frac{3}{2}x + 6$。

> **注意。** 垂直平分线经过中点，不经过 $A$ 或 $B$。它的斜率是 $\\frac{2}{3}$ 的负倒数；用 $\\frac{2}{3}$ 本身得到的是直径所在的直线，只取倒数 $\\frac{3}{2}$ 或只变号 $-\\frac{2}{3}$ 都不垂直。`,
      ),
      keyPrerequisites: ["perpendicular-lines-in-the-coordinate-plane"],
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [dx, dy] = pickOffset(rng);
        const a: Point = [h - dx, k - dy];
        const b: Point = [h + dx, k + dy];
        const m = Q.of(-dx, dy);
        const c = Q.of(k).sub(m.mul(Q.of(h)));
        const answer = si(m, c);
        const ab = Q.of(dy, dx);
        const M: Point = [h, k];
        const mh = m.mul(Q.of(h));
        return {
          ...equationProblem({
            prompt: t(
              `The segment from $A${pointLatex(a)}$ to $B${pointLatex(b)}$ is a diameter of a circle. Write in slope-intercept form the equation of the perpendicular bisector of $AB$.`,
              `从 $A${pointLatex(a)}$ 到 $B${pointLatex(b)}$ 的线段是一个圆的直径。写出 $AB$ 的垂直平分线的斜截式方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong: [lineThrough(ab, [h, k]), lineThrough(m, a), lineThrough(m.neg(), [h, k]), lineThrough(Q.one.div(ab), [h, k])],
            solution: t(
              `${stepLabel(1, "The midpoint", "中点").en} The bisector passes through the midpoint of $AB$, the center:${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}`)}${stepLabel(2, "The slopes", "斜率").en} The slope of $AB$ is${steps(slopeTex(a, b))}so the bisector, perpendicular to it, has the negative reciprocal slope $${num(m)}$.

${stepLabel(3, "Find b", "求 b").en} Substitute the midpoint into $y = ${num(m)}x + b$:${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `${k} = ${num(mh)} + b`, `b = ${num(c)}`)}So the perpendicular bisector is $${answer}$.

{{figure 0}}

**Check.** The slopes multiply to $-1$, $${slopeProduct(ab, m)}$, and the midpoint is on the line: $${evalAt(m, h, c)} = ${k}$.`,
              `${stepLabel(1, "The midpoint", "中点")["zh-CN"]}垂直平分线经过 $AB$ 的中点，即圆心：${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}`)}${stepLabel(2, "The slopes", "斜率")["zh-CN"]}$AB$ 的斜率是${steps(slopeTex(a, b))}所以与它垂直的平分线斜率是负倒数 $${num(m)}$。

${stepLabel(3, "Find b", "求 b")["zh-CN"]}把中点代入 $y = ${num(m)}x + b$：${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `${k} = ${num(mh)} + b`, `b = ${num(c)}`)}所以垂直平分线是 $${answer}$。

{{figure 0}}

**检验。** 两个斜率之积是 $-1$：$${slopeProduct(ab, m)}$；中点在直线上：$${evalAt(m, h, c)} = ${k}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.hypot(dx, dy)),
              [
                circleMark(M, Math.hypot(dx, dy)),
                { kind: "segment", a, b },
                lineMark(M, -dy, dx, "result"),
                { kind: "point", at: a, label: "A", dir: away(a, M) },
                { kind: "point", at: b, label: "B", dir: away(b, M) },
                { kind: "point", at: M, label: plainPt(M), dir: away(M, [M[0] + dx - dy, M[1] + dy + dx]) },
              ],
              `The perpendicular bisector of AB passes through the center (${h}, ${k}) with slope ${plain(m)}.`,
              `AB 的垂直平分线经过圆心 (${h}, ${k})，斜率为 ${plain(m)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "endpoints-of-the-perpendicular-diameter",
      figure: planeCircleDrawings["endpoints-of-the-perpendicular-diameter"],
      title: t("The perpendicular diameter", "与之垂直的直径"),
      explanation: t(
        `If $A$ is $a$ units right and $b$ units up from the center, rotating that step by a quarter turn gives $-b$ right and $a$ up: the slopes $\\frac{b}{a}$ and $-\\frac{a}{b}$ are negative reciprocals, and both steps have the same length, so the new ends are on the circle too. So the diameter perpendicular to $AB$ has endpoints

$$(h - b, k + a) \\quad\\text{and}\\quad (h + b, k - a).$$

With center $(1, 2)$ and $A(4, 3)$, the step is $(3, 1)$, so the perpendicular diameter ends at $(0, 5)$ and $(2, -1)$.

> **Watch out.** Swap the two numbers of the step **and** change the sign of exactly one: $(1, 3)$, with no sign change, is not perpendicular, and $(-3, -1)$ only reverses the step, giving the other end of $AB$. Add the turned step to the center, not to $A$.`,
        `若 $A$ 在圆心右方 $a$ 个单位、上方 $b$ 个单位，把这个位移旋转四分之一圈，得到向右 $-b$、向上 $a$：斜率 $\\frac{b}{a}$ 和 $-\\frac{a}{b}$ 互为负倒数，两个位移长度相同，所以新的端点也在圆上。于是与 $AB$ 垂直的直径的端点是

$$(h - b, k + a) \\quad\\text{和}\\quad (h + b, k - a).$$

圆心为 $(1, 2)$、$A(4, 3)$ 时，位移是 $(3, 1)$，所以垂直直径的端点是 $(0, 5)$ 和 $(2, -1)$。

> **注意。** 位移的两个数要交换，**并且**恰好改变其中一个的符号：不变号的 $(1, 3)$ 不垂直，$(-3, -1)$ 只是把位移反过来，得到的是 $AB$ 的另一端。转过的位移要加在圆心上，不是加在 $A$ 上。`,
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const dx = rng.int(-6, 6);
        const dy = rng.nonZero(-6, 6);
        const a: Point = [h + dx, k + dy];
        const p1: Point = [h - dy, k + dx];
        const p2: Point = [h + dy, k - dx];
        const [answer, other] = p1[0] > p2[0] ? [p1, p2] : [p2, p1];
        const r2 = dx * dx + dy * dy;
        const C: Point = [h, k];
        const perp =
          dx === 0
            ? t(
                `$AB$ is vertical, since the step to $A$ has no horizontal part, and the turned step $(${-dy}, 0)$ is horizontal, so the diameters are perpendicular`,
                `$AB$ 是竖直的，因为到 $A$ 的位移没有水平分量；转过的位移 $(${-dy}, 0)$ 是水平的，所以两条直径互相垂直`,
              )
            : t(
                `The slopes of the two steps multiply to $-1$: $${slopeProduct(Q.of(dy, dx), Q.of(dx, -dy))}$`,
                `两个位移的斜率之积是 $-1$：$${slopeProduct(Q.of(dy, dx), Q.of(dx, -dy))}$`,
              );
        return {
          ...pointProblem({
            prompt: t(
              `$AB$ is a diameter of the circle $${circleEq(h, k, r2)}$, with $A${pointLatex(a)}$. $PQ$ is the diameter perpendicular to $AB$. Find the endpoint of $PQ$ with the greater $x$-coordinate.`,
              `$AB$ 是圆 $${circleEq(h, k, r2)}$ 的直径，$A${pointLatex(a)}$。$PQ$ 是与 $AB$ 垂直的直径。求 $PQ$ 中 $x$ 坐标较大的端点。`,
            ),
            answer,
            wrong: [other, [h + dy, k + dx], [h - dx, k - dy], [answer[1], answer[0]]],
            solution: t(
              `${stepLabel(1, "The step to A", "到 A 的位移").en} The center is $${pointLatex(C)}$, and the step from it to $A$ is $(${a[0]} - ${paren(h)}, ${a[1]} - ${paren(k)}) = (${dx}, ${dy})$.

${stepLabel(2, "Turn the step", "旋转位移").en} A quarter turn swaps the two numbers and changes the sign of one: $(${-dy}, ${dx})$, and its opposite $(${dy}, ${-dx})$.

${stepLabel(3, "Add to the center", "加到圆心上").en} The endpoints of $PQ$ are${steps(`(${h} + ${paren(-dy)}, ${k} + ${paren(dx)}) = ${pointLatex(p1)}`, `(${h} + ${paren(dy)}, ${k} + ${paren(-dx)}) = ${pointLatex(p2)}`)}The one with the greater $x$-coordinate is $${pointLatex(answer)}$.

{{figure 0}}

**Check.** ${perp.en}. And the turned step has squared length $${paren(-dy)}^{2} + ${paren(dx)}^{2} = ${r2}$, the squared radius, so $${pointLatex(answer)}$ is on the circle.`,
              `${stepLabel(1, "The step to A", "到 A 的位移")["zh-CN"]}圆心是 $${pointLatex(C)}$，从圆心到 $A$ 的位移是 $(${a[0]} - ${paren(h)}, ${a[1]} - ${paren(k)}) = (${dx}, ${dy})$。

${stepLabel(2, "Turn the step", "旋转位移")["zh-CN"]}旋转四分之一圈就是交换两个数并改变其中一个的符号：$(${-dy}, ${dx})$，以及它的反向 $(${dy}, ${-dx})$。

${stepLabel(3, "Add to the center", "加到圆心上")["zh-CN"]}$PQ$ 的端点是${steps(`(${h} + ${paren(-dy)}, ${k} + ${paren(dx)}) = ${pointLatex(p1)}`, `(${h} + ${paren(dy)}, ${k} + ${paren(-dx)}) = ${pointLatex(p2)}`)}其中 $x$ 坐标较大的是 $${pointLatex(answer)}$。

{{figure 0}}

**检验。** ${perp["zh-CN"]}。转过的位移长度的平方是 $${paren(-dy)}^{2} + ${paren(dx)}^{2} = ${r2}$，等于半径的平方，所以 $${pointLatex(answer)}$ 在圆上。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a, b: [h - dx, k - dy] },
                { kind: "segment", a: p1, b: p2, tone: "action" },
                { kind: "point", at: a, label: "A", dir: away(a, C) },
                { kind: "point", at: C },
                { kind: "point", at: other, dir: away(other, C) },
                { kind: "point", at: answer, label: plainPt(answer), dir: away(answer, C), tone: "result" },
              ],
              `The diameter PQ, perpendicular to AB, ends at ${plainPt(p1)} and ${plainPt(p2)}.`,
              `与 AB 垂直的直径 PQ 端点为 ${plainPt(p1)} 和 ${plainPt(p2)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Chords
// ---------------------------------------------------------------------------

/** chordFigure draws circle O with chord AB at distance d from O (radius r), the perpendicular OM and the radius OA, with the lengths of OA, OM and AM written on them when given. */
function chordFigure(r: number, d: number, lengths?: readonly [string, string, string]): Figure {
  const R = 5;
  const n = 96;
  const circle: Mark = {
    kind: "polygon",
    points: Array.from({ length: n }, (_, i): Point => [R * Math.cos((2 * Math.PI * i) / n), R * Math.sin((2 * Math.PI * i) / n)]),
  };
  const dd = (R * d) / r;
  const half = Math.sqrt(R * R - dd * dd);
  const O: Point = [0, 0];
  const M: Point = [0, -dd];
  const A: Point = [-half, -dd];
  const B: Point = [half, -dd];
  const marks: Mark[] = [
    circle,
    { kind: "segment", a: A, b: B, accent: true },
    { kind: "segment", a: O, b: M, dashed: true },
    { kind: "segment", a: O, b: A },
    { kind: "right", vertex: M, from: O, to: B },
    { kind: "dot", at: O },
    { kind: "label", at: O, text: "O", dir: "n", italic: true },
    { kind: "label", at: A, text: "A", dir: "sw", italic: true },
    { kind: "label", at: B, text: "B", dir: "se", italic: true },
    { kind: "label", at: M, text: "M", dir: "s", italic: true },
  ];
  if (lengths) {
    marks.push(
      { kind: "label", at: [-half * 0.55, -dd * 0.45], text: lengths[0], dir: "nw" },
      { kind: "label", at: [0, -dd * 0.5], text: lengths[1], dir: "e" },
      { kind: "label", at: [-half * 0.5, -dd], text: lengths[2], dir: "n" },
    );
  }
  return {
    svg: sketch(marks),
    alt: lengths
      ? t(
          `Circle O with chord AB: the radius OA = ${lengths[0]}, the distance OM = ${lengths[1]} from the center to the midpoint M, and the half chord AM = ${lengths[2]}.`,
          `圆 O 中的弦 AB：半径 OA = ${lengths[0]}，圆心到中点 M 的距离 OM = ${lengths[1]}，半弦 AM = ${lengths[2]}。`,
        )
      : t(
          "Circle O with chord AB, the radius OA and the perpendicular segment OM from the center to the midpoint M of AB.",
          "圆 O 中有弦 AB、半径 OA，以及从圆心到 AB 中点 M 的垂线段 OM。",
        ),
  };
}

/** perpendicularBisectorsOfChords relates a chord, its distance from the center and the radius by the Pythagorean theorem. */
export const perpendicularBisectorsOfChords: TopicDef = {
  id: "perpendicular-bisectors-of-chords",
  title: t("Perpendicular Bisectors of Chords", "弦的垂直平分线"),
  summary: t(
    "Use the fact that the perpendicular from the center bisects a chord to relate the radius, the chord and its distance from the center.",
    "利用圆心到弦的垂线平分弦，建立半径、弦长与弦心距之间的关系。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem"],
  encompasses: [{ topic: "the-pythagorean-theorem", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `The center $O$ of a circle is equally far from the two ends of any chord $AB$, since $OA$ and $OB$ are both radii. The points equally far from $A$ and $B$ are exactly the points of the **perpendicular bisector** of $AB$, so that line passes through $O$. Turned around: the perpendicular from the center to a chord meets it at its **midpoint** $M$.

That gives a right triangle $OMA$ with the radius as hypotenuse, so the Pythagorean theorem links three lengths: the radius $r = OA$, the distance $d = OM$ from the center to the chord, and the half chord $AM$:

$$r^{2} = d^{2} + AM^{2}.$$

Take a circle of radius $17$ and a chord $8$ from the center. Then $AM = \\sqrt{17^{2} - 8^{2}} = \\sqrt{289 - 64} = \\sqrt{225} = 15$, and the chord is twice that, $AB = 30$:

{{figure 0}}

In this lesson we find the length of a chord, its distance from the center, and the radius, each from the other two.`,
    `圆心 $O$ 到任意弦 $AB$ 的两个端点距离相等，因为 $OA$ 和 $OB$ 都是半径。到 $A$、$B$ 距离相等的点恰好组成 $AB$ 的**垂直平分线**，所以这条直线经过 $O$。反过来说：从圆心到弦的垂线与弦交于弦的**中点** $M$。

于是得到以半径为斜边的直角三角形 $OMA$，勾股定理把三个长度联系起来：半径 $r = OA$、圆心到弦的距离 $d = OM$（弦心距）和半弦 $AM$：

$$r^{2} = d^{2} + AM^{2}.$$

看半径为 $17$、弦心距为 $8$ 的弦。$AM = \\sqrt{17^{2} - 8^{2}} = \\sqrt{289 - 64} = \\sqrt{225} = 15$，弦长是它的两倍，$AB = 30$：

{{figure 0}}

这节课我们由其中两个量求第三个：弦长、弦心距和半径。`,
  ),
  introFigures: [chordFigure(17, 8, ["17", "8", "15"])],
  knowledgePoints: [
    {
      id: "length-of-a-chord",
      figure: chordDrawings["length-of-a-chord"],
      title: t("The length of a chord", "弦长"),
      explanation: t(
        `The **perpendicular bisector of any chord passes through the center** of the circle: the center is the same distance from both endpoints, and the points equidistant from two points form their perpendicular bisector. Equivalently, the perpendicular segment $OM$ from the center to a chord $AB$ meets it at its midpoint.

So $OMA$ is a right triangle with hypotenuse the radius $OA = r$ and legs $OM = d$ (the distance from the center to the chord) and $AM = \\frac{1}{2}AB$:

$$r^{2} = d^{2} + AM^{2}.$$

If $r = 10$ and $d = 6$, then $AM = \\sqrt{100 - 36} = 8$ and the chord is $AB = 16$.

> **Watch out.** The triangle gives half the chord: $AM = 8$, so $AB = 16$. The radius is the hypotenuse, so subtract the squares; $\\sqrt{100 + 36}$ is longer than the radius, which half a chord never is. And $2(10 - 6) = 8$ subtracts lengths, which the Pythagorean theorem never does.`,
        `**任何弦的垂直平分线都经过圆心**：圆心到弦的两个端点距离相等，而到两点距离相等的点组成这两点连线的垂直平分线。等价地说，从圆心到弦 $AB$ 的垂线段 $OM$ 与弦交于弦的中点。

所以 $OMA$ 是直角三角形，斜边是半径 $OA = r$，直角边是 $OM = d$（弦心距）和 $AM = \\frac{1}{2}AB$：

$$r^{2} = d^{2} + AM^{2}.$$

若 $r = 10$、$d = 6$，则 $AM = \\sqrt{100 - 36} = 8$，弦长 $AB = 16$。

> **注意。** 直角三角形给出的是半弦：$AM = 8$，所以 $AB = 16$。半径是斜边，所以平方要相减；$\\sqrt{100 + 36}$ 比半径还长，半弦不可能这么长。$2(10 - 6) = 8$ 是把长度直接相减，勾股定理从来不这样算。`,
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const r = rng.int(3, 15);
        const d = rng.int(1, r - 1);
        const h2 = r * r - d * d;
        const [c, m] = simplifyRadical(h2);
        const [c2, m2] = simplifyRadical(r * r + d * d);
        const s1 = stepLabel(1, "The right triangle", "直角三角形");
        const s2 = stepLabel(2, "The half chord", "半弦");
        const s3 = stepLabel(3, "Double it", "乘以 2");
        const back = squareBack(h2);
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$ with radius $${r}$, chord $AB$ is at distance $OM = ${d}$ from the center. Find the length of $AB$ in simplest radical form.`,
              `在半径为 $${r}$ 的圆 $O$ 中，弦 $AB$ 的弦心距 $OM = ${d}$。求 $AB$ 的长（化为最简根式）。`,
            ),
            answer: [2 * c, m],
            wrong: [radical(c, m), radical(2 * c2, m2), String(2 * (r - d))],
            solution: t(
              `${s1.en} The perpendicular $OM$ from the center bisects the chord, so $OMA$ is a right triangle with the radius $OA = ${r}$ as hypotenuse and the legs $OM = ${d}$ and $AM$, half the chord.

${s2.en} The hypotenuse is the radius, so subtract the square of the known leg:${steps(`AM = \\sqrt{${r}^{2} - ${d}^{2}} = ${rootSteps(h2)}`)}${s3.en} $M$ is the midpoint, so the chord is twice $AM$:${steps(`AB = 2 \\cdot AM = ${radical(2 * c, m)}`)}{{figure 0}}

**Check.** Go back up the triangle: ${back.en} and $${h2} + ${d}^{2} = ${h2} + ${d * d} = ${r * r} = ${r}^{2}$, so the half chord and the distance rebuild the radius $${r}$.`,
              `${s1["zh-CN"]}从圆心作的垂线 $OM$ 平分弦，所以 $OMA$ 是直角三角形，斜边是半径 $OA = ${r}$，直角边是 $OM = ${d}$ 和半弦 $AM$。

${s2["zh-CN"]}斜边是半径，所以减去已知直角边的平方：${steps(`AM = \\sqrt{${r}^{2} - ${d}^{2}} = ${rootSteps(h2)}`)}${s3["zh-CN"]}$M$ 是中点，所以弦长是 $AM$ 的两倍：${steps(`AB = 2 \\cdot AM = ${radical(2 * c, m)}`)}{{figure 0}}

**检验。** 反过来用这个三角形：${back["zh-CN"]}，且 $${h2} + ${d}^{2} = ${h2} + ${d * d} = ${r * r} = ${r}^{2}$，半弦和弦心距还原出半径 $${r}$。`,
            ),
          }),
          figure: chordFigure(r, d),
          solutionFigures: [chordFigure(r, d, [String(r), String(d), rootPlain(h2)])],
        };
      },
    },
    {
      id: "distance-from-the-center",
      figure: chordDrawings["distance-from-the-center"],
      title: t("The distance from the center", "弦心距"),
      explanation: t(
        `The perpendicular from the center meets the chord at its midpoint, so the leg of the right triangle is **half** the chord, and the distance from the center is the other leg. In a circle of radius $13$, a chord of length $24$ has half-length $12$, so its distance from the center is

$$d = \\sqrt{13^{2} - 12^{2}} = \\sqrt{25} = 5.$$

> **Watch out.** Halve the chord first: with the whole chord, $13^{2} - 24^{2}$ is negative. The radius is the hypotenuse, so subtract the squares; $\\sqrt{13^{2} + 12^{2}}$ is longer than the radius. And $13 - 12 = 1$ subtracts lengths instead of squares.`,
        `从圆心作的垂线与弦交于弦的中点，所以直角三角形的一条直角边是弦长的**一半**，弦心距是另一条直角边。在半径为 $13$ 的圆中，长为 $24$ 的弦的一半是 $12$，所以弦心距是

$$d = \\sqrt{13^{2} - 12^{2}} = \\sqrt{25} = 5.$$

> **注意。** 先把弦长减半：用整条弦，$13^{2} - 24^{2}$ 是负数。半径是斜边，所以平方要相减；$\\sqrt{13^{2} + 12^{2}}$ 比半径还长。$13 - 12 = 1$ 是长度相减，不是平方相减。`,
      ),
      generate(rng) {
        const r = rng.int(3, 15);
        const a = rng.int(1, r - 1);
        const d2 = r * r - a * a;
        const wrong = [rootTex(r * r + a * a), String(r - a)];
        if (r * r - 4 * a * a > 0) wrong.push(rootTex(r * r - 4 * a * a));
        const s1 = stepLabel(1, "Halve the chord", "弦长减半");
        const s2 = stepLabel(2, "The other leg", "另一条直角边");
        const back = squareBack(d2);
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$ with radius $${r}$, chord $AB$ has length $${2 * a}$. Find the distance $OM$ from the center to the chord, in simplest radical form.`,
              `在半径为 $${r}$ 的圆 $O$ 中，弦 $AB$ 长 $${2 * a}$。求圆心到弦的距离 $OM$（化为最简根式）。`,
            ),
            answer: rootAnswer(d2),
            wrong,
            solution: t(
              `${s1.en} The perpendicular $OM$ from the center meets the chord at its midpoint $M$, so $AM = \\frac{${2 * a}}{2} = ${a}$.

${s2.en} In the right triangle $OMA$ the radius $OA = ${r}$ is the hypotenuse and $OM$ a leg, so subtract the squares:${steps(`OM = \\sqrt{${r}^{2} - ${a}^{2}} = ${rootSteps(d2)}`)}{{figure 0}}

**Check.** Rebuild the radius from the two legs: ${back.en}, and $${d2} + ${a}^{2} = ${d2} + ${a * a} = ${r * r} = ${r}^{2}$.`,
              `${s1["zh-CN"]}从圆心作的垂线 $OM$ 与弦交于中点 $M$，所以 $AM = \\frac{${2 * a}}{2} = ${a}$。

${s2["zh-CN"]}在直角三角形 $OMA$ 中，半径 $OA = ${r}$ 是斜边，$OM$ 是直角边，所以平方相减：${steps(`OM = \\sqrt{${r}^{2} - ${a}^{2}} = ${rootSteps(d2)}`)}{{figure 0}}

**检验。** 用两条直角边还原半径：${back["zh-CN"]}，且 $${d2} + ${a}^{2} = ${d2} + ${a * a} = ${r * r} = ${r}^{2}$。`,
            ),
          }),
          figure: chordFigure(r, Math.sqrt(d2)),
          solutionFigures: [chordFigure(r, Math.sqrt(d2), [String(r), rootPlain(d2), String(a)])],
        };
      },
    },
    {
      id: "radius-from-a-chord",
      figure: chordDrawings["radius-from-a-chord"],
      title: t("The radius from a chord", "由弦求半径"),
      explanation: t(
        `If the chord and its distance from the center are known, the radius is the hypotenuse of the right triangle whose legs are the half chord and the distance, so add the squares. A chord of length $16$ at distance $4$ from the center has half-length $8$, so

$$r = \\sqrt{8^{2} + 4^{2}} = \\sqrt{80} = 4\\sqrt{5}.$$

> **Watch out.** The leg is half the chord, $8$, not $16$: $\\sqrt{16^{2} + 4^{2}}$ is too long. The radius is the hypotenuse, so add the squares; $\\sqrt{8^{2} - 4^{2}}$ would be a leg. And $8 + 4 = 12$ adds lengths instead of squares.`,
        `已知弦长和弦心距时，半径是直角三角形的斜边，两条直角边是半弦和弦心距，所以平方相加。长为 $16$、弦心距为 $4$ 的弦，一半是 $8$，所以

$$r = \\sqrt{8^{2} + 4^{2}} = \\sqrt{80} = 4\\sqrt{5}.$$

> **注意。** 直角边是半弦 $8$，不是 $16$：$\\sqrt{16^{2} + 4^{2}}$ 太长了。半径是斜边，所以平方相加；$\\sqrt{8^{2} - 4^{2}}$ 是一条直角边。$8 + 4 = 12$ 是长度相加，不是平方相加。`,
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const d = rng.int(1, 12);
        const r2 = a * a + d * d;
        const wrong = [rootTex(4 * a * a + d * d), String(a + d)];
        if (a !== d) wrong.push(rootTex(Math.abs(a * a - d * d)));
        const s1 = stepLabel(1, "Halve the chord", "弦长减半");
        const s2 = stepLabel(2, "The hypotenuse", "斜边");
        const back = squareBack(r2);
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$, chord $AB$ has length $${2 * a}$ and is at distance $OM = ${d}$ from the center. Find the radius in simplest radical form.`,
              `在圆 $O$ 中，弦 $AB$ 长 $${2 * a}$，弦心距 $OM = ${d}$。求半径（化为最简根式）。`,
            ),
            answer: rootAnswer(r2),
            wrong,
            solution: t(
              `${s1.en} The perpendicular $OM$ bisects the chord, so $AM = \\frac{${2 * a}}{2} = ${a}$.

${s2.en} The radius $OA$ is the hypotenuse of the right triangle $OMA$ with legs $AM = ${a}$ and $OM = ${d}$, so add the squares:${steps(`OA = \\sqrt{${a}^{2} + ${d}^{2}} = ${rootSteps(r2)}`)}{{figure 0}}

**Check.** Find the half chord again from the radius and the distance: ${back.en}, and $${r2} - ${d}^{2} = ${r2 - d * d} = ${a}^{2}$, so $AM = ${a}$ and the chord is $${2 * a}$, as given.`,
              `${s1["zh-CN"]}垂线 $OM$ 平分弦，所以 $AM = \\frac{${2 * a}}{2} = ${a}$。

${s2["zh-CN"]}半径 $OA$ 是直角三角形 $OMA$ 的斜边，直角边是 $AM = ${a}$ 和 $OM = ${d}$，所以平方相加：${steps(`OA = \\sqrt{${a}^{2} + ${d}^{2}} = ${rootSteps(r2)}`)}{{figure 0}}

**检验。** 由半径和弦心距再求半弦：${back["zh-CN"]}，且 $${r2} - ${d}^{2} = ${r2 - d * d} = ${a}^{2}$，所以 $AM = ${a}$，弦长 $${2 * a}$，与已知相符。`,
            ),
          }),
          figure: chordFigure(Math.sqrt(r2), d),
          solutionFigures: [chordFigure(Math.sqrt(r2), d, [rootPlain(r2), String(d), String(a)])],
        };
      },
    },
  ],
};

/** bisectorCoefficients are a, b and c of the perpendicular bisector ax + by = c of PQ in lowest terms: the points with XP² = XQ². */
function bisectorCoefficients(p: Point, q: Point): [number, number, number] {
  const [a, b, c] = [2 * (q[0] - p[0]), 2 * (q[1] - p[1]), q[0] ** 2 + q[1] ** 2 - p[0] ** 2 - p[1] ** 2];
  const g = gcd(gcd(a, b), c) * (a < 0 || (a === 0 && b < 0) ? -1 : 1);
  return [a / g, b / g, c / g];
}

/** bisectorEquation writes the perpendicular bisector of PQ as ax + by = c in lowest terms. */
function bisectorEquation(p: Point, q: Point): string {
  const [a, b, c] = bisectorCoefficients(p, q);
  return `${poly([a, "x"], [b, "y"])} = ${c}`;
}

/** equalDistances writes XP² = XQ² for the point X(x, y), the equation whose solutions form the perpendicular bisector of PQ. */
const equalDistances = (p: Point, q: Point) => `${sqTerm("x", p[0])} + ${sqTerm("y", p[1])} = ${sqTerm("x", q[0])} + ${sqTerm("y", q[1])}`;

/** solveBisectors writes the steps that solve a1x + b1y = c1, a2x + b2y = c2 for the point (h, k) where they meet, as text for en and zh. */
function solveBisectors(e1: [number, number, number], e2: [number, number, number], h: number, k: number): Text {
  const [a1, b1, c1] = e1;
  const [a2, b2, c2] = e2;
  const xFrom = (a: number, b: number, c: number) =>
    steps(
      ...[`${poly([a, "x"], [b * k, ""])} = ${c}`, `${poly([a, "x"])} = ${c - b * k}`, `x = ${h}`].filter(
        (l, i, all) => all.indexOf(l) === i,
      ),
    );
  const unique = (...lines: string[]) => steps(...lines.filter((l, i) => lines.indexOf(l) === i));
  const yFrom = (a: number, b: number, c: number) =>
    unique(`${poly([a * h, ""], [b, "y"])} = ${c}`, `${poly([b, "y"])} = ${c - a * h}`, `y = ${k}`);
  const order = (firstIsIt: boolean) => [
    t(firstIsIt ? "first" : "second", firstIsIt ? "第一个" : "第二个"),
    t(firstIsIt ? "second" : "first", firstIsIt ? "第二个" : "第一个"),
  ];
  if (a1 === 0 || a2 === 0) {
    const [first, second] = a1 === 0 ? [e1, e2] : [e2, e1];
    const [which, other] = order(a1 === 0);
    return t(
      `The ${which!.en} equation has no $x$ term, so it gives $y$ at once:${unique(`${poly([first[1], "y"])} = ${first[2]}`, `y = ${k}`)}Substitute $y = ${k}$ into the ${other!.en} equation:${xFrom(second[0], second[1], second[2])}`,
      `${which!["zh-CN"]}方程没有 $x$ 项，直接得出 $y$：${unique(`${poly([first[1], "y"])} = ${first[2]}`, `y = ${k}`)}把 $y = ${k}$ 代入${other!["zh-CN"]}方程：${xFrom(second[0], second[1], second[2])}`,
    );
  }
  if (b1 === 0 || b2 === 0) {
    const [first, second] = b1 === 0 ? [e1, e2] : [e2, e1];
    const [which, other] = order(b1 === 0);
    return t(
      `The ${which!.en} equation has no $y$ term, so it gives $x$ at once:${unique(`${poly([first[0], "x"])} = ${first[2]}`, `x = ${h}`)}Substitute $x = ${h}$ into the ${other!.en} equation:${yFrom(second[0], second[1], second[2])}`,
      `${which!["zh-CN"]}方程没有 $y$ 项，直接得出 $x$：${unique(`${poly([first[0], "x"])} = ${first[2]}`, `x = ${h}`)}把 $x = ${h}$ 代入${other!["zh-CN"]}方程：${yFrom(second[0], second[1], second[2])}`,
    );
  }
  const g = gcd(a1, a2) * (a2 * a1 < 0 && a2 < 0 ? -1 : 1);
  const [m1, m2] = [a2 / g, a1 / g];
  const det = b1 * m1 - b2 * m2;
  const rhs = c1 * m1 - c2 * m2;
  const how =
    m1 === 1 && m2 === 1
      ? t("Subtract the second equation from the first: the $x$ terms cancel.", "第一个方程减去第二个方程：$x$ 项消去。")
      : m1 === 1 && m2 === -1
        ? t("Add the two equations: the $x$ terms cancel.", "两个方程相加：$x$ 项消去。")
        : t(
            `Multiply the first equation by $${m1}$ and the second by $${m2}$, then subtract: the $x$ terms cancel.`,
            `第一个方程乘以 $${m1}$，第二个方程乘以 $${m2}$，再相减：$x$ 项消去。`,
          );
  const ySteps = unique(`${poly([det, "y"])} = ${rhs}`, `y = ${k}`);
  return t(
    `${how.en}${ySteps}Substitute $y = ${k}$ into the first equation:${xFrom(a1, b1, c1)}`,
    `${how["zh-CN"]}${ySteps}把 $y = ${k}$ 代入第一个方程：${xFrom(a1, b1, c1)}`,
  );
}

/** midpointOf is the midpoint of PQ, which may have half-integer coordinates. */
const midpointOf = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/** perpendicularBisectorLine draws the perpendicular bisector of PQ. */
const perpendicularBisectorLine = (p: Point, q: Point, tone: "action" | "result" = "result"): PlaneMark =>
  lineMark(midpointOf(p, q), -(q[1] - p[1]), q[0] - p[0], tone);

/** perpendicularBisectorsOfChordsInTheCoordinatePlane uses the perpendicular bisector of a chord, which passes through the center, in coordinates. */
export const perpendicularBisectorsOfChordsInTheCoordinatePlane: TopicDef = {
  id: "perpendicular-bisectors-of-chords-in-the-coordinate-plane",
  title: t("Perpendicular Bisectors of Chords in the Coordinate Plane", "坐标平面中弦的垂直平分线"),
  summary: t(
    "Write the perpendicular bisector of a chord through the center, find a circle's center from three of its points, and find the length of a chord cut by a line.",
    "写出过圆心的弦的垂直平分线，由圆上三点求圆心，并求直线截圆所得的弦长。",
  ),
  prerequisites: [
    "perpendicular-bisectors-of-chords",
    "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
    "intersection-of-two-lines",
  ],
  encompasses: [{ topic: "perpendicular-bisectors-of-chords", weight: 0.5 }],
  xp: 17,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.5"],
  intro: t(
    `Every point of the perpendicular bisector of a chord $PQ$ is equally far from $P$ and $Q$, and the center of the circle is such a point, since $CP$ and $CQ$ are radii. So **the perpendicular bisector of every chord passes through the center**. On the coordinate plane we can watch this happen.

Take the circle $(x - 1)^{2} + (y - 2)^{2} = 25$ and its points $P(4, 6)$ and $Q(5, -1)$. The chord has slope $\\frac{-1 - 6}{5 - 4} = -7$ and midpoint $\\left(\\frac{9}{2}, \\frac{5}{2}\\right)$. Its perpendicular bisector has slope $\\frac{1}{7}$ and goes through that midpoint, which makes it

$$y = \\frac{1}{7}x + \\frac{13}{7}.$$

At $x = 1$ it gives $y = \\frac{1}{7} + \\frac{13}{7} = 2$: the line runs through the center $(1, 2)$, as it must.

{{figure 0}}

In this lesson we use that fact three ways: to write a chord's perpendicular bisector through the center, to find the center where two such bisectors cross, and to find the length of a chord that a line cuts from a circle.`,
    `弦 $PQ$ 的垂直平分线上每个点到 $P$、$Q$ 的距离都相等，而圆心正是这样的点，因为 $CP$ 和 $CQ$ 都是半径。所以**每条弦的垂直平分线都经过圆心**。在坐标平面上可以亲眼看到这一点。

看圆 $(x - 1)^{2} + (y - 2)^{2} = 25$ 和圆上的点 $P(4, 6)$、$Q(5, -1)$。弦的斜率是 $\\frac{-1 - 6}{5 - 4} = -7$，中点是 $\\left(\\frac{9}{2}, \\frac{5}{2}\\right)$。它的垂直平分线斜率为 $\\frac{1}{7}$，经过这个中点，所以是

$$y = \\frac{1}{7}x + \\frac{13}{7}.$$

$x = 1$ 时 $y = \\frac{1}{7} + \\frac{13}{7} = 2$：这条直线确实经过圆心 $(1, 2)$。

{{figure 0}}

这节课我们从三个方面运用这个事实：写出过圆心的弦的垂直平分线，由两条垂直平分线的交点求圆心，以及求直线截圆所得的弦长。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -5, xMax: 7, yMin: -4, yMax: 8 },
      [
        circleMark([1, 2], 5),
        { kind: "segment", a: [4, 6], b: [5, -1], tone: "action" },
        lineMark([1, 2], 7, 1, "result"),
        { kind: "point", at: [4, 6], label: "P(4, 6)", dir: "ne" },
        { kind: "point", at: [5, -1], label: "Q(5, −1)", dir: "se" },
        { kind: "point", at: [4.5, 2.5], dir: "e" },
        { kind: "point", at: [1, 2], label: "(1, 2)", dir: "nw", tone: "result" },
      ],
      "The chord from P(4, 6) to Q(5, −1) of the circle with center (1, 2); its perpendicular bisector y = x/7 + 13/7 passes through the midpoint (4.5, 2.5) and the center.",
      "圆心为 (1, 2) 的圆的弦 P(4, 6)Q(5, −1)；它的垂直平分线 y = x/7 + 13/7 经过中点 (4.5, 2.5) 和圆心。",
    ),
  ],
  knowledgePoints: [
    {
      id: "perpendicular-bisector-of-a-chord",
      figure: planeCircleDrawings["perpendicular-bisector-of-a-chord"],
      title: t("The perpendicular bisector of a chord", "弦的垂直平分线"),
      explanation: t(
        `The perpendicular bisector of a chord passes through the center, so when the center is known you need only the slope: the negative reciprocal of the chord's slope.

The points $P(-3, 4)$ and $Q(4, 3)$ lie on $x^{2} + y^{2} = 25$. The chord $PQ$ has slope $\\frac{3 - 4}{4 - (-3)} = -\\frac{1}{7}$, so its perpendicular bisector has slope $7$ and passes through the center $(0, 0)$: $y = 7x$.

> **Watch out.** Flip the chord's slope and change its sign: $7$, not the chord's own $-\\frac{1}{7}$, and not $-7$, the flip alone. The bisector goes through the center and the midpoint of $PQ$, not through $P$: a line of slope $7$ through $P$ misses the midpoint.`,
        `弦的垂直平分线经过圆心，所以已知圆心时只需求斜率：弦的斜率的负倒数。

点 $P(-3, 4)$ 和 $Q(4, 3)$ 在 $x^{2} + y^{2} = 25$ 上。弦 $PQ$ 的斜率是 $\\frac{3 - 4}{4 - (-3)} = -\\frac{1}{7}$，所以它的垂直平分线斜率是 $7$，并经过圆心 $(0, 0)$：$y = 7x$。

> **注意。** 把弦的斜率倒过来并变号：得 $7$，不是弦自身的斜率 $-\\frac{1}{7}$，也不是只倒过来的 $-7$。垂直平分线经过圆心和 $PQ$ 的中点，而不经过 $P$：过 $P$、斜率为 $7$ 的直线不经过中点。`,
      ),
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const pts = latticePoints(r2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        let [u, v] = rng.sample(pts, 2) as [Point, Point];
        for (let i = 0; i < 20 && (u[1] === v[1] || (u[0] === -v[0] && u[1] === -v[1])); i++) [u, v] = rng.sample(pts, 2) as [Point, Point];
        if (u[1] === v[1] || (u[0] === -v[0] && u[1] === -v[1])) [u, v] = [pts[0]!, pts[1]!];
        const p: Point = [u[0] + h, u[1] + k];
        const q: Point = [v[0] + h, v[1] + k];
        const m = Q.of(-(q[0] - p[0]), q[1] - p[1]);
        const c = Q.of(k).sub(m.mul(Q.of(h)));
        const answer = si(m, c);
        const chordSlope = q[0] === p[0] ? undefined : Q.of(q[1] - p[1], q[0] - p[0]);
        const wrong = [lineThrough(m, p), lineThrough(m.neg(), [h, k])];
        if (chordSlope) wrong.push(lineThrough(chordSlope, p), lineThrough(chordSlope, [h, k]));
        const C: Point = [h, k];
        const [mx, my] = [Q.of(p[0] + q[0], 2), Q.of(p[1] + q[1], 2)];
        const s1 = stepLabel(1, "The slope of the chord", "弦的斜率");
        const s2 = stepLabel(2, "The perpendicular slope", "垂直的斜率");
        const s3 = stepLabel(3, "Through the center", "经过圆心");
        const slopes = chordSlope
          ? t(
              `${s1.en} From $P$ to $Q$:${steps(`m_{PQ} = ${slopeTex(p, q)}`)}${s2.en} The bisector is perpendicular to the chord, so flip $${num(chordSlope)}$ and change the sign: $m = ${num(m)}$.`,
              `${s1["zh-CN"]}从 $P$ 到 $Q$：${steps(`m_{PQ} = ${slopeTex(p, q)}`)}${s2["zh-CN"]}垂直平分线与弦垂直，所以把 $${num(chordSlope)}$ 倒过来并变号：$m = ${num(m)}$。`,
            )
          : t(
              `${s1.en} Both points have $x = ${p[0]}$, so the chord is vertical.\n\n${s2.en} A line perpendicular to a vertical line is horizontal, so $m = 0$.`,
              `${s1["zh-CN"]}两点都有 $x = ${p[0]}$，所以弦是竖直的。\n\n${s2["zh-CN"]}与竖直线垂直的直线是水平的，所以 $m = 0$。`,
            );
        const check = chordSlope
          ? t(
              `the slopes multiply to $-1$, $${slopeProduct(chordSlope, m)}$, and the midpoint of $PQ$, $\\left(${num(mx)}, ${num(my)}\\right)$, is on the line: $${evalAt(m, mx, c)} = ${num(my)}$.`,
              `两个斜率之积是 $-1$：$${slopeProduct(chordSlope, m)}$；$PQ$ 的中点 $\\left(${num(mx)}, ${num(my)}\\right)$ 在直线上：$${evalAt(m, mx, c)} = ${num(my)}$。`,
            )
          : t(
              `the midpoint of $PQ$ has $y = \\frac{${p[1]} + ${paren(q[1])}}{2} = ${num(my)}$, so it is on the line $${answer}$.`,
              `$PQ$ 的中点的 $y = \\frac{${p[1]} + ${paren(q[1])}}{2} = ${num(my)}$，所以它在直线 $${answer}$ 上。`,
            );
        return {
          ...equationProblem({
            prompt: t(
              `The points $P${pointLatex(p)}$ and $Q${pointLatex(q)}$ lie on the circle $${circleEq(h, k, r2)}$. Write in slope-intercept form the equation of the perpendicular bisector of the chord $PQ$.`,
              `点 $P${pointLatex(p)}$ 和 $Q${pointLatex(q)}$ 在圆 $${circleEq(h, k, r2)}$ 上。写出弦 $PQ$ 的垂直平分线的斜截式方程。`,
            ),
            answer,
            form: "slope-intercept",
            wrong,
            solution: t(
              `${slopes.en}

${s3.en} The perpendicular bisector of a chord passes through the center $${pointLatex(C)}$; substitute it into $y = mx + b$:${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}So the perpendicular bisector is $${answer}$.

{{figure 0}}

**Check.** It must also bisect the chord: ${check.en}`,
              `${slopes["zh-CN"]}

${s3["zh-CN"]}弦的垂直平分线经过圆心 $${pointLatex(C)}$；把它代入 $y = mx + b$：${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}所以垂直平分线是 $${answer}$。

{{figure 0}}

**检验。** 它还必须平分这条弦：${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a: p, b: q, tone: "action" },
                perpendicularBisectorLine(p, q),
                { kind: "point", at: p, label: "P", dir: away(p, C) },
                { kind: "point", at: q, label: "Q", dir: away(q, C) },
                { kind: "point", at: midpointOf(p, q) },
                { kind: "point", at: C, label: plainPt(C), dir: away(C, midpointOf(p, q)), tone: "result" },
              ],
              `The perpendicular bisector of the chord PQ passes through its midpoint and the center ${plainPt(C)}.`,
              `弦 PQ 的垂直平分线经过它的中点和圆心 ${plainPt(C)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "center-from-three-points",
      figure: planeCircleDrawings["center-from-three-points"],
      title: t("The center from three points", "由三点求圆心"),
      explanation: t(
        `The perpendicular bisectors of two chords both pass through the center, so the center is where they meet. The perpendicular bisector of $PQ$ is the set of points $(x, y)$ equally far from $P$ and $Q$; setting the squared distances equal makes the squares $x^{2}$ and $y^{2}$ cancel, leaving a linear equation.

For $A(0, 6)$, $B(2, 2)$ and $C(6, 2)$: the bisector of $BC$ is $x = 4$; the bisector of $AB$ comes from

$$x^{2} + (y - 6)^{2} = (x - 2)^{2} + (y - 2)^{2} \\;\\Rightarrow\\; x - 2y = -7.$$

With $x = 4$, the equation $4 - 2y = -7$ gives $y = 5.5$, so the center is $(4, 5.5)$.

> **Watch out.** The center is not the average of the three points, $\\left(\\frac{8}{3}, \\frac{10}{3}\\right)$, which is not equally far from them, and not the midpoint of one chord, such as $(1, 4)$ for $AB$, unless that chord is a diameter. Write the center as $(x, y)$, in that order, with the signs as solved.`,
        `两条弦的垂直平分线都经过圆心，所以圆心就是它们的交点。$PQ$ 的垂直平分线是到 $P$、$Q$ 距离相等的点 $(x, y)$ 的集合；令两个距离的平方相等，$x^{2}$ 和 $y^{2}$ 会消去，只剩一个一次方程。

对 $A(0, 6)$、$B(2, 2)$、$C(6, 2)$：$BC$ 的垂直平分线是 $x = 4$；$AB$ 的垂直平分线由

$$x^{2} + (y - 6)^{2} = (x - 2)^{2} + (y - 2)^{2} \\;\\Rightarrow\\; x - 2y = -7$$

得到。代入 $x = 4$，由 $4 - 2y = -7$ 得 $y = 5.5$，所以圆心是 $(4, 5.5)$。

> **注意。** 圆心不是三个点的平均 $\\left(\\frac{8}{3}, \\frac{10}{3}\\right)$，它到三点的距离并不相等；也不是某条弦的中点，例如 $AB$ 的中点 $(1, 4)$，除非这条弦是直径。圆心按 $(x, y)$ 的顺序写，符号按解出的结果保留。`,
      ),
      keyPrerequisites: ["intersection-of-two-lines"],
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        const [u, v, w] = rng.sample(latticePoints(r2), 3) as [Point, Point, Point];
        const [a, b, c] = [u, v, w].map((p): Point => [p[0] + h, p[1] + k]) as [Point, Point, Point];
        const C: Point = [h, k];
        const s1 = stepLabel(1, "The perpendicular bisector of AB", "AB 的垂直平分线");
        const s2 = stepLabel(2, "The perpendicular bisector of BC", "BC 的垂直平分线");
        const s3 = stepLabel(3, "Where they meet", "求交点");
        const solve = solveBisectors(bisectorCoefficients(a, b), bisectorCoefficients(b, c), h, k);
        const dist = (p: Point) => `${squaredDistance(C, p)}`;
        return {
          ...pointProblem({
            prompt: t(
              `A circle passes through $A${pointLatex(a)}$, $B${pointLatex(b)}$ and $C${pointLatex(c)}$. Find its center.`,
              `一个圆经过 $A${pointLatex(a)}$、$B${pointLatex(b)}$ 和 $C${pointLatex(c)}$。求它的圆心。`,
            ),
            answer: [h, k],
            wrong: [
              [Q.of(a[0] + b[0] + c[0], 3), Q.of(a[1] + b[1] + c[1], 3)],
              [Q.of(a[0] + b[0], 2), Q.of(a[1] + b[1], 2)],
              [k, h],
              [-h, -k],
            ],
            solution: t(
              `${s1.en} The center $O(x, y)$ is equally far from $A$ and $B$. Set the squared distances equal; $x^{2}$ and $y^{2}$ cancel and a linear equation is left:${steps(equalDistances(a, b), bisectorEquation(a, b))}${s2.en} It is also equally far from $B$ and $C$:${steps(equalDistances(b, c), bisectorEquation(b, c))}${s3.en} The center lies on both bisectors, so solve the system. ${solve.en}The center is $${pointLatex(C)}$.

{{figure 0}}

**Check.** $O$ is the same distance from all three points: the squared distances are${steps(`OA^{2} = ${dist(a)}`, `OB^{2} = ${dist(b)}`, `OC^{2} = ${dist(c)}`)}all equal to $${r2}$.`,
              `${s1["zh-CN"]}圆心 $O(x, y)$ 到 $A$、$B$ 的距离相等。令距离的平方相等，$x^{2}$ 和 $y^{2}$ 消去，剩下一个一次方程：${steps(equalDistances(a, b), bisectorEquation(a, b))}${s2["zh-CN"]}它到 $B$、$C$ 的距离也相等：${steps(equalDistances(b, c), bisectorEquation(b, c))}${s3["zh-CN"]}圆心在两条垂直平分线上，所以解这个方程组。${solve["zh-CN"]}圆心是 $${pointLatex(C)}$。

{{figure 0}}

**检验。** $O$ 到三个点的距离相同：距离的平方是${steps(`OA^{2} = ${dist(a)}`, `OB^{2} = ${dist(b)}`, `OC^{2} = ${dist(c)}`)}都等于 $${r2}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a, b, tone: "action" },
                { kind: "segment", a: b, b: c, tone: "action" },
                perpendicularBisectorLine(a, b),
                perpendicularBisectorLine(b, c),
                { kind: "point", at: a, label: "A", dir: away(a, C) },
                { kind: "point", at: b, label: "B", dir: away(b, C) },
                { kind: "point", at: c, label: "C", dir: away(c, C) },
                { kind: "point", at: C, label: plainPt(C), dir: "ne", tone: "result" },
              ],
              `The perpendicular bisectors of AB and BC cross at the center ${plainPt(C)}.`,
              `AB 与 BC 的垂直平分线交于圆心 ${plainPt(C)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "chord-cut-by-a-line",
      figure: planeCircleDrawings["chord-cut-by-a-line"],
      title: t("A chord cut by a line", "直线截得的弦"),
      explanation: t(
        `A horizontal line $y = c$ cuts a chord from the circle $(x - h)^{2} + (y - k)^{2} = r^{2}$ when its distance $d = |c - k|$ from the center is less than $r$. The perpendicular from the center to the chord bisects it, so the chord has length

$$2\\sqrt{r^{2} - d^{2}}.$$

The line $y = 5$ and the circle $(x + 1)^{2} + (y - 2)^{2} = 25$: $d = 3$, so the chord is $2\\sqrt{25 - 9} = 8$ long. A vertical line $x = c$ works the same way with $d = |c - h|$.

> **Watch out.** The distance is measured from the center, $|5 - 2| = 3$, not from the axis, $5$. The triangle gives half the chord, $4$; the chord is $8$. And subtract $d^{2}$ from $r^{2}$: $2\\sqrt{25 + 9}$ is longer than the diameter.`,
        `当水平线 $y = c$ 到圆心的距离 $d = |c - k|$ 小于 $r$ 时，它从圆 $(x - h)^{2} + (y - k)^{2} = r^{2}$ 上截得一条弦。圆心到弦的垂线平分弦，所以弦长是

$$2\\sqrt{r^{2} - d^{2}}.$$

直线 $y = 5$ 与圆 $(x + 1)^{2} + (y - 2)^{2} = 25$：$d = 3$，所以弦长是 $2\\sqrt{25 - 9} = 8$。竖直线 $x = c$ 同理，其中 $d = |c - h|$。

> **注意。** 距离要从圆心量起，是 $|5 - 2| = 3$，不是到坐标轴的 $5$。直角三角形给出的是半弦 $4$，弦长是 $8$。要从 $r^{2}$ 中减去 $d^{2}$：$2\\sqrt{25 + 9}$ 比直径还长。`,
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 6);
        const r2 = rng.int(5, 80);
        const d = rng.int(0, Math.floor(Math.sqrt(r2 - 1)));
        const s = r2 - d * d;
        const vertical = rng.bool();
        const [center, name] = vertical ? [h, "x"] : [k, "y"];
        const c = center + (rng.bool() ? d : -d);
        const [a, m] = simplifyRadical(s);
        const wrong = [radical(a, m), rootTex(4 * (r2 + d * d))];
        if (r2 - c * c > 0 && c !== d && c !== -d) wrong.push(rootTex(4 * (r2 - c * c)));
        const C: Point = [h, k];
        const rs = Math.sqrt(s);
        const at = (u: number): Point => (vertical ? [c, u] : [u, c]);
        const other = vertical ? k : h;
        const foot = at(other);
        const ends = vertical ? `(${c}, ${pmTex(k, s)})` : `(${pmTex(h, s)}, ${c})`;
        const own = `${paren(c - center)}^{2}`;
        const free = `(\\pm ${rootTex(s)})^{2}`;
        const sub = vertical ? `${own} + ${free} = ${d * d} + ${s} = ${r2}` : `${free} + ${own} = ${s} + ${d * d} = ${r2}`;
        const s1 = stepLabel(1, "The distance from the center", "到圆心的距离");
        const s2 = stepLabel(2, "Half the chord", "半弦");
        const s3 = stepLabel(3, "Double it", "乘以 2");
        const double = a === 1 && m !== 1 ? `2\\sqrt{${s}}` : `2 \\cdot ${rootTex(s)} = ${radical(2 * a, m)}`;
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length of the chord that the line $${name} = ${c}$ cuts from the circle $${circleEq(h, k, r2)}$, in simplest radical form.`,
              `求直线 $${name} = ${c}$ 截圆 $${circleEq(h, k, r2)}$ 所得的弦长（化为最简根式）。`,
            ),
            answer: [2 * a, m],
            wrong,
            solution: t(
              `${s1.en} The center is $${pointLatex(C)}$ and $r^{2} = ${r2}$. The perpendicular from the center to the line $${name} = ${c}$ is ${vertical ? "horizontal" : "vertical"}, so its length is the difference in $${name}$:${steps(`d = |${c} - ${paren(center)}| = ${d}`)}${s2.en} The perpendicular bisects the chord, and the radius to an end is the hypotenuse:${steps(`\\sqrt{${r2} - ${d}^{2}} = ${rootSteps(s)}`)}${s3.en} The chord is twice that:${steps(double)}{{figure 0}}

**Check.** The ends of the chord are $${ends}$. Substitute them into the circle's equation:${steps(sub)}so both ends are on the circle, and they are $${radical(2 * a, m)}$ apart.`,
              `${s1["zh-CN"]}圆心是 $${pointLatex(C)}$，$r^{2} = ${r2}$。从圆心到直线 $${name} = ${c}$ 的垂线是${vertical ? "水平" : "竖直"}的，所以它的长度就是 $${name}$ 的差：${steps(`d = |${c} - ${paren(center)}| = ${d}`)}${s2["zh-CN"]}垂线平分弦，到弦端点的半径是斜边：${steps(`\\sqrt{${r2} - ${d}^{2}} = ${rootSteps(s)}`)}${s3["zh-CN"]}弦长是它的两倍：${steps(double)}{{figure 0}}

**检验。** 弦的两个端点是 $${ends}$。代入圆的方程：${steps(sub)}所以两个端点都在圆上，相距 $${radical(2 * a, m)}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                lineMark(foot, vertical ? 0 : 1, vertical ? 1 : 0),
                ...(d === 0 ? [] : [{ kind: "segment", a: C, b: foot, dashed: true, tone: "action" } as const]),
                { kind: "segment", a: at(other - rs), b: at(other + rs), tone: "result" },
                { kind: "point", at: C, label: plainPt(C), dir: vertical ? (c > h ? "w" : "e") : c > k ? "s" : "n" },
                { kind: "point", at: at(other - rs), tone: "result" },
                { kind: "point", at: at(other + rs), tone: "result" },
              ],
              `The line ${name} = ${c} is ${d} from the center ${plainPt(C)} and cuts a chord of length 2·${rootPlain(s)}.`,
              `直线 ${name} = ${c} 到圆心 ${plainPt(C)} 的距离为 ${d}，截得的弦长为 2·${rootPlain(s)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Thales' theorem
// ---------------------------------------------------------------------------

/** pickNear draws a lattice point near the circle x² + y² = r2 but not on it. */
function pickNear(rng: Rng, w: Point, r2: number): Point {
  const steps: Point[] = rng.shuffle([
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
  ]);
  for (const [a, b] of steps) {
    const p: Point = [w[0] + a, w[1] + b];
    if (p[0] * p[0] + p[1] * p[1] !== r2) return p;
  }
  return [w[0] + 1, w[1] + 1];
}

/** rightAngleCheck tests by slopes whether PA ⊥ PB: the slopes multiply to −1, or one side is vertical and the other horizontal. */
function rightAngleCheck(a: Point, b: Point, p: Point): Text {
  const [u, w] = [
    [a[0] - p[0], a[1] - p[1]],
    [b[0] - p[0], b[1] - p[1]],
  ] as const;
  if (u[0] !== 0 && w[0] !== 0) {
    const [m1, m2] = [Q.of(u[1], u[0]), Q.of(w[1], w[0])];
    const right = m1.mul(m2).eq(Q.of(-1));
    return t(
      `The slopes of $PA$ and $PB$ are $${slopeTex(p, a)}$ and $${slopeTex(p, b)}$, and $${slopeProduct(m1, m2)}$, ${right ? "so $PA \\perp PB$" : "not $-1$, so $PA$ and $PB$ are not perpendicular"}.`,
      `$PA$ 和 $PB$ 的斜率是 $${slopeTex(p, a)}$ 和 $${slopeTex(p, b)}$，且 $${slopeProduct(m1, m2)}$，${right ? "所以 $PA \\perp PB$" : "不是 $-1$，所以 $PA$ 与 $PB$ 不垂直"}。`,
    );
  }
  if (u[0] === 0 && w[0] === 0)
    return t("$PA$ and $PB$ lie on one vertical line, so they make no angle at all.", "$PA$ 和 $PB$ 在同一条竖直线上，根本不成角。");
  const [vert, other, slope] = u[0] === 0 ? ["PA", "PB", w[1]] : ["PB", "PA", u[1]];
  return t(
    `$${vert}$ is vertical, and $${other}$ ${slope === 0 ? "is horizontal, so they are perpendicular" : "is not horizontal, so they are not perpendicular"}.`,
    `$${vert}$ 是竖直的，而 $${other}$ ${slope === 0 ? "是水平的，所以二者垂直" : "不是水平的，所以二者不垂直"}。`,
  );
}

/** thalesFigure draws the circle with diameter AB about c, the point P and the sides PA and PB. */
function thalesFigure(c: Point, r2: number, a: Point, b: Point, p: Point, en: string, zh: string): Figure {
  return graphFigure(
    viewAround(c[0], c[1], Math.sqrt(r2)),
    [
      circleMark(c, Math.sqrt(r2)),
      { kind: "segment", a, b, tone: "action" },
      { kind: "segment", a: p, b: a, tone: "result" },
      { kind: "segment", a: p, b, tone: "result" },
      { kind: "point", at: a, label: "A", dir: away(a, c) },
      { kind: "point", at: b, label: "B", dir: away(b, c) },
      { kind: "point", at: c, label: "M", dir: away(c, p) },
      { kind: "point", at: p, label: "P", dir: away(p, c), tone: "result" },
    ],
    en,
    zh,
  );
}

/** thalesTheoremInTheCoordinatePlane uses Thales' theorem and its converse with coordinates. */
export const thalesTheoremInTheCoordinatePlane: TopicDef = {
  id: "thales-theorem-in-the-coordinate-plane",
  title: t("Thales' Theorem in the Coordinate Plane", "坐标平面中的泰勒斯定理"),
  summary: t(
    "Use Thales' theorem and its converse: an angle subtending a diameter is a right angle, and a right triangle's hypotenuse is a diameter of its circumcircle.",
    "运用泰勒斯定理及其逆定理：直径所对的圆周角是直角，直角三角形的斜边是其外接圆的直径。",
  ),
  prerequisites: ["perpendicular-bisectors-of-diameters-in-the-coordinate-plane", "thales-theorem"],
  encompasses: [
    { topic: "thales-theorem", weight: 0.4 },
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "midpoints-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.4"],
  intro: t(
    `**Thales' theorem** says that an angle drawn from the ends of a diameter to any other point of the circle is a right angle. Here is why. If $M$ is the center, then $MA$, $MB$ and $MP$ are radii, so the triangles $AMP$ and $BMP$ are isosceles: the angles at $A$ and $P$ in one are equal, say $\\alpha$, and the angles at $B$ and $P$ in the other are equal, say $\\beta$. The angles of triangle $APB$ are then $\\alpha$, $\\beta$ and $\\alpha + \\beta$, which add to $180^\\circ$, so $\\angle APB = \\alpha + \\beta = 90^\\circ$. The converse holds too: a right angle $APB$ puts $P$ on the circle with diameter $AB$.

On the coordinate plane both sides of the theorem can be measured. Take $A(-1, -3)$ and $B(5, 5)$, with midpoint $M(2, 1)$, and $P(7, 1)$. Then $MA^{2} = 3^{2} + 4^{2} = 25$ and $MP^{2} = 5^{2} + 0^{2} = 25$, so $P$ is on the circle with diameter $AB$. And the slopes of $PA$ and $PB$ are $\\frac{-3 - 1}{-1 - 7} = \\frac{1}{2}$ and $\\frac{5 - 1}{5 - 7} = -2$, whose product is $-1$: the angle at $P$ is right.

{{figure 0}}

In this lesson we test whether an angle is right, write the circle through a right triangle, and find a missing coordinate of the right-angle vertex.`,
    `**泰勒斯定理**：从直径两端连到圆上另外任意一点所成的角是直角。理由如下。设 $M$ 是圆心，则 $MA$、$MB$、$MP$ 都是半径，所以三角形 $AMP$ 和 $BMP$ 都是等腰三角形：前一个中 $A$、$P$ 处的角相等，记为 $\\alpha$；后一个中 $B$、$P$ 处的角相等，记为 $\\beta$。于是三角形 $APB$ 的三个角是 $\\alpha$、$\\beta$ 和 $\\alpha + \\beta$，和为 $180^\\circ$，所以 $\\angle APB = \\alpha + \\beta = 90^\\circ$。逆定理也成立：若 $\\angle APB$ 是直角，则 $P$ 在以 $AB$ 为直径的圆上。

在坐标平面上，定理的两边都可以计算。取 $A(-1, -3)$、$B(5, 5)$，中点 $M(2, 1)$，以及 $P(7, 1)$。$MA^{2} = 3^{2} + 4^{2} = 25$，$MP^{2} = 5^{2} + 0^{2} = 25$，所以 $P$ 在以 $AB$ 为直径的圆上。$PA$ 和 $PB$ 的斜率是 $\\frac{-3 - 1}{-1 - 7} = \\frac{1}{2}$ 和 $\\frac{5 - 1}{5 - 7} = -2$，乘积为 $-1$：$P$ 处的角是直角。

{{figure 0}}

这节课我们判断一个角是否为直角，写出过直角三角形三个顶点的圆，并求直角顶点的未知坐标。`,
  ),
  introFigures: [
    thalesFigure(
      [2, 1],
      25,
      [-1, -3],
      [5, 5],
      [7, 1],
      "A(−1, −3) and B(5, 5) are the ends of a diameter of the circle with center M(2, 1); P(7, 1) is on the circle, and PA ⊥ PB.",
      "A(−1, −3) 和 B(5, 5) 是圆心 M(2, 1) 的圆的直径端点；P(7, 1) 在圆上，PA ⊥ PB。",
    ),
  ],
  knowledgePoints: [
    {
      id: "right-angle-or-not",
      figure: planeCircleDrawings["right-angle-or-not"],
      title: t("Is the angle a right angle?", "这个角是直角吗？"),
      explanation: t(
        `**Thales' theorem**: if $AB$ is a diameter of a circle and $P$ is any other point of the circle, then $\\angle APB = 90^\\circ$. The converse holds too: if $\\angle APB = 90^\\circ$, then $P$ lies on the circle with diameter $AB$.

So to test whether $\\angle APB$ is a right angle, test whether $P$ is on the circle with diameter $AB$: is its distance from the midpoint $M$ of $AB$ equal to $MA$? For $A(-5, 0)$, $B(5, 0)$ and $P(3, 4)$: $M = (0, 0)$, $MA^{2} = 25$ and $MP^{2} = 9 + 16 = 25$, so $\\angle APB = 90^\\circ$. (Check: the slopes of $PA$ and $PB$ are $\\frac{1}{2}$ and $-2$.)

> **Watch out.** Measure from the midpoint $M$ of $AB$, the center of that circle, and compare $MP^{2}$ with $MA^{2}$ exactly. A point one step away, such as $(4, 4)$ with $MP^{2} = 32$, looks close to the circle but is not on it, so its angle is not right.`,
        `**泰勒斯定理**：若 $AB$ 是圆的直径，$P$ 是圆上另外任意一点，则 $\\angle APB = 90^\\circ$。逆定理也成立：若 $\\angle APB = 90^\\circ$，则 $P$ 在以 $AB$ 为直径的圆上。

所以要判断 $\\angle APB$ 是否为直角，就判断 $P$ 是否在以 $AB$ 为直径的圆上：它到 $AB$ 的中点 $M$ 的距离是否等于 $MA$？对 $A(-5, 0)$、$B(5, 0)$、$P(3, 4)$：$M = (0, 0)$，$MA^{2} = 25$，$MP^{2} = 9 + 16 = 25$，所以 $\\angle APB = 90^\\circ$。（检验：$PA$ 和 $PB$ 的斜率是 $\\frac{1}{2}$ 和 $-2$。）

> **注意。** 要从 $AB$ 的中点 $M$（这个圆的圆心）量起，并且精确比较 $MP^{2}$ 与 $MA^{2}$。差一格的点，例如 $(4, 4)$，$MP^{2} = 32$，看上去离圆很近，却不在圆上，所以它所成的角不是直角。`,
      ),
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const pts = latticePoints(r2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        const v = rng.pick(pts);
        const others = pts.filter((p) => !(p[0] === v[0] && p[1] === v[1]) && !(p[0] === -v[0] && p[1] === -v[1]));
        const w0 = rng.pick(others);
        const on = rng.bool();
        const w = on ? w0 : pickNear(rng, w0, r2);
        const a: Point = [h + v[0], k + v[1]];
        const b: Point = [h - v[0], k - v[1]];
        const p: Point = [h + w[0], k + w[1]];
        const mp2 = w[0] * w[0] + w[1] * w[1];
        const M: Point = [h, k];
        const s1 = stepLabel(1, "The center of the circle on AB", "以 AB 为直径的圆的圆心");
        const s2 = stepLabel(2, "Compare the squared distances", "比较距离的平方");
        const check = rightAngleCheck(a, b, p);
        return {
          ...choiceProblem({
            prompt: t(
              `Given $A${pointLatex(a)}$, $B${pointLatex(b)}$ and $P${pointLatex(p)}$, is $\\angle APB$ a right angle?`,
              `已知 $A${pointLatex(a)}$、$B${pointLatex(b)}$、$P${pointLatex(p)}$，$\\angle APB$ 是直角吗？`,
            ),
            options: yesNo,
            correct: on ? 0 : 1,
            solution: t(
              `${s1.en} By Thales' theorem and its converse, $\\angle APB$ is right exactly when $P$ is on the circle with diameter $AB$. Its center is the midpoint of $AB$:${steps(`M = \\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}`)}${s2.en} $P$ is on that circle when $MP = MA$:${steps(`MA^{2} = ${squaredDistance(M, a)}`, `MP^{2} = ${squaredDistance(M, p)}`)}${on ? "They are equal, so $P$ lies on the circle with diameter $AB$, and by Thales' theorem $\\angle APB$ is a right angle." : `Since $${mp2} \\ne ${r2}$, $P$ is not on the circle with diameter $AB$, so by the converse of Thales' theorem $\\angle APB$ is not a right angle.`}

{{figure 0}}

**Check.** ${check.en}`,
              `${s1["zh-CN"]}由泰勒斯定理及其逆定理，$\\angle APB$ 是直角当且仅当 $P$ 在以 $AB$ 为直径的圆上。这个圆的圆心是 $AB$ 的中点：${steps(`M = \\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex(M)}`)}${s2["zh-CN"]}$MP = MA$ 时 $P$ 在这个圆上：${steps(`MA^{2} = ${squaredDistance(M, a)}`, `MP^{2} = ${squaredDistance(M, p)}`)}${on ? "二者相等，所以 $P$ 在以 $AB$ 为直径的圆上，由泰勒斯定理，$\\angle APB$ 是直角。" : `因为 $${mp2} \\ne ${r2}$，$P$ 不在以 $AB$ 为直径的圆上，由泰勒斯定理的逆定理，$\\angle APB$ 不是直角。`}

{{figure 0}}

**检验。** ${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            thalesFigure(
              M,
              r2,
              a,
              b,
              p,
              `The circle with diameter AB has center M${plainPt(M)}; P${plainPt(p)} is ${on ? "on it, so angle APB is right" : "not on it, so angle APB is not right"}.`,
              `以 AB 为直径的圆的圆心是 M${plainPt(M)}；P${plainPt(p)} ${on ? "在圆上，所以 ∠APB 是直角" : "不在圆上，所以 ∠APB 不是直角"}。`,
            ),
          ],
        };
      },
    },
    {
      id: "circumcircle-of-a-right-triangle",
      figure: planeCircleDrawings["circumcircle-of-a-right-triangle"],
      title: t("The circle through a right triangle", "直角三角形的外接圆"),
      explanation: t(
        `By the converse of Thales' theorem, the circle through the three vertices of a right triangle has the **hypotenuse as a diameter**. Its center is the midpoint of the hypotenuse, and $r^{2}$ is the squared distance from the center to any vertex.

To find the hypotenuse, compare the squared side lengths: the longest side is the hypotenuse, and its square equals the sum of the other two. For $A(1, 1)$, $B(5, 3)$ and $C(3, 7)$: $AB^{2} = 20$, $BC^{2} = 20$ and $AC^{2} = 40 = 20 + 20$, so $AC$ is the hypotenuse. The center is its midpoint $(2, 4)$, and $r^{2} = (1 - 2)^{2} + (1 - 4)^{2} = 10$, so the circle is $(x - 2)^{2} + (y - 4)^{2} = 10$.

> **Watch out.** The hypotenuse is the diameter, twice the radius, so $r^{2}$ is a quarter of $AC^{2}$: $10$, not $40$. The center is the midpoint of the hypotenuse, not the right-angle vertex $B$. And with center $(2, 4)$ the equation has $(x - 2)$ and $(y - 4)$, the signs flipped.`,
        `由泰勒斯定理的逆定理，过直角三角形三个顶点的圆以**斜边为直径**。圆心是斜边的中点，$r^{2}$ 是圆心到任一顶点距离的平方。

要找斜边，比较三边长的平方：最长的边是斜边，它的平方等于另两边平方之和。例如 $A(1, 1)$、$B(5, 3)$、$C(3, 7)$：$AB^{2} = 20$，$BC^{2} = 20$，$AC^{2} = 40 = 20 + 20$，所以 $AC$ 是斜边。圆心是它的中点 $(2, 4)$，$r^{2} = (1 - 2)^{2} + (1 - 4)^{2} = 10$，所以圆的方程是 $(x - 2)^{2} + (y - 4)^{2} = 10$。

> **注意。** 斜边是直径，是半径的两倍，所以 $r^{2}$ 是 $AC^{2}$ 的四分之一：是 $10$，不是 $40$。圆心是斜边的中点，不是直角顶点 $B$。圆心为 $(2, 4)$ 时方程里是 $(x - 2)$ 和 $(y - 4)$，符号相反。`,
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const pts = latticePoints(r2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        const v = rng.pick(pts);
        const others = pts.filter((p) => !(p[0] === v[0] && p[1] === v[1]) && !(p[0] === -v[0] && p[1] === -v[1]));
        const w = rng.pick(others);
        const ends: [Point, Point] = [
          [h + v[0], k + v[1]],
          [h - v[0], k - v[1]],
        ];
        const right: Point = [h + w[0], k + w[1]];
        const order = rng.shuffle([0, 1, 2]);
        const verts = order.map((i) => (i === 2 ? right : ends[i]!));
        const names = ["P", "Q", "R"];
        const nameOf = (i: number) => names[order.indexOf(i)]!;
        const sq = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
        const pairs: [number, number][] = [
          [0, 1],
          [1, 2],
          [0, 2],
        ];
        const sides = pairs.map(([i, j]) => `${names[i]}${names[j]}^{2} = ${sq(verts[i]!, verts[j]!)}`);
        const [e0, e1] = [nameOf(0), nameOf(1)].sort() as [string, string];
        const [u0, u1] = e0 === nameOf(0) ? ends : [ends[1], ends[0]];
        const hyp = `${e0}${e1}`;
        const answer = circleEq(h, k, r2);
        const C: Point = [h, k];
        const s1 = stepLabel(1, "Find the hypotenuse", "找斜边");
        const s2 = stepLabel(2, "The center", "圆心");
        const s3 = stepLabel(3, "The squared radius", "半径的平方");
        return {
          ...equationProblem({
            prompt: t(
              `Triangle $PQR$ has vertices $P${pointLatex(verts[0]!)}$, $Q${pointLatex(verts[1]!)}$ and $R${pointLatex(verts[2]!)}$, and it is a right triangle. Write the equation of the circle that passes through $P$, $Q$ and $R$.`,
              `直角三角形 $PQR$ 的顶点是 $P${pointLatex(verts[0]!)}$、$Q${pointLatex(verts[1]!)}$、$R${pointLatex(verts[2]!)}$。写出过 $P$、$Q$、$R$ 三点的圆的方程。`,
            ),
            answer,
            wrong: [circleEq(h, k, 4 * r2), circleEq(right[0], right[1], r2), circleEq(-h, -k, r2), circleEq(right[0], right[1], 4 * r2)],
            solution: t(
              `${s1.en} The squared side lengths are${steps(sides.join(", \\quad "))}The largest, $${hyp}^{2} = ${4 * r2}$, is the sum of the other two, so $${hyp}$ is the hypotenuse and the right angle is at $${nameOf(2)}$.

${s2.en} By the converse of Thales' theorem the hypotenuse is a diameter, so the center is its midpoint:${steps(`\\left(\\frac{${u0[0]} + ${paren(u1[0])}}{2}, \\frac{${u0[1]} + ${paren(u1[1])}}{2}\\right) = ${pointLatex(C)}`)}${s3.en} The radius is half the hypotenuse, so $r^{2}$ is a quarter of $${hyp}^{2}$:${steps(`r^{2} = \\frac{${4 * r2}}{4} = ${r2}`, answer)}{{figure 0}}

**Check.** The circle must also pass through the right-angle vertex $${nameOf(2)}${pointLatex(right)}$: $${substituted(h, k, right)}$, which is $r^{2}$.`,
              `${s1["zh-CN"]}三边长的平方是${steps(sides.join(", \\quad "))}最大的 $${hyp}^{2} = ${4 * r2}$ 等于另两个之和，所以 $${hyp}$ 是斜边，直角在 $${nameOf(2)}$ 处。

${s2["zh-CN"]}由泰勒斯定理的逆定理，斜边是直径，所以圆心是它的中点：${steps(`\\left(\\frac{${u0[0]} + ${paren(u1[0])}}{2}, \\frac{${u0[1]} + ${paren(u1[1])}}{2}\\right) = ${pointLatex(C)}`)}${s3["zh-CN"]}半径是斜边的一半，所以 $r^{2}$ 是 $${hyp}^{2}$ 的四分之一：${steps(`r^{2} = \\frac{${4 * r2}}{4} = ${r2}`, answer)}{{figure 0}}

**检验。** 圆还必须经过直角顶点 $${nameOf(2)}${pointLatex(right)}$：$${substituted(h, k, right)}$，正是 $r^{2}$。`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround(h, k, Math.sqrt(r2)),
              [
                circleMark(C, Math.sqrt(r2)),
                { kind: "segment", a: ends[0], b: ends[1], tone: "action" },
                { kind: "segment", a: ends[0], b: right },
                { kind: "segment", a: ends[1], b: right },
                ...verts.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i]!, dir: away(p, C) })),
                { kind: "point", at: C, label: plainPt(C), dir: away(C, right), tone: "result" },
              ],
              `The hypotenuse ${hyp} is a diameter of the circle through the vertices, with center ${plainPt(C)}.`,
              `斜边 ${hyp} 是过三个顶点的圆的直径，圆心为 ${plainPt(C)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-coordinate",
      figure: planeCircleDrawings["missing-coordinate"],
      title: t("A missing coordinate", "求未知坐标"),
      explanation: t(
        `If $\\angle APB = 90^\\circ$, then $P$ lies on the circle with diameter $AB$. Write that circle's equation and substitute the known coordinate of $P$.

For $A(-4, 1)$, $B(6, 1)$ and $P(5, y)$ with $y > 1$: the circle has center $(1, 1)$ and $r^{2} = 25$, so

$$(5 - 1)^{2} + (y - 1)^{2} = 25 \\;\\Rightarrow\\; (y - 1)^{2} = 9 \\;\\Rightarrow\\; y = 4.$$

(The other solution, $y = -2$, is below $AB$.)

> **Watch out.** $(y - 1)^{2} = 9$ has two solutions, $y = 4$ and $y = -2$; keep the one on the side the question names. Add the center's $1$ back: $y - 1 = 3$ gives $y = 4$, not $3$. And the $4$ in $(5 - 1)^{2}$ is how far $P$ is across from the center, not its height above $AB$.`,
        `若 $\\angle APB = 90^\\circ$，则 $P$ 在以 $AB$ 为直径的圆上。写出这个圆的方程，再代入 $P$ 的已知坐标。

对 $A(-4, 1)$、$B(6, 1)$ 和 $P(5, y)$，其中 $y > 1$：圆心是 $(1, 1)$，$r^{2} = 25$，所以

$$(5 - 1)^{2} + (y - 1)^{2} = 25 \\;\\Rightarrow\\; (y - 1)^{2} = 9 \\;\\Rightarrow\\; y = 4.$$

（另一个解 $y = -2$ 在 $AB$ 下方。）

> **注意。** $(y - 1)^{2} = 9$ 有两个解 $y = 4$ 和 $y = -2$；保留题目指定那一侧的解。要把圆心的 $1$ 加回去：$y - 1 = 3$ 得 $y = 4$，不是 $3$。$(5 - 1)^{2}$ 中的 $4$ 是 $P$ 与圆心的水平距离，不是它在 $AB$ 上方的高度。`,
      ),
      generate(rng) {
        const r = rng.pick(integerRadii);
        const [a0, b0] = rng.pick(offAxis(r * r));
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const vertical = rng.bool();
        const a = a0;
        const b = Math.abs(b0);
        const M: Point = [h, k];
        const s1 = stepLabel(1, "The circle on AB", "以 AB 为直径的圆");
        const s2 = stepLabel(2, "Substitute the known coordinate", "代入已知坐标");
        const s3 = stepLabel(3, "Take square roots", "开平方");
        const figure = (A: Point, B: Point, P: Point, en: string, zh: string) => thalesFigure(M, r * r, A, B, P, en, zh);
        if (!vertical) {
          const A: Point = [h - r, k];
          const B: Point = [h + r, k];
          const x = h + a;
          const y = k + b;
          const P: Point = [x, y];
          const check = rightAngleCheck(A, B, P);
          return {
            ...numberProblem({
              prompt: t(
                `Given $A${pointLatex(A)}$ and $B${pointLatex(B)}$, the point $P(${x}, y)$ lies above $AB$ and $\\angle APB = 90^\\circ$. Find $y$.`,
                `已知 $A${pointLatex(A)}$、$B${pointLatex(B)}$，点 $P(${x}, y)$ 在 $AB$ 上方，且 $\\angle APB = 90^\\circ$。求 $y$。`,
              ),
              answer: y,
              solveFor: "y",
              wrong: [k - b, b, k + Math.abs(a)],
              solution: t(
                `${s1.en} By the converse of Thales' theorem $P$ lies on the circle with diameter $AB$. Its center is the midpoint $${pointLatex(M)}$ and its radius is half of $AB = ${2 * r}$, so $r = ${r}$:${steps(circleEq(h, k, r * r))}${s2.en} Put $x = ${x}$ into the circle:${steps(`(${x} - ${paren(h)})^{2} + ${sqTerm("y", k)} = ${r * r}`, `${paren(a)}^{2} + ${sqTerm("y", k)} = ${r * r}`, `${sqTerm("y", k)} = ${r * r} - ${a * a} = ${b * b}`)}${s3.en} So $y - ${paren(k)} = \\pm ${b}$, which gives $y = ${y}$ or $y = ${k - b}$. $P$ is above $AB$, where $y > ${k}$, so $y = ${y}$.

{{figure 0}}

**Check.** ${check.en}`,
                `${s1["zh-CN"]}由泰勒斯定理的逆定理，$P$ 在以 $AB$ 为直径的圆上。圆心是中点 $${pointLatex(M)}$，半径是 $AB = ${2 * r}$ 的一半，$r = ${r}$：${steps(circleEq(h, k, r * r))}${s2["zh-CN"]}把 $x = ${x}$ 代入圆的方程：${steps(`(${x} - ${paren(h)})^{2} + ${sqTerm("y", k)} = ${r * r}`, `${paren(a)}^{2} + ${sqTerm("y", k)} = ${r * r}`, `${sqTerm("y", k)} = ${r * r} - ${a * a} = ${b * b}`)}${s3["zh-CN"]}所以 $y - ${paren(k)} = \\pm ${b}$，得 $y = ${y}$ 或 $y = ${k - b}$。$P$ 在 $AB$ 上方，$y > ${k}$，所以 $y = ${y}$。

{{figure 0}}

**检验。** ${check["zh-CN"]}`,
              ),
            }),
            solutionFigures: [
              figure(
                A,
                B,
                P,
                `P${plainPt(P)} is on the circle with diameter AB and center ${plainPt(M)}, above AB.`,
                `P${plainPt(P)} 在以 AB 为直径、圆心为 ${plainPt(M)} 的圆上，位于 AB 上方。`,
              ),
            ],
          };
        }
        const A: Point = [h, k - r];
        const B: Point = [h, k + r];
        const y = k + a;
        const x = h + b;
        const P: Point = [x, y];
        const check = rightAngleCheck(A, B, P);
        return {
          ...numberProblem({
            prompt: t(
              `Given $A${pointLatex(A)}$ and $B${pointLatex(B)}$, the point $P(x, ${y})$ lies to the right of $AB$ and $\\angle APB = 90^\\circ$. Find $x$.`,
              `已知 $A${pointLatex(A)}$、$B${pointLatex(B)}$，点 $P(x, ${y})$ 在 $AB$ 右侧，且 $\\angle APB = 90^\\circ$。求 $x$。`,
            ),
            answer: x,
            solveFor: "x",
            wrong: [h - b, b, h + Math.abs(a)],
            solution: t(
              `${s1.en} By the converse of Thales' theorem $P$ lies on the circle with diameter $AB$. Its center is the midpoint $${pointLatex(M)}$ and its radius is half of $AB = ${2 * r}$, so $r = ${r}$:${steps(circleEq(h, k, r * r))}${s2.en} Put $y = ${y}$ into the circle:${steps(`${sqTerm("x", h)} + (${y} - ${paren(k)})^{2} = ${r * r}`, `${sqTerm("x", h)} + ${paren(a)}^{2} = ${r * r}`, `${sqTerm("x", h)} = ${r * r} - ${a * a} = ${b * b}`)}${s3.en} So $x - ${paren(h)} = \\pm ${b}$, which gives $x = ${x}$ or $x = ${h - b}$. $P$ is to the right of $AB$, where $x > ${h}$, so $x = ${x}$.

{{figure 0}}

**Check.** ${check.en}`,
              `${s1["zh-CN"]}由泰勒斯定理的逆定理，$P$ 在以 $AB$ 为直径的圆上。圆心是中点 $${pointLatex(M)}$，半径是 $AB = ${2 * r}$ 的一半，$r = ${r}$：${steps(circleEq(h, k, r * r))}${s2["zh-CN"]}把 $y = ${y}$ 代入圆的方程：${steps(`${sqTerm("x", h)} + (${y} - ${paren(k)})^{2} = ${r * r}`, `${sqTerm("x", h)} + ${paren(a)}^{2} = ${r * r}`, `${sqTerm("x", h)} = ${r * r} - ${a * a} = ${b * b}`)}${s3["zh-CN"]}所以 $x - ${paren(h)} = \\pm ${b}$，得 $x = ${x}$ 或 $x = ${h - b}$。$P$ 在 $AB$ 右侧，$x > ${h}$，所以 $x = ${x}$。

{{figure 0}}

**检验。** ${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            figure(
              A,
              B,
              P,
              `P${plainPt(P)} is on the circle with diameter AB and center ${plainPt(M)}, to the right of AB.`,
              `P${plainPt(P)} 在以 AB 为直径、圆心为 ${plainPt(M)} 的圆上，位于 AB 右侧。`,
            ),
          ],
        };
      },
    },
  ],
};

/** coordinateCircleTopics are the topics on circles in the coordinate plane, in teaching order. */
export const coordinateCircleTopics: readonly TopicDef[] = [
  circlesInTheCoordinatePlane,
  equationsOfCirclesCenteredAtTheOrigin,
  equationsOfCircles,
  determiningCirclePropertiesByCompletingTheSquare,
  calculatingCircleIntercepts,
  intersectionsOfCirclesWithLines,
  equationsOfTangentLinesToCircles,
  perpendicularBisectorsOfDiametersInTheCoordinatePlane,
  perpendicularBisectorsOfChords,
  perpendicularBisectorsOfChordsInTheCoordinatePlane,
  thalesTheoremInTheCoordinatePlane,
];
