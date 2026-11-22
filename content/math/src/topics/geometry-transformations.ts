import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type PlaneView, type Point, paren, plane, Q, sketch } from "@ga/subject-math";
import { angleDrawings, motionDrawings } from "../explanation-drawings-angles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { tracked } from "../graph-figures.ts";
import { movedPoint, movedPolygon, viewAround } from "../motion-figures.ts";
import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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

/** markedPoints lists the labeled points of a graph for its alt text. */
const markedPoints = (marks: readonly PlaneMark[]): string =>
  marks.flatMap((mark) => (mark.kind === "point" && mark.label ? [`${mark.label} (${mark.at[0]}, ${mark.at[1]})`] : [])).join(", ");

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string, v: PlaneView = view): Figure => ({
  svg: plane(v, marks),
  alt: markedPoints(marks) ? t(`${en} Marked points: ${markedPoints(marks)}.`, `${zh}标出的点：${markedPoints(marks)}。`) : t(en, zh),
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

/** toPoint is a point with rational coordinates as numbers, for a figure. */
const toPoint = (p: QP): Point => [Number(p[0].n) / Number(p[0].d), Number(p[1].n) / Number(p[1].d)];

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

/** needs says what each reason must start from, for checks and for the reasons a wrong option fails. */
const needs: Record<Reason, Text> = {
  given: t("nothing: it is stated in the problem", "什么也不需要：题目已经给出"),
  angleAdd: t("a ray inside an angle", "角内部的一条射线"),
  linearPair: t("two adjacent angles whose outer sides form a line", "两个相邻且外边组成一条直线的角"),
  corr: t("two parallel lines and a pair of corresponding angles", "两条平行线和一对同位角"),
  vertical: t("two angles opposite each other where two lines cross", "两条直线相交处彼此相对的两个角"),
  congSupp: t("two angles supplementary to the same angle or to congruent angles", "与同一个角（或相等的角）互补的两个角"),
  congComp: t("two angles complementary to the same angle or to congruent angles", "与同一个角（或相等的角）互余的两个角"),
  rightCong: t("two right angles, to conclude that they are congruent", "两个直角，由此得出它们全等"),
  transitive: t("two congruences that share a figure", "两个有公共图形的全等式"),
  subst: t("an equation and a quantity equal to one of its terms", "一个等式，以及与其中一项相等的量"),
  subtraction: t("an equation with the same number taken from both sides", "两边同减去同一个数的等式"),
  defCong: t("congruent angles, or angles with equal measures", "全等的角，或度数相等的角"),
  defRight: t("a right angle, or an angle measuring $90^\\circ$", "一个直角，或一个 $90^\\circ$ 的角"),
  defComp: t(
    "two complementary angles, or two angles whose measures add up to $90^\\circ$",
    "两个互余的角，或度数之和为 $90^\\circ$ 的两个角",
  ),
  defPerp: t("perpendicular lines, or lines meeting at a right angle", "互相垂直的直线，或相交成直角的直线"),
};

/** Marks are the facts a proof row adds to its figure: right angles and arcs, named by angle number or by "abc", "abd", "dbc". */
interface Marks {
  readonly right?: readonly string[];
  readonly arcs?: readonly string[];
}

/** Wrong is a wrong statement for a proof row, with what is wrong with it. */
type Wrong = readonly [statement: Text, why: Text];

/** Step is one row of a two-column proof: a statement, its reason, how the reason applies, what it adds to the figure, and wrong statements for that row. */
interface Step {
  readonly s: Text;
  readonly r: Reason;
  readonly note?: Text;
  readonly adds?: Marks;
  readonly wrong?: readonly Wrong[];
}

/** Proof is a two-column proof with its figure, a drawing of its facts row by row, and reasons that are plausible but wrong for its steps. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly Step[];
  readonly figure: Figure;
  /** draw draws the figure with the facts of earlier rows (old) and of the current row (fresh) marked. */
  readonly draw: (old: Marks, fresh: Marks) => Figure;
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

/** addsAny tells whether marks put anything on a figure. */
const addsAny = (m?: Marks) => Boolean(m && ((m.arcs?.length ?? 0) > 0 || (m.right?.length ?? 0) > 0));

/** merged joins the marks of two rows. */
const merged = (a: Marks, b?: Marks): Marks => ({
  arcs: [...new Set([...(a.arcs ?? []), ...(b?.arcs ?? [])])],
  right: [...new Set([...(a.right ?? []), ...(b?.right ?? [])])],
});

/** join writes texts as paragraphs. */
const join = (paras: readonly Text[]) => t(paras.map((p) => p.en).join("\n\n"), paras.map((p) => p["zh-CN"]).join("\n\n"));

/** proofSolution walks a proof row by row, drawing each fact as it is added, explains the missing part of row k, and checks it. */
function proofSolution(p: Proof, k: number, part: "s" | "r"): { solution: Text; solutionFigures: Figure[] } {
  const figures: Figure[] = [];
  const paras: Text[] = [
    t(
      "Read the proof from the top. Each row must follow from the given facts or from rows above it, by the reason written beside it. The figures mark each fact as it is added: a small square for a right angle, and arcs for the angles a row is about, the newest in a second color.",
      "从上往下读证明。每一行都必须由已知条件或它上面的行、按旁边写的理由推出。图中随步骤标出每个新得到的事实：小方块表示直角，弧线表示这一行涉及的角，最新的一步用另一种颜色。",
    ),
  ];
  let old: Marks = {};
  p.steps.forEach((st, i) => {
    const head =
      i === k
        ? part === "r"
          ? t(`**Step ${i + 1}, the missing reason.**`, `**第 ${i + 1} 步，所缺的理由。**`)
          : t(`**Step ${i + 1}, the missing statement.**`, `**第 ${i + 1} 步，所缺的陈述。**`)
        : t(`**Step ${i + 1}.**`, `**第 ${i + 1} 步。**`);
    const body =
      st.r === "given"
        ? cat(st.s, t(" — Given: the proof may start from it.", " — 已知：证明可以直接从它出发。"))
        : i === k
          ? cat(st.s, " — ", reasons[st.r], t(": ", "："), why[st.r], t(".", "。"))
          : cat(st.s, " — ", reasons[st.r], t(". ", "。"), st.note ?? t(`${cap(why[st.r].en)}.`, `${why[st.r]["zh-CN"]}。`));
    let para = cat(head, " ", body);
    if (addsAny(st.adds)) {
      para = cat(para, `\n\n{{figure ${figures.length}}}`);
      figures.push(p.draw(old, st.adds!));
      old = merged(old, st.adds);
    }
    paras.push(para);
  });
  const st = p.steps[k]!;
  paras.push(
    part === "r"
      ? t(`So the missing reason is the ${reasons[st.r].en}.`, `所以所缺的理由是“${reasons[st.r]["zh-CN"]}”。`)
      : cat(t("So the missing statement is ", "所以所缺的陈述是 "), st.s, t(".", "。")),
  );
  paras.push(
    cat(
      t("**Check.** ", "**检验。** "),
      t(`The ${reasons[st.r].en} applies only to ${needs[st.r].en}. `, `“${reasons[st.r]["zh-CN"]}”只适用于${needs[st.r]["zh-CN"]}。`),
      ...(st.note ? [st.note] : []),
      k < p.steps.length - 1
        ? t(
            " The rows below build on this one, and the last row is the statement to prove.",
            "下面的行都以这一行为基础，最后一行正是要证明的结论。",
          )
        : t(" This last row is exactly the statement to prove.", "这最后一行正是要证明的结论。"),
    ),
  );
  return { solution: join(paras), solutionFigures: figures };
}

/** reasonWrong says why a wrong reason does not justify row k. */
function reasonWrong(k: number, r: Reason): Text {
  if (r === "corr")
    return t(
      "It needs two parallel lines cut by a transversal, and this figure has no parallel lines.",
      "它需要两条被截线所截的平行线，而这个图形中没有平行线。",
    );
  return t(
    `It needs ${needs[r].en}, and that is not what step ${k + 1} rests on.`,
    `它需要${needs[r]["zh-CN"]}，而第 ${k + 1} 步依据的不是这个。`,
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
  const { solution, solutionFigures } = proofSolution(p, k, part);
  if (part === "r") {
    const pool = [...new Set([...p.distract, ...p.steps.map((s) => s.r)])].filter((r) => r !== st.r && r !== "given");
    const picked = new Set([st.r, ...rng.sample(pool, 3)]);
    const options = reasonOrder.filter((r) => picked.has(r));
    return {
      ...reasoned(
        choiceProblem({
          prompt: proofPrompt(p, k, "r"),
          options: options.map((r) => reasons[r]),
          correct: options.indexOf(st.r),
          solution,
        }),
        options.filter((r) => r !== st.r).map((r) => [reasons[r].en, reasonWrong(k, r).en, reasonWrong(k, r)["zh-CN"]] as const),
      ),
      figure: p.figure,
      solutionFigures,
    };
  }
  const wrong = rng.sample(st.wrong!, 3);
  const options = rng.shuffle([st.s, ...wrong.map((w) => w[0])]);
  return {
    ...reasoned(
      choiceProblem({ prompt: proofPrompt(p, k, "s"), options, correct: options.indexOf(st.s), solution }),
      wrong.map((w) => [w[0].en, w[1].en, w[1]["zh-CN"]] as const),
    ),
    figure: p.figure,
    solutionFigures,
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

/** Shade is how an arc is drawn: as a fact found earlier (accent) or by the current step (result). */
type Shade = "accent" | "result";

/** CrossMarks say what a drawing of the crossing of ℓ and t shows. */
interface CrossMarks {
  readonly numbers: boolean;
  readonly right?: readonly number[];
  readonly arcs?: readonly (readonly [number, Shade])[];
  readonly label?: readonly [number, string];
}

/** crossFigure draws lines ℓ and t crossing at right angles, turned by phi degrees. */
function crossFigure(phi: number, o: CrossMarks, en: string, zh: string): Figure {
  const r = (p: Point) => turn(p, phi);
  const c: Point = [0, 0];
  const sides = (n: number): [Point, Point] => {
    const mid = quadrantMid[n]!;
    return [r(dir(mid - 45, 3)), r(dir(mid + 45, 3))];
  };
  const marks: Mark[] = [
    { kind: "segment", a: r([-4, 0]), b: r([4, 0]) },
    { kind: "label", at: r([4, 0]), text: "ℓ", dir: compassOf(phi) },
    { kind: "segment", a: r([0, -4]), b: r([0, 4]) },
    { kind: "label", at: r([0, 4]), text: "t", dir: compassOf(phi + 90), italic: true },
  ];
  for (const n of o.right ?? []) {
    const [from, to] = sides(n);
    marks.push({ kind: "right", vertex: c, from, to });
  }
  for (const [n, shade] of o.arcs ?? []) {
    const [from, to] = sides(n);
    marks.push({ kind: "arc", vertex: c, from, to, ...(shade === "result" ? { tone: "result" as const } : { accent: true }) });
  }
  if (o.label) {
    const [from, to] = sides(o.label[0]);
    marks.push({ kind: "arc", vertex: c, from, to, label: o.label[1], accent: true });
  }
  if (o.numbers) {
    for (const n of [1, 2, 3, 4]) {
      const mid = quadrantMid[n]!;
      marks.push({ kind: "label", at: dir(mid + phi, 1.1), text: String(n), dir: compassOf(mid + phi) });
    }
  }
  return figure(marks, en, zh);
}

/** angleList writes angles for alt text: "∠3, ∠ABD". */
const angleList = (ns: readonly string[]) => ns.map((n) => `∠${n}`).join(", ");

/** stepNote writes the alt-text tail of a proof drawing: what this step marks and what was marked before. */
function stepNote(added: readonly string[], before: readonly string[]): Text {
  return t(
    `${added.length > 0 ? ` Marked by this step: ${angleList(added)}.` : ""}${before.length > 0 ? ` Marked earlier: ${angleList(before)}.` : ""}`,
    `${added.length > 0 ? `这一步标出：${angleList(added)}。` : ""}${before.length > 0 ? `此前标出：${angleList(before)}。` : ""}`,
  );
}

/** crossScene draws the numbered crossing of perpendicular lines for a proof, with the facts of its rows marked; a right angle found by the current row also gets an arc in the second color. */
function crossScene(phi: number) {
  return (old: Marks, fresh: Marks): Figure => {
    const right = [...new Set([...(old.right ?? []), ...(fresh.right ?? [])])].map(Number);
    const added = [...new Set([...(fresh.arcs ?? []), ...(fresh.right ?? [])])];
    const before = [...new Set([...(old.arcs ?? []), ...(old.right ?? [])])].filter((n) => !added.includes(n));
    const arcs: [number, Shade][] = [
      ...(old.arcs ?? []).filter((n) => !added.includes(n)).map((n): [number, Shade] => [Number(n), "accent"]),
      ...added.map((n): [number, Shade] => [Number(n), "result"]),
    ];
    const note = stepNote(added, before);
    return crossFigure(
      phi,
      { numbers: true, right, arcs },
      `Lines ℓ and t crossing at right angles, with the four angles numbered 1 to 4.${note.en}`,
      `直线 ℓ 与 t 垂直相交，四个角编号为 1 到 4。${note["zh-CN"]}`,
    );
  };
}

const isRight = (n: number | string) => t(`$\\angle ${n}$ is a right angle`, `$\\angle ${n}$ 是直角`);
const measure = (n: number | string, v: number | string) => same(`$m\\angle ${n} = ${v}^\\circ$`);
const lt = same("$\\ell \\perp t$");

/** numberedCross draws the numbered crossing of perpendicular lines ℓ and t, with a right angle marked at angle a. */
function numberedCross(phi: number, a: number): Figure {
  return crossFigure(
    phi,
    { numbers: true, right: [a] },
    `Lines ℓ and t crossing at a right angle, with the four angles numbered 1 to 4 and angle ${a} marked as a right angle.`,
    `直线 ℓ 与 t 垂直相交，四个角编号为 1 到 4，∠${a} 标为直角。`,
  );
}

/** wrongRightAt are false statements a learner may confuse with "∠n is a right angle" where perpendicular lines cross. */
const wrongRightAt = (n: number | string): Wrong[] => [
  [
    t(`$\\angle ${n}$ is an acute angle`, `$\\angle ${n}$ 是锐角`),
    t(
      `Perpendicular lines meet at exactly $90^\\circ$, and a right angle is not acute.`,
      `垂直的直线恰好相交成 $90^\\circ$，直角不是锐角。`,
    ),
  ],
  [
    t(`$\\angle ${n}$ is an obtuse angle`, `$\\angle ${n}$ 是钝角`),
    t(
      `Perpendicular lines meet at exactly $90^\\circ$, and a right angle is not obtuse.`,
      `垂直的直线恰好相交成 $90^\\circ$，直角不是钝角。`,
    ),
  ],
  [
    t(`$\\angle ${n}$ is a straight angle`, `$\\angle ${n}$ 是平角`),
    t(
      `A straight angle has both sides along one line; $\\angle ${n}$ has one side on $\\ell$ and the other on $t$.`,
      `平角的两边在同一条直线上；而 $\\angle ${n}$ 一边在 $\\ell$ 上，另一边在 $t$ 上。`,
    ),
  ],
];

/** linearPairRightProof proves that the angle forming a linear pair with a right angle is a right angle. */
function linearPairRightProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const b = rng.bool() ? acrossT(a) : acrossLine(a);
  const along = acrossT(a) === b ? "\\ell" : "t";
  const phi = rng.int(-30, 30);
  return {
    given: lt,
    prove: isRight(b),
    steps: [
      { s: lt, r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        note: t(
          `Step 1 gives $\\ell \\perp t$, and $\\angle ${a}$ is one of the four angles where they cross.`,
          `第 1 步给出 $\\ell \\perp t$，而 $\\angle ${a}$ 是它们相交处的四个角之一。`,
        ),
        adds: { right: [String(a)] },
        wrong: wrongRightAt(a),
      },
      {
        s: measure(a, 90),
        r: "defRight",
        note: t(
          `Step 2 says $\\angle ${a}$ is a right angle, and a right angle measures $90^\\circ$.`,
          `第 2 步说 $\\angle ${a}$ 是直角，而直角是 $90^\\circ$。`,
        ),
        wrong: [
          [measure(a, 180), t("$180^\\circ$ is a straight angle, not a right angle.", "$180^\\circ$ 是平角，不是直角。")],
          [measure(a, 45), t("$45^\\circ$ is half a right angle.", "$45^\\circ$ 只是直角的一半。")],
          [measure(a, 360), t("$360^\\circ$ is a full turn, all four angles together.", "$360^\\circ$ 是一整圈，是四个角合在一起。")],
        ],
      },
      {
        s: same(`$m\\angle ${a} + m\\angle ${b} = 180^\\circ$`),
        r: "linearPair",
        note: t(
          `$\\angle ${a}$ and $\\angle ${b}$ sit side by side, and their outer sides together form the line $${along}$.`,
          `$\\angle ${a}$ 与 $\\angle ${b}$ 相邻，它们的外边合起来是直线 $${along}$。`,
        ),
        adds: { arcs: [String(b)] },
        wrong: [
          [
            same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
            t(
              "A sum of $90^\\circ$ makes angles complementary; a linear pair fills a straight line, $180^\\circ$.",
              "和为 $90^\\circ$ 是互余；邻补角合成一个平角，和为 $180^\\circ$。",
            ),
          ],
          [
            same(`$m\\angle ${a} + m\\angle ${b} = 360^\\circ$`),
            t(
              "$360^\\circ$ is the sum of all four angles around the crossing, not of two.",
              "$360^\\circ$ 是交点周围四个角的和，不是两个角的和。",
            ),
          ],
          [
            same(`$m\\angle ${a} - m\\angle ${b} = 180^\\circ$`),
            t("The postulate adds the two measures; it does not subtract them.", "这条公设是把两个度数相加，不是相减。"),
          ],
        ],
      },
      {
        s: same(`$90^\\circ + m\\angle ${b} = 180^\\circ$`),
        r: "subst",
        note: t(
          `Step 3 gives $m\\angle ${a} = 90^\\circ$, so $90^\\circ$ takes the place of $m\\angle ${a}$ in step 4.`,
          `第 3 步给出 $m\\angle ${a} = 90^\\circ$，所以在第 4 步中用 $90^\\circ$ 替换 $m\\angle ${a}$。`,
        ),
        wrong: [
          [
            same(`$90^\\circ + m\\angle ${b} = 90^\\circ$`),
            t(
              `Substitution replaces only $m\\angle ${a}$; the right side of step 4 stays $180^\\circ$.`,
              `代换只替换 $m\\angle ${a}$；第 4 步的右边仍是 $180^\\circ$。`,
            ),
          ],
          [
            same(`$180^\\circ + m\\angle ${b} = 90^\\circ$`),
            t(
              `$m\\angle ${a}$ is $90^\\circ$, not $180^\\circ$, and the sum is $180^\\circ$.`,
              `$m\\angle ${a}$ 是 $90^\\circ$，不是 $180^\\circ$，而和是 $180^\\circ$。`,
            ),
          ],
          [
            same(`$90^\\circ \\cdot m\\angle ${b} = 180^\\circ$`),
            t("Step 4 adds the measures, and substitution keeps the plus sign.", "第 4 步是相加，代换时加号保持不变。"),
          ],
        ],
      },
      {
        s: measure(b, 90),
        r: "subtraction",
        note: t(
          "Subtracting $90^\\circ$ from both sides of step 5 leaves $180^\\circ - 90^\\circ = 90^\\circ$.",
          "第 5 步两边同减去 $90^\\circ$，得 $180^\\circ - 90^\\circ = 90^\\circ$。",
        ),
        adds: { right: [String(b)] },
        wrong: [
          [measure(b, 270), t("That adds $90^\\circ$ instead of subtracting it.", "这是加上了 $90^\\circ$，而不是减去。")],
          [
            measure(b, 180),
            t(`That forgets to take away the $90^\\circ$ of $\\angle ${a}$.`, `这忘了减去 $\\angle ${a}$ 的 $90^\\circ$。`),
          ],
          [
            measure(b, 2),
            t("That divides $180$ by $90$; step 5 is a sum, so subtract.", "这是用 $180$ 除以 $90$；第 5 步是和，应当相减。"),
          ],
        ],
      },
      { s: isRight(b), r: "defRight" },
    ],
    figure: numberedCross(phi, a),
    draw: crossScene(phi),
    distract: ["vertical", "rightCong", "congSupp", "defComp", "angleAdd", "defCong"],
  };
}

/** verticalRightProof proves that the angle vertical to a right angle is a right angle. */
function verticalRightProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const c = vert(a);
  const phi = rng.int(-30, 30);
  return {
    given: lt,
    prove: isRight(c),
    steps: [
      { s: lt, r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        note: t(
          `Step 1 gives $\\ell \\perp t$, and $\\angle ${a}$ is one of the four angles where they cross.`,
          `第 1 步给出 $\\ell \\perp t$，而 $\\angle ${a}$ 是它们相交处的四个角之一。`,
        ),
        adds: { right: [String(a)] },
        wrong: wrongRightAt(a),
      },
      {
        s: same(`$\\angle ${a} \\cong \\angle ${c}$`),
        r: "vertical",
        note: t(
          `$\\angle ${a}$ and $\\angle ${c}$ are opposite each other where $\\ell$ and $t$ cross.`,
          `$\\angle ${a}$ 与 $\\angle ${c}$ 在 $\\ell$ 与 $t$ 的交点处彼此相对。`,
        ),
        adds: { arcs: [String(c)] },
        wrong: [
          [
            t(`$\\angle ${a}$ and $\\angle ${c}$ form a linear pair`, `$\\angle ${a}$ 与 $\\angle ${c}$ 是邻补角`),
            t("They share only the vertex: they are opposite each other, not side by side.", "它们只有公共顶点：它们彼此相对，并不相邻。"),
          ],
          [
            t(`$\\angle ${a}$ and $\\angle ${c}$ are complementary`, `$\\angle ${a}$ 与 $\\angle ${c}$ 互余`),
            t("Nothing here adds up to $90^\\circ$; vertical angles are congruent.", "这里没有和为 $90^\\circ$ 的两个角；对顶角全等。"),
          ],
          [
            same(`$m\\angle ${a} = 2m\\angle ${c}$`),
            t("Vertical angles are congruent, so neither is twice the other.", "对顶角全等，所以不会一个是另一个的两倍。"),
          ],
        ],
      },
      {
        s: same(`$m\\angle ${c} = m\\angle ${a}$`),
        r: "defCong",
        note: t(
          `Step 3 gives $\\angle ${a} \\cong \\angle ${c}$, and congruent angles have equal measures.`,
          `第 3 步给出 $\\angle ${a} \\cong \\angle ${c}$，而全等的角度数相等。`,
        ),
        wrong: [
          [same(`$m\\angle ${c} = 2m\\angle ${a}$`), t("Congruent angles have equal measures.", "全等的角度数相等。")],
          [
            same(`$m\\angle ${c} + m\\angle ${a} = 90^\\circ$`),
            t(
              "Congruent angles have equal measures; nothing says they add up to $90^\\circ$.",
              "全等的角度数相等；没有条件说它们的和是 $90^\\circ$。",
            ),
          ],
          [
            same(`$m\\angle ${c} = 180^\\circ + m\\angle ${a}$`),
            t(
              "No angle between two crossing lines measures more than $180^\\circ$; the measures are equal.",
              "两条相交直线之间的角都不超过 $180^\\circ$；两个度数相等。",
            ),
          ],
        ],
      },
      {
        s: measure(c, 90),
        r: "subst",
        note: t(
          `$\\angle ${a}$ is a right angle by step 2, so $m\\angle ${a} = 90^\\circ$ takes its place in step 4.`,
          `由第 2 步，$\\angle ${a}$ 是直角，所以在第 4 步中用 $90^\\circ$ 替换 $m\\angle ${a}$。`,
        ),
        adds: { right: [String(c)] },
        wrong: [
          [
            measure(c, 180),
            t(
              `Step 4 makes $m\\angle ${c}$ equal to $m\\angle ${a}$, which is $90^\\circ$.`,
              `第 4 步说 $m\\angle ${c}$ 等于 $m\\angle ${a}$，即 $90^\\circ$。`,
            ),
          ],
          [
            measure(c, 45),
            t("Equal measures means the whole $90^\\circ$, not half of it.", "度数相等就是整整 $90^\\circ$，不是它的一半。"),
          ],
          [
            measure(c, 270),
            t("$270^\\circ$ is what is left of a full turn; vertical angles are equal.", "$270^\\circ$ 是一整圈剩下的部分；对顶角相等。"),
          ],
        ],
      },
      { s: isRight(c), r: "defRight" },
    ],
    figure: numberedCross(phi, a),
    draw: crossScene(phi),
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

/** SplitMarks say what a drawing of the rays BA, BD, BC shows: labels for ∠ABD and ∠DBC, a right angle at ABC, and arcs at "abd", "dbc" or "abc". */
interface SplitMarks {
  readonly labels?: readonly [string, string];
  readonly right?: boolean;
  readonly arcs?: readonly (readonly [string, Shade])[];
}

/** splitAngleFigure draws rays BC (at base degrees), BD (at base + split) and BA (at base + 90°) from B, with what o asks marked. */
function splitAngleFigure(base: number, split: number, n: Names, o: SplitMarks = {}, note?: Text): Figure {
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
  if (o.right) marks.push({ kind: "right", vertex: b, from: pc, to: pa });
  const ends: Record<string, [Point, Point]> = { abd: [pd, pa], dbc: [pc, pd], abc: [pc, pa] };
  for (const [key, shade] of o.arcs ?? []) {
    const [from, to] = ends[key]!;
    marks.push({ kind: "arc", vertex: b, from, to, ...(shade === "result" ? { tone: "result" as const } : { accent: true }) });
  }
  if (o.labels) {
    marks.push(
      { kind: "arc", vertex: b, from: pd, to: pa, label: o.labels[0], accent: true },
      { kind: "arc", vertex: b, from: pc, to: pd, label: o.labels[1], accent: true },
    );
  }
  const desc = `Rays ${n.b}${n.a}, ${n.b}${n.d} and ${n.b}${n.c} from ${n.b}, with ${n.b}${n.d} between the other two${o.right ? ` and angle ${n.a}${n.b}${n.c} marked as a right angle` : ""}`;
  const descZh = `从 ${n.b} 出发的射线 ${n.b}${n.a}、${n.b}${n.d}、${n.b}${n.c}，${n.b}${n.d} 在另外两条之间${o.right ? `，∠${n.a}${n.b}${n.c} 标为直角` : ""}`;
  const tail = o.labels
    ? t(
        `; angle ${n.a}${n.b}${n.d} is marked ${o.labels[0]} and angle ${n.d}${n.b}${n.c} is marked ${o.labels[1]}.`,
        `；∠${n.a}${n.b}${n.d} 标为 ${o.labels[0]}，∠${n.d}${n.b}${n.c} 标为 ${o.labels[1]}。`,
      )
    : t(".", "。");
  return figure(marks, `${desc}${tail.en}${note?.en ?? ""}`, `${descZh}${tail["zh-CN"]}${note?.["zh-CN"] ?? ""}`);
}

/** splitScene draws the rays of a proof about ∠ABC with the facts of its rows marked. */
function splitScene(base: number, split: number, n: Names) {
  const name = (key: string) => (key === "abd" ? `${n.a}${n.b}${n.d}` : key === "dbc" ? `${n.d}${n.b}${n.c}` : `${n.a}${n.b}${n.c}`);
  return (old: Marks, fresh: Marks): Figure => {
    const right = [...(old.right ?? []), ...(fresh.right ?? [])].includes("abc");
    const added = [...new Set([...(fresh.arcs ?? []), ...(fresh.right ?? [])])];
    const before = [...new Set([...(old.arcs ?? []), ...(old.right ?? [])])].filter((k) => !added.includes(k));
    const arcs: [string, Shade][] = [
      ...(old.arcs ?? []).filter((k) => !added.includes(k)).map((k): [string, Shade] => [k, "accent"]),
      ...added.map((k): [string, Shade] => [k, "result"]),
    ];
    return splitAngleFigure(base, split, n, { right, arcs }, stepNote(added.map(name), before.map(name)));
  };
}

/** pickSplit picks the direction of the middle ray, clearly away from the bisector. */
const pickSplit = (rng: Rng) => rng.pick([rng.int(22, 38), rng.int(52, 68)]);

/** angleStatements are the statements about ∠ABD, ∠DBC and ∠ABC used in the proofs, with wrong ones and what is wrong with them. */
function angleStatements(n: Names) {
  const abd = `${n.a}${n.b}${n.d}`;
  const dbc = `${n.d}${n.b}${n.c}`;
  const abc = `${n.a}${n.b}${n.c}`;
  const ray = `$\\overrightarrow{${n.b}${n.d}}$`;
  const perpRays = same(`$\\overrightarrow{${n.b}${n.a}} \\perp \\overrightarrow{${n.b}${n.c}}$`);
  const complementary = t(`$\\angle ${abd}$ and $\\angle ${dbc}$ are complementary`, `$\\angle ${abd}$ 与 $\\angle ${dbc}$ 互余`);
  const sum = (v: string) => same(`$m\\angle ${abd} + m\\angle ${dbc} = ${v}$`);
  const addition = sum(`m\\angle ${abc}`);
  const notStraight = t(
    `$\\angle ${abc}$ is not a straight angle: its sides do not lie along one line.`,
    `$\\angle ${abc}$ 不是平角：它的两边不在同一条直线上。`,
  );
  return {
    abd,
    dbc,
    abc,
    perpRays,
    complementary,
    sum,
    addition,
    wrongAddition: [
      [
        same(`$m\\angle ${abd} + m\\angle ${abc} = m\\angle ${dbc}$`),
        t(
          `$\\angle ${abc}$ is the whole angle, so it is the sum of the two parts, not one of the terms.`,
          `$\\angle ${abc}$ 是整个角，它是两部分之和，而不是其中一项。`,
        ),
      ],
      [
        same(`$m\\angle ${abd} = m\\angle ${dbc}$`),
        t(`Nothing says ${ray} splits the angle into equal parts; it is not a bisector.`, `没有条件说 ${ray} 把角平分；它不是角平分线。`),
      ],
      [sum("180^\\circ"), notStraight],
    ] as Wrong[],
    wrongSum: [
      [
        sum("180^\\circ"),
        t(
          "A sum of $180^\\circ$ would make the angles supplementary; together they fill a right angle.",
          "和为 $180^\\circ$ 是互补；这两个角合起来是一个直角。",
        ),
      ],
      [
        same(`$m\\angle ${abd} - m\\angle ${dbc} = 90^\\circ$`),
        t("The two parts are added to make the whole angle, not subtracted.", "两部分相加得到整个角，而不是相减。"),
      ],
      [
        same(`$m\\angle ${abd} = 90^\\circ + m\\angle ${dbc}$`),
        t(
          `$\\angle ${abd}$ is only part of a $90^\\circ$ angle, so it is less than $90^\\circ$.`,
          `$\\angle ${abd}$ 只是 $90^\\circ$ 角的一部分，所以小于 $90^\\circ$。`,
        ),
      ],
    ] as Wrong[],
    wrongRightAbc: [
      [
        isRight(abd),
        t(
          `$\\angle ${abd}$ is only one part of $\\angle ${abc}$: ${ray} lies inside it, so $\\angle ${abd}$ is less than $90^\\circ$.`,
          `$\\angle ${abd}$ 只是 $\\angle ${abc}$ 的一部分：${ray} 在它内部，所以 $\\angle ${abd}$ 小于 $90^\\circ$。`,
        ),
      ],
      [t(`$\\angle ${abc}$ is a straight angle`, `$\\angle ${abc}$ 是平角`), notStraight],
      [
        t(`$\\angle ${abc}$ is an acute angle`, `$\\angle ${abc}$ 是锐角`),
        t(
          `$\\angle ${abc}$ measures exactly $90^\\circ$ here, and an angle of $90^\\circ$ is not acute.`,
          `这里 $\\angle ${abc}$ 恰好是 $90^\\circ$，而 $90^\\circ$ 的角不是锐角。`,
        ),
      ],
    ] as Wrong[],
    wrongMeasureAbc: [
      [measure(abc, 180), notStraight],
      [
        measure(abd, 90),
        t(
          `$\\angle ${abd}$ is only part of $\\angle ${abc}$; the $90^\\circ$ belongs to the whole angle.`,
          `$\\angle ${abd}$ 只是 $\\angle ${abc}$ 的一部分；$90^\\circ$ 属于整个角。`,
        ),
      ],
      [
        measure(abc, 45),
        t(
          `$45^\\circ$ is half a right angle; the whole angle $\\angle ${abc}$ measures $90^\\circ$.`,
          `$45^\\circ$ 是直角的一半；整个 $\\angle ${abc}$ 是 $90^\\circ$。`,
        ),
      ],
    ] as Wrong[],
  };
}

/** perpendicularSidesProof proves that adjacent angles whose outer sides are perpendicular are complementary. */
function perpendicularSidesProof(rng: Rng): Proof {
  const n = pickNames(rng);
  const s = angleStatements(n);
  const [base, split] = [rng.int(-30, 30), pickSplit(rng)];
  return {
    given: s.perpRays,
    prove: s.complementary,
    steps: [
      { s: s.perpRays, r: "given" },
      {
        s: isRight(s.abc),
        r: "defPerp",
        note: t(
          `Step 1 says the rays $\\overrightarrow{${n.b}${n.a}}$ and $\\overrightarrow{${n.b}${n.c}}$ are perpendicular, so the angle between them is a right angle.`,
          `第 1 步说射线 $\\overrightarrow{${n.b}${n.a}}$ 与 $\\overrightarrow{${n.b}${n.c}}$ 互相垂直，所以它们之间的角是直角。`,
        ),
        adds: { right: ["abc"] },
        wrong: s.wrongRightAbc,
      },
      {
        s: measure(s.abc, 90),
        r: "defRight",
        note: t(
          `Step 2 says $\\angle ${s.abc}$ is a right angle, and a right angle measures $90^\\circ$.`,
          `第 2 步说 $\\angle ${s.abc}$ 是直角，而直角是 $90^\\circ$。`,
        ),
        wrong: s.wrongMeasureAbc,
      },
      {
        s: s.addition,
        r: "angleAdd",
        note: t(
          `$\\overrightarrow{${n.b}${n.d}}$ lies inside $\\angle ${s.abc}$ and splits it into $\\angle ${s.abd}$ and $\\angle ${s.dbc}$.`,
          `$\\overrightarrow{${n.b}${n.d}}$ 在 $\\angle ${s.abc}$ 内部，把它分成 $\\angle ${s.abd}$ 和 $\\angle ${s.dbc}$。`,
        ),
        adds: { arcs: ["abd", "dbc"] },
        wrong: s.wrongAddition,
      },
      {
        s: s.sum("90^\\circ"),
        r: "subst",
        note: t(
          `Step 3 gives $m\\angle ${s.abc} = 90^\\circ$, so $90^\\circ$ takes its place in step 4.`,
          `第 3 步给出 $m\\angle ${s.abc} = 90^\\circ$，所以在第 4 步中用 $90^\\circ$ 替换它。`,
        ),
        wrong: s.wrongSum,
      },
      { s: s.complementary, r: "defComp" },
    ],
    figure: splitAngleFigure(base, split, n, { right: true }),
    draw: splitScene(base, split, n),
    distract: ["linearPair", "congComp", "vertical", "defCong", "subtraction", "rightCong"],
  };
}

/** complementaryConverseProof proves that the outer sides of adjacent complementary angles are perpendicular. */
function complementaryConverseProof(rng: Rng): Proof {
  const n = pickNames(rng);
  const s = angleStatements(n);
  const [base, split] = [rng.int(-30, 30), pickSplit(rng)];
  return {
    given: s.complementary,
    prove: s.perpRays,
    steps: [
      { s: s.complementary, r: "given", adds: { arcs: ["abd", "dbc"] } },
      {
        s: s.sum("90^\\circ"),
        r: "defComp",
        note: t(
          "Step 1 says the two angles are complementary, so their measures add up to $90^\\circ$.",
          "第 1 步说两个角互余，所以它们的度数之和是 $90^\\circ$。",
        ),
        wrong: s.wrongSum,
      },
      {
        s: s.addition,
        r: "angleAdd",
        note: t(
          `$\\overrightarrow{${n.b}${n.d}}$ lies inside $\\angle ${s.abc}$ and splits it into $\\angle ${s.abd}$ and $\\angle ${s.dbc}$.`,
          `$\\overrightarrow{${n.b}${n.d}}$ 在 $\\angle ${s.abc}$ 内部，把它分成 $\\angle ${s.abd}$ 和 $\\angle ${s.dbc}$。`,
        ),
        adds: { arcs: ["abc"] },
        wrong: s.wrongAddition,
      },
      {
        s: measure(s.abc, 90),
        r: "subst",
        note: t(
          `Steps 2 and 3 have the same left side, so $m\\angle ${s.abc}$ can replace it in step 2.`,
          `第 2、3 步左边相同，所以在第 2 步中可以用 $m\\angle ${s.abc}$ 替换它。`,
        ),
        wrong: s.wrongMeasureAbc,
      },
      {
        s: isRight(s.abc),
        r: "defRight",
        note: t(
          `Step 4 says $\\angle ${s.abc}$ measures $90^\\circ$, and an angle of $90^\\circ$ is a right angle.`,
          `第 4 步说 $\\angle ${s.abc}$ 是 $90^\\circ$，而 $90^\\circ$ 的角是直角。`,
        ),
        adds: { right: ["abc"] },
        wrong: s.wrongRightAbc,
      },
      { s: s.perpRays, r: "defPerp" },
    ],
    figure: splitAngleFigure(base, split, n),
    draw: splitScene(base, split, n),
    distract: ["linearPair", "congComp", "vertical", "defCong", "subtraction", "rightCong"],
  };
}

/** valueAt writes the value of cx + d at x: "3 \cdot 20 - 10 = 50", or just "20" for plain x. */
const valueAt = (c: number, d: number, x: number) =>
  c === 1 && d === 0 ? `${x}` : `${c === 1 ? `${x}` : `${c} \\cdot ${x}`}${d === 0 ? "" : d > 0 ? ` + ${d}` : ` - ${-d}`} = ${c * x + d}`;

/** solveLinear writes the steps from cx + d = total to x, after the equation itself, with the move of the constant named. */
function solveLinear(c: number, d: number, total: number): { lines: string; how: Text } {
  const first = `${linear(c, d)} = ${total}`;
  const lines = chain(...[`${linear(c, 0)} = ${total - d}`, `x = ${(total - d) / c}`].filter((l) => l !== first));
  const move =
    d === 0
      ? t("", "")
      : d > 0
        ? t(`Subtract $${d}$ from both sides`, `两边同时减去 $${d}$`)
        : t(`Add $${-d}$ to both sides`, `两边同时加上 $${-d}$`);
  const divide = c === 1 ? t("", "") : t(`divide both sides by $${c}$`, `两边同时除以 $${c}$`);
  const how =
    d === 0
      ? t(`${cap(divide.en)}:`, `${divide["zh-CN"]}：`)
      : c === 1
        ? t(`${move.en}:`, `${move["zh-CN"]}：`)
        : t(`${move.en}, then ${divide.en}:`, `${move["zh-CN"]}，再${divide["zh-CN"]}：`);
  return { lines, how };
}

/** rightAngleIntro shows a right angle split by a ray into 35° and 55°. */
const rightAngleIntro = splitAngleFigure(-10, 55, { a: "P", b: "Q", c: "R", d: "S" }, { labels: ["35°", "55°"], right: true });

/** furtherProvingPerpendicularLineTheorems proves that perpendicular lines form four right angles and relates perpendicular sides to complementary angles. */
export const furtherProvingPerpendicularLineTheorems: TopicDef = {
  id: "further-proving-perpendicular-line-theorems",
  title: t("Further Proving Perpendicular Line Theorems", "进一步证明垂线的定理"),
  summary: t(
    "Prove that perpendicular lines form four right angles and that adjacent angles with perpendicular outer sides are complementary, and use these theorems to find unknown angles.",
    "证明垂直的直线形成四个直角，以及外侧两边互相垂直的相邻角互余，并用这些定理求未知角。",
  ),
  prerequisites: ["proving-perpendicular-line-theorems"],
  encompasses: [{ topic: "complementary-and-supplementary-angles", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    `The definition of perpendicular lines promises only **one** right angle where they cross. Yet everyone draws all four corners of a crossing as right angles, and a ray drawn inside a right angle always leaves two angles that add up to $90^\\circ$. This topic proves both facts from the postulates, and then uses them to find unknown angles.

Here the rays $\\overrightarrow{QP}$ and $\\overrightarrow{QR}$ are perpendicular, and $\\overrightarrow{QS}$ lies between them, making $\\angle PQS = 35^\\circ$:

{{figure 0}}

By the Angle Addition Postulate the two parts make up the whole: $m\\angle PQS + m\\angle SQR = m\\angle PQR = 90^\\circ$. So $m\\angle SQR = 90^\\circ - 35^\\circ = 55^\\circ$, and the two angles are **complementary**. Wherever the ray is drawn, the same steps give a sum of $90^\\circ$: that is the theorem, and its proof is these steps with a reason for each.`,
    `垂直的定义只保证两条直线相交处有**一个**直角。可是人们总把交点处的四个角都画成直角，而在直角内部画一条射线，分出的两个角之和总是 $90^\\circ$。本课由公设证明这两个结论，再用它们求未知角。

这里射线 $\\overrightarrow{QP}$ 与 $\\overrightarrow{QR}$ 互相垂直，$\\overrightarrow{QS}$ 在它们之间，使 $\\angle PQS = 35^\\circ$：

{{figure 0}}

由角的加法公设，两部分合成整个角：$m\\angle PQS + m\\angle SQR = m\\angle PQR = 90^\\circ$。所以 $m\\angle SQR = 90^\\circ - 35^\\circ = 55^\\circ$，两个角**互余**。无论射线画在哪里，同样的步骤都得出和为 $90^\\circ$：这就是定理，而它的证明就是给每一步写上理由。`,
  ),
  introFigures: [rightAngleIntro],
  knowledgePoints: [
    {
      ...proofKp(
        "perpendicular-lines-form-four-right-angles",
        t("Perpendicular lines form four right angles", "垂直的直线形成四个直角"),
        t(
          '**Theorem**: if two lines are perpendicular, all four angles they form are right angles. The definition of perpendicular lines gives one right angle. Each of the other three either sits beside it, forming a linear pair, or across from it, as a vertical angle, so each can be reached from the first.\n\nGiven $\\ell \\perp t$, prove $\\angle 2$ is a right angle:\n\n1. $\\ell \\perp t$ — Given\n2. $\\angle 1$ is a right angle — Definition of perpendicular lines\n3. $m\\angle 1 = 90^\\circ$ — Definition of right angle\n4. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — Linear Pair Postulate\n5. $90^\\circ + m\\angle 2 = 180^\\circ$ — Substitution Property of Equality\n6. $m\\angle 2 = 90^\\circ$ — Subtraction Property of Equality\n7. $\\angle 2$ is a right angle — Definition of right angle\n\nFor the angle vertical to $\\angle 1$, use the Vertical Angles Theorem instead: $\\angle 1 \\cong \\angle 4$, so $m\\angle 4 = m\\angle 1 = 90^\\circ$.\n\n> **Watch out.** A linear pair adds up to $180^\\circ$, not $90^\\circ$: the two angles together fill a straight line. And step 6 subtracts: $90^\\circ + m\\angle 2 = 180^\\circ$ gives $m\\angle 2 = 90^\\circ$, not $270^\\circ$. The definition of right angle turns "right angle" into "$90^\\circ$" and back; the definition of perpendicular lines is used only where the lines themselves appear.',
          "**定理**：若两条直线互相垂直，则它们形成的四个角都是直角。由垂直的定义只得到一个直角。其余三个角要么在它旁边，与它组成邻补角；要么在它对面，是它的对顶角，所以每一个都能由第一个推出。\n\n已知 $\\ell \\perp t$，求证 $\\angle 2$ 是直角：\n\n1. $\\ell \\perp t$ — 已知\n2. $\\angle 1$ 是直角 — 垂直的定义\n3. $m\\angle 1 = 90^\\circ$ — 直角的定义\n4. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — 邻补角公设\n5. $90^\\circ + m\\angle 2 = 180^\\circ$ — 等量代换\n6. $m\\angle 2 = 90^\\circ$ — 等式的减法性质\n7. $\\angle 2$ 是直角 — 直角的定义\n\n对于 $\\angle 1$ 的对顶角，改用对顶角定理：$\\angle 1 \\cong \\angle 4$，所以 $m\\angle 4 = m\\angle 1 = 90^\\circ$。\n\n> **注意。** 邻补角的和是 $180^\\circ$，不是 $90^\\circ$：两个角合起来是一个平角。第 6 步是相减：由 $90^\\circ + m\\angle 2 = 180^\\circ$ 得 $m\\angle 2 = 90^\\circ$，而不是 $270^\\circ$。直角的定义负责把“直角”和“$90^\\circ$”互相转换；垂直的定义只在说到两条直线本身时才用。",
        ),
        (rng) => (rng.bool() ? linearPairRightProof(rng) : verticalRightProof(rng)),
      ),
      figure: angleDrawings["perpendicular-lines-form-four-right-angles"],
    },
    {
      ...proofKp(
        "perpendicular-sides-make-complementary-angles",
        t("Perpendicular sides make complementary angles", "两边垂直的相邻角互余"),
        t(
          "**Theorem**: if the outer sides of two adjacent angles are perpendicular, the angles are complementary. The perpendicular sides make one right angle, and the ray between them cuts it into the two angles, so their measures share its $90^\\circ$.\n\nGiven $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ with $\\overrightarrow{BD}$ between them, prove $\\angle ABD$ and $\\angle DBC$ are complementary:\n\n1. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — Given\n2. $\\angle ABC$ is a right angle — Definition of perpendicular lines\n3. $m\\angle ABC = 90^\\circ$ — Definition of right angle\n4. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — Angle Addition Postulate\n5. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — Substitution Property of Equality\n6. $\\angle ABD$ and $\\angle DBC$ are complementary — Definition of complementary angles\n\n> **Watch out.** The right angle is the whole angle $\\angle ABC$, not one of its parts: $\\angle ABD$ is smaller than $90^\\circ$, since $\\overrightarrow{BD}$ lies inside. And the parts add up to $90^\\circ$, which makes them complementary; supplementary angles add up to $180^\\circ$.",
          "**定理**：若两个相邻角的外侧两边互相垂直，则这两个角互余。互相垂直的两边构成一个直角，中间的射线把它分成这两个角，所以它们的度数分享这 $90^\\circ$。\n\n已知 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$，$\\overrightarrow{BD}$ 在它们之间，求证 $\\angle ABD$ 与 $\\angle DBC$ 互余：\n\n1. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — 已知\n2. $\\angle ABC$ 是直角 — 垂直的定义\n3. $m\\angle ABC = 90^\\circ$ — 直角的定义\n4. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — 角的加法公设\n5. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — 等量代换\n6. $\\angle ABD$ 与 $\\angle DBC$ 互余 — 余角的定义\n\n> **注意。** 直角是整个角 $\\angle ABC$，不是其中的一部分：$\\overrightarrow{BD}$ 在角的内部，所以 $\\angle ABD$ 小于 $90^\\circ$。两部分的和是 $90^\\circ$，所以它们互余；互补的两个角和为 $180^\\circ$。",
        ),
        perpendicularSidesProof,
      ),
      figure: angleDrawings["perpendicular-sides-make-complementary-angles"],
    },
    {
      ...proofKp(
        "complementary-adjacent-angles-make-perpendicular-sides",
        t("Complementary adjacent angles make perpendicular sides", "互余的相邻角两边垂直"),
        t(
          "The converse also holds: **if two adjacent angles are complementary, their outer sides are perpendicular.** Every definition used in the last proof works in both directions, so the same steps can be run the other way: from the sum of $90^\\circ$ to the whole angle, from $90^\\circ$ to a right angle, and from a right angle to perpendicular rays.\n\nGiven that $\\angle ABD$ and $\\angle DBC$ are complementary, prove $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$:\n\n1. $\\angle ABD$ and $\\angle DBC$ are complementary — Given\n2. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — Definition of complementary angles\n3. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — Angle Addition Postulate\n4. $m\\angle ABC = 90^\\circ$ — Substitution Property of Equality\n5. $\\angle ABC$ is a right angle — Definition of right angle\n6. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — Definition of perpendicular lines\n\n> **Watch out.** Step 4 is substitution: steps 2 and 3 have the same left side, so $m\\angle ABC$ equals $90^\\circ$. It is not the Right Angles Congruence Theorem, which starts from two right angles and only concludes that they are congruent. And the last step needs the definition of perpendicular lines, read from a right angle back to perpendicular rays.",
          "逆命题也成立：**若两个相邻角互余，则它们的外侧两边互相垂直。** 上一个证明用到的定义都可以双向使用，所以同样的步骤可以倒过来走：由和为 $90^\\circ$ 得到整个角，由 $90^\\circ$ 得到直角，再由直角得到两条射线垂直。\n\n已知 $\\angle ABD$ 与 $\\angle DBC$ 互余，求证 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$：\n\n1. $\\angle ABD$ 与 $\\angle DBC$ 互余 — 已知\n2. $m\\angle ABD + m\\angle DBC = 90^\\circ$ — 余角的定义\n3. $m\\angle ABD + m\\angle DBC = m\\angle ABC$ — 角的加法公设\n4. $m\\angle ABC = 90^\\circ$ — 等量代换\n5. $\\angle ABC$ 是直角 — 直角的定义\n6. $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ — 垂直的定义\n\n> **注意。** 第 4 步是等量代换：第 2、3 步左边相同，所以 $m\\angle ABC$ 等于 $90^\\circ$。它不是直角相等定理，那个定理从两个直角出发，只能得出它们全等。最后一步要用垂直的定义，从直角反推出两条射线垂直。",
        ),
        complementaryConverseProof,
      ),
      figure: angleDrawings["complementary-adjacent-angles-make-perpendicular-sides"],
    },
    {
      id: "finding-angles-with-perpendicular-lines",
      figure: angleDrawings["finding-angles-with-perpendicular-lines"],
      title: t("Finding angles with perpendicular lines", "用垂直关系求角"),
      explanation: t(
        "The theorems turn perpendicularity into equations:\n\n- Perpendicular lines form four right angles, so any one of the four angles measures $90^\\circ$.\n- If $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$ and $\\overrightarrow{BD}$ lies between them, then $m\\angle ABD + m\\angle DBC = 90^\\circ$.\n\nSo write the equation the theorem gives, then solve it. If $m\\angle ABD = (2x + 5)^\\circ$ and $m\\angle DBC = (3x - 15)^\\circ$, the two angles are complementary:\n\n$$(2x + 5) + (3x - 15) = 90.$$\n\nCombining like terms gives $5x - 10 = 90$; adding $10$ gives $5x = 100$, so $x = 20$. The angles are then $2 \\cdot 20 + 5 = 45^\\circ$ and $3 \\cdot 20 - 15 = 45^\\circ$, which add up to $90^\\circ$.\n\n> **Watch out.** The angles here make up a right angle, so their sum is $90$, not $180$: there is no linear pair. Move the constant with the opposite sign ($5x - 10 = 90$ gives $5x = 100$, not $5x = 80$), and answer the question asked: $x$, not the measure of an angle.",
        "这些定理把垂直关系变成方程：\n\n- 垂直的直线形成四个直角，所以四个角中的任何一个都是 $90^\\circ$。\n- 若 $\\overrightarrow{BA} \\perp \\overrightarrow{BC}$，$\\overrightarrow{BD}$ 在它们之间，则 $m\\angle ABD + m\\angle DBC = 90^\\circ$。\n\n所以先写出定理给出的方程，再解方程。若 $m\\angle ABD = (2x + 5)^\\circ$，$m\\angle DBC = (3x - 15)^\\circ$，两个角互余：\n\n$$(2x + 5) + (3x - 15) = 90.$$\n\n合并同类项得 $5x - 10 = 90$；两边加 $10$ 得 $5x = 100$，所以 $x = 20$。这时两个角分别是 $2 \\cdot 20 + 5 = 45^\\circ$ 和 $3 \\cdot 20 - 15 = 45^\\circ$，和为 $90^\\circ$。\n\n> **注意。** 这里的两个角合成一个直角，所以和是 $90$，不是 $180$：没有邻补角。移项时常数要变号（由 $5x - 10 = 90$ 得 $5x = 100$，而不是 $5x = 80$），并且要回答所问的量：$x$，而不是某个角的度数。",
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
            const setup = chain(`${term(c1, d1)} + ${term(c2, d2)} = 90`, `${linear(c, d)} = 90`);
            const solve = solveLinear(c, d, 90);
            const base = rng.int(-20, 20);
            const labels = [angleLabel(c1, d1), angleLabel(c2, d2)] as const;
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
                  `${stepLabel(1, "write the equation", "列方程").en} The outer sides $\\overrightarrow{${n.b}${n.a}}$ and $\\overrightarrow{${n.b}${n.c}}$ are perpendicular, so $\\angle ${s.abc}$ is a right angle, and $\\overrightarrow{${n.b}${n.d}}$ splits it in two. Adjacent angles with perpendicular outer sides are complementary, so their measures add up to $90$:${setup}${stepLabel(2, "solve for $x$", "解出 $x$").en} ${solve.how.en}${solve.lines}**Check.** With $x = ${x}$, $m\\angle ${s.abd} = ${valueAt(c1, d1, x)}^\\circ$ and $m\\angle ${s.dbc} = ${valueAt(c2, d2, x)}^\\circ$. Together they make $${m1} + ${90 - m1} = 90$ degrees, the right angle $\\angle ${s.abc}$:\n\n{{figure 0}}`,
                  `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}外侧两边 $\\overrightarrow{${n.b}${n.a}}$ 与 $\\overrightarrow{${n.b}${n.c}}$ 互相垂直，所以 $\\angle ${s.abc}$ 是直角，$\\overrightarrow{${n.b}${n.d}}$ 把它分成两部分。外侧两边垂直的相邻角互余，所以它们的度数之和是 $90$：${setup}${stepLabel(2, "solve for $x$", "解出 $x$")["zh-CN"]}${solve.how["zh-CN"]}${solve.lines}**检验。** 当 $x = ${x}$ 时，$m\\angle ${s.abd} = ${valueAt(c1, d1, x)}^\\circ$，$m\\angle ${s.dbc} = ${valueAt(c2, d2, x)}^\\circ$。两者合起来是 $${m1} + ${90 - m1} = 90$ 度，正是直角 $\\angle ${s.abc}$：\n\n{{figure 0}}`,
                ),
              }),
              figure: splitAngleFigure(base, 90 - m1, n, { labels }),
              solutionFigures: [splitAngleFigure(base, 90 - m1, n, { labels: [`${m1}°`, `${90 - m1}°`], right: true })],
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
          const phi = rng.int(-30, 30);
          const solve = solveLinear(c, d, 90);
          const relation =
            vert(a) === marked
              ? t("it is vertical to the marked right angle", "它与标出的直角是对顶角")
              : t("it forms a linear pair with the marked right angle", "它与标出的直角组成邻补角");
          return {
            ...numberProblem({
              prompt: t("Lines $\\ell$ and $t$ are perpendicular. Find $x$.", "直线 $\\ell$ 与 $t$ 互相垂直。求 $x$。"),
              answer: x,
              solveFor: "x",
              wrong: [Q.of(180 - d, c), Q.of(90 + d, c), 90 - d],
              solution: t(
                `${stepLabel(1, "write the equation", "列方程").en} Perpendicular lines form four right angles. The labeled angle is one of the four (${relation.en}), so it measures $90^\\circ$:${chain(`${linear(c, d)} = 90`)}${stepLabel(2, "solve for $x$", "解出 $x$").en} ${solve.how.en}${solve.lines}**Check.** With $x = ${x}$, the labeled angle measures $${valueAt(c, d, x)}$ degrees: a right angle, like the other three angles at the crossing.\n\n{{figure 0}}`,
                `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}垂直的直线形成四个直角。标出的角是这四个角之一（${relation["zh-CN"]}），所以它是 $90^\\circ$：${chain(`${linear(c, d)} = 90`)}${stepLabel(2, "solve for $x$", "解出 $x$")["zh-CN"]}${solve.how["zh-CN"]}${solve.lines}**检验。** 当 $x = ${x}$ 时，标出的角是 $${valueAt(c, d, x)}$ 度：是直角，与交点处的另外三个角一样。\n\n{{figure 0}}`,
              ),
            }),
            figure: crossFigure(
              phi,
              { numbers: false, right: [marked], label: [a, angleLabel(c, d)] },
              `Lines ℓ and t crossing, with one angle marked as a right angle and another angle marked ${angleLabel(c, d)}.`,
              `直线 ℓ 与 t 相交，一个角标为直角，另一个角标为 ${angleLabel(c, d)}。`,
            ),
            solutionFigures: [
              crossFigure(
                phi,
                { numbers: false, right: [1, 2, 3, 4], label: [a, "90°"] },
                "Lines ℓ and t crossing at right angles: all four angles are right angles, and the labeled one measures 90°.",
                "直线 ℓ 与 t 垂直相交：四个角都是直角，标出的角是 90°。",
              ),
            ],
          };
        }
      },
    },
  ],
};

/** rotationAngle writes the angle of one step of a rotational symmetry, exactly. */
const rotationAngle = (order: number) => (Number.isInteger(360 / order) ? `${360 / order}` : `\\frac{360}{${order}}`);

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

/** unscaleSteps divides both coordinates of an image by k, which must give back the preimage. */
const unscaleSteps = (k: Q, image: QP, p: XY) =>
  steps(`\\left(${paren(image[0])} \\div ${k.toLatex()}, \\; ${paren(image[1])} \\div ${k.toLatex()}\\right) = ${pl(p)}`);

/** growth says whether a dilation by k enlarges or shrinks. */
const growth = (k: Q): Text =>
  k.cmp(Q.one) > 0
    ? t(
        `Since $${k.toLatex()} > 1$, the image is farther from the center than the point: an enlargement.`,
        `因为 $${k.toLatex()} > 1$，像比原来的点离中心更远：是放大。`,
      )
    : t(
        `Since $${k.toLatex()} < 1$, the image is closer to the center than the point: a reduction.`,
        `因为 $${k.toLatex()} < 1$，像比原来的点离中心更近：是缩小。`,
      );

/** dilationIntro shows P(2, 3) dilated about the origin by 2. */
const dilationIntro = movedPoint("P", [2, 3], [4, 6], { kind: "scale", center: [0, 0], centerName: "O" });

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
    { topic: "dilations-of-geometric-figures", weight: 0.3 },
    { topic: "translations-of-geometric-figures", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.1", "CCSS.HSG.CO.A.2"],
  intro: t(
    `A dilation with center $O$ and scale factor $k$ moves every point along the ray from $O$ through it, to $k$ times its distance from $O$. On a coordinate grid with $O$ at the origin, that is easy to compute: reaching a point means going across by $x$ and up by $y$, and going $k$ times as far means going across by $kx$ and up by $ky$.

Take $P(2, 3)$ and $k = 2$. Twice as far across and twice as far up gives $P'(2 \\cdot 2, 2 \\cdot 3) = P'(4, 6)$:

{{figure 0}}

$P'$ is on the ray from $O$ through $P$, and twice as far from $O$. This topic dilates points and polygons this way, reads the scale factor back from coordinates, and moves the center away from the origin.`,
    `以 $O$ 为中心、比例因子为 $k$ 的位似，把每个点沿着从 $O$ 出发经过它的射线移动，使它到 $O$ 的距离变为原来的 $k$ 倍。在坐标网格上，把 $O$ 放在原点，就很容易计算：到达一个点就是向右走 $x$、向上走 $y$，而走 $k$ 倍远就是向右走 $kx$、向上走 $ky$。

取 $P(2, 3)$，$k = 2$。向右和向上都走两倍远，得 $P'(2 \\cdot 2, 2 \\cdot 3) = P'(4, 6)$：

{{figure 0}}

$P'$ 在从 $O$ 经过 $P$ 的射线上，到 $O$ 的距离是原来的两倍。本课用这种方法对点和多边形作位似，由坐标反求比例因子，并把中心移到原点以外。`,
  ),
  introFigures: [dilationIntro],
  knowledgePoints: [
    {
      id: "dilating-about-the-origin",
      figure: motionDrawings["dilating-about-the-origin"],
      title: t("Dilating about the origin", "以原点为中心的位似"),
      explanation: t(
        "A dilation with center at the origin and scale factor $k$ multiplies **both** coordinates by $k$:\n\n$$(x, y) \\to (kx, ky).$$\n\nWhy both? The point $(x, y)$ is reached by going $x$ across and $y$ up from the origin. Going $k$ times as far along the same ray means going $k$ times as far across **and** $k$ times as far up, so each image lies on the ray from the origin through the point, $k$ times as far away.\n\nWith $k = \\frac{3}{2}$, the point $P(4, -6)$ goes to $P'\\left(\\frac{3}{2} \\cdot 4, \\frac{3}{2} \\cdot (-6)\\right) = P'(6, -9)$. Check: $\\frac{6}{4}$ and $\\frac{-9}{-6}$ both equal $\\frac{3}{2}$.\n\n> **Watch out.** Multiply by $k$; do not add $k$ to the coordinates, and do not divide by $k$, which would give the dilation by $\\frac{1}{k}$. Scaling only the $x$-coordinate is a stretch, not a dilation: both coordinates change.",
        "以原点为中心、比例因子为 $k$ 的位似把**两个**坐标都乘以 $k$：\n\n$$(x, y) \\to (kx, ky)$$\n\n为什么两个都乘？从原点出发，向右走 $x$、向上走 $y$ 到达点 $(x, y)$。沿同一条射线走 $k$ 倍远，就是向右走 $k$ 倍远，**并且**向上也走 $k$ 倍远。所以每个像都在从原点经过该点的射线上，到原点的距离是原来的 $k$ 倍。\n\n当 $k = \\frac{3}{2}$ 时，点 $P(4, -6)$ 映到 $P'\\left(\\frac{3}{2} \\cdot 4, \\frac{3}{2} \\cdot (-6)\\right) = P'(6, -9)$。检验：$\\frac{6}{4}$ 与 $\\frac{-9}{-6}$ 都等于 $\\frac{3}{2}$。\n\n> **注意。** 要乘以 $k$；不要把 $k$ 加到坐标上，也不要除以 $k$，那样得到的是比例因子为 $\\frac{1}{k}$ 的位似。只把 $x$ 坐标乘以 $k$ 是伸缩，不是位似：两个坐标都要变。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const p = pickScaledPoint(rng, k, Number(k.d) * 4);
        const name = rng.pick(["P", "A", "Q", "M"]);
        const image = scaled(k, p);
        return {
          ...pointProblem({
            prompt: t(
              `A dilation with center at the origin and scale factor $${k.toLatex()}$ maps $${name}${pl(p)}$ to $${name}'$. Find the coordinates of $${name}'$.`,
              `以原点为中心、比例因子为 $${k.toLatex()}$ 的位似把 $${name}${pl(p)}$ 映到 $${name}'$。求 $${name}'$ 的坐标。`,
            ),
            answer: image,
            wrong: [scaled(Q.one.div(k), p), [Q.of(p[0]).add(k), Q.of(p[1]).add(k)], [k.mul(Q.of(p[0])), p[1]]],
            solution: t(
              `${stepLabel(1, "write the rule", "写出规则").en} A dilation about the origin with scale factor $${k.toLatex()}$ is $${dilationRule(k)}$: both coordinates are multiplied by $${k.toLatex()}$.\n\n${stepLabel(2, "multiply both coordinates", "两个坐标都乘").en}${scaleSteps(`${name}'`, k, p)}**Check.** $${name}'$ must lie on the ray from the origin through $${name}$, $${k.toLatex()}$ times as far. Divide each coordinate of $${name}'$ by the matching coordinate of $${name}$: $\\frac{${image[0].toLatex()}}{${p[0]}}$ and $\\frac{${image[1].toLatex()}}{${p[1]}}$ both equal $${k.toLatex()}$. ${growth(k).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "write the rule", "写出规则")["zh-CN"]}以原点为中心、比例因子为 $${k.toLatex()}$ 的位似是 $${dilationRule(k)}$：两个坐标都乘以 $${k.toLatex()}$。\n\n${stepLabel(2, "multiply both coordinates", "两个坐标都乘")["zh-CN"]}${scaleSteps(`${name}'`, k, p)}**检验。** $${name}'$ 必须在从原点经过 $${name}$ 的射线上，距离是 $${k.toLatex()}$ 倍。用 $${name}'$ 的每个坐标除以 $${name}$ 的对应坐标：$\\frac{${image[0].toLatex()}}{${p[0]}}$ 与 $\\frac{${image[1].toLatex()}}{${p[1]}}$ 都等于 $${k.toLatex()}$。${growth(k)["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint(name, p, toPoint(image), { kind: "scale", center: [0, 0], centerName: "O" })],
        };
      },
    },
    {
      id: "dilating-a-figure",
      figure: motionDrawings["dilating-a-figure"],
      title: t("Dilating a figure", "对图形作位似"),
      explanation: t(
        "To dilate a polygon about the origin, apply the rule $(x, y) \\to (kx, ky)$ to each vertex and join the images in the same order. A polygon is fixed by its vertices, so moving the vertices moves the whole figure: every point of a side lands on the side between the images of its ends. The image has the same angles, and every side is $k$ times as long.\n\nUnder $(x, y) \\to (\\frac{1}{2}x, \\frac{1}{2}y)$, the vertex $B(-4, 6)$ of triangle $ABC$ goes to $B'\\left(\\frac{1}{2} \\cdot (-4), \\frac{1}{2} \\cdot 6\\right) = B'(-2, 3)$, halfway from the origin to $B$. Dividing back by $\\frac{1}{2}$ returns $B(-4, 6)$.\n\n> **Watch out.** Read the vertex carefully from the grid: $x$ first, then $y$, without swapping them. Multiply both coordinates by $k$, not only $x$, and do not divide by $k$.",
        "要以原点为中心对多边形作位似，就对每个顶点应用规则 $(x, y) \\to (kx, ky)$，再按原来的顺序连接各个像。多边形由它的顶点确定，所以移动顶点就移动了整个图形：边上的每个点都落在两端点的像之间的那条边上。像的各角不变，每条边都变为原来的 $k$ 倍。\n\n在 $(x, y) \\to (\\frac{1}{2}x, \\frac{1}{2}y)$ 下，三角形 $ABC$ 的顶点 $B(-4, 6)$ 映到 $B'\\left(\\frac{1}{2} \\cdot (-4), \\frac{1}{2} \\cdot 6\\right) = B'(-2, 3)$，位于从原点到 $B$ 的中点。再除以 $\\frac{1}{2}$ 就回到 $B(-4, 6)$。\n\n> **注意。** 从网格上仔细读出顶点：先 $x$ 后 $y$，不要颠倒。两个坐标都要乘以 $k$，不能只乘 $x$，也不要除以 $k$。",
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
          const image = scaled(k, p);
          return {
            ...pointProblem({
              prompt: t(
                `Triangle $ABC$ is dilated by the rule $${dilationRule(k)}$. Find the coordinates of $${name}'$.`,
                `三角形 $ABC$ 按规则 $${dilationRule(k)}$ 作位似。求 $${name}'$ 的坐标。`,
              ),
              answer: image,
              wrong: [scaled(Q.one.div(k), p), scaled(k, [p[1], p[0]]), [k.mul(Q.of(p[0])), p[1]]],
              solution: t(
                `${stepLabel(1, `read $${name}$ from the grid`, `从网格读出 $${name}$`).en} Count across, then up: $${name} = ${pl(p)}$.\n\n${stepLabel(2, "apply the rule", "应用规则").en} The rule multiplies both coordinates by $${k.toLatex()}$:${scaleSteps(`${name}'`, k, p)}**Check.** Undo the dilation by dividing each coordinate of $${name}'$ by $${k.toLatex()}$; it must give back $${name}$:${unscaleSteps(k, image, p)}The figure shows the whole image triangle, with every side $${k.toLatex()}$ times as long:\n\n{{figure 0}}`,
                `${stepLabel(1, `read $${name}$ from the grid`, `从网格读出 $${name}$`)["zh-CN"]}先数横向，再数纵向：$${name} = ${pl(p)}$。\n\n${stepLabel(2, "apply the rule", "应用规则")["zh-CN"]}规则把两个坐标都乘以 $${k.toLatex()}$：${scaleSteps(`${name}'`, k, p)}**检验。** 把 $${name}'$ 的每个坐标除以 $${k.toLatex()}$ 来撤销位似，应当回到 $${name}$：${unscaleSteps(k, image, p)}图中画出了整个像三角形，每条边都是原来的 $${k.toLatex()}$ 倍：\n\n{{figure 0}}`,
              ),
            }),
            figure: graph(named(tri, ["A", "B", "C"]), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
            solutionFigures: [
              movedPolygon(
                ["A", "B", "C"],
                tri,
                tri.map((v) => toPoint(scaled(k, v))),
                { kind: "scale", center: [0, 0], centerName: "O" },
                i,
              ),
            ],
          };
        }
      },
    },
    {
      id: "scale-factors-from-coordinates",
      figure: motionDrawings["scale-factors-from-coordinates"],
      title: t("Scale factors from coordinates", "由坐标求比例因子"),
      explanation: t(
        "If a dilation about the origin maps $P(x, y)$ to $P'(x', y')$, then $x' = kx$ and $y' = ky$. Dividing undoes the multiplying, so\n\n$$k = \\frac{x'}{x} = \\frac{y'}{y}.$$\n\nBoth fractions give the same $k$, because one dilation multiplies both coordinates by the same number. If $P(6, -4)$ maps to $P'(9, -6)$, then $k = \\frac{9}{6} = \\frac{3}{2}$, and the $y$-coordinates agree: $\\frac{-6}{-4} = \\frac{3}{2}$.\n\n> **Watch out.** Put the image over the preimage, not the other way round: $\\frac{6}{9} = \\frac{2}{3}$ would be the factor that maps $P'$ back to $P$. And a dilation multiplies, so subtracting the coordinates ($9 - 6 = 3$) does not give the scale factor.",
        "若以原点为中心的位似把 $P(x, y)$ 映到 $P'(x', y')$，则 $x' = kx$，$y' = ky$。除法撤销乘法，所以\n\n$$k = \\frac{x'}{x} = \\frac{y'}{y}$$\n\n两个分数给出同一个 $k$，因为一个位似把两个坐标乘以同一个数。若 $P(6, -4)$ 映到 $P'(9, -6)$，则 $k = \\frac{9}{6} = \\frac{3}{2}$，用 $y$ 坐标验证：$\\frac{-6}{-4} = \\frac{3}{2}$。\n\n> **注意。** 是像比原像，不能颠倒：$\\frac{6}{9} = \\frac{2}{3}$ 是把 $P'$ 映回 $P$ 的比例因子。位似是相乘，所以坐标相减（$9 - 6 = 3$）得到的不是比例因子。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const p = pickScaledPoint(rng, k, Number(k.d) * 3);
        const image = scaled(k, p);
        return {
          ...numberProblem({
            prompt: t(
              `A dilation with center at the origin maps $P${pl(p)}$ to $P'${pl(image)}$. Find the scale factor.`,
              `以原点为中心的位似把 $P${pl(p)}$ 映到 $P'${pl(image)}$。求比例因子。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.one.div(k), image[0].sub(Q.of(p[0]))],
            solution: t(
              `${stepLabel(1, "set up the ratio", "列出比").en} The dilation multiplies each coordinate by $k$, so $${image[0].toLatex()} = k \\cdot ${paren(p[0])}$. Dividing undoes the multiplying: $k$ is the image coordinate over the preimage coordinate.\n\n${stepLabel(2, "simplify", "化简").en}${steps(`k = \\frac{${image[0].toLatex()}}{${p[0]}} = ${k.toLatex()}`)}**Check.** The $y$-coordinates must give the same factor: $\\frac{${image[1].toLatex()}}{${p[1]}} = ${k.toLatex()}$. Multiplying back gives $P'$: $${k.toLatex()} \\cdot ${pl(p)} = ${pl(image)}$. ${growth(k).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "set up the ratio", "列出比")["zh-CN"]}位似把每个坐标乘以 $k$，所以 $${image[0].toLatex()} = k \\cdot ${paren(p[0])}$。除法撤销乘法：$k$ 等于像的坐标除以原像的坐标。\n\n${stepLabel(2, "simplify", "化简")["zh-CN"]}${steps(`k = \\frac{${image[0].toLatex()}}{${p[0]}} = ${k.toLatex()}`)}**检验。** 用 $y$ 坐标也必须得到同一个比例因子：$\\frac{${image[1].toLatex()}}{${p[1]}} = ${k.toLatex()}$。再乘回去，$${k.toLatex()} \\cdot ${pl(p)} = ${pl(image)}$，正是 $P'$。${growth(k)["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("P", p, toPoint(image), { kind: "scale", center: [0, 0], centerName: "O" })],
        };
      },
    },
    {
      id: "dilating-about-another-center",
      figure: motionDrawings["dilating-about-another-center"],
      title: t("Dilating about another center", "以其他点为中心的位似"),
      explanation: t(
        "The rule $(x, y) \\to (kx, ky)$ works only when the center is the origin, because it measures every point from the origin. For another center $C$, measure from $C$ instead:\n\n1. Find how $P$ sits relative to $C$: the offset $(x_P - x_C, y_P - y_C)$.\n2. Multiply that offset by $k$.\n3. Add $C$ back.\n\nDilating $P(7, 1)$ about $C(3, -1)$ with $k = \\frac{1}{2}$: the offset is $(7 - 3, 1 - (-1)) = (4, 2)$, half of it is $(2, 1)$, and adding $C$ gives $P'(3 + 2, -1 + 1) = P'(5, 0)$, halfway from $C$ to $P$.\n\n> **Watch out.** Multiplying the coordinates of $P$ themselves by $k$ dilates about the origin, not about $C$. Multiply the offset by $k$, not divide it, and add the scaled offset to $C$, not to $P$.",
        "规则 $(x, y) \\to (kx, ky)$ 只在中心是原点时成立，因为它是从原点量起每个点的。中心是另一点 $C$ 时，就改从 $C$ 量起：\n\n1. 求 $P$ 相对于 $C$ 的位置：差 $(x_P - x_C, y_P - y_C)$。\n2. 把这个差乘以 $k$。\n3. 再加回 $C$。\n\n以 $C(3, -1)$ 为中心、$k = \\frac{1}{2}$ 对 $P(7, 1)$ 作位似：差是 $(7 - 3, 1 - (-1)) = (4, 2)$，它的一半是 $(2, 1)$，加上 $C$ 得 $P'(3 + 2, -1 + 1) = P'(5, 0)$，位于 $C$ 与 $P$ 的中点。\n\n> **注意。** 直接把 $P$ 的坐标乘以 $k$ 是以原点为中心的位似，不是以 $C$ 为中心。要把差乘以 $k$，不是除以 $k$，并且把缩放后的差加到 $C$ 上，而不是加到 $P$ 上。",
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
        const offLine = steps(`(${p[0]} - ${paren(c[0])}, \\; ${p[1]} - ${paren(c[1])}) = ${pl(off)}`);
        const mulLine = steps(`(${k.toLatex()} \\cdot ${paren(off[0])}, \\; ${k.toLatex()} \\cdot ${paren(off[1])}) = ${pl(r)}`);
        const addLine = steps(`P' = (${c[0]} + ${paren(r[0])}, \\; ${c[1]} + ${paren(r[1])}) = ${pl(image)}`);
        const checkLine = steps(
          `(${paren(image[0])} - ${paren(c[0])}, \\; ${paren(image[1])} - ${paren(c[1])}) = ${pl(r)}`,
          `\\frac{${r[0].toLatex()}}{${off[0]}} = \\frac{${r[1].toLatex()}}{${off[1]}} = ${k.toLatex()}`,
        );
        return {
          ...pointProblem({
            prompt: t(
              `A dilation with center $C${pl(c)}$ and scale factor $${k.toLatex()}$ maps $P${pl(p)}$ to $P'$. Find the coordinates of $P'$.`,
              `以 $C${pl(c)}$ 为中心、比例因子为 $${k.toLatex()}$ 的位似把 $P${pl(p)}$ 映到 $P'$。求 $P'$ 的坐标。`,
            ),
            answer: image,
            wrong: [scaled(k, p), [back[0].add(Q.of(c[0])), back[1].add(Q.of(c[1]))], [r[0].add(Q.of(p[0])), r[1].add(Q.of(p[1]))]],
            solution: t(
              `${stepLabel(1, "measure from the center", "从中心量起").en} The offset of $P$ from $C$ is $P - C$:${offLine}${stepLabel(2, "scale the offset", "缩放这个差").en} Multiply both parts by $${k.toLatex()}$:${mulLine}${stepLabel(3, "add the center back", "加回中心").en}${addLine}**Check.** Measure $P'$ from $C$ and compare with the offset of $P$; each part must be $${k.toLatex()}$ times as large:${checkLine}So $P'$ lies on the ray from $C$ through $P$, $${k.toLatex()}$ times as far from $C$:\n\n{{figure 0}}`,
              `${stepLabel(1, "measure from the center", "从中心量起")["zh-CN"]}$P$ 相对于 $C$ 的差是 $P - C$：${offLine}${stepLabel(2, "scale the offset", "缩放这个差")["zh-CN"]}两部分都乘以 $${k.toLatex()}$：${mulLine}${stepLabel(3, "add the center back", "加回中心")["zh-CN"]}${addLine}**检验。** 从 $C$ 量起 $P'$，与 $P$ 的差比较；每一部分都必须是 $${k.toLatex()}$ 倍：${checkLine}所以 $P'$ 在从 $C$ 经过 $P$ 的射线上，到 $C$ 的距离是 $${k.toLatex()}$ 倍：\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("P", p, toPoint(image), { kind: "scale", center: c, centerName: "C" })],
        };
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

/** beforeAfter draws a polygon (thin) and its image (in the accent color) on a grid large enough for both. */
function beforeAfter(from: readonly XY[], to: readonly XY[], en: string, zh: string): Figure {
  return graph([...outline(from, false), ...outline(to)], en, zh, viewAround([...from, ...to]));
}

/** stretchIntro shows a 2 by 2 square stretched vertically by 3 into a 2 by 6 rectangle. */
const stretchIntro = beforeAfter(
  [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ],
  [
    [0, 0],
    [2, 0],
    [2, 6],
    [0, 6],
  ],
  "A 2 by 2 square with a corner at the origin, and its image under a vertical stretch by 3: a rectangle 2 wide and 6 tall.",
  "一个顶点在原点、边长为 2 的正方形，以及它在因子为 3 的竖直伸缩下的像：宽 2、高 6 的长方形。",
);

/** stretchesOfGeometricFigures stretches points and figures horizontally or vertically. */
export const stretchesOfGeometricFigures: TopicDef = {
  id: "stretches-of-geometric-figures",
  title: t("Stretches of Geometric Figures", "图形的伸缩"),
  summary: t(
    "Stretch points and figures horizontally or vertically, find the areas of stretched figures, and identify a stretch from a point and its image.",
    "把点和图形沿水平或竖直方向伸缩，求伸缩后图形的面积，并由一个点和它的像判断伸缩。",
  ),
  prerequisites: ["dilations-of-figures-in-the-coordinate-plane"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2"],
  intro: t(
    `A dilation about the origin multiplies **both** coordinates by the same factor, so it changes the size of a figure but keeps its shape. What happens if only **one** coordinate is multiplied? The figure is pulled out (or squeezed) in one direction only. That is a **stretch**, and it is how a photo is made taller without being made wider.

Take the square with corners $(0, 0)$, $(2, 0)$, $(2, 2)$ and $(0, 2)$, and multiply every $y$-coordinate by $3$: the corners go to $(0, 0)$, $(2, 0)$, $(2, 6)$ and $(0, 6)$.

{{figure 0}}

The width is still $2$, but the height is now $6$: the square became a rectangle, so its shape changed. Its area went from $2 \\cdot 2 = 4$ to $2 \\cdot 6 = 12$, three times as much, not nine times as a dilation by $3$ would give. This topic stretches points and figures, finds their areas, and recognizes a stretch from a point and its image.`,
    `以原点为中心的位似把**两个**坐标乘以同一个因子，所以它改变图形的大小，但保持形状。如果只把**一个**坐标乘以因子呢？图形就只在一个方向上被拉长（或压扁）。这就是**伸缩**，把照片拉高而不拉宽，用的就是它。

取顶点为 $(0, 0)$、$(2, 0)$、$(2, 2)$、$(0, 2)$ 的正方形，把每个 $y$ 坐标乘以 $3$：顶点变为 $(0, 0)$、$(2, 0)$、$(2, 6)$、$(0, 6)$。

{{figure 0}}

宽仍是 $2$，高变成了 $6$：正方形变成了长方形，形状改变了。面积从 $2 \\cdot 2 = 4$ 变为 $2 \\cdot 6 = 12$，是原来的三倍，而不是因子为 $3$ 的位似给出的九倍。本课对点和图形作伸缩，求它们的面积，并由一个点和它的像认出伸缩。`,
  ),
  introFigures: [stretchIntro],
  knowledgePoints: [
    {
      id: "horizontal-and-vertical-stretches",
      figure: motionDrawings["horizontal-and-vertical-stretches"],
      title: t("Horizontal and vertical stretches", "水平与竖直伸缩"),
      explanation: t(
        "A **stretch** multiplies only one coordinate:\n\n- A **vertical stretch** by a factor of $k$ (from the $x$-axis): $(x, y) \\to (x, ky)$. Points on the $x$-axis stay fixed.\n- A **horizontal stretch** by a factor of $k$ (from the $y$-axis): $(x, y) \\to (kx, y)$. Points on the $y$-axis stay fixed.\n\nA vertical stretch multiplies each point's distance from the $x$-axis by $k$ and leaves its left-right position alone, so every point moves straight up or down. When $0 < k < 1$, the stretch squeezes the figure. Unlike a dilation, a stretch changes the shape of most figures.\n\nStretching $P(3, -4)$ vertically by a factor of $\\frac{5}{2}$ keeps $x = 3$ and gives $y = \\frac{5}{2} \\cdot (-4) = -10$, so $P'(3, -10)$: straight below $P$, $\\frac{5}{2}$ times as far from the $x$-axis.\n\n> **Watch out.** Multiply only the coordinate in the direction of the stretch: a horizontal stretch changes $x$, a vertical one changes $y$. Multiplying both is a dilation, and adding $k$ instead of multiplying is a translation.",
        "**伸缩**只把一个坐标乘以因子：\n\n- 以因子 $k$ **竖直伸缩**（以 $x$ 轴为基准）：$(x, y) \\to (x, ky)$。$x$ 轴上的点保持不动。\n- 以因子 $k$ **水平伸缩**（以 $y$ 轴为基准）：$(x, y) \\to (kx, y)$。$y$ 轴上的点保持不动。\n\n竖直伸缩把每个点到 $x$ 轴的距离乘以 $k$，左右位置不变，所以每个点都沿竖直方向移动。当 $0 < k < 1$ 时，伸缩把图形压扁。与位似不同，伸缩会改变大多数图形的形状。\n\n把 $P(3, -4)$ 以因子 $\\frac{5}{2}$ 竖直伸缩：$x = 3$ 不变，$y = \\frac{5}{2} \\cdot (-4) = -10$，所以得到 $P'(3, -10)$：在 $P$ 的正下方，到 $x$ 轴的距离是原来的 $\\frac{5}{2}$ 倍。\n\n> **注意。** 只把伸缩方向上的坐标乘以因子：水平伸缩改变 $x$，竖直伸缩改变 $y$。两个坐标都乘是位似，把 $k$ 加到坐标上而不是相乘则是平移。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const k = rng.pick(niceScales);
        const p = pickStretchPoint(rng, horizontal, k);
        const name = stretchName(horizontal, k);
        const image = stretched(horizontal, k, p);
        const [v, o] = horizontal ? ["x", "y"] : ["y", "x"];
        const [i, j] = horizontal ? ([0, 1] as const) : ([1, 0] as const);
        const line = horizontal
          ? `P' = (${k.toLatex()} \\cdot ${paren(p[0])}, \\; ${p[1]}) = ${pl(image)}`
          : `P' = (${p[0]}, \\; ${k.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`;
        return {
          ...pointProblem({
            prompt: t(
              `The point $P${pl(p)}$ is ${name.en}. Find the coordinates of its image $P'$.`,
              `把点 $P${pl(p)}$ ${name["zh-CN"]}。求它的像 $P'$ 的坐标。`,
            ),
            answer: image,
            wrong: [scaled(k, p), stretched(!horizontal, k, p), horizontal ? [Q.of(p[0]).add(k), p[1]] : [p[0], Q.of(p[1]).add(k)]],
            solution: t(
              `${stepLabel(1, "write the rule", "写出规则").en} A ${horizontal ? "horizontal" : "vertical"} stretch follows the rule $${stretchRule(horizontal, k)}$: it multiplies only the $${v}$-coordinate, and the $${o}$-coordinate stays $${p[j]}$.\n\n${stepLabel(2, `multiply the $${v}$-coordinate`, `把 $${v}$ 坐标乘以因子`).en}${steps(line)}**Check.** Dividing the new $${v}$-coordinate by the old one gives back the factor of the stretch: $\\frac{${image[i].toLatex()}}{${p[i]}} = ${k.toLatex()}$. The $${o}$-coordinate did not change, so $P'$ is straight ${horizontal ? "across from" : "above or below"} $P$:\n\n{{figure 0}}`,
              `${stepLabel(1, "write the rule", "写出规则")["zh-CN"]}${horizontal ? "水平" : "竖直"}伸缩的规则是 $${stretchRule(horizontal, k)}$：只把 $${v}$ 坐标乘以因子，$${o}$ 坐标仍是 $${p[j]}$。\n\n${stepLabel(2, `multiply the $${v}$-coordinate`, `把 $${v}$ 坐标乘以因子`)["zh-CN"]}${steps(line)}**检验。** 用新的 $${v}$ 坐标除以旧的：$\\frac{${image[i].toLatex()}}{${p[i]}} = ${k.toLatex()}$，正是伸缩因子。$${o}$ 坐标没有变，所以 $P'$ 在 $P$ 的${horizontal ? "正左方或正右方" : "正上方或正下方"}：\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("P", p, toPoint(image), { kind: "slide" })],
        };
      },
    },
    {
      id: "areas-of-stretched-figures",
      figure: motionDrawings["areas-of-stretched-figures"],
      title: t("Areas of stretched figures", "伸缩后图形的面积"),
      explanation: t(
        "A vertical stretch by $k$ multiplies every vertical length by $k$ and leaves horizontal lengths alone (a horizontal stretch does the opposite). Area is width times height (or half of it, for a right triangle), and only one of the two is multiplied by $k$. So a stretch multiplies areas by $k$, not by $k^2$ as a dilation does.\n\nA $3 \\times 5$ rectangle stretched horizontally by a factor of $2$ becomes a $6 \\times 5$ rectangle: its area goes from $15$ to $30$, which is $15 \\cdot 2$.\n\n> **Watch out.** Only one side length changes, so the area is multiplied by $k$ once: $k^2$ is for dilations, which multiply both sides. A stretch by $k$ does change the area, unless $k = 1$, and it multiplies it by $k$, never divides it by $k$.",
        "以因子 $k$ 竖直伸缩把所有竖直方向的长度乘以 $k$，水平方向的长度不变（水平伸缩正好相反）。面积等于宽乘高（直角三角形还要取一半），而两者中只有一个乘以 $k$。所以伸缩把面积乘以 $k$，而不是像位似那样乘以 $k^2$。\n\n一个 $3 \\times 5$ 的长方形以因子 $2$ 水平伸缩后变成 $6 \\times 5$ 的长方形：面积从 $15$ 变为 $30$，即 $15 \\cdot 2$。\n\n> **注意。** 只有一条边的长度改变，所以面积只乘一次 $k$：$k^2$ 用于位似，因为位似把两条边都乘以 $k$。除非 $k = 1$，伸缩一定改变面积，而且是乘以 $k$，不是除以 $k$。",
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
        const result = area.mul(k);
        const formula = triangle
          ? `\\frac{1}{2} \\cdot ${paren(nw)} \\cdot ${paren(nh)} = ${result.toLatex()}`
          : `${paren(nw)} \\cdot ${paren(nh)} = ${result.toLatex()}`;
        const before = triangle ? `\\frac{1}{2} \\cdot ${w} \\cdot ${h} = ${area.toLatex()}` : `${w} \\cdot ${h} = ${area.toLatex()}`;
        const image = pts.map((p) => toPoint(stretched(horizontal, k, p)));
        const changed = horizontal ? t("width", "宽") : t("height", "高");
        const kept = horizontal ? t(`height $${h}$`, `高 $${h}$`) : t(`width $${w}$`, `宽 $${w}$`);
        return {
          ...numberProblem({
            prompt: t(
              `The ${shape.en} shown is ${name.en}. Find the area of its image.`,
              `把图中的${shape["zh-CN"]}${name["zh-CN"]}。求它的像的面积。`,
            ),
            answer: result,
            wrong: [area.mul(k).mul(k), area, area.div(k)],
            solution: t(
              `${stepLabel(1, "find the new side lengths", "求新的边长").en} The ${changed.en} $${horizontal ? w : h}$ is multiplied by $${k.toLatex()}$ and becomes $${(horizontal ? nw : nh).toLatex()}$; the ${kept.en} stays the same.\n\n${stepLabel(2, "find the area of the image", "求像的面积").en}${steps(formula)}**Check.** Work from the original area instead. The original ${shape.en} has this area:${steps(before)}A stretch by $${k.toLatex()}$ multiplies area by $${k.toLatex()}$, which gives the same result: $${area.toLatex()} \\cdot ${k.toLatex()} = ${result.toLatex()}$.\n\n{{figure 0}}`,
              `${stepLabel(1, "find the new side lengths", "求新的边长")["zh-CN"]}${changed["zh-CN"]} $${horizontal ? w : h}$ 乘以 $${k.toLatex()}$，变为 $${(horizontal ? nw : nh).toLatex()}$；${kept["zh-CN"]} 不变。\n\n${stepLabel(2, "find the area of the image", "求像的面积")["zh-CN"]}${steps(formula)}**检验。** 改从原面积出发。原${shape["zh-CN"]}的面积是${steps(before)}而因子为 $${k.toLatex()}$ 的伸缩把面积乘以 $${k.toLatex()}$：$${area.toLatex()} \\cdot ${k.toLatex()} = ${result.toLatex()}$，结果相同。\n\n{{figure 0}}`,
            ),
          }),
          figure: graph(
            outline(pts),
            `A ${shape.en} with sides along the grid lines, ${w} units wide and ${h} units tall.`,
            `一个边沿网格线的${shape["zh-CN"]}，宽 ${w} 个单位，高 ${h} 个单位。`,
          ),
          solutionFigures: [
            beforeAfter(
              pts,
              image,
              `The ${shape.en} (thin) and its image (bold), ${horizontal ? `${nw.toString()} units wide and ${h} units tall` : `${w} units wide and ${nh.toString()} units tall`}.`,
              `原${shape["zh-CN"]}（细线）和它的像（粗线），${horizontal ? `宽 ${nw.toString()} 个单位、高 ${h} 个单位` : `宽 ${w} 个单位、高 ${nh.toString()} 个单位`}。`,
            ),
          ],
        };
      },
    },
    {
      id: "identifying-a-stretch",
      title: t("Identifying a stretch", "判断伸缩"),
      explanation: t(
        "To identify a stretch from a point and its image, see which coordinate changes: a horizontal stretch multiplies only $x$, and a vertical stretch multiplies only $y$. So if $x$ changes and $y$ stays, it is horizontal; if $y$ changes and $x$ stays, it is vertical. The factor undoes the multiplying in reverse: it is the new coordinate over the old one.\n\n$P(6, -2)$ maps to $P'(15, -2)$: $y$ stays, and $\\frac{15}{6} = \\frac{5}{2}$, so the rule is $(x, y) \\to (\\frac{5}{2}x, y)$. Applying it to $P$ gives $(\\frac{5}{2} \\cdot 6, -2) = (15, -2)$, as it should.\n\n> **Watch out.** Multiply the coordinate that changed, not the one that stayed. A rule that multiplies both coordinates is a dilation, which would change both. And the factor is new over old: old over new gives the stretch that goes back.",
        "要由一个点和它的像判断伸缩，看哪个坐标变了：水平伸缩只把 $x$ 乘以因子，竖直伸缩只把 $y$ 乘以因子。所以 $x$ 变而 $y$ 不变，是水平伸缩；$y$ 变而 $x$ 不变，是竖直伸缩。因子要反过来求：它是新坐标除以旧坐标。\n\n$P(6, -2)$ 映到 $P'(15, -2)$：$y$ 不变，$\\frac{15}{6} = \\frac{5}{2}$，所以规则是 $(x, y) \\to (\\frac{5}{2}x, y)$。把它用于 $P$ 得 $(\\frac{5}{2} \\cdot 6, -2) = (15, -2)$，正确。\n\n> **注意。** 要乘的是改变了的坐标，不是不变的那个。把两个坐标都乘以因子的规则是位似，会使两个坐标都变。因子是新比旧：旧比新得到的是变回去的伸缩。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const k = rng.pick(niceScales);
        const p = pickStretchPoint(rng, horizontal, k);
        const image = stretched(horizontal, k, p);
        const correct = stretchRule(horizontal, k);
        const wrongAxis = stretchRule(!horizontal, k);
        const both = dilationRule(k);
        const flipped = stretchRule(horizontal, Q.one.div(k));
        const options = rng.shuffle([correct, wrongAxis, both, flipped]);
        const changed = horizontal ? 0 : 1;
        const [v, o] = horizontal ? ["x", "y"] : ["y", "x"];
        const apply = horizontal
          ? `(${k.toLatex()} \\cdot ${paren(p[0])}, \\; ${p[1]}) = ${pl(image)}`
          : `(${p[0]}, \\; ${k.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`;
        const wrongImage = (rule: "axis" | "both" | "flip") =>
          pl(rule === "axis" ? stretched(!horizontal, k, p) : rule === "both" ? scaled(k, p) : stretched(horizontal, Q.one.div(k), p));
        return reasoned(
          choiceProblem({
            prompt: t(
              `A stretch maps $P${pl(p)}$ to $P'${pl(image)}$. Which rule describes it?`,
              `一次伸缩把 $P${pl(p)}$ 映到 $P'${pl(image)}$。哪条规则描述了它？`,
            ),
            options: options.map((x) => same(`$${x}$`)),
            correct: options.indexOf(correct),
            solution: t(
              `${stepLabel(1, "see which coordinate changes", "看哪个坐标改变").en} The $${o}$-coordinate stays $${p[horizontal ? 1 : 0]}$ and only the $${v}$-coordinate changes, so the stretch is ${horizontal ? "horizontal" : "vertical"}.\n\n${stepLabel(2, "find the factor", "求因子").en} Divide the new $${v}$-coordinate by the old one:${steps(`\\frac{${image[changed].toLatex()}}{${p[changed]}} = ${k.toLatex()}`)}So the rule is $${correct}$.\n\n**Check.** Apply the rule to $P$:${steps(apply)}This is $P'$.`,
              `${stepLabel(1, "see which coordinate changes", "看哪个坐标改变")["zh-CN"]}$${o}$ 坐标仍是 $${p[horizontal ? 1 : 0]}$，只有 $${v}$ 坐标改变，所以是${horizontal ? "水平" : "竖直"}伸缩。\n\n${stepLabel(2, "find the factor", "求因子")["zh-CN"]}用新的 $${v}$ 坐标除以旧的：${steps(`\\frac{${image[changed].toLatex()}}{${p[changed]}} = ${k.toLatex()}`)}所以规则是 $${correct}$。\n\n**检验。** 把规则用于 $P$：${steps(apply)}正是 $P'$。`,
            ),
          }),
          [
            [
              `$${wrongAxis}$`,
              `This multiplies the $${o}$-coordinate, which did not change; it would send $P$ to $${wrongImage("axis")}$.`,
              `它把 $${o}$ 坐标乘以因子，而 $${o}$ 坐标并没有变；它会把 $P$ 映到 $${wrongImage("axis")}$。`,
            ],
            [
              `$${both}$`,
              `This multiplies both coordinates, a dilation; it would send $P$ to $${wrongImage("both")}$.`,
              `它把两个坐标都乘以因子，是位似；它会把 $P$ 映到 $${wrongImage("both")}$。`,
            ],
            [
              `$${flipped}$`,
              `This uses old over new, the factor that maps $P'$ back to $P$; it would send $P$ to $${wrongImage("flip")}$.`,
              `它用的是旧比新，是把 $P'$ 映回 $P$ 的因子；它会把 $P$ 映到 $${wrongImage("flip")}$。`,
            ],
          ],
        );
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

/** coordText writes a coordinate for a figure label, with a true minus sign and fractions as a/b. */
const coordText = (v: Q | number) => (typeof v === "number" ? Q.of(v) : v).toString().replace(/^-/, "−");

/** pointText writes a point for a figure label: "(6, −3)". */
const pointText = (p: readonly (Q | number)[]) => `(${coordText(p[0]!)}, ${coordText(p[1]!)})`;

/** twoStretchesFigure draws P, its image after the horizontal stretch by a, and P' after the vertical stretch by b, with dashed steps between. */
function twoStretchesFigure(p: XY, a: Q, b: Q): Figure {
  const mid: QP = [a.mul(Q.of(p[0])), Q.of(p[1])];
  const end: QP = [mid[0], b.mul(Q.of(p[1]))];
  const [m, e] = [toPoint(mid), toPoint(end)];
  const marks: PlaneMark[] = [
    { kind: "segment", a: p, b: m, dashed: true, tone: "action" },
    { kind: "segment", a: m, b: e, dashed: true, tone: "action" },
    { kind: "point", at: p, label: `P${pointText(p)}`, dir: p[1] >= e[1] ? "n" : "s" },
    { kind: "point", at: m, label: pointText(mid), dir: compassOf(m[0] >= 0 ? 0 : 180) },
    { kind: "point", at: e, label: `P'${pointText(end)}`, dir: e[1] >= p[1] ? "n" : "s", accent: true, tone: "result" },
  ];
  return graph(
    marks,
    `P${pointText(p)} moves horizontally to ${pointText(mid)}, its x-coordinate multiplied by ${a.toString()}, then vertically to P'${pointText(end)}, its y-coordinate multiplied by ${b.toString()}.`,
    `P${pointText(p)} 先水平移到 ${pointText(mid)}，横坐标乘以 ${a.toString()}；再竖直移到 P'${pointText(end)}，纵坐标乘以 ${b.toString()}。`,
    viewAround([p, m, e]),
  );
}

/** bothStretchesFigure stretches P(2, −6) horizontally by 3 and then vertically by 1/2, through (6, −6) to P'(6, −3). */
const bothStretchesFigure = graph(
  [
    { kind: "segment", a: [2, -6], b: [6, -6], dashed: true },
    { kind: "segment", a: [6, -6], b: [6, -3], dashed: true },
    { kind: "point", at: [2, -6], label: "P(2, −6)", dir: "s" },
    { kind: "point", at: [6, -6], label: "(6, −6)", dir: "s" },
    { kind: "point", at: [6, -3], label: "P'(6, −3)", dir: "ne", accent: true },
    { kind: "label", at: [4, -6], text: "× 3", dir: "n" },
    { kind: "label", at: [6, -4.5], text: "× ½", dir: "e" },
  ],
  "P(2, −6) moves horizontally to (6, −6), its x-coordinate tripled, then vertically to P'(6, −3), its y-coordinate halved.",
  "P(2, −6) 先水平移到 (6, −6)，横坐标乘 3；再竖直移到 P'(6, −3)，纵坐标减半。",
);

/** combinedIntro shows a 2 by 1 rectangle stretched horizontally by 3 and vertically by 2 into a 6 by 2 rectangle. */
const combinedIntro = beforeAfter(
  [
    [0, 0],
    [2, 0],
    [2, 1],
    [0, 1],
  ],
  [
    [0, 0],
    [6, 0],
    [6, 2],
    [0, 2],
  ],
  "A rectangle 2 wide and 1 tall with a corner at the origin, and its image under a horizontal stretch by 3 and a vertical stretch by 2: a rectangle 6 wide and 2 tall.",
  "一个顶点在原点、宽 2 高 1 的长方形，以及它在因子 3 的水平伸缩和因子 2 的竖直伸缩下的像：宽 6、高 2 的长方形。",
);

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
  intro: t(
    `A single stretch multiplies one coordinate: $(x, y) \\to (kx, y)$ or $(x, y) \\to (x, ky)$. Doing a horizontal stretch and then a vertical one multiplies each coordinate by its own factor, and two stretches in the same direction multiply one coordinate twice. Combining them gives one rule, which tells at a glance what happens to points and to areas.

Take the rectangle with corners $(0, 0)$, $(2, 0)$, $(2, 1)$ and $(0, 1)$. Stretch it horizontally by $3$, then vertically by $2$: every point $(x, y)$ goes to $(3x, 2y)$, and the corner $(2, 1)$ goes to $(6, 2)$.

{{figure 0}}

The width went from $2$ to $6$ and the height from $1$ to $2$, so the area went from $2$ to $12$: multiplied by $3 \\cdot 2 = 6$. This topic writes such combined rules, reads the factors back from a point and its image, and finds the areas of the images.`,
    `一次伸缩只把一个坐标乘以因子：$(x, y) \\to (kx, y)$ 或 $(x, y) \\to (x, ky)$。先水平伸缩再竖直伸缩，就把两个坐标各乘以自己的因子；同一方向的两次伸缩，则把一个坐标乘了两次。把它们合成一条规则，就能一眼看出点和面积的变化。

取顶点为 $(0, 0)$、$(2, 0)$、$(2, 1)$、$(0, 1)$ 的长方形。先以因子 $3$ 水平伸缩，再以因子 $2$ 竖直伸缩：每个点 $(x, y)$ 都映到 $(3x, 2y)$，顶点 $(2, 1)$ 映到 $(6, 2)$。

{{figure 0}}

宽从 $2$ 变为 $6$，高从 $1$ 变为 $2$，所以面积从 $2$ 变为 $12$：乘以了 $3 \\cdot 2 = 6$。本课写出这样的组合规则，由一个点和它的像求出因子，并求像的面积。`,
  ),
  introFigures: [combinedIntro],
  knowledgePoints: [
    {
      id: "stretching-in-both-directions",
      title: t("Stretching in both directions", "两个方向的伸缩"),
      explanation: t(
        "A horizontal stretch by $a$ followed by a vertical stretch by $b$ multiplies $x$ by $a$ and $y$ by $b$:\n\n$$(x, y) \\to (ax, by).$$\n\nThe order does not matter, since each stretch changes only its own coordinate and leaves the other one for the second stretch untouched. When $a = b$, the result is a dilation about the origin.\n\nStretching $P(2, -6)$ horizontally by $3$ and vertically by $\\frac{1}{2}$: first $x$ becomes $3 \\cdot 2 = 6$, giving $(6, -6)$; then $y$ becomes $\\frac{1}{2} \\cdot (-6) = -3$, giving $P'(6, -3)$.\n\n> **Watch out.** Each factor goes with its own direction: $a$ multiplies $x$ and $b$ multiplies $y$, not the other way round. Do not multiply both coordinates by $ab$, and do not stop after the first stretch.",
        "以因子 $a$ 水平伸缩、再以因子 $b$ 竖直伸缩，把 $x$ 乘以 $a$，$y$ 乘以 $b$：\n\n$$(x, y) \\to (ax, by)$$\n\n顺序无关紧要，因为每次伸缩只改变自己的那个坐标，另一个坐标留给第二次伸缩，不受影响。当 $a = b$ 时，结果就是以原点为中心的位似。\n\n把 $P(2, -6)$ 以因子 $3$ 水平伸缩、以因子 $\\frac{1}{2}$ 竖直伸缩：先 $x$ 变为 $3 \\cdot 2 = 6$，得 $(6, -6)$；再 $y$ 变为 $\\frac{1}{2} \\cdot (-6) = -3$，得 $P'(6, -3)$。\n\n> **注意。** 每个因子对应自己的方向：$a$ 乘 $x$，$b$ 乘 $y$，不能颠倒。不要把两个坐标都乘以 $ab$，也不要只做第一次伸缩就停下。",
      ),
      figure: bothStretchesFigure,
      generate(rng) {
        const [a, b] = rng.sample(niceScales, 2) as [Q, Q];
        const p = pickCombinedPoint(rng, a, b);
        const image: QP = [a.mul(Q.of(p[0])), b.mul(Q.of(p[1]))];
        return {
          ...pointProblem({
            prompt: t(
              `The point $P${pl(p)}$ is stretched horizontally by a factor of $${a.toLatex()}$ and vertically by a factor of $${b.toLatex()}$. Find the coordinates of its image $P'$.`,
              `把点 $P${pl(p)}$ 沿水平方向以因子 $${a.toLatex()}$、沿竖直方向以因子 $${b.toLatex()}$ 伸缩。求它的像 $P'$ 的坐标。`,
            ),
            answer: image,
            wrong: [[b.mul(Q.of(p[0])), a.mul(Q.of(p[1]))], scaled(a.mul(b), p), [a.mul(Q.of(p[0])), p[1]]],
            solution: t(
              `${stepLabel(1, "combine the rules", "合成规则").en} The horizontal stretch multiplies $x$ by $${a.toLatex()}$ and the vertical stretch multiplies $y$ by $${b.toLatex()}$, so together they are $${combinedRule(a, b)}$.\n\n${stepLabel(2, "apply the rule", "应用规则").en}${steps(`P' = (${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`)}**Check.** Undo each stretch by dividing: $${paren(image[0])} \\div ${a.toLatex()} = ${p[0]}$ and $${paren(image[1])} \\div ${b.toLatex()} = ${p[1]}$, which gives back $P${pl(p)}$. The figure follows the point through both stretches:\n\n{{figure 0}}`,
              `${stepLabel(1, "combine the rules", "合成规则")["zh-CN"]}水平伸缩把 $x$ 乘以 $${a.toLatex()}$，竖直伸缩把 $y$ 乘以 $${b.toLatex()}$，合起来是 $${combinedRule(a, b)}$。\n\n${stepLabel(2, "apply the rule", "应用规则")["zh-CN"]}${steps(`P' = (${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}`)}**检验。** 用除法撤销每次伸缩：$${paren(image[0])} \\div ${a.toLatex()} = ${p[0]}$，$${paren(image[1])} \\div ${b.toLatex()} = ${p[1]}$，回到 $P${pl(p)}$。图中跟踪了这个点经过两次伸缩的过程：\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [twoStretchesFigure(p, a, b)],
        };
      },
    },
    {
      id: "stretches-in-the-same-direction",
      title: t("Stretches in the same direction", "同一方向的伸缩"),
      explanation: t(
        "Two stretches in the same direction combine into one: stretching horizontally by $a$ and then by $b$ multiplies $x$ by $a$ and then by $b$, a single horizontal stretch by $ab$.\n\nTo **undo** a stretch by $a$, stretch in the same direction by $\\frac{1}{a}$: the two together multiply by $a \\cdot \\frac{1}{a} = 1$, which leaves every point where it started.\n\nA vertical stretch by $\\frac{3}{2}$ followed by a vertical stretch by $4$ is a vertical stretch by $\\frac{3}{2} \\cdot 4 = 6$. The point $(1, 2)$ goes to $(1, 3)$ and then to $(1, 12)$, and $12 = 6 \\cdot 2$. The stretch by $6$ is undone by a vertical stretch by $\\frac{1}{6}$.\n\n> **Watch out.** Factors in the same direction multiply; they do not add. Undoing a stretch takes the reciprocal $\\frac{1}{a}$, not the opposite $-a$ (which would also flip the figure) and not $1 - a$.",
        "同一方向的两次伸缩可以合成一次：先以因子 $a$、再以因子 $b$ 水平伸缩，就是把 $x$ 先乘以 $a$ 再乘以 $b$，即以因子 $ab$ 水平伸缩一次。\n\n要**还原**以因子 $a$ 的伸缩，就沿同一方向以因子 $\\frac{1}{a}$ 伸缩：两次合起来乘以 $a \\cdot \\frac{1}{a} = 1$，每个点都回到原处。\n\n以因子 $\\frac{3}{2}$ 竖直伸缩后再以因子 $4$ 竖直伸缩，等于以因子 $\\frac{3}{2} \\cdot 4 = 6$ 竖直伸缩。点 $(1, 2)$ 先映到 $(1, 3)$，再映到 $(1, 12)$，而 $12 = 6 \\cdot 2$。用因子 $\\frac{1}{6}$ 的竖直伸缩可以还原它。\n\n> **注意。** 同一方向的因子相乘，不是相加。还原伸缩要用倒数 $\\frac{1}{a}$，不是相反数 $-a$（那样还会把图形翻转），也不是 $1 - a$。",
      ),
      generate(rng) {
        const horizontal = rng.bool();
        const way = horizontal ? t("horizontally", "水平") : t("vertically", "竖直");
        const v = horizontal ? "x" : "y";
        const [a, b] = rng.sample(niceScales, 2) as [Q, Q];
        if (rng.bool(0.4)) {
          const inv = Q.one.div(a);
          const test = Q.of(a.d);
          const moved = a.mul(test);
          return numberProblem({
            prompt: t(
              `A figure is stretched ${way.en} by a factor of $${a.toLatex()}$. By what factor must its image be stretched ${way.en} to return it to the original figure?`,
              `把一个图形沿${way["zh-CN"]}方向以因子 $${a.toLatex()}$ 伸缩。要把它的像变回原图形，应沿${way["zh-CN"]}方向以什么因子伸缩？`,
            ),
            answer: inv,
            wrong: [a, a.neg(), Q.one.sub(a)],
            solution: t(
              `${stepLabel(1, "write the condition", "写出条件").en} The first stretch multiplies each $${v}$-coordinate by $${a.toLatex()}$, and the second by an unknown factor $k$. To return every point to where it started, the two together must multiply by $1$:${steps(`${a.toLatex()} \\cdot k = 1`)}${stepLabel(2, "solve for $k$", "解出 $k$").en} Divide both sides by $${a.toLatex()}$:${steps(`k = ${inv.toLatex()}`)}**Check.** Follow a point with $${v} = ${test.toLatex()}$. The first stretch sends it to $${a.toLatex()} \\cdot ${test.toLatex()} = ${moved.toLatex()}$, and the second brings it back: $${inv.toLatex()} \\cdot ${paren(moved)} = ${test.toLatex()}$.`,
              `${stepLabel(1, "write the condition", "写出条件")["zh-CN"]}第一次伸缩把每个 $${v}$ 坐标乘以 $${a.toLatex()}$，第二次乘以未知因子 $k$。要使每个点都回到原处，两次合起来必须乘以 $1$：${steps(`${a.toLatex()} \\cdot k = 1`)}${stepLabel(2, "solve for $k$", "解出 $k$")["zh-CN"]}两边同时除以 $${a.toLatex()}$：${steps(`k = ${inv.toLatex()}`)}**检验。** 跟踪一个 $${v} = ${test.toLatex()}$ 的点。第一次伸缩把它映到 $${a.toLatex()} \\cdot ${test.toLatex()} = ${moved.toLatex()}$，第二次又把它带回来：$${inv.toLatex()} \\cdot ${paren(moved)} = ${test.toLatex()}$。`,
            ),
          });
        }
        const ab = a.mul(b);
        const test = Q.of(a.d * b.d);
        const once = a.mul(test);
        const twice = b.mul(once);
        return numberProblem({
          prompt: t(
            `A figure is stretched ${way.en} by a factor of $${a.toLatex()}$, and the image is then stretched ${way.en} by a factor of $${b.toLatex()}$. The result is a single ${horizontal ? "horizontal" : "vertical"} stretch. Find its factor.`,
            `把一个图形沿${way["zh-CN"]}方向以因子 $${a.toLatex()}$ 伸缩，再把像沿${way["zh-CN"]}方向以因子 $${b.toLatex()}$ 伸缩。结果是一次${way["zh-CN"]}伸缩。求它的因子。`,
          ),
          answer: ab,
          wrong: [a.add(b), a.div(b), b.div(a)],
          solution: t(
            `${stepLabel(1, "follow one coordinate", "跟踪一个坐标").en} Both stretches act on the $${v}$-coordinate. The first sends $${v}$ to $${times(a, v)}$, and the second multiplies that by $${b.toLatex()}$: $${v} \\to ${b.toLatex()} \\cdot ${times(a, v)}$.\n\n${stepLabel(2, "multiply the factors", "把因子相乘").en}${steps(`${a.toLatex()} \\cdot ${b.toLatex()} = ${ab.toLatex()}`)}**Check.** Follow a point with $${v} = ${test.toLatex()}$ through both stretches: $${a.toLatex()} \\cdot ${test.toLatex()} = ${once.toLatex()}$, then $${b.toLatex()} \\cdot ${paren(once)} = ${twice.toLatex()}$. A single stretch by $${ab.toLatex()}$ gives the same: $${ab.toLatex()} \\cdot ${test.toLatex()} = ${twice.toLatex()}$.`,
            `${stepLabel(1, "follow one coordinate", "跟踪一个坐标")["zh-CN"]}两次伸缩都作用在 $${v}$ 坐标上。第一次把 $${v}$ 映到 $${times(a, v)}$，第二次再乘以 $${b.toLatex()}$：$${v} \\to ${b.toLatex()} \\cdot ${times(a, v)}$。\n\n${stepLabel(2, "multiply the factors", "把因子相乘")["zh-CN"]}${steps(`${a.toLatex()} \\cdot ${b.toLatex()} = ${ab.toLatex()}`)}**检验。** 跟踪一个 $${v} = ${test.toLatex()}$ 的点经过两次伸缩：$${a.toLatex()} \\cdot ${test.toLatex()} = ${once.toLatex()}$，再 $${b.toLatex()} \\cdot ${paren(once)} = ${twice.toLatex()}$。以因子 $${ab.toLatex()}$ 伸缩一次得到同样的结果：$${ab.toLatex()} \\cdot ${test.toLatex()} = ${twice.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-stretch-factors",
      title: t("Finding the stretch factors", "求伸缩因子"),
      explanation: t(
        "If $(x, y) \\to (ax, by)$ maps $P$ to $P'$, then $x_{P'} = a \\, x_P$ and $y_{P'} = b \\, y_P$. Each factor acts on its own coordinate, so divide coordinate by coordinate:\n\n$$a = \\frac{x_{P'}}{x_P}, \\quad b = \\frac{y_{P'}}{y_P}.$$\n\nIf $P(-6, 2)$ maps to $P'(-4, 10)$, then $a = \\frac{-4}{-6} = \\frac{2}{3}$ and $b = \\frac{10}{2} = 5$: a horizontal stretch by $\\frac{2}{3}$ and a vertical stretch by $5$. Applying them, $(\\frac{2}{3} \\cdot (-6), 5 \\cdot 2) = (-4, 10)$.\n\n> **Watch out.** Divide image by preimage, not preimage by image, which gives the factors that go back. Keep $a$ with $x$ and $b$ with $y$. And the stretch multiplies, so differences of coordinates are not the factors.",
        "若 $(x, y) \\to (ax, by)$ 把 $P$ 映到 $P'$，则 $x_{P'} = a \\, x_P$，$y_{P'} = b \\, y_P$。每个因子作用在自己的坐标上，所以把坐标逐个相除：\n\n$$a = \\frac{x_{P'}}{x_P}, \\quad b = \\frac{y_{P'}}{y_P}$$\n\n若 $P(-6, 2)$ 映到 $P'(-4, 10)$，则 $a = \\frac{-4}{-6} = \\frac{2}{3}$，$b = \\frac{10}{2} = 5$：水平伸缩因子为 $\\frac{2}{3}$，竖直伸缩因子为 $5$。代回去，$(\\frac{2}{3} \\cdot (-6), 5 \\cdot 2) = (-4, 10)$。\n\n> **注意。** 是像除以原像，不是原像除以像，后者得到的是变回去的因子。$a$ 对应 $x$，$b$ 对应 $y$，不能颠倒。伸缩是相乘，所以坐标之差不是因子。",
      ),
      generate(rng) {
        const a = rng.pick(niceScales);
        const b = rng.bool(0.15) ? a : rng.pick(niceScales);
        const p = pickCombinedPoint(rng, a, b);
        const image: QP = [a.mul(Q.of(p[0])), b.mul(Q.of(p[1]))];
        const note = a.eq(b)
          ? t(
              " The two factors are equal, so this stretch is a dilation about the origin.",
              "两个因子相等，所以这次伸缩是以原点为中心的位似。",
            )
          : t("", "");
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
            `${stepLabel(1, "find $a$ from the $x$-coordinates", "由 $x$ 坐标求 $a$").en} The stretch multiplies $x$ by $a$, so $${image[0].toLatex()} = a \\cdot ${paren(p[0])}$:${steps(`a = \\frac{${image[0].toLatex()}}{${p[0]}} = ${a.toLatex()}`)}${stepLabel(2, "find $b$ from the $y$-coordinates", "由 $y$ 坐标求 $b$").en} It multiplies $y$ by $b$, so $${image[1].toLatex()} = b \\cdot ${paren(p[1])}$:${steps(`b = \\frac{${image[1].toLatex()}}{${p[1]}} = ${b.toLatex()}`)}**Check.** Applying $${combinedRule(a, b)}$ to $P$ gives $P'$: $(${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}$.${note.en}`,
            `${stepLabel(1, "find $a$ from the $x$-coordinates", "由 $x$ 坐标求 $a$")["zh-CN"]}伸缩把 $x$ 乘以 $a$，所以 $${image[0].toLatex()} = a \\cdot ${paren(p[0])}$：${steps(`a = \\frac{${image[0].toLatex()}}{${p[0]}} = ${a.toLatex()}`)}${stepLabel(2, "find $b$ from the $y$-coordinates", "由 $y$ 坐标求 $b$")["zh-CN"]}它把 $y$ 乘以 $b$，所以 $${image[1].toLatex()} = b \\cdot ${paren(p[1])}$：${steps(`b = \\frac{${image[1].toLatex()}}{${p[1]}} = ${b.toLatex()}`)}**检验。** 把 $${combinedRule(a, b)}$ 用于 $P$：$(${a.toLatex()} \\cdot ${paren(p[0])}, \\; ${b.toLatex()} \\cdot ${paren(p[1])}) = ${pl(image)}$，正是 $P'$。${note["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "areas-under-combined-stretches",
      figure: geometryDrawings2["combining-stretches-of-geometric-figures#areas-under-combined-stretches"],
      title: t("Areas under combined stretches", "组合伸缩下的面积"),
      explanation: t(
        "The stretch $(x, y) \\to (ax, by)$ multiplies horizontal lengths by $a$ and vertical lengths by $b$. A unit square becomes an $a \\times b$ rectangle, so every little square of the grid has its area multiplied by $ab$, and so does any figure made of them, even a curved one. For a dilation, $a = b = k$, and areas are multiplied by $k^2$.\n\nA trapezoid of area $8$ stretched horizontally by $\\frac{3}{2}$ and vertically by $2$ has area $8 \\cdot \\frac{3}{2} \\cdot 2 = 24$. Doing the stretches one at a time agrees: the first gives $8 \\cdot \\frac{3}{2} = 12$, the second $12 \\cdot 2 = 24$.\n\n> **Watch out.** The area is multiplied by the product $ab$, not by the sum $a + b$, and not by just one of the factors. Squaring is for a dilation by $k$; here, multiplying by $(ab)^2$ would count each factor twice.",
        "伸缩 $(x, y) \\to (ax, by)$ 把水平长度乘以 $a$，竖直长度乘以 $b$。单位正方形变成 $a \\times b$ 的长方形，所以网格中每个小正方形的面积都乘以 $ab$，由它们组成的任何图形也一样，曲边图形也不例外。对于位似，$a = b = k$，面积乘以 $k^2$。\n\n面积为 $8$ 的梯形以因子 $\\frac{3}{2}$ 水平伸缩、以因子 $2$ 竖直伸缩后，面积为 $8 \\cdot \\frac{3}{2} \\cdot 2 = 24$。一次做一个伸缩也得到同样的结果：第一次得 $8 \\cdot \\frac{3}{2} = 12$，第二次得 $12 \\cdot 2 = 24$。\n\n> **注意。** 面积乘以的是积 $ab$，不是和 $a + b$，也不是只乘其中一个因子。平方用于因子为 $k$ 的位似；这里乘以 $(ab)^2$ 就把每个因子算了两次。",
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
        const first = Q.of(area).mul(a);
        return numberProblem({
          prompt: t(
            `A ${shape.en} with area $${area}$ is stretched horizontally by a factor of $${a.toLatex()}$ and vertically by a factor of $${b.toLatex()}$. Find the area of its image.`,
            `面积为 $${area}$ 的${shape["zh-CN"]}沿水平方向以因子 $${a.toLatex()}$、沿竖直方向以因子 $${b.toLatex()}$ 伸缩。求它的像的面积。`,
          ),
          answer: result,
          wrong: [Q.of(area).mul(a.add(b)), Q.of(area).mul(a), Q.of(area).mul(a).mul(a).mul(b).mul(b)],
          solution: t(
            `${stepLabel(1, "find the area factor", "求面积的倍数").en} The stretch $${combinedRule(a, b)}$ turns each unit square of the grid into a $${a.toLatex()} \\times ${b.toLatex()}$ rectangle, so it multiplies every area by $${a.toLatex()} \\cdot ${b.toLatex()} = ${a.mul(b).toLatex()}$.\n\n${stepLabel(2, "multiply the area", "乘以原面积").en}${steps(`${area} \\cdot ${a.mul(b).toLatex()} = ${result.toLatex()}`)}**Check.** Do the stretches one at a time. The horizontal stretch alone multiplies the area by $${a.toLatex()}$: $${area} \\cdot ${a.toLatex()} = ${first.toLatex()}$. The vertical stretch then multiplies it by $${b.toLatex()}$, giving the same result: $${first.toLatex()} \\cdot ${b.toLatex()} = ${result.toLatex()}$.`,
            `${stepLabel(1, "find the area factor", "求面积的倍数")["zh-CN"]}伸缩 $${combinedRule(a, b)}$ 把网格中每个单位正方形变成 $${a.toLatex()} \\times ${b.toLatex()}$ 的长方形，所以把每个面积乘以 $${a.toLatex()} \\cdot ${b.toLatex()} = ${a.mul(b).toLatex()}$。\n\n${stepLabel(2, "multiply the area", "乘以原面积")["zh-CN"]}${steps(`${area} \\cdot ${a.mul(b).toLatex()} = ${result.toLatex()}`)}**检验。** 一次做一个伸缩。只做水平伸缩，面积乘以 $${a.toLatex()}$：$${area} \\cdot ${a.toLatex()} = ${first.toLatex()}$。再做竖直伸缩，乘以 $${b.toLatex()}$：$${first.toLatex()} \\cdot ${b.toLatex()} = ${result.toLatex()}$，结果相同。`,
          ),
        });
      },
    },
  ],
};

// ─── Combining Geometric Transformations ────────────────────────────────────

/** Move is a transformation of the plane that maps grid points to grid points, with its inverse. */
export interface Move {
  readonly f: (p: XY) => XY;
  readonly inv: (p: XY) => XY;
  readonly name: Text;
  readonly kind: "translation" | "reflection" | "rotation" | "dilation";
  /** put writes the image of a point with its coordinates substituted into the rule: "(2 + 3, \; 5 - 1)". */
  readonly put?: (p: XY) => string;
  /** undo is the move that undoes this one. */
  readonly undo?: () => Move;
  /** rule writes the rule of the move: "(x, y) \\to (-y, x)". */
  readonly rule?: string;
}

/** zs puts a space after a Chinese phrase that ends in math, before Chinese text follows. */
const zs = (s: string) => (s.endsWith("$") ? `${s} ` : s);

/** translationRule writes (x, y) → (x + h, y + v). */
const translationRule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

/** plus writes a + d with the sign of d: "3 - 2". */
const plus = (a: number, d: number) => (d === 0 ? `${a}` : d > 0 ? `${a} + ${d}` : `${a} - ${-d}`);

/** translation is the move (x, y) → (x + h, y + v). */
export const translation = (h: number, v: number): Move => ({
  f: ([x, y]) => [x + h, y + v],
  inv: ([x, y]) => [x - h, y - v],
  name: t(`the translation $${translationRule(h, v)}$`, `平移 $${translationRule(h, v)}$`),
  kind: "translation",
  put: ([x, y]) => `(${plus(x, h)}, \\; ${plus(y, v)})`,
  undo: () => translation(-h, -v),
  rule: translationRule(h, v),
});

/** neg writes the opposite of a coordinate: "-5", "-(-5)". */
const neg = (v: number) => `-${paren(v)}`;

const reflectX: Move = {
  f: ([x, y]) => [x, z(-y)],
  inv: ([x, y]) => [x, z(-y)],
  name: t("the reflection across the $x$-axis", "关于 $x$ 轴的轴对称"),
  kind: "reflection",
  put: ([x, y]) => `(${x}, \\; ${neg(y)})`,
  undo: () => reflectX,
  rule: "(x, y) \\to (x, -y)",
};
const reflectY: Move = {
  f: ([x, y]) => [z(-x), y],
  inv: ([x, y]) => [z(-x), y],
  name: t("the reflection across the $y$-axis", "关于 $y$ 轴的轴对称"),
  kind: "reflection",
  put: ([x, y]) => `(${neg(x)}, \\; ${y})`,
  undo: () => reflectY,
  rule: "(x, y) \\to (-x, y)",
};
const reflectYX: Move = {
  f: ([x, y]) => [y, x],
  inv: ([x, y]) => [y, x],
  name: t("the reflection across the line $y = x$", "关于直线 $y = x$ 的轴对称"),
  kind: "reflection",
  put: ([x, y]) => `(${y}, \\; ${x})`,
  undo: () => reflectYX,
  rule: "(x, y) \\to (y, x)",
};
const reflectYNegX: Move = {
  f: ([x, y]) => [z(-y), z(-x)],
  inv: ([x, y]) => [z(-y), z(-x)],
  name: t("the reflection across the line $y = -x$", "关于直线 $y = -x$ 的轴对称"),
  kind: "reflection",
  put: ([x, y]) => `(${neg(y)}, \\; ${neg(x)})`,
  undo: () => reflectYNegX,
  rule: "(x, y) \\to (-y, -x)",
};
const rotateCcw: Move = {
  f: ([x, y]) => [z(-y), x],
  inv: ([x, y]) => [y, z(-x)],
  name: t("the rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$"),
  kind: "rotation",
  put: ([x, y]) => `(${neg(y)}, \\; ${x})`,
  undo: () => rotateCw,
  rule: "(x, y) \\to (-y, x)",
};
const rotateHalf: Move = {
  f: ([x, y]) => [z(-x), z(-y)],
  inv: ([x, y]) => [z(-x), z(-y)],
  name: t("the rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
  kind: "rotation",
  put: ([x, y]) => `(${neg(x)}, \\; ${neg(y)})`,
  undo: () => rotateHalf,
  rule: "(x, y) \\to (-x, -y)",
};
const rotateCw: Move = {
  f: ([x, y]) => [y, z(-x)],
  inv: ([x, y]) => [z(-y), x],
  name: t("the rotation of $90^\\circ$ clockwise about the origin", "绕原点顺时针旋转 $90^\\circ$"),
  kind: "rotation",
  put: ([x, y]) => `(${y}, \\; ${neg(x)})`,
  undo: () => rotateCcw,
  rule: "(x, y) \\to (y, -x)",
};

/** rigidMoves are the reflections and rotations about the origin that keep grid points on the grid. */
export const rigidMoves: readonly Move[] = [reflectX, reflectY, reflectYX, reflectYNegX, rotateCcw, rotateHalf, rotateCw];

/** dilation is the dilation about the origin by a whole number k. */
const dilation = (k: number): Move => ({
  f: ([x, y]) => [k * x, k * y],
  inv: ([x, y]) => [x / k, y / k],
  name: t(`the dilation about the origin with scale factor $${k}$`, `以原点为中心、比例因子为 $${k}$ 的位似`),
  kind: "dilation",
  rule: `(x, y) \\to (${k}x, ${k}y)`,
  put: ([x, y]) => `(${k} \\cdot ${paren(x)}, \\; ${k} \\cdot ${paren(y)})`,
  undo: () => ({
    f: ([x, y]) => [x / k, y / k],
    inv: ([x, y]) => [k * x, k * y],
    name: t(`the dilation about the origin with scale factor $\\frac{1}{${k}}$`, `以原点为中心、比例因子为 $\\frac{1}{${k}}$ 的位似`),
    kind: "dilation",
    rule: `(x, y) \\to \\left(\\frac{x}{${k}}, \\frac{y}{${k}}\\right)`,
    put: ([x, y]) => `\\left(\\frac{${x}}{${k}}, \\; \\frac{${y}}{${k}}\\right)`,
  }),
});

/** pickTranslation picks a translation that moves both coordinates. */
const pickTranslation = (rng: Rng) => translation(rng.nonZero(-5, 5), rng.nonZero(-5, 5));

/** sequenceName lists transformations in order: "A, followed by B, followed by C". */
export function sequenceName(moves: readonly Move[]): Text {
  return t(moves.map((m) => m.name.en).join(", followed by "), moves.map((m) => m.name["zh-CN"]).join("，然后"));
}

/** applyAll applies moves in order. */
export const applyAll = (moves: readonly Move[], p: XY): XY => moves.reduce((q, m) => m.f(q), p);

/** same2 tells whether two points are equal. */
export const same2 = (a: XY, b: XY) => a[0] === b[0] && a[1] === b[1];

/** traceSteps writes the images of p after each move: P₁, P₂, …, the last named P'. */
export function traceSteps(moves: readonly Move[], p: XY): { en: string; zh: string } {
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

/** moveLine writes the image of p under m, with the coordinates substituted where the rule is known: "P_1 = (2 + 3, 5) = (5, 5)". */
function moveLine(m: Move, p: XY, label: string): string {
  const image = pl(m.f(p));
  const put = m.put?.(p);
  return put && put.replace(/ \\; /g, " ") !== image ? `${label} = ${put} = ${image}` : `${label} = ${image}`;
}

/** stepTrace walks p through moves, one labeled step per move, naming the images P₁, P₂, … and the last P'. */
function stepTrace(moves: readonly Move[], p: XY, first = 1): Text {
  let q = p;
  const en: string[] = [];
  const zh: string[] = [];
  moves.forEach((m, i) => {
    const label = i === moves.length - 1 ? "P'" : `P_{${i + 1}}`;
    const line = steps(moveLine(m, q, label));
    q = m.f(q);
    const rule = m.rule && m.kind !== "translation" ? t(` Its rule is $${m.rule}$:`, `它的规则是 $${m.rule}$：`) : t("", "");
    en.push(`${stepLabel(first + i, `apply ${m.name.en}`, "").en}${rule.en}${line}`);
    zh.push(`${stepLabel(first + i, "", `作${m.name["zh-CN"]}`)["zh-CN"]}${rule["zh-CN"]}${line}`);
  });
  return t(en.join(""), zh.join(""));
}

/** undoCheck undoes moves in reverse order from the image back to p, for a check. */
function undoCheck(moves: readonly Move[], p: XY): Text {
  const stages: XY[] = [p];
  for (const m of moves) stages.push(m.f(stages[stages.length - 1]!));
  const en: string[] = [];
  const zh: string[] = [];
  for (let i = moves.length - 1; i >= 0; i--) {
    const back = moves[i]!.undo?.();
    const what = back ? back.name : t("the inverse move", "逆变换");
    const from = i === moves.length - 1 ? "$P'$" : `$${pl(stages[i + 1]!)}$`;
    const to = i === 0 ? `$P${pl(stages[0]!)}$` : `$${pl(stages[i]!)}$`;
    en.push(`${what.en} takes ${from} back to ${to}`);
    zh.push(`${zs(what["zh-CN"])}把 ${from} 变回 ${to}`);
  }
  return t(
    `**Check.** Undo the moves in reverse order: ${en.join(", then ")}, the point we started from.`,
    `**检验。** 按相反的顺序还原：${zh.join("，再")}，正是出发的点。`,
  );
}

/** Lin is a linear map (x, y) → (ax + by, cx + dy) with entries −1, 0 or 1. */
type Lin = readonly [number, number, number, number];

/** after composes linear maps: p after q. */
const after = (p: Lin, q: Lin): Lin => [
  z(p[0] * q[0] + p[1] * q[2]),
  z(p[0] * q[1] + p[1] * q[3]),
  z(p[2] * q[0] + p[3] * q[2]),
  z(p[2] * q[1] + p[3] * q[3]),
];

/** applyLin applies a linear map to a point. */
const applyLin = (m: Lin, [x, y]: XY): XY => [z(m[0] * x + m[1] * y), z(m[2] * x + m[3] * y)];

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

/** sub writes a coordinate of a rule with x and y replaced by the expressions ex and ey: "-y" with y → "-x" gives "-(-x)" = "x". */
const subIn = (a: number, b: number, ex: string, ey: string) => {
  const e = a !== 0 ? ex : ey;
  const s = a !== 0 ? a : b;
  return s === 1 ? e : e.startsWith("-") ? `-(${e})` : `-${e}`;
};

/** combiningIntro follows P(1, 4) through a translation 4 units left and then a reflection across the y-axis. */
const combiningIntro = tracked(
  ["P", "P′"],
  [
    [1, 4],
    [-3, 4],
    [3, 4],
  ],
);

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
  ],
  xp: 16,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.5"],
  intro: t(
    `Each transformation so far has a rule: a translation adds to the coordinates, a reflection or rotation about the origin swaps them or changes their signs, and a dilation multiplies them. Doing one transformation after another is how figures are moved into place, for example to show that two figures are congruent. The second rule acts on the **image** of the first, so the work goes one step at a time.

Translate $P(1, 4)$ by $(x, y) \\to (x - 4, y)$, then reflect it across the $y$-axis. The translation gives $P_1 = (1 - 4, 4) = (-3, 4)$, and the reflection changes the sign of $x$: $P' = (3, 4)$.

{{figure 0}}

Done the other way round, the reflection gives $(-1, 4)$ and the translation then gives $(-5, 4)$: a different point. So the order matters. This topic applies such sequences, undoes them, and writes a single rule for two moves.`,
    `到目前为止，每个变换都有一条规则：平移是给坐标加上一个数，关于原点的轴对称或旋转是交换坐标或改变它们的符号，位似是把坐标乘以一个数。一个变换接着一个变换，就能把图形移到需要的位置，例如用来说明两个图形全等。第二条规则作用在第一个变换的**像**上，所以要一步一步来。

把 $P(1, 4)$ 按 $(x, y) \\to (x - 4, y)$ 平移，再关于 $y$ 轴作轴对称。平移得 $P_1 = (1 - 4, 4) = (-3, 4)$，轴对称改变 $x$ 的符号：$P' = (3, 4)$。

{{figure 0}}

如果顺序反过来，轴对称得 $(-1, 4)$，再平移得 $(-5, 4)$：是另一个点。所以顺序很重要。本课施行这样的变换序列，还原它们，并为两个变换写出一条规则。`,
  ),
  introFigures: [combiningIntro],
  knowledgePoints: [
    {
      id: "applying-two-transformations",
      figure: motionDrawings["applying-two-transformations"],
      title: t("Applying two transformations", "施行两个变换"),
      explanation: t(
        "To apply a sequence of transformations, apply them **in the order given**, each one to the image of the one before. The second transformation never sees the original point, only where the first one put it.\n\nReflect $P(2, 5)$ across the $x$-axis, then translate by $(x, y) \\to (x - 3, y + 1)$:\n\n1. Reflection: $P_1 = (2, -5)$\n2. Translation: $P' = (2 - 3, -5 + 1) = (-1, -4)$\n\nThe order matters: translating first gives $(-1, 6)$, and reflecting that gives $(-1, -6)$, a different point.\n\n> **Watch out.** Do the transformations in the order they are listed, not the reverse. Apply the second one to the image $P_1$, not to $P$, and do not stop after the first: the answer is the image after both.",
        "要施行一串变换，就**按给出的顺序**进行，每个变换作用在前一个变换的像上。第二个变换看不到原来的点，只看到第一个变换把它放到了哪里。\n\n把 $P(2, 5)$ 先关于 $x$ 轴作轴对称，再按 $(x, y) \\to (x - 3, y + 1)$ 平移：\n\n1. 轴对称：$P_1 = (2, -5)$\n2. 平移：$P' = (2 - 3, -5 + 1) = (-1, -4)$\n\n顺序很重要：先平移得 $(-1, 6)$，再作轴对称得 $(-1, -6)$，是另一个点。\n\n> **注意。** 按列出的顺序施行变换，不要倒过来。第二个变换作用在像 $P_1$ 上，而不是 $P$ 上；也不要只做第一个就停下：答案是两个变换都做完后的像。",
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
          const trace = stepTrace(moves, p);
          const check = undoCheck(moves, p);
          return {
            ...pointProblem({
              prompt: t(
                `The point $P${pl(p)}$ is mapped by ${sequenceName(moves).en}. Find the coordinates of its image $P'$.`,
                `对点 $P${pl(p)}$ 先作${sequenceName(moves)["zh-CN"]}。求它的像 $P'$ 的坐标。`,
              ),
              answer,
              wrong: [reversed, moves[0]!.f(p), moves[1]!.f(p)],
              solution: t(
                `Apply the transformations in the order given, each to the latest image.\n\n${trace.en}${check.en}\n\n{{figure 0}}`,
                `按给出的顺序施行变换，每个都作用在最新的像上。\n\n${trace["zh-CN"]}${check["zh-CN"]}\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [tracked(["P", "P′"], [p, moves[0]!.f(p), answer])],
          };
        }
      },
    },
    {
      id: "sequences-with-dilations",
      figure: motionDrawings["sequences-with-dilations"],
      title: t("Sequences with dilations", "含位似的变换序列"),
      explanation: t(
        "A sequence may mix rigid motions with dilations. Keep applying each transformation to the latest image. A dilation multiplies distances from the origin, so whether it comes before or after a translation changes how far the translation's shift is stretched.\n\nDilate $P(1, -2)$ about the origin with scale factor $3$, rotate $90^\\circ$ counterclockwise about the origin, then translate by $(x, y) \\to (x + 2, y - 4)$:\n\n1. Dilation: $P_1 = (3 \\cdot 1, 3 \\cdot (-2)) = (3, -6)$\n2. Rotation, $(x, y) \\to (-y, x)$: $P_2 = (6, 3)$\n3. Translation: $P' = (6 + 2, 3 - 4) = (8, -1)$\n\n> **Watch out.** Apply the transformations in the listed order, not in reverse. Every one of them counts: skipping the middle step or stopping after two gives the wrong point.",
        "一串变换可以把刚体运动和位似混在一起。始终把每个变换作用在最新的像上。位似把到原点的距离乘以比例因子，所以它在平移之前还是之后，决定了平移的位移是否也被放大。\n\n把 $P(1, -2)$ 以原点为中心、比例因子 $3$ 作位似，再绕原点逆时针旋转 $90^\\circ$，然后按 $(x, y) \\to (x + 2, y - 4)$ 平移：\n\n1. 位似：$P_1 = (3 \\cdot 1, 3 \\cdot (-2)) = (3, -6)$\n2. 旋转，$(x, y) \\to (-y, x)$：$P_2 = (6, 3)$\n3. 平移：$P' = (6 + 2, 3 - 4) = (8, -1)$\n\n> **注意。** 按列出的顺序施行变换，不要倒过来。每一个都要做：跳过中间一步，或者只做两步就停下，都会得到错误的点。",
      ),
      generate(rng) {
        for (;;) {
          const p: XY = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
          const moves = rng.shuffle([pickTranslation(rng), rng.pick(rigidMoves), dilation(rng.int(2, 3))]);
          const answer = applyAll(moves, p);
          const reversed = applyAll([...moves].reverse(), p);
          const skipped = applyAll([moves[0]!, moves[2]!], p);
          if (same2(answer, reversed)) continue;
          const trace = stepTrace(moves, p);
          const check = undoCheck(moves, p);
          return {
            ...pointProblem({
              prompt: t(
                `The point $P${pl(p)}$ is mapped by ${sequenceName(moves).en}. Find the coordinates of its image $P'$.`,
                `对点 $P${pl(p)}$ 先作${sequenceName(moves)["zh-CN"]}。求它的像 $P'$ 的坐标。`,
              ),
              answer,
              wrong: [reversed, skipped, applyAll(moves.slice(0, 2), p)],
              solution: t(
                `Apply the transformations in the order given, each to the latest image.\n\n${trace.en}${check.en}\n\n{{figure 0}}`,
                `按给出的顺序施行变换，每个都作用在最新的像上。\n\n${trace["zh-CN"]}${check["zh-CN"]}\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [tracked(["P", "P′"], [p, moves[0]!.f(p), moves[1]!.f(moves[0]!.f(p)), answer])],
          };
        }
      },
    },
    {
      id: "undoing-a-sequence",
      figure: motionDrawings["undoing-a-sequence"],
      title: t("Undoing a sequence", "还原变换序列"),
      explanation: t(
        "To find the preimage, undo the transformations **in reverse order**: undo the last one first. It is like taking off shoes and socks: what went on last comes off first. A translation is undone by the opposite translation, a reflection by itself, and a rotation by the same rotation in the other direction.\n\nIf $P$ is rotated $90^\\circ$ clockwise about the origin and then translated by $(x, y) \\to (x - 2, y + 3)$ to $P'(1, 4)$:\n\n1. Undo the translation with $(x, y) \\to (x + 2, y - 3)$: $(1 + 2, 4 - 3) = (3, 1)$\n2. Undo the rotation by rotating $90^\\circ$ counterclockwise, $(x, y) \\to (-y, x)$: $P = (-1, 3)$\n\nCheck: rotating $(-1, 3)$ clockwise gives $(3, 1)$, and translating gives $(1, 4)$.\n\n> **Watch out.** Undo the last transformation first; undoing them in the listed order gives a different point. Undo each move with its inverse, not by applying it again (except a reflection or a half turn, which undo themselves), and finish both steps.",
        "要求原像，就**按相反的顺序**还原各个变换：先还原最后一个。就像脱鞋袜：最后穿上的最先脱下。平移用相反的平移还原，轴对称用它自己还原，旋转用反方向的同样角度的旋转还原。\n\n若 $P$ 绕原点顺时针旋转 $90^\\circ$，再按 $(x, y) \\to (x - 2, y + 3)$ 平移后得到 $P'(1, 4)$：\n\n1. 用 $(x, y) \\to (x + 2, y - 3)$ 还原平移：$(1 + 2, 4 - 3) = (3, 1)$\n2. 逆时针旋转 $90^\\circ$ 还原旋转，$(x, y) \\to (-y, x)$：$P = (-1, 3)$\n\n检验：把 $(-1, 3)$ 顺时针旋转得 $(3, 1)$，再平移得 $(1, 4)$。\n\n> **注意。** 先还原最后一个变换；按列出的顺序还原会得到另一个点。每个变换要用它的逆变换还原，而不是再做一次（轴对称和旋转 $180^\\circ$ 除外，它们的逆就是自己），并且两步都要做完。",
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
          const [u2, u1] = [m2.undo!(), m1.undo!()];
          const forward = t(
            `**Check.** Run the moves forward from $P${pl(p)}$: ${m1.name.en} gives $${pl(mid)}$, and ${m2.name.en} gives $${pl(image)}$, which is $P'$.`,
            `**检验。** 从 $P${pl(p)}$ 出发正向施行：${zs(m1.name["zh-CN"])}得 $${pl(mid)}$，${zs(m2.name["zh-CN"])}得 $${pl(image)}$，正是 $P'$。`,
          );
          return {
            ...pointProblem({
              prompt: t(
                `The point $P$ is mapped by ${sequenceName([m1, m2]).en}. Its image is $P'${pl(image)}$. Find the coordinates of $P$.`,
                `对点 $P$ 先作${sequenceName([m1, m2])["zh-CN"]}，得到像 $P'${pl(image)}$。求 $P$ 的坐标。`,
              ),
              answer: p,
              wrong: [wrongOrder, m2.f(m1.f(image)), mid],
              solution: t(
                `Undo the transformations in reverse order: the last one first.\n\n${stepLabel(1, "undo the second move", "还原第二个变换").en} ${cap(m2.name.en)} is undone by ${u2.name.en}${u2.kind === "translation" || !u2.rule ? "" : `, $${u2.rule}$`}:${steps(moveLine(u2, image, "P_1"))}${stepLabel(2, "undo the first move", "还原第一个变换").en} ${cap(m1.name.en)} is undone by ${u1.name.en}${u1.kind === "translation" || !u1.rule ? "" : `, $${u1.rule}$`}:${steps(moveLine(u1, mid, "P"))}${forward.en}\n\n{{figure 0}}`,
                `按相反的顺序还原：先还原最后一个。\n\n${stepLabel(1, "undo the second move", "还原第二个变换")["zh-CN"]}${zs(m2.name["zh-CN"])}用${zs(u2.name["zh-CN"])}还原${u2.kind === "translation" || !u2.rule ? "" : `，规则为 $${u2.rule}$`}：${steps(moveLine(u2, image, "P_1"))}${stepLabel(2, "undo the first move", "还原第一个变换")["zh-CN"]}${zs(m1.name["zh-CN"])}用${zs(u1.name["zh-CN"])}还原${u1.kind === "translation" || !u1.rule ? "" : `，规则为 $${u1.rule}$`}：${steps(moveLine(u1, mid, "P"))}${forward["zh-CN"]}\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [tracked(["P′", "P"], [image, mid, p])],
          };
        }
      },
    },
    {
      id: "a-single-rule-for-two-transformations",
      figure: geometryDrawings2["combining-geometric-transformations#a-single-rule-for-two-transformations"],
      title: t("A single rule for two transformations", "用一条规则表示两个变换"),
      explanation: t(
        "Two reflections or rotations about the origin combine into a single one. To find its rule, apply the first rule to $(x, y)$, then apply the second rule to the result: in the second rule, $x$ and $y$ stand for the coordinates of the point it is given, which are now the expressions the first rule produced.\n\nReflect across the $y$-axis, then rotate $180^\\circ$ about the origin:\n\n$$(x, y) \\to (-x, y) \\to (x, -y).$$\n\nThe rotation changes both signs of $(-x, y)$, and $-(-x) = x$. The result, $(x, y) \\to (x, -y)$, is the reflection across the $x$-axis. Test it with $(1, 2)$: the two moves give $(-1, 2)$ and then $(1, -2)$, and the single rule gives $(1, -2)$ too.\n\n> **Watch out.** Apply the moves in the order given: done the other way round, two moves often give a different rule. And the answer combines both moves, so it is neither the first rule nor the second by itself.",
        "两个关于原点的轴对称或旋转可以合成一个。要求它的规则，先对 $(x, y)$ 应用第一条规则，再对结果应用第二条规则：第二条规则中的 $x$、$y$ 代表它所作用的点的坐标，而此时它们是第一条规则得出的表达式。\n\n先关于 $y$ 轴作轴对称，再绕原点旋转 $180^\\circ$：\n\n$$(x, y) \\to (-x, y) \\to (x, -y)$$\n\n旋转改变 $(-x, y)$ 两个坐标的符号，而 $-(-x) = x$。结果 $(x, y) \\to (x, -y)$ 就是关于 $x$ 轴的轴对称。用 $(1, 2)$ 检验：两个变换先得 $(-1, 2)$，再得 $(1, -2)$，而这一条规则也得 $(1, -2)$。\n\n> **注意。** 按给出的顺序施行：顺序反过来，两个变换常常给出不同的规则。答案是两个变换合起来的结果，所以既不是第一条规则，也不是第二条规则本身。",
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
        const [ex, ey] = [coord(first.m[0], first.m[1]), coord(first.m[2], first.m[3])];
        const raw = `(${subIn(second.m[0], second.m[1], ex, ey)}, ${subIn(second.m[2], second.m[3], ex, ey)})`;
        const simple = `(${coord(result[0], result[1])}, ${coord(result[2], result[3])})`;
        const test: XY = [1, 2];
        const [t1, t2, t3] = [applyLin(first.m, test), applyLin(second.m, applyLin(first.m, test)), applyLin(result, test)];
        const chainLine =
          raw === simple ? `(x, y) \\to (${ex}, ${ey}) \\to ${simple}` : `(x, y) \\to (${ex}, ${ey}) \\to ${raw} = ${simple}`;
        return reasoned(
          choiceProblem({
            prompt: t(
              `Which rule describes ${first.name.en}, followed by ${second.name.en}?`,
              `先作${first.name["zh-CN"]}，再作${second.name["zh-CN"]}，哪条规则描述了这个组合？`,
            ),
            options: options.map((m) => same(`$${linRule(m)}$`)),
            correct: options.findIndex((m) => linKey(m) === linKey(result)),
            solution: t(
              `${stepLabel(1, "apply the first rule", "应用第一条规则").en} ${cap(first.name.en)} is $${linRule(first.m)}$, so the point $(x, y)$ goes to $(${ex}, ${ey})$.\n\n${stepLabel(2, "apply the second rule to the result", "对结果应用第二条规则").en} ${cap(second.name.en)} is $${linRule(second.m)}$. Its $x$ and $y$ now stand for $${ex}$ and $${ey}$:${steps(chainLine)}This is ${named.name.en}.\n\n**Check.** Test the point $(1, 2)$. The first move sends it to $${pl(t1)}$, and the second sends that to $${pl(t2)}$. The single rule $${linRule(result)}$ sends $(1, 2)$ to $${pl(t3)}$ as well.`,
              `${stepLabel(1, "apply the first rule", "应用第一条规则")["zh-CN"]}${zs(first.name["zh-CN"])}是 $${linRule(first.m)}$，所以点 $(x, y)$ 映到 $(${ex}, ${ey})$。\n\n${stepLabel(2, "apply the second rule to the result", "对结果应用第二条规则")["zh-CN"]}${zs(second.name["zh-CN"])}是 $${linRule(second.m)}$。其中的 $x$、$y$ 现在代表 $${ex}$ 和 $${ey}$：${steps(chainLine)}这就是${named.name["zh-CN"]}。\n\n**检验。** 用点 $(1, 2)$ 检验。第一个变换把它映到 $${pl(t1)}$，第二个再映到 $${pl(t2)}$。而这一条规则 $${linRule(result)}$ 也把 $(1, 2)$ 映到 $${pl(t3)}$。`,
            ),
          }),
          [
            [
              `$${linRule(reverse)}$`,
              "This does the two moves in the opposite order, and order matters here.",
              "这是按相反的次序做两次变换，而这里次序有影响。",
            ],
            [`$${linRule(first.m)}$`, "This is the first move alone: the second one is left out.", "这只是第一次变换：第二次被漏掉了。"],
            [`$${linRule(second.m)}$`, "This is the second move alone: the first one is left out.", "这只是第二次变换：第一次被漏掉了。"],
          ],
        );
      },
    },
  ],
};

// ─── Symmetry ───────────────────────────────────────────────────────────────

/** Axis is a line of symmetry of a shape: a point on it and its direction in degrees. */
type Axis = readonly [at: Point, degrees: number];

/** Shape is a polygon with its lines of symmetry and order of rotational symmetry, why it has them, and typical wrong counts. */
interface Shape {
  readonly name: Text;
  readonly points: readonly Point[];
  readonly lines: number;
  readonly order: number;
  readonly wrongLines: readonly number[];
  readonly wrongOrder: readonly number[];
  /** axes are the lines of symmetry, to draw. */
  readonly axes: readonly Axis[];
  /** center is the center of rotation: the center of a regular polygon or parallelogram, else the average of the vertices. */
  readonly center: Point;
  /** why says which lines are lines of symmetry and why the others are not. */
  readonly why: Text;
  /** tries says why the likely folds fail, for a shape with no line of symmetry. */
  readonly tries?: Text;
  /** whyOrder says which turns map the shape onto itself and why the others do not. */
  readonly whyOrder: Text;
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

/** anOf puts the indefinite article before an English noun phrase. */
const anOf = (noun: string) => `${/^[aeiou]/.test(noun) ? "an" : "a"} ${noun}`;

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

/** average is the average of points. */
const average = (pts: readonly Point[]): Point => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

/** halfTurnFails says why a half turn does not map a shape with two unequal parallel sides onto itself. */
const halfTurnFails = (what: Text): Text =>
  t(
    `A half turn about any point would have to swap ${what.en}, which have different lengths, and no smaller turn works either. Only the full turn of $360^\\circ$ brings it back onto itself.`,
    `绕任何一点转半圈都要交换${what["zh-CN"]}，而它们长度不同；更小的旋转也不行。只有转一整圈 $360^\\circ$ 才能使它回到自身。`,
  );

/** pickShape draws a random polygon of a random kind. */
function pickShape(rng: Rng): Shape {
  const kind = rng.pick(shapeKinds);
  const shape = (
    en: string,
    zh: string,
    pts: Point[],
    lines: number,
    order: number,
    wl: number[],
    wo: number[],
    more: Pick<Shape, "axes" | "why" | "whyOrder" | "tries"> & { center?: Point },
  ): Shape => ({
    name: t(en, zh),
    points: pts,
    lines,
    order,
    wrongLines: wl,
    wrongOrder: wo,
    ...more,
    center: more.center ?? average(pts),
  });
  switch (kind) {
    case "regular": {
      const n = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
      const phi = rng.int(-25, 25);
      const [en, zh] = regularNames[n]!;
      const pts = Array.from({ length: n }, (_, i) => dir(90 + (360 * i) / n + phi));
      const how =
        n % 2 === 1
          ? t(
              `Since $${n}$ is odd, each such line joins a vertex to the midpoint of the opposite side: one line for each of the $${n}$ vertices.`,
              `因为 $${n}$ 是奇数，每条这样的线都连接一个顶点和对边的中点：$${n}$ 个顶点各对应一条。`,
            )
          : t(
              `Since $${n}$ is even, $${n / 2}$ of them join opposite vertices and $${n / 2}$ join the midpoints of opposite sides: $${n / 2} + ${n / 2} = ${n}$.`,
              `因为 $${n}$ 是偶数，其中 $${n / 2}$ 条连接相对的顶点，$${n / 2}$ 条连接相对边的中点：$${n / 2} + ${n / 2} = ${n}$。`,
            );
      return shape(en, zh, pts, n, n, [2 * n, n - 1, 1], [2 * n, n - 1, 1], {
        center: [0, 0],
        axes: Array.from({ length: n }, (_, k): Axis => [[0, 0], 90 + phi + (180 * k) / n]),
        why: cat(
          t(
            `All sides and all angles of ${anOf(en)} are equal, so folding along a line through the center and a vertex, or through the center and the midpoint of a side, makes the two halves match. `,
            `${zh}的各边相等、各角相等，所以沿过中心和一个顶点的直线，或过中心和一边中点的直线对折，两半都能重合。`,
          ),
          how,
        ),
        whyOrder: t(
          `A turn of $${rotationAngle(n)}^\\circ$ about the center moves each vertex to the next one, and since all sides and angles are equal, the polygon lands on itself. Repeating the turn moves each vertex on, one vertex at a time, and after $${n}$ turns every vertex is back where it started.`,
          `绕中心旋转 $${rotationAngle(n)}^\\circ$ 把每个顶点移到下一个顶点；由于各边、各角都相等，多边形落在自身上。重复这个旋转，每次把顶点向前移一个，转 $${n}$ 次后每个顶点都回到原处。`,
        ),
      });
    }
    case "rectangle": {
      const w = rng.int(3, 7);
      const h = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== w));
      const c: Point = [w / 2, h / 2];
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
        {
          center: c,
          axes: [
            [c, 0],
            [c, 90],
          ],
          why: t(
            "The line through the midpoints of the two long sides and the line through the midpoints of the two short sides each fold the rectangle onto itself. A diagonal does not: its two sides are unequal, so folding along a diagonal sends a corner off the rectangle.",
            "过两条长边中点的直线和过两条短边中点的直线，都能把长方形对折重合。对角线不行：长方形相邻两边不相等，沿对角线对折会让一个角落到长方形外面。",
          ),
          whyOrder: t(
            "A half turn about the center, where the diagonals cross, swaps opposite corners and opposite sides, which are equal, so the rectangle lands on itself. A quarter turn would put a long side where a short side was, so it does not.",
            "绕中心（对角线的交点）转半圈，交换相对的顶点和相对的边，而它们相等，所以长方形落在自身上。转四分之一圈会把长边放到短边的位置上，所以不行。",
          ),
        },
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
        {
          center: [0, 0],
          axes: [
            [[0, 0], 0],
            [[0, 0], 90],
          ],
          why: t(
            "Each diagonal is a line of symmetry: all four sides are equal, so the two vertices off a diagonal are mirror images across it. The lines through the midpoints of opposite sides are not, because the angles of this rhombus are not right angles.",
            "每条对角线都是对称轴：四条边都相等，所以不在这条对角线上的两个顶点关于它对称。过对边中点的直线不是对称轴，因为这个菱形的角不是直角。",
          ),
          whyOrder: t(
            "A half turn about the center, where the diagonals cross, swaps opposite vertices, so the rhombus lands on itself. A quarter turn would put the long diagonal where the short one was, so it does not.",
            "绕中心（对角线的交点）转半圈，交换相对的顶点，所以菱形落在自身上。转四分之一圈会把长对角线放到短对角线的位置上，所以不行。",
          ),
        },
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
          {
            center: [(w + s) / 2, h / 2],
            axes: [],
            why: t(
              "Its adjacent sides have different lengths and its angles are not right angles, so no fold makes its two halves match.",
              "它的相邻两边长度不同，角也不是直角，所以无论怎样对折，两半都不能重合。",
            ),
            tries: t(
              "Try the likely folds. Folding along a diagonal gives two congruent triangles, but they face opposite ways: the fold sends a vertex off the parallelogram. Folding along a line through the midpoints of two opposite sides does not match the slanted sides with each other. So it has no line of symmetry: $0$.",
              "试一试可能的折痕。沿对角线对折，得到的两个三角形虽然全等，但方向相反：折过去后有一个顶点落在平行四边形外面。沿过两条对边中点的直线对折，两条斜边也对不上。所以它没有对称轴：$0$ 条。",
            ),
            whyOrder: t(
              "A half turn about the center, where the diagonals cross, swaps opposite vertices; opposite sides are equal and parallel, so the parallelogram lands on itself. A quarter turn would put a side where a side of a different direction was, so it does not.",
              "绕中心（对角线的交点）转半圈，交换相对的顶点；对边平行且相等，所以平行四边形落在自身上。转四分之一圈会把一条边放到方向不同的另一条边的位置上，所以不行。",
            ),
          },
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
        {
          axes: [[[0, 0], 90]],
          why: t(
            "The line through the midpoints of the two parallel sides folds it onto itself, because the two legs are equal. No other line works: any other fold would have to match the long base with the short one.",
            "过两条平行边中点的直线能把它对折重合，因为两腰相等。其他直线都不行：其他折法都要把长底和短底对在一起。",
          ),
          whyOrder: halfTurnFails(t("the long base and the short base", "长底和短底")),
        },
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
        {
          center: [0, 0],
          axes: [[[0, 0], 90]],
          why: t(
            "The diagonal through the two vertices where equal sides meet is a line of symmetry: the two equal pairs of sides are mirror images across it. The other diagonal is not, because the short sides on one end do not match the long sides on the other.",
            "过两组等边交点的那条对角线是对称轴：两组相等的边关于它对称。另一条对角线不是，因为一端的短边与另一端的长边对不上。",
          ),
          whyOrder: halfTurnFails(t("the two short sides and the two long sides", "两条短边和两条长边")),
        },
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
          {
            axes: [[[0, 0], 90]],
            why: t(
              "The line from the top vertex to the midpoint of the base is a line of symmetry, since the two legs are equal. The base has a different length from the legs, so no other line works.",
              "从顶点到底边中点的直线是对称轴，因为两腰相等。底边与腰长度不同，所以其他直线都不行。",
            ),
            whyOrder: t(
              "A turn of $120^\\circ$ would put the base where a leg was, and they have different lengths; a half turn would turn the triangle upside down. Only the full turn of $360^\\circ$ brings it back onto itself.",
              "旋转 $120^\\circ$ 会把底边放到腰的位置上，而它们长度不同；转半圈会把三角形倒过来。只有转一整圈 $360^\\circ$ 才能使它回到自身。",
            ),
          },
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
          {
            axes: [],
            why: t(
              "All three sides of a scalene triangle have different lengths, so no side has a partner to match it with.",
              "不等边三角形的三条边长度都不同，所以没有一条边能找到与它配对的边。",
            ),
            tries: t(
              "Try each line from a vertex to the midpoint of the opposite side: the two sides that meet at that vertex have different lengths, so the fold cannot match them. So it has no line of symmetry: $0$.",
              "试一试每条从顶点到对边中点的直线：在这个顶点相交的两条边长度不同，对折时对不上。所以它没有对称轴：$0$ 条。",
            ),
            whyOrder: t(
              "All three sides have different lengths, so no turn short of a full turn can put each side where a side of the same length was.",
              "三条边长度都不同，所以不满一整圈的旋转都不能把每条边放到等长的边原来的位置上。",
            ),
          },
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
          {
            axes: [],
            why: t(
              "Its two legs slant differently, so the halves on either side of any fold do not match.",
              "它的两腰倾斜程度不同，所以无论沿哪条线对折，两边都不能重合。",
            ),
            tries: t(
              "Try the line through the midpoints of the two bases: the legs on its two sides slant differently, so the halves do not match. Any other fold would have to swap the two bases, which have different lengths. So it has no line of symmetry: $0$.",
              "试一试过两底中点的直线：它两侧的腰倾斜程度不同，两半对不上。其他折法都要交换两条底，而两底长度不同。所以它没有对称轴：$0$ 条。",
            ),
            whyOrder: halfTurnFails(t("the two bases", "两条底")),
          },
        );
      }
    }
  }
}

/** shapePhi picks the angle a shape is drawn turned by; regular polygons with more than four sides are drawn upright. */
const shapePhi = (rng: Rng, s: Shape) => (s.points.length > 4 && s.lines === s.points.length ? 0 : rng.int(-20, 20));

/** shapeDrawing draws a shape turned by phi degrees, with more marks given in the shape's own coordinates. */
function shapeDrawing(s: Shape, phi: number, more: readonly Mark[], en: string, zh: string): Figure {
  const r = (p: Point) => turn(p, phi);
  const moved = more.map((m): Mark => {
    switch (m.kind) {
      case "segment":
        return { ...m, a: r(m.a), b: r(m.b) };
      case "arc":
        return { ...m, vertex: r(m.vertex), from: r(m.from), to: r(m.to) };
      case "dot":
        return { ...m, at: r(m.at) };
      case "label":
        return {
          ...m,
          at: r(m.at),
          dir: compassOf((Math.atan2(m.at[1] - s.center[1], m.at[0] - s.center[0]) * 180) / Math.PI + phi),
        };
      default:
        return m;
    }
  });
  return figure([{ kind: "polygon", points: s.points.map(r), accent: true }, ...moved], en, zh);
}

/** shapeFigure draws a shape turned by phi degrees. */
const shapeFigure = (s: Shape, phi: number): Figure => shapeDrawing(s, phi, [], `${cap(anOf(s.name.en))}.`, `一个${s.name["zh-CN"]}。`);

/** axesFigure draws a shape with its lines of symmetry dashed. */
function axesFigure(s: Shape, phi: number): Figure {
  const reach = Math.max(...s.points.map((p) => Math.hypot(p[0] - s.center[0], p[1] - s.center[1]))) + 1;
  const marks = s.axes.map(([at, d]): Mark => {
    const far = reach + Math.hypot(at[0] - s.center[0], at[1] - s.center[1]);
    return { kind: "segment", a: dir(d, far, at), b: dir(d + 180, far, at), dashed: true, tone: "action" };
  });
  return shapeDrawing(
    s,
    phi,
    marks,
    `${cap(anOf(s.name.en))} with its ${s.lines === 1 ? "line" : `${s.lines} lines`} of symmetry drawn dashed.`,
    `一个${s.name["zh-CN"]}，${s.lines} 条对称轴画成虚线。`,
  );
}

/** orderFigure draws a shape with its center and where vertex A lands after the smallest turn of symmetry, or, for order 1, the shape turned 180° about its center. */
function orderFigure(s: Shape, phi: number): Figure {
  const c = s.center;
  const a = s.points[0]!;
  const away = (p: Point): Point => {
    const d = Math.hypot(p[0] - c[0], p[1] - c[1]) || 1;
    return [p[0] + ((p[0] - c[0]) / d) * 0.01, p[1] + ((p[1] - c[1]) / d) * 0.01];
  };
  if (s.order === 1) {
    const ghost = s.points.map((p) => turn(p, 180, c));
    const marks: Mark[] = [
      ...ghost.map((p, i): Mark => ({ kind: "segment", a: p, b: ghost[(i + 1) % ghost.length]!, dashed: true, tone: "action" })),
      { kind: "dot", at: c },
    ];
    return shapeDrawing(
      s,
      phi,
      marks,
      `${cap(anOf(s.name.en))} and, dashed, its image under a half turn about its center: the two do not coincide.`,
      `一个${s.name["zh-CN"]}，以及它绕中心转半圈后的像（虚线）：两者不重合。`,
    );
  }
  const angle = 360 / s.order;
  const image = turn(a, angle, c);
  const marks: Mark[] = [
    { kind: "dot", at: c },
    { kind: "segment", a: c, b: a, dashed: true, tone: "action" },
    { kind: "segment", a: c, b: image, dashed: true, tone: "action" },
    ...(s.order > 2
      ? [
          {
            kind: "arc",
            vertex: c,
            from: a,
            to: image,
            label: `${Number.isInteger(angle) ? angle : angle.toFixed(1)}°`,
            tone: "result",
          } as const,
        ]
      : []),
    { kind: "dot", at: image, tone: "result" },
  ];
  const labels: Mark[] = [
    { kind: "label", at: away(a), text: "A", dir: "n", italic: true },
    { kind: "label", at: away(image), text: "A′", dir: "n", italic: true },
  ];
  const shown = Number.isInteger(angle) ? `${angle}` : `360/${s.order}`;
  return shapeDrawing(
    s,
    phi,
    [...marks, ...labels],
    `${cap(anOf(s.name.en))} with its center marked; a turn of ${shown}° about the center carries vertex A to the vertex A′.`,
    `一个${s.name["zh-CN"]}，标出了中心；绕中心旋转 ${shown}° 把顶点 A 带到顶点 A′。`,
  );
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

/** half writes half of an integer exactly: "3", "\frac{5}{2}". */
const half = (n: number) => Q.of(n, 2).toLatex();

/** symmetryIntro shows the isosceles triangle (−3, 0), (3, 0), (0, 5) with its line of symmetry, the y-axis. */
const symmetryIntro = graph(
  [
    ...named(
      [
        [-3, 0],
        [3, 0],
        [0, 5],
      ],
      ["A", "B", "C"],
    ),
    { kind: "line", a: [0, -1], b: [0, 1], dashed: true, tone: "action" },
  ],
  "Triangle ABC with A(−3, 0), B(3, 0) and C(0, 5), and its line of symmetry, the y-axis, dashed.",
  "三角形 ABC，A(−3, 0)、B(3, 0)、C(0, 5)，以及它的对称轴 y 轴（虚线）。",
);

/** reflectiveSymmetry counts and finds lines of symmetry. */
export const reflectiveSymmetry: TopicDef = {
  id: "reflective-symmetry",
  title: t("Reflective Symmetry", "轴对称性"),
  summary: t(
    "Count the lines of symmetry of polygons, find points that a line of symmetry pairs up, and find the line of symmetry of a figure in the coordinate plane.",
    "数出多边形的对称轴条数，求一条对称轴配对的点，并求坐标平面中图形的对称轴。",
  ),
  prerequisites: ["reflections-in-the-coordinate-plane", "angles-of-polygons"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.3"],
  intro: t(
    `A reflection flips the plane across a line. Most figures land somewhere else, but some land exactly on themselves: folding them along the line makes the two halves match. Such a line is a **line of symmetry**, and knowing it halves the work, since every fact about one side holds for the mirror side too.

Take the triangle with vertices $A(-3, 0)$, $B(3, 0)$ and $C(0, 5)$, and reflect it across the $y$-axis with $(x, y) \\to (-x, y)$. Then $A(-3, 0)$ goes to $(3, 0)$, which is $B$; $B$ goes to $A$; and $C(0, 5)$ stays put, since $-0 = 0$.

{{figure 0}}

The vertices only trade places, so the triangle lands on itself: the $y$-axis is a line of symmetry. It also shows why the triangle is isosceles: the reflection carries $\\overline{CA}$ onto $\\overline{CB}$, so the two have the same length. This topic counts the lines of symmetry of polygons, pairs up points across a line, and finds the line from coordinates.`,
    `轴对称把平面沿一条直线翻折。大多数图形会落到别处，但有些图形恰好落在自身上：沿这条直线对折，两半正好重合。这样的直线叫做**对称轴**。知道了对称轴，工作就省了一半，因为一侧的每个结论对另一侧也成立。

取顶点为 $A(-3, 0)$、$B(3, 0)$、$C(0, 5)$ 的三角形，用 $(x, y) \\to (-x, y)$ 把它关于 $y$ 轴作轴对称。$A(-3, 0)$ 映到 $(3, 0)$，就是 $B$；$B$ 映到 $A$；$C(0, 5)$ 不动，因为 $-0 = 0$。

{{figure 0}}

顶点只是互换了位置，所以三角形落在自身上：$y$ 轴是对称轴。这也说明了三角形为什么是等腰的：轴对称把 $\\overline{CA}$ 带到 $\\overline{CB}$ 上，所以两者长度相等。本课数出多边形的对称轴，求关于一条直线配对的点，并由坐标求出对称轴。`,
  ),
  introFigures: [symmetryIntro],
  knowledgePoints: [
    {
      id: "lines-of-symmetry-of-polygons",
      figure: motionDrawings["lines-of-symmetry-of-polygons"],
      title: t("Lines of symmetry of polygons", "多边形的对称轴"),
      explanation: t(
        "A figure has **reflective symmetry** when a reflection maps it onto itself; the line of that reflection is a **line of symmetry**, and folding along it makes the two halves match. A reflection keeps lengths and angles, so a line of symmetry must pair each side with a side of the same length, and each angle with an equal angle. That decides which lines work:\n\n- A regular polygon with $n$ sides has $n$ lines of symmetry.\n- A rectangle has $2$ (through the midpoints of opposite sides) and a rhombus has $2$ (its diagonals); a square, which is both, has $4$.\n- An isosceles triangle, an isosceles trapezoid and a kite have $1$.\n- A scalene triangle and a parallelogram that is neither a rectangle nor a rhombus have none.\n\nFor example, a $6 \\times 3$ rectangle folds onto itself along the vertical line through the middle of its long sides and along the horizontal line through the middle of its short sides: $2$ lines. Along a diagonal, the side of length $6$ would have to land on the side of length $3$, so the diagonal fails.\n\n> **Watch out.** The diagonal of a rectangle or a parallelogram is **not** a line of symmetry, so a rectangle has $2$ lines, not $4$. A regular polygon with $n$ sides has $n$ lines, not $2n$ or $n - 1$. And a shape with no line of symmetry has $0$, not $1$.",
        "如果一次轴对称把图形映到它自身，这个图形就具有**轴对称性**；这次轴对称的直线叫做**对称轴**，沿它对折，两半正好重合。轴对称保持长度和角度，所以对称轴必须把每条边与等长的边配对，把每个角与相等的角配对。这决定了哪些直线可以：\n\n- $n$ 条边的正多边形有 $n$ 条对称轴。\n- 长方形有 $2$ 条（过对边中点），菱形有 $2$ 条（它的对角线）；正方形两者都是，有 $4$ 条。\n- 等腰三角形、等腰梯形和筝形各有 $1$ 条。\n- 不等边三角形，以及既不是长方形也不是菱形的平行四边形没有对称轴。\n\n例如，$6 \\times 3$ 的长方形沿过两条长边中点的竖直线、以及过两条短边中点的水平线都能对折重合：共 $2$ 条。沿对角线对折，长为 $6$ 的边就要落到长为 $3$ 的边上，所以对角线不是对称轴。\n\n> **注意。** 长方形和平行四边形的对角线**不是**对称轴，所以长方形有 $2$ 条对称轴，而不是 $4$ 条。$n$ 条边的正多边形有 $n$ 条对称轴，不是 $2n$ 条，也不是 $n - 1$ 条。没有对称轴的图形是 $0$ 条，不是 $1$ 条。",
      ),
      generate(rng) {
        const s = pickShape(rng);
        const phi = shapePhi(rng, s);
        const count =
          s.lines === 0
            ? t("So it has no line of symmetry.", "所以它没有对称轴。")
            : s.lines === 1
              ? t(`So the ${s.name.en} has exactly $1$ line of symmetry.`, `所以这个${s.name["zh-CN"]}恰好有 $1$ 条对称轴。`)
              : t(`So the ${s.name.en} has $${s.lines}$ lines of symmetry.`, `所以这个${s.name["zh-CN"]}有 $${s.lines}$ 条对称轴。`);
        const check =
          s.lines === 0
            ? t(`**Check.** ${s.tries!.en}`, `**检验。** ${s.tries!["zh-CN"]}`)
            : t(
                `**Check.** The figure draws ${s.lines === 1 ? "the line" : "every line"} of symmetry dashed. Reflecting across ${s.lines === 1 ? "it" : "any of them"} sends every vertex to a vertex, so the ${s.name.en} lands on itself, and counting the dashed lines gives $${s.lines}$.\n\n{{figure 0}}`,
                `**检验。** 图中把${s.lines === 1 ? "这条" : "每条"}对称轴画成虚线。关于${s.lines === 1 ? "它" : "其中任何一条"}作轴对称，每个顶点都映到顶点，所以${s.name["zh-CN"]}落在自身上；数一数虚线，共 $${s.lines}$ 条。\n\n{{figure 0}}`,
              );
        return {
          ...numberProblem({
            prompt: t(`How many lines of symmetry does this ${s.name.en} have?`, `这个${s.name["zh-CN"]}有几条对称轴？`),
            answer: s.lines,
            form: "integer",
            wrong: s.wrongLines,
            solution: t(
              `${stepLabel(1, "look for folds that match", "找能重合的折痕").en} A line of symmetry must pair each side with a side of the same length. ${s.why.en}\n\n${stepLabel(2, "count them", "数一数").en} ${count.en}\n\n${check.en}`,
              `${stepLabel(1, "look for folds that match", "找能重合的折痕")["zh-CN"]}对称轴必须把每条边与等长的边配对。${s.why["zh-CN"]}\n\n${stepLabel(2, "count them", "数一数")["zh-CN"]}${count["zh-CN"]}\n\n${check["zh-CN"]}`,
            ),
          }),
          figure: shapeFigure(s, phi),
          ...(s.lines > 0 ? { solutionFigures: [axesFigure(s, phi)] } : {}),
        };
      },
    },
    {
      id: "points-paired-by-a-line-of-symmetry",
      figure: motionDrawings["points-paired-by-a-line-of-symmetry"],
      title: t("Points paired by a line of symmetry", "对称轴配对的点"),
      explanation: t(
        "If a line is a line of symmetry of a figure, reflecting any point of the figure across the line gives another point of the figure. A point and its mirror image are equally far from the line, on opposite sides, and the segment joining them crosses the line at right angles:\n\n- Across $x = a$: $(x, y) \\to (2a - x, y)$. The $x$-coordinates average to $a$, so the second one is $2a - x$.\n- Across $y = b$: $(x, y) \\to (x, 2b - y)$.\n- Across $y = x$: $(x, y) \\to (y, x)$; across $y = -x$: $(x, y) \\to (-y, -x)$.\n\nIf $y = -1$ is a line of symmetry and $(4, 3)$ is on the figure, so is $(4, 2 \\cdot (-1) - 3) = (4, -5)$: both points are $4$ units from $y = -1$, one above it and one below.\n\n> **Watch out.** Reflecting across $x = a$ changes only $x$, and across $y = b$ only $y$; do not change the other coordinate. The image is $2a - x$, not $-x$ (that is the reflection across the $y$-axis) and not $2a + x$. Across $y = x$ the coordinates swap without changing sign.",
        "若一条直线是图形的对称轴，把图形上任意一点关于这条直线作轴对称，得到的仍是图形上的点。一个点和它的像在直线两侧、到直线的距离相等，连接它们的线段与直线垂直：\n\n- 关于 $x = a$：$(x, y) \\to (2a - x, y)$。两个 $x$ 坐标的平均数是 $a$，所以另一个是 $2a - x$。\n- 关于 $y = b$：$(x, y) \\to (x, 2b - y)$。\n- 关于 $y = x$：$(x, y) \\to (y, x)$；关于 $y = -x$：$(x, y) \\to (-y, -x)$。\n\n若 $y = -1$ 是对称轴，$(4, 3)$ 在图形上，则 $(4, 2 \\cdot (-1) - 3) = (4, -5)$ 也在图形上：两点到 $y = -1$ 的距离都是 $4$，一个在上方，一个在下方。\n\n> **注意。** 关于 $x = a$ 作轴对称只改变 $x$，关于 $y = b$ 只改变 $y$；不要改变另一个坐标。像是 $2a - x$，不是 $-x$（那是关于 $y$ 轴的轴对称），也不是 $2a + x$。关于 $y = x$ 作轴对称是交换两个坐标，不改变符号。",
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
          const rule =
            line.kind === "x"
              ? `(x, y) \\to (${2 * line.c === 0 ? "" : `${2 * line.c} `}- x, y)`
              : line.kind === "y"
                ? `(x, y) \\to (x, ${2 * line.c} - y)`
                : line.sign === 1
                  ? "(x, y) \\to (y, x)"
                  : "(x, y) \\to (-y, -x)";
          const why =
            line.kind === "x"
              ? t(
                  `$P$ and $Q$ are equally far from the vertical line $x = ${line.c}$ on opposite sides, so their $y$-coordinates are equal and their $x$-coordinates average to $${line.c}$. That gives the rule $${rule}$.`,
                  `$P$ 和 $Q$ 在竖直线 $x = ${line.c}$ 的两侧、到它的距离相等，所以它们的 $y$ 坐标相等，$x$ 坐标的平均数是 $${line.c}$。由此得到规则 $${rule}$。`,
                )
              : line.kind === "y"
                ? t(
                    `$P$ and $Q$ are equally far from the horizontal line $y = ${line.c}$ on opposite sides, so their $x$-coordinates are equal and their $y$-coordinates average to $${line.c}$. That gives the rule $${rule}$.`,
                    `$P$ 和 $Q$ 在水平线 $y = ${line.c}$ 的两侧、到它的距离相等，所以它们的 $x$ 坐标相等，$y$ 坐标的平均数是 $${line.c}$。由此得到规则 $${rule}$。`,
                  )
                : t(
                    `The reflection across $${symLineLatex(line)}$ follows the rule $${rule}$: ${line.sign === 1 ? "it swaps the coordinates" : "it swaps the coordinates and changes both signs"}.`,
                    `关于 $${symLineLatex(line)}$ 的轴对称的规则是 $${rule}$：${line.sign === 1 ? "交换两个坐标" : "交换两个坐标并改变两者的符号"}。`,
                  );
          const work =
            line.kind === "x"
              ? `Q = (2 \\cdot ${paren(line.c)} - ${paren(p[0])}, \\; ${p[1]}) = ${pl(q)}`
              : line.kind === "y"
                ? `Q = (${p[0]}, \\; 2 \\cdot ${paren(line.c)} - ${paren(p[1])}) = ${pl(q)}`
                : line.sign === 1
                  ? `Q = ${pl(q)}`
                  : `Q = \\left(-(${p[1]}), \\; -(${p[0]})\\right) = ${pl(q)}`;
          const mid = `\\left(\\frac{${p[0]} + ${paren(q[0])}}{2}, \\; \\frac{${p[1]} + ${paren(q[1])}}{2}\\right) = \\left(${half(p[0] + q[0])}, ${half(p[1] + q[1])}\\right)`;
          const onLine =
            line.kind === "x"
              ? t(
                  `its $x$-coordinate is $${line.c}$, so it lies on $x = ${line.c}$, and $\\overline{PQ}$ is horizontal, perpendicular to the line.`,
                  `它的 $x$ 坐标是 $${line.c}$，所以在 $x = ${line.c}$ 上；而 $\\overline{PQ}$ 是水平的，与这条直线垂直。`,
                )
              : line.kind === "y"
                ? t(
                    `its $y$-coordinate is $${line.c}$, so it lies on $y = ${line.c}$, and $\\overline{PQ}$ is vertical, perpendicular to the line.`,
                    `它的 $y$ 坐标是 $${line.c}$，所以在 $y = ${line.c}$ 上；而 $\\overline{PQ}$ 是竖直的，与这条直线垂直。`,
                  )
                : t(
                    `its coordinates ${line.sign === 1 ? "are equal" : "are opposites"}, so it lies on $${symLineLatex(line)}$.`,
                    `它的两个坐标${line.sign === 1 ? "相等" : "互为相反数"}，所以在 $${symLineLatex(line)}$ 上。`,
                  );
          return {
            ...pointProblem({
              prompt: t(
                `The line $${symLineLatex(line)}$ is a line of symmetry of a figure, and $P${pl(p)}$ is a vertex of the figure. The reflection across the line maps $P$ to another vertex $Q$. Find the coordinates of $Q$.`,
                `直线 $${symLineLatex(line)}$ 是一个图形的对称轴，$P${pl(p)}$ 是图形的一个顶点。关于这条直线的轴对称把 $P$ 映到另一个顶点 $Q$。求 $Q$ 的坐标。`,
              ),
              answer: q,
              wrong,
              solution: t(
                `${stepLabel(1, "find the rule of the reflection", "求轴对称的规则").en} ${why.en}\n\n${stepLabel(2, "apply it to $P$", "用于 $P$").en}${steps(work)}**Check.** The line of symmetry passes through the midpoint of $\\overline{PQ}$. The midpoint is${steps(mid)}${cap(onLine.en)}\n\n{{figure 0}}`,
                `${stepLabel(1, "find the rule of the reflection", "求轴对称的规则")["zh-CN"]}${why["zh-CN"]}\n\n${stepLabel(2, "apply it to $P$", "用于 $P$")["zh-CN"]}${steps(work)}**检验。** 对称轴经过 $\\overline{PQ}$ 的中点。中点是${steps(mid)}${onLine["zh-CN"]}\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [
              movedPoint(
                "P",
                p,
                q,
                {
                  kind: "flip",
                  a: line.kind === "x" ? [line.c, 0] : line.kind === "y" ? [0, line.c] : [0, 0],
                  b: line.kind === "x" ? [line.c, 1] : line.kind === "y" ? [1, line.c] : [1, line.sign],
                },
                "Q",
              ),
            ],
          };
        }
      },
    },
    {
      id: "finding-a-line-of-symmetry",
      title: t("Finding a line of symmetry", "求对称轴"),
      explanation: t(
        "A line of symmetry passes halfway between each pair of matching points, at right angles to the segment joining them. So a vertical line of symmetry $x = a$ has $a$ equal to the average of the $x$-coordinates of two matching points, which share their $y$-coordinate. A horizontal line $y = b$ works the same way with $y$-coordinates. Points on the line itself are their own images.\n\nIn an isosceles trapezoid with vertices $(-2, -3)$, $(6, -3)$, $(4, 2)$ and $(0, 2)$, the bottom vertices match: they share $y = -3$, and $\\frac{-2 + 6}{2} = 2$. The top vertices give the same, $\\frac{4 + 0}{2} = 2$, so the line of symmetry is $x = 2$.\n\n> **Watch out.** Matching points share the **other** coordinate: points that match across a vertical line have equal $y$-coordinates, and the line is $x = a$, not $y = a$. Average the two coordinates with their signs; do not just drop a sign, and do not take one vertex's coordinate in place of the average.",
        "对称轴从每一对对应点的正中间穿过，并与连接它们的线段垂直。所以竖直对称轴 $x = a$ 中的 $a$ 等于两个对应点 $x$ 坐标的平均数，而这两个点的 $y$ 坐标相同。水平对称轴 $y = b$ 同理，用 $y$ 坐标。在对称轴上的点，像就是它自己。\n\n在顶点为 $(-2, -3)$、$(6, -3)$、$(4, 2)$、$(0, 2)$ 的等腰梯形中，下面两个顶点相对应：它们的 $y$ 都是 $-3$，而 $\\frac{-2 + 6}{2} = 2$。上面两个顶点给出同样的结果 $\\frac{4 + 0}{2} = 2$，所以对称轴是 $x = 2$。\n\n> **注意。** 对应点的**另一个**坐标相同：关于竖直线对应的点 $y$ 坐标相等，而对称轴是 $x = a$，不是 $y = a$。求平均数时要带着符号；不要随手丢掉负号，也不要用某一个顶点的坐标代替平均数。",
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
          // The matching pair is the two vertices off the line: for a kite they are the second and fourth.
          const [p1, p2] = kind === 1 ? [pts[1]!, pts[3]!] : [pts[0]!, pts[1]!];
          const ci = vertical ? 0 : 1;
          const oi = vertical ? 1 : 0;
          const avg = `${v} = \\frac{${p1[ci]} + ${paren(p2[ci]!)}}{2} = ${a}`;
          const rest =
            kind === 0
              ? t(
                  `The third vertex $${pl(pts[2]!)}$ has $${v} = ${a}$: it lies on the line, as the top vertex of an isosceles triangle must, since it is its own image.`,
                  `第三个顶点 $${pl(pts[2]!)}$ 的 $${v} = ${a}$：它在对称轴上，等腰三角形的顶点本来就是自己的像。`,
                )
              : kind === 1
                ? t(
                    `The other two vertices, $${pl(pts[0]!)}$ and $${pl(pts[2]!)}$, both have $${v} = ${a}$: they lie on the line, as the ends of the kite's line of symmetry must.`,
                    `另外两个顶点 $${pl(pts[0]!)}$ 和 $${pl(pts[2]!)}$ 的 $${v}$ 都是 $${a}$：它们在对称轴上，筝形对称轴的两端本来就在这条线上。`,
                  )
                : t(
                    `The other pair, $${pl(pts[2]!)}$ and $${pl(pts[3]!)}$, gives the same line: $\\frac{${pts[2]![ci]} + ${paren(pts[3]![ci]!)}}{2} = ${a}$.`,
                    `另一对顶点 $${pl(pts[2]!)}$ 和 $${pl(pts[3]!)}$ 给出同一条直线：$\\frac{${pts[2]![ci]} + ${paren(pts[3]![ci]!)}}{2} = ${a}$。`,
                  );
          const axisMark: PlaneMark = {
            kind: "line",
            a: vertical ? [a, 0] : [0, a],
            b: vertical ? [a, 1] : [1, a],
            dashed: true,
            tone: "action",
          };
          const midPoint: XY = vertical ? [a, p1[1]] : [p1[0], a];
          return {
            ...equationProblem({
              prompt: t(
                `The ${shapeName.en} shown has one line of symmetry. Find its equation.`,
                `图中的${shapeName["zh-CN"]}有一条对称轴。求它的方程。`,
              ),
              answer: `${v} = ${a}`,
              wrong: [`${other} = ${a}`, `${v} = ${-a}`, `${v} = ${p1[ci]}`],
              solution: t(
                `${stepLabel(1, "find two matching vertices", "找一对对应顶点").en} The vertices $${pl(p1)}$ and $${pl(p2)}$ have the same $${other}$-coordinate, $${p1[oi]}$, so they face each other across a ${vertical ? "vertical" : "horizontal"} line of symmetry, of the form $${v} = c$.\n\n${stepLabel(2, "take the average", "取平均数").en} The line passes halfway between them:${steps(avg)}**Check.** ${rest.en}\n\n{{figure 0}}`,
                `${stepLabel(1, "find two matching vertices", "找一对对应顶点")["zh-CN"]}顶点 $${pl(p1)}$ 与 $${pl(p2)}$ 的 $${other}$ 坐标相同，都是 $${p1[oi]}$，所以它们关于一条${vertical ? "竖直" : "水平"}的对称轴 $${v} = c$ 相对。\n\n${stepLabel(2, "take the average", "取平均数")["zh-CN"]}对称轴从它们正中间穿过：${steps(avg)}**检验。** ${rest["zh-CN"]}\n\n{{figure 0}}`,
              ),
            }),
            figure: graph(
              outline(pts),
              `${cap(anOf(shapeName.en))} on a coordinate grid with vertices ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
              `坐标网格上的${shapeName["zh-CN"]}，顶点为 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
            ),
            solutionFigures: [
              graph(
                [
                  ...outline(pts),
                  axisMark,
                  { kind: "segment", a: p1, b: p2, dashed: true },
                  { kind: "point", at: midPoint, tone: "result" },
                ],
                `The ${shapeName.en} with its line of symmetry ${v} = ${a} dashed, passing through the midpoint of the segment joining (${p1[0]}, ${p1[1]}) and (${p2[0]}, ${p2[1]}).`,
                `${shapeName["zh-CN"]}及其对称轴 ${v} = ${a}（虚线），它经过连接 (${p1[0]}, ${p1[1]}) 与 (${p2[0]}, ${p2[1]}) 的线段的中点。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** rotationIntro shows a rectangle and, dashed, its image under a quarter turn about its center. */
const rotationIntro = figure(
  [
    {
      kind: "polygon",
      points: [
        [-3, -2],
        [3, -2],
        [3, 2],
        [-3, 2],
      ],
      accent: true,
    },
    { kind: "segment", a: [2, -3], b: [2, 3], dashed: true, tone: "action" },
    { kind: "segment", a: [2, 3], b: [-2, 3], dashed: true, tone: "action" },
    { kind: "segment", a: [-2, 3], b: [-2, -3], dashed: true, tone: "action" },
    { kind: "segment", a: [-2, -3], b: [2, -3], dashed: true, tone: "action" },
    { kind: "dot", at: [0, 0] },
  ],
  "A rectangle 6 wide and 4 tall with its center marked, and, dashed, its image under a quarter turn about the center: a rectangle 4 wide and 6 tall that does not coincide with it.",
  "一个宽 6、高 4 的长方形，标出了中心；虚线是它绕中心转四分之一圈后的像：宽 4、高 6 的长方形，与原图不重合。",
);

/** rotationalSymmetry finds orders and angles of rotational symmetry and uses them in the coordinate plane. */
export const rotationalSymmetry: TopicDef = {
  id: "rotational-symmetry",
  title: t("Rotational Symmetry", "旋转对称性"),
  summary: t(
    "Find the order of rotational symmetry of polygons and the angles of rotation that map them onto themselves, and find points paired by rotational symmetry in the coordinate plane.",
    "求多边形旋转对称的阶数和把它映到自身的旋转角，并求坐标平面中旋转对称配对的点。",
  ),
  prerequisites: ["reflective-symmetry", "rotations-of-geometric-figures"],
  encompasses: [{ topic: "rotations-of-geometric-figures", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.3"],
  intro: t(
    `Reflections are not the only moves that can map a figure onto itself: turning it about its center sometimes works too. A wheel or a star looks the same after part of a turn. This is **rotational symmetry**, and it is measured by how many times the figure fits onto itself in one full turn.

Take a rectangle $6$ wide and $4$ tall, centered at the origin. A half turn about the center sends $(x, y)$ to $(-x, -y)$: the corner $(3, 2)$ goes to $(-3, -2)$, the opposite corner, and every corner lands on a corner. So the half turn maps the rectangle onto itself. A quarter turn does not: it stands the rectangle on end, $4$ wide and $6$ tall.

{{figure 0}}

In one full turn, the rectangle fits onto itself twice, at $0^\\circ$ and at $180^\\circ$: its **order** of rotational symmetry is $2$. This topic finds orders and angles of rotational symmetry and uses them to locate points in the coordinate plane.`,
    `能把图形映到自身的变换不只有轴对称：绕中心旋转有时也可以。车轮或星形转过一部分后看起来和原来一样。这就是**旋转对称性**，用旋转一整圈的过程中图形与自身重合的次数来衡量。

取一个宽 $6$、高 $4$、中心在原点的长方形。绕中心转半圈把 $(x, y)$ 映到 $(-x, -y)$：顶点 $(3, 2)$ 映到相对的顶点 $(-3, -2)$，每个顶点都落在顶点上。所以转半圈把长方形映到自身。转四分之一圈则不行：它把长方形竖了起来，变成宽 $4$、高 $6$。

{{figure 0}}

旋转一整圈，长方形与自身重合两次：在 $0^\\circ$ 和 $180^\\circ$。它旋转对称的**阶数**是 $2$。本课求旋转对称的阶数和角，并用它们在坐标平面中确定点的位置。`,
  ),
  introFigures: [rotationIntro],
  knowledgePoints: [
    {
      id: "order-of-rotational-symmetry",
      figure: motionDrawings["order-of-rotational-symmetry"],
      title: t("Order of rotational symmetry", "旋转对称的阶数"),
      explanation: t(
        "A figure has **rotational symmetry** when a rotation about its center by less than $360^\\circ$ maps it onto itself. The **order** is the number of positions in one full turn in which the figure looks exactly the same, counting the starting position. A figure with no rotational symmetry has order $1$. A rotation keeps lengths and angles, so it must carry each side to a side of the same length; that decides which turns work:\n\n- A regular polygon with $n$ sides has order $n$.\n- A parallelogram, including a rectangle or a rhombus, has order $2$: a half turn maps it onto itself. (A square has order $4$.)\n- An isosceles triangle, a kite and a trapezoid have order $1$, although some have a line of symmetry.\n\nA regular hexagon, for instance, fits onto itself after turns of $60^\\circ$, $120^\\circ$, $180^\\circ$, $240^\\circ$, $300^\\circ$ and $360^\\circ$: six positions, so its order is $6$.\n\n> **Watch out.** Count the starting position, so that the order of a regular $n$-gon is $n$, not $n - 1$; and count positions in one turn, not twice the sides. A figure with no rotational symmetry has order $1$, not $0$. A line of symmetry does not give rotational symmetry: an isosceles triangle has one but its order is $1$.",
        "如果绕中心旋转一个小于 $360^\\circ$ 的角能把图形映到它自身，这个图形就具有**旋转对称性**。**阶数**是旋转一整圈的过程中，图形看起来完全相同的位置的个数（包括起始位置）。没有旋转对称性的图形阶数为 $1$。旋转保持长度和角度，所以它必须把每条边带到等长的边上；这决定了哪些旋转可以：\n\n- $n$ 条边的正多边形阶数为 $n$。\n- 平行四边形（包括长方形和菱形）阶数为 $2$：转半圈就把它映到自身。（正方形阶数为 $4$。）\n- 等腰三角形、筝形和梯形阶数为 $1$，尽管其中有些有对称轴。\n\n例如，正六边形在旋转 $60^\\circ$、$120^\\circ$、$180^\\circ$、$240^\\circ$、$300^\\circ$、$360^\\circ$ 后都与自身重合：共六个位置，所以阶数是 $6$。\n\n> **注意。** 要把起始位置算进去，所以正 $n$ 边形的阶数是 $n$，不是 $n - 1$；数的是一整圈中的位置，不是边数的两倍。没有旋转对称性的图形阶数是 $1$，不是 $0$。有对称轴不等于有旋转对称性：等腰三角形有一条对称轴，但阶数是 $1$。",
      ),
      generate(rng) {
        const s = pickShape(rng);
        const phi = shapePhi(rng, s);
        const angle = rotationAngle(s.order);
        const listing =
          s.order > 1 && s.order <= 6 ? Array.from({ length: s.order }, (_, i) => `${((i + 1) * 360) / s.order}^\\circ`).join(", ") : "";
        const count =
          s.order === 1
            ? t(
                "So in one full turn it fits onto itself in only one position, the start: the order is $1$.",
                "所以旋转一整圈，它只在一个位置（起始位置）与自身重合：阶数是 $1$。",
              )
            : t(
                `In one full turn it fits onto itself every $${angle}^\\circ$${listing ? `, at $${listing}$` : ""}: $${s.order}$ positions, counting the start. So the order is $${s.order}$.`,
                `旋转一整圈，它每转 $${angle}^\\circ$ 就与自身重合一次${listing ? `，即在 $${listing}$` : ""}：包括起始位置共 $${s.order}$ 个位置。所以阶数是 $${s.order}$。`,
              );
        const check =
          s.order === 1
            ? t(
                `**Check.** The figure shows the ${s.name.en} turned $180^\\circ$ about its center, dashed: it does not land on itself, and no other turn short of $360^\\circ$ does either.\n\n{{figure 0}}`,
                `**检验。** 图中虚线是这个${s.name["zh-CN"]}绕中心转 $180^\\circ$ 后的样子：它没有落在自身上，其他小于 $360^\\circ$ 的旋转也不行。\n\n{{figure 0}}`,
              )
            : t(
                `**Check.** Follow vertex $A$ in the figure: a turn of $${angle}^\\circ$ about the center carries it to another vertex, $A'$. After $${s.order}$ such turns it has gone $${s.order} \\cdot ${angle}^\\circ = 360^\\circ$, a full turn, back to the start, so there are exactly $${s.order}$ positions.\n\n{{figure 0}}`,
                `**检验。** 跟踪图中的顶点 $A$：绕中心旋转 $${angle}^\\circ$ 把它带到另一个顶点 $A'$。这样转 $${s.order}$ 次，共转了 $${s.order} \\cdot ${angle}^\\circ = 360^\\circ$，正好一整圈，回到起点，所以恰好有 $${s.order}$ 个位置。\n\n{{figure 0}}`,
              );
        return {
          ...numberProblem({
            prompt: t(`What is the order of rotational symmetry of this ${s.name.en}?`, `这个${s.name["zh-CN"]}旋转对称的阶数是多少？`),
            answer: s.order,
            form: "integer",
            wrong: s.wrongOrder,
            solution: t(
              `${stepLabel(1, "try turns about the center", "试着绕中心旋转").en} A turn that maps the ${s.name.en} onto itself must carry each side to a side of the same length. ${s.whyOrder.en}\n\n${stepLabel(2, "count the positions", "数位置").en} ${count.en}\n\n${check.en}`,
              `${stepLabel(1, "try turns about the center", "试着绕中心旋转")["zh-CN"]}能把${s.name["zh-CN"]}映到自身的旋转，必须把每条边带到等长的边上。${s.whyOrder["zh-CN"]}\n\n${stepLabel(2, "count the positions", "数位置")["zh-CN"]}${count["zh-CN"]}\n\n${check["zh-CN"]}`,
            ),
          }),
          figure: shapeFigure(s, phi),
          solutionFigures: [orderFigure(s, phi)],
        };
      },
    },
    {
      id: "angles-of-rotational-symmetry",
      figure: motionDrawings["angles-of-rotational-symmetry"],
      title: t("Angles of rotational symmetry", "旋转对称的角"),
      explanation: t(
        "A figure of order $n$ fits onto itself in $n$ evenly spaced positions in one turn, so the turns that map it onto itself are $\\frac{360^\\circ}{n}$ and every multiple of it. For a regular polygon with $n$ sides, the smallest such angle is $\\frac{360^\\circ}{n}$: it carries each vertex to the next one.\n\nA regular octagon maps onto itself under rotations of $45^\\circ$, $90^\\circ$, $135^\\circ$, and so on, but not $60^\\circ$, since $60$ is not a multiple of $45$. Going the other way, if the smallest angle is $30^\\circ$, the polygon has $\\frac{360}{30} = 12$ sides.\n\n> **Watch out.** The angle of rotational symmetry is the central angle $\\frac{360^\\circ}{n}$, not the interior angle $\\frac{(n - 2) \\cdot 180^\\circ}{n}$ and not $\\frac{180^\\circ}{n}$. To find $n$ from the angle, divide $360$ by it, not $180$.",
        "阶数为 $n$ 的图形在旋转一整圈中有 $n$ 个均匀分布的位置与自身重合，所以把它映到自身的旋转是 $\\frac{360^\\circ}{n}$ 及其任何倍数。对于 $n$ 条边的正多边形，最小的这种角是 $\\frac{360^\\circ}{n}$：它把每个顶点带到下一个顶点。\n\n正八边形旋转 $45^\\circ$、$90^\\circ$、$135^\\circ$ 等时映到自身，旋转 $60^\\circ$ 时则不会，因为 $60$ 不是 $45$ 的倍数。反过来，若最小的角是 $30^\\circ$，这个正多边形有 $\\frac{360}{30} = 12$ 条边。\n\n> **注意。** 旋转对称的角是中心角 $\\frac{360^\\circ}{n}$，不是内角 $\\frac{(n - 2) \\cdot 180^\\circ}{n}$，也不是 $\\frac{180^\\circ}{n}$。由角求 $n$ 时，用 $360$ 除以它，而不是 $180$。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 8, 9, 10, 12]);
        const [en, zh] = regularNames[n]!;
        const step = 360 / n;
        const variant = rng.int(0, 2);
        const poly = Array.from({ length: n }, (_, i): Point => dir(90 + (360 * i) / n, 4));
        const stepFigure = figure(
          [
            { kind: "polygon", points: poly, accent: true },
            { kind: "dot", at: [0, 0] },
            { kind: "segment", a: [0, 0], b: poly[0]!, dashed: true, tone: "action" },
            { kind: "segment", a: [0, 0], b: poly[1]!, dashed: true, tone: "action" },
            { kind: "arc", vertex: [0, 0], from: poly[0]!, to: poly[1]!, label: `${step}°`, tone: "result" },
          ],
          `${cap(anOf(en))} with its center joined to two neighboring vertices; the angle between them is ${step}°.`,
          `一个${zh}，中心与相邻两个顶点相连；两条连线的夹角是 ${step}°。`,
        );
        if (variant === 0) {
          return {
            ...numberProblem({
              prompt: t(
                `What is the smallest positive angle of rotation about its center that maps a ${en} onto itself?`,
                `绕中心旋转把${zh}映到自身的最小正角是多少度？`,
              ),
              answer: step,
              unit: "°",
              wrong: [Q.of((n - 2) * 180, n), Q.of(180, n), n],
              solution: t(
                `${stepLabel(1, "find the order", "求阶数").en} ${cap(anOf(en))} has $${n}$ equal sides and angles, so it fits onto itself in $${n}$ positions in one turn: its order is $${n}$.\n\n${stepLabel(2, "divide the full turn", "平分一整圈").en} The $${n}$ positions are evenly spaced, so the smallest angle divides $360^\\circ$ into $${n}$ equal parts:${steps(`\\frac{360^\\circ}{${n}} = ${step}^\\circ`)}This turn carries each vertex to the next one.\n\n**Check.** Doing the turn $${n}$ times must make a full turn: $${n} \\cdot ${step}^\\circ = 360^\\circ$. The figure shows the angle at the center between two neighboring vertices:\n\n{{figure 0}}`,
                `${stepLabel(1, "find the order", "求阶数")["zh-CN"]}${zh}有 $${n}$ 条相等的边和 $${n}$ 个相等的角，所以旋转一整圈有 $${n}$ 个位置与自身重合：阶数是 $${n}$。\n\n${stepLabel(2, "divide the full turn", "平分一整圈")["zh-CN"]}这 $${n}$ 个位置均匀分布，所以最小的角把 $360^\\circ$ 平均分成 $${n}$ 份：${steps(`\\frac{360^\\circ}{${n}} = ${step}^\\circ`)}这个旋转把每个顶点带到下一个顶点。\n\n**检验。** 这个旋转做 $${n}$ 次必须正好一整圈：$${n} \\cdot ${step}^\\circ = 360^\\circ$。图中画出了中心处相邻两个顶点之间的角：\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [stepFigure],
          };
        }
        if (variant === 1) {
          return {
            ...numberProblem({
              prompt: t(
                `The smallest positive rotation about its center that maps a regular polygon onto itself is $${step}^\\circ$. How many sides does the polygon have?`,
                `绕中心旋转把一个正多边形映到自身的最小正角是 $${step}^\\circ$。这个正多边形有几条边？`,
              ),
              answer: n,
              form: "integer",
              wrong: [Q.of(180, step), 2 * n, Q.of(360 - step, step)],
              solution: t(
                `${stepLabel(1, "write the equation", "列方程").en} A regular polygon with $n$ sides has smallest angle $\\frac{360^\\circ}{n}$, which carries each vertex to the next. So $n$ turns of $${step}^\\circ$ make one full turn:${steps(`n \\cdot ${step} = 360`)}${stepLabel(2, "solve for $n$", "解出 $n$").en}${steps(`n = \\frac{360}{${step}} = ${n}`)}**Check.** ${cap(anOf(en))} has smallest angle $\\frac{360^\\circ}{${n}} = ${step}^\\circ$, as given.\n\n{{figure 0}}`,
                `${stepLabel(1, "write the equation", "列方程")["zh-CN"]}$n$ 条边的正多边形，最小的角是 $\\frac{360^\\circ}{n}$，它把每个顶点带到下一个顶点。所以转 $n$ 次 $${step}^\\circ$ 正好一整圈：${steps(`n \\cdot ${step} = 360`)}${stepLabel(2, "solve for $n$", "解出 $n$")["zh-CN"]}${steps(`n = \\frac{360}{${step}} = ${n}`)}**检验。** ${zh}的最小角是 $\\frac{360^\\circ}{${n}} = ${step}^\\circ$，与题目一致。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [stepFigure],
          };
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
        const k = Math.floor(angle / step);
        const verdict = ok
          ? t(
              `$${angle} \\div ${step} = ${angle / step}$, a whole number: the turn is $${angle / step}$ steps of $${step}^\\circ$, so it maps the ${en} onto itself. The answer is yes.`,
              `$${angle} \\div ${step} = ${angle / step}$，是整数：这个旋转是 $${angle / step}$ 个 $${step}^\\circ$，所以能把${zh}映到自身。答案是能。`,
            )
          : t(
              `$${angle} \\div ${step}$ is not a whole number: $${angle}^\\circ$ lies between $${k * step}^\\circ$ and $${(k + 1) * step}^\\circ$. The answer is no.`,
              `$${angle} \\div ${step}$ 不是整数：$${angle}^\\circ$ 介于 $${k * step}^\\circ$ 与 $${(k + 1) * step}^\\circ$ 之间。答案是不能。`,
            );
        const check = ok
          ? t(
              `**Check.** Each step of $${step}^\\circ$ moves every vertex on by one, so after $${angle / step}$ steps every vertex sits on the vertex $${angle / step}$ places along: the ${en} covers itself exactly.`,
              `**检验。** 每转 $${step}^\\circ$，每个顶点向前移一个位置；转 $${angle / step}$ 次后，每个顶点都落在往前数第 $${angle / step}$ 个顶点上：${zh}恰好与自身重合。`,
            )
          : k === 0
            ? t(
                `**Check.** A turn of $${angle}^\\circ$ moves a vertex only part of the way to the next vertex, which is $${step}^\\circ$ away, so the vertices land between vertices and the ${en} does not cover itself.`,
                `**检验。** 旋转 $${angle}^\\circ$ 只让一个顶点走了到下一个顶点（相距 $${step}^\\circ$）的一部分路程，所以顶点落在两个顶点之间，${zh}不能与自身重合。`,
              )
            : t(
                `**Check.** A turn of $${angle}^\\circ$ moves a vertex past the vertex $${k}$ places along (at $${k * step}^\\circ$) but not as far as the next (at $${(k + 1) * step}^\\circ$), so the vertices land between vertices and the ${en} does not cover itself.`,
                `**检验。** 旋转 $${angle}^\\circ$ 让一个顶点越过往前数第 $${k}$ 个顶点（在 $${k * step}^\\circ$ 处），却到不了下一个（在 $${(k + 1) * step}^\\circ$ 处），所以顶点落在两个顶点之间，${zh}不能与自身重合。`,
              );
        return reasoned(
          choiceProblem({
            prompt: t(
              `Does a rotation of $${angle}^\\circ$ about its center map ${anOf(en)} onto itself?`,
              `绕中心旋转 $${angle}^\\circ$ 能把${zh}映到自身吗？`,
            ),
            options: yesNo,
            correct: ok ? 0 : 1,
            solution: t(
              `${stepLabel(1, "list the turns that work", "列出可行的旋转").en} ${cap(anOf(en))} has order $${n}$, so the rotations that map it onto itself are the multiples of $\\frac{360^\\circ}{${n}} = ${step}^\\circ$.\n\n${stepLabel(2, `test $${angle}^\\circ$`, `检验 $${angle}^\\circ$`).en} ${verdict.en}\n\n${check.en}`,
              `${stepLabel(1, "list the turns that work", "列出可行的旋转")["zh-CN"]}${zh}的阶数是 $${n}$，所以能把它映到自身的旋转是 $\\frac{360^\\circ}{${n}} = ${step}^\\circ$ 的倍数。\n\n${stepLabel(2, `test $${angle}^\\circ$`, `检验 $${angle}^\\circ$`)["zh-CN"]}${verdict["zh-CN"]}\n\n${check["zh-CN"]}`,
            ),
          }),
          [
            ok
              ? [
                  "No",
                  `$${angle}^\\circ$ is $${angle / step}$ steps of $${step}^\\circ$, and each step maps the ${en} onto itself.`,
                  `$${angle}^\\circ$ 是 $${angle / step}$ 个 $${step}^\\circ$，而每一步都把${zh}映到自身。`,
                ]
              : [
                  "Yes",
                  `$${angle}^\\circ$ is not a multiple of $${step}^\\circ$, so the vertices land between vertices.`,
                  `$${angle}^\\circ$ 不是 $${step}^\\circ$ 的倍数，所以顶点落在两个顶点之间。`,
                ],
          ],
        );
      },
    },
    {
      id: "rotational-symmetry-in-the-coordinate-plane",
      figure: motionDrawings["rotational-symmetry-in-the-coordinate-plane"],
      title: t("Rotational symmetry in the coordinate plane", "坐标平面中的旋转对称"),
      explanation: t(
        "If a figure has rotational symmetry about a center $C$, rotating any point of the figure about $C$ by an angle of symmetry gives another point of the figure.\n\n- Order $2$ about $C(a, b)$: a half turn carries $P$ along a straight line through $C$ to the point just as far on the other side, so $C$ is the midpoint of $P$ and its image. That gives $(x, y) \\to (2a - x, 2b - y)$.\n- Order $4$ about the origin: a quarter turn counterclockwise maps $(x, y)$ to $(-y, x)$.\n\nA parallelogram with center $C(-1, 3)$ and a vertex $(2, 5)$ has the opposite vertex $(2 \\cdot (-1) - 2, 2 \\cdot 3 - 5) = (-4, 1)$. Check: the midpoint of $(2, 5)$ and $(-4, 1)$ is $\\left(\\frac{2 - 4}{2}, \\frac{5 + 1}{2}\\right) = (-1, 3)$.\n\n> **Watch out.** The half turn about $C$ is $2C - P$, not $-P$ (that is the half turn about the origin), not $2C + P$, and not $C - P$. The quarter turn counterclockwise is $(-y, x)$; $(y, -x)$ turns clockwise, and $(-x, -y)$ is a half turn.",
        "若图形关于中心 $C$ 旋转对称，把图形上任意一点绕 $C$ 旋转一个对称角，得到的仍是图形上的点。\n\n- 关于 $C(a, b)$ 阶数为 $2$：转半圈把 $P$ 沿一条过 $C$ 的直线带到另一侧同样远的点，所以 $C$ 是 $P$ 与它的像的中点。由此得到 $(x, y) \\to (2a - x, 2b - y)$。\n- 关于原点阶数为 $4$：逆时针旋转四分之一圈把 $(x, y)$ 映到 $(-y, x)$。\n\n中心为 $C(-1, 3)$、一个顶点为 $(2, 5)$ 的平行四边形，相对的顶点是 $(2 \\cdot (-1) - 2, 2 \\cdot 3 - 5) = (-4, 1)$。检验：$(2, 5)$ 与 $(-4, 1)$ 的中点是 $\\left(\\frac{2 - 4}{2}, \\frac{5 + 1}{2}\\right) = (-1, 3)$。\n\n> **注意。** 绕 $C$ 转半圈得 $2C - P$，不是 $-P$（那是绕原点转半圈），不是 $2C + P$，也不是 $C - P$。逆时针转四分之一圈是 $(-y, x)$；$(y, -x)$ 是顺时针，$(-x, -y)$ 是转半圈。",
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
            const work = `Q = (2 \\cdot ${paren(c[0])} - ${paren(p[0])}, \\; 2 \\cdot ${paren(c[1])} - ${paren(p[1])}) = ${pl(q)}`;
            const mid = `\\left(\\frac{${p[0]} + ${paren(q[0])}}{2}, \\; \\frac{${p[1]} + ${paren(q[1])}}{2}\\right) = ${pl(c)}`;
            return {
              ...pointProblem({
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
                  `${stepLabel(1, "use the midpoint", "利用中点").en} A half turn about $C$ carries $P$ straight through $C$ to the point just as far on the other side, so $C$ is the midpoint of $\\overline{PQ}$. Each coordinate of $C$ is the average of those of $P$ and $Q$, so $Q = 2C - P$.\n\n${stepLabel(2, "compute $Q$", "计算 $Q$").en}${steps(work)}**Check.** The midpoint of $\\overline{PQ}$ must be $C$:${steps(mid)}It is, so $Q$ is the vertex opposite $P$:\n\n{{figure 0}}`,
                  `${stepLabel(1, "use the midpoint", "利用中点")["zh-CN"]}绕 $C$ 转半圈，把 $P$ 沿直线穿过 $C$ 带到另一侧同样远的点，所以 $C$ 是 $\\overline{PQ}$ 的中点。$C$ 的每个坐标都是 $P$、$Q$ 对应坐标的平均数，所以 $Q = 2C - P$。\n\n${stepLabel(2, "compute $Q$", "计算 $Q$")["zh-CN"]}${steps(work)}**检验。** $\\overline{PQ}$ 的中点必须是 $C$：${steps(mid)}确实如此，所以 $Q$ 是 $P$ 的对顶点：\n\n{{figure 0}}`,
                ),
              }),
              solutionFigures: [movedPoint("P", p, q, { kind: "turn", degrees: 180, center: c, centerName: "C" }, "Q")],
            };
          }
          const q: XY = [z(-p[1]), p[0]];
          const shape = rng.pick([t("square", "正方形"), t("figure", "图形")]);
          const len = p[0] * p[0] + p[1] * p[1];
          return {
            ...pointProblem({
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
                `${stepLabel(1, "write the rule", "写出规则").en} Order $4$ means a quarter turn, $90^\\circ$, maps the ${shape.en} onto itself. A quarter turn counterclockwise about the origin follows $(x, y) \\to (-y, x)$: the old $y$, with its sign changed, becomes the new $x$, and the old $x$ becomes the new $y$.\n\n${stepLabel(2, "apply it to $P$", "用于 $P$").en}${steps(`Q = \\left(-(${p[1]}), \\; ${p[0]}\\right) = ${pl(q)}`)}**Check.** $Q$ must be as far from the origin as $P$, in a direction at right angles to it. Both distances squared are $${p[0] * p[0]} + ${p[1] * p[1]} = ${len}$, and $${paren(p[0])} \\cdot ${paren(q[0])} + ${paren(p[1])} \\cdot ${paren(q[1])} = 0$, so $\\overline{OP} \\perp \\overline{OQ}$. Seen in the figure, the turn is counterclockwise:\n\n{{figure 0}}`,
                `${stepLabel(1, "write the rule", "写出规则")["zh-CN"]}阶数为 $4$ 表示转四分之一圈 $90^\\circ$ 能把这个${shape["zh-CN"]}映到自身。绕原点逆时针转四分之一圈的规则是 $(x, y) \\to (-y, x)$：原来的 $y$ 变号后成为新的 $x$，原来的 $x$ 成为新的 $y$。\n\n${stepLabel(2, "apply it to $P$", "用于 $P$")["zh-CN"]}${steps(`Q = \\left(-(${p[1]}), \\; ${p[0]}\\right) = ${pl(q)}`)}**检验。** $Q$ 到原点的距离必须与 $P$ 相同，方向与它垂直。两个距离的平方都是 $${p[0] * p[0]} + ${p[1] * p[1]} = ${len}$，而 $${paren(p[0])} \\cdot ${paren(q[0])} + ${paren(p[1])} \\cdot ${paren(q[1])} = 0$，所以 $\\overline{OP} \\perp \\overline{OQ}$。从图中可见旋转是逆时针的：\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [movedPoint("P", p, q, { kind: "turn", degrees: 90, center: [0, 0], centerName: "O" }, "Q")],
          };
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
