import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, type Compass, dec, gcd, type Mark, type Point, Q, q, radical, simplifyRadical, sketch } from "@ga/subject-math";
import { trigDrawings } from "../explanation-drawings-trig.ts";
import { article, choiceProblem, expressionProblem, numberProblem, radicalProblem, steps, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** label is the bold label of step i in both locales, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** said is a closing check paragraph in both locales. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

/** both is the same displayed work after an English and a Chinese lead-in. */
const both = (en: string, zh: string, ...lines: readonly string[]) => {
  const work = steps(...lines).trimEnd();
  return t(`${en}${work}`, `${zh}${work}`);
};

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
  /** backLine turns the terminal side back by the reference angle onto the x-axis: "150^\circ + 30^\circ = 180^\circ". */
  readonly backLine: string;
  /** coterminal is the computation of mTex from tex, when they differ. */
  readonly coterminal?: string;
  /** range is the standard range, "0^\circ" to "360^\circ" or "0" to "2\pi". */
  readonly range: readonly [string, string];
  /** radians tells whether the angle is measured in radians. */
  readonly radians: boolean;
  /** value is the angle in radians, for a calculator. */
  readonly value: number;
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
  const backLine = [
    `${m}^\\circ - ${ref}^\\circ = 0^\\circ`,
    `${m}^\\circ + ${ref}^\\circ = 180^\\circ`,
    `${m}^\\circ - ${ref}^\\circ = 180^\\circ`,
    `${m}^\\circ + ${ref}^\\circ = 360^\\circ`,
  ][quadrant - 1]!;
  const turns = (d - m) / 360;
  return {
    tex: `${d}^\\circ`,
    mTex: `${m}^\\circ`,
    quadrant,
    ref,
    refTex: `${ref}^\\circ`,
    refLine,
    backLine,
    ...(turns !== 0 && {
      coterminal: `${d}^\\circ ${turns > 0 ? "-" : "+"} ${turnsTex(Math.abs(turns), "360^\\circ")} = ${m}^\\circ`,
    }),
    range: ["0^\\circ", "360^\\circ"],
    radians: false,
    value: rad(d),
  };
}

/** piInfo describes an angle of kπ/n whose terminal side is not on an axis. */
function piInfo(k: number, n: number): AngleInfo {
  const m = mod(k, 2 * n);
  const quadrant = quadrantOfPi(m, n) as Quadrant;
  const r = [m, n - m, m - n, 2 * n - m][quadrant - 1]!;
  const [mTex, refTex] = [piTex(q(m, n)), piTex(q(r, n))];
  const refLine = [mTex, `\\pi - ${mTex} = ${refTex}`, `${mTex} - \\pi = ${refTex}`, `2\\pi - ${mTex} = ${refTex}`][quadrant - 1]!;
  const backLine = [`${mTex} - ${refTex} = 0`, `${mTex} + ${refTex} = \\pi`, `${mTex} - ${refTex} = \\pi`, `${mTex} + ${refTex} = 2\\pi`][
    quadrant - 1
  ]!;
  const turns = (k - m) / (2 * n);
  return {
    tex: piTex(q(k, n)),
    mTex,
    quadrant,
    ref: (r * 180) / n,
    refTex,
    refLine,
    backLine,
    ...(turns !== 0 && { coterminal: `${piTex(q(k, n))} ${turns > 0 ? "-" : "+"} ${piTex(2 * Math.abs(turns))} = ${mTex}` }),
    range: ["0", "2\\pi"],
    radians: true,
    value: (k * Math.PI) / n,
  };
}

/** Placed is the labeled work that places an angle, and the number of the next step. */
interface Placed {
  readonly text: Text;
  readonly next: number;
}

/** place brings an angle into one turn when needed and names the quadrant of its terminal side, as numbered steps. */
function place(a: AngleInfo): Placed {
  const [lo, hi] = a.range;
  const name = quadrantName(a.quadrant);
  const parts: Text[] = [];
  let i = 1;
  if (a.coterminal) {
    parts.push(
      label(i, "Remove the full turns", "去掉整圈"),
      both(
        `Full turns do not move the terminal side, so find the coterminal angle between $${lo}$ and $${hi}$:`,
        `整圈不改变终边，所以先求 $${lo}$ 到 $${hi}$ 之间与它终边相同的角：`,
        a.coterminal,
      ),
      para,
    );
    i++;
  }
  const bounds = (a.radians ? radianRanges : degreeRanges)[a.quadrant].replace("\\theta", a.mTex);
  parts.push(
    label(i, "Find the quadrant", "判断象限"),
    t(
      `Since $${bounds}$, the terminal side of $${a.mTex}$ lies in ${name.en}.`,
      `因为 $${bounds}$，所以 $${a.mTex}$ 的终边在${name["zh-CN"]}。`,
    ),
  );
  return { text: join(...parts), next: i + 1 };
}

/** referenceStep is the numbered step that finds the reference angle of an angle already placed in its quadrant. */
function referenceStep(a: AngleInfo, i: number): Text {
  return join(
    label(i, "Find the reference angle", "求参考角"),
    a.quadrant === 1
      ? t(
          `In Quadrant I the angle is its own reference angle: the reference angle is $${a.mTex}$.`,
          `在第一象限，角就是它自己的参考角：参考角是 $${a.mTex}$。`,
        )
      : both(
          "The reference angle is the acute angle between the terminal side and the nearer half of the $x$-axis:",
          "参考角是终边与 $x$ 轴较近的半轴所成的锐角：",
          a.refLine,
        ),
  );
}

/** referenceCheck turns the terminal side back by the reference angle onto the x-axis. */
function referenceCheck(a: AngleInfo): Text {
  return said(
    `Turning the terminal side back toward the nearer half of the $x$-axis by the reference angle should land on the $x$-axis, and it does: $${a.backLine}$. And $${a.refTex}$ is acute, as a reference angle must be.`,
    `把终边朝较近的 $x$ 半轴转回一个参考角，应该正好落在 $x$ 轴上，确实如此：$${a.backLine}$。而且 $${a.refTex}$ 是锐角，参考角正应如此。`,
  );
}

/** referenceSolution finds the reference angle of an angle step by step and checks it. */
function referenceSolution(a: AngleInfo): Text {
  const placed = place(a);
  return join(placed.text, para, referenceStep(a, placed.next), referenceCheck(a));
}

/** mode names the calculator mode for an angle. */
const mode = (a: AngleInfo) => (a.radians ? t("radian mode", "弧度模式") : t("degree mode", "角度模式"));

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
  const placed = place(a);
  const rule = signRule[a.quadrant];
  const value = roundQ(trig(f, a.value), 4);
  return choiceProblem({
    prompt: t(`Is $\\${f} ${arg(a.tex)}$ positive or negative?`, `$\\${f} ${arg(a.tex)}$ 是正数还是负数？`),
    options: signOptions,
    correct: s > 0 ? 0 : 1,
    solution: join(
      placed.text,
      para,
      label(placed.next, "Read the sign", "判断符号"),
      t(
        `${rule.en} So $\\${f} ${arg(a.tex)}$ is ${s > 0 ? "positive" : "negative"}.`,
        `${rule["zh-CN"]}所以 $\\${f} ${arg(a.tex)}$ 是${s > 0 ? "正数" : "负数"}。`,
      ),
      said(
        `A calculator in ${mode(a).en} gives $\\${f} ${arg(a.tex)} \\approx ${dec(value)}$, which is ${s > 0 ? "positive" : "negative"}.`,
        `用${mode(a)["zh-CN"]}的计算器得 $\\${f} ${arg(a.tex)} \\approx ${dec(value)}$，确实是${s > 0 ? "正数" : "负数"}。`,
      ),
    ),
  });
}

/** referenceRatioProblem gives a ratio of an angle's reference angle to four places and asks for the ratio of the angle. */
function referenceRatioProblem(f: Fn, a: AngleInfo): Problem {
  const v = roundQ(trig(f, rad(a.ref)), 4);
  const s = sgn(f, a.quadrant);
  const answer = s > 0 ? v : v.neg();
  const placed = place(a);
  const name = quadrantName(a.quadrant);
  const direct = roundQ(trig(f, a.value), 4);
  return numberProblem({
    prompt: t(
      `Given that $\\${f} ${a.refTex} \\approx ${dec(v)}$, find $\\${f} ${arg(a.tex)}$.`,
      `已知 $\\${f} ${a.refTex} \\approx ${dec(v)}$，求 $\\${f} ${arg(a.tex)}$。`,
    ),
    answer,
    form: "decimal",
    wrong: [answer.neg()],
    solution: join(
      placed.text,
      para,
      referenceStep(a, placed.next),
      para,
      label(placed.next + 1, "Choose the sign", "确定符号"),
      both(
        `The ratio has the size of the ratio of the reference angle. In ${name.en} the ${fnNames[f].en} is ${s > 0 ? "positive" : "negative"}, so`,
        `三角比的大小等于参考角的三角比。在${name["zh-CN"]}，${fnNames[f]["zh-CN"]}是${s > 0 ? "正" : "负"}的，所以`,
        `\\${f} ${arg(a.tex)} = ${s > 0 ? "" : "-"}\\${f} ${a.refTex} \\approx ${dec(answer)}`,
      ),
      said(
        `A calculator in ${mode(a).en} gives $\\${f} ${arg(a.tex)} \\approx ${dec(direct)}$ directly.`,
        `用${mode(a)["zh-CN"]}的计算器直接计算，得 $\\${f} ${arg(a.tex)} \\approx ${dec(direct)}$。`,
      ),
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
      solution: join(
        label(1, "Read the coordinates", "读出坐标"),
        t(
          `On the unit circle, $P = (\\cos \\theta, \\sin \\theta)$, so $x = ${p.x.toLatex()}$ is the cosine and $y = ${p.y.toLatex()}$ is the sine.`,
          `在单位圆上，$P = (\\cos \\theta, \\sin \\theta)$，所以 $x = ${p.x.toLatex()}$ 是余弦，$y = ${p.y.toLatex()}$ 是正弦。`,
        ),
        para,
        label(2, `Find the ${fnNames[f].en}`, `求${fnNames[f]["zh-CN"]}`),
        both(
          f === "tan" ? "The tangent is $\\frac{y}{x}$:" : `Take the ${f === "sin" ? "$y$" : "$x$"}-coordinate:`,
          f === "tan" ? "正切是 $\\frac{y}{x}$：" : `取 ${f === "sin" ? "$y$" : "$x$"} 坐标：`,
          ratioLine(f, p),
        ),
        said(
          `$P$ is on the unit circle, since $\\left(${p.x.toLatex()}\\right)^2 + \\left(${p.y.toLatex()}\\right)^2 = ${p.x.mul(p.x).toLatex()} + ${p.y.mul(p.y).toLatex()} = 1$. ${signRule[p.quadrant].en} The ${fnNames[f].en} $${answer.toLatex()}$ has the right sign.`,
          `$P$ 在单位圆上，因为 $\\left(${p.x.toLatex()}\\right)^2 + \\left(${p.y.toLatex()}\\right)^2 = ${p.x.mul(p.x).toLatex()} + ${p.y.mul(p.y).toLatex()} = 1$。${signRule[p.quadrant]["zh-CN"]}${fnNames[f]["zh-CN"]} $${answer.toLatex()}$ 的符号正确。`,
        ),
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

/** triangleTan writes |tan θ| as a leg over a leg of the right triangle with hypotenuse q and the given leg p, then simplified when that changes it. */
function triangleTan(given: "sin" | "cos", p: number, out: number, m: number, size: S): string {
  const legs = given === "sin" ? `\\frac{${p}}{${radical(out, m)}}` : `\\frac{${radical(out, m)}}{${p}}`;
  const simple = texS(size);
  return legs === simple ? simple : `${legs} = ${simple}`;
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
  const range = n === 0 ? "" : degreeRanges[n].replace("\\theta", `${m}^\\circ`);
  const axis = axisNames[m] ?? axisNames[0]!;
  const first =
    m === d
      ? t(
          `The angle $${d}^\\circ$ is already between $0^\\circ$ and $360^\\circ$, so its terminal side is reached by turning counterclockwise from the positive $x$-axis.`,
          `角 $${d}^\\circ$ 已经在 $0^\\circ$ 与 $360^\\circ$ 之间，它的终边由 $x$ 轴正半轴逆时针旋转得到。`,
        )
      : both(
          "A negative angle turns clockwise. Adding a full turn of $360^\\circ$ keeps the terminal side and gives a counterclockwise angle:",
          "负角是顺时针旋转的。加上一整圈 $360^\\circ$ 不改变终边，并得到一个逆时针的角：",
          `${d}^\\circ + 360^\\circ = ${m}^\\circ`,
        );
  const second =
    n === 0
      ? t(
          `$${m}^\\circ = ${m / 90} \\cdot 90^\\circ$ is a multiple of $90^\\circ$, so the terminal side lies on ${axis.en}, an axis.`,
          `$${m}^\\circ = ${m / 90} \\cdot 90^\\circ$ 是 $90^\\circ$ 的倍数，所以终边在 ${axis["zh-CN"]}上，即在坐标轴上。`,
        )
      : t(`Since $${range}$, the terminal side lies in ${quadrantName(n).en}.`, `因为 $${range}$，所以终边在${quadrantName(n)["zh-CN"]}。`);
  const turn = Math.abs(d);
  const k = Math.floor(turn / 90);
  const rest = turn - 90 * k;
  const clockwise = d < 0;
  const order = clockwise ? t("IV, III, II, I", "四、三、二、一") : t("I, II, III, IV", "一、二、三、四");
  const check =
    n === 0
      ? said(
          `Each $90^\\circ$ of rotation reaches the next axis. Turning $${turn}^\\circ$ ${clockwise ? "clockwise" : "counterclockwise"} is exactly $${k}$ quarter turn${k === 1 ? "" : "s"}, which ends on ${axis.en}.`,
          `每转 $90^\\circ$ 到达下一条坐标轴。${clockwise ? "顺时针" : "逆时针"}旋转 $${turn}^\\circ$ 恰好是 $${k}$ 个四分之一圈，终点在 ${axis["zh-CN"]}上。`,
        )
      : k === 0
        ? said(
            `Turning ${clockwise ? "clockwise" : "counterclockwise"}, the first quadrant reached is ${quadrantName(n).en}. Since $${turn}^\\circ < 90^\\circ$, the rotation stops before the next axis, so it stays there.`,
            `${clockwise ? "顺时针" : "逆时针"}旋转时，最先进入的是${quadrantName(n)["zh-CN"]}。因为 $${turn}^\\circ < 90^\\circ$，旋转在到达下一条坐标轴之前就停止了，所以终边留在那里。`,
          )
        : said(
            `Count quarter turns ${clockwise ? "clockwise" : "counterclockwise"}, where the quadrants come in the order ${order.en}: $${turn}^\\circ = ${k} \\cdot 90^\\circ + ${rest}^\\circ$. The rotation passes $${k}$ ${k === 1 ? "axis" : "axes"} after the positive $x$-axis and goes $${rest}^\\circ$ into the next quadrant, ${quadrantName(n).en}.`,
            `${clockwise ? "顺时针" : "逆时针"}数四分之一圈，象限依次是第${order["zh-CN"]}象限：$${turn}^\\circ = ${k} \\cdot 90^\\circ + ${rest}^\\circ$。旋转越过 $x$ 轴正半轴之后的 $${k}$ 条坐标轴，再转 $${rest}^\\circ$ 进入下一个象限，即${quadrantName(n)["zh-CN"]}。`,
          );
  const reasons: Reason[] = [1, 2, 3, 4].map((j) => {
    const o = quadrantOptions[j - 1]!;
    return n === 0
      ? [
          o.en,
          `$${m}^\\circ$ is a multiple of $90^\\circ$, so its terminal side lies on an axis, not inside a quadrant.`,
          `$${m}^\\circ$ 是 $90^\\circ$ 的倍数，终边在坐标轴上，不在任何象限内。`,
        ]
      : [
          o.en,
          `This quadrant holds the angles with $${degreeRanges[j as Quadrant]}$, and $${m}^\\circ$ is not one of them.`,
          `这个象限对应 $${degreeRanges[j as Quadrant]}$ 的角，而 $${m}^\\circ$ 不在其中。`,
        ];
  });
  reasons.push([
    quadrantOptions[4]!.en,
    `Only multiples of $90^\\circ$ lie on an axis, and $${m}^\\circ$ is not one.`,
    `只有 $90^\\circ$ 的倍数的终边在坐标轴上，而 $${m}^\\circ$ 不是。`,
  ]);
  return reasoned(
    choiceProblem({
      prompt: t(
        `In which quadrant does the terminal side of an angle of $${d}^\\circ$ in standard position lie?`,
        `标准位置的 $${d}^\\circ$ 角的终边在哪个象限？`,
      ),
      options: quadrantOptions,
      correct: n === 0 ? 4 : n - 1,
      solution: join(
        label(1, "Turn counterclockwise", "化为逆时针的角"),
        first,
        para,
        label(2, "Compare with the axes", "与坐标轴比较"),
        second,
        check,
      ),
    }),
    reasons,
  );
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You know how to measure an angle with a protractor and how to place points in the coordinate plane. Putting an angle on the plane, with its vertex at the origin and one side along the positive $x$-axis, lets an angle be any amount of turning, not only up to $180^\\circ$. This is how the trigonometric ratios will be defined for every angle.

Take $320^\\circ$. Turning counterclockwise from the positive $x$-axis, the rotation passes $90^\\circ$, $180^\\circ$ and $270^\\circ$ and stops before $360^\\circ$:

$$270^\\circ < 320^\\circ < 360^\\circ.$$

So the terminal side lies in Quadrant IV, $360^\\circ - 320^\\circ = 40^\\circ$ short of a full turn.`,
    `你已经会用量角器量角，也会在坐标平面上描点。把角放到坐标平面上，顶点在原点、一边沿 $x$ 轴正半轴，角就可以表示任意多的旋转，不再限于 $180^\\circ$ 以内。后面正是用这种方式为所有角定义三角比。

以 $320^\\circ$ 为例。从 $x$ 轴正半轴逆时针旋转，越过 $90^\\circ$、$180^\\circ$、$270^\\circ$，在 $360^\\circ$ 之前停下：

$$270^\\circ < 320^\\circ < 360^\\circ.$$

所以终边在第四象限，比一整圈少 $360^\\circ - 320^\\circ = 40^\\circ$。`,
  ),
  knowledgePoints: [
    {
      id: "quadrants-of-angles",
      figure: trigDrawings["angles-in-the-coordinate-plane#quadrants-of-angles"],
      title: t("The quadrant of an angle", "角所在的象限"),
      explanation: t(
        "An angle is in **standard position** when its vertex is at the origin and its **initial side** lies along the positive $x$-axis. Rotating the other side, the **terminal side**, counterclockwise gives a positive angle. Every $90^\\circ$ of rotation passes one quadrant:\n\n| Angle | Terminal side |\n| :--- | :--- |\n| $0^\\circ < \\theta < 90^\\circ$ | Quadrant I |\n| $90^\\circ < \\theta < 180^\\circ$ | Quadrant II |\n| $180^\\circ < \\theta < 270^\\circ$ | Quadrant III |\n| $270^\\circ < \\theta < 360^\\circ$ | Quadrant IV |\n\nFor example, $200^\\circ$ is between $180^\\circ$ and $270^\\circ$, so its terminal side lies in Quadrant III. An angle that is a multiple of $90^\\circ$, such as $270^\\circ$, has its terminal side on an axis; it is called a **quadrantal angle**.\n\n> **Watch out.** The quadrants are numbered counterclockwise, starting from the upper right. $100^\\circ$ is in Quadrant II, the upper left, not in Quadrant IV.",
        "顶点在原点、**始边**在 $x$ 轴正半轴上的角处于**标准位置**。另一条边叫**终边**，逆时针旋转得到正角。每旋转 $90^\\circ$ 经过一个象限：\n\n| 角 | 终边 |\n| :--- | :--- |\n| $0^\\circ < \\theta < 90^\\circ$ | 第一象限 |\n| $90^\\circ < \\theta < 180^\\circ$ | 第二象限 |\n| $180^\\circ < \\theta < 270^\\circ$ | 第三象限 |\n| $270^\\circ < \\theta < 360^\\circ$ | 第四象限 |\n\n例如 $200^\\circ$ 在 $180^\\circ$ 与 $270^\\circ$ 之间，所以终边在第三象限。$90^\\circ$ 的倍数（如 $270^\\circ$）的终边在坐标轴上，叫做**轴线角**。\n\n> **注意。** 象限按逆时针方向编号，从右上开始。$100^\\circ$ 在第二象限，即左上方，不在第四象限。",
      ),
      generate(rng) {
        const d = rng.bool(0.12) ? 90 * rng.int(1, 3) : randomDegrees(rng, 1, 359);
        return quadrantChoice(d);
      },
    },
    {
      id: "angles-from-the-terminal-side",
      figure: trigDrawings["angles-in-the-coordinate-plane#angles-from-the-terminal-side"],
      title: t("The angle from its terminal side", "由终边求角"),
      explanation: t(
        "To measure an angle in standard position, count the rotation from the positive $x$-axis. The axes are at $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$, so start from the nearest axis the rotation has passed.\n\nIf the terminal side lies in Quadrant II and makes a $35^\\circ$ angle with the negative $x$-axis, it stops $35^\\circ$ short of $180^\\circ$:\n\n$$\\theta = 180^\\circ - 35^\\circ = 145^\\circ.$$\n\nIf it lies in Quadrant III and makes $35^\\circ$ with the negative $x$-axis, it has gone $35^\\circ$ past it: $\\theta = 180^\\circ + 35^\\circ = 215^\\circ$.\n\n> **Watch out.** The given angle is measured from an axis, not from the positive $x$-axis. Add it to or subtract it from that axis's angle; do not give it as the answer.",
        "度量标准位置的角，就是数出从 $x$ 轴正半轴转过的角度。各坐标轴分别在 $0^\\circ$、$90^\\circ$、$180^\\circ$、$270^\\circ$，所以从最近的坐标轴算起。\n\n若终边在第二象限，与 $x$ 轴负半轴成 $35^\\circ$ 角，它比 $180^\\circ$ 少转了 $35^\\circ$：\n\n$$\\theta = 180^\\circ - 35^\\circ = 145^\\circ.$$\n\n若终边在第三象限，与 $x$ 轴负半轴成 $35^\\circ$ 角，它比 $180^\\circ$ 多转了 $35^\\circ$：$\\theta = 180^\\circ + 35^\\circ = 215^\\circ$。\n\n> **注意。** 已知的角是从某条坐标轴量起的，不是从 $x$ 轴正半轴量起的。要把它加到这条轴的角度上或从中减去，不能直接把它当作答案。",
      ),
      generate(rng) {
        const a = randomAxisAngle(rng);
        const axis = axisNames[a.axis]!;
        const other = a.after ? a.axis - a.alpha : a.axis + a.alpha;
        const o = a.after ? a.axis + 90 : a.axis - 90;
        const otherAxis = axisNames[o]!;
        return {
          ...numberProblem({
            prompt: t(
              `The terminal side of an angle $\\theta$ in standard position lies in ${quadrantName(quadrantOfDeg(a.phi) as Quadrant).en} and makes ${article(a.alpha)} $${a.alpha}^\\circ$ angle with ${axis.en}, as shown. Find $\\theta$, where $0^\\circ < \\theta < 360^\\circ$.`,
              `如图，标准位置的角 $\\theta$ 的终边在${quadrantName(quadrantOfDeg(a.phi) as Quadrant)["zh-CN"]}，与 ${axis["zh-CN"]}成 $${a.alpha}^\\circ$ 角。求 $\\theta$（$0^\\circ < \\theta < 360^\\circ$）。`,
            ),
            answer: a.phi,
            form: "integer",
            unit: "°",
            wrong: [mod(other, 360), a.alpha, 360 - a.phi, 90 - a.alpha],
            solution: join(
              label(1, "Locate the axis", "找到坐标轴"),
              t(
                `Turning counterclockwise from the positive $x$-axis, ${axis.en} is at $${a.axis}^\\circ$. The terminal side lies in ${quadrantName(quadrantOfDeg(a.phi) as Quadrant).en}, so it is $${a.alpha}^\\circ$ ${a.after ? "past this axis" : "short of this axis"}.`,
                `从 $x$ 轴正半轴逆时针旋转，${axis["zh-CN"]}在 $${a.axis}^\\circ$。终边在${quadrantName(quadrantOfDeg(a.phi) as Quadrant)["zh-CN"]}，所以它比这条轴${a.after ? "多" : "少"}转 $${a.alpha}^\\circ$。`,
              ),
              para,
              label(2, `${a.after ? "Add" : "Subtract"} the angle`, `${a.after ? "加上" : "减去"}这个角`),
              both(
                a.after ? "Going past the axis adds to its angle:" : "Stopping short of the axis takes away from its angle:",
                a.after ? "越过坐标轴，就在它的角度上加：" : "没到坐标轴，就从它的角度中减：",
                axisAngleLine(a),
              ),
              said(
                `Measure from the other axis of the quadrant, ${otherAxis.en} at $${o}^\\circ$. The terminal side makes $90^\\circ - ${a.alpha}^\\circ = ${90 - a.alpha}^\\circ$ with it, so $\\theta = ${o}^\\circ ${a.after ? "-" : "+"} ${90 - a.alpha}^\\circ = ${a.phi}^\\circ$ again.`,
                `改从这个象限的另一条轴量起，即在 $${o}^\\circ$ 的 ${otherAxis["zh-CN"]}。终边与它成 $90^\\circ - ${a.alpha}^\\circ = ${90 - a.alpha}^\\circ$，所以同样得到 $\\theta = ${o}^\\circ ${a.after ? "-" : "+"} ${90 - a.alpha}^\\circ = ${a.phi}^\\circ$。`,
              ),
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
  intro: t(
    `You can place a positive angle in standard position by turning counterclockwise from the positive $x$-axis. Turning the other way, clockwise, gives a negative angle. Both directions are needed, for example to describe a wheel turning backward or to measure the shorter way round.

Take $-200^\\circ$. Clockwise, the rotation passes $-90^\\circ$ and $-180^\\circ$, then goes $20^\\circ$ further:

$$-270^\\circ < -200^\\circ < -180^\\circ.$$

So the terminal side lies in Quadrant II. Adding a full turn agrees: $-200^\\circ + 360^\\circ = 160^\\circ$, which is in Quadrant II as well.`,
    `你已经会把正角放在标准位置：从 $x$ 轴正半轴逆时针旋转。朝另一个方向，即顺时针旋转，得到的是负角。两个方向都有用，例如描述倒转的车轮，或者沿较短的方向量角。

以 $-200^\\circ$ 为例。顺时针旋转，越过 $-90^\\circ$ 和 $-180^\\circ$，再转 $20^\\circ$：

$$-270^\\circ < -200^\\circ < -180^\\circ.$$

所以终边在第二象限。加上一整圈也一致：$-200^\\circ + 360^\\circ = 160^\\circ$，同样在第二象限。`,
  ),
  knowledgePoints: [
    {
      id: "quadrants-of-negative-angles",
      figure: trigDrawings["negative-angles-in-the-coordinate-plane#quadrants-of-negative-angles"],
      title: t("The quadrant of a negative angle", "负角所在的象限"),
      explanation: t(
        "A **negative angle** rotates the terminal side **clockwise** from the positive $x$-axis. Going clockwise, the quadrants come in the order IV, III, II, I:\n\n| Angle | Terminal side |\n| :--- | :--- |\n| $-90^\\circ < \\theta < 0^\\circ$ | Quadrant IV |\n| $-180^\\circ < \\theta < -90^\\circ$ | Quadrant III |\n| $-270^\\circ < \\theta < -180^\\circ$ | Quadrant II |\n| $-360^\\circ < \\theta < -270^\\circ$ | Quadrant I |\n\nFor example, $-130^\\circ$ is between $-180^\\circ$ and $-90^\\circ$, so its terminal side lies in Quadrant III. Equivalently, a full turn added to $-130^\\circ$ gives $230^\\circ$, which is in Quadrant III.\n\n> **Watch out.** Clockwise the quadrants come in reverse order. $-60^\\circ$ is in Quadrant IV, not Quadrant I.",
        "**负角**让终边从 $x$ 轴正半轴**顺时针**旋转。顺时针转时，依次经过第四、三、二、一象限：\n\n| 角 | 终边 |\n| :--- | :--- |\n| $-90^\\circ < \\theta < 0^\\circ$ | 第四象限 |\n| $-180^\\circ < \\theta < -90^\\circ$ | 第三象限 |\n| $-270^\\circ < \\theta < -180^\\circ$ | 第二象限 |\n| $-360^\\circ < \\theta < -270^\\circ$ | 第一象限 |\n\n例如 $-130^\\circ$ 在 $-180^\\circ$ 与 $-90^\\circ$ 之间，所以终边在第三象限。也可以给 $-130^\\circ$ 加上一整圈得到 $230^\\circ$，它在第三象限。\n\n> **注意。** 顺时针旋转时象限的顺序是反的。$-60^\\circ$ 在第四象限，不在第一象限。",
      ),
      generate(rng) {
        const d = rng.bool(0.12) ? -90 * rng.int(1, 3) : randomDegrees(rng, -359, -1);
        return quadrantChoice(d);
      },
    },
    {
      id: "negative-angles-from-the-terminal-side",
      figure: trigDrawings["negative-angles-in-the-coordinate-plane#negative-angles-from-the-terminal-side"],
      title: t("The negative angle from its terminal side", "由终边求负角"),
      explanation: t(
        "To give a terminal side as a negative angle, count the clockwise rotation from the positive $x$-axis. Clockwise, the axes come at $0^\\circ$, $-90^\\circ$, $-180^\\circ$ and $-270^\\circ$.\n\nIf the terminal side lies in Quadrant III and makes a $40^\\circ$ angle with the negative $y$-axis, the clockwise rotation passes $-90^\\circ$ and goes $40^\\circ$ further:\n\n$$\\theta = -90^\\circ - 40^\\circ = -130^\\circ.$$\n\nThe same terminal side measured counterclockwise is $270^\\circ - 40^\\circ = 230^\\circ$, and indeed $230^\\circ - 360^\\circ = -130^\\circ$.\n\n> **Watch out.** A negative angle grows more negative as it turns further clockwise. Going $40^\\circ$ past $-90^\\circ$ gives $-130^\\circ$, not $-50^\\circ$.",
        "把终边写成负角，就是数出从 $x$ 轴正半轴顺时针转过的角度。顺时针方向上，各坐标轴依次在 $0^\\circ$、$-90^\\circ$、$-180^\\circ$、$-270^\\circ$。\n\n若终边在第三象限，与 $y$ 轴负半轴成 $40^\\circ$ 角，顺时针旋转经过 $-90^\\circ$ 后再转 $40^\\circ$：\n\n$$\\theta = -90^\\circ - 40^\\circ = -130^\\circ.$$\n\n同一条终边逆时针度量是 $270^\\circ - 40^\\circ = 230^\\circ$，而 $230^\\circ - 360^\\circ = -130^\\circ$，两者一致。\n\n> **注意。** 负角顺时针转得越多就越负。越过 $-90^\\circ$ 再转 $40^\\circ$ 得 $-130^\\circ$，不是 $-50^\\circ$。",
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
              `The terminal side of an angle $\\theta$ in standard position lies in ${quadrantName(quadrantOfDeg(a.phi) as Quadrant).en} and makes ${article(a.alpha)} $${a.alpha}^\\circ$ angle with ${axis.en}, as shown. Find $\\theta$, where $-360^\\circ < \\theta < 0^\\circ$.`,
              `如图，标准位置的角 $\\theta$ 的终边在${quadrantName(quadrantOfDeg(a.phi) as Quadrant)["zh-CN"]}，与 ${axis["zh-CN"]}成 $${a.alpha}^\\circ$ 角。求 $\\theta$（$-360^\\circ < \\theta < 0^\\circ$）。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [a.phi, -a.phi, -a.alpha, answer + (a.after ? -2 : 2) * a.alpha],
            solution: join(
              label(1, "Locate the axis clockwise", "顺时针找到坐标轴"),
              t(
                `Clockwise from the positive $x$-axis, the axes come at $0^\\circ$, $-90^\\circ$, $-180^\\circ$, $-270^\\circ$ and $-360^\\circ$. So ${axis.en} is at $${cw}^\\circ$, and the terminal side is $${a.alpha}^\\circ$ ${a.after ? "short of it" : "past it"}.`,
                `从 $x$ 轴正半轴顺时针旋转，各坐标轴依次在 $0^\\circ$、$-90^\\circ$、$-180^\\circ$、$-270^\\circ$、$-360^\\circ$。所以 ${axis["zh-CN"]}在 $${cw}^\\circ$，终边比它${a.after ? "少" : "多"}转 $${a.alpha}^\\circ$。`,
              ),
              para,
              label(2, `${a.after ? "Add" : "Subtract"} the angle`, `${a.after ? "加上" : "减去"}这个角`),
              both(
                `${a.after ? "Turning less far clockwise makes the angle less negative" : "Turning further clockwise makes the angle more negative"}:`,
                `${a.after ? "顺时针少转，角就没那么负" : "顺时针多转，角就更负"}：`,
                line,
              ),
              said(
                `Measured counterclockwise, the same terminal side is $${axisAngleLine(a)}$, and $${answer}^\\circ + 360^\\circ = ${a.phi}^\\circ$ agrees: the two measures differ by one full turn.`,
                `逆时针度量时，同一条终边是 $${axisAngleLine(a)}$，而 $${answer}^\\circ + 360^\\circ = ${a.phi}^\\circ$，两者一致：两个度量相差一整圈。`,
              ),
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
      figure: trigDrawings["negative-angles-in-the-coordinate-plane#negative-and-positive-measures"],
      title: t("Negative and positive measures of one terminal side", "同一终边的负角与正角"),
      explanation: t(
        "A terminal side reached by a counterclockwise rotation of $\\theta$ (with $0^\\circ < \\theta < 360^\\circ$) is also reached clockwise, by the rest of the full turn. So the same terminal side is described by\n\n$$\\theta \\quad \\text{and} \\quad \\theta - 360^\\circ.$$\n\nFor example, $300^\\circ$ and $300^\\circ - 360^\\circ = -60^\\circ$ have the same terminal side. Going the other way, $-110^\\circ$ and $-110^\\circ + 360^\\circ = 250^\\circ$ have the same terminal side.\n\n> **Watch out.** Changing the direction is not the same as changing the sign. The clockwise measure of $300^\\circ$ is $300^\\circ - 360^\\circ = -60^\\circ$, not $-300^\\circ$.",
        "逆时针旋转 $\\theta$（$0^\\circ < \\theta < 360^\\circ$）得到的终边，也可以顺时针旋转一整圈剩下的部分得到。所以同一条终边可以写成\n\n$$\\theta \\quad \\text{和} \\quad \\theta - 360^\\circ.$$\n\n例如 $300^\\circ$ 与 $300^\\circ - 360^\\circ = -60^\\circ$ 的终边相同。反过来，$-110^\\circ$ 与 $-110^\\circ + 360^\\circ = 250^\\circ$ 的终边相同。\n\n> **注意。** 改变方向不等于改变符号。$300^\\circ$ 的顺时针度量是 $300^\\circ - 360^\\circ = -60^\\circ$，不是 $-300^\\circ$。",
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
            solution: join(
              label(1, "Go the other way", "改变旋转方向"),
              t(
                `A counterclockwise turn of $${d}^\\circ$ leaves $360^\\circ - ${d}^\\circ = ${360 - d}^\\circ$ of the full turn. Turning that much clockwise reaches the same terminal side.`,
                `逆时针转 $${d}^\\circ$ 后，一整圈还剩 $360^\\circ - ${d}^\\circ = ${360 - d}^\\circ$。顺时针转这么多，到达的是同一条终边。`,
              ),
              para,
              label(2, "Write it as a negative angle", "写成负角"),
              both(
                "A clockwise turn is negative, which is the same as subtracting $360^\\circ$:",
                "顺时针旋转的角是负的，相当于减去 $360^\\circ$：",
                `${d}^\\circ - 360^\\circ = ${d - 360}^\\circ`,
              ),
              said(
                `Adding the full turn back gives $${d - 360}^\\circ + 360^\\circ = ${d}^\\circ$, and $${d - 360}^\\circ$ is between $-360^\\circ$ and $0^\\circ$.`,
                `再加回一整圈得 $${d - 360}^\\circ + 360^\\circ = ${d}^\\circ$，并且 $${d - 360}^\\circ$ 在 $-360^\\circ$ 与 $0^\\circ$ 之间。`,
              ),
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
          solution: join(
            label(1, "Go the other way", "改变旋转方向"),
            t(
              `A clockwise turn of $${d}^\\circ$ leaves $360^\\circ - ${d}^\\circ = ${360 - d}^\\circ$ of the full turn. Turning that much counterclockwise reaches the same terminal side.`,
              `顺时针转 $${d}^\\circ$ 后，一整圈还剩 $360^\\circ - ${d}^\\circ = ${360 - d}^\\circ$。逆时针转这么多，到达的是同一条终边。`,
            ),
            para,
            label(2, "Write it as a positive angle", "写成正角"),
            both(
              "A counterclockwise turn is positive, which is the same as adding $360^\\circ$:",
              "逆时针旋转的角是正的，相当于加上 $360^\\circ$：",
              `${-d}^\\circ + 360^\\circ = ${360 - d}^\\circ`,
            ),
            said(
              `Subtracting the full turn gives back $${360 - d}^\\circ - 360^\\circ = ${-d}^\\circ$, and $${360 - d}^\\circ$ is between $0^\\circ$ and $360^\\circ$.`,
              `再减去一整圈得回 $${360 - d}^\\circ - 360^\\circ = ${-d}^\\circ$，并且 $${360 - d}^\\circ$ 在 $0^\\circ$ 与 $360^\\circ$ 之间。`,
            ),
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
  encompasses: [{ topic: "negative-angles-in-the-coordinate-plane", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You can place positive and negative angles in standard position, and you know that radians measure a full turn as $2\\pi$. An angle can also turn more than once around. Angles that end on the same terminal side are coterminal, and replacing an angle by its coterminal angle in one turn makes any angle easy to place.

Take $1000^\\circ$. Two full turns are $720^\\circ$ and three are $1080^\\circ$, too many, so subtract two:

$$1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ.$$

So $1000^\\circ$ ends where $280^\\circ$ does, in Quadrant IV.`,
    `你已经会把正角和负角放在标准位置，也知道用弧度表示时一整圈是 $2\\pi$。角还可以转不止一圈。终边相同的角叫做终边相同的角；把一个角换成一圈之内与它终边相同的角，任何角都容易定位。

以 $1000^\\circ$ 为例。两整圈是 $720^\\circ$，三整圈是 $1080^\\circ$，太多了，所以减去两圈：

$$1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ.$$

所以 $1000^\\circ$ 的终边与 $280^\\circ$ 相同，在第四象限。`,
  ),
  knowledgePoints: [
    {
      id: "coterminal-angles-in-degrees",
      figure: trigDrawings["coterminal-angles#coterminal-angles-in-degrees"],
      title: t("Coterminal angles in degrees", "角度制下终边相同的角"),
      explanation: t(
        "Angles in standard position with the same terminal side are **coterminal**. A full turn of $360^\\circ$ brings the terminal side back to where it was, so the angles coterminal with $\\theta$ are\n\n$$\\theta + 360^\\circ k \\quad \\text{for any integer } k.$$\n\nAn angle may rotate more than once: $850^\\circ$ is two full turns and $130^\\circ$ more. To find the coterminal angle between $0^\\circ$ and $360^\\circ$, subtract (or add) $360^\\circ$ as many times as needed:\n\n$$850^\\circ - 2 \\cdot 360^\\circ = 130^\\circ, \\qquad -500^\\circ + 2 \\cdot 360^\\circ = 220^\\circ.$$\n\n> **Watch out.** Removing one full turn is not always enough. Keep adding or subtracting $360^\\circ$ until the angle is between $0^\\circ$ and $360^\\circ$.",
        "处于标准位置且终边相同的角叫做**终边相同的角**。转一整圈 $360^\\circ$ 终边回到原处，所以与 $\\theta$ 终边相同的角是\n\n$$\\theta + 360^\\circ k \\quad (k \\text{ 为任意整数}).$$\n\n角可以转不止一圈：$850^\\circ$ 是转两整圈后再转 $130^\\circ$。要求 $0^\\circ$ 到 $360^\\circ$ 之间与它终边相同的角，就按需要多次减去（或加上）$360^\\circ$：\n\n$$850^\\circ - 2 \\cdot 360^\\circ = 130^\\circ, \\qquad -500^\\circ + 2 \\cdot 360^\\circ = 220^\\circ.$$\n\n> **注意。** 去掉一整圈不一定够。要一直加上或减去 $360^\\circ$，直到角落在 $0^\\circ$ 与 $360^\\circ$ 之间。",
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
          solution: join(
            label(1, "Count the full turns", "数整圈"),
            turns > 0
              ? t(
                  `$${d}^\\circ$ is more than $360^\\circ$. Since $${360 * turns}^\\circ \\le ${d}^\\circ < ${360 * (turns + 1)}^\\circ$, it holds $${turns}$ full turn${turns === 1 ? "" : "s"} too many.`,
                  `$${d}^\\circ$ 超过 $360^\\circ$。因为 $${360 * turns}^\\circ \\le ${d}^\\circ < ${360 * (turns + 1)}^\\circ$，它多了 $${turns}$ 整圈。`,
                )
              : t(
                  `$${d}^\\circ$ is negative. Since $${360 * turns}^\\circ \\le ${d}^\\circ < ${360 * (turns + 1)}^\\circ$, it needs $${-turns}$ full turn${turns === -1 ? "" : "s"} added to reach $0^\\circ$ to $360^\\circ$.`,
                  `$${d}^\\circ$ 是负角。因为 $${360 * turns}^\\circ \\le ${d}^\\circ < ${360 * (turns + 1)}^\\circ$，要加上 $${-turns}$ 整圈才能落在 $0^\\circ$ 到 $360^\\circ$ 之间。`,
                ),
            para,
            label(2, `${turns > 0 ? "Subtract" : "Add"} the full turns`, `${turns > 0 ? "减去" : "加上"}整圈`),
            both("Full turns do not move the terminal side:", "整圈不改变终边：", line),
            said(
              `The answer $${m}^\\circ$ is between $0^\\circ$ and $360^\\circ$, and it differs from the given angle by a whole number of turns: $${d}^\\circ - ${m}^\\circ = ${d - m}^\\circ = ${turns} \\cdot 360^\\circ$.`,
              `答案 $${m}^\\circ$ 在 $0^\\circ$ 与 $360^\\circ$ 之间，并且与已知角相差整数圈：$${d}^\\circ - ${m}^\\circ = ${d - m}^\\circ = ${turns} \\cdot 360^\\circ$。`,
            ),
          ),
        });
      },
    },
    {
      id: "coterminal-angles-in-radians",
      figure: trigDrawings["coterminal-angles#coterminal-angles-in-radians"],
      title: t("Coterminal angles in radians", "弧度制下终边相同的角"),
      explanation: t(
        "In radians a full turn is $2\\pi$, so the angles coterminal with $\\theta$ are $\\theta + 2\\pi k$. Write $2\\pi$ with the same denominator as the angle before adding or subtracting.\n\nFor $\\frac{17\\pi}{6}$: $2\\pi = \\frac{12\\pi}{6}$, so\n\n$$\\frac{17\\pi}{6} - \\frac{12\\pi}{6} = \\frac{5\\pi}{6}.$$\n\nThis is between $0$ and $2\\pi$. For $-\\frac{3\\pi}{4}$: $-\\frac{3\\pi}{4} + \\frac{8\\pi}{4} = \\frac{5\\pi}{4}$.\n\n> **Watch out.** A full turn is $2\\pi$, not $\\pi$. Subtracting $\\pi$ gives the opposite terminal side.",
        "用弧度表示时一整圈是 $2\\pi$，所以与 $\\theta$ 终边相同的角是 $\\theta + 2\\pi k$。加减之前先把 $2\\pi$ 写成与角同分母的形式。\n\n对 $\\frac{17\\pi}{6}$：$2\\pi = \\frac{12\\pi}{6}$，所以\n\n$$\\frac{17\\pi}{6} - \\frac{12\\pi}{6} = \\frac{5\\pi}{6},$$\n\n它在 $0$ 与 $2\\pi$ 之间。对 $-\\frac{3\\pi}{4}$：$-\\frac{3\\pi}{4} + \\frac{8\\pi}{4} = \\frac{5\\pi}{4}$。\n\n> **注意。** 一整圈是 $2\\pi$，不是 $\\pi$。减去 $\\pi$ 得到的是方向相反的终边。",
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
          join(
            label(1, "Write the full turns over the same denominator", "把整圈写成同分母"),
            t(
              `A full turn is $2\\pi = \\frac{${2 * n}\\pi}{${n}}$. The angle $${piTex(q(k, n))}$ ${turns > 0 ? `has $${turns}$ full turn${turns === 1 ? "" : "s"} too many` : `needs $${-turns}$ full turn${turns === -1 ? "" : "s"} added`}, which is $${full}$.`,
              `一整圈是 $2\\pi = \\frac{${2 * n}\\pi}{${n}}$。角 $${piTex(q(k, n))}$ ${turns > 0 ? `多了 $${turns}$ 整圈` : `要加上 $${-turns}$ 整圈`}，即 $${full}$。`,
            ),
            para,
            label(2, `${turns > 0 ? "Subtract" : "Add"} the full turns`, `${turns > 0 ? "减去" : "加上"}整圈`),
            both("Full turns do not move the terminal side:", "整圈不改变终边：", line),
            said(
              `Count in units of $\\frac{\\pi}{${n}}$: $${k} ${turns > 0 ? "-" : "+"} ${2 * n * Math.abs(turns)} = ${m}$, and $0 \\le ${m} < ${2 * n}$, so $${answer}$ is between $0$ and $2\\pi$.`,
              `以 $\\frac{\\pi}{${n}}$ 为单位计数：$${k} ${turns > 0 ? "-" : "+"} ${2 * n * Math.abs(turns)} = ${m}$，且 $0 \\le ${m} < ${2 * n}$，所以 $${answer}$ 在 $0$ 与 $2\\pi$ 之间。`,
            ),
          ),
          [piTex(q(mod(-k, 2 * n), n)), piTex(q(k > 0 ? k - 2 * n : k + 2 * n, n)), piTex(q(mod(m + n, 2 * n), n))],
        );
      },
    },
    {
      id: "testing-for-coterminal-angles",
      figure: trigDrawings["coterminal-angles#testing-for-coterminal-angles"],
      title: t("Are two angles coterminal?", "两个角的终边是否相同"),
      explanation: t(
        "Two angles are coterminal exactly when they differ by a whole number of full turns. Subtract them and check whether the difference is a multiple of $360^\\circ$:\n\n- $-250^\\circ$ and $830^\\circ$: $830^\\circ - (-250^\\circ) = 1080^\\circ = 3 \\cdot 360^\\circ$, so they are coterminal.\n- $100^\\circ$ and $460^\\circ$: $460^\\circ - 100^\\circ = 360^\\circ$, so they are coterminal.\n- $45^\\circ$ and $225^\\circ$: the difference is $180^\\circ$, half a turn, so their terminal sides point in opposite directions and they are not coterminal.\n\n> **Watch out.** A difference of $180^\\circ$, or any odd multiple of it, is half a turn too many. Such angles point in opposite directions and are not coterminal.",
        "两个角终边相同，当且仅当它们相差整数圈。把两个角相减，看差是否为 $360^\\circ$ 的倍数：\n\n- $-250^\\circ$ 与 $830^\\circ$：$830^\\circ - (-250^\\circ) = 1080^\\circ = 3 \\cdot 360^\\circ$，终边相同。\n- $100^\\circ$ 与 $460^\\circ$：$460^\\circ - 100^\\circ = 360^\\circ$，终边相同。\n- $45^\\circ$ 与 $225^\\circ$：差为 $180^\\circ$，即半圈，终边方向相反，终边不同。\n\n> **注意。** 相差 $180^\\circ$ 或它的奇数倍，就是多了半圈。这样的两个角方向相反，终边不同。",
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
          solution: join(
            label(1, "Find the difference", "求两角之差"),
            both("Subtract the angles:", "把两个角相减：", line),
            para,
            label(2, "Compare with a full turn", "与整圈比较"),
            yes
              ? t(
                  `$${diff}^\\circ \\div 360^\\circ = ${diff / 360}$, a whole number of full turns. So the angles are coterminal.`,
                  `$${diff}^\\circ \\div 360^\\circ = ${diff / 360}$，是整数圈。所以两角终边相同。`,
                )
              : t(
                  `$${diff}^\\circ \\div 360^\\circ$ is not a whole number, so the difference is not a multiple of $360^\\circ$. So the angles are not coterminal.`,
                  `$${diff}^\\circ \\div 360^\\circ$ 不是整数，差不是 $360^\\circ$ 的倍数。所以两角终边不同。`,
                ),
            said(
              `Bring each angle into one turn: $${a}^\\circ$ is coterminal with $${mod(a, 360)}^\\circ$ and $${b}^\\circ$ with $${mod(b, 360)}^\\circ$. These are ${yes ? "equal" : "different"}, so the terminal sides are ${yes ? "the same" : "different"}.`,
              `把每个角化到一圈之内：$${a}^\\circ$ 与 $${mod(a, 360)}^\\circ$ 终边相同，$${b}^\\circ$ 与 $${mod(b, 360)}^\\circ$ 终边相同。两者${yes ? "相等" : "不等"}，所以终边${yes ? "相同" : "不同"}。`,
            ),
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
  encompasses: [],
  xp: 13,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You can bring any angle into one turn and name the quadrant of its terminal side. The reference angle measures how far the terminal side is from the $x$-axis, as an acute angle. It is what lets the ratios of any angle be found from the ratios of an acute angle.

Take $140^\\circ$. It is in Quadrant II, so the nearer half of the $x$-axis is the negative half, at $180^\\circ$:

$$180^\\circ - 140^\\circ = 40^\\circ.$$

The reference angle is $40^\\circ$.`,
    `你已经会把任意角化到一圈之内，并说出终边所在的象限。参考角用一个锐角表示终边离 $x$ 轴有多远。正是它让任意角的三角比可以由锐角的三角比求出。

以 $140^\\circ$ 为例。它在第二象限，较近的 $x$ 半轴是负半轴，在 $180^\\circ$：

$$180^\\circ - 140^\\circ = 40^\\circ.$$

参考角是 $40^\\circ$。`,
  ),
  knowledgePoints: [
    {
      id: "reference-angles-in-degrees",
      figure: trigDrawings["calculating-reference-angles#reference-angles-in-degrees"],
      title: t("Reference angles in degrees", "角度制下的参考角"),
      explanation: t(
        `The **reference angle** of an angle in standard position is the acute angle between its terminal side and the nearer half of the $x$-axis. It depends on the quadrant, for $0^\\circ < \\theta < 360^\\circ$:\n\n${referenceTable.en}\n\nFor example, $230^\\circ$ is in Quadrant III, $50^\\circ$ past the negative $x$-axis, so its reference angle is $230^\\circ - 180^\\circ = 50^\\circ$. And $300^\\circ$ is in Quadrant IV, so its reference angle is $360^\\circ - 300^\\circ = 60^\\circ$.\n\n> **Watch out.** In Quadrant IV subtract the angle from $360^\\circ$, not from $180^\\circ$: $180^\\circ - 300^\\circ$ is negative, and a reference angle is always acute.`,
        `标准位置的角的**参考角**是它的终边与 $x$ 轴（较近的半轴）所成的锐角。对 $0^\\circ < \\theta < 360^\\circ$，按象限计算：\n\n${referenceTable["zh-CN"]}\n\n例如 $230^\\circ$ 在第三象限，比 $x$ 轴负半轴多转 $50^\\circ$，所以参考角是 $230^\\circ - 180^\\circ = 50^\\circ$。$300^\\circ$ 在第四象限，参考角是 $360^\\circ - 300^\\circ = 60^\\circ$。\n\n> **注意。** 在第四象限要用 $360^\\circ$ 减去这个角，而不是用 $180^\\circ$ 减：$180^\\circ - 300^\\circ$ 是负的，而参考角总是锐角。`,
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
          solution: referenceSolution(a),
        });
      },
    },
    {
      id: "reference-angles-of-negative-and-large-angles",
      figure: trigDrawings["calculating-reference-angles#reference-angles-of-negative-and-large-angles"],
      title: t("Reference angles of negative and large angles", "负角与大角的参考角"),
      explanation: t(
        "For an angle outside $0^\\circ$ to $360^\\circ$, first find the coterminal angle in that range; it has the same terminal side, so the same reference angle.\n\nFor $-140^\\circ$: $-140^\\circ + 360^\\circ = 220^\\circ$, in Quadrant III, so the reference angle is $220^\\circ - 180^\\circ = 40^\\circ$. For $835^\\circ$: $835^\\circ - 2 \\cdot 360^\\circ = 115^\\circ$, in Quadrant II, so the reference angle is $180^\\circ - 115^\\circ = 65^\\circ$.\n\n> **Watch out.** The reference angle of a negative angle is never negative. For $-140^\\circ$ it is $40^\\circ$, found from the coterminal angle $220^\\circ$.",
        "对于不在 $0^\\circ$ 到 $360^\\circ$ 之间的角，先求这个范围内与它终边相同的角；终边相同，参考角也相同。\n\n对 $-140^\\circ$：$-140^\\circ + 360^\\circ = 220^\\circ$，在第三象限，参考角是 $220^\\circ - 180^\\circ = 40^\\circ$。对 $835^\\circ$：$835^\\circ - 2 \\cdot 360^\\circ = 115^\\circ$，在第二象限，参考角是 $180^\\circ - 115^\\circ = 65^\\circ$。\n\n> **注意。** 负角的参考角也不会是负的。$-140^\\circ$ 的参考角是 $40^\\circ$，由与它终边相同的 $220^\\circ$ 求出。",
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
          solution: referenceSolution(a),
        });
      },
    },
    {
      id: "reference-angles-in-radians",
      figure: trigDrawings["calculating-reference-angles#reference-angles-in-radians"],
      title: t("Reference angles in radians", "弧度制下的参考角"),
      explanation: t(
        "In radians the axes are at $0$, $\\frac{\\pi}{2}$, $\\pi$, $\\frac{3\\pi}{2}$ and $2\\pi$, and the reference angle is found the same way, with $\\pi$ for $180^\\circ$ and $2\\pi$ for $360^\\circ$.\n\nFor $\\frac{7\\pi}{6}$: it is more than $\\pi = \\frac{6\\pi}{6}$ and less than $\\frac{3\\pi}{2} = \\frac{9\\pi}{6}$, so it is in Quadrant III, and its reference angle is $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$. For $\\frac{5\\pi}{3}$, in Quadrant IV, it is $2\\pi - \\frac{5\\pi}{3} = \\frac{\\pi}{3}$.\n\n> **Watch out.** The reference angle is measured to the $x$-axis, never to the $y$-axis. For $\\frac{2\\pi}{3}$ it is $\\pi - \\frac{2\\pi}{3} = \\frac{\\pi}{3}$, not $\\frac{2\\pi}{3} - \\frac{\\pi}{2} = \\frac{\\pi}{6}$.",
        "用弧度表示时，各坐标轴在 $0$、$\\frac{\\pi}{2}$、$\\pi$、$\\frac{3\\pi}{2}$、$2\\pi$，参考角的求法相同，只是用 $\\pi$ 代替 $180^\\circ$，用 $2\\pi$ 代替 $360^\\circ$。\n\n对 $\\frac{7\\pi}{6}$：它大于 $\\pi = \\frac{6\\pi}{6}$、小于 $\\frac{3\\pi}{2} = \\frac{9\\pi}{6}$，在第三象限，参考角是 $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$。$\\frac{5\\pi}{3}$ 在第四象限，参考角是 $2\\pi - \\frac{5\\pi}{3} = \\frac{\\pi}{3}$。\n\n> **注意。** 参考角是到 $x$ 轴的角，不是到 $y$ 轴的角。$\\frac{2\\pi}{3}$ 的参考角是 $\\pi - \\frac{2\\pi}{3} = \\frac{\\pi}{3}$，不是 $\\frac{2\\pi}{3} - \\frac{\\pi}{2} = \\frac{\\pi}{6}$。",
      ),
      generate(rng) {
        const [k, n] = randomPi(rng, 0, 2);
        const a = piInfo(k, n);
        const r = Math.round((a.ref * n) / 180);
        return piProblem(
          t(`Find the reference angle of $${a.tex}$.${PI_EN}`, `求 $${a.tex}$ 的参考角。${PI_ZH}`),
          a.refTex,
          referenceSolution(a),
          [a.tex, piTex(q(n - r, n)), piTex(q(2 * n - k, n)), `${a.ref}`],
        );
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
  encompasses: [{ topic: "special-trigonometric-ratios", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You know the trigonometric ratios of a right triangle, the special values for $30^\\circ$, $45^\\circ$ and $60^\\circ$, and the equation $x^2 + y^2 = r^2$ of a circle centered at the origin. On the circle of radius $1$, the hypotenuse is $1$, so the sine and cosine become plain coordinates. This is the first step to defining the ratios for every angle.

Take $60^\\circ$. Its terminal side meets the unit circle at a point whose coordinates are the legs of a right triangle with hypotenuse $1$:

$$P = (\\cos 60^\\circ, \\sin 60^\\circ) = \\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right).$$

The point is on the circle: $\\frac{1}{4} + \\frac{3}{4} = 1$.`,
    `你已经知道直角三角形的三角比、$30^\\circ$、$45^\\circ$、$60^\\circ$ 的特殊值，以及圆心在原点的圆的方程 $x^2 + y^2 = r^2$。在半径为 $1$ 的圆上，斜边是 $1$，所以正弦和余弦就成了坐标。这是为所有角定义三角比的第一步。

以 $60^\\circ$ 为例。它的终边与单位圆交于一点，这点的坐标是斜边为 $1$ 的直角三角形的两条直角边：

$$P = (\\cos 60^\\circ, \\sin 60^\\circ) = \\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right).$$

这个点在圆上：$\\frac{1}{4} + \\frac{3}{4} = 1$。`,
  ),
  knowledgePoints: [
    {
      id: "coordinates-on-the-unit-circle",
      figure: trigDrawings["properties-of-the-unit-circle-in-the-first-quadrant#coordinates-on-the-unit-circle"],
      title: t("Coordinates from the angle", "由角求坐标"),
      explanation: t(
        "The **unit circle** is the circle of radius $1$ centered at the origin, $x^2 + y^2 = 1$. Let the terminal side of an acute angle $\\theta$ meet it at $P(x, y)$. Dropping a perpendicular from $P$ to the $x$-axis makes a right triangle with hypotenuse $OP = 1$, legs $x$ and $y$, and the angle $\\theta$ at $O$. So\n\n$$\\cos \\theta = \\frac{x}{1} = x, \\qquad \\sin \\theta = \\frac{y}{1} = y.$$\n\nThat is, $P = (\\cos \\theta, \\sin \\theta)$. For example, at $\\theta = 25^\\circ$, a calculator in degree mode gives $P \\approx (0.91, 0.42)$, since $\\cos 25^\\circ \\approx 0.9063$ and $\\sin 25^\\circ \\approx 0.4226$.\n\n> **Watch out.** The $x$-coordinate is the cosine and the $y$-coordinate is the sine, in that order. And set the calculator to degree mode: in radian mode $\\cos 25$ is about $0.99$.",
        "**单位圆**是圆心在原点、半径为 $1$ 的圆，$x^2 + y^2 = 1$。设锐角 $\\theta$ 的终边与它交于 $P(x, y)$。从 $P$ 向 $x$ 轴作垂线，得到一个直角三角形：斜边 $OP = 1$，两直角边为 $x$ 和 $y$，$O$ 处的角为 $\\theta$。所以\n\n$$\\cos \\theta = \\frac{x}{1} = x, \\qquad \\sin \\theta = \\frac{y}{1} = y,$$\n\n即 $P = (\\cos \\theta, \\sin \\theta)$。例如 $\\theta = 25^\\circ$ 时，计算器（角度模式）给出 $\\cos 25^\\circ \\approx 0.9063$、$\\sin 25^\\circ \\approx 0.4226$，所以 $P \\approx (0.91, 0.42)$。\n\n> **注意。** $x$ 坐标是余弦，$y$ 坐标是正弦，顺序不能颠倒。还要把计算器设为角度模式：在弧度模式下 $\\cos 25$ 约为 $0.99$。",
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
              solution: join(
                label(1, "Name the coordinate", "写出坐标"),
                t(
                  `On the unit circle the point on the terminal side is $P = (\\cos ${d}^\\circ, \\sin ${d}^\\circ)$. So its $${coord}$-coordinate is $\\${f} ${d}^\\circ$.`,
                  `在单位圆上，终边上的点是 $P = (\\cos ${d}^\\circ, \\sin ${d}^\\circ)$。所以它的 $${coord}$ 坐标是 $\\${f} ${d}^\\circ$。`,
                ),
                para,
                label(2, "Use a calculator", "用计算器"),
                both(
                  "In degree mode, then round to the nearest hundredth:",
                  "用角度模式计算，再精确到百分位：",
                  `\\${f} ${d}^\\circ \\approx ${dec(roundQ(v, 4))} \\approx ${dec(answer)}`,
                ),
                said(
                  `$P$ must lie on the unit circle: $\\cos ${d}^\\circ \\approx ${dec(roundQ(Math.cos(rad(d)), 4))}$ and $\\sin ${d}^\\circ \\approx ${dec(roundQ(Math.sin(rad(d)), 4))}$ give $x^2 + y^2 \\approx 1$. And the angle is acute, so the coordinate is between $0$ and $1$.`,
                  `$P$ 必须在单位圆上：$\\cos ${d}^\\circ \\approx ${dec(roundQ(Math.cos(rad(d)), 4))}$，$\\sin ${d}^\\circ \\approx ${dec(roundQ(Math.sin(rad(d)), 4))}$，确实 $x^2 + y^2 \\approx 1$。而且角是锐角，所以坐标在 $0$ 与 $1$ 之间。`,
                ),
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
      figure: trigDrawings["properties-of-the-unit-circle-in-the-first-quadrant#ratios-from-a-point-in-the-first-quadrant"],
      title: t("Ratios from a point on the unit circle", "由单位圆上的点求三角比"),
      explanation: t(
        "Read the ratios off the point: if the terminal side of $\\theta$ meets the unit circle at $P(x, y)$, then $\\cos \\theta = x$, $\\sin \\theta = y$, and\n\n$$\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{y}{x}.$$\n\nFor $P\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$: $\\cos \\theta = \\frac{5}{13}$, $\\sin \\theta = \\frac{12}{13}$ and $\\tan \\theta = \\frac{12}{13} \\div \\frac{5}{13} = \\frac{12}{5}$.\n\n> **Watch out.** The tangent is $\\frac{y}{x}$, not $\\frac{x}{y}$. For $\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$ it is $\\frac{12}{5}$, not $\\frac{5}{12}$.",
        "直接从点读出三角比：若 $\\theta$ 的终边与单位圆交于 $P(x, y)$，则 $\\cos \\theta = x$，$\\sin \\theta = y$，且\n\n$$\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}} = \\frac{y}{x}.$$\n\n对 $P\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$：$\\cos \\theta = \\frac{5}{13}$，$\\sin \\theta = \\frac{12}{13}$，$\\tan \\theta = \\frac{12}{13} \\div \\frac{5}{13} = \\frac{12}{5}$。\n\n> **注意。** 正切是 $\\frac{y}{x}$，不是 $\\frac{x}{y}$。对 $\\left(\\frac{5}{13}, \\frac{12}{13}\\right)$，正切是 $\\frac{12}{5}$，不是 $\\frac{5}{12}$。",
      ),
      generate: (rng) => pointRatioProblem(rng, [1]),
    },
    {
      id: "the-missing-coordinate",
      figure: trigDrawings["properties-of-the-unit-circle-in-the-first-quadrant#the-missing-coordinate"],
      title: t("The missing coordinate", "求另一个坐标"),
      explanation: t(
        "A point on the unit circle satisfies $x^2 + y^2 = 1$, so one coordinate gives the other. In the first quadrant both are positive.\n\nIf $P$ is in the first quadrant with $x = \\frac{1}{3}$, then\n\n$$y = \\sqrt{1 - \\left(\\frac{1}{3}\\right)^2} = \\sqrt{\\frac{8}{9}} = \\frac{2\\sqrt{2}}{3}.$$\n\n> **Watch out.** Square before subtracting from $1$. For $x = \\frac{1}{3}$, $y$ is not $1 - \\frac{1}{3} = \\frac{2}{3}$ but $\\sqrt{1 - \\frac{1}{9}}$.",
        "单位圆上的点满足 $x^2 + y^2 = 1$，所以由一个坐标可以求出另一个。在第一象限两者都是正的。\n\n若 $P$ 在第一象限且 $x = \\frac{1}{3}$，则\n\n$$y = \\sqrt{1 - \\left(\\frac{1}{3}\\right)^2} = \\sqrt{\\frac{8}{9}} = \\frac{2\\sqrt{2}}{3}.$$\n\n> **注意。** 要先平方再用 $1$ 去减。对 $x = \\frac{1}{3}$，$y$ 不是 $1 - \\frac{1}{3} = \\frac{2}{3}$，而是 $\\sqrt{1 - \\frac{1}{9}}$。",
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
            solution: join(
              label(1, "Use the circle's equation", "用圆的方程"),
              both(
                `Every point on the unit circle satisfies $x^2 + y^2 = 1$. Put in $${known} = \\frac{${p}}{${d}}$:`,
                `单位圆上的每个点都满足 $x^2 + y^2 = 1$。代入 $${known} = \\frac{${p}}{${d}}$：`,
                `${ask}^2 = 1 - \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}}`,
              ),
              para,
              label(2, "Take the positive root", "取正的平方根"),
              both(
                "$P$ is in the first quadrant, so both coordinates are positive:",
                "$P$ 在第一象限，两个坐标都是正的：",
                `${ask} = ${sqrtLine(p, d)}`,
              ),
              said(
                `Square back to see that $P$ is on the unit circle: $\\left(${texS(answer)}\\right)^2 + \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$.`,
                `平方回去，可见 $P$ 确实在单位圆上：$\\left(${texS(answer)}\\right)^2 + \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$。`,
              ),
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
  encompasses: [{ topic: "properties-of-the-unit-circle-in-the-first-quadrant", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You know that in the first quadrant the point on the unit circle is $(\\cos \\theta, \\sin \\theta)$, and you can find reference angles. Using the coordinates as the definition for every angle extends sine, cosine and tangent beyond $90^\\circ$, with signs that come from the quadrant. This is what lets trigonometry describe rotation all the way round.

Take $150^\\circ$. Its reference angle is $30^\\circ$, so its point is the mirror image of $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$ across the $y$-axis:

$$\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right).$$

So $\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$ and $\\sin 150^\\circ = \\frac{1}{2}$.`,
    `你已经知道在第一象限，单位圆上的点是 $(\\cos \\theta, \\sin \\theta)$，也会求参考角。把坐标作为所有角的定义，就把正弦、余弦、正切推广到 $90^\\circ$ 以外，符号由象限决定。这让三角函数能够描述整圈的旋转。

以 $150^\\circ$ 为例。它的参考角是 $30^\\circ$，所以它的点是 $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$ 关于 $y$ 轴的对称点：

$$\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right).$$

所以 $\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$，$\\sin 150^\\circ = \\frac{1}{2}$。`,
  ),
  knowledgePoints: [
    {
      id: "ratios-from-a-point-in-any-quadrant",
      figure: trigDrawings["extending-the-trigonometric-ratios-using-the-unit-circle#ratios-from-a-point-in-any-quadrant"],
      title: t("Ratios from a point in any quadrant", "由任意象限中的点求三角比"),
      explanation: t(
        "For any angle $\\theta$ in standard position, let its terminal side meet the unit circle at $P(x, y)$. We **define**\n\n$$\\cos \\theta = x, \\qquad \\sin \\theta = y, \\qquad \\tan \\theta = \\frac{y}{x} \\ (x \\ne 0).$$\n\nFor acute angles this agrees with the right-triangle ratios; for other angles the coordinates, and so the ratios, may be negative. For $P\\left(-\\frac{3}{5}, -\\frac{4}{5}\\right)$:\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = -\\frac{4}{5}, \\qquad \\tan \\theta = \\frac{-\\frac{4}{5}}{-\\frac{3}{5}} = \\frac{4}{3}.$$\n\n> **Watch out.** Keep the signs of the coordinates. In Quadrant II, $x < 0$, so the cosine and the tangent are negative there.",
        "对标准位置的任意角 $\\theta$，设其终边与单位圆交于 $P(x, y)$。我们**定义**\n\n$$\\cos \\theta = x, \\qquad \\sin \\theta = y, \\qquad \\tan \\theta = \\frac{y}{x} \\ (x \\ne 0).$$\n\n对锐角，这与直角三角形中的三角比一致；对其他角，坐标可能为负，三角比也可能为负。对 $P\\left(-\\frac{3}{5}, -\\frac{4}{5}\\right)$：\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = -\\frac{4}{5}, \\qquad \\tan \\theta = \\frac{-\\frac{4}{5}}{-\\frac{3}{5}} = \\frac{4}{3}.$$\n\n> **注意。** 要保留坐标的符号。在第二象限 $x < 0$，所以那里余弦和正切都是负的。",
      ),
      generate: (rng) => pointRatioProblem(rng, [2, 3, 4]),
    },
    {
      id: "signs-of-the-ratios",
      title: t("Signs of the ratios by quadrant", "各象限中三角比的符号"),
      explanation: t(
        "The signs of $x$ and $y$ in each quadrant give the signs of the ratios:\n\n| | I | II | III | IV |\n| :--- | :---: | :---: | :---: | :---: |\n| $\\sin \\theta = y$ | $+$ | $+$ | $-$ | $-$ |\n| $\\cos \\theta = x$ | $+$ | $-$ | $-$ | $+$ |\n| $\\tan \\theta = \\frac{y}{x}$ | $+$ | $-$ | $+$ | $-$ |\n\nSo all ratios are positive in Quadrant I, only sine in II, only tangent in III and only cosine in IV. For example, $\\cos 250^\\circ$ is negative, since $250^\\circ$ is in Quadrant III, where $x < 0$.\n\n> **Watch out.** The tangent is positive where $x$ and $y$ have the same sign, which is in Quadrants I and III. It is negative in Quadrant II even though the sine is positive there.",
        "各象限中 $x$、$y$ 的符号决定了三角比的符号：\n\n| | 一 | 二 | 三 | 四 |\n| :--- | :---: | :---: | :---: | :---: |\n| $\\sin \\theta = y$ | $+$ | $+$ | $-$ | $-$ |\n| $\\cos \\theta = x$ | $+$ | $-$ | $-$ | $+$ |\n| $\\tan \\theta = \\frac{y}{x}$ | $+$ | $-$ | $+$ | $-$ |\n\n所以第一象限三者都为正，第二象限只有正弦为正，第三象限只有正切为正，第四象限只有余弦为正。例如 $250^\\circ$ 在第三象限，那里 $x < 0$，所以 $\\cos 250^\\circ$ 是负的。\n\n> **注意。** 正切在 $x$、$y$ 同号的地方为正，即第一、三象限。在第二象限正弦虽为正，正切却是负的。",
      ),
      generate: (rng) => signProblem(rng.pick(fns), degInfo(randomDegrees(rng, 1, 359))),
    },
    {
      id: "ratios-using-the-reference-angle",
      figure: trigDrawings["extending-the-trigonometric-ratios-using-the-unit-circle#ratios-using-the-reference-angle"],
      title: t("Ratios from the reference angle", "由参考角求三角比"),
      explanation: t(
        "The terminal sides of $\\theta$ and of its reference angle $\\alpha$ meet the unit circle at points that are mirror images across the axes, so their coordinates differ only in sign. Hence\n\n$$\\sin \\theta = \\pm \\sin \\alpha, \\quad \\cos \\theta = \\pm \\cos \\alpha, \\quad \\tan \\theta = \\pm \\tan \\alpha,$$\n\nThe sign is set by the quadrant of $\\theta$. For example, given $\\sin 40^\\circ \\approx 0.6428$: $220^\\circ$ is in Quadrant III with reference angle $220^\\circ - 180^\\circ = 40^\\circ$, and the sine is negative there, so $\\sin 220^\\circ \\approx -0.6428$.\n\n> **Watch out.** The reference angle gives the size of the ratio, not its sign. The sign comes from the quadrant of the original angle.",
        "$\\theta$ 与它的参考角 $\\alpha$ 的终边与单位圆的交点关于坐标轴对称，坐标只差符号。因此\n\n$$\\sin \\theta = \\pm \\sin \\alpha, \\quad \\cos \\theta = \\pm \\cos \\alpha, \\quad \\tan \\theta = \\pm \\tan \\alpha,$$\n\n符号由 $\\theta$ 所在的象限决定。例如已知 $\\sin 40^\\circ \\approx 0.6428$：$220^\\circ$ 在第三象限，参考角是 $220^\\circ - 180^\\circ = 40^\\circ$，那里正弦为负，所以 $\\sin 220^\\circ \\approx -0.6428$。\n\n> **注意。** 参考角只给出三角比的大小，不给出符号。符号由原来的角所在的象限决定。",
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
        "The signs of two ratios from different families pin down the quadrant. (A ratio and its reciprocal, such as $\\sin \\theta$ and $\\csc \\theta = \\frac{1}{\\sin \\theta}$, always have the same sign.)\n\nIf $\\sin \\theta < 0$, then $\\theta$ is in Quadrant III or IV. If also $\\tan \\theta > 0$, then $\\theta$ is in Quadrant I or III. Only Quadrant III satisfies both.\n\n> **Watch out.** One sign alone leaves two quadrants. Use both conditions and keep only the quadrant where both hold.",
        "来自不同组的两个三角比的符号可以确定象限。（一个三角比与它的倒数，如 $\\sin \\theta$ 与 $\\csc \\theta = \\frac{1}{\\sin \\theta}$，符号总相同。）\n\n若 $\\sin \\theta < 0$，则 $\\theta$ 在第三或第四象限；若同时 $\\tan \\theta > 0$，则 $\\theta$ 在第一或第三象限。两者同时满足的只有第三象限。\n\n> **注意。** 只用一个符号会剩下两个象限。要同时用两个条件，只保留两个都成立的象限。",
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
        const sample = 45 + 90 * (n - 1);
        const point = ["(+, +)", "(-, +)", "(-, -)", "(+, -)"][n - 1]!;
        const reasons: Reason[] = ([1, 2, 3, 4] as const)
          .filter((m) => m !== n)
          .map((m) => {
            const h = sgn(base(f), m) !== sgn(base(f), n) ? f : g;
            const opp = rel(h) === ">" ? "<" : ">";
            return [
              quadrantOptions[m - 1]!.en,
              sub(`In Quadrant ${roman[m]}, $\\${h} \\theta ${opp} 0$, so the condition $\\${h} \\theta ${rel(h)} 0$ fails.`),
              sub(`在第${zhNumbers[m]}象限，$\\${h} \\theta ${opp} 0$，不满足 $\\${h} \\theta ${rel(h)} 0$。`),
            ];
          });
        return reasoned(
          choiceProblem({
            prompt: t(
              sub(`In which quadrant is $\\theta$ if $\\${f} \\theta ${rel(f)} 0$ and $\\${g} \\theta ${rel(g)} 0$?`),
              sub(`若 $\\${f} \\theta ${rel(f)} 0$ 且 $\\${g} \\theta ${rel(g)} 0$，$\\theta$ 在哪个象限？`),
            ),
            options: quadrantOptions.slice(0, 4),
            correct: n - 1,
            solution: join(
              label(1, "Use the first sign", "用第一个符号"),
              t(sub(`${where(f).en}.`), sub(`${where(f)["zh-CN"]}。`)),
              para,
              label(2, "Use the second sign", "用第二个符号"),
              t(
                sub(`${where(g).en}. Both hold only in ${quadrantName(n).en}.`),
                sub(`${where(g)["zh-CN"]}。两者同时成立的只有${quadrantName(n)["zh-CN"]}。`),
              ),
              said(
                sub(
                  `Try $\\theta = ${sample}^\\circ$ in ${quadrantName(n).en}. Its point on the unit circle has signs $${point}$, so $\\${f} \\theta ${rel(f)} 0$ and $\\${g} \\theta ${rel(g)} 0$, as required.`,
                ),
                sub(
                  `取${quadrantName(n)["zh-CN"]}的 $\\theta = ${sample}^\\circ$。它在单位圆上的点的符号是 $${point}$，所以 $\\${f} \\theta ${rel(f)} 0$ 且 $\\${g} \\theta ${rel(g)} 0$，符合要求。`,
                ),
              ),
            ),
          }),
          reasons,
        );
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
  intro: t(
    `You can find the ratios of any angle in degrees from the unit circle, and you know the ratios of acute angles in radians. The same work goes through in radians, with $\\pi$ in place of $180^\\circ$. Radians are the measure used for graphs of the trigonometric functions and in calculus, so this is where the ratios will mostly be used.

Take $\\sin \\frac{7\\pi}{6}$. The angle is between $\\pi$ and $\\frac{3\\pi}{2}$, so it is in Quadrant III, where the sine is negative. Its reference angle is $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$:

$$\\sin \\frac{7\\pi}{6} = -\\sin \\frac{\\pi}{6} = -\\frac{1}{2}.$$

The minus sign comes from the quadrant and the size from the reference angle.`,
    `你已经会用单位圆求角度制下任意角的三角比，也知道弧度制下锐角的三角比。同样的方法在弧度制下也适用，只是用 $\\pi$ 代替 $180^\\circ$。三角函数的图像和微积分都用弧度，所以三角比主要在这里用到。

以 $\\sin \\frac{7\\pi}{6}$ 为例。这个角在 $\\pi$ 与 $\\frac{3\\pi}{2}$ 之间，所以在第三象限，那里正弦为负。它的参考角是 $\\frac{7\\pi}{6} - \\pi = \\frac{\\pi}{6}$：

$$\\sin \\frac{7\\pi}{6} = -\\sin \\frac{\\pi}{6} = -\\frac{1}{2}.$$

负号来自象限，大小来自参考角。`,
  ),
  knowledgePoints: [
    {
      id: "signs-of-the-ratios-in-radians",
      title: t("Signs of the ratios in radians", "弧度制下三角比的符号"),
      explanation: t(
        "In radians the quadrants are\n\n$$\\text{I}: 0 < \\theta < \\tfrac{\\pi}{2}, \\quad \\text{II}: \\tfrac{\\pi}{2} < \\theta < \\pi, \\quad \\text{III}: \\pi < \\theta < \\tfrac{3\\pi}{2}, \\quad \\text{IV}: \\tfrac{3\\pi}{2} < \\theta < 2\\pi.$$\n\nTo place $\\frac{4\\pi}{5}$, compare it with $\\frac{\\pi}{2} = \\frac{2.5\\pi}{5}$ and $\\pi = \\frac{5\\pi}{5}$: it lies between them, so it is in Quadrant II, where only the sine is positive. So $\\cos \\frac{4\\pi}{5} < 0$.\n\n> **Watch out.** Compare the angle with $\\frac{\\pi}{2}$, $\\pi$ and $\\frac{3\\pi}{2}$, not with $1$, $2$ and $3$. Write them over the same denominator first.",
        "用弧度表示时，各象限为\n\n$$\\text{一}: 0 < \\theta < \\tfrac{\\pi}{2}, \\quad \\text{二}: \\tfrac{\\pi}{2} < \\theta < \\pi, \\quad \\text{三}: \\pi < \\theta < \\tfrac{3\\pi}{2}, \\quad \\text{四}: \\tfrac{3\\pi}{2} < \\theta < 2\\pi.$$\n\n判断 $\\frac{4\\pi}{5}$ 的位置，把它与 $\\frac{\\pi}{2} = \\frac{2.5\\pi}{5}$ 和 $\\pi = \\frac{5\\pi}{5}$ 比较：它在两者之间，所以在第二象限，那里只有正弦为正。所以 $\\cos \\frac{4\\pi}{5} < 0$。\n\n> **注意。** 要把角与 $\\frac{\\pi}{2}$、$\\pi$、$\\frac{3\\pi}{2}$ 比较，不是与 $1$、$2$、$3$ 比较。先把它们写成同分母。",
      ),
      generate(rng) {
        const [k, n] = randomPi(rng, 0, 2);
        return signProblem(rng.pick(fns), piInfo(k, n));
      },
    },
    {
      id: "ratios-in-radians-using-the-reference-angle",
      figure: trigDrawings["extending-the-trigonometric-ratios-using-angles-in-radians#ratios-in-radians-using-the-reference-angle"],
      title: t("Ratios in radians from the reference angle", "由参考角求弧度制角的三角比"),
      explanation: t(
        "As in degrees, $\\sin \\theta$, $\\cos \\theta$ and $\\tan \\theta$ equal the ratios of the reference angle up to sign, with $\\pi$ in place of $180^\\circ$.\n\nGiven $\\cos \\frac{\\pi}{5} \\approx 0.8090$, find $\\cos \\frac{6\\pi}{5}$. The angle $\\frac{6\\pi}{5}$ is in Quadrant III, with reference angle $\\frac{6\\pi}{5} - \\pi = \\frac{\\pi}{5}$, and the cosine is negative there:\n\n$$\\cos \\frac{6\\pi}{5} = -\\cos \\frac{\\pi}{5} \\approx -0.8090.$$\n\n> **Watch out.** In radians the reference angle uses $\\pi$ and $2\\pi$. Subtracting $180$ from an angle in radians makes no sense.",
        "与角度制一样，$\\sin \\theta$、$\\cos \\theta$、$\\tan \\theta$ 与参考角的三角比只差符号，只是用 $\\pi$ 代替 $180^\\circ$。\n\n已知 $\\cos \\frac{\\pi}{5} \\approx 0.8090$，求 $\\cos \\frac{6\\pi}{5}$。角 $\\frac{6\\pi}{5}$ 在第三象限，参考角是 $\\frac{6\\pi}{5} - \\pi = \\frac{\\pi}{5}$，那里余弦为负：\n\n$$\\cos \\frac{6\\pi}{5} = -\\cos \\frac{\\pi}{5} \\approx -0.8090.$$\n\n> **注意。** 弧度制下求参考角用 $\\pi$ 和 $2\\pi$。从弧度制的角中减去 $180$ 毫无意义。",
      ),
      generate: (rng) => referenceRatioProblem(rng.pick(fns), randomRefPi(rng, 0, 2)),
    },
    {
      id: "ratios-in-radians-with-a-calculator",
      figure: trigDrawings["extending-the-trigonometric-ratios-using-angles-in-radians#ratios-in-radians-with-a-calculator"],
      title: t("Ratios in radians with a calculator", "用计算器求弧度制角的三角比"),
      explanation: t(
        "An angle in radians need not be a multiple of $\\pi$. With a calculator in **radian mode**, $\\cos 2.5 \\approx -0.80$. The sign agrees with the quadrant: $\\frac{\\pi}{2} \\approx 1.57 < 2.5 < \\pi \\approx 3.14$, so $2.5$ is in Quadrant II, where the cosine is negative. In degree mode the calculator would instead give $\\cos 2.5^\\circ \\approx 1.00$.\n\n> **Watch out.** Check the calculator's mode before evaluating. An angle with no degree sign is in radians.",
        "弧度制的角不一定是 $\\pi$ 的倍数。把计算器设为**弧度模式**，得 $\\cos 2.5 \\approx -0.80$。符号与象限一致：$\\frac{\\pi}{2} \\approx 1.57 < 2.5 < \\pi \\approx 3.14$，所以 $2.5$ 在第二象限，那里余弦为负。若用角度模式，计算器给出的是 $\\cos 2.5^\\circ \\approx 1.00$。\n\n> **注意。** 计算前先检查计算器的模式。没有度的符号的角是弧度。",
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
            solution: join(
              label(1, "Set radian mode", "设为弧度模式"),
              t(
                `The angle $${dec(x)}$ has no degree sign, so it is in radians. Set the calculator to radian mode before evaluating.`,
                `角 $${dec(x)}$ 没有度的符号，所以是弧度。计算前先把计算器设为弧度模式。`,
              ),
              para,
              label(2, "Evaluate and round", "计算并取近似值"),
              both(
                "Round to the nearest hundredth:",
                "精确到百分位：",
                `\\${f} ${dec(x)} \\approx ${dec(roundQ(v, 4))} \\approx ${dec(answer)}`,
              ),
              said(
                `In degrees, $${dec(x)} \\cdot \\frac{180^\\circ}{\\pi} \\approx ${Math.round((th * 180) / Math.PI)}^\\circ$, which is in ${name.en}. There the ${fnNames[f].en} is ${sgn(f, n) > 0 ? "positive" : "negative"}, and so is $${dec(answer)}$.`,
                `换成角度，$${dec(x)} \\cdot \\frac{180^\\circ}{\\pi} \\approx ${Math.round((th * 180) / Math.PI)}^\\circ$，在${name["zh-CN"]}。那里${fnNames[f]["zh-CN"]}为${sgn(f, n) > 0 ? "正" : "负"}，$${dec(answer)}$ 也是${sgn(f, n) > 0 ? "正" : "负"}的。`,
              ),
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
  intro: t(
    `You can find the ratios of angles from $0$ to $2\\pi$, in degrees or radians, from the quadrant and the reference angle. A negative angle has a terminal side too, so its ratios are defined the same way. They are needed whenever a rotation runs clockwise, and they lead to simple rules relating $\\theta$ and $-\\theta$.

Take $\\cos(-60^\\circ)$. A full turn gives the same terminal side:

$$-60^\\circ + 360^\\circ = 300^\\circ.$$

That is in Quadrant IV, where the cosine is positive, with reference angle $60^\\circ$. So $\\cos(-60^\\circ) = \\cos 60^\\circ = \\frac{1}{2}$.`,
    `你已经会由象限和参考角求 $0$ 到 $2\\pi$ 之间的角的三角比，无论用角度还是弧度。负角也有终边，所以它的三角比按同样的方式定义。旋转方向为顺时针时就要用到它们，而且它们引出 $\\theta$ 与 $-\\theta$ 之间的简单关系。

以 $\\cos(-60^\\circ)$ 为例。加一整圈终边不变：

$$-60^\\circ + 360^\\circ = 300^\\circ.$$

它在第四象限，那里余弦为正，参考角是 $60^\\circ$。所以 $\\cos(-60^\\circ) = \\cos 60^\\circ = \\frac{1}{2}$。`,
  ),
  knowledgePoints: [
    {
      id: "signs-of-the-ratios-of-negative-angles",
      figure: trigDrawings["extending-the-trigonometric-ratios-to-negative-angles#signs-of-the-ratios-of-negative-angles"],
      title: t("Signs of the ratios of negative angles", "负角三角比的符号"),
      explanation: t(
        "A negative angle has a terminal side like any other angle, and the unit-circle definitions apply to it unchanged. Find the quadrant, adding a full turn if that helps: $-100^\\circ + 360^\\circ = 260^\\circ$, in Quadrant III, so $\\sin(-100^\\circ) < 0$, $\\cos(-100^\\circ) < 0$ and $\\tan(-100^\\circ) > 0$. In radians, $-\\frac{\\pi}{3} + 2\\pi = \\frac{5\\pi}{3}$ is in Quadrant IV.\n\n> **Watch out.** A negative angle does not make every ratio negative. Find its quadrant first; $\\cos(-60^\\circ)$ is positive.",
        "负角和其他角一样有终边，单位圆上的定义照样适用。先判断象限，必要时加上一整圈：$-100^\\circ + 360^\\circ = 260^\\circ$，在第三象限，所以 $\\sin(-100^\\circ) < 0$，$\\cos(-100^\\circ) < 0$，$\\tan(-100^\\circ) > 0$。用弧度时，$-\\frac{\\pi}{3} + 2\\pi = \\frac{5\\pi}{3}$ 在第四象限。\n\n> **注意。** 负角并不使所有三角比都为负。先找出它的象限；$\\cos(-60^\\circ)$ 是正的。",
      ),
      generate(rng) {
        if (rng.bool()) return signProblem(rng.pick(fns), degInfo(randomDegrees(rng, -359, -1)));
        const [k, n] = randomPi(rng, -2, 0);
        return signProblem(rng.pick(fns), piInfo(k, n));
      },
    },
    {
      id: "ratios-of-negative-angles-using-the-reference-angle",
      figure: trigDrawings["extending-the-trigonometric-ratios-to-negative-angles#ratios-of-negative-angles-using-the-reference-angle"],
      title: t("Ratios of negative angles from the reference angle", "由参考角求负角的三角比"),
      explanation: t(
        "Add a full turn to reach the coterminal angle between $0^\\circ$ and $360^\\circ$ (or $0$ and $2\\pi$), then use its reference angle and quadrant.\n\nGiven $\\tan 50^\\circ \\approx 1.1918$, find $\\tan(-130^\\circ)$. Since $-130^\\circ + 360^\\circ = 230^\\circ$, in Quadrant III with reference angle $50^\\circ$, and the tangent is positive there:\n\n$$\\tan(-130^\\circ) = \\tan 50^\\circ \\approx 1.1918.$$\n\n> **Watch out.** The reference angle of $-130^\\circ$ is not $130^\\circ$. Bring the angle into one turn first: $230^\\circ$, whose reference angle is $50^\\circ$.",
        "先加上一整圈，得到 $0^\\circ$ 到 $360^\\circ$（或 $0$ 到 $2\\pi$）之间终边相同的角，再用它的参考角和象限。\n\n已知 $\\tan 50^\\circ \\approx 1.1918$，求 $\\tan(-130^\\circ)$。因为 $-130^\\circ + 360^\\circ = 230^\\circ$，在第三象限，参考角为 $50^\\circ$，那里正切为正：\n\n$$\\tan(-130^\\circ) = \\tan 50^\\circ \\approx 1.1918.$$\n\n> **注意。** $-130^\\circ$ 的参考角不是 $130^\\circ$。先把角化到一圈之内：$230^\\circ$，它的参考角是 $50^\\circ$。",
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
      figure: trigDrawings["extending-the-trigonometric-ratios-to-negative-angles#ratios-of-opposite-angles"],
      title: t("Ratios of $\\theta$ and $-\\theta$", "$\\theta$ 与 $-\\theta$ 的三角比"),
      explanation: t(
        "The angles $\\theta$ and $-\\theta$ turn by the same amount in opposite directions, so their terminal sides are mirror images across the $x$-axis: if one meets the unit circle at $(x, y)$, the other meets it at $(x, -y)$. Hence\n\n$$\\sin(-\\theta) = -\\sin \\theta, \\qquad \\cos(-\\theta) = \\cos \\theta, \\qquad \\tan(-\\theta) = \\frac{-y}{x} = -\\tan \\theta.$$\n\nFor example, if $\\sin \\theta = \\frac{2}{7}$, then $\\sin(-\\theta) = -\\frac{2}{7}$; if $\\cos \\theta = -\\frac{3}{4}$, then $\\cos(-\\theta) = -\\frac{3}{4}$ as well.\n\n> **Watch out.** Only the sine and the tangent change sign. The cosine of $-\\theta$ equals the cosine of $\\theta$.",
        "角 $\\theta$ 与 $-\\theta$ 朝相反方向转过相同的角度，所以它们的终边关于 $x$ 轴对称：若一个与单位圆交于 $(x, y)$，另一个就交于 $(x, -y)$。因此\n\n$$\\sin(-\\theta) = -\\sin \\theta, \\qquad \\cos(-\\theta) = \\cos \\theta, \\qquad \\tan(-\\theta) = \\frac{-y}{x} = -\\tan \\theta.$$\n\n例如，若 $\\sin \\theta = \\frac{2}{7}$，则 $\\sin(-\\theta) = -\\frac{2}{7}$；若 $\\cos \\theta = -\\frac{3}{4}$，则 $\\cos(-\\theta)$ 也等于 $-\\frac{3}{4}$。\n\n> **注意。** 只有正弦和正切变号。$-\\theta$ 的余弦等于 $\\theta$ 的余弦。",
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
          solution: join(
            label(1, "Reflect the terminal side", "作终边的对称"),
            t(
              `The terminal side of $-\\theta$ is the mirror image of that of $\\theta$ across the $x$-axis. The point $(x, y)$ on the unit circle goes to $(x, -y)$: $y$ changes sign and $x$ does not.`,
              `$-\\theta$ 的终边与 $\\theta$ 的终边关于 $x$ 轴对称。单位圆上的点 $(x, y)$ 变为 $(x, -y)$：$y$ 变号，$x$ 不变。`,
            ),
            para,
            label(2, "Apply the rule", "运用法则"),
            both(
              `${{ sin: "The sine is $y$, so it changes sign", cos: "The cosine is $x$, so it stays the same", tan: "The tangent is $\\frac{y}{x}$, so it changes sign" }[f]}. So $${rule}$:`,
              `${{ sin: "正弦是 $y$，所以变号", cos: "余弦是 $x$，所以不变", tan: "正切是 $\\frac{y}{x}$，所以变号" }[f]}。所以 $${rule}$：`,
              `\\${f}(-\\theta) = ${answer.toLatex()}`,
            ),
            f === "cos"
              ? said(
                  `The mirror image keeps $x$, so the two cosines agree: $${v.toLatex()} - ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = 0$.`,
                  `对称后 $x$ 不变，两个余弦相等：$${v.toLatex()} - ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = 0$。`,
                )
              : said(
                  `Mirror images have opposite $y$, so the two values add to zero: $${v.toLatex()} + ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = 0$.`,
                  `对称点的 $y$ 互为相反数，两个值之和为零：$${v.toLatex()} + ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = 0$。`,
                ),
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
  encompasses: [{ topic: "coterminal-angles", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `You can find coterminal angles and the ratios of any angle in one turn, positive or negative. An angle of more than one turn has the same terminal side as an angle in one turn, so it has the same ratios. This is why the trigonometric functions repeat, which is what makes them model anything periodic.

Take $\\sin 750^\\circ$. Remove the full turns first:

$$750^\\circ - 2 \\cdot 360^\\circ = 30^\\circ.$$

So $\\sin 750^\\circ = \\sin 30^\\circ = \\frac{1}{2}$.`,
    `你已经会求终边相同的角，也会求一圈之内任意角（正角或负角）的三角比。超过一圈的角与一圈之内的某个角终边相同，所以三角比也相同。这就是三角函数会重复的原因，也是它们能描述各种周期现象的原因。

以 $\\sin 750^\\circ$ 为例。先去掉整圈：

$$750^\\circ - 2 \\cdot 360^\\circ = 30^\\circ.$$

所以 $\\sin 750^\\circ = \\sin 30^\\circ = \\frac{1}{2}$。`,
  ),
  knowledgePoints: [
    {
      id: "ratios-of-large-angles-in-degrees",
      figure: trigDrawings["extending-the-trigonometric-ratios-to-large-angles#ratios-of-large-angles-in-degrees"],
      title: t("Ratios of large angles in degrees", "角度制大角的三角比"),
      explanation: t(
        "Coterminal angles share a terminal side, so they have the same ratios: $\\sin(\\theta + 360^\\circ k) = \\sin \\theta$, and likewise for cosine and tangent. Remove the full turns first, then use the reference angle.\n\nGiven $\\cos 20^\\circ \\approx 0.9397$, find $\\cos 920^\\circ$: $920^\\circ - 2 \\cdot 360^\\circ = 200^\\circ$, in Quadrant III with reference angle $20^\\circ$, where the cosine is negative, so\n\n$$\\cos 920^\\circ = -\\cos 20^\\circ \\approx -0.9397.$$\n\n> **Watch out.** Removing the full turns does not finish the job. The angle left over may still be outside Quadrant I, so its sign must still be read from the quadrant.",
        "终边相同的角三角比相同：$\\sin(\\theta + 360^\\circ k) = \\sin \\theta$，余弦和正切也一样。先去掉整圈，再用参考角。\n\n已知 $\\cos 20^\\circ \\approx 0.9397$，求 $\\cos 920^\\circ$：$920^\\circ - 2 \\cdot 360^\\circ = 200^\\circ$，在第三象限，参考角为 $20^\\circ$，那里余弦为负，所以\n\n$$\\cos 920^\\circ = -\\cos 20^\\circ \\approx -0.9397.$$\n\n> **注意。** 去掉整圈还没有做完。剩下的角可能不在第一象限，仍要由象限判断符号。",
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
      figure: trigDrawings["extending-the-trigonometric-ratios-to-large-angles#ratios-of-large-angles-in-radians"],
      title: t("Ratios of large angles in radians", "弧度制大角的三角比"),
      explanation: t(
        "In radians, remove multiples of $2\\pi$. Given $\\sin \\frac{\\pi}{8} \\approx 0.3827$, find $\\sin \\frac{23\\pi}{8}$: $2\\pi = \\frac{16\\pi}{8}$, so $\\frac{23\\pi}{8} - \\frac{16\\pi}{8} = \\frac{7\\pi}{8}$, in Quadrant II with reference angle $\\pi - \\frac{7\\pi}{8} = \\frac{\\pi}{8}$. The sine is positive there:\n\n$$\\sin \\frac{23\\pi}{8} = \\sin \\frac{\\pi}{8} \\approx 0.3827.$$\n\n> **Watch out.** Remove multiples of $2\\pi$, not of $\\pi$. Removing one $\\pi$ moves the terminal side to the opposite direction and can flip the sign.",
        "用弧度时，去掉 $2\\pi$ 的倍数。已知 $\\sin \\frac{\\pi}{8} \\approx 0.3827$，求 $\\sin \\frac{23\\pi}{8}$：$2\\pi = \\frac{16\\pi}{8}$，所以 $\\frac{23\\pi}{8} - \\frac{16\\pi}{8} = \\frac{7\\pi}{8}$，在第二象限，参考角为 $\\pi - \\frac{7\\pi}{8} = \\frac{\\pi}{8}$。那里正弦为正：\n\n$$\\sin \\frac{23\\pi}{8} = \\sin \\frac{\\pi}{8} \\approx 0.3827.$$\n\n> **注意。** 要去掉 $2\\pi$ 的倍数，而不是 $\\pi$ 的倍数。去掉一个 $\\pi$ 会让终边指向相反方向，可能改变符号。",
      ),
      generate: (rng) => referenceRatioProblem(rng.pick(fns), rng.bool(0.7) ? randomRefPi(rng, 2.1, 8) : randomRefPi(rng, -8, -2.1)),
    },
    {
      id: "signs-of-the-ratios-of-large-angles",
      figure: trigDrawings["extending-the-trigonometric-ratios-to-large-angles#signs-of-the-ratios-of-large-angles"],
      title: t("Signs of the ratios of large angles", "大角三角比的符号"),
      explanation: t(
        "To find the sign of a ratio of a large angle, find the coterminal angle in one turn and its quadrant. For $\\tan 1000^\\circ$: $1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ$, in Quadrant IV, where only the cosine is positive, so $\\tan 1000^\\circ < 0$. For $\\cos \\frac{13\\pi}{4}$: $\\frac{13\\pi}{4} - 2\\pi = \\frac{5\\pi}{4}$, in Quadrant III, so the cosine is negative.\n\n> **Watch out.** The number of full turns says nothing about the sign. Only the coterminal angle in one turn does.",
        "判断大角三角比的符号，先求一圈内与它终边相同的角及其象限。对 $\\tan 1000^\\circ$：$1000^\\circ - 2 \\cdot 360^\\circ = 280^\\circ$，在第四象限，那里只有余弦为正，所以 $\\tan 1000^\\circ < 0$。对 $\\cos \\frac{13\\pi}{4}$：$\\frac{13\\pi}{4} - 2\\pi = \\frac{5\\pi}{4}$，在第三象限，所以余弦为负。\n\n> **注意。** 整圈的个数与符号无关。只有一圈之内与它终边相同的角才决定符号。",
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
  intro: t(
    `You know that the point $(\\cos \\theta, \\sin \\theta)$ lies on the unit circle $x^2 + y^2 = 1$. Writing that equation in terms of the ratios gives the Pythagorean identity, $\\sin^2 \\theta + \\cos^2 \\theta = 1$. It finds one ratio from another without finding the angle, which is often impossible to do exactly.

Take an acute angle with $\\cos \\theta = \\frac{3}{5}$. The identity gives

$$\\sin^2 \\theta = 1 - \\frac{9}{25} = \\frac{16}{25}.$$

The angle is acute, so take the positive root: $\\sin \\theta = \\frac{4}{5}$.`,
    `你已经知道点 $(\\cos \\theta, \\sin \\theta)$ 在单位圆 $x^2 + y^2 = 1$ 上。把这个方程用三角比写出来，就得到勾股恒等式 $\\sin^2 \\theta + \\cos^2 \\theta = 1$。它不用求角就能由一个三角比求出另一个，而角往往无法精确求出。

设锐角 $\\theta$ 满足 $\\cos \\theta = \\frac{3}{5}$。由恒等式得

$$\\sin^2 \\theta = 1 - \\frac{9}{25} = \\frac{16}{25}.$$

角是锐角，所以取正的平方根：$\\sin \\theta = \\frac{4}{5}$。`,
  ),
  knowledgePoints: [
    {
      id: "the-other-ratio-in-the-first-quadrant",
      figure: trigDrawings["using-the-pythagorean-identity-in-the-first-quadrant#the-other-ratio-in-the-first-quadrant"],
      title: t("The other ratio from sine or cosine", "由正弦或余弦求另一个"),
      explanation: t(
        "The point $(\\cos \\theta, \\sin \\theta)$ lies on the unit circle $x^2 + y^2 = 1$, so for every angle\n\n$$\\sin^2 \\theta + \\cos^2 \\theta = 1.$$\n\nThis is the **Pythagorean identity** (here $\\sin^2 \\theta$ means $(\\sin \\theta)^2$). For an acute angle both ratios are positive, so if $\\sin \\theta = \\frac{2}{5}$, then\n\n$$\\cos \\theta = \\sqrt{1 - \\frac{4}{25}} = \\sqrt{\\frac{21}{25}} = \\frac{\\sqrt{21}}{5}.$$\n\n> **Watch out.** $\\sin^2 \\theta$ means $(\\sin \\theta)^2$, not $\\sin(\\theta^2)$. And $\\sqrt{1 - s^2}$ is not $1 - s$.",
        "点 $(\\cos \\theta, \\sin \\theta)$ 在单位圆 $x^2 + y^2 = 1$ 上，所以对任意角都有\n\n$$\\sin^2 \\theta + \\cos^2 \\theta = 1,$$\n\n这就是**勾股恒等式**（这里 $\\sin^2 \\theta$ 表示 $(\\sin \\theta)^2$）。对锐角，两个三角比都是正的，所以若 $\\sin \\theta = \\frac{2}{5}$，则\n\n$$\\cos \\theta = \\sqrt{1 - \\frac{4}{25}} = \\sqrt{\\frac{21}{25}} = \\frac{\\sqrt{21}}{5}.$$\n\n> **注意。** $\\sin^2 \\theta$ 表示 $(\\sin \\theta)^2$，不是 $\\sin(\\theta^2)$。而且 $\\sqrt{1 - s^2}$ 不等于 $1 - s$。",
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
          solution: join(
            label(1, "Use the identity", "用恒等式"),
            both(
              `From $\\sin^2 \\theta + \\cos^2 \\theta = 1$ with $\\${f} \\theta = \\frac{${p}}{${d}}$:`,
              `由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 及 $\\${f} \\theta = \\frac{${p}}{${d}}$：`,
              `\\${g}^2 \\theta = 1 - \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}}`,
            ),
            para,
            label(2, "Take the positive root", "取正的平方根"),
            both("The angle is acute, so every ratio is positive:", "角是锐角，所以三角比都是正的：", `\\${g} \\theta = ${sqrtLine(p, d)}`),
            said(
              `Square back: $\\left(${texS(otherMagnitude(p, d))}\\right)^2 + \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$.`,
              `平方回去：$\\left(${texS(otherMagnitude(p, d))}\\right)^2 + \\left(\\frac{${p}}{${d}}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-tangent-from-sine-or-cosine",
      figure: trigDrawings["using-the-pythagorean-identity-in-the-first-quadrant#the-tangent-from-sine-or-cosine"],
      title: t("The tangent from sine or cosine", "由正弦或余弦求正切"),
      explanation: t(
        "Find the missing ratio with the identity, then divide: $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$, since $\\tan \\theta = \\frac{y}{x}$ on the unit circle.\n\nIf $\\theta$ is acute and $\\cos \\theta = \\frac{1}{3}$, then $\\sin \\theta = \\sqrt{1 - \\frac{1}{9}} = \\frac{2\\sqrt{2}}{3}$ and\n\n$$\\tan \\theta = \\frac{2\\sqrt{2}}{3} \\div \\frac{1}{3} = 2\\sqrt{2}.$$\n\n> **Watch out.** The tangent is the sine over the cosine, not the cosine over the sine. Dividing the other way gives $\\frac{1}{\\tan \\theta}$.",
        "先用恒等式求出缺少的三角比，再相除：在单位圆上 $\\tan \\theta = \\frac{y}{x}$，所以 $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$。\n\n若 $\\theta$ 是锐角且 $\\cos \\theta = \\frac{1}{3}$，则 $\\sin \\theta = \\sqrt{1 - \\frac{1}{9}} = \\frac{2\\sqrt{2}}{3}$，且\n\n$$\\tan \\theta = \\frac{2\\sqrt{2}}{3} \\div \\frac{1}{3} = 2\\sqrt{2}.$$\n\n> **注意。** 正切是正弦除以余弦，不是余弦除以正弦。反过来除得到的是 $\\frac{1}{\\tan \\theta}$。",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const other = otherMagnitude(p, d);
        const answer = tanMagnitude(f, p, d);
        const [out, m] = simplifyRadical(d * d - p * p);
        const [sinTex, cosTex] = f === "sin" ? [`\\frac{${p}}{${d}}`, texS(other)] : [texS(other), `\\frac{${p}}{${d}}`];
        return radicalProblem({
          prompt: t(
            `The angle $\\theta$ is acute and $\\${f} \\theta = \\frac{${p}}{${d}}$. Find $\\tan \\theta$ exactly, in simplest radical form.`,
            `$\\theta$ 是锐角，且 $\\${f} \\theta = \\frac{${p}}{${d}}$。求 $\\tan \\theta$ 的精确值，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(tanMagnitude(f, p, d, true)), texS(other)],
          solution: join(
            label(1, `Find the ${f === "sin" ? "cosine" : "sine"}`, `求${f === "sin" ? "余弦" : "正弦"}`),
            both(
              "Use $\\sin^2 \\theta + \\cos^2 \\theta = 1$ and take the positive root, since $\\theta$ is acute:",
              "用 $\\sin^2 \\theta + \\cos^2 \\theta = 1$，因为 $\\theta$ 是锐角，取正的平方根：",
              `\\${g} \\theta = ${sqrtLine(p, d)}`,
            ),
            para,
            label(2, "Divide", "相除"),
            both(
              "On the unit circle $\\tan \\theta = \\frac{y}{x}$, which is the sine over the cosine:",
              "在单位圆上 $\\tan \\theta = \\frac{y}{x}$，即正弦除以余弦：",
              `\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`,
            ),
            said(
              `Draw a right triangle with hypotenuse $${d}$ and the side ${f === "sin" ? "opposite" : "adjacent to"} $\\theta$ equal to $${p}$. The other leg is $\\sqrt{${d * d} - ${p * p}} = ${radical(out, m)}$, so $\\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = ${triangleTan(f, p, out, m, answer)}$.`,
              `画一个斜边为 $${d}$、${f === "sin" ? "对边" : "邻边"}为 $${p}$ 的直角三角形。另一条直角边是 $\\sqrt{${d * d} - ${p * p}} = ${radical(out, m)}$，所以 $\\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}} = ${triangleTan(f, p, out, m, answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "expressions-with-the-pythagorean-identity",
      title: t("Expressions with the identity", "用恒等式求式子的值"),
      explanation: t(
        "The identity simplifies expressions without finding the angle. Factor out the common coefficient:\n\n$$5\\sin^2 37^\\circ + 5\\cos^2 37^\\circ - 2 = 5(\\sin^2 37^\\circ + \\cos^2 37^\\circ) - 2 = 5 - 2 = 3.$$\n\nRearranged, the identity gives $1 - \\sin^2 \\theta = \\cos^2 \\theta$. So if $\\cos \\theta = \\frac{2}{3}$, then $6 - 6\\sin^2 \\theta = 6\\cos^2 \\theta = 6 \\cdot \\frac{4}{9} = \\frac{8}{3}$.\n\n> **Watch out.** The identity needs the same angle in both squares. $\\sin^2 20^\\circ + \\cos^2 70^\\circ$ is not $1$ by this rule.",
        "恒等式可以在不求角的情况下化简式子。提出公共系数：\n\n$$5\\sin^2 37^\\circ + 5\\cos^2 37^\\circ - 2 = 5(\\sin^2 37^\\circ + \\cos^2 37^\\circ) - 2 = 5 - 2 = 3.$$\n\n变形后，恒等式给出 $1 - \\sin^2 \\theta = \\cos^2 \\theta$。所以若 $\\cos \\theta = \\frac{2}{3}$，则 $6 - 6\\sin^2 \\theta = 6\\cos^2 \\theta = 6 \\cdot \\frac{4}{9} = \\frac{8}{3}$。\n\n> **注意。** 恒等式要求两个平方中是同一个角。$\\sin^2 20^\\circ + \\cos^2 70^\\circ$ 不能用这条规则直接得 $1$。",
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
            solution: join(
              label(1, "Factor out the coefficient", "提出公共系数"),
              both(
                `Both squared terms have the coefficient $${a}$:`,
                `两个平方项的系数都是 $${a}$：`,
                `${a}\\${first}^2 ${d}^\\circ + ${a}\\${second}^2 ${d}^\\circ ${bTex} = ${a}(\\sin^2 ${d}^\\circ + \\cos^2 ${d}^\\circ) ${bTex}`,
              ),
              para,
              label(2, "Use the identity", "用恒等式"),
              both(
                "The bracket is $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for every angle:",
                "括号里是 $\\sin^2 \\theta + \\cos^2 \\theta$，对任意角都等于 $1$：",
                `${a} \\cdot 1 ${bTex} = ${a + b}`,
              ),
              said(
                `A calculator gives $\\sin ${d}^\\circ \\approx ${dec(roundQ(Math.sin(rad(d)), 4))}$ and $\\cos ${d}^\\circ \\approx ${dec(roundQ(Math.cos(rad(d)), 4))}$, whose squares add to about $1$. So the expression is about $${a} \\cdot 1 ${bTex} = ${a + b}$.`,
                `计算器给出 $\\sin ${d}^\\circ \\approx ${dec(roundQ(Math.sin(rad(d)), 4))}$，$\\cos ${d}^\\circ \\approx ${dec(roundQ(Math.cos(rad(d)), 4))}$，它们的平方和约为 $1$。所以式子约为 $${a} \\cdot 1 ${bTex} = ${a + b}$。`,
              ),
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
          solution: join(
            label(1, "Factor out the coefficient", "提出公共系数"),
            both(`Both terms have the factor $${a}$:`, `两项都有因数 $${a}$：`, `${a} - ${a}\\${g}^2 \\theta = ${a}(1 - \\${g}^2 \\theta)`),
            para,
            label(2, "Use the identity", "用恒等式"),
            both(
              `Rearranged, $\\sin^2 \\theta + \\cos^2 \\theta = 1$ gives $1 - \\${g}^2 \\theta = \\${f}^2 \\theta$:`,
              `把 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 变形，得 $1 - \\${g}^2 \\theta = \\${f}^2 \\theta$：`,
              `${a}(1 - \\${g}^2 \\theta) = ${a}\\${f}^2 \\theta = ${a} \\cdot ${sq.toLatex()} = ${answer.toLatex()}`,
            ),
            said(
              `Find $\\${g}^2 \\theta$ first: $\\${g}^2 \\theta = 1 - ${sq.toLatex()} = \\frac{${d * d - p * p}}{${d * d}}$. Then $${a} - ${a} \\cdot \\frac{${d * d - p * p}}{${d * d}} = \\frac{${a * d * d} - ${a * (d * d - p * p)}}{${d * d}} = ${answer.toLatex()}$.`,
              `先求 $\\${g}^2 \\theta$：$\\${g}^2 \\theta = 1 - ${sq.toLatex()} = \\frac{${d * d - p * p}}{${d * d}}$。于是 $${a} - ${a} \\cdot \\frac{${d * d - p * p}}{${d * d}} = \\frac{${a * d * d} - ${a * (d * d - p * p)}}{${d * d}} = ${answer.toLatex()}$。`,
            ),
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
  intro: t(
    `You can use $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for acute angles, and you know the signs of the ratios in each quadrant, in degrees and radians. For other angles the identity gives two square roots, and the quadrant decides which one is right. This completes the toolkit for finding every ratio of an angle from just one.

Take $\\cos \\theta = \\frac{5}{13}$ with $\\theta$ in Quadrant IV, where the sine is negative:

$$\\sin \\theta = -\\sqrt{1 - \\frac{25}{169}} = -\\frac{12}{13}.$$

Then $\\tan \\theta = -\\frac{12}{13} \\div \\frac{5}{13} = -\\frac{12}{5}$, negative, as it must be in Quadrant IV.`,
    `你已经会对锐角运用 $\\sin^2 \\theta + \\cos^2 \\theta = 1$，也知道在角度制和弧度制下各象限中三角比的符号。对其他角，恒等式给出两个平方根，由象限决定取哪一个。这样，由一个三角比求出角的全部三角比的方法就完整了。

设 $\\cos \\theta = \\frac{5}{13}$，$\\theta$ 在第四象限，那里正弦为负：

$$\\sin \\theta = -\\sqrt{1 - \\frac{25}{169}} = -\\frac{12}{13}.$$

于是 $\\tan \\theta = -\\frac{12}{13} \\div \\frac{5}{13} = -\\frac{12}{5}$，为负，与第四象限相符。`,
  ),
  knowledgePoints: [
    {
      id: "the-other-ratio-in-any-quadrant",
      title: t("Sine or cosine in any quadrant", "任意象限中的正弦或余弦"),
      explanation: t(
        "Solving $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for one ratio gives two square roots, $\\pm$. The quadrant of $\\theta$ decides which.\n\nIf $\\sin \\theta = \\frac{1}{4}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, then $\\theta$ is in Quadrant II, where the cosine is negative:\n\n$$\\cos \\theta = -\\sqrt{1 - \\frac{1}{16}} = -\\sqrt{\\frac{15}{16}} = -\\frac{\\sqrt{15}}{4}.$$\n\n> **Watch out.** The square root sign gives only the positive root. Put in the minus sign yourself when the quadrant calls for it.",
        "由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 解出一个三角比时有两个平方根 $\\pm$，由 $\\theta$ 所在的象限决定取哪一个。\n\n若 $\\sin \\theta = \\frac{1}{4}$ 且 $\\frac{\\pi}{2} < \\theta < \\pi$，则 $\\theta$ 在第二象限，那里余弦为负：\n\n$$\\cos \\theta = -\\sqrt{1 - \\frac{1}{16}} = -\\sqrt{\\frac{15}{16}} = -\\frac{\\sqrt{15}}{4}.$$\n\n> **注意。** 根号只给出正的平方根。象限要求负号时，要自己加上负号。",
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
          solution: join(
            label(1, "Choose the sign", "确定符号"),
            t(
              `Since $${range}$, the angle is in ${name.en}, where the ${fnNames[g].en} is ${s > 0 ? "positive" : "negative"}.`,
              `因为 $${range}$，角在${name["zh-CN"]}，那里${fnNames[g]["zh-CN"]}为${s > 0 ? "正" : "负"}。`,
            ),
            para,
            label(2, "Use the identity", "用恒等式"),
            both(
              `Solve $\\sin^2 \\theta + \\cos^2 \\theta = 1$ for $\\${g} \\theta$ and take the ${s > 0 ? "positive" : "negative"} root:`,
              `由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$ 解出 $\\${g} \\theta$，取${s > 0 ? "正" : "负"}的平方根：`,
              `\\${g} \\theta = ${sqrtLine(p, d, s)}`,
            ),
            said(
              `Square back: $\\left(${texS(answer)}\\right)^2 + \\left(${given.toLatex()}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$. And $${texS(answer)}$ is ${s > 0 ? "positive" : "negative"}, as the ${fnNames[g].en} must be in ${name.en}.`,
              `平方回去：$\\left(${texS(answer)}\\right)^2 + \\left(${given.toLatex()}\\right)^2 = \\frac{${d * d - p * p}}{${d * d}} + \\frac{${p * p}}{${d * d}} = 1$。而且 $${texS(answer)}$ 为${s > 0 ? "正" : "负"}，与${name["zh-CN"]}中${fnNames[g]["zh-CN"]}的符号相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-tangent-in-any-quadrant",
      title: t("The tangent in any quadrant", "任意象限中的正切"),
      explanation: t(
        "Find the missing ratio with the right sign first, then divide. If $\\cos \\theta = -\\frac{2}{3}$ and $180^\\circ < \\theta < 270^\\circ$, the sine is negative in Quadrant III:\n\n$$\\sin \\theta = -\\sqrt{1 - \\frac{4}{9}} = -\\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{-\\frac{\\sqrt{5}}{3}}{-\\frac{2}{3}} = \\frac{\\sqrt{5}}{2}.$$\n\nThe tangent is positive, as it must be in Quadrant III.\n\n> **Watch out.** Give the missing ratio its sign before dividing. A wrong sign there gives a tangent with the wrong sign.",
        "先求出带正确符号的缺少的三角比，再相除。若 $\\cos \\theta = -\\frac{2}{3}$ 且 $180^\\circ < \\theta < 270^\\circ$，在第三象限正弦为负：\n\n$$\\sin \\theta = -\\sqrt{1 - \\frac{4}{9}} = -\\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{-\\frac{\\sqrt{5}}{3}}{-\\frac{2}{3}} = \\frac{\\sqrt{5}}{2}.$$\n\n正切为正，与第三象限相符。\n\n> **注意。** 相除之前先给缺少的三角比确定符号。那里的符号错了，正切的符号也会错。",
      ),
      generate(rng) {
        const [p, d] = randomFraction(rng);
        const n = rng.int(2, 4) as Quadrant;
        const f = rng.pick(["sin", "cos"] as const);
        const g = f === "sin" ? "cos" : "sin";
        const given = q(sgn(f, n) * p, d);
        const other: S = [otherMagnitude(p, d)[0].mul(q(sgn(g, n))), otherMagnitude(p, d)[1]];
        const mag = tanMagnitude(f, p, d);
        const [out, m] = simplifyRadical(d * d - p * p);
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
          solution: join(
            label(1, `Find the ${fnNames[g].en} with its sign`, `求带符号的${fnNames[g]["zh-CN"]}`),
            both(
              `Since $${range}$, the angle is in ${name.en}, where the ${fnNames[g].en} is ${sgn(g, n) > 0 ? "positive" : "negative"}. By $\\sin^2 \\theta + \\cos^2 \\theta = 1$:`,
              `因为 $${range}$，角在${name["zh-CN"]}，那里${fnNames[g]["zh-CN"]}为${sgn(g, n) > 0 ? "正" : "负"}。由 $\\sin^2 \\theta + \\cos^2 \\theta = 1$：`,
              `\\${g} \\theta = ${sqrtLine(p, d, sgn(g, n))}`,
            ),
            para,
            label(2, "Divide", "相除"),
            both(
              "The tangent is the sine over the cosine:",
              "正切等于正弦除以余弦：",
              `\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} = \\frac{${sinTex}}{${cosTex}} = ${texS(answer)}`,
            ),
            said(
              `Ignore the signs: a right triangle with hypotenuse $${d}$ and a leg of $${p}$ has the other leg $\\sqrt{${d * d} - ${p * p}} = ${radical(out, m)}$, so the size of the tangent is $${triangleTan(f, p, out, m, mag)}$. In ${name.en} the tangent is ${sgn("tan", n) > 0 ? "positive" : "negative"}, which gives $${texS(answer)}$.`,
              `先不管符号：斜边为 $${d}$、一条直角边为 $${p}$ 的直角三角形，另一条直角边是 $\\sqrt{${d * d} - ${p * p}} = ${radical(out, m)}$，所以正切的大小是 $${triangleTan(f, p, out, m, mag)}$。在${name["zh-CN"]}正切为${sgn("tan", n) > 0 ? "正" : "负"}，得 $${texS(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "sine-and-cosine-from-the-tangent",
      figure: trigDrawings["extending-the-pythagorean-identity-to-all-quadrants#sine-and-cosine-from-the-tangent"],
      title: t("Sine and cosine from the tangent", "由正切求正弦和余弦"),
      explanation: t(
        "If $\\tan \\theta = \\frac{y}{x}$ is known, the point on the unit circle is $(x, y)$ scaled to length $1$. Take $\\tan \\theta = -\\frac{4}{3}$ with $\\theta$ in Quadrant II, where $x < 0 < y$: the point $(-3, 4)$ lies on the terminal side, at distance $\\sqrt{9 + 16} = 5$ from the origin. Dividing by $5$ gives the point on the unit circle, $\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$, so\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = \\frac{4}{5}.$$\n\nCheck: $\\frac{9}{25} + \\frac{16}{25} = 1$.\n\n> **Watch out.** The tangent alone fixes only the ratio $\\frac{y}{x}$. The quadrant decides the signs of $x$ and $y$: $\\tan \\theta = -\\frac{4}{3}$ fits both $(-3, 4)$ and $(3, -4)$.",
        "若已知 $\\tan \\theta = \\frac{y}{x}$，把点 $(x, y)$ 缩放到与原点距离为 $1$ 就得到单位圆上的点。设 $\\tan \\theta = -\\frac{4}{3}$ 且 $\\theta$ 在第二象限（$x < 0 < y$）：点 $(-3, 4)$ 在终边上，与原点的距离是 $\\sqrt{9 + 16} = 5$。除以 $5$ 得单位圆上的点 $\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$，所以\n\n$$\\cos \\theta = -\\frac{3}{5}, \\qquad \\sin \\theta = \\frac{4}{5}.$$\n\n检验：$\\frac{9}{25} + \\frac{16}{25} = 1$。\n\n> **注意。** 仅凭正切只能确定比值 $\\frac{y}{x}$。$x$、$y$ 的符号由象限决定：$\\tan \\theta = -\\frac{4}{3}$ 既符合 $(-3, 4)$，也符合 $(3, -4)$。",
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
          solution: join(
            label(1, "Find a point on the terminal side", "找终边上的一点"),
            t(
              `Since $${range}$, the angle is in ${name.en}, where $x$ is ${p.x.sign() > 0 ? "positive" : "negative"} and $y$ is ${p.y.sign() > 0 ? "positive" : "negative"}. The point $(${a}, ${b})$ has these signs, and for it $y \\div x$ is the given tangent, so it lies on the terminal side.`,
              `因为 $${range}$，角在${name["zh-CN"]}，那里 $x$ 为${p.x.sign() > 0 ? "正" : "负"}，$y$ 为${p.y.sign() > 0 ? "正" : "负"}。点 $(${a}, ${b})$ 的坐标符号正是这样，它的 $y \\div x$ 又等于已知的正切，所以它在终边上。`,
            ),
            para,
            label(2, "Scale to the unit circle", "缩放到单位圆上"),
            both(
              `Its distance from the origin is $\\sqrt{${a * a} + ${b * b}} = ${c}$. Dividing by $${c}$ gives the point on the unit circle, $${pointTex(p.x, p.y)}$. So`,
              `它与原点的距离是 $\\sqrt{${a * a} + ${b * b}} = ${c}$。除以 $${c}$ 得单位圆上的点 $${pointTex(p.x, p.y)}$。所以`,
              `\\${f} \\theta = ${answer.toLatex()}`,
            ),
            said(
              `The point $${pointTex(p.x, p.y)}$ has the given tangent: $\\frac{y}{x} = ${tan.toLatex()}$. It is also on the unit circle: $x^2 + y^2 = \\frac{${a * a}}{${c * c}} + \\frac{${b * b}}{${c * c}} = 1$.`,
              `点 $${pointTex(p.x, p.y)}$ 的正切正是已知的值：$\\frac{y}{x} = ${tan.toLatex()}$。它也在单位圆上：$x^2 + y^2 = \\frac{${a * a}}{${c * c}} + \\frac{${b * b}}{${c * c}} = 1$。`,
            ),
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
