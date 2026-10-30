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

import {
  equationProblem,
  expressionProblem,
  numberProblem,
  pointLatex,
  pointProblem,
  radicalProblem,
  solutionsProblem,
  steps,
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

/** slopeOf explains the slope of the line y = mx + b as it is written in the prompt. */
function slopeOf(m: Q, b: Coefficient, standard: boolean): Text {
  if (!standard) return t(`The line $${si(m, b)}$ has slope $${num(m)}$.`, `直线 $${si(m, b)}$ 的斜率是 $${num(m)}$。`);
  return t(
    `Solve $${stdOfLine(m, b)}$ for $y$: $${si(m, b)}$, so its slope is $${num(m)}$.`,
    `把 $${stdOfLine(m, b)}$ 化为用 $x$ 表示 $y$ 的形式：$${si(m, b)}$，所以它的斜率是 $${num(m)}$。`,
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
    { topic: "standard-form", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "parallel-line-in-point-slope-form",
      title: t("A parallel line in point-slope form", "用点斜式写平行线"),
      explanation: t(
        "A line parallel to a given line has the **same slope**. Knowing the slope $m$ and one point $(h, k)$ is enough for the point-slope form\n\n$$y - k = m(x - h).$$\n\nFor the line through $(-2, 5)$ parallel to $3x - 6y = 4$: solving for $y$ gives $y = \\frac{1}{2}x - \\frac{2}{3}$, so the slope is $\\frac{1}{2}$, and the parallel line is\n\n$$y - 5 = \\frac{1}{2}(x + 2).$$",
        "与已知直线平行的直线**斜率相同**。知道斜率 $m$ 和一点 $(h, k)$，就能写出点斜式\n\n$$y - k = m(x - h).$$\n\n求过 $(-2, 5)$ 且与 $3x - 6y = 4$ 平行的直线：把方程化为 $y = \\frac{1}{2}x - \\frac{2}{3}$，斜率是 $\\frac{1}{2}$，所以平行线是\n\n$$y - 5 = \\frac{1}{2}(x + 2).$$",
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
        return equationProblem({
          prompt: t(
            `Write in point-slope form the equation of the line through $${pointLatex([h, k])}$ parallel to $${given}$.`,
            `用点斜式写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 平行的直线方程。`,
          ),
          answer,
          form: "point-slope",
          wrong: [ps(m.neg(), h, k), ps(perp, h, k), ps(m, -h, -k), ps(m, k, h)],
          solution: t(
            `${reason.en} A parallel line has the same slope, so through $${pointLatex([h, k])}$ it is${steps(answer)}`,
            `${reason["zh-CN"]}平行线的斜率相同，所以过 $${pointLatex([h, k])}$ 的平行线是${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "parallel-line-in-standard-form",
      title: t("A parallel line in standard form", "用标准式写平行线"),
      explanation: t(
        "To give the answer in standard form $Ax + By = C$, write the parallel line in point-slope form first, then move the $x$-term to the left side and clear fractions so that $A$, $B$ and $C$ are integers without a common factor and $A > 0$.\n\nThe line through $(4, 1)$ parallel to $y = -\\frac{2}{3}x + 5$:\n\n$$y - 1 = -\\frac{2}{3}(x - 4) \\;\\Rightarrow\\; y = -\\frac{2}{3}x + \\frac{11}{3} \\;\\Rightarrow\\; 2x + 3y = 11.$$",
        "要用标准式 $Ax + By = C$ 作答，先写出平行线的点斜式，再把含 $x$ 的项移到左边并去分母，使 $A$、$B$、$C$ 是没有公因数的整数，且 $A > 0$。\n\n过 $(4, 1)$ 且与 $y = -\\frac{2}{3}x + 5$ 平行的直线：\n\n$$y - 1 = -\\frac{2}{3}(x - 4) \\;\\Rightarrow\\; y = -\\frac{2}{3}x + \\frac{11}{3} \\;\\Rightarrow\\; 2x + 3y = 11.$$",
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
        const work = steps(ps(m, h, k), si(m, b), answer);
        return equationProblem({
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
            `${reason.en} Write the parallel line through $${pointLatex([h, k])}$ in point-slope form, solve for $y$, then rearrange into standard form:${work}`,
            `${reason["zh-CN"]}写出过 $${pointLatex([h, k])}$ 的平行线的点斜式，化为斜截式，再整理成标准式：${work}`,
          ),
        });
      },
    },
    {
      id: "parallel-to-a-line-through-two-points",
      title: t("Parallel to a line through two points", "与过两点的直线平行"),
      explanation: t(
        "When the given line is described by two of its points, find its slope with the slope formula first.\n\nThe line through $A(1, -2)$ and $B(5, 4)$ has slope $\\frac{4 - (-2)}{5 - 1} = \\frac{3}{2}$. The parallel line through $(2, 7)$ is found by substituting the point:\n\n$$7 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; b = 4, \\qquad y = \\frac{3}{2}x + 4.$$",
        "如果已知直线由它上面的两点给出，先用斜率公式求斜率。\n\n过 $A(1, -2)$ 和 $B(5, 4)$ 的直线斜率是 $\\frac{4 - (-2)}{5 - 1} = \\frac{3}{2}$。代入点 $(2, 7)$ 求过它的平行线：\n\n$$7 = \\frac{3}{2} \\cdot 2 + b \\;\\Rightarrow\\; b = 4, \\qquad y = \\frac{3}{2}x + 4.$$",
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
        return equationProblem({
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
            `The slope of $AB$ is${steps(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}} = ${num(m)}`)}The parallel line has the same slope. Substitute $${pointLatex([h, k])}$ to find $b$:${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}So the line is $${answer}$.`,
            `$AB$ 的斜率是${steps(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}} = ${num(m)}`)}平行线的斜率相同。代入 $${pointLatex([h, k])}$ 求 $b$：${steps(`${k} = ${num(m)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}所以直线为 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "parallel-horizontal-and-vertical-lines",
      title: t("Parallel horizontal and vertical lines", "平行的水平线与竖直线"),
      explanation: t(
        "A line parallel to a **vertical** line is vertical too: every point on it has the same $x$-coordinate, so through $(h, k)$ it is $x = h$. A line parallel to a **horizontal** line is horizontal: through $(h, k)$ it is $y = k$.\n\nThe line through $(3, -4)$ parallel to $x = -1$ is $x = 3$; the line through $(3, -4)$ parallel to the $x$-axis is $y = -4$.",
        "与**竖直**直线平行的直线也是竖直的：它上面所有点的 $x$ 坐标相同，所以过 $(h, k)$ 的这条直线是 $x = h$。与**水平**直线平行的直线也是水平的：过 $(h, k)$ 的这条直线是 $y = k$。\n\n过 $(3, -4)$ 且与 $x = -1$ 平行的直线是 $x = 3$；过 $(3, -4)$ 且与 $x$ 轴平行的直线是 $y = -4$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        let c = rng.int(-9, 9);
        const own = kind === 0 ? h : k;
        if (c === own) c = own === 9 ? 8 : own + 1;
        const given = [
          t(`$x = ${c}$`, `$x = ${c}$`),
          t(`$y = ${c}$`, `$y = ${c}$`),
          t("the $y$-axis", "$y$ 轴"),
          t("the $x$-axis", "$x$ 轴"),
        ][kind]!;
        const vertical = kind === 0 || kind === 2;
        const answer = vertical ? `x = ${h}` : `y = ${k}`;
        const reason = vertical
          ? t(
              "The given line is vertical, so the parallel line is vertical too, and every point on it has the $x$-coordinate of the given point.",
              "已知直线是竖直的，所以平行线也是竖直的，它上面每一点的 $x$ 坐标都等于已知点的 $x$ 坐标。",
            )
          : t(
              "The given line is horizontal, so the parallel line is horizontal too, and every point on it has the $y$-coordinate of the given point.",
              "已知直线是水平的，所以平行线也是水平的，它上面每一点的 $y$ 坐标都等于已知点的 $y$ 坐标。",
            );
        return equationProblem({
          prompt: t(
            `Write the equation of the line through $${pointLatex([h, k])}$ parallel to ${given.en}.`,
            `写出过点 $${pointLatex([h, k])}$ 且与${given["zh-CN"]}平行的直线方程。`,
          ),
          answer,
          wrong: vertical ? [`y = ${k}`, `x = ${k}`, `y = ${h}`] : [`x = ${h}`, `y = ${h}`, `x = ${k}`],
          solution: t(`${reason.en} The line is $${answer}$.`, `${reason["zh-CN"]}这条直线是 $${answer}$。`),
        });
      },
    },
  ],
};

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
    { topic: "finding-equations-of-parallel-lines", weight: 0.4 },
    { topic: "point-slope-form", weight: 0.3 },
    { topic: "standard-form", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "perpendicular-line-in-point-slope-form",
      title: t("A perpendicular line in point-slope form", "用点斜式写垂线"),
      explanation: t(
        "A line perpendicular to a line of slope $m$ has the **negative reciprocal** slope $-\\frac{1}{m}$. With that slope and the point $(h, k)$, write $y - k = -\\frac{1}{m}(x - h)$.\n\nFor the line through $(1, -3)$ perpendicular to $2x + 5y = 10$: the given line is $y = -\\frac{2}{5}x + 2$, with slope $-\\frac{2}{5}$, so the perpendicular slope is $\\frac{5}{2}$ and\n\n$$y + 3 = \\frac{5}{2}(x - 1).$$",
        "与斜率为 $m$ 的直线垂直的直线，斜率是它的**负倒数** $-\\frac{1}{m}$。用这个斜率和点 $(h, k)$ 写出 $y - k = -\\frac{1}{m}(x - h)$。\n\n求过 $(1, -3)$ 且与 $2x + 5y = 10$ 垂直的直线：已知直线是 $y = -\\frac{2}{5}x + 2$，斜率为 $-\\frac{2}{5}$，所以垂线的斜率是 $\\frac{5}{2}$，\n\n$$y + 3 = \\frac{5}{2}(x - 1).$$",
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
        return equationProblem({
          prompt: t(
            `Write in point-slope form the equation of the line through $${pointLatex([h, k])}$ perpendicular to $${given}$.`,
            `用点斜式写出过点 $${pointLatex([h, k])}$ 且与 $${given}$ 垂直的直线方程。`,
          ),
          answer,
          form: "point-slope",
          wrong: [ps(m, h, k), ps(Q.one.div(m), h, k), ps(m.neg(), h, k), ps(p, -h, -k)],
          solution: t(
            `${reason.en} The perpendicular slope is its negative reciprocal, $${num(p)}$, so through $${pointLatex([h, k])}$ the line is${steps(answer)}`,
            `${reason["zh-CN"]}垂线的斜率是它的负倒数 $${num(p)}$，所以过 $${pointLatex([h, k])}$ 的垂线是${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "perpendicular-line-in-standard-form",
      title: t("A perpendicular line in standard form", "用标准式写垂线"),
      explanation: t(
        "Find the perpendicular slope, write the line in point-slope form, then rearrange it into standard form $Ax + By = C$ with integers and $A > 0$.\n\nThe line through $(2, 3)$ perpendicular to $y = 4x - 1$ has slope $-\\frac{1}{4}$:\n\n$$y - 3 = -\\frac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\frac{1}{4}x + \\frac{7}{2} \\;\\Rightarrow\\; x + 4y = 14.$$",
        "先求垂线的斜率，写出点斜式，再整理成标准式 $Ax + By = C$，其中系数是整数且 $A > 0$。\n\n过 $(2, 3)$ 且与 $y = 4x - 1$ 垂直的直线斜率是 $-\\frac{1}{4}$：\n\n$$y - 3 = -\\frac{1}{4}(x - 2) \\;\\Rightarrow\\; y = -\\frac{1}{4}x + \\frac{7}{2} \\;\\Rightarrow\\; x + 4y = 14.$$",
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
        const work = steps(ps(p, h, k), si(p, b), answer);
        return equationProblem({
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
            `${reason.en} The perpendicular slope is $${num(p)}$. Write the line through $${pointLatex([h, k])}$ in point-slope form, solve for $y$, then rearrange into standard form:${work}`,
            `${reason["zh-CN"]}垂线的斜率是 $${num(p)}$。写出过 $${pointLatex([h, k])}$ 的直线的点斜式，化为斜截式，再整理成标准式：${work}`,
          ),
        });
      },
    },
    {
      id: "perpendicular-to-a-line-through-two-points",
      title: t("Perpendicular to a line through two points", "与过两点的直线垂直"),
      explanation: t(
        "Find the slope of the given line from its two points, take the negative reciprocal, and substitute the point.\n\nThe line through $A(-1, 2)$ and $B(3, 4)$ has slope $\\frac{4 - 2}{3 - (-1)} = \\frac{1}{2}$, so a perpendicular line has slope $-2$. Through $(1, 5)$:\n\n$$5 = -2 \\cdot 1 + b \\;\\Rightarrow\\; b = 7, \\qquad y = -2x + 7.$$",
        "先由两点求已知直线的斜率，再取负倒数，然后代入已知点。\n\n过 $A(-1, 2)$ 和 $B(3, 4)$ 的直线斜率是 $\\frac{4 - 2}{3 - (-1)} = \\frac{1}{2}$，所以垂线的斜率是 $-2$。过 $(1, 5)$：\n\n$$5 = -2 \\cdot 1 + b \\;\\Rightarrow\\; b = 7, \\qquad y = -2x + 7.$$",
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
        return equationProblem({
          prompt: t(
            `Write in slope-intercept form the equation of the line through $${pointLatex([h, k])}$ perpendicular to the line through $${pt("A", A)}$ and $${pt("B", B)}$.`,
            `用斜截式写出过点 $${pointLatex([h, k])}$ 且与过 $${pt("A", A)}$、$${pt("B", B)}$ 的直线垂直的直线方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [si(m, interceptThrough(m, h, k)), si(inv, interceptThrough(inv, h, k)), si(p, Q.of(k).add(p.mul(Q.of(h))))],
          solution: t(
            `The slope of $AB$ is${steps(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}} = ${num(m)}`)}so the perpendicular slope is $${num(p)}$. Substitute $${pointLatex([h, k])}$ to find $b$:${steps(`${k} = ${num(p)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}So the line is $${answer}$.`,
            `$AB$ 的斜率是${steps(`m = \\frac{${B[1]} - ${paren(A[1])}}{${B[0]} - ${paren(A[0])}} = ${num(m)}`)}所以垂线的斜率是 $${num(p)}$。代入 $${pointLatex([h, k])}$ 求 $b$：${steps(`${k} = ${num(p)} \\cdot ${paren(h)} + b`, `b = ${num(b)}`)}所以直线为 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "perpendicular-horizontal-and-vertical-lines",
      title: t("Perpendicular horizontal and vertical lines", "互相垂直的水平线与竖直线"),
      explanation: t(
        "A horizontal line and a vertical line are perpendicular. So a line perpendicular to a **vertical** line is horizontal: through $(h, k)$ it is $y = k$. A line perpendicular to a **horizontal** line is vertical: through $(h, k)$ it is $x = h$.\n\nThe line through $(-5, 2)$ perpendicular to $x = 4$ is $y = 2$; the line through $(-5, 2)$ perpendicular to the $x$-axis is $x = -5$.",
        "水平直线与竖直直线互相垂直。所以与**竖直**直线垂直的直线是水平的：过 $(h, k)$ 的这条直线是 $y = k$。与**水平**直线垂直的直线是竖直的：过 $(h, k)$ 的这条直线是 $x = h$。\n\n过 $(-5, 2)$ 且与 $x = 4$ 垂直的直线是 $y = 2$；过 $(-5, 2)$ 且与 $x$ 轴垂直的直线是 $x = -5$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const c = rng.int(-9, 9);
        const given = [
          t(`$x = ${c}$`, `$x = ${c}$`),
          t(`$y = ${c}$`, `$y = ${c}$`),
          t("the $y$-axis", "$y$ 轴"),
          t("the $x$-axis", "$x$ 轴"),
        ][kind]!;
        const givenVertical = kind === 0 || kind === 2;
        const answer = givenVertical ? `y = ${k}` : `x = ${h}`;
        const reason = givenVertical
          ? t(
              "The given line is vertical, so a perpendicular line is horizontal, and every point on it has the $y$-coordinate of the given point.",
              "已知直线是竖直的，所以垂线是水平的，它上面每一点的 $y$ 坐标都等于已知点的 $y$ 坐标。",
            )
          : t(
              "The given line is horizontal, so a perpendicular line is vertical, and every point on it has the $x$-coordinate of the given point.",
              "已知直线是水平的，所以垂线是竖直的，它上面每一点的 $x$ 坐标都等于已知点的 $x$ 坐标。",
            );
        return equationProblem({
          prompt: t(
            `Write the equation of the line through $${pointLatex([h, k])}$ perpendicular to ${given.en}.`,
            `写出过点 $${pointLatex([h, k])}$ 且与${given["zh-CN"]}垂直的直线方程。`,
          ),
          answer,
          wrong: givenVertical ? [`x = ${h}`, `y = ${h}`, `x = ${k}`] : [`y = ${k}`, `x = ${k}`, `y = ${h}`],
          solution: t(`${reason.en} The line is $${answer}$.`, `${reason["zh-CN"]}这条直线是 $${answer}$。`),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Midpoints and partitions
// ---------------------------------------------------------------------------

/** midpointOf is the midpoint of A and B. */
const midpointOf = (a: Point, b: Point): [Q, Q] => [half(a[0] + b[0]), half(a[1] + b[1])];

/** midpointSteps writes the midpoint formula for A and B. */
function midpointSteps(a: Point, b: Point): string {
  const [mx, my] = midpointOf(a, b);
  return steps(
    `M = \\left(\\frac{${a[0]} + ${paren(b[0])}}{2}, \\frac{${a[1]} + ${paren(b[1])}}{2}\\right) = \\left(\\frac{${a[0] + b[0]}}{2}, \\frac{${a[1] + b[1]}}{2}\\right) = ${pointLatex([mx, my])}`,
  );
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
  encompasses: [
    { topic: "the-coordinate-plane", weight: 0.3 },
    { topic: "operations-with-rational-numbers", weight: 0.1 },
  ],
  xp: 10,
  standards: ["CCSS.HSG.GPE.B.6"],
  knowledgePoints: [
    {
      id: "the-midpoint-formula",
      title: t("The midpoint formula", "中点公式"),
      explanation: t(
        "The **midpoint** $M$ of a segment is the point halfway between its endpoints. Its coordinates are the averages of the endpoints' coordinates: for $A(x_1, y_1)$ and $B(x_2, y_2)$,\n\n$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$\n\nThe midpoint of $A(-3, 4)$ and $B(6, -2)$ is $\\left(\\frac{-3 + 6}{2}, \\frac{4 + (-2)}{2}\\right) = \\left(\\frac{3}{2}, 1\\right)$.",
        "线段的**中点** $M$ 是两个端点正中间的点。它的坐标是两个端点坐标的平均数：对 $A(x_1, y_1)$ 和 $B(x_2, y_2)$，\n\n$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right).$$\n\n$A(-3, 4)$ 与 $B(6, -2)$ 的中点是 $\\left(\\frac{-3 + 6}{2}, \\frac{4 + (-2)}{2}\\right) = \\left(\\frac{3}{2}, 1\\right)$。",
      ),
      generate(rng) {
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        let B: Point;
        do B = [rng.int(-9, 9), rng.int(-9, 9)];
        while (B[0] === A[0] && B[1] === A[1]);
        return pointProblem({
          prompt: t(
            `Find the midpoint of the segment with endpoints $${pt("A", A)}$ and $${pt("B", B)}$.`,
            `求以 $${pt("A", A)}$ 和 $${pt("B", B)}$ 为端点的线段的中点。`,
          ),
          answer: midpointOf(A, B),
          wrong: midpointWrong(A, B),
          solution: t(`Average the coordinates of the endpoints:${midpointSteps(A, B)}`, `求两个端点坐标的平均数：${midpointSteps(A, B)}`),
        });
      },
    },
    {
      id: "midpoint-from-a-graph",
      title: t("The midpoint of a graphed segment", "由图像求中点"),
      explanation: t(
        "To find the midpoint of a segment drawn on a grid, read the coordinates of its endpoints first, then average them. A segment from $A(-4, 1)$ to $B(2, 5)$ has midpoint $\\left(\\frac{-4 + 2}{2}, \\frac{1 + 5}{2}\\right) = (-1, 3)$.",
        "求网格上一条线段的中点，先读出两个端点的坐标，再求平均数。从 $A(-4, 1)$ 到 $B(2, 5)$ 的线段，中点是 $\\left(\\frac{-4 + 2}{2}, \\frac{1 + 5}{2}\\right) = (-1, 3)$。",
      ),
      generate(rng) {
        const A: Point = [rng.int(-6, 6), rng.int(-6, 6)];
        let B: Point;
        do B = [A[0] + 2 * rng.int(-4, 4), A[1] + 2 * rng.int(-4, 4)];
        while ((B[0] === A[0] && B[1] === A[1]) || Math.abs(B[0]) > 6 || Math.abs(B[1]) > 6);
        return {
          ...pointProblem({
            prompt: t("Find the midpoint of $\\overline{AB}$.", "求 $\\overline{AB}$ 的中点。"),
            answer: midpointOf(A, B),
            wrong: midpointWrong(A, B),
            solution: t(
              `From the graph, the endpoints are $${pt("A", A)}$ and $${pt("B", B)}$. Average their coordinates:${midpointSteps(A, B)}`,
              `从图中读出端点 $${pt("A", A)}$ 和 $${pt("B", B)}$。求它们坐标的平均数：${midpointSteps(A, B)}`,
            ),
          }),
          figure: shapeFigure(
            ["A", "B"],
            [A, B],
            `Segment AB in the coordinate plane, from ${listPts(["A", "B"], [A, B])}.`,
            `坐标平面中的线段 AB，端点为 ${listPts(["A", "B"], [A, B])}。`,
          ),
        };
      },
    },
    {
      id: "finding-an-endpoint",
      title: t("Finding an endpoint from the midpoint", "由中点求端点"),
      explanation: t(
        "If $M$ is the midpoint of $\\overline{AB}$, then going from $A$ to $M$ and the same again reaches $B$, so $B = 2M - A$, coordinate by coordinate: $x_B = 2x_M - x_A$ and $y_B = 2y_M - y_A$.\n\nWith $A(1, -3)$ and $M(4, 2)$: $B = (2 \\cdot 4 - 1, 2 \\cdot 2 - (-3)) = (7, 7)$.",
        "若 $M$ 是 $\\overline{AB}$ 的中点，从 $A$ 走到 $M$，再走同样的一段就到达 $B$，所以 $B = 2M - A$，逐个坐标计算：$x_B = 2x_M - x_A$，$y_B = 2y_M - y_A$。\n\n已知 $A(1, -3)$ 与 $M(4, 2)$：$B = (2 \\cdot 4 - 1, 2 \\cdot 2 - (-3)) = (7, 7)$。",
      ),
      generate(rng) {
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        let M: Point;
        do M = [rng.int(-8, 8), rng.int(-8, 8)];
        while (M[0] === A[0] && M[1] === A[1]);
        const B: Point = [2 * M[0] - A[0], 2 * M[1] - A[1]];
        return pointProblem({
          prompt: t(
            `$M${pointLatex(M)}$ is the midpoint of $\\overline{AB}$, and $${pt("A", A)}$. Find the coordinates of $B$.`,
            `$M${pointLatex(M)}$ 是 $\\overline{AB}$ 的中点，且 $${pt("A", A)}$。求 $B$ 的坐标。`,
          ),
          answer: B,
          wrong: [midpointOf(A, M), [M[0] - A[0], M[1] - A[1]], [2 * A[0] - M[0], 2 * A[1] - M[1]]],
          solution: t(
            `Each coordinate of $M$ is the average of those of $A$ and $B$, so $B = 2M - A$:${steps(`x_B = 2 \\cdot ${paren(M[0])} - ${paren(A[0])} = ${B[0]}`, `y_B = 2 \\cdot ${paren(M[1])} - ${paren(A[1])} = ${B[1]}`)}So $${pt("B", B)}$.`,
            `$M$ 的每个坐标都是 $A$、$B$ 对应坐标的平均数，所以 $B = 2M - A$：${steps(`x_B = 2 \\cdot ${paren(M[0])} - ${paren(A[0])} = ${B[0]}`, `y_B = 2 \\cdot ${paren(M[1])} - ${paren(A[1])} = ${B[1]}`)}所以 $${pt("B", B)}$。`,
          ),
        });
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

/** partitioningLineSegments finds the point that divides a segment in a given fraction or ratio. */
export const partitioningLineSegments: TopicDef = {
  id: "partitioning-line-segments",
  title: t("Partitioning Line Segments", "线段的定比分点"),
  summary: t(
    "Find the point a given fraction of the way along a segment, the point that divides it in a given ratio, and an endpoint from such a point.",
    "求线段上从一端起若干分之几处的点、按给定比分割线段的点，并由分点求端点。",
  ),
  prerequisites: ["midpoints-in-the-coordinate-plane", "ratios"],
  encompasses: [
    { topic: "midpoints-in-the-coordinate-plane", weight: 0.4 },
    { topic: "ratios", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.6"],
  knowledgePoints: [
    {
      id: "a-fraction-of-the-way",
      title: t("A fraction of the way along a segment", "线段上若干分之几处的点"),
      explanation: t(
        "To go a fraction $f$ of the way from $A$ to $B$, find the change from $A$ to $B$ in each coordinate, take the fraction $f$ of it, and add the result to $A$:\n\n$$P = \\big(x_A + f(x_B - x_A),\\; y_A + f(y_B - y_A)\\big).$$\n\nFrom $A(1, 2)$ to $B(10, 8)$ the change is $(9, 6)$. Two thirds of it is $(6, 4)$, so the point $\\frac{2}{3}$ of the way from $A$ to $B$ is $(1 + 6, 2 + 4) = (7, 6)$. (The midpoint is the case $f = \\frac{1}{2}$.)",
        "要找从 $A$ 到 $B$ 的 $f$ 处的点，先求从 $A$ 到 $B$ 每个坐标的变化量，取其 $f$ 倍，再加到 $A$ 上：\n\n$$P = \\big(x_A + f(x_B - x_A),\\; y_A + f(y_B - y_A)\\big).$$\n\n从 $A(1, 2)$ 到 $B(10, 8)$ 的变化量是 $(9, 6)$，它的 $\\frac{2}{3}$ 是 $(6, 4)$，所以从 $A$ 到 $B$ 的 $\\frac{2}{3}$ 处的点是 $(1 + 6, 2 + 4) = (7, 6)$。（中点就是 $f = \\frac{1}{2}$ 的情形。）",
      ),
      generate(rng) {
        const [k, n] = rng.pick(fractionsOfTheWay);
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const B: Point = [A[0] + n * u, A[1] + n * v];
        const P: Point = [A[0] + k * u, A[1] + k * v];
        const f = `\\frac{${k}}{${n}}`;
        return pointProblem({
          prompt: t(
            `Find the point $P$ that is $${f}$ of the way from $${pt("A", A)}$ to $${pt("B", B)}$.`,
            `求从 $${pt("A", A)}$ 到 $${pt("B", B)}$ 的 $${f}$ 处的点 $P$。`,
          ),
          answer: P,
          wrong: [[B[0] - k * u, B[1] - k * v], [Q.of(k * B[0], n), Q.of(k * B[1], n)], midpointOf(A, B)],
          solution: t(
            `The change from $A$ to $B$ is $(${n * u}, ${n * v})$, and $${f}$ of it is $(${k * u}, ${k * v})$. Add it to $A$:${steps(`P = (${A[0]} + ${paren(k * u)}, ${A[1]} + ${paren(k * v)}) = ${pointLatex(P)}`)}`,
            `从 $A$ 到 $B$ 的变化量是 $(${n * u}, ${n * v})$，它的 $${f}$ 是 $(${k * u}, ${k * v})$。加到 $A$ 上：${steps(`P = (${A[0]} + ${paren(k * u)}, ${A[1]} + ${paren(k * v)}) = ${pointLatex(P)}`)}`,
          ),
        });
      },
    },
    {
      id: "partitioning-in-a-ratio",
      title: t("Partitioning a segment in a ratio", "按比分割线段"),
      explanation: t(
        "A point $P$ on $\\overline{AB}$ with $AP : PB = a : b$ splits the segment into $a + b$ equal parts, $a$ of them between $A$ and $P$. So $P$ is $\\frac{a}{a + b}$ of the way from $A$ to $B$.\n\nFor $A(-2, 7)$, $B(8, -3)$ and $AP : PB = 2 : 3$, $P$ is $\\frac{2}{5}$ of the way. The change is $(10, -10)$, two fifths of it is $(4, -4)$, so $P = (2, 3)$.",
        "$\\overline{AB}$ 上的点 $P$ 满足 $AP : PB = a : b$，就是把线段分成 $a + b$ 等份，其中 $a$ 份在 $A$ 与 $P$ 之间。所以 $P$ 在从 $A$ 到 $B$ 的 $\\frac{a}{a + b}$ 处。\n\n对 $A(-2, 7)$、$B(8, -3)$ 且 $AP : PB = 2 : 3$，$P$ 在 $\\frac{2}{5}$ 处。变化量是 $(10, -10)$，它的五分之二是 $(4, -4)$，所以 $P = (2, 3)$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(partRatios);
        const n = a + b;
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const B: Point = [A[0] + n * u, A[1] + n * v];
        const P: Point = [A[0] + a * u, A[1] + a * v];
        const f = `\\frac{${a}}{${n}}`;
        return pointProblem({
          prompt: t(
            `Point $P$ lies on $\\overline{AB}$ with $AP : PB = ${a} : ${b}$, where $${pt("A", A)}$ and $${pt("B", B)}$. Find the coordinates of $P$.`,
            `点 $P$ 在 $\\overline{AB}$ 上，且 $AP : PB = ${a} : ${b}$，其中 $${pt("A", A)}$，$${pt("B", B)}$。求 $P$ 的坐标。`,
          ),
          answer: P,
          wrong: [[A[0] + b * u, A[1] + b * v], [Q.of(A[0]).add(Q.of(a * n * u, b)), Q.of(A[1]).add(Q.of(a * n * v, b))], midpointOf(A, B)],
          solution: t(
            `The ratio $${a} : ${b}$ splits $\\overline{AB}$ into $${n}$ equal parts, so $P$ is $${f}$ of the way from $A$ to $B$. The change from $A$ to $B$ is $(${n * u}, ${n * v})$, and $${f}$ of it is $(${a * u}, ${a * v})$:${steps(`P = (${A[0]} + ${paren(a * u)}, ${A[1]} + ${paren(a * v)}) = ${pointLatex(P)}`)}`,
            `比 $${a} : ${b}$ 把 $\\overline{AB}$ 分成 $${n}$ 等份，所以 $P$ 在从 $A$ 到 $B$ 的 $${f}$ 处。从 $A$ 到 $B$ 的变化量是 $(${n * u}, ${n * v})$，它的 $${f}$ 是 $(${a * u}, ${a * v})$：${steps(`P = (${A[0]} + ${paren(a * u)}, ${A[1]} + ${paren(a * v)}) = ${pointLatex(P)}`)}`,
          ),
        });
      },
    },
    {
      id: "an-endpoint-from-a-partition-point",
      title: t("An endpoint from a partition point", "由分点求端点"),
      explanation: t(
        "If $AP : PB = a : b$, the segment $\\overline{AP}$ is $a$ of the $a + b$ equal parts of $\\overline{AB}$. Divide the change from $A$ to $P$ by $a$ to get one part, then add $a + b$ parts to $A$.\n\nFor $A(1, 1)$, $P(5, 3)$ and $AP : PB = 2 : 1$: one part is $\\frac{1}{2}(4, 2) = (2, 1)$, and $\\overline{AB}$ has $3$ parts, so $B = (1 + 6, 1 + 3) = (7, 4)$.",
        "若 $AP : PB = a : b$，则 $\\overline{AP}$ 占 $\\overline{AB}$ 的 $a + b$ 等份中的 $a$ 份。把从 $A$ 到 $P$ 的变化量除以 $a$ 得到一份，再从 $A$ 加上 $a + b$ 份。\n\n对 $A(1, 1)$、$P(5, 3)$ 且 $AP : PB = 2 : 1$：一份是 $\\frac{1}{2}(4, 2) = (2, 1)$，$\\overline{AB}$ 共 $3$ 份，所以 $B = (1 + 6, 1 + 3) = (7, 4)$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(partRatios);
        const n = a + b;
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const [u, v] = stepVector(rng, A, n);
        const P: Point = [A[0] + a * u, A[1] + a * v];
        const B: Point = [A[0] + n * u, A[1] + n * v];
        return pointProblem({
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
            `The change from $A$ to $P$ is $(${a * u}, ${a * v})$, which is $${a}$ of the $${n}$ equal parts, so one part is $(${u}, ${v})$. Add $${n}$ parts to $A$:${steps(`B = (${A[0]} + ${n} \\cdot ${paren(u)}, ${A[1]} + ${n} \\cdot ${paren(v)}) = ${pointLatex(B)}`)}`,
            `从 $A$ 到 $P$ 的变化量是 $(${a * u}, ${a * v})$，占 $${n}$ 等份中的 $${a}$ 份，所以一份是 $(${u}, ${v})$。从 $A$ 加上 $${n}$ 份：${steps(`B = (${A[0]} + ${n} \\cdot ${paren(u)}, ${A[1]} + ${n} \\cdot ${paren(v)}) = ${pointLatex(B)}`)}`,
          ),
        });
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
    { topic: "simplifying-square-roots", weight: 0.2 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
    { topic: "the-coordinate-plane", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.8.G.B.8", "CCSS.HSG.GPE.B.7"],
  knowledgePoints: [
    {
      id: "distance-with-a-whole-number-answer",
      title: t("The distance formula", "距离公式"),
      explanation: t(
        "The segment from $A(x_1, y_1)$ to $B(x_2, y_2)$ is the hypotenuse of a right triangle whose legs are the horizontal change $x_2 - x_1$ and the vertical change $y_2 - y_1$. By the Pythagorean theorem,\n\n$$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$\n\nFor $A(-2, 1)$ and $B(4, 9)$ the legs are $6$ and $8$, so $AB = \\sqrt{36 + 64} = \\sqrt{100} = 10$. The order of the points does not matter, because the changes are squared.",
        "从 $A(x_1, y_1)$ 到 $B(x_2, y_2)$ 的线段是一个直角三角形的斜边，两条直角边是横向变化量 $x_2 - x_1$ 和纵向变化量 $y_2 - y_1$。由勾股定理，\n\n$$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$\n\n对 $A(-2, 1)$ 和 $B(4, 9)$，两条直角边是 $6$ 和 $8$，所以 $AB = \\sqrt{36 + 64} = \\sqrt{100} = 10$。由于变化量要平方，两点的先后顺序不影响结果。",
      ),
      figure: distanceExample,
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const A: Point = [rng.int(-9, 9), rng.int(-9, 9)];
        const B: Point = [A[0] + rng.sign() * p, A[1] + rng.sign() * q];
        const [dx, dy] = [B[0] - A[0], B[1] - A[1]];
        return numberProblem({
          prompt: t(`Find the distance between $${pt("A", A)}$ and $${pt("B", B)}$.`, `求 $${pt("A", A)}$ 与 $${pt("B", B)}$ 之间的距离。`),
          answer: c,
          wrong: [p + q, c * c, Math.abs(dx + dy)],
          solution: t(
            `Use the distance formula:${steps(`AB = ${distanceSteps(A, B)}`)}`,
            `用距离公式：${steps(`AB = ${distanceSteps(A, B)}`)}`,
          ),
        });
      },
    },
    {
      id: "distance-in-simplest-radical-form",
      title: t("Distances in simplest radical form", "用最简根式表示距离"),
      explanation: t(
        "Usually the sum of the squares is not a perfect square; then write the distance in simplest radical form.\n\nFor $A(3, -1)$ and $B(-1, 3)$: $AB = \\sqrt{(-4)^2 + 4^2} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}$.",
        "通常平方和不是完全平方数，这时把距离写成最简根式。\n\n对 $A(3, -1)$ 和 $B(-1, 3)$：$AB = \\sqrt{(-4)^2 + 4^2} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}$。",
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
        return radicalProblem({
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
            `Use the distance formula:${steps(`AB = ${distanceSteps(A, B)}`)}`,
            `用距离公式：${steps(`AB = ${distanceSteps(A, B)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-a-missing-coordinate",
      title: t("A missing coordinate from a distance", "由距离求未知坐标"),
      explanation: t(
        "If a distance is known but a coordinate is not, put the distance into the formula, square both sides, and solve. There are usually **two** answers, one on each side.\n\nThe point $(4, y)$ is $5$ units from $(1, 2)$:\n\n$$(4 - 1)^2 + (y - 2)^2 = 25 \\;\\Rightarrow\\; (y - 2)^2 = 16 \\;\\Rightarrow\\; y - 2 = \\pm 4,$$\n\nso $y = 6$ or $y = -2$.",
        "如果已知距离而某个坐标未知，就把距离代入公式，两边平方后求解。通常有**两个**答案，分别在两侧。\n\n点 $(4, y)$ 到 $(1, 2)$ 的距离是 $5$：\n\n$$(4 - 1)^2 + (y - 2)^2 = 25 \\;\\Rightarrow\\; (y - 2)^2 = 16 \\;\\Rightarrow\\; y - 2 = \\pm 4,$$\n\n所以 $y = 6$ 或 $y = -2$。",
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
        const values = [String(base + q), String(base - q)];
        return solutionsProblem({
          prompt: t(
            `The point $${other}$ is $${c}$ units from $${pointLatex(A)}$. Find all possible values of $${v}$.`,
            `点 $${other}$ 到 $${pointLatex(A)}$ 的距离是 $${c}$。求 $${v}$ 的所有可能值。`,
          ),
          values,
          variable: v,
          wrong: [[String(base + q)], [String(base - q)], [String(base + c), String(base - c)], [String(q), String(-q)]],
          solution: t(
            `Square the distance formula and solve:${steps(`${square} = ${c}^2`, `${paren(d)}^2 + ${shifted}^2 = ${c * c}`, `${shifted}^2 = ${q * q}`, `${linear(1, -base, v)} = \\pm ${q}`)}So $${v} = ${base + q}$ or $${v} = ${base - q}$.`,
            `把距离公式两边平方后求解：${steps(`${square} = ${c}^2`, `${paren(d)}^2 + ${shifted}^2 = ${c * c}`, `${shifted}^2 = ${q * q}`, `${linear(1, -base, v)} = \\pm ${q}`)}所以 $${v} = ${base + q}$ 或 $${v} = ${base - q}$。`,
          ),
        });
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

/** footSteps explains how to find the foot of the perpendicular from P to the line. */
function footSteps(s: PerpSetup): Text {
  const { P, F, m, b } = s;
  const p = Q.one.div(m).neg();
  const bp = interceptThrough(p, P[0], P[1]);
  const reason = slopeOf(m, b, s.standard);
  const work = steps(`${linear(m, b)} = ${linear(p, bp)}`, `${linear(m.sub(p), 0)} = ${num(bp.sub(b))}`, `x = ${F[0]}`);
  const yStep = steps(`y = ${num(m)} \\cdot ${paren(F[0])}${b.isZero() ? "" : ` ${b.sign() < 0 ? "-" : "+"} ${num(b.abs())}`} = ${F[1]}`);
  return t(
    `${reason.en} The perpendicular through $P$ has slope $${num(p)}$; substituting $P$ gives $${si(p, bp)}$. Set the two equations equal:${work}Then${yStep}So the foot of the perpendicular is $F${pointLatex(F)}$.`,
    `${reason["zh-CN"]}过 $P$ 的垂线斜率为 $${num(p)}$；代入 $P$ 得 $${si(p, bp)}$。令两个方程相等：${work}于是${yStep}所以垂足是 $F${pointLatex(F)}$。`,
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
  knowledgePoints: [
    {
      id: "distance-to-horizontal-and-vertical-lines",
      title: t("Distance to a horizontal or vertical line", "点到水平线或竖直线的距离"),
      explanation: t(
        "The **distance from a point to a line** is the length of the shortest segment joining them, which is the segment **perpendicular** to the line.\n\nTo a vertical line $x = a$ the perpendicular is horizontal, so the distance from $(x_0, y_0)$ is $|x_0 - a|$. To a horizontal line $y = c$ it is $|y_0 - c|$. The point $(-3, 5)$ is $|-3 - 4| = 7$ units from $x = 4$ and $|5 - (-1)| = 6$ units from $y = -1$.",
        "**点到直线的距离**是连接它们的最短线段的长度，这条线段**垂直**于直线。\n\n到竖直直线 $x = a$ 的垂线段是水平的，所以点 $(x_0, y_0)$ 到它的距离是 $|x_0 - a|$。到水平直线 $y = c$ 的距离是 $|y_0 - c|$。点 $(-3, 5)$ 到 $x = 4$ 的距离是 $|-3 - 4| = 7$，到 $y = -1$ 的距离是 $|5 - (-1)| = 6$。",
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
        return {
          ...numberProblem({
            prompt: t(
              `Find the distance from the point $P${pointLatex(P)}$ to ${given.en}.`,
              `求点 $P${pointLatex(P)}$ 到${given["zh-CN"]}的距离。`,
            ),
            answer,
            wrong: [Math.abs(otherCoord - c), Math.abs(coord + c), Math.abs(coord) + Math.abs(c)],
            solution: t(
              `The line is $${lineEq}$, which is ${vertical ? "vertical" : "horizontal"}, so the shortest segment from $P$ to it is ${vertical ? "horizontal" : "vertical"}. Only the $${v}$-coordinates differ:${steps(`|${coord} - ${paren(c)}| = ${answer}`)}`,
              `这条直线是 $${lineEq}$，它是${vertical ? "竖直" : "水平"}的，所以从 $P$ 到它的最短线段是${vertical ? "水平" : "竖直"}的，只有 $${v}$ 坐标不同：${steps(`|${coord} - ${paren(c)}| = ${answer}`)}`,
            ),
          }),
          figure: {
            svg: plane(fitView([P, vertical ? [c, P[1]] : [P[0], c]]), [
              vertical ? { kind: "line", a: [c, 0], b: [c, 1], accent: true } : { kind: "line", a: [0, c], b: [1, c], accent: true },
              { kind: "point", at: P, label: "P", dir: "ne" },
            ]),
            alt: t(`The point P${plainPt(P)} and the line ${lineEq}.`, `点 P${plainPt(P)} 和直线 ${lineEq}。`),
          },
        };
      },
    },
    {
      id: "the-foot-of-the-perpendicular",
      title: t("The foot of the perpendicular", "垂足"),
      explanation: t(
        "The point of a line closest to a point $P$ is the **foot of the perpendicular** $F$: where the line through $P$ perpendicular to the given line meets it.\n\n1. Write the perpendicular through $P$, with the negative reciprocal slope.\n2. Solve the two equations together to find their intersection.\n\nFor $P(1, 7)$ and $y = 2x$: the perpendicular through $P$ is $y = -\\frac{1}{2}x + \\frac{15}{2}$. Setting $2x = -\\frac{1}{2}x + \\frac{15}{2}$ gives $x = 3$, then $y = 6$, so $F = (3, 6)$.",
        "直线上离点 $P$ 最近的点是**垂足** $F$：过 $P$ 作已知直线的垂线，垂线与已知直线的交点。\n\n1. 用负倒数斜率写出过 $P$ 的垂线。\n2. 把两个方程联立，求交点。\n\n对 $P(1, 7)$ 和 $y = 2x$：过 $P$ 的垂线是 $y = -\\frac{1}{2}x + \\frac{15}{2}$。令 $2x = -\\frac{1}{2}x + \\frac{15}{2}$，得 $x = 3$，于是 $y = 6$，所以 $F = (3, 6)$。",
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
        return pointProblem({
          prompt: t(
            `Find the point on the line $${line}$ that is closest to $P${pointLatex(P)}$.`,
            `求直线 $${line}$ 上离点 $P${pointLatex(P)}$ 最近的点。`,
          ),
          answer: F,
          wrong,
          solution: footSteps(s),
        });
      },
    },
    {
      id: "distance-from-a-point-to-a-line",
      title: t("The distance from a point to a line", "点到直线的距离"),
      explanation: t(
        "To find the distance from $P$ to a slanted line, find the foot of the perpendicular $F$, then the distance $PF$ with the distance formula.\n\nFor $P(1, 7)$ and $y = 2x$, the foot is $F(3, 6)$, so the distance is $\\sqrt{(3 - 1)^2 + (6 - 7)^2} = \\sqrt{5}$. (The distance from $(x_0, y_0)$ to $Ax + By = C$ is also given by the formula $\\frac{|Ax_0 + By_0 - C|}{\\sqrt{A^2 + B^2}}$, which you can use to check: $\\frac{|2 \\cdot 1 - 7|}{\\sqrt{5}} = \\sqrt{5}$.)",
        "求点 $P$ 到一条斜线的距离，先求垂足 $F$，再用距离公式求 $PF$。\n\n对 $P(1, 7)$ 和 $y = 2x$，垂足是 $F(3, 6)$，所以距离是 $\\sqrt{(3 - 1)^2 + (6 - 7)^2} = \\sqrt{5}$。（点 $(x_0, y_0)$ 到 $Ax + By = C$ 的距离也可以用公式 $\\frac{|Ax_0 + By_0 - C|}{\\sqrt{A^2 + B^2}}$ 计算，可用来检验：$\\frac{|2 \\cdot 1 - 7|}{\\sqrt{5}} = \\sqrt{5}$。）",
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
        return radicalProblem({
          prompt: t(
            `Find the distance from the point $P${pointLatex(P)}$ to the line $${line}$. Write it in simplest radical form.`,
            `求点 $P${pointLatex(P)}$ 到直线 $${line}$ 的距离，用最简根式表示。`,
          ),
          answer: simplifyRadical(n),
          wrong: [num(vertical), num(horizontal), String(n)],
          solution: t(`${foot.en} The distance is${dist}`, `${foot["zh-CN"]}距离为${dist}`),
        });
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
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "adding-and-subtracting-radicals", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GPE.B.7"],
  knowledgePoints: [
    {
      id: "perimeters-with-whole-number-sides",
      title: t("Perimeters with whole-number sides", "边长为整数的周长"),
      explanation: t(
        "The perimeter of a polygon is the sum of its side lengths. In the coordinate plane, find each side with the distance formula; a horizontal or vertical side is just the difference of the coordinates that change.\n\nTriangle $A(0, 0)$, $B(6, 0)$, $C(6, 8)$ has $AB = 6$, $BC = 8$ and $CA = \\sqrt{6^2 + 8^2} = 10$, so its perimeter is $6 + 8 + 10 = 24$.",
        "多边形的周长是各边长度之和。在坐标平面中，用距离公式求每条边；水平或竖直的边只需把变化的坐标相减。\n\n三角形 $A(0, 0)$、$B(6, 0)$、$C(6, 8)$ 中，$AB = 6$，$BC = 8$，$CA = \\sqrt{6^2 + 8^2} = 10$，所以周长是 $6 + 8 + 10 = 24$。",
      ),
      generate(rng) {
        const s = wholeShape(rng);
        const sides = sidesOf(s.pts).map((n) => Math.sqrt(n));
        const answer = sides.reduce((a, b) => a + b, 0);
        const taxi = s.pts.reduce((acc, p, i) => {
          const r = s.pts[(i + 1) % s.pts.length]!;
          return acc + Math.abs(r[0] - p[0]) + Math.abs(r[1] - p[1]);
        }, 0);
        const name = shapeName(s);
        return {
          ...numberProblem({
            prompt: t(
              `Find the perimeter of ${name.en} with vertices ${listTex(s.names, s.pts, "and")}.`,
              `求${name["zh-CN"]}的周长，顶点为 ${listZh(s.names, s.pts)}。`,
            ),
            answer,
            wrong: [taxi, answer / 2, sides.slice(0, -1).reduce((a, b) => a + b, 0)],
            solution: t(
              `Find the length of each side:${sideSteps(s)}Add them: the perimeter is $${sides.join(" + ")} = ${answer}$.`,
              `求每条边的长度：${sideSteps(s)}相加，周长是 $${sides.join(" + ")} = ${answer}$。`,
            ),
          }),
          figure: shapeFigureOf(s),
        };
      },
    },
    {
      id: "perimeters-in-simplest-radical-form",
      title: t("Perimeters in simplest radical form", "用最简根式表示周长"),
      explanation: t(
        "When some sides are irrational, write each side in simplest radical form, then add: combine whole numbers, and combine like radicals.\n\nTriangle $A(0, 0)$, $B(4, 0)$, $C(2, 4)$ has $AB = 4$, $BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20} = 2\\sqrt{5}$ and $CA = \\sqrt{(-2)^2 + (-4)^2} = 2\\sqrt{5}$, so its perimeter is $4 + 4\\sqrt{5}$.",
        "有的边长是无理数时，先把每条边写成最简根式，再相加：整数与整数合并，同类根式与同类根式合并。\n\n三角形 $A(0, 0)$、$B(4, 0)$、$C(2, 4)$ 中，$AB = 4$，$BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20} = 2\\sqrt{5}$，$CA = \\sqrt{(-2)^2 + (-4)^2} = 2\\sqrt{5}$，所以周长是 $4 + 4\\sqrt{5}$。",
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
        const taxi = s.pts.reduce((acc, p, i) => {
          const r = s.pts[(i + 1) % s.pts.length]!;
          return acc + Math.abs(r[0] - p[0]) + Math.abs(r[1] - p[1]);
        }, 0);
        const name = shapeName(s);
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
              `Find the length of each side:${sideSteps(s)}Add them, combining like terms:${steps(`${terms} = ${answer}`)}`,
              `求每条边的长度：${sideSteps(s)}相加并合并同类项：${steps(`${terms} = ${answer}`)}`,
            ),
          }),
          figure: shapeFigureOf(s),
        };
      },
    },
  ],
};

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
    { topic: "simplifying-square-roots", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.GPE.B.7"],
  knowledgePoints: [
    {
      id: "rectangles-with-horizontal-and-vertical-sides",
      title: t("Rectangles with horizontal and vertical sides", "边水平、竖直的矩形"),
      explanation: t(
        "When the sides of a rectangle are horizontal and vertical, its width is the difference of the $x$-coordinates and its height the difference of the $y$-coordinates.\n\nThe rectangle with vertices $A(-3, -1)$, $B(4, -1)$, $C(4, 5)$ and $D(-3, 5)$ has width $4 - (-3) = 7$ and height $5 - (-1) = 6$, so its area is $7 \\cdot 6 = 42$.",
        "矩形的边水平和竖直时，宽是 $x$ 坐标之差，高是 $y$ 坐标之差。\n\n顶点为 $A(-3, -1)$、$B(4, -1)$、$C(4, 5)$、$D(-3, 5)$ 的矩形，宽为 $4 - (-3) = 7$，高为 $5 - (-1) = 6$，所以面积是 $7 \\cdot 6 = 42$。",
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
        const problem = numberProblem({
          prompt,
          answer: w * h,
          wrong: [2 * (w + h), w + h, (w + 1) * (h + 1)],
          solution: t(
            `The width is the difference of the $x$-coordinates and the height the difference of the $y$-coordinates:${steps(`w = ${x2} - ${paren(x1)} = ${w}`, `h = ${y2} - ${paren(y1)} = ${h}`, `A = ${w} \\cdot ${h} = ${w * h}`)}`,
            `宽是 $x$ 坐标之差，高是 $y$ 坐标之差：${steps(`w = ${x2} - ${paren(x1)} = ${w}`, `h = ${y2} - ${paren(y1)} = ${h}`, `A = ${w} \\cdot ${h} = ${w * h}`)}`,
          ),
        });
        return opposite
          ? problem
          : {
              ...problem,
              figure: shapeFigure(
                names,
                pts,
                `Rectangle ABCD with vertices ${listPts(names, pts)}.`,
                `矩形 ABCD，顶点为 ${listPts(names, pts)}。`,
              ),
            };
      },
    },
    {
      id: "tilted-rectangles",
      title: t("Tilted rectangles", "倾斜的矩形"),
      explanation: t(
        "When the sides are slanted, find the length and the width with the distance formula, then multiply.\n\nRectangle $A(0, 0)$, $B(2, 1)$, $C(0, 5)$, $D(-2, 4)$ has $AB = \\sqrt{2^2 + 1^2} = \\sqrt{5}$ and $BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20}$, so its area is $\\sqrt{5} \\cdot \\sqrt{20} = \\sqrt{100} = 10$. (Multiplying the width and height of the rectangle around it, $4 \\cdot 5 = 20$, would be wrong.)",
        "边是斜的时，用距离公式求长和宽，再相乘。\n\n矩形 $A(0, 0)$、$B(2, 1)$、$C(0, 5)$、$D(-2, 4)$ 中，$AB = \\sqrt{2^2 + 1^2} = \\sqrt{5}$，$BC = \\sqrt{(-2)^2 + 4^2} = \\sqrt{20}$，所以面积是 $\\sqrt{5} \\cdot \\sqrt{20} = \\sqrt{100} = 10$。（用外面那个水平竖直矩形的宽乘高 $4 \\cdot 5 = 20$ 是错误的。）",
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
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const box = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of rectangle $ABCD$ with vertices ${listTex(names, pts, "and")}.`,
              `求矩形 $ABCD$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer: area,
            wrong: [box, n1 * n2, n1 + n2],
            solution: t(
              `Find the length and the width with the distance formula:${steps(`AB = ${distanceSteps(pts[0]!, pts[1]!)}`, `BC = ${distanceSteps(pts[1]!, pts[2]!)}`)}Multiply them:${steps(`AB \\cdot BC = \\sqrt{${n1}} \\cdot \\sqrt{${n2}} = \\sqrt{${n1 * n2}} = ${area}`)}`,
              `用距离公式求长和宽：${steps(`AB = ${distanceSteps(pts[0]!, pts[1]!)}`, `BC = ${distanceSteps(pts[1]!, pts[2]!)}`)}相乘：${steps(`AB \\cdot BC = \\sqrt{${n1}} \\cdot \\sqrt{${n2}} = \\sqrt{${n1 * n2}} = ${area}`)}`,
            ),
          }),
          figure: shapeFigure(
            names,
            pts,
            `Rectangle ABCD with vertices ${listPts(names, pts)}.`,
            `矩形 ABCD，顶点为 ${listPts(names, pts)}。`,
          ),
        };
      },
    },
    {
      id: "squares-from-two-vertices",
      title: t("Squares from two vertices", "由两个顶点求正方形面积"),
      explanation: t(
        "Two vertices are enough for the area of a square.\n\n- **Adjacent** vertices give a side $s$, and the area is $s^2$. With $A(1, 2)$ and $B(4, 4)$, $s^2 = 3^2 + 2^2 = 13$, so the area is $13$: there is no need to take the square root.\n- **Opposite** vertices give a diagonal $d$. The diagonal of a square is $s\\sqrt{2}$, so $d^2 = 2s^2$ and the area is $\\frac{d^2}{2}$. With $A(1, 2)$ and $C(4, 4)$, the area is $\\frac{13}{2}$.",
        "已知两个顶点就能求正方形的面积。\n\n- **相邻**的两个顶点给出边长 $s$，面积是 $s^2$。对 $A(1, 2)$ 与 $B(4, 4)$，$s^2 = 3^2 + 2^2 = 13$，所以面积是 $13$，不必开平方。\n- **相对**的两个顶点给出对角线 $d$。正方形的对角线是 $s\\sqrt{2}$，所以 $d^2 = 2s^2$，面积是 $\\frac{d^2}{2}$。对 $A(1, 2)$ 与 $C(4, 4)$，面积是 $\\frac{13}{2}$。",
      ),
      generate(rng) {
        const A: Point = [rng.int(-8, 8), rng.int(-8, 8)];
        const B: Point = [A[0] + rng.nonZero(-7, 7), A[1] + rng.nonZero(-7, 7)];
        const n = sq(A, B);
        const diagonal = rng.bool();
        const [dx, dy] = [Math.abs(B[0] - A[0]), Math.abs(B[1] - A[1])];
        const other = diagonal ? "C" : "B";
        const answer = diagonal ? Q.of(n, 2) : Q.of(n);
        return numberProblem({
          prompt: diagonal
            ? t(
                `Square $ABCD$ has opposite vertices $${pt("A", A)}$ and $${pt("C", B)}$. Find its area.`,
                `正方形 $ABCD$ 的两个相对顶点是 $${pt("A", A)}$ 和 $${pt("C", B)}$。求它的面积。`,
              )
            : t(
                `Square $ABCD$ has adjacent vertices $${pt("A", A)}$ and $${pt("B", B)}$. Find its area.`,
                `正方形 $ABCD$ 的两个相邻顶点是 $${pt("A", A)}$ 和 $${pt("B", B)}$。求它的面积。`,
              ),
          answer,
          wrong: diagonal ? [n, dx * dy, Q.of(n, 4)] : [Q.of(n, 2), dx * dy, (dx + dy) ** 2],
          solution: diagonal
            ? t(
                `$AC$ is a diagonal. Its square is${steps(`AC^2 = ${dx}^2 + ${dy}^2 = ${n}`)}Since the diagonal is $s\\sqrt{2}$, $AC^2 = 2s^2$, so the area is${steps(`s^2 = \\frac{AC^2}{2} = ${answer.toLatex()}`)}`,
                `$AC$ 是对角线，它的平方是${steps(`AC^2 = ${dx}^2 + ${dy}^2 = ${n}`)}因为对角线是 $s\\sqrt{2}$，所以 $AC^2 = 2s^2$，面积是${steps(`s^2 = \\frac{AC^2}{2} = ${answer.toLatex()}`)}`,
              )
            : t(
                `$AB$ is a side, and the area is its square:${steps(`AB^2 = ${dx}^2 + ${dy}^2 = ${n}`)}`,
                `$AB$ 是一条边，面积就是它的平方：${steps(`AB^2 = ${dx}^2 + ${dy}^2 = ${n}`)}`,
              ),
          ...(other === "C" ? {} : {}),
        });
      },
    },
  ],
};

/** boxFigure draws a shape with the dashed rectangle around it. */
function boxFigure(s: Shape, en: string, zh: string): Figure {
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
  return shapeFigure(s.names, s.pts, en, zh, box);
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
  encompasses: [
    { topic: "area-of-triangles", weight: 0.6 },
    { topic: "calculating-areas-of-rectangles-in-the-plane", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.GPE.B.7"],
  knowledgePoints: [
    {
      id: "triangles-with-a-horizontal-or-vertical-side",
      title: t("A horizontal or vertical base", "水平或竖直的底"),
      explanation: t(
        "If one side of a triangle is horizontal, use it as the base: its length is the difference of the $x$-coordinates, and the height is the vertical distance from the third vertex to that side. Then $A = \\frac{1}{2}bh$. (For a vertical side, swap the roles of $x$ and $y$.)\n\nFor $A(-2, 1)$, $B(5, 1)$ and $C(3, 7)$: the base $AB = 7$, the height is $7 - 1 = 6$, so the area is $\\frac{1}{2} \\cdot 7 \\cdot 6 = 21$.",
        "如果三角形的一条边是水平的，就把它当作底：底长是 $x$ 坐标之差，高是第三个顶点到这条边的竖直距离。于是 $A = \\frac{1}{2}bh$。（竖直的边则把 $x$ 与 $y$ 的作用互换。）\n\n对 $A(-2, 1)$、$B(5, 1)$、$C(3, 7)$：底 $AB = 7$，高是 $7 - 1 = 6$，所以面积是 $\\frac{1}{2} \\cdot 7 \\cdot 6 = 21$。",
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
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of triangle $ABC$ with vertices ${listTex(names, pts, "and")}.`,
              `求三角形 $ABC$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [base * h, Q.of(base * Math.abs(third), 2), Q.of(base + h, 2)],
            solution: t(
              `$AB$ is ${vertical ? "vertical" : "horizontal"}, so use it as the base; the height is the distance from $C$ to it, measured along the $${ac}$-axis:${steps(`b = ${start + base} - ${paren(start)} = ${base}`, `h = |${third} - ${paren(level)}| = ${h}`, `A = \\frac{1}{2} \\cdot ${base} \\cdot ${h} = ${answer.toLatex()}`)}`,
              `$AB$ 是${vertical ? "竖直" : "水平"}的，把它当作底；高是 $C$ 到它的距离，沿 $${ac}$ 轴方向量：${steps(`b = ${start + base} - ${paren(start)} = ${base}`, `h = |${third} - ${paren(level)}| = ${h}`, `A = \\frac{1}{2} \\cdot ${base} \\cdot ${h} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: shapeFigure(
            names,
            pts,
            `Triangle ABC with vertices ${listPts(names, pts)}.`,
            `三角形 ABC，顶点为 ${listPts(names, pts)}。`,
          ),
          ...(ax === "x" ? {} : {}),
        };
      },
    },
    {
      id: "triangles-by-subtracting-from-a-rectangle",
      title: t("Triangles by subtracting from a rectangle", "用外接矩形求三角形面积"),
      explanation: t(
        "When no side is horizontal or vertical, draw the smallest rectangle with horizontal and vertical sides around the triangle. The triangle is what remains of the rectangle after removing three right triangles, whose legs can be read off the grid.\n\nFor $A(0, 0)$, $B(6, 2)$, $C(2, 5)$: the rectangle is $6$ by $5$, area $30$. The right triangles have areas $\\frac{1}{2} \\cdot 6 \\cdot 2 = 6$, $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$ and $\\frac{1}{2} \\cdot 2 \\cdot 5 = 5$, so the area of $ABC$ is $30 - 6 - 6 - 5 = 13$.",
        "如果没有水平或竖直的边，就画出包住三角形、边水平和竖直的最小矩形。从矩形中去掉三个直角三角形，剩下的就是原三角形；这些直角三角形的直角边可以从网格上读出。\n\n对 $A(0, 0)$、$B(6, 2)$、$C(2, 5)$：外接矩形是 $6 \\times 5$，面积 $30$。三个直角三角形的面积分别是 $\\frac{1}{2} \\cdot 6 \\cdot 2 = 6$、$\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$、$\\frac{1}{2} \\cdot 2 \\cdot 5 = 5$，所以 $ABC$ 的面积是 $30 - 6 - 6 - 5 = 13$。",
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
        const areas = legs.map(([a, b]) => `\\frac{1}{2} \\cdot ${a} \\cdot ${b} = ${Q.of(a! * b!, 2).toLatex()}`);
        const minus = parts.map((p) => Q.of(p, 2).toLatex()).join(" - ");
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of triangle $ABC$ with vertices ${listTex(names, pts, "and")}.`,
              `求三角形 $ABC$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [W * H, Q.of(W * H, 2), Q.of(W * H).sub(Q.of(parts[0]! + parts[1]!, 2))],
            solution: t(
              `The rectangle around the triangle is $${W}$ by $${H}$, with area $${W * H}$. The three right triangles outside $ABC$ have areas${steps(...areas)}Subtract them from the rectangle:${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}`,
              `包住三角形的矩形是 $${W} \\times ${H}$，面积为 $${W * H}$。$ABC$ 外面的三个直角三角形的面积分别是${steps(...areas)}从矩形中减去它们：${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: boxFigure(s, `Triangle ABC with vertices ${listPts(names, pts)}.`, `三角形 ABC，顶点为 ${listPts(names, pts)}。`),
        };
      },
    },
    {
      id: "areas-of-quadrilaterals",
      title: t("Areas of quadrilaterals", "四边形的面积"),
      explanation: t(
        "The same idea works for a quadrilateral: subtract from the rectangle around it the right triangles at its corners.\n\nFor $A(2, 0)$, $B(6, 3)$, $C(4, 6)$, $D(0, 2)$: the rectangle is $6$ by $6$, area $36$. The corner triangles have areas $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$, $\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$, $\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$ and $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$, so the area of $ABCD$ is $36 - 6 - 3 - 8 - 2 = 17$.",
        "同样的方法也适用于四边形：从外接矩形中减去四个角上的直角三角形。\n\n对 $A(2, 0)$、$B(6, 3)$、$C(4, 6)$、$D(0, 2)$：外接矩形是 $6 \\times 6$，面积 $36$。四个角上的三角形面积分别是 $\\frac{1}{2} \\cdot 4 \\cdot 3 = 6$、$\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$、$\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$、$\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$，所以 $ABCD$ 的面积是 $36 - 6 - 3 - 8 - 2 = 17$。",
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
        const areas = legs.map(([x, y]) => `\\frac{1}{2} \\cdot ${x} \\cdot ${y} = ${Q.of(x! * y!, 2).toLatex()}`);
        const minus = parts.map((p) => Q.of(p, 2).toLatex()).join(" - ");
        return {
          ...numberProblem({
            prompt: t(
              `Find the area of quadrilateral $ABCD$ with vertices ${listTex(names, pts, "and")}.`,
              `求四边形 $ABCD$ 的面积，顶点为 ${listZh(names, pts)}。`,
            ),
            answer,
            wrong: [W * H, Q.of(W * H, 2), W * H - sum],
            solution: t(
              `The rectangle around the quadrilateral is $${W}$ by $${H}$, with area $${W * H}$. The four right triangles at its corners have areas${steps(...areas)}Subtract them from the rectangle:${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}`,
              `包住四边形的矩形是 $${W} \\times ${H}$，面积为 $${W * H}$。四个角上的直角三角形的面积分别是${steps(...areas)}从矩形中减去它们：${steps(`${W * H} - ${minus} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: boxFigure(s, `Quadrilateral ABCD with vertices ${listPts(names, pts)}.`, `四边形 ABCD，顶点为 ${listPts(names, pts)}。`),
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
