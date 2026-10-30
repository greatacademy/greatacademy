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

// ---------------------------------------------------------------------------
// Circles in the coordinate plane
// ---------------------------------------------------------------------------

export const circlesInTheCoordinatePlane: TopicDef = {
  id: "circles-in-the-coordinate-plane",
  title: t("Circles in the Coordinate Plane", "坐标平面中的圆"),
  summary: t(
    "Read the center and radius of a circle from its graph, find a radius with the Pythagorean theorem, and locate points inside, on or outside a circle.",
    "从图象读出圆心和半径，用勾股定理求半径，并判断点在圆内、圆上还是圆外。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem", "the-coordinate-plane"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.4 },
    { topic: "circles", weight: 0.3 },
    { topic: "the-coordinate-plane", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "center-and-radius-from-a-graph",
      title: t("Center and radius from a graph", "从图象读圆心和半径"),
      explanation: t(
        "A circle in the coordinate plane is fixed by its **center** $(h, k)$ and its **radius** $r$.\n\n- The center is midway between the leftmost and rightmost points of the circle, and midway between its lowest and highest points.\n- The radius is the distance from the center to any point of the circle. Count it along a grid line: from the center straight right to the circle, for example.\n\nIf a circle's leftmost point is $(-1, 2)$ and its rightmost point is $(7, 2)$, its center is $(3, 2)$ and its radius is $7 - 3 = 4$.",
        "坐标平面中的圆由**圆心** $(h, k)$ 和**半径** $r$ 确定。\n\n- 圆心位于圆的最左点和最右点的正中间，也位于最低点和最高点的正中间。\n- 半径是圆心到圆上任意一点的距离。可以沿网格线数，例如从圆心向右数到圆上。\n\n若一个圆的最左点是 $(-1, 2)$，最右点是 $(7, 2)$，则圆心是 $(3, 2)$，半径是 $7 - 3 = 4$。",
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
                `The leftmost and rightmost points of the circle are $${pointLatex([h - r, k])}$ and $${pointLatex([h + r, k])}$, so the center is midway between them, at $${pointLatex([h, k])}$.`,
                `圆的最左点和最右点分别是 $${pointLatex([h - r, k])}$ 和 $${pointLatex([h + r, k])}$，圆心在它们的正中间，即 $${pointLatex([h, k])}$。`,
              ),
            }),
            figure,
          };
        return {
          ...numberProblem({
            prompt: t("The center of the circle is marked. What is the radius of the circle?", "图中标出了圆心。这个圆的半径是多少？"),
            answer: r,
            wrong: [2 * r, r * r, r + 1],
            solution: t(
              `The center is $${pointLatex([h, k])}$, and the point of the circle straight to its right is $${pointLatex([h + r, k])}$. The radius is $${h + r} - ${paren(h)} = ${r}$.`,
              `圆心是 $${pointLatex([h, k])}$，圆上在它正右方的点是 $${pointLatex([h + r, k])}$。半径是 $${h + r} - ${paren(h)} = ${r}$。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "radius-from-the-center-and-a-point",
      title: t("The radius from the center and a point", "由圆心和圆上一点求半径"),
      explanation: t(
        "The radius is the distance from the center to a point of the circle. Draw a right triangle whose legs are the horizontal and vertical changes between the two points; the radius is its hypotenuse.\n\nA circle with center $(1, -2)$ passes through $(4, 4)$. The legs are $4 - 1 = 3$ and $4 - (-2) = 6$, so by the Pythagorean theorem\n\n$$r^{2} = 3^{2} + 6^{2} = 45, \\qquad r = \\sqrt{45} = 3\\sqrt{5}.$$",
        "半径是圆心到圆上一点的距离。以两点之间的水平变化量和竖直变化量为直角边画一个直角三角形，半径就是它的斜边。\n\n圆心为 $(1, -2)$ 的圆经过 $(4, 4)$。两条直角边是 $4 - 1 = 3$ 和 $4 - (-2) = 6$，由勾股定理\n\n$$r^{2} = 3^{2} + 6^{2} = 45, \\qquad r = \\sqrt{45} = 3\\sqrt{5}.$$",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const [h, k] = [rng.int(-8, 8), rng.int(-8, 8)];
        const [dx, dy] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const s = Math.abs(dx) + Math.abs(dy);
        return radicalProblem({
          prompt: t(
            `A circle has center $${pointLatex([h, k])}$ and passes through $${pointLatex(p)}$. Find its radius in simplest radical form.`,
            `一个圆的圆心是 $${pointLatex([h, k])}$，且经过点 $${pointLatex(p)}$。求它的半径（化为最简根式）。`,
          ),
          answer: rootAnswer(r2),
          wrong: [String(r2), String(s), rootTex(Math.abs(dx * dx - dy * dy) || 1)],
          solution: t(
            `The legs of the right triangle are the changes in $x$ and $y$:${steps(`r^{2} = ${squaredDistance([h, k], p)}`, `r = \\sqrt{${r2}} = ${rootTex(r2)}`)}`,
            `直角三角形的两条直角边是 $x$ 和 $y$ 的变化量：${steps(`r^{2} = ${squaredDistance([h, k], p)}`, `r = \\sqrt{${r2}} = ${rootTex(r2)}`)}`,
          ),
        });
      },
    },
    {
      id: "inside-on-or-outside",
      title: t("Inside, on or outside", "圆内、圆上还是圆外"),
      explanation: t(
        "To locate a point $P$, compare its distance from the center with the radius. Comparing the **squares** avoids square roots: with $d^{2} = (\\Delta x)^{2} + (\\Delta y)^{2}$,\n\n- $d^{2} < r^{2}$: $P$ is inside the circle;\n- $d^{2} = r^{2}$: $P$ is on the circle;\n- $d^{2} > r^{2}$: $P$ is outside the circle.\n\nFor the circle with center $(2, 1)$ and radius $5$, the point $(6, 4)$ has $d^{2} = 4^{2} + 3^{2} = 25 = 5^{2}$: it is on the circle. The point $(7, 3)$ has $d^{2} = 5^{2} + 2^{2} = 29 > 25$: it is outside.",
        "要判断点 $P$ 的位置，比较它到圆心的距离与半径。比较它们的**平方**可以避免开方：设 $d^{2} = (\\Delta x)^{2} + (\\Delta y)^{2}$，\n\n- $d^{2} < r^{2}$：$P$ 在圆内；\n- $d^{2} = r^{2}$：$P$ 在圆上；\n- $d^{2} > r^{2}$：$P$ 在圆外。\n\n对圆心为 $(2, 1)$、半径为 $5$ 的圆，点 $(6, 4)$ 满足 $d^{2} = 4^{2} + 3^{2} = 25 = 5^{2}$，在圆上；点 $(7, 3)$ 满足 $d^{2} = 5^{2} + 2^{2} = 29 > 25$，在圆外。",
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
        const d2 = dx * dx + dy * dy;
        const rel = ["<", "=", ">"][kind]!;
        return choiceProblem({
          prompt: t(
            `A circle has center $${pointLatex([h, k])}$ and radius $${r}$. Where is the point $${pointLatex(p)}$?`,
            `一个圆的圆心是 $${pointLatex([h, k])}$，半径是 $${r}$。点 $${pointLatex(p)}$ 在哪里？`,
          ),
          options: insideOnOutside,
          correct: kind,
          solution: t(
            `The squared distance from the center is${steps(`d^{2} = ${squaredDistance([h, k], p)}`)}Since $${d2} ${rel} ${r}^{2} = ${r * r}$, the point is ${insideOnOutside[kind]!.en.toLowerCase()}.`,
            `点到圆心距离的平方是${steps(`d^{2} = ${squaredDistance([h, k], p)}`)}因为 $${d2} ${rel} ${r}^{2} = ${r * r}$，所以该点${insideOnOutside[kind]!["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Equations of circles
// ---------------------------------------------------------------------------

export const equationsOfCirclesCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-circles-centered-at-the-origin",
  title: t("Equations of Circles Centered at the Origin", "圆心在原点的圆的方程"),
  summary: t(
    "Write and read the equation $x^{2} + y^{2} = r^{2}$ of a circle centered at the origin.",
    "写出并读懂圆心在原点的圆的方程 $x^{2} + y^{2} = r^{2}$。",
  ),
  prerequisites: ["circles-in-the-coordinate-plane"],
  encompasses: [{ topic: "circles-in-the-coordinate-plane", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "equation-from-the-radius",
      title: t("The equation from the radius", "由半径写方程"),
      explanation: t(
        "A point $(x, y)$ is on the circle with center $(0, 0)$ and radius $r$ exactly when its distance from the origin is $r$. By the Pythagorean theorem that distance is $\\sqrt{x^{2} + y^{2}}$, so squaring both sides gives the equation of the circle:\n\n$$x^{2} + y^{2} = r^{2}.$$\n\nThe right side is the **square** of the radius. The circle of radius $6$ is $x^{2} + y^{2} = 36$; the circle of radius $2\\sqrt{3}$ is $x^{2} + y^{2} = (2\\sqrt{3})^{2} = 12$.",
        "点 $(x, y)$ 在圆心为 $(0, 0)$、半径为 $r$ 的圆上，当且仅当它到原点的距离是 $r$。由勾股定理，这个距离是 $\\sqrt{x^{2} + y^{2}}$，两边平方得到圆的方程：\n\n$$x^{2} + y^{2} = r^{2}.$$\n\n右边是半径的**平方**。半径为 $6$ 的圆是 $x^{2} + y^{2} = 36$；半径为 $2\\sqrt{3}$ 的圆是 $x^{2} + y^{2} = (2\\sqrt{3})^{2} = 12$。",
      ),
      generate(rng) {
        const r = pickRadius(rng);
        const answer = circleEq(0, 0, r.r2);
        const [k, m] = simplifyRadical(r.r2);
        return equationProblem({
          prompt: t(
            `Write the equation of the circle with center $(0, 0)$ and radius $${r.tex}$.`,
            `写出圆心为 $(0, 0)$、半径为 $${r.tex}$ 的圆的方程。`,
          ),
          answer,
          wrong: [circleEq(0, 0, r.r ?? k * m), circleEq(0, 0, 2 * (r.r ?? k * m)), circleEq(0, 0, 2 * r.r2)],
          solution: t(
            `The right side is the square of the radius, $(${r.tex})^{2} = ${r.r2}$:${steps(answer)}`,
            `右边是半径的平方，$(${r.tex})^{2} = ${r.r2}$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "radius-from-the-equation",
      title: t("The radius from the equation", "由方程求半径"),
      explanation: t(
        "In $x^{2} + y^{2} = c$ the right side is $r^{2}$, so the radius is $r = \\sqrt{c}$. If $x^{2}$ and $y^{2}$ have a common coefficient, divide by it first:\n\n$$3x^{2} + 3y^{2} = 24 \\;\\Rightarrow\\; x^{2} + y^{2} = 8 \\;\\Rightarrow\\; r = \\sqrt{8} = 2\\sqrt{2}.$$",
        "在 $x^{2} + y^{2} = c$ 中右边是 $r^{2}$，所以半径 $r = \\sqrt{c}$。如果 $x^{2}$ 和 $y^{2}$ 有相同的系数，先除以它：\n\n$$3x^{2} + 3y^{2} = 24 \\;\\Rightarrow\\; x^{2} + y^{2} = 8 \\;\\Rightarrow\\; r = \\sqrt{8} = 2\\sqrt{2}.$$",
      ),
      generate(rng) {
        const c = rng.int(2, 150);
        const a = rng.bool(0.3) ? rng.int(2, 4) : 1;
        const eq = `${poly([a, "x^{2}"], [a, "y^{2}"])} = ${a * c}`;
        const divide = a === 1 ? "" : `${steps(`x^{2} + y^{2} = ${c}`)}`;
        return radicalProblem({
          prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
          answer: rootAnswer(c),
          wrong: [String(c), ...(c % 2 === 0 ? [String(c / 2)] : []), ...(a > 1 ? [rootTex(a * c)] : [])],
          solution: t(
            `${a === 1 ? "" : `Divide both sides by $${a}$:${divide}`}The right side is $r^{2}$, so $r = \\sqrt{${c}} = ${rootTex(c)}$.`,
            `${a === 1 ? "" : `两边同除以 $${a}$：${divide}`}右边是 $r^{2}$，所以 $r = \\sqrt{${c}} = ${rootTex(c)}$。`,
          ),
        });
      },
    },
    {
      id: "equation-through-a-point",
      title: t("The circle through a point", "过一点的圆"),
      explanation: t(
        "A circle centered at the origin that passes through $(a, b)$ has $r^{2} = a^{2} + b^{2}$: substitute the point into $x^{2} + y^{2} = r^{2}$. Through $(-3, 5)$:\n\n$$r^{2} = (-3)^{2} + 5^{2} = 34, \\qquad x^{2} + y^{2} = 34.$$\n\nThere is no need to find $r$ itself.",
        "圆心在原点且经过 $(a, b)$ 的圆满足 $r^{2} = a^{2} + b^{2}$：把这个点代入 $x^{2} + y^{2} = r^{2}$。经过 $(-3, 5)$ 时：\n\n$$r^{2} = (-3)^{2} + 5^{2} = 34, \\qquad x^{2} + y^{2} = 34.$$\n\n不必求出 $r$ 本身。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a === 0 ? rng.nonZero(-9, 9) : rng.int(-9, 9);
        const r2 = a * a + b * b;
        const answer = circleEq(0, 0, r2);
        return equationProblem({
          prompt: t(
            `Write the equation of the circle centered at the origin that passes through $${pointLatex([a, b])}$.`,
            `写出圆心在原点且经过点 $${pointLatex([a, b])}$ 的圆的方程。`,
          ),
          answer,
          wrong: [circleEq(0, 0, Math.abs(a) + Math.abs(b)), circleEq(0, 0, (a + b) * (a + b) || 1), circleEq(a, b, r2)],
          solution: t(
            `Substitute the point:${steps(`r^{2} = ${paren(a)}^{2} + ${paren(b)}^{2} = ${r2}`)}So the circle is $${answer}$.`,
            `代入这一点：${steps(`r^{2} = ${paren(a)}^{2} + ${paren(b)}^{2} = ${r2}`)}所以圆的方程是 $${answer}$。`,
          ),
        });
      },
    },
  ],
};

export const equationsOfCircles: TopicDef = {
  id: "equations-of-circles",
  title: t("Equations of Circles", "圆的方程"),
  summary: t(
    "Use the standard form $(x - h)^{2} + (y - k)^{2} = r^{2}$: read the center and radius, and write the equation from a center and a radius, a point or a diameter.",
    "使用标准方程 $(x - h)^{2} + (y - k)^{2} = r^{2}$：读出圆心和半径，并由圆心与半径、圆上一点或直径写出方程。",
  ),
  prerequisites: ["equations-of-circles-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-circles-centered-at-the-origin", weight: 0.7 }],
  xp: 16,
  standards: ["CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "center-and-radius-from-standard-form",
      title: t("Center and radius from the standard form", "由标准方程读圆心和半径"),
      explanation: t(
        "A point $(x, y)$ is on the circle with center $(h, k)$ and radius $r$ when its horizontal and vertical distances from the center, $x - h$ and $y - k$, satisfy the Pythagorean theorem. This gives the **standard form** of the equation of a circle:\n\n$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$\n\nThe center's coordinates appear with **minus signs**: $(x + 4)^{2} + (y - 1)^{2} = 18$ is $(x - (-4))^{2} + (y - 1)^{2} = 18$, so the center is $(-4, 1)$ and the radius is $\\sqrt{18} = 3\\sqrt{2}$.",
        "点 $(x, y)$ 在圆心为 $(h, k)$、半径为 $r$ 的圆上，当且仅当它到圆心的水平距离 $x - h$ 与竖直距离 $y - k$ 满足勾股定理。这就得到圆的**标准方程**：\n\n$$(x - h)^{2} + (y - k)^{2} = r^{2}.$$\n\n圆心坐标前是**减号**：$(x + 4)^{2} + (y - 1)^{2} = 18$ 就是 $(x - (-4))^{2} + (y - 1)^{2} = 18$，所以圆心是 $(-4, 1)$，半径是 $\\sqrt{18} = 3\\sqrt{2}$。",
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 9);
        const c = rng.int(1, 100);
        const eq = circleEq(h, k, c);
        if (rng.bool())
          return pointProblem({
            prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
            answer: [h, k],
            wrong: [
              [-h, -k],
              [h, -k],
              [-h, k],
              [k, h],
            ],
            solution: t(
              `Write the equation as $${sqTerm("x", h).replace(/\(x [+-] \d+\)/, `(x - ${paren(h)})`)} + ${sqTerm("y", k).replace(/\(y [+-] \d+\)/, `(y - ${paren(k)})`)} = ${c}$. The center is $${pointLatex([h, k])}$.`,
              `把方程写成 $${sqTerm("x", h).replace(/\(x [+-] \d+\)/, `(x - ${paren(h)})`)} + ${sqTerm("y", k).replace(/\(y [+-] \d+\)/, `(y - ${paren(k)})`)} = ${c}$。圆心是 $${pointLatex([h, k])}$。`,
            ),
          });
        return radicalProblem({
          prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
          answer: rootAnswer(c),
          wrong: [String(c), ...(c % 2 === 0 ? [String(c / 2)] : [])],
          solution: t(
            `The right side is $r^{2} = ${c}$, so $r = \\sqrt{${c}} = ${rootTex(c)}$.`,
            `右边是 $r^{2} = ${c}$，所以 $r = \\sqrt{${c}} = ${rootTex(c)}$。`,
          ),
        });
      },
    },
    {
      id: "equation-from-center-and-radius",
      title: t("The equation from the center and radius", "由圆心和半径写方程"),
      explanation: t(
        "Substitute $h$, $k$ and $r^{2}$ into $(x - h)^{2} + (y - k)^{2} = r^{2}$. For center $(5, -2)$ and radius $\\sqrt{7}$:\n\n$$(x - 5)^{2} + (y - (-2))^{2} = (\\sqrt{7})^{2} \\;\\Rightarrow\\; (x - 5)^{2} + (y + 2)^{2} = 7.$$\n\nSubtracting a negative coordinate gives a plus sign, and the radius is squared.",
        "把 $h$、$k$ 和 $r^{2}$ 代入 $(x - h)^{2} + (y - k)^{2} = r^{2}$。圆心为 $(5, -2)$、半径为 $\\sqrt{7}$ 时：\n\n$$(x - 5)^{2} + (y - (-2))^{2} = (\\sqrt{7})^{2} \\;\\Rightarrow\\; (x - 5)^{2} + (y + 2)^{2} = 7.$$\n\n减去负坐标得到加号，半径要平方。",
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 9);
        const r = pickRadius(rng);
        const answer = circleEq(h, k, r.r2);
        const [a, m] = simplifyRadical(r.r2);
        return equationProblem({
          prompt: t(
            `Write the equation of the circle with center $${pointLatex([h, k])}$ and radius $${r.tex}$.`,
            `写出圆心为 $${pointLatex([h, k])}$、半径为 $${r.tex}$ 的圆的方程。`,
          ),
          answer,
          wrong: [circleEq(-h, -k, r.r2), circleEq(h, k, r.r ?? a * m), circleEq(k, h, r.r2), circleEq(h, k, 2 * r.r2)],
          solution: t(
            `Substitute $h = ${h}$, $k = ${k}$ and $r^{2} = (${r.tex})^{2} = ${r.r2}$:${steps(answer)}`,
            `代入 $h = ${h}$、$k = ${k}$ 和 $r^{2} = (${r.tex})^{2} = ${r.r2}$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "equation-from-center-and-a-point",
      title: t("The equation from the center and a point", "由圆心和圆上一点写方程"),
      explanation: t(
        "If the circle passes through a point $P$, then $r^{2}$ is the squared distance from the center to $P$. For center $(2, -1)$ and $P(5, 3)$:\n\n$$r^{2} = (5 - 2)^{2} + (3 - (-1))^{2} = 9 + 16 = 25,$$\n\nso the circle is $(x - 2)^{2} + (y + 1)^{2} = 25$. The center goes into the equation, not the point.",
        "若圆经过点 $P$，则 $r^{2}$ 是圆心到 $P$ 的距离的平方。圆心为 $(2, -1)$、$P(5, 3)$ 时：\n\n$$r^{2} = (5 - 2)^{2} + (3 - (-1))^{2} = 9 + 16 = 25,$$\n\n所以圆的方程是 $(x - 2)^{2} + (y + 1)^{2} = 25$。代入方程的是圆心，而不是这个点。",
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const dx = rng.int(-7, 7);
        const dy = dx === 0 ? rng.nonZero(-7, 7) : rng.int(-7, 7);
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const answer = circleEq(h, k, r2);
        return equationProblem({
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
            `The squared radius is the squared distance from the center to the point:${steps(`r^{2} = ${squaredDistance([h, k], p)}`)}So the circle is $${answer}$.`,
            `半径的平方等于圆心到该点距离的平方：${steps(`r^{2} = ${squaredDistance([h, k], p)}`)}所以圆的方程是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "equation-from-a-diameter",
      title: t("The equation from a diameter", "由直径写方程"),
      explanation: t(
        "The center of a circle is the midpoint of every diameter. The **midpoint** of the segment from $(x_1, y_1)$ to $(x_2, y_2)$ averages the coordinates:\n\n$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$\n\nFor the diameter from $A(-1, 2)$ to $B(5, 10)$, the center is $(2, 6)$, and $r^{2}$ is the squared distance from the center to $A$: $(-1 - 2)^{2} + (2 - 6)^{2} = 25$. The circle is $(x - 2)^{2} + (y - 6)^{2} = 25$. (The squared length of the whole diameter, $100$, is $4r^{2}$, not $r^{2}$.)",
        "圆心是每条直径的中点。从 $(x_1, y_1)$ 到 $(x_2, y_2)$ 的线段的**中点**取坐标的平均数：\n\n$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$\n\n对从 $A(-1, 2)$ 到 $B(5, 10)$ 的直径，圆心是 $(2, 6)$，$r^{2}$ 是圆心到 $A$ 的距离的平方：$(-1 - 2)^{2} + (2 - 6)^{2} = 25$。圆的方程是 $(x - 2)^{2} + (y - 6)^{2} = 25$。（整条直径长度的平方 $100$ 是 $4r^{2}$，不是 $r^{2}$。）",
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const dx = rng.int(-6, 6);
        const dy = dx === 0 ? rng.nonZero(-6, 6) : rng.int(-6, 6);
        const a: Point = [h + dx, k + dy];
        const b: Point = [h - dx, k - dy];
        const r2 = dx * dx + dy * dy;
        const answer = circleEq(h, k, r2);
        return equationProblem({
          prompt: t(
            `The segment from $A${pointLatex(a)}$ to $B${pointLatex(b)}$ is a diameter of a circle. Write the equation of the circle.`,
            `从 $A${pointLatex(a)}$ 到 $B${pointLatex(b)}$ 的线段是一个圆的直径。写出这个圆的方程。`,
          ),
          answer,
          wrong: [circleEq(h, k, 4 * r2), circleEq(dx, dy, r2), circleEq(a[0], a[1], 4 * r2), circleEq(-h, -k, r2)],
          solution: t(
            `The center is the midpoint of $AB$:${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex([h, k])}`)}The squared radius is the squared distance from the center to $A$:${steps(`r^{2} = ${squaredDistance([h, k], a)}`)}So the circle is $${answer}$.`,
            `圆心是 $AB$ 的中点：${steps(`\\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = ${pointLatex([h, k])}`)}半径的平方是圆心到 $A$ 的距离的平方：${steps(`r^{2} = ${squaredDistance([h, k], a)}`)}所以圆的方程是 $${answer}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Completing the square
// ---------------------------------------------------------------------------

/** completion writes the steps that turn x² + y² + Dx + Ey + F = 0, with D = −2h and E = −2k, into standard form. */
function completion(h: number, k: number, F: number): string {
  const r2 = h * h + k * k - F;
  return steps(
    `(${quad(1, -2 * h, 0)}) + (${quad(1, -2 * k, 0, "y")}) = ${-F}`,
    `(${quad(1, -2 * h, h * h)}) + (${quad(1, -2 * k, k * k, "y")}) = ${poly([-F, ""], [h * h, ""], [k * k, ""])}`,
    `${sqTerm("x", h)} + ${sqTerm("y", k)} = ${r2}`,
  );
}

const completionIntro = (h: number, k: number): Text =>
  t(
    `Group the $x$ terms and the $y$ terms, move the constant to the right, and add $${paren(h)}^{2} = ${h * h}$ and $${paren(k)}^{2} = ${k * k}$ to both sides:`,
    `把含 $x$ 的项和含 $y$ 的项分组，把常数移到右边，两边同时加上 $${paren(h)}^{2} = ${h * h}$ 和 $${paren(k)}^{2} = ${k * k}$：`,
  );

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
  knowledgePoints: [
    {
      id: "center-by-completing-the-square",
      title: t("The center from the general form", "由一般方程求圆心"),
      explanation: t(
        "Expanding the standard form gives the **general form** $x^{2} + y^{2} + Dx + Ey + F = 0$. To go back, complete the square in $x$ and in $y$, adding the same numbers to both sides:\n\n$$x^{2} + y^{2} - 6x + 4y - 12 = 0$$\n\n$$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$\n\n$$(x - 3)^{2} + (y + 2)^{2} = 25$$\n\nThe center is $(3, -2)$ and the radius is $5$. Each center coordinate is minus half the coefficient of its variable.",
        "把标准方程展开得到**一般方程** $x^{2} + y^{2} + Dx + Ey + F = 0$。要化回标准方程，就对 $x$ 和 $y$ 分别配方，两边加上相同的数：\n\n$$x^{2} + y^{2} - 6x + 4y - 12 = 0$$\n\n$$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$\n\n$$(x - 3)^{2} + (y + 2)^{2} = 25$$\n\n圆心是 $(3, -2)$，半径是 $5$。圆心的每个坐标都是对应变量系数一半的相反数。",
      ),
      keyPrerequisites: ["completing-the-square"],
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const r2 = rng.int(1, 60);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F);
        return pointProblem({
          prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
          answer: [h, k],
          wrong: [
            [-h, -k],
            [-2 * h, -2 * k],
            [2 * h, 2 * k],
            [k, h],
          ],
          solution: t(
            `${completionIntro(h, k).en}${completion(h, k, F)}The center is $${pointLatex([h, k])}$.`,
            `${completionIntro(h, k)["zh-CN"]}${completion(h, k, F)}圆心是 $${pointLatex([h, k])}$。`,
          ),
        });
      },
    },
    {
      id: "radius-by-completing-the-square",
      title: t("The radius from the general form", "由一般方程求半径"),
      explanation: t(
        "After completing the square, the right side is $r^{2}$. Remember that the right side collects the moved constant **and** both squares you added:\n\n$$x^{2} + y^{2} + 8x - 2y + 9 = 0$$\n\n$$(x + 4)^{2} + (y - 1)^{2} = -9 + 16 + 1 = 8,$$\n\nso $r = \\sqrt{8} = 2\\sqrt{2}$.",
        "配方之后右边就是 $r^{2}$。注意右边包括移过去的常数，**以及**加上的两个平方数：\n\n$$x^{2} + y^{2} + 8x - 2y + 9 = 0$$\n\n$$(x + 4)^{2} + (y - 1)^{2} = -9 + 16 + 1 = 8,$$\n\n所以 $r = \\sqrt{8} = 2\\sqrt{2}$。",
      ),
      keyPrerequisites: ["completing-the-square"],
      generate(rng) {
        const [h, k] = pickCenter(rng, 8);
        const r2 = rng.int(1, 80);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F);
        const wrong = [String(r2)];
        for (const v of [-F, r2 - h * h, r2 - k * k]) if (v > 0) wrong.push(rootTex(v));
        return radicalProblem({
          prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
          answer: rootAnswer(r2),
          wrong,
          solution: t(
            `${completionIntro(h, k).en}${completion(h, k, F)}So $r = \\sqrt{${r2}} = ${rootTex(r2)}$.`,
            `${completionIntro(h, k)["zh-CN"]}${completion(h, k, F)}所以 $r = \\sqrt{${r2}} = ${rootTex(r2)}$。`,
          ),
        });
      },
    },
    {
      id: "equal-leading-coefficients",
      title: t("Equal leading coefficients", "二次项系数相同"),
      explanation: t(
        "When $x^{2}$ and $y^{2}$ have the same coefficient other than $1$, divide the whole equation by it first, then complete the square:\n\n$$2x^{2} + 2y^{2} - 4x + 12y - 12 = 0 \\;\\Rightarrow\\; x^{2} + y^{2} - 2x + 6y - 6 = 0$$\n\n$$(x - 1)^{2} + (y + 3)^{2} = 6 + 1 + 9 = 16,$$\n\nso the center is $(1, -3)$ and the radius is $4$.",
        "当 $x^{2}$ 和 $y^{2}$ 的系数相同且不为 $1$ 时，先把整个方程除以这个系数，再配方：\n\n$$2x^{2} + 2y^{2} - 4x + 12y - 12 = 0 \\;\\Rightarrow\\; x^{2} + y^{2} - 2x + 6y - 6 = 0$$\n\n$$(x - 1)^{2} + (y + 3)^{2} = 6 + 1 + 9 = 16,$$\n\n所以圆心是 $(1, -3)$，半径是 $4$。",
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const [h, k] = pickCenter(rng, 6);
        const r2 = rng.int(1, 50);
        const F = h * h + k * k - r2;
        const eq = generalEq(-2 * h, -2 * k, F, a);
        const intro = t(
          `Divide by $${a}$:${steps(generalEq(-2 * h, -2 * k, F))}Then complete the square:${completion(h, k, F)}`,
          `两边同除以 $${a}$：${steps(generalEq(-2 * h, -2 * k, F))}然后配方：${completion(h, k, F)}`,
        );
        if (rng.bool())
          return pointProblem({
            prompt: t(`Find the center of the circle $${eq}$.`, `求圆 $${eq}$ 的圆心。`),
            answer: [h, k],
            wrong: [
              [-h, -k],
              [a * h, a * k],
              [-2 * h, -2 * k],
            ],
            solution: t(`${intro.en}The center is $${pointLatex([h, k])}$.`, `${intro["zh-CN"]}圆心是 $${pointLatex([h, k])}$。`),
          });
        const [c, m] = simplifyRadical(r2);
        return radicalProblem({
          prompt: t(`Find the radius of the circle $${eq}$ in simplest radical form.`, `求圆 $${eq}$ 的半径（化为最简根式）。`),
          answer: [c, m],
          wrong: [rootTex(a * r2), radical(a * c, m), String(r2)],
          solution: t(
            `${intro.en}So $r = \\sqrt{${r2}} = ${rootTex(r2)}$.`,
            `${intro["zh-CN"]}所以 $r = \\sqrt{${r2}} = ${rootTex(r2)}$。`,
          ),
        });
      },
    },
    {
      id: "circle-point-or-nothing",
      title: t("A circle, a point or nothing", "圆、一个点还是没有点"),
      explanation: t(
        "Not every equation $x^{2} + y^{2} + Dx + Ey + F = 0$ is a circle. Complete the square to get $(x - h)^{2} + (y - k)^{2} = c$:\n\n- $c > 0$: a circle with radius $\\sqrt{c}$;\n- $c = 0$: only the single point $(h, k)$, since a sum of squares is $0$ only when both are $0$;\n- $c < 0$: no points at all, since a sum of squares is never negative.\n\nFor example $x^{2} + y^{2} - 2x + 4y + 9 = 0$ becomes $(x - 1)^{2} + (y + 2)^{2} = -4$: no point satisfies it.",
        "并不是每个方程 $x^{2} + y^{2} + Dx + Ey + F = 0$ 都表示圆。配方得到 $(x - h)^{2} + (y - k)^{2} = c$：\n\n- $c > 0$：半径为 $\\sqrt{c}$ 的圆；\n- $c = 0$：只有一个点 $(h, k)$，因为平方和为 $0$ 当且仅当两个平方都为 $0$；\n- $c < 0$：没有任何点，因为平方和不可能为负。\n\n例如 $x^{2} + y^{2} - 2x + 4y + 9 = 0$ 化为 $(x - 1)^{2} + (y + 2)^{2} = -4$：没有点满足它。",
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
            `The right side is positive, so the graph is a circle with radius $${rootTex(Math.max(r2, 1))}$.`,
            `右边是正数，所以图形是半径为 $${rootTex(Math.max(r2, 1))}$ 的圆。`,
          ),
          t(
            `The right side is $0$, so only the point $${pointLatex([h, k])}$ satisfies the equation.`,
            `右边是 $0$，所以只有点 $${pointLatex([h, k])}$ 满足方程。`,
          ),
          t(
            "The right side is negative, but a sum of squares is never negative, so no point satisfies the equation.",
            "右边是负数，而平方和不可能为负，所以没有点满足方程。",
          ),
        ][kind]!;
        return choiceProblem({
          prompt: t(`What is the graph of $${eq}$?`, `$${eq}$ 的图形是什么？`),
          options,
          correct: kind,
          solution: t(`Complete the square:${completion(h, k, F)}${verdict.en}`, `配方：${completion(h, k, F)}${verdict["zh-CN"]}`),
        });
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
  const sq = `(${linear(1, -c, v)})^{2}`;
  const sub = `${sq} + ${paren(-o)}^{2} = ${r2}`;
  const lines = [sub, `${sq} = ${s}`];
  const tail =
    s < 0
      ? t("A square cannot be negative, so the circle does not meet this axis.", "平方不可能为负，所以圆与这条坐标轴没有交点。")
      : s === 0
        ? t(`So $${v} = ${c}$: the circle touches the axis at one point.`, `所以 $${v} = ${c}$：圆与坐标轴只有一个公共点。`)
        : t(
            `Take square roots: $${v} - ${paren(c)} = \\pm ${rootTex(s)}$, so $${v} = ${pmTex(c, s)}$.`,
            `开平方：$${v} - ${paren(c)} = \\pm ${rootTex(s)}$，所以 $${v} = ${pmTex(c, s)}$。`,
          );
  const axis = v === "x" ? t("$x$-intercepts", "$x$ 轴截距") : t("$y$-intercepts", "$y$ 轴截距");
  return solutionsProblem({
    prompt: t(
      `Find the ${axis.en} of the circle $${eq}$. Enter the values of $${v}$, or "no solution" if there are none.`,
      `求圆 $${eq}$ 的${axis["zh-CN"]}。输入 $${v}$ 的值；若没有，输入“无解”。`,
    ),
    values,
    variable: v,
    wrong: [pm(c, r2 + o * o), pm(-c, s), pm(c, r2), [String(c)]],
    solution: t(
      `On the ${v}-axis $${w} = 0$. Substitute:${steps(...lines)}${tail.en}`,
      `在 ${v} 轴上 $${w} = 0$。代入：${steps(...lines)}${tail["zh-CN"]}`,
    ),
  });
}

export const calculatingCircleIntercepts: TopicDef = {
  id: "calculating-circle-intercepts",
  title: t("Calculating Circle Intercepts", "求圆的截距"),
  summary: t(
    "Find where a circle crosses the $x$-axis and the $y$-axis from its standard or general form.",
    "由圆的标准方程或一般方程求它与 $x$ 轴、$y$ 轴的交点。",
  ),
  prerequisites: ["determining-circle-properties-by-completing-the-square", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "equations-of-circles", weight: 0.5 },
    { topic: "solving-equations-with-square-roots", weight: 0.4 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "x-intercepts",
      title: t("$x$-intercepts", "$x$ 轴截距"),
      explanation: t(
        "Points on the $x$-axis have $y = 0$. Substitute $y = 0$ into the equation of the circle and solve for $x$. For $(x - 2)^{2} + (y + 3)^{2} = 25$:\n\n$$(x - 2)^{2} + 3^{2} = 25 \\;\\Rightarrow\\; (x - 2)^{2} = 16 \\;\\Rightarrow\\; x - 2 = \\pm 4,$$\n\nso the $x$-intercepts are $x = 6$ and $x = -2$. If the squared term equals $0$ the circle touches the axis once; if it equals a negative number, the circle misses the axis.",
        "$x$ 轴上的点满足 $y = 0$。把 $y = 0$ 代入圆的方程并解出 $x$。对 $(x - 2)^{2} + (y + 3)^{2} = 25$：\n\n$$(x - 2)^{2} + 3^{2} = 25 \\;\\Rightarrow\\; (x - 2)^{2} = 16 \\;\\Rightarrow\\; x - 2 = \\pm 4,$$\n\n所以 $x$ 轴截距是 $x = 6$ 和 $x = -2$。若平方项等于 $0$，圆与坐标轴只有一个公共点；若等于负数，圆与坐标轴没有交点。",
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate: (rng) => interceptProblem(rng, "x"),
    },
    {
      id: "y-intercepts",
      title: t("$y$-intercepts", "$y$ 轴截距"),
      explanation: t(
        "Points on the $y$-axis have $x = 0$. For $(x + 1)^{2} + (y - 4)^{2} = 10$:\n\n$$1^{2} + (y - 4)^{2} = 10 \\;\\Rightarrow\\; (y - 4)^{2} = 9 \\;\\Rightarrow\\; y = 4 \\pm 3,$$\n\nso the $y$-intercepts are $y = 7$ and $y = 1$. When the square is not a perfect square, leave the answer in simplest radical form: $(y - 4)^{2} = 8$ gives $y = 4 \\pm 2\\sqrt{2}$.",
        "$y$ 轴上的点满足 $x = 0$。对 $(x + 1)^{2} + (y - 4)^{2} = 10$：\n\n$$1^{2} + (y - 4)^{2} = 10 \\;\\Rightarrow\\; (y - 4)^{2} = 9 \\;\\Rightarrow\\; y = 4 \\pm 3,$$\n\n所以 $y$ 轴截距是 $y = 7$ 和 $y = 1$。若右边不是完全平方数，答案写成最简根式：$(y - 4)^{2} = 8$ 得 $y = 4 \\pm 2\\sqrt{2}$。",
      ),
      generate: (rng) => interceptProblem(rng, "y"),
    },
    {
      id: "intercepts-from-the-general-form",
      title: t("Intercepts from the general form", "由一般方程求截距"),
      explanation: t(
        "In the general form, substitute $0$ for the other variable directly: its square and its linear term both vanish, leaving a quadratic equation. For $x^{2} + y^{2} - 2x + 6y - 8 = 0$, setting $y = 0$ gives\n\n$$x^{2} - 2x - 8 = 0 \\;\\Rightarrow\\; (x - 4)(x + 2) = 0,$$\n\nso the $x$-intercepts are $x = 4$ and $x = -2$.",
        "在一般方程中，直接把另一个变量换成 $0$：它的平方项和一次项都消失，剩下一个一元二次方程。对 $x^{2} + y^{2} - 2x + 6y - 8 = 0$，令 $y = 0$ 得\n\n$$x^{2} - 2x - 8 = 0 \\;\\Rightarrow\\; (x - 4)(x + 2) = 0,$$\n\n所以 $x$ 轴截距是 $x = 4$ 和 $x = -2$。",
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
        return solutionsProblem({
          prompt: t(
            `Find the ${axis.en} of the circle $${eq}$. Enter the values of $${v}$.`,
            `求圆 $${eq}$ 的${axis["zh-CN"]}。输入 $${v}$ 的值。`,
          ),
          values: [String(x1), String(x2)],
          variable: v,
          wrong: [[String(-x1), String(-x2)], [String(x1)], [String(-x1), String(x2)]],
          solution: t(
            `Set $${w} = 0$ and factor:${steps(`${quad(1, D, F, v)} = 0`, factored)}So $${v} = ${x1}$ or $${v} = ${x2}$.`,
            `令 $${w} = 0$ 并因式分解：${steps(`${quad(1, D, F, v)} = 0`, factored)}所以 $${v} = ${x1}$ 或 $${v} = ${x2}$。`,
          ),
        });
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
  if (k !== 0) lines.push(`${sqTerm("x", h)} + (${inner})^{2} = ${r2}`);
  lines.push(`${quad(1 + m * m, 2 * m * e - 2 * h, h * h + e * e - r2)} = 0`);
  lines.push(`${quad(1, -(x1 + x2), x1 * x2)} = 0`);
  lines.push(`(${linear(1, -x1)})(${linear(1, -x2)}) = 0`);
  return steps(...lines);
}

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
  knowledgePoints: [
    {
      id: "horizontal-and-vertical-lines",
      title: t("Horizontal and vertical lines", "水平线与竖直线"),
      explanation: t(
        "The intercepts are the intersections with the lines $y = 0$ and $x = 0$; any horizontal or vertical line works the same way. Where $x = 4$ meets $(x - 1)^{2} + (y + 2)^{2} = 13$:\n\n$$3^{2} + (y + 2)^{2} = 13 \\;\\Rightarrow\\; (y + 2)^{2} = 4 \\;\\Rightarrow\\; y = -2 \\pm 2,$$\n\nso the intersection points are $(4, 0)$ and $(4, -4)$.",
        "截距就是圆与直线 $y = 0$、$x = 0$ 的交点；任何水平线或竖直线都可以同样处理。求 $x = 4$ 与 $(x - 1)^{2} + (y + 2)^{2} = 13$ 的交点：\n\n$$3^{2} + (y + 2)^{2} = 13 \\;\\Rightarrow\\; (y + 2)^{2} = 4 \\;\\Rightarrow\\; y = -2 \\pm 2,$$\n\n所以交点是 $(4, 0)$ 和 $(4, -4)$。",
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const d = rng.nonZero(-5, 5);
        const s = rng.bool() ? rng.int(1, 6) ** 2 : rng.int(2, 30);
        const r2 = s + d * d;
        const eq = circleEq(h, k, r2);
        const vertical = rng.bool();
        const [v, fixed, c] = vertical ? (["y", h + d, k] as const) : (["x", k + d, h] as const);
        const line = `${vertical ? "x" : "y"} = ${fixed}`;
        const sq = `(${linear(1, -c, v)})^{2}`;
        const sub = vertical ? `${paren(d)}^{2} + ${sq} = ${r2}` : `${sq} + ${paren(d)}^{2} = ${r2}`;
        return solutionsProblem({
          prompt: t(
            `The line $${line}$ meets the circle $${eq}$ at two points. Find their $${v}$-coordinates.`,
            `直线 $${line}$ 与圆 $${eq}$ 交于两点。求这两点的 $${v}$ 坐标。`,
          ),
          values: pm(c, s),
          variable: v,
          wrong: [pm(c, r2 + d * d), pm(-c, s), pm(c, r2)],
          solution: t(
            `Substitute $${line}$:${steps(sub, `${sq} = ${s}`)}So $${v} = ${pmTex(c, s)}$.`,
            `代入 $${line}$：${steps(sub, `${sq} = ${s}`)}所以 $${v} = ${pmTex(c, s)}$。`,
          ),
        });
      },
    },
    {
      id: "slanted-lines-and-circles-about-the-origin",
      title: t("Slanted lines", "倾斜的直线"),
      explanation: t(
        "To intersect $y = mx + b$ with a circle, substitute $mx + b$ for $y$ in the circle's equation. Expanding gives a quadratic equation in $x$; its solutions are the $x$-coordinates of the intersection points. For $y = x + 1$ and $x^{2} + y^{2} = 25$:\n\n$$x^{2} + (x + 1)^{2} = 25 \\;\\Rightarrow\\; 2x^{2} + 2x - 24 = 0 \\;\\Rightarrow\\; x^{2} + x - 12 = 0,$$\n\n$$(x + 4)(x - 3) = 0,$$\n\nso $x = -4$ or $x = 3$, and the line gives the points $(-4, -3)$ and $(3, 4)$.",
        "求 $y = mx + b$ 与圆的交点时，把圆的方程中的 $y$ 换成 $mx + b$。展开得到关于 $x$ 的一元二次方程，它的解就是交点的 $x$ 坐标。对 $y = x + 1$ 和 $x^{2} + y^{2} = 25$：\n\n$$x^{2} + (x + 1)^{2} = 25 \\;\\Rightarrow\\; 2x^{2} + 2x - 24 = 0 \\;\\Rightarrow\\; x^{2} + x - 12 = 0,$$\n\n$$(x + 4)(x - 3) = 0,$$\n\n所以 $x = -4$ 或 $x = 3$，由直线得交点 $(-4, -3)$ 和 $(3, 4)$。",
      ),
      keyPrerequisites: ["solving-systems-of-nonlinear-equations"],
      generate(rng) {
        const { r2, p, q, m, b } = rng.pick(chordLines);
        const line = si(m, b);
        const eq = circleEq(0, 0, r2);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points where the line $${line}$ meets the circle $${eq}$.`,
            `求直线 $${line}$ 与圆 $${eq}$ 的交点的 $x$ 坐标。`,
          ),
          values: [String(p[0]), String(q[0])],
          wrong: [
            [String(p[1]), String(q[1])],
            [String(-p[0]), String(-q[0])],
          ],
          solution: t(
            `Substitute $${linear(m, b)}$ for $y$, expand, divide by $${1 + m * m}$ and factor:${lineSubstitution(0, 0, r2, m, b, p[0], q[0])}So $x = ${p[0]}$ or $x = ${q[0]}$.`,
            `把 $y$ 换成 $${linear(m, b)}$，展开，除以 $${1 + m * m}$ 后因式分解：${lineSubstitution(0, 0, r2, m, b, p[0], q[0])}所以 $x = ${p[0]}$ 或 $x = ${q[0]}$。`,
          ),
        });
      },
    },
    {
      id: "intersection-points",
      title: t("Intersection points", "交点"),
      explanation: t(
        "For a circle not centered at the origin, substitute the same way, then find each $y$ from the line. For $y = 2x - 1$ and $(x - 1)^{2} + (y - 1)^{2} = 5$: $y - 1 = 2x - 2$, so\n\n$$(x - 1)^{2} + (2x - 2)^{2} = 5 \\;\\Rightarrow\\; 5x^{2} - 10x + 5 = 5 \\;\\Rightarrow\\; x(x - 2) = 0.$$\n\nWith $x = 0$ the line gives $y = -1$, and with $x = 2$ it gives $y = 3$: the points are $(0, -1)$ and $(2, 3)$.",
        "圆心不在原点时，同样代入，再由直线方程求出每个 $y$。对 $y = 2x - 1$ 和 $(x - 1)^{2} + (y - 1)^{2} = 5$：$y - 1 = 2x - 2$，所以\n\n$$(x - 1)^{2} + (2x - 2)^{2} = 5 \\;\\Rightarrow\\; 5x^{2} - 10x + 5 = 5 \\;\\Rightarrow\\; x(x - 2) = 0.$$\n\n$x = 0$ 时由直线得 $y = -1$，$x = 2$ 时得 $y = 3$：交点是 $(0, -1)$ 和 $(2, 3)$。",
      ),
      generate(rng) {
        const { r2, p, q, m, b } = rng.pick(chordLines);
        const [h, k] = pickCenter(rng, 5);
        const P: Point = [p[0] + h, p[1] + k];
        const R: Point = [q[0] + h, q[1] + k];
        const c0 = b + k - m * h;
        const line = si(m, c0);
        const eq = circleEq(h, k, r2);
        return pointProblem({
          prompt: t(
            `The line $${line}$ meets the circle $${eq}$ at two points. Find the intersection point with the greater $x$-coordinate.`,
            `直线 $${line}$ 与圆 $${eq}$ 交于两点。求 $x$ 坐标较大的那个交点。`,
          ),
          answer: R,
          wrong: [P, [R[1], R[0]], q, [R[0], m * R[0] - c0]],
          solution: t(
            `Substitute the line into the circle:${lineSubstitution(h, k, r2, m, c0, P[0], R[0])}The greater solution is $x = ${R[0]}$, and the line gives $y = ${m} \\cdot ${paren(R[0])} ${c0 < 0 ? "-" : "+"} ${Math.abs(c0)} = ${R[1]}$. The point is $${pointLatex(R)}$.`,
            `把直线代入圆的方程：${lineSubstitution(h, k, r2, m, c0, P[0], R[0])}较大的解是 $x = ${R[0]}$，由直线得 $y = ${m} \\cdot ${paren(R[0])} ${c0 < 0 ? "-" : "+"} ${Math.abs(c0)} = ${R[1]}$。交点是 $${pointLatex(R)}$。`,
          ),
        });
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
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "slope-of-a-tangent-line",
      title: t("The slope of a tangent line", "切线的斜率"),
      explanation: t(
        "A **tangent line** touches a circle at exactly one point, the point of tangency. A tangent is **perpendicular to the radius** drawn to the point of tangency. So its slope is the negative reciprocal of the slope of that radius.\n\nThe circle $(x - 1)^{2} + (y - 2)^{2} = 25$ has center $(1, 2)$. At $P(4, 6)$ the radius has slope $\\frac{6 - 2}{4 - 1} = \\frac{4}{3}$, so the tangent at $P$ has slope $-\\frac{3}{4}$.",
        "**切线**与圆恰好有一个公共点，即切点。切线**垂直于过切点的半径**，所以切线的斜率是这条半径斜率的负倒数。\n\n圆 $(x - 1)^{2} + (y - 2)^{2} = 25$ 的圆心是 $(1, 2)$。在 $P(4, 6)$ 处，半径的斜率是 $\\frac{6 - 2}{4 - 1} = \\frac{4}{3}$，所以过 $P$ 的切线斜率是 $-\\frac{3}{4}$。",
      ),
      keyPrerequisites: ["perpendicular-lines-in-the-coordinate-plane"],
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [dx, dy] = pickOffset(rng);
        const p: Point = [h + dx, k + dy];
        const r2 = dx * dx + dy * dy;
        const radiusSlope = Q.of(dy, dx);
        const answer = Q.of(-dx, dy);
        return numberProblem({
          prompt: t(
            `The point $P${pointLatex(p)}$ lies on the circle $${circleEq(h, k, r2)}$. Find the slope of the tangent line to the circle at $P$.`,
            `点 $P${pointLatex(p)}$ 在圆 $${circleEq(h, k, r2)}$ 上。求圆在 $P$ 处的切线的斜率。`,
          ),
          answer,
          wrong: [radiusSlope, Q.of(dx, dy), radiusSlope.neg()],
          solution: t(
            `The center is $${pointLatex([h, k])}$. The radius to $P$ has slope${steps(slopeTex([h, k], p))}The tangent is perpendicular to it, so its slope is the negative reciprocal, $${num(answer)}$.`,
            `圆心是 $${pointLatex([h, k])}$。到 $P$ 的半径的斜率是${steps(slopeTex([h, k], p))}切线与它垂直，所以切线斜率是它的负倒数 $${num(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "equation-of-a-tangent-line",
      title: t("The equation of a tangent line", "切线的方程"),
      explanation: t(
        "Find the tangent's slope from the radius, then use the point of tangency to find $b$ in $y = mx + b$. For $(x - 1)^{2} + (y - 2)^{2} = 25$ at $P(4, 6)$ the slope is $-\\frac{3}{4}$, and\n\n$$6 = -\\frac{3}{4} \\cdot 4 + b \\;\\Rightarrow\\; b = 9,$$\n\nso the tangent line is $y = -\\frac{3}{4}x + 9$. The tangent passes through $P$, not through the center.",
        "先由半径求出切线的斜率，再用切点求 $y = mx + b$ 中的 $b$。对 $(x - 1)^{2} + (y - 2)^{2} = 25$ 在 $P(4, 6)$ 处，斜率是 $-\\frac{3}{4}$，且\n\n$$6 = -\\frac{3}{4} \\cdot 4 + b \\;\\Rightarrow\\; b = 9,$$\n\n所以切线是 $y = -\\frac{3}{4}x + 9$。切线经过 $P$，而不经过圆心。",
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
        return equationProblem({
          prompt: t(
            `Write in slope-intercept form the equation of the line tangent to the circle $${circleEq(h, k, r2)}$ at $P${pointLatex(p)}$.`,
            `写出圆 $${circleEq(h, k, r2)}$ 在点 $P${pointLatex(p)}$ 处的切线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [lineThrough(radiusSlope, p), lineThrough(m, [h, k]), lineThrough(m.neg(), p), si(m, b.neg())],
          solution: t(
            `The radius from the center $${pointLatex([h, k])}$ to $P$ has slope $${num(radiusSlope)}$, so the tangent has slope $${num(m)}$. Substitute $P$ to find $b$:${steps(`${p[1]} = ${num(m)} \\cdot ${paren(p[0])} + b`, `b = ${num(b)}`)}So the tangent line is $${answer}$.`,
            `从圆心 $${pointLatex([h, k])}$ 到 $P$ 的半径的斜率是 $${num(radiusSlope)}$，所以切线的斜率是 $${num(m)}$。代入 $P$ 求 $b$：${steps(`${p[1]} = ${num(m)} \\cdot ${paren(p[0])} + b`, `b = ${num(b)}`)}所以切线是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "horizontal-and-vertical-tangents",
      title: t("Horizontal and vertical tangents", "水平切线与竖直切线"),
      explanation: t(
        "At the highest and lowest points of a circle the radius is vertical, so the tangent is **horizontal**; at the leftmost and rightmost points the radius is horizontal, so the tangent is **vertical**.\n\nThe circle $(x + 2)^{2} + (y - 1)^{2} = 9$ has center $(-2, 1)$ and radius $3$. At its rightmost point $(1, 1)$ the tangent is the vertical line $x = 1$; at its lowest point $(-2, -2)$ the tangent is $y = -2$.",
        "在圆的最高点和最低点，半径是竖直的，所以切线是**水平**的；在最左点和最右点，半径是水平的，所以切线是**竖直**的。\n\n圆 $(x + 2)^{2} + (y - 1)^{2} = 9$ 的圆心是 $(-2, 1)$，半径是 $3$。在最右点 $(1, 1)$ 的切线是竖直线 $x = 1$；在最低点 $(-2, -2)$ 的切线是 $y = -2$。",
      ),
      generate(rng) {
        const [h, k] = [rng.int(-7, 7), rng.int(-7, 7)];
        const r = rng.int(1, 9);
        const dir = rng.int(0, 3);
        const [dx, dy] = [
          [r, 0],
          [0, r],
          [-r, 0],
          [0, -r],
        ][dir]!;
        const p: Point = [h + dx!, k + dy!];
        const vertical = dy === 0;
        const answer = vertical ? `x = ${p[0]}` : `y = ${p[1]}`;
        const radius = vertical
          ? t("horizontal, so the tangent is vertical", "是水平的，所以切线是竖直的")
          : t("vertical, so the tangent is horizontal", "是竖直的，所以切线是水平的");
        return equationProblem({
          prompt: t(
            `The point $P${pointLatex(p)}$ lies on the circle $${circleEq(h, k, r * r)}$. Write the equation of the tangent line at $P$.`,
            `点 $P${pointLatex(p)}$ 在圆 $${circleEq(h, k, r * r)}$ 上。写出过 $P$ 的切线方程。`,
          ),
          answer,
          wrong: vertical ? [`y = ${p[1]}`, `x = ${h}`, `x = ${p[0] + dx!}`] : [`x = ${p[0]}`, `y = ${k}`, `y = ${p[1] + dy!}`],
          solution: t(
            `The center is $${pointLatex([h, k])}$, so the radius to $P$ is ${radius.en}. It passes through $P$: $${answer}$.`,
            `圆心是 $${pointLatex([h, k])}$，所以到 $P$ 的半径${radius["zh-CN"]}。切线经过 $P$：$${answer}$。`,
          ),
        });
      },
    },
  ],
};

export const perpendicularBisectorsOfDiametersInTheCoordinatePlane: TopicDef = {
  id: "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
  title: t("Perpendicular Bisectors of Diameters in the Coordinate Plane", "坐标平面中直径的垂直平分线"),
  summary: t(
    "Find the other end of a diameter, the perpendicular bisector of a diameter, and the endpoints of the perpendicular diameter.",
    "求直径的另一端点、直径的垂直平分线，以及与之垂直的直径的端点。",
  ),
  prerequisites: ["equations-of-circles", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.5 },
    { topic: "equations-of-circles", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.GPE.B.5", "CCSS.HSG.GPE.B.4"],
  knowledgePoints: [
    {
      id: "the-other-endpoint-of-a-diameter",
      title: t("The other endpoint of a diameter", "直径的另一端点"),
      explanation: t(
        "The center $M$ is the midpoint of a diameter $AB$, so the step from $A$ to $M$ repeats from $M$ to $B$. For the circle $(x - 2)^{2} + (y + 1)^{2} = 25$ and $A(5, 3)$: from $A$ to $M(2, -1)$ is $3$ left and $4$ down, so\n\n$$B = (2 - 3, -1 - 4) = (-1, -5).$$\n\nIn one formula, $B = (2h - x_A, 2k - y_A)$.",
        "圆心 $M$ 是直径 $AB$ 的中点，所以从 $A$ 到 $M$ 的位移再从 $M$ 走一次就到 $B$。对圆 $(x - 2)^{2} + (y + 1)^{2} = 25$ 和 $A(5, 3)$：从 $A$ 到 $M(2, -1)$ 是向左 $3$、向下 $4$，所以\n\n$$B = (2 - 3, -1 - 4) = (-1, -5).$$\n\n写成公式就是 $B = (2h - x_A, 2k - y_A)$。",
      ),
      generate(rng) {
        const [h, k] = pickCenter(rng, 7);
        const dx = rng.int(-7, 7);
        const dy = dx === 0 ? rng.nonZero(-7, 7) : rng.int(-7, 7);
        const a: Point = [h + dx, k + dy];
        const b: Point = [h - dx, k - dy];
        return pointProblem({
          prompt: t(
            `$AB$ is a diameter of the circle $${circleEq(h, k, dx * dx + dy * dy)}$, with $A${pointLatex(a)}$. Find $B$.`,
            `$AB$ 是圆 $${circleEq(h, k, dx * dx + dy * dy)}$ 的直径，$A${pointLatex(a)}$。求 $B$。`,
          ),
          answer: b,
          wrong: [
            [-a[0], -a[1]],
            [-b[0], -b[1]],
            [-dx, -dy],
            [Q.of(a[0] + h, 2), Q.of(a[1] + k, 2)],
          ],
          solution: t(
            `The center is $M${pointLatex([h, k])}$, the midpoint of $AB$. From $A$ to $M$ the coordinates change by $${-dx}$ and $${-dy}$; the same change from $M$ gives${steps(`B = (${h} ${dx > 0 ? "-" : "+"} ${Math.abs(dx)}, ${k} ${dy > 0 ? "-" : "+"} ${Math.abs(dy)}) = ${pointLatex(b)}`)}`,
            `圆心 $M${pointLatex([h, k])}$ 是 $AB$ 的中点。从 $A$ 到 $M$，坐标变化了 $${-dx}$ 和 $${-dy}$；从 $M$ 再变化同样的量得${steps(`B = (${h} ${dx > 0 ? "-" : "+"} ${Math.abs(dx)}, ${k} ${dy > 0 ? "-" : "+"} ${Math.abs(dy)}) = ${pointLatex(b)}`)}`,
          ),
        });
      },
    },
    {
      id: "perpendicular-bisector-of-a-diameter",
      title: t("The perpendicular bisector of a diameter", "直径的垂直平分线"),
      explanation: t(
        "The **perpendicular bisector** of a segment passes through its midpoint and is perpendicular to it. For a diameter, the midpoint is the center, so the perpendicular bisector of a diameter is the line through the center with the negative reciprocal slope — it contains another diameter.\n\nFor the diameter from $A(-1, 1)$ to $B(5, 5)$: the center is $(2, 3)$, the slope of $AB$ is $\\frac{4}{6} = \\frac{2}{3}$, so the bisector has slope $-\\frac{3}{2}$, and $3 = -\\frac{3}{2} \\cdot 2 + b$ gives $y = -\\frac{3}{2}x + 6$.",
        "线段的**垂直平分线**经过线段的中点并与线段垂直。直径的中点就是圆心，所以直径的垂直平分线是过圆心、斜率为负倒数的直线——它包含另一条直径。\n\n对从 $A(-1, 1)$ 到 $B(5, 5)$ 的直径：圆心是 $(2, 3)$，$AB$ 的斜率是 $\\frac{4}{6} = \\frac{2}{3}$，所以垂直平分线的斜率是 $-\\frac{3}{2}$，由 $3 = -\\frac{3}{2} \\cdot 2 + b$ 得 $y = -\\frac{3}{2}x + 6$。",
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
        return equationProblem({
          prompt: t(
            `The segment from $A${pointLatex(a)}$ to $B${pointLatex(b)}$ is a diameter of a circle. Write in slope-intercept form the equation of the perpendicular bisector of $AB$.`,
            `从 $A${pointLatex(a)}$ 到 $B${pointLatex(b)}$ 的线段是一个圆的直径。写出 $AB$ 的垂直平分线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [lineThrough(ab, [h, k]), lineThrough(m, a), lineThrough(m.neg(), [h, k]), lineThrough(Q.one.div(ab), [h, k])],
          solution: t(
            `The center is the midpoint $${pointLatex([h, k])}$. The slope of $AB$ is $${num(ab)}$, so the bisector has slope $${num(m)}$:${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}So the perpendicular bisector is $${answer}$.`,
            `圆心是中点 $${pointLatex([h, k])}$。$AB$ 的斜率是 $${num(ab)}$，所以垂直平分线的斜率是 $${num(m)}$：${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}所以垂直平分线是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "endpoints-of-the-perpendicular-diameter",
      title: t("The perpendicular diameter", "与之垂直的直径"),
      explanation: t(
        "If $A$ is $a$ units right and $b$ units up from the center, rotating that step by a quarter turn gives $-b$ right and $a$ up: the slopes $\\frac{b}{a}$ and $-\\frac{a}{b}$ are negative reciprocals, and both steps have the same length. So the diameter perpendicular to $AB$ has endpoints\n\n$$(h - b, k + a) \\quad\\text{and}\\quad (h + b, k - a).$$\n\nWith center $(1, 2)$ and $A(4, 3)$, the step is $(3, 1)$, so the perpendicular diameter ends at $(0, 5)$ and $(2, -1)$.",
        "若 $A$ 在圆心右方 $a$ 个单位、上方 $b$ 个单位，把这个位移旋转四分之一圈，得到向右 $-b$、向上 $a$：斜率 $\\frac{b}{a}$ 和 $-\\frac{a}{b}$ 互为负倒数，两个位移长度相同。所以与 $AB$ 垂直的直径的端点是\n\n$$(h - b, k + a) \\quad\\text{和}\\quad (h + b, k - a).$$\n\n圆心为 $(1, 2)$、$A(4, 3)$ 时，位移是 $(3, 1)$，所以垂直直径的端点是 $(0, 5)$ 和 $(2, -1)$。",
      ),
      generate(rng) {
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const dx = rng.int(-6, 6);
        const dy = rng.nonZero(-6, 6);
        const a: Point = [h + dx, k + dy];
        const p1: Point = [h - dy, k + dx];
        const p2: Point = [h + dy, k - dx];
        const [answer, other] = p1[0] > p2[0] ? [p1, p2] : [p2, p1];
        return pointProblem({
          prompt: t(
            `$AB$ is a diameter of the circle $${circleEq(h, k, dx * dx + dy * dy)}$, with $A${pointLatex(a)}$. $PQ$ is the diameter perpendicular to $AB$. Find the endpoint of $PQ$ with the greater $x$-coordinate.`,
            `$AB$ 是圆 $${circleEq(h, k, dx * dx + dy * dy)}$ 的直径，$A${pointLatex(a)}$。$PQ$ 是与 $AB$ 垂直的直径。求 $PQ$ 中 $x$ 坐标较大的端点。`,
          ),
          answer,
          wrong: [other, [h + dy, k + dx], [h - dx, k - dy], [answer[1], answer[0]]],
          solution: t(
            `The center is $${pointLatex([h, k])}$, and the step from it to $A$ is $(${dx}, ${dy})$. A quarter turn gives the step $(${-dy}, ${dx})$, so the endpoints of $PQ$ are${steps(`${pointLatex(p1)} \\text{ and } ${pointLatex(p2)}`)}The one with the greater $x$-coordinate is $${pointLatex(answer)}$.`,
            `圆心是 $${pointLatex([h, k])}$，从圆心到 $A$ 的位移是 $(${dx}, ${dy})$。旋转四分之一圈得到位移 $(${-dy}, ${dx})$，所以 $PQ$ 的端点是${steps(`${pointLatex(p1)} \\text{ 和 } ${pointLatex(p2)}`)}其中 $x$ 坐标较大的是 $${pointLatex(answer)}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Chords
// ---------------------------------------------------------------------------

/** chordFigure draws circle O with chord AB at distance d from O (radius r), the perpendicular OM and the radius OA. */
function chordFigure(r: number, d: number): Figure {
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
  return {
    svg: sketch(marks),
    alt: t(
      "Circle O with chord AB, the radius OA and the perpendicular segment OM from the center to the midpoint M of AB.",
      "圆 O 中有弦 AB、半径 OA，以及从圆心到 AB 中点 M 的垂线段 OM。",
    ),
  };
}

export const perpendicularBisectorsOfChords: TopicDef = {
  id: "perpendicular-bisectors-of-chords",
  title: t("Perpendicular Bisectors of Chords", "弦的垂直平分线"),
  summary: t(
    "Use the fact that the perpendicular from the center bisects a chord to relate the radius, the chord and its distance from the center.",
    "利用圆心到弦的垂线平分弦，建立半径、弦长与弦心距之间的关系。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.6 },
    { topic: "circles", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "length-of-a-chord",
      title: t("The length of a chord", "弦长"),
      explanation: t(
        "The **perpendicular bisector of any chord passes through the center** of the circle: the center is the same distance from both endpoints, and the points equidistant from two points form their perpendicular bisector. Equivalently, the perpendicular segment $OM$ from the center to a chord $AB$ meets it at its midpoint.\n\nSo $OMA$ is a right triangle with hypotenuse the radius $OA = r$ and legs $OM = d$ (the distance from the center to the chord) and $AM = \\frac{1}{2}AB$:\n\n$$r^{2} = d^{2} + AM^{2}.$$\n\nIf $r = 10$ and $d = 6$, then $AM = \\sqrt{100 - 36} = 8$ and the chord is $AB = 16$.",
        "**任何弦的垂直平分线都经过圆心**：圆心到弦的两个端点距离相等，而到两点距离相等的点组成这两点连线的垂直平分线。等价地说，从圆心到弦 $AB$ 的垂线段 $OM$ 与弦交于弦的中点。\n\n所以 $OMA$ 是直角三角形，斜边是半径 $OA = r$，直角边是 $OM = d$（弦心距）和 $AM = \\frac{1}{2}AB$：\n\n$$r^{2} = d^{2} + AM^{2}.$$\n\n若 $r = 10$、$d = 6$，则 $AM = \\sqrt{100 - 36} = 8$，弦长 $AB = 16$。",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const r = rng.int(3, 15);
        const d = rng.int(1, r - 1);
        const h2 = r * r - d * d;
        const [c, m] = simplifyRadical(h2);
        const [c2, m2] = simplifyRadical(r * r + d * d);
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$ with radius $${r}$, chord $AB$ is at distance $OM = ${d}$ from the center. Find the length of $AB$ in simplest radical form.`,
              `在半径为 $${r}$ 的圆 $O$ 中，弦 $AB$ 的弦心距 $OM = ${d}$。求 $AB$ 的长（化为最简根式）。`,
            ),
            answer: [2 * c, m],
            wrong: [radical(c, m), radical(2 * c2, m2), String(2 * (r - d))],
            solution: t(
              `$OM$ bisects $AB$, and $OMA$ is a right triangle with hypotenuse $OA = ${r}$:${steps(`AM = \\sqrt{${r}^{2} - ${d}^{2}} = \\sqrt{${h2}} = ${rootTex(h2)}`, `AB = 2 \\cdot AM = ${radical(2 * c, m)}`)}`,
              `$OM$ 平分 $AB$，$OMA$ 是以 $OA = ${r}$ 为斜边的直角三角形：${steps(`AM = \\sqrt{${r}^{2} - ${d}^{2}} = \\sqrt{${h2}} = ${rootTex(h2)}`, `AB = 2 \\cdot AM = ${radical(2 * c, m)}`)}`,
            ),
          }),
          figure: chordFigure(r, d),
        };
      },
    },
    {
      id: "distance-from-the-center",
      title: t("The distance from the center", "弦心距"),
      explanation: t(
        "Halve the chord first: the leg of the right triangle is **half** the chord. In a circle of radius $13$, a chord of length $24$ has half-length $12$, so its distance from the center is\n\n$$d = \\sqrt{13^{2} - 12^{2}} = \\sqrt{25} = 5.$$",
        "先把弦长减半：直角三角形的直角边是弦长的**一半**。在半径为 $13$ 的圆中，长为 $24$ 的弦的一半是 $12$，所以弦心距是\n\n$$d = \\sqrt{13^{2} - 12^{2}} = \\sqrt{25} = 5.$$",
      ),
      generate(rng) {
        const r = rng.int(3, 15);
        const a = rng.int(1, r - 1);
        const d2 = r * r - a * a;
        const wrong = [rootTex(r * r + a * a), String(r - a)];
        if (r * r - 4 * a * a > 0) wrong.push(rootTex(r * r - 4 * a * a));
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$ with radius $${r}$, chord $AB$ has length $${2 * a}$. Find the distance $OM$ from the center to the chord, in simplest radical form.`,
              `在半径为 $${r}$ 的圆 $O$ 中，弦 $AB$ 长 $${2 * a}$。求圆心到弦的距离 $OM$（化为最简根式）。`,
            ),
            answer: rootAnswer(d2),
            wrong,
            solution: t(
              `$M$ is the midpoint of $AB$, so $AM = ${a}$. In the right triangle $OMA$:${steps(`OM = \\sqrt{${r}^{2} - ${a}^{2}} = \\sqrt{${d2}} = ${rootTex(d2)}`)}`,
              `$M$ 是 $AB$ 的中点，所以 $AM = ${a}$。在直角三角形 $OMA$ 中：${steps(`OM = \\sqrt{${r}^{2} - ${a}^{2}} = \\sqrt{${d2}} = ${rootTex(d2)}`)}`,
            ),
          }),
          figure: chordFigure(r, Math.sqrt(d2)),
        };
      },
    },
    {
      id: "radius-from-a-chord",
      title: t("The radius from a chord", "由弦求半径"),
      explanation: t(
        "If the chord and its distance from the center are known, the radius is the hypotenuse. A chord of length $16$ at distance $4$ from the center gives\n\n$$r = \\sqrt{8^{2} + 4^{2}} = \\sqrt{80} = 4\\sqrt{5}.$$",
        "已知弦长和弦心距时，半径就是斜边。长为 $16$、弦心距为 $4$ 的弦给出\n\n$$r = \\sqrt{8^{2} + 4^{2}} = \\sqrt{80} = 4\\sqrt{5}.$$",
      ),
      generate(rng) {
        const a = rng.int(1, 12);
        const d = rng.int(1, 12);
        const r2 = a * a + d * d;
        const wrong = [rootTex(4 * a * a + d * d), String(a + d)];
        if (a !== d) wrong.push(rootTex(Math.abs(a * a - d * d)));
        return {
          ...radicalProblem({
            prompt: t(
              `In circle $O$, chord $AB$ has length $${2 * a}$ and is at distance $OM = ${d}$ from the center. Find the radius in simplest radical form.`,
              `在圆 $O$ 中，弦 $AB$ 长 $${2 * a}$，弦心距 $OM = ${d}$。求半径（化为最简根式）。`,
            ),
            answer: rootAnswer(r2),
            wrong,
            solution: t(
              `$AM = ${a}$, half the chord, and the radius $OA$ is the hypotenuse of the right triangle $OMA$:${steps(`OA = \\sqrt{${a}^{2} + ${d}^{2}} = \\sqrt{${r2}} = ${rootTex(r2)}`)}`,
              `$AM = ${a}$ 是弦长的一半，半径 $OA$ 是直角三角形 $OMA$ 的斜边：${steps(`OA = \\sqrt{${a}^{2} + ${d}^{2}} = \\sqrt{${r2}} = ${rootTex(r2)}`)}`,
            ),
          }),
          figure: chordFigure(Math.sqrt(r2), d),
        };
      },
    },
  ],
};

/** bisectorEquation writes the perpendicular bisector of PQ as ax + by = c in lowest terms: the points with XP² = XQ². */
function bisectorEquation(p: Point, q: Point): string {
  let [a, b, c] = [2 * (q[0] - p[0]), 2 * (q[1] - p[1]), q[0] ** 2 + q[1] ** 2 - p[0] ** 2 - p[1] ** 2];
  const g = gcd(gcd(a, b), c) * (a < 0 || (a === 0 && b < 0) ? -1 : 1);
  [a, b, c] = [a / g, b / g, c / g];
  return `${poly([a, "x"], [b, "y"])} = ${c}`;
}

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
  encompasses: [
    { topic: "perpendicular-bisectors-of-chords", weight: 0.5 },
    { topic: "perpendicular-bisectors-of-diameters-in-the-coordinate-plane", weight: 0.4 },
    { topic: "intersection-of-two-lines", weight: 0.3 },
  ],
  xp: 17,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "perpendicular-bisector-of-a-chord",
      title: t("The perpendicular bisector of a chord", "弦的垂直平分线"),
      explanation: t(
        "The perpendicular bisector of a chord passes through the center, so when the center is known you need only the slope: the negative reciprocal of the chord's slope.\n\nThe points $P(-3, 4)$ and $Q(4, 3)$ lie on $x^{2} + y^{2} = 25$. The chord $PQ$ has slope $\\frac{3 - 4}{4 - (-3)} = -\\frac{1}{7}$, so its perpendicular bisector has slope $7$ and passes through the center $(0, 0)$: $y = 7x$.",
        "弦的垂直平分线经过圆心，所以已知圆心时只需求斜率：弦的斜率的负倒数。\n\n点 $P(-3, 4)$ 和 $Q(4, 3)$ 在 $x^{2} + y^{2} = 25$ 上。弦 $PQ$ 的斜率是 $\\frac{3 - 4}{4 - (-3)} = -\\frac{1}{7}$，所以它的垂直平分线斜率是 $7$，并经过圆心 $(0, 0)$：$y = 7x$。",
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
        const slopeLine = chordSlope
          ? t(
              `The chord has slope${steps(slopeTex(p, q))}so the bisector has slope $${num(m)}$.`,
              `弦的斜率是${steps(slopeTex(p, q))}所以垂直平分线的斜率是 $${num(m)}$。`,
            )
          : t("The chord is vertical, so the bisector is horizontal.", "弦是竖直的，所以垂直平分线是水平的。");
        return equationProblem({
          prompt: t(
            `The points $P${pointLatex(p)}$ and $Q${pointLatex(q)}$ lie on the circle $${circleEq(h, k, r2)}$. Write in slope-intercept form the equation of the perpendicular bisector of the chord $PQ$.`,
            `点 $P${pointLatex(p)}$ 和 $Q${pointLatex(q)}$ 在圆 $${circleEq(h, k, r2)}$ 上。写出弦 $PQ$ 的垂直平分线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong,
          solution: t(
            `${slopeLine.en} It passes through the center $${pointLatex([h, k])}$:${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}So the perpendicular bisector is $${answer}$.`,
            `${slopeLine["zh-CN"]}它经过圆心 $${pointLatex([h, k])}$：${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(c)}`)}所以垂直平分线是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "center-from-three-points",
      title: t("The center from three points", "由三点求圆心"),
      explanation: t(
        "The perpendicular bisectors of two chords both pass through the center, so the center is where they meet. The perpendicular bisector of $PQ$ is the set of points $(x, y)$ equally far from $P$ and $Q$; setting the squared distances equal makes the squares $x^{2}$ and $y^{2}$ cancel, leaving a linear equation.\n\nFor $A(0, 6)$, $B(2, 2)$ and $C(6, 2)$: the bisector of $BC$ is $x = 4$; the bisector of $AB$ comes from\n\n$$x^{2} + (y - 6)^{2} = (x - 2)^{2} + (y - 2)^{2} \\;\\Rightarrow\\; x - 2y = -7.$$\n\nWith $x = 4$, $y = \\frac{11}{2}$... check your arithmetic carefully: here $4 - 2y = -7$ gives $y = 5.5$, so the center is $(4, 5.5)$.",
        "两条弦的垂直平分线都经过圆心，所以圆心就是它们的交点。$PQ$ 的垂直平分线是到 $P$、$Q$ 距离相等的点 $(x, y)$ 的集合；令两个距离的平方相等，$x^{2}$ 和 $y^{2}$ 会消去，只剩一个一次方程。\n\n对 $A(0, 6)$、$B(2, 2)$、$C(6, 2)$：$BC$ 的垂直平分线是 $x = 4$；$AB$ 的垂直平分线由\n\n$$x^{2} + (y - 6)^{2} = (x - 2)^{2} + (y - 2)^{2} \\;\\Rightarrow\\; x - 2y = -7$$\n\n得到。代入 $x = 4$，由 $4 - 2y = -7$ 得 $y = 5.5$，所以圆心是 $(4, 5.5)$。",
      ),
      keyPrerequisites: ["intersection-of-two-lines"],
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        const [u, v, w] = rng.sample(latticePoints(r2), 3) as [Point, Point, Point];
        const [a, b, c] = [u, v, w].map((p): Point => [p[0] + h, p[1] + k]) as [Point, Point, Point];
        return pointProblem({
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
            `The center is equally far from $A$ and $B$, and from $B$ and $C$. Setting the squared distances equal gives the two perpendicular bisectors:${steps(bisectorEquation(a, b), bisectorEquation(b, c))}Solving this system gives the center $${pointLatex([h, k])}$. Check: it is $\\sqrt{${r2}}$ from each of the three points.`,
            `圆心到 $A$、$B$ 的距离相等，到 $B$、$C$ 的距离也相等。令距离的平方相等，得到两条垂直平分线：${steps(bisectorEquation(a, b), bisectorEquation(b, c))}解这个方程组得圆心 $${pointLatex([h, k])}$。检验：它到三个点的距离都是 $\\sqrt{${r2}}$。`,
          ),
        });
      },
    },
    {
      id: "chord-cut-by-a-line",
      title: t("A chord cut by a line", "直线截得的弦"),
      explanation: t(
        "A horizontal line $y = c$ cuts a chord from the circle $(x - h)^{2} + (y - k)^{2} = r^{2}$ when its distance $d = |c - k|$ from the center is less than $r$. The perpendicular from the center to the chord bisects it, so the chord has length\n\n$$2\\sqrt{r^{2} - d^{2}}.$$\n\nThe line $y = 5$ and the circle $(x + 1)^{2} + (y - 2)^{2} = 25$: $d = 3$, so the chord is $2\\sqrt{25 - 9} = 8$ long. A vertical line $x = c$ works the same way with $d = |c - h|$.",
        "当水平线 $y = c$ 到圆心的距离 $d = |c - k|$ 小于 $r$ 时，它从圆 $(x - h)^{2} + (y - k)^{2} = r^{2}$ 上截得一条弦。圆心到弦的垂线平分弦，所以弦长是\n\n$$2\\sqrt{r^{2} - d^{2}}.$$\n\n直线 $y = 5$ 与圆 $(x + 1)^{2} + (y - 2)^{2} = 25$：$d = 3$，所以弦长是 $2\\sqrt{25 - 9} = 8$。竖直线 $x = c$ 同理，其中 $d = |c - h|$。",
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
        return radicalProblem({
          prompt: t(
            `Find the length of the chord that the line $${name} = ${c}$ cuts from the circle $${circleEq(h, k, r2)}$, in simplest radical form.`,
            `求直线 $${name} = ${c}$ 截圆 $${circleEq(h, k, r2)}$ 所得的弦长（化为最简根式）。`,
          ),
          answer: [2 * a, m],
          wrong,
          solution: t(
            `The center is $${pointLatex([h, k])}$, so the line is $d = |${c} - ${paren(center)}| = ${d}$ from the center. Half the chord is $\\sqrt{${r2} - ${d * d}} = ${rootTex(s)}$, so the chord is${steps(`2\\sqrt{${s}} = ${radical(2 * a, m)}`)}`,
            `圆心是 $${pointLatex([h, k])}$，所以直线到圆心的距离 $d = |${c} - ${paren(center)}| = ${d}$。半弦长是 $\\sqrt{${r2} - ${d * d}} = ${rootTex(s)}$，所以弦长是${steps(`2\\sqrt{${s}} = ${radical(2 * a, m)}`)}`,
          ),
        });
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

export const thalesTheoremInTheCoordinatePlane: TopicDef = {
  id: "thales-theorem-in-the-coordinate-plane",
  title: t("Thales' Theorem in the Coordinate Plane", "坐标平面中的泰勒斯定理"),
  summary: t(
    "Use Thales' theorem and its converse: an angle subtending a diameter is a right angle, and a right triangle's hypotenuse is a diameter of its circumcircle.",
    "运用泰勒斯定理及其逆定理：直径所对的圆周角是直角，直角三角形的斜边是其外接圆的直径。",
  ),
  prerequisites: ["perpendicular-bisectors-of-diameters-in-the-coordinate-plane"],
  encompasses: [
    { topic: "equations-of-circles", weight: 0.5 },
    { topic: "perpendicular-bisectors-of-diameters-in-the-coordinate-plane", weight: 0.4 },
    { topic: "the-pythagorean-theorem", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2", "CCSS.HSG.GPE.B.4"],
  knowledgePoints: [
    {
      id: "right-angle-or-not",
      title: t("Is the angle a right angle?", "这个角是直角吗？"),
      explanation: t(
        "**Thales' theorem**: if $AB$ is a diameter of a circle and $P$ is any other point of the circle, then $\\angle APB = 90^\\circ$. The converse holds too: if $\\angle APB = 90^\\circ$, then $P$ lies on the circle with diameter $AB$.\n\nSo to test whether $\\angle APB$ is a right angle, test whether $P$ is on the circle with diameter $AB$: is its distance from the midpoint $M$ of $AB$ equal to $MA$? For $A(-5, 0)$, $B(5, 0)$ and $P(3, 4)$: $M = (0, 0)$, $MA^{2} = 25$ and $MP^{2} = 9 + 16 = 25$, so $\\angle APB = 90^\\circ$. (Check: the slopes of $PA$ and $PB$ are $\\frac{1}{2}$ and $-2$.)",
        "**泰勒斯定理**：若 $AB$ 是圆的直径，$P$ 是圆上另外任意一点，则 $\\angle APB = 90^\\circ$。逆定理也成立：若 $\\angle APB = 90^\\circ$，则 $P$ 在以 $AB$ 为直径的圆上。\n\n所以要判断 $\\angle APB$ 是否为直角，就判断 $P$ 是否在以 $AB$ 为直径的圆上：它到 $AB$ 的中点 $M$ 的距离是否等于 $MA$？对 $A(-5, 0)$、$B(5, 0)$、$P(3, 4)$：$M = (0, 0)$，$MA^{2} = 25$，$MP^{2} = 9 + 16 = 25$，所以 $\\angle APB = 90^\\circ$。（检验：$PA$ 和 $PB$ 的斜率是 $\\frac{1}{2}$ 和 $-2$。）",
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
        return choiceProblem({
          prompt: t(
            `Given $A${pointLatex(a)}$, $B${pointLatex(b)}$ and $P${pointLatex(p)}$, is $\\angle APB$ a right angle?`,
            `已知 $A${pointLatex(a)}$、$B${pointLatex(b)}$、$P${pointLatex(p)}$，$\\angle APB$ 是直角吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `The midpoint of $AB$ is $M${pointLatex([h, k])}$. Compare the squared distances:${steps(`MA^{2} = ${squaredDistance([h, k], a)}`, `MP^{2} = ${squaredDistance([h, k], p)}`)}${on ? "They are equal, so $P$ lies on the circle with diameter $AB$, and by Thales' theorem $\\angle APB$ is a right angle." : `Since $${mp2} \\ne ${r2}$, $P$ is not on the circle with diameter $AB$, so by the converse of Thales' theorem $\\angle APB$ is not a right angle.`}`,
            `$AB$ 的中点是 $M${pointLatex([h, k])}$。比较距离的平方：${steps(`MA^{2} = ${squaredDistance([h, k], a)}`, `MP^{2} = ${squaredDistance([h, k], p)}`)}${on ? "二者相等，所以 $P$ 在以 $AB$ 为直径的圆上，由泰勒斯定理，$\\angle APB$ 是直角。" : `因为 $${mp2} \\ne ${r2}$，$P$ 不在以 $AB$ 为直径的圆上，由泰勒斯定理的逆定理，$\\angle APB$ 不是直角。`}`,
          ),
        });
      },
    },
    {
      id: "circumcircle-of-a-right-triangle",
      title: t("The circle through a right triangle", "直角三角形的外接圆"),
      explanation: t(
        "By the converse of Thales' theorem, the circle through the three vertices of a right triangle has the **hypotenuse as a diameter**. Its center is the midpoint of the hypotenuse, and $r^{2}$ is the squared distance from the center to any vertex.\n\nTo find the hypotenuse, compare the squared side lengths: the longest side is the hypotenuse, and its square equals the sum of the other two. For $P(1, 7)$, $Q(-3, -1)$ and $R(5, 3)$: $PQ^{2} = 80$, $QR^{2} = 80$, $PR^{2} = 32$... so the right angle is where the two equal... always check which square equals the sum of the other two: here $80 \\ne 80 + 32$, so recompute carefully before deciding.",
        "由泰勒斯定理的逆定理，过直角三角形三个顶点的圆以**斜边为直径**。圆心是斜边的中点，$r^{2}$ 是圆心到任一顶点距离的平方。\n\n要找斜边，比较三边长的平方：最长的边是斜边，它的平方等于另两边平方之和。",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const r2 = rng.pick(latticeR2);
        const pts = latticePoints(r2);
        const [h, k] = [rng.int(-5, 5), rng.int(-5, 5)];
        const v = rng.pick(pts);
        const others = pts.filter((p) => !(p[0] === v[0] && p[1] === v[1]) && !(p[0] === -v[0] && p[1] === -v[1]));
        const w = rng.pick(others);
        const ends: Point[] = [
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
        const hyp = `${nameOf(0)}${nameOf(1)}`.split("").sort().join("");
        const answer = circleEq(h, k, r2);
        return equationProblem({
          prompt: t(
            `Triangle $PQR$ has vertices $P${pointLatex(verts[0]!)}$, $Q${pointLatex(verts[1]!)}$ and $R${pointLatex(verts[2]!)}$, and it is a right triangle. Write the equation of the circle that passes through $P$, $Q$ and $R$.`,
            `直角三角形 $PQR$ 的顶点是 $P${pointLatex(verts[0]!)}$、$Q${pointLatex(verts[1]!)}$、$R${pointLatex(verts[2]!)}$。写出过 $P$、$Q$、$R$ 三点的圆的方程。`,
          ),
          answer,
          wrong: [circleEq(h, k, 4 * r2), circleEq(right[0], right[1], r2), circleEq(-h, -k, r2), circleEq(right[0], right[1], 4 * r2)],
          solution: t(
            `The squared side lengths are${steps(sides.join(", \\quad "))}The largest, $${hyp}^{2} = ${4 * r2}$, is the sum of the other two, so $${hyp}$ is the hypotenuse and a diameter of the circle. Its midpoint is the center $${pointLatex([h, k])}$, and $r^{2} = \\frac{${4 * r2}}{4} = ${r2}$:${steps(answer)}`,
            `三边长的平方是${steps(sides.join(", \\quad "))}最大的 $${hyp}^{2} = ${4 * r2}$ 等于另两个之和，所以 $${hyp}$ 是斜边，也是圆的直径。它的中点是圆心 $${pointLatex([h, k])}$，$r^{2} = \\frac{${4 * r2}}{4} = ${r2}$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "missing-coordinate",
      title: t("A missing coordinate", "求未知坐标"),
      explanation: t(
        "If $\\angle APB = 90^\\circ$, then $P$ lies on the circle with diameter $AB$. Write that circle's equation and substitute the known coordinate of $P$.\n\nFor $A(-4, 1)$, $B(6, 1)$ and $P(5, y)$ with $y > 1$: the circle has center $(1, 1)$ and $r^{2} = 25$, so\n\n$$(5 - 1)^{2} + (y - 1)^{2} = 25 \\;\\Rightarrow\\; (y - 1)^{2} = 9 \\;\\Rightarrow\\; y = 4.$$\n\n(The other solution, $y = -2$, is below $AB$.)",
        "若 $\\angle APB = 90^\\circ$，则 $P$ 在以 $AB$ 为直径的圆上。写出这个圆的方程，再代入 $P$ 的已知坐标。\n\n对 $A(-4, 1)$、$B(6, 1)$ 和 $P(5, y)$，其中 $y > 1$：圆心是 $(1, 1)$，$r^{2} = 25$，所以\n\n$$(5 - 1)^{2} + (y - 1)^{2} = 25 \\;\\Rightarrow\\; (y - 1)^{2} = 9 \\;\\Rightarrow\\; y = 4.$$\n\n（另一个解 $y = -2$ 在 $AB$ 下方。）",
      ),
      generate(rng) {
        const r = rng.pick(integerRadii);
        const [a0, b0] = rng.pick(offAxis(r * r));
        const [h, k] = [rng.int(-6, 6), rng.int(-6, 6)];
        const vertical = rng.bool();
        const a = a0;
        const b = Math.abs(b0);
        if (!vertical) {
          const A: Point = [h - r, k];
          const B: Point = [h + r, k];
          const x = h + a;
          const y = k + b;
          return numberProblem({
            prompt: t(
              `Given $A${pointLatex(A)}$ and $B${pointLatex(B)}$, the point $P(${x}, y)$ lies above $AB$ and $\\angle APB = 90^\\circ$. Find $y$.`,
              `已知 $A${pointLatex(A)}$、$B${pointLatex(B)}$，点 $P(${x}, y)$ 在 $AB$ 上方，且 $\\angle APB = 90^\\circ$。求 $y$。`,
            ),
            answer: y,
            solveFor: "y",
            wrong: [k - b, b, k + Math.abs(a)],
            solution: t(
              `By Thales' theorem $P$ lies on the circle with diameter $AB$: center $${pointLatex([h, k])}$ and $r = ${r}$. Substitute $x = ${x}$:${steps(`${paren(a)}^{2} + ${sqTerm("y", k)} = ${r * r}`, `${sqTerm("y", k)} = ${b * b}`)}So $y - ${paren(k)} = \\pm ${b}$; above $AB$, $y = ${y}$.`,
              `由泰勒斯定理，$P$ 在以 $AB$ 为直径的圆上：圆心 $${pointLatex([h, k])}$，$r = ${r}$。代入 $x = ${x}$：${steps(`${paren(a)}^{2} + ${sqTerm("y", k)} = ${r * r}`, `${sqTerm("y", k)} = ${b * b}`)}所以 $y - ${paren(k)} = \\pm ${b}$；在 $AB$ 上方，$y = ${y}$。`,
            ),
          });
        }
        const A: Point = [h, k - r];
        const B: Point = [h, k + r];
        const y = k + a;
        const x = h + b;
        return numberProblem({
          prompt: t(
            `Given $A${pointLatex(A)}$ and $B${pointLatex(B)}$, the point $P(x, ${y})$ lies to the right of $AB$ and $\\angle APB = 90^\\circ$. Find $x$.`,
            `已知 $A${pointLatex(A)}$、$B${pointLatex(B)}$，点 $P(x, ${y})$ 在 $AB$ 右侧，且 $\\angle APB = 90^\\circ$。求 $x$。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [h - b, b, h + Math.abs(a)],
          solution: t(
            `By Thales' theorem $P$ lies on the circle with diameter $AB$: center $${pointLatex([h, k])}$ and $r = ${r}$. Substitute $y = ${y}$:${steps(`${sqTerm("x", h)} + ${paren(a)}^{2} = ${r * r}`, `${sqTerm("x", h)} = ${b * b}`)}So $x - ${paren(h)} = \\pm ${b}$; to the right of $AB$, $x = ${x}$.`,
            `由泰勒斯定理，$P$ 在以 $AB$ 为直径的圆上：圆心 $${pointLatex([h, k])}$，$r = ${r}$。代入 $y = ${y}$：${steps(`${sqTerm("x", h)} + ${paren(a)}^{2} = ${r * r}`, `${sqTerm("x", h)} = ${b * b}`)}所以 $x - ${paren(h)} = \\pm ${b}$；在 $AB$ 右侧，$x = ${x}$。`,
          ),
        });
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
