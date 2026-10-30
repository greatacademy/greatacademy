import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, dec, type Mark, type Point, Q, q, radical, sketch } from "@ga/subject-math";

import { expressionProblem, numberProblem, radicalProblem, steps, unitLatex } from "../problems.ts";

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

/** piPlain writes c·π for a figure: "π/3", "2π/3", "π". */
function piPlain(c: Coefficient): string {
  const v = toQ(c);
  const top = v.n === 1n ? "π" : `${v.n}π`;
  return v.d === 1n ? top : `${top}/${v.d}`;
}

const PI_EN = " Give the exact answer in terms of $\\pi$.";
const PI_ZH = "结果保留 $\\pi$。";

/** PiProblem describes a problem whose answer is an exact expression in π. */
interface PiProblem {
  readonly prompt: Text;
  /** answer is the expected expression in LaTeX, fully simplified, such as "16\pi" or "\frac{\pi}{3}". */
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

/** on is the point at distance r from O in direction d degrees. */
const on = (d: number, r = R): Point => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];

const compassPoints: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** dirOf is the compass direction nearest to d degrees. */
const dirOf = (d: number): Compass => compassPoints[(((Math.round(d / 45) % 8) + 8) % 8) as 0]!;

/** arcPoints are points along the arc from angle a counterclockwise to angle b. */
function arcPoints(a: number, b: number): Point[] {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return Array.from({ length: n + 1 }, (_, i) => on(a + (span * i) / n));
}

/** circle draws the circle of radius R about O. */
const circle: Mark = { kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75)) };

/** sectorFigure draws circle O with the minor sector AOB of theta degrees from s highlighted, its angle labeled, radius OA labeled and, optionally, its arc labeled. */
function sectorFigure(s: number, theta: number, angleText: string, radiusText: string | undefined, arcText?: string): Mark[] {
  const [a, b] = [on(s), on(s + theta)];
  const mid = s + theta / 2;
  return [
    circle,
    { kind: "polygon", points: [O, ...arcPoints(s, s + theta)], accent: true },
    { kind: "dot", at: O },
    { kind: "label", at: O, text: "O", dir: dirOf(mid + 180), italic: true },
    { kind: "arc", vertex: O, from: a, to: b, accent: true, label: angleText },
    ...(radiusText ? [{ kind: "side", a: O, b: a, text: radiusText } as const] : []),
    ...(arcText ? [{ kind: "label", at: on(mid, R + 0.6), text: arcText, dir: dirOf(mid) } as const] : []),
    { kind: "dot", at: a },
    { kind: "label", at: a, text: "A", dir: dirOf(s - 25), italic: true },
    { kind: "dot", at: b },
    { kind: "label", at: b, text: "B", dir: dirOf(s + theta + 25), italic: true },
  ];
}

/** minorAngles are central angles in degrees, below 180°, whose radian measures are simple multiples of π. */
const minorAngles = [30, 36, 40, 45, 60, 72, 75, 80, 90, 100, 105, 108, 120, 135, 140, 144, 150, 160] as const;

/** degreeAngles are angles in degrees to convert to radians. */
const degreeAngles = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((k) => 15 * k),
  10,
  18,
  20,
  36,
  40,
  72,
  100,
  140,
  160,
  200,
  252,
  288,
] as const;

/** radians is d degrees in radians, as the coefficient of π. */
const radians = (d: number): Q => q(d, 180);

// ---------------------------------------------------------------------------
// Introduction to radians
// ---------------------------------------------------------------------------

export const introductionToRadians: TopicDef = {
  id: "introduction-to-radians",
  title: t("Introduction to Radians", "弧度制简介"),
  summary: t(
    "Measure an angle in radians as arc length over radius, and convert between degrees and radians.",
    "把角的弧度定义为弧长与半径之比，并在角度和弧度之间换算。",
  ),
  prerequisites: ["calculating-arc-lengths-of-circular-sectors"],
  encompasses: [{ topic: "calculating-arc-lengths-of-circular-sectors", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5", "CCSS.HSF.TF.A.1"],
  knowledgePoints: [
    {
      id: "radian-measure-from-arc-length",
      title: t("Radian measure from arc length", "由弧长求弧度"),
      explanation: t(
        "In a circle of radius $r$, the length $s$ of an arc is proportional to $r$ for a fixed central angle, so the ratio $\\frac{s}{r}$ depends only on the angle. That ratio is the angle's measure in **radians**:\n\n$$\\theta = \\frac{s}{r}.$$\n\nAn angle of $1$ radian cuts off an arc exactly as long as the radius. If an arc of length $12$ cm lies on a circle of radius $5$ cm, its central angle measures $\\frac{12}{5} = 2.4$ radians. Radians are a ratio of two lengths, so they carry no unit of length.",
        "在半径为 $r$ 的圆中，圆心角固定时，弧长 $s$ 与 $r$ 成正比，所以比值 $\\frac{s}{r}$ 只由角决定。这个比值就是角的**弧度**：\n\n$$\\theta = \\frac{s}{r}.$$\n\n$1$ 弧度的角所对的弧长恰好等于半径。若半径为 $5$ 厘米的圆上一段弧长 $12$ 厘米，它所对的圆心角是 $\\frac{12}{5} = 2.4$ 弧度。弧度是两个长度之比，所以没有长度单位。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 12);
        const s = rng.int(Math.ceil(0.4 * r), Math.floor(2.6 * r));
        const theta = q(s, r);
        const d = (s / r) * (180 / Math.PI);
        return {
          ...numberProblem({
            prompt: t(
              `The arc $AB$ has length $${tex(s, u)}$ and the radius is $${tex(r, u)}$. Find the measure of $\\angle AOB$ in radians.`,
              `弧 $AB$ 的长为 $${tex(s, u)}$，半径为 $${tex(r, u)}$。求 $\\angle AOB$ 的弧度数。`,
            ),
            answer: theta,
            wrong: [q(r, s), s * r, q(s, 2 * r), q(2 * s, r)],
            solution: t(
              `Divide the arc length by the radius:${steps(`\\theta = \\frac{s}{r} = \\frac{${s}}{${r}} = ${theta.toLatex()}`)}`,
              `用弧长除以半径：${steps(`\\theta = \\frac{s}{r} = \\frac{${s}}{${r}} = ${theta.toLatex()}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), d, "θ", len(r, u), len(s, u)),
            `Sector AOB of a circle with radius ${r} ${u}; arc AB has length ${s} ${u}.`,
            `半径为 ${r} ${u} 的扇形 AOB；弧 AB 的长为 ${s} ${u}。`,
          ),
        };
      },
    },
    {
      id: "degrees-to-radians",
      title: t("Degrees to radians", "角度化为弧度"),
      explanation: t(
        "A full turn cuts off the whole circumference $2\\pi r$, so it measures $\\frac{2\\pi r}{r} = 2\\pi$ radians. Hence\n\n$$360^\\circ = 2\\pi \\text{ radians}, \\qquad 180^\\circ = \\pi \\text{ radians}.$$\n\nTo convert degrees to radians, multiply by $\\frac{\\pi}{180}$ and simplify the fraction:\n\n$$150^\\circ = 150 \\cdot \\frac{\\pi}{180} = \\frac{5\\pi}{6}.$$",
        "整整一周所对的弧是整个圆周 $2\\pi r$，所以它是 $\\frac{2\\pi r}{r} = 2\\pi$ 弧度。因此\n\n$$360^\\circ = 2\\pi \\text{ 弧度}, \\qquad 180^\\circ = \\pi \\text{ 弧度}.$$\n\n把角度化为弧度，乘以 $\\frac{\\pi}{180}$ 并约分：\n\n$$150^\\circ = 150 \\cdot \\frac{\\pi}{180} = \\frac{5\\pi}{6}.$$",
      ),
      generate(rng) {
        const d = rng.pick(degreeAngles);
        const x = radians(d);
        return piProblem({
          prompt: t(`Convert $${d}^\\circ$ to radians.${PI_EN}`, `把 $${d}^\\circ$ 化为弧度。${PI_ZH}`),
          answer: piTex(x),
          wrong: [piTex(q(180, d)), piTex(q(d, 360)), piTex(q(d, 90)), x.toLatex()],
          solution: t(
            `Multiply by $\\frac{\\pi}{180}$:${steps(`${d}^\\circ = ${d} \\cdot \\frac{\\pi}{180} = ${piTex(x)}`)}`,
            `乘以 $\\frac{\\pi}{180}$：${steps(`${d}^\\circ = ${d} \\cdot \\frac{\\pi}{180} = ${piTex(x)}`)}`,
          ),
        });
      },
    },
    {
      id: "radians-to-degrees",
      title: t("Radians to degrees", "弧度化为角度"),
      explanation: t(
        "Since $\\pi$ radians is $180^\\circ$, multiply a radian measure by $\\frac{180}{\\pi}$ to get degrees. When the measure is a multiple of $\\pi$, this is the same as replacing $\\pi$ by $180^\\circ$:\n\n$$\\frac{3\\pi}{4} = \\frac{3 \\cdot 180^\\circ}{4} = 135^\\circ.$$",
        "因为 $\\pi$ 弧度等于 $180^\\circ$，把弧度数乘以 $\\frac{180}{\\pi}$ 就得到角度。弧度是 $\\pi$ 的倍数时，相当于把 $\\pi$ 换成 $180^\\circ$：\n\n$$\\frac{3\\pi}{4} = \\frac{3 \\cdot 180^\\circ}{4} = 135^\\circ.$$",
      ),
      generate(rng) {
        const d = rng.pick(degreeAngles);
        const x = radians(d);
        return numberProblem({
          prompt: t(`Convert $${piTex(x)}$ radians to degrees.`, `把 $${piTex(x)}$ 弧度化为角度。`),
          answer: d,
          unit: "°",
          wrong: [2 * d, q(d, 2), x.mul(q(360)), q(180).div(x)],
          solution: t(
            `Multiply by $\\frac{180^\\circ}{\\pi}$, which replaces $\\pi$ by $180^\\circ$:${steps(`${piTex(x)} \\cdot \\frac{180^\\circ}{\\pi} = ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}`,
            `乘以 $\\frac{180^\\circ}{\\pi}$，相当于把 $\\pi$ 换成 $180^\\circ$：${steps(`${piTex(x)} \\cdot \\frac{180^\\circ}{\\pi} = ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Arc length with radians
// ---------------------------------------------------------------------------

/** tenths are angles in radians from 0.2 to 3, as exact rationals. */
const tenths = (rng: Rng): Q => q(rng.int(2, 30), 10);

export const calculatingArcLengthUsingRadians: TopicDef = {
  id: "calculating-arc-length-using-radians",
  title: t("Calculating Arc Length Using Radians", "用弧度计算弧长"),
  summary: t(
    "Find arc length as radius times the angle in radians, and find the radius or the angle from the arc length.",
    "用半径乘以弧度求弧长，并由弧长求半径或圆心角。",
  ),
  prerequisites: ["introduction-to-radians"],
  encompasses: [
    { topic: "introduction-to-radians", weight: 0.6 },
    { topic: "calculating-arc-lengths-of-circular-sectors", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  knowledgePoints: [
    {
      id: "arc-length-with-radians",
      title: t("Arc length with an angle in terms of π", "圆心角含 π 时的弧长"),
      explanation: t(
        "Multiplying $\\theta = \\frac{s}{r}$ by $r$ gives the arc length when the central angle $\\theta$ is in radians:\n\n$$s = r\\theta.$$\n\nIn a circle of radius $9$ cm, an arc with central angle $\\frac{2\\pi}{3}$ has length $9 \\cdot \\frac{2\\pi}{3} = 6\\pi$ cm. This agrees with the degree formula, since $\\frac{2\\pi}{3}$ is $120^\\circ$ and $\\frac{120}{360} \\cdot 18\\pi = 6\\pi$, but needs no fraction of $360$.",
        "把 $\\theta = \\frac{s}{r}$ 两边乘以 $r$，就得到圆心角 $\\theta$ 用弧度表示时的弧长：\n\n$$s = r\\theta.$$\n\n在半径为 $9$ 厘米的圆中，圆心角为 $\\frac{2\\pi}{3}$ 的弧长是 $9 \\cdot \\frac{2\\pi}{3} = 6\\pi$ 厘米。这与角度公式一致（$\\frac{2\\pi}{3}$ 即 $120^\\circ$，$\\frac{120}{360} \\cdot 18\\pi = 6\\pi$），但不必再取 $360$ 的几分之几。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        return {
          ...piProblem({
            prompt: t(
              `In circle $O$, the radius is $${tex(r, u)}$ and $\\angle AOB = ${piTex(x)}$ radians. Find the length of arc $AB$.${PI_EN}`,
              `在圆 $O$ 中，半径为 $${tex(r, u)}$，$\\angle AOB = ${piTex(x)}$ 弧度。求弧 $AB$ 的长。${PI_ZH}`,
            ),
            answer: piTex(L),
            unit: u,
            wrong: [piTex(L.mul(q(2))), piTex(x.mul(q(r * r, 2))), piTex(L.div(q(2))), piTex(x.div(q(r)))],
            solution: t(
              `With the angle in radians, multiply it by the radius:${steps(`s = r\\theta = ${r} \\cdot ${piTex(x)} = ${tex(piTex(L), u)}`)}`,
              `圆心角用弧度表示，直接乘以半径：${steps(`s = r\\theta = ${r} \\cdot ${piTex(x)} = ${tex(piTex(L), u)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), d, piPlain(x), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${piPlain(x)} radians.`,
            `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 弧度的扇形 AOB。`,
          ),
        };
      },
    },
    {
      id: "arc-length-with-decimal-radians",
      title: t("Arc length with an angle not in terms of π", "圆心角不含 π 时的弧长"),
      explanation: t(
        "A radian measure need not involve $\\pi$. The formula $s = r\\theta$ works the same way: in a circle of radius $8$ m, a central angle of $1.5$ radians cuts off an arc of length $8 \\cdot 1.5 = 12$ m.",
        "弧度数不一定含有 $\\pi$。公式 $s = r\\theta$ 照样适用：在半径为 $8$ 米的圆中，$1.5$ 弧度的圆心角所对的弧长是 $8 \\cdot 1.5 = 12$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const x = tenths(rng);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        return numberProblem({
          prompt: t(
            `A central angle of $${dec(x)}$ radians lies in a circle of radius $${tex(r, u)}$. Find the length of the arc it cuts off.`,
            `半径为 $${tex(r, u)}$ 的圆中有一个 $${dec(x)}$ 弧度的圆心角。求它所对的弧长。`,
          ),
          answer: L,
          unit: u,
          wrong: [q(r).div(x), L.mul(q(2)), L.div(q(2)), x.mul(q(r * r, 2))],
          solution: t(
            `Multiply the radius by the angle in radians:${steps(`s = r\\theta = ${r} \\cdot ${dec(x)} = ${tex(dec(L), u)}`)}`,
            `用半径乘以弧度数：${steps(`s = r\\theta = ${r} \\cdot ${dec(x)} = ${tex(dec(L), u)}`)}`,
          ),
        });
      },
    },
    {
      id: "radius-or-angle-from-arc-length-in-radians",
      title: t("The radius or the angle from the arc length", "由弧长求半径或圆心角"),
      explanation: t(
        "The formula $s = r\\theta$ links three quantities; knowing two gives the third.\n\nIf an arc of $\\frac{3\\pi}{4}$ radians has length $6\\pi$ cm, then $r \\cdot \\frac{3\\pi}{4} = 6\\pi$, so $r = 6\\pi \\cdot \\frac{4}{3\\pi} = 8$ cm. If an arc of length $10\\pi$ m lies on a circle of radius $12$ m, its central angle is $\\theta = \\frac{s}{r} = \\frac{10\\pi}{12} = \\frac{5\\pi}{6}$ radians.",
        "公式 $s = r\\theta$ 联系着三个量，知道其中两个就能求出第三个。\n\n若 $\\frac{3\\pi}{4}$ 弧度的弧长为 $6\\pi$ 厘米，则 $r \\cdot \\frac{3\\pi}{4} = 6\\pi$，所以 $r = 6\\pi \\cdot \\frac{4}{3\\pi} = 8$ 厘米。若半径为 $12$ 米的圆上一段弧长 $10\\pi$ 米，它所对的圆心角是 $\\theta = \\frac{s}{r} = \\frac{10\\pi}{12} = \\frac{5\\pi}{6}$ 弧度。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `An arc with a central angle of $${piTex(x)}$ radians has a length of $${tex(piTex(L), u)}$. Find the radius of the circle.`,
              `圆心角为 $${piTex(x)}$ 弧度的弧长为 $${tex(piTex(L), u)}$。求圆的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [2 * r, q(r, 2), L.mul(x), q(r * r)],
            solution: t(
              `Write $s = r\\theta$ and divide by the angle:${steps(`r \\cdot ${piTex(x)} = ${piTex(L)}`, `r = ${piTex(L)} \\div ${piTex(x)} = ${tex(r, u)}`)}`,
              `列出 $s = r\\theta$，两边除以圆心角：${steps(`r \\cdot ${piTex(x)} = ${piTex(L)}`, `r = ${piTex(L)} \\div ${piTex(x)} = ${tex(r, u)}`)}`,
            ),
          });
        }
        return piProblem({
          prompt: t(
            `In a circle with radius $${tex(r, u)}$, an arc has a length of $${tex(piTex(L), u)}$. Find its central angle in radians.${PI_EN}`,
            `在半径为 $${tex(r, u)}$ 的圆中，一段弧长为 $${tex(piTex(L), u)}$。求它所对的圆心角的弧度数。${PI_ZH}`,
          ),
          answer: piTex(x),
          wrong: [piTex(x.div(q(2))), piTex(L.mul(q(r))), `${d}`, piTex(x.mul(q(2)))],
          solution: t(
            `Divide the arc length by the radius:${steps(`\\theta = \\frac{s}{r} = \\frac{${piTex(L)}}{${r}} = ${piTex(x)}`)}`,
            `用弧长除以半径：${steps(`\\theta = \\frac{s}{r} = \\frac{${piTex(L)}}{${r}} = ${piTex(x)}`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Sector area with radians
// ---------------------------------------------------------------------------

export const calculatingAreasOfSectorsUsingRadians: TopicDef = {
  id: "calculating-areas-of-sectors-using-radians",
  title: t("Calculating Areas of Sectors Using Radians", "用弧度计算扇形面积"),
  summary: t(
    "Find the area of a sector as half the radius squared times the angle in radians, or half the radius times the arc length.",
    "用半径平方的一半乘以弧度，或半径乘以弧长的一半，求扇形面积。",
  ),
  prerequisites: ["calculating-arc-length-using-radians", "calculating-areas-of-circular-sectors"],
  encompasses: [
    { topic: "calculating-areas-of-circular-sectors", weight: 0.5 },
    { topic: "calculating-arc-length-using-radians", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  knowledgePoints: [
    {
      id: "sector-area-with-radians",
      title: t("Sector area with an angle in terms of π", "圆心角含 π 时的扇形面积"),
      explanation: t(
        "A full turn of $2\\pi$ radians gives the whole disk, of area $\\pi r^2$. A sector with central angle $\\theta$ radians is the fraction $\\frac{\\theta}{2\\pi}$ of it:\n\n$$A = \\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta.$$\n\nA sector of $\\frac{\\pi}{3}$ in a circle of radius $6$ cm has area $\\frac{1}{2} \\cdot 36 \\cdot \\frac{\\pi}{3} = 6\\pi\\text{ cm}^2$.",
        "整整一周 $2\\pi$ 弧度对应整个圆，面积为 $\\pi r^2$。圆心角为 $\\theta$ 弧度的扇形占其中的 $\\frac{\\theta}{2\\pi}$：\n\n$$A = \\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta.$$\n\n在半径为 $6$ 厘米的圆中，$\\frac{\\pi}{3}$ 的扇形面积是 $\\frac{1}{2} \\cdot 36 \\cdot \\frac{\\pi}{3} = 6\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 15);
        const A = x.mul(q(r * r, 2));
        return {
          ...piProblem({
            prompt: t(
              `In circle $O$, the radius is $${tex(r, u)}$ and $\\angle AOB = ${piTex(x)}$ radians. Find the area of sector $AOB$.${PI_EN}`,
              `在圆 $O$ 中，半径为 $${tex(r, u)}$，$\\angle AOB = ${piTex(x)}$ 弧度。求扇形 $AOB$ 的面积。${PI_ZH}`,
            ),
            answer: piTex(A),
            unit: `${u}^2`,
            wrong: [piTex(A.mul(q(2))), piTex(x.mul(q(r))), piTex(x.mul(q(r, 2))), piTex(A.div(q(2)))],
            solution: t(
              `Use $A = \\frac{1}{2} r^2 \\theta$ with the angle in radians:${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = ${tex(piTex(A), u, 2)}`)}`,
              `圆心角用弧度表示，用 $A = \\frac{1}{2} r^2 \\theta$：${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = ${tex(piTex(A), u, 2)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), d, piPlain(x), len(r, u)),
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${piPlain(x)} radians.`,
            `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 弧度的扇形 AOB。`,
          ),
        };
      },
    },
    {
      id: "sector-area-from-decimal-angle-or-arc-length",
      title: t("Sector area from a decimal angle or the arc length", "由小数弧度或弧长求扇形面积"),
      explanation: t(
        "The formula $A = \\frac{1}{2} r^2 \\theta$ works for any angle in radians: a sector of $0.8$ radians in a circle of radius $5$ m has area $\\frac{1}{2} \\cdot 25 \\cdot 0.8 = 10\\text{ m}^2$.\n\nSince the arc length is $s = r\\theta$, the formula can also be written $A = \\frac{1}{2} r \\cdot r\\theta = \\frac{1}{2} r s$. A sector with radius $6$ cm and arc length $7$ cm has area $\\frac{1}{2} \\cdot 6 \\cdot 7 = 21\\text{ cm}^2$, with no angle needed.",
        "公式 $A = \\frac{1}{2} r^2 \\theta$ 对任何弧度都适用：在半径为 $5$ 米的圆中，$0.8$ 弧度的扇形面积是 $\\frac{1}{2} \\cdot 25 \\cdot 0.8 = 10\\text{ m}^2$。\n\n因为弧长 $s = r\\theta$，公式也可以写成 $A = \\frac{1}{2} r \\cdot r\\theta = \\frac{1}{2} r s$。半径为 $6$ 厘米、弧长为 $7$ 厘米的扇形面积是 $\\frac{1}{2} \\cdot 6 \\cdot 7 = 21\\text{ cm}^2$，不必知道圆心角。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 15);
        if (rng.bool()) {
          const x = tenths(rng);
          const A = x.mul(q(r * r, 2));
          return numberProblem({
            prompt: t(
              `A sector of a circle with radius $${tex(r, u)}$ has a central angle of $${dec(x)}$ radians. Find its area.`,
              `半径为 $${tex(r, u)}$ 的圆中有一个圆心角为 $${dec(x)}$ 弧度的扇形。求它的面积。`,
            ),
            answer: A,
            unit: `${u}^2`,
            wrong: [A.mul(q(2)), x.mul(q(r, 2)), x.mul(q(r))],
            solution: t(
              `Use $A = \\frac{1}{2} r^2 \\theta$:${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${dec(x)} = ${tex(dec(A), u, 2)}`)}`,
              `用 $A = \\frac{1}{2} r^2 \\theta$：${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${dec(x)} = ${tex(dec(A), u, 2)}`)}`,
            ),
          });
        }
        const s = rng.int(2, 3 * r);
        const A = q(r * s, 2);
        return {
          ...numberProblem({
            prompt: t(
              `A sector has radius $${tex(r, u)}$ and arc length $${tex(s, u)}$. Find its area.`,
              `一个扇形的半径为 $${tex(r, u)}$，弧长为 $${tex(s, u)}$。求它的面积。`,
            ),
            answer: A,
            unit: `${u}^2`,
            wrong: [r * s, q(s * s, 2 * r), q(r * r * s, 2), q(s, 2 * r)],
            solution: t(
              `Since $s = r\\theta$, the area is $\\frac{1}{2} r^2 \\theta = \\frac{1}{2} r s$:${steps(`A = \\frac{1}{2} \\cdot ${r} \\cdot ${s} = ${tex(A.toLatex(), u, 2)}`)}`,
              `因为 $s = r\\theta$，面积 $\\frac{1}{2} r^2 \\theta = \\frac{1}{2} r s$：${steps(`A = \\frac{1}{2} \\cdot ${r} \\cdot ${s} = ${tex(A.toLatex(), u, 2)}`)}`,
            ),
          }),
          figure: figure(
            sectorFigure(rng.int(0, 359), (s / r) * (180 / Math.PI), "θ", len(r, u), len(s, u)),
            `Sector AOB with radius ${r} ${u} and arc length ${s} ${u}.`,
            `半径为 ${r} ${u}、弧长为 ${s} ${u} 的扇形 AOB。`,
          ),
        };
      },
    },
    {
      id: "radius-or-angle-from-sector-area",
      title: t("The radius or the angle from the sector area", "由扇形面积求半径或圆心角"),
      explanation: t(
        "Solve $A = \\frac{1}{2} r^2 \\theta$ for the unknown.\n\nIf a sector of $\\frac{\\pi}{4}$ radians has area $8\\pi\\text{ cm}^2$, then $\\frac{1}{2} r^2 \\cdot \\frac{\\pi}{4} = 8\\pi$, so $\\frac{\\pi}{8} r^2 = 8\\pi$, $r^2 = 64$ and $r = 8$ cm. If a sector of a circle with radius $6$ m has area $15\\pi\\text{ m}^2$, then $\\frac{1}{2} \\cdot 36 \\cdot \\theta = 15\\pi$, so $\\theta = \\frac{15\\pi}{18} = \\frac{5\\pi}{6}$ radians.",
        "解方程 $A = \\frac{1}{2} r^2 \\theta$ 求未知量。\n\n若 $\\frac{\\pi}{4}$ 弧度的扇形面积为 $8\\pi\\text{ cm}^2$，则 $\\frac{1}{2} r^2 \\cdot \\frac{\\pi}{4} = 8\\pi$，即 $\\frac{\\pi}{8} r^2 = 8\\pi$，$r^2 = 64$，$r = 8$ 厘米。若半径为 $6$ 米的圆中一个扇形面积为 $15\\pi\\text{ m}^2$，则 $\\frac{1}{2} \\cdot 36 \\cdot \\theta = 15\\pi$，所以 $\\theta = \\frac{15\\pi}{18} = \\frac{5\\pi}{6}$ 弧度。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 15);
        const A = x.mul(q(r * r, 2));
        if (rng.bool()) {
          const half = x.div(q(2));
          return numberProblem({
            prompt: t(
              `A sector with a central angle of $${piTex(x)}$ radians has an area of $${tex(piTex(A), u, 2)}$. Find the radius of the circle.`,
              `圆心角为 $${piTex(x)}$ 弧度的扇形面积为 $${tex(piTex(A), u, 2)}$。求圆的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [r * r, 2 * r * r, A.div(x), q(r, 2)],
            solution: t(
              `Write $A = \\frac{1}{2} r^2 \\theta$ and solve for $r$:${steps(`\\frac{1}{2} r^2 \\cdot ${piTex(x)} = ${piTex(A)}`, `${piTex(half)} r^2 = ${piTex(A)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
              `列出 $A = \\frac{1}{2} r^2 \\theta$ 并解出 $r$：${steps(`\\frac{1}{2} r^2 \\cdot ${piTex(x)} = ${piTex(A)}`, `${piTex(half)} r^2 = ${piTex(A)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
            ),
          });
        }
        return piProblem({
          prompt: t(
            `A sector of a circle with radius $${tex(r, u)}$ has an area of $${tex(piTex(A), u, 2)}$. Find its central angle in radians.${PI_EN}`,
            `半径为 $${tex(r, u)}$ 的圆中，一个扇形面积为 $${tex(piTex(A), u, 2)}$。求它的圆心角的弧度数。${PI_ZH}`,
          ),
          answer: piTex(x),
          wrong: [piTex(x.div(q(2))), piTex(x.mul(q(r))), `${d}`, piTex(A.div(q(r * r)).mul(q(4)))],
          solution: t(
            `Write $A = \\frac{1}{2} r^2 \\theta$ and solve for $\\theta$:${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot \\theta = ${piTex(A)}`, `${q(r * r, 2).toLatex()}\\theta = ${piTex(A)}`, `\\theta = ${piTex(x)}`)}`,
            `列出 $A = \\frac{1}{2} r^2 \\theta$ 并解出 $\\theta$：${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot \\theta = ${piTex(A)}`, `${q(r * r, 2).toLatex()}\\theta = ${piTex(A)}`, `\\theta = ${piTex(x)}`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Trigonometric ratios with radians
// ---------------------------------------------------------------------------

/** Fn is one of the three basic trigonometric ratios. */
type Fn = "sin" | "cos" | "tan";

const fns: readonly Fn[] = ["sin", "cos", "tan"];

/** S is an exact number c·√m with m square-free; m = 1 for a rational number. */
type S = readonly [Q, number];

/** Special is a special angle as the denominator n of π/n. */
type Special = 6 | 4 | 3;

const specials: readonly Special[] = [6, 4, 3];

/** specialValue is the exact value of a ratio of π/n. */
function specialValue(f: Fn, n: Special): S {
  const sin: Record<Special, S> = { 6: [q(1, 2), 1], 4: [q(1, 2), 2], 3: [q(1, 2), 3] };
  const tan: Record<Special, S> = { 6: [q(1, 3), 3], 4: [q(1), 1], 3: [q(1), 3] };
  if (f === "sin") return sin[n];
  if (f === "cos") return sin[(n === 6 ? 3 : n === 3 ? 6 : 4) as Special];
  return tan[n];
}

/** times multiplies an exact number by a rational. */
const times = (s: S, c: Coefficient): S => [s[0].mul(toQ(c)), s[1]];

/** over is c divided by an exact number, with the denominator rationalized: c / (a√m) = (c / (a·m))√m. */
const over = (c: Coefficient, s: S): S => [toQ(c).div(s[0].mul(q(s[1]))), s[1]];

const texS = (s: S) => radical(s[0], s[1]);

/** cofn is the ratio a learner confuses with f. */
const cofn: Record<Fn, Fn> = { sin: "cos", cos: "sin", tan: "tan" };

/** otherSpecial is the special angle a learner confuses with π/n. */
const otherSpecial = (n: Special): Special => (n === 6 ? 3 : n === 3 ? 6 : 6);

/** angleTex writes π/n in LaTeX. */
const angleTex = (n: Special) => `\\frac{\\pi}{${n}}`;

/** Side is a side of a right triangle seen from its marked acute angle. */
type Side = "opp" | "adj" | "hyp";

const sideNames: Record<Side, Text> = {
  opp: t("the opposite side", "对边"),
  adj: t("the adjacent side", "邻边"),
  hyp: t("the hypotenuse", "斜边"),
};

/** fnSides are the numerator and denominator sides of each ratio. */
const fnSides: Record<Fn, readonly [Side, Side]> = { sin: ["opp", "hyp"], cos: ["adj", "hyp"], tan: ["opp", "adj"] };

/** SideCase is a known side and a side to find, related by the ratio fn. */
interface SideCase {
  readonly fn: Fn;
  readonly known: Side;
  readonly ask: Side;
}

const sideCases: readonly SideCase[] = fns.flatMap((fn): SideCase[] => {
  const [top, bottom] = fnSides[fn];
  return [
    { fn, known: bottom, ask: top },
    { fn, known: top, ask: bottom },
  ];
});

/** triangleFigure draws right triangle ABC with the right angle at C, angle A of theta radians marked, and two sides labeled. */
function triangleFigure(theta: number, angleText: string, labels: Partial<Record<Side, string>>, en: string, zh: string): Figure {
  const L = 6;
  const A: Point = [0, 0];
  const C: Point = [L * Math.cos(theta), 0];
  const B: Point = [L * Math.cos(theta), L * Math.sin(theta)];
  const side = (a: Point, b: Point, s: Side): Mark[] => (labels[s] ? [{ kind: "side", a, b, text: labels[s] }] : []);
  return figure(
    [
      { kind: "polygon", points: [A, C, B] },
      { kind: "right", vertex: C, from: A, to: B },
      { kind: "arc", vertex: A, from: C, to: B, accent: true, label: angleText },
      ...side(A, C, "adj"),
      ...side(C, B, "opp"),
      ...side(B, A, "hyp"),
      { kind: "label", at: A, text: "A", dir: "sw", italic: true },
      { kind: "label", at: B, text: "B", dir: "ne", italic: true },
      { kind: "label", at: C, text: "C", dir: "se", italic: true },
    ],
    en,
    zh,
  );
}

/** ratioLine writes the ratio equation for a side case: "\sin \frac{\pi}{6} = \frac{x}{10}". */
function ratioLine(c: SideCase, angle: string, n: string): string {
  const [top, bottom] = fnSides[c.fn];
  const v = (s: Side) => (s === c.ask ? "x" : s === c.known ? n : "?");
  return `\\${c.fn} ${angle} = \\frac{${v(top)}}{${v(bottom)}}`;
}

/** trig evaluates a ratio of an angle in radians. */
const trig = (f: Fn, x: number) => (f === "sin" ? Math.sin(x) : f === "cos" ? Math.cos(x) : Math.tan(x));

/** tenth rounds a positive number to the nearest tenth as an exact rational. */
const tenth = (v: number): Q => q(Math.round(v * 10), 10);

export const trigonometricRatiosWithRadians: TopicDef = {
  id: "trigonometric-ratios-with-radians",
  title: t("Trigonometric Ratios With Radians", "弧度制下的三角比"),
  summary: t(
    "Find exact trigonometric ratios of π/6, π/4 and π/3, find special angles in radians, and solve right triangles with angles given in radians.",
    "求 π/6、π/4、π/3 的精确三角比，用弧度表示特殊角，并解角用弧度给出的直角三角形。",
  ),
  prerequisites: [
    "introduction-to-radians",
    "special-trigonometric-ratios",
    "calculating-side-lengths-of-right-triangles-using-trigonometry",
  ],
  encompasses: [
    { topic: "special-trigonometric-ratios", weight: 0.5 },
    { topic: "introduction-to-radians", weight: 0.3 },
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.1 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.3"],
  knowledgePoints: [
    {
      id: "exact-ratios-of-radian-angles",
      title: t("Exact ratios of π/6, π/4 and π/3", "π/6、π/4、π/3 的精确三角比"),
      explanation: t(
        "The special angles in radians are $\\frac{\\pi}{6} = 30^\\circ$, $\\frac{\\pi}{4} = 45^\\circ$ and $\\frac{\\pi}{3} = 60^\\circ$. An angle has the same ratios whichever unit measures it, so convert and use the special right triangles:\n\n| | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\nFor example, $6\\sin \\frac{\\pi}{3} = 6\\sin 60^\\circ = 6 \\cdot \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}$.",
        "用弧度表示的特殊角是 $\\frac{\\pi}{6} = 30^\\circ$、$\\frac{\\pi}{4} = 45^\\circ$、$\\frac{\\pi}{3} = 60^\\circ$。无论用哪种单位度量，同一个角的三角比都相同，所以先换算，再用特殊直角三角形：\n\n| | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\n例如 $6\\sin \\frac{\\pi}{3} = 6\\sin 60^\\circ = 6 \\cdot \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        const n = rng.pick(specials);
        const c = rng.pick([1, 1, 2, 3, 4, 6, 8, 12]);
        const v = specialValue(f, n);
        const answer = times(v, c);
        const coef = c === 1 ? "" : `${c}`;
        const swapped = f === "tan" ? over(c, v) : times(specialValue(cofn[f], n), c);
        return radicalProblem({
          prompt: t(
            `Find the exact value of $${coef}\\${f} ${angleTex(n)}$ in simplest radical form.`,
            `求 $${coef}\\${f} ${angleTex(n)}$ 的精确值，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(swapped), texS(times(specialValue(f, otherSpecial(n)), c)), texS(times(v, 2 * c))],
          solution: t(
            `The angle $${angleTex(n)}$ is $${180 / n}^\\circ$, and $\\${f} ${180 / n}^\\circ = ${texS(v)}$.${c === 1 ? "" : steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
            `角 $${angleTex(n)}$ 即 $${180 / n}^\\circ$，而 $\\${f} ${180 / n}^\\circ = ${texS(v)}$。${c === 1 ? "" : steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "special-angles-in-radians",
      title: t("Special angles in radians from exact values", "由精确值求弧度制特殊角"),
      explanation: t(
        "Read the table backwards and give the angle in radians. If $2\\sin \\theta = \\sqrt{3}$ and $\\theta$ is acute, then $\\sin \\theta = \\frac{\\sqrt{3}}{2}$, so $\\theta = 60^\\circ = \\frac{\\pi}{3}$.",
        "把表反过来读，并用弧度写出角。若 $2\\sin \\theta = \\sqrt{3}$ 且 $\\theta$ 是锐角，则 $\\sin \\theta = \\frac{\\sqrt{3}}{2}$，所以 $\\theta = 60^\\circ = \\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        const n = rng.pick(specials);
        const c = rng.int(1, 4);
        const v = specialValue(f, n);
        const rhs = texS(times(v, c));
        const coef = c === 1 ? "" : `${c}`;
        const isolate = c === 1 ? "" : `Divide by $${c}$:${steps(`\\${f} \\theta = ${texS(v)}`)}`;
        const isolateZh = c === 1 ? "" : `两边除以 $${c}$：${steps(`\\${f} \\theta = ${texS(v)}`)}`;
        return piProblem({
          prompt: t(
            `Find the acute angle $\\theta$, in radians, with $${coef}\\${f} \\theta = ${rhs}$.${PI_EN}`,
            `求满足 $${coef}\\${f} \\theta = ${rhs}$ 的锐角 $\\theta$（用弧度表示）。${PI_ZH}`,
          ),
          answer: angleTex(n),
          wrong: [...specials.filter((m) => m !== n).map(angleTex), `${180 / n}`],
          solution: t(
            `${isolate}From the special right triangles, $\\${f} ${180 / n}^\\circ = ${texS(v)}$, so $\\theta = ${180 / n}^\\circ = ${angleTex(n)}$.`,
            `${isolateZh}由特殊直角三角形，$\\${f} ${180 / n}^\\circ = ${texS(v)}$，所以 $\\theta = ${180 / n}^\\circ = ${angleTex(n)}$。`,
          ),
        });
      },
    },
    {
      id: "exact-sides-with-radian-angles",
      title: t("Exact sides with special angles in radians", "用弧度制特殊角求精确边长"),
      explanation: t(
        "Set up the ratio exactly as with degrees, then use the exact value. In right triangle $ABC$ with $\\angle A = \\frac{\\pi}{6}$ and hypotenuse $AB = 10$, the side opposite $A$ is\n\n$$BC = 10\\sin \\frac{\\pi}{6} = 10 \\cdot \\frac{1}{2} = 5.$$\n\nIf instead the side adjacent to $A$ is $AC = 6$, the hypotenuse is $\\frac{6}{\\cos \\frac{\\pi}{6}} = \\frac{6}{\\frac{\\sqrt{3}}{2}} = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}$.",
        "和角度制一样列出三角比，再代入精确值。在直角三角形 $ABC$ 中，$\\angle A = \\frac{\\pi}{6}$，斜边 $AB = 10$，则 $A$ 的对边\n\n$$BC = 10\\sin \\frac{\\pi}{6} = 10 \\cdot \\frac{1}{2} = 5.$$\n\n若改为已知 $A$ 的邻边 $AC = 6$，则斜边是 $\\frac{6}{\\cos \\frac{\\pi}{6}} = \\frac{6}{\\frac{\\sqrt{3}}{2}} = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}$。",
      ),
      generate(rng) {
        const c = rng.pick(sideCases);
        const n = rng.pick(specials);
        const k = rng.int(2, 20);
        const divide = fnSides[c.fn][1] === c.ask;
        const v = specialValue(c.fn, n);
        const answer = divide ? over(k, v) : times(v, k);
        const labels = { [c.known]: `${k}`, [c.ask]: "x" } as Partial<Record<Side, string>>;
        const solve = divide ? `x = \\frac{${k}}{${texS(v)}} = ${texS(answer)}` : `x = ${k} \\cdot ${texS(v)} = ${texS(answer)}`;
        const others = fns.filter((g) => g !== c.fn);
        const work = steps(ratioLine(c, angleTex(n), `${k}`), solve);
        return {
          ...radicalProblem({
            prompt: t(
              `In the right triangle, $\\angle A = ${angleTex(n)}$. Find $x$ exactly, in simplest radical form.`,
              `在直角三角形中，$\\angle A = ${angleTex(n)}$。求 $x$ 的精确值，答案写成最简根式。`,
            ),
            answer,
            wrong: [
              texS(divide ? times(v, k) : over(k, v)),
              ...others.map((g) => texS(divide ? over(k, specialValue(g, n)) : times(specialValue(g, n), k))),
            ],
            solution: t(
              `Seen from $A$, $x$ is ${sideNames[c.ask].en} and $${k}$ is ${sideNames[c.known].en}, so use $\\${c.fn} ${angleTex(n)} = ${texS(v)}$:${work}`,
              `从 $A$ 看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${k}$ 是${sideNames[c.known]["zh-CN"]}，所以用 $\\${c.fn} ${angleTex(n)} = ${texS(v)}$：${work}`,
            ),
          }),
          figure: triangleFigure(
            Math.PI / n,
            `π/${n}`,
            labels,
            `Right triangle ABC with the right angle at C and angle A of π/${n}; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is x.`,
            `直角三角形 ABC，直角在 C，角 A 为 π/${n}；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}为 x。`,
          ),
        };
      },
    },
    {
      id: "sides-with-decimal-radian-angles",
      title: t("Sides with angles in radians, using a calculator", "用计算器求弧度制角的边长"),
      explanation: t(
        "For an angle such as $0.9$ radians, use a calculator set to **radian mode**; in degree mode it would read $0.9$ as $0.9^\\circ$. In right triangle $ABC$ with $\\angle A = 0.9$ and hypotenuse $AB = 12$, the side opposite $A$ is\n\n$$BC = 12\\sin 0.9 \\approx 12 \\cdot 0.7833 \\approx 9.4.$$",
        "对于像 $0.9$ 弧度这样的角，要把计算器设为**弧度模式**；在角度模式下它会把 $0.9$ 当作 $0.9^\\circ$。在直角三角形 $ABC$ 中，$\\angle A = 0.9$，斜边 $AB = 12$，则 $A$ 的对边\n\n$$BC = 12\\sin 0.9 \\approx 12 \\cdot 0.7833 \\approx 9.4.$$",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.pick(sideCases);
          const x = q(rng.int(3, 13), 10);
          const th = Number(x.n) / Number(x.d);
          const k = rng.int(4, 30);
          const divide = fnSides[c.fn][1] === c.ask;
          const f = trig(c.fn, th);
          const v = divide ? k / f : k * f;
          const frac = v * 10 - Math.floor(v * 10);
          if (Math.abs(frac - 0.5) < 0.05) continue;
          const answer = tenth(v);
          const fDeg = trig(c.fn, (th * Math.PI) / 180);
          const others = fns.filter((g) => g !== c.fn);
          const wrong = [
            divide ? k * f : k / f,
            divide ? k / fDeg : k * fDeg,
            ...others.map((g) => (divide ? k / trig(g, th) : k * trig(g, th))),
          ]
            .filter((w) => Number.isFinite(w) && w > 0 && w < 1e6)
            .map(tenth);
          const labels = { [c.known]: `${k}`, [c.ask]: "x" } as Partial<Record<Side, string>>;
          const solve = divide
            ? `x = \\frac{${k}}{\\${c.fn} ${dec(x)}} \\approx ${dec(answer)}`
            : `x = ${k} \\${c.fn} ${dec(x)} \\approx ${dec(answer)}`;
          const work = steps(ratioLine(c, dec(x), `${k}`), solve);
          return {
            ...numberProblem({
              prompt: t(
                `In the right triangle, $\\angle A = ${dec(x)}$ radians. Find $x$, rounded to the nearest tenth.`,
                `在直角三角形中，$\\angle A = ${dec(x)}$ 弧度。求 $x$，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong,
              solution: t(
                `Seen from $A$, $x$ is ${sideNames[c.ask].en} and $${k}$ is ${sideNames[c.known].en}, so use the ${c.fn === "sin" ? "sine" : c.fn === "cos" ? "cosine" : "tangent"}, with the calculator in radian mode:${work}`,
                `从 $A$ 看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${k}$ 是${sideNames[c.known]["zh-CN"]}，所以用${c.fn === "sin" ? "正弦" : c.fn === "cos" ? "余弦" : "正切"}，计算器设为弧度模式：${work}`,
              ),
            }),
            figure: triangleFigure(
              th,
              `${dec(x)}`,
              labels,
              `Right triangle ABC with the right angle at C and angle A of ${dec(x)} radians; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is x.`,
              `直角三角形 ABC，直角在 C，角 A 为 ${dec(x)} 弧度；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}为 x。`,
            ),
          };
        }
      },
    },
  ],
};

/** geometryRadiansTopics are the Geometry topics on radian measure, in outline order. */
export const geometryRadiansTopics: readonly TopicDef[] = [
  introductionToRadians,
  calculatingArcLengthUsingRadians,
  calculatingAreasOfSectorsUsingRadians,
  trigonometricRatiosWithRadians,
];
