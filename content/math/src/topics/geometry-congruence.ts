import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type Point, plane, Q, sketch } from "@ga/subject-math";
import { motionDrawings } from "../explanation-drawings-angles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { congruenceDrawings } from "../explanation-drawings-triangles.ts";
import { choiceProblem, numberProblem, reasonChoice, steps, verdictChoice, yesNo } from "../problems.ts";
import { movedPolygon } from "../motion-figures.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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
  /** fresh are the sides and angles a step of a solution adds, drawn in the result color. */
  readonly fresh?: { readonly sides?: readonly number[]; readonly angles?: readonly number[] };
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
    if (look.fresh?.sides?.includes(i)) marks.push({ kind: "segment", a, b, tone: "result" });
    if (ticks > 0) marks.push({ kind: "ticks", a, b, count: ticks });
    if (label) marks.push({ kind: "side", a: ccw ? a : b, b: ccw ? b : a, text: label });
    const g = look.angles?.[i] ?? null;
    if (look.right === i) marks.push({ kind: "right", vertex: p[i]!, from: a, to: b });
    else if (g)
      marks.push({
        kind: "arc",
        vertex: p[i]!,
        from: a,
        to: b,
        label: typeof g === "string" ? g : undefined,
        accent: true,
        ...(look.fresh?.angles?.includes(i) && { tone: "result" as const }),
      });
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

/** scenarioProblem asks which criterion, if any, proves two triangles congruent; options are the criteria in crits, each wrong one with its reason. */
function scenarioProblem(rng: Rng, crit: Crit, crits: readonly Crit[], right: number | null = null): Problem & { figure: Figure } {
  const sc = scenarioFor(rng, crit, right);
  const [a, b, c, d, e, f] = pickLetters(rng, 6) as [string, string, string, string, string, string];
  const [n1, n2]: [Names, Names] = [
    [a, b, c],
    [d, e, f],
  ];
  const facts = rng.shuffle(sc.parts).map((p) => factText(p, n1, n2, sc.right));
  const shape = byAngles(randomAngles(rng, sc.right));
  const [en, zh] = pairAlt(n1, n2);
  return {
    ...criterionChoice(
      cat(
        t("In the figure, ", "图中，"),
        andList(facts),
        t(
          `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
          `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
        ),
      ),
      crits,
      sc.parts,
      sc.right,
      n1,
      n2,
    ),
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

// ─── Solutions ──────────────────────────────────────────────────────────────

/** paras joins texts as paragraphs. */
const paras = (...items: readonly Text[]) => t(items.map((p) => p.en).join("\n\n"), items.map((p) => p["zh-CN"]).join("\n\n"));

/** check writes the check paragraph of a solution. */
const check = (...body: readonly (Text | string)[]) => cat(t("**Check.** ", "**检验。** "), ...body);

/** step writes step i of a solution: its bold label, then its text. */
const step = (i: number, en: string, zh: string, ...body: readonly (Text | string)[]) => cat(stepLabel(i, en, zh), t(" ", ""), ...body);

/** given is the default source of a part in a check: it is marked or stated. */
const given = (_p: Part) => t("given", "已知");

/** partsCheck names the parts a criterion needs and confirms each one: how says where it comes from, given by default. */
function partsCheck(parts: readonly Part[], right: number | null, n1: Names, n2: Names, how: (p: Part) => Text = given, angle = ang): Text {
  const item = (p: Part) => cat(factText(p, n1, n2, right, angle), t(" (", "（"), how(p), t(")", "）"));
  const sides = parts.filter((p) => p.side);
  const angles = parts.filter((p) => !p.side);
  switch (criterionOf(parts, right)) {
    case "sss":
      return check(
        t("SSS needs three pairs of sides: ", "SSS 需要三组边："),
        andList(sides.map(item)),
        t(". All three are there.", "。三组都有。"),
      );
    case "sas": {
      const v = n1[angles[0]!.i]!;
      return check(
        t("SAS needs two sides and the angle between them. The sides: ", "SAS 需要两边及其夹角。两边："),
        andList(sides.map(item)),
        t(". The angle: ", "。角："),
        item(angles[0]!),
        t(`, and it lies between the two sides, since both sides end at $${v}$.`, `，它正是两边的夹角，因为两边都以 $${v}$ 为端点。`),
      );
    }
    case "asa": {
      const [p, q] = [n1[angles[0]!.i]!, n1[angles[1]!.i]!];
      return check(
        t("ASA needs two angles and the side between them. The angles: ", "ASA 需要两角及其夹边。两角："),
        andList(angles.map(item)),
        t(". The side: ", "。边："),
        item(sides[0]!),
        t(`, and it joins $${p}$ and $${q}$, the vertices of the two angles.`, `，它连接两个角的顶点 $${p}$ 和 $${q}$。`),
      );
    }
    case "aas": {
      const s = sides[0]!;
      return check(
        t("AAS needs two angles and a side that is not between them. The angles: ", "AAS 需要两角及其中一角的对边。两角："),
        andList(angles.map(item)),
        t(". The side: ", "。边："),
        item(s),
        t(
          `, and it is opposite $${angle(n1, s.i)}$, not the side joining the two angles' vertices.`,
          `，它是 $${angle(n1, s.i)}$ 的对边，不是连接两个角顶点的边。`,
        ),
      );
    }
    case "hl": {
      const r = right!;
      const leg = sides.find((p) => p.i !== r)!;
      return check(
        t(
          "HL needs right triangles, their hypotenuses and a pair of legs. The right angles: ",
          "HL 需要直角三角形、斜边和一组直角边。直角：",
        ),
        item(A(r)),
        t(". The hypotenuses: ", "。斜边："),
        item(S(r)),
        t(", the sides opposite the right angles. The legs: ", "，即直角所对的边。直角边："),
        item(leg),
        t(`, a side that ends at the right-angle vertex $${n1[r]}$.`, `，它以直角顶点 $${n1[r]}$ 为端点。`),
      );
    }
    default:
      return check(
        t(
          "Run through the criteria: SSS needs three sides, SAS the angle between two sides, ASA the side between two angles, AAS a side opposite one of two angles, and HL a right angle with a hypotenuse and a leg. These parts fit none of them, so the triangles could still differ.",
          "逐一对照各判定：SSS 要三条边，SAS 要两边的夹角，ASA 要两角的夹边，AAS 要两角中一角的对边，HL 要直角、斜边和直角边。这三组部分都不符合，所以两个三角形仍可能不同。",
        ),
      );
  }
}

/** countText writes how many pairs of sides or angles: "two pairs of angles", "两组角". */
function countText(k: number, side: boolean): Text {
  const what = side ? t("side", "边") : t("angle", "角");
  if (k === 0) return t(`no ${what.en}s`, `没有${what["zh-CN"]}`);
  return t(`${["one", "two", "three"][k - 1]} pair${k > 1 ? "s" : ""} of ${what.en}s`, `${["一", "两", "三"][k - 1]}组${what["zh-CN"]}`);
}

/** criterionSolution sorts three pairs of parts, places them and names the criterion, then checks its parts; first is an earlier step that finds an unmarked part. */
function criterionSolution(
  parts: readonly Part[],
  right: number | null,
  n1: Names,
  n2: Names,
  options: { readonly first?: (i: number) => Text; readonly how?: (p: Part) => Text; readonly angle?: typeof ang } = {},
): Text {
  const o = options.first ? 1 : 0;
  const sides = parts.filter((p) => p.side).length;
  return paras(
    ...(options.first ? [options.first(1)] : []),
    step(
      1 + o,
      "sort the parts",
      "把部分归类",
      t(
        `The facts give ${countText(3 - sides, false).en} and ${countText(sides, true).en}${right !== null ? ", and both triangles are right triangles" : ""}.`,
        `这些条件给出${countText(3 - sides, false)["zh-CN"]}、${countText(sides, true)["zh-CN"]}${right !== null ? "，并且两个三角形都是直角三角形" : ""}。`,
      ),
    ),
    step(2 + o, "see where they sit", "看它们的位置", critWhy(parts, right)),
    partsCheck(parts, right, n1, n2, options.how, options.angle),
  );
}

/** critNeeds says what each criterion needs. */
const critNeeds: Record<Crit, Text> = {
  sss: t("three pairs of congruent sides", "三组全等的边"),
  sas: t("two pairs of congruent sides and the pair of congruent angles between them", "两组全等的边，以及它们的一组全等夹角"),
  asa: t("two pairs of congruent angles and the pair of congruent sides between them", "两组全等的角，以及它们的一组全等夹边"),
  aas: t("two pairs of congruent angles and a pair of congruent sides not between them", "两组全等的角，以及一组不是夹边的全等边"),
  hl: t("right triangles with congruent hypotenuses and a pair of congruent legs", "斜边全等且有一组直角边全等的直角三角形"),
  none: t("", ""),
};

/** critReasons say why each wrong criterion in crits does not fit the parts. */
function critReasons(crits: readonly Crit[], parts: readonly Part[], right: number | null) {
  const answer = criterionOf(parts, right);
  return crits
    .filter((c) => c !== answer)
    .map((c) =>
      c === "none"
        ? ([
            critNames.none.en,
            `These three pairs fit ${critNames[answer].en}, so there is enough information.`,
            `这三组部分符合 ${critNames[answer]["zh-CN"]}，条件是足够的。`,
          ] as const)
        : ([
            critNames[c].en,
            `${critNames[c].en} needs ${critNeeds[c].en}, and these facts do not give that.`,
            `${critNames[c]["zh-CN"]} 需要${critNeeds[c]["zh-CN"]}，而这些条件不是这样。`,
          ] as const),
    );
}

/** criterionChoice asks which of crits proves two triangles congruent from three pairs of parts, with a solution that sorts, places and checks them. */
function criterionChoice(
  prompt: Text,
  crits: readonly Crit[],
  parts: readonly Part[],
  right: number | null,
  n1: Names,
  n2: Names,
  options: Parameters<typeof criterionSolution>[4] = {},
): Problem {
  return reasoned(
    choiceProblem({
      prompt,
      options: crits.map((x) => critNames[x]),
      correct: crits.indexOf(criterionOf(parts, right)),
      solution: criterionSolution(parts, right, n1, n2, options),
    }),
    critReasons(crits, parts, right),
  );
}

/** substituted writes cx + d at x as LaTeX: "3 \cdot 4 + 2 = 14". */
const substituted = (u: Unknown) => `${u.c === 1 ? "" : `${u.c} \\cdot `}${u.x} ${u.d < 0 ? "-" : "+"} ${Math.abs(u.d)} = ${u.target}`;

// ─── The ASA Congruence Criterion ───────────────────────────────────────────

export const theAsaCongruenceCriterion: TopicDef = {
  id: "the-asa-congruence-criterion",
  title: t("The ASA Congruence Criterion", "ASA 全等判定"),
  summary: t(
    "Read congruence statements, and prove triangles congruent from two angles and the side between them.",
    "读懂全等的表示，并由两角及其夹边证明三角形全等。",
  ),
  prerequisites: ["identifying-angle-theorems", "angles-of-a-triangle"],
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSG.CO.B.7", "CCSS.HSG.CO.B.8"],
  intro: t(
    "Two triangles are congruent when all six pairs of parts match: three pairs of sides and three pairs of angles. Checking all six is slow, and the angle sum already ties a triangle's angles together, so fewer pairs are enough. The **congruence criteria** name which three pairs will do. The first is **ASA**: two angles and the side between them.\n\nTake $\\triangle ABC$ with $m\\angle A = 40^\\circ$, $m\\angle B = 60^\\circ$, $AB = 5$, and $\\triangle DEF$ with $m\\angle D = 40^\\circ$, $m\\angle E = 60^\\circ$, $DE = 5$.\n\n{{figure 0}}\n\n$\\overline{AB}$ joins the vertices of the two angles, and so does $\\overline{DE}$, so ASA gives $\\triangle ABC \\cong \\triangle DEF$. Congruence promises that the unmarked parts match too, and the third angles agree: $m\\angle C = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ$ and $m\\angle F = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ$.",
    "两个三角形的六组对应部分（三组边和三组角）都相等时，它们全等。逐一检查六组很慢，而三角形的内角和已经把三个角联系在一起，所以不需要这么多组。**全等判定**说明哪三组就够了。第一种是 **ASA**：两角及其夹边。\n\n取 $\\triangle ABC$，$m\\angle A = 40^\\circ$，$m\\angle B = 60^\\circ$，$AB = 5$；$\\triangle DEF$，$m\\angle D = 40^\\circ$，$m\\angle E = 60^\\circ$，$DE = 5$。\n\n{{figure 0}}\n\n$\\overline{AB}$ 连接两个角的顶点，$\\overline{DE}$ 也是，所以由 ASA 得 $\\triangle ABC \\cong \\triangle DEF$。全等意味着没有标出的部分也相等，第三个角确实一致：$m\\angle C = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ$，$m\\angle F = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ$。",
  ),
  introFigures: [
    pairFigure(
      byAngles([40, 60, 80]),
      { turn: 20, mirror: true },
      ["A", "B", "C"],
      { sides: [null, null, { ticks: 1, label: "5" }], angles: ["40°", "60°", null] },
      ["D", "E", "F"],
      { sides: [null, null, { ticks: 1, label: "5" }], angles: ["40°", "60°", null] },
      "Triangles ABC and DEF with angles of 40° and 60° at A, B and at D, E, and AB = DE = 5.",
      "三角形 ABC 与 DEF：A、B 处和 D、E 处的角分别为 40° 和 60°，AB = DE = 5。",
    ),
  ],
  knowledgePoints: [
    {
      id: "congruence-statements",
      figure: congruenceDrawings["congruence-statements"],
      title: t("Congruence statements", "全等的表示"),
      explanation: t(
        "Two triangles are **congruent** ($\\cong$) when they have the same size and shape: their corresponding sides and corresponding angles are equal.\n\nA **congruence statement** lists corresponding vertices in the same order. $\\triangle ABC \\cong \\triangle PQR$ says $A \\leftrightarrow P$, $B \\leftrightarrow Q$ and $C \\leftrightarrow R$, so $\\overline{AB} \\cong \\overline{PQ}$, $\\overline{BC} \\cong \\overline{QR}$, $\\overline{CA} \\cong \\overline{RP}$ and $\\angle A \\cong \\angle P$, $\\angle B \\cong \\angle Q$, $\\angle C \\cong \\angle R$.\n\nIf $\\triangle BCA \\cong \\triangle RPQ$ and $AC = 9$, match by position: $B \\leftrightarrow R$, $C \\leftrightarrow P$, $A \\leftrightarrow Q$, so $\\overline{AC}$ corresponds to $\\overline{QP}$ and $QP = 9$.\n\n> **Watch out.** Match by position in the statement, not by alphabetical order or by how the figure looks. In $\\triangle BCA \\cong \\triangle RPQ$, $A$ is third, so it pairs with $Q$, the third letter on the other side; $\\overline{AC}$ pairs with $\\overline{QP}$, not with $\\overline{PR}$.",
        "两个三角形大小、形状都相同时，称它们**全等**（$\\cong$）：它们的对应边相等，对应角也相等。\n\n**全等式**按相同的顺序写出对应顶点。$\\triangle ABC \\cong \\triangle PQR$ 表示 $A \\leftrightarrow P$，$B \\leftrightarrow Q$，$C \\leftrightarrow R$，所以 $\\overline{AB} \\cong \\overline{PQ}$，$\\overline{BC} \\cong \\overline{QR}$，$\\overline{CA} \\cong \\overline{RP}$，$\\angle A \\cong \\angle P$，$\\angle B \\cong \\angle Q$，$\\angle C \\cong \\angle R$。\n\n若 $\\triangle BCA \\cong \\triangle RPQ$，$AC = 9$，按位置配对：$B \\leftrightarrow R$，$C \\leftrightarrow P$，$A \\leftrightarrow Q$，所以 $\\overline{AC}$ 对应 $\\overline{QP}$，$QP = 9$。\n\n> **注意。** 要按全等式中的位置配对，不能按字母顺序，也不能凭图形的样子。在 $\\triangle BCA \\cong \\triangle RPQ$ 中，$A$ 排第三，所以它与另一边的第三个字母 $Q$ 配对；$\\overline{AC}$ 对应 $\\overline{QP}$，而不是 $\\overline{PR}$。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const order = rng.pick(perms.slice(1));
        const statement = `${triName(n1, order)} \\cong ${triName(n2, order)}`;
        const pairs = `$${order.map((i) => `${n1[i]} \\leftrightarrow ${n2[i]}`).join(",\\ ")}$`;
        const place = (v: number) => {
          const at = order.indexOf(v);
          return t(["first", "second", "third"][at]!, ["第一", "第二", "第三"][at]!);
        };
        const match = step(
          1,
          "match the vertices",
          "配对顶点",
          t(`The statement matches the vertices by position: ${pairs}.`, `全等式按位置配对顶点：${pairs}。`),
        );
        if (rng.bool()) {
          let sides: number[];
          for (;;) {
            sides = rng.sample([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 3);
            const [a, b, c] = sides as [number, number, number];
            if (a + b > c && b + c > a && a + c > b) break;
          }
          const k = rng.int(0, 2);
          const given = [0, 1, 2].map((i) => `${sideName(n1, i)} = ${sides[i]}`).join(", ");
          const ends = rng.bool() ? [nx(k), nx(k, 2)] : [nx(k, 2), nx(k)];
          const [e, f] = ends as [number, number];
          const asked = `${n2[e]}${n2[f]}`;
          return numberProblem({
            prompt: t(
              `$${statement}$. In $${triName(n1)}$, $${given}$. Find $${asked}$.`,
              `$${statement}$。在 $${triName(n1)}$ 中，$${given}$。求 $${asked}$。`,
            ),
            answer: sides[k]!,
            form: "integer",
            wrong: sides.filter((_, i) => i !== k),
            solution: paras(
              match,
              step(
                2,
                "find the partner",
                "找对应边",
                t(
                  `$\\overline{${asked}}$ joins $${n2[e]}$ and $${n2[f]}$, which match $${n1[e]}$ and $${n1[f]}$. So it corresponds to $\\overline{${n1[e]}${n1[f]}}$, and $${asked} = ${sides[k]}$.`,
                  `$\\overline{${asked}}$ 连接 $${n2[e]}$ 和 $${n2[f]}$，它们分别对应 $${n1[e]}$ 和 $${n1[f]}$。所以它对应 $\\overline{${n1[e]}${n1[f]}}$，$${asked} = ${sides[k]}$。`,
                ),
              ),
              check(
                t(
                  `Read the statement by places instead: $${n2[e]}$ and $${n2[f]}$ are the ${place(e).en} and ${place(f).en} letters of $${triName(n2, order)}$, and the ${place(e).en} and ${place(f).en} letters of $${triName(n1, order)}$ are $${n1[e]}$ and $${n1[f]}$: the side of length $${sides[k]}$.`,
                  `改按位置来读：$${n2[e]}$ 和 $${n2[f]}$ 是 $${triName(n2, order)}$ 的${place(e)["zh-CN"]}和${place(f)["zh-CN"]}个字母，而 $${triName(n1, order)}$ 的${place(e)["zh-CN"]}和${place(f)["zh-CN"]}个字母是 $${n1[e]}$ 和 $${n1[f]}$：正是长为 $${sides[k]}$ 的那条边。`,
                ),
              ),
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
          solution: paras(
            match,
            step(
              2,
              "find the partner",
              "找对应角",
              t(
                `$${ang(n2, k)}$ corresponds to $${ang(n1, k)}$, so $m${ang(n2, k)} = ${angles[k]}^\\circ$.`,
                `$${ang(n2, k)}$ 对应 $${ang(n1, k)}$，所以 $m${ang(n2, k)} = ${angles[k]}^\\circ$。`,
              ),
            ),
            check(
              t(
                `$${n2[k]}$ is the ${place(k).en} letter of $${triName(n2, order)}$, and the ${place(k).en} letter of $${triName(n1, order)}$ is $${n1[k]}$. The angles of $${triName(n2)}$ are then $${angles.join("^\\circ, ")}^\\circ$, which add up to $180^\\circ$ as they must.`,
                `$${n2[k]}$ 是 $${triName(n2, order)}$ 的${place(k)["zh-CN"]}个字母，而 $${triName(n1, order)}$ 的${place(k)["zh-CN"]}个字母是 $${n1[k]}$。于是 $${triName(n2)}$ 的三个角是 $${angles.join("^\\circ, ")}^\\circ$，和为 $180^\\circ$，符合要求。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "applying-asa",
      figure: congruenceDrawings["applying-asa"],
      title: t("The ASA criterion", "ASA 判定"),
      explanation: t(
        "Checking all six pairs of parts is not necessary. The **ASA (angle–side–angle) criterion**: if two angles and the **included side** (the side between them) of one triangle are congruent to two angles and the included side of another, the triangles are congruent.\n\nIn $\\triangle ABC$ the side between $\\angle A$ and $\\angle B$ is $\\overline{AB}$. So if $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$, the fact that completes ASA is $\\overline{AB} \\cong \\overline{DE}$. The sides must correspond too: $\\overline{AB} \\cong \\overline{EF}$ would not do.\n\nIn figures, congruent sides carry the same number of tick marks, and congruent angles are marked with arcs.\n\n> **Watch out.** The side has to join the vertices of the two angles. With $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$, the fact $\\overline{BC} \\cong \\overline{EF}$ gives a side that is not between them: that is AAS, not ASA.",
        "不必检查全部六组对应部分。**ASA（角边角）判定**：如果一个三角形的两个角及其**夹边**（两角之间的边）分别与另一个三角形的两个角及其夹边全等，那么这两个三角形全等。\n\n在 $\\triangle ABC$ 中，$\\angle A$ 与 $\\angle B$ 之间的边是 $\\overline{AB}$。所以若 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$，补上 $\\overline{AB} \\cong \\overline{DE}$ 就满足 ASA。边也必须对应：$\\overline{AB} \\cong \\overline{EF}$ 不行。\n\n图中，全等的边画相同数目的短线，全等的角用弧标出。\n\n> **注意。** 这条边必须连接两个角的顶点。已知 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$ 时，$\\overline{BC} \\cong \\overline{EF}$ 给出的边不在两角之间：那是 AAS，不是 ASA。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const askSide = rng.bool();
        const known = askSide ? [A(i), A(j)] : [A(i), S(k)];
        const right = askSide ? S(k) : A(j);
        const wrong = askSide ? [S(k, i), S(i, j), A(k)] : [A(j, k), S(i), A(k, j)];
        const fact = (p: Part) => factText(p, n1, n2, null);
        const options = [right, ...wrong].map(fact);
        const shuffled = rng.shuffle(options);
        const [en, zh] = pairAlt(n1, n2);
        const shape = byAngles(randomAngles(rng));
        const pose = pickPose(rng);
        const all = [...known, right];
        const fresh = right.side ? { sides: [k] } : { angles: [j] };
        const notPartner = (p: Part, side: boolean) =>
          side
            ? t(
                `These sides do not correspond: the partner of $${seg(n1, p.i)}$ is $${seg(n2, p.i)}$.`,
                `这两条边不对应：$${seg(n1, p.i)}$ 的对应边是 $${seg(n2, p.i)}$。`,
              )
            : t(
                `These angles do not correspond: the partner of $${ang(n1, p.i)}$ is $${ang(n2, p.i)}$.`,
                `这两个角不对应：$${ang(n1, p.i)}$ 的对应角是 $${ang(n2, p.i)}$。`,
              );
        const why: Text[] = askSide
          ? [
              notPartner(S(k), true),
              notPartner(S(i), true),
              t(
                "A third pair of angles adds no side: three angles (AAA) fix the shape of a triangle, not its size.",
                "第三组角并没有给出边：三个角（AAA）只确定三角形的形状，不确定大小。",
              ),
            ]
          : [
              notPartner(A(j), false),
              t(
                `A second side gives two sides and an angle, and $${ang(n1, i)}$ is not between $${seg(n1, k)}$ and $${seg(n1, i)}$, which meet at $${n1[j]}$: that is SSA, not ASA.`,
                `再加一条边就是两边一角，而 $${ang(n1, i)}$ 不是 $${seg(n1, k)}$ 与 $${seg(n1, i)}$ 的夹角（两边交于 $${n1[j]}$）：这是 SSA，不是 ASA。`,
              ),
              notPartner(A(k), false),
            ];
        return {
          ...reasoned(
            choiceProblem({
              prompt: cat(
                t("Given ", "已知 "),
                andList(known.map(fact)),
                t(
                  `, which other fact proves $${triName(n1)} \\cong ${triName(n2)}$ by ASA?`,
                  `，再加上哪个条件就能由 ASA 证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
                ),
              ),
              options: shuffled,
              correct: shuffled.indexOf(options[0]!),
              solution: askSide
                ? paras(
                    step(
                      1,
                      "list what ASA needs",
                      "列出 ASA 需要什么",
                      t(
                        `ASA needs two angles and the side between them. The angles are given: $${ang(n1, i)} \\cong ${ang(n2, i)}$ and $${ang(n1, j)} \\cong ${ang(n2, j)}$.`,
                        `ASA 需要两角及其夹边。两角已经给出：$${ang(n1, i)} \\cong ${ang(n2, i)}$，$${ang(n1, j)} \\cong ${ang(n2, j)}$。`,
                      ),
                    ),
                    step(
                      2,
                      "find the side between them",
                      "找出夹边",
                      t(
                        `In $${triName(n1)}$ the side between $${ang(n1, i)}$ and $${ang(n1, j)}$ joins $${n1[i]}$ and $${n1[j]}$: it is $${seg(n1, k)}$, and its partner is $${seg(n2, k)}$. So the missing fact is $${seg(n1, k)} \\cong ${seg(n2, k)}$.\n\n{{figure 0}}`,
                        `在 $${triName(n1)}$ 中，$${ang(n1, i)}$ 与 $${ang(n1, j)}$ 之间的边连接 $${n1[i]}$ 和 $${n1[j]}$，即 $${seg(n1, k)}$，它的对应边是 $${seg(n2, k)}$。所以缺的条件是 $${seg(n1, k)} \\cong ${seg(n2, k)}$。\n\n{{figure 0}}`,
                      ),
                    ),
                    partsCheck(all, null, n1, n2, (p) => (p === right ? t("the missing fact", "所缺的条件") : given(p))),
                  )
                : paras(
                    step(
                      1,
                      "look at the given side",
                      "看已知的边",
                      t(
                        `ASA needs the angles at both ends of the congruent side. $${seg(n1, k)}$ joins $${n1[i]}$ and $${n1[j]}$, and the angle at $${n1[i]}$ is given: $${ang(n1, i)} \\cong ${ang(n2, i)}$.`,
                        `ASA 需要全等边两端的角。$${seg(n1, k)}$ 连接 $${n1[i]}$ 和 $${n1[j]}$，$${n1[i]}$ 处的角已经给出：$${ang(n1, i)} \\cong ${ang(n2, i)}$。`,
                      ),
                    ),
                    step(
                      2,
                      "add the other end",
                      "补上另一端",
                      t(
                        `The missing angle is at the other end, $${n1[j]}$, with its partner at $${n2[j]}$: $${ang(n1, j)} \\cong ${ang(n2, j)}$.\n\n{{figure 0}}`,
                        `缺的是另一端 $${n1[j]}$ 处的角，它的对应角在 $${n2[j]}$：$${ang(n1, j)} \\cong ${ang(n2, j)}$。\n\n{{figure 0}}`,
                      ),
                    ),
                    partsCheck(all, null, n1, n2, (p) => (p === right ? t("the missing fact", "所缺的条件") : given(p))),
                  ),
            }),
            wrong.map((p, w) => [fact(p).en, why[w]!.en, why[w]!["zh-CN"]] as const),
          ),
          figure: pairFigure(shape, pose, n1, partsLook(known, null, 0), n2, partsLook(known, null, 1), en, zh),
          solutionFigures: [
            pairFigure(
              shape,
              pose,
              n1,
              { ...partsLook(all, null, 0), fresh },
              n2,
              { ...partsLook(all, null, 1), fresh },
              ...pairAlt(n1, n2, t("The missing fact is highlighted.", "缺的条件用另一种颜色标出。")),
            ),
          ],
        };
      },
    },
    {
      id: "solving-with-asa",
      figure: congruenceDrawings["solving-with-asa"],
      title: t("Unknowns in ASA", "ASA 中的未知量"),
      explanation: t(
        "When two triangles are congruent by ASA, each marked measure of one triangle equals the corresponding measure of the other. That gives an equation for an unknown.\n\nIf $\\angle A \\cong \\angle D$, $\\angle B \\cong \\angle E$ and $\\overline{AB} \\cong \\overline{DE}$ with $AB = 14$ and $DE = 3x + 2$, then $3x + 2 = 14$, so $3x = 12$ and $x = 4$.\n\n> **Watch out.** Set the expression equal to its own partner, found from the matching of the vertices, not to whatever measure sits nearby: the second triangle may be turned or flipped. Here $DE$ pairs with $AB$, so $3x + 2$ equals $14$, not another length of $\\triangle ABC$.",
        "两个三角形由 ASA 全等时，一个三角形中标出的量等于另一个三角形中的对应量。由此可以列方程求未知数。\n\n若 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$，$\\overline{AB} \\cong \\overline{DE}$，且 $AB = 14$，$DE = 3x + 2$，则 $3x + 2 = 14$，所以 $3x = 12$，$x = 4$。\n\n> **注意。** 式子要等于它自己的对应量，对应关系由顶点的配对决定，而不是图中挨着的哪个量：第二个三角形可能经过旋转或翻转。这里 $DE$ 对应 $AB$，所以 $3x + 2$ 等于 $14$，而不是 $\\triangle ABC$ 的其他长度。",
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
        const unit = unknownAngle ? "^\\circ" : "";
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
            solution: paras(
              step(
                1,
                "pair the parts",
                "配对部分",
                t(
                  `Corresponding parts of congruent triangles are equal. The expression is on $${unknownAngle ? ang(n2, i) : seg(n2, k)}$, whose partner is $${unknownAngle ? ang(n1, i) : seg(n1, k)}$, so $${part} = ${matching} = ${target}${unit}$.`,
                  `全等三角形的对应部分相等。式子标在 $${unknownAngle ? ang(n2, i) : seg(n2, k)}$ 上，它的对应部分是 $${unknownAngle ? ang(n1, i) : seg(n1, k)}$，所以 $${part} = ${matching} = ${target}${unit}$。`,
                ),
              ),
              step(2, "solve", "解方程", t(`Set the expression equal to $${target}$:`, `令式子等于 $${target}$：`), solveSteps(u)),
              check(
                t(
                  `With $x = ${u.x}$, $${substituted(u)}$, the same as $${matching}$. The congruence itself rests on ASA: the angles at $${n1[i]}$ and $${n1[j]}$ and the side $${seg(n1, k)}$ that joins them are marked in both triangles.`,
                  `当 $x = ${u.x}$ 时，$${substituted(u)}$，与 $${matching}$ 相同。全等本身依据 ASA：两个三角形中都标出了 $${n1[i]}$、$${n1[j]}$ 处的角和连接它们的边 $${seg(n1, k)}$。`,
                ),
              ),
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
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  intro: t(
    "ASA needs the side between the two congruent angles. Often the side that is known lies elsewhere, across from one of them. The angle sum of a triangle closes the gap: once two angles match, the third angles match too, and then the known side does lie between two matching angles. That is the **AAS** criterion.\n\nTake $\\triangle ABC$ and $\\triangle DEF$ with $m\\angle A = m\\angle D = 45^\\circ$, $m\\angle B = m\\angle E = 70^\\circ$ and $BC = EF = 6$.\n\n{{figure 0}}\n\n$\\overline{BC}$ is opposite $\\angle A$, not between $\\angle A$ and $\\angle B$, so ASA does not apply directly. But $m\\angle C = 180^\\circ - 45^\\circ - 70^\\circ = 65^\\circ$ and $m\\angle F = 180^\\circ - 45^\\circ - 70^\\circ = 65^\\circ$. Now $\\overline{BC}$ lies between $\\angle B$ and $\\angle C$, and $\\overline{EF}$ between their partners $\\angle E$ and $\\angle F$, so ASA gives $\\triangle ABC \\cong \\triangle DEF$.",
    "ASA 需要两组全等角之间的夹边。可已知的边常常在别处，是其中一个角的对边。三角形的内角和弥补了这一点：两组角相等后，第三组角也相等，这时已知的边就位于两组相等的角之间了。这就是 **AAS** 判定。\n\n取 $\\triangle ABC$ 与 $\\triangle DEF$，$m\\angle A = m\\angle D = 45^\\circ$，$m\\angle B = m\\angle E = 70^\\circ$，$BC = EF = 6$。\n\n{{figure 0}}\n\n$\\overline{BC}$ 是 $\\angle A$ 的对边，不在 $\\angle A$ 与 $\\angle B$ 之间，所以不能直接用 ASA。但 $m\\angle C = 180^\\circ - 45^\\circ - 70^\\circ = 65^\\circ$，$m\\angle F = 180^\\circ - 45^\\circ - 70^\\circ = 65^\\circ$。这时 $\\overline{BC}$ 位于 $\\angle B$ 与 $\\angle C$ 之间，$\\overline{EF}$ 位于它们的对应角 $\\angle E$ 与 $\\angle F$ 之间，所以由 ASA 得 $\\triangle ABC \\cong \\triangle DEF$。",
  ),
  introFigures: [
    pairFigure(
      byAngles([45, 70, 65]),
      { turn: 180, mirror: false },
      ["A", "B", "C"],
      { sides: [{ ticks: 1, label: "6" }, null, null], angles: ["45°", "70°", null] },
      ["D", "E", "F"],
      { sides: [{ ticks: 1, label: "6" }, null, null], angles: ["45°", "70°", null] },
      "Triangles ABC and DEF with angles of 45° and 70° at A, B and at D, E, and BC = EF = 6.",
      "三角形 ABC 与 DEF：A、B 处和 D、E 处的角分别为 45° 和 70°，BC = EF = 6。",
    ),
  ],
  knowledgePoints: [
    {
      id: "third-angles",
      figure: congruenceDrawings["third-angles"],
      title: t("Why AAS works", "AAS 为什么成立"),
      explanation: t(
        "If two angles of one triangle are congruent to two angles of another, the third angles are congruent too, because each triangle's angles add up to $180^\\circ$.\n\nThat is why the **AAS (angle–angle–side) criterion** holds: two angles and a **non-included side** (a side not between them) of one triangle congruent to the corresponding parts of another make the triangles congruent. Once the third angles are known to match, the side lies between two matching angles, and ASA applies.\n\nIf $m\\angle A = m\\angle D = 50^\\circ$ and $m\\angle B = m\\angle E = 75^\\circ$, then $m\\angle C = m\\angle F = 180^\\circ - 50^\\circ - 75^\\circ = 55^\\circ$.\n\n> **Watch out.** Subtract both known angles from $180^\\circ$. Stopping at $180^\\circ - 50^\\circ = 130^\\circ$ gives the sum of the other two angles, not $m\\angle C$.",
        "如果一个三角形的两个角与另一个三角形的两个角分别全等，那么第三个角也全等，因为每个三角形的内角和都是 $180^\\circ$。\n\n这就是 **AAS（角角边）判定**成立的原因：一个三角形的两个角及一条**非夹边**（不在两角之间的边）与另一个三角形的对应部分全等，则两个三角形全等。第三个角对应相等后，这条边就位于两组相等的角之间，可以用 ASA。\n\n若 $m\\angle A = m\\angle D = 50^\\circ$，$m\\angle B = m\\angle E = 75^\\circ$，则 $m\\angle C = m\\angle F = 180^\\circ - 50^\\circ - 75^\\circ = 55^\\circ$。\n\n> **注意。** 要从 $180^\\circ$ 中减去两个已知角。只算到 $180^\\circ - 50^\\circ = 130^\\circ$ 得到的是另外两个角的和，不是 $m\\angle C$。",
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
        const shape = byAngles(angles);
        const pose = pickPose(rng);
        const solved: Look = { ...look1, angles: angles.map(deg), fresh: { angles: [k] } };
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
            solution: paras(
              step(
                1,
                "find the partner",
                "找对应角",
                t(
                  `$${ang(n2, k)}$ corresponds to $${ang(n1, k)}$, the third angle of $${triName(n1)}$, so the two have the same measure.`,
                  `$${ang(n2, k)}$ 对应 $${ang(n1, k)}$，即 $${triName(n1)}$ 的第三个角，两者度数相同。`,
                ),
              ),
              step(
                2,
                "use the angle sum",
                "用内角和",
                t("Subtract the two marked angles from $180^\\circ$:", "从 $180^\\circ$ 中减去两个标出的角："),
                steps(`m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ`),
                t(
                  `So $m${ang(n2, k)} = ${angles[k]}^\\circ$.\n\n{{figure 0}}`,
                  `所以 $m${ang(n2, k)} = ${angles[k]}^\\circ$。\n\n{{figure 0}}`,
                ),
              ),
              check(
                t(
                  `The angles of $${triName(n2)}$ are the partners of $${angles[i]}^\\circ$, $${angles[j]}^\\circ$ and $${angles[k]}^\\circ$, and $${angles[i]}^\\circ + ${angles[j]}^\\circ + ${angles[k]}^\\circ = 180^\\circ$, as the angles of a triangle must.`,
                  `$${triName(n2)}$ 的三个角分别对应 $${angles[i]}^\\circ$、$${angles[j]}^\\circ$ 和 $${angles[k]}^\\circ$，而 $${angles[i]}^\\circ + ${angles[j]}^\\circ + ${angles[k]}^\\circ = 180^\\circ$，符合三角形内角和。`,
                ),
              ),
            ),
          }),
          figure: pairFigure(shape, pose, n1, look1, n2, partsLook(parts, null, 1), en, zh),
          solutionFigures: [
            pairFigure(
              shape,
              pose,
              n1,
              solved,
              n2,
              { ...partsLook(parts, null, 1), angles: angles.map(deg), fresh: { angles: [k] } },
              ...pairAlt(
                n1,
                n2,
                t("All three angles are labeled; the third is highlighted.", "三个角都标出了度数，第三个角用另一种颜色标出。"),
              ),
            ),
          ],
        };
      },
    },
    {
      id: "asa-or-aas",
      figure: congruenceDrawings["asa-or-aas"],
      title: t("ASA or AAS", "ASA 还是 AAS"),
      explanation: t(
        "With two pairs of congruent angles and one pair of congruent sides, look at where the side is:\n\n- between the two angles: **ASA**;\n- not between them: **AAS**;\n- not a pair of corresponding sides at all: neither criterion applies.\n\nGiven $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$: with $\\overline{AB} \\cong \\overline{DE}$ it is ASA; with $\\overline{BC} \\cong \\overline{EF}$ it is AAS; with $\\overline{BC} \\cong \\overline{DF}$ the sides do not correspond, and the triangles are not shown to be congruent.\n\n> **Watch out.** A side across from an angle can still be the included side. With $\\angle A \\cong \\angle D$ and $\\angle B \\cong \\angle E$, $\\overline{AB}$ is across from the unmarked $\\angle C$, yet it joins $A$ and $B$: that is ASA. Ask which vertices the side joins, not what it faces.",
        "有两组全等的角和一组全等的边时，看这条边的位置：\n\n- 在两角之间：**ASA**；\n- 不在两角之间：**AAS**；\n- 根本不是一组对应边：两种判定都不适用。\n\n已知 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$：若 $\\overline{AB} \\cong \\overline{DE}$，用 ASA；若 $\\overline{BC} \\cong \\overline{EF}$，用 AAS；若 $\\overline{BC} \\cong \\overline{DF}$，两边不对应，不能证明两个三角形全等。\n\n> **注意。** 某个角的对边也可能是夹边。已知 $\\angle A \\cong \\angle D$，$\\angle B \\cong \\angle E$ 时，$\\overline{AB}$ 是未标出的 $\\angle C$ 的对边，但它连接 $A$ 和 $B$：这是 ASA。要看这条边连接哪两个顶点，而不是它对着哪个角。",
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
        const prompt = cat(
          t("In the figure, ", "图中，"),
          andList(rng.shuffle(sc.parts).map((p) => factText(p, n1, n2, null))),
          t(
            `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
            `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
          ),
        );
        return {
          ...criterionChoice(prompt, options, sc.parts, null, n1, n2),
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
      figure: congruenceDrawings["solving-with-aas"],
      title: t("Unknowns in AAS", "AAS 中的未知量"),
      explanation: t(
        "When the angle marked with an unknown is not one of the angles shown in the other triangle, find its partner first with the angle sum.\n\nSuppose $\\triangle ABC \\cong \\triangle DEF$ by AAS, with $m\\angle A = 40^\\circ$ and $m\\angle B = 65^\\circ$, and $m\\angle F = (2x + 15)^\\circ$. The partner of $\\angle F$ is $\\angle C$, and $m\\angle C = 180^\\circ - 40^\\circ - 65^\\circ = 75^\\circ$. So $2x + 15 = 75$, $2x = 60$ and $x = 30$.\n\n> **Watch out.** The expression pairs with the third angle, whose measure is not marked. Setting $2x + 15$ equal to a marked angle such as $65^\\circ$ uses the wrong partner; find $m\\angle C$ from the angle sum first.",
        "若带未知数的角在另一个三角形中没有标出，先用内角和求出它的对应角。\n\n设 $\\triangle ABC \\cong \\triangle DEF$（AAS），$m\\angle A = 40^\\circ$，$m\\angle B = 65^\\circ$，$m\\angle F = (2x + 15)^\\circ$。$\\angle F$ 的对应角是 $\\angle C$，$m\\angle C = 180^\\circ - 40^\\circ - 65^\\circ = 75^\\circ$。所以 $2x + 15 = 75$，$2x = 60$，$x = 30$。\n\n> **注意。** 式子对应的是没有标出度数的第三个角。让 $2x + 15$ 等于标出的角（比如 $65^\\circ$）就找错了对应角；要先用内角和求出 $m\\angle C$。",
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
        const shape = byAngles(angles);
        const pose = pickPose(rng);
        const found = angles1.map((a, v) => (v === k ? deg(angles[k]!) : a));
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
            solution: paras(
              step(
                1,
                "find the partner",
                "找对应角",
                t(
                  `The expression is on $${ang(n2, k)}$, whose partner is $${ang(n1, k)}$. Its measure is not marked, so find it from the angle sum of $${triName(n1)}$:`,
                  `式子标在 $${ang(n2, k)}$ 上，它的对应角是 $${ang(n1, k)}$。这个角的度数没有标出，所以用 $${triName(n1)}$ 的内角和求出：`,
                ),
                steps(`m${ang(n1, k)} = 180^\\circ - ${angles[i]}^\\circ - ${angles[j]}^\\circ = ${angles[k]}^\\circ`),
                "{{figure 0}}",
              ),
              step(2, "solve", "解方程", t(`Set the expression equal to $${angles[k]}$:`, `令式子等于 $${angles[k]}$：`), solveSteps(u)),
              check(
                t(
                  `With $x = ${u.x}$, $${substituted(u)}$. Then $${triName(n2)}$ has the angles $${angles[i]}^\\circ$ and $${angles[k]}^\\circ$ and the partner of $${ang(n1, j)}$, and $${angles[i]}^\\circ + ${angles[j]}^\\circ + ${angles[k]}^\\circ = 180^\\circ$.`,
                  `当 $x = ${u.x}$ 时，$${substituted(u)}$。于是 $${triName(n2)}$ 的角是 $${angles[i]}^\\circ$、$${angles[k]}^\\circ$ 以及 $${ang(n1, j)}$ 的对应角，而 $${angles[i]}^\\circ + ${angles[j]}^\\circ + ${angles[k]}^\\circ = 180^\\circ$。`,
                ),
              ),
            ),
          }),
          figure: pairFigure(shape, pose, n1, { sides, angles: angles1 }, n2, { sides, angles: angles2 }, en, zh),
          solutionFigures: [
            pairFigure(
              shape,
              pose,
              n1,
              { sides, angles: found, fresh: { angles: [k] } },
              n2,
              { sides, angles: angles2, fresh: { angles: [k] } },
              ...pairAlt(n1, n2, t("The third angle and its partner are highlighted.", "第三个角及其对应角用另一种颜色标出。")),
            ),
          ],
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
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  intro: t(
    "ASA and AAS start from two angles. Often two sides are known instead. Two sides alone leave the triangle free to open and close like a hinge at the vertex they share; fixing the angle at that hinge fixes the whole triangle. That is the **SAS** criterion: two sides and the angle between them.\n\nTake $\\triangle ABC$ with $AB = 4$, $BC = 6$, $m\\angle B = 50^\\circ$, and $\\triangle DEF$ with $DE = 4$, $EF = 6$, $m\\angle E = 50^\\circ$.\n\n{{figure 0}}\n\n$\\overline{AB}$ and $\\overline{BC}$ both end at $B$, so $\\angle B$ is the angle between them, and in the same way $\\angle E$ lies between $\\overline{DE}$ and $\\overline{EF}$. So SAS gives $\\triangle ABC \\cong \\triangle DEF$. Had the $50^\\circ$ been at $A$ and $D$ instead, the angle would not lie between the two sides, and the triangles would not be proved congruent.",
    "ASA 和 AAS 都从两个角出发。可常常知道的是两条边。只有两条边时，三角形可以在两边的公共顶点处像铰链一样张合；把这个“铰链”处的角固定，整个三角形就固定了。这就是 **SAS** 判定：两边及其夹角。\n\n取 $\\triangle ABC$，$AB = 4$，$BC = 6$，$m\\angle B = 50^\\circ$；$\\triangle DEF$，$DE = 4$，$EF = 6$，$m\\angle E = 50^\\circ$。\n\n{{figure 0}}\n\n$\\overline{AB}$ 与 $\\overline{BC}$ 都以 $B$ 为端点，所以 $\\angle B$ 是它们的夹角；同样，$\\angle E$ 是 $\\overline{DE}$ 与 $\\overline{EF}$ 的夹角。所以由 SAS 得 $\\triangle ABC \\cong \\triangle DEF$。如果 $50^\\circ$ 的角在 $A$ 和 $D$ 处，它就不是两边的夹角，也就不能证明两个三角形全等。",
  ),
  introFigures: [
    pairFigure(
      byAngles([87, 50, 43]),
      { turn: 0, mirror: true },
      ["A", "B", "C"],
      { sides: [{ ticks: 2, label: "6" }, null, { ticks: 1, label: "4" }], angles: [null, "50°", null] },
      ["D", "E", "F"],
      { sides: [{ ticks: 2, label: "6" }, null, { ticks: 1, label: "4" }], angles: [null, "50°", null] },
      "Triangles ABC and DEF with AB = DE = 4, BC = EF = 6, and angles of 50° at B and E.",
      "三角形 ABC 与 DEF：AB = DE = 4，BC = EF = 6，B 处和 E 处的角都是 50°。",
    ),
  ],
  knowledgePoints: [
    {
      id: "included-angles",
      figure: congruenceDrawings["included-angles"],
      title: t("Included angles", "夹角"),
      explanation: t(
        "The **included angle** of two sides of a triangle is the angle between them, at the vertex they share.\n\nIn $\\triangle PQR$, the sides $\\overline{PQ}$ and $\\overline{QR}$ share the vertex $Q$, so their included angle is $\\angle Q$. Conversely, $\\angle P$ is included between the two sides that end at $P$: $\\overline{PQ}$ and $\\overline{PR}$.\n\n> **Watch out.** The included angle is at the shared endpoint, not across from a side. For $\\overline{PQ}$ and $\\overline{QR}$, the angle $\\angle R$ sits at an end of $\\overline{QR}$ and faces $\\overline{PQ}$, but it is not between the two sides; only $\\angle Q$ is.",
        "三角形两边的**夹角**是这两边之间的角，顶点是两边的公共端点。\n\n在 $\\triangle PQR$ 中，$\\overline{PQ}$ 与 $\\overline{QR}$ 的公共端点是 $Q$，所以它们的夹角是 $\\angle Q$。反过来，$\\angle P$ 是以 $P$ 为端点的两边 $\\overline{PQ}$ 与 $\\overline{PR}$ 的夹角。\n\n> **注意。** 夹角在两边的公共端点处，而不是某条边对面的角。对 $\\overline{PQ}$ 与 $\\overline{QR}$ 来说，$\\angle R$ 在 $\\overline{QR}$ 的一端，又对着 $\\overline{PQ}$，但它不在两边之间；只有 $\\angle Q$ 才是夹角。",
      ),
      generate(rng) {
        const n = pickLetters(rng, 3) as unknown as Names;
        const k = rng.int(0, 2);
        const pts = posed(byAngles(randomAngles(rng)), pickPose(rng));
        const fig = figure(triMarks(pts, n, {}), `Triangle ${n.join("")}.`, `三角形 ${n.join("")}。`);
        const sides = [nx(k), nx(k, 2)];
        const solved = figure(
          triMarks(pts, n, { angles: [0, 1, 2].map((v) => v === k), fresh: { sides, angles: [k] } }),
          `Triangle ${n.join("")} with sides ${sideName(n, nx(k))} and ${sideName(n, nx(k, 2))} and the angle at ${n[k]} highlighted.`,
          `三角形 ${n.join("")}，边 ${sideName(n, nx(k))}、${sideName(n, nx(k, 2))} 和 ${n[k]} 处的角用另一种颜色标出。`,
        );
        if (rng.bool()) {
          const [p, q] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `Which angle of $${triName(n)}$ is included between $${seg(n, p)}$ and $${seg(n, q)}$?`,
                  `$${triName(n)}$ 中，$${seg(n, p)}$ 与 $${seg(n, q)}$ 的夹角是哪个角？`,
                ),
                options: [0, 1, 2].map((v) => m(ang(n, v))),
                correct: k,
                solution: paras(
                  step(
                    1,
                    "find the shared endpoint",
                    "找公共端点",
                    t(
                      `$${seg(n, p)}$ and $${seg(n, q)}$ both end at $${n[k]}$.\n\n{{figure 0}}`,
                      `$${seg(n, p)}$ 与 $${seg(n, q)}$ 都以 $${n[k]}$ 为端点。\n\n{{figure 0}}`,
                    ),
                  ),
                  step(
                    2,
                    "name the angle there",
                    "写出那里的角",
                    t(
                      `The angle between them is the angle at $${n[k]}$: $${ang(n, k)}$.`,
                      `它们的夹角就是 $${n[k]}$ 处的角：$${ang(n, k)}$。`,
                    ),
                  ),
                  check(
                    t(
                      `The two sides of $${ang(n, k)}$ are the sides that end at $${n[k]}$, $${seg(n, nx(k))}$ and $${seg(n, nx(k, 2))}$: the two given sides.`,
                      `$${ang(n, k)}$ 的两条边是以 $${n[k]}$ 为端点的 $${seg(n, nx(k))}$ 与 $${seg(n, nx(k, 2))}$，正是给出的两条边。`,
                    ),
                  ),
                ),
              }),
              [0, 1, 2]
                .filter((v) => v !== k)
                .map((v) => {
                  const o = m(ang(n, v)).en;
                  const shared = v === nx(k) ? nx(k, 2) : nx(k);
                  return [
                    o,
                    `$${ang(n, v)}$ lies between $${seg(n, nx(v))}$ and $${seg(n, nx(v, 2))}$, and only one of them, $${seg(n, shared)}$, is a given side.`,
                    `$${ang(n, v)}$ 是 $${seg(n, nx(v))}$ 与 $${seg(n, nx(v, 2))}$ 的夹角，其中只有 $${seg(n, shared)}$ 是给出的边。`,
                  ] as const;
                }),
            ),
            figure: fig,
            solutionFigures: [solved],
          };
        }
        const pairs = [0, 1, 2].map((v) => [nx(v), nx(v, 2)] as const);
        const pairText = (v: number) => t(`$${seg(n, nx(v))}$ and $${seg(n, nx(v, 2))}$`, `$${seg(n, nx(v))}$ 与 $${seg(n, nx(v, 2))}$`);
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `In $${triName(n)}$, $${ang(n, k)}$ is the included angle of which two sides?`,
                `在 $${triName(n)}$ 中，$${ang(n, k)}$ 是哪两条边的夹角？`,
              ),
              options: pairs.map(([p, q]) => t(`$${seg(n, p)}$ and $${seg(n, q)}$`, `$${seg(n, p)}$ 与 $${seg(n, q)}$`)),
              correct: k,
              solution: paras(
                step(
                  1,
                  "find the vertex",
                  "找顶点",
                  t(`The vertex of $${ang(n, k)}$ is $${n[k]}$.`, `$${ang(n, k)}$ 的顶点是 $${n[k]}$。`),
                ),
                step(
                  2,
                  "take the sides that end there",
                  "取以它为端点的边",
                  t(
                    `Two sides of the triangle end at $${n[k]}$: $${seg(n, nx(k))}$ and $${seg(n, nx(k, 2))}$.\n\n{{figure 0}}`,
                    `三角形中以 $${n[k]}$ 为端点的边有两条：$${seg(n, nx(k))}$ 与 $${seg(n, nx(k, 2))}$。\n\n{{figure 0}}`,
                  ),
                ),
                check(
                  t(
                    `The third side, $${seg(n, k)}$, does not touch $${n[k]}$: it is the side across from $${ang(n, k)}$, so it cannot be one of the sides that form it.`,
                    `第三条边 $${seg(n, k)}$ 不经过 $${n[k]}$：它是 $${ang(n, k)}$ 的对边，不可能是构成这个角的边。`,
                  ),
                ),
              ),
            }),
            [0, 1, 2]
              .filter((v) => v !== k)
              .map((v) => [
                pairText(v).en,
                `These sides meet at $${n[v]}$, so the angle between them is $${ang(n, v)}$.`,
                `这两条边交于 $${n[v]}$，它们的夹角是 $${ang(n, v)}$。`,
              ]),
          ),
          figure: fig,
          solutionFigures: [solved],
        };
      },
    },
    {
      id: "applying-sas",
      figure: congruenceDrawings["applying-sas"],
      title: t("The SAS criterion", "SAS 判定"),
      explanation: t(
        "The **SAS (side–angle–side) criterion**: if two sides and the included angle of one triangle are congruent to two sides and the included angle of another, the triangles are congruent.\n\nThe angle must be the one between the sides. Two sides and an angle that is not between them (**SSA**) do not prove congruence: the third side can swing into two different positions. With $\\overline{AB} \\cong \\overline{DE}$ and $\\overline{BC} \\cong \\overline{EF}$, the angle for SAS is $\\angle B \\cong \\angle E$; $\\angle A \\cong \\angle D$ would be SSA.\n\n> **Watch out.** Two sides and an angle are not enough on their own; the angle has to sit at the endpoint the two sides share, in both triangles. Find that vertex first, then look for the angle there.",
        "**SAS（边角边）判定**：如果一个三角形的两边及其夹角分别与另一个三角形的两边及其夹角全等，那么这两个三角形全等。\n\n这个角必须是两边的夹角。两边及其中一边的对角（**SSA**，边边角）不能证明全等：第三边可以摆到两个不同的位置。已知 $\\overline{AB} \\cong \\overline{DE}$，$\\overline{BC} \\cong \\overline{EF}$，SAS 需要的角是 $\\angle B \\cong \\angle E$；$\\angle A \\cong \\angle D$ 则是 SSA。\n\n> **注意。** 光有两边一角还不够；这个角必须在两边的公共端点处，并且两个三角形都是如此。先找出这个顶点，再看那里的角。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const k = rng.int(0, 2);
        const [i, j] = rng.shuffle([nx(k), nx(k, 2)]) as [number, number];
        const kind = rng.pick([0, 0, 1, 2]);
        const parts = kind === 0 ? [S(i), A(k), S(j)] : kind === 1 ? [S(i), A(i), S(j)] : [S(i), A(k, i), S(j)];
        const yes = kind === 0;
        const [en, zh] = pairAlt(n1, n2);
        const included = t(
          "Yes, because the marked angle is between the two marked sides in both triangles.",
          "能，因为在两个三角形中，标出的角都是两条标出的边的夹角。",
        );
        const neither = t(
          "No, because the marked angle is not between the two marked sides, so this is SSA.",
          "不能，因为标出的角不是两条标出的边的夹角，这是 SSA。",
        );
        const oneOnly = t(
          "No, because the marked angle is between the two marked sides in only one triangle.",
          "不能，因为标出的角只在一个三角形中是两条标出的边的夹角。",
        );
        const anyAngle = t(
          "Yes, because two sides and an angle match, whichever angle it is.",
          "能，因为两条边和一个角相等，不管是哪个角。",
        );
        const between = step(
          1,
          "find the angle between the sides",
          "找两边的夹角",
          t(
            `In $${triName(n1)}$, $${seg(n1, i)}$ and $${seg(n1, j)}$ both end at $${n1[k]}$, so the angle between them is $${ang(n1, k)}$; in $${triName(n2)}$ it is $${ang(n2, k)}$.\n\n{{figure 0}}`,
            `在 $${triName(n1)}$ 中，$${seg(n1, i)}$ 与 $${seg(n1, j)}$ 都以 $${n1[k]}$ 为端点，所以它们的夹角是 $${ang(n1, k)}$；在 $${triName(n2)}$ 中是 $${ang(n2, k)}$。\n\n{{figure 0}}`,
          ),
        );
        const compare = step(
          2,
          "compare it with the marked angles",
          "与标出的角比较",
          yes
            ? t(
                `The marked angles are exactly $${ang(n1, k)}$ and $${ang(n2, k)}$, so SAS applies: yes.`,
                `标出的角正是 $${ang(n1, k)}$ 和 $${ang(n2, k)}$，所以可以用 SAS：能。`,
              )
            : kind === 1
              ? t(
                  `The marked angles are $${ang(n1, i)}$ and $${ang(n2, i)}$, not the angles between the sides. This is SSA, which does not prove congruence: no.`,
                  `标出的角是 $${ang(n1, i)}$ 和 $${ang(n2, i)}$，不是两边的夹角。这是 SSA，不能证明全等：不能。`,
                )
              : t(
                  `$${ang(n1, k)}$ is marked in $${triName(n1)}$, but in $${triName(n2)}$ the marked angle is $${ang(n2, i)}$, not $${ang(n2, k)}$. The angle is between the sides in only one triangle: no.`,
                  `$${triName(n1)}$ 中标出的是 $${ang(n1, k)}$，但 $${triName(n2)}$ 中标出的是 $${ang(n2, i)}$，不是 $${ang(n2, k)}$。只有一个三角形中标出的是夹角：不能。`,
                ),
        );
        const problem = reasonChoice(rng, {
          prompt: cat(
            t("In the figure, ", "图中，"),
            andList(parts.map((p) => factText(p, n1, n2, null))),
            t(
              `. Do these facts prove $${triName(n1)} \\cong ${triName(n2)}$ by SAS?`,
              `。这些条件能由 SAS 证明 $${triName(n1)} \\cong ${triName(n2)}$ 吗？`,
            ),
          ),
          correct: [included, neither, oneOnly][kind]!,
          wrong: [included, neither, oneOnly, anyAngle],
          solution: paras(
            between,
            compare,
            yes
              ? partsCheck(parts, null, n1, n2)
              : check(
                  t(
                    `SAS needs $${seg(n1, i)} \\cong ${seg(n2, i)}$ and $${seg(n1, j)} \\cong ${seg(n2, j)}$ (both given) and $${ang(n1, k)} \\cong ${ang(n2, k)}$, the angles between them. That last pair is not among the facts, so SAS cannot be used.`,
                    `SAS 需要 $${seg(n1, i)} \\cong ${seg(n2, i)}$、$${seg(n1, j)} \\cong ${seg(n2, j)}$（都已知），以及它们的夹角 $${ang(n1, k)} \\cong ${ang(n2, k)}$。最后这一组不在条件中，所以不能用 SAS。`,
                  ),
                ),
          ),
        });
        const shape = byAngles(randomAngles(rng));
        const pose = pickPose(rng);
        const withIncluded = (which: 0 | 1): Look => {
          const look = partsLook(parts, null, which);
          const angles = (look.angles ?? [null, null, null]).map((a, v) => (v === k ? true : a));
          return { ...look, angles, fresh: { angles: [k] } };
        };
        return {
          ...problem,
          figure: pairFigure(shape, pose, n1, partsLook(parts, null, 0), n2, partsLook(parts, null, 1), en, zh),
          solutionFigures: [
            pairFigure(
              shape,
              pose,
              n1,
              withIncluded(0),
              n2,
              withIncluded(1),
              ...pairAlt(
                n1,
                n2,
                t(`The angles at ${n1[k]} and ${n2[k]} are highlighted.`, `${n1[k]} 处和 ${n2[k]} 处的角用另一种颜色标出。`),
              ),
            ),
          ],
        };
      },
    },
    {
      id: "solving-with-sas",
      figure: congruenceDrawings["solving-with-sas"],
      title: t("Unknowns in SAS", "SAS 中的未知量"),
      explanation: t(
        "Once two triangles are congruent by SAS, every pair of corresponding parts is equal, including the parts that were not marked.\n\nIf $\\overline{AB} \\cong \\overline{DE}$, $\\angle B \\cong \\angle E$ and $\\overline{BC} \\cong \\overline{EF}$, then $\\triangle ABC \\cong \\triangle DEF$, so the third sides match as well: with $AC = 17$ and $DF = 4x - 3$, $4x - 3 = 17$, $4x = 20$ and $x = 5$.\n\n> **Watch out.** Each expression still pairs with its own partner. Here $DF$ joins $D$ and $F$, which match $A$ and $C$, so $4x - 3$ equals $AC$, not $AB$ or $BC$.",
        "两个三角形由 SAS 全等后，每组对应部分都相等，包括没有标出的部分。\n\n若 $\\overline{AB} \\cong \\overline{DE}$，$\\angle B \\cong \\angle E$，$\\overline{BC} \\cong \\overline{EF}$，则 $\\triangle ABC \\cong \\triangle DEF$，所以第三边也相等：若 $AC = 17$，$DF = 4x - 3$，则 $4x - 3 = 17$，$4x = 20$，$x = 5$。\n\n> **注意。** 每个式子仍然只等于它自己的对应部分。这里 $DF$ 连接 $D$ 和 $F$，它们对应 $A$ 和 $C$，所以 $4x - 3$ 等于 $AC$，而不是 $AB$ 或 $BC$。",
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
        const s = third ? k : i;
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
            solution: paras(
              step(
                1,
                "pair the sides",
                "配对边",
                third
                  ? t(
                      `The expression is on $${seg(n2, k)}$, the third side, which carries no tick marks. The triangles are congruent by SAS, so every pair of corresponding parts is equal, and its partner $${seg(n1, k)}$ gives $${sideName(n2, k)} = ${sideName(n1, k)} = ${target}$.`,
                      `式子标在第三边 $${seg(n2, k)}$ 上，它没有短线标记。但两个三角形由 SAS 全等，每组对应部分都相等，它的对应边是 $${seg(n1, k)}$，所以 $${sideName(n2, k)} = ${sideName(n1, k)} = ${target}$。`,
                    )
                  : t(
                      `The expression is on $${seg(n2, i)}$, which carries the same tick marks as its partner $${seg(n1, i)}$, so $${sideName(n2, i)} = ${sideName(n1, i)} = ${target}$.`,
                      `式子标在 $${seg(n2, i)}$ 上，它与对应边 $${seg(n1, i)}$ 的短线标记相同，所以 $${sideName(n2, i)} = ${sideName(n1, i)} = ${target}$。`,
                    ),
              ),
              step(2, "solve", "解方程", t(`Set the expression equal to $${target}$:`, `令式子等于 $${target}$：`), solveSteps(u)),
              check(
                t(
                  `With $x = ${u.x}$, $${substituted(u)} = ${sideName(n1, s)}$. The congruence rests on SAS: $${seg(n1, i)}$ and $${seg(n1, j)}$ are marked with their partners, and the marked angle at $${n1[k]}$ is where those two sides meet.`,
                  `当 $x = ${u.x}$ 时，$${substituted(u)} = ${sideName(n1, s)}$。全等依据 SAS：$${seg(n1, i)}$、$${seg(n1, j)}$ 与各自的对应边都已标出，标出的 $${n1[k]}$ 处的角正是这两边的交点处的角。`,
                ),
              ),
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
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 13,
  standards: ["CCSS.HSG.CO.B.8", "CCSS.HSG.SRT.B.5"],
  intro: t(
    "SAS fixed a triangle by two sides and the angle at their hinge. Three sides fix it without any angle: once the three lengths are chosen, the triangle cannot flex, just as a frame of three rods is rigid. That is the **SSS** criterion. The work is in matching the sides by length and then reading off which vertices correspond.\n\nTake $\\triangle ABC$ with $BC = 8$, $CA = 6$, $AB = 5$, and $\\triangle QRP$ with $RP = 8$, $PQ = 6$, $QR = 5$.\n\n{{figure 0}}\n\nSorted, both have sides $5, 6, 8$, so SSS applies. The sides pair as $\\overline{AB} \\leftrightarrow \\overline{QR}$, $\\overline{BC} \\leftrightarrow \\overline{RP}$ and $\\overline{CA} \\leftrightarrow \\overline{PQ}$. $B$ is where $\\overline{AB}$ and $\\overline{BC}$ meet, so it matches $R$, where $\\overline{QR}$ and $\\overline{RP}$ meet; in the same way $A \\leftrightarrow Q$ and $C \\leftrightarrow P$. So $\\triangle ABC \\cong \\triangle QRP$, and reading the statement back, $AB = QR = 5$, $BC = RP = 8$ and $CA = PQ = 6$.",
    "SAS 用两边及其“铰链”处的角确定三角形。三条边不用任何角也能确定三角形：三条边长一旦选定，三角形就不能变形，就像三根杆搭成的框架是稳固的。这就是 **SSS** 判定。关键是按长度配对各边，再读出哪些顶点对应。\n\n取 $\\triangle ABC$，$BC = 8$，$CA = 6$，$AB = 5$；$\\triangle QRP$，$RP = 8$，$PQ = 6$，$QR = 5$。\n\n{{figure 0}}\n\n按大小排列，两个三角形的边长都是 $5, 6, 8$，所以可以用 SSS。各边配对为 $\\overline{AB} \\leftrightarrow \\overline{QR}$，$\\overline{BC} \\leftrightarrow \\overline{RP}$，$\\overline{CA} \\leftrightarrow \\overline{PQ}$。$B$ 是 $\\overline{AB}$ 与 $\\overline{BC}$ 的交点，所以对应 $\\overline{QR}$ 与 $\\overline{RP}$ 的交点 $R$；同理 $A \\leftrightarrow Q$，$C \\leftrightarrow P$。所以 $\\triangle ABC \\cong \\triangle QRP$；按全等式读回去，$AB = QR = 5$，$BC = RP = 8$，$CA = PQ = 6$。",
  ),
  introFigures: [
    pairFigure(
      bySides([8, 6, 5]),
      { turn: 160, mirror: true },
      ["A", "B", "C"],
      { sides: ["8", "6", "5"] },
      ["Q", "R", "P"],
      { sides: ["8", "6", "5"] },
      "Triangles ABC and QRP with sides 8, 6, 5 and 8, 6, 5.",
      "三角形 ABC 与 QRP，边长分别为 8、6、5 和 8、6、5。",
    ),
  ],
  knowledgePoints: [
    {
      id: "applying-sss",
      figure: congruenceDrawings["applying-sss"],
      title: t("The SSS criterion", "SSS 判定"),
      explanation: t(
        "The **SSS (side–side–side) criterion**: if the three sides of one triangle are congruent to the three sides of another, the triangles are congruent. Three side lengths fix a triangle completely.\n\nTo check, compare the side lengths sorted by size. A triangle with sides $5$, $7$, $9$ is congruent to one with sides $9$, $5$, $7$, but not to one with sides $5$, $7$, $10$.\n\n> **Watch out.** Two matching pairs are not enough: $5, 7, 9$ and $5, 7, 10$ share two lengths, yet the triangles differ. Sort both lists and compare all three places.",
        "**SSS（边边边）判定**：如果一个三角形的三条边分别与另一个三角形的三条边全等，那么这两个三角形全等。三条边长完全确定一个三角形。\n\n检查时，把两组边长按大小排好再比较。边长为 $5$、$7$、$9$ 的三角形与边长为 $9$、$5$、$7$ 的三角形全等，但与边长为 $5$、$7$、$10$ 的三角形不全等。\n\n> **注意。** 只有两组相等是不够的：$5, 7, 9$ 和 $5, 7, 10$ 有两个长度相同，三角形却不同。要把两组边长都排好序，三个位置逐一比较。",
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
        const claimed = yes ? sides.map((s, i) => (i === 2 ? s + 1 : s)) : shown;
        const odd = shown.find((s) => !sides.includes(s));
        const pairsText = [0, 1, 2]
          .map((v) => `\\overline{${sideName(n1, v)}} \\leftrightarrow \\overline{${sideName(n2, order.indexOf(v))}}`)
          .join(",\\ ");
        return {
          ...verdictChoice(rng, {
            prompt: t(
              `Are $${triName(n1)}$ and $${triName(n2)}$ congruent by SSS?`,
              `$${triName(n1)}$ 与 $${triName(n2)}$ 能由 SSS 判定全等吗？`,
            ),
            holds: yes,
            yes: t(`sorted, the sides are $${sorted(sides)}$ in both triangles`, `按大小排列，两个三角形的边长都是 $${sorted(sides)}$`),
            no: t(
              `sorted, the sides are $${sorted(sides)}$ in one triangle and $${sorted(claimed)}$ in the other`,
              `按大小排列，一个三角形的边长是 $${sorted(sides)}$，另一个是 $${sorted(claimed)}$`,
            ),
            yesWrong: t("at least two pairs of sides match", "至少有两组边相等"),
            noWrong: t("the sides are listed in a different order", "边的排列顺序不同"),
            solution: paras(
              step(
                1,
                "sort the sides",
                "把边长排序",
                t(
                  `$${triName(n1)}$ has sides $${sorted(sides)}$, and $${triName(n2)}$ has sides $${sorted(shown)}$.`,
                  `$${triName(n1)}$ 的边长是 $${sorted(sides)}$，$${triName(n2)}$ 的边长是 $${sorted(shown)}$。`,
                ),
              ),
              step(
                2,
                "compare place by place",
                "逐个位置比较",
                yes
                  ? t(
                      "All three places agree, so the three sides match in pairs and the triangles are congruent by SSS.",
                      "三个位置都相同，三条边一一对应相等，所以由 SSS 得两个三角形全等。",
                    )
                  : t(
                      "The lists differ in one place, so the sides do not all match and SSS does not apply.",
                      "两组边长有一个位置不同，边并不都相等，所以不能用 SSS。",
                    ),
              ),
              yes
                ? check(
                    t(
                      `Pair the sides by length: $${pairsText}$, each pair of length ${[0, 1, 2].map((v) => `$${sides[v]}$`).join(", ")} in turn. SSS needs three such pairs, and all three are there.`,
                      `按长度配对：$${pairsText}$，各组长度依次为 ${[0, 1, 2].map((v) => `$${sides[v]}$`).join("、")}。SSS 需要三组这样的边，三组都有。`,
                    ),
                  )
                : check(
                    t(
                      `$${triName(n2)}$ has a side of length $${odd}$, and no side of $${triName(n1)}$ is that long, so that side has no partner.`,
                      `$${triName(n2)}$ 有一条长为 $${odd}$ 的边，而 $${triName(n1)}$ 中没有这么长的边，所以这条边找不到对应边。`,
                    ),
                  ),
            ),
          }),
          figure: pairFigure(bySides(sides), pickPose(rng), n1, look1, n2, look2, en, zh, bySides(shown)),
        };
      },
    },
    {
      id: "matching-vertices",
      figure: congruenceDrawings["matching-vertices"],
      title: t("Matching the vertices", "对应顶点"),
      explanation: t(
        "To write the congruence statement, match the sides by length, then match the vertices: a vertex is where its two sides meet.\n\nIf $AB = 6$, $BC = 8$, $CA = 11$ and $DE = 8$, $EF = 11$, $FD = 6$: $\\overline{AB} \\leftrightarrow \\overline{FD}$ and $\\overline{BC} \\leftrightarrow \\overline{DE}$. $B$ is on both $\\overline{AB}$ and $\\overline{BC}$, so it matches the point on both $\\overline{FD}$ and $\\overline{DE}$, which is $D$. In the same way $A \\leftrightarrow F$ and $C \\leftrightarrow E$, so $\\triangle ABC \\cong \\triangle FDE$.\n\n> **Watch out.** Pairing $\\overline{AB}$ with $\\overline{FD}$ does not mean $A \\leftrightarrow F$ and $B \\leftrightarrow D$ in the order written: the letters of a segment can be read either way. Find each vertex as the meeting point of two sides.",
        "要写出全等式，先按长度配对各边，再配对顶点：顶点是它的两条边的公共点。\n\n若 $AB = 6$，$BC = 8$，$CA = 11$，$DE = 8$，$EF = 11$，$FD = 6$：$\\overline{AB} \\leftrightarrow \\overline{FD}$，$\\overline{BC} \\leftrightarrow \\overline{DE}$。$B$ 同时在 $\\overline{AB}$ 和 $\\overline{BC}$ 上，所以它对应同时在 $\\overline{FD}$ 和 $\\overline{DE}$ 上的点，即 $D$。同理 $A \\leftrightarrow F$，$C \\leftrightarrow E$，所以 $\\triangle ABC \\cong \\triangle FDE$。\n\n> **注意。** $\\overline{AB}$ 与 $\\overline{FD}$ 配对，并不表示按书写顺序 $A \\leftrightarrow F$、$B \\leftrightarrow D$：线段的字母可以倒过来读。要把每个顶点看作两条边的交点来配对。",
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
        const statement = (p: readonly number[]) => m(`${triName(n1)} \\cong ${triName(n2, p)}`);
        const options = [statement([0, 1, 2]), ...wrongs.map(statement)];
        const shuffled = rng.shuffle(options);
        const [en, zh] = pairAlt(n1, n2);
        const len = (a: number, b: number) => sides[3 - a - b]!;
        const edges = [
          [0, 1],
          [1, 2],
          [2, 0],
        ] as const;
        const mismatch = (p: readonly number[]) => {
          const [a, b] = edges.find(([a, b]) => len(a, b) !== len(p[a]!, p[b]!))!;
          return t(
            `It pairs $\\overline{${n1[a]}${n1[b]}}$, of length $${len(a, b)}$, with $\\overline{${n2[p[a]!]}${n2[p[b]!]}}$, of length $${len(p[a]!, p[b]!)}$.`,
            `它把长为 $${len(a, b)}$ 的 $\\overline{${n1[a]}${n1[b]}}$ 与长为 $${len(p[a]!, p[b]!)}$ 的 $\\overline{${n2[p[a]!]}${n2[p[b]!]}}$ 配对。`,
          );
        };
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `$${given1}$, and $${given2}$. Which congruence statement is correct?`,
                `$${given1}$，$${given2}$。哪个全等式是正确的？`,
              ),
              options: shuffled,
              correct: shuffled.indexOf(options[0]!),
              solution: paras(
                step(
                  1,
                  "match the sides by length",
                  "按长度配对各边",
                  t(
                    `${[0, 1, 2].map((v) => `$\\overline{${sideName(n1, v)}} \\leftrightarrow \\overline{${sideName(n2, v)}}$`).join(", ")}.`,
                    `${[0, 1, 2].map((v) => `$\\overline{${sideName(n1, v)}} \\leftrightarrow \\overline{${sideName(n2, v)}}$`).join("，")}。`,
                  ),
                ),
                step(
                  2,
                  "match the vertices",
                  "配对顶点",
                  t(
                    `Each vertex matches the vertex where the corresponding sides meet: $${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$. So $${triName(n1)} \\cong ${correct}$.`,
                    `每个顶点对应其两条对应边的交点：$${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$。所以 $${triName(n1)} \\cong ${correct}$。`,
                  ),
                ),
                check(
                  t(
                    `Read the sides off the statement: ${edges.map(([a, b]) => `$${n1[a]}${n1[b]} = ${n2[a]}${n2[b]} = ${len(a, b)}$`).join(", ")}. Every pair has equal lengths.`,
                    `按全等式读出各边：${edges.map(([a, b]) => `$${n1[a]}${n1[b]} = ${n2[a]}${n2[b]} = ${len(a, b)}$`).join("，")}。每组长度都相等。`,
                  ),
                ),
              ),
            }),
            wrongs.map((p) => [statement(p).en, mismatch(p).en, mismatch(p)["zh-CN"]] as const),
          ),
          figure: pairFigure(bySides(sides), pickPose(rng), n1, { sides: sides.map(String) }, n2, { sides: sides.map(String) }, en, zh),
        };
      },
    },
    {
      id: "solving-with-sss",
      figure: geometryDrawings2["the-sss-congruence-criterion#solving-with-sss"],
      title: t("Unknowns in SSS", "SSS 中的未知量"),
      explanation: t(
        "When two sides of a triangle are given by expressions, each expression must equal one of the other triangle's sides, and both must give the same value of $x$.\n\n$\\triangle ABC$ has sides $7$, $10$, $13$, and $\\triangle DEF$ has sides $7$, $x + 6$ and $3x - 2$. Trying $x + 6 = 10$ gives $x = 4$, and then $3x - 2 = 10 \\ne 13$. Trying $x + 6 = 13$ gives $x = 7$, and then $3x - 2 = 19 \\ne 10$. Neither works, so no value of $x$ makes the triangles congruent. With $3x - 5$ instead of $3x - 2$, $x = 4$ gives $10$ and $7$: no. With $2x + 5$, $x = 4$ gives $10$ and $13$: yes, $x = 4$.\n\n> **Watch out.** One equation is not enough. A value of $x$ that makes one expression equal a side must also make the other expression equal the remaining side; $x = 4$ from $x + 6 = 10$ fails for $3x - 2$, which then gives $10$, not $13$.",
        "当三角形的两条边由式子给出时，每个式子都必须等于另一个三角形的某条边，并且两个式子必须得到同一个 $x$。\n\n$\\triangle ABC$ 的边长是 $7$、$10$、$13$，$\\triangle DEF$ 的边长是 $7$、$x + 6$、$3x - 2$。试 $x + 6 = 10$，得 $x = 4$，这时 $3x - 2 = 10 \\ne 13$；试 $x + 6 = 13$，得 $x = 7$，这时 $3x - 2 = 19 \\ne 10$。都不行，所以没有 $x$ 使两个三角形全等。若把 $3x - 2$ 换成 $2x + 5$，则 $x = 4$ 时两边为 $10$ 和 $13$：可以，$x = 4$。\n\n> **注意。** 只解一个方程是不够的。使一个式子等于某条边的 $x$，还必须使另一个式子等于剩下的那条边；由 $x + 6 = 10$ 得到的 $x = 4$ 不行，因为这时 $3x - 2$ 等于 $10$，而不是 $13$。",
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
          const xSwap = Q.of(sides[q]! - d1, c1);
          const otherSwap = xSwap.mul(Q.of(c2)).add(Q.of(d2));
          const at = (c: number, d: number) => `${c === 1 ? "" : `${c} \\cdot `}${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
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
              solution: paras(
                step(
                  1,
                  "match the known side",
                  "配对已知的边",
                  t(
                    `$${seg(n2, known)}$ and $${seg(n1, known)}$ are both $${sides[known]}$ long, so the expressions must equal $${sides[p]}$ and $${sides[q]}$ in some order.`,
                    `$${seg(n2, known)}$ 与 $${seg(n1, known)}$ 都长 $${sides[known]}$，所以两个式子必须分别等于 $${sides[p]}$ 和 $${sides[q]}$，顺序待定。`,
                  ),
                ),
                step(
                  2,
                  "try one order",
                  "试一种配对",
                  t(`Set $${linear(c1, d1)} = ${sides[p]}$:`, `令 $${linear(c1, d1)} = ${sides[p]}$：`),
                  steps(`${linear(c1, d1)} = ${sides[p]}`, ...(c1 === 1 ? [] : [`${linear(c1, 0)} = ${sides[p]! - d1}`]), `x = ${x}`),
                  t(
                    `Then $${linear(c2, d2)} = ${c2 * x + d2} = ${sides[q]}$ as well, so this order works.`,
                    `这时 $${linear(c2, d2)} = ${c2 * x + d2} = ${sides[q]}$ 也成立，所以这种配对可行。`,
                  ),
                ),
                step(
                  3,
                  "rule out the other order",
                  "排除另一种配对",
                  t(
                    `Setting $${linear(c1, d1)} = ${sides[q]}$ instead gives $x = ${xSwap.toLatex()}$, and then $${linear(c2, d2)} = ${otherSwap.toLatex()} \\ne ${sides[p]}$. So $x = ${x}$.`,
                    `若令 $${linear(c1, d1)} = ${sides[q]}$，得 $x = ${xSwap.toLatex()}$，这时 $${linear(c2, d2)} = ${otherSwap.toLatex()} \\ne ${sides[p]}$。所以 $x = ${x}$。`,
                  ),
                ),
                check(
                  t(
                    `With $x = ${x}$ the sides of $${triName(n2)}$ are $${sides[known]}$, $${at(c1, d1)} = ${sides[p]}$ and $${at(c2, d2)} = ${sides[q]}$: the same three lengths as $${triName(n1)}$, which is what SSS needs.`,
                    `当 $x = ${x}$ 时，$${triName(n2)}$ 的边长是 $${sides[known]}$、$${at(c1, d1)} = ${sides[p]}$ 和 $${at(c2, d2)} = ${sides[q]}$：与 $${triName(n1)}$ 的三条边长相同，满足 SSS。`,
                  ),
                ),
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
  encompasses: [{ topic: "two-step-equations", weight: 0.2 }],
  xp: 13,
  standards: ["CCSS.HSG.SRT.B.5"],
  intro: t(
    "SSS needs all three pairs of sides. For right triangles two pairs are enough, provided one of them is the pair of hypotenuses: the Pythagorean theorem then supplies the third. In general two sides and an angle that is not between them (SSA) do not fix a triangle, but when that angle is a right angle they do. That is the **HL** criterion: the hypotenuse and a leg.\n\nTake right triangles $ABC$ and $DEF$ with right angles at $C$ and $F$, hypotenuses $AB = DE = 10$ and legs $AC = DF = 6$.\n\n{{figure 0}}\n\nThe other legs follow from the Pythagorean theorem: $BC = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8$, and in the same way $EF = \\sqrt{10^2 - 6^2} = 8$.\n\n{{figure 1}}\n\nNow all three pairs of sides match, so SSS gives $\\triangle ABC \\cong \\triangle DEF$. The same argument works for any hypotenuse and leg, which is why HL may be used directly, without finding the third sides.",
    "SSS 需要三组边。对直角三角形来说，两组边就够了，只要其中一组是斜边：勾股定理会给出第三组。一般地，两边及其非夹角（SSA）不能确定三角形，但当这个角是直角时就可以。这就是 **HL** 判定：斜边和一条直角边。\n\n取直角三角形 $ABC$ 与 $DEF$，直角分别在 $C$ 和 $F$，斜边 $AB = DE = 10$，直角边 $AC = DF = 6$。\n\n{{figure 0}}\n\n另一条直角边可由勾股定理求出：$BC = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8$，同样 $EF = \\sqrt{10^2 - 6^2} = 8$。\n\n{{figure 1}}\n\n这样三组边都相等，由 SSS 得 $\\triangle ABC \\cong \\triangle DEF$。对任意一组斜边和直角边，这个论证都成立，所以可以直接用 HL，不必再求第三条边。",
  ),
  introFigures: [
    pairFigure(
      rightShape(2, [6, 8]),
      { turn: 20, mirror: true },
      ["A", "B", "C"],
      { sides: [null, { ticks: 2, label: "6" }, { ticks: 1, label: "10" }], right: 2 },
      ["D", "E", "F"],
      { sides: [null, { ticks: 2, label: "6" }, { ticks: 1, label: "10" }], right: 2 },
      "Right triangles ABC and DEF with right angles at C and F, hypotenuses 10 and legs AC and DF of 6.",
      "直角三角形 ABC 与 DEF，直角分别在 C 和 F，斜边为 10，直角边 AC 与 DF 为 6。",
    ),
    pairFigure(
      rightShape(2, [6, 8]),
      { turn: 20, mirror: true },
      ["A", "B", "C"],
      {
        sides: [
          { ticks: 3, label: "8" },
          { ticks: 2, label: "6" },
          { ticks: 1, label: "10" },
        ],
        right: 2,
        fresh: { sides: [0] },
      },
      ["D", "E", "F"],
      {
        sides: [
          { ticks: 3, label: "8" },
          { ticks: 2, label: "6" },
          { ticks: 1, label: "10" },
        ],
        right: 2,
        fresh: { sides: [0] },
      },
      "The same triangles with the third sides BC and EF, both 8, highlighted.",
      "同样的两个三角形，第三条边 BC 与 EF 都是 8，用另一种颜色标出。",
    ),
  ],
  knowledgePoints: [
    {
      id: "hypotenuse-and-leg",
      figure: congruenceDrawings["hypotenuse-and-leg"],
      title: t("The HL criterion", "HL 判定"),
      explanation: t(
        "The **HL (hypotenuse–leg) criterion**: if the hypotenuse and a leg of one right triangle are congruent to the hypotenuse and a leg of another right triangle, the triangles are congruent.\n\nThis is a special case where two sides and a non-included angle are enough, because the angle is a right angle. By the Pythagorean theorem the other legs are equal too, so SSS applies.\n\nOther criteria still work for right triangles: two legs and the right angle between them is SAS; a leg and an acute angle next to it, with the right angle, is ASA.\n\n> **Watch out.** HL needs the hypotenuse. If the two congruent sides are both legs, the right angle lies between them and the criterion is SAS; and without a right angle in both triangles, two sides and an angle that is not between them prove nothing.",
        "**HL（斜边、直角边）判定**：如果一个直角三角形的斜边和一条直角边分别与另一个直角三角形的斜边和一条直角边全等，那么这两个直角三角形全等。\n\n这是“两边及非夹角”也足够的特殊情形，因为这个角是直角。由勾股定理，另一条直角边也相等，于是可以用 SSS。\n\n其他判定对直角三角形同样适用：两条直角边及它们之间的直角是 SAS；一条直角边、与它相邻的锐角以及直角是 ASA。\n\n> **注意。** HL 必须用到斜边。如果两组全等的边都是直角边，直角就是它们的夹角，应当用 SAS；如果两个三角形不都是直角三角形，两边及其非夹角什么也证明不了。",
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
          ...criterionChoice(
            cat(
              t("In the figure, ", "图中，"),
              andList(sc.parts.map((p) => factText(p, n1, n2, sc.right))),
              t(
                `. Which criterion proves $${triName(n1)} \\cong ${triName(n2)}$?`,
                `。用哪种判定方法可以证明 $${triName(n1)} \\cong ${triName(n2)}$？`,
              ),
            ),
            options,
            sc.parts,
            sc.right,
            n1,
            n2,
          ),
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
      figure: congruenceDrawings["missing-legs"],
      title: t("The missing leg", "求另一条直角边"),
      explanation: t(
        "Right triangles congruent by HL have all their parts equal, so the leg that was not given can be found in either triangle with the Pythagorean theorem.\n\nIf $\\angle C$ and $\\angle F$ are right angles, $AB = DE = 17$ and $AC = DF = 8$, then $BC = \\sqrt{17^2 - 8^2} = \\sqrt{225} = 15$, and since $\\triangle ABC \\cong \\triangle DEF$, $EF = BC = 15$.\n\n> **Watch out.** Subtract the squares, do not add them: the hypotenuse is the longest side, so the missing leg is $\\sqrt{17^2 - 8^2}$. Adding gives $\\sqrt{17^2 + 8^2} \\approx 18.8$, a leg longer than the hypotenuse.",
        "由 HL 全等的直角三角形所有对应部分都相等，所以没有给出的那条直角边可以在任一个三角形中用勾股定理求出。\n\n若 $\\angle C$ 与 $\\angle F$ 是直角，$AB = DE = 17$，$AC = DF = 8$，则 $BC = \\sqrt{17^2 - 8^2} = \\sqrt{225} = 15$；又 $\\triangle ABC \\cong \\triangle DEF$，所以 $EF = BC = 15$。\n\n> **注意。** 是两个平方相减，不是相加：斜边是最长的边，所以所求直角边是 $\\sqrt{17^2 - 8^2}$。相加会得到 $\\sqrt{17^2 + 8^2} \\approx 18.8$，直角边反而比斜边长。",
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
        const solved1 = sides1.map((s, i) => (i === other ? String(len(other)) : s));
        const solved2 = sides2.map((s, i) => (i === other ? String(len(other)) : s));
        const [en, zh] = pairAlt(n1, n2);
        const pose = pickPose(rng);
        const [lg, lo] = [len(given), len(other)];
        return {
          ...numberProblem({
            prompt: t(
              `$${triName(n1)}$ and $${triName(n2)}$ are right triangles with right angles at $${n1[r]}$ and $${n2[r]}$, $${seg(n1, r)} \\cong ${seg(n2, r)}$ and $${seg(n1, given)} \\cong ${seg(n2, given)}$. Find $${sideName(n2, other)}$.`,
              `$${triName(n1)}$ 与 $${triName(n2)}$ 是直角三角形，直角分别在 $${n1[r]}$ 和 $${n2[r]}$，$${seg(n1, r)} \\cong ${seg(n2, r)}$，$${seg(n1, given)} \\cong ${seg(n2, given)}$。求 $${sideName(n2, other)}$。`,
            ),
            answer: lo,
            form: "integer",
            wrong: [c - lg, lg, c, c + lg],
            solution: paras(
              step(
                1,
                "prove the triangles congruent",
                "证明两个三角形全等",
                t(
                  `Both are right triangles, $${seg(n1, r)}$ and $${seg(n2, r)}$ are the hypotenuses, opposite the right angles, and $${seg(n1, given)}$ and $${seg(n2, given)}$ are legs. So $${triName(n1)} \\cong ${triName(n2)}$ by HL, and $${sideName(n2, other)} = ${sideName(n1, other)}$.`,
                  `两个都是直角三角形，$${seg(n1, r)}$ 与 $${seg(n2, r)}$ 是直角所对的斜边，$${seg(n1, given)}$ 与 $${seg(n2, given)}$ 是直角边。所以由 HL 得 $${triName(n1)} \\cong ${triName(n2)}$，从而 $${sideName(n2, other)} = ${sideName(n1, other)}$。`,
                ),
              ),
              step(
                2,
                "use the Pythagorean theorem",
                "用勾股定理",
                t(
                  `In $${triName(n1)}$ the hypotenuse is $${c}$ and one leg is $${lg}$:`,
                  `在 $${triName(n1)}$ 中，斜边是 $${c}$，一条直角边是 $${lg}$：`,
                ),
                steps(`${sideName(n1, other)} = \\sqrt{${c}^2 - ${lg}^2} = \\sqrt{${c * c - lg * lg}} = ${lo}`),
                t(`So $${sideName(n2, other)} = ${lo}$.\n\n{{figure 0}}`, `所以 $${sideName(n2, other)} = ${lo}$。\n\n{{figure 0}}`),
              ),
              check(
                t(
                  `The legs and the hypotenuse satisfy the Pythagorean theorem: $${lg}^2 + ${lo}^2 = ${lg * lg} + ${lo * lo} = ${c * c} = ${c}^2$. And $${lo} < ${c}$, so the leg is shorter than the hypotenuse, as it must be.`,
                  `两条直角边与斜边满足勾股定理：$${lg}^2 + ${lo}^2 = ${lg * lg} + ${lo * lo} = ${c * c} = ${c}^2$。并且 $${lo} < ${c}$，直角边比斜边短，符合要求。`,
                ),
              ),
            ),
          }),
          figure: pairFigure(shape, pose, n1, { sides: sides1, right: r }, n2, { sides: sides2, right: r }, en, zh),
          solutionFigures: [
            pairFigure(
              shape,
              pose,
              n1,
              { sides: solved1, right: r, fresh: { sides: [other] } },
              n2,
              { sides: solved2, right: r, fresh: { sides: [other] } },
              ...pairAlt(n1, n2, t(`The missing legs, both ${lo}, are highlighted.`, `所求的直角边都是 ${lo}，用另一种颜色标出。`)),
            ),
          ],
        };
      },
    },
    {
      id: "solving-with-hl",
      figure: congruenceDrawings["solving-with-hl"],
      title: t("Unknowns in HL", "HL 中的未知量"),
      explanation: t(
        "For HL, the hypotenuse must match the hypotenuse and a leg must match a leg. The hypotenuse is the side opposite the right angle, and it is always the longest side.\n\nIf right triangles $ABC$ and $DEF$ have right angles at $C$ and $F$, $AB = 25$, $AC = 7$, $DF = 7$ and $DE = 5x - 5$, then for $\\triangle ABC \\cong \\triangle DEF$ by HL, $5x - 5 = 25$, so $5x = 30$ and $x = 6$.\n\n> **Watch out.** Pair the expression with the side in the same role. $\\overline{DE}$ is opposite the right angle at $F$, so it is a hypotenuse and must equal $AB = 25$; setting $5x - 5 = 7$ would make the hypotenuse $DE$ as short as a leg.",
        "用 HL 时，斜边要对应斜边，直角边要对应直角边。斜边是直角所对的边，总是最长的边。\n\n若直角三角形 $ABC$ 与 $DEF$ 的直角分别在 $C$ 和 $F$，$AB = 25$，$AC = 7$，$DF = 7$，$DE = 5x - 5$，则要由 HL 得 $\\triangle ABC \\cong \\triangle DEF$，需 $5x - 5 = 25$，所以 $5x = 30$，$x = 6$。\n\n> **注意。** 式子要与同一角色的边配对。$\\overline{DE}$ 是直角 $F$ 所对的边，是斜边，必须等于 $AB = 25$；若令 $5x - 5 = 7$，斜边 $DE$ 就和直角边一样短了。",
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
        const role = onHyp
          ? t(
              `$${seg(n2, s)}$ is opposite the right angle at $${n2[r]}$, so it is the hypotenuse of $${triName(n2)}$, and its partner is the hypotenuse $${seg(n1, s)}$`,
              `$${seg(n2, s)}$ 是直角 $${n2[r]}$ 所对的边，是 $${triName(n2)}$ 的斜边，它的对应边是斜边 $${seg(n1, s)}$`,
            )
          : t(
              `$${seg(n2, s)}$ ends at the right-angle vertex $${n2[r]}$, so it is a leg of $${triName(n2)}$, and its partner is the leg $${seg(n1, s)}$`,
              `$${seg(n2, s)}$ 以直角顶点 $${n2[r]}$ 为端点，是 $${triName(n2)}$ 的直角边，它的对应边是直角边 $${seg(n1, s)}$`,
            );
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
            solution: paras(
              step(
                1,
                "name the role of the side",
                "判断这条边的角色",
                cat(
                  role,
                  t(
                    `. So $${sideName(n2, s)} = ${sideName(n1, s)} = ${target}$.`,
                    `。所以 $${sideName(n2, s)} = ${sideName(n1, s)} = ${target}$。`,
                  ),
                ),
              ),
              step(2, "solve", "解方程", t(`Set the expression equal to $${target}$:`, `令式子等于 $${target}$：`), solveSteps(u)),
              check(
                t(
                  `With $x = ${u.x}$, $${substituted(u)}$. Then both triangles have the right angle, hypotenuse $${c}$ and leg $${len(leg)}$, which is what HL needs, and the hypotenuse $${c}$ is longer than the leg $${len(leg)}$, as it must be.`,
                  `当 $x = ${u.x}$ 时，$${substituted(u)}$。这时两个三角形都有直角、斜边 $${c}$ 和直角边 $${len(leg)}$，满足 HL；斜边 $${c}$ 也比直角边 $${len(leg)}$ 长，符合要求。`,
                ),
              ),
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

/** sharedFigure draws two triangles U, V, X and U, V, Y that share the side UV, each marked by its look, with the four letters once. */
function sharedFigure(pts: readonly [Point, Point, Point, Point], letters: readonly string[], look1: Look, look2: Look): Mark[] {
  const [pu, pv, px, py] = pts;
  const [u, v, x, y] = letters as [string, string, string, string];
  return [
    ...triMarks([pu, pv, px], [u, v, x], look1).filter((k) => k.kind !== "label"),
    ...triMarks([pu, pv, py], [u, v, y], look2).filter((k) => k.kind !== "label"),
    ...names([pu, pv, px, py], [u, v, x, y]),
  ];
}

/** kite is the quadrilateral PQRS of the introduction, split by the diagonal PR. */
const kite: readonly [Point, Point, Point, Point] = [
  [0, 0],
  [6, 0],
  [2.5, 2.2],
  [2.5, -2.2],
];

export const combiningCongruenceCriteriaForTriangles: TopicDef = {
  id: "combining-congruence-criteria-for-triangles",
  title: t("Combining Congruence Criteria for Triangles", "综合运用三角形全等判定"),
  summary: t(
    "Choose the criterion that proves two triangles congruent, using shared sides and vertical angles.",
    "选择能证明两个三角形全等的判定方法，并利用公共边和对顶角。",
  ),
  prerequisites: ["the-aas-congruence-criterion", "the-hl-congruence-criterion"],
  encompasses: [
    { topic: "the-asa-congruence-criterion", weight: 0.2 },
    { topic: "the-aas-congruence-criterion", weight: 0.2 },
    { topic: "the-sas-congruence-criterion", weight: 0.2 },
    { topic: "the-sss-congruence-criterion", weight: 0.2 },
    { topic: "the-hl-congruence-criterion", weight: 0.2 },
    { topic: "vertical-angles", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  intro: t(
    "The five criteria, SSS, SAS, ASA, AAS and HL, each name three pairs of parts. In a figure the work is to sort the pairs at hand, see where they sit and pick the criterion they fit. Often one pair is not marked at all: the figure itself supplies it, as a side that two triangles share or as the vertical angles where two segments cross.\n\nIn quadrilateral $PQRS$ the diagonal $\\overline{PR}$ cuts out $\\triangle PRQ$ and $\\triangle PRS$, with $\\overline{PQ} \\cong \\overline{PS}$ and $\\overline{RQ} \\cong \\overline{RS}$ marked.\n\n{{figure 0}}\n\nTwo pairs of sides are not enough for any criterion. But $\\overline{PR}$ belongs to both triangles, and $\\overline{PR} \\cong \\overline{PR}$ by the Reflexive Property.\n\n{{figure 1}}\n\nNow there are three pairs of sides, $\\overline{PQ} \\cong \\overline{PS}$, $\\overline{RQ} \\cong \\overline{RS}$ and $\\overline{PR} \\cong \\overline{PR}$, so $\\triangle PRQ \\cong \\triangle PRS$ by SSS.",
    "SSS、SAS、ASA、AAS、HL 这五种判定，每一种都指明三组部分。面对一个图形，要做的是把已有的各组部分归类，看清它们的位置，再选出符合的判定。常常有一组部分根本没有标出，而是由图形本身给出：两个三角形的公共边，或两条线段相交形成的对顶角。\n\n在四边形 $PQRS$ 中，对角线 $\\overline{PR}$ 分出 $\\triangle PRQ$ 与 $\\triangle PRS$，图中标出 $\\overline{PQ} \\cong \\overline{PS}$，$\\overline{RQ} \\cong \\overline{RS}$。\n\n{{figure 0}}\n\n只有两组边，哪种判定都不够。但 $\\overline{PR}$ 同属两个三角形，由自反性 $\\overline{PR} \\cong \\overline{PR}$。\n\n{{figure 1}}\n\n现在有了三组边：$\\overline{PQ} \\cong \\overline{PS}$，$\\overline{RQ} \\cong \\overline{RS}$，$\\overline{PR} \\cong \\overline{PR}$，所以由 SSS 得 $\\triangle PRQ \\cong \\triangle PRS$。",
  ),
  introFigures: [
    figure(
      sharedFigure(kite, ["P", "R", "Q", "S"], { sides: [2, 1, null] }, { sides: [2, 1, null] }),
      "Quadrilateral PQRS with diagonal PR; PQ and PS carry one tick, RQ and RS two.",
      "四边形 PQRS 及对角线 PR；PQ 与 PS 各有一条短线，RQ 与 RS 各有两条。",
    ),
    figure(
      sharedFigure(kite, ["P", "R", "Q", "S"], { sides: [2, 1, 3], fresh: { sides: [2] } }, { sides: [2, 1, null] }),
      "The same quadrilateral with the shared side PR highlighted and marked with three ticks.",
      "同样的四边形，公共边 PR 用另一种颜色标出，并画上三条短线。",
    ),
  ],
  knowledgePoints: [
    {
      id: "choosing-a-criterion",
      figure: geometryDrawings2["combining-congruence-criteria-for-triangles#choosing-a-criterion"],
      title: t("Choosing a criterion", "选择判定方法"),
      explanation: t(
        "Sort the three pairs of congruent parts:\n\n- three sides: **SSS**;\n- two sides and the angle between them: **SAS**;\n- two angles and the side between them: **ASA**;\n- two angles and a side not between them: **AAS**;\n- right triangles with congruent hypotenuses and a pair of congruent legs: **HL**.\n\nTwo combinations do not prove congruence: three angles (**AAA**), and two sides with an angle that is not between them (**SSA**), unless that angle is a right angle, which is HL.\n\n> **Watch out.** Counting sides and angles is not enough; look at where they sit. Two sides and an angle are SAS only when both sides end at the angle's vertex. If $\\overline{AB} \\cong \\overline{DE}$, $\\overline{BC} \\cong \\overline{EF}$ and $\\angle A \\cong \\angle D$, the angle is not between the sides: that is SSA, and it proves nothing.",
        "把三组全等的部分归类：\n\n- 三条边：**SSS**；\n- 两边及其夹角：**SAS**；\n- 两角及其夹边：**ASA**；\n- 两角及一角的对边：**AAS**；\n- 斜边全等且有一组直角边全等的直角三角形：**HL**。\n\n有两种组合不能证明全等：三个角（**AAA**），以及两边和一个非夹角（**SSA**），除非这个角是直角，那就是 HL。\n\n> **注意。** 只数边和角的个数是不够的，还要看它们的位置。两边一角只有在两边都以这个角的顶点为端点时才是 SAS。若 $\\overline{AB} \\cong \\overline{DE}$，$\\overline{BC} \\cong \\overline{EF}$，$\\angle A \\cong \\angle D$，这个角不是两边的夹角：这是 SSA，什么也证明不了。",
      ),
      generate(rng) {
        const crit = rng.pick(critOrder);
        return scenarioProblem(rng, crit, critOrder, crit === "hl" ? rng.int(0, 2) : null);
      },
    },
    {
      id: "shared-sides",
      figure: congruenceDrawings["shared-sides"],
      title: t("Shared sides", "公共边"),
      explanation: t(
        "When two triangles share a side, that side is congruent to itself (the **Reflexive Property**). It counts as one pair of congruent sides even though nothing marks it.\n\nIn a figure where $\\triangle UXV$ and $\\triangle UYV$ share $\\overline{UV}$: if $\\overline{UX} \\cong \\overline{UY}$ and $\\overline{VX} \\cong \\overline{VY}$, then with $\\overline{UV} \\cong \\overline{UV}$ the triangles are congruent by SSS. If instead $\\overline{UX} \\cong \\overline{UY}$ and $\\angle XUV \\cong \\angle YUV$, the angle at $U$ lies between $\\overline{UX}$ and $\\overline{UV}$, so it is SAS.\n\n> **Watch out.** The shared side still has to sit in the right place. With $\\overline{UX} \\cong \\overline{UY}$ and $\\angle UXV \\cong \\angle UYV$, the angles at $X$ and $Y$ are not between $\\overline{UX}$ and $\\overline{UV}$, which meet at $U$: with the shared side that is SSA, not SAS.",
        "两个三角形有公共边时，这条边与它自身全等（**自反性**）。即使图中没有标记，它也算作一组全等的边。\n\n设 $\\triangle UXV$ 与 $\\triangle UYV$ 有公共边 $\\overline{UV}$：若 $\\overline{UX} \\cong \\overline{UY}$，$\\overline{VX} \\cong \\overline{VY}$，再加上 $\\overline{UV} \\cong \\overline{UV}$，由 SSS 得两个三角形全等。若改为 $\\overline{UX} \\cong \\overline{UY}$，$\\angle XUV \\cong \\angle YUV$，则 $U$ 处的角是 $\\overline{UX}$ 与 $\\overline{UV}$ 的夹角，用 SAS。\n\n> **注意。** 公共边也要看位置。若 $\\overline{UX} \\cong \\overline{UY}$，$\\angle UXV \\cong \\angle UYV$，$X$、$Y$ 处的角不是 $\\overline{UX}$ 与 $\\overline{UV}$ 的夹角（这两边交于 $U$）：加上公共边是 SSA，不是 SAS。",
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
        const shared = S(2);
        const parts = [...extra, shared];
        const pts = kitePoints(rng, right !== null);
        const [pu, pv, px, py] = pts;
        const look = (which: 0 | 1) => partsLook(extra, right, which);
        const marks: Mark[] = [
          ...triMarks([pu, pv, px], n1, look(0)).filter((k) => k.kind !== "label"),
          ...triMarks([pu, pv, py], n2, look(1)).filter((k) => k.kind !== "label"),
          ...names([pu, pv, px, py], [U, V, X, Y]),
        ];
        const facts = extra.map((p) => factText(p, n1, n2, right, ang3));
        return {
          ...criterionChoice(
            cat(
              t("In the figure, ", "图中，"),
              andList(facts),
              t(
                `. Which criterion proves $${triName(n1, [0, 2, 1])} \\cong ${triName(n2, [0, 2, 1])}$?`,
                `。用哪种判定方法可以证明 $${triName(n1, [0, 2, 1])} \\cong ${triName(n2, [0, 2, 1])}$？`,
              ),
            ),
            critOrder,
            parts,
            right,
            n1,
            n2,
            {
              first: (i) =>
                step(
                  i,
                  "use the shared side",
                  "用公共边",
                  t(
                    `The triangles share $\\overline{${U}${V}}$, so $\\overline{${U}${V}} \\cong \\overline{${U}${V}}$ by the Reflexive Property. That is a third pair of congruent parts, though nothing marks it.\n\n{{figure 0}}`,
                    `两个三角形有公共边 $\\overline{${U}${V}}$，由自反性 $\\overline{${U}${V}} \\cong \\overline{${U}${V}}$。这是第三组全等的部分，虽然图中没有标记。\n\n{{figure 0}}`,
                  ),
                ),
              how: (p) => (p === shared ? t("Reflexive Property", "自反性") : given(p)),
              angle: ang3,
            },
          ),
          figure: figure(
            marks,
            `Quadrilateral ${U}${X}${V}${Y} with diagonal ${U}${V}, forming triangles ${U}${X}${V} and ${U}${Y}${V}.`,
            `四边形 ${U}${X}${V}${Y} 及对角线 ${U}${V}，构成三角形 ${U}${X}${V} 与 ${U}${Y}${V}。`,
          ),
          solutionFigures: [
            figure(
              sharedFigure(pts, [U, V, X, Y], { ...partsLook(parts, right, 0), fresh: { sides: [2] } }, look(1)),
              `The same figure with the shared side ${U}${V} highlighted and ticked.`,
              `同样的图形，公共边 ${U}${V} 用另一种颜色标出，并画上短线。`,
            ),
          ],
        };
      },
    },
    {
      id: "vertical-angles",
      figure: congruenceDrawings["vertical-angles"],
      title: t("Vertical angles", "对顶角"),
      explanation: t(
        "When two segments cross, they form two triangles that meet at the crossing point. The angles of the triangles at that point are **vertical angles**, so they are congruent: another pair of congruent parts that nothing marks.\n\nIf $\\overline{AD}$ and $\\overline{BE}$ cross at $C$, then $\\angle ACB \\cong \\angle DCE$. With $\\overline{AC} \\cong \\overline{DC}$ and $\\overline{BC} \\cong \\overline{EC}$, the vertical angles lie between the congruent sides, so $\\triangle ABC \\cong \\triangle DEC$ by SAS.\n\n> **Watch out.** The vertical angles are the two that face each other across the crossing, $\\angle ACB$ and $\\angle DCE$. $\\angle ACB$ and $\\angle BCD$ sit side by side and add up to $180^\\circ$; they are not congruent in general.",
        "两条线段相交时，构成在交点处相接的两个三角形。两个三角形在交点处的角是**对顶角**，所以全等：这又是一组没有标记的全等部分。\n\n若 $\\overline{AD}$ 与 $\\overline{BE}$ 相交于 $C$，则 $\\angle ACB \\cong \\angle DCE$。若再有 $\\overline{AC} \\cong \\overline{DC}$，$\\overline{BC} \\cong \\overline{EC}$，对顶角正是全等两边的夹角，所以由 SAS 得 $\\triangle ABC \\cong \\triangle DEC$。\n\n> **注意。** 对顶角是隔着交点相对的两个角，即 $\\angle ACB$ 与 $\\angle DCE$。$\\angle ACB$ 与 $\\angle BCD$ 是相邻的，和为 $180^\\circ$，一般并不全等。",
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
        const vertical = A(2);
        const parts = [...extra, vertical];
        const [pa, pb, pc, pd, pe] = bowtiePoints(rng);
        const bowtie = (look1: Look, look2: Look): Mark[] => [
          ...triMarks([pa, pb, pc], n1, look1).filter((k) => k.kind !== "label"),
          ...triMarks([pd, pe, pc], n2, look2).filter((k) => k.kind !== "label"),
          ...names([pa, pb, pc, pd, pe], [a, b, c, d, e], [0, 0]).filter((k) => k.kind === "label" && k.text !== c),
          { kind: "label", at: pc, text: c, dir: compassOf(pa[0] + pd[0] - pb[0] - pe[0], pa[1] + pd[1] - pb[1] - pe[1]), italic: true },
        ];
        const facts = extra.map((p) => factText(p, n1, n2, null));
        // The angle at C needs three letters, since C is a vertex of both triangles.
        const vang = (n: Names, i: number) => (i === 2 ? ang3(n, i) : ang(n, i));
        const fresh = (w: 0 | 1): Look => ({ ...partsLook(parts, null, w), fresh: { angles: [2] } });
        return {
          ...criterionChoice(
            cat(
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
            critOrder,
            parts,
            null,
            n1,
            n2,
            {
              first: (i) =>
                step(
                  i,
                  "use the vertical angles",
                  "用对顶角",
                  t(
                    `$\\angle ${a}${c}${b}$ and $\\angle ${d}${c}${e}$ face each other across the crossing at $${c}$, so $\\angle ${a}${c}${b} \\cong \\angle ${d}${c}${e}$ by the Vertical Angles Theorem. That is a third pair of congruent parts, though nothing marks it.\n\n{{figure 0}}`,
                    `$\\angle ${a}${c}${b}$ 与 $\\angle ${d}${c}${e}$ 隔着交点 $${c}$ 相对，由对顶角相等得 $\\angle ${a}${c}${b} \\cong \\angle ${d}${c}${e}$。这是第三组全等的部分，虽然图中没有标记。\n\n{{figure 0}}`,
                  ),
                ),
              how: (p) => (p === vertical ? t("Vertical Angles Theorem", "对顶角相等") : given(p)),
              angle: vang,
            },
          ),
          figure: figure(
            bowtie(partsLook(extra, null, 0), partsLook(extra, null, 1)),
            `Segments ${a}${d} and ${b}${e} crossing at ${c}, forming triangles ${a}${b}${c} and ${d}${e}${c}.`,
            `线段 ${a}${d} 与 ${b}${e} 相交于 ${c}，构成三角形 ${a}${b}${c} 与 ${d}${e}${c}。`,
          ),
          solutionFigures: [
            figure(
              bowtie(fresh(0), fresh(1)),
              `The same figure with the vertical angles at ${c} marked and highlighted.`,
              `同样的图形，${c} 处的对顶角已标出，并用另一种颜色显示。`,
            ),
          ],
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
  /** map applies the rule to a point. */
  readonly map: (p: XY) => XY;
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
    const [tex, map] = rng.pick<readonly [string, (p: XY) => XY]>([
      [`(x, y) \\to (${signed("x", h)}, ${signed("y", k)})`, ([x, y]) => [x + h, y + k]],
      [`(x, y) \\to (-y, x)`, ([x, y]) => [-y, x]],
      [`(x, y) \\to (y, -x)`, ([x, y]) => [y, -x]],
      [`(x, y) \\to (-x, -y)`, ([x, y]) => [-x, -y]],
      [`(x, y) \\to (x, -y)`, ([x, y]) => [x, -y]],
      [`(x, y) \\to (-x, y)`, ([x, y]) => [-x, y]],
      [`(x, y) \\to (y, x)`, ([x, y]) => [y, x]],
      [`(x, y) \\to (${signed("-x", h)}, y)`, ([x, y]) => [-x + h, y]],
      [`(x, y) \\to (${signed("y", h)}, ${signed("x", k)})`, ([x, y]) => [y + h, x + k]],
      [`(x, y) \\to (${signed("-y", h)}, ${signed("x", k)})`, ([x, y]) => [-y + h, x + k]],
      [`(x, y) \\to (${signed("x", h)}, ${signed("-y", k)})`, ([x, y]) => [x + h, -y + k]],
    ]);
    return { tex, map, rigid, why: keeps };
  }
  const f = rng.pick([2, 3, 4]);
  const [tex, map, why] = rng.pick<readonly [string, (p: XY) => XY, Text]>([
    [
      `(x, y) \\to (${f}x, ${f}y)`,
      ([x, y]) => [f * x, f * y],
      t(
        `It is a dilation with scale factor $${f}$: every length is multiplied by $${f}$.`,
        `它是比例因子为 $${f}$ 的位似：每条线段的长度都乘以 $${f}$。`,
      ),
    ],
    [
      `(x, y) \\to (${f}x, y)`,
      ([x, y]) => [f * x, y],
      t(
        `It stretches horizontally by a factor of $${f}$, so horizontal lengths change.`,
        `它在水平方向上伸长为原来的 $${f}$ 倍，水平方向的长度改变了。`,
      ),
    ],
    [
      `(x, y) \\to (x, ${f}y)`,
      ([x, y]) => [x, f * y],
      t(
        `It stretches vertically by a factor of $${f}$, so vertical lengths change.`,
        `它在竖直方向上伸长为原来的 $${f}$ 倍，竖直方向的长度改变了。`,
      ),
    ],
    [
      `(x, y) \\to (${signed(`${f}x`, h)}, ${signed(`${f}y`, k)})`,
      ([x, y]) => [f * x + h, f * y + k],
      t(
        `It multiplies every length by $${f}$ (a dilation followed by a translation).`,
        `它把每条线段的长度都乘以 $${f}$（先位似，再平移）。`,
      ),
    ],
    [
      `(x, y) \\to (-${f}x, ${f}y)`,
      ([x, y]) => [-f * x, f * y],
      t(`It multiplies every length by $${f}$, so the size changes.`, `它把每条线段的长度都乘以 $${f}$，大小改变了。`),
    ],
    [
      `(x, y) \\to (x + y, y)`,
      ([x, y]) => [x + y, y],
      t(
        "It slides each point sideways by its height (a shear): $(0, 0)$ and $(0, 1)$ are $1$ apart, but their images $(0, 0)$ and $(1, 1)$ are $\\sqrt{2}$ apart.",
        "它把每个点按其纵坐标横向移动（错切）：$(0, 0)$ 与 $(0, 1)$ 的距离是 $1$，而像 $(0, 0)$ 与 $(1, 1)$ 的距离是 $\\sqrt{2}$。",
      ),
    ],
  ]);
  return {
    tex,
    map,
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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSG.CO.B.6", "CCSS.HSG.CO.B.7"],
  intro: t(
    "Translations, rotations and reflections move a figure without stretching it: every length and every angle stays the same. Such transformations are **rigid motions**, and they give congruence its exact meaning: two figures are congruent when a sequence of rigid motions maps one onto the other. The criteria SSS, SAS, ASA, AAS and HL are shortcuts: they guarantee that such a motion exists without finding it.\n\nReflect $\\triangle ABC$ with $A(1, 1)$, $B(4, 1)$, $C(1, 3)$ across the $y$-axis by $(x, y) \\to (-x, y)$. The images are $A'(-1, 1)$, $B'(-4, 1)$ and $C'(-1, 3)$.\n\n{{figure 0}}\n\nThe lengths survive: $AB = 4 - 1 = 3$ and $A'B' = -1 - (-4) = 3$; $AC = 3 - 1 = 2$ and $A'C' = 3 - 1 = 2$. The motion sends $A$ to $A'$, $B$ to $B'$ and $C$ to $C'$, so $\\triangle ABC \\cong \\triangle A'B'C'$ with the vertices in that order, and each part of one triangle equals the part it is sent to. Mapping back confirms the motion: $(x, y) \\to (-x, y)$ sends $B'(-4, 1)$ to $(4, 1)$, which is $B$.",
    "平移、旋转和反射移动图形时不会拉伸它：每条线段的长度、每个角的大小都不变。这样的变换叫作**刚性变换**，它给全等以确切的含义：如果一系列刚性变换能把一个图形映到另一个图形上，这两个图形就全等。SSS、SAS、ASA、AAS、HL 这些判定是捷径：不必找出这样的变换，就能保证它存在。\n\n把 $\\triangle ABC$（$A(1, 1)$，$B(4, 1)$，$C(1, 3)$）按 $(x, y) \\to (-x, y)$ 关于 $y$ 轴反射，像为 $A'(-1, 1)$，$B'(-4, 1)$，$C'(-1, 3)$。\n\n{{figure 0}}\n\n长度保持不变：$AB = 4 - 1 = 3$，$A'B' = -1 - (-4) = 3$；$AC = 3 - 1 = 2$，$A'C' = 3 - 1 = 2$。变换把 $A$ 映到 $A'$，$B$ 映到 $B'$，$C$ 映到 $C'$，所以按这个顶点顺序 $\\triangle ABC \\cong \\triangle A'B'C'$，一个三角形的每个部分都等于它被映到的部分。映射回去可以验证这个变换：$(x, y) \\to (-x, y)$ 把 $B'(-4, 1)$ 映到 $(4, 1)$，正是 $B$。",
  ),
  introFigures: [
    movedPolygon(
      ["A", "B", "C"],
      [
        [1, 1],
        [4, 1],
        [1, 3],
      ],
      [
        [-1, 1],
        [-4, 1],
        [-1, 3],
      ],
      { kind: "flip", a: [0, 0], b: [0, 1] },
      1,
    ),
  ],
  knowledgePoints: [
    {
      id: "recognizing-rigid-motions",
      figure: geometryDrawings2["rigid-motions-and-congruence#recognizing-rigid-motions"],
      title: t("Rigid motions", "刚性变换"),
      explanation: t(
        "A **rigid motion** is a transformation that keeps every distance (and so every angle): translations, rotations, reflections, and any sequence of them.\n\nTwo figures are **congruent** exactly when a sequence of rigid motions maps one onto the other. Dilations with a scale factor other than $1$ and stretches change lengths, so they are not rigid motions.\n\n$(x, y) \\to (-y + 3, x)$ rotates $90^\\circ$ about the origin and then translates: rigid. $(x, y) \\to (2x, y)$ doubles horizontal lengths: not rigid.\n\n> **Watch out.** Keeping the shape is not enough. $(x, y) \\to (2x, 2y)$ keeps every angle, yet it doubles every length, so the image is similar to the original, not congruent. Test lengths, not the look of the shape.",
        "**刚性变换**是保持所有距离（因而也保持所有角度）不变的变换：平移、旋转、反射，以及它们的任意组合。\n\n两个图形**全等**，当且仅当存在一系列刚性变换把其中一个映到另一个上。比例因子不为 $1$ 的位似和伸缩会改变长度，所以不是刚性变换。\n\n$(x, y) \\to (-y + 3, x)$ 是先绕原点旋转 $90^\\circ$ 再平移：是刚性变换。$(x, y) \\to (2x, y)$ 把水平方向的长度加倍：不是刚性变换。\n\n> **注意。** 形状不变还不够。$(x, y) \\to (2x, 2y)$ 保持每个角不变，却把每条线段的长度加倍，所以像与原图形相似，而不全等。要检验长度，而不是看形状像不像。",
      ),
      generate(rng) {
        const rigid = rng.bool();
        const rule = pickRule(rng, rigid);
        const [n] = pickNames(rng);
        const test: readonly XY[] = [
          [0, 0],
          [1, 0],
          [0, 1],
        ];
        const [o, p, q] = test.map(rule.map) as [XY, XY, XY];
        const dist = (a: XY, b: XY) => {
          const d2 = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
          return Number.isInteger(Math.sqrt(d2)) ? String(Math.sqrt(d2)) : `\\sqrt{${d2}}`;
        };
        const images = `O'${pl(o)}, P'${pl(p)}, Q'${pl(q)}`;
        return choiceProblem({
          prompt: t(
            `$${triName(n)}$ is mapped by the rule $${rule.tex}$. Is the image necessarily congruent to $${triName(n)}$?`,
            `$${triName(n)}$ 按规则 $${rule.tex}$ 变换。像一定与 $${triName(n)}$ 全等吗？`,
          ),
          options: yesNo,
          correct: rigid ? 0 : 1,
          solution: paras(
            step(1, "read the rule", "读懂规则", rule.why),
            step(
              2,
              "answer",
              "作答",
              rigid
                ? t(
                    `Rigid motions map a figure onto a congruent one, so the image of $${triName(n)}$ is congruent to it: Yes.`,
                    `刚性变换把图形映成与它全等的图形，所以 $${triName(n)}$ 的像与它全等：是。`,
                  )
                : t(
                    `Since lengths change, the image of $${triName(n)}$ has sides of other lengths: No.`,
                    `长度改变了，$${triName(n)}$ 的像的边长与原来不同：否。`,
                  ),
            ),
            check(
              t(
                `Test the rule on the unit segments from $O(0, 0)$ to $P(1, 0)$ and to $Q(0, 1)$. The images are $${images}$, so $O'P' = ${dist(o, p)}$ and $O'Q' = ${dist(o, q)}$. `,
                `用从 $O(0, 0)$ 到 $P(1, 0)$、到 $Q(0, 1)$ 的单位线段检验规则。像为 $${images}$，所以 $O'P' = ${dist(o, p)}$，$O'Q' = ${dist(o, q)}$。`,
              ),
              rigid
                ? t("Both are still $1$, as a rigid motion requires.", "两者仍都是 $1$，符合刚性变换。")
                : t("At least one is no longer $1$, so the rule does not keep lengths.", "至少有一个不再是 $1$，所以这个规则不保持长度。"),
            ),
          ),
        });
      },
    },
    {
      id: "identifying-the-motion",
      figure: motionDrawings["identifying-the-motion"],
      title: t("Identifying the motion", "识别变换"),
      explanation: t(
        "To identify the rigid motion that maps a triangle onto its image, compare each vertex with its image:\n\n- every vertex moves by the same vector: a translation;\n- $(x, y) \\to (x, -y)$: a reflection across the $x$-axis;\n- $(x, y) \\to (-x, y)$: a reflection across the $y$-axis;\n- $(x, y) \\to (-y, x)$: a rotation of $90^\\circ$ counterclockwise about the origin;\n- $(x, y) \\to (-x, -y)$: a rotation of $180^\\circ$ about the origin.\n\n$A(2, 5) \\to A'(-5, 2)$ and $B(4, 1) \\to B'(-1, 4)$ follow $(x, y) \\to (-y, x)$: a $90^\\circ$ rotation.\n\n> **Watch out.** Test more than one vertex. $(3, 0) \\to (-3, 0)$ fits both a reflection across the $y$-axis and a $180^\\circ$ rotation; a second vertex such as $(1, 2) \\to (-1, 2)$ shows it is the reflection, since the rotation would give $(-1, -2)$.",
        "要找出把三角形映到它的像的刚性变换，逐个比较顶点和它的像：\n\n- 每个顶点都移动同一个向量：平移；\n- $(x, y) \\to (x, -y)$：关于 $x$ 轴的反射；\n- $(x, y) \\to (-x, y)$：关于 $y$ 轴的反射；\n- $(x, y) \\to (-y, x)$：绕原点逆时针旋转 $90^\\circ$；\n- $(x, y) \\to (-x, -y)$：绕原点旋转 $180^\\circ$。\n\n$A(2, 5) \\to A'(-5, 2)$，$B(4, 1) \\to B'(-1, 4)$，符合 $(x, y) \\to (-y, x)$：旋转 $90^\\circ$。\n\n> **注意。** 不要只看一个顶点。$(3, 0) \\to (-3, 0)$ 既符合关于 $y$ 轴的反射，也符合旋转 $180^\\circ$；再看一个顶点，如 $(1, 2) \\to (-1, 2)$，就知道是反射，因为旋转会得到 $(-1, -2)$。",
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
          const rules: Record<Motion, string> = {
            translation: `(x, y) \\to (${signed("x", shift[0])}, ${signed("y", shift[1])})`,
            reflectX: "(x, y) \\to (x, -y)",
            reflectY: "(x, y) \\to (-x, y)",
            rotate90: "(x, y) \\to (-y, x)",
            rotate180: "(x, y) \\to (-x, -y)",
          };
          // The inverse motion and its rule, to map a vertex back.
          const back: Record<Motion, [string, (p: XY) => XY]> = {
            translation: [`(x, y) \\to (${signed("x", -shift[0])}, ${signed("y", -shift[1])})`, ([x, y]) => [x - shift[0], y - shift[1]]],
            reflectX: [rules.reflectX, ([x, y]) => [x, -y]],
            reflectY: [rules.reflectY, ([x, y]) => [-x, y]],
            rotate90: ["(x, y) \\to (y, -x)", ([x, y]) => [y, -x]],
            rotate180: [rules.rotate180, ([x, y]) => [-x, -y]],
          };
          const [backRule, backMap] = back[motion];
          const home = backMap(image[1]!);
          const vec = (i: number): XY => [image[i]![0] - pts[i]![0], image[i]![1] - pts[i]![1]];
          const v0 = vec(0);
          const name = motionNames[motion];
          const lower = (x: Text) => t(x.en.replace(/^A /, "a "), x["zh-CN"]);
          const why = (other: Motion): Text => {
            if (other === "translation") {
              const i = [1, 2].find((j) => vec(j)[0] !== v0[0] || vec(j)[1] !== v0[1]) ?? 1;
              return t(
                `A translation moves every vertex by the same vector, but $${n[0]}$ moves by $${pl(v0)}$ and $${n[i]}$ by $${pl(vec(i))}$.`,
                `平移使每个顶点移动同一个向量，但 $${n[0]}$ 移动了 $${pl(v0)}$，$${n[i]}$ 移动了 $${pl(vec(i))}$。`,
              );
            }
            const i = [0, 1, 2].find((j) => {
              const q = applyMotion(other, pts[j]!, shift);
              return q[0] !== image[j]![0] || q[1] !== image[j]![1];
            })!;
            const q = applyMotion(other, pts[i]!, shift);
            return t(
              `It would send $${n[i]}${pl(pts[i]!)}$ to $${pl(q)}$, but $${primes[i]}$ is $${pl(image[i]!)}$.`,
              `它会把 $${n[i]}${pl(pts[i]!)}$ 映到 $${pl(q)}$，但 $${primes[i]}$ 是 $${pl(image[i]!)}$。`,
            );
          };
          const drawn =
            motion === "translation"
              ? ({ kind: "slide" } as const)
              : motion === "reflectX"
                ? ({ kind: "flip", a: [0, 0], b: [1, 0] } as const)
                : motion === "reflectY"
                  ? ({ kind: "flip", a: [0, 0], b: [0, 1] } as const)
                  : ({ kind: "turn", degrees: motion === "rotate90" ? 90 : 180, center: [0, 0], centerName: "O" } as const);
          const each = [0, 1, 2].map((i) => `${n[i]}${pl(pts[i]!)} \\to ${primes[i]}${pl(image[i]!)}`).join(",\\ ");
          return {
            ...reasoned(
              choiceProblem({
                prompt: t(
                  `A rigid motion maps $${triName(n)}$ with $${listed(pts, n)}$ onto $\\triangle ${primes.join("")}$ with $${listed(image, primes)}$. Which motion is it?`,
                  `一个刚性变换把 $${triName(n)}$（$${listed(pts, n)}$）映到 $\\triangle ${primes.join("")}$（$${listed(image, primes)}$）。这是哪种变换？`,
                ),
                options: motionOrder.map((x) => motionNames[x]),
                correct: motionOrder.indexOf(motion),
                solution: paras(
                  step(
                    1,
                    "compare a vertex with its image",
                    "比较一个顶点和它的像",
                    t(
                      `$${n[0]}${pl(a)} \\to ${primes[0]}${pl(image[0]!)}$ fits the rule $${rules[motion]}$.`,
                      `$${n[0]}${pl(a)} \\to ${primes[0]}${pl(image[0]!)}$ 符合规则 $${rules[motion]}$。`,
                    ),
                  ),
                  step(
                    2,
                    "test the other vertices",
                    "检验其他顶点",
                    t(
                      `The same rule gives every image: $${each}$. So it is ${lower(name).en}.\n\n{{figure 0}}`,
                      `同一个规则给出每个像：$${each}$。所以这是${name["zh-CN"]}。\n\n{{figure 0}}`,
                    ),
                  ),
                  check(
                    t(
                      `Map a vertex back with the inverse motion $${backRule}$: it sends $${primes[1]}${pl(image[1]!)}$ to $${pl(home)}$, which is $${n[1]}$.`,
                      `用逆变换 $${backRule}$ 把一个顶点映回去：它把 $${primes[1]}${pl(image[1]!)}$ 映到 $${pl(home)}$，正是 $${n[1]}$。`,
                    ),
                  ),
                ),
              }),
              motionOrder.filter((x) => x !== motion).map((x) => [motionNames[x].en, why(x).en, why(x)["zh-CN"]] as const),
            ),
            figure: {
              svg: plane({ xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 }, [...tri(pts, n, false), ...tri(image, primes, true)]),
              alt: t(
                `Triangle ${n.join("")} and its image ${primes.join("")} on a coordinate grid.`,
                `坐标网格上的三角形 ${n.join("")} 及其像 ${primes.join("")}。`,
              ),
            },
            solutionFigures: [movedPolygon(n, pts, image, drawn)],
          };
        }
      },
    },
    {
      id: "corresponding-parts-of-images",
      figure: congruenceDrawings["corresponding-parts-of-images"],
      title: t("Corresponding parts", "对应部分"),
      explanation: t(
        "When a rigid motion maps $\\triangle ABC$ onto $\\triangle DEF$, each vertex goes to a vertex, and each side and angle goes to the side or angle between the images. The image has the same lengths and angles.\n\nIf the motion maps $A$ to $F$, $B$ to $D$ and $C$ to $E$, then $\\overline{AB}$ goes to $\\overline{FD}$. With $AB = 2x + 1$ and $FD = 13$: $2x + 1 = 13$, so $x = 6$.\n\n> **Watch out.** Follow the motion, not the alphabet. $A$ goes to $F$ here, so $\\overline{AB}$ pairs with $\\overline{FD}$, not with $\\overline{DE}$, even though $D$ and $E$ come first.",
        "刚性变换把 $\\triangle ABC$ 映到 $\\triangle DEF$ 时，每个顶点映到一个顶点，每条边和每个角映到像点之间的边和角，长度和角度都不变。\n\n若变换把 $A$ 映到 $F$，$B$ 映到 $D$，$C$ 映到 $E$，则 $\\overline{AB}$ 映到 $\\overline{FD}$。若 $AB = 2x + 1$，$FD = 13$，则 $2x + 1 = 13$，$x = 6$。\n\n> **注意。** 要按变换配对，而不是按字母顺序。这里 $A$ 映到 $F$，所以 $\\overline{AB}$ 对应 $\\overline{FD}$，而不是 $\\overline{DE}$，尽管 $D$、$E$ 排在前面。",
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
          const [p, q] = [nx(k), nx(k, 2)];
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
            solution: paras(
              step(
                1,
                "follow the endpoints",
                "跟踪端点",
                t(
                  `$\\overline{${sideName(n1, k)}}$ joins $${n1[p]}$ and $${n1[q]}$, which go to $${n2[p]}$ and $${n2[q]}$, so it goes to $\\overline{${sideName(n2, k)}}$. A rigid motion keeps lengths, so $${sideName(n1, k)} = ${sideName(n2, k)} = ${sides[k]}$.`,
                  `$\\overline{${sideName(n1, k)}}$ 连接 $${n1[p]}$ 和 $${n1[q]}$，它们映到 $${n2[p]}$ 和 $${n2[q]}$，所以这条边映到 $\\overline{${sideName(n2, k)}}$。刚性变换保持长度不变，所以 $${sideName(n1, k)} = ${sideName(n2, k)} = ${sides[k]}$。`,
                ),
              ),
              step(2, "solve", "解方程", t(`Set the expression equal to $${sides[k]}$:`, `令式子等于 $${sides[k]}$：`), solveSteps(u)),
              check(
                t(
                  `With $x = ${u.x}$, $${sideName(n1, k)} = ${substituted(u)}$, the length of $\\overline{${sideName(n2, k)}}$. Mapping back, $${n2[p]}$ and $${n2[q]}$ return to $${n1[p]}$ and $${n1[q]}$, so this is the side the motion carried, not another side of the image.`,
                  `当 $x = ${u.x}$ 时，$${sideName(n1, k)} = ${substituted(u)}$，等于 $\\overline{${sideName(n2, k)}}$ 的长度。映射回去，$${n2[p]}$ 和 $${n2[q]}$ 回到 $${n1[p]}$ 和 $${n1[q]}$，所以这正是变换带过去的那条边，而不是像中的另一条边。`,
                ),
              ),
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
          solution: paras(
            step(
              1,
              "follow the vertex",
              "跟踪顶点",
              t(
                `The motion sends $${n1[k]}$ to $${n2[k]}$, so $${ang(n1, k)}$ goes to $${ang(n2, k)}$. A rigid motion keeps angles, so $m${ang(n1, k)} = m${ang(n2, k)} = ${angles[k]}^\\circ$.`,
                `变换把 $${n1[k]}$ 映到 $${n2[k]}$，所以 $${ang(n1, k)}$ 映到 $${ang(n2, k)}$。刚性变换保持角度不变，所以 $m${ang(n1, k)} = m${ang(n2, k)} = ${angles[k]}^\\circ$。`,
              ),
            ),
            step(
              2,
              "solve",
              "解方程",
              t(`Set $${linear(u.c, u.d)} = ${angles[k]}$:`, `令 $${linear(u.c, u.d)} = ${angles[k]}$：`),
              solveSteps(u),
            ),
            check(
              t(
                `With $x = ${u.x}$, $${substituted(u)}$, so $m${ang(n1, k)} = ${angles[k]}^\\circ = m${ang(n2, k)}$. Mapping back, $${n2[k]}$ returns to $${n1[k]}$, so this is the angle the motion carried, not another angle of the image.`,
                `当 $x = ${u.x}$ 时，$${substituted(u)}$，所以 $m${ang(n1, k)} = ${angles[k]}^\\circ = m${ang(n2, k)}$。映射回去，$${n2[k]}$ 回到 $${n1[k]}$，所以这正是变换带过去的那个角，而不是像中的另一个角。`,
              ),
            ),
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

/** chainFigure draws the segments AB, CD and EF of the introduction, AB of length 5 and congruent to CD; with all, EF is marked congruent too, in the result color. */
function chainFigure(all: boolean): Figure {
  const rows: readonly (readonly [string, string, Point, Point])[] = [
    ["A", "B", [0, 2], [4, 2]],
    ["C", "D", [1, 1], [5, 1]],
    ["E", "F", [0.5, 0], [4.5, 0]],
  ];
  const marks: Mark[] = rows.flatMap(([p, q, a, b], i): Mark[] => {
    const shown = i < 2 || all;
    return [
      { kind: "segment", a, b, ...(i === 2 && all && { tone: "result" as const }) },
      ...(shown ? [{ kind: "ticks", a, b, count: 1 } as const] : []),
      ...(i === 0 ? [{ kind: "side", a: b, b: a, text: "5" } as const] : []),
      { kind: "label", at: a, text: p, dir: "w", italic: true },
      { kind: "label", at: b, text: q, dir: "e", italic: true },
    ];
  });
  return all
    ? figure(
        marks,
        "Segments AB, CD and EF, each with one tick; AB is labeled 5 and EF is highlighted.",
        "线段 AB、CD、EF 各有一条短线；AB 标着 5，EF 用另一种颜色标出。",
      )
    : figure(
        marks,
        "Segments AB, CD and EF; AB, labeled 5, and CD each carry one tick.",
        "线段 AB、CD、EF；标着 5 的 AB 与 CD 各有一条短线。",
      );
}

export const propertiesOfCongruence: TopicDef = {
  id: "properties-of-congruence",
  title: t("Properties of Congruence", "全等的性质"),
  summary: t(
    "Use the reflexive, symmetric and transitive properties of congruence, and rewrite congruence statements.",
    "运用全等的自反性、对称性和传递性，并改写全等式。",
  ),
  prerequisites: ["the-asa-congruence-criterion"],
  encompasses: [{ topic: "equations-with-variables-on-both-sides", weight: 0.2 }],
  xp: 11,
  standards: ["CCSS.HSG.CO.C.9"],
  intro: t(
    "Congruent segments have equal lengths and congruent angles equal measures, so congruence behaves much like equality. Three of its rules come up again and again as the reasons for steps in a proof: every figure is congruent to itself (**reflexive**), a congruence can be read from either end (**symmetric**), and two congruences through a common figure combine into one (**transitive**).\n\nSuppose $\\overline{AB} \\cong \\overline{CD}$, with $AB = 5$.\n\n{{figure 0}}\n\nIf also $\\overline{CD} \\cong \\overline{EF}$, then $\\overline{AB}$ and $\\overline{EF}$ are both congruent to $\\overline{CD}$, so $\\overline{AB} \\cong \\overline{EF}$ by the Transitive Property, and $EF = AB = 5$.\n\n{{figure 1}}\n\nRead from the other end, the same fact is $\\overline{EF} \\cong \\overline{AB}$, by the Symmetric Property; and $\\overline{AB} \\cong \\overline{AB}$ by the Reflexive Property, as for any segment.",
    "全等线段长度相等，全等角度数相等，所以全等关系很像相等关系。它有三条规律，在证明中常被用作步骤的理由：任何图形都与自身全等（**自反性**），全等关系可以从任一边读起（**对称性**），通过同一个图形连起来的两个全等关系可以合成一个（**传递性**）。\n\n设 $\\overline{AB} \\cong \\overline{CD}$，$AB = 5$。\n\n{{figure 0}}\n\n若又有 $\\overline{CD} \\cong \\overline{EF}$，则 $\\overline{AB}$ 与 $\\overline{EF}$ 都与 $\\overline{CD}$ 全等，由传递性 $\\overline{AB} \\cong \\overline{EF}$，所以 $EF = AB = 5$。\n\n{{figure 1}}\n\n从另一边读，同一个事实就是 $\\overline{EF} \\cong \\overline{AB}$，依据是对称性；而由自反性，$\\overline{AB} \\cong \\overline{AB}$，任何线段都是如此。",
  ),
  introFigures: [chainFigure(false), chainFigure(true)],
  knowledgePoints: [
    {
      id: "naming-the-property",
      title: t("The three properties", "三条性质"),
      explanation: t(
        "Congruence of segments, angles and triangles has three properties:\n\n- **Reflexive**: every figure is congruent to itself, $\\overline{AB} \\cong \\overline{AB}$.\n- **Symmetric**: a congruence can be read either way: if $\\angle P \\cong \\angle Q$, then $\\angle Q \\cong \\angle P$.\n- **Transitive**: figures congruent to the same figure are congruent to each other: if $\\triangle ABC \\cong \\triangle DEF$ and $\\triangle DEF \\cong \\triangle GHJ$, then $\\triangle ABC \\cong \\triangle GHJ$.\n\n> **Watch out.** The symmetric and transitive properties both start with “if”, so count the figures. The symmetric property has two figures and turns one congruence around; the transitive property has three figures and two congruences that share the middle one.",
        "线段、角和三角形的全等关系有三条性质：\n\n- **自反性**：任何图形都与自身全等，$\\overline{AB} \\cong \\overline{AB}$。\n- **对称性**：全等关系可以交换两边：若 $\\angle P \\cong \\angle Q$，则 $\\angle Q \\cong \\angle P$。\n- **传递性**：与同一个图形全等的两个图形彼此全等：若 $\\triangle ABC \\cong \\triangle DEF$，$\\triangle DEF \\cong \\triangle GHJ$，则 $\\triangle ABC \\cong \\triangle GHJ$。\n\n> **注意。** 对称性和传递性都以“若”开头，所以要数一数图形的个数。对称性涉及两个图形，把一个全等关系反过来；传递性涉及三个图形，两个全等关系共用中间那个图形。",
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
        const count: Record<Property, Text> = {
          reflexive: t(`The statement has one figure, $${x}$, on both sides.`, `这个结论只有一个图形 $${x}$，它出现在两边。`),
          symmetric: t(
            `The statement has two figures, $${x}$ and $${y}$, and one congruence written first one way, then the other.`,
            `这个结论有两个图形 $${x}$ 和 $${y}$，同一个全等关系先正着写，再反着写。`,
          ),
          transitive: t(
            `The statement has three figures, and $${y}$ appears in both congruences of the “if” part.`,
            `这个结论有三个图形，$${y}$ 在“若”部分的两个全等关系中都出现。`,
          ),
        };
        const why: Record<Property, Text> = {
          reflexive: t("A figure is congruent to itself.", "图形与自身全等。"),
          symmetric: t("The same congruence is read in the other direction.", "同一个全等关系换了个方向来写。"),
          transitive: t(
            `Two figures congruent to the same figure $${y}$ are congruent to each other.`,
            `两个图形都与同一个图形 $${y}$ 全等，所以它们彼此全等。`,
          ),
        };
        const pattern: Record<Property, Text> = {
          reflexive: t("the reflexive pattern $F_1 \\cong F_1$", "自反性的形式 $F_1 \\cong F_1$"),
          symmetric: t(
            "the symmetric pattern “if $F_1 \\cong F_2$, then $F_2 \\cong F_1$”",
            "对称性的形式“若 $F_1 \\cong F_2$，则 $F_2 \\cong F_1$”",
          ),
          transitive: t(
            "the transitive pattern “if $F_1 \\cong F_2$ and $F_2 \\cong F_3$, then $F_1 \\cong F_3$”",
            "传递性的形式“若 $F_1 \\cong F_2$，$F_2 \\cong F_3$，则 $F_1 \\cong F_3$”",
          ),
        };
        const letters =
          prop === "reflexive"
            ? `F_1 = ${x}`
            : prop === "symmetric"
              ? `F_1 = ${x},\\ F_2 = ${y}`
              : `F_1 = ${x},\\ F_2 = ${y},\\ F_3 = ${z}`;
        return reasoned(
          choiceProblem({
            prompt: cat(t("Which property justifies the statement?", "下面的结论依据的是哪条性质？"), "\n\n", statement),
            options: propertyOrder.map((p) => propertyNames[p]),
            correct: propertyOrder.indexOf(prop),
            solution: paras(
              step(1, "count the figures", "数图形", count[prop]),
              step(
                2,
                "name the property",
                "说出性质",
                cat(why[prop], t(` This is the ${propertyNames[prop].en}.`, `这是${propertyNames[prop]["zh-CN"]}。`)),
              ),
              check(
                t("Put $", "取 $"),
                letters,
                t("$ in ", "$，代入"),
                pattern[prop],
                t(": it gives exactly the statement.", "，正好得到这个结论。"),
              ),
            ),
          }),
          [
            [
              propertyNames.reflexive.en,
              "The reflexive property is about a figure and itself, and this statement involves different figures.",
              "自反性说的是图形与它自身，而这个命题涉及不同的图形。",
            ],
            [
              propertyNames.symmetric.en,
              prop === "reflexive"
                ? "The symmetric property turns around a congruence between two figures, and this statement has only one figure."
                : "The symmetric property turns around one congruence between two figures, and this statement links three figures.",
              prop === "reflexive"
                ? "对称性是把两个图形之间的全等关系反过来，而这个命题只有一个图形。"
                : "对称性是把两个图形之间的一个全等关系反过来，而这个命题连接了三个图形。",
            ],
            [
              propertyNames.transitive.en,
              "The transitive property chains two congruences through a third figure, and this statement has no such chain.",
              "传递性是通过第三个图形把两个全等关系连起来，而这个命题没有这样的链。",
            ],
          ],
        );
      },
    },
    {
      id: "rewriting-congruence-statements",
      figure: geometryDrawings2["properties-of-congruence#rewriting-congruence-statements"],
      title: t("Rewriting congruence statements", "改写全等式"),
      explanation: t(
        "A congruence statement may list the vertices in any order, as long as corresponding vertices keep the same positions. By the symmetric property, the two triangles may also swap sides.\n\nFrom $\\triangle ABC \\cong \\triangle DEF$: $\\triangle BCA \\cong \\triangle EFD$ and $\\triangle FDE \\cong \\triangle CAB$ are both true, but $\\triangle BCA \\cong \\triangle DEF$ is not, since it pairs $B$ with $D$.\n\n> **Watch out.** Reorder both triangles the same way. Moving the letters of one triangle but not the other, as in $\\triangle BCA \\cong \\triangle DEF$, breaks the pairing of the vertices.",
        "全等式中顶点可以按任意顺序写，只要对应顶点保持相同的位置。由对称性，两个三角形还可以交换左右。\n\n由 $\\triangle ABC \\cong \\triangle DEF$：$\\triangle BCA \\cong \\triangle EFD$ 和 $\\triangle FDE \\cong \\triangle CAB$ 都正确，但 $\\triangle BCA \\cong \\triangle DEF$ 不正确，因为它把 $B$ 与 $D$ 配对。\n\n> **注意。** 两个三角形的字母要按同样的方式重排。只移动一个三角形的字母而不动另一个，如 $\\triangle BCA \\cong \\triangle DEF$，就破坏了顶点的对应关系。",
      ),
      generate(rng) {
        const [n1, n2] = pickNames(rng);
        const pi = rng.pick(perms.slice(1));
        const write = (p: readonly number[], q: readonly number[], swap: boolean) =>
          swap ? `${triName(n2, q)} \\cong ${triName(n1, p)}` : `${triName(n1, p)} \\cong ${triName(n2, q)}`;
        const rightSwap = rng.bool();
        const right = m(write(pi, pi, rightSwap));
        const others = rng.sample(
          perms.filter((s) => s.join() !== pi.join()),
          3,
        );
        const wrongs = others.map((s) => m(write(pi, s, rng.bool())));
        const options = [right, ...wrongs];
        const shuffled = rng.shuffle(options);
        const pairs = (q: readonly number[]) => [0, 1, 2].map((j) => `${n1[pi[j]!]} \\leftrightarrow ${n2[q[j]!]}`).join(",\\ ");
        const mismatch = (s: readonly number[]): Text => {
          const j = [0, 1, 2].find((i) => s[i] !== pi[i])!;
          const [a, b, c] = [n1[pi[j]!], n2[s[j]!], n2[pi[j]!]];
          return t(
            `It puts $${a}$ and $${b}$ in the same position, but $${a}$ corresponds to $${c}$.`,
            `它把 $${a}$ 与 $${b}$ 放在同一位置，但 $${a}$ 对应的是 $${c}$。`,
          );
        };
        return reasoned(
          choiceProblem({
            prompt: t(
              `$${triName(n1)} \\cong ${triName(n2)}$. Which statement is also true?`,
              `$${triName(n1)} \\cong ${triName(n2)}$。下面哪个全等式也正确？`,
            ),
            options: shuffled,
            correct: shuffled.indexOf(right),
            solution: paras(
              step(
                1,
                "read the correspondence",
                "读出对应关系",
                t(
                  `The given statement pairs the vertices by position: $${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$.`,
                  `已知的全等式按位置配对顶点：$${[0, 1, 2].map((v) => `${n1[v]} \\leftrightarrow ${n2[v]}`).join(",\\ ")}$。`,
                ),
              ),
              step(
                2,
                "test the statements",
                "检验各个全等式",
                t(
                  `Only ${right.en} keeps every vertex in the same position as its partner; each of the other statements puts some vertex opposite a vertex that does not correspond to it.`,
                  `只有 ${right["zh-CN"]} 使每个顶点都与它的对应顶点位置相同；其他全等式中都有顶点与不对应的顶点放在了同一位置。`,
                ),
              ),
              check(
                t(
                  `Read the pairs off ${right.en} position by position: $${pairs(pi)}$, the same three pairs as in the given statement${rightSwap ? ", with the triangles swapped, which the Symmetric Property allows" : ""}.`,
                  `逐个位置读出 ${right["zh-CN"]} 中的配对：$${pairs(pi)}$，与已知全等式的三组配对相同${rightSwap ? "，只是两个三角形交换了左右，这是对称性允许的" : ""}。`,
                ),
              ),
            ),
          }),
          others.map((s, w) => [wrongs[w]!.en, mismatch(s).en, mismatch(s)["zh-CN"]] as const),
        );
      },
    },
    {
      id: "chains-of-congruence",
      title: t("Chains of congruence", "全等的传递"),
      explanation: t(
        "The transitive property links congruences into a chain: if $\\overline{AB} \\cong \\overline{CD}$ and $\\overline{CD} \\cong \\overline{EF}$, then $\\overline{AB} \\cong \\overline{EF}$, so $AB = EF$.\n\nWith $AB = 3x - 4$ and $EF = x + 10$: $3x - 4 = x + 10$, so $2x = 14$ and $x = 7$.\n\n> **Watch out.** Set the two ends of the chain equal, $AB = EF$. The middle segment $\\overline{CD}$ carries no expression; its length comes only after solving: $CD = AB = 3 \\cdot 7 - 4 = 17$.",
        "传递性把全等关系连成一条链：若 $\\overline{AB} \\cong \\overline{CD}$，$\\overline{CD} \\cong \\overline{EF}$，则 $\\overline{AB} \\cong \\overline{EF}$，所以 $AB = EF$。\n\n若 $AB = 3x - 4$，$EF = x + 10$，则 $3x - 4 = x + 10$，$2x = 14$，$x = 7$。\n\n> **注意。** 要让链的两端相等，即 $AB = EF$。中间的线段 $\\overline{CD}$ 没有给出式子，它的长度要解出 $x$ 之后才知道：$CD = AB = 3 \\cdot 7 - 4 = 17$。",
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
          const measure = (f: string) => (angle ? `m${f}` : f.replace(/\\overline\{(.*)\}/, "$1"));
          const expr = (c: number, d: number) => (angle ? `(${linear(c, d)})^\\circ` : linear(c, d));
          const reversed = !rng.bool();
          const second = reversed ? `${r} \\cong ${q}` : `${q} \\cong ${r}`;
          const big = c1 > c2;
          const collected = big ? `${linear(c1 - c2, 0)} = ${d2 - d1}` : `${d1 - d2} = ${linear(c2 - c1, 0)}`;
          const unit = angle ? "^\\circ" : "";
          const at = (c: number, d: number) =>
            `${c === 1 ? "" : `${c} \\cdot `}${x}${d === 0 ? "" : ` ${d < 0 ? "-" : "+"} ${Math.abs(d)}`}`;
          return numberProblem({
            prompt: t(
              `$${p} \\cong ${q}$ and $${second}$. If $${measure(p)} = ${expr(c1, d1)}$ and $${measure(r)} = ${expr(c2, d2)}$, find $x$.`,
              `$${p} \\cong ${q}$，$${second}$。若 $${measure(p)} = ${expr(c1, d1)}$，$${measure(r)} = ${expr(c2, d2)}$，求 $x$。`,
            ),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [intOr(d2 - d1, c1 + c2, -x), -x, value, intOr(d1 - d2, c1 - c2, x + 1) === x ? x + 1 : intOr(d1 - d2, c1 - c2, x + 1)],
            solution: paras(
              step(
                1,
                "chain the congruences",
                "把全等关系连起来",
                reversed
                  ? t(
                      `$${r} \\cong ${q}$ gives $${q} \\cong ${r}$ by the Symmetric Property. With $${p} \\cong ${q}$, the Transitive Property gives $${p} \\cong ${r}$, so $${measure(p)} = ${measure(r)}$.`,
                      `由对称性，$${r} \\cong ${q}$ 得 $${q} \\cong ${r}$。再与 $${p} \\cong ${q}$ 合起来，由传递性得 $${p} \\cong ${r}$，所以 $${measure(p)} = ${measure(r)}$。`,
                    )
                  : t(
                      `$${p} \\cong ${q}$ and $${q} \\cong ${r}$ share $${q}$, so the Transitive Property gives $${p} \\cong ${r}$, and $${measure(p)} = ${measure(r)}$.`,
                      `$${p} \\cong ${q}$ 与 $${q} \\cong ${r}$ 共用 $${q}$，由传递性得 $${p} \\cong ${r}$，所以 $${measure(p)} = ${measure(r)}$。`,
                    ),
              ),
              step(
                2,
                "solve",
                "解方程",
                t("Set the two expressions equal:", "令两个式子相等："),
                steps(`${linear(c1, d1)} = ${linear(c2, d2)}`, ...(Math.abs(c1 - c2) === 1 ? [] : [collected]), `x = ${x}`),
              ),
              check(
                t(
                  `With $x = ${x}$, $${measure(p)} = ${at(c1, d1)} = ${value}${unit}$ and $${measure(r)} = ${at(c2, d2)} = ${value}${unit}$: the ends of the chain agree, and so $${measure(q)} = ${value}${unit}$ too.`,
                  `当 $x = ${x}$ 时，$${measure(p)} = ${at(c1, d1)} = ${value}${unit}$，$${measure(r)} = ${at(c2, d2)} = ${value}${unit}$：链的两端相等，所以 $${measure(q)} = ${value}${unit}$ 也成立。`,
                ),
              ),
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

/** criteria are the reasons that prove two triangles congruent. */
const criteria: readonly Reason[] = ["sss", "sas", "asa", "aas", "hl"];

/** does says what each reason other than Given states, as a clause. */
const does: Record<Exclude<Reason, "given">, Text> = {
  defMid: t("a midpoint splits its segment into two congruent halves", "中点把它所在的线段分成两条全等的线段"),
  defBis: t("a bisector splits its angle into two congruent angles", "角平分线把角分成两个全等的角"),
  defPerp: t("perpendicular lines meet at right angles", "互相垂直的两条线相交成直角"),
  rightCong: t("any two right angles are congruent", "任意两个直角都全等"),
  vertical: t("the angles that face each other across a crossing are congruent", "两线相交时，隔着交点相对的两个角全等"),
  aia: t("parallel lines cut by a transversal make congruent alternate interior angles", "两条平行线被截线所截，内错角全等"),
  reflexive: t("a figure is congruent to itself", "图形与自身全等"),
  sss: t("three pairs of congruent sides make two triangles congruent", "三组边分别全等的两个三角形全等"),
  sas: t(
    "two pairs of congruent sides with the congruent angles between them make two triangles congruent",
    "两边及其夹角分别全等的两个三角形全等",
  ),
  asa: t(
    "two pairs of congruent angles with the congruent sides between them make two triangles congruent",
    "两角及其夹边分别全等的两个三角形全等",
  ),
  aas: t(
    "two pairs of congruent angles and a pair of congruent sides not between them make two triangles congruent",
    "两角及其中一角的对边分别全等的两个三角形全等",
  ),
  hl: t(
    "right triangles with congruent hypotenuses and a pair of congruent legs are congruent",
    "斜边和一条直角边分别全等的两个直角三角形全等",
  ),
  cpctc: t("triangles already proved congruent have congruent corresponding parts", "已证全等的三角形，对应部分全等"),
};

/** altWhy says why a wrong statement does not follow by a reason, for the reasons whose steps offer wrong statements. */
const altWhy: Partial<Record<Reason, Text>> = {
  defMid: t(
    "The midpoint only splits its own segment into two halves, and these are not the two halves of one segment.",
    "中点只把它所在的那条线段分成两半，而这两条线段不是同一条线段的两半。",
  ),
  defBis: t(
    "The bisector only splits its own angle into two halves, and these are not the two halves of that angle.",
    "角平分线只把它所平分的那个角分成两半，而这两个部分不是那个角的两半。",
  ),
  defPerp: t(
    "Perpendicular lines make right angles at the point where they meet, and this statement does not name both angles there as right angles.",
    "垂直的两条线在交点处成直角，而这个结论没有说交点处的两个角都是直角。",
  ),
  rightCong: t(
    "The theorem pairs two right angles, and these angles are not both right angles.",
    "这条定理配对的是两个直角，而这两个角并不都是直角。",
  ),
  vertical: t(
    "Vertical angles face each other across the crossing, and these angles do not.",
    "对顶角是隔着交点相对的两个角，而这两个角不是。",
  ),
  aia: t(
    "Alternate interior angles lie at the two ends of the transversal, between the parallel segments and on opposite sides of the transversal, and these angles do not.",
    "内错角位于截线的两端，在两条平行线段之间，且分在截线两侧，而这两个角不是。",
  ),
  cpctc: t(
    "CPCTC only pairs parts in the same places of the congruence statement, and these parts are not in the same places.",
    "对应部分必须在全等式中处于相同位置，而这两个部分的位置不同。",
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
  /** base draws the figure without any marks of congruence. */
  readonly base: readonly Mark[];
  readonly alt: readonly [string, string];
  /** parts are the steps that give the three pairs of parts the criterion uses. */
  readonly parts: readonly number[];
}

/** highlighted draws a mark in the result color: a tick or arrow mark over its segment drawn in that color. */
export function highlighted(k: Mark): Mark[] {
  if (k.kind === "ticks" || k.kind === "arrows") return [{ kind: "segment", a: k.a, b: k.b, tone: "result" }, k];
  if (k.kind === "arc") return [{ ...k, tone: "result" }];
  return [k];
}

/** proofFigures draws a proof: the problem's figure with the given facts, and one figure for each step that adds marks, with them highlighted; at maps a step to its figure. */
export function proofFigures(proof: {
  readonly steps: readonly Pick<ProofStep, "marks" | "drawn">[];
  readonly base: readonly Mark[];
  readonly alt: readonly [string, string];
}): { figure: Figure; steps: Figure[]; at: Map<number, number> } {
  const drawn = proof.steps.filter((s) => s.drawn).flatMap((s) => s.marks ?? []);
  const [en, zh] = proof.alt;
  const steps: Figure[] = [];
  const at = new Map<number, number>();
  const added: Mark[] = [];
  proof.steps.forEach((s, i) => {
    if (s.drawn || !s.marks) return;
    at.set(i, steps.length);
    steps.push(
      figure(
        [...proof.base, ...drawn, ...added, ...s.marks.flatMap(highlighted)],
        `${en} The marks added by step ${i + 1} are highlighted.`,
        `${zh}第 ${i + 1} 步新增的标记用另一种颜色显示。`,
      ),
    );
    added.push(...s.marks);
  });
  return { figure: figure([...proof.base, ...drawn], en, zh), steps, at };
}

/** cap starts a sentence with a capital letter. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** proofProblem asks for the reason, or the statement, of one step of a proof. */
function proofProblem(rng: Rng, proof: Proof): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [target, k] = rng.pick(eligible);
  const askStatement = target.alts !== undefined && target.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  let wrongWhy: (readonly [string, string, string])[];
  const r = target.r as Exclude<Reason, "given">;
  if (askStatement) {
    options = [target.s, ...rng.sample(target.alts!, Math.min(3, target.alts!.length))];
    const why = altWhy[r]!;
    wrongWhy = options.slice(1).map((o) => [o.en, why.en, why["zh-CN"]] as const);
  } else {
    const others = reasonKeys.filter((x) => x !== target.r && !(alike[target.r] ?? []).includes(x));
    const picked = rng.sample(others, 3);
    options = [reasons[target.r], ...picked.map((x) => reasons[x])];
    wrongWhy = picked.map((x) => {
      if (x === "given")
        return [
          reasons.given.en,
          `Step ${k + 1} is not one of the given facts; it has to be derived from them.`,
          `第 ${k + 1} 步不是已知条件，而是要由已知推出来的。`,
        ] as const;
      if (criteria.includes(x) && criteria.includes(target.r))
        return [
          reasons[x].en,
          `It needs ${critNeeds[x as Crit].en}, but the earlier steps give ${critNeeds[target.r as Crit].en}.`,
          `它需要${critNeeds[x as Crit]["zh-CN"]}，而前面各步给出的是${critNeeds[target.r as Crit]["zh-CN"]}。`,
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
  const c = proof.steps.findIndex((s) => criteria.includes(s.r));
  const tri = proof.steps[c]!;
  const last = proof.steps[proof.steps.length - 1]!;
  const crit = tri.r as Crit;
  const partText = (i: number) => {
    const s = proof.steps[i]!;
    return cat(s.s, t(` (step ${i + 1}, ${reasons[s.r].en})`, `（第 ${i + 1} 步，${reasons[s.r]["zh-CN"]}）`));
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
          step(1, "see what the step does", "看这一步做什么", first),
          step(2, "follow the proof in the figure", "在图中走一遍证明", t(walk("en"), walk("zh-CN"))),
          check(
            t(
              `Step ${c + 1} uses the ${reasons[tri.r].en}, which needs ${critNeeds[crit].en}. The parts are `,
              `第 ${c + 1} 步用的是${reasons[tri.r]["zh-CN"]}，它需要${critNeeds[crit]["zh-CN"]}。这些部分是：`,
            ),
            andList(proof.parts.map(partText)),
            t(`.${tri.why ? ` ${tri.why.en}` : ""}`, `。${tri.why ? tri.why["zh-CN"] : ""}`),
            t(
              ` The last step, ${last.s.en}, pairs parts in the same places of ${tri.s.en}, so it follows by CPCTC.`,
              `最后一步 ${last.s["zh-CN"]} 配对的是 ${tri.s["zh-CN"]} 中位置相同的部分，所以由“全等三角形的对应部分全等”得出。`,
            ),
          ),
        ),
      }),
      wrongWhy,
    ),
    figure: drawing.figure,
    solutionFigures: drawing.steps,
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

/** tickPair marks two segments congruent with count ticks. */
const tickPair = (a: Point, b: Point, c: Point, d: Point, count: number): Mark[] => [
  { kind: "ticks", a, b, count },
  { kind: "ticks", a: c, b: d, count },
];

/** arcPair marks the angles at v (from a to b) and at w (from c to d) congruent. */
const arcPair = (v: Point, a: Point, b: Point, w: Point, c: Point, d: Point): Mark[] => [
  { kind: "arc", vertex: v, from: a, to: b, accent: true },
  { kind: "arc", vertex: w, from: c, to: d, accent: true },
];

/** bowtieProof proves a congruence of the triangles formed by two crossing segments: by SAS from midpoints, or by ASA or AAS from parallel lines. */
function bowtieProof(rng: Rng, kind: "sas" | "asa" | "aas"): Proof {
  const [A, B, C, D, E] = pickLetters(rng, 5) as [string, string, string, string, string];
  const [pa, pb, pc, pd, pe] = bowtiePoints(rng);
  const base: Mark[] = [
    { kind: "polygon", points: [pa, pb, pc] },
    { kind: "polygon", points: [pd, pe, pc] },
    ...names([pa, pb, pd, pe], [A, B, D, E], [0, 0]),
    { kind: "label", at: pc, text: C, dir: compassOf(pa[0] + pd[0] - pb[0] - pe[0], pa[1] + pd[1] - pb[1] - pe[1]), italic: true },
  ];
  const alt: [string, string] = [
    `Segments ${A}${D} and ${B}${E} crossing at ${C}, forming triangles ${A}${B}${C} and ${D}${E}${C}.`,
    `线段 ${A}${D} 与 ${B}${E} 相交于 ${C}，构成三角形 ${A}${B}${C} 与 ${D}${E}${C}。`,
  ];
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
    marks: arcPair(pc, pa, pb, pc, pd, pe),
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
          marks: tickPair(pa, pc, pc, pd, 1),
          drawn: true,
        },
        {
          s: cong(sg(`${B}${C}`), sg(`${E}${C}`)),
          r: "defMid",
          alts: [cong(sg(`${B}${C}`), sg(`${D}${C}`)), cong(sg(`${B}${C}`), sg(`${A}${C}`)), cong(sg(`${A}${B}`), sg(`${D}${E}`))],
          marks: tickPair(pb, pc, pc, pe, 2),
          drawn: true,
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
          marks: tickPair(pa, pb, pd, pe, 3),
        },
      ],
      base,
      alt,
      parts: [1, 3, 2],
    };
  }
  const parallel: ProofStep = {
    s: m(`\\overline{${A}${B}} \\parallel \\overline{${D}${E}}`),
    r: "given",
    marks: [
      { kind: "arrows", a: pa, b: pb, count: 1 },
      { kind: "arrows", a: pe, b: pd, count: 1 },
    ],
    drawn: true,
  };
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
    marks: arcPair(pa, pb, pc, pd, pe, pc),
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
          marks: tickPair(pa, pc, pc, pd, 1),
          drawn: true,
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
          marks: tickPair(pa, pb, pd, pe, 2),
        },
      ],
      base,
      alt,
      parts: [1, 3, 4],
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
      { s: cong(sg(`${B}${C}`), sg(`${E}${C}`)), r: "given", marks: tickPair(pb, pc, pc, pe, 1), drawn: true },
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
        marks: tickPair(pa, pc, pc, pd, 2),
      },
    ],
    base,
    alt,
    parts: [1, 3, 2],
  };
}

/** kiteProof proves a congruence of two triangles sharing a side: by SSS, SAS, ASA or AAS. */
function kiteProof(rng: Rng, kind: "sss" | "sas" | "asa" | "aas"): Proof {
  const [U, V, X, Y] = pickLetters(rng, 4) as [string, string, string, string];
  const [pu, pv, px, py] = kitePoints(rng, false);
  const base: Mark[] = [
    { kind: "polygon", points: [pu, px, pv, py] },
    { kind: "segment", a: pu, b: pv },
    ...names([pu, pv, px, py], [U, V, X, Y]),
  ];
  const alt: [string, string] = [
    `Quadrilateral ${U}${X}${V}${Y} with diagonal ${U}${V}, forming triangles ${U}${X}${V} and ${U}${Y}${V}.`,
    `四边形 ${U}${X}${V}${Y} 及对角线 ${U}${V}，构成三角形 ${U}${X}${V} 与 ${U}${Y}${V}。`,
  ];
  const shared = (count: number): ProofStep => ({
    s: cong(sg(`${U}${V}`), sg(`${U}${V}`)),
    r: "reflexive",
    why: t(`The two triangles share the side $\\overline{${U}${V}}$.`, `两个三角形有公共边 $\\overline{${U}${V}}$。`),
    marks: [{ kind: "ticks", a: pu, b: pv, count }],
  });
  const bisectU: ProofStep = {
    s: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
    r: "defBis",
    alts: [
      cong(an(`${X}${U}${V}`), an(`${X}${V}${U}`)),
      cong(an(`${X}${U}${V}`), an(`${U}${X}${V}`)),
      cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    ],
    marks: arcPair(pu, px, pv, pu, pv, py),
    drawn: true,
  };
  const triangles = (r: Reason, why: Text): ProofStep => ({
    s: cong(tr(`${U}${X}${V}`), tr(`${U}${Y}${V}`)),
    r,
    why,
    alts: [
      cong(tr(`${U}${X}${V}`), tr(`${Y}${U}${V}`)),
      cong(tr(`${U}${X}${V}`), tr(`${V}${Y}${U}`)),
      cong(tr(`${X}${U}${V}`), tr(`${U}${Y}${V}`)),
    ],
  });
  const sideU = (count: number): ProofStep => ({
    s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    r: "cpctc",
    alts: [cong(sg(`${U}${X}`), sg(`${V}${Y}`)), cong(sg(`${U}${X}`), sg(`${U}${V}`)), cong(sg(`${X}${V}`), sg(`${U}${Y}`))],
    marks: tickPair(pu, px, pu, py, count),
  });
  if (kind === "sss") {
    return {
      given: t(
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$ and $\\overline{${V}${X}} \\cong \\overline{${V}${Y}}$`,
        `$\\overline{${U}${X}} \\cong \\overline{${U}${Y}}$，$\\overline{${V}${X}} \\cong \\overline{${V}${Y}}$`,
      ),
      prove: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
      steps: [
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given", marks: tickPair(px, pu, py, pu, 1), drawn: true },
        { s: cong(sg(`${V}${X}`), sg(`${V}${Y}`)), r: "given", marks: tickPair(px, pv, py, pv, 2), drawn: true },
        shared(3),
        triangles("sss", t("These are all three pairs of sides.", "这正是三组边。")),
        {
          s: cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
          r: "cpctc",
          alts: [
            cong(an(`${X}${U}${V}`), an(`${Y}${V}${U}`)),
            cong(an(`${X}${U}${V}`), an(`${U}${X}${V}`)),
            cong(an(`${U}${X}${V}`), an(`${Y}${U}${V}`)),
          ],
          marks: arcPair(pu, px, pv, pu, pv, py),
        },
      ],
      base,
      alt,
      parts: [0, 1, 2],
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
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given", marks: tickPair(px, pu, py, pu, 1), drawn: true },
        { s: t(`$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`, `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`), r: "given" },
        bisectU,
        shared(2),
        triangles(
          "sas",
          t(
            `The angles at $${U}$ lie between $\\overline{${U}${X}}$, $\\overline{${U}${Y}}$ and the shared side $\\overline{${U}${V}}$.`,
            `$${U}$ 处的两个角正是 $\\overline{${U}${X}}$、$\\overline{${U}${Y}}$ 与公共边 $\\overline{${U}${V}}$ 的夹角。`,
          ),
        ),
        {
          s: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
          r: "cpctc",
          alts: [cong(sg(`${X}${V}`), sg(`${U}${Y}`)), cong(sg(`${X}${V}`), sg(`${U}${V}`)), cong(sg(`${U}${X}`), sg(`${Y}${V}`))],
          marks: tickPair(px, pv, py, pv, 3),
        },
      ],
      base,
      alt,
      parts: [0, 2, 3],
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
          marks: arcPair(pv, px, pu, pv, pu, py),
          drawn: true,
        },
        shared(1),
        triangles(
          "asa",
          t(
            `The shared side $\\overline{${U}${V}}$ lies between the angles at $${U}$ and $${V}$.`,
            `公共边 $\\overline{${U}${V}}$ 位于 $${U}$、$${V}$ 处的角之间。`,
          ),
        ),
        sideU(2),
      ],
      base,
      alt,
      parts: [1, 3, 2],
    };
  }
  return {
    given: t(
      `$\\angle ${U}${X}${V} \\cong \\angle ${U}${Y}${V}$, and $\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`,
      `$\\angle ${U}${X}${V} \\cong \\angle ${U}${Y}${V}$，$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`,
    ),
    prove: cong(sg(`${U}${X}`), sg(`${U}${Y}`)),
    steps: [
      {
        s: cong(an(`${U}${X}${V}`), an(`${U}${Y}${V}`)),
        r: "given",
        marks: arcPair(px, pu, pv, py, pu, pv),
        drawn: true,
      },
      { s: t(`$\\overline{${U}${V}}$ bisects $\\angle ${X}${U}${Y}$`, `$\\overline{${U}${V}}$ 平分 $\\angle ${X}${U}${Y}$`), r: "given" },
      bisectU,
      shared(1),
      triangles(
        "aas",
        t(
          `The shared side $\\overline{${U}${V}}$ is opposite the angles at $${X}$ and $${Y}$, not between the two pairs of congruent angles.`,
          `公共边 $\\overline{${U}${V}}$ 是 $${X}$、$${Y}$ 处角的对边，不在两组全等角之间。`,
        ),
      ),
      sideU(2),
    ],
    base,
    alt,
    parts: [0, 2, 3],
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
  const base: Mark[] = [
    { kind: "polygon", points: [pu, px, py] },
    { kind: "segment", a: pu, b: pv },
    ...names([pu, px, py], [U, X, Y]),
    { kind: "label", at: pv, text: V, dir: compassOf(pv[0] - pu[0], pv[1] - pu[1]), italic: true },
  ];
  const alt: [string, string] = [
    `Triangle ${U}${X}${Y} with segment ${U}${V} perpendicular to ${X}${Y}, ${V} on ${X}${Y}.`,
    `三角形 ${U}${X}${Y}，线段 ${U}${V} 垂直于 ${X}${Y}，${V} 在 ${X}${Y} 上。`,
  ];
  const perp: ProofStep = {
    s: t(`$\\angle ${U}${V}${X}$ and $\\angle ${U}${V}${Y}$ are right angles`, `$\\angle ${U}${V}${X}$ 和 $\\angle ${U}${V}${Y}$ 都是直角`),
    r: "defPerp",
    alts: [
      t(`$\\angle ${X}$ and $\\angle ${Y}$ are right angles`, `$\\angle ${X}$ 和 $\\angle ${Y}$ 都是直角`),
      t(`$\\angle ${U}${V}${X}$ and $\\angle ${U}${V}${Y}$ are acute angles`, `$\\angle ${U}${V}${X}$ 和 $\\angle ${U}${V}${Y}$ 都是锐角`),
      cong(an(`${X}${U}${V}`), an(`${Y}${U}${V}`)),
    ],
    marks: [{ kind: "right", vertex: pv, from: py, to: pu }],
    drawn: true,
  };
  const shared = (count: number): ProofStep => ({
    s: cong(sg(`${U}${V}`), sg(`${U}${V}`)),
    r: "reflexive",
    why: t(`The two triangles share the side $\\overline{${U}${V}}$.`, `两个三角形有公共边 $\\overline{${U}${V}}$。`),
    marks: [{ kind: "ticks", a: pu, b: pv, count }],
  });
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
        { s: cong(sg(`${U}${X}`), sg(`${U}${Y}`)), r: "given", marks: tickPair(pu, px, pu, py, 1), drawn: true },
        shared(2),
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
          marks: tickPair(px, pv, pv, py, 3),
        },
      ],
      base,
      alt,
      parts: [1, 2, 3],
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
        marks: [{ kind: "right", vertex: pv, from: pu, to: px }],
      },
      { s: t(`$${V}$ is the midpoint of $\\overline{${X}${Y}}$`, `$${V}$ 是 $\\overline{${X}${Y}}$ 的中点`), r: "given" },
      {
        s: cong(sg(`${X}${V}`), sg(`${Y}${V}`)),
        r: "defMid",
        alts: [cong(sg(`${X}${V}`), sg(`${U}${V}`)), cong(sg(`${U}${X}`), sg(`${U}${Y}`)), cong(sg(`${X}${Y}`), sg(`${U}${V}`))],
        marks: tickPair(px, pv, pv, py, 1),
        drawn: true,
      },
      shared(2),
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
        marks: tickPair(pu, px, pu, py, 3),
      },
    ],
    base,
    alt,
    parts: [4, 2, 5],
  };
}

/** proofIntroFigure draws quadrilateral PQRS of the introduction to proofs, split by PR, with the marks of the steps up to stage. */
function proofIntroFigure(stage: 0 | 1 | 2): Figure {
  const angles = [true, null, null];
  const look1: Look =
    stage === 0
      ? { sides: [null, 1, null], angles }
      : stage === 1
        ? { sides: [null, 1, 2], angles, fresh: { sides: [2] } }
        : { sides: [3, 1, 2], angles, fresh: { sides: [0] } };
  const look2: Look = stage === 2 ? { sides: [3, 1, null], angles, fresh: { sides: [0] } } : { sides: [null, 1, null], angles };
  const [en, zh] = [
    [
      "Quadrilateral PQRS with diagonal PR; PQ and PS carry one tick, and the angles at P on either side of PR carry arcs.",
      "四边形 PQRS 及对角线 PR；PQ 与 PS 各有一条短线，PR 两侧在 P 处的角都标有弧。",
    ],
    [
      "The same figure after step 4: the shared side PR is highlighted and carries two ticks.",
      "第 4 步之后的图形：公共边 PR 用另一种颜色标出，画有两条短线。",
    ],
    [
      "The same figure after step 6: QR and SR are highlighted and carry three ticks.",
      "第 6 步之后的图形：QR 与 SR 用另一种颜色标出，画有三条短线。",
    ],
  ][stage] as [string, string];
  return figure(sharedFigure(kite, ["P", "R", "Q", "S"], look1, look2), en, zh);
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
  ],
  xp: 18,
  standards: ["CCSS.HSG.SRT.B.5", "CCSS.HSG.CO.C.10"],
  intro: t(
    "Choosing a criterion and spotting shared sides and vertical angles is the heart of a congruence argument. A **two-column proof** writes the whole argument down, one statement per line, each beside the definition, property or theorem that justifies it. A typical proof collects three pairs of congruent parts, names the criterion they fit, and then uses **CPCTC** (corresponding parts of congruent triangles are congruent) to reach the fact that was asked for.\n\n**Given:** $\\overline{PQ} \\cong \\overline{PS}$, and $\\overline{PR}$ bisects $\\angle QPS$. **Prove:** $\\overline{QR} \\cong \\overline{SR}$.\n\n{{figure 0}}\n\n1. $\\overline{PQ} \\cong \\overline{PS}$ —— Given\n2. $\\overline{PR}$ bisects $\\angle QPS$ —— Given\n3. $\\angle QPR \\cong \\angle SPR$ —— Definition of angle bisector\n4. $\\overline{PR} \\cong \\overline{PR}$ —— Reflexive Property of Congruence\n\n{{figure 1}}\n\n5. $\\triangle PQR \\cong \\triangle PSR$ —— SAS Congruence Criterion, since the angles at $P$ lie between $\\overline{PQ}$, $\\overline{PS}$ and the shared side $\\overline{PR}$\n6. $\\overline{QR} \\cong \\overline{SR}$ —— Corresponding parts of congruent triangles are congruent\n\n{{figure 2}}\n\nStep 6 is allowed because $\\overline{QR}$ and $\\overline{SR}$ sit in the same places, the last two letters, of $\\triangle PQR$ and $\\triangle PSR$.",
    "选择判定方法、找出公共边和对顶角，是全等论证的核心。**两栏式证明**把整个论证写下来，每行一个结论，旁边写上作为依据的定义、性质或定理。典型的证明先凑齐三组全等的部分，写出它们符合的判定方法，再用**全等三角形的对应部分全等**得出要证的结论。\n\n**已知：** $\\overline{PQ} \\cong \\overline{PS}$，$\\overline{PR}$ 平分 $\\angle QPS$。**求证：** $\\overline{QR} \\cong \\overline{SR}$。\n\n{{figure 0}}\n\n1. $\\overline{PQ} \\cong \\overline{PS}$ —— 已知\n2. $\\overline{PR}$ 平分 $\\angle QPS$ —— 已知\n3. $\\angle QPR \\cong \\angle SPR$ —— 角平分线的定义\n4. $\\overline{PR} \\cong \\overline{PR}$ —— 全等的自反性\n\n{{figure 1}}\n\n5. $\\triangle PQR \\cong \\triangle PSR$ —— SAS 全等判定，因为 $P$ 处的两个角正是 $\\overline{PQ}$、$\\overline{PS}$ 与公共边 $\\overline{PR}$ 的夹角\n6. $\\overline{QR} \\cong \\overline{SR}$ —— 全等三角形的对应部分全等\n\n{{figure 2}}\n\n第 6 步成立，是因为 $\\overline{QR}$ 与 $\\overline{SR}$ 在 $\\triangle PQR$ 和 $\\triangle PSR$ 中位置相同，都是后两个字母。",
  ),
  introFigures: [proofIntroFigure(0), proofIntroFigure(1), proofIntroFigure(2)],
  knowledgePoints: [
    {
      id: "proofs-with-sss-and-sas",
      figure: congruenceDrawings["proofs-with-sss-and-sas"],
      title: t("Proofs with SSS and SAS", "用 SSS 和 SAS 证明"),
      explanation: t(
        "A **two-column proof** lists statements, each with its reason. A congruence proof collects three pairs of congruent parts, names the criterion, and then may use **CPCTC** (corresponding parts of congruent triangles are congruent) to conclude about any other pair of parts.\n\n**Given:** $C$ is the midpoint of $\\overline{AD}$ and of $\\overline{BE}$. **Prove:** $\\overline{AB} \\cong \\overline{DE}$.\n\n1. $C$ is the midpoint of $\\overline{AD}$ and $\\overline{BE}$ —— Given\n2. $\\overline{AC} \\cong \\overline{DC}$ —— Definition of midpoint\n3. $\\overline{BC} \\cong \\overline{EC}$ —— Definition of midpoint\n4. $\\angle ACB \\cong \\angle DCE$ —— Vertical Angles Theorem\n5. $\\triangle ABC \\cong \\triangle DEC$ —— SAS\n6. $\\overline{AB} \\cong \\overline{DE}$ —— CPCTC\n\nA side shared by both triangles is justified by the Reflexive Property.\n\n> **Watch out.** CPCTC comes after the triangles are proved congruent, never before: a step such as $\\overline{AB} \\cong \\overline{DE}$ by CPCTC needs the line $\\triangle ABC \\cong \\triangle DEC$ above it.",
        "**两栏式证明**逐条列出结论及其理由。证明全等时，先凑齐三组全等的部分，写出所用的判定方法，然后可以用**全等三角形的对应部分全等**得出其他任何一组对应部分的结论。\n\n**已知：** $C$ 是 $\\overline{AD}$ 的中点，也是 $\\overline{BE}$ 的中点。**求证：** $\\overline{AB} \\cong \\overline{DE}$。\n\n1. $C$ 是 $\\overline{AD}$ 和 $\\overline{BE}$ 的中点 —— 已知\n2. $\\overline{AC} \\cong \\overline{DC}$ —— 中点的定义\n3. $\\overline{BC} \\cong \\overline{EC}$ —— 中点的定义\n4. $\\angle ACB \\cong \\angle DCE$ —— 对顶角定理\n5. $\\triangle ABC \\cong \\triangle DEC$ —— SAS\n6. $\\overline{AB} \\cong \\overline{DE}$ —— 全等三角形的对应部分全等\n\n两个三角形的公共边，理由是全等的自反性。\n\n> **注意。** “全等三角形的对应部分全等”只能用在三角形已证全等之后：用它得出 $\\overline{AB} \\cong \\overline{DE}$ 的那一步，上面必须已有 $\\triangle ABC \\cong \\triangle DEC$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        return proofProblem(rng, kind === 0 ? bowtieProof(rng, "sas") : kiteProof(rng, kind === 1 ? "sss" : "sas"));
      },
    },
    {
      id: "proofs-with-asa-and-aas",
      figure: congruenceDrawings["proofs-with-asa-and-aas"],
      title: t("Proofs with ASA and AAS", "用 ASA 和 AAS 证明"),
      explanation: t(
        "Congruent angles often come from parallel lines (alternate interior angles), from crossing lines (vertical angles) or from a bisector.\n\n**Given:** $\\overline{AB} \\parallel \\overline{DE}$, and $C$ is the midpoint of $\\overline{AD}$. **Prove:** $\\overline{AB} \\cong \\overline{DE}$.\n\n1. $\\overline{AB} \\parallel \\overline{DE}$ —— Given\n2. $\\angle BAC \\cong \\angle EDC$ —— Alternate Interior Angles Theorem\n3. $C$ is the midpoint of $\\overline{AD}$ —— Given\n4. $\\overline{AC} \\cong \\overline{DC}$ —— Definition of midpoint\n5. $\\angle ACB \\cong \\angle DCE$ —— Vertical Angles Theorem\n6. $\\triangle ABC \\cong \\triangle DEC$ —— ASA, since $\\overline{AC}$ lies between the angles at $A$ and $C$\n7. $\\overline{AB} \\cong \\overline{DE}$ —— CPCTC\n\n> **Watch out.** Alternate interior angles need parallel lines: cite the theorem only once $\\overline{AB} \\parallel \\overline{DE}$ is given, and pair the angles on opposite sides of the transversal $\\overline{AD}$, here $\\angle BAC$ and $\\angle EDC$, not $\\angle BAC$ and $\\angle DEC$.",
        "全等的角常常来自平行线（内错角）、相交线（对顶角）或角平分线。\n\n**已知：** $\\overline{AB} \\parallel \\overline{DE}$，$C$ 是 $\\overline{AD}$ 的中点。**求证：** $\\overline{AB} \\cong \\overline{DE}$。\n\n1. $\\overline{AB} \\parallel \\overline{DE}$ —— 已知\n2. $\\angle BAC \\cong \\angle EDC$ —— 内错角定理\n3. $C$ 是 $\\overline{AD}$ 的中点 —— 已知\n4. $\\overline{AC} \\cong \\overline{DC}$ —— 中点的定义\n5. $\\angle ACB \\cong \\angle DCE$ —— 对顶角定理\n6. $\\triangle ABC \\cong \\triangle DEC$ —— ASA，因为 $\\overline{AC}$ 位于 $A$、$C$ 处的两角之间\n7. $\\overline{AB} \\cong \\overline{DE}$ —— 全等三角形的对应部分全等\n\n> **注意。** 内错角要有平行线：只有在已知 $\\overline{AB} \\parallel \\overline{DE}$ 之后才能用这条定理；而且要配对截线 $\\overline{AD}$ 两侧的角，这里是 $\\angle BAC$ 与 $\\angle EDC$，而不是 $\\angle BAC$ 与 $\\angle DEC$。",
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
      figure: congruenceDrawings["proofs-with-right-angles"],
      title: t("Proofs with right angles", "含直角的证明"),
      explanation: t(
        "A perpendicular segment gives right angles (definition of perpendicular lines), and all right angles are congruent (Right Angles Congruence Theorem). Right triangles can then be proved congruent by HL or by SAS.\n\n**Given:** $\\overline{UV} \\perp \\overline{XY}$, and $\\overline{UX} \\cong \\overline{UY}$. **Prove:** $\\overline{XV} \\cong \\overline{YV}$.\n\n1. $\\overline{UV} \\perp \\overline{XY}$ —— Given\n2. $\\angle UVX$ and $\\angle UVY$ are right angles —— Definition of perpendicular lines\n3. $\\overline{UX} \\cong \\overline{UY}$ —— Given\n4. $\\overline{UV} \\cong \\overline{UV}$ —— Reflexive Property\n5. $\\triangle UVX \\cong \\triangle UVY$ —— HL\n6. $\\overline{XV} \\cong \\overline{YV}$ —— CPCTC\n\n> **Watch out.** HL needs the hypotenuses. $\\overline{UX}$ and $\\overline{UY}$ are opposite the right angles at $V$, so they are the hypotenuses, and $\\overline{UV}$ is a leg. With two pairs of legs instead, such as $\\overline{XV} \\cong \\overline{YV}$ and $\\overline{UV} \\cong \\overline{UV}$, the right angles lie between them and the criterion is SAS.",
        "垂直的线段给出直角（垂直的定义），而所有直角都相等（直角相等定理）。于是可以用 HL 或 SAS 证明直角三角形全等。\n\n**已知：** $\\overline{UV} \\perp \\overline{XY}$，$\\overline{UX} \\cong \\overline{UY}$。**求证：** $\\overline{XV} \\cong \\overline{YV}$。\n\n1. $\\overline{UV} \\perp \\overline{XY}$ —— 已知\n2. $\\angle UVX$ 和 $\\angle UVY$ 都是直角 —— 垂直的定义\n3. $\\overline{UX} \\cong \\overline{UY}$ —— 已知\n4. $\\overline{UV} \\cong \\overline{UV}$ —— 全等的自反性\n5. $\\triangle UVX \\cong \\triangle UVY$ —— HL\n6. $\\overline{XV} \\cong \\overline{YV}$ —— 全等三角形的对应部分全等\n\n> **注意。** HL 必须用到斜边。$\\overline{UX}$ 与 $\\overline{UY}$ 是 $V$ 处直角所对的边，所以是斜边，$\\overline{UV}$ 是直角边。如果给出的是两组直角边，如 $\\overline{XV} \\cong \\overline{YV}$ 和 $\\overline{UV} \\cong \\overline{UV}$，直角就是它们的夹角，应当用 SAS。",
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
