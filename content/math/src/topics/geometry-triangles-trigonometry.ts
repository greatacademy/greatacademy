import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type Point, Q, radical, sketch } from "@ga/subject-math";
import { angleDrawings } from "../explanation-drawings-angles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { coordinateDrawings, specialDrawings } from "../explanation-drawings-solids.ts";
import { congruenceDrawings, similarityDrawings } from "../explanation-drawings-triangles.ts";
import { choiceProblem, expressionProblem, numberProblem, pointProblem, radicalProblem, steps, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { proofFigures } from "./geometry-congruence.ts";

// Geometry, unit 4: triangles (the Pythagorean theorem, special right triangles,
// proofs about triangles, medians and centroids), quadrilaterals (diagonals of
// squares, properties of parallelograms and their proofs) and right-triangle
// trigonometry.

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 1, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** cat joins texts and plain strings (the same in every locale). */
function cat(...parts: readonly (Text | string)[]): Text {
  const pick = (locale: "en" | "zh-CN") => parts.map((p) => (typeof p === "string" ? p : p[locale])).join("");
  return t(pick("en"), pick("zh-CN"));
}

/** paras joins texts as paragraphs. */
const paras = (...items: readonly Text[]) => t(items.map((p) => p.en).join("\n\n"), items.map((p) => p["zh-CN"]).join("\n\n"));

/** step writes step i of a solution with its title and body. */
const step = (i: number, en: string, zh: string, ...body: readonly (Text | string)[]) => cat(stepLabel(i, en, zh), t(" ", ""), ...body);

/** check starts the check of a solution. */
const check = (...body: readonly (Text | string)[]) => cat(t("**Check.** ", "**检验。** "), ...body);

/** shown places figure n of a solution on a line of its own after a text. */
const shown = (text: Text, n = 0) => cat(text, `\n\n{{figure ${n}}}`);

/** approx writes a length to two decimal places: "7.07". */
const approx = (x: number) => `${Math.round(x * 100) / 100}`;

/** hi draws a side of a figure in the result color. */
const hi = (a: Point, b: Point): Mark => ({ kind: "segment", a, b, tone: "result" });

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ", or "x^\circ". */
const angleTex = (c: number, d: number) => (d === 0 && c === 1 ? "x^\\circ" : `(${linear(c, d)})^\\circ`);

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°", or "x°". */
const angleLabel = (c: number, d: number) => (d === 0 && c === 1 ? "x°" : `(${plain(c, d)})°`);

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

/** Pose turns and maybe mirrors a drawing, so that figures do not all face the same way. */
export interface Pose {
  readonly turn: number;
  readonly mirror: boolean;
}

/** pickPose picks a random pose. */
export const pickPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 0, 90, 180, 270, 15, -15]), mirror: rng.bool() });

/** posed applies a pose to points. */
export function posed<T extends readonly Point[]>(points: T, pose: Pose): T {
  const [c, s] = [Math.cos(rad(pose.turn)), Math.sin(rad(pose.turn))];
  return points.map(([x0, y]) => {
    const x = pose.mirror ? -x0 : x0;
    return [x * c - y * s, x * s + y * c] as Point;
  }) as unknown as T;
}

/** Tri is a right triangle: the right-angle vertex R, the end U of the bottom leg and the end V of the upright leg. */
export type Tri = readonly [Point, Point, Point];

/** rightTri places a right triangle with legs p = RU and q = RV in a pose. */
export const rightTri = (p: number, q: number, pose: Pose): Tri =>
  posed([[0, 0] as Point, [p, 0] as Point, [0, q] as Point] as const, pose);

/** RightLabels label a right triangle: its sides RU, UV (the hypotenuse) and VR, angle arcs at U and V, and vertex letters for R, U, V. */
export interface RightLabels {
  readonly sides?: readonly [string | null, string | null, string | null];
  readonly atU?: string;
  readonly atV?: string;
  readonly letters?: string;
}

/** rightMarks draws a right triangle with its right-angle mark and labels. */
export function rightMarks(tri: Tri, l: RightLabels): Mark[] {
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

/** triangleByAngles draws a triangle with angles a at (0, 0) and b at (6, 0), counterclockwise. */
function triangleByAngles(a: number, b: number): [Point, Point, Point] {
  const side = (6 * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [[0, 0], [6, 0], dir(a, side)];
}

/** S is an exact number c·√m with m square-free; m = 1 for a rational number. */
type S = readonly [Q, number];

const q = (n: number, d = 1) => Q.of(n, d);

/** rootOf writes √n in simplest form, as [k, m] with n = k²·m. */
export function rootOf(n: number): [number, number] {
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

/** mulS multiplies two exact numbers. */
const mulS = (a: S, b: S): S => surd(a[0].mul(b[0]), a[1] * b[1]);

/** divS divides two exact numbers, rationalizing the denominator. */
const divS = (a: S, b: S): S => mulS(a, [Q.one.div(b[0].mul(q(b[1]))), b[1]]);

/** texS writes an exact number in simplest radical form. */
const texS = (s: S) => radical(s[0], s[1]);

/** label writes k√m for a figure: "5√3", "√2", "7". */
const label = (k: number, m = 1) => (m === 1 ? `${k}` : `${k === 1 ? "" : k}√${m}`);

/** sqrtTex writes k√m in LaTeX for a prompt: "5\sqrt{3}". */
const sqrtTex = (k: number, m = 1) => radical(k, m);

/** triples are primitive Pythagorean triples. */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
] as const;

/** pickTriple picks a Pythagorean triple with hypotenuse at most max, legs in random order. */
export function pickTriple(rng: Rng, max = 60): [number, number, number] {
  for (;;) {
    const [a, b, c] = rng.pick(triples);
    if (c > max) continue;
    const k = rng.int(1, Math.max(1, Math.floor(max / c)));
    return rng.bool() ? [k * a, k * b, k * c] : [k * b, k * a, k * c];
  }
}

// ---------------------------------------------------------------------------
// Proofs

/** reasons are the reasons a step of a two-column proof can cite. */
const reasons = {
  given: t("Given", "已知"),
  alternate: t("Alternate interior angles are congruent", "两直线平行，内错角相等"),
  corresponding: t("Corresponding angles are congruent", "两直线平行，同位角相等"),
  consecutive: t("Consecutive interior angles are supplementary", "两直线平行，同旁内角互补"),
  vertical: t("Vertical angles are congruent", "对顶角相等"),
  linearPair: t("Angles in a linear pair are supplementary", "邻补角互补"),
  straight: t("Angles on a straight line add up to $180^\\circ$", "平角等于 $180^\\circ$"),
  angleSum: t("Triangle angle sum theorem", "三角形内角和定理"),
  substitution: t("Substitution", "等量代换"),
  subtraction: t("Subtraction property of equality", "等式的减法性质"),
  halving: t("Substitution, then division by 2", "等量代换，再两边除以 2"),
  reflexive: t("Reflexive property", "自反性"),
  bisector: t("Definition of an angle bisector", "角平分线的定义"),
  midpoint: t("Definition of a midpoint", "中点的定义"),
  sas: t("SAS congruence criterion", "SAS（边角边）判定"),
  asa: t("ASA congruence criterion", "ASA（角边角）判定"),
  aas: t("AAS congruence criterion", "AAS（角角边）判定"),
  sss: t("SSS congruence criterion", "SSS（边边边）判定"),
  cpctc: t("Corresponding parts of congruent triangles are congruent", "全等三角形的对应部分相等"),
} as const;

/** Reason names a reason a proof step can cite. */
type Reason = keyof typeof reasons;

/** Crit names a congruence criterion. */
type Crit = "sas" | "asa" | "aas" | "sss";

/** criteria are the reasons that prove two triangles congruent. */
const criteria: readonly Reason[] = ["sas", "asa", "aas", "sss"];

/** isCrit tells whether a reason is a congruence criterion. */
const isCrit = (r: Reason): r is Crit => criteria.includes(r);

/** does says what each reason other than Given states, as a clause. */
const does: Record<Exclude<Reason, "given">, Text> = {
  alternate: t(
    "parallel lines cut by a transversal make equal alternate interior angles, on opposite sides of the transversal and between the parallels",
    "两条平行线被截线所截，内错角相等：它们分在截线两侧，夹在两条平行线之间",
  ),
  corresponding: t(
    "parallel lines cut by a transversal make equal corresponding angles, in matching positions at the two crossings",
    "两条平行线被截线所截，同位角相等：它们在两个交点处位置相同",
  ),
  consecutive: t(
    "parallel lines cut by a transversal make consecutive interior angles that add up to $180^\\circ$",
    "两条平行线被截线所截，同旁内角之和为 $180^\\circ$",
  ),
  vertical: t("the angles that face each other across a crossing are equal", "两线相交时，隔着交点相对的两个角相等"),
  linearPair: t(
    "two angles that share a side, with their other sides forming a line, add up to $180^\\circ$",
    "有一条公共边、另一边组成一条直线的两个角，和为 $180^\\circ$",
  ),
  straight: t("angles that together fill a straight angle add up to $180^\\circ$", "合起来组成一个平角的几个角，和为 $180^\\circ$"),
  angleSum: t("the three angles of a triangle add up to $180^\\circ$", "三角形的三个内角之和为 $180^\\circ$"),
  substitution: t("a quantity may be replaced by one equal to it", "一个量可以用与它相等的量替换"),
  subtraction: t("subtracting the same quantity from both sides of an equation keeps them equal", "等式两边同时减去同一个量，仍然相等"),
  halving: t(
    "two equal angles that add up to $180^\\circ$ are $90^\\circ$ each, half of $180^\\circ$",
    "两个相等的角之和为 $180^\\circ$ 时，各是 $180^\\circ$ 的一半，即 $90^\\circ$",
  ),
  reflexive: t("a segment or an angle is equal to itself", "线段或角与自身相等"),
  bisector: t("a bisector splits its angle into two equal angles", "角平分线把角分成两个相等的角"),
  midpoint: t("a midpoint splits its segment into two equal halves", "中点把它所在的线段分成相等的两半"),
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
};

/** critNeeds says what each congruence criterion needs. */
const critNeeds: Record<Crit, Text> = {
  sas: t("two pairs of sides and the angles between them", "两组边及其夹角"),
  asa: t("two pairs of angles and the sides between them", "两组角及其夹边"),
  aas: t("two pairs of angles and a pair of sides not between them", "两组角及其中一角的对边"),
  sss: t("three pairs of sides", "三组边"),
};

/** altWhy says why a wrong statement does not follow by a reason, for the reasons whose steps offer wrong statements. */
const altWhy: Partial<Record<Reason, Text>> = {
  alternate: t(
    "Alternate interior angles lie between the parallel lines, on opposite sides of the transversal, and this statement pairs other angles or says something else.",
    "内错角夹在两条平行线之间，分在截线两侧，而这个结论配对的是别的角，或者说的是别的事。",
  ),
  straight: t(
    "The angles at the point fill a straight angle, so their sum is $180^\\circ$; this statement gives another sum or relation.",
    "这一点处的几个角合起来是平角，和为 $180^\\circ$；这个结论给出的是别的和或别的关系。",
  ),
  linearPair: t(
    "Angles in a linear pair add up to $180^\\circ$; this statement gives another sum or makes them equal.",
    "邻补角之和为 $180^\\circ$；这个结论给出的是别的和，或者说它们相等。",
  ),
  angleSum: t(
    "The theorem adds all three angles of one triangle and gets $180^\\circ$; this statement leaves an angle out or uses another total.",
    "定理是把一个三角形的三个内角全部相加，得到 $180^\\circ$；这个结论漏掉了一个角，或者用了别的总和。",
  ),
  substitution: t(
    "Replacing each quantity by the one an earlier step makes equal to it gives a different statement.",
    "把每个量换成前面某步中与它相等的量，得到的不是这个结论。",
  ),
  subtraction: t(
    "Subtracting the same angle from both sides of the earlier equation gives a different statement.",
    "从前一个等式的两边减去同一个角，得到的不是这个结论。",
  ),
  bisector: t(
    "The bisector only splits its own angle into two equal halves, and this statement says something else.",
    "角平分线只把它所平分的那个角分成相等的两半，而这个结论说的是别的事。",
  ),
  midpoint: t(
    "The midpoint only splits its own segment into two equal halves, and this statement says something else.",
    "中点只把它所在的线段分成相等的两半，而这个结论说的是别的事。",
  ),
  cpctc: t(
    "CPCTC only pairs parts in the same places of the congruence statement, and these parts are not in the same places.",
    "对应部分必须在全等式中处于相同位置，而这两个部分的位置不同。",
  ),
  halving: t(
    "Two equal angles that add up to $180^\\circ$ are $90^\\circ$ each; this statement gives another value.",
    "两个相等的角之和为 $180^\\circ$ 时各是 $90^\\circ$；这个结论给出的是别的值。",
  ),
  ...Object.fromEntries(
    criteria.map((c) => [
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
  straight: ["linearPair"],
  linearPair: ["straight", "halving"],
  substitution: ["halving"],
  halving: ["substitution", "linearPair"],
};

/** ProofStep is one line of a two-column proof: a statement, its reason, and wrong statements to offer instead of it. */
interface ProofStep {
  readonly s: Text;
  readonly r: Reason;
  readonly alts?: readonly Text[];
  /** why explains the step in the solution. */
  readonly why?: Text;
  /** uses are the earlier steps (counted from 0) whose facts the step combines. */
  readonly uses?: readonly number[];
  /** marks are the ticks, arcs, arrows or right-angle marks that the step's fact adds to the figure. */
  readonly marks?: readonly Mark[];
  /** drawn says that the problem's figure already shows the step's marks, since they come straight from the given facts. */
  readonly drawn?: boolean;
}

/** Proof is a two-column proof with the bare drawing of its figure. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  /** base draws the figure without the marks of any step. */
  readonly base: readonly Mark[];
  readonly alt: readonly [string, string];
  /** parts are the steps that give the three pairs of parts a congruence criterion uses, when the proof has one. */
  readonly parts?: readonly number[];
}

/** m wraps LaTeX as a language-neutral text. */
const m = (tex: string) => same(`$${tex}$`);

/** cap starts a sentence with a capital letter. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** stepList names steps (counted from 0) in a sentence: "steps 2 and 3", "第 2、3 步". */
function stepList(ids: readonly number[]): Text {
  const ns = ids.map((i) => `${i + 1}`);
  const en = ns.length === 1 ? `step ${ns[0]}` : `steps ${ns.slice(0, -1).join(", ")} and ${ns[ns.length - 1]}`;
  return t(en, `第 ${ns.join("、")} 步`);
}

/** proofProblem asks for the reason, or the statement, of one step of a proof; pool lists the reasons offered as wrong options. */
function proofProblem(rng: Rng, proof: Proof, pool: readonly Reason[]): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [target, k] = rng.pick(eligible);
  const r = target.r as Exclude<Reason, "given">;
  const askStatement = target.alts !== undefined && target.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  let wrongWhy: (readonly [string, string, string])[];
  if (askStatement) {
    options = [target.s, ...rng.sample(target.alts!, Math.min(3, target.alts!.length))];
    const w = altWhy[r] ?? t("It does not follow from the earlier steps.", "它不能由前面各步推出。");
    wrongWhy = options.slice(1).map((o) => [o.en, w.en, w["zh-CN"]] as const);
  } else {
    const others = pool.filter((x) => x !== r && !(alike[r] ?? []).includes(x));
    const picked = rng.sample(others, Math.min(3, others.length));
    options = [reasons[r], ...picked.map((x) => reasons[x])];
    wrongWhy = picked.map((x) => {
      if (x === "given")
        return [
          reasons.given.en,
          `Step ${k + 1} is not one of the given facts; it has to be derived from them.`,
          `第 ${k + 1} 步不是已知条件，而是要由已知推出来的。`,
        ] as const;
      if (isCrit(x) && isCrit(r))
        return [
          reasons[x].en,
          `It needs ${critNeeds[x].en}, but the earlier steps give ${critNeeds[r].en}.`,
          `它需要${critNeeds[x]["zh-CN"]}，而前面各步给出的是${critNeeds[r]["zh-CN"]}。`,
        ] as const;
      return [
        reasons[x].en,
        `It says that ${does[x].en}, which is not what step ${k + 1} states.`,
        `它说的是${does[x]["zh-CN"]}，而第 ${k + 1} 步不是这样的结论。`,
      ] as const;
    });
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
  const sources = proof.steps
    .map((s, i) => [s, i] as const)
    .filter(([s]) => s.uses !== undefined && s.uses.length > 0)
    .map(([s, i]) =>
      t(
        `step ${i + 1} (${reasons[s.r].en}) uses ${stepList(s.uses!).en}`,
        `第 ${i + 1} 步（${reasons[s.r]["zh-CN"]}）用到${stepList(s.uses!)["zh-CN"]}`,
      ),
    );
  const givens = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r === "given");
  const plainSteps = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given" && !s.uses?.length);
  const traced = t(
    `Every fact the proof uses comes from somewhere: ${[
      ...(givens.length > 0 ? [`${stepList(givens.map(([, i]) => i)).en} ${givens.length > 1 ? "are" : "is"} given`] : []),
      ...sources.map((x) => x.en),
      ...(plainSteps.length > 0
        ? [
            `${stepList(plainSteps.map(([, i]) => i)).en} ${plainSteps.length > 1 ? "apply" : "applies"} a definition or a theorem to the figure itself`,
          ]
        : []),
    ].join("; ")}.`,
    `证明用到的每个事实都有出处：${[
      ...(givens.length > 0 ? [`${stepList(givens.map(([, i]) => i))["zh-CN"]}是已知`] : []),
      ...sources.map((x) => x["zh-CN"]),
      ...(plainSteps.length > 0 ? [`${stepList(plainSteps.map(([, i]) => i))["zh-CN"]}直接对图形用定义或定理`] : []),
    ].join("；")}。`,
  );
  const last = proof.steps[proof.steps.length - 1]!;
  const ending = t(` The last step, ${last.s.en}, is the statement to prove.`, `最后一步 ${last.s["zh-CN"]} 正是要证明的结论。`);
  const c = proof.steps.findIndex((s) => isCrit(s.r));
  const partsText =
    c >= 0 && proof.parts
      ? t(
          ` Step ${c + 1} uses the ${reasons[proof.steps[c]!.r].en}, which needs ${critNeeds[proof.steps[c]!.r as Crit].en}: ${proof.parts.map((i) => `${proof.steps[i]!.s.en} (step ${i + 1})`).join(", ")}.`,
          `第 ${c + 1} 步用的是${reasons[proof.steps[c]!.r]["zh-CN"]}，它需要${critNeeds[proof.steps[c]!.r as Crit]["zh-CN"]}：${proof.parts.map((i) => `${proof.steps[i]!.s["zh-CN"]}（第 ${i + 1} 步）`).join("，")}。`,
        )
      : t("", "");
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
          step(1, "see what the step does", "看这一步做什么", first),
          step(2, "follow the proof in the figure", "在图中走一遍证明", t(walk("en"), walk("zh-CN"))),
          check(traced, partsText, ending),
        ),
      }),
      wrongWhy,
    ),
    figure: drawing.figure,
    solutionFigures: drawing.steps,
  };
}

// ---------------------------------------------------------------------------
// Triangles

/** exteriorMarks draws triangle ABC with angles a at A and b at B, AB extended past B to D, labels at A, C and the exterior angle CBD, and the interior angle at B when inner is given; lit draws the three labelled arcs in the result color. */
function exteriorMarks(a: number, b: number, labels: readonly [string, string, string], lit = false, inner?: string): Mark[] {
  const [pa, pb, pc] = triangleByAngles(a, b);
  const pd: Point = [9, 0];
  const tone = lit ? { tone: "result" as const } : {};
  const marks: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pb, b: pd },
    { kind: "arc", vertex: pb, from: pd, to: pc, label: labels[2] || undefined, accent: true, ...tone },
    ...names([pa, pb, pc, pd], "ABCD", [3, 1]),
  ];
  if (labels[0]) marks.push({ kind: "arc", vertex: pa, from: pb, to: pc, label: labels[0], ...tone });
  if (labels[1]) marks.push({ kind: "arc", vertex: pc, from: pa, to: pb, label: labels[1], ...tone });
  if (inner) marks.push({ kind: "arc", vertex: pb, from: pc, to: pa, label: inner });
  return marks;
}

/** exteriorFigure draws triangle ABC with angles a at A and b at B, AB extended past B to D, and labels at A, C and the exterior angle CBD. */
function exteriorFigure(a: number, b: number, labels: readonly [string, string, string], en: string, zh: string): Figure {
  return figure(exteriorMarks(a, b, labels), en, zh);
}

/** atX writes the value of cx + d at x: "3 \cdot 12 - 5 = 31". */
function atX(c: number, d: number, x: number): string {
  const head = c === 1 ? `${x}` : `${c} \\cdot ${x}`;
  return d === 0 ? (c === 1 ? `${x}` : `${head} = ${c * x}`) : `${head} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${c * x + d}`;
}

/** ExteriorSetup is triangle ABC with angles a at A, c at C and b at B, written as k1 x + d1, k2 x + d2 and an exterior angle p x + de at B. */
interface ExteriorSetup {
  readonly x: number;
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly k1: number;
  readonly k2: number;
  readonly p: number;
  readonly d1: number;
  readonly d2: number;
  readonly de: number;
}

/** exteriorSetup picks angles and expressions for an equation from the exterior angle theorem. */
function exteriorSetup(rng: Rng): ExteriorSetup {
  for (;;) {
    const x = rng.int(5, 25);
    const a = rng.int(30, 90);
    const c = rng.int(30, 90);
    const b = 180 - a - c;
    if (b < 25 || [a, b, c].includes(90)) continue;
    const [k1, k2] = [rng.int(1, 3), rng.int(1, 3)];
    const p = k1 + k2 + rng.int(1, 3);
    const [d1, d2] = [a - k1 * x, c - k2 * x];
    const de = a + c - p * x;
    if (Math.abs(d1) > 60 || Math.abs(d2) > 60 || Math.abs(de) > 90 || de === 0) continue;
    return { x, a, b, c, k1, k2, p, d1, d2, de };
  }
}

/** exteriorWork solves p x + de = (k1 x + d1) + (k2 x + d2) for x, as display lines. */
function exteriorWork(e: ExteriorSetup): string {
  const k = e.k1 + e.k2;
  const d = e.d1 + e.d2;
  return chain(
    `${linear(e.p, e.de)} = (${linear(e.k1, e.d1)}) + (${linear(e.k2, e.d2)})`,
    `${linear(e.p, e.de)} = ${linear(k, d)}`,
    `${linear(e.p - k, 0)} = ${d - e.de}`,
    `x = ${e.x}`,
  );
}

/** exteriorIntro is triangle ABC with angles 50° at A and 70° at C, and the exterior angle at B. */
const exteriorIntro: Figure = figure(
  exteriorMarks(50, 60, ["50°", "70°", "?"], false, "60°"),
  "Triangle ABC with angle A 50°, angle C 70° and angle ABC 60°. Side AB is extended past B to D; the exterior angle CBD is marked with a question mark.",
  "三角形 ABC，角 A 为 50°，角 C 为 70°，角 ABC 为 60°。边 AB 延长到 D；外角 CBD 用问号标出。",
);

export const theExteriorAngleTheorem: TopicDef = {
  id: "the-exterior-angle-theorem",
  title: t("The Exterior Angle Theorem", "外角定理"),
  summary: t(
    "Use the exterior angle theorem and the sum of the exterior angles of a triangle, with angles written as expressions.",
    "运用外角定理和三角形外角和，包括用代数式表示的角。",
  ),
  prerequisites: ["exterior-angles-of-triangles"],
  encompasses: [
    { topic: "exterior-angles-of-triangles", weight: 0.6 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.CO.C.10"],
  intro: t(
    `Extending a side of a triangle past a vertex makes an **exterior angle** there. It sits on a straight line with the interior angle beside it, so the two add up to $180^\\circ$. Take the triangle below, with $\\angle A = 50^\\circ$ and $\\angle C = 70^\\circ$, and side $AB$ extended past $B$ to $D$:

{{figure 0}}

The angle sum gives $\\angle ABC = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$, and then the exterior angle is $\\angle CBD = 180^\\circ - 60^\\circ = 120^\\circ$. Notice that $120^\\circ = 50^\\circ + 70^\\circ$. That is no accident: the interior angle at $B$ is what is left of $180^\\circ$ after $\\angle A$ and $\\angle C$, and the exterior angle is what is left of $180^\\circ$ after the interior angle, so the exterior angle is exactly $\\angle A + \\angle C$. This is the **exterior angle theorem**: an exterior angle equals the sum of the two interior angles that are not next to it, the **remote interior angles**.

In this lesson we first add up the three exterior angles of a triangle, then use the theorem to write and solve equations when the angles are given as expressions in $x$, and finally find the angles themselves.`,
    `把三角形的一条边延长过一个顶点，就在那里形成一个**外角**。它和旁边的内角在同一条直线上，所以两者之和是 $180^\\circ$。看下面的三角形，$\\angle A = 50^\\circ$，$\\angle C = 70^\\circ$，边 $AB$ 延长过 $B$ 到 $D$：

{{figure 0}}

由内角和，$\\angle ABC = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$，于是外角 $\\angle CBD = 180^\\circ - 60^\\circ = 120^\\circ$。注意 $120^\\circ = 50^\\circ + 70^\\circ$。这不是巧合：$B$ 处的内角是 $180^\\circ$ 减去 $\\angle A$ 和 $\\angle C$ 剩下的部分，而外角是 $180^\\circ$ 减去这个内角剩下的部分，所以外角正好等于 $\\angle A + \\angle C$。这就是**外角定理**：三角形的外角等于与它不相邻的两个内角之和。

这节课先求三角形三个外角的和，再在角用含 $x$ 的式子表示时，用外角定理列方程、解方程，最后求出各个角。`,
  ),
  introFigures: [exteriorIntro],
  knowledgePoints: [
    {
      id: "sum-of-exterior-angles",
      figure: angleDrawings["sum-of-exterior-angles"],
      title: t("The sum of the exterior angles", "外角和"),
      explanation: t(
        `Extend each side of a triangle in turn, so that there is one exterior angle at each vertex. Each exterior angle makes a straight angle with the interior angle beside it, so it is $180^\\circ$ minus that interior angle. Adding the three exterior angles gives three straight angles minus the three interior angles:

$$3 \\cdot 180^\\circ - 180^\\circ = 540^\\circ - 180^\\circ = 360^\\circ.$$

So the exterior angles of any triangle, one at each vertex, add up to $360^\\circ$: walking around the triangle, you turn through each exterior angle once and end up facing the way you started, a full turn.

If two exterior angles are $110^\\circ$ and $130^\\circ$, the third is $360^\\circ - 110^\\circ - 130^\\circ = 120^\\circ$. The interior angles are then $70^\\circ$, $50^\\circ$ and $60^\\circ$, which do add up to $180^\\circ$.

> **Watch out.** The exterior angles add up to $360^\\circ$, not $180^\\circ$ or $540^\\circ$ ($540^\\circ$ is three straight angles, before the interior angles are taken away). And the answer is the exterior angle itself: $180^\\circ - 120^\\circ = 60^\\circ$ is the interior angle beside it.`,
        `依次延长三角形的各边，使每个顶点处各有一个外角。每个外角和它旁边的内角组成一个平角，所以外角等于 $180^\\circ$ 减去这个内角。三个外角相加，就是三个平角减去三个内角：

$$3 \\cdot 180^\\circ - 180^\\circ = 540^\\circ - 180^\\circ = 360^\\circ.$$

所以任何三角形的外角（每个顶点取一个）之和都是 $360^\\circ$：沿着三角形走一圈，在每个顶点转过一个外角，最后回到原来的朝向，正好转了一整圈。

若两个外角是 $110^\\circ$ 和 $130^\\circ$，第三个外角是 $360^\\circ - 110^\\circ - 130^\\circ = 120^\\circ$。这时三个内角是 $70^\\circ$、$50^\\circ$ 和 $60^\\circ$，和确实是 $180^\\circ$。

> **注意。** 外角和是 $360^\\circ$，不是 $180^\\circ$，也不是 $540^\\circ$（$540^\\circ$ 是三个平角，还没有减去内角）。另外答案要的是外角本身：$180^\\circ - 120^\\circ = 60^\\circ$ 是它旁边的内角。`,
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(30, 95);
          const b = rng.int(30, 95);
          const c = 180 - a - b;
          if (c < 25 || [a, b, c].includes(90)) continue;
          const pts = triangleByAngles(a, b);
          const inner = [a, b, c];
          const ext = inner.map((v) => 180 - v);
          const ask = rng.int(0, 2);
          const known = ext.filter((_, i) => i !== ask) as [number, number];
          const answer = ext[ask]!;
          const marks: Mark[] = [{ kind: "polygon", points: pts }];
          const innerArcs: Mark[] = [];
          pts.forEach((p, i) => {
            const prev = pts[(i + 2) % 3]!;
            const next = pts[(i + 1) % 3]!;
            const len = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
            const e: Point = [p[0] + ((p[0] - prev[0]) / len) * 2.5, p[1] + ((p[1] - prev[1]) / len) * 2.5];
            marks.push({ kind: "segment", a: p, b: e });
            marks.push({ kind: "arc", vertex: p, from: e, to: next, label: i === ask ? "x" : deg(ext[i]!), accent: i === ask });
            innerArcs.push({ kind: "arc", vertex: p, from: prev, to: next, label: deg(inner[i]!), tone: "result" });
          });
          const innerKnown = known.map((v) => 180 - v) as [number, number];
          return {
            ...numberProblem({
              prompt: t("Find the exterior angle $x$.", "求外角 $x$。"),
              answer,
              form: "integer",
              unit: "°",
              wrong: [180 - answer, 540 - known[0] - known[1], intOr(known[0] + known[1], 2, Math.abs(known[0] - known[1]))],
              solution: paras(
                step(
                  1,
                  "add up the exterior angles",
                  "用外角和",
                  t(
                    `There is one exterior angle at each vertex, and each is $180^\\circ$ minus the interior angle beside it, so the three add up to $3 \\cdot 180^\\circ - 180^\\circ = 360^\\circ$.`,
                    `每个顶点各有一个外角，每个外角都等于 $180^\\circ$ 减去旁边的内角，所以三个外角之和是 $3 \\cdot 180^\\circ - 180^\\circ = 360^\\circ$。`,
                  ),
                ),
                step(
                  2,
                  "subtract the known exterior angles",
                  "减去已知的外角",
                  t(
                    `Take the two known exterior angles from $360^\\circ$:${steps(`x = 360^\\circ - ${known[0]}^\\circ - ${known[1]}^\\circ = ${answer}^\\circ`)}`,
                    `从 $360^\\circ$ 中减去两个已知的外角：${steps(`x = 360^\\circ - ${known[0]}^\\circ - ${known[1]}^\\circ = ${answer}^\\circ`)}`,
                  ),
                ),
                check(
                  shown(
                    t(
                      `Go back to the interior angles, each $180^\\circ$ minus its exterior angle: $180^\\circ - ${known[0]}^\\circ = ${innerKnown[0]}^\\circ$, $180^\\circ - ${known[1]}^\\circ = ${innerKnown[1]}^\\circ$ and $180^\\circ - ${answer}^\\circ = ${180 - answer}^\\circ$. Their sum is $${innerKnown[0]}^\\circ + ${innerKnown[1]}^\\circ + ${180 - answer}^\\circ = 180^\\circ$, the angle sum of a triangle.`,
                      `回到内角，每个内角等于 $180^\\circ$ 减去它的外角：$180^\\circ - ${known[0]}^\\circ = ${innerKnown[0]}^\\circ$，$180^\\circ - ${known[1]}^\\circ = ${innerKnown[1]}^\\circ$，$180^\\circ - ${answer}^\\circ = ${180 - answer}^\\circ$。它们的和是 $${innerKnown[0]}^\\circ + ${innerKnown[1]}^\\circ + ${180 - answer}^\\circ = 180^\\circ$，正是三角形的内角和。`,
                    ),
                  ),
                ),
              ),
            }),
            figure: figure(
              marks,
              `A triangle with each side extended, one exterior angle at each vertex: ${known[0]}°, ${known[1]}° and x.`,
              `一个三角形，各边依次延长，每个顶点各有一个外角：${known[0]}°、${known[1]}° 和 x。`,
            ),
            solutionFigures: [
              figure(
                [...marks, ...innerArcs],
                `The same triangle with its interior angles marked: ${a}°, ${b}° and ${c}°, each the supplement of the exterior angle beside it.`,
                `同一个三角形，标出了内角：${a}°、${b}° 和 ${c}°，每个都与旁边的外角互补。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "exterior-angle-equations",
      figure: angleDrawings["exterior-angle-equations"],
      title: t("Equations with the exterior angle", "含外角的方程"),
      explanation: t(
        `At $B$, the exterior angle $\\angle CBD$ and the interior angle $\\angle ABC$ form a straight line, so $\\angle CBD = 180^\\circ - \\angle ABC$. The angle sum says that $\\angle A + \\angle C = 180^\\circ - \\angle ABC$ too. Both equal the same thing, so

$$\\angle CBD = \\angle A + \\angle C.$$

When the exterior angle and the two remote interior angles are all written with $x$, this gives an equation with $x$ on both sides. If $\\angle A = (x + 10)^\\circ$, $\\angle C = 2x^\\circ$ and $\\angle CBD = (4x - 15)^\\circ$, then

$$4x - 15 = (x + 10) + 2x, \\qquad 4x - 15 = 3x + 10, \\qquad x = 25.$$

Collect like terms on the right first, then move the $x$ terms to one side and the numbers to the other.

> **Watch out.** The exterior angle is not an angle of the triangle, so it does not go into the angle sum: $(4x - 15) + (x + 10) + 2x = 180$ is wrong. Set the exterior angle equal to the sum of the two remote angles, and watch the signs when a number crosses the equals sign.`,
        `在 $B$ 处，外角 $\\angle CBD$ 与内角 $\\angle ABC$ 组成平角，所以 $\\angle CBD = 180^\\circ - \\angle ABC$。由内角和，$\\angle A + \\angle C$ 也等于 $180^\\circ - \\angle ABC$。两者等于同一个量，所以

$$\\angle CBD = \\angle A + \\angle C.$$

当外角和两个不相邻的内角都用 $x$ 表示时，就得到两边都含 $x$ 的方程。若 $\\angle A = (x + 10)^\\circ$，$\\angle C = 2x^\\circ$，$\\angle CBD = (4x - 15)^\\circ$，则

$$4x - 15 = (x + 10) + 2x, \\qquad 4x - 15 = 3x + 10, \\qquad x = 25.$$

先合并右边的同类项，再把含 $x$ 的项移到一边，数移到另一边。

> **注意。** 外角不是三角形的内角，不能放进内角和：$(4x - 15) + (x + 10) + 2x = 180$ 是错的。应令外角等于两个不相邻内角之和；数移过等号时要注意变号。`,
      ),
      keyPrerequisites: ["exterior-angles-of-triangles"],
      generate(rng) {
        const e = exteriorSetup(rng);
        const { x, a, b, c, k1, k2, p, d1, d2, de } = e;
        const k = k1 + k2;
        const d = d1 + d2;
        const labels = [angleLabel(k1, d1), angleLabel(k2, d2), angleLabel(p, de)] as const;
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\angle A = ${angleTex(k1, d1)}$, $\\angle C = ${angleTex(k2, d2)}$ and the exterior angle $\\angle CBD = ${angleTex(p, de)}$. Find $x$.`,
              `如图，$\\angle A = ${angleTex(k1, d1)}$，$\\angle C = ${angleTex(k2, d2)}$，外角 $\\angle CBD = ${angleTex(p, de)}$。求 $x$。`,
            ),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [intOr(d + de, p - k, -x), intOr(180 - d - de, p + k, x + 1), intOr(180 - d, k, -x)],
            solution: paras(
              step(
                1,
                "write the theorem as an equation",
                "把定理写成方程",
                shown(
                  t(
                    `$\\angle CBD$ is the exterior angle at $B$, and $\\angle A$ and $\\angle C$ are the two interior angles not next to it. By the exterior angle theorem, the exterior angle equals their sum.`,
                    `$\\angle CBD$ 是 $B$ 处的外角，$\\angle A$ 和 $\\angle C$ 是与它不相邻的两个内角。由外角定理，外角等于它们的和。`,
                  ),
                ),
              ),
              step(
                2,
                "solve for x",
                "解出 x",
                t(
                  `Combine the right side, then collect the $x$ terms on the left and the numbers on the right:${exteriorWork(e)}`,
                  `先合并右边，再把含 $x$ 的项移到左边、数移到右边：${exteriorWork(e)}`,
                ),
              ),
              check(
                t(
                  `With $x = ${x}$: $\\angle A = ${atX(k1, d1, x)}^\\circ$, $\\angle C = ${atX(k2, d2, x)}^\\circ$ and $\\angle CBD = ${atX(p, de, x)}^\\circ$. Indeed $${a}^\\circ + ${c}^\\circ = ${a + c}^\\circ$. The interior angle at $B$ is $180^\\circ - ${a + c}^\\circ = ${b}^\\circ$, and $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 180^\\circ$.`,
                  `当 $x = ${x}$ 时：$\\angle A = ${atX(k1, d1, x)}^\\circ$，$\\angle C = ${atX(k2, d2, x)}^\\circ$，$\\angle CBD = ${atX(p, de, x)}^\\circ$。确实 $${a}^\\circ + ${c}^\\circ = ${a + c}^\\circ$。$B$ 处的内角是 $180^\\circ - ${a + c}^\\circ = ${b}^\\circ$，而 $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 180^\\circ$。`,
                ),
              ),
            ),
          }),
          figure: exteriorFigure(
            a,
            b,
            labels,
            `Triangle ABC with AB extended past B to D. Angle A is ${labels[0]}, angle C is ${labels[1]} and the exterior angle CBD is ${labels[2]}.`,
            `三角形 ABC，边 AB 延长到 D。角 A 为 ${labels[0]}，角 C 为 ${labels[1]}，外角 CBD 为 ${labels[2]}。`,
          ),
          solutionFigures: [
            figure(
              exteriorMarks(a, b, labels, true),
              `The exterior angle CBD, ${labels[2]}, and the two remote interior angles A, ${labels[0]}, and C, ${labels[1]}, are highlighted.`,
              `突出显示外角 CBD（${labels[2]}）和与它不相邻的两个内角 A（${labels[0]}）、C（${labels[1]}）。`,
            ),
          ],
        };
      },
    },
    {
      id: "angles-from-exterior-angle-equations",
      figure: angleDrawings["angles-from-exterior-angle-equations"],
      title: t("Finding the angles", "求出各角"),
      explanation: t(
        `Solving for $x$ is only halfway: $x$ is a number, not an angle. Substitute it into each expression to get the angles, and then use the straight line at $B$ for the interior angle there.

With $\\angle A = (x + 10)^\\circ$, $\\angle C = 2x^\\circ$ and the exterior angle $\\angle CBD = (4x - 15)^\\circ$, the theorem gives $4x - 15 = 3x + 10$, so $x = 25$. Then

$$\\angle A = 25 + 10 = 35^\\circ, \\qquad \\angle C = 2 \\cdot 25 = 50^\\circ, \\qquad \\angle CBD = 4 \\cdot 25 - 15 = 85^\\circ,$$

and indeed $35^\\circ + 50^\\circ = 85^\\circ$. The interior angle at $B$ makes a straight line with the exterior angle, so $\\angle ABC = 180^\\circ - 85^\\circ = 95^\\circ$; the three interior angles add up to $35^\\circ + 50^\\circ + 95^\\circ = 180^\\circ$.

> **Watch out.** Do not stop at $x = 25$: the question asks for an angle. And $\\angle ABC$ is the interior angle at $B$, the supplement of the exterior angle, not the exterior angle $\\angle CBD$ itself.`,
        `解出 $x$ 只完成了一半：$x$ 是一个数，不是角。把它代入各个式子才得到角；$B$ 处的内角再利用 $B$ 处的平角求出。

若 $\\angle A = (x + 10)^\\circ$，$\\angle C = 2x^\\circ$，外角 $\\angle CBD = (4x - 15)^\\circ$，由外角定理 $4x - 15 = 3x + 10$，所以 $x = 25$。于是

$$\\angle A = 25 + 10 = 35^\\circ, \\qquad \\angle C = 2 \\cdot 25 = 50^\\circ, \\qquad \\angle CBD = 4 \\cdot 25 - 15 = 85^\\circ,$$

确实 $35^\\circ + 50^\\circ = 85^\\circ$。$B$ 处的内角与外角组成平角，所以 $\\angle ABC = 180^\\circ - 85^\\circ = 95^\\circ$；三个内角之和 $35^\\circ + 50^\\circ + 95^\\circ = 180^\\circ$。

> **注意。** 不要停在 $x = 25$：题目问的是角。另外 $\\angle ABC$ 是 $B$ 处的内角，是外角的补角，不是外角 $\\angle CBD$ 本身。`,
      ),
      generate(rng) {
        const e = exteriorSetup(rng);
        const { x, a, b, c, k1, k2, p, d1, d2, de } = e;
        const ext = a + c;
        const ask = rng.int(0, 2);
        const names3 = ["\\angle A", "\\angle C", "\\angle ABC"];
        const answer = [a, c, b][ask]!;
        const labels = [angleLabel(k1, d1), angleLabel(k2, d2), angleLabel(p, de)] as const;
        const found =
          ask === 0
            ? t(`$\\angle A = ${atX(k1, d1, x)}^\\circ$.`, `$\\angle A = ${atX(k1, d1, x)}^\\circ$。`)
            : ask === 1
              ? t(`$\\angle C = ${atX(k2, d2, x)}^\\circ$.`, `$\\angle C = ${atX(k2, d2, x)}^\\circ$。`)
              : t(
                  `The exterior angle is $\\angle CBD = ${atX(p, de, x)}^\\circ$, and $\\angle ABC$ makes a straight line with it:${steps(`\\angle ABC = 180^\\circ - ${ext}^\\circ = ${b}^\\circ`)}`,
                  `外角 $\\angle CBD = ${atX(p, de, x)}^\\circ$，而 $\\angle ABC$ 与它组成平角：${steps(`\\angle ABC = 180^\\circ - ${ext}^\\circ = ${b}^\\circ`)}`,
                );
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\angle A = ${angleTex(k1, d1)}$, $\\angle C = ${angleTex(k2, d2)}$ and the exterior angle $\\angle CBD = ${angleTex(p, de)}$. Find $${names3[ask]}$.`,
              `如图，$\\angle A = ${angleTex(k1, d1)}$，$\\angle C = ${angleTex(k2, d2)}$，外角 $\\angle CBD = ${angleTex(p, de)}$。求 $${names3[ask]}$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [x, ext, 180 - answer, ask === 2 ? a + c : b],
            solution: paras(
              step(
                1,
                "solve for x",
                "解出 x",
                t(
                  `The exterior angle equals the sum of the two remote interior angles, $\\angle A$ and $\\angle C$:${exteriorWork(e)}`,
                  `外角等于与它不相邻的两个内角 $\\angle A$ 与 $\\angle C$ 之和：${exteriorWork(e)}`,
                ),
              ),
              step(2, "substitute x", "代入 x", t(`Put $x = ${x}$ into the expression. `, `把 $x = ${x}$ 代入式子。`), found),
              check(
                shown(
                  t(
                    `All the angles with $x = ${x}$: $\\angle A = ${a}^\\circ$, $\\angle C = ${c}^\\circ$, $\\angle CBD = ${ext}^\\circ$ and $\\angle ABC = ${b}^\\circ$. The exterior angle is the sum of the remote ones, $${a}^\\circ + ${c}^\\circ = ${ext}^\\circ$, and the interior angles add up to $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 180^\\circ$.`,
                    `$x = ${x}$ 时各角为：$\\angle A = ${a}^\\circ$，$\\angle C = ${c}^\\circ$，$\\angle CBD = ${ext}^\\circ$，$\\angle ABC = ${b}^\\circ$。外角等于不相邻两内角之和，$${a}^\\circ + ${c}^\\circ = ${ext}^\\circ$；三个内角之和 $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 180^\\circ$。`,
                  ),
                ),
              ),
            ),
          }),
          figure: exteriorFigure(
            a,
            b,
            labels,
            `Triangle ABC with AB extended past B to D. Angle A is ${labels[0]}, angle C is ${labels[1]} and the exterior angle CBD is ${labels[2]}.`,
            `三角形 ABC，边 AB 延长到 D。角 A 为 ${labels[0]}，角 C 为 ${labels[1]}，外角 CBD 为 ${labels[2]}。`,
          ),
          solutionFigures: [
            figure(
              exteriorMarks(a, b, [deg(a), deg(c), deg(ext)], true, deg(b)),
              `Triangle ABC with its angles found: A ${a}°, C ${c}°, ABC ${b}°, and the exterior angle CBD ${ext}°.`,
              `求出各角的三角形 ABC：A 为 ${a}°，C 为 ${c}°，ABC 为 ${b}°，外角 CBD 为 ${ext}°。`,
            ),
          ],
        };
      },
    },
  ],
};

/** Side names a side of a right triangle drawn by rightTri: 0 is the leg RU, 1 the hypotenuse UV, 2 the leg VR. */
type Side = 0 | 1 | 2;

/** sideEnds are the ends of a side of a right triangle drawn by rightTri. */
const sideEnds = (tri: Tri, side: Side): [Point, Point] =>
  side === 0 ? [tri[0], tri[1]] : side === 1 ? [tri[1], tri[2]] : [tri[2], tri[0]];

/** RightPair is a right triangle drawn for a problem and again for its solution. */
interface RightPair {
  readonly figure: Figure;
  readonly solved: Figure;
}

/** rightPair draws a right triangle with legs p and q in a random pose: for the problem with the given side labels, and for the solution with the solved labels and the side lit in the result color. */
function rightPair(
  rng: Rng,
  p: number,
  q: number,
  sides: readonly [string | null, string | null, string | null],
  solved: readonly [string | null, string | null, string | null],
  lit: Side,
  alt: readonly [string, string],
  solvedAlt: readonly [string, string],
): RightPair {
  const tri = rightTri(p, q, pickPose(rng));
  const [a, b] = sideEnds(tri, lit);
  return {
    figure: figure(rightMarks(tri, { sides }), alt[0], alt[1]),
    solved: figure([...rightMarks(tri, { sides: solved }), hi(a, b)], solvedAlt[0], solvedAlt[1]),
  };
}

/** pythagorasIntro is the 3-4-5 right triangle with a square on each side. */
const pythagorasIntro: Figure = figure(
  [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [3, 0],
        [3, -3],
        [0, -3],
      ],
    },
    {
      kind: "polygon",
      points: [
        [0, 0],
        [0, 4],
        [-4, 4],
        [-4, 0],
      ],
    },
    {
      kind: "polygon",
      points: [
        [3, 0],
        [7, 3],
        [4, 7],
        [0, 4],
      ],
      tone: "result",
    },
    {
      kind: "polygon",
      points: [
        [0, 0],
        [3, 0],
        [0, 4],
      ],
      accent: true,
    },
    { kind: "right", vertex: [0, 0], from: [3, 0], to: [0, 4] },
    { kind: "label", at: [1.5, -1.8], text: "9", dir: "n" },
    { kind: "label", at: [-2, 1.8], text: "16", dir: "n" },
    { kind: "label", at: [3.5, 3.3], text: "25", dir: "n" },
    { kind: "side", a: [3, 0], b: [0, 0], text: "3" },
    { kind: "side", a: [0, 0], b: [0, 4], text: "4" },
  ],
  "A right triangle with legs 3 and 4 and hypotenuse 5, with a square drawn outward on each side: the squares on the legs have areas 9 and 16, the square on the hypotenuse has area 25.",
  "直角边为 3 和 4、斜边为 5 的直角三角形，每条边向外画一个正方形：直角边上的正方形面积为 9 和 16，斜边上的正方形面积为 25。",
);

/** bySides places a triangle with sides a ≤ b ≤ c, the longest side c along the bottom; the apex, opposite c, is the last point. */
function bySides(a: number, b: number, c: number): Tri {
  const x = (b * b - a * a + c * c) / (2 * c);
  return [
    [0, 0],
    [c, 0],
    [x, Math.sqrt(Math.max(b * b - x * x, 0))],
  ];
}

const angleKindsOfTriangles: readonly Text[] = [t("Acute", "锐角三角形"), t("Right", "直角三角形"), t("Obtuse", "钝角三角形")];

export const thePythagoreanTheorem: TopicDef = {
  id: "the-pythagorean-theorem",
  title: t("The Pythagorean Theorem", "勾股定理"),
  summary: t(
    "Find a missing side of a right triangle, exactly or in simplest radical form, and use the converse to classify triangles.",
    "求直角三角形的未知边（精确值或最简根式），并用逆定理判断三角形的类型。",
  ),
  prerequisites: ["solving-equations-with-square-roots", "classifying-triangles"],
  encompasses: [{ topic: "solving-equations-with-square-roots", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.8.G.B.7", "CCSS.8.G.B.6"],
  intro: t(
    `In a right triangle, the side opposite the right angle is the **hypotenuse**, the longest side; the two sides that form the right angle are the **legs**. Knowing two sides, can we find the third? Take legs $3$ and $4$, and draw a square outward on each side:

{{figure 0}}

The squares on the legs have areas $3^2 = 9$ and $4^2 = 16$. The hypotenuse measures $5$, so the square on it has area $5^2 = 25$, and $9 + 16 = 25$: the two smaller squares together have exactly the area of the large one. This holds in every right triangle, and it is the **Pythagorean theorem**: with legs $a$ and $b$ and hypotenuse $c$,

$$a^2 + b^2 = c^2.$$

Because it is about squares, it gives $c^2$ rather than $c$, and we finish with a square root, as with the equations $x^2 = k$ solved before. In this lesson we find the hypotenuse from the legs, a leg from the other two sides, lengths that are not whole numbers in simplest radical form, and finally use the theorem backwards to tell whether a triangle with given sides is acute, right or obtuse.`,
    `直角三角形中，直角所对的边叫**斜边**，是最长的边；组成直角的两条边叫**直角边**。知道两条边，能求出第三条边吗？取直角边 $3$ 和 $4$，在每条边上向外画一个正方形：

{{figure 0}}

直角边上的正方形面积是 $3^2 = 9$ 和 $4^2 = 16$。斜边长 $5$，它上面的正方形面积是 $5^2 = 25$，而 $9 + 16 = 25$：两个小正方形的面积之和正好等于大正方形的面积。每个直角三角形都是这样，这就是**勾股定理**：若直角边为 $a$、$b$，斜边为 $c$，则

$$a^2 + b^2 = c^2.$$

定理讲的是平方，所以它先给出 $c^2$ 而不是 $c$，最后还要开平方，就像以前解 $x^2 = k$ 一样。这节课先由直角边求斜边，再由另两边求一条直角边，把不是整数的长度写成最简根式，最后把定理反过来用，判断给定三边的三角形是锐角、直角还是钝角三角形。`,
  ),
  introFigures: [pythagorasIntro],
  knowledgePoints: [
    {
      id: "finding-the-hypotenuse",
      figure: geometryDrawings2["the-pythagorean-theorem#finding-the-hypotenuse"],
      title: t("Finding the hypotenuse", "求斜边"),
      explanation: t(
        `First find the hypotenuse in the figure: it is the side across from the right-angle mark. The other two sides are the legs $a$ and $b$, and the theorem says

$$a^2 + b^2 = c^2.$$

The squares of the legs add up to the square of the hypotenuse, so add the squares, then undo the squaring with a square root. With legs $6$ and $8$:

$$c^2 = 6^2 + 8^2 = 36 + 64 = 100, \\qquad c = \\sqrt{100} = 10.$$

A length is positive, so only the positive root counts. The answer makes sense: $10$ is longer than each leg, as the hypotenuse must be, and shorter than $6 + 8 = 14$, since a straight side is shorter than the way round the other two.

> **Watch out.** Add the squares, not the legs: $6 + 8 = 14$ is too long. And $100$ is $c^2$, not $c$: take the square root at the end.`,
        `先在图中找出斜边：它是直角标记对面的那条边。另两条边是直角边 $a$ 和 $b$，定理说

$$a^2 + b^2 = c^2.$$

两条直角边的平方和等于斜边的平方，所以先把平方相加，再开平方。直角边为 $6$ 和 $8$ 时：

$$c^2 = 6^2 + 8^2 = 36 + 64 = 100, \\qquad c = \\sqrt{100} = 10.$$

长度是正数，所以只取正的平方根。这个答案是合理的：$10$ 比每条直角边都长，斜边本来就该最长；又比 $6 + 8 = 14$ 短，因为直着走比绕另两边走近。

> **注意。** 要把平方相加，而不是把直角边相加：$6 + 8 = 14$ 太长了。另外 $100$ 是 $c^2$ 而不是 $c$，最后要开平方。`,
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 50);
        const pair = rightPair(
          rng,
          a,
          b,
          [`${a}`, "x", `${b}`],
          [`${a}`, `${c}`, `${b}`],
          1,
          [`A right triangle with legs ${a} and ${b} and hypotenuse x.`, `一个直角三角形，直角边为 ${a} 和 ${b}，斜边为 x。`],
          [
            `The right triangle with the hypotenuse, across from the right angle, highlighted: it is ${c}.`,
            `突出显示直角对面的斜边：它是 ${c}。`,
          ],
        );
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: c,
            form: "integer",
            mistakes: [
              why(
                a + b,
                "You added the legs. Add their squares, then take the square root.",
                "你把两条直角边直接相加了。应把它们的平方相加，再开平方。",
              ),
              why(a * a + b * b, "That is $c^2$. Take the square root to get the hypotenuse.", "这是 $c^2$，还要开平方才是斜边。"),
              why(
                Math.abs(b - a),
                "You subtracted the legs. The hypotenuse comes from adding their squares.",
                "你把两条直角边相减了。斜边要由它们的平方相加得到。",
              ),
            ],
            solution: paras(
              step(
                1,
                "find the hypotenuse",
                "找出斜边",
                t(
                  `$x$ is across from the right angle, so it is the hypotenuse, and $${a}$ and $${b}$ are the legs:${steps(`${a}^2 + ${b}^2 = x^2`)}`,
                  `$x$ 在直角的对面，所以是斜边，$${a}$ 和 $${b}$ 是直角边：${steps(`${a}^2 + ${b}^2 = x^2`)}`,
                ),
              ),
              step(
                2,
                "add the squares and take the root",
                "平方相加再开方",
                shown(
                  t(
                    `A length is positive, so take the positive square root:${chain(`x^2 = ${a * a} + ${b * b} = ${c * c}`, `x = \\sqrt{${c * c}} = ${c}`)}`,
                    `长度是正数，取正的平方根：${chain(`x^2 = ${a * a} + ${b * b} = ${c * c}`, `x = \\sqrt{${c * c}} = ${c}`)}`,
                  ),
                ),
              ),
              check(
                t(
                  `Use the theorem the other way, to get a leg back: $${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b} = ${b}^2$. And $${c}$ is longer than each leg but shorter than $${a} + ${b} = ${a + b}$, as the longest side of a triangle must be.`,
                  `把定理反过来用，求回一条直角边：$${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b} = ${b}^2$。另外 $${c}$ 比每条直角边都长，又比 $${a} + ${b} = ${a + b}$ 短，正符合三角形最长边的要求。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [pair.solved],
        };
      },
    },
    {
      id: "finding-a-leg",
      title: t("Finding a leg", "求直角边"),
      explanation: t(
        `When the hypotenuse is one of the known sides, the unknown is a leg. The theorem still reads $a^2 + b^2 = c^2$, now with $b$ unknown, so subtract $a^2$ from both sides:

$$b^2 = c^2 - a^2.$$

The square of the leg is the square of the hypotenuse minus the square of the other leg: the larger square minus the smaller one. With hypotenuse $13$ and a leg $5$:

$$b^2 = 13^2 - 5^2 = 169 - 25 = 144, \\qquad b = \\sqrt{144} = 12.$$

Then $5^2 + 12^2 = 25 + 144 = 169 = 13^2$, as it should be, and the leg $12$ is shorter than the hypotenuse $13$.

> **Watch out.** Before computing, find the hypotenuse, across from the right angle; it is not always labelled $c$, nor is it always the unknown. Adding the squares here would give a side longer than the hypotenuse. And subtract the squares, not the lengths: $13 - 5 = 8$ is not the leg.`,
        `已知边中有斜边时，要求的是直角边。定理仍是 $a^2 + b^2 = c^2$，只是 $b$ 未知，所以两边同时减去 $a^2$：

$$b^2 = c^2 - a^2.$$

直角边的平方等于斜边的平方减去另一条直角边的平方：大的平方减小的平方。斜边为 $13$、一条直角边为 $5$ 时：

$$b^2 = 13^2 - 5^2 = 169 - 25 = 144, \\qquad b = \\sqrt{144} = 12.$$

于是 $5^2 + 12^2 = 25 + 144 = 169 = 13^2$，正符合定理；直角边 $12$ 也比斜边 $13$ 短。

> **注意。** 计算前先找出斜边，即直角对面的边；它不一定标作 $c$，也不一定是未知的那条。这时若把平方相加，得到的边会比斜边还长。另外要把平方相减，而不是把长度相减：$13 - 5 = 8$ 不是直角边。`,
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 50);
        const pair = rightPair(
          rng,
          a,
          b,
          [`${a}`, `${c}`, "x"],
          [`${a}`, `${c}`, `${b}`],
          2,
          [
            `A right triangle with a leg ${a}, hypotenuse ${c}, and the other leg x.`,
            `一个直角三角形，一条直角边为 ${a}，斜边为 ${c}，另一条直角边为 x。`,
          ],
          [`The right triangle with the leg x highlighted: it is ${b}.`, `突出显示直角边 x：它是 ${b}。`],
        );
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: b,
            form: "integer",
            mistakes: [
              why(
                c - a,
                "You subtracted the lengths. Subtract their squares, then take the square root.",
                "你直接把长度相减了。应把它们的平方相减，再开平方。",
              ),
              why(c * c - a * a, "That is the square of the leg. Take the square root.", "这是直角边的平方，还要开平方。"),
              why(
                c + a,
                "You added. The hypotenuse is the longest side, so a leg comes from subtracting squares.",
                "你做了加法。斜边是最长的边，所以求直角边要用平方相减。",
              ),
            ],
            solution: paras(
              step(
                1,
                "find the hypotenuse",
                "找出斜边",
                t(
                  `$${c}$ is across from the right angle, so it is the hypotenuse, and $x$ is a leg:${steps(`${a}^2 + x^2 = ${c}^2`)}`,
                  `$${c}$ 在直角的对面，是斜边，$x$ 是直角边：${steps(`${a}^2 + x^2 = ${c}^2`)}`,
                ),
              ),
              step(
                2,
                "subtract the squares and take the root",
                "平方相减再开方",
                shown(
                  t(
                    `Subtract $${a}^2$ from both sides, then take the positive square root:${chain(`x^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}`, `x = \\sqrt{${b * b}} = ${b}`)}`,
                    `两边同时减去 $${a}^2$，再取正的平方根：${chain(`x^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}`, `x = \\sqrt{${b * b}} = ${b}`)}`,
                  ),
                ),
              ),
              check(
                t(
                  `Put all three sides into the theorem: $${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} = ${c}^2$. And the leg $${b}$ is shorter than the hypotenuse $${c}$.`,
                  `把三条边代入定理：$${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} = ${c}^2$。直角边 $${b}$ 也比斜边 $${c}$ 短。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [pair.solved],
        };
      },
    },
    {
      id: "lengths-in-simplest-radical-form",
      figure: geometryDrawings2["the-pythagorean-theorem#lengths-in-simplest-radical-form"],
      title: t("Answers in simplest radical form", "最简根式形式的答案"),
      explanation: t(
        `Most right triangles do not have three whole-number sides. When $c^2$ is not a perfect square, leave the length exact as a square root, and write it in **simplest radical form**: take the largest perfect square out of the root, since $\\sqrt{k^2 m} = \\sqrt{k^2} \\cdot \\sqrt{m} = k\\sqrt{m}$.

With legs $4$ and $6$:

$$c^2 = 16 + 36 = 52, \\qquad c = \\sqrt{52} = \\sqrt{4 \\cdot 13} = 2\\sqrt{13}.$$

As a decimal, $2\\sqrt{13} \\approx 7.21$, longer than $6$ and shorter than $4 + 6 = 10$, as a hypotenuse should be.

> **Watch out.** $\\sqrt{52}$ is the right length but not in simplest form until the square factor $4$ comes out. Use the largest square factor: $\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$, not $2\\sqrt{18}$. And square the sides before adding or subtracting: $\\sqrt{4 + 6}$ is not the hypotenuse.`,
        `大多数直角三角形的三边并不都是整数。当 $c^2$ 不是完全平方数时，把长度保留为精确的平方根，并写成**最简根式**：把根号里最大的完全平方因数开出来，因为 $\\sqrt{k^2 m} = \\sqrt{k^2} \\cdot \\sqrt{m} = k\\sqrt{m}$。

直角边为 $4$ 和 $6$ 时：

$$c^2 = 16 + 36 = 52, \\qquad c = \\sqrt{52} = \\sqrt{4 \\cdot 13} = 2\\sqrt{13}.$$

写成小数，$2\\sqrt{13} \\approx 7.21$，比 $6$ 长，又比 $4 + 6 = 10$ 短，符合斜边的要求。

> **注意。** $\\sqrt{52}$ 的值没错，但要把平方因数 $4$ 开出来才是最简形式。要用最大的平方因数：$\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$，而不是 $2\\sqrt{18}$。另外要先把边平方再相加或相减：$\\sqrt{4 + 6}$ 不是斜边。`,
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        for (;;) {
          const hyp = rng.bool();
          const a = rng.int(1, 12);
          const b = hyp ? rng.int(1, 12) : rng.int(a + 1, 16);
          const n = hyp ? a * a + b * b : b * b - a * a;
          const [k, r] = rootOf(n);
          if (r === 1 || (hyp && a > b)) continue;
          const answer = [k, r] as const;
          const value = k * Math.sqrt(r);
          const work = hyp ? `x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${n}` : `x^2 = ${b}^2 - ${a}^2 = ${b * b} - ${a * a} = ${n}`;
          const root = k === 1 ? `x = \\sqrt{${n}}` : `x = \\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${r}} = ${sqrtTex(k, r)}`;
          const simplify =
            k === 1
              ? t(
                  `$${n}$ has no square factor other than $1$, so $\\sqrt{${n}}$ is already in simplest form:`,
                  `$${n}$ 除 $1$ 外没有平方因数，所以 $\\sqrt{${n}}$ 已是最简形式：`,
                )
              : t(
                  `The largest square factor of $${n}$ is $${k * k}$, so take $\\sqrt{${k * k}} = ${k}$ out of the root:`,
                  `$${n}$ 最大的平方因数是 $${k * k}$，把 $\\sqrt{${k * k}} = ${k}$ 开到根号外：`,
                );
          const pair = hyp
            ? rightPair(
                rng,
                a,
                b,
                [`${a}`, "x", `${b}`],
                [`${a}`, label(k, r), `${b}`],
                1,
                [`A right triangle with legs ${a} and ${b} and hypotenuse x.`, `一个直角三角形，直角边为 ${a} 和 ${b}，斜边为 x。`],
                [`The right triangle with the hypotenuse highlighted: it is ${label(k, r)}.`, `突出显示斜边：它是 ${label(k, r)}。`],
              )
            : rightPair(
                rng,
                a,
                Math.sqrt(n),
                [`${a}`, `${b}`, "x"],
                [`${a}`, `${b}`, label(k, r)],
                2,
                [
                  `A right triangle with a leg ${a}, hypotenuse ${b}, and the other leg x.`,
                  `一个直角三角形，一条直角边为 ${a}，斜边为 ${b}，另一条直角边为 x。`,
                ],
                [`The right triangle with the leg x highlighted: it is ${label(k, r)}.`, `突出显示直角边 x：它是 ${label(k, r)}。`],
              );
          const bounds = hyp
            ? t(
                `longer than the leg $${b}$ and shorter than $${a} + ${b} = ${a + b}$, as a hypotenuse must be`,
                `比直角边 $${b}$ 长，又比 $${a} + ${b} = ${a + b}$ 短，符合斜边的要求`,
              )
            : t(`shorter than the hypotenuse $${b}$, as a leg must be`, `比斜边 $${b}$ 短，符合直角边的要求`);
          return {
            ...radicalProblem({
              prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
              answer,
              wrong: [
                `\\sqrt{${hyp ? b * b - a * a : a * a + b * b}}`,
                `${hyp ? a + b : b - a}`,
                k === 1 ? `\\sqrt{${hyp ? a + b : b + a}}` : `\\sqrt{${n}}`,
              ],
              solution: paras(
                step(
                  1,
                  "use the theorem",
                  "用勾股定理",
                  t(
                    `${hyp ? `$x$ is across from the right angle, so it is the hypotenuse; add the squares of the legs` : `$${b}$ is across from the right angle, so it is the hypotenuse and $x$ is a leg; subtract the square of the other leg`}:${steps(work)}`,
                    `${hyp ? "$x$ 在直角的对面，是斜边；把两条直角边的平方相加" : `$${b}$ 在直角的对面，是斜边，$x$ 是直角边；用斜边的平方减去另一条直角边的平方`}：${steps(work)}`,
                  ),
                ),
                step(2, "simplify the root", "化简根式", shown(cat(simplify, steps(root)))),
                check(
                  t(
                    `Square the answer: $(${sqrtTex(k, r)})^2 = ${k === 1 ? `${r}` : `${k * k} \\cdot ${r} = ${n}`}$, which is $x^2$. As a decimal, $${sqrtTex(k, r)} \\approx ${approx(value)}$, ${bounds.en}.`,
                    `把答案平方：$(${sqrtTex(k, r)})^2 = ${k === 1 ? `${r}` : `${k * k} \\cdot ${r} = ${n}`}$，正是 $x^2$。写成小数，$${sqrtTex(k, r)} \\approx ${approx(value)}$，${bounds["zh-CN"]}。`,
                  ),
                ),
              ),
            }),
            figure: pair.figure,
            solutionFigures: [pair.solved],
          };
        }
      },
    },
    {
      id: "the-converse",
      figure: congruenceDrawings["the-pythagorean-theorem#the-converse"],
      title: t("The converse", "逆定理"),
      explanation: t(
        `The **converse** of the theorem also holds: if the sides satisfy $a^2 + b^2 = c^2$, the triangle is a right triangle. Think of two sides $a$ and $b$ joined by a hinge. At a right angle, the third side is exactly $\\sqrt{a^2 + b^2}$. Open the hinge wider and the third side grows; close it and the side shrinks. So comparing the square of the longest side $c$ with the sum of the squares of the other two tells the largest angle, the one across from $c$:

- $c^2 = a^2 + b^2$: right;
- $c^2 < a^2 + b^2$: acute;
- $c^2 > a^2 + b^2$: obtuse.

For sides $5$, $7$, $9$: $9^2 = 81$ and $5^2 + 7^2 = 25 + 49 = 74$. Since $81 > 74$, the side $9$ is longer than it would be at a right angle ($\\sqrt{74} \\approx 8.6$), and the triangle is obtuse.

> **Watch out.** Square the longest side and compare it with the other two; using a shorter side as $c$ always looks acute. And compare squares, not lengths: $9 < 5 + 7$ only says that the triangle exists.`,
        `勾股定理的**逆定理**也成立：若三边满足 $a^2 + b^2 = c^2$，则这个三角形是直角三角形。设想两条边 $a$、$b$ 用铰链连在一起。成直角时，第三边正好是 $\\sqrt{a^2 + b^2}$。把铰链张大，第三边变长；收小，第三边变短。所以把最长边 $c$ 的平方与另两边的平方和比较，就能判断最大的角，也就是 $c$ 所对的角：

- $c^2 = a^2 + b^2$：直角三角形；
- $c^2 < a^2 + b^2$：锐角三角形；
- $c^2 > a^2 + b^2$：钝角三角形。

三边为 $5$、$7$、$9$ 时：$9^2 = 81$，$5^2 + 7^2 = 25 + 49 = 74$。因为 $81 > 74$，边 $9$ 比成直角时的第三边（$\\sqrt{74} \\approx 8.6$）还长，所以是钝角三角形。

> **注意。** 要把最长边平方，再与另两边比较；把较短的边当作 $c$，看起来总像锐角三角形。另外比较的是平方，不是长度：$9 < 5 + 7$ 只说明这个三角形存在。`,
      ),
      generate(rng) {
        for (;;) {
          let sides: number[];
          if (rng.bool(0.35)) sides = pickTriple(rng, 45);
          else sides = [rng.int(3, 20), rng.int(3, 20), rng.int(3, 24)];
          const [a, b, c] = [...sides].sort((x, y) => x - y) as [number, number, number];
          if (a + b <= c || new Set(sides).size < 3) continue;
          const lhs = a * a + b * b;
          const kind = c * c === lhs ? 1 : c * c < lhs ? 0 : 2;
          const rel = ["<", "=", ">"][kind]!;
          const order = rng.shuffle([a, b, c]);
          const tri = bySides(a, b, c);
          const marks: Mark[] = [{ kind: "polygon", points: tri }, ...outside(tri, [`${c}`, `${a}`, `${b}`]), hi(tri[0], tri[1])];
          marks.push(
            kind === 1
              ? { kind: "right", vertex: tri[2], from: tri[0], to: tri[1] }
              : { kind: "arc", vertex: tri[2], from: tri[0], to: tri[1], tone: "result" },
          );
          const right = Math.sqrt(lhs);
          const compare = [t("shorter than", "比……短"), t("exactly as long as", "正好等于"), t("longer than", "比……长")][kind]!;
          const opens = [
            t("narrower than a right angle", "小于直角"),
            t("exactly a right angle", "正好是直角"),
            t("wider than a right angle", "大于直角"),
          ][kind]!;
          const wrongWhy = [0, 1, 2]
            .filter((w) => w !== kind)
            .map(
              (w) =>
                [
                  angleKindsOfTriangles[w]!.en,
                  `That needs $${c}^2 ${["<", "=", ">"][w]} ${a}^2 + ${b}^2$, but $${c * c} ${rel} ${lhs}$.`,
                  `那需要 $${c}^2 ${["<", "=", ">"][w]} ${a}^2 + ${b}^2$，而实际上 $${c * c} ${rel} ${lhs}$。`,
                ] as const,
            );
          const zhCompare = kind === 1 ? `正好等于这个长度` : kind === 0 ? `比这个长度短` : `比这个长度长`;
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `A triangle has sides of lengths $${order[0]}$, $${order[1]}$ and $${order[2]}$. Is it acute, right or obtuse?`,
                  `一个三角形的三边长为 $${order[0]}$、$${order[1]}$、$${order[2]}$。它是锐角、直角还是钝角三角形？`,
                ),
                options: angleKindsOfTriangles,
                correct: kind,
                solution: paras(
                  step(
                    1,
                    "square the longest side",
                    "把最长边平方",
                    t(
                      `The longest side is $${c}$; the largest angle is across from it:${steps(`${c}^2 = ${c * c}`)}`,
                      `最长边是 $${c}$，最大的角在它的对面：${steps(`${c}^2 = ${c * c}`)}`,
                    ),
                  ),
                  step(
                    2,
                    "compare with the other two",
                    "与另两边比较",
                    shown(
                      t(
                        `Add the squares of the other two sides and compare:${steps(`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${lhs}`, `${c * c} ${rel} ${lhs}`)}So the triangle is ${angleKindsOfTriangles[kind]!.en.toLowerCase()}.`,
                        `把另两边的平方相加并比较：${steps(`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${lhs}`, `${c * c} ${rel} ${lhs}`)}所以这是${angleKindsOfTriangles[kind]!["zh-CN"]}。`,
                      ),
                    ),
                  ),
                  check(
                    t(
                      `If the sides $${a}$ and $${b}$ met at a right angle, the third side would be $\\sqrt{${lhs}}${kind === 1 ? "" : ` \\approx ${approx(right)}`}$${kind === 1 ? ` = ${c}` : ""}. The actual side $${c}$ is ${compare.en} that, so the angle across from it is ${opens.en}.`,
                      `若边 $${a}$ 和 $${b}$ 成直角，第三边应为 $\\sqrt{${lhs}}${kind === 1 ? "" : ` \\approx ${approx(right)}`}$${kind === 1 ? ` = ${c}` : ""}。实际的边 $${c}$ ${zhCompare}，所以它所对的角${opens["zh-CN"]}。`,
                    ),
                  ),
                ),
              }),
              wrongWhy,
            ),
            solutionFigures: [
              figure(
                marks,
                `The triangle with sides ${a}, ${b} and ${c}, drawn to scale; the longest side ${c} is highlighted with the angle across from it.`,
                `按比例画出的三边为 ${a}、${b}、${c} 的三角形；突出显示最长边 ${c} 及其所对的角。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** valueS is the decimal value of an exact number. */
const valueS = (s: S) => s[0].toNumber() * Math.sqrt(s[1]);

/** eqs joins the members of a chain of equal expressions, leaving out one that repeats the one before. */
const eqs = (...parts: readonly string[]) => parts.filter((x, i) => x !== parts[i - 1]).join(" = ");

/** pow2 writes the square of a number in LaTeX, with parentheses only when the number has a root or a fraction in it. */
const pow2 = (tex: string) => (tex.includes("\\") ? `(${tex})^2` : `${tex}^2`);

/** sqS is the square of an exact number, a rational number. */
const sqS = (s: S): Q => s[0].mul(s[0]).mul(q(s[1]));

/** figS writes an exact number for a figure: "5√3", "9/2", "7√3/2". */
function figS(s: S): string {
  const n = Number(s[0].n);
  const d = Number(s[0].d);
  const top = s[1] === 1 ? `${n}` : `${n === 1 ? "" : n}√${s[1]}`;
  return d === 1 ? top : `${top}/${d}`;
}

/** Labels are the labels of the sides RU, UV (the hypotenuse) and VR of a right triangle drawn by rightTri. */
type Labels = readonly [string | null, string | null, string | null];

/** isoRightMarks draws an isosceles right triangle with side labels, ticks on its equal legs and a 45° mark. */
function isoRightMarks(tri: Tri, sides: Labels): Mark[] {
  const [r, u, v] = tri;
  return [...rightMarks(tri, { sides, atU: "45°" }), { kind: "ticks", a: r, b: u, count: 1 }, { kind: "ticks", a: v, b: r, count: 1 }];
}

/** SpecialPair is a special right triangle drawn for a problem and again for its solution, in the same pose. */
interface SpecialPair {
  readonly tri: Tri;
  readonly figure: Figure;
  readonly solved: (sides: Labels, lit: readonly Side[], extra: readonly Mark[], en: string, zh: string) => Figure;
}

/** isoRightPair draws an isosceles right triangle with leg and hypotenuse labels, and gives a drawing of its solution in the same pose. */
function isoRightPair(rng: Rng, sides: Labels, en: string, zh: string): SpecialPair {
  const tri = rightTri(4, 4, pickPose(rng));
  return {
    tri,
    figure: figure(isoRightMarks(tri, sides), en, zh),
    solved: (s, lit, extra, sen, szh) => figure([...isoRightMarks(tri, s), ...lit.map((i) => hi(...sideEnds(tri, i))), ...extra], sen, szh),
  };
}

/** thirtySixtyPair draws a 30°-60°-90° triangle with its shorter leg along RU and labels for the shorter leg, hypotenuse and longer leg, and gives a drawing of its solution in the same pose. */
function thirtySixtyPair(rng: Rng, sides: Labels, en: string, zh: string): SpecialPair {
  const tri = rightTri(1, Math.sqrt(3), pickPose(rng));
  const marks = (s: Labels) => rightMarks(tri, { sides: s, atU: "60°", atV: "30°" });
  return {
    tri,
    figure: figure(marks(sides), en, zh),
    solved: (s, lit, extra, sen, szh) => figure([...marks(s), ...lit.map((i) => hi(...sideEnds(tri, i))), ...extra], sen, szh),
  };
}

/** sumTex writes a + b√m in LaTeX. */
const sumTex = (a: number, b: number, m: number) => `${a} + ${sqrtTex(b, m)}`;

/** timesRoot2 writes the product of an exact number and √2 in LaTeX, through the step that multiplies the roots. */
function timesRoot2(s: S): string {
  const prod = mulS(s, [Q.one, 2]);
  if (s[1] === 1) return `${texS(s)} \\cdot \\sqrt{2} = ${texS(prod)}`;
  if (s[1] === 2) return `${texS(s)} \\cdot \\sqrt{2} = ${s[0].toLatex()} \\cdot 2 = ${texS(prod)}`;
  return `${texS(s)} \\cdot \\sqrt{2} = ${s[0].toLatex()}\\sqrt{${2 * s[1]}} = ${texS(prod)}`;
}

/** overRoot writes c / √r rationalized, for r = 2 or 3: multiply the top and the bottom by √r, or cancel the roots when c is a multiple of √r. */
function overRoot(c: S, r: 2 | 3): string {
  if (c[1] === r) return `\\frac{${texS(c)}}{\\sqrt{${r}}} = ${texS(divS(c, [Q.one, r]))}`;
  const top = texS(mulS(c, [Q.one, r]));
  const parts = [
    `\\frac{${texS(c)}}{\\sqrt{${r}}}`,
    `\\frac{${texS(c)} \\cdot \\sqrt{${r}}}{\\sqrt{${r}} \\cdot \\sqrt{${r}}}`,
    `\\frac{${top}}{${r}}`,
    texS(divS(c, [Q.one, r])),
  ];
  return parts.filter((x, i) => x !== parts[i - 1]).join(" = ");
}

/** isoRightIntro is a square of side 5 cut by a diagonal into two isosceles right triangles. */
const isoRightIntro: Figure = figure(
  [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [5, 0],
        [5, 5],
        [0, 5],
      ],
    },
    {
      kind: "polygon",
      points: [
        [0, 0],
        [5, 0],
        [5, 5],
      ],
      tone: "result",
    },
    { kind: "right", vertex: [5, 0], from: [0, 0], to: [5, 5] },
    { kind: "ticks", a: [0, 0], b: [5, 0], count: 1 },
    { kind: "ticks", a: [5, 0], b: [5, 5], count: 1 },
    { kind: "arc", vertex: [0, 0], from: [5, 0], to: [5, 5], label: "45°" },
    { kind: "arc", vertex: [5, 5], from: [0, 0], to: [5, 0], label: "45°" },
    { kind: "side", a: [0, 0], b: [5, 0], text: "5" },
    { kind: "side", a: [5, 0], b: [5, 5], text: "5" },
  ],
  "A square of side 5 cut by a diagonal; the lower triangle, with legs 5 and 5 and angles of 45° at the ends of the diagonal, is highlighted.",
  "边长为 5 的正方形被一条对角线切开；突出显示下面的三角形，它的直角边都是 5，对角线两端的角都是 45°。",
);

export const isoscelesRightTriangles: TopicDef = {
  id: "isosceles-right-triangles",
  title: t("Isosceles Right Triangles", "等腰直角三角形"),
  summary: t(
    "Use the side ratio 1 : 1 : √2 of a 45°-45°-90° triangle to find its sides and perimeter.",
    "利用 45°-45°-90° 三角形的边长比 1 : 1 : √2 求边长与周长。",
  ),
  prerequisites: ["the-pythagorean-theorem", "isosceles-triangles", "rationalizing-denominators"],
  encompasses: [{ topic: "rationalizing-denominators", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `Cut a square along a diagonal and you get two copies of a special triangle. Take a square of side $5$:

{{figure 0}}

Each half has a right angle and two legs of $5$, so it is an **isosceles right triangle**. Its base angles are equal, as in every isosceles triangle, and they share the $90^\\circ$ left over by the right angle, so each is $45^\\circ$. The Pythagorean theorem gives the diagonal:

$$c^2 = 5^2 + 5^2 = 50, \\qquad c = \\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2} \\approx 7.07.$$

Nothing here depended on the $5$: legs $s$ give $c^2 = 2s^2$ and $c = s\\sqrt{2}$. So every $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle has its sides in the ratio $1 : 1 : \\sqrt{2}$, and one side is enough to find the others without the theorem. In this lesson we find the hypotenuse from a leg, a leg from the hypotenuse, and the perimeter.`,
    `沿对角线把正方形切开，就得到两个一样的特殊三角形。取边长为 $5$ 的正方形：

{{figure 0}}

每一半都有一个直角，两条直角边都是 $5$，所以是**等腰直角三角形**。和所有等腰三角形一样，它的两个底角相等，它们平分直角剩下的 $90^\\circ$，所以各是 $45^\\circ$。由勾股定理求对角线：

$$c^2 = 5^2 + 5^2 = 50, \\qquad c = \\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2} \\approx 7.07.$$

这里和 $5$ 这个数没有关系：直角边为 $s$ 时，$c^2 = 2s^2$，$c = s\\sqrt{2}$。所以每个 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形的三边之比都是 $1 : 1 : \\sqrt{2}$，知道一条边就能求出其余的边，不必再用勾股定理。这节课由直角边求斜边，由斜边求直角边，再求周长。`,
  ),
  introFigures: [isoRightIntro],
  knowledgePoints: [
    {
      id: "hypotenuse-from-a-leg",
      figure: specialDrawings["hypotenuse-from-a-leg"],
      title: t("The hypotenuse from a leg", "由直角边求斜边"),
      explanation: t(
        `An **isosceles right triangle** has two equal legs, so its acute angles are both $45^\\circ$: it is a $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle. With legs $s$, the Pythagorean theorem gives $c^2 = s^2 + s^2 = 2s^2$, and the square root of $2s^2$ is $s\\sqrt{2}$:

$$c = s\\sqrt{2}.$$

The sides are in the ratio $1 : 1 : \\sqrt{2}$. A leg of $7$ gives a hypotenuse of $7\\sqrt{2} \\approx 9.9$. When the leg already has a root, multiply the roots: a leg of $3\\sqrt{2}$ gives $3\\sqrt{2} \\cdot \\sqrt{2} = 3 \\cdot 2 = 6$, and a leg of $4\\sqrt{3}$ gives $4\\sqrt{6}$.

> **Watch out.** The hypotenuse is the leg times $\\sqrt{2} \\approx 1.41$, not times $2$: two legs laid end to end are longer than the straight way across. And $\\sqrt{3}$ belongs to the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle, not to this one.`,
        `**等腰直角三角形**的两条直角边相等，所以两个锐角都是 $45^\\circ$：它是 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形。直角边为 $s$ 时，由勾股定理 $c^2 = s^2 + s^2 = 2s^2$，而 $2s^2$ 的平方根是 $s\\sqrt{2}$：

$$c = s\\sqrt{2}.$$

三边之比为 $1 : 1 : \\sqrt{2}$。直角边为 $7$ 时斜边是 $7\\sqrt{2} \\approx 9.9$。直角边本身含根号时，把根号相乘：直角边为 $3\\sqrt{2}$ 时斜边是 $3\\sqrt{2} \\cdot \\sqrt{2} = 3 \\cdot 2 = 6$，直角边为 $4\\sqrt{3}$ 时斜边是 $4\\sqrt{6}$。

> **注意。** 斜边是直角边乘以 $\\sqrt{2} \\approx 1.41$，不是乘以 $2$：两条直角边首尾相接，比斜着直接走过去要长。另外 $\\sqrt{3}$ 属于 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，与这里无关。`,
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 1, 2, 3]);
        const leg = surd(k, m);
        const answer = mulS(leg, [Q.one, 2]);
        const legTex = sqrtTex(k, m);
        const sq = sqS(leg);
        const pair = isoRightPair(
          rng,
          [label(k, m), "x", null],
          `An isosceles right triangle with legs ${label(k, m)} and hypotenuse x.`,
          `一个等腰直角三角形，直角边为 ${label(k, m)}，斜边为 x。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [`${2 * k}${m === 1 ? "" : `\\sqrt{${m}}`}`, texS(mulS(leg, [Q.one, 3])), texS(divS(leg, [Q.one, 2]))],
            solution: paras(
              step(
                1,
                "use the ratio of the sides",
                "用三边之比",
                t(
                  `The tick marks say that both legs are $${legTex}$, so this is a $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle, with sides in the ratio $1 : 1 : \\sqrt{2}$: the hypotenuse $x$ is a leg times $\\sqrt{2}$.`,
                  `刻痕表明两条直角边都是 $${legTex}$，所以这是 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形，三边之比为 $1 : 1 : \\sqrt{2}$：斜边 $x$ 等于直角边乘以 $\\sqrt{2}$。`,
                ),
              ),
              step(
                2,
                "multiply by the square root of 2",
                "乘以根号 2",
                shown(
                  t(
                    `Multiply the leg by $\\sqrt{2}$:${steps(`x = ${timesRoot2(leg)}`)}`,
                    `把直角边乘以 $\\sqrt{2}$：${steps(`x = ${timesRoot2(leg)}`)}`,
                  ),
                ),
              ),
              check(
                t(
                  `Put the three sides into the Pythagorean theorem: $${pow2(legTex)} + ${pow2(legTex)} = ${sq.toLatex()} + ${sq.toLatex()} = ${sq.mul(q(2)).toLatex()}$, and $${pow2(texS(answer))} = ${sqS(answer).toLatex()}$. As decimals, $${texS(answer)} ${answer[1] === 1 && answer[0].toNumber() % 1 === 0 ? "=" : "\\approx"} ${approx(valueS(answer))}$ is about $1.41$ times the leg $${approx(valueS(leg))}$.`,
                  `把三条边代入勾股定理：$${pow2(legTex)} + ${pow2(legTex)} = ${sq.toLatex()} + ${sq.toLatex()} = ${sq.mul(q(2)).toLatex()}$，而 $${pow2(texS(answer))} = ${sqS(answer).toLatex()}$。写成小数，$${texS(answer)} ${answer[1] === 1 && answer[0].toNumber() % 1 === 0 ? "=" : "\\approx"} ${approx(valueS(answer))}$，约是直角边 $${approx(valueS(leg))}$ 的 $1.41$ 倍。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [label(k, m), figS(answer), label(k, m)],
              [1],
              [],
              `The isosceles right triangle with legs ${label(k, m)} and the hypotenuse highlighted: ${figS(answer)}.`,
              `直角边为 ${label(k, m)} 的等腰直角三角形，突出显示斜边：${figS(answer)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "a-leg-from-the-hypotenuse",
      title: t("A leg from the hypotenuse", "由斜边求直角边"),
      explanation: t(
        `Going the other way, the hypotenuse is $s\\sqrt{2}$, so the leg is the hypotenuse divided by $\\sqrt{2}$. To write it in simplest form, multiply the top and the bottom by $\\sqrt{2}$, which removes the root from the denominator because $\\sqrt{2} \\cdot \\sqrt{2} = 2$:

$$s = \\frac{c}{\\sqrt{2}} = \\frac{c\\sqrt{2}}{2}.$$

A hypotenuse of $10$ gives legs of $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2} \\approx 7.07$. A hypotenuse of $9\\sqrt{2}$ gives legs of $\\frac{9\\sqrt{2}}{\\sqrt{2}} = 9$: the roots cancel.

> **Watch out.** Divide by $\\sqrt{2}$, not by $2$ and not multiply: half the hypotenuse is too short for a leg, since two legs together are longer than the hypotenuse, and a leg times $\\sqrt{2}$ would be longer than the hypotenuse. And $\\frac{10}{\\sqrt{2}}$ is not yet simplest form, with a root in the denominator.`,
        `反过来，斜边是 $s\\sqrt{2}$，所以直角边等于斜边除以 $\\sqrt{2}$。为了写成最简形式，分子分母同乘 $\\sqrt{2}$；因为 $\\sqrt{2} \\cdot \\sqrt{2} = 2$，分母里的根号就消失了：

$$s = \\frac{c}{\\sqrt{2}} = \\frac{c\\sqrt{2}}{2}.$$

斜边为 $10$ 时直角边是 $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2} \\approx 7.07$。斜边为 $9\\sqrt{2}$ 时直角边是 $\\frac{9\\sqrt{2}}{\\sqrt{2}} = 9$：根号约掉了。

> **注意。** 要除以 $\\sqrt{2}$，不是除以 $2$，也不是乘以 $\\sqrt{2}$：斜边的一半作直角边太短，因为两条直角边之和比斜边长；而乘以 $\\sqrt{2}$ 会比斜边还长。另外 $\\frac{10}{\\sqrt{2}}$ 分母里还有根号，不是最简形式。`,
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const k = rng.int(2, 20);
        const m = rng.pick([1, 1, 2, 3]);
        const hyp = surd(k, m);
        const answer = divS(hyp, [Q.one, 2]);
        const hypTex = sqrtTex(k, m);
        const sq = sqS(answer);
        const pair = isoRightPair(
          rng,
          ["x", label(k, m), null],
          `An isosceles right triangle with hypotenuse ${label(k, m)} and legs x.`,
          `一个等腰直角三角形，斜边为 ${label(k, m)}，直角边为 x。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [texS(mulS(hyp, [Q.one, 2])), texS([hyp[0].div(q(2)), hyp[1]]), `\\frac{${hypTex}}{\\sqrt{2}}`],
            solution: paras(
              step(
                1,
                "divide by the square root of 2",
                "除以根号 2",
                t(
                  `The legs are equal, so the sides are in the ratio $1 : 1 : \\sqrt{2}$ and the hypotenuse is a leg times $\\sqrt{2}$:${steps(`x\\sqrt{2} = ${hypTex}`, `x = \\frac{${hypTex}}{\\sqrt{2}}`)}`,
                  `两条直角边相等，三边之比为 $1 : 1 : \\sqrt{2}$，斜边等于直角边乘以 $\\sqrt{2}$：${steps(`x\\sqrt{2} = ${hypTex}`, `x = \\frac{${hypTex}}{\\sqrt{2}}`)}`,
                ),
              ),
              step(
                2,
                m === 2 ? "cancel the roots" : "rationalize the denominator",
                m === 2 ? "约去根号" : "分母有理化",
                shown(
                  m === 2
                    ? t(
                        `The top and the bottom both have a factor $\\sqrt{2}$, which cancels:${steps(`x = ${overRoot(hyp, 2)}`)}`,
                        `分子分母都含因数 $\\sqrt{2}$，可以约去：${steps(`x = ${overRoot(hyp, 2)}`)}`,
                      )
                    : t(
                        `Multiply the top and the bottom by $\\sqrt{2}$, so that the denominator becomes $2$:${steps(`x = ${overRoot(hyp, 2)}`)}`,
                        `分子分母同乘 $\\sqrt{2}$，使分母变成 $2$：${steps(`x = ${overRoot(hyp, 2)}`)}`,
                      ),
                ),
              ),
              check(
                t(
                  `Multiply back: $${timesRoot2(answer)}$, the hypotenuse. And by the Pythagorean theorem, $x^2 + x^2 = ${sq.toLatex()} + ${sq.toLatex()} = ${sq.mul(q(2)).toLatex()} = ${pow2(hypTex)}$.`,
                  `乘回去：$${timesRoot2(answer)}$，正是斜边。再用勾股定理，$x^2 + x^2 = ${sq.toLatex()} + ${sq.toLatex()} = ${sq.mul(q(2)).toLatex()} = ${pow2(hypTex)}$。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [figS(answer), label(k, m), figS(answer)],
              [0, 2],
              [],
              `The isosceles right triangle with hypotenuse ${label(k, m)} and the legs highlighted: ${figS(answer)} each.`,
              `斜边为 ${label(k, m)} 的等腰直角三角形，突出显示两条直角边：各为 ${figS(answer)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "perimeter-of-an-isosceles-right-triangle",
      figure: specialDrawings["perimeter-of-an-isosceles-right-triangle"],
      title: t("The perimeter", "周长"),
      explanation: t(
        `The perimeter is the sum of all three sides, so find the missing sides first with the ratio $1 : 1 : \\sqrt{2}$, then add. A triangle with legs $6$ has hypotenuse $6\\sqrt{2}$ and perimeter

$$6 + 6 + 6\\sqrt{2} = 12 + 6\\sqrt{2} \\approx 20.49.$$

The whole numbers add to $12$, but $12$ and $6\\sqrt{2}$ are unlike terms, as $12$ and $6x$ would be, so they stay separate. Starting from the hypotenuse, divide by $\\sqrt{2}$ first: a hypotenuse of $8$ gives legs of $4\\sqrt{2}$ and a perimeter of $8 + 8\\sqrt{2}$.

> **Watch out.** Do not add $12 + 6\\sqrt{2}$ into $18\\sqrt{2}$ or $18$: a whole number and a multiple of $\\sqrt{2}$ do not combine. And use the right side for each role: from a hypotenuse of $8$, the legs are $4\\sqrt{2}$, not $8$.`,
        `周长是三条边之和，所以先用 $1 : 1 : \\sqrt{2}$ 求出未知的边，再相加。直角边为 $6$ 的三角形斜边是 $6\\sqrt{2}$，周长是

$$6 + 6 + 6\\sqrt{2} = 12 + 6\\sqrt{2} \\approx 20.49.$$

整数相加得 $12$，但 $12$ 与 $6\\sqrt{2}$ 不是同类项，就像 $12$ 与 $6x$ 一样，要分开写。若已知斜边，先除以 $\\sqrt{2}$：斜边为 $8$ 时，直角边是 $4\\sqrt{2}$，周长是 $8 + 8\\sqrt{2}$。

> **注意。** 不要把 $12 + 6\\sqrt{2}$ 合并成 $18\\sqrt{2}$ 或 $18$：整数与 $\\sqrt{2}$ 的倍数不能合并。另外每条边要用对：斜边为 $8$ 时，直角边是 $4\\sqrt{2}$，不是 $8$。`,
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const fromLeg = rng.bool();
        const answer = fromLeg ? sumTex(2 * k, k, 2) : sumTex(2 * k, 2 * k, 2);
        const value = fromLeg ? 2 * k + k * Math.SQRT2 : 2 * k + 2 * k * Math.SQRT2;
        const given = fromLeg ? t(`legs of length $${k}$`, `直角边长 $${k}$`) : t(`a hypotenuse of length $${2 * k}$`, `斜边长 $${2 * k}$`);
        const pair = isoRightPair(rng, [null, null, null], "", "");
        const legL = fromLeg ? `${k}` : `${k}√2`;
        const hypL = fromLeg ? `${k}√2` : `${2 * k}`;
        return {
          ...expressionProblem({
            prompt: t(
              `An isosceles right triangle has ${given.en}. Find its perimeter in simplest radical form.`,
              `一个等腰直角三角形的${given["zh-CN"]}。求它的周长，写成最简根式。`,
            ),
            answer,
            radical: true,
            wrong: [
              fromLeg ? `${3 * k}` : `${3 * k}\\sqrt{2}`,
              fromLeg ? `${3 * k}\\sqrt{2}` : `${6 * k}`,
              fromLeg ? sumTex(k, 2 * k, 2) : sumTex(4 * k, 2 * k, 2),
            ],
            solution: paras(
              step(
                1,
                "find the missing sides",
                "求出未知的边",
                shown(
                  fromLeg
                    ? t(
                        `The sides are in the ratio $1 : 1 : \\sqrt{2}$. Both legs are $${k}$, and the hypotenuse is a leg times $\\sqrt{2}$:${steps(`c = ${k}\\sqrt{2}`)}`,
                        `三边之比为 $1 : 1 : \\sqrt{2}$。两条直角边都是 $${k}$，斜边等于直角边乘以 $\\sqrt{2}$：${steps(`c = ${k}\\sqrt{2}`)}`,
                      )
                    : t(
                        `The sides are in the ratio $1 : 1 : \\sqrt{2}$, so each leg is the hypotenuse divided by $\\sqrt{2}$:${steps(`s = \\frac{${2 * k}}{\\sqrt{2}} = \\frac{${2 * k}\\sqrt{2}}{2} = ${k}\\sqrt{2}`)}`,
                        `三边之比为 $1 : 1 : \\sqrt{2}$，所以每条直角边等于斜边除以 $\\sqrt{2}$：${steps(`s = \\frac{${2 * k}}{\\sqrt{2}} = \\frac{${2 * k}\\sqrt{2}}{2} = ${k}\\sqrt{2}`)}`,
                      ),
                ),
              ),
              step(
                2,
                "add the sides",
                "三边相加",
                fromLeg
                  ? t(
                      `Add the whole numbers and keep the multiple of $\\sqrt{2}$ apart:${steps(`P = ${k} + ${k} + ${k}\\sqrt{2} = ${answer}`)}`,
                      `整数相加，$\\sqrt{2}$ 的倍数单独保留：${steps(`P = ${k} + ${k} + ${k}\\sqrt{2} = ${answer}`)}`,
                    )
                  : t(
                      `The two legs are like terms and combine; the hypotenuse $${2 * k}$ stays apart:${steps(`P = ${k}\\sqrt{2} + ${k}\\sqrt{2} + ${2 * k} = ${answer}`)}`,
                      `两条直角边是同类项，可以合并；斜边 $${2 * k}$ 单独保留：${steps(`P = ${k}\\sqrt{2} + ${k}\\sqrt{2} + ${2 * k} = ${answer}`)}`,
                    ),
              ),
              check(
                t(
                  `The sides satisfy the Pythagorean theorem: ${fromLeg ? `$${k}^2 + ${k}^2 = ${2 * k * k} = (${k}\\sqrt{2})^2$` : `$(${k}\\sqrt{2})^2 + (${k}\\sqrt{2})^2 = ${2 * k * k} + ${2 * k * k} = ${4 * k * k} = ${2 * k}^2$`}. As a decimal, $${answer} \\approx ${approx(value)}$, which is between three legs, $${fromLeg ? 3 * k : approx(3 * k * Math.SQRT2)}$, and three hypotenuses, $${fromLeg ? approx(3 * k * Math.SQRT2) : 6 * k}$.`,
                  `三边满足勾股定理：${fromLeg ? `$${k}^2 + ${k}^2 = ${2 * k * k} = (${k}\\sqrt{2})^2$` : `$(${k}\\sqrt{2})^2 + (${k}\\sqrt{2})^2 = ${2 * k * k} + ${2 * k * k} = ${4 * k * k} = ${2 * k}^2$`}。写成小数，$${answer} \\approx ${approx(value)}$，介于三条直角边之和 $${fromLeg ? 3 * k : approx(3 * k * Math.SQRT2)}$ 与三条斜边之和 $${fromLeg ? approx(3 * k * Math.SQRT2) : 6 * k}$ 之间。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            pair.solved(
              [legL, hypL, legL],
              fromLeg ? [1] : [0, 2],
              [],
              `An isosceles right triangle with legs ${legL} and hypotenuse ${hypL}; the side just found is highlighted.`,
              `直角边为 ${legL}、斜边为 ${hypL} 的等腰直角三角形；突出显示刚求出的边。`,
            ),
          ],
        };
      },
    },
  ],
};

/** thirtySixtyIntro is an equilateral triangle of side 6 cut by a height into two 30°-60°-90° triangles. */
const thirtySixtyIntro: Figure = (() => {
  const [a, b, c, d]: [Point, Point, Point, Point] = [
    [0, 0],
    [6, 0],
    [3, 3 * Math.sqrt(3)],
    [3, 0],
  ];
  return figure(
    [
      { kind: "polygon", points: [a, b, c] },
      { kind: "polygon", points: [a, d, c], tone: "result" },
      { kind: "segment", a: c, b: d, dashed: true },
      { kind: "right", vertex: d, from: a, to: c },
      { kind: "arc", vertex: a, from: d, to: c, label: "60°" },
      { kind: "arc", vertex: c, from: a, to: d, label: "30°" },
      { kind: "side", a: c, b: a, text: "6" },
      { kind: "side", a, b: d, text: "3" },
      { kind: "side", a: d, b: c, text: "?" },
    ],
    "An equilateral triangle of side 6 cut by its height into two halves. The left half is highlighted: hypotenuse 6, shorter leg 3 along the base, angles 60° at the base and 30° at the top, and the height marked with a question mark.",
    "边长为 6 的等边三角形被它的高分成两半。突出显示左半部分：斜边 6，底边上的较短直角边 3，底角 60°，顶角 30°，高用问号标出。",
  );
})();

/** sideNames name the sides of a special right triangle. */
const sideNames = {
  short: t("the shorter leg", "较短的直角边"),
  long: t("the longer leg", "较长的直角边"),
  hyp: t("the hypotenuse", "斜边"),
};

export const thirtySixtyNinetyTriangles: TopicDef = {
  id: "thirty-sixty-ninety-triangles",
  title: t("30-60-90 Triangles", "30°-60°-90° 三角形"),
  summary: t(
    "Use the side ratio 1 : √3 : 2 of a 30°-60°-90° triangle to find its sides from any one side.",
    "利用 30°-60°-90° 三角形的边长比 1 : √3 : 2，由任意一边求其余两边。",
  ),
  prerequisites: ["the-pythagorean-theorem", "isosceles-triangles", "rationalizing-denominators"],
  encompasses: [{ topic: "rationalizing-denominators", weight: 0.2 }],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `The other special right triangle comes from an equilateral triangle. All its angles are $60^\\circ$. Draw the height from the top, and it cuts the triangle into two halves that are mirror images. Take side $6$:

{{figure 0}}

In each half the angle at the base is still $60^\\circ$, the height meets the base at $90^\\circ$, and the top angle is half of $60^\\circ$, that is $30^\\circ$. The hypotenuse is a whole side, $6$, and the shorter leg is half of the base, $3$. The Pythagorean theorem gives the longer leg, the height:

$$h^2 = 6^2 - 3^2 = 27, \\qquad h = \\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}.$$

With a shorter leg $s$ in place of $3$, the hypotenuse is $2s$ and the longer leg is $\\sqrt{4s^2 - s^2} = s\\sqrt{3}$. So the sides of every $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle are in the ratio $1 : \\sqrt{3} : 2$, the shorter leg across from the $30^\\circ$ angle. In this lesson we find the other sides from the shorter leg, from the hypotenuse and from the longer leg.`,
    `另一种特殊的直角三角形来自等边三角形。等边三角形的每个角都是 $60^\\circ$。从顶点作高，它把三角形分成互为镜像的两半。取边长为 $6$：

{{figure 0}}

每一半中，底角仍是 $60^\\circ$，高与底边成 $90^\\circ$，顶角是 $60^\\circ$ 的一半，即 $30^\\circ$。斜边是整条边 $6$，较短的直角边是底边的一半 $3$。由勾股定理求较长的直角边，也就是高：

$$h^2 = 6^2 - 3^2 = 27, \\qquad h = \\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}.$$

把 $3$ 换成较短的直角边 $s$，斜边就是 $2s$，较长的直角边是 $\\sqrt{4s^2 - s^2} = s\\sqrt{3}$。所以每个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形的三边之比都是 $1 : \\sqrt{3} : 2$，较短的直角边对着 $30^\\circ$ 角。这节课分别由较短的直角边、斜边和较长的直角边求其余的边。`,
  ),
  introFigures: [thirtySixtyIntro],
  knowledgePoints: [
    {
      id: "from-the-shorter-leg",
      figure: specialDrawings["from-the-shorter-leg"],
      title: t("From the shorter leg", "由较短的直角边"),
      explanation: t(
        `Cut an equilateral triangle with side $2s$ in half along a height: each half is a right triangle with angles $30^\\circ$, $60^\\circ$, $90^\\circ$, hypotenuse $2s$ and shorter leg $s$. By the Pythagorean theorem, the longer leg is $\\sqrt{(2s)^2 - s^2} = \\sqrt{3s^2} = s\\sqrt{3}$. So the sides are

$$s : s\\sqrt{3} : 2s.$$

The shorter leg is across from the $30^\\circ$ angle, the longer leg across from the $60^\\circ$ angle, and the hypotenuse across from the right angle: the larger the angle, the longer the side across from it. With shorter leg $5$: longer leg $5\\sqrt{3} \\approx 8.66$, hypotenuse $10$.

> **Watch out.** The longer leg is $s\\sqrt{3}$ and the hypotenuse is $2s$; do not swap them, since $\\sqrt{3} \\approx 1.73$ is less than $2$ and the hypotenuse is the longest side. And $\\sqrt{2}$ belongs to the $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle.`,
        `把边长为 $2s$ 的等边三角形沿一条高剪成两半：每一半都是角为 $30^\\circ$、$60^\\circ$、$90^\\circ$ 的直角三角形，斜边为 $2s$，较短的直角边为 $s$。由勾股定理，较长的直角边是 $\\sqrt{(2s)^2 - s^2} = \\sqrt{3s^2} = s\\sqrt{3}$。所以三边之比为

$$s : s\\sqrt{3} : 2s.$$

较短的直角边对着 $30^\\circ$ 角，较长的直角边对着 $60^\\circ$ 角，斜边对着直角：角越大，所对的边越长。较短的直角边为 $5$ 时，较长的直角边是 $5\\sqrt{3} \\approx 8.66$，斜边是 $10$。

> **注意。** 较长的直角边是 $s\\sqrt{3}$，斜边是 $2s$，不要弄反：$\\sqrt{3} \\approx 1.73$ 比 $2$ 小，而斜边是最长的边。另外 $\\sqrt{2}$ 属于 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形。`,
      ),
      generate(rng) {
        const s = rng.int(2, 15);
        const askLong = rng.bool();
        const answer: S = askLong ? [q(s), 3] : [q(2 * s), 1];
        const pair = thirtySixtyPair(
          rng,
          [`${s}`, askLong ? null : "x", askLong ? "x" : null],
          `A 30°-60°-90° triangle with shorter leg ${s}; x is the ${askLong ? "longer leg" : "hypotenuse"}.`,
          `一个 30°-60°-90° 三角形，较短的直角边为 ${s}；x 是${askLong ? "较长的直角边" : "斜边"}。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer,
            wrong: askLong ? [`${s}\\sqrt{2}`, `${2 * s}`, `${2 * s}\\sqrt{3}`] : [`${s}\\sqrt{3}`, `${s}\\sqrt{2}`, `${3 * s}`],
            solution: paras(
              step(
                1,
                "name the sides",
                "认清各边",
                t(
                  `$${s}$ is across from the $30^\\circ$ angle, so it is the shorter leg; $x$ is across from the ${askLong ? "$60^\\circ$ angle, so it is the longer leg" : "right angle, so it is the hypotenuse"}. The sides are in the ratio $1 : \\sqrt{3} : 2$.`,
                  `$${s}$ 对着 $30^\\circ$ 角，是较短的直角边；$x$ 对着${askLong ? " $60^\\circ$ 角，是较长的直角边" : "直角，是斜边"}。三边之比为 $1 : \\sqrt{3} : 2$。`,
                ),
              ),
              step(
                2,
                askLong ? "multiply by the square root of 3" : "double the shorter leg",
                askLong ? "乘以根号 3" : "把较短的直角边加倍",
                shown(
                  askLong
                    ? t(
                        `The longer leg is the shorter leg times $\\sqrt{3}$:${steps(`x = ${s}\\sqrt{3}`)}`,
                        `较长的直角边是较短直角边的 $\\sqrt{3}$ 倍：${steps(`x = ${s}\\sqrt{3}`)}`,
                      )
                    : t(
                        `The hypotenuse is twice the shorter leg:${steps(`x = 2 \\cdot ${s} = ${2 * s}`)}`,
                        `斜边是较短直角边的 $2$ 倍：${steps(`x = 2 \\cdot ${s} = ${2 * s}`)}`,
                      ),
                ),
              ),
              check(
                t(
                  `All three sides are $${s}$, $${s}\\sqrt{3}$ and $${2 * s}$, and they satisfy the Pythagorean theorem: $${s}^2 + (${s}\\sqrt{3})^2 = ${s * s} + ${3 * s * s} = ${4 * s * s} = ${2 * s}^2$.`,
                  `三条边是 $${s}$、$${s}\\sqrt{3}$ 和 $${2 * s}$，满足勾股定理：$${s}^2 + (${s}\\sqrt{3})^2 = ${s * s} + ${3 * s * s} = ${4 * s * s} = ${2 * s}^2$。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [`${s}`, `${2 * s}`, `${s}√3`],
              [askLong ? 2 : 1],
              [],
              `The 30°-60°-90° triangle with all three sides: ${s}, ${s}√3 and ${2 * s}; the side x is highlighted.`,
              `标出三条边的 30°-60°-90° 三角形：${s}、${s}√3 和 ${2 * s}；突出显示边 x。`,
            ),
          ],
        };
      },
    },
    {
      id: "from-the-hypotenuse",
      title: t("From the hypotenuse", "由斜边"),
      explanation: t(
        `The hypotenuse is twice the shorter leg, so the shorter leg is half the hypotenuse; then multiply by $\\sqrt{3}$ for the longer leg. This is the equilateral triangle again: the hypotenuse is a whole side, and the shorter leg is half the base.

With hypotenuse $14$: shorter leg $7$, longer leg $7\\sqrt{3}$. With hypotenuse $9$: shorter leg $\\frac{9}{2}$, longer leg $\\frac{9}{2} \\cdot \\sqrt{3} = \\frac{9\\sqrt{3}}{2}$. A half is fine in an exact answer.

> **Watch out.** Halve the hypotenuse; do not double it, since a leg is shorter than the hypotenuse. For the longer leg, halve first and then multiply by $\\sqrt{3}$: $14\\sqrt{3}$ is the hypotenuse times $\\sqrt{3}$, far too long.`,
        `斜边是较短直角边的 $2$ 倍，所以较短的直角边是斜边的一半；再乘以 $\\sqrt{3}$ 得到较长的直角边。这还是那个等边三角形：斜边是一整条边，较短的直角边是底边的一半。

斜边为 $14$ 时：较短的直角边 $7$，较长的直角边 $7\\sqrt{3}$。斜边为 $9$ 时：较短的直角边 $\\frac{9}{2}$，较长的直角边 $\\frac{9}{2} \\cdot \\sqrt{3} = \\frac{9\\sqrt{3}}{2}$。精确答案中出现分数没有问题。

> **注意。** 斜边要减半，不是加倍，因为直角边比斜边短。求较长的直角边时，先减半，再乘以 $\\sqrt{3}$：$14\\sqrt{3}$ 是斜边乘以 $\\sqrt{3}$，太长了。`,
      ),
      generate(rng) {
        const h = rng.int(3, 30);
        const askLong = rng.bool();
        const short: S = [q(h, 2), 1];
        const long: S = [q(h, 2), 3];
        const answer: S = askLong ? long : short;
        const half = q(h, 2).toLatex();
        const pair = thirtySixtyPair(
          rng,
          [askLong ? null : "x", `${h}`, askLong ? "x" : null],
          `A 30°-60°-90° triangle with hypotenuse ${h}; x is the ${askLong ? "longer" : "shorter"} leg.`,
          `一个 30°-60°-90° 三角形，斜边为 ${h}；x 是${askLong ? "较长" : "较短"}的直角边。`,
        );
        const halving = `${askLong ? "s" : "x"} = \\frac{${h}}{2}${h % 2 === 0 ? ` = ${h / 2}` : ""}`;
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer,
            wrong: askLong ? [`${h}\\sqrt{3}`, half, `${h}\\sqrt{2}`] : [`${2 * h}`, `${h}\\sqrt{3}`, radical(q(h, 2), 3)],
            solution: paras(
              step(
                1,
                "halve the hypotenuse",
                "把斜边减半",
                t(
                  `$${h}$ is across from the right angle, so it is the hypotenuse, twice the shorter leg. ${askLong ? "The shorter leg, $s$, is" : "$x$ is across from the $30^\\circ$ angle: it is the shorter leg,"} half of it:${steps(halving)}`,
                  `$${h}$ 对着直角，是斜边，等于较短直角边的 $2$ 倍。${askLong ? "较短的直角边 $s$" : "$x$ 对着 $30^\\circ$ 角，是较短的直角边，"}是它的一半：${steps(halving)}`,
                ),
              ),
              askLong
                ? step(
                    2,
                    "multiply by the square root of 3",
                    "乘以根号 3",
                    shown(
                      t(
                        `$x$ is across from the $60^\\circ$ angle, so it is the longer leg, the shorter leg times $\\sqrt{3}$:${steps(`x = ${half} \\cdot \\sqrt{3} = ${texS(long)}`)}`,
                        `$x$ 对着 $60^\\circ$ 角，是较长的直角边，等于较短的直角边乘以 $\\sqrt{3}$：${steps(`x = ${half} \\cdot \\sqrt{3} = ${texS(long)}`)}`,
                      ),
                    ),
                  )
                : t("{{figure 0}}", "{{figure 0}}"),
              check(
                t(
                  `The legs are $${half}$ and $${texS(long)}$; with the hypotenuse they satisfy the Pythagorean theorem: $${pow2(half)} + ${pow2(texS(long))} = ${sqS(short).toLatex()} + ${sqS(long).toLatex()} = ${h * h} = ${h}^2$.`,
                  `两条直角边是 $${half}$ 和 $${texS(long)}$，与斜边一起满足勾股定理：$${pow2(half)} + ${pow2(texS(long))} = ${sqS(short).toLatex()} + ${sqS(long).toLatex()} = ${h * h} = ${h}^2$。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [figS(short), `${h}`, figS(long)],
              [askLong ? 2 : 0],
              [],
              `The 30°-60°-90° triangle with all three sides: ${figS(short)}, ${figS(long)} and ${h}; the side x is highlighted.`,
              `标出三条边的 30°-60°-90° 三角形：${figS(short)}、${figS(long)} 和 ${h}；突出显示边 x。`,
            ),
          ],
        };
      },
    },
    {
      id: "from-the-longer-leg",
      title: t("From the longer leg", "由较长的直角边"),
      explanation: t(
        `The longer leg is the shorter leg times $\\sqrt{3}$, so the shorter leg is the longer leg divided by $\\sqrt{3}$. Rationalize by multiplying the top and the bottom by $\\sqrt{3}$, since $\\sqrt{3} \\cdot \\sqrt{3} = 3$; then double the shorter leg for the hypotenuse. With longer leg $6$:

$$s = \\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}, \\qquad c = 2s = 4\\sqrt{3}.$$

Check: $2\\sqrt{3} \\cdot \\sqrt{3} = 2 \\cdot 3 = 6$, the longer leg. With longer leg $5\\sqrt{3}$, the roots cancel: the shorter leg is $5$ and the hypotenuse $10$.

> **Watch out.** Divide by $\\sqrt{3}$; multiplying gives a side longer than the longer leg, which cannot be the shorter one. Do not halve the longer leg either: halving turns the hypotenuse into the shorter leg, not the longer leg. And the hypotenuse is twice the shorter leg, not twice the longer one.`,
        `较长的直角边是较短直角边的 $\\sqrt{3}$ 倍，所以较短的直角边等于较长的直角边除以 $\\sqrt{3}$。分子分母同乘 $\\sqrt{3}$ 把分母有理化，因为 $\\sqrt{3} \\cdot \\sqrt{3} = 3$；再把较短的直角边加倍得到斜边。较长的直角边为 $6$ 时：

$$s = \\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}, \\qquad c = 2s = 4\\sqrt{3}.$$

检验：$2\\sqrt{3} \\cdot \\sqrt{3} = 2 \\cdot 3 = 6$，正是较长的直角边。较长的直角边为 $5\\sqrt{3}$ 时根号约掉：较短的直角边是 $5$，斜边是 $10$。

> **注意。** 要除以 $\\sqrt{3}$；乘以 $\\sqrt{3}$ 得到的边比较长的直角边还长，不可能是较短的直角边。也不要把较长的直角边减半：减半是由斜边得到较短的直角边，不是由较长的直角边。另外斜边是较短直角边的 $2$ 倍，不是较长直角边的 $2$ 倍。`,
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 3]);
        const long = surd(k, m);
        const short = divS(long, [Q.one, 3]);
        const hyp = mulS(short, [q(2), 1]);
        const askHyp = rng.bool();
        const answer = askHyp ? hyp : short;
        const longTex = sqrtTex(k, m);
        const back =
          m === 3 ? `${texS(short)} \\cdot \\sqrt{3} = ${k}` : `${texS(short)} \\cdot \\sqrt{3} = ${short[0].toLatex()} \\cdot 3 = ${k}`;
        const pair = thirtySixtyPair(
          rng,
          [askHyp ? null : "x", askHyp ? "x" : null, label(k, m)],
          `A 30°-60°-90° triangle with longer leg ${label(k, m)}; x is the ${askHyp ? "hypotenuse" : "shorter leg"}.`,
          `一个 30°-60°-90° 三角形，较长的直角边为 ${label(k, m)}；x 是${askHyp ? "斜边" : "较短的直角边"}。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [
              texS(mulS(long, [Q.one, 3])),
              texS(mulS(long, [q(2), 1])),
              `\\frac{${askHyp ? `${2 * k}${m === 3 ? "\\sqrt{3}" : ""}` : longTex}}{\\sqrt{3}}`,
              texS([long[0].div(q(2)), long[1]]),
            ],
            solution: paras(
              step(
                1,
                "find the shorter leg",
                "求较短的直角边",
                t(
                  `$${longTex}$ is across from the $60^\\circ$ angle, so it is the longer leg, the shorter leg times $\\sqrt{3}$. ${m === 3 ? "Divide by $\\sqrt{3}$; the roots cancel" : "Divide by $\\sqrt{3}$ and rationalize"}:${steps(`${askHyp ? "s" : "x"} = ${overRoot(long, 3)}`)}`,
                  `$${longTex}$ 对着 $60^\\circ$ 角，是较长的直角边，等于较短的直角边乘以 $\\sqrt{3}$。${m === 3 ? "除以 $\\sqrt{3}$，根号约去" : "除以 $\\sqrt{3}$ 并把分母有理化"}：${steps(`${askHyp ? "s" : "x"} = ${overRoot(long, 3)}`)}`,
                ),
              ),
              askHyp
                ? step(
                    2,
                    "double the shorter leg",
                    "把较短的直角边加倍",
                    shown(
                      t(
                        `$x$ is across from the right angle, the hypotenuse, twice the shorter leg:${steps(`x = 2 \\cdot ${texS(short)} = ${texS(hyp)}`)}`,
                        `$x$ 对着直角，是斜边，等于较短直角边的 $2$ 倍：${steps(`x = 2 \\cdot ${texS(short)} = ${texS(hyp)}`)}`,
                      ),
                    ),
                  )
                : t("{{figure 0}}", "{{figure 0}}"),
              check(
                t(
                  `Multiply back: $${back}${m === 3 ? "\\sqrt{3}" : ""}$, the longer leg. ${askHyp ? `And the Pythagorean theorem holds: $${pow2(texS(short))} + ${pow2(longTex)} = ${sqS(short).toLatex()} + ${sqS(long).toLatex()} = ${sqS(hyp).toLatex()} = ${pow2(texS(hyp))}$.` : `As decimals, $${texS(short)}${short[1] === 1 ? "" : ` \\approx ${approx(valueS(short))}`}$ is shorter than the longer leg $${approx(valueS(long))}$, as it must be.`}`,
                  `乘回去：$${back}${m === 3 ? "\\sqrt{3}" : ""}$，正是较长的直角边。${askHyp ? `勾股定理也成立：$${pow2(texS(short))} + ${pow2(longTex)} = ${sqS(short).toLatex()} + ${sqS(long).toLatex()} = ${sqS(hyp).toLatex()} = ${pow2(texS(hyp))}$。` : `写成小数，$${texS(short)}${short[1] === 1 ? "" : ` \\approx ${approx(valueS(short))}`}$ 比较长的直角边 $${approx(valueS(long))}$ 短，正应如此。`}`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [figS(short), figS(hyp), label(k, m)],
              [askHyp ? 1 : 0],
              [],
              `The 30°-60°-90° triangle with all three sides: ${figS(short)}, ${label(k, m)} and ${figS(hyp)}; the side x is highlighted.`,
              `标出三条边的 30°-60°-90° 三角形：${figS(short)}、${label(k, m)} 和 ${figS(hyp)}；突出显示边 x。`,
            ),
          ],
        };
      },
    },
  ],
};

/** halfSquareIntro is a square of side 4 cut by a diagonal, one half shaded. */
const halfSquareIntro: Figure = figure(
  [
    {
      kind: "shade",
      points: [
        [0, 0],
        [4, 0],
        [0, 4],
      ],
      tone: "result",
    },
    {
      kind: "polygon",
      points: [
        [0, 0],
        [4, 0],
        [4, 4],
        [0, 4],
      ],
    },
    { kind: "segment", a: [4, 0], b: [0, 4] },
    { kind: "right", vertex: [0, 0], from: [4, 0], to: [0, 4] },
    { kind: "side", a: [0, 0], b: [4, 0], text: "4" },
    { kind: "side", a: [0, 4], b: [0, 0], text: "4" },
  ],
  "A square of side 4 cut by a diagonal; the shaded half is an isosceles right triangle with legs 4 and 4.",
  "边长为 4 的正方形被一条对角线切开；阴影的一半是直角边为 4 和 4 的等腰直角三角形。",
);

export const areaOfIsoscelesRightTriangles: TopicDef = {
  id: "area-of-isosceles-right-triangles",
  title: t("The Area of an Isosceles Right Triangle", "等腰直角三角形的面积"),
  summary: t(
    "Find the area of an isosceles right triangle from a leg or the hypotenuse, and a side from the area.",
    "由直角边或斜边求等腰直角三角形的面积，以及由面积求边长。",
  ),
  prerequisites: ["isosceles-right-triangles", "area-of-triangles"],
  encompasses: [
    { topic: "isosceles-right-triangles", weight: 0.5 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `The area of a triangle is half a base times the height to it. In a right triangle the legs are perpendicular, so either leg is a base and the other is the height to it. In an isosceles right triangle the two legs are equal, which makes the area especially simple. With legs $4$:

{{figure 0}}

$$A = \\frac{1}{2} \\cdot 4 \\cdot 4 = 8.$$

The picture says the same thing another way: the triangle is half of a square of side $4$, whose area is $16$. So an isosceles right triangle with legs $s$ has area $\\frac{s^2}{2}$, half the square on a leg. In this lesson we find the area from a leg, then from the hypotenuse, which first needs the ratio $1 : 1 : \\sqrt{2}$, and finally go backwards from the area to the sides.`,
    `三角形的面积是底乘以这条底上的高的一半。直角三角形的两条直角边互相垂直，所以任一条直角边都可以作底，另一条就是这条底上的高。等腰直角三角形的两条直角边相等，面积就特别简单。直角边为 $4$ 时：

{{figure 0}}

$$A = \\frac{1}{2} \\cdot 4 \\cdot 4 = 8.$$

图从另一个角度说明了同一件事：这个三角形是边长为 $4$ 的正方形的一半，而正方形面积是 $16$。所以直角边为 $s$ 的等腰直角三角形面积是 $\\frac{s^2}{2}$，即直角边上正方形的一半。这节课先由直角边求面积，再由斜边求面积（先要用 $1 : 1 : \\sqrt{2}$），最后由面积反求边长。`,
  ),
  introFigures: [halfSquareIntro],
  knowledgePoints: [
    {
      id: "area-from-a-leg",
      figure: specialDrawings["area-from-a-leg"],
      title: t("From a leg", "由直角边求面积"),
      explanation: t(
        `The legs of a right triangle are perpendicular, so one is a base and the other its height. In an isosceles right triangle both are $s$:

$$A = \\frac{1}{2} \\cdot s \\cdot s = \\frac{s^2}{2}.$$

With legs $6$: $A = \\frac{36}{2} = 18$, half of the $6$ by $6$ square. When the leg has a root, square it first: with legs $3\\sqrt{2}$, $s^2 = 9 \\cdot 2 = 18$ and $A = \\frac{18}{2} = 9$.

> **Watch out.** Remember the $\\frac{1}{2}$: $s^2$ is the area of the whole square, twice the triangle. And square the root too: $(3\\sqrt{2})^2 = 9 \\cdot 2 = 18$, not $9$.`,
        `直角三角形的两条直角边互相垂直，所以一条是底，另一条是高。等腰直角三角形的两条直角边都是 $s$：

$$A = \\frac{1}{2} \\cdot s \\cdot s = \\frac{s^2}{2}.$$

直角边为 $6$ 时：$A = \\frac{36}{2} = 18$，是 $6 \\times 6$ 正方形的一半。直角边含根号时，先平方：直角边为 $3\\sqrt{2}$ 时，$s^2 = 9 \\cdot 2 = 18$，$A = \\frac{18}{2} = 9$。

> **注意。** 别忘了 $\\frac{1}{2}$：$s^2$ 是整个正方形的面积，是三角形的两倍。根号也要平方：$(3\\sqrt{2})^2 = 9 \\cdot 2 = 18$，不是 $9$。`,
      ),
      generate(rng) {
        const k = rng.int(2, 16);
        const m = rng.pick([1, 1, 2]);
        const sq = k * k * m;
        const area = q(sq, 2);
        const legTex = sqrtTex(k, m);
        const square = m === 1 ? `${k}^2 = ${sq}` : `${pow2(legTex)} = ${k * k} \\cdot 2 = ${sq}`;
        const pair = isoRightPair(
          rng,
          [label(k, m), null, null],
          `An isosceles right triangle with legs ${label(k, m)}.`,
          `一个等腰直角三角形，直角边为 ${label(k, m)}。`,
        );
        const [r, u, v] = pair.tri;
        const w: Point = [u[0] + v[0] - r[0], u[1] + v[1] - r[1]];
        return {
          ...numberProblem({
            prompt: t("Find the area of the isosceles right triangle.", "求这个等腰直角三角形的面积。"),
            answer: area,
            wrong: [sq, 2 * sq, k * k, area.mul(q(m === 2 ? 1 : 2, 2))],
            solution: paras(
              step(
                1,
                "take the legs as base and height",
                "以两条直角边为底和高",
                t(
                  `The legs are perpendicular, so one is a base and the other the height to it; the tick marks say both are $${legTex}$.`,
                  `两条直角边互相垂直，一条作底，另一条就是高；刻痕表明它们都是 $${legTex}$。`,
                ),
              ),
              step(
                2,
                "take half the product",
                "取乘积的一半",
                t(
                  `First the product of the legs, $${square}$, then half of it:${steps(`A = \\frac{1}{2} \\cdot ${sq} = ${area.toLatex()}`)}`,
                  `先求两条直角边的乘积 $${square}$，再取一半：${steps(`A = \\frac{1}{2} \\cdot ${sq} = ${area.toLatex()}`)}`,
                ),
              ),
              check(
                shown(
                  t(
                    `Two copies of the triangle make a square of side $${legTex}$, with area $${sq}$, so the triangle is half of it, $${area.toLatex()}$. Through the hypotenuse instead: it is $${texS(mulS(surd(k, m), [Q.one, 2]))}$, its square is $${2 * sq}$, and a quarter of that is again $${area.toLatex()}$.`,
                    `两个这样的三角形拼成边长为 $${legTex}$ 的正方形，面积是 $${sq}$，三角形是它的一半，即 $${area.toLatex()}$。也可以经过斜边：斜边是 $${texS(mulS(surd(k, m), [Q.one, 2]))}$，它的平方是 $${2 * sq}$，其四分之一也是 $${area.toLatex()}$。`,
                  ),
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            figure(
              [
                { kind: "shade", points: [r, u, v], tone: "result" },
                ...isoRightMarks(pair.tri, [label(k, m), null, label(k, m)]),
                { kind: "segment", a: u, b: w, dashed: true },
                { kind: "segment", a: w, b: v, dashed: true },
              ],
              `The triangle, shaded, completed by dashed sides to a square of side ${label(k, m)}: it is half of the square.`,
              `阴影三角形用虚线补成边长为 ${label(k, m)} 的正方形：它是正方形的一半。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-from-the-hypotenuse",
      figure: specialDrawings["area-of-isosceles-right-triangles#area-from-the-hypotenuse"],
      title: t("From the hypotenuse", "由斜边求面积"),
      explanation: t(
        `The hypotenuse is not a leg, so it is not the base and height pair. Find a leg first: from the hypotenuse $c$, a leg is $\\frac{c}{\\sqrt{2}}$, so its square is $s^2 = \\frac{c^2}{2}$, and

$$A = \\frac{s^2}{2} = \\frac{c^2}{4}.$$

With hypotenuse $10$: the legs are $5\\sqrt{2}$, $s^2 = 50$, and $A = \\frac{50}{2} = 25 = \\frac{100}{4}$. There is no need to simplify the leg: only its square is used.

> **Watch out.** $\\frac{1}{2} c^2$ treats the hypotenuse as both base and height, which it is not; that gives twice the area. And $\\frac{c}{2}$ is not a leg: the legs are $\\frac{c}{\\sqrt{2}}$.`,
        `斜边不是直角边，它和别的边不构成一组底和高。先求直角边：已知斜边 $c$，直角边是 $\\frac{c}{\\sqrt{2}}$，它的平方是 $s^2 = \\frac{c^2}{2}$，所以

$$A = \\frac{s^2}{2} = \\frac{c^2}{4}.$$

斜边为 $10$ 时：直角边是 $5\\sqrt{2}$，$s^2 = 50$，$A = \\frac{50}{2} = 25 = \\frac{100}{4}$。直角边不必化简，只用到它的平方。

> **注意。** $\\frac{1}{2} c^2$ 把斜边同时当作底和高，这是不对的，结果是面积的两倍。另外 $\\frac{c}{2}$ 不是直角边，直角边是 $\\frac{c}{\\sqrt{2}}$。`,
      ),
      generate(rng) {
        const k = rng.int(2, 20);
        const m = rng.pick([1, 1, 2]);
        const sq = k * k * m;
        const area = q(sq, 4);
        const cTex = sqrtTex(k, m);
        const halfC: S = [q(k, 2), m];
        const pair = isoRightPair(
          rng,
          [null, label(k, m), null],
          `An isosceles right triangle with hypotenuse ${label(k, m)}.`,
          `一个等腰直角三角形，斜边为 ${label(k, m)}。`,
        );
        const [r, u, v] = pair.tri;
        const foot = mid(u, v);
        return {
          ...numberProblem({
            prompt: t("Find the area of the isosceles right triangle.", "求这个等腰直角三角形的面积。"),
            answer: area,
            wrong: [q(sq, 2), sq, q(k * k, 2)],
            solution: paras(
              step(
                1,
                "find the square of a leg",
                "求直角边的平方",
                t(
                  `Each leg is the hypotenuse divided by $\\sqrt{2}$, so the square of a leg is the square of the hypotenuse divided by $2$:${steps(`s^2 = \\frac{${pow2(cTex)}}{2} = \\frac{${sq}}{2}`)}`,
                  `每条直角边等于斜边除以 $\\sqrt{2}$，所以直角边的平方等于斜边的平方除以 $2$：${steps(`s^2 = \\frac{${pow2(cTex)}}{2} = \\frac{${sq}}{2}`)}`,
                ),
              ),
              step(
                2,
                "take half the product of the legs",
                "取两条直角边乘积的一半",
                t(
                  `The legs are a base and its height:${steps(`A = \\frac{1}{2} \\cdot \\frac{${sq}}{2} = \\frac{${sq}}{4} = ${area.toLatex()}`)}`,
                  `两条直角边是一组底和高：${steps(`A = \\frac{1}{2} \\cdot \\frac{${sq}}{2} = \\frac{${sq}}{4} = ${area.toLatex()}`)}`,
                ),
              ),
              check(
                shown(
                  t(
                    `Take the hypotenuse as the base instead. The height to it, from the right angle, cuts the triangle into two smaller isosceles right triangles, so it equals half the hypotenuse, $${texS(halfC)}$. Then $A = \\frac{1}{2} \\cdot ${cTex} \\cdot ${texS(halfC)} = \\frac{${sq}}{4} = ${area.toLatex()}$, the same.`,
                    `改用斜边作底。从直角顶点到斜边的高把三角形分成两个较小的等腰直角三角形，所以这条高等于斜边的一半，即 $${texS(halfC)}$。于是 $A = \\frac{1}{2} \\cdot ${cTex} \\cdot ${texS(halfC)} = \\frac{${sq}}{4} = ${area.toLatex()}$，结果相同。`,
                  ),
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [null, label(k, m), null],
              [1],
              [
                { kind: "segment", a: r, b: foot, dashed: true, accent: true },
                { kind: "right", vertex: foot, from: u, to: r },
                { kind: "side", a: foot, b: r, text: figS(halfC) },
              ],
              `The triangle with the hypotenuse ${label(k, m)} as base and the height ${figS(halfC)} to it dashed, from the right angle to the middle of the hypotenuse.`,
              `以斜边 ${label(k, m)} 为底的三角形，虚线是从直角顶点到斜边中点的高 ${figS(halfC)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "sides-from-the-area",
      figure: geometryDrawings2["area-of-isosceles-right-triangles#sides-from-the-area"],
      title: t("Sides from the area", "由面积求边长"),
      explanation: t(
        `Run the formula backwards, undoing each operation in reverse order. The area is $\\frac{s^2}{2}$, so doubling the area gives $s^2 = 2A$, and the square root gives the leg; then the hypotenuse is $s\\sqrt{2}$.

An isosceles right triangle with area $32$ has $s^2 = 64$, so its legs are $8$ and its hypotenuse is $8\\sqrt{2}$. Indeed $\\frac{1}{2} \\cdot 8 \\cdot 8 = 32$.

> **Watch out.** Double the area before taking the root: $\\sqrt{32}$ is not the leg, because the area is half of $s^2$, not $s^2$. And read what is asked: the hypotenuse is the leg times $\\sqrt{2}$, so do not stop at the leg.`,
        `把公式反过来用，按相反的顺序撤销每一步运算。面积是 $\\frac{s^2}{2}$，所以把面积加倍得 $s^2 = 2A$，再开平方得到直角边；斜边是 $s\\sqrt{2}$。

面积为 $32$ 的等腰直角三角形满足 $s^2 = 64$，所以直角边是 $8$，斜边是 $8\\sqrt{2}$。确实 $\\frac{1}{2} \\cdot 8 \\cdot 8 = 32$。

> **注意。** 先把面积加倍再开方：$\\sqrt{32}$ 不是直角边，因为面积是 $s^2$ 的一半，而不是 $s^2$。另外看清问的是什么：斜边是直角边乘以 $\\sqrt{2}$，不要停在直角边。`,
      ),
      generate(rng) {
        const s = rng.int(2, 16);
        const area = q(s * s, 2);
        const askHyp = rng.bool();
        const answer: S = askHyp ? [q(s), 2] : [q(s), 1];
        const what = askHyp ? sideNames.hyp : t("each leg", "每条直角边");
        const pair = isoRightPair(rng, [null, null, null], "", "");
        return {
          ...radicalProblem({
            prompt: t(
              `An isosceles right triangle has an area of $${area.toLatex()}$. Find ${what.en} in simplest radical form.`,
              `一个等腰直角三角形的面积是 $${area.toLatex()}$。求${what["zh-CN"]}，写成最简根式。`,
            ),
            answer,
            wrong: askHyp ? [`${s}`, `${2 * s}`, `${s}\\sqrt{3}`] : [texS(sqrtS(s * s * 2)), `${s * s}`, texS(sqrtS(s * s * 4))],
            solution: paras(
              step(
                1,
                "undo the half",
                "撤销一半",
                t(
                  `The area is $\\frac{s^2}{2}$, so multiply the area by $2$:${steps(`\\frac{s^2}{2} = ${area.toLatex()}`, `s^2 = ${s * s}`)}`,
                  `面积是 $\\frac{s^2}{2}$，所以把面积乘以 $2$：${steps(`\\frac{s^2}{2} = ${area.toLatex()}`, `s^2 = ${s * s}`)}`,
                ),
              ),
              step(
                2,
                askHyp ? "take the root, then multiply by the square root of 2" : "take the square root",
                askHyp ? "开方，再乘以根号 2" : "开平方",
                shown(
                  askHyp
                    ? t(
                        `A length is positive, so the leg is $s = \\sqrt{${s * s}} = ${s}$. The hypotenuse is a leg times $\\sqrt{2}$:${steps(`c = ${s}\\sqrt{2}`)}`,
                        `长度是正数，所以直角边 $s = \\sqrt{${s * s}} = ${s}$。斜边是直角边乘以 $\\sqrt{2}$：${steps(`c = ${s}\\sqrt{2}`)}`,
                      )
                    : t(
                        `A length is positive:${steps(`s = \\sqrt{${s * s}} = ${s}`)}`,
                        `长度是正数：${steps(`s = \\sqrt{${s * s}} = ${s}`)}`,
                      ),
                ),
              ),
              check(
                t(
                  `Put the legs back into the area: $\\frac{1}{2} \\cdot ${s} \\cdot ${s} = \\frac{${s * s}}{2} = ${area.toLatex()}$.${askHyp ? ` And $${s}^2 + ${s}^2 = ${2 * s * s} = (${s}\\sqrt{2})^2$, as the Pythagorean theorem requires.` : ""}`,
                  `把直角边代回面积：$\\frac{1}{2} \\cdot ${s} \\cdot ${s} = \\frac{${s * s}}{2} = ${area.toLatex()}$。${askHyp ? `并且 $${s}^2 + ${s}^2 = ${2 * s * s} = (${s}\\sqrt{2})^2$，符合勾股定理。` : ""}`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            pair.solved(
              [`${s}`, askHyp ? `${s}√2` : null, `${s}`],
              askHyp ? [1] : [0, 2],
              [],
              `An isosceles right triangle with legs ${s}${askHyp ? ` and hypotenuse ${s}√2` : ""}; the side asked for is highlighted.`,
              `直角边为 ${s}${askHyp ? `、斜边为 ${s}√2` : ""} 的等腰直角三角形；突出显示所求的边。`,
            ),
          ],
        };
      },
    },
  ],
};

/** thirtyAreaIntro is a 30°-60°-90° triangle with shorter leg 2 and its mirror image across the longer leg, together an equilateral triangle. */
const thirtyAreaIntro: Figure = (() => {
  const h = 2 * Math.sqrt(3);
  const [r, u, v, w]: [Point, Point, Point, Point] = [
    [0, 0],
    [2, 0],
    [0, h],
    [-2, 0],
  ];
  return figure(
    [
      { kind: "shade", points: [r, u, v], tone: "result" },
      { kind: "polygon", points: [r, u, v] },
      { kind: "segment", a: v, b: w, dashed: true },
      { kind: "segment", a: w, b: r, dashed: true },
      { kind: "right", vertex: r, from: u, to: v },
      { kind: "arc", vertex: u, from: v, to: r, label: "60°" },
      { kind: "side", a: r, b: u, text: "2" },
      { kind: "side", a: u, b: v, text: "4" },
      { kind: "label", at: [0, h / 2], text: "2√3", dir: "e" },
    ],
    "A 30°-60°-90° triangle, shaded, with shorter leg 2, longer leg 2√3 and hypotenuse 4. Its mirror image across the longer leg is dashed; together they make an equilateral triangle of side 4.",
    "阴影的 30°-60°-90° 三角形，较短的直角边 2，较长的直角边 2√3，斜边 4。它关于较长直角边的镜像用虚线画出；两者合成边长为 4 的等边三角形。",
  );
})();

export const areaOfThirtySixtyNinetyTriangles: TopicDef = {
  id: "area-of-thirty-sixty-ninety-triangles",
  title: t("The Area of a 30-60-90 Triangle", "30°-60°-90° 三角形的面积"),
  summary: t("Find the exact area of a 30°-60°-90° triangle from any one side.", "由任意一边求 30°-60°-90° 三角形面积的精确值。"),
  prerequisites: ["thirty-sixty-ninety-triangles", "area-of-triangles"],
  encompasses: [
    { topic: "thirty-sixty-ninety-triangles", weight: 0.5 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `As in every right triangle, the two legs of a $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle are perpendicular, so they serve as base and height. The ratio $1 : \\sqrt{3} : 2$ gives both legs from any one side. Take shorter leg $2$: the longer leg is $2\\sqrt{3}$ and the hypotenuse $4$.

{{figure 0}}

$$A = \\frac{1}{2} \\cdot 2 \\cdot 2\\sqrt{3} = 2\\sqrt{3} \\approx 3.46.$$

The area stays exact, with the root in it. The figure shows where the triangle comes from: with its mirror image it makes an equilateral triangle of side $4$, so its area is half of that triangle. In this lesson we find the area from the shorter leg, from the hypotenuse and from the longer leg; each time the first step is to get both legs.`,
    `和所有直角三角形一样，$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形的两条直角边互相垂直，可以作为底和高。利用 $1 : \\sqrt{3} : 2$，由任意一边都能求出两条直角边。取较短的直角边 $2$：较长的直角边是 $2\\sqrt{3}$，斜边是 $4$。

{{figure 0}}

$$A = \\frac{1}{2} \\cdot 2 \\cdot 2\\sqrt{3} = 2\\sqrt{3} \\approx 3.46.$$

面积保留精确值，带着根号。图也说明了这个三角形的来历：它和自己的镜像合成边长为 $4$ 的等边三角形，所以它的面积是那个等边三角形的一半。这节课分别由较短的直角边、斜边和较长的直角边求面积；每次第一步都是求出两条直角边。`,
  ),
  introFigures: [thirtyAreaIntro],
  knowledgePoints: [
    {
      id: "area-from-the-shorter-leg",
      title: t("From the shorter leg", "由较短的直角边求面积"),
      explanation: t(
        `The two legs are a base and its height. With shorter leg $s$, the longer leg is $s\\sqrt{3}$, so

$$A = \\frac{1}{2} \\cdot s \\cdot s\\sqrt{3} = \\frac{s^2\\sqrt{3}}{2}.$$

With shorter leg $4$: the longer leg is $4\\sqrt{3}$, and $A = \\frac{1}{2} \\cdot 4 \\cdot 4\\sqrt{3} = 8\\sqrt{3} \\approx 13.86$. Multiply the whole numbers and keep the $\\sqrt{3}$: $\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$.

> **Watch out.** Keep both the $\\frac{1}{2}$ and the $\\sqrt{3}$: $s^2\\sqrt{3}$ is the rectangle on the two legs, twice the triangle, and $\\frac{s^2}{2}$ would be an isosceles right triangle. The formula $\\frac{s^2\\sqrt{3}}{4}$ belongs to the equilateral triangle with side $s$, a different triangle.`,
        `两条直角边是一组底和高。较短的直角边为 $s$ 时，较长的直角边是 $s\\sqrt{3}$，所以

$$A = \\frac{1}{2} \\cdot s \\cdot s\\sqrt{3} = \\frac{s^2\\sqrt{3}}{2}.$$

较短的直角边为 $4$ 时：较长的直角边是 $4\\sqrt{3}$，$A = \\frac{1}{2} \\cdot 4 \\cdot 4\\sqrt{3} = 8\\sqrt{3} \\approx 13.86$。把整数部分相乘，$\\sqrt{3}$ 保留：$\\frac{1}{2} \\cdot 4 \\cdot 4 = 8$。

> **注意。** $\\frac{1}{2}$ 和 $\\sqrt{3}$ 都要保留：$s^2\\sqrt{3}$ 是以两条直角边为边的长方形，是三角形的两倍；$\\frac{s^2}{2}$ 是等腰直角三角形的面积。$\\frac{s^2\\sqrt{3}}{4}$ 是边长为 $s$ 的等边三角形的面积，那是另一个三角形。`,
      ),
      generate(rng) {
        const s = rng.int(2, 16);
        const answer: S = [q(s * s, 2), 3];
        const pair = thirtySixtyPair(
          rng,
          [`${s}`, null, null],
          `A 30°-60°-90° triangle with shorter leg ${s}.`,
          `一个 30°-60°-90° 三角形，较短的直角边为 ${s}。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer,
            wrong: [`${s * s}\\sqrt{3}`, q(s * s, 2).toLatex(), radical(q(s * s, 4), 3), `${s * s}`],
            solution: paras(
              step(
                1,
                "find the longer leg",
                "求较长的直角边",
                shown(
                  t(
                    `$${s}$ is across from the $30^\\circ$ angle, the shorter leg; the longer leg is $\\sqrt{3}$ times it, $${s}\\sqrt{3}$.`,
                    `$${s}$ 对着 $30^\\circ$ 角，是较短的直角边；较长的直角边是它的 $\\sqrt{3}$ 倍，即 $${s}\\sqrt{3}$。`,
                  ),
                ),
              ),
              step(
                2,
                "take half the product of the legs",
                "取两条直角边乘积的一半",
                t(
                  `The legs are perpendicular, a base and its height:${steps(`A = \\frac{1}{2} \\cdot ${s} \\cdot ${s}\\sqrt{3} = \\frac{${s * s}\\sqrt{3}}{2}${s % 2 === 0 ? ` = ${texS(answer)}` : ""}`)}`,
                  `两条直角边互相垂直，是一组底和高：${steps(`A = \\frac{1}{2} \\cdot ${s} \\cdot ${s}\\sqrt{3} = \\frac{${s * s}\\sqrt{3}}{2}${s % 2 === 0 ? ` = ${texS(answer)}` : ""}`)}`,
                ),
              ),
              check(
                t(
                  `Estimate with $\\sqrt{3} \\approx 1.73$: the longer leg is about $${approx(s * 1.73)}$, and $\\frac{1}{2} \\cdot ${s} \\cdot ${approx(s * 1.73)} \\approx ${approx(s * s * 0.865)}$, close to $${texS(answer)} \\approx ${approx(valueS(answer))}$.`,
                  `用 $\\sqrt{3} \\approx 1.73$ 估算：较长的直角边约为 $${approx(s * 1.73)}$，$\\frac{1}{2} \\cdot ${s} \\cdot ${approx(s * 1.73)} \\approx ${approx(s * s * 0.865)}$，与 $${texS(answer)} \\approx ${approx(valueS(answer))}$ 相近。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [`${s}`, null, `${s}√3`],
              [0, 2],
              [],
              `The 30°-60°-90° triangle with its legs highlighted: ${s} and ${s}√3, a base and its height.`,
              `突出显示 30°-60°-90° 三角形的两条直角边：${s} 和 ${s}√3，是一组底和高。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-from-the-hypotenuse",
      figure: specialDrawings["area-of-thirty-sixty-ninety-triangles#area-from-the-hypotenuse"],
      title: t("From the hypotenuse", "由斜边求面积"),
      explanation: t(
        `Find the legs first: the shorter leg is half the hypotenuse, and the longer leg is $\\sqrt{3}$ times the shorter one. With hypotenuse $12$, the shorter leg is $6$ and the longer leg $6\\sqrt{3}$, so

$$A = \\frac{1}{2} \\cdot 6 \\cdot 6\\sqrt{3} = 18\\sqrt{3}.$$

In general, with hypotenuse $c$ the legs are $\\frac{c}{2}$ and $\\frac{c\\sqrt{3}}{2}$, and $A = \\frac{c^2\\sqrt{3}}{8}$: $\\frac{144\\sqrt{3}}{8} = 18\\sqrt{3}$.

> **Watch out.** Do not multiply the hypotenuse by a leg: the hypotenuse is not the height on a leg, only the other leg is. And the equilateral formula $\\frac{c^2\\sqrt{3}}{4}$ gives the triangle together with its mirror image, twice the area.`,
        `先求出两条直角边：较短的直角边是斜边的一半，较长的直角边是较短直角边的 $\\sqrt{3}$ 倍。斜边为 $12$ 时，较短的直角边是 $6$，较长的直角边是 $6\\sqrt{3}$，所以

$$A = \\frac{1}{2} \\cdot 6 \\cdot 6\\sqrt{3} = 18\\sqrt{3}.$$

一般地，斜边为 $c$ 时两条直角边是 $\\frac{c}{2}$ 和 $\\frac{c\\sqrt{3}}{2}$，$A = \\frac{c^2\\sqrt{3}}{8}$：$\\frac{144\\sqrt{3}}{8} = 18\\sqrt{3}$。

> **注意。** 不要用斜边乘直角边：以一条直角边为底时，高是另一条直角边，不是斜边。另外等边三角形公式 $\\frac{c^2\\sqrt{3}}{4}$ 算的是这个三角形连同它的镜像，是面积的两倍。`,
      ),
      generate(rng) {
        const h = rng.int(2, 24);
        const s = q(h, 2);
        const answer: S = [s.mul(s).div(q(2)), 3];
        const altitude: S = [q(h, 4), 3];
        const pair = thirtySixtyPair(
          rng,
          [null, `${h}`, null],
          `A 30°-60°-90° triangle with hypotenuse ${h}.`,
          `一个 30°-60°-90° 三角形，斜边为 ${h}。`,
        );
        const [r, u, v] = pair.tri;
        const foot: Point = [u[0] + (v[0] - u[0]) / 4, u[1] + (v[1] - u[1]) / 4];
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer,
            wrong: [radical(q(h * h, 2), 3), radical(q(h * h, 4), 3), radical(q(h * h, 4), 1), `${h * h}\\sqrt{3}`],
            solution: paras(
              step(
                1,
                "find the legs",
                "求两条直角边",
                t(
                  `The shorter leg is half the hypotenuse, $\\frac{${h}}{2}${h % 2 === 0 ? ` = ${h / 2}` : ""}$, and the longer leg is $\\sqrt{3}$ times it, $${texS([s, 3])}$.`,
                  `较短的直角边是斜边的一半，$\\frac{${h}}{2}${h % 2 === 0 ? ` = ${h / 2}` : ""}$；较长的直角边是它的 $\\sqrt{3}$ 倍，即 $${texS([s, 3])}$。`,
                ),
              ),
              step(
                2,
                "take half the product of the legs",
                "取两条直角边乘积的一半",
                t(
                  `The legs are a base and its height:${steps(`A = \\frac{1}{2} \\cdot ${s.toLatex()} \\cdot ${texS([s, 3])} = ${texS(answer)}`)}`,
                  `两条直角边是一组底和高：${steps(`A = \\frac{1}{2} \\cdot ${s.toLatex()} \\cdot ${texS([s, 3])} = ${texS(answer)}`)}`,
                ),
              ),
              check(
                shown(
                  t(
                    `Take the hypotenuse as the base instead. The height to it from the right angle cuts off a smaller $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle whose hypotenuse is the shorter leg $${s.toLatex()}$; the height is its longer leg, $\\frac{1}{2} \\cdot ${s.toLatex()} \\cdot \\sqrt{3} = ${texS(altitude)}$. Then $A = \\frac{1}{2} \\cdot ${h} \\cdot ${texS(altitude)} = ${texS(answer)}$, the same.`,
                    `改用斜边作底。从直角顶点到斜边的高截出一个较小的 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，它的斜边是较短的直角边 $${s.toLatex()}$；这条高是它较长的直角边，$\\frac{1}{2} \\cdot ${s.toLatex()} \\cdot \\sqrt{3} = ${texS(altitude)}$。于是 $A = \\frac{1}{2} \\cdot ${h} \\cdot ${texS(altitude)} = ${texS(answer)}$，结果相同。`,
                  ),
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [figS([s, 1]), `${h}`, figS([s, 3])],
              [1],
              [
                { kind: "segment", a: r, b: foot, dashed: true, accent: true },
                { kind: "right", vertex: foot, from: v, to: r },
                {
                  kind: "label",
                  at: mid(r, foot),
                  text: figS(altitude),
                  dir: compassOf(mid(r, foot)[0] - mid(u, v)[0], mid(r, foot)[1] - mid(u, v)[1]),
                },
              ],
              `The triangle with legs ${figS([s, 1])} and ${figS([s, 3])}, the hypotenuse ${h} highlighted as a base, and the height ${figS(altitude)} to it dashed.`,
              `直角边为 ${figS([s, 1])} 和 ${figS([s, 3])} 的三角形，突出显示作底的斜边 ${h}，虚线是斜边上的高 ${figS(altitude)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-from-the-longer-leg",
      figure: specialDrawings["area-from-the-longer-leg"],
      title: t("From the longer leg", "由较长的直角边求面积"),
      explanation: t(
        `In a $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle the longer leg is $\\sqrt{3}$ times the shorter leg. Find the shorter leg by dividing by $\\sqrt{3}$, then take half the product of the two legs.

With longer leg $L$, the shorter leg is $\\frac{L}{\\sqrt{3}} = \\frac{L\\sqrt{3}}{3}$. With $L = 6$: the shorter leg is $\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$, and

$$A = \\frac{1}{2} \\cdot 2\\sqrt{3} \\cdot 6 = 6\\sqrt{3}.$$

Both legs written with $L$ give the shortcut $A = \\frac{1}{2} \\cdot \\frac{L}{\\sqrt{3}} \\cdot L = \\frac{L^2\\sqrt{3}}{6}$; here $\\frac{36\\sqrt{3}}{6} = 6\\sqrt{3}$.

> **Watch out.** The given leg is the longer one, across from $60^\\circ$: treating it as the shorter leg and multiplying it by $\\sqrt{3}$ makes the triangle three times too large. And keep the $\\frac{1}{2}$.`,
        `在 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形中，较长的直角边是较短直角边的 $\\sqrt{3}$ 倍。除以 $\\sqrt{3}$ 求出较短的直角边，再取两条直角边乘积的一半。

较长的直角边为 $L$ 时，较短的直角边是 $\\frac{L}{\\sqrt{3}} = \\frac{L\\sqrt{3}}{3}$。$L = 6$ 时：较短的直角边是 $\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$，

$$A = \\frac{1}{2} \\cdot 2\\sqrt{3} \\cdot 6 = 6\\sqrt{3}.$$

两条直角边都用 $L$ 表示，就得到捷径 $A = \\frac{1}{2} \\cdot \\frac{L}{\\sqrt{3}} \\cdot L = \\frac{L^2\\sqrt{3}}{6}$；这里 $\\frac{36\\sqrt{3}}{6} = 6\\sqrt{3}$。

> **注意。** 已知的是较长的直角边，对着 $60^\\circ$ 角：把它当作较短的直角边再乘以 $\\sqrt{3}$，面积会大三倍。另外别忘了 $\\frac{1}{2}$。`,
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 1, 3]);
        const long = surd(k, m);
        const short = divS(long, [Q.one, 3]);
        const answer = mulS(mulS(short, long), [q(1, 2), 1]);
        const longTex = sqrtTex(k, m);
        const sqL = sqS(long);
        const pair = thirtySixtyPair(
          rng,
          [null, null, label(k, m)],
          `A 30°-60°-90° triangle with longer leg ${label(k, m)}.`,
          `一个 30°-60°-90° 三角形，较长的直角边为 ${label(k, m)}。`,
        );
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [texS(mulS(mulS(long, long), [q(1, 2), 3])), texS(mulS(short, long)), texS(mulS(mulS(long, long), [q(1, 2), 1]))],
            solution: paras(
              step(
                1,
                "find the shorter leg",
                "求较短的直角边",
                shown(
                  t(
                    `$${longTex}$ is across from the $60^\\circ$ angle, the longer leg, so divide it by $\\sqrt{3}$${m === 3 ? "; the roots cancel" : " and rationalize"}:${steps(`s = ${overRoot(long, 3)}`)}`,
                    `$${longTex}$ 对着 $60^\\circ$ 角，是较长的直角边，所以除以 $\\sqrt{3}$${m === 3 ? "，根号约去" : "并把分母有理化"}：${steps(`s = ${overRoot(long, 3)}`)}`,
                  ),
                ),
              ),
              step(
                2,
                "take half the product of the legs",
                "取两条直角边乘积的一半",
                t(
                  `The legs are a base and its height:${steps(`A = \\frac{1}{2} \\cdot ${texS(short)} \\cdot ${longTex} = ${texS(answer)}`)}`,
                  `两条直角边是一组底和高：${steps(`A = \\frac{1}{2} \\cdot ${texS(short)} \\cdot ${longTex} = ${texS(answer)}`)}`,
                ),
              ),
              check(
                t(
                  `Write both legs with the longer leg $L = ${longTex}$: the area is $\\frac{L^2\\sqrt{3}}{6}$, and $L^2 = ${sqL.toLatex()}$, so $A = \\frac{${sqL.toLatex()}\\sqrt{3}}{6} = ${texS([sqL.div(q(6)), 3])}$, the same. As a decimal, about $${approx(valueS(answer))}$.`,
                  `两条直角边都用较长的直角边 $L = ${longTex}$ 表示：面积是 $\\frac{L^2\\sqrt{3}}{6}$，而 $L^2 = ${sqL.toLatex()}$，所以 $A = \\frac{${sqL.toLatex()}\\sqrt{3}}{6} = ${texS([sqL.div(q(6)), 3])}$，结果相同。写成小数约为 $${approx(valueS(answer))}$。`,
                ),
              ),
            ),
          }),
          figure: pair.figure,
          solutionFigures: [
            pair.solved(
              [figS(short), null, label(k, m)],
              [0],
              [],
              `The 30°-60°-90° triangle with longer leg ${label(k, m)} and the shorter leg just found highlighted: ${figS(short)}.`,
              `较长的直角边为 ${label(k, m)} 的 30°-60°-90° 三角形，突出显示刚求出的较短的直角边：${figS(short)}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** equilateralMarks draws an equilateral triangle in a pose with a side label, and its height dashed when height is given; half shades the half left of the height. */
function equilateralMarks(pose: Pose, side: string | null, height: string | null, half?: string): Mark[] {
  const [a, b, c, d] = posed([[0, 0] as Point, [2, 0] as Point, [1, Math.sqrt(3)] as Point, [1, 0] as Point] as const, pose);
  const marks: Mark[] = [];
  if (half !== undefined) marks.push({ kind: "shade", points: [a, d, c], tone: "result" });
  marks.push(
    { kind: "polygon", points: [a, b, c] },
    { kind: "ticks", a, b, count: 1 },
    { kind: "ticks", a: b, b: c, count: 1 },
    { kind: "ticks", a: c, b: a, count: 1 },
  );
  if (half !== undefined) marks.push({ kind: "side", a: c, b: a, text: side ?? "" }, { kind: "side", a, b: d, text: half });
  else marks.push(...outside([a, b, c], [side, null, null]));
  if (height !== null) {
    marks.push({ kind: "segment", a: c, b: d, dashed: true, accent: true });
    marks.push({ kind: "right", vertex: d, from: b, to: c });
    marks.push({ kind: "side", a: d, b: c, text: height });
  }
  return marks;
}

/** equilateralPose picks a pose for an equilateral triangle. */
const equilateralPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 180, 90, 270]), mirror: false });

/** equilateralIntro is an equilateral triangle of side 4 with its height. */
const equilateralIntro: Figure = figure(
  equilateralMarks({ turn: 0, mirror: false }, "4", "?", "2"),
  "An equilateral triangle of side 4 with its height dashed; the height meets the base at its middle, 2 from each end, and the left half is shaded.",
  "边长为 4 的等边三角形，高用虚线画出；高与底边交于中点，距两端各 2，左半部分涂上阴影。",
);

export const areaOfEquilateralTriangles: TopicDef = {
  id: "area-of-equilateral-triangles",
  title: t("The Area of an Equilateral Triangle", "等边三角形的面积"),
  summary: t(
    "Find the height and the exact area of an equilateral triangle, and its side from the area.",
    "求等边三角形的高和面积的精确值，以及由面积求边长。",
  ),
  prerequisites: ["thirty-sixty-ninety-triangles", "area-of-triangles"],
  encompasses: [
    { topic: "thirty-sixty-ninety-triangles", weight: 0.3 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.C.8"],
  intro: t(
    `To find the area of a triangle we need a base and the height to it. An equilateral triangle gives its sides but not its height. The height can be found, though, because it cuts the triangle into two $30^\\circ$-$60^\\circ$-$90^\\circ$ halves. Take side $4$:

{{figure 0}}

The height meets the base at its middle, so each half has hypotenuse $4$ and shorter leg $2$. The height is the longer leg: $2\\sqrt{3}$, or by the Pythagorean theorem $\\sqrt{4^2 - 2^2} = \\sqrt{12} = 2\\sqrt{3}$. Then

$$A = \\frac{1}{2} \\cdot 4 \\cdot 2\\sqrt{3} = 4\\sqrt{3} \\approx 6.93.$$

The same steps with side $s$ give a height of $\\frac{s\\sqrt{3}}{2}$ and an area of $\\frac{s^2\\sqrt{3}}{4}$, a formula worth knowing. In this lesson we find the height, the area from the side, and then the side from the area or the perimeter.`,
    `求三角形的面积需要一条底和这条底上的高。等边三角形给出了边长，却没有给出高。不过高可以求出来，因为它把三角形分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 的一半。取边长为 $4$：

{{figure 0}}

高与底边交于底边中点，所以每一半的斜边是 $4$，较短的直角边是 $2$。高是较长的直角边：$2\\sqrt{3}$；用勾股定理也得 $\\sqrt{4^2 - 2^2} = \\sqrt{12} = 2\\sqrt{3}$。于是

$$A = \\frac{1}{2} \\cdot 4 \\cdot 2\\sqrt{3} = 4\\sqrt{3} \\approx 6.93.$$

把边长换成 $s$ 走同样的步骤，得到高 $\\frac{s\\sqrt{3}}{2}$ 和面积 $\\frac{s^2\\sqrt{3}}{4}$，这个公式值得记住。这节课先求高，再由边长求面积，最后由面积或周长求边长。`,
  ),
  introFigures: [equilateralIntro],
  knowledgePoints: [
    {
      id: "height-of-an-equilateral-triangle",
      figure: specialDrawings["height-of-an-equilateral-triangle"],
      title: t("The height", "高"),
      explanation: t(
        `A height of an equilateral triangle with side $s$ meets the base at its middle and cuts the triangle into two $30^\\circ$-$60^\\circ$-$90^\\circ$ triangles, each with hypotenuse $s$ and shorter leg $\\frac{s}{2}$. The height is their longer leg, $\\sqrt{3}$ times the shorter one:

$$h = \\frac{s}{2} \\cdot \\sqrt{3} = \\frac{s\\sqrt{3}}{2}.$$

With side $10$: the half base is $5$ and $h = 5\\sqrt{3} \\approx 8.66$, a little shorter than the side, as it should be.

> **Watch out.** Multiply half the side by $\\sqrt{3}$, not the whole side: $10\\sqrt{3}$ would be longer than the sides of the triangle. And it is $\\sqrt{3}$, from the $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle, not $\\sqrt{2}$.`,
        `边长为 $s$ 的等边三角形的一条高与底边交于中点，把三角形分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，斜边都是 $s$，较短的直角边都是 $\\frac{s}{2}$。高是它们较长的直角边，等于较短直角边的 $\\sqrt{3}$ 倍：

$$h = \\frac{s}{2} \\cdot \\sqrt{3} = \\frac{s\\sqrt{3}}{2}.$$

边长为 $10$ 时：底的一半是 $5$，$h = 5\\sqrt{3} \\approx 8.66$，比边长略短，正应如此。

> **注意。** 要用边长的一半乘以 $\\sqrt{3}$，不是整条边：$10\\sqrt{3}$ 比三角形的边还长。另外乘的是 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形的 $\\sqrt{3}$，不是 $\\sqrt{2}$。`,
      ),
      generate(rng) {
        const s = rng.int(2, 24);
        const half = q(s, 2);
        const answer: S = [half, 3];
        const pose = equilateralPose(rng);
        return {
          ...radicalProblem({
            prompt: t(
              "The triangle is equilateral. Find its height $h$ in simplest radical form.",
              "这个三角形是等边三角形。求它的高 $h$，写成最简根式。",
            ),
            answer,
            wrong: [`${s}\\sqrt{3}`, radical(half, 2), half.toLatex(), radical(q(s, 3), 3)],
            solution: paras(
              step(
                1,
                "cut the triangle in half",
                "把三角形分成两半",
                shown(
                  t(
                    `The height meets the base at its middle, so it cuts off a $30^\\circ$-$60^\\circ$-$90^\\circ$ triangle with hypotenuse $${s}$ and shorter leg $\\frac{${s}}{2}${s % 2 === 0 ? ` = ${s / 2}` : ""}$; the height $h$ is its longer leg.`,
                    `高与底边交于中点，所以截出一个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，斜边为 $${s}$，较短的直角边为 $\\frac{${s}}{2}${s % 2 === 0 ? ` = ${s / 2}` : ""}$；高 $h$ 是它较长的直角边。`,
                  ),
                ),
              ),
              step(
                2,
                "multiply by the square root of 3",
                "乘以根号 3",
                t(
                  `The longer leg is the shorter leg times $\\sqrt{3}$:${steps(`h = ${half.toLatex()} \\cdot \\sqrt{3} = ${texS(answer)}`)}`,
                  `较长的直角边等于较短的直角边乘以 $\\sqrt{3}$：${steps(`h = ${half.toLatex()} \\cdot \\sqrt{3} = ${texS(answer)}`)}`,
                ),
              ),
              check(
                t(
                  `The Pythagorean theorem on the half: $${pow2(half.toLatex())} + ${pow2(texS(answer))} = ${half.mul(half).toLatex()} + ${sqS(answer).toLatex()} = ${s * s} = ${s}^2$. And $h \\approx ${approx(valueS(answer))}$ is a little shorter than the side $${s}$.`,
                  `对这一半用勾股定理：$${pow2(half.toLatex())} + ${pow2(texS(answer))} = ${half.mul(half).toLatex()} + ${sqS(answer).toLatex()} = ${s * s} = ${s}^2$。并且 $h \\approx ${approx(valueS(answer))}$ 比边长 $${s}$ 略短。`,
                ),
              ),
            ),
          }),
          figure: figure(
            equilateralMarks(pose, `${s}`, "h"),
            `An equilateral triangle with side ${s} and its height h dashed.`,
            `一个边长为 ${s} 的等边三角形，高 h 用虚线画出。`,
          ),
          solutionFigures: [
            figure(
              equilateralMarks(pose, `${s}`, "h", figS([half, 1])),
              `The half of the triangle cut off by the height is shaded: hypotenuse ${s}, shorter leg ${figS([half, 1])}, longer leg h.`,
              `高截出的一半涂上阴影：斜边 ${s}，较短的直角边 ${figS([half, 1])}，较长的直角边 h。`,
            ),
          ],
        };
      },
    },
    {
      id: "area-from-the-side",
      figure: specialDrawings["area-from-the-side"],
      title: t("The area from the side", "由边长求面积"),
      explanation: t(
        `The height of an equilateral triangle splits it into two $30^\\circ$-$60^\\circ$-$90^\\circ$ triangles, so the height is $\\frac{\\sqrt{3}}{2}$ times the side. Take the side as the base, and half the base times the height gives

$$A = \\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^2\\sqrt{3}}{4}.$$

With side $6$: the height is $3\\sqrt{3}$, and $A = \\frac{1}{2} \\cdot 6 \\cdot 3\\sqrt{3} = 9\\sqrt{3}$; the formula gives the same, $\\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$.

> **Watch out.** The height is not the side: $\\frac{1}{2} s^2$ uses a slanted side as the height and is too large. And the denominator is $4$: one $2$ from the $\\frac{1}{2}$ of the area, one from the height.`,
        `等边三角形的高把它分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，所以高是边长的 $\\frac{\\sqrt{3}}{2}$ 倍。以一条边为底，底乘以高的一半就是

$$A = \\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^2\\sqrt{3}}{4}.$$

边长为 $6$ 时：高是 $3\\sqrt{3}$，$A = \\frac{1}{2} \\cdot 6 \\cdot 3\\sqrt{3} = 9\\sqrt{3}$；用公式也得 $\\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$。

> **注意。** 高不是边长：$\\frac{1}{2} s^2$ 把斜着的边当成了高，结果偏大。另外分母是 $4$：一个 $2$ 来自面积公式里的 $\\frac{1}{2}$，另一个来自高。`,
      ),
      generate(rng) {
        const s = rng.int(2, 20);
        const answer: S = [q(s * s, 4), 3];
        const height: S = [q(s, 2), 3];
        const pose = equilateralPose(rng);
        const rect = s * valueS(height);
        return {
          ...radicalProblem({
            prompt: t("Find the area of the equilateral triangle in simplest radical form.", "求这个等边三角形的面积，写成最简根式。"),
            answer,
            wrong: [radical(q(s * s, 2), 3), q(s * s, 2).toLatex(), `${s * s}\\sqrt{3}`, radical(q(s * s, 4), 2)],
            solution: paras(
              step(
                1,
                "find the height",
                "求高",
                shown(
                  t(
                    `The height cuts the triangle into two $30^\\circ$-$60^\\circ$-$90^\\circ$ triangles with shorter leg $${q(s, 2).toLatex()}$; the height is the longer leg, $${texS(height)}$.`,
                    `高把三角形分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，较短的直角边是 $${q(s, 2).toLatex()}$；高是较长的直角边，即 $${texS(height)}$。`,
                  ),
                ),
              ),
              step(
                2,
                "take half the base times the height",
                "取底乘高的一半",
                t(
                  `With the side $${s}$ as the base:${steps(`A = ${eqs(`\\frac{1}{2} \\cdot ${s} \\cdot ${texS(height)}`, `\\frac{${s * s}\\sqrt{3}}{4}`, texS(answer))}`)}`,
                  `以边 $${s}$ 为底：${steps(`A = ${eqs(`\\frac{1}{2} \\cdot ${s} \\cdot ${texS(height)}`, `\\frac{${s * s}\\sqrt{3}}{4}`, texS(answer))}`)}`,
                ),
              ),
              check(
                t(
                  `Estimate: the height is about $${approx(valueS(height))}$, so the rectangle with the same base and height has area about $${s} \\cdot ${approx(valueS(height))} \\approx ${approx(rect)}$, and the triangle is half of it, about $${approx(rect / 2)}$. Indeed $${texS(answer)} \\approx ${approx(valueS(answer))}$.`,
                  `估算：高约为 $${approx(valueS(height))}$，同底同高的长方形面积约为 $${s} \\cdot ${approx(valueS(height))} \\approx ${approx(rect)}$，三角形是它的一半，约 $${approx(rect / 2)}$。确实 $${texS(answer)} \\approx ${approx(valueS(answer))}$。`,
                ),
              ),
            ),
          }),
          figure: figure(equilateralMarks(pose, `${s}`, null), `An equilateral triangle with side ${s}.`, `一个边长为 ${s} 的等边三角形。`),
          solutionFigures: [
            figure(
              equilateralMarks(pose, `${s}`, figS(height), figS([q(s, 2), 1])),
              `The equilateral triangle with side ${s} and its height ${figS(height)} dashed; one half is shaded, with shorter leg ${figS([q(s, 2), 1])}.`,
              `边长为 ${s} 的等边三角形，高 ${figS(height)} 用虚线画出；一半涂上阴影，较短的直角边为 ${figS([q(s, 2), 1])}。`,
            ),
          ],
        };
      },
    },
    {
      id: "side-from-the-area-or-perimeter",
      title: t("From the area or the perimeter", "由面积或周长求解"),
      explanation: t(
        `From the area, solve $\\frac{s^2\\sqrt{3}}{4} = A$ for $s$ by undoing each operation: divide by $\\sqrt{3}$, multiply by $4$, take the square root. If $A = 16\\sqrt{3}$, then

$$\\frac{s^2}{4} = 16, \\qquad s^2 = 64, \\qquad s = 8.$$

From the perimeter $P$, the three equal sides give $s = \\frac{P}{3}$, and then the area follows: a perimeter of $24$ gives side $8$ and area $\\frac{64\\sqrt{3}}{4} = 16\\sqrt{3}$.

> **Watch out.** $64$ is $s^2$: take the square root before answering. And the perimeter is three sides, not one: put $\\frac{P}{3}$ into the formula, not $P$.`,
        `已知面积时，由 $\\frac{s^2\\sqrt{3}}{4} = A$ 逐步撤销运算解出 $s$：除以 $\\sqrt{3}$，乘以 $4$，再开平方。若 $A = 16\\sqrt{3}$，则

$$\\frac{s^2}{4} = 16, \\qquad s^2 = 64, \\qquad s = 8.$$

已知周长 $P$ 时，三条边相等，所以 $s = \\frac{P}{3}$，再求面积：周长为 $24$ 时边长是 $8$，面积是 $\\frac{64\\sqrt{3}}{4} = 16\\sqrt{3}$。

> **注意。** $64$ 是 $s^2$，要开平方后才是答案。另外周长是三条边之和，不是一条边：代入公式的是 $\\frac{P}{3}$，不是 $P$。`,
      ),
      generate(rng) {
        const s = rng.int(2, 20);
        const area: S = [q(s * s, 4), 3];
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `An equilateral triangle has an area of $${texS(area)}$. Find the length of its side.`,
              `一个等边三角形的面积是 $${texS(area)}$。求它的边长。`,
            ),
            answer: s,
            form: "integer",
            wrong: [s * s, 2 * s, intOr(s * s, 4, s + 1)],
            solution: paras(
              step(
                1,
                "set the formula equal to the area",
                "令公式等于面积",
                t(
                  `The area of an equilateral triangle with side $s$ is $\\frac{s^2\\sqrt{3}}{4}$. Divide both sides by $\\sqrt{3}$, then multiply by $4$:${chain(`\\frac{s^2\\sqrt{3}}{4} = ${texS(area)}`, `\\frac{s^2}{4} = ${q(s * s, 4).toLatex()}`, `s^2 = ${s * s}`)}`,
                  `边长为 $s$ 的等边三角形面积是 $\\frac{s^2\\sqrt{3}}{4}$。两边除以 $\\sqrt{3}$，再乘以 $4$：${chain(`\\frac{s^2\\sqrt{3}}{4} = ${texS(area)}`, `\\frac{s^2}{4} = ${q(s * s, 4).toLatex()}`, `s^2 = ${s * s}`)}`,
                ),
              ),
              step(
                2,
                "take the square root",
                "开平方",
                t(`A length is positive:${steps(`s = \\sqrt{${s * s}} = ${s}`)}`, `长度是正数：${steps(`s = \\sqrt{${s * s}} = ${s}`)}`),
              ),
              check(
                t(
                  `Put the side back into the formula: $\\frac{${s}^2\\sqrt{3}}{4} = \\frac{${s * s}\\sqrt{3}}{4} = ${texS(area)}$, the given area.`,
                  `把边长代回公式：$\\frac{${s}^2\\sqrt{3}}{4} = \\frac{${s * s}\\sqrt{3}}{4} = ${texS(area)}$，正是已知的面积。`,
                ),
              ),
            ),
          });
        }
        const height: S = [q(s, 2), 3];
        return radicalProblem({
          prompt: t(
            `An equilateral triangle has a perimeter of $${3 * s}$. Find its area in simplest radical form.`,
            `一个等边三角形的周长是 $${3 * s}$。求它的面积，写成最简根式。`,
          ),
          answer: area,
          wrong: [radical(q(9 * s * s, 4), 3), radical(q(s * s, 2), 3), q(s * s, 4).toLatex()],
          solution: paras(
            step(
              1,
              "find the side",
              "求边长",
              t(
                `The three sides are equal, so each is a third of the perimeter:${steps(`s = \\frac{${3 * s}}{3} = ${s}`)}`,
                `三条边相等，每条边是周长的三分之一：${steps(`s = \\frac{${3 * s}}{3} = ${s}`)}`,
              ),
            ),
            step(
              2,
              "use the area formula",
              "用面积公式",
              t(
                `$A = \\frac{s^2\\sqrt{3}}{4}$ with $s = ${s}$:${steps(`A = ${eqs(`\\frac{${s}^2\\sqrt{3}}{4}`, `\\frac{${s * s}\\sqrt{3}}{4}`, texS(area))}`)}`,
                `把 $s = ${s}$ 代入 $A = \\frac{s^2\\sqrt{3}}{4}$：${steps(`A = ${eqs(`\\frac{${s}^2\\sqrt{3}}{4}`, `\\frac{${s * s}\\sqrt{3}}{4}`, texS(area))}`)}`,
              ),
            ),
            check(
              t(
                `Work it out with the height instead: it is $${texS(height)}$, half of $${s}\\sqrt{3}$, and $\\frac{1}{2} \\cdot ${s} \\cdot ${texS(height)} = ${texS(area)}$. As a decimal, about $${approx(valueS(area))}$.`,
                `改用高来算：高是 $${texS(height)}$，即 $${s}\\sqrt{3}$ 的一半，$\\frac{1}{2} \\cdot ${s} \\cdot ${texS(height)} = ${texS(area)}$。写成小数约为 $${approx(valueS(area))}$。`,
              ),
            ),
          ),
        });
      },
    },
  ],
};

const letterSets = ["ABCDE", "PQRST", "JKLMN", "UVWXY", "DEFGH", "KLMNP"] as const;

/** pickLetters picks n letters for the points of a figure. */
const pickLetters = (rng: Rng, n: number): string[] => rng.pick(letterSets).slice(0, n).split("");

/** angleSumProof is the proof that the angles of a triangle add up to 180°, through a parallel line. */
function angleSumProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const w = rng.int(5, 8);
  const cx = rng.int(1, w - 1) + rng.pick([0, 0.5]);
  const h = rng.int(3, 5);
  const [pa, pb, pc, pd, pe]: [Point, Point, Point, Point, Point] = [
    [0, 0],
    [w, 0],
    [cx, h],
    [cx - 3, h],
    [cx + 3, h],
  ];
  const base: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pd, b: pe },
    ...names([pa, pb, pc], `${A}${B}${C}`),
    { kind: "label", at: pd, text: D, dir: "w", italic: true },
    { kind: "label", at: pe, text: E, dir: "e", italic: true },
  ];
  const across = t(
    `$${A}${C}$ is a transversal of the parallel lines $${D}${E}$ and $${A}${B}$.`,
    `$${A}${C}$ 是平行线 $${D}${E}$ 与 $${A}${B}$ 的截线。`,
  );
  return {
    given: t(
      `$\\triangle ${A}${B}${C}$, with line $${D}${E}$ through $${C}$ parallel to $${A}${B}$`,
      `$\\triangle ${A}${B}${C}$，过点 $${C}$ 的直线 $${D}${E}$ 与 $${A}${B}$ 平行`,
    ),
    prove: m(`\\angle ${A} + \\angle ${B} + \\angle ${A}${C}${B} = 180^\\circ`),
    steps: [
      {
        s: m(`${D}${E} \\parallel ${A}${B}`),
        r: "given",
        marks: [
          { kind: "arrows", a: pa, b: pb, count: 1 },
          { kind: "arrows", a: pd, b: pe, count: 1 },
        ],
        drawn: true,
      },
      {
        s: m(`\\angle ${D}${C}${A} = \\angle ${A}`),
        r: "alternate",
        why: across,
        uses: [0],
        alts: [
          m(`\\angle ${D}${C}${A} = \\angle ${B}`),
          m(`\\angle ${D}${C}${A} = \\angle ${A}${C}${B}`),
          m(`\\angle ${D}${C}${A} + \\angle ${A} = 90^\\circ`),
        ],
        marks: [
          { kind: "arc", vertex: pa, from: pb, to: pc, label: "α" },
          { kind: "arc", vertex: pc, from: pd, to: pa, label: "α" },
        ],
      },
      {
        s: m(`\\angle ${E}${C}${B} = \\angle ${B}`),
        r: "alternate",
        why: t(`$${B}${C}$ is a transversal of the parallel lines.`, `$${B}${C}$ 是两条平行线的截线。`),
        uses: [0],
        alts: [
          m(`\\angle ${E}${C}${B} = \\angle ${A}`),
          m(`\\angle ${E}${C}${B} = \\angle ${D}${C}${A}`),
          m(`\\angle ${E}${C}${B} + \\angle ${B} = 90^\\circ`),
        ],
        marks: [
          { kind: "arc", vertex: pb, from: pc, to: pa, label: "β" },
          { kind: "arc", vertex: pc, from: pb, to: pe, label: "β" },
        ],
      },
      {
        s: m(`\\angle ${D}${C}${A} + \\angle ${A}${C}${B} + \\angle ${E}${C}${B} = 180^\\circ`),
        r: "straight",
        why: t(
          `The three angles at $${C}$ together make the straight angle $${D}${C}${E}$.`,
          `$${C}$ 处的三个角合起来是平角 $${D}${C}${E}$。`,
        ),
        alts: [
          m(`\\angle ${D}${C}${A} + \\angle ${A}${C}${B} + \\angle ${E}${C}${B} = 360^\\circ`),
          m(`\\angle ${D}${C}${A} + \\angle ${E}${C}${B} = 90^\\circ`),
          m(`\\angle ${D}${C}${A} = \\angle ${E}${C}${B}`),
        ],
        marks: [{ kind: "arc", vertex: pc, from: pa, to: pb, label: "γ" }],
      },
      {
        s: m(`\\angle ${A} + \\angle ${A}${C}${B} + \\angle ${B} = 180^\\circ`),
        r: "substitution",
        why: t(
          "Replace the angles at the top by the equal angles of the triangle from steps 2 and 3.",
          "用第 2、3 步中相等的三角形内角替换顶点处的角。",
        ),
        uses: [1, 2, 3],
        alts: [
          m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${B}`),
          m(`\\angle ${A} + \\angle ${A}${C}${B} + \\angle ${B} = 360^\\circ`),
          m(`\\angle ${A} = \\angle ${B}`),
        ],
      },
    ],
    base,
    alt: [
      `Triangle ${A}${B}${C} with line ${D}${E} through ${C} parallel to ${A}${B}.`,
      `三角形 ${A}${B}${C}，过 ${C} 的直线 ${D}${E} 与 ${A}${B} 平行。`,
    ],
  };
}

/** exteriorProof is the proof of the exterior angle theorem. */
function exteriorProof(rng: Rng): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const w = rng.int(5, 8);
  const ax = rng.int(1, w - 1) + rng.pick([0, 0.5]);
  const h = rng.int(3, 6);
  const [pa, pb, pc, pd]: [Point, Point, Point, Point] = [
    [ax, h],
    [0, 0],
    [w, 0],
    [w + 3, 0],
  ];
  const base: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pc, b: pd },
    ...names([pa, pb, pc], `${A}${B}${C}`),
    { kind: "label", at: pd, text: D, dir: "s", italic: true },
  ];
  const sum = `\\angle ${A} + \\angle ${B} + \\angle ${A}${C}${B}`;
  return {
    given: t(`$\\triangle ${A}${B}${C}$ with $${B}${C}$ extended to $${D}$`, `$\\triangle ${A}${B}${C}$，$${B}${C}$ 延长到 $${D}$`),
    prove: m(`\\angle ${A}${C}${D} = \\angle ${A} + \\angle ${B}`),
    steps: [
      {
        s: t(`$\\triangle ${A}${B}${C}$ with $${B}${C}$ extended to $${D}$`, `$\\triangle ${A}${B}${C}$，$${B}${C}$ 延长到 $${D}$`),
        r: "given",
        marks: [{ kind: "arc", vertex: pc, from: pd, to: pa, accent: true }],
        drawn: true,
      },
      {
        s: m(`${sum} = 180^\\circ`),
        r: "angleSum",
        alts: [m(`\\angle ${A} + \\angle ${B} = 180^\\circ`), m(`${sum} = 360^\\circ`), m(`\\angle ${A} + \\angle ${B} = 90^\\circ`)],
        marks: [
          { kind: "arc", vertex: pa, from: pb, to: pc },
          { kind: "arc", vertex: pb, from: pc, to: pa },
          { kind: "arc", vertex: pc, from: pa, to: pb },
        ],
      },
      {
        s: m(`\\angle ${A}${C}${B} + \\angle ${A}${C}${D} = 180^\\circ`),
        r: "linearPair",
        why: t(
          `$\\angle ${A}${C}${B}$ and $\\angle ${A}${C}${D}$ share the ray $${C}${A}$ and their other sides form the line $${B}${D}$.`,
          `$\\angle ${A}${C}${B}$ 与 $\\angle ${A}${C}${D}$ 有公共边 $${C}${A}$，另一边组成直线 $${B}${D}$。`,
        ),
        alts: [
          m(`\\angle ${A}${C}${B} = \\angle ${A}${C}${D}`),
          m(`\\angle ${A}${C}${B} + \\angle ${A}${C}${D} = 90^\\circ`),
          m(`\\angle ${A}${C}${D} = 180^\\circ`),
        ],
        marks: [
          { kind: "arc", vertex: pc, from: pa, to: pb },
          { kind: "arc", vertex: pc, from: pd, to: pa, accent: true },
        ],
      },
      {
        s: m(`${sum} = \\angle ${A}${C}${B} + \\angle ${A}${C}${D}`),
        r: "substitution",
        why: t("Both sums equal $180^\\circ$.", "两个和都等于 $180^\\circ$。"),
        uses: [1, 2],
      },
      {
        s: m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${D}`),
        r: "subtraction",
        why: t(`Subtract $\\angle ${A}${C}${B}$ from both sides.`, `两边同时减去 $\\angle ${A}${C}${B}$。`),
        uses: [3],
        alts: [
          m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${B}`),
          m(`\\angle ${A} = \\angle ${A}${C}${D}`),
          m(`\\angle ${A} + \\angle ${B} + \\angle ${A}${C}${D} = 180^\\circ`),
        ],
      },
    ],
    base,
    alt: [
      `Triangle ${A}${B}${C} with side ${B}${C} extended past ${C} to ${D}, forming the exterior angle ${A}${C}${D}.`,
      `三角形 ${A}${B}${C}，边 ${B}${C} 延长到 ${D}，形成外角 ${A}${C}${D}。`,
    ],
  };
}

const sixLetters = ["ABCDEF", "PQRSTU", "JKLXYZ", "EFGRST", "ABCPQR", "KLMXYZ"] as const;

/** thirdAnglesProof is the proof that two triangles with two pairs of equal angles have equal third angles. */
function thirdAnglesProof(rng: Rng): Proof {
  const [A, B, C, D, E, F] = rng.pick(sixLetters).split("") as [string, string, string, string, string, string];
  let a = 0;
  let b = 0;
  do {
    a = rng.int(35, 80);
    b = rng.int(35, 80);
  } while (a + b > 145);
  const small = triangleByAngles(a, b);
  const k = rng.pick([0.6, 0.7, 1.3, 1.5]);
  const big = small.map(([x, y]) => [9 + k * x, k * y] as Point) as [Point, Point, Point];
  const base: Mark[] = [
    { kind: "polygon", points: small },
    { kind: "polygon", points: big },
    ...names(small, `${A}${B}${C}`),
    ...names(big, `${D}${E}${F}`),
  ];
  const third = (p: readonly [Point, Point, Point], label?: string): Mark => ({ kind: "arc", vertex: p[2], from: p[0], to: p[1], label });
  return {
    given: m(`\\angle ${A} = \\angle ${D}, \\; \\angle ${B} = \\angle ${E}`),
    prove: m(`\\angle ${C} = \\angle ${F}`),
    steps: [
      {
        s: m(`\\angle ${A} = \\angle ${D}, \\; \\angle ${B} = \\angle ${E}`),
        r: "given",
        marks: [
          { kind: "arc", vertex: small[0], from: small[1], to: small[2], label: "α" },
          { kind: "arc", vertex: big[0], from: big[1], to: big[2], label: "α" },
          { kind: "arc", vertex: small[1], from: small[2], to: small[0], label: "β", accent: true },
          { kind: "arc", vertex: big[1], from: big[2], to: big[0], label: "β", accent: true },
        ],
        drawn: true,
      },
      { s: m(`\\angle ${A} + \\angle ${B} + \\angle ${C} = 180^\\circ`), r: "angleSum", marks: [third(small)] },
      { s: m(`\\angle ${D} + \\angle ${E} + \\angle ${F} = 180^\\circ`), r: "angleSum", marks: [third(big)] },
      {
        s: m(`\\angle ${A} + \\angle ${B} + \\angle ${C} = \\angle ${D} + \\angle ${E} + \\angle ${F}`),
        r: "substitution",
        why: t("Both sums equal $180^\\circ$.", "两个和都等于 $180^\\circ$。"),
        uses: [1, 2],
        alts: [
          m(`\\angle ${A} + \\angle ${B} = \\angle ${C}`),
          m(`\\angle ${C} + \\angle ${F} = 180^\\circ`),
          m(`\\angle ${A} + \\angle ${D} = \\angle ${B} + \\angle ${E}`),
        ],
      },
      {
        s: m(`\\angle ${A} + \\angle ${B} + \\angle ${C} = \\angle ${A} + \\angle ${B} + \\angle ${F}`),
        r: "substitution",
        why: t(
          `Replace $\\angle ${D}$ by $\\angle ${A}$ and $\\angle ${E}$ by $\\angle ${B}$ (step 1).`,
          `用 $\\angle ${A}$ 替换 $\\angle ${D}$，用 $\\angle ${B}$ 替换 $\\angle ${E}$（第 1 步）。`,
        ),
        uses: [0, 3],
      },
      {
        s: m(`\\angle ${C} = \\angle ${F}`),
        r: "subtraction",
        why: t(`Subtract $\\angle ${A} + \\angle ${B}$ from both sides.`, `两边同时减去 $\\angle ${A} + \\angle ${B}$。`),
        uses: [4],
        alts: [m(`\\angle ${C} = \\angle ${D}`), m(`\\angle ${C} + \\angle ${F} = 180^\\circ`), m(`\\angle ${A} = \\angle ${F}`)],
        marks: [third(small, "γ"), third(big, "γ")],
      },
    ],
    base,
    alt: [
      `Triangles ${A}${B}${C} and ${D}${E}${F} with angle ${A} equal to angle ${D} and angle ${B} equal to angle ${E}.`,
      `三角形 ${A}${B}${C} 和 ${D}${E}${F}，角 ${A} 等于角 ${D}，角 ${B} 等于角 ${E}。`,
    ],
  };
}

const anglePool: readonly Reason[] = [
  "given",
  "alternate",
  "corresponding",
  "consecutive",
  "vertical",
  "straight",
  "linearPair",
  "angleSum",
  "substitution",
  "subtraction",
];

/** verticalIntro is two lines crossing, with angles 1, 2 and 3 in turn around the crossing. */
const verticalIntro: Figure = figure(
  [
    { kind: "segment", a: [-4, 0], b: [4, 0] },
    { kind: "segment", a: dir(215, 4), b: dir(35, 4) },
    { kind: "arc", vertex: [0, 0], from: [4, 0], to: dir(35, 4), label: "1", accent: true },
    { kind: "arc", vertex: [0, 0], from: dir(35, 4), to: [-4, 0], label: "2" },
    { kind: "arc", vertex: [0, 0], from: [-4, 0], to: dir(215, 4), label: "3", accent: true },
  ],
  "Two lines crossing. Around the crossing, angle 1 lies between the right ray and the upper slanted ray, angle 2 next to it above the horizontal line, and angle 3 opposite angle 1.",
  "两条直线相交。在交点周围，角 1 在向右的射线与向上的斜射线之间，角 2 紧挨着它、在水平线上方，角 3 与角 1 相对。",
);

export const provingTriangleTheorems: TopicDef = {
  id: "proving-triangle-theorems",
  title: t("Proving Triangle Theorems", "证明三角形定理"),
  summary: t(
    "Follow and complete proofs of the triangle angle sum theorem, the exterior angle theorem and the third angles theorem.",
    "理解并补全三角形内角和定理、外角定理和第三角定理的证明。",
  ),
  prerequisites: ["the-exterior-angle-theorem"],
  encompasses: [
    { topic: "angles-of-a-triangle", weight: 0.2 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.10"],
  intro: t(
    `We have used the angle sum $180^\\circ$ and the exterior angle theorem many times. A **proof** shows why they must hold in every triangle, not only in the ones we measured. It is a chain of statements, each with a reason: a given fact, a definition, or a theorem proved earlier. A **two-column proof** writes the statements on the left and the reasons on the right.

Here is a short one, about the angles where two lines cross:

{{figure 0}}

1. $\\angle 1 + \\angle 2 = 180^\\circ$: they form a linear pair, sharing a ray, with their other rays along one line.
2. $\\angle 2 + \\angle 3 = 180^\\circ$: also a linear pair.
3. $\\angle 1 + \\angle 2 = \\angle 2 + \\angle 3$: substitution, since both sums equal $180^\\circ$.
4. $\\angle 1 = \\angle 3$: subtract $\\angle 2$ from both sides.

So vertical angles are always equal. Every step uses only the figure and facts already established, and the last step is the statement we set out to prove. In this lesson we read and complete proofs of three triangle theorems in the same way.`,
    `内角和 $180^\\circ$ 和外角定理我们已经用过很多次。**证明**要说明它们为什么对每个三角形都成立，而不只是对量过的那几个。证明是一串结论，每条都有理由：已知条件、定义，或之前证明过的定理。**两栏式证明**把结论写在左栏，理由写在右栏。

先看一个简短的例子，讲两条直线相交处的角：

{{figure 0}}

1. $\\angle 1 + \\angle 2 = 180^\\circ$：它们是邻补角，有一条公共边，另外两边在一条直线上。
2. $\\angle 2 + \\angle 3 = 180^\\circ$：也是邻补角。
3. $\\angle 1 + \\angle 2 = \\angle 2 + \\angle 3$：等量代换，两个和都等于 $180^\\circ$。
4. $\\angle 1 = \\angle 3$：两边同时减去 $\\angle 2$。

所以对顶角总是相等。每一步只用到图形和已经确立的事实，最后一步正是要证明的结论。这节课我们用同样的方式阅读并补全三个三角形定理的证明。`,
  ),
  introFigures: [verticalIntro],
  knowledgePoints: [
    {
      id: "proving-the-angle-sum-theorem",
      figure: similarityDrawings["proving-the-angle-sum-theorem"],
      title: t("The angle sum theorem", "三角形内角和定理"),
      explanation: t(
        `A **two-column proof** lists statements, each with a reason: something given, a definition, or a theorem already proved.

Why should the three angles of $\\triangle ABC$ make $180^\\circ$? The idea is to move them to one point, where they can be seen to fill a straight angle. Draw the line $DE$ through $C$ parallel to $AB$. The sides $AC$ and $BC$ are transversals of the two parallels, so copies of $\\angle A$ and $\\angle B$ appear at $C$:

1. $\\angle DCA = \\angle A$ and $\\angle ECB = \\angle B$: alternate interior angles are congruent.
2. $\\angle DCA + \\angle ACB + \\angle ECB = 180^\\circ$: the three angles at $C$ make the straight angle $DCE$.
3. $\\angle A + \\angle ACB + \\angle B = 180^\\circ$: substitution of the equal angles from step 1.

> **Watch out.** The angles at $C$ are *alternate* interior angles, between the parallels and on opposite sides of the transversal, not corresponding angles. And the three angles at $C$ fill a straight angle, $180^\\circ$, not a full turn of $360^\\circ$.`,
        `**两栏式证明**逐条列出结论，每条都写明理由：已知条件、定义，或已经证明的定理。

为什么 $\\triangle ABC$ 的三个角加起来是 $180^\\circ$？思路是把三个角搬到同一点，看出它们正好组成一个平角。过 $C$ 作直线 $DE$ 平行于 $AB$。边 $AC$、$BC$ 都是这两条平行线的截线，于是 $\\angle A$ 和 $\\angle B$ 在 $C$ 处各有一个相等的角：

1. $\\angle DCA = \\angle A$，$\\angle ECB = \\angle B$：两直线平行，内错角相等。
2. $\\angle DCA + \\angle ACB + \\angle ECB = 180^\\circ$：$C$ 处的三个角组成平角 $DCE$。
3. $\\angle A + \\angle ACB + \\angle B = 180^\\circ$：用第 1 步中相等的角等量代换。

> **注意。** $C$ 处的角是*内错角*：夹在两条平行线之间，分在截线两侧，不是同位角。另外 $C$ 处的三个角组成的是平角 $180^\\circ$，不是周角 $360^\\circ$。`,
      ),
      keyPrerequisites: ["parallel-lines-and-transversals"],
      generate: (rng) =>
        proofProblem(
          rng,
          angleSumProof(rng),
          anglePool.filter((r) => r !== "angleSum"),
        ),
    },
    {
      id: "proving-the-exterior-angle-theorem",
      figure: similarityDrawings["proving-the-exterior-angle-theorem"],
      title: t("The exterior angle theorem", "外角定理"),
      explanation: t(
        `Once the angle sum theorem is proved, it can be used as a reason. The exterior angle theorem follows because the exterior angle and the triangle's angle at $C$ make $180^\\circ$, and so do all three angles of the triangle; take away the common angle and what remains is equal. In $\\triangle ABC$ with $BC$ extended to $D$:

1. $\\angle A + \\angle B + \\angle ACB = 180^\\circ$: triangle angle sum theorem.
2. $\\angle ACB + \\angle ACD = 180^\\circ$: the angles form a linear pair.
3. $\\angle A + \\angle B + \\angle ACB = \\angle ACB + \\angle ACD$: substitution, since both equal $180^\\circ$.
4. $\\angle A + \\angle B = \\angle ACD$: subtract $\\angle ACB$ from both sides.

> **Watch out.** $\\angle ACB$ and the exterior angle $\\angle ACD$ form a linear pair, so they *add* to $180^\\circ$; they are not equal. And the exterior angle equals the sum of the two angles *away* from it, $\\angle A$ and $\\angle B$, not one of them alone.`,
        `内角和定理证明之后，就可以作为理由使用。外角定理之所以成立，是因为外角与三角形在 $C$ 处的角之和是 $180^\\circ$，三角形三个角之和也是 $180^\\circ$；去掉共同的那个角，剩下的部分相等。在 $\\triangle ABC$ 中，$BC$ 延长到 $D$：

1. $\\angle A + \\angle B + \\angle ACB = 180^\\circ$：三角形内角和定理。
2. $\\angle ACB + \\angle ACD = 180^\\circ$：两角是邻补角。
3. $\\angle A + \\angle B + \\angle ACB = \\angle ACB + \\angle ACD$：等量代换，两边都等于 $180^\\circ$。
4. $\\angle A + \\angle B = \\angle ACD$：两边同时减去 $\\angle ACB$。

> **注意。** $\\angle ACB$ 与外角 $\\angle ACD$ 是邻补角，它们*相加*得 $180^\\circ$，并不相等。另外外角等于与它不相邻的两个内角 $\\angle A$ 与 $\\angle B$ 之*和*，不是其中一个。`,
      ),
      generate: (rng) => proofProblem(rng, exteriorProof(rng), anglePool),
    },
    {
      id: "proving-the-third-angles-theorem",
      figure: similarityDrawings["proving-the-third-angles-theorem"],
      title: t("The third angles theorem", "第三角定理"),
      explanation: t(
        `**Third angles theorem:** if two angles of one triangle are equal to two angles of another, the third angles are equal too. The reason is that each third angle is what is left of $180^\\circ$ after the other two, and the other two are the same.

Given $\\angle A = \\angle D$ and $\\angle B = \\angle E$:

1. $\\angle A + \\angle B + \\angle C = 180^\\circ$ and $\\angle D + \\angle E + \\angle F = 180^\\circ$: triangle angle sum theorem, twice.
2. $\\angle A + \\angle B + \\angle C = \\angle D + \\angle E + \\angle F$: substitution, both equal $180^\\circ$.
3. $\\angle A + \\angle B + \\angle C = \\angle A + \\angle B + \\angle F$: substitution of the given equal angles.
4. $\\angle C = \\angle F$: subtract $\\angle A + \\angle B$ from both sides.

> **Watch out.** The angles that end up equal are the two *not* given, $\\angle C$ and $\\angle F$; $\\angle C = \\angle D$ does not follow. Step 3 uses the given facts to replace $\\angle D$ and $\\angle E$; without it the two sides of the equation cannot be compared.`,
        `**第三角定理**：如果一个三角形的两个角分别等于另一个三角形的两个角，那么它们的第三个角也相等。原因是每个第三角都是 $180^\\circ$ 减去另外两个角剩下的部分，而另外两个角是一样的。

已知 $\\angle A = \\angle D$，$\\angle B = \\angle E$：

1. $\\angle A + \\angle B + \\angle C = 180^\\circ$，$\\angle D + \\angle E + \\angle F = 180^\\circ$：两次使用三角形内角和定理。
2. $\\angle A + \\angle B + \\angle C = \\angle D + \\angle E + \\angle F$：等量代换，两边都等于 $180^\\circ$。
3. $\\angle A + \\angle B + \\angle C = \\angle A + \\angle B + \\angle F$：用已知的相等角等量代换。
4. $\\angle C = \\angle F$：两边同时减去 $\\angle A + \\angle B$。

> **注意。** 最后相等的是两个*未给出*的角 $\\angle C$ 与 $\\angle F$；推不出 $\\angle C = \\angle D$。第 3 步用已知条件替换 $\\angle D$ 和 $\\angle E$；没有这一步，等式两边无法比较。`,
      ),
      generate: (rng) => proofProblem(rng, thirdAnglesProof(rng), anglePool),
    },
  ],
};

/** IsoFigure is an isosceles triangle A (apex), B, C with D the midpoint of the base. */
interface IsoFigure {
  readonly pa: Point;
  readonly pb: Point;
  readonly pc: Point;
  readonly pd: Point;
}

/** isoPoints places an isosceles triangle with half-base w and height h, its apex up. */
function isoPoints(rng: Rng): IsoFigure {
  const w = rng.int(3, 7);
  const h = rng.int(4, 10);
  return { pa: [0, h], pb: [-w, 0], pc: [w, 0], pd: [0, 0] };
}

/** isoBase draws an isosceles triangle with the segment from the apex to D dashed and its four letters, with no marks. */
function isoBase(f: IsoFigure, letters: string): Mark[] {
  const { pa, pb, pc, pd } = f;
  return [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pa, b: pd, dashed: true, accent: true },
    ...names([pa, pb, pc], letters.slice(0, 3)),
    { kind: "label", at: pd, text: letters[3]!, dir: "s", italic: true },
  ];
}

/** IsoParts are the marks of the equal parts of an isosceles triangle split by the segment from its apex to D. */
const isoParts = (f: IsoFigure) => {
  const { pa, pb, pc, pd } = f;
  return {
    legs: [
      { kind: "ticks", a: pa, b: pb, count: 1 },
      { kind: "ticks", a: pa, b: pc, count: 1 },
    ] as Mark[],
    halves: [
      { kind: "ticks", a: pb, b: pd, count: 2 },
      { kind: "ticks", a: pd, b: pc, count: 2 },
    ] as Mark[],
    shared: [{ kind: "ticks", a: pa, b: pd, count: 3 }] as Mark[],
    baseAngles: [
      { kind: "arc", vertex: pb, from: pc, to: pa },
      { kind: "arc", vertex: pc, from: pa, to: pb },
    ] as Mark[],
    apexHalves: [
      { kind: "arc", vertex: pa, from: pb, to: pd, accent: true },
      { kind: "arc", vertex: pa, from: pd, to: pc, accent: true },
    ] as Mark[],
    footAngles: [
      { kind: "arc", vertex: pd, from: pa, to: pb, accent: true },
      { kind: "arc", vertex: pd, from: pc, to: pa, accent: true },
    ] as Mark[],
    right: [{ kind: "right", vertex: pd, from: pc, to: pa }] as Mark[],
  };
};

const congruencePool: readonly Reason[] = [
  "given",
  "bisector",
  "midpoint",
  "reflexive",
  "sas",
  "asa",
  "aas",
  "sss",
  "cpctc",
  "vertical",
  "linearPair",
  "halving",
];

/** isoscelesTheoremProof proves that base angles of an isosceles triangle are equal (variant 0), its converse (1), or that the bisector of the vertex angle is the perpendicular bisector of the base (2). */
function isoscelesTheoremProof(rng: Rng, variant: 0 | 1 | 2): Proof {
  const [A, B, C, D] = pickLetters(rng, 4) as [string, string, string, string];
  const f = isoPoints(rng);
  const parts = isoParts(f);
  const letters = `${A}${B}${C}${D}`;
  const alt: [string, string] =
    variant === 1
      ? [
          `Triangle ${A}${B}${C} with ${A}${D} bisecting angle ${A} and ${D} on ${B}${C}.`,
          `三角形 ${A}${B}${C}，${A}${D} 平分角 ${A}，${D} 在 ${B}${C} 上。`,
        ]
      : [
          `Triangle ${A}${B}${C} with ${A}${B} = ${A}${C}, and ${A}${D} bisecting angle ${A} with ${D} on ${B}${C}.`,
          `三角形 ${A}${B}${C}，${A}${B} = ${A}${C}，${A}${D} 平分角 ${A}，${D} 在 ${B}${C} 上。`,
        ];
  const bisect: ProofStep = {
    s: m(`\\angle ${B}${A}${D} = \\angle ${C}${A}${D}`),
    r: "bisector",
    alts: [m(`\\angle ${B}${A}${D} = \\angle ${B}`), m(`${B}${D} = ${C}${D}`), m(`\\angle ${A}${D}${B} = \\angle ${A}${D}${C}`)],
    marks: parts.apexHalves,
    drawn: true,
  };
  const common: ProofStep = {
    s: m(`${A}${D} = ${A}${D}`),
    r: "reflexive",
    why: t(`The two triangles share the side $${A}${D}$.`, `两个三角形有公共边 $${A}${D}$。`),
    marks: parts.shared,
  };
  const congruent = (r: Reason): ProofStep => ({
    s: m(`\\triangle ${A}${B}${D} \\cong \\triangle ${A}${C}${D}`),
    r,
    why:
      r === "sas"
        ? t(
            `Two sides and the angle between them: $${A}${B} = ${A}${C}$, $\\angle ${B}${A}${D} = \\angle ${C}${A}${D}$, $${A}${D} = ${A}${D}$.`,
            `两边及其夹角：$${A}${B} = ${A}${C}$，$\\angle ${B}${A}${D} = \\angle ${C}${A}${D}$，$${A}${D} = ${A}${D}$。`,
          )
        : t(
            `Two angles and a side not between them: $\\angle ${B} = \\angle ${C}$, $\\angle ${B}${A}${D} = \\angle ${C}${A}${D}$, $${A}${D} = ${A}${D}$.`,
            `两角及其中一角的对边：$\\angle ${B} = \\angle ${C}$，$\\angle ${B}${A}${D} = \\angle ${C}${A}${D}$，$${A}${D} = ${A}${D}$。`,
          ),
    uses: [0, 1, 2],
    alts: [
      m(`\\triangle ${A}${B}${D} \\cong \\triangle ${A}${D}${C}`),
      m(`\\triangle ${A}${B}${D} \\cong \\triangle ${C}${A}${D}`),
      m(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${D}`),
    ],
  });
  const base = isoBase(f, letters);
  if (variant === 1) {
    return {
      given: t(
        `$\\angle ${B} = \\angle ${C}$, and $${A}${D}$ bisects $\\angle ${B}${A}${C}$`,
        `$\\angle ${B} = \\angle ${C}$，$${A}${D}$ 平分 $\\angle ${B}${A}${C}$`,
      ),
      prove: m(`${A}${B} = ${A}${C}`),
      steps: [
        { s: m(`\\angle ${B} = \\angle ${C}`), r: "given", marks: parts.baseAngles, drawn: true },
        bisect,
        common,
        congruent("aas"),
        {
          s: m(`${A}${B} = ${A}${C}`),
          r: "cpctc",
          uses: [3],
          alts: [m(`${A}${B} = ${B}${C}`), m(`${B}${D} = ${A}${D}`), m(`\\angle ${B} = \\angle ${B}${A}${D}`)],
          marks: parts.legs,
        },
      ],
      base,
      alt,
      parts: [0, 1, 2],
    };
  }
  const start: ProofStep[] = [
    { s: m(`${A}${B} = ${A}${C}`), r: "given", marks: parts.legs, drawn: true },
    bisect,
    common,
    congruent("sas"),
  ];
  const given = t(
    `$${A}${B} = ${A}${C}$, and $${A}${D}$ bisects $\\angle ${B}${A}${C}$`,
    `$${A}${B} = ${A}${C}$，$${A}${D}$ 平分 $\\angle ${B}${A}${C}$`,
  );
  if (variant === 0) {
    return {
      given,
      prove: m(`\\angle ${B} = \\angle ${C}`),
      steps: [
        ...start,
        {
          s: m(`\\angle ${B} = \\angle ${C}`),
          r: "cpctc",
          uses: [3],
          alts: [m(`\\angle ${B} = \\angle ${B}${A}${D}`), m(`${B}${D} = ${A}${D}`), m(`\\angle ${B} + \\angle ${C} = 90^\\circ`)],
          marks: parts.baseAngles,
        },
      ],
      base,
      alt,
      parts: [0, 1, 2],
    };
  }
  return {
    given,
    prove: t(`$${B}${D} = ${C}${D}$ and $${A}${D} \\perp ${B}${C}$`, `$${B}${D} = ${C}${D}$，且 $${A}${D} \\perp ${B}${C}$`),
    steps: [
      ...start,
      {
        s: m(`${B}${D} = ${C}${D}`),
        r: "cpctc",
        uses: [3],
        alts: [m(`${B}${D} = ${A}${D}`), m(`${A}${B} = ${B}${D}`), m(`${B}${C} = ${A}${D}`)],
        marks: parts.halves,
      },
      { s: m(`\\angle ${A}${D}${B} = \\angle ${A}${D}${C}`), r: "cpctc", uses: [3], marks: parts.footAngles },
      {
        s: m(`\\angle ${A}${D}${B} + \\angle ${A}${D}${C} = 180^\\circ`),
        r: "linearPair",
        alts: [
          m(`\\angle ${A}${D}${B} + \\angle ${A}${D}${C} = 90^\\circ`),
          m(`\\angle ${A}${D}${B} + \\angle ${B} = 90^\\circ`),
          m(`\\angle ${A}${D}${B} = 180^\\circ`),
        ],
      },
      {
        s: m(`\\angle ${A}${D}${B} = 90^\\circ`),
        r: "halving",
        why: t(`By steps 6 and 7, $2\\angle ${A}${D}${B} = 180^\\circ$.`, `由第 6、7 步，$2\\angle ${A}${D}${B} = 180^\\circ$。`),
        uses: [5, 6],
        alts: [m(`\\angle ${A}${D}${B} = 45^\\circ`), m(`\\angle ${A}${D}${B} = 180^\\circ`), m(`\\angle ${A}${D}${B} = \\angle ${B}`)],
        marks: parts.right,
      },
    ],
    base,
    alt,
    parts: [0, 1, 2],
  };
}

/** foldIntro is an isosceles triangle with legs 5 and base 6, folded along the line from its apex to the middle of the base. */
const foldIntro: Figure = figure(
  [
    {
      kind: "shade",
      points: [
        [0, 4],
        [-3, 0],
        [0, 0],
      ],
      tone: "result",
    },
    {
      kind: "polygon",
      points: [
        [0, 4],
        [-3, 0],
        [3, 0],
      ],
    },
    { kind: "segment", a: [0, 4], b: [0, 0], dashed: true, accent: true },
    { kind: "ticks", a: [0, 4], b: [-3, 0], count: 1 },
    { kind: "ticks", a: [0, 4], b: [3, 0], count: 1 },
    { kind: "side", a: [0, 4], b: [-3, 0], text: "5" },
    { kind: "side", a: [3, 0], b: [0, 4], text: "5" },
    { kind: "side", a: [-3, 0], b: [0, 0], text: "3" },
    { kind: "side", a: [0, 0], b: [3, 0], text: "3" },
    { kind: "arc", vertex: [-3, 0], from: [3, 0], to: [0, 4] },
    { kind: "arc", vertex: [3, 0], from: [0, 4], to: [-3, 0] },
    { kind: "right", vertex: [0, 0], from: [3, 0], to: [0, 4] },
  ],
  "An isosceles triangle with legs 5 and base 6, cut by a dashed fold line from the apex to the middle of the base, 3 from each end; the left half is shaded, and the two base angles are marked.",
  "腰长为 5、底边为 6 的等腰三角形，虚线是从顶点到底边中点的折痕，中点距两端各 3；左半部分涂上阴影，两个底角都做了标记。",
);

/** isoValues draws the triangle of a problem on the isosceles triangle theorems with the solved values written in. */
function isoValues(f: IsoFigure, marks: readonly Mark[], en: string, zh: string): Figure {
  const { pa, pb, pc } = f;
  return figure([{ kind: "polygon", points: [pa, pb, pc] }, ...marks, ...names([pa, pb, pc], "ABC")], en, zh);
}

export const proofsInvolvingIsoscelesTriangles: TopicDef = {
  id: "proofs-involving-isosceles-triangles",
  title: t("Proofs Involving Isosceles Triangles", "等腰三角形的证明"),
  summary: t(
    "Prove the isosceles triangle theorem and its converse with congruent triangles, and use them to find sides and angles.",
    "用全等三角形证明等腰三角形定理及其逆定理，并用它们求边和角。",
  ),
  prerequisites: ["proving-triangle-theorems", "isosceles-triangles"],
  encompasses: [{ topic: "equations-with-variables-on-both-sides", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.10"],
  intro: t(
    `We know that an isosceles triangle has equal base angles. One way to see it is to fold. Take legs of $5$ and a base of $6$, and fold along the line from the top to the middle of the base:

{{figure 0}}

The two legs are equal, so the left half lands exactly on the right half: the base halves of $3$ match, the fold meets the base at a right angle, and the two base angles lie on top of each other. The height is $4$, since $3^2 + 4^2 = 5^2$.

A fold is a picture, not a proof: it shows one triangle, and we trusted our eyes that the halves match. **Congruent triangles** turn the fold into an argument for every isosceles triangle. If the two halves have equal sides and angles in the right places, a congruence criterion says they are congruent, and then all their other parts match too. In this lesson we prove the isosceles triangle theorem, its converse and the fact about the fold line this way, and then use the theorems to find sides and angles.`,
    `我们知道等腰三角形的两个底角相等。一种看法是对折。取腰长为 $5$、底边为 $6$ 的三角形，沿从顶点到底边中点的直线对折：

{{figure 0}}

两腰相等，所以左半部分正好落在右半部分上：两段长 $3$ 的底边重合，折痕与底边成直角，两个底角也叠在一起。高是 $4$，因为 $3^2 + 4^2 = 5^2$。

对折只是一个图示，不是证明：它只展示了一个三角形，而且我们是凭眼睛相信两半重合的。**全等三角形**把对折变成对每个等腰三角形都成立的论证。只要两半的边和角在对应的位置上相等，全等判定就说明它们全等，于是其余各部分也都对应相等。这节课我们这样证明等腰三角形定理、它的逆定理和关于折痕的结论，再用这些定理求边和角。`,
  ),
  introFigures: [foldIntro],
  knowledgePoints: [
    {
      id: "proving-the-isosceles-triangle-theorem",
      figure: geometryDrawings2["proofs-involving-isosceles-triangles#proving-the-isosceles-triangle-theorem"],
      title: t("The isosceles triangle theorem", "等腰三角形定理"),
      explanation: t(
        `Two triangles are **congruent** ($\\cong$) when their corresponding sides and angles are equal. The **SAS** criterion says that two sides and the angle between them are enough; then every other pair of corresponding parts is equal too (**CPCTC**: corresponding parts of congruent triangles are congruent).

**Isosceles triangle theorem:** if $AB = AC$, then $\\angle B = \\angle C$. The base angles sit in two different places of one triangle, so to compare them we split the triangle into two triangles that each hold one of them. Draw the bisector $AD$ of $\\angle A$. Then:

1. $AB = AC$: given.
2. $\\angle BAD = \\angle CAD$: definition of an angle bisector.
3. $AD = AD$: reflexive property, since the side is shared.
4. $\\triangle ABD \\cong \\triangle ACD$: SAS, as the angle at $A$ lies between the sides of steps 1 and 3.
5. $\\angle B = \\angle C$: CPCTC.

> **Watch out.** Only $AB = AC$ is given: the equal halves of $\\angle A$ come from the definition of a bisector, and $AD = AD$ from the reflexive property. And name the triangles with matching vertices in the same order: $\\triangle ABD \\cong \\triangle ACD$, since $B$ matches $C$; writing $\\triangle ADC$ pairs $B$ with $D$.`,
        `两个三角形的对应边、对应角都相等时，称它们**全等**（$\\cong$）。**SAS**（边角边）判定说：两边及其夹角对应相等就足够了；这时其余各组对应部分也都相等（**全等三角形的对应部分相等**）。

**等腰三角形定理**：若 $AB = AC$，则 $\\angle B = \\angle C$。两个底角在同一个三角形的不同位置，要比较它们，就把三角形分成两个三角形，各含一个底角。作 $\\angle A$ 的平分线 $AD$。于是：

1. $AB = AC$：已知。
2. $\\angle BAD = \\angle CAD$：角平分线的定义。
3. $AD = AD$：自反性，这条边是公共边。
4. $\\triangle ABD \\cong \\triangle ACD$：SAS，$A$ 处的角夹在第 1、3 步的两边之间。
5. $\\angle B = \\angle C$：全等三角形的对应部分相等。

> **注意。** 已知的只有 $AB = AC$：$\\angle A$ 被分成相等的两半来自角平分线的定义，$AD = AD$ 来自自反性。另外书写全等时对应顶点要按相同顺序：$B$ 对应 $C$，所以写 $\\triangle ABD \\cong \\triangle ACD$；写成 $\\triangle ADC$ 就把 $B$ 和 $D$ 配在一起了。`,
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 0), congruencePool),
    },
    {
      id: "proving-the-converse",
      figure: geometryDrawings2["proofs-involving-isosceles-triangles#proving-the-converse"],
      title: t("The converse", "逆定理"),
      explanation: t(
        `**Converse:** if $\\angle B = \\angle C$, then $AB = AC$. A converse swaps what is given and what is proved, so it needs its own proof. Draw the bisector $AD$ again. Now the equal parts are:

1. $\\angle B = \\angle C$: given.
2. $\\angle BAD = \\angle CAD$: definition of a bisector.
3. $AD = AD$: reflexive property.

The common side $AD$ is not between $\\angle B$ and $\\angle BAD$; it is across from $\\angle B$. The **AAS** criterion (two angles and a side not between them) gives $\\triangle ABD \\cong \\triangle ACD$, and CPCTC gives $AB = AC$.

> **Watch out.** Check where the side sits before naming the criterion: here it is not between the two angles, so the reason is AAS, not ASA, and with only one pair of sides it cannot be SAS or SSS. And $AB = AC$ is what is being proved, so it cannot be used as a step before the congruence.`,
        `**逆定理**：若 $\\angle B = \\angle C$，则 $AB = AC$。逆定理把已知和求证互换，需要单独证明。同样作角平分线 $AD$。这时相等的部分是：

1. $\\angle B = \\angle C$：已知。
2. $\\angle BAD = \\angle CAD$：角平分线的定义。
3. $AD = AD$：自反性。

公共边 $AD$ 不在 $\\angle B$ 与 $\\angle BAD$ 之间，而是 $\\angle B$ 的对边。由 **AAS**（角角边）判定得 $\\triangle ABD \\cong \\triangle ACD$，再由对应部分相等得 $AB = AC$。

> **注意。** 先看清边的位置再选判定：这里的边不在两个角之间，所以理由是 AAS，不是 ASA；只有一组边，也不可能是 SAS 或 SSS。另外 $AB = AC$ 是要证明的结论，在得出全等之前不能把它当作一步使用。`,
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 1), congruencePool),
    },
    {
      id: "the-bisector-of-the-vertex-angle",
      figure: geometryDrawings2["proofs-involving-isosceles-triangles#the-bisector-of-the-vertex-angle"],
      title: t("The bisector of the vertex angle", "顶角的平分线"),
      explanation: t(
        `The same congruence $\\triangle ABD \\cong \\triangle ACD$ gives more, because every pair of corresponding parts is equal, not only the base angles. By CPCTC, $BD = CD$, so $D$ is the midpoint of $BC$, and $\\angle ADB = \\angle ADC$.

These two angles form a linear pair, so they add up to $180^\\circ$. Being equal, each is half of it: $2\\angle ADB = 180^\\circ$, so $\\angle ADB = 90^\\circ$. So the bisector of the vertex angle of an isosceles triangle is the perpendicular bisector of its base, the fold line of the triangle.

> **Watch out.** Two equal angles that add up to $180^\\circ$ are $90^\\circ$ each, not $45^\\circ$: $45^\\circ$ would come from a sum of $90^\\circ$. And $\\angle ADB = \\angle ADC$ comes from the congruence (CPCTC), not from the linear pair, which only gives their sum.`,
        `同一个全等 $\\triangle ABD \\cong \\triangle ACD$ 还能得到更多结论，因为每一组对应部分都相等，不只是底角。由对应部分相等，$BD = CD$，所以 $D$ 是 $BC$ 的中点；并且 $\\angle ADB = \\angle ADC$。

这两个角是邻补角，和为 $180^\\circ$。它们又相等，所以各是一半：$2\\angle ADB = 180^\\circ$，$\\angle ADB = 90^\\circ$。所以等腰三角形顶角的平分线是底边的垂直平分线，也就是三角形的折痕。

> **注意。** 两个相等的角之和为 $180^\\circ$ 时各是 $90^\\circ$，不是 $45^\\circ$：和为 $90^\\circ$ 时才各是 $45^\\circ$。另外 $\\angle ADB = \\angle ADC$ 来自全等（对应部分相等），不是来自邻补角；邻补角只给出它们的和。`,
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 2), congruencePool),
    },
    {
      id: "using-the-isosceles-triangle-theorems",
      figure: geometryDrawings2["proofs-involving-isosceles-triangles#using-the-isosceles-triangle-theorems"],
      title: t("Using the theorems", "运用定理"),
      explanation: t(
        `The two theorems turn a fact about angles into one about sides, and back: equal angles stand across from equal sides, and equal sides across from equal angles. So set the two expressions equal and solve.

If $\\angle B = \\angle C$, $AB = 3x + 2$ and $AC = 5x - 8$, then the sides across from the equal angles are equal: $3x + 2 = 5x - 8$, so $10 = 2x$, $x = 5$ and $AB = 3 \\cdot 5 + 2 = 17$. Check: $AC = 5 \\cdot 5 - 8 = 17$ too.

If $AB = AC$, $\\angle B = (2x + 10)^\\circ$ and $\\angle C = (3x - 5)^\\circ$, then $2x + 10 = 3x - 5$ gives $x = 15$, each base angle is $40^\\circ$, and $\\angle A = 180^\\circ - 2 \\cdot 40^\\circ = 100^\\circ$.

> **Watch out.** $x$ is not the answer: put it back into the expression for what is asked. And the vertex angle is $180^\\circ$ minus *both* base angles, not minus one of them.`,
        `这两个定理把关于角的事实转化为关于边的事实，反过来也一样：等角对等边，等边对等角。所以令两个表达式相等，解方程。

若 $\\angle B = \\angle C$，$AB = 3x + 2$，$AC = 5x - 8$，则相等的角所对的边相等：$3x + 2 = 5x - 8$，所以 $10 = 2x$，$x = 5$，$AB = 3 \\cdot 5 + 2 = 17$。检验：$AC = 5 \\cdot 5 - 8 = 17$，也一样。

若 $AB = AC$，$\\angle B = (2x + 10)^\\circ$，$\\angle C = (3x - 5)^\\circ$，则由 $2x + 10 = 3x - 5$ 得 $x = 15$，每个底角是 $40^\\circ$，$\\angle A = 180^\\circ - 2 \\cdot 40^\\circ = 100^\\circ$。

> **注意。** $x$ 不是答案：要把它代回所求的表达式。另外顶角等于 $180^\\circ$ 减去*两个*底角，不是只减一个。`,
      ),
      generate(rng) {
        const f = isoPoints(rng);
        const { pa, pb, pc } = f;
        for (;;) {
          const x = rng.int(2, 15);
          const [p, r] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
          if (rng.bool()) {
            const len = rng.int(Math.max(p, r) * x - 20, Math.max(p, r) * x + 25);
            const [d1, d2] = [len - p * x, len - r * x];
            if (len < 4 || d1 === 0 || d2 === 0 || Math.abs(d1) > 40 || Math.abs(d2) > 40) continue;
            return {
              ...numberProblem({
                prompt: t(
                  "In the figure, $\\angle B = \\angle C$. Find the length of $AB$.",
                  "如图，$\\angle B = \\angle C$。求 $AB$ 的长。",
                ),
                answer: len,
                form: "integer",
                wrong: [x, 2 * len, intOr(d2 + d1, p + r, len + x)],
                solution: paras(
                  step(
                    1,
                    "set the equal sides equal",
                    "令相等的边相等",
                    t(
                      `$\\angle B = \\angle C$, and the sides across from equal angles are equal: $AC$ is across from $\\angle B$ and $AB$ from $\\angle C$, so $AB = AC$. Collect the $x$ terms on one side and the numbers on the other:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                      `$\\angle B = \\angle C$，而等角对等边：$AC$ 对着 $\\angle B$，$AB$ 对着 $\\angle C$，所以 $AB = AC$。把含 $x$ 的项移到一边，常数移到另一边：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                    ),
                  ),
                  step(
                    2,
                    "put x back",
                    "把 x 代回",
                    shown(
                      t(
                        `$x$ is not yet the length. Put it into the expression for $AB$:${steps(`AB = ${atX(p, d1, x)}`)}`,
                        `$x$ 还不是所求的长度。把它代入 $AB$ 的表达式：${steps(`AB = ${atX(p, d1, x)}`)}`,
                      ),
                    ),
                  ),
                  check(
                    t(
                      `The other side gives the same length: $AC = ${atX(r, d2, x)}$.`,
                      `另一条边得到同样的长度：$AC = ${atX(r, d2, x)}$。`,
                    ),
                  ),
                ),
              }),
              figure: figure(
                [
                  { kind: "polygon", points: [pa, pb, pc] },
                  { kind: "arc", vertex: pb, from: pc, to: pa, accent: true },
                  { kind: "arc", vertex: pc, from: pa, to: pb, accent: true },
                  ...names([pa, pb, pc], "ABC"),
                  ...outside([pa, pb, pc], [plain(p, d1), null, plain(r, d2)]),
                ],
                `Triangle ABC with equal angles at B and C; AB = ${plain(p, d1)} and AC = ${plain(r, d2)}.`,
                `三角形 ABC，B、C 处的角相等；AB = ${plain(p, d1)}，AC = ${plain(r, d2)}。`,
              ),
              solutionFigures: [
                isoValues(
                  f,
                  [
                    { kind: "arc", vertex: pb, from: pc, to: pa, accent: true },
                    { kind: "arc", vertex: pc, from: pa, to: pb, accent: true },
                    { kind: "ticks", a: pa, b: pb, count: 1 },
                    { kind: "ticks", a: pa, b: pc, count: 1 },
                    hi(pa, pb),
                    ...outside([pa, pb, pc], [`${len}`, null, `${len}`]),
                  ],
                  `Triangle ABC with equal angles at B and C, and the sides across from them equal: AB = AC = ${len}.`,
                  `三角形 ABC，B、C 处的角相等，它们所对的边也相等：AB = AC = ${len}。`,
                ),
              ],
            };
          }
          const base = rng.int(25, 80);
          const [d1, d2] = [base - p * x, base - r * x];
          if (d1 === 0 || d2 === 0 || Math.abs(d1) > 60 || Math.abs(d2) > 60 || base === 60) continue;
          const apex = 180 - 2 * base;
          return {
            ...numberProblem({
              prompt: t("In the figure, $AB = AC$. Find $\\angle A$.", "如图，$AB = AC$。求 $\\angle A$。"),
              answer: apex,
              form: "integer",
              unit: "°",
              wrong: [base, 180 - base, x],
              solution: paras(
                step(
                  1,
                  "set the base angles equal",
                  "令两个底角相等",
                  t(
                    `$AB = AC$, and the angles across from equal sides are equal, so $\\angle B = \\angle C$:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                    `$AB = AC$，而等边对等角，所以 $\\angle B = \\angle C$：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                  ),
                ),
                step(
                  2,
                  "find the base angles",
                  "求底角",
                  t(`Each base angle is $\\angle B = ${atX(p, d1, x)}^\\circ$.`, `每个底角 $\\angle B = ${atX(p, d1, x)}^\\circ$。`),
                ),
                step(
                  3,
                  "subtract both from 180°",
                  "用 180° 减去两个底角",
                  shown(
                    t(
                      `The three angles add up to $180^\\circ$:${steps(`\\angle A = 180^\\circ - 2 \\cdot ${base}^\\circ = ${apex}^\\circ`)}`,
                      `三个角之和为 $180^\\circ$：${steps(`\\angle A = 180^\\circ - 2 \\cdot ${base}^\\circ = ${apex}^\\circ`)}`,
                    ),
                  ),
                ),
                check(
                  t(
                    `The other base angle is the same, $\\angle C = ${atX(r, d2, x)}^\\circ$, and the angle sum is $${apex}^\\circ + ${base}^\\circ + ${base}^\\circ = 180^\\circ$.`,
                    `另一个底角也一样，$\\angle C = ${atX(r, d2, x)}^\\circ$，三个角之和为 $${apex}^\\circ + ${base}^\\circ + ${base}^\\circ = 180^\\circ$。`,
                  ),
                ),
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [pa, pb, pc] },
                { kind: "ticks", a: pa, b: pb, count: 1 },
                { kind: "ticks", a: pa, b: pc, count: 1 },
                { kind: "arc", vertex: pb, from: pc, to: pa, label: angleLabel(p, d1) },
                { kind: "arc", vertex: pc, from: pa, to: pb, label: angleLabel(r, d2) },
                ...names([pa, pb, pc], "ABC"),
              ],
              `Triangle ABC with AB = AC; angle B is ${angleLabel(p, d1)} and angle C is ${angleLabel(r, d2)}.`,
              `三角形 ABC，AB = AC；角 B 为 ${angleLabel(p, d1)}，角 C 为 ${angleLabel(r, d2)}。`,
            ),
            solutionFigures: [
              isoValues(
                f,
                [
                  { kind: "ticks", a: pa, b: pb, count: 1 },
                  { kind: "ticks", a: pa, b: pc, count: 1 },
                  { kind: "arc", vertex: pb, from: pc, to: pa, label: `${base}°` },
                  { kind: "arc", vertex: pc, from: pa, to: pb, label: `${base}°` },
                  { kind: "arc", vertex: pa, from: pb, to: pc, label: `${apex}°`, tone: "result" },
                ],
                `Triangle ABC with AB = AC, base angles of ${base}° and the angle at A, ${apex}°, highlighted.`,
                `三角形 ABC，AB = AC，底角各为 ${base}°，突出显示 A 处的角 ${apex}°。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** scalene places a triangle B (0, 0), C (w, 0), A above the base, not isosceles-looking. */
function scalene(rng: Rng): [Point, Point, Point] {
  const w = rng.int(6, 10);
  const ax = rng.pick([1, 2, 3, w - 3, w - 2, w + 1, -1]) + rng.pick([0, 0.5]);
  return [
    [ax, rng.int(4, 7)],
    [0, 0],
    [w, 0],
  ];
}

const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** signed writes a number as a term added to a sum, such as "+ 3" or "- 3". */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** mediansMarks draws a triangle with its three medians dashed and the centroid marked; letters name A, B, C, the midpoint of BC and the centroid. */
function mediansMarks(pts: readonly [Point, Point, Point], letters: string): Mark[] {
  const [a, b, c] = pts;
  const g: Point = center(pts);
  return [
    { kind: "polygon", points: [a, b, c] },
    { kind: "segment", a, b: mid(b, c), dashed: true, accent: true },
    { kind: "segment", a: b, b: mid(c, a), dashed: true },
    { kind: "segment", a: c, b: mid(a, b), dashed: true },
    { kind: "dot", at: g },
    ...names([a, b, c], letters.slice(0, 3)),
    { kind: "label", at: mid(b, c), text: letters[3]!, dir: "s", italic: true },
    { kind: "label", at: g, text: letters[4]!, dir: "e", italic: true },
  ];
}

/** medianParts labels the two parts AG and GM of the median from A in a triangle drawn by mediansMarks, beside the median, and highlights it. */
function medianParts(pts: readonly [Point, Point, Point], ag: string, gm: string): Mark[] {
  const [a, b, c] = pts;
  const g = center(pts);
  const mm = mid(b, c);
  const side = compassOf(a[1] - mm[1], mm[0] - a[0]);
  return [hi(a, mm), { kind: "label", at: mid(a, g), text: ag, dir: side }, { kind: "label", at: mid(g, mm), text: gm, dir: side }];
}

/** centroidIntro is the triangle A(0, 9), B(−3, 0), C(9, 0) with its medians and its centroid G(2, 3). */
const centroidIntro: Figure = figure(
  [
    ...mediansMarks(
      [
        [0, 9],
        [-3, 0],
        [9, 0],
      ],
      "ABCMG",
    ),
    { kind: "ticks", a: [-3, 0], b: [3, 0], count: 1 },
    { kind: "ticks", a: [3, 0], b: [9, 0], count: 1 },
  ],
  "Triangle with A(0, 9), B(−3, 0) and C(9, 0). Its three medians are dashed; the median from A goes to M(3, 0), the middle of BC, and the three meet at the centroid G(2, 3).",
  "三角形的顶点为 A(0, 9)、B(−3, 0)、C(9, 0)。三条中线用虚线画出；从 A 出发的中线通向 BC 的中点 M(3, 0)，三条中线交于重心 G(2, 3)。",
);

export const mediansAndCentroids: TopicDef = {
  id: "medians-and-centroids",
  title: t("Medians and Centroids of Triangles", "三角形的中线与重心"),
  summary: t(
    "Use medians, the centroid ratio 2 : 1 and the centroid formula to find lengths and coordinates.",
    "利用中线、重心分中线 2 : 1 的性质和重心坐标公式求长度与坐标。",
  ),
  prerequisites: ["the-coordinate-plane", "equations-with-parentheses"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.10", "CCSS.HSG.GPE.B.4"],
  intro: t(
    `A midpoint splits a segment into two equal halves. Join a vertex of a triangle to the midpoint of the side across from it and you get a **median**. Every triangle has three, and something surprising happens: they always cross at one point, the **centroid**. A triangle cut from card balances on the tip of a pencil placed at its centroid.

Take $A(0, 9)$, $B(-3, 0)$ and $C(9, 0)$:

{{figure 0}}

The midpoint of $BC$ is $M(3, 0)$, so $AM$ is a median. The centroid turns out to be $G(2, 3)$, and it sits at a fixed place on the median: from $A$ to $M$ the coordinates change by $(3, -9)$, and from $A$ to $G$ by $(2, -6)$, exactly two thirds of that. So $AG$ is twice $GM$. The coordinates of $G$ are also the averages of the vertices: $\\frac{0 - 3 + 9}{3} = 2$ and $\\frac{9 + 0 + 0}{3} = 3$. In this lesson we use medians, the $2 : 1$ split and this average.`,
    `中点把线段分成相等的两半。把三角形的一个顶点和它对边的中点连起来，就得到一条**中线**。每个三角形有三条中线，而且有一件出人意料的事：它们总是交于一点，叫**重心**。用硬纸板剪一个三角形，把铅笔尖顶在重心处，三角形就能平衡。

取 $A(0, 9)$、$B(-3, 0)$、$C(9, 0)$：

{{figure 0}}

$BC$ 的中点是 $M(3, 0)$，所以 $AM$ 是一条中线。重心是 $G(2, 3)$，它在中线上的位置是固定的：从 $A$ 到 $M$，坐标变化 $(3, -9)$；从 $A$ 到 $G$，坐标变化 $(2, -6)$，正好是前者的三分之二。所以 $AG$ 是 $GM$ 的两倍。$G$ 的坐标还等于三个顶点坐标的平均数：$\\frac{0 - 3 + 9}{3} = 2$，$\\frac{9 + 0 + 0}{3} = 3$。这节课我们来运用中线、$2 : 1$ 的分法和这个平均数。`,
  ),
  introFigures: [centroidIntro],
  knowledgePoints: [
    {
      id: "medians",
      figure: specialDrawings.medians,
      title: t("Medians", "中线"),
      explanation: t(
        `A **median** of a triangle joins a vertex to the midpoint of the opposite side. If $AM$ is a median of $\\triangle ABC$, then $M$ is the midpoint of $BC$; a midpoint splits its segment into two equal halves, so $BM = MC$ and $BC = 2 \\cdot BM$.

So when the halves are given as expressions, set them equal. If $BM = 2x + 3$ and $MC = 4x - 5$, then $2x + 3 = 4x - 5$, so $8 = 2x$ and $x = 4$. Then $BM = 2 \\cdot 4 + 3 = 11$, $MC = 4 \\cdot 4 - 5 = 11$ as well, and $BC = 22$.

> **Watch out.** Read what is asked: $BC$ is the whole side, twice $BM$, so do not stop at $BM = 11$. And $x = 4$ is not a length at all until it is put back into the expressions.`,
        `三角形的**中线**是连接一个顶点和对边中点的线段。若 $AM$ 是 $\\triangle ABC$ 的中线，则 $M$ 是 $BC$ 的中点；中点把线段分成相等的两半，所以 $BM = MC$，$BC = 2 \\cdot BM$。

所以当两半用表达式给出时，令它们相等。若 $BM = 2x + 3$，$MC = 4x - 5$，则 $2x + 3 = 4x - 5$，所以 $8 = 2x$，$x = 4$。于是 $BM = 2 \\cdot 4 + 3 = 11$，$MC = 4 \\cdot 4 - 5 = 11$ 也一样，$BC = 22$。

> **注意。** 看清问的是什么：$BC$ 是整条边，是 $BM$ 的两倍，不要停在 $BM = 11$。另外 $x = 4$ 本身不是长度，要代回表达式才行。`,
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 12);
          const [p, r] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
          const len = rng.int(Math.max(p, r) * x - 15, Math.max(p, r) * x + 20);
          const [d1, d2] = [len - p * x, len - r * x];
          if (len < 3 || d1 === 0 || d2 === 0 || Math.abs(d1) > 40 || Math.abs(d2) > 40) continue;
          const [pa, pb, pc] = scalene(rng);
          const pm = mid(pb, pc);
          const drawing = (bm: string, mc: string, lit: boolean): Mark[] => [
            { kind: "polygon", points: [pa, pb, pc] },
            { kind: "segment", a: pa, b: pm, dashed: true, accent: true },
            ...(lit ? [hi(pb, pc)] : []),
            { kind: "ticks", a: pb, b: pm, count: 1 },
            { kind: "ticks", a: pm, b: pc, count: 1 },
            { kind: "side", a: pm, b: pb, text: bm },
            { kind: "side", a: pc, b: pm, text: mc },
            ...names([pa, pb, pc], "ABC"),
            { kind: "label", at: pm, text: "M", dir: "n", italic: true },
          ];
          return {
            ...numberProblem({
              prompt: t(
                `$AM$ is a median of $\\triangle ABC$. Find the length of $BC$.`,
                `$AM$ 是 $\\triangle ABC$ 的中线。求 $BC$ 的长。`,
              ),
              answer: 2 * len,
              form: "integer",
              wrong: [len, x, 2 * x],
              solution: paras(
                step(
                  1,
                  "set the halves equal",
                  "令两半相等",
                  t(
                    `$AM$ is a median, so $M$ is the midpoint of $BC$ and $BM = MC$. Collect the $x$ terms on one side and the numbers on the other:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                    `$AM$ 是中线，所以 $M$ 是 $BC$ 的中点，$BM = MC$。把含 $x$ 的项移到一边，常数移到另一边：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}`,
                  ),
                ),
                step(
                  2,
                  "double the half",
                  "把一半加倍",
                  shown(
                    t(
                      `Put $x$ back: $BM = ${atX(p, d1, x)}$. The whole side is twice the half:${steps(`BC = 2 \\cdot ${len} = ${2 * len}`)}`,
                      `把 $x$ 代回：$BM = ${atX(p, d1, x)}$。整条边是一半的两倍：${steps(`BC = 2 \\cdot ${len} = ${2 * len}`)}`,
                    ),
                  ),
                ),
                check(
                  t(
                    `The other half gives the same length, $MC = ${atX(r, d2, x)}$, and $BM + MC = ${len} + ${len} = ${2 * len} = BC$.`,
                    `另一半得到同样的长度，$MC = ${atX(r, d2, x)}$，并且 $BM + MC = ${len} + ${len} = ${2 * len} = BC$。`,
                  ),
                ),
              ),
            }),
            figure: figure(
              drawing(plain(p, d1), plain(r, d2), false),
              `Triangle ABC with median AM; BM = ${plain(p, d1)} and MC = ${plain(r, d2)}.`,
              `三角形 ABC，中线 AM；BM = ${plain(p, d1)}，MC = ${plain(r, d2)}。`,
            ),
            solutionFigures: [
              figure(
                drawing(`${len}`, `${len}`, true),
                `Triangle ABC with median AM; BM = MC = ${len}, and the whole side BC, ${2 * len}, is highlighted.`,
                `三角形 ABC，中线 AM；BM = MC = ${len}，突出显示整条边 BC，长 ${2 * len}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "the-centroid-theorem",
      figure: specialDrawings["the-centroid-theorem"],
      title: t("The centroid theorem", "重心定理"),
      explanation: t(
        `The three medians of a triangle meet at one point, the **centroid** $G$. The centroid is two thirds of the way along each median from the vertex, so the median is cut into three equal pieces, two from the vertex to $G$ and one from $G$ to the midpoint:

$$AG = 2 \\cdot GM, \\qquad AM = 3 \\cdot GM, \\qquad AG = \\frac{2}{3} AM.$$

If $AM = 18$, then one piece is $GM = 18 \\div 3 = 6$ and $AG = 12$; indeed $12 + 6 = 18$. If $AG = 3x + 1$ and $GM = x + 4$, then $3x + 1 = 2(x + 4) = 2x + 8$, so $x = 7$.

> **Watch out.** The longer piece is the one at the vertex: $AG$ is twice $GM$, not half of it. And $AM$ is the whole median, three pieces, so $AG$ is $\\frac{2}{3}$ of it, not $\\frac{1}{2}$.`,
        `三角形的三条中线交于一点，叫**重心** $G$。重心在每条中线上距顶点三分之二处，所以中线被分成三等份：从顶点到 $G$ 占两份，从 $G$ 到中点占一份：

$$AG = 2 \\cdot GM, \\qquad AM = 3 \\cdot GM, \\qquad AG = \\frac{2}{3} AM.$$

若 $AM = 18$，则一份是 $GM = 18 \\div 3 = 6$，$AG = 12$；确实 $12 + 6 = 18$。若 $AG = 3x + 1$，$GM = x + 4$，则 $3x + 1 = 2(x + 4) = 2x + 8$，所以 $x = 7$。

> **注意。** 靠近顶点的一段较长：$AG$ 是 $GM$ 的两倍，不是一半。另外 $AM$ 是整条中线，有三份，所以 $AG$ 是它的 $\\frac{2}{3}$，不是 $\\frac{1}{2}$。`,
      ),
      generate(rng) {
        const pts = scalene(rng);
        const fig = figure(
          mediansMarks(pts, "ABCMG"),
          "Triangle ABC with its three medians meeting at the centroid G; AM is the median from A.",
          "三角形 ABC 的三条中线交于重心 G；AM 是从 A 出发的中线。",
        );
        const solved = (ag: number, gm: number) =>
          figure(
            [...mediansMarks(pts, "ABCMG"), ...medianParts(pts, `${ag}`, `${gm}`)],
            `Triangle ABC with its medians; the median AM is highlighted, with AG = ${ag} and GM = ${gm}.`,
            `三角形 ABC 及其中线；突出显示中线 AM，其中 AG = ${ag}，GM = ${gm}。`,
          );
        const kind = rng.int(0, 3);
        if (kind === 3) {
          for (;;) {
            const x = rng.int(2, 12);
            const r = rng.int(1, 3);
            const s = rng.int(-5, 9);
            const gm = r * x + s;
            const p = rng.pick([1, 3, 4, 5].filter((v) => v !== 2 * r));
            const qd = 2 * gm - p * x;
            if (gm < 2 || qd === 0 || s === 0 || Math.abs(qd) > 40) continue;
            return {
              ...numberProblem({
                prompt: t(
                  `$G$ is the centroid of $\\triangle ABC$, $AG = ${linear(p, qd)}$ and $GM = ${linear(r, s)}$. Find $x$.`,
                  `$G$ 是 $\\triangle ABC$ 的重心，$AG = ${linear(p, qd)}$，$GM = ${linear(r, s)}$。求 $x$。`,
                ),
                answer: x,
                form: "integer",
                solveFor: "x",
                wrong: [intOr(s - qd, p - r, -x), intOr(2 * s - qd, p - r, x + 1), intOr(s - 2 * qd, 2 * p - r, -x - 1)],
                solution: paras(
                  step(
                    1,
                    "use the 2 : 1 split",
                    "用 2 : 1 的分法",
                    t(
                      `The centroid is two thirds of the way from $A$ to $M$, so the piece at the vertex is twice the other: $AG = 2 \\cdot GM$.`,
                      `重心在从 $A$ 到 $M$ 的三分之二处，所以靠近顶点的一段是另一段的两倍：$AG = 2 \\cdot GM$。`,
                    ),
                  ),
                  step(
                    2,
                    "solve",
                    "解方程",
                    t(
                      `Expand the brackets, then collect the $x$ terms:${chain(`${linear(p, qd)} = 2(${linear(r, s)})`, `${linear(p, qd)} = ${linear(2 * r, 2 * s)}`, `${linear(p - 2 * r, 0)} = ${2 * s - qd}`, `x = ${x}`)}`,
                      `去括号，再合并含 $x$ 的项：${chain(`${linear(p, qd)} = 2(${linear(r, s)})`, `${linear(p, qd)} = ${linear(2 * r, 2 * s)}`, `${linear(p - 2 * r, 0)} = ${2 * s - qd}`, `x = ${x}`)}`,
                    ),
                  ),
                  check(
                    shown(
                      t(
                        `With $x = ${x}$: $AG = ${atX(p, qd, x)}$ and $GM = ${atX(r, s, x)}$, and $${2 * gm} = 2 \\cdot ${gm}$. The whole median is $AM = ${3 * gm}$.`,
                        `当 $x = ${x}$ 时：$AG = ${atX(p, qd, x)}$，$GM = ${atX(r, s, x)}$，而 $${2 * gm} = 2 \\cdot ${gm}$。整条中线 $AM = ${3 * gm}$。`,
                      ),
                    ),
                  ),
                ),
              }),
              figure: fig,
              solutionFigures: [solved(2 * gm, gm)],
            };
          }
        }
        const gm = rng.int(2, 20);
        const [ag, am] = [2 * gm, 3 * gm];
        const data = [
          ["GM", gm],
          ["AG", ag],
          ["AM", am],
        ] as const;
        const [given, askName] =
          kind === 0
            ? [data[0], rng.pick(["AG", "AM"] as const)]
            : kind === 1
              ? [data[1], rng.pick(["GM", "AM"] as const)]
              : [data[2], rng.pick(["AG", "GM"] as const)];
        const answer = { GM: gm, AG: ag, AM: am }[askName];
        const piece =
          kind === 0
            ? t(`$GM$ is one piece: $${gm}$.`, `$GM$ 是一份：$${gm}$。`)
            : kind === 1
              ? t(`$AG$ is two pieces, so one piece is $${ag} \\div 2 = ${gm}$.`, `$AG$ 是两份，所以一份是 $${ag} \\div 2 = ${gm}$。`)
              : t(`$AM$ is three pieces, so one piece is $${am} \\div 3 = ${gm}$.`, `$AM$ 是三份，所以一份是 $${am} \\div 3 = ${gm}$。`);
        const count = { GM: 1, AG: 2, AM: 3 }[askName];
        return {
          ...numberProblem({
            prompt: t(
              `$G$ is the centroid of $\\triangle ABC$ and $${given[0]} = ${given[1]}$. Find $${askName}$.`,
              `$G$ 是 $\\triangle ABC$ 的重心，$${given[0]} = ${given[1]}$。求 $${askName}$。`,
            ),
            answer,
            form: "integer",
            wrong: [given[1], intOr(given[1], 2, given[1] + 1), 2 * given[1], intOr(2 * given[1], 3, 3 * given[1])],
            solution: paras(
              step(
                1,
                "find one third of the median",
                "求中线的三分之一",
                t(
                  `The centroid cuts the median $AM$ into three equal pieces: $AG$ is two of them and $GM$ is one. ${piece.en}`,
                  `重心把中线 $AM$ 分成三等份：$AG$ 占两份，$GM$ 占一份。${piece["zh-CN"]}`,
                ),
              ),
              step(
                2,
                `find ${askName}`,
                `求 ${askName}`,
                shown(
                  t(
                    `$${askName}$ is ${count === 1 ? "one piece" : `${count === 2 ? "two" : "three"} pieces`}:${steps(`${askName} = ${count === 1 ? `${gm}` : `${count} \\cdot ${gm} = ${answer}`}`)}`,
                    `$${askName}$ 占 ${count} 份：${steps(`${askName} = ${count === 1 ? `${gm}` : `${count} \\cdot ${gm} = ${answer}`}`)}`,
                  ),
                ),
              ),
              check(
                t(
                  `The two pieces add up to the whole median: $AG + GM = ${ag} + ${gm} = ${am} = AM$, and $AG = ${ag}$ is twice $GM = ${gm}$.`,
                  `两段之和等于整条中线：$AG + GM = ${ag} + ${gm} = ${am} = AM$，并且 $AG = ${ag}$ 是 $GM = ${gm}$ 的两倍。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [solved(ag, gm)],
        };
      },
    },
    {
      id: "coordinates-of-the-centroid",
      figure: coordinateDrawings["coordinates-of-the-centroid"],
      title: t("Coordinates of the centroid", "重心的坐标"),
      explanation: t(
        `The three medians of a triangle meet at the centroid, the balance point of the triangle. Its coordinates are found by averaging the coordinates of the three vertices. The reason: $G$ is two thirds of the way from $A$ to the midpoint $M$ of $BC$, so $G = \\frac{A + 2M}{3}$, and $2M = B + C$.

The centroid of the triangle with vertices $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$ is

$$G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right).$$

For $A(1, 2)$, $B(7, -1)$, $C(4, 5)$: the $x$-coordinates add to $12$ and the $y$-coordinates to $6$, so $G = \\left(\\frac{12}{3}, \\frac{6}{3}\\right) = (4, 2)$.

> **Watch out.** Divide by $3$, the number of vertices: dividing by $2$ would be a midpoint formula, and not dividing at all gives a point far outside the triangle. And average the $x$-coordinates for the $x$-coordinate and the $y$-coordinates for the $y$-coordinate; do not swap them.`,
        `三角形的三条中线交于重心，也就是三角形的平衡点。它的坐标等于三个顶点坐标的平均数。原因是：$G$ 在从 $A$ 到 $BC$ 中点 $M$ 的三分之二处，所以 $G = \\frac{A + 2M}{3}$，而 $2M = B + C$。

顶点为 $(x_1, y_1)$、$(x_2, y_2)$、$(x_3, y_3)$ 的三角形的重心是

$$G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right).$$

对于 $A(1, 2)$、$B(7, -1)$、$C(4, 5)$：横坐标之和为 $12$，纵坐标之和为 $6$，所以 $G = \\left(\\frac{12}{3}, \\frac{6}{3}\\right) = (4, 2)$。

> **注意。** 要除以顶点个数 $3$：除以 $2$ 是中点公式，不除则得到远在三角形外的点。另外横坐标取横坐标的平均，纵坐标取纵坐标的平均，不要互换。`,
      ),
      generate(rng) {
        for (;;) {
          const v = [0, 1, 2].map(() => [rng.int(-9, 9), rng.int(-9, 9)] as const);
          const [a, b, c] = v as [readonly [number, number], readonly [number, number], readonly [number, number]];
          if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0) continue;
          const sx = a[0] + b[0] + c[0];
          const sy = a[1] + b[1] + c[1];
          const g = [q(sx, 3), q(sy, 3)];
          const pt = (p: readonly [number, number]) => `(${p[0]}, ${p[1]})`;
          const sumOf = (i: 0 | 1) => `${a[i]} ${signed(b[i])} ${signed(c[i])}`;
          const mm = [q(b[0] + c[0], 2), q(b[1] + c[1], 2)] as const;
          const gTex = `(${g[0]!.toLatex()}, ${g[1]!.toLatex()})`;
          return pointProblem({
            prompt: t(
              `Find the centroid of the triangle with vertices $A${pt(a)}$, $B${pt(b)}$ and $C${pt(c)}$.`,
              `求顶点为 $A${pt(a)}$、$B${pt(b)}$、$C${pt(c)}$ 的三角形的重心。`,
            ),
            answer: g,
            wrong: [
              [sx, sy],
              [q(sx, 2), q(sy, 2)],
              [q(sy, 3), q(sx, 3)],
            ],
            solution: paras(
              step(
                1,
                "add the coordinates",
                "坐标分别相加",
                t(
                  `Add the three $x$-coordinates and, separately, the three $y$-coordinates:${steps(`${sumOf(0)} = ${sx}, \\qquad ${sumOf(1)} = ${sy}`)}`,
                  `把三个横坐标相加，再把三个纵坐标分别相加：${steps(`${sumOf(0)} = ${sx}, \\qquad ${sumOf(1)} = ${sy}`)}`,
                ),
              ),
              step(
                2,
                "divide by 3",
                "除以 3",
                t(
                  `The centroid is the average of the three vertices:${steps(`G = \\left(\\frac{${sx}}{3}, \\frac{${sy}}{3}\\right) = ${gTex}`)}`,
                  `重心是三个顶点的平均：${steps(`G = \\left(\\frac{${sx}}{3}, \\frac{${sy}}{3}\\right) = ${gTex}`)}`,
                ),
              ),
              check(
                t(
                  `Go along a median instead. The midpoint of $BC$ is $M(${mm[0].toLatex()}, ${mm[1].toLatex()})$, and $G$ is two thirds of the way from $A$ to $M$, at $\\frac{A + 2M}{3}$: $\\left(\\frac{${a[0]} ${signed(b[0] + c[0])}}{3}, \\frac{${a[1]} ${signed(b[1] + c[1])}}{3}\\right) = ${gTex}$, the same point.`,
                  `改沿中线来算。$BC$ 的中点是 $M(${mm[0].toLatex()}, ${mm[1].toLatex()})$，$G$ 在从 $A$ 到 $M$ 的三分之二处，即 $\\frac{A + 2M}{3}$：$\\left(\\frac{${a[0]} ${signed(b[0] + c[0])}}{3}, \\frac{${a[1]} ${signed(b[1] + c[1])}}{3}\\right) = ${gTex}$，是同一个点。`,
                ),
              ),
            ),
          });
        }
      },
    },
  ],
};

/** medianIsoscelesProof proves that the median to the base of an isosceles triangle is perpendicular to it. */
function medianIsoscelesProof(rng: Rng): Proof {
  const [A, B, C, M] = pickLetters(rng, 4) as [string, string, string, string];
  const f = isoPoints(rng);
  const parts = isoParts(f);
  return {
    given: t(`$${A}${B} = ${A}${C}$, and $${M}$ is the midpoint of $${B}${C}$`, `$${A}${B} = ${A}${C}$，$${M}$ 是 $${B}${C}$ 的中点`),
    prove: m(`${A}${M} \\perp ${B}${C}`),
    steps: [
      { s: m(`${A}${B} = ${A}${C}`), r: "given", marks: parts.legs, drawn: true },
      {
        s: m(`${B}${M} = ${C}${M}`),
        r: "midpoint",
        alts: [m(`${B}${M} = ${A}${M}`), m(`\\angle ${B}${A}${M} = \\angle ${C}${A}${M}`), m(`${A}${B} = ${B}${C}`)],
        marks: parts.halves,
        drawn: true,
      },
      { s: m(`${A}${M} = ${A}${M}`), r: "reflexive", marks: parts.shared },
      {
        s: m(`\\triangle ${A}${B}${M} \\cong \\triangle ${A}${C}${M}`),
        r: "sss",
        why: t("All three pairs of sides are equal.", "三组对应边都相等。"),
        uses: [0, 1, 2],
        alts: [
          m(`\\triangle ${A}${B}${M} \\cong \\triangle ${A}${M}${C}`),
          m(`\\triangle ${A}${B}${M} \\cong \\triangle ${C}${A}${M}`),
          m(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${M}`),
        ],
      },
      { s: m(`\\angle ${A}${M}${B} = \\angle ${A}${M}${C}`), r: "cpctc", uses: [3], marks: parts.footAngles },
      { s: m(`\\angle ${A}${M}${B} + \\angle ${A}${M}${C} = 180^\\circ`), r: "linearPair" },
      {
        s: m(`\\angle ${A}${M}${B} = 90^\\circ`),
        r: "halving",
        why: t(`By steps 5 and 6, $2\\angle ${A}${M}${B} = 180^\\circ$.`, `由第 5、6 步，$2\\angle ${A}${M}${B} = 180^\\circ$。`),
        uses: [4, 5],
        alts: [m(`\\angle ${A}${M}${B} = 45^\\circ`), m(`\\angle ${A}${M}${B} = 180^\\circ`), m(`\\angle ${A}${M}${B} = \\angle ${B}`)],
        marks: parts.right,
      },
    ],
    base: isoBase(f, `${A}${B}${C}${M}`),
    alt: [
      `Triangle ${A}${B}${C} with ${A}${B} = ${A}${C} and the median ${A}${M} to the base.`,
      `三角形 ${A}${B}${C}，${A}${B} = ${A}${C}，${A}${M} 是底边上的中线。`,
    ],
    parts: [0, 1, 2],
  };
}

/** halvesIntro is the triangle B(0, 0), C(8, 0), A(2, 5) with the median AM and the height from A, the half ABM shaded. */
const halvesIntro: Figure = figure(
  [
    {
      kind: "shade",
      points: [
        [2, 5],
        [0, 0],
        [4, 0],
      ],
      tone: "result",
    },
    {
      kind: "polygon",
      points: [
        [2, 5],
        [0, 0],
        [8, 0],
      ],
    },
    { kind: "segment", a: [2, 5], b: [4, 0], accent: true },
    { kind: "segment", a: [2, 5], b: [2, 0], dashed: true },
    { kind: "right", vertex: [2, 0], from: [4, 0], to: [2, 5] },
    { kind: "ticks", a: [0, 0], b: [4, 0], count: 1 },
    { kind: "ticks", a: [4, 0], b: [8, 0], count: 1 },
    { kind: "label", at: [2, 2.5], text: "5", dir: "w" },
    ...names(
      [
        [2, 5],
        [0, 0],
        [8, 0],
      ],
      "ABC",
    ),
    { kind: "label", at: [4, 0], text: "M", dir: "s", italic: true },
  ],
  "Triangle ABC with B(0, 0), C(8, 0) and A(2, 5). The median AM goes to M(4, 0), splitting BC into halves of 4; the height from A, 5, is dashed, and the triangle ABM is shaded.",
  "三角形 ABC，B(0, 0)、C(8, 0)、A(2, 5)。中线 AM 通向 M(4, 0)，把 BC 分成两段长 4；从 A 出发的高 5 用虚线画出，三角形 ABM 涂上阴影。",
);

/** sixths names the triangles of a triangle split by its medians, with the vertices of each in a drawing by mediansMarks. */
const sixths = (pts: readonly [Point, Point, Point]) => {
  const [a, b, c] = pts;
  const g = center(pts);
  return {
    "\\triangle ABM": [a, b, mid(b, c)],
    "\\triangle GBC": [g, b, c],
    "\\triangle GAB": [g, a, b],
    "\\triangle GBM": [g, b, mid(b, c)],
    "\\triangle AGC": [a, g, c],
  } as Record<string, Point[]>;
};

export const proofsInvolvingMediansAndCentroids: TopicDef = {
  id: "proofs-involving-medians-and-centroids",
  title: t("Proofs Involving Medians and Centroids", "中线与重心的证明"),
  summary: t(
    "Derive the centroid as the point two thirds of the way along a median, prove facts about medians, and use medians to split areas.",
    "推出重心是中线上三分之二处的点，证明有关中线的结论，并用中线分割面积。",
  ),
  prerequisites: ["medians-and-centroids", "proofs-involving-isosceles-triangles", "area-of-triangles"],
  encompasses: [{ topic: "medians-and-centroids", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSG.CO.C.10", "CCSS.HSG.GPE.B.6"],
  intro: t(
    `So far we have used the facts about medians; now we see why they hold. The tools are the ones from the earlier proofs: coordinates, congruent triangles and the area formula. Start with the area. Take $B(0, 0)$, $C(8, 0)$ and $A(2, 5)$, with the median $AM$ to $M(4, 0)$:

{{figure 0}}

The height from $A$ to $BC$ is $5$. The whole triangle has area $\\frac{1}{2} \\cdot 8 \\cdot 5 = 20$. The median splits it into $\\triangle ABM$ and $\\triangle ACM$, whose bases $BM$ and $MC$ are both $4$ and whose height is the same $5$, so each has area $\\frac{1}{2} \\cdot 4 \\cdot 5 = 10$, half of the whole. The two halves look nothing alike, yet their areas are equal. Nothing depended on these numbers: equal bases and a shared height always give equal areas. In this lesson we place the centroid on a median with coordinates, prove a fact about the median of an isosceles triangle, and split areas with medians.`,
    `前面我们使用了关于中线的结论，现在来看它们为什么成立。所用的工具都来自前面的证明：坐标、全等三角形和面积公式。先看面积。取 $B(0, 0)$、$C(8, 0)$、$A(2, 5)$，中线 $AM$ 通向 $M(4, 0)$：

{{figure 0}}

从 $A$ 到 $BC$ 的高是 $5$。整个三角形的面积是 $\\frac{1}{2} \\cdot 8 \\cdot 5 = 20$。中线把它分成 $\\triangle ABM$ 和 $\\triangle ACM$，它们的底 $BM$、$MC$ 都是 $4$，高都是 $5$，所以面积都是 $\\frac{1}{2} \\cdot 4 \\cdot 5 = 10$，是整体的一半。两半形状完全不同，面积却相等。这与具体数字无关：等底同高，面积总相等。这节课我们用坐标确定重心在中线上的位置，证明等腰三角形中线的一个性质，并用中线分割面积。`,
  ),
  introFigures: [halvesIntro],
  knowledgePoints: [
    {
      id: "the-centroid-on-a-median",
      title: t("The centroid on a median", "中线上的重心"),
      explanation: t(
        `The centroid $G$ lies on the median $AM$, two thirds of the way from $A$ to $M$. In coordinates, start at $A$ and add two thirds of the change from $A$ to $M$:

$$G = A + \\frac{2}{3}(M - A) = \\frac{A + 2M}{3}.$$

With $A(3, 8)$ and $M(6, 2)$: the change is $(3, -6)$, two thirds of it is $(2, -4)$, and $G = (5, 4)$; the formula gives the same, $\\left(\\frac{3 + 12}{3}, \\frac{8 + 4}{3}\\right) = (5, 4)$. Since $M$ is the average of $B$ and $C$, $A + 2M = A + B + C$: this is why the centroid is the average of the vertices. Going backwards, solve for $M$: $M = \\frac{3G - A}{2}$.

> **Watch out.** $M$ gets the weight $2$ and $A$ the weight $1$, because $G$ is nearer to $M$: $\\frac{2A + M}{3}$ is the point one third of the way, near $A$. And $\\frac{A + M}{2}$ is the midpoint of the median, not the centroid.`,
        `重心 $G$ 在中线 $AM$ 上，从 $A$ 到 $M$ 的三分之二处。用坐标表示，就是从 $A$ 出发，加上从 $A$ 到 $M$ 的变化量的三分之二：

$$G = A + \\frac{2}{3}(M - A) = \\frac{A + 2M}{3}.$$

若 $A(3, 8)$，$M(6, 2)$：变化量是 $(3, -6)$，它的三分之二是 $(2, -4)$，所以 $G = (5, 4)$；用公式也得 $\\left(\\frac{3 + 12}{3}, \\frac{8 + 4}{3}\\right) = (5, 4)$。因为 $M$ 是 $B$ 和 $C$ 的平均，$A + 2M = A + B + C$：这就是重心等于三个顶点平均值的原因。反过来，解出 $M$：$M = \\frac{3G - A}{2}$。

> **注意。** $M$ 的权是 $2$，$A$ 的权是 $1$，因为 $G$ 离 $M$ 更近：$\\frac{2A + M}{3}$ 是三分之一处的点，靠近 $A$。另外 $\\frac{A + M}{2}$ 是中线的中点，不是重心。`,
      ),
      generate(rng) {
        for (;;) {
          const a = [rng.int(-9, 9), rng.int(-9, 9)] as const;
          const mm = [rng.int(-9, 9), rng.int(-9, 9)] as const;
          if (a[0] === mm[0] && a[1] === mm[1]) continue;
          const g = [q(a[0] + 2 * mm[0], 3), q(a[1] + 2 * mm[1], 3)];
          const pt = (p: readonly (number | Q)[]) => `(${p.map((v) => (v instanceof Q ? v.toLatex() : `${v}`)).join(", ")})`;
          if (rng.bool(0.6)) {
            const gm = [q(mm[0]).sub(g[0]!), q(mm[1]).sub(g[1]!)];
            return pointProblem({
              prompt: t(
                `In $\\triangle ABC$, $A = ${pt(a)}$ and the midpoint of $BC$ is $M${pt(mm)}$. Find the centroid $G$.`,
                `在 $\\triangle ABC$ 中，$A = ${pt(a)}$，$BC$ 的中点是 $M${pt(mm)}$。求重心 $G$。`,
              ),
              answer: g,
              wrong: [
                [q(a[0] + mm[0], 2), q(a[1] + mm[1], 2)],
                [q(2 * a[0] + mm[0], 3), q(2 * a[1] + mm[1], 3)],
                [q(a[0] + mm[0], 3), q(a[1] + mm[1], 3)],
              ],
              solution: paras(
                step(
                  1,
                  "weigh the ends",
                  "给两端加权",
                  t(
                    `$AM$ is a median, so the centroid is on it, two thirds of the way from $A$ to $M$: $G = \\frac{A + 2M}{3}$, with the weight $2$ on $M$, the nearer end.`,
                    `$AM$ 是中线，重心在它上面，位于从 $A$ 到 $M$ 的三分之二处：$G = \\frac{A + 2M}{3}$，较近的一端 $M$ 的权是 $2$。`,
                  ),
                ),
                step(
                  2,
                  "work out each coordinate",
                  "分别计算坐标",
                  t(
                    `Do the $x$- and the $y$-coordinates separately:${steps(`G = \\left(\\frac{${a[0]} + 2(${mm[0]})}{3}, \\frac{${a[1]} + 2(${mm[1]})}{3}\\right) = ${pt(g)}`)}`,
                    `横坐标和纵坐标分别计算：${steps(`G = \\left(\\frac{${a[0]} + 2(${mm[0]})}{3}, \\frac{${a[1]} + 2(${mm[1]})}{3}\\right) = ${pt(g)}`)}`,
                  ),
                ),
                check(
                  t(
                    `From $G$ to $M$ the change is $${pt(gm)}$, and from $A$ to $G$ it is twice that, $${pt([gm[0]!.mul(q(2)), gm[1]!.mul(q(2))])}$: indeed $${pt(a)} + ${pt([gm[0]!.mul(q(2)), gm[1]!.mul(q(2))])} = ${pt(g)}$. So $AG = 2 \\cdot GM$.`,
                    `从 $G$ 到 $M$ 的变化量是 $${pt(gm)}$，从 $A$ 到 $G$ 的变化量是它的两倍，即 $${pt([gm[0]!.mul(q(2)), gm[1]!.mul(q(2))])}$：确实 $${pt(a)} + ${pt([gm[0]!.mul(q(2)), gm[1]!.mul(q(2))])} = ${pt(g)}$。所以 $AG = 2 \\cdot GM$。`,
                  ),
                ),
              ),
            });
          }
          const gi = [rng.int(-6, 6), rng.int(-6, 6)] as const;
          if (gi[0] === a[0] && gi[1] === a[1]) continue;
          const mBack = [q(3 * gi[0] - a[0], 2), q(3 * gi[1] - a[1], 2)];
          const back = [q(a[0]).add(mBack[0]!.mul(q(2))), q(a[1]).add(mBack[1]!.mul(q(2)))];
          return pointProblem({
            prompt: t(
              `In $\\triangle ABC$, $A = ${pt(a)}$ and the centroid is $G${pt(gi)}$. Find the midpoint $M$ of $BC$.`,
              `在 $\\triangle ABC$ 中，$A = ${pt(a)}$，重心是 $G${pt(gi)}$。求 $BC$ 的中点 $M$。`,
            ),
            answer: mBack,
            wrong: [
              [2 * gi[0] - a[0], 2 * gi[1] - a[1]],
              [q(gi[0] + a[0], 2), q(gi[1] + a[1], 2)],
              [3 * gi[0] - a[0], 3 * gi[1] - a[1]],
            ],
            solution: paras(
              step(
                1,
                "solve the formula for M",
                "从公式解出 M",
                t(
                  `The centroid is on the median $AM$, at $G = \\frac{A + 2M}{3}$. Multiply by $3$, subtract $A$ and divide by $2$:${steps("3G = A + 2M", "M = \\frac{3G - A}{2}")}`,
                  `重心在中线 $AM$ 上，$G = \\frac{A + 2M}{3}$。两边乘以 $3$，减去 $A$，再除以 $2$：${steps("3G = A + 2M", "M = \\frac{3G - A}{2}")}`,
                ),
              ),
              step(
                2,
                "work out each coordinate",
                "分别计算坐标",
                t(
                  `Put in $G${pt(gi)}$ and $A${pt(a)}$:${steps(`M = \\left(\\frac{3(${gi[0]}) - (${a[0]})}{2}, \\frac{3(${gi[1]}) - (${a[1]})}{2}\\right) = ${pt(mBack)}`)}`,
                  `代入 $G${pt(gi)}$ 和 $A${pt(a)}$：${steps(`M = \\left(\\frac{3(${gi[0]}) - (${a[0]})}{2}, \\frac{3(${gi[1]}) - (${a[1]})}{2}\\right) = ${pt(mBack)}`)}`,
                ),
              ),
              check(
                t(
                  `Put $M$ back into $\\frac{A + 2M}{3}$: $A + 2M = ${pt(back)}$, and a third of it is $${pt([back[0]!.div(q(3)), back[1]!.div(q(3))])}$, the centroid $G$.`,
                  `把 $M$ 代回 $\\frac{A + 2M}{3}$：$A + 2M = ${pt(back)}$，它的三分之一是 $${pt([back[0]!.div(q(3)), back[1]!.div(q(3))])}$，正是重心 $G$。`,
                ),
              ),
            ),
          });
        }
      },
    },
    {
      id: "the-median-of-an-isosceles-triangle",
      figure: geometryDrawings2["proofs-involving-medians-and-centroids#the-median-of-an-isosceles-triangle"],
      title: t("The median of an isosceles triangle", "等腰三角形底边上的中线"),
      explanation: t(
        `In an isosceles triangle the median to the base is also a height. To prove it, show that it splits the triangle into two congruent halves, whose angles at the base of the median must then be equal. Let $AB = AC$ and $M$ be the midpoint of the base $BC$:

1. $AB = AC$: given.
2. $BM = CM$: definition of a midpoint.
3. $AM = AM$: reflexive property.
4. $\\triangle ABM \\cong \\triangle ACM$: the **SSS** criterion, three pairs of equal sides.
5. $\\angle AMB = \\angle AMC$: CPCTC.

These two angles form a linear pair, so they add up to $180^\\circ$; being equal, each is $90^\\circ$. The median to the base is perpendicular to the base.

> **Watch out.** All three equal pairs here are sides, so the criterion is SSS; no angle is known before the congruence, so it cannot be SAS. And equal angles in a linear pair are $90^\\circ$ each, not $45^\\circ$.`,
        `在等腰三角形中，底边上的中线也是高。要证明这一点，就说明它把三角形分成全等的两半，这样两半在中线底端的角必然相等。设 $AB = AC$，$M$ 为底边 $BC$ 的中点：

1. $AB = AC$：已知。
2. $BM = CM$：中点的定义。
3. $AM = AM$：自反性。
4. $\\triangle ABM \\cong \\triangle ACM$：**SSS**（边边边）判定，三组边对应相等。
5. $\\angle AMB = \\angle AMC$：全等三角形的对应部分相等。

这两个角是邻补角，和为 $180^\\circ$；它们又相等，所以各是 $90^\\circ$。底边上的中线垂直于底边。

> **注意。** 这里三组相等的都是边，所以判定是 SSS；在得出全等之前还不知道任何一个角，所以不能是 SAS。另外邻补角相等时各是 $90^\\circ$，不是 $45^\\circ$。`,
      ),
      generate: (rng) => proofProblem(rng, medianIsoscelesProof(rng), congruencePool),
    },
    {
      id: "medians-and-area",
      figure: geometryDrawings2["proofs-involving-medians-and-centroids#medians-and-area"],
      title: t("Medians and area", "中线与面积"),
      explanation: t(
        `A median $AM$ splits $\\triangle ABC$ into $\\triangle ABM$ and $\\triangle ACM$. Their bases $BM$ and $CM$ are equal, and they share the height from $A$ to the line $BC$, so they have **equal areas**: each is half of the whole, even though they are usually different shapes.

The three medians split the triangle into six small triangles. The same argument, used on each median and on each median of the small triangles, shows that all six have equal area. So each of $\\triangle GBC$, $\\triangle GCA$, $\\triangle GAB$ is two of them, one third of the area, and a triangle such as $\\triangle GBM$ is one sixth. If $\\triangle ABC$ has area $60$: $\\triangle ABM$ has $30$, $\\triangle GBC$ has $20$, $\\triangle GBM$ has $10$.

> **Watch out.** Equal areas do not make the two halves congruent, and the median is neither an angle bisector nor perpendicular to its side, except in special triangles. And a triangle with a vertex at the centroid, such as $\\triangle GBC$, is one third of the whole, not one half.`,
        `中线 $AM$ 把 $\\triangle ABC$ 分成 $\\triangle ABM$ 和 $\\triangle ACM$。它们的底 $BM$ 与 $CM$ 相等，又有从 $A$ 到直线 $BC$ 的同一条高，所以**面积相等**：各是整个三角形的一半，尽管它们的形状通常不同。

三条中线把三角形分成六个小三角形。对每条中线、以及小三角形的中线重复同样的论证，可知这六个小三角形面积都相等。所以 $\\triangle GBC$、$\\triangle GCA$、$\\triangle GAB$ 各由其中两个组成，占总面积的三分之一，而像 $\\triangle GBM$ 这样的三角形占六分之一。若 $\\triangle ABC$ 的面积是 $60$：$\\triangle ABM$ 是 $30$，$\\triangle GBC$ 是 $20$，$\\triangle GBM$ 是 $10$。

> **注意。** 面积相等并不说明两半全等；除了特殊的三角形，中线既不平分角，也不垂直于它所到的边。另外以重心为顶点的三角形，如 $\\triangle GBC$，占整体的三分之一，不是一半。`,
      ),
      keyPrerequisites: ["area-of-triangles"],
      generate(rng) {
        const pts = scalene(rng);
        const fig = figure(
          mediansMarks(pts, "ABCMG"),
          "Triangle ABC with its three medians meeting at the centroid G; M is the midpoint of BC.",
          "三角形 ABC 的三条中线交于重心 G；M 是 BC 的中点。",
        );
        const [pa, pb, pc] = pts;
        const pm = mid(pb, pc);
        const foot: Point = [pa[0], 0];
        if (rng.bool(0.3)) {
          const options = [
            t(
              "Their bases $BM$ and $CM$ are equal, and they have the same height from $A$.",
              "它们的底 $BM$ 与 $CM$ 相等，且从 $A$ 出发的高相同。",
            ),
            t("They are congruent.", "它们全等。"),
            t("$AM$ bisects $\\angle BAC$.", "$AM$ 平分 $\\angle BAC$。"),
            t("$AM$ is perpendicular to $BC$.", "$AM$ 垂直于 $BC$。"),
          ];
          const shuffled = rng.shuffle(options);
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  "$AM$ is a median of $\\triangle ABC$. Why do $\\triangle ABM$ and $\\triangle ACM$ have equal areas?",
                  "$AM$ 是 $\\triangle ABC$ 的中线。为什么 $\\triangle ABM$ 与 $\\triangle ACM$ 的面积相等？",
                ),
                options: shuffled,
                correct: shuffled.indexOf(options[0]!),
                solution: paras(
                  step(
                    1,
                    "recall the area formula",
                    "回顾面积公式",
                    t(
                      "The area of a triangle is half a base times the height to it, so two triangles with equal bases and equal heights have equal areas, whatever their shapes.",
                      "三角形面积等于底乘这条底上的高的一半，所以等底等高的两个三角形面积相等，不论形状如何。",
                    ),
                  ),
                  step(
                    2,
                    "find the bases and the height",
                    "找出底和高",
                    shown(
                      t(
                        "$M$ is the midpoint of $BC$, so the bases $BM$ and $CM$ are equal. Both triangles have their third vertex at $A$, so both have the height from $A$ to the line $BC$, dashed in the figure.",
                        "$M$ 是 $BC$ 的中点，所以底 $BM$ 与 $CM$ 相等。两个三角形的第三个顶点都是 $A$，所以高都是从 $A$ 到直线 $BC$ 的距离，图中用虚线画出。",
                      ),
                    ),
                  ),
                  check(
                    t(
                      "Add the two areas: $\\frac{1}{2} \\cdot BM \\cdot h + \\frac{1}{2} \\cdot MC \\cdot h = \\frac{1}{2} \\cdot BC \\cdot h$, the area of the whole triangle, and the two terms are equal because $BM = MC$.",
                      "把两个面积相加：$\\frac{1}{2} \\cdot BM \\cdot h + \\frac{1}{2} \\cdot MC \\cdot h = \\frac{1}{2} \\cdot BC \\cdot h$，正是整个三角形的面积；又因为 $BM = MC$，两项相等。",
                    ),
                  ),
                ),
              }),
              [
                [
                  options[1]!.en,
                  "Congruent halves would need $AB = AC$, which a median does not give; the areas are equal in every triangle, because only the bases and the height matter.",
                  "两半全等需要 $AB = AC$，而中线并不保证这一点；面积在任何三角形中都相等，因为面积只取决于底和高。",
                ],
                [
                  options[2]!.en,
                  "A median goes to the midpoint of the opposite side; it bisects the angle at $A$ only when $AB = AC$.",
                  "中线通向对边的中点；只有当 $AB = AC$ 时，它才平分 $A$ 处的角。",
                ],
                [
                  options[3]!.en,
                  "A median is perpendicular to its side only when $AB = AC$; the common height is the distance from $A$ to $BC$, whatever the slant of $AM$.",
                  "只有当 $AB = AC$ 时中线才垂直于底边；两个三角形共同的高是从 $A$ 到 $BC$ 的距离，与 $AM$ 的倾斜无关。",
                ],
              ],
            ),
            figure: fig,
            solutionFigures: [
              figure(
                [
                  { kind: "shade", points: [pa, pb, pm], tone: "result" },
                  { kind: "polygon", points: [pa, pb, pc] },
                  { kind: "segment", a: pa, b: pm, accent: true },
                  { kind: "segment", a: pa, b: foot, dashed: true },
                  ...(foot[0] < 0 ? [{ kind: "segment", a: pb, b: foot, dashed: true } as Mark] : []),
                  ...(foot[0] > pc[0] ? [{ kind: "segment", a: pc, b: foot, dashed: true } as Mark] : []),
                  { kind: "right", vertex: foot, from: foot[0] < pm[0] ? pm : pb, to: pa },
                  { kind: "ticks", a: pb, b: pm, count: 1 },
                  { kind: "ticks", a: pm, b: pc, count: 1 },
                  ...names([pa, pb, pc], "ABC"),
                  { kind: "label", at: pm, text: "M", dir: "s", italic: true },
                ],
                "Triangle ABC with the median AM; triangle ABM is shaded, BM and MC are marked equal, and the height from A to the line BC is dashed.",
                "三角形 ABC 与中线 AM；三角形 ABM 涂上阴影，BM 与 MC 标为相等，从 A 到直线 BC 的高用虚线画出。",
              ),
            ],
          };
        }
        const area = 12 * rng.int(1, 15);
        const asks = [
          ["\\triangle ABM", area / 2, t("half", "一半")],
          ["\\triangle GBC", area / 3, t("one third", "三分之一")],
          ["\\triangle GAB", area / 3, t("one third", "三分之一")],
          ["\\triangle GBM", area / 6, t("one sixth", "六分之一")],
          ["\\triangle AGC", area / 3, t("one third", "三分之一")],
        ] as const;
        const [name, answer, part] = rng.pick(asks);
        const n = answer / (area / 6);
        const route: Record<string, Text> = {
          "\\triangle ABM": t(
            `$\\triangle ABM$ has half the base of $\\triangle ABC$, since $BM = \\frac{1}{2} BC$, and the same height from $A$, so its area is $\\frac{1}{2} \\cdot ${area} = ${answer}$.`,
            `$\\triangle ABM$ 的底是 $\\triangle ABC$ 的一半（$BM = \\frac{1}{2} BC$），高都是从 $A$ 出发的高，所以面积是 $\\frac{1}{2} \\cdot ${area} = ${answer}$。`,
          ),
          "\\triangle GBC": t(
            `$\\triangle GBC$ has the same base $BC$, and since $G$ is one third of the way up the median from $M$, its height is one third of the height from $A$: area $\\frac{1}{3} \\cdot ${area} = ${answer}$.`,
            `$\\triangle GBC$ 与 $\\triangle ABC$ 同底 $BC$；$G$ 在中线上距 $M$ 三分之一处，所以它的高是从 $A$ 出发的高的三分之一：面积为 $\\frac{1}{3} \\cdot ${area} = ${answer}$。`,
          ),
          "\\triangle GAB": t(
            `$\\triangle GAB$ has the same base $AB$, and $G$ is one third of the way from the midpoint of $AB$ to $C$ along that median, so its height is one third of the height from $C$: area $\\frac{1}{3} \\cdot ${area} = ${answer}$.`,
            `$\\triangle GAB$ 与 $\\triangle ABC$ 同底 $AB$；$G$ 在从 $AB$ 中点到 $C$ 的中线上，距中点三分之一处，所以它的高是从 $C$ 出发的高的三分之一：面积为 $\\frac{1}{3} \\cdot ${area} = ${answer}$。`,
          ),
          "\\triangle AGC": t(
            `$\\triangle AGC$ has the same base $AC$, and $G$ is one third of the way from the midpoint of $AC$ to $B$ along that median, so its height is one third of the height from $B$: area $\\frac{1}{3} \\cdot ${area} = ${answer}$.`,
            `$\\triangle AGC$ 与 $\\triangle ABC$ 同底 $AC$；$G$ 在从 $AC$ 中点到 $B$ 的中线上，距中点三分之一处，所以它的高是从 $B$ 出发的高的三分之一：面积为 $\\frac{1}{3} \\cdot ${area} = ${answer}$。`,
          ),
          "\\triangle GBM": t(
            `$\\triangle GBM$ has half the base, $BM = \\frac{1}{2} BC$, and one third of the height, since $G$ is one third of the way up the median from $M$: area $\\frac{1}{2} \\cdot \\frac{1}{3} \\cdot ${area} = ${answer}$.`,
            `$\\triangle GBM$ 的底是一半（$BM = \\frac{1}{2} BC$），高是三分之一（$G$ 在中线上距 $M$ 三分之一处）：面积为 $\\frac{1}{2} \\cdot \\frac{1}{3} \\cdot ${area} = ${answer}$。`,
          ),
        };
        const shaded = sixths(pts)[name]!;
        return {
          ...numberProblem({
            prompt: t(
              `$G$ is the centroid of $\\triangle ABC$, which has an area of $${area}$. Find the area of $${name}$.`,
              `$G$ 是 $\\triangle ABC$ 的重心，$\\triangle ABC$ 的面积是 $${area}$。求 $${name}$ 的面积。`,
            ),
            answer,
            form: "integer",
            wrong: [area / 2, area / 3, area / 6, area / 4],
            solution: paras(
              step(
                1,
                "split into six equal triangles",
                "分成六个面积相等的三角形",
                t(
                  `The three medians split $\\triangle ABC$ into six triangles of equal area:${steps(`${area} \\div 6 = ${area / 6}`)}`,
                  `三条中线把 $\\triangle ABC$ 分成六个面积相等的三角形：${steps(`${area} \\div 6 = ${area / 6}`)}`,
                ),
              ),
              step(
                2,
                "count the small triangles",
                "数小三角形",
                shown(
                  n === 1
                    ? t(
                        `$${name}$, shaded, is one of them, ${part.en} of the whole, so its area is $${answer}$.`,
                        `阴影部分 $${name}$ 就是其中一个，占总面积的${part["zh-CN"]}，所以面积是 $${answer}$。`,
                      )
                    : t(
                        `$${name}$, shaded, is made of ${n === 2 ? "two" : "three"} of them, ${part.en} of the whole:${steps(`${n} \\cdot ${area / 6} = ${answer}`)}`,
                        `阴影部分 $${name}$ 由其中 ${n} 个组成，占总面积的${part["zh-CN"]}：${steps(`${n} \\cdot ${area / 6} = ${answer}`)}`,
                      ),
                ),
              ),
              check(route[name]!),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [{ kind: "shade", points: shaded, tone: "result" }, ...mediansMarks(pts, "ABCMG")],
              `Triangle ABC with its three medians; the triangle asked for is shaded.`,
              `三角形 ABC 及其三条中线；所求的三角形涂上阴影。`,
            ),
          ],
        };
      },
    },
  ],
};

export const triangleTrigonometryTopics: readonly TopicDef[] = [
  theExteriorAngleTheorem,
  thePythagoreanTheorem,
  isoscelesRightTriangles,
  thirtySixtyNinetyTriangles,
  areaOfIsoscelesRightTriangles,
  areaOfThirtySixtyNinetyTriangles,
  areaOfEquilateralTriangles,
  provingTriangleTheorems,
  proofsInvolvingIsoscelesTriangles,
  mediansAndCentroids,
  proofsInvolvingMediansAndCentroids,
];
