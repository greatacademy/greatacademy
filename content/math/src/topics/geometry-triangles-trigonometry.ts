import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type Point, Q, radical, sketch } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, pointProblem, radicalProblem, steps } from "../problems.ts";

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

/** triangleByAngles draws a triangle with angles a at (0, 0) and b at (6, 0), counterclockwise. */
function triangleByAngles(a: number, b: number): [Point, Point, Point] {
  const side = (6 * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [[0, 0], [6, 0], dir(a, side)];
}

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
function pickTriple(rng: Rng, max = 60): [number, number, number] {
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
  altConverse: t("Converse of the alternate interior angles theorem", "内错角相等，两直线平行"),
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
  isosceles: t("Base angles of an isosceles triangle are congruent", "等腰三角形的两底角相等"),
  parallelogram: t("Definition of a parallelogram", "平行四边形的定义"),
  oppositeSides: t("Opposite sides of a parallelogram are congruent", "平行四边形的对边相等"),
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
}

/** Proof is a two-column proof with its figure. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  readonly figure: Figure;
}

/** m wraps LaTeX as a language-neutral text. */
const m = (tex: string) => same(`$${tex}$`);

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
// Triangles

/** exteriorFigure draws triangle ABC with angles a at A and b at B, AB extended past B to D, and labels at A, C and the exterior angle CBD. */
function exteriorFigure(a: number, b: number, labels: readonly [string, string, string], en: string, zh: string): Figure {
  const [pa, pb, pc] = triangleByAngles(a, b);
  const pd: Point = [9, 0];
  const marks: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pb, b: pd },
    { kind: "arc", vertex: pb, from: pd, to: pc, label: labels[2] || undefined, accent: true },
    ...names([pa, pb, pc, pd], "ABCD", [3, 1]),
  ];
  if (labels[0]) marks.push({ kind: "arc", vertex: pa, from: pb, to: pc, label: labels[0] });
  if (labels[1]) marks.push({ kind: "arc", vertex: pc, from: pa, to: pb, label: labels[1] });
  return figure(marks, en, zh);
}

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
    { topic: "angles-of-a-triangle", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.CO.C.10"],
  knowledgePoints: [
    {
      id: "sum-of-exterior-angles",
      title: t("The sum of the exterior angles", "外角和"),
      explanation: t(
        "Extend each side of a triangle in turn, so that there is one exterior angle at each vertex. Each exterior angle is $180^\\circ$ minus the interior angle beside it, so the three exterior angles add up to\n\n$$3 \\cdot 180^\\circ - 180^\\circ = 360^\\circ.$$\n\nIf two exterior angles are $110^\\circ$ and $130^\\circ$, the third is $360^\\circ - 110^\\circ - 130^\\circ = 120^\\circ$.",
        "依次延长三角形的各边，使每个顶点处各有一个外角。每个外角等于 $180^\\circ$ 减去与它相邻的内角，所以三个外角之和是\n\n$$3 \\cdot 180^\\circ - 180^\\circ = 360^\\circ.$$\n\n若两个外角是 $110^\\circ$ 和 $130^\\circ$，第三个外角是 $360^\\circ - 110^\\circ - 130^\\circ = 120^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(30, 95);
          const b = rng.int(30, 95);
          const c = 180 - a - b;
          if (c < 25 || [a, b, c].includes(90)) continue;
          const pts = triangleByAngles(a, b);
          const ext = [180 - a, 180 - b, 180 - c];
          const ask = rng.int(0, 2);
          const known = ext.filter((_, i) => i !== ask);
          const marks: Mark[] = [{ kind: "polygon", points: pts }];
          pts.forEach((p, i) => {
            const prev = pts[(i + 2) % 3]!;
            const next = pts[(i + 1) % 3]!;
            const len = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
            const e: Point = [p[0] + ((p[0] - prev[0]) / len) * 2.5, p[1] + ((p[1] - prev[1]) / len) * 2.5];
            marks.push({ kind: "segment", a: p, b: e });
            marks.push({ kind: "arc", vertex: p, from: e, to: next, label: i === ask ? "x" : deg(ext[i]!), accent: i === ask });
          });
          return {
            ...numberProblem({
              prompt: t("Find the exterior angle $x$.", "求外角 $x$。"),
              answer: ext[ask]!,
              form: "integer",
              unit: "°",
              wrong: [180 - ext[ask]!, 540 - known[0]! - known[1]!, intOr(known[0]! + known[1]!, 2, Math.abs(known[0]! - known[1]!))],
              solution: t(
                `The exterior angles of a triangle, one at each vertex, add up to $360^\\circ$:${steps(`x = 360^\\circ - ${known[0]}^\\circ - ${known[1]}^\\circ = ${ext[ask]}^\\circ`)}`,
                `三角形的外角（每个顶点取一个）之和是 $360^\\circ$：${steps(`x = 360^\\circ - ${known[0]}^\\circ - ${known[1]}^\\circ = ${ext[ask]}^\\circ`)}`,
              ),
            }),
            figure: figure(
              marks,
              `A triangle with each side extended, one exterior angle at each vertex: ${known[0]}°, ${known[1]}° and x.`,
              `一个三角形，各边依次延长，每个顶点各有一个外角：${known[0]}°、${known[1]}° 和 x。`,
            ),
          };
        }
      },
    },
    {
      id: "exterior-angle-equations",
      title: t("Equations with the exterior angle", "含外角的方程"),
      explanation: t(
        "When the exterior angle and the remote interior angles are all written with $x$, the theorem gives an equation with $x$ on both sides.\n\nIf $\\angle A = (x + 10)^\\circ$, $\\angle C = 2x^\\circ$ and the exterior angle is $\\angle CBD = (4x - 15)^\\circ$, then\n\n$$4x - 15 = (x + 10) + 2x, \\qquad 4x - 15 = 3x + 10, \\qquad x = 25.$$",
        "当外角和与它不相邻的两个内角都用 $x$ 表示时，外角定理给出两边都含 $x$ 的方程。\n\n若 $\\angle A = (x + 10)^\\circ$，$\\angle C = 2x^\\circ$，外角 $\\angle CBD = (4x - 15)^\\circ$，则\n\n$$4x - 15 = (x + 10) + 2x, \\qquad 4x - 15 = 3x + 10, \\qquad x = 25.$$",
      ),
      keyPrerequisites: ["exterior-angles-of-triangles"],
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 25);
          const a = rng.int(30, 90);
          const c = rng.int(30, 90);
          const b = 180 - a - c;
          if (b < 25 || [a, b, c].includes(90)) continue;
          const [k1, k2] = [rng.int(1, 3), rng.int(1, 3)];
          const p = k1 + k2 + rng.int(1, 3);
          const [d1, d2, e] = [a - k1 * x, c - k2 * x, a + c];
          const de = e - p * x;
          if (Math.abs(d1) > 60 || Math.abs(d2) > 60 || Math.abs(de) > 90 || de === 0) continue;
          const k = k1 + k2;
          const d = d1 + d2;
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
              solution: t(
                `The exterior angle equals the sum of the two remote interior angles:${chain(`${linear(p, de)} = (${linear(k1, d1)}) + (${linear(k2, d2)})`, `${linear(p, de)} = ${linear(k, d)}`, `${linear(p - k, 0)} = ${d - de}`, `x = ${x}`)}`,
                `外角等于与它不相邻的两个内角之和：${chain(`${linear(p, de)} = (${linear(k1, d1)}) + (${linear(k2, d2)})`, `${linear(p, de)} = ${linear(k, d)}`, `${linear(p - k, 0)} = ${d - de}`, `x = ${x}`)}`,
              ),
            }),
            figure: exteriorFigure(
              a,
              b,
              [angleLabel(k1, d1), angleLabel(k2, d2), angleLabel(p, de)],
              `Triangle ABC with AB extended past B to D. Angle A is ${angleLabel(k1, d1)}, angle C is ${angleLabel(k2, d2)} and the exterior angle CBD is ${angleLabel(p, de)}.`,
              `三角形 ABC，边 AB 延长到 D。角 A 为 ${angleLabel(k1, d1)}，角 C 为 ${angleLabel(k2, d2)}，外角 CBD 为 ${angleLabel(p, de)}。`,
            ),
          };
        }
      },
    },
    {
      id: "angles-from-exterior-angle-equations",
      title: t("Finding the angles", "求出各角"),
      explanation: t(
        "Once $x$ is known, substitute it to find each angle, and check that the answer makes sense.\n\nWith $\\angle A = (x + 10)^\\circ$, $\\angle C = 2x^\\circ$ and $\\angle CBD = (4x - 15)^\\circ$, the equation gives $x = 25$. Then $\\angle A = 35^\\circ$, $\\angle C = 50^\\circ$ and $\\angle CBD = 85^\\circ$; indeed $35^\\circ + 50^\\circ = 85^\\circ$. The interior angle at $B$ is $180^\\circ - 85^\\circ = 95^\\circ$.",
        "求出 $x$ 后，代入即可求出各角，并检验结果是否合理。\n\n若 $\\angle A = (x + 10)^\\circ$，$\\angle C = 2x^\\circ$，$\\angle CBD = (4x - 15)^\\circ$，方程给出 $x = 25$。于是 $\\angle A = 35^\\circ$，$\\angle C = 50^\\circ$，$\\angle CBD = 85^\\circ$；确实 $35^\\circ + 50^\\circ = 85^\\circ$。$B$ 处的内角是 $180^\\circ - 85^\\circ = 95^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 25);
          const a = rng.int(30, 90);
          const c = rng.int(30, 90);
          const b = 180 - a - c;
          if (b < 25 || [a, b, c].includes(90)) continue;
          const [k1, k2] = [rng.int(1, 3), rng.int(1, 3)];
          const p = k1 + k2 + rng.int(1, 3);
          const [d1, d2, e] = [a - k1 * x, c - k2 * x, a + c];
          const de = e - p * x;
          if (Math.abs(d1) > 60 || Math.abs(d2) > 60 || Math.abs(de) > 90 || de === 0) continue;
          const ask = rng.int(0, 2);
          const names3 = ["\\angle A", "\\angle C", "\\angle ABC"];
          const answer = [a, c, b][ask]!;
          const k = k1 + k2;
          const d = d1 + d2;
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $\\angle A = ${angleTex(k1, d1)}$, $\\angle C = ${angleTex(k2, d2)}$ and the exterior angle $\\angle CBD = ${angleTex(p, de)}$. Find $${names3[ask]}$.`,
                `如图，$\\angle A = ${angleTex(k1, d1)}$，$\\angle C = ${angleTex(k2, d2)}$，外角 $\\angle CBD = ${angleTex(p, de)}$。求 $${names3[ask]}$。`,
              ),
              answer,
              form: "integer",
              unit: "°",
              wrong: [x, e, 180 - answer, ask === 2 ? a + c : b],
              solution: t(
                `The exterior angle equals the sum of the remote interior angles:${chain(`${linear(p, de)} = ${linear(k, d)}`, `x = ${x}`)}So $\\angle A = ${a}^\\circ$, $\\angle C = ${c}^\\circ$ and $\\angle CBD = ${e}^\\circ$, and $\\angle ABC = 180^\\circ - ${e}^\\circ = ${b}^\\circ$. The answer is $${names3[ask]} = ${answer}^\\circ$.`,
                `外角等于与它不相邻的两个内角之和：${chain(`${linear(p, de)} = ${linear(k, d)}`, `x = ${x}`)}所以 $\\angle A = ${a}^\\circ$，$\\angle C = ${c}^\\circ$，$\\angle CBD = ${e}^\\circ$，而 $\\angle ABC = 180^\\circ - ${e}^\\circ = ${b}^\\circ$。答案是 $${names3[ask]} = ${answer}^\\circ$。`,
              ),
            }),
            figure: exteriorFigure(
              a,
              b,
              [angleLabel(k1, d1), angleLabel(k2, d2), angleLabel(p, de)],
              `Triangle ABC with AB extended past B to D. Angle A is ${angleLabel(k1, d1)}, angle C is ${angleLabel(k2, d2)} and the exterior angle CBD is ${angleLabel(p, de)}.`,
              `三角形 ABC，边 AB 延长到 D。角 A 为 ${angleLabel(k1, d1)}，角 C 为 ${angleLabel(k2, d2)}，外角 CBD 为 ${angleLabel(p, de)}。`,
            ),
          };
        }
      },
    },
  ],
};

/** pythagorasFigure draws a right triangle with legs p and q and the given side labels. */
function pythagorasFigure(
  rng: Rng,
  p: number,
  q: number,
  sides: readonly [string | null, string | null, string | null],
  en: string,
  zh: string,
) {
  return figure(rightMarks(rightTri(p, q, pickPose(rng)), { sides }), en, zh);
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
  encompasses: [
    { topic: "solving-equations-with-square-roots", weight: 0.3 },
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "classifying-triangles", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.G.B.7", "CCSS.8.G.B.6"],
  knowledgePoints: [
    {
      id: "finding-the-hypotenuse",
      title: t("Finding the hypotenuse", "求斜边"),
      explanation: t(
        "In a right triangle, the side opposite the right angle is the **hypotenuse**; it is the longest side. The other two sides are the **legs**. The **Pythagorean theorem** says that if the legs are $a$ and $b$ and the hypotenuse is $c$, then\n\n$$a^2 + b^2 = c^2.$$\n\nWith legs $6$ and $8$: $c^2 = 36 + 64 = 100$, so $c = 10$ (a length is positive, so take the positive root).",
        "直角三角形中，直角所对的边叫**斜边**，它是最长的边；另外两条边叫**直角边**。**勾股定理**指出：若直角边为 $a$、$b$，斜边为 $c$，则\n\n$$a^2 + b^2 = c^2.$$\n\n直角边为 $6$ 和 $8$ 时：$c^2 = 36 + 64 = 100$，所以 $c = 10$（长度为正，取正的平方根）。",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 50);
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: c,
            form: "integer",
            wrong: [a + b, a * a + b * b, Math.abs(b - a)],
            solution: t(
              `$x$ is the hypotenuse:${chain(`x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}`, `x = \\sqrt{${c * c}} = ${c}`)}`,
              `$x$ 是斜边：${chain(`x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}`, `x = \\sqrt{${c * c}} = ${c}`)}`,
            ),
          }),
          figure: pythagorasFigure(
            rng,
            a,
            b,
            [`${a}`, "x", `${b}`],
            `A right triangle with legs ${a} and ${b} and hypotenuse x.`,
            `一个直角三角形，直角边为 ${a} 和 ${b}，斜边为 x。`,
          ),
        };
      },
    },
    {
      id: "finding-a-leg",
      title: t("Finding a leg", "求直角边"),
      explanation: t(
        "To find a leg, subtract: $a^2 = c^2 - b^2$. Make sure you subtract the square of the leg from the square of the hypotenuse, not the other way round.\n\nWith hypotenuse $13$ and leg $5$: $a^2 = 169 - 25 = 144$, so $a = 12$.",
        "求直角边要用减法：$a^2 = c^2 - b^2$。注意是斜边的平方减去已知直角边的平方，而不是反过来。\n\n斜边为 $13$、一条直角边为 $5$ 时：$a^2 = 169 - 25 = 144$，所以 $a = 12$。",
      ),
      generate(rng) {
        const [a, b, c] = pickTriple(rng, 50);
        return {
          ...numberProblem({
            prompt: t("Find $x$.", "求 $x$。"),
            answer: b,
            form: "integer",
            wrong: [c - a, c * c - a * a, c + a],
            solution: t(
              `$x$ is a leg and $${c}$ is the hypotenuse:${chain(`x^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}`, `x = \\sqrt{${b * b}} = ${b}`)}`,
              `$x$ 是直角边，$${c}$ 是斜边：${chain(`x^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}`, `x = \\sqrt{${b * b}} = ${b}`)}`,
            ),
          }),
          figure: pythagorasFigure(
            rng,
            a,
            b,
            [`${a}`, `${c}`, "x"],
            `A right triangle with a leg ${a}, hypotenuse ${c}, and the other leg x.`,
            `一个直角三角形，一条直角边为 ${a}，斜边为 ${c}，另一条直角边为 x。`,
          ),
        };
      },
    },
    {
      id: "lengths-in-simplest-radical-form",
      title: t("Answers in simplest radical form", "最简根式形式的答案"),
      explanation: t(
        "Most right triangles do not have three whole-number sides. Then leave the length exact, in simplest radical form.\n\nWith legs $4$ and $6$: $c^2 = 16 + 36 = 52$, so $c = \\sqrt{52} = \\sqrt{4 \\cdot 13} = 2\\sqrt{13}$.",
        "大多数直角三角形的三边并不都是整数。这时把长度保留为精确值，写成最简根式。\n\n直角边为 $4$ 和 $6$ 时：$c^2 = 16 + 36 = 52$，所以 $c = \\sqrt{52} = \\sqrt{4 \\cdot 13} = 2\\sqrt{13}$。",
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
          const work = hyp ? `x^2 = ${a}^2 + ${b}^2 = ${n}` : `x^2 = ${b}^2 - ${a}^2 = ${n}`;
          const simplify = k === 1 ? `x = \\sqrt{${n}}` : `x = \\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${r}} = ${sqrtTex(k, r)}`;
          return {
            ...radicalProblem({
              prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
              answer,
              wrong: [
                `\\sqrt{${hyp ? b * b - a * a : a * a + b * b}}`,
                `${hyp ? a + b : b - a}`,
                k === 1 ? `\\sqrt{${hyp ? a + b : b + a}}` : `\\sqrt{${n}}`,
              ],
              solution: t(
                `${hyp ? "$x$ is the hypotenuse" : `$x$ is a leg and $${b}$ is the hypotenuse`}:${chain(work, simplify)}`,
                `${hyp ? "$x$ 是斜边" : `$x$ 是直角边，$${b}$ 是斜边`}：${chain(work, simplify)}`,
              ),
            }),
            figure: hyp
              ? pythagorasFigure(
                  rng,
                  a,
                  b,
                  [`${a}`, "x", `${b}`],
                  `A right triangle with legs ${a} and ${b} and hypotenuse x.`,
                  `一个直角三角形，直角边为 ${a} 和 ${b}，斜边为 x。`,
                )
              : pythagorasFigure(
                  rng,
                  a,
                  Math.sqrt(n),
                  [`${a}`, `${b}`, "x"],
                  `A right triangle with a leg ${a}, hypotenuse ${b}, and the other leg x.`,
                  `一个直角三角形，一条直角边为 ${a}，斜边为 ${b}，另一条直角边为 x。`,
                ),
          };
        }
      },
    },
    {
      id: "the-converse",
      title: t("The converse", "逆定理"),
      explanation: t(
        "The **converse** of the theorem also holds: if the sides satisfy $a^2 + b^2 = c^2$, the triangle is a right triangle. More generally, compare the square of the longest side $c$ with the sum of the squares of the other two:\n\n- $c^2 = a^2 + b^2$: right;\n- $c^2 < a^2 + b^2$: acute;\n- $c^2 > a^2 + b^2$: obtuse.\n\nFor sides $5$, $7$, $9$: $81 > 25 + 49 = 74$, so the triangle is obtuse.",
        "勾股定理的**逆定理**也成立：若三边满足 $a^2 + b^2 = c^2$，则这个三角形是直角三角形。更一般地，把最长边 $c$ 的平方与另两边的平方和比较：\n\n- $c^2 = a^2 + b^2$：直角三角形；\n- $c^2 < a^2 + b^2$：锐角三角形；\n- $c^2 > a^2 + b^2$：钝角三角形。\n\n三边为 $5$、$7$、$9$ 时：$81 > 25 + 49 = 74$，所以是钝角三角形。",
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
          const shown = rng.shuffle([a, b, c]);
          return choiceProblem({
            prompt: t(
              `A triangle has sides of lengths $${shown[0]}$, $${shown[1]}$ and $${shown[2]}$. Is it acute, right or obtuse?`,
              `一个三角形的三边长为 $${shown[0]}$、$${shown[1]}$、$${shown[2]}$。它是锐角、直角还是钝角三角形？`,
            ),
            options: angleKindsOfTriangles,
            correct: kind,
            solution: t(
              `Compare the square of the longest side with the sum of the squares of the other two:${steps(`${c}^2 = ${c * c}, \\qquad ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${lhs}`, `${c * c} ${rel} ${lhs}`)}So the triangle is ${angleKindsOfTriangles[kind]!.en.toLowerCase()}.`,
              `把最长边的平方与另两边的平方和比较：${steps(`${c}^2 = ${c * c}, \\qquad ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${lhs}`, `${c * c} ${rel} ${lhs}`)}所以这是${angleKindsOfTriangles[kind]!["zh-CN"]}。`,
            ),
          });
        }
      },
    },
  ],
};

/** isoRightFigure draws an isosceles right triangle with leg and hypotenuse labels. */
function isoRightFigure(rng: Rng, legLabel: string | null, hypLabel: string | null, en: string, zh: string): Figure {
  const tri = rightTri(4, 4, pickPose(rng));
  const [r, u, v] = tri;
  return figure(
    [
      ...rightMarks(tri, { sides: [legLabel, hypLabel, null], atU: "45°" }),
      { kind: "ticks", a: r, b: u, count: 1 },
      { kind: "ticks", a: v, b: r, count: 1 },
    ],
    en,
    zh,
  );
}

/** sumTex writes a + b√m in LaTeX. */
const sumTex = (a: number, b: number, m: number) => `${a} + ${sqrtTex(b, m)}`;

export const isoscelesRightTriangles: TopicDef = {
  id: "isosceles-right-triangles",
  title: t("Isosceles Right Triangles", "等腰直角三角形"),
  summary: t(
    "Use the side ratio 1 : 1 : √2 of a 45°-45°-90° triangle to find its sides and perimeter.",
    "利用 45°-45°-90° 三角形的边长比 1 : 1 : √2 求边长与周长。",
  ),
  prerequisites: ["the-pythagorean-theorem", "isosceles-triangles", "rationalizing-denominators"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "rationalizing-denominators", weight: 0.2 },
    { topic: "simplifying-square-roots", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.C.8"],
  knowledgePoints: [
    {
      id: "hypotenuse-from-a-leg",
      title: t("The hypotenuse from a leg", "由直角边求斜边"),
      explanation: t(
        "An **isosceles right triangle** has two equal legs, so its acute angles are both $45^\\circ$: it is a $45^\\circ$-$45^\\circ$-$90^\\circ$ triangle. With legs $s$, the Pythagorean theorem gives $c^2 = s^2 + s^2 = 2s^2$, so\n\n$$c = s\\sqrt{2}.$$\n\nThe sides are in the ratio $1 : 1 : \\sqrt{2}$. A leg of $7$ gives a hypotenuse of $7\\sqrt{2}$; a leg of $3\\sqrt{2}$ gives $3\\sqrt{2} \\cdot \\sqrt{2} = 6$.",
        "**等腰直角三角形**的两条直角边相等，所以两个锐角都是 $45^\\circ$：它是 $45^\\circ$-$45^\\circ$-$90^\\circ$ 三角形。直角边为 $s$ 时，由勾股定理 $c^2 = s^2 + s^2 = 2s^2$，所以\n\n$$c = s\\sqrt{2}.$$\n\n三边之比为 $1 : 1 : \\sqrt{2}$。直角边为 $7$ 时斜边是 $7\\sqrt{2}$；直角边为 $3\\sqrt{2}$ 时斜边是 $3\\sqrt{2} \\cdot \\sqrt{2} = 6$。",
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 1, 2, 3]);
        const leg = surd(k, m);
        const answer = mulS(leg, [Q.one, 2]);
        const legTex = sqrtTex(k, m);
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [`${2 * k}${m === 1 ? "" : `\\sqrt{${m}}`}`, texS(mulS(leg, [Q.one, 3])), texS(divS(leg, [Q.one, 2]))],
            solution: t(
              `The legs are equal, so the hypotenuse is $\\sqrt{2}$ times a leg:${steps(`x = ${legTex} \\cdot \\sqrt{2} = ${texS(answer)}`)}`,
              `两条直角边相等，所以斜边是直角边的 $\\sqrt{2}$ 倍：${steps(`x = ${legTex} \\cdot \\sqrt{2} = ${texS(answer)}`)}`,
            ),
          }),
          figure: isoRightFigure(
            rng,
            label(k, m),
            "x",
            `An isosceles right triangle with legs ${label(k, m)} and hypotenuse x.`,
            `一个等腰直角三角形，直角边为 ${label(k, m)}，斜边为 x。`,
          ),
        };
      },
    },
    {
      id: "a-leg-from-the-hypotenuse",
      title: t("A leg from the hypotenuse", "由斜边求直角边"),
      explanation: t(
        "Going the other way, divide the hypotenuse by $\\sqrt{2}$ and rationalize:\n\n$$s = \\frac{c}{\\sqrt{2}} = \\frac{c\\sqrt{2}}{2}.$$\n\nA hypotenuse of $10$ gives legs of $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}$. A hypotenuse of $9\\sqrt{2}$ gives legs of $9$.",
        "反过来，用斜边除以 $\\sqrt{2}$ 并把分母有理化：\n\n$$s = \\frac{c}{\\sqrt{2}} = \\frac{c\\sqrt{2}}{2}.$$\n\n斜边为 $10$ 时直角边是 $\\frac{10}{\\sqrt{2}} = \\frac{10\\sqrt{2}}{2} = 5\\sqrt{2}$。斜边为 $9\\sqrt{2}$ 时直角边是 $9$。",
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const k = rng.int(2, 20);
        const m = rng.pick([1, 1, 2, 3]);
        const hyp = surd(k, m);
        const answer = divS(hyp, [Q.one, 2]);
        const hypTex = sqrtTex(k, m);
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [texS(mulS(hyp, [Q.one, 2])), texS([hyp[0].div(q(2)), hyp[1]]), `\\frac{${hypTex}}{\\sqrt{2}}`],
            solution: t(
              `The hypotenuse is $\\sqrt{2}$ times a leg, so divide by $\\sqrt{2}$:${chain(`x = \\frac{${hypTex}}{\\sqrt{2}} = ${texS(answer)}`)}`,
              `斜边是直角边的 $\\sqrt{2}$ 倍，所以除以 $\\sqrt{2}$：${chain(`x = \\frac{${hypTex}}{\\sqrt{2}} = ${texS(answer)}`)}`,
            ),
          }),
          figure: isoRightFigure(
            rng,
            "x",
            label(k, m),
            `An isosceles right triangle with hypotenuse ${label(k, m)} and legs x.`,
            `一个等腰直角三角形，斜边为 ${label(k, m)}，直角边为 x。`,
          ),
        };
      },
    },
    {
      id: "perimeter-of-an-isosceles-right-triangle",
      title: t("The perimeter", "周长"),
      explanation: t(
        "Find all three sides first, then add them, combining like terms. A triangle with legs $6$ has hypotenuse $6\\sqrt{2}$ and perimeter\n\n$$6 + 6 + 6\\sqrt{2} = 12 + 6\\sqrt{2}.$$\n\nThe whole numbers and the multiples of $\\sqrt{2}$ are unlike terms, so they stay separate.",
        "先求出三条边，再相加并合并同类项。直角边为 $6$ 的三角形斜边是 $6\\sqrt{2}$，周长是\n\n$$6 + 6 + 6\\sqrt{2} = 12 + 6\\sqrt{2}.$$\n\n整数与 $\\sqrt{2}$ 的倍数不是同类项，要分开写。",
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const fromLeg = rng.bool();
        const leg = fromLeg ? k : 2 * k;
        const legS = fromLeg ? `${k}` : sqrtTex(k, 2);
        const answer = fromLeg ? sumTex(2 * k, k, 2) : sumTex(2 * k, 2 * k, 2);
        const given = fromLeg ? t(`legs of length $${k}$`, `直角边长 $${k}$`) : t(`a hypotenuse of length $${2 * k}$`, `斜边长 $${2 * k}$`);
        return expressionProblem({
          prompt: t(
            `An isosceles right triangle has ${given.en}. Find its perimeter in simplest radical form.`,
            `一个等腰直角三角形的${given["zh-CN"]}。求它的周长，写成最简根式。`,
          ),
          answer,
          radical: true,
          wrong: [
            fromLeg ? `${3 * k}` : `${3 * k}\\sqrt{2}`,
            fromLeg ? `${3 * k}\\sqrt{2}` : `${2 * k} + ${2 * k}`,
            fromLeg ? sumTex(k, 2 * k, 2) : sumTex(4 * k, 2 * k, 2),
          ],
          solution: fromLeg
            ? t(
                `The hypotenuse is $${k}\\sqrt{2}$:${steps(`P = ${k} + ${k} + ${k}\\sqrt{2} = ${answer}`)}`,
                `斜边是 $${k}\\sqrt{2}$：${steps(`P = ${k} + ${k} + ${k}\\sqrt{2} = ${answer}`)}`,
              )
            : t(
                `Each leg is $\\frac{${2 * k}}{\\sqrt{2}} = ${legS}$:${steps(`P = ${legS} + ${legS} + ${leg} = ${answer}`)}`,
                `每条直角边是 $\\frac{${2 * k}}{\\sqrt{2}} = ${legS}$：${steps(`P = ${legS} + ${legS} + ${leg} = ${answer}`)}`,
              ),
        });
      },
    },
  ],
};

/** thirtySixtyFigure draws a 30°-60°-90° triangle with its short leg along RU and labels for the short leg, hypotenuse and long leg. */
function thirtySixtyFigure(rng: Rng, labels: readonly [string | null, string | null, string | null], en: string, zh: string): Figure {
  const tri = rightTri(1, Math.sqrt(3), pickPose(rng));
  return figure(rightMarks(tri, { sides: labels, atU: "60°", atV: "30°" }), en, zh);
}

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
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "rationalizing-denominators", weight: 0.2 },
    { topic: "simplifying-square-roots", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.C.8"],
  knowledgePoints: [
    {
      id: "from-the-shorter-leg",
      title: t("From the shorter leg", "由较短的直角边"),
      explanation: t(
        "Cut an equilateral triangle with side $2s$ in half along a height: each half is a right triangle with angles $30^\\circ$, $60^\\circ$, $90^\\circ$, hypotenuse $2s$ and shorter leg $s$. By the Pythagorean theorem, the longer leg is $\\sqrt{(2s)^2 - s^2} = s\\sqrt{3}$. So the sides are\n\n$$s : s\\sqrt{3} : 2s.$$\n\nThe shorter leg is opposite the $30^\\circ$ angle. With shorter leg $5$: longer leg $5\\sqrt{3}$, hypotenuse $10$.",
        "把边长为 $2s$ 的等边三角形沿一条高剪成两半：每一半都是角为 $30^\\circ$、$60^\\circ$、$90^\\circ$ 的直角三角形，斜边为 $2s$，较短的直角边为 $s$。由勾股定理，较长的直角边是 $\\sqrt{(2s)^2 - s^2} = s\\sqrt{3}$。所以三边之比为\n\n$$s : s\\sqrt{3} : 2s.$$\n\n较短的直角边对着 $30^\\circ$ 角。较短的直角边为 $5$ 时，较长的直角边是 $5\\sqrt{3}$，斜边是 $10$。",
      ),
      generate(rng) {
        const s = rng.int(2, 15);
        const askLong = rng.bool();
        const answer: S = askLong ? [q(s), 3] : [q(2 * s), 1];
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer,
            wrong: askLong ? [`${s}\\sqrt{2}`, `${2 * s}`, `${2 * s}\\sqrt{3}`] : [`${s}\\sqrt{3}`, `${s}\\sqrt{2}`, `${3 * s}`],
            solution: askLong
              ? t(
                  `The longer leg is $\\sqrt{3}$ times the shorter leg:${steps(`x = ${s}\\sqrt{3}`)}`,
                  `较长的直角边是较短直角边的 $\\sqrt{3}$ 倍：${steps(`x = ${s}\\sqrt{3}`)}`,
                )
              : t(
                  `The hypotenuse is twice the shorter leg:${steps(`x = 2 \\cdot ${s} = ${2 * s}`)}`,
                  `斜边是较短直角边的 $2$ 倍：${steps(`x = 2 \\cdot ${s} = ${2 * s}`)}`,
                ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [`${s}`, askLong ? null : "x", askLong ? "x" : null],
            `A 30°-60°-90° triangle with shorter leg ${s}; x is the ${askLong ? "longer leg" : "hypotenuse"}.`,
            `一个 30°-60°-90° 三角形，较短的直角边为 ${s}；x 是${askLong ? "较长的直角边" : "斜边"}。`,
          ),
        };
      },
    },
    {
      id: "from-the-hypotenuse",
      title: t("From the hypotenuse", "由斜边"),
      explanation: t(
        "Halve the hypotenuse to get the shorter leg, then multiply by $\\sqrt{3}$ for the longer leg. With hypotenuse $14$: shorter leg $7$, longer leg $7\\sqrt{3}$. With hypotenuse $9$: shorter leg $\\frac{9}{2}$, longer leg $\\frac{9\\sqrt{3}}{2}$.",
        "斜边的一半是较短的直角边，再乘以 $\\sqrt{3}$ 得到较长的直角边。斜边为 $14$ 时：较短的直角边 $7$，较长的直角边 $7\\sqrt{3}$。斜边为 $9$ 时：较短的直角边 $\\frac{9}{2}$，较长的直角边 $\\frac{9\\sqrt{3}}{2}$。",
      ),
      generate(rng) {
        const h = rng.int(3, 30);
        const askLong = rng.bool();
        const answer: S = askLong ? [q(h, 2), 3] : [q(h, 2), 1];
        const half = q(h, 2).toLatex();
        return {
          ...radicalProblem({
            prompt: t("Find $x$. Give your answer in simplest radical form.", "求 $x$。答案写成最简根式。"),
            answer,
            wrong: askLong ? [`${h}\\sqrt{3}`, half, `${h}\\sqrt{2}`] : [`${2 * h}`, `${h}\\sqrt{3}`, radical(q(h, 2), 3)],
            solution: askLong
              ? t(
                  `The shorter leg is half the hypotenuse, $${half}$, and the longer leg is $\\sqrt{3}$ times it:${steps(`x = ${texS(answer)}`)}`,
                  `较短的直角边是斜边的一半，即 $${half}$，较长的直角边是它的 $\\sqrt{3}$ 倍：${steps(`x = ${texS(answer)}`)}`,
                )
              : t(
                  `The shorter leg is half the hypotenuse:${steps(`x = \\frac{${h}}{2}${h % 2 === 0 ? ` = ${h / 2}` : ""}`)}`,
                  `较短的直角边是斜边的一半：${steps(`x = \\frac{${h}}{2}${h % 2 === 0 ? ` = ${h / 2}` : ""}`)}`,
                ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [askLong ? null : "x", `${h}`, askLong ? "x" : null],
            `A 30°-60°-90° triangle with hypotenuse ${h}; x is the ${askLong ? "longer" : "shorter"} leg.`,
            `一个 30°-60°-90° 三角形，斜边为 ${h}；x 是${askLong ? "较长" : "较短"}的直角边。`,
          ),
        };
      },
    },
    {
      id: "from-the-longer-leg",
      title: t("From the longer leg", "由较长的直角边"),
      explanation: t(
        "Divide the longer leg by $\\sqrt{3}$ to get the shorter leg, and rationalize; then double it for the hypotenuse. With longer leg $6$:\n\n$$s = \\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}, \\qquad c = 2s = 4\\sqrt{3}.$$\n\nWith longer leg $5\\sqrt{3}$, the shorter leg is $5$ and the hypotenuse $10$.",
        "较长的直角边除以 $\\sqrt{3}$ 并把分母有理化，得到较短的直角边；再乘以 $2$ 得到斜边。较长的直角边为 $6$ 时：\n\n$$s = \\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}, \\qquad c = 2s = 4\\sqrt{3}.$$\n\n较长的直角边为 $5\\sqrt{3}$ 时，较短的直角边是 $5$，斜边是 $10$。",
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 3]);
        const long = surd(k, m);
        const short = divS(long, [Q.one, 3]);
        const askHyp = rng.bool();
        const answer = askHyp ? mulS(short, [q(2), 1]) : short;
        const longTex = sqrtTex(k, m);
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
            solution: askHyp
              ? t(
                  `The shorter leg is the longer leg divided by $\\sqrt{3}$, and the hypotenuse is twice the shorter leg:${chain(`s = \\frac{${longTex}}{\\sqrt{3}} = ${texS(short)}`, `x = 2 \\cdot ${texS(short)} = ${texS(answer)}`)}`,
                  `较短的直角边等于较长的直角边除以 $\\sqrt{3}$，斜边是较短直角边的 $2$ 倍：${chain(`s = \\frac{${longTex}}{\\sqrt{3}} = ${texS(short)}`, `x = 2 \\cdot ${texS(short)} = ${texS(answer)}`)}`,
                )
              : t(
                  `The shorter leg is the longer leg divided by $\\sqrt{3}$:${chain(`x = \\frac{${longTex}}{\\sqrt{3}} = ${texS(answer)}`)}`,
                  `较短的直角边等于较长的直角边除以 $\\sqrt{3}$：${chain(`x = \\frac{${longTex}}{\\sqrt{3}} = ${texS(answer)}`)}`,
                ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [askHyp ? null : "x", askHyp ? "x" : null, label(k, m)],
            `A 30°-60°-90° triangle with longer leg ${label(k, m)}; x is the ${askHyp ? "hypotenuse" : "shorter leg"}.`,
            `一个 30°-60°-90° 三角形，较长的直角边为 ${label(k, m)}；x 是${askHyp ? "斜边" : "较短的直角边"}。`,
          ),
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "area-from-a-leg",
      title: t("From a leg", "由直角边求面积"),
      explanation: t(
        "The legs of a right triangle are a base and its height. In an isosceles right triangle both are $s$, so\n\n$$A = \\frac{1}{2} s \\cdot s = \\frac{s^2}{2}.$$\n\nWith legs $6$: $A = \\frac{36}{2} = 18$. With legs $3\\sqrt{2}$: $A = \\frac{18}{2} = 9$.",
        "直角三角形的两条直角边就是一组底和高。等腰直角三角形的两条直角边都是 $s$，所以\n\n$$A = \\frac{1}{2} s \\cdot s = \\frac{s^2}{2}.$$\n\n直角边为 $6$ 时：$A = \\frac{36}{2} = 18$。直角边为 $3\\sqrt{2}$ 时：$A = \\frac{18}{2} = 9$。",
      ),
      generate(rng) {
        const k = rng.int(2, 16);
        const m = rng.pick([1, 1, 2]);
        const sq = k * k * m;
        const area = q(sq, 2);
        return {
          ...numberProblem({
            prompt: t("Find the area of the isosceles right triangle.", "求这个等腰直角三角形的面积。"),
            answer: area,
            wrong: [sq, 2 * sq, k * k, area.mul(q(m === 2 ? 1 : 2, 2))],
            solution: t(
              `Both legs are $${sqrtTex(k, m)}$, a base and its height:${chain(`A = \\frac{1}{2} \\cdot (${sqrtTex(k, m)})^2 = \\frac{${sq}}{2} = ${area.toLatex()}`)}`,
              `两条直角边都是 $${sqrtTex(k, m)}$，正好是一组底和高：${chain(`A = \\frac{1}{2} \\cdot (${sqrtTex(k, m)})^2 = \\frac{${sq}}{2} = ${area.toLatex()}`)}`,
            ),
          }),
          figure: isoRightFigure(
            rng,
            label(k, m),
            null,
            `An isosceles right triangle with legs ${label(k, m)}.`,
            `一个等腰直角三角形，直角边为 ${label(k, m)}。`,
          ),
        };
      },
    },
    {
      id: "area-from-the-hypotenuse",
      title: t("From the hypotenuse", "由斜边求面积"),
      explanation: t(
        "From the hypotenuse $c$, the legs are $\\frac{c}{\\sqrt{2}}$, so $s^2 = \\frac{c^2}{2}$ and\n\n$$A = \\frac{s^2}{2} = \\frac{c^2}{4}.$$\n\nWith hypotenuse $10$: the legs are $5\\sqrt{2}$, and $A = \\frac{100}{4} = 25$.",
        "已知斜边 $c$ 时，直角边是 $\\frac{c}{\\sqrt{2}}$，所以 $s^2 = \\frac{c^2}{2}$，\n\n$$A = \\frac{s^2}{2} = \\frac{c^2}{4}.$$\n\n斜边为 $10$ 时：直角边是 $5\\sqrt{2}$，$A = \\frac{100}{4} = 25$。",
      ),
      generate(rng) {
        const k = rng.int(2, 20);
        const m = rng.pick([1, 1, 2]);
        const sq = k * k * m;
        const area = q(sq, 4);
        return {
          ...numberProblem({
            prompt: t("Find the area of the isosceles right triangle.", "求这个等腰直角三角形的面积。"),
            answer: area,
            wrong: [q(sq, 2), sq, q(k * k, 2)],
            solution: t(
              `Each leg is the hypotenuse divided by $\\sqrt{2}$, so the square of a leg is $\\frac{${sq}}{2}$:${chain(`A = \\frac{1}{2} \\cdot \\frac{${sq}}{2} = \\frac{${sq}}{4} = ${area.toLatex()}`)}`,
              `每条直角边等于斜边除以 $\\sqrt{2}$，所以直角边的平方是 $\\frac{${sq}}{2}$：${chain(`A = \\frac{1}{2} \\cdot \\frac{${sq}}{2} = \\frac{${sq}}{4} = ${area.toLatex()}`)}`,
            ),
          }),
          figure: isoRightFigure(
            rng,
            null,
            label(k, m),
            `An isosceles right triangle with hypotenuse ${label(k, m)}.`,
            `一个等腰直角三角形，斜边为 ${label(k, m)}。`,
          ),
        };
      },
    },
    {
      id: "sides-from-the-area",
      title: t("Sides from the area", "由面积求边长"),
      explanation: t(
        "Reverse the formula: $s^2 = 2A$, so $s = \\sqrt{2A}$; then the hypotenuse is $s\\sqrt{2}$.\n\nAn isosceles right triangle with area $32$ has $s^2 = 64$, so its legs are $8$ and its hypotenuse is $8\\sqrt{2}$.",
        "把公式反过来：$s^2 = 2A$，所以 $s = \\sqrt{2A}$；斜边是 $s\\sqrt{2}$。\n\n面积为 $32$ 的等腰直角三角形满足 $s^2 = 64$，所以直角边是 $8$，斜边是 $8\\sqrt{2}$。",
      ),
      generate(rng) {
        const s = rng.int(2, 16);
        const area = q(s * s, 2);
        const askHyp = rng.bool();
        const answer: S = askHyp ? [q(s), 2] : [q(s), 1];
        const what = askHyp ? sideNames.hyp : t("each leg", "每条直角边");
        return radicalProblem({
          prompt: t(
            `An isosceles right triangle has an area of $${area.toLatex()}$. Find ${what.en} in simplest radical form.`,
            `一个等腰直角三角形的面积是 $${area.toLatex()}$。求${what["zh-CN"]}，写成最简根式。`,
          ),
          answer,
          wrong: askHyp ? [`${s}`, `${2 * s}`, `${s}\\sqrt{3}`] : [texS(sqrtS(s * s * 2)), `${s * s}`, texS(sqrtS(s * s * 4))],
          solution: t(
            `Since $\\frac{s^2}{2} = ${area.toLatex()}$:${chain(`s^2 = ${s * s}`, `s = ${s}`, ...(askHyp ? [`c = ${s}\\sqrt{2}`] : []))}`,
            `由 $\\frac{s^2}{2} = ${area.toLatex()}$：${chain(`s^2 = ${s * s}`, `s = ${s}`, ...(askHyp ? [`c = ${s}\\sqrt{2}`] : []))}`,
          ),
        });
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "area-from-the-shorter-leg",
      title: t("From the shorter leg", "由较短的直角边求面积"),
      explanation: t(
        "The two legs are a base and its height. With shorter leg $s$, the longer leg is $s\\sqrt{3}$, so\n\n$$A = \\frac{1}{2} \\cdot s \\cdot s\\sqrt{3} = \\frac{s^2\\sqrt{3}}{2}.$$\n\nWith shorter leg $4$: $A = \\frac{1}{2} \\cdot 4 \\cdot 4\\sqrt{3} = 8\\sqrt{3}$.",
        "两条直角边就是一组底和高。较短的直角边为 $s$ 时，较长的直角边是 $s\\sqrt{3}$，所以\n\n$$A = \\frac{1}{2} \\cdot s \\cdot s\\sqrt{3} = \\frac{s^2\\sqrt{3}}{2}.$$\n\n较短的直角边为 $4$ 时：$A = \\frac{1}{2} \\cdot 4 \\cdot 4\\sqrt{3} = 8\\sqrt{3}$。",
      ),
      generate(rng) {
        const s = rng.int(2, 16);
        const answer: S = [q(s * s, 2), 3];
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer,
            wrong: [`${s * s}\\sqrt{3}`, q(s * s, 2).toLatex(), radical(q(s * s, 4), 3), `${s * s}`],
            solution: t(
              `The longer leg is $${s}\\sqrt{3}$, and the legs are a base and its height:${steps(`A = \\frac{1}{2} \\cdot ${s} \\cdot ${s}\\sqrt{3} = ${texS(answer)}`)}`,
              `较长的直角边是 $${s}\\sqrt{3}$，两条直角边是一组底和高：${steps(`A = \\frac{1}{2} \\cdot ${s} \\cdot ${s}\\sqrt{3} = ${texS(answer)}`)}`,
            ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [`${s}`, null, null],
            `A 30°-60°-90° triangle with shorter leg ${s}.`,
            `一个 30°-60°-90° 三角形，较短的直角边为 ${s}。`,
          ),
        };
      },
    },
    {
      id: "area-from-the-hypotenuse",
      title: t("From the hypotenuse", "由斜边求面积"),
      explanation: t(
        "Find the legs first. With hypotenuse $12$, the shorter leg is $6$ and the longer leg $6\\sqrt{3}$, so\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6\\sqrt{3} = 18\\sqrt{3}.$$\n\nDo not multiply the hypotenuse by a leg: the hypotenuse is not a height of the triangle on a leg.",
        "先求出两条直角边。斜边为 $12$ 时，较短的直角边是 $6$，较长的直角边是 $6\\sqrt{3}$，所以\n\n$$A = \\frac{1}{2} \\cdot 6 \\cdot 6\\sqrt{3} = 18\\sqrt{3}.$$\n\n不要用斜边乘直角边：斜边不是以直角边为底时的高。",
      ),
      generate(rng) {
        const h = rng.int(2, 24);
        const s = q(h, 2);
        const answer: S = [s.mul(s).div(q(2)), 3];
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer,
            wrong: [radical(q(h * h, 2), 3), radical(q(h * h, 4), 3), radical(q(h * h, 4), 1), `${h * h}\\sqrt{3}`],
            solution: t(
              `The shorter leg is $${s.toLatex()}$ and the longer leg is $${texS([s, 3])}$:${steps(`A = \\frac{1}{2} \\cdot ${s.toLatex()} \\cdot ${texS([s, 3])} = ${texS(answer)}`)}`,
              `较短的直角边是 $${s.toLatex()}$，较长的直角边是 $${texS([s, 3])}$：${steps(`A = \\frac{1}{2} \\cdot ${s.toLatex()} \\cdot ${texS([s, 3])} = ${texS(answer)}`)}`,
            ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [null, `${h}`, null],
            `A 30°-60°-90° triangle with hypotenuse ${h}.`,
            `一个 30°-60°-90° 三角形，斜边为 ${h}。`,
          ),
        };
      },
    },
    {
      id: "area-from-the-longer-leg",
      title: t("From the longer leg", "由较长的直角边求面积"),
      explanation: t(
        "With longer leg $L$, the shorter leg is $\\frac{L}{\\sqrt{3}} = \\frac{L\\sqrt{3}}{3}$. With $L = 6$: the shorter leg is $2\\sqrt{3}$ and\n\n$$A = \\frac{1}{2} \\cdot 2\\sqrt{3} \\cdot 6 = 6\\sqrt{3}.$$",
        "较长的直角边为 $L$ 时，较短的直角边是 $\\frac{L}{\\sqrt{3}} = \\frac{L\\sqrt{3}}{3}$。$L = 6$ 时：较短的直角边是 $2\\sqrt{3}$，\n\n$$A = \\frac{1}{2} \\cdot 2\\sqrt{3} \\cdot 6 = 6\\sqrt{3}.$$",
      ),
      generate(rng) {
        const k = rng.int(2, 15);
        const m = rng.pick([1, 1, 3]);
        const long = surd(k, m);
        const short = divS(long, [Q.one, 3]);
        const answer = mulS(mulS(short, long), [q(1, 2), 1]);
        return {
          ...radicalProblem({
            prompt: t("Find the area of the triangle in simplest radical form.", "求这个三角形的面积，写成最简根式。"),
            answer: [answer[0], answer[1]],
            wrong: [texS(mulS(mulS(long, long), [q(1, 2), 3])), texS(mulS(short, long)), texS(mulS(mulS(long, long), [q(1, 2), 1]))],
            solution: t(
              `The shorter leg is $\\frac{${sqrtTex(k, m)}}{\\sqrt{3}} = ${texS(short)}$:${steps(`A = \\frac{1}{2} \\cdot ${texS(short)} \\cdot ${sqrtTex(k, m)} = ${texS(answer)}`)}`,
              `较短的直角边是 $\\frac{${sqrtTex(k, m)}}{\\sqrt{3}} = ${texS(short)}$：${steps(`A = \\frac{1}{2} \\cdot ${texS(short)} \\cdot ${sqrtTex(k, m)} = ${texS(answer)}`)}`,
            ),
          }),
          figure: thirtySixtyFigure(
            rng,
            [null, null, label(k, m)],
            `A 30°-60°-90° triangle with longer leg ${label(k, m)}.`,
            `一个 30°-60°-90° 三角形，较长的直角边为 ${label(k, m)}。`,
          ),
        };
      },
    },
  ],
};

/** equilateralFigure draws an equilateral triangle with side labels, and its height dashed when height is given. */
function equilateralFigure(rng: Rng, side: string | null, height: string | null, en: string, zh: string): Figure {
  const pose: Pose = { turn: rng.pick([0, 0, 180, 90, 270]), mirror: false };
  const [a, b, c, d] = posed([[0, 0] as Point, [2, 0] as Point, [1, Math.sqrt(3)] as Point, [1, 0] as Point] as const, pose);
  const marks: Mark[] = [
    { kind: "polygon", points: [a, b, c] },
    { kind: "ticks", a, b, count: 1 },
    { kind: "ticks", a: b, b: c, count: 1 },
    { kind: "ticks", a: c, b: a, count: 1 },
    ...outside([a, b, c], [side, null, null]),
  ];
  if (height !== null) {
    marks.push({ kind: "segment", a: c, b: d, dashed: true, accent: true });
    marks.push({ kind: "right", vertex: d, from: b, to: c });
    marks.push({ kind: "side", a: d, b: c, text: height });
  }
  return figure(marks, en, zh);
}

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
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.C.8"],
  knowledgePoints: [
    {
      id: "height-of-an-equilateral-triangle",
      title: t("The height", "高"),
      explanation: t(
        "A height of an equilateral triangle with side $s$ cuts it into two $30^\\circ$-$60^\\circ$-$90^\\circ$ triangles with hypotenuse $s$ and shorter leg $\\frac{s}{2}$. The height is the longer leg:\n\n$$h = \\frac{s}{2} \\cdot \\sqrt{3} = \\frac{s\\sqrt{3}}{2}.$$\n\nWith side $10$: $h = 5\\sqrt{3}$.",
        "边长为 $s$ 的等边三角形的一条高把它分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，斜边为 $s$，较短的直角边为 $\\frac{s}{2}$。高是较长的直角边：\n\n$$h = \\frac{s}{2} \\cdot \\sqrt{3} = \\frac{s\\sqrt{3}}{2}.$$\n\n边长为 $10$ 时：$h = 5\\sqrt{3}$。",
      ),
      generate(rng) {
        const s = rng.int(2, 24);
        const answer: S = [q(s, 2), 3];
        return {
          ...radicalProblem({
            prompt: t(
              "The triangle is equilateral. Find its height $h$ in simplest radical form.",
              "这个三角形是等边三角形。求它的高 $h$，写成最简根式。",
            ),
            answer,
            wrong: [`${s}\\sqrt{3}`, radical(q(s, 2), 2), q(s, 2).toLatex(), radical(q(s, 3), 3)],
            solution: t(
              `The height cuts the triangle into two $30^\\circ$-$60^\\circ$-$90^\\circ$ triangles with shorter leg $${q(s, 2).toLatex()}$; the height is the longer leg:${steps(`h = ${texS(answer)}`)}`,
              `高把三角形分成两个 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，较短的直角边是 $${q(s, 2).toLatex()}$；高是较长的直角边：${steps(`h = ${texS(answer)}`)}`,
            ),
          }),
          figure: equilateralFigure(
            rng,
            `${s}`,
            "h",
            `An equilateral triangle with side ${s} and its height h dashed.`,
            `一个边长为 ${s} 的等边三角形，高 h 用虚线画出。`,
          ),
        };
      },
    },
    {
      id: "area-from-the-side",
      title: t("The area from the side", "由边长求面积"),
      explanation: t(
        "Multiply half the base by the height:\n\n$$A = \\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^2\\sqrt{3}}{4}.$$\n\nWith side $6$: $A = \\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$.",
        "底的一半乘以高：\n\n$$A = \\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^2\\sqrt{3}}{4}.$$\n\n边长为 $6$ 时：$A = \\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$。",
      ),
      generate(rng) {
        const s = rng.int(2, 20);
        const answer: S = [q(s * s, 4), 3];
        return {
          ...radicalProblem({
            prompt: t("Find the area of the equilateral triangle in simplest radical form.", "求这个等边三角形的面积，写成最简根式。"),
            answer,
            wrong: [radical(q(s * s, 2), 3), q(s * s, 2).toLatex(), `${s * s}\\sqrt{3}`, radical(q(s * s, 4), 2)],
            solution: t(
              `Use $A = \\frac{s^2\\sqrt{3}}{4}$:${steps(`A = \\frac{${s}^2\\sqrt{3}}{4} = \\frac{${s * s}\\sqrt{3}}{4} = ${texS(answer)}`)}`,
              `用 $A = \\frac{s^2\\sqrt{3}}{4}$：${steps(`A = \\frac{${s}^2\\sqrt{3}}{4} = \\frac{${s * s}\\sqrt{3}}{4} = ${texS(answer)}`)}`,
            ),
          }),
          figure: equilateralFigure(rng, `${s}`, null, `An equilateral triangle with side ${s}.`, `一个边长为 ${s} 的等边三角形。`),
        };
      },
    },
    {
      id: "side-from-the-area-or-perimeter",
      title: t("From the area or the perimeter", "由面积或周长求解"),
      explanation: t(
        "From the area, solve $\\frac{s^2\\sqrt{3}}{4} = A$ for $s$. If $A = 16\\sqrt{3}$, then $\\frac{s^2}{4} = 16$, $s^2 = 64$ and $s = 8$.\n\nFrom the perimeter $P$, the side is $\\frac{P}{3}$; a perimeter of $24$ gives side $8$ and area $16\\sqrt{3}$.",
        "已知面积时，由 $\\frac{s^2\\sqrt{3}}{4} = A$ 解出 $s$。若 $A = 16\\sqrt{3}$，则 $\\frac{s^2}{4} = 16$，$s^2 = 64$，$s = 8$。\n\n已知周长 $P$ 时，边长是 $\\frac{P}{3}$；周长为 $24$ 时边长是 $8$，面积是 $16\\sqrt{3}$。",
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
            solution: t(
              `Set $\\frac{s^2\\sqrt{3}}{4}$ equal to the area and divide by $\\sqrt{3}$:${chain(`\\frac{s^2}{4} = ${q(s * s, 4).toLatex()}`, `s^2 = ${s * s}`, `s = ${s}`)}`,
              `令 $\\frac{s^2\\sqrt{3}}{4}$ 等于面积，两边除以 $\\sqrt{3}$：${chain(`\\frac{s^2}{4} = ${q(s * s, 4).toLatex()}`, `s^2 = ${s * s}`, `s = ${s}`)}`,
            ),
          });
        }
        return radicalProblem({
          prompt: t(
            `An equilateral triangle has a perimeter of $${3 * s}$. Find its area in simplest radical form.`,
            `一个等边三角形的周长是 $${3 * s}$。求它的面积，写成最简根式。`,
          ),
          answer: area,
          wrong: [radical(q(9 * s * s, 4), 3), radical(q(s * s, 2), 3), q(s * s, 4).toLatex()],
          solution: t(
            `Each side is $${3 * s} \\div 3 = ${s}$:${steps(`A = \\frac{${s}^2\\sqrt{3}}{4} = ${texS(area)}`)}`,
            `每条边长 $${3 * s} \\div 3 = ${s}$：${steps(`A = \\frac{${s}^2\\sqrt{3}}{4} = ${texS(area)}`)}`,
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
  const fig = figure(
    [
      { kind: "polygon", points: [pa, pb, pc] },
      { kind: "segment", a: pd, b: pe },
      { kind: "arrows", a: pa, b: pb, count: 1 },
      { kind: "arrows", a: pd, b: pe, count: 1 },
      { kind: "arc", vertex: pa, from: pb, to: pc },
      { kind: "arc", vertex: pb, from: pc, to: pa },
      { kind: "arc", vertex: pc, from: pd, to: pa, accent: true },
      { kind: "arc", vertex: pc, from: pb, to: pe, accent: true },
      ...names([pa, pb, pc], `${A}${B}${C}`),
      { kind: "label", at: pd, text: D, dir: "w", italic: true },
      { kind: "label", at: pe, text: E, dir: "e", italic: true },
    ],
    `Triangle ${A}${B}${C} with line ${D}${E} through ${C} parallel to ${A}${B}.`,
    `三角形 ${A}${B}${C}，过 ${C} 的直线 ${D}${E} 与 ${A}${B} 平行。`,
  );
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
      { s: m(`${D}${E} \\parallel ${A}${B}`), r: "given" },
      {
        s: m(`\\angle ${D}${C}${A} = \\angle ${A}`),
        r: "alternate",
        why: across,
        alts: [
          m(`\\angle ${D}${C}${A} = \\angle ${B}`),
          m(`\\angle ${D}${C}${A} = \\angle ${A}${C}${B}`),
          m(`\\angle ${D}${C}${A} + \\angle ${A} = 90^\\circ`),
        ],
      },
      {
        s: m(`\\angle ${E}${C}${B} = \\angle ${B}`),
        r: "alternate",
        why: t(`$${B}${C}$ is a transversal of the parallel lines.`, `$${B}${C}$ 是两条平行线的截线。`),
        alts: [
          m(`\\angle ${E}${C}${B} = \\angle ${A}`),
          m(`\\angle ${E}${C}${B} = \\angle ${D}${C}${A}`),
          m(`\\angle ${E}${C}${B} + \\angle ${B} = 90^\\circ`),
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
      },
      {
        s: m(`\\angle ${A} + \\angle ${A}${C}${B} + \\angle ${B} = 180^\\circ`),
        r: "substitution",
        why: t(
          "Replace the angles at the top by the equal angles of the triangle from steps 2 and 3.",
          "用第 2、3 步中相等的三角形内角替换顶点处的角。",
        ),
        alts: [
          m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${B}`),
          m(`\\angle ${A} + \\angle ${A}${C}${B} + \\angle ${B} = 360^\\circ`),
          m(`\\angle ${A} = \\angle ${B}`),
        ],
      },
    ],
    figure: fig,
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
  const fig = figure(
    [
      { kind: "polygon", points: [pa, pb, pc] },
      { kind: "segment", a: pc, b: pd },
      { kind: "arc", vertex: pa, from: pb, to: pc },
      { kind: "arc", vertex: pb, from: pc, to: pa },
      { kind: "arc", vertex: pc, from: pd, to: pa, accent: true },
      ...names([pa, pb, pc], `${A}${B}${C}`),
      { kind: "label", at: pd, text: D, dir: "s", italic: true },
    ],
    `Triangle ${A}${B}${C} with side ${B}${C} extended past ${C} to ${D}, forming the exterior angle ${A}${C}${D}.`,
    `三角形 ${A}${B}${C}，边 ${B}${C} 延长到 ${D}，形成外角 ${A}${C}${D}。`,
  );
  const sum = `\\angle ${A} + \\angle ${B} + \\angle ${A}${C}${B}`;
  return {
    given: t(`$\\triangle ${A}${B}${C}$ with $${B}${C}$ extended to $${D}$`, `$\\triangle ${A}${B}${C}$，$${B}${C}$ 延长到 $${D}$`),
    prove: m(`\\angle ${A}${C}${D} = \\angle ${A} + \\angle ${B}`),
    steps: [
      {
        s: t(`$\\triangle ${A}${B}${C}$ with $${B}${C}$ extended to $${D}$`, `$\\triangle ${A}${B}${C}$，$${B}${C}$ 延长到 $${D}$`),
        r: "given",
      },
      {
        s: m(`${sum} = 180^\\circ`),
        r: "angleSum",
        alts: [m(`\\angle ${A} + \\angle ${B} = 180^\\circ`), m(`${sum} = 360^\\circ`), m(`\\angle ${A} + \\angle ${B} = 90^\\circ`)],
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
      },
      {
        s: m(`${sum} = \\angle ${A}${C}${B} + \\angle ${A}${C}${D}`),
        r: "substitution",
        why: t("Both sums equal $180^\\circ$.", "两个和都等于 $180^\\circ$。"),
      },
      {
        s: m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${D}`),
        r: "subtraction",
        why: t(`Subtract $\\angle ${A}${C}${B}$ from both sides.`, `两边同时减去 $\\angle ${A}${C}${B}$。`),
        alts: [
          m(`\\angle ${A} + \\angle ${B} = \\angle ${A}${C}${B}`),
          m(`\\angle ${A} = \\angle ${A}${C}${D}`),
          m(`\\angle ${A} + \\angle ${B} + \\angle ${A}${C}${D} = 180^\\circ`),
        ],
      },
    ],
    figure: fig,
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
  const big = small.map(([x, y]) => [9 + k * x, k * y] as Point);
  const fig = figure(
    [
      { kind: "polygon", points: small },
      { kind: "polygon", points: big },
      { kind: "arc", vertex: small[0], from: small[1], to: small[2] },
      { kind: "arc", vertex: big[0]!, from: big[1]!, to: big[2]! },
      { kind: "arc", vertex: small[1], from: small[2], to: small[0], accent: true },
      { kind: "arc", vertex: big[1]!, from: big[2]!, to: big[0]!, accent: true },
      ...names(small, `${A}${B}${C}`),
      ...names(big, `${D}${E}${F}`),
    ],
    `Triangles ${A}${B}${C} and ${D}${E}${F} with angle ${A} equal to angle ${D} and angle ${B} equal to angle ${E}.`,
    `三角形 ${A}${B}${C} 和 ${D}${E}${F}，角 ${A} 等于角 ${D}，角 ${B} 等于角 ${E}。`,
  );
  return {
    given: m(`\\angle ${A} = \\angle ${D}, \\; \\angle ${B} = \\angle ${E}`),
    prove: m(`\\angle ${C} = \\angle ${F}`),
    steps: [
      { s: m(`\\angle ${A} = \\angle ${D}, \\; \\angle ${B} = \\angle ${E}`), r: "given" },
      { s: m(`\\angle ${A} + \\angle ${B} + \\angle ${C} = 180^\\circ`), r: "angleSum" },
      { s: m(`\\angle ${D} + \\angle ${E} + \\angle ${F} = 180^\\circ`), r: "angleSum" },
      {
        s: m(`\\angle ${A} + \\angle ${B} + \\angle ${C} = \\angle ${D} + \\angle ${E} + \\angle ${F}`),
        r: "substitution",
        why: t("Both sums equal $180^\\circ$.", "两个和都等于 $180^\\circ$。"),
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
      },
      {
        s: m(`\\angle ${C} = \\angle ${F}`),
        r: "subtraction",
        why: t(`Subtract $\\angle ${A} + \\angle ${B}$ from both sides.`, `两边同时减去 $\\angle ${A} + \\angle ${B}$。`),
        alts: [m(`\\angle ${C} = \\angle ${D}`), m(`\\angle ${C} + \\angle ${F} = 180^\\circ`), m(`\\angle ${A} = \\angle ${F}`)],
      },
    ],
    figure: fig,
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

export const provingTriangleTheorems: TopicDef = {
  id: "proving-triangle-theorems",
  title: t("Proving Triangle Theorems", "证明三角形定理"),
  summary: t(
    "Follow and complete proofs of the triangle angle sum theorem, the exterior angle theorem and the third angles theorem.",
    "理解并补全三角形内角和定理、外角定理和第三角定理的证明。",
  ),
  prerequisites: ["the-exterior-angle-theorem"],
  encompasses: [
    { topic: "the-exterior-angle-theorem", weight: 0.3 },
    { topic: "angles-of-a-triangle", weight: 0.2 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.10"],
  knowledgePoints: [
    {
      id: "proving-the-angle-sum-theorem",
      title: t("The angle sum theorem", "三角形内角和定理"),
      explanation: t(
        "A **two-column proof** lists statements, each with a reason: something given, a definition, or a theorem already proved.\n\nTo prove that the angles of $\\triangle ABC$ add up to $180^\\circ$, draw the line $DE$ through $C$ parallel to $AB$. Then:\n\n1. $\\angle DCA = \\angle A$ and $\\angle ECB = \\angle B$: alternate interior angles are congruent.\n2. $\\angle DCA + \\angle ACB + \\angle ECB = 180^\\circ$: the three angles make a straight angle.\n3. $\\angle A + \\angle ACB + \\angle B = 180^\\circ$: substitution.",
        "**两栏式证明**逐条列出结论，每条都写明理由：已知条件、定义，或已经证明的定理。\n\n要证明 $\\triangle ABC$ 的内角和是 $180^\\circ$，过 $C$ 作直线 $DE$ 平行于 $AB$。于是：\n\n1. $\\angle DCA = \\angle A$，$\\angle ECB = \\angle B$：两直线平行，内错角相等。\n2. $\\angle DCA + \\angle ACB + \\angle ECB = 180^\\circ$：三个角组成一个平角。\n3. $\\angle A + \\angle ACB + \\angle B = 180^\\circ$：等量代换。",
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
      title: t("The exterior angle theorem", "外角定理"),
      explanation: t(
        "With the angle sum theorem proved, it can be used as a reason. In $\\triangle ABC$ with $BC$ extended to $D$:\n\n1. $\\angle A + \\angle B + \\angle ACB = 180^\\circ$: triangle angle sum theorem.\n2. $\\angle ACB + \\angle ACD = 180^\\circ$: the angles form a linear pair.\n3. $\\angle A + \\angle B + \\angle ACB = \\angle ACB + \\angle ACD$: substitution, since both equal $180^\\circ$.\n4. $\\angle A + \\angle B = \\angle ACD$: subtract $\\angle ACB$ from both sides.",
        "内角和定理证明之后，就可以作为理由使用。在 $\\triangle ABC$ 中，$BC$ 延长到 $D$：\n\n1. $\\angle A + \\angle B + \\angle ACB = 180^\\circ$：三角形内角和定理。\n2. $\\angle ACB + \\angle ACD = 180^\\circ$：两角是邻补角。\n3. $\\angle A + \\angle B + \\angle ACB = \\angle ACB + \\angle ACD$：等量代换，两边都等于 $180^\\circ$。\n4. $\\angle A + \\angle B = \\angle ACD$：两边同时减去 $\\angle ACB$。",
      ),
      generate: (rng) => proofProblem(rng, exteriorProof(rng), anglePool),
    },
    {
      id: "proving-the-third-angles-theorem",
      title: t("The third angles theorem", "第三角定理"),
      explanation: t(
        "**Third angles theorem:** if two angles of one triangle are equal to two angles of another, the third angles are equal too.\n\nGiven $\\angle A = \\angle D$ and $\\angle B = \\angle E$: both angle sums are $180^\\circ$, so $\\angle A + \\angle B + \\angle C = \\angle D + \\angle E + \\angle F$. Substituting $\\angle A$ for $\\angle D$ and $\\angle B$ for $\\angle E$ gives $\\angle A + \\angle B + \\angle C = \\angle A + \\angle B + \\angle F$, and subtracting gives $\\angle C = \\angle F$.",
        "**第三角定理**：如果一个三角形的两个角分别等于另一个三角形的两个角，那么它们的第三个角也相等。\n\n已知 $\\angle A = \\angle D$，$\\angle B = \\angle E$：两个三角形的内角和都是 $180^\\circ$，所以 $\\angle A + \\angle B + \\angle C = \\angle D + \\angle E + \\angle F$。用 $\\angle A$ 替换 $\\angle D$、$\\angle B$ 替换 $\\angle E$，得 $\\angle A + \\angle B + \\angle C = \\angle A + \\angle B + \\angle F$，两边相减得 $\\angle C = \\angle F$。",
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

/** isoMarks draws an isosceles triangle with the segment from the apex to D, ticks on the legs and the given extra marks. */
function isoMarks(
  f: IsoFigure,
  letters: string,
  opts: { ticks?: boolean; arcs?: boolean; bisector?: boolean; right?: boolean; baseTicks?: boolean },
): Mark[] {
  const { pa, pb, pc, pd } = f;
  const marks: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "segment", a: pa, b: pd, dashed: true, accent: true },
    ...names([pa, pb, pc], letters.slice(0, 3)),
    { kind: "label", at: pd, text: letters[3]!, dir: "s", italic: true },
  ];
  if (opts.ticks) marks.push({ kind: "ticks", a: pa, b: pb, count: 1 }, { kind: "ticks", a: pa, b: pc, count: 1 });
  if (opts.baseTicks) marks.push({ kind: "ticks", a: pb, b: pd, count: 2 }, { kind: "ticks", a: pd, b: pc, count: 2 });
  if (opts.arcs) marks.push({ kind: "arc", vertex: pb, from: pc, to: pa }, { kind: "arc", vertex: pc, from: pa, to: pb });
  if (opts.bisector)
    marks.push({ kind: "arc", vertex: pa, from: pb, to: pd, accent: true }, { kind: "arc", vertex: pa, from: pd, to: pc, accent: true });
  if (opts.right) marks.push({ kind: "right", vertex: pd, from: pc, to: pa });
  return marks;
}

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
  const letters = `${A}${B}${C}${D}`;
  const fig = figure(
    isoMarks(f, letters, { ticks: variant !== 1, arcs: variant === 1, bisector: true }),
    variant === 1
      ? `Triangle ${A}${B}${C} with equal angles at ${B} and ${C}, and ${A}${D} bisecting angle ${A} with ${D} on ${B}${C}.`
      : `Triangle ${A}${B}${C} with ${A}${B} = ${A}${C}, and ${A}${D} bisecting angle ${A} with ${D} on ${B}${C}.`,
    variant === 1
      ? `三角形 ${A}${B}${C}，${B}、${C} 处的角相等，${A}${D} 平分角 ${A}，${D} 在 ${B}${C} 上。`
      : `三角形 ${A}${B}${C}，${A}${B} = ${A}${C}，${A}${D} 平分角 ${A}，${D} 在 ${B}${C} 上。`,
  );
  const bisect: ProofStep = {
    s: m(`\\angle ${B}${A}${D} = \\angle ${C}${A}${D}`),
    r: "bisector",
    alts: [m(`\\angle ${B}${A}${D} = \\angle ${B}`), m(`${B}${D} = ${C}${D}`), m(`\\angle ${A}${D}${B} = \\angle ${A}${D}${C}`)],
  };
  const common: ProofStep = {
    s: m(`${A}${D} = ${A}${D}`),
    r: "reflexive",
    why: t(`The two triangles share the side $${A}${D}$.`, `两个三角形有公共边 $${A}${D}$。`),
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
    alts: [
      m(`\\triangle ${A}${B}${D} \\cong \\triangle ${A}${D}${C}`),
      m(`\\triangle ${A}${B}${D} \\cong \\triangle ${C}${A}${D}`),
      m(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${D}`),
    ],
  });
  if (variant === 1) {
    return {
      given: t(
        `$\\angle ${B} = \\angle ${C}$, and $${A}${D}$ bisects $\\angle ${B}${A}${C}$`,
        `$\\angle ${B} = \\angle ${C}$，$${A}${D}$ 平分 $\\angle ${B}${A}${C}$`,
      ),
      prove: m(`${A}${B} = ${A}${C}`),
      steps: [
        { s: m(`\\angle ${B} = \\angle ${C}`), r: "given" },
        bisect,
        common,
        congruent("aas"),
        {
          s: m(`${A}${B} = ${A}${C}`),
          r: "cpctc",
          alts: [m(`${A}${B} = ${B}${C}`), m(`${B}${D} = ${A}${D}`), m(`\\angle ${B} = \\angle ${B}${A}${D}`)],
        },
      ],
      figure: fig,
    };
  }
  const start: ProofStep[] = [{ s: m(`${A}${B} = ${A}${C}`), r: "given" }, bisect, common, congruent("sas")];
  if (variant === 0) {
    return {
      given: t(
        `$${A}${B} = ${A}${C}$, and $${A}${D}$ bisects $\\angle ${B}${A}${C}$`,
        `$${A}${B} = ${A}${C}$，$${A}${D}$ 平分 $\\angle ${B}${A}${C}$`,
      ),
      prove: m(`\\angle ${B} = \\angle ${C}`),
      steps: [
        ...start,
        {
          s: m(`\\angle ${B} = \\angle ${C}`),
          r: "cpctc",
          alts: [m(`\\angle ${B} = \\angle ${B}${A}${D}`), m(`${B}${D} = ${A}${D}`), m(`\\angle ${B} + \\angle ${C} = 90^\\circ`)],
        },
      ],
      figure: fig,
    };
  }
  return {
    given: t(
      `$${A}${B} = ${A}${C}$, and $${A}${D}$ bisects $\\angle ${B}${A}${C}$`,
      `$${A}${B} = ${A}${C}$，$${A}${D}$ 平分 $\\angle ${B}${A}${C}$`,
    ),
    prove: t(`$${B}${D} = ${C}${D}$ and $${A}${D} \\perp ${B}${C}$`, `$${B}${D} = ${C}${D}$，且 $${A}${D} \\perp ${B}${C}$`),
    steps: [
      ...start,
      { s: m(`${B}${D} = ${C}${D}`), r: "cpctc", alts: [m(`${B}${D} = ${A}${D}`), m(`${A}${B} = ${B}${D}`), m(`${B}${C} = ${A}${D}`)] },
      { s: m(`\\angle ${A}${D}${B} = \\angle ${A}${D}${C}`), r: "cpctc" },
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
        why: t(`By step 6, $2\\angle ${A}${D}${B} = 180^\\circ$.`, `由第 6 步，$2\\angle ${A}${D}${B} = 180^\\circ$。`),
        alts: [m(`\\angle ${A}${D}${B} = 45^\\circ`), m(`\\angle ${A}${D}${B} = 180^\\circ`), m(`\\angle ${A}${D}${B} = \\angle ${B}`)],
      },
    ],
    figure: fig,
  };
}

export const proofsInvolvingIsoscelesTriangles: TopicDef = {
  id: "proofs-involving-isosceles-triangles",
  title: t("Proofs Involving Isosceles Triangles", "等腰三角形的证明"),
  summary: t(
    "Prove the isosceles triangle theorem and its converse with congruent triangles, and use them to find sides and angles.",
    "用全等三角形证明等腰三角形定理及其逆定理，并用它们求边和角。",
  ),
  prerequisites: ["proving-triangle-theorems", "isosceles-triangles"],
  encompasses: [
    { topic: "isosceles-triangles", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.10"],
  knowledgePoints: [
    {
      id: "proving-the-isosceles-triangle-theorem",
      title: t("The isosceles triangle theorem", "等腰三角形定理"),
      explanation: t(
        "Two triangles are **congruent** ($\\cong$) when their corresponding sides and angles are equal. The **SAS** criterion says that two sides and the angle between them are enough; then every other pair of corresponding parts is equal too (**CPCTC**: corresponding parts of congruent triangles are congruent).\n\n**Isosceles triangle theorem:** if $AB = AC$, then $\\angle B = \\angle C$. Draw the bisector $AD$ of $\\angle A$. Then $AB = AC$ (given), $\\angle BAD = \\angle CAD$ (definition of a bisector) and $AD = AD$ (reflexive property), so $\\triangle ABD \\cong \\triangle ACD$ by SAS, and $\\angle B = \\angle C$ by CPCTC.",
        "两个三角形的对应边、对应角都相等时，称它们**全等**（$\\cong$）。**SAS**（边角边）判定说：两边及其夹角对应相等就足够了；这时其余各组对应部分也都相等（**全等三角形的对应部分相等**）。\n\n**等腰三角形定理**：若 $AB = AC$，则 $\\angle B = \\angle C$。作 $\\angle A$ 的平分线 $AD$。则 $AB = AC$（已知），$\\angle BAD = \\angle CAD$（角平分线的定义），$AD = AD$（自反性），所以由 SAS 得 $\\triangle ABD \\cong \\triangle ACD$，再由对应部分相等得 $\\angle B = \\angle C$。",
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 0), congruencePool),
    },
    {
      id: "proving-the-converse",
      title: t("The converse", "逆定理"),
      explanation: t(
        "**Converse:** if $\\angle B = \\angle C$, then $AB = AC$. Draw the bisector $AD$ again. Now the equal parts are $\\angle B = \\angle C$, $\\angle BAD = \\angle CAD$ and the common side $AD$, which is not between the two angles. The **AAS** criterion (two angles and a side not between them) gives $\\triangle ABD \\cong \\triangle ACD$, and CPCTC gives $AB = AC$.",
        "**逆定理**：若 $\\angle B = \\angle C$，则 $AB = AC$。同样作角平分线 $AD$。这时相等的部分是 $\\angle B = \\angle C$、$\\angle BAD = \\angle CAD$ 和公共边 $AD$，而 $AD$ 不在这两个角之间。由 **AAS**（角角边）判定得 $\\triangle ABD \\cong \\triangle ACD$，再由对应部分相等得 $AB = AC$。",
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 1), congruencePool),
    },
    {
      id: "the-bisector-of-the-vertex-angle",
      title: t("The bisector of the vertex angle", "顶角的平分线"),
      explanation: t(
        "The same congruence $\\triangle ABD \\cong \\triangle ACD$ gives more. By CPCTC, $BD = CD$, so $D$ is the midpoint of $BC$, and $\\angle ADB = \\angle ADC$. These two angles form a linear pair, so they add up to $180^\\circ$; being equal, each is $90^\\circ$.\n\nSo the bisector of the vertex angle of an isosceles triangle is the perpendicular bisector of its base.",
        "同一个全等 $\\triangle ABD \\cong \\triangle ACD$ 还能得到更多结论。由对应部分相等，$BD = CD$，所以 $D$ 是 $BC$ 的中点；并且 $\\angle ADB = \\angle ADC$。这两个角是邻补角，和为 $180^\\circ$；它们又相等，所以各是 $90^\\circ$。\n\n所以等腰三角形顶角的平分线是底边的垂直平分线。",
      ),
      generate: (rng) => proofProblem(rng, isoscelesTheoremProof(rng, 2), congruencePool),
    },
    {
      id: "using-the-isosceles-triangle-theorems",
      title: t("Using the theorems", "运用定理"),
      explanation: t(
        "Equal angles give equal opposite sides, and equal sides give equal opposite angles. If $\\angle B = \\angle C$, $AB = 3x + 2$ and $AC = 5x - 8$, then $3x + 2 = 5x - 8$, so $x = 5$ and $AB = 17$.\n\nIf $AB = AC$, $\\angle B = (2x + 10)^\\circ$ and $\\angle C = (3x - 15)^\\circ$, then $x = 25$, each base angle is $60^\\circ$, and $\\angle A = 180^\\circ - 120^\\circ = 60^\\circ$.",
        "等角对等边，等边对等角。若 $\\angle B = \\angle C$，$AB = 3x + 2$，$AC = 5x - 8$，则 $3x + 2 = 5x - 8$，所以 $x = 5$，$AB = 17$。\n\n若 $AB = AC$，$\\angle B = (2x + 10)^\\circ$，$\\angle C = (3x - 15)^\\circ$，则 $x = 25$，每个底角是 $60^\\circ$，$\\angle A = 180^\\circ - 120^\\circ = 60^\\circ$。",
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
                solution: t(
                  `Sides opposite equal angles are equal, so $AB = AC$:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}Then $AB = ${p === 1 ? "" : p}(${x})${d1 > 0 ? ` + ${d1}` : ` - ${-d1}`} = ${len}$.`,
                  `等角对等边，所以 $AB = AC$：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}于是 $AB = ${p === 1 ? "" : p}(${x})${d1 > 0 ? ` + ${d1}` : ` - ${-d1}`} = ${len}$。`,
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
              solution: t(
                `Angles opposite equal sides are equal, so $\\angle B = \\angle C$:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `x = ${x}`)}Each base angle is $${base}^\\circ$, so $\\angle A = 180^\\circ - 2 \\cdot ${base}^\\circ = ${apex}^\\circ$.`,
                `等边对等角，所以 $\\angle B = \\angle C$：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `x = ${x}`)}每个底角是 $${base}^\\circ$，所以 $\\angle A = 180^\\circ - 2 \\cdot ${base}^\\circ = ${apex}^\\circ$。`,
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

/** mediansFigure draws a triangle with its three medians dashed and the centroid marked; M labels the midpoint of BC. */
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

export const mediansAndCentroids: TopicDef = {
  id: "medians-and-centroids",
  title: t("Medians and Centroids of Triangles", "三角形的中线与重心"),
  summary: t(
    "Use medians, the centroid ratio 2 : 1 and the centroid formula to find lengths and coordinates.",
    "利用中线、重心分中线 2 : 1 的性质和重心坐标公式求长度与坐标。",
  ),
  prerequisites: ["the-coordinate-plane", "equations-with-parentheses"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.2 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
    { topic: "the-coordinate-plane", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.10", "CCSS.HSG.GPE.B.4"],
  knowledgePoints: [
    {
      id: "medians",
      title: t("Medians", "中线"),
      explanation: t(
        "A **median** of a triangle joins a vertex to the midpoint of the opposite side. If $AM$ is a median of $\\triangle ABC$, then $M$ is the midpoint of $BC$, so $BM = MC$ and $BC = 2 \\cdot BM$.\n\nIf $BM = 2x + 3$ and $MC = 4x - 5$, then $2x + 3 = 4x - 5$, so $x = 4$, $BM = 11$ and $BC = 22$.",
        "三角形的**中线**是连接一个顶点和对边中点的线段。若 $AM$ 是 $\\triangle ABC$ 的中线，则 $M$ 是 $BC$ 的中点，所以 $BM = MC$，$BC = 2 \\cdot BM$。\n\n若 $BM = 2x + 3$，$MC = 4x - 5$，则 $2x + 3 = 4x - 5$，所以 $x = 4$，$BM = 11$，$BC = 22$。",
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
          return {
            ...numberProblem({
              prompt: t(
                `$AM$ is a median of $\\triangle ABC$. Find the length of $BC$.`,
                `$AM$ 是 $\\triangle ABC$ 的中线。求 $BC$ 的长。`,
              ),
              answer: 2 * len,
              form: "integer",
              wrong: [len, x, 2 * x],
              solution: t(
                `$M$ is the midpoint of $BC$, so $BM = MC$:${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}So $BM = MC = ${len}$ and $BC = 2 \\cdot ${len} = ${2 * len}$.`,
                `$M$ 是 $BC$ 的中点，所以 $BM = MC$：${chain(`${linear(p, d1)} = ${linear(r, d2)}`, `${linear(p - r, 0)} = ${d2 - d1}`, `x = ${x}`)}所以 $BM = MC = ${len}$，$BC = 2 \\cdot ${len} = ${2 * len}$。`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points: [pa, pb, pc] },
                { kind: "segment", a: pa, b: pm, dashed: true, accent: true },
                { kind: "ticks", a: pb, b: pm, count: 1 },
                { kind: "ticks", a: pm, b: pc, count: 1 },
                { kind: "side", a: pm, b: pb, text: plain(p, d1) },
                { kind: "side", a: pc, b: pm, text: plain(r, d2) },
                ...names([pa, pb, pc], "ABC"),
                { kind: "label", at: pm, text: "M", dir: "n", italic: true },
              ],
              `Triangle ABC with median AM; BM = ${plain(p, d1)} and MC = ${plain(r, d2)}.`,
              `三角形 ABC，中线 AM；BM = ${plain(p, d1)}，MC = ${plain(r, d2)}。`,
            ),
          };
        }
      },
    },
    {
      id: "the-centroid-theorem",
      title: t("The centroid theorem", "重心定理"),
      explanation: t(
        "The three medians of a triangle meet at one point, the **centroid** $G$. The centroid is two thirds of the way along each median from the vertex:\n\n$$AG = 2 \\cdot GM, \\qquad AM = 3 \\cdot GM, \\qquad AG = \\frac{2}{3} AM.$$\n\nIf $AM = 18$, then $AG = 12$ and $GM = 6$. If $AG = 3x + 1$ and $GM = x + 4$, then $3x + 1 = 2(x + 4)$, so $x = 7$.",
        "三角形的三条中线交于一点，叫**重心** $G$。重心在每条中线上距顶点三分之二处：\n\n$$AG = 2 \\cdot GM, \\qquad AM = 3 \\cdot GM, \\qquad AG = \\frac{2}{3} AM.$$\n\n若 $AM = 18$，则 $AG = 12$，$GM = 6$。若 $AG = 3x + 1$，$GM = x + 4$，则 $3x + 1 = 2(x + 4)$，所以 $x = 7$。",
      ),
      generate(rng) {
        const pts = scalene(rng);
        const fig = figure(
          mediansMarks(pts, "ABCMG"),
          "Triangle ABC with its three medians meeting at the centroid G; AM is the median from A.",
          "三角形 ABC 的三条中线交于重心 G；AM 是从 A 出发的中线。",
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
                solution: t(
                  `The centroid makes $AG = 2 \\cdot GM$:${chain(`${linear(p, qd)} = 2(${linear(r, s)})`, `${linear(p, qd)} = ${linear(2 * r, 2 * s)}`, `${linear(p - 2 * r, 0)} = ${2 * s - qd}`, `x = ${x}`)}`,
                  `重心满足 $AG = 2 \\cdot GM$：${chain(`${linear(p, qd)} = 2(${linear(r, s)})`, `${linear(p, qd)} = ${linear(2 * r, 2 * s)}`, `${linear(p - 2 * r, 0)} = ${2 * s - qd}`, `x = ${x}`)}`,
                ),
              }),
              figure: fig,
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
        return {
          ...numberProblem({
            prompt: t(
              `$G$ is the centroid of $\\triangle ABC$ and $${given[0]} = ${given[1]}$. Find $${askName}$.`,
              `$G$ 是 $\\triangle ABC$ 的重心，$${given[0]} = ${given[1]}$。求 $${askName}$。`,
            ),
            answer,
            form: "integer",
            wrong: [given[1], intOr(given[1], 2, given[1] + 1), 2 * given[1], intOr(2 * given[1], 3, 3 * given[1])],
            solution: t(
              `The centroid divides the median in the ratio $AG : GM = 2 : 1$, so $GM$ is one third of $AM$:${steps(`GM = ${gm}, \\qquad AG = ${ag}, \\qquad AM = ${am}`)}`,
              `重心把中线分成 $AG : GM = 2 : 1$，所以 $GM$ 是 $AM$ 的三分之一：${steps(`GM = ${gm}, \\qquad AG = ${ag}, \\qquad AM = ${am}`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "coordinates-of-the-centroid",
      title: t("Coordinates of the centroid", "重心的坐标"),
      explanation: t(
        "The centroid of the triangle with vertices $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$ is the average of the vertices:\n\n$$G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right).$$\n\nFor $A(1, 2)$, $B(7, -1)$, $C(4, 5)$: $G = \\left(\\frac{12}{3}, \\frac{6}{3}\\right) = (4, 2)$.",
        "顶点为 $(x_1, y_1)$、$(x_2, y_2)$、$(x_3, y_3)$ 的三角形的重心是三个顶点的平均：\n\n$$G = \\left(\\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3}\\right).$$\n\n对于 $A(1, 2)$、$B(7, -1)$、$C(4, 5)$：$G = \\left(\\frac{12}{3}, \\frac{6}{3}\\right) = (4, 2)$。",
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
            solution: t(
              `Average the coordinates:${steps(`G = \\left(\\frac{${sx}}{3}, \\frac{${sy}}{3}\\right) = (${g[0]!.toLatex()}, ${g[1]!.toLatex()})`)}`,
              `把坐标分别取平均：${steps(`G = \\left(\\frac{${sx}}{3}, \\frac{${sy}}{3}\\right) = (${g[0]!.toLatex()}, ${g[1]!.toLatex()})`)}`,
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
  return {
    given: t(`$${A}${B} = ${A}${C}$, and $${M}$ is the midpoint of $${B}${C}$`, `$${A}${B} = ${A}${C}$，$${M}$ 是 $${B}${C}$ 的中点`),
    prove: m(`${A}${M} \\perp ${B}${C}`),
    steps: [
      { s: m(`${A}${B} = ${A}${C}`), r: "given" },
      {
        s: m(`${B}${M} = ${C}${M}`),
        r: "midpoint",
        alts: [m(`${B}${M} = ${A}${M}`), m(`\\angle ${B}${A}${M} = \\angle ${C}${A}${M}`), m(`${A}${B} = ${B}${C}`)],
      },
      { s: m(`${A}${M} = ${A}${M}`), r: "reflexive" },
      {
        s: m(`\\triangle ${A}${B}${M} \\cong \\triangle ${A}${C}${M}`),
        r: "sss",
        why: t("All three pairs of sides are equal.", "三组对应边都相等。"),
        alts: [
          m(`\\triangle ${A}${B}${M} \\cong \\triangle ${A}${M}${C}`),
          m(`\\triangle ${A}${B}${M} \\cong \\triangle ${C}${A}${M}`),
          m(`\\triangle ${A}${B}${C} \\cong \\triangle ${A}${C}${M}`),
        ],
      },
      { s: m(`\\angle ${A}${M}${B} = \\angle ${A}${M}${C}`), r: "cpctc" },
      { s: m(`\\angle ${A}${M}${B} + \\angle ${A}${M}${C} = 180^\\circ`), r: "linearPair" },
      {
        s: m(`\\angle ${A}${M}${B} = 90^\\circ`),
        r: "halving",
        why: t(`By step 6, $2\\angle ${A}${M}${B} = 180^\\circ$.`, `由第 6 步，$2\\angle ${A}${M}${B} = 180^\\circ$。`),
        alts: [m(`\\angle ${A}${M}${B} = 45^\\circ`), m(`\\angle ${A}${M}${B} = 180^\\circ`), m(`\\angle ${A}${M}${B} = \\angle ${B}`)],
      },
    ],
    figure: figure(
      isoMarks(f, `${A}${B}${C}${M}`, { ticks: true, baseTicks: true }),
      `Triangle ${A}${B}${C} with ${A}${B} = ${A}${C} and the median ${A}${M} to the base.`,
      `三角形 ${A}${B}${C}，${A}${B} = ${A}${C}，${A}${M} 是底边上的中线。`,
    ),
  };
}

export const proofsInvolvingMediansAndCentroids: TopicDef = {
  id: "proofs-involving-medians-and-centroids",
  title: t("Proofs Involving Medians and Centroids", "中线与重心的证明"),
  summary: t(
    "Derive the centroid as the point two thirds of the way along a median, prove facts about medians, and use medians to split areas.",
    "推出重心是中线上三分之二处的点，证明有关中线的结论，并用中线分割面积。",
  ),
  prerequisites: ["medians-and-centroids", "proofs-involving-isosceles-triangles", "area-of-triangles"],
  encompasses: [
    { topic: "medians-and-centroids", weight: 0.4 },
    { topic: "area-of-triangles", weight: 0.3 },
    { topic: "proofs-involving-isosceles-triangles", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.CO.C.10", "CCSS.HSG.GPE.B.6"],
  knowledgePoints: [
    {
      id: "the-centroid-on-a-median",
      title: t("The centroid on a median", "中线上的重心"),
      explanation: t(
        "The centroid $G$ lies on the median $AM$, two thirds of the way from $A$ to $M$. In coordinates, move from $A$ two thirds of the change to $M$:\n\n$$G = A + \\frac{2}{3}(M - A) = \\frac{A + 2M}{3}.$$\n\nWith $A(2, 9)$ and $M(5, 3)$: $G = \\left(\\frac{2 + 10}{3}, \\frac{9 + 6}{3}\\right) = (4, 5)$. Since $M$ is the average of $B$ and $C$, $A + 2M = A + B + C$: this is why the centroid is the average of the vertices. Going backwards, $M = \\frac{3G - A}{2}$.",
        "重心 $G$ 在中线 $AM$ 上，从 $A$ 到 $M$ 的三分之二处。用坐标表示，就是从 $A$ 出发，走完到 $M$ 的变化量的三分之二：\n\n$$G = A + \\frac{2}{3}(M - A) = \\frac{A + 2M}{3}.$$\n\n若 $A(2, 9)$，$M(5, 3)$：$G = \\left(\\frac{2 + 10}{3}, \\frac{9 + 6}{3}\\right) = (4, 5)$。因为 $M$ 是 $B$ 和 $C$ 的平均，$A + 2M = A + B + C$：这就是重心等于三个顶点平均值的原因。反过来，$M = \\frac{3G - A}{2}$。",
      ),
      generate(rng) {
        for (;;) {
          const a = [rng.int(-9, 9), rng.int(-9, 9)] as const;
          const mm = [rng.int(-9, 9), rng.int(-9, 9)] as const;
          if (a[0] === mm[0] && a[1] === mm[1]) continue;
          const g = [q(a[0] + 2 * mm[0], 3), q(a[1] + 2 * mm[1], 3)];
          const pt = (p: readonly (number | Q)[]) => `(${p.map((v) => (v instanceof Q ? v.toLatex() : `${v}`)).join(", ")})`;
          if (rng.bool(0.6)) {
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
              solution: t(
                `$G$ is two thirds of the way from $A$ to $M$:${steps(`G = \\left(\\frac{${a[0]} + 2(${mm[0]})}{3}, \\frac{${a[1]} + 2(${mm[1]})}{3}\\right) = ${pt(g)}`)}`,
                `$G$ 在从 $A$ 到 $M$ 的三分之二处：${steps(`G = \\left(\\frac{${a[0]} + 2(${mm[0]})}{3}, \\frac{${a[1]} + 2(${mm[1]})}{3}\\right) = ${pt(g)}`)}`,
              ),
            });
          }
          const gi = [rng.int(-6, 6), rng.int(-6, 6)] as const;
          if (gi[0] === a[0] && gi[1] === a[1]) continue;
          const mBack = [q(3 * gi[0] - a[0], 2), q(3 * gi[1] - a[1], 2)];
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
            solution: t(
              `Since $G = \\frac{A + 2M}{3}$, we have $M = \\frac{3G - A}{2}$:${steps(`M = \\left(\\frac{3(${gi[0]}) - (${a[0]})}{2}, \\frac{3(${gi[1]}) - (${a[1]})}{2}\\right) = ${pt(mBack)}`)}`,
              `由 $G = \\frac{A + 2M}{3}$ 得 $M = \\frac{3G - A}{2}$：${steps(`M = \\left(\\frac{3(${gi[0]}) - (${a[0]})}{2}, \\frac{3(${gi[1]}) - (${a[1]})}{2}\\right) = ${pt(mBack)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "the-median-of-an-isosceles-triangle",
      title: t("The median of an isosceles triangle", "等腰三角形底边上的中线"),
      explanation: t(
        "In an isosceles triangle with $AB = AC$, let $M$ be the midpoint of the base $BC$. Then $AB = AC$ (given), $BM = CM$ (definition of a midpoint) and $AM = AM$ (reflexive property), so $\\triangle ABM \\cong \\triangle ACM$ by the **SSS** criterion: three pairs of equal sides.\n\nBy CPCTC, $\\angle AMB = \\angle AMC$; they form a linear pair, so each is $90^\\circ$. The median to the base is perpendicular to the base.",
        "在 $AB = AC$ 的等腰三角形中，设 $M$ 为底边 $BC$ 的中点。则 $AB = AC$（已知），$BM = CM$（中点的定义），$AM = AM$（自反性），所以由 **SSS**（边边边）判定，$\\triangle ABM \\cong \\triangle ACM$：三组边对应相等。\n\n由对应部分相等，$\\angle AMB = \\angle AMC$；它们是邻补角，所以各是 $90^\\circ$。底边上的中线垂直于底边。",
      ),
      generate: (rng) => proofProblem(rng, medianIsoscelesProof(rng), congruencePool),
    },
    {
      id: "medians-and-area",
      title: t("Medians and area", "中线与面积"),
      explanation: t(
        "A median $AM$ splits $\\triangle ABC$ into $\\triangle ABM$ and $\\triangle ACM$. Their bases $BM$ and $CM$ are equal and they share the height from $A$, so they have **equal areas**: each is half of the whole.\n\nThe three medians split the triangle into six small triangles of equal area. So each of $\\triangle GBC$, $\\triangle GCA$, $\\triangle GAB$ is one third of the area, and a triangle such as $\\triangle GBM$ is one sixth. If $\\triangle ABC$ has area $60$: $\\triangle ABM$ has $30$, $\\triangle GBC$ has $20$, $\\triangle GBM$ has $10$.",
        "中线 $AM$ 把 $\\triangle ABC$ 分成 $\\triangle ABM$ 和 $\\triangle ACM$。它们的底 $BM$ 与 $CM$ 相等，又有从 $A$ 出发的同一条高，所以**面积相等**：各是整个三角形的一半。\n\n三条中线把三角形分成面积相等的六个小三角形。所以 $\\triangle GBC$、$\\triangle GCA$、$\\triangle GAB$ 各占总面积的三分之一，而像 $\\triangle GBM$ 这样的三角形占六分之一。若 $\\triangle ABC$ 的面积是 $60$：$\\triangle ABM$ 是 $30$，$\\triangle GBC$ 是 $20$，$\\triangle GBM$ 是 $10$。",
      ),
      keyPrerequisites: ["area-of-triangles"],
      generate(rng) {
        const pts = scalene(rng);
        const fig = figure(
          mediansMarks(pts, "ABCMG"),
          "Triangle ABC with its three medians meeting at the centroid G; M is the midpoint of BC.",
          "三角形 ABC 的三条中线交于重心 G；M 是 BC 的中点。",
        );
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
            ...choiceProblem({
              prompt: t(
                "$AM$ is a median of $\\triangle ABC$. Why do $\\triangle ABM$ and $\\triangle ACM$ have equal areas?",
                "$AM$ 是 $\\triangle ABC$ 的中线。为什么 $\\triangle ABM$ 与 $\\triangle ACM$ 的面积相等？",
              ),
              options: shuffled,
              correct: shuffled.indexOf(options[0]!),
              solution: t(
                "The area of a triangle is half a base times its height. $BM = CM$ because $M$ is a midpoint, and both triangles have the height from $A$ to the line $BC$. In general the two triangles are not congruent, and $AM$ is neither a bisector of the angle nor perpendicular to $BC$.",
                "三角形面积等于底乘高的一半。$M$ 是中点，所以 $BM = CM$，而两个三角形都以从 $A$ 到直线 $BC$ 的距离为高。一般情况下这两个三角形并不全等，$AM$ 也既不平分角，也不垂直于 $BC$。",
              ),
            }),
            figure: fig,
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
        return {
          ...numberProblem({
            prompt: t(
              `$G$ is the centroid of $\\triangle ABC$, which has an area of $${area}$. Find the area of $${name}$.`,
              `$G$ 是 $\\triangle ABC$ 的重心，$\\triangle ABC$ 的面积是 $${area}$。求 $${name}$ 的面积。`,
            ),
            answer,
            form: "integer",
            wrong: [area / 2, area / 3, area / 6, area / 4],
            solution: t(
              `The medians split $\\triangle ABC$ into six triangles of equal area, $${area} \\div 6 = ${area / 6}$ each. $${name}$ is made of ${answer / (area / 6)} of them, ${part.en} of the whole:${steps(`${answer}`)}`,
              `三条中线把 $\\triangle ABC$ 分成六个面积相等的三角形，每个面积为 $${area} \\div 6 = ${area / 6}$。$${name}$ 由其中 ${answer / (area / 6)} 个组成，占总面积的${part["zh-CN"]}：${steps(`${answer}`)}`,
            ),
          }),
          figure: fig,
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
