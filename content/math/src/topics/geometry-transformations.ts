import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type PlaneView, type Point, paren, plane, Q, sketch } from "@ga/subject-math";

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

/** compassOf is the compass direction nearest to d degrees. */
function compassOf(d: number): Compass {
  const names: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return names[Math.round((((d % 360) + 360) % 360) / 45) % 8]!;
}

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
const angleTex = (c: number, d: number) => `(${linear(c, d)})^\\circ`;

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°". */
const angleLabel = (c: number, d: number) => `(${plain(c, d)})°`;

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** letterSets are vertex names for figures, so that problems vary in more than numbers. */
const letterSets: readonly string[] = ["ABCD", "PQRS", "JKLM", "UVWX", "DEFG", "KLMN", "RSTU", "WXYZ"];

type XY = readonly [number, number];

/** QP is a point with rational coordinates. */
type QP = readonly [Q, Q];

/** pl writes a point with integer or rational coordinates: "(3, -2)". */
const pl = (p: readonly (number | Q)[]) => pointLatex(p);

/** z turns −0 into 0. */
const z = (n: number) => n + 0;

/** scaled multiplies a point by k. */
const scaled = (k: Q, p: XY): QP => [k.mul(Q.of(p[0])), k.mul(Q.of(p[1]))];

/** times writes k·v for a rule: "3x", "\frac{1}{2}y", "y" for k = 1. */
const times = (k: Q, v: string) => (k.eq(Q.one) ? v : `${k.toLatex()}${v}`);

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

/** smallScales are scale factors that keep images of grid points small. */
const smallScales: readonly Q[] = [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3), Q.of(3, 2), Q.of(2, 3)];

/** multipleOf picks a nonzero multiple of d no larger than lim in absolute value (at least ±d). */
function multipleOf(rng: Rng, d: number, lim: number): number {
  return d * rng.nonZero(-Math.max(1, Math.floor(lim / d)), Math.max(1, Math.floor(lim / d)));
}

/** outline draws a polygon in the plane without vertex names. */
function outline(pts: readonly XY[], accent = true): PlaneMark[] {
  return [
    ...pts.map((p, i): PlaneMark => ({ kind: "segment", a: p, b: pts[(i + 1) % pts.length]!, accent })),
    ...pts.map((p): PlaneMark => ({ kind: "point", at: p, accent })),
  ];
}

/** named draws a polygon in the plane with its vertices named outward from its center. */
function named(pts: readonly XY[], names: readonly string[]): PlaneMark[] {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [
    ...pts.map((p, i): PlaneMark => ({ kind: "segment", a: p, b: pts[(i + 1) % pts.length]!, accent: true })),
    ...pts.map(
      (p, i): PlaneMark => ({
        kind: "point",
        at: p,
        label: names[i]!,
        dir: compassOf((Math.atan2(p[1] - cy, p[0] - cx) * 180) / Math.PI),
        accent: true,
      }),
    ),
  ];
}

// ─── Proofs ─────────────────────────────────────────────────────────────────

/** reasons are the justifications used in the proofs of this file. */
const reasons = {
  given: t("Given", "已知"),
  angleAdd: t("Angle Addition Postulate", "角的加法公设"),
  linearPair: t("Linear Pair Postulate", "邻补角公设"),
  corr: t("Corresponding Angles Postulate", "同位角公设"),
  vertical: t("Vertical Angles Theorem", "对顶角定理"),
  congSupp: t("Congruent Supplements Theorem", "同角（或等角）的补角相等"),
  congComp: t("Congruent Complements Theorem", "同角（或等角）的余角相等"),
  rightCong: t("Right Angles Congruence Theorem", "直角相等定理"),
  transitive: t("Transitive Property of Congruence", "全等的传递性"),
  subst: t("Substitution Property of Equality", "等量代换"),
  subtraction: t("Subtraction Property of Equality", "等式的减法性质"),
  defCong: t("Definition of congruent angles", "角全等的定义"),
  defRight: t("Definition of right angle", "直角的定义"),
  defComp: t("Definition of complementary angles", "余角的定义"),
  defPerp: t("Definition of perpendicular lines", "垂直的定义"),
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
  vertical: t("vertical angles are congruent", "对顶角全等"),
  congSupp: t(
    "two angles supplementary to the same angle (or to congruent angles) are congruent",
    "与同一个角（或相等的角）互补的两个角全等",
  ),
  congComp: t(
    "two angles complementary to the same angle (or to congruent angles) are congruent",
    "与同一个角（或相等的角）互余的两个角全等",
  ),
  rightCong: t("all right angles are congruent", "所有直角都全等"),
  transitive: t("two figures congruent to the same figure are congruent to each other", "与同一个图形全等的两个图形彼此全等"),
  subst: t("a quantity may be replaced by an equal quantity", "一个量可以用与它相等的量替换"),
  subtraction: t("subtracting the same number from both sides of an equation keeps it true", "等式两边同减去一个数，等式仍成立"),
  defCong: t("congruent angles have equal measures, and angles with equal measures are congruent", "全等的角度数相等，度数相等的角全等"),
  defRight: t(
    "a right angle measures $90^\\circ$, and an angle of $90^\\circ$ is a right angle",
    "直角是 $90^\\circ$，$90^\\circ$ 的角是直角",
  ),
  defComp: t(
    "two angles are complementary exactly when their measures add up to $90^\\circ$",
    "两个角互余当且仅当它们的度数之和是 $90^\\circ$",
  ),
  defPerp: t(
    "perpendicular lines meet at right angles, and lines that meet at a right angle are perpendicular",
    "垂直的直线相交成直角，相交成直角的直线互相垂直",
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
    .map((_, i) => i)
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

/** proofKp builds a knowledge point practicing both the reasons and the statements of the proofs build makes. */
function proofKp(id: string, title: Text, explanation: Text, build: (rng: Rng) => Proof): KnowledgePointDef {
  return {
    id,
    title,
    explanation,
    generate(rng) {
      const p = build(rng);
      return proofProblem(rng, p, rng.bool() ? "r" : "s");
    },
  };
}

// ─── Further Proving Perpendicular Line Theorems ────────────────────────────
//
// Two lines ℓ and t cross at right angles; the angles are numbered 1 (upper
// left), 2 (upper right), 3 (lower left) and 4 (lower right) with ℓ drawn
// horizontally before the figure is turned.

/** quadrantMid is the direction of the middle of each numbered angle. */
const quadrantMid: Record<number, number> = { 1: 135, 2: 45, 3: 225, 4: 315 };

/** vert is the angle vertical to angle n. */
const vert = (n: number) => 5 - n;

/** acrossT is the angle forming a linear pair with angle n across t (1 and 2, 3 and 4). */
const acrossT = (n: number) => (n % 2 === 1 ? n + 1 : n - 1);

/** acrossLine is the angle forming a linear pair with angle n across ℓ (1 and 3, 2 and 4). */
const acrossLine = (n: number) => (n <= 2 ? n + 2 : n - 2);

/** crossFigure draws lines ℓ and t crossing at right angles, turned by phi degrees. */
function crossFigure(
  phi: number,
  o: { numbers: boolean; right?: number; label?: readonly [number, string] },
  en: string,
  zh: string,
): Figure {
  const r = (p: Point) => turn(p, phi);
  const c: Point = [0, 0];
  const marks: Mark[] = [
    { kind: "segment", a: r([-4, 0]), b: r([4, 0]) },
    { kind: "label", at: r([4, 0]), text: "ℓ", dir: compassOf(phi) },
    { kind: "segment", a: r([0, -4]), b: r([0, 4]) },
    { kind: "label", at: r([0, 4]), text: "t", dir: compassOf(phi + 90), italic: true },
  ];
  if (o.right !== undefined) {
    const mid = quadrantMid[o.right]!;
    marks.push({ kind: "right", vertex: c, from: r(dir(mid - 45, 3)), to: r(dir(mid + 45, 3)) });
  }
  if (o.label) {
    const mid = quadrantMid[o.label[0]]!;
    marks.push({ kind: "arc", vertex: c, from: r(dir(mid - 45, 3)), to: r(dir(mid + 45, 3)), label: o.label[1], accent: true });
  }
  if (o.numbers) {
    for (const n of [1, 2, 3, 4]) {
      const mid = quadrantMid[n]!;
      marks.push({ kind: "label", at: dir(mid + phi, 1.1), text: String(n), dir: compassOf(mid + phi) });
    }
  }
  return figure(marks, en, zh);
}

const isRight = (n: number | string) => t(`$\\angle ${n}$ is a right angle`, `$\\angle ${n}$ 是直角`);
const measure = (n: number | string, v: number | string) => same(`$m\\angle ${n} = ${v}^\\circ$`);
const lt = same("$\\ell \\perp t$");

/** numberedCross draws the numbered crossing of perpendicular lines ℓ and t, with a right angle marked at angle a. */
function numberedCross(rng: Rng, a: number): Figure {
  return crossFigure(
    rng.int(-30, 30),
    { numbers: true, right: a },
    `Lines ℓ and t crossing at a right angle, with the four angles numbered 1 to 4 and angle ${a} marked as a right angle.`,
    `直线 ℓ 与 t 垂直相交，四个角编号为 1 到 4，∠${a} 标为直角。`,
  );
}

/** linearPairRightProof proves that the angle forming a linear pair with a right angle is a right angle. */
function linearPairRightProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const b = rng.bool() ? acrossT(a) : acrossLine(a);
  return {
    given: lt,
    prove: isRight(b),
    steps: [
      { s: lt, r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        wrong: [
          t(`$\\angle ${a}$ is an acute angle`, `$\\angle ${a}$ 是锐角`),
          t(`$\\angle ${a}$ is an obtuse angle`, `$\\angle ${a}$ 是钝角`),
          t(`$\\angle ${a}$ is a straight angle`, `$\\angle ${a}$ 是平角`),
        ],
      },
      { s: measure(a, 90), r: "defRight", wrong: [measure(a, 180), measure(a, 45), measure(a, 360)] },
      {
        s: same(`$m\\angle ${a} + m\\angle ${b} = 180^\\circ$`),
        r: "linearPair",
        wrong: [
          same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
          same(`$m\\angle ${a} + m\\angle ${b} = 360^\\circ$`),
          same(`$m\\angle ${a} - m\\angle ${b} = 180^\\circ$`),
        ],
      },
      {
        s: same(`$90^\\circ + m\\angle ${b} = 180^\\circ$`),
        r: "subst",
        wrong: [
          same(`$90^\\circ + m\\angle ${b} = 90^\\circ$`),
          same(`$180^\\circ + m\\angle ${b} = 90^\\circ$`),
          same(`$90^\\circ \\cdot m\\angle ${b} = 180^\\circ$`),
        ],
      },
      { s: measure(b, 90), r: "subtraction", wrong: [measure(b, 270), measure(b, 180), measure(b, 2)] },
      { s: isRight(b), r: "defRight" },
    ],
    figure: numberedCross(rng, a),
    distract: ["vertical", "rightCong", "congSupp", "defComp", "angleAdd", "defCong"],
  };
}

/** verticalRightProof proves that the angle vertical to a right angle is a right angle. */
function verticalRightProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const c = vert(a);
  return {
    given: lt,
    prove: isRight(c),
    steps: [
      { s: lt, r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        wrong: [
          t(`$\\angle ${a}$ is an acute angle`, `$\\angle ${a}$ 是锐角`),
          t(`$\\angle ${a}$ is an obtuse angle`, `$\\angle ${a}$ 是钝角`),
          t(`$\\angle ${a}$ is a straight angle`, `$\\angle ${a}$ 是平角`),
        ],
      },
      {
        s: same(`$\\angle ${a} \\cong \\angle ${c}$`),
        r: "vertical",
        wrong: [
          t(`$\\angle ${a}$ and $\\angle ${c}$ form a linear pair`, `$\\angle ${a}$ 与 $\\angle ${c}$ 是邻补角`),
          t(`$\\angle ${a}$ and $\\angle ${c}$ are complementary`, `$\\angle ${a}$ 与 $\\angle ${c}$ 互余`),
          same(`$m\\angle ${a} = 2m\\angle ${c}$`),
        ],
      },
      {
        s: same(`$m\\angle ${c} = m\\angle ${a}$`),
        r: "defCong",
        wrong: [
          same(`$m\\angle ${c} = 2m\\angle ${a}$`),
          same(`$m\\angle ${c} + m\\angle ${a} = 90^\\circ$`),
          same(`$m\\angle ${c} = 180^\\circ + m\\angle ${a}$`),
        ],
      },
      { s: measure(c, 90), r: "subst", wrong: [measure(c, 180), measure(c, 45), measure(c, 270)] },
      { s: isRight(c), r: "defRight" },
    ],
    figure: numberedCross(rng, a),
    distract: ["linearPair", "rightCong", "congSupp", "corr", "transitive", "subtraction"],
  };
}

/** Names are the four points of an angle figure: A and C on the perpendicular sides, B the vertex, D on the ray between. */
interface Names {
  readonly a: string;
  readonly b: string;
  readonly c: string;
  readonly d: string;
}

const pickNames = (rng: Rng): Names => {
  const s = rng.pick(letterSets);
  return { a: s[0]!, b: s[1]!, c: s[2]!, d: s[3]! };
};

/** splitAngleFigure draws rays BC (at base degrees), BD and BA (at base + 90°) from B, with optional labels for ∠ABD and ∠DBC. */
function splitAngleFigure(base: number, split: number, n: Names, labels?: readonly [string, string], right = false): Figure {
  const b: Point = [0, 0];
  const [pc, pd, pa] = [dir(base), dir(base + split), dir(base + 90)];
  const marks: Mark[] = [
    { kind: "segment", a: b, b: pa },
    { kind: "segment", a: b, b: pd },
    { kind: "segment", a: b, b: pc },
    { kind: "label", at: pa, text: n.a, dir: compassOf(base + 90), italic: true },
    { kind: "label", at: pd, text: n.d, dir: compassOf(base + split), italic: true },
    { kind: "label", at: pc, text: n.c, dir: compassOf(base), italic: true },
    { kind: "label", at: b, text: n.b, dir: compassOf(base + 225), italic: true },
  ];
  if (right) marks.push({ kind: "right", vertex: b, from: pc, to: pa });
  if (labels) {
    marks.push(
      { kind: "arc", vertex: b, from: pd, to: pa, label: labels[0], accent: true },
      { kind: "arc", vertex: b, from: pc, to: pd, label: labels[1], accent: true },
    );
  }
  const desc = `Rays ${n.b}${n.a}, ${n.b}${n.d} and ${n.b}${n.c} from ${n.b}, with ${n.b}${n.d} between the other two`;
  const descZh = `从 ${n.b} 出发的射线 ${n.b}${n.a}、${n.b}${n.d}、${n.b}${n.c}，${n.b}${n.d} 在另外两条之间`;
  return figure(
    marks,
    labels ? `${desc}; angle ${n.a}${n.b}${n.d} is marked ${labels[0]} and angle ${n.d}${n.b}${n.c} is marked ${labels[1]}.` : `${desc}.`,
    labels ? `${descZh}；∠${n.a}${n.b}${n.d} 标为 ${labels[0]}，∠${n.d}${n.b}${n.c} 标为 ${labels[1]}。` : `${descZh}。`,
  );
}

/** pickSplit picks the direction of the middle ray, clearly away from the bisector. */
const pickSplit = (rng: Rng) => rng.pick([rng.int(22, 38), rng.int(52, 68)]);

/** angleStatements are the statements about ∠ABD, ∠DBC and ∠ABC used in the proofs. */
function angleStatements(n: Names) {
  const abd = `${n.a}${n.b}${n.d}`;
  const dbc = `${n.d}${n.b}${n.c}`;
  const abc = `${n.a}${n.b}${n.c}`;
  const perpRays = same(`$\\overrightarrow{${n.b}${n.a}} \\perp \\overrightarrow{${n.b}${n.c}}$`);
  const complementary = t(`$\\angle ${abd}$ and $\\angle ${dbc}$ are complementary`, `$\\angle ${abd}$ 与 $\\angle ${dbc}$ 互余`);
  const sum = (v: string) => same(`$m\\angle ${abd} + m\\angle ${dbc} = ${v}$`);
  const addition = sum(`m\\angle ${abc}`);
  return {
    abd,
    dbc,
    abc,
    perpRays,
    complementary,
    sum,
    addition,
    wrongAddition: [
      same(`$m\\angle ${abd} + m\\angle ${abc} = m\\angle ${dbc}$`),
      same(`$m\\angle ${abd} = m\\angle ${dbc}$`),
      sum("180^\\circ"),
    ],
    wrongSum: [
      sum("180^\\circ"),
      same(`$m\\angle ${abd} - m\\angle ${dbc} = 90^\\circ$`),
      same(`$m\\angle ${abd} = 90^\\circ + m\\angle ${dbc}$`),
    ],
    wrongRightAbc: [
      isRight(abd),
      t(`$\\angle ${abc}$ is a straight angle`, `$\\angle ${abc}$ 是平角`),
      t(`$\\angle ${abc}$ is an acute angle`, `$\\angle ${abc}$ 是锐角`),
    ],
    wrongMeasureAbc: [measure(abc, 180), measure(abd, 90), measure(abc, 45)],
  };
}

/** perpendicularSidesProof proves that adjacent angles whose outer sides are perpendicular are complementary. */
function perpendicularSidesProof(rng: Rng): Proof {
  const n = pickNames(rng);
  const s = angleStatements(n);
  return {
    given: s.perpRays,
    prove: s.complementary,
    steps: [
      { s: s.perpRays, r: "given" },
      { s: isRight(s.abc), r: "defPerp", wrong: s.wrongRightAbc },
      { s: measure(s.abc, 90), r: "defRight", wrong: s.wrongMeasureAbc },
      { s: s.addition, r: "angleAdd", wrong: s.wrongAddition },
      { s: s.sum("90^\\circ"), r: "subst", wrong: s.wrongSum },
      { s: s.complementary, r: "defComp" },
    ],
    figure: splitAngleFigure(rng.int(-30, 30), pickSplit(rng), n, undefined, true),
    distract: ["linearPair", "congComp", "vertical", "defCong", "subtraction", "rightCong"],
  };
}

/** complementaryConverseProof proves that the outer sides of adjacent complementary angles are perpendicular. */
function complementaryConverseProof(rng: Rng): Proof {
  const n = pickNames(rng);
  const s = angleStatements(n);
  return {
    given: s.complementary,
    prove: s.perpRays,
    steps: [
      { s: s.complementary, r: "given" },
      { s: s.sum("90^\\circ"), r: "defComp", wrong: s.wrongSum },
      { s: s.addition, r: "angleAdd", wrong: s.wrongAddition },
      { s: measure(s.abc, 90), r: "subst", wrong: s.wrongMeasureAbc },
      { s: isRight(s.abc), r: "defRight", wrong: s.wrongRightAbc },
      { s: s.perpRays, r: "defPerp" },
    ],
    figure: splitAngleFigure(rng.int(-30, 30), pickSplit(rng), n),
    distract: ["linearPair", "congComp", "vertical", "defCong", "subtraction", "rightCong"],
  };
}

/** furtherProvingPerpendicularLineTheorems proves that perpendicular lines form four right angles and relates perpendicular sides to complementary angles. */
export const furtherProvingPerpendicularLineTheorems: TopicDef = {
  id: "further-proving-perpendicular-line-theorems",
  title: t("Further Proving Perpendicular Line Theorems", "进一步证明垂线的定理"),
  summary: t(
    "Prove that perpendicular lines form four right angles and that adjacent angles with perpendicular outer sides are complementary, and use these theorems to find unknown angles.",
    "证明垂直的直线形成四个直角，以及外侧两边互相垂直的相邻角互余，并用这些定理求未知角。",
  ),
  prerequisites: ["proving-perpendicular-line-theorems"],
  encompasses: [
    { topic: "proving-perpendicular-line-theorems", weight: 0.3 },
    { topic: "identifying-angle-postulates", weight: 0.2 },
    { topic: "complementary-and-supplementary-angles", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    proofKp(
      "perpendicular-lines-form-four-right-angles",
      t("Perpendicular lines form four right angles", "垂直的直线形成四个直角"),
      t(
        "**Theorem**: if two lines are perpendicular, all four angles they form are right angles. The definition of perpendicular lines gives one right angle; the others follow from linear pairs or vertical angles.\n\nGiven $\\ell \\perp t$, prove $\\angle 2$ is a right angle:\n\n1. $\\ell \\perp t$ — Given\n2. $\\angle 1$ is a right angle — Definition of perpendicular lines\n3. $m\\angle 1 = 90^\\circ$ — Definition of right angle\n4. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — Linear Pair Postulate\n5. $90^\\circ + m\\angle 2 = 180^\\circ$ — Substitution Property of Equality\n6. $m\\angle 2 = 90^\\circ$ — Subtraction Property of Equality\n7. $\\angle 2$ is a right angle — Definition of right angle\n\nFor the angle vertical to $\\angle 1$, use the Vertical Angles Theorem instead: $\\angle 1 \\cong \\angle 4$, so $m\\angle 4 = m\\angle 1 = 90^\\circ$.",
        "**定理**：若两条直线互相垂直，则它们形成的四个角都是直角。由垂直的定义得到一个直角；其余的由邻补角或对顶角推出。\n\n已知 $\\ell \\perp t$，求证 $\\angle 2$ 是直角：\n\n1. $\\ell \\perp t$ — 已知\n2. $\\angle 1$ 是直角 — 垂直的定义\n3. $m\\angle 1 = 90^\\circ$ — 直角的定义\n4. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — 邻补角公设\n5. $90^\\circ + m\\angle 2 = 180^\\circ$ — 等量代换\n6. $m\\angle 2 = 90^\\circ$ — 等式的减法性质\n7. $\\angle 2$ 是直角 — 直角的定义\n\n对于 $\\angle 1$ 的对顶角，改用对顶角定理：$\\angle 1 \\cong \\angle 4$，所以 $m\\angle 4 = m\\angle 1 = 90^\\circ$。",
      ),
      (rng) => (rng.bool() ? linearPairRightProof(rng) : verticalRightProof(rng)),
    ),
    proofKp(
      "perpendicular-sides-make-complementary-angles",
      t("Perpendicular sides make complementary angles", "两边垂直的相邻角互余"),
      t(
        "**Theorem**: if the outer sides of two adjacent angles are perpendicular, the angles are complementary.\n\nGiven $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ with $\\overrightarrow{BD}$ between them, prove $\\angle ABD$ and $\\angle DBC$ are complementary:\n\n1. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — Given\n2. $\\angle ABC$ is a right angle — Definition of perpendicular lines\n3. $m\\angle ABC = 90^\\circ$ — Definition of right angle\n4. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — Angle Addition Postulate\n5. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — Substitution Property of Equality\n6. $\\angle ABD$ and $\\angle DBC$ are complementary — Definition of complementary angles",
        "**定理**：若两个相邻角的外侧两边互相垂直，则这两个角互余。\n\n已知 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$，$\\overrightarrow{BD}$ 在它们之间，求证 $\\angle ABD$ 与 $\\angle DBC$ 互余：\n\n1. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — 已知\n2. $\\angle ABC$ 是直角 — 垂直的定义\n3. $m\\angle ABC = 90^\\circ$ — 直角的定义\n4. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — 角的加法公设\n5. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — 等量代换\n6. $\\angle ABD$ 与 $\\angle DBC$ 互余 — 余角的定义",
      ),
      perpendicularSidesProof,
    ),
    proofKp(
      "complementary-adjacent-angles-make-perpendicular-sides",
      t("Complementary adjacent angles make perpendicular sides", "互余的相邻角两边垂直"),
      t(
        "The converse also holds: **if two adjacent angles are complementary, their outer sides are perpendicular.** The proof runs the same steps the other way.\n\nGiven that $\\angle ABD$ and $\\angle DBC$ are complementary, prove $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$:\n\n1. $\\angle ABD$ and $\\angle DBC$ are complementary — Given\n2. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — Definition of complementary angles\n3. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — Angle Addition Postulate\n4. $m\\angle ABC = 90^\\circ$ — Substitution Property of Equality\n5. $\\angle ABC$ is a right angle — Definition of right angle\n6. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — Definition of perpendicular lines",
        "逆命题也成立：**若两个相邻角互余，则它们的外侧两边互相垂直。** 证明把同样的步骤倒过来。\n\n已知 $\\angle ABD$ 与 $\\angle DBC$ 互余，求证 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$：\n\n1. $\\angle ABD$ 与 $\\angle DBC$ 互余 — 已知\n2. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — 余角的定义\n3. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — 角的加法公设\n4. $m\\angle ABC = 90^\\circ$ — 等量代换\n5. $\\angle ABC$ 是直角 — 直角的定义\n6. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — 垂直的定义",
      ),
      complementaryConverseProof,
    ),
    {
      id: "finding-angles-with-perpendicular-lines",
      title: t("Finding angles with perpendicular lines", "用垂直关系求角"),
      explanation: t(
        "The theorems turn perpendicularity into equations:\n\n- Perpendicular lines form four right angles, so any one of the four angles measures $90^\\circ$.\n- If $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ and $\\overrightarrow{BD}$ lies between them, then $m\\angle ABD + m\\angle DBC = 90^\\circ$.\n\nIf $m\\angle ABD = (2x + 5)^\\circ$ and $m\\angle DBC = (3x - 15)^\\circ$, then $5x - 10 = 90$, so $5x = 100$ and $x = 20$.",
        "这些定理把垂直关系变成方程：\n\n- 垂直的直线形成四个直角，所以四个角中的任何一个都是 $90^\\circ$。\n- 若 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$，$\\overrightarrow{BD}$ 在它们之间，则 $m\\angle ABD + m\\angle DBC = 90^\\circ$。\n\n若 $m\\angle ABD = (2x + 5)^\\circ$，$m\\angle DBC = (3x - 15)^\\circ$，则 $5x - 10 = 90$，所以 $5x = 100$，$x = 20$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          for (;;) {
            const x = rng.int(3, 20);
            const m1 = rng.pick([rng.int(20, 38), rng.int(52, 70)]);
            const [c1, c2] = [rng.int(1, 5), rng.int(1, 5)];
            const d1 = m1 - c1 * x;
            const d2 = 90 - m1 - c2 * x;
            if (Math.abs(d1) > 40 || Math.abs(d2) > 40 || (d1 === 0 && d2 === 0)) continue;
            const n = pickNames(rng);
            const s = angleStatements(n);
            const [c, d] = [c1 + c2, d1 + d2];
            const term = (ci: number, di: number) => (di === 0 ? linear(ci, 0) : `(${linear(ci, di)})`);
            const lines = chain(
              `${term(c1, d1)} + ${term(c2, d2)} = 90`,
              `${linear(c, d)} = 90`,
              `${linear(c, 0)} = ${90 - d}`,
              `x = ${x}`,
            );
            return {
              ...numberProblem({
                prompt: t(
                  `In the figure, $\\overrightarrow{${n.b}${n.a}} \\perp \\overrightarrow{${n.b}${n.c}}$, $m\\angle ${s.abd} = ${angleTex(c1, d1)}$ and $m\\angle ${s.dbc} = ${angleTex(c2, d2)}$. Find $x$.`,
                  `如图，$\\overrightarrow{${n.b}${n.a}} \\perp \\overrightarrow{${n.b}${n.c}}$，$m\\angle ${s.abd} = ${angleTex(c1, d1)}$，$m\\angle ${s.dbc} = ${angleTex(c2, d2)}$。求 $x$。`,
                ),
                answer: x,
                solveFor: "x",
                wrong: [Q.of(180 - d, c), Q.of(90 + d, c), m1],
                solution: t(
                  `The outer sides are perpendicular, so the two angles are complementary:${lines}`,
                  `外侧两边互相垂直，所以两个角互余：${lines}`,
                ),
              }),
              figure: splitAngleFigure(rng.int(-20, 20), m1 > 45 ? 90 - m1 : 90 - m1, n, [angleLabel(c1, d1), angleLabel(c2, d2)]),
            };
          }
        }
        for (;;) {
          const x = rng.int(5, 30);
          const c = rng.int(2, 6);
          const d = 90 - c * x;
          if (d === 0 || Math.abs(d) > 60) continue;
          const a = rng.int(1, 4);
          const marked = rng.pick([1, 2, 3, 4].filter((k) => k !== a));
          const lines = chain(`${linear(c, d)} = 90`, `${linear(c, 0)} = ${90 - d}`, `x = ${x}`);
          return {
            ...numberProblem({
              prompt: t("Lines $\\ell$ and $t$ are perpendicular. Find $x$.", "直线 $\\ell$ 与 $t$ 互相垂直。求 $x$。"),
              answer: x,
              solveFor: "x",
              wrong: [Q.of(180 - d, c), Q.of(90 + d, c), 90 - d],
              solution: t(
                `Perpendicular lines form four right angles, so the marked angle measures $90^\\circ$:${lines}`,
                `垂直的直线形成四个直角，所以标出的角是 $90^\\circ$：${lines}`,
              ),
            }),
            figure: crossFigure(
              rng.int(-30, 30),
              { numbers: false, right: marked, label: [a, angleLabel(c, d)] },
              `Lines ℓ and t crossing, with one angle marked as a right angle and another angle marked ${angleLabel(c, d)}.`,
              `直线 ℓ 与 t 相交，一个角标为直角，另一个角标为 ${angleLabel(c, d)}。`,
            ),
          };
        }
      },
    },
  ],
};

// ─── Dilations in the Coordinate Plane ──────────────────────────────────────

/** dilationRule writes the rule of a dilation about the origin: (x, y) → (kx, ky). */
const dilationRule = (k: Q) => `(x, y) \\to (${times(k, "x")}, ${times(k, "y")})`;

/** pickScaledPoint picks a point whose coordinates are nonzero multiples of the denominator of k. */
function pickScaledPoint(rng: Rng, k: Q, lim = 8): XY {
  const d = Number(k.d);
  for (;;) {
    const p: XY = [multipleOf(rng, d, lim), multipleOf(rng, d, lim)];
    if (Math.abs(p[0]) !== Math.abs(p[1])) return p;
  }
}

/** scaleSteps writes the multiplication of both coordinates of p by k. */
const scaleSteps = (name: string, k: Q, p: XY) =>
  steps(`${name} = (${k.toLatex()} \\cdot ${paren(p[0])}, \\; ${k.toLatex()} \\cdot ${paren(p[1])}) = ${pl(scaled(k, p))}`);

/** dilationsOfFiguresInTheCoordinatePlane dilates points and figures in the coordinate plane about the origin and about other centers. */
export const dilationsOfFiguresInTheCoordinatePlane: TopicDef = {
  id: "dilations-of-figures-in-the-coordinate-plane",
  title: t("Dilations of Figures in the Coordinate Plane", "坐标平面中图形的位似"),
  summary: t(
    "Dilate points and figures about the origin with the rule (x, y) → (kx, ky), find scale factors from coordinates, and dilate about other centers.",
    "用规则 (x, y) → (kx, ky) 把点和图形以原点为中心作位似，由坐标求比例因子，并以其他点为中心作位似。",
  ),
  prerequisites: ["dilations-of-geometric-figures", "translations-of-geometric-figures"],
  encompasses: [
    { topic: "dilations-of-geometric-figures", weight: 0.4 },
    { topic: "translations-of-geometric-figures", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.1", "CCSS.HSG.CO.A.2"],
  knowledgePoints: [
    {
      id: "dilating-about-the-origin",
      title: t("Dilating about the origin", "以原点为中心的位似"),
      explanation: t(
        "A dilation with center at the origin and scale factor $k$ multiplies **both** coordinates by $k$:\n\n$$(x, y) \\to (kx, ky).$$\n\nEach image lies on the ray from the origin through the point, $k$ times as far away. With $k = \\frac{3}{2}$, the point $P(4, -6)$ goes to $P'\\left(\\frac{3}{2} \\cdot 4, \\frac{3}{2} \\cdot (-6)\\right) = P'(6, -9)$.",
        "以原点为中心、比例因子为 $k$ 的位似把**两个**坐标都乘以 $k$：\n\n$$(x, y) \\to (kx, ky)。$$\n\n每个像都在从原点经过该点的射线上，到原点的距离是原来的 $k$ 倍。当 $k = \\frac{3}{2}$ 时，点 $P(4, -6)$ 映到 $P'\\left(\\frac{3}{2} \\cdot 4, \\frac{3}{2} \\cdot (-6)\\right) = P'(6, -9)$。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const p = pickScaledPoint(rng, k, Number(k.d) * 4);
        const name = rng.pick(["P", "A", "Q", "M"]);
        return pointProblem({
          prompt: t(
            `A dilation with center at the origin and scale factor $${k.toLatex()}$ maps $${name}${pl(p)}$ to $${name}'$. Find the coordinates of $${name}'$.`,
            `以原点为中心、比例因子为 $${k.toLatex()}$ 的位似把 $${name}${pl(p)}$ 映到 $${name}'$。求 $${name}'$ 的坐标。`,
          ),
          answer: scaled(k, p),
          wrong: [scaled(Q.one.div(k), p), [Q.of(p[0]).add(k), Q.of(p[1]).add(k)], [k.mul(Q.of(p[0])), p[1]]],
          solution: t(
            `Multiply both coordinates by the scale factor:${scaleSteps(`${name}'`, k, p)}`,
            `把两个坐标都乘以比例因子：${scaleSteps(`${name}'`, k, p)}`,
          ),
        });
      },
    },
    {
      id: "dilating-a-figure",
      title: t("Dilating a figure", "对图形作位似"),
      explanation: t(
        "To dilate a polygon about the origin, apply the rule $(x, y) \\to (kx, ky)$ to each vertex and join the images in the same order. The image has the same angles, and every side is $k$ times as long.\n\nUnder $(x, y) \\to (\\frac{1}{2}x, \\frac{1}{2}y)$, the vertex $B(-4, 6)$ of triangle $ABC$ goes to $B'(-2, 3)$.",
        "要以原点为中心对多边形作位似，就对每个顶点应用规则 $(x, y) \\to (kx, ky)$，再按原来的顺序连接各个像。像的各角不变，每条边都变为原来的 $k$ 倍。\n\n在 $(x, y) \\to (\\frac{1}{2}x, \\frac{1}{2}y)$ 下，三角形 $ABC$ 的顶点 $B(-4, 6)$ 映到 $B'(-2, 3)$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.pick(smallScales);
          const d = Number(k.d);
          const lim = Math.floor(6 / d);
          const tri = [0, 1, 2].map((): XY => [d * rng.int(-lim, lim), d * rng.int(-lim, lim)]);
          const [a, b, c] = tri as [XY, XY, XY];
          const area2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
          const sides = [Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1]), Math.hypot(a[0] - c[0], a[1] - c[1])];
          if (area2 < 12 || Math.min(...sides) < 2) continue;
          const i = rng.int(0, 2);
          const p = tri[i]!;
          if (p[0] === 0 && p[1] === 0) continue;
          const name = "ABC"[i]!;
          return {
            ...pointProblem({
              prompt: t(
                `Triangle $ABC$ is dilated by the rule $${dilationRule(k)}$. Find the coordinates of $${name}'$.`,
                `三角形 $ABC$ 按规则 $${dilationRule(k)}$ 作位似。求 $${name}'$ 的坐标。`,
              ),
              answer: scaled(k, p),
              wrong: [scaled(Q.one.div(k), p), scaled(k, [p[1], p[0]]), [k.mul(Q.of(p[0])), p[1]]],
              solution: t(
                `From the figure, $${name} = ${pl(p)}$. Apply the rule:${scaleSteps(`${name}'`, k, p)}`,
                `由图，$${name} = ${pl(p)}$。应用规则：${scaleSteps(`${name}'`, k, p)}`,
              ),
            }),
            figure: graph(named(tri, ["A", "B", "C"]), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
          };
        }
      },
    },
    {
      id: "scale-factors-from-coordinates",
      title: t("Scale factors from coordinates", "由坐标求比例因子"),
      explanation: t(
        "If a dilation about the origin maps $P(x, y)$ to $P'(x', y')$, then $x' = kx$ and $y' = ky$, so\n\n$$k = \\frac{x'}{x} = \\frac{y'}{y}.$$\n\nIf $P(6, -4)$ maps to $P'(9, -6)$, then $k = \\frac{9}{6} = \\frac{3}{2}$; the $y$-coordinates agree: $\\frac{-6}{-4} = \\frac{3}{2}$. Image over preimage, not the other way round.",
        "若以原点为中心的位似把 $P(x, y)$ 映到 $P'(x', y')$，则 $x' = kx$，$y' = ky$，所以\n\n$$k = \\frac{x'}{x} = \\frac{y'}{y}。$$\n\n若 $P(6, -4)$ 映到 $P'(9, -6)$，则 $k = \\frac{9}{6} = \\frac{3}{2}$；用 $y$ 坐标验证：$\\frac{-6}{-4} = \\frac{3}{2}$。是像比原像，不能颠倒。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const p = pickScaledPoint(rng, k, Number(k.d) * 3);
        const image = scaled(k, p);
        return numberProblem({
          prompt: t(
            `A dilation with center at the origin maps $P${pl(p)}$ to $P'${pl(image)}$. Find the scale factor.`,
            `以原点为中心的位似把 $P${pl(p)}$ 映到 $P'${pl(image)}$。求比例因子。`,
          ),
          answer: k,
          form: "fraction",
          wrong: [Q.one.div(k), image[0].sub(Q.of(p[0]))],
          solution: t(
            `Divide an image coordinate by the matching preimage coordinate:${steps(`k = \\frac{${image[0].toLatex()}}{${p[0]}} = ${k.toLatex()}`)}`,
            `用像的坐标除以对应的原像坐标：${steps(`k = \\frac{${image[0].toLatex()}}{${p[0]}} = ${k.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "dilating-about-another-center",
      title: t("Dilating about another center", "以其他点为中心的位似"),
      explanation: t(
        "To dilate $P$ about a center $C$ other than the origin:\n\n1. Find how $P$ sits relative to $C$: $(x_P - x_C, y_P - y_C)$.\n2. Multiply that offset by $k$.\n3. Add $C$ back.\n\nDilating $P(7, 1)$ about $C(3, -1)$ with $k = \\frac{1}{2}$: the offset is $(4, 2)$, half of it is $(2, 1)$, and adding $C$ gives $P'(5, 0)$.",
        "要以不是原点的点 $C$ 为中心对 $P$ 作位似：\n\n1. 求 $P$ 相对于 $C$ 的位置：$(x_P - x_C, y_P - y_C)$。\n2. 把这个差乘以 $k$。\n3. 再加回 $C$。\n\n以 $C(3, -1)$ 为中心、$k = \\frac{1}{2}$ 对 $P(7, 1)$ 作位似：差是 $(4, 2)$，它的一半是 $(2, 1)$，加上 $C$ 得 $P'(5, 0)$。",
      ),
      generate(rng) {
        const k = rng.pick(smallScales);
        const d = Number(k.d);
        const c: XY = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const off = pickScaledPoint(rng, k, 3 * d);
        const p: XY = [c[0] + off[0], c[1] + off[1]];
        const r = scaled(k, off);
        const image: QP = [r[0].add(Q.of(c[0])), r[1].add(Q.of(c[1]))];
        const back = scaled(Q.one.div(k), off);
        return pointProblem({
          prompt: t(
            `A dilation with center $C${pl(c)}$ and scale factor $${k.toLatex()}$ maps $P${pl(p)}$ to $P'$. Find the coordinates of $P'$.`,
            `以 $C${pl(c)}$ 为中心、比例因子为 $${k.toLatex()}$ 的位似把 $P${pl(p)}$ 映到 $P'$。求 $P'$ 的坐标。`,
          ),
          answer: image,
          wrong: [scaled(k, p), [back[0].add(Q.of(c[0])), back[1].add(Q.of(c[1]))], [r[0].add(Q.of(p[0])), r[1].add(Q.of(p[1]))]],
          solution: t(
            `The offset of $P$ from $C$ is $${pl(off)}$. Multiply it by $${k.toLatex()}$ to get $${pl(r)}$, then add $C$:${steps(`P' = (${c[0]} + ${paren(r[0])}, \\; ${c[1]} + ${paren(r[1])}) = ${pl(image)}`)}`,
            `$P$ 相对于 $C$ 的差是 $${pl(off)}$。乘以 $${k.toLatex()}$ 得 $${pl(r)}$，再加上 $C$：${steps(`P' = (${c[0]} + ${paren(r[0])}, \\; ${c[1]} + ${paren(r[1])}) = ${pl(image)}`)}`,
          ),
        });
      },
    },
  ],
};

// ─── Stretches ──────────────────────────────────────────────────────────────

/** stretchRule writes the rule of a horizontal or vertical stretch by k. */
const stretchRule = (horizontal: boolean, k: Q) => (horizontal ? `(x, y) \\to (${times(k, "x")}, y)` : `(x, y) \\to (x, ${times(k, "y")})`);

/** stretchName names a horizontal or vertical stretch by k. */
const stretchName = (horizontal: boolean, k: Q): Text =>
  horizontal
    ? t(`stretched horizontally by a factor of $${k.toLatex()}$`, `沿水平方向以因子 $${k.toLatex()}$ 伸缩`)
    : t(`stretched vertically by a factor of $${k.toLatex()}$`, `沿竖直方向以因子 $${k.toLatex()}$ 伸缩`);

/** stretched applies a horizontal or vertical stretch by k to p. */
const stretched = (horizontal: boolean, k: Q, p: XY): QP =>
  horizontal ? [k.mul(Q.of(p[0])), Q.of(p[1])] : [Q.of(p[0]), k.mul(Q.of(p[1]))];

/** pickStretchPoint picks a point whose stretched coordinate is a multiple of the denominator of k. */
function pickStretchPoint(rng: Rng, horizontal: boolean, k: Q): XY {
  for (;;) {
    const s = multipleOf(rng, Number(k.d), Number(k.d) * 3);
    const o = rng.nonZero(-7, 7);
    const p: XY = horizontal ? [s, o] : [o, s];
    if (Math.abs(p[0]) !== Math.abs(p[1])) return p;
  }
}

/** stretchesOfGeometricFigures stretches points and figures horizontally or vertically. */
export const stretchesOfGeometricFigures: TopicDef = {
  id: "stretches-of-geometric-figures",
  title: t("Stretches of Geometric Figures", "图形的伸缩"),
  summary: t(
    "Stretch points and figures horizontally or vertically, find the areas of stretched figures, and identify a stretch from a point and its image.",
    "把点和图形沿水平或竖直方向伸缩，求伸缩后图形的面积，并由一个点和它的像判断伸缩。",
  ),
  prerequisites: ["dilations-of-figures-in-the-coordinate-plane"],
  encompasses: [{ topic: "dilations-of-figures-in-the-coordinate-plane", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2"],
  knowledgePoints: [
    {
      id: "horizontal-and-vertical-stretches",
      title: t("Horizontal and vertical stretches", "水平与竖直伸缩"),
      explanation: t(
        "A **stretch** multiplies only one coordinate:\n\n- A **vertical stretch** by a factor of $k$ (from the $x$-axis): $(x, y) \\to (x, ky)$. Points on the $x$-axis stay fixed.\n- A **horizontal stretch** by a factor of $k$ (from the $y$-axis): $(x, y) \\to (kx, y)$. Points on the $y$-axis stay fixed.\n\nWhen $0 < k < 1$, the stretch squeezes the figure. Unlike a dilation, a stretch changes the shape of most figures.\n\nStretching $P(3, -4)$ vertically by a factor of $\\frac{5}{2}$ gives $P'(3, -10)$.",
        "**伸缩**只把一个坐标乘以因子：\n\n- 以因子 $k$ **竖直伸缩**（以 $x$ 轴为基准）：$(x, y) \\to (x, ky)$。$x$ 轴上的点保持不动。\n- 以因子 $k$ **水平伸缩**（以 $y$ 轴为基准）：$(x, y) \\to (kx, y)$。$y$ 轴上的点保持不动。\n\n当 $0 < k < 1$ 时，伸缩把图形压扁。与位似不同，伸缩会改变大多数图形的形状。\n\n把 $P(3, -4)$ 以因子 $\\frac{5}{2}$ 竖直伸缩，得到 $P'(3, -10)$。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const k = rng.pick(niceScales);
        const p = pickStretchPoint(rng, horizontal, k);
        const name = stretchName(horizontal, k);
        const image = stretched(horizontal, k, p);
        return pointProblem({
          prompt: t(
            `The point $P${pl(p)}$ is ${name.en}. Find the coordinates of its image $P'$.`,
            `把点 $P${pl(p)}$ ${name["zh-CN"]}。求它的像 $P'$ 的坐标。`,
          ),
          answer: image,
          wrong: [scaled(k, p), stretched(!horizontal, k, p), horizontal ? [Q.of(p[0]).add(k), p[1]] : [p[0], Q.of(p[1]).add(k)]],
          solution: t(
            `A ${horizontal ? "horizontal" : "vertical"} stretch follows the rule $${stretchRule(horizontal, k)}$: it multiplies only the $${horizontal ? "x" : "y"}$-coordinate.${steps(`P' = ${pl(image)}`)}`,
            `${horizontal ? "水平" : "竖直"}伸缩的规则是 $${stretchRule(horizontal, k)}$：只把 $${horizontal ? "x" : "y"}$ 坐标乘以因子。${steps(`P' = ${pl(image)}`)}`,
          ),
        });
      },
    },
    {
      id: "areas-of-stretched-figures",
      title: t("Areas of stretched figures", "伸缩后图形的面积"),
      explanation: t(
        "A vertical stretch by $k$ multiplies every vertical length by $k$ and leaves horizontal lengths alone (a horizontal stretch does the opposite). So it multiplies areas by $k$, not by $k^2$ as a dilation does.\n\nA $4 \\times 3$ rectangle stretched vertically by a factor of $2$ becomes a $4 \\times 6$ rectangle: its area goes from $12$ to $24$.",
        "以因子 $k$ 竖直伸缩把所有竖直方向的长度乘以 $k$，水平方向的长度不变（水平伸缩正好相反）。所以它把面积乘以 $k$，而不是像位似那样乘以 $k^2$。\n\n一个 $4 \\times 3$ 的长方形以因子 $2$ 竖直伸缩后变成 $4 \\times 6$ 的长方形：面积从 $12$ 变为 $24$。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const k = rng.pick(niceScales);
        const [w, h] = [rng.int(2, 6), rng.int(2, 6)];
        const [x0, y0] = [rng.int(-6, 6 - w), rng.int(-6, 6 - h)];
        const triangle = rng.bool();
        const pts: XY[] = triangle
          ? rng.pick([
              [
                [x0, y0],
                [x0 + w, y0],
                [x0, y0 + h],
              ],
              [
                [x0, y0],
                [x0 + w, y0],
                [x0 + w, y0 + h],
              ],
            ])
          : [
              [x0, y0],
              [x0 + w, y0],
              [x0 + w, y0 + h],
              [x0, y0 + h],
            ];
        const area = Q.of(w * h, triangle ? 2 : 1);
        const shape = triangle ? t("right triangle", "直角三角形") : t("rectangle", "长方形");
        const name = stretchName(horizontal, k);
        const [nw, nh] = horizontal ? [k.mul(Q.of(w)), Q.of(h)] : [Q.of(w), k.mul(Q.of(h))];
        const formula = triangle
          ? `\\frac{1}{2} \\cdot ${paren(nw)} \\cdot ${paren(nh)} = ${area.mul(k).toLatex()}`
          : `${paren(nw)} \\cdot ${paren(nh)} = ${area.mul(k).toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(
              `The ${shape.en} shown is ${name.en}. Find the area of its image.`,
              `把图中的${shape["zh-CN"]}${name["zh-CN"]}。求它的像的面积。`,
            ),
            answer: area.mul(k),
            wrong: [area.mul(k).mul(k), area, area.div(k)],
            solution: t(
              `The ${horizontal ? "horizontal" : "vertical"} side of length $${horizontal ? w : h}$ becomes $${(horizontal ? nw : nh).toLatex()}$; the other side keeps its length $${horizontal ? h : w}$. The area of the image is${steps(formula)}which is $${k.toLatex()}$ times the original area $${area.toLatex()}$.`,
              `长为 $${horizontal ? w : h}$ 的${horizontal ? "水平" : "竖直"}边变为 $${(horizontal ? nw : nh).toLatex()}$；另一条边仍为 $${horizontal ? h : w}$。像的面积是${steps(formula)}即原面积 $${area.toLatex()}$ 的 $${k.toLatex()}$ 倍。`,
            ),
          }),
          figure: graph(
            outline(pts),
            `A ${shape.en} with sides along the grid lines, ${w} units wide and ${h} units tall.`,
            `一个边沿网格线的${shape["zh-CN"]}，宽 ${w} 个单位，高 ${h} 个单位。`,
          ),
        };
      },
    },
    {
      id: "identifying-a-stretch",
      title: t("Identifying a stretch", "判断伸缩"),
      explanation: t(
        "To identify a stretch from a point and its image, see which coordinate changes: if $x$ changes and $y$ stays, it is horizontal; if $y$ changes and $x$ stays, it is vertical. The factor is the new coordinate over the old one.\n\n$P(4, 6)$ maps to $P'(4, 9)$: $x$ stays, and $\\frac{9}{6} = \\frac{3}{2}$, so the rule is $(x, y) \\to (x, \\frac{3}{2}y)$.",
        "要由一个点和它的像判断伸缩，看哪个坐标变了：$x$ 变而 $y$ 不变，是水平伸缩；$y$ 变而 $x$ 不变，是竖直伸缩。因子是新坐标与旧坐标之比。\n\n$P(4, 6)$ 映到 $P'(4, 9)$：$x$ 不变，$\\frac{9}{6} = \\frac{3}{2}$，所以规则是 $(x, y) \\to (x, \\frac{3}{2}y)$。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const k = rng.pick(niceScales);
        const p = pickStretchPoint(rng, horizontal, k);
        const image = stretched(horizontal, k, p);
        const correct = stretchRule(horizontal, k);
        const options = rng.shuffle([correct, stretchRule(!horizontal, k), dilationRule(k), stretchRule(horizontal, Q.one.div(k))]);
        const changed = horizontal ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `A stretch maps $P${pl(p)}$ to $P'${pl(image)}$. Which rule describes it?`,
            `一次伸缩把 $P${pl(p)}$ 映到 $P'${pl(image)}$。哪条规则描述了它？`,
          ),
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(correct),
          solution: t(
            `Only the $${horizontal ? "x" : "y"}$-coordinate changes, so the stretch is ${horizontal ? "horizontal" : "vertical"}, with factor $\\frac{${image[changed].toLatex()}}{${p[changed]}} = ${k.toLatex()}$. The rule is $${correct}$.`,
            `只有 $${horizontal ? "x" : "y"}$ 坐标改变，所以是${horizontal ? "水平" : "竖直"}伸缩，因子为 $\\frac{${image[changed].toLatex()}}{${p[changed]}} = ${k.toLatex()}$。规则是 $${correct}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Combining Stretches ────────────────────────────────────────────────────

/** combinedRule writes (x, y) → (ax, by). */
const combinedRule = (a: Q, b: Q) => `(x, y) \\to (${times(a, "x")}, ${times(b, "y")})`;

/** pickCombinedPoint picks a point whose coordinates are multiples of the denominators of a and b. */
function pickCombinedPoint(rng: Rng, a: Q, b: Q): XY {
  for (;;) {
    const p: XY = [multipleOf(rng, Number(a.d), Number(a.d) * 3), multipleOf(rng, Number(b.d), Number(b.d) * 3)];
    if (Math.abs(p[0]) !== Math.abs(p[1])) return p;
  }
}

/** combiningStretchesOfGeometricFigures combines horizontal and vertical stretches into one rule. */
export const combiningStretchesOfGeometricFigures: TopicDef = {
  id: "combining-stretches-of-geometric-figures",
  title: t("Combining Stretches of Geometric Figures", "图形伸缩的组合"),
  summary: t(
    "Combine horizontal and vertical stretches into the rule (x, y) → (ax, by), combine and undo stretches in one direction, and find how combined stretches change areas.",
    "把水平和竖直伸缩合成规则 (x, y) → (ax, by)，组合和还原同一方向的伸缩，并求组合伸缩对面积的影响。",
  ),
  prerequisites: ["stretches-of-geometric-figures"],
  encompasses: [{ topic: "stretches-of-geometric-figures", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2"],
  knowledgePoints: [
    {
      id: "stretching-in-both-directions",
      title: t("Stretching in both directions", "两个方向的伸缩"),
      explanation: t(
        "A horizontal stretch by $a$ followed by a vertical stretch by $b$ multiplies $x$ by $a$ and $y$ by $b$:\n\n$$(x, y) \\to (ax, by).$$\n\nThe order does not matter, since each stretch changes only its own coordinate. When $a = b$, the result is a dilation about the origin.\n\nStretching $P(2, -6)$ horizontally by $3$ and vertically by $\\frac{1}{2}$ gives $P'(6, -3)$.",
        "以因子 $a$ 水平伸缩、再以因子 $b$ 竖直伸缩，把 $x$ 乘以 $a$，$y$ 乘以 $b$：\n\n$$(x, y) \\to (ax, by)。$$\n\n顺序无关紧要，因为每次伸缩只改变自己的那个坐标。当 $a = b$ 时，结果就是以原点为中心的位似。\n\n把 $P(2, -6)$ 以因子 $3$ 水平伸缩、以因子 $\\frac{1}{2}$ 竖直伸缩，得到 $P'(6, -3)$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample(niceScales, 2) as [Q, Q];
        const p = pickCombinedPoint(rng, a, b);
        const image: QP = [a.mul(Q.of(p[0])), b.mul(Q.of(p[1]))];
        return pointProblem({
          prompt: t(
            `The point $P${pl(p)}$ is stretched horizontally by a factor of $${a.toLatex()}$ and vertically by a factor of $${b.toLatex()}$. Find the coordinates of its image $P'$.`,
            `把点 $P${pl(p)}$ 沿水平方向以因子 $${a.toLatex()}$、沿竖直方向以因子 $${b.toLatex()}$ 伸缩。求它的像 $P'$ 的坐标。`,
          ),
          answer: image,
          wrong: [[b.mul(Q.of(p[0])), a.mul(Q.of(p[1]))], scaled(a.mul(b), p), [a.mul(Q.of(p[0])), p[1]]],
          solution: t(
            `The combined rule is $${combinedRule(a, b)}$:${steps(`P' = (${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`)}`,
            `组合后的规则是 $${combinedRule(a, b)}$：${steps(`P' = (${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`)}`,
          ),
        });
      },
    },
    {
      id: "stretches-in-the-same-direction",
      title: t("Stretches in the same direction", "同一方向的伸缩"),
      explanation: t(
        "Two stretches in the same direction combine into one: stretching horizontally by $a$ and then by $b$ multiplies $x$ by $a$ and then by $b$, a single horizontal stretch by $ab$.\n\nTo **undo** a stretch by $a$, stretch in the same direction by $\\frac{1}{a}$, since $a \\cdot \\frac{1}{a} = 1$.\n\nA vertical stretch by $\\frac{3}{2}$ followed by a vertical stretch by $4$ is a vertical stretch by $6$; it is undone by a vertical stretch by $\\frac{1}{6}$.",
        "同一方向的两次伸缩可以合成一次：先以因子 $a$、再以因子 $b$ 水平伸缩，就是把 $x$ 先乘以 $a$ 再乘以 $b$，即以因子 $ab$ 水平伸缩一次。\n\n要**还原**以因子 $a$ 的伸缩，就沿同一方向以因子 $\\frac{1}{a}$ 伸缩，因为 $a \\cdot \\frac{1}{a} = 1$。\n\n以因子 $\\frac{3}{2}$ 竖直伸缩后再以因子 $4$ 竖直伸缩，等于以因子 $6$ 竖直伸缩；用因子 $\\frac{1}{6}$ 的竖直伸缩可以还原它。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const way = horizontal ? t("horizontally", "水平") : t("vertically", "竖直");
        const [a, b] = rng.sample(niceScales, 2) as [Q, Q];
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(
              `A figure is stretched ${way.en} by a factor of $${a.toLatex()}$. By what factor must its image be stretched ${way.en} to return it to the original figure?`,
              `把一个图形沿${way["zh-CN"]}方向以因子 $${a.toLatex()}$ 伸缩。要把它的像变回原图形，应沿${way["zh-CN"]}方向以什么因子伸缩？`,
            ),
            answer: Q.one.div(a),
            wrong: [a, a.neg(), Q.one.sub(a)],
            solution: t(
              `The second stretch must multiply by a factor that cancels $${a.toLatex()}$:${steps(`${a.toLatex()} \\cdot k = 1`, `k = ${Q.one.div(a).toLatex()}`)}`,
              `第二次伸缩的因子必须抵消 $${a.toLatex()}$：${steps(`${a.toLatex()} \\cdot k = 1`, `k = ${Q.one.div(a).toLatex()}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A figure is stretched ${way.en} by a factor of $${a.toLatex()}$, and the image is then stretched ${way.en} by a factor of $${b.toLatex()}$. The result is a single ${horizontal ? "horizontal" : "vertical"} stretch. Find its factor.`,
            `把一个图形沿${way["zh-CN"]}方向以因子 $${a.toLatex()}$ 伸缩，再把像沿${way["zh-CN"]}方向以因子 $${b.toLatex()}$ 伸缩。结果是一次${way["zh-CN"]}伸缩。求它的因子。`,
          ),
          answer: a.mul(b),
          wrong: [a.add(b), a.div(b), b.div(a)],
          solution: t(
            `The ${horizontal ? "$x$" : "$y$"}-coordinate is multiplied by $${a.toLatex()}$ and then by $${b.toLatex()}$:${steps(`${a.toLatex()} \\cdot ${b.toLatex()} = ${a.mul(b).toLatex()}`)}`,
            `${horizontal ? "$x$" : "$y$"} 坐标先乘以 $${a.toLatex()}$，再乘以 $${b.toLatex()}$：${steps(`${a.toLatex()} \\cdot ${b.toLatex()} = ${a.mul(b).toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-stretch-factors",
      title: t("Finding the stretch factors", "求伸缩因子"),
      explanation: t(
        "If $(x, y) \\to (ax, by)$ maps $P$ to $P'$, divide coordinate by coordinate:\n\n$$a = \\frac{x_{P'}}{x_P}, \\quad b = \\frac{y_{P'}}{y_P}.$$\n\nIf $P(4, -3)$ maps to $P'(2, -12)$, then $a = \\frac{2}{4} = \\frac{1}{2}$ and $b = \\frac{-12}{-3} = 4$: a horizontal stretch by $\\frac{1}{2}$ and a vertical stretch by $4$.",
        "若 $(x, y) \\to (ax, by)$ 把 $P$ 映到 $P'$，就把坐标逐个相除：\n\n$$a = \\frac{x_{P'}}{x_P}, \\quad b = \\frac{y_{P'}}{y_P}。$$\n\n若 $P(4, -3)$ 映到 $P'(2, -12)$，则 $a = \\frac{2}{4} = \\frac{1}{2}$，$b = \\frac{-12}{-3} = 4$：水平伸缩因子为 $\\frac{1}{2}$，竖直伸缩因子为 $4$。",
      ),
      generate(rng) {
        const a = rng.pick(niceScales);
        const b = rng.bool(0.15) ? a : rng.pick(niceScales);
        const p = pickCombinedPoint(rng, a, b);
        const image: QP = [a.mul(Q.of(p[0])), b.mul(Q.of(p[1]))];
        return pointProblem({
          prompt: t(
            `The combined stretch $(x, y) \\to (ax, by)$ maps $P${pl(p)}$ to $P'${pl(image)}$. Find $(a, b)$.`,
            `组合伸缩 $(x, y) \\to (ax, by)$ 把 $P${pl(p)}$ 映到 $P'${pl(image)}$。求 $(a, b)$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [Q.one.div(a), Q.one.div(b)],
            [b, a],
            [image[0].sub(Q.of(p[0])), image[1].sub(Q.of(p[1]))],
          ],
          solution: t(
            `Divide each image coordinate by the preimage coordinate:${steps(`a = \\frac{${image[0].toLatex()}}{${p[0]}} = ${a.toLatex()}`, `b = \\frac{${image[1].toLatex()}}{${p[1]}} = ${b.toLatex()}`)}`,
            `用像的每个坐标除以原像的对应坐标：${steps(`a = \\frac{${image[0].toLatex()}}{${p[0]}} = ${a.toLatex()}`, `b = \\frac{${image[1].toLatex()}}{${p[1]}} = ${b.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "areas-under-combined-stretches",
      title: t("Areas under combined stretches", "组合伸缩下的面积"),
      explanation: t(
        "The stretch $(x, y) \\to (ax, by)$ multiplies horizontal lengths by $a$ and vertical lengths by $b$, so it multiplies every area by $ab$. For a dilation, $a = b = k$, and areas are multiplied by $k^2$.\n\nA triangle of area $10$ stretched horizontally by $3$ and vertically by $\\frac{1}{2}$ has area $10 \\cdot 3 \\cdot \\frac{1}{2} = 15$.",
        "伸缩 $(x, y) \\to (ax, by)$ 把水平长度乘以 $a$，竖直长度乘以 $b$，所以把每个面积乘以 $ab$。对于位似，$a = b = k$，面积乘以 $k^2$。\n\n面积为 $10$ 的三角形以因子 $3$ 水平伸缩、以因子 $\\frac{1}{2}$ 竖直伸缩后，面积为 $10 \\cdot 3 \\cdot \\frac{1}{2} = 15$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample(niceScales, 2) as [Q, Q];
        const area = rng.int(2, 15);
        const shape = rng.pick([
          t("triangle", "三角形"),
          t("square", "正方形"),
          t("pentagon", "五边形"),
          t("circle", "圆"),
          t("trapezoid", "梯形"),
        ]);
        const result = Q.of(area).mul(a).mul(b);
        return numberProblem({
          prompt: t(
            `A ${shape.en} with area $${area}$ is stretched horizontally by a factor of $${a.toLatex()}$ and vertically by a factor of $${b.toLatex()}$. Find the area of its image.`,
            `面积为 $${area}$ 的${shape["zh-CN"]}沿水平方向以因子 $${a.toLatex()}$、沿竖直方向以因子 $${b.toLatex()}$ 伸缩。求它的像的面积。`,
          ),
          answer: result,
          wrong: [Q.of(area).mul(a.add(b)), Q.of(area).mul(a), Q.of(area).mul(a).mul(a).mul(b).mul(b)],
          solution: t(
            `The stretch multiplies areas by $ab$:${steps(`${area} \\cdot ${a.toLatex()} \\cdot ${b.toLatex()} = ${result.toLatex()}`)}`,
            `这次伸缩把面积乘以 $ab$：${steps(`${area} \\cdot ${a.toLatex()} \\cdot ${b.toLatex()} = ${result.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

// ─── Combining Geometric Transformations ────────────────────────────────────

/** Move is a transformation of the plane that maps grid points to grid points, with its inverse. */
interface Move {
  readonly f: (p: XY) => XY;
  readonly inv: (p: XY) => XY;
  readonly name: Text;
  readonly kind: "translation" | "reflection" | "rotation" | "dilation";
}

/** translationRule writes (x, y) → (x + h, y + v). */
const translationRule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

const translation = (h: number, v: number): Move => ({
  f: ([x, y]) => [x + h, y + v],
  inv: ([x, y]) => [x - h, y - v],
  name: t(`the translation $${translationRule(h, v)}$`, `平移 $${translationRule(h, v)}$`),
  kind: "translation",
});

/** rigidMoves are the reflections and rotations about the origin that keep grid points on the grid. */
const rigidMoves: readonly Move[] = [
  {
    f: ([x, y]) => [x, z(-y)],
    inv: ([x, y]) => [x, z(-y)],
    name: t("the reflection across the $x$-axis", "关于 $x$ 轴的轴对称"),
    kind: "reflection",
  },
  {
    f: ([x, y]) => [z(-x), y],
    inv: ([x, y]) => [z(-x), y],
    name: t("the reflection across the $y$-axis", "关于 $y$ 轴的轴对称"),
    kind: "reflection",
  },
  {
    f: ([x, y]) => [y, x],
    inv: ([x, y]) => [y, x],
    name: t("the reflection across the line $y = x$", "关于直线 $y = x$ 的轴对称"),
    kind: "reflection",
  },
  {
    f: ([x, y]) => [z(-y), z(-x)],
    inv: ([x, y]) => [z(-y), z(-x)],
    name: t("the reflection across the line $y = -x$", "关于直线 $y = -x$ 的轴对称"),
    kind: "reflection",
  },
  {
    f: ([x, y]) => [z(-y), x],
    inv: ([x, y]) => [y, z(-x)],
    name: t("the rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$"),
    kind: "rotation",
  },
  {
    f: ([x, y]) => [z(-x), z(-y)],
    inv: ([x, y]) => [z(-x), z(-y)],
    name: t("the rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
    kind: "rotation",
  },
  {
    f: ([x, y]) => [y, z(-x)],
    inv: ([x, y]) => [z(-y), x],
    name: t("the rotation of $90^\\circ$ clockwise about the origin", "绕原点顺时针旋转 $90^\\circ$"),
    kind: "rotation",
  },
];

const dilation = (k: number): Move => ({
  f: ([x, y]) => [k * x, k * y],
  inv: ([x, y]) => [x / k, y / k],
  name: t(`the dilation about the origin with scale factor $${k}$`, `以原点为中心、比例因子为 $${k}$ 的位似`),
  kind: "dilation",
});

/** pickTranslation picks a translation that moves both coordinates. */
const pickTranslation = (rng: Rng) => translation(rng.nonZero(-5, 5), rng.nonZero(-5, 5));

/** sequenceName lists transformations in order: "A, followed by B, followed by C". */
function sequenceName(moves: readonly Move[]): Text {
  return t(moves.map((m) => m.name.en).join(", followed by "), moves.map((m) => m.name["zh-CN"]).join("，然后"));
}

/** applyAll applies moves in order. */
const applyAll = (moves: readonly Move[], p: XY): XY => moves.reduce((q, m) => m.f(q), p);

const same2 = (a: XY, b: XY) => a[0] === b[0] && a[1] === b[1];

/** traceSteps writes the images of p after each move: P₁, P₂, …, the last named P'. */
function traceSteps(moves: readonly Move[], p: XY): { en: string; zh: string } {
  let q = p;
  const en: string[] = [];
  const zh: string[] = [];
  moves.forEach((m, i) => {
    q = m.f(q);
    const label = i === moves.length - 1 ? "P'" : `P_{${i + 1}}`;
    en.push(`${i + 1}. ${cap(m.name.en)}: $${label} = ${pl(q)}$`);
    zh.push(`${i + 1}. ${m.name["zh-CN"]}：$${label} = ${pl(q)}$`);
  });
  return { en: en.join("\n"), zh: zh.join("\n") };
}

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Lin is a linear map (x, y) → (ax + by, cx + dy) with entries −1, 0 or 1. */
type Lin = readonly [number, number, number, number];

/** after composes linear maps: p after q. */
const after = (p: Lin, q: Lin): Lin => [
  z(p[0] * q[0] + p[1] * q[2]),
  z(p[0] * q[1] + p[1] * q[3]),
  z(p[2] * q[0] + p[3] * q[2]),
  z(p[2] * q[1] + p[3] * q[3]),
];

const coord = (a: number, b: number) => (a === 1 ? "x" : a === -1 ? "-x" : b === 1 ? "y" : "-y");
const linRule = (m: Lin) => `(x, y) \\to (${coord(m[0], m[1])}, ${coord(m[2], m[3])})`;
const linKey = (m: Lin) => m.join(",");

/** linearMoves are the eight symmetries of the square as linear maps, with names; the identity is last. */
const linearMoves: readonly { readonly m: Lin; readonly name: Text }[] = [
  { m: [1, 0, 0, -1], name: t("the reflection across the $x$-axis", "关于 $x$ 轴的轴对称") },
  { m: [-1, 0, 0, 1], name: t("the reflection across the $y$-axis", "关于 $y$ 轴的轴对称") },
  { m: [0, 1, 1, 0], name: t("the reflection across the line $y = x$", "关于直线 $y = x$ 的轴对称") },
  { m: [0, -1, -1, 0], name: t("the reflection across the line $y = -x$", "关于直线 $y = -x$ 的轴对称") },
  { m: [0, -1, 1, 0], name: t("the rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$") },
  { m: [-1, 0, 0, -1], name: t("the rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$") },
  { m: [0, 1, -1, 0], name: t("the rotation of $90^\\circ$ clockwise about the origin", "绕原点顺时针旋转 $90^\\circ$") },
  { m: [1, 0, 0, 1], name: t("the identity: every point stays where it is", "恒等变换：每个点都不动") },
];

/** combiningGeometricTransformations applies, undoes and simplifies sequences of transformations. */
export const combiningGeometricTransformations: TopicDef = {
  id: "combining-geometric-transformations",
  title: t("Combining Geometric Transformations", "几何变换的组合"),
  summary: t(
    "Apply sequences of translations, reflections, rotations and dilations in order, undo them, and describe a combination of two transformations by a single rule.",
    "按顺序施行平移、轴对称、旋转和位似的组合，还原它们，并用一条规则描述两个变换的组合。",
  ),
  prerequisites: [
    "rotation-rules-in-the-coordinate-plane",
    "reflections-in-the-coordinate-plane",
    "dilations-of-figures-in-the-coordinate-plane",
  ],
  encompasses: [
    { topic: "rotation-rules-in-the-coordinate-plane", weight: 0.3 },
    { topic: "reflections-in-the-coordinate-plane", weight: 0.3 },
    { topic: "translations-of-geometric-figures", weight: 0.3 },
    { topic: "dilations-of-figures-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.5"],
  knowledgePoints: [
    {
      id: "applying-two-transformations",
      title: t("Applying two transformations", "施行两个变换"),
      explanation: t(
        "To apply a sequence of transformations, apply them **in the order given**, each one to the image of the one before.\n\nReflect $P(2, 5)$ across the $x$-axis, then translate by $(x, y) \\to (x - 3, y + 1)$:\n\n1. Reflection: $P_1 = (2, -5)$\n2. Translation: $P' = (-1, -4)$\n\nThe order matters: translating first gives $(-1, 6)$, and reflecting that gives $(-1, -6)$, a different point.",
        "要施行一串变换，就**按给出的顺序**进行，每个变换作用在前一个变换的像上。\n\n把 $P(2, 5)$ 先关于 $x$ 轴作轴对称，再按 $(x, y) \\to (x - 3, y + 1)$ 平移：\n\n1. 轴对称：$P_1 = (2, -5)$\n2. 平移：$P' = (-1, -4)$\n\n顺序很重要：先平移得 $(-1, 6)$，再作轴对称得 $(-1, -6)$，是另一个点。",
      ),
      generate(rng) {
        for (;;) {
          const p: XY = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          const tr = pickTranslation(rng);
          const rigid = rng.pick(rigidMoves);
          const moves = rng.bool() ? [tr, rigid] : [rigid, tr];
          const answer = applyAll(moves, p);
          const reversed = applyAll([moves[1]!, moves[0]!], p);
          if (same2(answer, reversed) || same2(answer, p)) continue;
          const trace = traceSteps(moves, p);
          return pointProblem({
            prompt: t(
              `The point $P${pl(p)}$ is mapped by ${sequenceName(moves).en}. Find the coordinates of its image $P'$.`,
              `对点 $P${pl(p)}$ 先作${sequenceName(moves)["zh-CN"]}。求它的像 $P'$ 的坐标。`,
            ),
            answer,
            wrong: [reversed, moves[0]!.f(p), moves[1]!.f(p)],
            solution: t(`Apply the transformations in order:\n\n${trace.en}`, `按顺序施行变换：\n\n${trace.zh}`),
          });
        }
      },
    },
    {
      id: "sequences-with-dilations",
      title: t("Sequences with dilations", "含位似的变换序列"),
      explanation: t(
        "A sequence may mix rigid motions with dilations. Keep applying each transformation to the latest image.\n\nDilate $P(1, -2)$ about the origin with scale factor $3$, rotate $90^\\circ$ counterclockwise about the origin, then translate by $(x, y) \\to (x + 2, y - 4)$:\n\n1. Dilation: $P_1 = (3, -6)$\n2. Rotation: $P_2 = (6, 3)$\n3. Translation: $P' = (8, -1)$",
        "一串变换可以把刚体运动和位似混在一起。始终把每个变换作用在最新的像上。\n\n把 $P(1, -2)$ 以原点为中心、比例因子 $3$ 作位似，再绕原点逆时针旋转 $90^\\circ$，然后按 $(x, y) \\to (x + 2, y - 4)$ 平移：\n\n1. 位似：$P_1 = (3, -6)$\n2. 旋转：$P_2 = (6, 3)$\n3. 平移：$P' = (8, -1)$",
      ),
      generate(rng) {
        for (;;) {
          const p: XY = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
          const moves = rng.shuffle([pickTranslation(rng), rng.pick(rigidMoves), dilation(rng.int(2, 3))]);
          const answer = applyAll(moves, p);
          const reversed = applyAll([...moves].reverse(), p);
          const skipped = applyAll([moves[0]!, moves[2]!], p);
          if (same2(answer, reversed)) continue;
          const trace = traceSteps(moves, p);
          return pointProblem({
            prompt: t(
              `The point $P${pl(p)}$ is mapped by ${sequenceName(moves).en}. Find the coordinates of its image $P'$.`,
              `对点 $P${pl(p)}$ 先作${sequenceName(moves)["zh-CN"]}。求它的像 $P'$ 的坐标。`,
            ),
            answer,
            wrong: [reversed, skipped, applyAll(moves.slice(0, 2), p)],
            solution: t(`Apply the transformations in order:\n\n${trace.en}`, `按顺序施行变换：\n\n${trace.zh}`),
          });
        }
      },
    },
    {
      id: "undoing-a-sequence",
      title: t("Undoing a sequence", "还原变换序列"),
      explanation: t(
        "To find the preimage, undo the transformations **in reverse order**: undo the last one first. A translation is undone by the opposite translation, a reflection by itself, and a rotation by the same rotation in the other direction.\n\nIf $P$ is rotated $90^\\circ$ counterclockwise about the origin and then translated by $(x, y) \\to (x + 1, y - 2)$ to $P'(4, 3)$:\n\n1. Undo the translation: $(4 - 1, 3 + 2) = (3, 5)$\n2. Undo the rotation (rotate $90^\\circ$ clockwise): $P = (5, -3)$\n\nCheck: rotating $(5, -3)$ gives $(3, 5)$, and translating gives $(4, 3)$.",
        "要求原像，就**按相反的顺序**还原各个变换：先还原最后一个。平移用相反的平移还原，轴对称用它自己还原，旋转用反方向的同样角度的旋转还原。\n\n若 $P$ 绕原点逆时针旋转 $90^\\circ$，再按 $(x, y) \\to (x + 1, y - 2)$ 平移后得到 $P'(4, 3)$：\n\n1. 还原平移：$(4 - 1, 3 + 2) = (3, 5)$\n2. 还原旋转（顺时针旋转 $90^\\circ$）：$P = (5, -3)$\n\n检验：旋转 $(5, -3)$ 得 $(3, 5)$，再平移得 $(4, 3)$。",
      ),
      generate(rng) {
        for (;;) {
          const p: XY = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          const tr = pickTranslation(rng);
          const rigid = rng.pick(rigidMoves);
          const [m1, m2] = rng.bool() ? [tr, rigid] : [rigid, tr];
          const image = m2.f(m1.f(p));
          const wrongOrder = m2.inv(m1.inv(image));
          if (same2(wrongOrder, p)) continue;
          const mid = m2.inv(image);
          return pointProblem({
            prompt: t(
              `The point $P$ is mapped by ${sequenceName([m1, m2]).en}. Its image is $P'${pl(image)}$. Find the coordinates of $P$.`,
              `对点 $P$ 先作${sequenceName([m1, m2])["zh-CN"]}，得到像 $P'${pl(image)}$。求 $P$ 的坐标。`,
            ),
            answer: p,
            wrong: [wrongOrder, m2.f(m1.f(image)), mid],
            solution: t(
              `Undo the transformations in reverse order.\n\n1. Undo ${m2.name.en}: $${pl(mid)}$\n2. Undo ${m1.name.en}: $P = ${pl(p)}$`,
              `按相反的顺序还原各个变换。\n\n1. 还原${m2.name["zh-CN"]}：$${pl(mid)}$\n2. 还原${m1.name["zh-CN"]}：$P = ${pl(p)}$`,
            ),
          });
        }
      },
    },
    {
      id: "a-single-rule-for-two-transformations",
      title: t("A single rule for two transformations", "用一条规则表示两个变换"),
      explanation: t(
        "Two reflections or rotations about the origin combine into a single one. To find its rule, apply the first rule to $(x, y)$, then apply the second rule to the result.\n\nReflect across the $x$-axis, then across the line $y = x$:\n\n$$(x, y) \\to (x, -y) \\to (-y, x).$$\n\nThe second rule swaps the coordinates of $(x, -y)$. The result, $(x, y) \\to (-y, x)$, is the rotation of $90^\\circ$ counterclockwise about the origin.",
        "两个关于原点的轴对称或旋转可以合成一个。要求它的规则，先对 $(x, y)$ 应用第一条规则，再对结果应用第二条规则。\n\n先关于 $x$ 轴、再关于直线 $y = x$ 作轴对称：\n\n$$(x, y) \\to (x, -y) \\to (-y, x)。$$\n\n第二条规则交换 $(x, -y)$ 的两个坐标。结果 $(x, y) \\to (-y, x)$ 就是绕原点逆时针旋转 $90^\\circ$。",
      ),
      generate(rng) {
        const [first, second] = rng.sample(linearMoves.slice(0, 7), 2) as [(typeof linearMoves)[number], (typeof linearMoves)[number]];
        const result = after(second.m, first.m);
        const reverse = after(first.m, second.m);
        const keys = new Set([linKey(result)]);
        const others: Lin[] = [];
        for (const m of [reverse, first.m, second.m, ...rng.shuffle(linearMoves.map((l) => l.m))]) {
          if (others.length < 3 && !keys.has(linKey(m))) {
            keys.add(linKey(m));
            others.push(m);
          }
        }
        const options = rng.shuffle([result, ...others]);
        const named = linearMoves.find((l) => linKey(l.m) === linKey(result))!;
        return choiceProblem({
          prompt: t(
            `Which rule describes ${first.name.en}, followed by ${second.name.en}?`,
            `先作${first.name["zh-CN"]}，再作${second.name["zh-CN"]}，哪条规则描述了这个组合？`,
          ),
          options: options.map((m) => same(`$${linRule(m)}$`)),
          correct: options.findIndex((m) => linKey(m) === linKey(result)),
          solution: t(
            `Apply $${linRule(first.m)}$, then $${linRule(second.m)}$ to the result:${steps(`(x, y) \\to (${coord(first.m[0], first.m[1])}, ${coord(first.m[2], first.m[3])}) \\to (${coord(result[0], result[1])}, ${coord(result[2], result[3])})`)}This is ${named.name.en}.`,
            `先应用 $${linRule(first.m)}$，再对结果应用 $${linRule(second.m)}$：${steps(`(x, y) \\to (${coord(first.m[0], first.m[1])}, ${coord(first.m[2], first.m[3])}) \\to (${coord(result[0], result[1])}, ${coord(result[2], result[3])})`)}这就是${named.name["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

// ─── Symmetry ───────────────────────────────────────────────────────────────

/** Shape is a polygon with its numbers of lines of symmetry and order of rotational symmetry, and typical wrong counts. */
interface Shape {
  readonly name: Text;
  readonly points: readonly Point[];
  readonly lines: number;
  readonly order: number;
  readonly wrongLines: readonly number[];
  readonly wrongOrder: readonly number[];
}

const regularNames: Record<number, readonly [string, string]> = {
  3: ["equilateral triangle", "正三角形"],
  4: ["square", "正方形"],
  5: ["regular pentagon", "正五边形"],
  6: ["regular hexagon", "正六边形"],
  7: ["regular heptagon", "正七边形"],
  8: ["regular octagon", "正八边形"],
  9: ["regular nonagon", "正九边形"],
  10: ["regular decagon", "正十边形"],
  12: ["regular dodecagon", "正十二边形"],
};

/** shapeKinds are the kinds of polygon the symmetry problems draw. */
const shapeKinds = [
  "regular",
  "rectangle",
  "rhombus",
  "parallelogram",
  "isoscelesTrapezoid",
  "kite",
  "isoscelesTriangle",
  "scalene",
  "trapezoid",
] as const;

/** pickShape draws a random polygon of a random kind. */
function pickShape(rng: Rng): Shape {
  const kind = rng.pick(shapeKinds);
  const shape = (en: string, zh: string, pts: Point[], lines: number, order: number, wl: number[], wo: number[]): Shape => ({
    name: t(en, zh),
    points: pts,
    lines,
    order,
    wrongLines: wl,
    wrongOrder: wo,
  });
  switch (kind) {
    case "regular": {
      const n = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
      const phi = rng.int(-25, 25);
      const [en, zh] = regularNames[n]!;
      const pts = Array.from({ length: n }, (_, i) => dir(90 + (360 * i) / n + phi));
      return shape(en, zh, pts, n, n, [2 * n, n - 1, 1], [2 * n, n - 1, 1]);
    }
    case "rectangle": {
      const w = rng.int(3, 7);
      const h = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== w));
      return shape(
        "rectangle",
        "长方形",
        [
          [0, 0],
          [w, 0],
          [w, h],
          [0, h],
        ],
        2,
        2,
        [4, 0, 1],
        [4, 1, 0],
      );
    }
    case "rhombus": {
      const p = rng.int(3, 7);
      const q = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== p));
      return shape(
        "rhombus",
        "菱形",
        [
          [p, 0],
          [0, q],
          [-p, 0],
          [0, -q],
        ],
        2,
        2,
        [4, 0, 1],
        [4, 1, 0],
      );
    }
    case "parallelogram": {
      for (;;) {
        const [w, h, s] = [rng.int(3, 6), rng.int(2, 4), rng.int(1, 3)];
        if (w * w === s * s + h * h) continue;
        return shape(
          "parallelogram",
          "平行四边形",
          [
            [0, 0],
            [w, 0],
            [w + s, h],
            [s, h],
          ],
          0,
          2,
          [2, 4, 1],
          [0, 1, 4],
        );
      }
    }
    case "isoscelesTrapezoid": {
      const b1 = rng.int(3, 6);
      const b2 = rng.int(1, b1 - 1);
      const h = rng.int(2, 5);
      return shape(
        "isosceles trapezoid",
        "等腰梯形",
        [
          [-b1, 0],
          [b1, 0],
          [b2, h],
          [-b2, h],
        ],
        1,
        1,
        [2, 0],
        [2, 0],
      );
    }
    case "kite": {
      const [w, top, bottom] = [rng.int(2, 4), rng.int(2, 4), rng.int(5, 8)];
      return shape(
        "kite",
        "筝形",
        [
          [0, top],
          [-w, 0],
          [0, -bottom],
          [w, 0],
        ],
        1,
        1,
        [2, 0],
        [2, 0],
      );
    }
    case "isoscelesTriangle": {
      for (;;) {
        const [w, h] = [rng.int(2, 4), rng.int(2, 8)];
        if (Math.abs(h - w * Math.sqrt(3)) < 0.8) continue;
        return shape(
          "isosceles triangle",
          "等腰三角形",
          [
            [-w, 0],
            [w, 0],
            [0, h],
          ],
          1,
          1,
          [3, 0],
          [3, 0],
        );
      }
    }
    case "scalene": {
      for (;;) {
        const [w, s, h] = [rng.int(4, 7), rng.int(1, 6), rng.int(2, 5)];
        const [l1, l2] = [s * s + h * h, (w - s) * (w - s) + h * h];
        if (s >= w || l1 === l2 || l1 === w * w || l2 === w * w) continue;
        return shape(
          "scalene triangle",
          "不等边三角形",
          [
            [0, 0],
            [w, 0],
            [s, h],
          ],
          0,
          1,
          [1, 3],
          [0, 3],
        );
      }
    }
    case "trapezoid": {
      for (;;) {
        const b1 = rng.int(4, 7);
        const b2 = rng.int(2, b1 - 1);
        const [h, s] = [rng.int(2, 4), rng.int(0, b1 - b2)];
        if (2 * s === b1 - b2) continue;
        return shape(
          "trapezoid",
          "梯形",
          [
            [0, 0],
            [b1, 0],
            [s + b2, h],
            [s, h],
          ],
          0,
          1,
          [1, 2],
          [0, 2],
        );
      }
    }
  }
}

/** shapeFigure draws a shape turned by a random angle. */
function shapeFigure(rng: Rng, s: Shape): Figure {
  const phi = s.points.length > 4 && s.lines === s.points.length ? 0 : rng.int(-20, 20);
  const pts = s.points.map((p) => turn(p, phi));
  return figure([{ kind: "polygon", points: pts, accent: true }], `A ${s.name.en}.`, `一个${s.name["zh-CN"]}。`);
}

/** lineOfSymmetryName writes a line in LaTeX for prompts. */
type SymLine =
  | { readonly kind: "x"; readonly c: number }
  | { readonly kind: "y"; readonly c: number }
  | { readonly kind: "diag"; readonly sign: 1 | -1 };

const symLineLatex = (l: SymLine) => (l.kind === "x" ? `x = ${l.c}` : l.kind === "y" ? `y = ${l.c}` : l.sign === 1 ? "y = x" : "y = -x");

/** reflectAcross reflects p across a line of symmetry. */
function reflectAcross(l: SymLine, p: XY): XY {
  if (l.kind === "x") return [z(2 * l.c - p[0]), p[1]];
  if (l.kind === "y") return [p[0], z(2 * l.c - p[1])];
  return l.sign === 1 ? [p[1], p[0]] : [z(-p[1]), z(-p[0])];
}

/** reflectiveSymmetry counts lines of symmetry and uses them in the coordinate plane. */
export const reflectiveSymmetry: TopicDef = {
  id: "reflective-symmetry",
  title: t("Reflective Symmetry", "轴对称性"),
  summary: t(
    "Count the lines of symmetry of polygons, find points that a line of symmetry pairs up, and find the line of symmetry of a figure in the coordinate plane.",
    "数出多边形的对称轴条数，求一条对称轴配对的点，并求坐标平面中图形的对称轴。",
  ),
  prerequisites: ["reflections-in-the-coordinate-plane", "angles-of-polygons"],
  encompasses: [{ topic: "reflections-in-the-coordinate-plane", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.3"],
  knowledgePoints: [
    {
      id: "lines-of-symmetry-of-polygons",
      title: t("Lines of symmetry of polygons", "多边形的对称轴"),
      explanation: t(
        "A figure has **reflective symmetry** when a reflection maps it onto itself; the line of that reflection is a **line of symmetry**, and folding along it makes the two halves match.\n\n- A regular polygon with $n$ sides has $n$ lines of symmetry.\n- A rectangle has $2$ (through the midpoints of opposite sides) and a rhombus has $2$ (its diagonals); a square, which is both, has $4$.\n- An isosceles triangle, an isosceles trapezoid and a kite have $1$.\n- A scalene triangle and a parallelogram that is neither a rectangle nor a rhombus have none: the diagonal of a parallelogram is **not** a line of symmetry.",
        "如果一次轴对称把图形映到它自身，这个图形就具有**轴对称性**；这次轴对称的直线叫做**对称轴**，沿它对折，两半正好重合。\n\n- $n$ 条边的正多边形有 $n$ 条对称轴。\n- 长方形有 $2$ 条（过对边中点），菱形有 $2$ 条（它的对角线）；正方形两者都是，有 $4$ 条。\n- 等腰三角形、等腰梯形和筝形各有 $1$ 条。\n- 不等边三角形，以及既不是长方形也不是菱形的平行四边形没有对称轴：平行四边形的对角线**不是**对称轴。",
      ),
      generate(rng) {
        const s = pickShape(rng);
        return {
          ...numberProblem({
            prompt: t(`How many lines of symmetry does this ${s.name.en} have?`, `这个${s.name["zh-CN"]}有几条对称轴？`),
            answer: s.lines,
            form: "integer",
            wrong: s.wrongLines,
            solution: t(
              `A ${s.name.en} has ${s.lines === 0 ? "no lines" : s.lines === 1 ? "exactly $1$ line" : `$${s.lines}$ lines`} of symmetry.${s.lines === 0 ? " No reflection maps it onto itself." : ""}`,
              `${s.name["zh-CN"]}${s.lines === 0 ? "没有对称轴：没有任何轴对称能把它映到自身。" : `有 $${s.lines}$ 条对称轴。`}`,
            ),
          }),
          figure: shapeFigure(rng, s),
        };
      },
    },
    {
      id: "points-paired-by-a-line-of-symmetry",
      title: t("Points paired by a line of symmetry", "对称轴配对的点"),
      explanation: t(
        "If a line is a line of symmetry of a figure, reflecting any point of the figure across the line gives another point of the figure.\n\n- Across $x = a$: $(x, y) \\to (2a - x, y)$, since the two points are equally far from $x = a$.\n- Across $y = b$: $(x, y) \\to (x, 2b - y)$.\n- Across $y = x$: $(x, y) \\to (y, x)$; across $y = -x$: $(x, y) \\to (-y, -x)$.\n\nIf $x = 3$ is a line of symmetry and $(5, -2)$ is on the figure, so is $(2 \\cdot 3 - 5, -2) = (1, -2)$.",
        "若一条直线是图形的对称轴，把图形上任意一点关于这条直线作轴对称，得到的仍是图形上的点。\n\n- 关于 $x = a$：$(x, y) \\to (2a - x, y)$，因为两个点到 $x = a$ 的距离相等。\n- 关于 $y = b$：$(x, y) \\to (x, 2b - y)$。\n- 关于 $y = x$：$(x, y) \\to (y, x)$；关于 $y = -x$：$(x, y) \\to (-y, -x)$。\n\n若 $x = 3$ 是对称轴，$(5, -2)$ 在图形上，则 $(2 \\cdot 3 - 5, -2) = (1, -2)$ 也在图形上。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.int(0, 5);
          const line: SymLine =
            r < 2
              ? { kind: "x", c: rng.nonZero(-4, 4) }
              : r < 4
                ? { kind: "y", c: rng.nonZero(-4, 4) }
                : { kind: "diag", sign: rng.sign() };
          const p: XY = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          const q = reflectAcross(line, p);
          if (same2(p, q) || Math.abs(p[0]) === Math.abs(p[1])) continue;
          const wrong: XY[] =
            line.kind === "x"
              ? [
                  [z(-p[0]), p[1]],
                  [2 * line.c + p[0], p[1]],
                  [p[0], 2 * line.c - p[1]],
                ]
              : line.kind === "y"
                ? [
                    [p[0], z(-p[1])],
                    [p[0], 2 * line.c + p[1]],
                    [2 * line.c - p[0], p[1]],
                  ]
                : line.sign === 1
                  ? [
                      [z(-p[1]), z(-p[0])],
                      [p[0], z(-p[1])],
                      [z(-p[0]), p[1]],
                    ]
                  : [
                      [p[1], p[0]],
                      [z(-p[0]), z(-p[1])],
                      [p[0], z(-p[1])],
                    ];
          const work =
            line.kind === "x"
              ? `Q = (2 \\cdot ${paren(line.c)} - ${paren(p[0])}, ${p[1]}) = ${pl(q)}`
              : line.kind === "y"
                ? `Q = (${p[0]}, 2 \\cdot ${paren(line.c)} - ${paren(p[1])}) = ${pl(q)}`
                : `Q = ${pl(q)}`;
          return pointProblem({
            prompt: t(
              `The line $${symLineLatex(line)}$ is a line of symmetry of a figure, and $P${pl(p)}$ is a vertex of the figure. The reflection across the line maps $P$ to another vertex $Q$. Find the coordinates of $Q$.`,
              `直线 $${symLineLatex(line)}$ 是一个图形的对称轴，$P${pl(p)}$ 是图形的一个顶点。关于这条直线的轴对称把 $P$ 映到另一个顶点 $Q$。求 $Q$ 的坐标。`,
            ),
            answer: q,
            wrong,
            solution: t(
              `Reflect $P$ across $${symLineLatex(line)}$:${steps(work)}`,
              `把 $P$ 关于 $${symLineLatex(line)}$ 作轴对称：${steps(work)}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-a-line-of-symmetry",
      title: t("Finding a line of symmetry", "求对称轴"),
      explanation: t(
        "A vertical line of symmetry $x = a$ passes halfway between each pair of matching points: $a$ is the average of their $x$-coordinates. A horizontal line $y = b$ works the same way with $y$-coordinates.\n\nIn a kite with vertices $(1, 5)$, $(4, 2)$, $(1, -4)$ and $(-2, 2)$, the points $(4, 2)$ and $(-2, 2)$ match, and $\\frac{4 + (-2)}{2} = 1$. The line of symmetry is $x = 1$, which also passes through the other two vertices.",
        "竖直的对称轴 $x = a$ 从每一对对应点的正中间穿过：$a$ 是它们 $x$ 坐标的平均数。水平的对称轴 $y = b$ 同理，用 $y$ 坐标。\n\n在顶点为 $(1, 5)$、$(4, 2)$、$(1, -4)$、$(-2, 2)$ 的筝形中，$(4, 2)$ 与 $(-2, 2)$ 相对应，$\\frac{4 + (-2)}{2} = 1$。对称轴是 $x = 1$，它也经过另外两个顶点。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.nonZero(-3, 3);
          const kind = rng.int(0, 2);
          let local: XY[];
          let shapeName: Text;
          if (kind === 0) {
            const [w, y1, y2] = [rng.int(1, 4), rng.int(-6, 6), rng.int(-6, 6)];
            if (Math.abs(y2 - y1) < 3) continue;
            local = [
              [-w, y1],
              [w, y1],
              [0, y2],
            ];
            shapeName = t("isosceles triangle", "等腰三角形");
          } else if (kind === 1) {
            const [w, y0, y1, y2] = [rng.int(1, 4), rng.int(2, 7), rng.int(-2, 2), rng.int(-7, -3)];
            if (y0 - y1 === y1 - y2 || y0 - y1 < 2) continue;
            local = [
              [0, y0],
              [w, y1],
              [0, y2],
              [-w, y1],
            ];
            shapeName = t("kite", "筝形");
          } else {
            const [w1, w2, y1, y2] = [rng.int(1, 4), rng.int(1, 4), rng.int(-6, 0), rng.int(1, 6)];
            if (w1 === w2) continue;
            local = [
              [-w1, y1],
              [w1, y1],
              [w2, y2],
              [-w2, y2],
            ];
            shapeName = t("isosceles trapezoid", "等腰梯形");
          }
          const vertical = rng.bool();
          const pts: XY[] = local.map(([u, w]) => (vertical ? [a + u, w] : [w, a + u]));
          if (!pts.every((p) => Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7)) continue;
          const v = vertical ? "x" : "y";
          const other = vertical ? "y" : "x";
          const [p1, p2] = [pts[0]!, pts[kind === 1 ? 3 : 1]!];
          const ci = vertical ? 0 : 1;
          return {
            ...equationProblem({
              prompt: t(
                `The ${shapeName.en} shown has one line of symmetry. Find its equation.`,
                `图中的${shapeName["zh-CN"]}有一条对称轴。求它的方程。`,
              ),
              answer: `${v} = ${a}`,
              wrong: [`${other} = ${a}`, `${v} = ${-a}`, `${v} = ${p1[ci]}`],
              solution: t(
                `The vertices $${pl(p1)}$ and $${pl(p2)}$ match across the line, which passes halfway between them:${steps(`${v} = \\frac{${p1[ci]} + ${paren(p2[ci]!)}}{2} = ${a}`)}`,
                `顶点 $${pl(p1)}$ 与 $${pl(p2)}$ 关于这条直线对应，直线从它们正中间穿过：${steps(`${v} = \\frac{${p1[ci]} + ${paren(p2[ci]!)}}{2} = ${a}`)}`,
              ),
            }),
            figure: graph(
              outline(pts),
              `An ${shapeName.en} on a coordinate grid with vertices ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
              `坐标网格上的${shapeName["zh-CN"]}，顶点为 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
            ),
          };
        }
      },
    },
  ],
};

/** rotationalSymmetry finds orders and angles of rotational symmetry and uses them in the coordinate plane. */
export const rotationalSymmetry: TopicDef = {
  id: "rotational-symmetry",
  title: t("Rotational Symmetry", "旋转对称性"),
  summary: t(
    "Find the order of rotational symmetry of polygons and the angles of rotation that map them onto themselves, and find points paired by rotational symmetry in the coordinate plane.",
    "求多边形旋转对称的阶数和把它映到自身的旋转角，并求坐标平面中旋转对称配对的点。",
  ),
  prerequisites: ["reflective-symmetry", "rotations-of-geometric-figures"],
  encompasses: [
    { topic: "rotations-of-geometric-figures", weight: 0.3 },
    { topic: "reflective-symmetry", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.3"],
  knowledgePoints: [
    {
      id: "order-of-rotational-symmetry",
      title: t("Order of rotational symmetry", "旋转对称的阶数"),
      explanation: t(
        "A figure has **rotational symmetry** when a rotation about its center by less than $360^\\circ$ maps it onto itself. The **order** is the number of positions in one full turn in which the figure looks exactly the same, counting the starting position. A figure with no rotational symmetry has order $1$.\n\n- A regular polygon with $n$ sides has order $n$.\n- A rectangle, a rhombus and any parallelogram have order $2$: a half turn maps each onto itself.\n- An isosceles triangle, a kite and a trapezoid have order $1$, although some have a line of symmetry.",
        "如果绕中心旋转一个小于 $360^\\circ$ 的角能把图形映到它自身，这个图形就具有**旋转对称性**。**阶数**是旋转一整圈的过程中，图形看起来完全相同的位置的个数（包括起始位置）。没有旋转对称性的图形阶数为 $1$。\n\n- $n$ 条边的正多边形阶数为 $n$。\n- 长方形、菱形和任何平行四边形阶数为 $2$：转半圈就把它们映到自身。\n- 等腰三角形、筝形和梯形阶数为 $1$，尽管其中有些有对称轴。",
      ),
      generate(rng) {
        const s = pickShape(rng);
        return {
          ...numberProblem({
            prompt: t(`What is the order of rotational symmetry of this ${s.name.en}?`, `这个${s.name["zh-CN"]}旋转对称的阶数是多少？`),
            answer: s.order,
            form: "integer",
            wrong: s.wrongOrder,
            solution: t(
              s.order === 1
                ? `No rotation by less than $360^\\circ$ maps a ${s.name.en} onto itself, so its order is $1$.`
                : `A rotation by $${360 / s.order}^\\circ$ about the center maps the ${s.name.en} onto itself, and it looks the same in $${s.order}$ positions in a full turn: the order is $${s.order}$.`,
              s.order === 1
                ? `没有小于 $360^\\circ$ 的旋转能把${s.name["zh-CN"]}映到自身，所以阶数是 $1$。`
                : `绕中心旋转 $${360 / s.order}^\\circ$ 能把${s.name["zh-CN"]}映到自身，旋转一整圈有 $${s.order}$ 个位置看起来相同：阶数是 $${s.order}$。`,
            ),
          }),
          figure: shapeFigure(rng, s),
        };
      },
    },
    {
      id: "angles-of-rotational-symmetry",
      title: t("Angles of rotational symmetry", "旋转对称的角"),
      explanation: t(
        "A figure of order $n$ maps onto itself under a rotation by $\\frac{360^\\circ}{n}$ and by every multiple of it. For a regular polygon with $n$ sides, the smallest such angle is $\\frac{360^\\circ}{n}$.\n\nA regular pentagon maps onto itself under rotations of $72^\\circ$, $144^\\circ$, $216^\\circ$ and $288^\\circ$, but not $90^\\circ$. If the smallest angle is $40^\\circ$, the polygon has $\\frac{360}{40} = 9$ sides.",
        "阶数为 $n$ 的图形在旋转 $\\frac{360^\\circ}{n}$ 及其任何倍数时都映到自身。对于 $n$ 条边的正多边形，最小的这种角是 $\\frac{360^\\circ}{n}$。\n\n正五边形旋转 $72^\\circ$、$144^\\circ$、$216^\\circ$、$288^\\circ$ 时映到自身，旋转 $90^\\circ$ 时则不会。若最小的角是 $40^\\circ$，这个正多边形有 $\\frac{360}{40} = 9$ 条边。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 8, 9, 10, 12]);
        const [en, zh] = regularNames[n]!;
        const step = 360 / n;
        const variant = rng.int(0, 2);
        if (variant === 0) {
          return numberProblem({
            prompt: t(
              `What is the smallest positive angle of rotation about its center that maps a ${en} onto itself?`,
              `绕中心旋转把${zh}映到自身的最小正角是多少度？`,
            ),
            answer: step,
            unit: "°",
            wrong: [Q.of((n - 2) * 180, n), Q.of(180, n), n],
            solution: t(
              `A ${en} has order $${n}$, so the smallest angle divides the full turn into $${n}$ equal parts:${steps(`\\frac{360^\\circ}{${n}} = ${step}^\\circ`)}`,
              `${zh}的阶数是 $${n}$，所以最小的角把一整圈平均分成 $${n}$ 份：${steps(`\\frac{360^\\circ}{${n}} = ${step}^\\circ`)}`,
            ),
          });
        }
        if (variant === 1) {
          return numberProblem({
            prompt: t(
              `The smallest positive rotation about its center that maps a regular polygon onto itself is $${step}^\\circ$. How many sides does the polygon have?`,
              `绕中心旋转把一个正多边形映到自身的最小正角是 $${step}^\\circ$。这个正多边形有几条边？`,
            ),
            answer: n,
            form: "integer",
            wrong: [Q.of(180, step), 2 * n, Q.of(360 - step, step)],
            solution: t(
              `The smallest angle is $\\frac{360^\\circ}{n}$, so${steps(`n = \\frac{360}{${step}} = ${n}`)}`,
              `最小的角是 $\\frac{360^\\circ}{n}$，所以${steps(`n = \\frac{360}{${step}} = ${n}`)}`,
            ),
          });
        }
        const maps = rng.bool();
        const angle = maps
          ? step * rng.int(1, n - 1)
          : rng.pick(
              [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 120, 135, 150, 160, 180, 200, 210, 240, 270].filter(
                (a) => a % step !== 0,
              ),
            );
        const ok = angle % step === 0;
        return choiceProblem({
          prompt: t(
            `Does a rotation of $${angle}^\\circ$ about its center map a ${en} onto itself?`,
            `绕中心旋转 $${angle}^\\circ$ 能把${zh}映到自身吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `The rotations that map a ${en} onto itself are the multiples of $\\frac{360^\\circ}{${n}} = ${step}^\\circ$. ${ok ? `$${angle} = ${angle / step} \\cdot ${step}$, so yes.` : `$${angle}$ is not a multiple of $${step}$, so no.`}`,
            `能把${zh}映到自身的旋转是 $\\frac{360^\\circ}{${n}} = ${step}^\\circ$ 的倍数。${ok ? `$${angle} = ${angle / step} \\cdot ${step}$，所以能。` : `$${angle}$ 不是 $${step}$ 的倍数，所以不能。`}`,
          ),
        });
      },
    },
    {
      id: "rotational-symmetry-in-the-coordinate-plane",
      title: t("Rotational symmetry in the coordinate plane", "坐标平面中的旋转对称"),
      explanation: t(
        "If a figure has rotational symmetry about a center $C$, rotating any point of the figure about $C$ by an angle of symmetry gives another point of the figure.\n\n- Order $2$ about $C(a, b)$: a half turn maps $(x, y)$ to $(2a - x, 2b - y)$, since $C$ is the midpoint of each point and its image.\n- Order $4$ about the origin: a quarter turn counterclockwise maps $(x, y)$ to $(-y, x)$.\n\nA parallelogram with center $C(1, 2)$ and a vertex $(4, 7)$ has the opposite vertex $(2 - 4, 4 - 7) = (-2, -3)$.",
        "若图形关于中心 $C$ 旋转对称，把图形上任意一点绕 $C$ 旋转一个对称角，得到的仍是图形上的点。\n\n- 关于 $C(a, b)$ 阶数为 $2$：旋转半圈把 $(x, y)$ 映到 $(2a - x, 2b - y)$，因为 $C$ 是每个点与它的像的中点。\n- 关于原点阶数为 $4$：逆时针旋转四分之一圈把 $(x, y)$ 映到 $(-y, x)$。\n\n中心为 $C(1, 2)$、一个顶点为 $(4, 7)$ 的平行四边形，相对的顶点是 $(2 - 4, 4 - 7) = (-2, -3)$。",
      ),
      generate(rng) {
        for (;;) {
          const p: XY = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          if (Math.abs(p[0]) === Math.abs(p[1])) continue;
          if (rng.bool()) {
            const c: XY = [rng.int(-3, 3), rng.int(-3, 3)];
            if (c[0] === 0 && c[1] === 0) continue;
            const q: XY = [2 * c[0] - p[0], 2 * c[1] - p[1]];
            if (same2(p, q)) continue;
            const shape = rng.pick([t("parallelogram", "平行四边形"), t("rectangle", "长方形"), t("rhombus", "菱形")]);
            return pointProblem({
              prompt: t(
                `A ${shape.en} has its center at $C${pl(c)}$, and $P${pl(p)}$ is one of its vertices. A rotation of $180^\\circ$ about $C$ maps the ${shape.en} onto itself and $P$ to the opposite vertex $Q$. Find the coordinates of $Q$.`,
                `一个${shape["zh-CN"]}的中心是 $C${pl(c)}$，$P${pl(p)}$ 是它的一个顶点。绕 $C$ 旋转 $180^\\circ$ 把这个${shape["zh-CN"]}映到自身，并把 $P$ 映到相对的顶点 $Q$。求 $Q$ 的坐标。`,
              ),
              answer: q,
              wrong: [
                [z(-p[0]), z(-p[1])],
                [2 * c[0] + p[0], 2 * c[1] + p[1]],
                [c[0] - p[0], c[1] - p[1]],
              ],
              solution: t(
                `$C$ is the midpoint of $\\overline{PQ}$, so${steps(`Q = (2 \\cdot ${paren(c[0])} - ${paren(p[0])}, \\; 2 \\cdot ${paren(c[1])} - ${paren(p[1])}) = ${pl(q)}`)}`,
                `$C$ 是 $\\overline{PQ}$ 的中点，所以${steps(`Q = (2 \\cdot ${paren(c[0])} - ${paren(p[0])}, \\; 2 \\cdot ${paren(c[1])} - ${paren(p[1])}) = ${pl(q)}`)}`,
              ),
            });
          }
          const q: XY = [z(-p[1]), p[0]];
          const shape = rng.pick([t("square", "正方形"), t("figure", "图形")]);
          return pointProblem({
            prompt: t(
              `A ${shape.en} has rotational symmetry of order $4$ about the origin, and $P${pl(p)}$ is one of its vertices. Find the vertex $Q$ that $P$ is mapped to by a rotation of $90^\\circ$ counterclockwise about the origin.`,
              `一个${shape["zh-CN"]}关于原点旋转对称，阶数为 $4$，$P${pl(p)}$ 是它的一个顶点。求绕原点逆时针旋转 $90^\\circ$ 后 $P$ 映到的顶点 $Q$。`,
            ),
            answer: q,
            wrong: [
              [p[1], z(-p[0])],
              [z(-p[0]), z(-p[1])],
              [z(-p[1]), z(-p[0])],
            ],
            solution: t(
              `A quarter turn counterclockwise about the origin follows $(x, y) \\to (-y, x)$:${steps(`Q = (${z(-p[1])}, ${p[0]})`)}`,
              `绕原点逆时针旋转四分之一圈的规则是 $(x, y) \\to (-y, x)$：${steps(`Q = (${z(-p[1])}, ${p[0]})`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** transformationTopics are the further perpendicular-line proofs and the later transformation topics of Geometry unit 1, in teaching order. */
export const transformationTopics: readonly TopicDef[] = [
  furtherProvingPerpendicularLineTheorems,
  dilationsOfFiguresInTheCoordinatePlane,
  stretchesOfGeometricFigures,
  combiningStretchesOfGeometricFigures,
  combiningGeometricTransformations,
  reflectiveSymmetry,
  rotationalSymmetry,
];
