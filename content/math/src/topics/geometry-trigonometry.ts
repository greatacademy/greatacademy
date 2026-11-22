import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, dec, linear, type Mark, type Point, Q, radical, sketch } from "@ga/subject-math";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { specialDrawings, trigDrawings } from "../explanation-drawings-solids.ts";
import { choiceProblem, numberProblem, radicalProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { highlighted, proofFigures } from "./geometry-congruence.ts";

// Geometry, unit 4 (continued): quadrilaterals (diagonals of squares,
// properties of parallelograms and the proofs of their properties and
// criteria) and right-triangle trigonometry.

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 1, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** cat joins texts, or language-neutral strings, locale by locale. */
function cat(...parts: readonly (Text | string)[]): Text {
  const pick = (p: Text | string, l: "en" | "zh-CN") => (typeof p === "string" ? p : p[l]);
  return t(parts.map((p) => pick(p, "en")).join(""), parts.map((p) => pick(p, "zh-CN")).join(""));
}

/** paras joins texts as paragraphs. */
const paras = (...items: readonly Text[]) => t(items.map((p) => p.en).join("\n\n"), items.map((p) => p["zh-CN"]).join("\n\n"));

/** step writes a paragraph that starts with the bold label of step i. */
const step = (i: number, en: string, zh: string, body: Text) => cat(stepLabel(i, en, zh), t(" ", ""), body);

/** check writes the closing paragraph that checks an answer. */
const check = (en: string, zh: string) => t(`**Check.** ${en}`, `**检验。** ${zh}`);

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = (c: number, d: number) => `(${linear(c, d)})^\\circ`;

/** area2 is twice the signed area of a polygon: positive when its points run counterclockwise. */
function area2(points: readonly Point[]): number {
  return points.reduce((s, p, i) => {
    const q = points[(i + 1) % points.length]!;
    return s + p[0] * q[1] - q[0] * p[1];
  }, 0);
}

/** outside labels the sides of a polygon outside it, side i running from point i to point i + 1; null skips a side. */
function outside(points: readonly Point[], labels: readonly (string | null)[]): Mark[] {
  const ccw = area2(points) > 0;
  return points.flatMap((p, i): Mark[] => {
    const text = labels[i];
    if (text == null || text === "") return [];
    const q = points[(i + 1) % points.length]!;
    return [{ kind: "side", a: ccw ? p : q, b: ccw ? q : p, text }];
  });
}

const compasses: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** compassOf is the compass direction nearest to the direction (dx, dy). */
function compassOf(dx: number, dy: number): Compass {
  const a = (toDeg(Math.atan2(dy, dx)) + 360 + 22.5) % 360;
  return compasses[Math.floor(a / 45) % 8]!;
}

/** center is the average of some points. */
const center = (points: readonly Point[]): Point => [
  points.reduce((s, p) => s + p[0], 0) / points.length,
  points.reduce((s, p) => s + p[1], 0) / points.length,
];

/** names labels points with letters, each away from the center c (the points' own center by default). */
function names(points: readonly Point[], letters: string, c: Point = center(points)): Mark[] {
  return points.map((at, i) => ({
    kind: "label",
    at,
    text: letters[i]!,
    dir: compassOf(at[0] - c[0], at[1] - c[1]),
    italic: true,
  }));
}

/** between labels the point e with a letter placed between the rays from e to a and to b. */
function between(e: Point, a: Point, b: Point, text: string): Mark {
  const ua = Math.hypot(a[0] - e[0], a[1] - e[1]);
  const ub = Math.hypot(b[0] - e[0], b[1] - e[1]);
  const dx = (a[0] - e[0]) / ua + (b[0] - e[0]) / ub;
  const dy = (a[1] - e[1]) / ua + (b[1] - e[1]) / ub;
  return { kind: "label", at: e, text, dir: compassOf(dx, dy), italic: true };
}

/** Pose turns and maybe mirrors a drawing, so that figures do not all face the same way. */
interface Pose {
  readonly turn: number;
  readonly mirror: boolean;
}

const pickPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 0, 90, 180, 270, 15, -15]), mirror: rng.bool() });

/** posed applies a pose to points. */
function posed<T extends readonly Point[]>(points: T, pose: Pose): T {
  const [c, s] = [Math.cos(rad(pose.turn)), Math.sin(rad(pose.turn))];
  return points.map(([x0, y]) => {
    const x = pose.mirror ? -x0 : x0;
    return [x * c - y * s, x * s + y * c] as Point;
  }) as unknown as T;
}

/** Tri is a right triangle: the right-angle vertex R, the end U of the bottom leg and the end V of the upright leg. */
type Tri = readonly [Point, Point, Point];

/** rightTri places a right triangle with legs p = RU and q = RV in a pose. */
const rightTri = (p: number, q: number, pose: Pose): Tri => posed([[0, 0] as Point, [p, 0] as Point, [0, q] as Point] as const, pose);

/** RightLabels label a right triangle: its sides RU, UV (the hypotenuse) and VR, angle arcs at U and V, and vertex letters for R, U, V. */
interface RightLabels {
  readonly sides?: readonly [string | null, string | null, string | null];
  readonly atU?: string;
  readonly atV?: string;
  readonly letters?: string;
}

/** rightMarks draws a right triangle with its right-angle mark and labels. */
function rightMarks(tri: Tri, l: RightLabels): Mark[] {
  const [r, u, v] = tri;
  const marks: Mark[] = [
    { kind: "polygon", points: [r, u, v] },
    { kind: "right", vertex: r, from: u, to: v },
  ];
  if (l.sides) marks.push(...outside([r, u, v], l.sides));
  if (l.atU !== undefined) marks.push({ kind: "arc", vertex: u, from: r, to: v, label: l.atU || undefined, accent: true });
  if (l.atV !== undefined) marks.push({ kind: "arc", vertex: v, from: u, to: r, label: l.atV || undefined, accent: true });
  if (l.letters) marks.push(...names([r, u, v], l.letters));
  return marks;
}

/** rightFigure draws a right triangle with legs p = RU and q = RV in a random pose. */
const rightFigure = (rng: Rng, p: number, q: number, l: RightLabels, en: string, zh: string) =>
  figure(rightMarks(rightTri(p, q, pickPose(rng)), l), en, zh);

/** S is an exact number c·√m with m square-free; m = 1 for a rational number. */
type S = readonly [Q, number];

const q = (n: number, d = 1) => Q.of(n, d);

/** rootOf writes √n in simplest form, as [k, m] with n = k²·m. */
function rootOf(n: number): [number, number] {
  let k = 1;
  for (let f = 2; f * f <= n / (k * k); f++) while ((n / (k * k)) % (f * f) === 0) k *= f;
  return [k, n / (k * k)];
}

/** sqrtS is √n as an exact number. */
const sqrtS = (n: number): S => {
  const [k, m] = rootOf(n);
  return [q(k), m];
};

/** surd is c·√m as an exact number, simplifying m. */
const surd = (c: Q | number, m: number): S => {
  const [k, r] = rootOf(m);
  return [(c instanceof Q ? c : q(c)).mul(q(k)), r];
};

/** int is a whole number as an exact number. */
const int = (n: number): S => [q(n), 1];

/** mulS multiplies two exact numbers. */
const mulS = (a: S, b: S): S => surd(a[0].mul(b[0]), a[1] * b[1]);

/** divS divides two exact numbers, rationalizing the denominator. */
const divS = (a: S, b: S): S => mulS(a, [Q.one.div(b[0].mul(q(b[1]))), b[1]]);

/** texS writes an exact number in simplest radical form. */
const texS = (s: S) => radical(s[0], s[1]);

/** rawTex writes an exact number as it was found, before rationalizing: "\sqrt{20}" for √20. */
const rawSqrt = (n: number) => {
  const r = Math.round(Math.sqrt(n));
  return r * r === n ? `${r}` : `\\sqrt{${n}}`;
};

/** triples are primitive Pythagorean triples whose triangles are not too thin to draw. */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [20, 21, 29],
  [7, 24, 25],
] as const;

/** pickTriple picks a Pythagorean triple with hypotenuse at most max, legs in random order. */
function pickTriple(rng: Rng, max = 60): [number, number, number] {
  for (;;) {
    const [a, b, c] = rng.pick(triples);
    if (c > max) continue;
    const k = rng.int(1, Math.max(1, Math.floor(max / c)));
    return rng.bool() ? [k * a, k * b, k * c] : [k * b, k * a, k * c];
  }
}

const letterSets = ["ABCDE", "PQRST", "JKLMN", "UVWXY", "DEFGH", "KLMNP"] as const;

/** pickLetters picks n letters for the points of a figure. */
const pickLetters = (rng: Rng, n: number): string[] => rng.pick(letterSets).slice(0, n).split("");

const triangleLetters = ["ABC", "PQR", "XYZ", "DEF", "JKL", "LMN", "RST"] as const;

/** pickTriLetters picks letters for the right-angle vertex R and the vertices U and V of a right triangle. */
const pickTriLetters = (rng: Rng) => rng.shuffle(rng.pick(triangleLetters).split("")) as [string, string, string];

/** seg names a segment by its endpoints in alphabetical order: "AB". */
const seg = (a: string, b: string) => [a, b].sort().join("");

// ---------------------------------------------------------------------------
// Trigonometry helpers

/** Fn is a trigonometric ratio of an acute angle. */
type Fn = "sin" | "cos" | "tan";

/** Fn6 is a trigonometric ratio or its reciprocal. */
type Fn6 = Fn | "csc" | "sec" | "cot";

/** Side is a side of a right triangle seen from one acute angle. */
type Side = "opp" | "adj" | "hyp";

/** fnSides are the numerator and denominator sides of each ratio. */
const fnSides: Record<Fn6, readonly [Side, Side]> = {
  sin: ["opp", "hyp"],
  cos: ["adj", "hyp"],
  tan: ["opp", "adj"],
  csc: ["hyp", "opp"],
  sec: ["hyp", "adj"],
  cot: ["adj", "opp"],
};

/** reciprocalOf pairs each ratio with its reciprocal. */
const reciprocalOf: Record<Fn6, Fn6> = { sin: "csc", cos: "sec", tan: "cot", csc: "sin", sec: "cos", cot: "tan" };

/** cofunction pairs each ratio with the ratio of the complementary angle that equals it. */
const cofunction: Record<Fn6, Fn6> = { sin: "cos", cos: "sin", tan: "cot", cot: "tan", sec: "csc", csc: "sec" };

const fnNames: Record<Fn6, Text> = {
  sin: t("sine", "正弦"),
  cos: t("cosine", "余弦"),
  tan: t("tangent", "正切"),
  csc: t("cosecant", "余割"),
  sec: t("secant", "正割"),
  cot: t("cotangent", "余切"),
};

const sideNames: Record<Side, Text> = {
  opp: t("the opposite side", "对边"),
  adj: t("the adjacent side", "邻边"),
  hyp: t("the hypotenuse", "斜边"),
};

/** trig is a ratio of an angle in degrees. */
function trig(f: Fn6, d: number): number {
  const [s, c] = [Math.sin(rad(d)), Math.cos(rad(d))];
  const v = { sin: s, cos: c, tan: s / c, csc: 1 / s, sec: 1 / c, cot: c / s };
  return v[f];
}

/** t4 is x rounded to four decimal places, as a calculator value copied by hand. */
const t4 = (x: number) => Math.round(x * 1e4) / 1e4;

/** roundQ is a positive x rounded to the given number of decimal places, as an exact number. */
const roundQ = (x: number, places = 1) => Q.of(Math.round(x * 10 ** places), 10 ** places);

/**
 * rounded is x rounded to the given number of decimal places, or undefined when
 * x lies close to a rounding boundary or approx (the same computation with
 * ratios rounded to four places) rounds differently, so that every learner
 * with a calculator gets the same answer.
 */
function rounded(x: number, approx: number, places = 1): Q | undefined {
  const s = x * 10 ** places;
  if (Math.abs(s - Math.floor(s) - 0.5) < 0.1 || Math.round(s) !== Math.round(approx * 10 ** places)) return undefined;
  return roundQ(x, places);
}

/** ratioTex writes the definition of a ratio with the given side values: "\sin 35^\circ = \frac{x}{12}". */
function ratioTex(f: Fn6, angle: string, sides: Partial<Record<Side, string>>): string {
  const [n, d] = fnSides[f];
  return `\\${f} ${angle} = \\frac{${sides[n] ?? "?"}}{${sides[d] ?? "?"}}`;
}

/** Ratios are the exact sides of a right triangle seen from one acute angle. */
type Ratios = Record<Side, S>;

/** ratioS is the exact value of a ratio from the sides. */
const ratioS = (f: Fn6, r: Ratios): S => divS(r[fnSides[f][0]], r[fnSides[f][1]]);

/** sidesFrom builds the sides of a right triangle in which f of the angle is a / b. */
function sidesFrom(f: Fn, a: number, b: number): Ratios {
  if (f === "sin") return { opp: int(a), hyp: int(b), adj: sqrtS(b * b - a * a) };
  if (f === "cos") return { adj: int(a), hyp: int(b), opp: sqrtS(b * b - a * a) };
  return { opp: int(a), adj: int(b), hyp: sqrtS(a * a + b * b) };
}

/** pickRatio picks a fraction a / b in lowest terms that can be f of an acute angle: a < b for sine and cosine. */
function pickRatio(rng: Rng, f: Fn, max = 12): [number, number] {
  for (;;) {
    const a = rng.int(1, max);
    const b = rng.int(2, max);
    if ((f !== "tan" && a >= b) || a === b || Q.of(a, b).d !== BigInt(b)) continue;
    return [a, b];
  }
}

/** special are the exact sines and cosines of 30°, 45° and 60°. */
const specialSin: Record<30 | 45 | 60, S> = { 30: [q(1, 2), 1], 45: [q(1, 2), 2], 60: [q(1, 2), 3] };

/** specialS is the exact value of a ratio of 30°, 45° or 60°. */
function specialS(f: Fn6, a: 30 | 45 | 60): S {
  const r: Ratios = { opp: specialSin[a], adj: specialSin[(90 - a) as 30 | 45 | 60], hyp: int(1) };
  return ratioS(f, r);
}

/** pickUnitM picks the unit of a length in a word problem. */
const unitTex = (v: string) => `${v}\\text{ m}`;

// ---------------------------------------------------------------------------
// Proofs

/** reasons are the reasons a step of a two-column proof can cite. */
const reasons = {
  given: t("Given", "已知"),
  parallelogram: t("Definition of a parallelogram", "平行四边形的定义"),
  alternate: t("Alternate interior angles are congruent", "两直线平行，内错角相等"),
  consecutive: t("Consecutive interior angles are supplementary", "两直线平行，同旁内角互补"),
  altConverse: t("Converse of the alternate interior angles theorem", "内错角相等，两直线平行"),
  vertical: t("Vertical angles are congruent", "对顶角相等"),
  linearPair: t("Angles in a linear pair are supplementary", "邻补角互补"),
  reflexive: t("Reflexive property", "自反性"),
  substitution: t("Substitution", "等量代换"),
  subtraction: t("Subtraction property of equality", "等式的减法性质"),
  halving: t("Substitution, then division by 2", "等量代换，再两边除以 2"),
  sas: t("SAS congruence criterion", "SAS（边角边）判定"),
  asa: t("ASA congruence criterion", "ASA（角边角）判定"),
  aas: t("AAS congruence criterion", "AAS（角角边）判定"),
  sss: t("SSS congruence criterion", "SSS（边边边）判定"),
  cpctc: t("Corresponding parts of congruent triangles are congruent", "全等三角形的对应部分相等"),
  oppositeSides: t("Opposite sides of a parallelogram are congruent", "平行四边形的对边相等"),
  oppositeAngles: t("Opposite angles of a parallelogram are congruent", "平行四边形的对角相等"),
  diagonalsBisect: t("Diagonals of a parallelogram bisect each other", "平行四边形的对角线互相平分"),
  onePair: t(
    "A quadrilateral with one pair of opposite sides both parallel and congruent is a parallelogram",
    "一组对边平行且相等的四边形是平行四边形",
  ),
  rightParallelogram: t("A parallelogram with a right angle is a rectangle", "有一个角是直角的平行四边形是矩形"),
} as const;

/** Reason names a reason a proof step can cite. */
type Reason = keyof typeof reasons;

/** does says what each reason other than Given states, as a clause. */
const does: Record<Exclude<Reason, "given">, Text> = {
  parallelogram: t("a parallelogram is a quadrilateral whose opposite sides are parallel", "平行四边形是两组对边分别平行的四边形"),
  alternate: t(
    "parallel lines cut by a transversal make equal alternate interior angles, on opposite sides of the transversal and between the parallels",
    "两条平行线被截线所截，截线两侧、两平行线之间的内错角相等",
  ),
  consecutive: t(
    "parallel lines cut by a transversal make consecutive interior angles, on the same side of the transversal and between the parallels, that add up to 180°",
    "两条平行线被截线所截，截线同侧、两平行线之间的同旁内角之和为 180°",
  ),
  altConverse: t(
    "two lines cut by a transversal are parallel when the alternate interior angles are equal",
    "两条直线被截线所截，若内错角相等，则两直线平行",
  ),
  vertical: t("the angles that face each other where two lines cross are equal", "两线相交时，隔着交点相对的两个角相等"),
  linearPair: t("two angles that together make a straight line add up to 180°", "合成一条直线的两个角之和为 180°"),
  reflexive: t("a segment or an angle equals itself", "线段或角等于它自身"),
  substitution: t("two quantities equal to the same one can replace each other", "等于同一个量的两个量可以互相代换"),
  subtraction: t("subtracting the same quantity from equal quantities leaves equal quantities", "等量减去同一个量，结果仍相等"),
  halving: t("an angle added to an equal angle to make 180° is half of 180°", "一个角与和它相等的角合起来是 180°，所以它是 180° 的一半"),
  sas: t(
    "two pairs of equal sides with the equal angles between them make two triangles congruent",
    "两边及其夹角分别相等的两个三角形全等",
  ),
  asa: t(
    "two pairs of equal angles with the equal sides between them make two triangles congruent",
    "两角及其夹边分别相等的两个三角形全等",
  ),
  aas: t(
    "two pairs of equal angles and a pair of equal sides not between them make two triangles congruent",
    "两角及其中一角的对边分别相等的两个三角形全等",
  ),
  sss: t("three pairs of equal sides make two triangles congruent", "三组边分别相等的两个三角形全等"),
  cpctc: t("triangles already proved congruent have equal corresponding parts", "已证全等的三角形，对应部分相等"),
  oppositeSides: t("the opposite sides of a parallelogram are equal, as proved before", "平行四边形的对边相等（前面已证）"),
  oppositeAngles: t("the opposite angles of a parallelogram are equal, as proved before", "平行四边形的对角相等（前面已证）"),
  diagonalsBisect: t("the diagonals of a parallelogram cut each other in half, as proved before", "平行四边形的对角线互相平分（前面已证）"),
  onePair: t(
    "a quadrilateral with one pair of opposite sides both parallel and equal is a parallelogram",
    "一组对边平行且相等的四边形是平行四边形",
  ),
  rightParallelogram: t("a parallelogram with a right angle is a rectangle", "有一个角是直角的平行四边形是矩形"),
};

/** altWhy says why a wrong statement does not follow by the step's reason. */
const altWhy: Partial<Record<Reason, Text>> = {
  parallelogram: t(
    "The definition only says that opposite sides are parallel; it says nothing about lengths, diagonals or right angles.",
    "定义只说对边平行，没有说长度、对角线或直角。",
  ),
  alternate: t(
    "Alternate interior angles lie on opposite sides of the transversal, between the two parallel sides, and these two angles do not.",
    "内错角在截线两侧、两条平行边之间，而这两个角不是这样。",
  ),
  consecutive: t(
    "Consecutive interior angles add up to 180°; they are not equal in general, and this pair is not on one transversal between the parallels.",
    "同旁内角之和是 180°，一般并不相等；而且这组角不是同一条截线在两平行线之间的同旁内角。",
  ),
  altConverse: t(
    "The equal alternate angles lie along the diagonal between this pair of sides, so it is these two sides that are parallel, not others, and nothing is said about lengths.",
    "相等的内错角在这两条边之间的对角线上，所以平行的是这两条边，而不是别的边，也说明不了长度。",
  ),
  vertical: t(
    "Vertical angles face each other across the crossing; these angles are next to each other, or not at the crossing at all.",
    "对顶角是隔着交点相对的角；这两个角是相邻的，或者根本不在交点处。",
  ),
  substitution: t("Each side of the equation must be one of the two sums equal to 180°.", "等式两边必须分别是那两个等于 180° 的和。"),
  subtraction: t(
    "Subtracting the shared angle leaves the two other angles, not these.",
    "减去公共的角，剩下的是另外两个角，而不是这两个。",
  ),
  halving: t("Two equal angles that add up to 180° are 90° each.", "两个相等的角之和是 180°，每个就是 90°。"),
  cpctc: t(
    "Corresponding parts sit in the same places of the congruence statement, and these parts do not.",
    "对应部分在全等式中位置相同，而这两个部分的位置不同。",
  ),
  oppositeSides: t(
    "Only opposite sides are known equal, and these are not a pair of opposite sides.",
    "只有对边相等，而这两条不是一组对边。",
  ),
  ...Object.fromEntries(
    (["sas", "asa", "aas", "sss"] as const).map((c) => [
      c,
      t(
        "The vertices must be listed in corresponding order, and this statement pairs vertices that do not correspond.",
        "顶点必须按对应顺序书写，而这个全等式把不对应的顶点配在了一起。",
      ),
    ]),
  ),
};

/** alike are reasons too close to tell apart in a step: neither is offered as a wrong option when the other is right. */
const alike: Partial<Record<Reason, readonly Reason[]>> = {
  asa: ["aas"],
  aas: ["asa"],
  linearPair: ["halving"],
  substitution: ["halving"],
  halving: ["substitution", "linearPair"],
  onePair: ["parallelogram"],
  parallelogram: ["onePair"],
};

/** ProofStep is one line of a two-column proof: a statement, its reason, and wrong statements to offer instead of it. */
interface ProofStep {
  readonly s: Text;
  readonly r: Reason;
  readonly alts?: readonly Text[];
  /** why explains the step in the solution. */
  readonly why?: Text;
  /** marks are the ticks, arcs, arrows or right-angle marks that the step's fact adds to the figure. */
  readonly marks?: readonly Mark[];
  /** drawn says that the problem's figure already shows the step's marks, since they come straight from the given facts. */
  readonly drawn?: boolean;
}

/** Proof is a two-column proof with the bare drawing of its figure and a check of its conclusion. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  /** base draws the figure without any marks of equality. */
  readonly base: readonly Mark[];
  readonly alt: readonly [string, string];
  /** check confirms the conclusion: the parts a criterion uses, or the statement tried on numbers. */
  readonly check: Text;
}

/** mt wraps LaTeX as a language-neutral text. */
const mt = (tex: string) => same(`$${tex}$`);

/** both writes two LaTeX statements joined by "and". */
const both = (a: string, b: string) => t(`$${a}$ and $${b}$`, `$${a}$，$${b}$`);

/** cap starts a sentence with a capital letter. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** proofProblem asks for the reason, or the statement, of one step of a proof; pool lists the reasons offered as wrong options. */
function proofProblem(rng: Rng, proof: Proof, pool: readonly Reason[]): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [target, k] = rng.pick(eligible);
  const r = target.r as Exclude<Reason, "given">;
  const askStatement = target.alts !== undefined && target.alts.length >= 2 && altWhy[r] !== undefined && rng.bool(0.4);
  let options: Text[];
  let wrongWhy: (readonly [string, string, string])[];
  if (askStatement) {
    options = [target.s, ...rng.sample(target.alts!, Math.min(3, target.alts!.length))];
    const why = altWhy[r]!;
    wrongWhy = options.slice(1).map((o) => [o.en, why.en, why["zh-CN"]] as const);
  } else {
    const others = pool.filter((x) => x !== target.r && !(alike[target.r] ?? []).includes(x));
    const picked = rng.sample(others, Math.min(3, others.length));
    options = [reasons[target.r], ...picked.map((x) => reasons[x])];
    wrongWhy = picked.map((x) =>
      x === "given"
        ? ([
            reasons.given.en,
            `Step ${k + 1} is not one of the given facts; it has to be derived from them.`,
            `第 ${k + 1} 步不是已知条件，而是要由已知推出来的。`,
          ] as const)
        : ([
            reasons[x].en,
            `It says that ${does[x].en}, which is not what step ${k + 1} states.`,
            `它说的是${does[x]["zh-CN"]}，而第 ${k + 1} 步不是这样的结论。`,
          ] as const),
    );
  }
  const shuffled = rng.shuffle(options);
  const correct = shuffled.indexOf(options[0]!);
  const line = (lang: "en" | "zh-CN", s: ProofStep, i: number) => {
    const statement = askStatement && i === k ? "**?**" : s.s[lang];
    const reason = !askStatement && i === k ? "**?**" : reasons[s.r][lang];
    return `${i + 1}. ${statement} —— ${reason}`;
  };
  const list = (lang: "en" | "zh-CN") => proof.steps.map((s, i) => line(lang, s, i)).join("\n");
  const ask = askStatement
    ? t(`Which statement belongs in step ${k + 1}?`, `第 ${k + 1} 步应填哪个结论？`)
    : t(`Which reason justifies step ${k + 1}?`, `第 ${k + 1} 步的理由是什么？`);
  const why = target.why ? t(` ${target.why.en}`, target.why["zh-CN"]) : t("", "");
  const drawing = proofFigures(proof);
  const first = askStatement
    ? t(
        `Step ${k + 1} cites “${reasons[r].en}”: ${does[r].en}. Applied here, it gives ${target.s.en}.${why.en}`,
        `第 ${k + 1} 步的理由是“${reasons[r]["zh-CN"]}”：${does[r]["zh-CN"]}。用在这里，得到 ${target.s["zh-CN"]}。${why["zh-CN"]}`,
      )
    : t(
        `Step ${k + 1} states ${target.s.en}. ${cap(does[r].en)}, so the reason is: ${reasons[r].en}.${why.en}`,
        `第 ${k + 1} 步的结论是 ${target.s["zh-CN"]}。${does[r]["zh-CN"]}，所以理由是：${reasons[r]["zh-CN"]}。${why["zh-CN"]}`,
      );
  const walk = (lang: "en" | "zh-CN") => {
    const paragraphs: string[] = [];
    let current: string[] = [lang === "en" ? "The figure marks the given facts." : "图中标出了已知条件。"];
    proof.steps.forEach((s, i) => {
      if (s.r === "given") return;
      current.push(
        lang === "en" ? `Step ${i + 1}: ${s.s.en} (${reasons[s.r].en}).` : `第 ${i + 1} 步：${s.s["zh-CN"]}（${reasons[s.r]["zh-CN"]}）。`,
      );
      const j = drawing.at.get(i);
      if (j !== undefined) {
        paragraphs.push(current.join(lang === "en" ? " " : ""), `{{figure ${j}}}`);
        current = [];
      }
    });
    if (current.length > 0) paragraphs.push(current.join(lang === "en" ? " " : ""));
    return paragraphs.join("\n\n");
  };
  return {
    ...reasoned(
      choiceProblem({
        prompt: t(
          `**Given:** ${proof.given.en}\n\n**Prove:** ${proof.prove.en}\n\n${list("en")}\n\n${ask.en}`,
          `**已知：** ${proof.given["zh-CN"]}\n\n**求证：** ${proof.prove["zh-CN"]}\n\n${list("zh-CN")}\n\n${ask["zh-CN"]}`,
        ),
        options: shuffled,
        correct,
        solution: paras(
          cat(stepLabel(1, "see what the step does", "看这一步做什么"), t(" ", ""), first),
          cat(stepLabel(2, "follow the proof in the figure", "在图中走一遍证明"), t(" ", ""), t(walk("en"), walk("zh-CN"))),
          cat(t("**Check.** ", "**检验。** "), proof.check),
        ),
      }),
      wrongWhy,
    ),
    figure: drawing.figure,
    solutionFigures: drawing.steps,
  };
}

// ---------------------------------------------------------------------------
// Quadrilaterals

/** Quad is the four corners of a quadrilateral ABCD, in order. */
type Quad = readonly [Point, Point, Point, Point];

/** squarePoints places a square of side 4 in a random pose. */
const squarePoints = (rng: Rng): Quad =>
  posed([[0, 0] as Point, [4, 0] as Point, [4, 4] as Point, [0, 4] as Point] as const, pickPose(rng));

/** gramPoints places a parallelogram ABCD with angle a at A, maybe mirrored. */
function gramPoints(rng: Rng, a: number): Quad {
  const w = rng.int(5, 7);
  const d = dir(a, rng.pick([3.5, 4, 4.5]));
  const pts: Quad = [[0, 0], [w, 0], [w + d[0], d[1]], d];
  return rng.bool() ? (pts.map(([x, y]) => [-x, y] as Point) as unknown as Quad) : pts;
}

/** quadMarks draws a quadrilateral with letters and, optionally, the diagonal AC, both diagonals, and the label of their intersection. */
function quadMarks(pts: Quad, letters: string, diagonals: "none" | "ac" | "both", e?: string): Mark[] {
  const [a, b, c, d] = pts;
  const marks: Mark[] = [{ kind: "polygon", points: pts }, ...names(pts, letters.slice(0, 4))];
  if (diagonals !== "none") marks.push({ kind: "segment", a, b: c, accent: true });
  if (diagonals === "both") marks.push({ kind: "segment", a: b, b: d, accent: true });
  if (e) marks.push(between(center([a, c]), a, b, e));
  return marks;
}

/** quadAngle marks the angle at corner i of a quadrilateral. */
function quadAngle(pts: Quad, i: number, label?: string, accent = false): Extract<Mark, { kind: "arc" }> {
  return { kind: "arc", vertex: pts[i]!, from: pts[(i + 1) % 4]!, to: pts[(i + 3) % 4]!, label, accent };
}

/** squareIntro draws a square of side 5 cut by its diagonal into two isosceles right triangles. */
const squareIntro: Figure = (() => {
  const pts: Quad = [
    [0, 0],
    [4, 0],
    [4, 4],
    [0, 4],
  ];
  return figure(
    [
      ...quadMarks(pts, "PQRS", "ac"),
      ...outside(pts, ["5", "5", null, null]),
      { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] },
      { kind: "arc", vertex: pts[0], from: pts[1], to: pts[2], label: "45°" },
      { kind: "arc", vertex: pts[2], from: pts[0], to: pts[1], label: "45°" },
    ],
    "Square PQRS with side 5 and the diagonal PR, which cuts it into two isosceles right triangles with 45° angles at P and R.",
    "边长为 5 的正方形 PQRS 和对角线 PR，它把正方形分成两个等腰直角三角形，P、R 处的角都是 45°。",
  );
})();

/** about writes an exact length, followed by its decimal value when it is not a whole number. */
const about = (x: S) =>
  x[1] === 1 && x[0].isInteger() ? texS(x) : `${texS(x)} \\approx ${dec(roundQ(x[0].toNumber() * Math.sqrt(x[1]), 2))}`;

/** squareCheck writes the check that a side s and a diagonal d of a square satisfy d² = s² + s². */
function squareCheck(side: S, d: S): Text {
  const sq = (x: S) => x[0].mul(x[0]).mul(q(x[1]));
  const s2 = sq(side).toLatex();
  const d2 = sq(d).toLatex();
  const w = (x: S) => (x[1] === 1 && x[0].isInteger() ? texS(x) : `(${texS(x)})`);
  return check(
    `By the Pythagorean theorem the diagonal must satisfy $d^2 = s^2 + s^2$: $${w(d)}^2 = ${d2}$ and $${w(side)}^2 + ${w(side)}^2 = ${s2} + ${s2} = ${d2}$. Also, the diagonal $${about(d)}$ is longer than the side $${about(side)}$, as a hypotenuse must be.`,
    `由勾股定理，对角线必须满足 $d^2 = s^2 + s^2$：$${w(d)}^2 = ${d2}$，而 $${w(side)}^2 + ${w(side)}^2 = ${s2} + ${s2} = ${d2}$。另外，对角线 $${about(d)}$ 比边长 $${about(side)}$ 长，斜边理应如此。`,
  );
}

export const diagonalsOfSquares: TopicDef = {
  id: "diagonals-of-squares",
  title: t("Diagonals of Squares", "正方形的对角线"),
  summary: t(
    "Use the properties of the diagonals of a square and the ratio d = s√2 between its diagonal and side.",
    "运用正方形对角线的性质，以及对角线与边长的关系 d = s√2。",
  ),
  prerequisites: ["isosceles-right-triangles", "area-of-rectangles-and-squares"],
  encompasses: [
    { topic: "isosceles-right-triangles", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.11", "CCSS.8.G.B.7"],
  intro: t(
    `An isosceles right triangle has two equal legs and two $45^\\circ$ angles, and its hypotenuse is a leg times $\\sqrt{2}$. A square hides two of them. Draw the diagonal $PR$ of a square $PQRS$ with side $5$:

{{figure 0}}

The triangle $PQR$ has a right angle at $Q$ and two legs of $5$, so it is an isosceles right triangle, and its hypotenuse is the diagonal:

$$PR^2 = 5^2 + 5^2 = 50, \\qquad PR = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07.$$

A diagonal of a square is therefore always its side times $\\sqrt{2}$, a little less than one and a half sides. The same picture explains the angles: the diagonal cuts each right angle at its ends into two $45^\\circ$ angles.

The square is also a parallelogram, a rectangle and a rhombus at once, so its two diagonals have all their properties together: they cut each other in half, they are equal, and they are perpendicular. In this lesson we use these properties to find unknowns, then go from a side to the diagonal and back, and finally find the area and perimeter of a square from its diagonal.`,
    `等腰直角三角形有两条相等的直角边和两个 $45^\\circ$ 角，斜边等于直角边乘以 $\\sqrt{2}$。正方形里就藏着两个这样的三角形。在边长为 $5$ 的正方形 $PQRS$ 中画出对角线 $PR$：

{{figure 0}}

三角形 $PQR$ 在 $Q$ 处是直角，两条直角边都是 $5$，所以它是等腰直角三角形，斜边就是对角线：

$$PR^2 = 5^2 + 5^2 = 50, \\qquad PR = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07.$$

所以正方形的对角线总是边长乘以 $\\sqrt{2}$，比一条半边略短。同一张图也说明了角：对角线把两端的直角各分成两个 $45^\\circ$ 角。

正方形同时是平行四边形、矩形和菱形，所以两条对角线兼有它们的性质：互相平分、长度相等、互相垂直。这节课先用这些性质求未知数，再由边长求对角线、由对角线求边长，最后由对角线求正方形的面积和周长。`,
  ),
  introFigures: [squareIntro],
  knowledgePoints: [
    {
      id: "properties-of-the-diagonals",
      figure: specialDrawings["properties-of-the-diagonals"],
      title: t("Properties of the diagonals", "对角线的性质"),
      explanation: t(
        "The two diagonals of a square $ABCD$ meet at a point $E$. A square is a parallelogram, a rectangle and a rhombus, so its diagonals have the properties of all three:\n\n- they **bisect each other** (as in every parallelogram): $AE = CE$ and $BE = DE$;\n- they are **congruent** (as in every rectangle): $AC = BD$;\n- they are **perpendicular** (as in every rhombus), and each one bisects the right angles at its ends into $45^\\circ$ angles.\n\nHalves of equal segments are equal, so all four segments $AE$, $BE$, $CE$, $DE$ are equal, and each diagonal is twice any of them. If $AE = 3x - 4$ and $BD = 4x + 2$, then $BD = 2 \\cdot AE$:\n\n$$4x + 2 = 2(3x - 4) = 6x - 8, \\qquad 10 = 2x, \\qquad x = 5.$$\n\nThen $AE = 11$ and $BD = 22$, twice as long, as it should be.\n\n> **Watch out.** Check whether each segment is a half or a whole diagonal. Setting $AE = BD$ forgets that $BD$ is made of two halves; the equation needs the factor $2$ on the half.",
        "正方形 $ABCD$ 的两条对角线交于点 $E$。正方形既是平行四边形，又是矩形和菱形，所以它的对角线兼有三者的性质：\n\n- 两条对角线**互相平分**（每个平行四边形都如此）：$AE = CE$，$BE = DE$；\n- 两条对角线**相等**（每个矩形都如此）：$AC = BD$；\n- 两条对角线**互相垂直**（每个菱形都如此），并且每条对角线都把它两端的直角平分成两个 $45^\\circ$ 角。\n\n相等线段的一半也相等，所以 $AE$、$BE$、$CE$、$DE$ 四条线段都相等，每条对角线是其中任意一条的两倍。若 $AE = 3x - 4$，$BD = 4x + 2$，则 $BD = 2 \\cdot AE$：\n\n$$4x + 2 = 2(3x - 4) = 6x - 8, \\qquad 10 = 2x, \\qquad x = 5.$$\n\n于是 $AE = 11$，$BD = 22$，正好是两倍。\n\n> **注意。** 先看清每条线段是半条还是整条对角线。令 $AE = BD$ 就忘了 $BD$ 由两段组成；方程里半条对角线要乘以 $2$。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 12);
          const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
          const pairs = [
            [`${A}${E}`, `${C}${E}`, 1],
            [`${A}${E}`, `${B}${E}`, 1],
            [`${D}${E}`, `${A}${C}`, 2],
            [`${A}${E}`, `${B}${D}`, 2],
          ] as const;
          const [first, second, k] = rng.pick(pairs);
          const a = rng.int(1, 4);
          const b = rng.int(-6, 9);
          const c = rng.int(1, 7);
          if (c === k * a || a * x + b <= 0) continue;
          const d = k * (a * x + b) - c * x;
          if (Math.abs(d) > 40) continue;
          const half = a * x + b;
          const lhs = k === 1 ? linear(a, b) : `2(${linear(a, b)})`;
          const why =
            k === 1
              ? second === `${C}${E}`
                ? t(
                    `$${first}$ and $${second}$ are the two halves of the diagonal $${A}${C}$, and the diagonals bisect each other, so the halves are equal:`,
                    `$${first}$ 与 $${second}$ 是对角线 $${A}${C}$ 的两半，而对角线互相平分，所以两半相等：`,
                  )
                : t(
                    `$${first}$ and $${second}$ are halves of the two different diagonals. The diagonals are equal and bisect each other, so all four halves are equal:`,
                    `$${first}$ 与 $${second}$ 分别是两条不同对角线的一半。对角线相等且互相平分，所以四条半对角线都相等：`,
                  )
              : t(
                  `$${first}$ is half of one diagonal and $${second}$ is the whole other diagonal. The diagonals are equal and bisect each other, so the whole diagonal is twice the half:`,
                  `$${first}$ 是一条对角线的一半，$${second}$ 是另一整条对角线。对角线相等且互相平分，所以整条对角线是半条的两倍：`,
                );
          const pts = squarePoints(rng);
          const pe = center([pts[0], pts[2]]);
          const work = chain(
            `${linear(c, d)} = ${lhs}`,
            `${linear(c, d)} = ${linear(k * a, k * b)}`,
            `${linear(c - k * a, 0)} = ${k * b - d}`,
            `x = ${x}`,
          );
          const at = (u: number, v: number) =>
            `${u === 1 ? "" : `${u} \\cdot `}${x}${v === 0 ? "" : ` ${v < 0 ? "-" : "+"} ${Math.abs(v)}`}`;
          const base = [
            ...quadMarks(pts, `${A}${B}${C}${D}`, "both", E),
            { kind: "right", vertex: pts[0], from: pts[1], to: pts[3] } as Mark,
          ];
          return {
            ...numberProblem({
              prompt: t(
                `$${A}${B}${C}${D}$ is a square whose diagonals meet at $${E}$. If $${first} = ${linear(a, b)}$ and $${second} = ${linear(c, d)}$, find $x$.`,
                `$${A}${B}${C}${D}$ 是正方形，对角线交于 $${E}$。若 $${first} = ${linear(a, b)}$，$${second} = ${linear(c, d)}$，求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [
                k === 2 ? intOr(d - b, a - c, -x) : intOr(d - 2 * b, 2 * a - c, -x),
                k === 2 ? intOr(2 * d - b, a - 2 * c, x + 1) : intOr(d + b, a + c, x + 1),
              ],
              solution: paras(
                step(1, "relate the two segments", "找出两条线段的关系", t(`${why.en}\n\n{{figure 0}}`, `${why["zh-CN"]}\n\n{{figure 0}}`)),
                step(2, "solve the equation", "解方程", t(`Expand and collect the terms in $x$:${work}`, `展开并合并含 $x$ 的项：${work}`)),
                check(
                  `With $x = ${x}$, $${first} = ${at(a, b)} = ${half}$ and $${second} = ${at(c, d)} = ${k * half}$${k === 1 ? ": the two are equal." : `, twice $${half}$.`}`,
                  `当 $x = ${x}$ 时，$${first} = ${at(a, b)} = ${half}$，$${second} = ${at(c, d)} = ${k * half}$${k === 1 ? "，两者相等。" : `，正好是 $${half}$ 的两倍。`}`,
                ),
              ),
            }),
            figure: figure(
              base,
              `Square ${A}${B}${C}${D} with diagonals ${A}${C} and ${B}${D} meeting at ${E}.`,
              `正方形 ${A}${B}${C}${D}，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}。`,
            ),
            solutionFigures: [
              figure(
                [...base, ...[pts[0], pts[1], pts[2], pts[3]].flatMap((p) => highlighted({ kind: "ticks", a: p, b: pe, count: 1 }))],
                `Square ${A}${B}${C}${D}: the four halves ${A}${E}, ${B}${E}, ${C}${E} and ${D}${E} of the diagonals are marked equal.`,
                `正方形 ${A}${B}${C}${D}：对角线的四段 ${A}${E}、${B}${E}、${C}${E}、${D}${E} 标为相等。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "the-diagonal-from-the-side",
      figure: specialDrawings["the-diagonal-from-the-side"],
      title: t("The diagonal from the side", "由边长求对角线"),
      explanation: t(
        "A diagonal cuts a square into two isosceles right triangles: the legs are sides $s$ and the hypotenuse is the diagonal $d$. By the Pythagorean theorem\n\n$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = \\sqrt{2s^2} = s\\sqrt{2}.$$\n\nA square with side $6$ has diagonal $6\\sqrt{2} \\approx 8.49$. When the side already has a root, multiply the roots: a square with side $4\\sqrt{2}$ has diagonal $4\\sqrt{2} \\cdot \\sqrt{2} = 4 \\cdot 2 = 8$.\n\n> **Watch out.** The diagonal is the side times $\\sqrt{2}$, not times $2$: $6\\sqrt{2} \\approx 8.5$ is shorter than two sides, $12$, since a straight path across is shorter than going around the corner. And $\\sqrt{2} \\cdot 6$ is not $\\sqrt{12}$; the $6$ stays outside the root.",
        "一条对角线把正方形分成两个等腰直角三角形：直角边是边长 $s$，斜边是对角线 $d$。由勾股定理\n\n$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = \\sqrt{2s^2} = s\\sqrt{2}.$$\n\n边长为 $6$ 的正方形，对角线是 $6\\sqrt{2} \\approx 8.49$。边长本身含根号时，把根号相乘：边长为 $4\\sqrt{2}$ 的正方形，对角线是 $4\\sqrt{2} \\cdot \\sqrt{2} = 4 \\cdot 2 = 8$。\n\n> **注意。** 对角线是边长乘以 $\\sqrt{2}$，不是乘以 $2$：$6\\sqrt{2} \\approx 8.5$ 比两条边之和 $12$ 短，因为斜穿过去比绕过拐角近。另外，$\\sqrt{2} \\cdot 6$ 不是 $\\sqrt{12}$，$6$ 留在根号外面。",
      ),
      keyPrerequisites: ["isosceles-right-triangles"],
      generate(rng) {
        const rooted = rng.bool(0.3);
        const k = rooted ? rng.int(2, 12) : rng.int(2, 20);
        const side: S = rooted ? [q(k), 2] : int(k);
        const d = mulS(side, [Q.one, 2]);
        const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
        const pts = squarePoints(rng);
        const sideLabel = rooted ? `${k}√2` : `${k}`;
        const base = [...quadMarks(pts, `${A}${B}${C}${D}`, "ac"), { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] } as Mark];
        const product = rooted ? `${k}\\sqrt{2} \\cdot \\sqrt{2} = ${k} \\cdot 2 = ${texS(d)}` : `${k} \\cdot \\sqrt{2} = ${texS(d)}`;
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length of the diagonal $${A}${C}$ of the square $${A}${B}${C}${D}$. Give your answer in simplest radical form.`,
              `求正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C}$ 的长。答案写成最简根式。`,
            ),
            answer: d,
            wrong: [texS(mulS(side, int(2))), texS(side), texS(mulS(side, [Q.one, 3])), rooted ? `${k}\\sqrt{4}` : `\\sqrt{${2 * k}}`],
            solution: paras(
              step(
                1,
                "see the right triangle",
                "找出直角三角形",
                t(
                  `The diagonal $${A}${C}$ cuts off the triangle $${A}${B}${C}$, with a right angle at $${B}$ and two legs equal to the side $${texS(side)}$. It is an isosceles right triangle, and $${A}${C}$ is its hypotenuse:\n\n{{figure 0}}`,
                  `对角线 $${A}${C}$ 截出三角形 $${A}${B}${C}$，它在 $${B}$ 处是直角，两条直角边都等于边长 $${texS(side)}$。这是等腰直角三角形，$${A}${C}$ 是它的斜边：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "multiply by the square root of 2",
                "乘以根号 2",
                t(
                  `The hypotenuse of an isosceles right triangle is a leg times $\\sqrt{2}$:${steps(`${A}${C} = ${product}`)}`,
                  `等腰直角三角形的斜边等于直角边乘以 $\\sqrt{2}$：${steps(`${A}${C} = ${product}`)}`,
                ),
              ),
              squareCheck(side, d),
            ),
          }),
          figure: figure(
            [...base, ...outside(pts, [sideLabel, null, null, null])],
            `Square ${A}${B}${C}${D} with side ${sideLabel} and diagonal ${A}${C}.`,
            `正方形 ${A}${B}${C}${D}，边长为 ${sideLabel}，对角线为 ${A}${C}。`,
          ),
          solutionFigures: [
            figure(
              [
                ...base,
                { kind: "polygon", points: [pts[0], pts[1], pts[2]], tone: "result" },
                ...outside(pts, [sideLabel, sideLabel, null, null]),
              ],
              `Square ${A}${B}${C}${D}: triangle ${A}${B}${C} is highlighted, with legs ${A}${B} = ${B}${C} = ${sideLabel} and hypotenuse ${A}${C}.`,
              `正方形 ${A}${B}${C}${D}：突出显示三角形 ${A}${B}${C}，直角边 ${A}${B} = ${B}${C} = ${sideLabel}，斜边为 ${A}${C}。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-side-from-the-diagonal",
      title: t("The side from the diagonal", "由对角线求边长"),
      explanation: t(
        "Going back, $d = s\\sqrt{2}$ is solved for $s$ by dividing by $\\sqrt{2}$. To write the result in simplest form, multiply the top and bottom by $\\sqrt{2}$ to rationalize the denominator:\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\nA square with diagonal $10$ has side $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2} \\approx 7.07$. When the diagonal is a multiple of $\\sqrt{2}$, the roots cancel: a square with diagonal $7\\sqrt{2}$ has side $\\frac{7\\sqrt{2}}{\\sqrt{2}} = 7$.\n\n{{figure 0}}\n\n> **Watch out.** Divide by $\\sqrt{2}$, not by $2$: half the diagonal, $5$, is too short for a side, since the side must be more than half of the diagonal (two sides are longer than the diagonal). And leave no root in the denominator: $\\frac{10}{\\sqrt{2}}$ is not yet in simplest form.",
        "反过来，从 $d = s\\sqrt{2}$ 解出 $s$，就是除以 $\\sqrt{2}$。为了写成最简形式，分子分母同乘 $\\sqrt{2}$，把分母有理化：\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\n对角线为 $10$ 的正方形，边长是 $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2} \\approx 7.07$。当对角线是 $\\sqrt{2}$ 的倍数时，根号约掉：对角线为 $7\\sqrt{2}$ 的正方形，边长是 $\\frac{7\\sqrt{2}}{\\sqrt{2}} = 7$。\n\n{{figure 0}}\n\n> **注意。** 要除以 $\\sqrt{2}$，不是除以 $2$：对角线的一半 $5$ 作边长太短了，因为两条边之和比对角线长，边长必然超过对角线的一半。另外分母里不能留根号：$\\frac{10}{\\sqrt{2}}$ 还不是最简形式。",
      ),
      figures: [
        figure(
          [
            ...quadMarks(
              [
                [0, 0],
                [4, 0],
                [4, 4],
                [0, 4],
              ],
              "ABCD",
              "ac",
            ),
            { kind: "side", a: [0, 0], b: [2, 2], text: "10" },
            { kind: "side", a: [4, 0], b: [4, 4], text: "5√2" },
            { kind: "right", vertex: [4, 0], from: [4, 4], to: [0, 0] },
          ],
          "Square ABCD with diagonal AC = 10 and side 5√2.",
          "正方形 ABCD，对角线 AC = 10，边长 5√2。",
        ),
      ],
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const rooted = rng.bool(0.3);
        const k = rooted ? rng.int(2, 15) : rng.int(2, 30);
        const d: S = rooted ? [q(k), 2] : int(k);
        const s = divS(d, [Q.one, 2]);
        const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
        const pts = squarePoints(rng);
        const dTex = texS(d);
        const base = [...quadMarks(pts, `${A}${B}${C}${D}`, "ac"), { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] } as Mark];
        const work = rooted
          ? chain(`s = \\frac{${dTex}}{\\sqrt{2}}`, `s = ${texS(s)}`)
          : chain(
              `s = \\frac{${k}}{\\sqrt{2}}`,
              `s = \\frac{${k}}{\\sqrt{2}} \\cdot \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{${k}\\sqrt{2}}{2}`,
              `s = ${texS(s)}`,
            );
        const back = rooted ? `${texS(s)} \\cdot \\sqrt{2}` : `${texS(s)} \\cdot \\sqrt{2}`;
        return {
          ...radicalProblem({
            prompt: t(
              `The diagonal $${A}${C}$ of the square $${A}${B}${C}${D}$ has length $${dTex}$. Find the length of a side. Give your answer in simplest radical form.`,
              `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C}$ 长 $${dTex}$。求它的边长。答案写成最简根式。`,
            ),
            answer: s,
            wrong: [texS(mulS(d, [Q.one, 2])), texS(divS(d, int(2))), rooted ? texS(int(2 * k)) : `\\frac{${k}}{\\sqrt{2}}`],
            solution: paras(
              step(
                1,
                "set up the equation",
                "列方程",
                t(
                  `The diagonal is the hypotenuse of the isosceles right triangle $${A}${B}${C}$, so it is the side $s$ times $\\sqrt{2}$: $s\\sqrt{2} = ${dTex}$.\n\n{{figure 0}}`,
                  `对角线是等腰直角三角形 $${A}${B}${C}$ 的斜边，所以等于边长 $s$ 乘以 $\\sqrt{2}$：$s\\sqrt{2} = ${dTex}$。\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "divide by the square root of 2",
                "除以根号 2",
                t(
                  `${rooted ? "The roots cancel:" : "Divide, then multiply the top and bottom by $\\sqrt{2}$:"}${work}`,
                  `${rooted ? "根号约掉：" : "相除，再把分子分母同乘 $\\sqrt{2}$："}${work}`,
                ),
              ),
              check(
                `Multiply back: $${back} = ${dTex}$, the given diagonal. The side $${about(s)}$ is longer than half the diagonal and shorter than the diagonal, as it must be.`,
                `乘回去：$${back} = ${dTex}$，正是已知的对角线。边长 $${about(s)}$ 比对角线的一半长、比对角线短，理应如此。`,
              ),
            ),
          }),
          figure: figure(base, `Square ${A}${B}${C}${D} with diagonal ${A}${C}.`, `正方形 ${A}${B}${C}${D}，对角线为 ${A}${C}。`),
          solutionFigures: [
            figure(
              [
                ...base,
                { kind: "polygon", points: [pts[0], pts[1], pts[2]], tone: "result" },
                { kind: "side", a: pts[0], b: center([pts[0], pts[2]]), text: rooted ? `${k}√2` : `${k}` },
                ...outside(pts, ["s", "s", null, null]),
              ],
              `Square ${A}${B}${C}${D}: triangle ${A}${B}${C} is highlighted, with legs s and hypotenuse ${A}${C} = ${rooted ? `${k}√2` : k}.`,
              `正方形 ${A}${B}${C}${D}：突出显示三角形 ${A}${B}${C}，直角边为 s，斜边 ${A}${C} = ${rooted ? `${k}√2` : k}。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-and-perimeter-from-the-diagonal",
      title: t("Area and perimeter from the diagonal", "由对角线求面积和周长"),
      explanation: t(
        "From the diagonal $d$, the side is $s = \\frac{d}{\\sqrt{2}}$. Squaring it removes the root, so the area is\n\n$$A = s^2 = \\frac{d^2}{2}.$$\n\nThe same comes from a second picture: the diagonal $AC$ cuts the square into two triangles, each with base $d$ and height half the other diagonal, $\\frac{d}{2}$, so $A = 2 \\cdot \\frac{1}{2} \\cdot d \\cdot \\frac{d}{2} = \\frac{d^2}{2}$. The perimeter is $4s = \\frac{4d}{\\sqrt{2}} = 2\\sqrt{2}\\,d$. A square with diagonal $6$ has area $\\frac{36}{2} = 18$ and perimeter $12\\sqrt{2}$.\n\n{{figure 0}}\n\n> **Watch out.** The area is half of $d^2$, not $d^2$: the square built on the diagonal is twice as large as the square itself. And the perimeter keeps its root: four sides of $\\frac{d}{\\sqrt{2}}$ are not $4d$.",
        "由对角线 $d$ 得边长 $s = \\frac{d}{\\sqrt{2}}$。平方后根号消失，所以面积是\n\n$$A = s^2 = \\frac{d^2}{2}.$$\n\n换一个角度也能得到：对角线 $AC$ 把正方形分成两个三角形，每个底为 $d$，高为另一条对角线的一半 $\\frac{d}{2}$，所以 $A = 2 \\cdot \\frac{1}{2} \\cdot d \\cdot \\frac{d}{2} = \\frac{d^2}{2}$。周长是 $4s = \\frac{4d}{\\sqrt{2}} = 2\\sqrt{2}\\,d$。对角线为 $6$ 的正方形，面积是 $\\frac{36}{2} = 18$，周长是 $12\\sqrt{2}$。\n\n{{figure 0}}\n\n> **注意。** 面积是 $d^2$ 的一半，不是 $d^2$：以对角线为边的正方形，面积是原正方形的两倍。周长要保留根号：四条长 $\\frac{d}{\\sqrt{2}}$ 的边加起来不是 $4d$。",
      ),
      figures: [
        figure(
          [
            {
              kind: "polygon",
              points: [
                [0, 0],
                [3, 0],
                [3, 3],
                [0, 3],
              ],
            },
            {
              kind: "polygon",
              points: [
                [0, 0],
                [3, 0],
                [3, 3],
              ],
              tone: "result",
            },
            { kind: "segment", a: [0, 0], b: [3, 3], accent: true },
            { kind: "segment", a: [3, 0], b: [1.5, 1.5], dashed: true },
            { kind: "right", vertex: [1.5, 1.5], from: [3, 3], to: [3, 0] },
            { kind: "side", a: [3, 3], b: [0, 0], text: "6" },
            { kind: "side", a: [1.5, 1.5], b: [3, 0], text: "3" },
          ],
          "A square with diagonal 6 cut into two triangles with base 6; the height of each, half the other diagonal, is 3.",
          "对角线为 6 的正方形被分成两个底为 6 的三角形；每个的高是另一条对角线的一半，为 3。",
        ),
      ],
      generate(rng) {
        const d = rng.int(3, 30);
        const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
        const pts = squarePoints(rng);
        const fig = figure(
          [
            ...quadMarks(pts, `${A}${B}${C}${D}`, "ac"),
            { kind: "side", a: pts[0], b: center([pts[0], pts[2]]), text: `${d}` },
            { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] },
          ],
          `Square ${A}${B}${C}${D} with diagonal ${A}${C} = ${d}.`,
          `正方形 ${A}${B}${C}${D}，对角线 ${A}${C} = ${d}。`,
        );
        const side = divS(int(d), [Q.one, 2]);
        const sideTex = texS(side);
        const sideStep = step(
          1,
          "find the side",
          "求边长",
          t(
            `The diagonal is the hypotenuse of an isosceles right triangle whose legs are sides, so the side is the diagonal divided by $\\sqrt{2}$:${steps(`s = \\frac{${d}}{\\sqrt{2}} = ${sideTex}`)}`,
            `对角线是以两条边为直角边的等腰直角三角形的斜边，所以边长等于对角线除以 $\\sqrt{2}$：${steps(`s = \\frac{${d}}{\\sqrt{2}} = ${sideTex}`)}`,
          ),
        );
        const sq = side[0].mul(side[0]).mul(q(side[1]));
        if (rng.bool()) {
          const area = q(d * d, 2);
          const sTex = side[1] === 1 ? sideTex : `(${sideTex})`;
          return {
            ...numberProblem({
              prompt: t(
                `The square $${A}${B}${C}${D}$ has diagonal $${A}${C} = ${d}$. Find its area.`,
                `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C} = ${d}$。求它的面积。`,
              ),
              answer: area,
              wrong: [d * d, q(d * d, 4), 2 * d * d],
              solution: paras(
                sideStep,
                step(
                  2,
                  "square the side",
                  "边长平方",
                  t(
                    `The area is the side squared:${steps(`A = ${sTex}^2 = ${sq.toLatex()}`)}`,
                    `面积等于边长的平方：${steps(`A = ${sTex}^2 = ${sq.toLatex()}`)}`,
                  ),
                ),
                check(
                  `The diagonal cuts the square into two triangles with base $${d}$ and height half the other diagonal, $${q(d, 2).toLatex()}$: $2 \\cdot \\frac{1}{2} \\cdot ${d} \\cdot ${q(d, 2).toLatex()} = ${area.toLatex()}$, the same area. It is half of $${d}^2 = ${d * d}$, the square built on the diagonal.`,
                  `对角线把正方形分成两个三角形，底为 $${d}$，高为另一条对角线的一半 $${q(d, 2).toLatex()}$：$2 \\cdot \\frac{1}{2} \\cdot ${d} \\cdot ${q(d, 2).toLatex()} = ${area.toLatex()}$，面积相同。它是以对角线为边的正方形面积 $${d}^2 = ${d * d}$ 的一半。`,
                ),
              ),
            }),
            figure: fig,
          };
        }
        const per = mulS(side, int(4));
        const perNum = per[0].toNumber() * Math.sqrt(per[1]);
        return {
          ...radicalProblem({
            prompt: t(
              `The square $${A}${B}${C}${D}$ has diagonal $${A}${C} = ${d}$. Find its perimeter in simplest radical form.`,
              `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C} = ${d}$。求它的周长，答案写成最简根式。`,
            ),
            answer: per,
            wrong: [`${4 * d}`, `${2 * d}`, texS(mulS(int(4 * d), [Q.one, 2])), texS(side)],
            solution: paras(
              sideStep,
              step(
                2,
                "add the four sides",
                "四条边相加",
                t(
                  `The perimeter is four sides:${steps(`P = 4 \\cdot ${sideTex} = ${texS(per)}`)}`,
                  `周长是四条边之和：${steps(`P = 4 \\cdot ${sideTex} = ${texS(per)}`)}`,
                ),
              ),
              check(
                `Estimate: a side is a little more than $0.7$ of the diagonal ($\\frac{1}{\\sqrt{2}} \\approx 0.707$), so the perimeter is about $4 \\cdot 0.707 \\cdot ${d} \\approx ${dec(roundQ(2.828 * d, 1))}$, and $${texS(per)} \\approx ${dec(roundQ(perNum, 1))}$ agrees. It is less than $4 \\cdot ${d} = ${4 * d}$, since each side is shorter than the diagonal.`,
                `估算：边长比对角线的 $0.7$ 倍略多（$\\frac{1}{\\sqrt{2}} \\approx 0.707$），所以周长约为 $4 \\cdot 0.707 \\cdot ${d} \\approx ${dec(roundQ(2.828 * d, 1))}$，而 $${texS(per)} \\approx ${dec(roundQ(perNum, 1))}$，相符。它小于 $4 \\cdot ${d} = ${4 * d}$，因为每条边都比对角线短。`,
              ),
            ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

/** pickGramAngle picks the angle at A of a parallelogram that does not look like a rectangle. */
const pickGramAngle = (rng: Rng) => rng.pick([rng.int(35, 78), rng.int(102, 145)]);

/** ticks2 marks two segments equal with count ticks. */
const ticks2 = (a: Point, b: Point, c: Point, d: Point, count: number): Mark[] => [
  { kind: "ticks", a, b, count },
  { kind: "ticks", a: c, b: d, count },
];

/** arrows2 marks two segments parallel with count chevrons, from a to b and from c to d. */
const arrows2 = (a: Point, b: Point, c: Point, d: Point, count: number): Mark[] => [
  { kind: "arrows", a, b, count },
  { kind: "arrows", a: c, b: d, count },
];

/** arcs2 marks the angle at v between the rays to a and b, and the angle at w between the rays to c and d. */
const arcs2 = (v: Point, a: Point, b: Point, w: Point, c: Point, d: Point): Mark[] => [
  { kind: "arc", vertex: v, from: a, to: b, accent: true },
  { kind: "arc", vertex: w, from: c, to: d, accent: true },
];

/** valueAt writes px + d evaluated at x, as p · x + d, leaving out a coefficient 1 and a constant 0. */
const valueAt = (p: number, d: number, x: number) =>
  `${p === 1 ? "" : `${p} \\cdot `}${x < 0 ? `(${x})` : x}${d === 0 ? "" : ` ${d < 0 ? "-" : "+"} ${Math.abs(d)}`}`;

/** gramIntro draws parallelogram PQRS with a 65° angle at P and its parallel sides marked. */
const gramIntro: Figure = (() => {
  const d = dir(65, 3.6);
  const pts: Quad = [[0, 0], [6, 0], [6 + d[0], d[1]], d];
  return figure(
    [
      ...quadMarks(pts, "PQRS", "none"),
      ...arrows2(pts[0], pts[1], pts[3], pts[2], 1),
      ...arrows2(pts[0], pts[3], pts[1], pts[2], 2),
      quadAngle(pts, 0, "65°"),
      quadAngle(pts, 3, "115°", true),
    ],
    "Parallelogram PQRS with PQ parallel to SR and PS parallel to QR; the angle at P is 65° and the angle at S is 115°.",
    "平行四边形 PQRS，PQ ∥ SR，PS ∥ QR；P 处的角为 65°，S 处的角为 115°。",
  );
})();

/** gramPair works out how the corners k and j of a parallelogram are related: opposite, or consecutive with the pair of parallel sides that the side joining them cuts. */
function gramPair(pts: Quad, k: number, j: number): { opposite: boolean; parallel: Mark[] } {
  if ((j - k + 4) % 4 === 2) {
    return {
      opposite: true,
      parallel: [...arrows2(pts[0], pts[1], pts[3], pts[2], 1), ...arrows2(pts[0], pts[3], pts[1], pts[2], 2)],
    };
  }
  const away = (i: number, o: number) => (o === (i + 1) % 4 ? (i + 3) % 4 : (i + 1) % 4);
  return {
    opposite: false,
    parallel: arrows2(pts[k]!, pts[away(k, j)]!, pts[j]!, pts[away(j, k)]!, 1).flatMap(highlighted),
  };
}

/** gramRelation explains why the angles at P and R of a parallelogram are equal (opposite) or supplementary (consecutive). */
const gramRelation = (opposite: boolean, P: string, R: string) =>
  opposite
    ? t(
        `$\\angle ${P}$ and $\\angle ${R}$ are opposite angles. Each of them is supplementary to the angle between them, so they are equal:`,
        `$\\angle ${P}$ 与 $\\angle ${R}$ 是对角。它们都与夹在中间的角互补，所以相等：`,
      )
    : t(
        `$\\angle ${P}$ and $\\angle ${R}$ are consecutive: the side $${P}${R}$ crosses two parallel sides, so they are interior angles on the same side of a transversal and add up to $180^\\circ$:`,
        `$\\angle ${P}$ 与 $\\angle ${R}$ 是邻角：边 $${P}${R}$ 与两条平行的边相交，它们是截线同旁的内角，和为 $180^\\circ$：`,
      );

/** gramSum writes the check that the four angles a, 180 − a, a, 180 − a of a parallelogram add up to 360°. */
const gramSum = (a: number) =>
  check(
    `Going round, the angles are $${a}^\\circ$, $${180 - a}^\\circ$, $${a}^\\circ$, $${180 - a}^\\circ$, and $2(${a}^\\circ + ${180 - a}^\\circ) = 360^\\circ$, the angle sum of a quadrilateral.`,
    `绕一圈，四个角依次是 $${a}^\\circ$、$${180 - a}^\\circ$、$${a}^\\circ$、$${180 - a}^\\circ$，且 $2(${a}^\\circ + ${180 - a}^\\circ) = 360^\\circ$，正是四边形的内角和。`,
  );

export const propertiesOfParallelograms: TopicDef = {
  id: "properties-of-parallelograms",
  title: t("Properties of Parallelograms", "平行四边形的性质"),
  summary: t(
    "Use the angles, sides and diagonals of a parallelogram to find measures and to solve for unknowns.",
    "利用平行四边形的角、边和对角线的性质求度量和未知数。",
  ),
  prerequisites: ["angles-of-polygons"],
  encompasses: [{ topic: "equations-with-variables-on-both-sides", weight: 0.2 }],
  xp: 15,
  standards: ["CCSS.HSG.CO.C.11"],
  intro: t(
    `A quadrilateral's four angles add up to $360^\\circ$, and when a transversal crosses two parallel lines, the two interior angles on the same side of it add up to $180^\\circ$. A **parallelogram** is a quadrilateral whose opposite sides are parallel, so every side is a transversal of the other two, and the angles follow without measuring.

Take parallelogram $PQRS$ with $\\angle P = 65^\\circ$:

{{figure 0}}

The side $PS$ crosses the parallel sides $PQ$ and $SR$, so $\\angle S = 180^\\circ - 65^\\circ = 115^\\circ$. In the same way $\\angle Q = 115^\\circ$, and then $\\angle R = 180^\\circ - 115^\\circ = 65^\\circ$. The four angles $65^\\circ + 115^\\circ + 65^\\circ + 115^\\circ = 360^\\circ$, as they must.

One angle settles all four. The sides and the diagonals have rules of the same kind: opposite sides are equal, and the diagonals cut each other in half. In this lesson we use these properties to find angles and lengths and to solve equations for unknowns written with $x$.`,
    `四边形的四个内角之和是 $360^\\circ$；一条截线与两条平行线相交时，截线同旁的两个内角之和是 $180^\\circ$。**平行四边形**是两组对边分别平行的四边形，所以每条边都是另外两条边的截线，角不用量就能求出。

设平行四边形 $PQRS$ 中 $\\angle P = 65^\\circ$：

{{figure 0}}

边 $PS$ 与平行的两边 $PQ$、$SR$ 相交，所以 $\\angle S = 180^\\circ - 65^\\circ = 115^\\circ$。同理 $\\angle Q = 115^\\circ$，进而 $\\angle R = 180^\\circ - 115^\\circ = 65^\\circ$。四个角 $65^\\circ + 115^\\circ + 65^\\circ + 115^\\circ = 360^\\circ$，理应如此。

一个角就决定了全部四个角。边和对角线也有类似的规律：对边相等，对角线互相平分。这节课用这些性质求角和长度，并解出用 $x$ 表示的未知数。`,
  ),
  introFigures: [gramIntro],
  knowledgePoints: [
    {
      id: "angles-of-a-parallelogram",
      figure: specialDrawings["angles-of-a-parallelogram"],
      title: t("Angles of a parallelogram", "平行四边形的角"),
      explanation: t(
        "In a **parallelogram** $ABCD$ the sides $AB$ and $DC$ are parallel, and $AD$ crosses both. So $\\angle A$ and $\\angle D$ are interior angles on the same side of a transversal: they are **supplementary**. The same holds for any two **consecutive angles** (angles next to each other).\n\nTwo **opposite angles**, such as $\\angle A$ and $\\angle C$, are each supplementary to $\\angle B$, so they are **congruent**.\n\nIn parallelogram $ABCD$ with $\\angle A = 70^\\circ$: $\\angle B = \\angle D = 180^\\circ - 70^\\circ = 110^\\circ$ and $\\angle C = 70^\\circ$. The four angles add up to $70^\\circ + 110^\\circ + 70^\\circ + 110^\\circ = 360^\\circ$, as in every quadrilateral.\n\n> **Watch out.** Decide first whether the two angles are opposite or next to each other: opposite angles are equal, neighbours add to $180^\\circ$. Mixing the two up gives $180^\\circ - x$ instead of $x$. And $360^\\circ$ is the sum of all four angles, not of two.",
        "在**平行四边形** $ABCD$ 中，$AB$ 与 $DC$ 平行，而 $AD$ 与两者都相交。所以 $\\angle A$ 与 $\\angle D$ 是截线同旁的内角，**互补**。任意两个**相邻的角**都是如此。\n\n两个**对角**，例如 $\\angle A$ 与 $\\angle C$，都与 $\\angle B$ 互补，所以**相等**。\n\n在平行四边形 $ABCD$ 中，若 $\\angle A = 70^\\circ$，则 $\\angle B = \\angle D = 180^\\circ - 70^\\circ = 110^\\circ$，$\\angle C = 70^\\circ$。四个角之和 $70^\\circ + 110^\\circ + 70^\\circ + 110^\\circ = 360^\\circ$，与所有四边形一样。\n\n> **注意。** 先判断两个角是对角还是邻角：对角相等，邻角之和为 $180^\\circ$。两者弄混，就会得到 $180^\\circ - x$ 而不是 $x$。另外，$360^\\circ$ 是四个角的和，不是两个角的和。",
      ),
      generate(rng) {
        const a = pickGramAngle(rng);
        const angles = [a, 180 - a, a, 180 - a];
        const k = rng.int(0, 3);
        const j = (k + rng.int(1, 3)) % 4;
        const answer = angles[j]!;
        const letters = pickLetters(rng, 4).join("");
        const pts = gramPoints(rng, a);
        const { opposite, parallel } = gramPair(pts, k, j);
        const [P, R] = [letters[k]!, letters[j]!];
        const work = opposite ? steps(`x = ${answer}^\\circ`) : steps(`x = 180^\\circ - ${angles[k]}^\\circ = ${answer}^\\circ`);
        const base = [...quadMarks(pts, letters, "none"), quadAngle(pts, k, `${angles[k]}°`)];
        return {
          ...numberProblem({
            prompt: t(`$${letters}$ is a parallelogram. Find $x$.`, `$${letters}$ 是平行四边形。求 $x$。`),
            answer,
            form: "integer",
            unit: "°",
            wrong: [180 - answer, 360 - angles[k]!, 360 - 2 * angles[k]!],
            solution: paras(
              step(1, "relate the two angles", "找出两角的关系", cat(gramRelation(opposite, P, R), same("\n\n{{figure 0}}"))),
              step(2, "find the angle", "求角", t(`So${work}`, `所以${work}`)),
              gramSum(a),
            ),
          }),
          figure: figure(
            [...base, quadAngle(pts, j, "x°", true)],
            `Parallelogram ${letters}: the angle at ${P} is ${angles[k]}° and the angle at ${R} is x°.`,
            `平行四边形 ${letters}：${P} 处的角为 ${angles[k]}°，${R} 处的角为 x°。`,
          ),
          solutionFigures: [
            figure(
              [...base, ...parallel, { ...quadAngle(pts, j, `${answer}°`), tone: "result" }],
              `Parallelogram ${letters} with its parallel sides marked: the angle at ${R} is ${opposite ? "opposite" : "next to"} the ${angles[k]}° angle at ${P}, so it is ${answer}°.`,
              `平行四边形 ${letters}，标出平行的边：${R} 处的角与 ${P} 处的 ${angles[k]}° 角${opposite ? "相对" : "相邻"}，所以是 ${answer}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "angle-equations-in-parallelograms",
      figure: specialDrawings["angle-equations-in-parallelograms"],
      title: t("Equations with angles", "关于角的方程"),
      explanation: t(
        "When angles are written with $x$, the two properties become equations. First decide how the angles sit: **opposite** angles are equal, so set the expressions equal; **consecutive** angles are supplementary, so set their sum equal to $180$.\n\nIn parallelogram $ABCD$ with $\\angle A = (2x + 10)^\\circ$ and $\\angle B = (3x - 5)^\\circ$, the angles share the side $AB$, so they are consecutive:\n\n$$(2x + 10) + (3x - 5) = 180, \\qquad 5x + 5 = 180, \\qquad x = 35.$$\n\nThen $\\angle A = 80^\\circ$ and $\\angle B = 100^\\circ$, which do add up to $180^\\circ$.\n\n> **Watch out.** Setting consecutive angles equal, or opposite angles adding to $180^\\circ$, still gives a number for $x$, just the wrong one. Substitute back: the two angles must come out equal or supplementary, as the figure says.",
        "当角用 $x$ 表示时，两条性质就成了方程。先判断两个角的位置：**对角**相等，就令两式相等；**邻角**互补，就令两式之和等于 $180$。\n\n在平行四边形 $ABCD$ 中，$\\angle A = (2x + 10)^\\circ$，$\\angle B = (3x - 5)^\\circ$，两角共用边 $AB$，是邻角：\n\n$$(2x + 10) + (3x - 5) = 180, \\qquad 5x + 5 = 180, \\qquad x = 35.$$\n\n于是 $\\angle A = 80^\\circ$，$\\angle B = 100^\\circ$，和确实是 $180^\\circ$。\n\n> **注意。** 把邻角设为相等，或把对角之和设为 $180^\\circ$，同样能解出一个 $x$，只是错的。把 $x$ 代回去：两个角必须像图中那样相等或互补。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        for (;;) {
          const a = pickGramAngle(rng);
          const angles = [a, 180 - a, a, 180 - a];
          const x = rng.int(4, 25);
          const k = rng.int(0, 3);
          const j = (k + rng.int(1, 3)) % 4;
          const opposite = (j - k + 4) % 4 === 2;
          const [p1, p2] = [rng.int(1, 5), rng.int(1, 5)];
          const d1 = angles[k]! - p1 * x;
          const d2 = angles[j]! - p2 * x;
          if ((opposite && p1 === p2) || Math.abs(d1) > 60 || Math.abs(d2) > 60 || d1 === 0 || d2 === 0) continue;
          const letters = pickLetters(rng, 4).join("");
          const pts = gramPoints(rng, a);
          const [P, R] = [letters[k]!, letters[j]!];
          const { parallel } = gramPair(pts, k, j);
          const work = opposite
            ? chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`)
            : chain(
                `(${linear(p1, d1)}) + (${linear(p2, d2)}) = 180`,
                `${linear(p1 + p2, d1 + d2)} = 180`,
                `${linear(p1 + p2, 0)} = ${180 - d1 - d2}`,
                `x = ${x}`,
              );
          const [vk, vj] = [angles[k]!, angles[j]!];
          const base = [...quadMarks(pts, letters, "none")];
          return {
            ...numberProblem({
              prompt: t(
                `In parallelogram $${letters}$, $\\angle ${P} = ${angleTex(p1, d1)}$ and $\\angle ${R} = ${angleTex(p2, d2)}$. Find $x$.`,
                `在平行四边形 $${letters}$ 中，$\\angle ${P} = ${angleTex(p1, d1)}$，$\\angle ${R} = ${angleTex(p2, d2)}$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: opposite
                ? [intOr(180 - d1 - d2, p1 + p2, x + 1), intOr(d1 - d2, p1 - p2, -x)]
                : [intOr(d2 - d1, p1 - p2, x + 1), intOr(90 - d1 - d2, p1 + p2, x - 1)],
              solution: paras(
                step(1, "set up the equation", "列方程", cat(gramRelation(opposite, P, R), same(`\n\n{{figure 0}}`))),
                step(2, "solve for x", "解出 x", t(`Collect the terms in $x$:${work}`, `合并含 $x$ 的项：${work}`)),
                check(
                  `With $x = ${x}$, $\\angle ${P} = ${valueAt(p1, d1, x)} = ${vk}^\\circ$ and $\\angle ${R} = ${valueAt(p2, d2, x)} = ${vj}^\\circ$${opposite ? ": the opposite angles are equal." : `, and $${vk}^\\circ + ${vj}^\\circ = 180^\\circ$.`}`,
                  `当 $x = ${x}$ 时，$\\angle ${P} = ${valueAt(p1, d1, x)} = ${vk}^\\circ$，$\\angle ${R} = ${valueAt(p2, d2, x)} = ${vj}^\\circ$${opposite ? "，两个对角相等。" : `，且 $${vk}^\\circ + ${vj}^\\circ = 180^\\circ$。`}`,
                ),
              ),
            }),
            figure: figure(
              [...base, quadAngle(pts, k), quadAngle(pts, j, undefined, true)],
              `Parallelogram ${letters} with the angles at ${P} and ${R} marked.`,
              `平行四边形 ${letters}，标出了 ${P} 和 ${R} 处的角。`,
            ),
            solutionFigures: [
              figure(
                [
                  ...base,
                  ...parallel,
                  { ...quadAngle(pts, k, `${plain(p1, d1)}°`), tone: "result" },
                  { ...quadAngle(pts, j, `${plain(p2, d2)}°`), tone: "result" },
                ],
                `Parallelogram ${letters} with its parallel sides marked: the angles at ${P} and ${R} are ${opposite ? "opposite, so equal" : "consecutive, so supplementary"}.`,
                `平行四边形 ${letters}，标出平行的边：${P} 和 ${R} 处的角是${opposite ? "对角，所以相等" : "邻角，所以互补"}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "opposite-sides-of-a-parallelogram",
      figure: specialDrawings["opposite-sides-of-a-parallelogram"],
      title: t("Opposite sides", "对边"),
      explanation: t(
        "The diagonal $AC$ cuts parallelogram $ABCD$ into two triangles. The parallel sides make alternate interior angles equal on both sides of $AC$, so the triangles $ABC$ and $CDA$ are congruent by ASA. Corresponding sides are equal: the opposite sides of a parallelogram are **congruent**, $AB = CD$ and $BC = DA$.\n\nIf $AB = 3x - 4$ and $CD = x + 10$, then\n\n$$3x - 4 = x + 10, \\qquad 2x = 14, \\qquad x = 7,$$\n\nand both sides are $3 \\cdot 7 - 4 = 7 + 10 = 17$.\n\n> **Watch out.** Only opposite sides are equal. Two sides that meet at a corner usually differ, so an equation between neighbouring sides, or with the other given length, is wrong. Find the side across from the one you know.",
        "对角线 $AC$ 把平行四边形 $ABCD$ 分成两个三角形。平行的边使 $AC$ 两侧的内错角相等，所以由 ASA，三角形 $ABC$ 与 $CDA$ 全等。对应边相等：平行四边形的对边**相等**，$AB = CD$，$BC = DA$。\n\n若 $AB = 3x - 4$，$CD = x + 10$，则\n\n$$3x - 4 = x + 10, \\qquad 2x = 14, \\qquad x = 7,$$\n\n两条边都等于 $3 \\cdot 7 - 4 = 7 + 10 = 17$。\n\n> **注意。** 只有对边相等。在同一个顶点相交的两条邻边一般不相等，所以把邻边或另一条已知边列成等式是错的。要找与已知边相对的那条边。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 12);
          const v = rng.int(6, 40);
          const [p1, p2] = [rng.int(1, 6), rng.int(1, 6)];
          const d1 = v - p1 * x;
          const d2 = v - p2 * x;
          const w = rng.int(4, 40);
          if (p1 === p2 || Math.abs(d1) > 30 || Math.abs(d2) > 30 || w === v) continue;
          const letters = pickLetters(rng, 4).join("");
          const [A, B, C, D] = letters.split("") as [string, string, string, string];
          const pair = rng.bool();
          const [s1, s2] = pair ? [`${A}${B}`, `${C}${D}`] : [`${B}${C}`, `${D}${A}`];
          const other = pair ? `${B}${C}` : `${A}${B}`;
          const pts = gramPoints(rng, pickGramAngle(rng));
          const askX = rng.bool();
          const labels = pair ? [plain(p1, d1), `${w}`, plain(p2, d2), null] : [`${w}`, plain(p1, d1), null, plain(p2, d2)];
          const work = chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`);
          const base = [...quadMarks(pts, letters, "none"), ...outside(pts, labels)];
          const fig = figure(
            base,
            `Parallelogram ${letters} with ${s1} = ${plain(p1, d1)}, ${s2} = ${plain(p2, d2)} and ${other} = ${w}.`,
            `平行四边形 ${letters}，${s1} = ${plain(p1, d1)}，${s2} = ${plain(p2, d2)}，${other} = ${w}。`,
          );
          const ticks = (pair ? ticks2(pts[0], pts[1], pts[2], pts[3], 1) : ticks2(pts[1], pts[2], pts[3], pts[0], 1)).flatMap(highlighted);
          const first = step(
            1,
            "set the opposite sides equal",
            "令对边相等",
            t(
              `$${s1}$ and $${s2}$ are opposite sides, and opposite sides of a parallelogram are congruent. The side $${other} = ${w}$ is next to them, so it plays no part:\n\n{{figure 0}}`,
              `$${s1}$ 与 $${s2}$ 是对边，平行四边形的对边相等。边 $${other} = ${w}$ 与它们相邻，用不上：\n\n{{figure 0}}`,
            ),
          );
          const solve = step(2, "solve for x", "解出 x", t(`Collect the terms in $x$:${work}`, `合并含 $x$ 的项：${work}`));
          const both = `$${s1} = ${valueAt(p1, d1, x)} = ${v}$`;
          const both2 = `$${s2} = ${valueAt(p2, d2, x)} = ${v}$`;
          return {
            ...numberProblem({
              prompt: askX
                ? t(`$${letters}$ is a parallelogram. Find $x$.`, `$${letters}$ 是平行四边形。求 $x$。`)
                : t(`$${letters}$ is a parallelogram. Find $${s1}$.`, `$${letters}$ 是平行四边形。求 $${s1}$。`),
              answer: askX ? x : v,
              form: "integer",
              ...(askX && { solveFor: "x" }),
              wrong: askX ? [-x, intOr(d2 + d1, p1 - p2, x + 2), intOr(w - d1, p1, x + 3)] : [x, w, 2 * v, p1 * w + d1],
              solution: askX
                ? paras(
                    first,
                    solve,
                    check(
                      `With $x = ${x}$, ${both} and ${both2}: the opposite sides are equal.`,
                      `当 $x = ${x}$ 时，${both}，${both2}，两条对边相等。`,
                    ),
                  )
                : paras(
                    first,
                    solve,
                    step(3, `find ${s1}`, `求 ${s1}`, t(`Substitute $x = ${x}$: ${both}.`, `代入 $x = ${x}$：${both}。`)),
                    check(`The opposite side gives the same length: ${both2}.`, `对边算出的长度相同：${both2}。`),
                  ),
            }),
            figure: fig,
            solutionFigures: [
              figure(
                [...base, ...ticks],
                `Parallelogram ${letters}: the opposite sides ${s1} and ${s2} are marked equal.`,
                `平行四边形 ${letters}：对边 ${s1} 与 ${s2} 标为相等。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "diagonals-of-a-parallelogram",
      figure: specialDrawings["diagonals-of-a-parallelogram"],
      title: t("Diagonals of a parallelogram", "平行四边形的对角线"),
      explanation: t(
        "Let the diagonals of parallelogram $ABCD$ meet at $E$. The triangles $ABE$ and $CDE$ have $AB = CD$ (opposite sides) and equal alternate interior angles at both ends of these sides, so they are congruent by ASA. Hence $AE = CE$ and $BE = DE$: the diagonals **bisect each other**. Each diagonal is twice either of its halves; the two diagonals themselves are usually not equal.\n\nIf $AE = 2x + 1$ and $CE = 4x - 7$, these are the two halves of $AC$:\n\n$$2x + 1 = 4x - 7, \\qquad 8 = 2x, \\qquad x = 4,$$\n\nso $AE = CE = 9$ and $AC = 18$.\n\n> **Watch out.** A half is not the whole diagonal: once a half is known, double it for the diagonal. And only the two halves of the same diagonal are equal; $AE$ and $BE$ belong to different diagonals and need not match.",
        "设平行四边形 $ABCD$ 的对角线交于 $E$。三角形 $ABE$ 与 $CDE$ 中，$AB = CD$（对边），这两条边两端的内错角也相等，所以由 ASA 两三角形全等。因此 $AE = CE$，$BE = DE$：对角线**互相平分**。每条对角线是它任一半的两倍；两条对角线本身一般不相等。\n\n若 $AE = 2x + 1$，$CE = 4x - 7$，它们是 $AC$ 的两半：\n\n$$2x + 1 = 4x - 7, \\qquad 8 = 2x, \\qquad x = 4,$$\n\n所以 $AE = CE = 9$，$AC = 18$。\n\n> **注意。** 一半不是整条对角线：求出一半后，要乘以 $2$ 才是对角线。另外，只有同一条对角线的两半相等；$AE$ 与 $BE$ 属于不同的对角线，不一定相等。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 12);
          const half = rng.int(4, 25);
          const [p1, p2] = [rng.int(1, 6), rng.int(1, 6)];
          const d1 = half - p1 * x;
          const d2 = half - p2 * x;
          if (p1 === p2 || Math.abs(d1) > 30 || Math.abs(d2) > 30) continue;
          const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
          const letters = `${A}${B}${C}${D}`;
          const first = rng.bool();
          const [h1, h2, whole] = first ? [`${A}${E}`, `${C}${E}`, `${A}${C}`] : [`${B}${E}`, `${D}${E}`, `${B}${D}`];
          const askX = rng.bool();
          const pts = gramPoints(rng, pickGramAngle(rng));
          const pe = center([pts[0], pts[2]]);
          const work = chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`);
          const base = quadMarks(pts, letters, "both", E);
          const ends = first ? [pts[0], pts[2]] : [pts[1], pts[3]];
          const both = `$${h1} = ${valueAt(p1, d1, x)} = ${half}$`;
          const both2 = `$${h2} = ${valueAt(p2, d2, x)} = ${half}$`;
          const relate = step(
            1,
            "set the halves equal",
            "令两半相等",
            t(
              `$${h1}$ and $${h2}$ are the two halves of the diagonal $${whole}$, and the diagonals of a parallelogram bisect each other, so they are equal:\n\n{{figure 0}}`,
              `$${h1}$ 与 $${h2}$ 是对角线 $${whole}$ 的两半，而平行四边形的对角线互相平分，所以它们相等：\n\n{{figure 0}}`,
            ),
          );
          const solve = step(2, "solve for x", "解出 x", t(`Collect the terms in $x$:${work}`, `合并含 $x$ 的项：${work}`));
          return {
            ...numberProblem({
              prompt: t(
                `The diagonals of parallelogram $${letters}$ meet at $${E}$, with $${h1} = ${linear(p1, d1)}$ and $${h2} = ${linear(p2, d2)}$. Find ${askX ? "$x$" : `$${whole}$`}.`,
                `平行四边形 $${letters}$ 的对角线交于 $${E}$，$${h1} = ${linear(p1, d1)}$，$${h2} = ${linear(p2, d2)}$。求 ${askX ? "$x$" : `$${whole}$`}。`,
              ),
              answer: askX ? x : 2 * half,
              form: "integer",
              ...(askX && { solveFor: "x" }),
              wrong: askX ? [-x, intOr(d2 + d1, p1 - p2, x + 2), intOr(-d1 - d2, p1 + p2, x + 1)] : [half, x, 4 * half],
              solution: askX
                ? paras(
                    relate,
                    solve,
                    check(
                      `With $x = ${x}$, ${both} and ${both2}: the two halves are equal.`,
                      `当 $x = ${x}$ 时，${both}，${both2}，两半相等。`,
                    ),
                  )
                : paras(
                    relate,
                    solve,
                    step(
                      3,
                      "double a half",
                      "把一半乘以 2",
                      t(
                        `Substitute: ${both}. The diagonal is made of both halves:${steps(`${whole} = 2 \\cdot ${half} = ${2 * half}`)}`,
                        `代入：${both}。对角线由两半组成：${steps(`${whole} = 2 \\cdot ${half} = ${2 * half}`)}`,
                      ),
                    ),
                    check(
                      `The other half agrees: ${both2}, and $${half} + ${half} = ${2 * half}$.`,
                      `另一半也一致：${both2}，且 $${half} + ${half} = ${2 * half}$。`,
                    ),
                  ),
            }),
            figure: figure(
              base,
              `Parallelogram ${letters} with diagonals ${A}${C} and ${B}${D} meeting at ${E}.`,
              `平行四边形 ${letters}，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}。`,
            ),
            solutionFigures: [
              figure(
                [...base, ...ticks2(ends[0]!, pe, ends[1]!, pe, 1).flatMap(highlighted)],
                `Parallelogram ${letters}: the halves ${h1} and ${h2} of the diagonal ${whole} are marked equal.`,
                `平行四边形 ${letters}：对角线 ${whole} 的两半 ${h1} 与 ${h2} 标为相等。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** proofGram places a parallelogram for a proof. */
const proofGram = (rng: Rng) => gramPoints(rng, rng.int(55, 72));

/** gramAlt describes the figure of a quadrilateral proof. */
const gramAlt = (L: string, extra: readonly [string, string]): [string, string] => [
  `Quadrilateral ${L}${extra[0]}.`,
  `四边形 ${L}${extra[1]}。`,
];

/** oppositeSidesProof proves that opposite sides (variant 0) or opposite angles (variant 1) of a parallelogram are congruent. */
function oppositeSidesProof(rng: Rng, variant: 0 | 1): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const [pa, pb, pc, pd] = proofGram(rng);
  return {
    given: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    prove: variant === 0 ? both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`) : mt(`\\angle ${B} = \\angle ${D}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: both(`${A}${B} \\parallel ${D}${C}`, `${B}${C} \\parallel ${A}${D}`),
        r: "parallelogram",
        alts: [both(`${A}${B} = ${D}${C}`, `${B}${C} = ${A}${D}`), mt(`${A}${C} \\parallel ${B}${D}`), mt(`${A}${B} \\perp ${B}${C}`)],
        marks: [...arrows2(pa, pb, pd, pc, 1), ...arrows2(pb, pc, pa, pd, 2)],
      },
      {
        s: mt(`\\angle ${B}${A}${C} = \\angle ${D}${C}${A}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${A}${C}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${A}${C}$ 所截。`,
        ),
        alts: [
          mt(`\\angle ${B}${A}${C} = \\angle ${B}${C}${A}`),
          mt(`\\angle ${B}${A}${C} = \\angle ${D}${A}${C}`),
          mt(`\\angle ${B}${A}${C} = \\angle ${A}${D}${C}`),
        ],
        marks: arcs2(pa, pb, pc, pc, pd, pa),
      },
      {
        s: mt(`\\angle ${B}${C}${A} = \\angle ${D}${A}${C}`),
        r: "alternate",
        why: t(
          `$${B}${C} \\parallel ${A}${D}$, cut by the transversal $${A}${C}$.`,
          `$${B}${C} \\parallel ${A}${D}$，被截线 $${A}${C}$ 所截。`,
        ),
        marks: arcs2(pc, pb, pa, pa, pd, pc),
      },
      { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive", marks: [{ kind: "ticks", a: pa, b: pc, count: 3 }] },
      {
        s: mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${C}${D}${A}`),
        r: "asa",
        why: t(`The side $${A}${C}$ lies between the two pairs of equal angles.`, `边 $${A}${C}$ 夹在两组相等的角之间。`),
        alts: [
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${D}`),
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${A}${C}`),
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${C}${A}${D}`),
        ],
      },
      variant === 0
        ? {
            s: both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`),
            r: "cpctc",
            alts: [
              both(`${A}${B} = ${B}${C}`, `${C}${D} = ${D}${A}`),
              mt(`${A}${C} = ${B}${D}`),
              both(`${A}${B} = ${D}${A}`, `${B}${C} = ${C}${D}`),
            ],
            marks: [...ticks2(pa, pb, pc, pd, 1), ...ticks2(pb, pc, pd, pa, 2)],
          }
        : {
            s: mt(`\\angle ${B} = \\angle ${D}`),
            r: "cpctc",
            alts: [mt(`\\angle ${B} = \\angle ${C}`), mt(`\\angle ${A} = \\angle ${B}`), mt(`\\angle ${B} + \\angle ${D} = 90^\\circ`)],
            marks: arcs2(pb, pc, pa, pd, pa, pc),
          },
    ],
    base: quadMarks([pa, pb, pc, pd], L, "ac"),
    alt: gramAlt(L, [` with the diagonal ${A}${C}`, `，连接对角线 ${A}${C}`]),
    check: t(
      `Step 6 uses ASA, which needs two pairs of equal angles and the equal sides between them: the angles of steps 3 and 4, and the shared side $${A}${C}$ of step 5, which runs from one angle of each pair to the other. In $\\triangle ${A}${B}${C} \\cong \\triangle ${C}${D}${A}$, $${A}$ matches $${C}$, $${B}$ matches $${D}$ and $${C}$ matches $${A}$, so ${variant === 0 ? `$${A}${B}$ matches $${C}${D}$ and $${B}${C}$ matches $${D}${A}$` : `$\\angle ${B}$ matches $\\angle ${D}$`}: the last step pairs parts in the same places.`,
      `第 6 步用 ASA，它需要两组相等的角及其夹边：第 3、4 步的两组角，以及第 5 步的公共边 $${A}${C}$，它正好连接每组中的两个角的顶点。在 $\\triangle ${A}${B}${C} \\cong \\triangle ${C}${D}${A}$ 中，$${A}$ 对应 $${C}$，$${B}$ 对应 $${D}$，$${C}$ 对应 $${A}$，所以${variant === 0 ? `$${A}${B}$ 对应 $${C}${D}$，$${B}${C}$ 对应 $${D}${A}$` : `$\\angle ${B}$ 对应 $\\angle ${D}$`}：最后一步配对的是位置相同的部分。`,
    ),
  };
}

/** diagonalsProof proves that the diagonals of a parallelogram bisect each other. */
function diagonalsProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  const [pa, pb, pc, pd] = pts;
  const pe = center([pa, pc]);
  return {
    given: t(`$${L}$ is a parallelogram whose diagonals meet at $${E}$`, `$${L}$ 是平行四边形，对角线交于 $${E}$`),
    prove: both(`${A}${E} = ${C}${E}`, `${B}${E} = ${D}${E}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: mt(`${A}${B} \\parallel ${D}${C}`),
        r: "parallelogram",
        alts: [mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
        marks: arrows2(pa, pb, pd, pc, 1),
      },
      {
        s: mt(`${A}${B} = ${D}${C}`),
        r: "oppositeSides",
        alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${C} = ${B}${D}`), mt(`${A}${E} = ${B}${E}`)],
        marks: ticks2(pa, pb, pd, pc, 1),
      },
      {
        s: mt(`\\angle ${B}${A}${E} = \\angle ${D}${C}${E}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${A}${C}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${A}${C}$ 所截。`,
        ),
        alts: [
          mt(`\\angle ${B}${A}${E} = \\angle ${A}${B}${E}`),
          mt(`\\angle ${B}${A}${E} = \\angle ${C}${D}${E}`),
          mt(`\\angle ${A}${E}${B} = \\angle ${B}${E}${C}`),
        ],
        marks: arcs2(pa, pb, pe, pc, pd, pe),
      },
      {
        s: mt(`\\angle ${A}${B}${E} = \\angle ${C}${D}${E}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${B}${D}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${B}${D}$ 所截。`,
        ),
        marks: arcs2(pb, pa, pe, pd, pc, pe),
      },
      {
        s: mt(`\\triangle ${A}${B}${E} \\cong \\triangle ${C}${D}${E}`),
        r: "asa",
        why: t(
          `The side $${A}${B}$ lies between the two angles at $${A}$ and $${B}$.`,
          `边 $${A}${B}$ 夹在 $${A}$、$${B}$ 处的两个角之间。`,
        ),
        alts: [
          mt(`\\triangle ${A}${B}${E} \\cong \\triangle ${C}${E}${D}`),
          mt(`\\triangle ${A}${B}${E} \\cong \\triangle ${D}${C}${E}`),
          mt(`\\triangle ${A}${B}${E} \\cong \\triangle ${E}${C}${D}`),
        ],
      },
      {
        s: both(`${A}${E} = ${C}${E}`, `${B}${E} = ${D}${E}`),
        r: "cpctc",
        alts: [
          both(`${A}${E} = ${B}${E}`, `${C}${E} = ${D}${E}`),
          mt(`${A}${C} = ${B}${D}`),
          both(`${A}${E} = ${D}${E}`, `${B}${E} = ${C}${E}`),
        ],
        marks: [...ticks2(pa, pe, pe, pc, 2), ...ticks2(pb, pe, pe, pd, 3)],
      },
    ],
    base: quadMarks(pts, L, "both", E),
    alt: gramAlt(L, [` with diagonals ${A}${C} and ${B}${D} meeting at ${E}`, `，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}`]),
    check: t(
      `Step 6 uses ASA: the equal angles of steps 4 and 5 sit at the two ends of the equal sides $${A}${B}$ and $${C}${D}$ of step 3. In $\\triangle ${A}${B}${E} \\cong \\triangle ${C}${D}${E}$, $${A}$ matches $${C}$ and $${B}$ matches $${D}$, so $${A}${E}$ matches $${C}${E}$ and $${B}${E}$ matches $${D}${E}$: $${E}$ is the midpoint of both diagonals, which is what was to be proved.`,
      `第 6 步用 ASA：第 4、5 步的相等的角，正好在第 3 步相等的边 $${A}${B}$、$${C}${D}$ 的两端。在 $\\triangle ${A}${B}${E} \\cong \\triangle ${C}${D}${E}$ 中，$${A}$ 对应 $${C}$，$${B}$ 对应 $${D}$，所以 $${A}${E}$ 对应 $${C}${E}$，$${B}${E}$ 对应 $${D}${E}$：$${E}$ 是两条对角线的中点，这正是要证的。`,
    ),
  };
}

/** consecutiveProof proves that opposite angles of a parallelogram are congruent, through consecutive angles. */
function consecutiveProof(rng: Rng): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  const [pa, pb, pc, pd] = pts;
  const n = rng.pick([62, 65, 68, 70, 72, 75]);
  return {
    given: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    prove: mt(`\\angle ${A} = \\angle ${C}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: both(`${A}${B} \\parallel ${D}${C}`, `${A}${D} \\parallel ${B}${C}`),
        r: "parallelogram",
        alts: [both(`${A}${B} \\parallel ${A}${D}`, `${B}${C} \\parallel ${D}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
        marks: [...arrows2(pa, pb, pd, pc, 1), ...arrows2(pa, pd, pb, pc, 2)],
      },
      {
        s: mt(`\\angle ${A} + \\angle ${D} = 180^\\circ`),
        r: "consecutive",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${A}${D}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${A}${D}$ 所截。`,
        ),
        alts: [
          mt(`\\angle ${A} = \\angle ${D}`),
          mt(`\\angle ${A} + \\angle ${D} = 90^\\circ`),
          mt(`\\angle ${A} + \\angle ${C} = 180^\\circ`),
        ],
        marks: [quadAngle(pts, 0, undefined, true), quadAngle(pts, 3, undefined, true)],
      },
      {
        s: mt(`\\angle ${C} + \\angle ${D} = 180^\\circ`),
        r: "consecutive",
        why: t(
          `$${A}${D} \\parallel ${B}${C}$, cut by the transversal $${D}${C}$.`,
          `$${A}${D} \\parallel ${B}${C}$，被截线 $${D}${C}$ 所截。`,
        ),
        alts: [
          mt(`\\angle ${C} = \\angle ${D}`),
          mt(`\\angle ${C} + \\angle ${D} = 90^\\circ`),
          mt(`\\angle ${B} + \\angle ${D} = 180^\\circ`),
        ],
        marks: [quadAngle(pts, 2, undefined, true)],
      },
      {
        s: mt(`\\angle ${A} + \\angle ${D} = \\angle ${C} + \\angle ${D}`),
        r: "substitution",
        why: t("Both sums equal $180^\\circ$.", "两个和都等于 $180^\\circ$。"),
        alts: [mt(`\\angle ${A} + \\angle ${C} = \\angle ${B} + \\angle ${D}`), mt(`\\angle ${A} + \\angle ${D} = 360^\\circ`)],
      },
      {
        s: mt(`\\angle ${A} = \\angle ${C}`),
        r: "subtraction",
        why: t(`Subtract $\\angle ${D}$ from both sides.`, `两边同时减去 $\\angle ${D}$。`),
        alts: [mt(`\\angle ${A} = \\angle ${D}`), mt(`\\angle ${A} + \\angle ${C} = 180^\\circ`)],
      },
    ],
    base: quadMarks(pts, L, "none"),
    alt: gramAlt(L, ["", ""]),
    check: t(
      `Try numbers: if $\\angle ${A} = ${n}^\\circ$, step 3 gives $\\angle ${D} = ${180 - n}^\\circ$, and step 4 gives $\\angle ${C} = 180^\\circ - ${180 - n}^\\circ = ${n}^\\circ$, the same as $\\angle ${A}$. Both steps use the same angle $\\angle ${D}$, which is why subtracting it leaves $\\angle ${A} = \\angle ${C}$.`,
      `代入数值试一试：若 $\\angle ${A} = ${n}^\\circ$，由第 3 步 $\\angle ${D} = ${180 - n}^\\circ$，由第 4 步 $\\angle ${C} = 180^\\circ - ${180 - n}^\\circ = ${n}^\\circ$，与 $\\angle ${A}$ 相同。两步用的是同一个角 $\\angle ${D}$，所以减去它就得到 $\\angle ${A} = \\angle ${C}$。`,
    ),
  };
}

/** parallelogramPool lists the reasons offered as wrong options in the proofs of properties. */
const parallelogramPool: readonly Reason[] = [
  "given",
  "parallelogram",
  "alternate",
  "consecutive",
  "vertical",
  "reflexive",
  "sas",
  "asa",
  "sss",
  "cpctc",
  "oppositeSides",
  "substitution",
  "subtraction",
];

export const provingPropertiesOfParallelograms: TopicDef = {
  id: "proving-properties-of-parallelograms",
  title: t("Proving Properties of Parallelograms", "证明平行四边形的性质"),
  summary: t(
    "Complete two-column proofs that the opposite sides and angles of a parallelogram are congruent and that its diagonals bisect each other.",
    "补全两栏式证明：平行四边形的对边相等、对角相等、对角线互相平分。",
  ),
  prerequisites: ["properties-of-parallelograms", "proving-congruence-statements", "proving-alternate-angle-theorems"],
  encompasses: [{ topic: "proving-congruence-statements", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.11"],
  intro: t(
    `We have used the properties of parallelograms (opposite sides equal, opposite angles equal, diagonals bisecting each other) without proving them. A proof turns them into theorems that hold for every parallelogram, and the tools are already known: parallel lines give equal alternate interior angles, and congruent triangles have equal corresponding parts.

The trick is to cut the parallelogram along a diagonal. In parallelogram $PQRS$, draw the diagonal $QS$:

{{figure 0}}

Because $PQ \\parallel SR$, the transversal $QS$ makes $\\angle PQS = \\angle RSQ$; because $PS \\parallel QR$, it makes $\\angle PSQ = \\angle RQS$. The two triangles share the side $QS$, which lies between these angles, so $\\triangle PQS \\cong \\triangle RSQ$ by ASA. Matching corners, $P$ corresponds to $R$, and therefore $\\angle P = \\angle R$.

In this lesson we write such arguments as two-column proofs, each statement with its reason: for opposite sides and angles, for the diagonals, and for opposite angles without any triangles.`,
    `我们已经用过平行四边形的性质（对边相等、对角相等、对角线互相平分），却还没有证明它们。证明之后，它们就成了对每个平行四边形都成立的定理，而所需的工具早已学过：平行线带来相等的内错角，全等三角形的对应部分相等。

关键是沿一条对角线把平行四边形剪开。在平行四边形 $PQRS$ 中连接对角线 $QS$：

{{figure 0}}

因为 $PQ \\parallel SR$，截线 $QS$ 使 $\\angle PQS = \\angle RSQ$；因为 $PS \\parallel QR$，它又使 $\\angle PSQ = \\angle RQS$。两个三角形有公共边 $QS$，且它夹在这两组角之间，所以由 ASA，$\\triangle PQS \\cong \\triangle RSQ$。按顶点对应，$P$ 对应 $R$，因此 $\\angle P = \\angle R$。

这节课把这样的论证写成两栏式证明，每个结论都配上理由：证明对边与对角、证明对角线，以及不用三角形证明对角相等。`,
  ),
  introFigures: [
    (() => {
      const d = dir(62, 3.8);
      const [p, q2, r, s]: Quad = [[0, 0], [6, 0], [6 + d[0], d[1]], d];
      return figure(
        [
          ...quadMarks([p, q2, r, s], "PQRS", "none"),
          { kind: "segment", a: q2, b: s, accent: true },
          ...arrows2(p, q2, s, r, 1),
          ...arrows2(p, s, q2, r, 2),
          { kind: "arc", vertex: q2, from: p, to: s, tone: "result" },
          { kind: "arc", vertex: s, from: r, to: q2, tone: "result" },
          { kind: "arc", vertex: s, from: p, to: q2, tone: "action" },
          { kind: "arc", vertex: q2, from: r, to: s, tone: "action" },
        ],
        "Parallelogram PQRS with the diagonal QS; the alternate interior angles PQS and RSQ are marked equal, and so are PSQ and RQS.",
        "平行四边形 PQRS 与对角线 QS；内错角 PQS 与 RSQ 标为相等，PSQ 与 RQS 也标为相等。",
      );
    })(),
  ],
  knowledgePoints: [
    {
      id: "proving-opposite-sides-and-angles",
      figure: geometryDrawings2["proving-properties-of-parallelograms#proving-opposite-sides-and-angles"],
      title: t("Opposite sides and angles", "对边与对角"),
      explanation: t(
        "To prove that the opposite sides of parallelogram $ABCD$ are congruent, draw the diagonal $AC$ and show that it splits the parallelogram into two congruent triangles:\n\n1. $AB \\parallel DC$ and $BC \\parallel AD$: definition of a parallelogram.\n2. $\\angle BAC = \\angle DCA$ and $\\angle BCA = \\angle DAC$: alternate interior angles, with $AC$ as the transversal.\n3. $AC = AC$: reflexive property.\n4. $\\triangle ABC \\cong \\triangle CDA$: ASA, since $AC$ lies between the angles.\n5. $AB = CD$, $BC = DA$, and also $\\angle B = \\angle D$: corresponding parts of congruent triangles.\n\nWhy ASA: the only side known to be shared is $AC$, and it lies between the two pairs of equal angles at its ends.\n\n> **Watch out.** Name the triangles in matching order: $A$ corresponds to $C$, $B$ to $D$ and $C$ to $A$, so the statement is $\\triangle ABC \\cong \\triangle CDA$, not $\\triangle ABC \\cong \\triangle ACD$. And the angles at the ends of $AC$ are alternate interior angles, not vertical angles: vertical angles need two lines crossing at a point.",
        "要证明平行四边形 $ABCD$ 的对边相等，连接对角线 $AC$，证明它把平行四边形分成两个全等三角形：\n\n1. $AB \\parallel DC$，$BC \\parallel AD$：平行四边形的定义。\n2. $\\angle BAC = \\angle DCA$，$\\angle BCA = \\angle DAC$：以 $AC$ 为截线的内错角。\n3. $AC = AC$：自反性。\n4. $\\triangle ABC \\cong \\triangle CDA$：ASA，因为 $AC$ 夹在两角之间。\n5. $AB = CD$，$BC = DA$，还有 $\\angle B = \\angle D$：全等三角形的对应部分相等。\n\n为什么用 ASA：唯一确定相等的边是公共边 $AC$，它正好夹在两端的两组等角之间。\n\n> **注意。** 三角形要按对应顺序书写：$A$ 对应 $C$，$B$ 对应 $D$，$C$ 对应 $A$，所以结论是 $\\triangle ABC \\cong \\triangle CDA$，不是 $\\triangle ABC \\cong \\triangle ACD$。另外，$AC$ 两端的角是内错角，不是对顶角：对顶角要两条直线交于一点才有。",
      ),
      keyPrerequisites: ["proving-congruence-statements"],
      generate: (rng) => proofProblem(rng, oppositeSidesProof(rng, rng.bool() ? 0 : 1), parallelogramPool),
    },
    {
      id: "proving-the-diagonals-bisect-each-other",
      figure: geometryDrawings2["proving-properties-of-parallelograms#proving-the-diagonals-bisect-each-other"],
      title: t("The diagonals bisect each other", "对角线互相平分"),
      explanation: t(
        "Once opposite sides are known to be congruent, that fact can be cited as a reason. Let the diagonals of parallelogram $ABCD$ meet at $E$:\n\n1. $AB \\parallel DC$: definition of a parallelogram.\n2. $AB = DC$: opposite sides of a parallelogram are congruent.\n3. $\\angle BAE = \\angle DCE$ (transversal $AC$) and $\\angle ABE = \\angle CDE$ (transversal $BD$): alternate interior angles.\n4. $\\triangle ABE \\cong \\triangle CDE$: ASA.\n5. $AE = CE$ and $BE = DE$: corresponding parts of congruent triangles. So $E$ is the midpoint of both diagonals.\n\nThe side $AB$ lies between the angles at $A$ and $B$, and $DC$ between those at $C$ and $D$, which is why the criterion is ASA.\n\n> **Watch out.** Every step may cite only what is given or already proved. $AB = DC$ comes from the theorem on opposite sides, proved before; $AE = CE$ is what we want, so it cannot be a reason. And the equal angles at $A$ and $C$ come from the parallel sides $AB$ and $DC$, so the reason is alternate interior angles, not the definition alone.",
        "对边相等证明之后，就可以作为理由使用。设平行四边形 $ABCD$ 的对角线交于 $E$：\n\n1. $AB \\parallel DC$：平行四边形的定义。\n2. $AB = DC$：平行四边形的对边相等。\n3. $\\angle BAE = \\angle DCE$（截线 $AC$），$\\angle ABE = \\angle CDE$（截线 $BD$）：内错角相等。\n4. $\\triangle ABE \\cong \\triangle CDE$：ASA。\n5. $AE = CE$，$BE = DE$：全等三角形的对应部分相等。所以 $E$ 是两条对角线的中点。\n\n边 $AB$ 夹在 $A$、$B$ 处的两角之间，$DC$ 夹在 $C$、$D$ 处的两角之间，所以用的是 ASA。\n\n> **注意。** 每一步只能引用已知条件或已经证明的结论。$AB = DC$ 来自前面证明过的对边定理；$AE = CE$ 是要证的结论，不能当作理由。另外，$A$、$C$ 处的角相等是因为 $AB$ 与 $DC$ 平行，理由是内错角相等，而不只是定义。",
      ),
      generate: (rng) => proofProblem(rng, diagonalsProof(rng), parallelogramPool),
    },
    {
      id: "proving-with-consecutive-angles",
      figure: geometryDrawings2["proving-properties-of-parallelograms#proving-with-consecutive-angles"],
      title: t("Opposite angles from consecutive angles", "由邻角证明对角相等"),
      explanation: t(
        "Opposite angles can also be proved equal without triangles. In parallelogram $ABCD$:\n\n1. $\\angle A + \\angle D = 180^\\circ$: consecutive interior angles, since $AB \\parallel DC$ with transversal $AD$.\n2. $\\angle C + \\angle D = 180^\\circ$: consecutive interior angles, since $AD \\parallel BC$ with transversal $DC$.\n3. $\\angle A + \\angle D = \\angle C + \\angle D$: substitution.\n4. $\\angle A = \\angle C$: subtraction property of equality.\n\nThe idea: $\\angle A$ and $\\angle C$ are both what is left of $180^\\circ$ after taking away the same $\\angle D$, so they must be equal.\n\n> **Watch out.** $\\angle A$ and $\\angle D$ lie on the same side of the transversal $AD$, between the parallels: they are consecutive interior angles and add up to $180^\\circ$. They are not alternate interior angles, which would be equal. And the last step takes $\\angle D$ away from both sides, which is the subtraction property, not substitution.",
        "对角相等也可以不借助三角形来证明。在平行四边形 $ABCD$ 中：\n\n1. $\\angle A + \\angle D = 180^\\circ$：$AB \\parallel DC$，截线为 $AD$，同旁内角互补。\n2. $\\angle C + \\angle D = 180^\\circ$：$AD \\parallel BC$，截线为 $DC$，同旁内角互补。\n3. $\\angle A + \\angle D = \\angle C + \\angle D$：等量代换。\n4. $\\angle A = \\angle C$：等式的减法性质。\n\n思路是：$\\angle A$ 和 $\\angle C$ 都是 $180^\\circ$ 减去同一个 $\\angle D$ 剩下的部分，所以必然相等。\n\n> **注意。** $\\angle A$ 与 $\\angle D$ 在截线 $AD$ 的同一侧、两条平行线之间：它们是同旁内角，和为 $180^\\circ$，而不是相等的内错角。最后一步是两边同时减去 $\\angle D$，用的是等式的减法性质，不是等量代换。",
      ),
      generate: (rng) => proofProblem(rng, consecutiveProof(rng), parallelogramPool),
    },
  ],
};

/** sidesCriterionProof proves that a quadrilateral with both pairs of opposite sides congruent (variant 0), or one pair both parallel and congruent (variant 1), is a parallelogram. */
function sidesCriterionProof(rng: Rng, variant: 0 | 1): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  const [pa, pb, pc, pd] = pts;
  const isGram = { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "parallelogram" as const };
  const tri = (r: Reason): ProofStep => ({
    s: mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${C}${D}${A}`),
    r,
    alts: [
      mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${D}`),
      mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${A}${C}`),
      mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${C}${A}${D}`),
    ],
  });
  const second: ProofStep[] = [
    {
      s: mt(`\\angle ${B}${C}${A} = \\angle ${D}${A}${C}`),
      r: "cpctc",
      alts: [mt(`\\angle ${B}${C}${A} = \\angle ${B}${A}${C}`), mt(`\\angle ${B}${C}${A} = \\angle ${D}${C}${A}`)],
      marks: arcs2(pc, pb, pa, pa, pd, pc),
    },
    {
      s: mt(`${B}${C} \\parallel ${A}${D}`),
      r: "altConverse",
      why: t(`The alternate interior angles along $${A}${C}$ are equal.`, `沿截线 $${A}${C}$ 的内错角相等。`),
      alts: [mt(`${B}${C} = ${A}${D}`), mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
      marks: arrows2(pb, pc, pa, pd, 2),
    },
  ];
  const base = quadMarks(pts, L, "ac");
  if (variant === 0) {
    return {
      given: both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`),
      prove: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
      steps: [
        {
          s: both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`),
          r: "given",
          marks: [...ticks2(pa, pb, pc, pd, 1), ...ticks2(pb, pc, pd, pa, 2)],
          drawn: true,
        },
        { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive", marks: [{ kind: "ticks", a: pa, b: pc, count: 3 }] },
        { ...tri("sss"), why: t("All three pairs of sides are equal.", "三组对应边分别相等。") },
        {
          s: mt(`\\angle ${B}${A}${C} = \\angle ${D}${C}${A}`),
          r: "cpctc",
          alts: [mt(`\\angle ${B}${A}${C} = \\angle ${B}${C}${A}`), mt(`\\angle ${B}${A}${C} = \\angle ${D}${A}${C}`)],
          marks: arcs2(pa, pb, pc, pc, pd, pa),
        },
        {
          s: mt(`${A}${B} \\parallel ${D}${C}`),
          r: "altConverse",
          why: t(`The alternate interior angles along $${A}${C}$ are equal.`, `沿截线 $${A}${C}$ 的内错角相等。`),
          alts: [mt(`${A}${B} = ${D}${C}`), mt(`${A}${B} \\parallel ${A}${D}`), mt(`${A}${C} \\parallel ${B}${D}`)],
          marks: arrows2(pa, pb, pd, pc, 1),
        },
        ...second,
        isGram,
      ],
      base,
      alt: gramAlt(L, [
        ` with ${A}${B} = ${C}${D}, ${B}${C} = ${D}${A}, and the diagonal ${A}${C}`,
        `，${A}${B} = ${C}${D}，${B}${C} = ${D}${A}，连接对角线 ${A}${C}`,
      ]),
      check: t(
        `Step 3 uses SSS: $${A}${B} = ${C}${D}$ and $${B}${C} = ${D}${A}$ (given) and the shared side $${A}${C}$ (step 2). The proof never assumes a pair of sides parallel; both pairs of parallel sides are derived, in steps 5 and 7, so the last step follows from the definition.`,
        `第 3 步用 SSS：$${A}${B} = ${C}${D}$、$${B}${C} = ${D}${A}$（已知）和公共边 $${A}${C}$（第 2 步）。证明中从未假定哪组边平行；两组平行都是推出来的（第 5、7 步），所以最后一步由定义得出。`,
      ),
    };
  }
  return {
    given: both(`${A}${B} \\parallel ${D}${C}`, `${A}${B} = ${D}${C}`),
    prove: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    steps: [
      {
        s: both(`${A}${B} \\parallel ${D}${C}`, `${A}${B} = ${D}${C}`),
        r: "given",
        marks: [...ticks2(pa, pb, pd, pc, 1), ...arrows2(pa, pb, pd, pc, 1)],
        drawn: true,
      },
      {
        s: mt(`\\angle ${B}${A}${C} = \\angle ${D}${C}${A}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${A}${C}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${A}${C}$ 所截。`,
        ),
        alts: [mt(`\\angle ${B}${A}${C} = \\angle ${B}${C}${A}`), mt(`\\angle ${B}${A}${C} = \\angle ${D}${A}${C}`)],
        marks: arcs2(pa, pb, pc, pc, pd, pa),
      },
      { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive", marks: [{ kind: "ticks", a: pa, b: pc, count: 2 }] },
      {
        ...tri("sas"),
        why: t(
          `$${A}${B} = ${C}${D}$, $\\angle ${B}${A}${C} = \\angle ${D}${C}${A}$ and $${A}${C} = ${C}${A}$: two sides and the angle between them.`,
          `$${A}${B} = ${C}${D}$，$\\angle ${B}${A}${C} = \\angle ${D}${C}${A}$，$${A}${C} = ${C}${A}$：两边及其夹角。`,
        ),
      },
      ...second,
      isGram,
    ],
    base,
    alt: gramAlt(L, [
      ` with ${A}${B} parallel and equal to ${D}${C}, and the diagonal ${A}${C}`,
      `，${A}${B} 与 ${D}${C} 平行且相等，连接对角线 ${A}${C}`,
    ]),
    check: t(
      `Step 4 uses SAS: the angle at $${A}$ in one triangle lies between $${A}${B}$ and $${A}${C}$, and the angle at $${C}$ in the other between $${C}${D}$ and $${C}${A}$, so each is the angle between the two equal sides. The given pair $${A}${B} \\parallel ${D}${C}$ and the derived pair $${B}${C} \\parallel ${A}${D}$ of step 6 are both pairs of opposite sides, as the definition requires.`,
      `第 4 步用 SAS：一个三角形中 $${A}$ 处的角夹在 $${A}${B}$ 与 $${A}${C}$ 之间，另一个三角形中 $${C}$ 处的角夹在 $${C}${D}$ 与 $${C}${A}$ 之间，都是两条相等边的夹角。已知的 $${A}${B} \\parallel ${D}${C}$ 与第 6 步推出的 $${B}${C} \\parallel ${A}${D}$ 正好是两组对边，符合定义。`,
    ),
  };
}

/** bisectingDiagonalsProof proves that a quadrilateral whose diagonals bisect each other is a parallelogram. */
function bisectingDiagonalsProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  const [pa, pb, pc, pd] = pts;
  const pe = center([pa, pc]);
  return {
    given: t(
      `The diagonals of $${L}$ meet at $${E}$, with $${A}${E} = ${C}${E}$ and $${B}${E} = ${D}${E}$`,
      `$${L}$ 的对角线交于 $${E}$，$${A}${E} = ${C}${E}$，$${B}${E} = ${D}${E}$`,
    ),
    prove: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    steps: [
      {
        s: both(`${A}${E} = ${C}${E}`, `${B}${E} = ${D}${E}`),
        r: "given",
        marks: [...ticks2(pa, pe, pe, pc, 1), ...ticks2(pb, pe, pe, pd, 2)],
        drawn: true,
      },
      {
        s: mt(`\\angle ${A}${E}${B} = \\angle ${C}${E}${D}`),
        r: "vertical",
        alts: [
          mt(`\\angle ${A}${E}${B} = \\angle ${B}${E}${C}`),
          mt(`\\angle ${A}${E}${B} = 90^\\circ`),
          mt(`\\angle ${A}${E}${B} = \\angle ${A}${E}${D}`),
        ],
        marks: arcs2(pe, pa, pb, pe, pc, pd),
      },
      {
        s: mt(`\\triangle ${A}${E}${B} \\cong \\triangle ${C}${E}${D}`),
        r: "sas",
        why: t(
          `$${A}${E} = ${C}${E}$, $\\angle ${A}${E}${B} = \\angle ${C}${E}${D}$, $${B}${E} = ${D}${E}$: two sides and the angle between them.`,
          `$${A}${E} = ${C}${E}$，$\\angle ${A}${E}${B} = \\angle ${C}${E}${D}$，$${B}${E} = ${D}${E}$：两边及其夹角。`,
        ),
        alts: [
          mt(`\\triangle ${A}${E}${B} \\cong \\triangle ${C}${D}${E}`),
          mt(`\\triangle ${A}${E}${B} \\cong \\triangle ${D}${E}${C}`),
          mt(`\\triangle ${A}${E}${B} \\cong \\triangle ${C}${E}${B}`),
        ],
      },
      {
        s: mt(`${A}${B} = ${C}${D}`),
        r: "cpctc",
        alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${C} = ${B}${D}`)],
        marks: ticks2(pa, pb, pc, pd, 3),
      },
      {
        s: mt(`\\angle ${A}${B}${E} = \\angle ${C}${D}${E}`),
        r: "cpctc",
        alts: [mt(`\\angle ${A}${B}${E} = \\angle ${B}${A}${E}`), mt(`\\angle ${A}${B}${E} = \\angle ${C}${B}${E}`)],
        marks: arcs2(pb, pa, pe, pd, pc, pe),
      },
      {
        s: mt(`${A}${B} \\parallel ${D}${C}`),
        r: "altConverse",
        why: t(`The alternate interior angles along $${B}${D}$ are equal.`, `沿截线 $${B}${D}$ 的内错角相等。`),
        alts: [mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`), mt(`${A}${D} \\parallel ${B}${D}`)],
        marks: arrows2(pa, pb, pd, pc, 1),
      },
      {
        s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
        r: "onePair",
        why: t(
          `By steps 4 and 6, $${A}${B}$ and $${D}${C}$ are both parallel and congruent.`,
          `由第 4、6 步，$${A}${B}$ 与 $${D}${C}$ 平行且相等。`,
        ),
      },
    ],
    base: quadMarks(pts, L, "both", E),
    alt: gramAlt(L, [` whose diagonals meet at ${E}`, `，对角线交于 ${E}`]),
    check: t(
      `Step 3 uses SAS: the vertical angles at $${E}$ lie between the equal halves $${A}${E}, ${C}${E}$ and $${B}${E}, ${D}${E}$. The last step needs one pair of opposite sides both parallel and equal, and $${A}${B}, ${D}${C}$ is such a pair: equal by step 4, parallel by step 6.`,
      `第 3 步用 SAS：$${E}$ 处的对顶角夹在相等的半条对角线 $${A}${E}, ${C}${E}$ 与 $${B}${E}, ${D}${E}$ 之间。最后一步需要一组对边平行且相等，$${A}${B}, ${D}${C}$ 正是这样一组：第 4 步得相等，第 6 步得平行。`,
    ),
  };
}

/** rectangleProof proves that a parallelogram with congruent diagonals is a rectangle. */
function rectangleProof(rng: Rng): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const w = rng.int(5, 7);
  const h = rng.int(3, 4);
  const pts: Quad = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const [pa, pb, pc, pd] = pts;
  const n = rng.pick([70, 75, 80, 100, 105, 110]);
  return {
    given: t(`$${L}$ is a parallelogram with $${A}${C} = ${D}${B}$`, `$${L}$ 是平行四边形，$${A}${C} = ${D}${B}$`),
    prove: t(`$${L}$ is a rectangle`, `$${L}$ 是矩形`),
    steps: [
      {
        s: t(`$${L}$ is a parallelogram with $${A}${C} = ${D}${B}$`, `$${L}$ 是平行四边形，$${A}${C} = ${D}${B}$`),
        r: "given",
        marks: ticks2(pa, pc, pd, pb, 1),
        drawn: true,
      },
      {
        s: mt(`${A}${B} = ${D}${C}`),
        r: "oppositeSides",
        alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${B} = ${A}${C}`)],
        marks: ticks2(pa, pb, pd, pc, 2),
      },
      { s: mt(`${B}${C} = ${C}${B}`), r: "reflexive", marks: [{ kind: "ticks", a: pb, b: pc, count: 3 }] },
      {
        s: mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${C}${B}`),
        r: "sss",
        why: t(
          `$${A}${B} = ${D}${C}$, $${B}${C} = ${C}${B}$, $${A}${C} = ${D}${B}$.`,
          `$${A}${B} = ${D}${C}$，$${B}${C} = ${C}${B}$，$${A}${C} = ${D}${B}$。`,
        ),
        alts: [
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${B}${C}${D}`),
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${C}${D}${B}`),
          mt(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${B}${C}`),
        ],
      },
      {
        s: mt(`\\angle ${A}${B}${C} = \\angle ${D}${C}${B}`),
        r: "cpctc",
        alts: [mt(`\\angle ${A}${B}${C} = \\angle ${B}${A}${C}`), mt(`\\angle ${A}${B}${C} = \\angle ${A}${C}${B}`)],
        marks: arcs2(pb, pa, pc, pc, pd, pb),
      },
      {
        s: mt(`\\angle ${A}${B}${C} + \\angle ${D}${C}${B} = 180^\\circ`),
        r: "consecutive",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${B}${C}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${B}${C}$ 所截。`,
        ),
        alts: [
          mt(`\\angle ${A}${B}${C} + \\angle ${D}${C}${B} = 90^\\circ`),
          mt(`\\angle ${A}${B}${C} + \\angle ${D}${C}${B} = 360^\\circ`),
        ],
        marks: arrows2(pa, pb, pd, pc, 1),
      },
      {
        s: mt(`\\angle ${A}${B}${C} = 90^\\circ`),
        r: "halving",
        why: t(`By steps 5 and 6, $2\\angle ${A}${B}${C} = 180^\\circ$.`, `由第 5、6 步，$2\\angle ${A}${B}${C} = 180^\\circ$。`),
        alts: [mt(`\\angle ${A}${B}${C} = 45^\\circ`), mt(`\\angle ${A}${B}${C} = 180^\\circ`)],
        marks: [{ kind: "right", vertex: pb, from: pa, to: pc }],
      },
      { s: t(`$${L}$ is a rectangle`, `$${L}$ 是矩形`), r: "rightParallelogram" },
    ],
    base: quadMarks(pts, L, "both"),
    alt: gramAlt(L, [`, a parallelogram with diagonals ${A}${C} and ${B}${D}`, `，是平行四边形，对角线为 ${A}${C} 与 ${B}${D}`]),
    check: t(
      `Why equal diagonals matter: in a parallelogram that is not a rectangle, say with $\\angle ${A}${B}${C} = ${n}^\\circ$, step 6 would give $\\angle ${D}${C}${B} = ${180 - n}^\\circ \\ne ${n}^\\circ$, so the triangles of step 4 could not be congruent and the diagonals would differ. Equal diagonals force the two angles at $${B}$ and $${C}$ to be equal and to add up to $180^\\circ$, and only $90^\\circ + 90^\\circ$ does both.`,
      `为什么对角线相等是关键：在不是矩形的平行四边形中，比如 $\\angle ${A}${B}${C} = ${n}^\\circ$，由第 6 步 $\\angle ${D}${C}${B} = ${180 - n}^\\circ \\ne ${n}^\\circ$，第 4 步的两个三角形就不可能全等，两条对角线也就不相等。对角线相等迫使 $${B}$、$${C}$ 处的两个角既相等又互补，只有 $90^\\circ + 90^\\circ$ 同时满足。`,
    ),
  };
}

/** criteriaPool lists the reasons offered as wrong options in the proofs of criteria. */
const criteriaPool: readonly Reason[] = [
  "given",
  "parallelogram",
  "alternate",
  "altConverse",
  "consecutive",
  "vertical",
  "reflexive",
  "sas",
  "asa",
  "sss",
  "cpctc",
  "oppositeSides",
  "diagonalsBisect",
  "oppositeAngles",
  "onePair",
  "rightParallelogram",
  "halving",
];

export const provingCriteriaForParallelogramsAndRectangles: TopicDef = {
  id: "proving-criteria-for-parallelograms-and-rectangles",
  title: t("Proving Criteria for Parallelograms and Rectangles", "证明平行四边形与矩形的判定"),
  summary: t(
    "Prove that a quadrilateral is a parallelogram from its sides or diagonals, and that a parallelogram with congruent diagonals is a rectangle.",
    "由边或对角线证明四边形是平行四边形，并证明对角线相等的平行四边形是矩形。",
  ),
  prerequisites: ["proving-properties-of-parallelograms", "proving-alternate-angle-converses"],
  encompasses: [
    { topic: "proving-alternate-angle-converses", weight: 0.3 },
    { topic: "properties-of-parallelograms", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.CO.C.11"],
  intro: t(
    `The last lesson went from a parallelogram to its properties. A builder needs the other direction: given only a few measurements of a quadrilateral, can we be sure it **is** a parallelogram, or a rectangle? A statement read backwards, its converse, is not automatically true, so each one needs its own proof.

Sometimes it holds and sometimes it does not. Take four rods of lengths $5$, $8$, $5$, $8$:

{{figure 0}}

Joined with the equal rods opposite each other, they always make a parallelogram, however the frame leans; we prove this below. Joined with the equal rods next to each other, they make a kite, which is not a parallelogram. So the criterion must say exactly which parts are equal.

In this lesson we prove the criteria from the sides and from the diagonals, prove that a parallelogram with equal diagonals is a rectangle (the reason carpenters measure both diagonals of a frame), and use the criteria to find the values that make a figure a parallelogram or a rectangle.`,
    `上一节课由平行四边形推出它的性质。建造的人需要反方向的结论：只量了一个四边形的几个数据，能否断定它**是**平行四边形，或者是矩形？一个命题反过来说，即它的逆命题，不一定成立，所以每一条都要单独证明。

有时成立，有时不成立。取长为 $5$、$8$、$5$、$8$ 的四根杆：

{{figure 0}}

把相等的杆相对放置，无论框架怎样倾斜，围成的总是平行四边形，下面会证明这一点。把相等的杆相邻放置，围成的是筝形，不是平行四边形。所以判定方法必须准确说明哪些部分相等。

这节课证明由边判定和由对角线判定平行四边形的方法，证明对角线相等的平行四边形是矩形（这就是木匠要量框架两条对角线的原因），并用这些判定求出使图形成为平行四边形或矩形的值。`,
  ),
  introFigures: [
    figure(
      [
        {
          kind: "polygon",
          points: [
            [0, 0],
            [8, 0],
            [10.5, 4.3],
            [2.5, 4.3],
          ],
        },
        ...ticks2([0, 0], [8, 0], [10.5, 4.3], [2.5, 4.3], 1),
        ...ticks2([8, 0], [10.5, 4.3], [2.5, 4.3], [0, 0], 2),
        { kind: "side", a: [0, 0], b: [8, 0], text: "8" },
        { kind: "side", a: [8, 0], b: [10.5, 4.3], text: "5" },
        {
          kind: "polygon",
          points: [
            [16, -2],
            [20.8, -0.6],
            [16, 6],
            [11.2, -0.6],
          ],
        },
        { kind: "side", a: [16, -2], b: [20.8, -0.6], text: "5" },
        { kind: "side", a: [20.8, -0.6], b: [16, 6], text: "8" },
      ],
      "Left: rods 8, 5, 8, 5 with equal rods opposite each other form a parallelogram. Right: rods 5, 8, 8, 5 with equal rods next to each other form a kite.",
      "左：长 8、5、8、5 的杆，相等的杆相对，围成平行四边形。右：长 5、8、8、5 的杆，相等的杆相邻，围成筝形。",
    ),
  ],
  knowledgePoints: [
    {
      id: "proving-the-side-criteria",
      figure: geometryDrawings2["proving-criteria-for-parallelograms-and-rectangles#proving-the-side-criteria"],
      title: t("Criteria from the sides", "由边判定"),
      explanation: t(
        'The converses of the properties are criteria: they prove that a quadrilateral **is** a parallelogram. To prove that $ABCD$ with $AB = CD$ and $BC = DA$ is a parallelogram, draw the diagonal $AC$:\n\n1. $AC = AC$: reflexive property, so $\\triangle ABC \\cong \\triangle CDA$ by SSS.\n2. $\\angle BAC = \\angle DCA$: corresponding parts, so $AB \\parallel DC$ by the converse of the alternate interior angles theorem.\n3. Likewise $\\angle BCA = \\angle DAC$ gives $BC \\parallel AD$.\n4. Both pairs of opposite sides are parallel: $ABCD$ is a parallelogram by definition.\n\nIf instead one pair is given both parallel and congruent ($AB \\parallel DC$, $AB = DC$), alternate interior angles give $\\angle BAC = \\angle DCA$, and the triangles are congruent by SAS.\n\n> **Watch out.** Until the last line, $ABCD$ is only a quadrilateral, so no property of parallelograms may be cited: "opposite sides of a parallelogram are parallel" would assume what is to be proved. The parallel sides come from the converse, equal alternate interior angles make lines parallel.',
        "性质的逆命题就是判定方法：它们证明一个四边形**是**平行四边形。要证明 $AB = CD$、$BC = DA$ 的四边形 $ABCD$ 是平行四边形，连接对角线 $AC$：\n\n1. $AC = AC$：自反性，所以由 SSS，$\\triangle ABC \\cong \\triangle CDA$。\n2. $\\angle BAC = \\angle DCA$：对应部分相等，所以由内错角相等，两直线平行，$AB \\parallel DC$。\n3. 同理，由 $\\angle BCA = \\angle DAC$ 得 $BC \\parallel AD$。\n4. 两组对边分别平行：由定义，$ABCD$ 是平行四边形。\n\n若已知的是一组对边平行且相等（$AB \\parallel DC$，$AB = DC$），则由内错角得 $\\angle BAC = \\angle DCA$，再由 SAS 得两三角形全等。\n\n> **注意。** 直到最后一行，$ABCD$ 都只是一个四边形，所以不能引用平行四边形的任何性质：引用“平行四边形的对边平行”就等于先假定了要证的结论。平行的边来自逆定理：内错角相等，两直线平行。",
      ),
      keyPrerequisites: ["proving-alternate-angle-converses"],
      generate: (rng) => proofProblem(rng, sidesCriterionProof(rng, rng.bool() ? 0 : 1), criteriaPool),
    },
    {
      id: "proving-the-diagonal-criterion",
      figure: geometryDrawings2["proving-criteria-for-parallelograms-and-rectangles#proving-the-diagonal-criterion"],
      title: t("Diagonals that bisect each other", "对角线互相平分"),
      explanation: t(
        "If the diagonals of $ABCD$ bisect each other at $E$, the quadrilateral is a parallelogram:\n\n1. $\\angle AEB = \\angle CED$: vertical angles.\n2. $\\triangle AEB \\cong \\triangle CED$: SAS, with $AE = CE$ and $BE = DE$.\n3. $AB = CD$ and $\\angle ABE = \\angle CDE$: corresponding parts.\n4. $AB \\parallel DC$: converse of the alternate interior angles theorem, with $BD$ as the transversal.\n5. $AB$ and $DC$ are both parallel and congruent, so $ABCD$ is a parallelogram.\n\nThe given halves are the sides of the triangles at $E$, and the angle between them is the vertical angle, which is why SAS fits.\n\n> **Watch out.** The angles at $E$ are vertical angles, formed by the two diagonals crossing; they are not alternate interior angles, since nothing is known to be parallel yet. Parallel sides appear only in step 4, from the converse: equal alternate interior angles make the lines parallel.",
        "若四边形 $ABCD$ 的对角线在 $E$ 处互相平分，则它是平行四边形：\n\n1. $\\angle AEB = \\angle CED$：对顶角相等。\n2. $\\triangle AEB \\cong \\triangle CED$：SAS，因为 $AE = CE$，$BE = DE$。\n3. $AB = CD$，$\\angle ABE = \\angle CDE$：对应部分相等。\n4. $AB \\parallel DC$：以 $BD$ 为截线，内错角相等，两直线平行。\n5. $AB$ 与 $DC$ 平行且相等，所以 $ABCD$ 是平行四边形。\n\n已知的两半正是 $E$ 处两个三角形的边，它们的夹角是对顶角，所以用 SAS。\n\n> **注意。** $E$ 处的角是两条对角线相交形成的对顶角；它们不是内错角，因为此时还不知道哪些边平行。平行的边要到第 4 步才由逆定理得到：内错角相等，两直线平行。",
      ),
      generate: (rng) => proofProblem(rng, bisectingDiagonalsProof(rng), criteriaPool),
    },
    {
      id: "proving-the-rectangle-criterion",
      figure: geometryDrawings2["proving-criteria-for-parallelograms-and-rectangles#proving-the-rectangle-criterion"],
      title: t("Congruent diagonals make a rectangle", "对角线相等的平行四边形是矩形"),
      explanation: t(
        'A **rectangle** is a parallelogram with a right angle (and then all four angles are right). If parallelogram $ABCD$ has $AC = DB$:\n\n1. $AB = DC$: opposite sides; $BC = CB$: reflexive property.\n2. $\\triangle ABC \\cong \\triangle DCB$: SSS, so $\\angle ABC = \\angle DCB$.\n3. $\\angle ABC + \\angle DCB = 180^\\circ$: consecutive interior angles, since $AB \\parallel DC$.\n4. Substituting, $2\\angle ABC = 180^\\circ$, so $\\angle ABC = 90^\\circ$ and $ABCD$ is a rectangle.\n\nThe two angles at $B$ and $C$ are equal and supplementary at once, and only $90^\\circ + 90^\\circ$ does both.\n\n> **Watch out.** "The diagonals of a rectangle are congruent" is the converse of this theorem and cannot be cited: it assumes the rectangle. The triangles $ABC$ and $DCB$ are congruent by SSS because of the given equal diagonals, the opposite sides and the shared side $BC$.',
        "**矩形**是有一个角是直角的平行四边形（这时四个角都是直角）。若平行四边形 $ABCD$ 满足 $AC = DB$：\n\n1. $AB = DC$：对边相等；$BC = CB$：自反性。\n2. $\\triangle ABC \\cong \\triangle DCB$：SSS，所以 $\\angle ABC = \\angle DCB$。\n3. $\\angle ABC + \\angle DCB = 180^\\circ$：$AB \\parallel DC$，同旁内角互补。\n4. 代入得 $2\\angle ABC = 180^\\circ$，所以 $\\angle ABC = 90^\\circ$，$ABCD$ 是矩形。\n\n$B$、$C$ 处的两个角既相等又互补，只有 $90^\\circ + 90^\\circ$ 能同时满足。\n\n> **注意。** “矩形的对角线相等”是本定理的逆命题，不能引用：它先假定了矩形。三角形 $ABC$ 与 $DCB$ 由 SSS 全等，依据的是已知的相等对角线、对边和公共边 $BC$。",
      ),
      generate: (rng) => proofProblem(rng, rectangleProof(rng), criteriaPool),
    },
    {
      id: "values-that-make-a-parallelogram",
      figure: geometryDrawings2["proving-criteria-for-parallelograms-and-rectangles#values-that-make-a-parallelogram"],
      title: t("Values that make a parallelogram", "使四边形成为平行四边形的值"),
      explanation: t(
        "A criterion tells which condition to impose. To make $ABCD$ a parallelogram, make both pairs of opposite sides equal, or make the diagonals bisect each other. To make parallelogram $ABCD$ a rectangle, make its diagonals equal.\n\nIf the diagonals of $ABCD$ meet at $E$ with $AE = 5x - 3$ and $CE = 2x + 9$, they bisect each other when the two halves of $AC$ are equal:\n\n$$5x - 3 = 2x + 9, \\qquad 3x = 12, \\qquad x = 4.$$\n\nThen $AE = CE = 17$, so $E$ is the midpoint of $AC$; if $E$ is also the midpoint of $BD$, the diagonal criterion makes $ABCD$ a parallelogram.\n\n> **Watch out.** Equate the parts the criterion names: the two halves of the same diagonal, two opposite sides, or (for a rectangle) the two whole diagonals. Moving a term across the equals sign changes its sign; substituting $x$ back into both expressions catches a slip, since they must come out equal.",
        "判定方法告诉我们应当满足什么条件。要使 $ABCD$ 成为平行四边形，可以让两组对边分别相等，或让对角线互相平分。要使平行四边形 $ABCD$ 成为矩形，让它的对角线相等。\n\n若 $ABCD$ 的对角线交于 $E$，$AE = 5x - 3$，$CE = 2x + 9$，则当 $AC$ 的两半相等时对角线互相平分：\n\n$$5x - 3 = 2x + 9, \\qquad 3x = 12, \\qquad x = 4.$$\n\n这时 $AE = CE = 17$，$E$ 是 $AC$ 的中点；若 $E$ 也是 $BD$ 的中点，由对角线判定，$ABCD$ 是平行四边形。\n\n> **注意。** 要让判定方法所说的部分相等：同一条对角线的两半、两条对边，或者（判定矩形时）两条整条对角线。移项要变号；把 $x$ 代回两个式子可以发现错误，因为两者必须相等。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 12);
          const v = rng.int(5, 40);
          const [p1, p2] = [rng.int(1, 6), rng.int(1, 6)];
          const d1 = v - p1 * x;
          const d2 = v - p2 * x;
          if (p1 === p2 || Math.abs(d1) > 30 || Math.abs(d2) > 30) continue;
          const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
          const L = `${A}${B}${C}${D}`;
          const kind = rng.int(0, 2);
          const [s1, s2] =
            kind === 0
              ? rng.pick([
                  [`${A}${B}`, `${C}${D}`],
                  [`${B}${C}`, `${D}${A}`],
                ] as const)
              : kind === 1
                ? rng.pick([
                    [`${A}${E}`, `${C}${E}`],
                    [`${B}${E}`, `${D}${E}`],
                  ] as const)
                : ([`${A}${C}`, `${B}${D}`] as const);
          const work = chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`);
          const setting = [
            t(
              `In quadrilateral $${L}$, $${s1} = ${linear(p1, d1)}$ and $${s2} = ${linear(p2, d2)}$, and the other pair of opposite sides are congruent. For which value of $x$ is $${L}$ a parallelogram?`,
              `在四边形 $${L}$ 中，$${s1} = ${linear(p1, d1)}$，$${s2} = ${linear(p2, d2)}$，另一组对边相等。$x$ 为何值时，$${L}$ 是平行四边形？`,
            ),
            t(
              `The diagonals of quadrilateral $${L}$ meet at $${E}$, with $${s1} = ${linear(p1, d1)}$ and $${s2} = ${linear(p2, d2)}$, and the other diagonal is bisected at $${E}$. For which value of $x$ is $${L}$ a parallelogram?`,
              `四边形 $${L}$ 的对角线交于 $${E}$，$${s1} = ${linear(p1, d1)}$，$${s2} = ${linear(p2, d2)}$，另一条对角线被 $${E}$ 平分。$x$ 为何值时，$${L}$ 是平行四边形？`,
            ),
            t(
              `$${L}$ is a parallelogram with diagonals $${s1} = ${linear(p1, d1)}$ and $${s2} = ${linear(p2, d2)}$. For which value of $x$ is $${L}$ a rectangle?`,
              `$${L}$ 是平行四边形，对角线 $${s1} = ${linear(p1, d1)}$，$${s2} = ${linear(p2, d2)}$。$x$ 为何值时，$${L}$ 是矩形？`,
            ),
          ][kind]!;
          const reason = [
            t(
              `The other pair of opposite sides is already congruent. If $${s1} = ${s2}$ as well, both pairs of opposite sides are congruent, and the side criterion makes $${L}$ a parallelogram:`,
              `另一组对边已经相等。若再有 $${s1} = ${s2}$，两组对边就分别相等，由边的判定，$${L}$ 是平行四边形：`,
            ),
            t(
              `The other diagonal is already bisected at $${E}$. If $${s1} = ${s2}$ as well, the diagonals bisect each other, and the diagonal criterion makes $${L}$ a parallelogram:`,
              `另一条对角线已被 $${E}$ 平分。若再有 $${s1} = ${s2}$，对角线就互相平分，由对角线的判定，$${L}$ 是平行四边形：`,
            ),
            t(
              `A parallelogram with congruent diagonals is a rectangle, so we need $${s1} = ${s2}$:`,
              `对角线相等的平行四边形是矩形，所以需要 $${s1} = ${s2}$：`,
            ),
          ][kind]!;
          const pts: Quad =
            kind === 2
              ? posed(
                  [
                    [0, 0],
                    [6, 0],
                    [6, 4],
                    [0, 4],
                  ] as const,
                  pickPose(rng),
                )
              : gramPoints(rng, pickGramAngle(rng));
          const pe = center([pts[0], pts[2]]);
          const equal =
            kind === 0
              ? s1 === `${A}${B}`
                ? ticks2(pts[0], pts[1], pts[2], pts[3], 1)
                : ticks2(pts[1], pts[2], pts[3], pts[0], 1)
              : kind === 1
                ? s1 === `${A}${E}`
                  ? [...ticks2(pts[0], pe, pts[2], pe, 1), ...ticks2(pts[1], pe, pts[3], pe, 2)]
                  : [...ticks2(pts[1], pe, pts[3], pe, 1), ...ticks2(pts[0], pe, pts[2], pe, 2)]
                : ticks2(pts[0], pts[2], pts[1], pts[3], 1);
          const other =
            kind === 0 ? (s1 === `${A}${B}` ? ticks2(pts[1], pts[2], pts[3], pts[0], 2) : ticks2(pts[0], pts[1], pts[2], pts[3], 2)) : [];
          const [mine, rest] = kind === 1 ? [equal.slice(0, 2), equal.slice(2)] : [equal, other];
          const rightAngles: Mark[] =
            kind === 2 ? [0, 1, 2, 3].map((i) => ({ kind: "right", vertex: pts[i]!, from: pts[(i + 1) % 4]!, to: pts[(i + 3) % 4]! })) : [];
          const both = `$${s1} = ${valueAt(p1, d1, x)} = ${v}$`;
          const both2 = `$${s2} = ${valueAt(p2, d2, x)} = ${v}$`;
          return {
            ...numberProblem({
              prompt: setting,
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [-x, intOr(d2 + d1, p1 - p2, x + 2), intOr(-d1 - d2, p1 + p2, x + 1)],
              solution: paras(
                step(1, "choose the condition", "选定条件", cat(reason, same("\n\n{{figure 0}}"))),
                step(2, "solve for x", "解出 x", t(`Collect the terms in $x$:${work}`, `合并含 $x$ 的项：${work}`)),
                check(
                  `With $x = ${x}$, ${both} and ${both2}: they are equal, as the criterion requires.`,
                  `当 $x = ${x}$ 时，${both}，${both2}，两者相等，满足判定条件。`,
                ),
              ),
            }),
            solutionFigures: [
              figure(
                [
                  ...quadMarks(pts, L, kind === 0 ? "none" : "both", kind === 0 ? undefined : E),
                  ...rest,
                  ...mine.flatMap(highlighted),
                  ...rightAngles,
                ],
                kind === 2
                  ? `Rectangle ${L}: the diagonals ${s1} and ${s2} are marked equal.`
                  : `Parallelogram ${L}: ${s1} and ${s2} are marked equal, completing the ${kind === 0 ? "pairs of opposite sides" : "halves of the diagonals"}.`,
                kind === 2
                  ? `矩形 ${L}：对角线 ${s1} 与 ${s2} 标为相等。`
                  : `平行四边形 ${L}：${s1} 与 ${s2} 标为相等，${kind === 0 ? "两组对边都相等" : "对角线的两半都相等"}。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Trigonometry

// ---------------------------------------------------------------------------
// Right triangles seen from an angle

/** sideIndex is the position, among RU, UV and VR, of a side seen from the angle at U (atU) or at V. */
const sideIndex = (role: Side, atU: boolean) => (role === "hyp" ? 1 : (role === "adj") === atU ? 0 : 2);

/** RoleView is a right triangle seen from the acute angle in play, at U or at V. */
interface RoleView {
  readonly tri: Tri;
  readonly atU: boolean;
  /** values are the labels written on the sides, by their role. */
  readonly values?: Partial<Record<Side, string>>;
  /** angle labels the arc of the angle in play. */
  readonly angle?: string;
  /** other, when given, labels the arc of the other acute angle. */
  readonly other?: string;
  /** letters name R, U and V. */
  readonly letters?: string;
  /** use are the sides a ratio uses, drawn over in the action tone (the first) and the result tone (the second). */
  readonly use?: readonly Side[];
}

/** roleMarks draws a right triangle seen from an angle, with the sides a ratio uses drawn over in colour. */
function roleMarks(v: RoleView): Mark[] {
  const [r, u, w] = v.tri;
  const ends: readonly (readonly [Point, Point])[] = [
    [r, u],
    [u, w],
    [w, r],
  ];
  const sides: [string | null, string | null, string | null] = [null, null, null];
  for (const role of ["opp", "adj", "hyp"] as const) {
    const value = v.values?.[role];
    if (value !== undefined) sides[sideIndex(role, v.atU)] = value;
  }
  const marks: Mark[] = [];
  (v.use ?? []).forEach((role, i) => {
    const [a, b] = ends[sideIndex(role, v.atU)]!;
    marks.push({ kind: "segment", a, b, tone: i === 0 ? "action" : "result" });
  });
  marks.push(
    ...rightMarks(v.tri, { sides, ...(v.letters && { letters: v.letters }), ...(v.atU ? { atU: v.angle ?? "" } : { atV: v.angle ?? "" }) }),
  );
  if (v.other !== undefined)
    marks.push({ kind: "arc", vertex: v.atU ? w : u, from: v.atU ? r : r, to: v.atU ? u : w, label: v.other || undefined });
  return marks;
}

const roleWords: Record<Side, Text> = {
  opp: t("opposite side", "对边"),
  adj: t("adjacent side", "邻边"),
  hyp: t("hypotenuse", "斜边"),
};

/** roleFigure draws a right triangle seen from an angle; its description names the opposite side, the adjacent side and the hypotenuse. */
function roleFigure(v: RoleView, theta: string): Figure {
  const [R, U, V] = v.letters ? (v.letters.split("") as [string, string, string]) : ["", "", ""];
  const name = (role: Side) => (v.letters ? ` ${[`${R}${U}`, `${U}${V}`, `${V}${R}`][sideIndex(role, v.atU)]}` : "");
  const value = (role: Side) => (v.values?.[role] !== undefined ? ` = ${v.values[role]}` : "");
  const part = (role: Side, l: "en" | "zh-CN") => `${roleWords[role][l]}${name(role)}${value(role)}`;
  const at = v.letters ? (v.atU ? U : V) : "";
  const used = v.use ?? [];
  return figure(
    roleMarks(v),
    `Right triangle${v.letters ? ` ${v.letters} with the right angle at ${R}` : ""}, seen from the angle ${theta}${at ? ` at ${at}` : ""}: ${part("opp", "en")}, ${part("adj", "en")}, ${part("hyp", "en")}.${used.length > 0 ? ` The ${used.map((r) => roleWords[r].en).join(" and the ")} are drawn in colour.` : ""}`,
    `直角三角形${v.letters ? ` ${v.letters}，直角在 ${R}` : ""}，从${at ? ` ${at} 处的` : ""}角 ${theta} 看：${part("opp", "zh-CN")}，${part("adj", "zh-CN")}，${part("hyp", "zh-CN")}。${used.length > 0 ? `${used.map((r) => roleWords[r]["zh-CN"]).join("和")}用颜色标出。` : ""}`,
  );
}

/** sqS is the square of an exact number. */
const sqS = (x: S) => x[0].mul(x[0]).mul(q(x[1]));

/** powTex writes the square of an exact number, in parentheses unless it is a whole number. */
const powTex = (x: S) => `${x[1] === 1 && x[0].isInteger() ? texS(x) : `(${texS(x)})`}^2`;

/** pythagCheck writes the check that three exact sides satisfy the Pythagorean theorem. */
function pythagCheck(r: Ratios, extra?: Text): Text {
  const [o, a, h] = [sqS(r.opp), sqS(r.adj), sqS(r.hyp)];
  const line = `${powTex(r.opp)} + ${powTex(r.adj)} = ${o.toLatex()} + ${a.toLatex()} = ${h.toLatex()} = ${powTex(r.hyp)}`;
  return check(
    `The legs and the hypotenuse fit the Pythagorean theorem: $${line}$.${extra ? ` ${extra.en}` : ""}`,
    `两条直角边和斜边满足勾股定理：$${line}$。${extra ? extra["zh-CN"] : ""}`,
  );
}

/** sizeNote says why a ratio is below or above 1: sine and cosine have the longest side, the hypotenuse, at the bottom. */
function sizeNote(f: Fn6, value: number): Text {
  if (f === "sin" || f === "cos") {
    return t(
      `And the ${fnNames[f].en} is less than $1$, as it must be, since the hypotenuse is the longest side.`,
      `并且${fnNames[f]["zh-CN"]}小于 $1$，理应如此，因为斜边是最长的边。`,
    );
  }
  if (f === "csc" || f === "sec") {
    return t(
      `And the ${fnNames[f].en} is greater than $1$, as it must be, since the hypotenuse is on top.`,
      `并且${fnNames[f]["zh-CN"]}大于 $1$，理应如此，因为分子是斜边。`,
    );
  }
  const [top, bottom] = f === "tan" ? [t("opposite", "对边"), t("adjacent", "邻边")] : [t("adjacent", "邻边"), t("opposite", "对边")];
  return value > 1
    ? t(`It is greater than $1$ because the ${top.en} leg is the longer one.`, `它大于 $1$，因为${top["zh-CN"]}是较长的直角边。`)
    : t(`It is less than $1$ because the ${bottom.en} leg is the longer one.`, `它小于 $1$，因为${bottom["zh-CN"]}是较长的直角边。`);
}

/** anglesIntro shows the right triangle DEF seen from its 40° angle at D. */
const anglesIntro = roleFigure(
  {
    tri: rightTri(Math.cos(rad(40)) * 5, Math.sin(rad(40)) * 5, { turn: 0, mirror: false }),
    atU: true,
    angle: "40°",
    other: "50°",
    letters: "FDE",
    use: ["opp", "adj"],
  },
  "40°",
);

export const anglesAndSidesInRightTriangles: TopicDef = {
  id: "angles-and-sides-in-right-triangles",
  title: t("Angles and Sides in Right Triangles", "直角三角形的边与角"),
  summary: t(
    "Name the opposite side, the adjacent side and the hypotenuse relative to an acute angle, and use that the acute angles are complementary.",
    "相对于一个锐角，指出它的对边、邻边和斜边，并运用两锐角互余。",
  ),
  prerequisites: ["the-pythagorean-theorem", "complementary-and-supplementary-angles"],
  encompasses: [
    { topic: "complementary-and-supplementary-angles", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.HSG.SRT.C.6"],
  intro: t(
    `The Pythagorean theorem links the three sides of a right triangle, and it calls the longest one, across from the right angle, the **hypotenuse**. Trigonometry will link the sides to the **angles** as well, and for that the two legs need names that say where they sit relative to an angle.

Take right triangle $DEF$ with the right angle at $F$ and an angle of $40^\\circ$ at $D$:

{{figure 0}}

Standing at $D$, the leg $EF$ is across the triangle: it is the **opposite side** of $\\angle D$. The leg $DF$ runs from $D$ to the right angle: it is the **adjacent side**. The hypotenuse $DE$ also touches $D$, but it keeps its own name. The angles fix one more fact: $40^\\circ + 90^\\circ + \\angle E = 180^\\circ$, so $\\angle E = 50^\\circ$.

Seen from $E$, the roles of the legs swap: $DF$ is opposite and $EF$ is adjacent. In this lesson we name the sides from either acute angle and find the acute angles from each other.`,
    `勾股定理把直角三角形的三条边联系起来，它把直角所对的最长边叫作**斜边**。三角学还要把边和**角**联系起来，为此两条直角边需要能说明它们相对于某个角位置的名称。

设直角三角形 $DEF$ 的直角在 $F$，$D$ 处的角为 $40^\\circ$：

{{figure 0}}

站在 $D$ 处看，直角边 $EF$ 在三角形的另一侧：它是 $\\angle D$ 的**对边**。直角边 $DF$ 从 $D$ 通向直角：它是**邻边**。斜边 $DE$ 也经过 $D$，但它保留自己的名称。角也随之确定：$40^\\circ + 90^\\circ + \\angle E = 180^\\circ$，所以 $\\angle E = 50^\\circ$。

从 $E$ 看，两条直角边的角色互换：$DF$ 是对边，$EF$ 是邻边。这节课从任一锐角出发给边命名，并由一个锐角求另一个锐角。`,
  ),
  introFigures: [anglesIntro],
  knowledgePoints: [
    {
      id: "naming-the-sides",
      figure: trigDrawings["naming-the-sides"],
      title: t("Opposite, adjacent and hypotenuse", "对边、邻边与斜边"),
      explanation: t(
        "In a right triangle, the **hypotenuse** is the side opposite the right angle. Seen from one of the acute angles, the two legs get names:\n\n- the **opposite side** is the leg across from the angle, the one that does not touch it;\n- the **adjacent side** is the leg that forms the angle together with the hypotenuse.\n\nThe names describe a point of view, so they depend on the angle. In right triangle $ABC$ with the right angle at $C$: seen from $\\angle A$, $BC$ is opposite and $AC$ is adjacent; seen from $\\angle B$ they swap: $AC$ is opposite and $BC$ is adjacent. The hypotenuse $AB$ is the same for both.\n\n> **Watch out.** Two sides touch an acute angle, the adjacent leg and the hypotenuse; the adjacent side is always the leg, never the hypotenuse. And a leg is not opposite or adjacent by itself: check which angle the question is about before naming it.",
        "直角三角形中，**斜边**是直角所对的边。从某个锐角来看，两条直角边各有名称：\n\n- **对边**是与这个角相对的直角边，即不经过这个角的顶点的那条；\n- **邻边**是与斜边一起组成这个角的直角边。\n\n这些名称描述的是观察的角度，所以随角而变。在直角三角形 $ABC$ 中，直角在 $C$：从 $\\angle A$ 看，$BC$ 是对边，$AC$ 是邻边；从 $\\angle B$ 看两者互换：$AC$ 是对边，$BC$ 是邻边。斜边 $AB$ 对两个角都一样。\n\n> **注意。** 经过一个锐角顶点的边有两条：邻边和斜边；邻边总是直角边，绝不是斜边。另外，一条直角边本身无所谓对边或邻边：命名之前先看清题目问的是哪个角。",
      ),
      generate(rng) {
        const [R, U, V] = pickTriLetters(rng);
        const atU = rng.bool();
        const [P, O] = atU ? [U, V] : [V, U];
        const kind = rng.pick(["opp", "adj", "opp", "adj", "hyp"] as const);
        const sides = [seg(R, U), seg(U, V), seg(R, V)].sort();
        const right = kind === "hyp" ? seg(U, V) : kind === "opp" ? seg(R, O) : seg(R, P);
        const question = {
          opp: t(`Which side is opposite $\\angle ${P}$?`, `哪条边是 $\\angle ${P}$ 的对边？`),
          adj: t(`Which side is adjacent to $\\angle ${P}$ (and is not the hypotenuse)?`, `哪条边是 $\\angle ${P}$ 的邻边（不是斜边）？`),
          hyp: t("Which side is the hypotenuse?", "哪条边是斜边？"),
        }[kind];
        const tri = rightTri(rng.int(3, 6), rng.int(3, 6), pickPose(rng));
        const letters = `${R}${U}${V}`;
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(
                `In right triangle $${R}${U}${V}$, the right angle is at $${R}$. ${question.en}`,
                `在直角三角形 $${R}${U}${V}$ 中，直角在 $${R}$。${question["zh-CN"]}`,
              ),
              options: sides.map((s) => same(`$${s}$`)),
              correct: sides.indexOf(right),
              solution: paras(
                step(
                  1,
                  "find the hypotenuse",
                  "找出斜边",
                  t(
                    `The hypotenuse is across from the right angle at $${R}$, so it is $${seg(U, V)}$, the side that does not touch $${R}$.${kind === "hyp" ? "\n\n{{figure 0}}" : ""}`,
                    `斜边与 $${R}$ 处的直角相对，所以是 $${seg(U, V)}$，即不经过 $${R}$ 的那条边。${kind === "hyp" ? "\n\n{{figure 0}}" : ""}`,
                  ),
                ),
                kind === "hyp"
                  ? check(
                      `$${seg(U, V)}$ is also the longest side in the figure, as a hypotenuse must be; the two legs $${seg(R, U)}$ and $${seg(R, V)}$ meet at the right angle.`,
                      `$${seg(U, V)}$ 也是图中最长的边，斜边理应如此；两条直角边 $${seg(R, U)}$ 与 $${seg(R, V)}$ 相交于直角。`,
                    )
                  : step(
                      2,
                      `look from angle ${P}`,
                      `从角 ${P} 看`,
                      t(
                        `The two legs are $${seg(R, P)}$ and $${seg(R, O)}$. The leg $${seg(R, P)}$ runs from $${P}$ to the right angle, so it is adjacent to $\\angle ${P}$; the leg $${seg(R, O)}$ does not touch $${P}$, so it is opposite:\n\n{{figure 0}}`,
                        `两条直角边是 $${seg(R, P)}$ 和 $${seg(R, O)}$。直角边 $${seg(R, P)}$ 从 $${P}$ 通向直角，所以是 $\\angle ${P}$ 的邻边；直角边 $${seg(R, O)}$ 不经过 $${P}$，所以是对边：\n\n{{figure 0}}`,
                      ),
                    ),
                ...(kind === "hyp"
                  ? []
                  : [
                      check(
                        `The three sides get three different names from $\\angle ${P}$: $${seg(R, O)}$ opposite, $${seg(R, P)}$ adjacent and $${seg(U, V)}$ the hypotenuse. So the answer is $${right}$.`,
                        `从 $\\angle ${P}$ 看，三条边名称各不相同：$${seg(R, O)}$ 是对边，$${seg(R, P)}$ 是邻边，$${seg(U, V)}$ 是斜边。所以答案是 $${right}$。`,
                      ),
                    ]),
              ),
            }),
            figure: figure(
              rightMarks(tri, { letters, ...(atU ? { atU: "" } : { atV: "" }) }),
              `Right triangle ${R}${U}${V} with the right angle at ${R} and angle ${P} marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，标出了角 ${P}。`,
            ),
            solutionFigures: [roleFigure({ tri, atU, letters, use: kind === "hyp" ? [] : [kind === "opp" ? "adj" : "opp", kind] }, P)],
          },
          [
            [`$${seg(U, V)}$`, "This is the hypotenuse, across from the right angle.", "这是斜边，与直角相对。"],
            [`$${seg(R, O)}$`, `This is the leg across from $\\angle ${P}$.`, `这是与 $\\angle ${P}$ 相对的直角边。`],
            [`$${seg(R, P)}$`, `This is the leg that helps form $\\angle ${P}$.`, `这是构成 $\\angle ${P}$ 的直角边。`],
          ],
        );
      },
    },
    {
      id: "the-other-acute-angle",
      figure: trigDrawings["the-other-acute-angle"],
      title: t("The other acute angle", "另一个锐角"),
      explanation: t(
        "The angles of a triangle add up to $180^\\circ$ and the right angle takes $90^\\circ$, so the two acute angles of a right triangle share the remaining $90^\\circ$: they are **complementary**. If one acute angle is $35^\\circ$, the other is\n\n$$90^\\circ - 35^\\circ = 55^\\circ,$$\n\nand indeed $35^\\circ + 55^\\circ + 90^\\circ = 180^\\circ$. The larger acute angle sits across from the longer leg.\n\n> **Watch out.** Subtract from $90^\\circ$, not from $180^\\circ$: $180^\\circ - 35^\\circ = 145^\\circ$ forgets the right angle, and no angle of a right triangle other than the right angle can reach $90^\\circ$.",
        "三角形内角和是 $180^\\circ$，直角占了 $90^\\circ$，所以直角三角形的两个锐角分享剩下的 $90^\\circ$：它们**互余**。若一个锐角是 $35^\\circ$，另一个就是\n\n$$90^\\circ - 35^\\circ = 55^\\circ,$$\n\n验证：$35^\\circ + 55^\\circ + 90^\\circ = 180^\\circ$。较大的锐角对着较长的直角边。\n\n> **注意。** 要用 $90^\\circ$ 去减，而不是 $180^\\circ$：$180^\\circ - 35^\\circ = 145^\\circ$ 忘了直角；直角三角形中除直角外，没有哪个角能达到 $90^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(22, 68);
        const atU = rng.bool();
        const [p, qq] = [Math.cos(rad(a)), Math.sin(rad(a))];
        const tri = atU ? rightTri(p, qq, pickPose(rng)) : rightTri(qq, p, pickPose(rng));
        const marks = (x: string) => rightMarks(tri, atU ? { atU: `${a}°`, atV: x } : { atV: `${a}°`, atU: x });
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: 90 - a,
            form: "integer",
            unit: "°",
            wrong: [180 - a, 90 + a, a],
            solution: paras(
              step(
                1,
                "share out the angle sum",
                "分配内角和",
                t(
                  `The three angles add up to $180^\\circ$ and the right angle takes $90^\\circ$, so the two acute angles add up to $90^\\circ$:${steps(`${a}^\\circ + x = 90^\\circ`)}`,
                  `三个角之和是 $180^\\circ$，直角占 $90^\\circ$，所以两个锐角之和是 $90^\\circ$：${steps(`${a}^\\circ + x = 90^\\circ`)}`,
                ),
              ),
              step(
                2,
                "subtract",
                "相减",
                t(
                  `Take $${a}^\\circ$ away from both sides:${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}{{figure 0}}`,
                  `两边同时减去 $${a}^\\circ$：${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}{{figure 0}}`,
                ),
              ),
              check(
                `All three angles: $${a}^\\circ + ${90 - a}^\\circ + 90^\\circ = 180^\\circ$. The larger acute angle faces the longer leg, as in the figure.`,
                `三个角相加：$${a}^\\circ + ${90 - a}^\\circ + 90^\\circ = 180^\\circ$。较大的锐角对着较长的直角边，与图一致。`,
              ),
            ),
          }),
          figure: figure(marks("x°"), `A right triangle with acute angles ${a}° and x°.`, `一个直角三角形，两个锐角为 ${a}° 和 x°。`),
          solutionFigures: [
            figure(
              [
                ...marks(""),
                {
                  kind: "arc",
                  vertex: atU ? tri[2] : tri[1],
                  from: atU ? tri[1] : tri[2],
                  to: tri[0],
                  label: `${90 - a}°`,
                  tone: "result",
                },
              ],
              `The right triangle with acute angles ${a}° and ${90 - a}°.`,
              `直角三角形，两个锐角为 ${a}° 和 ${90 - a}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "acute-angles-as-expressions",
      figure: trigDrawings["acute-angles-as-expressions"],
      title: t("Acute angles as expressions", "用代数式表示的锐角"),
      explanation: t(
        "The rule that the acute angles add up to $90^\\circ$ holds whatever they are, so when they are written with $x$ it becomes an equation. If they are $(2x + 6)^\\circ$ and $(4x - 12)^\\circ$:\n\n$$(2x + 6) + (4x - 12) = 90, \\qquad 6x - 6 = 90, \\qquad x = 16.$$\n\nThe angles are $2 \\cdot 16 + 6 = 38^\\circ$ and $4 \\cdot 16 - 12 = 52^\\circ$, which indeed add up to $90^\\circ$.\n\n> **Watch out.** The sum of the two acute angles is $90^\\circ$, not $180^\\circ$; using $180$ counts the right angle's share twice. And $x$ is not an angle: substitute it into both expressions to get the angles.",
        "两个锐角之和为 $90^\\circ$，无论它们是多少都成立，所以当它们用 $x$ 表示时，就得到一个方程。若两角为 $(2x + 6)^\\circ$ 和 $(4x - 12)^\\circ$：\n\n$$(2x + 6) + (4x - 12) = 90, \\qquad 6x - 6 = 90, \\qquad x = 16.$$\n\n两角为 $2 \\cdot 16 + 6 = 38^\\circ$ 和 $4 \\cdot 16 - 12 = 52^\\circ$，确实和为 $90^\\circ$。\n\n> **注意。** 两个锐角之和是 $90^\\circ$，不是 $180^\\circ$；用 $180$ 等于把直角的那一份重复算了。另外 $x$ 不是角：把它代入两个式子才得到角的大小。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(30, 60);
          const x = rng.int(3, 20);
          const [p1, p2] = [rng.int(1, 4), rng.int(1, 4)];
          const d1 = a - p1 * x;
          const d2 = 90 - a - p2 * x;
          if (Math.abs(d1) > 40 || Math.abs(d2) > 40 || d1 === 0 || d2 === 0) continue;
          const [p, qq] = [Math.cos(rad(a)), Math.sin(rad(a))];
          const [R, U, V] = pickTriLetters(rng);
          const tri = rightTri(p, qq, pickPose(rng));
          const work = chain(
            `(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`,
            `${linear(p1 + p2, d1 + d2)} = 90`,
            `${linear(p1 + p2, 0)} = ${90 - d1 - d2}`,
            `x = ${x}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In right triangle $${R}${U}${V}$ with the right angle at $${R}$, $\\angle ${U} = ${angleTex(p1, d1)}$ and $\\angle ${V} = ${angleTex(p2, d2)}$. Find $x$.`,
                `在直角三角形 $${R}${U}${V}$ 中，直角在 $${R}$，$\\angle ${U} = ${angleTex(p1, d1)}$，$\\angle ${V} = ${angleTex(p2, d2)}$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(180 - d1 - d2, p1 + p2, x + 1), intOr(d2 - d1, p1 - p2, x - 1), a],
              solution: paras(
                step(
                  1,
                  "set up the equation",
                  "列方程",
                  t(
                    `$\\angle ${U}$ and $\\angle ${V}$ are the two acute angles of the right triangle, so they are complementary: their sum is $90^\\circ$.`,
                    `$\\angle ${U}$ 与 $\\angle ${V}$ 是直角三角形的两个锐角，所以互余：它们的和是 $90^\\circ$。`,
                  ),
                ),
                step(2, "solve for x", "解出 x", t(`Collect like terms:${work}`, `合并同类项：${work}`)),
                check(
                  `With $x = ${x}$, $\\angle ${U} = ${valueAt(p1, d1, x)} = ${a}^\\circ$ and $\\angle ${V} = ${valueAt(p2, d2, x)} = ${90 - a}^\\circ$; both are acute and $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$.\n\n{{figure 0}}`,
                  `当 $x = ${x}$ 时，$\\angle ${U} = ${valueAt(p1, d1, x)} = ${a}^\\circ$，$\\angle ${V} = ${valueAt(p2, d2, x)} = ${90 - a}^\\circ$；两者都是锐角，且 $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$。\n\n{{figure 0}}`,
                ),
              ),
            }),
            figure: figure(
              rightMarks(tri, { atU: "", atV: "", letters: `${R}${U}${V}` }),
              `Right triangle ${R}${U}${V} with the right angle at ${R} and the acute angles at ${U} and ${V} marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，标出了 ${U}、${V} 处的锐角。`,
            ),
            solutionFigures: [
              figure(
                rightMarks(tri, { atU: `${a}°`, atV: `${90 - a}°`, letters: `${R}${U}${V}` }),
                `Right triangle ${R}${U}${V}: the angle at ${U} is ${a}° and the angle at ${V} is ${90 - a}°.`,
                `直角三角形 ${R}${U}${V}：${U} 处的角为 ${a}°，${V} 处的角为 ${90 - a}°。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** RatioSetup is a right triangle with whole-number sides, letters, and the acute angle P the ratios are taken from. */
interface RatioSetup {
  readonly R: string;
  readonly U: string;
  readonly V: string;
  /** P names the angle; atU tells whether it is at U. */
  readonly P: string;
  readonly atU: boolean;
  /** a = RU, b = RV, c = UV. */
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly opp: number;
  readonly adj: number;
  /** tri places the triangle, so that the problem and its solution draw it alike. */
  readonly tri: Tri;
}

/** ratioSetup draws a right triangle with Pythagorean sides and picks the angle. */
function ratioSetup(rng: Rng, max = 45): RatioSetup {
  const [a, b, c] = pickTriple(rng, max);
  const [R, U, V] = pickTriLetters(rng);
  const atU = rng.bool();
  return { R, U, V, P: atU ? U : V, atU, a, b, c, opp: atU ? b : a, adj: atU ? a : b, tri: rightTri(a, b, pickPose(rng)) };
}

/** ratioFigure draws a ratio setup with all three sides labeled and the angle marked. */
function ratioFigure(s: RatioSetup, angle = true): Figure {
  const labels = [`${s.a}`, `${s.c}`, `${s.b}`] as const;
  return figure(
    rightMarks(s.tri, { sides: labels, letters: `${s.R}${s.U}${s.V}`, ...(angle ? (s.atU ? { atU: "" } : { atV: "" }) : {}) }),
    `Right triangle ${s.R}${s.U}${s.V} with the right angle at ${s.R}: ${s.R}${s.U} = ${s.a}, ${s.U}${s.V} = ${s.c}, ${s.V}${s.R} = ${s.b}.${angle ? ` Angle ${s.P} is marked.` : ""}`,
    `直角三角形 ${s.R}${s.U}${s.V}，直角在 ${s.R}：${s.R}${s.U} = ${s.a}，${s.U}${s.V} = ${s.c}，${s.V}${s.R} = ${s.b}。${angle ? `标出了角 ${s.P}。` : ""}`,
  );
}

/** setupView is the solution figure of a ratio setup seen from the angle at P, with the sides of a ratio in colour. */
const setupView = (s: RatioSetup, P: string, use: readonly Side[]) => {
  const atU = P === s.U;
  const [opp, adj] = atU ? [s.b, s.a] : [s.a, s.b];
  return roleFigure({ tri: s.tri, atU, letters: `${s.R}${s.U}${s.V}`, values: { opp: `${opp}`, adj: `${adj}`, hyp: `${s.c}` }, use }, P);
};

/** sideValue is the length of a side of a ratio setup. */
const sideValue = (s: RatioSetup, side: Side) => (side === "opp" ? s.opp : side === "adj" ? s.adj : s.c);

/** wholeRatioProblem asks for a ratio of the marked angle as a fraction. */
function wholeRatioProblem(rng: Rng, f: Fn6): Problem {
  const s = ratioSetup(rng);
  const [n, d] = fnSides[f];
  const answer = q(sideValue(s, n), sideValue(s, d));
  const value = (g: Fn6) => q(sideValue(s, fnSides[g][0]), sideValue(s, fnSides[g][1]));
  const wrong = (["sin", "cos", "tan", "csc", "sec", "cot"] as const).filter((g) => g !== f).map(value);
  const sides = { opp: `${s.opp}`, adj: `${s.adj}`, hyp: `${s.c}` };
  const raw = `\\frac{${sideValue(s, n)}}{${sideValue(s, d)}}`;
  const reduced = raw === answer.toLatex() ? "" : ` = ${answer.toLatex()}`;
  return {
    ...numberProblem({
      prompt: t(`Find $\\${f} ${s.P}$. Give your answer as a fraction in lowest terms.`, `求 $\\${f} ${s.P}$。答案写成最简分数。`),
      answer,
      form: "fraction",
      wrong,
      solution: paras(
        step(
          1,
          `name the sides from angle ${s.P}`,
          `从角 ${s.P} 给边命名`,
          t(
            `The hypotenuse is $${s.c}$, across from the right angle. Of the legs, $${s.opp}$ does not touch $${s.P}$, so it is opposite, and $${s.adj}$ runs from $${s.P}$ to the right angle, so it is adjacent:\n\n{{figure 0}}`,
            `斜边是 $${s.c}$，与直角相对。两条直角边中，$${s.opp}$ 不经过 $${s.P}$，是对边；$${s.adj}$ 从 $${s.P}$ 通向直角，是邻边：\n\n{{figure 0}}`,
          ),
        ),
        step(
          2,
          "form the ratio",
          "写出比",
          t(
            `The ${fnNames[f].en} is ${sideNames[n].en} over ${sideNames[d].en}${reduced ? "; reduce to lowest terms" : ", already in lowest terms"}:${steps(`${ratioTex(f, s.P, sides)}${reduced}`)}`,
            `${fnNames[f]["zh-CN"]}等于${sideNames[n]["zh-CN"]}比${sideNames[d]["zh-CN"]}${reduced ? "，再约成最简分数" : "，已是最简分数"}：${steps(`${ratioTex(f, s.P, sides)}${reduced}`)}`,
          ),
        ),
        pythagCheck({ opp: int(s.opp), adj: int(s.adj), hyp: int(s.c) }, sizeNote(f, answer.toNumber())),
      ),
    }),
    figure: ratioFigure(s),
    solutionFigures: [setupView(s, s.P, [n, d])],
  };
}

const sohcahtoa = t(
  "The three **trigonometric ratios** of an acute angle $\\theta$ in a right triangle are\n\n$$\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\qquad \\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}, \\qquad \\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}.$$\n\nA way to remember them is SOH-CAH-TOA.",
  "直角三角形中锐角 $\\theta$ 的三个**三角比**是\n\n$$\\sin \\theta = \\frac{\\text{对边}}{\\text{斜边}}, \\qquad \\cos \\theta = \\frac{\\text{邻边}}{\\text{斜边}}, \\qquad \\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}}.$$\n\n分别读作正弦、余弦、正切。",
);

/** ratiosIntro draws two similar right triangles, 3-4-5 and 9-12-15, with the same angle marked. */
const ratiosIntro: Figure = (() => {
  const small = rightTri(4, 3, { turn: 0, mirror: false });
  const big = rightTri(12, 9, { turn: 0, mirror: false }).map(([x, y]) => [x + 6, y] as Point) as unknown as Tri;
  return figure(
    [
      ...roleMarks({ tri: small, atU: true, values: { opp: "3", adj: "4", hyp: "5" }, angle: "θ", use: ["opp", "hyp"] }),
      ...roleMarks({ tri: big, atU: true, values: { opp: "9", adj: "12", hyp: "15" }, angle: "θ", use: ["opp", "hyp"] }),
    ],
    "Two right triangles with the same angle θ: sides 3, 4, 5 and sides 9, 12, 15. In both the side opposite θ and the hypotenuse are drawn in colour.",
    "两个有相同角 θ 的直角三角形：三边为 3、4、5 和 9、12、15。两者中 θ 的对边和斜边都用颜色标出。",
  );
})();

export const theTrigonometricRatios: TopicDef = {
  id: "the-trigonometric-ratios",
  title: t("The Trigonometric Ratios", "三角比"),
  summary: t(
    "Find the sine, cosine and tangent of an acute angle in a right triangle as ratios of its sides.",
    "把直角三角形中锐角的正弦、余弦、正切表示为边的比。",
  ),
  prerequisites: ["angles-and-sides-in-right-triangles", "ratios"],
  encompasses: [
    { topic: "angles-and-sides-in-right-triangles", weight: 0.4 },
    { topic: "ratios", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.6"],
  intro: t(
    `We can name the sides of a right triangle from an acute angle: opposite, adjacent and hypotenuse. Here is why that pays off. Two right triangles with the same acute angle $\\theta$ are similar (they agree in two angles), so their sides are in proportion, even when the triangles differ in size:

{{figure 0}}

In the small triangle the side opposite $\\theta$ is $3$ and the hypotenuse is $5$; in the large one they are $9$ and $15$. The lengths differ, but the ratio does not:

$$\\frac{3}{5} = \\frac{9}{15} = 0.6.$$

So the ratio of two sides depends only on the angle, not on the triangle. These ratios get names, the sine, the cosine and the tangent, and they let us go between angles and lengths: later we use them to find sides and angles that cannot be measured directly. In this lesson we read the three ratios off a triangle.`,
    `我们已经会从一个锐角出发给直角三角形的边命名：对边、邻边和斜边。这样做的好处在于：有相同锐角 $\\theta$ 的两个直角三角形相似（两个角对应相等），所以即使大小不同，它们的边也成比例：

{{figure 0}}

小三角形中 $\\theta$ 的对边是 $3$，斜边是 $5$；大三角形中分别是 $9$ 和 $15$。长度不同，比值却相同：

$$\\frac{3}{5} = \\frac{9}{15} = 0.6.$$

所以两边之比只取决于角，与三角形的大小无关。这些比有各自的名称：正弦、余弦和正切。借助它们可以在角和长度之间互相换算：以后会用它们求无法直接测量的边和角。这节课先从三角形中读出这三个比。`,
  ),
  introFigures: [ratiosIntro],
  knowledgePoints: [
    {
      id: "the-sine",
      figure: trigDrawings["the-sine"],
      title: t("The sine", "正弦"),
      explanation: t(
        `${sohcahtoa.en}\n\nThe **sine** compares the side opposite the angle with the hypotenuse. In a right triangle with legs $5$ and $12$ and hypotenuse $13$, the angle $\\theta$ opposite the leg $5$ has\n\n$$\\sin \\theta = \\frac{5}{13}.$$\n\nWrite the ratio as a fraction in lowest terms: with sides $6$, $8$, $10$, the sine of the angle opposite $6$ is $\\frac{6}{10} = \\frac{3}{5}$, the same as in a $3$-$4$-$5$ triangle, as similar triangles must give.\n\n> **Watch out.** The sine uses the hypotenuse at the bottom. Opposite over adjacent is the tangent, and adjacent over hypotenuse is the cosine. Also check the point of view: from the other acute angle, the opposite leg is a different side.`,
        `${sohcahtoa["zh-CN"]}\n\n**正弦**把角的对边与斜边相比。直角边为 $5$ 和 $12$、斜边为 $13$ 的直角三角形中，与直角边 $5$ 相对的角 $\\theta$ 满足\n\n$$\\sin \\theta = \\frac{5}{13}.$$\n\n比值写成最简分数：三边为 $6$、$8$、$10$ 时，与 $6$ 相对的角的正弦是 $\\frac{6}{10} = \\frac{3}{5}$，与 $3$-$4$-$5$ 三角形相同，相似三角形理应如此。\n\n> **注意。** 正弦的分母是斜边。对边比邻边是正切，邻边比斜边是余弦。还要看清从哪个角看：换成另一个锐角，对边就是另一条边了。`,
      ),
      generate: (rng) => wholeRatioProblem(rng, "sin"),
    },
    {
      id: "the-cosine",
      figure: trigDrawings["the-cosine"],
      title: t("The cosine", "余弦"),
      explanation: t(
        "The **cosine** is the adjacent side over the hypotenuse: it measures how much of the hypotenuse lies along the leg at the angle. In the triangle with legs $5$ and $12$ and hypotenuse $13$, the angle $\\theta$ opposite $5$ has adjacent side $12$, so\n\n$$\\cos \\theta = \\frac{12}{13}.$$\n\nThe hypotenuse is always the denominator of the sine and the cosine, and it is the longest side, so both are less than $1$.\n\n> **Watch out.** The adjacent side is the leg at the angle, not the hypotenuse, although both touch the angle. Putting the opposite leg on top gives the sine instead.",
        "**余弦**是邻边比斜边：它衡量斜边有多少落在这个角的直角边方向上。在直角边为 $5$ 和 $12$、斜边为 $13$ 的三角形中，与 $5$ 相对的角 $\\theta$ 的邻边是 $12$，所以\n\n$$\\cos \\theta = \\frac{12}{13}.$$\n\n正弦和余弦的分母都是斜边，而斜边是最长的边，所以两者都小于 $1$。\n\n> **注意。** 邻边是这个角处的直角边，不是斜边，尽管两者都经过这个角的顶点。把对边放在分子上得到的是正弦。",
      ),
      generate: (rng) => wholeRatioProblem(rng, "cos"),
    },
    {
      id: "the-tangent",
      figure: trigDrawings["the-tangent"],
      title: t("The tangent", "正切"),
      explanation: t(
        "The **tangent** uses only the legs: opposite over adjacent, like the slope of the hypotenuse, rise over run, when the adjacent leg lies flat. For the angle $\\theta$ opposite $5$ in the $5$-$12$-$13$ triangle,\n\n$$\\tan \\theta = \\frac{5}{12},$$\n\nand for the other acute angle the legs swap: its tangent is $\\frac{12}{5}$. A tangent can be greater than $1$: it is, whenever the opposite leg is the longer one.\n\n> **Watch out.** Keep the opposite leg on top. Adjacent over opposite is the tangent of the other acute angle, not of this one; and the hypotenuse never appears in the tangent.",
        "**正切**只用两条直角边：对边比邻边；当邻边水平放置时，它就像斜边的斜率，即竖直变化比水平变化。在 $5$-$12$-$13$ 三角形中，与 $5$ 相对的角 $\\theta$ 有\n\n$$\\tan \\theta = \\frac{5}{12},$$\n\n而另一个锐角的两条直角边互换，它的正切是 $\\frac{12}{5}$。正切可以大于 $1$：只要对边是较长的直角边，就会大于 $1$。\n\n> **注意。** 对边要放在分子上。邻边比对边是另一个锐角的正切，不是这个角的；正切里也不会出现斜边。",
      ),
      generate: (rng) => wholeRatioProblem(rng, (["sin", "cos", "tan", "tan"] as const)[rng.int(0, 3)]!),
    },
    {
      id: "naming-the-ratio",
      figure: geometryDrawings2["the-trigonometric-ratios#naming-the-ratio"],
      title: t("Which ratio is it?", "是哪个三角比？"),
      explanation: t(
        "A fraction of two sides is not a ratio until we say from which angle we look. To recognize it, take each acute angle in turn and ask which roles the two sides play. In right triangle $ABC$ with the right angle at $C$, $\\frac{BC}{AB}$ is opposite over hypotenuse for $\\angle A$, so it is $\\sin A$; for $\\angle B$, $BC$ is adjacent, so the same fraction is $\\cos B$. In the same way $\\frac{AC}{BC} = \\tan B = \\frac{1}{\\tan A}$.\n\n> **Watch out.** The same fraction can be a ratio of either acute angle, under different names: $\\sin A = \\cos B$. Name the sides from the angle in the option, not from the angle you looked at first.",
        "两边之比要说明是从哪个角看，才成为三角比。辨认时，依次从每个锐角出发，看这两条边分别是什么边。在直角三角形 $ABC$ 中，直角在 $C$，对 $\\angle A$ 而言 $\\frac{BC}{AB}$ 是对边比斜边，所以是 $\\sin A$；对 $\\angle B$ 而言 $BC$ 是邻边，所以同一个分数是 $\\cos B$。同理 $\\frac{AC}{BC} = \\tan B = \\frac{1}{\\tan A}$。\n\n> **注意。** 同一个分数可以是任一锐角的三角比，只是名称不同：$\\sin A = \\cos B$。要从选项中的那个角出发给边命名，而不是从你最先看的角出发。",
      ),
      generate(rng) {
        const s = ratioSetup(rng);
        const Q2 = s.atU ? s.V : s.U;
        const options = [
          { f: "sin" as Fn, at: s.P, v: [s.opp, s.c] },
          { f: "cos" as Fn, at: s.P, v: [s.adj, s.c] },
          { f: "tan" as Fn, at: s.P, v: [s.opp, s.adj] },
          { f: "tan" as Fn, at: Q2, v: [s.adj, s.opp] },
        ];
        const k = rng.int(0, 3);
        const pick = options[k]!;
        const [ns, ds] = fnSides[pick.f];
        const frac = (v: readonly number[]) => `\\frac{${v[0]}}{${v[1]}}`;
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(`Which ratio equals $${frac(pick.v)}$?`, `哪个三角比等于 $${frac(pick.v)}$？`),
              options: options.map((o) => same(`$\\${o.f} ${o.at}$`)),
              correct: k,
              solution: paras(
                step(
                  1,
                  `name the sides from angle ${pick.at}`,
                  `从角 ${pick.at} 给边命名`,
                  t(
                    `Seen from $\\angle ${pick.at}$, $${pick.v[0]}$ is ${sideNames[ns].en} and $${pick.v[1]}$ is ${sideNames[ds].en}:\n\n{{figure 0}}`,
                    `从 $\\angle ${pick.at}$ 看，$${pick.v[0]}$ 是${sideNames[ns]["zh-CN"]}，$${pick.v[1]}$ 是${sideNames[ds]["zh-CN"]}：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "name the ratio",
                  "说出三角比",
                  t(
                    `${cap(sideNames[ns].en)} over ${sideNames[ds].en} is the ${fnNames[pick.f].en}, so $${frac(pick.v)} = \\${pick.f} ${pick.at}$.`,
                    `${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}是${fnNames[pick.f]["zh-CN"]}，所以 $${frac(pick.v)} = \\${pick.f} ${pick.at}$。`,
                  ),
                ),
                check(
                  `The sides fit: $${s.a}^2 + ${s.b}^2 = ${s.a * s.a} + ${s.b * s.b} = ${s.c * s.c} = ${s.c}^2$, so $${s.c}$ is the hypotenuse, and $${frac(pick.v)}$ is ${pick.v[0]! < pick.v[1]! ? "less" : "greater"} than $1$, as ${sideNames[ns].en} over ${sideNames[ds].en} is here.`,
                  `三边吻合：$${s.a}^2 + ${s.b}^2 = ${s.a * s.a} + ${s.b * s.b} = ${s.c * s.c} = ${s.c}^2$，所以 $${s.c}$ 是斜边；$${frac(pick.v)}$ ${pick.v[0]! < pick.v[1]! ? "小于" : "大于"} $1$，与这里的${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}一致。`,
                ),
              ),
            }),
            options.map((o) => {
              const [n2, d2] = fnSides[o.f];
              return [
                `$\\${o.f} ${o.at}$`,
                `Seen from $\\angle ${o.at}$ it is ${sideNames[n2].en} over ${sideNames[d2].en}, $${frac(o.v)}$.`,
                `从 $\\angle ${o.at}$ 看，它是${sideNames[n2]["zh-CN"]}比${sideNames[d2]["zh-CN"]}，即 $${frac(o.v)}$。`,
              ] as const;
            }),
          ),
          figure: ratioFigure(s, false),
          solutionFigures: [setupView(s, pick.at, [ns, ds])],
        };
      },
    },
  ],
};

/** exactRatioWrong are wrong responses for an exact ratio n / d: the reciprocal and the unrationalized fraction. */
function exactRatioWrong(n: S, d: S, rawN: string, rawD: string): string[] {
  const out = [texS(divS(d, n))];
  if (d[1] !== 1) out.push(`\\frac{${rawN}}{${rawD}}`);
  return out;
}

/** squaresCheck writes the check sin² + cos² = 1 for exact sides over the hypotenuse h, given as √n. */
function squaresCheck(top: S, other: S, n: number, f: Fn): Text {
  const pair = f === "sin" ? t("cosine", "余弦") : t("sine", "正弦");
  const [a, b] = [sqS(top).toLatex(), sqS(other).toLatex()];
  const line = `\\frac{${a}}{${n}} + \\frac{${b}}{${n}} = \\frac{${n}}{${n}} = 1`;
  return check(
    `The ${pair.en} of the same angle is $\\frac{${texS(other)}}{\\sqrt{${n}}}$, and the squares of the sine and the cosine must add up to $1$: $${line}$. ${sizeNote(f, 0).en}`,
    `同一个角的${pair["zh-CN"]}是 $\\frac{${texS(other)}}{\\sqrt{${n}}}$，而正弦与余弦的平方和必须是 $1$：$${line}$。${sizeNote(f, 0)["zh-CN"]}`,
  );
}

/** pythagorasIntro draws the isosceles right triangle with legs 1 and 1 seen from a 45° angle. */
const pythagorasIntro = roleFigure(
  {
    tri: rightTri(4, 4, { turn: 0, mirror: false }),
    atU: true,
    values: { opp: "1", adj: "1", hyp: "√2" },
    angle: "45°",
    use: ["opp", "hyp"],
  },
  "45°",
);

export const calculatingTrigonometricRatiosUsingThePythagoreanTheorem: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
  title: t("Calculating Trigonometric Ratios Using the Pythagorean Theorem", "用勾股定理求三角比"),
  summary: t(
    "Find a missing side with the Pythagorean theorem, then give a trigonometric ratio exactly in simplest radical form.",
    "用勾股定理求出缺少的边，再把三角比写成精确的最简根式。",
  ),
  prerequisites: ["the-trigonometric-ratios", "rationalizing-denominators"],
  encompasses: [
    { topic: "the-trigonometric-ratios", weight: 0.5 },
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "rationalizing-denominators", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.6", "CCSS.HSG.SRT.C.8"],
  intro: t(
    `Every trigonometric ratio uses two sides of a right triangle. Often only two sides are given, and the ratio we want needs the third. The Pythagorean theorem supplies it, since any two sides of a right triangle fix the third.

Take the right triangle with both legs $1$, so both acute angles are $45^\\circ$:

{{figure 0}}

The hypotenuse is $\\sqrt{1^2 + 1^2} = \\sqrt{2}$, so

$$\\sin 45^\\circ = \\frac{1}{\\sqrt{2}} = \\frac{1}{\\sqrt{2}} \\cdot \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2} \\approx 0.707.$$

The value is exact: no measuring and no rounding. The last step rationalizes the denominator, which is how exact ratios are written. In this lesson we find a missing hypotenuse or a missing leg before taking a ratio, and we find every ratio of an angle from one that is given.`,
    `每个三角比都用到直角三角形的两条边。题目往往只给出两条边，而所求的比却需要第三条边。勾股定理可以提供它，因为直角三角形的任意两条边确定第三条边。

取两条直角边都为 $1$ 的直角三角形，它的两个锐角都是 $45^\\circ$：

{{figure 0}}

斜边是 $\\sqrt{1^2 + 1^2} = \\sqrt{2}$，所以

$$\\sin 45^\\circ = \\frac{1}{\\sqrt{2}} = \\frac{1}{\\sqrt{2}} \\cdot \\frac{\\sqrt{2}}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2} \\approx 0.707.$$

这个值是精确的：不用测量，也没有四舍五入。最后一步把分母有理化，精确的三角比都这样书写。这节课先求出缺少的斜边或直角边再求三角比，并由已知的一个三角比求出这个角的其他三角比。`,
  ),
  introFigures: [pythagorasIntro],
  knowledgePoints: [
    {
      id: "ratios-with-a-missing-hypotenuse",
      figure: trigDrawings["ratios-with-a-missing-hypotenuse"],
      title: t("A missing hypotenuse", "缺少斜边"),
      explanation: t(
        "If only the legs are known, the sine and the cosine still need the hypotenuse, so find it first with the Pythagorean theorem. With legs $2$ and $4$: $c = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$. For the angle $\\theta$ opposite the leg $2$,\n\n$$\\sin \\theta = \\frac{2}{2\\sqrt{5}} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}.$$\n\nGive exact ratios in simplest radical form, with a rational denominator.\n\n> **Watch out.** The hypotenuse is $\\sqrt{a^2 + b^2}$, not $a + b$: square, add, then take the root. Keep the ratio the right way up (the hypotenuse at the bottom of the sine and the cosine), and rationalize the denominator.",
        "若只知道两条直角边，正弦和余弦仍然需要斜边，所以先用勾股定理求出斜边。直角边为 $2$ 和 $4$ 时：$c = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$。与直角边 $2$ 相对的角 $\\theta$ 有\n\n$$\\sin \\theta = \\frac{2}{2\\sqrt{5}} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}.$$\n\n精确的三角比写成最简根式，分母要有理化。\n\n> **注意。** 斜边是 $\\sqrt{a^2 + b^2}$，不是 $a + b$：先平方、再相加、最后开方。比不能上下颠倒（正弦和余弦的分母是斜边），分母要有理化。",
      ),
      keyPrerequisites: ["the-pythagorean-theorem"],
      generate(rng) {
        for (;;) {
          const a = rng.int(1, 12);
          const b = rng.int(1, 12);
          if (a === b) continue;
          const n = a * a + b * b;
          const [R, U, V] = pickTriLetters(rng);
          const atU = rng.bool();
          const P = atU ? U : V;
          const [opp, adj] = atU ? [b, a] : [a, b];
          const f = rng.pick(["sin", "cos"] as const);
          const hyp = sqrtS(n);
          const top = f === "sin" ? opp : adj;
          const answer = divS(int(top), hyp);
          const tri = rightTri(a, b, pickPose(rng));
          const letters = `${R}${U}${V}`;
          const raw = `\\frac{${top}}{${texS(hyp)}}`;
          return {
            ...radicalProblem({
              prompt: t(`Find $\\${f} ${P}$ in simplest radical form.`, `求 $\\${f} ${P}$，答案写成最简根式。`),
              answer,
              wrong: [
                ...exactRatioWrong(int(top), hyp, `${top}`, rawSqrt(n)),
                texS(divS(int(f === "sin" ? adj : opp), hyp)),
                texS(divS(int(top), int(a + b))),
              ],
              solution: paras(
                step(
                  1,
                  "find the hypotenuse",
                  "求斜边",
                  t(
                    `The ${fnNames[f].en} needs the hypotenuse $${seg(U, V)}$. By the Pythagorean theorem${steps(`${seg(U, V)} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${n}}${hyp[1] === n ? "" : ` = ${texS(hyp)}`}`)}`,
                    `${fnNames[f]["zh-CN"]}需要斜边 $${seg(U, V)}$。由勾股定理${steps(`${seg(U, V)} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${n}}${hyp[1] === n ? "" : ` = ${texS(hyp)}`}`)}`,
                  ),
                ),
                step(
                  2,
                  `name the sides from angle ${P}`,
                  `从角 ${P} 给边命名`,
                  t(
                    `Seen from $\\angle ${P}$, the opposite leg is $${opp}$ and the adjacent leg is $${adj}$:\n\n{{figure 0}}`,
                    `从 $\\angle ${P}$ 看，对边是 $${opp}$，邻边是 $${adj}$：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  3,
                  "form the ratio and rationalize",
                  "写出比并有理化",
                  t(
                    `${cap(sideNames[f === "sin" ? "opp" : "adj"].en)} over the hypotenuse:${steps(`\\${f} ${P} = ${raw} = ${texS(answer)}`)}`,
                    `${sideNames[f === "sin" ? "opp" : "adj"]["zh-CN"]}比斜边：${steps(`\\${f} ${P} = ${raw} = ${texS(answer)}`)}`,
                  ),
                ),
                squaresCheck(int(top), int(f === "sin" ? adj : opp), n, f),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: [`${a}`, null, `${b}`], letters, ...(atU ? { atU: "" } : { atV: "" }) }),
              `Right triangle ${R}${U}${V} with the right angle at ${R}, legs ${R}${U} = ${a} and ${R}${V} = ${b}. Angle ${P} is marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，直角边 ${R}${U} = ${a}，${R}${V} = ${b}。标出了角 ${P}。`,
            ),
            solutionFigures: [
              roleFigure(
                {
                  tri,
                  atU,
                  letters,
                  values: { opp: `${opp}`, adj: `${adj}`, hyp: hyp[1] === 1 ? texS(hyp) : `√${n}` },
                  use: [f === "sin" ? "opp" : "adj", "hyp"],
                },
                P,
              ),
            ],
          };
        }
      },
    },
    {
      id: "ratios-with-a-missing-leg",
      figure: trigDrawings["ratios-with-a-missing-leg"],
      title: t("A missing leg", "缺少直角边"),
      explanation: t(
        "If the hypotenuse and one leg are known, the Pythagorean theorem gives the other leg by subtraction, since the square of the hypotenuse is the sum of the squares of the legs. With hypotenuse $7$ and leg $3$: the other leg is $\\sqrt{49 - 9} = \\sqrt{40} = 2\\sqrt{10}$. For the angle $\\theta$ opposite the leg $3$,\n\n$$\\tan \\theta = \\frac{3}{2\\sqrt{10}} = \\frac{3\\sqrt{10}}{20}.$$\n\n> **Watch out.** For a leg, subtract the squares: $\\sqrt{c^2 - a^2}$. Adding them, $\\sqrt{c^2 + a^2}$, gives a leg longer than the hypotenuse, which is impossible. And check which leg the ratio needs: it depends on the angle.",
        "若已知斜边和一条直角边，由于斜边的平方等于两直角边的平方和，用减法就能求出另一条直角边。斜边为 $7$、直角边为 $3$ 时，另一条直角边是 $\\sqrt{49 - 9} = \\sqrt{40} = 2\\sqrt{10}$。与直角边 $3$ 相对的角 $\\theta$ 有\n\n$$\\tan \\theta = \\frac{3}{2\\sqrt{10}} = \\frac{3\\sqrt{10}}{20}.$$\n\n> **注意。** 求直角边要把平方相减：$\\sqrt{c^2 - a^2}$。若相加成 $\\sqrt{c^2 + a^2}$，得到的直角边比斜边还长，这不可能。还要看清这个比需要哪条直角边：它取决于是哪个角。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.int(3, 15);
          const a = rng.int(1, c - 1);
          const n = c * c - a * a;
          const leg = sqrtS(n);
          const [R, U, V] = pickTriLetters(rng);
          // a = RU is known, RV is missing.
          const ask = rng.pick([
            ["sin", U],
            ["tan", U],
            ["cos", V],
            ["tan", V],
          ] as const);
          const [f, P] = ask;
          const sides: Ratios = P === U ? { opp: leg, adj: int(a), hyp: int(c) } : { opp: int(a), adj: leg, hyp: int(c) };
          const [ns, ds] = fnSides[f];
          const answer = ratioS(f, sides);
          const raw = (side: Side) => (sides[side] === leg ? rawSqrt(n) : texS(sides[side]));
          const wrongLeg = sqrtS(c * c + a * a);
          const wrongSides: Ratios = P === U ? { ...sides, opp: wrongLeg } : { ...sides, adj: wrongLeg };
          if (n === a * a) continue;
          const tri = rightTri(a, Math.sqrt(n), pickPose(rng));
          const letters = `${R}${U}${V}`;
          const atU = P === U;
          const legLabel =
            leg[1] === 1 ? texS(leg) : leg[0].isInteger() && leg[0].toNumber() !== 1 ? `${leg[0].toNumber()}√${leg[1]}` : `√${leg[1]}`;
          const fracTex = `\\frac{${texS(sides[ns])}}{${texS(sides[ds])}}`;
          return {
            ...radicalProblem({
              prompt: t(`Find $\\${f} ${P}$ in simplest radical form.`, `求 $\\${f} ${P}$，答案写成最简根式。`),
              answer,
              wrong: [
                ...exactRatioWrong(sides[ns], sides[ds], raw(ns), raw(ds)),
                texS(ratioS(f, wrongSides)),
                texS(ratioS(f === "tan" ? "sin" : "cos", sides)),
              ],
              solution: paras(
                step(
                  1,
                  "find the missing leg",
                  "求缺少的直角边",
                  t(
                    `The hypotenuse $${seg(U, V)} = ${c}$ and the leg $${seg(R, U)} = ${a}$ are known. The square of the hypotenuse is the sum of the squares of the legs, so subtract:${steps(`${seg(R, V)} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${n}}${leg[1] === n ? "" : ` = ${texS(leg)}`}`)}`,
                    `已知斜边 $${seg(U, V)} = ${c}$ 和直角边 $${seg(R, U)} = ${a}$。斜边的平方等于两直角边的平方和，所以相减：${steps(`${seg(R, V)} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${n}}${leg[1] === n ? "" : ` = ${texS(leg)}`}`)}`,
                  ),
                ),
                step(
                  2,
                  `name the sides from angle ${P}`,
                  `从角 ${P} 给边命名`,
                  t(
                    `Seen from $\\angle ${P}$, the opposite leg is $${texS(sides.opp)}$ and the adjacent leg is $${texS(sides.adj)}$; the ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}:\n\n{{figure 0}}`,
                    `从 $\\angle ${P}$ 看，对边是 $${texS(sides.opp)}$，邻边是 $${texS(sides.adj)}$；${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  3,
                  "form the ratio",
                  "写出比",
                  t(
                    `${fracTex === texS(answer) ? "It is already in simplest form" : "Simplify and rationalize"}:${steps(fracTex === texS(answer) ? `\\${f} ${P} = ${fracTex}` : `\\${f} ${P} = ${fracTex} = ${texS(answer)}`)}`,
                    `${fracTex === texS(answer) ? "它已是最简形式" : "化简并有理化"}：${steps(fracTex === texS(answer) ? `\\${f} ${P} = ${fracTex}` : `\\${f} ${P} = ${fracTex} = ${texS(answer)}`)}`,
                  ),
                ),
                pythagCheck(sides, sizeNote(f, answer[0].toNumber() * Math.sqrt(answer[1]))),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: [`${a}`, `${c}`, null], letters, ...(atU ? { atU: "" } : { atV: "" }) }),
              `Right triangle ${R}${U}${V} with the right angle at ${R}, leg ${R}${U} = ${a} and hypotenuse ${U}${V} = ${c}. Angle ${P} is marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，直角边 ${R}${U} = ${a}，斜边 ${U}${V} = ${c}。标出了角 ${P}。`,
            ),
            solutionFigures: [
              roleFigure(
                {
                  tri,
                  atU,
                  letters,
                  values: atU ? { opp: legLabel, adj: `${a}`, hyp: `${c}` } : { opp: `${a}`, adj: legLabel, hyp: `${c}` },
                  use: [ns, ds],
                },
                P,
              ),
            ],
          };
        }
      },
    },
    {
      id: "one-ratio-from-another",
      figure: trigDrawings["one-ratio-from-another"],
      title: t("One ratio from another", "由一个三角比求另一个"),
      explanation: t(
        "A ratio fixes the shape of the right triangle, and every triangle of that shape gives the same ratios. So knowing one ratio is enough: draw a right triangle with those two sides and find the third. If $\\theta$ is acute and $\\sin \\theta = \\frac{2}{3}$, take opposite side $2$ and hypotenuse $3$; the adjacent side is $\\sqrt{9 - 4} = \\sqrt{5}$. So\n\n$$\\cos \\theta = \\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}.$$\n\n> **Watch out.** The other ratios are not the flipped fraction: $\\frac{3}{2}$ is the reciprocal of the sine, not the cosine. Place the given numbers on the sides the given ratio names, then read the new ratio from the triangle.",
        "一个三角比确定了直角三角形的形状，而同样形状的三角形给出相同的三角比。所以知道一个比就够了：画一个以这两条边为边的直角三角形，求出第三条边。若 $\\theta$ 是锐角且 $\\sin \\theta = \\frac{2}{3}$，取对边为 $2$，斜边为 $3$；邻边是 $\\sqrt{9 - 4} = \\sqrt{5}$。所以\n\n$$\\cos \\theta = \\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}.$$\n\n> **注意。** 其他三角比不是把分数颠倒：$\\frac{3}{2}$ 是正弦的倒数，不是余弦。先把已知的数放在已知比所指的边上，再从三角形中读出新的比。",
      ),
      generate(rng) {
        const given = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, given);
        const sides = sidesFrom(given, a, b);
        const f = rng.pick((["sin", "cos", "tan"] as const).filter((g) => g !== given));
        const answer = ratioS(f, sides);
        const third = (["opp", "adj", "hyp"] as const).find((s) => !fnSides[given].includes(s))!;
        const thirdTex =
          given === "tan" ? `\\sqrt{${a}^2 + ${b}^2} = ${texS(sides[third])}` : `\\sqrt{${b}^2 - ${a}^2} = ${texS(sides[third])}`;
        const [ns, ds] = fnSides[f];
        const num = (x: S) => x[0].toNumber() * Math.sqrt(x[1]);
        const label = (x: S) => (x[1] === 1 ? texS(x) : x[0].toNumber() === 1 ? `√${x[1]}` : `${x[0].toNumber()}√${x[1]}`);
        const tri = rightTri(num(sides.adj), num(sides.opp), pickPose(rng));
        const fracTex = `\\frac{${texS(sides[ns])}}{${texS(sides[ds])}}`;
        return {
          ...radicalProblem({
            prompt: t(
              `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${a}}{${b}}$. Find $\\${f} \\theta$ in simplest radical form.`,
              `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${a}}{${b}}$。求 $\\${f} \\theta$，答案写成最简根式。`,
            ),
            answer,
            wrong: [texS(divS(sides[ds], sides[ns])), `\\frac{${b}}{${a}}`, `\\frac{${a}}{${b}}`],
            solution: paras(
              step(
                1,
                "draw a triangle for the given ratio",
                "按已知比画三角形",
                t(
                  `The ${fnNames[given].en} is ${sideNames[fnSides[given][0]].en} over ${sideNames[fnSides[given][1]].en}, so take a right triangle with ${sideNames[fnSides[given][0]].en} $${a}$ and ${sideNames[fnSides[given][1]].en} $${b}$. Any triangle with this angle is a scaled copy, with the same ratios.`,
                  `${fnNames[given]["zh-CN"]}等于${sideNames[fnSides[given][0]]["zh-CN"]}比${sideNames[fnSides[given][1]]["zh-CN"]}，所以取${sideNames[fnSides[given][0]]["zh-CN"]}为 $${a}$、${sideNames[fnSides[given][1]]["zh-CN"]}为 $${b}$ 的直角三角形。有这个角的任何三角形都是它的缩放，三角比相同。`,
                ),
              ),
              step(
                2,
                "find the third side",
                "求第三条边",
                t(
                  `By the Pythagorean theorem, ${sideNames[third].en} is${steps(thirdTex)}{{figure 0}}`,
                  `由勾股定理，${sideNames[third]["zh-CN"]}是${steps(thirdTex)}{{figure 0}}`,
                ),
              ),
              step(
                3,
                "read off the ratio",
                "读出所求的比",
                t(
                  `The ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}:${steps(fracTex === texS(answer) ? `\\${f} \\theta = ${fracTex}` : `\\${f} \\theta = ${fracTex} = ${texS(answer)}`)}`,
                  `${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}：${steps(fracTex === texS(answer) ? `\\${f} \\theta = ${fracTex}` : `\\${f} \\theta = ${fracTex} = ${texS(answer)}`)}`,
                ),
              ),
              pythagCheck(sides, sizeNote(f, num(answer))),
            ),
          }),
          solutionFigures: [
            roleFigure(
              {
                tri,
                atU: true,
                values: { opp: label(sides.opp), adj: label(sides.adj), hyp: label(sides.hyp) },
                angle: "θ",
                use: [ns, ds],
              },
              "θ",
            ),
          ],
        };
      },
    },
  ],
};

/** SideCase is a way to find one side of a right triangle from another and an angle. */
interface SideCase {
  readonly known: Side;
  readonly ask: Side;
  readonly fn: Fn;
}

const multiplyCases: readonly SideCase[] = [
  { known: "hyp", ask: "opp", fn: "sin" },
  { known: "hyp", ask: "adj", fn: "cos" },
  { known: "adj", ask: "opp", fn: "tan" },
];

const divideCases: readonly SideCase[] = [
  { known: "opp", ask: "hyp", fn: "sin" },
  { known: "adj", ask: "hyp", fn: "cos" },
  { known: "opp", ask: "adj", fn: "tan" },
];

/** angleFigureLabels labels the sides RU (adjacent to the angle at U), UV and VR (opposite) of a triangle drawn by angle. */
const angleFigureLabels = (labels: Partial<Record<Side, string>>) => [labels.adj ?? null, labels.hyp ?? null, labels.opp ?? null] as const;

/** angleTri places a right triangle with the acute angle theta at U. */
const angleTri = (rng: Rng, theta: number) => rightTri(Math.cos(rad(theta)), Math.sin(rad(theta)), pickPose(rng));

/** d3 writes x rounded to three decimal places. */
const d3 = (x: number) => dec(roundQ(x, 3));

/** sizeCheck says why the side found has a sensible size: the hypotenuse is the longest side, and the opposite leg is the longer leg exactly when the angle is over 45°. */
function sizeCheck(c: SideCase, th: number, n: number, x: Q): Text {
  const xs = dec(x);
  if (c.ask === "hyp") return t(`And $${xs} > ${n}$: the hypotenuse is the longest side.`, `并且 $${xs} > ${n}$：斜边是最长的边。`);
  if (c.known === "hyp") return t(`And $${xs} < ${n}$: a leg is shorter than the hypotenuse.`, `并且 $${xs} < ${n}$：直角边比斜边短。`);
  const [opp, adj] = c.ask === "opp" ? [xs, `${n}`] : [`${n}`, xs];
  return th > 45
    ? t(
        `And the angle is over $45^\\circ$, so the opposite leg must be the longer one: $${opp} > ${adj}$.`,
        `并且这个角大于 $45^\\circ$，所以对边应是较长的直角边：$${opp} > ${adj}$。`,
      )
    : th < 45
      ? t(
          `And the angle is under $45^\\circ$, so the opposite leg must be the shorter one: $${opp} < ${adj}$.`,
          `并且这个角小于 $45^\\circ$，所以对边应是较短的直角边：$${opp} < ${adj}$。`,
        )
      : t("", "");
}

/** sideProblem asks for a side from another side and an angle, rounded to the nearest tenth. */
function sideProblem(rng: Rng, cases: readonly SideCase[]): Problem {
  for (;;) {
    const c = rng.pick(cases);
    const th = rng.int(20, 70);
    const n = rng.int(4, 40);
    const f = trig(c.fn, th);
    const divide = fnSides[c.fn][1] === c.ask;
    const v = divide ? n / f : n * f;
    const answer = rounded(v, divide ? n / t4(f) : n * t4(f));
    if (!answer) continue;
    const other = (["sin", "cos", "tan"] as const).filter((g) => g !== c.fn);
    const wrong = [divide ? n * f : n / f, ...other.map((g) => (divide ? n / trig(g, th) : n * trig(g, th)))].map((w) => roundQ(w));
    const labels = { [c.known]: `${n}`, [c.ask]: "x" } as Partial<Record<Side, string>>;
    const solve = divide
      ? chain(`x \\${c.fn} ${th}^\\circ = ${n}`, `x = \\frac{${n}}{\\${c.fn} ${th}^\\circ} \\approx ${dec(answer)}`)
      : steps(`x = ${n} \\${c.fn} ${th}^\\circ \\approx ${dec(answer)}`);
    const tri = angleTri(rng, th);
    const back = divide ? `\\frac{${n}}{${dec(answer)}}` : `\\frac{${dec(answer)}}{${n}}`;
    const backValue = divide ? n / answer.toNumber() : answer.toNumber() / n;
    const size = sizeCheck(c, th, n, answer);
    return {
      ...numberProblem({
        prompt: t("Find $x$. Round your answer to the nearest tenth.", "求 $x$，结果精确到十分位。"),
        answer,
        form: "decimal",
        wrong,
        solution: paras(
          step(
            1,
            `name the sides from the ${th}° angle`,
            `从 ${th}° 角给边命名`,
            t(
              `Seen from the $${th}^\\circ$ angle, $x$ is ${sideNames[c.ask].en} and $${n}$ is ${sideNames[c.known].en}:\n\n{{figure 0}}`,
              `从 $${th}^\\circ$ 角看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${n}$ 是${sideNames[c.known]["zh-CN"]}：\n\n{{figure 0}}`,
            ),
          ),
          step(
            2,
            "choose the ratio",
            "选择三角比",
            t(
              `The ratio that links ${sideNames[fnSides[c.fn][0]].en} and ${sideNames[fnSides[c.fn][1]].en} is the ${fnNames[c.fn].en}:${steps(ratioTex(c.fn, `${th}^\\circ`, labels))}`,
              `把${sideNames[fnSides[c.fn][0]]["zh-CN"]}和${sideNames[fnSides[c.fn][1]]["zh-CN"]}联系起来的是${fnNames[c.fn]["zh-CN"]}：${steps(ratioTex(c.fn, `${th}^\\circ`, labels))}`,
            ),
          ),
          step(
            3,
            "solve for x",
            "解出 x",
            divide
              ? t(
                  `$x$ is underneath, so multiply both sides by $x$, then divide by $\\${c.fn} ${th}^\\circ \\approx ${t4(f)}$; round only at the end:${solve}`,
                  `$x$ 在分母上，所以两边同乘 $x$，再除以 $\\${c.fn} ${th}^\\circ \\approx ${t4(f)}$；只在最后取近似值：${solve}`,
                )
              : t(
                  `$x$ is on top, so multiply both sides by $${n}$, with $\\${c.fn} ${th}^\\circ \\approx ${t4(f)}$; round only at the end:${solve}`,
                  `$x$ 在分子上，所以两边同乘 $${n}$，其中 $\\${c.fn} ${th}^\\circ \\approx ${t4(f)}$；只在最后取近似值：${solve}`,
                ),
          ),
          check(
            `Put the answer back into the ratio: $${back} \\approx ${d3(backValue)}$, close to $\\${c.fn} ${th}^\\circ \\approx ${d3(f)}$. ${size.en}`,
            `把答案代回比中：$${back} \\approx ${d3(backValue)}$，与 $\\${c.fn} ${th}^\\circ \\approx ${d3(f)}$ 接近。${size["zh-CN"]}`,
          ),
        ),
      }),
      figure: figure(
        rightMarks(tri, { sides: angleFigureLabels(labels), atU: `${th}°` }),
        `A right triangle with a ${th}° angle; ${sideNames[c.known].en} is ${n} and ${sideNames[c.ask].en} is x.`,
        `一个直角三角形，有一个 ${th}° 的角；${sideNames[c.known]["zh-CN"]}为 ${n}，${sideNames[c.ask]["zh-CN"]}为 x。`,
      ),
      solutionFigures: [roleFigure({ tri, atU: true, values: labels, angle: `${th}°`, use: fnSides[c.fn] }, `${th}°`)],
    };
  }
}

/** ladderIntro draws a 5 m ladder leaning at 70° against a wall, seen from the angle at the ground. */
const ladderIntro = roleFigure(
  {
    tri: rightTri(Math.cos(rad(70)) * 5, Math.sin(rad(70)) * 5, { turn: 0, mirror: true }),
    atU: true,
    values: { opp: "h", hyp: "5" },
    angle: "70°",
    use: ["opp", "hyp"],
  },
  "70°",
);

export const calculatingSideLengthsOfRightTrianglesUsingTrigonometry: TopicDef = {
  id: "calculating-side-lengths-of-right-triangles-using-trigonometry",
  title: t("Calculating Side Lengths of Right Triangles Using Trigonometry", "用三角比求直角三角形的边长"),
  summary: t(
    "Use the sine, cosine or tangent of a known angle and one side to find another side, rounded with a calculator.",
    "已知一个锐角和一条边，用正弦、余弦或正切求另一条边，用计算器取近似值。",
  ),
  prerequisites: ["the-trigonometric-ratios", "degrees-of-accuracy"],
  encompasses: [
    { topic: "the-trigonometric-ratios", weight: 0.5 },
    { topic: "degrees-of-accuracy", weight: 0.1 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `A trigonometric ratio depends only on the angle, so every angle has its sine, cosine and tangent, and a calculator in degree mode gives them: $\\sin 70^\\circ \\approx 0.9397$. With one side and one acute angle known, a ratio becomes an equation for another side.

A ladder $5$ m long leans against a wall and makes $70^\\circ$ with the ground. How high up the wall does it reach?

{{figure 0}}

Seen from the $70^\\circ$ angle, the height $h$ is the opposite side and the ladder is the hypotenuse, and the sine links those two:

$$\\sin 70^\\circ = \\frac{h}{5}, \\qquad h = 5 \\sin 70^\\circ \\approx 4.7\\text{ m}.$$

The height is a little less than the ladder, as it should be for a steep ladder. In this lesson we find sides this way, first with the unknown on top of the ratio, then underneath it, and then choosing the ratio ourselves.`,
    `三角比只取决于角，所以每个角都有自己的正弦、余弦和正切，计算器在角度制下就能给出：$\\sin 70^\\circ \\approx 0.9397$。已知一条边和一个锐角时，一个三角比就成为求另一条边的方程。

一架长 $5$ m 的梯子靠在墙上，与地面成 $70^\\circ$。它能够到墙上多高？

{{figure 0}}

从 $70^\\circ$ 角看，高度 $h$ 是对边，梯子是斜边，联系两者的是正弦：

$$\\sin 70^\\circ = \\frac{h}{5}, \\qquad h = 5 \\sin 70^\\circ \\approx 4.7\\text{ m}.$$

高度比梯子略短，陡的梯子理应如此。这节课这样求边：先是未知边在比的分子上，再是在分母上，最后自己选择用哪个比。`,
  ),
  introFigures: [ladderIntro],
  knowledgePoints: [
    {
      id: "the-unknown-in-the-numerator",
      figure: trigDrawings["the-unknown-in-the-numerator"],
      title: t("The unknown on top", "未知边在分子"),
      explanation: t(
        "A calculator gives the ratios of any angle (in degree mode): $\\sin 35^\\circ \\approx 0.5736$. To find a side, pick the ratio that links the side you know with the side you want, write the equation, and solve. When the unknown is on top, one multiplication undoes the division.\n\nIn a right triangle with hypotenuse $12$ and an angle of $35^\\circ$, the side $x$ opposite that angle satisfies\n\n$$\\sin 35^\\circ = \\frac{x}{12}, \\qquad x = 12 \\sin 35^\\circ \\approx 6.9.$$\n\nRound only at the end, not the ratio on the way.\n\n> **Watch out.** With $x$ on top, multiply: $x = 12 \\sin 35^\\circ$. Dividing, $\\frac{12}{\\sin 35^\\circ} \\approx 20.9$, would make a leg longer than the hypotenuse $12$, which is impossible.",
        "计算器（角度制）可以给出任意角的三角比：$\\sin 35^\\circ \\approx 0.5736$。求边时，选择把已知边和所求边联系起来的那个三角比，列方程再求解。未知边在分子上时，做一次乘法就能消去除法。\n\n在斜边为 $12$、有一个 $35^\\circ$ 角的直角三角形中，这个角的对边 $x$ 满足\n\n$$\\sin 35^\\circ = \\frac{x}{12}, \\qquad x = 12 \\sin 35^\\circ \\approx 6.9.$$\n\n只在最后一步取近似值，中间的三角比不要先取近似值。\n\n> **注意。** $x$ 在分子上时要相乘：$x = 12 \\sin 35^\\circ$。若相除，$\\frac{12}{\\sin 35^\\circ} \\approx 20.9$，直角边就比斜边 $12$ 还长，这不可能。",
      ),
      generate: (rng) => sideProblem(rng, multiplyCases),
    },
    {
      id: "the-unknown-in-the-denominator",
      figure: trigDrawings["the-unknown-in-the-denominator"],
      title: t("The unknown underneath", "未知边在分母"),
      explanation: t(
        "When the unknown side is the denominator of the ratio, multiply both sides by $x$ to bring it up, then divide by the ratio. With an angle of $25^\\circ$ whose opposite side is $8$, the hypotenuse $x$ satisfies\n\n$$\\sin 25^\\circ = \\frac{8}{x}, \\qquad x \\sin 25^\\circ = 8, \\qquad x = \\frac{8}{\\sin 25^\\circ} \\approx 18.9.$$\n\nA quick check: the hypotenuse must be the longest side, and $18.9 > 8$.\n\n> **Watch out.** With $x$ underneath, the answer is $\\frac{8}{\\sin 25^\\circ}$, not $8 \\sin 25^\\circ \\approx 3.4$: that would make the hypotenuse shorter than the leg $8$.",
        "当未知边是三角比的分母时，两边同乘 $x$ 把它移上来，再除以三角比。一个 $25^\\circ$ 角的对边是 $8$，斜边 $x$ 满足\n\n$$\\sin 25^\\circ = \\frac{8}{x}, \\qquad x \\sin 25^\\circ = 8, \\qquad x = \\frac{8}{\\sin 25^\\circ} \\approx 18.9.$$\n\n快速检查：斜边一定是最长的边，而 $18.9 > 8$。\n\n> **注意。** $x$ 在分母上时，答案是 $\\frac{8}{\\sin 25^\\circ}$，不是 $8 \\sin 25^\\circ \\approx 3.4$：那样斜边会比直角边 $8$ 还短。",
      ),
      generate: (rng) => sideProblem(rng, divideCases),
    },
    {
      id: "choosing-the-ratio",
      figure: trigDrawings["choosing-the-ratio"],
      title: t("Choosing the ratio", "选择三角比"),
      explanation: t(
        "Each ratio links two particular sides, so the two sides in the problem decide which one to use. Label them as seen from the known angle, then choose:\n\n- opposite and hypotenuse: sine;\n- adjacent and hypotenuse: cosine;\n- opposite and adjacent: tangent.\n\nWith an angle of $32^\\circ$, adjacent side $x$ and opposite side $9$: $\\tan 32^\\circ = \\frac{9}{x}$, so $x = \\frac{9}{\\tan 32^\\circ} \\approx 14.4$. The angle is under $45^\\circ$, so the opposite leg should be the shorter one, and $9 < 14.4$.\n\n> **Watch out.** Label the sides from the angle that is given, not from the other acute angle; from the other angle opposite and adjacent swap, and the wrong ratio gives a wrong length that can look reasonable.",
        "每个三角比联系两条特定的边，所以题目中涉及的两条边决定了用哪个比。从已知角看，标出这两条边，再选择：\n\n- 对边和斜边：正弦；\n- 邻边和斜边：余弦；\n- 对边和邻边：正切。\n\n一个 $32^\\circ$ 的角，邻边为 $x$，对边为 $9$：$\\tan 32^\\circ = \\frac{9}{x}$，所以 $x = \\frac{9}{\\tan 32^\\circ} \\approx 14.4$。这个角小于 $45^\\circ$，对边应是较短的直角边，而 $9 < 14.4$。\n\n> **注意。** 要从已知的那个角给边命名，不能从另一个锐角看；换个角看，对边和邻边就互换了，用错的比得出的长度可能看起来也很合理。",
      ),
      generate: (rng) => sideProblem(rng, [...multiplyCases, ...divideCases]),
    },
  ],
};

/** inverseName writes an inverse ratio in LaTeX: "\sin^{-1}". */
const inverseTex = (f: Fn) => `\\${f}^{-1}`;

/** angleAnswer rounds an angle in degrees to the nearest tenth, or undefined when it is too close to a rounding boundary. */
const angleAnswer = (d: number) => rounded(d, d);

/** otherAngleCheck checks an angle found from two sides by finding the other acute angle from the same sides with the other ratio: the two must add up to 90°. */
function otherAngleCheck(g: Fn, top: number, bottom: number, answer: Q): Text {
  const other = Q.of(90).sub(answer);
  return check(
    `Find the other acute angle from the same sides: from it, the roles of the legs swap, and $${inverseTex(g)} \\frac{${top}}{${bottom}} \\approx ${dec(other)}^\\circ$. The two acute angles add up to $${dec(answer)}^\\circ + ${dec(other)}^\\circ = 90^\\circ$, as they must.`,
    `用同样的两条边求另一个锐角：从那个角看，两条直角边的角色互换，$${inverseTex(g)} \\frac{${top}}{${bottom}} \\approx ${dec(other)}^\\circ$。两个锐角之和 $${dec(answer)}^\\circ + ${dec(other)}^\\circ = 90^\\circ$，理应如此。`,
  );
}

/** inverseIntro draws the 3-4-5 right triangle seen from the angle θ opposite the leg 3. */
const inverseIntro = roleFigure(
  { tri: rightTri(4, 3, { turn: 0, mirror: false }), atU: true, values: { opp: "3", adj: "4", hyp: "5" }, angle: "θ", use: ["opp", "adj"] },
  "θ",
);

export const calculatingAnglesInRightTrianglesUsingTrigonometry: TopicDef = {
  id: "calculating-angles-in-right-triangles-using-trigonometry",
  title: t("Calculating Angles in Right Triangles Using Trigonometry", "用三角比求直角三角形的角"),
  summary: t(
    "Use the inverse sine, cosine and tangent to find an acute angle of a right triangle from two of its sides.",
    "用反正弦、反余弦和反正切，由直角三角形的两条边求锐角。",
  ),
  prerequisites: ["calculating-side-lengths-of-right-triangles-using-trigonometry"],
  encompasses: [{ topic: "the-trigonometric-ratios", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `So far an angle gave us a ratio and the ratio gave us a side. Now we go backwards: from two sides to the angle. Two sides give a ratio, and as the angle grows from $0^\\circ$ to $90^\\circ$ each ratio takes every value only once, so the ratio pins down the angle.

In the right triangle with sides $3$, $4$ and $5$, what is the angle $\\theta$ opposite the side $3$?

{{figure 0}}

Seen from $\\theta$, the legs are opposite $3$ and adjacent $4$, so $\\tan \\theta = \\frac{3}{4} = 0.75$. The calculator key $\\tan^{-1}$ undoes the tangent:

$$\\theta = \\tan^{-1} 0.75 \\approx 36.9^\\circ.$$

As a check, $\\tan 36.9^\\circ \\approx 0.751$. In this lesson we use the inverse sine, cosine and tangent to find angles, choosing the ratio from the sides we know.`,
    `到目前为止，由角得到比，再由比得到边。现在反过来：由两条边求角。两条边给出一个比，而角从 $0^\\circ$ 增大到 $90^\\circ$ 时，每个三角比的每个值都只取一次，所以比可以确定角。

三边为 $3$、$4$、$5$ 的直角三角形中，与边 $3$ 相对的角 $\\theta$ 是多少？

{{figure 0}}

从 $\\theta$ 看，对边是 $3$，邻边是 $4$，所以 $\\tan \\theta = \\frac{3}{4} = 0.75$。计算器上的 $\\tan^{-1}$ 键把正切还原成角：

$$\\theta = \\tan^{-1} 0.75 \\approx 36.9^\\circ.$$

检验：$\\tan 36.9^\\circ \\approx 0.751$。这节课用反正弦、反余弦和反正切求角，并根据已知的边选择用哪个比。`,
  ),
  introFigures: [inverseIntro],
  knowledgePoints: [
    {
      id: "inverse-trigonometric-ratios",
      title: t("Inverse ratios", "反三角比"),
      explanation: t(
        "The **inverse** ratios undo the ratios: they take a value and return the acute angle that has it. If $\\sin \\theta = 0.42$, then $\\theta = \\sin^{-1} 0.42 \\approx 24.8^\\circ$: the angle of a right triangle whose opposite side is $0.42$ of the hypotenuse.\n\n{{figure 0}}\n\nOn a calculator in degree mode, use the keys $\\sin^{-1}$, $\\cos^{-1}$ and $\\tan^{-1}$, and check by applying the ratio again: $\\sin 24.8^\\circ \\approx 0.419$.\n\n> **Watch out.** Check the mode: in radian mode the calculator gives $\\sin^{-1} 0.42 \\approx 0.43$, which is not in degrees. And use the inverse of the ratio given: $\\cos^{-1} 0.42 \\approx 65.2^\\circ$ is the other acute angle, $90^\\circ - 24.8^\\circ$.",
        "**反**三角比把三角比还原：给出一个值，它返回具有这个值的锐角。若 $\\sin \\theta = 0.42$，则 $\\theta = \\sin^{-1} 0.42 \\approx 24.8^\\circ$：即对边是斜边的 $0.42$ 倍的直角三角形中的那个角。\n\n{{figure 0}}\n\n计算器在角度制下用 $\\sin^{-1}$、$\\cos^{-1}$、$\\tan^{-1}$ 键；再把三角比作用回去检验：$\\sin 24.8^\\circ \\approx 0.419$。\n\n> **注意。** 注意模式：在弧度制下计算器给出 $\\sin^{-1} 0.42 \\approx 0.43$，这不是度数。另外要用已知那个比的反函数：$\\cos^{-1} 0.42 \\approx 65.2^\\circ$ 是另一个锐角，即 $90^\\circ - 24.8^\\circ$。",
      ),
      figures: [
        roleFigure(
          {
            tri: rightTri(Math.cos(rad(24.8)) * 5, Math.sin(rad(24.8)) * 5, { turn: 0, mirror: false }),
            atU: true,
            values: { opp: "0.42", hyp: "1" },
            angle: "θ",
            use: ["opp", "hyp"],
          },
          "θ",
        ),
      ],
      generate(rng) {
        for (;;) {
          const f = rng.pick(["sin", "cos", "tan"] as const);
          const k = f === "tan" ? rng.int(10, 400) : rng.int(5, 98);
          const v = k / 100;
          const r = f === "sin" ? Math.asin(v) : f === "cos" ? Math.acos(v) : Math.atan(v);
          const answer = angleAnswer(toDeg(r));
          if (!answer || k % 10 === 0) continue;
          const vTex = dec(q(k, 100));
          const [top, bottom] = fnSides[f];
          const tri = rightTri(Math.cos(r) * 5, Math.sin(r) * 5, pickPose(rng));
          const values: Partial<Record<Side, string>> = { [top]: vTex, [bottom]: "1" };
          return {
            ...numberProblem({
              prompt: t(
                `Find the acute angle $\\theta$ with $\\${f} \\theta = ${vTex}$. Round to the nearest tenth of a degree.`,
                `求满足 $\\${f} \\theta = ${vTex}$ 的锐角 $\\theta$，结果精确到 $0.1^\\circ$。`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: [roundQ(90 - toDeg(r)), roundQ(r)],
              solution: paras(
                step(
                  1,
                  "picture the angle",
                  "想象这个角",
                  t(
                    `$\\theta$ is the angle of a right triangle in which ${sideNames[top].en} is $${vTex}$ times ${sideNames[bottom].en}:\n\n{{figure 0}}`,
                    `$\\theta$ 是这样一个直角三角形中的角：${sideNames[top]["zh-CN"]}是${sideNames[bottom]["zh-CN"]}的 $${vTex}$ 倍：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "undo the ratio",
                  "还原成角",
                  t(
                    `The inverse ${fnNames[f].en} returns the angle; with the calculator in degree mode${steps(`\\theta = ${inverseTex(f)} ${vTex} \\approx ${dec(answer)}^\\circ`)}`,
                    `反${fnNames[f]["zh-CN"]}给出这个角；计算器设为角度制：${steps(`\\theta = ${inverseTex(f)} ${vTex} \\approx ${dec(answer)}^\\circ`)}`,
                  ),
                ),
                check(
                  `Apply the ratio again: $\\${f} ${dec(answer)}^\\circ \\approx ${d3(trig(f, answer.toNumber()))}$, close to $${vTex}$. ${
                    f === "tan"
                      ? v > 1
                        ? "The tangent is over $1$, so the angle is over $45^\\circ$, as found."
                        : "The tangent is under $1$, so the angle is under $45^\\circ$, as found."
                      : `${f === "sin" ? "A sine" : "A cosine"} of $${vTex}$ is ${v > Math.SQRT1_2 ? "more" : "less"} than $\\${f} 45^\\circ \\approx 0.707$, so the angle is ${(f === "sin") === v > Math.SQRT1_2 ? "over" : "under"} $45^\\circ$, as found.`
                  }`,
                  `把三角比作用回去：$\\${f} ${dec(answer)}^\\circ \\approx ${d3(trig(f, answer.toNumber()))}$，与 $${vTex}$ 接近。${
                    f === "tan"
                      ? v > 1
                        ? "正切大于 $1$，所以角大于 $45^\\circ$，与结果一致。"
                        : "正切小于 $1$，所以角小于 $45^\\circ$，与结果一致。"
                      : `${fnNames[f]["zh-CN"]}值 $${vTex}$ ${v > Math.SQRT1_2 ? "大于" : "小于"} $\\${f} 45^\\circ \\approx 0.707$，所以角${(f === "sin") === v > Math.SQRT1_2 ? "大于" : "小于"} $45^\\circ$，与结果一致。`
                  }`,
                ),
              ),
            }),
            solutionFigures: [roleFigure({ tri, atU: true, values, angle: "θ", use: [top, bottom] }, "θ")],
          };
        }
      },
    },
    {
      id: "an-angle-from-the-two-legs",
      figure: trigDrawings["an-angle-from-the-two-legs"],
      title: t("An angle from the two legs", "由两条直角边求角"),
      explanation: t(
        "When the two legs are known, they are the opposite and adjacent sides of each acute angle, and the ratio that uses exactly those two is the tangent. With opposite side $5$ and adjacent side $8$:\n\n$$\\tan \\theta = \\frac{5}{8}, \\qquad \\theta = \\tan^{-1} \\frac{5}{8} \\approx 32.0^\\circ.$$\n\nThe other acute angle is then $90^\\circ - 32.0^\\circ = 58.0^\\circ$, and from it the legs swap: $\\tan^{-1} \\frac{8}{5} \\approx 58.0^\\circ$ agrees.\n\n> **Watch out.** Put the leg opposite $\\theta$ on top. The flipped fraction $\\frac{8}{5}$ gives the other acute angle, $90^\\circ - \\theta$, a plausible but wrong answer.",
        "已知两条直角边时，它们是每个锐角的对边和邻边，而恰好用这两条边的比是正切。对边为 $5$、邻边为 $8$ 时：\n\n$$\\tan \\theta = \\frac{5}{8}, \\qquad \\theta = \\tan^{-1} \\frac{5}{8} \\approx 32.0^\\circ.$$\n\n另一个锐角就是 $90^\\circ - 32.0^\\circ = 58.0^\\circ$；从那个角看两条直角边互换，$\\tan^{-1} \\frac{8}{5} \\approx 58.0^\\circ$，一致。\n\n> **注意。** 要把 $\\theta$ 的对边放在分子上。颠倒的分数 $\\frac{8}{5}$ 给出的是另一个锐角 $90^\\circ - \\theta$，看似合理，其实是错的。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 30);
          const b = rng.int(2, 30);
          if (a === b || a > 3 * b || b > 3 * a) continue;
          // a = RU (adjacent to the angle at U), b = RV (opposite it).
          const r = Math.atan(b / a);
          const answer = angleAnswer(toDeg(r));
          if (!answer) continue;
          const tri = rightTri(a, b, pickPose(rng));
          return {
            ...numberProblem({
              prompt: t("Find $\\theta$. Round to the nearest tenth of a degree.", "求 $\\theta$，结果精确到 $0.1^\\circ$。"),
              answer,
              form: "decimal",
              unit: "°",
              wrong: [roundQ(90 - toDeg(r)), roundQ(r)],
              solution: paras(
                step(
                  1,
                  "name the sides from θ",
                  "从 θ 给边命名",
                  t(
                    `The leg $${b}$ does not touch $\\theta$, so it is opposite; the leg $${a}$ runs from $\\theta$ to the right angle, so it is adjacent:\n\n{{figure 0}}`,
                    `直角边 $${b}$ 不经过 $\\theta$ 的顶点，是对边；直角边 $${a}$ 从 $\\theta$ 通向直角，是邻边：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "use the tangent",
                  "用正切",
                  t(
                    `Opposite over adjacent is the tangent; the inverse tangent returns the angle:${chain(`\\tan \\theta = \\frac{${b}}{${a}}`, `\\theta = \\tan^{-1} \\frac{${b}}{${a}} \\approx ${dec(answer)}^\\circ`)}`,
                    `对边比邻边是正切；反正切给出角：${chain(`\\tan \\theta = \\frac{${b}}{${a}}`, `\\theta = \\tan^{-1} \\frac{${b}}{${a}} \\approx ${dec(answer)}^\\circ`)}`,
                  ),
                ),
                otherAngleCheck("tan", a, b, answer),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: [`${a}`, null, `${b}`], atU: "θ" }),
              `A right triangle with legs ${a} and ${b}; θ is the angle between the leg ${a} and the hypotenuse.`,
              `一个直角三角形，直角边为 ${a} 和 ${b}；θ 是直角边 ${a} 与斜边的夹角。`,
            ),
            solutionFigures: [roleFigure({ tri, atU: true, values: { opp: `${b}`, adj: `${a}` }, angle: "θ", use: ["opp", "adj"] }, "θ")],
          };
        }
      },
    },
    {
      id: "an-angle-from-a-leg-and-the-hypotenuse",
      figure: trigDrawings["an-angle-from-a-leg-and-the-hypotenuse"],
      title: t("An angle from a leg and the hypotenuse", "由直角边和斜边求角"),
      explanation: t(
        "With the hypotenuse and one leg, the ratio must have the hypotenuse at the bottom: the sine if the leg is opposite the angle, the cosine if it is adjacent. With hypotenuse $9$ and adjacent side $4$:\n\n$$\\cos \\theta = \\frac{4}{9}, \\qquad \\theta = \\cos^{-1} \\frac{4}{9} \\approx 63.6^\\circ.$$\n\nWith opposite side $7$ and hypotenuse $12$: $\\theta = \\sin^{-1} \\frac{7}{12} \\approx 35.7^\\circ$.\n\n> **Watch out.** Decide first whether the leg is opposite or adjacent: swapping the sine and the cosine gives the other acute angle, $90^\\circ - \\theta$. And the tangent never involves the hypotenuse, so $\\tan^{-1} \\frac{4}{9}$ is meaningless here.",
        "已知斜边和一条直角边时，所用的比必须以斜边为分母：直角边是角的对边就用正弦，是邻边就用余弦。斜边为 $9$、邻边为 $4$ 时：\n\n$$\\cos \\theta = \\frac{4}{9}, \\qquad \\theta = \\cos^{-1} \\frac{4}{9} \\approx 63.6^\\circ.$$\n\n对边为 $7$、斜边为 $12$ 时：$\\theta = \\sin^{-1} \\frac{7}{12} \\approx 35.7^\\circ$。\n\n> **注意。** 先判断直角边是对边还是邻边：把正弦和余弦弄反，得到的是另一个锐角 $90^\\circ - \\theta$。另外正切与斜边无关，所以这里的 $\\tan^{-1} \\frac{4}{9}$ 没有意义。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.int(4, 30);
          const l = rng.int(1, c - 1);
          if (l * 5 < c || l * 10 > 9 * c) continue;
          const f = rng.pick(["sin", "cos"] as const);
          const r = f === "sin" ? Math.asin(l / c) : Math.acos(l / c);
          const answer = angleAnswer(toDeg(r));
          if (!answer) continue;
          const th = toDeg(r);
          const tri = angleTri(rng, th);
          const labels: Partial<Record<Side, string>> = f === "sin" ? { opp: `${l}`, hyp: `${c}` } : { adj: `${l}`, hyp: `${c}` };
          const leg: Side = f === "sin" ? "opp" : "adj";
          return {
            ...numberProblem({
              prompt: t("Find $\\theta$. Round to the nearest tenth of a degree.", "求 $\\theta$，结果精确到 $0.1^\\circ$。"),
              answer,
              form: "decimal",
              unit: "°",
              wrong: [roundQ(90 - th), roundQ(toDeg(Math.atan(l / c))), roundQ(r)],
              solution: paras(
                step(
                  1,
                  "name the sides from θ",
                  "从 θ 给边命名",
                  t(
                    `$${c}$ is the hypotenuse, across from the right angle. The leg $${l}$ ${f === "sin" ? "does not touch $\\theta$, so it is opposite" : "runs from $\\theta$ to the right angle, so it is adjacent"}:\n\n{{figure 0}}`,
                    `$${c}$ 是斜边，与直角相对。直角边 $${l}$ ${f === "sin" ? "不经过 $\\theta$ 的顶点，是对边" : "从 $\\theta$ 通向直角，是邻边"}：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  `use the ${fnNames[f].en}`,
                  `用${fnNames[f]["zh-CN"]}`,
                  t(
                    `${cap(sideNames[leg].en)} over the hypotenuse is the ${fnNames[f].en}; its inverse returns the angle:${chain(`\\${f} \\theta = \\frac{${l}}{${c}}`, `\\theta = ${inverseTex(f)} \\frac{${l}}{${c}} \\approx ${dec(answer)}^\\circ`)}`,
                    `${sideNames[leg]["zh-CN"]}比斜边是${fnNames[f]["zh-CN"]}；用它的反函数求角：${chain(`\\${f} \\theta = \\frac{${l}}{${c}}`, `\\theta = ${inverseTex(f)} \\frac{${l}}{${c}} \\approx ${dec(answer)}^\\circ`)}`,
                  ),
                ),
                otherAngleCheck(f === "sin" ? "cos" : "sin", l, c, answer),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: angleFigureLabels(labels), atU: "θ" }),
              `A right triangle with hypotenuse ${c} and a leg ${l} ${f === "sin" ? "opposite" : "adjacent to"} the angle θ.`,
              `一个直角三角形，斜边为 ${c}，角 θ 的${f === "sin" ? "对边" : "邻边"}为 ${l}。`,
            ),
            solutionFigures: [roleFigure({ tri, atU: true, values: labels, angle: "θ", use: [leg, "hyp"] }, "θ")],
          };
        }
      },
    },
  ],
};

const elevationObjects = [
  { en: "tree", zh: "树" },
  { en: "building", zh: "楼房" },
  { en: "flagpole", zh: "旗杆" },
  { en: "tower", zh: "塔" },
] as const;

const depressionPlaces = [
  { en: "lighthouse", zh: "灯塔" },
  { en: "cliff", zh: "悬崖" },
  { en: "tower", zh: "塔" },
] as const;

/** roleFigureWith draws a right triangle seen from an angle with extra marks around it, and adds a sentence about them to the description. */
function roleFigureWith(v: RoleView, theta: string, extra: readonly Mark[], more: Text): Figure {
  return { svg: sketch([...roleMarks(v), ...extra]), alt: cat(roleFigure(v, theta).alt, t(" ", ""), more) };
}

/** shadowIntro draws a flagpole and its 12 m shadow, seen from the sun's angle of 55° at the tip of the shadow. */
const shadowIntro = roleFigure(
  {
    tri: rightTri(12, 12 * Math.tan(rad(55)), { turn: 0, mirror: false }),
    atU: true,
    values: { opp: "h", adj: "12 m" },
    angle: "55°",
    use: ["opp", "adj"],
  },
  "55°",
);

export const modelingWithTrigonometry: TopicDef = {
  id: "modeling-with-trigonometry",
  title: t("Modeling With Trigonometry", "用三角比建模"),
  summary: t(
    "Solve real-world problems with angles of elevation and depression, ladders and ramps.",
    "解决与仰角、俯角、梯子和坡道有关的实际问题。",
  ),
  prerequisites: ["calculating-angles-in-right-triangles-using-trigonometry"],
  encompasses: [
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.4 },
    { topic: "calculating-angles-in-right-triangles-using-trigonometry", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `Heights we cannot climb and distances we cannot walk can still be measured: find a right triangle in the situation, measure one side and one angle, and let a ratio do the rest.

A flagpole stands on level ground and casts a shadow $12$ m long when the sun is $55^\\circ$ above the horizon. The pole, the shadow and the sun's ray along the top of the pole make a right triangle, with the right angle at the foot of the pole:

{{figure 0}}

Seen from the $55^\\circ$ angle at the tip of the shadow, the pole $h$ is the opposite side and the shadow is the adjacent side, so the tangent links them:

$$\\tan 55^\\circ = \\frac{h}{12}, \\qquad h = 12 \\tan 55^\\circ \\approx 17.1\\text{ m}.$$

The sun is higher than $45^\\circ$, so the pole should be longer than its shadow, and $17.1 > 12$. In this lesson we model heights with angles of elevation, distances with angles of depression, and find angles of ladders, ramps and strings.`,
    `爬不上去的高度、走不过去的距离，照样可以测量：在情境中找到一个直角三角形，量出一条边和一个角，剩下的交给三角比。

一根旗杆立在水平地面上，太阳高出地平线 $55^\\circ$ 时，它的影子长 $12$ m。旗杆、影子和擦过旗杆顶的阳光组成一个直角三角形，直角在旗杆脚下：

{{figure 0}}

从影子末端的 $55^\\circ$ 角看，旗杆 $h$ 是对边，影子是邻边，联系两者的是正切：

$$\\tan 55^\\circ = \\frac{h}{12}, \\qquad h = 12 \\tan 55^\\circ \\approx 17.1\\text{ m}.$$

太阳高于 $45^\\circ$，所以旗杆应比影子长，而 $17.1 > 12$。这节课用仰角求高度，用俯角求距离，再求梯子、坡道和风筝线的角。`,
  ),
  introFigures: [shadowIntro],
  knowledgePoints: [
    {
      id: "angles-of-elevation",
      figure: trigDrawings["angles-of-elevation"],
      title: t("Angles of elevation", "仰角"),
      explanation: t(
        "The **angle of elevation** is the angle between the horizontal and the line of sight up to an object. Standing $30$ m from a tree with eyes $1.6$ m above the ground, you see the top at an angle of elevation of $38^\\circ$. The part of the tree above eye level is the opposite side of a right triangle with adjacent side $30$:\n\n$$30 \\tan 38^\\circ \\approx 23.44, \\qquad \\text{height} \\approx 23.44 + 1.6 \\approx 25.0 \\text{ m}.$$\n\nDraw a sketch, and remember the height of the eyes.\n\n> **Watch out.** The $30$ m along the ground is the adjacent side, not the hypotenuse, so the ratio is the tangent: $30 \\sin 38^\\circ$ would treat the line of sight as $30$ m long. And the triangle starts at eye level, so the $1.6$ m must be added at the end.",
        "**仰角**是水平线与向上看物体的视线之间的夹角。站在离一棵树 $30$ 米处，眼睛离地面 $1.6$ 米，看树顶的仰角是 $38^\\circ$。树高出眼睛的部分是一个直角三角形的对边，邻边是 $30$：\n\n$$30 \\tan 38^\\circ \\approx 23.44, \\qquad \\text{树高} \\approx 23.44 + 1.6 \\approx 25.0 \\text{ 米}.$$\n\n先画草图，别忘了加上眼睛的高度。\n\n> **注意。** 地面上的 $30$ 米是邻边，不是斜边，所以用正切：$30 \\sin 38^\\circ$ 相当于把视线当成 $30$ 米长。另外三角形从眼睛的高度开始，最后要加上 $1.6$ 米。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(8, 80);
          const th = rng.int(15, 65);
          const e = rng.pick([0, 15, 16, 17, 18]);
          const eye = q(e, 10);
          const h0 = e / 10;
          const tn = trig("tan", th);
          const answer = rounded(d * tn + h0, d * t4(tn) + h0);
          const height = d * tn;
          if (!answer || height > 4 * d || height < d / 4) continue;
          const obj = rng.pick(elevationObjects);
          const prompt =
            e === 0
              ? t(
                  `From a point on level ground $${unitTex(`${d}`)}$ from the base of a ${obj.en}, the angle of elevation to its top is $${th}^\\circ$. How tall is the ${obj.en}? Round to the nearest tenth of a meter.`,
                  `在水平地面上离${obj.zh}底部 $${d}$ 米的一点，看${obj.zh}顶的仰角是 $${th}^\\circ$。${obj.zh}有多高？结果精确到 $0.1$ 米。`,
                )
              : t(
                  `You stand on level ground $${unitTex(`${d}`)}$ from the base of a ${obj.en}, with your eyes $${unitTex(dec(eye))}$ above the ground. The angle of elevation from your eyes to the top of the ${obj.en} is $${th}^\\circ$. How tall is the ${obj.en}? Round to the nearest tenth of a meter.`,
                  `你站在水平地面上，离${obj.zh}底部 $${d}$ 米，眼睛离地面 $${dec(eye)}$ 米。从眼睛看${obj.zh}顶的仰角是 $${th}^\\circ$。${obj.zh}有多高？结果精确到 $0.1$ 米。`,
                );
          const part = roundQ(height, 2);
          const above = `x = ${d} \\tan ${th}^\\circ \\approx ${dec(part)}`;
          const sum = `${dec(part)} + ${dec(eye)} \\approx ${dec(answer)}`;
          const H = height / d;
          const E = Math.min(h0 / d, 0.25);
          const O: Point = [0, E];
          const F: Point = [1, E];
          const T: Point = [1, E + H];
          const marks: Mark[] = [
            { kind: "polygon", points: [O, F, T] },
            { kind: "right", vertex: F, from: O, to: T },
            { kind: "arc", vertex: O, from: F, to: T, label: `${th}°`, accent: true },
            { kind: "side", a: [0, 0], b: [1, 0], text: `${d} m` },
          ];
          const ground: Mark[] = [
            { kind: "segment", a: [0, 0], b: [1, 0] },
            { kind: "segment", a: [0, 0], b: O },
            { kind: "segment", a: [1, 0], b: F },
            { kind: "side", a: O, b: [0, 0], text: `${dec(eye)} m` },
          ];
          if (e > 0) marks.push(...ground);
          const x = e === 0 ? "h" : "x";
          const view: RoleView = { tri: [F, O, T], atU: true, values: { opp: x, adj: `${d} m` }, angle: `${th}°`, use: ["opp", "adj"] };
          const tanBack = `\\tan ${th}^\\circ \\approx ${d3(tn)}`;
          const size = sizeCheck({ known: "adj", ask: "opp", fn: "tan" }, th, d, e === 0 ? answer : part);
          const name = t("name the sides from the angle of elevation", "从仰角给边命名");
          const ratio = step(
            2,
            "choose the ratio",
            "选择三角比",
            t(
              `The tangent links the opposite side and the adjacent side:${steps(`\\tan ${th}^\\circ = \\frac{${x}}{${d}}`)}`,
              `联系对边和邻边的是正切：${steps(`\\tan ${th}^\\circ = \\frac{${x}}{${d}}`)}`,
            ),
          );
          return {
            ...numberProblem({
              prompt,
              answer,
              form: "decimal",
              unit: "m",
              wrong: [roundQ(d * trig("sin", th) + h0), roundQ(d / tn + h0), ...(e > 0 ? [roundQ(height)] : [])],
              solution:
                e === 0
                  ? paras(
                      step(
                        1,
                        name.en,
                        name["zh-CN"],
                        t(
                          `The ${obj.en}, the ground and the line of sight make a right triangle. Seen from the $${th}^\\circ$ angle, the height $h$ is the opposite side and the $${d}$ m along the ground is the adjacent side:\n\n{{figure 0}}`,
                          `${obj.zh}、地面和视线组成一个直角三角形。从 $${th}^\\circ$ 角看，高 $h$ 是对边，地面上的 $${d}$ 米是邻边：\n\n{{figure 0}}`,
                        ),
                      ),
                      ratio,
                      step(
                        3,
                        "solve for h",
                        "解出 h",
                        t(
                          `$h$ is on top, so multiply both sides by $${d}$:${steps(`h = ${d} \\tan ${th}^\\circ \\approx ${dec(answer)}`)}The ${obj.en} is about $${unitTex(dec(answer))}$ tall.`,
                          `$h$ 在分子上，所以两边同乘 $${d}$：${steps(`h = ${d} \\tan ${th}^\\circ \\approx ${dec(answer)}`)}${obj.zh}高约 $${dec(answer)}$ 米。`,
                        ),
                      ),
                      check(
                        `Put the answer back into the ratio: $\\frac{${dec(answer)}}{${d}} \\approx ${d3(answer.toNumber() / d)}$, close to $${tanBack}$. ${size.en}`,
                        `把答案代回比中：$\\frac{${dec(answer)}}{${d}} \\approx ${d3(answer.toNumber() / d)}$，与 $${tanBack}$ 接近。${size["zh-CN"]}`,
                      ),
                    )
                  : paras(
                      step(
                        1,
                        name.en,
                        name["zh-CN"],
                        t(
                          `The right triangle starts at your eyes: its horizontal side runs at eye level for $${d}$ m to the ${obj.en}, and its vertical side is the part $x$ of the ${obj.en} above eye level. Seen from the $${th}^\\circ$ angle, $x$ is the opposite side and $${d}$ is the adjacent side:\n\n{{figure 0}}`,
                          `直角三角形从眼睛开始：水平边在眼睛的高度上，长 $${d}$ 米，一直到${obj.zh}；竖直边是${obj.zh}高出眼睛的部分 $x$。从 $${th}^\\circ$ 角看，$x$ 是对边，$${d}$ 是邻边：\n\n{{figure 0}}`,
                        ),
                      ),
                      ratio,
                      step(
                        3,
                        "solve for x",
                        "解出 x",
                        t(
                          `$x$ is on top, so multiply both sides by $${d}$:${steps(above)}`,
                          `$x$ 在分子上，所以两边同乘 $${d}$：${steps(above)}`,
                        ),
                      ),
                      step(
                        4,
                        "add the height of the eyes",
                        "加上眼睛的高度",
                        t(
                          `Below the triangle are the $${unitTex(dec(eye))}$ from the ground to your eyes:${steps(sum)}The ${obj.en} is about $${unitTex(dec(answer))}$ tall.`,
                          `三角形下面还有从地面到眼睛的 $${dec(eye)}$ 米：${steps(sum)}${obj.zh}高约 $${dec(answer)}$ 米。`,
                        ),
                      ),
                      check(
                        `Take the eyes away again and put the rest back into the ratio: $\\frac{${dec(answer)} - ${dec(eye)}}{${d}} \\approx ${d3(answer.sub(eye).toNumber() / d)}$, close to $${tanBack}$. ${size.en}`,
                        `再减去眼睛的高度，把剩下的代回比中：$\\frac{${dec(answer)} - ${dec(eye)}}{${d}} \\approx ${d3(answer.sub(eye).toNumber() / d)}$，与 $${tanBack}$ 接近。${size["zh-CN"]}`,
                      ),
                    ),
            }),
            figure: figure(
              marks,
              `A right triangle from the observer's eye to the top of the ${obj.en}: horizontal distance ${d} m, angle of elevation ${th}°${e > 0 ? `, eyes ${dec(eye)} m above the ground` : ""}.`,
              `从观察者眼睛到${obj.zh}顶的直角三角形：水平距离 ${d} 米，仰角 ${th}°${e > 0 ? `，眼睛离地面 ${dec(eye)} 米` : ""}。`,
            ),
            solutionFigures: [
              e === 0
                ? roleFigure(view, `${th}°`)
                : roleFigureWith(
                    view,
                    `${th}°`,
                    ground,
                    t(`The triangle sits ${dec(eye)} m above the ground, at eye level.`, `三角形在眼睛的高度上，离地面 ${dec(eye)} 米。`),
                  ),
            ],
          };
        }
      },
    },
    {
      id: "angles-of-depression",
      figure: trigDrawings["angles-of-depression"],
      title: t("Angles of depression", "俯角"),
      explanation: t(
        "The **angle of depression** is the angle between the horizontal and the line of sight **down** to an object. The horizontal at the top is parallel to the ground, so the angle of depression equals the angle of elevation from the object back up (alternate interior angles).\n\nFrom the top of a $45$ m cliff, a boat is seen at an angle of depression of $22^\\circ$. At the boat, the angle of elevation is $22^\\circ$, the cliff is the opposite side and the distance $d$ to the boat is adjacent:\n\n$$\\tan 22^\\circ = \\frac{45}{d}, \\qquad d = \\frac{45}{\\tan 22^\\circ} \\approx 111.4 \\text{ m}.$$\n\n> **Watch out.** The angle of depression is measured down from the horizontal, not from the cliff. The angle at the top between the cliff and the line of sight is $90^\\circ - 22^\\circ = 68^\\circ$; putting $22^\\circ$ there swaps opposite and adjacent and gives $45 \\tan 22^\\circ \\approx 18.2$ m, far too short for such a shallow look down.",
        "**俯角**是水平线与**向下**看物体的视线之间的夹角。顶端的水平线与地面平行，所以俯角等于从物体向上看的仰角（内错角相等）。\n\n从 $45$ 米高的悬崖顶看一条小船，俯角是 $22^\\circ$。在小船处仰角是 $22^\\circ$，悬崖是对边，到小船的距离 $d$ 是邻边：\n\n$$\\tan 22^\\circ = \\frac{45}{d}, \\qquad d = \\frac{45}{\\tan 22^\\circ} \\approx 111.4 \\text{ 米}.$$\n\n> **注意。** 俯角是从水平线向下量的，不是从悬崖量的。顶端处悬崖与视线的夹角是 $90^\\circ - 22^\\circ = 68^\\circ$；把 $22^\\circ$ 放在那里，对边和邻边就互换了，得到 $45 \\tan 22^\\circ \\approx 18.2$ 米，对这么平缓的俯视来说太近了。",
      ),
      generate(rng) {
        for (;;) {
          const h = rng.int(15, 120);
          const th = rng.int(20, 60);
          const sight = rng.bool(0.3);
          const fn: Fn = sight ? "sin" : "tan";
          const f = trig(fn, th);
          const answer = rounded(h / f, h / t4(f));
          if (!answer) continue;
          const place = rng.pick(depressionPlaces);
          const d = h / trig("tan", th);
          const T: Point = [0, h];
          const B: Point = [0, 0];
          const P: Point = [d, 0];
          const Hz: Point = [d * 0.75, h];
          const question = sight
            ? t(`How far is the boat from the top of the ${place.en}, along the line of sight?`, `沿视线方向，小船离${place.zh}顶有多远？`)
            : t(`How far is the boat from the base of the ${place.en}?`, `小船离${place.zh}底部有多远？`);
          const u = sight ? "s" : "d";
          const work = chain(
            `\\${fn} ${th}^\\circ = \\frac{${h}}{${u}}`,
            `${u} = \\frac{${h}}{\\${fn} ${th}^\\circ} \\approx ${dec(answer)}`,
          );
          const horizon: Mark[] = [
            { kind: "segment", a: T, b: Hz, dashed: true },
            { kind: "arc", vertex: T, from: Hz, to: P, label: `${th}°` },
          ];
          const view: RoleView = {
            tri: [B, P, T],
            atU: true,
            values: { opp: `${h} m`, [sight ? "hyp" : "adj"]: u },
            angle: `${th}°`,
            use: fnSides[fn],
          };
          const size = sizeCheck({ known: "opp", ask: sight ? "hyp" : "adj", fn }, th, h, answer);
          const back = `\\frac{${h}}{${dec(answer)}} \\approx ${d3(h / answer.toNumber())}`;
          return {
            ...numberProblem({
              prompt: t(
                `From the top of a ${place.en} $${unitTex(`${h}`)}$ high, the angle of depression to a boat on the water is $${th}^\\circ$. ${question.en} Round to the nearest tenth of a meter.`,
                `从 $${h}$ 米高的${place.zh}顶看水面上的一条小船，俯角是 $${th}^\\circ$。${question["zh-CN"]}结果精确到 $0.1$ 米。`,
              ),
              answer,
              form: "decimal",
              unit: "m",
              wrong: [roundQ(h * trig("tan", th)), roundQ(sight ? d : h / trig("sin", th)), roundQ(h * trig("cos", th))],
              solution: paras(
                step(
                  1,
                  "move the angle down to the boat",
                  "把角移到小船处",
                  t(
                    `The horizontal line at the top of the ${place.en} is parallel to the water, and the line of sight crosses both. The angle of depression and the angle of elevation at the boat are alternate interior angles, so the angle at the boat is also $${th}^\\circ$.`,
                    `${place.zh}顶的水平线与水面平行，视线与两者相交。俯角与小船处的仰角是内错角，所以小船处的角也是 $${th}^\\circ$。`,
                  ),
                ),
                step(
                  2,
                  "name the sides from the boat",
                  "从小船处给边命名",
                  t(
                    `Seen from the $${th}^\\circ$ angle at the boat, the height $${h}$ is the opposite side, and ${sight ? `the line of sight $s$ is the hypotenuse` : `the distance $d$ along the water is the adjacent side`}:\n\n{{figure 0}}`,
                    `从小船处的 $${th}^\\circ$ 角看，高 $${h}$ 是对边，${sight ? "视线 $s$ 是斜边" : "水面上的距离 $d$ 是邻边"}：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  3,
                  "choose the ratio and solve",
                  "选择三角比并求解",
                  t(
                    `The ${fnNames[fn].en} links them. $${u}$ is underneath, so multiply both sides by $${u}$ and divide by $\\${fn} ${th}^\\circ$:${work}`,
                    `联系两者的是${fnNames[fn]["zh-CN"]}。$${u}$ 在分母上，所以两边同乘 $${u}$，再除以 $\\${fn} ${th}^\\circ$：${work}`,
                  ),
                ),
                check(
                  `Put the answer back into the ratio: $${back}$, close to $\\${fn} ${th}^\\circ \\approx ${d3(f)}$. ${size.en}`,
                  `把答案代回比中：$${back}$，与 $\\${fn} ${th}^\\circ \\approx ${d3(f)}$ 接近。${size["zh-CN"]}`,
                ),
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [T, B, P] },
                { kind: "right", vertex: B, from: P, to: T },
                { kind: "segment", a: T, b: Hz, dashed: true },
                { kind: "arc", vertex: T, from: Hz, to: P, label: `${th}°`, accent: true },
                { kind: "side", a: T, b: B, text: `${h} m` },
              ],
              `A ${place.en} ${h} m high; the line of sight from its top down to a boat makes an angle of depression of ${th}° with the horizontal.`,
              `高 ${h} 米的${place.zh}；从顶端看小船的视线与水平线成 ${th}° 的俯角。`,
            ),
            solutionFigures: [
              roleFigureWith(
                view,
                `${th}°`,
                horizon,
                t(
                  `The dashed horizontal at the top makes the angle of depression ${th}° with the line of sight, equal to the angle at the boat.`,
                  `顶端的虚线是水平线，它与视线成 ${th}° 的俯角，等于小船处的角。`,
                ),
              ),
            ],
          };
        }
      },
    },
    {
      id: "angles-in-context",
      figure: trigDrawings["angles-in-context"],
      title: t("Finding angles in context", "实际问题中的角"),
      explanation: t(
        "To find an angle, identify two sides of a right triangle and use an inverse ratio. A $6$ m ladder leans against a wall with its foot $2$ m from the wall. The ground is the side adjacent to the angle the ladder makes with the ground, and the ladder is the hypotenuse:\n\n$$\\theta = \\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ.$$\n\nA ramp that rises $1$ m over a horizontal distance of $12$ m makes an angle of $\\tan^{-1} \\frac{1}{12} \\approx 4.8^\\circ$ with the ground.\n\n> **Watch out.** Read which angle is asked for. The ladder's angle with the ground and its angle with the wall add up to $90^\\circ$: $\\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ$ is with the ground, while $\\sin^{-1} \\frac{2}{6} \\approx 19.5^\\circ$ is with the wall.",
        "求角时，先找出直角三角形的两条边，再用反三角比。一架 $6$ 米长的梯子靠在墙上，梯脚离墙 $2$ 米。地面是梯子与地面所成角的邻边，梯子是斜边：\n\n$$\\theta = \\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ.$$\n\n一个坡道在水平距离 $12$ 米内升高 $1$ 米，它与地面所成的角是 $\\tan^{-1} \\frac{1}{12} \\approx 4.8^\\circ$。\n\n> **注意。** 看清楚求的是哪个角。梯子与地面的夹角和它与墙的夹角之和是 $90^\\circ$：$\\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ$ 是与地面的夹角，而 $\\sin^{-1} \\frac{2}{6} \\approx 19.5^\\circ$ 是与墙的夹角。",
      ),
      generate(rng) {
        for (;;) {
          const kind = rng.int(0, 3);
          let f: Fn;
          let a: number;
          let b: number;
          let prompt: Text;
          let setup: Text;
          if (kind === 0 || kind === 1) {
            const L = rng.int(3, 12);
            const x = rng.int(1, L - 1);
            [a, b] = [x, L];
            f = kind === 0 ? "cos" : "sin";
            prompt =
              kind === 0
                ? t(
                    `A ladder $${unitTex(`${L}`)}$ long leans against a vertical wall, with its foot $${unitTex(`${x}`)}$ from the wall on level ground. Find the angle the ladder makes with the ground, to the nearest tenth of a degree.`,
                    `一架 $${L}$ 米长的梯子靠在竖直的墙上，梯脚在水平地面上，离墙 $${x}$ 米。求梯子与地面所成的角，结果精确到 $0.1^\\circ$。`,
                  )
                : t(
                    `A ladder $${unitTex(`${L}`)}$ long leans against a vertical wall and reaches $${unitTex(`${x}`)}$ up the wall. Find the angle the ladder makes with the ground, to the nearest tenth of a degree.`,
                    `一架 $${L}$ 米长的梯子靠在竖直的墙上，顶端离地面 $${x}$ 米。求梯子与地面所成的角，结果精确到 $0.1^\\circ$。`,
                  );
            setup =
              kind === 0
                ? t(
                    `The wall, the ground and the ladder make a right triangle with the right angle at the foot of the wall. Seen from the angle $\\theta$ at the foot of the ladder, the ladder is the hypotenuse and the distance $${x}$ along the ground is the adjacent side:`,
                    `墙、地面和梯子组成一个直角三角形，直角在墙脚。从梯脚处的角 $\\theta$ 看，梯子是斜边，地面上的距离 $${x}$ 是邻边：`,
                  )
                : t(
                    `The wall, the ground and the ladder make a right triangle with the right angle at the foot of the wall. Seen from the angle $\\theta$ at the foot of the ladder, the ladder is the hypotenuse and the height $${x}$ on the wall is the opposite side:`,
                    `墙、地面和梯子组成一个直角三角形，直角在墙脚。从梯脚处的角 $\\theta$ 看，梯子是斜边，墙上的高度 $${x}$ 是对边：`,
                  );
          } else if (kind === 2) {
            const rise = rng.int(1, 6);
            const run = rng.int(5, 40);
            [a, b, f] = [rise, run, "tan"];
            prompt = t(
              `A ramp rises $${unitTex(`${rise}`)}$ over a horizontal distance of $${unitTex(`${run}`)}$. Find the angle the ramp makes with the ground, to the nearest tenth of a degree.`,
              `一个坡道在水平距离 $${run}$ 米内升高 $${rise}$ 米。求坡道与地面所成的角，结果精确到 $0.1^\\circ$。`,
            );
            setup = t(
              `The ramp, the horizontal and the vertical rise make a right triangle. Seen from the angle $\\theta$ at the bottom of the ramp, the rise $${rise}$ is the opposite side and the run $${run}$ is the adjacent side:`,
              `坡道、水平线和竖直的升高组成一个直角三角形。从坡底的角 $\\theta$ 看，升高的 $${rise}$ 是对边，水平距离 $${run}$ 是邻边：`,
            );
          } else {
            const L = rng.int(20, 90);
            const h = rng.int(8, L - 4);
            [a, b, f] = [h, L, "sin"];
            prompt = t(
              `A kite flies at the end of a straight string $${unitTex(`${L}`)}$ long, $${unitTex(`${h}`)}$ above the hand holding it. Find the angle the string makes with the horizontal, to the nearest tenth of a degree.`,
              `风筝线拉直后长 $${L}$ 米，风筝比拿线的手高 $${h}$ 米。求风筝线与水平线所成的角，结果精确到 $0.1^\\circ$。`,
            );
            setup = t(
              `The string, the horizontal through the hand and the vertical down from the kite make a right triangle. Seen from the angle $\\theta$ at the hand, the string is the hypotenuse and the height $${h}$ is the opposite side:`,
              `风筝线、过手的水平线和从风筝向下的竖直线组成一个直角三角形。从手处的角 $\\theta$ 看，风筝线是斜边，高度 $${h}$ 是对边：`,
            );
          }
          const v = a / b;
          const r = f === "sin" ? Math.asin(v) : f === "cos" ? Math.acos(v) : Math.atan(v);
          const answer = angleAnswer(toDeg(r));
          if (!answer || toDeg(r) < 2 || toDeg(r) > 88) continue;
          const others = (["sin", "cos", "tan"] as const).filter((g) => g !== f && (g === "tan" || v < 1));
          const [top, bottom] = fnSides[f];
          const view: RoleView = {
            tri: rightTri(Math.cos(r), Math.sin(r), { turn: 0, mirror: kind < 2 }),
            atU: true,
            values: { [top]: `${a}`, [bottom]: `${b}` },
            angle: "θ",
            use: fnSides[f],
          };
          const ratio = `\\${f} \\theta = \\frac{${a}}{${b}}`;
          return {
            ...numberProblem({
              prompt,
              answer,
              form: "decimal",
              unit: "°",
              wrong: [
                roundQ(90 - toDeg(r)),
                ...others.map((g) => roundQ(toDeg(g === "sin" ? Math.asin(v) : g === "cos" ? Math.acos(v) : Math.atan(v)))),
              ],
              solution: paras(
                step(1, "draw the right triangle", "画出直角三角形", cat(setup, t("\n\n{{figure 0}}", "\n\n{{figure 0}}"))),
                step(
                  2,
                  "choose the ratio",
                  "选择三角比",
                  t(
                    `The ${fnNames[f].en} links ${sideNames[top].en} and ${sideNames[bottom].en}:${steps(ratio)}`,
                    `联系${sideNames[top]["zh-CN"]}和${sideNames[bottom]["zh-CN"]}的是${fnNames[f]["zh-CN"]}：${steps(ratio)}`,
                  ),
                ),
                step(
                  3,
                  "undo the ratio",
                  "用反三角比求角",
                  t(
                    `The inverse ${fnNames[f].en} turns the value back into the angle:${steps(`\\theta = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(answer)}^\\circ`)}`,
                    `反${fnNames[f]["zh-CN"]}把这个值还原成角：${steps(`\\theta = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(answer)}^\\circ`)}`,
                  ),
                ),
                f === "tan" ? otherAngleCheck("tan", b, a, answer) : otherAngleCheck(f === "sin" ? "cos" : "sin", a, b, answer),
              ),
            }),
            solutionFigures: [roleFigure(view, "θ")],
          };
        }
      },
    },
  ],
};

const fns6 = ["sin", "cos", "tan", "csc", "sec", "cot"] as const;

/** sNum is the decimal value of an exact number. */
const sNum = (x: S) => x[0].toNumber() * Math.sqrt(x[1]);

/** sLabel writes an exact whole number or surd for a drawing: "3", "√21", "2√5". */
const sLabel = (x: S) => (x[1] === 1 ? texS(x) : x[0].toNumber() === 1 ? `√${x[1]}` : `${x[0].toNumber()}√${x[1]}`);

/** ratioView is the right triangle in which the ratio f of θ is a / b, seen from θ, with the sides of the ratio ask in colour. */
function ratioView(f: Fn, a: number, b: number, use: readonly Side[], pose: Pose, all = true): RoleView {
  const r = sidesFrom(f, a, b);
  const [n, d] = fnSides[f];
  const values = all ? { opp: sLabel(r.opp), adj: sLabel(r.adj), hyp: sLabel(r.hyp) } : { [n]: `${a}`, [d]: `${b}` };
  return { tri: rightTri(sNum(r.adj), sNum(r.opp), pose), atU: true, values, angle: "θ", use };
}

/** baseOf is the ratio among sine, cosine and tangent that a ratio is, or is the reciprocal of. */
const baseOf = (f: Fn6): Fn => (f === "csc" ? "sin" : f === "sec" ? "cos" : f === "cot" ? "tan" : f);

/** flatPose draws a figure upright, unturned and unmirrored. */
const flatPose: Pose = { turn: 0, mirror: false };

/** reciprocalIntro draws the 8-15-17 triangle seen from the angle θ opposite 8, with the hypotenuse and the opposite side in colour. */
const reciprocalIntro = roleFigure(ratioView("sin", 8, 17, ["hyp", "opp"], flatPose), "θ");

export const theReciprocalTrigonometricRatios: TopicDef = {
  id: "the-reciprocal-trigonometric-ratios",
  title: t("The Reciprocal Trigonometric Ratios", "倒数三角比"),
  summary: t(
    "Find the cosecant, secant and cotangent of an angle from the sides of a right triangle or from another ratio.",
    "由直角三角形的边或另一个三角比求角的余割、正割和余切。",
  ),
  prerequisites: ["calculating-trigonometric-ratios-using-the-pythagorean-theorem"],
  encompasses: [
    { topic: "calculating-trigonometric-ratios-using-the-pythagorean-theorem", weight: 0.4 },
    { topic: "the-trigonometric-ratios", weight: 0.3 },
    { topic: "rationalizing-denominators", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `Three sides can be paired in six ways, top and bottom. The sine, cosine and tangent use three of them; the other three are their fractions turned upside down, and they have names too.

In the right triangle with sides $8$, $15$ and $17$, take the angle $\\theta$ opposite the side $8$:

{{figure 0}}

Its sine is opposite over hypotenuse, $\\frac{8}{17}$. Turned upside down, hypotenuse over opposite, it is the **cosecant**:

$$\\csc \\theta = \\frac{17}{8} = \\frac{1}{\\sin \\theta}.$$

The hypotenuse is the longest side, so a cosecant is always greater than $1$, just as a sine is always less than $1$. Calculators have no key for it: divide $1$ by the sine. In this lesson we read the cosecant, secant and cotangent from the sides, flip a given ratio, and find them with the Pythagorean theorem.`,
    `三条边按分子、分母配对，共有六种。正弦、余弦和正切用了其中三种；另外三种是把它们的分数倒过来，也各有名字。

在三边为 $8$、$15$、$17$ 的直角三角形中，取与边 $8$ 相对的角 $\\theta$：

{{figure 0}}

它的正弦是对边比斜边，$\\frac{8}{17}$。倒过来，斜边比对边，就是**余割**：

$$\\csc \\theta = \\frac{17}{8} = \\frac{1}{\\sin \\theta}.$$

斜边是最长的边，所以余割总大于 $1$，正如正弦总小于 $1$。计算器上没有余割键：用 $1$ 除以正弦即可。这节课由边读出余割、正割和余切，把已知的比倒过来，并用勾股定理求它们。`,
  ),
  introFigures: [reciprocalIntro],
  knowledgePoints: [
    {
      id: "reciprocal-ratios-from-sides",
      figure: geometryDrawings2["the-reciprocal-trigonometric-ratios#reciprocal-ratios-from-sides"],
      title: t("Reciprocal ratios from the sides", "由边求倒数三角比"),
      explanation: t(
        "The **reciprocal ratios** turn the three ratios upside down:\n\n$$\\csc \\theta = \\frac{1}{\\sin \\theta} = \\frac{\\text{hypotenuse}}{\\text{opposite}}, \\qquad \\sec \\theta = \\frac{1}{\\cos \\theta} = \\frac{\\text{hypotenuse}}{\\text{adjacent}}, \\qquad \\cot \\theta = \\frac{1}{\\tan \\theta} = \\frac{\\text{adjacent}}{\\text{opposite}}.$$\n\nThey are the **cosecant**, **secant** and **cotangent**. Note the pairing: the secant goes with the cosine and the cosecant with the sine. For the angle opposite $5$ in the $5$-$12$-$13$ triangle: $\\csc \\theta = \\frac{13}{5}$, $\\sec \\theta = \\frac{13}{12}$, $\\cot \\theta = \\frac{12}{5}$.\n\n> **Watch out.** The names cross over: the **co**secant is the reciprocal of the sine, not of the **co**sine. Here $\\sec \\theta = \\frac{13}{12}$ uses the adjacent side; writing $\\frac{13}{5}$ for it mixes it up with the cosecant.",
        "**倒数三角比**把三个三角比倒过来：\n\n$$\\csc \\theta = \\frac{1}{\\sin \\theta} = \\frac{\\text{斜边}}{\\text{对边}}, \\qquad \\sec \\theta = \\frac{1}{\\cos \\theta} = \\frac{\\text{斜边}}{\\text{邻边}}, \\qquad \\cot \\theta = \\frac{1}{\\tan \\theta} = \\frac{\\text{邻边}}{\\text{对边}}.$$\n\n它们分别是**余割**、**正割**和**余切**。注意配对：正割对应余弦，余割对应正弦。在 $5$-$12$-$13$ 三角形中，与 $5$ 相对的角有 $\\csc \\theta = \\frac{13}{5}$，$\\sec \\theta = \\frac{13}{12}$，$\\cot \\theta = \\frac{12}{5}$。\n\n> **注意。** 名称是交叉配对的：**余**割是正弦的倒数，不是**余**弦的倒数。这里 $\\sec \\theta = \\frac{13}{12}$ 用的是邻边；把它写成 $\\frac{13}{5}$ 就和余割混淆了。",
      ),
      generate: (rng) => wholeRatioProblem(rng, rng.pick(["csc", "sec", "cot"] as const)),
    },
    {
      id: "the-reciprocal-of-a-ratio",
      title: t("The reciprocal of a given ratio", "已知三角比的倒数"),
      explanation: t(
        "A ratio and its reciprocal use the same two sides, one on top and the other underneath, so they multiply to $1$. If $\\cos \\theta = \\frac{3}{7}$, the adjacent side and the hypotenuse are in the ratio $3 : 7$, and the secant, hypotenuse over adjacent, is $\\frac{7}{3}$:\n\n{{figure 0}}\n\nIf $\\cot \\theta = \\frac{5}{2}$, then $\\tan \\theta = \\frac{2}{5}$. The reciprocal of a decimal works the same way: $\\sin \\theta = 0.8 = \\frac{4}{5}$ gives $\\csc \\theta = \\frac{5}{4}$.\n\n> **Watch out.** The reciprocal is $1$ divided by the ratio: turn the fraction over. It is not $1 - \\frac{3}{7} = \\frac{4}{7}$, and not the negative $-\\frac{7}{3}$; the ratios of an acute angle are all positive.",
        "一个三角比与它的倒数用的是同样两条边，只是分子、分母互换，所以它们的积是 $1$。若 $\\cos \\theta = \\frac{3}{7}$，邻边与斜边之比是 $3 : 7$，而正割是斜边比邻边，等于 $\\frac{7}{3}$：\n\n{{figure 0}}\n\n若 $\\cot \\theta = \\frac{5}{2}$，则 $\\tan \\theta = \\frac{2}{5}$。小数也一样：$\\sin \\theta = 0.8 = \\frac{4}{5}$，所以 $\\csc \\theta = \\frac{5}{4}$。\n\n> **注意。** 倒数是 $1$ 除以这个比：把分数倒过来。它不是 $1 - \\frac{3}{7} = \\frac{4}{7}$，也不是相反数 $-\\frac{7}{3}$；锐角的三角比都是正的。",
      ),
      figures: [roleFigure(ratioView("cos", 3, 7, ["hyp", "adj"], flatPose, false), "θ")],
      generate(rng) {
        const given = rng.pick(fns6);
        const base = baseOf(given);
        const [a, b] = pickRatio(rng, base);
        const [n, d] = given === base ? [a, b] : [b, a];
        const ask = reciprocalOf[given];
        const answer = q(d, n);
        const [gn, gd] = fnSides[given];
        const [an, ad] = fnSides[ask];
        const flipped = answer.toLatex() === `\\frac{${d}}{${n}}` ? "" : ` = ${answer.toLatex()}`;
        const v = d / n;
        const view = ratioView(base, a, b, [an, ad], pickPose(rng), false);
        return {
          ...numberProblem({
            prompt: t(
              `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${n}}{${d}}$. Find $\\${ask} \\theta$.`,
              `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${n}}{${d}}$。求 $\\${ask} \\theta$。`,
            ),
            answer,
            form: "fraction",
            wrong: [q(n, d), q(d - n, d), q(-d, n)],
            solution: paras(
              step(
                1,
                "read the sides from the given ratio",
                "由已知的比读出边",
                t(
                  `The ${fnNames[given].en} is ${sideNames[gn].en} over ${sideNames[gd].en}, so in a right triangle with this angle $\\theta$, ${sideNames[gn].en} and ${sideNames[gd].en} are in the ratio $${n} : ${d}$:\n\n{{figure 0}}`,
                  `${fnNames[given]["zh-CN"]}等于${sideNames[gn]["zh-CN"]}比${sideNames[gd]["zh-CN"]}，所以在有这个角 $\\theta$ 的直角三角形中，${sideNames[gn]["zh-CN"]}与${sideNames[gd]["zh-CN"]}之比是 $${n} : ${d}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "turn the ratio over",
                "把比倒过来",
                t(
                  `The ${fnNames[ask].en} is ${sideNames[an].en} over ${sideNames[ad].en}: the same two sides, the other way up. So it is the reciprocal:${steps(`\\${ask} \\theta = \\frac{1}{\\${given} \\theta} = \\frac{${d}}{${n}}${flipped}`)}`,
                  `${fnNames[ask]["zh-CN"]}等于${sideNames[an]["zh-CN"]}比${sideNames[ad]["zh-CN"]}：同样的两条边，上下颠倒。所以它是倒数：${steps(`\\${ask} \\theta = \\frac{1}{\\${given} \\theta} = \\frac{${d}}{${n}}${flipped}`)}`,
                ),
              ),
              check(
                `A ratio times its reciprocal is $1$: $\\frac{${n}}{${d}} \\cdot ${answer.toLatex()} = 1$. ${sizeNote(ask, v).en}`,
                `一个比乘它的倒数等于 $1$：$\\frac{${n}}{${d}} \\cdot ${answer.toLatex()} = 1$。${sizeNote(ask, v)["zh-CN"]}`,
              ),
            ),
          }),
          solutionFigures: [roleFigure(view, "θ")],
        };
      },
    },
    {
      id: "reciprocal-ratios-using-the-pythagorean-theorem",
      title: t("Reciprocal ratios with the Pythagorean theorem", "用勾股定理求倒数三角比"),
      explanation: t(
        "If the given ratio uses different sides, find the third side first. If $\\sin \\theta = \\frac{2}{5}$, take opposite $2$ and hypotenuse $5$; the adjacent side is $\\sqrt{25 - 4} = \\sqrt{21}$:\n\n{{figure 0}}\n\nThen\n\n$$\\sec \\theta = \\frac{5}{\\sqrt{21}} = \\frac{5\\sqrt{21}}{21}, \\qquad \\cot \\theta = \\frac{\\sqrt{21}}{2}.$$\n\n> **Watch out.** Only the cosecant can be had by flipping the sine, $\\frac{5}{2}$. The secant and the cotangent need the adjacent side, which the sine does not give: find it with the Pythagorean theorem first.",
        "若已知的三角比用的是另外两条边，先求出第三条边。若 $\\sin \\theta = \\frac{2}{5}$，取对边 $2$、斜边 $5$，邻边是 $\\sqrt{25 - 4} = \\sqrt{21}$：\n\n{{figure 0}}\n\n于是\n\n$$\\sec \\theta = \\frac{5}{\\sqrt{21}} = \\frac{5\\sqrt{21}}{21}, \\qquad \\cot \\theta = \\frac{\\sqrt{21}}{2}.$$\n\n> **注意。** 只有余割可以直接把正弦倒过来得到，即 $\\frac{5}{2}$。正割和余切要用邻边，而正弦没有给出邻边：先用勾股定理求出它。",
      ),
      figures: [roleFigure(ratioView("sin", 2, 5, ["hyp", "adj"], flatPose), "θ")],
      generate(rng) {
        const given = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, given);
        const sides = sidesFrom(given, a, b);
        const ask = rng.pick((["csc", "sec", "cot"] as const).filter((g) => reciprocalOf[g] !== given));
        const answer = ratioS(ask, sides);
        const [ns, ds] = fnSides[ask];
        const [gn, gd] = fnSides[given];
        const third = (["opp", "adj", "hyp"] as const).find((s) => !fnSides[given].includes(s))!;
        const thirdTex =
          given === "tan" ? `\\sqrt{${a}^2 + ${b}^2} = ${texS(sides[third])}` : `\\sqrt{${b}^2 - ${a}^2} = ${texS(sides[third])}`;
        const fracTex = `\\frac{${texS(sides[ns])}}{${texS(sides[ds])}}`;
        const simple = fracTex === texS(answer);
        return {
          ...radicalProblem({
            prompt: t(
              `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${a}}{${b}}$. Find $\\${ask} \\theta$ in simplest radical form.`,
              `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${a}}{${b}}$。求 $\\${ask} \\theta$，答案写成最简根式。`,
            ),
            answer,
            wrong: [texS(ratioS(reciprocalOf[ask], sides)), `\\frac{${b}}{${a}}`, texS(ratioS(cofunction[ask], sides))],
            solution: paras(
              step(
                1,
                "draw a triangle for the given ratio",
                "按已知比画三角形",
                t(
                  `The ${fnNames[given].en} is ${sideNames[gn].en} over ${sideNames[gd].en}, so take a right triangle with ${sideNames[gn].en} $${a}$ and ${sideNames[gd].en} $${b}$. Any triangle with this angle is a scaled copy, with the same ratios.`,
                  `${fnNames[given]["zh-CN"]}等于${sideNames[gn]["zh-CN"]}比${sideNames[gd]["zh-CN"]}，所以取${sideNames[gn]["zh-CN"]}为 $${a}$、${sideNames[gd]["zh-CN"]}为 $${b}$ 的直角三角形。有这个角的任何三角形都是它的缩放，三角比相同。`,
                ),
              ),
              step(
                2,
                "find the third side",
                "求第三条边",
                t(
                  `The ${fnNames[ask].en} needs ${sideNames[third].en}, so find it with the Pythagorean theorem:${steps(thirdTex)}{{figure 0}}`,
                  `${fnNames[ask]["zh-CN"]}要用到${sideNames[third]["zh-CN"]}，所以用勾股定理求出它：${steps(thirdTex)}{{figure 0}}`,
                ),
              ),
              step(
                3,
                "read off the ratio",
                "读出所求的比",
                t(
                  `The ${fnNames[ask].en} is ${sideNames[ns].en} over ${sideNames[ds].en}${simple ? "" : "; simplify and rationalize"}:${steps(simple ? `\\${ask} \\theta = ${fracTex}` : `\\${ask} \\theta = ${fracTex} = ${texS(answer)}`)}`,
                  `${fnNames[ask]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}${simple ? "" : "，再化简并有理化"}：${steps(simple ? `\\${ask} \\theta = ${fracTex}` : `\\${ask} \\theta = ${fracTex} = ${texS(answer)}`)}`,
                ),
              ),
              pythagCheck(sides, sizeNote(ask, sNum(answer))),
            ),
          }),
          solutionFigures: [roleFigure(ratioView(given, a, b, [ns, ds], pickPose(rng)), "θ")],
        };
      },
    },
  ],
};

/** twoTris places right triangle RUV with legs a = RU and b = RV, and a copy scaled by k beside it (drawn at between 0.55 and 1.8 times the size). */
function twoTris(a: number, b: number, k: number): [Tri, Tri] {
  const s1 = 4 / Math.max(a, b);
  const s2 = s1 * Math.max(Math.min(k, 1.8), 0.55);
  const x0 = a * s1 + 2.5;
  return [
    [
      [0, 0],
      [a * s1, 0],
      [0, b * s1],
    ],
    [
      [x0, 0],
      [x0 + a * s2, 0],
      [x0, b * s2],
    ],
  ];
}

/** twoTriangles draws right triangle RUV and a similar copy scaled by k beside it, with letters and the angles at U and its image marked. */
function twoTriangles(
  a: number,
  b: number,
  k: number,
  letters: readonly [string, string],
  small: readonly [string | null, string | null, string | null],
  big: readonly [string | null, string | null, string | null],
): Mark[] {
  const [t1, t2] = twoTris(a, b, k);
  return [
    ...rightMarks(t1, { sides: small, atU: "", letters: letters[0] }),
    ...rightMarks(t2, { sides: big, atU: "", letters: letters[1] }),
  ];
}

/** PairView is a right triangle and a similar copy, both seen from corresponding angles at U or at V. */
interface PairView {
  readonly atU: boolean;
  readonly letters?: readonly [string, string];
  readonly small: Partial<Record<Side, string>>;
  readonly big: Partial<Record<Side, string>>;
  readonly use: readonly Side[];
  readonly angle?: string;
}

/** twoViews draws a right triangle and a similar copy, seen from corresponding angles, with the sides of a ratio in colour in both. */
function twoViews(a: number, b: number, k: number, v: PairView, en: string, zh: string): Figure {
  const [t1, t2] = twoTris(a, b, k);
  const base = { atU: v.atU, use: v.use, angle: v.angle ?? "" };
  return figure(
    [
      ...roleMarks({ ...base, tri: t1, values: v.small, ...(v.letters && { letters: v.letters[0] }) }),
      ...roleMarks({ ...base, tri: t2, values: v.big, ...(v.letters && { letters: v.letters[1] }) }),
    ],
    en,
    zh,
  );
}

/** abcNames names the sides of right triangles ABC and DEF (right angles at C and F) seen from A and D, or from B and E. */
const abcNames = (atA: boolean): [Record<Side, string>, Record<Side, string>] =>
  atA
    ? [
        { opp: "BC", adj: "AC", hyp: "AB" },
        { opp: "EF", adj: "DF", hyp: "DE" },
      ]
    : [
        { opp: "AC", adj: "BC", hyp: "AB" },
        { opp: "DF", adj: "EF", hyp: "DE" },
      ];

/** abcAlt describes right triangles ABC and DEF seen from A and D, or from B and E, naming each labeled side by its role. */
function abcAlt(
  atA: boolean,
  small: Partial<Record<Side, string>>,
  big: Partial<Record<Side, string>>,
  use: readonly Side[],
): [string, string] {
  const [n1, n2] = abcNames(atA);
  const [P0, P] = atA ? ["A", "D"] : ["B", "E"];
  const part = (names: Record<Side, string>, values: Partial<Record<Side, string>>, l: "en" | "zh-CN") =>
    (["opp", "adj", "hyp"] as const)
      .filter((s) => values[s] !== undefined)
      .map((s) => `${roleWords[s][l]} ${names[s]} = ${values[s]}`)
      .join(l === "en" ? ", " : "，");
  return [
    `Right triangles ABC and DEF, right angles at C and F, seen from the equal angles ${P0} and ${P}. In ABC: ${part(n1, small, "en")}. In DEF: ${part(n2, big, "en")}. In both, the ${use.map((s) => roleWords[s].en).join(" and the ")} are drawn in colour.`,
    `直角三角形 ABC 与 DEF，直角在 C 和 F，从相等的角 ${P0} 和 ${P} 看。在 ABC 中：${part(n1, small, "zh-CN")}。在 DEF 中：${part(n2, big, "zh-CN")}。两者中的${use.map((s) => roleWords[s]["zh-CN"]).join("和")}都用颜色标出。`,
  ];
}

/** shadowsIntro draws a 2 m stick with a 3 m shadow and a tree with an 18 m shadow, both seen from the sun's angle θ. */
const shadowsIntro = twoViews(
  3,
  2,
  6,
  { atU: true, small: { opp: "2", adj: "3" }, big: { opp: "h", adj: "18" }, use: ["opp", "adj"], angle: "θ" },
  "Two right triangles with the same angle θ at the tip of the shadow: a stick, opposite side 2, with adjacent side its shadow 3; a tree, opposite side h, with adjacent side its shadow 18. In both the opposite and the adjacent sides are drawn in colour.",
  "两个在影子末端有相同角 θ 的直角三角形：木棍是对边 2，影子是邻边 3；树是对边 h，影子是邻边 18。两者中的对边和邻边都用颜色标出。",
);

export const trigonometricRatiosInSimilarRightTriangles: TopicDef = {
  id: "trigonometric-ratios-in-similar-right-triangles",
  title: t("Trigonometric Ratios in Similar Right Triangles", "相似直角三角形中的三角比"),
  summary: t(
    "Understand that the ratios of an angle do not depend on the size of the triangle, and use them to find sides of similar triangles.",
    "理解三角比与三角形的大小无关，并用它求相似三角形的边。",
  ),
  prerequisites: ["the-trigonometric-ratios", "the-aa-similarity-criterion"],
  encompasses: [{ topic: "the-trigonometric-ratios", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSG.SRT.C.6"],
  intro: t(
    `Why may we speak of *the* sine of $35^\\circ$, as if there were only one? Because every right triangle with a $35^\\circ$ angle has the same shape, whatever its size.

At the same moment of the day, a stick $2$ m tall casts a shadow $3$ m long, and a tree casts a shadow $18$ m long. The sun's rays meet the ground at the same angle $\\theta$ in both places, so the two right triangles have two equal angles and are similar:

{{figure 0}}

Similar triangles have proportional sides, so the tangent of $\\theta$, opposite over adjacent, is the same in both:

$$\\frac{h}{18} = \\frac{2}{3}, \\qquad h = 18 \\cdot \\frac{2}{3} = 12\\text{ m}.$$

The tree's shadow is $6$ times the stick's, and so is its height: $6 \\cdot 2 = 12$. In this lesson we see why equal angles give equal ratios, use a ratio from one triangle to find sides of a similar one, and see that scaling never changes a ratio.`,
    `为什么可以说 $35^\\circ$ 的正弦，好像只有一个？因为凡是有一个 $35^\\circ$ 角的直角三角形，不论大小，形状都相同。

在一天中的同一时刻，一根 $2$ m 高的木棍影子长 $3$ m，一棵树的影子长 $18$ m。两处阳光与地面的夹角 $\\theta$ 相同，所以两个直角三角形有两个角相等，彼此相似：

{{figure 0}}

相似三角形的边成比例，所以 $\\theta$ 的正切，即对边比邻边，在两者中相同：

$$\\frac{h}{18} = \\frac{2}{3}, \\qquad h = 18 \\cdot \\frac{2}{3} = 12\\text{ m}.$$

树的影子是木棍影子的 $6$ 倍，树高也是：$6 \\cdot 2 = 12$。这节课说明为什么角相等则三角比相等，用一个三角形中的比求相似三角形的边，并看到放缩从不改变三角比。`,
  ),
  introFigures: [shadowsIntro],
  knowledgePoints: [
    {
      id: "equal-angles-have-equal-ratios",
      figure: trigDrawings["equal-angles-have-equal-ratios"],
      title: t("Equal angles, equal ratios", "角相等，三角比相等"),
      explanation: t(
        "Two right triangles with an equal acute angle are similar (AA), so their sides are proportional and every ratio of two sides is the same in both. That is why $\\sin$, $\\cos$ and $\\tan$ depend only on the angle.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with right angles at $C$ and $F$, and $AC = 8$, $BC = 6$, $AB = 10$, then\n\n$$\\tan D = \\tan A = \\frac{6}{8} = \\frac{3}{4},$$\n\nhowever large $\\triangle DEF$ is.\n\n> **Watch out.** A larger triangle does not have a larger ratio: if $\\triangle DEF$ is twice as large, both of its sides double and $\\tan D$ is still $\\frac{3}{4}$, not $\\frac{6}{4}$. And read the sides from the matching angle: $D$ matches $A$, and from $B$ the opposite and adjacent sides would swap.",
        "有一个锐角相等的两个直角三角形相似（AA），所以对应边成比例，任意两边之比在两个三角形中都相同。正因如此，$\\sin$、$\\cos$、$\\tan$ 只取决于角。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$，且 $AC = 8$，$BC = 6$，$AB = 10$，则\n\n$$\\tan D = \\tan A = \\frac{6}{8} = \\frac{3}{4},$$\n\n无论 $\\triangle DEF$ 有多大。\n\n> **注意。** 三角形大了，三角比并不变大：若 $\\triangle DEF$ 大一倍，它的两条边都加倍，$\\tan D$ 仍是 $\\frac{3}{4}$，不是 $\\frac{6}{4}$。另外要从对应的角读边：$D$ 对应 $A$，若从 $B$ 看，对边和邻边就互换了。",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 30);
        const k = rng.int(2, 5);
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const atD = rng.bool();
        // a = AC (adjacent to A), b = BC (opposite A), c = AB.
        const [opp, adj] = atD ? [b, a] : [a, b];
        const vals = { opp, adj, hyp: c };
        const [ns, ds] = fnSides[f];
        const answer = q(vals[ns], vals[ds]);
        const P = atD ? "D" : "E";
        const P0 = atD ? "A" : "B";
        const [n1] = abcNames(atD);
        const raw = `\\frac{${vals[ns]}}{${vals[ds]}}`;
        const reduced = raw === answer.toLatex() ? "" : ` = ${answer.toLatex()}`;
        const small = { opp: `${opp}`, adj: `${adj}`, hyp: `${c}` };
        const big = { hyp: `${k * c}` };
        const [en, zh] = abcAlt(atD, small, big, [ns, ds]);
        const scaled = `\\frac{${k * vals[ns]}}{${k * vals[ds]}}`;
        return {
          ...numberProblem({
            prompt: t(
              `$\\triangle ABC \\sim \\triangle DEF$, with right angles at $C$ and $F$. Find $\\${f} ${P}$ as a fraction in lowest terms.`,
              `$\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$。求 $\\${f} ${P}$，答案写成最简分数。`,
            ),
            answer,
            form: "fraction",
            wrong: [q(vals[ds], vals[ns]), q(k * vals[ns], vals[ds]), q(adj, c), q(opp, c)],
            solution: paras(
              step(
                1,
                "match the angles",
                "找出对应角",
                t(
                  `In similar triangles corresponding angles are equal: $\\angle ${P} = \\angle ${P0}$. Equal angles have equal ratios, so $\\${f} ${P} = \\${f} ${P0}$, and $\\triangle ABC$, where all three sides are known, gives it.`,
                  `相似三角形的对应角相等：$\\angle ${P} = \\angle ${P0}$。角相等则三角比相等，所以 $\\${f} ${P} = \\${f} ${P0}$，可以在三边都已知的 $\\triangle ABC$ 中求。`,
                ),
              ),
              step(
                2,
                `name the sides from angle ${P0}`,
                `从角 ${P0} 给边命名`,
                t(
                  `Seen from $\\angle ${P0}$, the opposite side is $${n1.opp} = ${opp}$, the adjacent side is $${n1.adj} = ${adj}$ and the hypotenuse is $${n1.hyp} = ${c}$:\n\n{{figure 0}}`,
                  `从 $\\angle ${P0}$ 看，对边是 $${n1.opp} = ${opp}$，邻边是 $${n1.adj} = ${adj}$，斜边是 $${n1.hyp} = ${c}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                3,
                "form the ratio",
                "写出比",
                t(
                  `The ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}${reduced ? "; reduce to lowest terms" : ""}:${steps(`\\${f} ${P} = \\${f} ${P0} = ${raw}${reduced}`)}`,
                  `${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}${reduced ? "，再约成最简分数" : ""}：${steps(`\\${f} ${P} = \\${f} ${P0} = ${raw}${reduced}`)}`,
                ),
              ),
              check(
                `Work in $\\triangle DEF$ itself: $DE = ${k * c}$ is $${k}$ times $AB = ${c}$, so every side of $\\triangle DEF$ is $${k}$ times its partner, and there $\\${f} ${P} = ${scaled} = ${answer.toLatex()}$, the same.`,
                `直接在 $\\triangle DEF$ 中算：$DE = ${k * c}$ 是 $AB = ${c}$ 的 $${k}$ 倍，所以 $\\triangle DEF$ 的每条边都是对应边的 $${k}$ 倍，那里 $\\${f} ${P} = ${scaled} = ${answer.toLatex()}$，结果相同。`,
              ),
            ),
          }),
          figure: figure(
            twoTriangles(a, b, k, ["CAB", "FDE"], [`${a}`, `${c}`, `${b}`], [null, `${k * c}`, null]),
            `Right triangles ABC and DEF, right angles at C and F. AC = ${a}, BC = ${b}, AB = ${c}; DE = ${k * c}.`,
            `直角三角形 ABC 与 DEF，直角在 C 和 F。AC = ${a}，BC = ${b}，AB = ${c}；DE = ${k * c}。`,
          ),
          solutionFigures: [twoViews(a, b, k, { atU: atD, letters: ["CAB", "FDE"], small, big, use: [ns, ds] }, en, zh)],
        };
      },
    },
    {
      id: "sides-from-a-similar-triangle",
      figure: trigDrawings["sides-from-a-similar-triangle"],
      title: t("Sides from a similar triangle", "由相似三角形求边"),
      explanation: t(
        "A ratio found in one triangle can be used in any similar triangle. If $\\triangle ABC$ has $AC = 8$, $BC = 6$, $AB = 10$, then $\\sin A = \\frac{3}{5}$. In a similar triangle $DEF$ with $\\angle D = \\angle A$ and hypotenuse $DE = 25$:\n\n$$EF = DE \\cdot \\sin D = 25 \\cdot \\frac{3}{5} = 15.$$\n\n> **Watch out.** Keep the sides in the same roles in both triangles: opposite over hypotenuse in $\\triangle DEF$ equals opposite over hypotenuse in $\\triangle ABC$. Writing $\\frac{25}{EF} = \\frac{3}{5}$ turns one ratio over and gives $41.7$, longer than the hypotenuse $25$.",
        "在一个三角形中求出的三角比，可以用于任何与它相似的三角形。若 $\\triangle ABC$ 中 $AC = 8$，$BC = 6$，$AB = 10$，则 $\\sin A = \\frac{3}{5}$。在相似三角形 $DEF$ 中，$\\angle D = \\angle A$，斜边 $DE = 25$：\n\n$$EF = DE \\cdot \\sin D = 25 \\cdot \\frac{3}{5} = 15.$$\n\n> **注意。** 两个三角形中边的角色要一致：$\\triangle DEF$ 中的对边比斜边等于 $\\triangle ABC$ 中的对边比斜边。写成 $\\frac{25}{EF} = \\frac{3}{5}$ 就把一个比倒过来了，得到 $41.7$，比斜边 $25$ 还长。",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 30);
        const sides = { adj: a, opp: b, hyp: c };
        const names3 = { adj: "DF", opp: "EF", hyp: "DE" };
        const names0 = { adj: "AC", opp: "BC", hyp: "AB" };
        const [known, ask] = rng.sample(["adj", "opp", "hyp"] as const, 2) as [Side, Side];
        const n0 = rng.int(3, 39);
        const n = n0 >= sides[known] ? n0 + 1 : n0;
        const answer = q(n * sides[ask], sides[known]);
        const f = (Object.keys(fnSides) as Fn6[]).find((g) => fnSides[g][0] === ask && fnSides[g][1] === known)!;
        const labels = (s: Side) => (s === known ? `${n}` : s === ask ? "x" : null);
        const small = { opp: `${b}`, adj: `${a}`, hyp: `${c}` };
        const big = { [known]: `${n}`, [ask]: "x" } as Partial<Record<Side, string>>;
        const [en, zh] = abcAlt(true, small, big, [ask, known]);
        const scale = q(n, sides[known]).toLatex();
        return {
          ...numberProblem({
            prompt: t(
              `$\\triangle ABC \\sim \\triangle DEF$, with right angles at $C$ and $F$. Find $x = ${names3[ask]}$.`,
              `$\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$。求 $x = ${names3[ask]}$。`,
            ),
            answer,
            wrong: [q(n * sides[known], sides[ask]), n * sides[ask], q(n, sides[known])],
            solution: paras(
              step(
                1,
                "match the angles",
                "找出对应角",
                t(
                  `In similar triangles corresponding angles are equal, so $\\angle D = \\angle A$, and every ratio of $\\angle D$ equals the same ratio of $\\angle A$.`,
                  `相似三角形的对应角相等，所以 $\\angle D = \\angle A$，$\\angle D$ 的每个三角比都等于 $\\angle A$ 的同一个三角比。`,
                ),
              ),
              step(
                2,
                "name the sides from A and from D",
                "从 A 和 D 给边命名",
                t(
                  `Seen from these angles, $x = ${names3[ask]}$ is ${sideNames[ask].en} of $\\triangle DEF$ and $${names3[known]} = ${n}$ is ${sideNames[known].en}; in $\\triangle ABC$ they match $${names0[ask]} = ${sides[ask]}$ and $${names0[known]} = ${sides[known]}$:\n\n{{figure 0}}`,
                  `从这两个角看，$x = ${names3[ask]}$ 是 $\\triangle DEF$ 的${sideNames[ask]["zh-CN"]}，$${names3[known]} = ${n}$ 是${sideNames[known]["zh-CN"]}；在 $\\triangle ABC$ 中对应的是 $${names0[ask]} = ${sides[ask]}$ 和 $${names0[known]} = ${sides[known]}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                3,
                "set the ratios equal and solve",
                "让两个比相等并求解",
                t(
                  `${cap(sideNames[ask].en.slice(4))} over ${sideNames[known].en} is $\\${f}$ of the angle, the same in both triangles. Multiply both sides by $${n}$:${chain(`\\frac{x}{${n}} = \\frac{${sides[ask]}}{${sides[known]}}`, `x = ${n} \\cdot \\frac{${sides[ask]}}{${sides[known]}} = ${answer.toLatex()}`)}`,
                  `${sideNames[ask]["zh-CN"]}比${sideNames[known]["zh-CN"]}是这个角的 $\\${f}$，在两个三角形中相同。两边同乘 $${n}$：${chain(`\\frac{x}{${n}} = \\frac{${sides[ask]}}{${sides[known]}}`, `x = ${n} \\cdot \\frac{${sides[ask]}}{${sides[known]}} = ${answer.toLatex()}`)}`,
                ),
              ),
              check(
                `Similar triangles scale every side by the same factor. $${names3[known]}$ is $${n} \\div ${sides[known]} = ${scale}$ times $${names0[known]}$, and $x$ is $${answer.toLatex()} \\div ${sides[ask]} = ${scale}$ times $${names0[ask]}$, the same factor.`,
                `相似三角形的每条边按同一比例放缩。$${names3[known]}$ 是 $${names0[known]}$ 的 $${n} \\div ${sides[known]} = ${scale}$ 倍，而 $x$ 是 $${names0[ask]}$ 的 $${answer.toLatex()} \\div ${sides[ask]} = ${scale}$ 倍，比例相同。`,
              ),
            ),
          }),
          figure: figure(
            twoTriangles(a, b, n / sides[known], ["CAB", "FDE"], [`${a}`, `${c}`, `${b}`], [labels("adj"), labels("hyp"), labels("opp")]),
            `Right triangles ABC and DEF, right angles at C and F. AC = ${a}, BC = ${b}, AB = ${c}; ${names3[known]} = ${n} and ${names3[ask]} = x.`,
            `直角三角形 ABC 与 DEF，直角在 C 和 F。AC = ${a}，BC = ${b}，AB = ${c}；${names3[known]} = ${n}，${names3[ask]} = x。`,
          ),
          solutionFigures: [
            twoViews(a, b, n / sides[known], { atU: true, letters: ["CAB", "FDE"], small, big, use: [ask, known] }, en, zh),
          ],
        };
      },
    },
    {
      id: "scaling-a-right-triangle",
      figure: geometryDrawings2["trigonometric-ratios-in-similar-right-triangles#scaling-a-right-triangle"],
      title: t("Scaling a right triangle", "放缩直角三角形"),
      explanation: t(
        "Multiplying every side of a triangle by $k$ multiplies the numerator and the denominator of each ratio by $k$, so the ratios do not change. If $\\cos A = \\frac{5}{13}$ in $\\triangle ABC$ and each side is tripled to make $\\triangle DEF$ with $D$ corresponding to $A$, then $\\cos D = \\frac{15}{39} = \\frac{5}{13}$ as well.\n\n> **Watch out.** Scaling the sides does not scale the ratio: the factor $3$ is on top and underneath, and cancels. $\\cos D = 3 \\cdot \\frac{5}{13} = \\frac{15}{13}$ would even be greater than $1$, which no cosine can be.",
        "把三角形的每条边都乘以 $k$，每个三角比的分子和分母都乘以 $k$，所以三角比不变。若 $\\triangle ABC$ 中 $\\cos A = \\frac{5}{13}$，把每条边都扩大为原来的 $3$ 倍得到 $\\triangle DEF$，$D$ 对应 $A$，则同样有 $\\cos D = \\frac{15}{39} = \\frac{5}{13}$。\n\n> **注意。** 边放缩了，三角比并不放缩：因数 $3$ 同时在分子和分母上，约掉了。$\\cos D = 3 \\cdot \\frac{5}{13} = \\frac{15}{13}$ 甚至大于 $1$，而余弦不可能大于 $1$。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, f, 15);
        const grow = rng.bool();
        const k = rng.int(2, 9);
        const answer = q(a, b);
        const [ns, ds] = fnSides[f];
        const r = sidesFrom(f, a, b);
        // ABC has the sides a and b of the ratio when DEF is the larger triangle, and k a and k b when DEF is the smaller.
        const [abc, def] = grow
          ? [
              [a, b],
              [k * a, k * b],
            ]
          : [
              [k * a, k * b],
              [a, b],
            ];
        const op = grow ? t("multiplied", "乘以") : t("divided", "除以");
        const small = { [ns]: `${abc[0]}`, [ds]: `${abc[1]}` } as Partial<Record<Side, string>>;
        const big = { [ns]: `${def[0]}`, [ds]: `${def[1]}` } as Partial<Record<Side, string>>;
        const word = (s: Side, l: "en" | "zh-CN") => roleWords[s][l];
        return {
          ...numberProblem({
            prompt: grow
              ? t(
                  `In right triangle $ABC$, $\\${f} A = \\frac{${a}}{${b}}$. Every side is multiplied by $${k}$ to make $\\triangle DEF$, with $D$ corresponding to $A$. Find $\\${f} D$.`,
                  `在直角三角形 $ABC$ 中，$\\${f} A = \\frac{${a}}{${b}}$。把每条边都乘以 $${k}$ 得到 $\\triangle DEF$，$D$ 对应 $A$。求 $\\${f} D$。`,
                )
              : t(
                  `In right triangle $ABC$, $\\${f} A = \\frac{${a}}{${b}}$. Every side is divided by $${k}$ to make $\\triangle DEF$, with $D$ corresponding to $A$. Find $\\${f} D$.`,
                  `在直角三角形 $ABC$ 中，$\\${f} A = \\frac{${a}}{${b}}$。把每条边都除以 $${k}$ 得到 $\\triangle DEF$，$D$ 对应 $A$。求 $\\${f} D$。`,
                ),
            answer,
            form: "fraction",
            wrong: [q(k * a, b), q(a, k * b), q(b, a)],
            solution: paras(
              step(
                1,
                "give the sides of ABC numbers",
                "给 ABC 的边取值",
                t(
                  `The ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}, so $\\triangle ABC$ can be taken with ${sideNames[ns].en} $${abc[0]}$ and ${sideNames[ds].en} $${abc[1]}$, seen from $A$${grow ? "" : `; these are $${k}$ times $${a}$ and $${b}$, so that dividing by $${k}$ gives whole numbers`}.`,
                  `${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}，所以可以取 $\\triangle ABC$ 中从 $A$ 看的${sideNames[ns]["zh-CN"]}为 $${abc[0]}$、${sideNames[ds]["zh-CN"]}为 $${abc[1]}$${grow ? "" : `；它们是 $${a}$ 和 $${b}$ 的 $${k}$ 倍，这样除以 $${k}$ 后仍是整数`}。`,
                ),
              ),
              step(
                2,
                "scale the sides",
                "放缩各边",
                t(
                  `Every side is ${op.en} by $${k}$, and the angles stay the same, so $D$ sees the matching sides: ${word(ns, "en")} $${def[0]}$ and ${word(ds, "en")} $${def[1]}$:\n\n{{figure 0}}`,
                  `每条边都${op["zh-CN"]} $${k}$，角不变，所以从 $D$ 看对应的边：${word(ns, "zh-CN")} $${def[0]}$，${word(ds, "zh-CN")} $${def[1]}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                3,
                "form the ratio",
                "写出比",
                t(
                  grow
                    ? `The factor $${k}$ is on top and underneath, and cancels:${steps(`\\${f} D = \\frac{${k} \\cdot ${a}}{${k} \\cdot ${b}} = ${answer.toLatex()}`)}`
                    : `Dividing the top and the bottom of $\\frac{${k * a}}{${k * b}}$ by the same $${k}$ leaves the fraction unchanged:${steps(`\\${f} D = \\frac{${k * a} \\div ${k}}{${k * b} \\div ${k}} = ${answer.toLatex()}`)}`,
                  grow
                    ? `因数 $${k}$ 同时在分子和分母上，约掉了：${steps(`\\${f} D = \\frac{${k} \\cdot ${a}}{${k} \\cdot ${b}} = ${answer.toLatex()}`)}`
                    : `把 $\\frac{${k * a}}{${k * b}}$ 的分子和分母同除以 $${k}$，分数不变：${steps(`\\${f} D = \\frac{${k * a} \\div ${k}}{${k * b} \\div ${k}} = ${answer.toLatex()}`)}`,
                ),
              ),
              check(
                `Scaling changes the sizes but not the angles, so $\\angle D = \\angle A$ and $\\${f} D$ must equal $\\${f} A = ${answer.toLatex()}$, as it does. ${sizeNote(f, a / b).en}`,
                `放缩改变大小，不改变角，所以 $\\angle D = \\angle A$，$\\${f} D$ 必须等于 $\\${f} A = ${answer.toLatex()}$，确实如此。${sizeNote(f, a / b)["zh-CN"]}`,
              ),
            ),
          }),
          solutionFigures: [
            twoViews(
              sNum(r.adj),
              sNum(r.opp),
              grow ? k : 1 / k,
              { atU: true, letters: ["CAB", "FDE"], small, big, use: [ns, ds] },
              ...abcAlt(true, small, big, [ns, ds]),
            ),
          ],
        };
      },
    },
  ],
};

/** bothAngles draws a right triangle with both acute angles marked, a at U and b at V, and the sides of a ratio of a in colour; its description says how the legs swap roles between the two angles. */
function bothAngles(
  tri: Tri,
  a: string,
  b: string,
  use: readonly Side[],
  letters?: string,
  values?: Partial<Record<Side, string>>,
): Figure {
  const [R, U, V] = letters ? (letters.split("") as [string, string, string]) : ["", "", ""];
  const nm = (s: string) => (letters ? ` ${s}` : "");
  const val = (s: Side) => (values?.[s] !== undefined ? ` = ${values[s]}` : "");
  const used = use.map((s) => roleWords[s]);
  return figure(
    roleMarks({ tri, atU: true, angle: a, other: b, use, ...(letters && { letters }), ...(values && { values }) }),
    `Right triangle${letters ? ` ${letters} with the right angle at ${R}` : ""}, with acute angles ${a}${letters ? ` at ${U}` : ""} and ${b}${letters ? ` at ${V}` : ""}. The leg${nm(`${V}${R}`)}${val("opp")} is opposite ${a} and adjacent to ${b}; the leg${nm(`${R}${U}`)}${val("adj")} is adjacent to ${a} and opposite ${b}; the hypotenuse${nm(`${U}${V}`)}${val("hyp")} is the same for both. Seen from ${a}, the ${used.map((w) => w.en).join(" and the ")} are drawn in colour.`,
    `直角三角形${letters ? ` ${letters}，直角在 ${R}` : ""}，两个锐角为${letters ? ` ${U} 处的` : ""} ${a} 和${letters ? ` ${V} 处的` : ""} ${b}。直角边${nm(`${V}${R}`)}${val("opp")} 是 ${a} 的对边、${b} 的邻边；直角边${nm(`${R}${U}`)}${val("adj")} 是 ${a} 的邻边、${b} 的对边；斜边${nm(`${U}${V}`)}${val("hyp")} 对两者相同。从 ${a} 看，${used.map((w) => w["zh-CN"]).join("和")}用颜色标出。`,
  );
}

/** degTri places a right triangle with the acute angle d degrees at U, upright. */
const degTri = (d: number) => rightTri(Math.cos(rad(d)) * 5, Math.sin(rad(d)) * 5, flatPose);

/** complementIntro draws the 3-4-5 triangle ABC with both acute angles marked. */
const complementIntro = bothAngles(rightTri(4, 3, flatPose), "A", "B", ["opp", "hyp"], "CAB", { opp: "3", adj: "4", hyp: "5" });

export const trigonometricFunctionsOfComplementaryAngles: TopicDef = {
  id: "trigonometric-functions-of-complementary-angles",
  title: t("Trigonometric Functions of Complementary Angles", "互余角的三角函数"),
  summary: t(
    "Use that the sine of an angle equals the cosine of its complement, and that the tangents of complementary angles are reciprocals.",
    "运用一个角的正弦等于它的余角的余弦，以及互余两角的正切互为倒数。",
  ),
  prerequisites: ["the-reciprocal-trigonometric-ratios"],
  encompasses: [
    { topic: "angles-and-sides-in-right-triangles", weight: 0.3 },
    { topic: "complementary-and-supplementary-angles", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.C.7"],
  intro: t(
    `A right triangle has two acute angles, and they add up to $90^\\circ$: they are **complementary**. Each is seen from its own corner, so the same two legs swap roles between them.

In the right triangle $ABC$ with sides $3$, $4$ and $5$ and the right angle at $C$:

{{figure 0}}

The leg $3$ is opposite $A$ but adjacent to $B$, and the hypotenuse $5$ is the same for both. So one fraction is two ratios at once:

$$\\sin A = \\frac{3}{5} = \\cos B.$$

That is where the cosine gets its name: it is the sine of the **co**mplement. In this lesson we use $\\sin \\theta = \\cos(90^\\circ - \\theta)$ and its partners to find angles, to turn a ratio of one acute angle into a ratio of the other, and to solve equations.`,
    `直角三角形有两个锐角，它们的和是 $90^\\circ$：它们**互余**。各自从自己的顶点看，所以同样两条直角边在两个角之间互换角色。

在三边为 $3$、$4$、$5$，直角在 $C$ 的直角三角形 $ABC$ 中：

{{figure 0}}

直角边 $3$ 是 $A$ 的对边，却是 $B$ 的邻边，而斜边 $5$ 对两者相同。所以同一个分数同时是两个三角比：

$$\\sin A = \\frac{3}{5} = \\cos B.$$

余弦的名字就由此而来：它是**余**角的正弦。这节课用 $\\sin \\theta = \\cos(90^\\circ - \\theta)$ 及类似的关系求角，把一个锐角的三角比化为另一个锐角的三角比，并解方程。`,
  ),
  introFigures: [complementIntro],
  knowledgePoints: [
    {
      id: "cofunction-identities",
      figure: trigDrawings["cofunction-identities"],
      title: t("Sine and cosine of complementary angles", "互余角的正弦与余弦"),
      explanation: t(
        "In right triangle $ABC$ with the right angle at $C$, the acute angles are complementary: $\\angle B = 90^\\circ - \\angle A$. The side opposite $A$ is adjacent to $B$, so\n\n$$\\sin A = \\cos B, \\qquad \\cos A = \\sin B, \\qquad \\tan B = \\frac{1}{\\tan A} = \\cot A.$$\n\nFor any acute angle, $\\sin \\theta = \\cos(90^\\circ - \\theta)$. So $\\sin 28^\\circ = \\cos 62^\\circ$: if $\\sin 28^\\circ = \\cos x^\\circ$ with $x$ acute, then $x = 62$.\n\n> **Watch out.** The complement is $90^\\circ - \\theta$, not the supplement $180^\\circ - \\theta$: $\\cos 152^\\circ$ is negative and cannot equal $\\sin 28^\\circ$. And the angle changes with the ratio: $\\sin 28^\\circ$ is $\\cos 62^\\circ$, not $\\cos 28^\\circ$.",
        "在直角三角形 $ABC$ 中，直角在 $C$，两个锐角互余：$\\angle B = 90^\\circ - \\angle A$。$A$ 的对边是 $B$ 的邻边，所以\n\n$$\\sin A = \\cos B, \\qquad \\cos A = \\sin B, \\qquad \\tan B = \\frac{1}{\\tan A} = \\cot A.$$\n\n对任意锐角，$\\sin \\theta = \\cos(90^\\circ - \\theta)$。所以 $\\sin 28^\\circ = \\cos 62^\\circ$：若 $\\sin 28^\\circ = \\cos x^\\circ$ 且 $x$ 是锐角，则 $x = 62$。\n\n> **注意。** 余角是 $90^\\circ - \\theta$，不是补角 $180^\\circ - \\theta$：$\\cos 152^\\circ$ 是负数，不可能等于 $\\sin 28^\\circ$。另外换了三角比，角也要换：$\\sin 28^\\circ$ 等于 $\\cos 62^\\circ$，不是 $\\cos 28^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(5, 85);
        const f = rng.pick(["sin", "cos", "tan", "cot"] as const);
        const g = cofunction[f];
        const left = rng.bool();
        const eq = left ? `\\${f} ${a}^\\circ = \\${g} x^\\circ` : `\\${g} x^\\circ = \\${f} ${a}^\\circ`;
        const [ns, ds] = fnSides[f];
        const swap: Record<Side, Side> = { opp: "adj", adj: "opp", hyp: "hyp" };
        return {
          ...numberProblem({
            prompt: t(`Find the acute angle $x$ with $${eq}$.`, `求满足 $${eq}$ 的锐角 $x$。`),
            answer: 90 - a,
            form: "integer",
            solveFor: "x",
            wrong: [a, 180 - a, 90 + a],
            solution: paras(
              step(
                1,
                `put ${a}° in a right triangle`,
                `把 ${a}° 放进直角三角形`,
                t(
                  `Draw a right triangle with an angle of $${a}^\\circ$. Its angles add up to $180^\\circ$, so the other acute angle is $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$:\n\n{{figure 0}}`,
                  `画一个有 $${a}^\\circ$ 角的直角三角形。三角形内角和是 $180^\\circ$，所以另一个锐角是 $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "see the same sides from the other angle",
                "从另一个角看同样的边",
                t(
                  `$\\${f} ${a}^\\circ$ is ${sideNames[ns].en} over ${sideNames[ds].en}, seen from $${a}^\\circ$. From $${90 - a}^\\circ$ the legs swap roles, so the same fraction is ${sideNames[swap[ns]].en} over ${sideNames[swap[ds]].en}, the ${fnNames[g].en}:${steps(`\\${f} ${a}^\\circ = \\${g} (90^\\circ - ${a}^\\circ) = \\${g} ${90 - a}^\\circ`)}`,
                  `从 $${a}^\\circ$ 看，$\\${f} ${a}^\\circ$ 是${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}。从 $${90 - a}^\\circ$ 看，两条直角边互换角色，同一个分数就是${sideNames[swap[ns]]["zh-CN"]}比${sideNames[swap[ds]]["zh-CN"]}，即${fnNames[g]["zh-CN"]}：${steps(`\\${f} ${a}^\\circ = \\${g} (90^\\circ - ${a}^\\circ) = \\${g} ${90 - a}^\\circ`)}`,
                ),
              ),
              step(
                3,
                "read off x",
                "读出 x",
                t(
                  `On acute angles the ${fnNames[g].en} takes each value only once, so $x = ${90 - a}$.`,
                  `在锐角范围内，${fnNames[g]["zh-CN"]}的每个值只取一次，所以 $x = ${90 - a}$。`,
                ),
              ),
              check(
                `With a calculator, $\\${f} ${a}^\\circ \\approx ${d3(trig(f, a))}$ and $\\${g} ${90 - a}^\\circ \\approx ${d3(trig(g, 90 - a))}$, the same. And $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$, as the two acute angles of a right triangle must.`,
                `用计算器，$\\${f} ${a}^\\circ \\approx ${d3(trig(f, a))}$，$\\${g} ${90 - a}^\\circ \\approx ${d3(trig(g, 90 - a))}$，两者相同。并且 $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$，直角三角形的两个锐角理应如此。`,
              ),
            ),
          }),
          solutionFigures: [bothAngles(degTri(a), `${a}°`, `${90 - a}°`, [ns, ds])],
        };
      },
    },
    {
      id: "ratios-of-the-other-acute-angle",
      figure: trigDrawings["ratios-of-the-other-acute-angle"],
      title: t("Ratios of the other acute angle", "另一个锐角的三角比"),
      explanation: t(
        "In a right triangle, a ratio of one acute angle gives a ratio of the other. If $\\sin A = \\frac{8}{17}$ in right triangle $ABC$ with the right angle at $C$, then $\\cos B = \\frac{8}{17}$ too. If $\\tan A = \\frac{3}{7}$, then $\\tan B = \\frac{7}{3}$.\n\n> **Watch out.** From the other angle the legs swap, but the hypotenuse stays where it is: $\\cos B$ is $\\frac{8}{17}$, not $\\frac{17}{8}$, which no cosine can be. Only the tangent turns over, because both of its sides are legs.",
        "在直角三角形中，一个锐角的三角比可以给出另一个锐角的三角比。若直角三角形 $ABC$ 中直角在 $C$，且 $\\sin A = \\frac{8}{17}$，则 $\\cos B = \\frac{8}{17}$。若 $\\tan A = \\frac{3}{7}$，则 $\\tan B = \\frac{7}{3}$。\n\n> **注意。** 从另一个角看，两条直角边互换，但斜边不变：$\\cos B$ 是 $\\frac{8}{17}$，不是 $\\frac{17}{8}$，余弦不可能是它。只有正切会倒过来，因为它的两条边都是直角边。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, f, 20);
        const g = f === "tan" ? "tan" : cofunction[f];
        const answer = f === "tan" ? q(b, a) : q(a, b);
        const [R, U, V] = pickTriLetters(rng);
        const letters = `${R}${U}${V}`;
        const [ns, ds] = fnSides[f];
        const r = sidesFrom(f, a, b);
        const swap: Record<Side, Side> = { opp: "adj", adj: "opp", hyp: "hyp" };
        const values = { [ns]: `${a}`, [ds]: `${b}` } as Partial<Record<Side, string>>;
        const angU = toDeg(f === "sin" ? Math.asin(a / b) : f === "cos" ? Math.acos(a / b) : Math.atan(a / b));
        const uDeg = roundQ(angU);
        const vDeg = Q.of(90).sub(uDeg);
        const fromV =
          f === "tan"
            ? t(`the side $${b}$ is now opposite and the side $${a}$ adjacent`, `边 $${b}$ 成了对边，边 $${a}$ 成了邻边`)
            : t(
                `the side $${a}$ is now ${sideNames[swap[ns]].en} and $${b}$ is still the hypotenuse`,
                `边 $${a}$ 成了${sideNames[swap[ns]]["zh-CN"]}，$${b}$ 仍是斜边`,
              );
        return {
          ...numberProblem({
            prompt: t(
              `In right triangle $${R}${U}${V}$ with the right angle at $${R}$, $\\${f} ${U} = \\frac{${a}}{${b}}$. Find $\\${g} ${V}$.`,
              `在直角三角形 $${R}${U}${V}$ 中，直角在 $${R}$，$\\${f} ${U} = \\frac{${a}}{${b}}$。求 $\\${g} ${V}$。`,
            ),
            answer,
            form: "fraction",
            wrong: f === "tan" ? [q(a, b), q(b - a, b + a)] : [q(b, a), q(b - a, b)],
            solution: paras(
              step(
                1,
                `name the sides from angle ${U}`,
                `从角 ${U} 给边命名`,
                t(
                  `$\\${f} ${U} = \\frac{${a}}{${b}}$ is ${sideNames[ns].en} over ${sideNames[ds].en}, so seen from $${U}$ those sides are in the ratio $${a} : ${b}$:\n\n{{figure 0}}`,
                  `$\\${f} ${U} = \\frac{${a}}{${b}}$ 是${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}，所以从 $${U}$ 看，这两条边之比是 $${a} : ${b}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                `see them from angle ${V}`,
                `从角 ${V} 看`,
                t(`From $${V}$ the legs swap roles: ${fromV.en}.`, `从 $${V}$ 看，两条直角边互换角色：${fromV["zh-CN"]}。`),
              ),
              step(
                3,
                "form the ratio",
                "写出比",
                f === "tan"
                  ? t(
                      `The tangent of $${V}$ is its opposite side over its adjacent side, the reciprocal of $\\tan ${U}$:${steps(`\\tan ${V} = \\frac{1}{\\tan ${U}} = ${answer.toLatex()}`)}`,
                      `$${V}$ 的正切是它的对边比邻边，是 $\\tan ${U}$ 的倒数：${steps(`\\tan ${V} = \\frac{1}{\\tan ${U}} = ${answer.toLatex()}`)}`,
                    )
                  : t(
                      `The ${fnNames[g].en} of $${V}$ is ${sideNames[fnSides[g][0]].en} over the hypotenuse, the same fraction:${steps(`\\${g} ${V} = \\${f} ${U} = ${answer.toLatex()}`)}`,
                      `$${V}$ 的${fnNames[g]["zh-CN"]}是${sideNames[fnSides[g][0]]["zh-CN"]}比斜边，是同一个分数：${steps(`\\${g} ${V} = \\${f} ${U} = ${answer.toLatex()}`)}`,
                    ),
              ),
              check(
                `With a calculator, $${U} = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(uDeg)}^\\circ$, so $${V} \\approx 90^\\circ - ${dec(uDeg)}^\\circ = ${dec(vDeg)}^\\circ$, and $\\${g} ${dec(vDeg)}^\\circ \\approx ${d3(trig(g, vDeg.toNumber()))}$, close to $${answer.toLatex()} \\approx ${d3(answer.toNumber())}$.`,
                `用计算器，$${U} = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(uDeg)}^\\circ$，所以 $${V} \\approx 90^\\circ - ${dec(uDeg)}^\\circ = ${dec(vDeg)}^\\circ$，而 $\\${g} ${dec(vDeg)}^\\circ \\approx ${d3(trig(g, vDeg.toNumber()))}$，与 $${answer.toLatex()} \\approx ${d3(answer.toNumber())}$ 接近。`,
              ),
            ),
          }),
          figure: rightFigure(
            rng,
            rng.int(3, 6),
            rng.int(3, 6),
            { letters },
            `Right triangle ${R}${U}${V} with the right angle at ${R}.`,
            `直角三角形 ${R}${U}${V}，直角在 ${R}。`,
          ),
          solutionFigures: [bothAngles(rightTri(sNum(r.adj), sNum(r.opp), flatPose), U, V, [ns, ds], letters, values)],
        };
      },
    },
    {
      id: "equations-with-complementary-angles",
      figure: geometryDrawings2["trigonometric-functions-of-complementary-angles#equations-with-complementary-angles"],
      title: t("Equations with complementary angles", "关于互余角的方程"),
      explanation: t(
        "If $\\sin \\alpha = \\cos \\beta$ for acute angles $\\alpha$ and $\\beta$, then $\\alpha + \\beta = 90^\\circ$. So\n\n$$\\sin(2x + 10)^\\circ = \\cos(3x - 5)^\\circ$$\n\ngives $(2x + 10) + (3x - 5) = 90$, $5x + 5 = 90$, $x = 17$. Check: the angles are $44^\\circ$ and $46^\\circ$, both acute.\n\n> **Watch out.** Add the two angles and set the sum to $90$; do not set them equal. $2x + 10 = 3x - 5$ gives $x = 15$ and $\\sin 40^\\circ = \\cos 40^\\circ$, which is false: equal angles have equal sines, not equal sine and cosine.",
        "若锐角 $\\alpha$、$\\beta$ 满足 $\\sin \\alpha = \\cos \\beta$，则 $\\alpha + \\beta = 90^\\circ$。所以\n\n$$\\sin(2x + 10)^\\circ = \\cos(3x - 5)^\\circ$$\n\n给出 $(2x + 10) + (3x - 5) = 90$，$5x + 5 = 90$，$x = 17$。检验：两角为 $44^\\circ$ 和 $46^\\circ$，都是锐角。\n\n> **注意。** 要把两个角相加，令和等于 $90$；不要令它们相等。$2x + 10 = 3x - 5$ 给出 $x = 15$ 和 $\\sin 40^\\circ = \\cos 40^\\circ$，这是错的：相等的角正弦相等，而不是正弦等于余弦。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(3, 20);
          const a = rng.int(10, 80);
          const [p1, p2] = [rng.int(1, 5), rng.int(1, 5)];
          const d1 = a - p1 * x;
          const d2 = 90 - a - p2 * x;
          if (Math.abs(d1) > 40 || Math.abs(d2) > 40 || d1 === 0 || d2 === 0) continue;
          const [f, g] = rng.pick([
            ["sin", "cos"],
            ["cos", "sin"],
          ] as const);
          const sub = (p: number, d: number) => `${p === 1 ? "" : `${p} \\cdot `}${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
          const [ns, ds] = fnSides[f];
          return {
            ...numberProblem({
              prompt: t(
                `Both angles are acute and $\\${f}${angleTex(p1, d1)} = \\${g}${angleTex(p2, d2)}$. Find $x$.`,
                `两个角都是锐角，且 $\\${f}${angleTex(p1, d1)} = \\${g}${angleTex(p2, d2)}$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(d2 - d1, p1 - p2, x + 1), intOr(180 - d1 - d2, p1 + p2, x - 1)],
              solution: paras(
                step(
                  1,
                  "the angles are complementary",
                  "两个角互余",
                  t(
                    `Put the first angle in a right triangle. The ${fnNames[f].en} of it is ${sideNames[ns].en} over ${sideNames[ds].en}; seen from the other acute angle, the same fraction is that angle's ${fnNames[g].en}. So the ${fnNames[f].en} of one acute angle equals the ${fnNames[g].en} of another exactly when the two are the acute angles of one right triangle, and add up to $90^\\circ$:\n\n{{figure 0}}`,
                    `把第一个角放进直角三角形。它的${fnNames[f]["zh-CN"]}是${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}；从另一个锐角看，同一个分数是那个角的${fnNames[g]["zh-CN"]}。所以一个锐角的${fnNames[f]["zh-CN"]}等于另一个锐角的${fnNames[g]["zh-CN"]}，恰好当两者是同一个直角三角形的两个锐角，和为 $90^\\circ$：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "solve the equation",
                  "解方程",
                  t(
                    `Add the two angles and set the sum to $90$:${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}`,
                    `把两个角相加，令和等于 $90$：${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}`,
                  ),
                ),
                check(
                  `Put $x = ${x}$ back into the angles: $${sub(p1, d1)} = ${a}$ and $${sub(p2, d2)} = ${90 - a}$. Both are acute and $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$; with a calculator, $\\${f} ${a}^\\circ \\approx ${d3(trig(f, a))} \\approx \\${g} ${90 - a}^\\circ$.`,
                  `把 $x = ${x}$ 代回两个角：$${sub(p1, d1)} = ${a}$，$${sub(p2, d2)} = ${90 - a}$。两者都是锐角，且 $${a}^\\circ + ${90 - a}^\\circ = 90^\\circ$；用计算器，$\\${f} ${a}^\\circ \\approx ${d3(trig(f, a))} \\approx \\${g} ${90 - a}^\\circ$。`,
                ),
              ),
            }),
            solutionFigures: [bothAngles(degTri(a), `(${plain(p1, d1)})°`, `(${plain(p2, d2)})°`, [ns, ds])],
          };
        }
      },
    },
  ],
};

const specialAngles = [30, 45, 60] as const;

/** specialSwap is the ratio a learner confuses with f: sine with cosine, tangent with cotangent, secant with cosecant. */
const specialSwap = cofunction;

/** specialSides are the sides of the special right triangle seen from 30°, 45° or 60°: 1, 1, √2 and 1, √3, 2. */
const specialSides = (a: 30 | 45 | 60): Ratios =>
  a === 45
    ? { opp: int(1), adj: int(1), hyp: sqrtS(2) }
    : a === 30
      ? { opp: int(1), adj: sqrtS(3), hyp: int(2) }
      : { opp: sqrtS(3), adj: int(1), hyp: int(2) };

/** specialName names the special right triangle that has the angle a. */
const specialName = (a: 30 | 45 | 60) => (a === 45 ? "$45^\\circ$-$45^\\circ$-$90^\\circ$" : "$30^\\circ$-$60^\\circ$-$90^\\circ$");

/** specialView draws the special right triangle seen from the angle a, with the sides of a ratio in colour. */
function specialView(a: 30 | 45 | 60, use: readonly Side[]): Figure {
  const r = specialSides(a);
  return roleFigure(
    {
      tri: rightTri(sNum(r.adj), sNum(r.opp), flatPose),
      atU: true,
      values: { opp: sLabel(r.opp), adj: sLabel(r.adj), hyp: sLabel(r.hyp) },
      angle: `${a}°`,
      other: `${90 - a}°`,
      use,
    },
    `${a}°`,
  );
}

/** specialSidesText says which sides the special triangle has as seen from a, in words. */
function specialSidesText(a: 30 | 45 | 60): Text {
  const r = specialSides(a);
  return t(
    `In the ${specialName(a)} triangle, seen from $${a}^\\circ$, the opposite side is $${texS(r.opp)}$, the adjacent side is $${texS(r.adj)}$ and the hypotenuse is $${texS(r.hyp)}$`,
    `在 ${specialName(a)} 三角形中，从 $${a}^\\circ$ 看，对边是 $${texS(r.opp)}$，邻边是 $${texS(r.adj)}$，斜边是 $${texS(r.hyp)}$`,
  );
}

/** specialPair draws both special right triangles: 1, 1, √2 seen from 45°, and 1, √3, 2 seen from 30°, with 60° at the other corner. */
const specialPair: Figure = (() => {
  const a = rightTri(2, 2, flatPose);
  const b = rightTri(2 * Math.sqrt(3), 2, flatPose).map(([x, y]) => [x + 3.2, y] as Point) as unknown as Tri;
  return figure(
    [
      ...roleMarks({ tri: a, atU: true, values: { opp: "1", adj: "1", hyp: "√2" }, angle: "45°", other: "45°" }),
      ...roleMarks({ tri: b, atU: true, values: { opp: "1", adj: "√3", hyp: "2" }, angle: "30°", other: "60°" }),
    ],
    "The two special right triangles. Left: angles 45° and 45°; seen from either, the opposite side is 1, the adjacent side is 1 and the hypotenuse is √2. Right: angles 30° and 60°; seen from 30°, the opposite side is 1, the adjacent side is √3 and the hypotenuse is 2, and seen from 60° the two legs swap.",
    "两个特殊直角三角形。左：两个角都是 45°；从任一个看，对边是 1，邻边是 1，斜边是 √2。右：角为 30° 和 60°；从 30° 看，对边是 1，邻边是 √3，斜边是 2；从 60° 看，两条直角边互换。",
  );
})();

/** equilateralIntro draws an equilateral triangle of side 2 cut in half by an altitude, the right half seen from its 60° angle. */
const equilateralIntro: Figure = (() => {
  const h = Math.sqrt(3);
  const M: Point = [0, 0];
  const C: Point = [1, 0];
  const A: Point = [0, h];
  const B: Point = [-1, 0];
  return roleFigureWith(
    { tri: [M, C, A], atU: true, values: { opp: "√3", adj: "1", hyp: "2" }, angle: "60°", other: "30°", use: ["opp", "hyp"] },
    "60°",
    [
      { kind: "segment", a: A, b: B, dashed: true },
      { kind: "segment", a: B, b: M, dashed: true },
      { kind: "side", a: B, b: A, text: "2" },
    ],
    t(
      "It is half of an equilateral triangle of side 2, whose other half is dashed.",
      "它是边长为 2 的等边三角形的一半，另一半用虚线画出。",
    ),
  );
})();

export const specialTrigonometricRatios: TopicDef = {
  id: "special-trigonometric-ratios",
  title: t("Special Trigonometric Ratios", "特殊角的三角比"),
  summary: t(
    "Know the exact ratios of 30°, 45° and 60° from the special right triangles, and use them in calculations.",
    "由特殊直角三角形得出 30°、45°、60° 的精确三角比，并用它们计算。",
  ),
  prerequisites: ["the-reciprocal-trigonometric-ratios", "thirty-sixty-ninety-triangles", "isosceles-right-triangles"],
  encompasses: [
    { topic: "thirty-sixty-ninety-triangles", weight: 0.3 },
    { topic: "isosceles-right-triangles", weight: 0.2 },
    { topic: "the-trigonometric-ratios", weight: 0.3 },
    { topic: "the-reciprocal-trigonometric-ratios", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.6", "CCSS.HSF.TF.A.3"],
  intro: t(
    `A calculator gives $\\sin 60^\\circ \\approx 0.8660$, a decimal that never ends. For three angles we can do better and know the ratios exactly, because their right triangles can be built by hand.

Take an equilateral triangle with sides $2$; all its angles are $60^\\circ$. The altitude cuts it into two right triangles, each with hypotenuse $2$, a short leg $1$ (half the base) and angles $60^\\circ$ and $30^\\circ$. By the Pythagorean theorem the altitude is $\\sqrt{2^2 - 1^2} = \\sqrt{3}$:

{{figure 0}}

Seen from the $60^\\circ$ angle, the altitude $\\sqrt{3}$ is the opposite side, so

$$\\sin 60^\\circ = \\frac{\\sqrt{3}}{2} \\approx 0.8660,$$

exactly the calculator's value, now without rounding. In this lesson we read the exact ratios of $30^\\circ$, $45^\\circ$ and $60^\\circ$ off the special right triangles, go back from a value to its angle, and calculate with them exactly.`,
    `计算器给出 $\\sin 60^\\circ \\approx 0.8660$，一个无限不循环的小数。对三个角我们能做得更好，精确地知道它们的三角比，因为它们的直角三角形可以亲手画出来。

取一个边长为 $2$ 的等边三角形，它的每个角都是 $60^\\circ$。高把它分成两个直角三角形，每个的斜边是 $2$，短直角边是 $1$（底边的一半），两个锐角是 $60^\\circ$ 和 $30^\\circ$。由勾股定理，高是 $\\sqrt{2^2 - 1^2} = \\sqrt{3}$：

{{figure 0}}

从 $60^\\circ$ 角看，高 $\\sqrt{3}$ 是对边，所以

$$\\sin 60^\\circ = \\frac{\\sqrt{3}}{2} \\approx 0.8660,$$

正是计算器的值，只是不再需要近似。这节课从特殊直角三角形读出 $30^\\circ$、$45^\\circ$、$60^\\circ$ 的精确三角比，由值反求角，并用它们做精确计算。`,
  ),
  introFigures: [equilateralIntro],
  knowledgePoints: [
    {
      id: "exact-values",
      figure: trigDrawings["exact-values"],
      title: t("Exact values", "精确值"),
      explanation: t(
        "Read the ratios off the special right triangles. The $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle has sides $1$, $1$, $\\sqrt{2}$; the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle has sides $1$, $\\sqrt{3}$, $2$, with $1$ opposite $30^\\circ$:\n\n| | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\nThe reciprocal ratios follow: $\\sec 30^\\circ = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$. With a coefficient: $4\\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$.\n\n> **Watch out.** It is easy to swap $\\frac{1}{2}$ and $\\frac{\\sqrt{3}}{2}$. The shortest side faces the smallest angle, so the side $1$ is opposite $30^\\circ$: $\\sin 30^\\circ = \\frac{1}{2}$, and $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$. If unsure, draw the triangle rather than recall the table.",
        "从特殊直角三角形读出三角比。$45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形三边为 $1$、$1$、$\\sqrt{2}$；$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形三边为 $1$、$\\sqrt{3}$、$2$，其中 $1$ 对着 $30^\\circ$：\n\n| | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\n倒数三角比随之可得：$\\sec 30^\\circ = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$。带系数时：$4\\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$。\n\n> **注意。** $\\frac{1}{2}$ 和 $\\frac{\\sqrt{3}}{2}$ 很容易弄反。最短的边对着最小的角，所以边 $1$ 对着 $30^\\circ$：$\\sin 30^\\circ = \\frac{1}{2}$，$\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$。拿不准时，画出三角形，而不是硬背表格。",
      ),
      generate(rng) {
        const f = rng.pick(fns6);
        const a = rng.pick(specialAngles);
        const c = rng.pick([1, 1, 2, 3, 4, 6]);
        const v = specialS(f, a);
        const answer = mulS(int(c), v);
        const coef = c === 1 ? "" : `${c}`;
        const other = (a === 30 ? 60 : a === 60 ? 30 : 30) as 30 | 60;
        const r = specialSides(a);
        const [ns, ds] = fnSides[f];
        const raw = `\\frac{${texS(r[ns])}}{${texS(r[ds])}}`;
        const simple = raw === texS(v);
        const tidy = r[ds][1] === 1 ? t("; simplify", "，再化简") : t("; simplify and rationalize", "，再化简并有理化");
        const parts: Text[] = [
          step(1, "draw the special triangle", "画出特殊三角形", cat(specialSidesText(a), t(":\n\n{{figure 0}}", "：\n\n{{figure 0}}"))),
          step(
            2,
            "form the ratio",
            "写出比",
            t(
              `The ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}${simple ? "" : tidy.en}:${steps(simple ? `\\${f} ${a}^\\circ = ${raw}` : `\\${f} ${a}^\\circ = ${raw} = ${texS(v)}`)}`,
              `${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}${simple ? "" : tidy["zh-CN"]}：${steps(simple ? `\\${f} ${a}^\\circ = ${raw}` : `\\${f} ${a}^\\circ = ${raw} = ${texS(v)}`)}`,
            ),
          ),
        ];
        if (c !== 1) {
          parts.push(
            step(
              3,
              `multiply by ${c}`,
              `乘以 ${c}`,
              t(
                `Multiply and simplify:${steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
                `相乘并化简：${steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
              ),
            ),
          );
        }
        const approx = d3(c * trig(f, a));
        return {
          ...radicalProblem({
            prompt: t(
              `Find the exact value of $${coef}\\${f} ${a}^\\circ$ in simplest radical form.`,
              `求 $${coef}\\${f} ${a}^\\circ$ 的精确值，答案写成最简根式。`,
            ),
            answer,
            wrong: [
              texS(mulS(int(c), specialS(specialSwap[f], a))),
              texS(mulS(int(c), specialS(f, other))),
              texS(mulS(int(c), specialS(reciprocalOf[f], a))),
            ],
            solution: paras(
              ...parts,
              check(
                `With a calculator, $${coef}\\${f} ${a}^\\circ \\approx ${approx}$, and $${texS(answer)} \\approx ${d3(sNum(answer))}$, the same.`,
                `用计算器，$${coef}\\${f} ${a}^\\circ \\approx ${approx}$，而 $${texS(answer)} \\approx ${d3(sNum(answer))}$，两者相同。`,
              ),
            ),
          }),
          solutionFigures: [specialView(a, [ns, ds])],
        };
      },
    },
    {
      id: "special-angles-from-exact-values",
      figure: geometryDrawings2["special-trigonometric-ratios#special-angles-from-exact-values"],
      title: t("Special angles from exact values", "由精确值求特殊角"),
      explanation: t(
        "Read the table backwards: if $\\tan \\theta = \\sqrt{3}$ and $\\theta$ is acute, then $\\theta = 60^\\circ$. First isolate the ratio: $2\\cos \\theta = \\sqrt{2}$ gives $\\cos \\theta = \\frac{\\sqrt{2}}{2}$, so $\\theta = 45^\\circ$.\n\n> **Watch out.** Divide by the coefficient before reading the table: $2\\cos \\theta = \\sqrt{2}$ does not say $\\cos \\theta = \\sqrt{2}$, which no cosine can be. And the same value belongs to different angles for different ratios: $\\frac{\\sqrt{3}}{2}$ is $\\sin 60^\\circ$ but $\\cos 30^\\circ$.",
        "把表反过来读：若 $\\tan \\theta = \\sqrt{3}$ 且 $\\theta$ 是锐角，则 $\\theta = 60^\\circ$。先把三角比单独留在一边：由 $2\\cos \\theta = \\sqrt{2}$ 得 $\\cos \\theta = \\frac{\\sqrt{2}}{2}$，所以 $\\theta = 45^\\circ$。\n\n> **注意。** 查表之前先除以系数：$2\\cos \\theta = \\sqrt{2}$ 并不是说 $\\cos \\theta = \\sqrt{2}$，余弦不可能是它。另外同一个值在不同的三角比下对应不同的角：$\\frac{\\sqrt{3}}{2}$ 是 $\\sin 60^\\circ$，却是 $\\cos 30^\\circ$。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const a = rng.pick(specialAngles);
        const c = rng.int(1, 4);
        const v = specialS(f, a);
        const rhs = texS(mulS(int(c), v));
        const coef = c === 1 ? "" : `${c}`;
        const others = specialAngles.filter((b) => b !== a);
        const isolate = c === 1 ? "" : steps(`\\${f} \\theta = ${rhs} \\div ${c} = ${texS(v)}`);
        const r = specialSides(a);
        const [ns, ds] = fnSides[f];
        const parts: Text[] = [];
        if (c !== 1)
          parts.push(
            step(1, "isolate the ratio", "把三角比单独留下", t(`Divide both sides by $${c}$:${isolate}`, `两边除以 $${c}$：${isolate}`)),
          );
        parts.push(
          step(
            parts.length + 1,
            "find the angle in a special triangle",
            "在特殊三角形中找角",
            t(
              `The ${fnNames[f].en} is ${sideNames[ns].en} over ${sideNames[ds].en}. ${specialSidesText(a).en}, so there the ${fnNames[f].en} is $\\frac{${texS(r[ns])}}{${texS(r[ds])}}${`\\frac{${texS(r[ns])}}{${texS(r[ds])}}` === texS(v) ? "" : ` = ${texS(v)}`}$:\n\n{{figure 0}}\n\nOn acute angles the ${fnNames[f].en} takes each value only once, so $\\theta = ${a}^\\circ$.`,
              `${fnNames[f]["zh-CN"]}等于${sideNames[ns]["zh-CN"]}比${sideNames[ds]["zh-CN"]}。${specialSidesText(a)["zh-CN"]}，所以那里的${fnNames[f]["zh-CN"]}是 $\\frac{${texS(r[ns])}}{${texS(r[ds])}}${`\\frac{${texS(r[ns])}}{${texS(r[ds])}}` === texS(v) ? "" : ` = ${texS(v)}`}$：\n\n{{figure 0}}\n\n在锐角范围内，${fnNames[f]["zh-CN"]}的每个值只取一次，所以 $\\theta = ${a}^\\circ$。`,
            ),
          ),
        );
        return {
          ...numberProblem({
            prompt: t(
              `Find the acute angle $\\theta$ with $${coef}\\${f} \\theta = ${rhs}$.`,
              `求满足 $${coef}\\${f} \\theta = ${rhs}$ 的锐角 $\\theta$。`,
            ),
            answer: a,
            form: "integer",
            unit: "°",
            wrong: specialAngles.filter((b) => b !== a),
            solution: paras(
              ...parts,
              check(
                `The other special angles give other values: ${others.map((b) => `$\\${f} ${b}^\\circ = ${texS(specialS(f, b))}$`).join(" and ")}. Only $${a}^\\circ$ gives $${texS(v)}$.`,
                `其他特殊角给出别的值：${others.map((b) => `$\\${f} ${b}^\\circ = ${texS(specialS(f, b))}$`).join("，")}。只有 $${a}^\\circ$ 给出 $${texS(v)}$。`,
              ),
            ),
          }),
          solutionFigures: [specialView(a, [ns, ds])],
        };
      },
    },
    {
      id: "expressions-with-special-ratios",
      title: t("Expressions with special ratios", "含特殊角三角比的式子"),
      explanation: t(
        "The sine, cosine and tangent of $30^\\circ$, $45^\\circ$ and $60^\\circ$ have exact values with square roots, read off the two special right triangles:\n\n{{figure 0}}\n\nUsing them keeps the answer exact instead of a rounded decimal. Replace each ratio by its exact value, then simplify:\n\n$$4\\sin 60^\\circ \\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = 4 \\cdot \\frac{3}{4} = 3,$$\n\n$$\\frac{\\tan 60^\\circ}{\\sin 45^\\circ} = \\sqrt{3} \\div \\frac{\\sqrt{2}}{2} = \\frac{2\\sqrt{3}}{\\sqrt{2}} = \\sqrt{6}.$$\n\n> **Watch out.** $\\sin 60^\\circ \\cos 30^\\circ$ is a product of two numbers, not the sine of a product of angles: it is not $\\sin 1800^\\circ$, and not $\\sin 90^\\circ$ either. Replace each ratio separately before combining anything.",
        "$30^\\circ$、$45^\\circ$ 和 $60^\\circ$ 的正弦、余弦和正切都有含根号的精确值，可以从两个特殊直角三角形读出：\n\n{{figure 0}}\n\n用它们计算，答案就是精确值而不是近似的小数。把每个三角比换成精确值，再化简：\n\n$$4\\sin 60^\\circ \\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = 4 \\cdot \\frac{3}{4} = 3,$$\n\n$$\\frac{\\tan 60^\\circ}{\\sin 45^\\circ} = \\sqrt{3} \\div \\frac{\\sqrt{2}}{2} = \\frac{2\\sqrt{3}}{\\sqrt{2}} = \\sqrt{6}.$$\n\n> **注意。** $\\sin 60^\\circ \\cos 30^\\circ$ 是两个数的积，不是角的积的正弦：它不是 $\\sin 1800^\\circ$，也不是 $\\sin 90^\\circ$。先把每个三角比分别换成精确值，再进行运算。",
      ),
      figures: [specialPair],
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const g = rng.pick(["sin", "cos", "tan"] as const);
        const a = rng.pick(specialAngles);
        const b = rng.pick(specialAngles);
        const divide = rng.bool(0.35);
        const c = divide ? 1 : rng.pick([1, 2, 3, 4, 6, 8]);
        const [va, vb] = [specialS(f, a), specialS(g, b)];
        const combine = (x: S, y: S) => (divide ? divS(x, y) : mulS(mulS(int(c), x), y));
        const answer = combine(va, vb);
        const coef = c === 1 ? "" : `${c}`;
        const expr = divide ? `\\frac{\\${f} ${a}^\\circ}{\\${g} ${b}^\\circ}` : `${coef}\\${f} ${a}^\\circ \\${g} ${b}^\\circ`;
        const sub = divide ? `\\frac{${texS(va)}}{${texS(vb)}}` : `${c === 1 ? "" : `${c} \\cdot `}${texS(va)} \\cdot ${texS(vb)}`;
        const approx = divide ? trig(f, a) / trig(g, b) : c * trig(f, a) * trig(g, b);
        return {
          ...radicalProblem({
            prompt: t(`Find the exact value of $${expr}$ in simplest radical form.`, `求 $${expr}$ 的精确值，答案写成最简根式。`),
            answer,
            wrong: [
              texS(combine(specialS(specialSwap[f], a), vb)),
              texS(combine(va, specialS(specialSwap[g], b))),
              texS(divide ? divS(vb, va) : mulS(va, vb)),
            ],
            solution: paras(
              step(
                1,
                "read each ratio off a special triangle",
                "从特殊三角形读出每个比",
                t(
                  `Find each angle in its special triangle and read the ratio from the sides seen from it:\n\n{{figure 0}}${steps(`\\${f} ${a}^\\circ = ${texS(va)}`, `\\${g} ${b}^\\circ = ${texS(vb)}`)}`,
                  `在特殊三角形中找到每个角，从这个角看边，读出三角比：\n\n{{figure 0}}${steps(`\\${f} ${a}^\\circ = ${texS(va)}`, `\\${g} ${b}^\\circ = ${texS(vb)}`)}`,
                ),
              ),
              step(
                2,
                "substitute and simplify",
                "代入并化简",
                t(
                  `Replace each ratio by its value, then ${divide ? "divide, rationalizing if needed" : "multiply"}:${chain(`${expr} = ${sub}`, `= ${texS(answer)}`)}`,
                  `把每个三角比换成它的值，再${divide ? "相除，必要时有理化" : "相乘"}：${chain(`${expr} = ${sub}`, `= ${texS(answer)}`)}`,
                ),
              ),
              check(
                `With a calculator, $${expr} \\approx ${d3(approx)}$, and $${texS(answer)} \\approx ${d3(sNum(answer))}$, the same.`,
                `用计算器，$${expr} \\approx ${d3(approx)}$，而 $${texS(answer)} \\approx ${d3(sNum(answer))}$，两者相同。`,
              ),
            ),
          }),
          solutionFigures: [specialPair],
        };
      },
    },
    {
      id: "exact-sides-with-special-angles",
      figure: trigDrawings["exact-sides-with-special-angles"],
      title: t("Exact sides with special angles", "用特殊角求精确边长"),
      explanation: t(
        "With a special angle, trigonometry gives exact sides. In a right triangle with a $60^\\circ$ angle whose adjacent side is $8$, the opposite side is $8 \\tan 60^\\circ = 8\\sqrt{3}$, and the hypotenuse is\n\n$$\\frac{8}{\\cos 60^\\circ} = \\frac{8}{\\frac{1}{2}} = 16.$$\n\n> **Watch out.** Dividing by a fraction multiplies by its reciprocal: $\\frac{8}{\\frac{1}{2}} = 16$, not $4$. A hypotenuse of $4$ would be shorter than the leg $8$, which is impossible.",
        "遇到特殊角时，三角比给出精确的边长。在有一个 $60^\\circ$ 角、它的邻边为 $8$ 的直角三角形中，对边是 $8 \\tan 60^\\circ = 8\\sqrt{3}$，斜边是\n\n$$\\frac{8}{\\cos 60^\\circ} = \\frac{8}{\\frac{1}{2}} = 16.$$\n\n> **注意。** 除以一个分数等于乘以它的倒数：$\\frac{8}{\\frac{1}{2}} = 16$，不是 $4$。斜边为 $4$ 就比直角边 $8$ 还短，这不可能。",
      ),
      generate(rng) {
        const c = rng.pick([...multiplyCases, ...divideCases]);
        const a = rng.pick(specialAngles);
        const n = rng.int(2, 20);
        const divide = fnSides[c.fn][1] === c.ask;
        const v = specialS(c.fn, a);
        const answer = divide ? divS(int(n), v) : mulS(int(n), v);
        const labels = { [c.known]: `${n}`, [c.ask]: "x" } as Partial<Record<Side, string>>;
        const solve = divide ? `x = \\frac{${n}}{${texS(v)}} = ${texS(answer)}` : `x = ${n} \\cdot ${texS(v)} = ${texS(answer)}`;
        const others = (["sin", "cos", "tan"] as const).filter((g) => g !== c.fn);
        const tri = angleTri(rng, a);
        const x = sNum(answer);
        const back = divide ? n / x : x / n;
        const size = sizeCheck(c, a, n, roundQ(x, 2));
        return {
          ...radicalProblem({
            prompt: t("Find $x$ exactly, in simplest radical form.", "求 $x$ 的精确值，答案写成最简根式。"),
            answer,
            wrong: [
              texS(divide ? mulS(int(n), v) : divS(int(n), v)),
              ...others.map((g) => texS(divide ? divS(int(n), specialS(g, a)) : mulS(int(n), specialS(g, a)))),
            ],
            solution: paras(
              step(
                1,
                `name the sides from the ${a}° angle`,
                `从 ${a}° 角给边命名`,
                t(
                  `Seen from the $${a}^\\circ$ angle, $x$ is ${sideNames[c.ask].en} and $${n}$ is ${sideNames[c.known].en}:\n\n{{figure 0}}`,
                  `从 $${a}^\\circ$ 角看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${n}$ 是${sideNames[c.known]["zh-CN"]}：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "choose the ratio",
                "选择三角比",
                t(
                  `The ${fnNames[c.fn].en} links them, and from the special triangle $\\${c.fn} ${a}^\\circ = ${texS(v)}$:${steps(ratioTex(c.fn, `${a}^\\circ`, labels))}`,
                  `联系两者的是${fnNames[c.fn]["zh-CN"]}，由特殊三角形，$\\${c.fn} ${a}^\\circ = ${texS(v)}$：${steps(ratioTex(c.fn, `${a}^\\circ`, labels))}`,
                ),
              ),
              step(
                3,
                "solve exactly",
                "精确求解",
                divide
                  ? t(
                      `$x$ is underneath, so $x$ is $${n}$ divided by the exact value; simplify and rationalize:${steps(solve)}`,
                      `$x$ 在分母上，所以 $x$ 等于 $${n}$ 除以这个精确值；再化简并有理化：${steps(solve)}`,
                    )
                  : t(`$x$ is on top, so multiply by $${n}$:${steps(solve)}`, `$x$ 在分子上，所以乘以 $${n}$：${steps(solve)}`),
              ),
              check(
                `As a decimal, $x \\approx ${dec(roundQ(x, 2))}$, and the ratio of the sides is $${divide ? `\\frac{${n}}{${dec(roundQ(x, 2))}}` : `\\frac{${dec(roundQ(x, 2))}}{${n}}`} \\approx ${d3(back)}$, the same as $${texS(v)} \\approx ${d3(sNum(v))}$. ${size.en}`,
                `化成小数，$x \\approx ${dec(roundQ(x, 2))}$，两边之比 $${divide ? `\\frac{${n}}{${dec(roundQ(x, 2))}}` : `\\frac{${dec(roundQ(x, 2))}}{${n}}`} \\approx ${d3(back)}$，与 $${texS(v)} \\approx ${d3(sNum(v))}$ 相同。${size["zh-CN"]}`,
              ),
            ),
          }),
          figure: figure(
            rightMarks(tri, { sides: angleFigureLabels(labels), atU: `${a}°` }),
            `A right triangle with a ${a}° angle; ${sideNames[c.known].en} is ${n} and ${sideNames[c.ask].en} is x.`,
            `一个直角三角形，有一个 ${a}° 的角；${sideNames[c.known]["zh-CN"]}为 ${n}，${sideNames[c.ask]["zh-CN"]}为 x。`,
          ),
          solutionFigures: [roleFigure({ tri, atU: true, values: labels, angle: `${a}°`, use: fnSides[c.fn] }, `${a}°`)],
        };
      },
    },
  ],
};

/** plotIntro draws a right triangle with the leg 10 m adjacent to a 30° angle and the other leg h, seen from the 30° angle. */
const plotIntro = roleFigure(
  { tri: rightTri(10, 10 * Math.tan(rad(30)), flatPose), atU: true, values: { adj: "10 m", opp: "h" }, angle: "30°", use: ["opp", "adj"] },
  "30°",
);

/** halfSquareCheck compares a right triangle's area with the area n²/2 it would have if both legs were n, as at 45°. */
function halfSquareCheck(n: number, longer: boolean | undefined, answer: Q): Text {
  const half = Q.of(n * n, 2);
  if (longer === undefined) {
    return check(
      `At $45^\\circ$ the legs are equal, so the area is $\\frac{1}{2} \\cdot ${n}^2 = ${dec(half)}$, which rounds to $${dec(answer)}$.`,
      `$45^\\circ$ 时两条直角边相等，面积是 $\\frac{1}{2} \\cdot ${n}^2 = ${dec(half)}$，取近似值就是 $${dec(answer)}$。`,
    );
  }
  return check(
    `If the angle were $45^\\circ$, the legs would be equal and the area would be $\\frac{1}{2} \\cdot ${n}^2 = ${dec(half)}$. Here the other leg is ${longer ? "longer" : "shorter"} than $${n}$, so the area must be ${longer ? "more" : "less"}, and $${dec(answer)} ${longer ? ">" : "<"} ${dec(half)}$.`,
    `如果这个角是 $45^\\circ$，两条直角边相等，面积是 $\\frac{1}{2} \\cdot ${n}^2 = ${dec(half)}$。这里另一条直角边比 $${n}$ ${longer ? "长" : "短"}，所以面积应该更${longer ? "大" : "小"}，而 $${dec(answer)} ${longer ? ">" : "<"} ${dec(half)}$。`,
  );
}

export const calculatingAreasOfRightTrianglesUsingTrigonometry: TopicDef = {
  id: "calculating-areas-of-right-triangles-using-trigonometry",
  title: t("Calculating Areas of Right Triangles Using Trigonometry", "用三角比求直角三角形的面积"),
  summary: t(
    "Find the legs of a right triangle with trigonometry to compute its area, and the area of a triangle from two sides and the included angle.",
    "用三角比求直角三角形的直角边并计算面积，以及由两边及其夹角求三角形的面积。",
  ),
  prerequisites: ["calculating-side-lengths-of-right-triangles-using-trigonometry", "area-of-triangles"],
  encompasses: [
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.5 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.8", "CCSS.HSG.SRT.D.9"],
  intro: t(
    `The area of a triangle is half its base times its height. In a right triangle the two legs are perpendicular, so one is the base and the other the height: the area is half the product of the legs. When only one leg is known, trigonometry finds the other.

A plot of land is a right triangle. One leg runs $10$ m along a road, and at its end the far side leaves the road at $30^\\circ$:

{{figure 0}}

Seen from the $30^\\circ$ angle, the road is the adjacent leg and the unknown leg $h$ is opposite, so $h = 10 \\tan 30^\\circ \\approx 5.774$ m. Then

$$A = \\frac{1}{2} \\cdot 10 \\cdot 10 \\tan 30^\\circ \\approx 28.9\\text{ m}^2.$$

The angle is under $45^\\circ$, so $h$ is shorter than $10$ and the area is less than $\\frac{1}{2} \\cdot 10^2 = 50$, as it is. In this lesson we find areas from a leg and an angle, from the hypotenuse and an angle, and then of any triangle from two sides and the angle between them.`,
    `三角形的面积是底乘高的一半。直角三角形的两条直角边互相垂直，一条是底，另一条就是高：面积是两条直角边之积的一半。只知道一条直角边时，用三角比求另一条。

一块地是直角三角形。一条直角边沿公路长 $10$ m，在它的端点，另一边以 $30^\\circ$ 离开公路：

{{figure 0}}

从 $30^\\circ$ 角看，公路是邻边，未知的直角边 $h$ 是对边，所以 $h = 10 \\tan 30^\\circ \\approx 5.774$ m。于是

$$A = \\frac{1}{2} \\cdot 10 \\cdot 10 \\tan 30^\\circ \\approx 28.9\\text{ m}^2.$$

这个角小于 $45^\\circ$，所以 $h$ 比 $10$ 短，面积小于 $\\frac{1}{2} \\cdot 10^2 = 50$，确实如此。这节课由直角边和角、由斜边和角求面积，再由两边及其夹角求任意三角形的面积。`,
  ),
  introFigures: [plotIntro],
  knowledgePoints: [
    {
      id: "area-from-a-leg-and-an-angle",
      figure: trigDrawings["area-from-a-leg-and-an-angle"],
      title: t("Area from a leg and an angle", "由直角边和角求面积"),
      explanation: t(
        "The area of a right triangle is half the product of its legs. If one leg and an acute angle are known, find the other leg with the tangent. With adjacent leg $6$ and an angle of $35^\\circ$, the other leg is $6 \\tan 35^\\circ$, so\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6 \\tan 35^\\circ = 18 \\tan 35^\\circ \\approx 12.6.$$\n\n> **Watch out.** Base and height must be the two legs, which are perpendicular; the tangent links them. $6 \\sin 35^\\circ$ is not a side of this triangle at all, and leaving out the $\\frac{1}{2}$ gives the area of the whole rectangle, $25.2$.",
        "直角三角形的面积是两条直角边之积的一半。若已知一条直角边和一个锐角，用正切求另一条直角边。邻边为 $6$、角为 $35^\\circ$ 时，另一条直角边是 $6 \\tan 35^\\circ$，所以\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6 \\tan 35^\\circ = 18 \\tan 35^\\circ \\approx 12.6.$$\n\n> **注意。** 底和高必须是两条互相垂直的直角边，联系它们的是正切。$6 \\sin 35^\\circ$ 根本不是这个三角形的边；漏掉 $\\frac{1}{2}$ 则得到整个长方形的面积 $25.2$。",
      ),
      generate(rng) {
        for (;;) {
          const th = rng.int(20, 70);
          const n = rng.int(3, 25);
          const adjacent = rng.bool();
          const tn = trig("tan", th);
          const other = adjacent ? n * tn : n / tn;
          const area = (n * other) / 2;
          const answer = rounded(area, adjacent ? (n * n * t4(tn)) / 2 : (n * n) / t4(tn) / 2);
          if (!answer) continue;
          const legTex = adjacent ? `${n} \\tan ${th}^\\circ` : `\\frac{${n}}{\\tan ${th}^\\circ}`;
          const tri = angleTri(rng, th);
          const values = adjacent ? { adj: `${n}`, opp: "y" } : { opp: `${n}`, adj: "y" };
          const longer = th === 45 ? undefined : adjacent ? th > 45 : th < 45;
          const ratio = adjacent ? `\\tan ${th}^\\circ = \\frac{y}{${n}}` : `\\tan ${th}^\\circ = \\frac{${n}}{y}`;
          return {
            ...numberProblem({
              prompt: t("Find the area of the triangle. Round to the nearest tenth.", "求这个三角形的面积，结果精确到十分位。"),
              answer,
              form: "decimal",
              wrong: [
                roundQ(n * other),
                roundQ((n * (adjacent ? n * trig("sin", th) : n / trig("sin", th))) / 2),
                roundQ((n * (adjacent ? n / tn : n * tn)) / 2),
              ],
              solution: paras(
                step(
                  1,
                  `name the legs from the ${th}° angle`,
                  `从 ${th}° 角给直角边命名`,
                  t(
                    `The legs are the base and the height. Seen from the $${th}^\\circ$ angle, the leg $${n}$ is ${adjacent ? "adjacent" : "opposite"} and the other leg $y$ is ${adjacent ? "opposite" : "adjacent"}:\n\n{{figure 0}}`,
                    `两条直角边就是底和高。从 $${th}^\\circ$ 角看，直角边 $${n}$ 是${adjacent ? "邻边" : "对边"}，另一条直角边 $y$ 是${adjacent ? "对边" : "邻边"}：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "find the other leg",
                  "求另一条直角边",
                  t(
                    `The tangent links the two legs:${chain(ratio, `y = ${legTex} \\approx ${dec(roundQ(other, 3))}`)}`,
                    `联系两条直角边的是正切：${chain(ratio, `y = ${legTex} \\approx ${dec(roundQ(other, 3))}`)}`,
                  ),
                ),
                step(
                  3,
                  "take half the product of the legs",
                  "取两条直角边之积的一半",
                  t(
                    `Keep $y$ unrounded until the end:${steps(`A = \\frac{1}{2} \\cdot ${n} \\cdot ${legTex} \\approx ${dec(answer)}`)}`,
                    `$y$ 先不取近似值，到最后再取：${steps(`A = \\frac{1}{2} \\cdot ${n} \\cdot ${legTex} \\approx ${dec(answer)}`)}`,
                  ),
                ),
                halfSquareCheck(n, longer, answer),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: angleFigureLabels(adjacent ? { adj: `${n}` } : { opp: `${n}` }), atU: `${th}°` }),
              `A right triangle with a ${th}° angle and the leg ${adjacent ? "adjacent to" : "opposite"} it equal to ${n}.`,
              `一个直角三角形，有一个 ${th}° 的角，它的${adjacent ? "邻边" : "对边"}为 ${n}。`,
            ),
            solutionFigures: [roleFigure({ tri, atU: true, values, angle: `${th}°`, use: ["opp", "adj"] }, `${th}°`)],
          };
        }
      },
    },
    {
      id: "area-from-the-hypotenuse-and-an-angle",
      figure: trigDrawings["area-from-the-hypotenuse-and-an-angle"],
      title: t("Area from the hypotenuse and an angle", "由斜边和角求面积"),
      explanation: t(
        "If the hypotenuse $c$ and an acute angle $\\theta$ are known, the legs are $c \\sin \\theta$ and $c \\cos \\theta$, so\n\n$$A = \\frac{1}{2} c \\sin \\theta \\cdot c \\cos \\theta.$$\n\nWith $c = 10$ and $\\theta = 40^\\circ$: $A = \\frac{1}{2} \\cdot 10 \\sin 40^\\circ \\cdot 10 \\cos 40^\\circ \\approx \\frac{1}{2} \\cdot 6.428 \\cdot 7.660 \\approx 24.6$.\n\n> **Watch out.** The hypotenuse is not a height: it is not perpendicular to either leg. $\\frac{1}{2} \\cdot 10 \\cdot 10 \\sin 40^\\circ \\approx 32.1$ multiplies the hypotenuse by a leg; find both legs first.",
        "若已知斜边 $c$ 和锐角 $\\theta$，两条直角边是 $c \\sin \\theta$ 和 $c \\cos \\theta$，所以\n\n$$A = \\frac{1}{2} c \\sin \\theta \\cdot c \\cos \\theta.$$\n\n$c = 10$，$\\theta = 40^\\circ$ 时：$A = \\frac{1}{2} \\cdot 10 \\sin 40^\\circ \\cdot 10 \\cos 40^\\circ \\approx \\frac{1}{2} \\cdot 6.428 \\cdot 7.660 \\approx 24.6$。\n\n> **注意。** 斜边不是高：它与两条直角边都不垂直。$\\frac{1}{2} \\cdot 10 \\cdot 10 \\sin 40^\\circ \\approx 32.1$ 是斜边乘一条直角边；要先求出两条直角边。",
      ),
      generate(rng) {
        for (;;) {
          const th = rng.int(20, 70);
          const c = rng.int(4, 30);
          const [s, co] = [trig("sin", th), trig("cos", th)];
          const area = (c * c * s * co) / 2;
          const answer = rounded(area, (c * c * t4(s) * t4(co)) / 2);
          if (!answer || th === 45) continue;
          const tri = angleTri(rng, th);
          const [x, y] = [roundQ(c * s, 3), roundQ(c * co, 3)];
          const sq = roundQ(x.toNumber() ** 2 + y.toNumber() ** 2, 2);
          return {
            ...numberProblem({
              prompt: t("Find the area of the triangle. Round to the nearest tenth.", "求这个三角形的面积，结果精确到十分位。"),
              answer,
              form: "decimal",
              wrong: [roundQ(c * c * s * co), roundQ((c * c * s) / 2), roundQ((c * c * trig("tan", th)) / 2)],
              solution: paras(
                step(
                  1,
                  `name the sides from the ${th}° angle`,
                  `从 ${th}° 角给边命名`,
                  t(
                    `The hypotenuse $${c}$ is known; the area needs the two legs. Seen from the $${th}^\\circ$ angle, call the opposite leg $x$ and the adjacent leg $y$:\n\n{{figure 0}}`,
                    `已知斜边 $${c}$；求面积需要两条直角边。从 $${th}^\\circ$ 角看，设对边为 $x$，邻边为 $y$：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "find both legs",
                  "求两条直角边",
                  t(
                    `The sine gives the opposite leg and the cosine the adjacent leg, each from the hypotenuse:${steps(`x = ${c} \\sin ${th}^\\circ \\approx ${dec(x)}`, `y = ${c} \\cos ${th}^\\circ \\approx ${dec(y)}`)}`,
                    `正弦由斜边给出对边，余弦由斜边给出邻边：${steps(`x = ${c} \\sin ${th}^\\circ \\approx ${dec(x)}`, `y = ${c} \\cos ${th}^\\circ \\approx ${dec(y)}`)}`,
                  ),
                ),
                step(
                  3,
                  "take half the product of the legs",
                  "取两条直角边之积的一半",
                  t(
                    `Keep the ratios unrounded until the end:${steps(`A = \\frac{1}{2} \\cdot ${c} \\sin ${th}^\\circ \\cdot ${c} \\cos ${th}^\\circ \\approx ${dec(answer)}`)}`,
                    `三角比先不取近似值，到最后再取：${steps(`A = \\frac{1}{2} \\cdot ${c} \\sin ${th}^\\circ \\cdot ${c} \\cos ${th}^\\circ \\approx ${dec(answer)}`)}`,
                  ),
                ),
                check(
                  `The legs fit the Pythagorean theorem: $${dec(x)}^2 + ${dec(y)}^2 \\approx ${dec(sq)} \\approx ${c * c} = ${c}^2$.`,
                  `两条直角边满足勾股定理：$${dec(x)}^2 + ${dec(y)}^2 \\approx ${dec(sq)} \\approx ${c * c} = ${c}^2$。`,
                ),
              ),
            }),
            figure: figure(
              rightMarks(tri, { sides: angleFigureLabels({ hyp: `${c}` }), atU: `${th}°` }),
              `A right triangle with hypotenuse ${c} and a ${th}° angle.`,
              `一个直角三角形，斜边为 ${c}，有一个 ${th}° 的角。`,
            ),
            solutionFigures: [
              roleFigure({ tri, atU: true, values: { hyp: `${c}`, opp: "x", adj: "y" }, angle: `${th}°`, use: ["opp", "adj"] }, `${th}°`),
            ],
          };
        }
      },
    },
    {
      id: "area-from-two-sides-and-the-included-angle",
      figure: trigDrawings["area-from-two-sides-and-the-included-angle"],
      title: t("Two sides and the included angle", "两边及其夹角"),
      explanation: t(
        "Any triangle can be split into right triangles by a height. In $\\triangle ABC$ with $CA = b$, $CB = a$ and the angle $C$ between them, the height from $B$ to $CA$ is the side opposite $C$ in a right triangle with hypotenuse $a$, so $h = a \\sin C$ and\n\n$$A = \\frac{1}{2} b h = \\frac{1}{2} a b \\sin C.$$\n\nWith $a = 9$, $b = 7$ and $C = 50^\\circ$: $h = 9 \\sin 50^\\circ \\approx 6.894$ and $A \\approx \\frac{1}{2} \\cdot 7 \\cdot 6.894 \\approx 24.1$.\n\n> **Watch out.** The height is opposite $C$, so it uses the sine. $9 \\cos 50^\\circ$ is the adjacent side of the small right triangle, the stretch of $CA$ from $C$ to the foot of the height, not the height.",
        "任何三角形都可以用一条高分成直角三角形。在 $\\triangle ABC$ 中，$CA = b$，$CB = a$，它们的夹角是 $C$。从 $B$ 到 $CA$ 的高是一个斜边为 $a$ 的直角三角形中 $C$ 的对边，所以 $h = a \\sin C$，\n\n$$A = \\frac{1}{2} b h = \\frac{1}{2} a b \\sin C.$$\n\n$a = 9$，$b = 7$，$C = 50^\\circ$ 时：$h = 9 \\sin 50^\\circ \\approx 6.894$，$A \\approx \\frac{1}{2} \\cdot 7 \\cdot 6.894 \\approx 24.1$。\n\n> **注意。** 高是 $C$ 的对边，所以用正弦。$9 \\cos 50^\\circ$ 是小直角三角形的邻边，即 $CA$ 上从 $C$ 到垂足的一段，不是高。",
      ),
      generate(rng) {
        for (;;) {
          const C = rng.int(25, 70);
          const a = rng.int(4, 20);
          const b = rng.int(4, 20);
          const foot = a * Math.cos(rad(C));
          if (foot > b - 1 || foot < 1 || foot < 0.35 * Math.max(a, b)) continue;
          const s = trig("sin", C);
          const answer = rounded((a * b * s) / 2, (a * b * t4(s)) / 2);
          if (!answer) continue;
          const [A, B, Cn] = rng.pick(["ABC", "PQR", "XYZ", "DEF"]).split("") as [string, string, string];
          const pc: Point = [0, 0];
          const pa: Point = [b, 0];
          const pb = dir(C, a);
          const ph: Point = [foot, 0];
          const base: Mark[] = [
            { kind: "polygon", points: [pc, pa, pb] },
            { kind: "segment", a: pb, b: ph, dashed: true },
            { kind: "right", vertex: ph, from: pa, to: pb },
            ...outside([pc, pa, pb], [`${b}`, null, `${a}`]),
            { kind: "arc", vertex: pc, from: pa, to: pb, label: `${C}°`, accent: true },
            ...names([pc, pa, pb], `${Cn}${A}${B}`),
          ];
          const h = roundQ(a * s, 3);
          const h2 = roundQ(b * s, 3);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${A}${B}${Cn}$, $${Cn}${A} = ${b}$, $${Cn}${B} = ${a}$ and $\\angle ${Cn} = ${C}^\\circ$. Find the area of the triangle, to the nearest tenth.`,
                `在 $\\triangle ${A}${B}${Cn}$ 中，$${Cn}${A} = ${b}$，$${Cn}${B} = ${a}$，$\\angle ${Cn} = ${C}^\\circ$。求这个三角形的面积，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [roundQ(a * b * s), roundQ((a * b * trig("cos", C)) / 2), roundQ((a * b) / 2)],
              solution: paras(
                step(
                  1,
                  "draw the height",
                  "画出高",
                  t(
                    `Take $${Cn}${A} = ${b}$ as the base. The height $h$ from $${B}$ to $${Cn}${A}$ cuts off a right triangle with hypotenuse $${Cn}${B} = ${a}$. Seen from the $${C}^\\circ$ angle at $${Cn}$, $h$ is the opposite side:\n\n{{figure 0}}`,
                    `取 $${Cn}${A} = ${b}$ 为底。从 $${B}$ 到 $${Cn}${A}$ 的高 $h$ 截出一个直角三角形，斜边是 $${Cn}${B} = ${a}$。从 $${Cn}$ 处的 $${C}^\\circ$ 角看，$h$ 是对边：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "find the height",
                  "求高",
                  t(
                    `The sine links the opposite side and the hypotenuse:${chain(`\\sin ${C}^\\circ = \\frac{h}{${a}}`, `h = ${a} \\sin ${C}^\\circ \\approx ${dec(h)}`)}`,
                    `联系对边和斜边的是正弦：${chain(`\\sin ${C}^\\circ = \\frac{h}{${a}}`, `h = ${a} \\sin ${C}^\\circ \\approx ${dec(h)}`)}`,
                  ),
                ),
                step(
                  3,
                  "take half the base times the height",
                  "取底乘高的一半",
                  t(
                    `Keep $h$ unrounded until the end:${steps(`A = \\frac{1}{2} \\cdot ${b} \\cdot ${a} \\sin ${C}^\\circ \\approx ${dec(answer)}`)}`,
                    `$h$ 先不取近似值，到最后再取：${steps(`A = \\frac{1}{2} \\cdot ${b} \\cdot ${a} \\sin ${C}^\\circ \\approx ${dec(answer)}`)}`,
                  ),
                ),
                check(
                  `Use the other side as the base: the height from $${A}$ to $${Cn}${B}$ is $${b} \\sin ${C}^\\circ \\approx ${dec(h2)}$, and $\\frac{1}{2} \\cdot ${a} \\cdot ${b} \\sin ${C}^\\circ \\approx ${dec(answer)}$, the same area.`,
                  `换另一条边作底：从 $${A}$ 到 $${Cn}${B}$ 的高是 $${b} \\sin ${C}^\\circ \\approx ${dec(h2)}$，而 $\\frac{1}{2} \\cdot ${a} \\cdot ${b} \\sin ${C}^\\circ \\approx ${dec(answer)}$，面积相同。`,
                ),
              ),
            }),
            figure: figure(
              base,
              `Triangle ${A}${B}${Cn} with ${Cn}${A} = ${b}, ${Cn}${B} = ${a}, angle ${Cn} = ${C}°, and the height from ${B} to ${Cn}${A} dashed.`,
              `三角形 ${A}${B}${Cn}，${Cn}${A} = ${b}，${Cn}${B} = ${a}，角 ${Cn} = ${C}°，从 ${B} 到 ${Cn}${A} 的高用虚线表示。`,
            ),
            solutionFigures: [
              figure(
                [
                  { kind: "segment", a: pb, b: ph, tone: "action" },
                  { kind: "segment", a: pc, b: pb, tone: "result" },
                  ...base,
                  { kind: "label", at: [(pb[0] + ph[0]) / 2, (pb[1] + ph[1]) / 2], text: "h", dir: "e" },
                ],
                `Triangle ${A}${B}${Cn} with the height h from ${B} to ${Cn}${A}. In the right triangle it cuts off, seen from the ${C}° angle at ${Cn}: the height h is the opposite side, ${Cn}${B} = ${a} is the hypotenuse, and the part of ${Cn}${A} up to the foot of the height is the adjacent side. The height and the hypotenuse are drawn in colour.`,
                `三角形 ${A}${B}${Cn}，从 ${B} 到 ${Cn}${A} 的高为 h。在它截出的直角三角形中，从 ${Cn} 处的 ${C}° 角看：高 h 是对边，${Cn}${B} = ${a} 是斜边，${Cn}${A} 上到垂足的一段是邻边。高和斜边用颜色标出。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** buildingsIntro draws two right triangles sharing the horizontal from a window 20 m up to a taller building: down 20° to its base and up 30° to its top. */
const buildingsIntro: Figure = (() => {
  const d = 20 / Math.tan(rad(20));
  const u = d * Math.tan(rad(30));
  const O: Point = [0, 0];
  const E: Point = [0, 20];
  const F: Point = [d, 20];
  const G: Point = [d, 0];
  const T: Point = [d, 20 + u];
  return figure(
    [
      ...roleMarks({ tri: [F, E, G], atU: true, values: { opp: "20 m", adj: "d" }, angle: "20°", use: ["opp", "adj"] }),
      ...roleMarks({ tri: [F, E, T], atU: true, values: { opp: "u" }, angle: "30°", use: ["opp", "adj"] }),
      { kind: "segment", a: O, b: E },
      { kind: "segment", a: O, b: G },
    ],
    "A window 20 m up one building, and a horizontal line of length d from it to a taller building. Below the line, a right triangle seen from the 20° angle of depression at the window: the opposite side is the 20 m down to the base, the adjacent side is d. Above it, a right triangle seen from the 30° angle of elevation: the opposite side is the part u above the window's level, the adjacent side is the same d. The opposite and adjacent sides are drawn in colour.",
    "一栋楼 20 米高处的窗口，从窗口到另一栋较高的楼有一条长为 d 的水平线。水平线下方是从窗口 20° 俯角看的直角三角形：对边是向下到楼底的 20 米，邻边是 d。上方是从 30° 仰角看的直角三角形：对边是高出窗口的部分 u，邻边是同一个 d。对边和邻边用颜色标出。",
  );
})();

/** sq2 writes the square of a length rounded to one decimal place. */
const sq2 = (x: number) => dec(roundQ(x * x, 1));

export const solvingMultipleRightTrianglesUsingTrigonometry: TopicDef = {
  id: "solving-multiple-right-triangles-using-trigonometry",
  title: t("Solving Multiple Right Triangles Using Trigonometry", "用三角比解多个直角三角形"),
  summary: t(
    "Solve figures made of two right triangles that share a side, working from one triangle to the other.",
    "解由两个共边直角三角形组成的图形，从一个三角形推到另一个。",
  ),
  prerequisites: ["modeling-with-trigonometry"],
  encompasses: [{ topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.4 }],
  xp: 18,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `One right triangle needs a side and an angle before trigonometry can solve it. When a figure holds two right triangles, often only one of them has enough; but if they share a side, solving that one hands the shared side to the other.

From a window $20$ m up one building, the base of a taller building across the street is seen $20^\\circ$ below the horizontal and its top $30^\\circ$ above. The horizontal line from the window splits the view into two right triangles that share the side $d$:

{{figure 0}}

The lower triangle has a side and an angle: seen from the $20^\\circ$ angle, $20$ is opposite and $d$ adjacent, so $d = \\frac{20}{\\tan 20^\\circ} \\approx 54.95$ m. Now the upper triangle has one too: $u = d \\tan 30^\\circ \\approx 31.7$ m. The building is about $20 + 31.7 = 51.7$ m tall.

In this lesson we work through two right triangles this way: sharing a height, seen from two points, and stacked one on the other.`,
    `一个直角三角形要先有一条边和一个角，才能用三角比求解。图形中有两个直角三角形时，往往只有一个条件足够；但如果它们有公共边，解出这一个，就把公共边交给了另一个。

从一栋楼 $20$ m 高处的窗口看街对面一栋较高的楼，楼底在水平线下方 $20^\\circ$，楼顶在水平线上方 $30^\\circ$。从窗口引出的水平线把视野分成两个有公共边 $d$ 的直角三角形：

{{figure 0}}

下面的三角形有一条边和一个角：从 $20^\\circ$ 角看，$20$ 是对边，$d$ 是邻边，所以 $d = \\frac{20}{\\tan 20^\\circ} \\approx 54.95$ m。现在上面的三角形也有了：$u = d \\tan 30^\\circ \\approx 31.7$ m。那栋楼高约 $20 + 31.7 = 51.7$ m。

这节课这样处理两个直角三角形：有公共的高，从两点观察，以及一个叠在另一个上面。`,
  ),
  introFigures: [buildingsIntro],
  knowledgePoints: [
    {
      id: "a-shared-height",
      figure: trigDrawings["a-shared-height"],
      title: t("A shared height", "公共的高"),
      explanation: t(
        "A height $AD$ splits $\\triangle ABC$ into two right triangles that share the side $AD$. Solve the triangle with enough information first, then carry the shared side over.\n\nWith $AB = 10$, $\\angle B = 50^\\circ$ and $\\angle C = 35^\\circ$: in $\\triangle ABD$, $AD = 10 \\sin 50^\\circ \\approx 7.660$; in $\\triangle ADC$, $\\tan 35^\\circ = \\frac{AD}{DC}$, so\n\n$$DC = \\frac{10 \\sin 50^\\circ}{\\tan 35^\\circ} \\approx 10.9.$$\n\nKeep the unrounded value of the shared side for the second step.\n\n> **Watch out.** Name the sides again in the second triangle, from its own angle: $AD$ is opposite $\\angle B$ and also opposite $\\angle C$, but $AB$, the hypotenuse of the first triangle, is not a side of the second at all. Using $10$ in $\\triangle ADC$ gives a wrong length.",
        "高 $AD$ 把 $\\triangle ABC$ 分成两个共边 $AD$ 的直角三角形。先解信息足够的那个三角形，再把公共边带到另一个三角形。\n\n$AB = 10$，$\\angle B = 50^\\circ$，$\\angle C = 35^\\circ$ 时：在 $\\triangle ABD$ 中，$AD = 10 \\sin 50^\\circ \\approx 7.660$；在 $\\triangle ADC$ 中，$\\tan 35^\\circ = \\frac{AD}{DC}$，所以\n\n$$DC = \\frac{10 \\sin 50^\\circ}{\\tan 35^\\circ} \\approx 10.9.$$\n\n第二步要用公共边未取近似的值。\n\n> **注意。** 在第二个三角形中要从它自己的角重新给边命名：$AD$ 是 $\\angle B$ 的对边，也是 $\\angle C$ 的对边，但第一个三角形的斜边 $AB$ 根本不是第二个三角形的边。在 $\\triangle ADC$ 中用 $10$ 会得出错误的长度。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.int(6, 30);
          const beta = rng.int(30, 70);
          const gamma = rng.int(25, 65);
          const ask = rng.pick(["DC", "BC", "AC"] as const);
          const [sb, cb, tg, sg] = [trig("sin", beta), trig("cos", beta), trig("tan", gamma), trig("sin", gamma)];
          const ad = c * sb;
          const val = { DC: ad / tg, BC: c * cb + ad / tg, AC: ad / sg }[ask];
          const adA = c * t4(sb);
          const approx = { DC: adA / t4(tg), BC: c * t4(cb) + adA / t4(tg), AC: adA / t4(sg) }[ask];
          const answer = rounded(val, approx);
          if (!answer) continue;
          const B: Point = [0, 0];
          const D: Point = [c * cb, 0];
          const A: Point = [c * cb, ad];
          const C: Point = [c * cb + ad / tg, 0];
          const last = {
            DC: `${ask} = \\frac{AD}{\\tan ${gamma}^\\circ} = \\frac{${c} \\sin ${beta}^\\circ}{\\tan ${gamma}^\\circ} \\approx ${dec(answer)}`,
            BC: `DC = \\frac{AD}{\\tan ${gamma}^\\circ} = \\frac{${c} \\sin ${beta}^\\circ}{\\tan ${gamma}^\\circ}`,
            AC: `${ask} = \\frac{AD}{\\sin ${gamma}^\\circ} = \\frac{${c} \\sin ${beta}^\\circ}{\\sin ${gamma}^\\circ} \\approx ${dec(answer)}`,
          }[ask];
          const base: Mark[] = [
            { kind: "polygon", points: [B, C, A] },
            { kind: "segment", a: A, b: D, dashed: true },
            { kind: "right", vertex: D, from: C, to: A },
            { kind: "arc", vertex: B, from: C, to: A, label: `${beta}°`, accent: true },
            { kind: "arc", vertex: C, from: A, to: B, label: `${gamma}°`, accent: true },
            { kind: "side", a: A, b: B, text: `${c}` },
            ...names([B, C, A], "BCA"),
            { kind: "label", at: D, text: "D", dir: "s", italic: true },
          ];
          const [dc, ac] = [ad / tg, ad / sg];
          const second = ask === "AC" ? t("the hypotenuse $AC$", "斜边 $AC$") : t("the adjacent side $DC$", "邻边 $DC$");
          const secondFn = ask === "AC" ? "sin" : "tan";
          const parts: Text[] = [
            step(
              1,
              "solve the triangle with enough",
              "先解条件足够的三角形",
              t(
                `Right triangle $ABD$ has a side and an angle. Seen from $\\angle B = ${beta}^\\circ$, $AB = ${c}$ is the hypotenuse, the shared side $AD$ is opposite and $BD$ is adjacent:\n\n{{figure 0}}\n\nThe sine links the opposite side and the hypotenuse:${steps(`AD = ${c} \\sin ${beta}^\\circ \\approx ${dec(roundQ(ad, 3))}`)}${ask === "BC" ? `The cosine gives the adjacent side too:${steps(`BD = ${c} \\cos ${beta}^\\circ \\approx ${dec(roundQ(c * cb, 3))}`)}` : ""}`,
                `直角三角形 $ABD$ 有一条边和一个角。从 $\\angle B = ${beta}^\\circ$ 看，$AB = ${c}$ 是斜边，公共边 $AD$ 是对边，$BD$ 是邻边：\n\n{{figure 0}}\n\n联系对边和斜边的是正弦：${steps(`AD = ${c} \\sin ${beta}^\\circ \\approx ${dec(roundQ(ad, 3))}`)}${ask === "BC" ? `余弦也给出邻边：${steps(`BD = ${c} \\cos ${beta}^\\circ \\approx ${dec(roundQ(c * cb, 3))}`)}` : ""}`,
              ),
            ),
            step(
              2,
              "carry AD into the other triangle",
              "把 AD 带到另一个三角形",
              t(
                `In right triangle $ADC$, seen from $\\angle C = ${gamma}^\\circ$, $AD$ is again the opposite side, and the side we want is ${second.en}; the ${fnNames[secondFn].en} links them. Keep $AD$ unrounded:\n\n{{figure 1}}${steps(last)}`,
                `在直角三角形 $ADC$ 中，从 $\\angle C = ${gamma}^\\circ$ 看，$AD$ 仍是对边，所求的是${second["zh-CN"]}；联系它们的是${fnNames[secondFn]["zh-CN"]}。$AD$ 不取近似值：\n\n{{figure 1}}${steps(last)}`,
              ),
            ),
          ];
          if (ask === "BC") {
            parts.push(
              step(
                3,
                "add the two parts of BC",
                "把 BC 的两段相加",
                t(
                  `$D$ lies between $B$ and $C$, so${steps(`BC = BD + DC = ${c} \\cos ${beta}^\\circ + \\frac{${c} \\sin ${beta}^\\circ}{\\tan ${gamma}^\\circ} \\approx ${dec(answer)}`)}`,
                  `$D$ 在 $B$ 与 $C$ 之间，所以${steps(`BC = BD + DC = ${c} \\cos ${beta}^\\circ + \\frac{${c} \\sin ${beta}^\\circ}{\\tan ${gamma}^\\circ} \\approx ${dec(answer)}`)}`,
                ),
              ),
            );
          }
          const [ADs, DCs, ACs] = [dec(roundQ(ad, 3)), dec(roundQ(dc, 3)), dec(roundQ(ac, 3))];
          const other =
            ask === "AC"
              ? t(
                  `the other leg is $DC = \\frac{AD}{\\tan ${gamma}^\\circ} \\approx ${DCs}$`,
                  `另一条直角边 $DC = \\frac{AD}{\\tan ${gamma}^\\circ} \\approx ${DCs}$`,
                )
              : t(
                  `the hypotenuse is $AC = \\frac{AD}{\\sin ${gamma}^\\circ} \\approx ${ACs}$`,
                  `斜边 $AC = \\frac{AD}{\\sin ${gamma}^\\circ} \\approx ${ACs}$`,
                );
          parts.push(
            check(
              `In $\\triangle ADC$, ${other.en}, and the three sides fit the Pythagorean theorem: $${ADs}^2 + ${DCs}^2 \\approx ${dec(roundQ(ad * ad + dc * dc, 1))}$ and $${ACs}^2 \\approx ${sq2(ac)}$.`,
              `在 $\\triangle ADC$ 中，${other["zh-CN"]}，三条边满足勾股定理：$${ADs}^2 + ${DCs}^2 \\approx ${dec(roundQ(ad * ad + dc * dc, 1))}$，$${ACs}^2 \\approx ${sq2(ac)}$。`,
            ),
          );
          const tone = (a: Point, b: Point, k: 0 | 1): Mark => ({ kind: "segment", a, b, tone: k === 0 ? "action" : "result" });
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ABC$, $AD$ is the height to $BC$, $AB = ${c}$, $\\angle B = ${beta}^\\circ$ and $\\angle C = ${gamma}^\\circ$. Find $${ask}$, to the nearest tenth.`,
                `在 $\\triangle ABC$ 中，$AD$ 是 $BC$ 边上的高，$AB = ${c}$，$\\angle B = ${beta}^\\circ$，$\\angle C = ${gamma}^\\circ$。求 $${ask}$，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [roundQ(ad * tg), roundQ(c * cb), roundQ(ask === "AC" ? ad / tg : ad / sg), roundQ(c / tg)],
              solution: paras(...parts),
            }),
            figure: figure(
              base,
              `Triangle ABC with the height AD to BC; AB = ${c}, angle B = ${beta}°, angle C = ${gamma}°.`,
              `三角形 ABC，AD 是 BC 边上的高；AB = ${c}，角 B = ${beta}°，角 C = ${gamma}°。`,
            ),
            solutionFigures: [
              figure(
                [tone(A, D, 0), tone(A, B, 1), ...base],
                `Triangle ABC with the height AD. In right triangle ABD, seen from the ${beta}° angle at B: AD is the opposite side, BD the adjacent side and AB = ${c} the hypotenuse. AD and AB are drawn in colour.`,
                `三角形 ABC，AD 是高。在直角三角形 ABD 中，从 B 处的 ${beta}° 角看：AD 是对边，BD 是邻边，AB = ${c} 是斜边。AD 和 AB 用颜色标出。`,
              ),
              figure(
                [tone(A, D, 0), ask === "AC" ? tone(A, C, 1) : tone(D, C, 1), ...base],
                `Triangle ABC with the height AD. In right triangle ADC, seen from the ${gamma}° angle at C: AD is the opposite side, DC the adjacent side and AC the hypotenuse. AD and ${ask === "AC" ? "AC" : "DC"} are drawn in colour.`,
                `三角形 ABC，AD 是高。在直角三角形 ADC 中，从 C 处的 ${gamma}° 角看：AD 是对边，DC 是邻边，AC 是斜边。AD 和 ${ask === "AC" ? "AC" : "DC"} 用颜色标出。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "two-angles-of-elevation",
      figure: trigDrawings["two-angles-of-elevation"],
      title: t("Two angles of elevation", "两个仰角"),
      explanation: t(
        "When the height $h$ of an object is seen from two points on a line toward it, each angle of elevation gives a right triangle with the same height. From $P$ the angle is $25^\\circ$; after walking $50$ m toward the object to $Q$, it is $40^\\circ$. The horizontal distances to the base are $\\frac{h}{\\tan 25^\\circ}$ and $\\frac{h}{\\tan 40^\\circ}$, and they differ by $50$:\n\n$$\\frac{h}{\\tan 25^\\circ} - \\frac{h}{\\tan 40^\\circ} = 50, \\qquad h = \\frac{50}{\\frac{1}{\\tan 25^\\circ} - \\frac{1}{\\tan 40^\\circ}} \\approx 52.5 \\text{ m}.$$\n\n> **Watch out.** Neither triangle can be solved alone: the $50$ m is not a side of either, but the difference of their adjacent sides. $50 \\tan 40^\\circ$ treats it as the distance from $Q$ to the base.",
        "从朝向物体的同一直线上的两点观察物体的高 $h$ 时，每个仰角都给出一个高相同的直角三角形。从 $P$ 看仰角是 $25^\\circ$；朝物体走 $50$ 米到 $Q$，仰角变为 $40^\\circ$。到底部的水平距离分别是 $\\frac{h}{\\tan 25^\\circ}$ 和 $\\frac{h}{\\tan 40^\\circ}$，两者相差 $50$：\n\n$$\\frac{h}{\\tan 25^\\circ} - \\frac{h}{\\tan 40^\\circ} = 50, \\qquad h = \\frac{50}{\\frac{1}{\\tan 25^\\circ} - \\frac{1}{\\tan 40^\\circ}} \\approx 52.5 \\text{ 米}.$$\n\n> **注意。** 两个三角形都不能单独求解：$50$ 米不是其中任何一个的边，而是它们邻边之差。$50 \\tan 40^\\circ$ 把它当成了从 $Q$ 到塔底的距离。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(10, 80);
          const alpha = rng.int(15, 40);
          const beta = alpha + rng.int(10, 30);
          if (beta > 70) continue;
          const [ta, tb] = [trig("tan", alpha), trig("tan", beta)];
          const h = d / (1 / ta - 1 / tb);
          const answer = rounded(h, d / (1 / t4(ta) - 1 / t4(tb)));
          if (!answer || h > 4 * d) continue;
          const P: Point = [0, 0];
          const Qp: Point = [d, 0];
          const Bp: Point = [d + h / tb, 0];
          const T: Point = [Bp[0], h];
          const base: Mark[] = [
            { kind: "segment", a: P, b: Bp },
            { kind: "segment", a: Bp, b: T },
            { kind: "segment", a: P, b: T },
            { kind: "segment", a: Qp, b: T },
            { kind: "right", vertex: Bp, from: P, to: T },
            { kind: "arc", vertex: P, from: Bp, to: T, label: `${alpha}°`, accent: true },
            { kind: "arc", vertex: Qp, from: Bp, to: T, label: `${beta}°`, accent: true },
            { kind: "side", a: P, b: Qp, text: `${d} m` },
            { kind: "label", at: P, text: "P", dir: "w", italic: true },
            { kind: "label", at: Qp, text: "Q", dir: "s", italic: true },
            { kind: "label", at: Bp, text: "B", dir: "e", italic: true },
            { kind: "label", at: T, text: "T", dir: "n", italic: true },
          ];
          const [qb, pb] = [answer.toNumber() / tb, answer.toNumber() / ta];
          const tone = (a: Point, b: Point, k: 0 | 1): Mark => ({ kind: "segment", a, b, tone: k === 0 ? "action" : "result" });
          return {
            ...numberProblem({
              prompt: t(
                `From point $P$ on level ground, the angle of elevation to the top $T$ of a tower is $${alpha}^\\circ$. From $Q$, $${unitTex(`${d}`)}$ closer to the tower, it is $${beta}^\\circ$. Find the height $TB$ of the tower, to the nearest tenth of a meter.`,
                `在水平地面上的点 $P$ 看塔顶 $T$ 的仰角是 $${alpha}^\\circ$。在离塔近 $${d}$ 米的点 $Q$，仰角是 $${beta}^\\circ$。求塔高 $TB$，结果精确到 $0.1$ 米。`,
              ),
              answer,
              form: "decimal",
              unit: "m",
              wrong: [roundQ(d * tb), roundQ(d * ta), roundQ(d / (1 / ta + 1 / tb)), roundQ(d * (tb - ta))],
              solution: paras(
                step(
                  1,
                  "write each distance in terms of h",
                  "用 h 表示每段距离",
                  t(
                    `Let $h = TB$. Neither right triangle has a known side, but both have $h$. In $\\triangle TQB$, seen from the $${beta}^\\circ$ angle at $Q$, $h$ is opposite and $QB$ adjacent:\n\n{{figure 0}}${steps(`QB = \\frac{h}{\\tan ${beta}^\\circ}`)}In $\\triangle TPB$, seen from the $${alpha}^\\circ$ angle at $P$, $h$ is again opposite and $PB$ adjacent:\n\n{{figure 1}}${steps(`PB = \\frac{h}{\\tan ${alpha}^\\circ}`)}`,
                    `设 $h = TB$。两个直角三角形都没有已知的边，但都含有 $h$。在 $\\triangle TQB$ 中，从 $Q$ 处的 $${beta}^\\circ$ 角看，$h$ 是对边，$QB$ 是邻边：\n\n{{figure 0}}${steps(`QB = \\frac{h}{\\tan ${beta}^\\circ}`)}在 $\\triangle TPB$ 中，从 $P$ 处的 $${alpha}^\\circ$ 角看，$h$ 仍是对边，$PB$ 是邻边：\n\n{{figure 1}}${steps(`PB = \\frac{h}{\\tan ${alpha}^\\circ}`)}`,
                  ),
                ),
                step(
                  2,
                  "use the distance PQ",
                  "利用 PQ 的长",
                  t(
                    `$P$ is farther than $Q$ by $PQ = ${d}$, so $PB - QB = ${d}$. Take out the common factor $h$ and divide:${chain(`\\frac{h}{\\tan ${alpha}^\\circ} - \\frac{h}{\\tan ${beta}^\\circ} = ${d}`, `h = \\frac{${d}}{\\frac{1}{\\tan ${alpha}^\\circ} - \\frac{1}{\\tan ${beta}^\\circ}} \\approx ${dec(answer)}`)}The tower is about $${unitTex(dec(answer))}$ tall.`,
                    `$P$ 比 $Q$ 远 $PQ = ${d}$，所以 $PB - QB = ${d}$。提出公因式 $h$ 再相除：${chain(`\\frac{h}{\\tan ${alpha}^\\circ} - \\frac{h}{\\tan ${beta}^\\circ} = ${d}`, `h = \\frac{${d}}{\\frac{1}{\\tan ${alpha}^\\circ} - \\frac{1}{\\tan ${beta}^\\circ}} \\approx ${dec(answer)}`)}塔高约 $${dec(answer)}$ 米。`,
                  ),
                ),
                check(
                  `With $h \\approx ${dec(answer)}$, $QB \\approx ${dec(roundQ(qb, 2))}$ and $PB \\approx ${dec(roundQ(pb, 2))}$, which differ by $${dec(roundQ(pb - qb, 2))} \\approx ${d}$, as they must.`,
                  `取 $h \\approx ${dec(answer)}$，$QB \\approx ${dec(roundQ(qb, 2))}$，$PB \\approx ${dec(roundQ(pb, 2))}$，两者相差 $${dec(roundQ(pb - qb, 2))} \\approx ${d}$，理应如此。`,
                ),
              ),
            }),
            figure: figure(
              base,
              `Points P and Q on the ground, ${d} m apart, in line with the base B of a tower TB. The angles of elevation of T are ${alpha}° from P and ${beta}° from Q.`,
              `地面上的点 P、Q 相距 ${d} 米，与塔 TB 的底部 B 在一条直线上。从 P 看 T 的仰角是 ${alpha}°，从 Q 看是 ${beta}°。`,
            ),
            solutionFigures: [
              figure(
                [tone(Bp, T, 0), tone(Qp, Bp, 1), ...base],
                `The tower TB seen from P and Q. In right triangle TQB, seen from the ${beta}° angle at Q: TB is the opposite side, QB the adjacent side and QT the hypotenuse. TB and QB are drawn in colour.`,
                `从 P、Q 看塔 TB。在直角三角形 TQB 中，从 Q 处的 ${beta}° 角看：TB 是对边，QB 是邻边，QT 是斜边。TB 和 QB 用颜色标出。`,
              ),
              figure(
                [tone(Bp, T, 0), tone(P, Bp, 1), ...base],
                `The tower TB seen from P and Q. In right triangle TPB, seen from the ${alpha}° angle at P: TB is the opposite side, PB the adjacent side and PT the hypotenuse. TB and PB are drawn in colour.`,
                `从 P、Q 看塔 TB。在直角三角形 TPB 中，从 P 处的 ${alpha}° 角看：TB 是对边，PB 是邻边，PT 是斜边。TB 和 PB 用颜色标出。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "stacked-right-triangles",
      figure: trigDrawings["stacked-right-triangles"],
      title: t("Stacked right triangles", "相叠的直角三角形"),
      explanation: t(
        "Two right triangles can share a hypotenuse of one and a leg of the other. In right triangle $ABC$ (right angle at $B$) and right triangle $ACD$ (right angle at $C$), with $AB = 8$, $\\angle BAC = 30^\\circ$ and $\\angle CAD = 25^\\circ$:\n\n$$AC = \\frac{8}{\\cos 30^\\circ} \\approx 9.238, \\qquad CD = AC \\tan 25^\\circ = \\frac{8 \\tan 25^\\circ}{\\cos 30^\\circ} \\approx 4.3.$$\n\n> **Watch out.** The shared side $AC$ changes role: it is the hypotenuse of $\\triangle ABC$ but a leg, adjacent to $\\angle CAD$, of $\\triangle ACD$. And the two angles at $A$ belong to different triangles, so $8 \\tan 55^\\circ$ is not a side of either.",
        "两个直角三角形可以以一个的斜边作为另一个的直角边。在直角三角形 $ABC$（直角在 $B$）和直角三角形 $ACD$（直角在 $C$）中，$AB = 8$，$\\angle BAC = 30^\\circ$，$\\angle CAD = 25^\\circ$：\n\n$$AC = \\frac{8}{\\cos 30^\\circ} \\approx 9.238, \\qquad CD = AC \\tan 25^\\circ = \\frac{8 \\tan 25^\\circ}{\\cos 30^\\circ} \\approx 4.3.$$\n\n> **注意。** 公共边 $AC$ 的角色变了：它是 $\\triangle ABC$ 的斜边，却是 $\\triangle ACD$ 的直角边，是 $\\angle CAD$ 的邻边。另外 $A$ 处的两个角属于不同的三角形，所以 $8 \\tan 55^\\circ$ 不是任何一个三角形的边。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(5, 30);
          const alpha = rng.int(20, 50);
          const beta = rng.int(20, 50);
          if (alpha + beta > 85) continue;
          const ask = rng.pick(["CD", "AD"] as const);
          const [ca, tb, cb] = [trig("cos", alpha), trig("tan", beta), trig("cos", beta)];
          const ac = a / ca;
          const val = ask === "CD" ? ac * tb : ac / cb;
          const approx = ask === "CD" ? (a / t4(ca)) * t4(tb) : a / t4(ca) / t4(cb);
          const answer = rounded(val, approx);
          if (!answer) continue;
          const A: Point = [0, 0];
          const B: Point = [a, 0];
          const C: Point = [a, a * trig("tan", alpha)];
          const D = dir(alpha + beta, ac / cb);
          const last =
            ask === "CD"
              ? `CD = AC \\tan ${beta}^\\circ = \\frac{${a} \\tan ${beta}^\\circ}{\\cos ${alpha}^\\circ} \\approx ${dec(answer)}`
              : `AD = \\frac{AC}{\\cos ${beta}^\\circ} = \\frac{${a}}{\\cos ${alpha}^\\circ \\cos ${beta}^\\circ} \\approx ${dec(answer)}`;
          const base: Mark[] = [
            { kind: "polygon", points: [A, B, C, D] },
            { kind: "segment", a: A, b: C },
            { kind: "right", vertex: B, from: A, to: C },
            { kind: "right", vertex: C, from: A, to: D },
            { kind: "arc", vertex: A, from: B, to: C, label: `${alpha}°`, accent: true },
            { kind: "arc", vertex: A, from: C, to: D, label: `${beta}°`, accent: true },
            { kind: "side", a: A, b: B, text: `${a}` },
            ...names([A, B, C, D], "ABCD"),
          ];
          const tone = (p: Point, r: Point, k: 0 | 1): Mark => ({ kind: "segment", a: p, b: r, tone: k === 0 ? "action" : "result" });
          const [cd, ad] = [ac * tb, ac / cb];
          const [ACs, CDs, ADs] = [dec(roundQ(ac, 3)), dec(roundQ(cd, 3)), dec(roundQ(ad, 3))];
          const other =
            ask === "CD"
              ? t(
                  `the hypotenuse is $AD = \\frac{AC}{\\cos ${beta}^\\circ} \\approx ${ADs}$`,
                  `斜边 $AD = \\frac{AC}{\\cos ${beta}^\\circ} \\approx ${ADs}$`,
                )
              : t(
                  `the other leg is $CD = AC \\tan ${beta}^\\circ \\approx ${CDs}$`,
                  `另一条直角边 $CD = AC \\tan ${beta}^\\circ \\approx ${CDs}$`,
                );
          return {
            ...numberProblem({
              prompt: t(
                `$\\angle ABC = \\angle ACD = 90^\\circ$, $AB = ${a}$, $\\angle BAC = ${alpha}^\\circ$ and $\\angle CAD = ${beta}^\\circ$. Find $${ask}$, to the nearest tenth.`,
                `$\\angle ABC = \\angle ACD = 90^\\circ$，$AB = ${a}$，$\\angle BAC = ${alpha}^\\circ$，$\\angle CAD = ${beta}^\\circ$。求 $${ask}$，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [
                roundQ(a * tb),
                roundQ(a * trig("tan", alpha + beta)),
                roundQ(ask === "CD" ? ac * trig("sin", beta) : a / cb),
                roundQ(ac),
              ],
              solution: paras(
                step(
                  1,
                  "solve the inner triangle",
                  "先解里面的三角形",
                  t(
                    `Right triangle $ABC$ has a side and an angle. Seen from $\\angle BAC = ${alpha}^\\circ$, $AB = ${a}$ is the adjacent side and the shared side $AC$ is the hypotenuse:\n\n{{figure 0}}\n\nThe cosine links them, and $AC$ is underneath:${chain(`\\cos ${alpha}^\\circ = \\frac{${a}}{AC}`, `AC = \\frac{${a}}{\\cos ${alpha}^\\circ} \\approx ${ACs}`)}`,
                    `直角三角形 $ABC$ 有一条边和一个角。从 $\\angle BAC = ${alpha}^\\circ$ 看，$AB = ${a}$ 是邻边，公共边 $AC$ 是斜边：\n\n{{figure 0}}\n\n联系它们的是余弦，$AC$ 在分母上：${chain(`\\cos ${alpha}^\\circ = \\frac{${a}}{AC}`, `AC = \\frac{${a}}{\\cos ${alpha}^\\circ} \\approx ${ACs}`)}`,
                  ),
                ),
                step(
                  2,
                  "carry AC into the outer triangle",
                  "把 AC 带到外面的三角形",
                  t(
                    `In right triangle $ACD$, seen from $\\angle CAD = ${beta}^\\circ$, $AC$ is now the adjacent side, $CD$ is opposite and $AD$ is the hypotenuse:\n\n{{figure 1}}\n\n${ask === "CD" ? "The tangent" : "The cosine"} links $AC$ with $${ask}$; keep $AC$ unrounded:${steps(last)}`,
                    `在直角三角形 $ACD$ 中，从 $\\angle CAD = ${beta}^\\circ$ 看，$AC$ 成了邻边，$CD$ 是对边，$AD$ 是斜边：\n\n{{figure 1}}\n\n联系 $AC$ 和 $${ask}$ 的是${ask === "CD" ? "正切" : "余弦"}；$AC$ 不取近似值：${steps(last)}`,
                  ),
                ),
                check(
                  `In $\\triangle ACD$, ${other.en}, and the three sides fit the Pythagorean theorem: $${ACs}^2 + ${CDs}^2 \\approx ${dec(roundQ(ac * ac + cd * cd, 1))}$ and $${ADs}^2 \\approx ${sq2(ad)}$.`,
                  `在 $\\triangle ACD$ 中，${other["zh-CN"]}，三条边满足勾股定理：$${ACs}^2 + ${CDs}^2 \\approx ${dec(roundQ(ac * ac + cd * cd, 1))}$，$${ADs}^2 \\approx ${sq2(ad)}$。`,
                ),
              ),
            }),
            figure: figure(
              base,
              `Right triangles ABC (right angle at B) and ACD (right angle at C) sharing AC; AB = ${a}, angle BAC = ${alpha}°, angle CAD = ${beta}°.`,
              `直角三角形 ABC（直角在 B）与 ACD（直角在 C）有公共边 AC；AB = ${a}，角 BAC = ${alpha}°，角 CAD = ${beta}°。`,
            ),
            solutionFigures: [
              figure(
                [tone(A, B, 0), tone(A, C, 1), ...base],
                `Right triangles ABC and ACD sharing AC. In ABC, seen from the ${alpha}° angle at A: BC is the opposite side, AB = ${a} the adjacent side and AC the hypotenuse. AB and AC are drawn in colour.`,
                `直角三角形 ABC 与 ACD 有公共边 AC。在 ABC 中，从 A 处的 ${alpha}° 角看：BC 是对边，AB = ${a} 是邻边，AC 是斜边。AB 和 AC 用颜色标出。`,
              ),
              figure(
                ask === "CD" ? [tone(C, D, 0), tone(A, C, 1), ...base] : [tone(A, C, 0), tone(A, D, 1), ...base],
                `Right triangles ABC and ACD sharing AC. In ACD, seen from the ${beta}° angle at A: CD is the opposite side, AC the adjacent side and AD the hypotenuse. ${ask === "CD" ? "CD and AC" : "AC and AD"} are drawn in colour.`,
                `直角三角形 ABC 与 ACD 有公共边 AC。在 ACD 中，从 A 处的 ${beta}° 角看：CD 是对边，AC 是邻边，AD 是斜边。${ask === "CD" ? "CD 和 AC" : "AC 和 AD"}用颜色标出。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

export const trigonometryTopics: readonly TopicDef[] = [
  diagonalsOfSquares,
  propertiesOfParallelograms,
  provingPropertiesOfParallelograms,
  provingCriteriaForParallelogramsAndRectangles,
  anglesAndSidesInRightTriangles,
  theTrigonometricRatios,
  calculatingTrigonometricRatiosUsingThePythagoreanTheorem,
  calculatingSideLengthsOfRightTrianglesUsingTrigonometry,
  calculatingAnglesInRightTrianglesUsingTrigonometry,
  modelingWithTrigonometry,
  theReciprocalTrigonometricRatios,
  trigonometricRatiosInSimilarRightTriangles,
  trigonometricFunctionsOfComplementaryAngles,
  specialTrigonometricRatios,
  calculatingAreasOfRightTrianglesUsingTrigonometry,
  solvingMultipleRightTrianglesUsingTrigonometry,
];
