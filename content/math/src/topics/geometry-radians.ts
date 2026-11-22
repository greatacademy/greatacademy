import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, dec, type Mark, type Point, Q, q, radical, sketch } from "@ga/subject-math";
import { radianDrawings } from "../explanation-drawings-circles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { expressionProblem, numberProblem, radicalProblem, steps, unitLatex, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

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

/** fixed writes a number rounded to a number of decimal places, without a negative zero. */
const fixed = (v: number, places = 3) => (Math.abs(v) < 0.5 * 10 ** -places ? 0 : v).toFixed(places);

/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

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

/** sector draws a sector figure as a Figure with its alt text. */
const sector = (
  s: number,
  theta: number,
  angleText: string,
  radiusText: string | undefined,
  arcText: string | undefined,
  en: string,
  zh: string,
): Figure => figure(sectorFigure(s, theta, angleText, radiusText, arcText), en, zh);

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

/** degreesOf is an angle of x radians in degrees, as a number. */
const degreesOf = (x: Q) => (x.toNumber() * 180) / Math.PI;

/** sizeNote compares a conversion with a half turn: an angle below 180° is less than π radians, and so on. */
function sizeNote(d: number, x: Q): Text {
  if (d === 180) return t("A half turn is exactly $\\pi$ radians, as it should be.", "半圈正好是 $\\pi$ 弧度，与预期一致。");
  const less = d < 180;
  return t(
    `The size is right, too: $${d}^\\circ$ is ${less ? "less" : "more"} than a half turn, $180^\\circ$, and $${piTex(x)}$ is ${less ? "less" : "more"} than $\\pi$.`,
    `大小也合理：$${d}^\\circ$ ${less ? "小于" : "大于"}半圈 $180^\\circ$，而 $${piTex(x)}$ 也${less ? "小于" : "大于"} $\\pi$。`,
  );
}

/** arcSegments draws the arc of radius r from a to b degrees as short segments. */
function arcSegments(r: number, a: number, b: number, accent = false): Mark[] {
  const pts = Array.from({ length: 25 }, (_, i) => on(a + ((b - a) * i) / 24, r));
  return pts.slice(1).map((p, i): Mark => ({ kind: "segment", a: pts[i]!, b: p, accent }));
}

/** radianIntroFigure draws a right angle at O with arcs of radius 2 and 5 cut off by it. */
const radianIntroFigure = figure(
  [
    { kind: "segment", a: O, b: on(0) },
    { kind: "segment", a: O, b: on(90) },
    { kind: "right", vertex: O, from: on(0), to: on(90) },
    ...arcSegments(2, 0, 90, true),
    ...arcSegments(5, 0, 90, true),
    { kind: "side", a: on(90, 2), b: O, text: "4" },
    { kind: "side", a: O, b: on(0), text: "10" },
    { kind: "label", at: on(45, 2), text: "2π", dir: "sw" },
    { kind: "label", at: on(45, 5), text: "5π", dir: "ne" },
    { kind: "label", at: O, text: "O", dir: "sw", italic: true },
  ],
  "A right angle at O cutting off two arcs: on the circle of radius 4 the arc is 2π long, and on the circle of radius 10 it is 5π long.",
  "顶点在 O 的直角截出两段弧：半径为 4 的圆上弧长 2π，半径为 10 的圆上弧长 5π。",
);

// ---------------------------------------------------------------------------
// Introduction to radians
// ---------------------------------------------------------------------------

/** introductionToRadians measures angles by arc length over radius and converts between degrees and radians. */
export const introductionToRadians: TopicDef = {
  id: "introduction-to-radians",
  title: t("Introduction to Radians", "弧度制简介"),
  summary: t(
    "Measure an angle in radians as arc length over radius, and convert between degrees and radians.",
    "把角的弧度定义为弧长与半径之比，并在角度和弧度之间换算。",
  ),
  prerequisites: ["calculating-arc-lengths-of-circular-sectors"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5", "CCSS.HSF.TF.A.1"],
  intro: t(
    `An arc with central angle $d^\\circ$ is the fraction $\\frac{d}{360}$ of the circumference $2\\pi r$. Degrees split a full turn into $360$ parts, a number chosen long ago for convenience. There is a measure of angle that comes from the circle itself, and it makes the formulas for arcs and sectors, and later all of trigonometry and calculus, simpler.

Take a right angle, $90^\\circ$, at the center of two circles. On a circle of radius $4$, it cuts off $\\frac{90}{360} \\cdot 2\\pi \\cdot 4 = 2\\pi$. On a circle of radius $10$, it cuts off $\\frac{90}{360} \\cdot 2\\pi \\cdot 10 = 5\\pi$.

{{figure 0}}

The arcs differ, but the arc divided by the radius does not: $\\frac{2\\pi}{4} = \\frac{5\\pi}{10} = \\frac{\\pi}{2}$. Doubling the radius doubles the arc, so this ratio depends only on the angle. It is the angle's measure in **radians**: a right angle is $\\frac{\\pi}{2}$ radians. This topic finds radian measures from arcs and converts between degrees and radians.`,
    `圆心角为 $d^\\circ$ 的弧占圆周 $2\\pi r$ 的 $\\frac{d}{360}$。角度制把一整圈分成 $360$ 份，这个数是很久以前为了方便选定的。还有一种来自圆本身的角的度量，它让弧长和扇形的公式更简单，以后整个三角学和微积分也都因此更简单。

在两个同心圆的圆心处取一个直角 $90^\\circ$。在半径为 $4$ 的圆上，它截出的弧长是 $\\frac{90}{360} \\cdot 2\\pi \\cdot 4 = 2\\pi$；在半径为 $10$ 的圆上，截出的弧长是 $\\frac{90}{360} \\cdot 2\\pi \\cdot 10 = 5\\pi$。

{{figure 0}}

两段弧长度不同，但弧长除以半径却相同：$\\frac{2\\pi}{4} = \\frac{5\\pi}{10} = \\frac{\\pi}{2}$。半径加倍，弧长也加倍，所以这个比值只由角决定。它就是角的**弧度**：直角是 $\\frac{\\pi}{2}$ 弧度。本课由弧长求弧度，并在角度和弧度之间换算。`,
  ),
  introFigures: [radianIntroFigure],
  knowledgePoints: [
    {
      id: "radian-measure-from-arc-length",
      figure: radianDrawings["radian-measure-from-arc-length"],
      title: t("Radian measure from arc length", "由弧长求弧度"),
      explanation: t(
        "In a circle of radius $r$, the length $s$ of an arc is proportional to $r$ for a fixed central angle, so the ratio $\\frac{s}{r}$ depends only on the angle. That ratio is the angle's measure in **radians**:\n\n$$\\theta = \\frac{s}{r}.$$\n\nAn angle of $1$ radian cuts off an arc exactly as long as the radius. If an arc of length $12$ cm lies on a circle of radius $5$ cm, its central angle measures $\\frac{12}{5} = 2.4$ radians: the arc is $2.4$ radii long. Radians are a ratio of two lengths, so they carry no unit of length.\n\n> **Watch out.** Divide the arc by the radius, not the radius by the arc, and do not multiply them. Divide by the radius, not the diameter.",
        "在半径为 $r$ 的圆中，圆心角固定时，弧长 $s$ 与 $r$ 成正比，所以比值 $\\frac{s}{r}$ 只由角决定。这个比值就是角的**弧度**：\n\n$$\\theta = \\frac{s}{r}.$$\n\n$1$ 弧度的角所对的弧长恰好等于半径。若半径为 $5$ 厘米的圆上一段弧长 $12$ 厘米，它所对的圆心角是 $\\frac{12}{5} = 2.4$ 弧度：弧长是半径的 $2.4$ 倍。弧度是两个长度之比，所以没有长度单位。\n\n> **注意。** 用弧长除以半径，不要用半径除以弧长，也不要把两者相乘。要除以半径，不是直径。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 12);
        const s = rng.int(Math.ceil(0.4 * r), Math.floor(2.6 * r));
        const theta = q(s, r);
        const d = (s / r) * (180 / Math.PI);
        const start = rng.int(0, 359);
        const compare =
          s === r
            ? t("the arc is exactly as long as the radius, so the angle is exactly $1$ radian", "弧长恰好等于半径，所以角恰好是 $1$ 弧度")
            : s > r
              ? t(
                  `the arc, $${tex(s, u)}$, is longer than the radius, $${tex(r, u)}$, so the angle is more than $1$ radian`,
                  `弧长 $${tex(s, u)}$ 比半径 $${tex(r, u)}$ 长，所以角大于 $1$ 弧度`,
                )
              : t(
                  `the arc, $${tex(s, u)}$, is shorter than the radius, $${tex(r, u)}$, so the angle is less than $1$ radian`,
                  `弧长 $${tex(s, u)}$ 比半径 $${tex(r, u)}$ 短，所以角小于 $1$ 弧度`,
                );
        return {
          ...numberProblem({
            prompt: t(
              `The arc $AB$ has length $${tex(s, u)}$ and the radius is $${tex(r, u)}$. Find the measure of $\\angle AOB$ in radians.`,
              `弧 $AB$ 的长为 $${tex(s, u)}$，半径为 $${tex(r, u)}$。求 $\\angle AOB$ 的弧度数。`,
            ),
            answer: theta,
            wrong: [q(2 * s, r)],
            mistakes: [
              why(
                q(r, s),
                "That is the radius over the arc. The angle in radians is the arc length over the radius.",
                "这是半径除以弧长。弧度数是弧长除以半径。",
              ),
              why(
                s * r,
                "You multiplied. The angle in radians is the arc length divided by the radius.",
                "你做了乘法。弧度数是弧长除以半径。",
              ),
              why(q(s, 2 * r), "You divided by the diameter. Divide by the radius.", "你除以了直径。应该除以半径。"),
            ],
            solution: t(
              `${stepLabel(1, "recall what a radian measures", "回顾弧度的含义").en} The measure in radians tells how many radii long the arc is, so it is the arc length divided by the radius, $\\theta = \\frac{s}{r}$. The units of length cancel.\n\n${stepLabel(2, "divide", "相除").en}${steps(`\\theta = \\frac{s}{r} = \\frac{${s}}{${r}} = ${theta.toLatex()}`)}**Check.** Multiplying back, $r\\theta = ${r} \\cdot ${theta.toLatex()} = ${s}$, the arc length. And ${compare.en}, as in the figure.\n\n{{figure 0}}`,
              `${stepLabel(1, "recall what a radian measures", "回顾弧度的含义")["zh-CN"]}弧度数表示弧长是半径的多少倍，所以它等于弧长除以半径，$\\theta = \\frac{s}{r}$，长度单位约掉了。\n\n${stepLabel(2, "divide", "相除")["zh-CN"]}${steps(`\\theta = \\frac{s}{r} = \\frac{${s}}{${r}} = ${theta.toLatex()}`)}**检验。** 乘回去，$r\\theta = ${r} \\cdot ${theta.toLatex()} = ${s}$，正是弧长。而且${compare["zh-CN"]}，与图一致。\n\n{{figure 0}}`,
            ),
          }),
          figure: sector(
            start,
            d,
            "θ",
            len(r, u),
            len(s, u),
            `Sector AOB of a circle with radius ${r} ${u}; arc AB has length ${s} ${u}.`,
            `半径为 ${r} ${u} 的扇形 AOB；弧 AB 的长为 ${s} ${u}。`,
          ),
          solutionFigures: [
            sector(
              start,
              d,
              `${theta.toString()} rad`,
              len(r, u),
              len(s, u),
              `Sector AOB with radius ${r} ${u} and arc ${s} ${u}; the central angle is ${theta.toString()} radians.`,
              `半径为 ${r} ${u}、弧长为 ${s} ${u} 的扇形 AOB；圆心角为 ${theta.toString()} 弧度。`,
            ),
          ],
        };
      },
    },
    {
      id: "degrees-to-radians",
      title: t("Degrees to radians", "角度化为弧度"),
      explanation: t(
        "A full turn cuts off the whole circumference $2\\pi r$, so it measures $\\frac{2\\pi r}{r} = 2\\pi$ radians. Hence\n\n$$360^\\circ = 2\\pi \\text{ radians}, \\qquad 180^\\circ = \\pi \\text{ radians}.$$\n\nSo $1^\\circ$ is $\\frac{\\pi}{180}$ radians. To convert degrees to radians, multiply by $\\frac{\\pi}{180}$ and simplify the fraction:\n\n$$150^\\circ = 150 \\cdot \\frac{\\pi}{180} = \\frac{150\\pi}{180} = \\frac{5\\pi}{6}.$$\n\n> **Watch out.** Multiply by $\\frac{\\pi}{180}$, not by $\\frac{180}{\\pi}$, which goes the other way. Use $180$, which matches $\\pi$; $360$ matches $2\\pi$, and $90$ matches neither. Keep the $\\pi$ in the answer: $\\frac{5}{6}$ alone is a different angle.",
        "整整一周所对的弧是整个圆周 $2\\pi r$，所以它是 $\\frac{2\\pi r}{r} = 2\\pi$ 弧度。因此\n\n$$360^\\circ = 2\\pi \\text{ 弧度}, \\qquad 180^\\circ = \\pi \\text{ 弧度}.$$\n\n所以 $1^\\circ$ 是 $\\frac{\\pi}{180}$ 弧度。把角度化为弧度，乘以 $\\frac{\\pi}{180}$ 并约分：\n\n$$150^\\circ = 150 \\cdot \\frac{\\pi}{180} = \\frac{150\\pi}{180} = \\frac{5\\pi}{6}.$$\n\n> **注意。** 乘以 $\\frac{\\pi}{180}$，不是 $\\frac{180}{\\pi}$，那是反方向的换算。用与 $\\pi$ 对应的 $180$；$360$ 对应 $2\\pi$，$90$ 两者都不对应。答案里要保留 $\\pi$：只写 $\\frac{5}{6}$ 是另一个角。",
      ),
      generate(rng) {
        const d = rng.pick(degreeAngles);
        const x = radians(d);
        const g = gcd(d, 180);
        const raw = `\\frac{${d}\\pi}{180}`;
        return piProblem({
          prompt: t(`Convert $${d}^\\circ$ to radians.${PI_EN}`, `把 $${d}^\\circ$ 化为弧度。${PI_ZH}`),
          answer: piTex(x),
          wrong: [piTex(q(180, d)), piTex(q(d, 360)), piTex(q(d, 90)), x.toLatex()],
          solution: t(
            `${stepLabel(1, "find the size of one degree", "求 1 度是多少弧度").en} Half a turn is $180^\\circ$ and also $\\pi$ radians, so $1^\\circ = \\frac{\\pi}{180}$ radians.\n\n${stepLabel(2, "multiply and simplify", "相乘并约分").en} Multiply by $\\frac{\\pi}{180}$ and divide the top and the bottom by their greatest common factor, $${g}$:${steps(`${d}^\\circ = ${d} \\cdot \\frac{\\pi}{180} = ${raw} = ${piTex(x)}`)}**Check.** Convert back by replacing $\\pi$ with $180^\\circ$:${steps(`${piTex(x)} \\to ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}${sizeNote(d, x).en}`,
            `${stepLabel(1, "find the size of one degree", "求 1 度是多少弧度")["zh-CN"]}半圈是 $180^\\circ$，也是 $\\pi$ 弧度，所以 $1^\\circ = \\frac{\\pi}{180}$ 弧度。\n\n${stepLabel(2, "multiply and simplify", "相乘并约分")["zh-CN"]}乘以 $\\frac{\\pi}{180}$，分子分母同时除以最大公因数 $${g}$：${steps(`${d}^\\circ = ${d} \\cdot \\frac{\\pi}{180} = ${raw} = ${piTex(x)}`)}**检验。** 把 $\\pi$ 换成 $180^\\circ$ 换算回去：${steps(`${piTex(x)} \\to ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}${sizeNote(d, x)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "radians-to-degrees",
      title: t("Radians to degrees", "弧度化为角度"),
      explanation: t(
        "Since $\\pi$ radians is $180^\\circ$, multiply a radian measure by $\\frac{180^\\circ}{\\pi}$ to get degrees. When the measure is a multiple of $\\pi$, the $\\pi$ cancels, so this is the same as replacing $\\pi$ by $180^\\circ$:\n\n$$\\frac{3\\pi}{4} = \\frac{3 \\cdot 180^\\circ}{4} = 135^\\circ.$$\n\n> **Watch out.** $\\pi$ radians is a half turn, $180^\\circ$, not a full turn of $360^\\circ$: using $360^\\circ$ doubles the answer. Multiply the coefficient by $180^\\circ$; do not divide $180^\\circ$ by it, and do not halve the result.",
        "因为 $\\pi$ 弧度等于 $180^\\circ$，把弧度数乘以 $\\frac{180^\\circ}{\\pi}$ 就得到角度。弧度是 $\\pi$ 的倍数时，$\\pi$ 约掉了，相当于把 $\\pi$ 换成 $180^\\circ$：\n\n$$\\frac{3\\pi}{4} = \\frac{3 \\cdot 180^\\circ}{4} = 135^\\circ.$$\n\n> **注意。** $\\pi$ 弧度是半圈 $180^\\circ$，不是一整圈 $360^\\circ$：用 $360^\\circ$ 会使答案加倍。要用系数乘 $180^\\circ$，不要用 $180^\\circ$ 除以系数，也不要把结果减半。",
      ),
      generate(rng) {
        const d = rng.pick(degreeAngles);
        const x = radians(d);
        return numberProblem({
          prompt: t(`Convert $${piTex(x)}$ radians to degrees.`, `把 $${piTex(x)}$ 弧度化为角度。`),
          answer: d,
          unit: "°",
          wrong: [2 * d, q(d, 2)],
          mistakes: [
            why(
              x.mul(q(360)),
              "You used $360^\\circ$ for $\\pi$ radians. A half turn is $\\pi$ radians, which is $180^\\circ$.",
              "你把 $\\pi$ 弧度当成了 $360^\\circ$。半圈是 $\\pi$ 弧度，也就是 $180^\\circ$。",
            ),
            why(q(180).div(x), "You divided by the coefficient. Multiply it by $180^\\circ$.", "你除以了系数。应该用系数乘 $180^\\circ$。"),
          ],
          solution: t(
            `${stepLabel(1, "write the conversion", "写出换算关系").en} Half a turn is $\\pi$ radians and also $180^\\circ$, so multiplying by $\\frac{180^\\circ}{\\pi}$ converts radians to degrees. The $\\pi$ cancels, which is the same as replacing $\\pi$ by $180^\\circ$.\n\n${stepLabel(2, "multiply", "相乘").en}${steps(`${piTex(x)} \\cdot \\frac{180^\\circ}{\\pi} = ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}**Check.** Convert back by multiplying by $\\frac{\\pi}{180}$:${steps(`${d} \\cdot \\frac{\\pi}{180} = ${piTex(x)}`)}${sizeNote(d, x).en}`,
            `${stepLabel(1, "write the conversion", "写出换算关系")["zh-CN"]}半圈是 $\\pi$ 弧度，也是 $180^\\circ$，所以乘以 $\\frac{180^\\circ}{\\pi}$ 就把弧度化为角度。$\\pi$ 约掉了，相当于把 $\\pi$ 换成 $180^\\circ$。\n\n${stepLabel(2, "multiply", "相乘")["zh-CN"]}${steps(`${piTex(x)} \\cdot \\frac{180^\\circ}{\\pi} = ${x.toLatex()} \\cdot 180^\\circ = ${d}^\\circ`)}**检验。** 乘以 $\\frac{\\pi}{180}$ 换算回去：${steps(`${d} \\cdot \\frac{\\pi}{180} = ${piTex(x)}`)}${sizeNote(d, x)["zh-CN"]}`,
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

/** calculatingArcLengthUsingRadians finds arc lengths, radii and angles from s = rθ. */
export const calculatingArcLengthUsingRadians: TopicDef = {
  id: "calculating-arc-length-using-radians",
  title: t("Calculating Arc Length Using Radians", "用弧度计算弧长"),
  summary: t(
    "Find arc length as radius times the angle in radians, and find the radius or the angle from the arc length.",
    "用半径乘以弧度求弧长，并由弧长求半径或圆心角。",
  ),
  prerequisites: ["introduction-to-radians"],
  encompasses: [{ topic: "introduction-to-radians", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  intro: t(
    `An angle in radians is the arc length divided by the radius, $\\theta = \\frac{s}{r}$: it says how many radii long the arc is. Turned around, that gives the arc length directly, with no fraction of $360^\\circ$ to work out, which is the main reason radians are used.

A central angle of $2$ radians in a circle of radius $3$ cm cuts off an arc $2$ radii long, so the arc is $2 \\cdot 3 = 6$ cm.

{{figure 0}}

In degrees the same angle is $2 \\cdot \\frac{180^\\circ}{\\pi} \\approx 114.6^\\circ$, and $\\frac{114.6}{360} \\cdot 2\\pi \\cdot 3 \\approx 6.0$ cm: the same arc, found the long way. This topic uses $s = r\\theta$ to find arc lengths, and solves it for the radius or the angle.`,
    `用弧度表示的角等于弧长除以半径，$\\theta = \\frac{s}{r}$：它表示弧长是半径的多少倍。反过来，就能直接求出弧长，不必再算 $360^\\circ$ 的几分之几，这正是使用弧度的主要原因。

在半径为 $3$ 厘米的圆中，$2$ 弧度的圆心角所对的弧长是半径的 $2$ 倍，所以弧长是 $2 \\cdot 3 = 6$ 厘米。

{{figure 0}}

用角度表示，这个角是 $2 \\cdot \\frac{180^\\circ}{\\pi} \\approx 114.6^\\circ$，而 $\\frac{114.6}{360} \\cdot 2\\pi \\cdot 3 \\approx 6.0$ 厘米：同一段弧，只是绕了远路。本课用 $s = r\\theta$ 求弧长，并由它求半径或圆心角。`,
  ),
  introFigures: [
    sector(
      30,
      (2 * 180) / Math.PI,
      "2 rad",
      "3 cm",
      "6 cm",
      "Sector AOB with radius 3 cm and a central angle of 2 radians; arc AB is 6 cm long.",
      "半径为 3 cm、圆心角为 2 弧度的扇形 AOB；弧 AB 长 6 cm。",
    ),
  ],
  knowledgePoints: [
    {
      id: "arc-length-with-radians",
      figure: radianDrawings["arc-length-with-radians"],
      title: t("Arc length with an angle in terms of π", "圆心角含 π 时的弧长"),
      explanation: t(
        "Multiplying $\\theta = \\frac{s}{r}$ by $r$ gives the arc length when the central angle $\\theta$ is in radians:\n\n$$s = r\\theta.$$\n\nIn a circle of radius $9$ cm, an arc with central angle $\\frac{2\\pi}{3}$ has length $9 \\cdot \\frac{2\\pi}{3} = 6\\pi$ cm. This agrees with the degree formula, since $\\frac{2\\pi}{3}$ is $120^\\circ$ and $\\frac{120}{360} \\cdot 18\\pi = 6\\pi$, but needs no fraction of $360$.\n\n> **Watch out.** Multiply by the radius, not the diameter, and do not divide the angle by the radius. Do not use the area formula $\\frac{1}{2}r^2\\theta$ by mistake, and do not halve the product: $s = r\\theta$ has no $\\frac{1}{2}$.",
        "把 $\\theta = \\frac{s}{r}$ 两边乘以 $r$，就得到圆心角 $\\theta$ 用弧度表示时的弧长：\n\n$$s = r\\theta.$$\n\n在半径为 $9$ 厘米的圆中，圆心角为 $\\frac{2\\pi}{3}$ 的弧长是 $9 \\cdot \\frac{2\\pi}{3} = 6\\pi$ 厘米。这与角度公式一致（$\\frac{2\\pi}{3}$ 即 $120^\\circ$，$\\frac{120}{360} \\cdot 18\\pi = 6\\pi$），但不必再取 $360$ 的几分之几。\n\n> **注意。** 乘的是半径，不是直径，也不要用角除以半径。不要误用面积公式 $\\frac{1}{2}r^2\\theta$，也不要把乘积减半：$s = r\\theta$ 中没有 $\\frac{1}{2}$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        const start = rng.int(0, 359);
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
              `${stepLabel(1, "choose the formula", "选公式").en} The angle is in radians, and an angle in radians is the arc over the radius, $\\theta = \\frac{s}{r}$. Multiplying by $r$ gives $s = r\\theta$.\n\n${stepLabel(2, "multiply", "相乘").en}${steps(`s = r\\theta = ${r} \\cdot ${piTex(x)} = ${tex(piTex(L), u)}`)}**Check.** In degrees, $${piTex(x)} = ${d}^\\circ$, and the arc is $\\frac{${d}}{360}$ of the circumference $2\\pi \\cdot ${r}$:${steps(`\\frac{${d}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}`)}The two routes agree.\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the formula", "选公式")["zh-CN"]}圆心角用弧度表示，而弧度等于弧长除以半径，$\\theta = \\frac{s}{r}$。两边乘以 $r$ 得 $s = r\\theta$。\n\n${stepLabel(2, "multiply", "相乘")["zh-CN"]}${steps(`s = r\\theta = ${r} \\cdot ${piTex(x)} = ${tex(piTex(L), u)}`)}**检验。** 用角度表示，$${piTex(x)} = ${d}^\\circ$，弧长占圆周 $2\\pi \\cdot ${r}$ 的 $\\frac{${d}}{360}$：${steps(`\\frac{${d}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}`)}两种算法结果一致。\n\n{{figure 0}}`,
            ),
          }),
          figure: sector(
            start,
            d,
            piPlain(x),
            len(r, u),
            undefined,
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${piPlain(x)} radians.`,
            `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 弧度的扇形 AOB。`,
          ),
          solutionFigures: [
            sector(
              start,
              d,
              piPlain(x),
              len(r, u),
              len(piPlain(L), u),
              `Sector AOB with radius ${r} ${u} and central angle ${piPlain(x)}; arc AB is ${piPlain(L)} ${u} long.`,
              `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 的扇形 AOB；弧 AB 长 ${piPlain(L)} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "arc-length-with-decimal-radians",
      figure: radianDrawings["arc-length-with-decimal-radians"],
      title: t("Arc length with an angle not in terms of π", "圆心角不含 π 时的弧长"),
      explanation: t(
        "A radian measure need not involve $\\pi$. The formula $s = r\\theta$ works the same way: in a circle of radius $8$ m, a central angle of $1.5$ radians cuts off an arc $1.5$ radii long, so its length is $8 \\cdot 1.5 = 12$ m.\n\n> **Watch out.** Multiply the radius by the angle; do not divide the radius by the angle. Use the radius, not the diameter, do not halve the product, and do not use the area formula $\\frac{1}{2}r^2\\theta$.",
        "弧度数不一定含有 $\\pi$。公式 $s = r\\theta$ 照样适用：在半径为 $8$ 米的圆中，$1.5$ 弧度的圆心角所对的弧长是半径的 $1.5$ 倍，即 $8 \\cdot 1.5 = 12$ 米。\n\n> **注意。** 用半径乘以角，不要用半径除以角。用半径，不是直径；不要把乘积减半，也不要用面积公式 $\\frac{1}{2}r^2\\theta$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const x = tenths(rng);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        const deg = degreesOf(x);
        return {
          ...numberProblem({
            prompt: t(
              `A central angle of $${dec(x)}$ radians lies in a circle of radius $${tex(r, u)}$. Find the length of the arc it cuts off.`,
              `半径为 $${tex(r, u)}$ 的圆中有一个 $${dec(x)}$ 弧度的圆心角。求它所对的弧长。`,
            ),
            answer: L,
            unit: u,
            wrong: [q(r).div(x), L.mul(q(2)), L.div(q(2)), x.mul(q(r * r, 2))],
            solution: t(
              `${stepLabel(1, "choose the formula", "选公式").en} An angle of $${dec(x)}$ radians cuts off an arc $${dec(x)}$ radii long, so $s = r\\theta$.\n\n${stepLabel(2, "multiply", "相乘").en}${steps(`s = r\\theta = ${r} \\cdot ${dec(x)} = ${tex(dec(L), u)}`)}**Check.** Dividing the arc by the radius gives back the angle we started with: $\\frac{s}{r} = \\frac{${dec(L)}}{${r}} = ${dec(x)}$. The arc is ${x.cmp(q(1)) > 0 ? "longer than" : x.eq(q(1)) ? "as long as" : "shorter than"} the radius, as an angle ${x.cmp(q(1)) > 0 ? "above" : x.eq(q(1)) ? "of exactly" : "below"} $1$ radian should give.\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the formula", "选公式")["zh-CN"]}$${dec(x)}$ 弧度的圆心角所对的弧长是半径的 $${dec(x)}$ 倍，所以 $s = r\\theta$。\n\n${stepLabel(2, "multiply", "相乘")["zh-CN"]}${steps(`s = r\\theta = ${r} \\cdot ${dec(x)} = ${tex(dec(L), u)}`)}**检验。** 除回去：$\\frac{s}{r} = \\frac{${dec(L)}}{${r}} = ${dec(x)}$，正是原来的角。弧长${x.cmp(q(1)) > 0 ? "比半径长" : x.eq(q(1)) ? "等于半径" : "比半径短"}，与${x.cmp(q(1)) > 0 ? "大于" : x.eq(q(1)) ? "恰好等于" : "小于"} $1$ 弧度的角相符。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [
            sector(
              20,
              deg,
              `${dec(x)}`,
              len(r, u),
              len(dec(L), u),
              `Sector AOB with radius ${r} ${u} and a central angle of ${dec(x)} radians; arc AB is ${dec(L)} ${u} long.`,
              `半径为 ${r} ${u}、圆心角为 ${dec(x)} 弧度的扇形 AOB；弧 AB 长 ${dec(L)} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-or-angle-from-arc-length-in-radians",
      figure: radianDrawings["radius-or-angle-from-arc-length-in-radians"],
      title: t("The radius or the angle from the arc length", "由弧长求半径或圆心角"),
      explanation: t(
        "The formula $s = r\\theta$ links three quantities; knowing two gives the third.\n\nIf an arc of $\\frac{3\\pi}{4}$ radians has length $6\\pi$ cm, then $r \\cdot \\frac{3\\pi}{4} = 6\\pi$, so $r = 6\\pi \\cdot \\frac{4}{3\\pi} = 8$ cm. If an arc of length $10\\pi$ m lies on a circle of radius $12$ m, its central angle is $\\theta = \\frac{s}{r} = \\frac{10\\pi}{12} = \\frac{5\\pi}{6}$ radians.\n\n> **Watch out.** To find $r$, divide the arc by the angle; do not multiply them, and do not double or halve the result. To find $\\theta$, divide the arc by the radius, not the other way round, and give the angle in radians, not in degrees.",
        "公式 $s = r\\theta$ 联系着三个量，知道其中两个就能求出第三个。\n\n若 $\\frac{3\\pi}{4}$ 弧度的弧长为 $6\\pi$ 厘米，则 $r \\cdot \\frac{3\\pi}{4} = 6\\pi$，所以 $r = 6\\pi \\cdot \\frac{4}{3\\pi} = 8$ 厘米。若半径为 $12$ 米的圆上一段弧长 $10\\pi$ 米，它所对的圆心角是 $\\theta = \\frac{s}{r} = \\frac{10\\pi}{12} = \\frac{5\\pi}{6}$ 弧度。\n\n> **注意。** 求 $r$ 时用弧长除以角，不要相乘，也不要把结果加倍或减半。求 $\\theta$ 时用弧长除以半径，不要反过来；答案用弧度表示，不是角度。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 20);
        const L = x.mul(q(r));
        const pic = sector(
          20,
          d,
          piPlain(x),
          len(r, u),
          len(piPlain(L), u),
          `Sector AOB with radius ${r} ${u} and central angle ${piPlain(x)}; arc AB is ${piPlain(L)} ${u} long.`,
          `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 的扇形 AOB；弧 AB 长 ${piPlain(L)} ${u}。`,
        );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `An arc with a central angle of $${piTex(x)}$ radians has a length of $${tex(piTex(L), u)}$. Find the radius of the circle.`,
                `圆心角为 $${piTex(x)}$ 弧度的弧长为 $${tex(piTex(L), u)}$。求圆的半径。`,
              ),
              answer: r,
              unit: u,
              wrong: [2 * r, q(r, 2), L.mul(x), q(r * r)],
              solution: t(
                `${stepLabel(1, "write the equation", "列方程").en} The arc length is the radius times the angle in radians, $s = r\\theta$. Put in what is known:${steps(`r \\cdot ${piTex(x)} = ${piTex(L)}`)}${stepLabel(2, "divide by the angle", "两边除以角").en}${steps(`r = ${piTex(L)} \\div ${piTex(x)} = ${tex(r, u)}`)}**Check.** Substituting $r = ${r}$ gives back the given arc length: $${r} \\cdot ${piTex(x)} = ${piTex(L)}$.\n\n{{figure 0}}`,
                `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}弧长等于半径乘以弧度，$s = r\\theta$。代入已知量：${steps(`r \\cdot ${piTex(x)} = ${piTex(L)}`)}${stepLabel(2, "divide by the angle", "两边除以角")["zh-CN"]}${steps(`r = ${piTex(L)} \\div ${piTex(x)} = ${tex(r, u)}`)}**检验。** 代入 $r = ${r}$：$${r} \\cdot ${piTex(x)} = ${piTex(L)}$，正是已知弧长。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [pic],
          };
        }
        return {
          ...piProblem({
            prompt: t(
              `In a circle with radius $${tex(r, u)}$, an arc has a length of $${tex(piTex(L), u)}$. Find its central angle in radians.${PI_EN}`,
              `在半径为 $${tex(r, u)}$ 的圆中，一段弧长为 $${tex(piTex(L), u)}$。求它所对的圆心角的弧度数。${PI_ZH}`,
            ),
            answer: piTex(x),
            wrong: [piTex(x.div(q(2))), piTex(L.mul(q(r))), `${d}`, piTex(x.mul(q(2)))],
            solution: t(
              `${stepLabel(1, "use the definition", "用定义").en} An angle in radians is the arc length divided by the radius, $\\theta = \\frac{s}{r}$.\n\n${stepLabel(2, "divide and simplify", "相除并约分").en}${steps(`\\theta = \\frac{s}{r} = \\frac{${piTex(L)}}{${r}} = ${piTex(x)}`)}**Check.** In degrees, $${piTex(x)} = ${d}^\\circ$, and an arc of $${d}^\\circ$ is $\\frac{${d}}{360}$ of the circumference:${steps(`\\frac{${d}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}`)}That is the given arc length.\n\n{{figure 0}}`,
              `${stepLabel(1, "use the definition", "用定义")["zh-CN"]}弧度数等于弧长除以半径，$\\theta = \\frac{s}{r}$。\n\n${stepLabel(2, "divide and simplify", "相除并约分")["zh-CN"]}${steps(`\\theta = \\frac{s}{r} = \\frac{${piTex(L)}}{${r}} = ${piTex(x)}`)}**检验。** 用角度表示，$${piTex(x)} = ${d}^\\circ$，而 $${d}^\\circ$ 的弧占圆周的 $\\frac{${d}}{360}$：${steps(`\\frac{${d}}{360} \\cdot 2\\pi \\cdot ${r} = ${piTex(L)}`)}正是已知弧长。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [pic],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Sector area with radians
// ---------------------------------------------------------------------------

/** calculatingAreasOfSectorsUsingRadians finds sector areas, radii and angles from A = ½r²θ. */
export const calculatingAreasOfSectorsUsingRadians: TopicDef = {
  id: "calculating-areas-of-sectors-using-radians",
  title: t("Calculating Areas of Sectors Using Radians", "用弧度计算扇形面积"),
  summary: t(
    "Find the area of a sector as half the radius squared times the angle in radians, or half the radius times the arc length.",
    "用半径平方的一半乘以弧度，或半径乘以弧长的一半，求扇形面积。",
  ),
  prerequisites: ["calculating-arc-length-using-radians", "calculating-areas-of-circular-sectors"],
  encompasses: [{ topic: "calculating-areas-of-circular-sectors", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSG.C.B.5"],
  intro: t(
    `A sector with central angle $d^\\circ$ is the fraction $\\frac{d}{360}$ of the disk, so its area is $\\frac{d}{360} \\cdot \\pi r^2$. With the angle in radians, the full turn is $2\\pi$ instead of $360^\\circ$, and the formula becomes simpler.

Take a circle of radius $4$ cm and a central angle of $\\frac{\\pi}{2}$ radians, a right angle. The angle is $\\frac{\\pi/2}{2\\pi} = \\frac{1}{4}$ of a full turn, so the sector is a quarter of the disk: $\\frac{1}{4} \\cdot \\pi \\cdot 4^2 = 4\\pi\\text{ cm}^2$.

{{figure 0}}

In general the sector is $\\frac{\\theta}{2\\pi}$ of the disk, and $\\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta$. Here $\\frac{1}{2} \\cdot 16 \\cdot \\frac{\\pi}{2} = 4\\pi$, the same. This topic uses $A = \\frac{1}{2} r^2 \\theta$, and its partner $A = \\frac{1}{2} r s$, to find areas, radii and angles.`,
    `圆心角为 $d^\\circ$ 的扇形占整个圆的 $\\frac{d}{360}$，所以面积是 $\\frac{d}{360} \\cdot \\pi r^2$。圆心角用弧度表示时，一整圈是 $2\\pi$ 而不是 $360^\\circ$，公式会更简单。

取半径为 $4$ 厘米的圆和 $\\frac{\\pi}{2}$ 弧度的圆心角（直角）。这个角是一整圈的 $\\frac{\\pi/2}{2\\pi} = \\frac{1}{4}$，所以扇形是整个圆的四分之一：$\\frac{1}{4} \\cdot \\pi \\cdot 4^2 = 4\\pi\\text{ cm}^2$。

{{figure 0}}

一般地，扇形占整个圆的 $\\frac{\\theta}{2\\pi}$，而 $\\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta$。这里 $\\frac{1}{2} \\cdot 16 \\cdot \\frac{\\pi}{2} = 4\\pi$，结果相同。本课用 $A = \\frac{1}{2} r^2 \\theta$ 及与之配套的 $A = \\frac{1}{2} r s$ 求面积、半径和圆心角。`,
  ),
  introFigures: [
    sector(
      0,
      90,
      "π/2",
      "4 cm",
      undefined,
      "A circle of radius 4 cm with the quarter sector AOB of central angle π/2 shaded.",
      "半径为 4 cm 的圆，圆心角为 π/2 的四分之一扇形 AOB 被涂色。",
    ),
  ],
  knowledgePoints: [
    {
      id: "sector-area-with-radians",
      figure: radianDrawings["sector-area-with-radians"],
      title: t("Sector area with an angle in terms of π", "圆心角含 π 时的扇形面积"),
      explanation: t(
        "A full turn of $2\\pi$ radians gives the whole disk, of area $\\pi r^2$. A sector with central angle $\\theta$ radians is the fraction $\\frac{\\theta}{2\\pi}$ of it:\n\n$$A = \\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta.$$\n\nA sector of $\\frac{\\pi}{3}$ in a circle of radius $6$ cm has area $\\frac{1}{2} \\cdot 36 \\cdot \\frac{\\pi}{3} = 6\\pi\\text{ cm}^2$.\n\n> **Watch out.** Keep the $\\frac{1}{2}$: $r^2\\theta$ alone is twice the area, and halving twice gives half of it. Square the radius: $r\\theta$ is the arc length, and $\\frac{1}{2}r\\theta$ is neither the arc nor the area.",
        "整整一周 $2\\pi$ 弧度对应整个圆，面积为 $\\pi r^2$。圆心角为 $\\theta$ 弧度的扇形占其中的 $\\frac{\\theta}{2\\pi}$：\n\n$$A = \\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta.$$\n\n在半径为 $6$ 厘米的圆中，$\\frac{\\pi}{3}$ 的扇形面积是 $\\frac{1}{2} \\cdot 36 \\cdot \\frac{\\pi}{3} = 6\\pi\\text{ cm}^2$。\n\n> **注意。** 不要丢掉 $\\frac{1}{2}$：只算 $r^2\\theta$ 得到的是面积的两倍，而除以 $2$ 两次又只得一半。半径要平方：$r\\theta$ 是弧长，$\\frac{1}{2}r\\theta$ 既不是弧长也不是面积。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 15);
        const A = x.mul(q(r * r, 2));
        const start = rng.int(0, 359);
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
              `${stepLabel(1, "choose the formula", "选公式").en} With $\\theta$ in radians, the sector is $\\frac{\\theta}{2\\pi}$ of the disk, so its area is $\\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta$.\n\n${stepLabel(2, "substitute", "代入").en}${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${piTex(x)} = ${tex(piTex(A), u, 2)}`)}**Check.** In degrees, $${piTex(x)} = ${d}^\\circ$, so the sector is $\\frac{${d}}{360}$ of the disk of area $\\pi \\cdot ${r}^2$:${steps(`\\frac{${d}}{360} \\cdot \\pi \\cdot ${r * r} = ${piTex(A)}`)}The two routes agree.\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the formula", "选公式")["zh-CN"]}扇形占整个圆的 $\\frac{\\theta}{2\\pi}$，所以面积是 $\\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac{1}{2} r^2 \\theta$，其中 $\\theta$ 用弧度表示。\n\n${stepLabel(2, "substitute", "代入")["zh-CN"]}${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${piTex(x)} = ${tex(piTex(A), u, 2)}`)}**检验。** 用角度表示，$${piTex(x)} = ${d}^\\circ$，所以扇形占面积为 $\\pi \\cdot ${r}^2$ 的圆的 $\\frac{${d}}{360}$：${steps(`\\frac{${d}}{360} \\cdot \\pi \\cdot ${r * r} = ${piTex(A)}`)}两种算法结果一致。\n\n{{figure 0}}`,
            ),
          }),
          figure: sector(
            start,
            d,
            piPlain(x),
            len(r, u),
            undefined,
            `Sector AOB of a circle with radius ${r} ${u} and central angle ${piPlain(x)} radians.`,
            `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 弧度的扇形 AOB。`,
          ),
          solutionFigures: [
            sector(
              start,
              d,
              piPlain(x),
              len(r, u),
              undefined,
              `Sector AOB with radius ${r} ${u} and central angle ${piPlain(x)}, shaded: ${d}/360 of the disk, with area ${piPlain(A)} ${u}².`,
              `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 的扇形 AOB（涂色）：占整个圆的 ${d}/360，面积为 ${piPlain(A)} ${u}²。`,
            ),
          ],
        };
      },
    },
    {
      id: "sector-area-from-decimal-angle-or-arc-length",
      figure: radianDrawings["sector-area-from-decimal-angle-or-arc-length"],
      title: t("Sector area from a decimal angle or the arc length", "由小数弧度或弧长求扇形面积"),
      explanation: t(
        "The formula $A = \\frac{1}{2} r^2 \\theta$ works for any angle in radians: a sector of $0.8$ radians in a circle of radius $5$ m has area $\\frac{1}{2} \\cdot 25 \\cdot 0.8 = 10\\text{ m}^2$.\n\nSince the arc length is $s = r\\theta$, the formula can also be written $A = \\frac{1}{2} r \\cdot r\\theta = \\frac{1}{2} r s$. A sector with radius $6$ cm and arc length $7$ cm has area $\\frac{1}{2} \\cdot 6 \\cdot 7 = 21\\text{ cm}^2$, with no angle needed.\n\n> **Watch out.** Both formulas have a $\\frac{1}{2}$; without it the answer doubles. In $\\frac{1}{2} r^2\\theta$ the radius is squared, and $r\\theta$ alone is the arc length, not an area. In $\\frac{1}{2} r s$ multiply by the radius once, not by $r^2$, and do not divide the arc by the radius: that gives the angle.",
        "公式 $A = \\frac{1}{2} r^2 \\theta$ 对任何弧度都适用：在半径为 $5$ 米的圆中，$0.8$ 弧度的扇形面积是 $\\frac{1}{2} \\cdot 25 \\cdot 0.8 = 10\\text{ m}^2$。\n\n因为弧长 $s = r\\theta$，公式也可以写成 $A = \\frac{1}{2} r \\cdot r\\theta = \\frac{1}{2} r s$。半径为 $6$ 厘米、弧长为 $7$ 厘米的扇形面积是 $\\frac{1}{2} \\cdot 6 \\cdot 7 = 21\\text{ cm}^2$，不必知道圆心角。\n\n> **注意。** 两个公式都有 $\\frac{1}{2}$；丢掉它答案会加倍。$\\frac{1}{2} r^2\\theta$ 中半径要平方，单独的 $r\\theta$ 是弧长，不是面积。$\\frac{1}{2} r s$ 中半径只乘一次，不是 $r^2$；也不要用弧长除以半径，那得到的是角。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(2, 15);
        if (rng.bool()) {
          const x = tenths(rng);
          const A = x.mul(q(r * r, 2));
          const s = x.mul(q(r));
          return {
            ...numberProblem({
              prompt: t(
                `A sector of a circle with radius $${tex(r, u)}$ has a central angle of $${dec(x)}$ radians. Find its area.`,
                `半径为 $${tex(r, u)}$ 的圆中有一个圆心角为 $${dec(x)}$ 弧度的扇形。求它的面积。`,
              ),
              answer: A,
              unit: `${u}^2`,
              wrong: [A.mul(q(2)), x.mul(q(r, 2)), x.mul(q(r))],
              solution: t(
                `${stepLabel(1, "choose the formula", "选公式").en} The angle is in radians, so the area is $A = \\frac{1}{2} r^2 \\theta$: the sector is $\\frac{\\theta}{2\\pi}$ of the disk $\\pi r^2$.\n\n${stepLabel(2, "substitute", "代入").en}${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${dec(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${dec(x)} = ${tex(dec(A), u, 2)}`)}**Check.** Go through the arc instead. The arc is $s = r\\theta = ${r} \\cdot ${dec(x)} = ${dec(s)}$, and $A = \\frac{1}{2} r s$:${steps(`\\frac{1}{2} \\cdot ${r} \\cdot ${dec(s)} = ${dec(A)}`)}The same area.\n\n{{figure 0}}`,
                `${stepLabel(1, "choose the formula", "选公式")["zh-CN"]}圆心角用弧度表示，所以面积 $A = \\frac{1}{2} r^2 \\theta$：扇形占整个圆 $\\pi r^2$ 的 $\\frac{\\theta}{2\\pi}$。\n\n${stepLabel(2, "substitute", "代入")["zh-CN"]}${steps(`A = \\frac{1}{2} \\cdot ${r}^2 \\cdot ${dec(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${dec(x)} = ${tex(dec(A), u, 2)}`)}**检验。** 改用弧长来算。弧长 $s = r\\theta = ${r} \\cdot ${dec(x)} = ${dec(s)}$，而 $A = \\frac{1}{2} r s$：${steps(`\\frac{1}{2} \\cdot ${r} \\cdot ${dec(s)} = ${dec(A)}`)}面积相同。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [
              sector(
                20,
                degreesOf(x),
                `${dec(x)}`,
                len(r, u),
                len(dec(s), u),
                `Sector AOB with radius ${r} ${u} and a central angle of ${dec(x)} radians; its arc is ${dec(s)} ${u} long.`,
                `半径为 ${r} ${u}、圆心角为 ${dec(x)} 弧度的扇形 AOB；弧长 ${dec(s)} ${u}。`,
              ),
            ],
          };
        }
        const s = rng.int(2, 3 * r);
        const A = q(r * s, 2);
        const theta = q(s, r);
        const start = rng.int(0, 359);
        const pic = (en: string, zh: string) => sector(start, (s / r) * (180 / Math.PI), "θ", len(r, u), len(s, u), en, zh);
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
              `${stepLabel(1, "choose the formula", "选公式").en} Since $r\\theta$ is the arc length $s$, the area formula becomes $\\frac{1}{2} r^2 \\theta = \\frac{1}{2} r \\cdot r\\theta = \\frac{1}{2} r s$. The angle is not needed.\n\n${stepLabel(2, "substitute", "代入").en}${steps(`A = \\frac{1}{2} \\cdot ${r} \\cdot ${s} = ${tex(A.toLatex(), u, 2)}`)}**Check.** Find the angle in radians first: $\\theta = \\frac{s}{r} = \\frac{${s}}{${r}}${theta.isInteger() || theta.d !== BigInt(r) ? ` = ${theta.toLatex()}` : ""}$. Then the other formula gives the same area:${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot \\frac{${s}}{${r}} = ${A.toLatex()}`)}{{figure 0}}`,
              `${stepLabel(1, "choose the formula", "选公式")["zh-CN"]}面积 $\\frac{1}{2} r^2 \\theta = \\frac{1}{2} r \\cdot r\\theta$，而 $r\\theta$ 就是弧长 $s$。所以 $A = \\frac{1}{2} r s$，不需要圆心角。\n\n${stepLabel(2, "substitute", "代入")["zh-CN"]}${steps(`A = \\frac{1}{2} \\cdot ${r} \\cdot ${s} = ${tex(A.toLatex(), u, 2)}`)}**检验。** 先求圆心角的弧度数：$\\theta = \\frac{s}{r} = \\frac{${s}}{${r}}${theta.isInteger() || theta.d !== BigInt(r) ? ` = ${theta.toLatex()}` : ""}$。再用另一个公式，面积相同：${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot \\frac{${s}}{${r}} = ${A.toLatex()}`)}{{figure 0}}`,
            ),
          }),
          figure: pic(`Sector AOB with radius ${r} ${u} and arc length ${s} ${u}.`, `半径为 ${r} ${u}、弧长为 ${s} ${u} 的扇形 AOB。`),
          solutionFigures: [
            pic(
              `Sector AOB with radius ${r} ${u} and arc length ${s} ${u}, shaded; its area is half of ${r} times ${s}.`,
              `半径为 ${r} ${u}、弧长为 ${s} ${u} 的扇形 AOB（涂色）；面积是 ${r} 与 ${s} 之积的一半。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-or-angle-from-sector-area",
      figure: radianDrawings["radius-or-angle-from-sector-area"],
      title: t("The radius or the angle from the sector area", "由扇形面积求半径或圆心角"),
      explanation: t(
        "Solve $A = \\frac{1}{2} r^2 \\theta$ for the unknown.\n\nIf a sector of $\\frac{\\pi}{4}$ radians has area $8\\pi\\text{ cm}^2$, then $\\frac{1}{2} r^2 \\cdot \\frac{\\pi}{4} = 8\\pi$, so $\\frac{\\pi}{8} r^2 = 8\\pi$, $r^2 = 64$ and $r = 8$ cm. If a sector of a circle with radius $6$ m has area $15\\pi\\text{ m}^2$, then $\\frac{1}{2} \\cdot 36 \\cdot \\theta = 15\\pi$, so $\\theta = \\frac{15\\pi}{18} = \\frac{5\\pi}{6}$ radians.\n\n> **Watch out.** When solving for $r$, the equation gives $r^2$: take the square root at the end, and do not stop at $r^2$ or $2r^2$. Divide by $\\frac{1}{2}\\theta$, not by $\\theta$ alone. When solving for $\\theta$, divide by $\\frac{1}{2} r^2$, not by $r$ or $r^2$, and give the angle in radians, not degrees.",
        "解方程 $A = \\frac{1}{2} r^2 \\theta$ 求未知量。\n\n若 $\\frac{\\pi}{4}$ 弧度的扇形面积为 $8\\pi\\text{ cm}^2$，则 $\\frac{1}{2} r^2 \\cdot \\frac{\\pi}{4} = 8\\pi$，即 $\\frac{\\pi}{8} r^2 = 8\\pi$，$r^2 = 64$，$r = 8$ 厘米。若半径为 $6$ 米的圆中一个扇形面积为 $15\\pi\\text{ m}^2$，则 $\\frac{1}{2} \\cdot 36 \\cdot \\theta = 15\\pi$，所以 $\\theta = \\frac{15\\pi}{18} = \\frac{5\\pi}{6}$ 弧度。\n\n> **注意。** 求 $r$ 时方程先给出 $r^2$：最后要开平方，不要停在 $r^2$ 或 $2r^2$。要除以 $\\frac{1}{2}\\theta$，不是只除以 $\\theta$。求 $\\theta$ 时要除以 $\\frac{1}{2} r^2$，不是 $r$ 或 $r^2$；答案用弧度表示，不是角度。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const d = rng.pick(minorAngles);
        const x = radians(d);
        const r = rng.int(2, 15);
        const A = x.mul(q(r * r, 2));
        const pic = sector(
          20,
          d,
          piPlain(x),
          len(r, u),
          undefined,
          `Sector AOB with radius ${r} ${u} and central angle ${piPlain(x)}, shaded; its area is ${piPlain(A)} ${u}².`,
          `半径为 ${r} ${u}、圆心角为 ${piPlain(x)} 的扇形 AOB（涂色）；面积为 ${piPlain(A)} ${u}²。`,
        );
        if (rng.bool()) {
          const half = x.div(q(2));
          const work = steps(`\\frac{1}{2} r^2 \\cdot ${piTex(x)} = ${piTex(A)}`, `${piTex(half)} r^2 = ${piTex(A)}`);
          const root = steps(`r^2 = ${piTex(A)} \\div ${piTex(half)} = ${r * r}`, `r = \\sqrt{${r * r}} = ${tex(r, u)}`);
          return {
            ...numberProblem({
              prompt: t(
                `A sector with a central angle of $${piTex(x)}$ radians has an area of $${tex(piTex(A), u, 2)}$. Find the radius of the circle.`,
                `圆心角为 $${piTex(x)}$ 弧度的扇形面积为 $${tex(piTex(A), u, 2)}$。求圆的半径。`,
              ),
              answer: r,
              unit: u,
              wrong: [r * r, 2 * r * r, A.div(x), q(r, 2)],
              solution: t(
                `${stepLabel(1, "write the equation", "列方程").en} The area of a sector is $A = \\frac{1}{2} r^2 \\theta$. Put in the angle and the area, and combine $\\frac{1}{2}$ with the angle:${work}${stepLabel(2, "solve for $r$", "解出 $r$").en} Divide by $${piTex(half)}$, then take the square root, since a radius is positive:${root}**Check.** Substitute $r = ${r}$:${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${piTex(x)} = ${piTex(A)}`)}That is the given area.\n\n{{figure 0}}`,
                `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}扇形面积 $A = \\frac{1}{2} r^2 \\theta$。代入圆心角和面积，把 $\\frac{1}{2}$ 与角合并：${work}${stepLabel(2, "solve for $r$", "解出 $r$")["zh-CN"]}两边除以 $${piTex(half)}$，再开平方（半径是正数）：${root}**检验。** 代入 $r = ${r}$：${steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot ${piTex(x)} = \\frac{1}{2} \\cdot ${r * r} \\cdot ${piTex(x)} = ${piTex(A)}`)}正是已知面积。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [pic],
          };
        }
        const halfSquare = q(r * r, 2);
        const work = steps(`\\frac{1}{2} \\cdot ${r}^2 \\cdot \\theta = ${piTex(A)}`, `${halfSquare.toLatex()}\\theta = ${piTex(A)}`);
        return {
          ...piProblem({
            prompt: t(
              `A sector of a circle with radius $${tex(r, u)}$ has an area of $${tex(piTex(A), u, 2)}$. Find its central angle in radians.${PI_EN}`,
              `半径为 $${tex(r, u)}$ 的圆中，一个扇形面积为 $${tex(piTex(A), u, 2)}$。求它的圆心角的弧度数。${PI_ZH}`,
            ),
            answer: piTex(x),
            wrong: [piTex(x.div(q(2))), piTex(x.mul(q(r))), `${d}`, piTex(A.div(q(r * r)).mul(q(4)))],
            solution: t(
              `${stepLabel(1, "write the equation", "列方程").en} The area of a sector is $A = \\frac{1}{2} r^2 \\theta$. Put in the radius and the area:${work}${stepLabel(2, "solve for $\\theta$", "解出 $\\theta$").en} Divide by $${halfSquare.toLatex()}$:${steps(`\\theta = ${piTex(A)} \\div ${halfSquare.toLatex()} = ${piTex(x)}`)}**Check.** In degrees, $${piTex(x)} = ${d}^\\circ$, so the sector is $\\frac{${d}}{360}$ of the disk:${steps(`\\frac{${d}}{360} \\cdot \\pi \\cdot ${r * r} = ${piTex(A)}`)}That is the given area.\n\n{{figure 0}}`,
              `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}扇形面积 $A = \\frac{1}{2} r^2 \\theta$。代入半径和面积：${work}${stepLabel(2, "solve for $\\theta$", "解出 $\\theta$")["zh-CN"]}两边除以 $${halfSquare.toLatex()}$：${steps(`\\theta = ${piTex(A)} \\div ${halfSquare.toLatex()} = ${piTex(x)}`)}**检验。** 用角度表示，$${piTex(x)} = ${d}^\\circ$，所以扇形占整个圆的 $\\frac{${d}}{360}$：${steps(`\\frac{${d}}{360} \\cdot \\pi \\cdot ${r * r} = ${piTex(A)}`)}正是已知面积。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [pic],
        };
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

/** valueS is an exact number as a decimal number. */
const valueS = (s: S) => s[0].toNumber() * Math.sqrt(s[1]);

/** plainS writes an exact number for a figure: "5√3", "√2/2", "7". */
function plainS(s: S): string {
  const [c, m] = s;
  if (m === 1) return c.toString();
  const top = `${c.n === 1n ? "" : c.n}√${m}`;
  return c.d === 1n ? top : `${top}/${c.d}`;
}

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

/** fnNames name each ratio in words. */
const fnNames: Record<Fn, Text> = { sin: t("sine", "正弦"), cos: t("cosine", "余弦"), tan: t("tangent", "正切") };

/** specialSides are the sides of the special right triangle with an angle of π/n, seen from that angle, in LaTeX and plain text. */
const specialSides: Record<Special, Record<Side, readonly [string, string]>> = {
  6: { opp: ["1", "1"], adj: ["\\sqrt{3}", "√3"], hyp: ["2", "2"] },
  4: { opp: ["1", "1"], adj: ["1", "1"], hyp: ["\\sqrt{2}", "√2"] },
  3: { opp: ["\\sqrt{3}", "√3"], adj: ["1", "1"], hyp: ["2", "2"] },
};

/** specialTriangle names the special right triangle with an angle of π/n. */
const specialTriangle: Record<Special, Text> = {
  6: t(
    "the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle, with sides $1$, $\\sqrt{3}$ and $2$",
    "$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，三边为 $1$、$\\sqrt{3}$、$2$",
  ),
  4: t(
    "the $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle, with sides $1$, $1$ and $\\sqrt{2}$",
    "$45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形，三边为 $1$、$1$、$\\sqrt{2}$",
  ),
  3: t(
    "the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle, with sides $1$, $\\sqrt{3}$ and $2$",
    "$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，三边为 $1$、$\\sqrt{3}$、$2$",
  ),
};

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

/** specialFigure draws the special right triangle with angle A of π/n and its sides labeled. */
const specialFigure = (n: Special): Figure =>
  triangleFigure(
    Math.PI / n,
    `π/${n}`,
    { opp: specialSides[n].opp[1], adj: specialSides[n].adj[1], hyp: specialSides[n].hyp[1] },
    `Right triangle ABC with angle A of π/${n}, which is ${180 / n}°: the side opposite A is ${specialSides[n].opp[1]}, the side adjacent to A is ${specialSides[n].adj[1]}, and the hypotenuse is ${specialSides[n].hyp[1]}.`,
    `直角三角形 ABC，角 A 为 π/${n}，即 ${180 / n}°：A 的对边为 ${specialSides[n].opp[1]}，邻边为 ${specialSides[n].adj[1]}，斜边为 ${specialSides[n].hyp[1]}。`,
  );

/** ratioFromTriangle writes a ratio of π/n as a quotient of the special triangle's sides and its simplest form. */
function ratioFromTriangle(f: Fn, n: Special): string {
  const [top, bottom] = fnSides[f];
  const v = texS(specialValue(f, n));
  const quotient =
    bottom === "adj" && specialSides[n].adj[0] === "1"
      ? specialSides[n][top][0]
      : `\\frac{${specialSides[n][top][0]}}{${specialSides[n][bottom][0]}}`;
  return `\\${f} ${angleTex(n)} = \\${f} ${180 / n}^\\circ = ${quotient === v ? v : `${quotient} = ${v}`}`;
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

/** trigIntroFigure draws the 45°-45°-90° triangle with angle A of π/4. */
const trigIntroFigure = specialFigure(4);

/** trigonometricRatiosWithRadians finds exact and approximate trigonometric ratios of angles given in radians. */
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
  intro: t(
    `The sine, cosine and tangent of an acute angle are ratios of sides in a right triangle with that angle, and the special angles $30^\\circ$, $45^\\circ$ and $60^\\circ$ have exact ratios. In later mathematics angles are almost always given in radians, so the same facts are needed with $\\frac{\\pi}{6}$, $\\frac{\\pi}{4}$ and $\\frac{\\pi}{3}$.

Nothing about the triangle changes with the unit. To find $\\tan \\frac{\\pi}{4}$, convert: $\\frac{\\pi}{4} = \\frac{180^\\circ}{4} = 45^\\circ$. In the $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle the legs are equal, say $1$ and $1$, so the opposite side over the adjacent side is $\\frac{1}{1} = 1$.

{{figure 0}}

So $\\tan \\frac{\\pi}{4} = \\tan 45^\\circ = 1$: one angle, two names. This topic finds exact ratios of the special angles in radians, reads the angles back from exact values, and solves right triangles whose angles are given in radians, exactly or with a calculator in radian mode.`,
    `锐角的正弦、余弦、正切是含这个角的直角三角形中两边之比，特殊角 $30^\\circ$、$45^\\circ$、$60^\\circ$ 有精确的三角比。在以后的数学中，角几乎总是用弧度给出，所以同样的结论要用于 $\\frac{\\pi}{6}$、$\\frac{\\pi}{4}$、$\\frac{\\pi}{3}$。

三角形本身并不因单位而改变。求 $\\tan \\frac{\\pi}{4}$ 时，先换算：$\\frac{\\pi}{4} = \\frac{180^\\circ}{4} = 45^\\circ$。在 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形中，两条直角边相等，比如都是 $1$，所以对边比邻边是 $\\frac{1}{1} = 1$。

{{figure 0}}

所以 $\\tan \\frac{\\pi}{4} = \\tan 45^\\circ = 1$：同一个角，两个名字。本课求弧度制特殊角的精确三角比，由精确值反求角，并解角用弧度给出的直角三角形——精确求解，或用设为弧度模式的计算器求近似值。`,
  ),
  introFigures: [trigIntroFigure],
  knowledgePoints: [
    {
      id: "exact-ratios-of-radian-angles",
      figure: geometryDrawings2["trigonometric-ratios-with-radians#exact-ratios-of-radian-angles"],
      title: t("Exact ratios of π/6, π/4 and π/3", "π/6、π/4、π/3 的精确三角比"),
      explanation: t(
        "The special angles in radians are $\\frac{\\pi}{6} = 30^\\circ$, $\\frac{\\pi}{4} = 45^\\circ$ and $\\frac{\\pi}{3} = 60^\\circ$. An angle has the same ratios whichever unit measures it, so convert and use the special right triangles:\n\n| | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\nFor example, $6\\sin \\frac{\\pi}{3} = 6\\sin 60^\\circ = 6 \\cdot \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}$.\n\n> **Watch out.** Do not swap sine and cosine: $\\sin \\frac{\\pi}{6} = \\frac{1}{2}$ but $\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2}$. Do not mix up $\\frac{\\pi}{6}$ ($30^\\circ$) with $\\frac{\\pi}{3}$ ($60^\\circ$): a larger denominator is a smaller angle. And multiply by the coefficient once; do not double the value.",
        "用弧度表示的特殊角是 $\\frac{\\pi}{6} = 30^\\circ$、$\\frac{\\pi}{4} = 45^\\circ$、$\\frac{\\pi}{3} = 60^\\circ$。无论用哪种单位度量，同一个角的三角比都相同，所以先换算，再用特殊直角三角形：\n\n| | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\n例如 $6\\sin \\frac{\\pi}{3} = 6\\sin 60^\\circ = 6 \\cdot \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}$。\n\n> **注意。** 不要把正弦和余弦弄反：$\\sin \\frac{\\pi}{6} = \\frac{1}{2}$，而 $\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2}$。不要把 $\\frac{\\pi}{6}$（$30^\\circ$）与 $\\frac{\\pi}{3}$（$60^\\circ$）混淆：分母越大，角越小。系数只乘一次，不要把值加倍。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        const n = rng.pick(specials);
        const c = rng.pick([1, 1, 2, 3, 4, 6, 8, 12]);
        const v = specialValue(f, n);
        const answer = times(v, c);
        const coef = c === 1 ? "" : `${c}`;
        const swapped = f === "tan" ? over(c, v) : times(specialValue(cofn[f], n), c);
        const [top, bottom] = fnSides[f];
        const fv = trig(f, Math.PI / n);
        const multiply = c === 1 ? "" : steps(`${c}\\${f} ${angleTex(n)} = ${c} \\cdot ${texS(v)} = ${texS(answer)}`);
        return {
          ...radicalProblem({
            prompt: t(
              `Find the exact value of $${coef}\\${f} ${angleTex(n)}$ in simplest radical form.`,
              `求 $${coef}\\${f} ${angleTex(n)}$ 的精确值，答案写成最简根式。`,
            ),
            answer,
            wrong: [texS(swapped), texS(times(specialValue(f, otherSpecial(n)), c)), texS(times(v, 2 * c))],
            solution: t(
              `${stepLabel(1, "convert the angle", "换算角").en} Replace $\\pi$ by $180^\\circ$: $${angleTex(n)} = \\frac{180^\\circ}{${n}} = ${180 / n}^\\circ$. The ratio depends only on the angle, not on the unit.\n\n${stepLabel(2, "read the special triangle", "看特殊三角形").en} In ${specialTriangle[n].en}, the ${fnNames[f].en} of the ${180 / n}° angle is ${sideNames[top].en} over ${sideNames[bottom].en}:${steps(ratioFromTriangle(f, n))}${c === 1 ? "" : `${stepLabel(3, `multiply by $${c}$`, `乘以 $${c}$`).en}${multiply}`}**Check.** With a calculator in radian mode, $${coef}\\${f} ${angleTex(n)} \\approx ${c === 1 ? "" : `${c} \\cdot ${fixed(fv, 4)} \\approx `}${fixed(c * fv)}$, and $${texS(answer)} \\approx ${fixed(valueS(answer))}$. They agree.\n\n{{figure 0}}`,
              `${stepLabel(1, "convert the angle", "换算角")["zh-CN"]}把 $\\pi$ 换成 $180^\\circ$：$${angleTex(n)} = \\frac{180^\\circ}{${n}} = ${180 / n}^\\circ$。三角比只由角决定，与单位无关。\n\n${stepLabel(2, "read the special triangle", "看特殊三角形")["zh-CN"]}在${specialTriangle[n]["zh-CN"]}中，${180 / n}° 角的${fnNames[f]["zh-CN"]}是${sideNames[top]["zh-CN"]}比${sideNames[bottom]["zh-CN"]}：${steps(ratioFromTriangle(f, n))}${c === 1 ? "" : `${stepLabel(3, `multiply by $${c}$`, `乘以 $${c}$`)["zh-CN"]}${multiply}`}**检验。** 用设为弧度模式的计算器，$${coef}\\${f} ${angleTex(n)} \\approx ${c === 1 ? "" : `${c} \\cdot ${fixed(fv, 4)} \\approx `}${fixed(c * fv)}$，而 $${texS(answer)} \\approx ${fixed(valueS(answer))}$，两者一致。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [specialFigure(n)],
        };
      },
    },
    {
      id: "special-angles-in-radians",
      figure: geometryDrawings2["trigonometric-ratios-with-radians#special-angles-in-radians"],
      title: t("Special angles in radians from exact values", "由精确值求弧度制特殊角"),
      explanation: t(
        "Read the table backwards and give the angle in radians. If $2\\sin \\theta = \\sqrt{3}$ and $\\theta$ is acute, then $\\sin \\theta = \\frac{\\sqrt{3}}{2}$, so $\\theta = 60^\\circ = \\frac{\\pi}{3}$. The sine and the tangent grow as the acute angle grows, and the cosine shrinks, so each value belongs to exactly one acute angle.\n\n> **Watch out.** Give the angle in radians: $60$ is the angle in degrees, not the answer. Check which column the value sits in: $\\sin \\theta = \\frac{1}{2}$ gives $\\frac{\\pi}{6}$, but $\\cos \\theta = \\frac{1}{2}$ gives $\\frac{\\pi}{3}$. Divide by the coefficient first.",
        "把表反过来读，并用弧度写出角。若 $2\\sin \\theta = \\sqrt{3}$ 且 $\\theta$ 是锐角，则 $\\sin \\theta = \\frac{\\sqrt{3}}{2}$，所以 $\\theta = 60^\\circ = \\frac{\\pi}{3}$。锐角增大时正弦和正切增大、余弦减小，所以每个值只对应一个锐角。\n\n> **注意。** 角要用弧度表示：$60$ 是角度数，不是答案。看清这个值在哪一列：$\\sin \\theta = \\frac{1}{2}$ 得 $\\frac{\\pi}{6}$，而 $\\cos \\theta = \\frac{1}{2}$ 得 $\\frac{\\pi}{3}$。先除以系数。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        const n = rng.pick(specials);
        const c = rng.int(1, 4);
        const v = specialValue(f, n);
        const rhs = texS(times(v, c));
        const coef = c === 1 ? "" : `${c}`;
        const isolate =
          c === 1
            ? t(
                `The ${fnNames[f].en} is already alone: $\\${f} \\theta = ${texS(v)}$.`,
                `${fnNames[f]["zh-CN"]}已经单独在一边：$\\${f} \\theta = ${texS(v)}$。`,
              )
            : t(
                `Divide both sides by $${c}$:${steps(`\\${f} \\theta = ${texS(v)}`)}`,
                `两边除以 $${c}$：${steps(`\\${f} \\theta = ${texS(v)}`)}`,
              );
        const back = steps(`${coef}\\${f} ${angleTex(n)} = ${c === 1 ? "" : `${c} \\cdot `}${texS(v)}${c === 1 ? "" : ` = ${rhs}`}`);
        return {
          ...piProblem({
            prompt: t(
              `Find the acute angle $\\theta$, in radians, with $${coef}\\${f} \\theta = ${rhs}$.${PI_EN}`,
              `求满足 $${coef}\\${f} \\theta = ${rhs}$ 的锐角 $\\theta$（用弧度表示）。${PI_ZH}`,
            ),
            answer: angleTex(n),
            wrong: [...specials.filter((m) => m !== n).map(angleTex), `${180 / n}`],
            solution: t(
              `${stepLabel(1, "isolate the ratio", "把三角比单独留在一边").en} ${isolate.en}\n\n${stepLabel(2, "find the angle in degrees", "求角度").en} In the special right triangles, the acute angle whose ${fnNames[f].en} is $${texS(v)}$ is $${180 / n}^\\circ$, and it is the only one, since the ${fnNames[f].en} of an acute angle ${f === "cos" ? "shrinks" : "grows"} as the angle grows.\n\n${stepLabel(3, "convert to radians", "化为弧度").en}${steps(`\\theta = ${180 / n}^\\circ = ${180 / n} \\cdot \\frac{\\pi}{180} = ${angleTex(n)}`)}**Check.** Substitute $\\theta = ${angleTex(n)}$ into the equation:${back}That is the right side.\n\n{{figure 0}}`,
              `${stepLabel(1, "isolate the ratio", "把三角比单独留在一边")["zh-CN"]}${isolate["zh-CN"]}\n\n${stepLabel(2, "find the angle in degrees", "求角度")["zh-CN"]}在特殊直角三角形中，${fnNames[f]["zh-CN"]}为 $${texS(v)}$ 的锐角是 $${180 / n}^\\circ$；而且只有这一个，因为锐角增大时它的${fnNames[f]["zh-CN"]}${f === "cos" ? "减小" : "增大"}。\n\n${stepLabel(3, "convert to radians", "化为弧度")["zh-CN"]}${steps(`\\theta = ${180 / n}^\\circ = ${180 / n} \\cdot \\frac{\\pi}{180} = ${angleTex(n)}`)}**检验。** 把 $\\theta = ${angleTex(n)}$ 代入方程：${back}正是右边。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [specialFigure(n)],
        };
      },
    },
    {
      id: "exact-sides-with-radian-angles",
      figure: geometryDrawings2["trigonometric-ratios-with-radians#exact-sides-with-radian-angles"],
      title: t("Exact sides with special angles in radians", "用弧度制特殊角求精确边长"),
      explanation: t(
        "Set up the ratio exactly as with degrees, then use the exact value. In right triangle $ABC$ with $\\angle A = \\frac{\\pi}{6}$ and hypotenuse $AB = 10$, the side opposite $A$ is\n\n$$BC = 10\\sin \\frac{\\pi}{6} = 10 \\cdot \\frac{1}{2} = 5.$$\n\nIf instead the side adjacent to $A$ is $AC = 6$, the hypotenuse is $\\frac{6}{\\cos \\frac{\\pi}{6}} = \\frac{6}{\\frac{\\sqrt{3}}{2}} = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}$.\n\n> **Watch out.** When $x$ is in the numerator of the ratio, multiply; when it is in the denominator, divide. Doing the other one gives a wrong length. Name the sides from angle $A$ before choosing sine, cosine or tangent: the side across from $A$ is opposite, the other leg is adjacent.",
        "和角度制一样列出三角比，再代入精确值。在直角三角形 $ABC$ 中，$\\angle A = \\frac{\\pi}{6}$，斜边 $AB = 10$，则 $A$ 的对边\n\n$$BC = 10\\sin \\frac{\\pi}{6} = 10 \\cdot \\frac{1}{2} = 5.$$\n\n若改为已知 $A$ 的邻边 $AC = 6$，则斜边是 $\\frac{6}{\\cos \\frac{\\pi}{6}} = \\frac{6}{\\frac{\\sqrt{3}}{2}} = \\frac{12}{\\sqrt{3}} = 4\\sqrt{3}$。\n\n> **注意。** $x$ 在比的分子上时用乘法，在分母上时用除法；做反了会得到错误的长度。先从角 $A$ 出发确定各边，再选正弦、余弦或正切：与 $A$ 相对的是对边，另一条直角边是邻边。",
      ),
      generate(rng) {
        const c = rng.pick(sideCases);
        const n = rng.pick(specials);
        const k = rng.int(2, 20);
        const divide = fnSides[c.fn][1] === c.ask;
        const v = specialValue(c.fn, n);
        const answer = divide ? over(k, v) : times(v, k);
        const labels = { [c.known]: `${k}`, [c.ask]: "x" } as Partial<Record<Side, string>>;
        const solved = { [c.known]: `${k}`, [c.ask]: plainS(answer) } as Partial<Record<Side, string>>;
        const solve = divide ? `x = \\frac{${k}}{${texS(v)}} = ${texS(answer)}` : `x = ${k} \\cdot ${texS(v)} = ${texS(answer)}`;
        const others = fns.filter((g) => g !== c.fn);
        const [top, bottom] = fnSides[c.fn];
        const xv = valueS(answer);
        const val = (s: Side) => (s === c.ask ? fixed(xv) : `${k}`);
        const ratio = (s: Side) => (s === c.ask ? xv : k);
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
              `${stepLabel(1, "choose the ratio", "选三角比").en} Seen from $A$, $x$ is ${sideNames[c.ask].en} and $${k}$ is ${sideNames[c.known].en}. The ${fnNames[c.fn].en} relates these two, and $\\${c.fn} ${angleTex(n)} = \\${c.fn} ${180 / n}^\\circ = ${texS(v)}$:${steps(ratioLine(c, angleTex(n), `${k}`))}${stepLabel(2, divide ? "solve for $x$" : "multiply", divide ? "解出 $x$" : "相乘").en} ${divide ? `$x$ is in the denominator, so $x$ is $${k}$ divided by the ratio; rationalize the denominator:` : `$x$ is in the numerator, so $x$ is $${k}$ times the ratio:`}${steps(solve)}**Check.** Put $x \\approx ${fixed(xv)}$ back into the ratio: $\\frac{${val(top)}}{${val(bottom)}} \\approx ${fixed(ratio(top) / ratio(bottom))}$, and $${texS(v)} \\approx ${fixed(valueS(v))}$. They agree.\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the ratio", "选三角比")["zh-CN"]}从 $A$ 看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${k}$ 是${sideNames[c.known]["zh-CN"]}。联系这两边的是${fnNames[c.fn]["zh-CN"]}，而 $\\${c.fn} ${angleTex(n)} = \\${c.fn} ${180 / n}^\\circ = ${texS(v)}$：${steps(ratioLine(c, angleTex(n), `${k}`))}${stepLabel(2, divide ? "solve for $x$" : "multiply", divide ? "解出 $x$" : "相乘")["zh-CN"]}${divide ? `$x$ 在分母上，所以 $x$ 等于 $${k}$ 除以这个比，再把分母有理化：` : `$x$ 在分子上，所以 $x$ 等于 $${k}$ 乘以这个比：`}${steps(solve)}**检验。** 把 $x \\approx ${fixed(xv)}$ 代回比式：$\\frac{${val(top)}}{${val(bottom)}} \\approx ${fixed(ratio(top) / ratio(bottom))}$，而 $${texS(v)} \\approx ${fixed(valueS(v))}$，两者一致。\n\n{{figure 0}}`,
            ),
          }),
          figure: triangleFigure(
            Math.PI / n,
            `π/${n}`,
            labels,
            `Right triangle ABC with the right angle at C and angle A of π/${n}; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is x.`,
            `直角三角形 ABC，直角在 C，角 A 为 π/${n}；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}为 x。`,
          ),
          solutionFigures: [
            triangleFigure(
              Math.PI / n,
              `π/${n}`,
              solved,
              `Right triangle ABC with angle A of π/${n}; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is ${plainS(answer)}.`,
              `直角三角形 ABC，角 A 为 π/${n}；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}为 ${plainS(answer)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "sides-with-decimal-radian-angles",
      figure: geometryDrawings2["trigonometric-ratios-with-radians#sides-with-decimal-radian-angles"],
      title: t("Sides with angles in radians, using a calculator", "用计算器求弧度制角的边长"),
      explanation: t(
        "For an angle such as $0.9$ radians, use a calculator set to **radian mode**; in degree mode it would read $0.9$ as $0.9^\\circ$, a tiny angle. In right triangle $ABC$ with $\\angle A = 0.9$ and hypotenuse $AB = 12$, the side opposite $A$ is\n\n$$BC = 12\\sin 0.9 \\approx 12 \\cdot 0.7833 \\approx 9.4.$$\n\n> **Watch out.** In degree mode, $\\sin 0.9$ comes out near $0.0157$ and the side near $0.2$: far too small for an angle of about $52^\\circ$. When $x$ is in the denominator of the ratio, divide by the ratio rather than multiply. Name the sides from angle $A$ before choosing sine, cosine or tangent.",
        "对于像 $0.9$ 弧度这样的角，要把计算器设为**弧度模式**；在角度模式下它会把 $0.9$ 当作 $0.9^\\circ$，一个很小的角。在直角三角形 $ABC$ 中，$\\angle A = 0.9$，斜边 $AB = 12$，则 $A$ 的对边\n\n$$BC = 12\\sin 0.9 \\approx 12 \\cdot 0.7833 \\approx 9.4.$$\n\n> **注意。** 在角度模式下，$\\sin 0.9$ 约为 $0.0157$，边长约为 $0.2$：对于约 $52^\\circ$ 的角来说太小了。$x$ 在比的分母上时，要除以这个比，而不是乘。先从角 $A$ 出发确定各边，再选正弦、余弦或正切。",
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
          const solved = { [c.known]: `${k}`, [c.ask]: `≈ ${dec(answer)}` } as Partial<Record<Side, string>>;
          const solve = divide
            ? `x = \\frac{${k}}{\\${c.fn} ${dec(x)}} \\approx \\frac{${k}}{${fixed(f, 4)}} \\approx ${dec(answer)}`
            : `x = ${k} \\${c.fn} ${dec(x)} \\approx ${k} \\cdot ${fixed(f, 4)} \\approx ${dec(answer)}`;
          const work = steps(ratioLine(c, dec(x), `${k}`));
          const [top, bottom] = fnSides[c.fn];
          const av = answer.toNumber();
          const val = (s: Side) => (s === c.ask ? dec(answer) : `${k}`);
          const num = (s: Side) => (s === c.ask ? av : k);
          const degrees = Math.round(degreesOf(x));
          const wrongMode = divide ? k / fDeg : k * fDeg;
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
                `${stepLabel(1, "choose the ratio", "选三角比").en} Seen from $A$, $x$ is ${sideNames[c.ask].en} and $${k}$ is ${sideNames[c.known].en}, so use the ${fnNames[c.fn].en}:${work}${stepLabel(2, "evaluate in radian mode", "用弧度模式计算").en} The angle is $${dec(x)}$ radians, so the calculator must be in radian mode. ${divide ? "$x$ is in the denominator, so divide by the ratio:" : "$x$ is in the numerator, so multiply by the ratio:"}${steps(solve)}**Check.** Put $x \\approx ${dec(answer)}$ back: $\\frac{${val(top)}}{${val(bottom)}} \\approx ${fixed(num(top) / num(bottom))}$, close to $\\${c.fn} ${dec(x)} \\approx ${fixed(f)}$, as rounding allows. In degree mode the calculator would read the angle as $${dec(x)}^\\circ$ and give $x \\approx ${fixed(wrongMode, 1)}$, which cannot fit an angle of about $${degrees}^\\circ$.\n\n{{figure 0}}`,
                `${stepLabel(1, "choose the ratio", "选三角比")["zh-CN"]}从 $A$ 看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${k}$ 是${sideNames[c.known]["zh-CN"]}，所以用${fnNames[c.fn]["zh-CN"]}：${work}${stepLabel(2, "evaluate in radian mode", "用弧度模式计算")["zh-CN"]}角是 $${dec(x)}$ 弧度，所以计算器必须设为弧度模式。${divide ? "$x$ 在分母上，所以除以这个比：" : "$x$ 在分子上，所以乘以这个比："}${steps(solve)}**检验。** 把 $x \\approx ${dec(answer)}$ 代回：$\\frac{${val(top)}}{${val(bottom)}} \\approx ${fixed(num(top) / num(bottom))}$，与 $\\${c.fn} ${dec(x)} \\approx ${fixed(f)}$ 在舍入误差范围内一致。若用角度模式，计算器会把角当作 $${dec(x)}^\\circ$，得到 $x \\approx ${fixed(wrongMode, 1)}$，与约 $${degrees}^\\circ$ 的角不符。\n\n{{figure 0}}`,
              ),
            }),
            figure: triangleFigure(
              th,
              `${dec(x)}`,
              labels,
              `Right triangle ABC with the right angle at C and angle A of ${dec(x)} radians; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is x.`,
              `直角三角形 ABC，直角在 C，角 A 为 ${dec(x)} 弧度；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}为 x。`,
            ),
            solutionFigures: [
              triangleFigure(
                th,
                `${dec(x)}`,
                solved,
                `Right triangle ABC with angle A of ${dec(x)} radians, about ${degrees}°; ${sideNames[c.known].en} is ${k} and ${sideNames[c.ask].en} is about ${dec(answer)}.`,
                `直角三角形 ABC，角 A 为 ${dec(x)} 弧度，约 ${degrees}°；${sideNames[c.known]["zh-CN"]}为 ${k}，${sideNames[c.ask]["zh-CN"]}约为 ${dec(answer)}。`,
              ),
            ],
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
