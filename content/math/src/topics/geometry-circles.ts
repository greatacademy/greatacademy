import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  dec,
  linear,
  type Mark,
  type Point,
  poly,
  Q,
  q,
  radical,
  sketch,
  type Tone,
} from "@ga/subject-math";
import { partsDrawings } from "../explanation-drawings-circles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { choiceProblem, expressionProblem, numberProblem, radicalProblem, steps, unitLatex, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** unitWord names a unit after the word "in", where "in in" would be unreadable. */
const unitWord = (u: Unit) => (u === "in" ? "inches" : u);

/** tex writes a quantity with a unit in LaTeX: "8\text{ cm}", "24\text{ cm}^2". */
const tex = (v: number | string, u: Unit, power = 1) => `${v}\\text{ ${u}}${power === 2 ? "^2" : ""}`;

/** len writes a length for a figure: "8 cm". */
const len = (v: number | string, u: Unit) => `${v} ${u}`;

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** arcTex names an arc in LaTeX: arcTex("AB") is the arc AB with an arc above it. */
const arcTex = (name: string) => `\\overset{\\frown}{${name}}`;

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** piTex writes c·π in LaTeX: "16\pi", "\pi", "\frac{25\pi}{2}", "\frac{\pi}{3}". */
export function piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** piSum writes a + c·π in LaTeX, in that order: "12 + 4\pi", "64 - 16\pi". */
export const piSum = (a: Coefficient, c: Coefficient) => poly([a, ""], [c, "\\pi"]);

/** piQ is 3.14 as an exact rational, the usual approximation of π. */
export const piQ = q(314, 100);

/** PI_EN asks for an exact answer in terms of π, in English. */
export const PI_EN = " Give the exact answer in terms of $\\pi$.";
/** PI_ZH asks for an exact answer in terms of π, in Chinese. */
export const PI_ZH = "结果保留 $\\pi$。";

/** PiProblem describes a problem whose answer is an exact expression in π. */
interface PiProblem {
  readonly prompt: Text;
  /** answer is the expected expression in LaTeX, fully simplified, such as "16\pi" or "64 - 16\pi". */
  readonly answer: string;
  readonly solution: Text;
  readonly wrong?: readonly string[];
  /** unit is shown after the field: "cm" or "cm^2". */
  readonly unit?: string;
}

/** piProblem builds a problem whose answer is a simplified expression in π, with an optional unit after the field. */
export function piProblem(p: PiProblem): Problem {
  const base = expressionProblem({ prompt: p.prompt, answer: p.answer, solution: p.solution, simplified: true, wrong: p.wrong ?? [] });
  return p.unit ? { ...base, answer: { ...base.answer, input: { kind: "math", suffix: unitLatex(p.unit) } } } : base;
}

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

const R = 5;
const O: Point = [0, 0];
const rad = (d: number) => (d * Math.PI) / 180;

/** on is the point at distance r from c in direction d degrees. */
const on = (d: number, r = R, c: Point = O): Point => [c[0] + r * Math.cos(rad(d)), c[1] + r * Math.sin(rad(d))];

const compassPoints: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** dirOf is the compass direction nearest to d degrees. */
const dirOf = (d: number): Compass => compassPoints[(((Math.round(d / 45) % 8) + 8) % 8) as 0]!;

/** arcPoints are points along the arc from angle a counterclockwise to angle b. */
export function arcPoints(a: number, b: number, r = R, c: Point = O): Point[] {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return Array.from({ length: n + 1 }, (_, i) => on(a + (span * i) / n, r, c));
}

/** circlePoints are points all around the circle of radius r about c. */
const circlePoints = (r = R, c: Point = O): Point[] => Array.from({ length: 96 }, (_, i) => on(i * 3.75, r, c));

/** circleAt draws a circle of radius r about c, in a tone when given. */
const circleAt = (r = R, c: Point = O, tone?: Tone): Mark => ({ kind: "polygon", points: circlePoints(r, c), ...(tone && { tone }) });

/** diskShade shades the disk of radius r about c, without the disk of radius hole when given. */
const diskShade = (r = R, tone?: Tone, hole?: number, c: Point = O): Mark => ({
  kind: "shade",
  points: circlePoints(r, c),
  ...(hole !== undefined && { holes: [circlePoints(hole, c)] }),
  ...(tone && { tone }),
});

/** sectorShade shades the sector of circle O from angle a counterclockwise to b. */
const sectorShade = (a: number, b: number, tone?: Tone): Mark => ({
  kind: "shade",
  points: [O, ...arcPoints(a, b)],
  ...(tone && { tone }),
});

/** arcIn draws the arc from angle a counterclockwise to b in a tone. */
function arcIn(a: number, b: number, tone: Tone, r = R, c: Point = O): Mark[] {
  const pts = arcPoints(a, b, r, c);
  return pts.slice(1).map((p, i): Mark => ({ kind: "segment", a: pts[i]!, b: p, tone }));
}

/** toned draws the segment ab in a tone, dashed when asked. */
const toned = (a: Point, b: Point, tone: Tone, dashed = false): Mark => ({ kind: "segment", a, b, tone, ...(dashed && { dashed: true }) });

/** near rounds x to one decimal place for an estimate: "28.3". */
const near = (x: number) => String(Math.round(x * 10) / 10);

/** piNear is c·π rounded to one decimal place. */
const piNear = (c: Coefficient) => near(toQ(c).toNumber() * Math.PI);

/** SectorLabels says what a drawing of a sector labels and colors. */
interface SectorLabels {
  readonly angle?: string;
  readonly radius?: string;
  readonly arc?: string;
  /** shade is the tone of the shaded sector; "none" leaves it unshaded. */
  readonly shade?: Tone | "accent" | "none";
  /** arcTone draws the arc in a tone. */
  readonly arcTone?: Tone;
}

/** sectorMarks draws circle O with the sector AOB of theta degrees from s, of any size, shaded and labeled as asked. */
function sectorMarks(s: number, theta: number, l: SectorLabels): Mark[] {
  const [a, b] = [on(s), on(s + theta)];
  const mid = s + theta / 2;
  const angle: Mark[] = !l.angle
    ? []
    : theta < 180
      ? [angleAt(O, a, b, l.angle)]
      : [{ kind: "label", at: on(mid, R * 0.35), text: l.angle, dir: dirOf(mid) }];
  return [
    circleAt(),
    ...(l.shade === "none" ? [] : [sectorShade(s, s + theta, l.shade === "accent" ? undefined : l.shade)]),
    ...(l.arcTone ? arcIn(s, s + theta, l.arcTone) : []),
    seg(O, a),
    seg(O, b),
    ...center("O", dirOf(mid + 180)),
    ...angle,
    ...(l.radius ? [{ kind: "side", a: O, b: a, text: l.radius } as const] : []),
    ...(l.arc ? [arcText(s, s + theta, l.arc)] : []),
    ...pointsAt([
      [s, "A"],
      [s + theta, "B"],
    ]),
  ];
}

/** arcAt highlights the arc from angle a counterclockwise to angle b. */
function arcAt(a: number, b: number, r = R, c: Point = O): Mark[] {
  const pts = arcPoints(a, b, r, c);
  return pts.slice(1).map((p, i): Mark => ({ kind: "segment", a: pts[i]!, b: p, accent: true }));
}

/** arcText labels the arc from a counterclockwise to b at its middle, outside the circle. */
function arcText(a: number, b: number, text: string): Mark {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const mid = a + span / 2;
  return { kind: "label", at: on(mid), text, dir: dirOf(mid) };
}

/** pointsAt marks points of the circle with dots and names, outside the circle. */
function pointsAt(list: readonly (readonly [number, string])[]): Mark[] {
  return list.flatMap(([d, text]): Mark[] => [
    { kind: "dot", at: on(d) },
    { kind: "label", at: on(d), text, dir: dirOf(d), italic: true },
  ]);
}

/** center marks the center O. */
const center = (name = "O", dir: Compass = "s"): Mark[] => [
  { kind: "dot", at: O },
  { kind: "label", at: O, text: name, dir, italic: true },
];

const seg = (a: Point, b: Point, accent = false): Mark => ({ kind: "segment", a, b, ...(accent && { accent: true }) });

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

/** centralAngle marks the central angle of span degrees from direction a: with an arc when it is less than 180°, by its label alone when it is reflex. */
function centralAngle(a: number, span: number, label: string, tone?: Tone): Mark {
  return span < 180
    ? angleAt(O, on(a), on(a + span), label, tone)
    : { kind: "label", at: on(a + span / 2, R * 0.35), text: label, dir: dirOf(a + span / 2) };
}

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = (c: number, d: number) => `(${linear(c, d)})^\\circ`;

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°". */
const angleLabel = (c: number, d: number) => `(${plain(c, d)})°`;

/** expressionsFor writes an angle a as c·x + d for a given x, with c from 1 to 6. */
function expressionFor(rng: Rng, a: number, x: number, avoid: readonly number[] = []): [number, number] {
  const cs = [1, 2, 3, 4, 5, 6].filter((c) => !avoid.includes(c));
  const c = rng.pick(cs);
  return [c, a - c * x];
}

// ---------------------------------------------------------------------------
// Circle essentials
// ---------------------------------------------------------------------------

/** measuredCircle draws a circle with a highlighted radius or diameter labeled text, starting at angle s. */
function measuredCircle(text: string, diameter: boolean, s: number): Mark[] {
  const [a, b] = diameter ? [on(s + 180), on(s)] : [O, on(s)];
  return [circleAt(), { kind: "dot", at: O }, seg(a, b, true), { kind: "side", a, b, text }];
}

/** twoRadii draws the diameter through O in direction s as two radii, each labeled half and the second in a tone, with the whole diameter labeled whole on the other side. */
function twoRadii(s: number, half: string, whole: string, tone: Tone | "accent"): Mark[] {
  const [a, b] = [on(s + 180), on(s)];
  return [
    circleAt(),
    ...center("O", dirOf(s - 90)),
    seg(O, b, true),
    tone === "accent" ? seg(a, O, true) : toned(a, O, tone),
    { kind: "side", a: O, b, text: half },
    { kind: "side", a, b: O, text: half },
    { kind: "side", a: b, b: a, text: whole },
  ];
}

export const circles: TopicDef = {
  id: "circles",
  title: t("Circles", "圆"),
  summary: t(
    "Name the parts of a circle, relate its radius and diameter, and tell whether a point lies inside, on or outside it.",
    "认识圆的各部分，理解半径与直径的关系，并判断点在圆内、圆上还是圆外。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.CO.A.1"],
  intro: t(
    `A goat is tied to a post $P$ with a rope $3$ m long. With the rope pulled tight, it can walk all the way around the post, and every spot where it stands is exactly $3$ m from $P$. Those spots make a **circle**: all the points of a plane at one fixed distance from one fixed point.

{{figure 0}}

The fixed point $P$ is the **center**, and the rope, pulled tight in any direction, is a **radius**: every radius of this circle is $3$ m. Walk from one side of the circle straight through the post to the other side and you cross the circle along a **diameter**: one rope length to the post, one more beyond it, $3 + 3 = 6$ m. In this lesson we name these parts and the chords, relate the radius and the diameter, and decide whether a point lies inside the circle, on it or outside it by comparing its distance from the center with the radius.`,
    `一只羊用 $3$ 米长的绳子拴在木桩 $P$ 上。把绳子拉直，它可以绕木桩走一整圈，它站过的每一个位置到 $P$ 的距离都正好是 $3$ 米。这些位置组成一个**圆**：平面内到一个定点的距离等于定长的所有点。

{{figure 0}}

定点 $P$ 是**圆心**，朝任意方向拉直的绳子都是一条**半径**：这个圆的每条半径都是 $3$ 米。从圆的一边经过木桩一直走到另一边，就沿一条**直径**穿过了圆：到木桩一根绳长，过了木桩再一根绳长，共 $3 + 3 = 6$ 米。这节课我们认识这些部分以及弦，理解半径与直径的关系，并通过比较点到圆心的距离与半径，判断点在圆内、圆上还是圆外。`,
  ),
  introFigures: [
    figure(
      [
        circleAt(),
        { kind: "dot", at: O },
        { kind: "label", at: O, text: "P", dir: "s", italic: true },
        seg(O, on(60), true),
        { kind: "side", a: O, b: on(60), text: "3 m" },
        seg(O, on(140), true),
        { kind: "side", a: on(140), b: O, text: "3 m" },
        toned(on(200), on(20), "result", true),
        { kind: "side", a: on(20), b: on(200), text: "6 m" },
      ],
      "A circle with center P; two radii of 3 m and a dashed diameter of 6 m through P.",
      "圆心为 P 的圆；两条 3 m 的半径，以及一条经过 P、长 6 m 的直径（虚线）。",
    ),
  ],
  knowledgePoints: [
    {
      id: "radius-and-diameter",
      figure: partsDrawings["radius-and-diameter"],
      title: t("Radius and diameter", "半径与直径"),
      explanation: t(
        `A **circle** is the set of all points in a plane at the same distance from a fixed point, its **center**. A circle with center $O$ is called circle $O$.

- A **radius** is a segment from the center to a point on the circle. All radii of a circle have the same length, also called the radius $r$.
- A **diameter** is a segment through the center whose endpoints are on the circle.

Why is a diameter twice a radius? Its middle point is the center $O$, so it is made of two pieces, each from $O$ to the circle: two radii laid end to end. So

$$d = 2r, \\qquad r = \\frac{d}{2}.$$

A circle with radius $8$ cm has diameter $2 \\cdot 8 = 16$ cm. A circle with diameter $26$ m has radius $\\frac{26}{2} = 13$ m, and a diameter of $9$ m gives a radius of $4.5$ m.

> **Watch out.** The diameter is the longer one. Going from a radius to a diameter, double; going from a diameter to a radius, halve. Halving a radius, or doubling a diameter, gives a length that no segment of the circle has, and squaring the radius gives an area, not a length.`,
        `**圆**是平面内到一个定点距离相等的所有点组成的图形，这个定点叫**圆心**。圆心为 $O$ 的圆叫圆 $O$。

- **半径**是连接圆心和圆上一点的线段。同一个圆的所有半径长度相等，这个长度也叫半径 $r$。
- **直径**是经过圆心、两端都在圆上的线段。

为什么直径是半径的两倍？直径的中点就是圆心 $O$，所以它分成两段，每段都从 $O$ 到圆上：是两条首尾相接的半径。所以

$$d = 2r, \\qquad r = \\frac{d}{2}.$$

半径为 $8$ 厘米的圆，直径是 $2 \\cdot 8 = 16$ 厘米。直径为 $26$ 米的圆，半径是 $\\frac{26}{2} = 13$ 米；直径为 $9$ 米时，半径是 $4.5$ 米。

> **注意。** 直径比半径长。由半径求直径要乘以 $2$，由直径求半径要除以 $2$。把半径除以 $2$ 或把直径乘以 $2$，得到的长度圆中没有哪条线段具有；把半径平方得到的是面积，不是长度。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(0, 359);
        if (rng.bool()) {
          const r = rng.int(2, 40);
          return {
            ...numberProblem({
              prompt: t(
                "The highlighted segment is a radius of the circle. What is the diameter?",
                "图中突出显示的线段是圆的半径。直径是多少？",
              ),
              answer: 2 * r,
              unit: u,
              wrong: [r, q(r, 2), r * r],
              solution: t(
                `**Step 1: see the diameter as two radii.** A diameter passes through the center $O$, so it is made of two pieces from $O$ to the circle. Each piece is a radius, and every radius of this circle is $${tex(r, u)}$:

{{figure 0}}

**Step 2: add the two radii.**${steps(`d = 2r = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}**Check.** Halving the diameter gives back the radius: $\\frac{${2 * r}}{2} = ${r}$. And the diameter, the longest segment across the circle, is longer than the radius, as $${2 * r} > ${r}$.`,
                `**第一步：把直径看成两条半径。** 直径经过圆心 $O$，所以它分成两段，每段都从 $O$ 到圆上。每一段都是半径，而这个圆的每条半径都是 $${tex(r, u)}$：

{{figure 0}}

**第二步：两条半径相加。**${steps(`d = 2r = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}**检验。** 把直径除以 $2$ 又得到半径：$\\frac{${2 * r}}{2} = ${r}$。直径是横穿圆的最长线段，应比半径长，$${2 * r} > ${r}$ 确实如此。`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
            solutionFigures: [
              figure(
                twoRadii(s, len(r, u), len(2 * r, u), "result"),
                `The diameter through O is two radii of ${r} ${u}: ${2 * r} ${u} in all.`,
                `经过 O 的直径由两条 ${r} ${u} 的半径组成，共 ${2 * r} ${u}。`,
              ),
            ],
          };
        }
        const d = rng.int(3, 60);
        const half = q(d, 2);
        const halfText = d % 2 === 0 ? half.toLatex() : `${half.toLatex()} = ${dec(half)}`;
        return {
          ...numberProblem({
            prompt: t(
              "The highlighted segment is a diameter of the circle. What is the radius?",
              "图中突出显示的线段是圆的直径。半径是多少？",
            ),
            answer: half,
            unit: u,
            wrong: [d, 2 * d, d - 2],
            solution: t(
              `**Step 1: find the radii inside the diameter.** The diameter passes through the center $O$, which is its midpoint. The two halves each run from $O$ to the circle, so each half is a radius:

{{figure 0}}

**Step 2: halve the diameter.**${steps(`r = \\frac{d}{2} = \\frac{${d}}{2} = ${halfText}`)}The radius is $${tex(dec(half), u)}$.

**Check.** Two radii laid end to end make the diameter again: $2 \\cdot ${dec(half)} = ${d}$. And the radius is shorter than the diameter, as it must be.`,
              `**第一步：找出直径中的半径。** 直径经过圆心 $O$，$O$ 是它的中点。两半都从 $O$ 到圆上，所以每一半都是半径：

{{figure 0}}

**第二步：把直径除以 $2$。**${steps(`r = \\frac{d}{2} = \\frac{${d}}{2} = ${halfText}`)}半径是 $${tex(dec(half), u)}$。

**检验。** 两条半径首尾相接又组成直径：$2 \\cdot ${dec(half)} = ${d}$。半径比直径短，符合要求。`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
          solutionFigures: [
            figure(
              twoRadii(s, len(dec(half), u), len(d, u), "accent"),
              `The diameter of ${d} ${u} is cut by the center O into two radii of ${dec(half)} ${u}.`,
              `直径 ${d} ${u} 被圆心 O 分成两条 ${dec(half)} ${u} 的半径。`,
            ),
          ],
        };
      },
    },
    {
      id: "parts-of-a-circle",
      figure: partsDrawings["parts-of-a-circle"],
      title: t("Radii, diameters and chords", "半径、直径与弦"),
      explanation: t(
        `A **chord** is a segment whose endpoints are both on the circle. A diameter is a chord that passes through the center; it is the longest chord of the circle, and chords farther from the center are shorter.

To name a segment drawn in a circle, ask two questions in turn. Where are its ends? Does it pass through the center?

- One end at the center, the other on the circle: a **radius**.
- Both ends on the circle, through the center: a **diameter**.
- Both ends on the circle, not through the center: a **chord** (but not a diameter).

For example, a segment from one point of the circle to another that misses the center by a little is a chord, a bit shorter than the diameter; move it until it passes through the center and it becomes a diameter.

> **Watch out.** Look at both ends before naming. A segment with one end at the center is a radius, not a chord: a chord needs both ends on the circle. And a chord through the center has its own name, the diameter.`,
        `**弦**是两个端点都在圆上的线段。直径是经过圆心的弦，是圆中最长的弦，离圆心越远的弦越短。

给圆中的一条线段命名，依次问两个问题：它的两端在哪里？它经过圆心吗？

- 一端在圆心、另一端在圆上：**半径**。
- 两端都在圆上，并且经过圆心：**直径**。
- 两端都在圆上，但不经过圆心：**弦**（不是直径）。

例如，从圆上一点到另一点、离圆心稍有偏差的线段是弦，比直径短一点；把它平移到经过圆心，它就成了直径。

> **注意。** 命名之前两端都要看。有一端在圆心的线段是半径，不是弦：弦要求两端都在圆上。经过圆心的弦有专门的名称，叫直径。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.int(0, 359);
        const [pa, pb] =
          kind === 0 ? [O, on(a)] : kind === 1 ? [on(a), on(a + 180)] : [on(a), on(a + rng.pick([rng.int(40, 150), rng.int(210, 320)]))];
        const options = [t("A radius", "半径"), t("A diameter", "直径"), t("A chord that is not a diameter", "不是直径的弦")];
        const ends =
          kind === 0
            ? t("One end of the segment is the center $O$, and the other end is on the circle.", "这条线段一端是圆心 $O$，另一端在圆上。")
            : t("Both ends of the segment are on the circle.", "这条线段的两端都在圆上。");
        const through = [
          t("It runs from the center out to the circle, as a radius does.", "它从圆心连到圆上一点，半径正是这样。"),
          t("It passes through the center $O$, and a chord through the center is a diameter.", "它经过圆心 $O$，而过圆心的弦就是直径。"),
          t(
            "It does not pass through the center $O$, so it is a chord but cannot be a diameter.",
            "它不经过圆心 $O$，所以它是弦，但不可能是直径。",
          ),
        ][kind]!;
        const check = [
          t(
            "The dashed diameter has one end where the segment meets the circle. The highlighted segment is exactly half of it, from $O$ to the circle, as a radius is.",
            "虚线是经过这条线段在圆上那一端的直径。突出显示的线段正好是它的一半，从 $O$ 到圆上，半径正是这样。",
          ),
          t(
            "The dashed diameter through one end of the segment lies right along it: the highlighted segment is that diameter, the longest chord.",
            "经过线段一端的虚线直径与它完全重合：突出显示的线段就是这条直径，也是最长的弦。",
          ),
          t(
            "The dashed diameter starts at the same end, and the highlighted chord is shorter than it, as every chord that misses the center is.",
            "虚线直径与它有同一个端点，而突出显示的弦比它短，不过圆心的弦都是这样。",
          ),
        ][kind]!;
        const marks = (extra: readonly Mark[]): Mark[] => [
          circleAt(),
          ...center(),
          ...extra,
          seg(pa, pb, true),
          { kind: "dot", at: pa },
          { kind: "dot", at: pb },
        ];
        return reasoned(
          {
            ...choiceProblem({
              prompt: t("What is the highlighted segment in circle $O$?", "圆 $O$ 中突出显示的线段是什么？"),
              options,
              correct: kind,
              solution: t(
                `**Step 1: the ends.** ${ends.en}

**Step 2: the center.** ${through.en} So it is ${options[kind]!.en.toLowerCase()}.

{{figure 0}}

**Check.** ${check.en}`,
                `**第一步：看两端。** ${ends["zh-CN"]}

**第二步：看圆心。** ${through["zh-CN"]}所以它是${options[kind]!["zh-CN"]}。

{{figure 0}}

**检验。** ${check["zh-CN"]}`,
              ),
            }),
            figure: figure(marks([]), "Circle O with one highlighted segment.", "圆 O，其中一条线段被突出显示。"),
            solutionFigures: [
              figure(
                marks([toned(on(a), on(a + 180), "action", true)]),
                "Circle O with the highlighted segment and, dashed, the diameter through one of its ends on the circle.",
                "圆 O 中突出显示的线段，以及经过它在圆上一端的直径（虚线）。",
              ),
            ],
          },
          [
            [
              "A radius",
              "A radius has one end at the center, and this segment has both ends on the circle.",
              "半径有一端在圆心，而这条线段两端都在圆上。",
            ],
            [
              "A diameter",
              kind === 0
                ? "A diameter has both ends on the circle, and one end of this segment is the center."
                : "A diameter passes through the center, and this segment does not.",
              kind === 0 ? "直径两端都在圆上，而这条线段有一端是圆心。" : "直径过圆心，而这条线段不过圆心。",
            ],
            [
              options[2]!.en,
              kind === 0
                ? "A chord has both ends on the circle, and one end of this segment is the center."
                : "It does join two points of the circle, but it passes through the center, and that has its own name.",
              kind === 0 ? "弦两端都在圆上，而这条线段有一端是圆心。" : "它确实连接圆上两点，但它过圆心，这样的线段有专门的名称。",
            ],
          ],
        );
      },
    },
    {
      id: "inside-on-or-outside",
      figure: partsDrawings["circles#inside-on-or-outside"],
      title: t("Inside, on or outside", "圆内、圆上与圆外"),
      explanation: t(
        `Every point of the circle is exactly the radius $r$ away from the center $O$. So the distance $OP$ from a point $P$ to the center tells where $P$ is:

- if $OP < r$, then $P$ is **inside** the circle (in its interior);
- if $OP = r$, then $P$ is **on** the circle;
- if $OP > r$, then $P$ is **outside** the circle (in its exterior).

Picture walking from $O$ toward $P$: you cross the circle after exactly $r$. If $P$ comes before that, it is inside; if after, outside.

When the diameter is given, halve it first. A circle with diameter $16$ cm has radius $8$ cm, so a point $10$ cm from the center is outside it, since $10 > 8$, even though $10 < 16$.

> **Watch out.** Compare the distance with the radius, not the diameter. The diameter goes across the whole circle, so a point closer to $O$ than the diameter can still be outside.`,
        `圆上每一点到圆心 $O$ 的距离都正好是半径 $r$。所以点 $P$ 到圆心的距离 $OP$ 决定了 $P$ 的位置：

- 若 $OP < r$，则 $P$ 在圆**内**；
- 若 $OP = r$，则 $P$ 在圆**上**；
- 若 $OP > r$，则 $P$ 在圆**外**。

想象从 $O$ 向 $P$ 走：走了正好 $r$ 时穿过圆。若在此之前就到了 $P$，$P$ 在圆内；若在此之后，$P$ 在圆外。

若给出的是直径，先除以 $2$。直径为 $16$ 厘米的圆半径是 $8$ 厘米，所以到圆心 $10$ 厘米的点在圆外，因为 $10 > 8$，尽管 $10 < 16$。

> **注意。** 要把距离和半径比较，不要和直径比较。直径横跨整个圆，所以到 $O$ 的距离比直径小的点仍可能在圆外。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(3, 25);
        const kind = rng.int(0, 2);
        const useDiameter = rng.bool();
        const dist = kind === 0 ? rng.int(1, r - 1) : kind === 1 ? r : useDiameter ? rng.int(r + 1, 2 * r - 1) : rng.int(r + 1, 2 * r + 5);
        const options = [t("Inside the circle", "在圆内"), t("On the circle", "在圆上"), t("Outside the circle", "在圆外")];
        const rels = ["<", "=", ">"] as const;
        const rel = rels[kind]!;
        const given = useDiameter
          ? t(`a diameter of $${tex(2 * r, u)}$`, `直径为 $${tex(2 * r, u)}$`)
          : t(`a radius of $${tex(r, u)}$`, `半径为 $${tex(r, u)}$`);
        const radiusStep = useDiameter
          ? t(`The radius is half the diameter: $r = \\frac{${2 * r}}{2} = ${r}$.`, `半径是直径的一半：$r = \\frac{${2 * r}}{2} = ${r}$。`)
          : t(`The radius is given: $r = ${r}$.`, `已知半径：$r = ${r}$。`);
        const dir = rng.int(0, 359);
        const p = on(dir, (R * dist) / r);
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `Circle $O$ has ${given.en}. Point $P$ is $${tex(dist, u)}$ from $O$. Where is $P$?`,
                `圆 $O$ 的${given["zh-CN"]}。点 $P$ 到 $O$ 的距离是 $${tex(dist, u)}$。点 $P$ 在哪里？`,
              ),
              options,
              correct: kind,
              solution: t(
                `**Step 1: the radius.** ${radiusStep.en} Every point of the circle is $${r}$ from $O$.

**Step 2: compare the distance with the radius.**${steps(`OP = ${dist} ${rel} ${r} = r`)}So point $P$ is ${options[kind]!.en.toLowerCase()}:

{{figure 0}}

**Check.** Compare doubled lengths with the diameter instead: $2 \\cdot OP = ${2 * dist}$ and $d = ${2 * r}$, and $${2 * dist} ${rel} ${2 * r}$ gives the same answer.`,
                `**第一步：求半径。** ${radiusStep["zh-CN"]}圆上每一点到 $O$ 的距离都是 $${r}$。

**第二步：比较距离与半径。**${steps(`OP = ${dist} ${rel} ${r} = r`)}所以点 $P$ ${options[kind]!["zh-CN"]}：

{{figure 0}}

**检验。** 改为把距离的两倍与直径比较：$2 \\cdot OP = ${2 * dist}$，$d = ${2 * r}$，$${2 * dist} ${rel} ${2 * r}$，结论相同。`,
              ),
            }),
            solutionFigures: [
              figure(
                [
                  circleAt(),
                  ...center("O", dirOf(dir + 180)),
                  toned(O, on(dir + 120), "action", true),
                  { kind: "side", a: O, b: on(dir + 120), text: len(r, u) },
                  toned(O, p, "result"),
                  { kind: "side", a: p, b: O, text: len(dist, u) },
                  { kind: "dot", at: p, tone: "result" },
                  { kind: "label", at: p, text: "P", dir: dirOf(dir), italic: true },
                ],
                `Circle O with radius ${r} ${u}, dashed, and point P at ${dist} ${u} from O, ${options[kind]!.en.toLowerCase()}.`,
                `圆 O 的半径 ${r} ${u}（虚线），点 P 到 O 的距离为 ${dist} ${u}，${options[kind]!["zh-CN"]}。`,
              ),
            ],
          },
          options.map((o, i): [string, string, string] => [
            o.en,
            `That needs $OP ${rels[i]} r$, but $OP = ${dist}$ and $r = ${r}$.`,
            `这要求 $OP ${rels[i]} r$，但 $OP = ${dist}$，$r = ${r}$。`,
          ]),
        );
      },
    },
  ],
};

export const arcsSegmentsAndSectorsOfCircles: TopicDef = {
  id: "arcs-segments-and-sectors-of-circles",
  title: t("Arcs, Segments, and Sectors of Circles", "圆弧、弓形与扇形"),
  summary: t(
    "Tell minor arcs, major arcs and semicircles apart, relate their measures, and name sectors and segments.",
    "区分劣弧、优弧与半圆，理解它们度数之间的关系，并认识扇形与弓形。",
  ),
  prerequisites: ["circles", "angles-and-angle-measures"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.CO.A.1"],
  intro: t(
    `The rim of a clock face is a circle, and the hand turning once around it sweeps the full $360^\\circ$. The twelve numbers split the turn into $12$ equal steps of $\\frac{360^\\circ}{12} = 30^\\circ$.

The marks at $12$ and at $4$ cut the rim into two pieces, two **arcs**. Going clockwise from $12$ to $4$ takes four steps, $4 \\cdot 30^\\circ = 120^\\circ$; going on from $4$ round to $12$ takes the other eight, $8 \\cdot 30^\\circ = 240^\\circ$:

{{figure 0}}

The two arcs share their endpoints and together make the whole rim: $120^\\circ + 240^\\circ = 360^\\circ$. The short one is less than half the circle, the long one more. In this lesson we name such arcs, find one from the other, and name the regions an arc cuts off together with two radii or with a chord.`,
    `钟面的边缘是一个圆，指针转一整圈扫过整整 $360^\\circ$。十二个数字把一圈分成 $12$ 个相等的格，每格 $\\frac{360^\\circ}{12} = 30^\\circ$。

$12$ 和 $4$ 两处的刻度把边缘分成两段，也就是两段**弧**。从 $12$ 顺时针走到 $4$ 经过四格，$4 \\cdot 30^\\circ = 120^\\circ$；从 $4$ 继续走回 $12$ 经过另外八格，$8 \\cdot 30^\\circ = 240^\\circ$：

{{figure 0}}

两段弧端点相同，合起来是整个边缘：$120^\\circ + 240^\\circ = 360^\\circ$。短的一段不到半个圆，长的一段超过半个圆。这节课我们给这样的弧命名，由一段弧求另一段弧，并认识弧与两条半径或与一条弦围成的区域。`,
  ),
  introFigures: [
    figure(
      [
        circleAt(),
        { kind: "dot", at: O },
        ...arcAt(-30, 90),
        ...arcIn(90, 330, "result"),
        arcText(-30, 90, "120°"),
        arcText(90, 330, "240°"),
        ...pointsAt([
          [90, "12"],
          [-30, "4"],
        ]),
      ],
      "A clock face as a circle: the marks at 12 and 4 cut it into an arc of 120° and an arc of 240°.",
      "把钟面看作圆：12 和 4 两处的刻度把它分成 120° 和 240° 两段弧。",
    ),
  ],
  knowledgePoints: [
    {
      id: "classifying-arcs",
      figure: partsDrawings["classifying-arcs"],
      title: t("Minor arcs, major arcs and semicircles", "劣弧、优弧与半圆"),
      explanation: t(
        `Two points $A$ and $B$ on a circle split it into two **arcs**. A whole circle measures $360^\\circ$, so the two arcs share $360^\\circ$ between them.

- If $AB$ is a diameter, the two arcs are equal: each is a **semicircle**, measuring $180^\\circ$.
- Otherwise one arc is smaller: the **minor arc**, less than $180^\\circ$. The other is the **major arc**, more than $180^\\circ$.

The chord $AB$ shows which is which. The minor arc lies on the side of the chord away from the center $O$; the major arc wraps around $O$. If $A$ and $B$ are $100^\\circ$ apart, the minor arc is $100^\\circ$ and the major arc is $360^\\circ - 100^\\circ = 260^\\circ$.

A minor arc is named by its endpoints, $${arcTex("AB")}$. A major arc or a semicircle is named with a third point on it, $${arcTex("AXB")}$, so that it is clear which of the two arcs is meant.

> **Watch out.** A three-letter name does not make an arc major: semicircles, and sometimes minor arcs, are named with three points too. Decide by where the arc lies: on the far side of the chord from $O$ it is minor, around $O$ it is major, and only when the chord passes through $O$ is it a semicircle.`,
        `圆上的两点 $A$、$B$ 把圆分成两段**弧**。整个圆是 $360^\\circ$，两段弧分享这 $360^\\circ$。

- 若 $AB$ 是直径，两段弧相等，都是**半圆**，度数为 $180^\\circ$。
- 否则有一段较小，叫**劣弧**，小于 $180^\\circ$；另一段叫**优弧**，大于 $180^\\circ$。

弦 $AB$ 能看出哪段是哪段：劣弧在弦的远离圆心 $O$ 的一侧，优弧绕过 $O$。若 $A$、$B$ 相隔 $100^\\circ$，则劣弧是 $100^\\circ$，优弧是 $360^\\circ - 100^\\circ = 260^\\circ$。

劣弧用两个端点命名，记作 $${arcTex("AB")}$。优弧或半圆要在弧上再取一点来命名，如 $${arcTex("AXB")}$，以表明指的是两段弧中的哪一段。

> **注意。** 用三个字母命名的弧不一定是优弧：半圆，有时劣弧，也用三个点命名。要看弧的位置：在弦的远离 $O$ 的一侧是劣弧，绕过 $O$ 是优弧，只有弦经过 $O$ 时才是半圆。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = kind === 0 ? rng.int(30, 150) : kind === 1 ? rng.int(210, 330) : 180;
        const s = rng.int(0, 359);
        const options = [t("A minor arc", "劣弧"), t("A major arc", "优弧"), t("A semicircle", "半圆")];
        const side = [
          t(
            "Chord $AB$ does not pass through the center $O$, and the arc lies on the side of the chord away from $O$.",
            "弦 $AB$ 不经过圆心 $O$，而这段弧在弦的远离 $O$ 的一侧。",
          ),
          t(
            "Chord $AB$ does not pass through the center $O$, and the arc lies on the same side of the chord as $O$, wrapping around it.",
            "弦 $AB$ 不经过圆心 $O$，而这段弧和 $O$ 在弦的同一侧，绕过了 $O$。",
          ),
          t("Chord $AB$ passes through the center $O$, so it is a diameter.", "弦 $AB$ 经过圆心 $O$，所以它是直径。"),
        ][kind]!;
        const size = [
          t("So the arc is the smaller of the two arcs, less than half the circle.", "所以这段弧是两段弧中较小的一段，不到半个圆。"),
          t("So the arc is the larger of the two arcs, more than half the circle.", "所以这段弧是两段弧中较大的一段，超过半个圆。"),
          t(
            "A diameter cuts the circle into two equal halves, so the arc is half the circle.",
            "直径把圆分成相等的两半，所以这段弧是半个圆。",
          ),
        ][kind]!;
        const check = [
          t(
            "Run along the arc from $A$ through $X$: it reaches $B$ before the point $A'$ opposite $A$, the other end of the diameter through $A$. An arc that stops short of the half way point is less than $180^\\circ$.",
            "从 $A$ 经过 $X$ 沿弧走：在到达 $A$ 的对径点 $A'$（过 $A$ 的直径的另一端）之前就到了 $B$。没走到一半就停下的弧小于 $180^\\circ$。",
          ),
          t(
            "Run along the arc from $A$ through $X$: it passes the point $A'$ opposite $A$, the other end of the diameter through $A$, before it reaches $B$. An arc that goes past the half way point is more than $180^\\circ$.",
            "从 $A$ 经过 $X$ 沿弧走：经过 $A$ 的对径点 $A'$（过 $A$ 的直径的另一端）之后才到 $B$。走过了一半的弧大于 $180^\\circ$。",
          ),
          t(
            "The diameter through $A$ ends exactly at $B$, so the arc from $A$ through $X$ to $B$ goes exactly half way around: $180^\\circ$.",
            "过 $A$ 的直径的另一端正好是 $B$，所以从 $A$ 经过 $X$ 到 $B$ 的弧正好绕了半圈：$180^\\circ$。",
          ),
        ][kind]!;
        const marks = (extra: readonly Mark[]): Mark[] => [
          circleAt(),
          ...center("O", dirOf(s + m / 2 + 180)),
          ...arcAt(s, s + m),
          { kind: "segment", a: on(s), b: on(s + m), dashed: true },
          ...extra,
          ...pointsAt([
            [s, "A"],
            [s + m, "B"],
            [s + m / 2, "X"],
          ]),
        ];
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `Is the highlighted arc $${arcTex("AXB")}$ of circle $O$ a minor arc, a major arc or a semicircle?`,
                `圆 $O$ 中突出显示的弧 $${arcTex("AXB")}$ 是劣弧、优弧还是半圆？`,
              ),
              options,
              correct: kind,
              solution: t(
                `**Step 1: the chord and the center.** ${side.en}

**Step 2: the size of the arc.** ${size.en} It is ${options[kind]!.en.toLowerCase()}.

{{figure 0}}

**Check.** ${check.en}`,
                `**第一步：看弦和圆心。** ${side["zh-CN"]}

**第二步：看弧的大小。** ${size["zh-CN"]}它是${options[kind]!["zh-CN"]}。

{{figure 0}}

**检验。** ${check["zh-CN"]}`,
              ),
            }),
            figure: figure(
              marks([]),
              "Circle O with points A, X and B on it; the arc AXB is highlighted and chord AB is dashed.",
              "圆 O 上有点 A、X、B；弧 AXB 被突出显示，弦 AB 用虚线画出。",
            ),
            solutionFigures: [
              figure(
                marks([toned(on(s), on(s + 180), "action", true), ...(kind === 2 ? [] : pointsAt([[s + 180, "A′"]]))]),
                "The arc AXB with chord AB and, dashed, the diameter from A to the opposite point A′.",
                "弧 AXB、弦 AB，以及从 A 到对径点 A′ 的直径（虚线）。",
              ),
            ],
          },
          [
            [
              options[0]!.en,
              `A minor arc is smaller than a semicircle, and this arc ${kind === 1 ? "is larger" : "is exactly half the circle"}.`,
              `劣弧比半圆小，而这条弧${kind === 1 ? "比半圆大" : "正好是半个圆"}。`,
            ],
            [
              options[1]!.en,
              `A major arc is larger than a semicircle, and this arc ${kind === 0 ? "is smaller" : "is exactly half the circle"}.`,
              `优弧比半圆大，而这条弧${kind === 0 ? "比半圆小" : "正好是半个圆"}。`,
            ],
            [
              options[2]!.en,
              "A semicircle has a diameter as its chord, and chord $AB$ does not pass through the center here.",
              "半圆所对的弦是直径，而这里弦 $AB$ 不过圆心。",
            ],
          ],
        );
      },
    },
    {
      id: "measures-of-arcs",
      figure: partsDrawings["measures-of-arcs"],
      title: t("Measures of minor and major arcs", "劣弧与优弧的度数"),
      explanation: t(
        `Between the same two points $A$ and $B$ there are two arcs, the minor arc $${arcTex("AB")}$ and the major arc $${arcTex("ACB")}$. Together they go once around the circle, with no gap and no overlap, so their measures add to the full turn:

$$m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ.$$

Knowing either one gives the other by subtracting from $360^\\circ$. If minor arc $${arcTex("AB")}$ measures $55^\\circ$, major arc $${arcTex("ACB")}$ measures $360^\\circ - 55^\\circ = 305^\\circ$; if a major arc measures $200^\\circ$, its minor arc measures $160^\\circ$.

> **Watch out.** Subtract from $360^\\circ$, the whole circle, not from $180^\\circ$, which is only half of it. And the major arc is not the minor arc plus $180^\\circ$: $55^\\circ + 180^\\circ = 235^\\circ$ leaves out part of the circle.`,
        `同两点 $A$、$B$ 之间有两段弧：劣弧 $${arcTex("AB")}$ 和优弧 $${arcTex("ACB")}$。它们合起来正好绕圆一周，不留空隙也不重叠，所以度数之和是一整圈：

$$m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ.$$

知道其中一段，用 $360^\\circ$ 减去它就得到另一段。若劣弧 $${arcTex("AB")}$ 是 $55^\\circ$，则优弧 $${arcTex("ACB")}$ 是 $360^\\circ - 55^\\circ = 305^\\circ$；若一段优弧是 $200^\\circ$，它的劣弧就是 $160^\\circ$。

> **注意。** 要用整个圆 $360^\\circ$ 去减，不是用半个圆 $180^\\circ$。优弧也不是劣弧加 $180^\\circ$：$55^\\circ + 180^\\circ = 235^\\circ$ 漏掉了圆的一部分。`,
      ),
      generate(rng) {
        const m = rng.int(20, 160);
        const M = 360 - m;
        const s = rng.int(0, 359);
        const askMajor = rng.bool();
        const marks: Mark[] = [
          circleAt(),
          { kind: "dot", at: O },
          ...(askMajor ? arcAt(s, s + m) : arcAt(s + m, s)),
          askMajor ? arcText(s, s + m, deg(m)) : arcText(s + m, s, deg(M)),
          ...pointsAt([
            [s, "A"],
            [s + m, "B"],
            [s + m + M / 2, "C"],
          ]),
        ];
        const both: Mark[] = [
          circleAt(),
          { kind: "dot", at: O },
          ...(askMajor ? arcAt(s, s + m) : arcIn(s, s + m, "result")),
          ...(askMajor ? arcIn(s + m, s, "result") : arcAt(s + m, s)),
          arcText(s, s + m, deg(m)),
          arcText(s + m, s, deg(M)),
          ...pointsAt([
            [s, "A"],
            [s + m, "B"],
            [s + m + M / 2, "C"],
          ]),
        ];
        const bothFig = figure(
          both,
          `Minor arc AB of ${m}° and major arc ACB of ${M}° make up the whole circle.`,
          `劣弧 AB（${m}°）与优弧 ACB（${M}°）合起来是整个圆。`,
        );
        if (askMajor) {
          return {
            ...numberProblem({
              prompt: t(
                `Minor arc $${arcTex("AB")}$ measures $${m}^\\circ$. Find the measure of major arc $${arcTex("ACB")}$.`,
                `劣弧 $${arcTex("AB")}$ 的度数是 $${m}^\\circ$。求优弧 $${arcTex("ACB")}$ 的度数。`,
              ),
              answer: M,
              unit: "°",
              wrong: [180 - m, m, 180 + m],
              solution: t(
                `**Step 1: the two arcs make the circle.** Minor arc $${arcTex("AB")}$ and major arc $${arcTex("ACB")}$ have the same endpoints and together go once around the circle:${steps(`m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ`)}**Step 2: subtract the known arc.**${steps(`m${arcTex("ACB")} = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}{{figure 0}}

**Check.** Adding the arcs gives the full turn: $${m}^\\circ + ${M}^\\circ = 360^\\circ$. And a major arc must be more than $180^\\circ$, as $${M}^\\circ$ is.`,
                `**第一步：两段弧组成整个圆。** 劣弧 $${arcTex("AB")}$ 与优弧 $${arcTex("ACB")}$ 端点相同，合起来正好绕圆一周：${steps(`m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ`)}**第二步：减去已知的弧。**${steps(`m${arcTex("ACB")} = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}{{figure 0}}

**检验。** 两段弧相加是一整圈：$${m}^\\circ + ${M}^\\circ = 360^\\circ$。优弧应大于 $180^\\circ$，$${M}^\\circ$ 确实如此。`,
              ),
            }),
            figure: figure(marks, `Circle with points A, B and C; minor arc AB is marked ${m}°.`, `圆上有点 A、B、C；劣弧 AB 标为 ${m}°。`),
            solutionFigures: [bothFig],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `Major arc $${arcTex("ACB")}$ measures $${M}^\\circ$. Find the measure of minor arc $${arcTex("AB")}$.`,
              `优弧 $${arcTex("ACB")}$ 的度数是 $${M}^\\circ$。求劣弧 $${arcTex("AB")}$ 的度数。`,
            ),
            answer: m,
            unit: "°",
            wrong: [M - 180, M, q(M, 2)],
            solution: t(
              `**Step 1: the two arcs make the circle.** Major arc $${arcTex("ACB")}$ and minor arc $${arcTex("AB")}$ have the same endpoints and together go once around the circle:${steps(`m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ`)}**Step 2: subtract the known arc.**${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${m}^\\circ`)}{{figure 0}}

**Check.** Adding the arcs gives the full turn: $${m}^\\circ + ${M}^\\circ = 360^\\circ$. And a minor arc must be less than $180^\\circ$, as $${m}^\\circ$ is.`,
              `**第一步：两段弧组成整个圆。** 优弧 $${arcTex("ACB")}$ 与劣弧 $${arcTex("AB")}$ 端点相同，合起来正好绕圆一周：${steps(`m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ`)}**第二步：减去已知的弧。**${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${m}^\\circ`)}{{figure 0}}

**检验。** 两段弧相加是一整圈：$${m}^\\circ + ${M}^\\circ = 360^\\circ$。劣弧应小于 $180^\\circ$，$${m}^\\circ$ 确实如此。`,
            ),
          }),
          figure: figure(marks, `Circle with points A, B and C; major arc ACB is marked ${M}°.`, `圆上有点 A、B、C；优弧 ACB 标为 ${M}°。`),
          solutionFigures: [bothFig],
        };
      },
    },
    {
      id: "sectors-and-segments",
      figure: partsDrawings["sectors-and-segments"],
      title: t("Sectors and segments", "扇形与弓形"),
      explanation: t(
        `An arc cuts off a region of the circle in two ways, and each has a name:

- A **sector** is bounded by two radii and the arc between them, like a slice of pizza: its corner is at the center.
- A **segment** of a circle is bounded by a chord and the arc it cuts off, like the piece left when a slice is cut off a round loaf with one straight cut.

To tell them apart, look at the straight part of the boundary: two radii meeting at the center make a sector, a single chord makes a segment. Then look at the arc: each region is **minor** or **major** as its arc is a minor or a major arc. With an arc of $70^\\circ$, the two radii cut off a narrow minor sector, and the rest of the disk, with its arc of $290^\\circ$, is the major sector.

> **Watch out.** Sector and segment are not two words for one thing: a sector reaches the center, a segment does not reach it unless it is major. And the size word follows the arc, not the look of the straight sides.`,
        `圆中的一段弧可以用两种方式截出区域，各有名称：

- **扇形**由两条半径和它们之间的弧围成，像一块比萨：它的顶点在圆心。
- **弓形**由一条弦和它截出的弧围成，像在圆面包上直直切下一刀得到的那一块。

区分它们，先看边界的直线部分：交于圆心的两条半径围成扇形，一条弦围成弓形。再看弧：根据它的弧是劣弧还是优弧，区域分别叫**劣**扇形（弓形）或**优**扇形（弓形）。弧为 $70^\\circ$ 时，两条半径截出一个窄窄的劣扇形，圆的其余部分（弧为 $290^\\circ$）是优扇形。

> **注意。** 扇形和弓形不是同一个东西的两种叫法：扇形伸到圆心，弓形除非是优弓形，否则碰不到圆心。“劣”“优”看的是弧，不是直边的样子。`,
      ),
      generate(rng) {
        const sector = rng.bool();
        const major = rng.bool();
        const m = major ? rng.int(210, 320) : rng.int(40, 150);
        const s = rng.int(0, 359);
        const pts = arcPoints(s, s + m);
        const correct = (sector ? 0 : 2) + (major ? 1 : 0);
        const options = [
          t("A minor sector", "劣扇形"),
          t("A major sector", "优扇形"),
          t("A minor segment", "劣弓形"),
          t("A major segment", "优弓形"),
        ];
        const rest = options[(sector ? 0 : 2) + (major ? 0 : 1)]!;
        const region = (extra: readonly Mark[]): Mark[] => [
          circleAt(),
          { kind: "polygon", points: sector ? [O, ...pts] : pts, accent: true },
          ...extra,
          ...center("O", dirOf(s + m / 2 + 180)),
        ];
        const straight = sector ? [toned(O, on(s), "action"), toned(O, on(s + m), "action")] : [toned(on(s), on(s + m), "action")];
        const kindWord = sector ? t("sector", "扇形") : t("segment", "弓形");
        const sizeWord = major ? t("major", "优") : t("minor", "劣");
        return reasoned(
          {
            ...choiceProblem({
              prompt: t("What is the highlighted region of circle $O$?", "圆 $O$ 中突出显示的区域是什么？"),
              options,
              correct,
              solution: t(
                `**Step 1: the straight part of the boundary.** ${sector ? "The region is bounded by two radii that meet at the center $O$, so it is a sector." : "The region is bounded by one chord, whose ends are both on the circle, so it is a segment."}

**Step 2: the arc.** Its arc is ${major ? "the larger arc, more than half the circle: a major arc" : "the smaller arc, less than half the circle: a minor arc"}. So the region is ${options[correct]!.en.toLowerCase()}.

{{figure 0}}

**Check.** The rest of the circle is bounded by the same ${sector ? "two radii" : "chord"} and the other arc, so it is ${rest.en.toLowerCase()}: ${sector ? "sectors" : "segments"} come in minor and major pairs that make up the whole circle.`,
                `**第一步：看边界的直线部分。** ${sector ? "这个区域由交于圆心 $O$ 的两条半径围成，所以是扇形。" : "这个区域由一条两端都在圆上的弦围成，所以是弓形。"}

**第二步：看弧。** 它的弧是${major ? "较大的一段，超过半个圆，是优弧" : "较小的一段，不到半个圆，是劣弧"}。所以这个区域是${options[correct]!["zh-CN"]}。

{{figure 0}}

**检验。** 圆的其余部分由同样的${sector ? "两条半径" : "弦"}和另一段弧围成，所以是${rest["zh-CN"]}：${sector ? "扇形" : "弓形"}总是一劣一优成对出现，合起来是整个圆。`,
              ),
            }),
            figure: figure(region([]), "Circle O with a highlighted region bounded by an arc.", "圆 O 中一个由弧围成的区域被突出显示。"),
            solutionFigures: [
              figure(
                region(straight),
                `The highlighted region of circle O is bounded by ${sector ? "two radii" : "a chord"} and a ${major ? "major" : "minor"} arc: a ${sizeWord.en} ${kindWord.en}.`,
                `圆 O 中突出显示的区域由${sector ? "两条半径" : "一条弦"}和一段${sizeWord["zh-CN"]}弧围成：${sizeWord["zh-CN"]}${kindWord["zh-CN"]}。`,
              ),
            ],
          },
          [
            [
              options[0]!.en,
              sector
                ? "Its arc is a major arc, so the sector is major."
                : "A sector is bounded by two radii, and this region is bounded by a chord.",
              sector ? "它的弧是优弧，所以是优扇形。" : "扇形由两条半径围成，而这个区域由一条弦围成。",
            ],
            [
              options[1]!.en,
              sector
                ? "Its arc is a minor arc, so the sector is minor."
                : "A sector is bounded by two radii, and this region is bounded by a chord.",
              sector ? "它的弧是劣弧，所以是劣扇形。" : "扇形由两条半径围成，而这个区域由一条弦围成。",
            ],
            [
              options[2]!.en,
              sector
                ? "A segment is bounded by a chord, and this region is bounded by two radii."
                : "Its arc is a major arc, so the segment is major.",
              sector ? "弓形由一条弦围成，而这个区域由两条半径围成。" : "它的弧是优弧，所以是优弓形。",
            ],
            [
              options[3]!.en,
              sector
                ? "A segment is bounded by a chord, and this region is bounded by two radii."
                : "Its arc is a minor arc, so the segment is minor.",
              sector ? "弓形由一条弦围成，而这个区域由两条半径围成。" : "它的弧是劣弧，所以是劣弓形。",
            ],
          ],
        );
      },
    },
  ],
};

export const theCircumferenceOfACircle: TopicDef = {
  id: "the-circumference-of-a-circle",
  title: t("The Circumference of a Circle", "圆的周长"),
  summary: t(
    "Find the circumference of a circle exactly in terms of π and approximately, and find the radius from the circumference.",
    "用含 π 的式子和近似值求圆的周长，并由周长求半径。",
  ),
  prerequisites: ["circles", "decimal-arithmetic"],
  encompasses: [
    { topic: "circles", weight: 0.2 },
    { topic: "decimal-arithmetic", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.7.G.B.4"],
  intro: t(
    `Paint a dot on the rim of a wheel with a diameter of $1$ m, and roll the wheel along the ground for one full turn. The dot touches the ground, goes once around, and touches down again a little more than $3$ m farther on: about $3.14$ m. That distance, once around the rim, is the wheel's **circumference**.

{{figure 0}}

A wheel twice as wide, $2$ m across, is the same shape scaled up by $2$, so every length of it doubles, the distance around too: about $6.28$ m. A wheel $5$ m across goes about $15.7$ m. Whatever the size, the circumference is the same number of diameters, a little over three. That number is called $\\pi$ (pi), $3.14159\\ldots$, and it gives the rule

$$C = \\pi d.$$

In this lesson we find circumferences exactly in terms of $\\pi$, as decimals with $\\pi \\approx 3.14$, and work back from a circumference to the radius and diameter.`,
    `在直径 $1$ 米的轮子边缘点一个点，让轮子在地上滚动一整圈。这个点着地，转一圈，再次着地时已经往前走了 $3$ 米多一点：约 $3.14$ 米。这段距离，也就是绕轮子边缘一圈的长度，就是轮子的**周长**。

{{figure 0}}

宽一倍、直径 $2$ 米的轮子，是同样的形状放大到 $2$ 倍，所有长度都变成两倍，绕一圈的长度也是：约 $6.28$ 米。直径 $5$ 米的轮子约走 $15.7$ 米。不管多大，周长总是直径的同一个倍数，比三倍多一点。这个数叫 $\\pi$（圆周率），$3.14159\\ldots$，于是有

$$C = \\pi d.$$

这节课我们用含 $\\pi$ 的式子精确地求周长，取 $\\pi \\approx 3.14$ 求周长的小数值，并由周长反求半径和直径。`,
  ),
  introFigures: [
    figure(
      [
        circleAt(R, [0, R]),
        seg([0, 0], [0, 2 * R], true),
        { kind: "side", a: [0, 2 * R], b: [0, 0], text: "1 m" },
        { kind: "dot", at: [0, 0], tone: "result" },
        toned([0, 0], [2 * Math.PI * R, 0], "result"),
        { kind: "side", a: [0, 0], b: [2 * Math.PI * R, 0], text: "≈ 3.14 m" },
        { kind: "dot", at: [2 * Math.PI * R, 0], tone: "result" },
      ],
      "A wheel with a diameter of 1 m and, along the ground, the distance it rolls in one turn, about 3.14 m.",
      "直径 1 m 的轮子，以及它滚动一圈在地面上走过的距离，约 3.14 m。",
    ),
  ],
  knowledgePoints: [
    {
      id: "circumference-in-terms-of-pi",
      figure: partsDrawings["circumference-in-terms-of-pi"],
      title: t("Circumference in terms of π", "用 π 表示周长"),
      explanation: t(
        `The **circumference** $C$ of a circle is its perimeter, the distance around it. All circles have the same shape, so enlarging a circle enlarges its circumference and its diameter by the same factor, and their ratio never changes. That ratio is $\\pi$:

$$\\frac{C}{d} = \\pi, \\qquad\\text{so}\\qquad C = \\pi d = 2\\pi r,$$

the second form because the diameter is two radii.

An exact answer keeps the symbol $\\pi$. A circle with radius $4$ cm has diameter $8$ cm and circumference $\\pi \\cdot 8 = 8\\pi$ cm, about $25$ cm; a circle with diameter $11$ m has circumference $11\\pi$ m.

> **Watch out.** Circumference is a length, so the radius is not squared: $\\pi r^2$ is the area. Use the $2$ with the radius and only with the radius: $\\pi r$ is half the circumference, and $2\\pi d$ is twice it.`,
        `圆的**周长** $C$ 是绕圆一周的长度。所有的圆形状相同，把圆放大，周长和直径放大同样的倍数，它们的比不变。这个比就是 $\\pi$：

$$\\frac{C}{d} = \\pi, \\qquad\\text{所以}\\qquad C = \\pi d = 2\\pi r,$$

第二种写法是因为直径等于两条半径。

精确的答案保留符号 $\\pi$。半径为 $4$ 厘米的圆，直径 $8$ 厘米，周长 $\\pi \\cdot 8 = 8\\pi$ 厘米，约 $25$ 厘米；直径为 $11$ 米的圆，周长是 $11\\pi$ 米。

> **注意。** 周长是长度，半径不平方：$\\pi r^2$ 是面积。$2$ 只和半径一起用：$\\pi r$ 是半个周长，$2\\pi d$ 是周长的两倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(0, 359);
        if (rng.bool()) {
          const r = rng.int(2, 25);
          return {
            ...piProblem({
              prompt: t(`Find the circumference of the circle.${PI_EN}`, `求这个圆的周长。${PI_ZH}`),
              answer: piTex(2 * r),
              unit: u,
              wrong: [piTex(r * r), piTex(r), piTex(4 * r)],
              solution: t(
                `**Step 1: the diameter.** The circumference is $\\pi$ times the diameter, and the diameter is two radii:${steps(`d = 2 \\cdot ${r} = ${2 * r}`)}{{figure 0}}

**Step 2: the circumference.**${steps(`C = \\pi d = 2\\pi r = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}**Check.** With $\\pi \\approx 3$, the distance around is about three diameters, $3 \\cdot ${2 * r} = ${6 * r}$; the exact answer is $${piTex(2 * r)} \\approx ${piNear(2 * r)}$, a little more, as it should be since $\\pi$ is a little more than $3$.`,
                `**第一步：求直径。** 周长等于 $\\pi$ 乘直径，直径是两条半径：${steps(`d = 2 \\cdot ${r} = ${2 * r}`)}{{figure 0}}

**第二步：求周长。**${steps(`C = \\pi d = 2\\pi r = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}**检验。** 取 $\\pi \\approx 3$，绕一圈约是三个直径，$3 \\cdot ${2 * r} = ${6 * r}$；精确答案 $${piTex(2 * r)} \\approx ${piNear(2 * r)}$，稍大一些，因为 $\\pi$ 比 $3$ 稍大。`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
            solutionFigures: [
              figure(
                [...twoRadii(s, len(r, u), len(2 * r, u), "accent"), circleAt(R, O, "result")],
                `The radius of ${r} ${u} doubled to the diameter of ${2 * r} ${u}; the circumference is the circle itself.`,
                `半径 ${r} ${u} 乘以 2 得直径 ${2 * r} ${u}；周长就是这个圆本身。`,
              ),
            ],
          };
        }
        const d = rng.int(3, 40);
        return {
          ...piProblem({
            prompt: t(`Find the circumference of the circle.${PI_EN}`, `求这个圆的周长。${PI_ZH}`),
            answer: piTex(d),
            unit: u,
            wrong: [piTex(2 * d), piTex(q(d * d, 4)), piTex(q(d, 2))],
            solution: t(
              `**Step 1: what is given.** The highlighted segment passes through the center, so it is a diameter: $d = ${d}$. The circumference is $\\pi$ times the diameter, so no doubling is needed.

{{figure 0}}

**Step 2: the circumference.**${steps(`C = \\pi d = \\pi \\cdot ${d} = ${tex(piTex(d), u)}`)}**Check.** Through the radius instead: $r = \\frac{${d}}{2}$, and $2\\pi r = 2\\pi \\cdot \\frac{${d}}{2} = ${piTex(d)}$, the same. With $\\pi \\approx 3$ it is about $3 \\cdot ${d} = ${3 * d}$, and $${piTex(d)} \\approx ${piNear(d)}$.`,
              `**第一步：已知什么。** 突出显示的线段经过圆心，所以是直径：$d = ${d}$。周长等于 $\\pi$ 乘直径，不需要再乘以 $2$。

{{figure 0}}

**第二步：求周长。**${steps(`C = \\pi d = \\pi \\cdot ${d} = ${tex(piTex(d), u)}`)}**检验。** 改用半径计算：$r = \\frac{${d}}{2}$，$2\\pi r = 2\\pi \\cdot \\frac{${d}}{2} = ${piTex(d)}$，结果相同。取 $\\pi \\approx 3$，约为 $3 \\cdot ${d} = ${3 * d}$，而 $${piTex(d)} \\approx ${piNear(d)}$。`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
          solutionFigures: [
            figure(
              [...measuredCircle(len(d, u), true, s), circleAt(R, O, "result")],
              `The diameter of ${d} ${u}; the circumference, the circle itself, is π times it.`,
              `直径 ${d} ${u}；周长（圆本身）是它的 π 倍。`,
            ),
          ],
        };
      },
    },
    {
      id: "approximating-circumference",
      figure: partsDrawings["approximating-circumference"],
      title: t("Approximating the circumference", "周长的近似值"),
      explanation: t(
        `$\\pi$ is not a fraction or a terminating decimal, so a decimal answer uses an approximation of it, such as $3.14$. Work out the diameter first, then multiply by $3.14$.

A circle with diameter $15$ m has circumference

$$C = \\pi d \\approx 3.14 \\cdot 15 = 47.1\\text{ m}.$$

If you know the radius, double it first: a circle with radius $6$ m has $d = 12$ m and $C \\approx 3.14 \\cdot 12 = 37.68$ m. An estimate with $\\pi \\approx 3$ tells you roughly what to expect: $3 \\cdot 12 = 36$, a little less.

> **Watch out.** The formula $C = \\pi d$ needs the diameter: multiplying $3.14$ by the radius gives only half the circumference, and by four times the radius twice it. Do not square anything: $3.14 \\cdot r^2$ is an area.`,
        `$\\pi$ 不是分数，也不是有限小数，所以小数答案要用它的近似值，例如 $3.14$。先求出直径，再乘以 $3.14$。

直径为 $15$ 米的圆，周长

$$C = \\pi d \\approx 3.14 \\cdot 15 = 47.1\\text{ m}.$$

若已知半径，先乘以 $2$：半径为 $6$ 米的圆，$d = 12$ 米，$C \\approx 3.14 \\cdot 12 = 37.68$ 米。用 $\\pi \\approx 3$ 估算可以知道大概结果：$3 \\cdot 12 = 36$，略小一些。

> **注意。** 公式 $C = \\pi d$ 用的是直径：$3.14$ 乘半径只得到半个周长，乘四倍半径则是周长的两倍。不要平方：$3.14 \\cdot r^2$ 是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const useRadius = rng.bool();
        const r = rng.int(2, 30);
        const d = useRadius ? 2 * r : rng.int(3, 50);
        const c = piQ.mul(q(d));
        const given = useRadius
          ? t(`a radius of $${tex(r, u)}$`, `半径为 $${tex(r, u)}$`)
          : t(`a diameter of $${tex(d, u)}$`, `直径为 $${tex(d, u)}$`);
        const dStep = useRadius
          ? t(
              `**Step 1: the diameter.** The formula uses the diameter, two radii:${steps(`d = 2 \\cdot ${r} = ${d}`)}`,
              `**第一步：求直径。** 公式用的是直径，即两条半径：${steps(`d = 2 \\cdot ${r} = ${d}`)}`,
            )
          : t(
              `**Step 1: the diameter.** The diameter is given, $d = ${d}$, and the formula uses it directly.\n\n`,
              `**第一步：直径。** 已知直径 $d = ${d}$，可以直接代入公式。\n\n`,
            );
        return {
          ...numberProblem({
            prompt: t(
              `A circle has ${given.en}. Use $3.14$ for $\\pi$ to find its circumference.`,
              `一个圆的${given["zh-CN"]}。取 $\\pi \\approx 3.14$，求它的周长。`,
            ),
            answer: c,
            form: "decimal",
            unit: u,
            wrong: useRadius
              ? [piQ.mul(q(r)), piQ.mul(q(r * r)), piQ.mul(q(4 * r))]
              : [piQ.mul(q(2 * d)), piQ.mul(q(d * d, 4)), piQ.mul(q(d, 2))],
            solution: t(
              `${dStep.en}{{figure 0}}

**Step 2: multiply by $3.14$.**${steps(`C = \\pi d \\approx 3.14 \\cdot ${d} = ${tex(dec(c), u)}`)}**Check.** With $\\pi \\approx 3$ the circumference is about $3 \\cdot ${d} = ${3 * d}$. The answer $${dec(c)}$ is a little more, by $0.14 \\cdot ${d} = ${dec(q(14 * d, 100))}$, since $3.14$ is a little more than $3$.`,
              `${dStep["zh-CN"]}{{figure 0}}

**第二步：乘以 $3.14$。**${steps(`C = \\pi d \\approx 3.14 \\cdot ${d} = ${tex(dec(c), u)}`)}**检验。** 取 $\\pi \\approx 3$，周长约为 $3 \\cdot ${d} = ${3 * d}$。答案 $${dec(c)}$ 稍大，多出 $0.14 \\cdot ${d} = ${dec(q(14 * d, 100))}$，因为 $3.14$ 比 $3$ 稍大。`,
            ),
          }),
          solutionFigures: [
            figure(
              useRadius ? twoRadii(90, len(r, u), len(d, u), "result") : [...measuredCircle(len(d, u), true, 0), circleAt(R, O, "result")],
              useRadius ? `A radius of ${r} ${u} doubled to a diameter of ${d} ${u}.` : `A circle with a diameter of ${d} ${u}.`,
              useRadius ? `半径 ${r} ${u} 乘以 2 得直径 ${d} ${u}。` : `一个直径为 ${d} ${u} 的圆。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-circumference",
      figure: partsDrawings["radius-from-circumference"],
      title: t("The radius from the circumference", "由周长求半径"),
      explanation: t(
        `Since $C = \\pi d$, the circumference is the diameter multiplied by $\\pi$. To go back, undo the multiplication: divide by $\\pi$. So

$$d = \\frac{C}{\\pi}, \\qquad r = \\frac{d}{2}.$$

With an exact circumference the division is easy to see: a circle with circumference $26\\pi$ cm has diameter $26$ cm, the number in front of $\\pi$, and radius $13$ cm. With the approximation $3.14$, a circle with circumference $47.1$ m has diameter $47.1 \\div 3.14 = 15$ m.

> **Watch out.** The number in front of $\\pi$ is the diameter, not the radius: for the radius, halve it once. Halving twice, or doubling, gives a circle of a different size, and multiplying by $3.14$ instead of dividing goes the wrong way.`,
        `由 $C = \\pi d$，周长是直径乘以 $\\pi$。要倒回去，就撤销乘法：除以 $\\pi$。所以

$$d = \\frac{C}{\\pi}, \\qquad r = \\frac{d}{2}.$$

周长用含 $\\pi$ 的式子给出时，除法一眼就能看出：周长为 $26\\pi$ 厘米的圆，直径是 $\\pi$ 前面的数 $26$ 厘米，半径是 $13$ 厘米。用近似值 $3.14$：周长为 $47.1$ 米的圆，直径是 $47.1 \\div 3.14 = 15$ 米。

> **注意。** $\\pi$ 前面的数是直径，不是半径：求半径要除以 $2$，只除一次。除两次或乘以 $2$ 得到的是另一个大小的圆；乘以 $3.14$ 而不是除以它，方向就反了。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const d = rng.int(2, 40);
          const c = dec(piQ.mul(q(d)));
          return {
            ...numberProblem({
              prompt: t(
                `A circle has a circumference of $${tex(c, u)}$. Use $3.14$ for $\\pi$ to find its diameter.`,
                `一个圆的周长是 $${tex(c, u)}$。取 $\\pi \\approx 3.14$，求它的直径。`,
              ),
              answer: d,
              unit: u,
              mistakes: [
                why(q(d, 2), "That is the radius. The question asks for the diameter.", "这是半径，题目问的是直径。"),
                why(
                  2 * d,
                  "That doubles the diameter. Dividing the circumference by $\\pi$ already gives the diameter.",
                  "这是直径的两倍。周长除以 $\\pi$ 就已经是直径了。",
                ),
                why(
                  piQ.mul(q(d)),
                  "You multiplied by $3.14$ again. Divide the circumference by $3.14$.",
                  "你又乘了一次 $3.14$。应该用周长除以 $3.14$。",
                ),
              ],
              solution: t(
                `**Step 1: undo the multiplication.** The circumference is $\\pi$ times the diameter, $C = \\pi d$, so the diameter is the circumference divided by $\\pi$.

**Step 2: divide by $3.14$.**${steps(`d \\approx ${c} \\div 3.14 = ${tex(d, u)}`)}{{figure 0}}

**Check.** Put the diameter back into the formula: $3.14 \\cdot ${d} = ${c}$, the given circumference. And with $\\pi \\approx 3$, $${c} \\div 3 \\approx ${near(Number(c) / 3)}$, a little more than $${d}$, as dividing by a smaller number should give.`,
                `**第一步：撤销乘法。** 周长等于 $\\pi$ 乘直径，$C = \\pi d$，所以直径等于周长除以 $\\pi$。

**第二步：除以 $3.14$。**${steps(`d \\approx ${c} \\div 3.14 = ${tex(d, u)}`)}{{figure 0}}

**检验。** 把直径代回公式：$3.14 \\cdot ${d} = ${c}$，正是已知的周长。取 $\\pi \\approx 3$，$${c} \\div 3 \\approx ${near(Number(c) / 3)}$，比 $${d}$ 稍大，除以较小的数正应如此。`,
              ),
            }),
            solutionFigures: [
              figure(
                [...measuredCircle(len(d, u), true, 0), circleAt(R, O, "action")],
                `A circle with a circumference of ${c} ${u} and its diameter of ${d} ${u}.`,
                `周长为 ${c} ${u} 的圆及其直径 ${d} ${u}。`,
              ),
            ],
          };
        }
        const r = rng.int(2, 30);
        const askRadius = kind === 0;
        const last = askRadius
          ? t(
              `**Step 2: halve for the radius.** The radius is half the diameter:${steps(`r = \\frac{${2 * r}}{2} = ${tex(r, u)}`)}`,
              `**第二步：除以 $2$ 得半径。** 半径是直径的一半：${steps(`r = \\frac{${2 * r}}{2} = ${tex(r, u)}`)}`,
            )
          : t(
              `**Step 2: the diameter.** The question asks for the diameter itself, so no halving is needed: $d = ${tex(2 * r, u)}$.\n\n`,
              `**第二步：直径。** 题目问的就是直径，不必再除以 $2$：$d = ${tex(2 * r, u)}$。\n\n`,
            );
        return {
          ...numberProblem({
            prompt: t(
              `A circle has a circumference of $${tex(piTex(2 * r), u)}$. Find its ${askRadius ? "radius" : "diameter"}.`,
              `一个圆的周长是 $${tex(piTex(2 * r), u)}$。求它的${askRadius ? "半径" : "直径"}。`,
            ),
            answer: askRadius ? r : 2 * r,
            unit: u,
            mistakes: askRadius
              ? [
                  why(
                    2 * r,
                    "That is the diameter, the number in front of $\\pi$. The radius is half of it.",
                    "这是直径，也就是 $\\pi$ 前面的数。半径是它的一半。",
                  ),
                  why(
                    q(r, 2),
                    "You halved twice. The number in front of $\\pi$ is $2r$, so halve it once.",
                    "你除了两次 $2$。$\\pi$ 前面的数是 $2r$，只需除以一次 $2$。",
                  ),
                  why(
                    4 * r,
                    "You doubled. The number in front of $\\pi$ is $2r$, so halve it.",
                    "你乘了 $2$。$\\pi$ 前面的数是 $2r$，应该除以 $2$。",
                  ),
                ]
              : [
                  why(r, "That is the radius. The diameter is the number in front of $\\pi$.", "这是半径。直径就是 $\\pi$ 前面的数。"),
                  why(
                    4 * r,
                    "You doubled, but the number in front of $\\pi$ already is the diameter.",
                    "你乘了 $2$，但 $\\pi$ 前面的数已经是直径了。",
                  ),
                  why(
                    q(r, 2),
                    "You halved too far. The number in front of $\\pi$ already is the diameter.",
                    "你除得太多了。$\\pi$ 前面的数已经是直径了。",
                  ),
                ],
            solution: t(
              `**Step 1: divide by $\\pi$.** The circumference is $C = \\pi d$, so dividing by $\\pi$ leaves the diameter:${steps(`d = \\frac{${piTex(2 * r)}}{\\pi} = ${2 * r}`)}${last.en}{{figure 0}}

**Check.** Rebuild the circumference: ${askRadius ? `$2\\pi r = 2\\pi \\cdot ${r}` : `$\\pi d = \\pi \\cdot ${2 * r}`} = ${piTex(2 * r)}$, as given.`,
              `**第一步：除以 $\\pi$。** 周长 $C = \\pi d$，除以 $\\pi$ 就得到直径：${steps(`d = \\frac{${piTex(2 * r)}}{\\pi} = ${2 * r}`)}${last["zh-CN"]}{{figure 0}}

**检验。** 重新算周长：${askRadius ? `$2\\pi r = 2\\pi \\cdot ${r}` : `$\\pi d = \\pi \\cdot ${2 * r}`} = ${piTex(2 * r)}$，与已知相同。`,
            ),
          }),
          solutionFigures: [
            figure(
              [...twoRadii(90, len(r, u), len(2 * r, u), askRadius ? "result" : "accent"), circleAt(R, O, "action")],
              `A circle with a circumference of ${2 * r}π ${u}: its diameter is ${2 * r} ${u} and its radius ${r} ${u}.`,
              `周长为 ${2 * r}π ${u} 的圆：直径 ${2 * r} ${u}，半径 ${r} ${u}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** wedgeRow lays the eight sectors of a circle of radius r side by side, pointing up and down in turn, as an almost-rectangle. */
function wedgeRow(r: number): Mark[] {
  const half = 22.5;
  const step = r * Math.sin(rad(half));
  return Array.from({ length: 8 }, (_, i): Mark => {
    const up = i % 2 === 0;
    const apex: Point = up ? [i * step, 0] : [i * step, r];
    const pts = up ? arcPoints(90 - half, 90 + half, r, apex) : arcPoints(270 - half, 270 + half, r, apex);
    return { kind: "polygon", points: [apex, ...pts], ...(up && { accent: true }) };
  });
}

/** squareOnRadius is the square drawn on the radius from O in direction s, outward on its clockwise side. */
function squareOnRadius(s: number): Point[] {
  const a = on(s);
  const v: Point = [Math.sin(rad(s)) * R, -Math.cos(rad(s)) * R];
  return [O, a, [a[0] + v[0], a[1] + v[1]], [v[0], v[1]]];
}

/** areaMarks draws a circle shaded as its area, with the radius from O in direction s labeled and the square on the radius dashed. */
function areaMarks(s: number, radius: string): Mark[] {
  const sq = squareOnRadius(s);
  return [
    diskShade(R, "result"),
    circleAt(),
    ...center("O", dirOf(s + 180)),
    seg(O, on(s), true),
    { kind: "side", a: on(s), b: O, text: radius },
    toned(sq[1]!, sq[2]!, "action", true),
    toned(sq[2]!, sq[3]!, "action", true),
    toned(sq[3]!, sq[0]!, "action", true),
  ];
}

export const areasOfCircles: TopicDef = {
  id: "areas-of-circles",
  title: t("Areas of Circles", "圆的面积"),
  summary: t(
    "Find the area of a circle from its radius, diameter or circumference, and the radius from the area.",
    "由半径、直径或周长求圆的面积，以及由面积求半径。",
  ),
  prerequisites: ["the-circumference-of-a-circle", "area-of-rectangles-and-squares", "square-roots-and-cube-roots"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.7.G.B.4"],
  intro: t(
    `We can find the area of a rectangle, and the circumference of a circle, $2\\pi r$. A circle has no straight sides, but it can be turned into something close to a rectangle.

Take a circle of radius $3$ cm and cut it like a pie into $8$ equal wedges. Lay them side by side, pointing up and down in turn:

{{figure 0}}

The row is almost a rectangle. Its height is a wedge's length, the radius, $3$ cm. Its top and bottom are made of the wedges' curved edges, half of them along each, so each is half the circumference: $\\frac{1}{2} \\cdot 2\\pi \\cdot 3 = 3\\pi$ cm. With more and thinner wedges the row gets straighter, and its area is exactly

$$3\\pi \\cdot 3 = 9\\pi \\approx 28.3\\text{ cm}^2.$$

For any radius $r$ the same cutting gives half the circumference times the radius, $\\pi r \\cdot r$, so

$$A = \\pi r^2.$$

In this lesson we find areas of circles exactly and as decimals, and work back from an area, or from a circumference, to the radius.`,
    `我们会求长方形的面积，也会求圆的周长 $2\\pi r$。圆没有直边，但可以把它拼成接近长方形的形状。

取一个半径 $3$ 厘米的圆，像切馅饼一样切成 $8$ 块相等的楔形，一正一倒地并排摆放：

{{figure 0}}

这一排几乎是一个长方形。它的高是楔形的长，也就是半径 $3$ 厘米；它的上边和下边由楔形的弧边组成，各占一半，所以各是半个圆周：$\\frac{1}{2} \\cdot 2\\pi \\cdot 3 = 3\\pi$ 厘米。楔形切得越多越细，这一排就越直，它的面积正好是

$$3\\pi \\cdot 3 = 9\\pi \\approx 28.3\\text{ cm}^2.$$

对任意半径 $r$，同样的切法得到半个周长乘半径，$\\pi r \\cdot r$，所以

$$A = \\pi r^2.$$

这节课我们求圆面积的精确值和小数值，并由面积或周长反求半径。`,
  ),
  introFigures: [
    figure(
      [
        ...wedgeRow(3),
        { kind: "segment", a: [-0.6, 0], b: [-0.6, 3], dashed: true },
        { kind: "side", a: [-0.6, 3], b: [-0.6, 0], text: "3 cm" },
        { kind: "label", at: [7 * 3 * Math.sin(rad(22.5)) * 0.5, 0], text: "3π cm", dir: "s" },
      ],
      "Eight wedges of a circle of radius 3 cm laid side by side: almost a rectangle 3 cm high and 3π cm long.",
      "半径 3 cm 的圆切成的八块楔形并排摆放：几乎是一个高 3 cm、长 3π cm 的长方形。",
    ),
  ],
  knowledgePoints: [
    {
      id: "area-from-the-radius",
      figure: partsDrawings["area-from-the-radius"],
      title: t("Area from the radius", "由半径求面积"),
      explanation: t(
        `The area of a circle with radius $r$ is

$$A = \\pi r^2.$$

It reads as a picture: $r^2$ is the area of the square drawn on a radius, and the circle holds a little more than three of those squares, $\\pi \\approx 3.14$ of them. A circle with radius $5$ cm has area $\\pi \\cdot 5^2 = 25\\pi\\text{ cm}^2$, about $3 \\cdot 25 = 75\\text{ cm}^2$, more exactly $78.5\\text{ cm}^2$.

If you are given the diameter, halve it before squaring: a circle with diameter $14$ m has radius $7$ m and area $\\pi \\cdot 7^2 = 49\\pi\\text{ m}^2$.

> **Watch out.** Square the radius, not the diameter: squaring $14$ gives $196\\pi$, four times too much. Do square it: $2\\pi r$ is the circumference, a length, and $\\pi r$ is half of that, not an area.`,
        `半径为 $r$ 的圆的面积是

$$A = \\pi r^2.$$

可以把它看成一幅图：$r^2$ 是以半径为边的正方形的面积，圆里能放下比三个多一点这样的正方形，也就是 $\\pi \\approx 3.14$ 个。半径为 $5$ 厘米的圆，面积是 $\\pi \\cdot 5^2 = 25\\pi\\text{ cm}^2$，约 $3 \\cdot 25 = 75\\text{ cm}^2$，更准确地说是 $78.5\\text{ cm}^2$。

若给出的是直径，先除以 $2$ 再平方：直径为 $14$ 米的圆，半径是 $7$ 米，面积是 $\\pi \\cdot 7^2 = 49\\pi\\text{ m}^2$。

> **注意。** 平方的是半径，不是直径：把 $14$ 平方得到 $196\\pi$，大了四倍。半径一定要平方：$2\\pi r$ 是周长，是长度；$\\pi r$ 是周长的一半，也不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(0, 359);
        if (rng.bool()) {
          const r = rng.int(2, 25);
          return {
            ...piProblem({
              prompt: t(`Find the area of the circle.${PI_EN}`, `求这个圆的面积。${PI_ZH}`),
              answer: piTex(r * r),
              unit: `${u}^2`,
              wrong: [piTex(2 * r), piTex(2 * r * r), piTex(r)],
              solution: t(
                `**Step 1: square the radius.** The highlighted segment runs from the center to the circle, so it is the radius, $r = ${r}$. Its square is the area of the square drawn on it:${steps(`r^2 = ${r}^2 = ${r * r}`)}{{figure 0}}

**Step 2: multiply by $\\pi$.** The circle holds $\\pi$ of those squares:${steps(`A = \\pi r^2 = \\pi \\cdot ${r * r} = ${tex(piTex(r * r), u, 2)}`)}**Check.** With $\\pi \\approx 3$ the circle is about three such squares, $3 \\cdot ${r * r} = ${3 * r * r}$, and $${piTex(r * r)} \\approx ${piNear(r * r)}$ is a little more. The units are square ${unitWord(u)}, as an area's must be.`,
                `**第一步：把半径平方。** 突出显示的线段从圆心到圆上，是半径，$r = ${r}$。它的平方就是以它为边的正方形的面积：${steps(`r^2 = ${r}^2 = ${r * r}`)}{{figure 0}}

**第二步：乘以 $\\pi$。** 圆里能放下 $\\pi$ 个这样的正方形：${steps(`A = \\pi r^2 = \\pi \\cdot ${r * r} = ${tex(piTex(r * r), u, 2)}`)}**检验。** 取 $\\pi \\approx 3$，圆约等于三个这样的正方形，$3 \\cdot ${r * r} = ${3 * r * r}$，而 $${piTex(r * r)} \\approx ${piNear(r * r)}$ 稍大一些。单位是平方${u}，面积正应如此。`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
            solutionFigures: [
              figure(
                areaMarks(s, len(r, u)),
                `The circle with radius ${r} ${u} shaded, and the dashed square on its radius, of area ${r * r} ${u}².`,
                `半径为 ${r} ${u} 的圆（阴影），以及以半径为边的正方形（虚线），面积 ${r * r} ${u}²。`,
              ),
            ],
          };
        }
        const d = rng.int(3, 30);
        const a = q(d * d, 4);
        const even = d % 2 === 0;
        const squared = even ? `${d / 2}^2 = ${(d / 2) ** 2}` : `\\left(\\frac{${d}}{2}\\right)^2 = \\frac{${d * d}}{4}`;
        return {
          ...piProblem({
            prompt: t(`Find the area of the circle.${PI_EN}`, `求这个圆的面积。${PI_ZH}`),
            answer: piTex(a),
            unit: `${u}^2`,
            wrong: [piTex(d * d), piTex(d), piTex(q(d * d, 2))],
            solution: t(
              `**Step 1: the radius.** The highlighted segment passes through the center, so it is a diameter. The formula needs the radius, half of it:${steps(`r = \\frac{${d}}{2}${even ? ` = ${d / 2}` : ""}`)}{{figure 0}}

**Step 2: square the radius.**${steps(`r^2 = ${squared}`)}**Step 3: multiply by $\\pi$.**${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}**Check.** The circle fits in a square of side $${d}$, the diameter, whose area is $${d * d}$; the circle fills $\\frac{\\pi}{4}$ of it, a little more than three quarters: $\\frac{3}{4} \\cdot ${d * d} = ${dec(q(3 * d * d, 4))}$, and $${piTex(a)} \\approx ${piNear(a)}$.`,
              `**第一步：求半径。** 突出显示的线段经过圆心，是直径。公式要用半径，即它的一半：${steps(`r = \\frac{${d}}{2}${even ? ` = ${d / 2}` : ""}`)}{{figure 0}}

**第二步：把半径平方。**${steps(`r^2 = ${squared}`)}**第三步：乘以 $\\pi$。**${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}**检验。** 这个圆正好放进边长为直径 $${d}$ 的正方形，正方形面积 $${d * d}$；圆占它的 $\\frac{\\pi}{4}$，比四分之三多一点：$\\frac{3}{4} \\cdot ${d * d} = ${dec(q(3 * d * d, 4))}$，而 $${piTex(a)} \\approx ${piNear(a)}$。`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
          solutionFigures: [
            figure(
              [diskShade(R, "result"), ...twoRadii(s, len(dec(q(d, 2)), u), len(d, u), "accent")],
              `The diameter of ${d} ${u} is two radii of ${dec(q(d, 2))} ${u}; the shaded disk is the area.`,
              `直径 ${d} ${u} 由两条 ${dec(q(d, 2))} ${u} 的半径组成；阴影部分是面积。`,
            ),
          ],
        };
      },
    },
    {
      id: "approximating-area",
      figure: geometryDrawings2["areas-of-circles#approximating-area"],
      title: t("Approximating the area", "面积的近似值"),
      explanation: t(
        `For a decimal value, use an approximation of $\\pi$ such as $3.14$. The order matters: the formula $\\pi r^2$ squares only $r$, so square the radius first, then multiply by $3.14$.

A circle with radius $6$ cm has area

$$A \\approx 3.14 \\cdot 6^2 = 3.14 \\cdot 36 = 113.04\\text{ cm}^2.$$

As an estimate, $3 \\cdot 36 = 108$: the answer should be a little more than that, and it is.

> **Watch out.** Multiplying $3.14$ by $2r$ gives the circumference, not the area. Square the radius, not the diameter, and square only the radius: $(3.14 \\cdot 6)^2$ squares $\\pi$ as well.`,
        `要得到小数值，用 $\\pi$ 的近似值，例如 $3.14$。顺序很重要：公式 $\\pi r^2$ 只把 $r$ 平方，所以先把半径平方，再乘以 $3.14$。

半径为 $6$ 厘米的圆，面积

$$A \\approx 3.14 \\cdot 6^2 = 3.14 \\cdot 36 = 113.04\\text{ cm}^2.$$

估算一下，$3 \\cdot 36 = 108$：答案应比它稍大，确实如此。

> **注意。** $3.14$ 乘 $2r$ 得到的是周长，不是面积。平方的是半径，不是直径，而且只平方半径：$(3.14 \\cdot 6)^2$ 把 $\\pi$ 也平方了。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const useDiameter = rng.bool(0.3);
        const r = rng.int(2, 20);
        const a = piQ.mul(q(r * r));
        const given = useDiameter
          ? t(`a diameter of $${tex(2 * r, u)}$`, `直径为 $${tex(2 * r, u)}$`)
          : t(`a radius of $${tex(r, u)}$`, `半径为 $${tex(r, u)}$`);
        const first = useDiameter
          ? t(
              `**Step 1: the radius.** The formula squares the radius, half the diameter:${steps(`r = \\frac{${2 * r}}{2} = ${r}`)}`,
              `**第一步：求半径。** 公式要把半径平方，半径是直径的一半：${steps(`r = \\frac{${2 * r}}{2} = ${r}`)}`,
            )
          : t(`**Step 1: the radius.** The radius is given, $r = ${r}$.\n\n`, `**第一步：半径。** 已知半径 $r = ${r}$。\n\n`);
        return {
          ...numberProblem({
            prompt: t(
              `A circle has ${given.en}. Use $3.14$ for $\\pi$ to find its area.`,
              `一个圆的${given["zh-CN"]}。取 $\\pi \\approx 3.14$，求它的面积。`,
            ),
            answer: a,
            form: "decimal",
            unit: `${u}^2`,
            mistakes: [
              why(
                piQ.mul(q(2 * r)),
                "That is the circumference, $2\\pi r$. Area is $\\pi r^2$.",
                "这是周长 $2\\pi r$。面积是 $\\pi r^2$。",
              ),
              why(piQ.mul(q(4 * r * r)), "That squares the diameter. Square the radius instead.", "这是把直径平方了。应该把半径平方。"),
              why(
                piQ.mul(q(r)).mul(piQ.mul(q(r))),
                "You squared $\\pi$ as well. Only the radius is squared.",
                "你把 $\\pi$ 也平方了。只有半径要平方。",
              ),
            ],
            solution: t(
              `${first.en}{{figure 0}}

**Step 2: square the radius.**${steps(`r^2 = ${r}^2 = ${r * r}`)}**Step 3: multiply by $3.14$.**${steps(`A = \\pi r^2 \\approx 3.14 \\cdot ${r * r} = ${tex(dec(a), u, 2)}`)}**Check.** With $\\pi \\approx 3$ the area is about $3 \\cdot ${r * r} = ${3 * r * r}$, and $${dec(a)}$ is a little more, as $3.14$ is a little more than $3$.`,
              `${first["zh-CN"]}{{figure 0}}

**第二步：把半径平方。**${steps(`r^2 = ${r}^2 = ${r * r}`)}**第三步：乘以 $3.14$。**${steps(`A = \\pi r^2 \\approx 3.14 \\cdot ${r * r} = ${tex(dec(a), u, 2)}`)}**检验。** 取 $\\pi \\approx 3$，面积约为 $3 \\cdot ${r * r} = ${3 * r * r}$，而 $${dec(a)}$ 稍大一些，因为 $3.14$ 比 $3$ 稍大。`,
            ),
          }),
          solutionFigures: [
            figure(
              areaMarks(30, len(r, u)),
              `A circle with radius ${r} ${u} shaded, and the dashed square on its radius, of area ${r * r} ${u}².`,
              `半径为 ${r} ${u} 的圆（阴影），以及以半径为边的正方形（虚线），面积 ${r * r} ${u}²。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-area",
      figure: geometryDrawings2["areas-of-circles#radius-from-area"],
      title: t("The radius from the area", "由面积求半径"),
      explanation: t(
        `To go back from the area to the radius, undo the steps of $A = \\pi r^2$ in reverse order. The last step was multiplying by $\\pi$, so divide by $\\pi$ first: that leaves $r^2$. The first step was squaring, so then take the square root, the positive one, since a radius is a length.

A circle with area $81\\pi\\text{ cm}^2$ has

$$r^2 = \\frac{81\\pi}{\\pi} = 81, \\qquad r = \\sqrt{81} = 9\\text{ cm},$$

and its diameter is $2 \\cdot 9 = 18$ cm.

> **Watch out.** The number in front of $\\pi$ is $r^2$, not the radius: take its square root. Halving it does not undo a square. And if the diameter is asked for, double the radius at the end, after the square root.`,
        `由面积倒推半径，要按相反的顺序撤销 $A = \\pi r^2$ 的步骤。最后一步是乘以 $\\pi$，所以先除以 $\\pi$，得到 $r^2$；第一步是平方，所以再开平方，取正的平方根，因为半径是长度。

面积为 $81\\pi\\text{ cm}^2$ 的圆，

$$r^2 = \\frac{81\\pi}{\\pi} = 81, \\qquad r = \\sqrt{81} = 9\\text{ cm},$$

它的直径是 $2 \\cdot 9 = 18$ 厘米。

> **注意。** $\\pi$ 前面的数是 $r^2$，不是半径：要开平方。除以 $2$ 撤销不了平方。若问直径，最后开完平方再乘以 $2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 25);
        const askRadius = rng.bool(0.6);
        const last = askRadius
          ? t(`The radius is $${tex(r, u)}$.`, `半径是 $${tex(r, u)}$。`)
          : t(
              `**Step 3: double for the diameter.** The diameter is two radii:${steps(`d = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}`,
              `**第三步：乘以 $2$ 得直径。** 直径是两条半径：${steps(`d = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}`,
            );
        return {
          ...numberProblem({
            prompt: t(
              `A circle has an area of $${tex(piTex(r * r), u, 2)}$. Find its ${askRadius ? "radius" : "diameter"}.`,
              `一个圆的面积是 $${tex(piTex(r * r), u, 2)}$。求它的${askRadius ? "半径" : "直径"}。`,
            ),
            answer: askRadius ? r : 2 * r,
            unit: u,
            mistakes: askRadius
              ? [
                  why(r * r, "That is $r^2$. Take the square root to get the radius.", "这是 $r^2$，还要开平方才是半径。"),
                  why(
                    q(r * r, 2),
                    "You halved $r^2$. To undo a square, take the square root.",
                    "你把 $r^2$ 除以了 $2$。要撤销平方，应该开平方。",
                  ),
                  why(2 * r, "That is the diameter. The question asks for the radius.", "这是直径，题目问的是半径。"),
                ]
              : [
                  why(r, "That is the radius. The diameter is twice the radius.", "这是半径。直径是半径的两倍。"),
                  why(r * r, "That is $r^2$. Take the square root, then double.", "这是 $r^2$。先开平方，再乘 $2$。"),
                  why(
                    2 * r * r,
                    "You doubled $r^2$. Take the square root first, then double.",
                    "你把 $r^2$ 乘了 $2$。应先开平方，再乘 $2$。",
                  ),
                ],
            solution: t(
              `**Step 1: divide by $\\pi$.** The area is $\\pi r^2$, so dividing it by $\\pi$ leaves the square of the radius:${steps(`r^2 = \\frac{${piTex(r * r)}}{\\pi} = ${r * r}`)}**Step 2: take the square root.** A radius is a length, so it is the positive root:${steps(`r = \\sqrt{${r * r}} = ${r}`)}${last.en}

{{figure 0}}

**Check.** Put the radius back into the formula: $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$, the given area.`,
              `**第一步：除以 $\\pi$。** 面积是 $\\pi r^2$，除以 $\\pi$ 就剩下半径的平方：${steps(`r^2 = \\frac{${piTex(r * r)}}{\\pi} = ${r * r}`)}**第二步：开平方。** 半径是长度，取正的平方根：${steps(`r = \\sqrt{${r * r}} = ${r}`)}${last["zh-CN"]}

{{figure 0}}

**检验。** 把半径代回公式：$\\pi \\cdot ${r}^2 = ${piTex(r * r)}$，正是已知的面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              askRadius ? areaMarks(30, len(r, u)) : [diskShade(R, "action"), ...twoRadii(90, len(r, u), len(2 * r, u), "result")],
              askRadius
                ? `A circle of area ${r * r}π ${u}² and its radius of ${r} ${u}, with the dashed square of area ${r * r} ${u}² on it.`
                : `A circle of area ${r * r}π ${u}²: its radius is ${r} ${u} and its diameter ${2 * r} ${u}.`,
              askRadius
                ? `面积为 ${r * r}π ${u}² 的圆及其半径 ${r} ${u}，虚线是以半径为边、面积 ${r * r} ${u}² 的正方形。`
                : `面积为 ${r * r}π ${u}² 的圆：半径 ${r} ${u}，直径 ${2 * r} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-and-circumference",
      figure: geometryDrawings2["areas-of-circles#area-and-circumference"],
      title: t("From circumference to area and back", "周长与面积互求"),
      explanation: t(
        `The circumference and the area are both worked out from the radius, so to go from one to the other, pass through the radius: undo one formula to find $r$, then use the other.

A circle with circumference $12\\pi$ m has $2\\pi r = 12\\pi$, so $r = 6$ m, and its area is $\\pi \\cdot 6^2 = 36\\pi\\text{ m}^2$. A circle with area $100\\pi\\text{ m}^2$ has $r^2 = 100$, so $r = 10$ m, and its circumference is $2\\pi \\cdot 10 = 20\\pi$ m.

The cut-up circle of the introduction gives a second link: the area is half the circumference times the radius, $A = \\frac{1}{2} C r$. For the first circle, $\\frac{1}{2} \\cdot 12\\pi \\cdot 6 = 36\\pi$.

> **Watch out.** The number in front of $\\pi$ in a circumference is $2r$, and in an area it is $r^2$: it is not the radius in either. Squaring the whole coefficient of a circumference, $(12)^2\\pi$, squares the diameter and gives four times the area.`,
        `周长和面积都由半径算出，所以两者互求时要经过半径：先撤销一个公式求出 $r$，再用另一个公式。

周长为 $12\\pi$ 米的圆，$2\\pi r = 12\\pi$，所以 $r = 6$ 米，面积是 $\\pi \\cdot 6^2 = 36\\pi\\text{ m}^2$。面积为 $100\\pi\\text{ m}^2$ 的圆，$r^2 = 100$，所以 $r = 10$ 米，周长是 $2\\pi \\cdot 10 = 20\\pi$ 米。

引言中切开的圆还给出另一个联系：面积等于半个周长乘半径，$A = \\frac{1}{2} C r$。对第一个圆，$\\frac{1}{2} \\cdot 12\\pi \\cdot 6 = 36\\pi$。

> **注意。** 周长中 $\\pi$ 前面的数是 $2r$，面积中 $\\pi$ 前面的数是 $r^2$：两者都不是半径。把周长的系数整个平方，$(12)^2\\pi$，等于把直径平方，得到的是面积的四倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 20);
        const fig = figure(
          [
            diskShade(R, "result"),
            circleAt(R, O, "action"),
            ...center("O", "w"),
            seg(O, on(30), true),
            { kind: "side", a: on(30), b: O, text: len(r, u) },
          ],
          `A circle of radius ${r} ${u}: circumference ${2 * r}π ${u}, area ${r * r}π ${u}².`,
          `半径为 ${r} ${u} 的圆：周长 ${2 * r}π ${u}，面积 ${r * r}π ${u}²。`,
        );
        const check = t(
          `**Check.** The area is half the circumference times the radius: $\\frac{1}{2} \\cdot ${piTex(2 * r)} \\cdot ${r} = ${piTex(r * r)}$, which matches.`,
          `**检验。** 面积等于半个周长乘半径：$\\frac{1}{2} \\cdot ${piTex(2 * r)} \\cdot ${r} = ${piTex(r * r)}$，一致。`,
        );
        if (rng.bool()) {
          return {
            ...piProblem({
              prompt: t(
                `A circle has a circumference of $${tex(piTex(2 * r), u)}$. Find its area.${PI_EN}`,
                `一个圆的周长是 $${tex(piTex(2 * r), u)}$。求它的面积。${PI_ZH}`,
              ),
              answer: piTex(r * r),
              unit: `${u}^2`,
              wrong: [piTex(4 * r * r), piTex(2 * r), piTex(r)],
              solution: t(
                `**Step 1: the radius from the circumference.** The circumference is $2\\pi r$:${steps(`2\\pi r = ${piTex(2 * r)}`, `r = \\frac{${2 * r}}{2} = ${r}`)}**Step 2: the area from the radius.**${steps(`A = \\pi r^2 = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}{{figure 0}}

${check.en}`,
                `**第一步：由周长求半径。** 周长是 $2\\pi r$：${steps(`2\\pi r = ${piTex(2 * r)}`, `r = \\frac{${2 * r}}{2} = ${r}`)}**第二步：由半径求面积。**${steps(`A = \\pi r^2 = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}{{figure 0}}

${check["zh-CN"]}`,
              ),
            }),
            solutionFigures: [fig],
          };
        }
        return {
          ...piProblem({
            prompt: t(
              `A circle has an area of $${tex(piTex(r * r), u, 2)}$. Find its circumference.${PI_EN}`,
              `一个圆的面积是 $${tex(piTex(r * r), u, 2)}$。求它的周长。${PI_ZH}`,
            ),
            answer: piTex(2 * r),
            unit: u,
            wrong: [piTex(r), piTex(2 * r * r), piTex(4 * r)],
            solution: t(
              `**Step 1: the radius from the area.** The area is $\\pi r^2$:${steps(`\\pi r^2 = ${piTex(r * r)}`, `r^2 = ${r * r}`, `r = \\sqrt{${r * r}} = ${r}`)}**Step 2: the circumference from the radius.**${steps(`C = 2\\pi r = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}{{figure 0}}

${check.en}`,
              `**第一步：由面积求半径。** 面积是 $\\pi r^2$：${steps(`\\pi r^2 = ${piTex(r * r)}`, `r^2 = ${r * r}`, `r = \\sqrt{${r * r}} = ${r}`)}**第二步：由半径求周长。**${steps(`C = 2\\pi r = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}{{figure 0}}

${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [fig],
        };
      },
    },
  ],
};

/** centralFigure draws circle O with radii OA and OB, the central angle AOB of theta degrees from s, and a point C on the major arc. */
function centralFigure(s: number, theta: number, angleText: string | undefined, extra: readonly Mark[] = []): Mark[] {
  const [a, b] = [on(s), on(s + theta)];
  return [
    circleAt(),
    ...center("O", dirOf(s + theta / 2 + 180)),
    seg(O, a),
    seg(O, b),
    angleAt(O, a, b, angleText),
    ...pointsAt([
      [s, "A"],
      [s + theta, "B"],
      [s + theta + (360 - theta) / 2, "C"],
    ]),
    ...extra,
  ];
}

export const centralAnglesAndArcs: TopicDef = {
  id: "central-angles-and-arcs",
  title: t("Central Angles and Arcs", "圆心角与弧"),
  summary: t(
    "Use the fact that an arc has the measure of its central angle, add adjacent arcs, and solve for unknowns.",
    "利用弧的度数等于它所对的圆心角，把相邻的弧相加，并求未知数。",
  ),
  prerequisites: ["arcs-segments-and-sectors-of-circles", "two-step-equations", "combining-like-terms"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.2 },
    { topic: "combining-like-terms", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.C.A.2"],
  intro: t(
    `An arc is measured in degrees, like an angle, and the angle that measures it sits at the center. Cut a round pizza into $8$ equal slices by cuts through the center. The cuts turn once around the center, $360^\\circ$, in $8$ equal steps, so each slice has an angle of $\\frac{360^\\circ}{8} = 45^\\circ$ at the center, and its piece of crust is an arc of $45^\\circ$.

{{figure 0}}

Three slices side by side have a crust of $45^\\circ + 45^\\circ + 45^\\circ = 135^\\circ$, and the other five slices have the rest of the crust, $360^\\circ - 135^\\circ = 225^\\circ$. An angle with its vertex at the center is a **central angle**, and an arc has the measure of its central angle. In this lesson we use that to find arcs from angles and angles from arcs, to add neighboring arcs, and to solve for an unknown when the angles are written with a variable.`,
    `弧和角一样用度来度量，度量它的角的顶点在圆心。用经过圆心的刀把圆形比萨切成 $8$ 块相等的小块。这些刀口绕圆心一整圈 $360^\\circ$，分成 $8$ 个相等的部分，所以每块在圆心处的角是 $\\frac{360^\\circ}{8} = 45^\\circ$，它的那段饼边是 $45^\\circ$ 的弧。

{{figure 0}}

相邻的三块饼边合起来是 $45^\\circ + 45^\\circ + 45^\\circ = 135^\\circ$，另外五块是其余的饼边，$360^\\circ - 135^\\circ = 225^\\circ$。顶点在圆心的角叫**圆心角**，弧的度数等于它所对的圆心角。这节课我们用这一点由角求弧、由弧求角，把相邻的弧相加，并在角用含变量的式子表示时求出未知数。`,
  ),
  introFigures: [
    figure(
      [
        sectorShade(0, 135, "result"),
        circleAt(),
        ...Array.from({ length: 8 }, (_, i) => seg(O, on(i * 45))),
        angleAt(O, on(0), on(45), "45°"),
        ...arcIn(0, 135, "result"),
        arcText(0, 135, "135°"),
      ],
      "A pizza cut into 8 slices of 45° at the center; three neighboring slices have a crust of 135°.",
      "切成 8 块的比萨，每块圆心角 45°；相邻三块的饼边是 135°。",
    ),
  ],
  knowledgePoints: [
    {
      id: "central-angles",
      figure: partsDrawings["central-angles"],
      title: t("Central angles", "圆心角"),
      explanation: t(
        `A **central angle** has its vertex at the center of the circle and its sides along two radii. The measure of a minor arc is defined as the measure of its central angle:

$$m${arcTex("AB")} = \\angle AOB.$$

This is the natural choice: doubling the angle doubles the arc it cuts off, and the full turn of $360^\\circ$ gives the whole circle. The major arc between the same points is the rest of the circle, so it measures $360^\\circ$ minus that. If $\\angle AOB = 64^\\circ$, then $m${arcTex("AB")} = 64^\\circ$ and $m${arcTex("ACB")} = 360^\\circ - 64^\\circ = 296^\\circ$.

> **Watch out.** The central angle measures the minor arc, the one inside the angle. The major arc is $360^\\circ$ minus it, not $180^\\circ$ minus it, and not twice it.`,
        `顶点在圆心、两边沿着两条半径的角叫**圆心角**。劣弧的度数定义为它所对圆心角的度数：

$$m${arcTex("AB")} = \\angle AOB.$$

这样定义很自然：角加倍，截出的弧也加倍；整整一圈 $360^\\circ$ 对应整个圆。同两点之间的优弧是圆的其余部分，所以它的度数是 $360^\\circ$ 减去圆心角。若 $\\angle AOB = 64^\\circ$，则 $m${arcTex("AB")} = 64^\\circ$，$m${arcTex("ACB")} = 360^\\circ - 64^\\circ = 296^\\circ$。

> **注意。** 圆心角度量的是劣弧，也就是角内部的那段弧。优弧是 $360^\\circ$ 减去它，不是 $180^\\circ$ 减去它，也不是它的两倍。`,
      ),
      generate(rng) {
        const theta = rng.int(20, 170);
        const s = rng.int(0, 359);
        const M = 360 - theta;
        const arcs = (minorTone: Tone | "accent", majorTone: Tone | "accent"): Mark[] => [
          ...(minorTone === "accent" ? arcAt(s, s + theta) : arcIn(s, s + theta, minorTone)),
          ...(majorTone === "accent" ? arcAt(s + theta, s + 360) : arcIn(s + theta, s + 360, majorTone)),
          arcText(s, s + theta, deg(theta)),
          arcText(s + theta, s + 360, deg(M)),
        ];
        if (rng.bool(0.6)) {
          return {
            ...numberProblem({
              prompt: t(`Find the measure of major arc $${arcTex("ACB")}$.`, `求优弧 $${arcTex("ACB")}$ 的度数。`),
              answer: M,
              unit: "°",
              wrong: [theta, 180 - theta, 2 * theta],
              solution: t(
                `**Step 1: the minor arc.** $\\angle AOB$ has its vertex at the center, so it is a central angle, and minor arc $${arcTex("AB")}$, inside it, has its measure: $m${arcTex("AB")} = ${theta}^\\circ$.

**Step 2: the major arc.** Major arc $${arcTex("ACB")}$ is the rest of the circle:${steps(`m${arcTex("ACB")} = 360^\\circ - ${theta}^\\circ = ${M}^\\circ`)}{{figure 0}}

**Check.** The two arcs make the whole circle, $${theta}^\\circ + ${M}^\\circ = 360^\\circ$, and the major arc is more than $180^\\circ$, as it must be.`,
                `**第一步：劣弧。** $\\angle AOB$ 的顶点在圆心，是圆心角，它内部的劣弧 $${arcTex("AB")}$ 的度数等于它：$m${arcTex("AB")} = ${theta}^\\circ$。

**第二步：优弧。** 优弧 $${arcTex("ACB")}$ 是圆的其余部分：${steps(`m${arcTex("ACB")} = 360^\\circ - ${theta}^\\circ = ${M}^\\circ`)}{{figure 0}}

**检验。** 两段弧合起来是整个圆，$${theta}^\\circ + ${M}^\\circ = 360^\\circ$；优弧大于 $180^\\circ$，符合要求。`,
              ),
            }),
            figure: figure(
              centralFigure(s, theta, deg(theta)),
              `Circle O with central angle AOB of ${theta}° and a point C on the major arc.`,
              `圆 O，圆心角 AOB 为 ${theta}°，点 C 在优弧上。`,
            ),
            solutionFigures: [
              figure(
                centralFigure(s, theta, deg(theta), arcs("accent", "result")),
                `The central angle AOB of ${theta}° cuts off minor arc AB of ${theta}°; major arc ACB is the rest, ${M}°.`,
                `圆心角 AOB 为 ${theta}°，所对劣弧 AB 为 ${theta}°；优弧 ACB 是其余部分，${M}°。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `Major arc $${arcTex("ACB")}$ measures $${M}^\\circ$. Find $\\angle AOB$.`,
              `优弧 $${arcTex("ACB")}$ 的度数是 $${M}^\\circ$。求 $\\angle AOB$。`,
            ),
            answer: theta,
            unit: "°",
            wrong: [M, M - 180, q(M, 2)],
            solution: t(
              `**Step 1: the minor arc.** Minor arc $${arcTex("AB")}$ is the rest of the circle:${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${theta}^\\circ`)}**Step 2: the central angle.** $\\angle AOB$ is the central angle on minor arc $${arcTex("AB")}$, so it has the arc's measure: $\\angle AOB = ${theta}^\\circ$.

{{figure 0}}

**Check.** The two arcs make the whole circle, $${theta}^\\circ + ${M}^\\circ = 360^\\circ$. And the angle between radii $OA$ and $OB$ opens toward the minor arc, so it is less than $180^\\circ$, as $${theta}^\\circ$ is.`,
              `**第一步：劣弧。** 劣弧 $${arcTex("AB")}$ 是圆的其余部分：${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${theta}^\\circ`)}**第二步：圆心角。** $\\angle AOB$ 是劣弧 $${arcTex("AB")}$ 所对的圆心角，度数等于这段弧：$\\angle AOB = ${theta}^\\circ$。

{{figure 0}}

**检验。** 两段弧合起来是整个圆，$${theta}^\\circ + ${M}^\\circ = 360^\\circ$。半径 $OA$、$OB$ 之间的角朝向劣弧张开，应小于 $180^\\circ$，$${theta}^\\circ$ 确实如此。`,
            ),
          }),
          figure: figure(
            centralFigure(s, theta, undefined),
            "Circle O with radii OA and OB and a point C on the major arc.",
            "圆 O，画有半径 OA、OB，点 C 在优弧上。",
          ),
          solutionFigures: [
            figure(
              centralFigure(s, theta, deg(theta), arcs("result", "accent")),
              `Major arc ACB of ${M}° leaves minor arc AB of ${theta}°, and the central angle AOB on it is ${theta}°.`,
              `优弧 ACB 为 ${M}°，剩下的劣弧 AB 为 ${theta}°，它所对的圆心角 AOB 是 ${theta}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "adding-arcs",
      figure: partsDrawings["adding-arcs"],
      title: t("Adding arcs", "弧的加法"),
      explanation: t(
        `Adjacent arcs add like adjacent angles. If $B$ is on arc $${arcTex("ABC")}$, the arc is made of the two pieces $${arcTex("AB")}$ and $${arcTex("BC")}$, which meet at $B$ and do not overlap, so

$$m${arcTex("ABC")} = m${arcTex("AB")} + m${arcTex("BC")}.$$

Each piece has the measure of its central angle, and the central angles all the way around the center add to $360^\\circ$. If radii $OA$, $OB$, $OC$ make $\\angle AOB = 85^\\circ$ and $\\angle BOC = 125^\\circ$, then $m${arcTex("ABC")} = 85^\\circ + 125^\\circ = 210^\\circ$, and the remaining arc $${arcTex("CA")}$ measures $360^\\circ - 210^\\circ = 150^\\circ$.

> **Watch out.** Add the pieces of an arc; do not subtract one from the other. And the arc $${arcTex("CA")}$ that does not contain $B$ is what is left of $360^\\circ$, not of $180^\\circ$.`,
        `相邻的弧像相邻的角一样相加。若 $B$ 在弧 $${arcTex("ABC")}$ 上，这段弧由在 $B$ 处相接、互不重叠的两段 $${arcTex("AB")}$ 和 $${arcTex("BC")}$ 组成，所以

$$m${arcTex("ABC")} = m${arcTex("AB")} + m${arcTex("BC")}.$$

每一段的度数等于它的圆心角，而绕圆心一周的圆心角之和是 $360^\\circ$。若半径 $OA$、$OB$、$OC$ 构成 $\\angle AOB = 85^\\circ$、$\\angle BOC = 125^\\circ$，则 $m${arcTex("ABC")} = 85^\\circ + 125^\\circ = 210^\\circ$，剩下的弧 $${arcTex("CA")}$ 是 $360^\\circ - 210^\\circ = 150^\\circ$。

> **注意。** 弧的各段要相加，不要相减。不含 $B$ 的弧 $${arcTex("CA")}$ 是从 $360^\\circ$ 中剩下的部分，不是从 $180^\\circ$ 中剩下的。`,
      ),
      generate(rng) {
        const a = rng.int(40, 150);
        const b = rng.int(40, Math.min(150, 300 - a));
        const c = 360 - a - b;
        const s = rng.int(0, 359);
        const [pa, pb, pc] = [on(s), on(s + a), on(s + a + b)];
        const marks = (extra: readonly Mark[]): Mark[] => [
          circleAt(),
          { kind: "dot", at: O },
          ...extra,
          seg(O, pa),
          seg(O, pb),
          seg(O, pc),
          angleAt(O, pa, pb, deg(a)),
          angleAt(O, pb, pc, deg(b)),
          ...pointsAt([
            [s, "A"],
            [s + a, "B"],
            [s + a + b, "C"],
          ]),
        ];
        const fig = figure(
          marks([]),
          `Circle O with radii OA, OB and OC; angle AOB is ${a}° and angle BOC is ${b}°.`,
          `圆 O，半径 OA、OB、OC；角 AOB 为 ${a}°，角 BOC 为 ${b}°。`,
        );
        const pieces = t(
          `**Step 1: each arc from its central angle.** An arc has the measure of its central angle, so $m${arcTex("AB")} = ${a}^\\circ$ and $m${arcTex("BC")} = ${b}^\\circ$.`,
          `**第一步：由圆心角得各段弧。** 弧的度数等于它的圆心角，所以 $m${arcTex("AB")} = ${a}^\\circ$，$m${arcTex("BC")} = ${b}^\\circ$。`,
        );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(`Find the measure of arc $${arcTex("ABC")}$.`, `求弧 $${arcTex("ABC")}$ 的度数。`),
              answer: a + b,
              unit: "°",
              wrong: [Math.abs(a - b), c, 360 - a],
              solution: t(
                `${pieces.en}

**Step 2: add the pieces.** Arc $${arcTex("ABC")}$ runs from $A$ through $B$ to $C$, so it is made of these two arcs, meeting at $B$:${steps(`m${arcTex("ABC")} = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}{{figure 0}}

**Check.** The third arc, $${arcTex("CA")}$, has the central angle $360^\\circ - ${a + b}^\\circ = ${c}^\\circ$, and $${a + b}^\\circ + ${c}^\\circ = 360^\\circ$ completes the circle. And the whole arc is larger than each of its pieces.`,
                `${pieces["zh-CN"]}

**第二步：各段相加。** 弧 $${arcTex("ABC")}$ 从 $A$ 经过 $B$ 到 $C$，由这两段在 $B$ 处相接的弧组成：${steps(`m${arcTex("ABC")} = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}{{figure 0}}

**检验。** 第三段弧 $${arcTex("CA")}$ 的圆心角是 $360^\\circ - ${a + b}^\\circ = ${c}^\\circ$，$${a + b}^\\circ + ${c}^\\circ = 360^\\circ$，正好一整圈。整段弧也比它的每一段都大。`,
              ),
            }),
            figure: fig,
            solutionFigures: [
              figure(
                marks([...arcIn(s, s + a + b, "result"), arcText(s, s + a + b, deg(a + b))]),
                `Arcs AB of ${a}° and BC of ${b}° together make arc ABC of ${a + b}°.`,
                `弧 AB（${a}°）与弧 BC（${b}°）合成弧 ABC（${a + b}°）。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `Find the measure of arc $${arcTex("CA")}$ that does not contain $B$.`,
              `求不含点 $B$ 的弧 $${arcTex("CA")}$ 的度数。`,
            ),
            answer: c,
            unit: "°",
            wrong: [a + b, 180 - a - b, 360 - a],
            solution: t(
              `${pieces.en}

**Step 2: the rest of the circle.** Arcs $${arcTex("AB")}$, $${arcTex("BC")}$ and $${arcTex("CA")}$ go once around the circle, so their measures add to $360^\\circ$:${steps(`m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}{{figure 0}}

**Check.** Add the three arcs: $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 360^\\circ$, the full circle.`,
              `${pieces["zh-CN"]}

**第二步：圆的其余部分。** 弧 $${arcTex("AB")}$、$${arcTex("BC")}$、$${arcTex("CA")}$ 正好绕圆一周，度数之和是 $360^\\circ$：${steps(`m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}{{figure 0}}

**检验。** 三段弧相加：$${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 360^\\circ$，正是整个圆。`,
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              marks([...arcIn(s + a + b, s + 360, "result"), arcText(s + a + b, s + 360, deg(c))]),
              `The arc CA that does not contain B is the rest of the circle: ${c}°.`,
              `不含 B 的弧 CA 是圆的其余部分：${c}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "central-angles-with-algebra",
      figure: partsDrawings["central-angles-with-algebra"],
      title: t("Central angles with algebra", "含未知数的圆心角"),
      explanation: t(
        `Radii that split a circle make central angles that fill the turn around the center, so their measures add to $360^\\circ$. When the angles are written with a variable, that fact is an equation.

If three radii split a circle into central angles $(3x + 15)^\\circ$, $(2x)^\\circ$ and $(4x - 15)^\\circ$, then

$$(3x + 15) + 2x + (4x - 15) = 360.$$

Combine like terms: $9x = 360$, so $x = 40$. The angles are $135^\\circ$, $80^\\circ$ and $145^\\circ$, which do add to $360^\\circ$.

> **Watch out.** Angles all the way around a point add to $360^\\circ$, not $180^\\circ$, which is the sum on one side of a straight line. When you move the constant term across, change its sign. And the question asks for $x$, not for one of the angles.`,
        `把圆分开的半径构成的圆心角正好填满绕圆心的一整圈，所以它们的度数之和是 $360^\\circ$。当角用含变量的式子表示时，这个事实就是一个方程。

若三条半径把圆分成圆心角 $(3x + 15)^\\circ$、$(2x)^\\circ$、$(4x - 15)^\\circ$，则

$$(3x + 15) + 2x + (4x - 15) = 360.$$

合并同类项：$9x = 360$，所以 $x = 40$。三个角是 $135^\\circ$、$80^\\circ$、$145^\\circ$，相加确实是 $360^\\circ$。

> **注意。** 绕一点一周的角之和是 $360^\\circ$，不是 $180^\\circ$，后者是直线一侧的角之和。把常数项移到另一边时要变号。题目问的是 $x$，不是某个角。`,
      ),
      keyPrerequisites: ["two-step-equations", "combining-like-terms"],
      generate(rng) {
        const x = rng.int(5, 25);
        const a1 = rng.int(60, 150);
        const a2 = rng.int(60, Math.min(150, 300 - a1));
        const a3 = 360 - a1 - a2;
        const [c1, d1] = expressionFor(rng, a1, x);
        const [c2, d2] = expressionFor(rng, a2, x);
        const [c3, d3] = expressionFor(rng, a3, x);
        const C = c1 + c2 + c3;
        const D = d1 + d2 + d3;
        const s = rng.int(0, 359);
        const [p1, p2, p3] = [on(s), on(s + a1), on(s + a1 + a2)];
        const marks = (labels: readonly [string, string, string], tone?: Tone): Mark[] => [
          circleAt(),
          { kind: "dot", at: O },
          seg(O, p1),
          seg(O, p2),
          seg(O, p3),
          centralAngle(s, a1, labels[0], tone),
          centralAngle(s + a1, a2, labels[1], tone),
          centralAngle(s + a1 + a2, a3, labels[2], tone),
        ];
        const move =
          D === 0
            ? t(`The constant terms cancel, so the equation is already $${C}x = 360$.`, `常数项正好抵消，方程已经是 $${C}x = 360$。`)
            : D > 0
              ? t(
                  `Subtract $${D}$ from both sides:${steps(`${C}x = 360 - ${D} = ${360 - D}`)}`,
                  `两边同时减去 $${D}$：${steps(`${C}x = 360 - ${D} = ${360 - D}`)}`,
                )
              : t(
                  `Add $${-D}$ to both sides:${steps(`${C}x = 360 + ${-D} = ${360 - D}`)}`,
                  `两边同时加上 $${-D}$：${steps(`${C}x = 360 + ${-D} = ${360 - D}`)}`,
                );
        const sub = (c: number, d: number, a: number) =>
          `${c === 1 ? "" : `${c} \\cdot `}${x}${d === 0 ? "" : d > 0 ? ` + ${d}` : ` - ${-d}`} = ${a}`;
        return {
          ...numberProblem({
            prompt: t(
              "Three radii divide circle $O$ into the central angles shown. Find $x$.",
              "三条半径把圆 $O$ 分成如图所示的圆心角。求 $x$。",
            ),
            answer: x,
            solveFor: "x",
            wrong: [q(180 - D, C), q(360 + D, C), a1],
            solution: t(
              `**Step 1: write the equation.** The three central angles fill the whole turn around $O$, so they add to $360^\\circ$:${steps(`${angleTex(c1, d1)} + ${angleTex(c2, d2)} + ${angleTex(c3, d3)} = 360^\\circ`)}**Step 2: combine like terms.** The coefficients of $x$ add to $${c1} + ${c2} + ${c3} = ${C}$, and the constant terms to $${D}$:${steps(`${linear(C, D)} = 360`)}**Step 3: solve.** ${move.en}${D === 0 ? "\n\n" : ""}Divide by $${C}$:${steps(`x = \\frac{${360 - D}}{${C}} = ${x}`)}**Check.** Put $x = ${x}$ into each angle: $${sub(c1, d1, a1)}$, $${sub(c2, d2, a2)}$ and $${sub(c3, d3, a3)}$. They add to $${a1} + ${a2} + ${a3} = 360$, and each is positive, as an angle must be.

{{figure 0}}`,
              `**第一步：列方程。** 三个圆心角填满绕 $O$ 的一整圈，和是 $360^\\circ$：${steps(`${angleTex(c1, d1)} + ${angleTex(c2, d2)} + ${angleTex(c3, d3)} = 360^\\circ`)}**第二步：合并同类项。** $x$ 的系数之和是 $${c1} + ${c2} + ${c3} = ${C}$，常数项之和是 $${D}$：${steps(`${linear(C, D)} = 360`)}**第三步：解方程。** ${move["zh-CN"]}${D === 0 ? "\n\n" : ""}两边除以 $${C}$：${steps(`x = \\frac{${360 - D}}{${C}} = ${x}`)}**检验。** 把 $x = ${x}$ 代入每个角：$${sub(c1, d1, a1)}$，$${sub(c2, d2, a2)}$，$${sub(c3, d3, a3)}$。它们的和是 $${a1} + ${a2} + ${a3} = 360$，而且每个角都是正的，角正应如此。

{{figure 0}}`,
            ),
          }),
          figure: figure(
            marks([angleLabel(c1, d1), angleLabel(c2, d2), angleLabel(c3, d3)]),
            `Circle O split by three radii into angles ${angleLabel(c1, d1)}, ${angleLabel(c2, d2)} and ${angleLabel(c3, d3)}.`,
            `圆 O 被三条半径分成 ${angleLabel(c1, d1)}、${angleLabel(c2, d2)}、${angleLabel(c3, d3)} 三个角。`,
          ),
          solutionFigures: [
            figure(
              marks([deg(a1), deg(a2), deg(a3)], "result"),
              `With x = ${x}, the three central angles are ${a1}°, ${a2}° and ${a3}°, which fill the circle.`,
              `x = ${x} 时，三个圆心角是 ${a1}°、${a2}°、${a3}°，正好填满一圈。`,
            ),
          ],
        };
      },
    },
  ],
};

/** sectorFigure draws circle O with the sector AOB of theta degrees from s highlighted (the major one when major), the minor angle labeled, and radius OA labeled. */
function sectorFigure(s: number, theta: number, angleText: string | undefined, radiusText: string | undefined, major = false): Mark[] {
  const [a, b] = [on(s), on(s + theta)];
  const pts = major ? arcPoints(s + theta, s + 360) : arcPoints(s, s + theta);
  return [
    circleAt(),
    { kind: "polygon", points: [O, ...pts], accent: true },
    ...center("O", dirOf(s + theta / 2 + 180)),
    angleAt(O, a, b, angleText),
    ...(radiusText ? [{ kind: "side", a: O, b: a, text: radiusText } as const] : []),
    ...pointsAt([
      [s, "A"],
      [s + theta, "B"],
    ]),
  ];
}

const minorAngles = [20, 30, 36, 40, 45, 60, 72, 80, 90, 100, 108, 120, 135, 140, 144, 150, 160] as const;

export const calculatingArcLengthsOfCircularSectors: TopicDef = {
  id: "calculating-arc-lengths-of-circular-sectors",
  title: t("Calculating Arc Lengths of Circular Sectors", "计算扇形的弧长"),
  summary: t(
    "Find the length of an arc as a fraction of the circumference, and find the radius or the angle from the arc length.",
    "把弧长看作周长的一部分来计算，并由弧长求半径或圆心角。",
  ),
  prerequisites: ["central-angles-and-arcs", "the-circumference-of-a-circle", "multiplying-fractions"],
  encompasses: [
    { topic: "the-circumference-of-a-circle", weight: 0.5 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  intro: t(
    `An arc's measure in degrees says how far it turns around the center; its **length** says how far you walk along it. The two are linked by the circumference.

A path curves around a pond along a quarter of a circle of radius $10$ m, from $A$ to $B$:

{{figure 0}}

The central angle is $90^\\circ$, and $90^\\circ$ is $\\frac{90}{360} = \\frac{1}{4}$ of a full turn, so the path is a quarter of the whole circle. The whole circle is $2\\pi \\cdot 10 = 20\\pi$ m around, so the path is

$$\\frac{1}{4} \\cdot 20\\pi = 5\\pi \\approx 15.7\\text{ m}.$$

That is the idea of the whole lesson: an arc of $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of the circle, so its length is that fraction of the circumference. We use it to find arc lengths, the lengths of major arcs, and, working backward, the radius or the angle.`,
    `弧的度数说明它绕圆心转了多少，弧的**长度**说明沿着它要走多远。两者通过周长联系起来。

一条小路沿半径 $10$ 米的圆的四分之一绕过池塘，从 $A$ 到 $B$：

{{figure 0}}

圆心角是 $90^\\circ$，而 $90^\\circ$ 是一整圈的 $\\frac{90}{360} = \\frac{1}{4}$，所以这条路是整个圆的四分之一。整个圆的周长是 $2\\pi \\cdot 10 = 20\\pi$ 米，所以这条路长

$$\\frac{1}{4} \\cdot 20\\pi = 5\\pi \\approx 15.7\\text{ m}.$$

这就是整节课的思路：$\\theta^\\circ$ 的弧占整个圆的 $\\frac{\\theta}{360}$，所以它的长度是周长的这一部分。我们用它求弧长、优弧的长，并倒过来求半径或圆心角。`,
  ),
  introFigures: [
    figure(
      sectorMarks(0, 90, { angle: "90°", radius: "10 m", arc: "5π m", shade: "none", arcTone: "result" }),
      "A quarter of a circle of radius 10 m: the arc from A to B, with a central angle of 90°, is 5π m long.",
      "半径 10 m 的圆的四分之一：从 A 到 B 的弧，圆心角 90°，长 5π m。",
    ),
  ],
  knowledgePoints: [
    {
      id: "arc-length",
      figure: partsDrawings["arc-length"],
      title: t("Arc length", "弧长"),
      explanation: t(
        `The whole circle has a central angle of $360^\\circ$ and a length of $2\\pi r$. An arc with central angle $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of the circle: doubling the angle doubles the arc. So its **arc length** is that fraction of the circumference:

$$L = \\frac{\\theta}{360} \\cdot 2\\pi r.$$

In a circle of radius $6$ cm, an arc of $120^\\circ$ is $\\frac{120}{360} = \\frac{1}{3}$ of the circle. The circumference is $2\\pi \\cdot 6 = 12\\pi$ cm, so the arc has length $\\frac{1}{3} \\cdot 12\\pi = 4\\pi$ cm, about $12.6$ cm. Simplifying the fraction first keeps the numbers small.

> **Watch out.** An arc length uses the circumference $2\\pi r$, not the area $\\pi r^2$, and not $\\pi r$, which is only half the circle. Use the angle of the arc you are asked for: the arc inside the central angle, not the rest of the circle.`,
        `整个圆的圆心角是 $360^\\circ$，长度是 $2\\pi r$。圆心角为 $\\theta^\\circ$ 的弧占整个圆的 $\\frac{\\theta}{360}$：角加倍，弧也加倍。所以它的**弧长**是周长的这一部分：

$$L = \\frac{\\theta}{360} \\cdot 2\\pi r.$$

在半径为 $6$ 厘米的圆中，$120^\\circ$ 的弧占整个圆的 $\\frac{120}{360} = \\frac{1}{3}$。周长是 $2\\pi \\cdot 6 = 12\\pi$ 厘米，所以弧长是 $\\frac{1}{3} \\cdot 12\\pi = 4\\pi$ 厘米，约 $12.6$ 厘米。先化简分数可以让数字小一些。

> **注意。** 弧长用的是周长 $2\\pi r$，不是面积 $\\pi r^2$，也不是只有半个圆的 $\\pi r$。要用所问那段弧的角：圆心角内部的那段弧，而不是圆的其余部分。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const L = q(theta * r, 180);
        const f = q(theta, 360);
        const s = rng.int(0, 359);
        return {
          ...piProblem({
            prompt: t(`Find the length of arc $${arcTex("AB")}$.${PI_EN}`, `求弧 $${arcTex("AB")}$ 的长。${PI_ZH}`),
            answer: piTex(L),
            unit: u,
            wrong: [piTex(q(theta * r * r, 360)), piTex(q(theta * r, 360)), piTex(q((360 - theta) * r, 180)), piTex(2 * r)],
            solution: t(
              `**Step 1: the fraction of the circle.** The arc has a central angle of $${theta}^\\circ$, out of $360^\\circ$ for the whole circle:${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**Step 2: the circumference.** The whole circle has length${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**Step 3: take that fraction of it.**${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${tex(piTex(L), u)}`)}{{figure 0}}

**Check.** With $\\pi \\approx 3$, the circumference is about $${6 * r}$, and $${f.toLatex()}$ of it is about $${near(f.toNumber() * 6 * r)}$; the exact $${piTex(L)} \\approx ${piNear(L)}$ is a little more, as it should be.`,
              `**第一步：占圆的几分之几。** 这段弧的圆心角是 $${theta}^\\circ$，整个圆是 $360^\\circ$：${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**第二步：周长。** 整个圆的长度是${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**第三步：取周长的这一部分。**${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${tex(piTex(L), u)}`)}{{figure 0}}

**检验。** 取 $\\pi \\approx 3$，周长约为 $${6 * r}$，它的 $${f.toLatex()}$ 约为 $${near(f.toNumber() * 6 * r)}$；精确值 $${piTex(L)} \\approx ${piNear(L)}$ 稍大一些，正应如此。`,
            ),
          }),
          figure: figure(
            sectorFigure(s, theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
          solutionFigures: [
            figure(
              sectorMarks(s, theta, { angle: deg(theta), radius: len(r, u), shade: "none", arcTone: "result" }),
              `The arc AB is ${theta}/360 of the circle of radius ${r} ${u}.`,
              `弧 AB 是半径 ${r} ${u} 的圆的 ${theta}/360。`,
            ),
          ],
        };
      },
    },
    {
      id: "major-arc-length",
      figure: partsDrawings["major-arc-length"],
      title: t("Length of a major arc", "优弧的长"),
      explanation: t(
        `The major arc from $A$ to $B$ goes the long way around, so its central angle is the rest of the full turn, $360^\\circ - \\theta$, where $\\theta$ is the minor central angle. Use that angle in the arc length formula, or find the minor arc and subtract it from the circumference: the two arcs together are the whole circle.

In a circle of radius $9$ m with $\\angle AOB = 80^\\circ$, the major arc has angle $280^\\circ$, the fraction $\\frac{280}{360} = \\frac{7}{9}$ of the circle, and length $\\frac{7}{9} \\cdot 18\\pi = 14\\pi$ m. The minor arc is $\\frac{2}{9} \\cdot 18\\pi = 4\\pi$ m, and $14\\pi + 4\\pi = 18\\pi$, the circumference.

> **Watch out.** The angle marked in the figure belongs to the minor arc. Using it gives the minor arc, and $180^\\circ - \\theta$ gives neither arc. And the length comes from the circumference $2\\pi r$, not from the area $\\pi r^2$.`,
        `从 $A$ 到 $B$ 的优弧走的是远路，所以它的圆心角是一整圈的其余部分 $360^\\circ - \\theta$，其中 $\\theta$ 是劣弧的圆心角。可以把这个角代入弧长公式，也可以先求劣弧再用周长减去它：两段弧合起来是整个圆。

在半径为 $9$ 米的圆中，若 $\\angle AOB = 80^\\circ$，则优弧的圆心角是 $280^\\circ$，占圆的 $\\frac{280}{360} = \\frac{7}{9}$，长 $\\frac{7}{9} \\cdot 18\\pi = 14\\pi$ 米。劣弧长 $\\frac{2}{9} \\cdot 18\\pi = 4\\pi$ 米，而 $14\\pi + 4\\pi = 18\\pi$，正是周长。

> **注意。** 图中标出的角属于劣弧。用它求出的是劣弧；用 $180^\\circ - \\theta$ 得到的哪段弧都不是。长度来自周长 $2\\pi r$，不是面积 $\\pi r^2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const s = rng.int(0, 359);
        const L = q((360 - theta) * r, 180);
        const f = q(360 - theta, 360);
        const minor = q(theta * r, 180);
        return {
          ...piProblem({
            prompt: t(
              `Find the length of the highlighted major arc from $A$ to $B$.${PI_EN}`,
              `求从 $A$ 到 $B$ 的突出显示的优弧的长。${PI_ZH}`,
            ),
            answer: piTex(L),
            unit: u,
            wrong: [piTex(q(theta * r, 180)), piTex(q((360 - theta) * r * r, 360)), piTex(q((180 - theta) * r, 180))],
            solution: t(
              `**Step 1: the central angle of the major arc.** The marked $${theta}^\\circ$ is the angle of the minor arc. The major arc goes around the rest of the circle:${steps(`360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}**Step 2: the fraction of the circle.**${steps(`\\frac{${360 - theta}}{360} = ${f.toLatex()}`)}**Step 3: that fraction of the circumference.** The circumference is $2\\pi \\cdot ${r} = ${piTex(2 * r)}$:${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${tex(piTex(L), u)}`)}{{figure 0}}

**Check.** The minor arc is $\\frac{${theta}}{360} \\cdot ${piTex(2 * r)} = ${piTex(minor)}$, and the two arcs make the whole circle: $${piTex(L)} + ${piTex(minor)} = ${piTex(2 * r)}$.`,
              `**第一步：优弧的圆心角。** 标出的 $${theta}^\\circ$ 是劣弧的角。优弧绕过圆的其余部分：${steps(`360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}**第二步：占圆的几分之几。**${steps(`\\frac{${360 - theta}}{360} = ${f.toLatex()}`)}**第三步：取周长的这一部分。** 周长是 $2\\pi \\cdot ${r} = ${piTex(2 * r)}$：${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${tex(piTex(L), u)}`)}{{figure 0}}

**检验。** 劣弧长 $\\frac{${theta}}{360} \\cdot ${piTex(2 * r)} = ${piTex(minor)}$，两段弧合起来是整个圆：$${piTex(L)} + ${piTex(minor)} = ${piTex(2 * r)}$。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              ...arcAt(s + theta, s + 360),
              { kind: "dot", at: O },
              seg(O, on(s)),
              seg(O, on(s + theta)),
              angleAt(O, on(s), on(s + theta), deg(theta)),
              { kind: "side", a: O, b: on(s), text: len(r, u) },
              ...pointsAt([
                [s, "A"],
                [s + theta, "B"],
              ]),
            ],
            `A circle with radius ${r} ${u}; angle AOB is ${theta}° and the major arc from A to B is highlighted.`,
            `半径为 ${r} ${u} 的圆；角 AOB 为 ${theta}°，从 A 到 B 的优弧被突出显示。`,
          ),
          solutionFigures: [
            figure(
              [
                ...sectorMarks(s + theta, 360 - theta, { angle: deg(360 - theta), shade: "none", arcTone: "result" }),
                angleAt(O, on(s), on(s + theta), deg(theta)),
                { kind: "side", a: O, b: on(s), text: len(r, u) },
              ],
              `The major arc from A to B has a central angle of ${360 - theta}°, the rest of the circle after ${theta}°.`,
              `从 A 到 B 的优弧圆心角为 ${360 - theta}°，是去掉 ${theta}° 后圆的其余部分。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-or-angle-from-arc-length",
      figure: partsDrawings["radius-or-angle-from-arc-length"],
      title: t("The radius or the angle from the arc length", "由弧长求半径或圆心角"),
      explanation: t(
        `The arc length formula $L = \\frac{\\theta}{360} \\cdot 2\\pi r$ connects three quantities, so knowing two of them gives the third: write the formula with what you know and solve.

If an arc of $40^\\circ$ has length $6\\pi$ cm, then the arc is $\\frac{40}{360} = \\frac{1}{9}$ of the circle, so the whole circumference is $9 \\cdot 6\\pi = 54\\pi$ cm, and $2\\pi r = 54\\pi$ gives $r = 27$ cm.

If an arc of a circle with radius $5$ cm has length $3\\pi$ cm, compare it with the circumference $10\\pi$ cm: the arc is $\\frac{3\\pi}{10\\pi} = \\frac{3}{10}$ of the circle, so its angle is $\\frac{3}{10} \\cdot 360^\\circ = 108^\\circ$.

> **Watch out.** Solving for the radius, stop at $r$: twice it is the diameter, half it is nothing. Solving for the angle, the arc is a fraction of $360^\\circ$; it is not the rest of the circle, and not twice or half of that fraction.`,
        `弧长公式 $L = \\frac{\\theta}{360} \\cdot 2\\pi r$ 联系着三个量，知道其中两个就能求出第三个：把已知的量代入公式再求解。

若 $40^\\circ$ 的弧长为 $6\\pi$ 厘米，这段弧占圆的 $\\frac{40}{360} = \\frac{1}{9}$，所以整个周长是 $9 \\cdot 6\\pi = 54\\pi$ 厘米，由 $2\\pi r = 54\\pi$ 得 $r = 27$ 厘米。

若半径为 $5$ 厘米的圆中一段弧长 $3\\pi$ 厘米，把它和周长 $10\\pi$ 厘米比较：这段弧占圆的 $\\frac{3\\pi}{10\\pi} = \\frac{3}{10}$，所以它的圆心角是 $\\frac{3}{10} \\cdot 360^\\circ = 108^\\circ$。

> **注意。** 求半径时求到 $r$ 就停：它的两倍是直径，它的一半什么也不是。求圆心角时，弧占圆的分数要乘以 $360^\\circ$；答案不是圆的其余部分，也不是这个结果的两倍或一半。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const L = q(theta * r, 180);
        const f = q(theta, 360);
        const s = 90 - theta / 2;
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `An arc with a central angle of $${theta}^\\circ$ has a length of $${tex(piTex(L), u)}$. Find the radius of the circle.`,
                `圆心角为 $${theta}^\\circ$ 的弧长为 $${tex(piTex(L), u)}$。求圆的半径。`,
              ),
              answer: r,
              unit: u,
              wrong: [2 * r, q(r, 2), L.mul(q(2))],
              solution: t(
                `**Step 1: the fraction of the circle.** The arc's central angle is $${theta}^\\circ$, so the arc is this fraction of the circle:${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}

**Step 2: the whole circumference.** If $${f.toLatex()}$ of the circumference is $${piTex(L)}$, the circumference is that divided by $${f.toLatex()}$:${steps(`2\\pi r = ${piTex(L)} \\div ${f.toLatex()} = ${piTex(2 * r)}`)}**Step 3: the radius.** Divide by $2\\pi$:${steps(`r = \\frac{${piTex(2 * r)}}{2\\pi} = ${tex(r, u)}`)}{{figure 0}}

**Check.** Put the radius back into the formula: $\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${piTex(L)}$, the given length.`,
                `**第一步：占圆的几分之几。** 这段弧的圆心角是 $${theta}^\\circ$，所以它占圆的这一部分：${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**第二步：整个周长。** 周长的 $${f.toLatex()}$ 是 $${piTex(L)}$，所以周长是它除以 $${f.toLatex()}$：${steps(`2\\pi r = ${piTex(L)} \\div ${f.toLatex()} = ${piTex(2 * r)}`)}**第三步：求半径。** 除以 $2\\pi$：${steps(`r = \\frac{${piTex(2 * r)}}{2\\pi} = ${tex(r, u)}`)}{{figure 0}}

**检验。** 把半径代回公式：$\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${piTex(L)}$，正是已知的弧长。`,
              ),
            }),
            solutionFigures: [
              figure(
                sectorMarks(s, theta, { angle: deg(theta), radius: len(r, u), shade: "none", arcTone: "action" }),
                `An arc with a central angle of ${theta}° in a circle of radius ${r} ${u}.`,
                `半径 ${r} ${u} 的圆中圆心角为 ${theta}° 的弧。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `In a circle with radius $${tex(r, u)}$, an arc has a length of $${tex(piTex(L), u)}$. Find its central angle.`,
              `在半径为 $${tex(r, u)}$ 的圆中，一段弧长为 $${tex(piTex(L), u)}$。求它所对的圆心角。`,
            ),
            answer: theta,
            unit: "°",
            wrong: [360 - theta, 2 * theta, q(theta, 2)],
            solution: t(
              `**Step 1: the circumference.**${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**Step 2: the fraction of the circle.** Divide the arc length by the circumference; the $\\pi$ cancels:${steps(`\\frac{${piTex(L)}}{${piTex(2 * r)}} = ${f.toLatex()}`)}**Step 3: the angle.** The arc is that fraction of the full turn:${steps(`\\theta = ${f.toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}{{figure 0}}

**Check.** Put the angle back into the formula: $\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}$, the given length.`,
              `**第一步：周长。**${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**第二步：占圆的几分之几。** 用弧长除以周长，$\\pi$ 约掉：${steps(`\\frac{${piTex(L)}}{${piTex(2 * r)}} = ${f.toLatex()}`)}**第三步：圆心角。** 这段弧是一整圈的这一部分：${steps(`\\theta = ${f.toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}{{figure 0}}

**检验。** 把圆心角代回公式：$\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}$，正是已知的弧长。`,
            ),
          }),
          solutionFigures: [
            figure(
              sectorMarks(s, theta, { angle: deg(theta), radius: len(r, u), shade: "none", arcTone: "action" }),
              `The arc is ${theta}/360 of the circle of radius ${r} ${u}, so its central angle is ${theta}°.`,
              `这段弧是半径 ${r} ${u} 的圆的 ${theta}/360，所以圆心角是 ${theta}°。`,
            ),
          ],
        };
      },
    },
  ],
};

/** terminatingAngles are central angles θ for which θ/360 has a terminating decimal expansion. */
const terminatingAngles = [36, 45, 72, 90, 135, 144, 180, 216, 225, 270, 288, 315] as const;

export const calculatingAreasOfCircularSectors: TopicDef = {
  id: "calculating-areas-of-circular-sectors",
  title: t("Calculating Areas of Circular Sectors", "计算扇形的面积"),
  summary: t("Find the area of a sector as a fraction of the area of its circle.", "把扇形面积看作圆面积的一部分来计算。"),
  prerequisites: ["central-angles-and-arcs", "areas-of-circles"],
  encompasses: [
    { topic: "areas-of-circles", weight: 0.5 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  intro: t(
    `An arc is a fraction of the circumference; in the same way, a **sector** is a fraction of the disk, and its area is the same fraction of $\\pi r^2$.

A lawn sprinkler of reach $4$ m turns back and forth through $180^\\circ$, watering half a disk:

{{figure 0}}

$180^\\circ$ is $\\frac{180}{360} = \\frac{1}{2}$ of a full turn. The whole disk would have area $\\pi \\cdot 4^2 = 16\\pi$ m², so the watered half has area $\\frac{1}{2} \\cdot 16\\pi = 8\\pi \\approx 25.1$ m².

Any central angle works the same way: a sector of $\\theta^\\circ$ is $\\frac{\\theta}{360}$ of the disk. We find areas of sectors, of major sectors, and decimal values with $3.14$ for $\\pi$.`,
    `弧是周长的一部分；同样，**扇形**是圆面的一部分，它的面积是 $\\pi r^2$ 的同一部分。

一个喷水半径为 $4$ 米的草坪喷头来回转动 $180^\\circ$，浇湿半个圆面：

{{figure 0}}

$180^\\circ$ 是一整圈的 $\\frac{180}{360} = \\frac{1}{2}$。整个圆面的面积是 $\\pi \\cdot 4^2 = 16\\pi$ 平方米，所以浇湿的一半面积是 $\\frac{1}{2} \\cdot 16\\pi = 8\\pi \\approx 25.1$ 平方米。

任何圆心角都是同样的道理：$\\theta^\\circ$ 的扇形占圆面的 $\\frac{\\theta}{360}$。我们来求扇形的面积、优扇形的面积，以及取 $\\pi \\approx 3.14$ 时的小数值。`,
  ),
  introFigures: [
    figure(
      sectorMarks(0, 180, { angle: "180°", radius: "4 m", shade: "result" }),
      "A sprinkler at O with a reach of 4 m waters the half disk swept through 180°.",
      "位于 O 的喷头喷水半径 4 m，浇湿转过 180° 的半个圆面。",
    ),
  ],
  knowledgePoints: [
    {
      id: "sector-area",
      figure: partsDrawings["sector-area"],
      title: t("Area of a sector", "扇形的面积"),
      explanation: t(
        `A sector with central angle $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of the whole disk: cut the disk into $360$ equal slices of $1^\\circ$, and the sector takes $\\theta$ of them. So its area is that fraction of the area of the circle:

$$A = \\frac{\\theta}{360} \\cdot \\pi r^2.$$

A sector of $40^\\circ$ in a circle of radius $6$ cm is $\\frac{40}{360} = \\frac{1}{9}$ of the disk. The disk has area $\\pi \\cdot 6^2 = 36\\pi$ cm², so the sector has area $\\frac{1}{9} \\cdot 36\\pi = 4\\pi$ cm², about $12.6$ cm².

> **Watch out.** Area uses $\\pi r^2$; $\\frac{\\theta}{360} \\cdot 2\\pi r$ is the arc length, not the area. Use $\\frac{\\theta}{360}$, not $\\frac{\\theta}{180}$, which gives twice the sector, and do not stop at the whole disk $\\pi r^2$. The sector is the part inside the marked angle, not the rest.`,
        `圆心角为 $\\theta^\\circ$ 的扇形占整个圆面的 $\\frac{\\theta}{360}$：把圆面分成 $360$ 个 $1^\\circ$ 的相等小块，扇形占其中 $\\theta$ 块。所以它的面积是圆面积的这一部分：

$$A = \\frac{\\theta}{360} \\cdot \\pi r^2.$$

在半径为 $6$ 厘米的圆中，$40^\\circ$ 的扇形占圆面的 $\\frac{40}{360} = \\frac{1}{9}$。圆面积是 $\\pi \\cdot 6^2 = 36\\pi$ 平方厘米，所以扇形面积是 $\\frac{1}{9} \\cdot 36\\pi = 4\\pi$ 平方厘米，约 $12.6$ 平方厘米。

> **注意。** 面积用 $\\pi r^2$；$\\frac{\\theta}{360} \\cdot 2\\pi r$ 是弧长，不是面积。要用 $\\frac{\\theta}{360}$，不是 $\\frac{\\theta}{180}$（那会得到扇形的两倍），也不要停在整个圆面积 $\\pi r^2$。扇形是标出的角内部的部分，而不是其余部分。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        const f = q(theta, 360);
        const s = rng.int(0, 359);
        return {
          ...piProblem({
            prompt: t(`Find the area of sector $AOB$.${PI_EN}`, `求扇形 $AOB$ 的面积。${PI_ZH}`),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(q(theta * r, 180)), piTex(q(theta * r * r, 180)), piTex(r * r), piTex(q((360 - theta) * r * r, 360))],
            solution: t(
              `**Step 1: the fraction of the disk.** The sector has a central angle of $${theta}^\\circ$ out of $360^\\circ$:${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**Step 2: the area of the whole disk.**${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 3: take that fraction of it.**${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**Check.** With $\\pi \\approx 3$, the disk is about $${3 * r * r}$, and $${f.toLatex()}$ of it is about $${near(f.toNumber() * 3 * r * r)}$; the exact $${piTex(A)} \\approx ${piNear(A)}$ is a little more, as it should be.`,
              `**第一步：占圆面的几分之几。** 扇形的圆心角是 $${theta}^\\circ$，整圈是 $360^\\circ$：${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**第二步：整个圆面的面积。**${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第三步：取它的这一部分。**${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**检验。** 取 $\\pi \\approx 3$，圆面积约为 $${3 * r * r}$，它的 $${f.toLatex()}$ 约为 $${near(f.toNumber() * 3 * r * r)}$；精确值 $${piTex(A)} \\approx ${piNear(A)}$ 稍大一些，正应如此。`,
            ),
          }),
          figure: figure(
            sectorFigure(s, theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
          solutionFigures: [
            figure(
              sectorMarks(s, theta, { angle: deg(theta), radius: len(r, u), shade: "result" }),
              `Sector AOB is ${theta}/360 of the disk of radius ${r} ${u}.`,
              `扇形 AOB 是半径 ${r} ${u} 的圆面的 ${theta}/360。`,
            ),
          ],
        };
      },
    },
    {
      id: "major-sector-area",
      figure: partsDrawings["major-sector-area"],
      title: t("Area of a major sector", "优扇形的面积"),
      explanation: t(
        `A major sector is the larger piece left when two radii cut the disk. Its central angle is the rest of the full turn, $360^\\circ - \\theta$, where $\\theta$ is the angle of the minor sector. Use that angle in the formula, or subtract the minor sector from the whole disk: the two sectors together are the disk.

In a circle of radius $3$ m with $\\angle AOB = 120^\\circ$, the major sector has angle $240^\\circ$, which is $\\frac{240}{360} = \\frac{2}{3}$ of the disk, so its area is $\\frac{2}{3} \\cdot 9\\pi = 6\\pi$ m². The minor sector is $\\frac{1}{3} \\cdot 9\\pi = 3\\pi$ m², and $6\\pi + 3\\pi = 9\\pi$.

> **Watch out.** The marked angle belongs to the minor sector, so using it gives the wrong piece, and $180^\\circ - \\theta$ gives neither piece. The area comes from $\\pi r^2$, not from the circumference $2\\pi r$, and it is not the whole disk.`,
        `两条半径把圆面分成两块，优扇形是其中较大的一块。它的圆心角是一整圈的其余部分 $360^\\circ - \\theta$，其中 $\\theta$ 是劣扇形的圆心角。可以把这个角代入公式，也可以用整个圆面积减去劣扇形：两个扇形合起来就是整个圆面。

在半径为 $3$ 米的圆中，若 $\\angle AOB = 120^\\circ$，则优扇形的圆心角是 $240^\\circ$，占圆面的 $\\frac{240}{360} = \\frac{2}{3}$，面积是 $\\frac{2}{3} \\cdot 9\\pi = 6\\pi$ 平方米。劣扇形是 $\\frac{1}{3} \\cdot 9\\pi = 3\\pi$ 平方米，而 $6\\pi + 3\\pi = 9\\pi$。

> **注意。** 标出的角属于劣扇形，用它求出的是另一块；用 $180^\\circ - \\theta$ 得到的哪一块都不是。面积来自 $\\pi r^2$，不是周长 $2\\pi r$，也不是整个圆面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 15);
        const A = q((360 - theta) * r * r, 360);
        const f = q(360 - theta, 360);
        const minor = q(theta * r * r, 360);
        const s = rng.int(0, 359);
        return {
          ...piProblem({
            prompt: t(`Find the area of the highlighted major sector.${PI_EN}`, `求突出显示的优扇形的面积。${PI_ZH}`),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(q(theta * r * r, 360)), piTex(q((360 - theta) * r, 180)), piTex(r * r), piTex(q((180 - theta) * r * r, 360))],
            solution: t(
              `**Step 1: the central angle of the major sector.** The marked $${theta}^\\circ$ is the minor sector's angle; the major sector takes the rest of the turn:${steps(`360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}**Step 2: the fraction of the disk.**${steps(`\\frac{${360 - theta}}{360} = ${f.toLatex()}`)}**Step 3: that fraction of the disk's area.** The disk has area $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$:${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**Check.** The minor sector is $\\frac{${theta}}{360} \\cdot ${piTex(r * r)} = ${piTex(minor)}$, and the two sectors make the whole disk: $${piTex(A)} + ${piTex(minor)} = ${piTex(r * r)}$.`,
              `**第一步：优扇形的圆心角。** 标出的 $${theta}^\\circ$ 是劣扇形的角；优扇形占一整圈的其余部分：${steps(`360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}**第二步：占圆面的几分之几。**${steps(`\\frac{${360 - theta}}{360} = ${f.toLatex()}`)}**第三步：取圆面积的这一部分。** 圆面积是 $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$：${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**检验。** 劣扇形是 $\\frac{${theta}}{360} \\cdot ${piTex(r * r)} = ${piTex(minor)}$，两个扇形合起来是整个圆面：$${piTex(A)} + ${piTex(minor)} = ${piTex(r * r)}$。`,
            ),
          }),
          figure: figure(
            sectorFigure(s, theta, deg(theta), len(r, u), true),
            `A circle with radius ${r} ${u}; angle AOB is ${theta}° and the major sector is highlighted.`,
            `半径为 ${r} ${u} 的圆；角 AOB 为 ${theta}°，优扇形被突出显示。`,
          ),
          solutionFigures: [
            figure(
              [
                ...sectorMarks(s + theta, 360 - theta, { angle: deg(360 - theta), shade: "result" }),
                angleAt(O, on(s), on(s + theta), deg(theta)),
                { kind: "side", a: O, b: on(s), text: len(r, u) },
              ],
              `The major sector has a central angle of ${360 - theta}°, the rest of the turn after ${theta}°.`,
              `优扇形的圆心角为 ${360 - theta}°，是去掉 ${theta}° 后一整圈的其余部分。`,
            ),
          ],
        };
      },
    },
    {
      id: "approximating-sector-area",
      figure: partsDrawings["approximating-sector-area"],
      title: t("Approximating the area of a sector", "扇形面积的近似值"),
      explanation: t(
        `For a decimal value, simplify the fraction of the disk first, then use $3.14$ for $\\pi$: the small fraction keeps the multiplication short.

A sector of $72^\\circ$ in a circle of radius $10$ cm is $\\frac{72}{360} = \\frac{1}{5}$ of the disk. The disk has area about $3.14 \\cdot 10^2 = 314$ cm², so the sector has area about $\\frac{1}{5} \\cdot 314 = 62.8$ cm².

> **Watch out.** Square the radius: $3.14 \\cdot 2r$ is not the area of the disk. Take the fraction $\\frac{\\theta}{360}$ of the disk, not the whole disk and not the rest of it, $1 - \\frac{\\theta}{360}$.`,
        `要得到小数值，先化简扇形占圆面的分数，再取 $\\pi \\approx 3.14$：分数简单，乘法就短。

在半径为 $10$ 厘米的圆中，$72^\\circ$ 的扇形占圆面的 $\\frac{72}{360} = \\frac{1}{5}$。圆面积约为 $3.14 \\cdot 10^2 = 314$ 平方厘米，所以扇形面积约为 $\\frac{1}{5} \\cdot 314 = 62.8$ 平方厘米。

> **注意。** 半径要平方：$3.14 \\cdot 2r$ 不是圆面积。要取圆面的 $\\frac{\\theta}{360}$，不是整个圆面，也不是其余部分 $1 - \\frac{\\theta}{360}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(terminatingAngles);
        const r = rng.int(2, 20);
        const f = q(theta, 360);
        const A = f.mul(piQ).mul(q(r * r));
        const disk = piQ.mul(q(r * r));
        return {
          ...numberProblem({
            prompt: t(
              `A sector of a circle with radius $${tex(r, u)}$ has a central angle of $${theta}^\\circ$. Use $3.14$ for $\\pi$ to find its area.`,
              `半径为 $${tex(r, u)}$ 的圆中，一个扇形的圆心角为 $${theta}^\\circ$。取 $\\pi \\approx 3.14$，求它的面积。`,
            ),
            answer: A,
            form: "decimal",
            unit: `${u}^2`,
            wrong: [
              f.mul(piQ).mul(q(2 * r)),
              piQ.mul(q(r * r)),
              q(1)
                .sub(f)
                .mul(piQ)
                .mul(q(r * r)),
            ],
            solution: t(
              `**Step 1: the fraction of the disk.**${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**Step 2: the area of the disk.** Square the radius, then use $3.14$ for $\\pi$:${steps(`\\pi r^2 \\approx 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${dec(disk)}`)}**Step 3: take that fraction of it.**${steps(`A \\approx ${f.toLatex()} \\cdot ${dec(disk)} = ${tex(dec(A), u, 2)}`)}{{figure 0}}

**Check.** With $\\pi \\approx 3$ instead, the sector is about $${f.toLatex()} \\cdot 3 \\cdot ${r * r} = ${near(f.toNumber() * 3 * r * r)}$, a little less than $${dec(A)}$, as it should be since $3 < 3.14$.`,
              `**第一步：占圆面的几分之几。**${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**第二步：圆面积。** 先把半径平方，再取 $\\pi \\approx 3.14$：${steps(`\\pi r^2 \\approx 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${dec(disk)}`)}**第三步：取它的这一部分。**${steps(`A \\approx ${f.toLatex()} \\cdot ${dec(disk)} = ${tex(dec(A), u, 2)}`)}{{figure 0}}

**检验。** 改取 $\\pi \\approx 3$，扇形约为 $${f.toLatex()} \\cdot 3 \\cdot ${r * r} = ${near(f.toNumber() * 3 * r * r)}$，比 $${dec(A)}$ 稍小；因为 $3 < 3.14$，正应如此。`,
            ),
          }),
          solutionFigures: [
            figure(
              sectorMarks(90 - theta / 2, theta, { angle: deg(theta), radius: len(r, u), shade: "result" }),
              `A sector of ${theta}° in a circle of radius ${r} ${u}: ${theta}/360 of the disk.`,
              `半径 ${r} ${u} 的圆中 ${theta}° 的扇形：圆面的 ${theta}/360。`,
            ),
          ],
        };
      },
    },
  ],
};

const anyAngles = [...minorAngles, 200, 210, 216, 225, 240, 270, 288, 300, 315, 330] as const;

export const furtherCalculatingAreasOfSectors: TopicDef = {
  id: "further-calculating-areas-of-sectors",
  title: t("Further Calculating Areas of Sectors", "扇形面积的进一步计算"),
  summary: t(
    "Work backward from the area of a sector to its angle or radius, find areas from arc lengths, and find perimeters of sectors.",
    "由扇形面积反求圆心角或半径，由弧长求面积，并求扇形的周长。",
  ),
  prerequisites: ["calculating-areas-of-circular-sectors", "calculating-arc-lengths-of-circular-sectors"],
  encompasses: [
    { topic: "calculating-areas-of-circular-sectors", weight: 0.6 },
    { topic: "calculating-arc-lengths-of-circular-sectors", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.C.B.5"],
  intro: t(
    `A sector of $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of its circle, and that one fraction governs both its arc and its area. Knowing the fraction, we can also run the formulas backward.

A fan opens into a sector of radius $20$ cm, and its paper covers $100\\pi$ cm²:

{{figure 0}}

The whole circle would cover $\\pi \\cdot 20^2 = 400\\pi$ cm², so the fan is $\\frac{100\\pi}{400\\pi} = \\frac{1}{4}$ of it, and it opens through $\\frac{1}{4} \\cdot 360^\\circ = 90^\\circ$. Its curved edge is the same quarter of the circumference, $\\frac{1}{4} \\cdot 40\\pi = 10\\pi$ cm, and its whole edge, two ribs and the arc, is $(40 + 10\\pi)$ cm.

We find the angle and the radius from the area, the area from the arc length, and the perimeter of a sector.`,
    `$\\theta^\\circ$ 的扇形占它所在圆的 $\\frac{\\theta}{360}$，弧长和面积都由这同一个分数决定。知道了这个分数，公式也能倒过来用。

一把扇子展开成半径 $20$ 厘米的扇形，扇面面积是 $100\\pi$ 平方厘米：

{{figure 0}}

整个圆的面积是 $\\pi \\cdot 20^2 = 400\\pi$ 平方厘米，所以扇子占它的 $\\frac{100\\pi}{400\\pi} = \\frac{1}{4}$，展开的角是 $\\frac{1}{4} \\cdot 360^\\circ = 90^\\circ$。它的弧形边是周长的同样四分之一，$\\frac{1}{4} \\cdot 40\\pi = 10\\pi$ 厘米；它的整个边缘，两根扇骨加上弧，是 $(40 + 10\\pi)$ 厘米。

我们来由面积求圆心角和半径，由弧长求面积，并求扇形的周长。`,
  ),
  introFigures: [
    figure(
      sectorMarks(45, 90, { angle: "90°", radius: "20 cm", arc: "10π cm", shade: "result" }),
      "A fan opened into a sector of radius 20 cm and area 100π cm²: a quarter of the circle, with an arc of 10π cm.",
      "展开成半径 20 cm、面积 100π cm² 的扇形的扇子：圆的四分之一，弧长 10π cm。",
    ),
  ],
  knowledgePoints: [
    {
      id: "angle-from-sector-area",
      figure: partsDrawings["angle-from-sector-area"],
      title: t("The angle from the area", "由面积求圆心角"),
      explanation: t(
        `The sector's area is $\\frac{\\theta}{360}$ of the area of its circle, so dividing the sector's area by the circle's area gives that fraction back:

$$\\frac{\\theta}{360} = \\frac{A_{\\text{sector}}}{\\pi r^2}.$$

Then multiply by $360^\\circ$. A sector of area $14\\pi$ cm² in a circle of radius $6$ cm is $\\frac{14\\pi}{36\\pi} = \\frac{7}{18}$ of the circle, so $\\theta = \\frac{7}{18} \\cdot 360^\\circ = 140^\\circ$. A fraction above $\\frac{1}{2}$ means a major sector, with an angle above $180^\\circ$.

> **Watch out.** Divide by the whole area $\\pi r^2$, with the radius squared, not by $r$. The fraction gives the sector's own angle: not the rest of the turn, $360^\\circ$ minus it, and not half of it.`,
        `扇形面积是圆面积的 $\\frac{\\theta}{360}$，所以用扇形面积除以圆面积，就得回这个分数：

$$\\frac{\\theta}{360} = \\frac{A_{\\text{扇形}}}{\\pi r^2}.$$

再乘以 $360^\\circ$。在半径为 $6$ 厘米的圆中，面积为 $14\\pi$ 平方厘米的扇形占圆的 $\\frac{14\\pi}{36\\pi} = \\frac{7}{18}$，所以 $\\theta = \\frac{7}{18} \\cdot 360^\\circ = 140^\\circ$。分数大于 $\\frac{1}{2}$ 说明是优扇形，圆心角大于 $180^\\circ$。

> **注意。** 要除以整个圆面积 $\\pi r^2$，半径要平方，不能只除以 $r$。这个分数给出的是扇形自己的圆心角：不是一整圈减去它，也不是它的一半。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        const f = q(theta, 360);
        return {
          ...numberProblem({
            prompt: t(
              `A sector of a circle with radius $${tex(r, u)}$ has an area of $${tex(piTex(A), u, 2)}$. Find its central angle.`,
              `半径为 $${tex(r, u)}$ 的圆中，一个扇形的面积是 $${tex(piTex(A), u, 2)}$。求它的圆心角。`,
            ),
            answer: theta,
            unit: "°",
            wrong: [theta * r, 360 - theta, q(theta, 2)],
            solution: t(
              `**Step 1: the area of the whole circle.**${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 2: the fraction of the circle.** Divide the sector's area by it; the $\\pi$ cancels:${steps(`\\frac{${piTex(A)}}{${piTex(r * r)}} = ${f.toLatex()}`)}**Step 3: the angle.** The sector is that fraction of the full turn:${steps(`\\theta = ${f.toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}{{figure 0}}

**Check.** Put the angle back: $\\frac{${theta}}{360} \\cdot ${piTex(r * r)} = ${piTex(A)}$, the given area.${theta > 180 ? ` The fraction is more than $\\frac{1}{2}$, so the sector is a major one, and indeed $${theta}^\\circ > 180^\\circ$.` : ""}`,
              `**第一步：整个圆的面积。**${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第二步：占圆的几分之几。** 用扇形面积除以它，$\\pi$ 约掉：${steps(`\\frac{${piTex(A)}}{${piTex(r * r)}} = ${f.toLatex()}`)}**第三步：圆心角。** 扇形是一整圈的这一部分：${steps(`\\theta = ${f.toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}{{figure 0}}

**检验。** 把圆心角代回：$\\frac{${theta}}{360} \\cdot ${piTex(r * r)} = ${piTex(A)}$，正是已知的面积。${theta > 180 ? `分数大于 $\\frac{1}{2}$，所以是优扇形，确实 $${theta}^\\circ > 180^\\circ$。` : ""}`,
            ),
          }),
          solutionFigures: [
            figure(
              sectorMarks(90 - theta / 2, theta, { angle: deg(theta), radius: len(r, u), shade: "result" }),
              `The sector is ${theta}/360 of the circle of radius ${r} ${u}, so its central angle is ${theta}°.`,
              `扇形是半径 ${r} ${u} 的圆的 ${theta}/360，所以圆心角是 ${theta}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-sector-area",
      figure: partsDrawings["radius-from-sector-area"],
      title: t("The radius from the area", "由面积求半径"),
      explanation: t(
        `Knowing the angle gives the fraction of the circle, and knowing the sector's area then gives the whole circle's area: divide by the fraction. The whole area is $\\pi r^2$, so divide by $\\pi$ to get $r^2$, and take the square root.

A sector of $40^\\circ$ with area $9\\pi$ m² is $\\frac{40}{360} = \\frac{1}{9}$ of its circle, so the circle has area $9 \\cdot 9\\pi = 81\\pi$ m². Then $r^2 = 81$ and $r = 9$ m.

> **Watch out.** Dividing gives $r^2$, not $r$: take the square root. The radius is not the diameter $2r$, and it is not the number in front of $\\pi$ in the sector's area.`,
        `知道圆心角就知道扇形占圆的几分之几，再由扇形面积就能得到整个圆的面积：除以这个分数。整个圆面积是 $\\pi r^2$，除以 $\\pi$ 得到 $r^2$，再开平方。

圆心角 $40^\\circ$、面积 $9\\pi$ 平方米的扇形占圆的 $\\frac{40}{360} = \\frac{1}{9}$，所以圆面积是 $9 \\cdot 9\\pi = 81\\pi$ 平方米。于是 $r^2 = 81$，$r = 9$ 米。

> **注意。** 除完得到的是 $r^2$，不是 $r$：还要开平方。半径不是直径 $2r$，也不是扇形面积中 $\\pi$ 前面的那个数。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        const f = q(theta, 360);
        return {
          ...numberProblem({
            prompt: t(
              `A sector with a central angle of $${theta}^\\circ$ has an area of $${tex(piTex(A), u, 2)}$. Find the radius of the circle.`,
              `圆心角为 $${theta}^\\circ$ 的扇形面积是 $${tex(piTex(A), u, 2)}$。求圆的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [r * r, 2 * r, A],
            solution: t(
              `**Step 1: the fraction of the circle.**${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**Step 2: the area of the whole circle.** The sector is $${f.toLatex()}$ of it, so divide by $${f.toLatex()}$:${steps(`\\pi r^2 = ${piTex(A)} \\div ${f.toLatex()} = ${piTex(r * r)}`)}**Step 3: the radius.** Divide by $\\pi$, then take the square root:${steps(`r^2 = ${r * r}`, `r = \\sqrt{${r * r}} = ${tex(r, u)}`)}{{figure 0}}

**Check.** Put the radius back: $\\frac{${theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${piTex(A)}$, the given area.`,
              `**第一步：占圆的几分之几。**${steps(`\\frac{${theta}}{360} = ${f.toLatex()}`)}**第二步：整个圆的面积。** 扇形是它的 $${f.toLatex()}$，所以除以 $${f.toLatex()}$：${steps(`\\pi r^2 = ${piTex(A)} \\div ${f.toLatex()} = ${piTex(r * r)}`)}**第三步：半径。** 除以 $\\pi$，再开平方：${steps(`r^2 = ${r * r}`, `r = \\sqrt{${r * r}} = ${tex(r, u)}`)}{{figure 0}}

**检验。** 把半径代回：$\\frac{${theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${piTex(A)}$，正是已知的面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              sectorMarks(90 - theta / 2, theta, { angle: deg(theta), radius: "r", shade: "action" }),
              `A sector of ${theta}° is ${theta}/360 of its circle; the radius r is unknown.`,
              `${theta}° 的扇形是所在圆的 ${theta}/360；半径 r 未知。`,
            ),
          ],
        };
      },
    },
    {
      id: "sector-area-from-arc-length",
      figure: partsDrawings["sector-area-from-arc-length"],
      title: t("Area from the arc length", "由弧长求面积"),
      explanation: t(
        `A sector's arc and its area are the same fraction of the circle: the arc is that fraction of the circumference $2\\pi r$, and the area that fraction of $\\pi r^2$. So the arc length $L$ tells the fraction, $\\frac{L}{2\\pi r}$, and the area follows:

$$A = \\frac{L}{2\\pi r} \\cdot \\pi r^2 = \\frac{1}{2} L r.$$

A sector of a circle of radius $5$ cm with arc length $2\\pi$ cm is $\\frac{2\\pi}{10\\pi} = \\frac{1}{5}$ of the circle, so its area is $\\frac{1}{5} \\cdot 25\\pi = 5\\pi$ cm². The short formula agrees: $\\frac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$.

> **Watch out.** The formula has a factor $\\frac{1}{2}$: $L r$ is twice the area. Multiply by $r$, not $r^2$, and do not forget the $r$ altogether.`,
        `扇形的弧和面积占圆的分数相同：弧是周长 $2\\pi r$ 的这一部分，面积是 $\\pi r^2$ 的这一部分。所以由弧长 $L$ 得到这个分数 $\\frac{L}{2\\pi r}$，面积就随之而来：

$$A = \\frac{L}{2\\pi r} \\cdot \\pi r^2 = \\frac{1}{2} L r.$$

半径为 $5$ 厘米、弧长为 $2\\pi$ 厘米的扇形占圆的 $\\frac{2\\pi}{10\\pi} = \\frac{1}{5}$，所以面积是 $\\frac{1}{5} \\cdot 25\\pi = 5\\pi$ 平方厘米。简便公式的结果相同：$\\frac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$。

> **注意。** 公式里有因数 $\\frac{1}{2}$：$L r$ 是面积的两倍。要乘以 $r$，不是 $r^2$，也不能把 $r$ 漏掉。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const L = q(theta * r, 180);
        const A = L.mul(q(r, 2));
        const f = q(theta, 360);
        return {
          ...piProblem({
            prompt: t(
              `A sector of a circle with radius $${tex(r, u)}$ has an arc length of $${tex(piTex(L), u)}$. Find the area of the sector.${PI_EN}`,
              `半径为 $${tex(r, u)}$ 的圆中，一个扇形的弧长是 $${tex(piTex(L), u)}$。求这个扇形的面积。${PI_ZH}`,
            ),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(L.mul(q(r))), piTex(L.mul(q(r * r, 2))), piTex(L.mul(q(1, 2)))],
            solution: t(
              `**Step 1: the fraction of the circle.** Compare the arc with the circumference $2\\pi \\cdot ${r} = ${piTex(2 * r)}$:${steps(`\\frac{${piTex(L)}}{${piTex(2 * r)}} = ${f.toLatex()}`)}**Step 2: the same fraction of the area.** The circle has area $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$:${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**Check.** The short formula $A = \\frac{1}{2} L r$ gives the same: $\\frac{1}{2} \\cdot ${piTex(L)} \\cdot ${r} = ${piTex(A)}$.`,
              `**第一步：占圆的几分之几。** 把弧长与周长 $2\\pi \\cdot ${r} = ${piTex(2 * r)}$ 比较：${steps(`\\frac{${piTex(L)}}{${piTex(2 * r)}} = ${f.toLatex()}`)}**第二步：面积的同一部分。** 圆面积是 $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$：${steps(`A = ${f.toLatex()} \\cdot ${piTex(r * r)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**检验。** 简便公式 $A = \\frac{1}{2} L r$ 给出同样的结果：$\\frac{1}{2} \\cdot ${piTex(L)} \\cdot ${r} = ${piTex(A)}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              sectorMarks(90 - theta / 2, theta, { radius: len(r, u), shade: "result", arcTone: "action" }),
              `A sector of a circle of radius ${r} ${u}: its arc and its area are the same fraction, ${theta}/360, of the circle.`,
              `半径 ${r} ${u} 的圆中的扇形：它的弧和面积占圆的分数相同，都是 ${theta}/360。`,
            ),
          ],
        };
      },
    },
    {
      id: "perimeter-of-a-sector",
      figure: partsDrawings["perimeter-of-a-sector"],
      title: t("Perimeter of a sector", "扇形的周长"),
      explanation: t(
        `Walk around the edge of a sector: out along one radius, along the arc, and back along the other radius. So its perimeter is

$$P = 2r + L.$$

A sector of $60^\\circ$ in a circle of radius $9$ cm has arc length $\\frac{1}{6} \\cdot 18\\pi = 3\\pi$ cm, so its perimeter is $(18 + 3\\pi)$ cm, about $27.4$ cm. The radii and the arc are not like terms: leave the exact answer as a sum.

> **Watch out.** The arc alone is not the perimeter, and there are two radii, not one. The arc is a length from $2\\pi r$, not the sector's area, and it is the arc of the sector itself, not the rest of the circle.`,
        `沿扇形的边走一圈：沿一条半径出去，沿弧走，再沿另一条半径回来。所以它的周长是

$$P = 2r + L.$$

在半径为 $9$ 厘米的圆中，$60^\\circ$ 扇形的弧长是 $\\frac{1}{6} \\cdot 18\\pi = 3\\pi$ 厘米，所以周长是 $(18 + 3\\pi)$ 厘米，约 $27.4$ 厘米。半径与弧长不是同类项，精确答案保留为和的形式。

> **注意。** 只有弧不是周长，而且半径有两条，不是一条。弧长来自 $2\\pi r$，不是扇形的面积；而且是扇形自己的弧，不是圆的其余部分。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 18);
        const L = q(theta * r, 180);
        const f = q(theta, 360);
        const s = rng.int(0, 359);
        return {
          ...piProblem({
            prompt: t(`Find the perimeter of sector $AOB$.${PI_EN}`, `求扇形 $AOB$ 的周长。${PI_ZH}`),
            answer: piSum(2 * r, L),
            unit: u,
            wrong: [piTex(L), piSum(r, L), piSum(2 * r, q(theta * r * r, 360)), piSum(2 * r, q((360 - theta) * r, 180))],
            solution: t(
              `**Step 1: the arc.** The sector is $\\frac{${theta}}{360} = ${f.toLatex()}$ of the circle, and the circumference is $2\\pi \\cdot ${r} = ${piTex(2 * r)}$:${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${piTex(L)}`)}**Step 2: add the two radii.** The edge runs along $OA$, the arc and $BO$:${steps(`P = ${r} + ${r} + ${piTex(L)} = ${tex(`(${piSum(2 * r, L)})`, u)}`)}{{figure 0}}

**Check.** In decimals, $P \\approx ${2 * r} + ${piNear(L)} = ${near(2 * r + L.toNumber() * Math.PI)}$; with $\\pi \\approx 3$ the arc is about $${f.toLatex()} \\cdot ${6 * r} = ${near(f.toNumber() * 6 * r)}$, close to $${piNear(L)}$.`,
              `**第一步：弧长。** 扇形占圆的 $\\frac{${theta}}{360} = ${f.toLatex()}$，周长是 $2\\pi \\cdot ${r} = ${piTex(2 * r)}$：${steps(`L = ${f.toLatex()} \\cdot ${piTex(2 * r)} = ${piTex(L)}`)}**第二步：加上两条半径。** 边界依次是 $OA$、弧和 $BO$：${steps(`P = ${r} + ${r} + ${piTex(L)} = ${tex(`(${piSum(2 * r, L)})`, u)}`)}{{figure 0}}

**检验。** 用小数，$P \\approx ${2 * r} + ${piNear(L)} = ${near(2 * r + L.toNumber() * Math.PI)}$；取 $\\pi \\approx 3$，弧长约为 $${f.toLatex()} \\cdot ${6 * r} = ${near(f.toNumber() * 6 * r)}$，与 $${piNear(L)}$ 接近。`,
            ),
          }),
          figure: figure(
            sectorFigure(s, theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
          solutionFigures: [
            figure(
              [
                ...sectorMarks(s, theta, { angle: deg(theta), radius: len(r, u), shade: "none", arcTone: "result" }),
                toned(O, on(s), "result"),
                toned(O, on(s + theta), "result"),
              ],
              `The perimeter of sector AOB: the two radii of ${r} ${u} and the arc AB.`,
              `扇形 AOB 的周长：两条 ${r} ${u} 的半径和弧 AB。`,
            ),
          ],
        };
      },
    },
  ],
};

/** semicircleShape is the outline of an l by w rectangle with a semicircle on its right side, bulging out, or cut in when inward. */
function semicircleShape(l: number, w: number, inward: boolean): Point[] {
  const c: Point = [l, w / 2];
  const arc = inward ? arcPoints(90, 270, w / 2, c).reverse() : arcPoints(270, 450, w / 2, c);
  return [[0, w], [0, 0], ...arc];
}

/** semicircleMarks draws the l by w shape with a semicircle on its right side for a solution: the shape shaded when shaded, the side under the semicircle dashed, and the semicircle's radius marked. */
function semicircleMarks(l: number, w: number, inward: boolean, u: Unit, shaded: boolean): Mark[] {
  const pts = semicircleShape(l, w, inward);
  const c: Point = [l, w / 2];
  return [
    ...(shaded ? [{ kind: "shade", points: pts, tone: "result" } as const] : []),
    { kind: "polygon", points: pts, ...(shaded ? {} : { tone: "result" as const }) },
    { kind: "segment", a: [l, 0], b: [l, w], dashed: true },
    toned(c, [l, w], "action"),
    { kind: "side", a: [l, w], b: c, text: len(w / 2, u) },
    { kind: "side", a: [0, 0], b: [l, 0], text: len(l, u) },
    { kind: "side", a: [0, w], b: [0, 0], text: len(w, u) },
  ];
}

export const problemSolvingWithCircles: TopicDef = {
  id: "problem-solving-with-circles",
  title: t("Problem Solving With Circles", "圆的综合问题"),
  summary: t(
    "Find areas and perimeters of shapes made of circles, semicircles and polygons.",
    "求由圆、半圆和多边形组合而成的图形的面积与周长。",
  ),
  prerequisites: ["areas-of-circles", "composite-shapes"],
  encompasses: [
    { topic: "areas-of-circles", weight: 0.5 },
    { topic: "composite-shapes", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.7.G.B.4", "CCSS.7.G.B.6"],
  intro: t(
    `Composite shapes are found by splitting them into pieces we know, adding the pieces that are there and subtracting the ones cut away. With circles in the mix, the pieces are whole circles, semicircles and quarter circles.

A running track is a $40$ m by $20$ m rectangle with a semicircle on each $20$ m end:

{{figure 0}}

The two semicircles, each of radius $10$ m, make one whole circle of area $\\pi \\cdot 10^2 = 100\\pi$ m², so the field inside has area $(800 + 100\\pi)$ m², about $1114$ m². Around the edge, the two straight sides give $80$ m and the two half circles give one whole circumference, $2\\pi \\cdot 10 = 20\\pi$ m, so one lap is $(80 + 20\\pi)$ m, about $143$ m. The $20$ m ends are inside the shape, not on its edge.

We find the areas of rings, the areas and perimeters of shapes with semicircles, and shaded regions made with quarter circles.`,
    `求组合图形时，把它分成熟悉的几部分：有的部分加上，被挖去的部分减去。图形里有圆时，这些部分就是整圆、半圆和四分之一圆。

一条跑道围成的区域是一个 $40$ 米 × $20$ 米的长方形，两端 $20$ 米的边上各有一个半圆：

{{figure 0}}

两个半圆的半径都是 $10$ 米，合起来是一个整圆，面积 $\\pi \\cdot 10^2 = 100\\pi$ 平方米，所以里面的场地面积是 $(800 + 100\\pi)$ 平方米，约 $1114$ 平方米。沿边缘走，两条直边共 $80$ 米，两个半圆合起来是一个整圆周 $2\\pi \\cdot 10 = 20\\pi$ 米，所以一圈是 $(80 + 20\\pi)$ 米，约 $143$ 米。两端 $20$ 米的边在图形内部，不在边缘上。

我们来求圆环的面积、含半圆图形的面积和周长，以及用四分之一圆构成的阴影部分的面积。`,
  ),
  introFigures: [
    figure(
      [
        { kind: "shade", points: [[0, 20], ...arcPoints(90, 270, 10, [0, 10]), ...arcPoints(270, 450, 10, [40, 10])], tone: "result" },
        { kind: "polygon", points: [[0, 20], ...arcPoints(90, 270, 10, [0, 10]), ...arcPoints(270, 450, 10, [40, 10])] },
        { kind: "segment", a: [0, 0], b: [0, 20], dashed: true },
        { kind: "segment", a: [40, 0], b: [40, 20], dashed: true },
        { kind: "side", a: [0, 0], b: [40, 0], text: "40 m" },
        { kind: "side", a: [40, 0], b: [40, 20], text: "20 m" },
      ],
      "A running track: a 40 m by 20 m rectangle with a semicircle on each 20 m end.",
      "跑道：一个 40 m × 20 m 的长方形，两端 20 m 的边上各有一个半圆。",
    ),
  ],
  knowledgePoints: [
    {
      id: "area-of-a-ring",
      figure: partsDrawings["area-of-a-ring"],
      title: t("Area of a ring", "圆环的面积"),
      explanation: t(
        `The region between two circles with the same center is a **ring** (an annulus). It is the large disk with the small disk taken out, so its area is the difference of the two areas:

$$A = \\pi R^2 - \\pi r^2.$$

For radii $7$ cm and $2$ cm, the large disk has area $49\\pi$ cm² and the small one $4\\pi$ cm², so the ring has area $49\\pi - 4\\pi = 45\\pi$ cm². Factoring gives the same: $\\pi(7 - 2)(7 + 2) = 45\\pi$.

> **Watch out.** Square each radius separately: $\\pi(R - r)^2$ is not the ring's area. Subtract the small disk, do not add it, and do not stop at the large disk. And $2\\pi(R - r)$ is a difference of circumferences, a length, not an area.`,
        `两个同心圆之间的区域叫**圆环**。它是大圆面挖去小圆面，所以面积是两个面积之差：

$$A = \\pi R^2 - \\pi r^2.$$

半径为 $7$ 厘米和 $2$ 厘米时，大圆面积是 $49\\pi$ 平方厘米，小圆面积是 $4\\pi$ 平方厘米，所以圆环面积是 $49\\pi - 4\\pi = 45\\pi$ 平方厘米。因式分解得到相同的结果：$\\pi(7 - 2)(7 + 2) = 45\\pi$。

> **注意。** 两个半径要分别平方：$\\pi(R - r)^2$ 不是圆环的面积。要减去小圆，不是加上它，也不能只算大圆。$2\\pi(R - r)$ 是两个周长之差，是长度，不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const big = rng.int(4, 20);
        const small = rng.int(1, big - 1);
        const s = rng.int(0, 359);
        const rs = (R * small) / big;
        const A = big * big - small * small;
        return {
          ...piProblem({
            prompt: t(
              `Find the area of the ring between the two circles with center $O$.${PI_EN}`,
              `求以 $O$ 为圆心的两个圆之间圆环的面积。${PI_ZH}`,
            ),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex((big - small) ** 2), piTex(big * big), piTex(big * big + small * small), piTex(2 * (big - small))],
            solution: t(
              `**Step 1: the large disk.** Its radius is $${big}$:${steps(`\\pi \\cdot ${big}^2 = ${piTex(big * big)}`)}**Step 2: the small disk.** Its radius is $${small}$:${steps(`\\pi \\cdot ${small}^2 = ${piTex(small * small)}`)}**Step 3: take the small disk out of the large one.**${steps(`A = ${piTex(big * big)} - ${piTex(small * small)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**Check.** Factor the difference of squares: $\\pi(${big} - ${small})(${big} + ${small}) = \\pi \\cdot ${big - small} \\cdot ${big + small} = ${piTex(A)}$.`,
              `**第一步：大圆面。** 半径是 $${big}$：${steps(`\\pi \\cdot ${big}^2 = ${piTex(big * big)}`)}**第二步：小圆面。** 半径是 $${small}$：${steps(`\\pi \\cdot ${small}^2 = ${piTex(small * small)}`)}**第三步：从大圆面中去掉小圆面。**${steps(`A = ${piTex(big * big)} - ${piTex(small * small)} = ${tex(piTex(A), u, 2)}`)}{{figure 0}}

**检验。** 用平方差分解：$\\pi(${big} - ${small})(${big} + ${small}) = \\pi \\cdot ${big - small} \\cdot ${big + small} = ${piTex(A)}$。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              circleAt(rs),
              ...center(),
              seg(O, on(s), true),
              { kind: "side", a: O, b: on(s), text: len(big, u) },
              seg(O, on(s + 150, rs), true),
              { kind: "side", a: O, b: on(s + 150, rs), text: len(small, u) },
            ],
            `Two circles with center O and radii ${big} ${u} and ${small} ${u}.`,
            `两个以 O 为圆心的圆，半径分别为 ${big} ${u} 和 ${small} ${u}。`,
          ),
          solutionFigures: [
            figure(
              [
                diskShade(R, "result", rs),
                circleAt(),
                circleAt(rs, O, "action"),
                ...center(),
                toned(O, on(s), "result", true),
                { kind: "side", a: O, b: on(s), text: len(big, u) },
                toned(O, on(s + 150, rs), "action", true),
                { kind: "side", a: O, b: on(s + 150, rs), text: len(small, u) },
              ],
              `The ring is the disk of radius ${big} ${u} with the disk of radius ${small} ${u} taken out.`,
              `圆环是半径 ${big} ${u} 的圆面去掉半径 ${small} ${u} 的圆面。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-of-shapes-with-semicircles",
      figure: partsDrawings["area-of-shapes-with-semicircles"],
      title: t("Areas of shapes with semicircles", "含半圆图形的面积"),
      explanation: t(
        `Split a composite shape into pieces you know. A semicircle drawn on a side of length $w$ has that side as its diameter, so its radius is $\\frac{w}{2}$, and it is half a disk: its area is $\\frac{1}{2}\\pi \\left(\\frac{w}{2}\\right)^2$. Add it when it sticks out of the shape, subtract it when it is cut away.

An $8$ cm by $4$ cm rectangle with a semicircle on a $4$ cm side: the semicircle has radius $2$ cm and area $\\frac{1}{2}\\pi \\cdot 2^2 = 2\\pi$ cm², so the shape has area $(32 + 2\\pi)$ cm². With the semicircle cut out instead, it is $(32 - 2\\pi)$ cm².

> **Watch out.** Halve the side to get the radius: using $w$ as the radius gives four times the semicircle. A semicircle is half a disk, so do not use the whole $\\pi \\left(\\frac{w}{2}\\right)^2$. Add or subtract as the figure shows, and do not leave the semicircle out.`,
        `把组合图形分成熟悉的几部分。画在长为 $w$ 的边上的半圆以这条边为直径，所以半径是 $\\frac{w}{2}$；它是半个圆面，面积是 $\\frac{1}{2}\\pi \\left(\\frac{w}{2}\\right)^2$。半圆突出在外就加上，被挖去就减去。

$8$ 厘米 × $4$ 厘米的长方形在一条 $4$ 厘米的边上有个半圆：半圆半径 $2$ 厘米，面积 $\\frac{1}{2}\\pi \\cdot 2^2 = 2\\pi$ 平方厘米，所以图形面积是 $(32 + 2\\pi)$ 平方厘米。若是挖去这个半圆，就是 $(32 - 2\\pi)$ 平方厘米。

> **注意。** 边长要减半才是半径：把 $w$ 当作半径会得到半圆的四倍。半圆是半个圆面，不要用整个 $\\pi \\left(\\frac{w}{2}\\right)^2$。按图加或减，也不要把半圆漏掉。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = 2 * rng.int(1, 8);
        const l = rng.int(w / 2 + 3, 22);
        const inward = rng.bool();
        const half = q(w * w, 8);
        const sign = inward ? -1 : 1;
        const pts = semicircleShape(l, w, inward);
        const ans = piSum(l * w, half.mul(q(sign)));
        const est = l * w + sign * 3 * half.toNumber();
        const exact = l * w + sign * Math.PI * half.toNumber();
        return {
          ...piProblem({
            prompt: inward
              ? t(
                  `A semicircle is cut out of a rectangle as shown. Find the area of the shape.${PI_EN}`,
                  `如图，从长方形中挖去一个半圆。求剩下图形的面积。${PI_ZH}`,
                )
              : t(
                  `The shape is a rectangle with a semicircle on one side. Find its area.${PI_EN}`,
                  `这个图形由一个长方形和它一边上的半圆组成。求它的面积。${PI_ZH}`,
                ),
            answer: ans,
            unit: `${u}^2`,
            wrong: [
              piSum(l * w, q(w * w, 4).mul(q(sign))),
              piSum(l * w, q(w * w, 2).mul(q(sign))),
              piSum(l * w, half.mul(q(-sign))),
              String(l * w),
            ],
            solution: t(
              `**Step 1: the rectangle.**${steps(`${l} \\cdot ${w} = ${l * w}`)}**Step 2: the semicircle.** Its diameter is the side of $${w}$, so its radius is $${w / 2}$, and it is half a disk:${steps(`\\frac{1}{2}\\pi \\cdot ${w / 2}^2 = ${piTex(half)}`)}**Step 3: ${inward ? "subtract it, since it is cut out" : "add it, since it sticks out"}.**${steps(`A = ${l * w} ${inward ? "-" : "+"} ${piTex(half)} = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**Check.** With $\\pi \\approx 3$, the semicircle is about $${near(3 * half.toNumber())}$, so the area is about $${near(est)}$; the exact value is about $${near(exact)}$, ${inward ? "a little less" : "a little more"}, as it should be since $\\pi > 3$.`,
              `**第一步：长方形。**${steps(`${l} \\cdot ${w} = ${l * w}`)}**第二步：半圆。** 它的直径是长 $${w}$ 的边，所以半径是 $${w / 2}$，它是半个圆面：${steps(`\\frac{1}{2}\\pi \\cdot ${w / 2}^2 = ${piTex(half)}`)}**第三步：${inward ? "半圆被挖去，减去它" : "半圆突出在外，加上它"}。**${steps(`A = ${l * w} ${inward ? "-" : "+"} ${piTex(half)} = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**检验。** 取 $\\pi \\approx 3$，半圆约为 $${near(3 * half.toNumber())}$，面积约为 $${near(est)}$；精确值约为 $${near(exact)}$，${inward ? "稍小一些" : "稍大一些"}，因为 $\\pi > 3$，正应如此。`,
            ),
          }),
          figure: figure(
            [
              { kind: "polygon", points: pts },
              { kind: "segment", a: [l, 0], b: [l, w], dashed: true },
              { kind: "side", a: [0, 0], b: [l, 0], text: len(l, u) },
              { kind: "side", a: [0, w], b: [0, 0], text: len(w, u) },
            ],
            `A rectangle ${l} ${u} by ${w} ${u} with a semicircle ${inward ? "cut out of" : "added on"} its ${w} ${u} side.`,
            `一个 ${l} ${u} × ${w} ${u} 的长方形，在 ${w} ${u} 的边上${inward ? "挖去" : "加上"}一个半圆。`,
          ),
          solutionFigures: [
            figure(
              semicircleMarks(l, w, inward, u, true),
              `The shape: the ${l} ${u} by ${w} ${u} rectangle ${inward ? "minus" : "plus"} a semicircle of radius ${w / 2} ${u}.`,
              `这个图形：${l} ${u} × ${w} ${u} 的长方形${inward ? "减去" : "加上"}半径 ${w / 2} ${u} 的半圆。`,
            ),
          ],
        };
      },
    },
    {
      id: "perimeter-of-shapes-with-semicircles",
      figure: partsDrawings["perimeter-of-shapes-with-semicircles"],
      title: t("Perimeters of shapes with semicircles", "含半圆图形的周长"),
      explanation: t(
        `The perimeter is the length of the outside boundary only, so trace it. A semicircle of diameter $w$ adds half a circumference, $\\frac{1}{2}\\pi w$, and the side it is drawn on is no longer part of the boundary, whether the semicircle sticks out or is cut in.

An $8$ cm by $4$ cm rectangle with a semicircle on a $4$ cm side: the straight sides are $8$, $4$ and $8$ cm, and the curve is $\\frac{1}{2}\\pi \\cdot 4 = 2\\pi$ cm, so the perimeter is $(20 + 2\\pi)$ cm, about $26.3$ cm.

> **Watch out.** Do not count the side under the semicircle, but do count the other three. The curve is half of $\\pi w$, not all of it, and it is a length from the circumference, not the semicircle's area.`,
        `周长只算外边界的长度，所以要沿边界走一圈。直径为 $w$ 的半圆贡献半个圆周 $\\frac{1}{2}\\pi w$；无论半圆是突出还是挖进去，它所在的那条边都不再是边界的一部分。

$8$ 厘米 × $4$ 厘米的长方形在一条 $4$ 厘米的边上有个半圆：直边是 $8$、$4$、$8$ 厘米，曲线是 $\\frac{1}{2}\\pi \\cdot 4 = 2\\pi$ 厘米，所以周长是 $(20 + 2\\pi)$ 厘米，约 $26.3$ 厘米。

> **注意。** 半圆所在的那条边不算，但另外三条边都要算。曲线是 $\\pi w$ 的一半，不是全部；它是来自周长的长度，不是半圆的面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = 2 * rng.int(1, 8);
        const l = rng.int(w / 2 + 3, 22);
        const inward = rng.bool();
        const straight = 2 * l + w;
        const ans = piSum(straight, q(w, 2));
        return {
          ...piProblem({
            prompt: inward
              ? t(
                  `A semicircle is cut out of a rectangle as shown. Find the perimeter of the shape.${PI_EN}`,
                  `如图，从长方形中挖去一个半圆。求剩下图形的周长。${PI_ZH}`,
                )
              : t(
                  `The shape is a rectangle with a semicircle on one side. Find its perimeter.${PI_EN}`,
                  `这个图形由一个长方形和它一边上的半圆组成。求它的周长。${PI_ZH}`,
                ),
            answer: ans,
            unit: u,
            wrong: [piSum(straight + w, q(w, 2)), piSum(straight, w), piSum(straight, q(w * w, 8)), piSum(straight - w, q(w, 2))],
            solution: t(
              `**Step 1: the straight sides.** Going around, the boundary has the sides $${l}$, $${w}$ and $${l}$; the dashed side under the semicircle is not on it:${steps(`${l} + ${w} + ${l} = ${straight}`)}**Step 2: the curve.** It is half the circumference of a circle with diameter $${w}$:${steps(`\\frac{1}{2}\\pi \\cdot ${w} = ${piTex(q(w, 2))}`)}**Step 3: add them.**${steps(`P = ${tex(`(${ans})`, u)}`)}{{figure 0}}

**Check.** The plain rectangle has perimeter $2 \\cdot ${l} + 2 \\cdot ${w} = ${2 * l + 2 * w}$. The semicircle swaps a side of $${w}$ for a curve of about $1.57 \\cdot ${w}$, so the shape's perimeter should be about $${2 * l + 2 * w} + 0.57 \\cdot ${w} \\approx ${near(straight + (Math.PI * w) / 2)}$, and indeed $${ans} \\approx ${near(straight + (Math.PI * w) / 2)}$.`,
              `**第一步：直边。** 沿边界走，直边是 $${l}$、$${w}$、$${l}$；半圆下面的虚线边不在边界上：${steps(`${l} + ${w} + ${l} = ${straight}`)}**第二步：曲线。** 它是直径 $${w}$ 的圆的半个周长：${steps(`\\frac{1}{2}\\pi \\cdot ${w} = ${piTex(q(w, 2))}`)}**第三步：相加。**${steps(`P = ${tex(`(${ans})`, u)}`)}{{figure 0}}

**检验。** 原来长方形的周长是 $2 \\cdot ${l} + 2 \\cdot ${w} = ${2 * l + 2 * w}$。半圆把一条 $${w}$ 的边换成了约 $1.57 \\cdot ${w}$ 的曲线，所以图形的周长应当约为 $${2 * l + 2 * w} + 0.57 \\cdot ${w} \\approx ${near(straight + (Math.PI * w) / 2)}$，确实 $${ans} \\approx ${near(straight + (Math.PI * w) / 2)}$。`,
            ),
          }),
          figure: figure(
            [
              { kind: "polygon", points: semicircleShape(l, w, inward) },
              { kind: "side", a: [0, 0], b: [l, 0], text: len(l, u) },
              { kind: "side", a: [0, w], b: [0, 0], text: len(w, u) },
            ],
            `A rectangle ${l} ${u} by ${w} ${u} with a semicircle ${inward ? "cut out of" : "added on"} its ${w} ${u} side.`,
            `一个 ${l} ${u} × ${w} ${u} 的长方形，在 ${w} ${u} 的边上${inward ? "挖去" : "加上"}一个半圆。`,
          ),
          solutionFigures: [
            figure(
              semicircleMarks(l, w, inward, u, false),
              `The boundary: three straight sides and a half circle of diameter ${w} ${u}; the dashed side is not on it.`,
              `边界：三条直边和直径 ${w} ${u} 的半圆；虚线边不在边界上。`,
            ),
          ],
        };
      },
    },
    {
      id: "shaded-regions-with-quarter-circles",
      figure: partsDrawings["shaded-regions-with-quarter-circles"],
      title: t("Shaded regions", "阴影部分的面积"),
      explanation: t(
        `To find the area of a region left over when one shape is removed from another, subtract the areas.

A quarter circle centered at a corner of a square, with radius equal to the side $s$, fills a quarter of a disk of radius $s$: its area is $\\frac{1}{4}\\pi s^2$. For $s = 4$ cm, the square has area $16$ cm² and the quarter circle $\\frac{1}{4}\\pi \\cdot 16 = 4\\pi$ cm², so the part of the square outside it has area $(16 - 4\\pi)$ cm², about $3.4$ cm².

> **Watch out.** The quarter circle is a quarter of $\\pi s^2$, not the whole disk and not half of it. The radius is the side $s$, not $\\frac{s}{2}$. And the region asked for is what is left of the square, not the quarter circle itself.`,
        `求一个图形去掉另一个图形后剩下部分的面积，就把面积相减。

以正方形的一个顶点为圆心、边长 $s$ 为半径的四分之一圆，占半径为 $s$ 的圆面的四分之一：面积是 $\\frac{1}{4}\\pi s^2$。当 $s = 4$ 厘米时，正方形面积是 $16$ 平方厘米，四分之一圆是 $\\frac{1}{4}\\pi \\cdot 16 = 4\\pi$ 平方厘米，所以正方形在它外面的部分面积是 $(16 - 4\\pi)$ 平方厘米，约 $3.4$ 平方厘米。

> **注意。** 四分之一圆是 $\\pi s^2$ 的四分之一，不是整个圆面，也不是一半。半径是边长 $s$，不是 $\\frac{s}{2}$。所求的是正方形剩下的部分，不是四分之一圆本身。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        const quarter = q(s * s, 4);
        const ans = piSum(s * s, quarter.neg());
        const qn = piNear(quarter);
        const square: Point[] = [
          [0, 0],
          [s, 0],
          [s, s],
          [0, s],
        ];
        return {
          ...piProblem({
            prompt: t(
              `A quarter circle centered at a corner of the square has a radius equal to the side of the square. Find the area of the part of the square outside the quarter circle.${PI_EN}`,
              `以正方形的一个顶点为圆心、边长为半径画四分之一圆。求正方形在四分之一圆外面部分的面积。${PI_ZH}`,
            ),
            answer: ans,
            unit: `${u}^2`,
            wrong: [piSum(s * s, -s * s), piSum(s * s, q(s * s, 2).neg()), piTex(quarter), piSum(s * s, q(s * s, 16).neg())],
            solution: t(
              `**Step 1: the square.**${steps(`${s}^2 = ${s * s}`)}**Step 2: the quarter circle.** Its radius is the side, $${s}$, and it is a quarter of that disk:${steps(`\\frac{1}{4}\\pi \\cdot ${s}^2 = ${piTex(quarter)}`)}**Step 3: take it out of the square.**${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**Check.** In decimals, $${ans} \\approx ${s * s} - ${qn} = ${near(s * s - Number(qn))}$. With $\\pi \\approx 3$ the quarter circle would be $\\frac{3}{4}$ of the square, leaving $\\frac{1}{4} \\cdot ${s * s} = ${near((s * s) / 4)}$; the true region is a little smaller, as it should be since $\\pi > 3$.`,
              `**第一步：正方形。**${steps(`${s}^2 = ${s * s}`)}**第二步：四分之一圆。** 半径就是边长 $${s}$，它是这个圆面的四分之一：${steps(`\\frac{1}{4}\\pi \\cdot ${s}^2 = ${piTex(quarter)}`)}**第三步：从正方形中去掉它。**${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**检验。** 用小数，$${ans} \\approx ${s * s} - ${qn} = ${near(s * s - Number(qn))}$。若取 $\\pi \\approx 3$，四分之一圆是正方形的 $\\frac{3}{4}$，剩下 $\\frac{1}{4} \\cdot ${s * s} = ${near((s * s) / 4)}$；实际区域稍小一些，因为 $\\pi > 3$，正应如此。`,
            ),
          }),
          figure: figure(
            [
              { kind: "polygon", points: square },
              ...arcAt(0, 90, s, [0, 0]),
              { kind: "dot", at: [0, 0] },
              { kind: "side", a: [0, 0], b: [s, 0], text: len(s, u) },
            ],
            `A square with side ${s} ${u} and a quarter circle centered at its bottom-left corner.`,
            `边长为 ${s} ${u} 的正方形，以左下角为圆心画有四分之一圆。`,
          ),
          solutionFigures: [
            figure(
              [
                { kind: "shade", points: [[s, s], ...arcPoints(0, 90, s, [0, 0]).reverse()], tone: "result" },
                { kind: "polygon", points: square },
                ...arcIn(0, 90, "action", s, [0, 0]),
                toned([0, 0], [s * Math.SQRT1_2, s * Math.SQRT1_2], "action", true),
                { kind: "side", a: [0, 0], b: [s, 0], text: len(s, u) },
                { kind: "dot", at: [0, 0] },
              ],
              `The shaded corner region is the ${s} ${u} square minus the quarter circle of radius ${s} ${u}.`,
              `阴影角区是 ${s} ${u} 的正方形减去半径 ${s} ${u} 的四分之一圆。`,
            ),
          ],
        };
      },
    },
  ],
};

/** squareWithCircle draws a square of side s with its inscribed circle, centered at the origin. */
function squareWithCircle(s: number, label: Mark[]): Mark[] {
  const h = s / 2;
  return [
    {
      kind: "polygon",
      points: [
        [-h, -h],
        [h, -h],
        [h, h],
        [-h, h],
      ],
    },
    circleAt(h),
    { kind: "dot", at: O },
    ...label,
  ];
}

/** inSquareMarks draws a square of side s with its inscribed circle for a solution: a diameter across the middle in the action tone labeled dText, and the bottom side in the result tone labeled sText. */
function inSquareMarks(s: number, dText: string, sText: string, extra: Mark[] = []): Mark[] {
  const h = s / 2;
  return squareWithCircle(s, [
    ...extra,
    toned([-h, 0], [h, 0], "action"),
    { kind: "side", a: [-h, 0], b: [h, 0], text: dText },
    toned([-h, -h], [h, -h], "result"),
    { kind: "side", a: [-h, -h], b: [h, -h], text: sText },
  ]);
}

/** squareMinusCircle shades the part of a square of side s, centered at the origin, outside its inscribed circle. */
function squareMinusCircle(s: number): Mark {
  const h = s / 2;
  return {
    kind: "shade",
    points: [
      [-h, -h],
      [h, -h],
      [h, h],
      [-h, h],
    ],
    holes: [circlePoints(h)],
    tone: "result",
  };
}

export const circlesInscribedInSquares: TopicDef = {
  id: "circles-inscribed-in-squares",
  title: t("Circles Inscribed in Squares", "正方形的内切圆"),
  summary: t(
    "Relate a square to the circle inscribed in it: the diameter equals the side.",
    "理解正方形与它的内切圆的关系：圆的直径等于正方形的边长。",
  ),
  prerequisites: ["areas-of-circles"],
  encompasses: [{ topic: "area-of-rectangles-and-squares", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.7.G.B.4"],
  intro: t(
    `We know how to find the area and circumference of a circle from its radius, and the area and perimeter of a square from its side. When a circle sits snugly inside a square, one length links the two.

A round cake just fits in a square box with a base of side $24$ cm, touching all four walls:

{{figure 0}}

Measured straight across through its center, from one wall to the opposite wall, the cake is $24$ cm wide, so its diameter is the side of the box and its radius is $12$ cm. Its top has area $\\pi \\cdot 12^2 = 144\\pi \\approx 452$ cm², out of $24^2 = 576$ cm² for the base of the box: the cake covers about $78.5\\%$ of it, and the four corners are empty.

So for a circle inscribed in a square, $d = s$. We use it to go between the square and the circle, for lengths, areas and the corners left over.`,
    `我们会由半径求圆的面积和周长，也会由边长求正方形的面积和周长。当一个圆正好嵌在正方形里时，一个长度就把两者联系起来。

一个圆蛋糕正好放进底面边长 $24$ 厘米的正方形盒子里，碰到四面盒壁：

{{figure 0}}

过蛋糕中心从一面盒壁量到对面的盒壁，蛋糕宽 $24$ 厘米，所以它的直径等于盒子的边长，半径是 $12$ 厘米。蛋糕顶面面积是 $\\pi \\cdot 12^2 = 144\\pi \\approx 452$ 平方厘米，而盒底面积是 $24^2 = 576$ 平方厘米：蛋糕盖住了约 $78.5\\%$，四个角是空的。

所以对于正方形的内切圆，$d = s$。我们用它在正方形和圆之间来回换算：长度、面积，以及剩下的四个角。`,
  ),
  introFigures: [
    figure(
      inSquareMarks(24, "24 cm", "24 cm"),
      "A round cake in a square box of side 24 cm: the cake's diameter across the middle equals the side of the box.",
      "边长 24 cm 的正方形盒子里的圆蛋糕：横穿中间的直径等于盒子的边长。",
    ),
  ],
  knowledgePoints: [
    {
      id: "side-and-radius",
      figure: partsDrawings["side-and-radius"],
      title: t("Side and radius", "边长与半径"),
      explanation: t(
        `A circle **inscribed** in a square touches all four sides. The diameter drawn parallel to two of the sides runs from the point where the circle touches one side to the point where it touches the opposite side, so it is exactly as long as the side:

$$d = s, \\qquad r = \\frac{s}{2}.$$

A circle of radius $7$ cm fits exactly in a square of side $2 \\cdot 7 = 14$ cm, whose perimeter is $4 \\cdot 14 = 56$ cm and area $14^2 = 196$ cm².

> **Watch out.** The side equals the diameter, not the radius: the radius is half the side, and the side is twice the radius. Use the side, $2r$, in the square's formulas: the perimeter is $4 \\cdot 2r$ and the area $(2r)^2$, not $4r$ or $r^2$.`,
        `**内切**于正方形的圆与正方形的四条边都相切。与两条边平行的那条直径，从圆与一条边的切点连到它与对边的切点，所以正好和边长一样长：

$$d = s, \\qquad r = \\frac{s}{2}.$$

半径为 $7$ 厘米的圆正好放进边长为 $2 \\cdot 7 = 14$ 厘米的正方形中，这个正方形的周长是 $4 \\cdot 14 = 56$ 厘米，面积是 $14^2 = 196$ 平方厘米。

> **注意。** 边长等于直径，不是半径：半径是边长的一半，边长是半径的两倍。正方形的公式里要用边长 $2r$：周长是 $4 \\cdot 2r$，面积是 $(2r)^2$，不是 $4r$ 或 $r^2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const s = rng.int(3, 40);
          const r = q(s, 2);
          return {
            ...numberProblem({
              prompt: t("A circle is inscribed in the square. Find the radius of the circle.", "正方形内有一个内切圆。求圆的半径。"),
              answer: r,
              unit: u,
              wrong: [s, 2 * s, q(s, 4)],
              solution: t(
                `**Step 1: the diameter.** The circle touches the left and right sides, so the diameter across the middle is as long as the side of the square:${steps(`d = s = ${s}`)}**Step 2: the radius.** The radius is half the diameter:${steps(`r = ${s % 2 === 0 ? `\\frac{${s}}{2} = ` : ""}${tex(r.toLatex(), u)}`)}{{figure 0}}

**Check.** Two radii make the diameter, which spans the square: $2 \\cdot ${r.toLatex()} = ${s}$, the side.`,
                `**第一步：直径。** 圆与左右两边相切，所以横穿中间的直径和正方形的边长一样长：${steps(`d = s = ${s}`)}**第二步：半径。** 半径是直径的一半：${steps(`r = ${s % 2 === 0 ? `\\frac{${s}}{2} = ` : ""}${tex(r.toLatex(), u)}`)}{{figure 0}}

**检验。** 两条半径组成直径，正好横跨正方形：$2 \\cdot ${r.toLatex()} = ${s}$，等于边长。`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
            solutionFigures: [
              figure(
                squareWithCircle(s, [
                  toned([-s / 2, 0], [s / 2, 0], "action"),
                  { kind: "side", a: [-s / 2, 0], b: [s / 2, 0], text: `d = ${len(s, u)}` },
                  toned(O, [0, s / 2], "result"),
                  { kind: "side", a: O, b: [0, s / 2], text: "r" },
                  { kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) },
                ]),
                `The diameter across the square equals the side, ${s} ${u}; the radius is half of it.`,
                `横跨正方形的直径等于边长 ${s} ${u}；半径是它的一半。`,
              ),
            ],
          };
        }
        const r = rng.int(2, 20);
        const fig = figure(
          squareWithCircle(2 * r, [seg(O, [r, 0], true), { kind: "side", a: O, b: [r, 0], text: len(r, u) }]),
          `A circle with radius ${r} ${u} inscribed in a square.`,
          `半径为 ${r} ${u} 的圆内切于一个正方形。`,
        );
        const solFig = figure(
          inSquareMarks(2 * r, `2 · ${len(r, u)}`, len(2 * r, u)),
          `The diameter, two radii of ${r} ${u}, equals the side of the square, ${2 * r} ${u}.`,
          `直径是两条 ${r} ${u} 的半径，等于正方形的边长 ${2 * r} ${u}。`,
        );
        if (kind === 1) {
          return {
            ...numberProblem({
              prompt: t("A circle is inscribed in the square. Find the perimeter of the square.", "正方形内有一个内切圆。求正方形的周长。"),
              answer: 8 * r,
              unit: u,
              wrong: [4 * r, 2 * r, 16 * r],
              solution: t(
                `**Step 1: the side of the square.** The diameter across the middle spans the square, so the side is the diameter, two radii:${steps(`s = 2 \\cdot ${r} = ${2 * r}`)}**Step 2: the perimeter.** A square has four equal sides:${steps(`P = 4 \\cdot ${2 * r} = ${tex(8 * r, u)}`)}{{figure 0}}

**Check.** The circle inside has circumference $2\\pi \\cdot ${r} \\approx ${piNear(2 * r)}$. It is shorter than the square around it, as it must be: $${piNear(2 * r)} < ${8 * r}$.`,
                `**第一步：正方形的边长。** 横穿中间的直径跨过整个正方形，所以边长等于直径，即两条半径：${steps(`s = 2 \\cdot ${r} = ${2 * r}`)}**第二步：周长。** 正方形有四条相等的边：${steps(`P = 4 \\cdot ${2 * r} = ${tex(8 * r, u)}`)}{{figure 0}}

**检验。** 里面的圆周长是 $2\\pi \\cdot ${r} \\approx ${piNear(2 * r)}$。它比外面的正方形短，正应如此：$${piNear(2 * r)} < ${8 * r}$。`,
              ),
            }),
            figure: fig,
            solutionFigures: [solFig],
          };
        }
        return {
          ...numberProblem({
            prompt: t("A circle is inscribed in the square. Find the area of the square.", "正方形内有一个内切圆。求正方形的面积。"),
            answer: 4 * r * r,
            unit: `${u}^2`,
            wrong: [r * r, 2 * r * r, 8 * r],
            solution: t(
              `**Step 1: the side of the square.** The side is the diameter, two radii:${steps(`s = 2 \\cdot ${r} = ${2 * r}`)}**Step 2: the area.** Square the side:${steps(`A = ${2 * r}^2 = ${tex(4 * r * r, u, 2)}`)}{{figure 0}}

**Check.** The circle inside has area $\\pi \\cdot ${r}^2 \\approx ${piNear(r * r)}$, which should be about $0.785$ of the square: $0.785 \\cdot ${4 * r * r} \\approx ${near(0.785 * 4 * r * r)}$.`,
              `**第一步：正方形的边长。** 边长等于直径，即两条半径：${steps(`s = 2 \\cdot ${r} = ${2 * r}`)}**第二步：面积。** 把边长平方：${steps(`A = ${2 * r}^2 = ${tex(4 * r * r, u, 2)}`)}{{figure 0}}

**检验。** 里面的圆面积是 $\\pi \\cdot ${r}^2 \\approx ${piNear(r * r)}$，应约为正方形的 $0.785$：$0.785 \\cdot ${4 * r * r} \\approx ${near(0.785 * 4 * r * r)}$。`,
            ),
          }),
          figure: fig,
          solutionFigures: [solFig],
        };
      },
    },
    {
      id: "area-of-an-inscribed-circle",
      figure: partsDrawings["area-of-an-inscribed-circle"],
      title: t("Area of an inscribed circle", "内切圆的面积"),
      explanation: t(
        `The inscribed circle of a square of side $s$ has diameter $s$, so its radius is $\\frac{s}{2}$ and its area is

$$\\pi \\left(\\frac{s}{2}\\right)^2 = \\frac{\\pi s^2}{4}.$$

That is $\\frac{\\pi}{4} \\approx 0.785$ of the square's area. A square of side $8$ m has an inscribed circle of radius $4$ m and area $16\\pi$ m². A square of area $36$ m² has side $\\sqrt{36} = 6$ m, so its inscribed circle has radius $3$ m and area $9\\pi$ m².

> **Watch out.** The radius is half the side: using the side as the radius gives $\\pi s^2$, four times too much. Square the whole radius, $\\left(\\frac{s}{2}\\right)^2 = \\frac{s^2}{4}$, not $\\frac{s^2}{2}$. And $\\pi s$ is the circumference, not the area.`,
        `边长为 $s$ 的正方形，内切圆直径是 $s$，所以半径是 $\\frac{s}{2}$，面积是

$$\\pi \\left(\\frac{s}{2}\\right)^2 = \\frac{\\pi s^2}{4}.$$

它是正方形面积的 $\\frac{\\pi}{4} \\approx 0.785$。边长为 $8$ 米的正方形，内切圆半径 $4$ 米，面积 $16\\pi$ 平方米。面积为 $36$ 平方米的正方形边长是 $\\sqrt{36} = 6$ 米，所以内切圆半径 $3$ 米，面积 $9\\pi$ 平方米。

> **注意。** 半径是边长的一半：把边长当半径会得到 $\\pi s^2$，大了四倍。要把整个半径平方，$\\left(\\frac{s}{2}\\right)^2 = \\frac{s^2}{4}$，不是 $\\frac{s^2}{2}$。$\\pi s$ 是周长，不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 30);
        const a = q(s * s, 4);
        const half = q(s, 2);
        const check = t(
          `**Check.** The circle should fill about $0.785$ of the square: $0.785 \\cdot ${s * s} \\approx ${near(0.785 * s * s)}$, and $${piTex(a)} \\approx ${piNear(a)}$.`,
          `**检验。** 圆应占正方形的约 $0.785$：$0.785 \\cdot ${s * s} \\approx ${near(0.785 * s * s)}$，而 $${piTex(a)} \\approx ${piNear(a)}$。`,
        );
        const solFig = figure(
          [
            diskShade(s / 2, "result"),
            ...inSquareMarks(s, len(s, u), len(s, u), []),
            toned(O, [0, s / 2], "action"),
            { kind: "side", a: O, b: [0, s / 2], text: len(half.toNumber(), u) },
          ],
          `The circle's diameter is the side, ${s} ${u}, so its radius is ${half.toNumber()} ${u}.`,
          `圆的直径等于边长 ${s} ${u}，所以半径是 ${half.toNumber()} ${u}。`,
        );
        const area = (en: string, zh: string) =>
          t(
            `${en}**Step 2: the radius.** The diameter equals the side, so the radius is half of it:${steps(`r = \\frac{${s}}{2}${half.d === 1n ? ` = ${s / 2}` : ""}`)}**Step 3: the area of the circle.**${steps(`A = \\pi \\cdot ${half.d === 1n ? half.toLatex() : `\\left(${half.toLatex()}\\right)`}^2 = ${tex(piTex(a), u, 2)}`)}{{figure 0}}

${check.en}`,
            `${zh}**第二步：半径。** 直径等于边长，所以半径是它的一半：${steps(`r = \\frac{${s}}{2}${half.d === 1n ? ` = ${s / 2}` : ""}`)}**第三步：圆的面积。**${steps(`A = \\pi \\cdot ${half.d === 1n ? half.toLatex() : `\\left(${half.toLatex()}\\right)`}^2 = ${tex(piTex(a), u, 2)}`)}{{figure 0}}

${check["zh-CN"]}`,
          );
        if (rng.bool()) {
          return {
            ...piProblem({
              prompt: t(
                `A circle is inscribed in the square. Find the area of the circle.${PI_EN}`,
                `正方形内有一个内切圆。求圆的面积。${PI_ZH}`,
              ),
              answer: piTex(a),
              unit: `${u}^2`,
              wrong: [piTex(s * s), piTex(q(s * s, 2)), piTex(s)],
              solution: area(
                `**Step 1: the diameter.** The circle touches opposite sides of the square, so its diameter is the side, $${s}$.\n\n`,
                `**第一步：直径。** 圆与正方形的对边相切，所以直径等于边长 $${s}$。\n\n`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
            solutionFigures: [solFig],
          };
        }
        return {
          ...piProblem({
            prompt: t(
              `A square has an area of $${tex(s * s, u, 2)}$. Find the area of the circle inscribed in it.${PI_EN}`,
              `一个正方形的面积是 $${tex(s * s, u, 2)}$。求它的内切圆的面积。${PI_ZH}`,
            ),
            answer: piTex(a),
            unit: `${u}^2`,
            wrong: [piTex(s * s), piTex(q(s * s, 2)), piTex(s)],
            solution: area(
              `**Step 1: the side.** The area is the side squared, so${steps(`s = \\sqrt{${s * s}} = ${s}`)}`,
              `**第一步：边长。** 面积是边长的平方，所以${steps(`s = \\sqrt{${s * s}} = ${s}`)}`,
            ),
          }),
          solutionFigures: [solFig],
        };
      },
    },
    {
      id: "between-the-square-and-the-circle",
      figure: partsDrawings["between-the-square-and-the-circle"],
      title: t("Between the square and the circle", "正方形与圆之间"),
      explanation: t(
        `The four corners of a square outside its inscribed circle are the square with the circle taken out, so their total area is

$$s^2 - \\frac{\\pi s^2}{4}.$$

For $s = 10$ cm that is $100 - 25\\pi$, about $21.5$ cm². Lengths work through the same link $d = s$: the inscribed circle's circumference is $\\pi d = \\pi s$. A square of perimeter $40$ cm has side $10$ cm, so its inscribed circle has circumference $10\\pi$ cm.

> **Watch out.** The circle's radius is $\\frac{s}{2}$: subtracting $\\pi s^2$ or $\\frac{\\pi s^2}{2}$ takes out too much. Subtract from the square's area $s^2$, not its perimeter $4s$, and do not stop at the circle. For the circumference, find the side first: the perimeter $4s$ is not the diameter.`,
        `正方形在内切圆外的四个角，就是正方形去掉圆，所以它们的总面积是

$$s^2 - \\frac{\\pi s^2}{4}.$$

当 $s = 10$ 厘米时，它是 $100 - 25\\pi$，约 $21.5$ 平方厘米。长度也通过同一个关系 $d = s$ 来求：内切圆的周长是 $\\pi d = \\pi s$。周长为 $40$ 厘米的正方形边长是 $10$ 厘米，所以内切圆周长是 $10\\pi$ 厘米。

> **注意。** 圆的半径是 $\\frac{s}{2}$：减去 $\\pi s^2$ 或 $\\frac{\\pi s^2}{2}$ 都减多了。要从正方形的面积 $s^2$ 中减，不是从周长 $4s$ 中减，也不能停在圆的面积上。求周长时要先求边长：周长 $4s$ 不是直径。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 30);
        const a = q(s * s, 4);
        if (rng.bool()) {
          const ans = piSum(s * s, a.neg());
          const an = piNear(a);
          return {
            ...piProblem({
              prompt: t(
                `A circle is inscribed in the square. Find the area of the part of the square outside the circle.${PI_EN}`,
                `正方形内有一个内切圆。求正方形在圆外部分的面积。${PI_ZH}`,
              ),
              answer: ans,
              unit: `${u}^2`,
              wrong: [piSum(s * s, -s * s), piSum(s * s, q(s * s, 2).neg()), piTex(a), piSum(4 * s, a.neg())],
              solution: t(
                `**Step 1: the square.**${steps(`${s}^2 = ${s * s}`)}**Step 2: the circle.** Its diameter is the side, so its radius is $\\frac{${s}}{2}$:${steps(`\\pi \\left(\\frac{${s}}{2}\\right)^2 = ${piTex(a)}`)}**Step 3: take the circle out of the square.** What is left is the four corners:${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**Check.** In decimals, $${ans} \\approx ${s * s} - ${an} = ${near(s * s - Number(an))}$. With $\\pi \\approx 3$ the circle would be $\\frac{3}{4}$ of the square, leaving $\\frac{1}{4} \\cdot ${s * s} = ${near((s * s) / 4)}$; the true corners are a little smaller, as they should be since $\\pi > 3$.`,
                `**第一步：正方形。**${steps(`${s}^2 = ${s * s}`)}**第二步：圆。** 直径等于边长，所以半径是 $\\frac{${s}}{2}$：${steps(`\\pi \\left(\\frac{${s}}{2}\\right)^2 = ${piTex(a)}`)}**第三步：从正方形中去掉圆。** 剩下的就是四个角：${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**检验。** 用小数，$${ans} \\approx ${s * s} - ${an} = ${near(s * s - Number(an))}$。若取 $\\pi \\approx 3$，圆是正方形的 $\\frac{3}{4}$，剩下 $\\frac{1}{4} \\cdot ${s * s} = ${near((s * s) / 4)}$；实际的四个角稍小一些，因为 $\\pi > 3$，正应如此。`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
            solutionFigures: [
              figure(
                [
                  squareMinusCircle(s),
                  ...squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
                ],
                `The four shaded corners: the ${s} ${u} square with its inscribed circle taken out.`,
                `四个阴影角：${s} ${u} 的正方形去掉它的内切圆。`,
              ),
            ],
          };
        }
        return {
          ...piProblem({
            prompt: t(
              `A square has a perimeter of $${tex(4 * s, u)}$. Find the circumference of the circle inscribed in it.${PI_EN}`,
              `一个正方形的周长是 $${tex(4 * s, u)}$。求它的内切圆的周长。${PI_ZH}`,
            ),
            answer: piTex(s),
            unit: u,
            wrong: [piTex(4 * s), piTex(2 * s), piTex(q(s, 2))],
            solution: t(
              `**Step 1: the side.** A square has four equal sides:${steps(`s = ${4 * s} \\div 4 = ${s}`)}**Step 2: the diameter.** The inscribed circle's diameter is the side, $${s}$.

**Step 3: the circumference.**${steps(`C = \\pi d = ${tex(piTex(s), u)}`)}{{figure 0}}

**Check.** By the radius, $r = \\frac{${s}}{2}$ and $C = 2\\pi r = 2\\pi \\cdot \\frac{${s}}{2} = ${piTex(s)}$, the same. And $${piTex(s)} \\approx ${piNear(s)}$ is less than the square's perimeter $${4 * s}$, as it must be for a circle inside it.`,
              `**第一步：边长。** 正方形有四条相等的边：${steps(`s = ${4 * s} \\div 4 = ${s}`)}**第二步：直径。** 内切圆的直径等于边长 $${s}$。

**第三步：周长。**${steps(`C = \\pi d = ${tex(piTex(s), u)}`)}{{figure 0}}

**检验。** 用半径算，$r = \\frac{${s}}{2}$，$C = 2\\pi r = 2\\pi \\cdot \\frac{${s}}{2} = ${piTex(s)}$，结果相同。而且 $${piTex(s)} \\approx ${piNear(s)}$ 小于正方形的周长 $${4 * s}$，圆在正方形里面，正应如此。`,
            ),
          }),
          solutionFigures: [
            figure(
              inSquareMarks(s, `d = ${len(s, u)}`, len(s, u), [circleAt(s / 2, O, "result")]),
              `The inscribed circle of a square of side ${s} ${u} has diameter ${s} ${u}.`,
              `边长 ${s} ${u} 的正方形的内切圆直径是 ${s} ${u}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** circleWithSquare draws a circle of radius 5 with an inscribed square turned by rot degrees, its diagonals dashed. */
function circleWithSquare(rot: number, label: Mark[]): Mark[] {
  const v = [0, 1, 2, 3].map((k) => on(rot + 45 + 90 * k));
  return [
    circleAt(),
    { kind: "polygon", points: v },
    { kind: "segment", a: v[0]!, b: v[2]!, dashed: true },
    { kind: "segment", a: v[1]!, b: v[3]!, dashed: true },
    { kind: "dot", at: O },
    ...label,
  ];
}

/** inCircleMarks draws a circle with its inscribed square for a solution: one of the four right triangles shaded, its right angle at the center marked, its legs in the action tone labeled leg, and its hypotenuse, a side of the square, in the result tone labeled side when given. */
function inCircleMarks(leg: string, side?: string): Mark[] {
  const v = [0, 1, 2, 3].map((k) => on(45 + 90 * k));
  const [a, b] = [v[3]!, v[0]!];
  return [
    { kind: "shade", points: [O, a, b], tone: "result" },
    ...circleWithSquare(0, []),
    toned(O, a, "action"),
    toned(O, b, "action"),
    { kind: "right", vertex: O, from: a, to: b },
    { kind: "side", a: O, b, text: leg },
    toned(a, b, "result"),
    ...(side ? [{ kind: "side", a, b, text: side } as const] : []),
  ];
}

export const squaresInscribedInCircles: TopicDef = {
  id: "squares-inscribed-in-circles",
  title: t("Squares Inscribed in Circles", "圆的内接正方形"),
  summary: t(
    "Relate a circle to the square inscribed in it: the diagonals of the square are diameters.",
    "理解圆与它的内接正方形的关系：正方形的对角线是圆的直径。",
  ),
  prerequisites: ["circles-inscribed-in-squares", "simplifying-square-roots", "area-of-triangles"],
  encompasses: [{ topic: "areas-of-circles", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.C.A.3"],
  intro: t(
    `A circle inside a square has the side as its diameter. Turn the picture inside out, a square inside a circle with its four corners on the circle, and now the square's **diagonal** is the diameter.

A carpenter cuts the largest square beam from a round log with a diameter of $40$ cm:

{{figure 0}}

Both diagonals of the square run corner to corner through the center, so each is a diameter, $40$ cm. They are perpendicular, and they cut the square into four right triangles whose legs are radii of $20$ cm. Each triangle has area $\\frac{1}{2} \\cdot 20 \\cdot 20 = 200$ cm², so the beam's cross-section is $4 \\cdot 200 = 800$ cm². Its side is $\\sqrt{800} = 20\\sqrt{2} \\approx 28.3$ cm, longer than the radius and shorter than the diameter.

We use these four triangles to find the area and the side of an inscribed square, and the parts of the circle outside it.`,
    `圆在正方形里面时，边长就是直径。反过来，把正方形放进圆里，四个顶点都在圆上，这时正方形的**对角线**就是直径。

木匠要从直径 $40$ 厘米的圆木中锯出最大的正方形木料：

{{figure 0}}

正方形的两条对角线都从一个顶点经过圆心连到对面的顶点，所以都是直径，长 $40$ 厘米。它们互相垂直，把正方形分成四个直角三角形，直角边都是 $20$ 厘米的半径。每个三角形面积是 $\\frac{1}{2} \\cdot 20 \\cdot 20 = 200$ 平方厘米，所以木料的截面是 $4 \\cdot 200 = 800$ 平方厘米。它的边长是 $\\sqrt{800} = 20\\sqrt{2} \\approx 28.3$ 厘米，比半径长，比直径短。

我们用这四个三角形来求内接正方形的面积和边长，以及圆在它外面的部分。`,
  ),
  introFigures: [
    figure(
      inCircleMarks("20 cm"),
      "A square cut from a round log of diameter 40 cm: its diagonals are diameters, cutting it into four right triangles with legs of 20 cm.",
      "从直径 40 cm 的圆木中锯出的正方形：对角线是直径，把它分成四个直角边为 20 cm 的直角三角形。",
    ),
  ],
  knowledgePoints: [
    {
      id: "area-of-an-inscribed-square",
      figure: partsDrawings["area-of-an-inscribed-square"],
      title: t("Area of an inscribed square", "内接正方形的面积"),
      explanation: t(
        `A square **inscribed** in a circle has all four vertices on the circle. Each diagonal joins opposite vertices through the center, so it is a diameter; the diagonals of a square are perpendicular and bisect each other. They cut the square into four right triangles whose legs are radii, each of area $\\frac{1}{2} r^2$, so

$$A = 4 \\cdot \\frac{1}{2} r^2 = 2r^2.$$

A square inscribed in a circle of radius $5$ cm has area $2 \\cdot 25 = 50$ cm². In terms of the diameter, the legs are $\\frac{d}{2}$ and $A = \\frac{d^2}{2}$: for $d = 6$ m, $A = 18$ m².

> **Watch out.** The square around the circle, of side $2r$, has area $4r^2$; the square inside has only half that. The area is $2r^2$, not $r^2$, and it is not the length $4r$. Given the diameter, halve it for the legs: $d^2$ and $\\frac{d^2}{4}$ are not the area.`,
        `**内接**于圆的正方形四个顶点都在圆上。每条对角线经过圆心连接相对的顶点，所以是直径；正方形的对角线互相垂直平分。它们把正方形分成四个直角三角形，直角边都是半径，每个面积 $\\frac{1}{2} r^2$，所以

$$A = 4 \\cdot \\frac{1}{2} r^2 = 2r^2.$$

半径为 $5$ 厘米的圆的内接正方形面积是 $2 \\cdot 25 = 50$ 平方厘米。用直径表示，直角边是 $\\frac{d}{2}$，$A = \\frac{d^2}{2}$：当 $d = 6$ 米时，$A = 18$ 平方米。

> **注意。** 圆外面那个边长 $2r$ 的正方形面积是 $4r^2$；圆里面的正方形只有它的一半。面积是 $2r^2$，不是 $r^2$，也不是长度 $4r$。已知直径时，直角边是直径的一半：$d^2$ 和 $\\frac{d^2}{4}$ 都不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const rot = rng.int(0, 89);
        if (rng.bool()) {
          const r = rng.int(2, 20);
          return {
            ...numberProblem({
              prompt: t(
                "A square is inscribed in a circle with center $O$. Find the area of the square.",
                "一个正方形内接于以 $O$ 为圆心的圆。求正方形的面积。",
              ),
              answer: 2 * r * r,
              unit: `${u}^2`,
              wrong: [4 * r * r, r * r, 4 * r],
              solution: t(
                `**Step 1: the four triangles.** The diagonals are diameters; they are perpendicular and meet at $O$, so they cut the square into four right triangles whose legs are radii of $${r}$.

**Step 2: one triangle.**${steps(`\\frac{1}{2} \\cdot ${r} \\cdot ${r} = ${q(r * r, 2).toLatex()}`)}**Step 3: the square.** Four such triangles:${steps(`A = 4 \\cdot ${q(r * r, 2).toLatex()} = ${tex(2 * r * r, u, 2)}`)}{{figure 0}}

**Check.** A square's area is also half the product of its diagonals, here two diameters of $${2 * r}$: $\\frac{1}{2} \\cdot ${2 * r} \\cdot ${2 * r} = ${2 * r * r}$.`,
                `**第一步：四个三角形。** 对角线是直径，互相垂直且交于 $O$，所以把正方形分成四个直角三角形，直角边都是长 $${r}$ 的半径。

**第二步：一个三角形。**${steps(`\\frac{1}{2} \\cdot ${r} \\cdot ${r} = ${q(r * r, 2).toLatex()}`)}**第三步：正方形。** 四个这样的三角形：${steps(`A = 4 \\cdot ${q(r * r, 2).toLatex()} = ${tex(2 * r * r, u, 2)}`)}{{figure 0}}

**检验。** 正方形的面积也等于两条对角线乘积的一半，这里是两条长 $${2 * r}$ 的直径：$\\frac{1}{2} \\cdot ${2 * r} \\cdot ${2 * r} = ${2 * r * r}$。`,
              ),
            }),
            figure: figure(
              circleWithSquare(rot, [{ kind: "side", a: O, b: on(rot + 45), text: len(r, u) }]),
              `A square inscribed in a circle of radius ${r} ${u}, with its diagonals drawn.`,
              `一个内接于半径为 ${r} ${u} 的圆的正方形，画出了对角线。`,
            ),
            solutionFigures: [
              figure(
                inCircleMarks(len(r, u)),
                `The diagonals cut the square into four right triangles with legs of ${r} ${u}.`,
                `对角线把正方形分成四个直角边为 ${r} ${u} 的直角三角形。`,
              ),
            ],
          };
        }
        const d = rng.int(3, 30);
        const half = q(d, 2);
        const tri = q(d * d, 8);
        return {
          ...numberProblem({
            prompt: t(
              `A square is inscribed in a circle with a diameter of $${tex(d, u)}$. Find the area of the square.`,
              `一个正方形内接于直径为 $${tex(d, u)}$ 的圆。求正方形的面积。`,
            ),
            answer: q(d * d, 2),
            unit: `${u}^2`,
            wrong: [d * d, q(d * d, 4), 2 * d * d],
            solution: t(
              `**Step 1: the four triangles.** The diagonals of the square are diameters of $${d}$, perpendicular and meeting at the center, so they cut the square into four right triangles with legs of half a diameter, $${half.toLatex()}$.

**Step 2: one triangle.**${steps(`\\frac{1}{2} \\cdot ${half.toLatex()} \\cdot ${half.toLatex()} = ${tri.toLatex()}`)}**Step 3: the square.** Four such triangles:${steps(`A = 4 \\cdot ${tri.toLatex()} = ${tex(q(d * d, 2).toLatex(), u, 2)}`)}{{figure 0}}

**Check.** Half the product of the diagonals: $\\frac{1}{2} \\cdot ${d} \\cdot ${d} = ${q(d * d, 2).toLatex()}$.`,
              `**第一步：四个三角形。** 正方形的对角线是长 $${d}$ 的直径，互相垂直且交于圆心，所以把正方形分成四个直角三角形，直角边是直径的一半 $${half.toLatex()}$。

**第二步：一个三角形。**${steps(`\\frac{1}{2} \\cdot ${half.toLatex()} \\cdot ${half.toLatex()} = ${tri.toLatex()}`)}**第三步：正方形。** 四个这样的三角形：${steps(`A = 4 \\cdot ${tri.toLatex()} = ${tex(q(d * d, 2).toLatex(), u, 2)}`)}{{figure 0}}

**检验。** 两条对角线乘积的一半：$\\frac{1}{2} \\cdot ${d} \\cdot ${d} = ${q(d * d, 2).toLatex()}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              inCircleMarks(len(half.toNumber(), u)),
              `The diagonals, diameters of ${d} ${u}, cut the square into four right triangles with legs of ${half.toNumber()} ${u}.`,
              `对角线是长 ${d} ${u} 的直径，把正方形分成四个直角边为 ${half.toNumber()} ${u} 的直角三角形。`,
            ),
          ],
        };
      },
    },
    {
      id: "side-of-an-inscribed-square",
      figure: partsDrawings["side-of-an-inscribed-square"],
      title: t("Side of an inscribed square", "内接正方形的边长"),
      explanation: t(
        `Each side of the inscribed square is the hypotenuse of one of the four right triangles, whose legs are radii. By the Pythagorean theorem, $s^2 = r^2 + r^2 = 2r^2$, so

$$s = \\sqrt{2r^2} = r\\sqrt{2}.$$

A square inscribed in a circle of radius $6$ cm has side $\\sqrt{72} = 6\\sqrt{2}$ cm, about $8.5$ cm. Going the other way, a square of side $s$ has diagonal $s\\sqrt{2}$, a diameter, so its circle has radius $\\frac{s\\sqrt{2}}{2}$: for $s = 4$, $r = 2\\sqrt{2}$.

> **Watch out.** The side is not the radius and not the diameter: it is $r\\sqrt{2} \\approx 1.41r$, between the two. Simplify the root, $\\sqrt{2r^2} = r\\sqrt{2}$, and do not double it. Going from the side to the radius, halve the diagonal, and write $\\frac{s}{\\sqrt{2}}$ without a root in the denominator.`,
        `内接正方形的每条边都是四个直角三角形之一的斜边，直角边都是半径。由勾股定理，$s^2 = r^2 + r^2 = 2r^2$，所以

$$s = \\sqrt{2r^2} = r\\sqrt{2}.$$

半径为 $6$ 厘米的圆的内接正方形边长是 $\\sqrt{72} = 6\\sqrt{2}$ 厘米，约 $8.5$ 厘米。反过来，边长为 $s$ 的正方形对角线是 $s\\sqrt{2}$，就是直径，所以外接圆半径是 $\\frac{s\\sqrt{2}}{2}$：当 $s = 4$ 时，$r = 2\\sqrt{2}$。

> **注意。** 边长既不是半径也不是直径：它是 $r\\sqrt{2} \\approx 1.41r$，介于两者之间。根式要化简，$\\sqrt{2r^2} = r\\sqrt{2}$，也不要再乘以 $2$。由边长求半径时，要取对角线的一半，并且把 $\\frac{s}{\\sqrt{2}}$ 化成分母不含根号的形式。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const r = rng.int(2, 20);
          return {
            ...radicalProblem({
              prompt: t(
                `A square is inscribed in a circle with a radius of $${tex(r, u)}$. Find the side length of the square, in ${unitWord(u)}, in simplest radical form.`,
                `一个正方形内接于半径为 $${tex(r, u)}$ 的圆。求正方形的边长（单位：${u}），写成最简根式。`,
              ),
              answer: [r, 2],
              wrong: [String(2 * r), `\\sqrt{${2 * r * r}}`, radical(2 * r, 2), String(r)],
              solution: t(
                `**Step 1: a right triangle.** Two half-diagonals, radii of $${r}$, meet at right angles at the center, and a side of the square joins their ends. By the Pythagorean theorem:${steps(`s^2 = ${r}^2 + ${r}^2 = ${2 * r * r}`)}**Step 2: the side.** Take the square root and simplify, since $${2 * r * r} = ${r * r} \\cdot 2$:${steps(`s = \\sqrt{${2 * r * r}} = \\sqrt{${r * r}} \\cdot \\sqrt{2} = ${radical(r, 2)}`)}{{figure 0}}

**Check.** $${radical(r, 2)} \\approx 1.414 \\cdot ${r} \\approx ${near(Math.SQRT2 * r)}$, between the radius $${r}$ and the diameter $${2 * r}$, as a side of the square must be.`,
                `**第一步：一个直角三角形。** 两条半对角线是长 $${r}$ 的半径，在圆心处互相垂直，正方形的一条边连接它们的端点。由勾股定理：${steps(`s^2 = ${r}^2 + ${r}^2 = ${2 * r * r}`)}**第二步：边长。** 开平方并化简，因为 $${2 * r * r} = ${r * r} \\cdot 2$：${steps(`s = \\sqrt{${2 * r * r}} = \\sqrt{${r * r}} \\cdot \\sqrt{2} = ${radical(r, 2)}`)}{{figure 0}}

**检验。** $${radical(r, 2)} \\approx 1.414 \\cdot ${r} \\approx ${near(Math.SQRT2 * r)}$，介于半径 $${r}$ 和直径 $${2 * r}$ 之间，正方形的边长正应如此。`,
              ),
            }),
            solutionFigures: [
              figure(
                inCircleMarks(len(r, u), "s"),
                `A side s of the square is the hypotenuse of a right triangle with legs of ${r} ${u}.`,
                `正方形的边 s 是直角边为 ${r} ${u} 的直角三角形的斜边。`,
              ),
            ],
          };
        }
        if (kind === 1) {
          const d = rng.int(3, 30);
          const c = q(d, 2);
          const sq = q(d * d, 2);
          const simple = radical(c, 2);
          const viaRoot = `\\frac{${d}\\sqrt{2}}{2}`;
          return {
            ...radicalProblem({
              prompt: t(
                `A square is inscribed in a circle with a diameter of $${tex(d, u)}$. Find the side length of the square, in ${unitWord(u)}, in simplest radical form.`,
                `一个正方形内接于直径为 $${tex(d, u)}$ 的圆。求正方形的边长（单位：${u}），写成最简根式。`,
              ),
              answer: [c, 2],
              wrong: [String(d), radical(d, 2), radical(q(d, 4), 2)],
              solution: t(
                `**Step 1: the area.** The diagonals of the square are diameters of $${d}$, so the square is four right triangles with legs $${c.toLatex()}$, and its area is half the product of the diagonals:${steps(`s^2 = \\frac{${d}^2}{2} = ${sq.toLatex()}`)}**Step 2: the side.** Take the square root, then clear the root from the denominator:${steps(`s = \\sqrt{${sq.toLatex()}} = \\frac{${d}}{\\sqrt{2}} = ${viaRoot}${viaRoot === simple ? "" : ` = ${simple}`}`)}{{figure 0}}

**Check.** The diagonal of a square is its side times $\\sqrt{2}$, and here it should be the diameter: $${simple} \\cdot \\sqrt{2} = ${c.toLatex()} \\cdot 2 = ${d}$.`,
                `**第一步：面积。** 正方形的对角线是长 $${d}$ 的直径，所以正方形由四个直角边为 $${c.toLatex()}$ 的直角三角形组成，面积是两条对角线乘积的一半：${steps(`s^2 = \\frac{${d}^2}{2} = ${sq.toLatex()}`)}**第二步：边长。** 开平方，再把分母中的根号化去：${steps(`s = \\sqrt{${sq.toLatex()}} = \\frac{${d}}{\\sqrt{2}} = ${viaRoot}${viaRoot === simple ? "" : ` = ${simple}`}`)}{{figure 0}}

**检验。** 正方形的对角线等于边长乘以 $\\sqrt{2}$，这里应等于直径：$${simple} \\cdot \\sqrt{2} = ${c.toLatex()} \\cdot 2 = ${d}$。`,
              ),
            }),
            solutionFigures: [
              figure(
                inCircleMarks(len(c.toNumber(), u), "s"),
                `The diagonals are diameters of ${d} ${u}; a side s is the hypotenuse of a right triangle with legs of ${c.toNumber()} ${u}.`,
                `对角线是长 ${d} ${u} 的直径；边 s 是直角边为 ${c.toNumber()} ${u} 的直角三角形的斜边。`,
              ),
            ],
          };
        }
        const s = rng.int(2, 24);
        const c = q(s, 2);
        const simple = radical(c, 2);
        const halfD = `\\frac{${radical(s, 2)}}{2}`;
        const rLine = `r = ${halfD}${halfD === simple ? "" : ` = ${simple}`}`;
        return {
          ...radicalProblem({
            prompt: t(
              `A square with a side of $${tex(s, u)}$ is inscribed in a circle. Find the radius of the circle, in ${unitWord(u)}, in simplest radical form.`,
              `边长为 $${tex(s, u)}$ 的正方形内接于一个圆。求圆的半径（单位：${u}），写成最简根式。`,
            ),
            answer: [c, 2],
            wrong: [radical(s, 2), radical(q(s, 4), 2), String(s), `\\frac{${s}}{\\sqrt{2}}`],
            solution: t(
              `**Step 1: the diagonal.** The diagonal of the square is a diameter of the circle. It is the hypotenuse of a right triangle with two sides of the square as legs:${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${radical(s, 2)}`)}**Step 2: the radius.** The radius is half the diameter:${steps(rLine)}{{figure 0}}

**Check.** The square is $2r^2$, and $r^2 = \\left(${simple}\\right)^2 = ${q(s * s, 2).toLatex()}$, so $2r^2 = ${s * s} = ${s}^2$, the square's area.`,
              `**第一步：对角线。** 正方形的对角线是圆的直径。它是以正方形两条边为直角边的直角三角形的斜边：${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${radical(s, 2)}`)}**第二步：半径。** 半径是直径的一半：${steps(rLine)}{{figure 0}}

**检验。** 正方形面积是 $2r^2$，而 $r^2 = \\left(${simple}\\right)^2 = ${q(s * s, 2).toLatex()}$，所以 $2r^2 = ${s * s} = ${s}^2$，正是正方形的面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              [
                ...circleWithSquare(0, []),
                toned(on(225), on(45), "action"),
                { kind: "side", a: on(225), b: on(-45), text: len(s, u) },
                toned(O, on(45), "result"),
                { kind: "side", a: O, b: on(45), text: "r" },
              ],
              `The diagonal of the ${s} ${u} square is a diameter; the radius r is half of it.`,
              `${s} ${u} 的正方形的对角线是直径；半径 r 是它的一半。`,
            ),
          ],
        };
      },
    },
    {
      id: "between-the-circle-and-the-square",
      figure: partsDrawings["between-the-circle-and-the-square"],
      title: t("Between the circle and the square", "圆与正方形之间"),
      explanation: t(
        `The part of a circle outside its inscribed square is four curved pieces, the disk with the square taken out. Its area is

$$\\pi r^2 - 2r^2 = (\\pi - 2) r^2 \\approx 1.14 r^2.$$

For $r = 4$ cm that is $16\\pi - 32$, about $18.3$ cm².

If the square is given instead, get $r^2$ from its area first: a square of side $6$ m has area $36 = 2r^2$, so $r^2 = 18$, and the circle has area $18\\pi$ m², about $1.57$ times the square.

> **Watch out.** The inscribed square has area $2r^2$, not $4r^2$ (the square around the circle) or $r^2$. Subtract the square from the circle, not the circle from the square, which is negative. Given the side, the radius is not the side and not half of it: use $2r^2 = s^2$.`,
        `圆在内接正方形外的部分是四块弓形，即圆面去掉正方形。它的面积是

$$\\pi r^2 - 2r^2 = (\\pi - 2) r^2 \\approx 1.14 r^2.$$

当 $r = 4$ 厘米时，它是 $16\\pi - 32$，约 $18.3$ 平方厘米。

若已知的是正方形，先由它的面积求出 $r^2$：边长为 $6$ 米的正方形面积是 $36 = 2r^2$，所以 $r^2 = 18$，圆的面积是 $18\\pi$ 平方米，约为正方形的 $1.57$ 倍。

> **注意。** 内接正方形的面积是 $2r^2$，不是 $4r^2$（那是圆外面的正方形），也不是 $r^2$。要用圆减去正方形，不是正方形减去圆，那会是负数。已知边长时，半径既不是边长也不是边长的一半：要用 $2r^2 = s^2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const rot = rng.int(0, 89);
        if (rng.bool()) {
          const r = rng.int(2, 20);
          const ans = piSum(-2 * r * r, r * r).replace(/^-(\d+) \+ (.*)$/, "$2 - $1");
          const cn = piNear(r * r);
          return {
            ...piProblem({
              prompt: t(
                `A square is inscribed in a circle with center $O$. Find the area of the part of the circle outside the square.${PI_EN}`,
                `一个正方形内接于以 $O$ 为圆心的圆。求圆在正方形外部分的面积。${PI_ZH}`,
              ),
              answer: ans,
              unit: `${u}^2`,
              wrong: [`${piTex(r * r)} - ${4 * r * r}`, `${piTex(r * r)} - ${r * r}`, `${2 * r * r} - ${piTex(r * r)}`, piTex(r * r)],
              solution: t(
                `**Step 1: the circle.**${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 2: the square.** Its diagonals cut it into four right triangles with legs of $${r}$:${steps(`4 \\cdot \\frac{1}{2} \\cdot ${r}^2 = ${2 * r * r}`)}**Step 3: take the square out of the circle.**${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**Check.** In decimals, $${ans} \\approx ${cn} - ${2 * r * r} = ${near(Number(cn) - 2 * r * r)}$, positive as it must be, and close to $1.14 \\cdot ${r * r} \\approx ${near(1.1416 * r * r)}$.`,
                `**第一步：圆。**${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第二步：正方形。** 对角线把它分成四个直角边为 $${r}$ 的直角三角形：${steps(`4 \\cdot \\frac{1}{2} \\cdot ${r}^2 = ${2 * r * r}`)}**第三步：从圆中去掉正方形。**${steps(`A = ${tex(`(${ans})`, u, 2)}`)}{{figure 0}}

**检验。** 用小数，$${ans} \\approx ${cn} - ${2 * r * r} = ${near(Number(cn) - 2 * r * r)}$，是正数，正应如此，并且接近 $1.14 \\cdot ${r * r} \\approx ${near(1.1416 * r * r)}$。`,
              ),
            }),
            figure: figure(
              circleWithSquare(rot, [{ kind: "side", a: O, b: on(rot + 45), text: len(r, u) }]),
              `A square inscribed in a circle of radius ${r} ${u}, with its diagonals drawn.`,
              `一个内接于半径为 ${r} ${u} 的圆的正方形，画出了对角线。`,
            ),
            solutionFigures: [
              figure(
                [
                  {
                    kind: "shade",
                    points: circlePoints(),
                    holes: [[0, 1, 2, 3].map((k) => on(rot + 45 + 90 * k))],
                    tone: "result",
                  },
                  ...circleWithSquare(rot, [{ kind: "side", a: O, b: on(rot + 45), text: len(r, u) }]),
                ],
                `The shaded part is the circle of radius ${r} ${u} with its inscribed square taken out.`,
                `阴影部分是半径 ${r} ${u} 的圆去掉它的内接正方形。`,
              ),
            ],
          };
        }
        const s = rng.int(2, 24);
        const a = q(s * s, 2);
        return {
          ...piProblem({
            prompt: t(
              `A square with a side of $${tex(s, u)}$ is inscribed in a circle. Find the area of the circle.${PI_EN}`,
              `边长为 $${tex(s, u)}$ 的正方形内接于一个圆。求圆的面积。${PI_ZH}`,
            ),
            answer: piTex(a),
            unit: `${u}^2`,
            wrong: [piTex(s * s), piTex(q(s * s, 4)), piTex(2 * s * s)],
            solution: t(
              `**Step 1: the square in terms of the radius.** The square is four right triangles with legs $r$, so its area is $2r^2$. Its area is also $${s}^2$:${steps(`2r^2 = ${s * s}`, `r^2 = ${a.toLatex()}`)}**Step 2: the circle.** There is no need for $r$ itself; the area uses $r^2$:${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}{{figure 0}}

**Check.** The circle is $\\frac{${piTex(a)}}{${s * s}} = \\frac{\\pi}{2} \\approx 1.57$ times the square, more than $1$ as it must be, since the square lies inside the circle.`,
              `**第一步：用半径表示正方形。** 正方形由四个直角边为 $r$ 的直角三角形组成，面积是 $2r^2$。它的面积也是 $${s}^2$：${steps(`2r^2 = ${s * s}`, `r^2 = ${a.toLatex()}`)}**第二步：圆。** 不必求出 $r$ 本身，面积只用到 $r^2$：${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}{{figure 0}}

**检验。** 圆是正方形的 $\\frac{${piTex(a)}}{${s * s}} = \\frac{\\pi}{2} \\approx 1.57$ 倍，大于 $1$，正应如此，因为正方形在圆的里面。`,
            ),
          }),
          solutionFigures: [
            figure(
              [diskShade(R, "result"), ...inCircleMarks("r", len(s, u))],
              `A square of side ${s} ${u} inside a circle: four right triangles with legs r, the radius.`,
              `圆内边长 ${s} ${u} 的正方形：四个直角边为半径 r 的直角三角形。`,
            ),
          ],
        };
      },
    },
  ],
};

//PARTIAL
export const circleTopics: readonly TopicDef[] = [
  circles,
  arcsSegmentsAndSectorsOfCircles,
  theCircumferenceOfACircle,
  areasOfCircles,
  centralAnglesAndArcs,
  calculatingArcLengthsOfCircularSectors,
  calculatingAreasOfCircularSectors,
  furtherCalculatingAreasOfSectors,
  problemSolvingWithCircles,
  circlesInscribedInSquares,
  squaresInscribedInCircles,
];
