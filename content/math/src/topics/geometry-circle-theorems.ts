import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, linear, type Mark, type Point, type Q, q, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, pointProblem, steps, yesNo } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** tex writes a quantity with a unit in LaTeX: "8\text{ cm}". */
const tex = (v: number | string, u: Unit) => `${v}\\text{ ${u}}`;

/** len writes a length for a figure: "8 cm". */
const len = (v: number | string, u: Unit) => `${v} ${u}`;

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** arcTex names an arc in LaTeX: arcTex("AB") is the arc AB with an arc above it. */
const arcTex = (name: string) => `\\overset{\\frown}{${name}}`;

/** half writes n/2 in LaTeX: "35", "\frac{71}{2}". */
const half = (n: number) => q(n, 2).toLatex();

/** frac is n/d as a rational, or undefined when d is 0; it builds wrong answers that only some mistakes produce. */
const frac = (n: number, d: number): Q | undefined => (d === 0 ? undefined : q(n, d));

/** some drops the undefined entries of a list of wrong answers. */
const some = (list: readonly (Coefficient | undefined)[]): Coefficient[] => list.filter((w): w is Coefficient => w !== undefined);

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

const R = 5;
const O: Point = [0, 0];
const rad = (d: number) => (d * Math.PI) / 180;

/** on is the point at distance r from c in direction d degrees. */
const on = (d: number, r = R, c: Point = O): Point => [c[0] + r * Math.cos(rad(d)), c[1] + r * Math.sin(rad(d))];

/** along is the point p + k·v. */
const along = (p: Point, v: Point, k: number): Point => [p[0] + k * v[0], p[1] + k * v[1]];

/** tangentDir is the unit vector along the tangent at the point of the circle in direction d, pointing counterclockwise. */
const tangentDir = (d: number): Point => [-Math.sin(rad(d)), Math.cos(rad(d))];

/** heading is the direction of p from c, in degrees. */
const heading = (p: Point, c: Point = O) => (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;

const compassPoints: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** dirOf is the compass direction nearest to d degrees. */
const dirOf = (d: number): Compass => compassPoints[(((Math.round(d / 45) % 8) + 8) % 8) as 0]!;

/** arcPoints are points along the arc from angle a counterclockwise to angle b. */
function arcPoints(a: number, b: number, r = R, c: Point = O): Point[] {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return Array.from({ length: n + 1 }, (_, i) => on(a + (span * i) / n, r, c));
}

/** circleAt draws a circle of radius r about c. */
const circleAt = (r = R, c: Point = O): Mark => ({ kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, r, c)) });

/** arcAt highlights the arc from angle a counterclockwise to angle b. */
function arcAt(a: number, b: number): Mark[] {
  const pts = arcPoints(a, b);
  return pts.slice(1).map((p, i): Mark => ({ kind: "segment", a: pts[i]!, b: p, accent: true }));
}

/** midOf is the direction of the middle of the arc from a counterclockwise to b. */
const midOf = (a: number, b: number) => a + ((((b - a) % 360) + 360) % 360 || 360) / 2;

/** arcText labels the arc from a counterclockwise to b at its middle, outside the circle. */
const arcText = (a: number, b: number, text: string): Mark => ({ kind: "label", at: on(midOf(a, b)), text, dir: dirOf(midOf(a, b)) });

/** arcTextIn labels the arc from a counterclockwise to b at its middle, inside the circle. */
const arcTextIn = (a: number, b: number, text: string): Mark => ({
  kind: "label",
  at: on(midOf(a, b)),
  text,
  dir: dirOf(midOf(a, b) + 180),
});

/** pointsAt marks points of the circle with dots and names, outside the circle. */
function pointsAt(list: readonly (readonly [number, string])[]): Mark[] {
  return list.flatMap(([d, text]): Mark[] => [
    { kind: "dot", at: on(d) },
    { kind: "label", at: on(d), text, dir: dirOf(d), italic: true },
  ]);
}

/** center marks the center O. */
const center = (dir: Compass): Mark[] => [
  { kind: "dot", at: O },
  { kind: "label", at: O, text: "O", dir, italic: true },
];

/** outside marks a point P outside the circle with a dot and its name, away from the center. */
const outside = (p: Point, text = "P"): Mark[] => [
  { kind: "dot", at: p },
  { kind: "label", at: p, text, dir: dirOf(heading(p)), italic: true },
];

const seg = (a: Point, b: Point): Mark => ({ kind: "segment", a, b });

const angleAt = (vertex: Point, from: Point, to: Point, label?: string): Mark => ({
  kind: "arc",
  vertex,
  from,
  to,
  accent: true,
  ...(label && { label }),
});

/** sideOut labels the side pq of triangle pqr outside the triangle. */
function sideOut(p: Point, qq: Point, r: Point, text: string): Mark {
  const cross = (qq[0] - p[0]) * (r[1] - p[1]) - (qq[1] - p[1]) * (r[0] - p[0]);
  return cross > 0 ? { kind: "side", a: p, b: qq, text } : { kind: "side", a: qq, b: p, text };
}

/** sideIn labels the side pq of triangle pqr inside the triangle. */
function sideIn(p: Point, qq: Point, r: Point, text: string): Mark {
  const m = sideOut(p, qq, r, text) as { kind: "side"; a: Point; b: Point; text: string };
  return { kind: "side", a: m.b, b: m.a, text };
}

/** meet is the intersection of line p1p2 with line p3p4. */
function meet(p1: Point, p2: Point, p3: Point, p4: Point): Point {
  const [x1, y1, x2, y2, x3, y3, x4, y4] = [p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]];
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const a = x1 * y2 - y1 * x2;
  const b = x3 * y4 - y3 * x4;
  return [(a * (x3 - x4) - (x1 - x2) * b) / den, (a * (y3 - y4) - (y1 - y2) * b) / den];
}

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = (c: number, d: number) => `(${linear(c, d)})^\\circ`;

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°". */
const angleLabel = (c: number, d: number) => `(${plain(c, d)})°`;

/** expressionFor writes a value a as c·x + d for a given x, with c from 1 to max but not in avoid. */
function expressionFor(rng: Rng, a: number, x: number, max = 5, avoid: readonly number[] = []): [number, number] {
  const cs = Array.from({ length: max }, (_, i) => i + 1).filter((c) => !avoid.includes(c));
  const c = rng.pick(cs);
  return [c, a - c * x];
}

/** solveLinear writes the steps of c1·x + d1 = c2·x + d2 down to x (c1 ≠ c2), starting with the given first lines. */
function solveLinear(c1: number, d1: number, c2: number, d2: number, ...first: string[]): string {
  const c = c1 - c2;
  const d = d2 - d1;
  const lines = [...first, `${linear(c1, d1)} = ${linear(c2, d2)}`];
  if (c2 !== 0 || d1 !== 0) lines.push(`${linear(c, 0)} = ${d}`);
  if (c !== 1) lines.push(`x = ${q(d, c).toLatex()}`);
  return steps(...lines);
}

/** solveSum writes the steps of (c1·x + d1) + (c2·x + d2) = total down to x. */
function solveSum(c1: number, d1: number, c2: number, d2: number, total: number): string {
  return solveLinear(c1 + c2, d1 + d2, 0, total, `${angleTex(c1, d1)} + ${angleTex(c2, d2)} = ${total}^\\circ`);
}

/** sumWrong are the values of x that mistaken totals or setting the parts equal give, for (c1·x + d1) + (c2·x + d2) = total. */
const sumWrong = (c1: number, d1: number, c2: number, d2: number, _total: number, others: readonly number[]) =>
  some([...others.map((o) => frac(o - d1 - d2, c1 + c2)), frac(d2 - d1, c1 - c2)]);

/** doubleWrong are the values of x that forgetting or misplacing the factor 2 gives, for 2(c1·x + d1) = c2·x + d2. */
const doubleWrong = (c1: number, d1: number, c2: number, d2: number) => some([frac(d2 - d1, c1 - c2), frac(2 * d2 - d1, c1 - 2 * c2)]);

/** fraction picks a number from lo to hi, divided by 100, for placing points of a figure. */
const fraction = (rng: Rng, lo: number, hi: number) => rng.int(lo, hi) / 100;

// ---------------------------------------------------------------------------
// Inscribed angles
// ---------------------------------------------------------------------------

/** InscribedOpts are what an inscribed-angle figure shows. */
interface InscribedOpts {
  /** angle labels the inscribed angle at C. */
  readonly angle?: string;
  /** arc highlights arc AB and labels it. */
  readonly arc?: string;
  /** central draws the radii OA and OB, labeling the central angle when not empty. */
  readonly central?: string;
  /** chord draws AB and marks the angle OAB with this label. */
  readonly baseAngle?: string;
}

/** inscribedMarks draws a circle with A at s, B at s + m, C on the major arc at fraction f of it, the chords CA and CB, and the angle at C. */
function inscribedMarks(s: number, m: number, f: number, o: InscribedOpts): Mark[] {
  const c = s + m + (360 - m) * f;
  const [pa, pb, pc] = [on(s), on(s + m), on(c)];
  const marks: Mark[] = [circleAt(), seg(pc, pa), seg(pc, pb), angleAt(pc, pa, pb, o.angle)];
  if (o.arc !== undefined) marks.push(...arcAt(s, s + m), arcText(s, s + m, o.arc));
  if (o.central !== undefined)
    marks.push(seg(O, pa), seg(O, pb), angleAt(O, pa, pb, o.central || undefined), ...center(dirOf(s + m / 2 + 180)));
  if (o.baseAngle !== undefined) marks.push(seg(pa, pb), angleAt(pa, pb, O, o.baseAngle));
  marks.push(
    ...pointsAt([
      [s, "A"],
      [s + m, "B"],
      [c, "C"],
    ]),
  );
  return marks;
}

export const inscribedAngles: TopicDef = {
  id: "inscribed-angles",
  title: t("Inscribed Angles", "圆周角"),
  summary: t(
    "Use the inscribed angle theorem: an inscribed angle is half its intercepted arc, and inscribed angles on the same arc are equal.",
    "运用圆周角定理：圆周角等于它所对弧的度数的一半，同弧所对的圆周角相等。",
  ),
  prerequisites: ["central-angles-and-arcs", "isosceles-triangles"],
  encompasses: [
    { topic: "central-angles-and-arcs", weight: 0.4 },
    { topic: "isosceles-triangles", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "inscribed-angle-from-the-arc",
      title: t("The inscribed angle theorem", "圆周角定理"),
      explanation: t(
        `An **inscribed angle** has its vertex on the circle and its sides are chords. The arc inside the angle is its **intercepted arc**.\n\n**Inscribed angle theorem:** an inscribed angle is half its intercepted arc, and so half the central angle on the same arc:\n\n$$\\angle ACB = \\tfrac{1}{2}\\, m${arcTex("AB")} = \\tfrac{1}{2}\\angle AOB.$$\n\nIf $m${arcTex("AB")} = 110^\\circ$, then $\\angle ACB = \\frac{110^\\circ}{2} = 55^\\circ$. (The proof draws the diameter through $C$: it splits the figure into isosceles triangles whose exterior angles at $O$ are twice their base angles.)`,
        `顶点在圆上、两边都是弦的角叫**圆周角**。角内部的弧叫它**所对的弧**。\n\n**圆周角定理**：圆周角等于它所对弧的度数的一半，也就是同弧所对圆心角的一半：\n\n$$\\angle ACB = \\tfrac{1}{2}\\, m${arcTex("AB")} = \\tfrac{1}{2}\\angle AOB.$$\n\n若 $m${arcTex("AB")} = 110^\\circ$，则 $\\angle ACB = \\frac{110^\\circ}{2} = 55^\\circ$。（证明时过 $C$ 作直径：它把图形分成几个等腰三角形，每个三角形在 $O$ 处的外角等于底角的两倍。）`,
      ),
      generate(rng) {
        const m = 2 * rng.int(20, 80);
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        const useCentral = rng.bool();
        const given = useCentral ? `\\angle AOB = ${m}^\\circ` : `m${arcTex("AB")} = ${m}^\\circ`;
        return {
          ...numberProblem({
            prompt: useCentral
              ? t("$O$ is the center of the circle. Find $\\angle ACB$.", "$O$ 是圆心。求 $\\angle ACB$。")
              : t("Find the inscribed angle $\\angle ACB$.", "求圆周角 $\\angle ACB$。"),
            answer: m / 2,
            unit: "°",
            wrong: [m, 2 * m, 180 - m],
            solution: t(
              `$\\angle ACB$ intercepts arc $${arcTex("AB")}$, and $${given}$. An inscribed angle is half of that:${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}`,
              `$\\angle ACB$ 所对的弧是 $${arcTex("AB")}$，且 $${given}$。圆周角是它的一半：${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}`,
            ),
          }),
          figure: figure(
            inscribedMarks(s, m, f, useCentral ? { central: deg(m) } : { arc: deg(m) }),
            useCentral
              ? `Circle O with points A, B and C on it, chords CA and CB, and the central angle AOB of ${m}°.`
              : `A circle with points A, B and C on it, chords CA and CB, and arc AB of ${m}°.`,
            useCentral ? `圆 O 上有点 A、B、C，画有弦 CA、CB，圆心角 AOB 为 ${m}°。` : `圆上有点 A、B、C，画有弦 CA、CB，弧 AB 为 ${m}°。`,
          ),
        };
      },
    },
    {
      id: "intercepted-arc-from-the-angle",
      title: t("The arc from the inscribed angle", "由圆周角求弧"),
      explanation: t(
        `Turned around, the theorem says that the intercepted arc, and the central angle on it, are **twice** the inscribed angle:\n\n$$m${arcTex("AB")} = \\angle AOB = 2\\angle ACB.$$\n\nIf $\\angle ACB = 38^\\circ$, then $m${arcTex("AB")} = 76^\\circ$, and the central angle $\\angle AOB$ is $76^\\circ$ too.`,
        `反过来，所对的弧以及同弧上的圆心角都是圆周角的**两倍**：\n\n$$m${arcTex("AB")} = \\angle AOB = 2\\angle ACB.$$\n\n若 $\\angle ACB = 38^\\circ$，则 $m${arcTex("AB")} = 76^\\circ$，圆心角 $\\angle AOB$ 也是 $76^\\circ$。`,
      ),
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        const useCentral = rng.bool();
        const target = useCentral ? "\\angle AOB" : `m${arcTex("AB")}`;
        return {
          ...numberProblem({
            prompt: useCentral
              ? t("$O$ is the center of the circle. Find the central angle $\\angle AOB$.", "$O$ 是圆心。求圆心角 $\\angle AOB$。")
              : t(`Find the measure of arc $${arcTex("AB")}$.`, `求弧 $${arcTex("AB")}$ 的度数。`),
            answer: m,
            unit: "°",
            wrong: [theta, q(theta, 2), 360 - m],
            solution: t(
              `The inscribed angle $\\angle ACB = ${theta}^\\circ$ is half of arc $${arcTex("AB")}$, so the arc and its central angle are twice as large:${steps(`${target} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}`,
              `圆周角 $\\angle ACB = ${theta}^\\circ$ 是弧 $${arcTex("AB")}$ 的一半，所以弧和它所对的圆心角是它的两倍：${steps(`${target} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}`,
            ),
          }),
          figure: figure(
            inscribedMarks(s, m, f, useCentral ? { angle: deg(theta), central: "?" } : { angle: deg(theta), arc: "?" }),
            useCentral
              ? `Circle O with points A, B and C on it; the inscribed angle ACB is ${theta}° and the central angle AOB is unknown.`
              : `A circle with points A, B and C on it; the inscribed angle ACB is ${theta}° and arc AB is unknown.`,
            useCentral
              ? `圆 O 上有点 A、B、C；圆周角 ACB 为 ${theta}°，圆心角 AOB 未知。`
              : `圆上有点 A、B、C；圆周角 ACB 为 ${theta}°，弧 AB 未知。`,
          ),
        };
      },
    },
    {
      id: "inscribed-angles-on-the-same-arc",
      title: t("Inscribed angles on the same arc", "同弧所对的圆周角"),
      explanation: t(
        `Two inscribed angles that intercept the same arc are both half of it, so they are **equal**. If $C$ and $D$ are on the same side of chord $AB$, then\n\n$$\\angle ACB = \\angle ADB.$$\n\nIf $\\angle ACB = (2x + 10)^\\circ$ and $\\angle ADB = (3x - 15)^\\circ$, then $2x + 10 = 3x - 15$, so $x = 25$ and each angle is $60^\\circ$.`,
        `同一段弧所对的两个圆周角都等于这段弧的一半，所以它们**相等**。若 $C$、$D$ 在弦 $AB$ 的同侧，则\n\n$$\\angle ACB = \\angle ADB.$$\n\n若 $\\angle ACB = (2x + 10)^\\circ$，$\\angle ADB = (3x - 15)^\\circ$，则 $2x + 10 = 3x - 15$，所以 $x = 25$，两个角都是 $60^\\circ$。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const s = rng.int(0, 359);
        const [cAt, dAt] = [s + m + (360 - m) * fraction(rng, 15, 40), s + m + (360 - m) * fraction(rng, 60, 85)];
        const [pa, pb, pc, pd] = [on(s), on(s + m), on(cAt), on(dAt)];
        const marks = (lc: string, ld: string): Mark[] => [
          circleAt(),
          ...arcAt(s, s + m),
          seg(pc, pa),
          seg(pc, pb),
          seg(pd, pa),
          seg(pd, pb),
          angleAt(pc, pa, pb, lc),
          angleAt(pd, pa, pb, ld),
          ...pointsAt([
            [s, "A"],
            [s + m, "B"],
            [cAt, "C"],
            [dAt, "D"],
          ]),
        ];
        if (rng.bool(0.4)) {
          return {
            ...numberProblem({
              prompt: t("Find $\\angle ADB$.", "求 $\\angle ADB$。"),
              answer: theta,
              unit: "°",
              wrong: [m, q(theta, 2), 180 - theta],
              solution: t(
                `$\\angle ACB$ and $\\angle ADB$ both intercept arc $${arcTex("AB")}$, so they are equal:${steps(`\\angle ADB = \\angle ACB = ${theta}^\\circ`)}`,
                `$\\angle ACB$ 和 $\\angle ADB$ 所对的弧都是 $${arcTex("AB")}$，所以它们相等：${steps(`\\angle ADB = \\angle ACB = ${theta}^\\circ`)}`,
              ),
            }),
            figure: figure(
              marks(deg(theta), "?"),
              `A circle with points A, B, C and D on it; angles ACB and ADB both intercept arc AB, and angle ACB is ${theta}°.`,
              `圆上有点 A、B、C、D；角 ACB 和角 ADB 都对着弧 AB，角 ACB 为 ${theta}°。`,
            ),
          };
        }
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, theta, x);
        const [c2, d2] = expressionFor(rng, theta, x, 5, [c1]);
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: [...some([frac(180 - d1 - d2, c1 + c2), frac(2 * d2 - d1, c1 - 2 * c2)]), theta],
            solution: t(
              `Both angles intercept arc $${arcTex("AB")}$, so they are equal:${solveLinear(c1, d1, c2, d2)}`,
              `两个角所对的弧都是 $${arcTex("AB")}$，所以它们相等：${solveLinear(c1, d1, c2, d2)}`,
            ),
          }),
          figure: figure(
            marks(angleLabel(c1, d1), angleLabel(c2, d2)),
            `A circle with points A, B, C and D on it; angle ACB is ${angleLabel(c1, d1)} and angle ADB is ${angleLabel(c2, d2)}.`,
            `圆上有点 A、B、C、D；角 ACB 为 ${angleLabel(c1, d1)}，角 ADB 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

export const problemSolvingWithInscribedAngles: TopicDef = {
  id: "problem-solving-with-inscribed-angles",
  title: t("Problem-Solving With Inscribed Angles", "圆周角的综合问题"),
  summary: t(
    "Find the angles of inscribed triangles from arcs, solve for unknowns, and combine inscribed angles with radii.",
    "由弧求圆内接三角形的角，求未知数，并把圆周角与半径结合起来解题。",
  ),
  prerequisites: ["inscribed-angles", "equations-with-parentheses"],
  encompasses: [
    { topic: "inscribed-angles", weight: 0.6 },
    { topic: "central-angles-and-arcs", weight: 0.3 },
    { topic: "isosceles-triangles", weight: 0.2 },
    { topic: "equations-with-parentheses", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "angles-of-an-inscribed-triangle",
      title: t("Angles of an inscribed triangle", "圆内接三角形的角"),
      explanation: t(
        `The vertices of an inscribed triangle split the circle into three arcs that add to $360^\\circ$. Each angle of the triangle intercepts the arc **opposite** it, the one between the other two vertices.\n\nIf $m${arcTex("AB")} = 100^\\circ$ and $m${arcTex("BC")} = 140^\\circ$, the third arc is $m${arcTex("CA")} = 360^\\circ - 240^\\circ = 120^\\circ$, so\n\n$$\\angle C = 50^\\circ, \\quad \\angle A = 70^\\circ, \\quad \\angle B = 60^\\circ,$$\n\nwhich add to $180^\\circ$ as they should.`,
        `圆内接三角形的三个顶点把圆分成三段弧，和为 $360^\\circ$。三角形的每个角都对着它**对面**的那段弧，即另外两个顶点之间的弧。\n\n若 $m${arcTex("AB")} = 100^\\circ$，$m${arcTex("BC")} = 140^\\circ$，则第三段弧 $m${arcTex("CA")} = 360^\\circ - 240^\\circ = 120^\\circ$，所以\n\n$$\\angle C = 50^\\circ, \\quad \\angle A = 70^\\circ, \\quad \\angle B = 60^\\circ,$$\n\n三个角之和正好是 $180^\\circ$。`,
      ),
      generate(rng) {
        const a = 2 * rng.int(30, 90);
        const b = 2 * rng.int(30, Math.min(90, (300 - a) / 2));
        const c = 360 - a - b;
        const s = rng.int(0, 359);
        const [pa, pb, pc] = [on(s), on(s + a), on(s + a + b)];
        const ask = rng.pick([0, 1, 2, 2] as const);
        const vertex = (["C", "A", "B"] as const)[ask];
        const angle = [a / 2, b / 2, c / 2][ask]!;
        const mark = [angleAt(pc, pa, pb, "?"), angleAt(pa, pb, pc, "?"), angleAt(pb, pc, pa, "?")][ask]!;
        const wrong = [
          [a, b / 2, 180 - a],
          [b, a / 2, 180 - b],
          [c, (a + b) / 2, a / 2],
        ][ask]!;
        const arcName = ["AB", "BC", "CA"][ask]!;
        const third = ask === 2 ? steps(`m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`) : "";
        const arcValue = [a, b, c][ask]!;
        return {
          ...numberProblem({
            prompt: t(
              `Triangle $ABC$ is inscribed in the circle. Find $\\angle ${vertex}$.`,
              `$\\triangle ABC$ 内接于圆。求 $\\angle ${vertex}$。`,
            ),
            answer: angle,
            unit: "°",
            wrong,
            solution: t(
              `$\\angle ${vertex}$ intercepts the opposite arc $${arcTex(arcName)}$.${third}It is half of that arc:${steps(`\\angle ${vertex} = \\frac{${arcValue}^\\circ}{2} = ${angle}^\\circ`)}`,
              `$\\angle ${vertex}$ 对着对面的弧 $${arcTex(arcName)}$。${third}它是这段弧的一半：${steps(`\\angle ${vertex} = \\frac{${arcValue}^\\circ}{2} = ${angle}^\\circ`)}`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              { kind: "polygon", points: [pa, pb, pc] },
              mark,
              arcText(s, s + a, deg(a)),
              arcText(s + a, s + a + b, deg(b)),
              ...pointsAt([
                [s, "A"],
                [s + a, "B"],
                [s + a + b, "C"],
              ]),
            ],
            `Triangle ABC inscribed in a circle; arc AB is ${a}° and arc BC is ${b}°.`,
            `内接于圆的三角形 ABC；弧 AB 为 ${a}°，弧 BC 为 ${b}°。`,
          ),
        };
      },
    },
    {
      id: "inscribed-angles-with-algebra",
      title: t("Inscribed angles with algebra", "含未知数的圆周角"),
      explanation: t(
        `When an inscribed angle and its arc are written with a variable, the theorem gives the equation\n\n$$2 \\cdot (\\text{inscribed angle}) = \\text{intercepted arc}.$$\n\nIf $\\angle ACB = (x + 12)^\\circ$ and $m${arcTex("AB")} = (3x + 4)^\\circ$, then $2(x + 12) = 3x + 4$, so $2x + 24 = 3x + 4$ and $x = 20$. Check: the angle is $32^\\circ$ and the arc $64^\\circ$.`,
        `当圆周角和它所对的弧都用含变量的式子表示时，由定理得到方程\n\n$$2 \\cdot (\\text{圆周角}) = \\text{所对的弧}.$$\n\n若 $\\angle ACB = (x + 12)^\\circ$，$m${arcTex("AB")} = (3x + 4)^\\circ$，则 $2(x + 12) = 3x + 4$，即 $2x + 24 = 3x + 4$，$x = 20$。检验：角是 $32^\\circ$，弧是 $64^\\circ$。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const theta = rng.int(20, 80);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, theta, x, 4);
        const [c2, d2] = expressionFor(rng, 2 * theta, x, 9, [2 * c1]);
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), theta],
            solution: t(
              `The arc is twice the inscribed angle:${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
              `弧是圆周角的两倍：${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
            ),
          }),
          figure: figure(
            inscribedMarks(s, 2 * theta, f, { angle: angleLabel(c1, d1), arc: angleLabel(c2, d2) }),
            `A circle with points A, B and C on it; angle ACB is ${angleLabel(c1, d1)} and arc AB is ${angleLabel(c2, d2)}.`,
            `圆上有点 A、B、C；角 ACB 为 ${angleLabel(c1, d1)}，弧 AB 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "inscribed-angles-and-radii",
      title: t("Inscribed angles and radii", "圆周角与半径"),
      explanation: t(
        "Radii drawn to the endpoints of a chord make an isosceles triangle, since $OA = OB$. Combine it with the inscribed angle theorem.\n\nIf $\\angle ACB = 35^\\circ$, the central angle is $\\angle AOB = 70^\\circ$, and the base angles of $\\triangle AOB$ are\n\n$$\\angle OAB = \\angle OBA = \\frac{180^\\circ - 70^\\circ}{2} = 55^\\circ.$$\n\nIn general $\\angle OAB = 90^\\circ - \\angle ACB$.",
        "连接弦两端的半径构成等腰三角形，因为 $OA = OB$。把它和圆周角定理结合起来。\n\n若 $\\angle ACB = 35^\\circ$，则圆心角 $\\angle AOB = 70^\\circ$，$\\triangle AOB$ 的底角是\n\n$$\\angle OAB = \\angle OBA = \\frac{180^\\circ - 70^\\circ}{2} = 55^\\circ.$$\n\n一般地，$\\angle OAB = 90^\\circ - \\angle ACB$。",
      ),
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const beta = 90 - theta;
        const s = rng.int(0, 359);
        const f = fraction(rng, 35, 65);
        const desc = t(
          "Circle O with points A, B and C on it, chords CA, CB and AB, and radii OA and OB.",
          "圆 O 上有点 A、B、C，画有弦 CA、CB、AB 和半径 OA、OB。",
        );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t("$O$ is the center of the circle. Find $\\angle OAB$.", "$O$ 是圆心。求 $\\angle OAB$。"),
              answer: beta,
              unit: "°",
              wrong: [180 - m, m, theta],
              solution: t(
                `The central angle is twice the inscribed angle, and $\\triangle AOB$ is isosceles with $OA = OB$:${steps(`\\angle AOB = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`, `\\angle OAB = \\frac{180^\\circ - ${m}^\\circ}{2} = ${beta}^\\circ`)}`,
                `圆心角是圆周角的两倍，且 $\\triangle AOB$ 是等腰三角形（$OA = OB$）：${steps(`\\angle AOB = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`, `\\angle OAB = \\frac{180^\\circ - ${m}^\\circ}{2} = ${beta}^\\circ`)}`,
              ),
            }),
            figure: figure(inscribedMarks(s, m, f, { angle: deg(theta), central: "", baseAngle: "?" }), desc.en, desc["zh-CN"]),
          };
        }
        return {
          ...numberProblem({
            prompt: t("$O$ is the center of the circle. Find $\\angle ACB$.", "$O$ 是圆心。求 $\\angle ACB$。"),
            answer: theta,
            unit: "°",
            wrong: [2 * beta, 180 - 2 * beta, beta, m],
            solution: t(
              `$\\triangle AOB$ is isosceles with $OA = OB$, so both base angles are $${beta}^\\circ$, and the inscribed angle is half the central angle:${steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${beta}^\\circ = ${m}^\\circ`, `\\angle ACB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}`,
              `$\\triangle AOB$ 是等腰三角形（$OA = OB$），两个底角都是 $${beta}^\\circ$；圆周角是圆心角的一半：${steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${beta}^\\circ = ${m}^\\circ`, `\\angle ACB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}`,
            ),
          }),
          figure: figure(inscribedMarks(s, m, f, { angle: "?", central: "", baseAngle: deg(beta) }), desc.en, desc["zh-CN"]),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Inscribed right triangles
// ---------------------------------------------------------------------------

/** DiameterFigure is a circle with diameter AB from s and C on the circle with angle CAB = a. */
interface DiameterFigure {
  readonly s: number;
  readonly c: number;
  readonly pa: Point;
  readonly pb: Point;
  readonly pc: Point;
}

/** diameterFigure places A at s, B opposite, and C so that angle CAB is a degrees (0 < a < 90). */
function diameterFigure(s: number, a: number): DiameterFigure {
  const c = s + 180 - 2 * a;
  return { s, c, pa: on(s), pb: on(s + 180), pc: on(c) };
}

/** diameterMarks draws the triangle ABC on the diameter AB, the center O, and the extra marks. */
function diameterMarks(d: DiameterFigure, extra: readonly Mark[], radius = false): Mark[] {
  return [
    circleAt(),
    { kind: "polygon", points: [d.pa, d.pb, d.pc] },
    ...(radius ? [seg(O, d.pc)] : []),
    ...center(dirOf(d.s - 90)),
    ...extra,
    ...pointsAt([
      [d.s, "A"],
      [d.s + 180, "B"],
      [d.c, "C"],
    ]),
  ];
}

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [20, 21, 29],
  [7, 24, 25],
] as const;

export const thalesTheorem: TopicDef = {
  id: "thales-theorem",
  title: t("Thales' Theorem", "泰勒斯定理"),
  summary: t(
    "An angle inscribed in a semicircle is a right angle; use it and its converse to find angles and radii.",
    "半圆所对的圆周角是直角；用它及其逆定理求角和半径。",
  ),
  prerequisites: ["inscribed-angles", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "inscribed-angles", weight: 0.3 },
    { topic: "the-pythagorean-theorem", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "angles-in-a-semicircle",
      title: t("The angle in a semicircle", "半圆上的圆周角"),
      explanation: t(
        `**Thales' theorem:** if $AB$ is a diameter and $C$ is any other point on the circle, then $\\angle ACB = 90^\\circ$. The angle intercepts a semicircle of $180^\\circ$, and half of that is $90^\\circ$.\n\nSo triangle $ABC$ is a right triangle, and its acute angles add to $90^\\circ$. If $\\angle CAB = 28^\\circ$, then\n\n$$\\angle CBA = 180^\\circ - 90^\\circ - 28^\\circ = 62^\\circ.$$`,
        `**泰勒斯定理**：若 $AB$ 是直径，$C$ 是圆上另外任意一点，则 $\\angle ACB = 90^\\circ$。这个角所对的弧是 $180^\\circ$ 的半圆，它的一半是 $90^\\circ$。\n\n所以 $\\triangle ABC$ 是直角三角形，两个锐角之和是 $90^\\circ$。若 $\\angle CAB = 28^\\circ$，则\n\n$$\\angle CBA = 180^\\circ - 90^\\circ - 28^\\circ = 62^\\circ.$$`,
      ),
      generate(rng) {
        const a = rng.int(15, 75);
        const d = diameterFigure(rng.int(0, 359), a);
        const atA = rng.bool();
        const [given, asked] = atA ? ["CAB", "CBA"] : ["CBA", "CAB"];
        const g = atA ? a : 90 - a;
        const marks = atA
          ? [angleAt(d.pa, d.pb, d.pc, deg(g)), angleAt(d.pb, d.pc, d.pa, "?")]
          : [angleAt(d.pb, d.pc, d.pa, deg(g)), angleAt(d.pa, d.pb, d.pc, "?")];
        return {
          ...numberProblem({
            prompt: t(`$AB$ is a diameter of circle $O$. Find $\\angle ${asked}$.`, `$AB$ 是圆 $O$ 的直径。求 $\\angle ${asked}$。`),
            answer: 90 - g,
            unit: "°",
            wrong: [180 - g, g, 90],
            solution: t(
              `$\\angle ACB$ is inscribed in a semicircle, so it is $90^\\circ$ (Thales' theorem). The angles of $\\triangle ABC$ add to $180^\\circ$:${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${90 - g}^\\circ`)}`,
              `$\\angle ACB$ 是半圆所对的圆周角，所以是 $90^\\circ$（泰勒斯定理）。$\\triangle ABC$ 的内角和是 $180^\\circ$：${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${90 - g}^\\circ`)}`,
            ),
          }),
          figure: figure(
            diameterMarks(d, marks),
            `Circle O with diameter AB and a point C on the circle; angle ${given} is ${g}°.`,
            `圆 O，AB 是直径，点 C 在圆上；角 ${given} 为 ${g}°。`,
          ),
        };
      },
    },
    {
      id: "the-converse-of-thales-theorem",
      title: t("The converse of Thales' theorem", "泰勒斯定理的逆定理"),
      explanation: t(
        `**Converse:** if an inscribed angle $\\angle ACB$ is $90^\\circ$, its intercepted arc is $2 \\cdot 90^\\circ = 180^\\circ$, a semicircle, so $AB$ is a diameter. If $\\angle ACB$ is not $90^\\circ$, the arc is not $180^\\circ$ and $AB$ is not a diameter.\n\nTriangle $ABC$ is inscribed in a circle with $\\angle A = 35^\\circ$ and $\\angle B = 55^\\circ$. Then $\\angle C = 180^\\circ - 35^\\circ - 55^\\circ = 90^\\circ$, so $AB$ is a diameter.`,
        `**逆定理**：若圆周角 $\\angle ACB$ 是 $90^\\circ$，则它所对的弧是 $2 \\cdot 90^\\circ = 180^\\circ$，是半圆，所以 $AB$ 是直径。若 $\\angle ACB$ 不是 $90^\\circ$，弧就不是 $180^\\circ$，$AB$ 也不是直径。\n\n$\\triangle ABC$ 内接于圆，$\\angle A = 35^\\circ$，$\\angle B = 55^\\circ$。则 $\\angle C = 180^\\circ - 35^\\circ - 55^\\circ = 90^\\circ$，所以 $AB$ 是直径。`,
      ),
      generate(rng) {
        const a = rng.int(20, 70);
        const yes = rng.bool();
        const b = yes ? 90 - a : 90 - a + rng.pick([-14, -10, -6, -4, -2, 2, 4, 6, 10, 14]);
        const c = 180 - a - b;
        return choiceProblem({
          prompt: t(
            `Triangle $ABC$ is inscribed in a circle, with $\\angle A = ${a}^\\circ$ and $\\angle B = ${b}^\\circ$. Is $AB$ a diameter of the circle?`,
            `$\\triangle ABC$ 内接于圆，$\\angle A = ${a}^\\circ$，$\\angle B = ${b}^\\circ$。$AB$ 是圆的直径吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `$\\angle C = 180^\\circ - ${a}^\\circ - ${b}^\\circ = 90^\\circ$. It intercepts arc $${arcTex("AB")}$ of $180^\\circ$, a semicircle, so $AB$ is a diameter.`,
                `$\\angle C = 180^\\circ - ${a}^\\circ - ${b}^\\circ = 90^\\circ$。它所对的弧 $${arcTex("AB")}$ 是 $180^\\circ$，是半圆，所以 $AB$ 是直径。`,
              )
            : t(
                `$\\angle C = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$, not $90^\\circ$. Its intercepted arc $${arcTex("AB")}$ is $${2 * c}^\\circ$, not a semicircle, so $AB$ is not a diameter.`,
                `$\\angle C = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$，不是 $90^\\circ$。它所对的弧 $${arcTex("AB")}$ 是 $${2 * c}^\\circ$，不是半圆，所以 $AB$ 不是直径。`,
              ),
        });
      },
    },
    {
      id: "the-hypotenuse-is-a-diameter",
      title: t("The hypotenuse is a diameter", "斜边是直径"),
      explanation: t(
        "By the converse of Thales' theorem, the hypotenuse of a right triangle inscribed in a circle is a **diameter**, and the center of the circle is its midpoint.\n\nA right triangle with legs $6$ cm and $8$ cm has hypotenuse $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ cm. If it is inscribed in a circle, the diameter is $10$ cm and the radius is $5$ cm.",
        "由泰勒斯定理的逆定理，圆内接直角三角形的斜边是圆的**直径**，圆心是斜边的中点。\n\n直角边为 $6$ 厘米和 $8$ 厘米的直角三角形，斜边是 $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ 厘米。若它内接于圆，则直径是 $10$ 厘米，半径是 $5$ 厘米。",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const [p, r0, h0] = rng.pick(triples);
        const k = rng.int(1, 3);
        const swap = rng.bool();
        const [l1, l2, h] = swap ? [r0 * k, p * k, h0 * k] : [p * k, r0 * k, h0 * k];
        const u = pickUnit(rng);
        // AC = l1 and BC = l2, so angle CAB has tangent l2 / l1.
        const a = (Math.atan2(l2, l1) * 180) / Math.PI;
        const d = diameterFigure(rng.int(0, 359), a);
        return {
          ...numberProblem({
            prompt: t(
              "Right triangle $ABC$, with its right angle at $C$, is inscribed in the circle. Find the radius of the circle.",
              "直角三角形 $ABC$（直角在 $C$）内接于圆。求圆的半径。",
            ),
            answer: q(h, 2),
            unit: u,
            wrong: [h, q(l1 + l2, 2), l1 + l2],
            solution: t(
              `The hypotenuse $AB$ is a diameter. By the Pythagorean theorem:${steps(`AB = \\sqrt{${l1}^2 + ${l2}^2} = \\sqrt{${h * h}} = ${h}`, `r = \\frac{${h}}{2} = ${tex(half(h), u)}`)}`,
              `斜边 $AB$ 是直径。由勾股定理：${steps(`AB = \\sqrt{${l1}^2 + ${l2}^2} = \\sqrt{${h * h}} = ${h}`, `r = \\frac{${h}}{2} = ${tex(half(h), u)}`)}`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              { kind: "polygon", points: [d.pa, d.pb, d.pc] },
              { kind: "right", vertex: d.pc, from: d.pa, to: d.pb },
              sideIn(d.pa, d.pc, d.pb, len(l1, u)),
              sideIn(d.pb, d.pc, d.pa, len(l2, u)),
              ...pointsAt([
                [d.s, "A"],
                [d.s + 180, "B"],
                [d.c, "C"],
              ]),
            ],
            `A right triangle ABC inscribed in a circle, with legs AC = ${l1} ${u} and BC = ${l2} ${u}.`,
            `内接于圆的直角三角形 ABC，直角边 AC = ${l1} ${u}，BC = ${l2} ${u}。`,
          ),
        };
      },
    },
  ],
};

export const anglesInInscribedRightTriangles: TopicDef = {
  id: "angles-in-inscribed-right-triangles",
  title: t("Angles in Inscribed Right Triangles", "圆内接直角三角形中的角"),
  summary: t(
    "Find angles and arcs in a right triangle inscribed on a diameter, including with algebra.",
    "在以直径为斜边的圆内接直角三角形中求角和弧，包括含未知数的情形。",
  ),
  prerequisites: ["thales-theorem"],
  encompasses: [
    { topic: "thales-theorem", weight: 0.5 },
    { topic: "inscribed-angles", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "acute-angles-with-algebra",
      title: t("Acute angles with algebra", "含未知数的锐角"),
      explanation: t(
        "In a triangle inscribed on a diameter $AB$, the angle at $C$ is $90^\\circ$, so the other two angles add to $90^\\circ$:\n\n$$\\angle CAB + \\angle CBA = 90^\\circ.$$\n\nIf $\\angle CAB = (2x + 4)^\\circ$ and $\\angle CBA = (x + 11)^\\circ$, then $3x + 15 = 90$, so $3x = 75$ and $x = 25$.",
        "在以直径 $AB$ 为一边的圆内接三角形中，$C$ 处的角是 $90^\\circ$，所以另外两个角之和是 $90^\\circ$：\n\n$$\\angle CAB + \\angle CBA = 90^\\circ.$$\n\n若 $\\angle CAB = (2x + 4)^\\circ$，$\\angle CBA = (x + 11)^\\circ$，则 $3x + 15 = 90$，$3x = 75$，$x = 25$。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.int(20, 70);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, a, x);
        const [c2, d2] = expressionFor(rng, 90 - a, x);
        const d = diameterFigure(rng.int(0, 359), a);
        return {
          ...numberProblem({
            prompt: t("$AB$ is a diameter of circle $O$. Find $x$.", "$AB$ 是圆 $O$ 的直径。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: sumWrong(c1, d1, c2, d2, 90, [180, 360]),
            solution: t(
              `$\\angle ACB = 90^\\circ$ by Thales' theorem, so the other two angles add to $90^\\circ$:${solveSum(c1, d1, c2, d2, 90)}`,
              `由泰勒斯定理 $\\angle ACB = 90^\\circ$，所以另外两个角之和是 $90^\\circ$：${solveSum(c1, d1, c2, d2, 90)}`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [angleAt(d.pa, d.pb, d.pc, angleLabel(c1, d1)), angleAt(d.pb, d.pc, d.pa, angleLabel(c2, d2))]),
            `Circle O with diameter AB and C on the circle; angle CAB is ${angleLabel(c1, d1)} and angle CBA is ${angleLabel(c2, d2)}.`,
            `圆 O，AB 是直径，C 在圆上；角 CAB 为 ${angleLabel(c1, d1)}，角 CBA 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "arcs-from-angles",
      title: t("Arcs from the angles", "由角求弧"),
      explanation: t(
        `The diameter $AB$ cuts the circle into two semicircles. On the one containing $C$, the arcs $${arcTex("AC")}$ and $${arcTex("BC")}$ add to $180^\\circ$, and each is twice the inscribed angle at the opposite vertex:\n\n$$m${arcTex("BC")} = 2\\angle CAB, \\qquad m${arcTex("AC")} = 2\\angle CBA.$$\n\nIf $\\angle CAB = 25^\\circ$, then $m${arcTex("BC")} = 50^\\circ$ and $m${arcTex("AC")} = 180^\\circ - 50^\\circ = 130^\\circ$.`,
        `直径 $AB$ 把圆分成两个半圆。在含 $C$ 的半圆上，弧 $${arcTex("AC")}$ 与弧 $${arcTex("BC")}$ 之和是 $180^\\circ$，每段弧都是对面顶点处圆周角的两倍：\n\n$$m${arcTex("BC")} = 2\\angle CAB, \\qquad m${arcTex("AC")} = 2\\angle CBA.$$\n\n若 $\\angle CAB = 25^\\circ$，则 $m${arcTex("BC")} = 50^\\circ$，$m${arcTex("AC")} = 180^\\circ - 50^\\circ = 130^\\circ$。`,
      ),
      generate(rng) {
        const a = rng.int(15, 75);
        const d = diameterFigure(rng.int(0, 359), a);
        const askBC = rng.bool();
        const arc = askBC ? 2 * a : 180 - 2 * a;
        const arcMarks = askBC ? [...arcAt(d.c, d.s + 180), arcText(d.c, d.s + 180, "?")] : [...arcAt(d.s, d.c), arcText(d.s, d.c, "?")];
        const name = askBC ? "BC" : "AC";
        return {
          ...numberProblem({
            prompt: t(
              `$AB$ is a diameter of circle $O$. Find the measure of arc $${arcTex(name)}$ that does not contain the other endpoint of the diameter.`,
              `$AB$ 是圆 $O$ 的直径。求不含直径另一端点的弧 $${arcTex(name)}$ 的度数。`,
            ),
            answer: arc,
            unit: "°",
            wrong: askBC ? [a, 180 - 2 * a, 180 - a] : [2 * a, 180 - a, 90 - a],
            solution: askBC
              ? t(
                  `$\\angle CAB$ is inscribed and intercepts arc $${arcTex("BC")}$:${steps(`m${arcTex("BC")} = 2 \\cdot ${a}^\\circ = ${arc}^\\circ`)}`,
                  `$\\angle CAB$ 是圆周角，所对的弧是 $${arcTex("BC")}$：${steps(`m${arcTex("BC")} = 2 \\cdot ${a}^\\circ = ${arc}^\\circ`)}`,
                )
              : t(
                  `$\\angle CAB$ intercepts arc $${arcTex("BC")}$ of $2 \\cdot ${a}^\\circ = ${2 * a}^\\circ$, and arcs $${arcTex("AC")}$ and $${arcTex("BC")}$ make up a semicircle:${steps(`m${arcTex("AC")} = 180^\\circ - ${2 * a}^\\circ = ${arc}^\\circ`)}`,
                  `$\\angle CAB$ 所对的弧 $${arcTex("BC")}$ 是 $2 \\cdot ${a}^\\circ = ${2 * a}^\\circ$，而弧 $${arcTex("AC")}$ 与弧 $${arcTex("BC")}$ 合起来是半圆：${steps(`m${arcTex("AC")} = 180^\\circ - ${2 * a}^\\circ = ${arc}^\\circ`)}`,
                ),
          }),
          figure: figure(
            diameterMarks(d, [angleAt(d.pa, d.pb, d.pc, deg(a)), ...arcMarks]),
            `Circle O with diameter AB and C on the circle; angle CAB is ${a}° and arc ${name} is highlighted.`,
            `圆 O，AB 是直径，C 在圆上；角 CAB 为 ${a}°，弧 ${name} 被突出显示。`,
          ),
        };
      },
    },
    {
      id: "angles-from-arcs",
      title: t("Angles from the arcs", "由弧求角"),
      explanation: t(
        `Going the other way, each acute angle is half the arc opposite it. If $AB$ is a diameter and $m${arcTex("AC")} = 70^\\circ$ (on the semicircle containing $C$), then\n\n$$\\angle CBA = \\frac{70^\\circ}{2} = 35^\\circ, \\qquad \\angle CAB = 90^\\circ - 35^\\circ = 55^\\circ.$$\n\nThe second also follows from $m${arcTex("BC")} = 180^\\circ - 70^\\circ = 110^\\circ$, whose half is $55^\\circ$.`,
        `反过来，每个锐角都是它对面那段弧的一半。若 $AB$ 是直径，且（在含 $C$ 的半圆上）$m${arcTex("AC")} = 70^\\circ$，则\n\n$$\\angle CBA = \\frac{70^\\circ}{2} = 35^\\circ, \\qquad \\angle CAB = 90^\\circ - 35^\\circ = 55^\\circ.$$\n\n后者也可以由 $m${arcTex("BC")} = 180^\\circ - 70^\\circ = 110^\\circ$ 的一半得到 $55^\\circ$。`,
      ),
      generate(rng) {
        const m = 2 * rng.int(15, 75);
        const a = 90 - m / 2;
        const d = diameterFigure(rng.int(0, 359), a);
        const askA = rng.bool();
        return {
          ...numberProblem({
            prompt: t(
              `$AB$ is a diameter of circle $O$. Find $\\angle ${askA ? "CAB" : "CBA"}$.`,
              `$AB$ 是圆 $O$ 的直径。求 $\\angle ${askA ? "CAB" : "CBA"}$。`,
            ),
            answer: askA ? a : m / 2,
            unit: "°",
            wrong: askA ? [m / 2, 180 - m, m] : [m, a, 180 - m],
            solution: askA
              ? t(
                  `$\\angle CAB$ intercepts arc $${arcTex("BC")}$, the rest of the semicircle:${steps(`m${arcTex("BC")} = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`, `\\angle CAB = \\frac{${180 - m}^\\circ}{2} = ${a}^\\circ`)}`,
                  `$\\angle CAB$ 所对的弧是 $${arcTex("BC")}$，即半圆的其余部分：${steps(`m${arcTex("BC")} = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`, `\\angle CAB = \\frac{${180 - m}^\\circ}{2} = ${a}^\\circ`)}`,
                )
              : t(
                  `$\\angle CBA$ is inscribed and intercepts arc $${arcTex("AC")}$:${steps(`\\angle CBA = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}`,
                  `$\\angle CBA$ 是圆周角，所对的弧是 $${arcTex("AC")}$：${steps(`\\angle CBA = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}`,
                ),
          }),
          figure: figure(
            diameterMarks(d, [
              ...arcAt(d.s, d.c),
              arcText(d.s, d.c, deg(m)),
              askA ? angleAt(d.pa, d.pb, d.pc, "?") : angleAt(d.pb, d.pc, d.pa, "?"),
            ]),
            `Circle O with diameter AB and C on the circle; arc AC is ${m}°.`,
            `圆 O，AB 是直径，C 在圆上；弧 AC 为 ${m}°。`,
          ),
        };
      },
    },
  ],
};

export const furtherAnglesInInscribedRightTriangles: TopicDef = {
  id: "further-angles-in-inscribed-right-triangles",
  title: t("Further Angles in Inscribed Right Triangles", "圆内接直角三角形中的角（进阶）"),
  summary: t(
    "Draw the radius to the right-angle vertex: it splits the triangle into two isosceles triangles and equals half the hypotenuse.",
    "连接圆心与直角顶点的半径：它把三角形分成两个等腰三角形，且等于斜边的一半。",
  ),
  prerequisites: ["angles-in-inscribed-right-triangles", "the-exterior-angle-theorem"],
  encompasses: [
    { topic: "angles-in-inscribed-right-triangles", weight: 0.5 },
    { topic: "isosceles-triangles", weight: 0.3 },
    { topic: "the-exterior-angle-theorem", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "angles-at-the-radius",
      title: t("Angles at the radius", "半径处的角"),
      explanation: t(
        "Let $AB$ be a diameter of circle $O$ and $C$ a point on the circle. The radius $OC$ equals $OA$ and $OB$, so it splits $\\triangle ABC$ into two **isosceles** triangles.\n\nIf $\\angle CAB = 32^\\circ$:\n\n- in $\\triangle AOC$, $\\angle ACO = \\angle CAO = 32^\\circ$, and $\\angle AOC = 180^\\circ - 64^\\circ = 116^\\circ$;\n- $\\angle BOC$ is an exterior angle of $\\triangle AOC$, so $\\angle BOC = 32^\\circ + 32^\\circ = 64^\\circ$;\n- $\\angle OCB = 90^\\circ - 32^\\circ = 58^\\circ$, which equals $\\angle OBC$.",
        "设 $AB$ 是圆 $O$ 的直径，$C$ 是圆上一点。半径 $OC$ 等于 $OA$ 和 $OB$，所以它把 $\\triangle ABC$ 分成两个**等腰**三角形。\n\n若 $\\angle CAB = 32^\\circ$：\n\n- 在 $\\triangle AOC$ 中，$\\angle ACO = \\angle CAO = 32^\\circ$，$\\angle AOC = 180^\\circ - 64^\\circ = 116^\\circ$；\n- $\\angle BOC$ 是 $\\triangle AOC$ 的外角，所以 $\\angle BOC = 32^\\circ + 32^\\circ = 64^\\circ$；\n- $\\angle OCB = 90^\\circ - 32^\\circ = 58^\\circ$，它等于 $\\angle OBC$。",
      ),
      generate(rng) {
        const a = rng.int(20, 70);
        const d = diameterFigure(rng.int(0, 359), a);
        const ask = rng.int(0, 3);
        const name = ["ACO", "OCB", "BOC", "AOC"][ask]!;
        const answer = [a, 90 - a, 2 * a, 180 - 2 * a][ask]!;
        const mark = [angleAt(d.pc, d.pa, O, "?"), angleAt(d.pc, O, d.pb, "?"), angleAt(O, d.pb, d.pc, "?"), angleAt(O, d.pc, d.pa, "?")][
          ask
        ]!;
        const wrong = [
          [90 - a, 180 - 2 * a, 2 * a],
          [a, 2 * a, 180 - 2 * a],
          [a, 180 - 2 * a, 90 - a],
          [2 * a, 180 - a, 90 - a],
        ][ask]!;
        const why = [
          t(
            `$OA = OC$, so $\\triangle AOC$ is isosceles and its base angles are equal:${steps(`\\angle ACO = \\angle CAO = ${a}^\\circ`)}`,
            `$OA = OC$，所以 $\\triangle AOC$ 是等腰三角形，两个底角相等：${steps(`\\angle ACO = \\angle CAO = ${a}^\\circ`)}`,
          ),
          t(
            `$\\angle ACB = 90^\\circ$ by Thales' theorem, and $\\angle ACO = ${a}^\\circ$ because $OA = OC$:${steps(`\\angle OCB = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
            `由泰勒斯定理 $\\angle ACB = 90^\\circ$；因为 $OA = OC$，$\\angle ACO = ${a}^\\circ$：${steps(`\\angle OCB = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
          ),
          t(
            `$\\angle BOC$ is a central angle on arc $${arcTex("BC")}$, which the inscribed angle $\\angle CAB$ also intercepts:${steps(`\\angle BOC = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`)}`,
            `$\\angle BOC$ 是弧 $${arcTex("BC")}$ 所对的圆心角，圆周角 $\\angle CAB$ 也对着这段弧：${steps(`\\angle BOC = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`)}`,
          ),
          t(
            `$OA = OC$, so $\\angle ACO = \\angle CAO = ${a}^\\circ$, and the angles of $\\triangle AOC$ add to $180^\\circ$:${steps(`\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ`)}`,
            `$OA = OC$，所以 $\\angle ACO = \\angle CAO = ${a}^\\circ$，而 $\\triangle AOC$ 的内角和是 $180^\\circ$：${steps(`\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ`)}`,
          ),
        ][ask]!;
        return {
          ...numberProblem({
            prompt: t(
              `$AB$ is a diameter of circle $O$, and $OC$ is a radius. Find $\\angle ${name}$.`,
              `$AB$ 是圆 $O$ 的直径，$OC$ 是半径。求 $\\angle ${name}$。`,
            ),
            answer,
            unit: "°",
            wrong,
            solution: why,
          }),
          figure: figure(
            diameterMarks(d, [angleAt(d.pa, d.pb, d.pc, deg(a)), mark], true),
            `Circle O with diameter AB, C on the circle and radius OC; angle CAB is ${a}°.`,
            `圆 O，AB 是直径，C 在圆上，画有半径 OC；角 CAB 为 ${a}°。`,
          ),
        };
      },
    },
    {
      id: "the-radius-is-half-the-hypotenuse",
      title: t("The radius is half the hypotenuse", "半径是斜边的一半"),
      explanation: t(
        "In a right triangle $ABC$ inscribed on the diameter $AB$, the segment from $C$ to the center $O$ is a radius, so\n\n$$OC = OA = OB = \\tfrac{1}{2}AB.$$\n\nThe median to the hypotenuse is half the hypotenuse. If $OC = 2x + 1$ and $AB = 5x - 4$, then $2(2x + 1) = 5x - 4$, so $4x + 2 = 5x - 4$ and $x = 6$: $OC = 13$ and $AB = 26$.",
        "在以直径 $AB$ 为斜边的圆内接直角三角形 $ABC$ 中，从 $C$ 到圆心 $O$ 的线段是半径，所以\n\n$$OC = OA = OB = \\tfrac{1}{2}AB.$$\n\n斜边上的中线等于斜边的一半。若 $OC = 2x + 1$，$AB = 5x - 4$，则 $2(2x + 1) = 5x - 4$，即 $4x + 2 = 5x - 4$，$x = 6$：$OC = 13$，$AB = 26$。",
      ),
      keyPrerequisites: ["angles-in-inscribed-right-triangles"],
      generate(rng) {
        const r = rng.int(6, 25);
        const x = rng.int(2, 9);
        const [c1, d1] = expressionFor(rng, r, x, 3);
        const [c2, d2] = expressionFor(rng, 2 * r, x, 7, [2 * c1]);
        const d = diameterFigure(rng.int(0, 359), rng.int(25, 65));
        const sides = rng.bool();
        const [lab1, lab2] = [linear(c1, d1), linear(c2, d2)];
        return {
          ...numberProblem({
            prompt: sides
              ? t(
                  `$AB$ is a diameter of circle $O$ and $C$ is on the circle, with $OC = ${lab1}$ and $AB = ${lab2}$. Find $x$.`,
                  `$AB$ 是圆 $O$ 的直径，$C$ 在圆上，$OC = ${lab1}$，$AB = ${lab2}$。求 $x$。`,
                )
              : t(
                  `$AB$ is a diameter of circle $O$ and $C$ is on the circle, with $AB = ${lab2}$ and $OC = ${lab1}$. Find $x$.`,
                  `$AB$ 是圆 $O$ 的直径，$C$ 在圆上，$AB = ${lab2}$，$OC = ${lab1}$。求 $x$。`,
                ),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), r],
            solution: t(
              `$OC$ is a radius, so it is half the diameter $AB$:${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${lab1}) = ${lab2}`)}`,
              `$OC$ 是半径，所以它是直径 $AB$ 的一半：${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${lab1}) = ${lab2}`)}`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [{ kind: "right", vertex: d.pc, from: d.pa, to: d.pb }], true),
            "Circle O with diameter AB, C on the circle, the right triangle ABC and the radius OC.",
            "圆 O，AB 是直径，C 在圆上，画有直角三角形 ABC 和半径 OC。",
          ),
        };
      },
    },
    {
      id: "radius-angles-with-algebra",
      title: t("Angles at the radius with algebra", "含未知数的半径处的角"),
      explanation: t(
        "In the figure, $\\angle BOC$ is an exterior angle of the isosceles triangle $AOC$, so it is the sum of the two equal angles at $A$ and $C$:\n\n$$\\angle BOC = 2\\angle ACO.$$\n\nIf $\\angle ACO = (x + 9)^\\circ$ and $\\angle BOC = (3x + 4)^\\circ$, then $2(x + 9) = 3x + 4$, so $2x + 18 = 3x + 4$ and $x = 14$.",
        "图中 $\\angle BOC$ 是等腰三角形 $AOC$ 的外角，所以它等于 $A$、$C$ 处两个相等的角之和：\n\n$$\\angle BOC = 2\\angle ACO.$$\n\n若 $\\angle ACO = (x + 9)^\\circ$，$\\angle BOC = (3x + 4)^\\circ$，则 $2(x + 9) = 3x + 4$，即 $2x + 18 = 3x + 4$，$x = 14$。",
      ),
      keyPrerequisites: ["the-exterior-angle-theorem"],
      generate(rng) {
        const a = rng.int(20, 70);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, a, x, 4);
        const [c2, d2] = expressionFor(rng, 2 * a, x, 9, [2 * c1]);
        const d = diameterFigure(rng.int(0, 359), a);
        return {
          ...numberProblem({
            prompt: t("$AB$ is a diameter of circle $O$, and $OC$ is a radius. Find $x$.", "$AB$ 是圆 $O$ 的直径，$OC$ 是半径。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), ...some([frac(180 - d1 - d2, c1 + c2)])],
            solution: t(
              `$OA = OC$, so $\\angle CAO = \\angle ACO$, and the exterior angle $\\angle BOC$ of $\\triangle AOC$ is their sum:${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
              `$OA = OC$，所以 $\\angle CAO = \\angle ACO$，而 $\\triangle AOC$ 的外角 $\\angle BOC$ 等于它们的和：${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [angleAt(d.pc, d.pa, O, angleLabel(c1, d1)), angleAt(O, d.pb, d.pc, angleLabel(c2, d2))], true),
            `Circle O with diameter AB, C on the circle and radius OC; angle ACO is ${angleLabel(c1, d1)} and angle BOC is ${angleLabel(c2, d2)}.`,
            `圆 O，AB 是直径，C 在圆上，画有半径 OC；角 ACO 为 ${angleLabel(c1, d1)}，角 BOC 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Inscribed quadrilaterals
// ---------------------------------------------------------------------------

/** Quad is a quadrilateral ABCD inscribed in a circle, with arcs AB, BC, CD, DA. */
interface Quad {
  readonly at: readonly [number, number, number, number];
  readonly pts: readonly [Point, Point, Point, Point];
  readonly arcs: readonly [number, number, number, number];
  /** angles are the angles at A, B, C and D. */
  readonly angles: readonly [number, number, number, number];
}

/** quad places an inscribed quadrilateral with even arcs of at least 50°. */
function quad(rng: Rng): Quad {
  const a1 = 2 * rng.int(25, 55);
  const a2 = 2 * rng.int(25, 55);
  const a3 = 2 * rng.int(25, Math.min(70, (310 - a1 - a2) / 2));
  const a4 = 360 - a1 - a2 - a3;
  const s = rng.int(0, 359);
  const at = [s, s + a1, s + a1 + a2, s + a1 + a2 + a3] as const;
  return {
    at,
    pts: [on(at[0]), on(at[1]), on(at[2]), on(at[3])],
    arcs: [a1, a2, a3, a4],
    angles: [(a2 + a3) / 2, (a3 + a4) / 2, (a4 + a1) / 2, (a1 + a2) / 2],
  };
}

const letters = ["A", "B", "C", "D"] as const;

/** quadAngle marks the angle of the quadrilateral at vertex i. */
function quadAngle(qd: Quad, i: number, label: string): Mark {
  const p = qd.pts;
  return angleAt(p[i]!, p[(i + 3) % 4]!, p[(i + 1) % 4]!, label);
}

/** quadMarks draws the circle, the quadrilateral and the vertex names. */
const quadMarks = (qd: Quad, extra: readonly Mark[]): Mark[] => [
  circleAt(),
  { kind: "polygon", points: qd.pts },
  ...extra,
  ...pointsAt(qd.at.map((d, i) => [d, letters[i]!] as const)),
];

export const inscribedQuadrilaterals: TopicDef = {
  id: "inscribed-quadrilaterals",
  title: t("Inscribed Quadrilaterals", "圆内接四边形"),
  summary: t(
    "Opposite angles of a quadrilateral inscribed in a circle are supplementary; use it with numbers, algebra and arcs.",
    "圆内接四边形的对角互补；结合数值、代数和弧来运用它。",
  ),
  prerequisites: ["problem-solving-with-inscribed-angles", "angles-of-polygons"],
  encompasses: [
    { topic: "problem-solving-with-inscribed-angles", weight: 0.4 },
    { topic: "inscribed-angles", weight: 0.4 },
    { topic: "angles-of-polygons", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.3"],
  knowledgePoints: [
    {
      id: "opposite-angles-are-supplementary",
      title: t("Opposite angles", "对角互补"),
      explanation: t(
        `A quadrilateral is **inscribed** in a circle when all four vertices are on it. Opposite angles $\\angle A$ and $\\angle C$ intercept the two arcs between $B$ and $D$, which together make the whole circle:\n\n$$\\angle A + \\angle C = \\tfrac{1}{2} \\cdot 360^\\circ = 180^\\circ.$$\n\nSo opposite angles are **supplementary**. If $\\angle B = 104^\\circ$, then $\\angle D = 180^\\circ - 104^\\circ = 76^\\circ$. Adjacent angles, such as $\\angle A$ and $\\angle B$, need not add to $180^\\circ$.`,
        `四个顶点都在圆上的四边形叫圆**内接**四边形。对角 $\\angle A$ 和 $\\angle C$ 分别对着 $B$、$D$ 之间的两段弧，这两段弧合起来是整个圆：\n\n$$\\angle A + \\angle C = \\tfrac{1}{2} \\cdot 360^\\circ = 180^\\circ.$$\n\n所以对角**互补**。若 $\\angle B = 104^\\circ$，则 $\\angle D = 180^\\circ - 104^\\circ = 76^\\circ$。相邻的角（如 $\\angle A$ 与 $\\angle B$）之和不一定是 $180^\\circ$。`,
      ),
      generate(rng) {
        const qd = quad(rng);
        const ask = rng.int(2, 3);
        const opp = ask - 2;
        const other = 1 - opp;
        const [g, h] = [qd.angles[opp]!, qd.angles[other]!];
        const name = letters[ask]!;
        return {
          ...numberProblem({
            prompt: t(
              `Quadrilateral $ABCD$ is inscribed in the circle. Find $\\angle ${name}$.`,
              `四边形 $ABCD$ 内接于圆。求 $\\angle ${name}$。`,
            ),
            answer: 180 - g,
            unit: "°",
            wrong: [g, 360 - g, 180 - h, h],
            solution: t(
              `$\\angle ${name}$ is opposite $\\angle ${letters[opp]}$, and opposite angles of an inscribed quadrilateral are supplementary:${steps(`\\angle ${name} = 180^\\circ - ${g}^\\circ = ${180 - g}^\\circ`)}`,
              `$\\angle ${name}$ 与 $\\angle ${letters[opp]}$ 是对角，圆内接四边形的对角互补：${steps(`\\angle ${name} = 180^\\circ - ${g}^\\circ = ${180 - g}^\\circ`)}`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [quadAngle(qd, 0, deg(qd.angles[0])), quadAngle(qd, 1, deg(qd.angles[1])), quadAngle(qd, ask, "?")]),
            `Quadrilateral ABCD inscribed in a circle; angle A is ${qd.angles[0]}° and angle B is ${qd.angles[1]}°.`,
            `内接于圆的四边形 ABCD；角 A 为 ${qd.angles[0]}°，角 B 为 ${qd.angles[1]}°。`,
          ),
        };
      },
    },
    {
      id: "inscribed-quadrilaterals-with-algebra",
      title: t("Inscribed quadrilaterals with algebra", "含未知数的圆内接四边形"),
      explanation: t(
        "When opposite angles are written with a variable, their sum is $180^\\circ$.\n\nIf $\\angle A = (3x + 5)^\\circ$ and $\\angle C = (2x + 25)^\\circ$, then $5x + 30 = 180$, so $5x = 150$ and $x = 30$. Then $\\angle A = 95^\\circ$ and $\\angle C = 85^\\circ$.",
        "当对角用含变量的式子表示时，它们的和是 $180^\\circ$。\n\n若 $\\angle A = (3x + 5)^\\circ$，$\\angle C = (2x + 25)^\\circ$，则 $5x + 30 = 180$，$5x = 150$，$x = 30$。于是 $\\angle A = 95^\\circ$，$\\angle C = 85^\\circ$。",
      ),
      generate(rng) {
        const qd = quad(rng);
        const i = rng.int(0, 1);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, qd.angles[i]!, x);
        const [c2, d2] = expressionFor(rng, qd.angles[i + 2]!, x);
        const [n1, n2] = [letters[i]!, letters[i + 2]!];
        return {
          ...numberProblem({
            prompt: t("Quadrilateral $ABCD$ is inscribed in the circle. Find $x$.", "四边形 $ABCD$ 内接于圆。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: sumWrong(c1, d1, c2, d2, 180, [360, 90]),
            solution: t(
              `$\\angle ${n1}$ and $\\angle ${n2}$ are opposite angles, so they are supplementary:${solveSum(c1, d1, c2, d2, 180)}`,
              `$\\angle ${n1}$ 与 $\\angle ${n2}$ 是对角，所以它们互补：${solveSum(c1, d1, c2, d2, 180)}`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [quadAngle(qd, i, angleLabel(c1, d1)), quadAngle(qd, i + 2, angleLabel(c2, d2))]),
            `Quadrilateral ABCD inscribed in a circle; angle ${n1} is ${angleLabel(c1, d1)} and angle ${n2} is ${angleLabel(c2, d2)}.`,
            `内接于圆的四边形 ABCD；角 ${n1} 为 ${angleLabel(c1, d1)}，角 ${n2} 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "angles-of-inscribed-quadrilaterals-from-arcs",
      title: t("Angles from arcs", "由弧求角"),
      explanation: t(
        `Each angle of an inscribed quadrilateral intercepts the arc between its two neighbors that does **not** contain the vertex itself: $\\angle A$ intercepts $${arcTex("BCD")}$, made of arcs $${arcTex("BC")}$ and $${arcTex("CD")}$.\n\nIf $m${arcTex("AB")} = 80^\\circ$, $m${arcTex("BC")} = 100^\\circ$ and $m${arcTex("CD")} = 110^\\circ$, then\n\n$$\\angle A = \\frac{100^\\circ + 110^\\circ}{2} = 105^\\circ,$$\n\nand $m${arcTex("DA")} = 360^\\circ - 290^\\circ = 70^\\circ$, so $\\angle B = \\frac{110^\\circ + 70^\\circ}{2} = 90^\\circ$.`,
        `圆内接四边形的每个角都对着它两个相邻顶点之间、**不含**该顶点的那段弧：$\\angle A$ 对着 $${arcTex("BCD")}$，它由弧 $${arcTex("BC")}$ 和弧 $${arcTex("CD")}$ 组成。\n\n若 $m${arcTex("AB")} = 80^\\circ$，$m${arcTex("BC")} = 100^\\circ$，$m${arcTex("CD")} = 110^\\circ$，则\n\n$$\\angle A = \\frac{100^\\circ + 110^\\circ}{2} = 105^\\circ,$$\n\n且 $m${arcTex("DA")} = 360^\\circ - 290^\\circ = 70^\\circ$，所以 $\\angle B = \\frac{110^\\circ + 70^\\circ}{2} = 90^\\circ$。`,
      ),
      generate(rng) {
        const qd = quad(rng);
        const [a1, a2, a3, a4] = qd.arcs;
        const ask = rng.pick([0, 1, 3] as const);
        const name = letters[ask];
        const answer = qd.angles[ask];
        const full = 2 * answer;
        const arcName = ["BCD", "CDA", "", "ABC"][ask]!;
        const work = [
          `\\angle A = \\frac{${a2}^\\circ + ${a3}^\\circ}{2} = ${answer}^\\circ`,
          `m${arcTex("DA")} = 360^\\circ - ${a1}^\\circ - ${a2}^\\circ - ${a3}^\\circ = ${a4}^\\circ`,
          "",
          `\\angle D = \\frac{${a1}^\\circ + ${a2}^\\circ}{2} = ${answer}^\\circ`,
        ];
        const lines = ask === 1 ? [work[1]!, `\\angle B = \\frac{${a3}^\\circ + ${a4}^\\circ}{2} = ${answer}^\\circ`] : [work[ask]!];
        return {
          ...numberProblem({
            prompt: t(
              `Quadrilateral $ABCD$ is inscribed in the circle. Find $\\angle ${name}$.`,
              `四边形 $ABCD$ 内接于圆。求 $\\angle ${name}$。`,
            ),
            answer,
            unit: "°",
            wrong: [full, 180 - answer, 360 - full],
            solution: t(
              `$\\angle ${name}$ intercepts arc $${arcTex(arcName)}$, the arc between its neighbors that does not contain $${name}$. It is half of that arc:${steps(...lines)}`,
              `$\\angle ${name}$ 对着弧 $${arcTex(arcName)}$，即两个相邻顶点之间不含 $${name}$ 的弧。它是这段弧的一半：${steps(...lines)}`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [
              arcText(qd.at[0], qd.at[1], deg(a1)),
              arcText(qd.at[1], qd.at[2], deg(a2)),
              arcText(qd.at[2], qd.at[3], deg(a3)),
              quadAngle(qd, ask, "?"),
            ]),
            `Quadrilateral ABCD inscribed in a circle; arc AB is ${a1}°, arc BC is ${a2}° and arc CD is ${a3}°.`,
            `内接于圆的四边形 ABCD；弧 AB 为 ${a1}°，弧 BC 为 ${a2}°，弧 CD 为 ${a3}°。`,
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Tangents
// ---------------------------------------------------------------------------

/** Tangent is circle O with a tangent at A = on(s) and a point P on it, at distance t·R from A on the counterclockwise side when side is 1. */
interface Tangent {
  readonly s: number;
  readonly pa: Point;
  readonly pp: Point;
  readonly side: 1 | -1;
}

const tangentAt = (s: number, t: number, side: 1 | -1): Tangent => ({ s, pa: on(s), pp: along(on(s), tangentDir(s), side * t * R), side });

/** tangentMarks draws circle O, the tangent line through A and P, the extra marks and the names A, P and O. */
function tangentMarks(tg: Tangent, extra: readonly Mark[], showOP = true): Mark[] {
  const back = along(tg.pa, tangentDir(tg.s), -tg.side * 0.5 * R);
  const opDir = heading(tg.pp);
  return [
    circleAt(),
    seg(back, tg.pp),
    seg(O, tg.pa),
    ...(showOP ? [seg(O, tg.pp)] : []),
    ...extra,
    ...center(dirOf(opDir + 180 - tg.side * 20)),
    ...pointsAt([[tg.s, "A"]]),
    ...outside(tg.pp),
  ];
}

export const tangentLinesToCircles: TopicDef = {
  id: "tangent-lines-to-circles",
  title: t("Tangent Lines to Circles", "圆的切线"),
  summary: t(
    "A tangent is perpendicular to the radius at the point of tangency; use it to find angles and lengths and to test for tangency.",
    "切线垂直于过切点的半径；用它求角和长度，并判断直线是否为切线。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "circles", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "tangents-are-perpendicular-to-radii",
      title: t("Tangents are perpendicular to radii", "切线垂直于半径"),
      explanation: t(
        "A **tangent** to a circle is a line that touches the circle at exactly one point, the **point of tangency**. A tangent is **perpendicular** to the radius drawn to the point of tangency.\n\nIf $PA$ is tangent to circle $O$ at $A$, then $\\angle OAP = 90^\\circ$, and triangle $OAP$ is a right triangle. If $\\angle AOP = 52^\\circ$, then\n\n$$\\angle APO = 180^\\circ - 90^\\circ - 52^\\circ = 38^\\circ.$$",
        "与圆只有一个公共点的直线叫圆的**切线**，这个公共点叫**切点**。切线**垂直于**过切点的半径。\n\n若 $PA$ 与圆 $O$ 相切于 $A$，则 $\\angle OAP = 90^\\circ$，$\\triangle OAP$ 是直角三角形。若 $\\angle AOP = 52^\\circ$，则\n\n$$\\angle APO = 180^\\circ - 90^\\circ - 52^\\circ = 38^\\circ.$$",
      ),
      generate(rng) {
        const theta = rng.int(25, 70);
        const tg = tangentAt(rng.int(0, 359), Math.tan(rad(theta)), rng.pick([1, -1] as const));
        const atO = rng.bool();
        const g = atO ? theta : 90 - theta;
        const [given, asked] = atO ? ["AOP", "APO"] : ["APO", "AOP"];
        const marks = atO
          ? [angleAt(O, tg.pa, tg.pp, deg(g)), angleAt(tg.pp, tg.pa, O, "?")]
          : [angleAt(tg.pp, tg.pa, O, deg(g)), angleAt(O, tg.pa, tg.pp, "?")];
        return {
          ...numberProblem({
            prompt: t(
              `$PA$ is tangent to circle $O$ at $A$. Find $\\angle ${asked}$.`,
              `$PA$ 与圆 $O$ 相切于 $A$。求 $\\angle ${asked}$。`,
            ),
            answer: 90 - g,
            unit: "°",
            wrong: [180 - g, g, 90 + g],
            solution: t(
              `A tangent is perpendicular to the radius at the point of tangency, so $\\angle OAP = 90^\\circ$:${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${90 - g}^\\circ`)}`,
              `切线垂直于过切点的半径，所以 $\\angle OAP = 90^\\circ$：${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${90 - g}^\\circ`)}`,
            ),
          }),
          figure: figure(
            tangentMarks(tg, marks),
            `Circle O with a tangent at A through the point P, and segments OA and OP; angle ${given} is ${g}°.`,
            `圆 O，过点 P 的直线与圆相切于 A，画有线段 OA、OP；角 ${given} 为 ${g}°。`,
          ),
        };
      },
    },
    {
      id: "lengths-with-tangents",
      title: t("Lengths with tangents", "与切线有关的长度"),
      explanation: t(
        "Since $\\angle OAP = 90^\\circ$, the radius $OA$ and the tangent segment $PA$ are the legs of a right triangle whose hypotenuse is $OP$:\n\n$$OA^2 + PA^2 = OP^2.$$\n\nIf the radius is $5$ cm and $OP = 13$ cm, then $PA^2 = 169 - 25 = 144$ and $PA = 12$ cm.",
        "因为 $\\angle OAP = 90^\\circ$，半径 $OA$ 与切线段 $PA$ 是直角三角形的两条直角边，斜边是 $OP$：\n\n$$OA^2 + PA^2 = OP^2.$$\n\n若半径是 $5$ 厘米，$OP = 13$ 厘米，则 $PA^2 = 169 - 25 = 144$，$PA = 12$ 厘米。",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        const [p0, q0, h0] = rng.pick(triples.slice(0, 4));
        const k = rng.int(1, 3);
        const [r, tl] = rng.bool() ? [p0 * k, q0 * k] : [q0 * k, p0 * k];
        const h = h0 * k;
        const u = pickUnit(rng);
        const tg = tangentAt(rng.int(0, 359), tl / r, rng.pick([1, -1] as const));
        const ask = rng.int(0, 2);
        const labels: Mark[] = [];
        if (ask !== 0) labels.push(sideOut(O, tg.pa, tg.pp, len(r, u)));
        if (ask !== 1) labels.push(sideOut(tg.pa, tg.pp, O, len(tl, u)));
        if (ask !== 2) labels.push(sideOut(tg.pp, O, tg.pa, len(h, u)));
        const askName = ["OA", "PA", "OP"][ask]!;
        const answer = [r, tl, h][ask]!;
        const wrong = [
          [h - tl, h + tl, tl],
          [h - r, h + r, r],
          [r + tl, Math.abs(tl - r), tl],
        ][ask]!;
        const work = [
          [`OA^2 = ${h}^2 - ${tl}^2 = ${h * h - tl * tl}`, `OA = ${tex(r, u)}`],
          [`PA^2 = ${h}^2 - ${r}^2 = ${h * h - r * r}`, `PA = ${tex(tl, u)}`],
          [`OP^2 = ${r}^2 + ${tl}^2 = ${h * h}`, `OP = ${tex(h, u)}`],
        ][ask]!;
        return {
          ...numberProblem({
            prompt: t(`$PA$ is tangent to circle $O$ at $A$. Find $${askName}$.`, `$PA$ 与圆 $O$ 相切于 $A$。求 $${askName}$。`),
            answer,
            unit: u,
            wrong,
            solution: t(
              `$\\angle OAP = 90^\\circ$, so $OA^2 + PA^2 = OP^2$:${steps(...work)}`,
              `$\\angle OAP = 90^\\circ$，所以 $OA^2 + PA^2 = OP^2$：${steps(...work)}`,
            ),
          }),
          figure: figure(
            tangentMarks(tg, labels),
            `Circle O with a tangent at A through the point P, and segments OA and OP; two of OA, PA and OP are labeled.`,
            `圆 O，过点 P 的直线与圆相切于 A，画有线段 OA、OP；OA、PA、OP 中两条标出了长度。`,
          ),
        };
      },
    },
    {
      id: "testing-for-tangency",
      title: t("Testing for tangency", "判断是否相切"),
      explanation: t(
        "Conversely, a line through a point $A$ of the circle that is perpendicular to the radius $OA$ is a tangent. To test whether $PA$ is tangent, check whether $\\angle OAP = 90^\\circ$ with the converse of the Pythagorean theorem: is $OA^2 + PA^2 = OP^2$?\n\nWith $OA = 8$, $PA = 15$ and $OP = 17$: $64 + 225 = 289 = 17^2$, so $PA$ is tangent. With $OP = 18$ instead, $289 \\ne 324$, so it is not.",
        "反过来，过圆上一点 $A$ 且垂直于半径 $OA$ 的直线是切线。要判断 $PA$ 是否为切线，就用勾股定理的逆定理检验 $\\angle OAP$ 是否为 $90^\\circ$：$OA^2 + PA^2 = OP^2$ 是否成立？\n\n当 $OA = 8$，$PA = 15$，$OP = 17$ 时：$64 + 225 = 289 = 17^2$，所以 $PA$ 是切线。若 $OP = 18$，则 $289 \\ne 324$，不是切线。",
      ),
      generate(rng) {
        const [p0, q0, h0] = rng.pick(triples);
        const k = rng.int(1, 3);
        const [r, tl] = rng.bool() ? [p0 * k, q0 * k] : [q0 * k, p0 * k];
        const yes = rng.bool();
        const h = yes ? h0 * k : h0 * k + rng.pick([-2, -1, 1, 2]);
        const u = pickUnit(rng);
        const sum = r * r + tl * tl;
        return choiceProblem({
          prompt: t(
            `Circle $O$ has radius $OA = ${tex(r, u)}$, where $A$ is on the circle. Point $P$ is outside the circle with $PA = ${tex(tl, u)}$ and $OP = ${tex(h, u)}$. Is $PA$ tangent to the circle?`,
            `圆 $O$ 的半径 $OA = ${tex(r, u)}$，$A$ 在圆上。点 $P$ 在圆外，$PA = ${tex(tl, u)}$，$OP = ${tex(h, u)}$。$PA$ 是圆的切线吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `$OA^2 + PA^2 = ${r * r} + ${tl * tl} = ${sum} = ${h}^2 = OP^2$, so $\\angle OAP = 90^\\circ$ and $PA$ is tangent.`,
                `$OA^2 + PA^2 = ${r * r} + ${tl * tl} = ${sum} = ${h}^2 = OP^2$，所以 $\\angle OAP = 90^\\circ$，$PA$ 是切线。`,
              )
            : t(
                `$OA^2 + PA^2 = ${r * r} + ${tl * tl} = ${sum}$, but $OP^2 = ${h * h}$. They differ, so $\\angle OAP \\ne 90^\\circ$ and $PA$ is not tangent.`,
                `$OA^2 + PA^2 = ${r * r} + ${tl * tl} = ${sum}$，而 $OP^2 = ${h * h}$。两者不等，所以 $\\angle OAP \\ne 90^\\circ$，$PA$ 不是切线。`,
              ),
        });
      },
    },
  ],
};

/** TwoTangents is circle O with tangents from P touching at A and B, with angle AOP = phi. */
interface TwoTangents {
  readonly s: number;
  readonly phi: number;
  readonly pa: Point;
  readonly pb: Point;
  readonly pp: Point;
}

const twoTangents = (s: number, phi: number): TwoTangents => ({
  s,
  phi,
  pa: on(s + phi),
  pb: on(s - phi),
  pp: on(s, R / Math.cos(rad(phi))),
});

/** twoTangentMarks draws circle O, the tangents PA and PB, the radii OA and OB, optionally OP, and the names. */
function twoTangentMarks(tt: TwoTangents, extra: readonly Mark[], radii = true, op = false): Mark[] {
  return [
    circleAt(),
    seg(tt.pp, tt.pa),
    seg(tt.pp, tt.pb),
    ...(radii ? [seg(O, tt.pa), seg(O, tt.pb)] : []),
    ...(op ? [seg(O, tt.pp)] : []),
    ...extra,
    ...center(dirOf(tt.s + 180)),
    ...pointsAt([
      [tt.s + tt.phi, "A"],
      [tt.s - tt.phi, "B"],
    ]),
    ...outside(tt.pp),
  ];
}

export const tangentTangentLinesToCircles: TopicDef = {
  id: "tangent-tangent-lines-to-circles",
  title: t("Tangent-Tangent Lines to Circles", "从圆外一点引的两条切线"),
  summary: t(
    "Two tangent segments from an external point are equal, and the angle between them is supplementary to the central angle.",
    "从圆外一点引的两条切线段相等，它们的夹角与圆心角互补。",
  ),
  prerequisites: ["tangent-lines-to-circles", "central-angles-and-arcs", "angles-of-polygons"],
  encompasses: [
    { topic: "tangent-lines-to-circles", weight: 0.5 },
    { topic: "central-angles-and-arcs", weight: 0.2 },
    { topic: "angles-of-polygons", weight: 0.1 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "tangent-segments-are-equal",
      title: t("Tangent segments are equal", "切线长相等"),
      explanation: t(
        "From a point $P$ outside a circle, two tangents can be drawn, touching the circle at $A$ and $B$. The **tangent segments** are equal:\n\n$$PA = PB.$$\n\n(Triangles $OAP$ and $OBP$ are right triangles with the same hypotenuse $OP$ and equal legs $OA = OB$, so they are congruent.) If $PA = 3x - 4$ and $PB = x + 10$, then $3x - 4 = x + 10$, so $2x = 14$, $x = 7$ and $PA = PB = 17$.",
        "从圆外一点 $P$ 可以作圆的两条切线，切点为 $A$ 和 $B$。两条**切线长**相等：\n\n$$PA = PB.$$\n\n（$\\triangle OAP$ 与 $\\triangle OBP$ 都是直角三角形，斜边 $OP$ 公共，直角边 $OA = OB$，所以它们全等。）若 $PA = 3x - 4$，$PB = x + 10$，则 $3x - 4 = x + 10$，$2x = 14$，$x = 7$，$PA = PB = 17$。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const L = rng.int(6, 40);
        const x = rng.int(2, 12);
        const [c1, d1] = expressionFor(rng, L, x);
        const [c2, d2] = expressionFor(rng, L, x, 5, [c1]);
        const tt = twoTangents(rng.int(0, 359), rng.int(45, 70));
        const u = pickUnit(rng);
        const askX = rng.bool(0.6);
        const solve = solveLinear(c1, d1, c2, d2);
        return {
          ...numberProblem({
            prompt: askX
              ? t(
                  `$PA$ and $PB$ are tangent to circle $O$, with $PA = ${linear(c1, d1)}$ and $PB = ${linear(c2, d2)}$ (in ${u}). Find $x$.`,
                  `$PA$、$PB$ 是圆 $O$ 的切线，$PA = ${linear(c1, d1)}$，$PB = ${linear(c2, d2)}$（单位：${u}）。求 $x$。`,
                )
              : t(
                  `$PA$ and $PB$ are tangent to circle $O$, with $PA = ${linear(c1, d1)}$ and $PB = ${linear(c2, d2)}$ (in ${u}). Find the length $PA$.`,
                  `$PA$、$PB$ 是圆 $O$ 的切线，$PA = ${linear(c1, d1)}$，$PB = ${linear(c2, d2)}$（单位：${u}）。求 $PA$ 的长。`,
                ),
            answer: askX ? x : L,
            ...(askX ? { solveFor: "x" } : { unit: u }),
            wrong: askX ? some([frac(d2 + d1, c1 - c2), frac(d1 - d2, c1 - c2), frac(-d1 - d2, c1 + c2)]) : [x, 2 * L, c1 * x],
            solution: askX
              ? t(`Tangent segments from $P$ are equal, $PA = PB$:${solve}`, `从 $P$ 引的切线长相等，$PA = PB$：${solve}`)
              : t(
                  `Tangent segments from $P$ are equal, $PA = PB$:${solve}Then $PA = ${linear(c1, d1).replace("x", `\\cdot ${x}`)} = ${tex(L, u)}$.`,
                  `从 $P$ 引的切线长相等，$PA = PB$：${solve}于是 $PA = ${linear(c1, d1).replace("x", `\\cdot ${x}`)} = ${tex(L, u)}$。`,
                ),
          }),
          figure: figure(
            twoTangentMarks(tt, [sideOut(tt.pa, tt.pp, O, plain(c1, d1)), sideOut(tt.pp, tt.pb, O, plain(c2, d2))], false),
            `Circle O with tangents from P touching it at A and B; PA is ${plain(c1, d1)} and PB is ${plain(c2, d2)}.`,
            `圆 O，从 P 引两条切线，切点为 A、B；PA 为 ${plain(c1, d1)}，PB 为 ${plain(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "the-angle-between-two-tangents",
      title: t("The angle between two tangents", "两条切线的夹角"),
      explanation: t(
        `In quadrilateral $OAPB$ the angles at $A$ and $B$ are right angles, and the four angles add to $360^\\circ$. So the angle between the tangents and the central angle are **supplementary**:\n\n$$\\angle APB + \\angle AOB = 180^\\circ.$$\n\nIf $\\angle AOB = 130^\\circ$, then $\\angle APB = 50^\\circ$. The central angle is the minor arc $${arcTex("AB")}$, so the angle can also come from an arc: if the major arc measures $250^\\circ$, the minor arc is $110^\\circ$ and $\\angle APB = 70^\\circ$.`,
        `在四边形 $OAPB$ 中，$A$、$B$ 处是直角，四个角之和是 $360^\\circ$。所以两切线的夹角与圆心角**互补**：\n\n$$\\angle APB + \\angle AOB = 180^\\circ.$$\n\n若 $\\angle AOB = 130^\\circ$，则 $\\angle APB = 50^\\circ$。圆心角等于劣弧 $${arcTex("AB")}$ 的度数，所以也可以由弧求这个角：若优弧是 $250^\\circ$，则劣弧是 $110^\\circ$，$\\angle APB = 70^\\circ$。`,
      ),
      generate(rng) {
        const phi = rng.int(25, 70);
        const c = 2 * phi;
        const p = 180 - c;
        const tt = twoTangents(rng.int(0, 359), phi);
        const kind = rng.int(0, 2);
        const angleP = (label: string) => angleAt(tt.pp, tt.pa, tt.pb, label);
        const angleO = (label: string) => angleAt(O, tt.pa, tt.pb, label);
        const desc = t(
          "Circle O with tangents from P touching it at A and B, and radii OA and OB.",
          "圆 O，从 P 引两条切线，切点为 A、B，画有半径 OA、OB。",
        );
        if (kind === 0) {
          return {
            ...numberProblem({
              prompt: t("$PA$ and $PB$ are tangent to circle $O$. Find $\\angle APB$.", "$PA$、$PB$ 是圆 $O$ 的切线。求 $\\angle APB$。"),
              answer: p,
              unit: "°",
              wrong: [c, 360 - c, phi],
              solution: t(
                `$\\angle OAP = \\angle OBP = 90^\\circ$, and the angles of $OAPB$ add to $360^\\circ$:${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}`,
                `$\\angle OAP = \\angle OBP = 90^\\circ$，且四边形 $OAPB$ 的内角和是 $360^\\circ$：${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}`,
              ),
            }),
            figure: figure(twoTangentMarks(tt, [angleO(deg(c)), angleP("?")]), desc.en, desc["zh-CN"]),
          };
        }
        if (kind === 1) {
          return {
            ...numberProblem({
              prompt: t(
                "$PA$ and $PB$ are tangent to circle $O$. Find the central angle $\\angle AOB$.",
                "$PA$、$PB$ 是圆 $O$ 的切线。求圆心角 $\\angle AOB$。",
              ),
              answer: c,
              unit: "°",
              wrong: [p, 360 - p, q(p, 2)],
              solution: t(
                `The angle between the tangents and the central angle are supplementary:${steps(`\\angle AOB = 180^\\circ - ${p}^\\circ = ${c}^\\circ`)}`,
                `两切线的夹角与圆心角互补：${steps(`\\angle AOB = 180^\\circ - ${p}^\\circ = ${c}^\\circ`)}`,
              ),
            }),
            figure: figure(twoTangentMarks(tt, [angleP(deg(p)), angleO("?")]), desc.en, desc["zh-CN"]),
          };
        }
        const M = 360 - c;
        return {
          ...numberProblem({
            prompt: t(
              `$PA$ and $PB$ are tangent to circle $O$, and the major arc $${arcTex("AB")}$ measures $${M}^\\circ$. Find $\\angle APB$.`,
              `$PA$、$PB$ 是圆 $O$ 的切线，优弧 $${arcTex("AB")}$ 的度数是 $${M}^\\circ$。求 $\\angle APB$。`,
            ),
            answer: p,
            unit: "°",
            wrong: [q(M, 2), 360 - M, 180 - q(M, 2).toNumber()],
            solution: t(
              `The minor arc is $360^\\circ - ${M}^\\circ = ${c}^\\circ$, the central angle $\\angle AOB$. It is supplementary to the angle between the tangents:${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}`,
              `劣弧是 $360^\\circ - ${M}^\\circ = ${c}^\\circ$，即圆心角 $\\angle AOB$。它与两切线的夹角互补：${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}`,
            ),
          }),
          figure: figure(
            twoTangentMarks(
              tt,
              [...arcAt(tt.s + phi, tt.s - phi + 360), arcText(tt.s + phi, tt.s - phi + 360, deg(M)), angleP("?")],
              false,
            ),
            `Circle O with tangents from P touching it at A and B; the major arc AB is ${M}°.`,
            `圆 O，从 P 引两条切线，切点为 A、B；优弧 AB 为 ${M}°。`,
          ),
        };
      },
    },
    {
      id: "the-line-to-the-center",
      title: t("The line to the center", "连接圆心的线段"),
      explanation: t(
        "The congruent right triangles $OAP$ and $OBP$ show that $OP$ **bisects** both $\\angle APB$ and $\\angle AOB$:\n\n$$\\angle APO = \\angle BPO = \\tfrac{1}{2}\\angle APB, \\qquad \\angle AOP = 90^\\circ - \\angle APO.$$\n\nIf $\\angle APB = 64^\\circ$, then $\\angle APO = 32^\\circ$ and $\\angle AOP = 58^\\circ$.",
        "全等的直角三角形 $OAP$ 与 $OBP$ 说明 $OP$ 同时**平分** $\\angle APB$ 和 $\\angle AOB$：\n\n$$\\angle APO = \\angle BPO = \\tfrac{1}{2}\\angle APB, \\qquad \\angle AOP = 90^\\circ - \\angle APO.$$\n\n若 $\\angle APB = 64^\\circ$，则 $\\angle APO = 32^\\circ$，$\\angle AOP = 58^\\circ$。",
      ),
      generate(rng) {
        const phi = rng.int(25, 70);
        const p = 180 - 2 * phi;
        const tt = twoTangents(rng.int(0, 359), phi);
        const kind = rng.int(0, 2);
        const desc = t(
          "Circle O with tangents from P touching it at A and B, radii OA and OB, and the segment OP.",
          "圆 O，从 P 引两条切线，切点为 A、B，画有半径 OA、OB 和线段 OP。",
        );
        const prompt = (name: string) =>
          t(`$PA$ and $PB$ are tangent to circle $O$. Find $\\angle ${name}$.`, `$PA$、$PB$ 是圆 $O$ 的切线。求 $\\angle ${name}$。`);
        if (kind === 0) {
          return {
            ...numberProblem({
              prompt: prompt("APO"),
              answer: p / 2,
              unit: "°",
              wrong: [p, phi, 180 - p],
              solution: t(
                `$OP$ bisects $\\angle APB$:${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}`,
                `$OP$ 平分 $\\angle APB$：${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}`,
              ),
            }),
            figure: figure(
              twoTangentMarks(tt, [angleAt(tt.pp, tt.pa, tt.pb, deg(p)), angleAt(tt.pp, tt.pa, O, "?")], true, true),
              desc.en,
              desc["zh-CN"],
            ),
          };
        }
        if (kind === 1) {
          return {
            ...numberProblem({
              prompt: prompt("AOP"),
              answer: phi,
              unit: "°",
              wrong: [p / 2, 180 - p, 90 - p],
              solution: t(
                `$OP$ bisects $\\angle APB$, so $\\angle APO = ${p / 2}^\\circ$, and $\\angle OAP = 90^\\circ$:${steps(`\\angle AOP = 90^\\circ - ${p / 2}^\\circ = ${phi}^\\circ`)}`,
                `$OP$ 平分 $\\angle APB$，所以 $\\angle APO = ${p / 2}^\\circ$，且 $\\angle OAP = 90^\\circ$：${steps(`\\angle AOP = 90^\\circ - ${p / 2}^\\circ = ${phi}^\\circ`)}`,
              ),
            }),
            figure: figure(
              twoTangentMarks(tt, [angleAt(tt.pp, tt.pa, tt.pb, deg(p)), angleAt(O, tt.pa, tt.pp, "?")], true, true),
              desc.en,
              desc["zh-CN"],
            ),
          };
        }
        return {
          ...numberProblem({
            prompt: prompt("OPB"),
            answer: 90 - phi,
            unit: "°",
            wrong: [phi, 180 - 2 * phi, 2 * phi],
            solution: t(
              `Triangles $OAP$ and $OBP$ are congruent, so $\\angle BOP = \\angle AOP = ${phi}^\\circ$, and $\\angle OBP = 90^\\circ$:${steps(`\\angle OPB = 90^\\circ - ${phi}^\\circ = ${90 - phi}^\\circ`)}`,
              `$\\triangle OAP \\cong \\triangle OBP$，所以 $\\angle BOP = \\angle AOP = ${phi}^\\circ$，且 $\\angle OBP = 90^\\circ$：${steps(`\\angle OPB = 90^\\circ - ${phi}^\\circ = ${90 - phi}^\\circ`)}`,
            ),
          }),
          figure: figure(
            twoTangentMarks(tt, [angleAt(O, tt.pa, tt.pp, deg(phi)), angleAt(tt.pp, O, tt.pb, "?")], true, true),
            desc.en,
            desc["zh-CN"],
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Secants
// ---------------------------------------------------------------------------

/** Chords is circle with A, B, C, D in order and arcs AB = p, BC = u, CD = w, with chords AC and BD meeting at E. */
interface Chords {
  readonly at: readonly [number, number, number, number];
  readonly pts: readonly [Point, Point, Point, Point];
  readonly e: Point;
  readonly p: number;
  readonly w: number;
}

function chords(rng: Rng, p: number, w: number): Chords {
  const rest = 360 - p - w;
  const u = rng.int(40, rest - 40);
  const s = rng.int(0, 359);
  const at = [s, s + p, s + p + u, s + p + u + w] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2]), on(at[3])] as const;
  return { at, pts, e: meet(pts[0], pts[2], pts[1], pts[3]), p, w };
}

/** chordMarks draws the intersecting chords AC and BD, arcs AB and CD with labels, and the extra marks. */
function chordMarks(ch: Chords, labelAB: string, labelCD: string, extra: readonly Mark[]): Mark[] {
  const [a, b, c, d] = ch.at;
  const [pa, pb, pc, pd] = ch.pts;
  return [
    circleAt(),
    seg(pa, pc),
    seg(pb, pd),
    ...arcAt(a, b),
    ...arcAt(c, d),
    arcText(a, b, labelAB),
    arcText(c, d, labelCD),
    { kind: "dot", at: ch.e },
    { kind: "label", at: ch.e, text: "E", dir: dirOf(midOf(b, c)), italic: true },
    ...extra,
    ...pointsAt([
      [a, "A"],
      [b, "B"],
      [c, "C"],
      [d, "D"],
    ]),
  ];
}

/** Secants is a circle with C, A, B, D in counterclockwise order, near arc CA = n, far arc BD = f, and secants PAB and PCD. */
interface Secants {
  readonly at: readonly [number, number, number, number];
  readonly pts: readonly [Point, Point, Point, Point];
  readonly pp: Point;
}

function secants(rng: Rng, n: number, f: number): Secants {
  const rest = 360 - n - f;
  const x = rng.int(40, rest - 40);
  const s = rng.int(0, 359);
  const at = [s, s + n, s + n + x, s + n + x + f] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2]), on(at[3])] as const;
  return { at, pts, pp: meet(pts[1], pts[2], pts[0], pts[3]) };
}

/** secantMarks draws the secants from P, the near arc CA and far arc BD with labels, and the angle at P. */
function secantMarks(sc: Secants, near: string, far: string, angle: string): Mark[] {
  const [c, a, b, d] = sc.at;
  const [pc, pa, pb, pd] = sc.pts;
  return [
    circleAt(),
    seg(sc.pp, pb),
    seg(sc.pp, pd),
    ...arcAt(c, a),
    ...arcAt(b, d),
    arcTextIn(c, a, near),
    arcText(b, d, far),
    angleAt(sc.pp, pa, pc, angle),
    ...pointsAt([
      [c, "C"],
      [a, "A"],
      [b, "B"],
      [d, "D"],
    ]),
    ...outside(sc.pp),
  ];
}

export const secantSecantAnglesToCircles: TopicDef = {
  id: "secant-secant-angles-to-circles",
  title: t("Secant-Secant Angles to Circles", "两条割线所成的角"),
  summary: t(
    "The angle between two chords is half the sum of the intercepted arcs; the angle between two secants from outside is half their difference.",
    "两弦相交所成的角等于所夹两弧和的一半；从圆外引的两条割线所成的角等于所夹两弧差的一半。",
  ),
  prerequisites: ["problem-solving-with-inscribed-angles", "the-exterior-angle-theorem"],
  encompasses: [
    { topic: "problem-solving-with-inscribed-angles", weight: 0.3 },
    { topic: "the-exterior-angle-theorem", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "chords-intersecting-inside",
      title: t("Chords intersecting inside the circle", "圆内相交的两弦"),
      explanation: t(
        `A **secant** is a line that meets a circle at two points. When chords $AC$ and $BD$ meet at $E$ inside the circle, the angle between them is half the **sum** of the arc it intercepts and the arc intercepted by its vertical angle:\n\n$$\\angle AEB = \\frac{m${arcTex("AB")} + m${arcTex("CD")}}{2}.$$\n\n(Draw $BC$: $\\angle AEB$ is an exterior angle of $\\triangle BEC$, so it is the sum of two inscribed angles.) If $m${arcTex("AB")} = 70^\\circ$ and $m${arcTex("CD")} = 110^\\circ$, then $\\angle AEB = 90^\\circ$. The adjacent angle $\\angle AED$ is $180^\\circ - \\angle AEB$.`,
        `与圆有两个交点的直线叫圆的**割线**。弦 $AC$ 与 $BD$ 在圆内交于 $E$ 时，它们所成的角等于这个角所对的弧与其对顶角所对的弧之**和**的一半：\n\n$$\\angle AEB = \\frac{m${arcTex("AB")} + m${arcTex("CD")}}{2}.$$\n\n（连接 $BC$：$\\angle AEB$ 是 $\\triangle BEC$ 的外角，等于两个圆周角之和。）若 $m${arcTex("AB")} = 70^\\circ$，$m${arcTex("CD")} = 110^\\circ$，则 $\\angle AEB = 90^\\circ$。相邻的角 $\\angle AED$ 等于 $180^\\circ - \\angle AEB$。`,
      ),
      generate(rng) {
        const p = 2 * rng.int(20, 70);
        const w = 2 * rng.int(20, 70);
        const ch = chords(rng, p, w);
        const theta = (p + w) / 2;
        const adjacent = rng.bool(0.3);
        const [pa, pb, , pd] = ch.pts;
        const name = adjacent ? "AED" : "AEB";
        const answer = adjacent ? 180 - theta : theta;
        const work = adjacent
          ? [
              `\\angle AEB = \\frac{${p}^\\circ + ${w}^\\circ}{2} = ${theta}^\\circ`,
              `\\angle AED = 180^\\circ - ${theta}^\\circ = ${180 - theta}^\\circ`,
            ]
          : [`\\angle AEB = \\frac{${p}^\\circ + ${w}^\\circ}{2} = ${theta}^\\circ`];
        return {
          ...numberProblem({
            prompt: t(`Chords $AC$ and $BD$ meet at $E$. Find $\\angle ${name}$.`, `弦 $AC$ 与 $BD$ 交于 $E$。求 $\\angle ${name}$。`),
            answer,
            unit: "°",
            wrong: adjacent ? [theta, p + w, Math.abs(p - w) / 2] : [p + w, Math.abs(p - w) / 2, 180 - theta],
            solution: t(
              `$\\angle AEB$ intercepts arc $${arcTex("AB")}$ and its vertical angle intercepts arc $${arcTex("CD")}$, so it is half their sum:${steps(...work)}`,
              `$\\angle AEB$ 对着弧 $${arcTex("AB")}$，它的对顶角对着弧 $${arcTex("CD")}$，所以它等于两弧和的一半：${steps(...work)}`,
            ),
          }),
          figure: figure(
            chordMarks(ch, deg(p), deg(w), [angleAt(ch.e, pa, adjacent ? pd : pb, "?")]),
            `Chords AC and BD of a circle meet at E; arc AB is ${p}° and arc CD is ${w}°.`,
            `圆的弦 AC 与 BD 交于 E；弧 AB 为 ${p}°，弧 CD 为 ${w}°。`,
          ),
        };
      },
    },
    {
      id: "secants-intersecting-outside",
      title: t("Secants intersecting outside the circle", "圆外相交的两条割线"),
      explanation: t(
        `When two secants from a point $P$ outside the circle meet it at $A$, $B$ and at $C$, $D$, the angle at $P$ is half the **difference** of the far arc and the near arc it intercepts:\n\n$$\\angle P = \\frac{m${arcTex("BD")} - m${arcTex("AC")}}{2}.$$\n\n(Draw $AD$: the inscribed angle $\\angle BAD$ is an exterior angle of $\\triangle PAD$, so $\\angle P = \\angle BAD - \\angle ADC$.) If the far arc is $130^\\circ$ and the near arc $40^\\circ$, then $\\angle P = \\frac{90^\\circ}{2} = 45^\\circ$.`,
        `从圆外一点 $P$ 引的两条割线分别交圆于 $A$、$B$ 和 $C$、$D$ 时，$P$ 处的角等于它所夹的远弧与近弧之**差**的一半：\n\n$$\\angle P = \\frac{m${arcTex("BD")} - m${arcTex("AC")}}{2}.$$\n\n（连接 $AD$：圆周角 $\\angle BAD$ 是 $\\triangle PAD$ 的外角，所以 $\\angle P = \\angle BAD - \\angle ADC$。）若远弧是 $130^\\circ$，近弧是 $40^\\circ$，则 $\\angle P = \\frac{90^\\circ}{2} = 45^\\circ$。`,
      ),
      generate(rng) {
        const theta = rng.int(30, 70);
        const n = rng.int(30, Math.min(90, 140 - theta));
        const f = n + 2 * theta;
        const sc = secants(rng, n, f);
        return {
          ...numberProblem({
            prompt: t(
              "Secants $PAB$ and $PCD$ meet the circle as shown. Find $\\angle P$.",
              "割线 $PAB$ 与 $PCD$ 与圆相交，如图所示。求 $\\angle P$。",
            ),
            answer: theta,
            unit: "°",
            wrong: [q(f + n, 2), f - n, q(f, 2)],
            solution: t(
              `$\\angle P$ is half the difference of the far arc $${arcTex("BD")}$ and the near arc $${arcTex("AC")}$:${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = ${theta}^\\circ`)}`,
              `$\\angle P$ 等于远弧 $${arcTex("BD")}$ 与近弧 $${arcTex("AC")}$ 之差的一半：${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = ${theta}^\\circ`)}`,
            ),
          }),
          figure: figure(
            secantMarks(sc, deg(n), deg(f), "?"),
            `Two secants from P outside a circle: P, A, B and P, C, D; arc AC is ${n}° and arc BD is ${f}°.`,
            `从圆外一点 P 引的两条割线 PAB 与 PCD；弧 AC 为 ${n}°，弧 BD 为 ${f}°。`,
          ),
        };
      },
    },
    {
      id: "finding-arcs-from-secant-angles",
      title: t("Finding arcs from the angle", "由角求弧"),
      explanation: t(
        `The two formulas can be solved for an unknown arc.\n\n- Inside: if $\\angle AEB = 75^\\circ$ and $m${arcTex("AB")} = 60^\\circ$, then $\\frac{60 + m${arcTex("CD")}}{2} = 75$, so $60 + m${arcTex("CD")} = 150$ and $m${arcTex("CD")} = 90^\\circ$.\n- Outside: if $\\angle P = 35^\\circ$ and the near arc is $50^\\circ$, then the far arc minus $50^\\circ$ is $70^\\circ$, so the far arc is $120^\\circ$.`,
        `两个公式都可以用来求未知的弧。\n\n- 圆内：若 $\\angle AEB = 75^\\circ$，$m${arcTex("AB")} = 60^\\circ$，则 $\\frac{60 + m${arcTex("CD")}}{2} = 75$，所以 $60 + m${arcTex("CD")} = 150$，$m${arcTex("CD")} = 90^\\circ$。\n- 圆外：若 $\\angle P = 35^\\circ$，近弧是 $50^\\circ$，则远弧减去 $50^\\circ$ 等于 $70^\\circ$，所以远弧是 $120^\\circ$。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const p = 2 * rng.int(20, 70);
          const w = 2 * rng.int(20, 70);
          const theta = (p + w) / 2;
          const ch = chords(rng, p, w);
          return {
            ...numberProblem({
              prompt: t(
                `Chords $AC$ and $BD$ meet at $E$. Find the measure of arc $${arcTex("CD")}$.`,
                `弦 $AC$ 与 $BD$ 交于 $E$。求弧 $${arcTex("CD")}$ 的度数。`,
              ),
              answer: w,
              unit: "°",
              wrong: [theta - p, 2 * theta + p, 180 - p],
              solution: t(
                `$\\angle AEB$ is half the sum of arcs $${arcTex("AB")}$ and $${arcTex("CD")}$:${steps(`\\frac{${p}^\\circ + m${arcTex("CD")}}{2} = ${theta}^\\circ`, `${p}^\\circ + m${arcTex("CD")} = ${2 * theta}^\\circ`, `m${arcTex("CD")} = ${w}^\\circ`)}`,
                `$\\angle AEB$ 等于弧 $${arcTex("AB")}$ 与弧 $${arcTex("CD")}$ 之和的一半：${steps(`\\frac{${p}^\\circ + m${arcTex("CD")}}{2} = ${theta}^\\circ`, `${p}^\\circ + m${arcTex("CD")} = ${2 * theta}^\\circ`, `m${arcTex("CD")} = ${w}^\\circ`)}`,
              ),
            }),
            figure: figure(
              chordMarks(ch, deg(p), "?", [angleAt(ch.e, ch.pts[0], ch.pts[1], deg(theta))]),
              `Chords AC and BD of a circle meet at E; angle AEB is ${theta}° and arc AB is ${p}°.`,
              `圆的弦 AC 与 BD 交于 E；角 AEB 为 ${theta}°，弧 AB 为 ${p}°。`,
            ),
          };
        }
        const theta = rng.int(30, 70);
        const n = rng.int(30, Math.min(90, 140 - theta));
        const f = n + 2 * theta;
        const sc = secants(rng, n, f);
        const askFar = rng.bool();
        return {
          ...numberProblem({
            prompt: askFar
              ? t(
                  `Secants $PAB$ and $PCD$ meet the circle as shown. Find the measure of the far arc $${arcTex("BD")}$.`,
                  `割线 $PAB$ 与 $PCD$ 与圆相交，如图所示。求远弧 $${arcTex("BD")}$ 的度数。`,
                )
              : t(
                  `Secants $PAB$ and $PCD$ meet the circle as shown. Find the measure of the near arc $${arcTex("AC")}$.`,
                  `割线 $PAB$ 与 $PCD$ 与圆相交，如图所示。求近弧 $${arcTex("AC")}$ 的度数。`,
                ),
            answer: askFar ? f : n,
            unit: "°",
            wrong: askFar ? [n + theta, 2 * theta - n, 2 * theta] : [f - theta, f + 2 * theta, 2 * theta],
            solution: askFar
              ? t(
                  `$\\angle P$ is half the difference of the arcs:${steps(`\\frac{m${arcTex("BD")} - ${n}^\\circ}{2} = ${theta}^\\circ`, `m${arcTex("BD")} - ${n}^\\circ = ${2 * theta}^\\circ`, `m${arcTex("BD")} = ${f}^\\circ`)}`,
                  `$\\angle P$ 等于两弧之差的一半：${steps(`\\frac{m${arcTex("BD")} - ${n}^\\circ}{2} = ${theta}^\\circ`, `m${arcTex("BD")} - ${n}^\\circ = ${2 * theta}^\\circ`, `m${arcTex("BD")} = ${f}^\\circ`)}`,
                )
              : t(
                  `$\\angle P$ is half the difference of the arcs:${steps(`\\frac{${f}^\\circ - m${arcTex("AC")}}{2} = ${theta}^\\circ`, `${f}^\\circ - m${arcTex("AC")} = ${2 * theta}^\\circ`, `m${arcTex("AC")} = ${n}^\\circ`)}`,
                  `$\\angle P$ 等于两弧之差的一半：${steps(`\\frac{${f}^\\circ - m${arcTex("AC")}}{2} = ${theta}^\\circ`, `${f}^\\circ - m${arcTex("AC")} = ${2 * theta}^\\circ`, `m${arcTex("AC")} = ${n}^\\circ`)}`,
                ),
          }),
          figure: figure(
            askFar ? secantMarks(sc, deg(n), "?", deg(theta)) : secantMarks(sc, "?", deg(f), deg(theta)),
            askFar
              ? `Two secants from P outside a circle: P, A, B and P, C, D; angle P is ${theta}° and arc AC is ${n}°.`
              : `Two secants from P outside a circle: P, A, B and P, C, D; angle P is ${theta}° and arc BD is ${f}°.`,
            askFar
              ? `从圆外一点 P 引的两条割线 PAB 与 PCD；角 P 为 ${theta}°，弧 AC 为 ${n}°。`
              : `从圆外一点 P 引的两条割线 PAB 与 PCD；角 P 为 ${theta}°，弧 BD 为 ${f}°。`,
          ),
        };
      },
    },
  ],
};

/** SecantTangent is a circle with T, A, B in counterclockwise order, near arc TA = n, far arc BT = f, the tangent at T and the secant PAB. */
interface SecantTangent {
  readonly at: readonly [number, number, number];
  readonly pts: readonly [Point, Point, Point];
  readonly pp: Point;
}

function secantTangent(rng: Rng, n: number, f: number): SecantTangent {
  const s = rng.int(0, 359);
  const at = [s, s + n, s - f + 360] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2])] as const;
  return { at, pts, pp: meet(pts[0], along(pts[0], tangentDir(s), 1), pts[1], pts[2]) };
}

/** secantTangentMarks draws the tangent PT, the secant PAB, the near arc TA and far arc BT with labels, and the angle at P. */
function secantTangentMarks(st: SecantTangent, near: string, far: string, angle: string): Mark[] {
  const [tAt, a, b] = st.at;
  const [pt, pa, pb] = st.pts;
  const beyond = along(pt, [pt[0] - st.pp[0], pt[1] - st.pp[1]], 0.35);
  return [
    circleAt(),
    seg(st.pp, beyond),
    seg(st.pp, pb),
    ...arcAt(tAt, a),
    ...arcAt(b, tAt + 360),
    arcTextIn(tAt, a, near),
    arcText(b, tAt + 360, far),
    angleAt(st.pp, pt, pa, angle),
    ...pointsAt([
      [tAt, "T"],
      [a, "A"],
      [b, "B"],
    ]),
    ...outside(st.pp),
  ];
}

export const secantTangentAnglesToCircles: TopicDef = {
  id: "secant-tangent-angles-to-circles",
  title: t("Secant-Tangent Angles to Circles", "割线与切线所成的角"),
  summary: t(
    "The angle between a secant and a tangent, or two tangents, from an outside point is half the difference of the intercepted arcs.",
    "从圆外一点引的割线与切线（或两条切线）所成的角，等于所夹两弧差的一半。",
  ),
  prerequisites: ["secant-secant-angles-to-circles", "tangent-tangent-lines-to-circles"],
  encompasses: [
    { topic: "secant-secant-angles-to-circles", weight: 0.5 },
    { topic: "tangent-tangent-lines-to-circles", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "secant-and-tangent",
      title: t("A secant and a tangent", "一条割线与一条切线"),
      explanation: t(
        `When a tangent at $T$ and a secant through $A$ and $B$ meet at a point $P$ outside the circle, the rule for two secants still holds: the angle is half the difference of the far arc and the near arc,\n\n$$\\angle P = \\frac{m${arcTex("BT")} - m${arcTex("TA")}}{2}.$$\n\nIf the far arc $${arcTex("BT")}$ is $150^\\circ$ and the near arc $${arcTex("TA")}$ is $60^\\circ$, then $\\angle P = \\frac{90^\\circ}{2} = 45^\\circ$.`,
        `当过 $T$ 的切线与过 $A$、$B$ 的割线交于圆外一点 $P$ 时，两条割线的规律仍然成立：这个角等于远弧与近弧之差的一半，\n\n$$\\angle P = \\frac{m${arcTex("BT")} - m${arcTex("TA")}}{2}.$$\n\n若远弧 $${arcTex("BT")}$ 是 $150^\\circ$，近弧 $${arcTex("TA")}$ 是 $60^\\circ$，则 $\\angle P = \\frac{90^\\circ}{2} = 45^\\circ$。`,
      ),
      generate(rng) {
        const theta = rng.int(25, 65);
        const n = rng.int(30, Math.min(100, 160 - theta));
        const f = n + 2 * theta;
        const st = secantTangent(rng, n, f);
        return {
          ...numberProblem({
            prompt: t(
              "$PT$ is tangent to the circle at $T$, and the secant $PAB$ meets the circle at $A$ and $B$. Find $\\angle P$.",
              "$PT$ 与圆相切于 $T$，割线 $PAB$ 交圆于 $A$、$B$。求 $\\angle P$。",
            ),
            answer: theta,
            unit: "°",
            wrong: [q(f + n, 2), f - n, q(f, 2)],
            solution: t(
              `$\\angle P$ is half the difference of the far arc $${arcTex("BT")}$ and the near arc $${arcTex("TA")}$:${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = ${theta}^\\circ`)}`,
              `$\\angle P$ 等于远弧 $${arcTex("BT")}$ 与近弧 $${arcTex("TA")}$ 之差的一半：${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = ${theta}^\\circ`)}`,
            ),
          }),
          figure: figure(
            secantTangentMarks(st, deg(n), deg(f), "?"),
            `A tangent at T and a secant through A and B meet at P outside the circle; arc TA is ${n}° and arc BT is ${f}°.`,
            `过 T 的切线与过 A、B 的割线交于圆外一点 P；弧 TA 为 ${n}°，弧 BT 为 ${f}°。`,
          ),
        };
      },
    },
    {
      id: "finding-arcs-from-secant-tangent-angles",
      title: t("Finding arcs from the angle", "由角求弧"),
      explanation: t(
        `Solve the formula for the unknown arc. If $\\angle P = 30^\\circ$ and the far arc is $140^\\circ$, then\n\n$$\\frac{140^\\circ - m${arcTex("TA")}}{2} = 30^\\circ,$$\n\nso $140^\\circ - m${arcTex("TA")} = 60^\\circ$ and the near arc is $80^\\circ$. In general the far arc is the near arc plus $2\\angle P$.`,
        `由公式解出未知的弧。若 $\\angle P = 30^\\circ$，远弧是 $140^\\circ$，则\n\n$$\\frac{140^\\circ - m${arcTex("TA")}}{2} = 30^\\circ,$$\n\n所以 $140^\\circ - m${arcTex("TA")} = 60^\\circ$，近弧是 $80^\\circ$。一般地，远弧等于近弧加上 $2\\angle P$。`,
      ),
      generate(rng) {
        const theta = rng.int(25, 65);
        const n = rng.int(30, Math.min(100, 160 - theta));
        const f = n + 2 * theta;
        const st = secantTangent(rng, n, f);
        const askFar = rng.bool();
        const prompt = t(
          `$PT$ is tangent to the circle at $T$, and the secant $PAB$ meets the circle at $A$ and $B$. Find the measure of arc $${arcTex(askFar ? "BT" : "TA")}$.`,
          `$PT$ 与圆相切于 $T$，割线 $PAB$ 交圆于 $A$、$B$。求弧 $${arcTex(askFar ? "BT" : "TA")}$ 的度数。`,
        );
        const work = askFar
          ? steps(
              `\\frac{m${arcTex("BT")} - ${n}^\\circ}{2} = ${theta}^\\circ`,
              `m${arcTex("BT")} = ${n}^\\circ + ${2 * theta}^\\circ = ${f}^\\circ`,
            )
          : steps(
              `\\frac{${f}^\\circ - m${arcTex("TA")}}{2} = ${theta}^\\circ`,
              `m${arcTex("TA")} = ${f}^\\circ - ${2 * theta}^\\circ = ${n}^\\circ`,
            );
        return {
          ...numberProblem({
            prompt,
            answer: askFar ? f : n,
            unit: "°",
            wrong: askFar ? [n + theta, 2 * theta - n, 2 * theta] : [f - theta, f + 2 * theta, 2 * theta],
            solution: t(`$\\angle P$ is half the difference of the arcs:${work}`, `$\\angle P$ 等于两弧之差的一半：${work}`),
          }),
          figure: figure(
            askFar ? secantTangentMarks(st, deg(n), "?", deg(theta)) : secantTangentMarks(st, "?", deg(f), deg(theta)),
            `A tangent at T and a secant through A and B meet at P outside the circle; angle P is ${theta}°.`,
            `过 T 的切线与过 A、B 的割线交于圆外一点 P；角 P 为 ${theta}°。`,
          ),
        };
      },
    },
    {
      id: "two-tangents-and-their-arcs",
      title: t("Two tangents and their arcs", "两条切线与所夹的弧"),
      explanation: t(
        `For two tangents from $P$ touching at $A$ and $B$, the same rule uses the major and minor arcs between $A$ and $B$:\n\n$$\\angle APB = \\frac{m(\\text{major arc}) - m(\\text{minor arc})}{2}.$$\n\nIf the minor arc is $100^\\circ$, the major arc is $260^\\circ$ and $\\angle APB = \\frac{160^\\circ}{2} = 80^\\circ$, which agrees with $180^\\circ - 100^\\circ$. Going back, if $\\angle APB = 50^\\circ$, the minor arc is $180^\\circ - 50^\\circ = 130^\\circ$ and the major arc $230^\\circ$.`,
        `对从 $P$ 引的两条切线（切点为 $A$、$B$），同样的规律用 $A$、$B$ 之间的优弧和劣弧：\n\n$$\\angle APB = \\frac{m(\\text{优弧}) - m(\\text{劣弧})}{2}.$$\n\n若劣弧是 $100^\\circ$，则优弧是 $260^\\circ$，$\\angle APB = \\frac{160^\\circ}{2} = 80^\\circ$，与 $180^\\circ - 100^\\circ$ 一致。反过来，若 $\\angle APB = 50^\\circ$，则劣弧是 $180^\\circ - 50^\\circ = 130^\\circ$，优弧是 $230^\\circ$。`,
      ),
      generate(rng) {
        const phi = rng.int(25, 70);
        const m = 2 * phi;
        const M = 360 - m;
        const p = 180 - m;
        const tt = twoTangents(rng.int(0, 359), phi);
        const [a, b] = [tt.s + phi, tt.s - phi + 360];
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                "$PA$ and $PB$ are tangent to the circle at $A$ and $B$. Find $\\angle APB$.",
                "$PA$、$PB$ 与圆分别相切于 $A$、$B$。求 $\\angle APB$。",
              ),
              answer: p,
              unit: "°",
              wrong: [q(M, 2), M - m, m],
              solution: t(
                `The major arc is $360^\\circ - ${m}^\\circ = ${M}^\\circ$:${steps(`\\angle APB = \\frac{${M}^\\circ - ${m}^\\circ}{2} = ${p}^\\circ`)}`,
                `优弧是 $360^\\circ - ${m}^\\circ = ${M}^\\circ$：${steps(`\\angle APB = \\frac{${M}^\\circ - ${m}^\\circ}{2} = ${p}^\\circ`)}`,
              ),
            }),
            figure: figure(
              [
                circleAt(),
                seg(tt.pp, tt.pa),
                seg(tt.pp, tt.pb),
                ...arcAt(b, a + 360),
                arcTextIn(b, a + 360, deg(m)),
                angleAt(tt.pp, tt.pa, tt.pb, "?"),
                ...pointsAt([
                  [a, "A"],
                  [b, "B"],
                ]),
                ...outside(tt.pp),
              ],
              `Two tangents from P touch a circle at A and B; the minor arc AB is ${m}°.`,
              `从 P 引的两条切线与圆相切于 A、B；劣弧 AB 为 ${m}°。`,
            ),
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              "$PA$ and $PB$ are tangent to the circle at $A$ and $B$. Find the measure of the major arc $AB$.",
              "$PA$、$PB$ 与圆分别相切于 $A$、$B$。求优弧 $AB$ 的度数。",
            ),
            answer: M,
            unit: "°",
            wrong: [m, 360 - p, 180 + 2 * p],
            solution: t(
              `With minor arc $x^\\circ$, the major arc is $(360 - x)^\\circ$:${steps(`\\frac{(360 - x) - x}{2} = ${p}`, `180 - x = ${p}`, `x = ${m}`)}So the major arc is $360^\\circ - ${m}^\\circ = ${M}^\\circ$.`,
              `设劣弧为 $x^\\circ$，则优弧为 $(360 - x)^\\circ$：${steps(`\\frac{(360 - x) - x}{2} = ${p}`, `180 - x = ${p}`, `x = ${m}`)}所以优弧是 $360^\\circ - ${m}^\\circ = ${M}^\\circ$。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              seg(tt.pp, tt.pa),
              seg(tt.pp, tt.pb),
              ...arcAt(a, b),
              arcText(a, b, "?"),
              angleAt(tt.pp, tt.pa, tt.pb, deg(p)),
              ...pointsAt([
                [a, "A"],
                [b, "B"],
              ]),
              ...outside(tt.pp),
            ],
            `Two tangents from P touch a circle at A and B; angle APB is ${p}° and the major arc AB is highlighted.`,
            `从 P 引的两条切线与圆相切于 A、B；角 APB 为 ${p}°，优弧 AB 被突出显示。`,
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The tangent-chord theorem
// ---------------------------------------------------------------------------

/** tangentChordMarks draws a tangent at A = on(s) with ends T (counterclockwise) and S, the chord AB to B = on(s + m), and the extra marks. */
function tangentChordMarks(s: number, m: number, extra: readonly Mark[], arcLabel?: string): Mark[] {
  const pa = on(s);
  const dir = tangentDir(s);
  const [pt, ps] = [along(pa, dir, 0.9 * R), along(pa, dir, -0.9 * R)];
  return [
    circleAt(),
    seg(ps, pt),
    seg(pa, on(s + m)),
    ...(arcLabel !== undefined ? [...arcAt(s, s + m), arcText(s, s + m, arcLabel)] : []),
    ...extra,
    { kind: "label", at: pt, text: "T", dir: dirOf(heading(pt)), italic: true },
    { kind: "label", at: ps, text: "S", dir: dirOf(heading(ps)), italic: true },
    ...pointsAt([
      [s, "A"],
      [s + m, "B"],
    ]),
  ];
}

export const theTangentChordTheorem: TopicDef = {
  id: "the-tangent-chord-theorem",
  title: t("The Tangent-Chord Theorem", "弦切角定理"),
  summary: t(
    "The angle between a tangent and a chord is half the intercepted arc, and equals the inscribed angle on the other side of the chord.",
    "弦切角等于它所夹弧的度数的一半，也等于弦另一侧所对的圆周角。",
  ),
  prerequisites: ["tangent-lines-to-circles", "problem-solving-with-inscribed-angles"],
  encompasses: [
    { topic: "problem-solving-with-inscribed-angles", weight: 0.3 },
    { topic: "inscribed-angles", weight: 0.3 },
    { topic: "tangent-lines-to-circles", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "the-angle-from-the-arc",
      title: t("The angle from the arc", "由弧求弦切角"),
      explanation: t(
        `A tangent and a chord that meet at the point of tangency $A$ form a **tangent-chord angle**. **Tangent-chord theorem:** it is half the arc inside it:\n\n$$\\angle TAB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$\n\n(The radius $OA$ is perpendicular to the tangent, so $\\angle TAB = 90^\\circ - \\angle OAB$, which is half the central angle.) If $m${arcTex("AB")} = 124^\\circ$, then $\\angle TAB = 62^\\circ$, and the angle on the other side of the chord is $\\angle SAB = 180^\\circ - 62^\\circ = 118^\\circ$.`,
        `切线与过切点 $A$ 的弦所成的角叫**弦切角**。**弦切角定理**：弦切角等于它所夹弧的一半：\n\n$$\\angle TAB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$\n\n（半径 $OA$ 垂直于切线，所以 $\\angle TAB = 90^\\circ - \\angle OAB$，即圆心角的一半。）若 $m${arcTex("AB")} = 124^\\circ$，则 $\\angle TAB = 62^\\circ$，弦另一侧的角 $\\angle SAB = 180^\\circ - 62^\\circ = 118^\\circ$。`,
      ),
      generate(rng) {
        const m = 2 * rng.int(20, 80);
        const s = rng.int(0, 359);
        const pa = on(s);
        const pb = on(s + m);
        const pt = along(pa, tangentDir(s), 0.9 * R);
        const ps = along(pa, tangentDir(s), -0.9 * R);
        const other = rng.bool(0.4);
        const answer = other ? 180 - m / 2 : m / 2;
        return {
          ...numberProblem({
            prompt: t(
              `Line $ST$ is tangent to the circle at $A$. Find $\\angle ${other ? "SAB" : "TAB"}$.`,
              `直线 $ST$ 与圆相切于 $A$。求 $\\angle ${other ? "SAB" : "TAB"}$。`,
            ),
            answer,
            unit: "°",
            wrong: other ? [m / 2, 360 - m, m] : [m, 180 - m / 2, 90 - m / 2],
            solution: other
              ? t(
                  `By the tangent-chord theorem, $\\angle TAB$ is half of arc $${arcTex("AB")}$, and $\\angle SAB$ makes a straight angle with it:${steps(`\\angle TAB = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`, `\\angle SAB = 180^\\circ - ${m / 2}^\\circ = ${answer}^\\circ`)}`,
                  `由弦切角定理，$\\angle TAB$ 是弧 $${arcTex("AB")}$ 的一半，$\\angle SAB$ 与它组成平角：${steps(`\\angle TAB = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`, `\\angle SAB = 180^\\circ - ${m / 2}^\\circ = ${answer}^\\circ`)}`,
                )
              : t(
                  `By the tangent-chord theorem, the angle is half the arc inside it:${steps(`\\angle TAB = \\frac{${m}^\\circ}{2} = ${answer}^\\circ`)}`,
                  `由弦切角定理，弦切角是它所夹弧的一半：${steps(`\\angle TAB = \\frac{${m}^\\circ}{2} = ${answer}^\\circ`)}`,
                ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [other ? angleAt(pa, ps, pb, "?") : angleAt(pa, pt, pb, "?")], deg(m)),
            `Line ST is tangent to a circle at A, and AB is a chord; the arc AB inside angle TAB is ${m}°.`,
            `直线 ST 与圆相切于 A，AB 是弦；角 TAB 内的弧 AB 为 ${m}°。`,
          ),
        };
      },
    },
    {
      id: "the-arc-from-the-angle",
      title: t("The arc from the angle", "由弦切角求弧"),
      explanation: t(
        `The intercepted arc is twice the tangent-chord angle: $m${arcTex("AB")} = 2\\angle TAB$. If $\\angle TAB = 47^\\circ$, the arc is $94^\\circ$.\n\nWith algebra: if $\\angle TAB = (x + 15)^\\circ$ and $m${arcTex("AB")} = (3x - 5)^\\circ$, then $2(x + 15) = 3x - 5$, so $2x + 30 = 3x - 5$ and $x = 35$.`,
        `所夹的弧是弦切角的两倍：$m${arcTex("AB")} = 2\\angle TAB$。若 $\\angle TAB = 47^\\circ$，则弧是 $94^\\circ$。\n\n含未知数时：若 $\\angle TAB = (x + 15)^\\circ$，$m${arcTex("AB")} = (3x - 5)^\\circ$，则 $2(x + 15) = 3x - 5$，即 $2x + 30 = 3x - 5$，$x = 35$。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const s = rng.int(0, 359);
        const pa = on(s);
        const pt = along(pa, tangentDir(s), 0.9 * R);
        const pb = on(s + m);
        const prompt = t("Line $ST$ is tangent to the circle at $A$.", "直线 $ST$ 与圆相切于 $A$。");
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `${prompt.en} Find the measure of arc $${arcTex("AB")}$ inside $\\angle TAB$.`,
                `${prompt["zh-CN"]}求 $\\angle TAB$ 内的弧 $${arcTex("AB")}$ 的度数。`,
              ),
              answer: m,
              unit: "°",
              wrong: [theta, q(theta, 2), 360 - m, 180 - theta],
              solution: t(
                `The arc is twice the tangent-chord angle:${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}`,
                `弧是弦切角的两倍：${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}`,
              ),
            }),
            figure: figure(
              tangentChordMarks(s, m, [angleAt(pa, pt, pb, deg(theta))], "?"),
              `Line ST is tangent to a circle at A, and AB is a chord; angle TAB is ${theta}°.`,
              `直线 ST 与圆相切于 A，AB 是弦；角 TAB 为 ${theta}°。`,
            ),
          };
        }
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, theta, x, 4);
        const [c2, d2] = expressionFor(rng, m, x, 9, [2 * c1]);
        return {
          ...numberProblem({
            prompt: t(`${prompt.en} Find $x$.`, `${prompt["zh-CN"]}求 $x$。`),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), theta],
            solution: t(
              `The arc is twice the tangent-chord angle:${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
              `弧是弦切角的两倍：${solveLinear(2 * c1, 2 * d1, c2, d2, `2(${linear(c1, d1)}) = ${linear(c2, d2)}`)}`,
            ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [angleAt(pa, pt, pb, angleLabel(c1, d1))], angleLabel(c2, d2)),
            `Line ST is tangent to a circle at A, and AB is a chord; angle TAB is ${angleLabel(c1, d1)} and arc AB is ${angleLabel(c2, d2)}.`,
            `直线 ST 与圆相切于 A，AB 是弦；角 TAB 为 ${angleLabel(c1, d1)}，弧 AB 为 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "tangent-chord-and-inscribed-angles",
      title: t("Tangent-chord and inscribed angles", "弦切角与圆周角"),
      explanation: t(
        `Both the tangent-chord angle $\\angle TAB$ and an inscribed angle $\\angle ACB$ on the other side of the chord intercept arc $${arcTex("AB")}$, so they are **equal**:\n\n$$\\angle TAB = \\angle ACB.$$\n\nIf $\\angle TAB = 52^\\circ$ and $\\angle ABC = 71^\\circ$ in triangle $ABC$, then $\\angle ACB = 52^\\circ$ and $\\angle BAC = 180^\\circ - 52^\\circ - 71^\\circ = 57^\\circ$.`,
        `弦切角 $\\angle TAB$ 与弦另一侧的圆周角 $\\angle ACB$ 都对着弧 $${arcTex("AB")}$，所以它们**相等**：\n\n$$\\angle TAB = \\angle ACB.$$\n\n若 $\\angle TAB = 52^\\circ$，在 $\\triangle ABC$ 中 $\\angle ABC = 71^\\circ$，则 $\\angle ACB = 52^\\circ$，$\\angle BAC = 180^\\circ - 52^\\circ - 71^\\circ = 57^\\circ$。`,
      ),
      generate(rng) {
        const theta = rng.int(25, 75);
        const m = 2 * theta;
        const beta = rng.int(25, Math.min(100, 155 - theta));
        const gamma = 180 - theta - beta;
        const s = rng.int(0, 359);
        const cAt = s + 360 - 2 * beta;
        const [pa, pb, pc] = [on(s), on(s + m), on(cAt)];
        const pt = along(pa, tangentDir(s), 0.9 * R);
        const tri: Mark[] = [
          seg(pa, pc),
          seg(pb, pc),
          { kind: "dot", at: pc },
          { kind: "label", at: pc, text: "C", dir: dirOf(cAt), italic: true },
        ];
        const prompt = t("Line $ST$ is tangent to the circle at $A$, and $C$ is on the circle.", "直线 $ST$ 与圆相切于 $A$，$C$ 在圆上。");
        if (rng.bool()) {
          const fromC = rng.bool();
          return {
            ...numberProblem({
              prompt: t(
                `${prompt.en} Find $\\angle ${fromC ? "TAB" : "ACB"}$.`,
                `${prompt["zh-CN"]}求 $\\angle ${fromC ? "TAB" : "ACB"}$。`,
              ),
              answer: theta,
              unit: "°",
              wrong: [m, 90 - theta, 180 - theta],
              solution: t(
                `$\\angle TAB$ and $\\angle ACB$ both intercept arc $${arcTex("AB")}$, each being half of it, so they are equal:${steps(`\\angle ${fromC ? "TAB" : "ACB"} = \\angle ${fromC ? "ACB" : "TAB"} = ${theta}^\\circ`)}`,
                `$\\angle TAB$ 与 $\\angle ACB$ 都对着弧 $${arcTex("AB")}$，都是它的一半，所以相等：${steps(`\\angle ${fromC ? "TAB" : "ACB"} = \\angle ${fromC ? "ACB" : "TAB"} = ${theta}^\\circ`)}`,
              ),
            }),
            figure: figure(
              tangentChordMarks(s, m, [
                ...tri,
                angleAt(pc, pa, pb, fromC ? deg(theta) : "?"),
                angleAt(pa, pt, pb, fromC ? "?" : deg(theta)),
              ]),
              `Line ST is tangent to a circle at A; A, B and C are on the circle, with chords AB, AC and BC.`,
              `直线 ST 与圆相切于 A；A、B、C 在圆上，画有弦 AB、AC、BC。`,
            ),
          };
        }
        return {
          ...numberProblem({
            prompt: t(`${prompt.en} Find $\\angle BAC$.`, `${prompt["zh-CN"]}求 $\\angle BAC$。`),
            answer: gamma,
            unit: "°",
            wrong: [180 - theta, theta + beta, 180 - 2 * theta - beta, 90 - theta],
            solution: t(
              `By the tangent-chord theorem, $\\angle ACB = \\angle TAB = ${theta}^\\circ$. The angles of $\\triangle ABC$ add to $180^\\circ$:${steps(`\\angle BAC = 180^\\circ - ${theta}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}`,
              `由弦切角定理，$\\angle ACB = \\angle TAB = ${theta}^\\circ$。$\\triangle ABC$ 的内角和是 $180^\\circ$：${steps(`\\angle BAC = 180^\\circ - ${theta}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}`,
            ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [...tri, angleAt(pa, pt, pb, deg(theta)), angleAt(pb, pc, pa, deg(beta)), angleAt(pa, pb, pc, "?")]),
            `Line ST is tangent to a circle at A; triangle ABC is inscribed, angle TAB is ${theta}° and angle ABC is ${beta}°.`,
            `直线 ST 与圆相切于 A；三角形 ABC 内接于圆，角 TAB 为 ${theta}°，角 ABC 为 ${beta}°。`,
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Circle similarity
// ---------------------------------------------------------------------------

const scales: readonly (readonly [number, number])[] = [
  [2, 1],
  [3, 1],
  [4, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 2],
  [3, 4],
  [4, 3],
  [5, 2],
  [2, 5],
  [5, 3],
  [3, 5],
  [5, 4],
  [4, 5],
];

/** ratioTex writes a/b in lowest terms in LaTeX: "\frac{5}{3}", "2". */
const ratioTex = (a: number, b: number) => q(a, b).toLatex();

export const circleSimilarity: TopicDef = {
  id: "circle-similarity",
  title: t("Circle Similarity", "圆的相似"),
  summary: t(
    "All circles are similar: find the scale factor between two circles and use it for circumferences and areas.",
    "所有的圆都相似：求两个圆之间的比例因子，并用它求周长和面积。",
  ),
  prerequisites: ["dilations-of-geometric-figures", "areas-of-circles"],
  encompasses: [
    { topic: "dilations-of-geometric-figures", weight: 0.3 },
    { topic: "areas-of-circles", weight: 0.2 },
    { topic: "the-circumference-of-a-circle", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.C.A.1"],
  knowledgePoints: [
    {
      id: "scale-factors-of-circles",
      title: t("Scale factors of circles", "圆的比例因子"),
      explanation: t(
        "Any two circles are **similar**: one can be moved and dilated onto the other. A circle is determined by its radius, so the scale factor from circle $A$ to circle $B$ is the ratio of the radii, or of the diameters:\n\n$$k = \\frac{r_B}{r_A} = \\frac{d_B}{d_A}.$$\n\nFrom a circle of radius $6$ to a circle of diameter $20$ (radius $10$), the scale factor is $\\frac{10}{6} = \\frac{5}{3}$. Compare radius with radius: $\\frac{20}{6}$ would be wrong.",
        "任意两个圆都**相似**：一个圆经过移动和放缩可以与另一个重合。圆由半径决定，所以从圆 $A$ 到圆 $B$ 的比例因子是半径之比，也是直径之比：\n\n$$k = \\frac{r_B}{r_A} = \\frac{d_B}{d_A}.$$\n\n从半径为 $6$ 的圆到直径为 $20$（半径 $10$）的圆，比例因子是 $\\frac{10}{6} = \\frac{5}{3}$。要用半径比半径：$\\frac{20}{6}$ 是错的。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const m = rng.int(1, 6);
        const [ra, rb] = [a * m, b * m];
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        const given = [
          [t(`a radius of $${tex(ra, u)}$`, `半径为 $${tex(ra, u)}$`), t(`a radius of $${tex(rb, u)}$`, `半径为 $${tex(rb, u)}$`)],
          [
            t(`a diameter of $${tex(2 * ra, u)}$`, `直径为 $${tex(2 * ra, u)}$`),
            t(`a radius of $${tex(rb, u)}$`, `半径为 $${tex(rb, u)}$`),
          ],
          [
            t(`a radius of $${tex(ra, u)}$`, `半径为 $${tex(ra, u)}$`),
            t(`a diameter of $${tex(2 * rb, u)}$`, `直径为 $${tex(2 * rb, u)}$`),
          ],
        ][kind]!;
        const half = kind === 1 ? `r_A = ${2 * ra} \\div 2 = ${ra}` : kind === 2 ? `r_B = ${2 * rb} \\div 2 = ${rb}` : undefined;
        const mixed = kind === 1 ? q(rb, 2 * ra) : kind === 2 ? q(2 * rb, ra) : undefined;
        const work = [...(half ? [half] : []), `k = \\frac{${rb}}{${ra}} = ${ratioTex(rb, ra)}`];
        return numberProblem({
          prompt: t(
            `Circle $A$ has ${given[0]!.en} and circle $B$ has ${given[1]!.en}. Find the scale factor of a dilation that maps circle $A$ onto a circle congruent to circle $B$.`,
            `圆 $A$ 的${given[0]!["zh-CN"]}，圆 $B$ 的${given[1]!["zh-CN"]}。求把圆 $A$ 变为与圆 $B$ 全等的圆的位似的比例因子。`,
          ),
          answer: q(rb, ra),
          wrong: some([q(ra, rb), rb - ra, mixed]),
          solution: t(
            `The scale factor is the ratio of the radii, image over original:${steps(...work)}`,
            `比例因子是半径之比（像比原图）：${steps(...work)}`,
          ),
        });
      },
    },
    {
      id: "circumferences-of-similar-circles",
      title: t("Circumferences of similar circles", "相似圆的周长"),
      explanation: t(
        "A dilation with scale factor $k$ multiplies every length by $k$, including the circumference: $C = 2\\pi r$ becomes $2\\pi (kr) = k \\cdot C$.\n\nA circle with circumference $36$ cm dilated with scale factor $\\frac{2}{3}$ has circumference $\\frac{2}{3} \\cdot 36 = 24$ cm. Likewise, if two circles have circumferences $30$ m and $45$ m and the first has radius $4$ m, the second has radius $4 \\cdot \\frac{45}{30} = 6$ m.",
        "比例因子为 $k$ 的位似把每个长度都乘以 $k$，周长也不例外：$C = 2\\pi r$ 变为 $2\\pi (kr) = k \\cdot C$。\n\n周长为 $36$ 厘米的圆，经比例因子为 $\\frac{2}{3}$ 的位似后，周长是 $\\frac{2}{3} \\cdot 36 = 24$ 厘米。同样，若两个圆的周长分别是 $30$ 米和 $45$ 米，第一个圆的半径是 $4$ 米，则第二个圆的半径是 $4 \\cdot \\frac{45}{30} = 6$ 米。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const u = pickUnit(rng);
        if (rng.bool()) {
          const c = b * rng.int(2, 12);
          const image = (a * c) / b;
          return numberProblem({
            prompt: t(
              `A circle with a circumference of $${tex(c, u)}$ is dilated with a scale factor of $${ratioTex(a, b)}$. Find the circumference of the image.`,
              `周长为 $${tex(c, u)}$ 的圆经比例因子为 $${ratioTex(a, b)}$ 的位似变换。求像的周长。`,
            ),
            answer: image,
            unit: u,
            wrong: [q(a * a * c, b * b), q(b * c, a), c],
            solution: t(
              `The circumference is a length, so it is multiplied by the scale factor:${steps(`${ratioTex(a, b)} \\cdot ${c} = ${tex(image, u)}`)}`,
              `周长是长度，所以乘以比例因子：${steps(`${ratioTex(a, b)} \\cdot ${c} = ${tex(image, u)}`)}`,
            ),
          });
        }
        const m = rng.int(2, 9);
        const [ca, cb] = [a * m * 3, b * m * 3];
        const ra = a * rng.int(1, 5);
        const rb = (ra * b) / a;
        return numberProblem({
          prompt: t(
            `Circles $A$ and $B$ have circumferences $${tex(ca, u)}$ and $${tex(cb, u)}$. The radius of circle $A$ is $${tex(ra, u)}$. Find the radius of circle $B$.`,
            `圆 $A$ 与圆 $B$ 的周长分别是 $${tex(ca, u)}$ 和 $${tex(cb, u)}$。圆 $A$ 的半径是 $${tex(ra, u)}$。求圆 $B$ 的半径。`,
          ),
          answer: rb,
          unit: u,
          wrong: [q(ra * a, b), q(ra * b * b, a * a), ra + cb - ca],
          solution: t(
            `The circumferences are in the ratio of the scale factor, and so are the radii:${steps(`k = \\frac{${cb}}{${ca}} = ${ratioTex(b, a)}`, `r_B = ${ratioTex(b, a)} \\cdot ${ra} = ${tex(q(rb, 1).toLatex(), u)}`)}`,
            `周长之比等于比例因子，半径之比也一样：${steps(`k = \\frac{${cb}}{${ca}} = ${ratioTex(b, a)}`, `r_B = ${ratioTex(b, a)} \\cdot ${ra} = ${tex(q(rb, 1).toLatex(), u)}`)}`,
          ),
        });
      },
    },
    {
      id: "areas-of-similar-circles",
      title: t("Areas of similar circles", "相似圆的面积"),
      explanation: t(
        "Areas are multiplied by the **square** of the scale factor: $\\pi r^2$ becomes $\\pi (kr)^2 = k^2 \\cdot \\pi r^2$.\n\nA circle with area $45\\text{ cm}^2$ dilated with scale factor $\\frac{2}{3}$ has area $\\frac{4}{9} \\cdot 45 = 20\\text{ cm}^2$. Going back, if two circles have areas $18$ and $50$, the ratio of areas is $\\frac{50}{18} = \\frac{25}{9}$, so the scale factor is $\\sqrt{\\frac{25}{9}} = \\frac{5}{3}$.",
        "面积乘以比例因子的**平方**：$\\pi r^2$ 变为 $\\pi (kr)^2 = k^2 \\cdot \\pi r^2$。\n\n面积为 $45\\text{ cm}^2$ 的圆，经比例因子为 $\\frac{2}{3}$ 的位似后，面积是 $\\frac{4}{9} \\cdot 45 = 20\\text{ cm}^2$。反过来，若两个圆的面积分别是 $18$ 和 $50$，面积之比是 $\\frac{50}{18} = \\frac{25}{9}$，所以比例因子是 $\\sqrt{\\frac{25}{9}} = \\frac{5}{3}$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const u = pickUnit(rng);
        if (rng.bool()) {
          const area = b * b * rng.int(1, 8);
          const image = (a * a * area) / (b * b);
          return numberProblem({
            prompt: t(
              `A circle with an area of $${tex(area, u)}^2$ is dilated with a scale factor of $${ratioTex(a, b)}$. Find the area of the image.`,
              `面积为 $${tex(area, u)}^2$ 的圆经比例因子为 $${ratioTex(a, b)}$ 的位似变换。求像的面积。`,
            ),
            answer: image,
            unit: `${u}^2`,
            wrong: [q(a * area, b), q(b * b * area, a * a), area],
            solution: t(
              `Areas are multiplied by the square of the scale factor:${steps(`\\left(${ratioTex(a, b)}\\right)^2 \\cdot ${area} = ${ratioTex(a * a, b * b)} \\cdot ${area} = ${image}\\text{ ${u}}^2`)}`,
              `面积乘以比例因子的平方：${steps(`\\left(${ratioTex(a, b)}\\right)^2 \\cdot ${area} = ${ratioTex(a * a, b * b)} \\cdot ${area} = ${image}\\text{ ${u}}^2`)}`,
            ),
          });
        }
        const m = rng.int(1, 6);
        const [areaA, areaB] = [b * b * m, a * a * m];
        return numberProblem({
          prompt: t(
            `Circle $A$ has an area of $${tex(areaA, u)}^2$ and circle $B$ has an area of $${tex(areaB, u)}^2$. Find the scale factor of a dilation that maps circle $A$ onto a circle congruent to circle $B$.`,
            `圆 $A$ 的面积是 $${tex(areaA, u)}^2$，圆 $B$ 的面积是 $${tex(areaB, u)}^2$。求把圆 $A$ 变为与圆 $B$ 全等的圆的位似的比例因子。`,
          ),
          answer: q(a, b),
          wrong: [q(a * a, b * b), q(b, a), q(areaB - areaA, 1)],
          solution: t(
            `The ratio of the areas is the square of the scale factor:${steps(`k^2 = \\frac{${areaB}}{${areaA}} = ${ratioTex(a * a, b * b)}`, `k = \\sqrt{${ratioTex(a * a, b * b)}} = ${ratioTex(a, b)}`)}`,
            `面积之比是比例因子的平方：${steps(`k^2 = \\frac{${areaB}}{${areaA}} = ${ratioTex(a * a, b * b)}`, `k = \\sqrt{${ratioTex(a * a, b * b)}} = ${ratioTex(a, b)}`)}`,
          ),
        });
      },
    },
  ],
};

/** shiftTex writes x + a for a translation rule: "x + 3", "y - 2", "x". */
const shiftTex = (v: string, a: number) => (a === 0 ? v : `${v} ${a > 0 ? "+" : "-"} ${Math.abs(a)}`);

/** ruleTex writes the translation (x, y) → (x + a, y + b). */
const ruleTex = (a: number, b: number) => `(x, y) \\to (${shiftTex("x", a)}, ${shiftTex("y", b)})`;

/** CircleData is a circle in the coordinate plane: center (h, k) and radius r. */
interface CircleData {
  readonly h: number;
  readonly k: number;
  readonly r: number;
}

/** twoCircles picks circles A and B with different centers and radii, B's center not at the origin. */
function twoCircles(rng: Rng): [CircleData, CircleData] {
  const h1 = rng.int(-9, 9);
  const k1 = rng.int(-9, 9);
  const h2 = rng.pick([-1, 1]) * rng.int(1, 9);
  const k2 = rng.int(-9, 9);
  const r1 = rng.int(1, 10);
  const r2 = (r1 + rng.int(1, 9)) % 11 || 11;
  return [
    { h: h1, k: k1, r: r1 },
    { h: h2 === h1 && k2 === k1 ? h2 + 1 : h2, k: k2, r: r2 },
  ];
}

const circleTex = (name: string, c: CircleData) => `circle $${name}$ with center $(${c.h}, ${c.k})$ and radius $${c.r}$`;
const circleTexZh = (name: string, c: CircleData) => `圆 $${name}$（圆心 $(${c.h}, ${c.k})$，半径 $${c.r}$）`;

/** ProofStep is a statement of the circle similarity proof with its reason. */
interface ProofStep {
  readonly s: Text;
  readonly r: Text;
  /** alts are wrong statements for the step. */
  readonly alts: readonly Text[];
}

const proofReasons = {
  translation: t("A translation is a rigid motion, so it preserves distances", "平移是刚体运动，保持距离不变"),
  dilation: t("A dilation multiplies distances from its center by the scale factor", "位似把到位似中心的距离乘以比例因子"),
  circle: t("Definition of a circle", "圆的定义"),
  similarity: t("A translation followed by a dilation is a similarity transformation", "平移后再作位似是相似变换"),
  wrongDilation: t("A dilation preserves distances", "位似保持距离不变"),
  wrongTranslation: t("A translation multiplies distances by the scale factor", "平移把距离乘以比例因子"),
  inscribed: t("Inscribed angle theorem", "圆周角定理"),
  tangent: t("A tangent is perpendicular to the radius", "切线垂直于半径"),
};

export const provingCircleSimilarity: TopicDef = {
  id: "proving-circle-similarity",
  title: t("Proving Circle Similarity", "证明圆的相似"),
  summary: t(
    "Prove that any two circles are similar with a translation followed by a dilation, in the coordinate plane and in general.",
    "用先平移、再位似的方法证明任意两个圆相似，包括坐标平面中的情形和一般情形。",
  ),
  prerequisites: ["circle-similarity", "translations-of-geometric-figures"],
  encompasses: [
    { topic: "circle-similarity", weight: 0.5 },
    { topic: "dilations-of-geometric-figures", weight: 0.3 },
    { topic: "translations-of-geometric-figures", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.1"],
  knowledgePoints: [
    {
      id: "mapping-one-circle-onto-another",
      title: t("Mapping one circle onto another", "把一个圆变为另一个圆"),
      explanation: t(
        "To map circle $A$ (center $(h_1, k_1)$, radius $r_1$) onto circle $B$ (center $(h_2, k_2)$, radius $r_2$):\n\n1. **Translate** by $(x, y) \\to (x + h_2 - h_1, y + k_2 - k_1)$. The center moves onto $(h_2, k_2)$ and the radius stays $r_1$.\n2. **Dilate** about $(h_2, k_2)$ with scale factor $\\frac{r_2}{r_1}$. The center stays put and the radius becomes $r_2$.\n\nFor circle $A$ with center $(1, 2)$ and radius $3$, and circle $B$ with center $(4, -1)$ and radius $6$: translate by $(x, y) \\to (x + 3, y - 3)$, then dilate about $(4, -1)$ with scale factor $2$.",
        "要把圆 $A$（圆心 $(h_1, k_1)$，半径 $r_1$）变为圆 $B$（圆心 $(h_2, k_2)$，半径 $r_2$）：\n\n1. **平移** $(x, y) \\to (x + h_2 - h_1, y + k_2 - k_1)$。圆心移到 $(h_2, k_2)$，半径仍为 $r_1$。\n2. 以 $(h_2, k_2)$ 为中心、比例因子为 $\\frac{r_2}{r_1}$ 作**位似**。圆心不动，半径变为 $r_2$。\n\n圆 $A$ 圆心 $(1, 2)$、半径 $3$，圆 $B$ 圆心 $(4, -1)$、半径 $6$：先平移 $(x, y) \\to (x + 3, y - 3)$，再以 $(4, -1)$ 为中心、比例因子 $2$ 作位似。",
      ),
      keyPrerequisites: ["translations-of-geometric-figures"],
      generate(rng) {
        const [A, B] = twoCircles(rng);
        const [a, b] = [B.h - A.h, B.k - A.k];
        const k = ratioTex(B.r, A.r);
        const option = (rule: string, center: string, factor: string) =>
          t(
            `Translate by $${rule}$, then dilate about $${center}$ with scale factor $${factor}$`,
            `先平移 $${rule}$，再以 $${center}$ 为中心、比例因子 $${factor}$ 作位似`,
          );
        const centerB = `(${B.h}, ${B.k})`;
        const options = [
          option(ruleTex(a, b), centerB, k),
          option(ruleTex(a, b), centerB, ratioTex(A.r, B.r)),
          option(ruleTex(-a, -b), centerB, k),
          option(ruleTex(a, b), "(0, 0)", k),
        ];
        const shuffled = rng.shuffle(options);
        return choiceProblem({
          prompt: t(
            `Which sequence of transformations maps ${circleTex("A", A)} onto ${circleTex("B", B)}?`,
            `下列哪一组变换把${circleTexZh("A", A)}变为${circleTexZh("B", B)}？`,
          ),
          options: shuffled,
          correct: shuffled.indexOf(options[0]!),
          solution: t(
            `The translation must move the center $(${A.h}, ${A.k})$ onto $${centerB}$: $${ruleTex(a, b)}$. The dilation must keep that center in place, so its center is $${centerB}$, and it must take the radius $${A.r}$ to $${B.r}$, so its scale factor is $\\frac{${B.r}}{${A.r}} = ${k}$.`,
            `平移要把圆心 $(${A.h}, ${A.k})$ 移到 $${centerB}$：$${ruleTex(a, b)}$。位似要使这个圆心不动，所以位似中心是 $${centerB}$；还要把半径 $${A.r}$ 变为 $${B.r}$，所以比例因子是 $\\frac{${B.r}}{${A.r}} = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "the-translation-and-the-scale-factor",
      title: t("The translation and the scale factor", "平移与比例因子"),
      explanation: t(
        "The translation is found from the centers, the scale factor from the radii.\n\nFor circle $A$ with center $(-2, 5)$ and radius $4$, and circle $B$ with center $(3, 1)$ and radius $10$: the translation $(x, y) \\to (x + a, y + b)$ has $a = 3 - (-2) = 5$ and $b = 1 - 5 = -4$, so $(a, b) = (5, -4)$; the scale factor is $\\frac{10}{4} = \\frac{5}{2}$.",
        "平移由两个圆心求出，比例因子由两个半径求出。\n\n圆 $A$ 圆心 $(-2, 5)$、半径 $4$，圆 $B$ 圆心 $(3, 1)$、半径 $10$：平移 $(x, y) \\to (x + a, y + b)$ 中 $a = 3 - (-2) = 5$，$b = 1 - 5 = -4$，所以 $(a, b) = (5, -4)$；比例因子是 $\\frac{10}{4} = \\frac{5}{2}$。",
      ),
      keyPrerequisites: ["translations-of-geometric-figures"],
      generate(rng) {
        const [A, B] = twoCircles(rng);
        const [a, b] = [B.h - A.h, B.k - A.k];
        const intro = t(
          `${circleTex("A", A)[0]!.toUpperCase()}${circleTex("A", A).slice(1)} is mapped onto ${circleTex("B", B)} by a translation $(x, y) \\to (x + a, y + b)$ followed by a dilation about $(${B.h}, ${B.k})$.`,
          `${circleTexZh("A", A)}先经平移 $(x, y) \\to (x + a, y + b)$，再经以 $(${B.h}, ${B.k})$ 为中心的位似，变为${circleTexZh("B", B)}。`,
        );
        if (rng.bool()) {
          return pointProblem({
            prompt: t(`${intro.en} Find $(a, b)$.`, `${intro["zh-CN"]}求 $(a, b)$。`),
            answer: [a, b],
            vars: ["a", "b"],
            wrong: [
              [-a, -b],
              [b, a],
              [B.h + A.h, B.k + A.k],
            ],
            solution: t(
              `The translation moves the center of $A$ onto the center of $B$:${steps(`a = ${B.h} - (${A.h}) = ${a}`, `b = ${B.k} - (${A.k}) = ${b}`)}`,
              `平移把圆 $A$ 的圆心移到圆 $B$ 的圆心：${steps(`a = ${B.h} - (${A.h}) = ${a}`, `b = ${B.k} - (${A.k}) = ${b}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`${intro.en} Find the scale factor of the dilation.`, `${intro["zh-CN"]}求位似的比例因子。`),
          answer: q(B.r, A.r),
          wrong: [q(A.r, B.r), B.r - A.r, q(B.r * B.r, A.r * A.r)],
          solution: t(
            `The translation keeps the radius $${A.r}$, and the dilation must make it $${B.r}$:${steps(`k = \\frac{${B.r}}{${A.r}} = ${ratioTex(B.r, A.r)}`)}`,
            `平移后半径仍是 $${A.r}$，位似要把它变为 $${B.r}$：${steps(`k = \\frac{${B.r}}{${A.r}} = ${ratioTex(B.r, A.r)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-proof-that-all-circles-are-similar",
      title: t("The proof that all circles are similar", "所有圆都相似的证明"),
      explanation: t(
        "**Theorem:** any two circles are similar. Let circle $A$ have center $A$ and radius $r$, and circle $B$ center $B$ and radius $s$.\n\n1. Translate circle $A$ so that $A$ goes to $B$. The image is a circle with center $B$ and radius $r$, because a translation preserves distances.\n2. Dilate that image about $B$ with scale factor $\\frac{s}{r}$. Each of its points, at distance $r$ from $B$, goes to distance $r \\cdot \\frac{s}{r} = s$ from $B$, because a dilation multiplies distances from its center by the scale factor.\n3. The final image is the set of all points at distance $s$ from $B$, which is circle $B$ by the definition of a circle.\n4. A translation followed by a dilation is a similarity transformation, so circle $A$ is similar to circle $B$.",
        "**定理**：任意两个圆都相似。设圆 $A$ 的圆心为 $A$、半径为 $r$，圆 $B$ 的圆心为 $B$、半径为 $s$。\n\n1. 平移圆 $A$，使 $A$ 移到 $B$。像是圆心为 $B$、半径为 $r$ 的圆，因为平移保持距离不变。\n2. 以 $B$ 为中心、比例因子 $\\frac{s}{r}$ 对这个像作位似。它的每个点到 $B$ 的距离是 $r$，变为 $r \\cdot \\frac{s}{r} = s$，因为位似把到中心的距离乘以比例因子。\n3. 最后的像是到 $B$ 距离为 $s$ 的所有点，由圆的定义，它就是圆 $B$。\n4. 平移后再作位似是相似变换，所以圆 $A$ 与圆 $B$ 相似。",
      ),
      generate(rng) {
        const r = rng.int(2, 15);
        let s = rng.int(2, 15);
        if (s === r) s = r + 1;
        const k = ratioTex(s, r);
        const proof: ProofStep[] = [
          {
            s: t(
              `Translating circle $A$ by the vector from $A$ to $B$ gives a circle with center $B$ and radius $${r}$.`,
              `把圆 $A$ 沿从 $A$ 到 $B$ 的方向平移，得到圆心为 $B$、半径为 $${r}$ 的圆。`,
            ),
            r: proofReasons.translation,
            alts: [
              t(`… a circle with center $B$ and radius $${s}$.`, `……圆心为 $B$、半径为 $${s}$ 的圆。`),
              t(`… a circle with center $A$ and radius $${s}$.`, `……圆心为 $A$、半径为 $${s}$ 的圆。`),
              t(`… a circle with center $B$ and radius $${r + s}$.`, `……圆心为 $B$、半径为 $${r + s}$ 的圆。`),
            ],
          },
          {
            s: t(
              `Dilating that circle about $B$ with scale factor $${k}$ moves each of its points to distance $${r} \\cdot ${k} = ${s}$ from $B$.`,
              `以 $B$ 为中心、比例因子 $${k}$ 对它作位似，它的每个点到 $B$ 的距离变为 $${r} \\cdot ${k} = ${s}$。`,
            ),
            r: proofReasons.dilation,
            alts: [
              t(`… moves each of its points to distance $${r}$ from $B$.`, `……每个点到 $B$ 的距离仍为 $${r}$。`),
              t(`… moves each of its points to distance $${r} + ${k}$ from $B$.`, `……每个点到 $B$ 的距离变为 $${r} + ${k}$。`),
              t(
                `… moves each of its points to distance $${q(r * r, s).toLatex()}$ from $B$.`,
                `……每个点到 $B$ 的距离变为 $${q(r * r, s).toLatex()}$。`,
              ),
            ],
          },
          {
            s: t(
              `The image is the set of all points at distance $${s}$ from $B$, which is circle $B$.`,
              `像是到 $B$ 距离为 $${s}$ 的所有点，也就是圆 $B$。`,
            ),
            r: proofReasons.circle,
            alts: [],
          },
          {
            s: t("Circle $A$ is similar to circle $B$.", "圆 $A$ 与圆 $B$ 相似。"),
            r: proofReasons.similarity,
            alts: [],
          },
        ];
        const i = rng.int(0, 3);
        const step = proof[i]!;
        const askStatement = step.alts.length > 0 && rng.bool(0.4);
        const pool = Object.values(proofReasons).filter((x) => x !== step.r);
        const options = askStatement ? [step.s, ...step.alts] : [step.r, ...rng.sample(pool, 3)];
        const shuffled = rng.shuffle(options);
        const line = (lang: "en" | "zh-CN", p: ProofStep, j: number) =>
          `${j + 1}. ${askStatement && j === i ? "**?**" : p.s[lang]} —— ${!askStatement && j === i ? "**?**" : p.r[lang]}`;
        const list = (lang: "en" | "zh-CN") => proof.map((p, j) => line(lang, p, j)).join("\n");
        return choiceProblem({
          prompt: t(
            `**Given:** circle $A$ with center $A$ and radius $${r}$, circle $B$ with center $B$ and radius $${s}$.\n\n**Prove:** circle $A$ is similar to circle $B$.\n\n${list("en")}\n\n${askStatement ? `Which statement belongs in step ${i + 1}?` : `Which reason justifies step ${i + 1}?`}`,
            `**已知：** 圆 $A$ 圆心为 $A$、半径为 $${r}$，圆 $B$ 圆心为 $B$、半径为 $${s}$。\n\n**求证：** 圆 $A$ 与圆 $B$ 相似。\n\n${list("zh-CN")}\n\n${askStatement ? `第 ${i + 1} 步应填哪个结论？` : `第 ${i + 1} 步的理由是什么？`}`,
          ),
          options: shuffled,
          correct: shuffled.indexOf(options[0]!),
          solution: t(`Step ${i + 1}: ${step.s.en} Reason: ${step.r.en}.`, `第 ${i + 1} 步：${step.s["zh-CN"]}理由：${step.r["zh-CN"]}。`),
        });
      },
    },
  ],
};

/** circleTheoremTopics are the topics of the circle theorems module of Geometry, in teaching order. */
export const circleTheoremTopics: readonly TopicDef[] = [
  inscribedAngles,
  problemSolvingWithInscribedAngles,
  thalesTheorem,
  anglesInInscribedRightTriangles,
  furtherAnglesInInscribedRightTriangles,
  inscribedQuadrilaterals,
  tangentLinesToCircles,
  tangentTangentLinesToCircles,
  secantSecantAnglesToCircles,
  secantTangentAnglesToCircles,
  theTangentChordTheorem,
  circleSimilarity,
  provingCircleSimilarity,
];
