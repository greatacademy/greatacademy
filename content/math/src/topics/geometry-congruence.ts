import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type Point, plane, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps, yesNo } from "../problems.ts";

// Geometry, module 1.3: congruence. The ASA, AAS, SAS, SSS and HL criteria,
// choosing among them, rigid motions, the properties of congruence, and
// two-column proofs of congruence statements.

// ─── Helpers ────────────────────────────────────────────────────────────────

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** m wraps LaTeX as a language-neutral text. */
const m = (tex: string) => same(`$${tex}$`);

/** cat joins texts and plain strings (the same in every locale). */
function cat(...parts: readonly (Text | string)[]): Text {
  const pick = (locale: "en" | "zh-CN") => parts.map((p) => (typeof p === "string" ? p : p[locale])).join("");
  return t(pick("en"), pick("zh-CN"));
}

/** andList joins texts into "a, b and c" (in Chinese "a，b，c"). */
function andList(items: readonly Text[]): Text {
  const en = items.map((i) => i.en);
  const last = en[en.length - 1] ?? "";
  return t(en.length <= 1 ? last : `${en.slice(0, -1).join(", ")} and ${last}`, items.map((i) => i["zh-CN"]).join("，"));
}

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** Unknown is an expression cx + d whose value is target at x. */
interface Unknown {
  readonly c: number;
  readonly d: number;
  readonly x: number;
  readonly target: number;
}

/** unknownFor picks cx + d with a whole x ≥ 2 and a small nonzero d that equals target. */
function unknownFor(rng: Rng, target: number): Unknown {
  for (;;) {
    const c = rng.int(2, 5);
    const x = rng.int(2, 16);
    const d = target - c * x;
    if (d !== 0 && Math.abs(d) <= 30) return { c, d, x, target };
  }
}

/** solveSteps writes the solution of cx + d = target. */
const solveSteps = (u: Unknown) => steps(`${linear(u.c, u.d)} = ${u.target}`, `${linear(u.c, 0)} = ${u.target - u.d}`, `x = ${u.x}`);

/** unknownWrong are the values of x that typical slips produce. */
const unknownWrong = (u: Unknown) => [intOr(u.target + u.d, u.c, -u.x), u.target - u.d, intOr(u.target, u.c, u.x + 1), u.target];

/** pool are letters for points; I and O are left out. */
const pool = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

/** pickLetters picks n distinct letters for the points of a figure. */
const pickLetters = (rng: Rng, n: number): string[] => rng.sample(pool, n);

// ─── Triangles ──────────────────────────────────────────────────────────────

/** Tri is a triangle: vertices 0, 1, 2. Side i is the side opposite vertex i. */
type Tri = readonly [Point, Point, Point];

/** Names are the letters of the vertices of a triangle. */
type Names = readonly [string, string, string];

const nx = (i: number, k = 1) => (i + k) % 3;

/** sideName names side i (opposite vertex i) by its endpoints: "BC". */
const sideName = (n: Names, i: number) => `${n[nx(i)]}${n[nx(i, 2)]}`;

/** seg writes side i as a segment in LaTeX. */
const seg = (n: Names, i: number) => `\\overline{${sideName(n, i)}}`;

/** ang writes the angle at vertex i by one letter. */
const ang = (n: Names, i: number) => `\\angle ${n[i]}`;

/** ang3 writes the angle at vertex i by three letters, for figures where vertices are shared. */
const ang3 = (n: Names, i: number) => `\\angle ${n[nx(i)]}${n[i]}${n[nx(i, 2)]}`;

/** triName writes a triangle with its vertices in the given order. */
const triName = (n: Names, order: readonly number[] = [0, 1, 2]) => `\\triangle ${order.map((i) => n[i]).join("")}`;

/** byAngles draws a triangle with the given angles at vertices 0, 1, 2; vertex 0 at the origin, vertex 1 on the x-axis. */
function byAngles(a: readonly number[]): Tri {
  const [, b, c] = [a[0]!, a[1]!, a[2]!];
  const r = (6 * Math.sin(rad(b))) / Math.sin(rad(c));
  return [
    [0, 0],
    [6, 0],
    [r * Math.cos(rad(a[0]!)), r * Math.sin(rad(a[0]!))],
  ];
}

/** bySides draws a triangle whose side i (opposite vertex i) has length s[i]. */
function bySides(s: readonly number[]): Tri {
  const [a, b, c] = [s[0]!, s[1]!, s[2]!];
  const x = (b * b + c * c - a * a) / (2 * c);
  return [
    [0, 0],
    [c, 0],
    [x, Math.sqrt(Math.max(b * b - x * x, 0))],
  ];
}

/** randomAngles picks whole angles for a triangle that does not look isosceles; with right set, that angle is 90°. */
function randomAngles(rng: Rng, right: number | null = null): [number, number, number] {
  for (;;) {
    if (right !== null) {
      const a = rng.int(28, 62);
      if (Math.abs(a - 45) < 6) continue;
      const out: [number, number, number] = [0, 0, 0];
      out[right] = 90;
      out[nx(right)] = a;
      out[nx(right, 2)] = 90 - a;
      return out;
    }
    const a = rng.int(35, 100);
    const b = rng.int(35, 100);
    const c = 180 - a - b;
    const all = [a, b, c];
    if (c >= 35 && all.every((v) => Math.abs(v - 90) >= 8) && Math.abs(a - b) >= 6 && Math.abs(b - c) >= 6 && Math.abs(a - c) >= 6)
      return [a, b, c];
  }
}

/** area2 is twice the signed area of a polygon: positive when its points run counterclockwise. */
function area2(points: readonly Point[]): number {
  return points.reduce((s, p, i) => {
    const q = points[(i + 1) % points.length]!;
    return s + p[0] * q[1] - q[0] * p[1];
  }, 0);
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
function names(points: readonly Point[], letters: readonly string[], c: Point = center(points)): Mark[] {
  return points.map((at, i) => ({
    kind: "label",
    at,
    text: letters[i]!,
    dir: compassOf(at[0] - c[0], at[1] - c[1]),
    italic: true,
  }));
}

/** Pose turns and maybe mirrors a drawing, so that the second triangle of a pair does not simply copy the first. */
interface Pose {
  readonly turn: number;
  readonly mirror: boolean;
}

const pickPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 180, 20, -20, 160, 200]), mirror: rng.bool() });

/** posed applies a pose to points. */
function posed<T extends readonly Point[]>(points: T, pose: Pose): T {
  const [c, s] = [Math.cos(rad(pose.turn)), Math.sin(rad(pose.turn))];
  return points.map(([x0, y]) => {
    const x = pose.mirror ? -x0 : x0;
    return [x * c - y * s, x * s + y * c] as Point;
  }) as unknown as T;
}

/** box is [minX, maxX, minY, maxY] of some points. */
function box(points: readonly Point[]): [number, number, number, number] {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

/** beside moves the second triangle to the right of the first, centered on it vertically. */
function beside(first: Tri, second: Tri): Tri {
  const [a0, a1, b0, b1] = box(first);
  const [c0, , d0, d1] = box(second);
  const gap = 0.45 * Math.max(a1 - a0, b1 - b0);
  const [dx, dy] = [a1 + gap - c0, (b0 + b1) / 2 - (d0 + d1) / 2];
  return second.map(([x, y]) => [x + dx, y + dy] as Point) as unknown as Tri;
}

/** SideLook marks a side: a number of ticks, a label, or both. */
type SideLook = number | string | { readonly ticks: number; readonly label: string } | null;

/** Look says how to mark a triangle: its sides, its angles (an arc, or an arc with a label) and a right angle. */
interface Look {
  readonly sides?: readonly SideLook[];
  readonly angles?: readonly (string | boolean | null)[];
  readonly right?: number | null;
}

/** triMarks draws a triangle with its vertex letters and marks. */
function triMarks(p: Tri, n: Names, look: Look): Mark[] {
  const marks: Mark[] = [{ kind: "polygon", points: [...p] }];
  const ccw = area2(p) > 0;
  for (let i = 0; i < 3; i++) {
    const [a, b] = [p[nx(i)]!, p[nx(i, 2)]!];
    const s = look.sides?.[i] ?? null;
    const ticks = typeof s === "number" ? s : typeof s === "object" && s !== null ? s.ticks : 0;
    const label = typeof s === "string" ? s : typeof s === "object" && s !== null ? s.label : null;
    if (ticks > 0) marks.push({ kind: "ticks", a, b, count: ticks });
    if (label) marks.push({ kind: "side", a: ccw ? a : b, b: ccw ? b : a, text: label });
    const g = look.angles?.[i] ?? null;
    if (look.right === i) marks.push({ kind: "right", vertex: p[i]!, from: a, to: b });
    else if (g) marks.push({ kind: "arc", vertex: p[i]!, from: a, to: b, label: typeof g === "string" ? g : undefined, accent: true });
  }
  marks.push(...names(p, n));
  return marks;
}

/** pairFigure draws two triangles side by side, the second turned by a pose. */
function pairFigure(
  shape: Tri,
  pose: Pose,
  n1: Names,
  look1: Look,
  n2: Names,
  look2: Look,
  en: string,
  zh: string,
  shape2: Tri = shape,
): Figure {
  const second = beside(shape, posed(shape2, pose));
  return figure([...triMarks(shape, n1, look1), ...triMarks(second, n2, look2)], en, zh);
}

/** pairAlt describes a pair of triangles for screen readers. */
const pairAlt = (n1: Names, n2: Names, extra: Text = t("", "")): [string, string] => [
  `Triangles ${n1.join("")} and ${n2.join("")} with marked parts.${extra.en ? ` ${extra.en}` : ""}`,
  `三角形 ${n1.join("")} 与三角形 ${n2.join("")}，图中标出了部分边和角。${extra["zh-CN"]}`,
];

// ─── Criteria ───────────────────────────────────────────────────────────────

/** Part is a pair of corresponding parts known to be congruent: side or angle i of the first triangle and j (i by default) of the second. */
interface Part {
  readonly side: boolean;
  readonly i: number;
  readonly j?: number;
}

const S = (i: number, j?: number): Part => ({ side: true, i, ...(j !== undefined && { j }) });
const A = (i: number, j?: number): Part => ({ side: false, i, ...(j !== undefined && { j }) });

/** Crit is a congruence criterion, or none when the parts do not prove congruence. */
type Crit = "sss" | "sas" | "asa" | "aas" | "hl" | "none";

/** criterionOf tells which criterion three pairs of parts satisfy; right is the vertex of a right angle in both triangles. */
function criterionOf(parts: readonly Part[], right: number | null): Crit {
  if (parts.some((p) => p.j !== undefined && p.j !== p.i)) return "none";
  const s = parts.filter((p) => p.side).map((p) => p.i);
  const a = parts.filter((p) => !p.side).map((p) => p.i);
  if (s.length === 3) return "sss";
  if (s.length === 2 && a.length === 1) {
    if (a[0] === 3 - s[0]! - s[1]!) return "sas";
    if (right !== null && a[0] === right && s.includes(right)) return "hl";
    return "none";
  }
  if (s.length === 1 && a.length === 2) return s[0] === 3 - a[0]! - a[1]! ? "asa" : "aas";
  return "none";
}

const critNames: Record<Crit, Text> = {
  sss: t("SSS", "SSS（边边边）"),
  sas: t("SAS", "SAS（边角边）"),
  asa: t("ASA", "ASA（角边角）"),
  aas: t("AAS", "AAS（角角边）"),
  hl: t("HL", "HL（斜边、直角边）"),
  none: t("Not enough information", "条件不足，无法判定"),
};

const critOrder: readonly Crit[] = ["sss", "sas", "asa", "aas", "hl", "none"];

/** critWhy explains why three pairs of parts give a criterion, or why they do not. */
function critWhy(parts: readonly Part[], right: number | null): Text {
  const crit = criterionOf(parts, right);
  const sides = parts.filter((p) => p.side).length;
  switch (crit) {
    case "sss":
      return t("All three pairs of sides are congruent, so SSS applies.", "三组对应边都全等，所以用 SSS。");
    case "sas":
      return t(
        "Two pairs of sides are congruent, and the congruent angles lie between them, so SAS applies.",
        "两组对应边全等，且全等的角是这两边的夹角，所以用 SAS。",
      );
    case "asa":
      return t(
        "Two pairs of angles are congruent, and the congruent sides lie between them, so ASA applies.",
        "两组对应角全等，且全等的边是这两个角的夹边，所以用 ASA。",
      );
    case "aas":
      return t(
        "Two pairs of angles are congruent, and the congruent sides do not lie between them, so AAS applies.",
        "两组对应角全等，且全等的边不是这两个角的夹边，所以用 AAS。",
      );
    case "hl":
      return t(
        "Both triangles are right triangles, their hypotenuses are congruent and a pair of legs is congruent, so HL applies.",
        "两个三角形都是直角三角形，斜边全等，且有一组直角边全等，所以用 HL。",
      );
    default:
      if (parts.some((p) => p.j !== undefined && p.j !== p.i))
        return t(
          "The parts marked congruent do not correspond to each other: under the matching of the other two pairs, they sit in different places of the two triangles. No criterion applies.",
          "标为全等的部分并不对应：按另外两组部分的对应关系，它们在两个三角形中的位置不同。没有判定方法适用。",
        );
      if (sides === 0)
        return t(
          "Three pairs of congruent angles (AAA) fix the shape of a triangle but not its size, so they do not prove congruence.",
          "三组角全等（AAA）只确定三角形的形状，不确定大小，不能证明全等。",
        );
      return t(
        "The congruent angles are not between the two pairs of congruent sides (SSA), and SSA does not prove congruence.",
        "全等的角不是两组全等边的夹角（SSA，边边角），SSA 不能证明全等。",
      );
  }
}

/** factText states one pair of congruent parts. */
function factText(p: Part, n1: Names, n2: Names, right: number | null, angle = ang): Text {
  const j = p.j ?? p.i;
  if (p.side) return m(`${seg(n1, p.i)} \\cong ${seg(n2, j)}`);
  if (right !== null && p.i === right && j === right)
    return t(`$${angle(n1, p.i)}$ and $${angle(n2, j)}$ are right angles`, `$${angle(n1, p.i)}$ 和 $${angle(n2, j)}$ 都是直角`);
  return m(`${angle(n1, p.i)} \\cong ${angle(n2, j)}`);
}

/** partsLook marks the parts of the first (which = 0) or second triangle: ticks on sides, arcs on angles. */
function partsLook(parts: readonly Part[], right: number | null, which: 0 | 1): Look {
  const sides: SideLook[] = [null, null, null];
  const angles: (boolean | null)[] = [null, null, null];
  let tick = 0;
  for (const p of parts) {
    const k = which === 0 ? p.i : (p.j ?? p.i);
    if (p.side) sides[k] = ++tick;
    else if (k !== right) angles[k] = true;
  }
  return { sides, angles, right };
}

/** Scenario is three pairs of parts of two triangles, with the right angle if the triangles are right triangles. */
interface Scenario {
  readonly parts: readonly Part[];
  readonly right: number | null;
}

/** scenarioFor picks parts that prove congruence by crit; for none, an SSA, AAA or mismatched case. */
function scenarioFor(rng: Rng, crit: Crit, right: number | null = null): Scenario {
  const k = right ?? rng.int(0, 2);
  const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
  switch (crit) {
    case "sss":
      return { parts: [S(0), S(1), S(2)], right };
    case "sas":
      return { parts: [S(i), A(k), S(j)], right };
    case "asa":
      return { parts: [A(i), S(k), A(j)], right };
    case "aas":
      return { parts: [A(i), A(k), S(rng.pick([i, k]))], right };
    case "hl":
      return { parts: [A(k), S(k), S(i)], right: k };
    default: {
      const kind = rng.int(0, 2);
      if (kind === 0) return { parts: [S(i), S(k), A(i)], right: null };
      if (kind === 1) return { parts: [A(0), A(1), A(2)], right };
      return { parts: [A(i), A(k), S(i, j)], right: null };
    }
  }
}

/** scenarioProblem asks which criterion, if any, proves two triangles congruent; options are the criteria in crits. */
function scenarioProblem(rng: Rng, crit: Crit, crits: readonly Crit[], right: number | null = null): Problem & { figure: Figure } {
  const sc = scenarioFor(rng, crit, right);
  const [a, b, c, d, e, f] = pickLetters(rng, 6) as [string, string, string, string, string, string];
  const [n1, n2]: [Names, Names] = [
    [a, b, c],
    [d, e, f],
  ];
  const facts = rng.shuffle(sc.parts).map((p) => factText(p, n1, n2, sc.right));
  const shape = byAngles(randomAngles(rng, sc.right));
  const answer = criterionOf(sc.parts, sc.right);
  const [en, zh] = pairAlt(n1, n2);
  return {
    ...choiceProblem({
      prompt: cat(
        t("In the figure, ", "图中，"),
        andList(facts),
        t(
          `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
          `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
        ),
      ),
      options: crits.map((x) => critNames[x]),
      correct: crits.indexOf(answer),
      solution: critWhy(sc.parts, sc.right),
    }),
    figure: pairFigure(shape, pickPose(rng), n1, partsLook(sc.parts, sc.right, 0), n2, partsLook(sc.parts, sc.right, 1), en, zh),
  };
}

/** perms are the orderings of three vertices. */
const perms: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

/** pickTwoLetters picks names for two triangles. */
function pickNames(rng: Rng): [Names, Names] {
  const [a, b, c, d, e, f] = pickLetters(rng, 6) as [string, string, string, string, string, string];
  return [
    [a, b, c],
    [d, e, f],
  ];
}

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

// ─── The ASA Congruence Criterion ───────────────────────────────────────────

export const theAsaCongruenceCriterion: TopicDef = {
  id: "the-asa-congruence-criterion",
  title: t("The ASA Congruence Criterion", "ASA 全等判定"),
  summary: t(
    "Read congruence statements, and prove triangles congruent from two angles and the side between them.",
    "读懂全等的表示，并由两角及其夹边证明三角形全等。",
  ),
  prerequisites: ["identifying-angle-theorems", "angles-of-a-triangle"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.2 },
    { topic: "angles-of-a-triangle", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.B.7", "CCSS.HSG.CO.B.8"],
  knowledgePoints: [
    {
      id: "congruence-statements",
      title: t("Congruence statements", "全等的表示"),
      explanation: t(
        "Two triangles are **congruent** ($\\cong$) when they have the same size and shape: their corresponding sides and corresponding angles are equal.\n\nA **congruence statement** lists corresponding vertices in the same order. $\\triangle ABC \\cong \\triangle PQR$ says $A \\leftrightarrow P$, $B \\leftrightarrow Q$ and $C \\leftrightarrow R$, so $\\overline{AB} \\cong \\overline{PQ}$, $\\overline{BC} \\cong \\overline{QR}$, $\\overline{CA} \\cong \\overline{RP}$ and $\\angle A \\cong \\angle P$, $\\angle B \\cong \\angle Q$, $\\angle C \\cong \\angle R$.\n\nIf $\\triangle BCA \\cong \\triangle RPQ$ and $AC = 9$, match by position: $B \\leftrightarrow R$, $C \\leftrightarrow P$, $A \\leftrightarrow Q$, so $\\overline{AC}$ corresponds to $\\overline{QP}$ and $QP = 9$.",
        "两个三角形大小、形状都相同时，称它们**全等**（$\\cong$）：它们的对应边相等，对应角也相等。\n\n**全等式**按相同的顺序写出对应顶点。$\\triangle ABC \\cong \\triangle PQR$ 表示 $A \\leftrightarrow P$，$B \\leftrightarrow Q$，$C \\leftrightarrow R$，所以 $\\overline{AB} \\cong \\overline{PQ}$，$\\overline{BC} \\cong \\overline{QR}$，$\\overline{CA} \\cong \\overline{RP}$，$\\angle A \\cong \\angle P$，$\\angle B \\cong \\angle Q$，$\\angle C \\cong \\angle R$。\n\n若 $\\triangle BCA \\cong \\triangle RPQ$，$AC = 9$，按位置配对：$B \\leftrightarrow R$，$C \\leftrightarrow P$，$A \\leftrightarrow Q$，所以 $\\overline{AC}$ 对应 $\\overline{QP}$，$QP = 9$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const order = rng.pick(perms.slice(1));
        const statement = `${triName(n1, order)} \\cong ${triName(n2, order)}`;
        if (rng.bool()) {
          let sides: number[];
          for (;;) {
            sides = rng.sample([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 3);
            const [a, b, c] = sides as [number, number, number];
            if (a + b > c && b + c > a && a + c > b) break;
          }
          const k = rng.int(0, 2);
          const given = [0, 1, 2].map((i) => `${sideName(n1, i)} = ${sides[i]}`).join(", ");
          const asked = rng.bool() ? sideName(n2, k) : `${n2[nx(k, 2)]}${n2[nx(k)]}`;
          return numberProblem({
            prompt: t(
              `$${statement}$. In $${triName(n1)}$, $${given}$. Find $${asked}$.`,
              `$${statement}$。在 $${triName(n1)}$ 中，$${given}$。求 $${asked}$。`,
            ),
            answer: sides[k]!,
            form: "integer",
            wrong: sides.filter((_, i) => i !== k),
            solution: t(
              `The statement matches the vertices by position: $${order.map((i) => `${n1[i]} \\leftrightarrow ${n2[i]}`).join(",\\ ")}$. So $\\overline{${asked}}$ corresponds to $${seg(n1, k)}$, and $${asked} = ${sides[k]}$.`,
              `全等式按位置配对顶点：$${order.map((i) => `${n1[i]} \\leftrightarrow ${n2[i]}`).join(",\\ ")}$。所以 $\\overline{${asked}}$ 对应 $${seg(n1, k)}$，$${asked} = ${sides[k]}$。`,
            ),
          });
        }
        const angles = randomAngles(rng);
        const k = rng.int(0, 2);
        const given = [0, 1, 2].map((i) => `m${ang(n1, i)} = ${angles[i]}^\\circ`).join(", ");
        return numberProblem({
          prompt: t(
            `$${statement}$. In $${triName(n1)}$, $${given}$. Find $m${ang(n2, k)}$.`,
            `$${statement}$。在 $${triName(n1)}$ 中，$${given}$。求 $m${ang(n2, k)}$。`,
          ),
          answer: angles[k]!,
          unit: "°",
          form: "integer",
          wrong: angles.filter((_, i) => i !== k),
          solution: t(
            `The statement matches the vertices by position: $${order.map((i) => `${n1[i]} \\leftrightarrow ${n2[i]}`).join(",\\ ")}$. So $${ang(n2, k)}$ corresponds to $${ang(n1, k)}$, and $m${ang(n2, k)} = ${angles[k]}^\\circ$.`,
            `全等式按位置配对顶点：$${order.map((i) => `${n1[i]} \\leftrightarrow ${n2[i]}`).join(",\\ ")}$。所以 $${ang(n2, k)}$ 对应 $${ang(n1, k)}$，$m${ang(n2, k)} = ${angles[k]}^\\circ$。`,
          ),
        });
      },
    },
    {
      id: "applying-asa",
      title: t("The ASA criterion", "ASA 判定"),
      explanation: t(
        "Checking all six pairs of parts is not necessary. The **ASA (angle–side–angle) criterion**: if two angles and the **included side** (the side between them) of one triangle are congruent to two angles and the included side of another, the triangles are congruent.\n\nIn $\\triangle ABC$ the side between $\\angle A$ and $\\angle B$ is $\\overline{AB}$. So if $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$, the fact that completes ASA is $\\overline{AB} \\cong \\overline{DE}$. The sides must correspond too: $\\overline{AB} \\cong \\overline{EF}$ would not do.\n\nIn figures, congruent sides carry the same number of tick marks, and congruent angles are marked with arcs.",
        "不必检查全部六组对应部分。**ASA（角边角）判定**：如果一个三角形的两个角及其**夹边**（两角之间的边）分别与另一个三角形的两个角及其夹边全等，那么这两个三角形全等。\n\n在 $\\triangle ABC$ 中，$\\angle A$ 与 $\\angle B$ 之间的边是 $\\overline{AB}$。所以若 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$，补上 $\\overline{AB} \\cong \\overline{DE}$ 就满足 ASA。边也必须对应：$\\overline{AB} \\cong \\overline{EF}$ 不行。\n\n图中，全等的边画相同数目的短线，全等的角用弧标出。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const askSide = rng.bool();
        const known = askSide ? [A(i), A(j)] : [A(i), S(k)];
        const right = askSide ? S(k) : A(j);
        const wrong = askSide ? [S(k, i), S(i, j), A(k)] : [A(j, k), S(i), A(k, j)];
        const options = [right, ...wrong].map((p) => factText(p, n1, n2, null));
        const shuffled = rng.shuffle(options);
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...choiceProblem({
            prompt: cat(
              t("Given ", "已知 "),
              andList(known.map((p) => factText(p, n1, n2, null))),
              t(
                `, which other fact proves $${triName(n1)} \\cong ${triName(n2)}$ by ASA?`,
                `，再加上哪个条件就能由 ASA 证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
              ),
            ),
            options: shuffled,
            correct: shuffled.indexOf(options[0]!),
            solution: askSide
              ? t(
                  `ASA needs the side between the two angles. In $${triName(n1)}$ the side between $${ang(n1, i)}$ and $${ang(n1, j)}$ is $${seg(n1, k)}$, and it corresponds to $${seg(n2, k)}$: $${seg(n1, k)} \\cong ${seg(n2, k)}$.`,
                  `ASA 需要两角的夹边。在 $${triName(n1)}$ 中，$${ang(n1, i)}$ 与 $${ang(n1, j)}$ 之间的边是 $${seg(n1, k)}$，它对应 $${seg(n2, k)}$：$${seg(n1, k)} \\cong ${seg(n2, k)}$。`,
                )
              : t(
                  `ASA needs the angles at both ends of the congruent side. $${seg(n1, k)}$ joins $${n1[i]}$ and $${n1[j]}$, so with $${ang(n1, i)} \\cong ${ang(n2, i)}$ the missing fact is $${ang(n1, j)} \\cong ${ang(n2, j)}$.`,
                  `ASA 需要全等边两端的角。$${seg(n1, k)}$ 连接 $${n1[i]}$ 和 $${n1[j]}$，已有 $${ang(n1, i)} \\cong ${ang(n2, i)}$，还缺 $${ang(n1, j)} \\cong ${ang(n2, j)}$。`,
                ),
          }),
          figure: pairFigure(
            byAngles(randomAngles(rng)),
            pickPose(rng),
            n1,
            partsLook(known, null, 0),
            n2,
            partsLook(known, null, 1),
            en,
            zh,
          ),
        };
      },
    },
    {
      id: "solving-with-asa",
      title: t("Unknowns in ASA", "ASA 中的未知量"),
      explanation: t(
        "When two triangles are congruent by ASA, each marked measure of one triangle equals the corresponding measure of the other. That gives an equation for an unknown.\n\nIf $\\angle A \\cong \\angle D$, $\\angle B \\cong \\angle E$ and $\\overline{AB} \\cong \\overline{DE}$ with $AB = 14$ and $DE = 3x + 2$, then $3x + 2 = 14$, so $3x = 12$ and $x = 4$.",
        "两个三角形由 ASA 全等时，一个三角形中标出的量等于另一个三角形中的对应量。由此可以列方程求未知数。\n\n若 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$，$\\overline{AB} \\cong \\overline{DE}$，且 $AB = 14$，$DE = 3x + 2$，则 $3x + 2 = 14$，所以 $3x = 12$，$x = 4$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const angles = randomAngles(rng);
        const k = rng.int(0, 2);
        const [i, j] = [nx(k), nx(k, 2)];
        const s = rng.int(6, 30);
        const unknownAngle = rng.bool();
        const target = unknownAngle ? angles[i]! : s;
        const u = unknownFor(rng, target);
        const sides1: SideLook[] = [null, null, null];
        const sides2: SideLook[] = [null, null, null];
        sides1[k] = String(s);
        sides2[k] = unknownAngle ? String(s) : plain(u.c, u.d);
        const angles1: (string | null)[] = [null, null, null];
        const angles2: (string | null)[] = [null, null, null];
        angles1[i] = deg(angles[i]!);
        angles1[j] = deg(angles[j]!);
        angles2[i] = unknownAngle ? `(${plain(u.c, u.d)})°` : deg(angles[i]!);
        angles2[j] = deg(angles[j]!);
        const [en, zh] = pairAlt(n1, n2);
        const part = unknownAngle ? `m${ang(n2, i)}` : sideName(n2, k);
        const matching = unknownAngle ? `m${ang(n1, i)}` : sideName(n1, k);
        return {
          ...numberProblem({
            prompt: t(
              `The marked parts show that $${triName(n1)} \\cong ${triName(n2)}$ by ASA. Find $x$.`,
              `图中标出的部分说明 $${triName(n1)} \\cong ${triName(n2)}$（ASA）。求 $x$。`,
            ),
            answer: u.x,
            form: "integer",
            solveFor: "x",
            wrong: unknownWrong(u),
            solution: t(
              `Corresponding parts of the congruent triangles are equal, so $${part} = ${matching}$:${solveSteps(u)}`,
              `全等三角形的对应部分相等，所以 $${part} = ${matching}$：${solveSteps(u)}`,
            ),
          }),
          figure: pairFigure(
            byAngles(angles),
            pickPose(rng),
            n1,
            { sides: sides1, angles: angles1 },
            n2,
            { sides: sides2, angles: angles2 },
            en,
            zh,
          ),
        };
      },
    },
  ],
};

// ─── The AAS Congruence Criterion ───────────────────────────────────────────

export const theAasCongruenceCriterion: TopicDef = {
  id: "the-aas-congruence-criterion",
  title: t("The AAS Congruence Criterion", "AAS 全等判定"),
  summary: t(
    "Prove triangles congruent from two angles and a side that is not between them, and tell AAS from ASA.",
    "由两角及其中一角的对边证明三角形全等，并区分 AAS 与 ASA。",
  ),
  prerequisites: ["the-asa-congruence-criterion"],
  encompasses: [
    { topic: "the-asa-congruence-criterion", weight: 0.4 },
    { topic: "angles-of-a-triangle", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "third-angles",
      title: t("Why AAS works", "AAS 为什么成立"),
      explanation: t(
        "If two angles of one triangle are congruent to two angles of another, the third angles are congruent too, because each triangle's angles add up to $180^\\circ$.\n\nThat is why the **AAS (angle–angle–side) criterion** holds: two angles and a **non-included side** (a side not between them) of one triangle congruent to the corresponding parts of another make the triangles congruent. Once the third angles are known to match, the side lies between two matching angles, and ASA applies.\n\nIf $m\\angle A = m\\angle D = 50^\\circ$ and $m\\angle B = m\\angle E = 75^\\circ$, then $m\\angle C = m\\angle F = 180^\\circ - 50^\\circ - 75^\\circ = 55^\\circ$.",
        "如果一个三角形的两个角与另一个三角形的两个角分别全等，那么第三个角也全等，因为每个三角形的内角和都是 $180^\\circ$。\n\n这就是 **AAS（角角边）判定**成立的原因：一个三角形的两个角及一条**非夹边**（不在两角之间的边）与另一个三角形的对应部分全等，则两个三角形全等。第三个角对应相等后，这条边就位于两组相等的角之间，可以用 ASA。\n\n若 $m\\angle A = m\\angle D = 50^\\circ$，$m\\angle B = m\\angle E = 75^\\circ$，则 $m\\angle C = m\\angle F = 180^\\circ - 50^\\circ - 75^\\circ = 55^\\circ$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const angles = randomAngles(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const s = rng.pick([i, j]);
        const parts = [A(i), A(j), S(s)];
        const [en, zh] = pairAlt(n1, n2);
        const look1: Look = {
          angles: [0, 1, 2].map((v) => (v === i || v === j ? deg(angles[v]!) : null)),
          sides: [0, 1, 2].map((v) => (v === s ? 1 : null)),
        };
        return {
          ...numberProblem({
            prompt: cat(
              t("In the figure, ", "图中，"),
              andList(parts.map((p) => factText(p, n1, n2, null))),
              t(
                `, so $${triName(n1)} \\cong ${triName(n2)}$ by AAS. Find $m${ang(n2, k)}$.`,
                `，所以由 AAS 得 $${triName(n1)} \\cong ${triName(n2)}$。求 $m${ang(n2, k)}$。`,
              ),
            ),
            answer: angles[k]!,
            unit: "°",
            form: "integer",
            wrong: [angles[i]! + angles[j]!, 180 - angles[i]!, 180 - angles[j]!, 360 - angles[i]! - angles[j]!],
            solution: t(
              `$${ang(n2, k)}$ corresponds to $${ang(n1, k)}$, the third angle of $${triName(n1)}$:${steps(`m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ`)}So $m${ang(n2, k)} = ${angles[k]}^\\circ$.`,
              `$${ang(n2, k)}$ 对应 $${ang(n1, k)}$，即 $${triName(n1)}$ 的第三个角：${steps(`m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ`)}所以 $m${ang(n2, k)} = ${angles[k]}^\\circ$。`,
            ),
          }),
          figure: pairFigure(byAngles(angles), pickPose(rng), n1, look1, n2, partsLook(parts, null, 1), en, zh),
        };
      },
    },
    {
      id: "asa-or-aas",
      title: t("ASA or AAS", "ASA 还是 AAS"),
      explanation: t(
        "With two pairs of congruent angles and one pair of congruent sides, look at where the side is:\n\n- between the two angles: **ASA**;\n- not between them: **AAS**;\n- not a pair of corresponding sides at all: neither criterion applies.\n\nGiven $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$: with $\\overline{AB} \\cong \\overline{DE}$ it is ASA; with $\\overline{BC} \\cong \\overline{EF}$ it is AAS; with $\\overline{BC} \\cong \\overline{DF}$ the sides do not correspond, and the triangles are not shown to be congruent.",
        "有两组全等的角和一组全等的边时，看这条边的位置：\n\n- 在两角之间：**ASA**；\n- 不在两角之间：**AAS**；\n- 根本不是一组对应边：两种判定都不适用。\n\n已知 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$：若 $\\overline{AB} \\cong \\overline{DE}$，用 ASA；若 $\\overline{BC} \\cong \\overline{EF}$，用 AAS；若 $\\overline{BC} \\cong \\overline{DF}$，两边不对应，不能证明两个三角形全等。",
      ),
      generate(rng) {
        const crit = rng.pick<Crit>(["asa", "aas", "asa", "aas", "none"]);
        let sc: Scenario;
        if (crit === "none") {
          const k = rng.int(0, 2);
          const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
          sc = { parts: [A(i), A(j), rng.bool() ? S(i, k) : S(k, i)], right: null };
        } else sc = scenarioFor(rng, crit);
        const [n1, n2] = pickNames(rng);
        const options: Crit[] = ["asa", "aas", "none"];
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...choiceProblem({
            prompt: cat(
              t("In the figure, ", "图中，"),
              andList(rng.shuffle(sc.parts).map((p) => factText(p, n1, n2, null))),
              t(
                `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
                `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
              ),
            ),
            options: options.map((x) => critNames[x]),
            correct: options.indexOf(criterionOf(sc.parts, null)),
            solution: critWhy(sc.parts, null),
          }),
          figure: pairFigure(
            byAngles(randomAngles(rng)),
            pickPose(rng),
            n1,
            partsLook(sc.parts, null, 0),
            n2,
            partsLook(sc.parts, null, 1),
            en,
            zh,
          ),
        };
      },
    },
    {
      id: "solving-with-aas",
      title: t("Unknowns in AAS", "AAS 中的未知量"),
      explanation: t(
        "When the angle marked with an unknown is not one of the angles shown in the other triangle, find its partner first with the angle sum.\n\nSuppose $\\triangle ABC \\cong \\triangle DEF$ by AAS, with $m\\angle A = 40^\\circ$ and $m\\angle B = 65^\\circ$, and $m\\angle F = (2x + 15)^\\circ$. The partner of $\\angle F$ is $\\angle C$, and $m\\angle C = 180^\\circ - 40^\\circ - 65^\\circ = 75^\\circ$. So $2x + 15 = 75$, $2x = 60$ and $x = 30$.",
        "若带未知数的角在另一个三角形中没有标出，先用内角和求出它的对应角。\n\n设 $\\triangle ABC \\cong \\triangle DEF$（AAS），$m\\angle A = 40^\\circ$，$m\\angle B = 65^\\circ$，$m\\angle F = (2x + 15)^\\circ$。$\\angle F$ 的对应角是 $\\angle C$，$m\\angle C = 180^\\circ - 40^\\circ - 65^\\circ = 75^\\circ$。所以 $2x + 15 = 75$，$2x = 60$，$x = 30$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const angles = randomAngles(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const s = rng.int(6, 30);
        const u = unknownFor(rng, angles[k]!);
        const sides: SideLook[] = [null, null, null];
        sides[i] = String(s);
        const angles1: (string | null)[] = [null, null, null];
        const angles2: (string | null)[] = [null, null, null];
        angles1[i] = deg(angles[i]!);
        angles1[j] = deg(angles[j]!);
        angles2[i] = deg(angles[i]!);
        angles2[k] = `(${plain(u.c, u.d)})°`;
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $${triName(n1)} \\cong ${triName(n2)}$ by AAS. Find $x$.`,
              `图中，由 AAS 得 $${triName(n1)} \\cong ${triName(n2)}$。求 $x$。`,
            ),
            answer: u.x,
            form: "integer",
            solveFor: "x",
            wrong: [...unknownWrong(u), intOr(angles[j]! - u.d, u.c, -u.x)],
            solution: t(
              `$${ang(n2, k)}$ corresponds to $${ang(n1, k)}$, and $m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ$. So:${solveSteps(u)}`,
              `$${ang(n2, k)}$ 对应 $${ang(n1, k)}$，而 $m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ$。所以：${solveSteps(u)}`,
            ),
          }),
          figure: pairFigure(byAngles(angles), pickPose(rng), n1, { sides, angles: angles1 }, n2, { sides, angles: angles2 }, en, zh),
        };
      },
    },
  ],
};

// ─── The SAS Congruence Criterion ───────────────────────────────────────────

export const theSasCongruenceCriterion: TopicDef = {
  id: "the-sas-congruence-criterion",
  title: t("The SAS Congruence Criterion", "SAS 全等判定"),
  summary: t(
    "Prove triangles congruent from two sides and the angle between them, and see why SSA does not work.",
    "由两边及其夹角证明三角形全等，并理解为什么 SSA 不行。",
  ),
  prerequisites: ["the-asa-congruence-criterion"],
  encompasses: [
    { topic: "the-asa-congruence-criterion", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "included-angles",
      title: t("Included angles", "夹角"),
      explanation: t(
        "The **included angle** of two sides of a triangle is the angle between them, at the vertex they share.\n\nIn $\\triangle PQR$, the sides $\\overline{PQ}$ and $\\overline{QR}$ share the vertex $Q$, so their included angle is $\\angle Q$. Conversely, $\\angle P$ is included between the two sides that end at $P$: $\\overline{PQ}$ and $\\overline{PR}$.",
        "三角形两边的**夹角**是这两边之间的角，顶点是两边的公共端点。\n\n在 $\\triangle PQR$ 中，$\\overline{PQ}$ 与 $\\overline{QR}$ 的公共端点是 $Q$，所以它们的夹角是 $\\angle Q$。反过来，$\\angle P$ 是以 $P$ 为端点的两边 $\\overline{PQ}$ 与 $\\overline{PR}$ 的夹角。",
      ),
      generate(rng) {
        const n = pickLetters(rng, 3) as unknown as Names;
        const k = rng.int(0, 2);
        const fig = figure(
          triMarks(posed(byAngles(randomAngles(rng)), pickPose(rng)), n, {}),
          `Triangle ${n.join("")}.`,
          `三角形 ${n.join("")}。`,
        );
        if (rng.bool()) {
          const [p, q] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
          return {
            ...choiceProblem({
              prompt: t(
                `Which angle of $${triName(n)}$ is included between $${seg(n, p)}$ and $${seg(n, q)}$?`,
                `$${triName(n)}$ 中，$${seg(n, p)}$ 与 $${seg(n, q)}$ 的夹角是哪个角？`,
              ),
              options: [0, 1, 2].map((v) => m(ang(n, v))),
              correct: k,
              solution: t(
                `$${seg(n, p)}$ and $${seg(n, q)}$ both end at $${n[k]}$, so the angle between them is $${ang(n, k)}$.`,
                `$${seg(n, p)}$ 与 $${seg(n, q)}$ 都以 $${n[k]}$ 为端点，所以它们的夹角是 $${ang(n, k)}$。`,
              ),
            }),
            figure: fig,
          };
        }
        const pairs = [0, 1, 2].map((v) => [nx(v), nx(v, 2)] as const);
        return {
          ...choiceProblem({
            prompt: t(
              `In $${triName(n)}$, $${ang(n, k)}$ is the included angle of which two sides?`,
              `在 $${triName(n)}$ 中，$${ang(n, k)}$ 是哪两条边的夹角？`,
            ),
            options: pairs.map(([p, q]) => t(`$${seg(n, p)}$ and $${seg(n, q)}$`, `$${seg(n, p)}$ 与 $${seg(n, q)}$`)),
            correct: k,
            solution: t(
              `The included sides of $${ang(n, k)}$ are the two sides that end at $${n[k]}$: $${seg(n, nx(k))}$ and $${seg(n, nx(k, 2))}$.`,
              `$${ang(n, k)}$ 的两条边是以 $${n[k]}$ 为端点的两边：$${seg(n, nx(k))}$ 与 $${seg(n, nx(k, 2))}$。`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "applying-sas",
      title: t("The SAS criterion", "SAS 判定"),
      explanation: t(
        "The **SAS (side–angle–side) criterion**: if two sides and the included angle of one triangle are congruent to two sides and the included angle of another, the triangles are congruent.\n\nThe angle must be the one between the sides. Two sides and an angle that is not between them (**SSA**) do not prove congruence: the third side can swing into two different positions. With $\\overline{AB} \\cong \\overline{DE}$ and $\\overline{BC} \\cong \\overline{EF}$, the angle for SAS is $\\angle B \\cong \\angle E$; $\\angle A \\cong \\angle D$ would be SSA.",
        "**SAS（边角边）判定**：如果一个三角形的两边及其夹角分别与另一个三角形的两边及其夹角全等，那么这两个三角形全等。\n\n这个角必须是两边的夹角。两边及其中一边的对角（**SSA**，边边角）不能证明全等：第三边可以摆到两个不同的位置。已知 $\\overline{AB} \\cong \\overline{DE}$，$\\overline{BC} \\cong \\overline{EF}$，SAS 需要的角是 $\\angle B \\cong \\angle E$；$\\angle A \\cong \\angle D$ 则是 SSA。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const kind = rng.pick([0, 0, 1, 2]);
        const parts = kind === 0 ? [S(i), A(k), S(j)] : kind === 1 ? [S(i), A(i), S(j)] : [S(i), A(k, i), S(j)];
        const yes = kind === 0;
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...choiceProblem({
            prompt: cat(
              t("In the figure, ", "图中，"),
              andList(parts.map((p) => factText(p, n1, n2, null))),
              t(
                `. Do these facts prove $${triName(n1)} \\cong ${triName(n2)}$ by SAS?`,
                `。这些条件能由 SAS 证明 $${triName(n1)} \\cong ${triName(n2)}$ 吗？`,
              ),
            ),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: yes
              ? t(
                  `Yes. $${ang(n1, k)}$ is between $${seg(n1, i)}$ and $${seg(n1, j)}$, and $${ang(n2, k)}$ is between the corresponding sides of $${triName(n2)}$.`,
                  `能。$${ang(n1, k)}$ 是 $${seg(n1, i)}$ 与 $${seg(n1, j)}$ 的夹角，$${ang(n2, k)}$ 也是 $${triName(n2)}$ 中对应两边的夹角。`,
                )
              : kind === 1
                ? t(
                    `No. $${ang(n1, i)}$ is not between $${seg(n1, i)}$ and $${seg(n1, j)}$ (the included angle is $${ang(n1, k)}$). This is SSA, which does not prove congruence.`,
                    `不能。$${ang(n1, i)}$ 不是 $${seg(n1, i)}$ 与 $${seg(n1, j)}$ 的夹角（夹角是 $${ang(n1, k)}$）。这是 SSA，不能证明全等。`,
                  )
                : t(
                    `No. $${ang(n1, k)}$ is between the sides in $${triName(n1)}$, but $${ang(n2, i)}$ is not the corresponding angle: the angle between $${seg(n2, i)}$ and $${seg(n2, j)}$ is $${ang(n2, k)}$.`,
                    `不能。$${ang(n1, k)}$ 是 $${triName(n1)}$ 中两边的夹角，但 $${ang(n2, i)}$ 不是它的对应角：$${seg(n2, i)}$ 与 $${seg(n2, j)}$ 的夹角是 $${ang(n2, k)}$。`,
                  ),
          }),
          figure: pairFigure(
            byAngles(randomAngles(rng)),
            pickPose(rng),
            n1,
            partsLook(parts, null, 0),
            n2,
            partsLook(parts, null, 1),
            en,
            zh,
          ),
        };
      },
    },
    {
      id: "solving-with-sas",
      title: t("Unknowns in SAS", "SAS 中的未知量"),
      explanation: t(
        "Once two triangles are congruent by SAS, every pair of corresponding parts is equal, including the parts that were not marked.\n\nIf $\\overline{AB} \\cong \\overline{DE}$, $\\angle B \\cong \\angle E$ and $\\overline{BC} \\cong \\overline{EF}$, then $\\triangle ABC \\cong \\triangle DEF$, so the third sides match as well: with $AC = 17$ and $DF = 4x - 3$, $4x - 3 = 17$, $4x = 20$ and $x = 5$.",
        "两个三角形由 SAS 全等后，每组对应部分都相等，包括没有标出的部分。\n\n若 $\\overline{AB} \\cong \\overline{DE}$，$\\angle B \\cong \\angle E$，$\\overline{BC} \\cong \\overline{EF}$，则 $\\triangle ABC \\cong \\triangle DEF$，所以第三边也相等：若 $AC = 17$，$DF = 4x - 3$，则 $4x - 3 = 17$，$4x = 20$，$x = 5$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const angles = randomAngles(rng);
        const shape = byAngles(angles);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const lengths = [0, 1, 2].map((v) => {
          const [p, q] = [shape[nx(v)]!, shape[nx(v, 2)]!];
          return Math.round(Math.hypot(p[0] - q[0], p[1] - q[1]) * 3);
        });
        const third = rng.bool();
        const target = third ? lengths[k]! : lengths[i]!;
        const u = unknownFor(rng, target);
        const sides1: SideLook[] = [null, null, null];
        const sides2: SideLook[] = [null, null, null];
        sides1[i] = { ticks: 1, label: String(lengths[i]) };
        sides1[j] = { ticks: 2, label: String(lengths[j]) };
        sides2[i] = third ? 1 : { ticks: 1, label: plain(u.c, u.d) };
        sides2[j] = 2;
        if (third) {
          sides1[k] = String(lengths[k]);
          sides2[k] = plain(u.c, u.d);
        }
        const angles1: (string | boolean | null)[] = [null, null, null];
        angles1[k] = true;
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $${triName(n1)} \\cong ${triName(n2)}$ by SAS. Find $x$.`,
              `图中，由 SAS 得 $${triName(n1)} \\cong ${triName(n2)}$。求 $x$。`,
            ),
            answer: u.x,
            form: "integer",
            solveFor: "x",
            wrong: [...unknownWrong(u), intOr(lengths[third ? i : j]! - u.d, u.c, -u.x)],
            solution: t(
              `$${seg(n2, third ? k : i)}$ corresponds to $${seg(n1, third ? k : i)}$, so $${sideName(n2, third ? k : i)} = ${target}$:${solveSteps(u)}`,
              `$${seg(n2, third ? k : i)}$ 对应 $${seg(n1, third ? k : i)}$，所以 $${sideName(n2, third ? k : i)} = ${target}$：${solveSteps(u)}`,
            ),
          }),
          figure: pairFigure(shape, pickPose(rng), n1, { sides: sides1, angles: angles1 }, n2, { sides: sides2, angles: angles1 }, en, zh),
        };
      },
    },
  ],
};

// ─── The SSS Congruence Criterion ───────────────────────────────────────────

/** pickSides picks three different whole side lengths of a triangle that is not too flat. */
function pickSides(rng: Rng, lo = 4, hi = 16): [number, number, number] {
  for (;;) {
    const [a, b, c] = rng.sample(
      Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
      3,
    ) as [number, number, number];
    if (a + b > c + 2 && b + c > a + 2 && a + c > b + 2) return [a, b, c];
  }
}

export const theSssCongruenceCriterion: TopicDef = {
  id: "the-sss-congruence-criterion",
  title: t("The SSS Congruence Criterion", "SSS 全等判定"),
  summary: t(
    "Prove triangles congruent from three pairs of sides, and write the congruence statement that matches the sides.",
    "由三组边证明三角形全等，并写出与各边对应的全等式。",
  ),
  prerequisites: ["the-sas-congruence-criterion"],
  encompasses: [
    { topic: "the-sas-congruence-criterion", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "applying-sss",
      title: t("The SSS criterion", "SSS 判定"),
      explanation: t(
        "The **SSS (side–side–side) criterion**: if the three sides of one triangle are congruent to the three sides of another, the triangles are congruent. Three side lengths fix a triangle completely.\n\nTo check, compare the side lengths sorted by size. A triangle with sides $5$, $7$, $9$ is congruent to one with sides $9$, $5$, $7$, but not to one with sides $5$, $7$, $10$.",
        "**SSS（边边边）判定**：如果一个三角形的三条边分别与另一个三角形的三条边全等，那么这两个三角形全等。三条边长完全确定一个三角形。\n\n检查时，把两组边长按大小排好再比较。边长为 $5$、$7$、$9$ 的三角形与边长为 $9$、$5$、$7$ 的三角形全等，但与边长为 $5$、$7$、$10$ 的三角形不全等。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const sides = pickSides(rng);
        const yes = rng.bool();
        const other = [...sides];
        if (!yes) {
          for (;;) {
            const k = rng.int(0, 2);
            const v = sides[k]! + rng.pick([-2, -1, 1, 2]);
            const next = sides.map((s, i) => (i === k ? v : s));
            const [a, b, c] = next as [number, number, number];
            if (!sides.includes(v) && a + b > c && b + c > a && a + c > b) {
              other.splice(0, 3, ...next);
              break;
            }
          }
        }
        const order = rng.pick(perms);
        const shown = order.map((i) => other[i]!);
        const look1: Look = { sides: sides.map(String) };
        const look2: Look = { sides: shown.map(String) };
        const [en, zh] = pairAlt(n1, n2);
        const sorted = (s: readonly number[]) => [...s].sort((a, b) => a - b).join(", ");
        return {
          ...choiceProblem({
            prompt: t(
              `Are $${triName(n1)}$ and $${triName(n2)}$ congruent by SSS?`,
              `$${triName(n1)}$ 与 $${triName(n2)}$ 能由 SSS 判定全等吗？`,
            ),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: yes
              ? t(
                  `Sorted, the sides are $${sorted(sides)}$ in both triangles, so the three sides match in pairs and the triangles are congruent by SSS.`,
                  `按大小排列，两个三角形的边长都是 $${sorted(sides)}$，三条边一一对应相等，所以由 SSS 得两个三角形全等。`,
                )
              : t(
                  `Sorted, the sides are $${sorted(sides)}$ and $${sorted(shown)}$. They do not all match, so SSS does not apply.`,
                  `按大小排列，边长分别是 $${sorted(sides)}$ 和 $${sorted(shown)}$，并不都相等，所以不能用 SSS。`,
                ),
          }),
          figure: pairFigure(bySides(sides), pickPose(rng), n1, look1, n2, look2, en, zh, bySides(shown)),
        };
      },
    },
    {
      id: "matching-vertices",
      title: t("Matching the vertices", "对应顶点"),
      explanation: t(
        "To write the congruence statement, match the sides by length, then match the vertices: a vertex is where its two sides meet.\n\nIf $AB = 6$, $BC = 8$, $CA = 11$ and $DE = 8$, $EF = 11$, $FD = 6$: $\\overline{AB} \\leftrightarrow \\overline{FD}$ and $\\overline{BC} \\leftrightarrow \\overline{DE}$. $B$ is on both $\\overline{AB}$ and $\\overline{BC}$, so it matches the point on both $\\overline{FD}$ and $\\overline{DE}$, which is $D$. In the same way $A \\leftrightarrow F$ and $C \\leftrightarrow E$, so $\\triangle ABC \\cong \\triangle FDE$.",
        "要写出全等式，先按长度配对各边，再配对顶点：顶点是它的两条边的公共点。\n\n若 $AB = 6$，$BC = 8$，$CA = 11$，$DE = 8$，$EF = 11$，$FD = 6$：$\\overline{AB} \\leftrightarrow \\overline{FD}$，$\\overline{BC} \\leftrightarrow \\overline{DE}$。$B$ 同时在 $\\overline{AB}$ 和 $\\overline{BC}$ 上，所以它对应同时在 $\\overline{FD}$ 和 $\\overline{DE}$ 上的点，即 $D$。同理 $A \\leftrightarrow F$，$C \\leftrightarrow E$，所以 $\\triangle ABC \\cong \\triangle FDE$。",
      ),
      generate(rng) {
        const [n1, base] = pickNames(rng);
        const sides = pickSides(rng);
        // The second triangle names its vertex v by base[sigma[v]]; vertex v corresponds to vertex v of the first.
        const sigma = rng.pick(perms.slice(1));
        const n2: Names = [base[sigma[0]]!, base[sigma[1]]!, base[sigma[2]]!];
        const given1 = [0, 1, 2].map((v) => `${sideName(n1, v)} = ${sides[v]}`).join(", ");
        const given2 = rng
          .shuffle([0, 1, 2])
          .map((v) => `${sideName(n2, v)} = ${sides[v]}`)
          .join(", ");
        const correct = triName(n2);
        const wrongs = rng.sample(
          perms.filter((p) => triName(n2, p) !== correct),
          3,
        );
        const options = [m(`${triName(n1)} \\cong ${correct}`), ...wrongs.map((p) => m(`${triName(n1)} \\cong ${triName(n2, p)}`))];
        const shuffled = rng.shuffle(options);
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...choiceProblem({
            prompt: t(
              `$${given1}$, and $${given2}$. Which congruence statement is correct?`,
              `$${given1}$，$${given2}$。哪个全等式是正确的？`,
            ),
            options: shuffled,
            correct: shuffled.indexOf(options[0]!),
            solution: t(
              `Match the sides by length: ${[0, 1, 2].map((v) => `$\\overline{${sideName(n1, v)}} \\leftrightarrow \\overline{${sideName(n2, v)}}$`).join(", ")}. Each vertex matches the vertex where the corresponding sides meet: $${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$. So $${triName(n1)} \\cong ${correct}$.`,
              `按长度配对各边：${[0, 1, 2].map((v) => `$\\overline{${sideName(n1, v)}} \\leftrightarrow \\overline{${sideName(n2, v)}}$`).join("，")}。每个顶点对应其两条对应边的公共点：$${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$。所以 $${triName(n1)} \\cong ${correct}$。`,
            ),
          }),
          figure: pairFigure(bySides(sides), pickPose(rng), n1, { sides: sides.map(String) }, n2, { sides: sides.map(String) }, en, zh),
        };
      },
    },
    {
      id: "solving-with-sss",
      title: t("Unknowns in SSS", "SSS 中的未知量"),
      explanation: t(
        "When two sides of a triangle are given by expressions, each expression must equal one of the other triangle's sides, and both must give the same value of $x$.\n\n$\\triangle ABC$ has sides $7$, $10$, $13$, and $\\triangle DEF$ has sides $7$, $x + 6$ and $3x - 2$. Trying $x + 6 = 10$ gives $x = 4$, and then $3x - 2 = 10 \\ne 13$. Trying $x + 6 = 13$ gives $x = 7$, and then $3x - 2 = 19 \\ne 10$. Neither works, so no value of $x$ makes the triangles congruent. With $3x - 5$ instead of $3x - 2$, $x = 4$ gives $10$ and $7$: no. With $2x + 5$, $x = 4$ gives $10$ and $13$: yes, $x = 4$.",
        "当三角形的两条边由式子给出时，每个式子都必须等于另一个三角形的某条边，并且两个式子必须得到同一个 $x$。\n\n$\\triangle ABC$ 的边长是 $7$、$10$、$13$，$\\triangle DEF$ 的边长是 $7$、$x + 6$、$3x - 2$。试 $x + 6 = 10$，得 $x = 4$，这时 $3x - 2 = 10 \\ne 13$；试 $x + 6 = 13$，得 $x = 7$，这时 $3x - 2 = 19 \\ne 10$。都不行，所以没有 $x$ 使两个三角形全等。若把 $3x - 2$ 换成 $2x + 5$，则 $x = 4$ 时两边为 $10$ 和 $13$：可以，$x = 4$。",
      ),
      generate(rng) {
        for (;;) {
          const [n1, n2] = pickNames(rng);
          const sides = pickSides(rng, 5, 20);
          const known = rng.int(0, 2);
          const [p, q] = rng.shuffle([nx(known), nx(known, 2)]) as [number, number];
          const x = rng.int(2, 9);
          const [c1, c2] = rng.sample([1, 2, 3, 4], 2) as [number, number];
          const [d1, d2] = [sides[p]! - c1 * x, sides[q]! - c2 * x];
          if (d1 === 0 || d2 === 0 || Math.abs(d1) > 20 || Math.abs(d2) > 20) continue;
          // The swapped matching must not also work.
          if ((sides[q]! - d1) * c2 === (sides[p]! - d2) * c1) continue;
          const labels: string[] = sides.map(String);
          labels[p] = plain(c1, d1);
          labels[q] = plain(c2, d2);
          const [en, zh] = pairAlt(n1, n2);
          const swap1 = intOr(sides[q]! - d1, c1, -x);
          return {
            ...numberProblem({
              prompt: t(
                `Find the value of $x$ for which $${triName(n1)} \\cong ${triName(n2)}$ by SSS.`,
                `求使 $${triName(n1)} \\cong ${triName(n2)}$（SSS）成立的 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [swap1, intOr(sides[p]! + d1, c1, -x), sides[p]! - d1, -x],
              solution: t(
                `$${seg(n2, known)}$ matches $${seg(n1, known)}$, so the expressions must equal $${sides[p]}$ and $${sides[q]}$ in some order. Setting $${linear(c1, d1)} = ${sides[p]}$ gives $x = ${x}$, and then $${linear(c2, d2)} = ${c2 * x + d2} = ${sides[q]}$ as well. (The other order gives two different values of $x$.) So $x = ${x}$.`,
                `$${seg(n2, known)}$ 与 $${seg(n1, known)}$ 对应，所以两个式子必须分别等于 $${sides[p]}$ 和 $${sides[q]}$。令 $${linear(c1, d1)} = ${sides[p]}$，得 $x = ${x}$，这时 $${linear(c2, d2)} = ${c2 * x + d2} = ${sides[q]}$ 也成立。（另一种配对得到两个不同的 $x$。）所以 $x = ${x}$。`,
              ),
            }),
            figure: pairFigure(bySides(sides), pickPose(rng), n1, { sides: sides.map(String) }, n2, { sides: labels }, en, zh),
          };
        }
      },
    },
  ],
};

// ─── The HL Congruence Criterion ────────────────────────────────────────────

const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [20, 21, 29],
  [9, 40, 41],
  [12, 35, 37],
  [15, 20, 25],
  [10, 24, 26],
];

/** rightShape draws a right triangle with the right angle at vertex r and legs in the ratio of a triple. */
function rightShape(r: number, legs: readonly [number, number]): Tri {
  const pts: Point[] = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  pts[r] = [0, 0];
  pts[nx(r)] = [legs[0], 0];
  pts[nx(r, 2)] = [0, legs[1]];
  return pts as unknown as Tri;
}

export const theHlCongruenceCriterion: TopicDef = {
  id: "the-hl-congruence-criterion",
  title: t("The HL Congruence Criterion", "HL 全等判定"),
  summary: t("Prove right triangles congruent from their hypotenuses and a pair of legs.", "由斜边和一组直角边证明直角三角形全等。"),
  prerequisites: ["the-sss-congruence-criterion", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "the-sss-congruence-criterion", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "hypotenuse-and-leg",
      title: t("The HL criterion", "HL 判定"),
      explanation: t(
        "The **HL (hypotenuse–leg) criterion**: if the hypotenuse and a leg of one right triangle are congruent to the hypotenuse and a leg of another right triangle, the triangles are congruent.\n\nThis is a special case where two sides and a non-included angle are enough, because the angle is a right angle. By the Pythagorean theorem the other legs are equal too, so SSS applies.\n\nOther criteria still work for right triangles: two legs and the right angle between them is SAS; a leg and an acute angle next to it, with the right angle, is ASA.",
        "**HL（斜边、直角边）判定**：如果一个直角三角形的斜边和一条直角边分别与另一个直角三角形的斜边和一条直角边全等，那么这两个直角三角形全等。\n\n这是“两边及非夹角”也足够的特殊情形，因为这个角是直角。由勾股定理，另一条直角边也相等，于是可以用 SSS。\n\n其他判定对直角三角形同样适用：两条直角边及它们之间的直角是 SAS；一条直角边、与它相邻的锐角以及直角是 ASA。",
      ),
      generate(rng) {
        const r = rng.int(0, 2);
        const crit = rng.pick<Crit>(["hl", "hl", "sas", "asa", "aas", "none"]);
        let sc: Scenario;
        const [l1, l2] = rng.shuffle([nx(r), nx(r, 2)]) as [number, number];
        if (crit === "sas") sc = { parts: [A(r), S(l1), S(l2)], right: r };
        else if (crit === "asa") sc = { parts: [A(r), A(l1), S(l2)], right: r };
        else if (crit === "aas") sc = { parts: [A(r), A(l1), S(rng.pick([r, l1]))], right: r };
        else if (crit === "none") sc = { parts: [A(r), A(l1), A(l2)], right: r };
        else sc = { parts: [A(r), S(r), S(l1)], right: r };
        const [n1, n2] = pickNames(rng);
        const options: Crit[] = ["hl", "sas", "asa", "aas", "none"];
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...choiceProblem({
            prompt: cat(
              t("In the figure, ", "图中，"),
              andList(sc.parts.map((p) => factText(p, n1, n2, sc.right))),
              t(
                `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
                `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
              ),
            ),
            options: options.map((x) => critNames[x]),
            correct: options.indexOf(criterionOf(sc.parts, sc.right)),
            solution: critWhy(sc.parts, sc.right),
          }),
          figure: pairFigure(
            byAngles(randomAngles(rng, r)),
            pickPose(rng),
            n1,
            partsLook(sc.parts, sc.right, 0),
            n2,
            partsLook(sc.parts, sc.right, 1),
            en,
            zh,
          ),
        };
      },
    },
    {
      id: "missing-legs",
      title: t("The missing leg", "求另一条直角边"),
      explanation: t(
        "Right triangles congruent by HL have all their parts equal, so the leg that was not given can be found in either triangle with the Pythagorean theorem.\n\nIf $\\angle C$ and $\\angle F$ are right angles, $AB = DE = 17$ and $AC = DF = 8$, then $BC = \\sqrt{17^2 - 8^2} = \\sqrt{225} = 15$, and since $\\triangle ABC \\cong \\triangle DEF$, $EF = BC = 15$.",
        "由 HL 全等的直角三角形所有对应部分都相等，所以没有给出的那条直角边可以在任一个三角形中用勾股定理求出。\n\n若 $\\angle C$ 与 $\\angle F$ 是直角，$AB = DE = 17$，$AC = DF = 8$，则 $BC = \\sqrt{17^2 - 8^2} = \\sqrt{225} = 15$；又 $\\triangle ABC \\cong \\triangle DEF$，所以 $EF = BC = 15$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const r = rng.int(0, 2);
        const [a, b, c] = rng.pick(triples);
        const [g, h] = rng.bool() ? [a, b] : [b, a];
        const shape = rightShape(r, [g, h]);
        // Side nx(r, 2) joins r and nx(r): length g. Side nx(r) joins r and nx(r, 2): length h.
        const given = rng.pick([nx(r), nx(r, 2)]);
        const other = given === nx(r) ? nx(r, 2) : nx(r);
        const len = (s: number) => (s === r ? c : s === nx(r) ? h : g);
        const sides1: SideLook[] = [null, null, null];
        const sides2: SideLook[] = [null, null, null];
        sides1[r] = { ticks: 1, label: String(c) };
        sides1[given] = { ticks: 2, label: String(len(given)) };
        sides2[r] = 1;
        sides2[given] = 2;
        const [en, zh] = pairAlt(n1, n2);
        return {
          ...numberProblem({
            prompt: t(
              `$${triName(n1)}$ and $${triName(n2)}$ are right triangles with right angles at $${n1[r]}$ and $${n2[r]}$, $${seg(n1, r)} \\cong ${seg(n2, r)}$ and $${seg(n1, given)} \\cong ${seg(n2, given)}$. Find $${sideName(n2, other)}$.`,
              `$${triName(n1)}$ 与 $${triName(n2)}$ 是直角三角形，直角分别在 $${n1[r]}$ 和 $${n2[r]}$，$${seg(n1, r)} \\cong ${seg(n2, r)}$，$${seg(n1, given)} \\cong ${seg(n2, given)}$。求 $${sideName(n2, other)}$。`,
            ),
            answer: len(other),
            form: "integer",
            wrong: [c - len(given), len(given), c, c + len(given)],
            solution: t(
              `The triangles are congruent by HL, so $${sideName(n2, other)} = ${sideName(n1, other)}$. By the Pythagorean theorem in $${triName(n1)}$:${steps(`${sideName(n1, other)} = \\sqrt{${c}^2 - ${len(given)}^2} = \\sqrt{${c * c - len(given) ** 2}} = ${len(other)}`)}`,
              `由 HL 得两个三角形全等，所以 $${sideName(n2, other)} = ${sideName(n1, other)}$。在 $${triName(n1)}$ 中用勾股定理：${steps(`${sideName(n1, other)} = \\sqrt{${c}^2 - ${len(given)}^2} = \\sqrt{${c * c - len(given) ** 2}} = ${len(other)}`)}`,
            ),
          }),
          figure: pairFigure(shape, pickPose(rng), n1, { sides: sides1, right: r }, n2, { sides: sides2, right: r }, en, zh),
        };
      },
    },
    {
      id: "solving-with-hl",
      title: t("Unknowns in HL", "HL 中的未知量"),
      explanation: t(
        "For HL, the hypotenuse must match the hypotenuse and a leg must match a leg. The hypotenuse is the side opposite the right angle, and it is always the longest side.\n\nIf right triangles $ABC$ and $DEF$ have right angles at $C$ and $F$, $AB = 25$, $AC = 7$, $DF = 7$ and $DE = 5x - 5$, then for $\\triangle ABC \\cong \\triangle DEF$ by HL, $5x - 5 = 25$, so $5x = 30$ and $x = 6$.",
        "用 HL 时，斜边要对应斜边，直角边要对应直角边。斜边是直角所对的边，总是最长的边。\n\n若直角三角形 $ABC$ 与 $DEF$ 的直角分别在 $C$ 和 $F$，$AB = 25$，$AC = 7$，$DF = 7$，$DE = 5x - 5$，则要由 HL 得 $\\triangle ABC \\cong \\triangle DEF$，需 $5x - 5 = 25$，所以 $5x = 30$，$x = 6$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const r = rng.int(0, 2);
        const [a, b, c] = rng.pick(triples);
        const [g, h] = rng.bool() ? [a, b] : [b, a];
        const shape = rightShape(r, [g, h]);
        const leg = rng.pick([nx(r), nx(r, 2)]);
        const len = (s: number) => (s === r ? c : s === nx(r) ? h : g);
        const onHyp = rng.bool();
        const target = onHyp ? c : len(leg);
        const u = unknownFor(rng, target);
        const sides1: SideLook[] = [null, null, null];
        const sides2: SideLook[] = [null, null, null];
        sides1[r] = String(c);
        sides1[leg] = String(len(leg));
        sides2[r] = onHyp ? plain(u.c, u.d) : String(c);
        sides2[leg] = onHyp ? String(len(leg)) : plain(u.c, u.d);
        const [en, zh] = pairAlt(n1, n2);
        const s = onHyp ? r : leg;
        return {
          ...numberProblem({
            prompt: t(
              `Find the value of $x$ for which $${triName(n1)} \\cong ${triName(n2)}$ by HL.`,
              `求使 $${triName(n1)} \\cong ${triName(n2)}$（HL）成立的 $x$。`,
            ),
            answer: u.x,
            form: "integer",
            solveFor: "x",
            wrong: [...unknownWrong(u), intOr((onHyp ? len(leg) : c) - u.d, u.c, -u.x)],
            solution: t(
              `${onHyp ? "The hypotenuses" : "The legs"} must match: $${sideName(n2, s)} = ${sideName(n1, s)} = ${target}$.${solveSteps(u)}`,
              `${onHyp ? "斜边" : "直角边"}必须对应相等：$${sideName(n2, s)} = ${sideName(n1, s)} = ${target}$。${solveSteps(u)}`,
            ),
          }),
          figure: pairFigure(shape, pickPose(rng), n1, { sides: sides1, right: r }, n2, { sides: sides2, right: r }, en, zh),
        };
      },
    },
  ],
};

// ─── Combining Congruence Criteria for Triangles ────────────────────────────

/** kitePoints places U and V at the ends of a shared side, with X and Y mirror images across it. */
function kitePoints(rng: Rng, rightAtX: boolean): [Point, Point, Point, Point] {
  for (;;) {
    const w = 6;
    const px = rng.int(15, 45) / 10;
    const h = rightAtX ? Math.sqrt(px * (w - px)) : rng.int(18, 40) / 10;
    // Away from a right angle at X unless one is wanted.
    const angleX = toDeg(Math.atan2(h, w - px) + Math.atan2(h, px));
    const angleAt = 180 - angleX;
    if (!rightAtX && Math.abs(angleAt - 90) < 12) continue;
    const pose = pickPose(rng);
    const [u, v, x, y] = posed(
      [
        [0, 0],
        [w, 0],
        [px, h],
        [px, -h],
      ] as const,
      { turn: rng.pick([0, 0, 90, 30, -30]), mirror: pose.mirror },
    );
    return [u, v, x, y];
  }
}

/** bowtiePoints places C at the origin, A and B on one side, and D = −A, E = −B on the other, so that AD and BE cross at C. */
function bowtiePoints(rng: Rng): [Point, Point, Point, Point, Point] {
  const ta = rng.int(125, 165);
  const tb = rng.int(195, 235);
  const ra = rng.int(30, 55) / 10;
  const rb = rng.int(30, 55) / 10;
  const a: Point = [ra * Math.cos(rad(ta)), ra * Math.sin(rad(ta))];
  const b: Point = [rb * Math.cos(rad(tb)), rb * Math.sin(rad(tb))];
  const turn = rng.pick([0, 0, 90, 20, -20]);
  return posed([a, b, [0, 0], [-a[0], -a[1]], [-b[0], -b[1]]] as const, { turn, mirror: rng.bool() });
}

export const combiningCongruenceCriteriaForTriangles: TopicDef = {
  id: "combining-congruence-criteria-for-triangles",
  title: t("Combining Congruence Criteria for Triangles", "综合运用三角形全等判定"),
  summary: t(
    "Choose the criterion that proves two triangles congruent, using shared sides and vertical angles.",
    "选择能证明两个三角形全等的判定方法，并利用公共边和对顶角。",
  ),
  prerequisites: ["the-aas-congruence-criterion", "the-hl-congruence-criterion"],
  encompasses: [
    { topic: "the-asa-congruence-criterion", weight: 0.3 },
    { topic: "the-aas-congruence-criterion", weight: 0.3 },
    { topic: "the-sas-congruence-criterion", weight: 0.3 },
    { topic: "the-sss-congruence-criterion", weight: 0.3 },
    { topic: "the-hl-congruence-criterion", weight: 0.3 },
    { topic: "vertical-angles", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "choosing-a-criterion",
      title: t("Choosing a criterion", "选择判定方法"),
      explanation: t(
        "Sort the three pairs of congruent parts:\n\n- three sides: **SSS**;\n- two sides and the angle between them: **SAS**;\n- two angles and the side between them: **ASA**;\n- two angles and a side not between them: **AAS**;\n- right triangles with congruent hypotenuses and a pair of congruent legs: **HL**.\n\nTwo combinations do not prove congruence: three angles (**AAA**), and two sides with an angle that is not between them (**SSA**), unless that angle is a right angle, which is HL.",
        "把三组全等的部分归类：\n\n- 三条边：**SSS**；\n- 两边及其夹角：**SAS**；\n- 两角及其夹边：**ASA**；\n- 两角及一角的对边：**AAS**；\n- 斜边全等且有一组直角边全等的直角三角形：**HL**。\n\n有两种组合不能证明全等：三个角（**AAA**），以及两边和一个非夹角（**SSA**），除非这个角是直角，那就是 HL。",
      ),
      generate(rng) {
        const crit = rng.pick(critOrder);
        return scenarioProblem(rng, crit, critOrder, crit === "hl" ? rng.int(0, 2) : null);
      },
    },
    {
      id: "shared-sides",
      title: t("Shared sides", "公共边"),
      explanation: t(
        "When two triangles share a side, that side is congruent to itself (the **Reflexive Property**). It counts as one pair of congruent sides even though nothing marks it.\n\nIn a figure where $\\triangle UXV$ and $\\triangle UYV$ share $\\overline{UV}$: if $\\overline{UX} \\cong \\overline{UY}$ and $\\overline{VX} \\cong \\overline{VY}$, then with $\\overline{UV} \\cong \\overline{UV}$ the triangles are congruent by SSS. If instead $\\overline{UX} \\cong \\overline{UY}$ and $\\angle XUV \\cong \\angle YUV$, the angle at $U$ lies between $\\overline{UX}$ and $\\overline{UV}$, so it is SAS.",
        "两个三角形有公共边时，这条边与它自身全等（**自反性**）。即使图中没有标记，它也算作一组全等的边。\n\n设 $\\triangle UXV$ 与 $\\triangle UYV$ 有公共边 $\\overline{UV}$：若 $\\overline{UX} \\cong \\overline{UY}$，$\\overline{VX} \\cong \\overline{VY}$，再加上 $\\overline{UV} \\cong \\overline{UV}$，由 SSS 得两个三角形全等。若改为 $\\overline{UX} \\cong \\overline{UY}$，$\\angle XUV \\cong \\angle YUV$，则 $U$ 处的角是 $\\overline{UX}$ 与 $\\overline{UV}$ 的夹角，用 SAS。",
      ),
      generate(rng) {
        const [U, V, X, Y] = pickLetters(rng, 4) as [string, string, string, string];
        // Triangle 1 is U, V, X; triangle 2 is U, V, Y. Side 2 (UV) is shared.
        const n1: Names = [U, V, X];
        const n2: Names = [U, V, Y];
        const choice = rng.int(0, 6);
        const options: readonly (readonly Part[])[] = [
          [S(0), S(1)],
          [S(1), A(0)],
          [S(0), A(1)],
          [A(0), A(1)],
          [A(2), A(0)],
          [A(2), A(1)],
          [S(1), A(2)],
        ];
        const right = choice === 6 ? 2 : null;
        const extra = choice === 6 ? [A(2), rng.pick([S(0), S(1)])] : options[choice]!;
        const parts = [...extra, S(2)];
        const pts = kitePoints(rng, right !== null);
        const [pu, pv, px, py] = pts;
        const look = (which: 0 | 1) => partsLook(extra, right, which);
        const marks: Mark[] = [
          ...triMarks([pu, pv, px], n1, look(0)).filter((k) => k.kind !== "label"),
          ...triMarks([pu, pv, py], n2, look(1)).filter((k) => k.kind !== "label"),
          ...names([pu, pv, px, py], [U, V, X, Y]),
        ];
        const answer = criterionOf(parts, right);
        const facts = extra.map((p) => factText(p, n1, n2, right, ang3));
        return {
          ...choiceProblem({
            prompt: cat(
              t("In the figure, ", "图中，"),
              andList(facts),
              t(
                `. Which criterion proves $${triName(n1, [0, 2, 1])} \\cong ${triName(n2, [0, 2, 1])}$?`,
                `。用哪种判定方法可以证明 $${triName(n1, [0, 2, 1])} \\cong ${triName(n2, [0, 2, 1])}$？`,
              ),
            ),
            options: critOrder.map((x) => critNames[x]),
            correct: critOrder.indexOf(answer),
            solution: cat(
              t(
                `The triangles share $\\overline{${U}${V}}$, and $\\overline{${U}${V}} \\cong \\overline{${U}${V}}$ by the Reflexive Property. `,
                `两个三角形有公共边 $\\overline{${U}${V}}$，由自反性 $\\overline{${U}${V}} \\cong \\overline{${U}${V}}$。`,
              ),
              critWhy(parts, right),
            ),
          }),
          figure: figure(
            marks,
            `Quadrilateral ${U}${X}${V}${Y} with diagonal ${U}${V}, forming triangles ${U}${X}${V} and ${U}${Y}${V}.`,
            `四边形 ${U}${X}${V}${Y} 及对角线 ${U}${V}，构成三角形 ${U}${X}${V} 与 ${U}${Y}${V}。`,
          ),
        };
      },
    },
    {
      id: "vertical-angles",
      title: t("Vertical angles", "对顶角"),
      explanation: t(
        "When two segments cross, they form two triangles that meet at the crossing point. The angles of the triangles at that point are **vertical angles**, so they are congruent: another pair of congruent parts that nothing marks.\n\nIf $\\overline{AD}$ and $\\overline{BE}$ cross at $C$, then $\\angle ACB \\cong \\angle DCE$. With $\\overline{AC} \\cong \\overline{DC}$ and $\\overline{BC} \\cong \\overline{EC}$, the vertical angles lie between the congruent sides, so $\\triangle ABC \\cong \\triangle DEC$ by SAS.",
        "两条线段相交时，构成在交点处相接的两个三角形。两个三角形在交点处的角是**对顶角**，所以全等：这又是一组没有标记的全等部分。\n\n若 $\\overline{AD}$ 与 $\\overline{BE}$ 相交于 $C$，则 $\\angle ACB \\cong \\angle DCE$。若再有 $\\overline{AC} \\cong \\overline{DC}$，$\\overline{BC} \\cong \\overline{EC}$，对顶角正是全等两边的夹角，所以由 SAS 得 $\\triangle ABC \\cong \\triangle DEC$。",
      ),
      generate(rng) {
        const [a, b, c, d, e] = pickLetters(rng, 5) as [string, string, string, string, string];
        // Triangle 1 is A, B, C; triangle 2 is D, E, C. Angle 2 (at C) is a pair of vertical angles.
        const n1: Names = [a, b, c];
        const n2: Names = [d, e, c];
        const extra = rng.pick<readonly Part[]>([
          [S(0), S(1)],
          [S(1), A(0)],
          [S(0), A(1)],
          [S(2), A(0)],
          [S(1), A(1)],
          [S(0), A(0)],
          [A(0), A(1)],
          [S(2), S(1)],
          [S(2), S(0)],
        ]);
        const parts = [...extra, A(2)];
        const [pa, pb, pc, pd, pe] = bowtiePoints(rng);
        const marks: Mark[] = [
          ...triMarks([pa, pb, pc], n1, partsLook(extra, null, 0)).filter((k) => k.kind !== "label"),
          ...triMarks([pd, pe, pc], n2, partsLook(extra, null, 1)).filter((k) => k.kind !== "label"),
          ...names([pa, pb, pc, pd, pe], [a, b, c, d, e], [0, 0]).filter((k) => k.kind === "label" && k.text !== c),
          { kind: "label", at: pc, text: c, dir: compassOf(pa[0] + pd[0] - pb[0] - pe[0], pa[1] + pd[1] - pb[1] - pe[1]), italic: true },
        ];
        const answer = criterionOf(parts, null);
        const facts = extra.map((p) => factText(p, n1, n2, null));
        return {
          ...choiceProblem({
            prompt: cat(
              t(
                `In the figure, $\\overline{${a}${d}}$ and $\\overline{${b}${e}}$ cross at $${c}$, `,
                `图中，$\\overline{${a}${d}}$ 与 $\\overline{${b}${e}}$ 相交于 $${c}$，`,
              ),
              andList(facts),
              t(
                `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
                `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
              ),
            ),
            options: critOrder.map((x) => critNames[x]),
            correct: critOrder.indexOf(answer),
            solution: cat(
              t(
                `$\\angle ${a}${c}${b}$ and $\\angle ${d}${c}${e}$ are vertical angles, so they are congruent. `,
                `$\\angle ${a}${c}${b}$ 与 $\\angle ${d}${c}${e}$ 是对顶角，所以全等。`,
              ),
              critWhy(parts, null),
            ),
          }),
          figure: figure(
            marks,
            `Segments ${a}${d} and ${b}${e} crossing at ${c}, forming triangles ${a}${b}${c} and ${d}${e}${c}.`,
            `线段 ${a}${d} 与 ${b}${e} 相交于 ${c}，构成三角形 ${a}${b}${c} 与 ${d}${e}${c}。`,
          ),
        };
      },
    },
  ],
};

// ─── Rigid Motions and Congruence ───────────────────────────────────────────

/** XY is a point with whole coordinates. */
type XY = readonly [number, number];

/** pl writes a point: "(3, -2)". */
const pl = (p: XY) => `(${p[0]}, ${p[1]})`;

/** Motion is one of the rigid motions the identification problems use. */
type Motion = "translation" | "reflectX" | "reflectY" | "rotate90" | "rotate180";

const motionNames: Record<Motion, Text> = {
  translation: t("A translation", "平移"),
  reflectX: t("A reflection across the $x$-axis", "关于 $x$ 轴的反射"),
  reflectY: t("A reflection across the $y$-axis", "关于 $y$ 轴的反射"),
  rotate90: t("A rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$"),
  rotate180: t("A rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
};

const motionOrder: readonly Motion[] = ["translation", "reflectX", "reflectY", "rotate90", "rotate180"];

/** applyMotion maps a point by a motion; shift is the vector of a translation. */
function applyMotion(motion: Motion, p: XY, shift: XY): XY {
  const [x, y] = p;
  switch (motion) {
    case "translation":
      return [x + shift[0], y + shift[1]];
    case "reflectX":
      return [x, -y];
    case "reflectY":
      return [-x, y];
    case "rotate90":
      return [-y, x];
    default:
      return [-x, -y];
  }
}

/** Rule is a transformation of the plane given by a rule, and whether it is a rigid motion. */
interface Rule {
  readonly tex: string;
  readonly rigid: boolean;
  readonly why: Text;
}

/** signed writes "x + 3", "x - 3" or "x". */
const signed = (v: string, k: number) => (k === 0 ? v : k > 0 ? `${v} + ${k}` : `${v} - ${-k}`);

/** pickRule picks a transformation rule, rigid or not. */
function pickRule(rng: Rng, rigid: boolean): Rule {
  const [h, k] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
  const keeps = t(
    "It is a rigid motion: it keeps every distance and every angle, so the image is congruent to the original.",
    "它是刚性变换：保持所有距离和角度不变，所以像与原图形全等。",
  );
  if (rigid) {
    const tex = rng.pick([
      `(x, y) \\to (${signed("x", h)}, ${signed("y", k)})`,
      `(x, y) \\to (-y, x)`,
      `(x, y) \\to (y, -x)`,
      `(x, y) \\to (-x, -y)`,
      `(x, y) \\to (x, -y)`,
      `(x, y) \\to (-x, y)`,
      `(x, y) \\to (y, x)`,
      `(x, y) \\to (${signed("-x", h)}, y)`,
      `(x, y) \\to (${signed("y", h)}, ${signed("x", k)})`,
      `(x, y) \\to (${signed("-y", h)}, ${signed("x", k)})`,
      `(x, y) \\to (${signed("x", h)}, ${signed("-y", k)})`,
    ]);
    return { tex, rigid, why: keeps };
  }
  const f = rng.pick([2, 3, 4]);
  const [tex, why] = rng.pick<readonly [string, Text]>([
    [
      `(x, y) \\to (${f}x, ${f}y)`,
      t(
        `It is a dilation with scale factor $${f}$: every length is multiplied by $${f}$.`,
        `它是比例因子为 $${f}$ 的位似：每条线段的长度都乘以 $${f}$。`,
      ),
    ],
    [
      `(x, y) \\to (${f}x, y)`,
      t(
        `It stretches horizontally by a factor of $${f}$, so horizontal lengths change.`,
        `它在水平方向上伸长为原来的 $${f}$ 倍，水平方向的长度改变了。`,
      ),
    ],
    [
      `(x, y) \\to (x, ${f}y)`,
      t(
        `It stretches vertically by a factor of $${f}$, so vertical lengths change.`,
        `它在竖直方向上伸长为原来的 $${f}$ 倍，竖直方向的长度改变了。`,
      ),
    ],
    [
      `(x, y) \\to (${signed(`${f}x`, h)}, ${signed(`${f}y`, k)})`,
      t(
        `It multiplies every length by $${f}$ (a dilation followed by a translation).`,
        `它把每条线段的长度都乘以 $${f}$（先位似，再平移）。`,
      ),
    ],
    [
      `(x, y) \\to (-${f}x, ${f}y)`,
      t(`It multiplies every length by $${f}$, so the size changes.`, `它把每条线段的长度都乘以 $${f}$，大小改变了。`),
    ],
    [
      `(x, y) \\to (x + y, y)`,
      t(
        "It slides each point sideways by its height (a shear): $(0, 0)$ and $(0, 1)$ are $1$ apart, but their images $(0, 0)$ and $(1, 1)$ are $\\sqrt{2}$ apart.",
        "它把每个点按其纵坐标横向移动（错切）：$(0, 0)$ 与 $(0, 1)$ 的距离是 $1$，而像 $(0, 0)$ 与 $(1, 1)$ 的距离是 $\\sqrt{2}$。",
      ),
    ],
  ]);
  return {
    tex,
    rigid,
    why: cat(why, t(" It is not a rigid motion, so the image need not be congruent.", "它不是刚性变换，所以像不一定与原图形全等。")),
  };
}

/** pickXY picks a point with nonzero coordinates of different sizes, so that the five motions all move it somewhere different. */
function pickXY(rng: Rng, lim = 6): XY {
  for (;;) {
    const p: XY = [rng.nonZero(-lim, lim), rng.nonZero(-lim, lim)];
    if (Math.abs(p[0]) !== Math.abs(p[1])) return p;
  }
}

export const rigidMotionsAndCongruence: TopicDef = {
  id: "rigid-motions-and-congruence",
  title: t("Rigid Motions and Congruence", "刚性变换与全等"),
  summary: t(
    "Recognize rigid motions, identify the motion that maps one triangle onto another, and use the correspondence it gives.",
    "识别刚性变换，找出把一个三角形映到另一个三角形的变换，并利用它给出的对应关系。",
  ),
  prerequisites: [
    "the-asa-congruence-criterion",
    "translations-of-geometric-figures",
    "rotation-rules-in-the-coordinate-plane",
    "reflections-in-the-coordinate-plane",
    "dilations-of-geometric-figures",
  ],
  encompasses: [
    { topic: "translations-of-geometric-figures", weight: 0.2 },
    { topic: "rotation-rules-in-the-coordinate-plane", weight: 0.2 },
    { topic: "reflections-in-the-coordinate-plane", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
    { topic: "dilations-of-geometric-figures", weight: 0.1 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.B.6", "CCSS.HSG.CO.B.7"],
  knowledgePoints: [
    {
      id: "recognizing-rigid-motions",
      title: t("Rigid motions", "刚性变换"),
      explanation: t(
        "A **rigid motion** is a transformation that keeps every distance (and so every angle): translations, rotations, reflections, and any sequence of them.\n\nTwo figures are **congruent** exactly when a sequence of rigid motions maps one onto the other. Dilations with a scale factor other than $1$ and stretches change lengths, so they are not rigid motions.\n\n$(x, y) \\to (-y + 3, x)$ rotates $90^\\circ$ about the origin and then translates: rigid. $(x, y) \\to (2x, y)$ doubles horizontal lengths: not rigid.",
        "**刚性变换**是保持所有距离（因而也保持所有角度）不变的变换：平移、旋转、反射，以及它们的任意组合。\n\n两个图形**全等**，当且仅当存在一系列刚性变换把其中一个映到另一个上。比例因子不为 $1$ 的位似和伸缩会改变长度，所以不是刚性变换。\n\n$(x, y) \\to (-y + 3, x)$ 是先绕原点旋转 $90^\\circ$ 再平移：是刚性变换。$(x, y) \\to (2x, y)$ 把水平方向的长度加倍：不是刚性变换。",
      ),
      generate(rng) {
        const rigid = rng.bool();
        const rule = pickRule(rng, rigid);
        const [n] = pickNames(rng);
        return choiceProblem({
          prompt: t(
            `$${triName(n)}$ is mapped by the rule $${rule.tex}$. Is the image necessarily congruent to $${triName(n)}$?`,
            `$${triName(n)}$ 按规则 $${rule.tex}$ 变换。像一定与 $${triName(n)}$ 全等吗？`,
          ),
          options: yesNo,
          correct: rigid ? 0 : 1,
          solution: rule.why,
        });
      },
    },
    {
      id: "identifying-the-motion",
      title: t("Identifying the motion", "识别变换"),
      explanation: t(
        "To identify the rigid motion that maps a triangle onto its image, compare each vertex with its image:\n\n- every vertex moves by the same vector: a translation;\n- $(x, y) \\to (x, -y)$: a reflection across the $x$-axis;\n- $(x, y) \\to (-x, y)$: a reflection across the $y$-axis;\n- $(x, y) \\to (-y, x)$: a rotation of $90^\\circ$ counterclockwise about the origin;\n- $(x, y) \\to (-x, -y)$: a rotation of $180^\\circ$ about the origin.\n\n$A(2, 5) \\to A'(-5, 2)$ and $B(4, 1) \\to B'(-1, 4)$ follow $(x, y) \\to (-y, x)$: a $90^\\circ$ rotation.",
        "要找出把三角形映到它的像的刚性变换，逐个比较顶点和它的像：\n\n- 每个顶点都移动同一个向量：平移；\n- $(x, y) \\to (x, -y)$：关于 $x$ 轴的反射；\n- $(x, y) \\to (-x, y)$：关于 $y$ 轴的反射；\n- $(x, y) \\to (-y, x)$：绕原点逆时针旋转 $90^\\circ$；\n- $(x, y) \\to (-x, -y)$：绕原点旋转 $180^\\circ$。\n\n$A(2, 5) \\to A'(-5, 2)$，$B(4, 1) \\to B'(-1, 4)$，符合 $(x, y) \\to (-y, x)$：旋转 $90^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const pts = [pickXY(rng), pickXY(rng), pickXY(rng)] as const;
          const [a, b, c] = pts;
          const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
          if (area < 8) continue;
          const motion = rng.pick(motionOrder);
          const shift: XY = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
          const image = pts.map((p) => applyMotion(motion, p, shift));
          if (!image.every((p) => Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7)) continue;
          // The image must be different from where every other motion sends the triangle.
          const clash = motionOrder.some(
            (other) =>
              other !== motion &&
              other !== "translation" &&
              pts.every((p, i) => {
                const q = applyMotion(other, p, shift);
                return q[0] === image[i]![0] && q[1] === image[i]![1];
              }),
          );
          if (clash) continue;
          const [n] = pickNames(rng);
          const primes = n.map((l) => `${l}'`);
          const tri = (q: readonly XY[], labels: readonly string[], accent: boolean): PlaneMark[] => {
            const ox = q.reduce((s, p) => s + p[0], 0) / 3;
            const oy = q.reduce((s, p) => s + p[1], 0) / 3;
            return [
              ...q.map((p, i): PlaneMark => ({ kind: "segment", a: p, b: q[(i + 1) % 3]!, accent, dashed: accent })),
              ...q.map((p, i): PlaneMark => ({ kind: "point", at: p, label: labels[i]!, dir: compassOf(p[0] - ox, p[1] - oy), accent })),
            ];
          };
          const listed = (q: readonly XY[], labels: readonly string[]) => q.map((p, i) => `${labels[i]}${pl(p)}`).join(", ");
          const rule =
            motion === "translation"
              ? `(x, y) \\to (${signed("x", shift[0])}, ${signed("y", shift[1])})`
              : {
                  reflectX: "(x, y) \\to (x, -y)",
                  reflectY: "(x, y) \\to (-x, y)",
                  rotate90: "(x, y) \\to (-y, x)",
                  rotate180: "(x, y) \\to (-x, -y)",
                }[motion];
          return {
            ...choiceProblem({
              prompt: t(
                `A rigid motion maps $${triName(n)}$ with $${listed(pts, n)}$ onto $\\triangle ${primes.join("")}$ with $${listed(image, primes)}$. Which motion is it?`,
                `一个刚性变换把 $${triName(n)}$（$${listed(pts, n)}$）映到 $\\triangle ${primes.join("")}$（$${listed(image, primes)}$）。这是哪种变换？`,
              ),
              options: motionOrder.map((x) => motionNames[x]),
              correct: motionOrder.indexOf(motion),
              solution: t(
                `Every vertex follows the rule $${rule}$: for example $${n[0]}${pl(a)} \\to ${primes[0]}${pl(image[0]!)}$. So it is ${motionNames[motion].en.replace(/^A /, "a ")}.`,
                `每个顶点都符合规则 $${rule}$：例如 $${n[0]}${pl(a)} \\to ${primes[0]}${pl(image[0]!)}$。所以这是${motionNames[motion]["zh-CN"]}。`,
              ),
            }),
            figure: {
              svg: plane({ xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 }, [...tri(pts, n, false), ...tri(image, primes, true)]),
              alt: t(
                `Triangle ${n.join("")} and its image ${primes.join("")} on a coordinate grid.`,
                `坐标网格上的三角形 ${n.join("")} 及其像 ${primes.join("")}。`,
              ),
            },
          };
        }
      },
    },
    {
      id: "corresponding-parts-of-images",
      title: t("Corresponding parts", "对应部分"),
      explanation: t(
        "When a rigid motion maps $\\triangle ABC$ onto $\\triangle DEF$, each vertex goes to a vertex, and each side and angle goes to the side or angle between the images. The image has the same lengths and angles.\n\nIf the motion maps $A$ to $F$, $B$ to $D$ and $C$ to $E$, then $\\overline{AB}$ goes to $\\overline{FD}$. With $AB = 2x + 1$ and $FD = 13$: $2x + 1 = 13$, so $x = 6$.",
        "刚性变换把 $\\triangle ABC$ 映到 $\\triangle DEF$ 时，每个顶点映到一个顶点，每条边和每个角映到像点之间的边和角，长度和角度都不变。\n\n若变换把 $A$ 映到 $F$，$B$ 映到 $D$，$C$ 映到 $E$，则 $\\overline{AB}$ 映到 $\\overline{FD}$。若 $AB = 2x + 1$，$FD = 13$，则 $2x + 1 = 13$，$x = 6$。",
      ),
      generate(rng) {
        const [n1, base] = pickNames(rng);
        const sigma = rng.pick(perms.slice(1));
        const n2: Names = [base[sigma[0]]!, base[sigma[1]]!, base[sigma[2]]!];
        const maps = [0, 1, 2].map((v) => t(`$${n1[v]}$ to $${n2[v]}$`, `$${n1[v]}$ 映到 $${n2[v]}$`));
        const mapText = t(
          `A rigid motion maps ${maps
            .map((x) => x.en)
            .slice(0, 2)
            .join(", ")} and ${maps[2]!.en}.`,
          `一个刚性变换把${maps.map((x) => x["zh-CN"]).join("，")}。`,
        );
        if (rng.bool()) {
          const sides = pickSides(rng, 6, 30);
          const k = rng.int(0, 2);
          const u = unknownFor(rng, sides[k]!);
          const given = rng
            .shuffle([0, 1, 2])
            .map((v) => `${sideName(n2, v)} = ${sides[v]}`)
            .join(", ");
          return numberProblem({
            prompt: cat(
              mapText,
              t(
                ` In the image, $${given}$. If $${sideName(n1, k)} = ${linear(u.c, u.d)}$, find $x$.`,
                `在像中，$${given}$。若 $${sideName(n1, k)} = ${linear(u.c, u.d)}$，求 $x$。`,
              ),
            ),
            answer: u.x,
            form: "integer",
            solveFor: "x",
            wrong: [...unknownWrong(u), ...[0, 1, 2].filter((v) => v !== k).map((v) => intOr(sides[v]! - u.d, u.c, -u.x))],
            solution: t(
              `$\\overline{${sideName(n1, k)}}$ goes to $\\overline{${sideName(n2, k)}}$, and a rigid motion keeps lengths, so $${linear(u.c, u.d)} = ${sides[k]}$:${solveSteps(u)}`,
              `$\\overline{${sideName(n1, k)}}$ 映到 $\\overline{${sideName(n2, k)}}$，刚性变换保持长度不变，所以 $${linear(u.c, u.d)} = ${sides[k]}$：${solveSteps(u)}`,
            ),
          });
        }
        const angles = randomAngles(rng);
        const k = rng.int(0, 2);
        const u = unknownFor(rng, angles[k]!);
        const given = rng
          .shuffle([0, 1, 2])
          .map((v) => `m${ang(n2, v)} = ${angles[v]}^\\circ`)
          .join(", ");
        return numberProblem({
          prompt: cat(
            mapText,
            t(
              ` In the image, $${given}$. If $m${ang(n1, k)} = (${linear(u.c, u.d)})^\\circ$, find $x$.`,
              `在像中，$${given}$。若 $m${ang(n1, k)} = (${linear(u.c, u.d)})^\\circ$，求 $x$。`,
            ),
          ),
          answer: u.x,
          form: "integer",
          solveFor: "x",
          wrong: [...unknownWrong(u), ...[0, 1, 2].filter((v) => v !== k).map((v) => intOr(angles[v]! - u.d, u.c, -u.x))],
          solution: t(
            `$${ang(n1, k)}$ goes to $${ang(n2, k)}$, and a rigid motion keeps angles, so $${linear(u.c, u.d)} = ${angles[k]}$:${solveSteps(u)}`,
            `$${ang(n1, k)}$ 映到 $${ang(n2, k)}$，刚性变换保持角度不变，所以 $${linear(u.c, u.d)} = ${angles[k]}$：${solveSteps(u)}`,
          ),
        });
      },
    },
  ],
};

// ─── Properties of Congruence ───────────────────────────────────────────────

type Property = "reflexive" | "symmetric" | "transitive";

const propertyNames: Record<Property, Text> = {
  reflexive: t("Reflexive Property of Congruence", "全等的自反性"),
  symmetric: t("Symmetric Property of Congruence", "全等的对称性"),
  transitive: t("Transitive Property of Congruence", "全等的传递性"),
};

const propertyOrder: readonly Property[] = ["reflexive", "symmetric", "transitive"];

/** figureNames writes k figures of one kind (segment, angle or triangle) with distinct letters. */
function figureNames(rng: Rng, kind: 0 | 1 | 2, k: number): string[] {
  const letters = pickLetters(rng, kind === 0 ? 2 * k : 3 * k);
  const size = kind === 0 ? 2 : 3;
  return Array.from({ length: k }, (_, i) => {
    const s = letters.slice(i * size, (i + 1) * size).join("");
    return kind === 0 ? `\\overline{${s}}` : kind === 1 ? `\\angle ${s}` : `\\triangle ${s}`;
  });
}

export const propertiesOfCongruence: TopicDef = {
  id: "properties-of-congruence",
  title: t("Properties of Congruence", "全等的性质"),
  summary: t(
    "Use the reflexive, symmetric and transitive properties of congruence, and rewrite congruence statements.",
    "运用全等的自反性、对称性和传递性，并改写全等式。",
  ),
  prerequisites: ["the-asa-congruence-criterion"],
  encompasses: [
    { topic: "equations-with-variables-on-both-sides", weight: 0.2 },
    { topic: "the-asa-congruence-criterion", weight: 0.1 },
  ],
  xp: 11,
  standards: ["CCSS.HSG.CO.C.9"],
  knowledgePoints: [
    {
      id: "naming-the-property",
      title: t("The three properties", "三条性质"),
      explanation: t(
        "Congruence of segments, angles and triangles has three properties:\n\n- **Reflexive**: every figure is congruent to itself, $\\overline{AB} \\cong \\overline{AB}$.\n- **Symmetric**: a congruence can be read either way: if $\\angle P \\cong \\angle Q$, then $\\angle Q \\cong \\angle P$.\n- **Transitive**: figures congruent to the same figure are congruent to each other: if $\\triangle ABC \\cong \\triangle DEF$ and $\\triangle DEF \\cong \\triangle GHJ$, then $\\triangle ABC \\cong \\triangle GHJ$.",
        "线段、角和三角形的全等关系有三条性质：\n\n- **自反性**：任何图形都与自身全等，$\\overline{AB} \\cong \\overline{AB}$。\n- **对称性**：全等关系可以交换两边：若 $\\angle P \\cong \\angle Q$，则 $\\angle Q \\cong \\angle P$。\n- **传递性**：与同一个图形全等的两个图形彼此全等：若 $\\triangle ABC \\cong \\triangle DEF$，$\\triangle DEF \\cong \\triangle GHJ$，则 $\\triangle ABC \\cong \\triangle GHJ$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2) as 0 | 1 | 2;
        const prop = rng.pick(propertyOrder);
        const [x, y, z] = figureNames(rng, kind, 3) as [string, string, string];
        const statement =
          prop === "reflexive"
            ? m(`${x} \\cong ${x}`)
            : prop === "symmetric"
              ? t(`If $${x} \\cong ${y}$, then $${y} \\cong ${x}$.`, `若 $${x} \\cong ${y}$，则 $${y} \\cong ${x}$。`)
              : t(
                  `If $${x} \\cong ${y}$ and $${y} \\cong ${z}$, then $${x} \\cong ${z}$.`,
                  `若 $${x} \\cong ${y}$，$${y} \\cong ${z}$，则 $${x} \\cong ${z}$。`,
                );
        const why: Record<Property, Text> = {
          reflexive: t("A figure is congruent to itself.", "图形与自身全等。"),
          symmetric: t("The same congruence is read in the other direction.", "同一个全等关系换了个方向来写。"),
          transitive: t(
            `Two figures congruent to the same figure $${y}$ are congruent to each other.`,
            `两个图形都与同一个图形 $${y}$ 全等，所以它们彼此全等。`,
          ),
        };
        return choiceProblem({
          prompt: cat(t("Which property justifies the statement?", "下面的结论依据的是哪条性质？"), "\n\n", statement),
          options: propertyOrder.map((p) => propertyNames[p]),
          correct: propertyOrder.indexOf(prop),
          solution: cat(why[prop], t(` This is the ${propertyNames[prop].en}.`, `这是${propertyNames[prop]["zh-CN"]}。`)),
        });
      },
    },
    {
      id: "rewriting-congruence-statements",
      title: t("Rewriting congruence statements", "改写全等式"),
      explanation: t(
        "A congruence statement may list the vertices in any order, as long as corresponding vertices keep the same positions. By the symmetric property, the two triangles may also swap sides.\n\nFrom $\\triangle ABC \\cong \\triangle DEF$: $\\triangle BCA \\cong \\triangle EFD$ and $\\triangle FDE \\cong \\triangle CAB$ are both true, but $\\triangle BCA \\cong \\triangle DEF$ is not, since it pairs $B$ with $D$.",
        "全等式中顶点可以按任意顺序写，只要对应顶点保持相同的位置。由对称性，两个三角形还可以交换左右。\n\n由 $\\triangle ABC \\cong \\triangle DEF$：$\\triangle BCA \\cong \\triangle EFD$ 和 $\\triangle FDE \\cong \\triangle CAB$ 都正确，但 $\\triangle BCA \\cong \\triangle DEF$ 不正确，因为它把 $B$ 与 $D$ 配对。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const pi = rng.pick(perms.slice(1));
        const write = (p: readonly number[], q: readonly number[], swap: boolean) =>
          swap ? `${triName(n2, q)} \\cong ${triName(n1, p)}` : `${triName(n1, p)} \\cong ${triName(n2, q)}`;
        const right = m(write(pi, pi, rng.bool()));
        const others = rng.sample(
          perms.filter((s) => s.join() !== pi.join()),
          3,
        );
        const wrongs = others.map((s) => m(write(pi, s, rng.bool())));
        const options = [right, ...wrongs];
        const shuffled = rng.shuffle(options);
        return choiceProblem({
          prompt: t(
            `$${triName(n1)} \\cong ${triName(n2)}$. Which statement is also true?`,
            `$${triName(n1)} \\cong ${triName(n2)}$。下面哪个全等式也正确？`,
          ),
          options: shuffled,
          correct: shuffled.indexOf(right),
          solution: t(
            `The correspondence is $${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$. In ${right.en}, each vertex sits in the same position as its partner; in each of the other statements some vertex is paired with a vertex that does not correspond to it.`,
            `对应关系是 $${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$。在 ${right["zh-CN"]} 中，每个顶点都与它的对应顶点位置相同；其他全等式中都有顶点与不对应的顶点配在了一起。`,
          ),
        });
      },
    },
    {
      id: "chains-of-congruence",
      title: t("Chains of congruence", "全等的传递"),
      explanation: t(
        "The transitive property links congruences into a chain: if $\\overline{AB} \\cong \\overline{CD}$ and $\\overline{CD} \\cong \\overline{EF}$, then $\\overline{AB} \\cong \\overline{EF}$, so $AB = EF$.\n\nWith $AB = 3x - 4$ and $EF = x + 10$: $3x - 4 = x + 10$, so $2x = 14$ and $x = 7$.",
        "传递性把全等关系连成一条链：若 $\\overline{AB} \\cong \\overline{CD}$，$\\overline{CD} \\cong \\overline{EF}$，则 $\\overline{AB} \\cong \\overline{EF}$，所以 $AB = EF$。\n\n若 $AB = 3x - 4$，$EF = x + 10$，则 $3x - 4 = x + 10$，$2x = 14$，$x = 7$。",
      ),
      generate(rng) {
        for (;;) {
          const angle = rng.bool();
          const x = rng.int(3, 15);
          const [c1, c2] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
          const value = angle ? rng.int(25, 150) : rng.int(8, 60);
          const [d1, d2] = [value - c1 * x, value - c2 * x];
          if (Math.abs(d1) > 40 || Math.abs(d2) > 40 || (d1 === 0 && d2 === 0)) continue;
          const kind = angle ? 1 : 0;
          const [p, q, r] = figureNames(rng, kind, 3) as [string, string, string];
          const measure = (f: string) => (angle ? `m${f.replace("\\angle ", "\\angle ")}` : f.replace(/\\overline\{(.*)\}/, "$1"));
          const expr = (c: number, d: number) => (angle ? `(${linear(c, d)})^\\circ` : linear(c, d));
          const second = rng.bool() ? `${q} \\cong ${r}` : `${r} \\cong ${q}`;
          const big = c1 > c2;
          const collected = big ? `${linear(c1 - c2, 0)} = ${d2 - d1}` : `${d1 - d2} = ${linear(c2 - c1, 0)}`;
          return numberProblem({
            prompt: t(
              `$${p} \\cong ${q}$ and $${second}$. If $${measure(p)} = ${expr(c1, d1)}$ and $${measure(r)} = ${expr(c2, d2)}$, find $x$.`,
              `$${p} \\cong ${q}$，$${second}$。若 $${measure(p)} = ${expr(c1, d1)}$，$${measure(r)} = ${expr(c2, d2)}$，求 $x$。`,
            ),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [intOr(d2 - d1, c1 + c2, -x), -x, value, intOr(d1 - d2, c1 - c2, x + 1) === x ? x + 1 : intOr(d1 - d2, c1 - c2, x + 1)],
            solution: t(
              `By the symmetric and transitive properties, $${p} \\cong ${r}$, so their measures are equal:${steps(`${linear(c1, d1)} = ${linear(c2, d2)}`, collected, `x = ${x}`)}`,
              `由对称性和传递性，$${p} \\cong ${r}$，所以它们的度量相等：${steps(`${linear(c1, d1)} = ${linear(c2, d2)}`, collected, `x = ${x}`)}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── Proving Congruence Statements ──────────────────────────────────────────

/** reasons are the reasons a step of a congruence proof can cite. */
const reasons = {
  given: t("Given", "已知"),
  defMid: t("Definition of midpoint", "中点的定义"),
  defBis: t("Definition of angle bisector", "角平分线的定义"),
  defPerp: t("Definition of perpendicular lines", "垂直的定义"),
  rightCong: t("Right Angles Congruence Theorem", "直角相等定理"),
  vertical: t("Vertical Angles Theorem", "对顶角定理"),
  aia: t("Alternate Interior Angles Theorem", "内错角定理"),
  reflexive: t("Reflexive Property of Congruence", "全等的自反性"),
  sss: t("SSS Congruence Criterion", "SSS 全等判定"),
  sas: t("SAS Congruence Criterion", "SAS 全等判定"),
  asa: t("ASA Congruence Criterion", "ASA 全等判定"),
  aas: t("AAS Congruence Criterion", "AAS 全等判定"),
  hl: t("HL Congruence Criterion", "HL 全等判定"),
  cpctc: t("Corresponding parts of congruent triangles are congruent", "全等三角形的对应部分全等"),
} as const;

/** Reason names a reason a proof step can cite. */
type Reason = keyof typeof reasons;

const reasonKeys = Object.keys(reasons) as Reason[];

/** alike are reasons too close to tell apart in a step: neither is offered as a wrong option when the other is right. */
const alike: Partial<Record<Reason, readonly Reason[]>> = {
  defPerp: ["rightCong"],
  rightCong: ["defPerp"],
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

/** proofProblem asks for the reason, or the statement, of one step of a proof. */
function proofProblem(rng: Rng, proof: Proof): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [step, k] = rng.pick(eligible);
  const askStatement = step.alts !== undefined && step.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  if (askStatement) {
    options = [step.s, ...rng.sample(step.alts!, Math.min(3, step.alts!.length))];
  } else {
    const others = reasonKeys.filter((r) => r !== step.r && !(alike[step.r] ?? []).includes(r));
    options = [reasons[step.r], ...rng.sample(others, 3).map((r) => reasons[r])];
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

/** cong writes a congruence of two figures written in LaTeX. */
const cong = (a: string, b: string) => m(`${a} \\cong ${b}`);

/** sg writes a segment. */
const sg = (ab: string) => `\\overline{${ab}}`;

/** tr writes a triangle. */
const tr = (abc: string) => `\\triangle ${abc}`;

/** an writes an angle. */
const an = (abc: string) => `\\angle ${abc}`;

/** bowtieProof proves a congruence of the triangles formed by two crossing segments: by SAS from midpoints, or by ASA or AAS from parallel lines. */
function bowtieProof(rng: Rng, kind: "sas" | "asa" | "aas"): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const [pa, pb, pc, pd, pe] = bowtiePoints(rng);
  const marks: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "polygon", points: [pd, pe, pc] },
    ...names([pa, pb, pd, pe], [A, B, D, E], [0, 0]),
    { kind: "label", at: pc, text: C, dir: compassOf(pa[0] + pd[0] - pb[0] - pe[0], pa[1] + pd[1] - pb[1] - pe[1]), italic: true },
  ];
  if (kind === "sas")
    marks.push(
      { kind: "ticks", a: pa, b: pc, count: 1 },
      { kind: "ticks", a: pc, b: pd, count: 1 },
      { kind: "ticks", a: pb, b: pc, count: 2 },
      { kind: "ticks", a: pc, b: pe, count: 2 },
    );
  else {
    marks.push({ kind: "arrows", a: pa, b: pb, count: 1 }, { kind: "arrows", a: pe, b: pd, count: 1 });
    if (kind === "asa") marks.push({ kind: "ticks", a: pa, b: pc, count: 1 }, { kind: "ticks", a: pc, b: pd, count: 1 });
    else marks.push({ kind: "ticks", a: pb, b: pc, count: 1 }, { kind: "ticks", a: pc, b: pe, count: 1 });
  }
  const fig = figure(
    marks,
    `Segments ${A}${D} and ${B}${E} crossing at ${C}, forming triangles ${A}${B}${C} and ${D}${E}${C}.`,
    `线段 ${A}${D} 与 ${B}${E} 相交于 ${C}，构成三角形 ${A}${B}${C} 与 ${D}${E}${C}。`,
  );
  const vertical: ProofStep = {
    s: cong(an(`${A}${C}${B}`), an(`${D}${C}${E}`)),
    r: "vertical",
    why: t(
      `$\\overline{${A}${D}}$ and $\\overline{${B}${E}}$ cross at $${C}$.`,
      `$\\overline{${A}${D}}$ 与 $\\overline{${B}${E}}$ 相交于 $${C}$。`,
    ),
    alts: [
      cong(an(`${A}${C}${B}`), an(`${B}${C}${D}`)),
      cong(an(`${A}${C}${B}`), an(`${A}${C}${E}`)),
      cong(an(`${C}${A}${B}`), an(`${C}${D}${E}`)),
    ],
  };
  const triangles = (r: Reason, why: Text): ProofStep => ({
    s: cong(tr(`${A}${B}${C}`), tr(`${D}${E}${C}`)),
    r,
    why,
    alts: [
      cong(tr(`${A}${B}${C}`), tr(`${E}${D}${C}`)),
      cong(tr(`${A}${B}${C}`), tr(`${C}${D}${E}`)),
      cong(tr(`${A}${C}${B}`), tr(`${D}${E}${C}`)),
    ],
  });
  if (kind === "sas") {
    return {
      given: t(
        `$${C}$ is the midpoint of $\\overline{${A}${D}}$ and of $\\overline{${B}${E}}$`,
        `$${C}$ 是 $\\overline{${A}${D}}$ 的中点，也是 $\\overline{${B}${E}}$ 的中点`,
      ),
      prove: cong(sg(`${A}${B}`), sg(`${D}${E}`)),
      steps: [
        {
          s: t(
            `$${C}$ is the midpoint of $\\overline{${A}${D}}$ and $\\overline{${B}${E}}$`,
            `$${C}$ 是 $\\overline{${A}${D}}$ 和 $\\overline{${B}${E}}$ 的中点`,
          ),
          r: "given",
        },
        {
          s: cong(sg(`${A}${C}`), sg(`${D}${C}`)),
          r: "defMid",
          alts: [cong(sg(`${A}${C}`), sg(`${B}${C}`)), cong(sg(`${A}${C}`), sg(`${E}${C}`)), cong(sg(`${A}${B}`), sg(`${D}${E}`))],
        },
        {
          s: cong(sg(`${B}${C}`), sg(`${E}${C}`)),
          r: "defMid",
          alts: [cong(sg(`${B}${C}`), sg(`${D}${C}`)), cong(sg(`${B}${C}`), sg(`${A}${C}`)), cong(sg(`${A}${B}`), sg(`${D}${E}`))],
        },
        vertical,
        triangles(
          "sas",
          t(
            `The vertical angles at $${C}$ lie between the congruent sides from steps 2 and 3.`,
            `$${C}$ 处的对顶角正是第 2、3 步中全等两边的夹角。`,
          ),
        ),
        {
          s: cong(sg(`${A}${B}`), sg(`${D}${E}`)),
          r: "cpctc",
          alts: [cong(sg(`${A}${B}`), sg(`${E}${C}`)), cong(sg(`${A}${B}`), sg(`${A}${C}`)), cong(sg(`${A}${D}`), sg(`${B}${E}`))],
        },
      ],
      figure: fig,
    };
  }
  const parallel: ProofStep = { s: m(`\\overline{${A}${B}} \\parallel \\overline{${D}${E}}`), r: "given" };
  const alternate: ProofStep = {
    s: cong(an(`${B}${A}${C}`), an(`${E}${D}${C}`)),
    r: "aia",
    why: t(
      `$\\overline{${A}${D}}$ is a transversal of the parallel segments $\\overline{${A}${B}}$ and $\\overline{${D}${E}}$.`,
      `$\\overline{${A}${D}}$ 是平行线段 $\\overline{${A}${B}}$ 与 $\\overline{${D}${E}}$ 的截线。`,
    ),
    alts: [
      cong(an(`${B}${A}${C}`), an(`${D}${E}${C}`)),
      cong(an(`${B}${A}${C}`), an(`${A}${C}${B}`)),
      cong(an(`${A}${B}${C}`), an(`${E}${D}${C}`)),
    ],
  };
  if (kind === "asa") {
    return {
      given: t(
        `$\\overline{${A}${B}} \\parallel \\overline{${D}${E}}$, and $${C}$ is the midpoint of $\\overline{${A}${D}}$`,
        `$\\overline{${A}${B}} \\parallel \\overline{${D}${E}}$，$${C}$ 是 $\\overline{${A}${D}}$ 的中点`,
      ),
      prove: cong(sg(`${A}${B}`), sg(`${D}${E}`)),
      steps: [
        parallel,
        alternate,
        { s: t(`$${C}$ is the midpoint of $\\overline{${A}${D}}$`, `$${C}$ 是 $\\overline{${A}${D}}$ 的中点`), r: "given" },
        {
          s: cong(sg(`${A}${C}`), sg(`${D}${C}`)),
          r: "defMid",
          alts: [cong(sg(`${A}${C}`), sg(`${B}${C}`)), cong(sg(`${B}${C}`), sg(`${E}${C}`)), cong(sg(`${A}${B}`), sg(`${D}${E}`))],
        },
        vertical,
        triangles(
          "asa",
          t(
            `The congruent sides $\\overline{${A}${C}}$ and $\\overline{${D}${C}}$ lie between the congruent angles of steps 2 and 5.`,
            `全等的边 $\\overline{${A}${C}}$ 与 $\\overline{${D}${C}}$ 位于第 2、5 步中全等的两角之间。`,
          ),
        ),
        {
          s: cong(sg(`${A}${B}`), sg(`${D}${E}`)),
          r: "cpctc",
          alts: [cong(sg(`${A}${B}`), sg(`${D}${C}`)), cong(sg(`${A}${B}`), sg(`${B}${C}`)), cong(sg(`${B}${C}`), sg(`${D}${C}`))],
        },
      ],
      figure: fig,
    };
  }
  return {
    given: t(
      `$\\overline{${A}${B}} \\parallel \\overline{${D}${E}}$, and $\\overline{${B}${C}} \\cong \\overline{${E}${C}}$`,
      `$\\overline{${A}${B}} \\parallel \\overline{${D}${E}}$，$\\overline{${B}${C}} \\cong \\overline{${E}${C}}$`,
    ),
    prove: cong(sg(`${A}${C}`), sg(`${D}${C}`)),
    steps: [
      parallel,
      alternate,
      { s: cong(sg(`${B}${C}`), sg(`${E}${C}`)), r: "given" },
      vertical,
      triangles(
        "aas",
        t(
          `The congruent sides $\\overline{${B}${C}}$ and $\\overline{${E}${C}}$ are opposite the congruent angles at $${A}$ and $${D}$, not between the two pairs of congruent angles.`,
          `全等的边 $\\overline{${B}${C}}$ 与 $\\overline{${E}${C}}$ 是 $${A}$、$${D}$ 处全等角的对边，不在两组全等角之间。`,
        ),
      ),
      {
        s: cong(sg(`${A}${C}`), sg(`${D}${C}`)),
        r: "cpctc",
        alts: [cong(sg(`${A}${C}`), sg(`${B}${C}`)), cong(sg(`${A}${C}`), sg(`${E}${C}`)), cong(sg(`${A}${B}`), sg(`${D}${C}`))],
      },
    ],
    figure: fig,
  };
}

/** kiteProof proves a congruence of two triangles sharing a side: by SSS, SAS, ASA or AAS. */
function kiteProof(rng: Rng, kind: "sss" | "sas" | "asa" | "aas"): Proof {
  const [U, V, X, Y] = pickLetters(rng, 4) as [string, string, string, string];
  const [pu, pv, px, py] = kitePoints(rng, false);
  const marks: Mark[] = [
    { kind: "polygon", points: [pu, px, pv, py] },
    { kind: "segment", a: pu, b: pv },
    ...names([pu, pv, px, py], [U, V, X, Y]),
  ];
  const ticks = (a: Point, b: Point, c: Point, count: number) =>
    marks.push({ kind: "ticks", a, b, count }, { kind: "ticks", a: c, b, count });
  const arcs = (v: Point, a: Point, b: Point, c: Point) =>
    marks.push({ kind: "arc", vertex: v, from: a, to: b, accent: true }, { kind: "arc", vertex: v, from: b, to: c, accent: true });
  if (kind === "sss" || kind === "sas") ticks(px, pu, py, 1);
  if (kind === "sss") ticks(px, pv, py, 2);
  if (kind !== "sss") arcs(pu, px, pv, py);
  if (kind === "asa") arcs(pv, px, pu, py);
  if (kind === "aas")
    marks.push({ kind: "arc", vertex: px, from: pu, to: pv, accent: true }, { kind: "arc", vertex: py, from: pu, to: pv, accent: true });
  const fig = figure(
    marks,
    `Quadrilateral ${U}${X}${V}${Y} with diagonal ${U}${V}, forming triangles ${U}${X}${V} and ${U}${Y}${V}.`,
    `四边形 ${U}${X}${V}${Y} 及对角线 ${U}${V}，构成三角形 ${U}${X}${V} 与 ${U}${Y}${V}。`,
  );
  const shared: ProofStep = {
    s: cong(sg(`${U}${V}`), sg(`${U}${V}`)),
    r: "reflexive",
    why: t(`The two triangles share the side $\\overline{${U}${V}}$.`, `两个三角形有公共边 $\\overline{${U}${V}}$。`),
  };
  const bisectU: ProofStep = {
    s: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
    r: "defBis",
    alts: [
      cong(an(`${X}${U}${V}`), an(`${X}${V}${U}`)),
      cong(an(`${X}${U}${V}`), an(`${U}${X}${V}`)),
      cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    ],
  };
  const triangles = (r: Reason): ProofStep => ({
    s: cong(tr(`${U}${X}${V}`), tr(`${U}${Y}${V}`)),
    r,
    alts: [
      cong(tr(`${U}${X}${V}`), tr(`${Y}${U}${V}`)),
      cong(tr(`${U}${X}${V}`), tr(`${V}${Y}${U}`)),
      cong(tr(`${X}${U}${V}`), tr(`${U}${Y}${V}`)),
    ],
  });
  const sideU: ProofStep = {
    s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    r: "cpctc",
    alts: [cong(sg(`${U}${X}`), sg(`${V}${Y}`)), cong(sg(`${U}${X}`), sg(`${U}${V}`)), cong(sg(`${X}${V}`), sg(`${U}${Y}`))],
  };
  if (kind === "sss") {
    return {
      given: t(
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$ and $\\overline{${V}${X}} \\cong \\overline{${V}${Y}}$`,
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$，$\\overline{${V}${X}} \\cong \\overline{${V}${Y}}$`,
      ),
      prove: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
      steps: [
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given" },
        { s: cong(sg(`${V}${X}`), sg(`${V}${Y}`)), r: "given" },
        shared,
        triangles("sss"),
        {
          s: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
          r: "cpctc",
          alts: [
            cong(an(`${X}${U}${V}`), an(`${Y}${V}${U}`)),
            cong(an(`${X}${U}${V}`), an(`${U}${X}${V}`)),
            cong(an(`${U}${X}${V}`), an(`${Y}${U}${V}`)),
          ],
        },
      ],
      figure: fig,
    };
  }
  if (kind === "sas") {
    return {
      given: t(
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$, and $\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`,
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$，$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`,
      ),
      prove: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
      steps: [
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given" },
        { s: t(`$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`, `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`), r: "given" },
        bisectU,
        shared,
        triangles("sas"),
        {
          s: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
          r: "cpctc",
          alts: [cong(sg(`${X}${V}`), sg(`${U}${Y}`)), cong(sg(`${X}${V}`), sg(`${U}${V}`)), cong(sg(`${U}${X}`), sg(`${Y}${V}`))],
        },
      ],
      figure: fig,
    };
  }
  if (kind === "asa") {
    return {
      given: t(
        `$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$ and $\\angle ${X}${V}${Y}$`,
        `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$ 和 $\\angle ${X}${V}${Y}$`,
      ),
      prove: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
      steps: [
        {
          s: t(
            `$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$ and $\\angle ${X}${V}${Y}$`,
            `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$ 和 $\\angle ${X}${V}${Y}$`,
          ),
          r: "given",
        },
        bisectU,
        {
          s: cong(an(`${X}${V}${U}`), an(`${Y}${V}${U}`)),
          r: "defBis",
          alts: [
            cong(an(`${X}${V}${U}`), an(`${Y}${U}${V}`)),
            cong(an(`${X}${V}${U}`), an(`${U}${Y}${V}`)),
            cong(sg(`${V}${X}`), sg(`${V}${Y}`)),
          ],
        },
        shared,
        triangles("asa"),
        sideU,
      ],
      figure: fig,
    };
  }
  return {
    given: t(
      `$\\angle ${U}${X}${V} \\cong \\angle ${U}${Y}${V}$, and $\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`,
      `$\\angle ${U}${X}${V} \\cong \\angle ${U}${Y}${V}$，$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`,
    ),
    prove: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    steps: [
      { s: cong(an(`${U}${X}${V}`), an(`${U}${Y}${V}`)), r: "given" },
      { s: t(`$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`, `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`), r: "given" },
      bisectU,
      shared,
      triangles("aas"),
      sideU,
    ],
    figure: fig,
  };
}

/** altitudeProof proves facts about a triangle with a segment from the apex perpendicular to the base: by HL or by SAS. */
function altitudeProof(rng: Rng, kind: "hl" | "sas"): Proof {
  const [U, X, Y, V] = pickLetters(rng, 4) as [string, string, string, string];
  const w = rng.int(3, 7);
  const h = rng.int(4, 9);
  const [pu, px, py, pv] = posed(
    [
      [0, h],
      [-w, 0],
      [w, 0],
      [0, 0],
    ] as const,
    { turn: rng.pick([0, 0, 90, -90, 180]), mirror: false },
  );
  const marks: Mark[] = [
    { kind: "polygon", points: [pu, px, py] },
    { kind: "segment", a: pu, b: pv },
    { kind: "right", vertex: pv, from: py, to: pu },
    ...names([pu, px, py], [U, X, Y]),
    { kind: "label", at: pv, text: V, dir: compassOf(pv[0] - pu[0], pv[1] - pu[1]), italic: true },
  ];
  if (kind === "hl") marks.push({ kind: "ticks", a: pu, b: px, count: 1 }, { kind: "ticks", a: pu, b: py, count: 1 });
  else marks.push({ kind: "ticks", a: px, b: pv, count: 1 }, { kind: "ticks", a: pv, b: py, count: 1 });
  const fig = figure(
    marks,
    `Triangle ${U}${X}${Y} with segment ${U}${V} perpendicular to ${X}${Y}, ${V} on ${X}${Y}.`,
    `三角形 ${U}${X}${Y}，线段 ${U}${V} 垂直于 ${X}${Y}，${V} 在 ${X}${Y} 上。`,
  );
  const perp: ProofStep = {
    s: t(`$\\angle ${U}${V}${X}$ and $\\angle ${U}${V}${Y}$ are right angles`, `$\\angle ${U}${V}${X}$ 和 $\\angle ${U}${V}${Y}$ 都是直角`),
    r: "defPerp",
    alts: [
      t(`$\\angle ${X}$ and $\\angle ${Y}$ are right angles`, `$\\angle ${X}$ 和 $\\angle ${Y}$ 都是直角`),
      t(`$\\angle ${U}${V}${X}$ and $\\angle ${U}${V}${Y}$ are acute angles`, `$\\angle ${U}${V}${X}$ 和 $\\angle ${U}${V}${Y}$ 都是锐角`),
      cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
    ],
  };
  const shared: ProofStep = {
    s: cong(sg(`${U}${V}`), sg(`${U}${V}`)),
    r: "reflexive",
    why: t(`The two triangles share the side $\\overline{${U}${V}}$.`, `两个三角形有公共边 $\\overline{${U}${V}}$。`),
  };
  const triangles = (r: Reason, why: Text): ProofStep => ({
    s: cong(tr(`${U}${V}${X}`), tr(`${U}${V}${Y}`)),
    r,
    why,
    alts: [
      cong(tr(`${U}${V}${X}`), tr(`${V}${U}${Y}`)),
      cong(tr(`${U}${V}${X}`), tr(`${U}${Y}${V}`)),
      cong(tr(`${U}${X}${V}`), tr(`${U}${V}${Y}`)),
    ],
  });
  const perpGiven = m(`\\overline{${U}${V}} \\perp \\overline{${X}${Y}}`);
  if (kind === "hl") {
    return {
      given: t(
        `$\\overline{${U}${V}} \\perp \\overline{${X}${Y}}$, and $\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$`,
        `$\\overline{${U}${V}} \\perp \\overline{${X}${Y}}$，$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$`,
      ),
      prove: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
      steps: [
        { s: perpGiven, r: "given" },
        perp,
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given" },
        shared,
        triangles(
          "hl",
          t(
            `They are right triangles with congruent hypotenuses $\\overline{${U}${X}}$ and $\\overline{${U}${Y}}$ and the common leg $\\overline{${U}${V}}$.`,
            `它们是直角三角形，斜边 $\\overline{${U}${X}}$ 与 $\\overline{${U}${Y}}$ 全等，且有公共直角边 $\\overline{${U}${V}}$。`,
          ),
        ),
        {
          s: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
          r: "cpctc",
          alts: [cong(sg(`${X}${V}`), sg(`${U}${V}`)), cong(sg(`${X}${V}`), sg(`${U}${Y}`)), cong(sg(`${X}${Y}`), sg(`${U}${V}`))],
        },
      ],
      figure: fig,
    };
  }
  return {
    given: t(
      `$\\overline{${U}${V}} \\perp \\overline{${X}${Y}}$, and $${V}$ is the midpoint of $\\overline{${X}${Y}}$`,
      `$\\overline{${U}${V}} \\perp \\overline{${X}${Y}}$，$${V}$ 是 $\\overline{${X}${Y}}$ 的中点`,
    ),
    prove: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    steps: [
      { s: perpGiven, r: "given" },
      perp,
      {
        s: cong(an(`${U}${V}${X}`), an(`${U}${V}${Y}`)),
        r: "rightCong",
        alts: [
          cong(an(`${U}${V}${X}`), an(`${U}${X}${V}`)),
          cong(an(`${X}`), an(`${U}${V}${Y}`)),
          cong(an(`${X}${U}${V}`), an(`${U}${V}${Y}`)),
        ],
      },
      { s: t(`$${V}$ is the midpoint of $\\overline{${X}${Y}}$`, `$${V}$ 是 $\\overline{${X}${Y}}$ 的中点`), r: "given" },
      {
        s: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
        r: "defMid",
        alts: [cong(sg(`${X}${V}`), sg(`${U}${V}`)), cong(sg(`${U}${X}`), sg(`${U}${Y}`)), cong(sg(`${X}${Y}`), sg(`${U}${V}`))],
      },
      shared,
      triangles(
        "sas",
        t(
          `The right angles at $${V}$ lie between $\\overline{${X}${V}}$, $\\overline{${Y}${V}}$ and the common side $\\overline{${U}${V}}$.`,
          `$${V}$ 处的直角正是 $\\overline{${X}${V}}$、$\\overline{${Y}${V}}$ 与公共边 $\\overline{${U}${V}}$ 的夹角。`,
        ),
      ),
      {
        s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
        r: "cpctc",
        alts: [cong(sg(`${U}${X}`), sg(`${X}${V}`)), cong(sg(`${U}${X}`), sg(`${U}${V}`)), cong(sg(`${U}${V}`), sg(`${X}${Y}`))],
      },
    ],
    figure: fig,
  };
}

export const provingCongruenceStatements: TopicDef = {
  id: "proving-congruence-statements",
  title: t("Proving Congruence Statements", "证明全等"),
  summary: t(
    "Complete two-column proofs that triangles are congruent, using midpoints, bisectors, parallel and perpendicular lines, and CPCTC.",
    "补全证明三角形全等的两栏式证明，用到中点、角平分线、平行线、垂线和“全等三角形的对应部分全等”。",
  ),
  prerequisites: ["combining-congruence-criteria-for-triangles", "properties-of-congruence"],
  encompasses: [
    { topic: "combining-congruence-criteria-for-triangles", weight: 0.5 },
    { topic: "properties-of-congruence", weight: 0.3 },
    { topic: "identifying-angle-theorems", weight: 0.2 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.SRT.B.5", "CCSS.HSG.CO.C.10"],
  knowledgePoints: [
    {
      id: "proofs-with-sss-and-sas",
      title: t("Proofs with SSS and SAS", "用 SSS 和 SAS 证明"),
      explanation: t(
        "A **two-column proof** lists statements, each with its reason. A congruence proof collects three pairs of congruent parts, names the criterion, and then may use **CPCTC** (corresponding parts of congruent triangles are congruent) to conclude about any other pair of parts.\n\n**Given:** $C$ is the midpoint of $\\overline{AD}$ and of $\\overline{BE}$. **Prove:** $\\overline{AB} \\cong \\overline{DE}$.\n\n1. $C$ is the midpoint of $\\overline{AD}$ and $\\overline{BE}$ —— Given\n2. $\\overline{AC} \\cong \\overline{DC}$ —— Definition of midpoint\n3. $\\overline{BC} \\cong \\overline{EC}$ —— Definition of midpoint\n4. $\\angle ACB \\cong \\angle DCE$ —— Vertical Angles Theorem\n5. $\\triangle ABC \\cong \\triangle DEC$ —— SAS\n6. $\\overline{AB} \\cong \\overline{DE}$ —— CPCTC\n\nA side shared by both triangles is justified by the Reflexive Property.",
        "**两栏式证明**逐条列出结论及其理由。证明全等时，先凑齐三组全等的部分，写出所用的判定方法，然后可以用**全等三角形的对应部分全等**得出其他任何一组对应部分的结论。\n\n**已知：** $C$ 是 $\\overline{AD}$ 的中点，也是 $\\overline{BE}$ 的中点。**求证：** $\\overline{AB} \\cong \\overline{DE}$。\n\n1. $C$ 是 $\\overline{AD}$ 和 $\\overline{BE}$ 的中点 —— 已知\n2. $\\overline{AC} \\cong \\overline{DC}$ —— 中点的定义\n3. $\\overline{BC} \\cong \\overline{EC}$ —— 中点的定义\n4. $\\angle ACB \\cong \\angle DCE$ —— 对顶角定理\n5. $\\triangle ABC \\cong \\triangle DEC$ —— SAS\n6. $\\overline{AB} \\cong \\overline{DE}$ —— 全等三角形的对应部分全等\n\n两个三角形的公共边，理由是全等的自反性。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        return proofProblem(rng, kind === 0 ? bowtieProof(rng, "sas") : kiteProof(rng, kind === 1 ? "sss" : "sas"));
      },
    },
    {
      id: "proofs-with-asa-and-aas",
      title: t("Proofs with ASA and AAS", "用 ASA 和 AAS 证明"),
      explanation: t(
        "Congruent angles often come from parallel lines (alternate interior angles), from crossing lines (vertical angles) or from a bisector.\n\n**Given:** $\\overline{AB} \\parallel \\overline{DE}$, and $C$ is the midpoint of $\\overline{AD}$. **Prove:** $\\overline{AB} \\cong \\overline{DE}$.\n\n1. $\\overline{AB} \\parallel \\overline{DE}$ —— Given\n2. $\\angle BAC \\cong \\angle EDC$ —— Alternate Interior Angles Theorem\n3. $C$ is the midpoint of $\\overline{AD}$ —— Given\n4. $\\overline{AC} \\cong \\overline{DC}$ —— Definition of midpoint\n5. $\\angle ACB \\cong \\angle DCE$ —— Vertical Angles Theorem\n6. $\\triangle ABC \\cong \\triangle DEC$ —— ASA, since $\\overline{AC}$ lies between the angles at $A$ and $C$\n7. $\\overline{AB} \\cong \\overline{DE}$ —— CPCTC",
        "全等的角常常来自平行线（内错角）、相交线（对顶角）或角平分线。\n\n**已知：** $\\overline{AB} \\parallel \\overline{DE}$，$C$ 是 $\\overline{AD}$ 的中点。**求证：** $\\overline{AB} \\cong \\overline{DE}$。\n\n1. $\\overline{AB} \\parallel \\overline{DE}$ —— 已知\n2. $\\angle BAC \\cong \\angle EDC$ —— 内错角定理\n3. $C$ 是 $\\overline{AD}$ 的中点 —— 已知\n4. $\\overline{AC} \\cong \\overline{DC}$ —— 中点的定义\n5. $\\angle ACB \\cong \\angle DCE$ —— 对顶角定理\n6. $\\triangle ABC \\cong \\triangle DEC$ —— ASA，因为 $\\overline{AC}$ 位于 $A$、$C$ 处的两角之间\n7. $\\overline{AB} \\cong \\overline{DE}$ —— 全等三角形的对应部分全等",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        return proofProblem(
          rng,
          kind === 0 ? bowtieProof(rng, "asa") : kind === 1 ? bowtieProof(rng, "aas") : kiteProof(rng, kind === 2 ? "asa" : "aas"),
        );
      },
    },
    {
      id: "proofs-with-right-angles",
      title: t("Proofs with right angles", "含直角的证明"),
      explanation: t(
        "A perpendicular segment gives right angles (definition of perpendicular lines), and all right angles are congruent (Right Angles Congruence Theorem). Right triangles can then be proved congruent by HL or by SAS.\n\n**Given:** $\\overline{UV} \\perp \\overline{XY}$, and $\\overline{UX} \\cong \\overline{UY}$. **Prove:** $\\overline{XV} \\cong \\overline{YV}$.\n\n1. $\\overline{UV} \\perp \\overline{XY}$ —— Given\n2. $\\angle UVX$ and $\\angle UVY$ are right angles —— Definition of perpendicular lines\n3. $\\overline{UX} \\cong \\overline{UY}$ —— Given\n4. $\\overline{UV} \\cong \\overline{UV}$ —— Reflexive Property\n5. $\\triangle UVX \\cong \\triangle UVY$ —— HL\n6. $\\overline{XV} \\cong \\overline{YV}$ —— CPCTC",
        "垂直的线段给出直角（垂直的定义），而所有直角都相等（直角相等定理）。于是可以用 HL 或 SAS 证明直角三角形全等。\n\n**已知：** $\\overline{UV} \\perp \\overline{XY}$，$\\overline{UX} \\cong \\overline{UY}$。**求证：** $\\overline{XV} \\cong \\overline{YV}$。\n\n1. $\\overline{UV} \\perp \\overline{XY}$ —— 已知\n2. $\\angle UVX$ 和 $\\angle UVY$ 都是直角 —— 垂直的定义\n3. $\\overline{UX} \\cong \\overline{UY}$ —— 已知\n4. $\\overline{UV} \\cong \\overline{UV}$ —— 全等的自反性\n5. $\\triangle UVX \\cong \\triangle UVY$ —— HL\n6. $\\overline{XV} \\cong \\overline{YV}$ —— 全等三角形的对应部分全等",
      ),
      generate(rng) {
        return proofProblem(rng, altitudeProof(rng, rng.bool() ? "hl" : "sas"));
      },
    },
  ],
};

/** congruenceTopics are the topics of Geometry module 1.3, in course order. */
export const congruenceTopics: readonly TopicDef[] = [
  theAsaCongruenceCriterion,
  theAasCongruenceCriterion,
  theSasCongruenceCriterion,
  theSssCongruenceCriterion,
  theHlCongruenceCriterion,
  combiningCongruenceCriteriaForTriangles,
  rigidMotionsAndCongruence,
  propertiesOfCongruence,
  provingCongruenceStatements,
];
