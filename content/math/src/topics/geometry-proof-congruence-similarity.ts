import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type PlaneView, type Point, plane, Q, sketch } from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, yesNo } from "../problems.ts";

// ─── Helpers ────────────────────────────────────────────────────────────────

const rad = (d: number) => (d * Math.PI) / 180;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 5, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** turn rotates p by d degrees counterclockwise about o. */
function turn(p: Point, d: number, o: Point = [0, 0]): Point {
  const [c, s] = [Math.cos(rad(d)), Math.sin(rad(d))];
  const [x, y] = [p[0] - o[0], p[1] - o[1]];
  return [o[0] + c * x - s * y, o[1] + s * x + c * y];
}

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** compassOf is the compass direction nearest to d degrees. */
function compassOf(d: number): Compass {
  const names: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return names[Math.round((((d % 360) + 360) % 360) / 45) % 8]!;
}

/** directionOf is the direction in degrees from a to b. */
const directionOf = (a: Point, b: Point) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

const view: PlaneView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string, v: PlaneView = view): Figure => ({
  svg: plane(v, marks),
  alt: t(en, zh),
});

/** cat joins texts and plain strings (the same in every locale). */
function cat(...parts: readonly (Text | string)[]): Text {
  const pick = (locale: "en" | "zh-CN") => parts.map((p) => (typeof p === "string" ? p : p[locale])).join("");
  return t(pick("en"), pick("zh-CN"));
}

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
function plain(c: number, d: number): string {
  return linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");
}

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = (c: number, d: number) => (d === 0 && c === 1 ? "x^\\circ" : `(${linear(c, d)})^\\circ`);

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°". */
const angleLabel = (c: number, d: number) => (d === 0 && c === 1 ? "x°" : `(${plain(c, d)})°`);

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** equalSteps solves c1·x + d1 = c2·x + d2 (c1 ≠ c2). */
function equalSteps(c1: number, d1: number, c2: number, d2: number): string[] {
  const x = (d2 - d1) / (c1 - c2);
  const collected = c1 > c2 ? `${linear(c1 - c2, 0)} = ${d2 - d1}` : `${d1 - d2} = ${linear(c2 - c1, 0)}`;
  return [`${linear(c1, d1)} = ${linear(c2, d2)}`, collected, `x = ${x}`];
}

/** sumSteps solves (c1·x + d1) + (c2·x + d2) + … = total. */
function sumSteps(terms: readonly (readonly [number, number])[], total: number): string[] {
  const c = terms.reduce((s, [ci]) => s + ci, 0);
  const d = terms.reduce((s, [, di]) => s + di, 0);
  const sum = terms.map(([ci, di]) => (di === 0 ? linear(ci, 0) : `(${linear(ci, di)})`)).join(" + ");
  return [`${sum} = ${total}`, `${linear(c, d)} = ${total}`, `${linear(c, 0)} = ${total - d}`, `x = ${(total - d) / c}`];
}

/** linearPairOf picks x and angle expressions c1·x + d1 and c2·x + d2 that are equal (total null) or add up to total at x; m is the first angle. */
function exprPair(
  rng: Rng,
  total: number | null,
  lo = 30,
  hi = 150,
): { x: number; c1: number; d1: number; c2: number; d2: number; m: number } {
  for (;;) {
    const x = rng.int(5, 30);
    const [c1, c2] = total === null ? (rng.sample([1, 2, 3, 4, 5], 2) as [number, number]) : [rng.int(1, 4), rng.int(1, 4)];
    const m = rng.int(lo, hi);
    const d1 = m - c1 * x;
    const d2 = (total === null ? m : total - m) - c2 * x;
    if (Math.abs(m - 90) >= 10 && Math.abs(d1) <= 60 && Math.abs(d2) <= 60 && (d1 !== 0 || d2 !== 0)) return { x, c1, d1, c2, d2, m };
  }
}

/** gcd is the greatest common divisor of two integers. */
function gcd(a: number, b: number): number {
  let [m, n] = [Math.abs(a), Math.abs(b)];
  while (n !== 0) [m, n] = [n, m % n];
  return m;
}

// ─── Proofs ─────────────────────────────────────────────────────────────────

/** reasons are the justifications used in the proofs of this unit. */
const reasons = {
  given: t("Given", "已知"),
  angleAdd: t("Angle Addition Postulate", "角的加法公设"),
  linearPair: t("Linear Pair Postulate", "邻补角公设"),
  corr: t("Corresponding Angles Postulate", "同位角公设"),
  corrConv: t("Converse of the Corresponding Angles Postulate", "同位角公设的逆命题"),
  vertical: t("Vertical Angles Theorem", "对顶角定理"),
  aia: t("Alternate Interior Angles Theorem", "内错角定理"),
  aea: t("Alternate Exterior Angles Theorem", "外错角定理"),
  cia: t("Consecutive Interior Angles Theorem", "同旁内角定理"),
  aiaConv: t("Converse of the Alternate Interior Angles Theorem", "内错角定理的逆定理"),
  congSupp: t("Congruent Supplements Theorem", "同角（或等角）的补角相等"),
  congComp: t("Congruent Complements Theorem", "同角（或等角）的余角相等"),
  rightCong: t("Right Angles Congruence Theorem", "直角相等定理"),
  reflexive: t("Reflexive Property of Congruence", "全等的自反性"),
  symmetric: t("Symmetric Property of Congruence", "全等的对称性"),
  transitive: t("Transitive Property of Congruence", "全等的传递性"),
  subst: t("Substitution Property of Equality", "等量代换"),
  division: t("Division Property of Equality", "等式的除法性质"),
  defCong: t("Definition of congruent angles", "角全等的定义"),
  defPerp: t("Definition of perpendicular lines", "垂直的定义"),
  defMid: t("Definition of midpoint", "中点的定义"),
  defBis: t("Definition of angle bisector", "角平分线的定义"),
  sss: t("SSS Congruence Criterion", "SSS 全等判定"),
  sas: t("SAS Congruence Criterion", "SAS 全等判定"),
  asa: t("ASA Congruence Criterion", "ASA 全等判定"),
  aas: t("AAS Congruence Criterion", "AAS 全等判定"),
  cpctc: t("Corresponding parts of congruent triangles are congruent", "全等三角形的对应部分全等"),
  aaSim: t("AA Similarity Criterion", "AA 相似判定"),
  sasSim: t("SAS Similarity Criterion", "SAS 相似判定"),
  defSim: t("Definition of similar polygons", "相似多边形的定义"),
} as const;

type Reason = keyof typeof reasons;
const reasonOrder = Object.keys(reasons) as Reason[];

/** why states what each reason says, for solutions. */
const why: Record<Reason, Text> = {
  given: t("it is part of the given information", "它是已知条件的一部分"),
  angleAdd: t(
    "when a ray lies inside an angle, the two smaller angles add up to the whole angle",
    "当一条射线在一个角的内部时，两个小角之和等于整个角",
  ),
  linearPair: t("the two angles of a linear pair are supplementary", "邻补角互补"),
  corr: t("when two parallel lines are cut by a transversal, corresponding angles are congruent", "两条平行线被截线所截，同位角全等"),
  corrConv: t("if corresponding angles are congruent, the lines are parallel", "若同位角全等，则两直线平行"),
  vertical: t("vertical angles are congruent", "对顶角全等"),
  aia: t("parallel lines make alternate interior angles congruent", "两直线平行，内错角全等"),
  aea: t("parallel lines make alternate exterior angles congruent", "两直线平行，外错角全等"),
  cia: t("parallel lines make consecutive interior angles supplementary", "两直线平行，同旁内角互补"),
  aiaConv: t("if alternate interior angles are congruent, the lines are parallel", "若内错角全等，则两直线平行"),
  congSupp: t(
    "two angles supplementary to the same angle (or to congruent angles) are congruent",
    "与同一个角（或相等的角）互补的两个角全等",
  ),
  congComp: t(
    "two angles complementary to the same angle (or to congruent angles) are congruent",
    "与同一个角（或相等的角）互余的两个角全等",
  ),
  rightCong: t("all right angles are congruent", "所有直角都全等"),
  reflexive: t("every figure is congruent to itself", "任何图形都与自身全等"),
  symmetric: t("a congruence can be read in either direction", "全等关系可以交换两边"),
  transitive: t("two figures congruent to the same figure are congruent to each other", "与同一个图形全等的两个图形彼此全等"),
  subst: t("a quantity may be replaced by an equal quantity", "一个量可以用与它相等的量替换"),
  division: t("dividing both sides of an equation by the same nonzero number keeps it true", "等式两边同除以一个非零数，等式仍成立"),
  defCong: t("congruent angles have equal measures, and angles with equal measures are congruent", "全等的角度数相等，度数相等的角全等"),
  defPerp: t(
    "perpendicular lines meet at right angles, and lines that meet at a right angle are perpendicular",
    "垂直的直线相交成直角，相交成直角的直线互相垂直",
  ),
  defMid: t("a midpoint divides a segment into two congruent halves", "中点把线段分成两条全等的线段"),
  defBis: t("an angle bisector divides an angle into two congruent angles", "角平分线把一个角分成两个全等的角"),
  sss: t("three pairs of congruent sides make two triangles congruent", "三组对应边全等的两个三角形全等"),
  sas: t(
    "two pairs of congruent sides and the congruent angles between them make two triangles congruent",
    "两组对应边及其夹角全等的两个三角形全等",
  ),
  asa: t(
    "two pairs of congruent angles and the congruent sides between them make two triangles congruent",
    "两组对应角及其夹边全等的两个三角形全等",
  ),
  aas: t(
    "two pairs of congruent angles and a pair of congruent sides not between them make two triangles congruent",
    "两组对应角及一组非夹边的对应边全等的两个三角形全等",
  ),
  cpctc: t("once two triangles are congruent, all their corresponding parts are congruent", "两个三角形全等后，它们的所有对应部分都全等"),
  aaSim: t("two pairs of congruent angles make two triangles similar", "两组对应角全等的两个三角形相似"),
  sasSim: t(
    "two pairs of proportional sides with congruent included angles make two triangles similar",
    "两组对应边成比例且夹角全等的两个三角形相似",
  ),
  defSim: t(
    "similar polygons have congruent corresponding angles and proportional corresponding sides",
    "相似多边形的对应角全等，对应边成比例",
  ),
};

/** Step is one row of a two-column proof: a statement, its reason, and wrong statements for that row. */
interface Step {
  readonly s: Text;
  readonly r: Reason;
  readonly wrong?: readonly Text[];
}

/** Proof is a two-column proof with its figure and reasons that are plausible but wrong for its steps. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly Step[];
  readonly figure: Figure;
  readonly distract: readonly Reason[];
}

/** proofPrompt writes a proof with the blank at row k, then the question. */
function proofPrompt(p: Proof, k: number, part: "s" | "r"): Text {
  const rows = p.steps.map((st, i) => {
    const s = i === k && part === "s" ? same("**?**") : st.s;
    const r = i === k && part === "r" ? same("**?**") : reasons[st.r];
    return cat(`${i + 1}. `, s, " — ", r);
  });
  const question =
    part === "r"
      ? t(`Which reason completes step ${k + 1}?`, `第 ${k + 1} 步的理由是什么？`)
      : t(`Which statement completes step ${k + 1}?`, `第 ${k + 1} 步的陈述是什么？`);
  return cat(
    t("**Given:** ", "**已知：**"),
    p.given,
    "\n\n",
    t("**Prove:** ", "**求证：**"),
    p.prove,
    "\n\n",
    ...rows.flatMap((r) => [r, "\n"]),
    "\n",
    question,
  );
}

/** proofProblem asks for the reason (part "r") or the statement (part "s") of one step of a proof. */
function proofProblem(rng: Rng, p: Proof, part: "s" | "r") {
  const candidates = p.steps
    .map((_st, i) => i)
    .filter((i) =>
      part === "r"
        ? p.steps[i]!.r !== "given"
        : p.steps[i]!.r !== "given" && i < p.steps.length - 1 && (p.steps[i]!.wrong?.length ?? 0) >= 3,
    );
  const k = rng.pick(candidates);
  const st = p.steps[k]!;
  const solution = t(
    `Step ${k + 1} is ${st.s.en}, by the ${reasons[st.r].en}: ${why[st.r].en}.`,
    `第 ${k + 1} 步是 ${st.s["zh-CN"]}，理由是“${reasons[st.r]["zh-CN"]}”：${why[st.r]["zh-CN"]}。`,
  );
  if (part === "r") {
    const pool = [...new Set([...p.distract, ...p.steps.map((s) => s.r)])].filter((r) => r !== st.r && r !== "given");
    const picked = new Set([st.r, ...rng.sample(pool, 3)]);
    const options = reasonOrder.filter((r) => picked.has(r));
    return {
      ...choiceProblem({
        prompt: proofPrompt(p, k, "r"),
        options: options.map((r) => reasons[r]),
        correct: options.indexOf(st.r),
        solution,
      }),
      figure: p.figure,
    };
  }
  const options = rng.shuffle([st.s, ...rng.sample(st.wrong!, 3)]);
  return {
    ...choiceProblem({ prompt: proofPrompt(p, k, "s"), options, correct: options.indexOf(st.s), solution }),
    figure: p.figure,
  };
}

/** proofKp builds a knowledge point practicing reasons ("r"), statements ("s") or both ("rs") of the proofs build makes. */
function proofKp(
  id: string,
  title: Text,
  explanation: Text,
  part: "r" | "s" | "rs",
  build: (rng: Rng) => Proof,
  keyPrerequisites?: readonly string[],
): KnowledgePointDef {
  return {
    id,
    title,
    explanation,
    ...(keyPrerequisites && { keyPrerequisites }),
    generate(rng) {
      const p = build(rng);
      return proofProblem(rng, p, part === "rs" ? (rng.bool() ? "r" : "s") : part);
    },
  };
}

// ─── Transversal figures ────────────────────────────────────────────────────
//
// Angles at a transversal are numbered 1 to 4 at its crossing Q with the upper
// line ℓ and 5 to 8 at its crossing P with the lower line m: upper left, upper
// right, lower left, lower right.

/** angleIndex is the index of angle n at its crossing, counterclockwise from the right: 0 upper right, 1 upper left, 2 lower left, 3 lower right. */
const angleIndex = (n: number) => [1, 0, 2, 3][(n - 1) % 4]!;

/** vert is the angle vertical to angle n. */
const vert = (n: number) => (n > 4 ? 4 : 0) + 5 - (((n - 1) % 4) + 1);

/** corr is the angle corresponding to angle n. */
const corr = (n: number) => (n > 4 ? n - 4 : n + 4);

/** acrossT is the angle forming a linear pair with angle n across the transversal (1 and 2, 3 and 4). */
const acrossT = (n: number) => (n % 2 === 1 ? n + 1 : n - 1);

/** acrossLine is the angle forming a linear pair with angle n across its line (1 and 3, 2 and 4). */
const acrossLine = (n: number) => ((n - 1) % 4 < 2 ? n + 2 : n - 2);

/** thetaFor is the transversal angle that gives angle n the measure m. */
const thetaFor = (n: number, m: number) => (angleIndex(n) % 2 === 0 ? m : 180 - m);

const cong = (a: number | string, b: number | string) => same(`$\\angle ${a} \\cong \\angle ${b}$`);
const supp = (a: number | string, b: number | string) => same(`$m\\angle ${a} + m\\angle ${b} = 180^\\circ$`);
const eqm = (a: number | string, b: number | string) => same(`$m\\angle ${a} = m\\angle ${b}$`);
const parallel = same("$\\ell \\parallel m$");

/** wrongCong are false statements a learner may confuse with ∠a ≅ ∠b when the two are congruent and not right angles. */
const wrongCong = (a: number, b: number) => [cong(a, acrossT(b)), cong(a, acrossLine(b)), supp(a, b)];
const wrongEq = (a: number, b: number) => [eqm(a, acrossT(b)), eqm(acrossLine(a), b), supp(a, b)];
const wrongSupp = (a: number, b: number) => [cong(a, b), supp(a, acrossT(b)), supp(acrossT(a), b)];
const wrongParallel = [same("$\\ell \\perp t$"), same("$t \\parallel m$"), same("$m \\perp t$")];

/** TransversalOptions say what a transversal figure shows. */
interface TransversalOptions {
  /** labels are the angles to label, by number, with their text. */
  readonly labels: readonly (readonly [number, string])[];
  /** arrows marks ℓ and m as parallel. */
  readonly arrows: boolean;
  /** single draws only the line ℓ and the transversal. */
  readonly single?: boolean;
  /** right marks the angles with these numbers as right angles. */
  readonly right?: readonly number[];
  /** arcs draws arcs at the labeled angles, for labels that are measures. */
  readonly arcs?: boolean;
}

/** transversalFigure draws lines ℓ (above) and m (below) cut by a transversal t at angle theta, the whole figure turned by phi degrees. */
function transversalFigure(theta: number, phi: number, o: TransversalOptions, en: string, zh: string): Figure {
  const c: Point = [0, 1.5];
  const r = (p: Point) => turn(p, phi, c);
  const p: Point = [0, 0];
  const q: Point = [3 / Math.tan(rad(theta)), 3];
  const rays = (v: Point) => [0, theta, 180, theta + 180].map((d) => dir(d, 2, v));
  const at = (n: number) => (n <= 4 ? q : p);
  const marks: Mark[] = [
    { kind: "segment", a: r([-6, 3]), b: r([6, 3]) },
    { kind: "label", at: r([6, 3]), text: "ℓ", dir: compassOf(phi) },
    { kind: "segment", a: r(o.single ? dir(theta + 180, 2.5, q) : dir(theta + 180, 2)), b: r(dir(theta, 2.5, q)) },
    { kind: "label", at: r(dir(theta, 2.5, q)), text: "t", dir: compassOf(theta + phi), italic: true },
  ];
  if (!o.single) {
    marks.push(
      { kind: "segment", a: r([-6, 0]), b: r([6, 0]) },
      { kind: "label", at: r([6, 0]), text: "m", dir: compassOf(phi), italic: true },
    );
  }
  if (o.arrows) {
    const x = theta < 90 ? -4.5 : 3;
    marks.push({ kind: "arrows", a: r([x, 3]), b: r([x + 2, 3]), count: 1 }, { kind: "arrows", a: r([x, 0]), b: r([x + 2, 0]), count: 1 });
  }
  for (const n of o.right ?? []) {
    const i = angleIndex(n);
    const rs = rays(at(n));
    marks.push({ kind: "right", vertex: r(at(n)), from: r(rs[i]!), to: r(rs[(i + 1) % 4]!) });
  }
  for (const [n, text] of o.labels) {
    const i = angleIndex(n);
    const v = at(n);
    if (o.arcs) {
      const rs = rays(v);
      marks.push({ kind: "arc", vertex: r(v), from: r(rs[i]!), to: r(rs[(i + 1) % 4]!), label: text, accent: true });
    } else {
      const bounds = [0, theta, 180, theta + 180, 360];
      const mid = (bounds[i]! + bounds[i + 1]!) / 2;
      marks.push({ kind: "label", at: r(dir(mid, 0.45, v)), text, dir: compassOf(mid + phi) });
    }
  }
  return figure(marks, en, zh);
}

/** numbered labels all eight angles (or the four at ℓ) with their numbers. */
const numbered = (single = false) => (single ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8]).map((n) => [n, String(n)] as const);

/** pickTheta picks the transversal's angle with the lines, at least 15° from a right angle. */
const pickTheta = (rng: Rng) => rng.pick([rng.int(50, 75), rng.int(105, 130)]);
const pickTilt = (rng: Rng) => rng.int(-12, 12);

/** parallelFigure draws the numbered transversal figure; arrows when ℓ ∥ m is given. */
function parallelFigure(rng: Rng, arrows: boolean): Figure {
  return transversalFigure(
    pickTheta(rng),
    pickTilt(rng),
    { labels: numbered(), arrows },
    `Lines ℓ and m${arrows ? ", marked parallel," : ""} cut by a transversal t, with the eight angles numbered 1 to 4 at ℓ and 5 to 8 at m.`,
    `直线 ℓ 与 m${arrows ? "（标为平行）" : ""}被截线 t 所截，八个角在 ℓ 处编号为 1 到 4，在 m 处编号为 5 到 8。`,
  );
}

/** raysFigure draws rays OA, OB, OC from O with the angles AOB and BOC labeled. */
function raysFigure(a: number, b: number, base: number, names: string, la: string, lb: string): Figure {
  const o: Point = [0, 0];
  const [pa, pb, pc] = [dir(base), dir(base + a), dir(base + a + b)];
  return figure(
    [
      { kind: "segment", a: o, b: pa },
      { kind: "segment", a: o, b: pb },
      { kind: "segment", a: o, b: pc },
      { kind: "arc", vertex: o, from: pa, to: pb, label: la, accent: true },
      { kind: "arc", vertex: o, from: pb, to: pc, label: lb, accent: true },
      { kind: "label", at: pa, text: names[0]!, dir: compassOf(base), italic: true },
      { kind: "label", at: pb, text: names[1]!, dir: compassOf(base + a), italic: true },
      { kind: "label", at: pc, text: names[2]!, dir: compassOf(base + a + b), italic: true },
      { kind: "label", at: o, text: names[3]!, dir: "s", italic: true },
    ],
    `Rays ${names[3]}${names[0]}, ${names[3]}${names[1]} and ${names[3]}${names[2]} from the point ${names[3]}, with ${names[3]}${names[1]} between the other two.`,
    `从点 ${names[3]} 出发的射线 ${names[3]}${names[0]}、${names[3]}${names[1]}、${names[3]}${names[2]}，${names[3]}${names[1]} 在另外两条之间。`,
  );
}

// ─── Proof: angle postulates and theorems ───────────────────────────────────

const postulateOptions: readonly Reason[] = ["angleAdd", "linearPair", "corr", "corrConv"];

export const identifyingAnglePostulates: TopicDef = {
  id: "identifying-angle-postulates",
  title: t("Identifying Angle Postulates", "认识角的公设"),
  summary: t(
    "Use the Angle Addition, Linear Pair and Corresponding Angles postulates, and name the postulate behind a statement.",
    "运用角的加法公设、邻补角公设和同位角公设，并说出一个结论所依据的公设。",
  ),
  prerequisites: ["parallel-lines-and-transversals"],
  encompasses: [{ topic: "parallel-lines-and-transversals", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    {
      id: "angle-addition-postulate",
      title: t("The Angle Addition Postulate", "角的加法公设"),
      explanation: t(
        "A **postulate** is a statement accepted without proof; theorems are then proved from postulates.\n\nThe **Angle Addition Postulate**: if point $B$ lies inside $\\angle AOC$, then $m\\angle AOB + m\\angle BOC = m\\angle AOC$.\n\nIf $m\\angle AOB = (2x + 5)^\\circ$, $m\\angle BOC = (3x - 10)^\\circ$ and $m\\angle AOC = 70^\\circ$, then $(2x + 5) + (3x - 10) = 70$, so $5x - 5 = 70$ and $x = 15$.",
        "**公设**是不加证明而接受的命题；定理再由公设证明出来。\n\n**角的加法公设**：若点 $B$ 在 $\\angle AOC$ 的内部，则 $m\\angle AOB + m\\angle BOC = m\\angle AOC$。\n\n若 $m\\angle AOB = (2x + 5)^\\circ$，$m\\angle BOC = (3x - 10)^\\circ$，$m\\angle AOC = 70^\\circ$，则 $(2x + 5) + (3x - 10) = 70$，所以 $5x - 5 = 70$，$x = 15$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(4, 20);
          const [c1, c2] = [rng.int(1, 5), rng.int(1, 5)];
          const [a, b] = [rng.int(20, 80), rng.int(20, 80)];
          const [d1, d2] = [a - c1 * x, b - c2 * x];
          if ((d1 === 0 && d2 === 0) || Math.abs(d1) > 40 || Math.abs(d2) > 40 || a + b > 160) continue;
          const total = a + b;
          const names = rng.pick(["ABCO", "PQRS", "DEFO", "XYZW", "KLMN"]);
          const [A, B, C, O] = names.split("");
          const work = sumSteps(
            [
              [c1, d1],
              [c2, d2],
            ],
            total,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $m\\angle ${A}${O}${C} = ${total}^\\circ$. Find $x$.`,
                `如图，$m\\angle ${A}${O}${C} = ${total}^\\circ$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(total + d1 + d2, c1 + c2, -x), intOr(total, c1 + c2, a), a],
              solution: t(
                `By the Angle Addition Postulate, $m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$:${chain(...work)}`,
                `由角的加法公设，$m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$：${chain(...work)}`,
              ),
            }),
            figure: raysFigure(a, b, rng.pick([0, 10, 20]), names, angleLabel(c1, d1), angleLabel(c2, d2)),
          };
        }
      },
    },
    {
      id: "linear-pair-postulate",
      title: t("The Linear Pair Postulate", "邻补角公设"),
      explanation: t(
        "Two adjacent angles whose outer sides form a line are a **linear pair**. The **Linear Pair Postulate**: the angles of a linear pair are supplementary.\n\nIf a linear pair measures $(4x + 10)^\\circ$ and $(2x - 10)^\\circ$, then $(4x + 10) + (2x - 10) = 180$, so $6x = 180$ and $x = 30$. The first angle is $4 \\cdot 30 + 10 = 130^\\circ$.",
        "两个相邻的角，若它们的另外两边组成一条直线，就构成**邻补角**。**邻补角公设**：邻补角互补。\n\n若一对邻补角为 $(4x + 10)^\\circ$ 和 $(2x - 10)^\\circ$，则 $(4x + 10) + (2x - 10) = 180$，所以 $6x = 180$，$x = 30$。第一个角是 $4 \\cdot 30 + 10 = 130^\\circ$。",
      ),
      generate(rng) {
        const { x, c1, d1, c2, d2, m } = exprPair(rng, 180);
        const askFirst = rng.bool();
        const asked = askFirst ? m : 180 - m;
        const [ca, da] = askFirst ? [c1, d1] : [c2, d2];
        const base = rng.pick([0, 0, 10, -10]);
        const o: Point = [0, 0];
        const ray = dir(base + m);
        const work = sumSteps(
          [
            [c1, d1],
            [c2, d2],
          ],
          180,
        );
        return {
          ...numberProblem({
            prompt: t(
              `The two angles form a linear pair. Find the measure of the angle labeled $${angleTex(ca, da)}$.`,
              `这两个角是邻补角。求标为 $${angleTex(ca, da)}$ 的角的度数。`,
            ),
            answer: asked,
            form: "integer",
            unit: "°",
            wrong: [x, 180 - asked, 90 - asked > 0 ? 90 - asked : 2 * asked],
            solution: t(
              `By the Linear Pair Postulate, the angles add up to $180^\\circ$:${chain(...work)}Then $${linear(ca, da)} = ${ca} \\cdot ${x} ${da < 0 ? "-" : "+"} ${Math.abs(da)} = ${asked}$, so the angle is $${asked}^\\circ$.`,
              `由邻补角公设，两角之和为 $180^\\circ$：${chain(...work)}于是 $${linear(ca, da)} = ${ca} \\cdot ${x} ${da < 0 ? "-" : "+"} ${Math.abs(da)} = ${asked}$，所以这个角是 $${asked}^\\circ$。`,
            ),
          }),
          figure: figure(
            [
              { kind: "segment", a: dir(base + 180), b: dir(base) },
              { kind: "segment", a: o, b: ray },
              { kind: "arc", vertex: o, from: dir(base), to: ray, label: angleLabel(c1, d1), accent: true },
              { kind: "arc", vertex: o, from: ray, to: dir(base + 180), label: angleLabel(c2, d2), accent: true },
            ],
            `A line with a ray from a point on it, forming angles ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
            `一条直线和从直线上一点出发的一条射线，形成角 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
    {
      id: "naming-angle-postulates",
      title: t("Naming the postulate", "说出所用的公设"),
      explanation: t(
        "Each postulate fits a particular kind of statement:\n\n- **Angle Addition Postulate**: two adjacent angles add up to the angle they make together.\n- **Linear Pair Postulate**: a linear pair adds up to $180^\\circ$.\n- **Corresponding Angles Postulate**: *if* two parallel lines are cut by a transversal, *then* corresponding angles are congruent.\n- **Converse of the Corresponding Angles Postulate**: *if* corresponding angles are congruent, *then* the lines are parallel.\n\nThe postulate and its converse swap what is known and what is concluded: watch which one the statement starts from.",
        "每条公设对应一类结论：\n\n- **角的加法公设**：两个相邻角之和等于它们合成的角。\n- **邻补角公设**：邻补角之和为 $180^\\circ$。\n- **同位角公设**：*若*两条平行线被截线所截，*则*同位角全等。\n- **同位角公设的逆命题**：*若*同位角全等，*则*两直线平行。\n\n公设与它的逆命题交换了条件和结论：要看清结论是从什么出发得到的。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const solution = t(
          `This statement uses the ${reasons[postulateOptions[kind]!].en}: ${why[postulateOptions[kind]!].en}.`,
          `这个结论用的是${reasons[postulateOptions[kind]!]["zh-CN"]}：${why[postulateOptions[kind]!]["zh-CN"]}。`,
        );
        const question = (s: Text) => cat(t("Which postulate justifies the statement?", "下面的结论依据的是哪条公设？"), "\n\n", s);
        if (kind === 0) {
          const names = rng.pick(["ABCO", "PQRS", "DEFO", "XYZW", "KLMN"]);
          const [A, B, C, O] = names.split("");
          const [a, b] = [rng.int(20, 80), rng.int(20, 80)];
          return {
            ...choiceProblem({
              prompt: question(same(`$m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$`)),
              options: postulateOptions.map((r) => reasons[r]),
              correct: 0,
              solution,
            }),
            figure: raysFigure(a, b, rng.pick([0, 10, 20]), names, "", ""),
          };
        }
        const n = rng.int(1, 8);
        const statement = [
          supp(n, rng.bool() ? acrossT(n) : acrossLine(n)),
          t(
            `Since $\\ell \\parallel m$, $\\angle ${n} \\cong \\angle ${corr(n)}$.`,
            `因为 $\\ell \\parallel m$，所以 $\\angle ${n} \\cong \\angle ${corr(n)}$。`,
          ),
          t(
            `Since $\\angle ${n} \\cong \\angle ${corr(n)}$, $\\ell \\parallel m$.`,
            `因为 $\\angle ${n} \\cong \\angle ${corr(n)}$，所以 $\\ell \\parallel m$。`,
          ),
        ][kind - 1]!;
        return {
          ...choiceProblem({ prompt: question(statement), options: postulateOptions.map((r) => reasons[r]), correct: kind, solution }),
          figure: parallelFigure(rng, kind === 2),
        };
      },
    },
    {
      id: "making-lines-parallel",
      title: t("Making lines parallel", "使两直线平行"),
      explanation: t(
        "By the Converse of the Corresponding Angles Postulate, lines $\\ell$ and $m$ are parallel exactly when a pair of corresponding angles is congruent. To find the value of $x$ that makes them parallel, set the corresponding angles equal.\n\nIf corresponding angles measure $(3x + 15)^\\circ$ and $(5x - 25)^\\circ$, then $3x + 15 = 5x - 25$, so $40 = 2x$ and $x = 20$.",
        "由同位角公设的逆命题，当且仅当一对同位角全等时，直线 $\\ell$ 与 $m$ 平行。要求使它们平行的 $x$，令同位角相等。\n\n若一对同位角为 $(3x + 15)^\\circ$ 和 $(5x - 25)^\\circ$，则 $3x + 15 = 5x - 25$，所以 $40 = 2x$，$x = 20$。",
      ),
      keyPrerequisites: ["parallel-lines-and-transversals"],
      generate(rng) {
        const { x, c1, d1, c2, d2, m } = exprPair(rng, null, 45, 135);
        const n = rng.int(1, 4);
        return {
          ...numberProblem({
            prompt: t("For what value of $x$ are lines $\\ell$ and $m$ parallel?", "当 $x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？"),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [m, intOr(180 - d1 - d2, c1 + c2, -x), -x],
            solution: t(
              `The labeled angles are corresponding angles. By the Converse of the Corresponding Angles Postulate, $\\ell \\parallel m$ when they are congruent:${chain(...equalSteps(c1, d1, c2, d2))}`,
              `标出的两个角是同位角。由同位角公设的逆命题，当它们全等时 $\\ell \\parallel m$：${chain(...equalSteps(c1, d1, c2, d2))}`,
            ),
          }),
          figure: transversalFigure(
            thetaFor(n, m),
            pickTilt(rng),
            {
              labels: [
                [n, angleLabel(c1, d1)],
                [n + 4, angleLabel(c2, d2)],
              ],
              arrows: false,
              arcs: true,
            },
            `Lines ℓ and m cut by a transversal t, with corresponding angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
            `直线 ℓ 与 m 被截线 t 所截，一对同位角分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

const transversalTheorems: readonly Reason[] = ["vertical", "corr", "aia", "aea", "cia"];
const generalTheorems: readonly Reason[] = ["vertical", "congSupp", "congComp", "rightCong"];

export const identifyingAngleTheorems: TopicDef = {
  id: "identifying-angle-theorems",
  title: t("Identifying Angle Theorems", "认识角的定理"),
  summary: t(
    "Use the Vertical Angles, Congruent Supplements and Congruent Complements theorems and the theorems about parallel lines, and name the theorem behind a statement.",
    "运用对顶角定理、等角的补角（余角）相等定理以及平行线的定理，并说出一个结论所依据的定理。",
  ),
  prerequisites: ["identifying-angle-postulates"],
  encompasses: [{ topic: "identifying-angle-postulates", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    {
      id: "congruent-supplements-and-complements",
      title: t("Congruent supplements and complements", "等角的补角与余角"),
      explanation: t(
        "A **theorem** is a statement proved from postulates and earlier theorems.\n\n- **Congruent Supplements Theorem**: angles supplementary to the same angle (or to congruent angles) are congruent.\n- **Congruent Complements Theorem**: angles complementary to the same angle (or to congruent angles) are congruent.\n\nIf $\\angle 1$ and $\\angle 3$ are both supplementary to $\\angle 2$, with $m\\angle 1 = (2x + 10)^\\circ$ and $m\\angle 3 = (4x - 30)^\\circ$, then $2x + 10 = 4x - 30$, so $x = 20$.",
        "**定理**是由公设和已证明的定理推出的命题。\n\n- **等角的补角相等**：与同一个角（或相等的角）互补的两个角全等。\n- **等角的余角相等**：与同一个角（或相等的角）互余的两个角全等。\n\n若 $\\angle 1$ 与 $\\angle 3$ 都与 $\\angle 2$ 互补，$m\\angle 1 = (2x + 10)^\\circ$，$m\\angle 3 = (4x - 30)^\\circ$，则 $2x + 10 = 4x - 30$，所以 $x = 20$。",
      ),
      generate(rng) {
        const complement = rng.bool();
        const total = complement ? 90 : 180;
        const { x, c1, d1, c2, d2, m } = complement ? exprPair(rng, null, 15, 75) : exprPair(rng, null, 30, 150);
        const [a, b, c] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        const kind = complement ? t("complementary", "互余") : t("supplementary", "互补");
        const theorem = complement ? reasons.congComp : reasons.congSupp;
        return numberProblem({
          prompt: t(
            `$\\angle ${a}$ and $\\angle ${c}$ are ${kind.en}, and $\\angle ${b}$ and $\\angle ${c}$ are ${kind.en}. If $m\\angle ${a} = ${angleTex(c1, d1)}$ and $m\\angle ${b} = ${angleTex(c2, d2)}$, find $x$.`,
            `$\\angle ${a}$ 与 $\\angle ${c}$ ${kind["zh-CN"]}，$\\angle ${b}$ 与 $\\angle ${c}$ ${kind["zh-CN"]}。若 $m\\angle ${a} = ${angleTex(c1, d1)}$，$m\\angle ${b} = ${angleTex(c2, d2)}$，求 $x$。`,
          ),
          answer: x,
          form: "integer",
          solveFor: "x",
          wrong: [intOr(total - d1 - d2, c1 + c2, -x), m, -x],
          solution: t(
            `Both angles are ${kind.en} to $\\angle ${c}$, so by the ${theorem.en} they are congruent:${chain(...equalSteps(c1, d1, c2, d2))}`,
            `两个角都与 $\\angle ${c}$ ${kind["zh-CN"]}，由“${theorem["zh-CN"]}”，它们全等：${chain(...equalSteps(c1, d1, c2, d2))}`,
          ),
        });
      },
    },
    {
      id: "theorems-about-parallel-lines",
      title: t("Theorems about parallel lines", "关于平行线的定理"),
      explanation: t(
        "When two parallel lines are cut by a transversal, the Corresponding Angles Postulate leads to three theorems:\n\n- **Alternate Interior Angles Theorem**: alternate interior angles are congruent.\n- **Alternate Exterior Angles Theorem**: alternate exterior angles are congruent.\n- **Consecutive Interior Angles Theorem**: consecutive interior angles are supplementary.\n\nThe **Vertical Angles Theorem** needs no parallel lines: it relates angles at the same crossing.",
        "两条平行线被截线所截时，由同位角公设可以推出三个定理：\n\n- **内错角定理**：内错角全等。\n- **外错角定理**：外错角全等。\n- **同旁内角定理**：同旁内角互补。\n\n**对顶角定理**不需要平行线：它关系的是同一个交点处的角。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const pairs: readonly (readonly [number, number])[] = (
          [
            [
              [1, 4],
              [2, 3],
              [5, 8],
              [6, 7],
            ],
            [
              [1, 5],
              [2, 6],
              [3, 7],
              [4, 8],
            ],
            [
              [3, 6],
              [4, 5],
            ],
            [
              [1, 8],
              [2, 7],
            ],
            [
              [3, 5],
              [4, 6],
            ],
          ] satisfies (readonly [number, number])[][]
        )[kind]!;
        const pair = rng.pick(pairs);
        const [a, b] = rng.bool() ? pair : [pair[1], pair[0]];
        const statement = kind === 4 ? supp(a, b) : cong(a, b);
        const r = transversalTheorems[kind]!;
        return {
          ...choiceProblem({
            prompt: cat(
              t("Lines $\\ell$ and $m$ are parallel. Which justifies the statement?", "直线 $\\ell$ 与 $m$ 平行。下面的结论依据的是什么？"),
              "\n\n",
              statement,
            ),
            options: transversalTheorems.map((x) => reasons[x]),
            correct: kind,
            solution: t(
              `Angles $${a}$ and $${b}$ are ${["vertical angles", "corresponding angles", "alternate interior angles", "alternate exterior angles", "consecutive interior angles"][kind]}, so the statement follows from the ${reasons[r].en}.`,
              `角 $${a}$ 与角 $${b}$ 是${["对顶角", "同位角", "内错角", "外错角", "同旁内角"][kind]}，所以结论依据的是${reasons[r]["zh-CN"]}。`,
            ),
          }),
          figure: parallelFigure(rng, true),
        };
      },
    },
    {
      id: "naming-angle-theorems",
      title: t("Naming the theorem", "说出所用的定理"),
      explanation: t(
        "Four theorems conclude that two angles are congruent without any parallel lines:\n\n- **Vertical Angles Theorem**: vertical angles are congruent.\n- **Congruent Supplements Theorem**: angles supplementary to the same angle, or to congruent angles, are congruent.\n- **Congruent Complements Theorem**: the same for complementary angles.\n- **Right Angles Congruence Theorem**: all right angles are congruent.\n\nTo name the theorem, look at what the statement starts from.",
        "下面四个定理不需要平行线就能得出两个角全等：\n\n- **对顶角定理**：对顶角全等。\n- **等角的补角相等**：与同一个角或相等的角互补的两个角全等。\n- **等角的余角相等**：互余时同理。\n- **直角相等定理**：所有直角都全等。\n\n要说出所用的定理，先看结论是从什么条件出发的。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const [a, b, c, d] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
        const sameAngle = rng.bool();
        const rel = kind === 2 ? t("complementary", "互余") : t("supplementary", "互补");
        const statement = [
          t(
            `$\\angle ${a}$ and $\\angle ${b}$ are vertical angles, so $\\angle ${a} \\cong \\angle ${b}$.`,
            `$\\angle ${a}$ 与 $\\angle ${b}$ 是对顶角，所以 $\\angle ${a} \\cong \\angle ${b}$。`,
          ),
          null,
          null,
          t(
            `$\\angle ${a}$ and $\\angle ${b}$ are right angles, so $\\angle ${a} \\cong \\angle ${b}$.`,
            `$\\angle ${a}$ 与 $\\angle ${b}$ 都是直角，所以 $\\angle ${a} \\cong \\angle ${b}$。`,
          ),
        ][kind];
        const prompt = cat(
          t("Which theorem justifies the statement?", "下面的结论依据的是哪个定理？"),
          "\n\n",
          statement ??
            (sameAngle
              ? t(
                  `$\\angle ${a}$ and $\\angle ${c}$ are ${rel.en}, and $\\angle ${b}$ and $\\angle ${c}$ are ${rel.en}, so $\\angle ${a} \\cong \\angle ${b}$.`,
                  `$\\angle ${a}$ 与 $\\angle ${c}$ ${rel["zh-CN"]}，$\\angle ${b}$ 与 $\\angle ${c}$ ${rel["zh-CN"]}，所以 $\\angle ${a} \\cong \\angle ${b}$。`,
                )
              : t(
                  `$\\angle ${a}$ and $\\angle ${c}$ are ${rel.en}, $\\angle ${b}$ and $\\angle ${d}$ are ${rel.en}, and $\\angle ${c} \\cong \\angle ${d}$, so $\\angle ${a} \\cong \\angle ${b}$.`,
                  `$\\angle ${a}$ 与 $\\angle ${c}$ ${rel["zh-CN"]}，$\\angle ${b}$ 与 $\\angle ${d}$ ${rel["zh-CN"]}，且 $\\angle ${c} \\cong \\angle ${d}$，所以 $\\angle ${a} \\cong \\angle ${b}$。`,
                )),
        );
        const r = generalTheorems[kind]!;
        return choiceProblem({
          prompt,
          options: generalTheorems.map((x) => reasons[x]),
          correct: kind,
          solution: t(
            `The statement follows from the ${reasons[r].en}: ${why[r].en}.`,
            `结论依据的是“${reasons[r]["zh-CN"]}”：${why[r]["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

/** alternateProof proves that alternate interior (or exterior) angles are congruent when ℓ ∥ m. */
function alternateProof(rng: Rng, exterior: boolean): Proof {
  const pair = rng.pick<readonly [number, number]>(
    exterior
      ? [
          [1, 8],
          [2, 7],
        ]
      : [
          [3, 6],
          [4, 5],
        ],
  );
  const [a, b] = rng.bool() ? pair : [pair[1], pair[0]];
  const theorem: Reason = exterior ? "aea" : "aia";
  const middle: Step[] = rng.bool()
    ? [
        { s: cong(a, corr(a)), r: "corr", wrong: wrongCong(a, corr(a)) },
        { s: cong(corr(a), b), r: "vertical", wrong: wrongCong(corr(a), b) },
      ]
    : [
        { s: cong(a, vert(a)), r: "vertical", wrong: wrongCong(a, vert(a)) },
        { s: cong(vert(a), b), r: "corr", wrong: wrongCong(vert(a), b) },
      ];
  return {
    given: parallel,
    prove: cong(a, b),
    steps: [{ s: parallel, r: "given" }, ...middle, { s: cong(a, b), r: "transitive", wrong: wrongCong(a, b) }],
    figure: parallelFigure(rng, true),
    distract: (["corrConv", "linearPair", "congSupp", "reflexive", "symmetric", "aia", "aea", "cia"] as Reason[]).filter(
      (r) => r !== theorem,
    ),
  };
}

/** alternateConverseProof proves ℓ ∥ m from congruent alternate interior (or exterior) angles. */
function alternateConverseProof(rng: Rng, exterior: boolean): Proof {
  const pair = rng.pick<readonly [number, number]>(
    exterior
      ? [
          [1, 8],
          [2, 7],
        ]
      : [
          [3, 6],
          [4, 5],
        ],
  );
  const [a, b] = rng.bool() ? pair : [pair[1], pair[0]];
  const middle: Step[] = rng.bool()
    ? [
        { s: cong(b, vert(b)), r: "vertical", wrong: wrongCong(b, vert(b)) },
        { s: cong(a, vert(b)), r: "transitive", wrong: wrongCong(a, vert(b)) },
      ]
    : [
        { s: cong(vert(a), a), r: "vertical", wrong: wrongCong(vert(a), a) },
        { s: cong(vert(a), b), r: "transitive", wrong: wrongCong(vert(a), b) },
      ];
  return {
    given: cong(a, b),
    prove: parallel,
    steps: [{ s: cong(a, b), r: "given" }, ...middle, { s: parallel, r: "corrConv", wrong: wrongParallel }],
    figure: parallelFigure(rng, false),
    distract: ["corr", "aia", "aea", "linearPair", "reflexive", "congSupp", "symmetric"],
  };
}

/** consecutiveProof proves that consecutive interior angles are supplementary when ℓ ∥ m. */
function consecutiveProof(rng: Rng): Proof {
  const pair = rng.pick<readonly [number, number]>([
    [3, 5],
    [4, 6],
  ]);
  const [a, b] = rng.bool() ? pair : [pair[1], pair[0]];
  const c = corr(a);
  return {
    given: parallel,
    prove: supp(a, b),
    steps: [
      { s: parallel, r: "given" },
      { s: cong(a, c), r: "corr", wrong: wrongCong(a, c) },
      { s: eqm(a, c), r: "defCong", wrong: wrongEq(a, c) },
      { s: supp(c, b), r: "linearPair", wrong: wrongSupp(c, b) },
      { s: supp(a, b), r: "subst", wrong: wrongSupp(a, b) },
    ],
    figure: parallelFigure(rng, true),
    distract: ["vertical", "aia", "congSupp", "transitive", "corrConv", "angleAdd"],
  };
}

/** consecutiveConverseProof proves ℓ ∥ m from supplementary consecutive interior angles. */
function consecutiveConverseProof(rng: Rng): Proof {
  const pair = rng.pick<readonly [number, number]>([
    [3, 5],
    [4, 6],
  ]);
  const [a, b] = rng.bool() ? pair : [pair[1], pair[0]];
  const c = corr(a);
  return {
    given: supp(a, b),
    prove: parallel,
    steps: [
      { s: supp(a, b), r: "given" },
      { s: supp(c, b), r: "linearPair", wrong: wrongSupp(c, b) },
      { s: cong(a, c), r: "congSupp", wrong: wrongCong(a, c) },
      { s: parallel, r: "corrConv", wrong: wrongParallel },
    ],
    figure: parallelFigure(rng, false),
    distract: ["corr", "cia", "congComp", "vertical", "transitive", "subst", "aia"],
  };
}

const proofExplanation = t(
  "A **two-column proof** lists statements in one column and the reason for each in the other. Each reason is given information, a definition, a property, a postulate or a theorem proved earlier.\n\nTo complete a step, ask what the step needs: a statement that follows from the steps above it, and the rule that makes it follow.",
  "**两栏式证明**一栏写陈述，另一栏写每个陈述的理由。理由可以是已知条件、定义、性质、公设或已证明的定理。\n\n要补全一步，就要想清楚：这一步的陈述必须能由前面的步骤推出，理由就是使它成立的那条规则。",
);

export const provingAlternateAngleTheorems: TopicDef = {
  id: "proving-alternate-angle-theorems",
  title: t("Proving Alternate Angle Theorems", "证明内错角与外错角定理"),
  summary: t(
    "Complete proofs that parallel lines make alternate interior and alternate exterior angles congruent.",
    "补全“两直线平行，内错角全等、外错角全等”的证明。",
  ),
  prerequisites: ["identifying-angle-theorems"],
  encompasses: [{ topic: "identifying-angle-theorems", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "alternate-interior-reasons",
      t("Reasons in the proof", "证明中的理由"),
      cat(
        proofExplanation,
        "\n\n",
        t(
          "**Alternate Interior Angles Theorem.** Given $\\ell \\parallel m$, prove $\\angle 3 \\cong \\angle 6$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 3 \\cong \\angle 7$ — Corresponding Angles Postulate\n3. $\\angle 7 \\cong \\angle 6$ — Vertical Angles Theorem\n4. $\\angle 3 \\cong \\angle 6$ — Transitive Property of Congruence",
          "**内错角定理。** 已知 $\\ell \\parallel m$，求证 $\\angle 3 \\cong \\angle 6$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 3 \\cong \\angle 7$ — 同位角公设\n3. $\\angle 7 \\cong \\angle 6$ — 对顶角定理\n4. $\\angle 3 \\cong \\angle 6$ — 全等的传递性",
        ),
      ),
      "r",
      (rng) => alternateProof(rng, false),
    ),
    proofKp(
      "alternate-interior-statements",
      t("Statements in the proof", "证明中的陈述"),
      t(
        "Each statement must follow from the ones above it by its reason. In the proof that alternate interior angles are congruent, the path goes through a third angle: one corresponding to the first angle and vertical to the second (or the other way round), and the Transitive Property joins the two congruences.\n\nFor $\\angle 4$ and $\\angle 5$: $\\angle 4 \\cong \\angle 8$ (corresponding), $\\angle 8 \\cong \\angle 5$ (vertical), so $\\angle 4 \\cong \\angle 5$.",
        "每个陈述都要能由前面的陈述按它的理由推出。在证明内错角全等时，要经过第三个角：它与第一个角是同位角，与第二个角是对顶角（或反过来），再用传递性把两个全等连起来。\n\n对 $\\angle 4$ 与 $\\angle 5$：$\\angle 4 \\cong \\angle 8$（同位角），$\\angle 8 \\cong \\angle 5$（对顶角），所以 $\\angle 4 \\cong \\angle 5$。",
      ),
      "s",
      (rng) => alternateProof(rng, false),
    ),
    proofKp(
      "alternate-exterior-proof",
      t("The Alternate Exterior Angles Theorem", "外错角定理"),
      t(
        "The proof that alternate exterior angles are congruent follows the same pattern. Given $\\ell \\parallel m$, prove $\\angle 1 \\cong \\angle 8$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 1 \\cong \\angle 5$ — Corresponding Angles Postulate\n3. $\\angle 5 \\cong \\angle 8$ — Vertical Angles Theorem\n4. $\\angle 1 \\cong \\angle 8$ — Transitive Property of Congruence",
        "外错角全等的证明思路相同。已知 $\\ell \\parallel m$，求证 $\\angle 1 \\cong \\angle 8$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 1 \\cong \\angle 5$ — 同位角公设\n3. $\\angle 5 \\cong \\angle 8$ — 对顶角定理\n4. $\\angle 1 \\cong \\angle 8$ — 全等的传递性",
      ),
      "rs",
      (rng) => alternateProof(rng, true),
    ),
  ],
};

export const provingAlternateAngleConverses: TopicDef = {
  id: "proving-alternate-angle-converses",
  title: t("Further Proving Alternate Angle Theorems", "证明内错角与外错角定理的逆定理"),
  summary: t(
    "Complete proofs that congruent alternate interior or alternate exterior angles make lines parallel, and use the converses.",
    "补全“内错角或外错角全等，则两直线平行”的证明，并运用这些逆定理。",
  ),
  prerequisites: ["proving-alternate-angle-theorems"],
  encompasses: [{ topic: "proving-alternate-angle-theorems", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "alternate-interior-converse-reasons",
      t("Proving lines parallel", "证明两直线平行"),
      t(
        "The **converse** of a theorem swaps its hypothesis and conclusion. The **Converse of the Alternate Interior Angles Theorem**: if alternate interior angles are congruent, the lines are parallel. It is proved from the Converse of the Corresponding Angles Postulate.\n\nGiven $\\angle 3 \\cong \\angle 6$, prove $\\ell \\parallel m$:\n\n1. $\\angle 3 \\cong \\angle 6$ — Given\n2. $\\angle 6 \\cong \\angle 7$ — Vertical Angles Theorem\n3. $\\angle 3 \\cong \\angle 7$ — Transitive Property of Congruence\n4. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate\n\nThe Corresponding Angles Postulate itself cannot be used: it needs $\\ell \\parallel m$, which is what we are proving.",
        "定理的**逆定理**交换了它的条件和结论。**内错角定理的逆定理**：若内错角全等，则两直线平行。它由同位角公设的逆命题证明。\n\n已知 $\\angle 3 \\cong \\angle 6$，求证 $\\ell \\parallel m$：\n\n1. $\\angle 3 \\cong \\angle 6$ — 已知\n2. $\\angle 6 \\cong \\angle 7$ — 对顶角定理\n3. $\\angle 3 \\cong \\angle 7$ — 全等的传递性\n4. $\\ell \\parallel m$ — 同位角公设的逆命题\n\n这里不能用同位角公设本身：它需要 $\\ell \\parallel m$，而这正是要证明的。",
      ),
      "r",
      (rng) => alternateConverseProof(rng, false),
    ),
    proofKp(
      "alternate-exterior-converse-proof",
      t("The converse for alternate exterior angles", "外错角定理的逆定理"),
      t(
        "The **Converse of the Alternate Exterior Angles Theorem** is proved the same way: from congruent alternate exterior angles, a vertical angle gives a congruent pair of corresponding angles, and the Converse of the Corresponding Angles Postulate concludes $\\ell \\parallel m$.\n\nGiven $\\angle 2 \\cong \\angle 7$: $\\angle 7 \\cong \\angle 6$ (vertical), so $\\angle 2 \\cong \\angle 6$ (transitive), and $\\angle 2$ and $\\angle 6$ are corresponding, so $\\ell \\parallel m$.",
        "**外错角定理的逆定理**的证明方法相同：由全等的外错角，借助对顶角得到一对全等的同位角，再由同位角公设的逆命题得出 $\\ell \\parallel m$。\n\n已知 $\\angle 2 \\cong \\angle 7$：$\\angle 7 \\cong \\angle 6$（对顶角），所以 $\\angle 2 \\cong \\angle 6$（传递性），而 $\\angle 2$ 与 $\\angle 6$ 是同位角，所以 $\\ell \\parallel m$。",
      ),
      "rs",
      (rng) => alternateConverseProof(rng, true),
    ),
    {
      id: "values-that-make-lines-parallel",
      title: t("Values that make lines parallel", "使两直线平行的取值"),
      explanation: t(
        "By the converses, $\\ell \\parallel m$ when alternate interior (or alternate exterior) angles are congruent. Set the two expressions equal and solve.\n\nIf alternate exterior angles measure $(4x - 12)^\\circ$ and $(2x + 30)^\\circ$, then $4x - 12 = 2x + 30$, so $2x = 42$ and $x = 21$.",
        "由逆定理，当内错角（或外错角）全等时 $\\ell \\parallel m$。令两个式子相等并求解。\n\n若一对外错角为 $(4x - 12)^\\circ$ 和 $(2x + 30)^\\circ$，则 $4x - 12 = 2x + 30$，所以 $2x = 42$，$x = 21$。",
      ),
      generate(rng) {
        const exterior = rng.bool();
        const pair = rng.pick<readonly [number, number]>(
          exterior
            ? [
                [1, 8],
                [2, 7],
              ]
            : [
                [3, 6],
                [4, 5],
              ],
        );
        const { x, c1, d1, c2, d2, m } = exprPair(rng, null, 45, 135);
        const name = exterior ? t("alternate exterior", "外错角") : t("alternate interior", "内错角");
        return {
          ...numberProblem({
            prompt: t("For what value of $x$ are lines $\\ell$ and $m$ parallel?", "当 $x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？"),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [m, intOr(180 - d1 - d2, c1 + c2, -x), -x],
            solution: t(
              `The labeled angles are ${name.en} angles. By the converse of the ${name.en} angles theorem, $\\ell \\parallel m$ when they are congruent:${chain(...equalSteps(c1, d1, c2, d2))}`,
              `标出的两个角是${name["zh-CN"]}。由${name["zh-CN"]}定理的逆定理，当它们全等时 $\\ell \\parallel m$：${chain(...equalSteps(c1, d1, c2, d2))}`,
            ),
          }),
          figure: transversalFigure(
            thetaFor(pair[0], m),
            pickTilt(rng),
            {
              labels: [
                [pair[0], angleLabel(c1, d1)],
                [pair[1], angleLabel(c2, d2)],
              ],
              arrows: false,
              arcs: true,
            },
            `Lines ℓ and m cut by a transversal t, with ${name.en} angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
            `直线 ℓ 与 m 被截线 t 所截，一对${name["zh-CN"]}分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

export const provingConsecutiveAngleTheorems: TopicDef = {
  id: "proving-consecutive-angle-theorems",
  title: t("Proving Consecutive Angle Theorems", "证明同旁内角定理"),
  summary: t(
    "Complete the proof that parallel lines make consecutive interior angles supplementary, and use the theorem.",
    "补全“两直线平行，同旁内角互补”的证明，并运用这个定理。",
  ),
  prerequisites: ["proving-alternate-angle-theorems"],
  encompasses: [{ topic: "proving-alternate-angle-theorems", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "consecutive-interior-reasons",
      t("Reasons in the proof", "证明中的理由"),
      t(
        "**Consecutive Interior Angles Theorem.** Given $\\ell \\parallel m$, prove $m\\angle 3 + m\\angle 5 = 180^\\circ$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 3 \\cong \\angle 7$ — Corresponding Angles Postulate\n3. $m\\angle 3 = m\\angle 7$ — Definition of congruent angles\n4. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — Linear Pair Postulate\n5. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — Substitution Property of Equality\n\nStep 3 turns a congruence of angles into an equation of measures, so that step 5 can substitute $m\\angle 3$ for $m\\angle 7$.",
        "**同旁内角定理。** 已知 $\\ell \\parallel m$，求证 $m\\angle 3 + m\\angle 5 = 180^\\circ$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 3 \\cong \\angle 7$ — 同位角公设\n3. $m\\angle 3 = m\\angle 7$ — 角全等的定义\n4. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — 邻补角公设\n5. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — 等量代换\n\n第 3 步把角的全等变成度数的等式，第 5 步才能用 $m\\angle 3$ 替换 $m\\angle 7$。",
      ),
      "r",
      consecutiveProof,
    ),
    proofKp(
      "consecutive-interior-statements",
      t("Statements in the proof", "证明中的陈述"),
      t(
        "The proof joins a congruence and a linear pair. The angle corresponding to the first consecutive interior angle forms a linear pair with the second one; substituting equal measures turns that linear pair into the statement to prove.\n\nFor $\\angle 4$ and $\\angle 6$: $\\angle 4 \\cong \\angle 8$, so $m\\angle 4 = m\\angle 8$; $m\\angle 8 + m\\angle 6 = 180^\\circ$; so $m\\angle 4 + m\\angle 6 = 180^\\circ$.",
        "证明把一个全等和一对邻补角结合起来。与第一个同旁内角成同位角的那个角，和第二个角构成邻补角；用相等的度数代换，就得到要证明的结论。\n\n对 $\\angle 4$ 与 $\\angle 6$：$\\angle 4 \\cong \\angle 8$，所以 $m\\angle 4 = m\\angle 8$；$m\\angle 8 + m\\angle 6 = 180^\\circ$；所以 $m\\angle 4 + m\\angle 6 = 180^\\circ$。",
      ),
      "s",
      consecutiveProof,
    ),
    {
      id: "using-consecutive-interior-angles",
      title: t("Using consecutive interior angles", "运用同旁内角"),
      explanation: t(
        "With $\\ell \\parallel m$, consecutive interior angles add up to $180^\\circ$. When their measures are expressions, solve for $x$ and substitute back.\n\nIf they measure $(3x + 20)^\\circ$ and $(2x - 15)^\\circ$, then $5x + 5 = 180$, so $x = 35$, and the first angle is $3 \\cdot 35 + 20 = 125^\\circ$.",
        "当 $\\ell \\parallel m$ 时，同旁内角之和为 $180^\\circ$。当度数用式子表示时，先解出 $x$ 再代回。\n\n若它们为 $(3x + 20)^\\circ$ 和 $(2x - 15)^\\circ$，则 $5x + 5 = 180$，所以 $x = 35$，第一个角是 $3 \\cdot 35 + 20 = 125^\\circ$。",
      ),
      generate(rng) {
        const pair = rng.pick<readonly [number, number]>([
          [3, 5],
          [4, 6],
        ]);
        const { x, c1, d1, c2, d2, m } = exprPair(rng, 180, 45, 135);
        const askFirst = rng.bool();
        const asked = askFirst ? m : 180 - m;
        const [ca, da] = askFirst ? [c1, d1] : [c2, d2];
        const work = sumSteps(
          [
            [c1, d1],
            [c2, d2],
          ],
          180,
        );
        return {
          ...numberProblem({
            prompt: t(
              `Lines $\\ell$ and $m$ are parallel. Find the measure of the angle labeled $${angleTex(ca, da)}$.`,
              `直线 $\\ell$ 与 $m$ 平行。求标为 $${angleTex(ca, da)}$ 的角的度数。`,
            ),
            answer: asked,
            form: "integer",
            unit: "°",
            wrong: [x, 180 - asked, intOr(d2 - d1, c1 - c2, 2 * asked)],
            solution: t(
              `The angles are consecutive interior angles, so they are supplementary:${chain(...work)}So the angle is $${linear(ca, da)} = ${asked}^\\circ$.`,
              `这两个角是同旁内角，所以互补：${chain(...work)}所以这个角是 $${linear(ca, da)} = ${asked}^\\circ$。`,
            ),
          }),
          figure: transversalFigure(
            thetaFor(pair[0], m),
            pickTilt(rng),
            {
              labels: [
                [pair[0], angleLabel(c1, d1)],
                [pair[1], angleLabel(c2, d2)],
              ],
              arrows: true,
              arcs: true,
            },
            `Parallel lines ℓ and m cut by a transversal t, with consecutive interior angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
            `平行线 ℓ 与 m 被截线 t 所截，一对同旁内角分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

export const provingConsecutiveAngleConverse: TopicDef = {
  id: "proving-consecutive-angle-converse",
  title: t("Further Proving Consecutive Angle Theorems", "证明同旁内角定理的逆定理"),
  summary: t(
    "Complete the proof that supplementary consecutive interior angles make lines parallel, and decide whether lines are parallel.",
    "补全“同旁内角互补，则两直线平行”的证明，并判断两直线是否平行。",
  ),
  prerequisites: ["proving-consecutive-angle-theorems", "proving-alternate-angle-converses"],
  encompasses: [
    { topic: "proving-consecutive-angle-theorems", weight: 0.3 },
    { topic: "proving-alternate-angle-converses", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "consecutive-converse-reasons",
      t("Reasons in the proof", "证明中的理由"),
      t(
        "**Converse of the Consecutive Interior Angles Theorem**: if consecutive interior angles are supplementary, the lines are parallel.\n\nGiven $m\\angle 3 + m\\angle 5 = 180^\\circ$, prove $\\ell \\parallel m$:\n\n1. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — Given\n2. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — Linear Pair Postulate\n3. $\\angle 3 \\cong \\angle 7$ — Congruent Supplements Theorem\n4. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate\n\nBoth $\\angle 3$ and $\\angle 7$ are supplementary to $\\angle 5$, so they are congruent.",
        "**同旁内角定理的逆定理**：若同旁内角互补，则两直线平行。\n\n已知 $m\\angle 3 + m\\angle 5 = 180^\\circ$，求证 $\\ell \\parallel m$：\n\n1. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — 已知\n2. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — 邻补角公设\n3. $\\angle 3 \\cong \\angle 7$ — 同角（或等角）的补角相等\n4. $\\ell \\parallel m$ — 同位角公设的逆命题\n\n$\\angle 3$ 与 $\\angle 7$ 都与 $\\angle 5$ 互补，所以它们全等。",
      ),
      "r",
      consecutiveConverseProof,
    ),
    proofKp(
      "consecutive-converse-statements",
      t("Statements in the proof", "证明中的陈述"),
      t(
        "To use the Congruent Supplements Theorem, the proof first needs a second angle supplementary to the same angle: the linear pair partner of one of the consecutive interior angles. That partner corresponds to the other consecutive interior angle.\n\nGiven $m\\angle 4 + m\\angle 6 = 180^\\circ$: $m\\angle 8 + m\\angle 6 = 180^\\circ$ (linear pair), so $\\angle 4 \\cong \\angle 8$, and these are corresponding angles, so $\\ell \\parallel m$.",
        "要用“等角的补角相等”，证明先要找到与同一个角互补的另一个角：某个同旁内角的邻补角。这个邻补角与另一个同旁内角是同位角。\n\n已知 $m\\angle 4 + m\\angle 6 = 180^\\circ$：$m\\angle 8 + m\\angle 6 = 180^\\circ$（邻补角），所以 $\\angle 4 \\cong \\angle 8$，它们是同位角，所以 $\\ell \\parallel m$。",
      ),
      "s",
      consecutiveConverseProof,
    ),
    {
      id: "deciding-whether-lines-are-parallel",
      title: t("Deciding whether lines are parallel", "判断两直线是否平行"),
      explanation: t(
        "The converses decide whether two lines cut by a transversal are parallel:\n\n- corresponding, alternate interior or alternate exterior angles congruent $\\Rightarrow$ parallel;\n- consecutive interior angles supplementary $\\Rightarrow$ parallel.\n\nIf consecutive interior angles measure $118^\\circ$ and $72^\\circ$, their sum is $190^\\circ \\ne 180^\\circ$, so the lines are not parallel.",
        "用逆定理可以判断被截线所截的两条直线是否平行：\n\n- 同位角、内错角或外错角全等 $\\Rightarrow$ 平行；\n- 同旁内角互补 $\\Rightarrow$ 平行。\n\n若一对同旁内角为 $118^\\circ$ 和 $72^\\circ$，它们的和是 $190^\\circ \\ne 180^\\circ$，所以两直线不平行。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const pairs: readonly (readonly [number, number])[] = (
          [
            [
              [1, 5],
              [2, 6],
              [3, 7],
              [4, 8],
            ],
            [
              [3, 6],
              [4, 5],
            ],
            [
              [1, 8],
              [2, 7],
            ],
            [
              [3, 5],
              [4, 6],
            ],
          ] satisfies (readonly [number, number])[][]
        )[kind]!;
        const [a, b] = rng.pick(pairs);
        const ma = rng.int(40, 140);
        const isParallel = rng.bool();
        const target = kind === 3 ? 180 - ma : ma;
        const mb = isParallel ? target : target + rng.pick([-6, -4, -3, -2, 2, 3, 4, 6]);
        const name = [
          t("corresponding", "同位角"),
          t("alternate interior", "内错角"),
          t("alternate exterior", "外错角"),
          t("consecutive interior", "同旁内角"),
        ][kind]!;
        const rule =
          kind === 3
            ? t(
                `they are parallel exactly when the angles add up to $180^\\circ$; here $${ma}^\\circ + ${mb}^\\circ = ${ma + mb}^\\circ$`,
                `当且仅当两角之和为 $180^\\circ$ 时平行；这里 $${ma}^\\circ + ${mb}^\\circ = ${ma + mb}^\\circ$`,
              )
            : t(
                `they are parallel exactly when the angles are congruent; here the angles are $${ma}^\\circ$ and $${mb}^\\circ$`,
                `当且仅当两角全等时平行；这里两个角是 $${ma}^\\circ$ 和 $${mb}^\\circ$`,
              );
        return {
          ...choiceProblem({
            prompt: t("Are lines $\\ell$ and $m$ parallel?", "直线 $\\ell$ 与 $m$ 平行吗？"),
            options: yesNo,
            correct: isParallel ? 0 : 1,
            solution: t(
              `The marked angles are ${name.en} angles, so ${rule.en}. ${isParallel ? "So $\\ell \\parallel m$." : "So $\\ell$ and $m$ are not parallel."}`,
              `标出的两个角是${name["zh-CN"]}，${rule["zh-CN"]}。${isParallel ? "所以 $\\ell \\parallel m$。" : "所以 $\\ell$ 与 $m$ 不平行。"}`,
            ),
          }),
          figure: transversalFigure(
            thetaFor(a, ma),
            pickTilt(rng),
            {
              labels: [
                [a, deg(ma)],
                [b, deg(mb)],
              ],
              arrows: false,
              arcs: true,
            },
            `Lines ℓ and m cut by a transversal t, with ${name.en} angles marked ${ma}° and ${mb}°.`,
            `直线 ℓ 与 m 被截线 t 所截，一对${name["zh-CN"]}分别标为 ${ma}° 和 ${mb}°。`,
          ),
        };
      },
    },
  ],
};

/** perpendicularFigure draws ℓ and m (or ℓ alone) cut at right angles by t, with angles numbered. */
function perpendicularFigure(rng: Rng, o: { arrows: boolean; single?: boolean; right?: readonly number[] }): Figure {
  return transversalFigure(
    90,
    pickTilt(rng) + rng.pick([0, 0, 30, -30]),
    { labels: numbered(o.single), arrows: o.arrows, ...(o.single && { single: true }), ...(o.right && { right: o.right }) },
    o.single
      ? "Lines ℓ and t crossing, with the four angles numbered 1 to 4."
      : `Lines ℓ and m${o.arrows ? ", marked parallel," : ""} cut by a transversal t, with the eight angles numbered 1 to 4 at ℓ and 5 to 8 at m.`,
    o.single
      ? "直线 ℓ 与 t 相交，四个角编号为 1 到 4。"
      : `直线 ℓ 与 m${o.arrows ? "（标为平行）" : ""}被截线 t 所截，八个角在 ℓ 处编号为 1 到 4，在 m 处编号为 5 到 8。`,
  );
}

const isRight = (n: number) => t(`$\\angle ${n}$ is a right angle`, `$\\angle ${n}$ 是直角`);
const wrongRight = (n: number) => [
  t(`$\\angle ${n}$ is an acute angle`, `$\\angle ${n}$ 是锐角`),
  t(`$\\angle ${n}$ is an obtuse angle`, `$\\angle ${n}$ 是钝角`),
  same(`$m\\angle ${n} = 180^\\circ$`),
];
const perp = (a: string, b: string) => same(`$${a} \\perp ${b}$`);

/** perpendicularTransversalProof proves that a transversal perpendicular to one of two parallel lines is perpendicular to the other. */
function perpendicularTransversalProof(rng: Rng): Proof {
  const a = rng.int(1, 8);
  const c = corr(a);
  const [first, second] = a <= 4 ? ["\\ell", "m"] : ["m", "\\ell"];
  return {
    given: cat(parallel, ", ", perp("t", first)),
    prove: perp("t", second),
    steps: [
      { s: parallel, r: "given" },
      { s: perp("t", first), r: "given" },
      { s: isRight(a), r: "defPerp", wrong: wrongRight(a) },
      {
        s: cong(a, c),
        r: "corr",
        wrong: [
          same(`$m\\angle ${a} + m\\angle ${c} = 90^\\circ$`),
          t(`$\\angle ${a}$ and $\\angle ${c}$ are vertical angles`, `$\\angle ${a}$ 与 $\\angle ${c}$ 是对顶角`),
          same(`$${first} \\perp ${second}$`),
        ],
      },
      { s: isRight(c), r: "defCong", wrong: wrongRight(c) },
      {
        s: perp("t", second),
        r: "defPerp",
        wrong: [same(`$t \\parallel ${second}$`), same("$\\ell \\perp m$"), same(`$t \\parallel ${first}$`)],
      },
    ],
    figure: perpendicularFigure(rng, { arrows: true, right: [a] }),
    distract: ["corrConv", "rightCong", "vertical", "linearPair", "aia", "transitive"],
  };
}

/** perpendicularToSameLineProof proves that two lines perpendicular to the same line are parallel. */
function perpendicularToSameLineProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const c = corr(a);
  return {
    given: cat(perp("\\ell", "t"), ", ", perp("m", "t")),
    prove: parallel,
    steps: [
      { s: perp("\\ell", "t"), r: "given" },
      { s: perp("m", "t"), r: "given" },
      { s: isRight(a), r: "defPerp", wrong: wrongRight(a) },
      { s: isRight(c), r: "defPerp", wrong: wrongRight(c) },
      {
        s: cong(a, c),
        r: "rightCong",
        wrong: [
          same(`$m\\angle ${a} + m\\angle ${c} = 90^\\circ$`),
          t(`$\\angle ${a}$ and $\\angle ${c}$ are vertical angles`, `$\\angle ${a}$ 与 $\\angle ${c}$ 是对顶角`),
          same("$\\ell \\perp m$"),
        ],
      },
      { s: parallel, r: "corrConv", wrong: wrongParallel },
    ],
    figure: perpendicularFigure(rng, { arrows: false }),
    distract: ["corr", "vertical", "linearPair", "congSupp", "aia", "transitive"],
  };
}

/** linearPairPerpendicularProof proves that lines forming a congruent linear pair are perpendicular. */
function linearPairPerpendicularProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const b = rng.bool() ? acrossT(a) : acrossLine(a);
  return {
    given: t(`$\\angle ${a} \\cong \\angle ${b}$, and they form a linear pair`, `$\\angle ${a} \\cong \\angle ${b}$，且它们是邻补角`),
    prove: perp("\\ell", "t"),
    steps: [
      {
        s: t(`$\\angle ${a} \\cong \\angle ${b}$, and they form a linear pair`, `$\\angle ${a} \\cong \\angle ${b}$，且它们是邻补角`),
        r: "given",
      },
      {
        s: supp(a, b),
        r: "linearPair",
        wrong: [
          same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
          same(`$m\\angle ${a} + m\\angle ${b} = 360^\\circ$`),
          same(`$m\\angle ${a} = 2m\\angle ${b}$`),
        ],
      },
      {
        s: eqm(a, b),
        r: "defCong",
        wrong: [
          same(`$m\\angle ${a} = 2m\\angle ${b}$`),
          same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
          same(`$m\\angle ${a} = 90^\\circ - m\\angle ${b}$`),
        ],
      },
      {
        s: same(`$2m\\angle ${a} = 180^\\circ$`),
        r: "subst",
        wrong: [same(`$m\\angle ${a} = 180^\\circ$`), same(`$2m\\angle ${a} = 90^\\circ$`), same(`$m\\angle ${a} + 2 = 180^\\circ$`)],
      },
      {
        s: same(`$m\\angle ${a} = 90^\\circ$`),
        r: "division",
        wrong: [same(`$m\\angle ${a} = 45^\\circ$`), same(`$m\\angle ${a} = 360^\\circ$`), same(`$m\\angle ${a} = 178^\\circ$`)],
      },
      {
        s: perp("\\ell", "t"),
        r: "defPerp",
        wrong: [same("$\\ell \\parallel t$"), same("$\\ell \\cong t$"), same(`$\\angle ${a} \\perp \\angle ${b}$`)],
      },
    ],
    figure: perpendicularFigure(rng, { arrows: false, single: true }),
    distract: ["congSupp", "vertical", "rightCong", "transitive", "angleAdd", "defBis"],
  };
}

export const provingPerpendicularLineTheorems: TopicDef = {
  id: "proving-perpendicular-line-theorems",
  title: t("Proving Perpendicular Line Theorems", "证明垂线的定理"),
  summary: t(
    "Complete proofs about perpendicular lines: the Perpendicular Transversal Theorem, lines perpendicular to the same line, and congruent linear pairs.",
    "补全关于垂线的证明：垂直于平行线之一的截线定理、垂直于同一直线的两直线，以及全等的邻补角。",
  ),
  prerequisites: ["proving-alternate-angle-converses"],
  encompasses: [{ topic: "proving-alternate-angle-converses", weight: 0.2 }],
  xp: 18,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "perpendicular-transversal-theorem",
      t("The Perpendicular Transversal Theorem", "垂直截线定理"),
      t(
        "Two lines are **perpendicular** ($\\perp$) when they meet at a right angle. **Perpendicular Transversal Theorem**: if a transversal is perpendicular to one of two parallel lines, it is perpendicular to the other.\n\nGiven $\\ell \\parallel m$ and $t \\perp \\ell$, prove $t \\perp m$:\n\n1. $\\ell \\parallel m$ — Given\n2. $t \\perp \\ell$ — Given\n3. $\\angle 1$ is a right angle — Definition of perpendicular lines\n4. $\\angle 1 \\cong \\angle 5$ — Corresponding Angles Postulate\n5. $\\angle 5$ is a right angle — Definition of congruent angles\n6. $t \\perp m$ — Definition of perpendicular lines",
        "两条直线相交成直角时**互相垂直**（$\\perp$）。**垂直截线定理**：若截线垂直于两条平行线中的一条，则它也垂直于另一条。\n\n已知 $\\ell \\parallel m$，$t \\perp \\ell$，求证 $t \\perp m$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $t \\perp \\ell$ — 已知\n3. $\\angle 1$ 是直角 — 垂直的定义\n4. $\\angle 1 \\cong \\angle 5$ — 同位角公设\n5. $\\angle 5$ 是直角 — 角全等的定义\n6. $t \\perp m$ — 垂直的定义",
      ),
      "rs",
      perpendicularTransversalProof,
    ),
    proofKp(
      "lines-perpendicular-to-the-same-line",
      t("Lines perpendicular to the same line", "垂直于同一直线的两直线"),
      t(
        "**Theorem**: in a plane, two lines perpendicular to the same line are parallel.\n\nGiven $\\ell \\perp t$ and $m \\perp t$, prove $\\ell \\parallel m$:\n\n1. $\\ell \\perp t$ — Given\n2. $m \\perp t$ — Given\n3. $\\angle 2$ is a right angle — Definition of perpendicular lines\n4. $\\angle 6$ is a right angle — Definition of perpendicular lines\n5. $\\angle 2 \\cong \\angle 6$ — Right Angles Congruence Theorem\n6. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate",
        "**定理**：在同一平面内，垂直于同一条直线的两条直线平行。\n\n已知 $\\ell \\perp t$，$m \\perp t$，求证 $\\ell \\parallel m$：\n\n1. $\\ell \\perp t$ — 已知\n2. $m \\perp t$ — 已知\n3. $\\angle 2$ 是直角 — 垂直的定义\n4. $\\angle 6$ 是直角 — 垂直的定义\n5. $\\angle 2 \\cong \\angle 6$ — 直角相等定理\n6. $\\ell \\parallel m$ — 同位角公设的逆命题",
      ),
      "rs",
      perpendicularToSameLineProof,
    ),
    proofKp(
      "congruent-linear-pairs",
      t("Congruent linear pairs", "全等的邻补角"),
      t(
        "**Theorem**: if two lines form a linear pair of congruent angles, the lines are perpendicular.\n\nGiven $\\angle 1 \\cong \\angle 2$, a linear pair, prove $\\ell \\perp t$:\n\n1. $\\angle 1 \\cong \\angle 2$, and they form a linear pair — Given\n2. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — Linear Pair Postulate\n3. $m\\angle 1 = m\\angle 2$ — Definition of congruent angles\n4. $2m\\angle 1 = 180^\\circ$ — Substitution Property of Equality\n5. $m\\angle 1 = 90^\\circ$ — Division Property of Equality\n6. $\\ell \\perp t$ — Definition of perpendicular lines",
        "**定理**：若两条直线形成一对全等的邻补角，则这两条直线互相垂直。\n\n已知 $\\angle 1 \\cong \\angle 2$ 且它们是邻补角，求证 $\\ell \\perp t$：\n\n1. $\\angle 1 \\cong \\angle 2$，且它们是邻补角 — 已知\n2. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — 邻补角公设\n3. $m\\angle 1 = m\\angle 2$ — 角全等的定义\n4. $2m\\angle 1 = 180^\\circ$ — 等量代换\n5. $m\\angle 1 = 90^\\circ$ — 等式的除法性质\n6. $\\ell \\perp t$ — 垂直的定义",
      ),
      "rs",
      linearPairPerpendicularProof,
    ),
    {
      id: "using-perpendicular-transversals",
      title: t("Using perpendicular transversals", "运用垂直截线"),
      explanation: t(
        "By the Perpendicular Transversal Theorem, a transversal perpendicular to one of two parallel lines makes right angles with the other as well. So any angle it forms with the other line measures $90^\\circ$.\n\nIf $\\ell \\parallel m$, $t \\perp \\ell$, and an angle between $t$ and $m$ measures $(4x - 10)^\\circ$, then $4x - 10 = 90$, so $x = 25$.",
        "由垂直截线定理，垂直于两条平行线之一的截线与另一条直线也成直角。所以它与另一条直线形成的任何角都是 $90^\\circ$。\n\n若 $\\ell \\parallel m$，$t \\perp \\ell$，$t$ 与 $m$ 之间的一个角为 $(4x - 10)^\\circ$，则 $4x - 10 = 90$，所以 $x = 25$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 30);
          const c = rng.int(2, 6);
          const d = 90 - c * x;
          if (d === 0 || Math.abs(d) > 60) continue;
          const a = rng.int(1, 4);
          const b = rng.int(5, 8);
          return {
            ...numberProblem({
              prompt: t(
                "Lines $\\ell$ and $m$ are parallel, and $t \\perp \\ell$ as marked. Find $x$.",
                "直线 $\\ell$ 与 $m$ 平行，且如图 $t \\perp \\ell$。求 $x$。",
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(180 - d, c, -x), intOr(90 + d, c, -x), 90],
              solution: t(
                `By the Perpendicular Transversal Theorem, $t \\perp m$, so the angle is a right angle:${chain(`${linear(c, d)} = 90`, `${linear(c, 0)} = ${90 - d}`, `x = ${x}`)}`,
                `由垂直截线定理，$t \\perp m$，所以这个角是直角：${chain(`${linear(c, d)} = 90`, `${linear(c, 0)} = ${90 - d}`, `x = ${x}`)}`,
              ),
            }),
            figure: transversalFigure(
              90,
              pickTilt(rng) + rng.pick([0, 30, -30]),
              { labels: [[b, angleLabel(c, d)]], arrows: true, right: [a], arcs: true },
              `Parallel lines ℓ and m cut by a transversal t, which makes a right angle with ℓ; an angle between t and m is marked ${angleLabel(c, d)}.`,
              `平行线 ℓ 与 m 被截线 t 所截，t 与 ℓ 成直角；t 与 m 之间的一个角标为 ${angleLabel(c, d)}。`,
            ),
          };
        }
      },
    },
  ],
};

// ─── Transformations ────────────────────────────────────────────────────────

type XY = readonly [number, number];

/** pl writes a point with integer or rational coordinates: "(3, -2)". */
const pl = (p: readonly (number | Q)[]) => pointLatex(p);

/** polygonMarks draws a polygon in the plane with its vertices named outward from its center. */
function polygonMarks(pts: readonly XY[], names: readonly string[], accent = true, dashed = false): PlaneMark[] {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [
    ...pts.map((p, i): PlaneMark => ({ kind: "segment", a: p, b: pts[(i + 1) % pts.length]!, accent, dashed })),
    ...pts.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i]!, dir: compassOf(directionOf([cx, cy], p)), accent })),
  ];
}

/** within tells whether every point lies in the square |x|, |y| ≤ lim. */
const within = (pts: readonly XY[], lim = 7) => pts.every((p) => Math.abs(p[0]) <= lim && Math.abs(p[1]) <= lim);

/** pickTriangle picks a triangle with integer vertices in a small box, not too thin. */
function pickTriangle(rng: Rng, lo = -5, hi = 5): [XY, XY, XY] {
  for (;;) {
    const pts = [0, 1, 2].map((): XY => [rng.int(lo, hi), rng.int(lo, hi)]) as [XY, XY, XY];
    const [a, b, c] = pts;
    const area2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
    const sides = [Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1]), Math.hypot(a[0] - c[0], a[1] - c[1])];
    if (area2 >= 6 && Math.min(...sides) >= 2 && Math.max(...sides) <= 7) return pts;
  }
}

/** pickPoint picks a point with nonzero coordinates of different sizes, so that rotations and reflections all move it somewhere different. */
function pickPoint(rng: Rng, lim = 6): XY {
  for (;;) {
    const p: XY = [rng.nonZero(-lim, lim), rng.nonZero(-lim, lim)];
    if (Math.abs(p[0]) !== Math.abs(p[1])) return p;
  }
}

/** shift describes a translation in words: "3 units left and 2 units up". */
function shift(h: number, v: number): Text {
  const en = [
    h !== 0 && `${Math.abs(h)} unit${Math.abs(h) === 1 ? "" : "s"} ${h > 0 ? "right" : "left"}`,
    v !== 0 && `${Math.abs(v)} unit${Math.abs(v) === 1 ? "" : "s"} ${v > 0 ? "up" : "down"}`,
  ].filter(Boolean);
  const zh = [
    h !== 0 && `向${h > 0 ? "右" : "左"} ${Math.abs(h)} 个单位`,
    v !== 0 && `向${v > 0 ? "上" : "下"} ${Math.abs(v)} 个单位`,
  ].filter(Boolean);
  return t(en.join(" and "), zh.join("，再"));
}

/** rule writes a translation rule (x, y) → (x + h, y + v). */
const translationRule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

const triangleNames = ["A", "B", "C"] as const;

export const translationsOfGeometricFigures: TopicDef = {
  id: "translations-of-geometric-figures",
  title: t("Translations of Geometric Figures", "图形的平移"),
  summary: t(
    "Translate points and figures in the coordinate plane, and find the translation that maps a point to its image.",
    "在坐标平面上平移点和图形，并求把一个点映到它的像的平移。",
  ),
  prerequisites: ["the-coordinate-plane", "subtracting-integers"],
  encompasses: [
    { topic: "the-coordinate-plane", weight: 0.3 },
    { topic: "subtracting-integers", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4"],
  knowledgePoints: [
    {
      id: "translating-a-point",
      title: t("Translating a point", "平移一个点"),
      explanation: t(
        "A **transformation** moves every point of the plane to a new position, its **image**; the original point is the **preimage**. The image of $P$ is written $P'$ (\"$P$ prime\").\n\nA **translation** slides every point the same distance in the same direction. Moving right adds to the $x$-coordinate, left subtracts; moving up adds to the $y$-coordinate, down subtracts.\n\nTranslating $P(2, -1)$ $4$ units left and $3$ units up gives $P'(2 - 4, -1 + 3) = P'(-2, 2)$.",
        "**变换**把平面上的每个点移到一个新位置，叫做它的**像**；原来的点叫**原像**。点 $P$ 的像记作 $P'$。\n\n**平移**把每个点沿同一方向移动相同的距离。向右移动加在 $x$ 坐标上，向左则减；向上移动加在 $y$ 坐标上，向下则减。\n\n把 $P(2, -1)$ 向左平移 $4$ 个单位、再向上平移 $3$ 个单位，得到 $P'(2 - 4, -1 + 3) = P'(-2, 2)$。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const name = rng.pick(["P", "A", "Q", "M"]);
        const d = shift(h, v);
        return pointProblem({
          prompt: t(
            `The point $${name}${pl([x, y])}$ is translated ${d.en}. Find the coordinates of its image $${name}'$.`,
            `把点 $${name}${pl([x, y])}$ ${d["zh-CN"]}。求它的像 $${name}'$ 的坐标。`,
          ),
          answer: [x + h, y + v],
          wrong: [
            [x - h, y - v],
            [x + v, y + h],
            [x + h, y - v],
          ],
          solution: t(
            `Add $${h}$ to the $x$-coordinate and $${v}$ to the $y$-coordinate:${steps(`${name}' = (${x} + ${h < 0 ? `(${h})` : h}, ${y} + ${v < 0 ? `(${v})` : v}) = ${pl([x + h, y + v])}`)}`,
            `把 $x$ 坐标加上 $${h}$，$y$ 坐标加上 $${v}$：${steps(`${name}' = (${x} + ${h < 0 ? `(${h})` : h}, ${y} + ${v < 0 ? `(${v})` : v}) = ${pl([x + h, y + v])}`)}`,
          ),
        });
      },
    },
    {
      id: "translation-rules",
      title: t("Translation rules", "平移的规则"),
      explanation: t(
        "A translation can be written as a **rule** that tells what happens to any point $(x, y)$. The translation $4$ units left and $2$ units up is\n\n$$(x, y) \\to (x - 4, y + 2).$$\n\nA translation moves a whole figure: each vertex moves by the rule, and the image figure has the same size and shape. Under this rule, the vertex $B(1, -3)$ of a triangle goes to $B'(1 - 4, -3 + 2) = B'(-3, -1)$.",
        "平移可以写成一条**规则**，说明任意点 $(x, y)$ 怎样变化。向左平移 $4$ 个单位、向上平移 $2$ 个单位的平移是\n\n$$(x, y) \\to (x - 4, y + 2)。$$\n\n平移会移动整个图形：每个顶点都按规则移动，像与原图形大小、形状都相同。按这条规则，三角形的顶点 $B(1, -3)$ 移到 $B'(1 - 4, -3 + 2) = B'(-3, -1)$。",
      ),
      generate(rng) {
        for (;;) {
          const tri = pickTriangle(rng);
          const [h, v] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
          const i = rng.int(0, 2);
          const [x, y] = tri[i]!;
          const name = triangleNames[i]!;
          if (!within([[x + h, y + v]], 9)) continue;
          return {
            ...pointProblem({
              prompt: t(
                `Triangle $ABC$ is translated by the rule $${translationRule(h, v)}$. Find the coordinates of $${name}'$.`,
                `三角形 $ABC$ 按规则 $${translationRule(h, v)}$ 平移。求 $${name}'$ 的坐标。`,
              ),
              answer: [x + h, y + v],
              wrong: [
                [x - h, y - v],
                [x + v, y + h],
                [h, v],
              ],
              solution: t(
                `From the figure, $${name} = ${pl([x, y])}$. Apply the rule:${steps(`${name}' = (${x} + ${h < 0 ? `(${h})` : h}, ${y} + ${v < 0 ? `(${v})` : v}) = ${pl([x + h, y + v])}`)}`,
                `由图，$${name} = ${pl([x, y])}$。应用规则：${steps(`${name}' = (${x} + ${h < 0 ? `(${h})` : h}, ${y} + ${v < 0 ? `(${v})` : v}) = ${pl([x + h, y + v])}`)}`,
              ),
            }),
            figure: graph(polygonMarks(tri, triangleNames), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
          };
        }
      },
    },
    {
      id: "finding-a-translation",
      title: t("Finding the translation", "求平移"),
      explanation: t(
        "To find the translation that maps $P$ to $P'$, subtract the coordinates of the preimage from those of the image: the rule is $(x, y) \\to (x + a, y + b)$ with\n\n$$a = x_{P'} - x_P, \\quad b = y_{P'} - y_P.$$\n\nIf $P(3, -2)$ maps to $P'(-1, 4)$, then $a = -1 - 3 = -4$ and $b = 4 - (-2) = 6$: the translation moves $4$ units left and $6$ units up.",
        "要求把 $P$ 映到 $P'$ 的平移，用像的坐标减去原像的坐标：规则是 $(x, y) \\to (x + a, y + b)$，其中\n\n$$a = x_{P'} - x_P, \\quad b = y_{P'} - y_P。$$\n\n若 $P(3, -2)$ 映到 $P'(-1, 4)$，则 $a = -1 - 3 = -4$，$b = 4 - (-2) = 6$：平移是向左 $4$ 个单位、向上 $6$ 个单位。",
      ),
      generate(rng) {
        for (;;) {
          const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
          const [a, b] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          if (!within([[x + a, y + b]], 7) || Math.abs(a) === Math.abs(b)) continue;
          return {
            ...pointProblem({
              prompt: t(
                `The translation $(x, y) \\to (x + a, y + b)$ maps $P$ to $P'$. Find $(a, b)$.`,
                `平移 $(x, y) \\to (x + a, y + b)$ 把 $P$ 映到 $P'$。求 $(a, b)$。`,
              ),
              answer: [a, b],
              vars: ["a", "b"],
              wrong: [
                [-a, -b],
                [b, a],
                [x + a, y + b],
              ],
              solution: t(
                `From the figure, $P = ${pl([x, y])}$ and $P' = ${pl([x + a, y + b])}$. Subtract the preimage from the image:${steps(`a = ${x + a} - ${x < 0 ? `(${x})` : x} = ${a}`, `b = ${y + b} - ${y < 0 ? `(${y})` : y} = ${b}`)}`,
                `由图，$P = ${pl([x, y])}$，$P' = ${pl([x + a, y + b])}$。用像减去原像：${steps(`a = ${x + a} - ${x < 0 ? `(${x})` : x} = ${a}`, `b = ${y + b} - ${y < 0 ? `(${y})` : y} = ${b}`)}`,
              ),
            }),
            figure: graph(
              [
                { kind: "point", at: [x, y], label: "P", dir: "n" },
                { kind: "point", at: [x + a, y + b], label: "P′", dir: "n", accent: true },
              ],
              "A point P and its image P′ on a coordinate grid.",
              "坐标网格上的点 P 和它的像 P′。",
            ),
          };
        }
      },
    },
    {
      id: "finding-the-preimage",
      title: t("Finding the preimage", "求原像"),
      explanation: t(
        "To undo a translation, apply the opposite translation. If $(x, y) \\to (x + 3, y - 5)$ maps $P$ to $P'(1, 2)$, then $P$ is found by subtracting $3$ and adding $5$:\n\n$$P = (1 - 3, 2 + 5) = (-2, 7).$$\n\nCheck: $(-2 + 3, 7 - 5) = (1, 2)$.",
        "要还原一次平移，就做相反的平移。若 $(x, y) \\to (x + 3, y - 5)$ 把 $P$ 映到 $P'(1, 2)$，则把坐标减去 $3$、加上 $5$ 得到 $P$：\n\n$$P = (1 - 3, 2 + 5) = (-2, 7)。$$\n\n检验：$(-2 + 3, 7 - 5) = (1, 2)$。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const [px, py] = [x + h, y + v];
        return pointProblem({
          prompt: t(
            `The translation $${translationRule(h, v)}$ maps $P$ to $P'${pl([px, py])}$. Find the coordinates of $P$.`,
            `平移 $${translationRule(h, v)}$ 把 $P$ 映到 $P'${pl([px, py])}$。求 $P$ 的坐标。`,
          ),
          answer: [x, y],
          wrong: [
            [px + h, py + v],
            [px - v, py - h],
            [px - h, py + v],
          ],
          solution: t(
            `Undo the translation by subtracting $${h}$ from $x$ and $${v}$ from $y$:${steps(`P = (${px} - ${h < 0 ? `(${h})` : h}, ${py} - ${v < 0 ? `(${v})` : v}) = ${pl([x, y])}`)}`,
            `把 $x$ 减去 $${h}$，$y$ 减去 $${v}$，还原平移：${steps(`P = (${px} - ${h < 0 ? `(${h})` : h}, ${py} - ${v < 0 ? `(${v})` : v}) = ${pl([x, y])}`)}`,
          ),
        });
      },
    },
  ],
};

/** Rotation is a rotation about the origin by a multiple of 90°, counterclockwise. */
type Quarter = 1 | 2 | 3;

/** rotQ rotates p by q quarter turns counterclockwise about the origin. */
function rotQ(p: XY, q: number): XY {
  let [x, y] = p;
  for (let i = 0; i < ((q % 4) + 4) % 4; i++) [x, y] = [-y, x];
  return [x + 0, y + 0];
}

/** rotationName names a rotation: "90° counterclockwise", "180°". */
const rotationName = (q: Quarter, clockwise = false): Text =>
  q === 2
    ? t("$180^\\circ$", "$180^\\circ$")
    : t(
        `$${q === 1 ? 90 : 270}^\\circ$ ${clockwise ? "clockwise" : "counterclockwise"}`,
        `${clockwise ? "顺时针" : "逆时针"} $${q === 1 ? 90 : 270}^\\circ$`,
      );

const rotationRules: readonly string[] = ["(x, y) \\to (-y, x)", "(x, y) \\to (-x, -y)", "(x, y) \\to (y, -x)"];

const rotationRuleText = t(
  "- $90^\\circ$ counterclockwise: $(x, y) \\to (-y, x)$\n- $180^\\circ$: $(x, y) \\to (-x, -y)$\n- $90^\\circ$ clockwise (that is, $270^\\circ$ counterclockwise): $(x, y) \\to (y, -x)$",
  "- 逆时针 $90^\\circ$：$(x, y) \\to (-y, x)$\n- $180^\\circ$：$(x, y) \\to (-x, -y)$\n- 顺时针 $90^\\circ$（即逆时针 $270^\\circ$）：$(x, y) \\to (y, -x)$",
);

export const rotationsOfGeometricFigures: TopicDef = {
  id: "rotations-of-geometric-figures",
  title: t("Rotations of Geometric Figures", "图形的旋转"),
  summary: t(
    "Rotate points by multiples of 90° about the origin and about other centers, and identify a rotation from a point and its image.",
    "把点绕原点或其他中心旋转 90° 的倍数，并由一个点和它的像判断旋转。",
  ),
  prerequisites: ["the-coordinate-plane", "angles-and-angle-measures"],
  encompasses: [{ topic: "the-coordinate-plane", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4", "CCSS.HSG.CO.A.5"],
  knowledgePoints: [
    {
      id: "quarter-turns",
      title: t("Rotating by 90°", "旋转 90°"),
      explanation: cat(
        t(
          "A **rotation** turns every point through the same angle about a fixed point, the **center of rotation**; each point keeps its distance from the center. Unless stated otherwise, rotations are counterclockwise.\n\nAbout the origin, a quarter turn swaps the coordinates and changes one sign:\n\n",
          "**旋转**把每个点绕一个固定点（**旋转中心**）转过同一个角度，每个点到中心的距离不变。如无特别说明，旋转都按逆时针方向。\n\n绕原点转四分之一圈时，两个坐标交换位置，并改变一个符号：\n\n",
        ),
        rotationRuleText,
        t(
          "\n\nRotating $P(4, 1)$ by $90^\\circ$ counterclockwise gives $P'(-1, 4)$; rotating it $90^\\circ$ clockwise gives $P'(1, -4)$.",
          "\n\n把 $P(4, 1)$ 逆时针旋转 $90^\\circ$ 得 $P'(-1, 4)$；顺时针旋转 $90^\\circ$ 得 $P'(1, -4)$。",
        ),
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const cw = rng.bool();
        const q: Quarter = cw ? 3 : 1;
        const image = rotQ(p, q);
        return {
          ...pointProblem({
            prompt: t(
              `Rotate $P${pl(p)}$ by $90^\\circ$ ${cw ? "clockwise" : "counterclockwise"} about the origin. Find $P'$.`,
              `把 $P${pl(p)}$ 绕原点${cw ? "顺时针" : "逆时针"}旋转 $90^\\circ$。求 $P'$。`,
            ),
            answer: image,
            wrong: [rotQ(p, 4 - q), rotQ(p, 2), [p[1], p[0]], [-p[0], p[1]]],
            solution: t(
              `A $90^\\circ$ ${cw ? "clockwise" : "counterclockwise"} rotation follows $${rotationRules[q - 1]}$:${steps(`P' = ${pl(image)}`)}`,
              `${cw ? "顺时针" : "逆时针"}旋转 $90^\\circ$ 的规则是 $${rotationRules[q - 1]}$：${steps(`P' = ${pl(image)}`)}`,
            ),
          }),
          figure: graph(
            [{ kind: "point", at: p, label: "P", dir: "n", accent: true }],
            "A point P on a coordinate grid.",
            "坐标网格上的点 P。",
          ),
        };
      },
    },
    {
      id: "half-and-three-quarter-turns",
      title: t("Rotating by 180° and 270°", "旋转 180° 与 270°"),
      explanation: t(
        "A $180^\\circ$ rotation about the origin changes both signs: $(x, y) \\to (-x, -y)$. It is the same clockwise or counterclockwise.\n\nA $270^\\circ$ counterclockwise rotation is the same as a $90^\\circ$ clockwise one: $(x, y) \\to (y, -x)$. Likewise $270^\\circ$ clockwise is $90^\\circ$ counterclockwise.\n\nRotating $(-3, 5)$ by $180^\\circ$ gives $(3, -5)$; by $270^\\circ$ counterclockwise, $(5, 3)$.",
        "绕原点旋转 $180^\\circ$ 时两个坐标都变号：$(x, y) \\to (-x, -y)$，顺时针、逆时针结果相同。\n\n逆时针旋转 $270^\\circ$ 等于顺时针旋转 $90^\\circ$：$(x, y) \\to (y, -x)$。同样，顺时针 $270^\\circ$ 等于逆时针 $90^\\circ$。\n\n把 $(-3, 5)$ 旋转 $180^\\circ$ 得 $(3, -5)$；逆时针旋转 $270^\\circ$ 得 $(5, 3)$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const kind = rng.int(0, 2);
        const q = [2, 3, 1][kind]!;
        const image = rotQ(p, q);
        const name = [
          t("$180^\\circ$", "$180^\\circ$"),
          t("$270^\\circ$ counterclockwise", "逆时针 $270^\\circ$"),
          t("$270^\\circ$ clockwise", "顺时针 $270^\\circ$"),
        ][kind]!;
        const same90 = [
          t("", ""),
          t(", the same as $90^\\circ$ clockwise", "，相当于顺时针 $90^\\circ$"),
          t(", the same as $90^\\circ$ counterclockwise", "，相当于逆时针 $90^\\circ$"),
        ][kind]!;
        return pointProblem({
          prompt: t(
            `Rotate $${pl(p)}$ by ${name.en} about the origin. Find the image.`,
            `把 $${pl(p)}$ 绕原点旋转${name["zh-CN"]}。求像的坐标。`,
          ),
          answer: image,
          wrong: [rotQ(p, 4 - q), rotQ(p, q + 2), [-p[0], p[1]]],
          solution: t(
            `A rotation of ${name.en}${same90.en} follows $${rotationRules[q - 1]}$:${steps(`${pl(p)} \\to ${pl(image)}`)}`,
            `旋转${name["zh-CN"]}${same90["zh-CN"]}，规则是 $${rotationRules[q - 1]}$：${steps(`${pl(p)} \\to ${pl(image)}`)}`,
          ),
        });
      },
    },
    {
      id: "identifying-a-rotation",
      title: t("Identifying a rotation", "判断旋转"),
      explanation: t(
        "To tell which rotation about the origin maps $P$ to $P'$, compare the coordinates with the three rules: a $180^\\circ$ rotation changes both signs; a $90^\\circ$ rotation swaps the coordinates and changes one sign.\n\n$P(2, 5) \\to P'(-5, 2)$ follows $(x, y) \\to (-y, x)$, a $90^\\circ$ counterclockwise rotation. $P(2, 5) \\to P'(5, -2)$ follows $(x, y) \\to (y, -x)$, a $90^\\circ$ clockwise rotation.",
        "要判断绕原点的哪种旋转把 $P$ 映到 $P'$，把坐标与三条规则对比：旋转 $180^\\circ$ 两个坐标都变号；旋转 $90^\\circ$ 交换坐标并改变一个符号。\n\n$P(2, 5) \\to P'(-5, 2)$ 符合 $(x, y) \\to (-y, x)$，是逆时针旋转 $90^\\circ$。$P(2, 5) \\to P'(5, -2)$ 符合 $(x, y) \\to (y, -x)$，是顺时针旋转 $90^\\circ$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 2);
        const image = rotQ(p, [1, 2, 3][k]!);
        const options = [rotationName(1), rotationName(2), rotationName(1, true)];
        return {
          ...choiceProblem({
            prompt: t(
              `A rotation about the origin maps $P${pl(p)}$ to $P'${pl(image)}$. Which rotation is it?`,
              `绕原点的一次旋转把 $P${pl(p)}$ 映到 $P'${pl(image)}$。这是哪种旋转？`,
            ),
            options,
            correct: k,
            solution: t(
              `The coordinates follow $${rotationRules[k]}$, so the rotation is ${options[k]!.en}.`,
              `坐标符合 $${rotationRules[k]}$，所以这是${options[k]!["zh-CN"]}的旋转。`,
            ),
          }),
          figure: graph(
            [
              { kind: "point", at: [0, 0], dir: "sw" },
              { kind: "point", at: p, label: "P", dir: "n" },
              { kind: "point", at: image, label: "P′", dir: "n", accent: true },
            ],
            "A point P and its image P′ under a rotation about the origin.",
            "点 P 和它绕原点旋转后的像 P′。",
          ),
        };
      },
    },
    {
      id: "rotating-about-another-center",
      title: t("Rotating about another center", "绕其他点旋转"),
      explanation: t(
        "To rotate $P$ about a center $C$ other than the origin:\n\n1. Find how $P$ sits relative to $C$: subtract, $(x_P - x_C, y_P - y_C)$.\n2. Rotate that offset with the rule for the origin.\n3. Add $C$ back.\n\nRotating $P(5, 3)$ by $90^\\circ$ counterclockwise about $C(2, 1)$: the offset is $(3, 2)$, it rotates to $(-2, 3)$, and adding $C$ gives $P'(0, 4)$.",
        "要把 $P$ 绕不是原点的中心 $C$ 旋转：\n\n1. 求 $P$ 相对于 $C$ 的位置：相减得 $(x_P - x_C, y_P - y_C)$。\n2. 用绕原点旋转的规则旋转这个差。\n3. 再加回 $C$。\n\n把 $P(5, 3)$ 绕 $C(2, 1)$ 逆时针旋转 $90^\\circ$：差是 $(3, 2)$，旋转后为 $(-2, 3)$，加上 $C$ 得 $P'(0, 4)$。",
      ),
      generate(rng) {
        for (;;) {
          const c: XY = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
          const off = pickPoint(rng, 4);
          const p: XY = [c[0] + off[0], c[1] + off[1]];
          const kind = rng.int(0, 2);
          const q = [1, 2, 3][kind]!;
          const r = rotQ(off, q);
          const image: XY = [c[0] + r[0], c[1] + r[1]];
          if (!within([p, image], 7)) continue;
          const name = [rotationName(1), rotationName(2), rotationName(1, true)][kind]!;
          return {
            ...pointProblem({
              prompt: t(
                `Rotate $P${pl(p)}$ by ${name.en} about $C${pl(c)}$. Find $P'$.`,
                `把 $P${pl(p)}$ 绕 $C${pl(c)}$ 旋转${name["zh-CN"]}。求 $P'$。`,
              ),
              answer: image,
              wrong: [rotQ(p, q), r, [c[0] + rotQ(off, 4 - q)[0], c[1] + rotQ(off, 4 - q)[1]]],
              solution: t(
                `The offset of $P$ from $C$ is $${pl(off)}$. Rotate it with $${rotationRules[q - 1]}$ to get $${pl(r)}$, then add $C$:${steps(`P' = (${c[0]} + ${r[0] < 0 ? `(${r[0]})` : r[0]}, ${c[1]} + ${r[1] < 0 ? `(${r[1]})` : r[1]}) = ${pl(image)}`)}`,
                `$P$ 相对于 $C$ 的差是 $${pl(off)}$。用 $${rotationRules[q - 1]}$ 旋转得 $${pl(r)}$，再加上 $C$：${steps(`P' = (${c[0]} + ${r[0] < 0 ? `(${r[0]})` : r[0]}, ${c[1]} + ${r[1] < 0 ? `(${r[1]})` : r[1]}) = ${pl(image)}`)}`,
              ),
            }),
            figure: graph(
              [
                { kind: "point", at: c, label: "C", dir: "sw" },
                { kind: "point", at: p, label: "P", dir: "n", accent: true },
              ],
              "A center of rotation C and a point P on a coordinate grid.",
              "坐标网格上的旋转中心 C 和点 P。",
            ),
          };
        }
      },
    },
  ],
};

const ruleOptions: readonly string[] = ["(x, y) \\to (-y, x)", "(x, y) \\to (y, -x)", "(x, y) \\to (-x, -y)", "(x, y) \\to (y, x)"];

/** rotationSymbol writes R with a signed angle: R_{90°} counterclockwise, R_{-90°} clockwise. */
const rotationSymbol = (angle: number) => `R_{${angle}^\\circ}`;

export const rotationRulesInTheCoordinatePlane: TopicDef = {
  id: "rotation-rules-in-the-coordinate-plane",
  title: t("Rotating Objects in the Coordinate Plane Using Functions", "用函数表示坐标平面中的旋转"),
  summary: t(
    "Describe rotations about the origin as functions of the coordinates, compose them, and invert them.",
    "把绕原点的旋转表示成坐标的函数，并做复合与求逆。",
  ),
  prerequisites: ["rotations-of-geometric-figures", "introduction-to-functions"],
  encompasses: [{ topic: "rotations-of-geometric-figures", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.5"],
  knowledgePoints: [
    {
      id: "choosing-a-rotation-rule",
      title: t("Rotations as functions", "把旋转看成函数"),
      explanation: t(
        "A transformation is a function: its input is a point and its output is the image. We write $R_{\\theta}$ for the rotation by $\\theta$ about the origin, counterclockwise when $\\theta > 0$ and clockwise when $\\theta < 0$:\n\n- $R_{90^\\circ}(x, y) = (-y, x)$\n- $R_{180^\\circ}(x, y) = (-x, -y)$\n- $R_{-90^\\circ}(x, y) = (y, -x)$\n\nTo find the rule from one point and its image, check which formula sends that point to that image.",
        "变换就是函数：输入一个点，输出它的像。用 $R_{\\theta}$ 表示绕原点旋转 $\\theta$，$\\theta > 0$ 为逆时针，$\\theta < 0$ 为顺时针：\n\n- $R_{90^\\circ}(x, y) = (-y, x)$\n- $R_{180^\\circ}(x, y) = (-x, -y)$\n- $R_{-90^\\circ}(x, y) = (y, -x)$\n\n要由一个点和它的像找出规则，就检验哪个公式把这个点送到这个像。",
      ),
      generate(rng) {
        const p = pickPoint(rng, 9);
        const k = rng.int(0, 2);
        const image = rotQ(p, [1, 3, 2][k]!);
        return choiceProblem({
          prompt: t(
            `A rotation about the origin maps $${pl(p)}$ to $${pl(image)}$. Which rule describes it?`,
            `绕原点的一次旋转把 $${pl(p)}$ 映到 $${pl(image)}$。哪条规则描述了这次旋转？`,
          ),
          options: ruleOptions.map((r) => same(`$${r}$`)),
          correct: k,
          solution: t(
            `Substitute $x = ${p[0]}$ and $y = ${p[1]}$ into $${ruleOptions[k]}$: it gives $${pl(image)}$. The rule $(x, y) \\to (y, x)$ is a reflection, not a rotation.`,
            `把 $x = ${p[0]}$，$y = ${p[1]}$ 代入 $${ruleOptions[k]}$，得到 $${pl(image)}$。规则 $(x, y) \\to (y, x)$ 是轴对称（反射），不是旋转。`,
          ),
        });
      },
    },
    {
      id: "composing-rotations",
      title: t("Composing rotations", "旋转的复合"),
      explanation: t(
        "Rotations about the same center combine by adding their angles: $R_{\\alpha}(R_{\\beta}(P)) = R_{\\alpha + \\beta}(P)$. Evaluate from the inside out, or add the angles first. Angles that differ by $360^\\circ$ give the same rotation.\n\n$R_{90^\\circ}(R_{180^\\circ}(2, -3)) = R_{270^\\circ}(2, -3) = R_{-90^\\circ}(2, -3) = (-3, -2)$.",
        "同一中心的旋转复合时角度相加：$R_{\\alpha}(R_{\\beta}(P)) = R_{\\alpha + \\beta}(P)$。可以由内向外逐步计算，也可以先把角度相加。相差 $360^\\circ$ 的角给出相同的旋转。\n\n$R_{90^\\circ}(R_{180^\\circ}(2, -3)) = R_{270^\\circ}(2, -3) = R_{-90^\\circ}(2, -3) = (-3, -2)$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const angles = [90, 180, 270, -90, -180];
        const [a, b] = [rng.pick(angles), rng.pick(angles)];
        const total = a + b;
        if (total % 360 === 0) {
          // A full turn leaves the point fixed; ask for one more quarter turn instead.
        }
        const qa = a / 90;
        const qb = b / 90;
        const image = rotQ(p, qa + qb);
        const inner = rotQ(p, qb);
        return pointProblem({
          prompt: t(
            `$R_{\\theta}$ is the rotation by $\\theta$ about the origin (counterclockwise for positive $\\theta$). Find $${rotationSymbol(a)}(${rotationSymbol(b)}${pl(p)})$.`,
            `$R_{\\theta}$ 表示绕原点旋转 $\\theta$（$\\theta$ 为正时逆时针）。求 $${rotationSymbol(a)}(${rotationSymbol(b)}${pl(p)})$。`,
          ),
          answer: image,
          wrong: [rotQ(p, qa - qb), rotQ(p, qa), rotQ(p, -(qa + qb))],
          solution: t(
            `The angles add: $${a}^\\circ + ${b < 0 ? `(${b}^\\circ)` : `${b}^\\circ`} = ${total}^\\circ$. Step by step:${steps(`${rotationSymbol(b)}${pl(p)} = ${pl(inner)}`, `${rotationSymbol(a)}${pl(inner)} = ${pl(image)}`)}`,
            `角度相加：$${a}^\\circ + ${b < 0 ? `(${b}^\\circ)` : `${b}^\\circ`} = ${total}^\\circ$。逐步计算：${steps(`${rotationSymbol(b)}${pl(p)} = ${pl(inner)}`, `${rotationSymbol(a)}${pl(inner)} = ${pl(image)}`)}`,
          ),
        });
      },
    },
    {
      id: "inverting-a-rotation",
      title: t("Inverting a rotation", "旋转的逆"),
      explanation: t(
        "The inverse of a rotation turns back by the same angle: the inverse of $R_{90^\\circ}$ is $R_{-90^\\circ}$, and $R_{180^\\circ}$ is its own inverse.\n\nIf $f(x, y) = (-y, x)$ and $f(P) = (4, -1)$, then $P = R_{-90^\\circ}(4, -1) = (-1, -4)$. Check: $f(-1, -4) = (4, -1)$.",
        "旋转的逆就是按同样的角度转回去：$R_{90^\\circ}$ 的逆是 $R_{-90^\\circ}$，$R_{180^\\circ}$ 的逆是它自己。\n\n若 $f(x, y) = (-y, x)$，$f(P) = (4, -1)$，则 $P = R_{-90^\\circ}(4, -1) = (-1, -4)$。检验：$f(-1, -4) = (4, -1)$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 2);
        const q = [1, 3, 2][k]!;
        const image = rotQ(p, q);
        const rule = ruleOptions[k]!.replace("(x, y) \\to ", "");
        return pointProblem({
          prompt: t(
            `The function $f(x, y) = ${rule}$ rotates the plane about the origin, and $f(P) = ${pl(image)}$. Find $P$.`,
            `函数 $f(x, y) = ${rule}$ 把平面绕原点旋转，且 $f(P) = ${pl(image)}$。求 $P$。`,
          ),
          answer: p,
          wrong: [rotQ(image, q), [image[1], image[0]], [-image[0], -image[1]]],
          solution: t(
            `$f$ is a rotation by $${[90, -90, 180][k]}^\\circ$, so undo it with a rotation by $${[-90, 90, 180][k]}^\\circ$:${steps(`P = ${pl(p)}`)}Check: $f${pl(p)} = ${pl(image)}$.`,
            `$f$ 是旋转 $${[90, -90, 180][k]}^\\circ$，所以用旋转 $${[-90, 90, 180][k]}^\\circ$ 还原：${steps(`P = ${pl(p)}`)}检验：$f${pl(p)} = ${pl(image)}$。`,
          ),
        });
      },
    },
  ],
};

/** reflections in the coordinate plane: across the x-axis, the y-axis, y = x and y = −x. */
const axisReflections: readonly { readonly f: (p: XY) => XY; readonly name: Text; readonly rule: string }[] = [
  { f: ([x, y]) => [x, -y + 0], name: t("the $x$-axis", "$x$ 轴"), rule: "(x, y) \\to (x, -y)" },
  { f: ([x, y]) => [-x + 0, y], name: t("the $y$-axis", "$y$ 轴"), rule: "(x, y) \\to (-x, y)" },
  { f: ([x, y]) => [y, x], name: t("the line $y = x$", "直线 $y = x$"), rule: "(x, y) \\to (y, x)" },
  { f: ([x, y]) => [-y + 0, -x + 0], name: t("the line $y = -x$", "直线 $y = -x$"), rule: "(x, y) \\to (-y, -x)" },
];

export const reflectionsInTheCoordinatePlane: TopicDef = {
  id: "reflections-in-the-coordinate-plane",
  title: t("Reflections of Geometric Figures in the Cartesian Plane", "坐标平面中图形的轴对称"),
  summary: t(
    "Reflect points across the axes, the lines y = x and y = −x, and horizontal and vertical lines, and identify a line of reflection.",
    "把点关于坐标轴、直线 y = x 与 y = −x 以及水平和竖直直线作轴对称，并判断对称轴。",
  ),
  prerequisites: ["the-coordinate-plane", "subtracting-integers"],
  encompasses: [{ topic: "the-coordinate-plane", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4", "CCSS.HSG.CO.A.5"],
  knowledgePoints: [
    {
      id: "reflecting-across-the-axes",
      title: t("Reflecting across the axes", "关于坐标轴的对称"),
      explanation: t(
        "A **reflection** across a line flips the plane over that line, the **line of reflection**: each point goes to the point on the other side at the same distance, so the line is the perpendicular bisector of every segment $PP'$.\n\n- Across the $x$-axis: $(x, y) \\to (x, -y)$.\n- Across the $y$-axis: $(x, y) \\to (-x, y)$.\n\nThe coordinate along the line stays the same; the other one changes sign. Reflecting $(3, -4)$ across the $y$-axis gives $(-3, -4)$.",
        "关于一条直线的**轴对称（反射）**把平面沿这条直线（**对称轴**）翻折：每个点都到直线另一侧距离相同的位置，所以对称轴是每条线段 $PP'$ 的垂直平分线。\n\n- 关于 $x$ 轴：$(x, y) \\to (x, -y)$。\n- 关于 $y$ 轴：$(x, y) \\to (-x, y)$。\n\n沿对称轴方向的坐标不变，另一个坐标变号。$(3, -4)$ 关于 $y$ 轴的对称点是 $(-3, -4)$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 1);
        const r = axisReflections[k]!;
        const image = r.f(p);
        return {
          ...pointProblem({
            prompt: t(`Reflect $P${pl(p)}$ across ${r.name.en}. Find $P'$.`, `作 $P${pl(p)}$ 关于${r.name["zh-CN"]}的对称点 $P'$。`),
            answer: image,
            wrong: [axisReflections[1 - k]!.f(p), [-p[0], -p[1]], [p[1], p[0]]],
            solution: t(
              `Reflecting across ${r.name.en} follows $${r.rule}$:${steps(`P' = ${pl(image)}`)}`,
              `关于${r.name["zh-CN"]}对称的规则是 $${r.rule}$：${steps(`P' = ${pl(image)}`)}`,
            ),
          }),
          figure: graph(
            [{ kind: "point", at: p, label: "P", dir: "n", accent: true }],
            "A point P on a coordinate grid.",
            "坐标网格上的点 P。",
          ),
        };
      },
    },
    {
      id: "reflecting-across-diagonal-lines",
      title: t("Reflecting across y = x and y = −x", "关于 y = x 与 y = −x 的对称"),
      explanation: t(
        "The lines $y = x$ and $y = -x$ run diagonally through the origin.\n\n- Across $y = x$: $(x, y) \\to (y, x)$, the coordinates swap.\n- Across $y = -x$: $(x, y) \\to (-y, -x)$, the coordinates swap and both change sign.\n\nReflecting $(5, -2)$ across $y = x$ gives $(-2, 5)$; across $y = -x$ it gives $(2, -5)$.",
        "直线 $y = x$ 和 $y = -x$ 是过原点的两条斜线。\n\n- 关于 $y = x$：$(x, y) \\to (y, x)$，两个坐标交换。\n- 关于 $y = -x$：$(x, y) \\to (-y, -x)$，两个坐标交换并都变号。\n\n$(5, -2)$ 关于 $y = x$ 的对称点是 $(-2, 5)$；关于 $y = -x$ 的对称点是 $(2, -5)$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(2, 3);
        const r = axisReflections[k]!;
        const image = r.f(p);
        return {
          ...pointProblem({
            prompt: t(`Reflect $P${pl(p)}$ across ${r.name.en}. Find $P'$.`, `作 $P${pl(p)}$ 关于${r.name["zh-CN"]}的对称点 $P'$。`),
            answer: image,
            wrong: [axisReflections[5 - k]!.f(p), rotQ(p, 1), [-p[0], -p[1]]],
            solution: t(
              `Reflecting across ${r.name.en} follows $${r.rule}$:${steps(`P' = ${pl(image)}`)}`,
              `关于${r.name["zh-CN"]}对称的规则是 $${r.rule}$：${steps(`P' = ${pl(image)}`)}`,
            ),
          }),
          figure: graph(
            [
              { kind: "line", a: [0, 0], b: [1, k === 2 ? 1 : -1], dashed: true },
              { kind: "point", at: p, label: "P", dir: "n", accent: true },
            ],
            `A point P and the line ${k === 2 ? "y = x" : "y = −x"} on a coordinate grid.`,
            `坐标网格上的点 P 和直线 ${k === 2 ? "y = x" : "y = −x"}。`,
          ),
        };
      },
    },
    {
      id: "reflecting-across-horizontal-and-vertical-lines",
      title: t("Reflecting across other horizontal and vertical lines", "关于其他水平或竖直直线的对称"),
      explanation: t(
        "Across a vertical line $x = h$, the $y$-coordinate stays and the point lands as far past the line as it started before it: $(x, y) \\to (2h - x, y)$. Across a horizontal line $y = k$: $(x, y) \\to (x, 2k - y)$.\n\nReflecting $(5, 1)$ across $x = 2$: the point is $3$ units right of the line, so the image is $3$ units left of it, at $(-1, 1)$; indeed $2 \\cdot 2 - 5 = -1$.",
        "关于竖直直线 $x = h$ 对称时，$y$ 坐标不变，点落在直线另一侧相同距离处：$(x, y) \\to (2h - x, y)$。关于水平直线 $y = k$：$(x, y) \\to (x, 2k - y)$。\n\n作 $(5, 1)$ 关于 $x = 2$ 的对称点：点在直线右侧 $3$ 个单位，所以像在直线左侧 $3$ 个单位，即 $(-1, 1)$；确实 $2 \\cdot 2 - 5 = -1$。",
      ),
      generate(rng) {
        for (;;) {
          const vertical = rng.bool();
          const h = rng.nonZero(-4, 4);
          const p: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const along = vertical ? p[0] : p[1];
          if (along === h) continue;
          const image: XY = vertical ? [2 * h - p[0], p[1]] : [p[0], 2 * h - p[1]];
          if (!within([image], 8)) continue;
          const line = vertical ? `x = ${h}` : `y = ${h}`;
          const d = along - h;
          return {
            ...pointProblem({
              prompt: t(`Reflect $P${pl(p)}$ across the line $${line}$. Find $P'$.`, `作 $P${pl(p)}$ 关于直线 $${line}$ 的对称点 $P'$。`),
              answer: image,
              wrong: [
                vertical ? [-p[0], p[1]] : [p[0], -p[1]],
                vertical ? [h - p[0], p[1]] : [p[0], h - p[1]],
                vertical ? [p[0], 2 * h - p[1]] : [2 * h - p[0], p[1]],
              ],
              solution: t(
                `$P$ is $${Math.abs(d)}$ unit${Math.abs(d) === 1 ? "" : "s"} ${vertical ? (d > 0 ? "right of" : "left of") : d > 0 ? "above" : "below"} the line, so $P'$ is the same distance on the other side:${steps(vertical ? `x' = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${p[0] < 0 ? `(${p[0]})` : p[0]} = ${image[0]}` : `y' = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${p[1] < 0 ? `(${p[1]})` : p[1]} = ${image[1]}`)}So $P' = ${pl(image)}$.`,
                `$P$ 在直线${vertical ? (d > 0 ? "右侧" : "左侧") : d > 0 ? "上方" : "下方"} $${Math.abs(d)}$ 个单位，所以 $P'$ 在另一侧相同距离处：${steps(vertical ? `x' = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${p[0] < 0 ? `(${p[0]})` : p[0]} = ${image[0]}` : `y' = 2 \\cdot ${h < 0 ? `(${h})` : h} - ${p[1] < 0 ? `(${p[1]})` : p[1]} = ${image[1]}`)}所以 $P' = ${pl(image)}$。`,
              ),
            }),
            figure: graph(
              [
                { kind: "line", a: vertical ? [h, 0] : [0, h], b: vertical ? [h, 1] : [1, h], dashed: true },
                { kind: "point", at: p, label: "P", dir: "n", accent: true },
              ],
              `A point P and the line ${line.replace("-", "−")} on a coordinate grid.`,
              `坐标网格上的点 P 和直线 ${line.replace("-", "−")}。`,
            ),
          };
        }
      },
    },
    {
      id: "identifying-the-line-of-reflection",
      title: t("Identifying the line of reflection", "判断对称轴"),
      explanation: t(
        "To identify the line of reflection, compare $P$ and $P'$ with the four rules: the $x$-axis keeps $x$ and negates $y$; the $y$-axis negates $x$ and keeps $y$; $y = x$ swaps the coordinates; $y = -x$ swaps them and negates both.\n\n$(4, -1) \\to (1, -4)$ swaps and negates both coordinates: the line is $y = -x$.",
        "要判断对称轴，把 $P$ 与 $P'$ 和四条规则对比：关于 $x$ 轴，$x$ 不变、$y$ 变号；关于 $y$ 轴，$x$ 变号、$y$ 不变；关于 $y = x$，两个坐标交换；关于 $y = -x$，两个坐标交换并都变号。\n\n$(4, -1) \\to (1, -4)$ 是坐标交换并都变号：对称轴是 $y = -x$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 3);
        const image = axisReflections[k]!.f(p);
        return {
          ...choiceProblem({
            prompt: t(
              `A reflection maps $P${pl(p)}$ to $P'${pl(image)}$. What is the line of reflection?`,
              `一次轴对称把 $P${pl(p)}$ 映到 $P'${pl(image)}$。对称轴是什么？`,
            ),
            options: axisReflections.map((r) => cat(r.name)),
            correct: k,
            solution: t(
              `The coordinates follow $${axisReflections[k]!.rule}$, the rule for reflecting across ${axisReflections[k]!.name.en}.`,
              `坐标符合 $${axisReflections[k]!.rule}$，这是关于${axisReflections[k]!.name["zh-CN"]}对称的规则。`,
            ),
          }),
          figure: graph(
            [
              { kind: "point", at: p, label: "P", dir: "n" },
              { kind: "point", at: image, label: "P′", dir: "n", accent: true },
            ],
            "A point P and its image P′ under a reflection.",
            "点 P 和它在一次轴对称下的像 P′。",
          ),
        };
      },
    },
  ],
};

export const reflectionsAcrossArbitraryLines: TopicDef = {
  id: "reflections-across-arbitrary-lines",
  title: t("Reflections of Figures Across Arbitrary Lines", "关于任意直线的轴对称"),
  summary: t(
    "Reflect points across slanted lines, and find the line of reflection as the perpendicular bisector of a point and its image.",
    "把点关于斜线作轴对称，并把对称轴求成一个点与它的像的垂直平分线。",
  ),
  prerequisites: ["reflections-in-the-coordinate-plane", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "reflections-in-the-coordinate-plane", weight: 0.4 },
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.5", "CCSS.HSG.GPE.B.5"],
  knowledgePoints: [
    {
      id: "reflecting-across-shifted-diagonals",
      title: t("Reflecting across y = x + c and y = −x + c", "关于 y = x + c 与 y = −x + c 的对称"),
      explanation: t(
        "To reflect across $y = x + c$, shift everything down by $c$ so the line becomes $y = x$, reflect, and shift back up:\n\n$$(x, y) \\to (y - c, \\; x + c).$$\n\nSimilarly, across $y = -x + c$: $(x, y) \\to (c - y, \\; c - x)$.\n\nAcross $y = x + 2$, the point $(5, 1)$ goes to $(1 - 2, 5 + 2) = (-1, 7)$. Check: the midpoint $(2, 4)$ lies on $y = x + 2$.",
        "要作关于 $y = x + c$ 的对称，先把所有点向下平移 $c$，直线变成 $y = x$；作对称后再向上平移回去：\n\n$$(x, y) \\to (y - c, \\; x + c)。$$\n\n同理，关于 $y = -x + c$：$(x, y) \\to (c - y, \\; c - x)$。\n\n关于 $y = x + 2$，点 $(5, 1)$ 的对称点是 $(1 - 2, 5 + 2) = (-1, 7)$。检验：中点 $(2, 4)$ 在 $y = x + 2$ 上。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.nonZero(-4, 4);
          const up = rng.bool();
          const p: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const image: XY = up ? [p[1] - c, p[0] + c] : [c - p[1], c - p[0]];
          if ((image[0] === p[0] && image[1] === p[1]) || !within([image], 8)) continue;
          const line = up ? `y = x ${c < 0 ? "-" : "+"} ${Math.abs(c)}` : `y = -x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
          const mid = [(p[0] + image[0]) / 2, (p[1] + image[1]) / 2].map((v) => Q.of(Math.round(v * 2), 2));
          return {
            ...pointProblem({
              prompt: t(`Reflect $P${pl(p)}$ across the line $${line}$. Find $P'$.`, `作 $P${pl(p)}$ 关于直线 $${line}$ 的对称点 $P'$。`),
              answer: image,
              wrong: [up ? [p[1], p[0]] : [-p[1], -p[0]], up ? [p[1] + c, p[0] - c] : [-c - p[1], -c - p[0]], [image[1], image[0]]],
              solution: t(
                `${up ? `Across $y = x + c$ the rule is $(x, y) \\to (y - c, x + c)$` : `Across $y = -x + c$ the rule is $(x, y) \\to (c - y, c - x)$`}, with $c = ${c}$:${steps(`P' = ${pl(image)}`)}Check: the midpoint of $PP'$, $${pl(mid)}$, lies on the line.`,
                `${up ? `关于 $y = x + c$ 的规则是 $(x, y) \\to (y - c, x + c)$` : `关于 $y = -x + c$ 的规则是 $(x, y) \\to (c - y, c - x)$`}，其中 $c = ${c}$：${steps(`P' = ${pl(image)}`)}检验：$PP'$ 的中点 $${pl(mid)}$ 在直线上。`,
              ),
            }),
            figure: graph(
              [
                { kind: "line", a: [0, c], b: [1, up ? c + 1 : c - 1], dashed: true },
                { kind: "point", at: p, label: "P", dir: "n", accent: true },
              ],
              `A point P and the line ${line.replace(/-/g, "−")} on a coordinate grid.`,
              `坐标网格上的点 P 和直线 ${line.replace(/-/g, "−")}。`,
            ),
          };
        }
      },
    },
    {
      id: "finding-the-line-of-reflection",
      title: t("Finding the line of reflection", "求对称轴"),
      explanation: t(
        "The line of reflection that maps $P$ to $P'$ is the **perpendicular bisector** of $\\overline{PP'}$: it passes through the midpoint of $\\overline{PP'}$ and is perpendicular to it.\n\nFor $P(1, 1)$ and $P'(5, 3)$: the midpoint is $(3, 2)$; the slope of $\\overline{PP'}$ is $\\frac{2}{4} = \\frac{1}{2}$, so the line has slope $-2$. Then $y - 2 = -2(x - 3)$, that is $y = -2x + 8$.",
        "把 $P$ 映到 $P'$ 的对称轴是 $\\overline{PP'}$ 的**垂直平分线**：它经过 $\\overline{PP'}$ 的中点，并与 $\\overline{PP'}$ 垂直。\n\n对 $P(1, 1)$ 和 $P'(5, 3)$：中点是 $(3, 2)$；$\\overline{PP'}$ 的斜率是 $\\frac{2}{4} = \\frac{1}{2}$，所以对称轴的斜率是 $-2$。于是 $y - 2 = -2(x - 3)$，即 $y = -2x + 8$。",
      ),
      generate(rng) {
        for (;;) {
          const m: XY = [rng.int(-3, 3), rng.int(-3, 3)];
          const v: XY = [rng.int(-3, 3), rng.nonZero(-3, 3)];
          if (gcd(v[0], v[1]) !== 1) continue;
          const p: XY = [m[0] - v[0], m[1] - v[1]];
          const q: XY = [m[0] + v[0], m[1] + v[1]];
          const slope = Q.of(-v[0], v[1]);
          const b = Q.of(m[1]).sub(slope.mul(Q.of(m[0])));
          const answer = `y = ${linear(slope, b)}`;
          const segSlope = v[0] === 0 ? null : Q.of(v[1], v[0]);
          return {
            ...equationProblem({
              prompt: t(
                `A reflection maps $P${pl(p)}$ to $P'${pl(q)}$. Find the equation of the line of reflection in slope-intercept form.`,
                `一次轴对称把 $P${pl(p)}$ 映到 $P'${pl(q)}$。求对称轴的方程，写成斜截式。`,
              ),
              answer,
              form: "slope-intercept",
              wrong: [
                ...(segSlope ? [`y = ${linear(segSlope, Q.of(m[1]).sub(segSlope.mul(Q.of(m[0]))))}`] : []),
                `y = ${linear(slope, 0)}`,
                `y = ${linear(slope.neg(), Q.of(m[1]).add(slope.mul(Q.of(m[0]))))}`,
              ],
              solution: t(
                `The midpoint of $\\overline{PP'}$ is $${pl(m)}$. ${segSlope ? `The slope of $\\overline{PP'}$ is $${segSlope.toLatex()}$, so the perpendicular slope is $${slope.toLatex()}$.` : "$\\overline{PP'}$ is vertical, so the line of reflection is horizontal."} The line through $${pl(m)}$ with slope $${slope.toLatex()}$ is${steps(answer)}`,
                `$\\overline{PP'}$ 的中点是 $${pl(m)}$。${segSlope ? `$\\overline{PP'}$ 的斜率是 $${segSlope.toLatex()}$，所以垂线的斜率是 $${slope.toLatex()}$。` : "$\\overline{PP'}$ 是竖直的，所以对称轴是水平的。"}过 $${pl(m)}$、斜率为 $${slope.toLatex()}$ 的直线是${steps(answer)}`,
              ),
            }),
            figure: graph(
              [
                { kind: "point", at: p, label: "P", dir: "n" },
                { kind: "point", at: q, label: "P′", dir: "n", accent: true },
              ],
              "A point P and its image P′ under a reflection.",
              "点 P 和它在一次轴对称下的像 P′。",
            ),
          };
        }
      },
    },
    {
      id: "reflecting-across-any-line",
      title: t("Reflecting across any line", "关于任意直线的对称"),
      explanation: t(
        "To reflect $P$ across a line $y = mx + b$:\n\n1. Write the line through $P$ perpendicular to it (slope $-\\frac{1}{m}$).\n2. Find where the two lines meet: the point $F$, which is the midpoint of $\\overline{PP'}$.\n3. Go as far past $F$ as $P$ is before it: $P' = (2x_F - x_P, \\; 2y_F - y_P)$.\n\nAcross $y = 2x$, for $P(-4, 2)$: the perpendicular through $P$ is $y = -\\frac{1}{2}x$; it meets $y = 2x$ at $F(0, 0)$, so $P' = (4, -2)$.",
        "要作 $P$ 关于直线 $y = mx + b$ 的对称点：\n\n1. 写出过 $P$ 且与它垂直的直线（斜率为 $-\\frac{1}{m}$）。\n2. 求两直线的交点 $F$，它是 $\\overline{PP'}$ 的中点。\n3. 越过 $F$ 走同样的距离：$P' = (2x_F - x_P, \\; 2y_F - y_P)$。\n\n关于 $y = 2x$，对 $P(-4, 2)$：过 $P$ 的垂线是 $y = -\\frac{1}{2}x$，它与 $y = 2x$ 交于 $F(0, 0)$，所以 $P' = (4, -2)$。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.pick([2, 3, -2, -3]);
          const b = rng.int(-3, 3);
          const f = rng.int(-2, 2);
          const s = rng.pick([1, -1, 2, -2]);
          const foot: XY = [f, m * f + b];
          const p: XY = [f - s * m, m * f + b + s];
          const image: XY = [f + s * m, m * f + b - s];
          if (!within([p, image, foot], 9)) continue;
          const line = `y = ${linear(m, b)}`;
          const perpB = Q.of(p[1]).add(Q.of(p[0], m));
          return pointProblem({
            prompt: t(`Reflect $P${pl(p)}$ across the line $${line}$. Find $P'$.`, `作 $P${pl(p)}$ 关于直线 $${line}$ 的对称点 $P'$。`),
            answer: image,
            wrong: [foot, [p[1], p[0]], [2 * foot[0] + p[0], 2 * foot[1] + p[1]]],
            solution: t(
              `The perpendicular through $P$ has slope $${Q.of(-1, m).toLatex()}$: $y = ${linear(Q.of(-1, m), perpB)}$. It meets $${line}$ at $F${pl(foot)}$, the midpoint of $\\overline{PP'}$. So${steps(`P' = (2 \\cdot ${foot[0] < 0 ? `(${foot[0]})` : foot[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; 2 \\cdot ${foot[1] < 0 ? `(${foot[1]})` : foot[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pl(image)}`)}`,
              `过 $P$ 的垂线斜率为 $${Q.of(-1, m).toLatex()}$：$y = ${linear(Q.of(-1, m), perpB)}$。它与 $${line}$ 交于 $F${pl(foot)}$，即 $\\overline{PP'}$ 的中点。所以${steps(`P' = (2 \\cdot ${foot[0] < 0 ? `(${foot[0]})` : foot[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; 2 \\cdot ${foot[1] < 0 ? `(${foot[1]})` : foot[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pl(image)}`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** niceScales are scale factors with small numerators and denominators. */
const niceScales: readonly Q[] = [
  Q.of(2),
  Q.of(3),
  Q.of(4),
  Q.of(1, 2),
  Q.of(1, 3),
  Q.of(1, 4),
  Q.of(3, 2),
  Q.of(2, 3),
  Q.of(5, 2),
  Q.of(3, 4),
  Q.of(5, 4),
  Q.of(4, 3),
];

/** qn converts a rational number to a JavaScript number. */
const qn = (q: Q) => q.toNumber();

export const dilationsOfGeometricFigures: TopicDef = {
  id: "dilations-of-geometric-figures",
  title: t("Dilations of Geometric Figures", "图形的位似（放缩）"),
  summary: t(
    "Use the scale factor of a dilation to find image lengths, find scale factors, and tell enlargements from reductions.",
    "用位似的比例因子求像的长度、求比例因子，并区分放大与缩小。",
  ),
  prerequisites: ["proportions", "multiplying-fractions"],
  encompasses: [
    { topic: "proportions", weight: 0.3 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.1"],
  knowledgePoints: [
    {
      id: "image-lengths",
      title: t("Lengths in the image", "像的长度"),
      explanation: t(
        "A **dilation** with center $C$ and **scale factor** $k > 0$ moves every point $P$ along the ray $CP$ so that $CP' = k \\cdot CP$. It multiplies every length by $k$ and keeps every angle.\n\nIf $AB = 12$ and the scale factor is $\\frac{3}{4}$, then $A'B' = \\frac{3}{4} \\cdot 12 = 9$.",
        "以 $C$ 为中心、**比例因子**为 $k > 0$ 的**位似**（放缩）把每个点 $P$ 沿射线 $CP$ 移动，使 $CP' = k \\cdot CP$。它把每条线段的长度都乘以 $k$，并保持每个角不变。\n\n若 $AB = 12$，比例因子为 $\\frac{3}{4}$，则 $A'B' = \\frac{3}{4} \\cdot 12 = 9$。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const d = Number(k.d);
        const length = d * rng.int(2, 12);
        const image = qn(k) * length;
        return numberProblem({
          prompt: t(
            `A dilation with scale factor $${k.toLatex()}$ maps $\\overline{AB}$ to $\\overline{A'B'}$. If $AB = ${length}$, find $A'B'$.`,
            `比例因子为 $${k.toLatex()}$ 的位似把 $\\overline{AB}$ 映到 $\\overline{A'B'}$。若 $AB = ${length}$，求 $A'B'$。`,
          ),
          answer: image,
          wrong: [Q.of(length).div(k), Q.of(length).add(k), length],
          solution: t(
            `A dilation multiplies lengths by the scale factor:${steps(`A'B' = ${k.toLatex()} \\cdot ${length} = ${image}`)}`,
            `位似把长度乘以比例因子：${steps(`A'B' = ${k.toLatex()} \\cdot ${length} = ${image}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-scale-factor",
      title: t("Finding the scale factor", "求比例因子"),
      explanation: t(
        "The scale factor is the ratio of an image length to the matching preimage length:\n\n$$k = \\frac{A'B'}{AB}.$$\n\nIf $AB = 8$ and $A'B' = 20$, then $k = \\frac{20}{8} = \\frac{5}{2}$. Image over preimage, not the other way round.",
        "比例因子是像的长度与对应原像长度之比：\n\n$$k = \\frac{A'B'}{AB}。$$\n\n若 $AB = 8$，$A'B' = 20$，则 $k = \\frac{20}{8} = \\frac{5}{2}$。是像比原像，不能颠倒。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const length = Number(k.d) * rng.int(2, 9);
        const image = qn(k) * length;
        return numberProblem({
          prompt: t(
            `A dilation maps $\\overline{PQ}$ with $PQ = ${length}$ to $\\overline{P'Q'}$ with $P'Q' = ${image}$. Find the scale factor.`,
            `一次位似把长为 $PQ = ${length}$ 的 $\\overline{PQ}$ 映到长为 $P'Q' = ${image}$ 的 $\\overline{P'Q'}$。求比例因子。`,
          ),
          answer: k,
          form: "fraction",
          wrong: [Q.one.div(k), Math.abs(image - length)],
          solution: t(
            `Divide the image length by the preimage length:${steps(`k = \\frac{${image}}{${length}} = ${k.toLatex()}`)}`,
            `用像的长度除以原像的长度：${steps(`k = \\frac{${image}}{${length}} = ${k.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "enlargements-and-reductions",
      title: t("Enlargements and reductions", "放大与缩小"),
      explanation: t(
        "The scale factor tells what a dilation does to size:\n\n- $k > 1$: an **enlargement**, the image is larger.\n- $0 < k < 1$: a **reduction**, the image is smaller.\n- $k = 1$: the image is congruent to the preimage.\n\nA scale factor of $\\frac{7}{5}$ enlarges, since $\\frac{7}{5} > 1$; a scale factor of $0.8$ reduces.",
        "比例因子说明位似对大小的影响：\n\n- $k > 1$：**放大**，像比原图形大。\n- $0 < k < 1$：**缩小**，像比原图形小。\n- $k = 1$：像与原图形全等。\n\n比例因子 $\\frac{7}{5}$ 是放大，因为 $\\frac{7}{5} > 1$；比例因子 $0.8$ 是缩小。",
      ),
      generate(rng) {
        let p = rng.int(1, 12);
        let q = rng.int(1, 12);
        if (rng.bool(0.1)) q = p;
        const g = gcd(p, q);
        [p, q] = [p / g, q / g];
        const k = Q.of(p, q);
        const correct = p > q ? 0 : p < q ? 1 : 2;
        const options = [
          t("An enlargement", "放大"),
          t("A reduction", "缩小"),
          t("Neither: the image is congruent", "都不是：像与原图形全等"),
        ];
        const byLengths = rng.bool();
        const ab = q * rng.int(1, 4);
        return choiceProblem({
          prompt: byLengths
            ? t(
                `A dilation maps a segment of length $${ab}$ to a segment of length $${(ab * p) / q}$. Is it an enlargement or a reduction?`,
                `一次位似把长为 $${ab}$ 的线段映到长为 $${(ab * p) / q}$ 的线段。这是放大还是缩小？`,
              )
            : t(
                `Is a dilation with scale factor $${k.toLatex()}$ an enlargement or a reduction?`,
                `比例因子为 $${k.toLatex()}$ 的位似是放大还是缩小？`,
              ),
          options,
          correct,
          solution: t(
            `The scale factor is $${k.toLatex()}$, which is ${correct === 0 ? "greater than" : correct === 1 ? "less than" : "equal to"} $1$, so the answer is: ${options[correct]!.en.toLowerCase()}.`,
            `比例因子是 $${k.toLatex()}$，它${correct === 0 ? "大于" : correct === 1 ? "小于" : "等于"} $1$，所以答案是：${options[correct]!["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "distances-from-the-center",
      title: t("Distances from the center", "到中心的距离"),
      explanation: t(
        "A dilation with center $C$ keeps $C$ fixed and moves each point along its ray from $C$: $CA' = k \\cdot CA$. So the scale factor is $\\frac{CA'}{CA}$, measured from the center, not $\\frac{AA'}{CA}$.\n\nIf $CA = 4$ and $A'$ lies $6$ units beyond $A$, then $CA' = 10$ and $k = \\frac{10}{4} = \\frac{5}{2}$.",
        "以 $C$ 为中心的位似保持 $C$ 不动，把每个点沿从 $C$ 出发的射线移动：$CA' = k \\cdot CA$。所以比例因子是从中心量起的 $\\frac{CA'}{CA}$，而不是 $\\frac{AA'}{CA}$。\n\n若 $CA = 4$，$A'$ 在 $A$ 外侧 $6$ 个单位处，则 $CA' = 10$，$k = \\frac{10}{4} = \\frac{5}{2}$。",
      ),
      generate(rng) {
        for (;;) {
          const ca = rng.int(2, 9);
          const caImage = rng.int(1, 16);
          if (caImage === ca || gcd(ca, caImage) === ca * caImage) continue;
          const k = Q.of(caImage, ca);
          const gap = Math.abs(caImage - ca);
          const angle = rng.int(-25, 25);
          const s = 6 / Math.max(ca, caImage);
          const [pa, pb] = [dir(angle, ca * s), dir(angle, caImage * s)];
          const o: Point = [0, 0];
          const beyond = caImage > ca;
          return {
            ...numberProblem({
              prompt: t(
                `A dilation with center $C$ maps $A$ to $A'$, with $CA = ${ca}$ and $AA' = ${gap}$ as shown. Find the scale factor.`,
                `以 $C$ 为中心的位似把 $A$ 映到 $A'$，如图 $CA = ${ca}$，$AA' = ${gap}$。求比例因子。`,
              ),
              answer: k,
              form: "fraction",
              wrong: [Q.of(gap, ca), Q.one.div(k), Q.of(ca + gap === caImage ? ca - gap : ca + gap, ca)],
              solution: t(
                `$A'$ lies ${beyond ? "beyond" : "between $C$ and"} $A$, so $CA' = ${ca} ${beyond ? "+" : "-"} ${gap} = ${caImage}$. Then${steps(`k = \\frac{CA'}{CA} = \\frac{${caImage}}{${ca}} = ${k.toLatex()}`)}`,
                `$A'$ 在${beyond ? " $A$ 的外侧" : " $C$ 与 $A$ 之间"}，所以 $CA' = ${ca} ${beyond ? "+" : "-"} ${gap} = ${caImage}$。于是${steps(`k = \\frac{CA'}{CA} = \\frac{${caImage}}{${ca}} = ${k.toLatex()}`)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "segment", a: o, b: beyond ? pb : pa },
                { kind: "dot", at: o },
                { kind: "dot", at: pa },
                { kind: "dot", at: pb },
                { kind: "label", at: o, text: "C", dir: "w", italic: true },
                { kind: "label", at: pa, text: "A", dir: "n", italic: true },
                { kind: "label", at: pb, text: "A′", dir: "n", italic: true },
                { kind: "side", a: beyond ? pa : pb, b: o, text: String(beyond ? ca : caImage) },
                { kind: "side", a: beyond ? pb : pa, b: beyond ? pa : pb, text: String(gap) },
              ],
              `Points C, A and A′ on a ray from C, with CA = ${ca} and AA′ = ${gap}.`,
              `从 C 出发的射线上的点 C、A、A′，CA = ${ca}，AA′ = ${gap}。`,
            ),
          };
        }
      },
    },
  ],
};

/** proofCongruenceSimilarityTopics are the topics of Geometry unit 1, in teaching order. */
export const proofCongruenceSimilarityTopics: readonly TopicDef[] = [
  identifyingAnglePostulates,
  identifyingAngleTheorems,
  provingAlternateAngleTheorems,
  provingAlternateAngleConverses,
  provingConsecutiveAngleTheorems,
  provingConsecutiveAngleConverse,
  provingPerpendicularLineTheorems,
  translationsOfGeometricFigures,
  rotationsOfGeometricFigures,
  rotationRulesInTheCoordinatePlane,
  reflectionsInTheCoordinatePlane,
  reflectionsAcrossArbitraryLines,
  dilationsOfGeometricFigures,
];
