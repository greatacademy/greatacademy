import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, linear, type Mark, type Point, plane, type Q, q, sketch, type Tone } from "@ga/subject-math";
import { theoremDrawings } from "../explanation-drawings-circles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { choiceProblem, numberProblem, pointProblem, steps, yesNo } from "../problems.ts";
import { chain, tail } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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

/** arcAt highlights the arc from angle a counterclockwise to angle b, in the accent color or in a tone. */
function arcAt(a: number, b: number, tone?: Tone): Mark[] {
  const pts = arcPoints(a, b);
  return pts.slice(1).map((p, i): Mark => ({ kind: "segment", a: pts[i]!, b: p, accent: true, ...(tone && { tone }) }));
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

const seg = (a: Point, b: Point, tone?: Tone): Mark => ({ kind: "segment", a, b, ...(tone && { tone }) });

/** angleAt marks the angle at vertex between the rays to from and to, in the accent color or in a tone, with an optional label. */
const angleAt = (vertex: Point, from: Point, to: Point, label?: string, tone?: Tone): Mark => ({
  kind: "arc",
  vertex,
  from,
  to,
  accent: true,
  ...(label && { label }),
  ...(tone && { tone }),
});

/** rightAt marks a right angle at vertex. */
const rightAt = (vertex: Point, from: Point, to: Point): Mark => ({ kind: "right", vertex, from, to });

/** tick marks the segment ab with count strokes, for equal lengths. */
const tick = (a: Point, b: Point, count = 1): Mark => ({ kind: "ticks", a, b, count });

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

/** evalLinear writes cx + d at a value of x: "3 \cdot 7 - 4 = 17", "x + 5 = 12", or just "9" for x alone. */
const evalLinear = (c: number, d: number, x: number) => chain(`${c === 1 ? x : `${c} \\cdot ${x}`}${tail(d)}`, String(c * x + d));

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

/** collect says in each locale how a linear equation is solved: like terms to one side, then divide. */
const collect = t(
  "Collect the $x$-terms on one side and the numbers on the other, then divide by the coefficient of $x$:",
  "把含 $x$ 的项移到一边、常数移到另一边，再除以 $x$ 的系数：",
);

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
  /** baseAngle draws the chord AB and marks the angle OAB with this label. */
  readonly baseAngle?: string;
  /** both marks the angle OBA too, with the same label, and ticks the equal radii OA and OB. */
  readonly both?: boolean;
  /** tones colors the inscribed angle, the arc, the central angle and the base angles. */
  readonly tones?: { readonly angle?: Tone; readonly arc?: Tone; readonly central?: Tone; readonly base?: Tone };
}

/** inscribedMarks draws a circle with A at s, B at s + m, C on the major arc at fraction f of it, the chords CA and CB, and the angle at C. */
function inscribedMarks(s: number, m: number, f: number, o: InscribedOpts): Mark[] {
  const c = s + m + (360 - m) * f;
  const [pa, pb, pc] = [on(s), on(s + m), on(c)];
  const tones = o.tones ?? {};
  const marks: Mark[] = [circleAt(), seg(pc, pa), seg(pc, pb), angleAt(pc, pa, pb, o.angle, tones.angle)];
  if (o.arc !== undefined) marks.push(...arcAt(s, s + m, tones.arc), arcText(s, s + m, o.arc));
  if (o.central !== undefined)
    marks.push(seg(O, pa), seg(O, pb), angleAt(O, pa, pb, o.central || undefined, tones.central), ...center(dirOf(s + m / 2 + 180)));
  if (o.baseAngle !== undefined) {
    marks.push(seg(pa, pb), angleAt(pa, pb, O, o.baseAngle, tones.base));
    if (o.both) marks.push(angleAt(pb, pa, O, o.baseAngle, tones.base), tick(O, pa), tick(O, pb));
  }
  marks.push(
    ...pointsAt([
      [s, "A"],
      [s + m, "B"],
      [c, "C"],
    ]),
  );
  return marks;
}

/** inscribedIntro draws the case of the inscribed angle theorem in which the chord CA passes through the center: arc AB of 80°, the central angle of 80°, and the equal angles x of the isosceles triangle OCB. */
const inscribedIntro: Figure = (() => {
  const [a, b, c] = [250, 330, 70];
  const [pa, pb, pc] = [on(a), on(b), on(c)];
  return figure(
    [
      circleAt(),
      ...arcAt(a, b),
      arcText(a, b, "80°"),
      seg(pc, pa),
      seg(pc, pb),
      seg(O, pb),
      tick(O, pc),
      tick(O, pb),
      angleAt(O, pa, pb, "80°", "action"),
      angleAt(pc, O, pb, "x", "result"),
      angleAt(pb, pc, O, "x", "result"),
      ...center("w"),
      ...pointsAt([
        [a, "A"],
        [b, "B"],
        [c, "C"],
      ]),
    ],
    "A circle with center O. The chord CA passes through O, and arc AB is 80°, so the central angle AOB is 80°. The radii OC and OB are equal, so triangle OCB has two equal angles x, at C and at B.",
    "圆心为 O 的圆。弦 CA 经过 O，弧 AB 是 80°，所以圆心角 AOB 是 80°。半径 OC 与 OB 相等，所以三角形 OCB 在 C、B 处有两个相等的角 x。",
  );
})();

export const inscribedAngles: TopicDef = {
  id: "inscribed-angles",
  title: t("Inscribed Angles", "圆周角"),
  summary: t(
    "Use the inscribed angle theorem: an inscribed angle is half its intercepted arc, and inscribed angles on the same arc are equal.",
    "运用圆周角定理：圆周角等于它所对弧的度数的一半，同弧所对的圆周角相等。",
  ),
  prerequisites: ["central-angles-and-arcs", "isosceles-triangles"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `A central angle has its vertex at the center $O$, and it measures its arc exactly: an arc of $80^\\circ$ has a central angle of $80^\\circ$. Now put the vertex on the circle instead. An angle whose vertex $C$ is on the circle and whose sides are chords is an **inscribed angle**. How big is it, compared with the arc it opens onto?

Take arc $${arcTex("AB")}$ of $80^\\circ$, and place $C$ so that the chord $CA$ passes through the center:

{{figure 0}}

The radii $OC$ and $OB$ are equal, so triangle $OCB$ is isosceles, and its angles at $C$ and $B$ are equal; call each $x$. The central angle $\\angle AOB$ is an exterior angle of that triangle, so it is the sum of the two angles at $C$ and $B$:

$$80^\\circ = x + x, \\qquad\\text{so}\\qquad x = 40^\\circ.$$

The inscribed angle $\\angle ACB$ is $40^\\circ$, **half** of the $80^\\circ$ arc. If $C$ sits elsewhere, the diameter through $C$ splits the angle into two pieces of this kind, and the halves add up the same way. In this lesson we find an inscribed angle from its arc, an arc from its inscribed angle, and see why two inscribed angles on the same arc are equal.`,
    `圆心角的顶点在圆心 $O$，它的度数恰好等于所对的弧：$80^\\circ$ 的弧，圆心角就是 $80^\\circ$。现在把顶点移到圆上。顶点 $C$ 在圆上、两边都是弦的角叫**圆周角**。和它所对的弧相比，它有多大？

取 $80^\\circ$ 的弧 $${arcTex("AB")}$，并让 $C$ 的位置使弦 $CA$ 经过圆心：

{{figure 0}}

半径 $OC$ 与 $OB$ 相等，所以 $\\triangle OCB$ 是等腰三角形，$C$、$B$ 处的两个角相等，都记作 $x$。圆心角 $\\angle AOB$ 是这个三角形的外角，等于 $C$、$B$ 处两个角之和：

$$80^\\circ = x + x, \\qquad\\text{所以}\\qquad x = 40^\\circ.$$

圆周角 $\\angle ACB$ 是 $40^\\circ$，正好是 $80^\\circ$ 弧的**一半**。$C$ 在别的位置时，过 $C$ 的直径把这个角分成两个同样类型的部分，两个“一半”相加，结论不变。这节课我们由弧求圆周角，由圆周角求弧，并说明同一段弧所对的两个圆周角为什么相等。`,
  ),
  introFigures: [inscribedIntro],
  knowledgePoints: [
    {
      id: "inscribed-angle-from-the-arc",
      figure: theoremDrawings["inscribed-angle-from-the-arc"],
      title: t("The inscribed angle theorem", "圆周角定理"),
      explanation: t(
        `An **inscribed angle** has its vertex on the circle, and its sides are chords. The arc that lies inside the angle, between the far ends of the two chords, is its **intercepted arc**.

**Inscribed angle theorem.** An inscribed angle is half its intercepted arc, and so half the central angle on the same arc:

$$\\angle ACB = \\tfrac{1}{2}\\, m${arcTex("AB")} = \\tfrac{1}{2}\\angle AOB.$$

The central angle measures the arc exactly; the inscribed angle looks at the same arc from a point on the far side of the circle and opens only half as wide. The proof draws the diameter through $C$: it cuts the figure into isosceles triangles, two of whose sides are radii, and in each one the exterior angle at $O$ is the sum of the two equal base angles, twice one of them.

For arc $${arcTex("AB")}$ of $110^\\circ$:

$$\\angle ACB = \\frac{110^\\circ}{2} = 55^\\circ,$$

and the central angle $\\angle AOB$ on the same arc is $110^\\circ$, twice the inscribed angle.

> **Watch out.** An inscribed angle is not equal to its arc: that is true of the central angle, whose vertex is at the center. Halve the arc instead of doubling it, and do not subtract it from $180^\\circ$: an inscribed angle and its arc are not supplementary.`,
        `顶点在圆上、两边都是弦的角叫**圆周角**。角内部、两条弦另一端之间的那段弧叫它**所对的弧**。

**圆周角定理**：圆周角等于它所对弧的一半，因此也等于同弧所对圆心角的一半：

$$\\angle ACB = \\tfrac{1}{2}\\, m${arcTex("AB")} = \\tfrac{1}{2}\\angle AOB.$$

圆心角恰好度量它所对的弧；圆周角从圆的另一侧的一点看同一段弧，只张开一半那么大。证明时过 $C$ 作直径：它把图形分成几个等腰三角形（两腰都是半径），每个三角形在 $O$ 处的外角等于两个相等底角之和，也就是一个底角的两倍。

弧 $${arcTex("AB")}$ 为 $110^\\circ$ 时：

$$\\angle ACB = \\frac{110^\\circ}{2} = 55^\\circ,$$

同弧所对的圆心角 $\\angle AOB$ 是 $110^\\circ$，是圆周角的两倍。

> **注意。** 圆周角不等于它所对的弧，等于弧的是顶点在圆心的圆心角。要把弧除以 $2$，不要乘以 $2$，也不要用 $180^\\circ$ 去减：圆周角与它所对的弧并不互补。`,
      ),
      generate(rng) {
        const m = 2 * rng.int(20, 80);
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        const useCentral = rng.bool();
        const ans = m / 2;
        const arcFrom = useCentral
          ? t(
              `The central angle on that arc is given, $\\angle AOB = ${m}^\\circ$, and a central angle measures its arc, so $m${arcTex("AB")} = ${m}^\\circ$.`,
              `已知这段弧所对的圆心角 $\\angle AOB = ${m}^\\circ$，圆心角等于它所对的弧，所以 $m${arcTex("AB")} = ${m}^\\circ$。`,
            )
          : t(`That arc is given: $m${arcTex("AB")} = ${m}^\\circ$.`, `这段弧已知：$m${arcTex("AB")} = ${m}^\\circ$。`);
        return {
          ...numberProblem({
            prompt: useCentral
              ? t("$O$ is the center of the circle. Find $\\angle ACB$.", "$O$ 是圆心。求 $\\angle ACB$。")
              : t("Find the inscribed angle $\\angle ACB$.", "求圆周角 $\\angle ACB$。"),
            answer: ans,
            unit: "°",
            wrong: [m, 2 * m, 180 - m],
            solution: t(
              `**Step 1: find the intercepted arc.** The vertex $C$ is on the circle and the sides $CA$ and $CB$ are chords, so $\\angle ACB$ is an inscribed angle. It intercepts arc $${arcTex("AB")}$, the arc between $A$ and $B$ on the side away from $C$. ${arcFrom.en}

**Step 2: halve it.** An inscribed angle is half its intercepted arc:${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${ans}^\\circ`)}{{figure 0}}

**Check.** Doubling the answer gives back the arc: $2 \\cdot ${ans}^\\circ = ${m}^\\circ$. And arc $${arcTex("AB")}$ is less than a semicircle, so the angle at $C$ must be acute, as $${ans}^\\circ$ is.`,
              `**第一步：找出所对的弧。** 顶点 $C$ 在圆上，两边 $CA$、$CB$ 都是弦，所以 $\\angle ACB$ 是圆周角。它所对的弧是 $${arcTex("AB")}$，即 $A$、$B$ 之间不含 $C$ 的那段弧。${arcFrom["zh-CN"]}

**第二步：取一半。** 圆周角等于它所对弧的一半：${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${ans}^\\circ`)}{{figure 0}}

**检验。** 把答案乘以 $2$ 又得到这段弧：$2 \\cdot ${ans}^\\circ = ${m}^\\circ$。弧 $${arcTex("AB")}$ 小于半圆，所以 $C$ 处的角应是锐角，$${ans}^\\circ$ 确实是锐角。`,
            ),
          }),
          figure: figure(
            inscribedMarks(s, m, f, useCentral ? { central: deg(m) } : { arc: deg(m) }),
            useCentral
              ? `Circle O with points A, B and C on it, chords CA and CB, and the central angle AOB of ${m}°.`
              : `A circle with points A, B and C on it, chords CA and CB, and arc AB of ${m}°.`,
            useCentral ? `圆 O 上有点 A、B、C，画有弦 CA、CB，圆心角 AOB 为 ${m}°。` : `圆上有点 A、B、C，画有弦 CA、CB，弧 AB 为 ${m}°。`,
          ),
          solutionFigures: [
            figure(
              inscribedMarks(s, m, f, {
                angle: deg(ans),
                arc: deg(m),
                ...(useCentral && { central: deg(m) }),
                tones: { angle: "result" },
              }),
              `Arc AB of ${m}° and the inscribed angle ACB on it, ${ans}°: half the arc.`,
              `弧 AB 为 ${m}°，它所对的圆周角 ACB 为 ${ans}°，是弧的一半。`,
            ),
          ],
        };
      },
    },
    {
      id: "intercepted-arc-from-the-angle",
      figure: theoremDrawings["intercepted-arc-from-the-angle"],
      title: t("The arc from the inscribed angle", "由圆周角求弧"),
      explanation: t(
        `Read backward, the theorem says that the intercepted arc is **twice** the inscribed angle, and so is the central angle on the same arc:

$$m${arcTex("AB")} = \\angle AOB = 2\\angle ACB.$$

It is the same fact solved for the arc: if half the arc is the angle, the whole arc is two of the angle. With $\\angle ACB = 38^\\circ$:

$$m${arcTex("AB")} = 2 \\cdot 38^\\circ = 76^\\circ,$$

and the central angle $\\angle AOB$ is $76^\\circ$ too, since a central angle measures its arc.

> **Watch out.** Going from the angle to the arc, multiply by $2$: halving $38^\\circ$ to $19^\\circ$ uses the theorem backward. The arc asked for is the one inside the angle, between $A$ and $B$; the rest of the circle, $360^\\circ - 76^\\circ = 284^\\circ$, is the other arc.`,
        `反过来读，定理说的是：所对的弧是圆周角的**两倍**，同弧所对的圆心角也是：

$$m${arcTex("AB")} = \\angle AOB = 2\\angle ACB.$$

这是同一个事实，只是解出了弧：既然弧的一半是这个角，整段弧就是两个这样的角。若 $\\angle ACB = 38^\\circ$：

$$m${arcTex("AB")} = 2 \\cdot 38^\\circ = 76^\\circ,$$

圆心角 $\\angle AOB$ 也是 $76^\\circ$，因为圆心角等于它所对的弧。

> **注意。** 由角求弧要乘以 $2$：把 $38^\\circ$ 除以 $2$ 得 $19^\\circ$，是把定理用反了。所求的是角内部、$A$ 与 $B$ 之间的那段弧；圆的其余部分 $360^\\circ - 76^\\circ = 284^\\circ$ 是另一段弧。`,
      ),
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        const useCentral = rng.bool();
        const target = useCentral ? "\\angle AOB" : `m${arcTex("AB")}`;
        const last = useCentral
          ? t(
              `

**Step 2: the central angle.** A central angle measures its arc, so $\\angle AOB = m${arcTex("AB")} = ${m}^\\circ$.`,
              `

**第二步：圆心角。** 圆心角等于它所对的弧，所以 $\\angle AOB = m${arcTex("AB")} = ${m}^\\circ$。`,
            )
          : t("", "");
        return {
          ...numberProblem({
            prompt: useCentral
              ? t("$O$ is the center of the circle. Find the central angle $\\angle AOB$.", "$O$ 是圆心。求圆心角 $\\angle AOB$。")
              : t(`Find the measure of arc $${arcTex("AB")}$.`, `求弧 $${arcTex("AB")}$ 的度数。`),
            answer: m,
            unit: "°",
            wrong: [theta, q(theta, 2), 360 - m],
            solution: t(
              `**Step 1: the arc.** $\\angle ACB = ${theta}^\\circ$ has its vertex on the circle, so it is an inscribed angle, and it intercepts arc $${arcTex("AB")}$. The angle is half the arc, so the arc is twice the angle:${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}${last.en}

{{figure 0}}

**Check.** Half of $${m}^\\circ$ is $${theta}^\\circ$, the given angle. The angle at $C$ is acute, so its arc must be less than a semicircle, and $${target} = ${m}^\\circ$ is less than $180^\\circ$.`,
              `**第一步：求弧。** $\\angle ACB = ${theta}^\\circ$ 的顶点在圆上，是圆周角，它所对的弧是 $${arcTex("AB")}$。角是弧的一半，所以弧是角的两倍：${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}${last["zh-CN"]}

{{figure 0}}

**检验。** $${m}^\\circ$ 的一半是 $${theta}^\\circ$，正是已知的角。$C$ 处的角是锐角，所以它所对的弧应小于半圆，$${target} = ${m}^\\circ$ 确实小于 $180^\\circ$。`,
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
          solutionFigures: [
            figure(
              inscribedMarks(s, m, f, {
                angle: deg(theta),
                arc: deg(m),
                ...(useCentral && { central: deg(m) }),
                tones: { arc: "result", central: "result" },
              }),
              useCentral
                ? `The inscribed angle ACB of ${theta}° and, on the same arc AB of ${m}°, the central angle AOB of ${m}°.`
                : `The inscribed angle ACB of ${theta}° intercepts arc AB of ${m}°, twice the angle.`,
              useCentral
                ? `圆周角 ACB 为 ${theta}°；同一段 ${m}° 的弧 AB 上，圆心角 AOB 为 ${m}°。`
                : `${theta}° 的圆周角 ACB 所对的弧 AB 为 ${m}°，是角的两倍。`,
            ),
          ],
        };
      },
    },
    {
      id: "inscribed-angles-on-the-same-arc",
      figure: theoremDrawings["inscribed-angles-on-the-same-arc"],
      title: t("Inscribed angles on the same arc", "同弧所对的圆周角"),
      explanation: t(
        `Two inscribed angles that intercept the same arc are both half of that arc, so they are **equal**. In the figure, $C$ and $D$ are on the same side of chord $AB$, and both angles open onto arc $${arcTex("AB")}$:

$$\\angle ACB = \\angle ADB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$

Where the vertex sits on that side does not matter: slide $C$ along the circle and the angle stays the same, as long as it keeps intercepting arc $${arcTex("AB")}$.

When the angles are written with a variable, set them equal. With $\\angle ACB = (2x + 10)^\\circ$ and $\\angle ADB = (3x - 15)^\\circ$:

$$2x + 10 = 3x - 15, \\qquad\\text{so}\\qquad x = 25,$$

and each angle is $2 \\cdot 25 + 10 = 60^\\circ$, which is also $3 \\cdot 25 - 15 = 60^\\circ$.

> **Watch out.** The two angles are equal, not supplementary: setting their sum to $180^\\circ$ solves a different problem. They equal each other, not the arc, so neither one is doubled. Angles on opposite sides of the chord intercept different arcs, and those are the ones that add to $180^\\circ$.`,
        `同一段弧所对的两个圆周角都等于这段弧的一半，所以它们**相等**。图中 $C$、$D$ 在弦 $AB$ 的同侧，两个角都对着弧 $${arcTex("AB")}$：

$$\\angle ACB = \\angle ADB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$

顶点在这一侧的什么位置都没有关系：让 $C$ 沿圆移动，只要它对着的仍是弧 $${arcTex("AB")}$，角的大小就不变。

两个角用含变量的式子表示时，就令它们相等。若 $\\angle ACB = (2x + 10)^\\circ$，$\\angle ADB = (3x - 15)^\\circ$：

$$2x + 10 = 3x - 15, \\qquad\\text{所以}\\qquad x = 25,$$

每个角都是 $2 \\cdot 25 + 10 = 60^\\circ$，也就是 $3 \\cdot 25 - 15 = 60^\\circ$。

> **注意。** 这两个角相等，而不是互补：令它们的和为 $180^\\circ$ 解的是另一道题。它们彼此相等，并不等于弧，所以哪个都不用乘以 $2$。在弦的两侧的圆周角对着不同的弧，和为 $180^\\circ$ 的是那样的两个角。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const theta = rng.int(20, 80);
        const m = 2 * theta;
        const s = rng.int(0, 359);
        const [cAt, dAt] = [s + m + (360 - m) * fraction(rng, 15, 40), s + m + (360 - m) * fraction(rng, 60, 85)];
        const [pa, pb, pc, pd] = [on(s), on(s + m), on(cAt), on(dAt)];
        const marks = (lc: string, ld: string, arc?: string, tc?: Tone, td?: Tone): Mark[] => [
          circleAt(),
          ...arcAt(s, s + m),
          ...(arc ? [arcText(s, s + m, arc)] : []),
          seg(pc, pa),
          seg(pc, pb),
          seg(pd, pa),
          seg(pd, pb),
          angleAt(pc, pa, pb, lc, tc),
          angleAt(pd, pa, pb, ld, td),
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
                `**Step 1: the arc.** $C$ and $D$ are on the circle on the same side of chord $AB$, so $\\angle ACB$ and $\\angle ADB$ both intercept arc $${arcTex("AB")}$. The given angle is half that arc:${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}**Step 2: the other angle.** $\\angle ADB$ is half of the same arc:${steps(`\\angle ADB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**Check.** The two angles came out equal, as two inscribed angles on one arc must, and doubling either one gives back arc $${arcTex("AB")}$ of $${m}^\\circ$.`,
                `**第一步：求弧。** $C$、$D$ 在圆上，且在弦 $AB$ 的同侧，所以 $\\angle ACB$ 与 $\\angle ADB$ 都对着弧 $${arcTex("AB")}$。已知的角是这段弧的一半：${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}**第二步：求另一个角。** $\\angle ADB$ 也是这段弧的一半：${steps(`\\angle ADB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**检验。** 两个角相等，正如同弧所对的两个圆周角应当相等；把任何一个乘以 $2$，都得到弧 $${arcTex("AB")}$ 的 $${m}^\\circ$。`,
              ),
            }),
            figure: figure(
              marks(deg(theta), "?"),
              `A circle with points A, B, C and D on it; angles ACB and ADB both intercept arc AB, and angle ACB is ${theta}°.`,
              `圆上有点 A、B、C、D；角 ACB 和角 ADB 都对着弧 AB，角 ACB 为 ${theta}°。`,
            ),
            solutionFigures: [
              figure(
                marks(deg(theta), deg(theta), deg(m), undefined, "result"),
                `Arc AB of ${m}°: the inscribed angles ACB and ADB on it are both ${theta}°.`,
                `弧 AB 为 ${m}°：它所对的圆周角 ACB 和 ADB 都是 ${theta}°。`,
              ),
            ],
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
              `**Step 1: set the angles equal.** $C$ and $D$ are on the same side of chord $AB$, so both angles intercept arc $${arcTex("AB")}$. Each is half of that arc, so they are equal:${steps(`${angleTex(c1, d1)} = ${angleTex(c2, d2)}`)}**Step 2: solve.** ${collect.en}${solveLinear(c1, d1, c2, d2)}{{figure 0}}

**Check.** With $x = ${x}$: $\\angle ACB = ${evalLinear(c1, d1, x)}^\\circ$ and $\\angle ADB = ${evalLinear(c2, d2, x)}^\\circ$. The angles are equal, as they must be, and both are half of arc $${arcTex("AB")}$ of $${m}^\\circ$.`,
              `**第一步：令两角相等。** $C$、$D$ 在弦 $AB$ 的同侧，所以两个角都对着弧 $${arcTex("AB")}$。它们都是这段弧的一半，所以相等：${steps(`${angleTex(c1, d1)} = ${angleTex(c2, d2)}`)}**第二步：解方程。** ${collect["zh-CN"]}${solveLinear(c1, d1, c2, d2)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$\\angle ACB = ${evalLinear(c1, d1, x)}^\\circ$，$\\angle ADB = ${evalLinear(c2, d2, x)}^\\circ$。两角相等，符合要求，并且都是 $${m}^\\circ$ 的弧 $${arcTex("AB")}$ 的一半。`,
            ),
          }),
          figure: figure(
            marks(angleLabel(c1, d1), angleLabel(c2, d2)),
            `A circle with points A, B, C and D on it; angle ACB is ${angleLabel(c1, d1)} and angle ADB is ${angleLabel(c2, d2)}.`,
            `圆上有点 A、B、C、D；角 ACB 为 ${angleLabel(c1, d1)}，角 ADB 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              marks(deg(theta), deg(theta), deg(m), "result", "result"),
              `With x = ${x}, both inscribed angles on arc AB are ${theta}°, half of the ${m}° arc.`,
              `x = ${x} 时，弧 AB 所对的两个圆周角都是 ${theta}°，是 ${m}° 弧的一半。`,
            ),
          ],
        };
      },
    },
  ],
};

/** inscribedTriangleIntro draws triangle ABC inscribed in a circle with arcs AB of 80°, BC of 130° and CA of 150°, and its angles of 40°, 65° and 75°. */
const inscribedTriangleIntro: Figure = (() => {
  const [a, b, c] = [210, 290, 60];
  const [pa, pb, pc] = [on(a), on(b), on(c)];
  return figure(
    [
      circleAt(),
      { kind: "polygon", points: [pa, pb, pc] },
      arcText(a, b, "80°"),
      arcText(b, c, "130°"),
      arcText(c, a + 360, "150°"),
      angleAt(pc, pa, pb, "40°", "result"),
      angleAt(pa, pb, pc, "65°", "result"),
      angleAt(pb, pc, pa, "75°", "result"),
      ...pointsAt([
        [a, "A"],
        [b, "B"],
        [c, "C"],
      ]),
    ],
    "Triangle ABC inscribed in a circle, with arcs AB of 80°, BC of 130° and CA of 150°. Each angle is half the arc opposite it: 40° at C, 65° at A and 75° at B.",
    "内接于圆的三角形 ABC，弧 AB 为 80°，弧 BC 为 130°，弧 CA 为 150°。每个角是它对面弧的一半：C 处 40°，A 处 65°，B 处 75°。",
  );
})();

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
    { topic: "isosceles-triangles", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `An inscribed angle is half the arc it intercepts. That one rule is enough for figures with many angles, because every inscribed angle can be traced to its own arc.

When a triangle is **inscribed** in a circle, its three vertices cut the circle into three arcs, and each angle of the triangle opens onto the arc on the far side, between the other two vertices. Take arcs of $80^\\circ$, $130^\\circ$ and $150^\\circ$:

{{figure 0}}

Halving each arc gives the angle opposite it: $40^\\circ$, $65^\\circ$ and $75^\\circ$. The three arcs make the whole circle, $80^\\circ + 130^\\circ + 150^\\circ = 360^\\circ$, so the three angles add to half of that,

$$40^\\circ + 65^\\circ + 75^\\circ = 180^\\circ,$$

just as the angles of any triangle must. The theorem and the angle sum agree, and each can check the other. In this lesson we find the angles of inscribed triangles, solve for an unknown when an angle and its arc are expressions, and bring in the radii, which make isosceles triangles.`,
    `圆周角等于它所对弧的一半。只凭这一条，就能处理有很多角的图形，因为每个圆周角都能追溯到它自己的弧。

三角形**内接**于圆时，三个顶点把圆分成三段弧，三角形的每个角都对着对面、另外两个顶点之间的那段弧。取三段弧分别为 $80^\\circ$、$130^\\circ$、$150^\\circ$：

{{figure 0}}

把每段弧取一半，就得到它对面的角：$40^\\circ$、$65^\\circ$、$75^\\circ$。三段弧合起来是整个圆，$80^\\circ + 130^\\circ + 150^\\circ = 360^\\circ$，所以三个角之和是它的一半，

$$40^\\circ + 65^\\circ + 75^\\circ = 180^\\circ,$$

正如任何三角形的内角和一样。定理与内角和是一致的，可以互相检验。这节课我们求圆内接三角形的角，在角和弧都用式子表示时求未知数，再引入半径，它们会构成等腰三角形。`,
  ),
  introFigures: [inscribedTriangleIntro],
  knowledgePoints: [
    {
      id: "angles-of-an-inscribed-triangle",
      figure: theoremDrawings["angles-of-an-inscribed-triangle"],
      title: t("Angles of an inscribed triangle", "圆内接三角形的角"),
      explanation: t(
        `The vertices of an inscribed triangle split the circle into three arcs that add to $360^\\circ$. Each angle of the triangle is an inscribed angle, and it intercepts the arc **opposite** it, the one between the other two vertices: $\\angle C$ opens onto arc $${arcTex("AB")}$, $\\angle A$ onto arc $${arcTex("BC")}$ and $\\angle B$ onto arc $${arcTex("CA")}$.

If $m${arcTex("AB")} = 100^\\circ$ and $m${arcTex("BC")} = 140^\\circ$, the third arc is what is left of the circle:

$$m${arcTex("CA")} = 360^\\circ - 100^\\circ - 140^\\circ = 120^\\circ.$$

Halving each arc gives the angle opposite it:

$$\\angle C = 50^\\circ, \\quad \\angle A = 70^\\circ, \\quad \\angle B = 60^\\circ,$$

which add to $180^\\circ$ as they should.

> **Watch out.** An angle of the triangle does not intercept an arc that ends at its own vertex: $\\angle C$ goes with arc $${arcTex("AB")}$, not with $${arcTex("BC")}$ or $${arcTex("CA")}$. And it is half of that arc, not the whole arc, and not $180^\\circ$ minus it.`,
        `圆内接三角形的三个顶点把圆分成三段弧，和为 $360^\\circ$。三角形的每个角都是圆周角，它对着它**对面**的那段弧，即另外两个顶点之间的弧：$\\angle C$ 对着弧 $${arcTex("AB")}$，$\\angle A$ 对着弧 $${arcTex("BC")}$，$\\angle B$ 对着弧 $${arcTex("CA")}$。

若 $m${arcTex("AB")} = 100^\\circ$，$m${arcTex("BC")} = 140^\\circ$，第三段弧就是圆剩下的部分：

$$m${arcTex("CA")} = 360^\\circ - 100^\\circ - 140^\\circ = 120^\\circ.$$

每段弧取一半，就是它对面的角：

$$\\angle C = 50^\\circ, \\quad \\angle A = 70^\\circ, \\quad \\angle B = 60^\\circ,$$

三个角之和正好是 $180^\\circ$。

> **注意。** 三角形的角不对着以自己的顶点为端点的弧：$\\angle C$ 对应弧 $${arcTex("AB")}$，而不是 $${arcTex("BC")}$ 或 $${arcTex("CA")}$。它是那段弧的一半，不是整段弧，也不是 $180^\\circ$ 减去它。`,
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
        const mark = (label: string, tone?: Tone) =>
          [angleAt(pc, pa, pb, label, tone), angleAt(pa, pb, pc, label, tone), angleAt(pb, pc, pa, label, tone)][ask]!;
        const wrong = [
          [a, b / 2, 180 - a],
          [b, a / 2, 180 - b],
          [c, (a + b) / 2, a / 2],
        ][ask]!;
        const arcName = ["AB", "BC", "CA"][ask]!;
        const arcValue = [a, b, c][ask]!;
        const arcSpan = [
          [s, s + a],
          [s + a, s + a + b],
          [s + a + b, s + 360],
        ][ask]!;
        const thirdLine = `m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`;
        const find =
          ask === 2
            ? t(
                ` That arc is not marked, but the three arcs make up the whole circle:${steps(thirdLine)}`,
                `这段弧没有标出，但三段弧合起来是整个圆：${steps(thirdLine)}`,
              )
            : t(` It is marked: $m${arcTex(arcName)} = ${arcValue}^\\circ$.`, `它已标出：$m${arcTex(arcName)} = ${arcValue}^\\circ$。`);
        const third = ask === 2 ? t(" So", "") : t(` The third arc is $${thirdLine}$, so`, `第三段弧 $${thirdLine}$，所以`);
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
              `**Step 1: find the opposite arc.** $\\angle ${vertex}$ is an inscribed angle, and it intercepts the arc between the other two vertices, arc $${arcTex(arcName)}$.${find.en}

**Step 2: halve it.** An inscribed angle is half its intercepted arc:${steps(`\\angle ${vertex} = \\frac{${arcValue}^\\circ}{2} = ${angle}^\\circ`)}{{figure 0}}

**Check.** Every angle of the triangle is half its opposite arc.${third.en} the three angles are $${a / 2}^\\circ$ at $C$, $${b / 2}^\\circ$ at $A$ and $${c / 2}^\\circ$ at $B$, and $${a / 2}^\\circ + ${b / 2}^\\circ + ${c / 2}^\\circ = 180^\\circ$, the angle sum of a triangle.`,
              `**第一步：找出对面的弧。** $\\angle ${vertex}$ 是圆周角，它对着另外两个顶点之间的弧，即弧 $${arcTex(arcName)}$。${find["zh-CN"]}

**第二步：取一半。** 圆周角等于它所对弧的一半：${steps(`\\angle ${vertex} = \\frac{${arcValue}^\\circ}{2} = ${angle}^\\circ`)}{{figure 0}}

**检验。** 三角形的每个角都是对面弧的一半。${third["zh-CN"]}三个角分别是 $C$ 处 $${a / 2}^\\circ$、$A$ 处 $${b / 2}^\\circ$、$B$ 处 $${c / 2}^\\circ$，而 $${a / 2}^\\circ + ${b / 2}^\\circ + ${c / 2}^\\circ = 180^\\circ$，正是三角形的内角和。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              { kind: "polygon", points: [pa, pb, pc] },
              mark("?"),
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
          solutionFigures: [
            figure(
              [
                circleAt(),
                ...arcAt(arcSpan[0]!, arcSpan[1]!),
                { kind: "polygon", points: [pa, pb, pc] },
                mark(deg(angle), "result"),
                arcText(s, s + a, deg(a)),
                arcText(s + a, s + a + b, deg(b)),
                arcText(s + a + b, s + 360, deg(c)),
                ...pointsAt([
                  [s, "A"],
                  [s + a, "B"],
                  [s + a + b, "C"],
                ]),
              ],
              `Angle ${vertex} of ${angle}° opens onto the opposite arc ${arcName} of ${arcValue}°; the arcs are ${a}°, ${b}° and ${c}°.`,
              `角 ${vertex} 为 ${angle}°，对着对面的弧 ${arcName}（${arcValue}°）；三段弧分别为 ${a}°、${b}°、${c}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "inscribed-angles-with-algebra",
      figure: theoremDrawings["inscribed-angles-with-algebra"],
      title: t("Inscribed angles with algebra", "含未知数的圆周角"),
      explanation: t(
        `When an inscribed angle and its arc are written with a variable, the theorem turns into an equation. The arc is twice the angle, so the factor $2$ goes on the **angle's** side:

$$2 \\cdot (\\text{inscribed angle}) = \\text{intercepted arc}.$$

If $\\angle ACB = (x + 12)^\\circ$ and $m${arcTex("AB")} = (3x + 4)^\\circ$, then

$$2(x + 12) = 3x + 4, \\qquad 2x + 24 = 3x + 4, \\qquad x = 20.$$

The angle is then $20 + 12 = 32^\\circ$ and the arc $3 \\cdot 20 + 4 = 64^\\circ$, twice as much, as the theorem says.

> **Watch out.** Setting the angle equal to the arc, $x + 12 = 3x + 4$, forgets the factor $2$; doubling the arc instead of the angle puts it on the wrong side. When distributing, multiply both terms: $2(x + 12) = 2x + 24$, not $2x + 12$.`,
        `圆周角和它所对的弧都用含变量的式子表示时，定理就变成一个方程。弧是角的两倍，所以因数 $2$ 要乘在**角**的一边：

$$2 \\cdot (\\text{圆周角}) = \\text{所对的弧}.$$

若 $\\angle ACB = (x + 12)^\\circ$，$m${arcTex("AB")} = (3x + 4)^\\circ$，则

$$2(x + 12) = 3x + 4, \\qquad 2x + 24 = 3x + 4, \\qquad x = 20.$$

于是角是 $20 + 12 = 32^\\circ$，弧是 $3 \\cdot 20 + 4 = 64^\\circ$，恰好是角的两倍，与定理一致。

> **注意。** 令角等于弧，$x + 12 = 3x + 4$，就漏掉了因数 $2$；把弧乘以 $2$ 则是放错了边。去括号时两项都要乘：$2(x + 12) = 2x + 24$，不是 $2x + 12$。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        const theta = rng.int(20, 80);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, theta, x, 4);
        const [c2, d2] = expressionFor(rng, 2 * theta, x, 9, [2 * c1]);
        const s = rng.int(0, 359);
        const f = fraction(rng, 30, 70);
        const eq = `2(${linear(c1, d1)}) = ${linear(c2, d2)}`;
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), theta],
            solution: t(
              `**Step 1: write the equation.** $\\angle ACB$ is an inscribed angle on arc $${arcTex("AB")}$, and the arc is twice the angle:${steps(eq)}**Step 2: solve.** Distribute the $2$ over both terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**Check.** With $x = ${x}$, the angle is $${evalLinear(c1, d1, x)}^\\circ$ and the arc is $${evalLinear(c2, d2, x)}^\\circ$. The arc is twice the angle: $2 \\cdot ${theta}^\\circ = ${2 * theta}^\\circ$.`,
              `**第一步：列方程。** $\\angle ACB$ 是弧 $${arcTex("AB")}$ 所对的圆周角，弧是角的两倍：${steps(eq)}**第二步：解方程。** 先用 $2$ 乘括号里的两项，再${collect["zh-CN"]}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，角是 $${evalLinear(c1, d1, x)}^\\circ$，弧是 $${evalLinear(c2, d2, x)}^\\circ$。弧正是角的两倍：$2 \\cdot ${theta}^\\circ = ${2 * theta}^\\circ$。`,
            ),
          }),
          figure: figure(
            inscribedMarks(s, 2 * theta, f, { angle: angleLabel(c1, d1), arc: angleLabel(c2, d2) }),
            `A circle with points A, B and C on it; angle ACB is ${angleLabel(c1, d1)} and arc AB is ${angleLabel(c2, d2)}.`,
            `圆上有点 A、B、C；角 ACB 为 ${angleLabel(c1, d1)}，弧 AB 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              inscribedMarks(s, 2 * theta, f, { angle: deg(theta), arc: deg(2 * theta), tones: { angle: "result", arc: "result" } }),
              `With x = ${x}, angle ACB is ${theta}° and arc AB is ${2 * theta}°, twice the angle.`,
              `x = ${x} 时，角 ACB 为 ${theta}°，弧 AB 为 ${2 * theta}°，是角的两倍。`,
            ),
          ],
        };
      },
    },
    {
      id: "inscribed-angles-and-radii",
      figure: theoremDrawings["inscribed-angles-and-radii"],
      title: t("Inscribed angles and radii", "圆周角与半径"),
      explanation: t(
        `Radii drawn to the two ends of a chord make an **isosceles** triangle, since $OA = OB$, and its base angles $\\angle OAB$ and $\\angle OBA$ are equal. The angle at its apex $O$ is the central angle, which the inscribed angle theorem ties to the angle at $C$. So the two facts work together:

1. the central angle is twice the inscribed angle;
2. the two base angles share what is left of $180^\\circ$.

If $\\angle ACB = 35^\\circ$, the central angle is $\\angle AOB = 70^\\circ$, and

$$\\angle OAB = \\angle OBA = \\frac{180^\\circ - 70^\\circ}{2} = 55^\\circ.$$

In general the base angle is $\\frac{180^\\circ - 2\\angle ACB}{2} = 90^\\circ - \\angle ACB$: here $90^\\circ - 35^\\circ = 55^\\circ$.

> **Watch out.** After subtracting the central angle from $180^\\circ$, divide by $2$: the remainder is split between **two** base angles, so $180^\\circ - 70^\\circ = 110^\\circ$ is not one of them. And the inscribed angle at $C$ is not a base angle: $\\angle OAB$ is not $35^\\circ$.`,
        `连接弦两端的半径构成**等腰**三角形，因为 $OA = OB$，它的两个底角 $\\angle OAB$ 与 $\\angle OBA$ 相等。顶角 $O$ 处是圆心角，而圆周角定理把它和 $C$ 处的角联系起来。于是两个事实配合使用：

1. 圆心角是圆周角的两倍；
2. 两个底角平分 $180^\\circ$ 剩下的部分。

若 $\\angle ACB = 35^\\circ$，则圆心角 $\\angle AOB = 70^\\circ$，

$$\\angle OAB = \\angle OBA = \\frac{180^\\circ - 70^\\circ}{2} = 55^\\circ.$$

一般地，底角是 $\\frac{180^\\circ - 2\\angle ACB}{2} = 90^\\circ - \\angle ACB$：这里 $90^\\circ - 35^\\circ = 55^\\circ$。

> **注意。** 用 $180^\\circ$ 减去圆心角之后还要除以 $2$：剩下的部分由**两个**底角平分，所以 $180^\\circ - 70^\\circ = 110^\\circ$ 不是底角。$C$ 处的圆周角也不是底角：$\\angle OAB$ 不是 $35^\\circ$。`,
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
                `**Step 1: the central angle.** $\\angle ACB$ and the central angle $\\angle AOB$ are on the same arc $${arcTex("AB")}$, and the central angle is twice the inscribed one:${steps(`\\angle AOB = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**Step 2: the base angles.** $OA = OB$ because both are radii, so $\\triangle AOB$ is isosceles and $\\angle OAB = \\angle OBA$. The two share what is left of $180^\\circ$:${steps(`\\angle OAB = \\frac{180^\\circ - ${m}^\\circ}{2} = ${beta}^\\circ`)}{{figure 1}}

**Check.** The angles of $\\triangle AOB$ add up: $${beta}^\\circ + ${beta}^\\circ + ${m}^\\circ = 180^\\circ$. The shortcut gives the same base angle: $90^\\circ - ${theta}^\\circ = ${beta}^\\circ$.`,
                `**第一步：求圆心角。** $\\angle ACB$ 与圆心角 $\\angle AOB$ 对着同一段弧 $${arcTex("AB")}$，圆心角是圆周角的两倍：${steps(`\\angle AOB = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**第二步：求底角。** $OA = OB$（都是半径），所以 $\\triangle AOB$ 是等腰三角形，$\\angle OAB = \\angle OBA$。两个底角平分 $180^\\circ$ 剩下的部分：${steps(`\\angle OAB = \\frac{180^\\circ - ${m}^\\circ}{2} = ${beta}^\\circ`)}{{figure 1}}

**检验。** $\\triangle AOB$ 的内角和：$${beta}^\\circ + ${beta}^\\circ + ${m}^\\circ = 180^\\circ$。用简便关系也得到同样的底角：$90^\\circ - ${theta}^\\circ = ${beta}^\\circ$。`,
              ),
            }),
            figure: figure(inscribedMarks(s, m, f, { angle: deg(theta), central: "", baseAngle: "?" }), desc.en, desc["zh-CN"]),
            solutionFigures: [
              figure(
                inscribedMarks(s, m, f, { angle: deg(theta), arc: deg(m), central: deg(m), tones: { central: "result" } }),
                `The inscribed angle ACB of ${theta}° and the central angle AOB of ${m}° on the same arc AB.`,
                `同一段弧 AB 上，圆周角 ACB 为 ${theta}°，圆心角 AOB 为 ${m}°。`,
              ),
              figure(
                inscribedMarks(s, m, f, {
                  angle: deg(theta),
                  central: deg(m),
                  baseAngle: deg(beta),
                  both: true,
                  tones: { base: "result" },
                }),
                `The radii OA and OB are equal, so the base angles OAB and OBA of triangle AOB are both ${beta}°.`,
                `半径 OA 与 OB 相等，所以三角形 AOB 的底角 OAB 和 OBA 都是 ${beta}°。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t("$O$ is the center of the circle. Find $\\angle ACB$.", "$O$ 是圆心。求 $\\angle ACB$。"),
            answer: theta,
            unit: "°",
            wrong: [2 * beta, 180 - 2 * beta, beta, m],
            solution: t(
              `**Step 1: the central angle.** $OA = OB$ because both are radii, so $\\triangle AOB$ is isosceles and $\\angle OBA = \\angle OAB = ${beta}^\\circ$. The angles of the triangle add to $180^\\circ$:${steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${beta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**Step 2: the inscribed angle.** $\\angle ACB$ intercepts the same arc $${arcTex("AB")}$ as the central angle, so it is half of it:${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 1}}

**Check.** A base angle and the inscribed angle add to $90^\\circ$, because the base angle is $90^\\circ - \\angle ACB$: $${beta}^\\circ + ${theta}^\\circ = 90^\\circ$.`,
              `**第一步：求圆心角。** $OA = OB$（都是半径），所以 $\\triangle AOB$ 是等腰三角形，$\\angle OBA = \\angle OAB = ${beta}^\\circ$。三角形的内角和是 $180^\\circ$：${steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${beta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**第二步：求圆周角。** $\\angle ACB$ 与圆心角对着同一段弧 $${arcTex("AB")}$，所以是它的一半：${steps(`\\angle ACB = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 1}}

**检验。** 底角与圆周角之和应为 $90^\\circ$，因为底角等于 $90^\\circ - \\angle ACB$：$${beta}^\\circ + ${theta}^\\circ = 90^\\circ$。`,
            ),
          }),
          figure: figure(inscribedMarks(s, m, f, { angle: "?", central: "", baseAngle: deg(beta) }), desc.en, desc["zh-CN"]),
          solutionFigures: [
            figure(
              inscribedMarks(s, m, f, { central: deg(m), baseAngle: deg(beta), both: true, tones: { central: "result" } }),
              `Triangle AOB has equal radii OA and OB and base angles of ${beta}°, so its angle at O is ${m}°.`,
              `三角形 AOB 的半径 OA 与 OB 相等，底角都是 ${beta}°，所以 O 处的角是 ${m}°。`,
            ),
            figure(
              inscribedMarks(s, m, f, { angle: deg(theta), arc: deg(m), central: deg(m), tones: { angle: "result" } }),
              `The inscribed angle ACB is ${theta}°, half the central angle AOB of ${m}° on the same arc.`,
              `圆周角 ACB 为 ${theta}°，是同弧所对圆心角 AOB（${m}°）的一半。`,
            ),
          ],
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

/** radiiTicks marks the three equal radii OA, OB and OC of a diameter figure. */
const radiiTicks = (d: DiameterFigure): Mark[] => [tick(O, d.pa), tick(O, d.pb), tick(O, d.pc)];

/** rightAtC marks the right angle at C of a diameter figure. */
const rightAtC = (d: DiameterFigure): Mark => rightAt(d.pc, d.pa, d.pb);

/** angleA marks the angle CAB of a diameter figure. */
const angleA = (d: DiameterFigure, label?: string, tone?: Tone) => angleAt(d.pa, d.pb, d.pc, label, tone);

/** angleB marks the angle CBA of a diameter figure. */
const angleB = (d: DiameterFigure, label?: string, tone?: Tone) => angleAt(d.pb, d.pc, d.pa, label, tone);

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [20, 21, 29],
  [7, 24, 25],
] as const;

/** thalesIntro draws the triangle on the diameter AB with the radius OC: 40° at A and at C on the left, 50° at C and at B on the right. */
const thalesIntro: Figure = (() => {
  const d = diameterFigure(190, 40);
  return figure(
    diameterMarks(
      d,
      [
        ...radiiTicks(d),
        angleA(d, "40°"),
        angleAt(d.pc, d.pa, O, "40°", "action"),
        angleAt(d.pc, O, d.pb, "50°", "result"),
        angleB(d, "50°", "result"),
      ],
      true,
    ),
    "Triangle ABC on the diameter AB, with the radius OC. The radii OA, OB and OC are equal. The angles at A and on the left part of C are 40°; the angles on the right part of C and at B are 50°.",
    "直径 AB 上的三角形 ABC，画有半径 OC。半径 OA、OB、OC 相等。A 处和 C 处左侧的角都是 40°；C 处右侧和 B 处的角都是 50°。",
  );
})();

export const thalesTheorem: TopicDef = {
  id: "thales-theorem",
  title: t("Thales' Theorem", "泰勒斯定理"),
  summary: t(
    "An angle inscribed in a semicircle is a right angle; use it and its converse to find angles and radii.",
    "半圆所对的圆周角是直角；用它及其逆定理求角和半径。",
  ),
  prerequisites: ["inscribed-angles", "the-pythagorean-theorem"],
  encompasses: [{ topic: "the-pythagorean-theorem", weight: 0.2 }],
  xp: 13,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `An inscribed angle is half its arc. The most important arc is the one a **diameter** cuts off: a semicircle of $180^\\circ$. Any angle $\\angle ACB$ whose sides run to the two ends of a diameter $AB$ is therefore $\\frac{180^\\circ}{2} = 90^\\circ$, wherever $C$ is on the circle. This is **Thales' theorem**, and it means every triangle drawn on a diameter is a right triangle.

The radii show it a second way. Let $AB$ be a diameter of circle $O$, $C$ a point on the circle, and $\\angle CAB = 40^\\circ$. Draw the radius $OC$:

{{figure 0}}

$OA = OC$, so $\\triangle AOC$ is isosceles and $\\angle ACO = 40^\\circ$. $OB = OC$, so $\\triangle BOC$ is isosceles too; call its equal angles $x$. The angles of $\\triangle ABC$ add to $180^\\circ$:

$$40^\\circ + (40^\\circ + x) + x = 180^\\circ, \\qquad\\text{so}\\qquad x = 50^\\circ,$$

and $\\angle ACB = 40^\\circ + 50^\\circ = 90^\\circ$, as the theorem says. In this lesson we use the right angle to find the other angles, run the theorem backward to tell whether a chord is a diameter, and find the radius from a right triangle's legs.`,
    `圆周角等于它所对弧的一半。最重要的一段弧是**直径**截出的弧：$180^\\circ$ 的半圆。所以两边分别通向直径 $AB$ 两端的角 $\\angle ACB$ 等于 $\\frac{180^\\circ}{2} = 90^\\circ$，不论 $C$ 在圆上的什么位置。这就是**泰勒斯定理**，它说明以直径为一边画在圆上的三角形都是直角三角形。

用半径还能换一种方式看出这一点。设 $AB$ 是圆 $O$ 的直径，$C$ 是圆上一点，$\\angle CAB = 40^\\circ$。作半径 $OC$：

{{figure 0}}

$OA = OC$，所以 $\\triangle AOC$ 是等腰三角形，$\\angle ACO = 40^\\circ$。$OB = OC$，所以 $\\triangle BOC$ 也是等腰三角形，把它的两个相等的角记作 $x$。$\\triangle ABC$ 的内角和是 $180^\\circ$：

$$40^\\circ + (40^\\circ + x) + x = 180^\\circ, \\qquad\\text{所以}\\qquad x = 50^\\circ,$$

于是 $\\angle ACB = 40^\\circ + 50^\\circ = 90^\\circ$，与定理一致。这节课我们用这个直角求其他角，把定理反过来用以判断一条弦是不是直径，并由直角三角形的两条直角边求半径。`,
  ),
  introFigures: [thalesIntro],
  knowledgePoints: [
    {
      id: "angles-in-a-semicircle",
      figure: theoremDrawings["angles-in-a-semicircle"],
      title: t("The angle in a semicircle", "半圆上的圆周角"),
      explanation: t(
        `**Thales' theorem:** if $AB$ is a diameter and $C$ is any other point on the circle, then $\\angle ACB = 90^\\circ$. The angle intercepts a semicircle of $180^\\circ$, and half of that is $90^\\circ$.

So triangle $ABC$ is a right triangle with its right angle at $C$, and its two acute angles share the remaining $90^\\circ$. If $\\angle CAB = 28^\\circ$, then

$$\\angle CBA = 180^\\circ - 90^\\circ - 28^\\circ = 62^\\circ.$$

> **Watch out.** The right angle is at $C$, the vertex on the circle away from the diameter, not at $A$ or $B$. Subtract **both** the right angle and the given angle from $180^\\circ$: $180^\\circ - 28^\\circ = 152^\\circ$ forgets the right angle.`,
        `**泰勒斯定理**：若 $AB$ 是直径，$C$ 是圆上另外任意一点，则 $\\angle ACB = 90^\\circ$。这个角所对的弧是 $180^\\circ$ 的半圆，它的一半是 $90^\\circ$。

所以 $\\triangle ABC$ 是直角三角形，直角在 $C$，两个锐角分享剩下的 $90^\\circ$。若 $\\angle CAB = 28^\\circ$，则

$$\\angle CBA = 180^\\circ - 90^\\circ - 28^\\circ = 62^\\circ.$$

> **注意。** 直角在 $C$，即圆上不在直径两端的那个顶点，而不在 $A$ 或 $B$。要从 $180^\\circ$ 中**同时**减去直角和已知角：$180^\\circ - 28^\\circ = 152^\\circ$ 就漏掉了直角。`,
      ),
      generate(rng) {
        const a = rng.int(15, 75);
        const d = diameterFigure(rng.int(0, 359), a);
        const atA = rng.bool();
        const [given, asked] = atA ? ["CAB", "CBA"] : ["CBA", "CAB"];
        const g = atA ? a : 90 - a;
        const ans = 90 - g;
        const marks = atA ? [angleA(d, deg(g)), angleB(d, "?")] : [angleB(d, deg(g)), angleA(d, "?")];
        const solved = atA ? [angleA(d, deg(g)), angleB(d, deg(ans), "result")] : [angleB(d, deg(g)), angleA(d, deg(ans), "result")];
        return {
          ...numberProblem({
            prompt: t(`$AB$ is a diameter of circle $O$. Find $\\angle ${asked}$.`, `$AB$ 是圆 $O$ 的直径。求 $\\angle ${asked}$。`),
            answer: ans,
            unit: "°",
            wrong: [180 - g, g, 90],
            solution: t(
              `**Step 1: the right angle.** $AB$ is a diameter, so $\\angle ACB$ intercepts a semicircle of $180^\\circ$ and is half of it: $\\angle ACB = 90^\\circ$ (Thales' theorem).

**Step 2: the angle sum.** The angles of $\\triangle ABC$ add to $180^\\circ$:${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**Check.** Each acute angle is half the arc opposite it, and those two arcs make up the semicircle on $C$'s side: $2 \\cdot ${g}^\\circ + 2 \\cdot ${ans}^\\circ = ${2 * g}^\\circ + ${2 * ans}^\\circ = 180^\\circ$.`,
              `**第一步：直角。** $AB$ 是直径，所以 $\\angle ACB$ 所对的弧是 $180^\\circ$ 的半圆，它等于半圆的一半：$\\angle ACB = 90^\\circ$（泰勒斯定理）。

**第二步：内角和。** $\\triangle ABC$ 的内角和是 $180^\\circ$：${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**检验。** 每个锐角都是对面弧的一半，而这两段弧合起来是含 $C$ 的半圆：$2 \\cdot ${g}^\\circ + 2 \\cdot ${ans}^\\circ = ${2 * g}^\\circ + ${2 * ans}^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            diameterMarks(d, marks),
            `Circle O with diameter AB and a point C on the circle; angle ${given} is ${g}°.`,
            `圆 O，AB 是直径，点 C 在圆上；角 ${given} 为 ${g}°。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, [rightAtC(d), ...solved]),
              `The right angle at C, angle ${given} of ${g}° and angle ${asked} of ${ans}°.`,
              `C 处是直角，角 ${given} 为 ${g}°，角 ${asked} 为 ${ans}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-converse-of-thales-theorem",
      figure: theoremDrawings["the-converse-of-thales-theorem"],
      title: t("The converse of Thales' theorem", "泰勒斯定理的逆定理"),
      explanation: t(
        `**Converse:** if an inscribed angle $\\angle ACB$ is $90^\\circ$, its intercepted arc is $2 \\cdot 90^\\circ = 180^\\circ$, a semicircle, so $AB$ is a diameter. If $\\angle ACB$ is not $90^\\circ$, the arc is not $180^\\circ$, and $AB$ is not a diameter.

So to test a side of an inscribed triangle, look at the angle **opposite** it. Triangle $ABC$ is inscribed in a circle with $\\angle A = 35^\\circ$ and $\\angle B = 55^\\circ$. Then

$$\\angle C = 180^\\circ - 35^\\circ - 55^\\circ = 90^\\circ,$$

so arc $${arcTex("AB")}$ is $180^\\circ$ and $AB$ is a diameter; the center of the circle is its midpoint.

> **Watch out.** The angle that decides whether $AB$ is a diameter is $\\angle C$, the one opposite $AB$, not $\\angle A$ or $\\angle B$. Find it from the angle sum first: two acute angles given are not enough until you know what they leave for $\\angle C$.`,
        `**逆定理**：若圆周角 $\\angle ACB$ 是 $90^\\circ$，则它所对的弧是 $2 \\cdot 90^\\circ = 180^\\circ$，是半圆，所以 $AB$ 是直径。若 $\\angle ACB$ 不是 $90^\\circ$，弧就不是 $180^\\circ$，$AB$ 也就不是直径。

所以要判断内接三角形的某条边，就看它**对面**的角。$\\triangle ABC$ 内接于圆，$\\angle A = 35^\\circ$，$\\angle B = 55^\\circ$。则

$$\\angle C = 180^\\circ - 35^\\circ - 55^\\circ = 90^\\circ,$$

所以弧 $${arcTex("AB")}$ 是 $180^\\circ$，$AB$ 是直径，圆心是它的中点。

> **注意。** 决定 $AB$ 是否为直径的是 $AB$ 对面的角 $\\angle C$，而不是 $\\angle A$ 或 $\\angle B$。先用内角和求出 $\\angle C$：只知道两个锐角还不够，要看它们给 $\\angle C$ 留下多少。`,
      ),
      generate(rng) {
        const a = rng.int(20, 70);
        const yes = rng.bool();
        const b = yes ? 90 - a : 90 - a + rng.pick([-14, -10, -6, -4, -2, 2, 4, 6, 10, 14]);
        const c = 180 - a - b;
        const angleC = `\\angle C = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`;
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `Triangle $ABC$ is inscribed in a circle, with $\\angle A = ${a}^\\circ$ and $\\angle B = ${b}^\\circ$. Is $AB$ a diameter of the circle?`,
                `$\\triangle ABC$ 内接于圆，$\\angle A = ${a}^\\circ$，$\\angle B = ${b}^\\circ$。$AB$ 是圆的直径吗？`,
              ),
              options: yesNo,
              correct: yes ? 0 : 1,
              solution: yes
                ? t(
                    `**Step 1: the angle opposite $AB$.** That is $\\angle C$, and the angles of the triangle add to $180^\\circ$:${steps(angleC)}**Step 2: its arc.** $\\angle C$ intercepts arc $${arcTex("AB")}$, which is twice the angle: $2 \\cdot 90^\\circ = 180^\\circ$, a semicircle. So $AB$ is a diameter.

**Check.** Run Thales' theorem forward: with $AB$ a diameter, the angle at $C$ must be $90^\\circ$, and it is.`,
                    `**第一步：$AB$ 对面的角。** 这个角是 $\\angle C$，三角形的内角和是 $180^\\circ$：${steps(angleC)}**第二步：它所对的弧。** $\\angle C$ 对着弧 $${arcTex("AB")}$，弧是角的两倍：$2 \\cdot 90^\\circ = 180^\\circ$，是半圆。所以 $AB$ 是直径。

**检验。** 正着用泰勒斯定理：$AB$ 是直径时，$C$ 处的角必须是 $90^\\circ$，确实如此。`,
                  )
                : t(
                    `**Step 1: the angle opposite $AB$.** That is $\\angle C$, and the angles of the triangle add to $180^\\circ$:${steps(angleC)}**Step 2: its arc.** $\\angle C$ intercepts arc $${arcTex("AB")}$, which is twice the angle: $2 \\cdot ${c}^\\circ = ${2 * c}^\\circ$, not a semicircle. So $AB$ is not a diameter.

**Check.** If $AB$ were a diameter, Thales' theorem would make the angle at $C$ exactly $90^\\circ$. It is $${c}^\\circ$, so $AB$ cannot be one.`,
                    `**第一步：$AB$ 对面的角。** 这个角是 $\\angle C$，三角形的内角和是 $180^\\circ$：${steps(angleC)}**第二步：它所对的弧。** $\\angle C$ 对着弧 $${arcTex("AB")}$，弧是角的两倍：$2 \\cdot ${c}^\\circ = ${2 * c}^\\circ$，不是半圆。所以 $AB$ 不是直径。

**检验。** 如果 $AB$ 是直径，由泰勒斯定理，$C$ 处的角应恰好是 $90^\\circ$。它是 $${c}^\\circ$，所以 $AB$ 不可能是直径。`,
                  ),
            }),
          },
          yes
            ? [
                [
                  "No",
                  "The angle opposite AB is 90°, so arc AB is 180° and AB is a diameter.",
                  "AB 对面的角是 90°，所以弧 AB 是 180°，AB 是直径。",
                ],
              ]
            : [
                [
                  "Yes",
                  `The angle opposite AB is ${c}°, not 90°, so arc AB is ${2 * c}°, not a semicircle.`,
                  `AB 对面的角是 ${c}°，不是 90°，所以弧 AB 是 ${2 * c}°，不是半圆。`,
                ],
              ],
        );
      },
    },
    {
      id: "the-hypotenuse-is-a-diameter",
      figure: theoremDrawings["the-hypotenuse-is-a-diameter"],
      title: t("The hypotenuse is a diameter", "斜边是直径"),
      explanation: t(
        `By the converse of Thales' theorem, the right angle of an inscribed right triangle intercepts a semicircle, so the **hypotenuse** is a diameter, and the center of the circle is its midpoint. The radius is half the hypotenuse.

A right triangle with legs $6$ cm and $8$ cm has hypotenuse

$$\\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}.$$

If it is inscribed in a circle, that hypotenuse is a diameter, so the radius is $\\frac{10}{2} = 5$ cm.

> **Watch out.** The hypotenuse is the diameter, so stop at half of it for the radius. And find it with the Pythagorean theorem, not by adding the legs: $6 + 8 = 14$ is longer than the hypotenuse can be.`,
        `由泰勒斯定理的逆定理，圆内接直角三角形的直角所对的弧是半圆，所以**斜边**是直径，圆心是斜边的中点，半径是斜边的一半。

直角边为 $6$ 厘米和 $8$ 厘米的直角三角形，斜边是

$$\\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}.$$

若它内接于圆，这条斜边就是直径，所以半径是 $\\frac{10}{2} = 5$ 厘米。

> **注意。** 斜边是直径，求半径要取它的一半。斜边要用勾股定理求，而不是把两条直角边相加：$6 + 8 = 14$ 比斜边可能的长度还长。`,
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
        const legs: Mark[] = [sideIn(d.pa, d.pc, d.pb, len(l1, u)), sideIn(d.pb, d.pc, d.pa, len(l2, u))];
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
              `**Step 1: the diameter.** The right angle at $C$ is an inscribed angle, so its arc $${arcTex("AB")}$ is $2 \\cdot 90^\\circ = 180^\\circ$, a semicircle: the hypotenuse $AB$ is a diameter, and the center $O$ is its midpoint.

**Step 2: the hypotenuse.** By the Pythagorean theorem:${steps(`AB = \\sqrt{${l1}^2 + ${l2}^2} = \\sqrt{${l1 * l1} + ${l2 * l2}} = \\sqrt{${h * h}} = ${h}`)}**Step 3: the radius.** The radius is half the diameter:${steps(`r = \\frac{${h}}{2} = ${tex(h / 2, u)}`)}{{figure 0}}

**Check.** Work back from the radius: the diameter is $2r = ${h}$, and taking one leg away from it in the Pythagorean theorem gives the other, $${h}^2 - ${l1}^2 = ${h * h} - ${l1 * l1} = ${l2 * l2} = ${l2}^2$. The diameter is also the longest side, as a hypotenuse must be: $${Math.max(l1, l2)} < ${h}$.`,
              `**第一步：直径。** $C$ 处的直角是圆周角，所以它所对的弧 $${arcTex("AB")}$ 是 $2 \\cdot 90^\\circ = 180^\\circ$，是半圆：斜边 $AB$ 是直径，圆心 $O$ 是它的中点。

**第二步：斜边。** 由勾股定理：${steps(`AB = \\sqrt{${l1}^2 + ${l2}^2} = \\sqrt{${l1 * l1} + ${l2 * l2}} = \\sqrt{${h * h}} = ${h}`)}**第三步：半径。** 半径是直径的一半：${steps(`r = \\frac{${h}}{2} = ${tex(h / 2, u)}`)}{{figure 0}}

**检验。** 由半径倒推：直径 $2r = ${h}$，在勾股定理中从它的平方减去一条直角边的平方，应得到另一条的平方：$${h}^2 - ${l1}^2 = ${h * h} - ${l1 * l1} = ${l2 * l2} = ${l2}^2$。直径也是最长的边，正如斜边应有的那样：$${Math.max(l1, l2)} < ${h}$。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              { kind: "polygon", points: [d.pa, d.pb, d.pc] },
              rightAtC(d),
              ...legs,
              ...pointsAt([
                [d.s, "A"],
                [d.s + 180, "B"],
                [d.c, "C"],
              ]),
            ],
            `A right triangle ABC inscribed in a circle, with legs AC = ${l1} ${u} and BC = ${l2} ${u}.`,
            `内接于圆的直角三角形 ABC，直角边 AC = ${l1} ${u}，BC = ${l2} ${u}。`,
          ),
          solutionFigures: [
            figure(
              [
                circleAt(),
                seg(d.pa, d.pb, "result"),
                seg(d.pc, d.pa),
                seg(d.pc, d.pb),
                rightAtC(d),
                ...legs,
                tick(O, d.pa),
                tick(O, d.pb),
                ...center(dirOf(d.s - 90)),
                ...pointsAt([
                  [d.s, "A"],
                  [d.s + 180, "B"],
                  [d.c, "C"],
                ]),
              ],
              `The hypotenuse AB of ${h} ${u} is a diameter; the center O is its midpoint, so OA = OB = ${h / 2} ${u}.`,
              `斜边 AB（${h} ${u}）是直径；圆心 O 是它的中点，所以 OA = OB = ${h / 2} ${u}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** arcBC highlights the arc BC on C's side of a diameter figure, with a label and an optional tone. */
const arcBC = (d: DiameterFigure, label: string, tone?: Tone): Mark[] => [...arcAt(d.c, d.s + 180, tone), arcText(d.c, d.s + 180, label)];

/** arcAC highlights the arc AC on C's side of a diameter figure, with a label and an optional tone. */
const arcAC = (d: DiameterFigure, label: string, tone?: Tone): Mark[] => [...arcAt(d.s, d.c, tone), arcText(d.s, d.c, label)];

/** rightTriangleIntro draws the triangle on a diameter with an angle of 34° at A: 56° at B, arcs BC = 68° and AC = 112°. */
const rightTriangleIntro: Figure = (() => {
  const d = diameterFigure(200, 34);
  return figure(
    diameterMarks(d, [
      rightAtC(d),
      angleA(d, "34°"),
      angleB(d, "56°", "result"),
      ...arcBC(d, "68°", "result"),
      ...arcAC(d, "112°", "result"),
    ]),
    "Triangle ABC on the diameter AB: the right angle at C, 34° at A and 56° at B; arc BC is 68° and arc AC is 112°.",
    "直径 AB 上的三角形 ABC：C 处是直角，A 处 34°，B 处 56°；弧 BC 为 68°，弧 AC 为 112°。",
  );
})();

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
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `A triangle drawn on a diameter carries two kinds of facts at once. As a triangle with a right angle at $C$, its acute angles add to $90^\\circ$. As an inscribed triangle, each angle is half the arc opposite it. One known angle settles everything else.

Let $AB$ be a diameter and $\\angle CAB = 34^\\circ$:

{{figure 0}}

- the angle at $C$ is $90^\\circ$ (Thales' theorem), so $\\angle CBA = 90^\\circ - 34^\\circ = 56^\\circ$;
- $\\angle CAB$ intercepts arc $${arcTex("BC")}$, so $m${arcTex("BC")} = 2 \\cdot 34^\\circ = 68^\\circ$;
- $\\angle CBA$ intercepts arc $${arcTex("AC")}$, so $m${arcTex("AC")} = 2 \\cdot 56^\\circ = 112^\\circ$.

The two arcs on $C$'s side make up the semicircle, $68^\\circ + 112^\\circ = 180^\\circ$, which is the same fact as $34^\\circ + 56^\\circ = 90^\\circ$ seen through the arcs. In this lesson we use these links to find unknown angles written with $x$, and to go from angles to arcs and back.`,
    `画在直径上的三角形同时具有两类性质。作为直角在 $C$ 的直角三角形，它的两个锐角之和是 $90^\\circ$；作为圆内接三角形，每个角都是它对面那段弧的一半。知道一个角，其余的就都确定了。

设 $AB$ 是直径，$\\angle CAB = 34^\\circ$：

{{figure 0}}

- $C$ 处的角是 $90^\\circ$（泰勒斯定理），所以 $\\angle CBA = 90^\\circ - 34^\\circ = 56^\\circ$；
- $\\angle CAB$ 对着弧 $${arcTex("BC")}$，所以 $m${arcTex("BC")} = 2 \\cdot 34^\\circ = 68^\\circ$；
- $\\angle CBA$ 对着弧 $${arcTex("AC")}$，所以 $m${arcTex("AC")} = 2 \\cdot 56^\\circ = 112^\\circ$。

含 $C$ 的一侧的两段弧合起来是半圆，$68^\\circ + 112^\\circ = 180^\\circ$；这和 $34^\\circ + 56^\\circ = 90^\\circ$ 是同一个事实，只是从弧的角度来看。这节课我们用这些关系求用 $x$ 表示的未知角，并在角与弧之间来回换算。`,
  ),
  introFigures: [rightTriangleIntro],
  knowledgePoints: [
    {
      id: "acute-angles-with-algebra",
      figure: theoremDrawings["acute-angles-with-algebra"],
      title: t("Acute angles with algebra", "含未知数的锐角"),
      explanation: t(
        `In a triangle inscribed on a diameter $AB$, the angle at $C$ is $90^\\circ$. The three angles add to $180^\\circ$, so the other two take the remaining $90^\\circ$:

$$\\angle CAB + \\angle CBA = 90^\\circ.$$

If $\\angle CAB = (2x + 4)^\\circ$ and $\\angle CBA = (x + 11)^\\circ$, then

$$(2x + 4) + (x + 11) = 90, \\qquad 3x + 15 = 90, \\qquad 3x = 75, \\qquad x = 25.$$

The angles are then $54^\\circ$ and $36^\\circ$, which do add to $90^\\circ$.

> **Watch out.** The two acute angles add to $90^\\circ$, not $180^\\circ$ or $360^\\circ$: the right angle at $C$ already uses $90^\\circ$ of the triangle. And they are not equal in general, so setting the two expressions equal to each other solves the wrong equation.`,
        `在以直径 $AB$ 为一边的圆内接三角形中，$C$ 处的角是 $90^\\circ$。三个角之和是 $180^\\circ$，所以另外两个角分享剩下的 $90^\\circ$：

$$\\angle CAB + \\angle CBA = 90^\\circ.$$

若 $\\angle CAB = (2x + 4)^\\circ$，$\\angle CBA = (x + 11)^\\circ$，则

$$(2x + 4) + (x + 11) = 90, \\qquad 3x + 15 = 90, \\qquad 3x = 75, \\qquad x = 25.$$

这时两个角是 $54^\\circ$ 和 $36^\\circ$，和确实是 $90^\\circ$。

> **注意。** 两个锐角之和是 $90^\\circ$，不是 $180^\\circ$ 或 $360^\\circ$：$C$ 处的直角已经用掉了三角形的 $90^\\circ$。两个锐角一般也不相等，令两个式子相等就解错了方程。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.int(20, 70);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, a, x);
        const [c2, d2] = expressionFor(rng, 90 - a, x);
        const d = diameterFigure(rng.int(0, 359), a);
        const eq = `${angleTex(c1, d1)} + ${angleTex(c2, d2)} = 90^\\circ`;
        return {
          ...numberProblem({
            prompt: t("$AB$ is a diameter of circle $O$. Find $x$.", "$AB$ 是圆 $O$ 的直径。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: sumWrong(c1, d1, c2, d2, 90, [180, 360]),
            solution: t(
              `**Step 1: write the equation.** $AB$ is a diameter, so $\\angle ACB = 90^\\circ$ by Thales' theorem. The angles of $\\triangle ABC$ add to $180^\\circ$, so the two acute angles add to $90^\\circ$:${steps(eq)}**Step 2: solve.** Combine like terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(c1 + c2, d1 + d2, 0, 90)}{{figure 0}}

**Check.** With $x = ${x}$, $\\angle CAB = ${evalLinear(c1, d1, x)}^\\circ$ and $\\angle CBA = ${evalLinear(c2, d2, x)}^\\circ$. With the right angle, the triangle's angles add up: $${a}^\\circ + ${90 - a}^\\circ + 90^\\circ = 180^\\circ$.`,
              `**第一步：列方程。** $AB$ 是直径，由泰勒斯定理 $\\angle ACB = 90^\\circ$。$\\triangle ABC$ 的内角和是 $180^\\circ$，所以两个锐角之和是 $90^\\circ$：${steps(eq)}**第二步：解方程。** 先合并同类项，再${collect["zh-CN"]}${solveLinear(c1 + c2, d1 + d2, 0, 90)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$\\angle CAB = ${evalLinear(c1, d1, x)}^\\circ$，$\\angle CBA = ${evalLinear(c2, d2, x)}^\\circ$。加上直角，三角形的内角和正好是：$${a}^\\circ + ${90 - a}^\\circ + 90^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [angleA(d, angleLabel(c1, d1)), angleB(d, angleLabel(c2, d2))]),
            `Circle O with diameter AB and C on the circle; angle CAB is ${angleLabel(c1, d1)} and angle CBA is ${angleLabel(c2, d2)}.`,
            `圆 O，AB 是直径，C 在圆上；角 CAB 为 ${angleLabel(c1, d1)}，角 CBA 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, [rightAtC(d), angleA(d, deg(a), "result"), angleB(d, deg(90 - a), "result")]),
              `With x = ${x}: the right angle at C, ${a}° at A and ${90 - a}° at B.`,
              `x = ${x} 时：C 处是直角，A 处 ${a}°，B 处 ${90 - a}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "arcs-from-angles",
      figure: theoremDrawings["arcs-from-angles"],
      title: t("Arcs from the angles", "由角求弧"),
      explanation: t(
        `The diameter $AB$ cuts the circle into two semicircles. On the one containing $C$, the arcs $${arcTex("AC")}$ and $${arcTex("BC")}$ add to $180^\\circ$, and each is twice the inscribed angle at the **opposite** vertex: the angle at $A$ looks across the triangle at arc $${arcTex("BC")}$, and the angle at $B$ at arc $${arcTex("AC")}$:

$$m${arcTex("BC")} = 2\\angle CAB, \\qquad m${arcTex("AC")} = 2\\angle CBA.$$

If $\\angle CAB = 25^\\circ$, then $m${arcTex("BC")} = 2 \\cdot 25^\\circ = 50^\\circ$, and the rest of the semicircle is $m${arcTex("AC")} = 180^\\circ - 50^\\circ = 130^\\circ$.

> **Watch out.** An arc is **twice** its inscribed angle, not equal to it. The angle at $A$ intercepts arc $${arcTex("BC")}$, the arc away from $A$, not arc $${arcTex("AC")}$. And to get the other arc, subtract the doubled angle from $180^\\circ$: $180^\\circ - 25^\\circ$ subtracts the angle instead of its arc.`,
        `直径 $AB$ 把圆分成两个半圆。在含 $C$ 的半圆上，弧 $${arcTex("AC")}$ 与弧 $${arcTex("BC")}$ 之和是 $180^\\circ$，每段弧都是**对面**顶点处圆周角的两倍：$A$ 处的角隔着三角形对着弧 $${arcTex("BC")}$，$B$ 处的角对着弧 $${arcTex("AC")}$：

$$m${arcTex("BC")} = 2\\angle CAB, \\qquad m${arcTex("AC")} = 2\\angle CBA.$$

若 $\\angle CAB = 25^\\circ$，则 $m${arcTex("BC")} = 2 \\cdot 25^\\circ = 50^\\circ$，半圆的其余部分是 $m${arcTex("AC")} = 180^\\circ - 50^\\circ = 130^\\circ$。

> **注意。** 弧是它所对圆周角的**两倍**，不是相等。$A$ 处的角对着的是远离 $A$ 的弧 $${arcTex("BC")}$，不是弧 $${arcTex("AC")}$。求另一段弧时，要从 $180^\\circ$ 中减去角的两倍：$180^\\circ - 25^\\circ$ 减的是角而不是它所对的弧。`,
      ),
      generate(rng) {
        const a = rng.int(15, 75);
        const d = diameterFigure(rng.int(0, 359), a);
        const askBC = rng.bool();
        const arc = askBC ? 2 * a : 180 - 2 * a;
        const arcMarks = askBC ? arcBC(d, "?") : arcAC(d, "?");
        const name = askBC ? "BC" : "AC";
        const bc = `m${arcTex("BC")} = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`;
        const ac = `m${arcTex("AC")} = 180^\\circ - ${2 * a}^\\circ = ${180 - 2 * a}^\\circ`;
        const solvedMarks = [
          angleA(d, deg(a), "action"),
          ...arcBC(d, deg(2 * a), askBC ? "result" : "action"),
          ...(askBC ? [] : arcAC(d, deg(arc), "result")),
        ];
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
                  `**Step 1: the intercepted arc.** $\\angle CAB$ is an inscribed angle with its vertex at $A$; its sides run to $B$ and $C$, so it intercepts arc $${arcTex("BC")}$.

**Step 2: double the angle.** An arc is twice the inscribed angle on it:${steps(bc)}{{figure 0}}

**Check.** The rest of the semicircle is $m${arcTex("AC")} = 180^\\circ - ${2 * a}^\\circ = ${180 - 2 * a}^\\circ$, and half of it should be the angle at $B$, which is $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$ since $\\angle C = 90^\\circ$. Indeed $\\frac{${180 - 2 * a}^\\circ}{2} = ${90 - a}^\\circ$.`,
                  `**第一步：所对的弧。** $\\angle CAB$ 是顶点在 $A$ 的圆周角，两边通向 $B$ 和 $C$，所以它对着弧 $${arcTex("BC")}$。

**第二步：角乘以 2。** 弧是它所对圆周角的两倍：${steps(bc)}{{figure 0}}

**检验。** 半圆的其余部分是 $m${arcTex("AC")} = 180^\\circ - ${2 * a}^\\circ = ${180 - 2 * a}^\\circ$，它的一半应等于 $B$ 处的角；由于 $\\angle C = 90^\\circ$，$B$ 处的角是 $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$。确实 $\\frac{${180 - 2 * a}^\\circ}{2} = ${90 - a}^\\circ$。`,
                )
              : t(
                  `**Step 1: the arc of the known angle.** $\\angle CAB$ intercepts arc $${arcTex("BC")}$, the arc away from $A$, which is twice the angle:${steps(bc)}**Step 2: the rest of the semicircle.** Arcs $${arcTex("AC")}$ and $${arcTex("BC")}$ together make up the semicircle on $C$'s side:${steps(ac)}{{figure 0}}

**Check.** Arc $${arcTex("AC")}$ is intercepted by the angle at $B$, so it should be twice that angle. With $\\angle C = 90^\\circ$, $\\angle CBA = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$, and $2 \\cdot ${90 - a}^\\circ = ${arc}^\\circ$.`,
                  `**第一步：已知角所对的弧。** $\\angle CAB$ 对着远离 $A$ 的弧 $${arcTex("BC")}$，弧是角的两倍：${steps(bc)}**第二步：半圆的其余部分。** 弧 $${arcTex("AC")}$ 与弧 $${arcTex("BC")}$ 合起来是含 $C$ 一侧的半圆：${steps(ac)}{{figure 0}}

**检验。** 弧 $${arcTex("AC")}$ 是 $B$ 处的角所对的弧，应是这个角的两倍。由于 $\\angle C = 90^\\circ$，$\\angle CBA = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$，而 $2 \\cdot ${90 - a}^\\circ = ${arc}^\\circ$。`,
                ),
          }),
          figure: figure(
            diameterMarks(d, [angleA(d, deg(a)), ...arcMarks]),
            `Circle O with diameter AB and C on the circle; angle CAB is ${a}° and arc ${name} is highlighted.`,
            `圆 O，AB 是直径，C 在圆上；角 CAB 为 ${a}°，弧 ${name} 被突出显示。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, solvedMarks),
              askBC
                ? `Angle CAB of ${a}° intercepts arc BC, which is ${2 * a}°.`
                : `Angle CAB of ${a}° intercepts arc BC of ${2 * a}°; the rest of the semicircle, arc AC, is ${arc}°.`,
              askBC
                ? `${a}° 的角 CAB 对着弧 BC，弧 BC 为 ${2 * a}°。`
                : `${a}° 的角 CAB 对着 ${2 * a}° 的弧 BC；半圆的其余部分弧 AC 为 ${arc}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "angles-from-arcs",
      figure: theoremDrawings["angles-from-arcs"],
      title: t("Angles from the arcs", "由弧求角"),
      explanation: t(
        `Going the other way, each acute angle is half the arc opposite it. If $AB$ is a diameter and $m${arcTex("AC")} = 70^\\circ$ (on the semicircle containing $C$), the angle at $B$ intercepts that arc, so

$$\\angle CBA = \\frac{70^\\circ}{2} = 35^\\circ, \\qquad \\angle CAB = 90^\\circ - 35^\\circ = 55^\\circ.$$

The second also follows from the arcs: $m${arcTex("BC")} = 180^\\circ - 70^\\circ = 110^\\circ$, whose half is $55^\\circ$. Two routes that agree are a built-in check.

> **Watch out.** An inscribed angle is **half** its arc, so $70^\\circ$ is not the angle. The arc $${arcTex("AC")}$ belongs to the angle at $B$, the vertex not on it; the angle at $A$ uses the other arc, $${arcTex("BC")}$. And $180^\\circ - 70^\\circ = 110^\\circ$ is that arc, not the angle yet: halve it.`,
        `反过来，每个锐角都是它对面那段弧的一半。若 $AB$ 是直径，且（在含 $C$ 的半圆上）$m${arcTex("AC")} = 70^\\circ$，$B$ 处的角对着这段弧，所以

$$\\angle CBA = \\frac{70^\\circ}{2} = 35^\\circ, \\qquad \\angle CAB = 90^\\circ - 35^\\circ = 55^\\circ.$$

后者也可以由弧得到：$m${arcTex("BC")} = 180^\\circ - 70^\\circ = 110^\\circ$，它的一半是 $55^\\circ$。两条途径得到同一结果，本身就是检验。

> **注意。** 圆周角是它所对弧的**一半**，所以 $70^\\circ$ 不是角。弧 $${arcTex("AC")}$ 属于不在这段弧上的顶点 $B$ 处的角；$A$ 处的角用的是另一段弧 $${arcTex("BC")}$。$180^\\circ - 70^\\circ = 110^\\circ$ 是那段弧，还不是角，还要取一半。`,
      ),
      generate(rng) {
        const m = 2 * rng.int(15, 75);
        const a = 90 - m / 2;
        const d = diameterFigure(rng.int(0, 359), a);
        const askA = rng.bool();
        const solvedMarks = askA
          ? [...arcAC(d, deg(m), "action"), ...arcBC(d, deg(180 - m), "action"), angleA(d, deg(a), "result")]
          : [...arcAC(d, deg(m), "action"), angleB(d, deg(m / 2), "result")];
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
                  `**Step 1: the arc of $\\angle CAB$.** Its sides run from $A$ to $B$ and $C$, so it intercepts arc $${arcTex("BC")}$, the rest of the semicircle on $C$'s side:${steps(`m${arcTex("BC")} = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}**Step 2: halve it.** An inscribed angle is half its arc:${steps(`\\angle CAB = \\frac{${180 - m}^\\circ}{2} = ${a}^\\circ`)}{{figure 0}}

**Check.** By the other route: the angle at $B$ is half of arc $${arcTex("AC")}$, $\\frac{${m}^\\circ}{2} = ${m / 2}^\\circ$, and the two acute angles of the right triangle add to $90^\\circ$: $${a}^\\circ + ${m / 2}^\\circ = 90^\\circ$.`,
                  `**第一步：$\\angle CAB$ 所对的弧。** 它的两边从 $A$ 通向 $B$ 和 $C$，所以它对着弧 $${arcTex("BC")}$，即含 $C$ 一侧半圆的其余部分：${steps(`m${arcTex("BC")} = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}**第二步：取一半。** 圆周角是它所对弧的一半：${steps(`\\angle CAB = \\frac{${180 - m}^\\circ}{2} = ${a}^\\circ`)}{{figure 0}}

**检验。** 换一条途径：$B$ 处的角是弧 $${arcTex("AC")}$ 的一半，$\\frac{${m}^\\circ}{2} = ${m / 2}^\\circ$，而直角三角形的两个锐角之和是 $90^\\circ$：$${a}^\\circ + ${m / 2}^\\circ = 90^\\circ$。`,
                )
              : t(
                  `**Step 1: the arc of $\\angle CBA$.** Its sides run from $B$ to $A$ and $C$, so it intercepts arc $${arcTex("AC")}$ of $${m}^\\circ$.

**Step 2: halve it.** An inscribed angle is half its arc:${steps(`\\angle CBA = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}{{figure 0}}

**Check.** By the other route: arc $${arcTex("BC")}$ is $180^\\circ - ${m}^\\circ = ${180 - m}^\\circ$, so $\\angle CAB = ${a}^\\circ$, and the two acute angles of the right triangle add to $90^\\circ$: $${m / 2}^\\circ + ${a}^\\circ = 90^\\circ$.`,
                  `**第一步：$\\angle CBA$ 所对的弧。** 它的两边从 $B$ 通向 $A$ 和 $C$，所以它对着 $${m}^\\circ$ 的弧 $${arcTex("AC")}$。

**第二步：取一半。** 圆周角是它所对弧的一半：${steps(`\\angle CBA = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`)}{{figure 0}}

**检验。** 换一条途径：弧 $${arcTex("BC")}$ 是 $180^\\circ - ${m}^\\circ = ${180 - m}^\\circ$，所以 $\\angle CAB = ${a}^\\circ$，而直角三角形的两个锐角之和是 $90^\\circ$：$${m / 2}^\\circ + ${a}^\\circ = 90^\\circ$。`,
                ),
          }),
          figure: figure(
            diameterMarks(d, [...arcAC(d, deg(m)), askA ? angleA(d, "?") : angleB(d, "?")]),
            `Circle O with diameter AB and C on the circle; arc AC is ${m}°.`,
            `圆 O，AB 是直径，C 在圆上；弧 AC 为 ${m}°。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, solvedMarks),
              askA
                ? `Arc AC is ${m}°, so arc BC is ${180 - m}°, and angle CAB, half of arc BC, is ${a}°.`
                : `Angle CBA intercepts arc AC of ${m}°, so it is ${m / 2}°.`,
              askA
                ? `弧 AC 为 ${m}°，所以弧 BC 为 ${180 - m}°，角 CAB 是弧 BC 的一半，为 ${a}°。`
                : `角 CBA 对着 ${m}° 的弧 AC，所以它是 ${m / 2}°。`,
            ),
          ],
        };
      },
    },
  ],
};

/** radiusIntro draws the triangle on a diameter with the radius OC and an angle of 25° at A: 25° at ACO, 130° at AOC, 50° at BOC and 65° at OCB and OBC. */
const radiusIntro: Figure = (() => {
  const d = diameterFigure(200, 25);
  return figure(
    diameterMarks(
      d,
      [
        ...radiiTicks(d),
        angleA(d, "25°"),
        angleAt(d.pc, d.pa, O, "25°", "action"),
        angleAt(O, d.pc, d.pa, "130°", "result"),
        angleAt(O, d.pb, d.pc, "50°", "result"),
        angleAt(d.pc, O, d.pb, "65°", "result"),
        angleB(d, "65°", "result"),
      ],
      true,
    ),
    "Triangle ABC on the diameter AB with the radius OC; the equal radii OA, OB and OC are ticked. Angle CAB and angle ACO are 25°, angle AOC is 130°, angle BOC is 50°, and angles OCB and OBC are 65°.",
    "直径 AB 上的三角形 ABC，画有半径 OC；相等的半径 OA、OB、OC 标有记号。角 CAB 和角 ACO 为 25°，角 AOC 为 130°，角 BOC 为 50°，角 OCB 和角 OBC 为 65°。",
  );
})();

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
  intro: t(
    `Drawing one more segment, the radius $OC$ from the center to the right-angle vertex, splits a triangle on a diameter into two smaller triangles. Both are **isosceles**, because all three of $OA$, $OB$ and $OC$ are radii. Isosceles triangles have equal base angles, and that gives every angle in the figure.

Let $AB$ be a diameter and $\\angle CAB = 25^\\circ$:

{{figure 0}}

- in $\\triangle AOC$, $OA = OC$, so $\\angle ACO = 25^\\circ$ too, and $\\angle AOC = 180^\\circ - 25^\\circ - 25^\\circ = 130^\\circ$;
- $\\angle BOC$ sits on the straight line $AB$ next to $\\angle AOC$: $180^\\circ - 130^\\circ = 50^\\circ$, twice the inscribed angle $\\angle CAB$ on the same arc $${arcTex("BC")}$;
- in $\\triangle BOC$, $OB = OC$, so its base angles share $180^\\circ - 50^\\circ = 130^\\circ$: $\\angle OCB = \\angle OBC = 65^\\circ$.

At $C$ the two parts add to $25^\\circ + 65^\\circ = 90^\\circ$, Thales' right angle again. The same radius also shows that the segment to the right-angle vertex is **half the hypotenuse**. In this lesson we find these angles and lengths, with numbers and with $x$.`,
    `再画一条线段，即从圆心到直角顶点的半径 $OC$，就把直径上的三角形分成两个小三角形。它们都是**等腰三角形**，因为 $OA$、$OB$、$OC$ 都是半径。等腰三角形的两个底角相等，由此可以求出图中的每一个角。

设 $AB$ 是直径，$\\angle CAB = 25^\\circ$：

{{figure 0}}

- 在 $\\triangle AOC$ 中，$OA = OC$，所以 $\\angle ACO$ 也是 $25^\\circ$，$\\angle AOC = 180^\\circ - 25^\\circ - 25^\\circ = 130^\\circ$；
- $\\angle BOC$ 在直线 $AB$ 上与 $\\angle AOC$ 相邻：$180^\\circ - 130^\\circ = 50^\\circ$，恰好是同一段弧 $${arcTex("BC")}$ 上圆周角 $\\angle CAB$ 的两倍；
- 在 $\\triangle BOC$ 中，$OB = OC$，所以两个底角平分 $180^\\circ - 50^\\circ = 130^\\circ$：$\\angle OCB = \\angle OBC = 65^\\circ$。

$C$ 处的两部分之和是 $25^\\circ + 65^\\circ = 90^\\circ$，又得到了泰勒斯定理的直角。这条半径还说明，到直角顶点的线段是**斜边的一半**。这节课我们用具体数和含 $x$ 的式子求这些角和长度。`,
  ),
  introFigures: [radiusIntro],
  knowledgePoints: [
    {
      id: "angles-at-the-radius",
      figure: theoremDrawings["angles-at-the-radius"],
      title: t("Angles at the radius", "半径处的角"),
      explanation: t(
        `Let $AB$ be a diameter of circle $O$ and $C$ a point on the circle. The radius $OC$ equals $OA$ and $OB$, so it splits $\\triangle ABC$ into two **isosceles** triangles, each with equal base angles.

If $\\angle CAB = 32^\\circ$:

- in $\\triangle AOC$, $\\angle ACO = \\angle CAO = 32^\\circ$, and $\\angle AOC = 180^\\circ - 64^\\circ = 116^\\circ$;
- $\\angle BOC$ is an exterior angle of $\\triangle AOC$, so $\\angle BOC = 32^\\circ + 32^\\circ = 64^\\circ$;
- $\\angle OCB = 90^\\circ - 32^\\circ = 58^\\circ$, which equals $\\angle OBC$.

> **Watch out.** Keep the two triangles apart. The angle equal to $\\angle CAB$ is $\\angle ACO$, in the same triangle $AOC$; $\\angle OCB$ is its complement, $90^\\circ - 32^\\circ$. At $O$, $\\angle BOC$ is twice the angle at $A$ while $\\angle AOC$ is what is left of the straight angle: $64^\\circ$ and $116^\\circ$ are easy to swap.`,
        `设 $AB$ 是圆 $O$ 的直径，$C$ 是圆上一点。半径 $OC$ 等于 $OA$ 和 $OB$，所以它把 $\\triangle ABC$ 分成两个**等腰**三角形，各自的两个底角相等。

若 $\\angle CAB = 32^\\circ$：

- 在 $\\triangle AOC$ 中，$\\angle ACO = \\angle CAO = 32^\\circ$，$\\angle AOC = 180^\\circ - 64^\\circ = 116^\\circ$；
- $\\angle BOC$ 是 $\\triangle AOC$ 的外角，所以 $\\angle BOC = 32^\\circ + 32^\\circ = 64^\\circ$；
- $\\angle OCB = 90^\\circ - 32^\\circ = 58^\\circ$，它等于 $\\angle OBC$。

> **注意。** 两个三角形要分清。与 $\\angle CAB$ 相等的是同在 $\\triangle AOC$ 中的 $\\angle ACO$；$\\angle OCB$ 是它的余角 $90^\\circ - 32^\\circ$。在 $O$ 处，$\\angle BOC$ 是 $A$ 处角的两倍，而 $\\angle AOC$ 是平角剩下的部分：$64^\\circ$ 和 $116^\\circ$ 很容易弄反。`,
      ),
      generate(rng) {
        const a = rng.int(20, 70);
        const d = diameterFigure(rng.int(0, 359), a);
        const ask = rng.int(0, 3);
        const name = ["ACO", "OCB", "BOC", "AOC"][ask]!;
        const answer = [a, 90 - a, 2 * a, 180 - 2 * a][ask]!;
        const atACO = (label: string, tone?: Tone) => angleAt(d.pc, d.pa, O, label, tone);
        const atOCB = (label: string, tone?: Tone) => angleAt(d.pc, O, d.pb, label, tone);
        const atBOC = (label: string, tone?: Tone) => angleAt(O, d.pb, d.pc, label, tone);
        const atAOC = (label: string, tone?: Tone) => angleAt(O, d.pc, d.pa, label, tone);
        const mark = [atACO("?"), atOCB("?"), atBOC("?"), atAOC("?")][ask]!;
        const wrong = [
          [90 - a, 180 - 2 * a, 2 * a],
          [a, 2 * a, 180 - 2 * a],
          [a, 180 - 2 * a, 90 - a],
          [2 * a, 180 - a, 90 - a],
        ][ask]!;
        const solvedMarks: Mark[] = [
          [tick(O, d.pa), tick(O, d.pc), atACO(deg(a), "result")],
          [rightAtC(d), atACO(deg(a), "action"), atOCB(deg(90 - a), "result")],
          [...arcBC(d, deg(2 * a), "action"), atBOC(deg(2 * a), "result")],
          [tick(O, d.pa), tick(O, d.pc), atACO(deg(a), "action"), atAOC(deg(180 - 2 * a), "result")],
        ][ask]!;
        const why = [
          t(
            `**Step 1: the equal sides.** $OA$ and $OC$ are both radii of the circle, so $OA = OC$ and $\\triangle AOC$ is isosceles.

**Step 2: the base angles.** The angles opposite the equal sides are equal, and $\\angle CAO$ is the same angle as $\\angle CAB$:${steps(`\\angle ACO = \\angle CAO = ${a}^\\circ`)}{{figure 0}}

**Check.** In the other isosceles triangle $BOC$, $\\angle OCB = \\angle OBC = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$ (the acute angles of $\\triangle ABC$ add to $90^\\circ$). The two parts at $C$ must make Thales' right angle: $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$.`,
            `**第一步：相等的边。** $OA$ 和 $OC$ 都是圆的半径，所以 $OA = OC$，$\\triangle AOC$ 是等腰三角形。

**第二步：底角。** 等边所对的角相等，而 $\\angle CAO$ 就是 $\\angle CAB$：${steps(`\\angle ACO = \\angle CAO = ${a}^\\circ`)}{{figure 0}}

**检验。** 在另一个等腰三角形 $BOC$ 中，$\\angle OCB = \\angle OBC = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$（$\\triangle ABC$ 的两个锐角之和是 $90^\\circ$）。$C$ 处的两部分合起来应是泰勒斯定理的直角：$${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$。`,
          ),
          t(
            `**Step 1: the whole angle at $C$.** $AB$ is a diameter, so $\\angle ACB = 90^\\circ$ by Thales' theorem. The radius $OC$ splits it into $\\angle ACO$ and $\\angle OCB$.

**Step 2: the part next to $A$.** $OA = OC$, so $\\triangle AOC$ is isosceles and $\\angle ACO = \\angle CAO = ${a}^\\circ$. The other part is what is left:${steps(`\\angle OCB = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}{{figure 0}}

**Check.** $OB = OC$ too, so $\\angle OBC = \\angle OCB = ${90 - a}^\\circ$, and the angles of $\\triangle BOC$ give $\\angle BOC = 180^\\circ - 2 \\cdot ${90 - a}^\\circ = ${2 * a}^\\circ$. That is twice the inscribed angle $\\angle CAB$ on the same arc $${arcTex("BC")}$, as the inscribed angle theorem says.`,
            `**第一步：$C$ 处的整个角。** $AB$ 是直径，由泰勒斯定理 $\\angle ACB = 90^\\circ$。半径 $OC$ 把它分成 $\\angle ACO$ 和 $\\angle OCB$。

**第二步：靠近 $A$ 的部分。** $OA = OC$，所以 $\\triangle AOC$ 是等腰三角形，$\\angle ACO = \\angle CAO = ${a}^\\circ$。另一部分是剩下的：${steps(`\\angle OCB = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}{{figure 0}}

**检验。** 又 $OB = OC$，所以 $\\angle OBC = \\angle OCB = ${90 - a}^\\circ$，由 $\\triangle BOC$ 的内角和得 $\\angle BOC = 180^\\circ - 2 \\cdot ${90 - a}^\\circ = ${2 * a}^\\circ$。这正是同一段弧 $${arcTex("BC")}$ 上圆周角 $\\angle CAB$ 的两倍，与圆周角定理一致。`,
          ),
          t(
            `**Step 1: the shared arc.** $\\angle BOC$ is a central angle on arc $${arcTex("BC")}$, and the inscribed angle $\\angle CAB$ intercepts the same arc.

**Step 2: double the inscribed angle.** A central angle is twice an inscribed angle on the same arc:${steps(`\\angle BOC = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`)}{{figure 0}}

**Check.** In the isosceles triangle $AOC$, $\\angle ACO = \\angle CAO = ${a}^\\circ$, so $\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ$. The two angles at $O$ lie along the straight line $AB$: $${180 - 2 * a}^\\circ + ${2 * a}^\\circ = 180^\\circ$.`,
            `**第一步：同一段弧。** $\\angle BOC$ 是弧 $${arcTex("BC")}$ 所对的圆心角，圆周角 $\\angle CAB$ 也对着这段弧。

**第二步：圆周角乘以 2。** 圆心角是同弧所对圆周角的两倍：${steps(`\\angle BOC = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`)}{{figure 0}}

**检验。** 在等腰三角形 $AOC$ 中，$\\angle ACO = \\angle CAO = ${a}^\\circ$，所以 $\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ$。$O$ 处的两个角组成直线 $AB$ 上的平角：$${180 - 2 * a}^\\circ + ${2 * a}^\\circ = 180^\\circ$。`,
          ),
          t(
            `**Step 1: the base angles.** $OA = OC$ are radii, so $\\triangle AOC$ is isosceles and $\\angle ACO = \\angle CAO = ${a}^\\circ$.

**Step 2: the angle sum.** The angles of $\\triangle AOC$ add to $180^\\circ$:${steps(`\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ`)}{{figure 0}}

**Check.** The central angle on arc $${arcTex("BC")}$ is twice the inscribed angle $\\angle CAB$: $\\angle BOC = ${2 * a}^\\circ$. Together with $\\angle AOC$ it makes the straight angle along $AB$: $${180 - 2 * a}^\\circ + ${2 * a}^\\circ = 180^\\circ$.`,
            `**第一步：底角。** $OA = OC$ 都是半径，所以 $\\triangle AOC$ 是等腰三角形，$\\angle ACO = \\angle CAO = ${a}^\\circ$。

**第二步：内角和。** $\\triangle AOC$ 的内角和是 $180^\\circ$：${steps(`\\angle AOC = 180^\\circ - 2 \\cdot ${a}^\\circ = ${180 - 2 * a}^\\circ`)}{{figure 0}}

**检验。** 弧 $${arcTex("BC")}$ 所对的圆心角是圆周角 $\\angle CAB$ 的两倍：$\\angle BOC = ${2 * a}^\\circ$。它与 $\\angle AOC$ 合起来是直线 $AB$ 上的平角：$${180 - 2 * a}^\\circ + ${2 * a}^\\circ = 180^\\circ$。`,
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
            diameterMarks(d, [angleA(d, deg(a)), mark], true),
            `Circle O with diameter AB, C on the circle and radius OC; angle CAB is ${a}°.`,
            `圆 O，AB 是直径，C 在圆上，画有半径 OC；角 CAB 为 ${a}°。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, [angleA(d, deg(a)), ...solvedMarks], true),
              `Angle CAB is ${a}°, and angle ${name} is ${answer}°.`,
              `角 CAB 为 ${a}°，角 ${name} 为 ${answer}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-radius-is-half-the-hypotenuse",
      figure: theoremDrawings["the-radius-is-half-the-hypotenuse"],
      title: t("The radius is half the hypotenuse", "半径是斜边的一半"),
      explanation: t(
        `In a right triangle $ABC$ inscribed on the diameter $AB$, the segment from $C$ to the center $O$ is a radius, and so are $OA$ and $OB$, which together make up the hypotenuse. So

$$OC = OA = OB = \\tfrac{1}{2}AB, \\qquad AB = 2 \\cdot OC.$$

The median to the hypotenuse is half the hypotenuse. If $OC = 2x + 1$ and $AB = 5x - 4$, then $2(2x + 1) = 5x - 4$, so $4x + 2 = 5x - 4$ and $x = 6$: $OC = 13$ and $AB = 26$, twice as long.

> **Watch out.** The factor $2$ goes on the radius: $2 \\cdot OC = AB$. Setting $OC = AB$ forgets it, and $OC = 2 \\cdot AB$ puts it on the wrong side. The question asks for $x$, not for the length $OC$.`,
        `在以直径 $AB$ 为斜边的圆内接直角三角形 $ABC$ 中，从 $C$ 到圆心 $O$ 的线段是半径，$OA$ 和 $OB$ 也是半径，它们合起来就是斜边。所以

$$OC = OA = OB = \\tfrac{1}{2}AB, \\qquad AB = 2 \\cdot OC.$$

斜边上的中线等于斜边的一半。若 $OC = 2x + 1$，$AB = 5x - 4$，则 $2(2x + 1) = 5x - 4$，即 $4x + 2 = 5x - 4$，$x = 6$：$OC = 13$，$AB = 26$，正好是两倍。

> **注意。** 因数 $2$ 乘在半径上：$2 \\cdot OC = AB$。令 $OC = AB$ 就漏掉了它，$OC = 2 \\cdot AB$ 则放错了边。题目求的是 $x$，不是 $OC$ 的长度。`,
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
        const eq = `2(${lab1}) = ${lab2}`;
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
              `**Step 1: write the equation.** $OC$, $OA$ and $OB$ are all radii, and $OA$ and $OB$ together make up the diameter $AB$. So the diameter is twice $OC$:${steps(eq)}**Step 2: solve.** Distribute the $2$ over both terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**Check.** With $x = ${x}$, $OC = ${evalLinear(c1, d1, x)}$ and $AB = ${evalLinear(c2, d2, x)}$. The diameter is twice the radius: $2 \\cdot ${r} = ${2 * r}$.`,
              `**第一步：列方程。** $OC$、$OA$、$OB$ 都是半径，$OA$ 与 $OB$ 合起来是直径 $AB$。所以直径是 $OC$ 的两倍：${steps(eq)}**第二步：解方程。** 先用 $2$ 乘括号里的两项，再${collect["zh-CN"]}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$OC = ${evalLinear(c1, d1, x)}$，$AB = ${evalLinear(c2, d2, x)}$。直径是半径的两倍：$2 \\cdot ${r} = ${2 * r}$。`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [rightAtC(d)], true),
            "Circle O with diameter AB, C on the circle, the right triangle ABC and the radius OC.",
            "圆 O，AB 是直径，C 在圆上，画有直角三角形 ABC 和半径 OC。",
          ),
          solutionFigures: [
            figure(
              diameterMarks(d, [rightAtC(d), ...radiiTicks(d)], true),
              `The radii OA, OB and OC are equal, ${r} each when x = ${x}; OA and OB make up the diameter AB of ${2 * r}.`,
              `半径 OA、OB、OC 相等，x = ${x} 时都是 ${r}；OA 与 OB 合起来是长 ${2 * r} 的直径 AB。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-angles-with-algebra",
      figure: theoremDrawings["radius-angles-with-algebra"],
      title: t("Angles at the radius with algebra", "含未知数的半径处的角"),
      explanation: t(
        `In the figure, $\\angle BOC$ is an exterior angle of the isosceles triangle $AOC$. An exterior angle equals the sum of the two interior angles away from it, and here those are the two equal angles at $A$ and $C$:

$$\\angle BOC = \\angle CAO + \\angle ACO = 2\\angle ACO.$$

If $\\angle ACO = (x + 9)^\\circ$ and $\\angle BOC = (3x + 4)^\\circ$, then $2(x + 9) = 3x + 4$, so $2x + 18 = 3x + 4$ and $x = 14$. The angles are $23^\\circ$ and $46^\\circ$.

> **Watch out.** $\\angle BOC$ is **twice** $\\angle ACO$, not equal to it: setting the two expressions equal drops the factor $2$, and doubling $\\angle BOC$ instead puts it on the wrong side. $\\angle BOC$ and $\\angle ACO$ do not add to $180^\\circ$; the angle supplementary to $\\angle BOC$ is $\\angle AOC$.`,
        `图中 $\\angle BOC$ 是等腰三角形 $AOC$ 的外角。外角等于与它不相邻的两个内角之和，这里就是 $A$、$C$ 处两个相等的角：

$$\\angle BOC = \\angle CAO + \\angle ACO = 2\\angle ACO.$$

若 $\\angle ACO = (x + 9)^\\circ$，$\\angle BOC = (3x + 4)^\\circ$，则 $2(x + 9) = 3x + 4$，即 $2x + 18 = 3x + 4$，$x = 14$。两个角分别是 $23^\\circ$ 和 $46^\\circ$。

> **注意。** $\\angle BOC$ 是 $\\angle ACO$ 的**两倍**，不是相等：令两个式子相等就丢掉了因数 $2$，把 $\\angle BOC$ 乘以 $2$ 则放错了边。$\\angle BOC$ 与 $\\angle ACO$ 之和也不是 $180^\\circ$；与 $\\angle BOC$ 互补的是 $\\angle AOC$。`,
      ),
      keyPrerequisites: ["the-exterior-angle-theorem"],
      generate(rng) {
        const a = rng.int(20, 70);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, a, x, 4);
        const [c2, d2] = expressionFor(rng, 2 * a, x, 9, [2 * c1]);
        const d = diameterFigure(rng.int(0, 359), a);
        const eq = `2(${linear(c1, d1)}) = ${linear(c2, d2)}`;
        return {
          ...numberProblem({
            prompt: t("$AB$ is a diameter of circle $O$, and $OC$ is a radius. Find $x$.", "$AB$ 是圆 $O$ 的直径，$OC$ 是半径。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), ...some([frac(180 - d1 - d2, c1 + c2)])],
            solution: t(
              `**Step 1: the equal angles.** $OA = OC$ are radii, so $\\triangle AOC$ is isosceles and $\\angle CAO = \\angle ACO$.

**Step 2: the exterior angle.** $\\angle BOC$ is an exterior angle of $\\triangle AOC$, so it is the sum of the two equal angles, twice $\\angle ACO$:${steps(eq)}**Step 3: solve.** Distribute the $2$ over both terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**Check.** With $x = ${x}$, $\\angle ACO = ${evalLinear(c1, d1, x)}^\\circ$ and $\\angle BOC = ${evalLinear(c2, d2, x)}^\\circ$. By a second route: $\\angle CAB = \\angle ACO = ${a}^\\circ$ is an inscribed angle on arc $${arcTex("BC")}$, and the central angle $\\angle BOC$ on that arc is twice it, $2 \\cdot ${a}^\\circ = ${2 * a}^\\circ$.`,
              `**第一步：相等的角。** $OA = OC$ 都是半径，所以 $\\triangle AOC$ 是等腰三角形，$\\angle CAO = \\angle ACO$。

**第二步：外角。** $\\angle BOC$ 是 $\\triangle AOC$ 的外角，等于两个相等内角之和，即 $\\angle ACO$ 的两倍：${steps(eq)}**第三步：解方程。** 先用 $2$ 乘括号里的两项，再${collect["zh-CN"]}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$\\angle ACO = ${evalLinear(c1, d1, x)}^\\circ$，$\\angle BOC = ${evalLinear(c2, d2, x)}^\\circ$。换一条途径：$\\angle CAB = \\angle ACO = ${a}^\\circ$ 是弧 $${arcTex("BC")}$ 所对的圆周角，这段弧所对的圆心角 $\\angle BOC$ 是它的两倍，$2 \\cdot ${a}^\\circ = ${2 * a}^\\circ$。`,
            ),
          }),
          figure: figure(
            diameterMarks(d, [angleAt(d.pc, d.pa, O, angleLabel(c1, d1)), angleAt(O, d.pb, d.pc, angleLabel(c2, d2))], true),
            `Circle O with diameter AB, C on the circle and radius OC; angle ACO is ${angleLabel(c1, d1)} and angle BOC is ${angleLabel(c2, d2)}.`,
            `圆 O，AB 是直径，C 在圆上，画有半径 OC；角 ACO 为 ${angleLabel(c1, d1)}，角 BOC 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              diameterMarks(
                d,
                [
                  tick(O, d.pa),
                  tick(O, d.pc),
                  angleA(d, deg(a), "action"),
                  angleAt(d.pc, d.pa, O, deg(a), "action"),
                  angleAt(O, d.pb, d.pc, deg(2 * a), "result"),
                ],
                true,
              ),
              `With x = ${x}: OA = OC, the equal angles CAO and ACO are ${a}°, and the exterior angle BOC is ${2 * a}°.`,
              `x = ${x} 时：OA = OC，相等的角 CAO 与 ACO 都是 ${a}°，外角 BOC 为 ${2 * a}°。`,
            ),
          ],
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

/** quadAt places an inscribed quadrilateral with arcs a1, a2, a3 and a4 from A at s. */
function quadAt(s: number, a1: number, a2: number, a3: number, a4: number): Quad {
  const at = [s, s + a1, s + a1 + a2, s + a1 + a2 + a3] as const;
  return {
    at,
    pts: [on(at[0]), on(at[1]), on(at[2]), on(at[3])],
    arcs: [a1, a2, a3, a4],
    angles: [(a2 + a3) / 2, (a3 + a4) / 2, (a4 + a1) / 2, (a1 + a2) / 2],
  };
}

/** quad places an inscribed quadrilateral with even arcs of at least 50°. */
function quad(rng: Rng): Quad {
  const a1 = 2 * rng.int(25, 55);
  const a2 = 2 * rng.int(25, 55);
  const a3 = 2 * rng.int(25, Math.min(70, (310 - a1 - a2) / 2));
  const a4 = 360 - a1 - a2 - a3;
  const s = rng.int(0, 359);
  return quadAt(s, a1, a2, a3, a4);
}

const letters = ["A", "B", "C", "D"] as const;

/** quadAngle marks the angle of the quadrilateral at vertex i, in the accent color or in a tone. */
function quadAngle(qd: Quad, i: number, label: string, tone?: Tone): Mark {
  const p = qd.pts;
  return angleAt(p[i]!, p[(i + 3) % 4]!, p[(i + 1) % 4]!, label, tone);
}

/** quadArc highlights the arc intercepted by the angle at vertex i, from its next vertex to its previous one, with a label. */
function quadArc(qd: Quad, i: number, label: string, tone?: Tone): Mark[] {
  const [from, to] = [qd.at[(i + 1) % 4]!, qd.at[(i + 3) % 4]!];
  return [...arcAt(from, to, tone), arcText(from, to, label)];
}

/** quadMarks draws the circle, the quadrilateral and the vertex names. */
const quadMarks = (qd: Quad, extra: readonly Mark[]): Mark[] => [
  circleAt(),
  { kind: "polygon", points: qd.pts },
  ...extra,
  ...pointsAt(qd.at.map((d, i) => [d, letters[i]!] as const)),
];

/** quadArcLabels labels the arcs AB, BC, CD and DA of a quadrilateral with their measures, all four or the first three. */
const quadArcLabels = (qd: Quad, count = 4): Mark[] =>
  qd.arcs.slice(0, count).map((m, i) => arcText(qd.at[i]!, qd.at[(i + 1) % 4]!, deg(m)));

/** quadIntro draws an inscribed quadrilateral with arcs AB = 60°, BC = 100°, CD = 120° and DA = 80°, and the arcs that angles A and C intercept. */
const quadIntro: Figure = (() => {
  const qd = quadAt(200, 60, 100, 120, 80);
  return figure(
    quadMarks(qd, [
      ...arcAt(qd.at[1], qd.at[3], "action"),
      ...arcAt(qd.at[3], qd.at[1], "result"),
      ...quadArcLabels(qd),
      quadAngle(qd, 0, "110°", "action"),
      quadAngle(qd, 2, "70°", "result"),
    ]),
    "Quadrilateral ABCD inscribed in a circle with arcs AB = 60°, BC = 100°, CD = 120° and DA = 80°. Angle A, 110°, intercepts arc BCD of 220°; angle C, 70°, intercepts arc DAB of 140°.",
    "内接于圆的四边形 ABCD，弧 AB = 60°，弧 BC = 100°，弧 CD = 120°，弧 DA = 80°。角 A 为 110°，对着 220° 的弧 BCD；角 C 为 70°，对着 140° 的弧 DAB。",
  );
})();

export const inscribedQuadrilaterals: TopicDef = {
  id: "inscribed-quadrilaterals",
  title: t("Inscribed Quadrilaterals", "圆内接四边形"),
  summary: t(
    "Opposite angles of a quadrilateral inscribed in a circle are supplementary; use it with numbers, algebra and arcs.",
    "圆内接四边形的对角互补；结合数值、代数和弧来运用它。",
  ),
  prerequisites: ["problem-solving-with-inscribed-angles", "angles-of-polygons"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.C.A.3"],
  intro: t(
    `When all four vertices of a quadrilateral lie on a circle, each of its angles is an inscribed angle. The angle at a vertex looks across the quadrilateral at the arc between its two neighbors, the arc that does not contain the vertex, and is half of it.

Take arcs $${arcTex("AB")} = 60^\\circ$, $${arcTex("BC")} = 100^\\circ$, $${arcTex("CD")} = 120^\\circ$ and $${arcTex("DA")} = 80^\\circ$, which add to $360^\\circ$:

{{figure 0}}

$$\\angle A = \\frac{100^\\circ + 120^\\circ}{2} = 110^\\circ, \\qquad \\angle C = \\frac{80^\\circ + 60^\\circ}{2} = 70^\\circ.$$

The arcs of two **opposite** angles never overlap and together cover the whole circle, so the angles add to half of $360^\\circ$: $110^\\circ + 70^\\circ = 180^\\circ$. The same happens for $\\angle B = \\frac{120^\\circ + 80^\\circ}{2} = 100^\\circ$ and $\\angle D = \\frac{60^\\circ + 100^\\circ}{2} = 80^\\circ$. Opposite angles of an inscribed quadrilateral are **supplementary**. In this lesson we use that fact with numbers, with $x$, and with arcs.`,
    `四边形的四个顶点都在圆上时，它的每个角都是圆周角。一个顶点处的角隔着四边形对着它两个相邻顶点之间、不含该顶点的那段弧，并且等于这段弧的一半。

设弧 $${arcTex("AB")} = 60^\\circ$，$${arcTex("BC")} = 100^\\circ$，$${arcTex("CD")} = 120^\\circ$，$${arcTex("DA")} = 80^\\circ$，它们的和是 $360^\\circ$：

{{figure 0}}

$$\\angle A = \\frac{100^\\circ + 120^\\circ}{2} = 110^\\circ, \\qquad \\angle C = \\frac{80^\\circ + 60^\\circ}{2} = 70^\\circ.$$

两个**相对**的角所对的弧互不重叠，合起来正好是整个圆，所以这两个角之和是 $360^\\circ$ 的一半：$110^\\circ + 70^\\circ = 180^\\circ$。$\\angle B = \\frac{120^\\circ + 80^\\circ}{2} = 100^\\circ$ 与 $\\angle D = \\frac{60^\\circ + 100^\\circ}{2} = 80^\\circ$ 也是如此。圆内接四边形的对角**互补**。这节课我们结合具体数、含 $x$ 的式子和弧来运用这一事实。`,
  ),
  introFigures: [quadIntro],
  knowledgePoints: [
    {
      id: "opposite-angles-are-supplementary",
      figure: theoremDrawings["opposite-angles-are-supplementary"],
      title: t("Opposite angles", "对角互补"),
      explanation: t(
        `A quadrilateral is **inscribed** in a circle when all four vertices are on it. Opposite angles $\\angle A$ and $\\angle C$ intercept the two arcs between $B$ and $D$, which together make the whole circle:

$$\\angle A + \\angle C = \\tfrac{1}{2} \\cdot 360^\\circ = 180^\\circ.$$

So opposite angles are **supplementary**. If $\\angle B = 104^\\circ$, then $\\angle D = 180^\\circ - 104^\\circ = 76^\\circ$.

> **Watch out.** Only **opposite** angles add to $180^\\circ$; adjacent angles, such as $\\angle A$ and $\\angle B$, need not. Find the vertex across from the one asked for before subtracting. And the opposite angles are not equal, nor do they add to $360^\\circ$: that is the sum of all four.`,
        `四个顶点都在圆上的四边形叫圆**内接**四边形。对角 $\\angle A$ 和 $\\angle C$ 分别对着 $B$、$D$ 之间的两段弧，这两段弧合起来是整个圆：

$$\\angle A + \\angle C = \\tfrac{1}{2} \\cdot 360^\\circ = 180^\\circ.$$

所以对角**互补**。若 $\\angle B = 104^\\circ$，则 $\\angle D = 180^\\circ - 104^\\circ = 76^\\circ$。

> **注意。** 只有**相对**的角之和是 $180^\\circ$；相邻的角（如 $\\angle A$ 与 $\\angle B$）不一定。先找到所求角对面的顶点，再做减法。对角也不相等，它们的和也不是 $360^\\circ$：$360^\\circ$ 是四个角的总和。`,
      ),
      generate(rng) {
        const qd = quad(rng);
        const ask = rng.int(2, 3);
        const opp = ask - 2;
        const other = 1 - opp;
        const [g, h] = [qd.angles[opp]!, qd.angles[other]!];
        const name = letters[ask]!;
        const [on1, on2] = [letters[opp]!, letters[other]!];
        const last = letters[other + 2]!;
        const ans = 180 - g;
        return {
          ...numberProblem({
            prompt: t(
              `Quadrilateral $ABCD$ is inscribed in the circle. Find $\\angle ${name}$.`,
              `四边形 $ABCD$ 内接于圆。求 $\\angle ${name}$。`,
            ),
            answer: ans,
            unit: "°",
            wrong: [g, 360 - g, 180 - h, h],
            solution: t(
              `**Step 1: the opposite angle.** Going around $ABCD$, the vertex across from $${name}$ is $${on1}$, so $\\angle ${name}$ and $\\angle ${on1} = ${g}^\\circ$ are opposite. Their arcs cover the whole circle between them, so they are supplementary. ($\\angle ${on2}$ is adjacent to $\\angle ${name}$ and does not pair with it.)

**Step 2: subtract.**${steps(`\\angle ${name} = 180^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**Check.** The same rule gives the last angle, $\\angle ${last} = 180^\\circ - ${h}^\\circ = ${180 - h}^\\circ$, and the four angles of any quadrilateral add to $360^\\circ$: $${qd.angles[0]}^\\circ + ${qd.angles[1]}^\\circ + ${qd.angles[2]}^\\circ + ${qd.angles[3]}^\\circ = 360^\\circ$.`,
              `**第一步：对角。** 沿 $ABCD$ 绕一圈，$${name}$ 对面的顶点是 $${on1}$，所以 $\\angle ${name}$ 与 $\\angle ${on1} = ${g}^\\circ$ 是对角。它们所对的弧合起来是整个圆，所以它们互补。（$\\angle ${on2}$ 与 $\\angle ${name}$ 相邻，不与它配对。）

**第二步：做减法。**${steps(`\\angle ${name} = 180^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**检验。** 用同样的规律求出最后一个角，$\\angle ${last} = 180^\\circ - ${h}^\\circ = ${180 - h}^\\circ$，而任何四边形的四个角之和是 $360^\\circ$：$${qd.angles[0]}^\\circ + ${qd.angles[1]}^\\circ + ${qd.angles[2]}^\\circ + ${qd.angles[3]}^\\circ = 360^\\circ$。`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [quadAngle(qd, 0, deg(qd.angles[0])), quadAngle(qd, 1, deg(qd.angles[1])), quadAngle(qd, ask, "?")]),
            `Quadrilateral ABCD inscribed in a circle; angle A is ${qd.angles[0]}° and angle B is ${qd.angles[1]}°.`,
            `内接于圆的四边形 ABCD；角 A 为 ${qd.angles[0]}°，角 B 为 ${qd.angles[1]}°。`,
          ),
          solutionFigures: [
            figure(
              quadMarks(qd, [
                ...quadArc(qd, opp, deg(2 * g), "action"),
                ...quadArc(qd, ask, deg(2 * ans), "result"),
                quadAngle(qd, opp, deg(g), "action"),
                quadAngle(qd, ask, deg(ans), "result"),
              ]),
              `Angle ${on1}, ${g}°, intercepts an arc of ${2 * g}°; the opposite angle ${name} intercepts the rest of the circle, ${2 * ans}°, so it is ${ans}°.`,
              `角 ${on1} 为 ${g}°，对着 ${2 * g}° 的弧；对角 ${name} 对着圆的其余部分 ${2 * ans}°，所以它是 ${ans}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "inscribed-quadrilaterals-with-algebra",
      figure: theoremDrawings["inscribed-quadrilaterals-with-algebra"],
      title: t("Inscribed quadrilaterals with algebra", "含未知数的圆内接四边形"),
      explanation: t(
        `When opposite angles are written with a variable, their sum is still $180^\\circ$, and that gives an equation.

If $\\angle A = (3x + 5)^\\circ$ and $\\angle C = (2x + 25)^\\circ$, then

$$(3x + 5) + (2x + 25) = 180, \\qquad 5x + 30 = 180, \\qquad 5x = 150, \\qquad x = 30.$$

Then $\\angle A = 95^\\circ$ and $\\angle C = 85^\\circ$, which add to $180^\\circ$.

> **Watch out.** Opposite angles add to $180^\\circ$, not $360^\\circ$ (all four angles) or $90^\\circ$. They are not equal in general, so do not set the two expressions equal to each other. Check that the two angles you use really are opposite, $A$ with $C$ or $B$ with $D$.`,
        `当对角用含变量的式子表示时，它们的和仍是 $180^\\circ$，由此得到一个方程。

若 $\\angle A = (3x + 5)^\\circ$，$\\angle C = (2x + 25)^\\circ$，则

$$(3x + 5) + (2x + 25) = 180, \\qquad 5x + 30 = 180, \\qquad 5x = 150, \\qquad x = 30.$$

于是 $\\angle A = 95^\\circ$，$\\angle C = 85^\\circ$，和是 $180^\\circ$。

> **注意。** 对角之和是 $180^\\circ$，不是 $360^\\circ$（那是四个角的和），也不是 $90^\\circ$。对角一般不相等，不要令两个式子相等。还要确认所用的两个角确实相对：$A$ 对 $C$，$B$ 对 $D$。`,
      ),
      generate(rng) {
        const qd = quad(rng);
        const i = rng.int(0, 1);
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, qd.angles[i]!, x);
        const [c2, d2] = expressionFor(rng, qd.angles[i + 2]!, x);
        const [n1, n2] = [letters[i]!, letters[i + 2]!];
        const [v1, v2] = [qd.angles[i]!, qd.angles[i + 2]!];
        const eq = `${angleTex(c1, d1)} + ${angleTex(c2, d2)} = 180^\\circ`;
        return {
          ...numberProblem({
            prompt: t("Quadrilateral $ABCD$ is inscribed in the circle. Find $x$.", "四边形 $ABCD$ 内接于圆。求 $x$。"),
            answer: x,
            solveFor: "x",
            wrong: sumWrong(c1, d1, c2, d2, 180, [360, 90]),
            solution: t(
              `**Step 1: write the equation.** $\\angle ${n1}$ and $\\angle ${n2}$ are opposite angles of the inscribed quadrilateral, so they are supplementary:${steps(eq)}**Step 2: solve.** Combine like terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(c1 + c2, d1 + d2, 0, 180)}{{figure 0}}

**Check.** With $x = ${x}$, $\\angle ${n1} = ${evalLinear(c1, d1, x)}^\\circ$ and $\\angle ${n2} = ${evalLinear(c2, d2, x)}^\\circ$. Their arcs should fill the circle: $2 \\cdot ${v1}^\\circ + 2 \\cdot ${v2}^\\circ = ${2 * v1}^\\circ + ${2 * v2}^\\circ = 360^\\circ$.`,
              `**第一步：列方程。** $\\angle ${n1}$ 与 $\\angle ${n2}$ 是圆内接四边形的对角，所以它们互补：${steps(eq)}**第二步：解方程。** 先合并同类项，再${collect["zh-CN"]}${solveLinear(c1 + c2, d1 + d2, 0, 180)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$\\angle ${n1} = ${evalLinear(c1, d1, x)}^\\circ$，$\\angle ${n2} = ${evalLinear(c2, d2, x)}^\\circ$。它们所对的弧应合成整个圆：$2 \\cdot ${v1}^\\circ + 2 \\cdot ${v2}^\\circ = ${2 * v1}^\\circ + ${2 * v2}^\\circ = 360^\\circ$。`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [quadAngle(qd, i, angleLabel(c1, d1)), quadAngle(qd, i + 2, angleLabel(c2, d2))]),
            `Quadrilateral ABCD inscribed in a circle; angle ${n1} is ${angleLabel(c1, d1)} and angle ${n2} is ${angleLabel(c2, d2)}.`,
            `内接于圆的四边形 ABCD；角 ${n1} 为 ${angleLabel(c1, d1)}，角 ${n2} 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              quadMarks(qd, [
                ...quadArc(qd, i, deg(2 * v1), "action"),
                ...quadArc(qd, i + 2, deg(2 * v2), "action"),
                quadAngle(qd, i, deg(v1), "result"),
                quadAngle(qd, i + 2, deg(v2), "result"),
              ]),
              `With x = ${x}, angle ${n1} is ${v1}° and angle ${n2} is ${v2}°; their arcs of ${2 * v1}° and ${2 * v2}° fill the circle.`,
              `x = ${x} 时，角 ${n1} 为 ${v1}°，角 ${n2} 为 ${v2}°；它们所对的 ${2 * v1}° 与 ${2 * v2}° 的弧合成整个圆。`,
            ),
          ],
        };
      },
    },
    {
      id: "angles-of-inscribed-quadrilaterals-from-arcs",
      figure: theoremDrawings["angles-of-inscribed-quadrilaterals-from-arcs"],
      title: t("Angles from arcs", "由弧求角"),
      explanation: t(
        `Each angle of an inscribed quadrilateral intercepts the arc between its two neighbors that does **not** contain the vertex itself: $\\angle A$ intercepts $${arcTex("BCD")}$, made of arcs $${arcTex("BC")}$ and $${arcTex("CD")}$. The angle is half of that arc.

If $m${arcTex("AB")} = 80^\\circ$, $m${arcTex("BC")} = 100^\\circ$ and $m${arcTex("CD")} = 110^\\circ$, then

$$\\angle A = \\frac{100^\\circ + 110^\\circ}{2} = 105^\\circ,$$

and $m${arcTex("DA")} = 360^\\circ - 290^\\circ = 70^\\circ$, so $\\angle B = \\frac{110^\\circ + 70^\\circ}{2} = 90^\\circ$.

> **Watch out.** Halve the intercepted arc: $210^\\circ$ is the arc, not the angle. Use the arc **away** from the vertex: halving the arcs next to $A$ gives the opposite angle, $180^\\circ - \\angle A$. And when the fourth arc is missing, find it from the $360^\\circ$ first.`,
        `圆内接四边形的每个角都对着它两个相邻顶点之间、**不含**该顶点的那段弧：$\\angle A$ 对着 $${arcTex("BCD")}$，它由弧 $${arcTex("BC")}$ 和弧 $${arcTex("CD")}$ 组成。角是这段弧的一半。

若 $m${arcTex("AB")} = 80^\\circ$，$m${arcTex("BC")} = 100^\\circ$，$m${arcTex("CD")} = 110^\\circ$，则

$$\\angle A = \\frac{100^\\circ + 110^\\circ}{2} = 105^\\circ,$$

且 $m${arcTex("DA")} = 360^\\circ - 290^\\circ = 70^\\circ$，所以 $\\angle B = \\frac{110^\\circ + 70^\\circ}{2} = 90^\\circ$。

> **注意。** 要把所对的弧取一半：$210^\\circ$ 是弧，不是角。要用**远离**顶点的那段弧：把 $A$ 两旁的弧取一半，得到的是对角 $180^\\circ - \\angle A$。缺第四段弧时，先用 $360^\\circ$ 把它求出来。`,
      ),
      generate(rng) {
        const qd = quad(rng);
        const [a1, a2, a3, a4] = qd.arcs;
        const ask = rng.pick([0, 1, 3] as const);
        const name = letters[ask];
        const answer = qd.angles[ask];
        const full = 2 * answer;
        const arcName = ["BCD", "CDA", "", "ABC"][ask]!;
        const fourth = `m${arcTex("DA")} = 360^\\circ - ${a1}^\\circ - ${a2}^\\circ - ${a3}^\\circ = ${a4}^\\circ`;
        const halfLine = [
          `\\angle A = \\frac{${a2}^\\circ + ${a3}^\\circ}{2} = ${answer}^\\circ`,
          `\\angle B = \\frac{${a3}^\\circ + ${a4}^\\circ}{2} = ${answer}^\\circ`,
          "",
          `\\angle D = \\frac{${a1}^\\circ + ${a2}^\\circ}{2} = ${answer}^\\circ`,
        ][ask]!;
        const opp = (ask + 2) % 4;
        const oppName = letters[opp];
        const oppAngle = qd.angles[opp];
        const oppArcName = ["DAB", "ABC", "", "CDA"][ask]!;
        const stepOne =
          ask === 1
            ? t(
                `**Step 1: the missing arc.** $\\angle B$ intercepts arc $${arcTex("CDA")}$, which runs from $C$ through $D$ to $A$, so it needs arc $${arcTex("DA")}$. The four arcs fill the circle:${steps(fourth)}`,
                `**第一步：缺少的弧。** $\\angle B$ 对着从 $C$ 经 $D$ 到 $A$ 的弧 $${arcTex("CDA")}$，所以需要弧 $${arcTex("DA")}$。四段弧合起来是整个圆：${steps(fourth)}`,
              )
            : t(
                `**Step 1: the intercepted arc.** The neighbors of $${name}$ are $${letters[(ask + 3) % 4]}$ and $${letters[(ask + 1) % 4]}$, and the arc between them that does not contain $${name}$ is $${arcTex(arcName)}$.

`,
                `**第一步：所对的弧。** $${name}$ 的相邻顶点是 $${letters[(ask + 3) % 4]}$ 和 $${letters[(ask + 1) % 4]}$，它们之间不含 $${name}$ 的弧是 $${arcTex(arcName)}$。

`,
              );
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
              `${stepOne.en}**Step 2: halve it.** $\\angle ${name}$ is an inscribed angle on arc $${arcTex(arcName)}$, so it is half of it:${steps(halfLine)}{{figure 0}}

**Check.** The opposite angle $\\angle ${oppName}$ intercepts the rest of the circle, arc $${arcTex(oppArcName)}$ of $360^\\circ - ${full}^\\circ = ${360 - full}^\\circ$, so $\\angle ${oppName} = \\frac{${360 - full}^\\circ}{2} = ${oppAngle}^\\circ$. Opposite angles are supplementary, and indeed $${answer}^\\circ + ${oppAngle}^\\circ = 180^\\circ$.`,
              `${stepOne["zh-CN"]}**第二步：取一半。** $\\angle ${name}$ 是弧 $${arcTex(arcName)}$ 所对的圆周角，所以等于它的一半：${steps(halfLine)}{{figure 0}}

**检验。** 对角 $\\angle ${oppName}$ 对着圆的其余部分，即弧 $${arcTex(oppArcName)}$，它是 $360^\\circ - ${full}^\\circ = ${360 - full}^\\circ$，所以 $\\angle ${oppName} = \\frac{${360 - full}^\\circ}{2} = ${oppAngle}^\\circ$。对角互补，确实 $${answer}^\\circ + ${oppAngle}^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            quadMarks(qd, [...quadArcLabels(qd, 3), quadAngle(qd, ask, "?")]),
            `Quadrilateral ABCD inscribed in a circle; arc AB is ${a1}°, arc BC is ${a2}° and arc CD is ${a3}°.`,
            `内接于圆的四边形 ABCD；弧 AB 为 ${a1}°，弧 BC 为 ${a2}°，弧 CD 为 ${a3}°。`,
          ),
          solutionFigures: [
            figure(
              quadMarks(qd, [
                ...arcAt(qd.at[(ask + 1) % 4]!, qd.at[(ask + 3) % 4]!, "action"),
                ...quadArcLabels(qd),
                quadAngle(qd, ask, deg(answer), "result"),
              ]),
              `Arc ${arcName}, ${full}°, is highlighted; angle ${name}, half of it, is ${answer}°. Arc DA is ${a4}°.`,
              `弧 ${arcName}（${full}°）被突出显示；角 ${name} 是它的一半，为 ${answer}°。弧 DA 为 ${a4}°。`,
            ),
          ],
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

/** rightAtA marks the right angle between the radius OA and the tangent at A. */
const rightAtA = (tg: Tangent): Mark => rightAt(tg.pa, O, tg.pp);

/** tangentIntro draws a tangent at A with the radius OA = 6, the tangent segment PA = 8 and OP = 10. */
const tangentIntro: Figure = (() => {
  const tg = tangentAt(250, 8 / 6, 1);
  return figure(
    tangentMarks(tg, [rightAtA(tg), sideOut(O, tg.pa, tg.pp, "6"), sideOut(tg.pa, tg.pp, O, "8"), sideOut(tg.pp, O, tg.pa, "10")]),
    "Circle O with a tangent at A through the point P. The radius OA is 6 and meets the tangent at a right angle; PA is 8 and OP is 10.",
    "圆 O，过点 P 的直线与圆相切于 A。半径 OA 为 6，与切线成直角；PA 为 8，OP 为 10。",
  );
})();

export const tangentLinesToCircles: TopicDef = {
  id: "tangent-lines-to-circles",
  title: t("Tangent Lines to Circles", "圆的切线"),
  summary: t(
    "A tangent is perpendicular to the radius at the point of tangency; use it to find angles and lengths and to test for tangency.",
    "切线垂直于过切点的半径；用它求角和长度，并判断直线是否为切线。",
  ),
  prerequisites: ["circles", "the-pythagorean-theorem"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `A line can cut a circle at two points, miss it, or just touch it at one point. A line that touches at exactly one point is a **tangent**, and the point is the **point of tangency**.

Why is a tangent at right angles to the radius there? Every point of the tangent other than $A$ lies outside the circle, so it is farther from the center $O$ than $A$ is. That makes $OA$ the **shortest** segment from $O$ to the line, and the shortest segment from a point to a line is the perpendicular one. So the radius $OA$ meets the tangent at $90^\\circ$.

Any point $P$ on the tangent therefore makes a right triangle $OAP$ with its right angle at $A$ and its hypotenuse $OP$. With radius $OA = 6$ and $PA = 8$:

{{figure 0}}

$$OP = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

In this lesson we use that right angle to find angles and lengths, and run it backward, with the converse of the Pythagorean theorem, to test whether a line is a tangent.`,
    `一条直线与圆可能有两个交点、没有交点，或者只在一点接触。只在一点与圆接触的直线叫**切线**，这个点叫**切点**。

为什么切线与过切点的半径成直角？切线上除 $A$ 以外的每一点都在圆外，所以它到圆心 $O$ 的距离都比 $A$ 远。这说明 $OA$ 是从 $O$ 到这条直线的**最短**线段，而点到直线的最短线段就是垂线段。所以半径 $OA$ 与切线成 $90^\\circ$。

于是切线上任意一点 $P$ 都与 $O$、$A$ 构成直角三角形 $OAP$，直角在 $A$，斜边是 $OP$。若半径 $OA = 6$，$PA = 8$：

{{figure 0}}

$$OP = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

这节课我们用这个直角求角和长度，再借助勾股定理的逆定理反过来判断一条直线是不是切线。`,
  ),
  introFigures: [tangentIntro],
  knowledgePoints: [
    {
      id: "tangents-are-perpendicular-to-radii",
      figure: theoremDrawings["tangents-are-perpendicular-to-radii"],
      title: t("Tangents are perpendicular to radii", "切线垂直于半径"),
      explanation: t(
        `A **tangent** to a circle is a line that touches the circle at exactly one point, the **point of tangency**. A tangent is **perpendicular** to the radius drawn to the point of tangency.

If $PA$ is tangent to circle $O$ at $A$, then $\\angle OAP = 90^\\circ$, and triangle $OAP$ is a right triangle. If $\\angle AOP = 52^\\circ$, then

$$\\angle APO = 180^\\circ - 90^\\circ - 52^\\circ = 38^\\circ.$$

> **Watch out.** The right angle is at $A$, where the radius meets the tangent, not at $O$ or $P$. Subtract both the right angle and the given angle from $180^\\circ$: $180^\\circ - 52^\\circ$ leaves out the right angle, and adding $90^\\circ$ instead of subtracting it gives more than the triangle can hold.`,
        `与圆只有一个公共点的直线叫圆的**切线**，这个公共点叫**切点**。切线**垂直于**过切点的半径。

若 $PA$ 与圆 $O$ 相切于 $A$，则 $\\angle OAP = 90^\\circ$，$\\triangle OAP$ 是直角三角形。若 $\\angle AOP = 52^\\circ$，则

$$\\angle APO = 180^\\circ - 90^\\circ - 52^\\circ = 38^\\circ.$$

> **注意。** 直角在半径与切线相交的 $A$ 处，而不在 $O$ 或 $P$ 处。要从 $180^\\circ$ 中同时减去直角和已知角：$180^\\circ - 52^\\circ$ 漏掉了直角；把 $90^\\circ$ 加上而不是减去，得到的角比三角形能容纳的还大。`,
      ),
      generate(rng) {
        const theta = rng.int(25, 70);
        const tg = tangentAt(rng.int(0, 359), Math.tan(rad(theta)), rng.pick([1, -1] as const));
        const atO = rng.bool();
        const g = atO ? theta : 90 - theta;
        const ans = 90 - g;
        const [given, asked] = atO ? ["AOP", "APO"] : ["APO", "AOP"];
        const atOMark = (label: string, tone?: Tone) => angleAt(O, tg.pa, tg.pp, label, tone);
        const atPMark = (label: string, tone?: Tone) => angleAt(tg.pp, tg.pa, O, label, tone);
        const marks = atO ? [atOMark(deg(g)), atPMark("?")] : [atPMark(deg(g)), atOMark("?")];
        const solved = atO ? [atOMark(deg(g)), atPMark(deg(ans), "result")] : [atPMark(deg(g)), atOMark(deg(ans), "result")];
        return {
          ...numberProblem({
            prompt: t(
              `$PA$ is tangent to circle $O$ at $A$. Find $\\angle ${asked}$.`,
              `$PA$ 与圆 $O$ 相切于 $A$。求 $\\angle ${asked}$。`,
            ),
            answer: ans,
            unit: "°",
            wrong: [180 - g, g, 90 + g],
            solution: t(
              `**Step 1: the right angle.** $OA$ is the radius to the point of tangency, and a tangent is perpendicular to it, so $\\angle OAP = 90^\\circ$.

**Step 2: the angle sum.** The angles of $\\triangle OAP$ add to $180^\\circ$:${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**Check.** The two acute angles of a right triangle are complementary: $${g}^\\circ + ${ans}^\\circ = 90^\\circ$. With the right angle at $A$, the three angles make $${g}^\\circ + ${ans}^\\circ + 90^\\circ = 180^\\circ$.`,
              `**第一步：直角。** $OA$ 是过切点的半径，切线垂直于它，所以 $\\angle OAP = 90^\\circ$。

**第二步：内角和。** $\\triangle OAP$ 的内角和是 $180^\\circ$：${steps(`\\angle ${asked} = 180^\\circ - 90^\\circ - ${g}^\\circ = ${ans}^\\circ`)}{{figure 0}}

**检验。** 直角三角形的两个锐角互余：$${g}^\\circ + ${ans}^\\circ = 90^\\circ$。加上 $A$ 处的直角，三个角之和是 $${g}^\\circ + ${ans}^\\circ + 90^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            tangentMarks(tg, marks),
            `Circle O with a tangent at A through the point P, and segments OA and OP; angle ${given} is ${g}°.`,
            `圆 O，过点 P 的直线与圆相切于 A，画有线段 OA、OP；角 ${given} 为 ${g}°。`,
          ),
          solutionFigures: [
            figure(
              tangentMarks(tg, [rightAtA(tg), ...solved]),
              `The radius OA meets the tangent at a right angle; angle ${given} is ${g}° and angle ${asked} is ${ans}°.`,
              `半径 OA 与切线成直角；角 ${given} 为 ${g}°，角 ${asked} 为 ${ans}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "lengths-with-tangents",
      figure: theoremDrawings["lengths-with-tangents"],
      title: t("Lengths with tangents", "与切线有关的长度"),
      explanation: t(
        `Since $\\angle OAP = 90^\\circ$, the radius $OA$ and the tangent segment $PA$ are the legs of a right triangle whose hypotenuse is $OP$, the side across from the right angle:

$$OA^2 + PA^2 = OP^2.$$

If the radius is $5$ cm and $OP = 13$ cm, then $PA^2 = 13^2 - 5^2 = 169 - 25 = 144$ and $PA = \\sqrt{144} = 12$ cm.

> **Watch out.** $OP$ is the hypotenuse, so a leg comes from **subtracting** squares, and the hypotenuse from adding them. Lengths do not add or subtract directly: $13 - 5 = 8$ and $5 + 12 = 17$ skip the squares. And the answer is the length you were asked for, not the other leg.`,
        `因为 $\\angle OAP = 90^\\circ$，半径 $OA$ 与切线段 $PA$ 是直角三角形的两条直角边，直角所对的 $OP$ 是斜边：

$$OA^2 + PA^2 = OP^2.$$

若半径是 $5$ 厘米，$OP = 13$ 厘米，则 $PA^2 = 13^2 - 5^2 = 169 - 25 = 144$，$PA = \\sqrt{144} = 12$ 厘米。

> **注意。** $OP$ 是斜边，所以求直角边要把平方**相减**，求斜边才把平方相加。长度本身不能直接加减：$13 - 5 = 8$ 和 $5 + 12 = 17$ 都跳过了平方。答案是题目问的那条线段，不是另一条直角边。`,
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
          [`OA^2 = ${h}^2 - ${tl}^2 = ${h * h} - ${tl * tl} = ${r * r}`, `OA = \\sqrt{${r * r}} = ${tex(r, u)}`],
          [`PA^2 = ${h}^2 - ${r}^2 = ${h * h} - ${r * r} = ${tl * tl}`, `PA = \\sqrt{${tl * tl}} = ${tex(tl, u)}`],
          [`OP^2 = ${r}^2 + ${tl}^2 = ${r * r} + ${tl * tl} = ${h * h}`, `OP = \\sqrt{${h * h}} = ${tex(h, u)}`],
        ][ask]!;
        const asked = [seg(O, tg.pa, "result"), seg(tg.pa, tg.pp, "result"), seg(O, tg.pp, "result")][ask]!;
        const all = [sideOut(O, tg.pa, tg.pp, len(r, u)), sideOut(tg.pa, tg.pp, O, len(tl, u)), sideOut(tg.pp, O, tg.pa, len(h, u))];
        const role = ask === 2 ? t("the hypotenuse", "斜边") : t("a leg", "一条直角边");
        return {
          ...numberProblem({
            prompt: t(`$PA$ is tangent to circle $O$ at $A$. Find $${askName}$.`, `$PA$ 与圆 $O$ 相切于 $A$。求 $${askName}$。`),
            answer,
            unit: u,
            wrong,
            solution: t(
              `**Step 1: the right triangle.** $OA$ is the radius to the point of tangency, so $OA \\perp PA$ and $\\angle OAP = 90^\\circ$. In $\\triangle OAP$ the hypotenuse is $OP$, across from the right angle, and $${askName}$ is ${role.en}.

**Step 2: the Pythagorean theorem.** $OA^2 + PA^2 = OP^2$:${steps(...work)}{{figure 0}}

**Check.** Put the three lengths back: $${r}^2 + ${tl}^2 = ${r * r} + ${tl * tl} = ${h * h} = ${h}^2$. And the hypotenuse is the longest side: $${h} > ${Math.max(r, tl)}$.`,
              `**第一步：直角三角形。** $OA$ 是过切点的半径，所以 $OA \\perp PA$，$\\angle OAP = 90^\\circ$。在 $\\triangle OAP$ 中，直角所对的 $OP$ 是斜边，$${askName}$ 是${role["zh-CN"]}。

**第二步：勾股定理。** $OA^2 + PA^2 = OP^2$：${steps(...work)}{{figure 0}}

**检验。** 把三条边代回去：$${r}^2 + ${tl}^2 = ${r * r} + ${tl * tl} = ${h * h} = ${h}^2$。并且斜边是最长的边：$${h} > ${Math.max(r, tl)}$。`,
            ),
          }),
          figure: figure(
            tangentMarks(tg, labels),
            `Circle O with a tangent at A through the point P, and segments OA and OP; two of OA, PA and OP are labeled.`,
            `圆 O，过点 P 的直线与圆相切于 A，画有线段 OA、OP；OA、PA、OP 中两条标出了长度。`,
          ),
          solutionFigures: [
            figure(
              tangentMarks(tg, [asked, rightAtA(tg), ...all]),
              `The right triangle OAP with the right angle at A: OA = ${r} ${u}, PA = ${tl} ${u} and OP = ${h} ${u}.`,
              `直角三角形 OAP，直角在 A：OA = ${r} ${u}，PA = ${tl} ${u}，OP = ${h} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "testing-for-tangency",
      figure: theoremDrawings["testing-for-tangency"],
      title: t("Testing for tangency", "判断是否相切"),
      explanation: t(
        `Conversely, a line through a point $A$ of the circle that is perpendicular to the radius $OA$ is a tangent. To test whether $PA$ is tangent, check whether $\\angle OAP = 90^\\circ$ with the converse of the Pythagorean theorem: is $OA^2 + PA^2 = OP^2$?

With $OA = 8$, $PA = 15$ and $OP = 17$: $8^2 + 15^2 = 64 + 225 = 289 = 17^2$, so the angle at $A$ is right and $PA$ is tangent. With $OP = 18$ instead, $289 \\ne 324$, so it is not.

> **Watch out.** Compare **squares**, not lengths: $8 + 15 = 23$ says nothing about the angle. Put the longest side, $OP$, alone on one side of the equation. Close is not enough: $289$ against $324$ means the angle is not $90^\\circ$, so the line cuts the circle.`,
        `反过来，过圆上一点 $A$ 且垂直于半径 $OA$ 的直线是切线。要判断 $PA$ 是否为切线，就用勾股定理的逆定理检验 $\\angle OAP$ 是否为 $90^\\circ$：$OA^2 + PA^2 = OP^2$ 是否成立？

当 $OA = 8$，$PA = 15$，$OP = 17$ 时：$8^2 + 15^2 = 64 + 225 = 289 = 17^2$，所以 $A$ 处是直角，$PA$ 是切线。若 $OP = 18$，则 $289 \\ne 324$，不是切线。

> **注意。** 比较的是**平方**，不是长度：$8 + 15 = 23$ 与角无关。把最长的边 $OP$ 单独放在等式一边。差不多也不行：$289$ 与 $324$ 不等，说明这个角不是 $90^\\circ$，直线与圆相交。`,
      ),
      generate(rng) {
        const [p0, q0, h0] = rng.pick(triples);
        const k = rng.int(1, 3);
        const [r, tl] = rng.bool() ? [p0 * k, q0 * k] : [q0 * k, p0 * k];
        const yes = rng.bool();
        const off = rng.pick([-2, -1, 1, 2]);
        // P must stay outside the circle, so OP stays longer than the radius.
        const h = yes ? h0 * k : h0 * k + off > r ? h0 * k + off : h0 * k + Math.abs(off);
        const u = pickUnit(rng);
        const sum = r * r + tl * tl;
        const acute = sum > h * h;
        const squares = `OA^2 + PA^2 = ${r}^2 + ${tl}^2 = ${r * r} + ${tl * tl} = ${sum}`;
        const hyp = `OP^2 = ${h}^2 = ${h * h}`;
        const need = h * h - r * r;
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `Circle $O$ has radius $OA = ${tex(r, u)}$, where $A$ is on the circle. Point $P$ is outside the circle with $PA = ${tex(tl, u)}$ and $OP = ${tex(h, u)}$. Is $PA$ tangent to the circle?`,
                `圆 $O$ 的半径 $OA = ${tex(r, u)}$，$A$ 在圆上。点 $P$ 在圆外，$PA = ${tex(tl, u)}$，$OP = ${tex(h, u)}$。$PA$ 是圆的切线吗？`,
              ),
              options: yesNo,
              correct: yes ? 0 : 1,
              solution: t(
                `**Step 1: what tangency needs.** $PA$ is tangent at $A$ exactly when it is perpendicular to the radius $OA$, that is, when $\\angle OAP = 90^\\circ$. By the converse of the Pythagorean theorem, that happens exactly when $OA^2 + PA^2 = OP^2$, with $OP$ the longest side.

**Step 2: compare the squares.**${steps(squares, hyp)}${
                  yes
                    ? `They are equal, so $\\angle OAP = 90^\\circ$ and $PA$ is tangent to the circle.`
                    : `They differ, so $\\angle OAP \\ne 90^\\circ$: since $${sum} ${acute ? ">" : "<"} ${h * h}$, the angle at $A$ is ${acute ? "acute" : "obtuse"}, and $PA$ is not tangent.`
                }

**Check.** Work from the other end: if $PA$ were tangent, the right triangle would force $PA^2 = OP^2 - OA^2 = ${h * h} - ${r * r} = ${need}$. ${
                  yes
                    ? `And $PA^2 = ${tl}^2 = ${tl * tl}$, the same, so the answer holds.`
                    : `But $PA^2 = ${tl}^2 = ${tl * tl} \\ne ${need}$, so $PA$ cannot be tangent.`
                }`,
                `**第一步：相切的条件。** $PA$ 在 $A$ 处相切，当且仅当它垂直于半径 $OA$，即 $\\angle OAP = 90^\\circ$。由勾股定理的逆定理，这当且仅当 $OA^2 + PA^2 = OP^2$（$OP$ 是最长边）。

**第二步：比较平方。**${steps(squares, hyp)}${
                  yes
                    ? `两者相等，所以 $\\angle OAP = 90^\\circ$，$PA$ 是圆的切线。`
                    : `两者不等，所以 $\\angle OAP \\ne 90^\\circ$：因为 $${sum} ${acute ? ">" : "<"} ${h * h}$，$A$ 处的角是${acute ? "锐角" : "钝角"}，$PA$ 不是切线。`
                }

**检验。** 从另一头算：如果 $PA$ 是切线，直角三角形要求 $PA^2 = OP^2 - OA^2 = ${h * h} - ${r * r} = ${need}$。${
                  yes
                    ? `而 $PA^2 = ${tl}^2 = ${tl * tl}$，正好相同，结论成立。`
                    : `但 $PA^2 = ${tl}^2 = ${tl * tl} \\ne ${need}$，所以 $PA$ 不可能是切线。`
                }`,
              ),
            }),
          },
          yes
            ? [
                [
                  "No",
                  `OA² + PA² = ${sum} = OP², so the angle at A is 90° and PA is tangent.`,
                  `OA² + PA² = ${sum} = OP²，所以 A 处是 90°，PA 是切线。`,
                ],
              ]
            : [
                [
                  "Yes",
                  `OA² + PA² = ${sum} but OP² = ${h * h}, so the angle at A is not 90°.`,
                  `OA² + PA² = ${sum}，而 OP² = ${h * h}，所以 A 处的角不是 90°。`,
                ],
              ],
        );
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

/** rightAngles marks the right angles at A and B between the radii and the tangents. */
const rightAngles = (tt: TwoTangents): Mark[] => [rightAt(tt.pa, O, tt.pp), rightAt(tt.pb, O, tt.pp)];

/** equalTangents ticks the two tangent segments PA and PB twice, and the radii OA and OB once. */
const equalTangents = (tt: TwoTangents): Mark[] => [tick(tt.pp, tt.pa, 2), tick(tt.pp, tt.pb, 2), tick(O, tt.pa), tick(O, tt.pb)];

/** twoTangentsIntro draws two tangents from P to a circle of radius 5 with OP = 13, so that PA = PB = 12. */
const twoTangentsIntro: Figure = (() => {
  const tt = twoTangents(200, (Math.acos(5 / 13) * 180) / Math.PI);
  return figure(
    twoTangentMarks(tt, [...rightAngles(tt), ...equalTangents(tt), sideOut(tt.pp, O, tt.pa, "13")], true, true),
    "Circle O with tangents from P touching it at A and B, the radii OA and OB of 5, and OP = 13. The right angles at A and B are marked, and the equal tangent segments PA and PB, 12 each, are ticked.",
    "圆 O，从 P 引两条切线，切点为 A、B，半径 OA、OB 为 5，OP = 13。A、B 处标有直角，相等的切线段 PA、PB 都是 12，标有记号。",
  );
})();

export const tangentTangentLinesToCircles: TopicDef = {
  id: "tangent-tangent-lines-to-circles",
  title: t("Tangent-Tangent Lines to Circles", "从圆外一点引的两条切线"),
  summary: t(
    "Two tangent segments from an external point are equal, and the angle between them is supplementary to the central angle.",
    "从圆外一点引的两条切线段相等，它们的夹角与圆心角互补。",
  ),
  prerequisites: ["tangent-lines-to-circles", "central-angles-and-arcs", "angles-of-polygons"],
  encompasses: [{ topic: "tangent-lines-to-circles", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `From a point $P$ outside a circle, exactly two tangents can be drawn, touching the circle at $A$ and $B$. Draw the radii $OA$ and $OB$ and the segment $OP$:

{{figure 0}}

Each radius meets its tangent at $90^\\circ$, so $\\triangle OAP$ and $\\triangle OBP$ are right triangles. They share the hypotenuse $OP$, and their legs $OA$ and $OB$ are equal radii. Two right triangles with equal hypotenuses and an equal leg are congruent (HL), so everything else matches too: the **tangent segments are equal**, $PA = PB$, and $OP$ splits both the angle at $P$ and the angle at $O$ in half.

With radius $5$ and $OP = 13$, each tangent segment is

$$PA = PB = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12.$$

The quadrilateral $OAPB$ also has two right angles, so its other two angles, at $O$ and at $P$, share $360^\\circ - 180^\\circ = 180^\\circ$. In this lesson we use the equal segments, that supplementary pair, and the halves made by $OP$.`,
    `从圆外一点 $P$ 恰好可以作圆的两条切线，切点为 $A$ 和 $B$。画出半径 $OA$、$OB$ 和线段 $OP$：

{{figure 0}}

每条半径都与它的切线成 $90^\\circ$，所以 $\\triangle OAP$ 与 $\\triangle OBP$ 都是直角三角形。它们有公共的斜边 $OP$，直角边 $OA$ 与 $OB$ 是相等的半径。斜边和一条直角边分别相等的两个直角三角形全等（HL），所以其余部分也都对应相等：**切线长相等**，$PA = PB$，并且 $OP$ 把 $P$ 处的角和 $O$ 处的角都平分。

若半径为 $5$，$OP = 13$，每条切线段长

$$PA = PB = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12.$$

四边形 $OAPB$ 有两个直角，所以另外两个角（$O$ 处和 $P$ 处）分享 $360^\\circ - 180^\\circ = 180^\\circ$。这节课我们运用相等的切线长、这对互补的角，以及 $OP$ 分出的两半。`,
  ),
  introFigures: [twoTangentsIntro],
  knowledgePoints: [
    {
      id: "tangent-segments-are-equal",
      figure: theoremDrawings["tangent-segments-are-equal"],
      title: t("Tangent segments are equal", "切线长相等"),
      explanation: t(
        `From a point $P$ outside a circle, two tangents can be drawn, touching the circle at $A$ and $B$. The **tangent segments** are equal:

$$PA = PB.$$

(Triangles $OAP$ and $OBP$ are right triangles with the same hypotenuse $OP$ and equal legs $OA = OB$, so they are congruent.) If $PA = 3x - 4$ and $PB = x + 10$, then $3x - 4 = x + 10$, so $2x = 14$, $x = 7$ and $PA = PB = 17$.

> **Watch out.** When a term crosses the equals sign, its sign changes: $3x - 4 = x + 10$ gives $2x = 14$, not $2x = 6$. If the question asks for the length, $x = 7$ is not the end: put it back into $PA$. And $PA$ is one segment, not $PA + PB$.`,
        `从圆外一点 $P$ 可以作圆的两条切线，切点为 $A$ 和 $B$。两条**切线长**相等：

$$PA = PB.$$

（$\\triangle OAP$ 与 $\\triangle OBP$ 都是直角三角形，斜边 $OP$ 公共，直角边 $OA = OB$，所以它们全等。）若 $PA = 3x - 4$，$PB = x + 10$，则 $3x - 4 = x + 10$，$2x = 14$，$x = 7$，$PA = PB = 17$。

> **注意。** 移项要变号：由 $3x - 4 = x + 10$ 得 $2x = 14$，不是 $2x = 6$。如果题目问的是长度，求出 $x = 7$ 还没完，要代回 $PA$。$PA$ 是一条线段，不是 $PA + PB$。`,
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
        const eq = `${linear(c1, d1)} = ${linear(c2, d2)}`;
        const solve = steps(`${linear(c1 - c2, 0)} = ${d2 - d1}`, ...(c1 - c2 !== 1 ? [`x = ${q(d2 - d1, c1 - c2).toLatex()}`] : []));
        const pa = `PA = ${evalLinear(c1, d1, x)}\\text{ ${u}}`;
        const lengths: Mark[] = [sideOut(tt.pa, tt.pp, O, len(L, u)), sideOut(tt.pp, tt.pb, O, len(L, u))];
        const stepsEn = `**Step 1: write the equation.** Tangent segments from the same outside point are equal, so $PA = PB$:${steps(eq)}**Step 2: solve.** ${collect.en}${solve}`;
        const stepsZh = `**第一步：列方程。** 从圆外同一点引的切线长相等，所以 $PA = PB$：${steps(eq)}**第二步：解方程。** ${collect["zh-CN"]}${solve}`;
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
              ? t(
                  `${stepsEn}{{figure 0}}

**Check.** With $x = ${x}$, $PA = ${evalLinear(c1, d1, x)}$ and $PB = ${evalLinear(c2, d2, x)}$: the two tangent segments come out equal, as they must.`,
                  `${stepsZh}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，$PA = ${evalLinear(c1, d1, x)}$，$PB = ${evalLinear(c2, d2, x)}$：两条切线段相等，正应如此。`,
                )
              : t(
                  `${stepsEn}**Step 3: the length.** Put $x = ${x}$ back into $PA$:${steps(pa)}{{figure 0}}

**Check.** The other segment must come out the same: $PB = ${evalLinear(c2, d2, x)}$, equal to $PA$.`,
                  `${stepsZh}**第三步：求长度。** 把 $x = ${x}$ 代回 $PA$：${steps(pa)}{{figure 0}}

**检验。** 另一条线段应得到同样的长度：$PB = ${evalLinear(c2, d2, x)}$，与 $PA$ 相等。`,
                ),
          }),
          figure: figure(
            twoTangentMarks(tt, [sideOut(tt.pa, tt.pp, O, plain(c1, d1)), sideOut(tt.pp, tt.pb, O, plain(c2, d2))], false),
            `Circle O with tangents from P touching it at A and B; PA is ${plain(c1, d1)} and PB is ${plain(c2, d2)}.`,
            `圆 O，从 P 引两条切线，切点为 A、B；PA 为 ${plain(c1, d1)}，PB 为 ${plain(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              twoTangentMarks(tt, [...rightAngles(tt), ...equalTangents(tt), ...lengths], true, true),
              `The radii meet the tangents at right angles, and the congruent right triangles OAP and OBP make PA = PB = ${L} ${u} when x = ${x}.`,
              `半径与切线成直角，全等的直角三角形 OAP 与 OBP 使 PA = PB；x = ${x} 时它们都是 ${L} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-angle-between-two-tangents",
      figure: theoremDrawings["the-angle-between-two-tangents"],
      title: t("The angle between two tangents", "两条切线的夹角"),
      explanation: t(
        `In quadrilateral $OAPB$ the angles at $A$ and $B$ are right angles, and the four angles add to $360^\\circ$. So the angle between the tangents and the central angle are **supplementary**:

$$\\angle APB + \\angle AOB = 360^\\circ - 90^\\circ - 90^\\circ = 180^\\circ.$$

If $\\angle AOB = 130^\\circ$, then $\\angle APB = 50^\\circ$. The central angle equals the minor arc $${arcTex("AB")}$, so the angle can also come from an arc: if the major arc measures $250^\\circ$, the minor arc is $110^\\circ$ and $\\angle APB = 70^\\circ$.

> **Watch out.** The two angles are supplementary, not equal, and they do not add to $360^\\circ$: the right angles at $A$ and $B$ take $180^\\circ$ of it. The central angle is the **minor** arc, so a major arc must first be subtracted from $360^\\circ$; halving it gives an inscribed angle, not this one.`,
        `在四边形 $OAPB$ 中，$A$、$B$ 处是直角，四个角之和是 $360^\\circ$。所以两切线的夹角与圆心角**互补**：

$$\\angle APB + \\angle AOB = 360^\\circ - 90^\\circ - 90^\\circ = 180^\\circ.$$

若 $\\angle AOB = 130^\\circ$，则 $\\angle APB = 50^\\circ$。圆心角等于劣弧 $${arcTex("AB")}$ 的度数，所以也可以由弧求这个角：若优弧是 $250^\\circ$，则劣弧是 $110^\\circ$，$\\angle APB = 70^\\circ$。

> **注意。** 这两个角互补，不相等，和也不是 $360^\\circ$：$A$、$B$ 处的直角占去了其中的 $180^\\circ$。圆心角等于**劣弧**，所以给出优弧时要先从 $360^\\circ$ 中减去；把优弧取一半得到的是圆周角，不是这个角。`,
      ),
      generate(rng) {
        const phi = rng.int(25, 70);
        const c = 2 * phi;
        const p = 180 - c;
        const tt = twoTangents(rng.int(0, 359), phi);
        const kind = rng.int(0, 2);
        const angleP = (label: string, tone?: Tone) => angleAt(tt.pp, tt.pa, tt.pb, label, tone);
        const angleO = (label: string, tone?: Tone) => angleAt(O, tt.pa, tt.pb, label, tone);
        const minor = (tone?: Tone): Mark[] => [...arcAt(tt.s - phi, tt.s + phi, tone), arcTextIn(tt.s - phi, tt.s + phi, deg(c))];
        const desc = t(
          "Circle O with tangents from P touching it at A and B, and radii OA and OB.",
          "圆 O，从 P 引两条切线，切点为 A、B，画有半径 OA、OB。",
        );
        const quadSum = `90^\\circ + 90^\\circ + ${c}^\\circ + ${p}^\\circ = 360^\\circ`;
        const rights = t(
          `**Step 1: the right angles.** Each radius meets its tangent at the point of tangency at a right angle: $\\angle OAP = \\angle OBP = 90^\\circ$. The angles of quadrilateral $OAPB$ add to $360^\\circ$, so the other two share $360^\\circ - 180^\\circ = 180^\\circ$: $\\angle APB$ and $\\angle AOB$ are supplementary.

`,
          `**第一步：直角。** 每条半径都在切点处与切线成直角：$\\angle OAP = \\angle OBP = 90^\\circ$。四边形 $OAPB$ 的内角和是 $360^\\circ$，所以另外两个角分享 $360^\\circ - 180^\\circ = 180^\\circ$：$\\angle APB$ 与 $\\angle AOB$ 互补。

`,
        );
        const check = t(
          `**Check.** Add the four angles of $OAPB$: $${quadSum}$.`,
          `**检验。** 把四边形 $OAPB$ 的四个角加起来：$${quadSum}$。`,
        );
        const solvedFigure = (withMinor: boolean, asked: "P" | "O") =>
          figure(
            twoTangentMarks(tt, [
              ...rightAngles(tt),
              ...(withMinor ? minor("action") : []),
              angleO(deg(c), asked === "O" ? "result" : "action"),
              angleP(deg(p), asked === "P" ? "result" : "action"),
            ]),
            `The right angles at A and B; the central angle AOB is ${c}° and the angle APB between the tangents is ${p}°.`,
            `A、B 处是直角；圆心角 AOB 为 ${c}°，两切线的夹角 APB 为 ${p}°。`,
          );
        if (kind === 0) {
          return {
            ...numberProblem({
              prompt: t("$PA$ and $PB$ are tangent to circle $O$. Find $\\angle APB$.", "$PA$、$PB$ 是圆 $O$ 的切线。求 $\\angle APB$。"),
              answer: p,
              unit: "°",
              wrong: [c, 360 - c, phi],
              solution: t(
                `${rights.en}**Step 2: subtract.**${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}{{figure 0}}

${check.en}`,
                `${rights["zh-CN"]}**第二步：做减法。**${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}{{figure 0}}

${check["zh-CN"]}`,
              ),
            }),
            figure: figure(twoTangentMarks(tt, [angleO(deg(c)), angleP("?")]), desc.en, desc["zh-CN"]),
            solutionFigures: [solvedFigure(false, "P")],
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
                `${rights.en}**Step 2: subtract.**${steps(`\\angle AOB = 180^\\circ - ${p}^\\circ = ${c}^\\circ`)}{{figure 0}}

${check.en}`,
                `${rights["zh-CN"]}**第二步：做减法。**${steps(`\\angle AOB = 180^\\circ - ${p}^\\circ = ${c}^\\circ`)}{{figure 0}}

${check["zh-CN"]}`,
              ),
            }),
            figure: figure(twoTangentMarks(tt, [angleP(deg(p)), angleO("?")]), desc.en, desc["zh-CN"]),
            solutionFigures: [solvedFigure(false, "O")],
          };
        }
        const M = 360 - c;
        const minorLine = `m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${c}^\\circ`;
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
              `**Step 1: the minor arc.** The two arcs between $A$ and $B$ fill the circle, and the central angle $\\angle AOB$ equals the minor one:${steps(minorLine)}So $\\angle AOB = ${c}^\\circ$.

${rights.en.replace("**Step 1: the right angles.**", "**Step 2: the right angles.**")}**Step 3: subtract.**${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}{{figure 0}}

**Check.** The four angles of $OAPB$ add up: $${quadSum}$. And the major arc minus the minor arc, halved, gives the same angle: $\\frac{${M}^\\circ - ${c}^\\circ}{2} = ${p}^\\circ$.`,
              `**第一步：劣弧。** $A$、$B$ 之间的两段弧合起来是整个圆，圆心角 $\\angle AOB$ 等于其中的劣弧：${steps(minorLine)}所以 $\\angle AOB = ${c}^\\circ$。

${rights["zh-CN"].replace("**第一步：直角。**", "**第二步：直角。**")}**第三步：做减法。**${steps(`\\angle APB = 180^\\circ - ${c}^\\circ = ${p}^\\circ`)}{{figure 0}}

**检验。** 四边形 $OAPB$ 的四个角之和：$${quadSum}$。另外，优弧减去劣弧再取一半，也得到同一个角：$\\frac{${M}^\\circ - ${c}^\\circ}{2} = ${p}^\\circ$。`,
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
          solutionFigures: [solvedFigure(true, "P")],
        };
      },
    },
    {
      id: "the-line-to-the-center",
      figure: theoremDrawings["the-line-to-the-center"],
      title: t("The line to the center", "连接圆心的线段"),
      explanation: t(
        `Two tangents drawn from the same outside point are equal in length, and the segment from that point to the center splits the figure into two congruent right triangles.

The congruent right triangles $OAP$ and $OBP$ show that $OP$ **bisects** both $\\angle APB$ and $\\angle AOB$:

$$\\angle APO = \\angle BPO = \\tfrac{1}{2}\\angle APB, \\qquad \\angle AOP = 90^\\circ - \\angle APO.$$

If $\\angle APB = 64^\\circ$, then $\\angle APO = 32^\\circ$ and $\\angle AOP = 58^\\circ$.

> **Watch out.** $OP$ cuts the angle at $P$ in **half**, so $\\angle APO$ is half of $\\angle APB$, not all of it. $\\angle AOP$ and $\\angle APO$ are the acute angles of one right triangle, so they add to $90^\\circ$, not $180^\\circ$. Keep track of which triangle and which vertex each angle belongs to.`,
        `从圆外同一点引出的两条切线长度相等，这一点到圆心的线段把图形分成两个全等的直角三角形。

全等的直角三角形 $OAP$ 与 $OBP$ 说明 $OP$ 同时**平分** $\\angle APB$ 和 $\\angle AOB$：

$$\\angle APO = \\angle BPO = \\tfrac{1}{2}\\angle APB, \\qquad \\angle AOP = 90^\\circ - \\angle APO.$$

若 $\\angle APB = 64^\\circ$，则 $\\angle APO = 32^\\circ$，$\\angle AOP = 58^\\circ$。

> **注意。** $OP$ 把 $P$ 处的角**平分**，所以 $\\angle APO$ 是 $\\angle APB$ 的一半，而不是整个角。$\\angle AOP$ 与 $\\angle APO$ 是同一个直角三角形的两个锐角，和是 $90^\\circ$，不是 $180^\\circ$。要分清每个角属于哪个三角形、在哪个顶点。`,
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
        const congruent = t(
          `**Step 1: the congruent halves.** $\\triangle OAP$ and $\\triangle OBP$ have right angles at $A$ and $B$, the common hypotenuse $OP$, and equal legs $OA = OB$, so they are congruent (HL). Their matching angles are equal, so $OP$ cuts both the angle at $P$ and the angle at $O$ in half.

`,
          `**第一步：全等的两半。** $\\triangle OAP$ 与 $\\triangle OBP$ 在 $A$、$B$ 处是直角，有公共斜边 $OP$，直角边 $OA = OB$，所以它们全等（HL）。对应角相等，所以 $OP$ 把 $P$ 处的角和 $O$ 处的角都平分。

`,
        );
        const solved = (marks: readonly Mark[], en: string, zh: string) =>
          figure(twoTangentMarks(tt, [...rightAngles(tt), tick(tt.pp, tt.pa, 2), tick(tt.pp, tt.pb, 2), ...marks], true, true), en, zh);
        const halfCheck = t(
          `the central angle is $\\angle AOB = 180^\\circ - ${p}^\\circ = ${2 * phi}^\\circ$ (it is supplementary to $\\angle APB$ in $OAPB$), and $OP$ halves it: $\\angle AOP = ${phi}^\\circ$.`,
          `圆心角 $\\angle AOB = 180^\\circ - ${p}^\\circ = ${2 * phi}^\\circ$（在四边形 $OAPB$ 中它与 $\\angle APB$ 互补），$OP$ 把它平分：$\\angle AOP = ${phi}^\\circ$。`,
        );
        if (kind === 0) {
          return {
            ...numberProblem({
              prompt: prompt("APO"),
              answer: p / 2,
              unit: "°",
              wrong: [p, phi, 180 - p],
              solution: t(
                `${congruent.en}**Step 2: halve the angle at $P$.**${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}{{figure 0}}

**Check.** By a second route, ${halfCheck.en} The angles of $\\triangle OAP$ then add up: $${p / 2}^\\circ + ${phi}^\\circ + 90^\\circ = 180^\\circ$.`,
                `${congruent["zh-CN"]}**第二步：把 $P$ 处的角取一半。**${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}{{figure 0}}

**检验。** 换一条途径：${halfCheck["zh-CN"]}于是 $\\triangle OAP$ 的内角和正好是 $${p / 2}^\\circ + ${phi}^\\circ + 90^\\circ = 180^\\circ$。`,
              ),
            }),
            figure: figure(
              twoTangentMarks(tt, [angleAt(tt.pp, tt.pa, tt.pb, deg(p)), angleAt(tt.pp, tt.pa, O, "?")], true, true),
              desc.en,
              desc["zh-CN"],
            ),
            solutionFigures: [
              solved(
                [angleAt(tt.pp, tt.pa, O, deg(p / 2), "result"), angleAt(tt.pp, O, tt.pb, deg(p / 2), "result")],
                `OP halves the ${p}° angle at P into two angles of ${p / 2}°.`,
                `OP 把 P 处 ${p}° 的角平分成两个 ${p / 2}° 的角。`,
              ),
            ],
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
                `${congruent.en}**Step 2: half the angle at $P$.**${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}**Step 3: the right triangle.** In $\\triangle OAP$ the angle at $A$ is $90^\\circ$, so the two acute angles are complementary:${steps(`\\angle AOP = 90^\\circ - ${p / 2}^\\circ = ${phi}^\\circ`)}{{figure 0}}

**Check.** By a second route, ${halfCheck.en}`,
                `${congruent["zh-CN"]}**第二步：$P$ 处角的一半。**${steps(`\\angle APO = \\frac{${p}^\\circ}{2} = ${p / 2}^\\circ`)}**第三步：直角三角形。** 在 $\\triangle OAP$ 中 $A$ 处是 $90^\\circ$，所以两个锐角互余：${steps(`\\angle AOP = 90^\\circ - ${p / 2}^\\circ = ${phi}^\\circ`)}{{figure 0}}

**检验。** 换一条途径：${halfCheck["zh-CN"]}`,
              ),
            }),
            figure: figure(
              twoTangentMarks(tt, [angleAt(tt.pp, tt.pa, tt.pb, deg(p)), angleAt(O, tt.pa, tt.pp, "?")], true, true),
              desc.en,
              desc["zh-CN"],
            ),
            solutionFigures: [
              solved(
                [angleAt(tt.pp, tt.pa, O, deg(p / 2), "action"), angleAt(O, tt.pa, tt.pp, deg(phi), "result")],
                `In the right triangle OAP, angle APO is ${p / 2}° and angle AOP is ${phi}°.`,
                `在直角三角形 OAP 中，角 APO 为 ${p / 2}°，角 AOP 为 ${phi}°。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: prompt("OPB"),
            answer: 90 - phi,
            unit: "°",
            wrong: [phi, 180 - 2 * phi, 2 * phi],
            solution: t(
              `${congruent.en}**Step 2: carry the angle across.** Matching angles of the congruent triangles are equal: $\\angle BOP = \\angle AOP = ${phi}^\\circ$.

**Step 3: the right triangle.** In $\\triangle OBP$ the angle at $B$ is $90^\\circ$, so the two acute angles are complementary:${steps(`\\angle OPB = 90^\\circ - ${phi}^\\circ = ${90 - phi}^\\circ`)}{{figure 0}}

**Check.** By a second route: the central angle is $\\angle AOB = 2 \\cdot ${phi}^\\circ = ${2 * phi}^\\circ$, so the angle between the tangents is $\\angle APB = 180^\\circ - ${2 * phi}^\\circ = ${p}^\\circ$, and $OP$ halves it: $\\frac{${p}^\\circ}{2} = ${90 - phi}^\\circ$.`,
              `${congruent["zh-CN"]}**第二步：把角搬过去。** 全等三角形的对应角相等：$\\angle BOP = \\angle AOP = ${phi}^\\circ$。

**第三步：直角三角形。** 在 $\\triangle OBP$ 中 $B$ 处是 $90^\\circ$，所以两个锐角互余：${steps(`\\angle OPB = 90^\\circ - ${phi}^\\circ = ${90 - phi}^\\circ`)}{{figure 0}}

**检验。** 换一条途径：圆心角 $\\angle AOB = 2 \\cdot ${phi}^\\circ = ${2 * phi}^\\circ$，所以两切线的夹角 $\\angle APB = 180^\\circ - ${2 * phi}^\\circ = ${p}^\\circ$，$OP$ 把它平分：$\\frac{${p}^\\circ}{2} = ${90 - phi}^\\circ$。`,
            ),
          }),
          figure: figure(
            twoTangentMarks(tt, [angleAt(O, tt.pa, tt.pp, deg(phi)), angleAt(tt.pp, O, tt.pb, "?")], true, true),
            desc.en,
            desc["zh-CN"],
          ),
          solutionFigures: [
            solved(
              [
                angleAt(O, tt.pa, tt.pp, deg(phi), "action"),
                angleAt(O, tt.pp, tt.pb, deg(phi), "action"),
                angleAt(tt.pp, O, tt.pb, deg(90 - phi), "result"),
              ],
              `Angles AOP and BOP are both ${phi}°, and in the right triangle OBP, angle OPB is ${90 - phi}°.`,
              `角 AOP 与角 BOP 都是 ${phi}°，在直角三角形 OBP 中，角 OPB 为 ${90 - phi}°。`,
            ),
          ],
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
  return chordsAt(s, p, u, w);
}

/** chordsAt places A at s and arcs AB = p, BC = u and CD = w, with the chords AC and BD meeting at E. */
function chordsAt(s: number, p: number, u: number, w: number): Chords {
  const at = [s, s + p, s + p + u, s + p + u + w] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2]), on(at[3])] as const;
  return { at, pts, e: meet(pts[0], pts[2], pts[1], pts[3]), p, w };
}

/** ArcTones are the tones of the two arcs and the angle of a secant figure. */
interface ArcTones {
  readonly first?: Tone;
  readonly second?: Tone;
  readonly angle?: Tone;
}

/** chordMarks draws the intersecting chords AC and BD, arcs AB and CD with labels, and the extra marks. */
function chordMarks(ch: Chords, labelAB: string, labelCD: string, extra: readonly Mark[], tones: ArcTones = {}): Mark[] {
  const [a, b, c, d] = ch.at;
  const [pa, pb, pc, pd] = ch.pts;
  return [
    circleAt(),
    seg(pa, pc),
    seg(pb, pd),
    ...arcAt(a, b, tones.first),
    ...arcAt(c, d, tones.second),
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
  return secantsAt(s, n, x, f);
}

/** secantsAt places C at s and arcs CA = n, AB = x and BD = f, with the secants BA and DC meeting at P. */
function secantsAt(s: number, n: number, x: number, f: number): Secants {
  const at = [s, s + n, s + n + x, s + n + x + f] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2]), on(at[3])] as const;
  return { at, pts, pp: meet(pts[1], pts[2], pts[0], pts[3]) };
}

/** secantMarks draws the secants from P, the near arc CA and far arc BD with labels, the angle at P, and the extra marks. */
function secantMarks(sc: Secants, near: string, far: string, angle: string, extra: readonly Mark[] = [], tones: ArcTones = {}): Mark[] {
  const [c, a, b, d] = sc.at;
  const [pc, pa, pb, pd] = sc.pts;
  return [
    circleAt(),
    seg(sc.pp, pb),
    seg(sc.pp, pd),
    ...arcAt(c, a, tones.first),
    ...arcAt(b, d, tones.second),
    arcTextIn(c, a, near),
    arcText(b, d, far),
    angleAt(sc.pp, pa, pc, angle, tones.angle),
    ...extra,
    ...pointsAt([
      [c, "C"],
      [a, "A"],
      [b, "B"],
      [d, "D"],
    ]),
    ...outside(sc.pp),
  ];
}

/** chordsIntro draws chords AC and BD meeting at E with arcs AB = 100° and CD = 40°, and the chord BC that splits the angle into 50° and 20°. */
const chordsIntro: Figure = (() => {
  const ch = chordsAt(150, 100, 90, 40);
  const [pa, pb, pc, pd] = ch.pts;
  return figure(
    chordMarks(
      ch,
      "100°",
      "40°",
      [
        seg(pb, pc, "action"),
        angleAt(pc, pa, pb, "50°", "action"),
        angleAt(pb, pc, pd, "20°", "action"),
        angleAt(ch.e, pa, pb, "70°", "result"),
      ],
      { first: "action", second: "action" },
    ),
    "Chords AC and BD meet at E, with arc AB = 100° and arc CD = 40°. The chord BC is drawn: angle ACB is 50°, angle DBC is 20°, and angle AEB is 70°.",
    "弦 AC 与 BD 交于 E，弧 AB = 100°，弧 CD = 40°。画出弦 BC：角 ACB 为 50°，角 DBC 为 20°，角 AEB 为 70°。",
  );
})();

export const secantSecantAnglesToCircles: TopicDef = {
  id: "secant-secant-angles-to-circles",
  title: t("Secant-Secant Angles to Circles", "两条割线所成的角"),
  summary: t(
    "The angle between two chords is half the sum of the intercepted arcs; the angle between two secants from outside is half their difference.",
    "两弦相交所成的角等于所夹两弧和的一半；从圆外引的两条割线所成的角等于所夹两弧差的一半。",
  ),
  prerequisites: ["problem-solving-with-inscribed-angles", "the-exterior-angle-theorem"],
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 15,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `An inscribed angle has its vertex **on** the circle and is half its arc. When two chords cross at a point $E$ **inside** the circle, the angle there is not inscribed, but one extra chord turns it into inscribed angles.

Chords $AC$ and $BD$ meet at $E$, with $m${arcTex("AB")} = 100^\\circ$ and $m${arcTex("CD")} = 40^\\circ$. Draw the chord $BC$:

{{figure 0}}

- $\\angle ACB$ is inscribed on arc $${arcTex("AB")}$, so it is $50^\\circ$;
- $\\angle DBC$ is inscribed on arc $${arcTex("CD")}$, so it is $20^\\circ$;
- $\\angle AEB$ is an exterior angle of $\\triangle BEC$, so it is the sum of the two: $50^\\circ + 20^\\circ = 70^\\circ$.

That is $\\frac{100^\\circ + 40^\\circ}{2}$: the angle between two chords is half the **sum** of the arcs it and its vertical angle intercept. When the two lines meet **outside** the circle instead, the same trick gives a difference: the angle is half the far arc **minus** the near arc. In this lesson we find angles with both rules and run them backward to find arcs.`,
    `圆周角的顶点在圆**上**，等于所对弧的一半。两条弦在圆**内**一点 $E$ 相交时，那里的角不是圆周角，但多画一条弦就能把它化成圆周角。

弦 $AC$ 与 $BD$ 交于 $E$，$m${arcTex("AB")} = 100^\\circ$，$m${arcTex("CD")} = 40^\\circ$。画出弦 $BC$：

{{figure 0}}

- $\\angle ACB$ 是弧 $${arcTex("AB")}$ 所对的圆周角，所以是 $50^\\circ$；
- $\\angle DBC$ 是弧 $${arcTex("CD")}$ 所对的圆周角，所以是 $20^\\circ$；
- $\\angle AEB$ 是 $\\triangle BEC$ 的外角，等于这两个角之和：$50^\\circ + 20^\\circ = 70^\\circ$。

这正是 $\\frac{100^\\circ + 40^\\circ}{2}$：两弦所成的角等于这个角与它的对顶角所对两弧之**和**的一半。如果两条直线在圆**外**相交，同样的方法得到的是差：这个角等于远弧**减去**近弧的一半。这节课我们用这两条规律求角，并反过来求弧。`,
  ),
  introFigures: [chordsIntro],
  knowledgePoints: [
    {
      id: "chords-intersecting-inside",
      figure: theoremDrawings["chords-intersecting-inside"],
      title: t("Chords intersecting inside the circle", "圆内相交的两弦"),
      explanation: t(
        `A **secant** is a line that meets a circle at two points. When chords $AC$ and $BD$ meet at $E$ inside the circle, the angle between them is half the **sum** of the arc it intercepts and the arc intercepted by its vertical angle:

$$\\angle AEB = \\frac{m${arcTex("AB")} + m${arcTex("CD")}}{2}.$$

(Draw $BC$: $\\angle AEB$ is an exterior angle of $\\triangle BEC$, so it is the sum of two inscribed angles.) If $m${arcTex("AB")} = 70^\\circ$ and $m${arcTex("CD")} = 110^\\circ$, then $\\angle AEB = \\frac{180^\\circ}{2} = 90^\\circ$. The adjacent angle $\\angle AED$ is $180^\\circ - \\angle AEB$.

> **Watch out.** Halve the sum: $70^\\circ + 110^\\circ = 180^\\circ$ is the two arcs, not the angle. Inside the circle it is the **sum**; the difference belongs to lines that meet outside. And check which angle is asked: $\\angle AED$ sits on the other pair of arcs and is the supplement of $\\angle AEB$.`,
        `与圆有两个交点的直线叫圆的**割线**。弦 $AC$ 与 $BD$ 在圆内交于 $E$ 时，它们所成的角等于这个角所对的弧与其对顶角所对的弧之**和**的一半：

$$\\angle AEB = \\frac{m${arcTex("AB")} + m${arcTex("CD")}}{2}.$$

（连接 $BC$：$\\angle AEB$ 是 $\\triangle BEC$ 的外角，等于两个圆周角之和。）若 $m${arcTex("AB")} = 70^\\circ$，$m${arcTex("CD")} = 110^\\circ$，则 $\\angle AEB = \\frac{180^\\circ}{2} = 90^\\circ$。相邻的角 $\\angle AED$ 等于 $180^\\circ - \\angle AEB$。

> **注意。** 要把和取一半：$70^\\circ + 110^\\circ = 180^\\circ$ 是两段弧，不是角。在圆内用的是**和**；差是在圆外相交的情形。还要看清问的是哪个角：$\\angle AED$ 对着另一对弧，它是 $\\angle AEB$ 的补角。`,
      ),
      generate(rng) {
        const p = 2 * rng.int(20, 70);
        const w = 2 * rng.int(20, 70);
        const ch = chords(rng, p, w);
        const theta = (p + w) / 2;
        const adjacent = rng.bool(0.3);
        const [pa, pb, pc, pd] = ch.pts;
        const name = adjacent ? "AED" : "AEB";
        const answer = adjacent ? 180 - theta : theta;
        const sumLine = `\\angle AEB = \\frac{${p}^\\circ + ${w}^\\circ}{2} = \\frac{${p + w}^\\circ}{2} = ${theta}^\\circ`;
        const others = 360 - p - w;
        return {
          ...numberProblem({
            prompt: t(`Chords $AC$ and $BD$ meet at $E$. Find $\\angle ${name}$.`, `弦 $AC$ 与 $BD$ 交于 $E$。求 $\\angle ${name}$。`),
            answer,
            unit: "°",
            wrong: adjacent ? [theta, p + w, Math.abs(p - w) / 2] : [p + w, Math.abs(p - w) / 2, 180 - theta],
            solution: adjacent
              ? t(
                  `**Step 1: the angle on the given arcs.** $\\angle AEB$ intercepts arc $${arcTex("AB")}$, and its vertical angle $\\angle CED$ intercepts arc $${arcTex("CD")}$, so it is half their sum:${steps(sumLine)}**Step 2: the adjacent angle.** $\\angle AED$ and $\\angle AEB$ lie along the chord $BD$, so they are supplementary:${steps(`\\angle AED = 180^\\circ - ${theta}^\\circ = ${answer}^\\circ`)}{{figure 0}}

**Check.** $\\angle AED$ has its own pair of arcs, $${arcTex("AD")}$ and $${arcTex("BC")}$, which are what is left of the circle: $360^\\circ - ${p}^\\circ - ${w}^\\circ = ${others}^\\circ$. Half of that is $${others / 2}^\\circ$, the same answer.`,
                  `**第一步：已知弧上的角。** $\\angle AEB$ 对着弧 $${arcTex("AB")}$，它的对顶角 $\\angle CED$ 对着弧 $${arcTex("CD")}$，所以它等于两弧和的一半：${steps(sumLine)}**第二步：相邻的角。** $\\angle AED$ 与 $\\angle AEB$ 在弦 $BD$ 的同一直线上，所以互补：${steps(`\\angle AED = 180^\\circ - ${theta}^\\circ = ${answer}^\\circ`)}{{figure 0}}

**检验。** $\\angle AED$ 有它自己的一对弧 $${arcTex("AD")}$ 和 $${arcTex("BC")}$，它们是圆的其余部分：$360^\\circ - ${p}^\\circ - ${w}^\\circ = ${others}^\\circ$。它的一半是 $${others / 2}^\\circ$，答案相同。`,
                )
              : t(
                  `**Step 1: the two arcs.** $\\angle AEB$ intercepts arc $${arcTex("AB")}$, and its vertical angle $\\angle CED$ intercepts arc $${arcTex("CD")}$.

**Step 2: half the sum.** The angle between two chords is half the sum of those arcs:${steps(sumLine)}{{figure 0}}

**Check.** Draw the chord $BC$. $\\angle ACB$ is inscribed on arc $${arcTex("AB")}$, so it is $${p / 2}^\\circ$, and $\\angle DBC$ is inscribed on arc $${arcTex("CD")}$, so it is $${w / 2}^\\circ$. $\\angle AEB$ is an exterior angle of $\\triangle BEC$, so it is their sum: $${p / 2}^\\circ + ${w / 2}^\\circ = ${theta}^\\circ$.`,
                  `**第一步：两段弧。** $\\angle AEB$ 对着弧 $${arcTex("AB")}$，它的对顶角 $\\angle CED$ 对着弧 $${arcTex("CD")}$。

**第二步：和的一半。** 两弦所成的角等于这两段弧之和的一半：${steps(sumLine)}{{figure 0}}

**检验。** 连接弦 $BC$。$\\angle ACB$ 是弧 $${arcTex("AB")}$ 所对的圆周角，等于 $${p / 2}^\\circ$；$\\angle DBC$ 是弧 $${arcTex("CD")}$ 所对的圆周角，等于 $${w / 2}^\\circ$。$\\angle AEB$ 是 $\\triangle BEC$ 的外角，等于它们的和：$${p / 2}^\\circ + ${w / 2}^\\circ = ${theta}^\\circ$。`,
                ),
          }),
          figure: figure(
            chordMarks(ch, deg(p), deg(w), [angleAt(ch.e, pa, adjacent ? pd : pb, "?")]),
            `Chords AC and BD of a circle meet at E; arc AB is ${p}° and arc CD is ${w}°.`,
            `圆的弦 AC 与 BD 交于 E；弧 AB 为 ${p}°，弧 CD 为 ${w}°。`,
          ),
          solutionFigures: [
            adjacent
              ? figure(
                  chordMarks(
                    ch,
                    deg(p),
                    deg(w),
                    [angleAt(ch.e, pa, pb, deg(theta), "action"), angleAt(ch.e, pa, pd, deg(answer), "result")],
                    { first: "action", second: "action" },
                  ),
                  `Angle AEB, on arcs AB and CD, is ${theta}°; the adjacent angle AED is ${answer}°.`,
                  `对着弧 AB 与弧 CD 的角 AEB 为 ${theta}°；相邻的角 AED 为 ${answer}°。`,
                )
              : figure(
                  chordMarks(
                    ch,
                    deg(p),
                    deg(w),
                    [
                      seg(pb, pc, "action"),
                      angleAt(pc, pa, pb, deg(p / 2), "action"),
                      angleAt(pb, pc, pd, deg(w / 2), "action"),
                      angleAt(ch.e, pa, pb, deg(theta), "result"),
                    ],
                    { first: "action", second: "action" },
                  ),
                  `With the chord BC drawn, angle ACB is ${p / 2}°, angle DBC is ${w / 2}°, and the exterior angle AEB is ${theta}°.`,
                  `连接弦 BC 后，角 ACB 为 ${p / 2}°，角 DBC 为 ${w / 2}°，外角 AEB 为 ${theta}°。`,
                ),
          ],
        };
      },
    },
    {
      id: "secants-intersecting-outside",
      figure: theoremDrawings["secants-intersecting-outside"],
      title: t("Secants intersecting outside the circle", "圆外相交的两条割线"),
      explanation: t(
        `When two secants from a point $P$ outside the circle meet it at $A$, $B$ and at $C$, $D$, the angle at $P$ is half the **difference** of the far arc and the near arc it intercepts:

$$\\angle P = \\frac{m${arcTex("BD")} - m${arcTex("AC")}}{2}.$$

(Draw $AD$: the inscribed angle $\\angle BAD$ is an exterior angle of $\\triangle PAD$, so $\\angle P = \\angle BAD - \\angle ADC$.) If the far arc is $130^\\circ$ and the near arc $40^\\circ$, then $\\angle P = \\frac{130^\\circ - 40^\\circ}{2} = \\frac{90^\\circ}{2} = 45^\\circ$.

> **Watch out.** Outside the circle it is the **difference**, not the sum: half the sum is the rule for chords crossing inside. Halve the difference, since $90^\\circ$ is still an arc. And use both arcs: half the far arc alone is the inscribed angle $\\angle BAD$, which is bigger than $\\angle P$.`,
        `从圆外一点 $P$ 引的两条割线分别交圆于 $A$、$B$ 和 $C$、$D$ 时，$P$ 处的角等于它所夹的远弧与近弧之**差**的一半：

$$\\angle P = \\frac{m${arcTex("BD")} - m${arcTex("AC")}}{2}.$$

（连接 $AD$：圆周角 $\\angle BAD$ 是 $\\triangle PAD$ 的外角，所以 $\\angle P = \\angle BAD - \\angle ADC$。）若远弧是 $130^\\circ$，近弧是 $40^\\circ$，则 $\\angle P = \\frac{130^\\circ - 40^\\circ}{2} = \\frac{90^\\circ}{2} = 45^\\circ$。

> **注意。** 在圆外用的是**差**，不是和：和的一半是两弦在圆内相交的规律。差还要取一半，因为 $90^\\circ$ 仍是弧。两段弧都要用：只取远弧的一半得到的是圆周角 $\\angle BAD$，它比 $\\angle P$ 大。`,
      ),
      generate(rng) {
        const theta = rng.int(30, 70);
        const n = rng.int(30, Math.min(90, 140 - theta));
        const f = n + 2 * theta;
        const sc = secants(rng, n, f);
        const [pc, pa, pb, pd] = sc.pts;
        const diff = `\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ`;
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
              `**Step 1: the far and near arcs.** The two secants cut off two arcs between them: the far arc $${arcTex("BD")}$ of $${f}^\\circ$, away from $P$, and the near arc $${arcTex("AC")}$ of $${n}^\\circ$, facing $P$.

**Step 2: half the difference.** The vertex $P$ is outside the circle, so the angle is half the far arc minus the near arc:${steps(diff)}{{figure 0}}

**Check.** Draw the chord $AD$. The inscribed angle $\\angle BAD$ stands on the far arc, so it is $\\frac{${f}^\\circ}{2} = ${f / 2}^\\circ$, and $\\angle ADC$ stands on the near arc, so it is $\\frac{${n}^\\circ}{2} = ${n / 2}^\\circ$. $\\angle BAD$ is an exterior angle of $\\triangle PAD$, so $\\angle P = ${f / 2}^\\circ - ${n / 2}^\\circ = ${theta}^\\circ$.`,
              `**第一步：远弧与近弧。** 两条割线之间夹着两段弧：远离 $P$ 的远弧 $${arcTex("BD")}$ 为 $${f}^\\circ$，靠近 $P$ 的近弧 $${arcTex("AC")}$ 为 $${n}^\\circ$。

**第二步：差的一半。** 顶点 $P$ 在圆外，所以这个角等于远弧减去近弧的一半：${steps(diff)}{{figure 0}}

**检验。** 连接弦 $AD$。圆周角 $\\angle BAD$ 对着远弧，等于 $\\frac{${f}^\\circ}{2} = ${f / 2}^\\circ$；$\\angle ADC$ 对着近弧，等于 $\\frac{${n}^\\circ}{2} = ${n / 2}^\\circ$。$\\angle BAD$ 是 $\\triangle PAD$ 的外角，所以 $\\angle P = ${f / 2}^\\circ - ${n / 2}^\\circ = ${theta}^\\circ$。`,
            ),
          }),
          figure: figure(
            secantMarks(sc, deg(n), deg(f), "?"),
            `Two secants from P outside a circle: P, A, B and P, C, D; arc AC is ${n}° and arc BD is ${f}°.`,
            `从圆外一点 P 引的两条割线 PAB 与 PCD；弧 AC 为 ${n}°，弧 BD 为 ${f}°。`,
          ),
          solutionFigures: [
            figure(
              secantMarks(
                sc,
                deg(n),
                deg(f),
                deg(theta),
                [seg(pa, pd, "action"), angleAt(pa, pb, pd, deg(f / 2), "action"), angleAt(pd, pa, pc, deg(n / 2), "action")],
                { first: "action", second: "action", angle: "result" },
              ),
              `With the chord AD drawn, angle BAD is ${f / 2}°, angle ADC is ${n / 2}°, and angle P is their difference, ${theta}°.`,
              `连接弦 AD 后，角 BAD 为 ${f / 2}°，角 ADC 为 ${n / 2}°，角 P 是它们的差 ${theta}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "finding-arcs-from-secant-angles",
      figure: theoremDrawings["finding-arcs-from-secant-angles"],
      title: t("Finding arcs from the angle", "由角求弧"),
      explanation: t(
        `The two formulas can be solved for an unknown arc: double the angle first, then undo the sum or the difference.

- Inside: if $\\angle AEB = 75^\\circ$ and $m${arcTex("AB")} = 60^\\circ$, then $\\frac{60 + m${arcTex("CD")}}{2} = 75$, so $60 + m${arcTex("CD")} = 150$ and $m${arcTex("CD")} = 90^\\circ$.
- Outside: if $\\angle P = 35^\\circ$ and the near arc is $50^\\circ$, then the far arc minus $50^\\circ$ is $70^\\circ$, so the far arc is $120^\\circ$.

> **Watch out.** Double the angle **before** adding or subtracting arcs: $75 - 60 = 15$ forgets that the angle is only half of the sum. Outside, the far arc is the near arc **plus** twice the angle, and the near arc is the far arc **minus** it; mixing the two up gives a far arc smaller than the near one.`,
        `两个公式都可以用来求未知的弧：先把角乘以 2，再把和或差还原。

- 圆内：若 $\\angle AEB = 75^\\circ$，$m${arcTex("AB")} = 60^\\circ$，则 $\\frac{60 + m${arcTex("CD")}}{2} = 75$，所以 $60 + m${arcTex("CD")} = 150$，$m${arcTex("CD")} = 90^\\circ$。
- 圆外：若 $\\angle P = 35^\\circ$，近弧是 $50^\\circ$，则远弧减去 $50^\\circ$ 等于 $70^\\circ$，所以远弧是 $120^\\circ$。

> **注意。** 先把角乘以 2，**再**加减弧：$75 - 60 = 15$ 忘了这个角只是和的一半。在圆外，远弧等于近弧**加上**角的两倍，近弧等于远弧**减去**角的两倍；把两者弄混，会得到比近弧还小的远弧。`,
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
                `**Step 1: write the equation.** $\\angle AEB$ intercepts arc $${arcTex("AB")}$, and its vertical angle intercepts arc $${arcTex("CD")}$, so the angle is half the sum of those arcs:${steps(`\\frac{${p}^\\circ + m${arcTex("CD")}}{2} = ${theta}^\\circ`)}**Step 2: solve.** Multiply both sides by $2$, then subtract the known arc:${steps(`${p}^\\circ + m${arcTex("CD")} = ${2 * theta}^\\circ`, `m${arcTex("CD")} = ${2 * theta}^\\circ - ${p}^\\circ = ${w}^\\circ`)}{{figure 0}}

**Check.** Put the arc back into the rule: $\\frac{${p}^\\circ + ${w}^\\circ}{2} = \\frac{${p + w}^\\circ}{2} = ${theta}^\\circ$, the given angle. And the two arcs leave $360^\\circ - ${p + w}^\\circ = ${360 - p - w}^\\circ$ for arcs $${arcTex("BC")}$ and $${arcTex("DA")}$, more than nothing, as the figure needs.`,
                `**第一步：列方程。** $\\angle AEB$ 对着弧 $${arcTex("AB")}$，它的对顶角对着弧 $${arcTex("CD")}$，所以这个角等于两弧和的一半：${steps(`\\frac{${p}^\\circ + m${arcTex("CD")}}{2} = ${theta}^\\circ`)}**第二步：解方程。** 两边乘以 $2$，再减去已知的弧：${steps(`${p}^\\circ + m${arcTex("CD")} = ${2 * theta}^\\circ`, `m${arcTex("CD")} = ${2 * theta}^\\circ - ${p}^\\circ = ${w}^\\circ`)}{{figure 0}}

**检验。** 把弧代回规律：$\\frac{${p}^\\circ + ${w}^\\circ}{2} = \\frac{${p + w}^\\circ}{2} = ${theta}^\\circ$，正是已知的角。两段弧给弧 $${arcTex("BC")}$ 与弧 $${arcTex("DA")}$ 留下 $360^\\circ - ${p + w}^\\circ = ${360 - p - w}^\\circ$，大于零，与图相符。`,
              ),
            }),
            figure: figure(
              chordMarks(ch, deg(p), "?", [angleAt(ch.e, ch.pts[0], ch.pts[1], deg(theta))]),
              `Chords AC and BD of a circle meet at E; angle AEB is ${theta}° and arc AB is ${p}°.`,
              `圆的弦 AC 与 BD 交于 E；角 AEB 为 ${theta}°，弧 AB 为 ${p}°。`,
            ),
            solutionFigures: [
              figure(
                chordMarks(ch, deg(p), deg(w), [angleAt(ch.e, ch.pts[0], ch.pts[1], deg(theta), "action")], {
                  first: "action",
                  second: "result",
                }),
                `Angle AEB is ${theta}° and arc AB is ${p}°, so arc CD is ${w}°.`,
                `角 AEB 为 ${theta}°，弧 AB 为 ${p}°，所以弧 CD 为 ${w}°。`,
              ),
            ],
          };
        }
        const theta = rng.int(30, 70);
        const n = rng.int(30, Math.min(90, 140 - theta));
        const f = n + 2 * theta;
        const sc = secants(rng, n, f);
        const askFar = rng.bool();
        const check = t(
          `**Check.** Put the arcs back into the rule: $\\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ$, the given angle. The far arc is the larger one, $${f}^\\circ > ${n}^\\circ$, as it must be for the angle to be positive.`,
          `**检验。** 把弧代回规律：$\\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ$，正是已知的角。远弧较大，$${f}^\\circ > ${n}^\\circ$，这样角才是正的。`,
        );
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
                  `**Step 1: write the equation.** $P$ is outside the circle, so $\\angle P$ is half the far arc minus the near arc:${steps(`\\frac{m${arcTex("BD")} - ${n}^\\circ}{2} = ${theta}^\\circ`)}**Step 2: solve.** Multiply both sides by $2$, then add the near arc:${steps(`m${arcTex("BD")} - ${n}^\\circ = ${2 * theta}^\\circ`, `m${arcTex("BD")} = ${2 * theta}^\\circ + ${n}^\\circ = ${f}^\\circ`)}{{figure 0}}

${check.en}`,
                  `**第一步：列方程。** $P$ 在圆外，所以 $\\angle P$ 等于远弧减去近弧的一半：${steps(`\\frac{m${arcTex("BD")} - ${n}^\\circ}{2} = ${theta}^\\circ`)}**第二步：解方程。** 两边乘以 $2$，再加上近弧：${steps(`m${arcTex("BD")} - ${n}^\\circ = ${2 * theta}^\\circ`, `m${arcTex("BD")} = ${2 * theta}^\\circ + ${n}^\\circ = ${f}^\\circ`)}{{figure 0}}

${check["zh-CN"]}`,
                )
              : t(
                  `**Step 1: write the equation.** $P$ is outside the circle, so $\\angle P$ is half the far arc minus the near arc:${steps(`\\frac{${f}^\\circ - m${arcTex("AC")}}{2} = ${theta}^\\circ`)}**Step 2: solve.** Multiply both sides by $2$, then subtract from the far arc:${steps(`${f}^\\circ - m${arcTex("AC")} = ${2 * theta}^\\circ`, `m${arcTex("AC")} = ${f}^\\circ - ${2 * theta}^\\circ = ${n}^\\circ`)}{{figure 0}}

${check.en}`,
                  `**第一步：列方程。** $P$ 在圆外，所以 $\\angle P$ 等于远弧减去近弧的一半：${steps(`\\frac{${f}^\\circ - m${arcTex("AC")}}{2} = ${theta}^\\circ`)}**第二步：解方程。** 两边乘以 $2$，再用远弧减去它：${steps(`${f}^\\circ - m${arcTex("AC")} = ${2 * theta}^\\circ`, `m${arcTex("AC")} = ${f}^\\circ - ${2 * theta}^\\circ = ${n}^\\circ`)}{{figure 0}}

${check["zh-CN"]}`,
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
          solutionFigures: [
            figure(
              secantMarks(sc, deg(n), deg(f), deg(theta), [], {
                first: askFar ? "action" : "result",
                second: askFar ? "result" : "action",
                angle: "action",
              }),
              `Angle P is ${theta}°, the near arc AC is ${n}° and the far arc BD is ${f}°.`,
              `角 P 为 ${theta}°，近弧 AC 为 ${n}°，远弧 BD 为 ${f}°。`,
            ),
          ],
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
  return secantTangentAt(rng.int(0, 359), n, f);
}

/** secantTangentAt places T at s, A at s + n and B at s − f, with the tangent at T meeting the secant AB at P. */
function secantTangentAt(s: number, n: number, f: number): SecantTangent {
  const at = [s, s + n, s - f + 360] as const;
  const pts = [on(at[0]), on(at[1]), on(at[2])] as const;
  return { at, pts, pp: meet(pts[0], along(pts[0], tangentDir(s), 1), pts[1], pts[2]) };
}

/** secantTangentMarks draws the tangent PT, the secant PAB, the near arc TA and far arc BT with labels, the angle at P, and the extra marks. */
function secantTangentMarks(
  st: SecantTangent,
  near: string,
  far: string,
  angle: string,
  extra: readonly Mark[] = [],
  tones: ArcTones = {},
): Mark[] {
  const [tAt, a, b] = st.at;
  const [pt, pa, pb] = st.pts;
  const beyond = along(pt, [pt[0] - st.pp[0], pt[1] - st.pp[1]], 0.35);
  return [
    circleAt(),
    seg(st.pp, beyond),
    seg(st.pp, pb),
    ...arcAt(tAt, a, tones.first),
    ...arcAt(b, tAt + 360, tones.second),
    arcTextIn(tAt, a, near),
    arcText(b, tAt + 360, far),
    angleAt(st.pp, pt, pa, angle, tones.angle),
    ...extra,
    ...pointsAt([
      [tAt, "T"],
      [a, "A"],
      [b, "B"],
    ]),
    ...outside(st.pp),
  ];
}

/** secantTangentIntro draws a tangent at T and a secant PAB with the near arc TA = 50° and the far arc BT = 130°, so that angle P is 40°. */
const secantTangentIntro: Figure = (() => {
  const st = secantTangentAt(250, 50, 130);
  return figure(
    secantTangentMarks(st, "50°", "130°", "40°", [], { first: "action", second: "action", angle: "result" }),
    "A tangent at T and a secant through A and B meet at P outside the circle; the near arc TA is 50°, the far arc BT is 130°, and angle P is 40°.",
    "过 T 的切线与过 A、B 的割线交于圆外一点 P；近弧 TA 为 50°，远弧 BT 为 130°，角 P 为 40°。",
  );
})();

export const secantTangentAnglesToCircles: TopicDef = {
  id: "secant-tangent-angles-to-circles",
  title: t("Secant-Tangent Angles to Circles", "割线与切线所成的角"),
  summary: t(
    "The angle between a secant and a tangent, or two tangents, from an outside point is half the difference of the intercepted arcs.",
    "从圆外一点引的割线与切线（或两条切线）所成的角，等于所夹两弧差的一半。",
  ),
  prerequisites: ["secant-secant-angles-to-circles", "tangent-tangent-lines-to-circles"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `Picture two secants from an outside point $P$, and swing one of them until its two points on the circle slide together into one point $T$. The secant has become a **tangent**, and the near arc it cut off now runs from $T$ to the first point $A$ of the other line. The rule for two secants survives the change: the angle at $P$ is still half the far arc minus the near arc.

A tangent at $T$ and a secant $PAB$, with the near arc $${arcTex("TA")} = 50^\\circ$ and the far arc $${arcTex("BT")} = 130^\\circ$:

{{figure 0}}

$$\\angle P = \\frac{130^\\circ - 50^\\circ}{2} = \\frac{80^\\circ}{2} = 40^\\circ.$$

Swing the secant too, and you have **two tangents**: the arcs are then the major and minor arcs between the points of tangency. With a minor arc of $120^\\circ$ the major arc is $240^\\circ$, and $\\frac{240^\\circ - 120^\\circ}{2} = 60^\\circ$, the same as $180^\\circ - 120^\\circ$ from the right angles at the radii. In this lesson we use the rule both ways, for angles and for arcs.`,
    `设想从圆外一点 $P$ 引两条割线，把其中一条转动，直到它与圆的两个交点合成一点 $T$。这条割线就变成了**切线**，它截出的近弧变成从 $T$ 到另一条直线上第一个交点 $A$ 的弧。两条割线的规律在这一变化中仍然成立：$P$ 处的角仍等于远弧减去近弧的一半。

过 $T$ 的切线与割线 $PAB$，近弧 $${arcTex("TA")} = 50^\\circ$，远弧 $${arcTex("BT")} = 130^\\circ$：

{{figure 0}}

$$\\angle P = \\frac{130^\\circ - 50^\\circ}{2} = \\frac{80^\\circ}{2} = 40^\\circ.$$

再把割线也转成切线，就得到**两条切线**：这时两段弧是两个切点之间的优弧和劣弧。劣弧为 $120^\\circ$ 时优弧为 $240^\\circ$，$\\frac{240^\\circ - 120^\\circ}{2} = 60^\\circ$，与由半径处的直角得到的 $180^\\circ - 120^\\circ$ 相同。这节课我们双向运用这条规律，既求角也求弧。`,
  ),
  introFigures: [secantTangentIntro],
  knowledgePoints: [
    {
      id: "secant-and-tangent",
      figure: theoremDrawings["secant-and-tangent"],
      title: t("A secant and a tangent", "一条割线与一条切线"),
      explanation: t(
        `When a tangent at $T$ and a secant through $A$ and $B$ meet at a point $P$ outside the circle, the rule for two secants still holds: the angle is half the difference of the far arc and the near arc,

$$\\angle P = \\frac{m${arcTex("BT")} - m${arcTex("TA")}}{2}.$$

If the far arc $${arcTex("BT")}$ is $150^\\circ$ and the near arc $${arcTex("TA")}$ is $60^\\circ$, then $\\angle P = \\frac{150^\\circ - 60^\\circ}{2} = \\frac{90^\\circ}{2} = 45^\\circ$.

> **Watch out.** The vertex is outside, so use the **difference** of the arcs, not their sum. Halve it: $90^\\circ$ is an arc. And both arcs count; half the far arc alone, $75^\\circ$, ignores the near arc.`,
        `当过 $T$ 的切线与过 $A$、$B$ 的割线交于圆外一点 $P$ 时，两条割线的规律仍然成立：这个角等于远弧与近弧之差的一半，

$$\\angle P = \\frac{m${arcTex("BT")} - m${arcTex("TA")}}{2}.$$

若远弧 $${arcTex("BT")}$ 是 $150^\\circ$，近弧 $${arcTex("TA")}$ 是 $60^\\circ$，则 $\\angle P = \\frac{150^\\circ - 60^\\circ}{2} = \\frac{90^\\circ}{2} = 45^\\circ$。

> **注意。** 顶点在圆外，所以用两弧的**差**，不是和。差要取一半：$90^\\circ$ 是弧。两段弧都要用；只取远弧的一半 $75^\\circ$，就忽略了近弧。`,
      ),
      generate(rng) {
        const theta = rng.int(25, 65);
        const n = rng.int(30, Math.min(100, 160 - theta));
        const f = n + 2 * theta;
        const st = secantTangent(rng, n, f);
        const rest = 360 - n - f;
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
              `**Step 1: the far and near arcs.** Between the tangent and the secant lie the far arc $${arcTex("BT")}$ of $${f}^\\circ$ and the near arc $${arcTex("TA")}$ of $${n}^\\circ$, the one facing $P$.

**Step 2: half the difference.** $P$ is outside the circle:${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**Check.** Run the rule backward: the near arc plus twice the angle should give the far arc, $${n}^\\circ + 2 \\cdot ${theta}^\\circ = ${f}^\\circ$. And the three arcs $${arcTex("TA")}$, $${arcTex("AB")}$ and $${arcTex("BT")}$ fill the circle, leaving $360^\\circ - ${n}^\\circ - ${f}^\\circ = ${rest}^\\circ$ for arc $${arcTex("AB")}$.`,
              `**第一步：远弧与近弧。** 切线与割线之间夹着远弧 $${arcTex("BT")}$（$${f}^\\circ$）和靠近 $P$ 的近弧 $${arcTex("TA")}$（$${n}^\\circ$）。

**第二步：差的一半。** $P$ 在圆外：${steps(`\\angle P = \\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**检验。** 把规律倒过来用：近弧加上角的两倍应等于远弧，$${n}^\\circ + 2 \\cdot ${theta}^\\circ = ${f}^\\circ$。弧 $${arcTex("TA")}$、$${arcTex("AB")}$、$${arcTex("BT")}$ 合起来是整个圆，留给弧 $${arcTex("AB")}$ 的是 $360^\\circ - ${n}^\\circ - ${f}^\\circ = ${rest}^\\circ$。`,
            ),
          }),
          figure: figure(
            secantTangentMarks(st, deg(n), deg(f), "?"),
            `A tangent at T and a secant through A and B meet at P outside the circle; arc TA is ${n}° and arc BT is ${f}°.`,
            `过 T 的切线与过 A、B 的割线交于圆外一点 P；弧 TA 为 ${n}°，弧 BT 为 ${f}°。`,
          ),
          solutionFigures: [
            figure(
              secantTangentMarks(st, deg(n), deg(f), deg(theta), [], { first: "action", second: "action", angle: "result" }),
              `The near arc TA is ${n}°, the far arc BT is ${f}°, and angle P is ${theta}°.`,
              `近弧 TA 为 ${n}°，远弧 BT 为 ${f}°，角 P 为 ${theta}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "finding-arcs-from-secant-tangent-angles",
      figure: theoremDrawings["finding-arcs-from-secant-tangent-angles"],
      title: t("Finding arcs from the angle", "由角求弧"),
      explanation: t(
        `Solve the formula for the unknown arc. If $\\angle P = 30^\\circ$ and the far arc is $140^\\circ$, then

$$\\frac{140^\\circ - m${arcTex("TA")}}{2} = 30^\\circ,$$

so $140^\\circ - m${arcTex("TA")} = 60^\\circ$ and the near arc is $80^\\circ$. In general the far arc is the near arc plus $2\\angle P$.

> **Watch out.** Double the angle before you add or subtract: $140^\\circ - 30^\\circ$ uses the angle as if it were the whole difference. The far arc is the near arc **plus** $2\\angle P$, and the near arc is the far arc **minus** it; $2\\angle P$ by itself is the difference, not either arc.`,
        `由公式解出未知的弧。若 $\\angle P = 30^\\circ$，远弧是 $140^\\circ$，则

$$\\frac{140^\\circ - m${arcTex("TA")}}{2} = 30^\\circ,$$

所以 $140^\\circ - m${arcTex("TA")} = 60^\\circ$，近弧是 $80^\\circ$。一般地，远弧等于近弧加上 $2\\angle P$。

> **注意。** 先把角乘以 2，再做加减：$140^\\circ - 30^\\circ$ 把角当成了整个差。远弧等于近弧**加上** $2\\angle P$，近弧等于远弧**减去** $2\\angle P$；$2\\angle P$ 本身只是两弧之差，不是其中任何一段弧。`,
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
        const equation = askFar
          ? `\\frac{m${arcTex("BT")} - ${n}^\\circ}{2} = ${theta}^\\circ`
          : `\\frac{${f}^\\circ - m${arcTex("TA")}}{2} = ${theta}^\\circ`;
        const work = askFar
          ? steps(
              `m${arcTex("BT")} - ${n}^\\circ = ${2 * theta}^\\circ`,
              `m${arcTex("BT")} = ${n}^\\circ + ${2 * theta}^\\circ = ${f}^\\circ`,
            )
          : steps(
              `${f}^\\circ - m${arcTex("TA")} = ${2 * theta}^\\circ`,
              `m${arcTex("TA")} = ${f}^\\circ - ${2 * theta}^\\circ = ${n}^\\circ`,
            );
        return {
          ...numberProblem({
            prompt,
            answer: askFar ? f : n,
            unit: "°",
            wrong: askFar ? [n + theta, 2 * theta - n, 2 * theta] : [f - theta, f + 2 * theta, 2 * theta],
            solution: t(
              `**Step 1: write the equation.** $P$ is outside the circle, so $\\angle P$ is half the far arc $${arcTex("BT")}$ minus the near arc $${arcTex("TA")}$:${steps(equation)}**Step 2: solve.** Multiply both sides by $2$, then ${askFar ? "add the near arc" : "subtract from the far arc"}:${work}{{figure 0}}

**Check.** Put both arcs back: $\\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ$, the given angle. The far arc is the larger, and the two leave $360^\\circ - ${n + f}^\\circ = ${360 - n - f}^\\circ$ for arc $${arcTex("AB")}$.`,
              `**第一步：列方程。** $P$ 在圆外，所以 $\\angle P$ 等于远弧 $${arcTex("BT")}$ 减去近弧 $${arcTex("TA")}$ 的一半：${steps(equation)}**第二步：解方程。** 两边乘以 $2$，再${askFar ? "加上近弧" : "用远弧减去它"}：${work}{{figure 0}}

**检验。** 把两段弧代回：$\\frac{${f}^\\circ - ${n}^\\circ}{2} = \\frac{${f - n}^\\circ}{2} = ${theta}^\\circ$，正是已知的角。远弧较大，两段弧给弧 $${arcTex("AB")}$ 留下 $360^\\circ - ${n + f}^\\circ = ${360 - n - f}^\\circ$。`,
            ),
          }),
          figure: figure(
            askFar ? secantTangentMarks(st, deg(n), "?", deg(theta)) : secantTangentMarks(st, "?", deg(f), deg(theta)),
            `A tangent at T and a secant through A and B meet at P outside the circle; angle P is ${theta}°.`,
            `过 T 的切线与过 A、B 的割线交于圆外一点 P；角 P 为 ${theta}°。`,
          ),
          solutionFigures: [
            figure(
              secantTangentMarks(st, deg(n), deg(f), deg(theta), [], {
                first: askFar ? "action" : "result",
                second: askFar ? "result" : "action",
                angle: "action",
              }),
              `Angle P is ${theta}°, the near arc TA is ${n}° and the far arc BT is ${f}°.`,
              `角 P 为 ${theta}°，近弧 TA 为 ${n}°，远弧 BT 为 ${f}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "two-tangents-and-their-arcs",
      figure: theoremDrawings["two-tangents-and-their-arcs"],
      title: t("Two tangents and their arcs", "两条切线与所夹的弧"),
      explanation: t(
        `For two tangents from $P$ touching at $A$ and $B$, the same rule uses the major and minor arcs between $A$ and $B$:

$$\\angle APB = \\frac{m(\\text{major arc}) - m(\\text{minor arc})}{2}.$$

If the minor arc is $100^\\circ$, the major arc is $260^\\circ$ and $\\angle APB = \\frac{160^\\circ}{2} = 80^\\circ$, which agrees with $180^\\circ - 100^\\circ$. Going back, if $\\angle APB = 50^\\circ$, the minor arc is $180^\\circ - 50^\\circ = 130^\\circ$ and the major arc $230^\\circ$.

> **Watch out.** Find the major arc from the $360^\\circ$ first, then take half the **difference**: half the major arc alone is an inscribed angle, and the difference without halving is twice too big. When the angle is given, the arc asked for may be the major one: $180^\\circ - \\angle APB$ is the minor arc.`,
        `对从 $P$ 引的两条切线（切点为 $A$、$B$），同样的规律用 $A$、$B$ 之间的优弧和劣弧：

$$\\angle APB = \\frac{m(\\text{优弧}) - m(\\text{劣弧})}{2}.$$

若劣弧是 $100^\\circ$，则优弧是 $260^\\circ$，$\\angle APB = \\frac{160^\\circ}{2} = 80^\\circ$，与 $180^\\circ - 100^\\circ$ 一致。反过来，若 $\\angle APB = 50^\\circ$，则劣弧是 $180^\\circ - 50^\\circ = 130^\\circ$，优弧是 $230^\\circ$。

> **注意。** 先由 $360^\\circ$ 求出优弧，再取两弧**差**的一半：只取优弧的一半是圆周角，差不取一半则大了一倍。已知角求弧时，问的可能是优弧：$180^\\circ - \\angle APB$ 是劣弧。`,
      ),
      generate(rng) {
        const phi = rng.int(25, 70);
        const m = 2 * phi;
        const M = 360 - m;
        const p = 180 - m;
        const tt = twoTangents(rng.int(0, 359), phi);
        const [a, b] = [tt.s + phi, tt.s - phi + 360];
        const base = (extra: readonly Mark[]): Mark[] => [
          circleAt(),
          seg(tt.pp, tt.pa),
          seg(tt.pp, tt.pb),
          ...extra,
          ...pointsAt([
            [a, "A"],
            [b, "B"],
          ]),
          ...outside(tt.pp),
        ];
        const solved = figure(
          base([
            ...arcAt(b, a + 360, "action"),
            arcTextIn(b, a + 360, deg(m)),
            ...arcAt(a, b, "action"),
            arcText(a, b, deg(M)),
            angleAt(tt.pp, tt.pa, tt.pb, deg(p), "result"),
          ]),
          `The minor arc AB is ${m}°, the major arc is ${M}°, and angle APB is ${p}°.`,
          `劣弧 AB 为 ${m}°，优弧为 ${M}°，角 APB 为 ${p}°。`,
        );
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
                `**Step 1: the major arc.** The two arcs between $A$ and $B$ fill the circle:${steps(`m(\\text{major arc}) = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}**Step 2: half the difference.** $P$ is outside the circle, so the angle is half the major arc minus the minor arc:${steps(`\\angle APB = \\frac{${M}^\\circ - ${m}^\\circ}{2} = \\frac{${M - m}^\\circ}{2} = ${p}^\\circ`)}{{figure 0}}

**Check.** By the radii: each tangent is perpendicular to its radius, so in quadrilateral $OAPB$ the angle at $P$ is supplementary to the central angle, which equals the minor arc: $180^\\circ - ${m}^\\circ = ${p}^\\circ$.`,
                `**第一步：优弧。** $A$、$B$ 之间的两段弧合起来是整个圆：${steps(`m(\\text{优弧}) = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}**第二步：差的一半。** $P$ 在圆外，所以这个角等于优弧减去劣弧的一半：${steps(`\\angle APB = \\frac{${M}^\\circ - ${m}^\\circ}{2} = \\frac{${M - m}^\\circ}{2} = ${p}^\\circ`)}{{figure 0}}

**检验。** 用半径来看：每条切线都垂直于过切点的半径，所以在四边形 $OAPB$ 中，$P$ 处的角与圆心角互补，而圆心角等于劣弧：$180^\\circ - ${m}^\\circ = ${p}^\\circ$。`,
              ),
            }),
            figure: figure(
              base([...arcAt(b, a + 360), arcTextIn(b, a + 360, deg(m)), angleAt(tt.pp, tt.pa, tt.pb, "?")]),
              `Two tangents from P touch a circle at A and B; the minor arc AB is ${m}°.`,
              `从 P 引的两条切线与圆相切于 A、B；劣弧 AB 为 ${m}°。`,
            ),
            solutionFigures: [solved],
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
              `**Step 1: write the equation.** Call the minor arc $x^\\circ$; the major arc is then $(360 - x)^\\circ$, and the angle at $P$ is half their difference:${steps(`\\frac{(360 - x) - x}{2} = ${p}`)}**Step 2: solve.** Simplify the numerator and halve it, then solve:${steps(`180 - x = ${p}`, `x = ${m}`)}So the minor arc is $${m}^\\circ$, and the major arc is $360^\\circ - ${m}^\\circ = ${M}^\\circ$.

{{figure 0}}

**Check.** Put the arcs back: $\\frac{${M}^\\circ - ${m}^\\circ}{2} = \\frac{${M - m}^\\circ}{2} = ${p}^\\circ$, the given angle. And by the radii, the central angle on the minor arc is supplementary to the angle at $P$: $${m}^\\circ + ${p}^\\circ = 180^\\circ$.`,
              `**第一步：列方程。** 设劣弧为 $x^\\circ$，则优弧为 $(360 - x)^\\circ$，$P$ 处的角等于两弧差的一半：${steps(`\\frac{(360 - x) - x}{2} = ${p}`)}**第二步：解方程。** 化简分子并除以 2，再解方程：${steps(`180 - x = ${p}`, `x = ${m}`)}所以劣弧是 $${m}^\\circ$，优弧是 $360^\\circ - ${m}^\\circ = ${M}^\\circ$。

{{figure 0}}

**检验。** 把弧代回：$\\frac{${M}^\\circ - ${m}^\\circ}{2} = \\frac{${M - m}^\\circ}{2} = ${p}^\\circ$，正是已知的角。用半径来看，劣弧所对的圆心角与 $P$ 处的角互补：$${m}^\\circ + ${p}^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            base([...arcAt(a, b), arcText(a, b, "?"), angleAt(tt.pp, tt.pa, tt.pb, deg(p))]),
            `Two tangents from P touch a circle at A and B; angle APB is ${p}° and the major arc AB is highlighted.`,
            `从 P 引的两条切线与圆相切于 A、B；角 APB 为 ${p}°，优弧 AB 被突出显示。`,
          ),
          solutionFigures: [solved],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The tangent-chord theorem
// ---------------------------------------------------------------------------

/** tangentChordMarks draws a tangent at A = on(s) with ends T (counterclockwise) and S, the chord AB to B = on(s + m), and the extra marks. */
function tangentChordMarks(s: number, m: number, extra: readonly Mark[], arcLabel?: string, arcTone?: Tone): Mark[] {
  const pa = on(s);
  const dir = tangentDir(s);
  const [pt, ps] = [along(pa, dir, 0.9 * R), along(pa, dir, -0.9 * R)];
  return [
    circleAt(),
    seg(ps, pt),
    seg(pa, on(s + m)),
    ...(arcLabel !== undefined ? [...arcAt(s, s + m, arcTone), arcText(s, s + m, arcLabel)] : []),
    ...extra,
    { kind: "label", at: pt, text: "T", dir: dirOf(heading(pt)), italic: true },
    { kind: "label", at: ps, text: "S", dir: dirOf(heading(ps)), italic: true },
    ...pointsAt([
      [s, "A"],
      [s + m, "B"],
    ]),
  ];
}

/** radiusRoute draws the radii OA and OB of a tangent-chord figure with arc m: the central angle, the base angle OAB and the right angle at A. */
function radiusRoute(s: number, m: number, tone: Tone = "action"): Mark[] {
  const [pa, pb] = [on(s), on(s + m)];
  const pt = along(pa, tangentDir(s), 0.9 * R);
  return [
    seg(O, pa),
    seg(O, pb),
    tick(O, pa),
    tick(O, pb),
    rightAt(pa, O, pt),
    angleAt(O, pa, pb, deg(m), tone),
    angleAt(pa, O, pb, deg((180 - m) / 2), tone),
    ...center(dirOf(s + m / 2 + 180)),
  ];
}

/** tangentChordIntro draws a tangent at A and a chord AB on an arc of 100°, with the radii: the central angle 100°, the base angle 40° and the tangent-chord angle 50°. */
const tangentChordIntro: Figure = (() => {
  const [s, m] = [230, 100];
  const pa = on(s);
  const pt = along(pa, tangentDir(s), 0.9 * R);
  return figure(
    tangentChordMarks(s, m, [...radiusRoute(s, m), angleAt(pa, pt, on(s + m), "50°", "result")], "100°", "action"),
    "Line ST is tangent to the circle at A, and AB is a chord on an arc of 100°. With the radii OA and OB, the central angle AOB is 100°, the base angles of the isosceles triangle are 40°, the radius OA meets the tangent at a right angle, and angle TAB is 50°.",
    "直线 ST 与圆相切于 A，AB 是对着 100° 弧的弦。画出半径 OA、OB：圆心角 AOB 为 100°，等腰三角形的底角为 40°，半径 OA 与切线成直角，角 TAB 为 50°。",
  );
})();

export const theTangentChordTheorem: TopicDef = {
  id: "the-tangent-chord-theorem",
  title: t("The Tangent-Chord Theorem", "弦切角定理"),
  summary: t(
    "The angle between a tangent and a chord is half the intercepted arc, and equals the inscribed angle on the other side of the chord.",
    "弦切角等于它所夹弧的度数的一半，也等于弦另一侧所对的圆周角。",
  ),
  prerequisites: ["tangent-lines-to-circles", "problem-solving-with-inscribed-angles"],
  encompasses: [{ topic: "inscribed-angles", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `Slide the vertex of an inscribed angle along the circle until it reaches one end $A$ of its chord. One side becomes the chord $AB$, and the other turns into the **tangent** at $A$. The angle between them is a **tangent-chord angle**, and it is still half its arc.

The radii show why. Let the tangent $ST$ touch the circle at $A$, with the chord $AB$ on an arc of $100^\\circ$. Draw the radii $OA$ and $OB$:

{{figure 0}}

- the central angle on the arc is $\\angle AOB = 100^\\circ$;
- $OA = OB$, so the base angles of $\\triangle AOB$ share $180^\\circ - 100^\\circ = 80^\\circ$: $\\angle OAB = 40^\\circ$;
- the radius $OA$ is perpendicular to the tangent, so $\\angle TAB = 90^\\circ - 40^\\circ = 50^\\circ$.

That is half of $100^\\circ$: the **tangent-chord theorem**. It means a tangent-chord angle equals any inscribed angle on the same arc, from the other side of the chord. In this lesson we go from arcs to angles and back, and combine the theorem with inscribed triangles.`,
    `让圆周角的顶点沿着圆滑动，直到它到达弦的一个端点 $A$。这时一边变成弦 $AB$，另一边变成过 $A$ 的**切线**。它们所成的角叫**弦切角**，它仍然等于所夹弧的一半。

用半径可以看出原因。设切线 $ST$ 与圆相切于 $A$，弦 $AB$ 对着 $100^\\circ$ 的弧。画出半径 $OA$ 和 $OB$：

{{figure 0}}

- 这段弧所对的圆心角是 $\\angle AOB = 100^\\circ$；
- $OA = OB$，所以 $\\triangle AOB$ 的两个底角分享 $180^\\circ - 100^\\circ = 80^\\circ$：$\\angle OAB = 40^\\circ$；
- 半径 $OA$ 垂直于切线，所以 $\\angle TAB = 90^\\circ - 40^\\circ = 50^\\circ$。

这正是 $100^\\circ$ 的一半，即**弦切角定理**。它说明弦切角等于弦另一侧同一段弧上的任何圆周角。这节课我们在弧与角之间来回换算，并把定理与圆内接三角形结合起来。`,
  ),
  introFigures: [tangentChordIntro],
  knowledgePoints: [
    {
      id: "the-angle-from-the-arc",
      figure: theoremDrawings["the-angle-from-the-arc"],
      title: t("The angle from the arc", "由弧求弦切角"),
      explanation: t(
        `A tangent and a chord that meet at the point of tangency $A$ form a **tangent-chord angle**. **Tangent-chord theorem:** it is half the arc inside it:

$$\\angle TAB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$

(The radius $OA$ is perpendicular to the tangent, so $\\angle TAB = 90^\\circ - \\angle OAB$, which is half the central angle.) If $m${arcTex("AB")} = 124^\\circ$, then $\\angle TAB = 62^\\circ$, and the angle on the other side of the chord is $\\angle SAB = 180^\\circ - 62^\\circ = 118^\\circ$.

> **Watch out.** The angle is **half** the arc, not equal to it. $90^\\circ - 62^\\circ = 28^\\circ$ is $\\angle OAB$, the angle between the chord and the radius, not the one with the tangent. And $\\angle SAB$, on the other side of the chord, is the supplement of $\\angle TAB$: it is half the **other** arc, $360^\\circ - 124^\\circ$.`,
        `切线与过切点 $A$ 的弦所成的角叫**弦切角**。**弦切角定理**：弦切角等于它所夹弧的一半：

$$\\angle TAB = \\tfrac{1}{2}\\, m${arcTex("AB")}.$$

（半径 $OA$ 垂直于切线，所以 $\\angle TAB = 90^\\circ - \\angle OAB$，即圆心角的一半。）若 $m${arcTex("AB")} = 124^\\circ$，则 $\\angle TAB = 62^\\circ$，弦另一侧的角 $\\angle SAB = 180^\\circ - 62^\\circ = 118^\\circ$。

> **注意。** 弦切角是弧的**一半**，不等于弧。$90^\\circ - 62^\\circ = 28^\\circ$ 是弦与半径之间的 $\\angle OAB$，不是弦与切线之间的角。弦另一侧的 $\\angle SAB$ 是 $\\angle TAB$ 的补角：它是**另一段**弧 $360^\\circ - 124^\\circ$ 的一半。`,
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
        const base = (180 - m) / 2;
        const tab = `\\angle TAB = \\frac{${m}^\\circ}{2} = ${m / 2}^\\circ`;
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
                  `**Step 1: the tangent-chord angle on the arc.** $\\angle TAB$ opens onto arc $${arcTex("AB")}$, and by the tangent-chord theorem it is half of it:${steps(tab)}**Step 2: the straight angle.** $\\angle SAB$ and $\\angle TAB$ together make the straight angle along the tangent:${steps(`\\angle SAB = 180^\\circ - ${m / 2}^\\circ = ${answer}^\\circ`)}{{figure 0}}

**Check.** $\\angle SAB$ is itself a tangent-chord angle, on the other arc from $A$ to $B$, which is $360^\\circ - ${m}^\\circ = ${360 - m}^\\circ$. Half of that is $${answer}^\\circ$.`,
                  `**第一步：这段弧上的弦切角。** $\\angle TAB$ 张开对着弧 $${arcTex("AB")}$，由弦切角定理，它是这段弧的一半：${steps(tab)}**第二步：平角。** $\\angle SAB$ 与 $\\angle TAB$ 合起来是切线上的平角：${steps(`\\angle SAB = 180^\\circ - ${m / 2}^\\circ = ${answer}^\\circ`)}{{figure 0}}

**检验。** $\\angle SAB$ 本身也是弦切角，它对着 $A$ 到 $B$ 的另一段弧，即 $360^\\circ - ${m}^\\circ = ${360 - m}^\\circ$。它的一半是 $${answer}^\\circ$。`,
                )
              : t(
                  `**Step 1: the arc inside the angle.** $\\angle TAB$ is formed by the tangent at $A$ and the chord $AB$; the arc inside it is $${arcTex("AB")}$ of $${m}^\\circ$.

**Step 2: halve it.** By the tangent-chord theorem:${steps(tab)}{{figure 0}}

**Check.** By the radii: the central angle is $\\angle AOB = ${m}^\\circ$, so the base angles of the isosceles triangle $AOB$ are $\\frac{180^\\circ - ${m}^\\circ}{2} = ${base}^\\circ$. The radius $OA$ is perpendicular to the tangent, so $\\angle TAB = 90^\\circ - ${base}^\\circ = ${m / 2}^\\circ$.`,
                  `**第一步：角内的弧。** $\\angle TAB$ 由过 $A$ 的切线和弦 $AB$ 组成；它内部的弧是 $${m}^\\circ$ 的弧 $${arcTex("AB")}$。

**第二步：取一半。** 由弦切角定理：${steps(tab)}{{figure 0}}

**检验。** 用半径来看：圆心角 $\\angle AOB = ${m}^\\circ$，所以等腰三角形 $AOB$ 的底角是 $\\frac{180^\\circ - ${m}^\\circ}{2} = ${base}^\\circ$。半径 $OA$ 垂直于切线，所以 $\\angle TAB = 90^\\circ - ${base}^\\circ = ${m / 2}^\\circ$。`,
                ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [other ? angleAt(pa, ps, pb, "?") : angleAt(pa, pt, pb, "?")], deg(m)),
            `Line ST is tangent to a circle at A, and AB is a chord; the arc AB inside angle TAB is ${m}°.`,
            `直线 ST 与圆相切于 A，AB 是弦；角 TAB 内的弧 AB 为 ${m}°。`,
          ),
          solutionFigures: [
            other
              ? figure(
                  [
                    ...tangentChordMarks(
                      s,
                      m,
                      [
                        ...arcAt(s + m, s + 360, "result"),
                        arcText(s + m, s + 360, deg(360 - m)),
                        angleAt(pa, pt, pb, deg(m / 2), "action"),
                        angleAt(pa, ps, pb, deg(answer), "result"),
                      ],
                      deg(m),
                      "action",
                    ),
                  ],
                  `Angle TAB is half of the ${m}° arc, ${m / 2}°; angle SAB is ${answer}°, half of the other arc of ${360 - m}°.`,
                  `角 TAB 是 ${m}° 弧的一半，即 ${m / 2}°；角 SAB 为 ${answer}°，是另一段 ${360 - m}° 弧的一半。`,
                )
              : figure(
                  tangentChordMarks(s, m, [...radiusRoute(s, m), angleAt(pa, pt, pb, deg(m / 2), "result")], deg(m), "action"),
                  `Arc AB is ${m}°, so angle TAB is ${m / 2}°; with the radii, the central angle is ${m}°, the base angle OAB is ${base}°, and OA meets the tangent at a right angle.`,
                  `弧 AB 为 ${m}°，所以角 TAB 为 ${m / 2}°；画出半径后，圆心角为 ${m}°，底角 OAB 为 ${base}°，OA 与切线成直角。`,
                ),
          ],
        };
      },
    },
    {
      id: "the-arc-from-the-angle",
      figure: theoremDrawings["the-arc-from-the-angle"],
      title: t("The arc from the angle", "由弦切角求弧"),
      explanation: t(
        `The intercepted arc is twice the tangent-chord angle: $m${arcTex("AB")} = 2\\angle TAB$. If $\\angle TAB = 47^\\circ$, the arc is $94^\\circ$.

With algebra: if $\\angle TAB = (x + 15)^\\circ$ and $m${arcTex("AB")} = (3x - 5)^\\circ$, then $2(x + 15) = 3x - 5$, so $2x + 30 = 3x - 5$ and $x = 35$. The angle is $50^\\circ$ and the arc $100^\\circ$.

> **Watch out.** The arc is **twice** the angle: halving it, or setting the two equal, goes the wrong way. The arc asked for is the one inside $\\angle TAB$, not the rest of the circle. In the equation the $2$ multiplies the angle's expression, and both of its terms.`,
        `所夹的弧是弦切角的两倍：$m${arcTex("AB")} = 2\\angle TAB$。若 $\\angle TAB = 47^\\circ$，则弧是 $94^\\circ$。

含未知数时：若 $\\angle TAB = (x + 15)^\\circ$，$m${arcTex("AB")} = (3x - 5)^\\circ$，则 $2(x + 15) = 3x - 5$，即 $2x + 30 = 3x - 5$，$x = 35$。角是 $50^\\circ$，弧是 $100^\\circ$。

> **注意。** 弧是角的**两倍**：取一半或令两者相等都弄反了。所求的弧是 $\\angle TAB$ 内的那段，不是圆的其余部分。方程中的 $2$ 乘的是角的式子，而且要乘它的两项。`,
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
        const solved = figure(
          tangentChordMarks(s, m, [angleAt(pa, pt, pb, deg(theta), "action")], deg(m), "result"),
          `Angle TAB is ${theta}°, so the arc AB inside it is ${m}°.`,
          `角 TAB 为 ${theta}°，所以它内部的弧 AB 为 ${m}°。`,
        );
        if (rng.bool()) {
          const base = 90 - theta;
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
                `**Step 1: the theorem.** $\\angle TAB$ is a tangent-chord angle, so it is half the arc inside it; the arc is twice the angle.

**Step 2: double the angle.**${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**Check.** By the radii: the central angle on the arc is $${m}^\\circ$, so the base angle $\\angle OAB$ of the isosceles triangle $AOB$ is $\\frac{180^\\circ - ${m}^\\circ}{2} = ${base}^\\circ$, and with the radius perpendicular to the tangent, $\\angle TAB = 90^\\circ - ${base}^\\circ = ${theta}^\\circ$, the given angle.`,
                `**第一步：定理。** $\\angle TAB$ 是弦切角，等于它内部弧的一半；所以弧是角的两倍。

**第二步：角乘以 2。**${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}{{figure 0}}

**检验。** 用半径来看：这段弧所对的圆心角是 $${m}^\\circ$，所以等腰三角形 $AOB$ 的底角 $\\angle OAB = \\frac{180^\\circ - ${m}^\\circ}{2} = ${base}^\\circ$；半径垂直于切线，所以 $\\angle TAB = 90^\\circ - ${base}^\\circ = ${theta}^\\circ$，正是已知的角。`,
              ),
            }),
            figure: figure(
              tangentChordMarks(s, m, [angleAt(pa, pt, pb, deg(theta))], "?"),
              `Line ST is tangent to a circle at A, and AB is a chord; angle TAB is ${theta}°.`,
              `直线 ST 与圆相切于 A，AB 是弦；角 TAB 为 ${theta}°。`,
            ),
            solutionFigures: [solved],
          };
        }
        const x = rng.int(4, 15);
        const [c1, d1] = expressionFor(rng, theta, x, 4);
        const [c2, d2] = expressionFor(rng, m, x, 9, [2 * c1]);
        const eq = `2(${linear(c1, d1)}) = ${linear(c2, d2)}`;
        return {
          ...numberProblem({
            prompt: t(`${prompt.en} Find $x$.`, `${prompt["zh-CN"]}求 $x$。`),
            answer: x,
            solveFor: "x",
            wrong: [...doubleWrong(c1, d1, c2, d2), theta],
            solution: t(
              `**Step 1: write the equation.** By the tangent-chord theorem the arc is twice the angle:${steps(eq)}**Step 2: solve.** Distribute the $2$ over both terms, then ${collect.en.charAt(0).toLowerCase()}${collect.en.slice(1)}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**Check.** With $x = ${x}$, the angle is $${evalLinear(c1, d1, x)}^\\circ$ and the arc is $${evalLinear(c2, d2, x)}^\\circ$. The arc is twice the angle: $2 \\cdot ${theta}^\\circ = ${m}^\\circ$.`,
              `**第一步：列方程。** 由弦切角定理，弧是角的两倍：${steps(eq)}**第二步：解方程。** 先用 $2$ 乘括号里的两项，再${collect["zh-CN"]}${solveLinear(2 * c1, 2 * d1, c2, d2)}{{figure 0}}

**检验。** 当 $x = ${x}$ 时，角是 $${evalLinear(c1, d1, x)}^\\circ$，弧是 $${evalLinear(c2, d2, x)}^\\circ$。弧正是角的两倍：$2 \\cdot ${theta}^\\circ = ${m}^\\circ$。`,
            ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [angleAt(pa, pt, pb, angleLabel(c1, d1))], angleLabel(c2, d2)),
            `Line ST is tangent to a circle at A, and AB is a chord; angle TAB is ${angleLabel(c1, d1)} and arc AB is ${angleLabel(c2, d2)}.`,
            `直线 ST 与圆相切于 A，AB 是弦；角 TAB 为 ${angleLabel(c1, d1)}，弧 AB 为 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [solved],
        };
      },
    },
    {
      id: "tangent-chord-and-inscribed-angles",
      figure: theoremDrawings["tangent-chord-and-inscribed-angles"],
      title: t("Tangent-chord and inscribed angles", "弦切角与圆周角"),
      explanation: t(
        `Both the tangent-chord angle $\\angle TAB$ and an inscribed angle $\\angle ACB$ on the other side of the chord intercept arc $${arcTex("AB")}$, so they are **equal**:

$$\\angle TAB = \\angle ACB.$$

If $\\angle TAB = 52^\\circ$ and $\\angle ABC = 71^\\circ$ in triangle $ABC$, then $\\angle ACB = 52^\\circ$ and $\\angle BAC = 180^\\circ - 52^\\circ - 71^\\circ = 57^\\circ$.

> **Watch out.** The two angles are **equal**, both half of arc $${arcTex("AB")}$; they are not supplementary or complementary, and neither is the whole arc. In the triangle, the angle at $A$ is $\\angle BAC$, between the two chords, not the tangent-chord angle: find it from the angle sum.`,
        `弦切角 $\\angle TAB$ 与弦另一侧的圆周角 $\\angle ACB$ 都对着弧 $${arcTex("AB")}$，所以它们**相等**：

$$\\angle TAB = \\angle ACB.$$

若 $\\angle TAB = 52^\\circ$，在 $\\triangle ABC$ 中 $\\angle ABC = 71^\\circ$，则 $\\angle ACB = 52^\\circ$，$\\angle BAC = 180^\\circ - 52^\\circ - 71^\\circ = 57^\\circ$。

> **注意。** 这两个角**相等**，都是弧 $${arcTex("AB")}$ 的一半；它们不互补也不互余，也都不等于整段弧。在三角形中，$A$ 处的角是两弦之间的 $\\angle BAC$，不是弦切角：要用内角和求它。`,
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
        const ps = along(pa, tangentDir(s), -0.9 * R);
        const tri: Mark[] = [
          seg(pa, pc),
          seg(pb, pc),
          { kind: "dot", at: pc },
          { kind: "label", at: pc, text: "C", dir: dirOf(cAt), italic: true },
        ];
        const prompt = t("Line $ST$ is tangent to the circle at $A$, and $C$ is on the circle.", "直线 $ST$ 与圆相切于 $A$，$C$ 在圆上。");
        if (rng.bool()) {
          const fromC = rng.bool();
          const [asked, known] = fromC ? ["TAB", "ACB"] : ["ACB", "TAB"];
          return {
            ...numberProblem({
              prompt: t(`${prompt.en} Find $\\angle ${asked}$.`, `${prompt["zh-CN"]}求 $\\angle ${asked}$。`),
              answer: theta,
              unit: "°",
              wrong: [m, 90 - theta, 180 - theta],
              solution: t(
                `**Step 1: the arc from the known angle.** $\\angle ${known}$ is ${fromC ? "an inscribed angle" : "a tangent-chord angle"} on arc $${arcTex("AB")}$, so the arc is twice it:${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}**Step 2: the other angle on the same arc.** $\\angle ${asked}$ is ${fromC ? "the tangent-chord angle" : "an inscribed angle"} on the same arc, so it is half of it:${steps(`\\angle ${asked} = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**Check.** The rest of the circle, the arc through $C$, is $360^\\circ - ${m}^\\circ = ${360 - m}^\\circ$, and the tangent-chord angle $\\angle SAB$ on it should be half: $${180 - theta}^\\circ$. Together with $\\angle TAB$ it makes the straight angle along the tangent: $${theta}^\\circ + ${180 - theta}^\\circ = 180^\\circ$.`,
                `**第一步：由已知角求弧。** $\\angle ${known}$ 是弧 $${arcTex("AB")}$ 上的${fromC ? "圆周角" : "弦切角"}，所以弧是它的两倍：${steps(`m${arcTex("AB")} = 2 \\cdot ${theta}^\\circ = ${m}^\\circ`)}**第二步：同一段弧上的另一个角。** $\\angle ${asked}$ 是同一段弧上的${fromC ? "弦切角" : "圆周角"}，等于弧的一半：${steps(`\\angle ${asked} = \\frac{${m}^\\circ}{2} = ${theta}^\\circ`)}{{figure 0}}

**检验。** 圆的其余部分，即经过 $C$ 的弧，是 $360^\\circ - ${m}^\\circ = ${360 - m}^\\circ$，它上面的弦切角 $\\angle SAB$ 应是它的一半：$${180 - theta}^\\circ$。它与 $\\angle TAB$ 合起来是切线上的平角：$${theta}^\\circ + ${180 - theta}^\\circ = 180^\\circ$。`,
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
            solutionFigures: [
              figure(
                tangentChordMarks(
                  s,
                  m,
                  [
                    ...tri,
                    angleAt(pc, pa, pb, deg(theta), fromC ? "action" : "result"),
                    angleAt(pa, pt, pb, deg(theta), fromC ? "result" : "action"),
                  ],
                  deg(m),
                  "action",
                ),
                `Angle TAB and angle ACB both stand on arc AB of ${m}°, so both are ${theta}°.`,
                `角 TAB 与角 ACB 都对着 ${m}° 的弧 AB，所以都是 ${theta}°。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(`${prompt.en} Find $\\angle BAC$.`, `${prompt["zh-CN"]}求 $\\angle BAC$。`),
            answer: gamma,
            unit: "°",
            wrong: [180 - theta, theta + beta, 180 - 2 * theta - beta, 90 - theta],
            solution: t(
              `**Step 1: the angle at $C$.** $\\angle TAB$ and the inscribed angle $\\angle ACB$ both stand on arc $${arcTex("AB")}$, so by the tangent-chord theorem they are equal: $\\angle ACB = ${theta}^\\circ$.

**Step 2: the angle sum.** The angles of $\\triangle ABC$ add to $180^\\circ$:${steps(`\\angle BAC = 180^\\circ - ${theta}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}{{figure 0}}

**Check.** By the tangent at $A$: the tangent-chord angle on the other side, $\\angle SAC$, stands on arc $${arcTex("AC")}$, so it equals the inscribed angle $\\angle ABC = ${beta}^\\circ$. The three angles at $A$ along the tangent make a straight angle: $\\angle TAB + \\angle BAC + \\angle CAS = ${theta}^\\circ + ${gamma}^\\circ + ${beta}^\\circ = 180^\\circ$.`,
              `**第一步：$C$ 处的角。** $\\angle TAB$ 与圆周角 $\\angle ACB$ 都对着弧 $${arcTex("AB")}$，由弦切角定理它们相等：$\\angle ACB = ${theta}^\\circ$。

**第二步：内角和。** $\\triangle ABC$ 的内角和是 $180^\\circ$：${steps(`\\angle BAC = 180^\\circ - ${theta}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}{{figure 0}}

**检验。** 用过 $A$ 的切线来看：另一侧的弦切角 $\\angle SAC$ 对着弧 $${arcTex("AC")}$，所以它等于圆周角 $\\angle ABC = ${beta}^\\circ$。$A$ 处沿切线的三个角合成平角：$\\angle TAB + \\angle BAC + \\angle CAS = ${theta}^\\circ + ${gamma}^\\circ + ${beta}^\\circ = 180^\\circ$。`,
            ),
          }),
          figure: figure(
            tangentChordMarks(s, m, [...tri, angleAt(pa, pt, pb, deg(theta)), angleAt(pb, pc, pa, deg(beta)), angleAt(pa, pb, pc, "?")]),
            `Line ST is tangent to a circle at A; triangle ABC is inscribed, angle TAB is ${theta}° and angle ABC is ${beta}°.`,
            `直线 ST 与圆相切于 A；三角形 ABC 内接于圆，角 TAB 为 ${theta}°，角 ABC 为 ${beta}°。`,
          ),
          solutionFigures: [
            figure(
              tangentChordMarks(
                s,
                m,
                [
                  ...tri,
                  angleAt(pa, pt, pb, deg(theta), "action"),
                  angleAt(pc, pa, pb, deg(theta), "action"),
                  angleAt(pb, pc, pa, deg(beta)),
                  angleAt(pa, pb, pc, deg(gamma), "result"),
                  angleAt(pa, ps, pc, deg(beta), "action"),
                ],
                deg(m),
                "action",
              ),
              `Angle ACB equals angle TAB, ${theta}°; with angle ABC of ${beta}°, angle BAC is ${gamma}°. Angle SAC on the other side of A equals angle ABC, ${beta}°.`,
              `角 ACB 等于角 TAB，为 ${theta}°；角 ABC 为 ${beta}°，所以角 BAC 为 ${gamma}°。A 另一侧的角 SAC 等于角 ABC，为 ${beta}°。`,
            ),
          ],
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

/** twoCirclesFigure shows circle A of radius 6 beside circle B of diameter 20, drawn to scale, with their radii marked. */
const twoCirclesFigure: Figure = (() => {
  const k = 0.3;
  const cb: Point = [7, 0];
  return {
    svg: sketch([
      circleAt(6 * k),
      circleAt(10 * k, cb),
      { kind: "segment", a: O, b: on(0, 6 * k), accent: true },
      { kind: "segment", a: on(180, 10 * k, cb), b: on(0, 10 * k, cb), dashed: true },
      { kind: "segment", a: cb, b: on(0, 10 * k, cb), accent: true },
      { kind: "dot", at: O },
      { kind: "dot", at: cb },
      { kind: "label", at: [0.9, 0], text: "6", dir: "n" },
      { kind: "label", at: [cb[0] + 1.5, 0], text: "10", dir: "n" },
      { kind: "label", at: [cb[0] - 1.5, 0], text: "20", dir: "s" },
      { kind: "label", at: on(135, 6 * k), text: "A", dir: "nw" },
      { kind: "label", at: on(135, 10 * k, cb), text: "B", dir: "nw" },
    ]),
    alt: t(
      "Circle A with radius 6 beside the larger circle B, whose dashed diameter is 20, so its radius is 10. The radii 6 and 10 are highlighted: the scale factor from A to B is 10/6 = 5/3.",
      "半径为 6 的圆 A，旁边是较大的圆 B，它的虚线直径为 20，所以半径为 10。半径 6 和 10 被高亮：从 A 到 B 的比例因子是 10/6 = 5/3。",
    ),
  };
})();

/** ratioTex writes a/b in lowest terms in LaTeX: "\frac{5}{3}", "2". */
const ratioTex = (a: number, b: number) => q(a, b).toLatex();

/** CircleLabels are the texts of a pair of scaled circles: on each radius, and under each circle. */
interface CircleLabels {
  readonly radiusA?: string;
  readonly radiusB?: string;
  readonly belowA?: string;
  readonly belowB?: string;
  /** diameterA and diameterB draw a dashed diameter with this text under it. */
  readonly diameterA?: string;
  readonly diameterB?: string;
}

/** scaledCircles draws circle A of radius ra and circle B of radius rb side by side, to scale (the larger about 3 units), with their radii in tones "action" (A) and "result" (B). */
function scaledCircles(ra: number, rb: number, labels: CircleLabels): Mark[] {
  const s = 3 / Math.max(ra, rb);
  const [a, b] = [ra * s, rb * s];
  const cb: Point = [a + b + 1.8, 0];
  const ring = (r: number, c: Point): Mark => ({ kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, r, c)) });
  const text = (at: Point, value: string | undefined, dir: Compass): Mark[] =>
    value !== undefined ? [{ kind: "label", at, text: value, dir }] : [];
  const diameter = (r: number, c: Point, value: string | undefined): Mark[] =>
    value !== undefined
      ? [{ kind: "segment", a: on(180, r, c), b: on(0, r, c), dashed: true }, ...text([c[0] - r / 2, 0], value, "s")]
      : [];
  return [
    ring(a, O),
    ring(b, cb),
    ...diameter(a, O, labels.diameterA),
    ...diameter(b, cb, labels.diameterB),
    seg(O, on(0, a), "action"),
    seg(cb, on(0, b, cb), "result"),
    { kind: "dot", at: O },
    { kind: "dot", at: cb },
    ...text([a / 2, 0], labels.radiusA, "n"),
    ...text([cb[0] + b / 2, 0], labels.radiusB, "n"),
    ...text(on(270, a), labels.belowA, "s"),
    ...text(on(270, b, cb), labels.belowB, "s"),
    { kind: "label", at: on(135, a), text: "A", dir: "nw", italic: true },
    { kind: "label", at: on(135, b, cb), text: "B", dir: "nw", italic: true },
  ];
}

/** similarityIntro draws a circle of radius 4 and its image under a dilation by 3, radius 12, with their circumferences and areas. */
const similarityIntro: Figure = figure(
  scaledCircles(4, 12, { radiusA: "4", radiusB: "12", belowA: "C = 8π, A = 16π", belowB: "C = 24π, A = 144π" }),
  "A circle of radius 4, with circumference 8π and area 16π, beside its image under a dilation by 3: radius 12, circumference 24π and area 144π.",
  "半径为 4 的圆，周长 8π、面积 16π；旁边是它按比例 3 位似后的像：半径 12，周长 24π，面积 144π。",
);

export const circleSimilarity: TopicDef = {
  id: "circle-similarity",
  title: t("Circle Similarity", "圆的相似"),
  summary: t(
    "All circles are similar: find the scale factor between two circles and use it for circumferences and areas.",
    "所有的圆都相似：求两个圆之间的比例因子，并用它求周长和面积。",
  ),
  prerequisites: ["dilations-of-geometric-figures", "areas-of-circles"],
  encompasses: [{ topic: "dilations-of-geometric-figures", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.C.A.1"],
  intro: t(
    `Two triangles are similar only when their angles match, but two circles are **always** similar: every circle has the same shape, and only its size, the radius, can differ. Dilate a circle of radius $4$ by a scale factor of $3$ and you get a circle of radius $12$:

{{figure 0}}

Every length is multiplied by $3$. The circumference goes from $2\\pi \\cdot 4 = 8\\pi$ to $2\\pi \\cdot 12 = 24\\pi$, three times as long. The area goes from $\\pi \\cdot 4^2 = 16\\pi$ to $\\pi \\cdot 12^2 = 144\\pi$, which is $9 = 3^2$ times as large, because an area has two lengths in it.

In this lesson we find the scale factor between two circles from their radii or diameters, and use it to go between circumferences, and between areas.`,
    `两个三角形只有在角对应相等时才相似，但两个圆**总是**相似的：所有的圆形状都一样，能不同的只有大小，也就是半径。把半径为 $4$ 的圆按比例因子 $3$ 作位似，就得到半径为 $12$ 的圆：

{{figure 0}}

每个长度都乘以 $3$。周长从 $2\\pi \\cdot 4 = 8\\pi$ 变为 $2\\pi \\cdot 12 = 24\\pi$，是原来的 $3$ 倍。面积从 $\\pi \\cdot 4^2 = 16\\pi$ 变为 $\\pi \\cdot 12^2 = 144\\pi$，是原来的 $9 = 3^2$ 倍，因为面积里含有两个长度。

这节课我们由半径或直径求两个圆之间的比例因子，再用它换算周长和面积。`,
  ),
  introFigures: [similarityIntro],
  knowledgePoints: [
    {
      id: "scale-factors-of-circles",
      title: t("Scale factors of circles", "圆的比例因子"),
      explanation: t(
        `Any two circles are **similar**: one can be moved and dilated onto the other. A circle is determined by its radius, so the scale factor from circle $A$ to circle $B$ is the ratio of the radii, or of the diameters:

$$k = \\frac{r_B}{r_A} = \\frac{d_B}{d_A}.$$

From a circle of radius $6$ to a circle of diameter $20$, first halve the diameter: the radius is $10$. The scale factor is $\\frac{10}{6} = \\frac{5}{3}$, and indeed $6 \\cdot \\frac{5}{3} = 10$.

> **Watch out.** The scale factor is **image over original**, $\\frac{r_B}{r_A}$: $\\frac{6}{10}$ maps $B$ onto $A$. It is a ratio, not the difference $10 - 6$. And compare radius with radius: $\\frac{20}{6}$ mixes a diameter with a radius.`,
        `任意两个圆都**相似**：一个圆经过移动和放缩可以与另一个重合。圆由半径决定，所以从圆 $A$ 到圆 $B$ 的比例因子是半径之比，也是直径之比：

$$k = \\frac{r_B}{r_A} = \\frac{d_B}{d_A}.$$

从半径为 $6$ 的圆到直径为 $20$ 的圆，先把直径减半：半径是 $10$。比例因子是 $\\frac{10}{6} = \\frac{5}{3}$，验证：$6 \\cdot \\frac{5}{3} = 10$。

> **注意。** 比例因子是**像比原图**，即 $\\frac{r_B}{r_A}$：$\\frac{6}{10}$ 是把 $B$ 变为 $A$ 的比例因子。它是比，不是差 $10 - 6$。还要用半径比半径：$\\frac{20}{6}$ 把直径和半径混在了一起。`,
      ),
      figure: twoCirclesFigure,
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
        const mixed = kind === 1 ? q(rb, 2 * ra) : kind === 2 ? q(2 * rb, ra) : undefined;
        const k = ratioTex(rb, ra);
        const radii =
          kind === 0
            ? t(
                `**Step 1: the radii.** Both radii are given: $r_A = ${ra}$ and $r_B = ${rb}$.`,
                `**第一步：两个半径。** 两个半径都已给出：$r_A = ${ra}$，$r_B = ${rb}$。`,
              )
            : t(
                `**Step 1: the radii.** Circle $${kind === 1 ? "A" : "B"}$ is given by its diameter; halve it so that radius is compared with radius:${steps(kind === 1 ? `r_A = ${2 * ra} \\div 2 = ${ra}` : `r_B = ${2 * rb} \\div 2 = ${rb}`)}`,
                `**第一步：两个半径。** 圆 $${kind === 1 ? "A" : "B"}$ 给的是直径；先减半，才能用半径比半径：${steps(kind === 1 ? `r_A = ${2 * ra} \\div 2 = ${ra}` : `r_B = ${2 * rb} \\div 2 = ${rb}`)}`,
              );
        const gap = kind === 0 ? "\n\n" : "";
        return {
          ...numberProblem({
            prompt: t(
              `Circle $A$ has ${given[0]!.en} and circle $B$ has ${given[1]!.en}. Find the scale factor of a dilation that maps circle $A$ onto a circle congruent to circle $B$.`,
              `圆 $A$ 的${given[0]!["zh-CN"]}，圆 $B$ 的${given[1]!["zh-CN"]}。求把圆 $A$ 变为与圆 $B$ 全等的圆的位似的比例因子。`,
            ),
            answer: q(rb, ra),
            wrong: some([q(ra, rb), rb - ra, mixed]),
            solution: t(
              `${radii.en}${gap}**Step 2: image over original.** The dilation starts from circle $A$ and ends at circle $B$, so the scale factor is $r_B$ over $r_A$:${steps(`k = \\frac{${rb}}{${ra}} = ${k}`)}{{figure 0}}

**Check.** Multiply the radius of $A$ by $k$: $${ra} \\cdot ${k} = ${rb}$, the radius of $B$. The diameters give the same ratio: $\\frac{${2 * rb}}{${2 * ra}} = ${k}$.`,
              `${radii["zh-CN"]}${gap}**第二步：像比原图。** 位似从圆 $A$ 出发、变到圆 $B$，所以比例因子是 $r_B$ 比 $r_A$：${steps(`k = \\frac{${rb}}{${ra}} = ${k}`)}{{figure 0}}

**检验。** 用圆 $A$ 的半径乘以 $k$：$${ra} \\cdot ${k} = ${rb}$，正是圆 $B$ 的半径。直径之比也一样：$\\frac{${2 * rb}}{${2 * ra}} = ${k}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              scaledCircles(ra, rb, {
                radiusA: String(ra),
                radiusB: String(rb),
                ...(kind === 1 && { diameterA: String(2 * ra) }),
                ...(kind === 2 && { diameterB: String(2 * rb) }),
              }),
              `Circle A has radius ${ra} and circle B radius ${rb}, drawn to scale; the scale factor from A to B is ${rb}/${ra}.`,
              `圆 A 半径为 ${ra}，圆 B 半径为 ${rb}，按比例画出；从 A 到 B 的比例因子是 ${rb}/${ra}。`,
            ),
          ],
        };
      },
    },
    {
      id: "circumferences-of-similar-circles",
      figure: geometryDrawings2["circle-similarity#circumferences-of-similar-circles"],
      title: t("Circumferences of similar circles", "相似圆的周长"),
      explanation: t(
        `A dilation with scale factor $k$ multiplies every length by $k$, including the circumference: $C = 2\\pi r$ becomes $2\\pi (kr) = k \\cdot C$.

A circle with circumference $36$ cm dilated with scale factor $\\frac{2}{3}$ has circumference $\\frac{2}{3} \\cdot 36 = 24$ cm. Likewise, if two circles have circumferences $8\\pi$ m and $12\\pi$ m and the first has radius $4$ m, the scale factor is $\\frac{12\\pi}{8\\pi} = \\frac{3}{2}$, so the second has radius $4 \\cdot \\frac{3}{2} = 6$ m; indeed $2\\pi \\cdot 6 = 12\\pi$.

> **Watch out.** A circumference is a **length**, so it is multiplied by $k$ itself, not by $k^2$: only areas use the square. Multiply by $k$, image over original, not by its reciprocal. And a dilation that is not $1$ does change the circumference.`,
        `比例因子为 $k$ 的位似把每个长度都乘以 $k$，周长也不例外：$C = 2\\pi r$ 变为 $2\\pi (kr) = k \\cdot C$。

周长为 $36$ 厘米的圆，经比例因子为 $\\frac{2}{3}$ 的位似后，周长是 $\\frac{2}{3} \\cdot 36 = 24$ 厘米。同样，若两个圆的周长分别是 $8\\pi$ 米和 $12\\pi$ 米，第一个圆的半径是 $4$ 米，则比例因子是 $\\frac{12\\pi}{8\\pi} = \\frac{3}{2}$，第二个圆的半径是 $4 \\cdot \\frac{3}{2} = 6$ 米；验证：$2\\pi \\cdot 6 = 12\\pi$。

> **注意。** 周长是**长度**，所以乘的是 $k$ 本身，不是 $k^2$：只有面积才用平方。要乘以 $k$（像比原图），不能乘它的倒数。比例因子不是 $1$ 的位似一定会改变周长。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const u = pickUnit(rng);
        if (rng.bool()) {
          const c = b * rng.int(2, 12);
          const image = (a * c) / b;
          const k = ratioTex(a, b);
          return {
            ...numberProblem({
              prompt: t(
                `A circle with a circumference of $${tex(c, u)}$ is dilated with a scale factor of $${k}$. Find the circumference of the image.`,
                `周长为 $${tex(c, u)}$ 的圆经比例因子为 $${k}$ 的位似变换。求像的周长。`,
              ),
              answer: image,
              unit: u,
              wrong: [q(a * a * c, b * b), q(b * c, a), c],
              solution: t(
                `**Step 1: what scales.** The circumference $2\\pi r$ is a length: the dilation multiplies the radius by $${k}$, so it multiplies the circumference by $${k}$ too.

**Step 2: multiply.**${steps(`${k} \\cdot ${c} = ${tex(image, u)}`)}{{figure 0}}

**Check.** Undo the dilation: dividing the image's circumference by the scale factor gives back the original, $${image} \\div ${k} = ${c}$.`,
                `**第一步：什么在放缩。** 周长 $2\\pi r$ 是长度：位似把半径乘以 $${k}$，所以周长也乘以 $${k}$。

**第二步：相乘。**${steps(`${k} \\cdot ${c} = ${tex(image, u)}`)}{{figure 0}}

**检验。** 把位似倒回去：像的周长除以比例因子，应得到原来的周长，$${image} \\div ${k} = ${c}$。`,
              ),
            }),
            solutionFigures: [
              figure(
                scaledCircles(b, a, { belowA: `C = ${len(c, u)}`, belowB: `C = ${len(image, u)}` }),
                `The original circle with circumference ${len(c, u)} and its image under the dilation by ${a}/${b}, drawn to scale, with circumference ${len(image, u)}.`,
                `周长为 ${len(c, u)} 的原圆，以及按比例 ${a}/${b} 位似后的像（按比例画出），像的周长为 ${len(image, u)}。`,
              ),
            ],
          };
        }
        const ra = a * rng.int(1, 5);
        const rb = (ra * b) / a;
        const [ca, cb] = [2 * ra, 2 * rb];
        const k = ratioTex(b, a);
        return {
          ...numberProblem({
            prompt: t(
              `Circles $A$ and $B$ have circumferences $${tex(`${ca}\\pi`, u)}$ and $${tex(`${cb}\\pi`, u)}$. The radius of circle $A$ is $${tex(ra, u)}$. Find the radius of circle $B$.`,
              `圆 $A$ 与圆 $B$ 的周长分别是 $${tex(`${ca}\\pi`, u)}$ 和 $${tex(`${cb}\\pi`, u)}$。圆 $A$ 的半径是 $${tex(ra, u)}$。求圆 $B$ 的半径。`,
            ),
            answer: rb,
            unit: u,
            wrong: [q(ra * a, b), q(ra * b * b, a * a), ra + cb - ca],
            solution: t(
              `**Step 1: the scale factor from the circumferences.** Circumferences are lengths, so their ratio is the scale factor from $A$ to $B$:${steps(`k = \\frac{${cb}\\pi}{${ca}\\pi} = ${k}`)}**Step 2: scale the radius.** The radius is a length too:${steps(`r_B = ${k} \\cdot ${ra} = ${tex(rb, u)}`)}{{figure 0}}

**Check.** A circle of radius $${rb}$ has circumference $2\\pi \\cdot ${rb} = ${cb}\\pi$, the circumference of $B$.`,
              `**第一步：由周长求比例因子。** 周长是长度，所以周长之比就是从 $A$ 到 $B$ 的比例因子：${steps(`k = \\frac{${cb}\\pi}{${ca}\\pi} = ${k}`)}**第二步：放缩半径。** 半径也是长度：${steps(`r_B = ${k} \\cdot ${ra} = ${tex(rb, u)}`)}{{figure 0}}

**检验。** 半径为 $${rb}$ 的圆，周长是 $2\\pi \\cdot ${rb} = ${cb}\\pi$，正是圆 $B$ 的周长。`,
            ),
          }),
          solutionFigures: [
            figure(
              scaledCircles(ra, rb, { radiusA: String(ra), radiusB: String(rb), belowA: `C = ${ca}π`, belowB: `C = ${cb}π` }),
              `Circle A with radius ${ra} and circumference ${ca}π, and circle B with circumference ${cb}π and radius ${rb}, drawn to scale.`,
              `圆 A 半径为 ${ra}、周长 ${ca}π，圆 B 周长 ${cb}π、半径 ${rb}，按比例画出。`,
            ),
          ],
        };
      },
    },
    {
      id: "areas-of-similar-circles",
      figure: geometryDrawings2["circle-similarity#areas-of-similar-circles"],
      title: t("Areas of similar circles", "相似圆的面积"),
      explanation: t(
        `Areas are multiplied by the **square** of the scale factor: $\\pi r^2$ becomes $\\pi (kr)^2 = k^2 \\cdot \\pi r^2$. The radius is multiplied by $k$, and it appears twice in the area.

A circle with area $45\\text{ cm}^2$ dilated with scale factor $\\frac{2}{3}$ has area $\\frac{4}{9} \\cdot 45 = 20\\text{ cm}^2$. Going back, if two circles have areas $18$ and $50$, the ratio of areas is $\\frac{50}{18} = \\frac{25}{9}$, so the scale factor is $\\sqrt{\\frac{25}{9}} = \\frac{5}{3}$; indeed $\\left(\\frac{5}{3}\\right)^2 \\cdot 18 = 50$.

> **Watch out.** Multiplying an area by $k$ alone treats it like a length: square the scale factor. Going from areas to the scale factor, the ratio of areas is $k^2$, so take its square root. Keep image over original, and compare by a ratio, not by the difference of the areas.`,
        `面积乘以比例因子的**平方**：$\\pi r^2$ 变为 $\\pi (kr)^2 = k^2 \\cdot \\pi r^2$。半径乘以 $k$，而面积里半径出现了两次。

面积为 $45\\text{ cm}^2$ 的圆，经比例因子为 $\\frac{2}{3}$ 的位似后，面积是 $\\frac{4}{9} \\cdot 45 = 20\\text{ cm}^2$。反过来，若两个圆的面积分别是 $18$ 和 $50$，面积之比是 $\\frac{50}{18} = \\frac{25}{9}$，所以比例因子是 $\\sqrt{\\frac{25}{9}} = \\frac{5}{3}$；验证：$\\left(\\frac{5}{3}\\right)^2 \\cdot 18 = 50$。

> **注意。** 只把面积乘以 $k$，是把面积当成了长度：要乘比例因子的平方。由面积求比例因子时，面积之比是 $k^2$，要开平方。始终是像比原图，而且要用比，不能用两个面积的差。`,
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const u = pickUnit(rng);
        if (rng.bool()) {
          const area = b * b * rng.int(1, 8);
          const image = (a * a * area) / (b * b);
          const [k, k2] = [ratioTex(a, b), ratioTex(a * a, b * b)];
          return {
            ...numberProblem({
              prompt: t(
                `A circle with an area of $${tex(area, u)}^2$ is dilated with a scale factor of $${k}$. Find the area of the image.`,
                `面积为 $${tex(area, u)}^2$ 的圆经比例因子为 $${k}$ 的位似变换。求像的面积。`,
              ),
              answer: image,
              unit: `${u}^2`,
              wrong: [q(a * area, b), q(b * b * area, a * a), area],
              solution: t(
                `**Step 1: the factor for areas.** The area $\\pi r^2$ contains the radius twice, so it is multiplied by the square of the scale factor:${steps(`k^2 = \\left(${k}\\right)^2 = ${k2}`)}**Step 2: multiply.**${steps(`${k2} \\cdot ${area} = ${image}\\text{ ${u}}^2`)}{{figure 0}}

**Check.** Undo the dilation: dividing the image's area by $k^2$ gives back the original, $${image} \\div ${k2} = ${area}$.`,
                `**第一步：面积的倍数。** 面积 $\\pi r^2$ 里半径出现两次，所以面积乘以比例因子的平方：${steps(`k^2 = \\left(${k}\\right)^2 = ${k2}`)}**第二步：相乘。**${steps(`${k2} \\cdot ${area} = ${image}\\text{ ${u}}^2`)}{{figure 0}}

**检验。** 把位似倒回去：像的面积除以 $k^2$，应得到原来的面积，$${image} \\div ${k2} = ${area}$。`,
              ),
            }),
            solutionFigures: [
              figure(
                scaledCircles(b, a, { belowA: `A = ${len(area, u)}²`, belowB: `A = ${len(image, u)}²` }),
                `The original circle with area ${area} square ${u} and its image under the dilation by ${a}/${b}, drawn to scale, with area ${image} square ${u}.`,
                `面积为 ${area} 平方 ${u} 的原圆，以及按比例 ${a}/${b} 位似后的像（按比例画出），像的面积为 ${image} 平方 ${u}。`,
              ),
            ],
          };
        }
        const m = rng.int(1, 6);
        const [areaA, areaB] = [b * b * m, a * a * m];
        const [k, k2] = [ratioTex(a, b), ratioTex(a * a, b * b)];
        return {
          ...numberProblem({
            prompt: t(
              `Circle $A$ has an area of $${tex(areaA, u)}^2$ and circle $B$ has an area of $${tex(areaB, u)}^2$. Find the scale factor of a dilation that maps circle $A$ onto a circle congruent to circle $B$.`,
              `圆 $A$ 的面积是 $${tex(areaA, u)}^2$，圆 $B$ 的面积是 $${tex(areaB, u)}^2$。求把圆 $A$ 变为与圆 $B$ 全等的圆的位似的比例因子。`,
            ),
            answer: q(a, b),
            wrong: [q(a * a, b * b), q(b, a), q(Math.abs(areaB - areaA), 1)],
            solution: t(
              `**Step 1: the ratio of the areas.** Image over original, the areas are in the ratio $k^2$:${steps(`k^2 = \\frac{${areaB}}{${areaA}} = ${k2}`)}**Step 2: take the square root.** The scale factor is positive:${steps(`k = \\sqrt{${k2}} = ${k}`)}{{figure 0}}

**Check.** Square the scale factor and apply it to the area of $A$: $\\left(${k}\\right)^2 \\cdot ${areaA} = ${k2} \\cdot ${areaA} = ${areaB}$, the area of $B$.`,
              `**第一步：面积之比。** 像比原图，面积之比是 $k^2$：${steps(`k^2 = \\frac{${areaB}}{${areaA}} = ${k2}`)}**第二步：开平方。** 比例因子是正数：${steps(`k = \\sqrt{${k2}} = ${k}`)}{{figure 0}}

**检验。** 把比例因子平方后乘以圆 $A$ 的面积：$\\left(${k}\\right)^2 \\cdot ${areaA} = ${k2} \\cdot ${areaA} = ${areaB}$，正是圆 $B$ 的面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              scaledCircles(b, a, { belowA: `A = ${len(areaA, u)}²`, belowB: `A = ${len(areaB, u)}²` }),
              `Circle A with area ${areaA} square ${u} and circle B with area ${areaB} square ${u}, drawn to scale; their radii are in the ratio ${a}/${b}.`,
              `圆 A 面积为 ${areaA} 平方 ${u}，圆 B 面积为 ${areaB} 平方 ${u}，按比例画出；它们的半径之比是 ${a}/${b}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Proving circle similarity
// ---------------------------------------------------------------------------

/** shiftTex writes x + a for a translation rule: "x + 3", "y - 2", "x". */
const shiftTex = (v: string, a: number) => (a === 0 ? v : `${v} ${a > 0 ? "+" : "-"} ${Math.abs(a)}`);

/** ruleTex writes the translation (x, y) → (x + a, y + b). */
const ruleTex = (a: number, b: number) => `(x, y) \\to (${shiftTex("x", a)}, ${shiftTex("y", b)})`;

/** minus writes a − b with b in parentheses when it is negative: "3 - (-2)". */
const minus = (a: number, b: number) => `${a} - ${b < 0 ? `(${b})` : b}`;

/** plus writes a + b with b in parentheses when it is negative: "3 + (-2)". */
const plus = (a: number, b: number) => `${a} + ${b < 0 ? `(${b})` : b}`;

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

/** circleMappingFigure maps the circle with center (1, 2) and radius 3 onto the circle with center (4, −1) and radius 6: translated (dashed), then dilated. */
const circleMappingFigure: Figure = {
  svg: plane({ xMin: -3, xMax: 11, yMin: -8, yMax: 6, labelEvery: 2 }, [
    { kind: "circle", center: [1, 2], r: 3 },
    { kind: "circle", center: [4, -1], r: 3, dashed: true },
    { kind: "circle", center: [4, -1], r: 6, accent: true },
    { kind: "segment", a: [1, 2], b: [4, -1], dashed: true },
    { kind: "point", at: [1, 2], label: "A", dir: "nw" },
    { kind: "point", at: [4, -1], label: "B", dir: "se" },
  ]),
  alt: t(
    "Circle A with center (1, 2) and radius 3 is translated so its center lands on (4, −1), the dashed circle, and then dilated about (4, −1) by 2 onto circle B with radius 6.",
    "圆心 (1, 2)、半径 3 的圆 A 先平移，使圆心落在 (4, −1)（虚线圆），再以 (4, −1) 为中心按比例 2 位似，得到半径 6 的圆 B。",
  ),
};

/** mappingFigure draws circle A, its translate centered on B's center (dashed, tone "action") and circle B (tone "result") in a coordinate plane that fits all three. */
function mappingFigure(A: CircleData, B: CircleData): Figure {
  const all = [A, { ...B, r: A.r }, B];
  const xMin = Math.floor(Math.min(...all.map((c) => c.h - c.r))) - 1;
  const xMax = Math.ceil(Math.max(...all.map((c) => c.h + c.r))) + 1;
  const yMin = Math.floor(Math.min(...all.map((c) => c.k - c.r))) - 1;
  const yMax = Math.ceil(Math.max(...all.map((c) => c.k + c.r))) + 1;
  const span = Math.max(xMax - xMin, yMax - yMin);
  const step = span > 24 ? 2 : 1;
  return {
    svg: plane({ xMin, xMax, yMin, yMax, step, labelEvery: span / step > 14 ? 2 : 1 }, [
      { kind: "circle", center: [A.h, A.k], r: A.r },
      { kind: "segment", a: [A.h, A.k], b: [B.h, B.k], dashed: true, tone: "action" },
      { kind: "circle", center: [B.h, B.k], r: A.r, dashed: true, tone: "action" },
      { kind: "circle", center: [B.h, B.k], r: B.r, tone: "result" },
      { kind: "point", at: [A.h, A.k], label: "A", dir: "nw" },
      { kind: "point", at: [B.h, B.k], label: "B", dir: "se" },
    ]),
    alt: t(
      `Circle A with center (${A.h}, ${A.k}) and radius ${A.r} is translated so its center lands on (${B.h}, ${B.k}), the dashed circle of radius ${A.r}, and then dilated about (${B.h}, ${B.k}) onto circle B with radius ${B.r}.`,
      `圆心 (${A.h}, ${A.k})、半径 ${A.r} 的圆 A 先平移，使圆心落在 (${B.h}, ${B.k})（半径 ${A.r} 的虚线圆），再以 (${B.h}, ${B.k}) 为中心作位似，得到半径 ${B.r} 的圆 B。`,
    ),
  };
}

/** provingIntro maps the circle with center (−1, 3) and radius 2 onto the circle with center (2, 1) and radius 5. */
const provingIntro: Figure = mappingFigure({ h: -1, k: 3, r: 2 }, { h: 2, k: 1, r: 5 });

/** ProofStep is a statement of the circle similarity proof with its reason. */
interface ProofStep {
  readonly s: Text;
  readonly r: Text;
  /** purpose says what the step does in the proof. */
  readonly purpose: Text;
  /** alts are wrong statements for the step, each with why it is wrong. */
  readonly alts: readonly { readonly text: Text; readonly why: Text }[];
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

/** reasonWhy says why each proof reason is wrong for a step it does not justify. */
const reasonWhy: Record<keyof typeof proofReasons, Text> = {
  translation: t("This is the reason for step 1, where the translation keeps the radius.", "这是第 1 步的理由：平移使半径保持不变。"),
  dilation: t(
    "This is the reason for step 2, where the dilation changes the distance from $B$.",
    "这是第 2 步的理由：位似改变了到 $B$ 的距离。",
  ),
  circle: t("This is the reason for step 3, which recognizes the image as circle $B$.", "这是第 3 步的理由：它认出像就是圆 $B$。"),
  similarity: t(
    "This is the reason for step 4, the conclusion drawn from the two transformations.",
    "这是第 4 步的理由：由两个变换得出的结论。",
  ),
  wrongDilation: t("False: a dilation with a scale factor other than $1$ changes distances.", "错误：比例因子不是 $1$ 的位似会改变距离。"),
  wrongTranslation: t("False: a translation keeps every distance.", "错误：平移保持所有距离不变。"),
  inscribed: t(
    "The proof uses no inscribed angles: it is about the radius under transformations.",
    "证明里没有用到圆周角：它讲的是变换下的半径。",
  ),
  tangent: t("The proof draws no tangent line.", "证明里没有画切线。"),
};

/** proofFigure draws the general proof to scale: circle A of radius r, its translate centered at B (tone "action") and circle B of radius s (tone "result"). */
function proofFigure(r: number, s: number): Figure {
  const u = 2.5 / Math.max(r, s);
  const [a, b] = [r * u, s * u];
  const cb: Point = [a + Math.max(a, b) + 1.5, 0];
  const ring = (rr: number, c: Point, tone?: Tone): Mark => ({
    kind: "polygon",
    points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, rr, c)),
    ...(tone && { tone }),
  });
  return figure(
    [
      ring(a, O),
      ring(a, cb, "action"),
      ring(b, cb, "result"),
      { kind: "segment", a: O, b: cb, dashed: true },
      seg(O, on(90, a), "action"),
      seg(cb, on(90, a, cb), "action"),
      seg(cb, on(0, b, cb), "result"),
      { kind: "dot", at: O },
      { kind: "dot", at: cb },
      { kind: "label", at: on(90, a / 2), text: String(r), dir: "w" },
      { kind: "label", at: on(90, a / 2, cb), text: String(r), dir: "w" },
      { kind: "label", at: on(0, b / 2, cb), text: String(s), dir: "s" },
      { kind: "label", at: O, text: "A", dir: "sw", italic: true },
      { kind: "label", at: cb, text: "B", dir: "sw", italic: true },
    ],
    `Circle A with radius ${r} is translated so its center lands on B, keeping radius ${r}, and then dilated about B by ${s}/${r} onto circle B with radius ${s}.`,
    `半径为 ${r} 的圆 A 先平移，使圆心落在 B，半径仍为 ${r}；再以 B 为中心按比例 ${s}/${r} 位似，得到半径为 ${s} 的圆 B。`,
  );
}

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
  intro: t(
    `"All circles are similar" means more than "they look alike": for any two circles there is a similarity transformation that carries one onto the other. We can build it in two moves, one for the center and one for the radius.

Take circle $A$ with center $(-1, 3)$ and radius $2$, and circle $B$ with center $(2, 1)$ and radius $5$:

{{figure 0}}

1. **Translate** so the centers match: $(-1, 3)$ must go to $(2, 1)$, which is $(x, y) \\to (x + 3, y - 2)$. A translation keeps distances, so the image (dashed) still has radius $2$.
2. **Dilate** about $(2, 1)$ with scale factor $\\frac{5}{2}$. The center stays put, and every point at distance $2$ from it moves to distance $2 \\cdot \\frac{5}{2} = 5$: that is circle $B$.

In this lesson we find the translation and the scale factor for circles in the coordinate plane, then write the proof that works for any two circles.`,
    `“所有的圆都相似”不只是“看起来像”：对任意两个圆，都有一个相似变换把其中一个变为另一个。我们分两步构造它：一步管圆心，一步管半径。

取圆 $A$（圆心 $(-1, 3)$，半径 $2$）和圆 $B$（圆心 $(2, 1)$，半径 $5$）：

{{figure 0}}

1. **平移**使两个圆心重合：$(-1, 3)$ 要移到 $(2, 1)$，即 $(x, y) \\to (x + 3, y - 2)$。平移保持距离不变，所以像（虚线圆）的半径仍是 $2$。
2. 以 $(2, 1)$ 为中心、比例因子 $\\frac{5}{2}$ 作**位似**。圆心不动，到它距离为 $2$ 的每个点都移到距离 $2 \\cdot \\frac{5}{2} = 5$ 处：这就是圆 $B$。

这节课我们先在坐标平面中求平移和比例因子，再写出对任意两个圆都成立的证明。`,
  ),
  introFigures: [provingIntro],
  knowledgePoints: [
    {
      id: "mapping-one-circle-onto-another",
      title: t("Mapping one circle onto another", "把一个圆变为另一个圆"),
      explanation: t(
        `To map circle $A$ (center $(h_1, k_1)$, radius $r_1$) onto circle $B$ (center $(h_2, k_2)$, radius $r_2$):

1. **Translate** by $(x, y) \\to (x + h_2 - h_1, y + k_2 - k_1)$. The center moves onto $(h_2, k_2)$ and the radius stays $r_1$.
2. **Dilate** about $(h_2, k_2)$ with scale factor $\\frac{r_2}{r_1}$. The center stays put and the radius becomes $r_2$.

For circle $A$ with center $(1, 2)$ and radius $3$, and circle $B$ with center $(4, -1)$ and radius $6$: translate by $(x, y) \\to (x + 3, y - 3)$, then dilate about $(4, -1)$ with scale factor $2$.

> **Watch out.** The translation goes **from** $A$ **to** $B$: subtract $A$'s center from $B$'s, not the other way. The dilation must be about $B$'s center, where the translation put the circle; about the origin it would move the center again. Its scale factor is the new radius over the old, $\\frac{r_2}{r_1}$, not upside down.`,
        `要把圆 $A$（圆心 $(h_1, k_1)$，半径 $r_1$）变为圆 $B$（圆心 $(h_2, k_2)$，半径 $r_2$）：

1. **平移** $(x, y) \\to (x + h_2 - h_1, y + k_2 - k_1)$。圆心移到 $(h_2, k_2)$，半径仍为 $r_1$。
2. 以 $(h_2, k_2)$ 为中心、比例因子为 $\\frac{r_2}{r_1}$ 作**位似**。圆心不动，半径变为 $r_2$。

圆 $A$ 圆心 $(1, 2)$、半径 $3$，圆 $B$ 圆心 $(4, -1)$、半径 $6$：先平移 $(x, y) \\to (x + 3, y - 3)$，再以 $(4, -1)$ 为中心、比例因子 $2$ 作位似。

> **注意。** 平移是**从** $A$ **到** $B$：用 $B$ 的圆心减去 $A$ 的圆心，不能反过来。位似中心必须是 $B$ 的圆心，也就是平移后圆所在的位置；以原点为中心会把圆心再移走。比例因子是新半径比旧半径 $\\frac{r_2}{r_1}$，不能颠倒。`,
      ),
      figure: circleMappingFigure,
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
        const factor = k === `\\frac{${B.r}}{${A.r}}` ? k : `\\frac{${B.r}}{${A.r}} = ${k}`;
        const [ex, ey] = [A.h + A.r, A.k];
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `Which sequence of transformations maps ${circleTex("A", A)} onto ${circleTex("B", B)}?`,
                `下列哪一组变换把${circleTexZh("A", A)}变为${circleTexZh("B", B)}？`,
              ),
              options: shuffled,
              correct: shuffled.indexOf(options[0]!),
              solution: t(
                `**Step 1: the translation.** It must move the center $(${A.h}, ${A.k})$ onto $${centerB}$, so it adds the differences of the centers:${steps(`a = ${minus(B.h, A.h)} = ${a}, \\quad b = ${minus(B.k, A.k)} = ${b}`, ruleTex(a, b))}The radius is still $${A.r}$, because a translation keeps distances.

**Step 2: the dilation.** It must keep the center where the translation put it, so it is about $${centerB}$, and it must take the radius $${A.r}$ to $${B.r}$:${steps(`k = ${factor}`)}{{figure 0}}

**Check.** Follow the rightmost point of circle $A$, $(${ex}, ${ey})$. The translation takes it to $(${plus(ex, a)}, ${plus(ey, b)}) = (${ex + a}, ${ey + b})$, at distance $${A.r}$ to the right of $${centerB}$. The dilation multiplies that distance by $${k}$: $${A.r} \\cdot ${k} = ${B.r}$, so it lands on $(${B.h + B.r}, ${B.k})$, the rightmost point of circle $B$.`,
                `**第一步：平移。** 它要把圆心 $(${A.h}, ${A.k})$ 移到 $${centerB}$，所以加上两个圆心坐标之差：${steps(`a = ${minus(B.h, A.h)} = ${a}, \\quad b = ${minus(B.k, A.k)} = ${b}`, ruleTex(a, b))}半径仍是 $${A.r}$，因为平移保持距离不变。

**第二步：位似。** 它要使平移后的圆心不动，所以位似中心是 $${centerB}$；还要把半径 $${A.r}$ 变为 $${B.r}$：${steps(`k = ${factor}`)}{{figure 0}}

**检验。** 跟踪圆 $A$ 最右边的点 $(${ex}, ${ey})$。平移把它移到 $(${plus(ex, a)}, ${plus(ey, b)}) = (${ex + a}, ${ey + b})$，在 $${centerB}$ 右边距离 $${A.r}$ 处。位似把这个距离乘以 $${k}$：$${A.r} \\cdot ${k} = ${B.r}$，所以它落在 $(${B.h + B.r}, ${B.k})$，正是圆 $B$ 最右边的点。`,
              ),
            }),
            solutionFigures: [mappingFigure(A, B)],
          },
          [
            [
              options[1]!.en,
              "The scale factor is upside down: it is the new radius over the old one.",
              "比例因子颠倒了：应该是新半径比旧半径。",
            ],
            [
              options[2]!.en,
              "The translation goes the wrong way: it must carry the center of $A$ onto the center of $B$.",
              "平移方向反了：它应把圆 $A$ 的圆心移到圆 $B$ 的圆心。",
            ],
            [
              options[3]!.en,
              "Dilating about the origin moves the center away from where the translation put it: dilate about the center of $B$.",
              "以原点为中心位似会把圆心从平移后的位置移开：应以圆 $B$ 的圆心为中心。",
            ],
          ],
        );
      },
    },
    {
      id: "the-translation-and-the-scale-factor",
      figure: geometryDrawings2["proving-circle-similarity#the-translation-and-the-scale-factor"],
      title: t("The translation and the scale factor", "平移与比例因子"),
      explanation: t(
        `The translation is found from the centers, the scale factor from the radii. The translation $(x, y) \\to (x + a, y + b)$ must carry the center of $A$ onto the center of $B$, so $(a, b)$ is center $B$ minus center $A$. The translation keeps the radius, so the dilation alone must change it: the scale factor is $\\frac{r_B}{r_A}$.

For circle $A$ with center $(-2, 5)$ and radius $4$, and circle $B$ with center $(3, 1)$ and radius $10$: $a = 3 - (-2) = 5$ and $b = 1 - 5 = -4$, so $(a, b) = (5, -4)$; the scale factor is $\\frac{10}{4} = \\frac{5}{2}$.

> **Watch out.** Subtract in the right order, $B$ minus $A$: the reverse gives $(-a, -b)$, which moves $B$ onto $A$. Keep $a$ for $x$ and $b$ for $y$, and do not add the centers. The scale factor is a ratio of the radii, new over old: not their difference, not the reciprocal, and not their squares.`,
        `平移由两个圆心求出，比例因子由两个半径求出。平移 $(x, y) \\to (x + a, y + b)$ 要把圆 $A$ 的圆心移到圆 $B$ 的圆心，所以 $(a, b)$ 是 $B$ 的圆心减去 $A$ 的圆心。平移不改变半径，所以只能由位似改变它：比例因子是 $\\frac{r_B}{r_A}$。

圆 $A$ 圆心 $(-2, 5)$、半径 $4$，圆 $B$ 圆心 $(3, 1)$、半径 $10$：$a = 3 - (-2) = 5$，$b = 1 - 5 = -4$，所以 $(a, b) = (5, -4)$；比例因子是 $\\frac{10}{4} = \\frac{5}{2}$。

> **注意。** 减法的顺序是 $B$ 减 $A$：反过来得到 $(-a, -b)$，那是把 $B$ 移到 $A$。$a$ 对应 $x$，$b$ 对应 $y$，也不要把两个圆心相加。比例因子是半径之比（新比旧）：不是差，不是倒数，也不是平方之比。`,
      ),
      keyPrerequisites: ["translations-of-geometric-figures"],
      generate(rng) {
        const [A, B] = twoCircles(rng);
        const [a, b] = [B.h - A.h, B.k - A.k];
        const intro = t(
          `${circleTex("A", A)[0]!.toUpperCase()}${circleTex("A", A).slice(1)} is mapped onto ${circleTex("B", B)} by a translation $(x, y) \\to (x + a, y + b)$ followed by a dilation about $(${B.h}, ${B.k})$.`,
          `${circleTexZh("A", A)}先经平移 $(x, y) \\to (x + a, y + b)$，再经以 $(${B.h}, ${B.k})$ 为中心的位似，变为${circleTexZh("B", B)}。`,
        );
        const drawn = [mappingFigure(A, B)];
        if (rng.bool()) {
          return {
            ...pointProblem({
              prompt: t(`${intro.en} Find $(a, b)$.`, `${intro["zh-CN"]}求 $(a, b)$。`),
              answer: [a, b],
              vars: ["a", "b"],
              wrong: [
                [-a, -b],
                [b, a],
                [B.h + A.h, B.k + A.k],
              ],
              solution: t(
                `**Step 1: what the translation does.** It moves the center of $A$, $(${A.h}, ${A.k})$, onto the center of $B$, $(${B.h}, ${B.k})$; the dilation after it is about that point, so it does not move it again.

**Step 2: subtract the centers.** Center $B$ minus center $A$, coordinate by coordinate:${steps(`a = ${minus(B.h, A.h)} = ${a}`, `b = ${minus(B.k, A.k)} = ${b}`)}{{figure 0}}

**Check.** Add $(a, b)$ to the center of $A$: $(${plus(A.h, a)}, ${plus(A.k, b)}) = (${B.h}, ${B.k})$, the center of $B$.`,
                `**第一步：平移做什么。** 它把圆 $A$ 的圆心 $(${A.h}, ${A.k})$ 移到圆 $B$ 的圆心 $(${B.h}, ${B.k})$；之后的位似以这个点为中心，不会再移动它。

**第二步：圆心相减。** 用 $B$ 的圆心减去 $A$ 的圆心，逐个坐标计算：${steps(`a = ${minus(B.h, A.h)} = ${a}`, `b = ${minus(B.k, A.k)} = ${b}`)}{{figure 0}}

**检验。** 把 $(a, b)$ 加到圆 $A$ 的圆心上：$(${plus(A.h, a)}, ${plus(A.k, b)}) = (${B.h}, ${B.k})$，正是圆 $B$ 的圆心。`,
              ),
            }),
            solutionFigures: drawn,
          };
        }
        const k = ratioTex(B.r, A.r);
        return {
          ...numberProblem({
            prompt: t(`${intro.en} Find the scale factor of the dilation.`, `${intro["zh-CN"]}求位似的比例因子。`),
            answer: q(B.r, A.r),
            wrong: [q(A.r, B.r), B.r - A.r, q(B.r * B.r, A.r * A.r)],
            solution: t(
              `**Step 1: the radius after the translation.** A translation keeps distances, so the translated circle still has radius $${A.r}$; only the dilation can change it.

**Step 2: new radius over old.** The dilation must make the radius $${B.r}$:${steps(`k = \\frac{${B.r}}{${A.r}} = ${k}`)}{{figure 0}}

**Check.** Apply the scale factor to the radius of $A$: $${A.r} \\cdot ${k} = ${B.r}$, the radius of $B$.`,
              `**第一步：平移后的半径。** 平移保持距离不变，所以平移后的圆半径仍是 $${A.r}$；只有位似能改变它。

**第二步：新半径比旧半径。** 位似要把半径变为 $${B.r}$：${steps(`k = \\frac{${B.r}}{${A.r}} = ${k}`)}{{figure 0}}

**检验。** 用比例因子乘以圆 $A$ 的半径：$${A.r} \\cdot ${k} = ${B.r}$，正是圆 $B$ 的半径。`,
            ),
          }),
          solutionFigures: drawn,
        };
      },
    },
    {
      id: "the-proof-that-all-circles-are-similar",
      figure: geometryDrawings2["proving-circle-similarity#the-proof-that-all-circles-are-similar"],
      title: t("The proof that all circles are similar", "所有圆都相似的证明"),
      explanation: t(
        `**Theorem:** any two circles are similar. Let circle $A$ have center $A$ and radius $r$, and circle $B$ center $B$ and radius $s$.

1. Translate circle $A$ so that $A$ goes to $B$. The image is a circle with center $B$ and radius $r$, because a translation preserves distances.
2. Dilate that image about $B$ with scale factor $\\frac{s}{r}$. Each of its points, at distance $r$ from $B$, goes to distance $r \\cdot \\frac{s}{r} = s$ from $B$, because a dilation multiplies distances from its center by the scale factor.
3. The final image is the set of all points at distance $s$ from $B$, which is circle $B$ by the definition of a circle.
4. A translation followed by a dilation is a similarity transformation, so circle $A$ is similar to circle $B$.

Follow the radius through the proof: $r$ after the translation, $s$ after the dilation.

> **Watch out.** Each reason belongs to its own step: the translation **keeps** distances (step 1) and the dilation **multiplies** them (step 2), never the other way. After the translation the radius is still $r$, and the dilation multiplies it by $\\frac{s}{r}$; it does not add the scale factor. Inscribed angles and tangents play no part in this proof.`,
        `**定理**：任意两个圆都相似。设圆 $A$ 的圆心为 $A$、半径为 $r$，圆 $B$ 的圆心为 $B$、半径为 $s$。

1. 平移圆 $A$，使 $A$ 移到 $B$。像是圆心为 $B$、半径为 $r$ 的圆，因为平移保持距离不变。
2. 以 $B$ 为中心、比例因子 $\\frac{s}{r}$ 对这个像作位似。它的每个点到 $B$ 的距离是 $r$，变为 $r \\cdot \\frac{s}{r} = s$，因为位似把到中心的距离乘以比例因子。
3. 最后的像是到 $B$ 距离为 $s$ 的所有点，由圆的定义，它就是圆 $B$。
4. 平移后再作位似是相似变换，所以圆 $A$ 与圆 $B$ 相似。

在证明中跟踪半径：平移后是 $r$，位似后是 $s$。

> **注意。** 每个理由只属于自己的那一步：平移**保持**距离（第 1 步），位似把距离**乘以**比例因子（第 2 步），不能反过来。平移后半径仍是 $r$，位似把它乘以 $\\frac{s}{r}$，而不是加上比例因子。圆周角和切线在这个证明里都用不到。`,
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
            purpose: t("It moves the center of $A$ onto $B$ without changing the radius.", "它把圆 $A$ 的圆心移到 $B$，而不改变半径。"),
            alts: [
              {
                text: t(`… a circle with center $B$ and radius $${s}$.`, `……圆心为 $B$、半径为 $${s}$ 的圆。`),
                why: t(
                  `A translation keeps the radius $${r}$; only the dilation makes it $${s}$.`,
                  `平移使半径保持为 $${r}$；只有位似才把它变为 $${s}$。`,
                ),
              },
              {
                text: t(`… a circle with center $A$ and radius $${s}$.`, `……圆心为 $A$、半径为 $${s}$ 的圆。`),
                why: t(
                  `The translation moves the center to $B$, and keeps the radius $${r}$.`,
                  `平移把圆心移到 $B$，并使半径保持为 $${r}$。`,
                ),
              },
              {
                text: t(`… a circle with center $B$ and radius $${r + s}$.`, `……圆心为 $B$、半径为 $${r + s}$ 的圆。`),
                why: t("A translation adds nothing to the radius: it keeps distances.", "平移不会给半径加上什么：它保持距离不变。"),
              },
            ],
          },
          {
            s: t(
              `Dilating that circle about $B$ with scale factor $${k}$ moves each of its points to distance $${r} \\cdot ${k} = ${s}$ from $B$.`,
              `以 $B$ 为中心、比例因子 $${k}$ 对它作位似，它的每个点到 $B$ 的距离变为 $${r} \\cdot ${k} = ${s}$。`,
            ),
            r: proofReasons.dilation,
            purpose: t(
              `It keeps the center $B$ and changes the radius from $${r}$ to $${s}$.`,
              `它使圆心 $B$ 不动，把半径从 $${r}$ 变为 $${s}$。`,
            ),
            alts: [
              {
                text: t(`… moves each of its points to distance $${r}$ from $B$.`, `……每个点到 $B$ 的距离仍为 $${r}$。`),
                why: t(
                  `$${r}$ is the distance before the dilation, which multiplies it by $${k}$.`,
                  `$${r}$ 是位似之前的距离，位似要把它乘以 $${k}$。`,
                ),
              },
              {
                text: t(`… moves each of its points to distance $${r} + ${k}$ from $B$.`, `……每个点到 $B$ 的距离变为 $${r} + ${k}$。`),
                why: t(
                  "A dilation multiplies distances by the scale factor; it does not add it.",
                  "位似把距离乘以比例因子，而不是加上它。",
                ),
              },
              {
                text: t(
                  `… moves each of its points to distance $${q(r * r, s).toLatex()}$ from $B$.`,
                  `……每个点到 $B$ 的距离变为 $${q(r * r, s).toLatex()}$。`,
                ),
                why: t(
                  `That divides $${r}$ by the scale factor instead of multiplying: $${r} \\cdot ${k} = ${s}$.`,
                  `这是用 $${r}$ 除以比例因子，而不是乘以它：$${r} \\cdot ${k} = ${s}$。`,
                ),
              },
            ],
          },
          {
            s: t(
              `The image is the set of all points at distance $${s}$ from $B$, which is circle $B$.`,
              `像是到 $B$ 距离为 $${s}$ 的所有点，也就是圆 $B$。`,
            ),
            r: proofReasons.circle,
            purpose: t(
              `It recognizes the image: the points at distance $${s}$ from $B$ make up circle $B$.`,
              `它认出这个像：到 $B$ 距离为 $${s}$ 的点组成的正是圆 $B$。`,
            ),
            alts: [],
          },
          {
            s: t("Circle $A$ is similar to circle $B$.", "圆 $A$ 与圆 $B$ 相似。"),
            r: proofReasons.similarity,
            purpose: t(
              "It draws the conclusion: the two moves together are a similarity transformation that maps circle $A$ onto circle $B$.",
              "它得出结论：两次变换合起来是一个把圆 $A$ 变为圆 $B$ 的相似变换。",
            ),
            alts: [],
          },
        ];
        const i = rng.int(0, 3);
        const step = proof[i]!;
        const askStatement = step.alts.length > 0 && rng.bool(0.4);
        const pool = Object.values(proofReasons).filter((x) => x !== step.r);
        const options = askStatement ? [step.s, ...step.alts.map((alt) => alt.text)] : [step.r, ...rng.sample(pool, 3)];
        const shuffled = rng.shuffle(options);
        const line = (lang: "en" | "zh-CN", p: ProofStep, j: number) =>
          `${j + 1}. ${askStatement && j === i ? "**?**" : p.s[lang]} —— ${!askStatement && j === i ? "**?**" : p.r[lang]}`;
        const list = (lang: "en" | "zh-CN") => proof.map((p, j) => line(lang, p, j)).join("\n");
        const reasons = askStatement
          ? step.alts.map((alt) => [alt.text.en, alt.why.en, alt.why["zh-CN"]] as const)
          : (Object.keys(proofReasons) as (keyof typeof proofReasons)[]).map(
              (key) => [proofReasons[key].en, reasonWhy[key].en, reasonWhy[key]["zh-CN"]] as const,
            );
        const answer = askStatement ? step.s : step.r;
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `**Given:** circle $A$ with center $A$ and radius $${r}$, circle $B$ with center $B$ and radius $${s}$.\n\n**Prove:** circle $A$ is similar to circle $B$.\n\n${list("en")}\n\n${askStatement ? `Which statement belongs in step ${i + 1}?` : `Which reason justifies step ${i + 1}?`}`,
                `**已知：** 圆 $A$ 圆心为 $A$、半径为 $${r}$，圆 $B$ 圆心为 $B$、半径为 $${s}$。\n\n**求证：** 圆 $A$ 与圆 $B$ 相似。\n\n${list("zh-CN")}\n\n${askStatement ? `第 ${i + 1} 步应填哪个结论？` : `第 ${i + 1} 步的理由是什么？`}`,
              ),
              options: shuffled,
              correct: shuffled.indexOf(options[0]!),
              solution: t(
                `**Step 1: what step ${i + 1} does.** ${step.purpose.en}

**Step 2: the ${askStatement ? "statement" : "reason"}.** ${askStatement ? `Step ${i + 1} says: ${answer.en} Its reason is: ${step.r.en}.` : `The reason is: ${answer.en}. It justifies the statement of step ${i + 1}: ${step.s.en}`}

**Check.** Follow the radius through the proof: $${r}$ for circle $A$, still $${r}$ after the translation, $${r} \\cdot ${k} = ${s}$ after the dilation, and $${s}$ is the radius of circle $B$, with the center at $B$ after both moves.

{{figure 0}}`,
                `**第一步：第 ${i + 1} 步做什么。** ${step.purpose["zh-CN"]}

**第二步：${askStatement ? "结论" : "理由"}。** ${askStatement ? `第 ${i + 1} 步是：${answer["zh-CN"]}它的理由是：${step.r["zh-CN"]}。` : `理由是：${answer["zh-CN"]}。它说明了第 ${i + 1} 步的结论：${step.s["zh-CN"]}`}

**检验。** 在证明中跟踪半径：圆 $A$ 的半径是 $${r}$，平移后仍是 $${r}$，位似后是 $${r} \\cdot ${k} = ${s}$，而 $${s}$ 正是圆 $B$ 的半径；两次变换后圆心都在 $B$。

{{figure 0}}`,
              ),
            }),
            solutionFigures: [proofFigure(r, s)],
          },
          reasons,
        );
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
