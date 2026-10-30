import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, dec, linear, type Mark, type Point, poly, Q, q, radical, sketch } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, radicalProblem, steps, unitLatex } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

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
function piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** piSum writes a + c·π in LaTeX, in that order: "12 + 4\pi", "64 - 16\pi". */
const piSum = (a: Coefficient, c: Coefficient) => poly([a, ""], [c, "\\pi"]);

/** piQ is 3.14 as an exact rational, the usual approximation of π. */
const piQ = q(314, 100);

const PI_EN = " Give the exact answer in terms of $\\pi$.";
const PI_ZH = "结果保留 $\\pi$。";

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
function piProblem(p: PiProblem): Problem {
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
function arcPoints(a: number, b: number, r = R, c: Point = O): Point[] {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return Array.from({ length: n + 1 }, (_, i) => on(a + (span * i) / n, r, c));
}

/** circleAt draws a circle of radius r about c. */
const circleAt = (r = R, c: Point = O): Mark => ({ kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, r, c)) });

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

const angleAt = (vertex: Point, from: Point, to: Point, label?: string): Mark => ({
  kind: "arc",
  vertex,
  from,
  to,
  accent: true,
  ...(label && { label }),
});

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
  knowledgePoints: [
    {
      id: "radius-and-diameter",
      title: t("Radius and diameter", "半径与直径"),
      explanation: t(
        "A **circle** is the set of all points in a plane at the same distance from a fixed point, its **center**. A circle with center $O$ is called circle $O$.\n\n- A **radius** is a segment from the center to a point on the circle. All radii of a circle have the same length, also called the radius $r$.\n- A **diameter** is a segment through the center whose endpoints are on the circle. It is made of two radii, so\n\n$$d = 2r, \\qquad r = \\frac{d}{2}.$$\n\nA circle with radius $7$ cm has diameter $14$ cm; a circle with diameter $30$ m has radius $15$ m.",
        "**圆**是平面内到一个定点距离相等的所有点组成的图形，这个定点叫**圆心**。圆心为 $O$ 的圆叫圆 $O$。\n\n- **半径**是连接圆心和圆上一点的线段。同一个圆的所有半径长度相等，这个长度也叫半径 $r$。\n- **直径**是经过圆心、两端都在圆上的线段。它由两条半径组成，所以\n\n$$d = 2r, \\qquad r = \\frac{d}{2}.$$\n\n半径为 $7$ 厘米的圆，直径是 $14$ 厘米；直径为 $30$ 米的圆，半径是 $15$ 米。",
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
                `A diameter is made of two radii:${steps(`d = 2r = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}`,
                `直径由两条半径组成：${steps(`d = 2r = 2 \\cdot ${r} = ${tex(2 * r, u)}`)}`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
          };
        }
        const d = rng.int(3, 60);
        return {
          ...numberProblem({
            prompt: t(
              "The highlighted segment is a diameter of the circle. What is the radius?",
              "图中突出显示的线段是圆的直径。半径是多少？",
            ),
            answer: q(d, 2),
            unit: u,
            wrong: [d, 2 * d, d - 2],
            solution: t(
              `A radius is half a diameter:${steps(`r = \\frac{d}{2} = \\frac{${d}}{2} = ${tex(q(d, 2).toLatex(), u)}`)}`,
              `半径是直径的一半：${steps(`r = \\frac{d}{2} = \\frac{${d}}{2} = ${tex(q(d, 2).toLatex(), u)}`)}`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
        };
      },
    },
    {
      id: "parts-of-a-circle",
      title: t("Radii, diameters and chords", "半径、直径与弦"),
      explanation: t(
        "A **chord** is a segment whose endpoints are both on the circle. A diameter is a chord that passes through the center; it is the longest chord of the circle.\n\nSo, for a segment drawn in a circle:\n\n- from the center to the circle: a **radius**;\n- from the circle to the circle through the center: a **diameter**;\n- from the circle to the circle, not through the center: a **chord** (but not a diameter).",
        "**弦**是两个端点都在圆上的线段。直径是经过圆心的弦，是圆中最长的弦。\n\n所以对圆中画出的线段：\n\n- 从圆心到圆上一点：**半径**；\n- 两端在圆上且经过圆心：**直径**；\n- 两端在圆上但不经过圆心：**弦**（不是直径）。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.int(0, 359);
        const [pa, pb] =
          kind === 0 ? [O, on(a)] : kind === 1 ? [on(a), on(a + 180)] : [on(a), on(a + rng.pick([rng.int(40, 150), rng.int(210, 320)]))];
        const options = [t("A radius", "半径"), t("A diameter", "直径"), t("A chord that is not a diameter", "不是直径的弦")];
        const reasons = [
          t("It joins the center to a point on the circle", "它连接圆心和圆上一点"),
          t("Both endpoints are on the circle and it passes through the center", "两个端点都在圆上，并且经过圆心"),
          t("Both endpoints are on the circle, but it does not pass through the center", "两个端点都在圆上，但不经过圆心"),
        ];
        return {
          ...choiceProblem({
            prompt: t("What is the highlighted segment in circle $O$?", "圆 $O$ 中突出显示的线段是什么？"),
            options,
            correct: kind,
            solution: t(
              `${reasons[kind]!.en}, so it is ${options[kind]!.en.toLowerCase()}.`,
              `${reasons[kind]!["zh-CN"]}，所以它是${options[kind]!["zh-CN"]}。`,
            ),
          }),
          figure: figure(
            [circleAt(), ...center(), seg(pa, pb, true), { kind: "dot", at: pa }, { kind: "dot", at: pb }],
            "Circle O with one highlighted segment.",
            "圆 O，其中一条线段被突出显示。",
          ),
        };
      },
    },
    {
      id: "inside-on-or-outside",
      title: t("Inside, on or outside", "圆内、圆上与圆外"),
      explanation: t(
        "Compare the distance from a point $P$ to the center $O$ with the radius $r$:\n\n- if $OP < r$, then $P$ is **inside** the circle (in its interior);\n- if $OP = r$, then $P$ is **on** the circle;\n- if $OP > r$, then $P$ is **outside** the circle (in its exterior).\n\nIf you are given the diameter, halve it first. A circle with diameter $20$ cm has radius $10$ cm, so a point $12$ cm from the center is outside it.",
        "比较点 $P$ 到圆心 $O$ 的距离与半径 $r$：\n\n- 若 $OP < r$，则 $P$ 在圆**内**；\n- 若 $OP = r$，则 $P$ 在圆**上**；\n- 若 $OP > r$，则 $P$ 在圆**外**。\n\n如果给出的是直径，先把它除以 $2$。直径为 $20$ 厘米的圆半径是 $10$ 厘米，所以到圆心 $12$ 厘米的点在圆外。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(3, 25);
        const kind = rng.int(0, 2);
        const useDiameter = rng.bool();
        const dist = kind === 0 ? rng.int(1, r - 1) : kind === 1 ? r : useDiameter ? rng.int(r + 1, 2 * r - 1) : rng.int(r + 1, 2 * r + 5);
        const options = [t("Inside the circle", "在圆内"), t("On the circle", "在圆上"), t("Outside the circle", "在圆外")];
        const rel = ["<", "=", ">"][kind]!;
        const given = useDiameter
          ? t(`a diameter of $${tex(2 * r, u)}$`, `直径为 $${tex(2 * r, u)}$`)
          : t(`a radius of $${tex(r, u)}$`, `半径为 $${tex(r, u)}$`);
        const half = useDiameter ? t(`The radius is $${2 * r} \\div 2 = ${r}$. `, `半径是 $${2 * r} \\div 2 = ${r}$。`) : t("", "");
        return choiceProblem({
          prompt: t(
            `Circle $O$ has ${given.en}. Point $P$ is $${tex(dist, u)}$ from $O$. Where is $P$?`,
            `圆 $O$ 的${given["zh-CN"]}。点 $P$ 到 $O$ 的距离是 $${tex(dist, u)}$。点 $P$ 在哪里？`,
          ),
          options,
          correct: kind,
          solution: t(
            `${half.en}Since $OP = ${dist} ${rel} ${r} = r$, point $P$ is ${options[kind]!.en.toLowerCase()}.`,
            `${half["zh-CN"]}因为 $OP = ${dist} ${rel} ${r} = r$，所以点 $P$ ${options[kind]!["zh-CN"]}。`,
          ),
        });
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
  encompasses: [{ topic: "circles", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSG.CO.A.1"],
  knowledgePoints: [
    {
      id: "classifying-arcs",
      title: t("Minor arcs, major arcs and semicircles", "劣弧、优弧与半圆"),
      explanation: t(
        `Two points $A$ and $B$ on a circle split it into two **arcs**. A whole circle measures $360^\\circ$.\n\n- If $AB$ is a diameter, each arc is a **semicircle**, measuring $180^\\circ$.\n- Otherwise the smaller arc is the **minor arc**, less than $180^\\circ$, and the larger one is the **major arc**, more than $180^\\circ$.\n\nA minor arc is named by its endpoints, $${arcTex("AB")}$. A major arc or a semicircle is named with a third point on it, $${arcTex("AXB")}$, so that it is clear which arc is meant.`,
        `圆上的两点 $A$、$B$ 把圆分成两段**弧**。整个圆是 $360^\\circ$。\n\n- 若 $AB$ 是直径，则每段弧都是**半圆**，度数为 $180^\\circ$。\n- 否则较小的弧是**劣弧**，小于 $180^\\circ$；较大的弧是**优弧**，大于 $180^\\circ$。\n\n劣弧用两个端点命名，记作 $${arcTex("AB")}$。优弧或半圆要在弧上再取一点来命名，如 $${arcTex("AXB")}$，以表明指的是哪一段弧。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = kind === 0 ? rng.int(30, 150) : kind === 1 ? rng.int(210, 330) : 180;
        const s = rng.int(0, 359);
        const options = [t("A minor arc", "劣弧"), t("A major arc", "优弧"), t("A semicircle", "半圆")];
        const reasons = [
          t("it is on the smaller side of chord $AB$", "它在弦 $AB$ 较小的一侧"),
          t("it is on the larger side of chord $AB$, and contains more than half the circle", "它在弦 $AB$ 较大的一侧，超过了半个圆"),
          t(
            "chord $AB$ passes through the center, so it is a diameter and the arc is half the circle",
            "弦 $AB$ 经过圆心，是直径，所以这段弧是半个圆",
          ),
        ];
        return {
          ...choiceProblem({
            prompt: t(
              `Is the highlighted arc $${arcTex("AXB")}$ of circle $O$ a minor arc, a major arc or a semicircle?`,
              `圆 $O$ 中突出显示的弧 $${arcTex("AXB")}$ 是劣弧、优弧还是半圆？`,
            ),
            options,
            correct: kind,
            solution: t(
              `It is ${options[kind]!.en.toLowerCase()}: ${reasons[kind]!.en}.`,
              `它是${options[kind]!["zh-CN"]}：${reasons[kind]!["zh-CN"]}。`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              ...center("O", dirOf(s + m / 2 + 180)),
              ...arcAt(s, s + m),
              { kind: "segment", a: on(s), b: on(s + m), dashed: true },
              ...pointsAt([
                [s, "A"],
                [s + m, "B"],
                [s + m / 2, "X"],
              ]),
            ],
            "Circle O with points A, X and B on it; the arc AXB is highlighted and chord AB is dashed.",
            "圆 O 上有点 A、X、B；弧 AXB 被突出显示，弦 AB 用虚线画出。",
          ),
        };
      },
    },
    {
      id: "measures-of-arcs",
      title: t("Measures of minor and major arcs", "劣弧与优弧的度数"),
      explanation: t(
        `The minor arc and the major arc between the same two points make up the whole circle, so their measures add to $360^\\circ$:\n\n$$m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ.$$\n\nIf minor arc $${arcTex("AB")}$ measures $70^\\circ$, major arc $${arcTex("ACB")}$ measures $360^\\circ - 70^\\circ = 290^\\circ$.`,
        `同两点之间的劣弧和优弧合起来是整个圆，所以它们的度数之和是 $360^\\circ$：\n\n$$m${arcTex("AB")} + m${arcTex("ACB")} = 360^\\circ.$$\n\n若劣弧 $${arcTex("AB")}$ 是 $70^\\circ$，则优弧 $${arcTex("ACB")}$ 是 $360^\\circ - 70^\\circ = 290^\\circ$。`,
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
                `The two arcs make up the whole circle:${steps(`m${arcTex("ACB")} = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}`,
                `两段弧合起来是整个圆：${steps(`m${arcTex("ACB")} = 360^\\circ - ${m}^\\circ = ${M}^\\circ`)}`,
              ),
            }),
            figure: figure(marks, `Circle with points A, B and C; minor arc AB is marked ${m}°.`, `圆上有点 A、B、C；劣弧 AB 标为 ${m}°。`),
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
              `The two arcs make up the whole circle:${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${m}^\\circ`)}`,
              `两段弧合起来是整个圆：${steps(`m${arcTex("AB")} = 360^\\circ - ${M}^\\circ = ${m}^\\circ`)}`,
            ),
          }),
          figure: figure(marks, `Circle with points A, B and C; major arc ACB is marked ${M}°.`, `圆上有点 A、B、C；优弧 ACB 标为 ${M}°。`),
        };
      },
    },
    {
      id: "sectors-and-segments",
      title: t("Sectors and segments", "扇形与弓形"),
      explanation: t(
        "Two kinds of regions of a circle have names:\n\n- A **sector** is bounded by two radii and the arc between them, like a slice of pizza.\n- A **segment** of a circle is bounded by a chord and the arc it cuts off.\n\nEach is **minor** or **major** as its arc is a minor or a major arc. A minor sector looks like a narrow wedge; a major sector is the rest of the circle, a disk with a wedge cut out.",
        "圆中有两种区域有专门的名称：\n\n- **扇形**由两条半径和它们之间的弧围成，像一块比萨。\n- **弓形**由一条弦和它截出的弧围成。\n\n根据所含的弧是劣弧还是优弧，它们分别叫**劣**扇形（弓形）或**优**扇形（弓形）。劣扇形像一个窄楔形；优扇形是圆去掉一个楔形后剩下的部分。",
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
        return {
          ...choiceProblem({
            prompt: t("What is the highlighted region of circle $O$?", "圆 $O$ 中突出显示的区域是什么？"),
            options,
            correct,
            solution: t(
              `The region is bounded by ${sector ? "two radii" : "a chord"} and ${major ? "a major" : "a minor"} arc, so it is ${options[correct]!.en.toLowerCase()}.`,
              `这个区域由${sector ? "两条半径" : "一条弦"}和一段${major ? "优" : "劣"}弧围成，所以它是${options[correct]!["zh-CN"]}。`,
            ),
          }),
          figure: figure(
            [circleAt(), { kind: "polygon", points: sector ? [O, ...pts] : pts, accent: true }, ...center("O", dirOf(s + m / 2 + 180))],
            "Circle O with a highlighted region bounded by an arc.",
            "圆 O 中一个由弧围成的区域被突出显示。",
          ),
        };
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
    { topic: "circles", weight: 0.3 },
    { topic: "decimal-arithmetic", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.7.G.B.4"],
  knowledgePoints: [
    {
      id: "circumference-in-terms-of-pi",
      title: t("Circumference in terms of π", "用 π 表示周长"),
      explanation: t(
        "The **circumference** $C$ of a circle is its perimeter, the distance around it. For every circle, the circumference divided by the diameter is the same number, called $\\pi$ (pi), about $3.14159$. So\n\n$$C = \\pi d = 2\\pi r.$$\n\nAn exact answer keeps the symbol $\\pi$: a circle with radius $7$ cm has circumference $2\\pi \\cdot 7 = 14\\pi$ cm.",
        "圆的**周长** $C$ 是绕圆一周的长度。对任何圆，周长除以直径都等于同一个数，叫作 $\\pi$（圆周率），约为 $3.14159$。所以\n\n$$C = \\pi d = 2\\pi r.$$\n\n精确的答案保留符号 $\\pi$：半径为 $7$ 厘米的圆，周长是 $2\\pi \\cdot 7 = 14\\pi$ 厘米。",
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
                `Use $C = 2\\pi r$:${steps(`C = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}`,
                `用 $C = 2\\pi r$：${steps(`C = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
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
              `Use $C = \\pi d$:${steps(`C = \\pi \\cdot ${d} = ${tex(piTex(d), u)}`)}`,
              `用 $C = \\pi d$：${steps(`C = \\pi \\cdot ${d} = ${tex(piTex(d), u)}`)}`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
        };
      },
    },
    {
      id: "approximating-circumference",
      title: t("Approximating the circumference", "周长的近似值"),
      explanation: t(
        "To get a decimal value, replace $\\pi$ with an approximation such as $3.14$.\n\nA circle with diameter $12$ m has circumference $C = \\pi d \\approx 3.14 \\cdot 12 = 37.68$ m. If you know the radius, double it first: a circle with radius $5$ m has $C \\approx 3.14 \\cdot 10 = 31.4$ m.",
        "要得到小数值，把 $\\pi$ 换成近似值，例如 $3.14$。\n\n直径为 $12$ 米的圆，周长 $C = \\pi d \\approx 3.14 \\cdot 12 = 37.68$ 米。若已知半径，先乘以 $2$：半径为 $5$ 米的圆，$C \\approx 3.14 \\cdot 10 = 31.4$ 米。",
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
        return numberProblem({
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
            `${useRadius ? `The diameter is $2 \\cdot ${r} = ${d}$. ` : ""}Use $C = \\pi d$:${steps(`C \\approx 3.14 \\cdot ${d} = ${tex(dec(c), u)}`)}`,
            `${useRadius ? `直径是 $2 \\cdot ${r} = ${d}$。` : ""}用 $C = \\pi d$：${steps(`C \\approx 3.14 \\cdot ${d} = ${tex(dec(c), u)}`)}`,
          ),
        });
      },
    },
    {
      id: "radius-from-circumference",
      title: t("The radius from the circumference", "由周长求半径"),
      explanation: t(
        "Since $C = \\pi d$, the diameter is $d = C \\div \\pi$, and the radius is half of that.\n\nA circle with circumference $18\\pi$ cm has diameter $18$ cm and radius $9$ cm. With the approximation $3.14$, a circle with circumference $31.4$ m has diameter $31.4 \\div 3.14 = 10$ m.",
        "由 $C = \\pi d$，直径 $d = C \\div \\pi$，半径是它的一半。\n\n周长为 $18\\pi$ 厘米的圆，直径是 $18$ 厘米，半径是 $9$ 厘米。用近似值 $3.14$：周长为 $31.4$ 米的圆，直径是 $31.4 \\div 3.14 = 10$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const d = rng.int(2, 40);
          const c = dec(piQ.mul(q(d)));
          return numberProblem({
            prompt: t(
              `A circle has a circumference of $${tex(c, u)}$. Use $3.14$ for $\\pi$ to find its diameter.`,
              `一个圆的周长是 $${tex(c, u)}$。取 $\\pi \\approx 3.14$，求它的直径。`,
            ),
            answer: d,
            unit: u,
            wrong: [q(d, 2), 2 * d, piQ.mul(q(d))],
            solution: t(
              `Divide the circumference by $\\pi$:${steps(`d \\approx ${c} \\div 3.14 = ${tex(d, u)}`)}`,
              `用周长除以 $\\pi$：${steps(`d \\approx ${c} \\div 3.14 = ${tex(d, u)}`)}`,
            ),
          });
        }
        const r = rng.int(2, 30);
        const askRadius = kind === 0;
        return numberProblem({
          prompt: t(
            `A circle has a circumference of $${tex(piTex(2 * r), u)}$. Find its ${askRadius ? "radius" : "diameter"}.`,
            `一个圆的周长是 $${tex(piTex(2 * r), u)}$。求它的${askRadius ? "半径" : "直径"}。`,
          ),
          answer: askRadius ? r : 2 * r,
          unit: u,
          wrong: askRadius ? [2 * r, q(r, 2), 4 * r] : [r, 4 * r, q(r, 2)],
          solution: t(
            `Since $C = \\pi d$, the diameter is $${2 * r}$.${askRadius ? steps(`r = \\frac{${2 * r}}{2} = ${tex(r, u)}`) : steps(`d = ${tex(2 * r, u)}`)}`,
            `由 $C = \\pi d$，直径是 $${2 * r}$。${askRadius ? steps(`r = \\frac{${2 * r}}{2} = ${tex(r, u)}`) : steps(`d = ${tex(2 * r, u)}`)}`,
          ),
        });
      },
    },
  ],
};

export const areasOfCircles: TopicDef = {
  id: "areas-of-circles",
  title: t("Areas of Circles", "圆的面积"),
  summary: t(
    "Find the area of a circle from its radius, diameter or circumference, and the radius from the area.",
    "由半径、直径或周长求圆的面积，以及由面积求半径。",
  ),
  prerequisites: ["the-circumference-of-a-circle", "area-of-rectangles-and-squares", "square-roots-and-cube-roots"],
  encompasses: [
    { topic: "the-circumference-of-a-circle", weight: 0.3 },
    { topic: "square-roots-and-cube-roots", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.7.G.B.4"],
  knowledgePoints: [
    {
      id: "area-from-the-radius",
      title: t("Area from the radius", "由半径求面积"),
      explanation: t(
        "The area of a circle with radius $r$ is\n\n$$A = \\pi r^2.$$\n\nA circle with radius $6$ cm has area $\\pi \\cdot 6^2 = 36\\pi\\text{ cm}^2$. If you are given the diameter, halve it before squaring: a circle with diameter $10$ m has radius $5$ m and area $25\\pi\\text{ m}^2$, not $100\\pi\\text{ m}^2$.",
        "半径为 $r$ 的圆的面积是\n\n$$A = \\pi r^2.$$\n\n半径为 $6$ 厘米的圆，面积是 $\\pi \\cdot 6^2 = 36\\pi\\text{ cm}^2$。若给出的是直径，先除以 $2$ 再平方：直径为 $10$ 米的圆，半径是 $5$ 米，面积是 $25\\pi\\text{ m}^2$，而不是 $100\\pi\\text{ m}^2$。",
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
                `Use $A = \\pi r^2$:${steps(`A = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}`,
                `用 $A = \\pi r^2$：${steps(`A = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}`,
              ),
            }),
            figure: figure(measuredCircle(len(r, u), false, s), `A circle with a radius of ${r} ${u}.`, `一个半径为 ${r} ${u} 的圆。`),
          };
        }
        const d = rng.int(3, 30);
        const a = q(d * d, 4);
        return {
          ...piProblem({
            prompt: t(`Find the area of the circle.${PI_EN}`, `求这个圆的面积。${PI_ZH}`),
            answer: piTex(a),
            unit: `${u}^2`,
            wrong: [piTex(d * d), piTex(d), piTex(q(d * d, 2))],
            solution: t(
              `The radius is $\\frac{${d}}{2}$. Use $A = \\pi r^2$:${steps(`A = \\pi \\left(\\frac{${d}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
              `半径是 $\\frac{${d}}{2}$。用 $A = \\pi r^2$：${steps(`A = \\pi \\left(\\frac{${d}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
            ),
          }),
          figure: figure(measuredCircle(len(d, u), true, s), `A circle with a diameter of ${d} ${u}.`, `一个直径为 ${d} ${u} 的圆。`),
        };
      },
    },
    {
      id: "approximating-area",
      title: t("Approximating the area", "面积的近似值"),
      explanation: t(
        "For a decimal value, use an approximation of $\\pi$ such as $3.14$. Square the radius first, then multiply.\n\nA circle with radius $4$ cm has area $A \\approx 3.14 \\cdot 4^2 = 3.14 \\cdot 16 = 50.24\\text{ cm}^2$.",
        "要得到小数值，用 $\\pi$ 的近似值，例如 $3.14$。先把半径平方，再相乘。\n\n半径为 $4$ 厘米的圆，面积 $A \\approx 3.14 \\cdot 4^2 = 3.14 \\cdot 16 = 50.24\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const useDiameter = rng.bool(0.3);
        const r = rng.int(2, 20);
        const a = piQ.mul(q(r * r));
        const given = useDiameter
          ? t(`a diameter of $${tex(2 * r, u)}$`, `直径为 $${tex(2 * r, u)}$`)
          : t(`a radius of $${tex(r, u)}$`, `半径为 $${tex(r, u)}$`);
        const sq = `${useDiameter ? `r = ${2 * r} \\div 2 = ${r}, \\quad ` : ""}A \\approx 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${tex(dec(a), u, 2)}`;
        return numberProblem({
          prompt: t(
            `A circle has ${given.en}. Use $3.14$ for $\\pi$ to find its area.`,
            `一个圆的${given["zh-CN"]}。取 $\\pi \\approx 3.14$，求它的面积。`,
          ),
          answer: a,
          form: "decimal",
          unit: `${u}^2`,
          wrong: [piQ.mul(q(2 * r)), piQ.mul(q(4 * r * r)), piQ.mul(q(r)).mul(piQ.mul(q(r)))],
          solution: t(`Use $A = \\pi r^2$:${steps(sq)}`, `用 $A = \\pi r^2$：${steps(sq)}`),
        });
      },
    },
    {
      id: "radius-from-area",
      title: t("The radius from the area", "由面积求半径"),
      explanation: t(
        "Since $A = \\pi r^2$, dividing the area by $\\pi$ gives $r^2$, and the radius is its square root.\n\nA circle with area $49\\pi\\text{ cm}^2$ has $r^2 = 49$, so $r = 7$ cm and the diameter is $14$ cm.",
        "由 $A = \\pi r^2$，面积除以 $\\pi$ 得到 $r^2$，半径是它的平方根。\n\n面积为 $49\\pi\\text{ cm}^2$ 的圆，$r^2 = 49$，所以 $r = 7$ 厘米，直径是 $14$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 25);
        const askRadius = rng.bool(0.6);
        return numberProblem({
          prompt: t(
            `A circle has an area of $${tex(piTex(r * r), u, 2)}$. Find its ${askRadius ? "radius" : "diameter"}.`,
            `一个圆的面积是 $${tex(piTex(r * r), u, 2)}$。求它的${askRadius ? "半径" : "直径"}。`,
          ),
          answer: askRadius ? r : 2 * r,
          unit: u,
          wrong: askRadius ? [r * r, q(r * r, 2), 2 * r] : [r, r * r, 2 * r * r],
          solution: t(
            `Divide by $\\pi$ and take the square root:${steps(`r^2 = ${r * r}`, `r = ${r}`)}${askRadius ? `The radius is $${tex(r, u)}$.` : `The diameter is $2 \\cdot ${r} = ${tex(2 * r, u)}$.`}`,
            `除以 $\\pi$ 再开平方：${steps(`r^2 = ${r * r}`, `r = ${r}`)}${askRadius ? `半径是 $${tex(r, u)}$。` : `直径是 $2 \\cdot ${r} = ${tex(2 * r, u)}$。`}`,
          ),
        });
      },
    },
    {
      id: "area-and-circumference",
      title: t("From circumference to area and back", "周长与面积互求"),
      explanation: t(
        "To go from the circumference to the area, or back, pass through the radius.\n\nA circle with circumference $10\\pi$ m has radius $5$ m, so its area is $25\\pi\\text{ m}^2$. A circle with area $64\\pi\\text{ m}^2$ has radius $8$ m, so its circumference is $16\\pi$ m.",
        "由周长求面积或由面积求周长，都要先求出半径。\n\n周长为 $10\\pi$ 米的圆，半径是 $5$ 米，所以面积是 $25\\pi\\text{ m}^2$。面积为 $64\\pi\\text{ m}^2$ 的圆，半径是 $8$ 米，所以周长是 $16\\pi$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 20);
        if (rng.bool()) {
          return piProblem({
            prompt: t(
              `A circle has a circumference of $${tex(piTex(2 * r), u)}$. Find its area.${PI_EN}`,
              `一个圆的周长是 $${tex(piTex(2 * r), u)}$。求它的面积。${PI_ZH}`,
            ),
            answer: piTex(r * r),
            unit: `${u}^2`,
            wrong: [piTex(4 * r * r), piTex(2 * r), piTex(r)],
            solution: t(
              `From $2\\pi r = ${piTex(2 * r)}$, the radius is $${r}$:${steps(`A = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}`,
              `由 $2\\pi r = ${piTex(2 * r)}$，半径是 $${r}$：${steps(`A = \\pi \\cdot ${r}^2 = ${tex(piTex(r * r), u, 2)}`)}`,
            ),
          });
        }
        return piProblem({
          prompt: t(
            `A circle has an area of $${tex(piTex(r * r), u, 2)}$. Find its circumference.${PI_EN}`,
            `一个圆的面积是 $${tex(piTex(r * r), u, 2)}$。求它的周长。${PI_ZH}`,
          ),
          answer: piTex(2 * r),
          unit: u,
          wrong: [piTex(r), piTex(2 * r * r), piTex(4 * r)],
          solution: t(
            `From $\\pi r^2 = ${piTex(r * r)}$, the radius is $${r}$:${steps(`C = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}`,
            `由 $\\pi r^2 = ${piTex(r * r)}$，半径是 $${r}$：${steps(`C = 2\\pi \\cdot ${r} = ${tex(piTex(2 * r), u)}`)}`,
          ),
        });
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
    { topic: "arcs-segments-and-sectors-of-circles", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.2 },
    { topic: "combining-like-terms", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.C.A.2"],
  knowledgePoints: [
    {
      id: "central-angles",
      title: t("Central angles", "圆心角"),
      explanation: t(
        `A **central angle** has its vertex at the center of the circle. The measure of a minor arc is defined as the measure of its central angle:\n\n$$m${arcTex("AB")} = \\angle AOB,$$\n\nand the major arc measures $360^\\circ$ minus that. If $\\angle AOB = 75^\\circ$, then $m${arcTex("AB")} = 75^\\circ$ and $m${arcTex("ACB")} = 285^\\circ$.`,
        `顶点在圆心的角叫**圆心角**。劣弧的度数定义为它所对圆心角的度数：\n\n$$m${arcTex("AB")} = \\angle AOB,$$\n\n优弧的度数是 $360^\\circ$ 减去它。若 $\\angle AOB = 75^\\circ$，则 $m${arcTex("AB")} = 75^\\circ$，$m${arcTex("ACB")} = 285^\\circ$。`,
      ),
      generate(rng) {
        const theta = rng.int(20, 170);
        const s = rng.int(0, 359);
        if (rng.bool(0.6)) {
          return {
            ...numberProblem({
              prompt: t(`Find the measure of major arc $${arcTex("ACB")}$.`, `求优弧 $${arcTex("ACB")}$ 的度数。`),
              answer: 360 - theta,
              unit: "°",
              wrong: [theta, 180 - theta, 2 * theta],
              solution: t(
                `Minor arc $${arcTex("AB")}$ has the measure of its central angle, $${theta}^\\circ$, and the major arc is the rest of the circle:${steps(`m${arcTex("ACB")} = 360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}`,
                `劣弧 $${arcTex("AB")}$ 的度数等于它所对的圆心角 $${theta}^\\circ$，优弧是圆的其余部分：${steps(`m${arcTex("ACB")} = 360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ`)}`,
              ),
            }),
            figure: figure(
              centralFigure(s, theta, deg(theta)),
              `Circle O with central angle AOB of ${theta}° and a point C on the major arc.`,
              `圆 O，圆心角 AOB 为 ${theta}°，点 C 在优弧上。`,
            ),
          };
        }
        const M = 360 - theta;
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
              `Minor arc $${arcTex("AB")}$ is the rest of the circle, and $\\angle AOB$ has its measure:${steps(`\\angle AOB = 360^\\circ - ${M}^\\circ = ${theta}^\\circ`)}`,
              `劣弧 $${arcTex("AB")}$ 是圆的其余部分，$\\angle AOB$ 等于它的度数：${steps(`\\angle AOB = 360^\\circ - ${M}^\\circ = ${theta}^\\circ`)}`,
            ),
          }),
          figure: figure(
            centralFigure(s, theta, undefined),
            "Circle O with radii OA and OB and a point C on the major arc.",
            "圆 O，画有半径 OA、OB，点 C 在优弧上。",
          ),
        };
      },
    },
    {
      id: "adding-arcs",
      title: t("Adding arcs", "弧的加法"),
      explanation: t(
        `Adjacent arcs add like adjacent angles: if $B$ is on arc $${arcTex("ABC")}$, then\n\n$$m${arcTex("ABC")} = m${arcTex("AB")} + m${arcTex("BC")}.$$\n\nThe central angles all the way around the center add to $360^\\circ$. If radii $OA$, $OB$, $OC$ make $\\angle AOB = 100^\\circ$ and $\\angle BOC = 140^\\circ$, then $m${arcTex("ABC")} = 240^\\circ$ and the remaining arc $${arcTex("CA")}$ measures $360^\\circ - 240^\\circ = 120^\\circ$.`,
        `相邻的弧像相邻的角一样相加：若 $B$ 在弧 $${arcTex("ABC")}$ 上，则\n\n$$m${arcTex("ABC")} = m${arcTex("AB")} + m${arcTex("BC")}.$$\n\n绕圆心一周的圆心角之和是 $360^\\circ$。若半径 $OA$、$OB$、$OC$ 构成 $\\angle AOB = 100^\\circ$、$\\angle BOC = 140^\\circ$，则 $m${arcTex("ABC")} = 240^\\circ$，剩下的弧 $${arcTex("CA")}$ 是 $360^\\circ - 240^\\circ = 120^\\circ$。`,
      ),
      generate(rng) {
        const a = rng.int(40, 150);
        const b = rng.int(40, Math.min(150, 300 - a));
        const c = 360 - a - b;
        const s = rng.int(0, 359);
        const [pa, pb, pc] = [on(s), on(s + a), on(s + a + b)];
        const marks: Mark[] = [
          circleAt(),
          { kind: "dot", at: O },
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
          marks,
          `Circle O with radii OA, OB and OC; angle AOB is ${a}° and angle BOC is ${b}°.`,
          `圆 O，半径 OA、OB、OC；角 AOB 为 ${a}°，角 BOC 为 ${b}°。`,
        );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(`Find the measure of arc $${arcTex("ABC")}$.`, `求弧 $${arcTex("ABC")}$ 的度数。`),
              answer: a + b,
              unit: "°",
              wrong: [Math.abs(a - b), c, 360 - a],
              solution: t(
                `Arc $${arcTex("ABC")}$ is made of arcs $${arcTex("AB")}$ and $${arcTex("BC")}$, which have the measures of their central angles:${steps(`m${arcTex("ABC")} = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}`,
                `弧 $${arcTex("ABC")}$ 由弧 $${arcTex("AB")}$ 和弧 $${arcTex("BC")}$ 组成，它们的度数等于各自的圆心角：${steps(`m${arcTex("ABC")} = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}`,
              ),
            }),
            figure: fig,
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
              `The central angles around $O$ add to $360^\\circ$:${steps(`m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}`,
              `绕 $O$ 一周的圆心角之和是 $360^\\circ$：${steps(`m${arcTex("CA")} = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "central-angles-with-algebra",
      title: t("Central angles with algebra", "含未知数的圆心角"),
      explanation: t(
        "When central angles are written with a variable, their sum around the center gives an equation.\n\nIf three radii split a circle into central angles $(2x + 10)^\\circ$, $(3x)^\\circ$ and $(5x - 50)^\\circ$, then\n\n$$(2x + 10) + 3x + (5x - 50) = 360,$$\n\nso $10x - 40 = 360$, $10x = 400$ and $x = 40$.",
        "当圆心角用含变量的式子表示时，绕圆心一周的和给出一个方程。\n\n若三条半径把圆分成圆心角 $(2x + 10)^\\circ$、$(3x)^\\circ$、$(5x - 50)^\\circ$，则\n\n$$(2x + 10) + 3x + (5x - 50) = 360,$$\n\n所以 $10x - 40 = 360$，$10x = 400$，$x = 40$。",
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
              `The central angles add to $360^\\circ$:${steps(`${angleTex(c1, d1)} + ${angleTex(c2, d2)} + ${angleTex(c3, d3)} = 360^\\circ`, `${linear(C, D)} = 360`, `${C}x = ${360 - D}`, `x = ${x}`)}`,
              `圆心角之和是 $360^\\circ$：${steps(`${angleTex(c1, d1)} + ${angleTex(c2, d2)} + ${angleTex(c3, d3)} = 360^\\circ`, `${linear(C, D)} = 360`, `${C}x = ${360 - D}`, `x = ${x}`)}`,
            ),
          }),
          figure: figure(
            [
              circleAt(),
              { kind: "dot", at: O },
              seg(O, p1),
              seg(O, p2),
              seg(O, p3),
              angleAt(O, p1, p2, angleLabel(c1, d1)),
              angleAt(O, p2, p3, angleLabel(c2, d2)),
              angleAt(O, p3, p1, angleLabel(c3, d3)),
            ],
            `Circle O split by three radii into angles ${angleLabel(c1, d1)}, ${angleLabel(c2, d2)} and ${angleLabel(c3, d3)}.`,
            `圆 O 被三条半径分成 ${angleLabel(c1, d1)}、${angleLabel(c2, d2)}、${angleLabel(c3, d3)} 三个角。`,
          ),
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
    { topic: "central-angles-and-arcs", weight: 0.3 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  knowledgePoints: [
    {
      id: "arc-length",
      title: t("Arc length", "弧长"),
      explanation: t(
        "An arc with central angle $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of the whole circle, so its **arc length** is that fraction of the circumference:\n\n$$L = \\frac{\\theta}{360} \\cdot 2\\pi r.$$\n\nIn a circle of radius $9$ cm, an arc of $80^\\circ$ has length $\\frac{80}{360} \\cdot 18\\pi = \\frac{2}{9} \\cdot 18\\pi = 4\\pi$ cm.",
        "圆心角为 $\\theta^\\circ$ 的弧占整个圆的 $\\frac{\\theta}{360}$，所以它的**弧长**是周长的这一部分：\n\n$$L = \\frac{\\theta}{360} \\cdot 2\\pi r.$$\n\n在半径为 $9$ 厘米的圆中，$80^\\circ$ 的弧长是 $\\frac{80}{360} \\cdot 18\\pi = \\frac{2}{9} \\cdot 18\\pi = 4\\pi$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const L = q(theta * r, 180);
        return {
          ...piProblem({
            prompt: t(`Find the length of arc $${arcTex("AB")}$.${PI_EN}`, `求弧 $${arcTex("AB")}$ 的长。${PI_ZH}`),
            answer: piTex(L),
            unit: u,
            wrong: [piTex(q(theta * r * r, 360)), piTex(q(theta * r, 360)), piTex(q((360 - theta) * r, 180)), piTex(2 * r)],
            solution: t(
              `The arc is $\\frac{${theta}}{360}$ of the circumference:${steps(`L = \\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${tex(piTex(L), u)}`)}`,
              `这段弧是周长的 $\\frac{${theta}}{360}$：${steps(`L = \\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${tex(piTex(L), u)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
        };
      },
    },
    {
      id: "major-arc-length",
      title: t("Length of a major arc", "优弧的长"),
      explanation: t(
        "A major arc has central angle $360^\\circ - \\theta$, where $\\theta$ is the minor central angle. Either use that angle, or subtract the minor arc from the circumference.\n\nIn a circle of radius $6$ m, if $\\angle AOB = 120^\\circ$, the major arc measures $240^\\circ$ and has length $\\frac{240}{360} \\cdot 12\\pi = 8\\pi$ m.",
        "优弧所对的圆心角是 $360^\\circ - \\theta$，其中 $\\theta$ 是劣弧的圆心角。可以直接用这个角，也可以用周长减去劣弧长。\n\n在半径为 $6$ 米的圆中，若 $\\angle AOB = 120^\\circ$，则优弧是 $240^\\circ$，长 $\\frac{240}{360} \\cdot 12\\pi = 8\\pi$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const s = rng.int(0, 359);
        const L = q((360 - theta) * r, 180);
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
              `The major arc has central angle $360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ$:${steps(`L = \\frac{${360 - theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${tex(piTex(L), u)}`)}`,
              `优弧所对的圆心角是 $360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ$：${steps(`L = \\frac{${360 - theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${tex(piTex(L), u)}`)}`,
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
        };
      },
    },
    {
      id: "radius-or-angle-from-arc-length",
      title: t("The radius or the angle from the arc length", "由弧长求半径或圆心角"),
      explanation: t(
        "The arc length formula connects three quantities, so knowing two of them gives the third.\n\nIf an arc of $60^\\circ$ has length $5\\pi$ cm, then $\\frac{60}{360} \\cdot 2\\pi r = 5\\pi$, so $\\frac{\\pi r}{3} = 5\\pi$ and $r = 15$ cm. If an arc of a circle with radius $10$ cm has length $4\\pi$ cm, then $\\frac{\\theta}{360} \\cdot 20\\pi = 4\\pi$, so $\\frac{\\theta}{360} = \\frac{1}{5}$ and $\\theta = 72^\\circ$.",
        "弧长公式联系着三个量，知道其中两个就能求出第三个。\n\n若 $60^\\circ$ 的弧长为 $5\\pi$ 厘米，则 $\\frac{60}{360} \\cdot 2\\pi r = 5\\pi$，即 $\\frac{\\pi r}{3} = 5\\pi$，$r = 15$ 厘米。若半径为 $10$ 厘米的圆中一段弧长 $4\\pi$ 厘米，则 $\\frac{\\theta}{360} \\cdot 20\\pi = 4\\pi$，所以 $\\frac{\\theta}{360} = \\frac{1}{5}$，$\\theta = 72^\\circ$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 20);
        const L = q(theta * r, 180);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `An arc with a central angle of $${theta}^\\circ$ has a length of $${tex(piTex(L), u)}$. Find the radius of the circle.`,
              `圆心角为 $${theta}^\\circ$ 的弧长为 $${tex(piTex(L), u)}$。求圆的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [2 * r, q(r, 2), L.mul(q(2))],
            solution: t(
              `Write the arc length formula and solve for $r$:${steps(`\\frac{${theta}}{360} \\cdot 2\\pi r = ${piTex(L)}`, `${piTex(q(theta, 180))} r = ${piTex(L)}`, `r = ${tex(r, u)}`)}`,
              `列出弧长公式并解出 $r$：${steps(`\\frac{${theta}}{360} \\cdot 2\\pi r = ${piTex(L)}`, `${piTex(q(theta, 180))} r = ${piTex(L)}`, `r = ${tex(r, u)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `In a circle with radius $${tex(r, u)}$, an arc has a length of $${tex(piTex(L), u)}$. Find its central angle.`,
            `在半径为 $${tex(r, u)}$ 的圆中，一段弧长为 $${tex(piTex(L), u)}$。求它所对的圆心角。`,
          ),
          answer: theta,
          unit: "°",
          wrong: [360 - theta, 2 * theta, q(theta, 2)],
          solution: t(
            `The arc is a fraction of the circumference $${piTex(2 * r)}$:${steps(`\\frac{\\theta}{360} = \\frac{${piTex(L)}}{${piTex(2 * r)}} = ${q(theta, 360).toLatex()}`, `\\theta = ${theta}^\\circ`)}`,
            `这段弧是周长 $${piTex(2 * r)}$ 的一部分：${steps(`\\frac{\\theta}{360} = \\frac{${piTex(L)}}{${piTex(2 * r)}} = ${q(theta, 360).toLatex()}`, `\\theta = ${theta}^\\circ`)}`,
          ),
        });
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
    { topic: "central-angles-and-arcs", weight: 0.3 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  knowledgePoints: [
    {
      id: "sector-area",
      title: t("Area of a sector", "扇形的面积"),
      explanation: t(
        "A sector with central angle $\\theta^\\circ$ is the fraction $\\frac{\\theta}{360}$ of the whole disk, so its area is that fraction of the area of the circle:\n\n$$A = \\frac{\\theta}{360} \\cdot \\pi r^2.$$\n\nA sector of $40^\\circ$ in a circle of radius $6$ cm has area $\\frac{40}{360} \\cdot 36\\pi = \\frac{1}{9} \\cdot 36\\pi = 4\\pi\\text{ cm}^2$.",
        "圆心角为 $\\theta^\\circ$ 的扇形占整个圆的 $\\frac{\\theta}{360}$，所以它的面积是圆面积的这一部分：\n\n$$A = \\frac{\\theta}{360} \\cdot \\pi r^2.$$\n\n在半径为 $6$ 厘米的圆中，$40^\\circ$ 的扇形面积是 $\\frac{40}{360} \\cdot 36\\pi = \\frac{1}{9} \\cdot 36\\pi = 4\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        return {
          ...piProblem({
            prompt: t(`Find the area of sector $AOB$.${PI_EN}`, `求扇形 $AOB$ 的面积。${PI_ZH}`),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(q(theta * r, 180)), piTex(q(theta * r * r, 180)), piTex(r * r), piTex(q((360 - theta) * r * r, 360))],
            solution: t(
              `The sector is $\\frac{${theta}}{360}$ of the circle:${steps(`A = \\frac{${theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${tex(piTex(A), u, 2)}`)}`,
              `扇形是整个圆的 $\\frac{${theta}}{360}$：${steps(`A = \\frac{${theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${tex(piTex(A), u, 2)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
        };
      },
    },
    {
      id: "major-sector-area",
      title: t("Area of a major sector", "优扇形的面积"),
      explanation: t(
        "A major sector has central angle $360^\\circ - \\theta$, where $\\theta$ is the angle of the minor sector. Use that angle in the formula, or subtract the minor sector from the whole circle.\n\nIn a circle of radius $3$ m with $\\angle AOB = 120^\\circ$, the major sector has angle $240^\\circ$ and area $\\frac{240}{360} \\cdot 9\\pi = 6\\pi\\text{ m}^2$.",
        "优扇形的圆心角是 $360^\\circ - \\theta$，其中 $\\theta$ 是劣扇形的圆心角。把这个角代入公式，或者用整个圆减去劣扇形。\n\n在半径为 $3$ 米的圆中，若 $\\angle AOB = 120^\\circ$，则优扇形的圆心角是 $240^\\circ$，面积是 $\\frac{240}{360} \\cdot 9\\pi = 6\\pi\\text{ m}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 15);
        const A = q((360 - theta) * r * r, 360);
        return {
          ...piProblem({
            prompt: t(`Find the area of the highlighted major sector.${PI_EN}`, `求突出显示的优扇形的面积。${PI_ZH}`),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(q(theta * r * r, 360)), piTex(q((360 - theta) * r, 180)), piTex(r * r), piTex(q((180 - theta) * r * r, 360))],
            solution: t(
              `The major sector has central angle $360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ$:${steps(`A = \\frac{${360 - theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${tex(piTex(A), u, 2)}`)}`,
              `优扇形的圆心角是 $360^\\circ - ${theta}^\\circ = ${360 - theta}^\\circ$：${steps(`A = \\frac{${360 - theta}}{360} \\cdot \\pi \\cdot ${r}^2 = ${tex(piTex(A), u, 2)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), theta, deg(theta), len(r, u), true),
            `A circle with radius ${r} ${u}; angle AOB is ${theta}° and the major sector is highlighted.`,
            `半径为 ${r} ${u} 的圆；角 AOB 为 ${theta}°，优扇形被突出显示。`,
          ),
        };
      },
    },
    {
      id: "approximating-sector-area",
      title: t("Approximating the area of a sector", "扇形面积的近似值"),
      explanation: t(
        "For a decimal value, use $3.14$ for $\\pi$ after simplifying the fraction of the circle.\n\nA sector of $72^\\circ$ in a circle of radius $10$ cm is $\\frac{72}{360} = \\frac{1}{5}$ of the circle, so its area is about $\\frac{1}{5} \\cdot 3.14 \\cdot 100 = 62.8\\text{ cm}^2$.",
        "要得到小数值，先化简扇形占圆的分数，再取 $\\pi \\approx 3.14$。\n\n在半径为 $10$ 厘米的圆中，$72^\\circ$ 的扇形占 $\\frac{72}{360} = \\frac{1}{5}$，所以面积约为 $\\frac{1}{5} \\cdot 3.14 \\cdot 100 = 62.8\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(terminatingAngles);
        const r = rng.int(2, 20);
        const f = q(theta, 360);
        const A = f.mul(piQ).mul(q(r * r));
        return numberProblem({
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
            `The sector is $\\frac{${theta}}{360} = ${f.toLatex()}$ of the circle:${steps(`A \\approx ${f.toLatex()} \\cdot 3.14 \\cdot ${r}^2 = ${tex(dec(A), u, 2)}`)}`,
            `扇形占圆的 $\\frac{${theta}}{360} = ${f.toLatex()}$：${steps(`A \\approx ${f.toLatex()} \\cdot 3.14 \\cdot ${r}^2 = ${tex(dec(A), u, 2)}`)}`,
          ),
        });
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
  knowledgePoints: [
    {
      id: "angle-from-sector-area",
      title: t("The angle from the area", "由面积求圆心角"),
      explanation: t(
        "The area of a sector divided by the area of its circle is the fraction $\\frac{\\theta}{360}$:\n\n$$\\frac{\\theta}{360} = \\frac{A_{\\text{sector}}}{\\pi r^2}.$$\n\nA sector of area $10\\pi\\text{ cm}^2$ in a circle of radius $6$ cm is $\\frac{10\\pi}{36\\pi} = \\frac{5}{18}$ of the circle, so $\\theta = \\frac{5}{18} \\cdot 360 = 100^\\circ$.",
        "扇形面积除以圆的面积等于 $\\frac{\\theta}{360}$：\n\n$$\\frac{\\theta}{360} = \\frac{A_{\\text{扇形}}}{\\pi r^2}.$$\n\n在半径为 $6$ 厘米的圆中，面积为 $10\\pi\\text{ cm}^2$ 的扇形占 $\\frac{10\\pi}{36\\pi} = \\frac{5}{18}$，所以 $\\theta = \\frac{5}{18} \\cdot 360 = 100^\\circ$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        return numberProblem({
          prompt: t(
            `A sector of a circle with radius $${tex(r, u)}$ has an area of $${tex(piTex(A), u, 2)}$. Find its central angle.`,
            `半径为 $${tex(r, u)}$ 的圆中，一个扇形的面积是 $${tex(piTex(A), u, 2)}$。求它的圆心角。`,
          ),
          answer: theta,
          unit: "°",
          wrong: [theta * r, 360 - theta, q(theta, 2)],
          solution: t(
            `Compare with the area of the circle, $${piTex(r * r)}$:${steps(`\\frac{\\theta}{360} = \\frac{${piTex(A)}}{${piTex(r * r)}} = ${q(theta, 360).toLatex()}`, `\\theta = ${q(theta, 360).toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}`,
            `与圆的面积 $${piTex(r * r)}$ 比较：${steps(`\\frac{\\theta}{360} = \\frac{${piTex(A)}}{${piTex(r * r)}} = ${q(theta, 360).toLatex()}`, `\\theta = ${q(theta, 360).toLatex()} \\cdot 360^\\circ = ${theta}^\\circ`)}`,
          ),
        });
      },
    },
    {
      id: "radius-from-sector-area",
      title: t("The radius from the area", "由面积求半径"),
      explanation: t(
        "If you know a sector's area and angle, write the area formula and solve for $r^2$, then take the square root.\n\nA sector of $90^\\circ$ with area $16\\pi\\text{ m}^2$ gives $\\frac{1}{4}\\pi r^2 = 16\\pi$, so $r^2 = 64$ and $r = 8$ m.",
        "已知扇形的面积和圆心角，列出面积公式解出 $r^2$，再开平方。\n\n圆心角 $90^\\circ$、面积 $16\\pi\\text{ m}^2$ 的扇形满足 $\\frac{1}{4}\\pi r^2 = 16\\pi$，所以 $r^2 = 64$，$r = 8$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const A = q(theta * r * r, 360);
        const f = q(theta, 360);
        return numberProblem({
          prompt: t(
            `A sector with a central angle of $${theta}^\\circ$ has an area of $${tex(piTex(A), u, 2)}$. Find the radius of the circle.`,
            `圆心角为 $${theta}^\\circ$ 的扇形面积是 $${tex(piTex(A), u, 2)}$。求圆的半径。`,
          ),
          answer: r,
          unit: u,
          wrong: [r * r, 2 * r, A],
          solution: t(
            `The sector is $${f.toLatex()}$ of the circle:${steps(`${f.toLatex()} \\pi r^2 = ${piTex(A)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
            `扇形占圆的 $${f.toLatex()}$：${steps(`${f.toLatex()} \\pi r^2 = ${piTex(A)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "sector-area-from-arc-length",
      title: t("Area from the arc length", "由弧长求面积"),
      explanation: t(
        "A sector's arc length and area are the same fraction of the circumference and of the area of the circle. So if the arc length is $L$, the sector is $\\frac{L}{2\\pi r}$ of the circle, and\n\n$$A = \\frac{L}{2\\pi r} \\cdot \\pi r^2 = \\frac{1}{2} L r.$$\n\nA sector of a circle of radius $6$ cm with arc length $4\\pi$ cm has area $\\frac{1}{2} \\cdot 4\\pi \\cdot 6 = 12\\pi\\text{ cm}^2$.",
        "扇形的弧长和面积分别占圆周长和圆面积的同一个分数。所以若弧长为 $L$，扇形占圆的 $\\frac{L}{2\\pi r}$，于是\n\n$$A = \\frac{L}{2\\pi r} \\cdot \\pi r^2 = \\frac{1}{2} L r.$$\n\n半径为 $6$ 厘米、弧长为 $4\\pi$ 厘米的扇形，面积是 $\\frac{1}{2} \\cdot 4\\pi \\cdot 6 = 12\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(anyAngles);
        const r = rng.int(2, 15);
        const L = q(theta * r, 180);
        const A = L.mul(q(r, 2));
        return piProblem({
          prompt: t(
            `A sector of a circle with radius $${tex(r, u)}$ has an arc length of $${tex(piTex(L), u)}$. Find the area of the sector.${PI_EN}`,
            `半径为 $${tex(r, u)}$ 的圆中，一个扇形的弧长是 $${tex(piTex(L), u)}$。求这个扇形的面积。${PI_ZH}`,
          ),
          answer: piTex(A),
          unit: `${u}^2`,
          wrong: [piTex(L.mul(q(r))), piTex(L.mul(q(r * r, 2))), piTex(L.mul(q(1, 2)))],
          solution: t(
            `Use $A = \\frac{1}{2} L r$:${steps(`A = \\frac{1}{2} \\cdot ${piTex(L)} \\cdot ${r} = ${tex(piTex(A), u, 2)}`)}`,
            `用 $A = \\frac{1}{2} L r$：${steps(`A = \\frac{1}{2} \\cdot ${piTex(L)} \\cdot ${r} = ${tex(piTex(A), u, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "perimeter-of-a-sector",
      title: t("Perimeter of a sector", "扇形的周长"),
      explanation: t(
        "The boundary of a sector is two radii and an arc, so its perimeter is\n\n$$P = 2r + L.$$\n\nA sector of $90^\\circ$ in a circle of radius $8$ cm has arc length $\\frac{1}{4} \\cdot 16\\pi = 4\\pi$ cm, so its perimeter is $(16 + 4\\pi)$ cm. The radii and the arc are not like terms: leave the answer as a sum.",
        "扇形的边界由两条半径和一段弧组成，所以它的周长是\n\n$$P = 2r + L.$$\n\n在半径为 $8$ 厘米的圆中，$90^\\circ$ 扇形的弧长是 $\\frac{1}{4} \\cdot 16\\pi = 4\\pi$ 厘米，所以周长是 $(16 + 4\\pi)$ 厘米。半径与弧长不是同类项，答案保留为和的形式。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const theta = rng.pick(minorAngles);
        const r = rng.int(2, 18);
        const L = q(theta * r, 180);
        return {
          ...piProblem({
            prompt: t(`Find the perimeter of sector $AOB$.${PI_EN}`, `求扇形 $AOB$ 的周长。${PI_ZH}`),
            answer: piSum(2 * r, L),
            unit: u,
            wrong: [piTex(L), piSum(r, L), piSum(2 * r, q(theta * r * r, 360)), piSum(2 * r, q((360 - theta) * r, 180))],
            solution: t(
              `The arc length is $\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}$. Add the two radii:${steps(`P = 2 \\cdot ${r} + ${piTex(L)} = ${tex(`(${piSum(2 * r, L)})`, u)}`)}`,
              `弧长是 $\\frac{${theta}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}$。再加上两条半径：${steps(`P = 2 \\cdot ${r} + ${piTex(L)} = ${tex(`(${piSum(2 * r, L)})`, u)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), theta, deg(theta), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${theta}°.`,
            `半径为 ${r} ${u}、圆心角为 ${theta}° 的扇形 AOB。`,
          ),
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
    { topic: "the-circumference-of-a-circle", weight: 0.3 },
    { topic: "composite-shapes", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.7.G.B.4", "CCSS.7.G.B.6"],
  knowledgePoints: [
    {
      id: "area-of-a-ring",
      title: t("Area of a ring", "圆环的面积"),
      explanation: t(
        "The region between two circles with the same center is a **ring** (an annulus). Its area is the area of the large circle minus the area of the small one:\n\n$$A = \\pi R^2 - \\pi r^2.$$\n\nFor radii $5$ cm and $3$ cm, $A = 25\\pi - 9\\pi = 16\\pi\\text{ cm}^2$. Square each radius separately: $(5 - 3)^2 \\pi = 4\\pi$ is wrong.",
        "两个同心圆之间的区域叫**圆环**。它的面积是大圆面积减去小圆面积：\n\n$$A = \\pi R^2 - \\pi r^2.$$\n\n半径为 $5$ 厘米和 $3$ 厘米时，$A = 25\\pi - 9\\pi = 16\\pi\\text{ cm}^2$。要分别把两个半径平方：$(5 - 3)^2 \\pi = 4\\pi$ 是错的。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const big = rng.int(4, 20);
        const small = rng.int(1, big - 1);
        const s = rng.int(0, 359);
        const rs = (R * small) / big;
        return {
          ...piProblem({
            prompt: t(
              `Find the area of the ring between the two circles with center $O$.${PI_EN}`,
              `求以 $O$ 为圆心的两个圆之间圆环的面积。${PI_ZH}`,
            ),
            answer: piTex(big * big - small * small),
            unit: `${u}^2`,
            wrong: [piTex((big - small) ** 2), piTex(big * big), piTex(big * big + small * small), piTex(2 * (big - small))],
            solution: t(
              `Subtract the area of the small circle from that of the large one:${steps(`A = \\pi \\cdot ${big}^2 - \\pi \\cdot ${small}^2 = ${piTex(big * big)} - ${piTex(small * small)} = ${tex(piTex(big * big - small * small), u, 2)}`)}`,
              `用大圆面积减去小圆面积：${steps(`A = \\pi \\cdot ${big}^2 - \\pi \\cdot ${small}^2 = ${piTex(big * big)} - ${piTex(small * small)} = ${tex(piTex(big * big - small * small), u, 2)}`)}`,
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
        };
      },
    },
    {
      id: "area-of-shapes-with-semicircles",
      title: t("Areas of shapes with semicircles", "含半圆图形的面积"),
      explanation: t(
        "Split a composite shape into pieces you know. A semicircle on a side of length $w$ has radius $\\frac{w}{2}$ and area $\\frac{1}{2}\\pi \\left(\\frac{w}{2}\\right)^2$.\n\nA $10$ cm by $6$ cm rectangle with a semicircle on a $6$ cm side has area $60 + \\frac{1}{2}\\pi \\cdot 3^2 = \\left(60 + \\frac{9}{2}\\pi\\right)\\text{ cm}^2$. If the semicircle is cut out instead, subtract it: $\\left(60 - \\frac{9}{2}\\pi\\right)\\text{ cm}^2$.",
        "把组合图形分成熟悉的几部分。以长为 $w$ 的边为直径的半圆，半径是 $\\frac{w}{2}$，面积是 $\\frac{1}{2}\\pi \\left(\\frac{w}{2}\\right)^2$。\n\n$10$ 厘米 × $6$ 厘米的长方形在一条 $6$ 厘米的边上加一个半圆，面积是 $60 + \\frac{1}{2}\\pi \\cdot 3^2 = \\left(60 + \\frac{9}{2}\\pi\\right)\\text{ cm}^2$。若是挖去这个半圆，就减去它：$\\left(60 - \\frac{9}{2}\\pi\\right)\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = 2 * rng.int(1, 8);
        const l = rng.int(w / 2 + 3, 22);
        const inward = rng.bool();
        const half = q(w * w, 8);
        const sign = inward ? -1 : 1;
        const pts = semicircleShape(l, w, inward);
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
            answer: piSum(l * w, half.mul(q(sign))),
            unit: `${u}^2`,
            wrong: [
              piSum(l * w, q(w * w, 4).mul(q(sign))),
              piSum(l * w, q(w * w, 2).mul(q(sign))),
              piSum(l * w, half.mul(q(-sign))),
              String(l * w),
            ],
            solution: t(
              `The rectangle has area $${l} \\cdot ${w} = ${l * w}$. The semicircle has radius $${w / 2}$:${steps(`\\frac{1}{2}\\pi \\cdot ${w / 2}^2 = ${piTex(half)}`, `A = ${l * w} ${inward ? "-" : "+"} ${piTex(half)}`)}The area is $${tex(`(${piSum(l * w, half.mul(q(sign)))})`, u, 2)}$.`,
              `长方形的面积是 $${l} \\cdot ${w} = ${l * w}$。半圆的半径是 $${w / 2}$：${steps(`\\frac{1}{2}\\pi \\cdot ${w / 2}^2 = ${piTex(half)}`, `A = ${l * w} ${inward ? "-" : "+"} ${piTex(half)}`)}面积是 $${tex(`(${piSum(l * w, half.mul(q(sign)))})`, u, 2)}$。`,
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
        };
      },
    },
    {
      id: "perimeter-of-shapes-with-semicircles",
      title: t("Perimeters of shapes with semicircles", "含半圆图形的周长"),
      explanation: t(
        "The perimeter is the length of the outside boundary only. A semicircle of diameter $w$ adds half a circumference, $\\frac{1}{2}\\pi w$, and the side it is drawn on is no longer part of the boundary.\n\nA $10$ cm by $6$ cm rectangle with a semicircle on a $6$ cm side has perimeter $10 + 10 + 6 + 3\\pi = (26 + 3\\pi)$ cm.",
        "周长只算外边界的长度。直径为 $w$ 的半圆贡献半个圆周 $\\frac{1}{2}\\pi w$，而它所在的那条边不再是边界的一部分。\n\n$10$ 厘米 × $6$ 厘米的长方形在一条 $6$ 厘米的边上加一个半圆，周长是 $10 + 10 + 6 + 3\\pi = (26 + 3\\pi)$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = 2 * rng.int(1, 8);
        const l = rng.int(w / 2 + 3, 22);
        const inward = rng.bool();
        const straight = 2 * l + w;
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
            answer: piSum(straight, q(w, 2)),
            unit: u,
            wrong: [piSum(straight + w, q(w, 2)), piSum(straight, w), piSum(straight, q(w * w, 8)), piSum(straight - w, q(w, 2))],
            solution: t(
              `The straight sides are $${l}$, $${w}$ and $${l}$; the side under the semicircle is not on the boundary. The semicircle is half a circumference:${steps(`\\frac{1}{2}\\pi \\cdot ${w} = ${piTex(q(w, 2))}`, `P = ${l} + ${w} + ${l} + ${piTex(q(w, 2))} = ${piSum(straight, q(w, 2))}`)}`,
              `直边是 $${l}$、$${w}$、$${l}$；半圆所在的那条边不在边界上。半圆是半个圆周：${steps(`\\frac{1}{2}\\pi \\cdot ${w} = ${piTex(q(w, 2))}`, `P = ${l} + ${w} + ${l} + ${piTex(q(w, 2))} = ${piSum(straight, q(w, 2))}`)}`,
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
        };
      },
    },
    {
      id: "shaded-regions-with-quarter-circles",
      title: t("Shaded regions", "阴影部分的面积"),
      explanation: t(
        "To find the area of a region left over when one shape is removed from another, subtract the areas.\n\nA quarter circle with radius $s$ drawn inside a square of side $s$, centered at a corner, has area $\\frac{1}{4}\\pi s^2$. For $s = 6$ cm, the part of the square outside it has area $36 - 9\\pi\\text{ cm}^2$, about $7.7\\text{ cm}^2$.",
        "求一个图形去掉另一个图形后剩下部分的面积，就把面积相减。\n\n在边长为 $s$ 的正方形内，以一个顶点为圆心、$s$ 为半径画四分之一圆，它的面积是 $\\frac{1}{4}\\pi s^2$。当 $s = 6$ 厘米时，正方形在它外面的部分面积是 $36 - 9\\pi\\text{ cm}^2$，约为 $7.7\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        const quarter = q(s * s, 4);
        return {
          ...piProblem({
            prompt: t(
              `A quarter circle centered at a corner of the square has a radius equal to the side of the square. Find the area of the part of the square outside the quarter circle.${PI_EN}`,
              `以正方形的一个顶点为圆心、边长为半径画四分之一圆。求正方形在四分之一圆外面部分的面积。${PI_ZH}`,
            ),
            answer: piSum(s * s, quarter.neg()),
            unit: `${u}^2`,
            wrong: [piSum(s * s, -s * s), piSum(s * s, q(s * s, 2).neg()), piTex(quarter), piSum(s * s, q(s * s, 16).neg())],
            solution: t(
              `The square has area $${s}^2 = ${s * s}$ and the quarter circle has area $\\frac{1}{4}\\pi \\cdot ${s}^2 = ${piTex(quarter)}$:${steps(`A = ${piSum(s * s, quarter.neg())}`)}`,
              `正方形面积是 $${s}^2 = ${s * s}$，四分之一圆面积是 $\\frac{1}{4}\\pi \\cdot ${s}^2 = ${piTex(quarter)}$：${steps(`A = ${piSum(s * s, quarter.neg())}`)}`,
            ),
          }),
          figure: figure(
            [
              {
                kind: "polygon",
                points: [
                  [0, 0],
                  [s, 0],
                  [s, s],
                  [0, s],
                ],
              },
              ...arcAt(0, 90, s, [0, 0]),
              { kind: "dot", at: [0, 0] },
              { kind: "side", a: [0, 0], b: [s, 0], text: len(s, u) },
            ],
            `A square with side ${s} ${u} and a quarter circle centered at its bottom-left corner.`,
            `边长为 ${s} ${u} 的正方形，以左下角为圆心画有四分之一圆。`,
          ),
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

export const circlesInscribedInSquares: TopicDef = {
  id: "circles-inscribed-in-squares",
  title: t("Circles Inscribed in Squares", "正方形的内切圆"),
  summary: t(
    "Relate a square to the circle inscribed in it: the diameter equals the side.",
    "理解正方形与它的内切圆的关系：圆的直径等于正方形的边长。",
  ),
  prerequisites: ["areas-of-circles"],
  encompasses: [
    { topic: "areas-of-circles", weight: 0.5 },
    { topic: "area-of-rectangles-and-squares", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.7.G.B.4"],
  knowledgePoints: [
    {
      id: "side-and-radius",
      title: t("Side and radius", "边长与半径"),
      explanation: t(
        "A circle **inscribed** in a square touches all four sides. Its diameter goes straight across the square, so it equals the side:\n\n$$d = s, \\qquad r = \\frac{s}{2}.$$\n\nA circle of radius $5$ cm fits exactly in a square of side $10$ cm, whose perimeter is $40$ cm and area $100\\text{ cm}^2$.",
        "**内切**于正方形的圆与正方形的四条边都相切。它的直径正好横跨正方形，所以等于边长：\n\n$$d = s, \\qquad r = \\frac{s}{2}.$$\n\n半径为 $5$ 厘米的圆正好放进边长为 $10$ 厘米的正方形中，这个正方形的周长是 $40$ 厘米，面积是 $100\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const s = rng.int(3, 40);
          return {
            ...numberProblem({
              prompt: t("A circle is inscribed in the square. Find the radius of the circle.", "正方形内有一个内切圆。求圆的半径。"),
              answer: q(s, 2),
              unit: u,
              wrong: [s, 2 * s, q(s, 4)],
              solution: t(
                `The diameter of the circle equals the side of the square, $${s}$:${steps(`r = \\frac{${s}}{2} = ${tex(q(s, 2).toLatex(), u)}`)}`,
                `圆的直径等于正方形的边长 $${s}$：${steps(`r = \\frac{${s}}{2} = ${tex(q(s, 2).toLatex(), u)}`)}`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
          };
        }
        const r = rng.int(2, 20);
        const fig = figure(
          squareWithCircle(2 * r, [seg(O, [r, 0], true), { kind: "side", a: O, b: [r, 0], text: len(r, u) }]),
          `A circle with radius ${r} ${u} inscribed in a square.`,
          `半径为 ${r} ${u} 的圆内切于一个正方形。`,
        );
        if (kind === 1) {
          return {
            ...numberProblem({
              prompt: t("A circle is inscribed in the square. Find the perimeter of the square.", "正方形内有一个内切圆。求正方形的周长。"),
              answer: 8 * r,
              unit: u,
              wrong: [4 * r, 2 * r, 16 * r],
              solution: t(
                `The side of the square is the diameter, $2 \\cdot ${r} = ${2 * r}$:${steps(`P = 4 \\cdot ${2 * r} = ${tex(8 * r, u)}`)}`,
                `正方形的边长等于直径 $2 \\cdot ${r} = ${2 * r}$：${steps(`P = 4 \\cdot ${2 * r} = ${tex(8 * r, u)}`)}`,
              ),
            }),
            figure: fig,
          };
        }
        return {
          ...numberProblem({
            prompt: t("A circle is inscribed in the square. Find the area of the square.", "正方形内有一个内切圆。求正方形的面积。"),
            answer: 4 * r * r,
            unit: `${u}^2`,
            wrong: [r * r, 2 * r * r, 8 * r],
            solution: t(
              `The side of the square is the diameter, $2 \\cdot ${r} = ${2 * r}$:${steps(`A = ${2 * r}^2 = ${tex(4 * r * r, u, 2)}`)}`,
              `正方形的边长等于直径 $2 \\cdot ${r} = ${2 * r}$：${steps(`A = ${2 * r}^2 = ${tex(4 * r * r, u, 2)}`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "area-of-an-inscribed-circle",
      title: t("Area of an inscribed circle", "内切圆的面积"),
      explanation: t(
        "The inscribed circle of a square of side $s$ has radius $\\frac{s}{2}$, so its area is\n\n$$\\pi \\left(\\frac{s}{2}\\right)^2 = \\frac{\\pi s^2}{4},$$\n\na quarter of $\\pi$ times the area of the square. A square of side $8$ m has an inscribed circle of area $16\\pi\\text{ m}^2$; a square of area $36\\text{ m}^2$ has side $6$ m and an inscribed circle of area $9\\pi\\text{ m}^2$.",
        "边长为 $s$ 的正方形，其内切圆半径是 $\\frac{s}{2}$，所以面积是\n\n$$\\pi \\left(\\frac{s}{2}\\right)^2 = \\frac{\\pi s^2}{4},$$\n\n即正方形面积乘以 $\\pi$ 再除以 $4$。边长为 $8$ 米的正方形，内切圆面积是 $16\\pi\\text{ m}^2$；面积为 $36\\text{ m}^2$ 的正方形边长是 $6$ 米，内切圆面积是 $9\\pi\\text{ m}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 30);
        const a = q(s * s, 4);
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
              solution: t(
                `The radius is half the side, $\\frac{${s}}{2}$:${steps(`A = \\pi \\left(\\frac{${s}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
                `半径是边长的一半 $\\frac{${s}}{2}$：${steps(`A = \\pi \\left(\\frac{${s}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
          };
        }
        return piProblem({
          prompt: t(
            `A square has an area of $${tex(s * s, u, 2)}$. Find the area of the circle inscribed in it.${PI_EN}`,
            `一个正方形的面积是 $${tex(s * s, u, 2)}$。求它的内切圆的面积。${PI_ZH}`,
          ),
          answer: piTex(a),
          unit: `${u}^2`,
          wrong: [piTex(s * s), piTex(q(s * s, 2)), piTex(s)],
          solution: t(
            `The side is $\\sqrt{${s * s}} = ${s}$, so the radius is $\\frac{${s}}{2}$:${steps(`A = \\pi \\left(\\frac{${s}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
            `边长是 $\\sqrt{${s * s}} = ${s}$，所以半径是 $\\frac{${s}}{2}$：${steps(`A = \\pi \\left(\\frac{${s}}{2}\\right)^2 = ${tex(piTex(a), u, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "between-the-square-and-the-circle",
      title: t("Between the square and the circle", "正方形与圆之间"),
      explanation: t(
        "The four corners of the square outside its inscribed circle have total area\n\n$$s^2 - \\frac{\\pi s^2}{4}.$$\n\nFor $s = 10$ cm that is $(100 - 25\\pi)\\text{ cm}^2$. The circumference of the inscribed circle is $\\pi s$: for a square of perimeter $40$ cm, the side is $10$ cm and the circle's circumference is $10\\pi$ cm.",
        "正方形在内切圆外的四个角的总面积是\n\n$$s^2 - \\frac{\\pi s^2}{4}.$$\n\n当 $s = 10$ 厘米时，它是 $(100 - 25\\pi)\\text{ cm}^2$。内切圆的周长是 $\\pi s$：周长为 $40$ 厘米的正方形边长是 $10$ 厘米，内切圆周长是 $10\\pi$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 30);
        const a = q(s * s, 4);
        if (rng.bool()) {
          return {
            ...piProblem({
              prompt: t(
                `A circle is inscribed in the square. Find the area of the part of the square outside the circle.${PI_EN}`,
                `正方形内有一个内切圆。求正方形在圆外部分的面积。${PI_ZH}`,
              ),
              answer: piSum(s * s, a.neg()),
              unit: `${u}^2`,
              wrong: [piSum(s * s, -s * s), piSum(s * s, q(s * s, 2).neg()), piTex(a), piSum(4 * s, a.neg())],
              solution: t(
                `Subtract the area of the circle, $\\pi \\left(\\frac{${s}}{2}\\right)^2 = ${piTex(a)}$, from the area of the square, $${s * s}$:${steps(`A = ${piSum(s * s, a.neg())}`)}`,
                `用正方形面积 $${s * s}$ 减去圆面积 $\\pi \\left(\\frac{${s}}{2}\\right)^2 = ${piTex(a)}$：${steps(`A = ${piSum(s * s, a.neg())}`)}`,
              ),
            }),
            figure: figure(
              squareWithCircle(s, [{ kind: "side", a: [-s / 2, -s / 2], b: [s / 2, -s / 2], text: len(s, u) }]),
              `A square with side ${s} ${u} and its inscribed circle.`,
              `边长为 ${s} ${u} 的正方形及其内切圆。`,
            ),
          };
        }
        return piProblem({
          prompt: t(
            `A square has a perimeter of $${tex(4 * s, u)}$. Find the circumference of the circle inscribed in it.${PI_EN}`,
            `一个正方形的周长是 $${tex(4 * s, u)}$。求它的内切圆的周长。${PI_ZH}`,
          ),
          answer: piTex(s),
          unit: u,
          wrong: [piTex(4 * s), piTex(2 * s), piTex(q(s, 2))],
          solution: t(
            `The side is $${4 * s} \\div 4 = ${s}$, which is the diameter of the circle:${steps(`C = \\pi d = ${tex(piTex(s), u)}`)}`,
            `边长是 $${4 * s} \\div 4 = ${s}$，也就是圆的直径：${steps(`C = \\pi d = ${tex(piTex(s), u)}`)}`,
          ),
        });
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

export const squaresInscribedInCircles: TopicDef = {
  id: "squares-inscribed-in-circles",
  title: t("Squares Inscribed in Circles", "圆的内接正方形"),
  summary: t(
    "Relate a circle to the square inscribed in it: the diagonals of the square are diameters.",
    "理解圆与它的内接正方形的关系：正方形的对角线是圆的直径。",
  ),
  prerequisites: ["circles-inscribed-in-squares", "simplifying-square-roots", "area-of-triangles"],
  encompasses: [
    { topic: "circles-inscribed-in-squares", weight: 0.3 },
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "areas-of-circles", weight: 0.3 },
    { topic: "area-of-triangles", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.A.3"],
  knowledgePoints: [
    {
      id: "area-of-an-inscribed-square",
      title: t("Area of an inscribed square", "内接正方形的面积"),
      explanation: t(
        "A square **inscribed** in a circle has all four vertices on the circle. Its diagonals are diameters, and they are perpendicular and meet at the center. They cut the square into four right triangles whose legs are radii, so\n\n$$A = 4 \\cdot \\frac{1}{2} r^2 = 2r^2.$$\n\nA square inscribed in a circle of radius $5$ cm has area $50\\text{ cm}^2$. In terms of the diameter, $A = \\frac{d^2}{2}$.",
        "**内接**于圆的正方形四个顶点都在圆上。它的对角线都是直径，互相垂直且交于圆心。对角线把正方形分成四个直角三角形，直角边都是半径，所以\n\n$$A = 4 \\cdot \\frac{1}{2} r^2 = 2r^2.$$\n\n半径为 $5$ 厘米的圆的内接正方形面积是 $50\\text{ cm}^2$。用直径表示，$A = \\frac{d^2}{2}$。",
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
                `The diagonals cut the square into four right triangles with legs $${r}$:${steps(`A = 4 \\cdot \\frac{1}{2} \\cdot ${r}^2 = ${tex(2 * r * r, u, 2)}`)}`,
                `对角线把正方形分成四个直角边为 $${r}$ 的直角三角形：${steps(`A = 4 \\cdot \\frac{1}{2} \\cdot ${r}^2 = ${tex(2 * r * r, u, 2)}`)}`,
              ),
            }),
            figure: figure(
              circleWithSquare(rot, [{ kind: "side", a: O, b: on(rot + 45), text: len(r, u) }]),
              `A square inscribed in a circle of radius ${r} ${u}, with its diagonals drawn.`,
              `一个内接于半径为 ${r} ${u} 的圆的正方形，画出了对角线。`,
            ),
          };
        }
        const d = rng.int(3, 30);
        return numberProblem({
          prompt: t(
            `A square is inscribed in a circle with a diameter of $${tex(d, u)}$. Find the area of the square.`,
            `一个正方形内接于直径为 $${tex(d, u)}$ 的圆。求正方形的面积。`,
          ),
          answer: q(d * d, 2),
          unit: `${u}^2`,
          wrong: [d * d, q(d * d, 4), 2 * d * d],
          solution: t(
            `The diagonals are diameters of length $${d}$, so the four right triangles have legs $\\frac{${d}}{2}$:${steps(`A = 4 \\cdot \\frac{1}{2} \\left(\\frac{${d}}{2}\\right)^2 = \\frac{${d}^2}{2} = ${tex(q(d * d, 2).toLatex(), u, 2)}`)}`,
            `对角线是长为 $${d}$ 的直径，所以四个直角三角形的直角边是 $\\frac{${d}}{2}$：${steps(`A = 4 \\cdot \\frac{1}{2} \\left(\\frac{${d}}{2}\\right)^2 = \\frac{${d}^2}{2} = ${tex(q(d * d, 2).toLatex(), u, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "side-of-an-inscribed-square",
      title: t("Side of an inscribed square", "内接正方形的边长"),
      explanation: t(
        "From $s^2 = A = 2r^2$, the side of the inscribed square is\n\n$$s = \\sqrt{2r^2} = r\\sqrt{2}.$$\n\nA square inscribed in a circle of radius $6$ cm has side $6\\sqrt{2}$ cm. Going the other way, a square of side $s$ fits in a circle of radius $\\frac{s}{\\sqrt{2}} = \\frac{s\\sqrt{2}}{2}$: for $s = 4$, $r = 2\\sqrt{2}$.",
        "由 $s^2 = A = 2r^2$，内接正方形的边长是\n\n$$s = \\sqrt{2r^2} = r\\sqrt{2}.$$\n\n半径为 $6$ 厘米的圆的内接正方形边长是 $6\\sqrt{2}$ 厘米。反过来，边长为 $s$ 的正方形的外接圆半径是 $\\frac{s}{\\sqrt{2}} = \\frac{s\\sqrt{2}}{2}$：当 $s = 4$ 时，$r = 2\\sqrt{2}$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const r = rng.int(2, 20);
          return radicalProblem({
            prompt: t(
              `A square is inscribed in a circle with a radius of $${tex(r, u)}$. Find the side length of the square, in ${u}, in simplest radical form.`,
              `一个正方形内接于半径为 $${tex(r, u)}$ 的圆。求正方形的边长（单位：${u}），写成最简根式。`,
            ),
            answer: [r, 2],
            wrong: [String(2 * r), `\\sqrt{${2 * r * r}}`, radical(2 * r, 2), String(r)],
            solution: t(
              `The area of the square is $2 \\cdot ${r}^2 = ${2 * r * r}$:${steps(`s = \\sqrt{${2 * r * r}} = ${radical(r, 2)}`)}`,
              `正方形的面积是 $2 \\cdot ${r}^2 = ${2 * r * r}$：${steps(`s = \\sqrt{${2 * r * r}} = ${radical(r, 2)}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const d = rng.int(3, 30);
          const c = q(d, 2);
          return radicalProblem({
            prompt: t(
              `A square is inscribed in a circle with a diameter of $${tex(d, u)}$. Find the side length of the square, in ${u}, in simplest radical form.`,
              `一个正方形内接于直径为 $${tex(d, u)}$ 的圆。求正方形的边长（单位：${u}），写成最简根式。`,
            ),
            answer: [c, 2],
            wrong: [String(d), radical(d, 2), radical(q(d, 4), 2)],
            solution: t(
              `The diagonal of the square is the diameter, so the area is $\\frac{${d}^2}{2} = ${q(d * d, 2).toLatex()}$:${steps(`s = \\sqrt{${q(d * d, 2).toLatex()}} = ${radical(c, 2)}`)}`,
              `正方形的对角线是直径，所以面积是 $\\frac{${d}^2}{2} = ${q(d * d, 2).toLatex()}$：${steps(`s = \\sqrt{${q(d * d, 2).toLatex()}} = ${radical(c, 2)}`)}`,
            ),
          });
        }
        const s = rng.int(2, 24);
        const c = q(s, 2);
        return radicalProblem({
          prompt: t(
            `A square with a side of $${tex(s, u)}$ is inscribed in a circle. Find the radius of the circle, in ${u}, in simplest radical form.`,
            `边长为 $${tex(s, u)}$ 的正方形内接于一个圆。求圆的半径（单位：${u}），写成最简根式。`,
          ),
          answer: [c, 2],
          wrong: [radical(s, 2), radical(q(s, 4), 2), String(s), `\\frac{${s}}{\\sqrt{2}}`],
          solution: t(
            `The area of the square is $${s * s} = 2r^2$:${steps(`r^2 = ${q(s * s, 2).toLatex()}`, `r = \\sqrt{${q(s * s, 2).toLatex()}} = ${radical(c, 2)}`)}`,
            `正方形的面积是 $${s * s} = 2r^2$：${steps(`r^2 = ${q(s * s, 2).toLatex()}`, `r = \\sqrt{${q(s * s, 2).toLatex()}} = ${radical(c, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "between-the-circle-and-the-square",
      title: t("Between the circle and the square", "圆与正方形之间"),
      explanation: t(
        "The part of a circle outside its inscribed square has area $\\pi r^2 - 2r^2$: for $r = 4$ cm that is $(16\\pi - 32)\\text{ cm}^2$.\n\nIf the square is given, find $r^2$ from its area first: a square of side $6$ m has area $36 = 2r^2$, so $r^2 = 18$ and the circle has area $18\\pi\\text{ m}^2$.",
        "圆在其内接正方形外的部分面积是 $\\pi r^2 - 2r^2$：当 $r = 4$ 厘米时，它是 $(16\\pi - 32)\\text{ cm}^2$。\n\n若已知正方形，先由它的面积求出 $r^2$：边长为 $6$ 米的正方形面积是 $36 = 2r^2$，所以 $r^2 = 18$，圆的面积是 $18\\pi\\text{ m}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const rot = rng.int(0, 89);
        if (rng.bool()) {
          const r = rng.int(2, 20);
          return {
            ...piProblem({
              prompt: t(
                `A square is inscribed in a circle with center $O$. Find the area of the part of the circle outside the square.${PI_EN}`,
                `一个正方形内接于以 $O$ 为圆心的圆。求圆在正方形外部分的面积。${PI_ZH}`,
              ),
              answer: piSum(-2 * r * r, r * r).replace(/^-(\d+) \+ (.*)$/, "$2 - $1"),
              unit: `${u}^2`,
              wrong: [`${piTex(r * r)} - ${4 * r * r}`, `${piTex(r * r)} - ${r * r}`, `${2 * r * r} - ${piTex(r * r)}`, piTex(r * r)],
              solution: t(
                `The circle has area $${piTex(r * r)}$ and the square has area $2 \\cdot ${r}^2 = ${2 * r * r}$:${steps(`A = ${piTex(r * r)} - ${2 * r * r}`)}`,
                `圆的面积是 $${piTex(r * r)}$，正方形的面积是 $2 \\cdot ${r}^2 = ${2 * r * r}$：${steps(`A = ${piTex(r * r)} - ${2 * r * r}`)}`,
              ),
            }),
            figure: figure(
              circleWithSquare(rot, [{ kind: "side", a: O, b: on(rot + 45), text: len(r, u) }]),
              `A square inscribed in a circle of radius ${r} ${u}, with its diagonals drawn.`,
              `一个内接于半径为 ${r} ${u} 的圆的正方形，画出了对角线。`,
            ),
          };
        }
        const s = rng.int(2, 24);
        const a = q(s * s, 2);
        return piProblem({
          prompt: t(
            `A square with a side of $${tex(s, u)}$ is inscribed in a circle. Find the area of the circle.${PI_EN}`,
            `边长为 $${tex(s, u)}$ 的正方形内接于一个圆。求圆的面积。${PI_ZH}`,
          ),
          answer: piTex(a),
          unit: `${u}^2`,
          wrong: [piTex(s * s), piTex(q(s * s, 4)), piTex(2 * s * s)],
          solution: t(
            `The area of the square is $${s * s} = 2r^2$, so $r^2 = ${a.toLatex()}$:${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}`,
            `正方形的面积是 $${s * s} = 2r^2$，所以 $r^2 = ${a.toLatex()}$：${steps(`A = \\pi r^2 = ${tex(piTex(a), u, 2)}`)}`,
          ),
        });
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
