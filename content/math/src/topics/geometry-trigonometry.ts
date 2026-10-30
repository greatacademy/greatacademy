import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, dec, linear, type Mark, type Point, Q, radical, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, radicalProblem, steps } from "../problems.ts";

// Geometry, unit 4 (continued): quadrilaterals (diagonals of squares,
// properties of parallelograms and the proofs of their properties and
// criteria) and right-triangle trigonometry.

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 1, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

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
}

/** Proof is a two-column proof with its figure. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  readonly figure: Figure;
}

/** mt wraps LaTeX as a language-neutral text. */
const mt = (tex: string) => same(`$${tex}$`);

/** both writes two LaTeX statements joined by "and". */
const both = (a: string, b: string) => t(`$${a}$ and $${b}$`, `$${a}$，$${b}$`);

/** proofProblem asks for the reason, or the statement, of one step of a proof; pool lists the reasons offered as wrong options. */
function proofProblem(rng: Rng, proof: Proof, pool: readonly Reason[]): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [step, k] = rng.pick(eligible);
  const askStatement = step.alts !== undefined && step.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  if (askStatement) {
    options = [step.s, ...rng.sample(step.alts!, Math.min(3, step.alts!.length))];
  } else {
    const others = pool.filter((r) => r !== step.r && !(alike[step.r] ?? []).includes(r));
    options = [reasons[step.r], ...rng.sample(others, Math.min(3, others.length)).map((r) => reasons[r])];
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
  const why = step.why ? t(` ${step.why.en}`, step.why["zh-CN"]) : t("", "");
  return {
    ...choiceProblem({
      prompt: t(
        `**Given:** ${proof.given.en}\n\n**Prove:** ${proof.prove.en}\n\n${list("en")}\n\n${ask.en}`,
        `**已知：** ${proof.given["zh-CN"]}\n\n**求证：** ${proof.prove["zh-CN"]}\n\n${list("zh-CN")}\n\n${ask["zh-CN"]}`,
      ),
      options: shuffled,
      correct,
      solution: t(
        `Step ${k + 1} is ${step.s.en}, because: ${reasons[step.r].en}.${why.en}`,
        `第 ${k + 1} 步是 ${step.s["zh-CN"]}，理由是：${reasons[step.r]["zh-CN"]}。${why["zh-CN"]}`,
      ),
    }),
    figure: proof.figure,
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
function quadAngle(pts: Quad, i: number, label?: string, accent = false): Mark {
  return { kind: "arc", vertex: pts[i]!, from: pts[(i + 1) % 4]!, to: pts[(i + 3) % 4]!, label, accent };
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
    { topic: "isosceles-right-triangles", weight: 0.4 },
    { topic: "area-of-rectangles-and-squares", weight: 0.2 },
    { topic: "rationalizing-denominators", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.11", "CCSS.8.G.B.7"],
  knowledgePoints: [
    {
      id: "properties-of-the-diagonals",
      title: t("Properties of the diagonals", "对角线的性质"),
      explanation: t(
        "The two diagonals of a square $ABCD$ meet at a point $E$, and:\n\n- they are **congruent**: $AC = BD$;\n- they **bisect each other**: $AE = CE$ and $BE = DE$;\n- they are **perpendicular**, and each one bisects the right angles at its ends into $45^\\circ$ angles.\n\nSo all four segments $AE$, $BE$, $CE$, $DE$ are equal, and each diagonal is twice any of them. If $AE = 3x - 4$ and $BD = 4x + 2$, then $BD = 2 \\cdot AE$:\n\n$$4x + 2 = 2(3x - 4) = 6x - 8, \\qquad 10 = 2x, \\qquad x = 5.$$",
        "正方形 $ABCD$ 的两条对角线交于点 $E$，并且：\n\n- 两条对角线**相等**：$AC = BD$；\n- 两条对角线**互相平分**：$AE = CE$，$BE = DE$；\n- 两条对角线**互相垂直**，并且每条对角线都把它两端的直角平分成两个 $45^\\circ$ 角。\n\n所以 $AE$、$BE$、$CE$、$DE$ 四条线段都相等，每条对角线是其中任意一条的两倍。若 $AE = 3x - 4$，$BD = 4x + 2$，则 $BD = 2 \\cdot AE$：\n\n$$4x + 2 = 2(3x - 4) = 6x - 8, \\qquad 10 = 2x, \\qquad x = 5.$$",
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
          const lhs = k === 1 ? linear(a, b) : `2(${linear(a, b)})`;
          const why =
            k === 1
              ? second === `${C}${E}`
                ? t(
                    "The diagonals bisect each other, so the two halves of a diagonal are equal:",
                    "对角线互相平分，所以一条对角线的两半相等：",
                  )
                : t(
                    "The diagonals are congruent and bisect each other, so all four halves are equal:",
                    "对角线相等且互相平分，所以四条半对角线都相等：",
                  )
              : t(
                  "The diagonals are congruent and bisect each other, so a whole diagonal is twice each half:",
                  "对角线相等且互相平分，所以一整条对角线是每条半对角线的两倍：",
                );
          const pts = squarePoints(rng);
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
              solution: t(
                `${why.en}${chain(`${linear(c, d)} = ${lhs}`, `${linear(c, d)} = ${linear(k * a, k * b)}`, `${linear(c - k * a, 0)} = ${k * b - d}`, `x = ${x}`)}`,
                `${why["zh-CN"]}${chain(`${linear(c, d)} = ${lhs}`, `${linear(c, d)} = ${linear(k * a, k * b)}`, `${linear(c - k * a, 0)} = ${k * b - d}`, `x = ${x}`)}`,
              ),
            }),
            figure: figure(
              [...quadMarks(pts, `${A}${B}${C}${D}`, "both", E), { kind: "right", vertex: pts[0], from: pts[1], to: pts[3] }],
              `Square ${A}${B}${C}${D} with diagonals ${A}${C} and ${B}${D} meeting at ${E}.`,
              `正方形 ${A}${B}${C}${D}，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}。`,
            ),
          };
        }
      },
    },
    {
      id: "the-diagonal-from-the-side",
      title: t("The diagonal from the side", "由边长求对角线"),
      explanation: t(
        "A diagonal cuts a square into two isosceles right triangles: the legs are sides $s$ and the hypotenuse is the diagonal $d$. By the Pythagorean theorem $d^2 = s^2 + s^2 = 2s^2$, so\n\n$$d = s\\sqrt{2}.$$\n\nA square with side $6$ has diagonal $6\\sqrt{2}$. A square with side $4\\sqrt{2}$ has diagonal $4\\sqrt{2} \\cdot \\sqrt{2} = 8$.",
        "一条对角线把正方形分成两个等腰直角三角形：直角边是边长 $s$，斜边是对角线 $d$。由勾股定理 $d^2 = s^2 + s^2 = 2s^2$，所以\n\n$$d = s\\sqrt{2}.$$\n\n边长为 $6$ 的正方形，对角线是 $6\\sqrt{2}$。边长为 $4\\sqrt{2}$ 的正方形，对角线是 $4\\sqrt{2} \\cdot \\sqrt{2} = 8$。",
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
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length of the diagonal $${A}${C}$ of the square $${A}${B}${C}${D}$. Give your answer in simplest radical form.`,
              `求正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C}$ 的长。答案写成最简根式。`,
            ),
            answer: d,
            wrong: [texS(mulS(side, int(2))), texS(side), texS(mulS(side, [Q.one, 3])), rooted ? `${k}\\sqrt{4}` : `\\sqrt{${2 * k}}`],
            solution: t(
              `The diagonal is the side times $\\sqrt{2}$:${steps(`${A}${C} = ${texS(side)} \\cdot \\sqrt{2} = ${texS(d)}`)}`,
              `对角线等于边长乘以 $\\sqrt{2}$：${steps(`${A}${C} = ${texS(side)} \\cdot \\sqrt{2} = ${texS(d)}`)}`,
            ),
          }),
          figure: figure(
            [
              ...quadMarks(pts, `${A}${B}${C}${D}`, "ac"),
              ...outside(pts, [sideLabel, null, null, null]),
              { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] },
            ],
            `Square ${A}${B}${C}${D} with side ${sideLabel} and diagonal ${A}${C}.`,
            `正方形 ${A}${B}${C}${D}，边长为 ${sideLabel}，对角线为 ${A}${C}。`,
          ),
        };
      },
    },
    {
      id: "the-side-from-the-diagonal",
      title: t("The side from the diagonal", "由对角线求边长"),
      explanation: t(
        "Going back, divide the diagonal by $\\sqrt{2}$ and rationalize the denominator:\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\nA square with diagonal $10$ has side $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}$. A square with diagonal $7\\sqrt{2}$ has side $7$.",
        "反过来，把对角线除以 $\\sqrt{2}$，再把分母有理化：\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\n对角线为 $10$ 的正方形，边长是 $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}$。对角线为 $7\\sqrt{2}$ 的正方形，边长是 $7$。",
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const rooted = rng.bool(0.3);
        const k = rooted ? rng.int(2, 15) : rng.int(2, 30);
        const d: S = rooted ? [q(k), 2] : int(k);
        const s = divS(d, [Q.one, 2]);
        const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
        const pts = squarePoints(rng);
        const dTex = texS(d);
        return {
          ...radicalProblem({
            prompt: t(
              `The diagonal $${A}${C}$ of the square $${A}${B}${C}${D}$ has length $${dTex}$. Find the length of a side. Give your answer in simplest radical form.`,
              `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C}$ 长 $${dTex}$。求它的边长。答案写成最简根式。`,
            ),
            answer: s,
            wrong: [texS(mulS(d, [Q.one, 2])), texS(divS(d, int(2))), rooted ? texS(int(2 * k)) : `\\frac{${k}}{\\sqrt{2}}`],
            solution: t(
              `The side is the diagonal divided by $\\sqrt{2}$:${steps(`s = \\frac{${dTex}}{\\sqrt{2}} = ${texS(s)}`)}`,
              `边长等于对角线除以 $\\sqrt{2}$：${steps(`s = \\frac{${dTex}}{\\sqrt{2}} = ${texS(s)}`)}`,
            ),
          }),
          figure: figure(
            [...quadMarks(pts, `${A}${B}${C}${D}`, "ac"), { kind: "right", vertex: pts[1], from: pts[2], to: pts[0] }],
            `Square ${A}${B}${C}${D} with diagonal ${A}${C}.`,
            `正方形 ${A}${B}${C}${D}，对角线为 ${A}${C}。`,
          ),
        };
      },
    },
    {
      id: "area-and-perimeter-from-the-diagonal",
      title: t("Area and perimeter from the diagonal", "由对角线求面积和周长"),
      explanation: t(
        "From the diagonal $d$, the side is $s = \\frac{d}{\\sqrt{2}}$, so the area is\n\n$$A = s^2 = \\frac{d^2}{2},$$\n\nand the perimeter is $4s = \\frac{4d}{\\sqrt{2}} = 2\\sqrt{2}\\,d$. A square with diagonal $6$ has area $\\frac{36}{2} = 18$ and perimeter $12\\sqrt{2}$.",
        "由对角线 $d$ 得边长 $s = \\frac{d}{\\sqrt{2}}$，所以面积是\n\n$$A = s^2 = \\frac{d^2}{2},$$\n\n周长是 $4s = \\frac{4d}{\\sqrt{2}} = 2\\sqrt{2}\\,d$。对角线为 $6$ 的正方形，面积是 $\\frac{36}{2} = 18$，周长是 $12\\sqrt{2}$。",
      ),
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
        if (rng.bool()) {
          const area = q(d * d, 2);
          return {
            ...numberProblem({
              prompt: t(
                `The square $${A}${B}${C}${D}$ has diagonal $${A}${C} = ${d}$. Find its area.`,
                `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C} = ${d}$。求它的面积。`,
              ),
              answer: area,
              wrong: [d * d, q(d * d, 4), 2 * d * d],
              solution: t(
                `The area of a square is half the square of its diagonal:${steps(`A = \\frac{${d}^2}{2} = \\frac{${d * d}}{2} = ${area.toLatex()}`)}`,
                `正方形的面积等于对角线平方的一半：${steps(`A = \\frac{${d}^2}{2} = \\frac{${d * d}}{2} = ${area.toLatex()}`)}`,
              ),
            }),
            figure: fig,
          };
        }
        const side = divS(int(d), [Q.one, 2]);
        const per = mulS(side, int(4));
        return {
          ...radicalProblem({
            prompt: t(
              `The square $${A}${B}${C}${D}$ has diagonal $${A}${C} = ${d}$. Find its perimeter in simplest radical form.`,
              `正方形 $${A}${B}${C}${D}$ 的对角线 $${A}${C} = ${d}$。求它的周长，答案写成最简根式。`,
            ),
            answer: per,
            wrong: [`${4 * d}`, `${2 * d}`, texS(mulS(int(4 * d), [Q.one, 2])), texS(side)],
            solution: t(
              `The side is $\\frac{${d}}{\\sqrt{2}} = ${texS(side)}$, so the perimeter is${steps(`4 \\cdot ${texS(side)} = ${texS(per)}`)}`,
              `边长是 $\\frac{${d}}{\\sqrt{2}} = ${texS(side)}$，所以周长是${steps(`4 \\cdot ${texS(side)} = ${texS(per)}`)}`,
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

export const propertiesOfParallelograms: TopicDef = {
  id: "properties-of-parallelograms",
  title: t("Properties of Parallelograms", "平行四边形的性质"),
  summary: t(
    "Use the angles, sides and diagonals of a parallelogram to find measures and to solve for unknowns.",
    "利用平行四边形的角、边和对角线的性质求度量和未知数。",
  ),
  prerequisites: ["angles-of-polygons"],
  encompasses: [
    { topic: "parallel-lines-and-transversals", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.CO.C.11"],
  knowledgePoints: [
    {
      id: "angles-of-a-parallelogram",
      title: t("Angles of a parallelogram", "平行四边形的角"),
      explanation: t(
        "A **parallelogram** is a quadrilateral whose opposite sides are parallel. Its angles follow from parallel lines:\n\n- **consecutive angles** (next to each other) are consecutive interior angles, so they are **supplementary**;\n- **opposite angles** are **congruent**.\n\nIn parallelogram $ABCD$ with $\\angle A = 70^\\circ$: $\\angle B = \\angle D = 180^\\circ - 70^\\circ = 110^\\circ$ and $\\angle C = 70^\\circ$. The four angles add up to $360^\\circ$, as in every quadrilateral.",
        "**平行四边形**是两组对边分别平行的四边形。它的角可以由平行线得到：\n\n- **相邻的两个角**是同旁内角，所以**互补**；\n- **对角相等**。\n\n在平行四边形 $ABCD$ 中，若 $\\angle A = 70^\\circ$，则 $\\angle B = \\angle D = 180^\\circ - 70^\\circ = 110^\\circ$，$\\angle C = 70^\\circ$。四个角之和是 $360^\\circ$，与所有四边形一样。",
      ),
      generate(rng) {
        const a = pickGramAngle(rng);
        const angles = [a, 180 - a, a, 180 - a];
        const k = rng.int(0, 3);
        const j = (k + rng.int(1, 3)) % 4;
        const answer = angles[j]!;
        const letters = pickLetters(rng, 4).join("");
        const pts = gramPoints(rng, a);
        const opposite = (j - k + 4) % 4 === 2;
        return {
          ...numberProblem({
            prompt: t(`$${letters}$ is a parallelogram. Find $x$.`, `$${letters}$ 是平行四边形。求 $x$。`),
            answer,
            form: "integer",
            unit: "°",
            wrong: [180 - answer, 360 - angles[k]!, 360 - 2 * angles[k]!],
            solution: opposite
              ? t(
                  `The angles are opposite angles, so they are congruent:${steps(`x = ${answer}^\\circ`)}`,
                  `这两个角是对角，所以相等：${steps(`x = ${answer}^\\circ`)}`,
                )
              : t(
                  `The angles are consecutive angles, so they are supplementary:${steps(`x = 180^\\circ - ${angles[k]}^\\circ = ${answer}^\\circ`)}`,
                  `这两个角是邻角，所以互补：${steps(`x = 180^\\circ - ${angles[k]}^\\circ = ${answer}^\\circ`)}`,
                ),
          }),
          figure: figure(
            [...quadMarks(pts, letters, "none"), quadAngle(pts, k, `${angles[k]}°`), quadAngle(pts, j, "x°", true)],
            `Parallelogram ${letters}: the angle at ${letters[k]} is ${angles[k]}° and the angle at ${letters[j]} is x°.`,
            `平行四边形 ${letters}：${letters[k]} 处的角为 ${angles[k]}°，${letters[j]} 处的角为 x°。`,
          ),
        };
      },
    },
    {
      id: "angle-equations-in-parallelograms",
      title: t("Equations with angles", "关于角的方程"),
      explanation: t(
        "When angles are written with $x$, the properties give an equation: set opposite angles **equal**, or consecutive angles **adding to $180^\\circ$**.\n\nIn parallelogram $ABCD$ with $\\angle A = (2x + 10)^\\circ$ and $\\angle B = (3x - 5)^\\circ$, the angles are consecutive:\n\n$$(2x + 10) + (3x - 5) = 180, \\qquad 5x + 5 = 180, \\qquad x = 35.$$",
        "当角用 $x$ 表示时，由性质可以列方程：对角**相等**，邻角**之和为 $180^\\circ$**。\n\n在平行四边形 $ABCD$ 中，$\\angle A = (2x + 10)^\\circ$，$\\angle B = (3x - 5)^\\circ$，两角是邻角：\n\n$$(2x + 10) + (3x - 5) = 180, \\qquad 5x + 5 = 180, \\qquad x = 35.$$",
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
          const work = opposite
            ? chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`)
            : chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 180`, `${linear(p1 + p2, d1 + d2)} = 180`, `x = ${x}`);
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
              solution: opposite
                ? t(
                    `$\\angle ${P}$ and $\\angle ${R}$ are opposite angles, so they are equal:${work}`,
                    `$\\angle ${P}$ 与 $\\angle ${R}$ 是对角，所以相等：${work}`,
                  )
                : t(
                    `$\\angle ${P}$ and $\\angle ${R}$ are consecutive angles, so they add up to $180^\\circ$:${work}`,
                    `$\\angle ${P}$ 与 $\\angle ${R}$ 是邻角，所以和为 $180^\\circ$：${work}`,
                  ),
            }),
            figure: figure(
              [...quadMarks(pts, letters, "none"), quadAngle(pts, k), quadAngle(pts, j, undefined, true)],
              `Parallelogram ${letters} with the angles at ${P} and ${R} marked.`,
              `平行四边形 ${letters}，标出了 ${P} 和 ${R} 处的角。`,
            ),
          };
        }
      },
    },
    {
      id: "opposite-sides-of-a-parallelogram",
      title: t("Opposite sides", "对边"),
      explanation: t(
        "The opposite sides of a parallelogram are **congruent**. If $AB = 3x - 4$ and $CD = x + 10$, then\n\n$$3x - 4 = x + 10, \\qquad 2x = 14, \\qquad x = 7,$$\n\nand $AB = CD = 3 \\cdot 7 - 4 = 17$. Substitute into both expressions to check that they agree.",
        "平行四边形的对边**相等**。若 $AB = 3x - 4$，$CD = x + 10$，则\n\n$$3x - 4 = x + 10, \\qquad 2x = 14, \\qquad x = 7,$$\n\n且 $AB = CD = 3 \\cdot 7 - 4 = 17$。把 $x$ 代入两个式子，检查结果是否一致。",
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
          const fig = figure(
            [...quadMarks(pts, letters, "none"), ...outside(pts, labels)],
            `Parallelogram ${letters} with ${s1} = ${plain(p1, d1)}, ${s2} = ${plain(p2, d2)} and ${other} = ${w}.`,
            `平行四边形 ${letters}，${s1} = ${plain(p1, d1)}，${s2} = ${plain(p2, d2)}，${other} = ${w}。`,
          );
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
                ? t(`Opposite sides are congruent, so $${s1} = ${s2}$:${work}`, `对边相等，所以 $${s1} = ${s2}$：${work}`)
                : t(
                    `Opposite sides are congruent, so $${s1} = ${s2}$:${work}Then $${s1} = ${p1 === 1 ? "" : `${p1} \\cdot `}${x} ${d1 < 0 ? "-" : "+"} ${Math.abs(d1)} = ${v}$.`,
                    `对边相等，所以 $${s1} = ${s2}$：${work}于是 $${s1} = ${p1 === 1 ? "" : `${p1} \\cdot `}${x} ${d1 < 0 ? "-" : "+"} ${Math.abs(d1)} = ${v}$。`,
                  ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "diagonals-of-a-parallelogram",
      title: t("Diagonals of a parallelogram", "平行四边形的对角线"),
      explanation: t(
        "The diagonals of a parallelogram **bisect each other**: if they meet at $E$, then $AE = CE$ and $BE = DE$. (They are usually not congruent to each other.) So each diagonal is twice either of its halves.\n\nIf $AE = 2x + 1$ and $CE = 4x - 7$, then $2x + 1 = 4x - 7$, so $x = 4$, $AE = 9$ and $AC = 18$.",
        "平行四边形的对角线**互相平分**：若交于 $E$，则 $AE = CE$，$BE = DE$。（两条对角线一般不相等。）所以每条对角线是它任一半的两倍。\n\n若 $AE = 2x + 1$，$CE = 4x - 7$，则 $2x + 1 = 4x - 7$，所以 $x = 4$，$AE = 9$，$AC = 18$。",
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
          const work = chain(`${linear(p1, d1)} = ${linear(p2, d2)}`, `${linear(p1 - p2, 0)} = ${d2 - d1}`, `x = ${x}`);
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
                ? t(`The diagonals bisect each other, so $${h1} = ${h2}$:${work}`, `对角线互相平分，所以 $${h1} = ${h2}$：${work}`)
                : t(
                    `The diagonals bisect each other, so $${h1} = ${h2}$:${work}So $${h1} = ${half}$ and $${whole} = 2 \\cdot ${half} = ${2 * half}$.`,
                    `对角线互相平分，所以 $${h1} = ${h2}$：${work}于是 $${h1} = ${half}$，$${whole} = 2 \\cdot ${half} = ${2 * half}$。`,
                  ),
            }),
            figure: figure(
              quadMarks(pts, letters, "both", E),
              `Parallelogram ${letters} with diagonals ${A}${C} and ${B}${D} meeting at ${E}.`,
              `平行四边形 ${letters}，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}。`,
            ),
          };
        }
      },
    },
  ],
};

/** proofGram places a parallelogram for a proof. */
const proofGram = (rng: Rng) => gramPoints(rng, rng.int(55, 72));

/** oppositeSidesProof proves that opposite sides (variant 0) or opposite angles (variant 1) of a parallelogram are congruent. */
function oppositeSidesProof(rng: Rng, variant: 0 | 1): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  return {
    given: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    prove: variant === 0 ? both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`) : mt(`\\angle ${B} = \\angle ${D}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: both(`${A}${B} \\parallel ${D}${C}`, `${B}${C} \\parallel ${A}${D}`),
        r: "parallelogram",
        alts: [both(`${A}${B} = ${D}${C}`, `${B}${C} = ${A}${D}`), mt(`${A}${C} \\parallel ${B}${D}`), mt(`${A}${B} \\perp ${B}${C}`)],
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
      },
      {
        s: mt(`\\angle ${B}${C}${A} = \\angle ${D}${A}${C}`),
        r: "alternate",
        why: t(
          `$${B}${C} \\parallel ${A}${D}$, cut by the transversal $${A}${C}$.`,
          `$${B}${C} \\parallel ${A}${D}$，被截线 $${A}${C}$ 所截。`,
        ),
      },
      { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive" },
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
          }
        : {
            s: mt(`\\angle ${B} = \\angle ${D}`),
            r: "cpctc",
            alts: [mt(`\\angle ${B} = \\angle ${C}`), mt(`\\angle ${A} = \\angle ${B}`), mt(`\\angle ${B} + \\angle ${D} = 90^\\circ`)],
          },
    ],
    figure: figure(quadMarks(pts, L, "ac"), `Parallelogram ${L} with the diagonal ${A}${C}.`, `平行四边形 ${L}，连接对角线 ${A}${C}。`),
  };
}

/** diagonalsProof proves that the diagonals of a parallelogram bisect each other. */
function diagonalsProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  return {
    given: t(`$${L}$ is a parallelogram whose diagonals meet at $${E}$`, `$${L}$ 是平行四边形，对角线交于 $${E}$`),
    prove: both(`${A}${E} = ${C}${E}`, `${B}${E} = ${D}${E}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: mt(`${A}${B} \\parallel ${D}${C}`),
        r: "parallelogram",
        alts: [mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
      },
      {
        s: mt(`${A}${B} = ${D}${C}`),
        r: "oppositeSides",
        alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${C} = ${B}${D}`), mt(`${A}${E} = ${B}${E}`)],
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
      },
      {
        s: mt(`\\angle ${A}${B}${E} = \\angle ${C}${D}${E}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${B}${D}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${B}${D}$ 所截。`,
        ),
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
      },
    ],
    figure: figure(
      quadMarks(pts, L, "both", E),
      `Parallelogram ${L} with diagonals ${A}${C} and ${B}${D} meeting at ${E}.`,
      `平行四边形 ${L}，对角线 ${A}${C} 与 ${B}${D} 交于 ${E}。`,
    ),
  };
}

/** consecutiveProof proves that opposite angles of a parallelogram are congruent, through consecutive angles. */
function consecutiveProof(rng: Rng): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const L = `${A}${B}${C}${D}`;
  const pts = proofGram(rng);
  return {
    given: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    prove: mt(`\\angle ${A} = \\angle ${C}`),
    steps: [
      { s: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`), r: "given" },
      {
        s: both(`${A}${B} \\parallel ${D}${C}`, `${A}${D} \\parallel ${B}${C}`),
        r: "parallelogram",
        alts: [both(`${A}${B} \\parallel ${A}${D}`, `${B}${C} \\parallel ${D}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
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
    figure: figure(
      [...quadMarks(pts, L, "none"), quadAngle(pts, 0), quadAngle(pts, 2), quadAngle(pts, 3, undefined, true)],
      `Parallelogram ${L} with the angles at ${A}, ${C} and ${D} marked.`,
      `平行四边形 ${L}，标出了 ${A}、${C}、${D} 处的角。`,
    ),
  };
}

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
  encompasses: [
    { topic: "properties-of-parallelograms", weight: 0.3 },
    { topic: "proving-congruence-statements", weight: 0.3 },
    { topic: "proving-alternate-angle-theorems", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.11"],
  knowledgePoints: [
    {
      id: "proving-opposite-sides-and-angles",
      title: t("Opposite sides and angles", "对边与对角"),
      explanation: t(
        "To prove that the opposite sides of parallelogram $ABCD$ are congruent, draw the diagonal $AC$ and show that it splits the parallelogram into two congruent triangles:\n\n1. $AB \\parallel DC$ and $BC \\parallel AD$: definition of a parallelogram.\n2. $\\angle BAC = \\angle DCA$ and $\\angle BCA = \\angle DAC$: alternate interior angles, with $AC$ as the transversal.\n3. $AC = AC$: reflexive property.\n4. $\\triangle ABC \\cong \\triangle CDA$: ASA, since $AC$ lies between the angles.\n5. $AB = CD$, $BC = DA$, and also $\\angle B = \\angle D$: corresponding parts of congruent triangles.\n\nTake care with the order of the letters: $A$ corresponds to $C$, $B$ to $D$, $C$ to $A$.",
        "要证明平行四边形 $ABCD$ 的对边相等，连接对角线 $AC$，证明它把平行四边形分成两个全等三角形：\n\n1. $AB \\parallel DC$，$BC \\parallel AD$：平行四边形的定义。\n2. $\\angle BAC = \\angle DCA$，$\\angle BCA = \\angle DAC$：以 $AC$ 为截线的内错角。\n3. $AC = AC$：自反性。\n4. $\\triangle ABC \\cong \\triangle CDA$：ASA，因为 $AC$ 夹在两角之间。\n5. $AB = CD$，$BC = DA$，还有 $\\angle B = \\angle D$：全等三角形的对应部分相等。\n\n注意字母的顺序：$A$ 对应 $C$，$B$ 对应 $D$，$C$ 对应 $A$。",
      ),
      keyPrerequisites: ["proving-congruence-statements"],
      generate: (rng) => proofProblem(rng, oppositeSidesProof(rng, rng.bool() ? 0 : 1), parallelogramPool),
    },
    {
      id: "proving-the-diagonals-bisect-each-other",
      title: t("The diagonals bisect each other", "对角线互相平分"),
      explanation: t(
        "Once opposite sides are known to be congruent, that fact can be cited as a reason. Let the diagonals of parallelogram $ABCD$ meet at $E$:\n\n1. $AB \\parallel DC$: definition of a parallelogram.\n2. $AB = DC$: opposite sides of a parallelogram are congruent.\n3. $\\angle BAE = \\angle DCE$ (transversal $AC$) and $\\angle ABE = \\angle CDE$ (transversal $BD$): alternate interior angles.\n4. $\\triangle ABE \\cong \\triangle CDE$: ASA.\n5. $AE = CE$ and $BE = DE$: corresponding parts of congruent triangles. So $E$ is the midpoint of both diagonals.",
        "对边相等证明之后，就可以作为理由使用。设平行四边形 $ABCD$ 的对角线交于 $E$：\n\n1. $AB \\parallel DC$：平行四边形的定义。\n2. $AB = DC$：平行四边形的对边相等。\n3. $\\angle BAE = \\angle DCE$（截线 $AC$），$\\angle ABE = \\angle CDE$（截线 $BD$）：内错角相等。\n4. $\\triangle ABE \\cong \\triangle CDE$：ASA。\n5. $AE = CE$，$BE = DE$：全等三角形的对应部分相等。所以 $E$ 是两条对角线的中点。",
      ),
      generate: (rng) => proofProblem(rng, diagonalsProof(rng), parallelogramPool),
    },
    {
      id: "proving-with-consecutive-angles",
      title: t("Opposite angles from consecutive angles", "由邻角证明对角相等"),
      explanation: t(
        "Opposite angles can also be proved equal without triangles. In parallelogram $ABCD$:\n\n1. $\\angle A + \\angle D = 180^\\circ$: consecutive interior angles, since $AB \\parallel DC$ with transversal $AD$.\n2. $\\angle C + \\angle D = 180^\\circ$: consecutive interior angles, since $AD \\parallel BC$ with transversal $DC$.\n3. $\\angle A + \\angle D = \\angle C + \\angle D$: substitution.\n4. $\\angle A = \\angle C$: subtraction property of equality.",
        "对角相等也可以不借助三角形来证明。在平行四边形 $ABCD$ 中：\n\n1. $\\angle A + \\angle D = 180^\\circ$：$AB \\parallel DC$，截线为 $AD$，同旁内角互补。\n2. $\\angle C + \\angle D = 180^\\circ$：$AD \\parallel BC$，截线为 $DC$，同旁内角互补。\n3. $\\angle A + \\angle D = \\angle C + \\angle D$：等量代换。\n4. $\\angle A = \\angle C$：等式的减法性质。",
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
    },
    {
      s: mt(`${B}${C} \\parallel ${A}${D}`),
      r: "altConverse",
      why: t(`The alternate interior angles along $${A}${C}$ are equal.`, `沿截线 $${A}${C}$ 的内错角相等。`),
      alts: [mt(`${B}${C} = ${A}${D}`), mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`)],
    },
  ];
  if (variant === 0) {
    return {
      given: both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`),
      prove: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
      steps: [
        { s: both(`${A}${B} = ${C}${D}`, `${B}${C} = ${D}${A}`), r: "given" },
        { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive" },
        { ...tri("sss"), why: t("All three pairs of sides are equal.", "三组对应边分别相等。") },
        {
          s: mt(`\\angle ${B}${A}${C} = \\angle ${D}${C}${A}`),
          r: "cpctc",
          alts: [mt(`\\angle ${B}${A}${C} = \\angle ${B}${C}${A}`), mt(`\\angle ${B}${A}${C} = \\angle ${D}${A}${C}`)],
        },
        {
          s: mt(`${A}${B} \\parallel ${D}${C}`),
          r: "altConverse",
          why: t(`The alternate interior angles along $${A}${C}$ are equal.`, `沿截线 $${A}${C}$ 的内错角相等。`),
          alts: [mt(`${A}${B} = ${D}${C}`), mt(`${A}${B} \\parallel ${A}${D}`), mt(`${A}${C} \\parallel ${B}${D}`)],
        },
        ...second,
        isGram,
      ],
      figure: figure(
        [
          ...quadMarks(pts, L, "ac"),
          { kind: "ticks", a: pa, b: pb, count: 1 },
          { kind: "ticks", a: pc, b: pd, count: 1 },
          { kind: "ticks", a: pb, b: pc, count: 2 },
          { kind: "ticks", a: pd, b: pa, count: 2 },
        ],
        `Quadrilateral ${L} with ${A}${B} = ${C}${D}, ${B}${C} = ${D}${A}, and the diagonal ${A}${C}.`,
        `四边形 ${L}，${A}${B} = ${C}${D}，${B}${C} = ${D}${A}，连接对角线 ${A}${C}。`,
      ),
    };
  }
  return {
    given: both(`${A}${B} \\parallel ${D}${C}`, `${A}${B} = ${D}${C}`),
    prove: t(`$${L}$ is a parallelogram`, `$${L}$ 是平行四边形`),
    steps: [
      { s: both(`${A}${B} \\parallel ${D}${C}`, `${A}${B} = ${D}${C}`), r: "given" },
      {
        s: mt(`\\angle ${B}${A}${C} = \\angle ${D}${C}${A}`),
        r: "alternate",
        why: t(
          `$${A}${B} \\parallel ${D}${C}$, cut by the transversal $${A}${C}$.`,
          `$${A}${B} \\parallel ${D}${C}$，被截线 $${A}${C}$ 所截。`,
        ),
        alts: [mt(`\\angle ${B}${A}${C} = \\angle ${B}${C}${A}`), mt(`\\angle ${B}${A}${C} = \\angle ${D}${A}${C}`)],
      },
      { s: mt(`${A}${C} = ${A}${C}`), r: "reflexive" },
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
    figure: figure(
      [
        ...quadMarks(pts, L, "ac"),
        { kind: "ticks", a: pa, b: pb, count: 1 },
        { kind: "ticks", a: pd, b: pc, count: 1 },
        { kind: "arrows", a: pa, b: pb, count: 1 },
        { kind: "arrows", a: pd, b: pc, count: 1 },
      ],
      `Quadrilateral ${L} with ${A}${B} parallel and equal to ${D}${C}, and the diagonal ${A}${C}.`,
      `四边形 ${L}，${A}${B} 与 ${D}${C} 平行且相等，连接对角线 ${A}${C}。`,
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
      { s: both(`${A}${E} = ${C}${E}`, `${B}${E} = ${D}${E}`), r: "given" },
      {
        s: mt(`\\angle ${A}${E}${B} = \\angle ${C}${E}${D}`),
        r: "vertical",
        alts: [
          mt(`\\angle ${A}${E}${B} = \\angle ${B}${E}${C}`),
          mt(`\\angle ${A}${E}${B} = 90^\\circ`),
          mt(`\\angle ${A}${E}${B} = \\angle ${A}${E}${D}`),
        ],
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
      { s: mt(`${A}${B} = ${C}${D}`), r: "cpctc", alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${C} = ${B}${D}`)] },
      {
        s: mt(`\\angle ${A}${B}${E} = \\angle ${C}${D}${E}`),
        r: "cpctc",
        alts: [mt(`\\angle ${A}${B}${E} = \\angle ${B}${A}${E}`), mt(`\\angle ${A}${B}${E} = \\angle ${C}${B}${E}`)],
      },
      {
        s: mt(`${A}${B} \\parallel ${D}${C}`),
        r: "altConverse",
        why: t(`The alternate interior angles along $${B}${D}$ are equal.`, `沿截线 $${B}${D}$ 的内错角相等。`),
        alts: [mt(`${A}${B} \\parallel ${B}${C}`), mt(`${A}${C} \\parallel ${B}${D}`), mt(`${A}${D} \\parallel ${B}${D}`)],
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
    figure: figure(
      [
        ...quadMarks(pts, L, "both", E),
        { kind: "ticks", a: pa, b: pe, count: 1 },
        { kind: "ticks", a: pe, b: pc, count: 1 },
        { kind: "ticks", a: pb, b: pe, count: 2 },
        { kind: "ticks", a: pe, b: pd, count: 2 },
      ],
      `Quadrilateral ${L} whose diagonals meet at ${E}, with ${A}${E} = ${C}${E} and ${B}${E} = ${D}${E}.`,
      `四边形 ${L}，对角线交于 ${E}，${A}${E} = ${C}${E}，${B}${E} = ${D}${E}。`,
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
  return {
    given: t(`$${L}$ is a parallelogram with $${A}${C} = ${D}${B}$`, `$${L}$ 是平行四边形，$${A}${C} = ${D}${B}$`),
    prove: t(`$${L}$ is a rectangle`, `$${L}$ 是矩形`),
    steps: [
      { s: t(`$${L}$ is a parallelogram with $${A}${C} = ${D}${B}$`, `$${L}$ 是平行四边形，$${A}${C} = ${D}${B}$`), r: "given" },
      { s: mt(`${A}${B} = ${D}${C}`), r: "oppositeSides", alts: [mt(`${A}${B} = ${B}${C}`), mt(`${A}${B} = ${A}${C}`)] },
      { s: mt(`${B}${C} = ${C}${B}`), r: "reflexive" },
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
      },
      {
        s: mt(`\\angle ${A}${B}${C} = 90^\\circ`),
        r: "halving",
        why: t(`By steps 5 and 6, $2\\angle ${A}${B}${C} = 180^\\circ$.`, `由第 5、6 步，$2\\angle ${A}${B}${C} = 180^\\circ$。`),
        alts: [mt(`\\angle ${A}${B}${C} = 45^\\circ`), mt(`\\angle ${A}${B}${C} = 180^\\circ`)],
      },
      { s: t(`$${L}$ is a rectangle`, `$${L}$ 是矩形`), r: "rightParallelogram" },
    ],
    figure: figure(
      quadMarks(pts, L, "both"),
      `Parallelogram ${L} with equal diagonals ${A}${C} and ${B}${D}.`,
      `平行四边形 ${L}，对角线 ${A}${C} 与 ${B}${D} 相等。`,
    ),
  };
}

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
    { topic: "proving-properties-of-parallelograms", weight: 0.4 },
    { topic: "proving-alternate-angle-converses", weight: 0.3 },
    { topic: "properties-of-parallelograms", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.CO.C.11"],
  knowledgePoints: [
    {
      id: "proving-the-side-criteria",
      title: t("Criteria from the sides", "由边判定"),
      explanation: t(
        "The converses of the properties are criteria: they prove that a quadrilateral **is** a parallelogram. To prove that $ABCD$ with $AB = CD$ and $BC = DA$ is a parallelogram, draw the diagonal $AC$:\n\n1. $AC = AC$: reflexive property, so $\\triangle ABC \\cong \\triangle CDA$ by SSS.\n2. $\\angle BAC = \\angle DCA$: corresponding parts, so $AB \\parallel DC$ by the converse of the alternate interior angles theorem.\n3. Likewise $\\angle BCA = \\angle DAC$ gives $BC \\parallel AD$.\n4. Both pairs of opposite sides are parallel: $ABCD$ is a parallelogram by definition.\n\nIf instead one pair is given both parallel and congruent ($AB \\parallel DC$, $AB = DC$), alternate interior angles give $\\angle BAC = \\angle DCA$, and the triangles are congruent by SAS.",
        "性质的逆命题就是判定方法：它们证明一个四边形**是**平行四边形。要证明 $AB = CD$、$BC = DA$ 的四边形 $ABCD$ 是平行四边形，连接对角线 $AC$：\n\n1. $AC = AC$：自反性，所以由 SSS，$\\triangle ABC \\cong \\triangle CDA$。\n2. $\\angle BAC = \\angle DCA$：对应部分相等，所以由内错角相等，两直线平行，$AB \\parallel DC$。\n3. 同理，由 $\\angle BCA = \\angle DAC$ 得 $BC \\parallel AD$。\n4. 两组对边分别平行：由定义，$ABCD$ 是平行四边形。\n\n若已知的是一组对边平行且相等（$AB \\parallel DC$，$AB = DC$），则由内错角得 $\\angle BAC = \\angle DCA$，再由 SAS 得两三角形全等。",
      ),
      keyPrerequisites: ["proving-alternate-angle-converses"],
      generate: (rng) => proofProblem(rng, sidesCriterionProof(rng, rng.bool() ? 0 : 1), criteriaPool),
    },
    {
      id: "proving-the-diagonal-criterion",
      title: t("Diagonals that bisect each other", "对角线互相平分"),
      explanation: t(
        "If the diagonals of $ABCD$ bisect each other at $E$, the quadrilateral is a parallelogram:\n\n1. $\\angle AEB = \\angle CED$: vertical angles.\n2. $\\triangle AEB \\cong \\triangle CED$: SAS, with $AE = CE$ and $BE = DE$.\n3. $AB = CD$ and $\\angle ABE = \\angle CDE$: corresponding parts.\n4. $AB \\parallel DC$: converse of the alternate interior angles theorem, with $BD$ as the transversal.\n5. $AB$ and $DC$ are both parallel and congruent, so $ABCD$ is a parallelogram.",
        "若四边形 $ABCD$ 的对角线在 $E$ 处互相平分，则它是平行四边形：\n\n1. $\\angle AEB = \\angle CED$：对顶角相等。\n2. $\\triangle AEB \\cong \\triangle CED$：SAS，因为 $AE = CE$，$BE = DE$。\n3. $AB = CD$，$\\angle ABE = \\angle CDE$：对应部分相等。\n4. $AB \\parallel DC$：以 $BD$ 为截线，内错角相等，两直线平行。\n5. $AB$ 与 $DC$ 平行且相等，所以 $ABCD$ 是平行四边形。",
      ),
      generate: (rng) => proofProblem(rng, bisectingDiagonalsProof(rng), criteriaPool),
    },
    {
      id: "proving-the-rectangle-criterion",
      title: t("Congruent diagonals make a rectangle", "对角线相等的平行四边形是矩形"),
      explanation: t(
        "A **rectangle** is a parallelogram with a right angle (and then all four angles are right). If parallelogram $ABCD$ has $AC = DB$:\n\n1. $AB = DC$: opposite sides; $BC = CB$: reflexive property.\n2. $\\triangle ABC \\cong \\triangle DCB$: SSS, so $\\angle ABC = \\angle DCB$.\n3. $\\angle ABC + \\angle DCB = 180^\\circ$: consecutive interior angles, since $AB \\parallel DC$.\n4. Substituting, $2\\angle ABC = 180^\\circ$, so $\\angle ABC = 90^\\circ$ and $ABCD$ is a rectangle.",
        "**矩形**是有一个角是直角的平行四边形（这时四个角都是直角）。若平行四边形 $ABCD$ 满足 $AC = DB$：\n\n1. $AB = DC$：对边相等；$BC = CB$：自反性。\n2. $\\triangle ABC \\cong \\triangle DCB$：SSS，所以 $\\angle ABC = \\angle DCB$。\n3. $\\angle ABC + \\angle DCB = 180^\\circ$：$AB \\parallel DC$，同旁内角互补。\n4. 代入得 $2\\angle ABC = 180^\\circ$，所以 $\\angle ABC = 90^\\circ$，$ABCD$ 是矩形。",
      ),
      generate: (rng) => proofProblem(rng, rectangleProof(rng), criteriaPool),
    },
    {
      id: "values-that-make-a-parallelogram",
      title: t("Values that make a parallelogram", "使四边形成为平行四边形的值"),
      explanation: t(
        "A criterion tells which condition to impose. To make $ABCD$ a parallelogram, make both pairs of opposite sides equal, or make the diagonals bisect each other. To make parallelogram $ABCD$ a rectangle, make its diagonals equal.\n\nIf the diagonals of $ABCD$ meet at $E$ with $AE = 5x - 3$ and $CE = 2x + 9$, they bisect each other when $5x - 3 = 2x + 9$, that is, when $x = 4$.",
        "判定方法告诉我们应当满足什么条件。要使 $ABCD$ 成为平行四边形，可以让两组对边分别相等，或让对角线互相平分。要使平行四边形 $ABCD$ 成为矩形，让它的对角线相等。\n\n若 $ABCD$ 的对角线交于 $E$，$AE = 5x - 3$，$CE = 2x + 9$，则当 $5x - 3 = 2x + 9$，即 $x = 4$ 时，对角线互相平分。",
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
            t("Both pairs of opposite sides must be congruent:", "两组对边必须分别相等："),
            t("The diagonals must bisect each other:", "对角线必须互相平分："),
            t("A parallelogram with congruent diagonals is a rectangle:", "对角线相等的平行四边形是矩形："),
          ][kind]!;
          return numberProblem({
            prompt: setting,
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [-x, intOr(d2 + d1, p1 - p2, x + 2), intOr(-d1 - d2, p1 + p2, x + 1)],
            solution: t(`${reason.en}${work}`, `${reason["zh-CN"]}${work}`),
          });
        }
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Trigonometry

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
  knowledgePoints: [
    {
      id: "naming-the-sides",
      title: t("Opposite, adjacent and hypotenuse", "对边、邻边与斜边"),
      explanation: t(
        "In a right triangle, the **hypotenuse** is the side opposite the right angle. Seen from one of the acute angles, the two legs get names:\n\n- the **opposite side** is the leg across from the angle, the one that does not touch it;\n- the **adjacent side** is the leg that forms the angle together with the hypotenuse.\n\nIn right triangle $ABC$ with the right angle at $C$: seen from $\\angle A$, $BC$ is opposite and $AC$ is adjacent; seen from $\\angle B$ they swap: $AC$ is opposite and $BC$ is adjacent. The hypotenuse $AB$ is the same for both.",
        "直角三角形中，**斜边**是直角所对的边。从某个锐角来看，两条直角边各有名称：\n\n- **对边**是与这个角相对的直角边，即不经过这个角的顶点的那条；\n- **邻边**是与斜边一起组成这个角的直角边。\n\n在直角三角形 $ABC$ 中，直角在 $C$：从 $\\angle A$ 看，$BC$ 是对边，$AC$ 是邻边；从 $\\angle B$ 看两者互换：$AC$ 是对边，$BC$ 是邻边。斜边 $AB$ 对两个角都一样。",
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
        const why = {
          opp: t(`$${right}$ is the leg that does not touch $${P}$.`, `$${right}$ 是不经过顶点 $${P}$ 的直角边。`),
          adj: t(
            `$${right}$ is the leg that, with the hypotenuse, forms $\\angle ${P}$.`,
            `$${right}$ 是与斜边一起组成 $\\angle ${P}$ 的直角边。`,
          ),
          hyp: t(`$${right}$ is opposite the right angle at $${R}$.`, `$${right}$ 是直角 $${R}$ 所对的边。`),
        }[kind];
        return {
          ...choiceProblem({
            prompt: t(
              `In right triangle $${R}${U}${V}$, the right angle is at $${R}$. ${question.en}`,
              `在直角三角形 $${R}${U}${V}$ 中，直角在 $${R}$。${question["zh-CN"]}`,
            ),
            options: sides.map((s) => same(`$${s}$`)),
            correct: sides.indexOf(right),
            solution: why,
          }),
          figure: rightFigure(
            rng,
            rng.int(3, 6),
            rng.int(3, 6),
            { letters: `${R}${U}${V}`, ...(atU ? { atU: "" } : { atV: "" }) },
            `Right triangle ${R}${U}${V} with the right angle at ${R} and angle ${P} marked.`,
            `直角三角形 ${R}${U}${V}，直角在 ${R}，标出了角 ${P}。`,
          ),
        };
      },
    },
    {
      id: "the-other-acute-angle",
      title: t("The other acute angle", "另一个锐角"),
      explanation: t(
        "The angles of a triangle add up to $180^\\circ$ and the right angle takes $90^\\circ$, so the two acute angles of a right triangle add up to $90^\\circ$: they are **complementary**. If one acute angle is $35^\\circ$, the other is $90^\\circ - 35^\\circ = 55^\\circ$.",
        "三角形内角和是 $180^\\circ$，直角占了 $90^\\circ$，所以直角三角形的两个锐角之和是 $90^\\circ$：它们**互余**。若一个锐角是 $35^\\circ$，另一个就是 $90^\\circ - 35^\\circ = 55^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(22, 68);
        const atU = rng.bool();
        const [p, qq] = [Math.cos(rad(a)), Math.sin(rad(a))];
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: 90 - a,
            form: "integer",
            unit: "°",
            wrong: [180 - a, 90 + a, a],
            solution: t(
              `The acute angles of a right triangle are complementary:${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
              `直角三角形的两个锐角互余：${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
            ),
          }),
          figure: atU
            ? rightFigure(
                rng,
                p,
                qq,
                { atU: `${a}°`, atV: "x°" },
                `A right triangle with acute angles ${a}° and x°.`,
                `一个直角三角形，两个锐角为 ${a}° 和 x°。`,
              )
            : rightFigure(
                rng,
                qq,
                p,
                { atV: `${a}°`, atU: "x°" },
                `A right triangle with acute angles ${a}° and x°.`,
                `一个直角三角形，两个锐角为 ${a}° 和 x°。`,
              ),
        };
      },
    },
    {
      id: "acute-angles-as-expressions",
      title: t("Acute angles as expressions", "用代数式表示的锐角"),
      explanation: t(
        "When the acute angles are written with $x$, set their sum equal to $90^\\circ$. If they are $(2x + 6)^\\circ$ and $(4x - 12)^\\circ$:\n\n$$(2x + 6) + (4x - 12) = 90, \\qquad 6x - 6 = 90, \\qquad x = 16.$$\n\nThe angles are $38^\\circ$ and $52^\\circ$, which indeed add up to $90^\\circ$.",
        "当两个锐角用 $x$ 表示时，令它们的和等于 $90^\\circ$。若两角为 $(2x + 6)^\\circ$ 和 $(4x - 12)^\\circ$：\n\n$$(2x + 6) + (4x - 12) = 90, \\qquad 6x - 6 = 90, \\qquad x = 16.$$\n\n两角为 $38^\\circ$ 和 $52^\\circ$，确实和为 $90^\\circ$。",
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
              solution: t(
                `The acute angles add up to $90^\\circ$:${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}`,
                `两个锐角之和是 $90^\\circ$：${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}`,
              ),
            }),
            figure: rightFigure(
              rng,
              p,
              qq,
              { atU: "", atV: "", letters: `${R}${U}${V}` },
              `Right triangle ${R}${U}${V} with the right angle at ${R} and the acute angles at ${U} and ${V} marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，标出了 ${U}、${V} 处的锐角。`,
            ),
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
}

/** ratioSetup draws a right triangle with Pythagorean sides and picks the angle. */
function ratioSetup(rng: Rng, max = 45): RatioSetup {
  const [a, b, c] = pickTriple(rng, max);
  const [R, U, V] = pickTriLetters(rng);
  const atU = rng.bool();
  return { R, U, V, P: atU ? U : V, atU, a, b, c, opp: atU ? b : a, adj: atU ? a : b };
}

/** ratioFigure draws a ratio setup with all three sides labeled and the angle marked. */
function ratioFigure(rng: Rng, s: RatioSetup, sides?: readonly [string | null, string | null, string | null]): Figure {
  const labels = sides ?? [`${s.a}`, `${s.c}`, `${s.b}`];
  const shown = (i: number) => labels[i] ?? "?";
  return rightFigure(
    rng,
    s.a,
    s.b,
    { sides: labels, letters: `${s.R}${s.U}${s.V}`, ...(s.atU ? { atU: "" } : { atV: "" }) },
    `Right triangle ${s.R}${s.U}${s.V} with the right angle at ${s.R}: ${s.R}${s.U} = ${shown(0)}, ${s.U}${s.V} = ${shown(1)}, ${s.V}${s.R} = ${shown(2)}. Angle ${s.P} is marked.`,
    `直角三角形 ${s.R}${s.U}${s.V}，直角在 ${s.R}：${s.R}${s.U} = ${shown(0)}，${s.U}${s.V} = ${shown(1)}，${s.V}${s.R} = ${shown(2)}。标出了角 ${s.P}。`,
  );
}

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
  return {
    ...numberProblem({
      prompt: t(`Find $\\${f} ${s.P}$. Give your answer as a fraction in lowest terms.`, `求 $\\${f} ${s.P}$。答案写成最简分数。`),
      answer,
      form: "fraction",
      wrong,
      solution: t(
        `Seen from $\\angle ${s.P}$, the opposite side is $${s.opp}$, the adjacent side is $${s.adj}$ and the hypotenuse is $${s.c}$. The ${fnNames[f].en} is ${sideNames[n].en} over ${sideNames[d].en}:${steps(`${ratioTex(f, s.P, sides)} = ${answer.toLatex()}`)}`,
        `从 $\\angle ${s.P}$ 看，对边是 $${s.opp}$，邻边是 $${s.adj}$，斜边是 $${s.c}$。${fnNames[f]["zh-CN"]}等于${sideNames[n]["zh-CN"]}比${sideNames[d]["zh-CN"]}：${steps(`${ratioTex(f, s.P, sides)} = ${answer.toLatex()}`)}`,
      ),
    }),
    figure: ratioFigure(rng, s),
  };
}

const sohcahtoa = t(
  "The three **trigonometric ratios** of an acute angle $\\theta$ in a right triangle are\n\n$$\\sin \\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\qquad \\cos \\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}, \\qquad \\tan \\theta = \\frac{\\text{opposite}}{\\text{adjacent}}.$$\n\nA way to remember them is SOH-CAH-TOA.",
  "直角三角形中锐角 $\\theta$ 的三个**三角比**是\n\n$$\\sin \\theta = \\frac{\\text{对边}}{\\text{斜边}}, \\qquad \\cos \\theta = \\frac{\\text{邻边}}{\\text{斜边}}, \\qquad \\tan \\theta = \\frac{\\text{对边}}{\\text{邻边}}.$$\n\n分别读作正弦、余弦、正切。",
);

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
  knowledgePoints: [
    {
      id: "the-sine",
      title: t("The sine", "正弦"),
      explanation: t(
        `${sohcahtoa.en}\n\nIn a right triangle with legs $5$ and $12$ and hypotenuse $13$, the angle $\\theta$ opposite the leg $5$ has\n\n$$\\sin \\theta = \\frac{5}{13}.$$\n\nWrite the ratio as a fraction in lowest terms: with sides $6$, $8$, $10$, the sine of the angle opposite $6$ is $\\frac{6}{10} = \\frac{3}{5}$.`,
        `${sohcahtoa["zh-CN"]}\n\n直角边为 $5$ 和 $12$、斜边为 $13$ 的直角三角形中，与直角边 $5$ 相对的角 $\\theta$ 满足\n\n$$\\sin \\theta = \\frac{5}{13}.$$\n\n比值写成最简分数：三边为 $6$、$8$、$10$ 时，与 $6$ 相对的角的正弦是 $\\frac{6}{10} = \\frac{3}{5}$。`,
      ),
      generate: (rng) => wholeRatioProblem(rng, "sin"),
    },
    {
      id: "the-cosine",
      title: t("The cosine", "余弦"),
      explanation: t(
        "The **cosine** is the adjacent side over the hypotenuse. In the triangle with legs $5$ and $12$ and hypotenuse $13$, the angle $\\theta$ opposite $5$ has adjacent side $12$, so\n\n$$\\cos \\theta = \\frac{12}{13}.$$\n\nThe hypotenuse is always the denominator of the sine and the cosine, so both are less than $1$.",
        "**余弦**是邻边比斜边。在直角边为 $5$ 和 $12$、斜边为 $13$ 的三角形中，与 $5$ 相对的角 $\\theta$ 的邻边是 $12$，所以\n\n$$\\cos \\theta = \\frac{12}{13}.$$\n\n正弦和余弦的分母都是斜边，所以两者都小于 $1$。",
      ),
      generate: (rng) => wholeRatioProblem(rng, "cos"),
    },
    {
      id: "the-tangent",
      title: t("The tangent", "正切"),
      explanation: t(
        "The **tangent** uses only the legs: opposite over adjacent. For the angle $\\theta$ opposite $5$ in the $5$-$12$-$13$ triangle,\n\n$$\\tan \\theta = \\frac{5}{12},$$\n\nand for the other acute angle the legs swap: its tangent is $\\frac{12}{5}$. A tangent can be greater than $1$.",
        "**正切**只用两条直角边：对边比邻边。在 $5$-$12$-$13$ 三角形中，与 $5$ 相对的角 $\\theta$ 有\n\n$$\\tan \\theta = \\frac{5}{12},$$\n\n而另一个锐角的两条直角边互换，它的正切是 $\\frac{12}{5}$。正切可以大于 $1$。",
      ),
      generate: (rng) => wholeRatioProblem(rng, (["sin", "cos", "tan", "tan"] as const)[rng.int(0, 3)]!),
    },
    {
      id: "naming-the-ratio",
      title: t("Which ratio is it?", "是哪个三角比？"),
      explanation: t(
        "To recognize a ratio, ask which sides it uses, seen from the angle in question. In right triangle $ABC$ with the right angle at $C$, $\\frac{BC}{AB}$ is opposite over hypotenuse for $\\angle A$, so it is $\\sin A$; for $\\angle B$, $BC$ is adjacent, so the same fraction is $\\cos B$.",
        "要辨认一个比，看它用了哪两条边，并且要从所讨论的角来看。在直角三角形 $ABC$ 中，直角在 $C$，对 $\\angle A$ 而言 $\\frac{BC}{AB}$ 是对边比斜边，所以是 $\\sin A$；对 $\\angle B$ 而言 $BC$ 是邻边，所以同一个分数是 $\\cos B$。",
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
        return {
          ...choiceProblem({
            prompt: t(`Which ratio equals $\\frac{${pick.v[0]}}{${pick.v[1]}}$?`, `哪个三角比等于 $\\frac{${pick.v[0]}}{${pick.v[1]}}$？`),
            options: options.map((o) => same(`$\\${o.f} ${o.at}$`)),
            correct: k,
            solution: t(
              `Seen from $\\angle ${pick.at}$, $${pick.v[0]}$ is ${sideNames[fnSides[pick.f][0]].en} and $${pick.v[1]}$ is ${sideNames[fnSides[pick.f][1]].en}, so the ratio is $\\${pick.f} ${pick.at}$.`,
              `从 $\\angle ${pick.at}$ 看，$${pick.v[0]}$ 是${sideNames[fnSides[pick.f][0]]["zh-CN"]}，$${pick.v[1]}$ 是${sideNames[fnSides[pick.f][1]]["zh-CN"]}，所以这个比是 $\\${pick.f} ${pick.at}$。`,
            ),
          }),
          figure: rightFigure(
            rng,
            s.a,
            s.b,
            { sides: [`${s.a}`, `${s.c}`, `${s.b}`], letters: `${s.R}${s.U}${s.V}` },
            `Right triangle ${s.R}${s.U}${s.V} with the right angle at ${s.R}: ${s.R}${s.U} = ${s.a}, ${s.U}${s.V} = ${s.c}, ${s.V}${s.R} = ${s.b}.`,
            `直角三角形 ${s.R}${s.U}${s.V}，直角在 ${s.R}：${s.R}${s.U} = ${s.a}，${s.U}${s.V} = ${s.c}，${s.V}${s.R} = ${s.b}。`,
          ),
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
  knowledgePoints: [
    {
      id: "ratios-with-a-missing-hypotenuse",
      title: t("A missing hypotenuse", "缺少斜边"),
      explanation: t(
        "If only the legs are known, find the hypotenuse first. With legs $2$ and $4$: $c = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$. For the angle $\\theta$ opposite the leg $2$,\n\n$$\\sin \\theta = \\frac{2}{2\\sqrt{5}} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}.$$\n\nGive exact ratios in simplest radical form, with a rational denominator.",
        "若只知道两条直角边，先求斜边。直角边为 $2$ 和 $4$ 时：$c = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$。与直角边 $2$ 相对的角 $\\theta$ 有\n\n$$\\sin \\theta = \\frac{2}{2\\sqrt{5}} = \\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}.$$\n\n精确的三角比写成最简根式，分母要有理化。",
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
          return {
            ...radicalProblem({
              prompt: t(`Find $\\${f} ${P}$ in simplest radical form.`, `求 $\\${f} ${P}$，答案写成最简根式。`),
              answer,
              wrong: [
                ...exactRatioWrong(int(top), hyp, `${top}`, rawSqrt(n)),
                texS(divS(int(f === "sin" ? adj : opp), hyp)),
                texS(divS(int(top), int(a + b))),
              ],
              solution: t(
                `First the hypotenuse:${steps(`${seg(U, V)} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${n}}${hyp[1] === n ? "" : ` = ${texS(hyp)}`}`)}Then${steps(`\\${f} ${P} = \\frac{${top}}{${texS(hyp)}} = ${texS(answer)}`)}`,
                `先求斜边：${steps(`${seg(U, V)} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${n}}${hyp[1] === n ? "" : ` = ${texS(hyp)}`}`)}于是${steps(`\\${f} ${P} = \\frac{${top}}{${texS(hyp)}} = ${texS(answer)}`)}`,
              ),
            }),
            figure: rightFigure(
              rng,
              a,
              b,
              { sides: [`${a}`, null, `${b}`], letters: `${R}${U}${V}`, ...(atU ? { atU: "" } : { atV: "" }) },
              `Right triangle ${R}${U}${V} with the right angle at ${R}, legs ${R}${U} = ${a} and ${R}${V} = ${b}. Angle ${P} is marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，直角边 ${R}${U} = ${a}，${R}${V} = ${b}。标出了角 ${P}。`,
            ),
          };
        }
      },
    },
    {
      id: "ratios-with-a-missing-leg",
      title: t("A missing leg", "缺少直角边"),
      explanation: t(
        "If the hypotenuse and one leg are known, subtract to find the other leg. With hypotenuse $7$ and leg $3$: the other leg is $\\sqrt{49 - 9} = \\sqrt{40} = 2\\sqrt{10}$. For the angle $\\theta$ opposite the leg $3$,\n\n$$\\tan \\theta = \\frac{3}{2\\sqrt{10}} = \\frac{3\\sqrt{10}}{20}.$$",
        "若已知斜边和一条直角边，用减法求另一条直角边。斜边为 $7$、直角边为 $3$ 时，另一条直角边是 $\\sqrt{49 - 9} = \\sqrt{40} = 2\\sqrt{10}$。与直角边 $3$ 相对的角 $\\theta$ 有\n\n$$\\tan \\theta = \\frac{3}{2\\sqrt{10}} = \\frac{3\\sqrt{10}}{20}.$$",
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
          return {
            ...radicalProblem({
              prompt: t(`Find $\\${f} ${P}$ in simplest radical form.`, `求 $\\${f} ${P}$，答案写成最简根式。`),
              answer,
              wrong: [
                ...exactRatioWrong(sides[ns], sides[ds], raw(ns), raw(ds)),
                texS(ratioS(f, wrongSides)),
                texS(ratioS(f === "tan" ? "sin" : "cos", sides)),
              ],
              solution: t(
                `First the missing leg:${steps(`${seg(R, V)} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${n}}${leg[1] === n ? "" : ` = ${texS(leg)}`}`)}Then${steps(`\\${f} ${P} = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
                `先求缺少的直角边：${steps(`${seg(R, V)} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${n}}${leg[1] === n ? "" : ` = ${texS(leg)}`}`)}于是${steps(`\\${f} ${P} = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
              ),
            }),
            figure: rightFigure(
              rng,
              a,
              Math.sqrt(n),
              { sides: [`${a}`, `${c}`, null], letters: `${R}${U}${V}`, ...(P === U ? { atU: "" } : { atV: "" }) },
              `Right triangle ${R}${U}${V} with the right angle at ${R}, leg ${R}${U} = ${a} and hypotenuse ${U}${V} = ${c}. Angle ${P} is marked.`,
              `直角三角形 ${R}${U}${V}，直角在 ${R}，直角边 ${R}${U} = ${a}，斜边 ${U}${V} = ${c}。标出了角 ${P}。`,
            ),
          };
        }
      },
    },
    {
      id: "one-ratio-from-another",
      title: t("One ratio from another", "由一个三角比求另一个"),
      explanation: t(
        "Knowing one ratio is enough to find the others: draw a right triangle with those two sides and find the third. If $\\theta$ is acute and $\\sin \\theta = \\frac{2}{3}$, take opposite side $2$ and hypotenuse $3$; the adjacent side is $\\sqrt{9 - 4} = \\sqrt{5}$. So\n\n$$\\cos \\theta = \\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}.$$",
        "知道一个三角比就足以求出其他三角比：画一个以这两条边为边的直角三角形，求出第三条边。若 $\\theta$ 是锐角且 $\\sin \\theta = \\frac{2}{3}$，取对边为 $2$，斜边为 $3$；邻边是 $\\sqrt{9 - 4} = \\sqrt{5}$。所以\n\n$$\\cos \\theta = \\frac{\\sqrt{5}}{3}, \\qquad \\tan \\theta = \\frac{2}{\\sqrt{5}} = \\frac{2\\sqrt{5}}{5}.$$",
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
        return radicalProblem({
          prompt: t(
            `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${a}}{${b}}$. Find $\\${f} \\theta$ in simplest radical form.`,
            `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${a}}{${b}}$。求 $\\${f} \\theta$，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(divS(sides[ds], sides[ns])), `\\frac{${b}}{${a}}`, `\\frac{${a}}{${b}}`],
          solution: t(
            `Take a right triangle with ${sideNames[fnSides[given][0]].en} $${a}$ and ${sideNames[fnSides[given][1]].en} $${b}$. Then ${sideNames[third].en} is${steps(thirdTex)}So${steps(`\\${f} \\theta = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
            `取一个直角三角形，${sideNames[fnSides[given][0]]["zh-CN"]}为 $${a}$，${sideNames[fnSides[given][1]]["zh-CN"]}为 $${b}$。于是${sideNames[third]["zh-CN"]}是${steps(thirdTex)}所以${steps(`\\${f} \\theta = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
          ),
        });
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

/** angleTriangle draws a right triangle with the acute angle theta at U and side labels. */
function angleTriangle(rng: Rng, theta: number, labels: Partial<Record<Side, string>>, atU: string, en: string, zh: string): Figure {
  return rightFigure(rng, Math.cos(rad(theta)), Math.sin(rad(theta)), { sides: angleFigureLabels(labels), atU }, en, zh);
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
      ? `x = \\frac{${n}}{\\${c.fn} ${th}^\\circ} \\approx ${dec(answer)}`
      : `x = ${n} \\${c.fn} ${th}^\\circ \\approx ${dec(answer)}`;
    const work = chain(ratioTex(c.fn, `${th}^\\circ`, labels), solve);
    return {
      ...numberProblem({
        prompt: t("Find $x$. Round your answer to the nearest tenth.", "求 $x$，结果精确到十分位。"),
        answer,
        form: "decimal",
        wrong,
        solution: t(
          `Seen from the $${th}^\\circ$ angle, $x$ is ${sideNames[c.ask].en} and $${n}$ is ${sideNames[c.known].en}, so use the ${fnNames[c.fn].en}:${work}`,
          `从 $${th}^\\circ$ 角看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${n}$ 是${sideNames[c.known]["zh-CN"]}，所以用${fnNames[c.fn]["zh-CN"]}：${work}`,
        ),
      }),
      figure: angleTriangle(
        rng,
        th,
        labels,
        `${th}°`,
        `A right triangle with a ${th}° angle; ${sideNames[c.known].en} is ${n} and ${sideNames[c.ask].en} is x.`,
        `一个直角三角形，有一个 ${th}° 的角；${sideNames[c.known]["zh-CN"]}为 ${n}，${sideNames[c.ask]["zh-CN"]}为 x。`,
      ),
    };
  }
}

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
  knowledgePoints: [
    {
      id: "the-unknown-in-the-numerator",
      title: t("The unknown on top", "未知边在分子"),
      explanation: t(
        "A calculator gives the ratios of any angle (in degree mode): $\\sin 35^\\circ \\approx 0.5736$. To find a side, pick the ratio that links the side you know with the side you want, write the equation, and solve.\n\nIn a right triangle with hypotenuse $12$ and an angle of $35^\\circ$, the side $x$ opposite that angle satisfies\n\n$$\\sin 35^\\circ = \\frac{x}{12}, \\qquad x = 12 \\sin 35^\\circ \\approx 6.9.$$\n\nRound only at the end, not the ratio on the way.",
        "计算器（角度制）可以给出任意角的三角比：$\\sin 35^\\circ \\approx 0.5736$。求边时，选择把已知边和所求边联系起来的那个三角比，列方程再求解。\n\n在斜边为 $12$、有一个 $35^\\circ$ 角的直角三角形中，这个角的对边 $x$ 满足\n\n$$\\sin 35^\\circ = \\frac{x}{12}, \\qquad x = 12 \\sin 35^\\circ \\approx 6.9.$$\n\n只在最后一步取近似值，中间的三角比不要先取近似值。",
      ),
      generate: (rng) => sideProblem(rng, multiplyCases),
    },
    {
      id: "the-unknown-in-the-denominator",
      title: t("The unknown underneath", "未知边在分母"),
      explanation: t(
        "When the unknown side is the denominator of the ratio, multiply both sides by $x$ and divide by the ratio. With an angle of $25^\\circ$ whose opposite side is $8$, the hypotenuse $x$ satisfies\n\n$$\\sin 25^\\circ = \\frac{8}{x}, \\qquad x = \\frac{8}{\\sin 25^\\circ} \\approx 18.9.$$\n\nA quick check: the hypotenuse must be the longest side.",
        "当未知边是三角比的分母时，两边同乘 $x$，再除以三角比。一个 $25^\\circ$ 角的对边是 $8$，斜边 $x$ 满足\n\n$$\\sin 25^\\circ = \\frac{8}{x}, \\qquad x = \\frac{8}{\\sin 25^\\circ} \\approx 18.9.$$\n\n检查：斜边一定是最长的边。",
      ),
      generate: (rng) => sideProblem(rng, divideCases),
    },
    {
      id: "choosing-the-ratio",
      title: t("Choosing the ratio", "选择三角比"),
      explanation: t(
        "Label the two sides involved, as seen from the known angle, then choose:\n\n- opposite and hypotenuse: sine;\n- adjacent and hypotenuse: cosine;\n- opposite and adjacent: tangent.\n\nWith an angle of $32^\\circ$, adjacent side $x$ and opposite side $9$: $\\tan 32^\\circ = \\frac{9}{x}$, so $x = \\frac{9}{\\tan 32^\\circ} \\approx 14.4$.",
        "从已知角看，标出涉及的两条边，再选择：\n\n- 对边和斜边：正弦；\n- 邻边和斜边：余弦；\n- 对边和邻边：正切。\n\n一个 $32^\\circ$ 的角，邻边为 $x$，对边为 $9$：$\\tan 32^\\circ = \\frac{9}{x}$，所以 $x = \\frac{9}{\\tan 32^\\circ} \\approx 14.4$。",
      ),
      generate: (rng) => sideProblem(rng, [...multiplyCases, ...divideCases]),
    },
  ],
};

/** inverseName writes an inverse ratio in LaTeX: "\sin^{-1}". */
const inverseTex = (f: Fn) => `\\${f}^{-1}`;

/** angleAnswer rounds an angle in degrees to the nearest tenth, or undefined when it is too close to a rounding boundary. */
const angleAnswer = (d: number) => rounded(d, d);

export const calculatingAnglesInRightTrianglesUsingTrigonometry: TopicDef = {
  id: "calculating-angles-in-right-triangles-using-trigonometry",
  title: t("Calculating Angles in Right Triangles Using Trigonometry", "用三角比求直角三角形的角"),
  summary: t(
    "Use the inverse sine, cosine and tangent to find an acute angle of a right triangle from two of its sides.",
    "用反正弦、反余弦和反正切，由直角三角形的两条边求锐角。",
  ),
  prerequisites: ["calculating-side-lengths-of-right-triangles-using-trigonometry"],
  encompasses: [
    { topic: "the-trigonometric-ratios", weight: 0.4 },
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.8"],
  knowledgePoints: [
    {
      id: "inverse-trigonometric-ratios",
      title: t("Inverse ratios", "反三角比"),
      explanation: t(
        "The **inverse** ratios undo the ratios: if $\\sin \\theta = 0.42$, then $\\theta = \\sin^{-1} 0.42 \\approx 24.8^\\circ$. On a calculator in degree mode, use the keys $\\sin^{-1}$, $\\cos^{-1}$ and $\\tan^{-1}$.\n\nCheck the mode: in radian mode the calculator gives $\\sin^{-1} 0.42 \\approx 0.43$, which is not in degrees.",
        "**反**三角比把三角比还原成角：若 $\\sin \\theta = 0.42$，则 $\\theta = \\sin^{-1} 0.42 \\approx 24.8^\\circ$。计算器在角度制下用 $\\sin^{-1}$、$\\cos^{-1}$、$\\tan^{-1}$ 键。\n\n注意模式：在弧度制下计算器给出 $\\sin^{-1} 0.42 \\approx 0.43$，这不是度数。",
      ),
      generate(rng) {
        for (;;) {
          const f = rng.pick(["sin", "cos", "tan"] as const);
          const k = f === "tan" ? rng.int(10, 400) : rng.int(5, 98);
          const v = k / 100;
          const r = f === "sin" ? Math.asin(v) : f === "cos" ? Math.acos(v) : Math.atan(v);
          const answer = angleAnswer(toDeg(r));
          if (!answer || k % 10 === 0) continue;
          const vTex = dec(q(k, 100));
          return numberProblem({
            prompt: t(
              `Find the acute angle $\\theta$ with $\\${f} \\theta = ${vTex}$. Round to the nearest tenth of a degree.`,
              `求满足 $\\${f} \\theta = ${vTex}$ 的锐角 $\\theta$，结果精确到 $0.1^\\circ$。`,
            ),
            answer,
            form: "decimal",
            unit: "°",
            wrong: [roundQ(90 - toDeg(r)), roundQ(r)],
            solution: t(
              `Use the inverse ${fnNames[f].en}, in degree mode:${steps(`\\theta = ${inverseTex(f)} ${vTex} \\approx ${dec(answer)}^\\circ`)}`,
              `用反${fnNames[f]["zh-CN"]}，在角度制下计算：${steps(`\\theta = ${inverseTex(f)} ${vTex} \\approx ${dec(answer)}^\\circ`)}`,
            ),
          });
        }
      },
    },
    {
      id: "an-angle-from-the-two-legs",
      title: t("An angle from the two legs", "由两条直角边求角"),
      explanation: t(
        "When the two legs are known, they are the opposite and adjacent sides of each acute angle, so use the tangent. With opposite side $5$ and adjacent side $8$:\n\n$$\\tan \\theta = \\frac{5}{8}, \\qquad \\theta = \\tan^{-1} \\frac{5}{8} \\approx 32.0^\\circ.$$\n\nThe other acute angle is then $90^\\circ - 32.0^\\circ = 58.0^\\circ$.",
        "已知两条直角边时，它们是每个锐角的对边和邻边，所以用正切。对边为 $5$、邻边为 $8$ 时：\n\n$$\\tan \\theta = \\frac{5}{8}, \\qquad \\theta = \\tan^{-1} \\frac{5}{8} \\approx 32.0^\\circ.$$\n\n另一个锐角就是 $90^\\circ - 32.0^\\circ = 58.0^\\circ$。",
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
          return {
            ...numberProblem({
              prompt: t("Find $\\theta$. Round to the nearest tenth of a degree.", "求 $\\theta$，结果精确到 $0.1^\\circ$。"),
              answer,
              form: "decimal",
              unit: "°",
              wrong: [roundQ(90 - toDeg(r)), roundQ(r)],
              solution: t(
                `The legs are the opposite side $${b}$ and the adjacent side $${a}$ of $\\theta$, so use the tangent:${chain(`\\tan \\theta = \\frac{${b}}{${a}}`, `\\theta = \\tan^{-1} \\frac{${b}}{${a}} \\approx ${dec(answer)}^\\circ`)}`,
                `两条直角边分别是 $\\theta$ 的对边 $${b}$ 和邻边 $${a}$，所以用正切：${chain(`\\tan \\theta = \\frac{${b}}{${a}}`, `\\theta = \\tan^{-1} \\frac{${b}}{${a}} \\approx ${dec(answer)}^\\circ`)}`,
              ),
            }),
            figure: rightFigure(
              rng,
              a,
              b,
              { sides: [`${a}`, null, `${b}`], atU: "θ" },
              `A right triangle with legs ${a} and ${b}; θ is the angle between the leg ${a} and the hypotenuse.`,
              `一个直角三角形，直角边为 ${a} 和 ${b}；θ 是直角边 ${a} 与斜边的夹角。`,
            ),
          };
        }
      },
    },
    {
      id: "an-angle-from-a-leg-and-the-hypotenuse",
      title: t("An angle from a leg and the hypotenuse", "由直角边和斜边求角"),
      explanation: t(
        "With the hypotenuse and one leg, use the sine if the leg is opposite the angle and the cosine if it is adjacent. With hypotenuse $9$ and adjacent side $4$:\n\n$$\\cos \\theta = \\frac{4}{9}, \\qquad \\theta = \\cos^{-1} \\frac{4}{9} \\approx 63.6^\\circ.$$\n\nWith opposite side $7$ and hypotenuse $12$: $\\theta = \\sin^{-1} \\frac{7}{12} \\approx 35.7^\\circ$.",
        "已知斜边和一条直角边时，若直角边是角的对边就用正弦，是邻边就用余弦。斜边为 $9$、邻边为 $4$ 时：\n\n$$\\cos \\theta = \\frac{4}{9}, \\qquad \\theta = \\cos^{-1} \\frac{4}{9} \\approx 63.6^\\circ.$$\n\n对边为 $7$、斜边为 $12$ 时：$\\theta = \\sin^{-1} \\frac{7}{12} \\approx 35.7^\\circ$。",
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
          return {
            ...numberProblem({
              prompt: t("Find $\\theta$. Round to the nearest tenth of a degree.", "求 $\\theta$，结果精确到 $0.1^\\circ$。"),
              answer,
              form: "decimal",
              unit: "°",
              wrong: [roundQ(90 - th), roundQ(toDeg(Math.atan(l / c))), roundQ(r)],
              solution: t(
                `The leg $${l}$ is ${f === "sin" ? "opposite" : "adjacent to"} $\\theta$ and $${c}$ is the hypotenuse, so use the ${fnNames[f].en}:${chain(`\\${f} \\theta = \\frac{${l}}{${c}}`, `\\theta = ${inverseTex(f)} \\frac{${l}}{${c}} \\approx ${dec(answer)}^\\circ`)}`,
                `直角边 $${l}$ 是 $\\theta$ 的${f === "sin" ? "对边" : "邻边"}，$${c}$ 是斜边，所以用${fnNames[f]["zh-CN"]}：${chain(`\\${f} \\theta = \\frac{${l}}{${c}}`, `\\theta = ${inverseTex(f)} \\frac{${l}}{${c}} \\approx ${dec(answer)}^\\circ`)}`,
              ),
            }),
            figure: angleTriangle(
              rng,
              th,
              f === "sin" ? { opp: `${l}`, hyp: `${c}` } : { adj: `${l}`, hyp: `${c}` },
              "θ",
              `A right triangle with hypotenuse ${c} and a leg ${l} ${f === "sin" ? "opposite" : "adjacent to"} the angle θ.`,
              `一个直角三角形，斜边为 ${c}，角 θ 的${f === "sin" ? "对边" : "邻边"}为 ${l}。`,
            ),
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
  knowledgePoints: [
    {
      id: "angles-of-elevation",
      title: t("Angles of elevation", "仰角"),
      explanation: t(
        "The **angle of elevation** is the angle between the horizontal and the line of sight up to an object. Standing $30$ m from a tree with eyes $1.6$ m above the ground, you see the top at an angle of elevation of $38^\\circ$. The part of the tree above eye level is the opposite side of a right triangle with adjacent side $30$:\n\n$$30 \\tan 38^\\circ \\approx 23.44, \\qquad \\text{height} \\approx 23.44 + 1.6 \\approx 25.0 \\text{ m}.$$\n\nDraw a sketch, and remember the height of the eyes.",
        "**仰角**是水平线与向上看物体的视线之间的夹角。站在离一棵树 $30$ 米处，眼睛离地面 $1.6$ 米，看树顶的仰角是 $38^\\circ$。树高出眼睛的部分是一个直角三角形的对边，邻边是 $30$：\n\n$$30 \\tan 38^\\circ \\approx 23.44, \\qquad \\text{树高} \\approx 23.44 + 1.6 \\approx 25.0 \\text{ 米}.$$\n\n先画草图，别忘了加上眼睛的高度。",
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
          const above = `${d} \\tan ${th}^\\circ \\approx ${dec(roundQ(height, 2))}`;
          const sum = `${dec(roundQ(height, 2))} + ${dec(eye)} \\approx ${dec(answer)}`;
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
          if (e > 0) {
            marks.push(
              { kind: "segment", a: [0, 0], b: [1, 0] },
              { kind: "segment", a: [0, 0], b: O },
              { kind: "segment", a: [1, 0], b: F },
              { kind: "side", a: O, b: [0, 0], text: `${dec(eye)} m` },
            );
          }
          return {
            ...numberProblem({
              prompt,
              answer,
              form: "decimal",
              unit: "m",
              wrong: [roundQ(d * trig("sin", th) + h0), roundQ(d / tn + h0), ...(e > 0 ? [roundQ(height)] : [])],
              solution:
                e === 0
                  ? t(
                      `The height is the side opposite the $${th}^\\circ$ angle, and the distance $${d}$ is the adjacent side:${steps(`h = ${d} \\tan ${th}^\\circ \\approx ${dec(answer)}`)}The ${obj.en} is about $${unitTex(dec(answer))}$ tall.`,
                      `高是 $${th}^\\circ$ 角的对边，距离 $${d}$ 是邻边：${steps(`h = ${d} \\tan ${th}^\\circ \\approx ${dec(answer)}`)}${obj.zh}高约 $${dec(answer)}$ 米。`,
                    )
                  : t(
                      `The part above eye level is the side opposite the $${th}^\\circ$ angle, with adjacent side $${d}$:${steps(above)}Add the height of the eyes:${steps(sum)}The ${obj.en} is about $${unitTex(dec(answer))}$ tall.`,
                      `高出眼睛的部分是 $${th}^\\circ$ 角的对边，邻边是 $${d}$：${steps(above)}再加上眼睛的高度：${steps(sum)}${obj.zh}高约 $${dec(answer)}$ 米。`,
                    ),
            }),
            figure: figure(
              marks,
              `A right triangle from the observer's eye to the top of the ${obj.en}: horizontal distance ${d} m, angle of elevation ${th}°${e > 0 ? `, eyes ${dec(eye)} m above the ground` : ""}.`,
              `从观察者眼睛到${obj.zh}顶的直角三角形：水平距离 ${d} 米，仰角 ${th}°${e > 0 ? `，眼睛离地面 ${dec(eye)} 米` : ""}。`,
            ),
          };
        }
      },
    },
    {
      id: "angles-of-depression",
      title: t("Angles of depression", "俯角"),
      explanation: t(
        "The **angle of depression** is the angle between the horizontal and the line of sight **down** to an object. The horizontal at the top is parallel to the ground, so the angle of depression equals the angle of elevation from the object back up (alternate interior angles).\n\nFrom the top of a $45$ m cliff, a boat is seen at an angle of depression of $22^\\circ$. At the boat, the angle of elevation is $22^\\circ$, the cliff is the opposite side and the distance $d$ to the boat is adjacent:\n\n$$\\tan 22^\\circ = \\frac{45}{d}, \\qquad d = \\frac{45}{\\tan 22^\\circ} \\approx 111.4 \\text{ m}.$$",
        "**俯角**是水平线与**向下**看物体的视线之间的夹角。顶端的水平线与地面平行，所以俯角等于从物体向上看的仰角（内错角相等）。\n\n从 $45$ 米高的悬崖顶看一条小船，俯角是 $22^\\circ$。在小船处仰角是 $22^\\circ$，悬崖是对边，到小船的距离 $d$ 是邻边：\n\n$$\\tan 22^\\circ = \\frac{45}{d}, \\qquad d = \\frac{45}{\\tan 22^\\circ} \\approx 111.4 \\text{ 米}.$$",
      ),
      generate(rng) {
        for (;;) {
          const h = rng.int(15, 120);
          const th = rng.int(20, 60);
          const sight = rng.bool(0.3);
          const f = trig(sight ? "sin" : "tan", th);
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
          const work = sight
            ? chain(`\\sin ${th}^\\circ = \\frac{${h}}{s}`, `s = \\frac{${h}}{\\sin ${th}^\\circ} \\approx ${dec(answer)}`)
            : chain(`\\tan ${th}^\\circ = \\frac{${h}}{d}`, `d = \\frac{${h}}{\\tan ${th}^\\circ} \\approx ${dec(answer)}`);
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
              solution: t(
                `The angle of elevation from the boat is also $${th}^\\circ$, and the height $${h}$ is opposite it. ${sight ? "The line of sight is the hypotenuse" : "The distance along the water is the adjacent side"}:${work}`,
                `从小船看的仰角也是 $${th}^\\circ$，高 $${h}$ 是它的对边。${sight ? "视线是斜边" : "水面上的距离是邻边"}：${work}`,
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
          };
        }
      },
    },
    {
      id: "angles-in-context",
      title: t("Finding angles in context", "实际问题中的角"),
      explanation: t(
        "To find an angle, identify two sides of a right triangle and use an inverse ratio. A $6$ m ladder leans against a wall with its foot $2$ m from the wall. The ground is the side adjacent to the angle the ladder makes with the ground, and the ladder is the hypotenuse:\n\n$$\\theta = \\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ.$$\n\nA ramp that rises $1$ m over a horizontal distance of $12$ m makes an angle of $\\tan^{-1} \\frac{1}{12} \\approx 4.8^\\circ$ with the ground.",
        "求角时，先找出直角三角形的两条边，再用反三角比。一架 $6$ 米长的梯子靠在墙上，梯脚离墙 $2$ 米。地面是梯子与地面所成角的邻边，梯子是斜边：\n\n$$\\theta = \\cos^{-1} \\frac{2}{6} \\approx 70.5^\\circ.$$\n\n一个坡道在水平距离 $12$ 米内升高 $1$ 米，它与地面所成的角是 $\\tan^{-1} \\frac{1}{12} \\approx 4.8^\\circ$。",
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
                    `The ladder is the hypotenuse and the distance $${x}$ along the ground is adjacent to the angle:`,
                    `梯子是斜边，地面上的距离 $${x}$ 是这个角的邻边：`,
                  )
                : t(
                    `The ladder is the hypotenuse and the height $${x}$ on the wall is opposite the angle:`,
                    `梯子是斜边，墙上的高度 $${x}$ 是这个角的对边：`,
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
              `The rise $${rise}$ is opposite the angle and the run $${run}$ is adjacent:`,
              `升高的 $${rise}$ 是这个角的对边，水平距离 $${run}$ 是邻边：`,
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
              `The string is the hypotenuse and the height $${h}$ is opposite the angle:`,
              `风筝线是斜边，高度 $${h}$ 是这个角的对边：`,
            );
          }
          const v = a / b;
          const r = f === "sin" ? Math.asin(v) : f === "cos" ? Math.acos(v) : Math.atan(v);
          const answer = angleAnswer(toDeg(r));
          if (!answer || toDeg(r) < 2 || toDeg(r) > 88) continue;
          const others = (["sin", "cos", "tan"] as const).filter((g) => g !== f && (g === "tan" || v < 1));
          return numberProblem({
            prompt,
            answer,
            form: "decimal",
            unit: "°",
            wrong: [
              roundQ(90 - toDeg(r)),
              ...others.map((g) => roundQ(toDeg(g === "sin" ? Math.asin(v) : g === "cos" ? Math.acos(v) : Math.atan(v)))),
            ],
            solution: t(
              `${setup.en}${steps(`\\theta = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(answer)}^\\circ`)}`,
              `${setup["zh-CN"]}${steps(`\\theta = ${inverseTex(f)} \\frac{${a}}{${b}} \\approx ${dec(answer)}^\\circ`)}`,
            ),
          });
        }
      },
    },
  ],
};

const fns6 = ["sin", "cos", "tan", "csc", "sec", "cot"] as const;

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
  knowledgePoints: [
    {
      id: "reciprocal-ratios-from-sides",
      title: t("Reciprocal ratios from the sides", "由边求倒数三角比"),
      explanation: t(
        "The **reciprocal ratios** turn the three ratios upside down:\n\n$$\\csc \\theta = \\frac{1}{\\sin \\theta} = \\frac{\\text{hypotenuse}}{\\text{opposite}}, \\qquad \\sec \\theta = \\frac{1}{\\cos \\theta} = \\frac{\\text{hypotenuse}}{\\text{adjacent}}, \\qquad \\cot \\theta = \\frac{1}{\\tan \\theta} = \\frac{\\text{adjacent}}{\\text{opposite}}.$$\n\nThey are the **cosecant**, **secant** and **cotangent**. Note the pairing: the secant goes with the cosine and the cosecant with the sine. For the angle opposite $5$ in the $5$-$12$-$13$ triangle: $\\csc \\theta = \\frac{13}{5}$, $\\sec \\theta = \\frac{13}{12}$, $\\cot \\theta = \\frac{12}{5}$.",
        "**倒数三角比**把三个三角比倒过来：\n\n$$\\csc \\theta = \\frac{1}{\\sin \\theta} = \\frac{\\text{斜边}}{\\text{对边}}, \\qquad \\sec \\theta = \\frac{1}{\\cos \\theta} = \\frac{\\text{斜边}}{\\text{邻边}}, \\qquad \\cot \\theta = \\frac{1}{\\tan \\theta} = \\frac{\\text{邻边}}{\\text{对边}}.$$\n\n它们分别是**余割**、**正割**和**余切**。注意配对：正割对应余弦，余割对应正弦。在 $5$-$12$-$13$ 三角形中，与 $5$ 相对的角有 $\\csc \\theta = \\frac{13}{5}$，$\\sec \\theta = \\frac{13}{12}$，$\\cot \\theta = \\frac{12}{5}$。",
      ),
      generate: (rng) => wholeRatioProblem(rng, rng.pick(["csc", "sec", "cot"] as const)),
    },
    {
      id: "the-reciprocal-of-a-ratio",
      title: t("The reciprocal of a given ratio", "已知三角比的倒数"),
      explanation: t(
        "A ratio and its reciprocal multiply to $1$. If $\\cos \\theta = \\frac{3}{7}$, then $\\sec \\theta = \\frac{7}{3}$; if $\\cot \\theta = \\frac{5}{2}$, then $\\tan \\theta = \\frac{2}{5}$. The reciprocal of a decimal works the same way: $\\sin \\theta = 0.8 = \\frac{4}{5}$ gives $\\csc \\theta = \\frac{5}{4}$.",
        "一个三角比与它的倒数之积是 $1$。若 $\\cos \\theta = \\frac{3}{7}$，则 $\\sec \\theta = \\frac{7}{3}$；若 $\\cot \\theta = \\frac{5}{2}$，则 $\\tan \\theta = \\frac{2}{5}$。小数也一样：$\\sin \\theta = 0.8 = \\frac{4}{5}$，所以 $\\csc \\theta = \\frac{5}{4}$。",
      ),
      generate(rng) {
        const given = rng.pick(fns6);
        const base: Fn = given === "csc" ? "sin" : given === "sec" ? "cos" : given === "cot" ? "tan" : given;
        const [a, b] = pickRatio(rng, base);
        const [n, d] = given === base ? [a, b] : [b, a];
        const ask = reciprocalOf[given];
        const answer = q(d, n);
        return numberProblem({
          prompt: t(
            `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${n}}{${d}}$. Find $\\${ask} \\theta$.`,
            `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${n}}{${d}}$。求 $\\${ask} \\theta$。`,
          ),
          answer,
          form: "fraction",
          wrong: [q(n, d), q(d - n, d), q(-d, n)],
          solution: t(
            `$\\${ask}$ is the reciprocal of $\\${given}$:${steps(`\\${ask} \\theta = \\frac{1}{\\${given} \\theta} = ${answer.toLatex()}`)}`,
            `$\\${ask}$ 是 $\\${given}$ 的倒数：${steps(`\\${ask} \\theta = \\frac{1}{\\${given} \\theta} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "reciprocal-ratios-using-the-pythagorean-theorem",
      title: t("Reciprocal ratios with the Pythagorean theorem", "用勾股定理求倒数三角比"),
      explanation: t(
        "If the given ratio uses different sides, find the third side first. If $\\sin \\theta = \\frac{2}{5}$, take opposite $2$ and hypotenuse $5$; the adjacent side is $\\sqrt{25 - 4} = \\sqrt{21}$. Then\n\n$$\\sec \\theta = \\frac{5}{\\sqrt{21}} = \\frac{5\\sqrt{21}}{21}, \\qquad \\cot \\theta = \\frac{\\sqrt{21}}{2}.$$",
        "若已知的三角比用的是另外两条边，先求出第三条边。若 $\\sin \\theta = \\frac{2}{5}$，取对边 $2$、斜边 $5$，邻边是 $\\sqrt{25 - 4} = \\sqrt{21}$。于是\n\n$$\\sec \\theta = \\frac{5}{\\sqrt{21}} = \\frac{5\\sqrt{21}}{21}, \\qquad \\cot \\theta = \\frac{\\sqrt{21}}{2}.$$",
      ),
      generate(rng) {
        const given = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, given);
        const sides = sidesFrom(given, a, b);
        const ask = rng.pick((["csc", "sec", "cot"] as const).filter((g) => reciprocalOf[g] !== given));
        const answer = ratioS(ask, sides);
        const [ns, ds] = fnSides[ask];
        const third = (["opp", "adj", "hyp"] as const).find((s) => !fnSides[given].includes(s))!;
        const thirdTex =
          given === "tan" ? `\\sqrt{${a}^2 + ${b}^2} = ${texS(sides[third])}` : `\\sqrt{${b}^2 - ${a}^2} = ${texS(sides[third])}`;
        return radicalProblem({
          prompt: t(
            `$\\theta$ is an acute angle with $\\${given} \\theta = \\frac{${a}}{${b}}$. Find $\\${ask} \\theta$ in simplest radical form.`,
            `$\\theta$ 是锐角，$\\${given} \\theta = \\frac{${a}}{${b}}$。求 $\\${ask} \\theta$，答案写成最简根式。`,
          ),
          answer,
          wrong: [texS(ratioS(reciprocalOf[ask], sides)), `\\frac{${b}}{${a}}`, texS(ratioS(cofunction[ask], sides))],
          solution: t(
            `Take ${sideNames[fnSides[given][0]].en} $${a}$ and ${sideNames[fnSides[given][1]].en} $${b}$. Then ${sideNames[third].en} is${steps(thirdTex)}So${steps(`\\${ask} \\theta = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
            `取${sideNames[fnSides[given][0]]["zh-CN"]}为 $${a}$，${sideNames[fnSides[given][1]]["zh-CN"]}为 $${b}$。于是${sideNames[third]["zh-CN"]}是${steps(thirdTex)}所以${steps(`\\${ask} \\theta = \\frac{${texS(sides[ns])}}{${texS(sides[ds])}} = ${texS(answer)}`)}`,
          ),
        });
      },
    },
  ],
};

/** twoTriangles draws right triangle RUV and a similar copy scaled by k beside it, with letters and the angles at U and its image marked. */
function twoTriangles(
  a: number,
  b: number,
  k: number,
  letters: readonly [string, string],
  small: readonly [string | null, string | null, string | null],
  big: readonly [string | null, string | null, string | null],
): Mark[] {
  const s1 = 4 / Math.max(a, b);
  const s2 = s1 * Math.min(k, 1.8);
  const x0 = a * s1 + 2.5;
  const t1: Tri = [
    [0, 0],
    [a * s1, 0],
    [0, b * s1],
  ];
  const t2: Tri = [
    [x0, 0],
    [x0 + a * s2, 0],
    [x0, b * s2],
  ];
  return [
    ...rightMarks(t1, { sides: small, atU: "", letters: letters[0] }),
    ...rightMarks(t2, { sides: big, atU: "", letters: letters[1] }),
  ];
}

export const trigonometricRatiosInSimilarRightTriangles: TopicDef = {
  id: "trigonometric-ratios-in-similar-right-triangles",
  title: t("Trigonometric Ratios in Similar Right Triangles", "相似直角三角形中的三角比"),
  summary: t(
    "Understand that the ratios of an angle do not depend on the size of the triangle, and use them to find sides of similar triangles.",
    "理解三角比与三角形的大小无关，并用它求相似三角形的边。",
  ),
  prerequisites: ["the-trigonometric-ratios", "the-aa-similarity-criterion"],
  encompasses: [
    { topic: "the-trigonometric-ratios", weight: 0.3 },
    { topic: "side-lengths-and-angle-measures-of-similar-polygons", weight: 0.3 },
    { topic: "the-aa-similarity-criterion", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.SRT.C.6"],
  knowledgePoints: [
    {
      id: "equal-angles-have-equal-ratios",
      title: t("Equal angles, equal ratios", "角相等，三角比相等"),
      explanation: t(
        "Two right triangles with an equal acute angle are similar (AA), so their sides are proportional and every ratio of two sides is the same in both. That is why $\\sin$, $\\cos$ and $\\tan$ depend only on the angle.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with right angles at $C$ and $F$, and $AC = 8$, $BC = 6$, $AB = 10$, then\n\n$$\\tan D = \\tan A = \\frac{6}{8} = \\frac{3}{4},$$\n\nhowever large $\\triangle DEF$ is.",
        "有一个锐角相等的两个直角三角形相似（AA），所以对应边成比例，任意两边之比在两个三角形中都相同。正因如此，$\\sin$、$\\cos$、$\\tan$ 只取决于角。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$，且 $AC = 8$，$BC = 6$，$AB = 10$，则\n\n$$\\tan D = \\tan A = \\frac{6}{8} = \\frac{3}{4},$$\n\n无论 $\\triangle DEF$ 有多大。",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 30);
        const k = rng.int(2, 5);
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const atD = rng.bool();
        // a = AC (adjacent to A), b = BC (opposite A), c = AB.
        const [opp, adj] = atD ? [b, a] : [a, b];
        const vals = { opp, adj, hyp: c };
        const answer = q(vals[fnSides[f][0]], vals[fnSides[f][1]]);
        const P = atD ? "D" : "E";
        const P0 = atD ? "A" : "B";
        return {
          ...numberProblem({
            prompt: t(
              `$\\triangle ABC \\sim \\triangle DEF$, with right angles at $C$ and $F$. Find $\\${f} ${P}$ as a fraction in lowest terms.`,
              `$\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$。求 $\\${f} ${P}$，答案写成最简分数。`,
            ),
            answer,
            form: "fraction",
            wrong: [q(vals[fnSides[f][1]], vals[fnSides[f][0]]), q(k * vals[fnSides[f][0]], vals[fnSides[f][1]]), q(adj, c), q(opp, c)],
            solution: t(
              `$\\angle ${P} = \\angle ${P0}$, so $\\${f} ${P} = \\${f} ${P0}$. In $\\triangle ABC$:${steps(`\\${f} ${P0} = \\frac{${vals[fnSides[f][0]]}}{${vals[fnSides[f][1]]}} = ${answer.toLatex()}`)}`,
              `$\\angle ${P} = \\angle ${P0}$，所以 $\\${f} ${P} = \\${f} ${P0}$。在 $\\triangle ABC$ 中：${steps(`\\${f} ${P0} = \\frac{${vals[fnSides[f][0]]}}{${vals[fnSides[f][1]]}} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: figure(
            twoTriangles(a, b, k, ["CAB", "FDE"], [`${a}`, `${c}`, `${b}`], [null, `${k * c}`, null]),
            `Right triangles ABC and DEF, right angles at C and F. AC = ${a}, BC = ${b}, AB = ${c}; DE = ${k * c}.`,
            `直角三角形 ABC 与 DEF，直角在 C 和 F。AC = ${a}，BC = ${b}，AB = ${c}；DE = ${k * c}。`,
          ),
        };
      },
    },
    {
      id: "sides-from-a-similar-triangle",
      title: t("Sides from a similar triangle", "由相似三角形求边"),
      explanation: t(
        "A ratio found in one triangle can be used in any similar triangle. If $\\triangle ABC$ has $AC = 8$, $BC = 6$, $AB = 10$, then $\\sin A = \\frac{3}{5}$. In a similar triangle $DEF$ with $\\angle D = \\angle A$ and hypotenuse $DE = 25$:\n\n$$EF = DE \\cdot \\sin D = 25 \\cdot \\frac{3}{5} = 15.$$",
        "在一个三角形中求出的三角比，可以用于任何与它相似的三角形。若 $\\triangle ABC$ 中 $AC = 8$，$BC = 6$，$AB = 10$，则 $\\sin A = \\frac{3}{5}$。在相似三角形 $DEF$ 中，$\\angle D = \\angle A$，斜边 $DE = 25$：\n\n$$EF = DE \\cdot \\sin D = 25 \\cdot \\frac{3}{5} = 15.$$",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 30);
        const sides = { adj: a, opp: b, hyp: c };
        const names3 = { adj: "DF", opp: "EF", hyp: "DE" };
        const [known, ask] = rng.sample(["adj", "opp", "hyp"] as const, 2) as [Side, Side];
        const n0 = rng.int(3, 39);
        const n = n0 >= sides[known] ? n0 + 1 : n0;
        const answer = q(n * sides[ask], sides[known]);
        const f = (Object.keys(fnSides) as Fn6[]).find((g) => fnSides[g][0] === ask && fnSides[g][1] === known)!;
        const labels = (s: Side) => (s === known ? `${n}` : s === ask ? "x" : null);
        return {
          ...numberProblem({
            prompt: t(
              `$\\triangle ABC \\sim \\triangle DEF$, with right angles at $C$ and $F$. Find $x = ${names3[ask]}$.`,
              `$\\triangle ABC \\sim \\triangle DEF$，直角在 $C$ 和 $F$。求 $x = ${names3[ask]}$。`,
            ),
            answer,
            wrong: [q(n * sides[known], sides[ask]), n * sides[ask], q(n, sides[known])],
            solution: t(
              `$\\angle D = \\angle A$, so $\\${f} D = \\${f} A = \\frac{${sides[ask]}}{${sides[known]}}$. In $\\triangle DEF$:${chain(`\\frac{x}{${n}} = \\frac{${sides[ask]}}{${sides[known]}}`, `x = ${n} \\cdot \\frac{${sides[ask]}}{${sides[known]}} = ${answer.toLatex()}`)}`,
              `$\\angle D = \\angle A$，所以 $\\${f} D = \\${f} A = \\frac{${sides[ask]}}{${sides[known]}}$。在 $\\triangle DEF$ 中：${chain(`\\frac{x}{${n}} = \\frac{${sides[ask]}}{${sides[known]}}`, `x = ${n} \\cdot \\frac{${sides[ask]}}{${sides[known]}} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: figure(
            twoTriangles(a, b, n / sides[known], ["CAB", "FDE"], [`${a}`, `${c}`, `${b}`], [labels("adj"), labels("hyp"), labels("opp")]),
            `Right triangles ABC and DEF, right angles at C and F. AC = ${a}, BC = ${b}, AB = ${c}; ${names3[known]} = ${n} and ${names3[ask]} = x.`,
            `直角三角形 ABC 与 DEF，直角在 C 和 F。AC = ${a}，BC = ${b}，AB = ${c}；${names3[known]} = ${n}，${names3[ask]} = x。`,
          ),
        };
      },
    },
    {
      id: "scaling-a-right-triangle",
      title: t("Scaling a right triangle", "放缩直角三角形"),
      explanation: t(
        "Multiplying every side of a triangle by $k$ multiplies the numerator and the denominator of each ratio by $k$, so the ratios do not change. If $\\cos A = \\frac{5}{13}$ in $\\triangle ABC$ and each side is tripled to make $\\triangle DEF$ with $D$ corresponding to $A$, then $\\cos D = \\frac{15}{39} = \\frac{5}{13}$ as well.",
        "把三角形的每条边都乘以 $k$，每个三角比的分子和分母都乘以 $k$，所以三角比不变。若 $\\triangle ABC$ 中 $\\cos A = \\frac{5}{13}$，把每条边都扩大为原来的 $3$ 倍得到 $\\triangle DEF$，$D$ 对应 $A$，则同样有 $\\cos D = \\frac{15}{39} = \\frac{5}{13}$。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, f, 15);
        const grow = rng.bool();
        const k = rng.int(2, 9);
        const answer = q(a, b);
        return numberProblem({
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
          solution: t(
            `Scaling every side by the same factor does not change the angles, so $\\angle D = \\angle A$ and${steps(`\\${f} D = \\${f} A = ${answer.toLatex()}`)}`,
            `每条边按同一比例放缩，角不变，所以 $\\angle D = \\angle A$，且${steps(`\\${f} D = \\${f} A = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

export const trigonometricFunctionsOfComplementaryAngles: TopicDef = {
  id: "trigonometric-functions-of-complementary-angles",
  title: t("Trigonometric Functions of Complementary Angles", "互余角的三角函数"),
  summary: t(
    "Use that the sine of an angle equals the cosine of its complement, and that the tangents of complementary angles are reciprocals.",
    "运用一个角的正弦等于它的余角的余弦，以及互余两角的正切互为倒数。",
  ),
  prerequisites: ["the-reciprocal-trigonometric-ratios"],
  encompasses: [
    { topic: "the-trigonometric-ratios", weight: 0.3 },
    { topic: "angles-and-sides-in-right-triangles", weight: 0.3 },
    { topic: "the-reciprocal-trigonometric-ratios", weight: 0.2 },
    { topic: "complementary-and-supplementary-angles", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.C.7"],
  knowledgePoints: [
    {
      id: "cofunction-identities",
      title: t("Sine and cosine of complementary angles", "互余角的正弦与余弦"),
      explanation: t(
        "In right triangle $ABC$ with the right angle at $C$, the acute angles are complementary: $\\angle B = 90^\\circ - \\angle A$. The side opposite $A$ is adjacent to $B$, so\n\n$$\\sin A = \\cos B, \\qquad \\cos A = \\sin B, \\qquad \\tan B = \\frac{1}{\\tan A} = \\cot A.$$\n\nFor any acute angle, $\\sin \\theta = \\cos(90^\\circ - \\theta)$. So $\\sin 28^\\circ = \\cos 62^\\circ$: if $\\sin 28^\\circ = \\cos x^\\circ$ with $x$ acute, then $x = 62$.",
        "在直角三角形 $ABC$ 中，直角在 $C$，两个锐角互余：$\\angle B = 90^\\circ - \\angle A$。$A$ 的对边是 $B$ 的邻边，所以\n\n$$\\sin A = \\cos B, \\qquad \\cos A = \\sin B, \\qquad \\tan B = \\frac{1}{\\tan A} = \\cot A.$$\n\n对任意锐角，$\\sin \\theta = \\cos(90^\\circ - \\theta)$。所以 $\\sin 28^\\circ = \\cos 62^\\circ$：若 $\\sin 28^\\circ = \\cos x^\\circ$ 且 $x$ 是锐角，则 $x = 62$。",
      ),
      generate(rng) {
        const a = rng.int(5, 85);
        const f = rng.pick(["sin", "cos", "tan", "cot"] as const);
        const g = cofunction[f];
        const left = rng.bool();
        const eq = left ? `\\${f} ${a}^\\circ = \\${g} x^\\circ` : `\\${g} x^\\circ = \\${f} ${a}^\\circ`;
        return numberProblem({
          prompt: t(`Find the acute angle $x$ with $${eq}$.`, `求满足 $${eq}$ 的锐角 $x$。`),
          answer: 90 - a,
          form: "integer",
          solveFor: "x",
          wrong: [a, 180 - a, 90 + a],
          solution: t(
            `The ${fnNames[f].en} of an angle equals the ${fnNames[g].en} of its complement:${steps(`\\${f} ${a}^\\circ = \\${g} (90^\\circ - ${a}^\\circ) = \\${g} ${90 - a}^\\circ`)}So $x = ${90 - a}$.`,
            `一个角的${fnNames[f]["zh-CN"]}等于它的余角的${fnNames[g]["zh-CN"]}：${steps(`\\${f} ${a}^\\circ = \\${g} (90^\\circ - ${a}^\\circ) = \\${g} ${90 - a}^\\circ`)}所以 $x = ${90 - a}$。`,
          ),
        });
      },
    },
    {
      id: "ratios-of-the-other-acute-angle",
      title: t("Ratios of the other acute angle", "另一个锐角的三角比"),
      explanation: t(
        "In a right triangle, a ratio of one acute angle gives a ratio of the other. If $\\sin A = \\frac{8}{17}$ in right triangle $ABC$ with the right angle at $C$, then $\\cos B = \\frac{8}{17}$ too. If $\\tan A = \\frac{3}{7}$, then $\\tan B = \\frac{7}{3}$.",
        "在直角三角形中，一个锐角的三角比可以给出另一个锐角的三角比。若直角三角形 $ABC$ 中直角在 $C$，且 $\\sin A = \\frac{8}{17}$，则 $\\cos B = \\frac{8}{17}$。若 $\\tan A = \\frac{3}{7}$，则 $\\tan B = \\frac{7}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const [a, b] = pickRatio(rng, f, 20);
        const g = f === "tan" ? "tan" : cofunction[f];
        const answer = f === "tan" ? q(b, a) : q(a, b);
        const [R, U, V] = pickTriLetters(rng);
        return {
          ...numberProblem({
            prompt: t(
              `In right triangle $${R}${U}${V}$ with the right angle at $${R}$, $\\${f} ${U} = \\frac{${a}}{${b}}$. Find $\\${g} ${V}$.`,
              `在直角三角形 $${R}${U}${V}$ 中，直角在 $${R}$，$\\${f} ${U} = \\frac{${a}}{${b}}$。求 $\\${g} ${V}$。`,
            ),
            answer,
            form: "fraction",
            wrong: f === "tan" ? [q(a, b), q(b - a, b + a)] : [q(b, a), q(b - a, b)],
            solution:
              f === "tan"
                ? t(
                    `The side opposite $${U}$ is adjacent to $${V}$ and the other way round, so $\\tan ${V}$ is the reciprocal of $\\tan ${U}$:${steps(`\\tan ${V} = \\frac{1}{\\tan ${U}} = ${answer.toLatex()}`)}`,
                    `$${U}$ 的对边是 $${V}$ 的邻边，反之亦然，所以 $\\tan ${V}$ 是 $\\tan ${U}$ 的倒数：${steps(`\\tan ${V} = \\frac{1}{\\tan ${U}} = ${answer.toLatex()}`)}`,
                  )
                : t(
                    `$\\angle ${U}$ and $\\angle ${V}$ are complementary, so $\\${g} ${V} = \\${f} ${U}$:${steps(`\\${g} ${V} = ${answer.toLatex()}`)}`,
                    `$\\angle ${U}$ 与 $\\angle ${V}$ 互余，所以 $\\${g} ${V} = \\${f} ${U}$：${steps(`\\${g} ${V} = ${answer.toLatex()}`)}`,
                  ),
          }),
          figure: rightFigure(
            rng,
            rng.int(3, 6),
            rng.int(3, 6),
            { letters: `${R}${U}${V}` },
            `Right triangle ${R}${U}${V} with the right angle at ${R}.`,
            `直角三角形 ${R}${U}${V}，直角在 ${R}。`,
          ),
        };
      },
    },
    {
      id: "equations-with-complementary-angles",
      title: t("Equations with complementary angles", "关于互余角的方程"),
      explanation: t(
        "If $\\sin \\alpha = \\cos \\beta$ for acute angles $\\alpha$ and $\\beta$, then $\\alpha + \\beta = 90^\\circ$. So\n\n$$\\sin(2x + 10)^\\circ = \\cos(3x - 5)^\\circ$$\n\ngives $(2x + 10) + (3x - 5) = 90$, $5x + 5 = 90$, $x = 17$. Check: the angles are $44^\\circ$ and $46^\\circ$, both acute.",
        "若锐角 $\\alpha$、$\\beta$ 满足 $\\sin \\alpha = \\cos \\beta$，则 $\\alpha + \\beta = 90^\\circ$。所以\n\n$$\\sin(2x + 10)^\\circ = \\cos(3x - 5)^\\circ$$\n\n给出 $(2x + 10) + (3x - 5) = 90$，$5x + 5 = 90$，$x = 17$。检验：两角为 $44^\\circ$ 和 $46^\\circ$，都是锐角。",
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
          return numberProblem({
            prompt: t(
              `Both angles are acute and $\\${f}${angleTex(p1, d1)} = \\${g}${angleTex(p2, d2)}$. Find $x$.`,
              `两个角都是锐角，且 $\\${f}${angleTex(p1, d1)} = \\${g}${angleTex(p2, d2)}$。求 $x$。`,
            ),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [intOr(d2 - d1, p1 - p2, x + 1), intOr(180 - d1 - d2, p1 + p2, x - 1)],
            solution: t(
              `The ${fnNames[f].en} of an angle equals the ${fnNames[g].en} of another acute angle when the two angles are complementary:${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}The angles are $${a}^\\circ$ and $${90 - a}^\\circ$.`,
              `当两个锐角互余时，一个角的${fnNames[f]["zh-CN"]}等于另一个角的${fnNames[g]["zh-CN"]}：${chain(`(${linear(p1, d1)}) + (${linear(p2, d2)}) = 90`, `${linear(p1 + p2, d1 + d2)} = 90`, `x = ${x}`)}两角为 $${a}^\\circ$ 和 $${90 - a}^\\circ$。`,
            ),
          });
        }
      },
    },
  ],
};

const specialAngles = [30, 45, 60] as const;

/** specialSwap is the ratio a learner confuses with f: sine with cosine, tangent with cotangent, secant with cosecant. */
const specialSwap = cofunction;

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
    { topic: "isosceles-right-triangles", weight: 0.3 },
    { topic: "the-trigonometric-ratios", weight: 0.3 },
    { topic: "the-reciprocal-trigonometric-ratios", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.6", "CCSS.HSF.TF.A.3"],
  knowledgePoints: [
    {
      id: "exact-values",
      title: t("Exact values", "精确值"),
      explanation: t(
        "Read the ratios off the special right triangles. The $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle has sides $1$, $1$, $\\sqrt{2}$; the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle has sides $1$, $\\sqrt{3}$, $2$, with $1$ opposite $30^\\circ$:\n\n| | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\nThe reciprocal ratios follow: $\\sec 30^\\circ = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$. With a coefficient: $4\\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$.",
        "从特殊直角三角形读出三角比。$45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形三边为 $1$、$1$、$\\sqrt{2}$；$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形三边为 $1$、$\\sqrt{3}$、$2$，其中 $1$ 对着 $30^\\circ$：\n\n| | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ |\n| :--- | :---: | :---: | :---: |\n| $\\sin$ | $\\frac{1}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{\\sqrt{3}}{2}$ |\n| $\\cos$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{\\sqrt{2}}{2}$ | $\\frac{1}{2}$ |\n| $\\tan$ | $\\frac{\\sqrt{3}}{3}$ | $1$ | $\\sqrt{3}$ |\n\n倒数三角比随之可得：$\\sec 30^\\circ = \\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$。带系数时：$4\\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(fns6);
        const a = rng.pick(specialAngles);
        const c = rng.pick([1, 1, 2, 3, 4, 6]);
        const v = specialS(f, a);
        const answer = mulS(int(c), v);
        const coef = c === 1 ? "" : `${c}`;
        const other = (a === 30 ? 60 : a === 60 ? 30 : 30) as 30 | 60;
        return radicalProblem({
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
          solution: t(
            `From the special right triangles, $\\${f} ${a}^\\circ = ${texS(v)}$.${c === 1 ? "" : steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
            `由特殊直角三角形，$\\${f} ${a}^\\circ = ${texS(v)}$。${c === 1 ? "" : steps(`${c} \\cdot ${texS(v)} = ${texS(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "special-angles-from-exact-values",
      title: t("Special angles from exact values", "由精确值求特殊角"),
      explanation: t(
        "Read the table backwards: if $\\tan \\theta = \\sqrt{3}$ and $\\theta$ is acute, then $\\theta = 60^\\circ$. First isolate the ratio: $2\\cos \\theta = \\sqrt{2}$ gives $\\cos \\theta = \\frac{\\sqrt{2}}{2}$, so $\\theta = 45^\\circ$.",
        "把表反过来读：若 $\\tan \\theta = \\sqrt{3}$ 且 $\\theta$ 是锐角，则 $\\theta = 60^\\circ$。先把三角比单独留在一边：由 $2\\cos \\theta = \\sqrt{2}$ 得 $\\cos \\theta = \\frac{\\sqrt{2}}{2}$，所以 $\\theta = 45^\\circ$。",
      ),
      generate(rng) {
        const f = rng.pick(["sin", "cos", "tan"] as const);
        const a = rng.pick(specialAngles);
        const c = rng.int(1, 4);
        const v = specialS(f, a);
        const rhs = texS(mulS(int(c), v));
        const coef = c === 1 ? "" : `${c}`;
        const isolate = c === 1 ? "" : steps(`\\${f} \\theta = \\frac{${rhs}}{${c}} = ${texS(v)}`);
        return numberProblem({
          prompt: t(
            `Find the acute angle $\\theta$ with $${coef}\\${f} \\theta = ${rhs}$.`,
            `求满足 $${coef}\\${f} \\theta = ${rhs}$ 的锐角 $\\theta$。`,
          ),
          answer: a,
          form: "integer",
          unit: "°",
          wrong: specialAngles.filter((b) => b !== a),
          solution: t(
            `${c === 1 ? "" : `Divide by $${c}$:${isolate}`}From the special right triangles, $\\${f} ${a}^\\circ = ${texS(v)}$, so $\\theta = ${a}^\\circ$.`,
            `${c === 1 ? "" : `两边除以 $${c}$：${isolate}`}由特殊直角三角形，$\\${f} ${a}^\\circ = ${texS(v)}$，所以 $\\theta = ${a}^\\circ$。`,
          ),
        });
      },
    },
    {
      id: "expressions-with-special-ratios",
      title: t("Expressions with special ratios", "含特殊角三角比的式子"),
      explanation: t(
        "Replace each ratio by its exact value, then simplify:\n\n$$4\\sin 60^\\circ \\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = 4 \\cdot \\frac{3}{4} = 3,$$\n\n$$\\frac{\\tan 60^\\circ}{\\sin 45^\\circ} = \\sqrt{3} \\div \\frac{\\sqrt{2}}{2} = \\frac{2\\sqrt{3}}{\\sqrt{2}} = \\sqrt{6}.$$",
        "把每个三角比换成精确值，再化简：\n\n$$4\\sin 60^\\circ \\cos 30^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = 4 \\cdot \\frac{3}{4} = 3,$$\n\n$$\\frac{\\tan 60^\\circ}{\\sin 45^\\circ} = \\sqrt{3} \\div \\frac{\\sqrt{2}}{2} = \\frac{2\\sqrt{3}}{\\sqrt{2}} = \\sqrt{6}.$$",
      ),
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
        return radicalProblem({
          prompt: t(`Find the exact value of $${expr}$ in simplest radical form.`, `求 $${expr}$ 的精确值，答案写成最简根式。`),
          answer,
          wrong: [
            texS(combine(specialS(specialSwap[f], a), vb)),
            texS(combine(va, specialS(specialSwap[g], b))),
            texS(divide ? divS(vb, va) : mulS(va, vb)),
          ],
          solution: t(
            `Replace each ratio by its exact value:${chain(`${expr} = ${sub}`, `= ${texS(answer)}`)}`,
            `把每个三角比换成精确值：${chain(`${expr} = ${sub}`, `= ${texS(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "exact-sides-with-special-angles",
      title: t("Exact sides with special angles", "用特殊角求精确边长"),
      explanation: t(
        "With a special angle, trigonometry gives exact sides. In a right triangle with a $60^\\circ$ angle whose adjacent side is $8$, the opposite side is $8 \\tan 60^\\circ = 8\\sqrt{3}$, and the hypotenuse is\n\n$$\\frac{8}{\\cos 60^\\circ} = \\frac{8}{\\frac{1}{2}} = 16.$$",
        "遇到特殊角时，三角比给出精确的边长。在有一个 $60^\\circ$ 角、它的邻边为 $8$ 的直角三角形中，对边是 $8 \\tan 60^\\circ = 8\\sqrt{3}$，斜边是\n\n$$\\frac{8}{\\cos 60^\\circ} = \\frac{8}{\\frac{1}{2}} = 16.$$",
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
        return {
          ...radicalProblem({
            prompt: t("Find $x$ exactly, in simplest radical form.", "求 $x$ 的精确值，答案写成最简根式。"),
            answer,
            wrong: [
              texS(divide ? mulS(int(n), v) : divS(int(n), v)),
              ...others.map((g) => texS(divide ? divS(int(n), specialS(g, a)) : mulS(int(n), specialS(g, a)))),
            ],
            solution: t(
              `Seen from the $${a}^\\circ$ angle, $x$ is ${sideNames[c.ask].en} and $${n}$ is ${sideNames[c.known].en}, so use the ${fnNames[c.fn].en}, $\\${c.fn} ${a}^\\circ = ${texS(v)}$:${chain(ratioTex(c.fn, `${a}^\\circ`, labels), solve)}`,
              `从 $${a}^\\circ$ 角看，$x$ 是${sideNames[c.ask]["zh-CN"]}，$${n}$ 是${sideNames[c.known]["zh-CN"]}，所以用${fnNames[c.fn]["zh-CN"]}，$\\${c.fn} ${a}^\\circ = ${texS(v)}$：${chain(ratioTex(c.fn, `${a}^\\circ`, labels), solve)}`,
            ),
          }),
          figure: angleTriangle(
            rng,
            a,
            labels,
            `${a}°`,
            `A right triangle with a ${a}° angle; ${sideNames[c.known].en} is ${n} and ${sideNames[c.ask].en} is x.`,
            `一个直角三角形，有一个 ${a}° 的角；${sideNames[c.known]["zh-CN"]}为 ${n}，${sideNames[c.ask]["zh-CN"]}为 x。`,
          ),
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "area-from-a-leg-and-an-angle",
      title: t("Area from a leg and an angle", "由直角边和角求面积"),
      explanation: t(
        "The area of a right triangle is half the product of its legs. If one leg and an acute angle are known, find the other leg with the tangent. With adjacent leg $6$ and an angle of $35^\\circ$, the other leg is $6 \\tan 35^\\circ$, so\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6 \\tan 35^\\circ = 18 \\tan 35^\\circ \\approx 12.6.$$",
        "直角三角形的面积是两条直角边之积的一半。若已知一条直角边和一个锐角，用正切求另一条直角边。邻边为 $6$、角为 $35^\\circ$ 时，另一条直角边是 $6 \\tan 35^\\circ$，所以\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6 \\tan 35^\\circ = 18 \\tan 35^\\circ \\approx 12.6.$$",
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
              solution: t(
                `The other leg is ${adjacent ? "opposite" : "adjacent to"} the $${th}^\\circ$ angle and the leg $${n}$ is ${adjacent ? "adjacent to" : "opposite"} it, so it is $${legTex}$. The area is${steps(`A = \\frac{1}{2} \\cdot ${n} \\cdot ${legTex} \\approx ${dec(answer)}`)}`,
                `另一条直角边是 $${th}^\\circ$ 角的${adjacent ? "对边" : "邻边"}，直角边 $${n}$ 是它的${adjacent ? "邻边" : "对边"}，所以另一条直角边是 $${legTex}$。面积是${steps(`A = \\frac{1}{2} \\cdot ${n} \\cdot ${legTex} \\approx ${dec(answer)}`)}`,
              ),
            }),
            figure: angleTriangle(
              rng,
              th,
              adjacent ? { adj: `${n}` } : { opp: `${n}` },
              `${th}°`,
              `A right triangle with a ${th}° angle and the leg ${adjacent ? "adjacent to" : "opposite"} it equal to ${n}.`,
              `一个直角三角形，有一个 ${th}° 的角，它的${adjacent ? "邻边" : "对边"}为 ${n}。`,
            ),
          };
        }
      },
    },
    {
      id: "area-from-the-hypotenuse-and-an-angle",
      title: t("Area from the hypotenuse and an angle", "由斜边和角求面积"),
      explanation: t(
        "If the hypotenuse $c$ and an acute angle $\\theta$ are known, the legs are $c \\sin \\theta$ and $c \\cos \\theta$, so\n\n$$A = \\frac{1}{2} c \\sin \\theta \\cdot c \\cos \\theta.$$\n\nWith $c = 10$ and $\\theta = 40^\\circ$: $A = \\frac{1}{2} \\cdot 10 \\sin 40^\\circ \\cdot 10 \\cos 40^\\circ \\approx \\frac{1}{2} \\cdot 6.428 \\cdot 7.660 \\approx 24.6$.",
        "若已知斜边 $c$ 和锐角 $\\theta$，两条直角边是 $c \\sin \\theta$ 和 $c \\cos \\theta$，所以\n\n$$A = \\frac{1}{2} c \\sin \\theta \\cdot c \\cos \\theta.$$\n\n$c = 10$，$\\theta = 40^\\circ$ 时：$A = \\frac{1}{2} \\cdot 10 \\sin 40^\\circ \\cdot 10 \\cos 40^\\circ \\approx \\frac{1}{2} \\cdot 6.428 \\cdot 7.660 \\approx 24.6$。",
      ),
      generate(rng) {
        for (;;) {
          const th = rng.int(20, 70);
          const c = rng.int(4, 30);
          const [s, co] = [trig("sin", th), trig("cos", th)];
          const area = (c * c * s * co) / 2;
          const answer = rounded(area, (c * c * t4(s) * t4(co)) / 2);
          if (!answer || th === 45) continue;
          return {
            ...numberProblem({
              prompt: t("Find the area of the triangle. Round to the nearest tenth.", "求这个三角形的面积，结果精确到十分位。"),
              answer,
              form: "decimal",
              wrong: [roundQ(c * c * s * co), roundQ((c * c * s) / 2), roundQ((c * c * trig("tan", th)) / 2)],
              solution: t(
                `The legs are $${c} \\sin ${th}^\\circ$ (opposite the angle) and $${c} \\cos ${th}^\\circ$ (adjacent to it):${steps(`A = \\frac{1}{2} \\cdot ${c} \\sin ${th}^\\circ \\cdot ${c} \\cos ${th}^\\circ \\approx ${dec(answer)}`)}`,
                `两条直角边是 $${c} \\sin ${th}^\\circ$（角的对边）和 $${c} \\cos ${th}^\\circ$（角的邻边）：${steps(`A = \\frac{1}{2} \\cdot ${c} \\sin ${th}^\\circ \\cdot ${c} \\cos ${th}^\\circ \\approx ${dec(answer)}`)}`,
              ),
            }),
            figure: angleTriangle(
              rng,
              th,
              { hyp: `${c}` },
              `${th}°`,
              `A right triangle with hypotenuse ${c} and a ${th}° angle.`,
              `一个直角三角形，斜边为 ${c}，有一个 ${th}° 的角。`,
            ),
          };
        }
      },
    },
    {
      id: "area-from-two-sides-and-the-included-angle",
      title: t("Two sides and the included angle", "两边及其夹角"),
      explanation: t(
        "Any triangle can be split into right triangles by a height. In $\\triangle ABC$ with $CA = b$, $CB = a$ and the angle $C$ between them, the height from $B$ to $CA$ is the side opposite $C$ in a right triangle with hypotenuse $a$, so $h = a \\sin C$ and\n\n$$A = \\frac{1}{2} b h = \\frac{1}{2} a b \\sin C.$$\n\nWith $a = 9$, $b = 7$ and $C = 50^\\circ$: $h = 9 \\sin 50^\\circ \\approx 6.894$ and $A \\approx \\frac{1}{2} \\cdot 7 \\cdot 6.894 \\approx 24.1$.",
        "任何三角形都可以用一条高分成直角三角形。在 $\\triangle ABC$ 中，$CA = b$，$CB = a$，它们的夹角是 $C$。从 $B$ 到 $CA$ 的高是一个斜边为 $a$ 的直角三角形中 $C$ 的对边，所以 $h = a \\sin C$，\n\n$$A = \\frac{1}{2} b h = \\frac{1}{2} a b \\sin C.$$\n\n$a = 9$，$b = 7$，$C = 50^\\circ$ 时：$h = 9 \\sin 50^\\circ \\approx 6.894$，$A \\approx \\frac{1}{2} \\cdot 7 \\cdot 6.894 \\approx 24.1$。",
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
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${A}${B}${Cn}$, $${Cn}${A} = ${b}$, $${Cn}${B} = ${a}$ and $\\angle ${Cn} = ${C}^\\circ$. Find the area of the triangle, to the nearest tenth.`,
                `在 $\\triangle ${A}${B}${Cn}$ 中，$${Cn}${A} = ${b}$，$${Cn}${B} = ${a}$，$\\angle ${Cn} = ${C}^\\circ$。求这个三角形的面积，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [roundQ(a * b * s), roundQ((a * b * trig("cos", C)) / 2), roundQ((a * b) / 2)],
              solution: t(
                `The height from $${B}$ to $${Cn}${A}$ is opposite $\\angle ${Cn}$ in a right triangle with hypotenuse $${a}$:${steps(`h = ${a} \\sin ${C}^\\circ`, `A = \\frac{1}{2} \\cdot ${b} \\cdot ${a} \\sin ${C}^\\circ \\approx ${dec(answer)}`)}`,
                `从 $${B}$ 到 $${Cn}${A}$ 的高，是斜边为 $${a}$ 的直角三角形中 $\\angle ${Cn}$ 的对边：${steps(`h = ${a} \\sin ${C}^\\circ`, `A = \\frac{1}{2} \\cdot ${b} \\cdot ${a} \\sin ${C}^\\circ \\approx ${dec(answer)}`)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [pc, pa, pb] },
                { kind: "segment", a: pb, b: ph, dashed: true },
                { kind: "right", vertex: ph, from: pa, to: pb },
                ...outside([pc, pa, pb], [`${b}`, null, `${a}`]),
                { kind: "arc", vertex: pc, from: pa, to: pb, label: `${C}°`, accent: true },
                ...names([pc, pa, pb], `${Cn}${A}${B}`),
              ],
              `Triangle ${A}${B}${Cn} with ${Cn}${A} = ${b}, ${Cn}${B} = ${a}, angle ${Cn} = ${C}°, and the height from ${B} to ${Cn}${A} dashed.`,
              `三角形 ${A}${B}${Cn}，${Cn}${A} = ${b}，${Cn}${B} = ${a}，角 ${Cn} = ${C}°，从 ${B} 到 ${Cn}${A} 的高用虚线表示。`,
            ),
          };
        }
      },
    },
  ],
};

export const solvingMultipleRightTrianglesUsingTrigonometry: TopicDef = {
  id: "solving-multiple-right-triangles-using-trigonometry",
  title: t("Solving Multiple Right Triangles Using Trigonometry", "用三角比解多个直角三角形"),
  summary: t(
    "Solve figures made of two right triangles that share a side, working from one triangle to the other.",
    "解由两个共边直角三角形组成的图形，从一个三角形推到另一个。",
  ),
  prerequisites: ["modeling-with-trigonometry"],
  encompasses: [
    { topic: "modeling-with-trigonometry", weight: 0.4 },
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.SRT.C.8"],
  knowledgePoints: [
    {
      id: "a-shared-height",
      title: t("A shared height", "公共的高"),
      explanation: t(
        "A height $AD$ splits $\\triangle ABC$ into two right triangles that share the side $AD$. Solve the triangle with enough information first, then carry the shared side over.\n\nWith $AB = 10$, $\\angle B = 50^\\circ$ and $\\angle C = 35^\\circ$: in $\\triangle ABD$, $AD = 10 \\sin 50^\\circ \\approx 7.660$; in $\\triangle ADC$, $\\tan 35^\\circ = \\frac{AD}{DC}$, so\n\n$$DC = \\frac{10 \\sin 50^\\circ}{\\tan 35^\\circ} \\approx 10.9.$$\n\nKeep the unrounded value of the shared side for the second step.",
        "高 $AD$ 把 $\\triangle ABC$ 分成两个共边 $AD$ 的直角三角形。先解信息足够的那个三角形，再把公共边带到另一个三角形。\n\n$AB = 10$，$\\angle B = 50^\\circ$，$\\angle C = 35^\\circ$ 时：在 $\\triangle ABD$ 中，$AD = 10 \\sin 50^\\circ \\approx 7.660$；在 $\\triangle ADC$ 中，$\\tan 35^\\circ = \\frac{AD}{DC}$，所以\n\n$$DC = \\frac{10 \\sin 50^\\circ}{\\tan 35^\\circ} \\approx 10.9.$$\n\n第二步要用公共边未取近似的值。",
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
            BC: `${ask} = BD + DC = ${c} \\cos ${beta}^\\circ + \\frac{${c} \\sin ${beta}^\\circ}{\\tan ${gamma}^\\circ} \\approx ${dec(answer)}`,
            AC: `${ask} = \\frac{AD}{\\sin ${gamma}^\\circ} = \\frac{${c} \\sin ${beta}^\\circ}{\\sin ${gamma}^\\circ} \\approx ${dec(answer)}`,
          }[ask];
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ABC$, $AD$ is the height to $BC$, $AB = ${c}$, $\\angle B = ${beta}^\\circ$ and $\\angle C = ${gamma}^\\circ$. Find $${ask}$, to the nearest tenth.`,
                `在 $\\triangle ABC$ 中，$AD$ 是 $BC$ 边上的高，$AB = ${c}$，$\\angle B = ${beta}^\\circ$，$\\angle C = ${gamma}^\\circ$。求 $${ask}$，结果精确到十分位。`,
              ),
              answer,
              form: "decimal",
              wrong: [roundQ(ad * tg), roundQ(c * cb), roundQ(ask === "AC" ? ad / tg : ad / sg), roundQ(c / tg)],
              solution: t(
                `In right triangle $ABD$, $AD$ is opposite $\\angle B$:${steps(`AD = ${c} \\sin ${beta}^\\circ \\approx ${dec(roundQ(ad, 3))}`)}${ask === "BC" ? `and $BD = ${c} \\cos ${beta}^\\circ$. ` : ""}In right triangle $ADC$:${steps(last)}`,
                `在直角三角形 $ABD$ 中，$AD$ 是 $\\angle B$ 的对边：${steps(`AD = ${c} \\sin ${beta}^\\circ \\approx ${dec(roundQ(ad, 3))}`)}${ask === "BC" ? `且 $BD = ${c} \\cos ${beta}^\\circ$。` : ""}在直角三角形 $ADC$ 中：${steps(last)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [B, C, A] },
                { kind: "segment", a: A, b: D, dashed: true },
                { kind: "right", vertex: D, from: C, to: A },
                { kind: "arc", vertex: B, from: C, to: A, label: `${beta}°`, accent: true },
                { kind: "arc", vertex: C, from: A, to: B, label: `${gamma}°`, accent: true },
                { kind: "side", a: A, b: B, text: `${c}` },
                ...names([B, C, A], "BCA"),
                { kind: "label", at: D, text: "D", dir: "s", italic: true },
              ],
              `Triangle ABC with the height AD to BC; AB = ${c}, angle B = ${beta}°, angle C = ${gamma}°.`,
              `三角形 ABC，AD 是 BC 边上的高；AB = ${c}，角 B = ${beta}°，角 C = ${gamma}°。`,
            ),
          };
        }
      },
    },
    {
      id: "two-angles-of-elevation",
      title: t("Two angles of elevation", "两个仰角"),
      explanation: t(
        "When the height $h$ of an object is seen from two points on a line toward it, each angle of elevation gives a right triangle with the same height. From $P$ the angle is $25^\\circ$; after walking $50$ m toward the object to $Q$, it is $40^\\circ$. The horizontal distances to the base are $\\frac{h}{\\tan 25^\\circ}$ and $\\frac{h}{\\tan 40^\\circ}$, and they differ by $50$:\n\n$$\\frac{h}{\\tan 25^\\circ} - \\frac{h}{\\tan 40^\\circ} = 50, \\qquad h = \\frac{50}{\\frac{1}{\\tan 25^\\circ} - \\frac{1}{\\tan 40^\\circ}} \\approx 52.5 \\text{ m}.$$",
        "从朝向物体的同一直线上的两点观察物体的高 $h$ 时，每个仰角都给出一个高相同的直角三角形。从 $P$ 看仰角是 $25^\\circ$；朝物体走 $50$ 米到 $Q$，仰角变为 $40^\\circ$。到底部的水平距离分别是 $\\frac{h}{\\tan 25^\\circ}$ 和 $\\frac{h}{\\tan 40^\\circ}$，两者相差 $50$：\n\n$$\\frac{h}{\\tan 25^\\circ} - \\frac{h}{\\tan 40^\\circ} = 50, \\qquad h = \\frac{50}{\\frac{1}{\\tan 25^\\circ} - \\frac{1}{\\tan 40^\\circ}} \\approx 52.5 \\text{ 米}.$$",
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
              solution: t(
                `Let $h = TB$. The distances from $P$ and $Q$ to the base $B$ are $\\frac{h}{\\tan ${alpha}^\\circ}$ and $\\frac{h}{\\tan ${beta}^\\circ}$, and $PQ = ${d}$:${chain(`\\frac{h}{\\tan ${alpha}^\\circ} - \\frac{h}{\\tan ${beta}^\\circ} = ${d}`, `h = \\frac{${d}}{\\frac{1}{\\tan ${alpha}^\\circ} - \\frac{1}{\\tan ${beta}^\\circ}} \\approx ${dec(answer)}`)}The tower is about $${unitTex(dec(answer))}$ tall.`,
                `设 $h = TB$。$P$、$Q$ 到塔底 $B$ 的距离分别是 $\\frac{h}{\\tan ${alpha}^\\circ}$ 和 $\\frac{h}{\\tan ${beta}^\\circ}$，且 $PQ = ${d}$：${chain(`\\frac{h}{\\tan ${alpha}^\\circ} - \\frac{h}{\\tan ${beta}^\\circ} = ${d}`, `h = \\frac{${d}}{\\frac{1}{\\tan ${alpha}^\\circ} - \\frac{1}{\\tan ${beta}^\\circ}} \\approx ${dec(answer)}`)}塔高约 $${dec(answer)}$ 米。`,
              ),
            }),
            figure: figure(
              [
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
              ],
              `Points P and Q on the ground, ${d} m apart, in line with the base B of a tower TB. The angles of elevation of T are ${alpha}° from P and ${beta}° from Q.`,
              `地面上的点 P、Q 相距 ${d} 米，与塔 TB 的底部 B 在一条直线上。从 P 看 T 的仰角是 ${alpha}°，从 Q 看是 ${beta}°。`,
            ),
          };
        }
      },
    },
    {
      id: "stacked-right-triangles",
      title: t("Stacked right triangles", "相叠的直角三角形"),
      explanation: t(
        "Two right triangles can share a hypotenuse of one and a leg of the other. In right triangle $ABC$ (right angle at $B$) and right triangle $ACD$ (right angle at $C$), with $AB = 8$, $\\angle BAC = 30^\\circ$ and $\\angle CAD = 25^\\circ$:\n\n$$AC = \\frac{8}{\\cos 30^\\circ} \\approx 9.238, \\qquad CD = AC \\tan 25^\\circ = \\frac{8 \\tan 25^\\circ}{\\cos 30^\\circ} \\approx 4.3.$$",
        "两个直角三角形可以以一个的斜边作为另一个的直角边。在直角三角形 $ABC$（直角在 $B$）和直角三角形 $ACD$（直角在 $C$）中，$AB = 8$，$\\angle BAC = 30^\\circ$，$\\angle CAD = 25^\\circ$：\n\n$$AC = \\frac{8}{\\cos 30^\\circ} \\approx 9.238, \\qquad CD = AC \\tan 25^\\circ = \\frac{8 \\tan 25^\\circ}{\\cos 30^\\circ} \\approx 4.3.$$",
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
              solution: t(
                `In right triangle $ABC$, $AB$ is adjacent to $\\angle BAC$ and $AC$ is the hypotenuse:${steps(`AC = \\frac{${a}}{\\cos ${alpha}^\\circ} \\approx ${dec(roundQ(ac, 3))}`)}In right triangle $ACD$, $AC$ is adjacent to $\\angle CAD$:${steps(last)}`,
                `在直角三角形 $ABC$ 中，$AB$ 是 $\\angle BAC$ 的邻边，$AC$ 是斜边：${steps(`AC = \\frac{${a}}{\\cos ${alpha}^\\circ} \\approx ${dec(roundQ(ac, 3))}`)}在直角三角形 $ACD$ 中，$AC$ 是 $\\angle CAD$ 的邻边：${steps(last)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [A, B, C, D] },
                { kind: "segment", a: A, b: C },
                { kind: "right", vertex: B, from: A, to: C },
                { kind: "right", vertex: C, from: A, to: D },
                { kind: "arc", vertex: A, from: B, to: C, label: `${alpha}°`, accent: true },
                { kind: "arc", vertex: A, from: C, to: D, label: `${beta}°`, accent: true },
                { kind: "side", a: A, b: B, text: `${a}` },
                ...names([A, B, C, D], "ABCD"),
              ],
              `Right triangles ABC (right angle at B) and ACD (right angle at C) sharing AC; AB = ${a}, angle BAC = ${alpha}°, angle CAD = ${beta}°.`,
              `直角三角形 ABC（直角在 B）与 ACD（直角在 C）有公共边 AC；AB = ${a}，角 BAC = ${alpha}°，角 CAD = ${beta}°。`,
            ),
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
