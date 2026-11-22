import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type PlaneView, type Point, plane, Q, sketch } from "@ga/subject-math";
import { angleDrawings, motionDrawings } from "../explanation-drawings-angles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { at, graphFigure } from "../graph-figures.ts";
import { movedPoint, movedPolygon, viewAround } from "../motion-figures.ts";
import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, verdictChoice } from "../problems.ts";
import { evalAt, stepLabel } from "../solution-kit.ts";
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
const angleTex = (c: number, d: number) => (d === 0 && c === 1 ? "x^\\circ" : `(${linear(c, d)})^\\circ`);

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°". */
const angleLabel = (c: number, d: number) => (d === 0 && c === 1 ? "x°" : `(${plain(c, d)})°`);

/** valueAt writes the value of cx + d at x: "3x - 20 = 3 \cdot 30 - 20 = 70", or "x = 30" for plain x. */
const valueAt = (c: number, d: number, x: number) =>
  c === 1 && d === 0 ? `x = ${x}` : `${linear(c, d)} = ${evalAt(c, x, d)} = ${c * x + d}`;

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

/** needs says what each reason must start from, for checks and for the reasons a wrong option fails. */
const needs: Record<Reason, Text> = {
  given: t("nothing: it is stated in the problem", "什么也不需要：题目已经给出"),
  angleAdd: t("a ray inside an angle", "角内部的一条射线"),
  linearPair: t("two adjacent angles whose outer sides form a line", "两个相邻且外边组成一条直线的角"),
  corr: t("two parallel lines and a pair of corresponding angles", "两条平行线和一对同位角"),
  corrConv: t("a pair of congruent corresponding angles", "一对全等的同位角"),
  vertical: t("two angles opposite each other where two lines cross", "两条直线相交处彼此相对的两个角"),
  aia: t("two parallel lines and a pair of alternate interior angles", "两条平行线和一对内错角"),
  aea: t("two parallel lines and a pair of alternate exterior angles", "两条平行线和一对外错角"),
  cia: t("two parallel lines and a pair of consecutive interior angles", "两条平行线和一对同旁内角"),
  aiaConv: t("a pair of congruent alternate interior angles", "一对全等的内错角"),
  congSupp: t("two angles supplementary to the same angle or to congruent angles", "与同一个角（或相等的角）互补的两个角"),
  congComp: t("two angles complementary to the same angle or to congruent angles", "与同一个角（或相等的角）互余的两个角"),
  rightCong: t("two right angles", "两个直角"),
  reflexive: t("the same figure on both sides", "两边是同一个图形"),
  symmetric: t("a congruence to read the other way round", "一个要倒过来读的全等式"),
  transitive: t("two congruences that share a figure", "两个有公共图形的全等式"),
  subst: t("an equation and a quantity equal to one of its terms", "一个等式，以及与其中一项相等的量"),
  division: t("an equation to divide by a nonzero number", "一个要两边同除以非零数的等式"),
  defCong: t("congruent angles, or angles with equal measures", "全等的角，或度数相等的角"),
  defPerp: t("perpendicular lines, or lines meeting at a right angle", "互相垂直的直线，或相交成直角的直线"),
  defMid: t("a midpoint of a segment", "线段的中点"),
  defBis: t("a bisector of an angle", "角的平分线"),
  sss: t("three pairs of congruent sides", "三组全等的边"),
  sas: t("two pairs of congruent sides and the angles between them", "两组全等的边及其夹角"),
  asa: t("two pairs of congruent angles and the sides between them", "两组全等的角及其夹边"),
  aas: t("two pairs of congruent angles and a pair of sides not between them", "两组全等的角及一组非夹边"),
  cpctc: t("two triangles already proved congruent", "已证明全等的两个三角形"),
  aaSim: t("two pairs of congruent angles", "两组全等的角"),
  sasSim: t("two pairs of proportional sides and congruent angles between them", "两组成比例的边及全等的夹角"),
  defSim: t("two similar polygons", "两个相似多边形"),
};

/** Marks are the facts a proof row adds to its figure: arcs at angles, right-angle squares, and arrows for ℓ ∥ m. */
interface Marks {
  readonly arcs?: readonly number[];
  readonly right?: readonly number[];
  readonly par?: boolean;
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

/** Scene is the transversal figure a proof is drawn on: the angle of t with the lines, the turn of the whole figure, and whether m is left out. */
interface Scene {
  readonly theta: number;
  readonly phi: number;
  readonly single?: boolean;
}

/** Proof is a two-column proof with its figure, the scene its steps are drawn on, and reasons that are plausible but wrong for its steps. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly Step[];
  readonly scene: Scene;
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

/** angleList writes angles for alt text: "∠3, ∠7". */
const angleList = (ns: readonly number[]) => ns.map((n) => `∠${n}`).join(", ");

/** sceneFigure draws a proof's scene with the facts of earlier rows (old) and of the current row (fresh) marked. */
function sceneFigure(sc: Scene, old: Marks, fresh: Marks): Figure {
  const tone = new Map<number, "accent" | "result">();
  for (const n of old.arcs ?? []) tone.set(n, "accent");
  for (const n of fresh.arcs ?? []) tone.set(n, "result");
  const right = [...new Set([...(old.right ?? []), ...(fresh.right ?? [])])];
  const arrows = Boolean(old.par || fresh.par);
  const added = [...(fresh.arcs ?? []), ...(fresh.right ?? [])];
  const before = [...(old.arcs ?? []), ...(old.right ?? [])].filter((n) => !added.includes(n));
  const lines = sc.single
    ? ["Lines ℓ and t crossing", "直线 ℓ 与 t 相交"]
    : ["Lines ℓ and m cut by a transversal t", "直线 ℓ 与 m 被截线 t 所截"];
  return transversalFigure(
    sc.theta,
    sc.phi,
    { labels: numbered(sc.single), arrows, ...(sc.single && { single: true }), right, marked: [...tone] },
    `${lines[0]}, with the angles numbered${arrows ? " and ℓ and m marked parallel" : ""}.${added.length > 0 ? ` Marked by this step: ${angleList([...new Set(added)])}.` : ""}${before.length > 0 ? ` Marked earlier: ${angleList([...new Set(before)])}.` : ""}`,
    `${lines[1]}，各角已编号${arrows ? "，ℓ 与 m 标为平行" : ""}。${added.length > 0 ? `这一步标出：${angleList([...new Set(added)])}。` : ""}${before.length > 0 ? `此前标出：${angleList([...new Set(before)])}。` : ""}`,
  );
}

/** adds tells whether marks put anything on a figure. */
const addsAny = (m?: Marks) => Boolean(m && ((m.arcs?.length ?? 0) > 0 || (m.right?.length ?? 0) > 0 || m.par));

/** merged joins the marks of two rows. */
const merged = (a: Marks, b?: Marks): Marks => ({
  arcs: [...new Set([...(a.arcs ?? []), ...(b?.arcs ?? [])])],
  right: [...new Set([...(a.right ?? []), ...(b?.right ?? [])])],
  par: Boolean(a.par || b?.par),
});

/** join writes texts as paragraphs. */
const join = (paras: readonly Text[]) => t(paras.map((p) => p.en).join("\n\n"), paras.map((p) => p["zh-CN"]).join("\n\n"));

/** proofSolution walks a proof row by row, drawing each fact as it is added, explains the missing part of row k, and checks it. */
function proofSolution(p: Proof, k: number, part: "s" | "r"): { solution: Text; solutionFigures: Figure[] } {
  const figures: Figure[] = [];
  const paras: Text[] = [
    t(
      "Read the proof from the top. Each row must follow from the given facts or from rows above it, by the reason written beside it. The figures mark each fact as it is added: arrows for parallel lines, arcs for the angles a row is about (the newest in a second color), and a small square for a right angle.",
      "从上往下读证明。每一行都必须由已知条件或它上面的行、按旁边写的理由推出。图中随步骤标出每个新得到的事实：箭头表示平行，弧线表示这一行涉及的角（最新的一步用另一种颜色），小方块表示直角。",
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
          : cat(st.s, " — ", reasons[st.r], t(". ", "。"), st.note ?? cat(why[st.r], t(".", "。")));
    let para = cat(head, " ", body);
    if (addsAny(st.adds)) {
      para = cat(para, `\n\n{{figure ${figures.length}}}`);
      figures.push(sceneFigure(p.scene, old, st.adds!));
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
function reasonWrong(p: Proof, k: number, r: Reason): Text {
  const st = p.steps[k]!;
  const provesParallel = p.prove.en === parallel.en;
  if (provesParallel && (r === "corr" || r === "aia" || r === "aea" || r === "cia"))
    return t(
      `It needs $\\ell \\parallel m$ to start from, and that is what this proof sets out to show.`,
      `它要以 $\\ell \\parallel m$ 为前提，而这正是本题要证明的。`,
    );
  if ((r === "corrConv" || r === "aiaConv") && st.s.en !== parallel.en)
    return t(
      "It concludes that two lines are parallel, but this row states something about angles.",
      "它的结论是两直线平行，而这一行说的是角。",
    );
  return t(
    `It needs ${needs[r].en}, and that is not what step ${k + 1} rests on.`,
    `它需要${needs[r]["zh-CN"]}，而第 ${k + 1} 步依据的不是这个。`,
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
        options.filter((r) => r !== st.r).map((r) => [reasons[r].en, reasonWrong(p, k, r).en, reasonWrong(p, k, r)["zh-CN"]] as const),
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

/** lineOf names, in LaTeX, the line at whose crossing with t angle n sits. */
const lineOf = (n: number) => (n <= 4 ? "\\ell" : "m");

/** measureOf is the measure of angle n when t meets the lines at theta degrees and ℓ ∥ m. */
const measureOf = (n: number, theta: number) => (angleIndex(n) % 2 === 0 ? theta : 180 - theta);

/** placeAngle says where angle n sits: above or below its line, left or right of t, and between the lines or outside them. */
function placeAngle(n: number): Text {
  const up = (n - 1) % 4 < 2;
  const left = n % 2 === 1;
  const inside = n <= 4 ? !up : up;
  const line = lineOf(n);
  return t(
    `$\\angle ${n}$ is ${up ? "above" : "below"} $${line}$ and ${left ? "left" : "right"} of $t$, so it lies ${inside ? "between the two lines" : "outside the two lines"}.`,
    `$\\angle ${n}$ 在 $${line}$ 的${up ? "上" : "下"}方、$t$ 的${left ? "左" : "右"}侧，所以在两直线${inside ? "之间" : "之外"}。`,
  );
}

/** pairLine names the line along which the outer sides of the linear pair x, y lie. */
const pairLine = (x: number, y: number) => (acrossT(x) === y ? lineOf(x) : "t");

const cong = (a: number | string, b: number | string) => same(`$\\angle ${a} \\cong \\angle ${b}$`);
const supp = (a: number | string, b: number | string) => same(`$m\\angle ${a} + m\\angle ${b} = 180^\\circ$`);
const eqm = (a: number | string, b: number | string) => same(`$m\\angle ${a} = m\\angle ${b}$`);
const parallel = same("$\\ell \\parallel m$");

/** partnerWhy says why an angle forming a linear pair with angle b is not congruent to the angles of a congruence about b. */
const partnerWhy = (x: number, b: number) =>
  t(
    `$\\angle ${x}$ forms a linear pair with $\\angle ${b}$, so it is supplementary to $\\angle ${b}$; it could be congruent to the angles of this row only if they were all right angles.`,
    `$\\angle ${x}$ 与 $\\angle ${b}$ 是邻补角，所以它与 $\\angle ${b}$ 互补；只有这些角都是直角时，它才可能与这一行的角全等。`,
  );

/** suppNotCong says why a sum of 180° is wrong where the reason gives congruent angles. */
const suppNotCong = t(
  "The reason of this row gives two congruent angles, not two that add up to $180^\\circ$; congruent angles are supplementary only when both are right angles.",
  "这一行的理由得到的是两个全等的角，而不是和为 $180^\\circ$ 的两个角；全等的角只有都是直角时才互补。",
);

/** wrongCong are false statements a learner may confuse with ∠a ≅ ∠b when the two are congruent and not right angles. */
const wrongCong = (a: number, b: number): Wrong[] => [
  [cong(a, acrossT(b)), partnerWhy(acrossT(b), b)],
  [cong(a, acrossLine(b)), partnerWhy(acrossLine(b), b)],
  [supp(a, b), suppNotCong],
];

/** wrongEq are false statements a learner may confuse with m∠a = m∠b. */
const wrongEq = (a: number, b: number): Wrong[] => [
  [eqm(a, acrossT(b)), partnerWhy(acrossT(b), b)],
  [eqm(acrossLine(a), b), partnerWhy(acrossLine(a), a)],
  [supp(a, b), suppNotCong],
];

/** swapWhy says why x, a linear pair partner of y, is congruent to z rather than supplementary to it, when y and z are supplementary. */
const swapWhy = (x: number, y: number, z: number) =>
  t(
    `$\\angle ${x}$ forms a linear pair with $\\angle ${y}$, so $\\angle ${x}$ and $\\angle ${z}$ are both supplementary to $\\angle ${y}$: they are congruent, not supplementary.`,
    `$\\angle ${x}$ 与 $\\angle ${y}$ 是邻补角，所以 $\\angle ${x}$ 和 $\\angle ${z}$ 都与 $\\angle ${y}$ 互补：它们全等，而不是互补。`,
  );

/** wrongSupp are false statements a learner may confuse with m∠a + m∠b = 180°. */
const wrongSupp = (a: number, b: number): Wrong[] => [
  [
    cong(a, b),
    t(
      "These two angles add up to $180^\\circ$; they would be congruent only if both were right angles, and $t$ is not perpendicular to the lines.",
      "这两个角的和是 $180^\\circ$；只有都是直角时它们才全等，而 $t$ 并不垂直于这两条直线。",
    ),
  ],
  [supp(a, acrossT(b)), swapWhy(acrossT(b), b, a)],
  [supp(acrossT(a), b), swapWhy(acrossT(a), a, b)],
];

/** wrongParallel are conclusions a learner may confuse with ℓ ∥ m. */
const wrongParallel: Wrong[] = [
  [same("$\\ell \\perp t$"), t("Nothing in the rows gives a right angle at $\\ell$.", "这些行里没有哪一行给出 $\\ell$ 处的直角。")],
  [same("$t \\parallel m$"), t("$t$ crosses $m$, so they cannot be parallel.", "$t$ 与 $m$ 相交，不可能平行。")],
  [same("$m \\perp t$"), t("Nothing in the rows gives a right angle at $m$.", "这些行里没有哪一行给出 $m$ 处的直角。")],
];

/** vertNote says why two angles are vertical angles. */
const vertNote = (x: number, y: number) =>
  t(
    `$\\angle ${x}$ and $\\angle ${y}$ are vertical angles: they sit opposite each other where $t$ crosses $${lineOf(x)}$.`,
    `$\\angle ${x}$ 与 $\\angle ${y}$ 是对顶角：它们在 $t$ 与 $${lineOf(x)}$ 的交点处彼此相对。`,
  );

/** corrNote says why the Corresponding Angles Postulate applies to angles x and y, with ℓ ∥ m from step i. */
const corrNote = (x: number, y: number, i: number) =>
  t(
    `$\\angle ${x}$ and $\\angle ${y}$ are corresponding angles, in the same position at the two crossings, and step ${i} gives $\\ell \\parallel m$.`,
    `$\\angle ${x}$ 与 $\\angle ${y}$ 是同位角，在两个交点处位置相同，而第 ${i} 步给出了 $\\ell \\parallel m$。`,
  );

/** corrConvNote says why the converse applies to angles x and y, congruent by step i. */
const corrConvNote = (x: number, y: number, i: number) =>
  t(
    `Step ${i} gives $\\angle ${x} \\cong \\angle ${y}$, and these are corresponding angles, in the same position at the two crossings.`,
    `第 ${i} 步给出 $\\angle ${x} \\cong \\angle ${y}$，而它们是同位角，在两个交点处位置相同。`,
  );

/** transNote says why the Transitive Property joins steps i and j: both make x and y congruent to mid. */
const transNote = (i: number, j: number, x: number, y: number, mid: number) =>
  t(
    `Steps ${i} and ${j} make $\\angle ${x}$ and $\\angle ${y}$ both congruent to $\\angle ${mid}$.`,
    `第 ${i} 步和第 ${j} 步说明 $\\angle ${x}$ 与 $\\angle ${y}$ 都与 $\\angle ${mid}$ 全等。`,
  );

/** pairNote says why angles x and y form a linear pair. */
const pairNote = (x: number, y: number) =>
  t(
    `$\\angle ${x}$ and $\\angle ${y}$ are adjacent, and their outer sides form the line $${pairLine(x, y)}$.`,
    `$\\angle ${x}$ 与 $\\angle ${y}$ 相邻，它们的外边组成直线 $${pairLine(x, y)}$。`,
  );

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
  /** marked draws arcs, in the given tone, at these labeled angles only. */
  readonly marked?: readonly (readonly [number, "accent" | "result"])[];
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
  const tones = new Map(o.marked ?? []);
  for (const [n, text] of o.labels) {
    const i = angleIndex(n);
    const v = at(n);
    const tone = tones.get(n);
    if (o.arcs || (tone && !(o.right ?? []).includes(n))) {
      const rs = rays(v);
      marks.push({
        kind: "arc",
        vertex: r(v),
        from: r(rs[i]!),
        to: r(rs[(i + 1) % 4]!),
        label: text,
        ...(tone === "result" ? { tone: "result" as const } : { accent: true }),
      });
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

/** pickScene picks the transversal figure of a proof about parallel lines. */
const pickScene = (rng: Rng): Scene => ({ theta: pickTheta(rng), phi: pickTilt(rng) });

/** sceneProblemFigure draws a proof's scene with its angles numbered; arrows when ℓ ∥ m is given. */
function sceneProblemFigure(sc: Scene, arrows: boolean): Figure {
  return transversalFigure(
    sc.theta,
    sc.phi,
    { labels: numbered(), arrows },
    `Lines ℓ and m${arrows ? ", marked parallel," : ""} cut by a transversal t, with the eight angles numbered 1 to 4 at ℓ and 5 to 8 at m.`,
    `直线 ℓ 与 m${arrows ? "（标为平行）" : ""}被截线 t 所截，八个角在 ℓ 处编号为 1 到 4，在 m 处编号为 5 到 8。`,
  );
}

/** PairSetup describes two angles measured by expressions in x that must be congruent (total null) or add up to total. */
interface PairSetup {
  readonly x: number;
  readonly c1: number;
  readonly d1: number;
  readonly c2: number;
  readonly d2: number;
  readonly total: number | null;
  /** why says which relation holds between the angles and why, ending with a colon before the equation. */
  readonly why: Text;
  /** asked is the expression of the angle asked for, when the answer is an angle rather than x. */
  readonly asked?: readonly [number, number];
  /** drawn redraws the figure with the measures found, for the check. */
  readonly drawn?: (l1: string, l2: string) => Figure;
  /** extra adds a sentence to the check. */
  readonly extra?: Text;
}

/** pairSolution sets up the equation of two related angles, solves it, finds the angle asked for, and checks both measures in the figure. */
function pairSolution(o: PairSetup): { solution: Text; solutionFigures?: Figure[] } {
  const { x, c1, d1, c2, d2, total } = o;
  const [m1, m2] = [c1 * x + d1, c2 * x + d2];
  const [first, ...rest] =
    total === null
      ? equalSteps(c1, d1, c2, d2)
      : sumSteps(
          [
            [c1, d1],
            [c2, d2],
          ],
          total,
        );
  const asked = o.asked;
  const check =
    total === null
      ? t(
          `the two angles measure $${valueAt(c1, d1, x)}$ and $${valueAt(c2, d2, x)}$ degrees: they are equal, as required.`,
          `两个角分别是 $${valueAt(c1, d1, x)}$ 度和 $${valueAt(c2, d2, x)}$ 度：确实相等。`,
        )
      : t(
          `the two angles measure $${valueAt(c1, d1, x)}$ and $${valueAt(c2, d2, x)}$ degrees, and $${m1}^\\circ + ${m2}^\\circ = ${total}^\\circ$, as required.`,
          `两个角分别是 $${valueAt(c1, d1, x)}$ 度和 $${valueAt(c2, d2, x)}$ 度，而 $${m1}^\\circ + ${m2}^\\circ = ${total}^\\circ$，符合要求。`,
        );
  const figures = o.drawn ? [o.drawn(deg(m1), deg(m2))] : [];
  return {
    solution: cat(
      stepLabel(1, "write the equation", "列方程"),
      " ",
      o.why,
      chain(first!),
      stepLabel(2, "solve for $x$", "解出 $x$"),
      t(" Collect the terms in $x$ on one side and the numbers on the other:", " 把含 $x$ 的项移到一边，数移到另一边："),
      chain(...rest),
      asked
        ? cat(
            stepLabel(3, "find the angle", "求出这个角"),
            t(
              ` Substitute $x = ${x}$ into the angle asked for: $${valueAt(asked[0], asked[1], x)}$, so it measures $${asked[0] * x + asked[1]}^\\circ$.\n\n`,
              ` 把 $x = ${x}$ 代入所求的角：$${valueAt(asked[0], asked[1], x)}$，所以它是 $${asked[0] * x + asked[1]}^\\circ$。\n\n`,
            ),
          )
        : "",
      t(`**Check.** With $x = ${x}$, `, `**检验。** 当 $x = ${x}$ 时，`),
      check,
      o.extra ? cat(" ", o.extra) : "",
      figures.length > 0 ? "\n\n{{figure 0}}" : "",
    ),
    ...(figures.length > 0 && { solutionFigures: figures }),
  };
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
  encompasses: [
    { topic: "parallel-lines-and-transversals", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "You already know the names of the angle pairs a transversal makes, and that angles on a straight line add up to $180^\\circ$. Geometry now asks *why* such facts hold. A proof answers by building each fact from a few starting rules, accepted without proof, called **postulates**. This topic names three of them, so that later proofs can cite them.\n\nThe first one you have used all along. Suppose $\\angle POR$ measures $110^\\circ$ and a ray $OQ$ inside it makes $m\\angle POQ = 40^\\circ$. Without measuring, you can say $m\\angle QOR = 110^\\circ - 40^\\circ = 70^\\circ$: the two smaller angles fill the whole angle exactly. That is the **Angle Addition Postulate**.\n\n{{figure 0}}\n\nThe others say that a linear pair adds up to $180^\\circ$, and that parallel lines make corresponding angles congruent — and, the other way round, that congruent corresponding angles make lines parallel.",
    "你已经知道截线形成的各对角的名称，也知道一条直线上的角之和为 $180^\\circ$。几何现在要问这些事实*为什么*成立。证明的做法是：从几条不加证明而接受的基本规则出发，一步步推出每个事实；这些规则叫做**公设**。本课介绍其中三条，以后的证明就可以引用它们。\n\n第一条你其实一直在用。设 $\\angle POR = 110^\\circ$，它内部的一条射线 $OQ$ 使 $m\\angle POQ = 40^\\circ$。不用量就能说 $m\\angle QOR = 110^\\circ - 40^\\circ = 70^\\circ$：两个小角恰好拼成整个角。这就是**角的加法公设**。\n\n{{figure 0}}\n\n另外两条是：邻补角之和为 $180^\\circ$；平行线被截时同位角全等——反过来，同位角全等则两直线平行。",
  ),
  introFigures: [raysFigure(40, 70, 10, "PQRO", deg(40), deg(70))],
  knowledgePoints: [
    {
      id: "angle-addition-postulate",
      figure: angleDrawings["angle-addition-postulate"],
      title: t("The Angle Addition Postulate", "角的加法公设"),
      explanation: t(
        "A **postulate** is a statement accepted without proof; theorems are then proved from postulates.\n\nThe **Angle Addition Postulate**: if point $B$ lies inside $\\angle AOC$, then $m\\angle AOB + m\\angle BOC = m\\angle AOC$.\n\nWhy must this hold? The ray $OB$ splits the opening between $OA$ and $OC$ into two parts with no gap and no overlap, so the two measures together make up the whole one. When the measures are expressions, the postulate turns into an equation.\n\nIf $m\\angle AOB = (2x + 5)^\\circ$, $m\\angle BOC = (3x - 10)^\\circ$ and $m\\angle AOC = 70^\\circ$, then $(2x + 5) + (3x - 10) = 70$. Combining like terms gives $5x - 5 = 70$; adding $5$ to both sides gives $5x = 75$, so $x = 15$. The parts are then $35^\\circ$ and $35^\\circ$, which add up to $70^\\circ$.\n\n> **Watch out.** The question asks for $x$, not for an angle. And when you collect the constants, move them with the opposite sign: $5x - 5 = 70$ gives $5x = 75$, not $65$.",
        "**公设**是不加证明而接受的命题；定理再由公设证明出来。\n\n**角的加法公设**：若点 $B$ 在 $\\angle AOC$ 的内部，则 $m\\angle AOB + m\\angle BOC = m\\angle AOC$。\n\n为什么一定成立？射线 $OB$ 把 $OA$ 与 $OC$ 之间的张口分成两部分，既无空隙也不重叠，所以两部分的度数合起来就是整个角。度数用式子表示时，这条公设就变成一个方程。\n\n若 $m\\angle AOB = (2x + 5)^\\circ$，$m\\angle BOC = (3x - 10)^\\circ$，$m\\angle AOC = 70^\\circ$，则 $(2x + 5) + (3x - 10) = 70$。合并同类项得 $5x - 5 = 70$；两边加 $5$ 得 $5x = 75$，所以 $x = 15$。这时两部分都是 $35^\\circ$，和为 $70^\\circ$。\n\n> **注意。** 题目求的是 $x$，不是某个角。移常数项时要变号：$5x - 5 = 70$ 得 $5x = 75$，不是 $65$。",
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
          const [first, ...rest] = sumSteps(
            [
              [c1, d1],
              [c2, d2],
            ],
            total,
          );
          const base = rng.pick([0, 10, 20]);
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
              solution: cat(
                stepLabel(1, "write the postulate", "写出公设"),
                t(
                  ` Ray $${O}${B}$ lies inside $\\angle ${A}${O}${C}$, so by the Angle Addition Postulate $m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$:`,
                  ` 射线 $${O}${B}$ 在 $\\angle ${A}${O}${C}$ 的内部，由角的加法公设，$m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$：`,
                ),
                chain(first!),
                stepLabel(2, "solve for $x$", "解出 $x$"),
                t(
                  " Combine like terms, move the constant to the right with the opposite sign, and divide by the coefficient:",
                  " 合并同类项，把常数项变号移到右边，再除以系数：",
                ),
                chain(...rest),
                t(
                  `**Check.** With $x = ${x}$, $m\\angle ${A}${O}${B} = ${valueAt(c1, d1, x)}$ degrees and $m\\angle ${B}${O}${C} = ${valueAt(c2, d2, x)}$ degrees. Both are positive, and $${a}^\\circ + ${b}^\\circ = ${total}^\\circ$, the whole angle.\n\n{{figure 0}}`,
                  `**检验。** 当 $x = ${x}$ 时，$m\\angle ${A}${O}${B} = ${valueAt(c1, d1, x)}$ 度，$m\\angle ${B}${O}${C} = ${valueAt(c2, d2, x)}$ 度。两者都是正数，且 $${a}^\\circ + ${b}^\\circ = ${total}^\\circ$，正是整个角。\n\n{{figure 0}}`,
                ),
              ),
            }),
            figure: raysFigure(a, b, base, names, angleLabel(c1, d1), angleLabel(c2, d2)),
            solutionFigures: [raysFigure(a, b, base, names, deg(a), deg(b))],
          };
        }
      },
    },
    {
      id: "linear-pair-postulate",
      figure: angleDrawings["linear-pair-postulate"],
      title: t("The Linear Pair Postulate", "邻补角公设"),
      explanation: t(
        "Two adjacent angles whose outer sides form a line are a **linear pair**. The **Linear Pair Postulate**: the angles of a linear pair are supplementary.\n\nThe outer sides point in opposite directions along one line, so together the two angles sweep out a straight angle, half a full turn: $180^\\circ$. Whatever the shared ray does, opening one angle closes the other by the same amount.\n\nIf a linear pair measures $(4x + 10)^\\circ$ and $(2x - 10)^\\circ$, then $(4x + 10) + (2x - 10) = 180$, so $6x = 180$ and $x = 30$. The first angle is $4 \\cdot 30 + 10 = 130^\\circ$, and the second is $2 \\cdot 30 - 10 = 50^\\circ$; indeed $130 + 50 = 180$.\n\n> **Watch out.** Finding $x$ is only halfway: substitute it into the expression of the angle that is asked for. The other expression gives its partner, $180^\\circ$ minus the answer.",
        "两个相邻的角，若它们的另外两边组成一条直线，就构成**邻补角**。**邻补角公设**：邻补角互补。\n\n两条外边沿同一条直线指向相反的方向，所以两个角合起来扫过一个平角，即半圈：$180^\\circ$。无论公共边怎样转，一个角张大多少，另一个角就缩小多少。\n\n若一对邻补角为 $(4x + 10)^\\circ$ 和 $(2x - 10)^\\circ$，则 $(4x + 10) + (2x - 10) = 180$，所以 $6x = 180$，$x = 30$。第一个角是 $4 \\cdot 30 + 10 = 130^\\circ$，第二个角是 $2 \\cdot 30 - 10 = 50^\\circ$；确实 $130 + 50 = 180$。\n\n> **注意。** 求出 $x$ 只做了一半：要把它代入所求那个角的式子。代入另一个式子得到的是它的邻补角，即 $180^\\circ$ 减去答案。",
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
        const [cb, db] = askFirst ? [c2, d2] : [c1, d1];
        const value = valueAt(ca, da, x);
        const pairMarks = (l1: string, l2: string): Mark[] => [
          { kind: "segment", a: dir(base + 180), b: dir(base) },
          { kind: "segment", a: o, b: ray },
          { kind: "arc", vertex: o, from: dir(base), to: ray, label: l1, accent: true },
          { kind: "arc", vertex: o, from: ray, to: dir(base + 180), label: l2, accent: true },
        ];
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
            solution: cat(
              stepLabel(1, "solve for $x$", "解出 $x$"),
              t(
                " The two angles share a ray and their outer sides form a line, so by the Linear Pair Postulate they add up to $180^\\circ$:",
                " 两个角有一条公共边，另外两边组成一条直线，由邻补角公设，它们的和为 $180^\\circ$：",
              ),
              chain(...work),
              stepLabel(2, "find the angle", "求出这个角"),
              t(
                ` Substitute $x = ${x}$ into the expression of the angle asked for: $${value}$. The angle is $${asked}^\\circ$.`,
                ` 把 $x = ${x}$ 代入所求角的式子：$${value}$。这个角是 $${asked}^\\circ$。`,
              ),
              t(
                `\n\n**Check.** The other angle is $${valueAt(cb, db, x)}$ degrees, and $${asked}^\\circ + ${180 - asked}^\\circ = 180^\\circ$, a straight angle.\n\n{{figure 0}}`,
                `\n\n**检验。** 另一个角是 $${valueAt(cb, db, x)}$ 度，而 $${asked}^\\circ + ${180 - asked}^\\circ = 180^\\circ$，正是平角。\n\n{{figure 0}}`,
              ),
            ),
          }),
          figure: figure(
            pairMarks(angleLabel(c1, d1), angleLabel(c2, d2)),
            `A line with a ray from a point on it, forming angles ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
            `一条直线和从直线上一点出发的一条射线，形成角 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
          solutionFigures: [
            figure(
              pairMarks(deg(m), deg(180 - m)),
              `The linear pair with its measures: ${m}° and ${180 - m}°.`,
              `标出度数的邻补角：${m}° 和 ${180 - m}°。`,
            ),
          ],
        };
      },
    },
    {
      id: "naming-angle-postulates",
      figure: gradeDrawings5["identifying-angle-postulates#naming-angle-postulates"],
      title: t("Naming the postulate", "说出所用的公设"),
      explanation: t(
        'Each postulate fits a particular kind of statement:\n\n- **Angle Addition Postulate**: two adjacent angles add up to the angle they make together.\n- **Linear Pair Postulate**: a linear pair adds up to $180^\\circ$.\n- **Corresponding Angles Postulate**: *if* two parallel lines are cut by a transversal, *then* corresponding angles are congruent.\n- **Converse of the Corresponding Angles Postulate**: *if* corresponding angles are congruent, *then* the lines are parallel.\n\nTo name the postulate, split the statement into what it starts from and what it concludes, and match both halves. For example, "Since $\\angle 2 \\cong \\angle 6$, $\\ell \\parallel m$" starts from two congruent corresponding angles and concludes that lines are parallel: that is the Converse of the Corresponding Angles Postulate.\n\n> **Watch out.** The postulate and its converse use the same angles but swap what is known and what is concluded. A statement that *ends* with $\\ell \\parallel m$ uses the converse; one that *starts* from $\\ell \\parallel m$ uses the postulate itself.',
        "每条公设对应一类结论：\n\n- **角的加法公设**：两个相邻角之和等于它们合成的角。\n- **邻补角公设**：邻补角之和为 $180^\\circ$。\n- **同位角公设**：*若*两条平行线被截线所截，*则*同位角全等。\n- **同位角公设的逆命题**：*若*同位角全等，*则*两直线平行。\n\n要说出所用的公设，先把结论拆成“从什么出发”和“得出什么”两半，再让两半都对上。例如“因为 $\\angle 2 \\cong \\angle 6$，所以 $\\ell \\parallel m$”是从一对全等的同位角出发，得出两直线平行：这是同位角公设的逆命题。\n\n> **注意。** 公设和它的逆命题涉及同样的角，但交换了已知和结论。以 $\\ell \\parallel m$ *结尾*的结论用的是逆命题；从 $\\ell \\parallel m$ *出发*的结论用的是公设本身。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const r = postulateOptions[kind]!;
        const does = [
          t("adds two adjacent angles to get the whole angle", "把两个相邻的角加成整个角"),
          t("adds the two angles of a linear pair to get $180^\\circ$", "把一对邻补角加成 $180^\\circ$"),
          t("goes from parallel lines to congruent angles", "从两直线平行得出角全等"),
          t("goes from congruent angles to parallel lines", "从角全等得出两直线平行"),
        ][kind]!;
        const gives: Partial<Record<Reason, Text>> = {
          angleAdd: t("a whole angle as the sum of two adjacent angles", "整个角等于两个相邻角之和"),
          linearPair: t("a sum of $180^\\circ$ for a linear pair", "邻补角之和为 $180^\\circ$"),
          corr: t("congruent angles, starting from parallel lines", "从两直线平行出发得出角全等"),
          corrConv: t("parallel lines, starting from congruent angles", "从角全等出发得出两直线平行"),
        };
        const ifThen = [
          t(
            "if a ray lies inside an angle, then the two smaller angles add up to the whole angle",
            "若一条射线在一个角的内部，则两个小角之和等于整个角",
          ),
          t("if two angles form a linear pair, then they add up to $180^\\circ$", "若两个角是邻补角，则它们的和为 $180^\\circ$"),
          t(
            "if two parallel lines are cut by a transversal, then corresponding angles are congruent",
            "若两条平行线被截线所截，则同位角全等",
          ),
          t("if corresponding angles are congruent, then the lines are parallel", "若同位角全等，则两直线平行"),
        ][kind]!;
        const pick = (statement: Text, pre: Text, figures: Figure[]) =>
          reasoned(
            {
              ...choiceProblem({
                prompt: cat(t("Which postulate justifies the statement?", "下面的结论依据的是哪条公设？"), "\n\n", statement),
                options: postulateOptions.map((x) => reasons[x]),
                correct: kind,
                solution: cat(
                  pre,
                  t(
                    `\n\nThe statement ${does.en}. That is what the ${reasons[r].en} says: ${why[r].en}.`,
                    `\n\n这个结论${does["zh-CN"]}。这正是“${reasons[r]["zh-CN"]}”所说的：${why[r]["zh-CN"]}。`,
                  ),
                  t(
                    `\n\n**Check.** Read the postulate as "if …, then …": ${ifThen.en}. The statement starts from the "if" part and ends with the "then" part, in that order.`,
                    `\n\n**检验。** 把公设读成“若……，则……”：${ifThen["zh-CN"]}。这个结论正是从“若”的部分出发，得到“则”的部分，顺序也一致。`,
                  ),
                ),
              }),
              ...(figures.length > 0 && { solutionFigures: figures }),
            },
            postulateOptions
              .filter((x) => x !== r)
              .map((x) => [
                reasons[x].en,
                `That postulate gives ${gives[x]!.en}, but this statement ${does.en}.`,
                `那条公设得出的是${gives[x]!["zh-CN"]}，而这个结论${does["zh-CN"]}。`,
              ]),
          );
        if (kind === 0) {
          const names = rng.pick(["ABCO", "PQRS", "DEFO", "XYZW", "KLMN"]);
          const [A, B, C, O] = names.split("");
          const [a, b] = [rng.int(20, 80), rng.int(20, 80)];
          return {
            ...pick(
              same(`$m\\angle ${A}${O}${B} + m\\angle ${B}${O}${C} = m\\angle ${A}${O}${C}$`),
              t(
                `Ray $${O}${B}$ lies between rays $${O}${A}$ and $${O}${C}$, so $\\angle ${A}${O}${B}$ and $\\angle ${B}${O}${C}$ are adjacent angles that together make $\\angle ${A}${O}${C}$.`,
                `射线 $${O}${B}$ 在射线 $${O}${A}$ 与 $${O}${C}$ 之间，所以 $\\angle ${A}${O}${B}$ 与 $\\angle ${B}${O}${C}$ 是相邻的角，合起来正是 $\\angle ${A}${O}${C}$。`,
              ),
              [],
            ),
            figure: raysFigure(a, b, rng.pick([0, 10, 20]), names, "", ""),
          };
        }
        const n = rng.int(1, 8);
        const k = rng.bool() ? acrossT(n) : acrossLine(n);
        const statement = [
          supp(n, k),
          t(
            `Since $\\ell \\parallel m$, $\\angle ${n} \\cong \\angle ${corr(n)}$.`,
            `因为 $\\ell \\parallel m$，所以 $\\angle ${n} \\cong \\angle ${corr(n)}$。`,
          ),
          t(
            `Since $\\angle ${n} \\cong \\angle ${corr(n)}$, $\\ell \\parallel m$.`,
            `因为 $\\angle ${n} \\cong \\angle ${corr(n)}$，所以 $\\ell \\parallel m$。`,
          ),
        ][kind - 1]!;
        const scene = pickScene(rng);
        const pre =
          kind === 1
            ? pairNote(n, k)
            : t(
                `$\\angle ${n}$ and $\\angle ${corr(n)}$ are corresponding angles: they sit in the same position at the two crossings.`,
                `$\\angle ${n}$ 与 $\\angle ${corr(n)}$ 是同位角：它们在两个交点处位置相同。`,
              );
        return {
          ...pick(statement, cat(pre, "\n\n{{figure 0}}"), [
            sceneFigure(scene, {}, { arcs: [n, kind === 1 ? k : corr(n)], par: kind === 2 }),
          ]),
          figure: sceneProblemFigure(scene, kind === 2),
        };
      },
    },
    {
      id: "making-lines-parallel",
      figure: angleDrawings["making-lines-parallel"],
      title: t("Making lines parallel", "使两直线平行"),
      explanation: t(
        "By the Converse of the Corresponding Angles Postulate, lines $\\ell$ and $m$ are parallel exactly when a pair of corresponding angles is congruent. To find the value of $x$ that makes them parallel, set the corresponding angles equal.\n\nWhy equal and not supplementary? Corresponding angles sit in the same position at the two crossings. When the lines are parallel, one crossing is just the other slid along $t$, so the angle there has the same size.\n\nIf corresponding angles measure $(3x + 15)^\\circ$ and $(5x - 25)^\\circ$, then $3x + 15 = 5x - 25$, so $40 = 2x$ and $x = 20$. Both angles are then $75^\\circ$.\n\n> **Watch out.** Corresponding angles are set *equal*; adding them to $180^\\circ$ is the rule for a linear pair. And the question asks for $x$, not for the measure of the angles.",
        "由同位角公设的逆命题，当且仅当一对同位角全等时，直线 $\\ell$ 与 $m$ 平行。要求使它们平行的 $x$，令同位角相等。\n\n为什么是相等而不是互补？同位角在两个交点处位置相同。两直线平行时，一个交点处的图形就是另一个交点处的图形沿 $t$ 平移过去的，那里的角大小相同。\n\n若一对同位角为 $(3x + 15)^\\circ$ 和 $(5x - 25)^\\circ$，则 $3x + 15 = 5x - 25$，所以 $40 = 2x$，$x = 20$。这时两个角都是 $75^\\circ$。\n\n> **注意。** 同位角要令它们*相等*；和为 $180^\\circ$ 是邻补角的规则。另外，题目求的是 $x$，不是角的度数。",
      ),
      keyPrerequisites: ["parallel-lines-and-transversals"],
      generate(rng) {
        const { x, c1, d1, c2, d2, m } = exprPair(rng, null, 45, 135);
        const n = rng.int(1, 4);
        const [theta, phi] = [thetaFor(n, m), pickTilt(rng)];
        const drawn = (l1: string, l2: string, arrows: boolean) =>
          transversalFigure(
            theta,
            phi,
            {
              labels: [
                [n, l1],
                [n + 4, l2],
              ],
              arrows,
              arcs: true,
            },
            `Lines ℓ and m${arrows ? ", now marked parallel," : ""} cut by a transversal t, with corresponding angles marked ${l1} and ${l2}.`,
            `直线 ℓ 与 m${arrows ? "（现已标为平行）" : ""}被截线 t 所截，一对同位角分别标为 ${l1} 和 ${l2}。`,
          );
        return {
          ...numberProblem({
            prompt: t("For what value of $x$ are lines $\\ell$ and $m$ parallel?", "当 $x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？"),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [m, intOr(180 - d1 - d2, c1 + c2, -x), -x],
            solution: t("", ""),
          }),
          ...pairSolution({
            x,
            c1,
            d1,
            c2,
            d2,
            total: null,
            why: t(
              "The labeled angles are corresponding angles: they sit in the same position at the two crossings. By the Converse of the Corresponding Angles Postulate, $\\ell \\parallel m$ when they are congruent, so set their measures equal:",
              "标出的两个角是同位角：它们在两个交点处位置相同。由同位角公设的逆命题，当它们全等时 $\\ell \\parallel m$，所以令它们的度数相等：",
            ),
            drawn: (l1, l2) => drawn(l1, l2, true),
          }),
          figure: drawn(angleLabel(c1, d1), angleLabel(c2, d2), false),
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
  encompasses: [{ topic: "complementary-and-supplementary-angles", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    'The postulates are the starting rules. A **theorem** is a statement proved from them, and once proved it can be cited like a postulate. This topic collects the theorems about angles that later proofs use most.\n\nHere is the first one, proved with nothing but the Linear Pair Postulate. Two lines cross, and $m\\angle 2 = 65^\\circ$.\n\n{{figure 0}}\n\n$\\angle 1$ and $\\angle 2$ form a linear pair, so $m\\angle 1 = 180^\\circ - 65^\\circ = 115^\\circ$. $\\angle 4$ and $\\angle 2$ form a linear pair too, so $m\\angle 4 = 115^\\circ$ as well. Nothing in this depended on the $65^\\circ$: both $\\angle 1$ and $\\angle 4$ are "$180^\\circ$ minus $\\angle 2$", so they are always congruent. $\\angle 1$ and $\\angle 4$ are **vertical angles**, opposite each other at the crossing, and we have just proved the **Vertical Angles Theorem**. The same idea — two angles that complete the same angle are equal — gives the Congruent Supplements and Congruent Complements Theorems, and with parallel lines it gives theorems about alternate and consecutive angles.',
    "公设是出发点。由公设证明出来的命题叫做**定理**；定理一经证明，就可以像公设一样引用。本课汇集以后的证明最常用的关于角的定理。\n\n先看第一个，它只用邻补角公设就能证明。两条直线相交，$m\\angle 2 = 65^\\circ$。\n\n{{figure 0}}\n\n$\\angle 1$ 与 $\\angle 2$ 是邻补角，所以 $m\\angle 1 = 180^\\circ - 65^\\circ = 115^\\circ$。$\\angle 4$ 与 $\\angle 2$ 也是邻补角，所以 $m\\angle 4$ 也是 $115^\\circ$。这里其实与 $65^\\circ$ 无关：$\\angle 1$ 和 $\\angle 4$ 都等于“$180^\\circ$ 减去 $\\angle 2$”，所以它们总是全等。$\\angle 1$ 与 $\\angle 4$ 在交点处彼此相对，是**对顶角**，我们刚刚证明了**对顶角定理**。同样的想法——补足同一个角的两个角相等——还给出等角的补角相等、等角的余角相等；再加上平行线，就得到关于内错角、同旁内角等的定理。",
  ),
  introFigures: [
    transversalFigure(
      65,
      0,
      {
        labels: [
          [1, "1"],
          [2, "65°"],
          [3, "3"],
          [4, "4"],
        ],
        arrows: false,
        single: true,
        marked: [[2, "accent"]],
      },
      "Two lines ℓ and t crossing, with four angles: angle 2 measures 65°, angle 1 and angle 4 are each next to it, and angle 1 and angle 4 are opposite each other.",
      "两条直线 ℓ 与 t 相交成四个角：∠2 为 65°，∠1 和 ∠4 各自与它相邻，∠1 与 ∠4 彼此相对。",
    ),
  ],
  knowledgePoints: [
    {
      id: "congruent-supplements-and-complements",
      figure: angleDrawings["congruent-supplements-and-complements"],
      title: t("Congruent supplements and complements", "等角的补角与余角"),
      explanation: t(
        "A **theorem** is a statement proved from postulates and earlier theorems.\n\n- **Congruent Supplements Theorem**: angles supplementary to the same angle (or to congruent angles) are congruent.\n- **Congruent Complements Theorem**: angles complementary to the same angle (or to congruent angles) are congruent.\n\nWhy? If $\\angle 1$ and $\\angle 3$ are both supplementary to $\\angle 2$, then $m\\angle 1 = 180^\\circ - m\\angle 2$ and $m\\angle 3 = 180^\\circ - m\\angle 2$: the same number. With complements, replace $180^\\circ$ by $90^\\circ$.\n\nIf $m\\angle 1 = (2x + 10)^\\circ$ and $m\\angle 3 = (4x - 30)^\\circ$, then $2x + 10 = 4x - 30$, so $40 = 2x$ and $x = 20$. Both angles are $50^\\circ$, and $\\angle 2$ is $130^\\circ$.\n\n> **Watch out.** The two angles that share a supplement are set *equal* to each other. Adding them to $180^\\circ$ would treat them as supplementary to each other, which the statement does not say.",
        "**定理**是由公设和已证明的定理推出的命题。\n\n- **等角的补角相等**：与同一个角（或相等的角）互补的两个角全等。\n- **等角的余角相等**：与同一个角（或相等的角）互余的两个角全等。\n\n为什么？若 $\\angle 1$ 与 $\\angle 3$ 都与 $\\angle 2$ 互补，则 $m\\angle 1 = 180^\\circ - m\\angle 2$，$m\\angle 3 = 180^\\circ - m\\angle 2$：是同一个数。互余时把 $180^\\circ$ 换成 $90^\\circ$。\n\n若 $m\\angle 1 = (2x + 10)^\\circ$，$m\\angle 3 = (4x - 30)^\\circ$，则 $2x + 10 = 4x - 30$，所以 $40 = 2x$，$x = 20$。两个角都是 $50^\\circ$，而 $\\angle 2$ 是 $130^\\circ$。\n\n> **注意。** 与同一个角互补的两个角，要令它们彼此*相等*。把它们相加等于 $180^\\circ$，就成了它们彼此互补，而题目并没有这样说。",
      ),
      generate(rng) {
        const complement = rng.bool();
        const total = complement ? 90 : 180;
        const { x, c1, d1, c2, d2, m } = complement ? exprPair(rng, null, 15, 75) : exprPair(rng, null, 30, 150);
        const [a, b, c] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        const kind = complement ? t("complementary", "互余") : t("supplementary", "互补");
        const theorem = complement ? reasons.congComp : reasons.congSupp;
        return {
          ...numberProblem({
            prompt: t(
              `$\\angle ${a}$ and $\\angle ${c}$ are ${kind.en}, and $\\angle ${b}$ and $\\angle ${c}$ are ${kind.en}. If $m\\angle ${a} = ${angleTex(c1, d1)}$ and $m\\angle ${b} = ${angleTex(c2, d2)}$, find $x$.`,
              `$\\angle ${a}$ 与 $\\angle ${c}$ ${kind["zh-CN"]}，$\\angle ${b}$ 与 $\\angle ${c}$ ${kind["zh-CN"]}。若 $m\\angle ${a} = ${angleTex(c1, d1)}$，$m\\angle ${b} = ${angleTex(c2, d2)}$，求 $x$。`,
            ),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [intOr(total - d1 - d2, c1 + c2, -x), m, -x],
            solution: t("", ""),
          }),
          ...pairSolution({
            x,
            c1,
            d1,
            c2,
            d2,
            total: null,
            why: t(
              `$\\angle ${a}$ and $\\angle ${b}$ are both ${kind.en} to the same angle, $\\angle ${c}$. By the ${theorem.en} they are congruent, so their measures are equal:`,
              `$\\angle ${a}$ 与 $\\angle ${b}$ 都与同一个角 $\\angle ${c}$ ${kind["zh-CN"]}。由“${theorem["zh-CN"]}”，它们全等，所以度数相等：`,
            ),
            extra: t(
              `Then $m\\angle ${c} = ${total}^\\circ - ${m}^\\circ = ${total - m}^\\circ$, and each angle makes $${m}^\\circ + ${total - m}^\\circ = ${total}^\\circ$ with it.`,
              `于是 $m\\angle ${c} = ${total}^\\circ - ${m}^\\circ = ${total - m}^\\circ$，两个角与它的和都是 $${m}^\\circ + ${total - m}^\\circ = ${total}^\\circ$。`,
            ),
          }),
        };
      },
    },
    {
      id: "theorems-about-parallel-lines",
      figure: angleDrawings["theorems-about-parallel-lines"],
      title: t("Theorems about parallel lines", "关于平行线的定理"),
      explanation: t(
        "When two parallel lines are cut by a transversal, the Corresponding Angles Postulate leads to three theorems:\n\n- **Alternate Interior Angles Theorem**: alternate interior angles are congruent.\n- **Alternate Exterior Angles Theorem**: alternate exterior angles are congruent.\n- **Consecutive Interior Angles Theorem**: consecutive interior angles are supplementary.\n\nThe **Vertical Angles Theorem** needs no parallel lines: it relates angles at the same crossing.\n\nTo pick the theorem, place the two angles. *Interior* means between $\\ell$ and $m$, *exterior* outside them; *alternate* means on opposite sides of $t$, *consecutive* on the same side. For example, $\\angle 3$ (below $\\ell$, left of $t$) and $\\angle 6$ (above $m$, right of $t$) are both between the lines and on opposite sides of $t$: alternate interior angles, so they are congruent.\n\n> **Watch out.** Check both words of the name. $\\angle 3$ and $\\angle 5$ are interior too, but on the same side of $t$: they are consecutive interior angles, which are supplementary, not congruent.",
        "两条平行线被截线所截时，由同位角公设可以推出三个定理：\n\n- **内错角定理**：内错角全等。\n- **外错角定理**：外错角全等。\n- **同旁内角定理**：同旁内角互补。\n\n**对顶角定理**不需要平行线：它关系的是同一个交点处的角。\n\n要选定理，先确定两个角的位置。*内*指在 $\\ell$ 与 $m$ 之间，*外*指在它们之外；*错*指在 $t$ 的两侧，*同旁*指在 $t$ 的同侧。例如 $\\angle 3$（在 $\\ell$ 下方、$t$ 左侧）与 $\\angle 6$（在 $m$ 上方、$t$ 右侧）都在两直线之间、分在 $t$ 两侧：是内错角，所以全等。\n\n> **注意。** 名称里的两个字都要核对。$\\angle 3$ 与 $\\angle 5$ 也在两直线之间，但在 $t$ 的同侧：它们是同旁内角，互补而不是全等。",
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
        const scene = pickScene(rng);
        const names = [
          t("vertical angles", "对顶角"),
          t("corresponding angles", "同位角"),
          t("alternate interior angles", "内错角"),
          t("alternate exterior angles", "外错角"),
          t("consecutive interior angles", "同旁内角"),
        ][kind]!;
        const [ma, mb] = [measureOf(a, scene.theta), measureOf(b, scene.theta)];
        return reasoned(
          {
            ...choiceProblem({
              prompt: cat(
                t(
                  "Lines $\\ell$ and $m$ are parallel. Which justifies the statement?",
                  "直线 $\\ell$ 与 $m$ 平行。下面的结论依据的是什么？",
                ),
                "\n\n",
                statement,
              ),
              options: transversalTheorems.map((x) => reasons[x]),
              correct: kind,
              solution: cat(
                stepLabel(1, "place the angles", "确定两个角的位置"),
                " ",
                placeAngle(a),
                t(" ", ""),
                placeAngle(b),
                a <= 4 === b <= 4
                  ? t(
                      ` Both sit at the same crossing, the one with $${lineOf(a)}$.`,
                      `两个角在同一个交点处，即 $t$ 与 $${lineOf(a)}$ 的交点。`,
                    )
                  : t(" They sit at different crossings.", "两个角在不同的交点处。"),
                "\n\n{{figure 0}}\n\n",
                stepLabel(2, "name the pair", "说出这对角的名称"),
                t(
                  ` So $\\angle ${a}$ and $\\angle ${b}$ are ${names.en}, and the statement follows from the ${reasons[r].en}: ${why[r].en}.`,
                  ` 所以 $\\angle ${a}$ 与 $\\angle ${b}$ 是${names["zh-CN"]}，结论依据的是“${reasons[r]["zh-CN"]}”：${why[r]["zh-CN"]}。`,
                ),
                kind === 4
                  ? t(
                      `\n\n**Check.** Supplementary angles at a slanted transversal are one acute and one obtuse, and so they are drawn: $\\angle ${a}$ is ${ma < 90 ? "acute" : "obtuse"} and $\\angle ${b}$ is ${mb < 90 ? "acute" : "obtuse"}.`,
                      `\n\n**检验。** 截线倾斜时，互补的两个角一个是锐角、一个是钝角，图中正是如此：$\\angle ${a}$ 是${ma < 90 ? "锐角" : "钝角"}，$\\angle ${b}$ 是${mb < 90 ? "锐角" : "钝角"}。`,
                    )
                  : t(
                      `\n\n**Check.** Congruent angles look alike, and so they are drawn: $\\angle ${a}$ and $\\angle ${b}$ are both ${ma < 90 ? "acute" : "obtuse"}.`,
                      `\n\n**检验。** 全等的角看上去一样大，图中正是如此：$\\angle ${a}$ 与 $\\angle ${b}$ 都是${ma < 90 ? "锐角" : "钝角"}。`,
                    ),
              ),
            }),
            figure: sceneProblemFigure(scene, true),
            solutionFigures: [sceneFigure(scene, { par: true }, { arcs: [a, b] })],
          },
          [
            ...transversalTheorems.map(
              (x, i) =>
                [
                  reasons[x].en,
                  [
                    "Vertical angles sit opposite each other at one intersection, and these two do not.",
                    "Corresponding angles sit in the same position at the two intersections, and these two do not.",
                    "Alternate interior angles lie between the lines on opposite sides of the transversal, and these two do not.",
                    "Alternate exterior angles lie outside the lines on opposite sides of the transversal, and these two do not.",
                    "Consecutive interior angles lie between the lines on the same side of the transversal, and these two do not.",
                  ][i]!,
                  [
                    "对顶角在同一个交点处彼此相对，而这两个角不是。",
                    "同位角在两个交点处位置相同，而这两个角不是。",
                    "内错角在两条直线之间、截线的两侧，而这两个角不是。",
                    "外错角在两条直线之外、截线的两侧，而这两个角不是。",
                    "同旁内角在两条直线之间、截线的同侧，而这两个角不是。",
                  ][i]!,
                ] as const,
            ),
          ],
        );
      },
    },
    {
      id: "naming-angle-theorems",
      title: t("Naming the theorem", "说出所用的定理"),
      explanation: t(
        'Four theorems conclude that two angles are congruent without any parallel lines:\n\n- **Vertical Angles Theorem**: vertical angles are congruent.\n- **Congruent Supplements Theorem**: angles supplementary to the same angle, or to congruent angles, are congruent.\n- **Congruent Complements Theorem**: the same for complementary angles.\n- **Right Angles Congruence Theorem**: all right angles are congruent.\n\nAll four end the same way, with $\\angle 1 \\cong \\angle 2$, so the conclusion cannot tell them apart. Look at what the statement starts from. "$\\angle 1$ and $\\angle 3$ are complementary, and $\\angle 2$ and $\\angle 3$ are complementary, so $\\angle 1 \\cong \\angle 2$" starts from two angles complementary to the same angle: the Congruent Complements Theorem.\n\n> **Watch out.** *Supplementary* means a sum of $180^\\circ$ and *complementary* a sum of $90^\\circ$. Pick the theorem whose word matches the statement, not the first one that ends in a congruence.',
        "下面四个定理不需要平行线就能得出两个角全等：\n\n- **对顶角定理**：对顶角全等。\n- **等角的补角相等**：与同一个角或相等的角互补的两个角全等。\n- **等角的余角相等**：互余时同理。\n- **直角相等定理**：所有直角都全等。\n\n四个定理的结论都是 $\\angle 1 \\cong \\angle 2$，所以只看结论分不出来。要看结论是从什么条件出发的。“$\\angle 1$ 与 $\\angle 3$ 互余，$\\angle 2$ 与 $\\angle 3$ 互余，所以 $\\angle 1 \\cong \\angle 2$”是从与同一个角互余的两个角出发：用的是等角的余角相等。\n\n> **注意。** *互补*是和为 $180^\\circ$，*互余*是和为 $90^\\circ$。要选与结论中的词相符的定理，而不是随便选一个结论为全等的定理。",
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
        const starts: Partial<Record<Reason, Text>> = {
          vertical: t("two vertical angles", "两个对顶角"),
          congSupp: t("two angles supplementary to the same angle or to congruent angles", "与同一个角或相等的角互补的两个角"),
          congComp: t("two angles complementary to the same angle or to congruent angles", "与同一个角或相等的角互余的两个角"),
          rightCong: t("two right angles", "两个直角"),
        };
        const start =
          kind === 1 || kind === 2
            ? sameAngle
              ? t(`two angles ${rel.en} to the same angle, $\\angle ${c}$`, `与同一个角 $\\angle ${c}$ ${rel["zh-CN"]}的两个角`)
              : t(
                  `two angles ${rel.en} to congruent angles, $\\angle ${c}$ and $\\angle ${d}$`,
                  `分别与两个全等的角 $\\angle ${c}$、$\\angle ${d}$ ${rel["zh-CN"]}的两个角`,
                )
            : starts[r]!;
        return reasoned(
          choiceProblem({
            prompt,
            options: generalTheorems.map((x) => reasons[x]),
            correct: kind,
            solution: cat(
              t(
                `Every option ends with $\\angle ${a} \\cong \\angle ${b}$, so look at what the statement starts from: ${start.en}.`,
                `每个选项的结论都是 $\\angle ${a} \\cong \\angle ${b}$，所以要看结论从什么出发：${start["zh-CN"]}。`,
              ),
              t(
                `\n\nThat is the starting point of the ${reasons[r].en}: ${why[r].en}.`,
                `\n\n这正是“${reasons[r]["zh-CN"]}”的出发点：${why[r]["zh-CN"]}。`,
              ),
              t(
                `\n\n**Check.** Each word of the statement matches the theorem: it starts from ${starts[r]!.en} and concludes that two angles are congruent, as the theorem does.`,
                `\n\n**检验。** 结论的每个词都与定理吻合：从${starts[r]!["zh-CN"]}出发，得出两个角全等，与定理一致。`,
              ),
            ),
          }),
          generalTheorems
            .filter((x) => x !== r)
            .map((x) => [
              reasons[x].en,
              `That theorem starts from ${starts[x]!.en}, but this statement starts from ${start.en}.`,
              `那个定理从${starts[x]!["zh-CN"]}出发，而这个结论从${start["zh-CN"]}出发。`,
            ]),
        );
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
  const [c, v] = [corr(a), vert(a)];
  const viaCorr = rng.bool();
  const mid = viaCorr ? c : v;
  const middle: Step[] = viaCorr
    ? [
        { s: cong(a, c), r: "corr", note: corrNote(a, c, 1), adds: { arcs: [a, c] }, wrong: wrongCong(a, c) },
        { s: cong(c, b), r: "vertical", note: vertNote(c, b), adds: { arcs: [c, b] }, wrong: wrongCong(c, b) },
      ]
    : [
        { s: cong(a, v), r: "vertical", note: vertNote(a, v), adds: { arcs: [a, v] }, wrong: wrongCong(a, v) },
        { s: cong(v, b), r: "corr", note: corrNote(v, b, 1), adds: { arcs: [v, b] }, wrong: wrongCong(v, b) },
      ];
  const scene = pickScene(rng);
  return {
    given: parallel,
    prove: cong(a, b),
    steps: [
      { s: parallel, r: "given", adds: { par: true } },
      ...middle,
      { s: cong(a, b), r: "transitive", note: transNote(2, 3, a, b, mid), adds: { arcs: [a, b] }, wrong: wrongCong(a, b) },
    ],
    scene,
    figure: sceneProblemFigure(scene, true),
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
  const [va, vb] = [vert(a), vert(b)];
  const fromB = rng.bool();
  const middle: Step[] = fromB
    ? [
        { s: cong(b, vb), r: "vertical", note: vertNote(b, vb), adds: { arcs: [b, vb] }, wrong: wrongCong(b, vb) },
        { s: cong(a, vb), r: "transitive", note: transNote(1, 2, a, vb, b), adds: { arcs: [a, vb] }, wrong: wrongCong(a, vb) },
      ]
    : [
        { s: cong(va, a), r: "vertical", note: vertNote(va, a), adds: { arcs: [va, a] }, wrong: wrongCong(va, a) },
        { s: cong(va, b), r: "transitive", note: transNote(2, 1, va, b, a), adds: { arcs: [va, b] }, wrong: wrongCong(va, b) },
      ];
  const [x, y] = fromB ? [a, vb] : [va, b];
  const scene = pickScene(rng);
  return {
    given: cong(a, b),
    prove: parallel,
    steps: [
      { s: cong(a, b), r: "given", adds: { arcs: [a, b] } },
      ...middle,
      { s: parallel, r: "corrConv", note: corrConvNote(x, y, 3), adds: { par: true }, wrong: wrongParallel },
    ],
    scene,
    figure: sceneProblemFigure(scene, false),
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
  const scene = pickScene(rng);
  return {
    given: parallel,
    prove: supp(a, b),
    steps: [
      { s: parallel, r: "given", adds: { par: true } },
      { s: cong(a, c), r: "corr", note: corrNote(a, c, 1), adds: { arcs: [a, c] }, wrong: wrongCong(a, c) },
      {
        s: eqm(a, c),
        r: "defCong",
        note: t(
          `Step 2 gives $\\angle ${a} \\cong \\angle ${c}$, and congruent angles have equal measures.`,
          `第 2 步给出 $\\angle ${a} \\cong \\angle ${c}$，而全等的角度数相等。`,
        ),
        wrong: wrongEq(a, c),
      },
      { s: supp(c, b), r: "linearPair", note: pairNote(c, b), adds: { arcs: [c, b] }, wrong: wrongSupp(c, b) },
      {
        s: supp(a, b),
        r: "subst",
        note: t(
          `Step 3 gives $m\\angle ${a} = m\\angle ${c}$, so $m\\angle ${a}$ can replace $m\\angle ${c}$ in step 4.`,
          `第 3 步给出 $m\\angle ${a} = m\\angle ${c}$，所以可以在第 4 步中用 $m\\angle ${a}$ 替换 $m\\angle ${c}$。`,
        ),
        adds: { arcs: [a, b] },
        wrong: wrongSupp(a, b),
      },
    ],
    scene,
    figure: sceneProblemFigure(scene, true),
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
  const scene = pickScene(rng);
  return {
    given: supp(a, b),
    prove: parallel,
    steps: [
      { s: supp(a, b), r: "given", adds: { arcs: [a, b] } },
      { s: supp(c, b), r: "linearPair", note: pairNote(c, b), adds: { arcs: [c, b] }, wrong: wrongSupp(c, b) },
      {
        s: cong(a, c),
        r: "congSupp",
        note: t(
          `Steps 1 and 2 make $\\angle ${a}$ and $\\angle ${c}$ both supplementary to $\\angle ${b}$.`,
          `第 1 步和第 2 步说明 $\\angle ${a}$ 与 $\\angle ${c}$ 都与 $\\angle ${b}$ 互补。`,
        ),
        adds: { arcs: [a, c] },
        wrong: wrongCong(a, c),
      },
      { s: parallel, r: "corrConv", note: corrConvNote(a, c, 3), adds: { par: true }, wrong: wrongParallel },
    ],
    scene,
    figure: sceneProblemFigure(scene, false),
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
  encompasses: [
    { topic: "identifying-angle-theorems", weight: 0.3 },
    { topic: "identifying-angle-postulates", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "The Alternate Interior and Alternate Exterior Angles Theorems were stated in the last topic; here they are proved from the Corresponding Angles Postulate and the Vertical Angles Theorem. A proof is what lets us trust a theorem for *every* pair of parallel lines, not only the ones we happened to measure.\n\nThe idea shows in one example. Let $\\ell \\parallel m$ and $m\\angle 2 = 70^\\circ$.\n\n{{figure 0}}\n\n$\\angle 6$ corresponds to $\\angle 2$, so by the postulate $m\\angle 6 = 70^\\circ$. $\\angle 7$ is vertical to $\\angle 6$, so $m\\angle 7 = 70^\\circ$ too. The alternate exterior angles $\\angle 2$ and $\\angle 7$ came out equal, and the $70^\\circ$ played no part: the same two moves work for any measure. A **two-column proof** writes exactly these moves down, one row per fact, each with the postulate or theorem that allows it.",
    "内错角定理和外错角定理在上一课已经给出；这里用同位角公设和对顶角定理来证明它们。有了证明，才能相信定理对*任何*一对平行线都成立，而不只是对我们碰巧量过的那几对。\n\n用一个例子就能看出思路。设 $\\ell \\parallel m$，$m\\angle 2 = 70^\\circ$。\n\n{{figure 0}}\n\n$\\angle 6$ 与 $\\angle 2$ 是同位角，由公设 $m\\angle 6 = 70^\\circ$。$\\angle 7$ 与 $\\angle 6$ 是对顶角，所以 $m\\angle 7$ 也是 $70^\\circ$。外错角 $\\angle 2$ 与 $\\angle 7$ 相等，而 $70^\\circ$ 根本没起作用：无论多少度，这两步都同样成立。**两栏式证明**就是把这几步写下来，每个事实占一行，并写上允许这样做的公设或定理。",
  ),
  introFigures: [
    transversalFigure(
      70,
      0,
      {
        labels: numbered(),
        arrows: true,
        marked: [
          [2, "accent"],
          [6, "accent"],
          [7, "result"],
        ],
      },
      "Parallel lines ℓ and m cut by a transversal t, with the angles numbered; angles 2, 6 and 7 are marked: 2 and 6 in the same position at the two crossings, and 7 opposite 6.",
      "平行线 ℓ 与 m 被截线 t 所截，各角已编号；标出了 ∠2、∠6、∠7：∠2 与 ∠6 在两个交点处位置相同，∠7 与 ∠6 相对。",
    ),
  ],
  knowledgePoints: [
    {
      ...proofKp(
        "alternate-interior-reasons",
        t("Reasons in the proof", "证明中的理由"),
        cat(
          proofExplanation,
          "\n\n",
          t(
            "**Alternate Interior Angles Theorem.** Given $\\ell \\parallel m$, prove $\\angle 3 \\cong \\angle 6$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 3 \\cong \\angle 7$ — Corresponding Angles Postulate\n3. $\\angle 7 \\cong \\angle 6$ — Vertical Angles Theorem\n4. $\\angle 3 \\cong \\angle 6$ — Transitive Property of Congruence\n\nEach reason fits its row: row 2 uses the parallel lines of row 1 on two angles in the same position; row 3 needs no parallel lines, since $\\angle 7$ and $\\angle 6$ are opposite each other at one crossing; row 4 joins rows 2 and 3 through their shared angle, $\\angle 7$.\n\n> **Watch out.** The Alternate Interior Angles Theorem cannot be a reason in its own proof: that would assume what is being proved. And the Vertical Angles Theorem is for two angles at the *same* crossing; angles at different crossings need the postulate.",
            "**内错角定理。** 已知 $\\ell \\parallel m$，求证 $\\angle 3 \\cong \\angle 6$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 3 \\cong \\angle 7$ — 同位角公设\n3. $\\angle 7 \\cong \\angle 6$ — 对顶角定理\n4. $\\angle 3 \\cong \\angle 6$ — 全等的传递性\n\n每个理由都与它那一行相符：第 2 行把第 1 行的平行线用在两个位置相同的角上；第 3 行不需要平行线，因为 $\\angle 7$ 与 $\\angle 6$ 在同一个交点处彼此相对；第 4 行通过公共的 $\\angle 7$ 把第 2、3 行连起来。\n\n> **注意。** 内错角定理不能作为它自己证明中的理由：那等于假定了要证明的结论。对顶角定理只用于*同一个*交点处的两个角；不同交点处的角要用同位角公设。",
          ),
        ),
        "r",
        (rng) => alternateProof(rng, false),
      ),
      figure: angleDrawings["alternate-interior-reasons"],
    },
    {
      ...proofKp(
        "alternate-interior-statements",
        t("Statements in the proof", "证明中的陈述"),
        t(
          'Each statement must follow from the ones above it by its reason. In the proof that alternate interior angles are congruent, the path goes through a third angle: one corresponding to the first angle and vertical to the second (or the other way round), and the Transitive Property joins the two congruences.\n\nFor $\\angle 4$ and $\\angle 5$: $\\angle 4 \\cong \\angle 8$ (corresponding), $\\angle 8 \\cong \\angle 5$ (vertical), so $\\angle 4 \\cong \\angle 5$. The bridge could also be $\\angle 1$: $\\angle 4 \\cong \\angle 1$ (vertical) and $\\angle 1 \\cong \\angle 5$ (corresponding).\n\n> **Watch out.** A statement must match its reason. Next to "Corresponding Angles Postulate" the two angles must sit in the same position at the two crossings; an angle next to the right one, across $t$ or across a line, forms a linear pair with it and is supplementary, not congruent.',
          "每个陈述都要能由前面的陈述按它的理由推出。在证明内错角全等时，要经过第三个角：它与第一个角是同位角，与第二个角是对顶角（或反过来），再用传递性把两个全等连起来。\n\n对 $\\angle 4$ 与 $\\angle 5$：$\\angle 4 \\cong \\angle 8$（同位角），$\\angle 8 \\cong \\angle 5$（对顶角），所以 $\\angle 4 \\cong \\angle 5$。中间的角也可以是 $\\angle 1$：$\\angle 4 \\cong \\angle 1$（对顶角），$\\angle 1 \\cong \\angle 5$（同位角）。\n\n> **注意。** 陈述必须与它的理由相符。理由写“同位角公设”时，两个角必须在两个交点处位置相同；与正确的角隔着 $t$ 或隔着直线相邻的角，与它构成邻补角，是互补而不是全等。",
        ),
        "s",
        (rng) => alternateProof(rng, false),
      ),
      figure: angleDrawings["alternate-interior-statements"],
    },
    {
      ...proofKp(
        "alternate-exterior-proof",
        t("The Alternate Exterior Angles Theorem", "外错角定理"),
        t(
          "The proof that alternate exterior angles are congruent follows the same pattern. Given $\\ell \\parallel m$, prove $\\angle 1 \\cong \\angle 8$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 1 \\cong \\angle 5$ — Corresponding Angles Postulate\n3. $\\angle 5 \\cong \\angle 8$ — Vertical Angles Theorem\n4. $\\angle 1 \\cong \\angle 8$ — Transitive Property of Congruence\n\nThe only change from the interior case is the bridge angle: $\\angle 5$ corresponds to $\\angle 1$ and is vertical to $\\angle 8$.\n\n> **Watch out.** $\\angle 1$ and $\\angle 8$ are *alternate exterior* angles, outside both lines. Their congruence is what the proof concludes, so neither the Alternate Exterior nor the Alternate Interior Angles Theorem may serve as a reason inside it.",
          "外错角全等的证明思路相同。已知 $\\ell \\parallel m$，求证 $\\angle 1 \\cong \\angle 8$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 1 \\cong \\angle 5$ — 同位角公设\n3. $\\angle 5 \\cong \\angle 8$ — 对顶角定理\n4. $\\angle 1 \\cong \\angle 8$ — 全等的传递性\n\n与内错角的证明相比，只换了中间的角：$\\angle 5$ 与 $\\angle 1$ 是同位角，又与 $\\angle 8$ 是对顶角。\n\n> **注意。** $\\angle 1$ 与 $\\angle 8$ 是*外错角*，在两条直线之外。它们全等正是证明的结论，所以外错角定理和内错角定理都不能在证明中充当理由。",
        ),
        "rs",
        (rng) => alternateProof(rng, true),
      ),
      figure: angleDrawings["alternate-exterior-proof"],
    },
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
  encompasses: [
    { topic: "identifying-angle-theorems", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "So far the parallel lines were given and angles were concluded. Often the question runs the other way: a carpenter or a surveyor measures angles and wants to know whether two lines *are* parallel. For that we need the **converses**, which start from angles and conclude $\\ell \\parallel m$.\n\nOur only tool that ends in $\\ell \\parallel m$ is the Converse of the Corresponding Angles Postulate, so every proof in this topic works its way to a pair of congruent corresponding angles. Suppose $m\\angle 4 = 58^\\circ$ and $m\\angle 5 = 58^\\circ$, a pair of alternate interior angles.\n\n{{figure 0}}\n\n$\\angle 8$ is vertical to $\\angle 5$, so $m\\angle 8 = 58^\\circ$. Now $\\angle 4$ and $\\angle 8$ are corresponding angles with equal measures, and the converse of the postulate says $\\ell \\parallel m$. Again the number $58$ did not matter: congruent alternate interior angles always make the lines parallel.",
    "到目前为止，都是已知两直线平行，再得出角的结论。实际问题常常反过来：木匠或测量员量出角度，想知道两条直线*是否*平行。为此需要**逆定理**，它们从角出发，得出 $\\ell \\parallel m$。\n\n我们手里唯一以 $\\ell \\parallel m$ 为结论的工具是同位角公设的逆命题，所以本课的每个证明都要设法得到一对全等的同位角。设内错角 $m\\angle 4 = 58^\\circ$，$m\\angle 5 = 58^\\circ$。\n\n{{figure 0}}\n\n$\\angle 8$ 与 $\\angle 5$ 是对顶角，所以 $m\\angle 8 = 58^\\circ$。这样 $\\angle 4$ 与 $\\angle 8$ 是度数相等的同位角，由公设的逆命题得 $\\ell \\parallel m$。这里 $58$ 这个数同样无关紧要：内错角全等，两直线就一定平行。",
  ),
  introFigures: [
    transversalFigure(
      thetaFor(4, 58),
      0,
      {
        labels: [
          [1, "1"],
          [2, "2"],
          [3, "3"],
          [4, "58°"],
          [5, "58°"],
          [6, "6"],
          [7, "7"],
          [8, "8"],
        ],
        arrows: false,
        marked: [
          [4, "accent"],
          [5, "accent"],
          [8, "result"],
        ],
      },
      "Lines ℓ and m cut by a transversal t; the alternate interior angles 4 and 5 are marked 58°, and angle 8, opposite angle 5, is marked too.",
      "直线 ℓ 与 m 被截线 t 所截；内错角 ∠4 与 ∠5 标为 58°，与 ∠5 相对的 ∠8 也标出来了。",
    ),
  ],
  knowledgePoints: [
    {
      ...proofKp(
        "alternate-interior-converse-reasons",
        t("Proving lines parallel", "证明两直线平行"),
        t(
          'The **converse** of a theorem swaps its hypothesis and conclusion. The **Converse of the Alternate Interior Angles Theorem**: if alternate interior angles are congruent, the lines are parallel. It is proved from the Converse of the Corresponding Angles Postulate.\n\nGiven $\\angle 3 \\cong \\angle 6$, prove $\\ell \\parallel m$:\n\n1. $\\angle 3 \\cong \\angle 6$ — Given\n2. $\\angle 6 \\cong \\angle 7$ — Vertical Angles Theorem\n3. $\\angle 3 \\cong \\angle 7$ — Transitive Property of Congruence\n4. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate\n\nThe Corresponding Angles Postulate itself cannot be used: it needs $\\ell \\parallel m$, which is what we are proving.\n\n> **Watch out.** A postulate and its converse are different reasons. Only a reason whose conclusion is "the lines are parallel" can justify the last row, so it must be the *Converse* of the Corresponding Angles Postulate.',
          "定理的**逆定理**交换了它的条件和结论。**内错角定理的逆定理**：若内错角全等，则两直线平行。它由同位角公设的逆命题证明。\n\n已知 $\\angle 3 \\cong \\angle 6$，求证 $\\ell \\parallel m$：\n\n1. $\\angle 3 \\cong \\angle 6$ — 已知\n2. $\\angle 6 \\cong \\angle 7$ — 对顶角定理\n3. $\\angle 3 \\cong \\angle 7$ — 全等的传递性\n4. $\\ell \\parallel m$ — 同位角公设的逆命题\n\n这里不能用同位角公设本身：它需要 $\\ell \\parallel m$，而这正是要证明的。\n\n> **注意。** 公设和它的逆命题是两个不同的理由。只有结论为“两直线平行”的理由才能用在最后一行，所以必须是同位角公设的*逆命题*。",
        ),
        "r",
        (rng) => alternateConverseProof(rng, false),
      ),
      figure: angleDrawings["alternate-interior-converse-reasons"],
    },
    {
      ...proofKp(
        "alternate-exterior-converse-proof",
        t("The converse for alternate exterior angles", "外错角定理的逆定理"),
        t(
          "The **Converse of the Alternate Exterior Angles Theorem** is proved the same way: from congruent alternate exterior angles, a vertical angle gives a congruent pair of corresponding angles, and the Converse of the Corresponding Angles Postulate concludes $\\ell \\parallel m$.\n\nGiven $\\angle 2 \\cong \\angle 7$: $\\angle 7 \\cong \\angle 6$ (vertical), so $\\angle 2 \\cong \\angle 6$ (transitive), and $\\angle 2$ and $\\angle 6$ are corresponding, so $\\ell \\parallel m$.\n\n> **Watch out.** The vertical angle has to be taken at the right crossing: the new angle must sit in the same position as the other given angle, at the other crossing. $\\angle 7$'s neighbors $\\angle 5$ and $\\angle 8$ form linear pairs with it, so they are supplementary to it, not congruent.",
          "**外错角定理的逆定理**的证明方法相同：由全等的外错角，借助对顶角得到一对全等的同位角，再由同位角公设的逆命题得出 $\\ell \\parallel m$。\n\n已知 $\\angle 2 \\cong \\angle 7$：$\\angle 7 \\cong \\angle 6$（对顶角），所以 $\\angle 2 \\cong \\angle 6$（传递性），而 $\\angle 2$ 与 $\\angle 6$ 是同位角，所以 $\\ell \\parallel m$。\n\n> **注意。** 对顶角要取在正确的交点处：新得到的角必须与另一个已知角在两个交点处位置相同。$\\angle 7$ 旁边的 $\\angle 5$ 和 $\\angle 8$ 与它构成邻补角，是互补而不是全等。",
        ),
        "rs",
        (rng) => alternateConverseProof(rng, true),
      ),
      figure: angleDrawings["alternate-exterior-converse-proof"],
    },
    {
      id: "values-that-make-lines-parallel",
      figure: angleDrawings["values-that-make-lines-parallel"],
      title: t("Values that make lines parallel", "使两直线平行的取值"),
      explanation: t(
        "By the converses, $\\ell \\parallel m$ when alternate interior (or alternate exterior) angles are congruent. Set the two expressions equal and solve.\n\nIf alternate exterior angles measure $(4x - 12)^\\circ$ and $(2x + 30)^\\circ$, then $4x - 12 = 2x + 30$, so $2x = 42$ and $x = 21$. Both angles are then $72^\\circ$, and congruent alternate exterior angles make $\\ell \\parallel m$.\n\n> **Watch out.** Alternate angles are set *equal*, not added to $180^\\circ$; only consecutive interior angles are supplementary. And the answer is $x$, not the measure of the angles.",
        "由逆定理，当内错角（或外错角）全等时 $\\ell \\parallel m$。令两个式子相等并求解。\n\n若一对外错角为 $(4x - 12)^\\circ$ 和 $(2x + 30)^\\circ$，则 $4x - 12 = 2x + 30$，所以 $2x = 42$，$x = 21$。这时两个角都是 $72^\\circ$，外错角全等，所以 $\\ell \\parallel m$。\n\n> **注意。** 内错角、外错角要令它们*相等*，而不是和为 $180^\\circ$；只有同旁内角才互补。另外，答案是 $x$，不是角的度数。",
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
        const [theta, phi] = [thetaFor(pair[0], m), pickTilt(rng)];
        const drawn = (l1: string, l2: string, arrows: boolean) =>
          transversalFigure(
            theta,
            phi,
            {
              labels: [
                [pair[0], l1],
                [pair[1], l2],
              ],
              arrows,
              arcs: true,
            },
            `Lines ℓ and m${arrows ? ", now marked parallel," : ""} cut by a transversal t, with ${name.en} angles marked ${l1} and ${l2}.`,
            `直线 ℓ 与 m${arrows ? "（现已标为平行）" : ""}被截线 t 所截，一对${name["zh-CN"]}分别标为 ${l1} 和 ${l2}。`,
          );
        return {
          ...numberProblem({
            prompt: t("For what value of $x$ are lines $\\ell$ and $m$ parallel?", "当 $x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？"),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [m, intOr(180 - d1 - d2, c1 + c2, -x), -x],
            solution: t("", ""),
          }),
          ...pairSolution({
            x,
            c1,
            d1,
            c2,
            d2,
            total: null,
            why: t(
              `The labeled angles are ${name.en} angles: ${exterior ? "outside" : "between"} the two lines, on opposite sides of $t$. By the Converse of the ${exterior ? "Alternate Exterior" : "Alternate Interior"} Angles Theorem, $\\ell \\parallel m$ when they are congruent, so set their measures equal:`,
              `标出的两个角是${name["zh-CN"]}：在两条直线${exterior ? "之外" : "之间"}，分在 $t$ 的两侧。由${name["zh-CN"]}定理的逆定理，当它们全等时 $\\ell \\parallel m$，所以令它们的度数相等：`,
            ),
            drawn: (l1, l2) => drawn(l1, l2, true),
          }),
          figure: drawn(angleLabel(c1, d1), angleLabel(c2, d2), false),
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
  encompasses: [
    { topic: "identifying-angle-postulates", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "Alternate angles of parallel lines are congruent. The angles on the *same* side of the transversal between the lines, the **consecutive interior angles**, behave differently: they add up to $180^\\circ$. This topic proves it, with one new move: turning a congruence into an equation of measures, so that it can be substituted.\n\nTake $\\ell \\parallel m$ with $m\\angle 4 = 115^\\circ$.\n\n{{figure 0}}\n\n$\\angle 8$ corresponds to $\\angle 4$, so $m\\angle 8 = 115^\\circ$. $\\angle 8$ and $\\angle 6$ form a linear pair, so $m\\angle 6 = 180^\\circ - 115^\\circ = 65^\\circ$. The consecutive interior angles $\\angle 4$ and $\\angle 6$ add up to $115^\\circ + 65^\\circ = 180^\\circ$, and with any other measure in place of $115^\\circ$ the sum is $180^\\circ$ again.",
    "平行线的内错角全等。而在截线*同侧*、两直线之间的角，即**同旁内角**，表现不同：它们的和为 $180^\\circ$。本课证明这一点，其中有一个新的步骤：把角的全等改写成度数的等式，以便代换。\n\n设 $\\ell \\parallel m$，$m\\angle 4 = 115^\\circ$。\n\n{{figure 0}}\n\n$\\angle 8$ 与 $\\angle 4$ 是同位角，所以 $m\\angle 8 = 115^\\circ$。$\\angle 8$ 与 $\\angle 6$ 是邻补角，所以 $m\\angle 6 = 180^\\circ - 115^\\circ = 65^\\circ$。同旁内角 $\\angle 4$ 与 $\\angle 6$ 的和是 $115^\\circ + 65^\\circ = 180^\\circ$；把 $115^\\circ$ 换成别的度数，和仍是 $180^\\circ$。",
  ),
  introFigures: [
    transversalFigure(
      thetaFor(4, 115),
      0,
      {
        labels: [
          [1, "1"],
          [2, "2"],
          [3, "3"],
          [4, "115°"],
          [5, "5"],
          [6, "65°"],
          [7, "7"],
          [8, "115°"],
        ],
        arrows: true,
        marked: [
          [4, "accent"],
          [8, "accent"],
          [6, "result"],
        ],
      },
      "Parallel lines ℓ and m cut by a transversal t; angle 4 and angle 8, in the same position at the two crossings, are marked 115°, and angle 6, next to angle 8, is marked 65°.",
      "平行线 ℓ 与 m 被截线 t 所截；位置相同的 ∠4 与 ∠8 标为 115°，与 ∠8 相邻的 ∠6 标为 65°。",
    ),
  ],
  knowledgePoints: [
    {
      ...proofKp(
        "consecutive-interior-reasons",
        t("Reasons in the proof", "证明中的理由"),
        t(
          "**Consecutive Interior Angles Theorem.** Given $\\ell \\parallel m$, prove $m\\angle 3 + m\\angle 5 = 180^\\circ$:\n\n1. $\\ell \\parallel m$ — Given\n2. $\\angle 3 \\cong \\angle 7$ — Corresponding Angles Postulate\n3. $m\\angle 3 = m\\angle 7$ — Definition of congruent angles\n4. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — Linear Pair Postulate\n5. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — Substitution Property of Equality\n\nStep 3 turns a congruence of angles into an equation of measures, so that step 5 can substitute $m\\angle 3$ for $m\\angle 7$.\n\n> **Watch out.** Substitution works on numbers, so it needs the equation $m\\angle 3 = m\\angle 7$ of step 3, not the congruence of step 2. The reason that turns one into the other is the Definition of congruent angles.",
          "**同旁内角定理。** 已知 $\\ell \\parallel m$，求证 $m\\angle 3 + m\\angle 5 = 180^\\circ$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $\\angle 3 \\cong \\angle 7$ — 同位角公设\n3. $m\\angle 3 = m\\angle 7$ — 角全等的定义\n4. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — 邻补角公设\n5. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — 等量代换\n\n第 3 步把角的全等变成度数的等式，第 5 步才能用 $m\\angle 3$ 替换 $m\\angle 7$。\n\n> **注意。** 代换是对数进行的，所以它要用第 3 步的等式 $m\\angle 3 = m\\angle 7$，而不是第 2 步的全等。把全等变成等式的理由是“角全等的定义”。",
        ),
        "r",
        consecutiveProof,
      ),
      figure: angleDrawings["consecutive-interior-reasons"],
    },
    {
      ...proofKp(
        "consecutive-interior-statements",
        t("Statements in the proof", "证明中的陈述"),
        t(
          "The proof joins a congruence and a linear pair. The angle corresponding to the first consecutive interior angle forms a linear pair with the second one; substituting equal measures turns that linear pair into the statement to prove.\n\nFor $\\angle 4$ and $\\angle 6$: $\\angle 4 \\cong \\angle 8$, so $m\\angle 4 = m\\angle 8$; $m\\angle 8 + m\\angle 6 = 180^\\circ$; so $m\\angle 4 + m\\angle 6 = 180^\\circ$.\n\n> **Watch out.** A linear pair shares a side. $\\angle 8$ and $\\angle 5$ do not: they are vertical angles, opposite each other, so they are congruent and their sum is not $180^\\circ$. Before writing a sum of $180^\\circ$, check that the two angles sit side by side.",
          "证明把一个全等和一对邻补角结合起来。与第一个同旁内角成同位角的那个角，和第二个角构成邻补角；用相等的度数代换，就得到要证明的结论。\n\n对 $\\angle 4$ 与 $\\angle 6$：$\\angle 4 \\cong \\angle 8$，所以 $m\\angle 4 = m\\angle 8$；$m\\angle 8 + m\\angle 6 = 180^\\circ$；所以 $m\\angle 4 + m\\angle 6 = 180^\\circ$。\n\n> **注意。** 邻补角有一条公共边。$\\angle 8$ 与 $\\angle 5$ 没有：它们彼此相对，是对顶角，所以全等，和不是 $180^\\circ$。写和为 $180^\\circ$ 之前，先确认两个角是并排相邻的。",
        ),
        "s",
        consecutiveProof,
      ),
      figure: angleDrawings["consecutive-interior-statements"],
    },
    {
      id: "using-consecutive-interior-angles",
      figure: angleDrawings["using-consecutive-interior-angles"],
      title: t("Using consecutive interior angles", "运用同旁内角"),
      explanation: t(
        "With $\\ell \\parallel m$, consecutive interior angles add up to $180^\\circ$. When their measures are expressions, solve for $x$ and substitute back.\n\nIf they measure $(3x + 20)^\\circ$ and $(2x - 15)^\\circ$, then $(3x + 20) + (2x - 15) = 180$, so $5x + 5 = 180$, $5x = 175$ and $x = 35$. The first angle is $3 \\cdot 35 + 20 = 125^\\circ$ and the second $2 \\cdot 35 - 15 = 55^\\circ$: one obtuse, one acute, as the figure shows for a slanted transversal.\n\n> **Watch out.** Consecutive interior angles are supplementary, not congruent: do not set the two expressions equal. And once you have $x$, put it into the expression of the angle that is asked for.",
        "当 $\\ell \\parallel m$ 时，同旁内角之和为 $180^\\circ$。当度数用式子表示时，先解出 $x$ 再代回。\n\n若它们为 $(3x + 20)^\\circ$ 和 $(2x - 15)^\\circ$，则 $(3x + 20) + (2x - 15) = 180$，所以 $5x + 5 = 180$，$5x = 175$，$x = 35$。第一个角是 $3 \\cdot 35 + 20 = 125^\\circ$，第二个角是 $2 \\cdot 35 - 15 = 55^\\circ$：截线倾斜时，一个钝角、一个锐角，与图一致。\n\n> **注意。** 同旁内角互补，而不是全等：不要令两个式子相等。求出 $x$ 后，要代入所求那个角的式子。",
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
        const [theta, phi] = [thetaFor(pair[0], m), pickTilt(rng)];
        const drawn = (l1: string, l2: string) =>
          transversalFigure(
            theta,
            phi,
            {
              labels: [
                [pair[0], l1],
                [pair[1], l2],
              ],
              arrows: true,
              arcs: true,
            },
            `Parallel lines ℓ and m cut by a transversal t, with consecutive interior angles marked ${l1} and ${l2}.`,
            `平行线 ℓ 与 m 被截线 t 所截，一对同旁内角分别标为 ${l1} 和 ${l2}。`,
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
            solution: t("", ""),
          }),
          ...pairSolution({
            x,
            c1,
            d1,
            c2,
            d2,
            total: 180,
            why: t(
              "The labeled angles lie between the parallel lines on the same side of $t$: they are consecutive interior angles. By the Consecutive Interior Angles Theorem they are supplementary:",
              "标出的两个角在两条平行线之间、$t$ 的同侧：它们是同旁内角。由同旁内角定理，它们互补：",
            ),
            asked: [ca, da],
            drawn,
          }),
          figure: drawn(angleLabel(c1, d1), angleLabel(c2, d2)),
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
  encompasses: [{ topic: "identifying-angle-theorems", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "Parallel lines make consecutive interior angles supplementary. This topic runs that theorem backwards: when consecutive interior angles are supplementary, the lines are parallel. The proof turns the sum into a pair of congruent corresponding angles, and the earlier converse finishes it.\n\nSay $m\\angle 4 = 100^\\circ$ and $m\\angle 6 = 80^\\circ$, nothing yet known about $\\ell$ and $m$.\n\n{{figure 0}}\n\n$\\angle 8$ forms a linear pair with $\\angle 6$, so $m\\angle 8 = 180^\\circ - 80^\\circ = 100^\\circ$. Now $\\angle 4$ and $\\angle 8$ are corresponding angles of $100^\\circ$ each, and congruent corresponding angles make $\\ell \\parallel m$. Had the sum been $181^\\circ$, $\\angle 8$ would measure $99^\\circ$ and the lines would not be parallel.",
    "平行线的同旁内角互补。本课把这条定理倒过来：同旁内角互补时，两直线平行。证明把“和为 $180^\\circ$”变成一对全等的同位角，再用已学的逆命题得出结论。\n\n设 $m\\angle 4 = 100^\\circ$，$m\\angle 6 = 80^\\circ$，还不知道 $\\ell$ 与 $m$ 是否平行。\n\n{{figure 0}}\n\n$\\angle 8$ 与 $\\angle 6$ 是邻补角，所以 $m\\angle 8 = 180^\\circ - 80^\\circ = 100^\\circ$。于是 $\\angle 4$ 与 $\\angle 8$ 是同位角，都是 $100^\\circ$，同位角全等，所以 $\\ell \\parallel m$。如果两角之和是 $181^\\circ$，$\\angle 8$ 就是 $99^\\circ$，两直线就不平行。",
  ),
  introFigures: [
    transversalFigure(
      thetaFor(4, 100),
      0,
      {
        labels: [
          [1, "1"],
          [2, "2"],
          [3, "3"],
          [4, "100°"],
          [5, "5"],
          [6, "80°"],
          [7, "7"],
          [8, "100°"],
        ],
        arrows: false,
        arcs: true,
        marked: [
          [4, "accent"],
          [6, "accent"],
          [8, "result"],
        ],
      },
      "Lines ℓ and m cut by a transversal t; consecutive interior angles 4 and 6 are marked 100° and 80°, and angle 8, next to angle 6, is marked 100°.",
      "直线 ℓ 与 m 被截线 t 所截；同旁内角 ∠4 与 ∠6 标为 100° 和 80°，与 ∠6 相邻的 ∠8 标为 100°。",
    ),
  ],
  knowledgePoints: [
    {
      ...proofKp(
        "consecutive-converse-reasons",
        t("Reasons in the proof", "证明中的理由"),
        t(
          "**Converse of the Consecutive Interior Angles Theorem**: if consecutive interior angles are supplementary, the lines are parallel.\n\nGiven $m\\angle 3 + m\\angle 5 = 180^\\circ$, prove $\\ell \\parallel m$:\n\n1. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — Given\n2. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — Linear Pair Postulate\n3. $\\angle 3 \\cong \\angle 7$ — Congruent Supplements Theorem\n4. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate\n\nBoth $\\angle 3$ and $\\angle 7$ are supplementary to $\\angle 5$, so they are congruent.\n\n> **Watch out.** No step may use a theorem about parallel lines, such as the Consecutive Interior Angles Theorem or the Corresponding Angles Postulate: they assume $\\ell \\parallel m$, which is what is being proved. Only the *converse* belongs in the last step.",
          "**同旁内角定理的逆定理**：若同旁内角互补，则两直线平行。\n\n已知 $m\\angle 3 + m\\angle 5 = 180^\\circ$，求证 $\\ell \\parallel m$：\n\n1. $m\\angle 3 + m\\angle 5 = 180^\\circ$ — 已知\n2. $m\\angle 7 + m\\angle 5 = 180^\\circ$ — 邻补角公设\n3. $\\angle 3 \\cong \\angle 7$ — 同角（或等角）的补角相等\n4. $\\ell \\parallel m$ — 同位角公设的逆命题\n\n$\\angle 3$ 与 $\\angle 7$ 都与 $\\angle 5$ 互补，所以它们全等。\n\n> **注意。** 任何一步都不能用关于平行线的定理，例如同旁内角定理或同位角公设：它们以 $\\ell \\parallel m$ 为前提，而这正是要证明的。只有最后一步用的是*逆命题*。",
        ),
        "r",
        consecutiveConverseProof,
      ),
      figure: angleDrawings["consecutive-converse-reasons"],
    },
    {
      ...proofKp(
        "consecutive-converse-statements",
        t("Statements in the proof", "证明中的陈述"),
        t(
          "To use the Congruent Supplements Theorem, the proof first needs a second angle supplementary to the same angle: the linear pair partner of one of the consecutive interior angles. That partner corresponds to the other consecutive interior angle.\n\nGiven $m\\angle 4 + m\\angle 6 = 180^\\circ$: $m\\angle 8 + m\\angle 6 = 180^\\circ$ (linear pair), so $\\angle 4 \\cong \\angle 8$, and these are corresponding angles, so $\\ell \\parallel m$.\n\n> **Watch out.** The new angle must form a linear pair with one consecutive interior angle *and* correspond to the other. $\\angle 8$ works for $\\angle 4$ and $\\angle 6$; $\\angle 5$ also forms a linear pair with $\\angle 6$, but it corresponds to $\\angle 1$, not to $\\angle 4$, so it leads nowhere.",
          "要用“等角的补角相等”，证明先要找到与同一个角互补的另一个角：某个同旁内角的邻补角。这个邻补角与另一个同旁内角是同位角。\n\n已知 $m\\angle 4 + m\\angle 6 = 180^\\circ$：$m\\angle 8 + m\\angle 6 = 180^\\circ$（邻补角），所以 $\\angle 4 \\cong \\angle 8$，它们是同位角，所以 $\\ell \\parallel m$。\n\n> **注意。** 新找的角必须与一个同旁内角构成邻补角，*并且*与另一个同旁内角是同位角。对 $\\angle 4$ 和 $\\angle 6$ 来说，$\\angle 8$ 合适；$\\angle 5$ 虽然也是 $\\angle 6$ 的邻补角，但它与 $\\angle 1$ 是同位角，而不是与 $\\angle 4$，所以用不上。",
        ),
        "s",
        consecutiveConverseProof,
      ),
      figure: angleDrawings["consecutive-converse-statements"],
    },
    {
      id: "deciding-whether-lines-are-parallel",
      figure: angleDrawings["deciding-whether-lines-are-parallel"],
      title: t("Deciding whether lines are parallel", "判断两直线是否平行"),
      explanation: t(
        "The converses decide whether two lines cut by a transversal are parallel:\n\n- corresponding, alternate interior or alternate exterior angles congruent $\\Rightarrow$ parallel;\n- consecutive interior angles supplementary $\\Rightarrow$ parallel.\n\nThe theorems themselves settle the other verdict: if the lines were parallel, those angles would have to be congruent (or supplementary), so when they are not, the lines are not parallel.\n\nIf consecutive interior angles measure $118^\\circ$ and $72^\\circ$, their sum is $190^\\circ \\ne 180^\\circ$, so the lines are not parallel, however parallel they may look.\n\n> **Watch out.** Use the test that fits the pair: only consecutive interior angles are tested by their sum; corresponding and alternate angles must be equal. And never judge by how the drawing looks: lines a few degrees apart look parallel.",
        "用逆定理可以判断被截线所截的两条直线是否平行：\n\n- 同位角、内错角或外错角全等 $\\Rightarrow$ 平行；\n- 同旁内角互补 $\\Rightarrow$ 平行。\n\n反过来的结论由定理本身给出：如果两直线平行，这些角就必须全等（或互补）；它们不全等（或不互补）时，两直线就不平行。\n\n若一对同旁内角为 $118^\\circ$ 和 $72^\\circ$，它们的和是 $190^\\circ \\ne 180^\\circ$，所以两直线不平行，无论看上去多么平行。\n\n> **注意。** 要用与这对角相符的判定：只有同旁内角看和；同位角和内错角、外错角要看是否相等。也不要凭图的样子判断：只差几度的两条直线看上去也是平行的。",
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
        const where = [
          t("in the same position at the two crossings", "在两个交点处位置相同"),
          t("between the two lines, on opposite sides of $t$", "在两条直线之间，分在 $t$ 的两侧"),
          t("outside the two lines, on opposite sides of $t$", "在两条直线之外，分在 $t$ 的两侧"),
          t("between the two lines, on the same side of $t$", "在两条直线之间，在 $t$ 的同侧"),
        ][kind]!;
        const rule = [
          t("Corresponding Angles Postulate", "同位角公设"),
          t("Alternate Interior Angles Theorem", "内错角定理"),
          t("Alternate Exterior Angles Theorem", "外错角定理"),
          t("Consecutive Interior Angles Theorem", "同旁内角定理"),
        ][kind]!;
        const converse = t(
          kind === 0 ? "Converse of the Corresponding Angles Postulate" : `Converse of the ${rule.en}`,
          kind === 0 ? "同位角公设的逆命题" : `${rule["zh-CN"]}的逆定理`,
        );
        const test = kind === 3 ? t("supplementary", "互补") : t("congruent", "全等");
        const compare =
          kind === 3
            ? t(
                `$${ma}^\\circ + ${mb}^\\circ = ${ma + mb}^\\circ$, which ${isParallel ? "is" : "is not"} $180^\\circ$.`,
                `$${ma}^\\circ + ${mb}^\\circ = ${ma + mb}^\\circ$，${isParallel ? "正是" : "不是"} $180^\\circ$。`,
              )
            : isParallel
              ? t(`Both angles measure $${ma}^\\circ$.`, `两个角都是 $${ma}^\\circ$。`)
              : t(
                  `The angles measure $${ma}^\\circ$ and $${mb}^\\circ$: they differ by $${Math.abs(ma - mb)}^\\circ$.`,
                  `两个角分别是 $${ma}^\\circ$ 和 $${mb}^\\circ$：相差 $${Math.abs(ma - mb)}^\\circ$。`,
                );
        const verdict = isParallel
          ? t(
              `The angles are ${test.en}, so by the ${converse.en}, $\\ell \\parallel m$.`,
              `两角${test["zh-CN"]}，由${converse["zh-CN"]}，$\\ell \\parallel m$。`,
            )
          : t(
              `The angles are not ${test.en}. If $\\ell$ and $m$ were parallel, the ${rule.en} would make them ${test.en}, so $\\ell$ and $m$ are not parallel.`,
              `两角不${test["zh-CN"]}。如果 $\\ell$ 与 $m$ 平行，由${rule["zh-CN"]}，它们就会${test["zh-CN"]}，所以 $\\ell$ 与 $m$ 不平行。`,
            );
        // The check compares another pair: corresponding angles, or for a corresponding pair, alternate angles.
        const x = kind === 0 ? vert(a) : corr(a);
        const mx = kind === 3 ? 180 - mb : mb;
        const relation =
          kind === 0
            ? t(
                `$\\angle ${x}$ is vertical to $\\angle ${a}$, so it measures $${ma}^\\circ$ too, and $\\angle ${x}$ and $\\angle ${b}$ are alternate ${x >= 3 && x <= 6 ? "interior" : "exterior"} angles`,
                `$\\angle ${x}$ 与 $\\angle ${a}$ 是对顶角，所以它也是 $${ma}^\\circ$；$\\angle ${x}$ 与 $\\angle ${b}$ 是${x >= 3 && x <= 6 ? "内错角" : "外错角"}`,
              )
            : kind === 3
              ? t(
                  `$\\angle ${x}$ forms a linear pair with $\\angle ${b}$, so $m\\angle ${x} = 180^\\circ - ${mb}^\\circ = ${mx}^\\circ$, and $\\angle ${x}$ corresponds to $\\angle ${a}$`,
                  `$\\angle ${x}$ 与 $\\angle ${b}$ 是邻补角，所以 $m\\angle ${x} = 180^\\circ - ${mb}^\\circ = ${mx}^\\circ$；$\\angle ${x}$ 与 $\\angle ${a}$ 是同位角`,
                )
              : t(
                  `$\\angle ${x}$ is vertical to $\\angle ${b}$, so it measures $${mx}^\\circ$, and $\\angle ${x}$ corresponds to $\\angle ${a}$`,
                  `$\\angle ${x}$ 与 $\\angle ${b}$ 是对顶角，所以它也是 $${mx}^\\circ$；$\\angle ${x}$ 与 $\\angle ${a}$ 是同位角`,
                );
        const [m1, m2] = kind === 0 ? [ma, mb] : [ma, mx];
        const tilt = pickTilt(rng);
        const drawn = (extra: boolean) =>
          transversalFigure(
            thetaFor(a, ma),
            tilt,
            {
              labels: [[a, deg(ma)], [b, deg(mb)], ...(extra ? ([[x, deg(kind === 0 ? ma : mx)]] as const) : [])],
              arrows: extra && isParallel,
              arcs: true,
              ...(extra && { marked: [[x, "result"]] as const }),
            },
            extra
              ? `Lines ℓ and m cut by a transversal t, with ${name.en} angles marked ${ma}° and ${mb}° and angle ${x} marked ${kind === 0 ? ma : mx}°${isParallel ? "; ℓ and m are marked parallel" : ""}.`
              : `Lines ℓ and m cut by a transversal t, with ${name.en} angles marked ${ma}° and ${mb}°.`,
            extra
              ? `直线 ℓ 与 m 被截线 t 所截，一对${name["zh-CN"]}分别标为 ${ma}° 和 ${mb}°，∠${x} 标为 ${kind === 0 ? ma : mx}°${isParallel ? "；ℓ 与 m 标为平行" : ""}。`
              : `直线 ℓ 与 m 被截线 t 所截，一对${name["zh-CN"]}分别标为 ${ma}° 和 ${mb}°。`,
          );
        return {
          ...verdictChoice(rng, {
            prompt: t("Are lines $\\ell$ and $m$ parallel?", "直线 $\\ell$ 与 $m$ 平行吗？"),
            holds: isParallel,
            yes: t(
              `these ${name.en} angles are ${kind === 3 ? "supplementary" : "congruent"}`,
              `这对${name["zh-CN"]}${kind === 3 ? "互补" : "全等"}`,
            ),
            no: t(
              `these ${name.en} angles are not ${kind === 3 ? "supplementary" : "congruent"}`,
              `这对${name["zh-CN"]}不${kind === 3 ? "互补" : "全等"}`,
            ),
            yesWrong: t("the lines look as if they would never meet", "这两条直线看上去永远不会相交"),
            noWrong:
              kind === 3
                ? t(`$${ma}^\\circ$ and $${mb}^\\circ$ are not congruent`, `$${ma}^\\circ$ 与 $${mb}^\\circ$ 不全等`)
                : t(
                    `$${ma}^\\circ$ and $${mb}^\\circ$ do not add up to $180^\\circ$`,
                    `$${ma}^\\circ$ 与 $${mb}^\\circ$ 的和不是 $180^\\circ$`,
                  ),
            solution: t(
              `${stepLabel(1, "name the pair", "说出这对角").en} $\\angle ${a}$ and $\\angle ${b}$ lie ${where.en}: they are ${name.en} angles. Their test is whether they are ${test.en}.\n\n${stepLabel(2, "apply the test", "判定").en} ${compare.en} ${verdict.en}\n\n**Check.** Compare another pair. ${relation.en}. These measure $${m1}^\\circ$ and $${m2}^\\circ$, so they ${m1 === m2 ? "are congruent" : "are not congruent"}, and that gives the same verdict: ${isParallel ? "$\\ell \\parallel m$" : "$\\ell$ and $m$ are not parallel"}.\n\n{{figure 0}}`,
              `${stepLabel(1, "name the pair", "说出这对角")["zh-CN"]} $\\angle ${a}$ 与 $\\angle ${b}$ ${where["zh-CN"]}：它们是${name["zh-CN"]}。要看它们是否${test["zh-CN"]}。\n\n${stepLabel(2, "apply the test", "判定")["zh-CN"]} ${compare["zh-CN"]}${verdict["zh-CN"]}\n\n**检验。** 换一对角来比较。${relation["zh-CN"]}。这两个角是 $${m1}^\\circ$ 和 $${m2}^\\circ$，${m1 === m2 ? "全等" : "不全等"}，得到同样的结论：${isParallel ? "$\\ell \\parallel m$" : "$\\ell$ 与 $m$ 不平行"}。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [drawn(true)],
          figure: drawn(false),
        };
      },
    },
  ],
};

/** perpendicularScene picks a scene where t meets the lines at right angles. */
const perpendicularScene = (rng: Rng, single = false): Scene => ({
  theta: 90,
  phi: pickTilt(rng) + rng.pick([0, 0, 30, -30]),
  ...(single && { single: true }),
});

/** perpendicularFigure draws ℓ and m (or ℓ alone) cut at right angles by t, with angles numbered. */
function perpendicularFigure(sc: Scene, o: { arrows: boolean; right?: readonly number[] }): Figure {
  return transversalFigure(
    sc.theta,
    sc.phi,
    { labels: numbered(sc.single), arrows: o.arrows, ...(sc.single && { single: true }), ...(o.right && { right: o.right }) },
    sc.single
      ? "Lines ℓ and t crossing, with the four angles numbered 1 to 4."
      : `Lines ℓ and m${o.arrows ? ", marked parallel," : ""} cut by a transversal t, with the eight angles numbered 1 to 4 at ℓ and 5 to 8 at m.`,
    sc.single
      ? "直线 ℓ 与 t 相交，四个角编号为 1 到 4。"
      : `直线 ℓ 与 m${o.arrows ? "（标为平行）" : ""}被截线 t 所截，八个角在 ℓ 处编号为 1 到 4，在 m 处编号为 5 到 8。`,
  );
}

const isRight = (n: number) => t(`$\\angle ${n}$ is a right angle`, `$\\angle ${n}$ 是直角`);

/** wrongRight are false statements a learner may confuse with "∠n is a right angle". */
const wrongRight = (n: number): Wrong[] => [
  [
    t(`$\\angle ${n}$ is an acute angle`, `$\\angle ${n}$ 是锐角`),
    t(
      `The rows above make $\\angle ${n}$ measure exactly $90^\\circ$, and a right angle is not acute.`,
      `上面的行使 $\\angle ${n}$ 恰好是 $90^\\circ$，而直角不是锐角。`,
    ),
  ],
  [
    t(`$\\angle ${n}$ is an obtuse angle`, `$\\angle ${n}$ 是钝角`),
    t(
      `The rows above make $\\angle ${n}$ measure exactly $90^\\circ$, and a right angle is not obtuse.`,
      `上面的行使 $\\angle ${n}$ 恰好是 $90^\\circ$，而直角不是钝角。`,
    ),
  ],
  [
    same(`$m\\angle ${n} = 180^\\circ$`),
    t(
      `An angle of $180^\\circ$ is a straight angle, two rays along one line; $\\angle ${n}$ lies between two crossing lines.`,
      `$180^\\circ$ 的角是平角，两边在同一直线上；而 $\\angle ${n}$ 夹在两条相交的直线之间。`,
    ),
  ],
];
const perp = (a: string, b: string) => same(`$${a} \\perp ${b}$`);

/** notVertical says why two angles at different crossings are not vertical angles. */
const notVertical = (a: number, c: number): Wrong => [
  t(`$\\angle ${a}$ and $\\angle ${c}$ are vertical angles`, `$\\angle ${a}$ 与 $\\angle ${c}$ 是对顶角`),
  t(
    `Vertical angles sit at one crossing; $\\angle ${a}$ and $\\angle ${c}$ are at different crossings, in the same position: they are corresponding angles.`,
    `对顶角在同一个交点处；$\\angle ${a}$ 与 $\\angle ${c}$ 在不同的交点处、位置相同：它们是同位角。`,
  ),
];

/** rightSum says why two right angles do not add up to 90°. */
const rightSum = (a: number, c: number): Wrong => [
  same(`$m\\angle ${a} + m\\angle ${c} = 90^\\circ$`),
  t(
    `$\\angle ${a}$ and $\\angle ${c}$ are congruent; two right angles add up to $180^\\circ$, not $90^\\circ$.`,
    `$\\angle ${a}$ 与 $\\angle ${c}$ 全等；两个直角的和是 $180^\\circ$，不是 $90^\\circ$。`,
  ),
];

/** perpendicularTransversalProof proves that a transversal perpendicular to one of two parallel lines is perpendicular to the other. */
function perpendicularTransversalProof(rng: Rng): Proof {
  const a = rng.int(1, 8);
  const c = corr(a);
  const [first, second] = a <= 4 ? ["\\ell", "m"] : ["m", "\\ell"];
  const scene = perpendicularScene(rng);
  return {
    given: cat(parallel, ", ", perp("t", first)),
    prove: perp("t", second),
    steps: [
      { s: parallel, r: "given", adds: { par: true } },
      { s: perp("t", first), r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        note: t(
          `Step 2 gives $t \\perp ${first}$, and $\\angle ${a}$ is one of the angles where they cross.`,
          `第 2 步给出 $t \\perp ${first}$，而 $\\angle ${a}$ 是它们相交处的一个角。`,
        ),
        adds: { right: [a] },
        wrong: wrongRight(a),
      },
      {
        s: cong(a, c),
        r: "corr",
        note: corrNote(a, c, 1),
        adds: { arcs: [c] },
        wrong: [
          rightSum(a, c),
          notVertical(a, c),
          [
            same(`$${first} \\perp ${second}$`),
            t("$\\ell$ and $m$ are given parallel, so they never meet at all.", "$\\ell$ 与 $m$ 已知平行，根本不会相交。"),
          ],
        ],
      },
      {
        s: isRight(c),
        r: "defCong",
        note: t(
          `Step 4 gives $\\angle ${a} \\cong \\angle ${c}$, so they have equal measures, and step 3 makes $m\\angle ${a} = 90^\\circ$.`,
          `第 4 步给出 $\\angle ${a} \\cong \\angle ${c}$，所以它们度数相等，而第 3 步使 $m\\angle ${a} = 90^\\circ$。`,
        ),
        adds: { right: [c] },
        wrong: wrongRight(c),
      },
      {
        s: perp("t", second),
        r: "defPerp",
        note: t(
          `Step 5 says that $\\angle ${c}$, an angle where $t$ crosses $${second}$, is a right angle.`,
          `第 5 步说明 $t$ 与 $${second}$ 相交处的 $\\angle ${c}$ 是直角。`,
        ),
        wrong: [
          [same(`$t \\parallel ${second}$`), t(`$t$ crosses $${second}$, so they are not parallel.`, `$t$ 与 $${second}$ 相交，不平行。`)],
          [same("$\\ell \\perp m$"), t("$\\ell$ and $m$ are parallel, so they never meet.", "$\\ell$ 与 $m$ 平行，不会相交。")],
          [same(`$t \\parallel ${first}$`), t(`Step 2 says $t \\perp ${first}$.`, `第 2 步说 $t \\perp ${first}$。`)],
        ],
      },
    ],
    scene,
    figure: perpendicularFigure(scene, { arrows: true, right: [a] }),
    distract: ["corrConv", "rightCong", "vertical", "linearPair", "aia", "transitive"],
  };
}

/** perpendicularToSameLineProof proves that two lines perpendicular to the same line are parallel. */
function perpendicularToSameLineProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const c = corr(a);
  const scene = perpendicularScene(rng);
  return {
    given: cat(perp("\\ell", "t"), ", ", perp("m", "t")),
    prove: parallel,
    steps: [
      { s: perp("\\ell", "t"), r: "given" },
      { s: perp("m", "t"), r: "given" },
      {
        s: isRight(a),
        r: "defPerp",
        note: t(
          `Step 1 gives $\\ell \\perp t$, and $\\angle ${a}$ is one of the angles where they cross.`,
          `第 1 步给出 $\\ell \\perp t$，而 $\\angle ${a}$ 是它们相交处的一个角。`,
        ),
        adds: { right: [a] },
        wrong: wrongRight(a),
      },
      {
        s: isRight(c),
        r: "defPerp",
        note: t(
          `Step 2 gives $m \\perp t$, and $\\angle ${c}$ is one of the angles where they cross.`,
          `第 2 步给出 $m \\perp t$，而 $\\angle ${c}$ 是它们相交处的一个角。`,
        ),
        adds: { right: [c] },
        wrong: wrongRight(c),
      },
      {
        s: cong(a, c),
        r: "rightCong",
        note: t(
          `Steps 3 and 4 say that $\\angle ${a}$ and $\\angle ${c}$ are both right angles.`,
          `第 3 步和第 4 步说明 $\\angle ${a}$ 与 $\\angle ${c}$ 都是直角。`,
        ),
        wrong: [
          rightSum(a, c),
          notVertical(a, c),
          [
            same("$\\ell \\perp m$"),
            t(
              "$\\ell$ and $m$ are both perpendicular to $t$; nothing makes them cross each other.",
              "$\\ell$ 与 $m$ 都垂直于 $t$；没有什么能使它们彼此相交。",
            ),
          ],
        ],
      },
      { s: parallel, r: "corrConv", note: corrConvNote(a, c, 5), adds: { par: true }, wrong: wrongParallel },
    ],
    scene,
    figure: perpendicularFigure(scene, { arrows: false }),
    distract: ["corr", "vertical", "linearPair", "congSupp", "aia", "transitive"],
  };
}

/** linearPairPerpendicularProof proves that lines forming a congruent linear pair are perpendicular. */
function linearPairPerpendicularProof(rng: Rng): Proof {
  const a = rng.int(1, 4);
  const b = rng.bool() ? acrossT(a) : acrossLine(a);
  const scene = perpendicularScene(rng, true);
  const given = t(`$\\angle ${a} \\cong \\angle ${b}$, and they form a linear pair`, `$\\angle ${a} \\cong \\angle ${b}$，且它们是邻补角`);
  return {
    given,
    prove: perp("\\ell", "t"),
    steps: [
      { s: given, r: "given", adds: { arcs: [a, b] } },
      {
        s: supp(a, b),
        r: "linearPair",
        note: pairNote(a, b),
        wrong: [
          [
            same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
            t(
              "A linear pair makes a straight line, $180^\\circ$, not $90^\\circ$.",
              "邻补角合起来是一条直线，$180^\\circ$，不是 $90^\\circ$。",
            ),
          ],
          [
            same(`$m\\angle ${a} + m\\angle ${b} = 360^\\circ$`),
            t(
              "$360^\\circ$ is the full turn, all four angles at the crossing; a linear pair is half of it.",
              "$360^\\circ$ 是一整圈，即交点处的四个角之和；邻补角只是它的一半。",
            ),
          ],
          [
            same(`$m\\angle ${a} = 2m\\angle ${b}$`),
            t(
              "The Linear Pair Postulate gives a sum, not a ratio of the two angles.",
              "邻补角公设给出的是两角之和，而不是两角的倍数关系。",
            ),
          ],
        ],
      },
      {
        s: eqm(a, b),
        r: "defCong",
        note: t(
          `Step 1 gives $\\angle ${a} \\cong \\angle ${b}$, and congruent angles have equal measures.`,
          `第 1 步给出 $\\angle ${a} \\cong \\angle ${b}$，而全等的角度数相等。`,
        ),
        wrong: [
          [
            same(`$m\\angle ${a} = 2m\\angle ${b}$`),
            t("Congruent angles have equal measures, not one twice the other.", "全等的角度数相等，而不是一个是另一个的两倍。"),
          ],
          [
            same(`$m\\angle ${a} + m\\angle ${b} = 90^\\circ$`),
            t("The definition of congruent angles gives equal measures, not a sum.", "角全等的定义给出的是度数相等，而不是和。"),
          ],
          [
            same(`$m\\angle ${a} = 90^\\circ - m\\angle ${b}$`),
            t("That would make the angles complementary; congruent angles have equal measures.", "那样两角就互余了；全等的角度数相等。"),
          ],
        ],
      },
      {
        s: same(`$2m\\angle ${a} = 180^\\circ$`),
        r: "subst",
        note: t(
          `Step 3 lets $m\\angle ${a}$ replace $m\\angle ${b}$ in step 2: $m\\angle ${a} + m\\angle ${a} = 180^\\circ$.`,
          `由第 3 步，可以在第 2 步中用 $m\\angle ${a}$ 替换 $m\\angle ${b}$：$m\\angle ${a} + m\\angle ${a} = 180^\\circ$。`,
        ),
        wrong: [
          [
            same(`$m\\angle ${a} = 180^\\circ$`),
            t(
              `Replacing $m\\angle ${b}$ by $m\\angle ${a}$ leaves two copies of $m\\angle ${a}$ on the left.`,
              `用 $m\\angle ${a}$ 替换 $m\\angle ${b}$ 后，左边有两个 $m\\angle ${a}$。`,
            ),
          ],
          [
            same(`$2m\\angle ${a} = 90^\\circ$`),
            t(
              "The sum of a linear pair is $180^\\circ$, so the right side stays $180^\\circ$.",
              "邻补角之和是 $180^\\circ$，所以右边仍是 $180^\\circ$。",
            ),
          ],
          [
            same(`$m\\angle ${a} + 2 = 180^\\circ$`),
            t(
              `$m\\angle ${a} + m\\angle ${a}$ is twice the angle, not the angle plus $2$.`,
              `$m\\angle ${a} + m\\angle ${a}$ 是这个角的两倍，而不是加 $2$。`,
            ),
          ],
        ],
      },
      {
        s: same(`$m\\angle ${a} = 90^\\circ$`),
        r: "division",
        note: t("Divide both sides of step 4 by $2$: $180 \\div 2 = 90$.", "把第 4 步两边同除以 $2$：$180 \\div 2 = 90$。"),
        adds: { right: [a] },
        wrong: [
          [same(`$m\\angle ${a} = 45^\\circ$`), t("$180 \\div 2 = 90$, not $45$.", "$180 \\div 2 = 90$，不是 $45$。")],
          [
            same(`$m\\angle ${a} = 360^\\circ$`),
            t("Dividing by $2$ halves $180^\\circ$; it does not double it.", "除以 $2$ 是把 $180^\\circ$ 减半，而不是加倍。"),
          ],
          [
            same(`$m\\angle ${a} = 178^\\circ$`),
            t("Dividing by $2$ halves $180^\\circ$; it does not subtract $2$.", "除以 $2$ 是把 $180^\\circ$ 减半，而不是减去 $2$。"),
          ],
        ],
      },
      {
        s: perp("\\ell", "t"),
        r: "defPerp",
        note: t(
          `Step 5 says that $\\angle ${a}$, an angle where $\\ell$ and $t$ cross, is a right angle.`,
          `第 5 步说明 $\\ell$ 与 $t$ 相交处的 $\\angle ${a}$ 是直角。`,
        ),
        adds: { right: [b] },
        wrong: [
          [same("$\\ell \\parallel t$"), t("$\\ell$ and $t$ cross, so they are not parallel.", "$\\ell$ 与 $t$ 相交，不平行。")],
          [same("$\\ell \\cong t$"), t("Lines are not compared by congruence here.", "这里不是比较两条直线是否全等。")],
          [same(`$\\angle ${a} \\perp \\angle ${b}$`), t("Perpendicular describes lines, not angles.", "垂直说的是直线，不是角。")],
        ],
      },
    ],
    scene,
    figure: perpendicularFigure(scene, { arrows: false }),
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
  encompasses: [{ topic: "identifying-angle-postulates", weight: 0.3 }],
  xp: 18,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "The angle theorems so far work for any measure. A right angle is the special case: lines that meet at $90^\\circ$ are **perpendicular**. This topic proves three facts about them with the same tools: corresponding angles, linear pairs, and the definition of perpendicular lines.\n\nTake $\\ell \\parallel m$ and a transversal $t$ with $\\angle 3$ a right angle.\n\n{{figure 0}}\n\n$\\angle 7$ corresponds to $\\angle 3$, so $m\\angle 7 = 90^\\circ$ and $t$ meets $m$ at a right angle too. Its linear pair partner $\\angle 8$ measures $180^\\circ - 90^\\circ = 90^\\circ$, so all four angles at $m$ are right angles: one right angle is enough to make two lines perpendicular.",
    "前面的角的定理对任何度数都成立。直角是特殊情形：相交成 $90^\\circ$ 的两条直线**互相垂直**。本课用同样的工具证明关于垂直的三个结论：同位角、邻补角和垂直的定义。\n\n设 $\\ell \\parallel m$，截线 $t$ 使 $\\angle 3$ 为直角。\n\n{{figure 0}}\n\n$\\angle 7$ 与 $\\angle 3$ 是同位角，所以 $m\\angle 7 = 90^\\circ$，$t$ 与 $m$ 也相交成直角。它的邻补角 $\\angle 8$ 为 $180^\\circ - 90^\\circ = 90^\\circ$，所以 $m$ 处的四个角都是直角：只要有一个直角，两条直线就互相垂直。",
  ),
  introFigures: [
    transversalFigure(
      90,
      0,
      {
        labels: [
          [3, "3"],
          [7, "7"],
          [8, "8"],
        ],
        arrows: true,
        right: [3, 7],
      },
      "Parallel lines ℓ and m cut by a perpendicular transversal t; angle 3 at ℓ and the corresponding angle 7 at m are marked as right angles, and angle 8 sits next to angle 7.",
      "平行线 ℓ 与 m 被垂直的截线 t 所截；ℓ 处的 ∠3 与 m 处的同位角 ∠7 标为直角，∠8 在 ∠7 旁边。",
    ),
  ],
  knowledgePoints: [
    {
      ...proofKp(
        "perpendicular-transversal-theorem",
        t("The Perpendicular Transversal Theorem", "垂直截线定理"),
        t(
          "Two lines are **perpendicular** ($\\perp$) when they meet at a right angle. **Perpendicular Transversal Theorem**: if a transversal is perpendicular to one of two parallel lines, it is perpendicular to the other.\n\nGiven $\\ell \\parallel m$ and $t \\perp \\ell$, prove $t \\perp m$:\n\n1. $\\ell \\parallel m$ — Given\n2. $t \\perp \\ell$ — Given\n3. $\\angle 1$ is a right angle — Definition of perpendicular lines\n4. $\\angle 1 \\cong \\angle 5$ — Corresponding Angles Postulate\n5. $\\angle 5$ is a right angle — Definition of congruent angles\n6. $t \\perp m$ — Definition of perpendicular lines\n\n> **Watch out.** Step 5 goes from congruent angles to equal measures, so its reason is the definition of congruent angles. The Right Angles Congruence Theorem goes the other way, from two right angles to a congruence, and does not fit here.",
          "两条直线相交成直角时**互相垂直**（$\\perp$）。**垂直截线定理**：若截线垂直于两条平行线中的一条，则它也垂直于另一条。\n\n已知 $\\ell \\parallel m$，$t \\perp \\ell$，求证 $t \\perp m$：\n\n1. $\\ell \\parallel m$ — 已知\n2. $t \\perp \\ell$ — 已知\n3. $\\angle 1$ 是直角 — 垂直的定义\n4. $\\angle 1 \\cong \\angle 5$ — 同位角公设\n5. $\\angle 5$ 是直角 — 角全等的定义\n6. $t \\perp m$ — 垂直的定义\n\n> **注意。** 第 5 步由角全等得到度数相等，理由是角全等的定义。直角相等定理方向相反，是由两个直角得出全等，这里用不上。",
        ),
        "rs",
        perpendicularTransversalProof,
      ),
      figure: angleDrawings["perpendicular-transversal-theorem"],
    },
    {
      ...proofKp(
        "lines-perpendicular-to-the-same-line",
        t("Lines perpendicular to the same line", "垂直于同一直线的两直线"),
        t(
          "**Theorem**: in a plane, two lines perpendicular to the same line are parallel.\n\nGiven $\\ell \\perp t$ and $m \\perp t$, prove $\\ell \\parallel m$:\n\n1. $\\ell \\perp t$ — Given\n2. $m \\perp t$ — Given\n3. $\\angle 2$ is a right angle — Definition of perpendicular lines\n4. $\\angle 6$ is a right angle — Definition of perpendicular lines\n5. $\\angle 2 \\cong \\angle 6$ — Right Angles Congruence Theorem\n6. $\\ell \\parallel m$ — Converse of the Corresponding Angles Postulate\n\n> **Watch out.** The last step needs the *converse*: the Corresponding Angles Postulate starts from parallel lines, and $\\ell \\parallel m$ is what is being proved. Step 5 rests on the Right Angles Congruence Theorem, since all that is known of $\\angle 2$ and $\\angle 6$ is that both are right angles.",
          "**定理**：在同一平面内，垂直于同一条直线的两条直线平行。\n\n已知 $\\ell \\perp t$，$m \\perp t$，求证 $\\ell \\parallel m$：\n\n1. $\\ell \\perp t$ — 已知\n2. $m \\perp t$ — 已知\n3. $\\angle 2$ 是直角 — 垂直的定义\n4. $\\angle 6$ 是直角 — 垂直的定义\n5. $\\angle 2 \\cong \\angle 6$ — 直角相等定理\n6. $\\ell \\parallel m$ — 同位角公设的逆命题\n\n> **注意。** 最后一步要用*逆命题*：同位角公设以两直线平行为前提，而 $\\ell \\parallel m$ 正是要证明的。第 5 步依据直角相等定理，因为关于 $\\angle 2$ 和 $\\angle 6$，已知的只是它们都是直角。",
        ),
        "rs",
        perpendicularToSameLineProof,
      ),
      figure: angleDrawings["lines-perpendicular-to-the-same-line"],
    },
    {
      ...proofKp(
        "congruent-linear-pairs",
        t("Congruent linear pairs", "全等的邻补角"),
        t(
          "**Theorem**: if two lines form a linear pair of congruent angles, the lines are perpendicular.\n\nGiven $\\angle 1 \\cong \\angle 2$, a linear pair, prove $\\ell \\perp t$:\n\n1. $\\angle 1 \\cong \\angle 2$, and they form a linear pair — Given\n2. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — Linear Pair Postulate\n3. $m\\angle 1 = m\\angle 2$ — Definition of congruent angles\n4. $2m\\angle 1 = 180^\\circ$ — Substitution Property of Equality\n5. $m\\angle 1 = 90^\\circ$ — Division Property of Equality\n6. $\\ell \\perp t$ — Definition of perpendicular lines\n\n> **Watch out.** Step 4 replaces $m\\angle 2$ by $m\\angle 1$ in the sum of step 2: that is the Substitution Property of Equality, not the Transitive Property. And step 2 needs only the linear pair, not perpendicular lines, which are the conclusion.",
          "**定理**：若两条直线形成一对全等的邻补角，则这两条直线互相垂直。\n\n已知 $\\angle 1 \\cong \\angle 2$ 且它们是邻补角，求证 $\\ell \\perp t$：\n\n1. $\\angle 1 \\cong \\angle 2$，且它们是邻补角 — 已知\n2. $m\\angle 1 + m\\angle 2 = 180^\\circ$ — 邻补角公设\n3. $m\\angle 1 = m\\angle 2$ — 角全等的定义\n4. $2m\\angle 1 = 180^\\circ$ — 等量代换\n5. $m\\angle 1 = 90^\\circ$ — 等式的除法性质\n6. $\\ell \\perp t$ — 垂直的定义\n\n> **注意。** 第 4 步在第 2 步的等式中用 $m\\angle 1$ 替换 $m\\angle 2$：这是等量代换，不是传递性。第 2 步只需要邻补角，不需要垂直，垂直是要证明的结论。",
        ),
        "rs",
        linearPairPerpendicularProof,
      ),
      figure: angleDrawings["congruent-linear-pairs"],
    },
    {
      id: "using-perpendicular-transversals",
      figure: angleDrawings["using-perpendicular-transversals"],
      title: t("Using perpendicular transversals", "运用垂直截线"),
      explanation: t(
        "By the Perpendicular Transversal Theorem, a transversal perpendicular to one of two parallel lines makes right angles with the other as well. So any angle it forms with the other line measures $90^\\circ$.\n\nIf $\\ell \\parallel m$, $t \\perp \\ell$, and an angle between $t$ and $m$ measures $(4x - 10)^\\circ$, then $4x - 10 = 90$, so $4x = 100$ and $x = 25$. Check: $4 \\cdot 25 - 10 = 90$.\n\n> **Watch out.** All four angles at $m$ are right angles, so the expression equals $90$, not $180$: no linear pair is involved. Move the constant with the right sign, too: $4x - 10 = 90$ gives $4x = 100$, not $4x = 80$.",
        "由垂直截线定理，垂直于两条平行线之一的截线与另一条直线也成直角。所以它与另一条直线形成的任何角都是 $90^\\circ$。\n\n若 $\\ell \\parallel m$，$t \\perp \\ell$，$t$ 与 $m$ 之间的一个角为 $(4x - 10)^\\circ$，则 $4x - 10 = 90$，所以 $4x = 100$，$x = 25$。检验：$4 \\cdot 25 - 10 = 90$。\n\n> **注意。** $m$ 处的四个角都是直角，所以式子等于 $90$，而不是 $180$：这里不涉及邻补角。移项时符号也要对：由 $4x - 10 = 90$ 得 $4x = 100$，而不是 $4x = 80$。",
      ),
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 30);
          const c = rng.int(2, 6);
          const d = 90 - c * x;
          if (d === 0 || Math.abs(d) > 60) continue;
          const a = rng.int(1, 4);
          const b = rng.int(5, 8);
          const phi = pickTilt(rng) + rng.pick([0, 30, -30]);
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
                `${stepLabel(1, "find the angle", "求出这个角").en} The right-angle mark says $t \\perp \\ell$, and $\\ell \\parallel m$. By the Perpendicular Transversal Theorem, $t \\perp m$ as well, so every angle $t$ forms with $m$ is a right angle, the labeled one included:${chain(`${linear(c, d)} = 90`)}${stepLabel(2, "solve for $x$", "解出 $x$").en} ${d > 0 ? "Subtract" : "Add"} $${Math.abs(d)}$ on both sides, then divide by $${c}$:${chain(`${linear(c, 0)} = ${90 - d}`, `x = ${x}`)}**Check.** With $x = ${x}$, the labeled angle measures $${valueAt(c, d, x)}$ degrees: a right angle, as $t \\perp m$ requires.\n\n{{figure 0}}`,
                `${stepLabel(1, "find the angle", "求出这个角")["zh-CN"]}直角记号说明 $t \\perp \\ell$，又 $\\ell \\parallel m$。由垂直截线定理，$t \\perp m$，所以 $t$ 与 $m$ 形成的每个角都是直角，标出的这个角也是：${chain(`${linear(c, d)} = 90`)}${stepLabel(2, "solve for $x$", "解出 $x$")["zh-CN"]}两边同时${d > 0 ? "减去" : "加上"} $${Math.abs(d)}$，再除以 $${c}$：${chain(`${linear(c, 0)} = ${90 - d}`, `x = ${x}`)}**检验。** 当 $x = ${x}$ 时，标出的角为 $${valueAt(c, d, x)}$ 度：是直角，符合 $t \\perp m$。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [
              transversalFigure(
                90,
                phi,
                { labels: [[b, "90°"]], arrows: true, right: [a, b], arcs: true },
                "Parallel lines ℓ and m cut by a transversal t, which now makes right angles with both ℓ and m; the labeled angle at m is 90°.",
                "平行线 ℓ 与 m 被截线 t 所截，t 与 ℓ、m 都成直角；m 处标出的角为 90°。",
              ),
            ],
            figure: transversalFigure(
              90,
              phi,
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
export function polygonMarks(pts: readonly XY[], names: readonly string[], accent = true, dashed = false): PlaneMark[] {
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
export function pickTriangle(rng: Rng, lo = -5, hi = 5): [XY, XY, XY] {
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
export function shift(h: number, v: number): Text {
  const en = [
    h !== 0 && `$${Math.abs(h)}$ unit${Math.abs(h) === 1 ? "" : "s"} ${h > 0 ? "right" : "left"}`,
    v !== 0 && `$${Math.abs(v)}$ unit${Math.abs(v) === 1 ? "" : "s"} ${v > 0 ? "up" : "down"}`,
  ].filter(Boolean);
  const zh = [
    h !== 0 && `向${h > 0 ? "右" : "左"} $${Math.abs(h)}$ 个单位`,
    v !== 0 && `向${v > 0 ? "上" : "下"} $${Math.abs(v)}$ 个单位`,
  ].filter(Boolean);
  return t(en.join(" and "), zh.join("，再"));
}

/** rule writes a translation rule (x, y) → (x + h, y + v). */
const translationRule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

/** plusP writes a + b, with b in parentheses when negative: "3 + (-2)". */
const plusP = (a: number, b: number) => `${a} + ${b < 0 ? `(${b})` : b}`;

/** minusP writes a - b, with b in parentheses when negative: "3 - (-2)". */
const minusP = (a: number, b: number) => `${a} - ${b < 0 ? `(${b})` : b}`;

const triangleNames = ["A", "B", "C"] as const;

export const translationsOfGeometricFigures: TopicDef = {
  id: "translations-of-geometric-figures",
  title: t("Translations of Geometric Figures", "图形的平移"),
  summary: t(
    "Translate points and figures in the coordinate plane, and find the translation that maps a point to its image.",
    "在坐标平面上平移点和图形，并求把一个点映到它的像的平移。",
  ),
  prerequisites: ["the-coordinate-plane", "subtracting-integers"],
  encompasses: [{ topic: "subtracting-integers", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4"],
  intro: t(
    "On a coordinate grid, a point is a pair of numbers, and moving it right, left, up or down changes those numbers by adding or subtracting. A **translation** does this to every point of a figure at once, by the same amounts, so the figure slides without turning or changing size. This topic finds images, rules and preimages of translations.\n\nSlide triangle $ABC$ with $A(1, 2)$, $B(1, 5)$ and $C(3, 2)$ by $3$ units right and $1$ unit down.\n\n{{figure 0}}\n\nEach vertex gains $3$ in $x$ and loses $1$ in $y$: $A'(4, 1)$, $B'(4, 4)$, $C'(6, 1)$. Side $AB$ was $5 - 2 = 3$ units long, and $A'B'$ is $4 - 1 = 3$ units long too: the image is the same triangle, only in a new place.",
    "在坐标网格上，点就是一对数，把它向右、向左、向上或向下移动，就是对这对数做加减。**平移**把图形上的每个点都按相同的量这样移动，所以图形只是滑动，不转动，也不改变大小。本课求平移的像、规则和原像。\n\n把三角形 $ABC$（$A(1, 2)$，$B(1, 5)$，$C(3, 2)$）向右平移 $3$ 个单位、向下平移 $1$ 个单位。\n\n{{figure 0}}\n\n每个顶点的 $x$ 坐标加 $3$，$y$ 坐标减 $1$：$A'(4, 1)$，$B'(4, 4)$，$C'(6, 1)$。边 $AB$ 长 $5 - 2 = 3$ 个单位，$A'B'$ 长 $4 - 1 = 3$ 个单位，也一样：像是同一个三角形，只是换了位置。",
  ),
  introFigures: [
    movedPolygon(
      triangleNames,
      [
        [1, 2],
        [1, 5],
        [3, 2],
      ],
      [
        [4, 1],
        [4, 4],
        [6, 1],
      ],
      { kind: "slide" },
      0,
    ),
  ],
  knowledgePoints: [
    {
      id: "translating-a-point",
      figure: motionDrawings["translating-a-point"],
      title: t("Translating a point", "平移一个点"),
      explanation: t(
        "A **transformation** moves every point of the plane to a new position, its **image**; the original point is the **preimage**. The image of $P$ is written $P'$ (\"$P$ prime\").\n\nA **translation** slides every point the same distance in the same direction. Moving right adds to the $x$-coordinate, left subtracts; moving up adds to the $y$-coordinate, down subtracts.\n\nTranslating $P(2, -1)$ $4$ units left and $3$ units up gives $P'(2 - 4, -1 + 3) = P'(-2, 2)$.\n\n> **Watch out.** A move left or right changes only $x$, a move up or down only $y$: do not add the vertical move to $x$. And left and down subtract: moving $4$ units left from $x = 2$ gives $-2$, not $6$.",
        "**变换**把平面上的每个点移到一个新位置，叫做它的**像**；原来的点叫**原像**。点 $P$ 的像记作 $P'$。\n\n**平移**把每个点沿同一方向移动相同的距离。向右移动加在 $x$ 坐标上，向左则减；向上移动加在 $y$ 坐标上，向下则减。\n\n把 $P(2, -1)$ 向左平移 $4$ 个单位、再向上平移 $3$ 个单位，得到 $P'(2 - 4, -1 + 3) = P'(-2, 2)$。\n\n> **注意。** 左右移动只改变 $x$，上下移动只改变 $y$：不要把上下移动加到 $x$ 上。向左、向下要减：从 $x = 2$ 向左移 $4$ 个单位得 $-2$，不是 $6$。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const name = rng.pick(["P", "A", "Q", "M"]);
        const d = shift(h, v);
        const back = shift(-h, -v);
        return {
          ...pointProblem({
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
              `${stepLabel(1, "move across", "左右移动").en} Moving ${shift(h, 0).en} ${h > 0 ? "adds" : "subtracts"} $${Math.abs(h)}$ ${h > 0 ? "to" : "from"} the $x$-coordinate:${steps(`x' = ${plusP(x, h)} = ${x + h}`)}${stepLabel(2, "move up or down", "上下移动").en} Moving ${shift(0, v).en} ${v > 0 ? "adds" : "subtracts"} $${Math.abs(v)}$ ${v > 0 ? "to" : "from"} the $y$-coordinate:${steps(`y' = ${plusP(y, v)} = ${y + v}`)}So $${name}' = ${pl([x + h, y + v])}$.\n\n**Check.** Slide $${name}'$ back ${back.en}: $(${plusP(x + h, -h)}, ${plusP(y + v, -v)}) = ${pl([x, y])}$, which is $${name}$ again.\n\n{{figure 0}}`,
              `${stepLabel(1, "move across", "左右移动")["zh-CN"]}${shift(h, 0)["zh-CN"]}，$x$ 坐标${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$：${steps(`x' = ${plusP(x, h)} = ${x + h}`)}${stepLabel(2, "move up or down", "上下移动")["zh-CN"]}${shift(0, v)["zh-CN"]}，$y$ 坐标${v > 0 ? "加上" : "减去"} $${Math.abs(v)}$：${steps(`y' = ${plusP(y, v)} = ${y + v}`)}所以 $${name}' = ${pl([x + h, y + v])}$。\n\n**检验。** 把 $${name}'$ ${back["zh-CN"]}移回去：$(${plusP(x + h, -h)}, ${plusP(y + v, -v)}) = ${pl([x, y])}$，正是 $${name}$。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint(name, [x, y], [x + h, y + v], { kind: "slide" })],
        };
      },
    },
    {
      id: "translation-rules",
      figure: motionDrawings["translation-rules"],
      title: t("Translation rules", "平移的规则"),
      explanation: t(
        "A translation can be written as a **rule** that tells what happens to any point $(x, y)$. The translation $4$ units left and $2$ units up is\n\n$$(x, y) \\to (x - 4, y + 2).$$\n\nA translation moves a whole figure: each vertex moves by the rule, and the image figure has the same size and shape. Under this rule, the vertex $B(1, -3)$ of a triangle goes to $B'(1 - 4, -3 + 2) = B'(-3, -1)$.\n\n> **Watch out.** The rule says what to *do* to the coordinates; $(-4, 2)$ is the move, not the image. Put the vertex's own coordinates in for $x$ and $y$, and keep each change with its own coordinate.",
        "平移可以写成一条**规则**，说明任意点 $(x, y)$ 怎样变化。向左平移 $4$ 个单位、向上平移 $2$ 个单位的平移是\n\n$$(x, y) \\to (x - 4, y + 2)$$\n\n平移会移动整个图形：每个顶点都按规则移动，像与原图形大小、形状都相同。按这条规则，三角形的顶点 $B(1, -3)$ 移到 $B'(1 - 4, -3 + 2) = B'(-3, -1)$。\n\n> **注意。** 规则说明的是对坐标*怎么做*；$(-4, 2)$ 是移动量，不是像。要把顶点自己的坐标代入 $x$ 和 $y$，并且每个变化只作用在它自己的坐标上。",
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
                `${stepLabel(1, "read the vertex", "读出顶点").en} From the figure, $${name} = ${pl([x, y])}$.\n\n${stepLabel(2, "apply the rule", "应用规则").en} Put $x = ${x}$ and $y = ${y}$ into $${translationRule(h, v)}$:${steps(`${name}' = (${plusP(x, h)}, ${plusP(y, v)}) = ${pl([x + h, y + v])}`)}**Check.** Undo the rule, $(x, y) \\to (${linear(1, -h)}, ${linear(1, -v, "y")})$: $(${plusP(x + h, -h)}, ${plusP(y + v, -v)}) = ${pl([x, y])}$, which is $${name}$ again.\n\n{{figure 0}}`,
                `${stepLabel(1, "read the vertex", "读出顶点")["zh-CN"]}由图，$${name} = ${pl([x, y])}$。\n\n${stepLabel(2, "apply the rule", "应用规则")["zh-CN"]}把 $x = ${x}$，$y = ${y}$ 代入 $${translationRule(h, v)}$：${steps(`${name}' = (${plusP(x, h)}, ${plusP(y, v)}) = ${pl([x + h, y + v])}`)}**检验。** 用相反的规则 $(x, y) \\to (${linear(1, -h)}, ${linear(1, -v, "y")})$ 还原：$(${plusP(x + h, -h)}, ${plusP(y + v, -v)}) = ${pl([x, y])}$，正是 $${name}$。\n\n{{figure 0}}`,
              ),
            }),
            figure: graph(polygonMarks(tri, triangleNames), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
            solutionFigures: [
              movedPolygon(
                triangleNames,
                tri,
                tri.map(([a, b]): XY => [a + h, b + v]),
                { kind: "slide" },
                i,
              ),
            ],
          };
        }
      },
    },
    {
      id: "finding-a-translation",
      figure: motionDrawings["finding-a-translation"],
      title: t("Finding the translation", "求平移"),
      explanation: t(
        "To find the translation that maps $P$ to $P'$, subtract the coordinates of the preimage from those of the image: the rule is $(x, y) \\to (x + a, y + b)$ with\n\n$$a = x_{P'} - x_P, \\quad b = y_{P'} - y_P.$$\n\nIf $P(3, -2)$ maps to $P'(-1, 4)$, then $a = -1 - 3 = -4$ and $b = 4 - (-2) = 6$: the translation moves $4$ units left and $6$ units up.\n\n> **Watch out.** Subtract in the order image minus preimage: $3 - (-1) = 4$ would point the move the wrong way. And $(a, b)$ is the move, not the image: $(-1, 4)$ is where $P$ lands, not how far it goes.",
        "要求把 $P$ 映到 $P'$ 的平移，用像的坐标减去原像的坐标：规则是 $(x, y) \\to (x + a, y + b)$，其中\n\n$$a = x_{P'} - x_P, \\quad b = y_{P'} - y_P$$\n\n若 $P(3, -2)$ 映到 $P'(-1, 4)$，则 $a = -1 - 3 = -4$，$b = 4 - (-2) = 6$：平移是向左 $4$ 个单位、向上 $6$ 个单位。\n\n> **注意。** 要按“像减原像”的顺序相减：$3 - (-1) = 4$ 会把方向弄反。$(a, b)$ 是移动量，不是像：$(-1, 4)$ 是 $P$ 落到的位置，不是它移动了多远。",
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
                `${stepLabel(1, "read the points", "读出两点").en} From the figure, $P = ${pl([x, y])}$ and $P' = ${pl([x + a, y + b])}$.\n\n${stepLabel(2, "subtract", "相减").en} Each change is the image's coordinate minus the preimage's:${steps(`a = ${minusP(x + a, x)} = ${a}`, `b = ${minusP(y + b, y)} = ${b}`)}The translation moves ${shift(a, b).en}.\n\n**Check.** Apply the move to $P$: $(${plusP(x, a)}, ${plusP(y, b)}) = ${pl([x + a, y + b])}$, which is $P'$.\n\n{{figure 0}}`,
                `${stepLabel(1, "read the points", "读出两点")["zh-CN"]}由图，$P = ${pl([x, y])}$，$P' = ${pl([x + a, y + b])}$。\n\n${stepLabel(2, "subtract", "相减")["zh-CN"]}每个变化量都是像的坐标减去原像的坐标：${steps(`a = ${minusP(x + a, x)} = ${a}`, `b = ${minusP(y + b, y)} = ${b}`)}这个平移是${shift(a, b)["zh-CN"]}。\n\n**检验。** 对 $P$ 做这个移动：$(${plusP(x, a)}, ${plusP(y, b)}) = ${pl([x + a, y + b])}$，正是 $P'$。\n\n{{figure 0}}`,
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
            solutionFigures: [movedPoint("P", [x, y], [x + a, y + b], { kind: "slide" })],
          };
        }
      },
    },
    {
      id: "finding-the-preimage",
      figure: motionDrawings["finding-the-preimage"],
      title: t("Finding the preimage", "求原像"),
      explanation: t(
        "To undo a translation, apply the opposite translation. If $(x, y) \\to (x + 3, y - 5)$ maps $P$ to $P'(1, 2)$, then $P$ is found by subtracting $3$ and adding $5$:\n\n$$P = (1 - 3, 2 + 5) = (-2, 7).$$\n\nCheck: $(-2 + 3, 7 - 5) = (1, 2)$.\n\n> **Watch out.** $P'$ is the image, so applying the rule to it again moves twice as far, to $(4, -3)$. Go back the opposite way, and change each coordinate by its own number.",
        "要还原一次平移，就做相反的平移。若 $(x, y) \\to (x + 3, y - 5)$ 把 $P$ 映到 $P'(1, 2)$，则把坐标减去 $3$、加上 $5$ 得到 $P$：\n\n$$P = (1 - 3, 2 + 5) = (-2, 7)$$\n\n检验：$(-2 + 3, 7 - 5) = (1, 2)$。\n\n> **注意。** $P'$ 是像，对它再用一次规则，就又移动了一次，到了 $(4, -3)$。要朝相反方向移回去，并且每个坐标只按它自己的数改变。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const [px, py] = [x + h, y + v];
        return {
          ...pointProblem({
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
              `${stepLabel(1, "reverse the rule", "反转规则").en} The rule moves ${shift(h, v).en}, so the way back moves ${shift(-h, -v).en}: $(x, y) \\to (${linear(1, -h)}, ${linear(1, -v, "y")})$.\n\n${stepLabel(2, "apply it to the image", "作用在像上").en} Start from $P'${pl([px, py])}$:${steps(`P = (${minusP(px, h)}, ${minusP(py, v)}) = ${pl([x, y])}`)}**Check.** Apply the original rule to $P$: $(${plusP(x, h)}, ${plusP(y, v)}) = ${pl([px, py])}$, which is $P'$.\n\n{{figure 0}}`,
              `${stepLabel(1, "reverse the rule", "反转规则")["zh-CN"]}原规则是${shift(h, v)["zh-CN"]}，移回去就是${shift(-h, -v)["zh-CN"]}：$(x, y) \\to (${linear(1, -h)}, ${linear(1, -v, "y")})$。\n\n${stepLabel(2, "apply it to the image", "作用在像上")["zh-CN"]}从 $P'${pl([px, py])}$ 出发：${steps(`P = (${minusP(px, h)}, ${minusP(py, v)}) = ${pl([x, y])}`)}**检验。** 对 $P$ 用原来的规则：$(${plusP(x, h)}, ${plusP(y, v)}) = ${pl([px, py])}$，正是 $P'$。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("P", [x, y], [px, py], { kind: "slide" })],
        };
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

/** neg writes the opposite of a substituted coordinate: "-5" for 5, "-(-5)" for -5. */
const neg = (n: number) => (n < 0 ? `-(${n})` : `-${n}`);

/** ruleApplied writes the rule of q quarter turns (1 to 3) applied to p: the coordinates substituted, then simplified when that differs. */
const ruleApplied = (p: XY, q: number) => {
  const [x, y] = p;
  const put = [`(${neg(y)}, ${x})`, `(${neg(x)}, ${neg(y)})`, `(${y}, ${neg(x)})`][q - 1]!;
  const image = pl(rotQ(p, q));
  return put === image ? image : `${put} = ${image}`;
};

/** undoCheck checks a rotation of q quarter turns about the origin by turning the image back onto the point. */
const undoCheck = (name: string, p: XY, image: XY, q: number) =>
  t(
    `**Check.** Turn $${name}'$ back the other way, by $${rotationRules[3 - q]}$: $${ruleApplied(image, 4 - q)}$, which is $${name} = ${pl(p)}$ again.`,
    `**检验。** 把 $${name}'$ 按相反方向转回去，用 $${rotationRules[3 - q]}$：$${ruleApplied(image, 4 - q)}$，正是 $${name} = ${pl(p)}$。`,
  );

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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4", "CCSS.HSG.CO.A.5"],
  intro: t(
    'Angles measure turning, and the coordinate plane locates points. A **rotation** puts the two together: it turns every point of a figure through the same angle about one fixed point, so the figure keeps its size and shape and only changes direction. This topic finds the images of quarter, half and three-quarter turns.\n\nTurn $Q(3, 2)$ a quarter turn counterclockwise about the origin $O$.\n\n{{figure 0}}\n\nTo reach $Q$ from $O$, go $3$ right and $2$ up. Turn that path a quarter turn and "$3$ right" becomes "$3$ up", while "$2$ up" becomes "$2$ left". So $Q\'$ is $2$ left and $3$ up: $Q\'(-2, 3)$. Both $Q$ and $Q\'$ lie $\\sqrt{3^2 + 2^2} = \\sqrt{13}$ from $O$.',
    "角度刻画转动，坐标平面确定点的位置。**旋转**把两者结合起来：它把图形的每个点都绕一个固定点转过同一个角度，所以图形大小、形状不变，只是方向变了。本课求转四分之一圈、半圈和四分之三圈后的像。\n\n把 $Q(3, 2)$ 绕原点 $O$ 逆时针转四分之一圈。\n\n{{figure 0}}\n\n从 $O$ 到 $Q$：向右 $3$，向上 $2$。把这条路线转四分之一圈，“向右 $3$”变成“向上 $3$”，“向上 $2$”变成“向左 $2$”。所以 $Q'$ 在向左 $2$、向上 $3$ 处：$Q'(-2, 3)$。$Q$ 与 $Q'$ 到 $O$ 的距离都是 $\\sqrt{3^2 + 2^2} = \\sqrt{13}$。",
  ),
  introFigures: [movedPoint("Q", [3, 2], [-2, 3], { kind: "turn", degrees: 90 })],
  knowledgePoints: [
    {
      id: "quarter-turns",
      figure: motionDrawings["quarter-turns"],
      title: t("Rotating by 90°", "旋转 90°"),
      explanation: cat(
        t(
          "A **rotation** turns every point through the same angle about a fixed point, the **center of rotation**; each point keeps its distance from the center. Unless stated otherwise, rotations are counterclockwise.\n\nAbout the origin, a quarter turn swaps the coordinates and changes one sign:\n\n",
          "**旋转**把每个点绕一个固定点（**旋转中心**）转过同一个角度，每个点到中心的距离不变。如无特别说明，旋转都按逆时针方向。\n\n绕原点转四分之一圈时，两个坐标交换位置，并改变一个符号：\n\n",
        ),
        rotationRuleText,
        t(
          "\n\nRotating $P(4, 1)$ by $90^\\circ$ counterclockwise gives $P'(-1, 4)$; rotating it $90^\\circ$ clockwise gives $P'(1, -4)$.\n\n> **Watch out.** Swapping the coordinates without changing a sign, $(4, 1) \\to (1, 4)$, is a reflection across $y = x$, not a turn. And the sign that changes tells the direction: counterclockwise negates the new first coordinate, clockwise the new second.",
          "\n\n把 $P(4, 1)$ 逆时针旋转 $90^\\circ$ 得 $P'(-1, 4)$；顺时针旋转 $90^\\circ$ 得 $P'(1, -4)$。\n\n> **注意。** 只交换坐标而不变号，$(4, 1) \\to (1, 4)$，是关于 $y = x$ 的翻折，不是旋转。变号的位置决定方向：逆时针时新的第一个坐标变号，顺时针时新的第二个坐标变号。",
        ),
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const cw = rng.bool();
        const q: Quarter = cw ? 3 : 1;
        const image = rotQ(p, q);
        const dir = cw ? t("clockwise", "顺时针") : t("counterclockwise", "逆时针");
        return {
          ...pointProblem({
            prompt: t(
              `Rotate $P${pl(p)}$ by $90^\\circ$ ${cw ? "clockwise" : "counterclockwise"} about the origin. Find $P'$.`,
              `把 $P${pl(p)}$ 绕原点${cw ? "顺时针" : "逆时针"}旋转 $90^\\circ$。求 $P'$。`,
            ),
            answer: image,
            wrong: [rotQ(p, 4 - q), rotQ(p, 2), [p[1], p[0]], [-p[0], p[1]]],
            solution: t(
              `${stepLabel(1, "choose the rule", "选出规则").en} A $90^\\circ$ ${dir.en} rotation about the origin follows $${rotationRules[q - 1]}$: swap the coordinates, then change the sign of the ${cw ? "second" : "first"}.\n\n${stepLabel(2, "apply it", "代入").en} With $x = ${p[0]}$ and $y = ${p[1]}$:${steps(`P' = ${ruleApplied(p, q)}`)}${undoCheck("P", p, image, q).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the rule", "选出规则")["zh-CN"]}绕原点${dir["zh-CN"]}旋转 $90^\\circ$ 的规则是 $${rotationRules[q - 1]}$：交换坐标，再把${cw ? "第二个" : "第一个"}坐标变号。\n\n${stepLabel(2, "apply it", "代入")["zh-CN"]}把 $x = ${p[0]}$，$y = ${p[1]}$ 代入：${steps(`P' = ${ruleApplied(p, q)}`)}${undoCheck("P", p, image, q)["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          figure: graph(
            [{ kind: "point", at: p, label: "P", dir: "n", accent: true }],
            "A point P on a coordinate grid.",
            "坐标网格上的点 P。",
          ),
          solutionFigures: [movedPoint("P", p, image, { kind: "turn", degrees: cw ? -90 : 90 })],
        };
      },
    },
    {
      id: "half-and-three-quarter-turns",
      figure: motionDrawings["half-and-three-quarter-turns"],
      title: t("Rotating by 180° and 270°", "旋转 180° 与 270°"),
      explanation: t(
        "A $180^\\circ$ rotation about the origin changes both signs: $(x, y) \\to (-x, -y)$. It is the same clockwise or counterclockwise.\n\nA $270^\\circ$ counterclockwise rotation is the same as a $90^\\circ$ clockwise one: $(x, y) \\to (y, -x)$. Likewise $270^\\circ$ clockwise is $90^\\circ$ counterclockwise.\n\nRotating $(-3, 5)$ by $180^\\circ$ gives $(3, -5)$; by $270^\\circ$ counterclockwise, $(5, 3)$.\n\n> **Watch out.** Three quarter turns one way end where one quarter turn the other way does, so $270^\\circ$ counterclockwise uses the *clockwise* rule $(x, y) \\to (y, -x)$, not $(-y, x)$. A half turn swaps nothing: both coordinates keep their places and change sign.",
        "绕原点旋转 $180^\\circ$ 时两个坐标都变号：$(x, y) \\to (-x, -y)$，顺时针、逆时针结果相同。\n\n逆时针旋转 $270^\\circ$ 等于顺时针旋转 $90^\\circ$：$(x, y) \\to (y, -x)$。同样，顺时针 $270^\\circ$ 等于逆时针 $90^\\circ$。\n\n把 $(-3, 5)$ 旋转 $180^\\circ$ 得 $(3, -5)$；逆时针旋转 $270^\\circ$ 得 $(5, 3)$。\n\n> **注意。** 向一个方向转四分之三圈，与向另一个方向转四分之一圈停在同一处，所以逆时针 $270^\\circ$ 用的是*顺时针* $90^\\circ$ 的规则 $(x, y) \\to (y, -x)$，而不是 $(-y, x)$。转半圈不交换坐标：两个坐标位置不变，都变号。",
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
          t(", the same as $90^\\circ$ clockwise,", "，相当于顺时针 $90^\\circ$"),
          t(", the same as $90^\\circ$ counterclockwise,", "，相当于逆时针 $90^\\circ$"),
        ][kind]!;
        return {
          ...pointProblem({
            prompt: t(
              `Rotate $${pl(p)}$ by ${name.en} about the origin. Find the image.`,
              `把 $${pl(p)}$ 绕原点旋转${name["zh-CN"]}。求像的坐标。`,
            ),
            answer: image,
            wrong: [rotQ(p, 4 - q), rotQ(p, q + 2), [-p[0], p[1]]],
            solution: t(
              `${stepLabel(1, "choose the rule", "选出规则").en} A rotation of ${name.en}${same90.en} follows $${rotationRules[q - 1]}$.\n\n${stepLabel(2, "apply it", "代入").en} Call the point $P$ and its image $P'$. With $x = ${p[0]}$ and $y = ${p[1]}$:${steps(`P' = ${ruleApplied(p, q)}`)}${undoCheck("P", p, image, q).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the rule", "选出规则")["zh-CN"]}旋转${name["zh-CN"]}${same90["zh-CN"]}，规则是 $${rotationRules[q - 1]}$。\n\n${stepLabel(2, "apply it", "代入")["zh-CN"]}把这个点记作 $P$，它的像记作 $P'$。把 $x = ${p[0]}$，$y = ${p[1]}$ 代入：${steps(`P' = ${ruleApplied(p, q)}`)}${undoCheck("P", p, image, q)["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("P", p, image, { kind: "turn", degrees: [180, 270, -270][kind]! })],
        };
      },
    },
    {
      id: "identifying-a-rotation",
      figure: motionDrawings["identifying-a-rotation"],
      title: t("Identifying a rotation", "判断旋转"),
      explanation: t(
        "To tell which rotation about the origin maps $P$ to $P'$, compare the coordinates with the three rules: a $180^\\circ$ rotation changes both signs; a $90^\\circ$ rotation swaps the coordinates and changes one sign.\n\n$P(2, 5) \\to P'(-5, 2)$ follows $(x, y) \\to (-y, x)$, a $90^\\circ$ counterclockwise rotation. $P(2, 5) \\to P'(5, -2)$ follows $(x, y) \\to (y, -x)$, a $90^\\circ$ clockwise rotation.\n\n> **Watch out.** Seeing that the coordinates swapped is not enough: both quarter turns swap them. Look at *which* coordinate changed sign, or test the rule on $P$ and see whether it lands on $P'$.",
        "要判断绕原点的哪种旋转把 $P$ 映到 $P'$，把坐标与三条规则对比：旋转 $180^\\circ$ 两个坐标都变号；旋转 $90^\\circ$ 交换坐标并改变一个符号。\n\n$P(2, 5) \\to P'(-5, 2)$ 符合 $(x, y) \\to (-y, x)$，是逆时针旋转 $90^\\circ$。$P(2, 5) \\to P'(5, -2)$ 符合 $(x, y) \\to (y, -x)$，是顺时针旋转 $90^\\circ$。\n\n> **注意。** 只看出坐标交换了还不够：两种四分之一圈都会交换坐标。要看*哪一个*坐标变了号，或者把规则用在 $P$ 上，看是否得到 $P'$。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 2);
        const qs = [1, 2, 3] as const;
        const image = rotQ(p, qs[k]!);
        const options = [rotationName(1), rotationName(2), rotationName(1, true)];
        const swapped = k !== 1;
        const compare = swapped
          ? t(
              `$P'$ has $${image[0]}$ first and $${image[1]}$ second: the coordinates of $P$ swapped places, so this is a quarter turn. The sign changed on the ${k === 0 ? "first" : "second"} coordinate, which matches $${rotationRules[k]}$.`,
              `$P'$ 的第一个坐标是 $${image[0]}$，第二个是 $${image[1]}$：$P$ 的坐标交换了位置，所以是转四分之一圈。变号的是${k === 0 ? "第一个" : "第二个"}坐标，符合 $${rotationRules[k]}$。`,
            )
          : t(
              `$P'$ has the coordinates of $P$ in the same places, each with its sign changed, which matches $${rotationRules[1]}$.`,
              `$P'$ 的坐标与 $P$ 的位置相同，只是都变了号，符合 $${rotationRules[1]}$。`,
            );
        const lands = (j: number) => pl(rotQ(p, qs[j]!));
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `A rotation about the origin maps $P${pl(p)}$ to $P'${pl(image)}$. Which rotation is it?`,
                `绕原点的一次旋转把 $P${pl(p)}$ 映到 $P'${pl(image)}$。这是哪种旋转？`,
              ),
              options,
              correct: k,
              solution: t(
                `${stepLabel(1, "compare the coordinates", "比较坐标").en} ${compare.en}\n\n${stepLabel(2, "name the rotation", "说出旋转").en} The rule $${rotationRules[k]}$ is a rotation of ${options[k]!.en}.\n\n**Check.** Apply the rule to $P$: $${ruleApplied(p, qs[k]!)}$, which is $P'$.\n\n{{figure 0}}`,
                `${stepLabel(1, "compare the coordinates", "比较坐标")["zh-CN"]}${compare["zh-CN"]}\n\n${stepLabel(2, "name the rotation", "说出旋转")["zh-CN"]}规则 $${rotationRules[k]}$ 是${options[k]!["zh-CN"]}的旋转。\n\n**检验。** 把规则用在 $P$ 上：$${ruleApplied(p, qs[k]!)}$，正是 $P'$。\n\n{{figure 0}}`,
              ),
            }),
            [0, 1, 2].map((j) => [
              options[j]!.en,
              `that rotation follows $${rotationRules[j]}$ and sends $P$ to $${lands(j)}$, not to $P'$.`,
              `这种旋转的规则是 $${rotationRules[j]}$，它把 $P$ 送到 $${lands(j)}$，而不是 $P'$。`,
            ]),
          ),
          figure: graph(
            [
              { kind: "point", at: [0, 0], dir: "sw" },
              { kind: "point", at: p, label: "P", dir: "n" },
              { kind: "point", at: image, label: "P′", dir: "n", accent: true },
            ],
            "A point P and its image P′ under a rotation about the origin.",
            "点 P 和它绕原点旋转后的像 P′。",
          ),
          solutionFigures: [movedPoint("P", p, image, { kind: "turn", degrees: [90, 180, -90][k]! })],
        };
      },
    },
    {
      id: "rotating-about-another-center",
      figure: motionDrawings["rotating-about-another-center"],
      title: t("Rotating about another center", "绕其他点旋转"),
      explanation: t(
        "To rotate $P$ about a center $C$ other than the origin:\n\n1. Find how $P$ sits relative to $C$: subtract, $(x_P - x_C, y_P - y_C)$.\n2. Rotate that offset with the rule for the origin.\n3. Add $C$ back.\n\nRotating $P(5, 3)$ by $90^\\circ$ counterclockwise about $C(2, 1)$: the offset is $(3, 2)$, it rotates to $(-2, 3)$, and adding $C$ gives $P'(0, 4)$.\n\n> **Watch out.** The rules for the origin work only on the offset from $C$: rotating $P(5, 3)$ itself gives $(-3, 5)$, a turn about the wrong center. And the rotated offset $(-2, 3)$ is not yet the answer: add $C$ back.",
        "要把 $P$ 绕不是原点的中心 $C$ 旋转：\n\n1. 求 $P$ 相对于 $C$ 的位置：相减得 $(x_P - x_C, y_P - y_C)$。\n2. 用绕原点旋转的规则旋转这个差。\n3. 再加回 $C$。\n\n把 $P(5, 3)$ 绕 $C(2, 1)$ 逆时针旋转 $90^\\circ$：差是 $(3, 2)$，旋转后为 $(-2, 3)$，加上 $C$ 得 $P'(0, 4)$。\n\n> **注意。** 绕原点的规则只能用在相对于 $C$ 的差上：直接旋转 $P(5, 3)$ 得 $(-3, 5)$，那是绕错了中心。旋转后的差 $(-2, 3)$ 也还不是答案：要加回 $C$。",
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
          const back = rotQ(r, 4 - q);
          return {
            ...pointProblem({
              prompt: t(
                `Rotate $P${pl(p)}$ by ${name.en} about $C${pl(c)}$. Find $P'$.`,
                `把 $P${pl(p)}$ 绕 $C${pl(c)}$ 旋转${name["zh-CN"]}。求 $P'$。`,
              ),
              answer: image,
              wrong: [rotQ(p, q), r, [c[0] + rotQ(off, 4 - q)[0], c[1] + rotQ(off, 4 - q)[1]]],
              solution: t(
                `${stepLabel(1, "find the offset", "求出差").en} Subtract $C$ from $P$:${steps(`(${minusP(p[0], c[0])}, ${minusP(p[1], c[1])}) = ${pl(off)}`)}${stepLabel(2, "rotate the offset", "旋转这个差").en} Use $${rotationRules[q - 1]}$:${steps(`${ruleApplied(off, q)}`)}${stepLabel(3, "add the center back", "加回中心").en} Add $C$ to the rotated offset:${steps(`P' = (${plusP(c[0], r[0])}, ${plusP(c[1], r[1])}) = ${pl(image)}`)}**Check.** Map $P'$ back. Its offset from $C$ is $${pl(r)}$; turning it back with $${rotationRules[3 - q]}$ gives $${pl(back)}$, and $(${plusP(c[0], back[0])}, ${plusP(c[1], back[1])}) = ${pl(p)}$, which is $P$.\n\n{{figure 0}}`,
                `${stepLabel(1, "find the offset", "求出差")["zh-CN"]}用 $P$ 减去 $C$：${steps(`(${minusP(p[0], c[0])}, ${minusP(p[1], c[1])}) = ${pl(off)}`)}${stepLabel(2, "rotate the offset", "旋转这个差")["zh-CN"]}用规则 $${rotationRules[q - 1]}$：${steps(`${ruleApplied(off, q)}`)}${stepLabel(3, "add the center back", "加回中心")["zh-CN"]}把旋转后的差加上 $C$：${steps(`P' = (${plusP(c[0], r[0])}, ${plusP(c[1], r[1])}) = ${pl(image)}`)}**检验。** 把 $P'$ 转回去。它相对于 $C$ 的差是 $${pl(r)}$；用 $${rotationRules[3 - q]}$ 转回得 $${pl(back)}$，而 $(${plusP(c[0], back[0])}, ${plusP(c[1], back[1])}) = ${pl(p)}$，正是 $P$。\n\n{{figure 0}}`,
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
            solutionFigures: [movedPoint("P", p, image, { kind: "turn", degrees: [90, 180, -90][kind]!, center: c, centerName: "C" })],
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
  intro: t(
    "A function takes an input and gives one output. A rotation about the origin does the same with points: the input is a point, the output its image. Writing rotations as functions, $R_{90^\\circ}(x, y) = (-y, x)$, lets us chain them one after another and undo them, just as with other functions.\n\nTake $A(1, 3)$.\n\n{{figure 0}}\n\n$R_{90^\\circ}(1, 3) = (-3, 1)$. Feeding that output back in, $R_{90^\\circ}(-3, 1) = (-1, -3)$: two quarter turns make a half turn, and indeed $R_{180^\\circ}(1, 3) = (-1, -3)$. Turning back, $R_{-90^\\circ}(-3, 1) = (1, 3)$ undoes the first turn and returns $A$.",
    "函数接受一个输入，给出一个输出。绕原点的旋转对点也是这样：输入一个点，输出它的像。把旋转写成函数，例如 $R_{90^\\circ}(x, y) = (-y, x)$，就能像对待其他函数一样，把旋转一个接一个地复合，也能把它还原。\n\n取 $A(1, 3)$。\n\n{{figure 0}}\n\n$R_{90^\\circ}(1, 3) = (-3, 1)$。把这个输出再输入一次，$R_{90^\\circ}(-3, 1) = (-1, -3)$：两次四分之一圈就是半圈，确实 $R_{180^\\circ}(1, 3) = (-1, -3)$。转回去，$R_{-90^\\circ}(-3, 1) = (1, 3)$ 把第一次旋转还原，回到 $A$。",
  ),
  introFigures: [movedPoint("A", [1, 3], [-3, 1], { kind: "turn", degrees: 90 })],
  knowledgePoints: [
    {
      id: "choosing-a-rotation-rule",
      figure: geometryDrawings2["rotation-rules-in-the-coordinate-plane#choosing-a-rotation-rule"],
      title: t("Rotations as functions", "把旋转看成函数"),
      explanation: t(
        "A transformation is a function: its input is a point and its output is the image. We write $R_{\\theta}$ for the rotation by $\\theta$ about the origin, counterclockwise when $\\theta > 0$ and clockwise when $\\theta < 0$:\n\n- $R_{90^\\circ}(x, y) = (-y, x)$\n- $R_{180^\\circ}(x, y) = (-x, -y)$\n- $R_{-90^\\circ}(x, y) = (y, -x)$\n\nTo find the rule from one point and its image, check which formula sends that point to that image.\n\n> **Watch out.** $(x, y) \\to (y, x)$ swaps the coordinates too, but changes no sign: it is a reflection across $y = x$, not a rotation. Substitute the point into a rule before choosing it.",
        "变换就是函数：输入一个点，输出它的像。用 $R_{\\theta}$ 表示绕原点旋转 $\\theta$，$\\theta > 0$ 为逆时针，$\\theta < 0$ 为顺时针：\n\n- $R_{90^\\circ}(x, y) = (-y, x)$\n- $R_{180^\\circ}(x, y) = (-x, -y)$\n- $R_{-90^\\circ}(x, y) = (y, -x)$\n\n要由一个点和它的像找出规则，就检验哪个公式把这个点送到这个像。\n\n> **注意。** $(x, y) \\to (y, x)$ 也交换坐标，但不变号：它是关于 $y = x$ 的翻折，不是旋转。选规则之前，先把点代进去试一试。",
      ),
      generate(rng) {
        const p = pickPoint(rng, 9);
        const k = rng.int(0, 2);
        const qs = [1, 3, 2] as const;
        const image = rotQ(p, qs[k]!);
        const swapped = k !== 2;
        const sends = (j: number) => (j === 3 ? pl([p[1], p[0]]) : pl(rotQ(p, qs[j]!)));
        const compare = swapped
          ? t(
              `The coordinates of $${pl(p)}$ trade places in $${pl(image)}$, and the ${k === 0 ? "first" : "second"} one changes sign: a quarter turn, ${k === 0 ? "counterclockwise" : "clockwise"}.`,
              `$${pl(p)}$ 的两个坐标在 $${pl(image)}$ 中交换了位置，并且${k === 0 ? "第一个" : "第二个"}坐标变号：是${k === 0 ? "逆时针" : "顺时针"}转四分之一圈。`,
            )
          : t(
              `The coordinates of $${pl(p)}$ stay in place in $${pl(image)}$ and both change sign: a half turn.`,
              `$${pl(p)}$ 的坐标在 $${pl(image)}$ 中位置不变，两个都变号：是转半圈。`,
            );
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `A rotation about the origin maps $${pl(p)}$ to $${pl(image)}$. Which rule describes it?`,
                `绕原点的一次旋转把 $${pl(p)}$ 映到 $${pl(image)}$。哪条规则描述了这次旋转？`,
              ),
              options: ruleOptions.map((r) => same(`$${r}$`)),
              correct: k,
              solution: t(
                `${stepLabel(1, "compare the coordinates", "比较坐标").en} ${compare.en}\n\n${stepLabel(2, "test the rule", "检验规则").en} That is the rule $${ruleOptions[k]}$. Substitute $x = ${p[0]}$ and $y = ${p[1]}$:${steps(ruleApplied(p, qs[k]!))}**Check.** The output is $${pl(image)}$, the image given. The rule $(x, y) \\to (y, x)$ is a reflection, not a rotation, and the other two rotations send the point elsewhere.\n\n{{figure 0}}`,
                `${stepLabel(1, "compare the coordinates", "比较坐标")["zh-CN"]}${compare["zh-CN"]}\n\n${stepLabel(2, "test the rule", "检验规则")["zh-CN"]}这就是规则 $${ruleOptions[k]}$。代入 $x = ${p[0]}$，$y = ${p[1]}$：${steps(ruleApplied(p, qs[k]!))}**检验。** 输出是 $${pl(image)}$，正是给出的像。规则 $(x, y) \\to (y, x)$ 是翻折，不是旋转；另外两种旋转把这个点送到别处。\n\n{{figure 0}}`,
              ),
            }),
            [0, 1, 2, 3].map((j) => [
              `$${ruleOptions[j]}$`,
              j === 3
                ? `it swaps the coordinates without changing a sign, a reflection across $y = x$; it sends the point to $${sends(j)}$.`
                : `it sends $${pl(p)}$ to $${sends(j)}$, not to $${pl(image)}$.`,
              j === 3
                ? `它只交换坐标而不变号，是关于 $y = x$ 的翻折；它把这个点送到 $${sends(j)}$。`
                : `它把 $${pl(p)}$ 送到 $${sends(j)}$，而不是 $${pl(image)}$。`,
            ]),
          ),
          solutionFigures: [movedPoint("P", p, image, { kind: "turn", degrees: [90, -90, 180][k]! })],
        };
      },
    },
    {
      id: "composing-rotations",
      figure: motionDrawings["composing-rotations"],
      title: t("Composing rotations", "旋转的复合"),
      explanation: t(
        "Rotations about the same center combine by adding their angles: $R_{\\alpha}(R_{\\beta}(P)) = R_{\\alpha + \\beta}(P)$. Evaluate from the inside out, or add the angles first. Angles that differ by $360^\\circ$ give the same rotation.\n\n$R_{90^\\circ}(R_{180^\\circ}(2, -3)) = R_{270^\\circ}(2, -3) = R_{-90^\\circ}(2, -3) = (-3, -2)$.\n\n> **Watch out.** The angles add, with their signs: a clockwise angle is negative, so $R_{90^\\circ}(R_{-180^\\circ}(P))$ is $R_{-90^\\circ}(P)$. Do not subtract two counterclockwise angles, and do not drop the inner rotation: both turns count.",
        "同一中心的旋转复合时角度相加：$R_{\\alpha}(R_{\\beta}(P)) = R_{\\alpha + \\beta}(P)$。可以由内向外逐步计算，也可以先把角度相加。相差 $360^\\circ$ 的角给出相同的旋转。\n\n$R_{90^\\circ}(R_{180^\\circ}(2, -3)) = R_{270^\\circ}(2, -3) = R_{-90^\\circ}(2, -3) = (-3, -2)$。\n\n> **注意。** 角度带着符号相加：顺时针的角是负的，所以 $R_{90^\\circ}(R_{-180^\\circ}(P))$ 就是 $R_{-90^\\circ}(P)$。不要把两个逆时针的角相减，也不要漏掉里面那次旋转：两次都要算。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const angles = [90, 180, 270, -90, -180];
        const [a, b] = [rng.pick(angles), rng.pick(angles)];
        const total = a + b;
        const qa = a / 90;
        const qb = b / 90;
        const image = rotQ(p, qa + qb);
        const inner = rotQ(p, qb);
        const turn = (((total % 360) + 360) % 360) / 90;
        const quarter = (n: number) => ((n % 4) + 4) % 4;
        const sumText = `${a}^\\circ + ${b < 0 ? `(${b}^\\circ)` : `${b}^\\circ`} = ${total}^\\circ`;
        const single =
          turn === 0
            ? t(
                `$${total}^\\circ$ is a whole number of full turns, so the two rotations together leave every point where it was: the answer is $${pl(p)}$ itself.`,
                `$${total}^\\circ$ 是整数圈，所以两次旋转合起来让每个点回到原处：答案就是 $${pl(p)}$ 本身。`,
              )
            : t(
                `${turn * 90 === total ? "" : `$${total}^\\circ$ is the same rotation as $${turn * 90}^\\circ$. `}One rotation by $${turn * 90}^\\circ$ gives $${rotationSymbol(turn * 90)}${pl(p)} = ${ruleApplied(p, turn)}$, the same point.`,
                `${turn * 90 === total ? "" : `$${total}^\\circ$ 与 $${turn * 90}^\\circ$ 是同一个旋转。`}一次旋转 $${turn * 90}^\\circ$ 得 $${rotationSymbol(turn * 90)}${pl(p)} = ${ruleApplied(p, turn)}$，是同一个点。`,
              );
        const step = (q: number, from: XY) => (quarter(q) === 0 ? pl(from) : ruleApplied(from, quarter(q)));
        return {
          ...pointProblem({
            prompt: t(
              `$R_{\\theta}$ is the rotation by $\\theta$ about the origin (counterclockwise for positive $\\theta$). Find $${rotationSymbol(a)}(${rotationSymbol(b)}${pl(p)})$.`,
              `$R_{\\theta}$ 表示绕原点旋转 $\\theta$（$\\theta$ 为正时逆时针）。求 $${rotationSymbol(a)}(${rotationSymbol(b)}${pl(p)})$。`,
            ),
            answer: image,
            wrong: [rotQ(p, qa - qb), rotQ(p, qa), rotQ(p, -(qa + qb))],
            solution: t(
              `${stepLabel(1, "the inner rotation", "里面的旋转").en} Evaluate from the inside out. $${rotationSymbol(b)}$ ${b === 180 || b === -180 ? "is a half turn" : b === 90 || b === -270 ? "is a quarter turn counterclockwise" : "is a quarter turn clockwise"}:${steps(`${rotationSymbol(b)}${pl(p)} = ${step(qb, p)}`)}${stepLabel(2, "the outer rotation", "外面的旋转").en} Now turn that point by $${rotationSymbol(a)}$:${steps(`${rotationSymbol(a)}${pl(inner)} = ${step(qa, inner)}`)}**Check.** Add the angles instead: $${sumText}$. ${single.en}\n\n{{figure 0}}`,
              `${stepLabel(1, "the inner rotation", "里面的旋转")["zh-CN"]}由内向外计算。$${rotationSymbol(b)}$ ${b === 180 || b === -180 ? "是转半圈" : b === 90 || b === -270 ? "是逆时针转四分之一圈" : "是顺时针转四分之一圈"}：${steps(`${rotationSymbol(b)}${pl(p)} = ${step(qb, p)}`)}${stepLabel(2, "the outer rotation", "外面的旋转")["zh-CN"]}再把这个点按 $${rotationSymbol(a)}$ 旋转：${steps(`${rotationSymbol(a)}${pl(inner)} = ${step(qa, inner)}`)}**检验。** 改为先把角度相加：$${sumText}$。${single["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [
            graphFigure(
              viewAround([p, inner, image]),
              [
                { kind: "turn", center: [0, 0], from: p, degrees: b, tone: "action" },
                { kind: "turn", center: [0, 0], from: inner, degrees: a, tone: "action" },
                { kind: "point", at: p, label: "P", dir: "ne", accent: true },
                { kind: "point", at: inner, dir: "ne" },
                { kind: "point", at: image, label: "P′", dir: "sw", tone: "result" },
              ],
              `P ${at(p)} turns by ${b}° and then by ${a}°, ending at ${at(image)}.`,
              `P ${at(p)} 先转 ${b}°，再转 ${a}°，到达 ${at(image)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "inverting-a-rotation",
      figure: motionDrawings["inverting-a-rotation"],
      title: t("Inverting a rotation", "旋转的逆"),
      explanation: t(
        "The inverse of a rotation turns back by the same angle: the inverse of $R_{90^\\circ}$ is $R_{-90^\\circ}$, and $R_{180^\\circ}$ is its own inverse.\n\nIf $f(x, y) = (-y, x)$ and $f(P) = (4, -1)$, then $P = R_{-90^\\circ}(4, -1) = (-1, -4)$. Check: $f(-1, -4) = (4, -1)$.\n\n> **Watch out.** Applying $f$ to $f(P)$ turns the point further, not back: $f(4, -1) = (1, 4)$, a half turn from $P$. Undo a quarter turn with the quarter turn the other way.",
        "旋转的逆就是按同样的角度转回去：$R_{90^\\circ}$ 的逆是 $R_{-90^\\circ}$，$R_{180^\\circ}$ 的逆是它自己。\n\n若 $f(x, y) = (-y, x)$，$f(P) = (4, -1)$，则 $P = R_{-90^\\circ}(4, -1) = (-1, -4)$。检验：$f(-1, -4) = (4, -1)$。\n\n> **注意。** 对 $f(P)$ 再用一次 $f$，点会继续转，而不是转回去：$f(4, -1) = (1, 4)$，离 $P$ 已经是半圈。要还原四分之一圈，就反方向转四分之一圈。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 2);
        const q = [1, 3, 2][k]!;
        const image = rotQ(p, q);
        const rule = ruleOptions[k]!.replace("(x, y) \\to ", "");
        const [angle, undo] = [
          [90, -90],
          [-90, 90],
          [180, 180],
        ][k]!;
        return {
          ...pointProblem({
            prompt: t(
              `The function $f(x, y) = ${rule}$ rotates the plane about the origin, and $f(P) = ${pl(image)}$. Find $P$.`,
              `函数 $f(x, y) = ${rule}$ 把平面绕原点旋转，且 $f(P) = ${pl(image)}$。求 $P$。`,
            ),
            answer: p,
            wrong: [rotQ(image, q), [image[1], image[0]], [-image[0], -image[1]]],
            solution: t(
              `${stepLabel(1, "name the inverse", "写出逆").en} $f(x, y) = ${rule}$ is the rotation $${rotationSymbol(angle!)}$. Its inverse turns back by the same angle: $${rotationSymbol(undo!)}(x, y) = ${rotationRules[3 - q]!.replace("(x, y) \\to ", "")}$.\n\n${stepLabel(2, "apply it to the image", "作用在像上").en} Feed $f(P)$ to the inverse:${steps(`P = ${rotationSymbol(undo!)}${pl(image)} = ${ruleApplied(image, 4 - q)}`)}**Check.** Apply $f$ to $P$: $f${pl(p)} = ${ruleApplied(p, q)}$, which is the image given.\n\n{{figure 0}}`,
              `${stepLabel(1, "name the inverse", "写出逆")["zh-CN"]}$f(x, y) = ${rule}$ 是旋转 $${rotationSymbol(angle!)}$。它的逆按同样的角度转回去：$${rotationSymbol(undo!)}(x, y) = ${rotationRules[3 - q]!.replace("(x, y) \\to ", "")}$。\n\n${stepLabel(2, "apply it to the image", "作用在像上")["zh-CN"]}把 $f(P)$ 代入逆旋转：${steps(`P = ${rotationSymbol(undo!)}${pl(image)} = ${ruleApplied(image, 4 - q)}`)}**检验。** 对 $P$ 用 $f$：$f${pl(p)} = ${ruleApplied(p, q)}$，正是给出的像。\n\n{{figure 0}}`,
            ),
          }),
          solutionFigures: [movedPoint("f(P)", image, p, { kind: "turn", degrees: undo! }, "P")],
        };
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

/** reflectionApplied writes the rule of axisReflections[k] applied to p: the coordinates substituted, then simplified when that differs. */
const reflectionApplied = (k: number, p: XY) => {
  const [x, y] = p;
  const put = [`(${x}, ${neg(y)})`, `(${neg(x)}, ${y})`, `(${y}, ${x})`, `(${neg(y)}, ${neg(x)})`][k]!;
  const image = pl(axisReflections[k]!.f(p));
  return put === image ? image : `${put} = ${image}`;
};

/** reflectBack checks a reflection across axisReflections[k] by reflecting the image back onto the point. */
const reflectBack = (k: number, p: XY, image: XY) =>
  t(
    `**Check.** Reflect $P'$ across the same line: $${reflectionApplied(k, image)}$, which is $P${pl(p)}$ again, as reflecting twice must give.`,
    `**检验。** 把 $P'$ 关于同一条直线再对称一次：$${reflectionApplied(k, image)}$，又回到 $P${pl(p)}$，对称两次本应如此。`,
  );

/** mirrorEnds are two points on each line of axisReflections, for drawing it. */
const mirrorEnds: readonly (readonly [XY, XY])[] = [
  [
    [0, 0],
    [1, 0],
  ],
  [
    [0, 0],
    [0, 1],
  ],
  [
    [0, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [1, -1],
  ],
];

export const reflectionsInTheCoordinatePlane: TopicDef = {
  id: "reflections-in-the-coordinate-plane",
  title: t("Reflections of Geometric Figures in the Cartesian Plane", "坐标平面中图形的轴对称"),
  summary: t(
    "Reflect points across the axes, the lines y = x and y = −x, and horizontal and vertical lines, and identify a line of reflection.",
    "把点关于坐标轴、直线 y = x 与 y = −x 以及水平和竖直直线作轴对称，并判断对称轴。",
  ),
  prerequisites: ["the-coordinate-plane", "subtracting-integers"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.4", "CCSS.HSG.CO.A.5"],
  intro: t(
    "A mirror shows each point as far behind the glass as it is in front. A **reflection** in the coordinate plane does the same across a line: every point goes straight across the line to the same distance on the other side. Measured on the grid, that distance is a coordinate, so reflections become rules of signs and swaps.\n\nReflect $P(2, 3)$ across the $x$-axis.\n\n{{figure 0}}\n\n$P$ is $3$ units above the $x$-axis, so its image is $3$ units below it, straight down: $P'(2, -3)$. Going straight across keeps $x$; only $y$ changes, to its opposite. The $x$-axis sits halfway, at the midpoint $(2, 0)$ of $PP'$.",
    "镜子里每个点在镜后的距离，等于它在镜前的距离。坐标平面中的**轴对称（反射）**也是这样，只是镜子换成一条直线：每个点都垂直穿过这条直线，落到另一侧相同距离处。在网格上，这个距离就是坐标，所以轴对称变成了关于变号和交换坐标的规则。\n\n作 $P(2, 3)$ 关于 $x$ 轴的对称点。\n\n{{figure 0}}\n\n$P$ 在 $x$ 轴上方 $3$ 个单位，所以它的像在 $x$ 轴下方 $3$ 个单位，正下方：$P'(2, -3)$。垂直穿过 $x$ 轴时 $x$ 不变，只有 $y$ 变成相反数。$x$ 轴恰好在中间，经过 $PP'$ 的中点 $(2, 0)$。",
  ),
  introFigures: [movedPoint("P", [2, 3], [2, -3], { kind: "flip", a: [0, 0], b: [1, 0] })],
  knowledgePoints: [
    {
      id: "reflecting-across-the-axes",
      figure: motionDrawings["reflecting-across-the-axes"],
      title: t("Reflecting across the axes", "关于坐标轴的对称"),
      explanation: t(
        "A **reflection** across a line flips the plane over that line, the **line of reflection**: each point goes to the point on the other side at the same distance, so the line is the perpendicular bisector of every segment $PP'$.\n\n- Across the $x$-axis: $(x, y) \\to (x, -y)$.\n- Across the $y$-axis: $(x, y) \\to (-x, y)$.\n\nThe coordinate along the line stays the same; the other one changes sign. Reflecting $(3, -4)$ across the $y$-axis gives $(-3, -4)$.\n\n> **Watch out.** Across the $x$-axis it is $y$ that changes sign: $y$ measures the distance from the $x$-axis. Changing both signs is not a reflection at all but a half turn, and swapping the coordinates reflects across $y = x$.",
        "关于一条直线的**轴对称（反射）**把平面沿这条直线（**对称轴**）翻折：每个点都到直线另一侧距离相同的位置，所以对称轴是每条线段 $PP'$ 的垂直平分线。\n\n- 关于 $x$ 轴：$(x, y) \\to (x, -y)$。\n- 关于 $y$ 轴：$(x, y) \\to (-x, y)$。\n\n沿对称轴方向的坐标不变，另一个坐标变号。$(3, -4)$ 关于 $y$ 轴的对称点是 $(-3, -4)$。\n\n> **注意。** 关于 $x$ 轴对称时变号的是 $y$：$y$ 表示点到 $x$ 轴的距离。两个坐标都变号根本不是轴对称，而是旋转半圈；交换坐标则是关于 $y = x$ 的对称。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 1);
        const r = axisReflections[k]!;
        const image = r.f(p);
        const d = k === 0 ? p[1] : p[0];
        const side =
          k === 0 ? t(d > 0 ? "above" : "below", d > 0 ? "上方" : "下方") : t(d > 0 ? "right of" : "left of", d > 0 ? "右侧" : "左侧");
        return {
          ...pointProblem({
            prompt: t(`Reflect $P${pl(p)}$ across ${r.name.en}. Find $P'$.`, `作 $P${pl(p)}$ 关于${r.name["zh-CN"]}的对称点 $P'$。`),
            answer: image,
            wrong: [axisReflections[1 - k]!.f(p), [-p[0], -p[1]], [p[1], p[0]]],
            solution: t(
              `${stepLabel(1, "measure the distance", "量出距离").en} $P$ is $${Math.abs(d)}$ unit${Math.abs(d) === 1 ? "" : "s"} ${side.en} ${r.name.en}: that distance is its $${k === 0 ? "y" : "x"}$-coordinate. Its image lies the same distance on the other side, so that coordinate changes sign and the $${k === 0 ? "x" : "y"}$-coordinate stays: $${r.rule}$.\n\n${stepLabel(2, "apply the rule", "应用规则").en} Substitute the coordinates of $P$:${steps(`P' = ${reflectionApplied(k, p)}`)}${reflectBack(k, p, image).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "measure the distance", "量出距离")["zh-CN"]}$P$ 在${r.name["zh-CN"]}${side["zh-CN"]} $${Math.abs(d)}$ 个单位：这个距离就是它的 $${k === 0 ? "y" : "x"}$ 坐标。像在另一侧相同距离处，所以这个坐标变号，$${k === 0 ? "x" : "y"}$ 坐标不变：$${r.rule}$。\n\n${stepLabel(2, "apply the rule", "应用规则")["zh-CN"]}代入 $P$ 的坐标：${steps(`P' = ${reflectionApplied(k, p)}`)}${reflectBack(k, p, image)["zh-CN"]}\n\n{{figure 0}}`,
            ),
          }),
          figure: graph(
            [{ kind: "point", at: p, label: "P", dir: "n", accent: true }],
            "A point P on a coordinate grid.",
            "坐标网格上的点 P。",
          ),
          solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: [0, 0], b: k === 0 ? [1, 0] : [0, 1] })],
        };
      },
    },
    {
      id: "reflecting-across-diagonal-lines",
      figure: motionDrawings["reflecting-across-diagonal-lines"],
      title: t("Reflecting across y = x and y = −x", "关于 y = x 与 y = −x 的对称"),
      explanation: t(
        "The lines $y = x$ and $y = -x$ run diagonally through the origin.\n\n- Across $y = x$: $(x, y) \\to (y, x)$, the coordinates swap.\n- Across $y = -x$: $(x, y) \\to (-y, -x)$, the coordinates swap and both change sign.\n\nReflecting $(5, -2)$ across $y = x$ gives $(-2, 5)$; across $y = -x$ it gives $(2, -5)$.\n\n> **Watch out.** Swapping and changing only *one* sign, $(5, -2) \\to (2, 5)$, is a quarter turn, not a reflection. Across $y = -x$ both signs change; across $y = x$ neither does.",
        "直线 $y = x$ 和 $y = -x$ 是过原点的两条斜线。\n\n- 关于 $y = x$：$(x, y) \\to (y, x)$，两个坐标交换。\n- 关于 $y = -x$：$(x, y) \\to (-y, -x)$，两个坐标交换并都变号。\n\n$(5, -2)$ 关于 $y = x$ 的对称点是 $(-2, 5)$；关于 $y = -x$ 的对称点是 $(2, -5)$。\n\n> **注意。** 交换坐标后只改变*一个*符号，$(5, -2) \\to (2, 5)$，是旋转四分之一圈，不是轴对称。关于 $y = -x$ 两个符号都变，关于 $y = x$ 都不变。",
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
              `${stepLabel(1, "choose the rule", "选出规则").en} Reflecting across ${r.name.en} swaps the coordinates${k === 3 ? " and changes both signs" : ", with no change of sign"}: $${r.rule}$.\n\n${stepLabel(2, "apply it", "代入").en} With $x = ${p[0]}$ and $y = ${p[1]}$:${steps(`P' = ${reflectionApplied(k, p)}`)}${reflectBack(k, p, image).en}\n\n{{figure 0}}`,
              `${stepLabel(1, "choose the rule", "选出规则")["zh-CN"]}关于${r.name["zh-CN"]}对称时，两个坐标交换${k === 3 ? "，并且都变号" : "，符号不变"}：$${r.rule}$。\n\n${stepLabel(2, "apply it", "代入")["zh-CN"]}把 $x = ${p[0]}$，$y = ${p[1]}$ 代入：${steps(`P' = ${reflectionApplied(k, p)}`)}${reflectBack(k, p, image)["zh-CN"]}\n\n{{figure 0}}`,
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
          solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: [0, 0], b: [1, k === 2 ? 1 : -1] })],
        };
      },
    },
    {
      id: "reflecting-across-horizontal-and-vertical-lines",
      figure: motionDrawings["reflecting-across-horizontal-and-vertical-lines"],
      title: t("Reflecting across other horizontal and vertical lines", "关于其他水平或竖直直线的对称"),
      explanation: t(
        "Across a vertical line $x = h$, the $y$-coordinate stays and the point lands as far past the line as it started before it: $(x, y) \\to (2h - x, y)$. Across a horizontal line $y = k$: $(x, y) \\to (x, 2k - y)$.\n\nReflecting $(5, 1)$ across $x = 2$: the point is $3$ units right of the line, so the image is $3$ units left of it, at $(-1, 1)$; indeed $2 \\cdot 2 - 5 = -1$.\n\n> **Watch out.** Measure from the line, not from the axis: across $x = 2$, $(5, 1)$ does not go to $(-5, 1)$, which is the reflection across the $y$-axis. Nor to $2 - 5 = -3$: the image is a whole distance *past* the line, $2h - x$.",
        "关于竖直直线 $x = h$ 对称时，$y$ 坐标不变，点落在直线另一侧相同距离处：$(x, y) \\to (2h - x, y)$。关于水平直线 $y = k$：$(x, y) \\to (x, 2k - y)$。\n\n作 $(5, 1)$ 关于 $x = 2$ 的对称点：点在直线右侧 $3$ 个单位，所以像在直线左侧 $3$ 个单位，即 $(-1, 1)$；确实 $2 \\cdot 2 - 5 = -1$。\n\n> **注意。** 要从这条直线量起，而不是从坐标轴量起：关于 $x = 2$ 对称时，$(5, 1)$ 不会变成 $(-5, 1)$，那是关于 $y$ 轴的对称。也不是 $2 - 5 = -3$：像要越过直线再走同样的距离，是 $2h - x$。",
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
          const moved = vertical ? image[0] : image[1];
          const c = vertical ? "x" : "y";
          const other = vertical ? "y" : "x";
          const units = `$${Math.abs(d)}$ unit${Math.abs(d) === 1 ? "" : "s"}`;
          const [side, otherSide] = vertical
            ? d > 0
              ? [t("right of", "右侧"), t("left of", "左侧")]
              : [t("left of", "左侧"), t("right of", "右侧")]
            : d > 0
              ? [t("above", "上方"), t("below", "下方")]
              : [t("below", "下方"), t("above", "上方")];
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
                `${stepLabel(1, "measure from the line", "从直线量起").en} $P$ is ${units} ${side.en} the line: $${minusP(along, h)} = ${d}$. Going straight across a ${vertical ? "vertical" : "horizontal"} line keeps the $${other}$-coordinate, $${vertical ? p[1] : p[0]}$.\n\n${stepLabel(2, "go as far past the line", "越过直线走同样远").en} $P'$ is ${units} ${otherSide.en} the line:${steps(`${c}' = ${minusP(h, d)} = ${moved}`)}So $P' = ${pl(image)}$, as the rule $${vertical ? "2h - x" : "2k - y"}$ gives: $2 \\cdot ${h < 0 ? `(${h})` : h} - ${along < 0 ? `(${along})` : along} = ${moved}$.\n\n**Check.** The line must lie halfway between $P$ and $P'$: $\\dfrac{${along} + ${moved < 0 ? `(${moved})` : moved}}{2} = ${h}$, so the midpoint of $PP'$ is on $${line}$.\n\n{{figure 0}}`,
                `${stepLabel(1, "measure from the line", "从直线量起")["zh-CN"]}$P$ 在直线${side["zh-CN"]} ${units.replace(/ units?$/, "")} 个单位：$${minusP(along, h)} = ${d}$。垂直穿过${vertical ? "竖直" : "水平"}直线时，$${other}$ 坐标不变，仍是 $${vertical ? p[1] : p[0]}$。\n\n${stepLabel(2, "go as far past the line", "越过直线走同样远")["zh-CN"]}$P'$ 在直线${otherSide["zh-CN"]} ${units.replace(/ units?$/, "")} 个单位：${steps(`${c}' = ${minusP(h, d)} = ${moved}`)}所以 $P' = ${pl(image)}$，与规则 $${vertical ? "2h - x" : "2k - y"}$ 一致：$2 \\cdot ${h < 0 ? `(${h})` : h} - ${along < 0 ? `(${along})` : along} = ${moved}$。\n\n**检验。** 直线应在 $P$ 与 $P'$ 的正中间：$\\dfrac{${along} + ${moved < 0 ? `(${moved})` : moved}}{2} = ${h}$，所以 $PP'$ 的中点在 $${line}$ 上。\n\n{{figure 0}}`,
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
            solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: vertical ? [h, 0] : [0, h], b: vertical ? [h, 1] : [1, h] })],
          };
        }
      },
    },
    {
      id: "identifying-the-line-of-reflection",
      figure: motionDrawings["identifying-the-line-of-reflection"],
      title: t("Identifying the line of reflection", "判断对称轴"),
      explanation: t(
        "To identify the line of reflection, compare $P$ and $P'$ with the four rules: the $x$-axis keeps $x$ and negates $y$; the $y$-axis negates $x$ and keeps $y$; $y = x$ swaps the coordinates; $y = -x$ swaps them and negates both.\n\n$(4, -1) \\to (1, -4)$ swaps and negates both coordinates: the line is $y = -x$.\n\n> **Watch out.** First ask whether the coordinates swapped places, then which signs changed. A single changed sign with no swap means an axis, and it is the axis of the coordinate that did *not* change: $(4, -1) \\to (4, 1)$ keeps $x$, so the line is the $x$-axis.",
        "要判断对称轴，把 $P$ 与 $P'$ 和四条规则对比：关于 $x$ 轴，$x$ 不变、$y$ 变号；关于 $y$ 轴，$x$ 变号、$y$ 不变；关于 $y = x$，两个坐标交换；关于 $y = -x$，两个坐标交换并都变号。\n\n$(4, -1) \\to (1, -4)$ 是坐标交换并都变号：对称轴是 $y = -x$。\n\n> **注意。** 先看两个坐标是否交换了位置，再看哪些符号变了。不交换、只有一个符号变了，对称轴就是坐标轴，而且是*没有*变的那个坐标所在的轴：$(4, -1) \\to (4, 1)$ 中 $x$ 不变，所以对称轴是 $x$ 轴。",
      ),
      generate(rng) {
        const p = pickPoint(rng);
        const k = rng.int(0, 3);
        const image = axisReflections[k]!.f(p);
        const r = axisReflections[k]!;
        const compare = [
          t("The coordinates stay in their places; $x$ stays and $y$ changes sign.", "两个坐标位置不变；$x$ 不变，$y$ 变号。"),
          t("The coordinates stay in their places; $x$ changes sign and $y$ stays.", "两个坐标位置不变；$x$ 变号，$y$ 不变。"),
          t("The coordinates swap places, and neither changes sign.", "两个坐标交换了位置，符号都不变。"),
          t("The coordinates swap places, and both change sign.", "两个坐标交换了位置，并且都变号。"),
        ][k]!;
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `A reflection maps $P${pl(p)}$ to $P'${pl(image)}$. What is the line of reflection?`,
                `一次轴对称把 $P${pl(p)}$ 映到 $P'${pl(image)}$。对称轴是什么？`,
              ),
              options: axisReflections.map((o) => cat(o.name)),
              correct: k,
              solution: t(
                `${stepLabel(1, "compare the coordinates", "比较坐标").en} Compare $${pl(p)}$ with $${pl(image)}$. ${compare.en}\n\n${stepLabel(2, "name the line", "说出对称轴").en} That is the rule $${r.rule}$, the reflection across ${r.name.en}.\n\n**Check.** Apply the rule to $P$: $${reflectionApplied(k, p)}$, which is $P'$.\n\n{{figure 0}}`,
                `${stepLabel(1, "compare the coordinates", "比较坐标")["zh-CN"]}比较 $${pl(p)}$ 与 $${pl(image)}$。${compare["zh-CN"]}\n\n${stepLabel(2, "name the line", "说出对称轴")["zh-CN"]}这就是规则 $${r.rule}$，即关于${r.name["zh-CN"]}的对称。\n\n**检验。** 把规则用在 $P$ 上：$${reflectionApplied(k, p)}$，正是 $P'$。\n\n{{figure 0}}`,
              ),
            }),
            axisReflections.map((o) => [
              o.name.en,
              `reflecting across it follows $${o.rule}$ and sends $P$ to $${pl(o.f(p))}$, not to $P'$.`,
              `关于它对称的规则是 $${o.rule}$，它把 $P$ 送到 $${pl(o.f(p))}$，而不是 $P'$。`,
            ]),
          ),
          figure: graph(
            [
              { kind: "point", at: p, label: "P", dir: "n" },
              { kind: "point", at: image, label: "P′", dir: "n", accent: true },
            ],
            "A point P and its image P′ under a reflection.",
            "点 P 和它在一次轴对称下的像 P′。",
          ),
          solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: mirrorEnds[k]![0], b: mirrorEnds[k]![1] })],
        };
      },
    },
  ],
};

/** pq writes a rational number for a product or a difference, in parentheses when negative. */
const pq = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());

export const reflectionsAcrossArbitraryLines: TopicDef = {
  id: "reflections-across-arbitrary-lines",
  title: t("Reflections of Figures Across Arbitrary Lines", "关于任意直线的轴对称"),
  summary: t(
    "Reflect points across slanted lines, and find the line of reflection as the perpendicular bisector of a point and its image.",
    "把点关于斜线作轴对称，并把对称轴求成一个点与它的像的垂直平分线。",
  ),
  prerequisites: ["reflections-in-the-coordinate-plane", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.3 },
    { topic: "slope-intercept-form", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.CO.A.2", "CCSS.HSG.CO.A.5", "CCSS.HSG.GPE.B.5"],
  intro: t(
    "Across the axes and the lines $y = \\pm x$, reflections are rules of signs and swaps. Across any other line they rest on one fact: the line of reflection is the **perpendicular bisector** of the segment from each point to its image. It passes through the midpoint and meets the segment at a right angle, and both can be checked with slopes.\n\nTake $P(4, 1)$ and $P'(0, 5)$, and the line $y = x + 1$.\n\n{{figure 0}}\n\nThe midpoint of $\\overline{PP'}$ is $\\left(\\frac{4 + 0}{2}, \\frac{1 + 5}{2}\\right) = (2, 3)$, and $3 = 2 + 1$, so it lies on the line. The slope of $\\overline{PP'}$ is $\\frac{5 - 1}{0 - 4} = -1$, and the line has slope $1$: their product is $-1$, so they are perpendicular. So $P'$ is the reflection of $P$ across $y = x + 1$.",
    "关于坐标轴和直线 $y = \\pm x$ 的对称，是变号和交换坐标的规则。关于其他直线的对称则依据一个事实：对称轴是每个点与它的像连成的线段的**垂直平分线**。它经过线段的中点，并与线段垂直，这两点都可以用斜率检验。\n\n取 $P(4, 1)$、$P'(0, 5)$ 和直线 $y = x + 1$。\n\n{{figure 0}}\n\n$\\overline{PP'}$ 的中点是 $\\left(\\frac{4 + 0}{2}, \\frac{1 + 5}{2}\\right) = (2, 3)$，而 $3 = 2 + 1$，所以中点在直线上。$\\overline{PP'}$ 的斜率是 $\\frac{5 - 1}{0 - 4} = -1$，直线的斜率是 $1$：两者之积为 $-1$，所以互相垂直。因此 $P'$ 就是 $P$ 关于 $y = x + 1$ 的对称点。",
  ),
  introFigures: [movedPoint("P", [4, 1], [0, 5], { kind: "flip", a: [0, 1], b: [1, 2] })],
  knowledgePoints: [
    {
      id: "reflecting-across-shifted-diagonals",
      figure: motionDrawings["reflecting-across-shifted-diagonals"],
      title: t("Reflecting across y = x + c and y = −x + c", "关于 y = x + c 与 y = −x + c 的对称"),
      explanation: t(
        "To reflect across $y = x + c$, shift everything down by $c$ so the line becomes $y = x$, reflect, and shift back up:\n\n$$(x, y) \\to (y - c, \\; x + c).$$\n\nSimilarly, across $y = -x + c$: $(x, y) \\to (c - y, \\; c - x)$.\n\nAcross $y = x + 2$, the point $(5, 1)$ goes to $(1 - 2, 5 + 2) = (-1, 7)$. Check: the midpoint $(2, 4)$ lies on $y = x + 2$.\n\n> **Watch out.** Swapping the coordinates alone reflects across $y = x$, not $y = x + c$: here it would give $(1, 5)$, whose midpoint with $(5, 1)$ is $(3, 3)$, off the line. Shift down by $c$ before reflecting and back up after, in that order.",
        "要作关于 $y = x + c$ 的对称，先把所有点向下平移 $c$，直线变成 $y = x$；作对称后再向上平移回去：\n\n$$(x, y) \\to (y - c, \\; x + c)$$\n\n同理，关于 $y = -x + c$：$(x, y) \\to (c - y, \\; c - x)$。\n\n关于 $y = x + 2$，点 $(5, 1)$ 的对称点是 $(1 - 2, 5 + 2) = (-1, 7)$。检验：中点 $(2, 4)$ 在 $y = x + 2$ 上。\n\n> **注意。** 只交换坐标是关于 $y = x$ 的对称，而不是关于 $y = x + c$：这里会得到 $(1, 5)$，它与 $(5, 1)$ 的中点是 $(3, 3)$，不在直线上。要先向下平移 $c$ 再对称，最后向上平移回去，顺序不能乱。",
      ),
      generate(rng) {
        for (;;) {
          const c = rng.nonZero(-4, 4);
          const up = rng.bool();
          const p: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const image: XY = up ? [p[1] - c, p[0] + c] : [c - p[1], c - p[0]];
          if ((image[0] === p[0] && image[1] === p[1]) || !within([image], 8)) continue;
          const line = up ? `y = x ${c < 0 ? "-" : "+"} ${Math.abs(c)}` : `y = -x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
          const base = up ? "y = x" : "y = -x";
          const mid = [Q.of(p[0] + image[0], 2), Q.of(p[1] + image[1], 2)] as const;
          const moved: XY = [p[0], p[1] - c];
          const flipped: XY = up ? [moved[1], moved[0]] : [-moved[1] + 0, -moved[0] + 0];
          const shiftDown = c > 0 ? t(`down $${c}$`, `向下平移 $${c}$`) : t(`up $${-c}$`, `向上平移 $${-c}$`);
          const shiftBack = c > 0 ? t(`up $${c}$`, `向上平移 $${c}$`) : t(`down $${-c}$`, `向下平移 $${-c}$`);
          const onLine = `${(up ? mid[0] : mid[0].neg()).toLatex()} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${mid[1].toLatex()}`;
          return {
            ...pointProblem({
              prompt: t(`Reflect $P${pl(p)}$ across the line $${line}$. Find $P'$.`, `作 $P${pl(p)}$ 关于直线 $${line}$ 的对称点 $P'$。`),
              answer: image,
              wrong: [up ? [p[1], p[0]] : [-p[1], -p[0]], up ? [p[1] + c, p[0] - c] : [-c - p[1], -c - p[0]], [image[1], image[0]]],
              solution: t(
                `${stepLabel(1, "shift the line", "平移直线").en} Shift everything ${shiftDown.en}: the line becomes $${base}$, and $P$ goes to $${pl([p[0], p[1]])} \\to ${pl(moved)}$.\n\n${stepLabel(2, "reflect", "对称").en} Across $${base}$, ${up ? "swap the coordinates" : "swap the coordinates and change both signs"}: $${pl(moved)} \\to ${pl(flipped)}$.\n\n${stepLabel(3, "shift back", "平移回去").en} Shift ${shiftBack.en}, adding $${c}$ to $y$:${steps(`P' = (${flipped[0]}, ${plusP(flipped[1], c)}) = ${pl(image)}`)}**Check.** The line must be the perpendicular bisector of $\\overline{PP'}$. The midpoint is $${pl(mid)}$, and on the line $${onLine}$, so it lies on the line. The slope of $\\overline{PP'}$ is $${up ? -1 : 1}$, the line's is $${up ? 1 : -1}$, and their product is $-1$: perpendicular.\n\n{{figure 0}}`,
                `${stepLabel(1, "shift the line", "平移直线")["zh-CN"]}把所有点${shiftDown["zh-CN"]}：直线变成 $${base}$，$P$ 变为 $${pl([p[0], p[1]])} \\to ${pl(moved)}$。\n\n${stepLabel(2, "reflect", "对称")["zh-CN"]}关于 $${base}$，${up ? "交换坐标" : "交换坐标并都变号"}：$${pl(moved)} \\to ${pl(flipped)}$。\n\n${stepLabel(3, "shift back", "平移回去")["zh-CN"]}再${shiftBack["zh-CN"]}，即 $y$ 加上 $${c}$：${steps(`P' = (${flipped[0]}, ${plusP(flipped[1], c)}) = ${pl(image)}`)}**检验。** 直线应是 $\\overline{PP'}$ 的垂直平分线。中点是 $${pl(mid)}$，代入直线得 $${onLine}$，所以中点在直线上。$\\overline{PP'}$ 的斜率是 $${up ? -1 : 1}$，直线的斜率是 $${up ? 1 : -1}$，两者之积为 $-1$：互相垂直。\n\n{{figure 0}}`,
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
            solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: [0, c], b: [1, up ? c + 1 : c - 1] })],
          };
        }
      },
    },
    {
      id: "finding-the-line-of-reflection",
      figure: motionDrawings["finding-the-line-of-reflection"],
      title: t("Finding the line of reflection", "求对称轴"),
      explanation: t(
        "The line of reflection that maps $P$ to $P'$ is the **perpendicular bisector** of $\\overline{PP'}$: it passes through the midpoint of $\\overline{PP'}$ and is perpendicular to it.\n\nFor $P(1, 1)$ and $P'(5, 3)$: the midpoint is $(3, 2)$; the slope of $\\overline{PP'}$ is $\\frac{2}{4} = \\frac{1}{2}$, so the line has slope $-2$. Then $y - 2 = -2(x - 3)$, that is $y = -2x + 8$.\n\n> **Watch out.** The line of reflection is perpendicular to $\\overline{PP'}$: its slope is the negative reciprocal, $-2$, not $\\frac{1}{2}$, the slope of the segment itself. And it passes through the midpoint, so its intercept is not $0$ unless the midpoint says so.",
        "把 $P$ 映到 $P'$ 的对称轴是 $\\overline{PP'}$ 的**垂直平分线**：它经过 $\\overline{PP'}$ 的中点，并与 $\\overline{PP'}$ 垂直。\n\n对 $P(1, 1)$ 和 $P'(5, 3)$：中点是 $(3, 2)$；$\\overline{PP'}$ 的斜率是 $\\frac{2}{4} = \\frac{1}{2}$，所以对称轴的斜率是 $-2$。于是 $y - 2 = -2(x - 3)$，即 $y = -2x + 8$。\n\n> **注意。** 对称轴与 $\\overline{PP'}$ 垂直：它的斜率是负倒数 $-2$，而不是线段本身的斜率 $\\frac{1}{2}$。它还经过中点，所以除非中点如此，截距不是 $0$。",
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
          const r: XY = [m[0] + v[1], m[1] - v[0]];
          const sq = (n: number) => (n < 0 ? `(${n})^2` : `${n}^2`);
          const toP = [r[0] - p[0], r[1] - p[1]] as const;
          const toQ = [r[0] - q[0], r[1] - q[1]] as const;
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
                `${stepLabel(1, "find the midpoint", "求中点").en} The line of reflection passes through the midpoint of $\\overline{PP'}$:${steps(`M = \\left(\\frac{${p[0]} + ${q[0] < 0 ? `(${q[0]})` : q[0]}}{2}, \\frac{${p[1]} + ${q[1] < 0 ? `(${q[1]})` : q[1]}}{2}\\right) = ${pl(m)}`)}${stepLabel(2, "find the slope", "求斜率").en} ${segSlope ? `The slope of $\\overline{PP'}$ is $\\frac{${q[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}}{${q[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}} = ${segSlope.toLatex()}$. The line of reflection is perpendicular to it, so its slope is the negative reciprocal, $${slope.toLatex()}$.` : "$\\overline{PP'}$ is vertical, since $P$ and $P'$ share their $x$-coordinate, so the line of reflection is horizontal: slope $0$."}\n\n${stepLabel(3, "write the equation", "写出方程").en} Put $M$ into $y = ${slope.isZero() ? "" : `${pq(slope)}x + `}b$: $b = ${slope.isZero() ? b.toLatex() : `${m[1]} - ${pq(slope)} \\cdot ${m[0] < 0 ? `(${m[0]})` : m[0]} = ${b.toLatex()}`}$, so the line is${steps(answer)}**Check.** Any point of the line must be as far from $P$ as from $P'$. Take $R${pl(r)}$: ${slope.isZero() ? `its $y$-coordinate is $${r[1]}$` : `$${pq(slope)} \\cdot ${r[0] < 0 ? `(${r[0]})` : r[0]} + ${pq(b)} = ${r[1]}$`}, so it is on the line, and $RP^2 = ${sq(toP[0])} + ${sq(toP[1])} = ${toP[0] ** 2 + toP[1] ** 2}$, $RP'^2 = ${sq(toQ[0])} + ${sq(toQ[1])} = ${toQ[0] ** 2 + toQ[1] ** 2}$: equal.\n\n{{figure 0}}`,
                `${stepLabel(1, "find the midpoint", "求中点")["zh-CN"]}对称轴经过 $\\overline{PP'}$ 的中点：${steps(`M = \\left(\\frac{${p[0]} + ${q[0] < 0 ? `(${q[0]})` : q[0]}}{2}, \\frac{${p[1]} + ${q[1] < 0 ? `(${q[1]})` : q[1]}}{2}\\right) = ${pl(m)}`)}${stepLabel(2, "find the slope", "求斜率")["zh-CN"]}${segSlope ? `$\\overline{PP'}$ 的斜率是 $\\frac{${q[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}}{${q[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}} = ${segSlope.toLatex()}$。对称轴与它垂直，所以斜率是它的负倒数 $${slope.toLatex()}$。` : "$P$ 与 $P'$ 的 $x$ 坐标相同，$\\overline{PP'}$ 是竖直的，所以对称轴是水平的：斜率为 $0$。"}\n\n${stepLabel(3, "write the equation", "写出方程")["zh-CN"]}把 $M$ 代入 $y = ${slope.isZero() ? "" : `${pq(slope)}x + `}b$：$b = ${slope.isZero() ? b.toLatex() : `${m[1]} - ${pq(slope)} \\cdot ${m[0] < 0 ? `(${m[0]})` : m[0]} = ${b.toLatex()}`}$，所以直线是${steps(answer)}**检验。** 直线上任一点到 $P$ 和到 $P'$ 的距离应相等。取 $R${pl(r)}$：${slope.isZero() ? `它的 $y$ 坐标是 $${r[1]}$` : `$${pq(slope)} \\cdot ${r[0] < 0 ? `(${r[0]})` : r[0]} + ${pq(b)} = ${r[1]}$`}，所以它在直线上；$RP^2 = ${sq(toP[0])} + ${sq(toP[1])} = ${toP[0] ** 2 + toP[1] ** 2}$，$RP'^2 = ${sq(toQ[0])} + ${sq(toQ[1])} = ${toQ[0] ** 2 + toQ[1] ** 2}$：相等。\n\n{{figure 0}}`,
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
            solutionFigures: [movedPoint("P", p, q, { kind: "flip", a: m, b: r })],
          };
        }
      },
    },
    {
      id: "reflecting-across-any-line",
      figure: motionDrawings["reflecting-across-any-line"],
      title: t("Reflecting across any line", "关于任意直线的对称"),
      explanation: t(
        "To reflect $P$ across a line $y = mx + b$:\n\n1. Write the line through $P$ perpendicular to it (slope $-\\frac{1}{m}$).\n2. Find where the two lines meet: the point $F$, which is the midpoint of $\\overline{PP'}$.\n3. Go as far past $F$ as $P$ is before it: $P' = (2x_F - x_P, \\; 2y_F - y_P)$.\n\nAcross $y = 2x$, for $P(-4, 2)$: the perpendicular through $P$ is $y = -\\frac{1}{2}x$; it meets $y = 2x$ at $F(0, 0)$, so $P' = (4, -2)$.\n\n> **Watch out.** $F$ is the midpoint of $\\overline{PP'}$, not the image: stopping there lands *on* the mirror. Go on past it by the same distance, $2F - P$; adding $P$ instead of subtracting goes the wrong way.",
        "要作 $P$ 关于直线 $y = mx + b$ 的对称点：\n\n1. 写出过 $P$ 且与它垂直的直线（斜率为 $-\\frac{1}{m}$）。\n2. 求两直线的交点 $F$，它是 $\\overline{PP'}$ 的中点。\n3. 越过 $F$ 走同样的距离：$P' = (2x_F - x_P, \\; 2y_F - y_P)$。\n\n关于 $y = 2x$，对 $P(-4, 2)$：过 $P$ 的垂线是 $y = -\\frac{1}{2}x$，它与 $y = 2x$ 交于 $F(0, 0)$，所以 $P' = (4, -2)$。\n\n> **注意。** $F$ 是 $\\overline{PP'}$ 的中点，不是像：停在那里就落在了对称轴*上*。要越过它再走同样的距离，即 $2F - P$；把 $P$ 加上去而不是减去，方向就反了。",
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
          const inv = Q.of(-1, m);
          const perpB = Q.of(p[1]).add(Q.of(p[0], m));
          const perp = `y = ${linear(inv, perpB)}`;
          const [dx, dy] = [image[0] - p[0], image[1] - p[1]];
          return {
            ...pointProblem({
              prompt: t(`Reflect $P${pl(p)}$ across the line $${line}$. Find $P'$.`, `作 $P${pl(p)}$ 关于直线 $${line}$ 的对称点 $P'$。`),
              answer: image,
              wrong: [foot, [p[1], p[0]], [2 * foot[0] + p[0], 2 * foot[1] + p[1]]],
              solution: t(
                `${stepLabel(1, "draw the perpendicular", "作垂线").en} The line has slope $${m}$, so the perpendicular through $P$ has slope $${inv.toLatex()}$. Through $P${pl(p)}$ its intercept is $${p[1]} - ${pq(inv)} \\cdot ${p[0] < 0 ? `(${p[0]})` : p[0]} = ${perpB.toLatex()}$:${steps(perp)}${stepLabel(2, "find the foot", "求垂足").en} Where the lines meet, $${linear(m, b)} = ${linear(inv, perpB)}$, which holds at $x = ${f}$; then $y = ${m} \\cdot ${f < 0 ? `(${f})` : f} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${foot[1]}$. So $F = ${pl(foot)}$, the midpoint of $\\overline{PP'}$.\n\n${stepLabel(3, "go as far past F", "越过 F 走同样远").en} Double $F$ and subtract $P$:${steps(`P' = (2 \\cdot ${foot[0] < 0 ? `(${foot[0]})` : foot[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; 2 \\cdot ${foot[1] < 0 ? `(${foot[1]})` : foot[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pl(image)}`)}**Check.** The slope of $\\overline{PP'}$ is $\\frac{${dy}}{${dx}} = ${Q.of(dy, dx).toLatex()}$, and $${m} \\cdot ${pq(Q.of(dy, dx))} = -1$, so $\\overline{PP'}$ is perpendicular to the line; its midpoint is $F$, which is on the line. So the line is the perpendicular bisector of $\\overline{PP'}$.\n\n{{figure 0}}`,
                `${stepLabel(1, "draw the perpendicular", "作垂线")["zh-CN"]}直线的斜率是 $${m}$，所以过 $P$ 的垂线斜率是 $${inv.toLatex()}$。它过 $P${pl(p)}$，截距为 $${p[1]} - ${pq(inv)} \\cdot ${p[0] < 0 ? `(${p[0]})` : p[0]} = ${perpB.toLatex()}$：${steps(perp)}${stepLabel(2, "find the foot", "求垂足")["zh-CN"]}两直线相交处 $${linear(m, b)} = ${linear(inv, perpB)}$，解得 $x = ${f}$；于是 $y = ${m} \\cdot ${f < 0 ? `(${f})` : f} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${foot[1]}$。所以 $F = ${pl(foot)}$，它是 $\\overline{PP'}$ 的中点。\n\n${stepLabel(3, "go as far past F", "越过 F 走同样远")["zh-CN"]}把 $F$ 的坐标加倍，再减去 $P$ 的坐标：${steps(`P' = (2 \\cdot ${foot[0] < 0 ? `(${foot[0]})` : foot[0]} - ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; 2 \\cdot ${foot[1] < 0 ? `(${foot[1]})` : foot[1]} - ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pl(image)}`)}**检验。** $\\overline{PP'}$ 的斜率是 $\\frac{${dy}}{${dx}} = ${Q.of(dy, dx).toLatex()}$，而 $${m} \\cdot ${pq(Q.of(dy, dx))} = -1$，所以 $\\overline{PP'}$ 与直线垂直；它的中点是直线上的 $F$。所以这条直线是 $\\overline{PP'}$ 的垂直平分线。\n\n{{figure 0}}`,
              ),
            }),
            solutionFigures: [movedPoint("P", p, image, { kind: "flip", a: foot, b: [foot[0] + 1, foot[1] + m] })],
          };
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
  encompasses: [{ topic: "multiplying-fractions", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.1"],
  intro: t(
    "A proportion says two ratios are equal, and multiplying by a fraction scales a number up or down. A **dilation** puts both to work on figures: it multiplies every distance from a center by the same **scale factor** $k$, so every length in the figure is multiplied by $k$ while every angle stays the same. The figure changes size but keeps its shape, which is the start of similarity.\n\nDilate triangle $ABC$ with $A(3, 3)$, $B(6, 3)$, $C(3, 6)$ from the origin $O$ by $k = \\frac{2}{3}$. Each coordinate is multiplied by $\\frac{2}{3}$: $A'(2, 2)$, $B'(4, 2)$, $C'(2, 4)$.\n\n{{figure 0}}\n\nThe side $AB = 6 - 3 = 3$ becomes $A'B' = 4 - 2 = 2$, and $\\frac{2}{3} \\cdot 3 = 2$. The distances from the center scale the same way: $OA = 3\\sqrt{2}$ and $OA' = 2\\sqrt{2} = \\frac{2}{3} \\cdot 3\\sqrt{2}$. The scale factor is less than $1$, so the image is a smaller copy.",
    "比例说明两个比相等，乘以一个分数会把一个数放大或缩小。**位似**把这两点用到图形上：它把每个点到中心的距离都乘以同一个**比例因子** $k$，于是图形中每条线段的长度都乘以 $k$，而每个角都不变。图形大小改变、形状不变，这正是相似的起点。\n\n以原点 $O$ 为中心、$k = \\frac{2}{3}$ 对三角形 $ABC$ 作位似，其中 $A(3, 3)$、$B(6, 3)$、$C(3, 6)$。每个坐标都乘以 $\\frac{2}{3}$：$A'(2, 2)$、$B'(4, 2)$、$C'(2, 4)$。\n\n{{figure 0}}\n\n边 $AB = 6 - 3 = 3$ 变成 $A'B' = 4 - 2 = 2$，而 $\\frac{2}{3} \\cdot 3 = 2$。到中心的距离也按同样的方式缩放：$OA = 3\\sqrt{2}$，$OA' = 2\\sqrt{2} = \\frac{2}{3} \\cdot 3\\sqrt{2}$。比例因子小于 $1$，所以像是缩小的图形。",
  ),
  introFigures: [
    movedPolygon(
      ["A", "B", "C"],
      [
        [3, 3],
        [6, 3],
        [3, 6],
      ],
      [
        [2, 2],
        [4, 2],
        [2, 4],
      ],
      { kind: "scale", center: [0, 0], centerName: "O" },
    ),
  ],
  knowledgePoints: [
    {
      id: "image-lengths",
      figure: motionDrawings["image-lengths"],
      title: t("Lengths in the image", "像的长度"),
      explanation: t(
        "A **dilation** with center $C$ and **scale factor** $k > 0$ moves every point $P$ along the ray $CP$ so that $CP' = k \\cdot CP$. It multiplies every length by $k$ and keeps every angle.\n\nIf $AB = 12$ and the scale factor is $\\frac{3}{4}$, then $A'B' = \\frac{3}{4} \\cdot 12 = 9$.\n\n> **Watch out.** A dilation multiplies lengths by $k$; it does not add $k$ or divide by it. Here $12 + \\frac{3}{4}$ or $12 \\div \\frac{3}{4} = 16$ would make the image longer, yet a scale factor below $1$ always makes it shorter.",
        "以 $C$ 为中心、**比例因子**为 $k > 0$ 的**位似**（放缩）把每个点 $P$ 沿射线 $CP$ 移动，使 $CP' = k \\cdot CP$。它把每条线段的长度都乘以 $k$，并保持每个角不变。\n\n若 $AB = 12$，比例因子为 $\\frac{3}{4}$，则 $A'B' = \\frac{3}{4} \\cdot 12 = 9$。\n\n> **注意。** 位似是把长度乘以 $k$，不是加上 $k$，也不是除以 $k$。这里 $12 + \\frac{3}{4}$ 或 $12 \\div \\frac{3}{4} = 16$ 都会让像变长，可比例因子小于 $1$ 时像一定变短。",
      ),
      generate(rng) {
        const k = rng.pick(niceScales);
        const d = Number(k.d);
        const length = d * rng.int(2, 12);
        const image = qn(k) * length;
        const longer = qn(k) > 1;
        return numberProblem({
          prompt: t(
            `A dilation with scale factor $${k.toLatex()}$ maps $\\overline{AB}$ to $\\overline{A'B'}$. If $AB = ${length}$, find $A'B'$.`,
            `比例因子为 $${k.toLatex()}$ 的位似把 $\\overline{AB}$ 映到 $\\overline{A'B'}$。若 $AB = ${length}$，求 $A'B'$。`,
          ),
          answer: image,
          wrong: [Q.of(length).div(k), Q.of(length).add(k), length],
          solution: t(
            `${stepLabel(1, "use the scale factor", "用比例因子").en} A dilation multiplies every length by its scale factor, so $A'B' = ${k.toLatex()} \\cdot AB$.\n\n${stepLabel(2, "multiply", "相乘").en} Put in $AB = ${length}$:${steps(`A'B' = ${k.toLatex()} \\cdot ${length} = ${image}`)}**Check.** Dividing the image length by the scale factor gives back the preimage: $${image} \\div ${k.toLatex()} = ${length} = AB$. The scale factor is ${longer ? "greater" : "less"} than $1$, and $${image}$ is ${longer ? "longer" : "shorter"} than $${length}$, as it should be.`,
            `${stepLabel(1, "use the scale factor", "用比例因子")["zh-CN"]}位似把每条线段的长度都乘以比例因子，所以 $A'B' = ${k.toLatex()} \\cdot AB$。\n\n${stepLabel(2, "multiply", "相乘")["zh-CN"]}代入 $AB = ${length}$：${steps(`A'B' = ${k.toLatex()} \\cdot ${length} = ${image}`)}**检验。** 用像的长度除以比例因子，得回原像的长度：$${image} \\div ${k.toLatex()} = ${length} = AB$。比例因子${longer ? "大于" : "小于"} $1$，$${image}$ 也比 $${length}$ ${longer ? "长" : "短"}，与预期一致。`,
          ),
        });
      },
    },
    {
      id: "finding-the-scale-factor",
      title: t("Finding the scale factor", "求比例因子"),
      explanation: t(
        "The scale factor is the ratio of an image length to the matching preimage length:\n\n$$k = \\frac{A'B'}{AB}.$$\n\nIf $AB = 8$ and $A'B' = 20$, then $k = \\frac{20}{8} = \\frac{5}{2}$. Image over preimage, not the other way round.\n\n> **Watch out.** Flipping the ratio gives $\\frac{1}{k}$: here $\\frac{8}{20} = \\frac{2}{5}$, which would mean a reduction, though the image is longer. Put the image on top, and check that $k \\cdot AB = A'B'$.",
        "比例因子是像的长度与对应原像长度之比：\n\n$$k = \\frac{A'B'}{AB}$$\n\n若 $AB = 8$，$A'B' = 20$，则 $k = \\frac{20}{8} = \\frac{5}{2}$。是像比原像，不能颠倒。\n\n> **注意。** 把比颠倒就得到 $\\frac{1}{k}$：这里 $\\frac{8}{20} = \\frac{2}{5}$ 表示缩小，可像明明更长。要把像的长度放在分子上，并检验 $k \\cdot AB = A'B'$。",
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
            `${stepLabel(1, "set up the ratio", "列出比").en} The scale factor is the image length over the preimage length: $k = \\frac{P'Q'}{PQ}$.\n\n${stepLabel(2, "simplify", "化简").en} Put in the lengths:${steps(`k = \\frac{${image}}{${length}} = ${k.toLatex()}`)}**Check.** Multiplying the preimage by $k$ gives the image: $${k.toLatex()} \\cdot ${length} = ${image} = P'Q'$.`,
            `${stepLabel(1, "set up the ratio", "列出比")["zh-CN"]}比例因子是像的长度比原像的长度：$k = \\frac{P'Q'}{PQ}$。\n\n${stepLabel(2, "simplify", "化简")["zh-CN"]}代入两个长度：${steps(`k = \\frac{${image}}{${length}} = ${k.toLatex()}`)}**检验。** 原像长度乘以 $k$ 得到像的长度：$${k.toLatex()} \\cdot ${length} = ${image} = P'Q'$。`,
          ),
        });
      },
    },
    {
      id: "enlargements-and-reductions",
      figure: motionDrawings["enlargements-and-reductions"],
      title: t("Enlargements and reductions", "放大与缩小"),
      explanation: t(
        "The scale factor tells what a dilation does to size:\n\n- $k > 1$: an **enlargement**, the image is larger.\n- $0 < k < 1$: a **reduction**, the image is smaller.\n- $k = 1$: the image is congruent to the preimage.\n\nA scale factor of $\\frac{7}{5}$ enlarges, since $\\frac{7}{5} > 1$; a scale factor of $0.8$ reduces.\n\n> **Watch out.** Compare the scale factor with $1$, not with $0$: every scale factor is positive, yet $\\frac{5}{7}$ still shrinks a figure. A fraction enlarges only when its numerator is larger than its denominator.",
        "比例因子说明位似对大小的影响：\n\n- $k > 1$：**放大**，像比原图形大。\n- $0 < k < 1$：**缩小**，像比原图形小。\n- $k = 1$：像与原图形全等。\n\n比例因子 $\\frac{7}{5}$ 是放大，因为 $\\frac{7}{5} > 1$；比例因子 $0.8$ 是缩小。\n\n> **注意。** 要把比例因子和 $1$ 比较，而不是和 $0$ 比较：比例因子都是正数，可 $\\frac{5}{7}$ 仍然会把图形缩小。分数只有在分子大于分母时才是放大。",
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
        const image = (ab * p) / q;
        const relation = [t("greater than", "大于"), t("less than", "小于"), t("equal to", "等于")][correct]!;
        const size = [t("longer than", "更长"), t("shorter than", "更短"), t("as long as", "一样长")][correct]!;
        const first = byLengths
          ? t(
              `${stepLabel(1, "find the scale factor", "求比例因子").en} Divide the image length by the preimage length: $k = \\frac{${image}}{${ab}} = ${k.toLatex()}$.`,
              `${stepLabel(1, "find the scale factor", "求比例因子")["zh-CN"]}用像的长度除以原像的长度：$k = \\frac{${image}}{${ab}} = ${k.toLatex()}$。`,
            )
          : t(
              `${stepLabel(1, "read the scale factor", "读出比例因子").en} The scale factor is $k = ${k.toLatex()}$.`,
              `${stepLabel(1, "read the scale factor", "读出比例因子")["zh-CN"]}比例因子是 $k = ${k.toLatex()}$。`,
            );
        const check = byLengths
          ? t(
              `**Check.** Compare the lengths directly: the image, $${image}$, is ${size.en} the preimage, $${ab}$.`,
              `**检验。** 直接比较长度：像的长度 $${image}$ 与原像的长度 $${ab}$ 相比${correct === 2 ? "" : "，像"}${size["zh-CN"]}。`,
            )
          : t(
              `**Check.** Dilate a segment of length $${q}$: it becomes $${k.toLatex()} \\cdot ${q} = ${p}$, which is ${size.en} $${q}$.`,
              `**检验。** 对长为 $${q}$ 的线段作位似：它变成 $${k.toLatex()} \\cdot ${q} = ${p}$，与 $${q}$ 相比${correct === 2 ? "" : "，像"}${size["zh-CN"]}。`,
            );
        return reasoned(
          choiceProblem({
            prompt: byLengths
              ? t(
                  `A dilation maps a segment of length $${ab}$ to a segment of length $${image}$. Is it an enlargement or a reduction?`,
                  `一次位似把长为 $${ab}$ 的线段映到长为 $${image}$ 的线段。这是放大还是缩小？`,
                )
              : t(
                  `Is a dilation with scale factor $${k.toLatex()}$ an enlargement or a reduction?`,
                  `比例因子为 $${k.toLatex()}$ 的位似是放大还是缩小？`,
                ),
            options,
            correct,
            solution: t(
              `${first.en}\n\n${stepLabel(2, "compare with 1", "与 1 比较").en} $${k.toLatex()}$ is ${relation.en} $1$, so the answer is: ${options[correct]!.en.toLowerCase()}.\n\n${check.en}`,
              `${first["zh-CN"]}\n\n${stepLabel(2, "compare with 1", "与 1 比较")["zh-CN"]}$${k.toLatex()}$ ${relation["zh-CN"]} $1$，所以答案是：${options[correct]!["zh-CN"]}。\n\n${check["zh-CN"]}`,
            ),
          }),
          [
            [
              options[0]!.en,
              `An enlargement needs a scale factor greater than $1$, and here it is $${k.toLatex()}$.`,
              `放大要求比例因子大于 $1$，而这里它是 $${k.toLatex()}$。`,
            ],
            [
              options[1]!.en,
              `A reduction needs a scale factor less than $1$, and here it is $${k.toLatex()}$.`,
              `缩小要求比例因子小于 $1$，而这里它是 $${k.toLatex()}$。`,
            ],
            [
              options[2]!.en,
              `Lengths stay the same only when the scale factor is $1$, and here it is $${k.toLatex()}$.`,
              `只有比例因子为 $1$ 时长度才不变，而这里它是 $${k.toLatex()}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "distances-from-the-center",
      figure: motionDrawings["distances-from-the-center"],
      title: t("Distances from the center", "到中心的距离"),
      explanation: t(
        "A dilation with center $C$ keeps $C$ fixed and moves each point along its ray from $C$: $CA' = k \\cdot CA$. So the scale factor is $\\frac{CA'}{CA}$, measured from the center, not $\\frac{AA'}{CA}$.\n\nIf $CA = 4$ and $A'$ lies $6$ units beyond $A$, then $CA' = 10$ and $k = \\frac{10}{4} = \\frac{5}{2}$.\n\n> **Watch out.** $AA'$ is how far the point moved, not its distance from the center. Here $\\frac{6}{4} = \\frac{3}{2}$ would put $A'$ at $\\frac{3}{2} \\cdot 4 = 6$ from $C$, not $10$. Find $CA'$ first, adding $AA'$ when $A'$ lies beyond $A$ and subtracting it when $A'$ lies between $C$ and $A$.",
        "以 $C$ 为中心的位似保持 $C$ 不动，把每个点沿从 $C$ 出发的射线移动：$CA' = k \\cdot CA$。所以比例因子是从中心量起的 $\\frac{CA'}{CA}$，而不是 $\\frac{AA'}{CA}$。\n\n若 $CA = 4$，$A'$ 在 $A$ 外侧 $6$ 个单位处，则 $CA' = 10$，$k = \\frac{10}{4} = \\frac{5}{2}$。\n\n> **注意。** $AA'$ 是点移动的距离，不是它到中心的距离。这里 $\\frac{6}{4} = \\frac{3}{2}$ 会让 $A'$ 到 $C$ 的距离是 $\\frac{3}{2} \\cdot 4 = 6$，而不是 $10$。要先求 $CA'$：$A'$ 在 $A$ 外侧时加上 $AA'$，在 $C$ 与 $A$ 之间时减去 $AA'$。",
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
          const points: Mark[] = [
            { kind: "segment", a: o, b: beyond ? pb : pa },
            { kind: "dot", at: o },
            { kind: "dot", at: pa },
            { kind: "dot", at: pb },
            { kind: "label", at: o, text: "C", dir: "w", italic: true },
            { kind: "label", at: pa, text: "A", dir: "n", italic: true },
            { kind: "label", at: pb, text: "A′", dir: "n", italic: true },
          ];
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
                `${stepLabel(1, "measure from the center", "从中心量起").en} $A'$ lies ${beyond ? "beyond $A$" : "between $C$ and $A$"}, so $CA' = ${ca} ${beyond ? "+" : "-"} ${gap} = ${caImage}$.\n\n{{figure 0}}\n\n${stepLabel(2, "divide", "相除").en} The scale factor compares the distances from the center:${steps(`k = \\frac{CA'}{CA} = \\frac{${caImage}}{${ca}} = ${k.toLatex()}`)}**Check.** Dilating $A$ by $k$ should land on $A'$: $${k.toLatex()} \\cdot ${ca} = ${caImage} = CA'$, and $${beyond ? `${caImage} - ${ca}` : `${ca} - ${caImage}`} = ${gap}$ is the given $AA'$ again.`,
                `${stepLabel(1, "measure from the center", "从中心量起")["zh-CN"]}$A'$ 在${beyond ? " $A$ 的外侧" : " $C$ 与 $A$ 之间"}，所以 $CA' = ${ca} ${beyond ? "+" : "-"} ${gap} = ${caImage}$。\n\n{{figure 0}}\n\n${stepLabel(2, "divide", "相除")["zh-CN"]}比例因子比较的是到中心的距离：${steps(`k = \\frac{CA'}{CA} = \\frac{${caImage}}{${ca}} = ${k.toLatex()}`)}**检验。** 把 $A$ 按 $k$ 作位似应落在 $A'$ 上：$${k.toLatex()} \\cdot ${ca} = ${caImage} = CA'$，而 $${beyond ? `${caImage} - ${ca}` : `${ca} - ${caImage}`} = ${gap}$ 正是已知的 $AA'$。`,
              ),
            }),
            figure: figure(
              [
                ...points,
                beyond ? { kind: "side", a: pa, b: o, text: String(ca) } : { kind: "side", a: o, b: pa, text: String(ca) },
                { kind: "side", a: beyond ? pb : pa, b: beyond ? pa : pb, text: String(gap) },
              ],
              `Points C, A and A′ on a ray from C, with CA = ${ca} and AA′ = ${gap}.`,
              `从 C 出发的射线上的点 C、A、A′，CA = ${ca}，AA′ = ${gap}。`,
            ),
            solutionFigures: [
              figure(
                [...points, { kind: "side", a: pb, b: o, text: `CA′ = ${caImage}` }],
                `The distance from C to A′ is ${caImage}.`,
                `C 到 A′ 的距离是 ${caImage}。`,
              ),
            ],
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
