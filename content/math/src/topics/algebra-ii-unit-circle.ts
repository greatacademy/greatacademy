import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, dec, gcd, type Mark, type Point, Q, q, radical, simplifyRadical, sketch } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, radicalProblem, steps, yesNo } from "../problems.ts";

// Algebra II, unit 8: the unit circle — angles in standard position (positive,
// negative, coterminal, reference angles), the unit-circle definition of the
// trigonometric ratios in every quadrant, in degrees and radians, and the
// Pythagorean identity. Exact special values of the unit circle come in the
// next module; here ratios come from points with rational coordinates, from a
// reference angle's ratio given to four decimal places, or from a calculator.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rad = (d: number) => (d * Math.PI) / 180;

/** mod is a modulo m, in [0, m). */
const mod = (a: number, m: number) => ((a % m) + m) % m;

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** Fn is one of the three basic trigonometric ratios. */
type Fn = "sin" | "cos" | "tan";

const fns: readonly Fn[] = ["sin", "cos", "tan"];

const fnNames: Record<Fn, Text> = {
  sin: t("sine", "正弦"),
  cos: t("cosine", "余弦"),
  tan: t("tangent", "正切"),
};

/** trig evaluates a ratio of an angle in radians. */
const trig = (f: Fn, x: number) => (f === "sin" ? Math.sin(x) : f === "cos" ? Math.cos(x) : Math.tan(x));

/** roundQ is x rounded to the given number of decimal places, as an exact number. */
const roundQ = (x: number, places: number) => Q.of(Math.round(x * 10 ** places), 10 ** places);

/** nearBoundary tells whether x lies too close to a rounding boundary at the given number of places to round reliably. */
const nearBoundary = (x: number, places: number) => {
  const s = Math.abs(x) * 10 ** places;
  return Math.abs(s - Math.floor(s) - 0.5) < 0.1;
};

/** Quadrant is a quadrant 1 to 4. */
type Quadrant = 1 | 2 | 3 | 4;

const roman = ["", "I", "II", "III", "IV"] as const;
const zhNumbers = ["", "一", "二", "三", "四"] as const;

/** quadrantName names a quadrant: "Quadrant II", "第二象限". */
const quadrantName = (n: Quadrant): Text => t(`Quadrant ${roman[n]}`, `第${zhNumbers[n]}象限`);

const quadrantOptions: readonly Text[] = [
  t("Quadrant I", "第一象限"),
  t("Quadrant II", "第二象限"),
  t("Quadrant III", "第三象限"),
  t("Quadrant IV", "第四象限"),
  t("On an axis", "在坐标轴上"),
];

const signOptions: readonly Text[] = [t("Positive", "正"), t("Negative", "负")];

/** quadrantOfDeg is the quadrant of the terminal side of an angle of d degrees, or 0 when it lies on an axis. */
function quadrantOfDeg(d: number): Quadrant | 0 {
  const m = mod(d, 360);
  return m % 90 === 0 ? 0 : ((Math.floor(m / 90) + 1) as Quadrant);
}

/** quadrantOfPi is the quadrant of the terminal side of an angle of kπ/n, or 0 when it lies on an axis. */
function quadrantOfPi(k: number, n: number): Quadrant | 0 {
  const m = mod(k, 2 * n);
  return (2 * m) % n === 0 ? 0 : ((Math.floor((2 * m) / n) + 1) as Quadrant);
}

/** sgn is the sign of a ratio in a quadrant: all are positive in I, only sine in II, only tangent in III, only cosine in IV. */
function sgn(f: Fn, n: Quadrant): 1 | -1 {
  if (n === 1) return 1;
  if (f === "sin") return n === 2 ? 1 : -1;
  if (f === "cos") return n === 4 ? 1 : -1;
  return n === 3 ? 1 : -1;
}

/** signRule states which ratios are positive in a quadrant. */
const signRule: Record<Quadrant, Text> = {
  1: t("In Quadrant I, $x > 0$ and $y > 0$, so all three ratios are positive.", "在第一象限，$x > 0$ 且 $y > 0$，所以三个三角比都是正的。"),
  2: t("In Quadrant II, $x < 0$ and $y > 0$, so only the sine is positive.", "在第二象限，$x < 0$ 且 $y > 0$，所以只有正弦是正的。"),
  3: t(
    "In Quadrant III, $x < 0$ and $y < 0$, so only the tangent $\\frac{y}{x}$ is positive.",
    "在第三象限，$x < 0$ 且 $y < 0$，所以只有正切 $\\frac{y}{x}$ 是正的。",
  ),
  4: t("In Quadrant IV, $x > 0$ and $y < 0$, so only the cosine is positive.", "在第四象限，$x > 0$ 且 $y < 0$，所以只有余弦是正的。"),
};

/** piTex writes c·π in LaTeX: "\pi", "2\pi", "\frac{5\pi}{6}", "-\frac{\pi}{3}". */
function piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

const PI_EN = " Give the exact answer in terms of $\\pi$.";
const PI_ZH = "结果保留 $\\pi$。";

/** piProblem builds a problem whose answer is a simplified expression in π. */
const piProblem = (prompt: Text, answer: string, solution: Text, wrong: readonly string[]): Problem =>
  expressionProblem({ prompt, answer, solution, simplified: true, wrong });

/** arg writes an angle as the argument of a ratio, in parentheses when negative: "150^\circ", "(-30^\circ)". */
const arg = (tex: string) => (tex.startsWith("-") ? `(${tex})` : tex);

/** AngleInfo describes an angle: where its terminal side lies and its reference angle, with the steps that find them. */
interface AngleInfo {
  /** tex is the angle as given, in LaTeX. */
  readonly tex: string;
  /** mTex is the coterminal angle in [0°, 360°) or [0, 2π). */
  readonly mTex: string;
  readonly quadrant: Quadrant;
  /** ref is the reference angle in degrees. */
  readonly ref: number;
  readonly refTex: string;
  /** refLine is the computation of the reference angle from mTex, or mTex alone in Quadrant I. */
  readonly refLine: string;
  /** coterminal is the computation of mTex from tex, when they differ. */
  readonly coterminal?: string;
  /** range is the standard range, "0^\circ" to "360^\circ" or "0" to "2\pi". */
  readonly range: readonly [string, string];
}

/** turnsTex writes "360^\circ" or "3 \cdot 360^\circ". */
const turnsTex = (k: number, full: string) => (k === 1 ? full : `${k} \\cdot ${full}`);

/** degInfo describes an angle of d degrees whose terminal side is not on an axis. */
function degInfo(d: number): AngleInfo {
  const m = mod(d, 360);
  const quadrant = quadrantOfDeg(m) as Quadrant;
  const ref = [m, 180 - m, m - 180, 360 - m][quadrant - 1]!;
  const refLine = [
    `${m}^\\circ`,
    `180^\\circ - ${m}^\\circ = ${ref}^\\circ`,
    `${m}^\\circ - 180^\\circ = ${ref}^\\circ`,
    `360^\\circ - ${m}^\\circ = ${ref}^\\circ`,
  ][quadrant - 1]!;
  const turns = (d - m) / 360;
  return {
    tex: `${d}^\\circ`,
    mTex: `${m}^\\circ`,
    quadrant,
    ref,
    refTex: `${ref}^\\circ`,
    refLine,
    ...(turns !== 0 && {
      coterminal: `${d}^\\circ ${turns > 0 ? "-" : "+"} ${turnsTex(Math.abs(turns), "360^\\circ")} = ${m}^\\circ`,
    }),
    range: ["0^\\circ", "360^\\circ"],
  };
}

/** piInfo describes an angle of kπ/n whose terminal side is not on an axis. */
function piInfo(k: number, n: number): AngleInfo {
  const m = mod(k, 2 * n);
  const quadrant = quadrantOfPi(m, n) as Quadrant;
  const r = [m, n - m, m - n, 2 * n - m][quadrant - 1]!;
  const [mTex, refTex] = [piTex(q(m, n)), piTex(q(r, n))];
  const refLine = [mTex, `\\pi - ${mTex} = ${refTex}`, `${mTex} - \\pi = ${refTex}`, `2\\pi - ${mTex} = ${refTex}`][quadrant - 1]!;
  const turns = (k - m) / (2 * n);
  return {
    tex: piTex(q(k, n)),
    mTex,
    quadrant,
    ref: (r * 180) / n,
    refTex,
    refLine,
    ...(turns !== 0 && { coterminal: `${piTex(q(k, n))} ${turns > 0 ? "-" : "+"} ${piTex(2 * Math.abs(turns))} = ${mTex}` }),
    range: ["0", "2\\pi"],
  };
}

/** locate explains where the terminal side of an angle lies and finds its reference angle. */
function locate(a: AngleInfo): Text {
  const [lo, hi] = a.range;
  const co = a.coterminal
    ? t(
        `First find the coterminal angle between $${lo}$ and $${hi}$:${steps(a.coterminal)}`,
        `先求 $${lo}$ 到 $${hi}$ 之间与它终边相同的角：${steps(a.coterminal)}`,
      )
    : t("", "");
  const name = quadrantName(a.quadrant);
  const ref =
    a.quadrant === 1
      ? t(`The angle $${a.mTex}$ is in Quadrant I, so it is its own reference angle. `, `角 $${a.mTex}$ 在第一象限，它的参考角就是它自己。`)
      : t(
          `The angle $${a.mTex}$ is in ${name.en}, so its reference angle is${steps(a.refLine)}`,
          `角 $${a.mTex}$ 在${name["zh-CN"]}，所以它的参考角是${steps(a.refLine)}`,
        );
  return t(co.en + ref.en, co["zh-CN"] + ref["zh-CN"]);
}

/** randomDegrees is a random angle in [lo, hi] degrees whose terminal side is not on an axis. */
function randomDegrees(rng: Rng, lo: number, hi: number): number {
  for (;;) {
    const d = rng.int(lo, hi);
    if (quadrantOfDeg(d) !== 0) return d;
  }
}

const piDenominators = [3, 4, 5, 6, 8, 10, 12] as const;

/** randomPi is a random angle kπ/n in lowest terms with k in [lo·n, hi·n], whose terminal side is not on an axis. */
function randomPi(rng: Rng, lo: number, hi: number): [number, number] {
  for (;;) {
    const n = rng.pick(piDenominators);
    const k = rng.int(Math.ceil(lo * n), Math.floor(hi * n));
    if (k !== 0 && gcd(Math.abs(k), n) === 1 && quadrantOfPi(k, n) !== 0) return [k, n];
  }
}

/** signProblem asks whether a ratio of an angle is positive or negative. */
function signProblem(f: Fn, a: AngleInfo): Problem {
  const s = sgn(f, a.quadrant);
  const [lo, hi] = a.range;
  const intro = a.coterminal
    ? t(
        `First find the coterminal angle between $${lo}$ and $${hi}$:${steps(a.coterminal)}`,
        `先求 $${lo}$ 到 $${hi}$ 之间与它终边相同的角：${steps(a.coterminal)}`,
      )
    : t("", "");
  const name = quadrantName(a.quadrant);
  const rule = signRule[a.quadrant];
  return choiceProblem({
    prompt: t(`Is $\\${f} ${arg(a.tex)}$ positive or negative?`, `$\\${f} ${arg(a.tex)}$ 是正数还是负数？`),
    options: signOptions,
    correct: s > 0 ? 0 : 1,
    solution: t(
      `${intro.en}The terminal side of $${a.mTex}$ lies in ${name.en}. ${rule.en} So $\\${f} ${arg(a.tex)}$ is ${s > 0 ? "positive" : "negative"}.`,
      `${intro["zh-CN"]}$${a.mTex}$ 的终边在${name["zh-CN"]}。${rule["zh-CN"]}所以 $\\${f} ${arg(a.tex)}$ 是${s > 0 ? "正数" : "负数"}。`,
    ),
  });
}

/** referenceRatioProblem gives a ratio of an angle's reference angle to four places and asks for the ratio of the angle. */
function referenceRatioProblem(f: Fn, a: AngleInfo): Problem {
  const v = roundQ(trig(f, rad(a.ref)), 4);
  const s = sgn(f, a.quadrant);
  const answer = s > 0 ? v : v.neg();
  const where = locate(a);
  const name = quadrantName(a.quadrant);
  const last = steps(`\\${f} ${arg(a.tex)} = ${s > 0 ? "" : "-"}\\${f} ${a.refTex} \\approx ${dec(answer)}`);
  return numberProblem({
    prompt: t(
      `Given that $\\${f} ${a.refTex} \\approx ${dec(v)}$, find $\\${f} ${arg(a.tex)}$.`,
      `已知 $\\${f} ${a.refTex} \\approx ${dec(v)}$，求 $\\${f} ${arg(a.tex)}$。`,
    ),
    answer,
    form: "decimal",
    wrong: [answer.neg()],
    solution: t(
      `${where.en}In ${name.en} the ${fnNames[f].en} is ${s > 0 ? "positive" : "negative"}, so${last}`,
      `${where["zh-CN"]}在${name["zh-CN"]}，${fnNames[f]["zh-CN"]}是${s > 0 ? "正" : "负"}的，所以${last}`,
    ),
  });
}

// --- Figures ---------------------------------------------------------------

/** on is the point at distance r from the origin in direction d degrees. */
const on = (d: number, r = 1): Point => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];

const compassPoints: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** dirOf is the compass direction nearest to d degrees. */
const dirOf = (d: number): Compass => compassPoints[mod(Math.round(d / 45), 8)]!;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

const O: Point = [0, 0];

/** axes draws the x- and y-axes from -l to l. */
const axes = (l: number): Mark[] => [
  { kind: "segment", a: [-l, 0], b: [l, 0] },
  { kind: "segment", a: [0, -l], b: [0, l] },
  { kind: "label", at: [l, 0], text: "x", dir: "e", italic: true },
  { kind: "label", at: [0, l], text: "y", dir: "n", italic: true },
];

/** sweep draws an arc about the origin from direction a to direction b degrees (b < a turns clockwise), growing by grow per turn, with an arrowhead at b when arrow is set. */
function sweep(a: number, b: number, r: number, grow = 0, arrow = false): Mark[] {
  const span = b - a;
  // A sweep too short to show its direction is left out.
  if (arrow && Math.abs(span) < 12) return [];
  const n = Math.max(2, Math.ceil(Math.abs(span) / 5));
  const radius = (d: number) => r + (grow * Math.abs(d - a)) / 360;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const d = a + (span * i) / n;
    return on(d, radius(d));
  });
  const marks: Mark[] = pts.slice(1).map((p, i) => ({ kind: "segment", a: pts[i]!, b: p, accent: true }));
  if (arrow) {
    const end = pts[n]!;
    const s = Math.sign(span);
    // Back along the direction of travel, then turned ±35°.
    const back: Point = [Math.sin(rad(b)) * s, -Math.cos(rad(b)) * s];
    for (const w of [35, -35]) {
      const [c, si] = [Math.cos(rad(w)), Math.sin(rad(w))];
      const u: Point = [back[0] * c - back[1] * si, back[0] * si + back[1] * c];
      marks.push({ kind: "segment", a: end, b: [end[0] + 0.1 * u[0], end[1] + 0.1 * u[1]], accent: true });
    }
  }
  return marks;
}

/** angleFigure draws an angle of phi degrees in standard position, with its rotation and, optionally, the angle alpha between its terminal side and the axis at direction axis labeled. */
function angleFigure(phi: number, wedge?: { readonly axis: number; readonly text: string }): Mark[] {
  const end = mod(phi, 360);
  const marks: Mark[] = [...axes(1.4), { kind: "segment", a: O, b: on(end, 1.2), accent: true }, ...sweep(0, phi, 0.22, 0.08, true)];
  if (wedge) {
    const mid = (wedge.axis + end) / 2;
    marks.push(...sweep(wedge.axis, end, 0.75).map((m) => ({ ...m, accent: false })), {
      kind: "label",
      at: on(mid, 0.75),
      text: wedge.text,
      dir: dirOf(mid),
    });
  }
  return marks;
}

/** unitCircle draws the unit circle with the terminal side of an angle of phi degrees, its point P and the drop from P to the x-axis. */
function unitCircle(phi: number): Mark[] {
  const p = on(phi);
  return [
    { kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75)) },
    ...axes(1.35),
    { kind: "segment", a: O, b: p, accent: true },
    { kind: "segment", a: p, b: [p[0], 0], dashed: true },
    ...sweep(0, phi, 0.2, 0.08, true),
    { kind: "dot", at: p },
    { kind: "label", at: p, text: "P", dir: dirOf(phi), italic: true },
  ];
}

// --- Points with rational coordinates ----------------------------------------

/** triples are Pythagorean triples a² + b² = c². */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
] as const;

/** RationalPoint is a point (x, y) on the unit circle with rational coordinates, in a quadrant. */
interface RationalPoint {
  readonly x: Q;
  readonly y: Q;
  readonly quadrant: Quadrant;
  /** phi is the direction of the point in degrees, in [0, 360). */
  readonly phi: number;
}

/** randomPoint is a point with rational coordinates on the unit circle in one of the given quadrants. */
function randomPoint(rng: Rng, quadrants: readonly Quadrant[]): RationalPoint {
  const [a0, b0, c] = rng.pick(triples);
  const [a, b] = rng.bool() ? [a0, b0] : [b0, a0];
  const quadrant = rng.pick(quadrants);
  const x = q(quadrant === 1 || quadrant === 4 ? a : -a, c);
  const y = q(quadrant <= 2 ? b : -b, c);
  const phi = mod((Math.atan2(y.toNumber(), x.toNumber()) * 180) / Math.PI, 360);
  return { x, y, quadrant, phi };
}

/** pointTex writes a point with large parentheses: "\left(\frac{3}{5}, -\frac{4}{5}\right)". */
const pointTex = (x: Q, y: Q) => `\\left(${x.toLatex()}, ${y.toLatex()}\\right)`;

/** ratioOf is a ratio of the angle whose terminal side passes through a point on the unit circle. */
const ratioOf = (f: Fn, p: RationalPoint) => (f === "sin" ? p.y : f === "cos" ? p.x : p.y.div(p.x));

/** ratioLine writes the computation of a ratio from a point on the unit circle. */
function ratioLine(f: Fn, p: RationalPoint): string {
  if (f === "sin") return `\\sin \\theta = y = ${p.y.toLatex()}`;
  if (f === "cos") return `\\cos \\theta = x = ${p.x.toLatex()}`;
  return `\\tan \\theta = \\frac{y}{x} = \\frac{${p.y.toLatex()}}{${p.x.toLatex()}} = ${p.y.div(p.x).toLatex()}`;
}

/** pointRatioProblem asks for a ratio of the angle whose terminal side meets the unit circle at a point with rational coordinates. */
function pointRatioProblem(rng: Rng, quadrants: readonly Quadrant[]): Problem {
  const p = randomPoint(rng, quadrants);
  const f = rng.pick(fns);
  const answer = ratioOf(f, p);
  const swapped = f === "sin" ? p.x : f === "cos" ? p.y : p.x.div(p.y);
  return {
    ...numberProblem({
      prompt: t(
        `The terminal side of an angle $\\theta$ in standard position meets the unit circle at $P${pointTex(p.x, p.y)}$. Find $\\${f} \\theta$.`,
        `标准位置的角 $\\theta$ 的终边与单位圆交于 $P${pointTex(p.x, p.y)}$。求 $\\${f} \\theta$。`,
      ),
      answer,
      wrong: [swapped, answer.neg(), answer.abs(), Q.one.div(answer)],
      solution: t(
        `On the unit circle, $P = (\\cos \\theta, \\sin \\theta)$, and $\\tan \\theta = \\frac{y}{x}$:${steps(ratioLine(f, p))}`,
        `在单位圆上，$P = (\\cos \\theta, \\sin \\theta)$，且 $\\tan \\theta = \\frac{y}{x}$：${steps(ratioLine(f, p))}`,
      ),
    }),
    figure: figure(
      unitCircle(p.phi),
      `The unit circle with the terminal side of θ meeting it at P in ${quadrantName(p.quadrant).en}.`,
      `单位圆，θ 的终边与它交于${quadrantName(p.quadrant)["zh-CN"]}的点 P。`,
    ),
  };
}

// --- Exact values from one ratio ---------------------------------------------

/** S is an exact number c·√m with m square-free; m = 1 for a rational number. */
type S = readonly [Q, number];

const texS = (s: S) => radical(s[0], s[1]);
const negS = (s: S): S => [s[0].neg(), s[1]];

/** randomFraction is p/q in lowest terms with 0 < p < q ≤ 12. */
function randomFraction(rng: Rng): [number, number] {
  for (;;) {
    const d = rng.int(2, 12);
    const n = rng.int(1, d - 1);
    if (gcd(n, d) === 1) return [n, d];
  }
}

/** otherMagnitude is √(1 − (p/q)²) = √(q² − p²) / q in simplest radical form. */
function otherMagnitude(p: number, d: number): S {
  const [out, m] = simplifyRadical(d * d - p * p);
  return [q(out, d), m];
}

/** tanMagnitude is |tan θ| when |sin θ| (given "sin") or |cos θ| (given "cos") is p/q, rationalized; cot gives |cot θ|. */
function tanMagnitude(given: "sin" | "cos", p: number, d: number, cot = false): S {
  const [out, m] = simplifyRadical(d * d - p * p);
  // p / (out√m) = (p / (out·m))√m, and out√m / p.
  const small: S = [q(p, out * m), m];
  const large: S = [q(out, p), m];
  return (given === "sin") !== cot ? small : large;
}

/** sqrtLine writes the steps ±√(1 − (p/q)²) = ±√(q² − p²)/q = answer, with the sign s. */
function sqrtLine(p: number, d: number, s: 1 | -1 = 1): string {
  const m = s > 0 ? "" : "-";
  const v = otherMagnitude(p, d);
  return `${m}\\sqrt{1 - \\left(\\frac{${p}}{${d}}\\right)^2} = ${m}\\sqrt{\\frac{${d * d - p * p}}{${d * d}}} = ${texS(s > 0 ? v : negS(v))}`;
}

const degreeRanges: Record<Quadrant, string> = {
  1: "0^\\circ < \\theta < 90^\\circ",
  2: "90^\\circ < \\theta < 180^\\circ",
  3: "180^\\circ < \\theta < 270^\\circ",
  4: "270^\\circ < \\theta < 360^\\circ",
};

const radianRanges: Record<Quadrant, string> = {
  1: "0 < \\theta < \\frac{\\pi}{2}",
  2: "\\frac{\\pi}{2} < \\theta < \\pi",
  3: "\\pi < \\theta < \\frac{3\\pi}{2}",
  4: "\\frac{3\\pi}{2} < \\theta < 2\\pi",
};

/** rangeOf writes the range of a quadrant in degrees or radians. */
const rangeOf = (rng: Rng, n: Quadrant) => (rng.bool() ? degreeRanges : radianRanges)[n];

// ---------------------------------------------------------------------------
// Angles in the coordinate plane
// ---------------------------------------------------------------------------

const axisNames: Record<number, Text> = {
  0: t("the positive $x$-axis", "$x$ 轴正半轴"),
  90: t("the positive $y$-axis", "$y$ 轴正半轴"),
  180: t("the negative $x$-axis", "$x$ 轴负半轴"),
  270: t("the negative $y$-axis", "$y$ 轴负半轴"),
  360: t("the positive $x$-axis", "$x$ 轴正半轴"),
};

/** AxisAngle is a terminal side making the angle alpha with the axis at direction axis, at direction phi in [0, 360). */
interface AxisAngle {
  readonly axis: number;
  readonly alpha: number;
  readonly phi: number;
  /** after tells whether the terminal side lies counterclockwise from the axis. */
  readonly after: boolean;
}

/** randomAxisAngle is a terminal side in a random quadrant making an angle of 20° to 70° with one of the quadrant's axes. */
function randomAxisAngle(rng: Rng): AxisAngle {
  const n = rng.int(1, 4);
  const alpha = rng.int(20, 70);
  const after = rng.bool();
  const axis = after ? 90 * (n - 1) : 90 * n;
  return { axis, alpha, phi: after ? axis + alpha : axis - alpha, after };
}

/** axisAngleLine writes the direction of the terminal side: "180^\circ - 35^\circ = 145^\circ". */
const axisAngleLine = (a: AxisAngle) => `${a.axis}^\\circ ${a.after ? "+" : "-"} ${a.alpha}^\\circ = ${a.phi}^\\circ`;

/** quadrantChoice asks for the quadrant of the terminal side of an angle of d degrees. */
function quadrantChoice(d: number): Problem {
  const n = quadrantOfDeg(d);
  const m = mod(d, 360);
  const co =
    m === d
      ? t("", "")
      : t(
          `Adding $360^\\circ$ gives the same terminal side: $${d}^\\circ + 360^\\circ = ${m}^\\circ$. `,
          `加上 $360^\\circ$ 终边不变：$${d}^\\circ + 360^\\circ = ${m}^\\circ$。`,
        );
  const range = n === 0 ? undefined : degreeRanges[n].replace("\\theta", `${m}^\\circ`);
  return choiceProblem({
    prompt: t(
      `In which quadrant does the terminal side of an angle of $${d}^\\circ$ in standard position lie?`,
      `标准位置的 $${d}^\\circ$ 角的终边在哪个象限？`,
    ),
    options: quadrantOptions,
    correct: n === 0 ? 4 : n - 1,
    solution:
      n === 0
        ? t(
            `${co.en}The angle $${m}^\\circ$ is a multiple of $90^\\circ$, so its terminal side lies on an axis.`,
            `${co["zh-CN"]}$${m}^\\circ$ 是 $90^\\circ$ 的倍数，所以终边在坐标轴上。`,
          )
        : t(
            `${co.en}Since $${range}$, the terminal side lies in ${quadrantName(n).en}.`,
            `${co["zh-CN"]}因为 $${range}$，所以终边在${quadrantName(n)["zh-CN"]}。`,
          ),
  });
}

/** anglesInTheCoordinatePlane introduces angles in standard position, measured counterclockwise from the positive x-axis. */
export const anglesInTheCoordinatePlane: TopicDef = {
  id: "angles-in-the-coordinate-plane",
  title: t("Angles in the Coordinate Plane", "坐标平面中的角"),
  summary: t(
    "Place an angle in standard position, measured counterclockwise from the positive x-axis, and tell the quadrant of its terminal side.",
    "把角放在标准位置（从 x 轴正半轴逆时针度量），并判断其终边所在的象限。",
  ),
  prerequisites: ["the-coordinate-plane", "angles-and-angle-measures"],
  encompasses: [
    { topic: "the-coordinate-plane", weight: 0.2 },
    { topic: "angles-and-angle-measures", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "quadrants-of-angles",
      title: t("The quadrant of an angle", "角所在的象限"),
      explanation: t(
        "An angle is in **standard position** when its vertex is at the origin and its **initial side** lies along the positive $x$-axis. Rotating the other side, the **terminal side**, counterclockwise gives a positive angle. Every $90^\\circ$ of rotation passes one quadrant:\n\n| Angle | Terminal side |\n| :--- | :--- |\n| $0^\\circ < \\theta < 90^\\circ$ | Quadrant I |\n| $90^\\circ < \\theta < 180^\\circ$ | Quadrant II |\n| $180^\\circ < \\theta < 270^\\circ$ | Quadrant III |\n| $270^\\circ < \\theta < 360^\\circ$ | Quadrant IV |\n\nFor example, $200^\\circ$ is between $180^\\circ$ and $270^\\circ$, so its terminal side lies in Quadrant III. An angle that is a multiple of $90^\\circ$, such as $270^\\circ$, has its terminal side on an axis; it is called a **quadrantal angle**.",
        "顶点在原点、**始边**在 $x$ 轴正半轴上的角处于**标准位置**。另一条边叫**终边**，逆时针旋转得到正角。每旋转 $90^\\circ$ 经过一个象限：\n\n| 角 | 终边 |\n| :--- | :--- |\n| $0^\\circ < \\theta < 90^\\circ$ | 第一象限 |\n| $90^\\circ < \\theta < 180^\\circ$ | 第二象限 |\n| $180^\\circ < \\theta < 270^\\circ$ | 第三象限 |\n| $270^\\circ < \\theta < 360^\\circ$ | 第四象限 |\n\n例如 $200^\\circ$ 在 $180^\\circ$ 与 $270^\\circ$ 之间，所以终边在第三象限。$90^\\circ$ 的倍数（如 $270^\\circ$）的终边在坐标轴上，叫做**轴线角**。",
      ),
      generate(rng) {
        const d = rng.bool(0.12) ? 90 * rng.int(1, 3) : randomDegrees(rng, 1, 359);
        return quadrantChoice(d);
      },
    },
    {
      id: "angles-from-the-terminal-side",
      title: t("The angle from its terminal side", "由终边求角"),
      explanation: t(
        "To measure an angle in standard position, count the rotation from the positive $x$-axis. The axes are at $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$, so start from the nearest axis the rotation has passed.\n\nIf the terminal side lies in Quadrant II and makes a $35^\\circ$ angle with the negative $x$-axis, it stops $35^\\circ$ short of $180^\\circ$:\n\n$$\\theta = 180^\\circ - 35^\\circ = 145^\\circ.$$\n\nIf it lies in Quadrant III and makes $35^\\circ$ with the negative $x$-axis, it has gone $35^\\circ$ past it: $\\theta = 180^\\circ + 35^\\circ = 215^\\circ$.",
        "度量标准位置的角，就是数出从 $x$ 轴正半轴转过的角度。各坐标轴分别在 $0^\\circ$、$90^\\circ$、$180^\\circ$、$270^\\circ$，所以从最近的坐标轴算起。\n\n若终边在第二象限，与 $x$ 轴负半轴成 $35^\\circ$ 角，它比 $180^\\circ$ 少转了 $35^\\circ$：\n\n$$\\theta = 180^\\circ - 35^\\circ = 145^\\circ.$$\n\n若终边在第三象限，与 $x$ 轴负半轴成 $35^\\circ$ 角，它比 $180^\\circ$ 多转了 $35^\\circ$：$\\theta = 180^\\circ + 35^\\circ = 215^\\circ$。",
      ),
      generate(rng) {
        const a = randomAxisAngle(rng);
        const axis = axisNames[a.axis]!;
        const other = a.after ? a.axis - a.alpha : a.axis + a.alpha;
        return {
          ...numberProblem({
            prompt: t(
              `The terminal side of an angle $\\theta$ in standard position lies in ${quadrantName(quadrantOfDeg(a.phi) as Quadrant).en} and makes a $${a.alpha}^\\circ$ angle with ${axis.en}, as shown. Find $\\theta$, where $0^\\circ < \\theta < 360^\\circ$.`,
              `如图，标准位置的角 $\\theta$ 的终边在${quadrantName(quadrantOfDeg(a.phi) as Quadrant)["zh-CN"]}，与 ${axis["zh-CN"]}成 $${a.alpha}^\\circ$ 角。求 $\\theta$（$0^\\circ < \\theta < 360^\\circ$）。`,
            ),
            answer: a.phi,
            form: "integer",
            unit: "°",
            wrong: [mod(other, 360), a.alpha, 360 - a.phi, 90 - a.alpha],
            solution: t(
              `${axis.en[0]!.toUpperCase()}${axis.en.slice(1)} is at $${a.axis}^\\circ$, and the terminal side is $${a.alpha}^\\circ$ ${a.after ? "past it" : "short of it"}:${steps(axisAngleLine(a))}`,
              `${axis["zh-CN"]}在 $${a.axis}^\\circ$，终边比它${a.after ? "多" : "少"}转 $${a.alpha}^\\circ$：${steps(axisAngleLine(a))}`,
            ),
          }),
          figure: figure(
            angleFigure(a.phi, { axis: a.axis, text: `${a.alpha}°` }),
            `An angle in standard position whose terminal side makes ${a.alpha}° with ${axis.en.replace(/\$/g, "")}.`,
            `标准位置的角，终边与${axis["zh-CN"].replace(/\$/g, "")}成 ${a.alpha}°。`,
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Negative angles in the coordinate plane
// ---------------------------------------------------------------------------

/** negativeAnglesInTheCoordinatePlane measures angles clockwise from the positive x-axis as negative angles. */
export const negativeAnglesInTheCoordinatePlane: TopicDef = {
  id: "negative-angles-in-the-coordinate-plane",
  title: t("Negative Angles in the Coordinate Plane", "坐标平面中的负角"),
  summary: t(
    "Measure angles clockwise from the positive x-axis as negative angles, tell their quadrants, and switch between negative and positive measures of the same terminal side.",
    "把从 x 轴正半轴顺时针度量的角看作负角，判断其象限，并在同一终边的负角与正角之间转换。",
  ),
  prerequisites: ["angles-in-the-coordinate-plane"],
  encompasses: [{ topic: "angles-in-the-coordinate-plane", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "quadrants-of-negative-angles",
      title: t("The quadrant of a negative angle", "负角所在的象限"),
      explanation: t(
        "A **negative angle** rotates the terminal side **clockwise** from the positive $x$-axis. Going clockwise, the quadrants come in the order IV, III, II, I:\n\n| Angle | Terminal side |\n| :--- | :--- |\n| $-90^\\circ < \\theta < 0^\\circ$ | Quadrant IV |\n| $-180^\\circ < \\theta < -90^\\circ$ | Quadrant III |\n| $-270^\\circ < \\theta < -180^\\circ$ | Quadrant II |\n| $-360^\\circ < \\theta < -270^\\circ$ | Quadrant I |\n\nFor example, $-130^\\circ$ is between $-180^\\circ$ and $-90^\\circ$, so its terminal side lies in Quadrant III. Equivalently, a full turn added to $-130^\\circ$ gives $230^\\circ$, which is in Quadrant III.",
        "**负角**让终边从 $x$ 轴正半轴**顺时针**旋转。顺时针转时，依次经过第四、三、二、一象限：\n\n| 角 | 终边 |\n| :--- | :--- |\n| $-90^\\circ < \\theta < 0^\\circ$ | 第四象限 |\n| $-180^\\circ < \\theta < -90^\\circ$ | 第三象限 |\n| $-270^\\circ < \\theta < -180^\\circ$ | 第二象限 |\n| $-360^\\circ < \\theta < -270^\\circ$ | 第一象限 |\n\n例如 $-130^\\circ$ 在 $-180^\\circ$ 与 $-90^\\circ$ 之间，所以终边在第三象限。也可以给 $-130^\\circ$ 加上一整圈得到 $230^\\circ$，它在第三象限。",
      ),
      generate(rng) {
        const d = rng.bool(0.12) ? -90 * rng.int(1, 3) : randomDegrees(rng, -359, -1);
        return quadrantChoice(d);
      },
    },
    {
      id: "negative-angles-from-the-terminal-side",
      title: t("The negative angle from its terminal side", "由终边求负角"),
      explanation: t(
        "To give a terminal side as a negative angle, count the clockwise rotation from the positive $x$-axis. Clockwise, the axes come at $0^\\circ$, $-90^\\circ$, $-180^\\circ$ and $-270^\\circ$.\n\nIf the terminal side lies in Quadrant III and makes a $40^\\circ$ angle with the negative $y$-axis, the clockwise rotation passes $-90^\\circ$ and goes $40^\\circ$ further:\n\n$$\\theta = -90^\\circ - 40^\\circ = -130^\\circ.$$\n\nThe same terminal side measured counterclockwise is $270^\\circ - 40^\\circ = 230^\\circ$, and indeed $230^\\circ - 360^\\circ = -130^\\circ$.",
        "把终边写成负角，就是数出从 $x$ 轴正半轴顺时针转过的角度。顺时针方向上，各坐标轴依次在 $0^\\circ$、$-90^\\circ$、$-180^\\circ$、$-270^\\circ$。\n\n若终边在第三象限，与 $y$ 轴负半轴成 $40^\\circ$ 角，顺时针旋转经过 $-90^\\circ$ 后再转 $40^\\circ$：\n\n$$\\theta = -90^\\circ - 40^\\circ = -130^\\circ.$$\n\n同一条终边逆时针度量是 $270^\\circ - 40^\\circ = 230^\\circ$，而 $230^\\circ - 360^\\circ = -130^\\circ$，两者一致。",
      ),
      generate(rng) {
        const a = randomAxisAngle(rng);
        const axis = axisNames[a.axis]!;
        const answer = a.phi - 360;
        const cw = a.axis - 360;
        const line = `${cw}^\\circ ${a.after ? "+" : "-"} ${a.alpha}^\\circ = ${answer}^\\circ`;
        return {
          ...numberProblem({
            prompt: t(
              `The terminal side of an angle $\\theta$ in standard position lies in ${quadrantName(quadrantOfDeg(a.phi) as Quadrant).en} and makes a $${a.alpha}^\\circ$ angle with ${axis.en}, as shown. Find $\\theta$, where $-360^\\circ < \\theta < 0^\\circ$.`,
              `如图，标准位置的角 $\\theta$ 的终边在${quadrantName(quadrantOfDeg(a.phi) as Quadrant)["zh-CN"]}，与 ${axis["zh-CN"]}成 $${a.alpha}^\\circ$ 角。求 $\\theta$（$-360^\\circ < \\theta < 0^\\circ$）。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [a.phi, -a.phi, -a.alpha, answer + (a.after ? -2 : 2) * a.alpha],
            solution: t(
              `Clockwise, ${axis.en} is at $${cw}^\\circ$, and the terminal side is $${a.alpha}^\\circ$ ${a.after ? "short of it" : "past it"}:${steps(line)}`,
              `顺时针度量时，${axis["zh-CN"]}在 $${cw}^\\circ$，终边比它${a.after ? "少" : "多"}转 $${a.alpha}^\\circ$：${steps(line)}`,
            ),
          }),
          figure: figure(
            angleFigure(answer, { axis: a.axis, text: `${a.alpha}°` }),
            `A negative angle in standard position, rotating clockwise, whose terminal side makes ${a.alpha}° with ${axis.en.replace(/\$/g, "")}.`,
            `标准位置的负角（顺时针旋转），终边与${axis["zh-CN"].replace(/\$/g, "")}成 ${a.alpha}°。`,
          ),
        };
      },
    },
    {
      id: "negative-and-positive-measures",
      title: t("Negative and positive measures of one terminal side", "同一终边的负角与正角"),
      explanation: t(
        "A terminal side reached by a counterclockwise rotation of $\\theta$ (with $0^\\circ < \\theta < 360^\\circ$) is also reached clockwise, by the rest of the full turn. So the same terminal side is described by\n\n$$\\theta \\quad \\text{and} \\quad \\theta - 360^\\circ.$$\n\nFor example, $300^\\circ$ and $300^\\circ - 360^\\circ = -60^\\circ$ have the same terminal side. Going the other way, $-110^\\circ$ and $-110^\\circ + 360^\\circ = 250^\\circ$ have the same terminal side.",
        "逆时针旋转 $\\theta$（$0^\\circ < \\theta < 360^\\circ$）得到的终边，也可以顺时针旋转一整圈剩下的部分得到。所以同一条终边可以写成\n\n$$\\theta \\quad \\text{和} \\quad \\theta - 360^\\circ.$$\n\n例如 $300^\\circ$ 与 $300^\\circ - 360^\\circ = -60^\\circ$ 的终边相同。反过来，$-110^\\circ$ 与 $-110^\\circ + 360^\\circ = 250^\\circ$ 的终边相同。",
      ),
      generate(rng) {
        const d = rng.int(1, 359);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Find the negative angle between $-360^\\circ$ and $0^\\circ$ with the same terminal side as $${d}^\\circ$.`,
              `求 $-360^\\circ$ 与 $0^\\circ$ 之间与 $${d}^\\circ$ 终边相同的负角。`,
            ),
            answer: d - 360,
            form: "integer",
            unit: "°",
            wrong: [-d, 360 - d, d - 180],
            solution: t(
              `Going clockwise instead takes the rest of the full turn, so subtract $360^\\circ$:${steps(`${d}^\\circ - 360^\\circ = ${d - 360}^\\circ`)}`,
              `改为顺时针旋转，要转一整圈剩下的部分，所以减去 $360^\\circ$：${steps(`${d}^\\circ - 360^\\circ = ${d - 360}^\\circ`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Find the positive angle between $0^\\circ$ and $360^\\circ$ with the same terminal side as $${-d}^\\circ$.`,
            `求 $0^\\circ$ 与 $360^\\circ$ 之间与 $${-d}^\\circ$ 终边相同的正角。`,
          ),
          answer: 360 - d,
          form: "integer",
          unit: "°",
          wrong: [d, d - 360, 180 - d],
          solution: t(
            `Going counterclockwise instead takes the rest of the full turn, so add $360^\\circ$:${steps(`${-d}^\\circ + 360^\\circ = ${360 - d}^\\circ`)}`,
            `改为逆时针旋转，要转一整圈剩下的部分，所以加上 $360^\\circ$：${steps(`${-d}^\\circ + 360^\\circ = ${360 - d}^\\circ`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Coterminal angles
// ---------------------------------------------------------------------------

/** coterminalAngles finds angles with the same terminal side by adding or subtracting full turns, in degrees and radians. */
export const coterminalAngles: TopicDef = {
  id: "coterminal-angles",
  title: t("Coterminal Angles", "终边相同的角"),
  summary: t(
    "Find coterminal angles by adding or subtracting full turns of 360° or 2π, and tell whether two angles are coterminal.",
    "通过加减整圈 360° 或 2π 求终边相同的角，并判断两个角的终边是否相同。",
  ),
  prerequisites: ["negative-angles-in-the-coordinate-plane", "introduction-to-radians"],
  encompasses: [
    { topic: "negative-angles-in-the-coordinate-plane", weight: 0.5 },
    { topic: "introduction-to-radians", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "coterminal-angles-in-degrees",
      title: t("Coterminal angles in degrees", "角度制下终边相同的角"),
      explanation: t(
        "Angles in standard position with the same terminal side are **coterminal**. A full turn of $360^\\circ$ brings the terminal side back to where it was, so the angles coterminal with $\\theta$ are\n\n$$\\theta + 360^\\circ k \\quad \\text{for any integer } k.$$\n\nAn angle may rotate more than once: $850^\\circ$ is two full turns and $130^\\circ$ more. To find the coterminal angle between $0^\\circ$ and $360^\\circ$, subtract (or add) $360^\\circ$ as many times as needed:\n\n$$850^\\circ - 2 \\cdot 360^\\circ = 130^\\circ, \\qquad -500^\\circ + 2 \\cdot 360^\\circ = 220^\\circ.$$",
        "处于标准位置且终边相同的角叫做**终边相同的角**。转一整圈 $360^\\circ$ 终边回到原处，所以与 $\\theta$ 终边相同的角是\n\n$$\\theta + 360^\\circ k \\quad (k \\text{ 为任意整数}).$$\n\n角可以转不止一圈：$850^\\circ$ 是转两整圈后再转 $130^\\circ$。要求 $0^\\circ$ 到 $360^\\circ$ 之间与它终边相同的角，就按需要多次减去（或加上）$360^\\circ$：\n\n$$850^\\circ - 2 \\cdot 360^\\circ = 130^\\circ, \\qquad -500^\\circ + 2 \\cdot 360^\\circ = 220^\\circ.$$",
      ),
      generate(rng) {
        let d = 0;
        while (mod(d, 360) === 0 || (d >= 0 && d < 360)) d = rng.int(-1080, 1080);
        const m = mod(d, 360);
        const turns = (d - m) / 360;
        const line = `${d}^\\circ ${turns > 0 ? "-" : "+"} ${turnsTex(Math.abs(turns), "360^\\circ")} = ${m}^\\circ`;
        return numberProblem({
          prompt: t(
            `Find the angle between $0^\\circ$ and $360^\\circ$ that is coterminal with $${d}^\\circ$.`,
            `求 $0^\\circ$ 与 $360^\\circ$ 之间与 $${d}^\\circ$ 终边相同的角。`,
          ),
          answer: m,
          form: "integer",
          unit: "°",
          wrong: [mod(-d, 360), 360 - m, d > 0 ? d - 360 : d + 360, Math.abs(d) % 360],
          solution: t(
            `${turns > 0 ? "Subtract" : "Add"} $360^\\circ$ until the angle is between $0^\\circ$ and $360^\\circ$:${steps(line)}`,
            `${turns > 0 ? "减去" : "加上"} $360^\\circ$，直到角在 $0^\\circ$ 与 $360^\\circ$ 之间：${steps(line)}`,
          ),
        });
      },
    },
    {
      id: "coterminal-angles-in-radians",
      title: t("Coterminal angles in radians", "弧度制下终边相同的角"),
      explanation: t(
        "In radians a full turn is $2\\pi$, so the angles coterminal with $\\theta$ are $\\theta + 2\\pi k$. Write $2\\pi$ with the same denominator as the angle before adding or subtracting.\n\nFor $\\frac{17\\pi}{6}$: $2\\pi = \\frac{12\\pi}{6}$, so\n\n$$\\frac{17\\pi}{6} - \\frac{12\\pi}{6} = \\frac{5\\pi}{6},$$\n\nwhich is between $0$ and $2\\pi$. For $-\\frac{3\\pi}{4}$: $-\\frac{3\\pi}{4} + \\frac{8\\pi}{4} = \\frac{5\\pi}{4}$.",
        "用弧度表示时一整圈是 $2\\pi$，所以与 $\\theta$ 终边相同的角是 $\\theta + 2\\pi k$。加减之前先把 $2\\pi$ 写成与角同分母的形式。\n\n对 $\\frac{17\\pi}{6}$：$2\\pi = \\frac{12\\pi}{6}$，所以\n\n$$\\frac{17\\pi}{6} - \\frac{12\\pi}{6} = \\frac{5\\pi}{6},$$\n\n它在 $0$ 与 $2\\pi$ 之间。对 $-\\frac{3\\pi}{4}$：$-\\frac{3\\pi}{4} + \\frac{8\\pi}{4} = \\frac{5\\pi}{4}$。",
      ),
      generate(rng) {
        let k = 0;
        let n = 2;
        while (k >= 0 && k < 2 * n) [k, n] = randomPi(rng, -4, 6);
        const m = mod(k, 2 * n);
        const turns = (k - m) / (2 * n);
        const answer = piTex(q(m, n));
        const full = `\\frac{${2 * n * Math.abs(turns)}\\pi}{${n}}`;
        const line = `${piTex(q(k, n))} ${turns > 0 ? "-" : "+"} ${full} = ${answer}`;
        return piProblem(
          t(
            `Find the angle between $0$ and $2\\pi$ that is coterminal with $${piTex(q(k, n))}$.${PI_EN}`,
            `求 $0$ 与 $2\\pi$ 之间与 $${piTex(q(k, n))}$ 终边相同的角。${PI_ZH}`,
          ),
          answer,
          t(
            `${turns > 0 ? "Subtract" : "Add"} ${Math.abs(turns) === 1 ? "$2\\pi$" : `$${Math.abs(turns)}$ full turns, $${piTex(2 * Math.abs(turns))}$`}, written over $${n}$:${steps(line)}`,
            `${turns > 0 ? "减去" : "加上"}${Math.abs(turns) === 1 ? " $2\\pi$" : ` $${Math.abs(turns)}$ 整圈即 $${piTex(2 * Math.abs(turns))}$`}，写成分母为 $${n}$ 的形式：${steps(line)}`,
          ),
          [piTex(q(mod(-k, 2 * n), n)), piTex(q(k > 0 ? k - 2 * n : k + 2 * n, n)), piTex(q(mod(m + n, 2 * n), n))],
        );
      },
    },
    {
      id: "testing-for-coterminal-angles",
      title: t("Are two angles coterminal?", "两个角的终边是否相同"),
      explanation: t(
        "Two angles are coterminal exactly when they differ by a whole number of full turns. Subtract them and check whether the difference is a multiple of $360^\\circ$:\n\n- $-250^\\circ$ and $830^\\circ$: $830^\\circ - (-250^\\circ) = 1080^\\circ = 3 \\cdot 360^\\circ$, so they are coterminal.\n- $100^\\circ$ and $460^\\circ$: $460^\\circ - 100^\\circ = 360^\\circ$, so they are coterminal.\n- $45^\\circ$ and $225^\\circ$: the difference is $180^\\circ$, half a turn, so their terminal sides point in opposite directions and they are not coterminal.",
        "两个角终边相同，当且仅当它们相差整数圈。把两个角相减，看差是否为 $360^\\circ$ 的倍数：\n\n- $-250^\\circ$ 与 $830^\\circ$：$830^\\circ - (-250^\\circ) = 1080^\\circ = 3 \\cdot 360^\\circ$，终边相同。\n- $100^\\circ$ 与 $460^\\circ$：$460^\\circ - 100^\\circ = 360^\\circ$，终边相同。\n- $45^\\circ$ 与 $225^\\circ$：差为 $180^\\circ$，即半圈，终边方向相反，终边不同。",
      ),
      generate(rng) {
        const a = rng.int(-720, 720);
        const kind = rng.int(0, 2);
        const j = rng.nonZero(-3, 3);
        const diff =
          kind === 0 ? 360 * j : kind === 1 ? 180 * (2 * j + (j > 0 ? -1 : 1)) : 360 * j + rng.pick([-90, 90, -60, 60, 30, -30, 120, -120]);
        const b = a + diff;
        const yes = diff % 360 === 0;
        const line = `${b}^\\circ - ${a < 0 ? `(${a}^\\circ)` : `${a}^\\circ`} = ${diff}^\\circ`;
        return choiceProblem({
          prompt: t(`Are the angles $${a}^\\circ$ and $${b}^\\circ$ coterminal?`, `角 $${a}^\\circ$ 与 $${b}^\\circ$ 的终边相同吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `Find the difference:${steps(line)}This is $${diff / 360}$ full turn${Math.abs(diff / 360) === 1 ? "" : "s"} of $360^\\circ$, so the angles are coterminal.`,
                `求两角之差：${steps(line)}这是 $${diff / 360}$ 个 $360^\\circ$，所以两角终边相同。`,
              )
            : t(
                `Find the difference:${steps(line)}This is not a multiple of $360^\\circ$, so the angles are not coterminal.`,
                `求两角之差：${steps(line)}它不是 $360^\\circ$ 的倍数，所以两角终边不同。`,
              ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Reference angles
// ---------------------------------------------------------------------------

const referenceTable = t(
  "| Terminal side | Reference angle (degrees) | Reference angle (radians) |\n| :--- | :--- | :--- |\n| Quadrant I | $\\theta$ | $\\theta$ |\n| Quadrant II | $180^\\circ - \\theta$ | $\\pi - \\theta$ |\n| Quadrant III | $\\theta - 180^\\circ$ | $\\theta - \\pi$ |\n| Quadrant IV | $360^\\circ - \\theta$ | $2\\pi - \\theta$ |",
  "| 终边 | 参考角（角度） | 参考角（弧度） |\n| :--- | :--- | :--- |\n| 第一象限 | $\\theta$ | $\\theta$ |\n| 第二象限 | $180^\\circ - \\theta$ | $\\pi - \\theta$ |\n| 第三象限 | $\\theta - 180^\\circ$ | $\\theta - \\pi$ |\n| 第四象限 | $360^\\circ - \\theta$ | $2\\pi - \\theta$ |",
);

/** calculatingReferenceAngles finds the acute angle between a terminal side and the x-axis. */
export const calculatingReferenceAngles: TopicDef = {
  id: "calculating-reference-angles",
  title: t("Calculating Reference Angles", "计算参考角"),
  summary: t(
    "Find the reference angle of an angle in degrees or radians: the acute angle between its terminal side and the x-axis.",
    "求角度制或弧度制角的参考角，即其终边与 x 轴所成的锐角。",
  ),
  prerequisites: ["coterminal-angles"],
  encompasses: [{ topic: "coterminal-angles", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "reference-angles-in-degrees",
      title: t("Reference angles in degrees", "角度制下的参考角"),
      explanation: t(
        `The **reference angle** of an angle in standard position is the acute angle between its terminal side and the $x$-axis, the nearer half of it. It depends on the quadrant, for $0^\\circ < \\theta < 360^\\circ$:\n\n${referenceTable.en}\n\nFor example, $230^\\circ$ is in Quadrant III, $50^\\circ$ past the negative $x$-axis, so its reference angle is $230^\\circ - 180^\\circ = 50^\\circ$. And $300^\\circ$ is in Quadrant IV, so its reference angle is $360^\\circ - 300^\\circ = 60^\\circ$.`,
        `标准位置的角的**参考角**是它的终边与 $x$ 轴（较近的半轴）所成的锐角。对 $0^\\circ < \\theta < 360^\\circ$，按象限计算：\n\n${referenceTable["zh-CN"]}\n\n例如 $230^\\circ$ 在第三象限，比 $x$ 轴负半轴多转 $50^\\circ$，所以参考角是 $230^\\circ - 180^\\circ = 50^\\circ$。$300^\\circ$ 在第四象限，参考角是 $360^\\circ - 300^\\circ = 60^\\circ$。`,
      ),
      generate(rng) {
        const m = randomDegrees(rng, 1, 359);
        const a = degInfo(m);
        return numberProblem({
          prompt: t(`Find the reference angle of $${a.tex}$.`, `求 $${a.tex}$ 的参考角。`),
          answer: a.ref,
          form: "integer",
          unit: "°",
          wrong: [Math.abs(180 - m), 360 - m, m, Math.abs(90 - m)],
          solution: locate(a),
        });
      },
    },
    {
      id: "reference-angles-of-negative-and-large-angles",
      title: t("Reference angles of negative and large angles", "负角与大角的参考角"),
      explanation: t(
        "For an angle outside $0^\\circ$ to $360^\\circ$, first find the coterminal angle in that range; it has the same terminal side, so the same reference angle.\n\nFor $-140^\\circ$: $-140^\\circ + 360^\\circ = 220^\\circ$, in Quadrant III, so the reference angle is $220^\\circ - 180^\\circ = 40^\\circ$. For $835^\\circ$: $835^\\circ - 2 \\cdot 360^\\circ = 115^\\circ$, in Quadrant II, so the reference angle is $180^\\circ - 115^\\circ = 65^\\circ$.",
        "对于不在 $0^\\circ$ 到 $360^\\circ$ 之间的角，先求这个范围内与它终边相同的角；终边相同，参考角也相同。\n\n对 $-140^\\circ$：$-140^\\circ + 360^\\circ = 220^\\circ$，在第三象限，参考角是 $220^\\circ - 180^\\circ = 40^\\circ$。对 $835^\\circ$：$835^\\circ - 2 \\cdot 360^\\circ = 115^\\circ$，在第二象限，参考角是 $180^\\circ - 115^\\circ = 65^\\circ$。",
      ),
      generate(rng) {
        const d = rng.bool() ? randomDegrees(rng, -720, -1) : randomDegrees(rng, 361, 1080);
        const a = degInfo(d);
        const m = mod(d, 360);
        return numberProblem({
          prompt: t(`Find the reference angle of $${a.tex}$.`, `求 $${a.tex}$ 的参考角。`),
          answer: a.ref,
          form: "integer",
          unit: "°",
          wrong: [m, 180 - a.ref, 360 - m, Math.abs(d) % 180],
          solution: locate(a),
        });
      },
    },
    {
      id: "reference-angles-in-radians",
      title: t("Reference angles in radians", "弧度制下的参考角"),
      explanation: t(
        "In radians the axes are at $0$, $\\frac{\\pi}{2}$, $\\pi$, $\\frac{3\\pi}{2}$ and $2\\pi$, and the reference angle is found the same way, with $\\pi$ for $180^\\circ$ and $2\\pi$ for $360^\\circ$.\n\nFor $\\frac{7\\pi}{6}$: it is more than $\\pi = \\frac{6\\pi}{6}$ and less than $\\frac{3\\pi}{2} = \\frac{9\\pi}{6}$, so it is in Quadrant III, and its reference angle is $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$. For $\\frac{5\\pi}{3}$, in Quadrant IV, it is $2\\pi - \\frac{5\\pi}{3} = \\frac{\\pi}{3}$.",
        "用弧度表示时，各坐标轴在 $0$、$\\frac{\\pi}{2}$、$\\pi$、$\\frac{3\\pi}{2}$、$2\\pi$，参考角的求法相同，只是用 $\\pi$ 代替 $180^\\circ$，用 $2\\pi$ 代替 $360^\\circ$。\n\n对 $\\frac{7\\pi}{6}$：它大于 $\\pi = \\frac{6\\pi}{6}$、小于 $\\frac{3\\pi}{2} = \\frac{9\\pi}{6}$，在第三象限，参考角是 $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$。$\\frac{5\\pi}{3}$ 在第四象限，参考角是 $2\\pi - \\frac{5\\pi}{3} = \\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const [k, n] = randomPi(rng, 0, 2);
        const a = piInfo(k, n);
        const r = Math.round((a.ref * n) / 180);
        return piProblem(t(`Find the reference angle of $${a.tex}$.${PI_EN}`, `求 $${a.tex}$ 的参考角。${PI_ZH}`), a.refTex, locate(a), [
          a.tex,
          piTex(q(n - r, n)),
          piTex(q(2 * n - k, n)),
          `${a.ref}`,
        ]);
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The unit circle in the first quadrant
// ---------------------------------------------------------------------------

/** propertiesOfTheUnitCircleInTheFirstQuadrant shows that the point at an acute angle on the unit circle is (cos θ, sin θ). */
export const propertiesOfTheUnitCircleInTheFirstQuadrant: TopicDef = {
  id: "properties-of-the-unit-circle-in-the-first-quadrant",
  title: t("Properties of the Unit Circle in the First Quadrant", "第一象限中单位圆的性质"),
  summary: t(
    "See that the terminal side of an acute angle θ meets the unit circle at (cos θ, sin θ), and find coordinates and ratios from it.",
    "认识锐角 θ 的终边与单位圆交于 (cos θ, sin θ)，并由此求坐标与三角比。",
  ),
  prerequisites: ["angles-in-the-coordinate-plane", "special-trigonometric-ratios", "equations-of-circles-centered-at-the-origin"],
  encompasses: [
    { topic: "special-trigonometric-ratios", weight: 0.2 },
    { topic: "equations-of-circles-centered-at-the-origin", weight: 0.2 },
    { topic: "angles-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "coordinates-on-the-unit-circle",
      title: t("Coordinates from the angle", "由角求坐标"),
      explanation: t(
        "The **unit circle** is the circle of radius $1$ centered at the origin, $x^2 + y^2 = 1$. Let the terminal side of an acute angle $\\theta$ meet it at $P(x, y)$. Dropping a perpendicular from $P$ to the $x$-axis makes a right triangle with hypotenuse $OP = 1$, legs $x$ and $y$, and the angle $\\theta$ at $O$. So\n\n$$\\cos \\theta = \\frac{x}{1} = x, \\qquad \\sin \\theta = \\frac{y}{1} = y,$$\n\nthat is, $P = (\\cos \\theta, \\sin \\theta)$. For example, at $\\theta = 25^\\circ$, a calculator in degree mode gives $P \\approx (0.91, 0.42)$, since $\\cos 25^\\circ \\approx 0.9063$ and $\\sin 25^\\circ \\approx 0.4226$.",
        "**单位圆**是圆心在原点、半径为 $1$ 的圆，$x^2 + y^2 = 1$。设锐角 $\\theta$ 的终边与它交于 $P(x, y)$。从 $P$ 向 $x$ 轴作垂线，得到一个直角三角形：斜边 $OP = 1$，两直角边为 $x$ 和 $y$，$O$ 处的角为 $\\theta$。所以\n\n$$\\cos \\theta = \\frac{x}{1} = x, \\qquad \\sin \\theta = \\frac{y}{1} = y,$$\n\n即 $P = (\\cos \\theta, \\sin \\theta)$。例如 $\\theta = 25^\\circ$ 时，计算器（角度模式）给出 $\\cos 25^\\circ \\approx 0.9063$、$\\sin 25^\\circ \\approx 0.4226$，所以 $P \\approx (0.91, 0.42)$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(5, 85);
          const f: Fn = rng.pick(["sin", "cos"] as const);
          const v = trig(f, rad(d));
          if (nearBoundary(v, 2)) continue;
          const coord = f === "cos" ? "x" : "y";
          const answer = roundQ(v, 2);
          return {
            ...numberProblem({
              prompt: t(
                `The terminal side of an angle of $${d}^\\circ$ in standard position meets the unit circle at $P$. Find the $${coord}$-coordinate of $P$, rounded to the nearest hundredth.`,
                `标准位置的 $${d}^\\circ$ 角的终边与单位圆交于 $P$。求 $P$ 的 $${coord}$ 坐标，结果精确到百分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [roundQ(trig(f === "sin" ? "cos" : "sin", rad(d)), 2), roundQ(trig(f, d), 2), roundQ(trig("tan", rad(d)), 2)],
              solution: t(
                `On the unit circle, $P = (\\cos ${d}^\\circ, \\sin ${d}^\\circ)$, so its $${coord}$-coordinate is${steps(`\\${f} ${d}^\\circ \\approx ${dec(answer)}`)}`,
                `在单位圆上，$P = (\\cos ${d}^\\circ, \\sin ${d}^\\circ)$，所以它的 $${coord}$ 坐标是${steps(`\\${f} ${d}^\\circ \\approx ${dec(answer)}`)}`,
              ),
            }),
            figure: figure(
              unitCircle(d),
              `The unit circle with the terminal side of a ${d}° angle meeting it at P.`,
              `单位圆，${d}° 角的终边与它交于 P。`,
            ),
          };
        }
      },
    },
    {
      id: "ratios-from-a-point-in-the-first-quadrant",
      title: t("Ratios from a point on the unit circle", "由单位圆上的点求三角比"),
      explanation: t(
        "Read the ratios off the point: if the terminal side of $\\theta$ meets the unit circle at $P(x, y)$, then $\\cos \\theta = x$, $\\sin \\theta = y$, and\n\n$$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{y}{x}.$$\n\nFor $P\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$: $\\cos \\theta = \\frac{5}{13}$, $\\sin \\theta = \\frac{12}{13}$ and $\\tan \\theta = \\frac{12}{13} \\div \\frac{5}{13} = \\frac{12}{5}$.",
        "直接从点读出三角比：若 $\\theta$ 的终边与单位圆交于 $P(x, y)$，则 $\\cos \\theta = x$，$\\sin \\theta = y$，且\n\n$$\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}} = \\frac{y}{x}.$$\n\n对 $P\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$：$\\cos \\theta = \\frac{5}{13}$，$\\sin \\theta = \\frac{12}{13}$，$\\tan \\theta = \\frac{12}{13} \\div \\frac{5}{13} = \\frac{12}{5}$。",
      ),
      generate: (rng) => pointRatioProblem(rng, [1]),
    },
    {
      id: "the-missing-coordinate",
      title: t("The missing coordinate", "求另一个坐标"),
      explanation: t(
        "A point on the unit circle satisfies $x^2 + y^2 = 1$, so one coordinate gives the other. In the first quadrant both are positive.\n\nIf $P$ is in the first quadrant with $x = \\frac{1}{3}$, then\n\n$$y = \\sqrt{1 - \\left(\\frac{1}{3}\\right)^2} = \\sqrt{\\frac{8}{9}} = \\frac{2\\sqrt{2}}{3}.$$",
        "单位圆上的点满足 $x^2 + y^2 = 1$，所以由一个坐标可以求出另一个。在第一象限两者都是正的。\n\n若 $P$ 在第一象限且 $x = \\frac{1}{3}$，则\n\n$$y = \\sqrt{1 - \\left(\\frac{1}{3}\\right)^2} = \\sqrt{\\frac{8}{9}} = \\frac{2\\sqrt{2}}{3}.$$",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const givenX = rng.bool();
        const [known, ask] = givenX ? ["x", "y"] : ["y", "x"];
        const answer = otherMagnitude(p, d);
        const phi = (Math.acos(p / d) * 180) / Math.PI;
        const [out, m] = simplifyRadical(d * d - p * p);
        return {
          ...radicalProblem({
            prompt: t(
              `The point $P$ lies on the unit circle in the first quadrant, and its $${known}$-coordinate is $\\frac{${p}}{${d}}$. Find its $${ask}$-coordinate exactly, in simplest radical form.`,
              `点 $P$ 在单位圆上且位于第一象限，它的 $${known}$ 坐标是 $\\frac{${p}}{${d}}$。求它的 $${ask}$ 坐标的精确值，答案写成最简根式。`,
            ),
            answer,
            wrong: [q(d - p, d).toLatex(), q(d * d - p * p, d * d).toLatex(), radical(out, m)],
            solution: t(
              `Use $x^2 + y^2 = 1$ and take the positive root, since $P$ is in the first quadrant:${steps(`${ask} = ${sqrtLine(p, d)}`)}`,
              `用 $x^2 + y^2 = 1$，因为 $P$ 在第一象限，取正的平方根：${steps(`${ask} = ${sqrtLine(p, d)}`)}`,
            ),
          }),
          figure: figure(
            unitCircle(givenX ? phi : 90 - phi),
            "The unit circle with a point P in the first quadrant.",
            "单位圆，点 P 在第一象限。",
          ),
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Extending the ratios with the unit circle
// ---------------------------------------------------------------------------

/** families group each ratio with its reciprocal, which has the same sign. */
const families = [
  ["sin", "csc"],
  ["cos", "sec"],
  ["tan", "cot"],
] as const;

/** extendingTheTrigonometricRatiosUsingTheUnitCircle defines the ratios of any angle by the point where its terminal side meets the unit circle. */
export const extendingTheTrigonometricRatiosUsingTheUnitCircle: TopicDef = {
  id: "extending-the-trigonometric-ratios-using-the-unit-circle",
  title: t("Extending the Trigonometric Ratios Using the Unit Circle", "用单位圆推广三角比"),
  summary: t(
    "Define sin θ, cos θ and tan θ for any angle from the point where its terminal side meets the unit circle, find their signs by quadrant, and find them from the reference angle.",
    "由终边与单位圆的交点定义任意角的 sin θ、cos θ、tan θ，按象限判断它们的符号，并由参考角求值。",
  ),
  prerequisites: ["properties-of-the-unit-circle-in-the-first-quadrant", "calculating-reference-angles"],
  encompasses: [
    { topic: "properties-of-the-unit-circle-in-the-first-quadrant", weight: 0.5 },
    { topic: "calculating-reference-angles", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "ratios-from-a-point-in-any-quadrant",
      title: t("Ratios from a point in any quadrant", "由任意象限中的点求三角比"),
      explanation: t(
        "For any angle $\\theta$ in standard position, let its terminal side meet the unit circle at $P(x, y)$. We **define**\n\n$$\\cos \\theta = x, \\qquad \\sin \\theta = y, \\qquad \\tan \\theta = \\frac{y}{x} \\ (x \\ne 0).$$\n\nFor acute angles this agrees with the right-triangle ratios; for other angles the coordinates, and so the ratios, may be negative. For $P\\left(-\\frac{3}{5}, -\\frac{4}{5}\\right)$:\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = -\\frac{4}{5}, \\qquad \\tan \\theta = \\frac{-\\frac{4}{5}}{-\\frac{3}{5}} = \\frac{4}{3}.$$",
        "对标准位置的任意角 $\\theta$，设其终边与单位圆交于 $P(x, y)$。我们**定义**\n\n$$\\cos \\theta = x, \\qquad \\sin \\theta = y, \\qquad \\tan \\theta = \\frac{y}{x} \\ (x \\ne 0).$$\n\n对锐角，这与直角三角形中的三角比一致；对其他角，坐标可能为负，三角比也可能为负。对 $P\\left(-\\frac{3}{5}, -\\frac{4}{5}\\right)$：\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = -\\frac{4}{5}, \\qquad \\tan \\theta = \\frac{-\\frac{4}{5}}{-\\frac{3}{5}} = \\frac{4}{3}.$$",
      ),
      generate: (rng) => pointRatioProblem(rng, [2, 3, 4]),
    },
    {
      id: "signs-of-the-ratios",
      title: t("Signs of the ratios by quadrant", "各象限中三角比的符号"),
      explanation: t(
        "The signs of $x$ and $y$ in each quadrant give the signs of the ratios:\n\n| | I | II | III | IV |\n| :--- | :---: | :---: | :---: | :---: |\n| $\\sin \\theta = y$ | $+$ | $+$ | $-$ | $-$ |\n| $\\cos \\theta = x$ | $+$ | $-$ | $-$ | $+$ |\n| $\\tan \\theta = \\frac{y}{x}$ | $+$ | $-$ | $+$ | $-$ |\n\nSo all ratios are positive in Quadrant I, only sine in II, only tangent in III and only cosine in IV. For example, $\\cos 250^\\circ$ is negative, since $250^\\circ$ is in Quadrant III, where $x < 0$.",
        "各象限中 $x$、$y$ 的符号决定了三角比的符号：\n\n| | 一 | 二 | 三 | 四 |\n| :--- | :---: | :---: | :---: | :---: |\n| $\\sin \\theta = y$ | $+$ | $+$ | $-$ | $-$ |\n| $\\cos \\theta = x$ | $+$ | $-$ | $-$ | $+$ |\n| $\\tan \\theta = \\frac{y}{x}$ | $+$ | $-$ | $+$ | $-$ |\n\n所以第一象限三者都为正，第二象限只有正弦为正，第三象限只有正切为正，第四象限只有余弦为正。例如 $250^\\circ$ 在第三象限，那里 $x < 0$，所以 $\\cos 250^\\circ$ 是负的。",
      ),
      generate: (rng) => signProblem(rng.pick(fns), degInfo(randomDegrees(rng, 1, 359))),
    },
    {
      id: "ratios-using-the-reference-angle",
      title: t("Ratios from the reference angle", "由参考角求三角比"),
      explanation: t(
        "The terminal sides of $\\theta$ and of its reference angle $\\alpha$ meet the unit circle at points that are mirror images across the axes, so their coordinates differ only in sign. Hence\n\n$$\\sin \\theta = \\pm \\sin \\alpha, \\quad \\cos \\theta = \\pm \\cos \\alpha, \\quad \\tan \\theta = \\pm \\tan \\alpha,$$\n\nwith the sign set by the quadrant of $\\theta$. For example, given $\\sin 40^\\circ \\approx 0.6428$: $220^\\circ$ is in Quadrant III with reference angle $220^\\circ - 180^\\circ = 40^\\circ$, and the sine is negative there, so $\\sin 220^\\circ \\approx -0.6428$.",
        "$\\theta$ 与它的参考角 $\\alpha$ 的终边与单位圆的交点关于坐标轴对称，坐标只差符号。因此\n\n$$\\sin \\theta = \\pm \\sin \\alpha, \\quad \\cos \\theta = \\pm \\cos \\alpha, \\quad \\tan \\theta = \\pm \\tan \\alpha,$$\n\n符号由 $\\theta$ 所在的象限决定。例如已知 $\\sin 40^\\circ \\approx 0.6428$：$220^\\circ$ 在第三象限，参考角是 $220^\\circ - 180^\\circ = 40^\\circ$，那里正弦为负，所以 $\\sin 220^\\circ \\approx -0.6428$。",
      ),
      generate(rng) {
        for (;;) {
          const a = degInfo(randomDegrees(rng, 91, 359));
          if (a.ref >= 5 && a.ref <= 85) return referenceRatioProblem(rng.pick(fns), a);
        }
      },
    },
    {
      id: "the-quadrant-from-the-signs",
      title: t("The quadrant from the signs", "由符号判断象限"),
      explanation: t(
        "The signs of two ratios from different families pin down the quadrant. (A ratio and its reciprocal, such as $\\sin \\theta$ and $\\csc \\theta = \\frac{1}{\\sin \\theta}$, always have the same sign.)\n\nIf $\\sin \\theta < 0$, then $\\theta$ is in Quadrant III or IV. If also $\\tan \\theta > 0$, then $\\theta$ is in Quadrant I or III. Only Quadrant III satisfies both.",
        "来自不同组的两个三角比的符号可以确定象限。（一个三角比与它的倒数，如 $\\sin \\theta$ 与 $\\csc \\theta = \\frac{1}{\\sin \\theta}$，符号总相同。）\n\n若 $\\sin \\theta < 0$，则 $\\theta$ 在第三或第四象限；若同时 $\\tan \\theta > 0$，则 $\\theta$ 在第一或第三象限。两者同时满足的只有第三象限。",
      ),
      generate(rng) {
        const n = rng.int(1, 4) as Quadrant;
        const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
        const f = rng.pick(families[i]!);
        const g = rng.pick(families[j]!);
        const base = (h: string): Fn => families.find((fam) => (fam as readonly string[]).includes(h))![0];
        const rel = (h: string) => (sgn(base(h), n) > 0 ? ">" : "<");
        const where = (h: string): Text => {
          const quads = ([1, 2, 3, 4] as const).filter((m) => sgn(base(h), m) === sgn(base(h), n));
          return t(
            `$\\${h} \\theta ${rel(h)} 0$ in Quadrants ${quads.map((m) => roman[m]).join(" and ")}`,
            `$\\${h} \\theta ${rel(h)} 0$ 在第${quads.map((m) => zhNumbers[m]).join("、第")}象限`,
          );
        };
        const letter = rng.pick(["\\theta", "\\alpha", "\\beta"]);
        const sub = (s: string) => s.replace(/\\theta/g, letter);
        return choiceProblem({
          prompt: t(
            sub(`In which quadrant is $\\theta$ if $\\${f} \\theta ${rel(f)} 0$ and $\\${g} \\theta ${rel(g)} 0$?`),
            sub(`若 $\\${f} \\theta ${rel(f)} 0$ 且 $\\${g} \\theta ${rel(g)} 0$，$\\theta$ 在哪个象限？`),
          ),
          options: quadrantOptions.slice(0, 4),
          correct: n - 1,
          solution: t(
            sub(`${where(f).en}, and ${where(g).en}. Both hold only in ${quadrantName(n).en}.`),
            sub(`${where(f)["zh-CN"]}；${where(g)["zh-CN"]}。两者同时成立的只有${quadrantName(n)["zh-CN"]}。`),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Radians
// ---------------------------------------------------------------------------

/** randomRefPi is an angle kπ/n between lo·π and hi·π whose terminal side is not on an axis, and, between 0 and 2π, not in Quadrant I. */
function randomRefPi(rng: Rng, lo: number, hi: number): AngleInfo {
  for (;;) {
    const [k, n] = randomPi(rng, lo, hi);
    const a = piInfo(k, n);
    if (a.quadrant !== 1 || lo < 0 || hi > 2) return a;
  }
}

/** extendingTheTrigonometricRatiosUsingAnglesInRadians applies the unit-circle ratios to angles in radians. */
export const extendingTheTrigonometricRatiosUsingAnglesInRadians: TopicDef = {
  id: "extending-the-trigonometric-ratios-using-angles-in-radians",
  title: t("Extending the Trigonometric Ratios Using Angles in Radians", "用弧度推广三角比"),
  summary: t(
    "Find the signs and values of the trigonometric ratios of angles in radians, from reference angles or with a calculator in radian mode.",
    "求弧度制角的三角比的符号与值，借助参考角或用弧度模式的计算器。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-using-the-unit-circle", "trigonometric-ratios-with-radians"],
  encompasses: [
    { topic: "extending-the-trigonometric-ratios-using-the-unit-circle", weight: 0.6 },
    { topic: "trigonometric-ratios-with-radians", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "signs-of-the-ratios-in-radians",
      title: t("Signs of the ratios in radians", "弧度制下三角比的符号"),
      explanation: t(
        "In radians the quadrants are\n\n$$\\text{I}: 0 < \\theta < \\tfrac{\\pi}{2}, \\quad \\text{II}: \\tfrac{\\pi}{2} < \\theta < \\pi, \\quad \\text{III}: \\pi < \\theta < \\tfrac{3\\pi}{2}, \\quad \\text{IV}: \\tfrac{3\\pi}{2} < \\theta < 2\\pi.$$\n\nTo place $\\frac{4\\pi}{5}$, compare it with $\\frac{\\pi}{2} = \\frac{2.5\\pi}{5}$ and $\\pi = \\frac{5\\pi}{5}$: it lies between them, so it is in Quadrant II, where only the sine is positive. So $\\cos \\frac{4\\pi}{5} < 0$.",
        "用弧度表示时，各象限为\n\n$$\\text{一}: 0 < \\theta < \\tfrac{\\pi}{2}, \\quad \\text{二}: \\tfrac{\\pi}{2} < \\theta < \\pi, \\quad \\text{三}: \\pi < \\theta < \\tfrac{3\\pi}{2}, \\quad \\text{四}: \\tfrac{3\\pi}{2} < \\theta < 2\\pi.$$\n\n判断 $\\frac{4\\pi}{5}$ 的位置，把它与 $\\frac{\\pi}{2} = \\frac{2.5\\pi}{5}$ 和 $\\pi = \\frac{5\\pi}{5}$ 比较：它在两者之间，所以在第二象限，那里只有正弦为正。所以 $\\cos \\frac{4\\pi}{5} < 0$。",
      ),
      generate(rng) {
        const [k, n] = randomPi(rng, 0, 2);
        return signProblem(rng.pick(fns), piInfo(k, n));
      },
    },
    {
      id: "ratios-in-radians-using-the-reference-angle",
      title: t("Ratios in radians from the reference angle", "由参考角求弧度制角的三角比"),
      explanation: t(
        "As in degrees, $\\sin \\theta$, $\\cos \\theta$ and $\\tan \\theta$ equal the ratios of the reference angle up to sign, with $\\pi$ in place of $180^\\circ$.\n\nGiven $\\cos \\frac{\\pi}{5} \\approx 0.8090$, find $\\cos \\frac{6\\pi}{5}$. The angle $\\frac{6\\pi}{5}$ is in Quadrant III, with reference angle $\\frac{6\\pi}{5} - \\pi = \\frac{\\pi}{5}$, and the cosine is negative there:\n\n$$\\cos \\frac{6\\pi}{5} = -\\cos \\frac{\\pi}{5} \\approx -0.8090.$$",
        "与角度制一样，$\\sin \\theta$、$\\cos \\theta$、$\\tan \\theta$ 与参考角的三角比只差符号，只是用 $\\pi$ 代替 $180^\\circ$。\n\n已知 $\\cos \\frac{\\pi}{5} \\approx 0.8090$，求 $\\cos \\frac{6\\pi}{5}$。角 $\\frac{6\\pi}{5}$ 在第三象限，参考角是 $\\frac{6\\pi}{5} - \\pi = \\frac{\\pi}{5}$，那里余弦为负：\n\n$$\\cos \\frac{6\\pi}{5} = -\\cos \\frac{\\pi}{5} \\approx -0.8090.$$",
      ),
      generate: (rng) => referenceRatioProblem(rng.pick(fns), randomRefPi(rng, 0, 2)),
    },
    {
      id: "ratios-in-radians-with-a-calculator",
      title: t("Ratios in radians with a calculator", "用计算器求弧度制角的三角比"),
      explanation: t(
        "An angle in radians need not be a multiple of $\\pi$. With a calculator in **radian mode**, $\\cos 2.5 \\approx -0.80$. The sign agrees with the quadrant: $\\frac{\\pi}{2} \\approx 1.57 < 2.5 < \\pi \\approx 3.14$, so $2.5$ is in Quadrant II, where the cosine is negative. In degree mode the calculator would instead give $\\cos 2.5^\\circ \\approx 1.00$.",
        "弧度制的角不一定是 $\\pi$ 的倍数。把计算器设为**弧度模式**，得 $\\cos 2.5 \\approx -0.80$。符号与象限一致：$\\frac{\\pi}{2} \\approx 1.57 < 2.5 < \\pi \\approx 3.14$，所以 $2.5$ 在第二象限，那里余弦为负。若用角度模式，计算器给出的是 $\\cos 2.5^\\circ \\approx 1.00$。",
      ),
      generate(rng) {
        for (;;) {
          const x = q(rng.int(2, 62), 10);
          const th = x.toNumber();
          const f = rng.pick(fns);
          const v = trig(f, th);
          if (Math.abs(v) > 20 || Math.abs(v) < 0.06 || nearBoundary(v, 2)) continue;
          const n = (Math.floor(th / (Math.PI / 2)) + 1) as Quadrant;
          const answer = roundQ(v, 2);
          const name = quadrantName(n);
          return numberProblem({
            prompt: t(
              `Find $\\${f} ${dec(x)}$, where the angle is in radians, rounded to the nearest hundredth.`,
              `求 $\\${f} ${dec(x)}$（角为弧度），结果精确到百分位。`,
            ),
            answer,
            form: "decimal",
            wrong: [answer.neg(), roundQ(trig(f, rad(th)), 2)],
            solution: t(
              `With the calculator in radian mode:${steps(`\\${f} ${dec(x)} \\approx ${dec(answer)}`)}As a check, $${dec(x)}$ is in ${name.en}, where the ${fnNames[f].en} is ${sgn(f, n) > 0 ? "positive" : "negative"}.`,
              `把计算器设为弧度模式：${steps(`\\${f} ${dec(x)} \\approx ${dec(answer)}`)}检验：$${dec(x)}$ 在${name["zh-CN"]}，那里${fnNames[f]["zh-CN"]}为${sgn(f, n) > 0 ? "正" : "负"}。`,
            ),
          });
        }
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Negative angles
// ---------------------------------------------------------------------------

/** extendingTheTrigonometricRatiosToNegativeAngles finds the ratios of negative angles. */
export const extendingTheTrigonometricRatiosToNegativeAngles: TopicDef = {
  id: "extending-the-trigonometric-ratios-to-negative-angles",
  title: t("Extending the Trigonometric Ratios to Negative Angles", "把三角比推广到负角"),
  summary: t(
    "Find the signs and values of the ratios of negative angles, and use sin(−θ) = −sin θ, cos(−θ) = cos θ and tan(−θ) = −tan θ.",
    "求负角三角比的符号与值，并运用 sin(−θ) = −sin θ、cos(−θ) = cos θ、tan(−θ) = −tan θ。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-using-angles-in-radians"],
  encompasses: [
    { topic: "extending-the-trigonometric-ratios-using-angles-in-radians", weight: 0.5 },
    { topic: "negative-angles-in-the-coordinate-plane", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2", "CCSS.HSF.TF.A.4"],
  knowledgePoints: [
    {
      id: "signs-of-the-ratios-of-negative-angles",
      title: t("Signs of the ratios of negative angles", "负角三角比的符号"),
      explanation: t(
        "A negative angle has a terminal side like any other angle, and the unit-circle definitions apply to it unchanged. Find the quadrant, adding a full turn if that helps: $-100^\\circ + 360^\\circ = 260^\\circ$, in Quadrant III, so $\\sin(-100^\\circ) < 0$, $\\cos(-100^\\circ) < 0$ and $\\tan(-100^\\circ) > 0$. In radians, $-\\frac{\\pi}{3} + 2\\pi = \\frac{5\\pi}{3}$ is in Quadrant IV.",
        "负角和其他角一样有终边，单位圆上的定义照样适用。先判断象限，必要时加上一整圈：$-100^\\circ + 360^\\circ = 260^\\circ$，在第三象限，所以 $\\sin(-100^\\circ) < 0$，$\\cos(-100^\\circ) < 0$，$\\tan(-100^\\circ) > 0$。用弧度时，$-\\frac{\\pi}{3} + 2\\pi = \\frac{5\\pi}{3}$ 在第四象限。",
      ),
      generate(rng) {
        if (rng.bool()) return signProblem(rng.pick(fns), degInfo(randomDegrees(rng, -359, -1)));
        const [k, n] = randomPi(rng, -2, 0);
        return signProblem(rng.pick(fns), piInfo(k, n));
      },
    },
    {
      id: "ratios-of-negative-angles-using-the-reference-angle",
      title: t("Ratios of negative angles from the reference angle", "由参考角求负角的三角比"),
      explanation: t(
        "Add a full turn to reach the coterminal angle between $0^\\circ$ and $360^\\circ$ (or $0$ and $2\\pi$), then use its reference angle and quadrant.\n\nGiven $\\tan 50^\\circ \\approx 1.1918$, find $\\tan(-130^\\circ)$. Since $-130^\\circ + 360^\\circ = 230^\\circ$, in Quadrant III with reference angle $50^\\circ$, and the tangent is positive there:\n\n$$\\tan(-130^\\circ) = \\tan 50^\\circ \\approx 1.1918.$$",
        "先加上一整圈，得到 $0^\\circ$ 到 $360^\\circ$（或 $0$ 到 $2\\pi$）之间终边相同的角，再用它的参考角和象限。\n\n已知 $\\tan 50^\\circ \\approx 1.1918$，求 $\\tan(-130^\\circ)$。因为 $-130^\\circ + 360^\\circ = 230^\\circ$，在第三象限，参考角为 $50^\\circ$，那里正切为正：\n\n$$\\tan(-130^\\circ) = \\tan 50^\\circ \\approx 1.1918.$$",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        if (rng.bool()) {
          for (;;) {
            const a = degInfo(randomDegrees(rng, -359, -1));
            if (a.ref >= 5 && a.ref <= 85) return referenceRatioProblem(f, a);
          }
        }
        return referenceRatioProblem(f, randomRefPi(rng, -2, 0));
      },
    },
    {
      id: "ratios-of-opposite-angles",
      title: t("Ratios of θ and −θ", "θ 与 −θ 的三角比"),
      explanation: t(
        "The angles $\\theta$ and $-\\theta$ turn by the same amount in opposite directions, so their terminal sides are mirror images across the $x$-axis: if one meets the unit circle at $(x, y)$, the other meets it at $(x, -y)$. Hence\n\n$$\\sin(-\\theta) = -\\sin \\theta, \\qquad \\cos(-\\theta) = \\cos \\theta, \\qquad \\tan(-\\theta) = \\frac{-y}{x} = -\\tan \\theta.$$\n\nFor example, if $\\sin \\theta = \\frac{2}{7}$, then $\\sin(-\\theta) = -\\frac{2}{7}$; if $\\cos \\theta = -\\frac{3}{4}$, then $\\cos(-\\theta) = -\\frac{3}{4}$ as well.",
        "角 $\\theta$ 与 $-\\theta$ 朝相反方向转过相同的角度，所以它们的终边关于 $x$ 轴对称：若一个与单位圆交于 $(x, y)$，另一个就交于 $(x, -y)$。因此\n\n$$\\sin(-\\theta) = -\\sin \\theta, \\qquad \\cos(-\\theta) = \\cos \\theta, \\qquad \\tan(-\\theta) = \\frac{-y}{x} = -\\tan \\theta.$$\n\n例如，若 $\\sin \\theta = \\frac{2}{7}$，则 $\\sin(-\\theta) = -\\frac{2}{7}$；若 $\\cos \\theta = -\\frac{3}{4}$，则 $\\cos(-\\theta)$ 也等于 $-\\frac{3}{4}$。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        const [p, d] = f === "tan" ? [rng.int(1, 15), rng.int(2, 9)] : randomFraction(rng);
        const v = q(rng.sign() * p, d);
        const answer = f === "cos" ? v : v.neg();
        const rule = {
          sin: "\\sin(-\\theta) = -\\sin \\theta",
          cos: "\\cos(-\\theta) = \\cos \\theta",
          tan: "\\tan(-\\theta) = -\\tan \\theta",
        }[f];
        return numberProblem({
          prompt: t(
            `If $\\${f} \\theta = ${v.toLatex()}$, find $\\${f}(-\\theta)$.`,
            `若 $\\${f} \\theta = ${v.toLatex()}$，求 $\\${f}(-\\theta)$。`,
          ),
          answer,
          wrong: [answer.neg(), Q.one.div(answer)],
          solution: t(
            `Reflecting the terminal side across the $x$-axis changes the sign of $y$ but not of $x$, so $${rule}$:${steps(`\\${f}(-\\theta) = ${answer.toLatex()}`)}`,
            `终边关于 $x$ 轴对称后，$y$ 变号而 $x$ 不变，所以 $${rule}$：${steps(`\\${f}(-\\theta) = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Large angles
// ---------------------------------------------------------------------------

/** extendingTheTrigonometricRatiosToLargeAngles finds the ratios of angles of more than one turn. */
export const extendingTheTrigonometricRatiosToLargeAngles: TopicDef = {
  id: "extending-the-trigonometric-ratios-to-large-angles",
  title: t("Extending the Trigonometric Ratios to Large Angles", "把三角比推广到大角"),
  summary: t(
    "Find the signs and values of the ratios of angles beyond one full turn, in degrees and radians, through coterminal and reference angles.",
    "借助终边相同的角和参考角，求超过一整圈的角（角度制与弧度制）的三角比的符号与值。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-to-negative-angles"],
  encompasses: [
    { topic: "extending-the-trigonometric-ratios-to-negative-angles", weight: 0.5 },
    { topic: "coterminal-angles", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "ratios-of-large-angles-in-degrees",
      title: t("Ratios of large angles in degrees", "角度制大角的三角比"),
      explanation: t(
        "Coterminal angles share a terminal side, so they have the same ratios: $\\sin(\\theta + 360^\\circ k) = \\sin \\theta$, and likewise for cosine and tangent. Remove the full turns first, then use the reference angle.\n\nGiven $\\cos 20^\\circ \\approx 0.9397$, find $\\cos 920^\\circ$: $920^\\circ - 2 \\cdot 360^\\circ = 200^\\circ$, in Quadrant III with reference angle $20^\\circ$, where the cosine is negative, so\n\n$$\\cos 920^\\circ = -\\cos 20^\\circ \\approx -0.9397.$$",
        "终边相同的角三角比相同：$\\sin(\\theta + 360^\\circ k) = \\sin \\theta$，余弦和正切也一样。先去掉整圈，再用参考角。\n\n已知 $\\cos 20^\\circ \\approx 0.9397$，求 $\\cos 920^\\circ$：$920^\\circ - 2 \\cdot 360^\\circ = 200^\\circ$，在第三象限，参考角为 $20^\\circ$，那里余弦为负，所以\n\n$$\\cos 920^\\circ = -\\cos 20^\\circ \\approx -0.9397.$$",
      ),
      generate(rng) {
        for (;;) {
          const a = degInfo(rng.bool(0.7) ? randomDegrees(rng, 361, 1440) : randomDegrees(rng, -1440, -361));
          if (a.ref >= 5 && a.ref <= 85) return referenceRatioProblem(rng.pick(fns), a);
        }
      },
    },
    {
      id: "ratios-of-large-angles-in-radians",
      title: t("Ratios of large angles in radians", "弧度制大角的三角比"),
      explanation: t(
        "In radians, remove multiples of $2\\pi$. Given $\\sin \\frac{\\pi}{8} \\approx 0.3827$, find $\\sin \\frac{23\\pi}{8}$: $2\\pi = \\frac{16\\pi}{8}$, so $\\frac{23\\pi}{8} - \\frac{16\\pi}{8} = \\frac{7\\pi}{8}$, in Quadrant II with reference angle $\\pi - \\frac{7\\pi}{8} = \\frac{\\pi}{8}$. The sine is positive there:\n\n$$\\sin \\frac{23\\pi}{8} = \\sin \\frac{\\pi}{8} \\approx 0.3827.$$",
        "用弧度时，去掉 $2\\pi$ 的倍数。已知 $\\sin \\frac{\\pi}{8} \\approx 0.3827$，求 $\\sin \\frac{23\\pi}{8}$：$2\\pi = \\frac{16\\pi}{8}$，所以 $\\frac{23\\pi}{8} - \\frac{16\\pi}{8} = \\frac{7\\pi}{8}$，在第二象限，参考角为 $\\pi - \\frac{7\\pi}{8} = \\frac{\\pi}{8}$。那里正弦为正：\n\n$$\\sin \\frac{23\\pi}{8} = \\sin \\frac{\\pi}{8} \\approx 0.3827.$$",
      ),
      generate: (rng) => referenceRatioProblem(rng.pick(fns), rng.bool(0.7) ? randomRefPi(rng, 2.1, 8) : randomRefPi(rng, -8, -2.1)),
    },
    {
      id: "signs-of-the-ratios-of-large-angles",
      title: t("Signs of the ratios of large angles", "大角三角比的符号"),
      explanation: t(
        "To find the sign of a ratio of a large angle, find the coterminal angle in one turn and its quadrant. For $\\tan 1000^\\circ$: $1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ$, in Quadrant IV, where only the cosine is positive, so $\\tan 1000^\\circ < 0$. For $\\cos \\frac{13\\pi}{4}$: $\\frac{13\\pi}{4} - 2\\pi = \\frac{5\\pi}{4}$, in Quadrant III, so the cosine is negative.",
        "判断大角三角比的符号，先求一圈内与它终边相同的角及其象限。对 $\\tan 1000^\\circ$：$1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ$，在第四象限，那里只有余弦为正，所以 $\\tan 1000^\\circ < 0$。对 $\\cos \\frac{13\\pi}{4}$：$\\frac{13\\pi}{4} - 2\\pi = \\frac{5\\pi}{4}$，在第三象限，所以余弦为负。",
      ),
      generate(rng) {
        const f = rng.pick(fns);
        if (rng.bool()) {
          return signProblem(f, degInfo(rng.bool(0.7) ? randomDegrees(rng, 361, 1800) : randomDegrees(rng, -1800, -361)));
        }
        const [k, n] = rng.bool(0.7) ? randomPi(rng, 2.1, 8) : randomPi(rng, -8, -2.1);
        return signProblem(f, piInfo(k, n));
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The Pythagorean identity
// ---------------------------------------------------------------------------

/** usingThePythagoreanIdentityInTheFirstQuadrant derives sin²θ + cos²θ = 1 and uses it for acute angles. */
export const usingThePythagoreanIdentityInTheFirstQuadrant: TopicDef = {
  id: "using-the-pythagorean-identity-in-the-first-quadrant",
  title: t("Using the Pythagorean Identity in the First Quadrant", "在第一象限中运用勾股恒等式"),
  summary: t(
    "Derive sin²θ + cos²θ = 1 from the unit circle, and use it to find one ratio of an acute angle from another and to evaluate expressions.",
    "由单位圆推出 sin²θ + cos²θ = 1，并用它由锐角的一个三角比求另一个，以及求式子的值。",
  ),
  prerequisites: ["properties-of-the-unit-circle-in-the-first-quadrant"],
  encompasses: [{ topic: "properties-of-the-unit-circle-in-the-first-quadrant", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "the-other-ratio-in-the-first-quadrant",
      title: t("The other ratio from sine or cosine", "由正弦或余弦求另一个"),
      explanation: t(
        "The point $(\\cos \\theta, \\sin \\theta)$ lies on the unit circle $x^2 + y^2 = 1$, so for every angle\n\n$$\\sin^2 \\theta + \\cos^2 \\theta = 1,$$\n\nthe **Pythagorean identity** (here $\\sin^2 \\theta$ means $(\\sin \\theta)^2$). For an acute angle both ratios are positive, so if $\\sin \\theta = \\frac{2}{5}$, then\n\n$$\\cos \\theta = \\sqrt{1 - \\frac{4}{25}} = \\sqrt{\\frac{21}{25}} = \\frac{\\sqrt{21}}{5}.$$",
        "点 $(\\cos \\theta, \\sin \\theta)$ 在单位圆 $x^2 + y^2 = 1$ 上，所以对任意角都有\n\n$$\\sin^2 \\theta + \\cos^2 \\theta = 1,$$\n\n这就是**勾股恒等式**（这里 $\\sin^2 \\theta$ 表示 $(\\sin \\theta)^2$）。对锐角，两个三角比都是正的，所以若 $\\sin \\theta = \\frac{2}{5}$，则\n\n$$\\cos \\theta = \\sqrt{1 - \\frac{4}{25}} = \\sqrt{\\frac{21}{25}} = \\frac{\\sqrt{21}}{5}.$$",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const [out, m] = simplifyRadical(d * d - p * p);
        return radicalProblem({
          prompt: t(
            `The angle $\\theta$ is acute and $\\${f} \\theta = \\frac{${p}}{${d}}$. Find $\\${g} \\theta$ exactly, in simplest radical form.`,
            `$\\theta$ 是锐角，且 $\\${f} \\theta = \\frac{${p}}{${d}}$。求 $\\${g} \\theta$ 的精确值，答案写成最简根式。`,
          ),
          answer: otherMagnitude(p, d),
          wrong: [q(d - p, d).toLatex(), q(d * d - p * p, d * d).toLatex(), radical(out, m)],
          solution: t(
            `By $\\sin^2 \\theta + \\cos^2 \\theta = 1$, taking the positive root since $\\theta$ is acute:${steps(`\\${g} \\theta = ${sqrtLine(p, d)}`)}`,
            `由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$，因为 $\\theta$ 是锐角，取正的平方根：${steps(`\\${g} \\theta = ${sqrtLine(p, d)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-tangent-from-sine-or-cosine",
      title: t("The tangent from sine or cosine", "由正弦或余弦求正切"),
      explanation: t(
        "Find the missing ratio with the identity, then divide: $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$, since $\\tan \\theta = \\frac{y}{x}$ on the unit circle.\n\nIf $\\theta$ is acute and $\\cos \\theta = \\frac{1}{3}$, then $\\sin \\theta = \\sqrt{1 - \\frac{1}{9}} = \\frac{2\\sqrt{2}}{3}$ and\n\n$$\\tan \\theta = \\frac{2\\sqrt{2}}{3} \\div \\frac{1}{3} = 2\\sqrt{2}.$$",
        "先用恒等式求出缺少的三角比，再相除：在单位圆上 $\\tan \\theta = \\frac{y}{x}$，所以 $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$。\n\n若 $\\theta$ 是锐角且 $\\cos \\theta = \\frac{1}{3}$，则 $\\sin \\theta = \\sqrt{1 - \\frac{1}{9}} = \\frac{2\\sqrt{2}}{3}$，且\n\n$$\\tan \\theta = \\frac{2\\sqrt{2}}{3} \\div \\frac{1}{3} = 2\\sqrt{2}.$$",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const other = otherMagnitude(p, d);
        const answer = tanMagnitude(f, p, d);
        const [sinTex, cosTex] = f === "sin" ? [`\\frac{${p}}{${d}}`, texS(other)] : [texS(other), `\\frac{${p}}{${d}}`];
        return radicalProblem({
          prompt: t(
            `The angle $\\theta$ is acute and $\\${f} \\theta = \\frac{${p}}{${d}}$. Find $\\tan \\theta$ exactly, in simplest radical form.`,
            `$\\theta$ 是锐角，且 $\\${f} \\theta = \\frac{${p}}{${d}}$。求 $\\tan \\theta$ 的精确值，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(tanMagnitude(f, p, d, true)), texS(other)],
          solution: t(
            `First find $\\${g} \\theta$ from $\\sin^2 \\theta + \\cos^2 \\theta = 1$:${steps(`\\${g} \\theta = ${sqrtLine(p, d)}`)}Then divide:${steps(`\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`)}`,
            `先由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 求 $\\${g} \\theta$：${steps(`\\${g} \\theta = ${sqrtLine(p, d)}`)}再相除：${steps(`\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "expressions-with-the-pythagorean-identity",
      title: t("Expressions with the identity", "用恒等式求式子的值"),
      explanation: t(
        "The identity simplifies expressions without finding the angle. Factor out the common coefficient:\n\n$$5\\sin^2 37^\\circ + 5\\cos^2 37^\\circ - 2 = 5(\\sin^2 37^\\circ + \\cos^2 37^\\circ) - 2 = 5 - 2 = 3.$$\n\nRearranged, the identity gives $1 - \\sin^2 \\theta = \\cos^2 \\theta$. So if $\\cos \\theta = \\frac{2}{3}$, then $6 - 6\\sin^2 \\theta = 6\\cos^2 \\theta = 6 \\cdot \\frac{4}{9} = \\frac{8}{3}$.",
        "恒等式可以在不求角的情况下化简式子。提出公共系数：\n\n$$5\\sin^2 37^\\circ + 5\\cos^2 37^\\circ - 2 = 5(\\sin^2 37^\\circ + \\cos^2 37^\\circ) - 2 = 5 - 2 = 3.$$\n\n变形后，恒等式给出 $1 - \\sin^2 \\theta = \\cos^2 \\theta$。所以若 $\\cos \\theta = \\frac{2}{3}$，则 $6 - 6\\sin^2 \\theta = 6\\cos^2 \\theta = 6 \\cdot \\frac{4}{9} = \\frac{8}{3}$。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        if (rng.bool()) {
          let d = 45;
          while (d === 45 || d === 30 || d === 60) d = rng.int(11, 79);
          const b = rng.nonZero(-9, 9);
          const [first, second] = rng.bool() ? ["sin", "cos"] : ["cos", "sin"];
          const bTex = b > 0 ? `+ ${b}` : `- ${-b}`;
          return numberProblem({
            prompt: t(
              `Find the exact value of $${a}\\${first}^2 ${d}^\\circ + ${a}\\${second}^2 ${d}^\\circ ${bTex}$.`,
              `求 $${a}\\${first}^2 ${d}^\\circ + ${a}\\${second}^2 ${d}^\\circ ${bTex}$ 的精确值。`,
            ),
            answer: a + b,
            form: "integer",
            wrong: [b, 2 * a + b, a, 1 + b],
            solution: t(
              `Factor out $${a}$ and use $\\sin^2 \\theta + \\cos^2 \\theta = 1$:${steps(`${a}(\\sin^2 ${d}^\\circ + \\cos^2 ${d}^\\circ) ${bTex} = ${a} \\cdot 1 ${bTex} = ${a + b}`)}`,
              `提出 $${a}$，并用 $\\sin^2 \\theta + \\cos^2 \\theta = 1$：${steps(`${a}(\\sin^2 ${d}^\\circ + \\cos^2 ${d}^\\circ) ${bTex} = ${a} \\cdot 1 ${bTex} = ${a + b}`)}`,
            ),
          });
        }
        const [p, d] = randomFraction(rng);
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const sq = q(p * p, d * d);
        const answer = sq.mul(q(a));
        return numberProblem({
          prompt: t(
            `If $\\${f} \\theta = \\frac{${p}}{${d}}$, find the exact value of $${a} - ${a}\\${g}^2 \\theta$.`,
            `若 $\\${f} \\theta = \\frac{${p}}{${d}}$，求 $${a} - ${a}\\${g}^2 \\theta$ 的精确值。`,
          ),
          answer,
          wrong: [q(a * p, d), q(a).sub(answer), q(a).sub(q(a * p, d))],
          solution: t(
            `Factor out $${a}$; by the identity, $1 - \\${g}^2 \\theta = \\${f}^2 \\theta$:${steps(`${a}(1 - \\${g}^2 \\theta) = ${a}\\${f}^2 \\theta = ${a} \\cdot ${sq.toLatex()} = ${answer.toLatex()}`)}`,
            `提出 $${a}$；由恒等式，$1 - \\${g}^2 \\theta = \\${f}^2 \\theta$：${steps(`${a}(1 - \\${g}^2 \\theta) = ${a}\\${f}^2 \\theta = ${a} \\cdot ${sq.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** extendingThePythagoreanIdentityToAllQuadrants uses sin²θ + cos²θ = 1 with the quadrant to find the sign of the result. */
export const extendingThePythagoreanIdentityToAllQuadrants: TopicDef = {
  id: "extending-the-pythagorean-identity-to-all-quadrants",
  title: t("Extending the Pythagorean Identity to All Quadrants", "把勾股恒等式推广到所有象限"),
  summary: t(
    "Use sin²θ + cos²θ = 1 with the quadrant of θ to find the other ratios, with the right signs, from one ratio.",
    "结合 θ 所在的象限运用 sin²θ + cos²θ = 1，由一个三角比求出其余三角比及其正确符号。",
  ),
  prerequisites: ["using-the-pythagorean-identity-in-the-first-quadrant", "extending-the-trigonometric-ratios-using-angles-in-radians"],
  encompasses: [
    { topic: "using-the-pythagorean-identity-in-the-first-quadrant", weight: 0.6 },
    { topic: "extending-the-trigonometric-ratios-using-angles-in-radians", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "the-other-ratio-in-any-quadrant",
      title: t("Sine or cosine in any quadrant", "任意象限中的正弦或余弦"),
      explanation: t(
        "Solving $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for one ratio gives two square roots, $\\pm$. The quadrant of $\\theta$ decides which.\n\nIf $\\sin \\theta = \\frac{1}{4}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, then $\\theta$ is in Quadrant II, where the cosine is negative:\n\n$$\\cos \\theta = -\\sqrt{1 - \\frac{1}{16}} = -\\sqrt{\\frac{15}{16}} = -\\frac{\\sqrt{15}}{4}.$$",
        "由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 解出一个三角比时有两个平方根 $\\pm$，由 $\\theta$ 所在的象限决定取哪一个。\n\n若 $\\sin \\theta = \\frac{1}{4}$ 且 $\\frac{\\pi}{2} < \\theta < \\pi$，则 $\\theta$ 在第二象限，那里余弦为负：\n\n$$\\cos \\theta = -\\sqrt{1 - \\frac{1}{16}} = -\\sqrt{\\frac{15}{16}} = -\\frac{\\sqrt{15}}{4}.$$",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const n = rng.int(2, 4) as Quadrant;
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const given = q(sgn(f, n) * p, d);
        const mag = otherMagnitude(p, d);
        const s = sgn(g, n);
        const answer = s > 0 ? mag : negS(mag);
        const range = rangeOf(rng, n);
        const name = quadrantName(n);
        return radicalProblem({
          prompt: t(
            `If $\\${f} \\theta = ${given.toLatex()}$ and $${range}$, find $\\${g} \\theta$ exactly, in simplest radical form.`,
            `若 $\\${f} \\theta = ${given.toLatex()}$ 且 $${range}$，求 $\\${g} \\theta$ 的精确值，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(negS(answer)), q(s * (d - p), d).toLatex()],
          solution: t(
            `The angle is in ${name.en}, where the ${fnNames[g].en} is ${s > 0 ? "positive" : "negative"}. By $\\sin^2 \\theta + \\cos^2 \\theta = 1$:${steps(`\\${g} \\theta = ${sqrtLine(p, d, s)}`)}`,
            `角在${name["zh-CN"]}，那里${fnNames[g]["zh-CN"]}为${s > 0 ? "正" : "负"}。由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$：${steps(`\\${g} \\theta = ${sqrtLine(p, d, s)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-tangent-in-any-quadrant",
      title: t("The tangent in any quadrant", "任意象限中的正切"),
      explanation: t(
        "Find the missing ratio with the right sign first, then divide. If $\\cos \\theta = -\\frac{2}{3}$ and $180^\\circ < \\theta < 270^\\circ$, the sine is negative in Quadrant III:\n\n$$\\sin \\theta = -\\sqrt{1 - \\frac{4}{9}} = -\\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{-\\frac{\\sqrt{5}}{3}}{-\\frac{2}{3}} = \\frac{\\sqrt{5}}{2}.$$\n\nThe tangent is positive, as it must be in Quadrant III.",
        "先求出带正确符号的缺少的三角比，再相除。若 $\\cos \\theta = -\\frac{2}{3}$ 且 $180^\\circ < \\theta < 270^\\circ$，在第三象限正弦为负：\n\n$$\\sin \\theta = -\\sqrt{1 - \\frac{4}{9}} = -\\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{-\\frac{\\sqrt{5}}{3}}{-\\frac{2}{3}} = \\frac{\\sqrt{5}}{2}.$$\n\n正切为正，与第三象限相符。",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const n = rng.int(2, 4) as Quadrant;
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const given = q(sgn(f, n) * p, d);
        const other: S = [otherMagnitude(p, d)[0].mul(q(sgn(g, n))), otherMagnitude(p, d)[1]];
        const mag = tanMagnitude(f, p, d);
        const answer = sgn("tan", n) > 0 ? mag : negS(mag);
        const [sinTex, cosTex] = f === "sin" ? [given.toLatex(), texS(other)] : [texS(other), given.toLatex()];
        const range = rangeOf(rng, n);
        const name = quadrantName(n);
        return radicalProblem({
          prompt: t(
            `If $\\${f} \\theta = ${given.toLatex()}$ and $${range}$, find $\\tan \\theta$ exactly, in simplest radical form.`,
            `若 $\\${f} \\theta = ${given.toLatex()}$ 且 $${range}$，求 $\\tan \\theta$ 的精确值，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(negS(answer)), texS(sgn("tan", n) > 0 ? tanMagnitude(f, p, d, true) : negS(tanMagnitude(f, p, d, true)))],
          solution: t(
            `The angle is in ${name.en}, where the ${fnNames[g].en} is ${sgn(g, n) > 0 ? "positive" : "negative"}:${steps(`\\${g} \\theta = ${sqrtLine(p, d, sgn(g, n))}`)}Then divide:${steps(`\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`)}`,
            `角在${name["zh-CN"]}，那里${fnNames[g]["zh-CN"]}为${sgn(g, n) > 0 ? "正" : "负"}：${steps(`\\${g} \\theta = ${sqrtLine(p, d, sgn(g, n))}`)}再相除：${steps(`\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "sine-and-cosine-from-the-tangent",
      title: t("Sine and cosine from the tangent", "由正切求正弦和余弦"),
      explanation: t(
        "If $\\tan \\theta = \\frac{y}{x}$ is known, the point on the unit circle is $(x, y)$ scaled to length $1$. Take $\\tan \\theta = -\\frac{4}{3}$ with $\\theta$ in Quadrant II, where $x < 0 < y$: the point $(-3, 4)$ lies on the terminal side, at distance $\\sqrt{9 + 16} = 5$ from the origin. Dividing by $5$ gives the point on the unit circle, $\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$, so\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = \\frac{4}{5}.$$\n\nCheck: $\\frac{9}{25} + \\frac{16}{25} = 1$.",
        "若已知 $\\tan \\theta = \\frac{y}{x}$，把点 $(x, y)$ 缩放到与原点距离为 $1$ 就得到单位圆上的点。设 $\\tan \\theta = -\\frac{4}{3}$ 且 $\\theta$ 在第二象限（$x < 0 < y$）：点 $(-3, 4)$ 在终边上，与原点的距离是 $\\sqrt{9 + 16} = 5$。除以 $5$ 得单位圆上的点 $\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$，所以\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = \\frac{4}{5}.$$\n\n检验：$\\frac{9}{25} + \\frac{16}{25} = 1$。",
      ),
      generate(rng) {
        const p = randomPoint(rng, [2, 3, 4]);
        const f = rng.pick(["sin", "cos"] as const);
        const tan = p.y.div(p.x);
        const answer = f === "sin" ? p.y : p.x;
        const swapped = f === "sin" ? p.x : p.y;
        const range = rangeOf(rng, p.quadrant);
        const [a, b, c] = [p.x.n, p.y.n, p.x.d];
        const name = quadrantName(p.quadrant);
        return numberProblem({
          prompt: t(
            `If $\\tan \\theta = ${tan.toLatex()}$ and $${range}$, find $\\${f} \\theta$.`,
            `若 $\\tan \\theta = ${tan.toLatex()}$ 且 $${range}$，求 $\\${f} \\theta$。`,
          ),
          answer,
          wrong: [answer.neg(), swapped, swapped.neg(), tan],
          solution: t(
            `In ${name.en}, $x$ is ${p.x.sign() > 0 ? "positive" : "negative"} and $y$ is ${p.y.sign() > 0 ? "positive" : "negative"}, so the point $(${a}, ${b})$ lies on the terminal side. Its distance from the origin is $\\sqrt{${a * a} + ${b * b}} = ${c}$; dividing by $${c}$ gives the point on the unit circle, $${pointTex(p.x, p.y)}$. So${steps(`\\${f} \\theta = ${answer.toLatex()}`)}`,
            `在${name["zh-CN"]}，$x$ 为${p.x.sign() > 0 ? "正" : "负"}，$y$ 为${p.y.sign() > 0 ? "正" : "负"}，所以点 $(${a}, ${b})$ 在终边上。它与原点的距离是 $\\sqrt{${a * a} + ${b * b}} = ${c}$；除以 $${c}$ 得单位圆上的点 $${pointTex(p.x, p.y)}$。所以${steps(`\\${f} \\theta = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** algebraIIUnitCircleTopics are the topics of the unit circle module of Algebra II, in outline order. */
export const algebraIIUnitCircleTopics: readonly TopicDef[] = [
  anglesInTheCoordinatePlane,
  negativeAnglesInTheCoordinatePlane,
  coterminalAngles,
  calculatingReferenceAngles,
  propertiesOfTheUnitCircleInTheFirstQuadrant,
  extendingTheTrigonometricRatiosUsingTheUnitCircle,
  extendingTheTrigonometricRatiosUsingAnglesInRadians,
  extendingTheTrigonometricRatiosToNegativeAngles,
  extendingTheTrigonometricRatiosToLargeAngles,
  usingThePythagoreanIdentityInTheFirstQuadrant,
  extendingThePythagoreanIdentityToAllQuadrants,
];
