import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, type Mark, num, type Point, Q, radical, simplifyRadical, sketch } from "@ga/subject-math";
import { geometryDrawings2, prismMarks, pyramidOn, shift } from "../explanation-drawings-geometry-2.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { solidDrawings } from "../explanation-drawings-solids.ts";
import {
  article,
  choiceProblem,
  expressionProblem,
  numberProblem,
  radicalProblem,
  reasonChoice,
  solutionsProblem,
  steps,
  why,
  yesNo,
} from "../problems.ts";
import { listed } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
export type Unit = (typeof units)[number];

/** pickUnit picks a unit of length. */
export const pickUnit = (rng: Rng): Unit => rng.pick(units);

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** len writes a length for a figure: "8 cm". */
const len = (v: Coefficient, u: Unit) => `${toQ(v).isInteger() ? toQ(v).toString() : dec(v)} ${u}`;

/** tex writes a length, an area or a volume in LaTeX: "8\text{ cm}", "24\text{ cm}^2". */
export const tex = (v: Coefficient, u: Unit, power = 1) => `${num(v)}\\text{ ${u}}${power > 1 ? `^{${power}}` : ""}`;

/** unitTex writes a unit of length, area or volume alone: "\text{cm}^3". */
/** unitWord names a unit after the word "in", where "in in" would be unreadable. */
const unitWord = (u: Unit) => (u === "in" ? "inches" : u);

/** squareOf writes n^2, with parentheses only around a negative n. */
const squareOf = (n: number) => (n < 0 ? `(${n})^2` : `${n}^2`);

const unitTex = (u: Unit, power: number) => `\\text{${u}}${power > 1 ? `^{${power}}` : ""}`;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** piTex writes c·π: "\pi", "36\pi", "\frac{32}{3}\pi". */
export function piTex(c: Coefficient): string {
  const v = toQ(c);
  return v.eq(Q.one) ? "\\pi" : `${v.toLatex()}\\pi`;
}

/** rootTex writes √n in simplest radical form: "2\sqrt{5}", or an integer. */
function rootTex(n: number): string {
  const [k, m] = simplifyRadical(n);
  return radical(k, m);
}

/** rootSteps writes √n = k√m, or just √n = k, for a solution. */
function rootSteps(n: number): string {
  const [k, m] = simplifyRadical(n);
  if (m === 1) return `\\sqrt{${n}} = ${k}`;
  if (k === 1) return `\\sqrt{${n}}`;
  return `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`;
}

/** rootProblem builds a problem whose answer is √n in simplest radical form. */
function rootProblem(p: { prompt: Text; n: number; solution: Text; wrong?: readonly string[] }): Problem {
  const [k, m] = simplifyRadical(p.n);
  return radicalProblem({ prompt: p.prompt, answer: [k, m], solution: p.solution, wrong: p.wrong ?? [] });
}

/** piProblem builds a problem whose answer is c·π, entered in terms of π and fully simplified. */
export function piProblem(p: {
  prompt: Text;
  coef: Coefficient;
  solution: Text;
  wrong?: readonly Coefficient[];
  mistakes?: readonly { readonly value: Coefficient; readonly why: Text }[];
}): Problem {
  return expressionProblem({
    prompt: p.prompt,
    answer: piTex(p.coef),
    simplified: true,
    solution: p.solution,
    wrong: (p.wrong ?? []).filter((w) => toQ(w).sign() > 0).map(piTex),
    mistakes: (p.mistakes ?? []).filter((m) => toQ(m.value).sign() > 0).map((m) => ({ response: piTex(m.value), why: m.why })),
  });
}

/** inPi is the instruction to answer exactly, in terms of π. */
export const inPi = t("Give the exact answer in terms of $\\pi$.", "用含 $\\pi$ 的式子给出精确答案。");

/** fitBox enlarges small dimensions so that a drawing stays readable: none is less than a third of the largest. */
export function fitBox(vs: readonly number[]): number[] {
  const m = Math.max(...vs);
  return vs.map((v) => Math.max(v, m / 3));
}

/** P3 projects a point of space onto the page in oblique projection, depth going up and to the right. */
const P3 = (x: number, y: number, z: number): Point => [x + 0.45 * z, y + 0.3 * z];

/** BoxLabels are the labels of a box's length, depth and height. */
export interface BoxLabels {
  readonly l?: string;
  readonly d?: string;
  readonly h?: string;
}

/** boxMarks draws a box l long, d deep and h high, with hidden edges dashed and an optional diagonal. */
export function boxMarks(L: number, D: number, H: number, labels: BoxLabels, diagonal?: "space" | "front"): Mark[] {
  const [l, d, h] = fitBox([L, D, H]) as [number, number, number];
  const p = (x: number, y: number, z: number) => P3(x * l, y * h, z * d);
  const marks: Mark[] = [
    { kind: "polygon", points: [p(0, 0, 0), p(1, 0, 0), p(1, 1, 0), p(0, 1, 0)] },
    { kind: "polygon", points: [p(0, 1, 0), p(1, 1, 0), p(1, 1, 1), p(0, 1, 1)] },
    { kind: "polygon", points: [p(1, 0, 0), p(1, 0, 1), p(1, 1, 1), p(1, 1, 0)] },
    { kind: "segment", a: p(0, 0, 1), b: p(1, 0, 1), dashed: true },
    { kind: "segment", a: p(0, 0, 1), b: p(0, 1, 1), dashed: true },
    { kind: "segment", a: p(0, 0, 1), b: p(0, 0, 0), dashed: true },
  ];
  if (diagonal === "space") marks.push({ kind: "segment", a: p(0, 0, 0), b: p(1, 1, 1), accent: true });
  if (diagonal === "front") marks.push({ kind: "segment", a: p(0, 0, 0), b: p(1, 1, 0), accent: true });
  if (labels.l) marks.push({ kind: "side", a: p(0, 0, 0), b: p(1, 0, 0), text: labels.l });
  if (labels.d) marks.push({ kind: "side", a: p(1, 0, 0), b: p(1, 0, 1), text: labels.d });
  if (labels.h) marks.push({ kind: "side", a: p(0, 1, 0), b: p(0, 0, 0), text: labels.h });
  return marks;
}

/** arc approximates part of an ellipse by short segments, from angle a0 to a1. */
export function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, dashed: boolean): Mark[] {
  const n = 16;
  const at = (i: number): Point => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  };
  return Array.from({ length: n }, (_, i): Mark => ({ kind: "segment", a: at(i), b: at(i + 1), dashed }));
}

/** ellipse is a closed ellipse drawn as a polygon. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): Mark {
  return {
    kind: "polygon",
    points: Array.from({ length: 40 }, (_, i): Point => [cx + rx * Math.cos((i * Math.PI) / 20), cy + ry * Math.sin((i * Math.PI) / 20)]),
  };
}

/** RoundLabels are the labels of a round solid's radius (or diameter), height and slant height. */
export interface RoundLabels {
  readonly r?: string;
  readonly d?: string;
  readonly h?: string;
  readonly l?: string;
}

/** cylinderMarks draws a cylinder of radius R and height H. */
export function cylinderMarks(R: number, H: number, labels: RoundLabels): Mark[] {
  const [w, h] = fitBox([2 * R, H]) as [number, number];
  const r = w / 2;
  const ry = 0.28 * r;
  const marks: Mark[] = [
    ellipse(0, h, r, ry),
    ...arc(0, 0, r, ry, Math.PI, 2 * Math.PI, false),
    ...arc(0, 0, r, ry, 0, Math.PI, true),
    { kind: "segment", a: [-r, 0], b: [-r, h] },
    { kind: "segment", a: [r, 0], b: [r, h] },
  ];
  if (labels.r) {
    marks.push({ kind: "segment", a: [0, h], b: [r, h], accent: true }, { kind: "dot", at: [0, h] });
    marks.push({ kind: "label", at: [r / 2, h], text: labels.r, dir: "n" });
  }
  if (labels.d) {
    marks.push({ kind: "segment", a: [-r, h], b: [r, h], accent: true });
    marks.push({ kind: "label", at: [0, h], text: labels.d, dir: "n" });
  }
  if (labels.h) marks.push({ kind: "side", a: [r, 0], b: [r, h], text: labels.h });
  return marks;
}

/** coneMarks draws a right cone of radius R and height H. */
export function coneMarks(R: number, H: number, labels: RoundLabels): Mark[] {
  const [w, h] = fitBox([2 * R, H]) as [number, number];
  const r = w / 2;
  const ry = 0.28 * r;
  const marks: Mark[] = [
    ...arc(0, 0, r, ry, Math.PI, 2 * Math.PI, false),
    ...arc(0, 0, r, ry, 0, Math.PI, true),
    { kind: "segment", a: [-r, 0], b: [0, h] },
    { kind: "segment", a: [r, 0], b: [0, h] },
  ];
  if (labels.r || labels.d) {
    const a: Point = labels.d ? [-r, 0] : [0, 0];
    marks.push({ kind: "segment", a, b: [r, 0], accent: true }, { kind: "dot", at: [0, 0] });
    marks.push({ kind: "label", at: [labels.d ? 0 : r / 2, 0], text: (labels.d ?? labels.r)!, dir: "s" });
  }
  if (labels.h) {
    marks.push({ kind: "segment", a: [0, h], b: [0, 0], dashed: true, accent: true });
    marks.push({ kind: "right", vertex: [0, 0], from: [0, h], to: [r, 0] });
    marks.push({ kind: "label", at: [0, h / 2], text: labels.h, dir: "w" });
  }
  if (labels.l) marks.push({ kind: "side", a: [r, 0], b: [0, h], text: labels.l });
  return marks;
}

/** sphereMarks draws a sphere with its equator and a radius or diameter. */
function sphereMarks(labels: RoundLabels): Mark[] {
  const marks: Mark[] = [ellipse(0, 0, 1, 1), ...arc(0, 0, 1, 0.28, Math.PI, 2 * Math.PI, false), ...arc(0, 0, 1, 0.28, 0, Math.PI, true)];
  marks.push({ kind: "dot", at: [0, 0] });
  if (labels.r) {
    marks.push({ kind: "segment", a: [0, 0], b: [1, 0], accent: true });
    marks.push({ kind: "label", at: [0.5, 0], text: labels.r, dir: "n" });
  }
  if (labels.d) {
    marks.push({ kind: "segment", a: [-1, 0], b: [1, 0], accent: true });
    marks.push({ kind: "label", at: [0.35, 0], text: labels.d, dir: "n" });
  }
  return marks;
}

/** PyramidLabels are the labels of a pyramid's base length and depth, height and slant height. */
export interface PyramidLabels {
  readonly l?: string;
  readonly d?: string;
  readonly h?: string;
  readonly s?: string;
}

/** pyramidMarks draws a pyramid on an l by d rectangular base, with its apex above the center. */
export function pyramidMarks(L: number, D: number, H: number, labels: PyramidLabels): Mark[] {
  const [l, d, h] = fitBox([L, D, H]) as [number, number, number];
  const p = (x: number, z: number) => P3(x * l, 0, z * d);
  const apex = P3(l / 2, h, d / 2);
  const marks: Mark[] = [
    { kind: "segment", a: p(0, 0), b: p(1, 0) },
    { kind: "segment", a: p(1, 0), b: p(1, 1) },
    { kind: "segment", a: p(1, 1), b: p(0, 1), dashed: true },
    { kind: "segment", a: p(0, 1), b: p(0, 0), dashed: true },
    { kind: "segment", a: apex, b: p(0, 0) },
    { kind: "segment", a: apex, b: p(1, 0) },
    { kind: "segment", a: apex, b: p(1, 1) },
    { kind: "segment", a: apex, b: p(0, 1), dashed: true },
  ];
  if (labels.h) {
    const foot = p(0.5, 0.5);
    marks.push({ kind: "segment", a: apex, b: foot, dashed: true, accent: true }, { kind: "dot", at: foot });
    marks.push({ kind: "label", at: [(apex[0] + foot[0]) / 2, (apex[1] + foot[1]) / 2], text: labels.h, dir: labels.s ? "e" : "w" });
  }
  if (labels.s) {
    const mid = p(0.5, 0);
    marks.push({ kind: "segment", a: apex, b: mid, accent: true });
    marks.push({ kind: "label", at: [(apex[0] + mid[0]) / 2, (apex[1] + mid[1]) / 2], text: labels.s, dir: labels.h ? "w" : "e" });
  }
  if (labels.l) marks.push({ kind: "side", a: p(0, 0), b: p(1, 0), text: labels.l });
  if (labels.d) marks.push({ kind: "side", a: p(1, 0), b: p(1, 1), text: labels.d });
  return marks;
}

/** TriangleLabels are the labels of a right-triangular prism's legs a and b, hypotenuse c and length l. */
interface TriangleLabels {
  readonly a?: string;
  readonly b?: string;
  readonly c?: string;
  readonly l?: string;
}

/** triangularPrismMarks draws a prism L long whose bases are right triangles with legs a (across) and b (up), hidden edges dashed. */
function triangularPrismMarks(A: number, B: number, L: number, labels: TriangleLabels): Mark[] {
  const [a, b, l] = fitBox([A, B, L]) as [number, number, number];
  const p = (x: number, y: number, z: number) => P3(x, y, z * l);
  const marks: Mark[] = [
    { kind: "polygon", points: [p(0, 0, 0), p(a, 0, 0), p(0, b, 0)] },
    { kind: "polygon", points: [p(a, 0, 0), p(a, 0, 1), p(0, b, 1), p(0, b, 0)] },
    { kind: "segment", a: p(0, 0, 0), b: p(0, 0, 1), dashed: true },
    { kind: "segment", a: p(0, 0, 1), b: p(a, 0, 1), dashed: true },
    { kind: "segment", a: p(0, 0, 1), b: p(0, b, 1), dashed: true },
    { kind: "right", vertex: p(0, 0, 0), from: p(a, 0, 0), to: p(0, b, 0) },
  ];
  if (labels.a) marks.push({ kind: "side", a: p(0, 0, 0), b: p(a, 0, 0), text: labels.a });
  if (labels.b) marks.push({ kind: "side", a: p(0, b, 0), b: p(0, 0, 0), text: labels.b });
  if (labels.c) {
    const m = p(a / 2, b / 2, 0);
    marks.push({ kind: "label", at: m, text: labels.c, dir: "sw" });
  }
  if (labels.l) marks.push({ kind: "side", a: p(a, 0, 0), b: p(a, 0, 1), text: labels.l });
  return marks;
}

/** regularOn is the regular n-gon with edge p → q, on the left of that edge. */
function regularOn(p: Point, q: Point, n: number): Point[] {
  const s = Math.hypot(q[0] - p[0], q[1] - p[1]);
  let dir = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const points: Point[] = [p, q];
  for (let i = 2; i < n; i++) {
    dir += (2 * Math.PI) / n;
    const last = points[points.length - 1]!;
    points.push([last[0] + s * Math.cos(dir), last[1] + s * Math.sin(dir)]);
  }
  return points;
}

/** prismNet draws the net of a prism: a strip of n rectangles of height h with the two bases on rectangle k. */
function prismNet(n: number, k: number, h: number): Mark[] {
  const marks: Mark[] = Array.from(
    { length: n },
    (_, i): Mark => ({
      kind: "polygon",
      points: [
        [2 * i, 0],
        [2 * i + 2, 0],
        [2 * i + 2, h],
        [2 * i, h],
      ],
    }),
  );
  marks.push({ kind: "polygon", points: regularOn([2 * k, h], [2 * k + 2, h], n), accent: true });
  marks.push({ kind: "polygon", points: regularOn([2 * k + 2, 0], [2 * k, 0], n), accent: true });
  return marks;
}

/** pyramidNet draws the net of a pyramid: a regular n-gon with a triangle of height h on each side. */
function pyramidNet(n: number, h: number): Mark[] {
  const base = regularOn([0, 0], [2, 0], n);
  const marks: Mark[] = [{ kind: "polygon", points: base, accent: true }];
  base.forEach((a, i) => {
    const b = base[(i + 1) % n]!;
    const [dx, dy] = [(b[0] - a[0]) / 2, (b[1] - a[1]) / 2];
    // The outside of a counterclockwise polygon is on the right of each edge.
    const apex: Point = [a[0] + dx + dy * h, a[1] + dy - dx * h];
    marks.push({ kind: "polygon", points: [a, apex, b] });
  });
  return marks;
}

/** Cell is a unit square of a grid, by column and row. */
type Cell = readonly [number, number];

/** squaresNet draws unit squares at cells, with optional labels at their centers and the squares at the indices of accent highlighted. */
function squaresNet(cells: readonly Cell[], labels?: readonly string[], accent: readonly number[] = []): Mark[] {
  return cells.flatMap(([c, r], i): Mark[] => {
    const square: Mark = {
      kind: "polygon",
      points: [
        [c, r],
        [c + 1, r],
        [c + 1, r + 1],
        [c, r + 1],
      ],
      ...(accent.includes(i) && { accent: true }),
    };
    const text = labels?.[i];
    return text ? [square, { kind: "label", at: [c + 0.5, r + 0.35], text, dir: "n" }] : [square];
  });
}

/** Shape names a prism or a pyramid by its base. */
interface Shape {
  readonly n: number;
  /** polygon is the base polygon: "hexagon", "六边形". */
  readonly polygon: Text;
  /** adjective describes the base: "hexagonal". */
  readonly adjective: string;
  readonly name: Text;
}

const polygonNames: Record<number, readonly [string, string, string]> = {
  3: ["triangle", "triangular", "三角形"],
  5: ["pentagon", "pentagonal", "五边形"],
  6: ["hexagon", "hexagonal", "六边形"],
  7: ["heptagon", "heptagonal", "七边形"],
  8: ["octagon", "octagonal", "八边形"],
};

const zhDigits = ["", "", "", "三", "四", "五", "六", "七", "八"];

/** prism names the prism whose bases have n sides (3 to 8); n = 4 is the rectangular prism. */
function prism(n: number): Shape {
  if (n === 4) return { n, polygon: t("rectangle", "长方形"), adjective: "rectangular", name: t("rectangular prism", "长方体") };
  const [en, adjective, zh] = polygonNames[n]!;
  return { n, polygon: t(en, zh), adjective, name: t(`${adjective} prism`, `${zhDigits[n]}棱柱`) };
}

/** pyramid names the pyramid whose base has n sides (3 to 8); n = 4 is the square pyramid. */
function pyramid(n: number): Shape {
  if (n === 4) return { n, polygon: t("square", "正方形"), adjective: "square", name: t("square pyramid", "四棱锥") };
  const [en, adjective, zh] = polygonNames[n]!;
  return { n, polygon: t(en, zh), adjective, name: t(`${adjective} pyramid`, `${zhDigits[n]}棱锥`) };
}

/** wordArticle is "a" or "an" before an English word. */
const wordArticle = (word: string) => (/^[aeiou]/.test(word) ? "an" : "a");

/** shapeOptions offers a prism and a pyramid on n sides and on another number of sides, in random order, with the index of want. */
function shapeOptions(rng: Rng, want: Shape, kind: "prism" | "pyramid"): { options: Text[]; correct: number } {
  const other = want.n === 8 ? 7 : want.n === 3 ? 4 : want.n + rng.pick([-1, 1]);
  const all = rng.shuffle([prism(want.n), pyramid(want.n), prism(other), pyramid(other)]);
  return { options: all.map((s) => s.name), correct: all.findIndex((s) => s.name.en === want.name.en && kind === kindOf(s)) };
}

const kindOf = (s: Shape): "prism" | "pyramid" => (s.name.en.endsWith("prism") ? "prism" : "pyramid");

/** solidNames are names of common solids, polyhedra first. */
const polyhedra: readonly Text[] = [
  t("cube", "正方体"),
  t("rectangular prism", "长方体"),
  t("triangular prism", "三棱柱"),
  t("hexagonal prism", "六棱柱"),
  t("square pyramid", "四棱锥"),
  t("triangular pyramid", "三棱锥"),
  t("pentagonal pyramid", "五棱锥"),
  t("octagonal prism", "八棱柱"),
];

const roundSolids: readonly Text[] = [t("cylinder", "圆柱"), t("cone", "圆锥"), t("sphere", "球"), t("hemisphere", "半球")];

/** everyday are objects and the solid (an index into everydaySolids) that models each. */
const everydaySolids: readonly Text[] = [
  t("cube", "正方体"),
  t("rectangular prism", "长方体"),
  t("triangular prism", "三棱柱"),
  t("square pyramid", "四棱锥"),
  t("cylinder", "圆柱"),
  t("cone", "圆锥"),
  t("sphere", "球"),
  t("hemisphere", "半球"),
];

const everyday: readonly (readonly [string, string, number])[] = [
  ["a die", "一颗骰子", 0],
  ["a sugar cube", "一块方糖", 0],
  ["a Rubik's cube", "一个魔方", 0],
  ["a shoebox", "一个鞋盒", 1],
  ["a brick", "一块砖", 1],
  ["a cereal box", "一个麦片盒", 1],
  ["a closed book", "一本合上的书", 1],
  ["a camping tent with triangular ends", "一顶两端是三角形的帐篷", 2],
  ["a glass prism that splits light into colors", "一块把光分成七色的三棱镜", 2],
  ["a wedge-shaped doorstop with a right-triangle side", "一个侧面为直角三角形的楔形门挡", 2],
  ["the Great Pyramid of Giza", "吉萨大金字塔", 3],
  ["the glass pyramid of the Louvre", "卢浮宫的玻璃金字塔", 3],
  ["a can of soup", "一个汤罐头", 4],
  ["a drinking straw", "一根吸管", 4],
  ["a round pillar candle", "一根圆柱形蜡烛", 4],
  ["a hockey puck", "一个冰球", 4],
  ["a water pipe", "一段水管", 4],
  ["an ice-cream cone", "一个冰淇淋蛋筒", 5],
  ["a traffic cone", "一个交通锥", 5],
  ["a pointed party hat", "一顶尖顶派对帽", 5],
  ["a funnel without its spout", "一个去掉细管的漏斗", 5],
  ["a basketball", "一个篮球", 6],
  ["a marble", "一颗玻璃弹珠", 6],
  ["a globe", "一个地球仪", 6],
  ["a soap bubble", "一个肥皂泡", 6],
  ["half an orange cut through its center", "从中间切开的半个橙子", 7],
  ["a round dome on a flat floor", "地面上的一个圆顶", 7],
  ["a mixing bowl shaped like half a ball", "一个半球形的搅拌碗", 7],
];

const roundDefinitions: readonly (readonly [string, string, number])[] = [
  ["It has two congruent, parallel circular bases joined by a curved surface.", "它有两个全等且平行的圆形底面，由一个曲面连接。", 4],
  ["It has one circular base and a curved surface that narrows to a single point.", "它有一个圆形底面，曲面收拢到一点。", 5],
  ["It is the set of all points in space at the same distance from a center.", "它是空间中到一个定点距离相等的所有点组成的图形。", 6],
  [
    "It is half of a ball, cut by a plane through the center, with a flat circular face.",
    "它是被过球心的平面截成的半个球，有一个平的圆面。",
    7,
  ],
];

/** everydayLooks describe the surface of each of everydaySolids, at the same positions. */
const everydayLooks: readonly Text[] = [
  t("six square faces, all the same size", "六个大小相同的正方形面"),
  t("six rectangular faces, opposite ones equal", "六个长方形面，相对的面相等"),
  t("two triangular ends joined by three rectangles", "两个三角形的端面，由三个长方形连接"),
  t("a square base and four triangles meeting at a point", "一个正方形底面和交于一点的四个三角形"),
  t("two flat circular ends joined by a curved side", "两个平的圆形端面，由一个弯曲的侧面连接"),
  t("one flat circle and a curved surface narrowing to a point", "一个平的圆面和收拢到一点的曲面"),
  t("a single curved surface, every point of it the same distance from the center", "一个曲面，曲面上每一点到中心的距离都相同"),
  t("one flat circle covered by a curved dome", "一个平的圆面，上面罩着弯曲的圆顶"),
];

/** everydayFlat count the flat faces of each of everydaySolids, at the same positions. */
const everydayFlat: readonly Text[] = [
  t("$6$ flat faces", "$6$ 个平面"),
  t("$6$ flat faces", "$6$ 个平面"),
  t("$5$ flat faces", "$5$ 个平面"),
  t("$5$ flat faces", "$5$ 个平面"),
  t("$2$ flat faces, both circles", "$2$ 个平面，都是圆"),
  t("$1$ flat face, a circle", "$1$ 个平面，是圆"),
  t("no flat face at all", "$0$ 个平面"),
  t("$1$ flat face, a circle", "$1$ 个平面，是圆"),
];

/** surfaces describe the surface of each solid of polyhedra and roundSolids, by its English name. */
const surfaces: Readonly<Record<string, Text>> = {
  cube: t("$6$ squares, a polyhedron", "$6$ 个正方形，是多面体"),
  "rectangular prism": t("$6$ rectangles, a polyhedron", "$6$ 个长方形，是多面体"),
  "triangular prism": t("$2$ triangles and $3$ rectangles, a polyhedron", "$2$ 个三角形和 $3$ 个长方形，是多面体"),
  "hexagonal prism": t("$2$ hexagons and $6$ rectangles, a polyhedron", "$2$ 个六边形和 $6$ 个长方形，是多面体"),
  "square pyramid": t("$1$ square and $4$ triangles, a polyhedron", "$1$ 个正方形和 $4$ 个三角形，是多面体"),
  "triangular pyramid": t("$4$ triangles, a polyhedron", "$4$ 个三角形，是多面体"),
  "pentagonal pyramid": t("$1$ pentagon and $5$ triangles, a polyhedron", "$1$ 个五边形和 $5$ 个三角形，是多面体"),
  "octagonal prism": t("$2$ octagons and $8$ rectangles, a polyhedron", "$2$ 个八边形和 $8$ 个长方形，是多面体"),
  cylinder: t("two flat circles and a curved side, not a polyhedron", "两个平的圆面和一个弯曲的侧面，不是多面体"),
  cone: t("a flat circle and a curved surface, not a polyhedron", "一个平的圆面和一个曲面，不是多面体"),
  sphere: t("only a curved surface, not a polyhedron", "只有曲面，不是多面体"),
  hemisphere: t("a flat circle and a curved dome, not a polyhedron", "一个平的圆面和一个弯曲的圆顶，不是多面体"),
};

export const identifyingThreeDimensionalShapes: TopicDef = {
  id: "identifying-three-dimensional-shapes",
  title: t("Identifying Three-Dimensional Shapes", "认识立体图形"),
  summary: t(
    "Recognize prisms, pyramids, cylinders, cones and spheres, and tell polyhedra from solids with curved surfaces.",
    "认识棱柱、棱锥、圆柱、圆锥和球，并区分多面体与有曲面的立体图形。",
  ),
  prerequisites: ["polygons"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.GMD.B.4"],
  intro: t(
    `A polygon is flat: it has a length and a width, but no thickness. Most objects around us also have a height, and their shapes are **solids**, shapes in three dimensions. Many solids are built from a polygon in one of two ways.

Take a pentagon lying on a table and slide it straight up, keeping it level. The pentagon it ends at is a copy of the one it started from, and each of its $5$ sides sweeps out a rectangle on the way. The solid swept out has $2$ pentagons and $5$ rectangles as faces: it is a **pentagonal prism**. Now keep the pentagon on the table instead, choose one point above it, and join each corner of the pentagon to that point. Each side of the pentagon and the point make a triangle, and the solid has $1$ pentagon and $5$ triangles as faces: it is a **pentagonal pyramid**.

{{figure 0}}

Both solids take their name from the polygon they are built on. In this lesson we name prisms and pyramids, meet the solids whose surfaces are curved, and sort solids into those made only of flat polygons and the others.`,
    `多边形是平的：它有长、有宽，却没有厚度。身边的大多数物体还有高度，它们的形状是**立体图形**，也就是三维空间中的图形。很多立体图形都是由一个多边形用下面两种方法之一得到的。

把一个五边形平放在桌上，让它保持水平、竖直向上平移。最后停住的五边形和出发时的一模一样，而它的 $5$ 条边在移动中各扫出一个长方形。扫出的立体图形有 $2$ 个五边形和 $5$ 个长方形作为面：它是**五棱柱**。如果改为让五边形留在桌上，在它上方取一个点，把五边形的每个角都和这个点连起来，那么五边形的每条边和这个点构成一个三角形，得到的立体图形有 $1$ 个五边形和 $5$ 个三角形作为面：它是**五棱锥**。

{{figure 0}}

两种立体图形都以它们所依托的多边形命名。这节课我们给棱柱和棱锥命名，认识表面弯曲的立体图形，并把立体图形分成只由平面多边形围成的和其他的两类。`,
  ),
  introFigures: [
    figure(
      [...prismMarks(5, 1.6, 3), ...shift(pyramidOn(5, 1.6, 3), 5)],
      "On the left, a pentagonal prism: two pentagons joined by five rectangles. On the right, a pentagonal pyramid: a pentagon with five triangles meeting at a point above it.",
      "左边是五棱柱：两个五边形由五个长方形连接。右边是五棱锥：一个五边形和交于上方一点的五个三角形。",
    ),
  ],
  knowledgePoints: [
    {
      id: "prisms-and-pyramids",
      figure: geometryDrawings2["identifying-three-dimensional-shapes#prisms-and-pyramids"],
      title: t("Prisms and pyramids", "棱柱与棱锥"),
      explanation: t(
        `A **prism** has two congruent, parallel faces called **bases**, joined by rectangles. A **pyramid** has one base, and triangles rise from the sides of the base to meet at a single point, the **apex**. So the first question about such a solid is how many bases it has: two (a prism) or one (a pyramid).

The second question is the shape of the base, which gives the name. A prism whose bases are hexagons is a **hexagonal prism**, and a pyramid whose base is a square is a **square pyramid**. A prism with rectangular bases is a **rectangular prism** (a box), and a rectangular prism whose faces are all squares is a **cube**.

For example, take a solid whose faces are $1$ hexagon and $6$ triangles. Only one face is not a triangle, so there is one base, the hexagon, and the triangles are the faces rising to the apex: the solid is a hexagonal pyramid. Each side of the hexagon carries one triangle, which is why there are exactly $6$ of them.

> **Watch out.** The name comes from the base, not from the number of faces: a hexagonal pyramid has $7$ faces, but it is not a "heptagonal" anything. And do not mix up the two kinds: triangles meeting at a point mean a pyramid, rectangles joining two bases mean a prism.`,
        `**棱柱**有两个全等且互相平行的面，叫作**底面**，两个底面之间由长方形连接。**棱锥**只有一个底面，从底面各边升起的三角形交于一点，这一点叫作棱锥的**顶点**。所以，看到这样的立体图形，先问它有几个底面：两个是棱柱，一个是棱锥。

再问底面是什么形状，名称就由它而来。底面是六边形的棱柱是**六棱柱**，底面是正方形的棱锥是**四棱锥**。底面是长方形的棱柱是**长方体**，各面都是正方形的长方体是**正方体**。

例如，一个立体图形的各面是 $1$ 个六边形和 $6$ 个三角形。只有一个面不是三角形，所以它只有一个底面，就是这个六边形，而那些三角形是升向顶点的侧面：它是六棱锥。六边形的每条边上各有一个三角形，所以三角形恰好有 $6$ 个。

> **注意。** 名称来自底面，而不是面的总数：六棱锥有 $7$ 个面，但它不叫"七"什么。也不要把两类弄混：交于一点的三角形说明是棱锥，连接两个底面的长方形说明是棱柱。`,
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 7, 8]);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const shape = kind === "prism" ? prism(n) : pyramid(n);
        const style = rng.int(0, 2);
        const p = shape.polygon;
        let desc: Text;
        let clue: Text;
        if (style === 0) {
          desc =
            kind === "prism"
              ? n === 4
                ? t("Its faces are $6$ rectangles.", "它的各面是 $6$ 个长方形。")
                : t(`Its faces are $2$ ${p.en}s and $${n}$ rectangles.`, `它的各面是 $2$ 个${p["zh-CN"]}和 $${n}$ 个长方形。`)
              : t(`Its faces are $1$ ${p.en} and $${n}$ triangles.`, `它的各面是 $1$ 个${p["zh-CN"]}和 $${n}$ 个三角形。`);
          clue =
            kind === "prism"
              ? n === 4
                ? t(
                    "All six faces are rectangles. Any two opposite ones are congruent and parallel and can serve as the bases, joined by the other four rectangles: two bases joined by rectangles make a prism.",
                    "六个面都是长方形。任意一对相对的面都全等且平行，可以看作两个底面，由另外四个长方形连接：两个底面由长方形连接，这是棱柱。",
                  )
                : t(
                    `Two faces are ${p.en}s and the others are rectangles: two congruent bases joined by rectangles make a prism.`,
                    `有两个面是${p["zh-CN"]}，其余都是长方形：两个全等的底面由长方形连接，这是棱柱。`,
                  )
              : t(
                  `One face is ${wordArticle(p.en)} ${p.en} and all the others are triangles: one base with a triangle on each of its sides makes a pyramid.`,
                  `只有一个面是${p["zh-CN"]}，其余都是三角形：一个底面、每条边上一个三角形，这是棱锥。`,
                );
        } else if (style === 1) {
          desc =
            kind === "prism"
              ? t(
                  `It has two congruent, parallel ${shape.adjective} bases joined by rectangular faces.`,
                  `它有两个全等且平行的${p["zh-CN"]}底面，由长方形的面连接。`,
                )
              : t(
                  `It has one ${shape.adjective} base, and its other faces are triangles that meet at one point.`,
                  `它有一个${p["zh-CN"]}底面，其余的面都是交于一点的三角形。`,
                );
          clue =
            kind === "prism"
              ? t("Two congruent, parallel bases joined by rectangles: that is a prism.", "两个全等且平行的底面由长方形连接：这是棱柱。")
              : t("One base, with triangles meeting at one point: that is a pyramid.", "一个底面，三角形交于一点：这是棱锥。");
        } else {
          desc =
            kind === "prism"
              ? t(
                  `It has $${2 * n}$ vertices: $${n}$ on each of two parallel bases.`,
                  `它有 $${2 * n}$ 个顶点：两个平行的底面上各有 $${n}$ 个。`,
                )
              : t(
                  `It has $${n + 1}$ vertices: $${n}$ around its base and one apex above it.`,
                  `它有 $${n + 1}$ 个顶点：底面上有 $${n}$ 个，上方还有一个顶点。`,
                );
          clue =
            kind === "prism"
              ? t(
                  "The vertices lie in two equal groups on two parallel bases, which is how the corners of a prism lie: every corner of one base has a partner on the other.",
                  "顶点平均分在两个平行的底面上，棱柱的顶点正是这样分布的：一个底面的每个角在另一个底面上都有对应的角。",
                )
              : t(
                  "All the vertices but one lie around one base, and the last one is an apex above it: that is a pyramid.",
                  "除了一个顶点，其余顶点都在一个底面上，剩下的那个是上方的顶点：这是棱锥。",
                );
        }
        const { options, correct } = shapeOptions(rng, shape, kind);
        const named = t(`${wordArticle(shape.name.en)} ${shape.name.en}`, shape.name["zh-CN"]);
        const base = t(
          kind === "prism"
            ? `Each base has $${n}$ sides, so the bases are ${p.en}s, and the solid is ${named.en}.`
            : `The base has $${n}$ sides, so it is ${wordArticle(p.en)} ${p.en}, and the solid is ${named.en}.`,
          kind === "prism"
            ? `每个底面有 $${n}$ 条边，是${p["zh-CN"]}，所以这个立体图形是${named["zh-CN"]}。`
            : `底面有 $${n}$ 条边，是${p["zh-CN"]}，所以这个立体图形是${named["zh-CN"]}。`,
        );
        const check =
          kind === "prism"
            ? t(
                `**Check.** ${named.en[0]!.toUpperCase()}${named.en.slice(1)} has $${n} + 2 = ${n + 2}$ faces ($2$ bases and $${n}$ rectangles) and $2 \\cdot ${n} = ${2 * n}$ vertices ($${n}$ on each base). That fits the description.`,
                `**检验。** ${named["zh-CN"]}有 $${n} + 2 = ${n + 2}$ 个面（$2$ 个底面和 $${n}$ 个长方形），有 $2 \\cdot ${n} = ${2 * n}$ 个顶点（每个底面上 $${n}$ 个），与描述相符。`,
              )
            : t(
                `**Check.** ${named.en[0]!.toUpperCase()}${named.en.slice(1)} has $${n} + 1 = ${n + 1}$ faces (the base and $${n}$ triangles) and $${n} + 1 = ${n + 1}$ vertices ($${n}$ on the base and the apex). That fits the description.`,
                `**检验。** ${named["zh-CN"]}有 $${n} + 1 = ${n + 1}$ 个面（底面和 $${n}$ 个三角形），有 $${n} + 1 = ${n + 1}$ 个顶点（底面上 $${n}$ 个，再加顶点），与描述相符。`,
              );
        const problem = choiceProblem({
          prompt: t(
            `A solid is described as follows. ${desc.en} What is it?`,
            `一个立体图形的描述如下。${desc["zh-CN"]}它是什么立体图形？`,
          ),
          options,
          correct,
          solution: t(
            `**Step 1: prism or pyramid.** ${clue.en}\n\n**Step 2: the base.** ${base.en}\n\n${check.en}`,
            `**第一步：棱柱还是棱锥。** ${clue["zh-CN"]}\n\n**第二步：看底面。** ${base["zh-CN"]}\n\n${check["zh-CN"]}`,
          ),
        });
        const reasons: Reason[] = options.flatMap((o): Reason[] => {
          const s = [
            prism(3),
            prism(4),
            prism(5),
            prism(6),
            prism(7),
            prism(8),
            pyramid(3),
            pyramid(4),
            pyramid(5),
            pyramid(6),
            pyramid(7),
            pyramid(8),
          ].find((x) => x.name.en === o.en);
          if (!s || o.en === shape.name.en) return [];
          const sameKind = kindOf(s) === kind;
          if (s.n === n && !sameKind)
            return [
              kind === "prism"
                ? [
                    o.en,
                    "A pyramid has only one base, with triangles meeting at an apex; this solid has two bases joined by rectangles.",
                    "棱锥只有一个底面，三角形交于顶点；这个立体图形有两个由长方形连接的底面。",
                  ]
                : [
                    o.en,
                    "A prism has two bases joined by rectangles; this solid has one base, with triangles meeting at a point.",
                    "棱柱有两个由长方形连接的底面；这个立体图形只有一个底面，三角形交于一点。",
                  ],
            ];
          if (sameKind)
            return [
              [
                o.en,
                `The kind is right, but its base has $${s.n}$ sides, not $${n}$.`,
                `类型对了，但它的底面有 $${s.n}$ 条边，而不是 $${n}$ 条。`,
              ],
            ];
          return [
            [
              o.en,
              `Both are wrong: the kind of solid and the number of sides of the base, $${s.n}$ instead of $${n}$.`,
              `类型和底面的边数都不对：边数是 $${s.n}$，而不是 $${n}$。`,
            ],
          ];
        });
        return reasoned(problem, reasons);
      },
    },
    {
      id: "solids-with-curved-surfaces",
      figure: geometryDrawings2["identifying-three-dimensional-shapes#solids-with-curved-surfaces"],
      title: t("Cylinders, cones and spheres", "圆柱、圆锥与球"),
      explanation: t(
        `Some solids have curved surfaces. A **cylinder** has two congruent, parallel circular bases joined by a curved surface: it is built like a prism, with a circle in place of a polygon. A **cone** has one circular base and a curved surface that narrows to a single point, its apex: it is built like a pyramid on a circle. A **sphere** is the set of all points in space at the same distance, the **radius**, from a center; it has no flat part at all. Half of a sphere, cut through its center, is a **hemisphere**, with one flat circular face.

To match an object with a solid, count its flat faces and look at how it ends. A roll of paper towels has two flat round ends joined by a curved side, like a prism on a circle: it is a cylinder. A funnel's opening is one circle and its sides narrow to a point: a cone.

> **Watch out.** A cylinder and a cone both have a circular base; the cylinder has **two** of them, the cone **one** and a point. And a ball is a sphere, not a circle: a circle is flat, a sphere is a solid.`,
        `有些立体图形有曲面。**圆柱**有两个全等且平行的圆形底面，由一个曲面连接：它的构造和棱柱一样，只是用圆代替了多边形。**圆锥**有一个圆形底面，曲面收拢到一点，即它的顶点：它就像以圆为底的棱锥。**球**是空间中到一个定点（球心）距离等于定长（**半径**）的所有点组成的图形，它没有任何平的部分。过球心把球截成两半，每一半是**半球**，它有一个平的圆面。

要判断一个物体对应哪种立体图形，先数它有几个平面，再看它的两端。一卷厨房纸有两个平的圆形端面，由弯曲的侧面连接，就像以圆为底的棱柱：它是圆柱。漏斗的开口是一个圆，侧面收拢到一点：它是圆锥。

> **注意。** 圆柱和圆锥都有圆形底面；圆柱有**两个**，圆锥只有**一个**，另一端是一个点。球是立体图形，不是圆：圆是平的，球是立体的。`,
      ),
      generate(rng) {
        const useObject = rng.bool(0.8);
        const [en, zh, index] = useObject ? rng.pick(everyday) : rng.pick(roundDefinitions);
        const others = rng.sample(
          everydaySolids.map((_, i) => i).filter((i) => i !== index),
          3,
        );
        const order = rng.shuffle([index, ...others]);
        const answer = everydaySolids[index]!;
        const look = everydayLooks[index]!;
        const flat = everydayFlat[index]!;
        const problem = choiceProblem({
          prompt: useObject
            ? t(`Which solid best models ${en}?`, `哪种立体图形最能表示${zh}？`)
            : t(`Which solid is described? ${en}`, `下面描述的是哪种立体图形？${zh}`),
          options: order.map((i) => everydaySolids[i]!),
          correct: order.indexOf(index),
          solution: useObject
            ? t(
                `**Step 1: the surfaces.** Picture ${en}: it has ${look.en}.\n\n**Step 2: the solid.** That describes a ${answer.en}.\n\n**Check.** Count the flat faces: a ${answer.en} has ${flat.en}, and ${en} has the same.`,
                `**第一步：看表面。** 想象${zh}：它有${look["zh-CN"]}。\n\n**第二步：找立体图形。** 这描述的是${answer["zh-CN"]}。\n\n**检验。** 数一数平面：${answer["zh-CN"]}有 ${flat["zh-CN"]}，${zh}也一样。`,
              )
            : t(
                `**Step 1: the surfaces.** The description gives ${look.en}.\n\n**Step 2: the solid.** That is the definition of a ${answer.en}.\n\n**Check.** Count the flat faces: a ${answer.en} has ${flat.en}, as the description says.`,
                `**第一步：看表面。** 描述给出的是${look["zh-CN"]}。\n\n**第二步：找立体图形。** 这正是${answer["zh-CN"]}的定义。\n\n**检验。** 数一数平面：${answer["zh-CN"]}有 ${flat["zh-CN"]}，与描述一致。`,
              ),
        });
        return reasoned(
          problem,
          others.map((i): Reason => {
            const s = everydaySolids[i]!;
            const l = everydayLooks[i]!;
            return [s.en, `A ${s.en} has ${l.en}.`, `${s["zh-CN"]}有${l["zh-CN"]}。`];
          }),
        );
      },
    },
    {
      id: "polyhedra",
      figure: geometryDrawings2["identifying-three-dimensional-shapes#polyhedra"],
      title: t("Polyhedra", "多面体"),
      explanation: t(
        `A **polyhedron** (plural *polyhedra*) is a solid whose faces are all polygons: flat pieces with straight sides. Prisms, pyramids and cubes are polyhedra. Cylinders, cones, spheres and hemispheres are not, because part of their surface is curved.

So to decide, look for a curved part. Among a triangular pyramid, a cylinder, a hexagonal prism and a cone, the pyramid has $4$ triangles and the prism $2$ hexagons and $6$ rectangles: both are polyhedra. The cylinder and the cone each have a curved side, so they are not, even though they have flat circular faces too.

> **Watch out.** Having some flat faces is not enough: a hemisphere has a flat circle, and a cylinder has two, but a circle is not a polygon, and each of them has a curved surface besides. A polyhedron has **only** polygons.`,
        `**多面体**是各面都是多边形（由线段围成的平面图形）的立体图形。棱柱、棱锥和正方体都是多面体。圆柱、圆锥、球和半球都不是多面体，因为它们的表面有一部分是弯曲的。

所以判断时，就看有没有弯曲的部分。在三棱锥、圆柱、六棱柱和圆锥中，三棱锥由 $4$ 个三角形围成，六棱柱由 $2$ 个六边形和 $6$ 个长方形围成：它们都是多面体。圆柱和圆锥都有弯曲的侧面，所以都不是，尽管它们也有平的圆面。

> **注意。** 有平面还不够：半球有一个平的圆面，圆柱有两个，但圆不是多边形，而且它们还有曲面。多面体的面**全都**是多边形。`,
      ),
      generate(rng) {
        const askPolyhedron = rng.bool();
        const odd = askPolyhedron ? rng.pick(polyhedra) : rng.pick(roundSolids);
        const rest = askPolyhedron ? rng.sample(roundSolids, 3) : rng.sample(polyhedra, 3);
        const all = rng.shuffle([odd, ...rest]);
        const listEn = `${all
          .slice(0, 3)
          .map((s) => `${wordArticle(s.en)} ${s.en}`)
          .join(", ")} and ${wordArticle(all[3]!.en)} ${all[3]!.en}`;
        const listZh = `${all
          .slice(0, 3)
          .map((s) => s["zh-CN"])
          .join("、")}和${all[3]!["zh-CN"]}`;
        const surface = (s: Text) => surfaces[s.en]!;
        const items = (locale: "en" | "zh-CN") =>
          all
            .map((s) => (locale === "en" ? `- ${wordArticle(s.en)} ${s.en}: ${surface(s).en}` : `- ${s["zh-CN"]}：${surface(s)["zh-CN"]}`))
            .join("\n");
        const A = (s: Text) => `${wordArticle(s.en)} ${s.en}`;
        return choiceProblem({
          prompt: askPolyhedron
            ? t(`Here are four solids: ${listEn}. Which of them is a polyhedron?`, `这里有四个立体图形：${listZh}。其中哪一个是多面体？`)
            : t(
                `Here are four solids: ${listEn}. Which of them is not a polyhedron?`,
                `这里有四个立体图形：${listZh}。其中哪一个不是多面体？`,
              ),
          options: all,
          correct: all.indexOf(odd),
          solution: t(
            `**Step 1: the surface of each solid.** A polyhedron has only polygons as faces, so look for a curved part:\n\n${items("en")}\n\n**Step 2: the odd one out.** ${
              askPolyhedron
                ? `Only the ${odd.en} is made of polygons alone, so it is the polyhedron.`
                : `Only the ${odd.en} has a curved surface, so it is not a polyhedron.`
            }\n\n**Check.** The other three must agree with each other: ${listed(rest.map(A)).en} all ${askPolyhedron ? "have a curved surface" : "are made of polygons alone"}, so exactly one solid is different.`,
            `**第一步：看每个立体图形的表面。** 多面体的面全都是多边形，所以找弯曲的部分：\n\n${items("zh-CN")}\n\n**第二步：找出不同的那个。** ${
              askPolyhedron ? `只有${odd["zh-CN"]}完全由多边形围成，所以它是多面体。` : `只有${odd["zh-CN"]}有曲面，所以它不是多面体。`
            }\n\n**检验。** 其余三个应当彼此一致：${rest.map((s) => s["zh-CN"]).join("、")}都${askPolyhedron ? "有曲面" : "完全由多边形围成"}，所以恰好只有一个不同。`,
          ),
        });
      },
    },
  ],
};

/** solidName names a prism or a pyramid with n sides on its base(s), or describes it when there is no name. */
function solidName(n: number, kind: "prism" | "pyramid"): Text {
  if (n <= 8) {
    const s = kind === "prism" ? prism(n) : pyramid(n);
    return t(`${wordArticle(s.name.en)} ${s.name.en}`, s.name["zh-CN"]);
  }
  return kind === "prism"
    ? t(`a prism whose bases have $${n}$ sides`, `底面有 $${n}$ 条边的棱柱`)
    : t(`a pyramid whose base has $${n}$ sides`, `底面有 $${n}$ 条边的棱锥`);
}

const counts = [
  ["faces", "面", "F"],
  ["vertices", "顶点", "V"],
  ["edges", "棱", "E"],
] as const;

/** measure is the Chinese measure word of a count: 条 for edges, 个 for faces and vertices. */
const measure = (zh: string) => (zh === "棱" ? "条" : "个");

export const facesVerticesAndEdgesOfPolyhedrons: TopicDef = {
  id: "faces-vertices-and-edges-of-polyhedrons",
  title: t("Faces, Vertices, and Edges of Polyhedrons", "多面体的面、顶点和棱"),
  summary: t(
    "Count the faces, vertices and edges of prisms and pyramids, and find the base from a count.",
    "数出棱柱和棱锥的面数、顶点数和棱数，并由这些数确定底面。",
  ),
  prerequisites: ["identifying-three-dimensional-shapes"],
  encompasses: [],
  xp: 12,
  intro: t(
    `A polyhedron is built from three kinds of parts. A **face** is one of its flat polygons, an **edge** is a segment where two faces meet, and a **vertex** is a corner where edges meet. Counting them one by one is slow and easy to get wrong, since the back of the solid is hidden. It is faster to count in groups, following how the solid is built.

Take a cube. Its faces come as a top, a bottom and $4$ sides: $6$ faces. Its vertices are $4$ around the top and $4$ around the bottom: $8$ vertices. Its edges are $4$ around the top, $4$ around the bottom and $4$ upright ones joining them: $12$ edges.

{{figure 0}}

Every prism and every pyramid can be counted the same way, from the number of sides of its base. In this lesson we find those counts for prisms, then for pyramids, and finally read them backward to find the base.`,
    `多面体由三种部分组成。**面**是它的平面多边形，**棱**是两个面相交的线段，**顶点**是棱相交的角点。一个一个地数既慢又容易出错，因为立体图形的背面看不见。按照它的构造成组地数要快得多。

以正方体为例。它的面是顶面、底面和 $4$ 个侧面：共 $6$ 个面。它的顶点是顶面一圈 $4$ 个、底面一圈 $4$ 个：共 $8$ 个顶点。它的棱是顶面一圈 $4$ 条、底面一圈 $4$ 条，再加上连接两者的 $4$ 条竖棱：共 $12$ 条棱。

{{figure 0}}

每个棱柱和棱锥都可以这样数，只要知道底面有几条边。这节课先求棱柱的这些计数，再求棱锥的，最后倒过来由计数确定底面。`,
  ),
  introFigures: [
    figure(
      boxMarks(2, 2, 2, {}),
      "A cube with its hidden edges dashed: 4 edges around the top, 4 around the bottom and 4 upright edges.",
      "一个正方体，看不见的棱画成虚线：顶面一圈 4 条棱，底面一圈 4 条，竖直的 4 条。",
    ),
  ],
  knowledgePoints: [
    {
      id: "counting-for-prisms",
      figure: geometryDrawings2["faces-vertices-and-edges-of-polyhedrons#counting-for-prisms"],
      title: t("Counting for prisms", "棱柱的计数"),
      explanation: t(
        `A prism is a base polygon copied and joined to its copy, so every count comes from the number $n$ of sides of the base:

- **faces:** the two bases and one rectangle for each side of the base, $n + 2$;
- **vertices:** the $n$ corners of each base, $2n$;
- **edges:** the $n$ sides of each base and the $n$ edges joining a corner to its copy, $3n$.

For a pentagonal prism, $n = 5$: it has $5 + 2 = 7$ faces, $2 \\cdot 5 = 10$ vertices and $3 \\cdot 5 = 15$ edges. The three counts can be checked against each other with $V - E + F = 10 - 15 + 7 = 2$, which holds for every prism, since $2n - 3n + (n + 2) = 2$.

> **Watch out.** The two bases are faces too: a pentagonal prism has $7$ faces, not $5$. And the edges are not only those of the bases ($2n$): the $n$ edges joining the bases count as well.`,
        `棱柱是把底面多边形复制一份，再与原来的底面连接起来，所以每个计数都由底面边数 $n$ 决定：

- **面：** 两个底面，再加上底面每条边对应的一个长方形，共 $n + 2$ 个；
- **顶点：** 每个底面上的 $n$ 个角，共 $2n$ 个；
- **棱：** 每个底面的 $n$ 条边，再加上连接对应角的 $n$ 条棱，共 $3n$ 条。

五棱柱的 $n = 5$：它有 $5 + 2 = 7$ 个面、$2 \\cdot 5 = 10$ 个顶点和 $3 \\cdot 5 = 15$ 条棱。三个计数可以用 $V - E + F = 10 - 15 + 7 = 2$ 互相验证；对每个棱柱这都成立，因为 $2n - 3n + (n + 2) = 2$。

> **注意。** 两个底面也是面：五棱柱有 $7$ 个面，不是 $5$ 个。棱也不只是两个底面上的（$2n$ 条），连接两个底面的 $n$ 条棱也要算上。`,
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const which = rng.int(0, 2);
        const [en, zh] = counts[which]!;
        const values = [n + 2, 2 * n, 3 * n];
        const name = solidName(n, "prism");
        const answer = values[which]!;
        const group = [
          t(
            `The faces are the $2$ bases and one rectangle for each of the $${n}$ sides of a base:${steps(`F = ${n} + 2 = ${n + 2}`)}`,
            `面是 $2$ 个底面，再加上底面 $${n}$ 条边各对应的一个长方形：${steps(`F = ${n} + 2 = ${n + 2}`)}`,
          ),
          t(
            `The vertices are the $${n}$ corners of the bottom base and the $${n}$ corners of the top base:${steps(`V = 2 \\cdot ${n} = ${2 * n}`)}`,
            `顶点是下底面的 $${n}$ 个角和上底面的 $${n}$ 个角：${steps(`V = 2 \\cdot ${n} = ${2 * n}`)}`,
          ),
          t(
            `The edges are the $${n}$ sides of the bottom base, the $${n}$ sides of the top base and the $${n}$ edges joining them:${steps(`E = 3 \\cdot ${n} = ${3 * n}`)}`,
            `棱是下底面的 $${n}$ 条边、上底面的 $${n}$ 条边和连接两者的 $${n}$ 条棱：${steps(`E = 3 \\cdot ${n} = ${3 * n}`)}`,
          ),
        ][which]!;
        return {
          ...numberProblem({
            prompt: t(`How many ${en} does ${name.en} have?`, `${name["zh-CN"]}有多少${measure(zh)}${zh}？`),
            answer,
            form: "integer",
            wrong: [...values, n, n + 1, 2 * n + 2],
            solution: t(
              `**Step 1: the base.** Each base has $n = ${n}$ sides.

{{figure 0}}

**Step 2: count in groups.** ${group.en}**Check.** With all three counts, $V - E + F = ${2 * n} - ${3 * n} + ${n + 2} = 2$, as Euler's formula requires.`,
              `**第一步：看底面。** 每个底面有 $n = ${n}$ 条边。

{{figure 0}}

**第二步：成组地数。** ${group["zh-CN"]}**检验。** 用三个计数验证：$V - E + F = ${2 * n} - ${3 * n} + ${n + 2} = 2$，符合欧拉公式。`,
            ),
          }),
          solutionFigures: [
            figure(
              prismMarks(n, 1.6, 2.6),
              `A prism whose bases have ${n} sides, with its hidden edges dashed.`,
              `底面有 ${n} 条边的棱柱，看不见的棱画成虚线。`,
            ),
          ],
        };
      },
    },
    {
      id: "counting-for-pyramids",
      figure: geometryDrawings2["faces-vertices-and-edges-of-polyhedrons#counting-for-pyramids"],
      title: t("Counting for pyramids", "棱锥的计数"),
      explanation: t(
        `A pyramid is a base polygon with every corner joined to one apex, so again every count comes from the number $n$ of sides of the base:

- **faces:** the base and one triangle on each side of it, $n + 1$;
- **vertices:** the $n$ corners of the base and the apex, $n + 1$;
- **edges:** the $n$ sides of the base and the $n$ edges rising from its corners to the apex, $2n$.

For a hexagonal pyramid, $n = 6$: it has $7$ faces, $7$ vertices and $12$ edges. A pyramid always has as many faces as vertices, and the check $V - E + F = (n + 1) - 2n + (n + 1) = 2$ holds for each of them; here $7 - 12 + 7 = 2$.

> **Watch out.** A pyramid has only one base, so do not use the prism counts: its faces are $n + 1$, not $n + 2$, and its edges $2n$, not $3n$. Remember the apex among the vertices.`,
        `棱锥是把底面多边形的每个角都和同一个顶点相连，所以每个计数同样由底面边数 $n$ 决定：

- **面：** 底面，再加上底面每条边上的一个三角形，共 $n + 1$ 个；
- **顶点：** 底面的 $n$ 个角，再加上顶点，共 $n + 1$ 个；
- **棱：** 底面的 $n$ 条边，再加上从各角升向顶点的 $n$ 条棱，共 $2n$ 条。

六棱锥的 $n = 6$：它有 $7$ 个面、$7$ 个顶点和 $12$ 条棱。棱锥的面数总等于顶点数，而且对每个棱锥都有 $V - E + F = (n + 1) - 2n + (n + 1) = 2$；这里 $7 - 12 + 7 = 2$。

> **注意。** 棱锥只有一个底面，不要套用棱柱的计数：它的面数是 $n + 1$，不是 $n + 2$；棱数是 $2n$，不是 $3n$。数顶点时别忘了最上面的那个顶点。`,
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const which = rng.int(0, 2);
        const [en, zh] = counts[which]!;
        const values = [n + 1, n + 1, 2 * n];
        const name = solidName(n, "pyramid");
        const answer = values[which]!;
        const group = [
          t(
            `The faces are the base and one triangle on each of its $${n}$ sides:${steps(`F = ${n} + 1 = ${n + 1}`)}`,
            `面是底面，再加上它 $${n}$ 条边上各一个三角形：${steps(`F = ${n} + 1 = ${n + 1}`)}`,
          ),
          t(
            `The vertices are the $${n}$ corners of the base and the apex:${steps(`V = ${n} + 1 = ${n + 1}`)}`,
            `顶点是底面的 $${n}$ 个角，再加上顶点：${steps(`V = ${n} + 1 = ${n + 1}`)}`,
          ),
          t(
            `The edges are the $${n}$ sides of the base and the $${n}$ edges rising from its corners to the apex:${steps(`E = 2 \\cdot ${n} = ${2 * n}`)}`,
            `棱是底面的 $${n}$ 条边，再加上从各角升向顶点的 $${n}$ 条棱：${steps(`E = 2 \\cdot ${n} = ${2 * n}`)}`,
          ),
        ][which]!;
        return {
          ...numberProblem({
            prompt: t(`How many ${en} does ${name.en} have?`, `${name["zh-CN"]}有多少${measure(zh)}${zh}？`),
            answer,
            form: "integer",
            wrong: [n, n + 2, 2 * n, 3 * n, 2 * n + 2],
            solution: t(
              `**Step 1: the base.** The base has $n = ${n}$ sides.

{{figure 0}}

**Step 2: count in groups.** ${group.en}**Check.** With all three counts, $V - E + F = ${n + 1} - ${2 * n} + ${n + 1} = 2$, as Euler's formula requires.`,
              `**第一步：看底面。** 底面有 $n = ${n}$ 条边。

{{figure 0}}

**第二步：成组地数。** ${group["zh-CN"]}**检验。** 用三个计数验证：$V - E + F = ${n + 1} - ${2 * n} + ${n + 1} = 2$，符合欧拉公式。`,
            ),
          }),
          solutionFigures: [
            figure(
              pyramidOn(n, 1.6, 2.8),
              `A pyramid whose base has ${n} sides, with its hidden edges dashed.`,
              `底面有 ${n} 条边的棱锥，看不见的棱画成虚线。`,
            ),
          ],
        };
      },
    },
    {
      id: "finding-the-base",
      figure: gradeDrawings4["faces-vertices-and-edges-of-polyhedrons#finding-the-base"],
      title: t("Finding the base from a count", "由计数确定底面"),
      explanation: t(
        `Each count is a simple expression in $n$, the number of sides of the base, so it can be read backward: write the expression, set it equal to the count, and solve for $n$.

A pyramid with $16$ edges: the edges of a pyramid are $2n$, so $2n = 16$ and $n = 8$. Its base is an octagon. A prism with $9$ faces: the faces of a prism are $n + 2$, so $n + 2 = 9$ and $n = 7$; each base is a heptagon. To be sure, count forward again: a heptagonal prism has $7 + 2 = 9$ faces.

> **Watch out.** Use the expression for the right solid and the right count. A prism has $3n$ edges but a pyramid $2n$; a prism has $n + 2$ faces but a pyramid $n + 1$. Dividing $16$ edges by $3$ would not even give a whole number of sides.`,
        `每个计数都是关于底面边数 $n$ 的简单式子，所以可以倒过来用：写出式子，令它等于已知的计数，解出 $n$。

一个有 $16$ 条棱的棱锥：棱锥的棱数是 $2n$，所以 $2n = 16$，$n = 8$，底面是八边形。一个有 $9$ 个面的棱柱：棱柱的面数是 $n + 2$，所以 $n + 2 = 9$，$n = 7$，每个底面是七边形。为了确认，再正着数一遍：七棱柱有 $7 + 2 = 9$ 个面。

> **注意。** 要用对应立体图形、对应计数的式子。棱柱有 $3n$ 条棱，棱锥只有 $2n$ 条；棱柱有 $n + 2$ 个面，棱锥只有 $n + 1$ 个。把 $16$ 条棱除以 $3$，连整数边数都得不到。`,
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const which = rng.int(0, 2);
        const [en, zh, letter] = counts[which]!;
        const formula = kind === "prism" ? ["n + 2", "2n", "3n"][which]! : ["n + 1", "n + 1", "2n"][which]!;
        const value = kind === "prism" ? [n + 2, 2 * n, 3 * n][which]! : [n + 1, n + 1, 2 * n][which]!;
        const wrong = [value, value - 1, value - 2, value / 2, value / 3].filter((w) => Number.isInteger(w) && w > 0);
        const undo = formula.startsWith("n +")
          ? t(`subtract $${formula.slice(4)}$ from both sides`, `两边同时减去 $${formula.slice(4)}$`)
          : t(`divide both sides by $${formula[0]}$`, `两边同时除以 $${formula[0]}$`);
        const why =
          kind === "prism"
            ? [
                t("the two bases and one rectangle for each side", "两个底面，加上每条边对应的一个长方形"),
                t("$n$ corners on each of the two bases", "两个底面上各有 $n$ 个角"),
                t("$n$ sides on each base and $n$ edges joining them", "每个底面 $n$ 条边，再加上连接它们的 $n$ 条棱"),
              ][which]!
            : [
                t("the base and one triangle on each side", "底面，加上每条边上的一个三角形"),
                t("the $n$ corners of the base and the apex", "底面的 $n$ 个角，再加上顶点"),
                t("$n$ sides of the base and $n$ edges up to the apex", "底面的 $n$ 条边，再加上通向顶点的 $n$ 条棱"),
              ][which]!;
        const word = kind === "prism" ? t("prism", "棱柱") : t("pyramid", "棱锥");
        return numberProblem({
          prompt:
            kind === "prism"
              ? t(
                  `A prism has $${value}$ ${en}. How many sides does each of its bases have?`,
                  `一个棱柱有 $${value}$ ${measure(zh)}${zh}。它的每个底面有几条边？`,
                )
              : t(
                  `A pyramid has $${value}$ ${en}. How many sides does its base have?`,
                  `一个棱锥有 $${value}$ ${measure(zh)}${zh}。它的底面有几条边？`,
                ),
          answer: n,
          form: "integer",
          wrong,
          solution: t(
            `**Step 1: the expression.** A ${word.en} whose base has $n$ sides has $${letter} = ${formula}$ ${en}: ${why.en}.

**Step 2: solve for $n$.** Set the expression equal to the count, then ${undo.en}:${steps(`${formula} = ${value}`, `n = ${n}`)}**Check.** Count forward: a ${word.en} whose base has $${n}$ sides has $${formula.replace("n", ` \\cdot ${n}`).replace(/^ \\cdot /, "")} = ${value}$ ${en}, as given.`,
            `**第一步：写出式子。** 底面有 $n$ 条边的${word["zh-CN"]}有 $${letter} = ${formula}$ ${measure(zh)}${zh}：${why["zh-CN"]}。

**第二步：解出 $n$。** 令式子等于已知的计数，再${undo["zh-CN"]}：${steps(`${formula} = ${value}`, `n = ${n}`)}**检验。** 正着数一遍：底面有 $${n}$ 条边的${word["zh-CN"]}有 $${formula.replace("n", ` \\cdot ${n}`).replace(/^ \\cdot /, "")} = ${value}$ ${measure(zh)}${zh}，与已知相符。`,
          ),
        });
      },
    },
  ],
};

/** cubeNetCells is the 1-4-1 net of a cube: a row of four squares with one square above column a and one below column b. */
const cubeNetCells = (a: number, b: number): Cell[] => [
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [a, 2],
  [b, 0],
];

/** cubeNetOpposite are the pairs of opposite faces of a 1-4-1 net, by index into cubeNetCells. */
const cubeNetOpposite = [2, 3, 0, 1, 5, 4];

export const netsOfPolyhedrons: TopicDef = {
  id: "nets-of-polyhedrons",
  title: t("Nets of Polyhedrons", "多面体的展开图"),
  summary: t(
    "Identify the solid a net folds into, find opposite faces of a cube from its net, and tell which patterns are nets of a cube.",
    "判断展开图折成的立体图形，由展开图找出正方体的相对面，并判断哪些图形是正方体的展开图。",
  ),
  prerequisites: ["faces-vertices-and-edges-of-polyhedrons"],
  encompasses: [{ topic: "identifying-three-dimensional-shapes", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.6.G.A.4"],
  intro: t(
    `Cut a cardboard box along some of its edges and press it flat: the faces stay joined edge to edge, and the box becomes one flat pattern. Such a pattern is a **net** of the solid. Folding it back along the same edges rebuilds the solid, so a net has exactly the faces of the solid, each once.

Take a square pyramid. Cut along the $4$ edges that rise to the apex, and the $4$ triangles fall open around the square base, each still attached to one side of it:

{{figure 0}}

The net shows all $5$ faces at once, a square and $4$ triangles, which is why nets are used to find surface areas later on. In this lesson we read the solid from its net, find which faces of a cube end up opposite each other, and tell which patterns of six squares fold into a cube.`,
    `把一个纸箱沿着其中一些棱剪开，压平：各面仍沿着棱连在一起，纸箱变成了一个平面图形。这样的图形叫作这个立体图形的**展开图**。沿着同样的棱折回去，就又得到原来的立体图形，所以展开图恰好包含立体图形的所有面，每个面一次。

以四棱锥为例。沿着通向顶点的 $4$ 条棱剪开，$4$ 个三角形就在正方形底面周围摊开，每个三角形仍连在底面的一条边上：

{{figure 0}}

展开图把 $5$ 个面（一个正方形和 $4$ 个三角形）同时摆在眼前，所以后面求表面积时会用到它。这节课我们由展开图判断立体图形，找出正方体折好后哪两个面相对，并判断哪些由六个正方形组成的图形能折成正方体。`,
  ),
  introFigures: [
    figure(
      [...pyramidOn(4, 1.6, 3), ...shift(pyramidNet(4, 1.4), 5, -0.5)],
      "On the left, a square pyramid. On the right, its net: a square with a triangle attached to each of its four sides.",
      "左边是一个四棱锥。右边是它的展开图：正方形的四条边上各连着一个三角形。",
    ),
  ],
  knowledgePoints: [
    {
      id: "folding-a-net",
      figure: geometryDrawings2["nets-of-polyhedrons#folding-a-net"],
      title: t("The solid of a net", "展开图对应的立体图形"),
      explanation: t(
        `A **net** of a polyhedron is a flat pattern of its faces, joined edge to edge, that folds up into the solid. To read a net, sort its faces the way the solid is built.

A net of a prism has **two** copies of the base and a strip of rectangles, one for each side of the base: the strip wraps around to form the sides, and the two bases close the ends. A net of a pyramid has **one** base with a triangle on each of its sides: the triangles fold up and meet at the apex.

So a net made of $2$ triangles and a strip of $3$ rectangles folds into a triangular prism: the strip closes into a ring of $3$ sides, and the triangles cap its two ends.

> **Watch out.** Name the solid by its base, not by the number of rectangles or triangles you see first: in a net of a hexagonal prism, the $6$ rectangles are the sides and the two hexagons are the bases. A net with triangles is not always a pyramid: what matters is whether the triangles surround one base.`,
        `多面体的**展开图**是把它的各面沿棱连接、平铺在平面上的图形，折起来就得到这个立体图形。看展开图时，按立体图形的构造给各面分类。

棱柱的展开图有**两个**底面和一排长方形，底面的每条边对应一个长方形：这排长方形卷起来围成侧面，两个底面封住两端。棱锥的展开图只有**一个**底面，底面的每条边上各有一个三角形：这些三角形折起来交于顶点。

所以由 $2$ 个三角形和一排 $3$ 个长方形组成的展开图折起来是三棱柱：这排长方形围成三个侧面，两个三角形封住两端。

> **注意。** 要按底面命名，而不是按先看到的长方形或三角形的个数：六棱柱的展开图中，$6$ 个长方形是侧面，两个六边形才是底面。有三角形的展开图也不一定是棱锥：关键要看这些三角形是不是围着同一个底面。`,
      ),
      generate(rng) {
        const n = rng.int(3, 8);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const shape = kind === "prism" ? prism(n) : pyramid(n);
        const marks =
          kind === "prism" ? prismNet(n, rng.int(0, n - 1), rng.pick([2.5, 3, 3.5, 4])) : pyramidNet(n, rng.pick([1.6, 2, 2.4, 2.8]));
        const { options, correct } = shapeOptions(rng, shape, kind);
        const p = shape.polygon;
        const named = t(`${wordArticle(shape.name.en)} ${shape.name.en}`, shape.name["zh-CN"]);
        const faces = kind === "prism" ? n + 2 : n + 1;
        return {
          ...choiceProblem({
            prompt: t("Which solid does this net fold into?", "这个展开图折起来是什么立体图形？"),
            options,
            correct,
            solution:
              kind === "prism"
                ? t(
                    `**Step 1: sort the faces.** The net has two ${p.en}s and a strip of $${n}$ rectangles. Two copies of one polygon with a strip of rectangles is the net of a prism: the strip wraps around into the sides and the two ${p.en}s close the ends.

**Step 2: name it.** The bases are ${p.en}s, so the net folds into ${named.en}.

{{figure 0}}

**Check.** ${named.en[0]!.toUpperCase()}${named.en.slice(1)} has $${n} + 2 = ${faces}$ faces, and the net has $2 + ${n} = ${faces}$ polygons: every face appears once.`,
                    `**第一步：给各面分类。** 展开图有两个${p["zh-CN"]}和一排 $${n}$ 个长方形。同一个多边形的两个副本加一排长方形，是棱柱的展开图：这排长方形卷起来成为侧面，两个${p["zh-CN"]}封住两端。

**第二步：命名。** 底面是${p["zh-CN"]}，所以展开图折起来是${named["zh-CN"]}。

{{figure 0}}

**检验。** ${named["zh-CN"]}有 $${n} + 2 = ${faces}$ 个面，展开图有 $2 + ${n} = ${faces}$ 个多边形：每个面恰好出现一次。`,
                  )
                : t(
                    `**Step 1: sort the faces.** The net has one ${p.en} with a triangle on each of its $${n}$ sides. One base with a triangle on every side is the net of a pyramid: the triangles fold up and meet at the apex.

**Step 2: name it.** The base is ${wordArticle(p.en)} ${p.en}, so the net folds into ${named.en}.

{{figure 0}}

**Check.** ${named.en[0]!.toUpperCase()}${named.en.slice(1)} has $${n} + 1 = ${faces}$ faces, and the net has $1 + ${n} = ${faces}$ polygons: every face appears once.`,
                    `**第一步：给各面分类。** 展开图有一个${p["zh-CN"]}，它的 $${n}$ 条边上各有一个三角形。一个底面、每条边上一个三角形，是棱锥的展开图：三角形折起来交于顶点。

**第二步：命名。** 底面是${p["zh-CN"]}，所以展开图折起来是${named["zh-CN"]}。

{{figure 0}}

**检验。** ${named["zh-CN"]}有 $${n} + 1 = ${faces}$ 个面，展开图有 $1 + ${n} = ${faces}$ 个多边形：每个面恰好出现一次。`,
                  ),
          }),
          figure: figure(
            marks,
            kind === "prism"
              ? `A net: a row of ${n} rectangles with a ${p.en} attached above and below one of them.`
              : `A net: a ${p.en} with a triangle attached to each side.`,
            kind === "prism"
              ? `一个展开图：一排 ${n} 个长方形，其中一个的上下各连着一个${p["zh-CN"]}。`
              : `一个展开图：一个${p["zh-CN"]}，每条边上连着一个三角形。`,
          ),
          solutionFigures: [
            figure(
              kind === "prism" ? prismMarks(n, 1.6, 2.6) : pyramidOn(n, 1.6, 2.8),
              `The net folded up: ${named.en}.`,
              `展开图折起来：${named["zh-CN"]}。`,
            ),
          ],
        };
      },
    },
    {
      id: "opposite-faces-of-a-cube",
      figure: geometryDrawings2["nets-of-polyhedrons#opposite-faces-of-a-cube"],
      title: t("Opposite faces of a cube", "正方体的相对面"),
      explanation: t(
        `A cube has $6$ square faces in $3$ pairs of opposite faces, such as top and bottom. Two faces that share an edge are neighbors on the cube, never opposite. So in a net, look for squares that cannot touch.

In a straight row of squares, fold them up one after another: the first square is the bottom, the second stands up as the front, the third lies on top, and the fourth stands as the back. So the first and third are opposite, and so are the second and fourth: **two squares in a row with exactly one square between them are opposite**. A square attached above the row and one attached below it fold onto the two remaining sides, opposite each other.

For a net with a row $P, Q, R, S$, the square $T$ above $Q$ and $U$ below $S$: the pairs are $P$ and $R$, $Q$ and $S$, $T$ and $U$.

> **Watch out.** A square next to the given one in the net is never its opposite: they share an edge, so they meet along it on the cube. Skip exactly **one** square along a row, not two.`,
        `正方体有 $6$ 个正方形的面，组成 $3$ 对相对面，例如顶面和底面。有公共棱的两个面在正方体上是相邻的，不可能相对。所以在展开图中，要找的是不可能挨在一起的正方形。

把一行正方形依次折起来：第一个当底面，第二个立起来成为前面，第三个盖在顶上，第四个立起来成为后面。所以第一个和第三个相对，第二个和第四个也相对：**同一行里中间恰好隔着一个正方形的两个正方形是相对面**。连在这一行上方和下方的两个正方形折到剩下的两侧，彼此相对。

一个展开图有一行正方形 $P, Q, R, S$，$T$ 连在 $Q$ 上方，$U$ 连在 $S$ 下方：三对相对面是 $P$ 和 $R$、$Q$ 和 $S$、$T$ 和 $U$。

> **注意。** 展开图中与已知正方形相邻的正方形一定不是它的相对面：它们有公共边，在正方体上沿这条棱相接。沿一行只能隔开**一个**正方形，不是两个。`,
      ),
      generate(rng) {
        const a = rng.int(0, 3);
        const b = rng.int(0, 3);
        const labels = rng.shuffle(["A", "B", "C", "D", "E", "F"]);
        const asked = rng.int(0, 5);
        const opposite = cubeNetOpposite[asked]!;
        const options = labels.filter((_, i) => i !== asked).sort();
        const label = labels[asked]!;
        const answer = labels[opposite]!;
        const rowCase = asked < 4;
        const cells = cubeNetCells(a, b);
        const pairList = [0, 1, 4].map((i) => `${labels[i]} – ${labels[cubeNetOpposite[i]!]}`);
        const pairs = pairList.join(", ");
        const touches = (i: number, j: number) => Math.abs(cells[i]![0] - cells[j]![0]) + Math.abs(cells[i]![1] - cells[j]![1]) === 1;
        const problem = choiceProblem({
          prompt: t(
            `The net is folded into a cube. Which face is opposite face ${label}?`,
            `把这个展开图折成正方体。哪个面与面 ${label} 相对？`,
          ),
          options: options.map((o) => t(`Face ${o}`, `面 ${o}`)),
          correct: options.indexOf(answer),
          solution: t(
            `**Step 1: find face ${label}.** ${
              rowCase
                ? `Face ${label} lies in the row of four squares.`
                : `Face ${label} is one of the two squares attached to the row of four, ${asked === 4 ? "above" : "below"} it.`
            }

**Step 2: skip one square.** ${
              rowCase
                ? `Folding the row up one square after another, every other square lands opposite: faces ${label} and ${answer} have exactly one square between them, so they are opposite.`
                : `The square above the row and the square below it fold onto the two sides the row leaves open, one on each side: faces ${label} and ${answer} are opposite.`
            }

{{figure 0}}

**Check.** The three pairs of opposite faces are ${pairs}: each of the six letters appears exactly once, and no pair shares an edge in the net.`,
            `**第一步：找到面 ${label}。** ${
              rowCase
                ? `面 ${label} 在四个一行的正方形中。`
                : `面 ${label} 是连在四个一行的正方形${asked === 4 ? "上方" : "下方"}的那个正方形。`
            }

**第二步：隔开一个正方形。** ${
              rowCase
                ? `把这一行依次折起来，每隔一个正方形就相对：面 ${label} 和面 ${answer} 中间恰好隔着一个正方形，所以它们相对。`
                : `这一行上方和下方的正方形分别折到这一行留出的两侧：面 ${label} 和面 ${answer} 相对。`
            }

{{figure 0}}

**检验。** 三对相对面是 ${pairList.join("、")}：六个字母各出现一次，而且每一对在展开图中都没有公共边。`,
          ),
        });
        return {
          ...reasoned(
            problem,
            labels.flatMap((o, j): Reason[] =>
              j === asked || j === opposite
                ? []
                : [
                    touches(asked, j)
                      ? [
                          `Face ${o}`,
                          `Face ${o} shares an edge with face ${label} in the net, so the two meet along that edge.`,
                          `面 ${o} 在展开图中与面 ${label} 有公共边，折好后两者沿这条棱相接。`,
                        ]
                      : [
                          `Face ${o}`,
                          `Face ${o} is opposite face ${labels[cubeNetOpposite[j]!]}, so it is a neighbor of face ${label}.`,
                          `面 ${o} 与面 ${labels[cubeNetOpposite[j]!]} 相对，所以它与面 ${label} 相邻。`,
                        ],
                  ],
            ),
          ),
          figure: figure(
            squaresNet(cells, labels),
            "A net of a cube: a row of four squares with one square above and one below, labeled with letters.",
            "一个正方体的展开图：一行四个正方形，上方和下方各连一个正方形，各面标有字母。",
          ),
          solutionFigures: [
            figure(
              squaresNet(cells, labels, [asked, opposite]),
              `The net with faces ${label} and ${answer} highlighted: they are opposite.`,
              `突出显示面 ${label} 和面 ${answer} 的展开图：它们相对。`,
            ),
          ],
        };
      },
    },
    {
      id: "nets-of-a-cube",
      figure: geometryDrawings2["nets-of-polyhedrons#nets-of-a-cube"],
      title: t("Is it a net of a cube?", "是不是正方体的展开图"),
      explanation: t(
        `Not every pattern of six squares folds into a cube. Fold it in your mind, one square at a time: if two squares land on the same face, another face is left open, and the pattern is not a net.

- A row of four squares wraps around into a ring of four sides; a fifth square in the row folds back onto the first.
- The ring leaves two ends open, one on each side of the row, so the other two squares must sit on **opposite** sides of the row. Two squares on the same side both close the same end.
- A $2 \\times 3$ block of squares has corners where $4$ squares meet, but at a corner of a cube only $3$ faces meet, so it cannot fold closed.

So a row of four squares with one square attached above it and one below it, anywhere along the row, always folds into a cube.

> **Watch out.** Six squares joined edge to edge are not enough. Check where the two extra squares sit: both above the row, or a row of five, means the pattern is not a net.`,
        `并不是任意六个正方形拼成的图形都能折成正方体。在脑中一个面一个面地折：如果有两个正方形落在同一个面上，就会有另一个面空着，这个图形就不是展开图。

- 一行四个正方形卷起来围成四个侧面；如果这一行有第五个正方形，它会折回到第一个上面。
- 四个侧面围好后，两端各留一个开口，分别在这一行的两侧，所以另外两个正方形必须连在这一行**相对的两侧**。连在同一侧的两个正方形会封住同一个开口。
- $2 \\times 3$ 的正方形方块里有 $4$ 个正方形交于一点的角，而正方体的每个角只有 $3$ 个面相交，所以它折不成封闭的正方体。

所以一行四个正方形，上方连一个、下方连一个（连在这一行的任何位置），一定能折成正方体。

> **注意。** 六个正方形沿边连在一起还不够。要看另外两个正方形连在哪里：都在这一行的同一侧，或者五个排成一行，就不是展开图。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        let cells: Cell[];
        let reason: Text;
        let check: Text;
        if (kind <= 2) {
          const [a, b] = [rng.int(0, 3), rng.int(0, 3)];
          cells = cubeNetCells(a, b);
          reason = t(
            "The row of four squares wraps around into the four sides of the cube. The square above the row and the square below it fold onto the two open ends, one each.",
            "一行四个正方形卷起来成为正方体的四个侧面。这一行上方和下方的正方形分别折到两端的开口上，各封一个。",
          );
          check = t(
            `**Check.** List the opposite faces: squares $1$ and $3$ of the row, squares $2$ and $4$, and the squares above and below. That is three pairs using all six squares once, as a cube needs.`,
            `**检验。** 列出相对面：这一行的第 $1$ 个和第 $3$ 个、第 $2$ 个和第 $4$ 个，以及上方和下方的两个。共三对，六个正方形各用一次，正好是正方体需要的。`,
          );
        } else if (kind === 3) {
          const a = rng.int(0, 2);
          const b = rng.int(a + 1, 3);
          const side = rng.pick([0, 2]);
          cells = [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [a, side],
            [b, side],
          ];
          reason = t(
            `The row of four squares wraps around into the four sides, leaving one end open on each side of the row. Both extra squares are ${side === 2 ? "above" : "below"} the row, so they fold onto the same end.`,
            `一行四个正方形卷起来成为四个侧面，这一行两侧各留一个开口。两个多出的正方形都在这一行的${side === 2 ? "上方" : "下方"}，所以会折到同一个开口上。`,
          );
          check = t(
            `**Check.** The end on the ${side === 2 ? "lower" : "upper"} side of the row gets no square at all, so the folded shape has a hole: it is not a cube.`,
            `**检验。** 这一行${side === 2 ? "下方" : "上方"}的开口一个正方形也没有，折出的图形有一个洞，不是正方体。`,
          );
        } else if (kind === 4) {
          cells = [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [rng.int(0, 4), rng.pick([0, 2])],
          ];
          reason = t(
            "The first four squares of the row already wrap around into a closed ring of four sides, so the fifth square of the row folds back onto the first.",
            "这一行的前四个正方形已经卷成封闭的一圈四个侧面，所以第五个正方形会折回到第一个上面。",
          );
          check = t(
            "**Check.** With two squares on one face, only five faces are covered and one end of the ring stays open.",
            "**检验。** 有两个正方形落在同一个面上，只盖住了五个面，这一圈的一端仍然空着。",
          );
        } else {
          const tall = rng.bool();
          cells = tall
            ? [
                [0, 0],
                [1, 0],
                [0, 1],
                [1, 1],
                [0, 2],
                [1, 2],
              ]
            : [
                [0, 0],
                [1, 0],
                [2, 0],
                [0, 1],
                [1, 1],
                [2, 1],
              ];
          reason = t(
            "In a $2 \\times 3$ block, four squares meet at each of the two inner corners.",
            "在 $2 \\times 3$ 的方块里，两个内部的角处各有四个正方形相交。",
          );
          check = t(
            "**Check.** At a corner of a cube only three faces meet, so four squares around one point cannot all fold onto a cube.",
            "**检验。** 正方体的每个角只有三个面相交，所以围着一点的四个正方形不可能都折到正方体上。",
          );
        }
        const rowOfFour = t(
          "Yes, because it is a row of four squares with one above and one below.",
          "能，因为它是一行四个正方形，上方和下方各连一个。",
        );
        const sameSide = t(
          "No, because two squares on the same side of a row of four land on the same face.",
          "不能，因为连在一行四个正方形同一侧的两个正方形会落在同一个面上。",
        );
        const rowOfFive = t("No, because a row of five squares overlaps itself.", "不能，因为一行五个正方形折起来会重叠。");
        const block = t("No, because a $2 \\times 3$ block cannot fold closed.", "不能，因为 $2 \\times 3$ 的方块无法折成封闭的正方体。");
        const verdict =
          kind <= 2
            ? t("So it is a net of a cube.", "所以它是正方体的展开图。")
            : t("So it is not a net of a cube.", "所以它不是正方体的展开图。");
        return {
          ...reasonChoice(rng, {
            prompt: t("Can this pattern of six squares be folded into a cube?", "这六个正方形组成的图形能折成正方体吗？"),
            correct: kind <= 2 ? rowOfFour : kind === 3 ? sameSide : kind === 4 ? rowOfFive : block,
            wrong: [rowOfFour, sameSide, rowOfFive, block],
            solution: t(
              `**Fold it in your mind.** ${reason.en} ${verdict.en}\n\n${check.en}`,
              `**在脑中折一折。** ${reason["zh-CN"]}${verdict["zh-CN"]}\n\n${check["zh-CN"]}`,
            ),
          }),
          figure: figure(squaresNet(cells), "A pattern of six squares joined edge to edge.", "由六个正方形沿边连接组成的图形。"),
        };
      },
    },
  ],
};

/** rightTriples are Pythagorean triples a, b, c with a² + b² = c². */
const rightTriples = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
] as const;

export const findingSurfaceAreasUsingNets: TopicDef = {
  id: "finding-surface-areas-using-nets",
  title: t("Finding Surface Areas Using Nets", "用展开图求表面积"),
  summary: t(
    "Find the surface area of boxes, triangular prisms and square pyramids as the area of their nets.",
    "把长方体、三棱柱和四棱锥的表面积当作展开图的面积来求。",
  ),
  prerequisites: ["nets-of-polyhedrons", "areas-of-triangles"],
  encompasses: [
    { topic: "areas-of-triangles", weight: 0.3 },
    { topic: "area-of-a-rectangle-by-multiplying", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.6.G.A.4"],
  intro: t(
    `How much wrapping paper covers a box exactly, with no overlap? The paper must cover every face once, so the answer is the total area of the faces: the **surface area** of the solid. It is measured in square units, like any area.

A net makes this easy to see, since it lays every face flat, side by side. Take a cube with edges of $3$ cm. Its net is $6$ squares, each $3 \\times 3 = 9\\text{ cm}^2$:

{{figure 0}}

So the surface area is $6 \\cdot 9 = 54\\text{ cm}^2$. Unfolding changes the arrangement of the faces, not their areas, so the area of the net is the surface area of the solid. In this lesson we find the surface areas of boxes, triangular prisms and square pyramids by adding up the areas of the faces in their nets.`,
    `正好包住一个盒子、没有重叠，需要多少包装纸？纸必须把每个面都盖住一次，所以答案是各面面积的总和：这个立体图形的**表面积**。和其他面积一样，它用面积单位计量。

展开图让这一点一目了然，因为它把所有面并排平铺开来。以棱长为 $3$ 厘米的正方体为例。它的展开图由 $6$ 个正方形组成，每个的面积是 $3 \\times 3 = 9\\text{ cm}^2$：

{{figure 0}}

所以表面积是 $6 \\cdot 9 = 54\\text{ cm}^2$。展开只改变各面的摆放位置，不改变它们的面积，所以展开图的面积就是立体图形的表面积。这节课我们把长方体、三棱柱和四棱锥展开图中各面的面积加起来，求出它们的表面积。`,
  ),
  introFigures: [
    figure(
      [...squaresNet(cubeNetCells(1, 1), ["9", "9", "9", "9", "9", "9"]), { kind: "side", a: [0, 2], b: [0, 1], text: "3 cm" }],
      "A net of a cube with edges of 3 cm: six squares, each with an area of 9 square centimeters.",
      "棱长 3 厘米的正方体的展开图：六个正方形，每个面积 9 平方厘米。",
    ),
  ],
  knowledgePoints: [
    {
      id: "nets-of-boxes",
      figure: geometryDrawings2["finding-surface-areas-using-nets#nets-of-boxes"],
      title: t("Nets of boxes", "长方体的展开图"),
      explanation: t(
        `The **surface area** of a polyhedron is the total area of its faces, which is the area of its net. A box $l$ long, $w$ wide and $h$ high has $6$ rectangular faces, and opposite faces are equal: the top and bottom are $l \\times w$, the front and back $l \\times h$, the two ends $w \\times h$. So

$$S = 2lw + 2lh + 2wh.$$

For a box $6$ cm long, $4$ cm wide and $3$ cm high: the top and bottom are $24\\text{ cm}^2$ each, the front and back $18\\text{ cm}^2$, the ends $12\\text{ cm}^2$, and

$$S = 2 \\cdot 24 + 2 \\cdot 18 + 2 \\cdot 12 = 108\\text{ cm}^2.$$

Another way round the same net: the four side faces form one strip, $h$ high and as long as the perimeter of the base, $2(6 + 4) = 20$, so they have area $20 \\cdot 3 = 60$; with the top and bottom, $60 + 48 = 108\\text{ cm}^2$ again.

> **Watch out.** Each kind of face comes **twice**: adding $lw + lh + wh$ once gives only half the surface area. And $l \\cdot w \\cdot h$ is the volume, measured in cubic units, not the surface area.`,
        `多面体的**表面积**是它各个面的面积之和，也就是展开图的面积。长 $l$、宽 $w$、高 $h$ 的长方体有 $6$ 个长方形面，相对的面相等：上下两面是 $l \\times w$，前后两面是 $l \\times h$，左右两面是 $w \\times h$。所以

$$S = 2lw + 2lh + 2wh.$$

长 $6$ 厘米、宽 $4$ 厘米、高 $3$ 厘米的长方体：上下两面各 $24\\text{ cm}^2$，前后两面各 $18\\text{ cm}^2$，左右两面各 $12\\text{ cm}^2$，

$$S = 2 \\cdot 24 + 2 \\cdot 18 + 2 \\cdot 12 = 108\\text{ cm}^2.$$

同一个展开图还可以换一种算法：四个侧面连成一条带子，高 $h$，长等于底面周长 $2(6 + 4) = 20$，面积是 $20 \\cdot 3 = 60$；再加上上下两面，$60 + 48 = 108\\text{ cm}^2$，结果相同。

> **注意。** 每种面都有**两个**：只把 $lw + lh + wh$ 加一次，得到的只是表面积的一半。$l \\cdot w \\cdot h$ 是体积，用体积单位计量，不是表面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const l = rng.int(3, 12);
        const w = rng.int(2, 9);
        const h = rng.int(2, 9);
        const s = 2 * (l * w + l * h + w * h);
        const xs = [0, w, w + l, 2 * w + l, 2 * w + 2 * l];
        const rect = (x0: number, y0: number, x1: number, y1: number): Mark => ({
          kind: "polygon",
          points: [
            [x0, y0],
            [x1, y0],
            [x1, y1],
            [x0, y1],
          ],
        });
        const net = (areas: boolean): Mark[] => {
          const marks: Mark[] = [0, 1, 2, 3].map((i) => rect(xs[i]!, 0, xs[i + 1]!, h));
          marks.push(rect(w, h, w + l, h + w), rect(w, -w, w + l, 0));
          if (areas) {
            const at = (x: number, y: number, v: number): Mark => ({ kind: "label", at: [x, y], text: String(v), dir: "n" });
            marks.push(
              at(w / 2, h / 2, w * h),
              at(w + l / 2, h / 2, l * h),
              at(1.5 * w + l, h / 2, w * h),
              at(2 * w + 1.5 * l, h / 2, l * h),
              at(w + l / 2, h + w / 2, l * w),
              at(w + l / 2, -w / 2, l * w),
            );
          }
          marks.push(
            { kind: "side", a: [0, h], b: [0, 0], text: len(h, u) },
            { kind: "side", a: [0, 0], b: [w, 0], text: len(w, u) },
            { kind: "side", a: [w, -w], b: [w + l, -w], text: len(l, u) },
          );
          return marks;
        };
        const strip = 2 * (l + w) * h;
        return {
          ...numberProblem({
            prompt: t(
              "The net folds into a box. Find the surface area of the box.",
              "这个展开图可以折成一个长方体。求这个长方体的表面积。",
            ),
            answer: s,
            form: "integer",
            unit: `${u}^2`,
            wrong: [l * w * h, l * w + l * h + w * h, 2 * (l + w + h), 4 * (l + w + h)],
            solution: t(
              `**Step 1: the faces.** The box is $${l}$ by $${w}$ by $${h}$ ${unitWord(u)}, and its faces come in pairs: two $${l} \\times ${w}$, two $${l} \\times ${h}$ and two $${w} \\times ${h}$ rectangles. Write the area inside each face of the net:

{{figure 0}}

**Step 2: add them up.**${steps(`S = 2 \\cdot ${l * w} + 2 \\cdot ${l * h} + 2 \\cdot ${w * h} = ${tex(s, u, 2)}`)}**Check.** Add the net another way. The four faces in the row form a strip $${h}$ high and $2(${l} + ${w}) = ${2 * (l + w)}$ long, of area $${2 * (l + w)} \\cdot ${h} = ${strip}$; the two faces above and below it add $2 \\cdot ${l * w} = ${2 * l * w}$. In all, $${strip} + ${2 * l * w} = ${s}$.`,
              `**第一步：看各面。** 长方体长 $${l}$、宽 $${w}$、高 $${h}$（单位 ${u}），各面成对出现：两个 $${l} \\times ${w}$、两个 $${l} \\times ${h}$ 和两个 $${w} \\times ${h}$ 的长方形。把每个面的面积写在展开图里：

{{figure 0}}

**第二步：加起来。**${steps(`S = 2 \\cdot ${l * w} + 2 \\cdot ${l * h} + 2 \\cdot ${w * h} = ${tex(s, u, 2)}`)}**检验。** 换一种方法算展开图的面积。一排的四个面连成一条高 $${h}$、长 $2(${l} + ${w}) = ${2 * (l + w)}$ 的带子，面积是 $${2 * (l + w)} \\cdot ${h} = ${strip}$；上下两个面再加 $2 \\cdot ${l * w} = ${2 * l * w}$。合计 $${strip} + ${2 * l * w} = ${s}$。`,
            ),
          }),
          figure: figure(
            net(false),
            `A net of a box: four rectangles ${h} ${u} high in a row, ${w}, ${l}, ${w} and ${l} ${u} wide, with a rectangle ${l} by ${w} above and below the second one.`,
            `一个长方体的展开图：一排四个高 ${h} ${u} 的长方形，宽依次为 ${w}、${l}、${w}、${l} ${u}，第二个长方形的上下各连着一个 ${l} × ${w} 的长方形。`,
          ),
          solutionFigures: [
            figure(
              net(true),
              `The net with the area of each face written inside: ${w * h}, ${l * h}, ${w * h} and ${l * h} in the row, ${l * w} above and below.`,
              `展开图中写出了每个面的面积：一排依次为 ${w * h}、${l * h}、${w * h}、${l * h}，上下各为 ${l * w}。`,
            ),
          ],
        };
      },
    },
    {
      id: "nets-of-triangular-prisms",
      figure: geometryDrawings2["finding-surface-areas-using-nets#nets-of-triangular-prisms"],
      title: t("Nets of triangular prisms", "三棱柱的展开图"),
      explanation: t(
        `The net of a triangular prism has two triangles, the bases, and a strip of three rectangles, the sides. Each rectangle is as long as the prism and as wide as one side of the triangle, so laid end to end the strip is as long as the **perimeter** of the triangle:

$$S = 2 \\cdot (\\text{area of the triangle}) + (\\text{perimeter of the triangle}) \\cdot (\\text{length}).$$

Take a prism $8$ cm long whose bases are right triangles with legs $6$ and $8$ cm and hypotenuse $10$ cm. Each triangle has area $\\tfrac{1}{2} \\cdot 6 \\cdot 8 = 24\\text{ cm}^2$, and the strip has area $(6 + 8 + 10) \\cdot 8 = 192\\text{ cm}^2$:

$$S = 2 \\cdot 24 + 192 = 240\\text{ cm}^2.$$

> **Watch out.** A triangle is **half** of a rectangle: its area is $\\tfrac{1}{2} \\cdot 6 \\cdot 8$, not $6 \\cdot 8$. Then count **both** triangles: two halves of $6 \\cdot 8$ make $6 \\cdot 8$ in all, so forgetting either step gives a wrong total.`,
        `三棱柱的展开图有两个三角形（底面）和一排三个长方形（侧面）。每个长方形的长等于棱柱的长，宽等于三角形的一条边，所以三个长方形首尾相接，总长等于三角形的**周长**：

$$S = 2 \\cdot (\\text{三角形的面积}) + (\\text{三角形的周长}) \\cdot (\\text{棱柱的长}).$$

一个长 $8$ 厘米的三棱柱，底面是两条直角边为 $6$ 和 $8$ 厘米、斜边为 $10$ 厘米的直角三角形。每个三角形的面积是 $\\tfrac{1}{2} \\cdot 6 \\cdot 8 = 24\\text{ cm}^2$，三个长方形的面积是 $(6 + 8 + 10) \\cdot 8 = 192\\text{ cm}^2$：

$$S = 2 \\cdot 24 + 192 = 240\\text{ cm}^2.$$

> **注意。** 三角形是长方形的**一半**：面积是 $\\tfrac{1}{2} \\cdot 6 \\cdot 8$，不是 $6 \\cdot 8$。然后**两个**三角形都要算：两个 $6 \\cdot 8$ 的一半合起来正好是 $6 \\cdot 8$，漏掉哪一步，总数都会错。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples.slice(0, 5));
        const L = rng.int(4, 20);
        const bases = a * b;
        const sides = (a + b + c) * L;
        const s = bases + sides;
        const half = Q.of(a * b, 2);
        return {
          ...numberProblem({
            prompt: t(
              `A triangular prism is $${tex(L, u)}$ long. Its bases are right triangles with legs $${tex(a, u)}$ and $${tex(b, u)}$ and hypotenuse $${tex(c, u)}$. Using its net of two triangles and three rectangles, find its surface area.`,
              `一个三棱柱长 $${tex(L, u)}$，底面是两条直角边为 $${tex(a, u)}$ 和 $${tex(b, u)}$、斜边为 $${tex(c, u)}$ 的直角三角形。利用由两个三角形和三个长方形组成的展开图，求它的表面积。`,
            ),
            answer: s,
            form: "integer",
            unit: `${u}^2`,
            wrong: [sides, bases / 2 + sides, 2 * bases + sides, (a * b * L) / 2],
            solution: t(
              `{{figure 0}}

**Step 1: the two triangles.** Each is half of ${article(a)} $${a} \\times ${b}$ rectangle, since the legs are perpendicular:${steps(`2 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${bases}`)}**Step 2: the three rectangles.** Each is $${L}$ long and as wide as one side of the triangle, so together they are as wide as its perimeter:${steps(`(${a} + ${b} + ${c}) \\cdot ${L} = ${a + b + c} \\cdot ${L} = ${sides}`)}**Step 3: add.**${steps(`S = ${bases} + ${sides} = ${tex(s, u, 2)}`)}**Check.** Add the five faces one by one: the triangles $${num(half)} + ${num(half)}$, the rectangles $${a * L} + ${b * L} + ${c * L}$. The total is $${bases} + ${a * L + b * L + c * L} = ${s}$.`,
              `{{figure 0}}

**第一步：两个三角形。** 两条直角边互相垂直，所以每个三角形是 $${a} \\times ${b}$ 长方形的一半：${steps(`2 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${bases}`)}**第二步：三个长方形。** 每个长 $${L}$，宽等于三角形的一条边，所以三个合起来的宽等于三角形的周长：${steps(`(${a} + ${b} + ${c}) \\cdot ${L} = ${a + b + c} \\cdot ${L} = ${sides}`)}**第三步：相加。**${steps(`S = ${bases} + ${sides} = ${tex(s, u, 2)}`)}**检验。** 把五个面一个一个加起来：两个三角形 $${num(half)} + ${num(half)}$，三个长方形 $${a * L} + ${b * L} + ${c * L}$。合计 $${bases} + ${a * L + b * L + c * L} = ${s}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              triangularPrismMarks(a, b, L, { a: len(a, u), b: len(b, u), c: len(c, u), l: len(L, u) }),
              `The triangular prism: right-triangle bases with legs ${a} and ${b} ${u} and hypotenuse ${c} ${u}, ${L} ${u} long.`,
              `这个三棱柱：底面是直角边为 ${a} 和 ${b} ${u}、斜边为 ${c} ${u} 的直角三角形，长 ${L} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "nets-of-square-pyramids",
      figure: geometryDrawings2["finding-surface-areas-using-nets#nets-of-square-pyramids"],
      title: t("Nets of square pyramids", "四棱锥的展开图"),
      explanation: t(
        `The net of a square pyramid is a square with a triangle on each side. If the base has side $s$ and each triangle has height $l$, measured from the middle of a base side up to the apex, then each triangle has area $\\tfrac{1}{2} s l$, and

$$S = s^2 + 4 \\cdot \\tfrac{1}{2} s l = s^2 + 2sl.$$

For $s = 8$ cm and $l = 7$ cm: the square has area $64\\text{ cm}^2$, each triangle $\\tfrac{1}{2} \\cdot 8 \\cdot 7 = 28\\text{ cm}^2$, and

$$S = 64 + 4 \\cdot 28 = 176\\text{ cm}^2.$$

> **Watch out.** Each triangle is $\\tfrac{1}{2} s l$, not $s l$: forgetting the half doubles the four triangles. And there are **four** of them, one on each side of the square, plus the square itself.`,
        `四棱锥的展开图是一个正方形，每条边上连着一个三角形。如果底面边长为 $s$，每个三角形的高为 $l$（从底边中点量到顶点），那么每个三角形的面积是 $\\tfrac{1}{2} s l$，

$$S = s^2 + 4 \\cdot \\tfrac{1}{2} s l = s^2 + 2sl.$$

当 $s = 8$ 厘米、$l = 7$ 厘米时：正方形面积 $64\\text{ cm}^2$，每个三角形 $\\tfrac{1}{2} \\cdot 8 \\cdot 7 = 28\\text{ cm}^2$，

$$S = 64 + 4 \\cdot 28 = 176\\text{ cm}^2.$$

> **注意。** 每个三角形的面积是 $\\tfrac{1}{2} s l$，不是 $s l$：忘了一半，四个三角形的面积就翻了一倍。三角形有**四个**，正方形的每条边上一个，还要加上正方形本身。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 14);
        const l = rng.int(Math.ceil(s / 2) + 1, 18);
        const area = s * s + 2 * s * l;
        const tri = Q.of(s * l, 2);
        return {
          ...numberProblem({
            prompt: t(
              `The net of a square pyramid is a square with side $${tex(s, u)}$ and four triangles, each with base $${tex(s, u)}$ and height $${tex(l, u)}$. Find the surface area of the pyramid.`,
              `一个四棱锥的展开图由一个边长为 $${tex(s, u)}$ 的正方形和四个三角形组成，每个三角形的底为 $${tex(s, u)}$、高为 $${tex(l, u)}$。求这个四棱锥的表面积。`,
            ),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s * s + 4 * s * l, s * s + s * l, 2 * s * l, Q.of(2 * s * s + s * l, 2)],
            solution: t(
              `**Step 1: the square.** The base has area $${s}^2 = ${s * s}$.

**Step 2: the triangles.** Each has base $${s}$ and height $${l}$, so it is half of ${article(s)} $${s} \\times ${l}$ rectangle: $\\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(tri)}$. There are four, one on each side of the square, and they fold up to meet at the apex:

{{figure 0}}

**Step 3: add.**${steps(`S = ${s * s} + 4 \\cdot ${num(tri)} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}**Check.** Use the formula $S = s^2 + 2sl$ in factored form, $s(s + 2l)$: $${s}(${s} + 2 \\cdot ${l}) = ${s} \\cdot ${s + 2 * l} = ${area}$.`,
              `**第一步：正方形。** 底面面积是 $${s}^2 = ${s * s}$。

**第二步：三角形。** 每个三角形底为 $${s}$、高为 $${l}$，是 $${s} \\times ${l}$ 长方形的一半：$\\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(tri)}$。共有四个，正方形每条边上一个，折起来交于顶点：

{{figure 0}}

**第三步：相加。**${steps(`S = ${s * s} + 4 \\cdot ${num(tri)} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}**检验。** 把公式 $S = s^2 + 2sl$ 写成因式分解的形式 $s(s + 2l)$ 再算一次：$${s}(${s} + 2 \\cdot ${l}) = ${s} \\cdot ${s + 2 * l} = ${area}$。`,
            ),
          }),
          figure: figure(
            pyramidNet(4, (2 * l) / s),
            "A net of a square pyramid: a square with a triangle on each side.",
            "一个四棱锥的展开图：正方形的每条边上连着一个三角形。",
          ),
          solutionFigures: [
            figure(
              pyramidMarks(s, s, Math.sqrt(l * l - (s * s) / 4), { l: len(s, u), s: len(l, u) }),
              `The folded pyramid: a square base with side ${s} ${u}, and each triangular face ${l} ${u} high from the middle of a base side to the apex.`,
              `折好的四棱锥：底面是边长 ${s} ${u} 的正方形，每个三角形面从底边中点到顶点高 ${l} ${u}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** FaceKinds counts the faces of a polyhedron by number of sides: [sides, count]. */
type FaceKinds = readonly (readonly [number, number])[];

const faceWords: Record<number, readonly [string, string, string]> = {
  3: ["triangle", "triangles", "三角形"],
  4: ["square", "squares", "正方形"],
  5: ["pentagon", "pentagons", "五边形"],
  6: ["hexagon", "hexagons", "六边形"],
  7: ["heptagon", "heptagons", "七边形"],
  8: ["octagon", "octagons", "八边形"],
  9: ["nonagon", "nonagons", "九边形"],
  10: ["decagon", "decagons", "十边形"],
};

/** realPolyhedra are convex polyhedra by their faces, each with the number of vertices. */
function realPolyhedron(rng: Rng): { faces: FaceKinds; v: number } {
  const n = rng.int(3, 10);
  switch (rng.int(0, 3)) {
    case 0:
      // A prism: two n-gons and n squares (n = 4 is a cube).
      return n === 4
        ? { faces: [[4, 6]], v: 8 }
        : {
            faces: [
              [n, 2],
              [4, n],
            ],
            v: 2 * n,
          };
    case 1:
      // An antiprism: two n-gons and 2n triangles (n = 3 is an octahedron).
      return n === 3
        ? { faces: [[3, 8]], v: 6 }
        : {
            faces: [
              [n, 2],
              [3, 2 * n],
            ],
            v: 2 * n,
          };
    case 2:
      // A pyramid: one n-gon and n triangles (n = 3 is a tetrahedron).
      return n === 3
        ? { faces: [[3, 4]], v: 4 }
        : {
            faces: [
              [n, 1],
              [3, n],
            ],
            v: n + 1,
          };
    default:
      return rng.pick([
        { faces: [[3, 20]], v: 12 },
        { faces: [[5, 12]], v: 20 },
        {
          faces: [
            [3, 8],
            [4, 6],
          ],
          v: 12,
        },
        {
          faces: [
            [3, 4],
            [6, 4],
          ],
          v: 12,
        },
        {
          faces: [
            [4, 6],
            [6, 8],
          ],
          v: 24,
        },
        {
          faces: [
            [3, 20],
            [5, 12],
          ],
          v: 30,
        },
        {
          faces: [
            [3, 8],
            [8, 6],
          ],
          v: 24,
        },
        {
          faces: [
            [3, 8],
            [4, 18],
          ],
          v: 24,
        },
        { faces: [[3, 6]], v: 5 },
        { faces: [[3, 10]], v: 7 },
        { faces: [[3, 12]], v: 8 },
      ] as const);
  }
}

/** facesText describes the faces of a polyhedron: "2 hexagons and 6 squares". */
function facesText(faces: FaceKinds): Text {
  const parts = faces.map(([n, c]) => {
    const [one, many, zh] = faceWords[n]!;
    return [`$${c}$ ${c === 1 ? one : many}`, `$${c}$ 个${zh}`] as const;
  });
  return t(parts.map((p) => p[0]).join(" and "), parts.map((p) => p[1]).join("和"));
}

export const eulersFormulaForPolyhedra: TopicDef = {
  id: "eulers-formula-for-polyhedra",
  title: t("Euler's Formula for Polyhedra", "多面体的欧拉公式"),
  summary: t(
    "Use V − E + F = 2 to find a missing count, test whether counts are possible, and count edges and vertices from the faces.",
    "利用 V − E + F = 2 求未知的计数，判断一组计数是否可能，并由各面数出棱数和顶点数。",
  ),
  prerequisites: ["faces-vertices-and-edges-of-polyhedrons"],
  encompasses: [],
  xp: 12,
  intro: t(
    `Counting the faces $F$, vertices $V$ and edges $E$ of prisms and pyramids, a pattern shows up. A triangular prism has $V = 6$, $E = 9$ and $F = 5$, and $6 - 9 + 5 = 2$. A square pyramid has $V = 5$, $E = 8$ and $F = 5$, and $5 - 8 + 5 = 2$ again.

{{figure 0}}

This is no accident. Building up a polyhedron piece by piece, every new edge either joins a new vertex or closes off a new face, so the combination $V - E + F$ never changes; for every convex polyhedron it is $2$. This is **Euler's formula**, named after Leonhard Euler, who published it in the eighteenth century:

$$V - E + F = 2.$$

In this lesson we use it to find a count that is missing, to test whether three counts can belong to a polyhedron at all, and, with the fact that every edge is shared by two faces, to count edges and vertices from the faces alone.`,
    `在数棱柱和棱锥的面数 $F$、顶点数 $V$ 和棱数 $E$ 时，会出现一个规律。三棱柱有 $V = 6$、$E = 9$、$F = 5$，而 $6 - 9 + 5 = 2$。四棱锥有 $V = 5$、$E = 8$、$F = 5$，同样 $5 - 8 + 5 = 2$。

{{figure 0}}

这不是巧合。把多面体一块一块地搭起来，每加一条棱，要么连出一个新顶点，要么围出一个新面，所以 $V - E + F$ 始终不变；对每个凸多面体，它都等于 $2$。这就是**欧拉公式**，以十八世纪发表它的数学家欧拉命名：

$$V - E + F = 2.$$

这节课我们用它求未知的计数，判断三个计数能否属于某个多面体，再利用每条棱被两个面共用这一事实，只由各面数出棱数和顶点数。`,
  ),
  introFigures: [
    figure(
      [...prismMarks(3, 1.6, 2.6), ...shift(pyramidOn(4, 1.6, 2.8), 4.5)],
      "A triangular prism with 6 vertices, 9 edges and 5 faces, and a square pyramid with 5 vertices, 8 edges and 5 faces.",
      "三棱柱有 6 个顶点、9 条棱、5 个面；四棱锥有 5 个顶点、8 条棱、5 个面。",
    ),
  ],
  knowledgePoints: [
    {
      id: "missing-count",
      title: t("A missing count", "求未知的计数"),
      explanation: t(
        `For every convex polyhedron (one without dents or holes), the numbers of vertices $V$, edges $E$ and faces $F$ satisfy **Euler's formula**

$$V - E + F = 2.$$

So any two of the counts give the third: put in the two you know and solve for the other, as for any equation. A polyhedron with $12$ vertices and $18$ edges has

$$12 - 18 + F = 2, \\qquad F = 2 - 12 + 18 = 8.$$

That is a hexagonal prism: $2$ hexagons and $6$ rectangles. When the edges are missing, move them to the other side first: $E = V + F - 2$.

> **Watch out.** The signs matter: it is $V - E + F$, with the edges **subtracted**. Adding all three, or moving a number across the equals sign without changing its sign, gives a wrong count.`,
        `每个凸多面体（没有凹陷或孔洞的多面体）的顶点数 $V$、棱数 $E$ 和面数 $F$ 都满足**欧拉公式**

$$V - E + F = 2.$$

所以知道其中两个就能求出第三个：把已知的两个代入，像解方程一样解出另一个。一个有 $12$ 个顶点和 $18$ 条棱的多面体，

$$12 - 18 + F = 2, \\qquad F = 2 - 12 + 18 = 8.$$

这就是六棱柱：$2$ 个六边形和 $6$ 个长方形。如果未知的是棱数，先把它移到另一边：$E = V + F - 2$。

> **注意。** 符号很关键：是 $V - E + F$，棱数是**减去**的。把三个数都相加，或者移项时没有变号，都会算错。`,
      ),
      generate(rng) {
        let v: number;
        let f: number;
        do {
          v = rng.int(4, 30);
          f = rng.int(4, 30);
        } while (f > 2 * v - 4 || v > 2 * f - 4);
        const e = v + f - 2;
        const missing = rng.int(0, 2);
        const [en, zh, letter] = counts[[2, 0, 1][missing]!]!;
        const values = { F: f, V: v, E: e };
        const known = counts.filter((c) => c[2] !== letter);
        const answer = values[letter];
        const wrongs =
          letter === "E"
            ? [v + f + 2, v + f, Math.abs(v - f) + 2]
            : letter === "V"
              ? [e - f - 2, e + f - 2, e - f]
              : [e - v - 2, e + v - 2, e - v];
        const put = letter === "E" ? `${v} - E + ${f} = 2` : letter === "V" ? `V - ${e} + ${f} = 2` : `${v} - ${e} + F = 2`;
        const solve = letter === "E" ? `E = ${v} + ${f} - 2` : letter === "V" ? `V = 2 + ${e} - ${f}` : `F = 2 - ${v} + ${e}`;
        const move =
          letter === "E"
            ? t("Add $E$ to both sides and subtract $2$:", "两边同时加上 $E$，再减去 $2$：")
            : letter === "V"
              ? t(`Add $${e}$ to both sides and subtract $${f}$:`, `两边同时加上 $${e}$，再减去 $${f}$：`)
              : t(`Subtract $${v}$ from both sides and add $${e}$:`, `两边同时减去 $${v}$，再加上 $${e}$：`);
        return numberProblem({
          prompt: t(
            `A convex polyhedron has $${values[known[0]![2]]}$ ${known[0]![0]} and $${values[known[1]![2]]}$ ${known[1]![0]}. How many ${en} does it have?`,
            `一个凸多面体有 $${values[known[0]![2]]}$ ${measure(known[0]![1])}${known[0]![1]}和 $${values[known[1]![2]]}$ ${measure(known[1]![1])}${known[1]![1]}。它有多少${measure(zh)}${zh}？`,
          ),
          answer,
          form: "integer",
          wrong: wrongs.filter((w) => w > 0),
          solution: t(
            `**Step 1: substitute.** Every convex polyhedron satisfies Euler's formula $V - E + F = 2$. Put in the two counts that are known:${steps(put)}**Step 2: solve.** ${move.en}${steps(`${solve} = ${answer}`)}**Check.** With all three counts, $V - E + F = ${v} - ${e} + ${f} = 2$.`,
            `**第一步：代入。** 每个凸多面体都满足欧拉公式 $V - E + F = 2$。代入已知的两个计数：${steps(put)}**第二步：求解。** ${move["zh-CN"]}${steps(`${solve} = ${answer}`)}**检验。** 用三个计数验证：$V - E + F = ${v} - ${e} + ${f} = 2$。`,
          ),
        });
      },
    },
    {
      id: "possible-counts",
      title: t("Possible counts", "判断计数是否可能"),
      explanation: t(
        `Euler's formula is also a quick test. Every convex polyhedron satisfies $V - E + F = 2$, so if three counts give anything else, no convex polyhedron has them.

Can a convex polyhedron have $10$ vertices, $17$ edges and $8$ faces? Compute: $10 - 17 + 8 = 1$. That is not $2$, so no. With $15$ edges instead, $10 - 15 + 8 = 3$, still no; only $16$ edges pass, $10 - 16 + 8 = 2$.

Passing the test alone does not prove that such a polyhedron exists, but every count in these questions that passes it belongs to a real polyhedron.

> **Watch out.** Work the signs out in order, from left to right: $10 - 17 + 8$ is $-7 + 8 = 1$, not $10 - 25$. A count that is off by one is still impossible: the formula must give exactly $2$.`,
        `欧拉公式还可以用来快速检验。每个凸多面体都满足 $V - E + F = 2$，所以如果三个计数算出来不是 $2$，就没有凸多面体具有这组计数。

一个凸多面体能有 $10$ 个顶点、$17$ 条棱和 $8$ 个面吗？算一算：$10 - 17 + 8 = 1$，不是 $2$，所以不能。换成 $15$ 条棱，$10 - 15 + 8 = 3$，仍然不能；只有 $16$ 条棱才能通过：$10 - 16 + 8 = 2$。

仅通过检验并不能证明这样的多面体存在，不过这些题目中通过检验的计数都对应真实的多面体。

> **注意。** 按从左到右的顺序算符号：$10 - 17 + 8$ 是 $-7 + 8 = 1$，不是 $10 - 25$。只差 $1$ 也不行：公式必须恰好等于 $2$。`,
      ),
      generate(rng) {
        let v: number;
        let f: number;
        do {
          v = rng.int(4, 24);
          f = rng.int(4, 24);
        } while (f > 2 * v - 4 || v > 2 * f - 4);
        const possible = rng.bool();
        const e = v + f - 2 + (possible ? 0 : rng.pick([-2, -1, 1, 2]));
        const sum = v - e + f;
        const steps2 = `${v} - ${e} + ${f} = ${v - e} + ${f} = ${sum}`.replace("+ -", "- ");
        return choiceProblem({
          prompt: t(
            `Can a convex polyhedron have $${v}$ vertices, $${e}$ edges and $${f}$ faces?`,
            `一个凸多面体能有 $${v}$ 个顶点、$${e}$ 条棱和 $${f}$ 个面吗？`,
          ),
          options: yesNo,
          correct: possible ? 0 : 1,
          solution: t(
            `Compute $V - E + F$ from left to right: $${steps2}$. ${
              possible
                ? "That is $2$, as Euler's formula requires, and a convex polyhedron with these counts exists."
                : `That is $${sum}$, not $2$, so no convex polyhedron has these counts.`
            }

**Check.** Euler's formula rearranged says $V + F = E + 2$. Here $V + F = ${v + f}$ and $E + 2 = ${e + 2}$, which ${possible ? "agree" : "differ"}.`,
            `从左到右计算 $V - E + F$：$${steps2}$。${
              possible
                ? "结果是 $2$，符合欧拉公式，而且确实存在具有这组计数的凸多面体。"
                : `结果是 $${sum}$，不是 $2$，所以没有凸多面体具有这组计数。`
            }

**检验。** 欧拉公式变形后是 $V + F = E + 2$。这里 $V + F = ${v + f}$，$E + 2 = ${e + 2}$，两者${possible ? "相等" : "不相等"}。`,
          ),
        });
      },
    },
    {
      id: "counting-from-the-faces",
      title: t("Counting from the faces", "由各面计数"),
      explanation: t(
        `Each edge is shared by exactly two faces. So adding up the sides of all the faces counts every edge twice:

$$E = \\frac{\\text{total number of sides of the faces}}{2}.$$

Then Euler's formula gives the vertices: $V = 2 + E - F$.

Take a polyhedron whose faces are $4$ triangles and $4$ hexagons. The faces have $4 \\cdot 3 + 4 \\cdot 6 = 36$ sides in all, so $E = \\frac{36}{2} = 18$. There are $F = 8$ faces, so $V = 2 + 18 - 8 = 12$.

> **Watch out.** The total of the sides is not the number of edges: halve it, since every edge borders two faces. And the number of faces is not the number of edges either: count sides, not faces.`,
        `每条棱恰好被两个面共用。所以把所有面的边数加起来，每条棱都被数了两次：

$$E = \\frac{\\text{各面边数之和}}{2}.$$

再由欧拉公式求出顶点数：$V = 2 + E - F$。

一个多面体的各面是 $4$ 个三角形和 $4$ 个六边形。各面共有 $4 \\cdot 3 + 4 \\cdot 6 = 36$ 条边，所以 $E = \\frac{36}{2} = 18$。共有 $F = 8$ 个面，所以 $V = 2 + 18 - 8 = 12$。

> **注意。** 各面边数之和不是棱数：要除以 $2$，因为每条棱都是两个面的边。面数也不是棱数：要数的是边，不是面。`,
      ),
      generate(rng) {
        const { faces, v } = realPolyhedron(rng);
        const sides = faces.reduce((s, [n, c]) => s + n * c, 0);
        const f = faces.reduce((s, [, c]) => s + c, 0);
        const e = sides / 2;
        const askEdges = rng.bool();
        const desc = facesText(faces);
        const sum = faces.map(([n, c]) => `${c} \\cdot ${n}`).join(" + ");
        const fSum = faces.length > 1 ? `${faces.map(([, c]) => c).join(" + ")} = ` : "";
        const edgeStep = t(
          `**Step 1: the edges.** The faces have $${sum} = ${sides}$ sides in all, and each edge is a side of two faces, so it was counted twice:${steps(`E = \\frac{${sides}}{2} = ${e}`)}`,
          `**第一步：求棱数。** 各面共有 $${sum} = ${sides}$ 条边，每条棱是两个面的边，被数了两次：${steps(`E = \\frac{${sides}}{2} = ${e}`)}`,
        );
        return numberProblem({
          prompt: askEdges
            ? t(
                `The faces of a convex polyhedron are ${desc.en}. How many edges does it have?`,
                `一个凸多面体的各面是${desc["zh-CN"]}。它有多少条棱？`,
              )
            : t(
                `The faces of a convex polyhedron are ${desc.en}. How many vertices does it have?`,
                `一个凸多面体的各面是${desc["zh-CN"]}。它有多少个顶点？`,
              ),
          answer: askEdges ? e : v,
          form: "integer",
          wrong: askEdges ? [sides, f, e + f] : [sides, e, e + f - 2, e - f],
          solution: askEdges
            ? t(
                `${edgeStep.en}**Step 2: the answer.** The polyhedron has $${e}$ edges.

**Check.** With $F = ${fSum}${f}$ faces, Euler's formula gives $V = 2 + ${e} - ${f} = ${v}$ vertices, a whole number that makes sense: at least three faces meet at each vertex, and indeed the $${sides}$ corners of the faces are at least $3 \\cdot ${v} = ${3 * v}$.`,
                `${edgeStep["zh-CN"]}**第二步：答案。** 这个多面体有 $${e}$ 条棱。

**检验。** 面数 $F = ${fSum}${f}$，由欧拉公式得 $V = 2 + ${e} - ${f} = ${v}$ 个顶点，这是一个合理的整数：每个顶点处至少有三个面，而各面的角共有 $${sides}$ 个，确实不少于 $3 \\cdot ${v} = ${3 * v}$。`,
              )
            : t(
                `${edgeStep.en}**Step 2: the vertices.** There are $F = ${fSum}${f}$ faces, so by Euler's formula:${steps(`V = 2 + E - F = 2 + ${e} - ${f} = ${v}`)}**Check.** At least three faces meet at every vertex, so the corners of all the faces, $${sides}$ in all, must be at least $3V = ${3 * v}$: and $${sides} \\ge ${3 * v}$ holds.`,
                `${edgeStep["zh-CN"]}**第二步：求顶点数。** 共有 $F = ${fSum}${f}$ 个面，由欧拉公式：${steps(`V = 2 + E - F = 2 + ${e} - ${f} = ${v}`)}**检验。** 每个顶点处至少有三个面，所以各面的角总数 $${sides}$ 至少是 $3V = ${3 * v}$：$${sides} \\ge ${3 * v}$ 成立。`,
              ),
        });
      },
    },
  ],
};

/** platonic are the five Platonic solids: faces F of p sides, q meeting at each vertex, V vertices and E edges. */
const platonic = [
  { name: t("tetrahedron", "正四面体"), f: 4, p: 3, q: 3, v: 4, e: 6 },
  { name: t("cube", "正方体（正六面体）"), f: 6, p: 4, q: 3, v: 8, e: 12 },
  { name: t("octahedron", "正八面体"), f: 8, p: 3, q: 4, v: 6, e: 12 },
  { name: t("dodecahedron", "正十二面体"), f: 12, p: 5, q: 3, v: 20, e: 30 },
  { name: t("icosahedron", "正二十面体"), f: 20, p: 3, q: 5, v: 12, e: 30 },
] as const;

const regularFaces: Record<number, readonly [string, string, string]> = {
  3: ["equilateral triangles", "an equilateral triangle", "正三角形"],
  4: ["squares", "a square", "正方形"],
  5: ["regular pentagons", "a regular pentagon", "正五边形"],
};

/** interior is the interior angle of a regular p-gon in degrees. */
const interior = (p: number) => 180 - 360 / p;

export const theFivePlatonicSolids: TopicDef = {
  id: "the-five-platonic-solids",
  title: t("The Five Platonic Solids", "五种正多面体"),
  summary: t(
    "Know the five Platonic solids, count their faces, vertices and edges, and see why there are only five.",
    "认识五种正多面体（柏拉图立体），数出它们的面、顶点和棱，并理解为什么只有五种。",
  ),
  prerequisites: ["eulers-formula-for-polyhedra"],
  encompasses: [],
  xp: 14,
  intro: t(
    `In the plane there is a regular polygon with any number of sides: an equilateral triangle, a square, a regular pentagon, and so on without end. In space, the corresponding solids are the **regular polyhedra**, also called **Platonic solids** after the Greek philosopher Plato: every face is the same regular polygon, and the same number of faces meets at every vertex. One might expect endlessly many of them too, but there are only five.

The reason is at the vertices. Try squares: $3$ squares around a point, folded up, make a corner of a cube, since $3 \\cdot 90^\\circ = 270^\\circ$ leaves a gap of $90^\\circ$ to close. But $4$ squares around a point already fill $4 \\cdot 90^\\circ = 360^\\circ$ and lie flat, like floor tiles: they cannot fold into a corner at all.

{{figure 0}}

In this lesson we name the five Platonic solids, count their faces, vertices and edges from the shape of a face, and prove that there can be no sixth.`,
    `在平面上，任意边数的正多边形都存在：正三角形、正方形、正五边形……无穷无尽。在空间中，与之对应的立体图形是**正多面体**，也以古希腊哲学家柏拉图的名字称为**柏拉图立体**：每个面都是同样的正多边形，每个顶点处汇聚的面数也都相同。也许你会以为它们同样有无穷多种，其实只有五种。

原因在顶点处。试试正方形：$3$ 个正方形围在一点周围，折起来就是正方体的一个角，因为 $3 \\cdot 90^\\circ = 270^\\circ$，还留下 $90^\\circ$ 的缺口可以合拢。但 $4$ 个正方形围在一点周围就已经占满 $4 \\cdot 90^\\circ = 360^\\circ$，像地砖一样铺平了，根本折不成一个角。

{{figure 0}}

这节课我们认识五种正多面体，由面的形状数出它们的面、顶点和棱，并证明不可能有第六种。`,
  ),
  introFigures: [
    figure(
      [
        ...squaresNet([
          [0, 0],
          [1, 0],
          [0, 1],
        ]),
        { kind: "dot", at: [1, 1] },
        ...squaresNet([
          [3, 0],
          [4, 0],
          [3, 1],
          [4, 1],
        ]),
        { kind: "dot", at: [4, 1], tone: "result" },
      ],
      "On the left, three squares around a point, leaving a 90° gap: they fold into a corner of a cube. On the right, four squares around a point fill 360° and lie flat.",
      "左边是围在一点周围的三个正方形，留下 90° 的缺口：它们能折成正方体的一个角。右边是围在一点周围的四个正方形，占满 360°，铺成平面。",
    ),
  ],
  knowledgePoints: [
    {
      id: "naming-platonic-solids",
      figure: geometryDrawings2["the-five-platonic-solids#naming-platonic-solids"],
      title: t("The five Platonic solids", "五种正多面体"),
      explanation: t(
        `A **Platonic solid** (regular polyhedron) is a convex polyhedron whose faces are congruent regular polygons, with the same number of faces meeting at every vertex. There are exactly five:

| Solid | Faces | At each vertex | $F$ | $V$ | $E$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Tetrahedron | triangles | $3$ | $4$ | $4$ | $6$ |
| Cube | squares | $3$ | $6$ | $8$ | $12$ |
| Octahedron | triangles | $4$ | $8$ | $6$ | $12$ |
| Dodecahedron | pentagons | $3$ | $12$ | $20$ | $30$ |
| Icosahedron | triangles | $5$ | $20$ | $12$ | $30$ |

The Greek names give the number of faces: *tetra* $4$, *octa* $8$, *dodeca* $12$, *icosa* $20$, and *hexa* $6$ for the cube, the regular hexahedron. To identify one, a single fact may be enough: only the cube has square faces and only the dodecahedron has pentagons. For triangles, count the faces at a vertex: $3$, $4$ or $5$ give the tetrahedron, the octahedron or the icosahedron.

> **Watch out.** The name counts faces, not vertices or edges: the dodecahedron has $12$ faces but $20$ vertices, and the icosahedron $20$ faces but $12$ vertices. And three of the five have triangular faces, so "its faces are triangles" alone does not decide.`,
        `**正多面体**（柏拉图立体）是各面都是全等的正多边形、且每个顶点处汇聚的面数都相同的凸多面体。正多面体恰好有五种：

| 名称 | 面的形状 | 每个顶点处的面数 | $F$ | $V$ | $E$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 正四面体 | 正三角形 | $3$ | $4$ | $4$ | $6$ |
| 正方体 | 正方形 | $3$ | $6$ | $8$ | $12$ |
| 正八面体 | 正三角形 | $4$ | $8$ | $6$ | $12$ |
| 正十二面体 | 正五边形 | $3$ | $12$ | $20$ | $30$ |
| 正二十面体 | 正三角形 | $5$ | $20$ | $12$ | $30$ |

中文名称直接给出面数：四、六（正方体也叫正六面体）、八、十二、二十。要认出其中一种，有时一个条件就够了：只有正方体的面是正方形，只有正十二面体的面是正五边形。面是三角形时，就数每个顶点处的面数：$3$、$4$、$5$ 个分别是正四面体、正八面体、正二十面体。

> **注意。** 名称数的是面，不是顶点或棱：正十二面体有 $12$ 个面，却有 $20$ 个顶点；正二十面体有 $20$ 个面，却只有 $12$ 个顶点。五种中有三种的面是三角形，所以仅凭"面是三角形"不能确定是哪一种。`,
      ),
      generate(rng) {
        const index = rng.int(0, 4);
        const s = platonic[index]!;
        const [many, , zh] = regularFaces[s.p]!;
        const style = rng.int(0, 5);
        const desc = [
          t(`Its faces are ${many}, with $${s.q}$ meeting at each vertex.`, `它的面是${zh}，每个顶点处有 $${s.q}$ 个面。`),
          t(`It has $${s.f}$ faces.`, `它有 $${s.f}$ 个面。`),
          t(`It has $${s.v}$ vertices.`, `它有 $${s.v}$ 个顶点。`),
          t(`Its $${s.f}$ faces are ${many}.`, `它的 $${s.f}$ 个面都是${zh}。`),
          t(`It has $${s.v}$ vertices, with $${s.q}$ faces meeting at each.`, `它有 $${s.v}$ 个顶点，每个顶点处有 $${s.q}$ 个面。`),
          t(`It has $${s.e}$ edges, and its faces are ${many}.`, `它有 $${s.e}$ 条棱，各面都是${zh}。`),
        ][style]!;
        const clue = [
          s.p === 3
            ? t(
                `Three of the solids have triangular faces; with $${s.q}$ at each vertex, it is the ${s.name.en}.`,
                `有三种正多面体的面是三角形；每个顶点处有 $${s.q}$ 个面的是${s.name["zh-CN"]}。`,
              )
            : t(`Only the ${s.name.en} has faces that are ${many}.`, `只有${s.name["zh-CN"]}的面是${zh}。`),
          t(`The name counts the faces: $${s.f}$ faces make the ${s.name.en}.`, `名称数的是面：有 $${s.f}$ 个面的是${s.name["zh-CN"]}。`),
          t(`In the table, only the ${s.name.en} has $V = ${s.v}$.`, `表中只有${s.name["zh-CN"]}满足 $V = ${s.v}$。`),
          t(`The name counts the faces: $${s.f}$ faces make the ${s.name.en}.`, `名称数的是面：有 $${s.f}$ 个面的是${s.name["zh-CN"]}。`),
          t(
            `In the table, only the ${s.name.en} has $V = ${s.v}$ with $${s.q}$ faces at each vertex.`,
            `表中只有${s.name["zh-CN"]}满足 $V = ${s.v}$，且每个顶点处有 $${s.q}$ 个面。`,
          ),
          t(
            `In the table, $E = ${s.e}$ with faces that are ${many} belongs only to the ${s.name.en}.`,
            `表中面是${zh}且 $E = ${s.e}$ 的只有${s.name["zh-CN"]}。`,
          ),
        ][style]!;
        return choiceProblem({
          prompt: t(
            `A Platonic solid is described as follows. ${desc.en} Which is it?`,
            `一种正多面体的描述如下。${desc["zh-CN"]}它是哪一种？`,
          ),
          options: platonic.map((p) => p.name),
          correct: index,
          solution: t(
            `**Match the description.** ${clue.en}

**Check.** The ${s.name.en} has $F = ${s.f}$ faces (${many}), $V = ${s.v}$ vertices and $E = ${s.e}$ edges, with $${s.q}$ faces at each vertex, which agrees with the description. Its counts satisfy Euler's formula: $${s.v} - ${s.e} + ${s.f} = 2$.`,
            `**对照描述。** ${clue["zh-CN"]}

**检验。** ${s.name["zh-CN"]}有 $F = ${s.f}$ 个面（${zh}）、$V = ${s.v}$ 个顶点和 $E = ${s.e}$ 条棱，每个顶点处有 $${s.q}$ 个面，与描述相符。它的计数满足欧拉公式：$${s.v} - ${s.e} + ${s.f} = 2$。`,
          ),
        });
      },
    },
    {
      id: "counting-platonic-solids",
      figure: geometryDrawings2["the-five-platonic-solids#counting-platonic-solids"],
      title: t("Counting with Platonic solids", "正多面体的计数"),
      explanation: t(
        `All the counts follow from two numbers: the faces $F$, each with $p$ sides, and the number $q$ of faces at each vertex. The faces have $F \\cdot p$ sides in all. Each edge is a side of $2$ faces, and each vertex a corner of $q$ faces, so

$$E = \\frac{F p}{2}, \\qquad V = \\frac{F p}{q}.$$

An octahedron has $8$ triangles, $4$ at each vertex: the faces have $8 \\cdot 3 = 24$ sides, so $E = \\frac{24}{2} = 12$ and $V = \\frac{24}{4} = 6$. Euler's formula checks the result: $6 - 12 + 8 = 2$.

Angles follow too. Each face angle of an equilateral triangle is $60^\\circ$, so at a vertex of the octahedron the face angles add to $4 \\cdot 60^\\circ = 240^\\circ$, and the **angle defect**, what is missing to $360^\\circ$, is $120^\\circ$.

> **Watch out.** The total $F \\cdot p$ counts every edge twice and every vertex $q$ times, so it is neither $E$ nor $V$: divide it. And divide the right way: by $2$ for edges, by $q$ for vertices.`,
        `所有计数都由两个数决定：面数 $F$（每个面有 $p$ 条边）和每个顶点处的面数 $q$。各面共有 $F \\cdot p$ 条边。每条棱是 $2$ 个面的边，每个顶点是 $q$ 个面的角，所以

$$E = \\frac{F p}{2}, \\qquad V = \\frac{F p}{q}.$$

正八面体有 $8$ 个三角形面，每个顶点处 $4$ 个：各面共有 $8 \\cdot 3 = 24$ 条边，所以 $E = \\frac{24}{2} = 12$，$V = \\frac{24}{4} = 6$。用欧拉公式检验：$6 - 12 + 8 = 2$。

角也能这样求。正三角形的每个内角是 $60^\\circ$，所以正八面体一个顶点处各面的角之和是 $4 \\cdot 60^\\circ = 240^\\circ$，与 $360^\\circ$ 相差的部分叫**角亏**，是 $120^\\circ$。

> **注意。** 总数 $F \\cdot p$ 把每条棱数了两次，把每个顶点数了 $q$ 次，所以它既不是 $E$ 也不是 $V$：要做除法，而且要除对：求棱数除以 $2$，求顶点数除以 $q$。`,
      ),
      generate(rng) {
        const s = rng.pick(platonic);
        const [, one, zh] = regularFaces[s.p]!;
        const ask = rng.int(0, 5);
        const angle = interior(s.p);
        const intro = t(
          `${/^[aeiou]/.test(s.name.en) ? "An" : "A"} ${s.name.en} has $${s.f}$ faces, each ${one}, with $${s.q}$ faces meeting at each vertex.`,
          `${s.name["zh-CN"]}有 $${s.f}$ 个面，每个面都是${zh}，每个顶点处有 $${s.q}$ 个面。`,
        );
        const sides = s.f * s.p;
        const defect = 360 - s.q * angle;
        const total = t(
          `**Step 1: count the sides.** The $${s.f}$ faces have $${s.p}$ sides each, $${s.f} \\cdot ${s.p} = ${sides}$ in all.`,
          `**第一步：数边。** $${s.f}$ 个面每个有 $${s.p}$ 条边，共 $${s.f} \\cdot ${s.p} = ${sides}$ 条。`,
        );
        const atVertex = t(
          `**Step 1: one face angle.** A regular polygon with $${s.p}$ sides has angles of $\\frac{(${s.p} - 2) \\cdot 180^\\circ}{${s.p}} = ${angle}^\\circ$.`,
          `**第一步：一个面的内角。** 正 $${s.p}$ 边形的每个内角是 $\\frac{(${s.p} - 2) \\cdot 180^\\circ}{${s.p}} = ${angle}^\\circ$。`,
        );
        const cases: readonly [Text, number, number[], Text, string?][] = [
          [
            t("How many edges does it have?", "它有多少条棱？"),
            s.e,
            [sides, s.v, sides / s.q],
            t(
              `${total.en}\n\n**Step 2: halve.** Each edge is a side of two faces, so it was counted twice:${steps(`E = \\frac{${sides}}{2} = ${s.e}`)}**Check.** The vertices are $\\frac{${sides}}{${s.q}} = ${s.v}$, and Euler's formula holds: $${s.v} - ${s.e} + ${s.f} = 2$.`,
              `${total["zh-CN"]}\n\n**第二步：除以 2。** 每条棱是两个面的边，被数了两次：${steps(`E = \\frac{${sides}}{2} = ${s.e}`)}**检验。** 顶点数是 $\\frac{${sides}}{${s.q}} = ${s.v}$，欧拉公式成立：$${s.v} - ${s.e} + ${s.f} = 2$。`,
            ),
          ],
          [
            t("How many vertices does it have?", "它有多少个顶点？"),
            s.v,
            [sides, s.e, sides / 2 - s.f],
            t(
              `${total.en}\n\n**Step 2: divide by $${s.q}$.** Each vertex is a corner of $${s.q}$ faces, so it was counted $${s.q}$ times:${steps(`V = \\frac{${sides}}{${s.q}} = ${s.v}`)}**Check.** The edges are $\\frac{${sides}}{2} = ${s.e}$, and Euler's formula holds: $${s.v} - ${s.e} + ${s.f} = 2$.`,
              `${total["zh-CN"]}\n\n**第二步：除以 $${s.q}$。** 每个顶点是 $${s.q}$ 个面的角，被数了 $${s.q}$ 次：${steps(`V = \\frac{${sides}}{${s.q}} = ${s.v}`)}**检验。** 棱数是 $\\frac{${sides}}{2} = ${s.e}$，欧拉公式成立：$${s.v} - ${s.e} + ${s.f} = 2$。`,
            ),
          ],
          [
            t("What is the sum of the face angles at one vertex, in degrees?", "一个顶点处各面的角之和是多少度？"),
            s.q * angle,
            [360, s.p * angle, 360 - s.q * angle],
            t(
              `${atVertex.en}\n\n**Step 2: the vertex.** $${s.q}$ faces meet there, each with one angle:${steps(`${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ`)}**Check.** At a corner of a convex solid the angles must add to less than $360^\\circ$, and $${s.q * angle}^\\circ < 360^\\circ$.`,
              `${atVertex["zh-CN"]}\n\n**第二步：顶点处。** 有 $${s.q}$ 个面在这里相交，每个面贡献一个角：${steps(`${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ`)}**检验。** 凸立体图形一个角处各面的角之和必须小于 $360^\\circ$，而 $${s.q * angle}^\\circ < 360^\\circ$。`,
            ),
            "°",
          ],
          [
            t(
              "The **angle defect** at a vertex is $360^\\circ$ minus the sum of the face angles there. What is the angle defect at one vertex, in degrees?",
              "一个顶点处的**角亏**是 $360^\\circ$ 减去这个顶点处各面的角之和。一个顶点处的角亏是多少度？",
            ),
            defect,
            [s.q * angle, 360 - angle, 720 / s.f],
            t(
              `${atVertex.en}\n\n**Step 2: the vertex.** $${s.q}$ faces meet there, so the face angles add to $${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ$, and the defect is${steps(`360^\\circ - ${s.q * angle}^\\circ = ${defect}^\\circ`)}**Check.** For every convex polyhedron the defects of all its vertices add to $720^\\circ$. Here there are $${s.v}$ vertices: $${s.v} \\cdot ${defect}^\\circ = ${s.v * defect}^\\circ$.`,
              `${atVertex["zh-CN"]}\n\n**第二步：顶点处。** 有 $${s.q}$ 个面在这里相交，各面的角之和是 $${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ$，所以角亏是${steps(`360^\\circ - ${s.q * angle}^\\circ = ${defect}^\\circ`)}**检验。** 每个凸多面体所有顶点的角亏之和都是 $720^\\circ$。这里有 $${s.v}$ 个顶点：$${s.v} \\cdot ${defect}^\\circ = ${s.v * defect}^\\circ$。`,
            ),
            "°",
          ],
          [
            t("What is the sum of all the face angles of all its faces, in degrees?", "它所有面的所有内角之和是多少度？"),
            s.f * s.p * angle,
            [s.f * 180, s.v * 360, s.f * angle],
            t(
              `${atVertex.en}\n\n**Step 2: all the faces.** There are $${s.f}$ faces with $${s.p}$ angles each:${steps(`${s.f} \\cdot ${s.p} \\cdot ${angle}^\\circ = ${s.f * s.p * angle}^\\circ`)}**Check.** Count the same angles by vertices instead: $${s.v}$ vertices, each with $${s.q}$ angles of $${angle}^\\circ$, give $${s.v} \\cdot ${s.q} \\cdot ${angle}^\\circ = ${s.v * s.q * angle}^\\circ$.`,
              `${atVertex["zh-CN"]}\n\n**第二步：所有的面。** 共有 $${s.f}$ 个面，每个面有 $${s.p}$ 个角：${steps(`${s.f} \\cdot ${s.p} \\cdot ${angle}^\\circ = ${s.f * s.p * angle}^\\circ`)}**检验。** 换成按顶点数同样这些角：$${s.v}$ 个顶点，每个顶点处有 $${s.q}$ 个 $${angle}^\\circ$ 的角，共 $${s.v} \\cdot ${s.q} \\cdot ${angle}^\\circ = ${s.v * s.q * angle}^\\circ$。`,
            ),
            "°",
          ],
          [
            t("How many edges meet at each vertex?", "每个顶点处有多少条棱？"),
            s.q,
            [s.p, s.q + 1, 2 * s.q],
            t(
              `**Walk around a vertex.** Going around it, faces and edges take turns: between two neighboring faces lies one edge. So as many edges as faces meet there: $${s.q}$.\n\n**Check.** Each of the $${s.v}$ vertices has $${s.q}$ edges, and each edge has two ends, so $E = \\frac{${s.v} \\cdot ${s.q}}{2} = ${s.e}$, the edge count of the ${s.name.en}.`,
              `**绕顶点走一圈。** 绕着顶点转，面和棱交替出现：相邻两个面之间是一条棱。所以棱数与面数相同：$${s.q}$。\n\n**检验。** $${s.v}$ 个顶点各有 $${s.q}$ 条棱，每条棱有两个端点，所以 $E = \\frac{${s.v} \\cdot ${s.q}}{2} = ${s.e}$，正是${s.name["zh-CN"]}的棱数。`,
            ),
          ],
        ];
        const [question, answer, wrong, solution, unit] = cases[ask]!;
        return numberProblem({
          prompt: t(`${intro.en} ${question.en}`, `${intro["zh-CN"]}${question["zh-CN"]}`),
          answer,
          form: "integer",
          ...(unit && { unit }),
          wrong: wrong.filter((w) => Number.isInteger(w) && w > 0),
          solution,
        });
      },
    },
    {
      id: "why-only-five",
      figure: geometryDrawings2["the-five-platonic-solids#why-only-five"],
      title: t("Why only five", "为什么只有五种"),
      explanation: t(
        `At each vertex of a convex polyhedron at least $3$ faces meet, and their angles must add up to **less than** $360^\\circ$: the gap left is what lets the faces fold up into a corner. At exactly $360^\\circ$ they lie flat, and above it they overlap.

A regular polygon with $p$ sides has angles of $\\frac{(p - 2) \\cdot 180^\\circ}{p}$. Try each polygon:

- Equilateral triangles ($60^\\circ$): $3$, $4$ or $5$ at a vertex ($180^\\circ$, $240^\\circ$, $300^\\circ$), but $6$ make $360^\\circ$.
- Squares ($90^\\circ$): only $3$ ($270^\\circ$).
- Regular pentagons ($108^\\circ$): only $3$ ($324^\\circ$).
- Regular hexagons ($120^\\circ$): $3$ already make $360^\\circ$, and polygons with more sides have even larger angles.

That leaves five possibilities, the five Platonic solids. For example, $4$ regular pentagons would give $4 \\cdot 108^\\circ = 432^\\circ$, more than a full turn, so they cannot meet at a vertex.

> **Watch out.** Exactly $360^\\circ$ is not allowed: $3$ hexagons or $6$ triangles lie flat and tile the plane, they do not close up a solid. The sum must be strictly less than $360^\\circ$, and at least $3$ faces are needed.`,
        `凸多面体的每个顶点处至少有 $3$ 个面，并且这些面的角之和必须**小于** $360^\\circ$：正是留下的缺口让各面能折成一个角。恰好 $360^\\circ$ 时它们铺成平面，超过时则会重叠。

正 $p$ 边形的每个内角是 $\\frac{(p - 2) \\cdot 180^\\circ}{p}$。逐一试一试：

- 正三角形（$60^\\circ$）：每个顶点处可以有 $3$、$4$ 或 $5$ 个（$180^\\circ$、$240^\\circ$、$300^\\circ$），$6$ 个就成了 $360^\\circ$。
- 正方形（$90^\\circ$）：只能有 $3$ 个（$270^\\circ$）。
- 正五边形（$108^\\circ$）：只能有 $3$ 个（$324^\\circ$）。
- 正六边形（$120^\\circ$）：$3$ 个就已经是 $360^\\circ$，边数更多的正多边形内角更大。

只剩下五种可能，就是五种正多面体。例如，$4$ 个正五边形的角之和是 $4 \\cdot 108^\\circ = 432^\\circ$，超过一周，所以它们不能在一个顶点处相交。

> **注意。** 恰好 $360^\\circ$ 也不行：$3$ 个正六边形或 $6$ 个正三角形会铺平、密铺平面，围不成立体图形。角之和必须严格小于 $360^\\circ$，而且至少要有 $3$ 个面。`,
      ),
      generate(rng) {
        const p = rng.int(3, 10);
        const q = rng.int(3, 6);
        const ok = (p - 2) * q < 2 * p;
        const flat = (p - 2) * q === 2 * p;
        const polygon =
          p === 3
            ? t("equilateral triangles", "正三角形")
            : p === 4
              ? t("squares", "正方形")
              : t(`regular ${faceWords[p]![1]}`, `正${faceWords[p]![2]}`);
        const sumTex = num(Q.of(180 * (p - 2) * q, p));
        const angleTex = num(Q.of(180 * (p - 2), p));
        const solid = platonic.find((s) => s.p === p && s.q === q);
        const check = solid
          ? t(
              `**Check.** These are the faces of the ${solid.name.en}: $${q}$ ${polygon.en} at each vertex.`,
              `**检验。** 这正是${solid.name["zh-CN"]}的面：每个顶点处有 $${q}$ 个${polygon["zh-CN"]}。`,
            )
          : flat
            ? t(
                `**Check.** With nothing left over, $${q}$ ${polygon.en} around a point tile a flat floor, so they make no corner.`,
                `**检验。** 没有缺口，$${q}$ 个${polygon["zh-CN"]}围在一点周围会铺成平面，构不成角。`,
              )
            : t(
                `**Check.** The sum exceeds a full turn by $${num(Q.of(180 * (p - 2) * q - 360 * p, p))}^\\circ$, so the ${polygon.en} would overlap.`,
                `**检验。** 角之和比一周多出 $${num(Q.of(180 * (p - 2) * q - 360 * p, p))}^\\circ$，所以这些${polygon["zh-CN"]}会重叠。`,
              );
        return choiceProblem({
          prompt: t(
            `Can $${q}$ ${polygon.en} meet at a vertex of a convex polyhedron?`,
            `$${q}$ 个${polygon["zh-CN"]}能在一个凸多面体的顶点处相交吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `Each angle is $\\frac{(${p} - 2) \\cdot 180^\\circ}{${p}} = ${angleTex}^\\circ$, so the angles at the vertex add to $${q} \\cdot ${angleTex}^\\circ = ${sumTex}^\\circ$, which is ${ok ? "less than" : flat ? "exactly" : "more than"} $360^\\circ$. ${ok ? "They can fold up around a vertex." : "They cannot form a vertex of a convex polyhedron."}\n\n${check.en}`,
            `每个角是 $\\frac{(${p} - 2) \\cdot 180^\\circ}{${p}} = ${angleTex}^\\circ$，所以顶点处各角之和是 $${q} \\cdot ${angleTex}^\\circ = ${sumTex}^\\circ$，${ok ? "小于" : flat ? "恰好等于" : "大于"} $360^\\circ$。${ok ? "它们可以围成一个顶点。" : "它们不能构成凸多面体的顶点。"}\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** cubeGrid draws a cube cut into n × n × n small cubes, the grid lines showing on its three visible faces. */
function cubeGrid(n: number): Mark[] {
  const marks: Mark[] = boxMarks(1, 1, 1, {}).filter((m) => !(m.kind === "segment" && m.dashed));
  for (let i = 1; i < n; i++) {
    const f = i / n;
    marks.push(
      { kind: "segment", a: P3(f, 0, 0), b: P3(f, 1, 0) },
      { kind: "segment", a: P3(0, f, 0), b: P3(1, f, 0) },
      { kind: "segment", a: P3(0, 1, f), b: P3(1, 1, f) },
      { kind: "segment", a: P3(f, 1, 0), b: P3(f, 1, 1) },
      { kind: "segment", a: P3(1, f, 0), b: P3(1, f, 1) },
      { kind: "segment", a: P3(1, 0, f), b: P3(1, 1, f) },
    );
  }
  return marks;
}

/** faceSquare draws one face of a cube flat, with its two edges and its diagonal labeled. */
function faceSquare(edge: string, diagonal: string): Figure {
  return figure(
    [
      { kind: "polygon", points: [P3(0, 0, 0), P3(1, 0, 0), P3(1, 1, 0), P3(0, 1, 0)] },
      { kind: "segment", a: P3(0, 0, 0), b: P3(1, 1, 0), accent: true },
      { kind: "side", a: P3(0, 0, 0), b: P3(1, 0, 0), text: edge },
      { kind: "side", a: P3(1, 0, 0), b: P3(1, 1, 0), text: edge },
      { kind: "label", at: [0.45, 0.55], text: diagonal, dir: "nw" },
    ],
    `One face of the cube: a square with sides ${edge}, cut by its diagonal ${diagonal} into two right triangles.`,
    `正方体的一个面：边长 ${edge} 的正方形，对角线 ${diagonal} 把它分成两个直角三角形。`,
  );
}

/** spaceTriangle draws a cube with the right triangle of its diagonal: an edge, a face diagonal on the bottom, and the diagonal. */
function spaceTriangle(edge: string, face: string, diagonal: string): Figure {
  const marks = boxMarks(1, 1, 1, {}, "space");
  marks.push(
    { kind: "segment", a: P3(0, 0, 0), b: P3(1, 0, 1), dashed: true, accent: true },
    { kind: "side", a: P3(1, 0, 1), b: P3(1, 1, 1), text: edge },
    { kind: "label", at: [0.725, 0.15], text: face, dir: "n" },
    { kind: "label", at: [0.72, 0.65], text: diagonal, dir: "nw" },
  );
  return figure(
    marks,
    `A cube with its diagonal ${diagonal}: the hypotenuse of a right triangle whose legs are the edge ${edge} and the face diagonal ${face} of the bottom.`,
    `画出体对角线 ${diagonal} 的正方体：它是直角三角形的斜边，两条直角边是棱 ${edge} 和底面的面对角线 ${face}。`,
  );
}

/** cubeFigure draws a cube with one edge labeled, and optionally a face or space diagonal. */
function cubeFigure(label: string, diagonal?: "space" | "front", diagonalLabel?: string): Figure {
  const marks = boxMarks(1, 1, 1, { l: label }, diagonal);
  if (diagonalLabel && diagonal) {
    const end = diagonal === "space" ? P3(1, 1, 1) : P3(1, 1, 0);
    marks.push({ kind: "label", at: [end[0] / 2, end[1] / 2], text: diagonalLabel, dir: "nw" });
  }
  return figure(
    marks,
    `A cube with ${label ? `edge ${label}` : "an edge labeled"}${diagonal ? `, and a ${diagonal === "space" ? "diagonal through its interior" : "diagonal of a face"} drawn` : ""}.`,
    `一个正方体，棱长 ${label}${diagonal ? `，画出了一条${diagonal === "space" ? "体对角线" : "面对角线"}` : ""}。`,
  );
}

export const volumesOfCubes: TopicDef = {
  id: "volumes-of-cubes",
  title: t("Volumes of Cubes", "正方体的体积"),
  summary: t(
    "Find the volume of a cube from its edge, the edge from the volume, and count small cubes in a large one.",
    "由棱长求正方体的体积，由体积求棱长，并数出大正方体中小正方体的个数。",
  ),
  prerequisites: ["identifying-three-dimensional-shapes", "square-roots-and-cube-roots"],
  encompasses: [{ topic: "powers-of-integers", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.6.G.A.2"],
  intro: t(
    `The area of a flat shape counts the unit squares that cover it: a $3 \\times 3$ square holds $9$ of them. A solid also has a size, the room it takes up, and it is measured the same way, by counting **unit cubes**: cubes whose edges are $1$ unit long. That count is the **volume** of the solid, in cubic units such as cubic centimeters, $\\text{cm}^3$.

Build a cube with edges of $3$ cm out of unit cubes. The bottom layer is a $3 \\times 3$ square of cubes, $9$ of them, and there are $3$ such layers stacked up:

{{figure 0}}

So the cube holds $3 \\cdot 9 = 3 \\cdot 3 \\cdot 3 = 27$ unit cubes, and its volume is $27\\text{ cm}^3$. Three edges multiplied together is the cube of the edge, $3^3$, which is where the word "cubed" comes from. In this lesson we find volumes of cubes from their edges, edges from their volumes, and count small cubes packed into a large one.`,
    `平面图形的面积数的是铺满它的单位正方形：$3 \\times 3$ 的正方形里有 $9$ 个。立体图形也有大小，即它占据的空间，度量的方法相同：数**单位正方体**，也就是棱长为 $1$ 个单位的正方体。这个个数就是立体图形的**体积**，单位是立方厘米（$\\text{cm}^3$）等体积单位。

用单位正方体搭一个棱长 $3$ 厘米的正方体。最底下一层是 $3 \\times 3$ 的正方形，共 $9$ 个，一共叠了 $3$ 层：

{{figure 0}}

所以这个正方体里有 $3 \\cdot 9 = 3 \\cdot 3 \\cdot 3 = 27$ 个单位正方体，体积是 $27\\text{ cm}^3$。三条棱相乘就是棱长的立方 $3^3$，"立方"一词正是由此而来。这节课我们由棱长求正方体的体积，由体积求棱长，并数出大正方体中能装多少个小正方体。`,
  ),
  introFigures: [
    figure(
      cubeGrid(3),
      "A cube with edges of 3 cm built from unit cubes: 3 layers of 3 by 3 cubes.",
      "用单位正方体搭成的棱长 3 厘米的正方体：3 层，每层 3 × 3 个。",
    ),
  ],
  knowledgePoints: [
    {
      id: "volume-from-the-edge",
      title: t("Volume from the edge", "由棱长求体积"),
      explanation: t(
        `The **volume** of a solid is the amount of space it fills: the number of unit cubes it takes to fill it, in cubic units such as $\\text{cm}^3$.

A cube with edge $s$ has a bottom layer of $s \\times s = s^2$ unit cubes, and $s$ such layers, so its volume is

$$V = s^2 \\cdot s = s^3.$$

A cube with edge $4$ cm has $16$ unit cubes in each layer and $4$ layers: $V = 4^3 = 64\\text{ cm}^3$. The same works for an edge that is not a whole number: with edge $1.5$ m, $V = 1.5^3 = 2.25 \\cdot 1.5 = 3.375\\text{ m}^3$.

> **Watch out.** $s^3$ means $s \\cdot s \\cdot s$, not $3s$: a cube with edge $4$ has volume $64$, not $12$. And $s^2$ is the area of one face, $6s^2$ the surface area: volume uses all three dimensions.`,
        `立体图形的**体积**是它所占空间的大小，即填满它需要的单位正方体的个数，用 $\\text{cm}^3$ 等体积单位计量。

棱长为 $s$ 的正方体，最底下一层有 $s \\times s = s^2$ 个单位正方体，一共 $s$ 层，所以它的体积是

$$V = s^2 \\cdot s = s^3.$$

棱长 $4$ 厘米的正方体每层 $16$ 个单位正方体，共 $4$ 层：$V = 4^3 = 64\\text{ cm}^3$。棱长不是整数时也一样：棱长 $1.5$ 米时，$V = 1.5^3 = 2.25 \\cdot 1.5 = 3.375\\text{ m}^3$。

> **注意。** $s^3$ 表示 $s \\cdot s \\cdot s$，不是 $3s$：棱长为 $4$ 的正方体体积是 $64$，不是 $12$。$s^2$ 是一个面的面积，$6s^2$ 是表面积：体积要用到三个方向。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.bool(0.75) ? Q.of(rng.int(2, 15)) : Q.of(2 * rng.int(1, 6) + 1, 2);
        const v = s.pow(3);
        const decimal = !s.isInteger();
        const [lo, hi] = [Math.floor(s.toNumber()), Math.ceil(s.toNumber())];
        return {
          ...numberProblem({
            prompt: t("Find the volume of the cube.", "求这个正方体的体积。"),
            answer: v,
            form: decimal ? "decimal" : "integer",
            unit: `${u}^3`,
            mistakes: [
              why(
                s.pow(2),
                "That is the area of one face. Volume multiplies three edges, $s^3$.",
                "这是一个面的面积。体积是三条棱相乘，$s^3$。",
              ),
              why(
                s.mul(Q.of(3)),
                "You multiplied the edge by $3$. The exponent $3$ means edge times edge times edge.",
                "你用棱长乘了 $3$。指数 $3$ 的意思是棱长连乘三次。",
              ),
              why(s.pow(2).mul(Q.of(6)), "That is the surface area, $6s^2$. Volume is $s^3$.", "这是表面积 $6s^2$。体积是 $s^3$。"),
              why(
                s.mul(Q.of(12)),
                "That is the total length of the $12$ edges. Volume is $s^3$.",
                "这是 $12$ 条棱的总长度。体积是 $s^3$。",
              ),
            ],
            solution: t(
              `**Step 1: the formula.** The cube has edge $s = ${dec(s)}$ ${unitWord(u)}, and its volume is $V = s^3$, edge times edge times edge.

**Step 2: cube the edge.**${steps(`V = ${dec(s)}^3 = ${dec(s)} \\cdot ${dec(s)} \\cdot ${dec(s)} = ${dec(v)}\\text{ ${u}}^3`)}**Check.** ${
                decimal
                  ? `The edge lies between $${lo}$ and $${hi}$, so the volume must lie between $${lo}^3 = ${lo ** 3}$ and $${hi}^3 = ${hi ** 3}$; $${dec(v)}$ does.`
                  : `Count by layers: the bottom layer holds $${dec(s)}^2 = ${dec(s.pow(2))}$ unit cubes, and there are $${dec(s)}$ layers, $${dec(s.pow(2))} \\cdot ${dec(s)} = ${dec(v)}$.`
              }`,
              `**第一步：公式。** 正方体棱长 $s = ${dec(s)}$（单位 ${u}），体积 $V = s^3$，即棱长连乘三次。

**第二步：求立方。**${steps(`V = ${dec(s)}^3 = ${dec(s)} \\cdot ${dec(s)} \\cdot ${dec(s)} = ${dec(v)}\\text{ ${u}}^3`)}**检验。** ${
                decimal
                  ? `棱长在 $${lo}$ 和 $${hi}$ 之间，所以体积应在 $${lo}^3 = ${lo ** 3}$ 和 $${hi}^3 = ${hi ** 3}$ 之间；$${dec(v)}$ 确实如此。`
                  : `按层数一数：底层有 $${dec(s)}^2 = ${dec(s.pow(2))}$ 个单位正方体，共 $${dec(s)}$ 层，$${dec(s.pow(2))} \\cdot ${dec(s)} = ${dec(v)}$。`
              }`,
            ),
          }),
          figure: cubeFigure(len(s, u)),
        };
      },
    },
    {
      id: "edge-from-the-volume",
      title: t("Edge from the volume", "由体积求棱长"),
      explanation: t(
        `To find the edge from the volume, undo the cubing. The number whose cube is $V$ is its **cube root**:

$$s = \\sqrt[3]{V}.$$

A cube with volume $512\\text{ cm}^3$: which number times itself three times gives $512$? Try: $7^3 = 343$ is too small, $8^3 = 512$ is right. So the edge is $\\sqrt[3]{512} = 8$ cm. Knowing the first cubes by heart helps: $1, 8, 27, 64, 125, 216, 343, 512, 729, 1000$.

> **Watch out.** Dividing the volume by $3$ does not undo cubing: $512 \\div 3$ is not an edge of this cube. Nor does a square root, which undoes squaring. Only the cube root does, and multiplying it out three times must give back the volume.`,
        `已知体积求棱长，就要撤销立方。立方等于 $V$ 的数叫作 $V$ 的**立方根**：

$$s = \\sqrt[3]{V}.$$

体积为 $512\\text{ cm}^3$ 的正方体：哪个数连乘三次得 $512$？试一试：$7^3 = 343$ 太小，$8^3 = 512$ 正好。所以棱长是 $\\sqrt[3]{512} = 8$ 厘米。记住前几个立方数会很有帮助：$1, 8, 27, 64, 125, 216, 343, 512, 729, 1000$。

> **注意。** 把体积除以 $3$ 并不能撤销立方：$512 \\div 3$ 不是这个正方体的棱长。开平方也不行，它撤销的是平方。只有开立方才行，而且把结果连乘三次必须得回原来的体积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 15);
        const v = s ** 3;
        const below = (s - 1) ** 3;
        return {
          ...numberProblem({
            prompt: t(
              `A cube has a volume of $${tex(v, u, 3)}$. How long is each edge?`,
              `一个正方体的体积是 $${tex(v, u, 3)}$。它的棱长是多少？`,
            ),
            answer: s,
            form: "integer",
            unit: u,
            wrong: [Q.of(v, 12)],
            mistakes: [
              why(Q.of(v, 3), "You divided by $3$. To undo a cube, take the cube root.", "你除以了 $3$。要撤销立方，应该开立方。"),
              why(
                Q.of(v, 6),
                "You divided by $6$, which belongs to surface area. Here take the cube root of the volume.",
                "你除以了 $6$，那是求表面积时用的。这里要对体积开立方。",
              ),
              why(
                s * s,
                "That is the area of one face. The edge is the cube root of the volume.",
                "这是一个面的面积。棱长是体积的立方根。",
              ),
            ],
            solution: t(
              `**Step 1: undo the cube.** The volume is $s^3 = ${v}$, so the edge is the cube root of $${v}$: the number that, multiplied by itself three times, gives $${v}$.

**Step 2: find it.** $${s - 1}^3 = ${below}$ is too small, and $${s}^3 = ${v}$ is exactly right:${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`)}{{figure 0}}

**Check.** Multiply back: $${s} \\cdot ${s} \\cdot ${s} = ${s * s} \\cdot ${s} = ${v}$.`,
              `**第一步：撤销立方。** 体积 $s^3 = ${v}$，所以棱长是 $${v}$ 的立方根，即连乘三次得 $${v}$ 的数。

**第二步：求出它。** $${s - 1}^3 = ${below}$ 太小，$${s}^3 = ${v}$ 正好：${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`)}{{figure 0}}

**检验。** 乘回去：$${s} \\cdot ${s} \\cdot ${s} = ${s * s} \\cdot ${s} = ${v}$。`,
            ),
          }),
          solutionFigures: [cubeFigure(len(s, u))],
        };
      },
    },
    {
      id: "small-cubes-in-a-large-cube",
      title: t("Small cubes in a large cube", "大正方体中的小正方体"),
      explanation: t(
        `To pack a large cube with small ones, count along one edge first. A cube with edge $10$ cm packed with cubes of edge $2$ cm has $10 \\div 2 = 5$ small cubes along each edge, so each layer is $5 \\times 5$ and there are $5$ layers: $5^3 = 125$ small cubes.

The volumes agree: the large cube has $10^3 = 1000\\text{ cm}^3$ and each small one $2^3 = 8\\text{ cm}^3$, and $1000 \\div 8 = 125$.

The same reasoning shows how volume grows. Multiplying every edge of a cube by $3$ puts $3$ copies of the old cube along each edge, so $3^3 = 27$ copies in all: the volume is multiplied by $27$.

> **Watch out.** The number along one edge is not the answer: it counts one row. Cube it, to count rows, columns and layers. Doubling the edge multiplies the volume by $8$, not by $2$ or $4$.`,
        `用小正方体装满大正方体，先数一条棱上能放几个。棱长 $10$ 厘米的正方体，用棱长 $2$ 厘米的小正方体装，每条棱上能放 $10 \\div 2 = 5$ 个，所以每层 $5 \\times 5$ 个，共 $5$ 层：$5^3 = 125$ 个。

用体积算结果一致：大正方体 $10^3 = 1000\\text{ cm}^3$，每个小正方体 $2^3 = 8\\text{ cm}^3$，$1000 \\div 8 = 125$。

同样的道理说明体积如何增长。把正方体的每条棱都乘以 $3$，每条棱上就能放 $3$ 个原来的正方体，一共 $3^3 = 27$ 个：体积乘以 $27$。

> **注意。** 一条棱上的个数不是答案：它只数了一行。要把它立方，才数到了行、列和层。棱长扩大到 $2$ 倍，体积扩大到 $8$ 倍，不是 $2$ 倍或 $4$ 倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool(0.3)) {
          const k = rng.int(2, 6);
          return {
            ...numberProblem({
              prompt: t(
                `Each edge of a cube is multiplied by $${k}$. By what number is its volume multiplied?`,
                `把一个正方体的每条棱都乘以 $${k}$。它的体积乘以多少？`,
              ),
              answer: k ** 3,
              form: "integer",
              mistakes: [
                why(k, "That counts one row. Multiply rows by columns by layers.", "这只数了一行。要用行数乘列数再乘层数。"),
                why(k * k, "That counts one layer. Multiply by the number of layers too.", "这只数了一层，还要乘层数。"),
                why(3 * k, "You multiplied by $3$. Cubing means multiplying by itself three times.", "你乘了 $3$。立方是自身连乘三次。"),
                why(
                  6 * k * k,
                  "That counts the small squares on the outside, the surface. The volume counts all the cubes.",
                  "这数的是外表面的小正方形。体积要数所有小立方体。",
                ),
              ],
              solution: t(
                `**Step 1: copies along an edge.** The new cube has edge $${k}s$, so $${k}$ copies of the old cube fit along each of its edges.

**Step 2: count the copies.** That is $${k}$ in a row, $${k} \\cdot ${k} = ${k * k}$ in a layer and $${k}$ layers:${steps(`(${k}s)^3 = ${k}^3 s^3 = ${k ** 3}s^3`)}{{figure 0}}

**Check.** Try a cube with edge $1$: its volume is $1$. The new cube has edge $${k}$ and volume $${k}^3 = ${k ** 3}$, which is $${k ** 3}$ times as much.`,
                `**第一步：一条棱上的个数。** 新正方体棱长是 $${k}s$，所以每条棱上能放 $${k}$ 个原来的正方体。

**第二步：数个数。** 每行 $${k}$ 个，每层 $${k} \\cdot ${k} = ${k * k}$ 个，共 $${k}$ 层：${steps(`(${k}s)^3 = ${k}^3 s^3 = ${k ** 3}s^3`)}{{figure 0}}

**检验。** 取棱长为 $1$ 的正方体：体积是 $1$。新正方体棱长 $${k}$，体积 $${k}^3 = ${k ** 3}$，正好是原来的 $${k ** 3}$ 倍。`,
              ),
            }),
            solutionFigures: [
              figure(
                cubeGrid(k),
                `A cube whose edges are ${k} times as long, made of ${k ** 3} copies of the original cube.`,
                `棱长扩大到 ${k} 倍的正方体，由 ${k ** 3} 个原来的正方体组成。`,
              ),
            ],
          };
        }
        const small = rng.int(1, 5);
        const k = rng.int(2, 6);
        const big = small * k;
        return {
          ...numberProblem({
            prompt: t(
              `How many cubes with edge $${tex(small, u)}$ fit exactly inside a cube with edge $${tex(big, u)}$?`,
              `棱长为 $${tex(big, u)}$ 的正方体中恰好能放多少个棱长为 $${tex(small, u)}$ 的小正方体？`,
            ),
            answer: k ** 3,
            form: "integer",
            wrong: [k, k * k, 3 * k, big ** 3],
            solution: t(
              `**Step 1: along one edge.** $${big} \\div ${small} = ${k}$ small cubes fit along each edge of the large cube.

**Step 2: rows, layers and all.** Each layer is $${k} \\times ${k} = ${k * k}$ small cubes, and there are $${k}$ layers:${steps(`${k}^3 = ${k ** 3}`)}{{figure 0}}

**Check.** Divide the volumes: the large cube has $${big}^3 = ${big ** 3}$ and each small one $${small}^3 = ${small ** 3}$, and $${big ** 3} \\div ${small ** 3} = ${k ** 3}$.`,
              `**第一步：一条棱上。** 大正方体的每条棱上能放 $${big} \\div ${small} = ${k}$ 个小正方体。

**第二步：行、层和总数。** 每层 $${k} \\times ${k} = ${k * k}$ 个，共 $${k}$ 层：${steps(`${k}^3 = ${k ** 3}`)}{{figure 0}}

**检验。** 用体积相除：大正方体 $${big}^3 = ${big ** 3}$，每个小正方体 $${small}^3 = ${small ** 3}$，$${big ** 3} \\div ${small ** 3} = ${k ** 3}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              cubeGrid(k),
              `The large cube packed with small cubes: ${k} along each edge, ${k ** 3} in all.`,
              `装满小正方体的大正方体：每条棱上 ${k} 个，共 ${k ** 3} 个。`,
            ),
          ],
        };
      },
    },
  ],
};

export const surfaceAreasOfCubes: TopicDef = {
  id: "surface-areas-of-cubes",
  title: t("Surface Areas of Cubes", "正方体的表面积"),
  summary: t(
    "Find the surface area of a cube from its edge, the edge from the surface area, and convert between surface area and volume.",
    "由棱长求正方体的表面积，由表面积求棱长，并在表面积与体积之间换算。",
  ),
  prerequisites: ["finding-surface-areas-using-nets", "volumes-of-cubes"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 10,
  intro: t(
    `How much paper does it take to cover a cube-shaped gift box with edges of $10$ cm, with no overlap? Unfold the box: its net is $6$ squares, one for each face, and each of them is $10 \\times 10 = 100\\text{ cm}^2$:

{{figure 0}}

So the paper needed is $6 \\cdot 100 = 600\\text{ cm}^2$. That is the **surface area** of the cube, and since all six faces of a cube are the same square, it is always six times one face. The box also has a volume, $10^3 = 1000\\text{ cm}^3$, but that answers a different question, how much the box holds, and is measured in cubic units. In this lesson we find the surface area from the edge, the edge from the surface area, and go between surface area and volume through the edge.`,
    `包一个棱长 $10$ 厘米的正方体礼盒，不重叠，需要多少纸？把盒子展开：它的展开图是 $6$ 个正方形，每个面一个，每个都是 $10 \\times 10 = 100\\text{ cm}^2$：

{{figure 0}}

所以需要的纸是 $6 \\cdot 100 = 600\\text{ cm}^2$。这就是正方体的**表面积**；正方体的六个面是同样的正方形，所以表面积总是一个面的六倍。盒子还有体积 $10^3 = 1000\\text{ cm}^3$，但它回答的是另一个问题，盒子能装多少，用的是体积单位。这节课我们由棱长求表面积，由表面积求棱长，并借助棱长在表面积与体积之间换算。`,
  ),
  introFigures: [
    figure(
      [
        ...squaresNet(cubeNetCells(1, 2), ["100", "100", "100", "100", "100", "100"]),
        { kind: "side", a: [0, 2], b: [0, 1], text: "10 cm" },
      ],
      "A net of a cube with edges of 10 cm: six squares, each with an area of 100 square centimeters.",
      "棱长 10 厘米的正方体的展开图：六个正方形，每个面积 100 平方厘米。",
    ),
  ],
  knowledgePoints: [
    {
      id: "surface-area-from-the-edge",
      title: t("Surface area from the edge", "由棱长求表面积"),
      explanation: t(
        `The surface area of a solid is the total area of its faces, the area of its net. A cube has $6$ congruent square faces: top and bottom, front and back, left and right. With edge $s$, each face has area $s^2$, so

$$S = 6s^2.$$

A cube with edge $5$ cm has faces of $5^2 = 25\\text{ cm}^2$, and $S = 6 \\cdot 25 = 150\\text{ cm}^2$. Surface area is an area, so it is in square units.

> **Watch out.** Square the edge before multiplying by $6$: $6s^2$ is $6 \\cdot 25$, not $(6 \\cdot 5)^2$ and not $6 \\cdot 5$. And count all $6$ faces: leaving out the top and bottom gives $4s^2$. The volume, $5^3 = 125\\text{ cm}^3$, is a different measure.`,
        `立体图形的表面积是它各个面的面积之和，也就是展开图的面积。正方体有 $6$ 个全等的正方形面：上下、前后、左右。棱长为 $s$ 时，每个面的面积是 $s^2$，所以

$$S = 6s^2.$$

棱长 $5$ 厘米的正方体每个面 $5^2 = 25\\text{ cm}^2$，$S = 6 \\cdot 25 = 150\\text{ cm}^2$。表面积是面积，所以用面积单位。

> **注意。** 先把棱长平方，再乘 $6$：$6s^2$ 是 $6 \\cdot 25$，不是 $(6 \\cdot 5)^2$，也不是 $6 \\cdot 5$。$6$ 个面都要算：漏掉上下两面就得到 $4s^2$。体积 $5^3 = 125\\text{ cm}^3$ 是另一个量。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        const face = s * s;
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the cube.", "求这个正方体的表面积。"),
            answer: 6 * face,
            form: "integer",
            unit: `${u}^2`,
            mistakes: [
              why(
                s ** 3,
                "That is the volume, $s^3$. Surface area adds the areas of the $6$ faces.",
                "这是体积 $s^3$。表面积是 $6$ 个面的面积之和。",
              ),
              why(face, "That is the area of one face. A cube has $6$ faces.", "这是一个面的面积。正方体有 $6$ 个面。"),
              why(
                4 * face,
                "That counts only $4$ faces. A cube has $6$, including top and bottom.",
                "这只算了 $4$ 个面。正方体有 $6$ 个面，包括上下两面。",
              ),
              why(6 * s, "You did not square the edge. Each face has area $s^2$.", "你没有把棱长平方。每个面的面积是 $s^2$。"),
              why(
                12 * s,
                "That is the total length of the edges. Surface area counts the faces.",
                "这是所有棱的总长度。表面积要算的是面。",
              ),
            ],
            solution: t(
              `**Step 1: one face.** Each face is a square with side $${tex(s, u)}$, so its area is $${s}^2 = ${tex(face, u, 2)}$.

**Step 2: six faces.** The net of the cube is six such squares:${steps(`S = 6s^2 = 6 \\cdot ${face} = ${tex(6 * face, u, 2)}`)}{{figure 0}}

**Check.** Add the faces in pairs: top and bottom, front and back, left and right each give $2 \\cdot ${face} = ${2 * face}$, and $3 \\cdot ${2 * face} = ${6 * face}$. The answer is an area, in square units.`,
              `**第一步：一个面。** 每个面都是边长 $${tex(s, u)}$ 的正方形，面积是 $${s}^2 = ${tex(face, u, 2)}$。

**第二步：六个面。** 正方体的展开图是六个这样的正方形：${steps(`S = 6s^2 = 6 \\cdot ${face} = ${tex(6 * face, u, 2)}`)}{{figure 0}}

**检验。** 按对相加：上下、前后、左右每对都是 $2 \\cdot ${face} = ${2 * face}$，$3 \\cdot ${2 * face} = ${6 * face}$。答案是面积，用面积单位。`,
            ),
          }),
          figure: cubeFigure(len(s, u)),
          solutionFigures: [
            figure(
              [...squaresNet(cubeNetCells(1, 1), Array(6).fill(`${face}`)), { kind: "side", a: [0, 2], b: [0, 1], text: len(s, u) }],
              `The net of the cube: six squares with side ${len(s, u)}, each of area ${face}.`,
              `正方体的展开图：六个边长 ${len(s, u)} 的正方形，每个面积 ${face}。`,
            ),
          ],
        };
      },
    },
    {
      id: "edge-from-the-surface-area",
      title: t("Edge from the surface area", "由表面积求棱长"),
      explanation: t(
        `To find the edge from the surface area, undo the two steps of $S = 6s^2$ in reverse order. First divide by $6$, which gives the area of one face; then take the square root, which gives the side of that square:

$$s = \\sqrt{\\frac{S}{6}}.$$

A cube with surface area $384\\text{ cm}^2$ has faces of $384 \\div 6 = 64\\text{ cm}^2$, and a square of area $64$ has side $\\sqrt{64} = 8$, so the edge is $8$ cm.

> **Watch out.** $S \\div 6$ is the area of a face, not the edge: take its square root as well. And divide by $6$, the number of faces of a cube, not by $4$.`,
        `已知表面积求棱长，要按相反的顺序撤销 $S = 6s^2$ 的两步。先除以 $6$，得到一个面的面积；再开平方，得到这个正方形的边长：

$$s = \\sqrt{\\frac{S}{6}}.$$

表面积为 $384\\text{ cm}^2$ 的正方体，每个面是 $384 \\div 6 = 64\\text{ cm}^2$，面积为 $64$ 的正方形边长是 $\\sqrt{64} = 8$，所以棱长是 $8$ 厘米。

> **注意。** $S \\div 6$ 是一个面的面积，不是棱长：还要再开平方。要除以正方体的面数 $6$，不是 $4$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        const area = 6 * s * s;
        return {
          ...numberProblem({
            prompt: t(
              `A cube has a surface area of $${tex(area, u, 2)}$. How long is each edge?`,
              `一个正方体的表面积是 $${tex(area, u, 2)}$。它的棱长是多少？`,
            ),
            answer: s,
            form: "integer",
            unit: u,
            mistakes: [
              why(
                area / 6,
                "That is the area of one face. Take its square root to get the edge.",
                "这是一个面的面积。还要开平方才是棱长。",
              ),
              why(Q.of(area, 4), "You divided by $4$. A cube has $6$ equal faces.", "你除以了 $4$。正方体有 $6$ 个相等的面。"),
              why(
                6 * s,
                "That multiplies the edge by $6$. Divide the area by $6$, then take the square root.",
                "这是棱长乘 $6$。应把面积除以 $6$，再开平方。",
              ),
            ],
            solution: t(
              `**Step 1: one face.** The $6$ faces are equal, so one face has area${steps(`${area} \\div 6 = ${tex(s * s, u, 2)}`)}**Step 2: the side of that square.**${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}{{figure 0}}

**Check.** Work forward: $6 \\cdot ${s}^2 = 6 \\cdot ${s * s} = ${area}$, the surface area given.`,
              `**第一步：一个面。** $6$ 个面相等，所以一个面的面积是${steps(`${area} \\div 6 = ${tex(s * s, u, 2)}`)}**第二步：这个正方形的边长。**${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}{{figure 0}}

**检验。** 正着算一遍：$6 \\cdot ${s}^2 = 6 \\cdot ${s * s} = ${area}$，正是给出的表面积。`,
            ),
          }),
          solutionFigures: [cubeFigure(len(s, u))],
        };
      },
    },
    {
      id: "surface-area-and-volume",
      title: t("Surface area and volume", "表面积与体积"),
      explanation: t(
        `Surface area and volume are both determined by the edge, so to go from one to the other, find the edge first and then use the other formula.

A cube with volume $343\\text{ cm}^3$ has edge $\\sqrt[3]{343} = 7$ cm, because $7^3 = 343$. Its surface area is $6 \\cdot 7^2 = 6 \\cdot 49 = 294\\text{ cm}^2$. Going the other way, a cube with surface area $96\\text{ cm}^2$ has faces of $96 \\div 6 = 16\\text{ cm}^2$, so its edge is $4$ cm and its volume is $4^3 = 64\\text{ cm}^3$.

> **Watch out.** There is no shortcut from one number to the other: the volume divided by $6$, or the surface area times something, is not the answer. Go through the edge, and give the answer in the right units: square units for area, cubic units for volume.`,
        `表面积和体积都由棱长决定，所以在两者之间换算时，先求出棱长，再用另一个公式。

体积为 $343\\text{ cm}^3$ 的正方体，棱长是 $\\sqrt[3]{343} = 7$ 厘米，因为 $7^3 = 343$。它的表面积是 $6 \\cdot 7^2 = 6 \\cdot 49 = 294\\text{ cm}^2$。反过来，表面积为 $96\\text{ cm}^2$ 的正方体每个面是 $96 \\div 6 = 16\\text{ cm}^2$，所以棱长是 $4$ 厘米，体积是 $4^3 = 64\\text{ cm}^3$。

> **注意。** 两个数之间没有捷径：体积除以 $6$，或表面积乘上某个数，都不是答案。要经过棱长来算，并且答案要用对单位：面积用面积单位，体积用体积单位。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const [v, area] = [s ** 3, 6 * s * s];
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `A cube has a volume of $${tex(v, u, 3)}$. Find its surface area.`,
                `一个正方体的体积是 $${tex(v, u, 3)}$。求它的表面积。`,
              ),
              answer: area,
              form: "integer",
              unit: `${u}^2`,
              wrong: [v, 6 * v, s * s, 4 * s * s],
              solution: t(
                `**Step 1: the edge.** The volume is $s^3 = ${v}$, and $${s}^3 = ${v}$, so${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`)}{{figure 0}}

**Step 2: the surface area.** Each face is $${s}^2 = ${s * s}$, and there are $6$:${steps(`S = 6 \\cdot ${s}^2 = 6 \\cdot ${s * s} = ${tex(area, u, 2)}`)}**Check.** Go back from the answer: $${area} \\div 6 = ${s * s}$, so the edge is $\\sqrt{${s * s}} = ${s}$, and $${s}^3 = ${v}$ is the volume given.`,
                `**第一步：棱长。** 体积 $s^3 = ${v}$，而 $${s}^3 = ${v}$，所以${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`)}{{figure 0}}

**第二步：表面积。** 每个面是 $${s}^2 = ${s * s}$，共 $6$ 个：${steps(`S = 6 \\cdot ${s}^2 = 6 \\cdot ${s * s} = ${tex(area, u, 2)}`)}**检验。** 从答案倒推：$${area} \\div 6 = ${s * s}$，棱长是 $\\sqrt{${s * s}} = ${s}$，而 $${s}^3 = ${v}$ 正是给出的体积。`,
              ),
            }),
            solutionFigures: [cubeFigure(len(s, u))],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `A cube has a surface area of $${tex(area, u, 2)}$. Find its volume.`,
              `一个正方体的表面积是 $${tex(area, u, 2)}$。求它的体积。`,
            ),
            answer: v,
            form: "integer",
            unit: `${u}^3`,
            wrong: [area, s * s, Q.of(area, 6), 6 * v],
            solution: t(
              `**Step 1: the edge.** One face has area $${area} \\div 6 = ${s * s}$, so the edge is${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}{{figure 0}}

**Step 2: the volume.**${steps(`V = ${s}^3 = ${s} \\cdot ${s} \\cdot ${s} = ${tex(v, u, 3)}`)}**Check.** Go back from the answer: $\\sqrt[3]{${v}} = ${s}$, and $6 \\cdot ${s}^2 = ${area}$ is the surface area given.`,
              `**第一步：棱长。** 一个面的面积是 $${area} \\div 6 = ${s * s}$，所以棱长是${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}{{figure 0}}

**第二步：体积。**${steps(`V = ${s}^3 = ${s} \\cdot ${s} \\cdot ${s} = ${tex(v, u, 3)}`)}**检验。** 从答案倒推：$\\sqrt[3]{${v}} = ${s}$，而 $6 \\cdot ${s}^2 = ${area}$ 正是给出的表面积。`,
            ),
          }),
          solutionFigures: [cubeFigure(len(s, u))],
        };
      },
    },
  ],
};

export const faceDiagonalsOfCubes: TopicDef = {
  id: "face-diagonals-of-cubes",
  title: t("Face Diagonals of Cubes", "正方体的面对角线"),
  summary: t(
    "Find the diagonal of a face of a cube, s√2, and work back from it to the edge.",
    "求正方体一个面的对角线 s√2，并由它反求棱长。",
  ),
  prerequisites: ["volumes-of-cubes", "rationalizing-denominators", "the-pythagorean-theorem"],
  encompasses: [{ topic: "the-pythagorean-theorem", weight: 0.3 }],
  xp: 12,
  intro: t(
    `A cube-shaped box has edges of $3$ cm. How long a straight stick can lie flat on its bottom? The longest line on a square face runs from one corner to the opposite corner: a **face diagonal**.

{{figure 0}}

The diagonal cuts the face into two right triangles, each with legs of $3$ cm, so the Pythagorean theorem gives its length: $d^2 = 3^2 + 3^2 = 18$, and $d = \\sqrt{18} = 3\\sqrt{2} \\approx 4.24$ cm. It is longer than an edge, as the hypotenuse must be, but shorter than two edges, the way around the corner. In this lesson we find face diagonals from edges, edges from face diagonals, and face diagonals from the volume or surface area.`,
    `一个正方体盒子的棱长是 $3$ 厘米。能平放在盒底的直棍最长是多少？正方形面上最长的线段从一个角连到相对的角，这就是**面对角线**。

{{figure 0}}

对角线把这个面分成两个直角三角形，两条直角边都是 $3$ 厘米，所以由勾股定理求它的长：$d^2 = 3^2 + 3^2 = 18$，$d = \\sqrt{18} = 3\\sqrt{2} \\approx 4.24$ 厘米。它比一条棱长，因为斜边必须最长；又比两条棱的和短，那是绕过角落的路线。这节课我们由棱长求面对角线，由面对角线求棱长，并由体积或表面积求面对角线。`,
  ),
  introFigures: [cubeFigure("3 cm", "front", "d")],
  knowledgePoints: [
    {
      id: "face-diagonal-from-the-edge",
      figure: solidDrawings["face-diagonal-from-the-edge"],
      title: t("Face diagonal from the edge", "由棱长求面对角线"),
      explanation: t(
        `A **face diagonal** of a cube joins opposite corners of one face. With the two edges at that face's corner it forms a right triangle whose hypotenuse is the diagonal, so by the Pythagorean theorem ($a^2 + b^2 = c^2$ in a right triangle with hypotenuse $c$):

$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = \\sqrt{2s^2} = s\\sqrt{2}.$$

A cube with edge $5$ cm: $d^2 = 25 + 25 = 50$, so $d = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07$ cm. Every face diagonal of every cube is the edge times $\\sqrt{2} \\approx 1.41$.

> **Watch out.** The diagonal is not the two edges added, $s + s = 2s$: the square root of a sum is not the sum of the roots. And $\\sqrt{2}$ multiplies the edge, $s\\sqrt{2}$, not $\\sqrt{2s}$. The factor $\\sqrt{3}$ belongs to the diagonal through the interior.`,
        `正方体的**面对角线**连接一个面上相对的两个顶点。它和这个面一角处的两条棱组成直角三角形，对角线是斜边，所以由勾股定理（斜边为 $c$ 的直角三角形中 $a^2 + b^2 = c^2$）：

$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = \\sqrt{2s^2} = s\\sqrt{2}.$$

棱长 $5$ 厘米的正方体：$d^2 = 25 + 25 = 50$，所以 $d = \\sqrt{50} = 5\\sqrt{2} \\approx 7.07$ 厘米。任何正方体的面对角线都是棱长乘 $\\sqrt{2} \\approx 1.41$。

> **注意。** 对角线不是两条棱相加 $s + s = 2s$：和的平方根不等于平方根的和。$\\sqrt{2}$ 乘的是棱长，即 $s\\sqrt{2}$，不是 $\\sqrt{2s}$。因数 $\\sqrt{3}$ 属于穿过内部的体对角线。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        const approx = (s * Math.SQRT2).toFixed(2);
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length $d$ of a face diagonal of the cube, in ${unitWord(u)}.`,
              `求这个正方体面对角线的长 $d$（单位：${u}）。`,
            ),
            answer: [s, 2],
            wrong: [String(2 * s), `${s}\\sqrt{3}`, `\\sqrt{${2 * s}}`, String(s * s * 2)],
            solution: t(
              `**Step 1: the right triangle.** The diagonal and two edges of the face form a right triangle with legs $${s}$ and $${s}$ and hypotenuse $d$:

{{figure 0}}

**Step 2: the Pythagorean theorem.**${steps(`d^2 = ${s}^2 + ${s}^2 = ${s * s} + ${s * s} = ${2 * s * s}`, `d = \\sqrt{${2 * s * s}} = \\sqrt{${s * s}} \\cdot \\sqrt{2} = ${s}\\sqrt{2}`)}**Check.** $${s}\\sqrt{2} \\approx ${s} \\cdot 1.414 \\approx ${approx}$, longer than one edge, $${s}$, and shorter than the way around the corner, $${s} + ${s} = ${2 * s}$, as a hypotenuse must be.`,
              `**第一步：直角三角形。** 对角线和这个面的两条棱组成直角三角形，两条直角边都是 $${s}$，斜边是 $d$：

{{figure 0}}

**第二步：勾股定理。**${steps(`d^2 = ${s}^2 + ${s}^2 = ${s * s} + ${s * s} = ${2 * s * s}`, `d = \\sqrt{${2 * s * s}} = \\sqrt{${s * s}} \\cdot \\sqrt{2} = ${s}\\sqrt{2}`)}**检验。** $${s}\\sqrt{2} \\approx ${s} \\cdot 1.414 \\approx ${approx}$，比一条棱 $${s}$ 长，又比绕过角落的 $${s} + ${s} = ${2 * s}$ 短，斜边理应如此。`,
            ),
          }),
          figure: cubeFigure(len(s, u), "front", "d"),
          solutionFigures: [faceSquare(len(s, u), "d")],
        };
      },
    },
    {
      id: "edge-from-the-face-diagonal",
      title: t("Edge from the face diagonal", "由面对角线求棱长"),
      explanation: t(
        `Since $d = s\\sqrt{2}$, divide the face diagonal by $\\sqrt{2}$ to get the edge. If the result has $\\sqrt{2}$ in the denominator, rationalize it by multiplying the top and bottom by $\\sqrt{2}$:

$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$

A face diagonal of $9\\sqrt{2}$ cm gives an edge of $9$ cm, since the $\\sqrt{2}$ cancels. A face diagonal of $8$ cm gives $s = \\frac{8}{\\sqrt{2}} = \\frac{8\\sqrt{2}}{2} = 4\\sqrt{2}$ cm. Multiply back to check: $4\\sqrt{2} \\cdot \\sqrt{2} = 4 \\cdot 2 = 8$.

> **Watch out.** Divide by $\\sqrt{2}$, not by $2$: the edge is longer than half the diagonal. And do not multiply by $\\sqrt{2}$ instead, which gives a length longer than the diagonal. Leave no root in the denominator: $\\frac{8}{\\sqrt{2}}$ is not in simplest form.`,
        `因为 $d = s\\sqrt{2}$，把面对角线除以 $\\sqrt{2}$ 就得到棱长。如果结果的分母里有 $\\sqrt{2}$，就把分子分母同乘 $\\sqrt{2}$，使分母有理化：

$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$

面对角线为 $9\\sqrt{2}$ 厘米时，$\\sqrt{2}$ 约去，棱长是 $9$ 厘米。面对角线为 $8$ 厘米时，$s = \\frac{8}{\\sqrt{2}} = \\frac{8\\sqrt{2}}{2} = 4\\sqrt{2}$ 厘米。乘回去检验：$4\\sqrt{2} \\cdot \\sqrt{2} = 4 \\cdot 2 = 8$。

> **注意。** 要除以 $\\sqrt{2}$，不是除以 $2$：棱长比对角线的一半长。也不要反过来乘 $\\sqrt{2}$，那样得到的长度比对角线还长。分母里不能留根号：$\\frac{8}{\\sqrt{2}}$ 不是最简形式。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 25);
        const rational = rng.bool();
        const d = rational ? tex(k, u) : `${k}\\sqrt{2}\\text{ ${u}}`;
        const answer: [Q, number] = rational ? [Q.of(k, 2), 2] : [Q.of(k), 1];
        const rationalized = `\\frac{${k}\\sqrt{2}}{2}`;
        const simplest = radical(Q.of(k, 2), 2);
        const edge = simplest === rationalized ? rationalized : `${rationalized} = ${simplest}`;
        return {
          ...radicalProblem({
            prompt: t(
              `A face diagonal of a cube is $${d}$ long. How long is each edge, in ${unitWord(u)}? Write it in simplest radical form.`,
              `一个正方体的面对角线长 $${d}$。它的棱长是多少（单位：${u}）？用最简根式表示。`,
            ),
            answer,
            wrong: rational
              ? [Q.of(k, 2).toLatex(), `${k}\\sqrt{2}`, `\\frac{${k}}{\\sqrt{2}}`]
              : [`${k}\\sqrt{2}`, `${2 * k}`, Q.of(k, 2).toLatex()],
            solution: rational
              ? t(
                  `**Step 1: divide by $\\sqrt{2}$.** A face diagonal is $s\\sqrt{2}$, so $s\\sqrt{2} = ${k}$ and $s = \\frac{${k}}{\\sqrt{2}}$.

{{figure 0}}

**Step 2: rationalize the denominator.** Multiply the top and bottom by $\\sqrt{2}$:${steps(`s = \\frac{${k}}{\\sqrt{2}} \\cdot \\frac{\\sqrt{2}}{\\sqrt{2}} = ${edge}`)}**Check.** Multiply back by $\\sqrt{2}$: $\\frac{${k}\\sqrt{2}}{2} \\cdot \\sqrt{2} = \\frac{${k} \\cdot 2}{2} = ${k}$, the diagonal given.`,
                  `**第一步：除以 $\\sqrt{2}$。** 面对角线是 $s\\sqrt{2}$，所以 $s\\sqrt{2} = ${k}$，$s = \\frac{${k}}{\\sqrt{2}}$。

{{figure 0}}

**第二步：分母有理化。** 分子分母同乘 $\\sqrt{2}$：${steps(`s = \\frac{${k}}{\\sqrt{2}} \\cdot \\frac{\\sqrt{2}}{\\sqrt{2}} = ${edge}`)}**检验。** 乘回 $\\sqrt{2}$：$\\frac{${k}\\sqrt{2}}{2} \\cdot \\sqrt{2} = \\frac{${k} \\cdot 2}{2} = ${k}$，正是给出的对角线。`,
                )
              : t(
                  `**Step 1: the relation.** A face diagonal is $s\\sqrt{2}$, so${steps(`s\\sqrt{2} = ${k}\\sqrt{2}`)}{{figure 0}}

**Step 2: divide by $\\sqrt{2}$.** The $\\sqrt{2}$ cancels on both sides:${steps(`s = ${k}`)}**Check.** A cube with edge $${k}$ has face diagonals $\\sqrt{${k}^2 + ${k}^2} = \\sqrt{${2 * k * k}} = ${k}\\sqrt{2}$, as given.`,
                  `**第一步：关系式。** 面对角线是 $s\\sqrt{2}$，所以${steps(`s\\sqrt{2} = ${k}\\sqrt{2}`)}{{figure 0}}

**第二步：除以 $\\sqrt{2}$。** 两边的 $\\sqrt{2}$ 约去：${steps(`s = ${k}`)}**检验。** 棱长 $${k}$ 的正方体，面对角线是 $\\sqrt{${k}^2 + ${k}^2} = \\sqrt{${2 * k * k}} = ${k}\\sqrt{2}$，与已知相符。`,
                ),
          }),
          solutionFigures: [faceSquare("s", rational ? `${k}` : `${k}√2`)],
        };
      },
    },
    {
      id: "face-diagonal-from-other-measures",
      title: t("Face diagonal from other measures", "由其他量求面对角线"),
      explanation: t(
        `The face diagonal, the volume and the surface area of a cube all depend on the edge alone. So when the volume or the surface area is given, first find the edge, then multiply it by $\\sqrt{2}$.

A cube with volume $27\\text{ cm}^3$ has edge $\\sqrt[3]{27} = 3$ cm, so its face diagonal is $3\\sqrt{2}$ cm. A cube with surface area $216\\text{ cm}^2$ has faces of $216 \\div 6 = 36\\text{ cm}^2$, edge $6$ cm and face diagonal $6\\sqrt{2}$ cm.

> **Watch out.** Find the edge before using $d = s\\sqrt{2}$: the volume or the area of a face put in place of $s$ gives a wrong length. And it is a face diagonal, $\\sqrt{2}$, not the diagonal through the interior, $\\sqrt{3}$.`,
        `正方体的面对角线、体积和表面积都只由棱长决定。所以已知体积或表面积时，先求出棱长，再乘 $\\sqrt{2}$。

体积为 $27\\text{ cm}^3$ 的正方体棱长是 $\\sqrt[3]{27} = 3$ 厘米，所以面对角线是 $3\\sqrt{2}$ 厘米。表面积为 $216\\text{ cm}^2$ 的正方体每个面是 $216 \\div 6 = 36\\text{ cm}^2$，棱长 $6$ 厘米，面对角线 $6\\sqrt{2}$ 厘米。

> **注意。** 先求棱长，再用 $d = s\\sqrt{2}$：把体积或一个面的面积当作 $s$ 代入，得到的长度是错的。这里求的是面对角线，用 $\\sqrt{2}$，不是穿过内部的体对角线所用的 $\\sqrt{3}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const fromVolume = rng.bool();
        const given = fromVolume
          ? t(`volume of $${tex(s ** 3, u, 3)}$`, `体积是 $${tex(s ** 3, u, 3)}$`)
          : t(`surface area of $${tex(6 * s * s, u, 2)}$`, `表面积是 $${tex(6 * s * s, u, 2)}$`);
        const edge = fromVolume ? `s = \\sqrt[3]{${s ** 3}} = ${s}` : `s = \\sqrt{${6 * s * s} \\div 6} = \\sqrt{${s * s}} = ${s}`;
        const back = fromVolume
          ? t(`$${s}^3 = ${s ** 3}$, the volume given`, `$${s}^3 = ${s ** 3}$，正是给出的体积`)
          : t(`$6 \\cdot ${s}^2 = ${6 * s * s}$, the surface area given`, `$6 \\cdot ${s}^2 = ${6 * s * s}$，正是给出的表面积`);
        return {
          ...radicalProblem({
            prompt: t(
              `A cube has a ${given.en}. How long is a face diagonal, in ${unitWord(u)}?`,
              `一个正方体的${given["zh-CN"]}。它的面对角线有多长（单位：${u}）？`,
            ),
            answer: [s, 2],
            wrong: [`${s}\\sqrt{3}`, String(2 * s), `${s * s}\\sqrt{2}`],
            solution: t(
              `**Step 1: the edge.** ${fromVolume ? "The volume is $s^3$, so take the cube root:" : "The surface area is $6s^2$, so divide by $6$ and take the square root:"}${steps(edge)}**Step 2: the face diagonal.** A face is a square with side $${s}$:${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${s}\\sqrt{2}`)}{{figure 0}}

**Check.** The edge fits the data: ${back.en}. And $d^2 = (${s}\\sqrt{2})^2 = ${2 * s * s} = 2 \\cdot ${s}^2$, twice the area of a face, as it should be.`,
              `**第一步：棱长。** ${fromVolume ? "体积是 $s^3$，所以开立方：" : "表面积是 $6s^2$，所以先除以 $6$，再开平方："}${steps(edge)}**第二步：面对角线。** 每个面是边长 $${s}$ 的正方形：${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${s}\\sqrt{2}`)}{{figure 0}}

**检验。** 棱长与已知相符：${back["zh-CN"]}。而 $d^2 = (${s}\\sqrt{2})^2 = ${2 * s * s} = 2 \\cdot ${s}^2$，正好是一个面面积的两倍，理应如此。`,
            ),
          }),
          solutionFigures: [cubeFigure(len(s, u), "front", "d")],
        };
      },
    },
  ],
};

export const diagonalsOfCubes: TopicDef = {
  id: "diagonals-of-cubes",
  title: t("Diagonals of Cubes", "正方体的体对角线"),
  summary: t(
    "Find the diagonal through the interior of a cube, s√3, and work back from it.",
    "求穿过正方体内部的体对角线 s√3，并由它反求其他量。",
  ),
  prerequisites: ["face-diagonals-of-cubes"],
  encompasses: [
    { topic: "face-diagonals-of-cubes", weight: 0.3 },
    { topic: "the-pythagorean-theorem", weight: 0.2 },
  ],
  xp: 12,
  intro: t(
    `A cube-shaped box has edges of $6$ cm. Lying flat on the bottom, a pencil can be as long as a face diagonal, $6\\sqrt{2} \\approx 8.49$ cm. But tilted up from one bottom corner to the opposite top corner, it can be longer still: that line through the inside of the box is the cube's **diagonal**, also called a space diagonal.

{{figure 0}}

It stands over the face diagonal of the bottom like a ramp over the floor, with an edge of $6$ cm rising straight up at the far end. So it is the hypotenuse of a right triangle with legs $6\\sqrt{2}$ and $6$: $D^2 = (6\\sqrt{2})^2 + 6^2 = 72 + 36 = 108$, and $D = \\sqrt{108} = 6\\sqrt{3} \\approx 10.39$ cm. In this lesson we find this diagonal from the edge, the edge from the diagonal, and pass between the two kinds of diagonal.`,
    `一个正方体盒子的棱长是 $6$ 厘米。平放在盒底的铅笔最长可以等于面对角线 $6\\sqrt{2} \\approx 8.49$ 厘米。但如果从底面的一个角斜着伸到相对的顶面的角，铅笔还能更长：这条穿过盒子内部的线段就是正方体的**体对角线**。

{{figure 0}}

它立在底面的面对角线上，就像地面上搭的一道斜坡，远端有一条 $6$ 厘米的棱竖直向上。所以它是直角边为 $6\\sqrt{2}$ 和 $6$ 的直角三角形的斜边：$D^2 = (6\\sqrt{2})^2 + 6^2 = 72 + 36 = 108$，$D = \\sqrt{108} = 6\\sqrt{3} \\approx 10.39$ 厘米。这节课我们由棱长求体对角线，由体对角线求棱长，并在两种对角线之间换算。`,
  ),
  introFigures: [spaceTriangle("6 cm", "6√2 cm", "D")],
  knowledgePoints: [
    {
      id: "space-diagonal-from-the-edge",
      figure: solidDrawings["space-diagonal-from-the-edge"],
      title: t("Diagonal from the edge", "由棱长求体对角线"),
      explanation: t(
        `A **diagonal** of a cube (a space diagonal) joins two opposite corners through the interior. It takes two uses of the Pythagorean theorem. First, the diagonal of the bottom face is $s\\sqrt{2}$. Then the space diagonal, that face diagonal, and the vertical edge $s$ at its end form a right triangle, with the space diagonal as hypotenuse:

$$D^2 = (s\\sqrt{2})^2 + s^2 = 2s^2 + s^2 = 3s^2, \\qquad D = s\\sqrt{3}.$$

A cube with edge $4$ cm: $D^2 = 32 + 16 = 48$, so $D = \\sqrt{48} = 4\\sqrt{3} \\approx 6.93$ cm, longer than its face diagonal $4\\sqrt{2} \\approx 5.66$ cm.

> **Watch out.** The legs of this right triangle are an edge and a face diagonal, not two edges: two edges give the face diagonal $s\\sqrt{2}$ again. And $\\sqrt{3}$ multiplies the edge, $s\\sqrt{3}$, not $3s$ or $\\sqrt{3s}$.`,
        `正方体的**体对角线**穿过内部，连接相对的两个顶点。求它要用两次勾股定理。先求底面的对角线，它是 $s\\sqrt{2}$。然后体对角线、这条面对角线和它一端竖直的棱 $s$ 组成直角三角形，体对角线是斜边：

$$D^2 = (s\\sqrt{2})^2 + s^2 = 2s^2 + s^2 = 3s^2, \\qquad D = s\\sqrt{3}.$$

棱长 $4$ 厘米的正方体：$D^2 = 32 + 16 = 48$，所以 $D = \\sqrt{48} = 4\\sqrt{3} \\approx 6.93$ 厘米，比它的面对角线 $4\\sqrt{2} \\approx 5.66$ 厘米长。

> **注意。** 这个直角三角形的直角边是一条棱和一条面对角线，不是两条棱：两条棱只会再得到面对角线 $s\\sqrt{2}$。$\\sqrt{3}$ 乘的是棱长，即 $s\\sqrt{3}$，不是 $3s$，也不是 $\\sqrt{3s}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        const approx = (s * Math.sqrt(3)).toFixed(2);
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length $D$ of a diagonal of the cube through its interior, in ${unitWord(u)}.`,
              `求这个正方体体对角线的长 $D$（单位：${u}）。`,
            ),
            answer: [s, 3],
            wrong: [`${s}\\sqrt{2}`, String(3 * s), `\\sqrt{${3 * s}}`],
            solution: t(
              `**Step 1: the face diagonal of the bottom.** Its legs are two edges:${steps(`d = \\sqrt{${s}^2 + ${s}^2} = ${s}\\sqrt{2}`)}**Step 2: the right triangle inside.** The diagonal $D$ is the hypotenuse of a right triangle with legs $d = ${s}\\sqrt{2}$ and an edge $${s}$:

{{figure 0}}${steps(`D^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${2 * s * s} + ${s * s} = ${3 * s * s}`, `D = \\sqrt{${3 * s * s}} = \\sqrt{${s * s}} \\cdot \\sqrt{3} = ${s}\\sqrt{3}`)}**Check.** $${s}\\sqrt{3} \\approx ${s} \\cdot 1.732 \\approx ${approx}$, longer than the face diagonal $${s}\\sqrt{2} \\approx ${(s * Math.SQRT2).toFixed(2)}$ but shorter than the path along three edges, $3 \\cdot ${s} = ${3 * s}$.`,
              `**第一步：底面的面对角线。** 它的两条直角边是两条棱：${steps(`d = \\sqrt{${s}^2 + ${s}^2} = ${s}\\sqrt{2}`)}**第二步：内部的直角三角形。** 体对角线 $D$ 是直角三角形的斜边，两条直角边是 $d = ${s}\\sqrt{2}$ 和一条棱 $${s}$：

{{figure 0}}${steps(`D^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${2 * s * s} + ${s * s} = ${3 * s * s}`, `D = \\sqrt{${3 * s * s}} = \\sqrt{${s * s}} \\cdot \\sqrt{3} = ${s}\\sqrt{3}`)}**检验。** $${s}\\sqrt{3} \\approx ${s} \\cdot 1.732 \\approx ${approx}$，比面对角线 $${s}\\sqrt{2} \\approx ${(s * Math.SQRT2).toFixed(2)}$ 长，又比沿三条棱走的路程 $3 \\cdot ${s} = ${3 * s}$ 短。`,
            ),
          }),
          figure: cubeFigure(len(s, u), "space", "D"),
          solutionFigures: [spaceTriangle(len(s, u), "d", "D")],
        };
      },
    },
    {
      id: "edge-from-the-space-diagonal",
      title: t("Edge from the diagonal", "由体对角线求棱长"),
      explanation: t(
        `Since $D = s\\sqrt{3}$, divide the diagonal by $\\sqrt{3}$ to get the edge, and rationalize the denominator by multiplying the top and bottom by $\\sqrt{3}$:

$$s = \\frac{D}{\\sqrt{3}} = \\frac{D\\sqrt{3}}{3}.$$

A diagonal of $5\\sqrt{3}$ cm gives an edge of $5$ cm, since the $\\sqrt{3}$ cancels. A diagonal of $12$ cm gives $s = \\frac{12}{\\sqrt{3}} = \\frac{12\\sqrt{3}}{3} = 4\\sqrt{3}$ cm. Multiply back to check: $4\\sqrt{3} \\cdot \\sqrt{3} = 4 \\cdot 3 = 12$.

> **Watch out.** Divide by $\\sqrt{3}$, not by $3$, and not by $\\sqrt{2}$, which belongs to a face diagonal. Multiplying by $\\sqrt{3}$ instead gives a length longer than the diagonal, which no edge can be. Leave no root in the denominator.`,
        `因为 $D = s\\sqrt{3}$，把体对角线除以 $\\sqrt{3}$ 就得到棱长，再把分子分母同乘 $\\sqrt{3}$，使分母有理化：

$$s = \\frac{D}{\\sqrt{3}} = \\frac{D\\sqrt{3}}{3}.$$

体对角线为 $5\\sqrt{3}$ 厘米时，$\\sqrt{3}$ 约去，棱长是 $5$ 厘米。体对角线为 $12$ 厘米时，$s = \\frac{12}{\\sqrt{3}} = \\frac{12\\sqrt{3}}{3} = 4\\sqrt{3}$ 厘米。乘回去检验：$4\\sqrt{3} \\cdot \\sqrt{3} = 4 \\cdot 3 = 12$。

> **注意。** 要除以 $\\sqrt{3}$，不是除以 $3$，也不是除以面对角线所用的 $\\sqrt{2}$。反过来乘 $\\sqrt{3}$ 会得到比体对角线还长的长度，棱不可能这么长。分母里不能留根号。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 25);
        const rational = rng.bool(0.6);
        const d = rational ? tex(k, u) : `${k}\\sqrt{3}\\text{ ${u}}`;
        const answer: [Q, number] = rational ? [Q.of(k, 3), 3] : [Q.of(k), 1];
        const rationalized = `\\frac{${k}\\sqrt{3}}{3}`;
        const simplest = radical(Q.of(k, 3), 3);
        const edge = simplest === rationalized ? rationalized : `${rationalized} = ${simplest}`;
        return {
          ...radicalProblem({
            prompt: t(
              `A diagonal through the interior of a cube is $${d}$ long. How long is each edge, in ${unitWord(u)}? Write it in simplest radical form.`,
              `一个正方体的体对角线长 $${d}$。它的棱长是多少（单位：${u}）？用最简根式表示。`,
            ),
            answer,
            wrong: rational
              ? [Q.of(k, 3).toLatex(), `${k}\\sqrt{3}`, `\\frac{${k}}{\\sqrt{3}}`, radical(Q.of(k, 2), 2)]
              : [`${k}\\sqrt{3}`, String(3 * k), Q.of(k, 3).toLatex()],
            solution: rational
              ? t(
                  `**Step 1: divide by $\\sqrt{3}$.** The diagonal is $s\\sqrt{3}$, so $s\\sqrt{3} = ${k}$ and $s = \\frac{${k}}{\\sqrt{3}}$.

{{figure 0}}

**Step 2: rationalize the denominator.** Multiply the top and bottom by $\\sqrt{3}$:${steps(`s = \\frac{${k}}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}} = ${edge}`)}**Check.** Multiply back by $\\sqrt{3}$: $\\frac{${k}\\sqrt{3}}{3} \\cdot \\sqrt{3} = \\frac{${k} \\cdot 3}{3} = ${k}$, the diagonal given.`,
                  `**第一步：除以 $\\sqrt{3}$。** 体对角线是 $s\\sqrt{3}$，所以 $s\\sqrt{3} = ${k}$，$s = \\frac{${k}}{\\sqrt{3}}$。

{{figure 0}}

**第二步：分母有理化。** 分子分母同乘 $\\sqrt{3}$：${steps(`s = \\frac{${k}}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}} = ${edge}`)}**检验。** 乘回 $\\sqrt{3}$：$\\frac{${k}\\sqrt{3}}{3} \\cdot \\sqrt{3} = \\frac{${k} \\cdot 3}{3} = ${k}$，正是给出的体对角线。`,
                )
              : t(
                  `**Step 1: the relation.** The diagonal is $s\\sqrt{3}$, so${steps(`s\\sqrt{3} = ${k}\\sqrt{3}`)}{{figure 0}}

**Step 2: divide by $\\sqrt{3}$.** The $\\sqrt{3}$ cancels on both sides:${steps(`s = ${k}`)}**Check.** A cube with edge $${k}$ has diagonal $\\sqrt{3 \\cdot ${k}^2} = \\sqrt{${3 * k * k}} = ${k}\\sqrt{3}$, as given.`,
                  `**第一步：关系式。** 体对角线是 $s\\sqrt{3}$，所以${steps(`s\\sqrt{3} = ${k}\\sqrt{3}`)}{{figure 0}}

**第二步：除以 $\\sqrt{3}$。** 两边的 $\\sqrt{3}$ 约去：${steps(`s = ${k}`)}**检验。** 棱长 $${k}$ 的正方体，体对角线是 $\\sqrt{3 \\cdot ${k}^2} = \\sqrt{${3 * k * k}} = ${k}\\sqrt{3}$，与已知相符。`,
                ),
          }),
          solutionFigures: [cubeFigure("s", "space", rational ? `${k}` : `${k}√3`)],
        };
      },
    },
    {
      id: "face-and-space-diagonals",
      title: t("Face and space diagonals", "面对角线与体对角线"),
      explanation: t(
        `A face diagonal is $s\\sqrt{2}$ and the diagonal through the interior is $s\\sqrt{3}$: both are the edge times a fixed number. So to pass from one to the other, go back to the edge first, then forward to the other diagonal.

If a face diagonal is $7\\sqrt{2}$ cm, then $s\\sqrt{2} = 7\\sqrt{2}$, the edge is $7$ cm, and the cube's diagonal is $7\\sqrt{3}$ cm. If the cube's diagonal is $2\\sqrt{3}$ cm, the edge is $2$ cm and a face diagonal is $2\\sqrt{2}$ cm. The space diagonal is always the longer one.

> **Watch out.** Change the root, not just the number in front: from a face diagonal $7\\sqrt{2}$, the space diagonal is $7\\sqrt{3}$, not $7\\sqrt{2}$ again, and not $7\\sqrt{6}$, which comes from multiplying by $\\sqrt{3}$ without first dividing by $\\sqrt{2}$.`,
        `面对角线是 $s\\sqrt{2}$，体对角线是 $s\\sqrt{3}$：两者都是棱长乘一个固定的数。所以在两者之间换算时，先退回到棱长，再求另一种对角线。

若面对角线是 $7\\sqrt{2}$ 厘米，则 $s\\sqrt{2} = 7\\sqrt{2}$，棱长是 $7$ 厘米，体对角线是 $7\\sqrt{3}$ 厘米。若体对角线是 $2\\sqrt{3}$ 厘米，则棱长是 $2$ 厘米，面对角线是 $2\\sqrt{2}$ 厘米。体对角线总是较长的那一条。

> **注意。** 要换的是根号，不只是前面的数：由面对角线 $7\\sqrt{2}$ 得到的体对角线是 $7\\sqrt{3}$，不是原样的 $7\\sqrt{2}$，也不是 $7\\sqrt{6}$；后者是没有先除以 $\\sqrt{2}$ 就直接乘了 $\\sqrt{3}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        const fromFace = rng.bool();
        const [dSq, DSq] = [2 * s * s, 3 * s * s];
        return {
          ...radicalProblem({
            prompt: fromFace
              ? t(
                  `A face diagonal of a cube is $${s}\\sqrt{2}\\text{ ${u}}$ long. How long is a diagonal through its interior, in ${unitWord(u)}?`,
                  `一个正方体的面对角线长 $${s}\\sqrt{2}\\text{ ${u}}$。它的体对角线有多长（单位：${u}）？`,
                )
              : t(
                  `A diagonal through the interior of a cube is $${s}\\sqrt{3}\\text{ ${u}}$ long. How long is a face diagonal, in ${unitWord(u)}?`,
                  `一个正方体的体对角线长 $${s}\\sqrt{3}\\text{ ${u}}$。它的面对角线有多长（单位：${u}）？`,
                ),
            answer: [s, fromFace ? 3 : 2],
            wrong: fromFace ? [`${s}\\sqrt{2}`, `${s}\\sqrt{6}`, `${s + 1}\\sqrt{2}`] : [`${s}\\sqrt{3}`, `${s}\\sqrt{6}`, String(s)],
            solution: fromFace
              ? t(
                  `**Step 1: back to the edge.** A face diagonal is $s\\sqrt{2}$:${steps(`s\\sqrt{2} = ${s}\\sqrt{2}`, `s = ${s}`)}**Step 2: forward to the diagonal.** The diagonal through the interior is $s\\sqrt{3}$:${steps(`D = ${s}\\sqrt{3}`)}{{figure 0}}

**Check.** The diagonal is the hypotenuse over the face diagonal and an edge: $D^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${dSq} + ${s * s} = ${DSq}$, and $(${s}\\sqrt{3})^2 = ${DSq}$.`,
                  `**第一步：退回到棱长。** 面对角线是 $s\\sqrt{2}$：${steps(`s\\sqrt{2} = ${s}\\sqrt{2}`, `s = ${s}`)}**第二步：求体对角线。** 体对角线是 $s\\sqrt{3}$：${steps(`D = ${s}\\sqrt{3}`)}{{figure 0}}

**检验。** 体对角线是以面对角线和一条棱为直角边的斜边：$D^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${dSq} + ${s * s} = ${DSq}$，而 $(${s}\\sqrt{3})^2 = ${DSq}$。`,
                )
              : t(
                  `**Step 1: back to the edge.** The diagonal through the interior is $s\\sqrt{3}$:${steps(`s\\sqrt{3} = ${s}\\sqrt{3}`, `s = ${s}`)}**Step 2: forward to the face diagonal.** A face diagonal is $s\\sqrt{2}$:${steps(`d = ${s}\\sqrt{2}`)}{{figure 0}}

**Check.** The diagonal is the hypotenuse over the face diagonal and an edge: $d^2 + ${s}^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${dSq} + ${s * s} = ${DSq} = (${s}\\sqrt{3})^2$. The face diagonal is the shorter one, as it should be.`,
                  `**第一步：退回到棱长。** 体对角线是 $s\\sqrt{3}$：${steps(`s\\sqrt{3} = ${s}\\sqrt{3}`, `s = ${s}`)}**第二步：求面对角线。** 面对角线是 $s\\sqrt{2}$：${steps(`d = ${s}\\sqrt{2}`)}{{figure 0}}

**检验。** 体对角线是以面对角线和一条棱为直角边的斜边：$d^2 + ${s}^2 = (${s}\\sqrt{2})^2 + ${s}^2 = ${dSq} + ${s * s} = ${DSq} = (${s}\\sqrt{3})^2$。面对角线是较短的那一条，理应如此。`,
                ),
          }),
          solutionFigures: [spaceTriangle(`${s}`, fromFace ? `${s}√2` : "d", fromFace ? "D" : `${s}√3`)],
        };
      },
    },
  ],
};

/** gridBox draws a box L long, D deep and H high cut into unit cubes, the grid showing on its three visible faces. */
function gridBox(L: number, D: number, H: number): Mark[] {
  const marks: Mark[] = [
    { kind: "polygon", points: [P3(0, 0, 0), P3(L, 0, 0), P3(L, H, 0), P3(0, H, 0)] },
    { kind: "polygon", points: [P3(0, H, 0), P3(L, H, 0), P3(L, H, D), P3(0, H, D)] },
    { kind: "polygon", points: [P3(L, 0, 0), P3(L, 0, D), P3(L, H, D), P3(L, H, 0)] },
  ];
  for (let x = 1; x < L; x++)
    marks.push({ kind: "segment", a: P3(x, 0, 0), b: P3(x, H, 0) }, { kind: "segment", a: P3(x, H, 0), b: P3(x, H, D) });
  for (let y = 1; y < H; y++)
    marks.push({ kind: "segment", a: P3(0, y, 0), b: P3(L, y, 0) }, { kind: "segment", a: P3(L, y, 0), b: P3(L, y, D) });
  for (let z = 1; z < D; z++)
    marks.push({ kind: "segment", a: P3(0, H, z), b: P3(L, H, z) }, { kind: "segment", a: P3(L, 0, z), b: P3(L, H, z) });
  return marks;
}

/** twoBoxes draws the two boxes of a composite solid side by side, each with its dimensions labeled. */
function twoBoxes(big: readonly [number, number, number], small: readonly [number, number, number], u: Unit): Mark[] {
  const [l, w, h] = big;
  const [a, b, c] = small;
  const first = boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) });
  const [L, D] = fitBox([l, w, h]) as [number, number, number];
  const second = boxMarks(a, b, c, { l: len(a, u), d: len(b, u), h: len(c, u) });
  return [...first, ...shift(second, L + 0.45 * D + Math.max(L, D) * 0.35, 0)];
}

/** holeBox draws a block l × w × h with a hole of cross-section a × b cut through it from top to bottom. */
function holeBox(l: number, w: number, h: number, a: number, b: number, u: Unit): Mark[] {
  const [L, D, H] = fitBox([l, w, h]) as [number, number, number];
  const [A, B] = [(a / l) * L, (b / w) * D];
  const [x0, z0] = [(L - A) / 2, (D - B) / 2];
  const at = (x: number, y: number, z: number) => P3(x0 + x, y, z0 + z);
  const marks = boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) });
  marks.push(
    { kind: "polygon", points: [at(0, H, 0), at(A, H, 0), at(A, H, B), at(0, H, B)], accent: true },
    { kind: "segment", a: at(0, H, 0), b: at(0, 0, 0), dashed: true },
    { kind: "segment", a: at(A, H, 0), b: at(A, 0, 0), dashed: true },
    { kind: "side", a: at(A, H, B), b: at(0, H, B), text: len(a, u) },
    { kind: "side", a: at(A, H, 0), b: at(A, H, B), text: len(b, u) },
  );
  return marks;
}

/**
 * boxNet draws the net of a box l × w × h: four side faces in a row with the top above and the bottom below the
 * first, each labeled with its area; without "top" the lid is left out, and "sides" highlights the four side faces.
 */
function boxNet(l: number, w: number, h: number, faces: "all" | "no-top" | "sides" = "all"): Mark[] {
  const [L, W, H] = fitBox([l, w, h]) as [number, number, number];
  const rect = (x: number, y: number, dx: number, dy: number, text: string, accent: boolean): Mark[] => [
    {
      kind: "polygon",
      points: [
        [x, y],
        [x + dx, y],
        [x + dx, y + dy],
        [x, y + dy],
      ],
      ...(accent && { accent: true }),
    },
    { kind: "label", at: [x + dx / 2, y + dy / 2 - 0.15 * H], text, dir: "n" },
  ];
  const sides = faces === "sides";
  const marks: Mark[] = [
    ...rect(0, 0, L, H, `${l * h}`, sides),
    ...rect(L, 0, W, H, `${w * h}`, sides),
    ...rect(L + W, 0, L, H, `${l * h}`, sides),
    ...rect(2 * L + W, 0, W, H, `${w * h}`, sides),
    ...rect(0, -W, L, W, `${l * w}`, false),
  ];
  if (faces === "all") marks.push(...rect(0, H, L, W, `${l * w}`, false));
  return marks;
}

/** rectFace draws one rectangular face a × b of a box flat, with its diagonal. */
function rectFace(a: number, b: number, aLabel: string, bLabel: string, diagonal: string): Mark[] {
  const [A, B] = fitBox([a, b]) as [number, number];
  return [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [A, 0],
        [A, B],
        [0, B],
      ],
    },
    { kind: "segment", a: [0, 0], b: [A, B], accent: true },
    { kind: "right", vertex: [A, 0], from: [0, 0], to: [A, B] },
    { kind: "side", a: [0, 0], b: [A, 0], text: aLabel },
    { kind: "side", a: [A, 0], b: [A, B], text: bLabel },
    { kind: "label", at: [A / 2, B / 2], text: diagonal, dir: "nw" },
  ];
}

/** boxTriangle draws a box with the right triangle of its diagonal: the diagonal of the bottom, the height at its far end, and the diagonal. */
function boxTriangle(l: number, w: number, h: number, labels: { l: string; d: string; h: string }, face: string, diagonal: string): Mark[] {
  const [L, D, H] = fitBox([l, w, h]) as [number, number, number];
  const marks = boxMarks(l, w, h, { l: labels.l, d: labels.d }, "space");
  const [far, top] = [P3(L, 0, D), P3(L, H, D)];
  const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  marks.push(
    { kind: "segment", a: P3(0, 0, 0), b: far, dashed: true, accent: true },
    { kind: "side", a: far, b: top, text: labels.h },
    { kind: "label", at: mid(P3(0, 0, 0), far), text: face, dir: "n" },
    { kind: "label", at: mid(P3(0, 0, 0), top), text: diagonal, dir: "nw" },
  );
  return marks;
}

export const volumesOfRectangularSolids: TopicDef = {
  id: "volumes-of-rectangular-solids",
  title: t("Volumes of Rectangular Solids", "长方体的体积"),
  summary: t(
    "Find the volume of a box, a missing dimension from the volume, and the volume of solids made of boxes.",
    "求长方体的体积，由体积求未知的棱长，并求由长方体组成的立体图形的体积。",
  ),
  prerequisites: ["volumes-of-cubes"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.5.MD.C.5"],
  intro: t(
    `A cube's volume counts the unit cubes in it layer by layer, and a box that is not a cube is counted the same way. Fill a box $5$ cm long, $3$ cm deep and $2$ cm high with centimeter cubes. The bottom layer is a $5 \\times 3$ rectangle of cubes, $15$ of them, and $2$ layers fill the box:

{{figure 0}}

So the box holds $15 \\cdot 2 = 30$ cubes, a volume of $30\\text{ cm}^3$, which is $5 \\cdot 3 \\cdot 2$: length times width times height. The first two factors make the area of the base, so the volume is also the base area times the height. In this lesson we find the volume of a box, find a missing dimension from the volume, and find the volume of solids built from boxes or cut from them.`,
    `正方体的体积是一层一层地数里面的单位正方体，不是正方体的长方体也一样数。用 $1$ 厘米的小正方体装满一个长 $5$ 厘米、宽 $3$ 厘米、高 $2$ 厘米的盒子。最底层是 $5 \\times 3$ 的长方形，共 $15$ 个，装 $2$ 层就满了：

{{figure 0}}

所以盒子里有 $15 \\cdot 2 = 30$ 个小正方体，体积是 $30\\text{ cm}^3$，也就是 $5 \\cdot 3 \\cdot 2$：长乘宽乘高。前两个因数是底面积，所以体积也等于底面积乘高。这节课我们求长方体的体积，由体积求未知的棱长，并求由长方体拼成或从长方体中挖去一部分的立体图形的体积。`,
  ),
  introFigures: [
    figure(
      gridBox(5, 3, 2),
      "A box 5 cm long, 3 cm deep and 2 cm high filled with centimeter cubes: 2 layers of 15.",
      "长 5 厘米、宽 3 厘米、高 2 厘米的盒子装满了 1 厘米的小正方体：2 层，每层 15 个。",
    ),
  ],
  knowledgePoints: [
    {
      id: "length-times-width-times-height",
      title: t("Length × width × height", "长 × 宽 × 高"),
      explanation: t(
        `A rectangular solid (box) $l$ long, $w$ wide and $h$ high has a bottom layer of $l \\times w$ unit cubes and $h$ such layers, so

$$V = lwh.$$

The area of the base is $B = lw$, so this is also $V = Bh$: base area times height. A box $6$ cm by $4$ cm by $3$ cm has a base of $6 \\cdot 4 = 24\\text{ cm}^2$, and $V = 24 \\cdot 3 = 72\\text{ cm}^3$. Any face can serve as the base: standing the box on its $4 \\times 3$ face gives $12 \\cdot 6 = 72$ too.

> **Watch out.** Multiply the three dimensions, do not add them: $6 + 4 + 3 = 13$ is not a volume. The base area alone, $lw$, leaves out the height, and $2(lw + lh + wh)$ is the surface area, in square units.`,
        `长 $l$、宽 $w$、高 $h$ 的长方体，最底层有 $l \\times w$ 个单位正方体，共 $h$ 层，所以

$$V = lwh.$$

底面积是 $B = lw$，所以也可以写成 $V = Bh$：底面积乘高。长 $6$ 厘米、宽 $4$ 厘米、高 $3$ 厘米的长方体，底面积是 $6 \\cdot 4 = 24\\text{ cm}^2$，$V = 24 \\cdot 3 = 72\\text{ cm}^3$。哪个面都可以当底面：把它立在 $4 \\times 3$ 的面上，$12 \\cdot 6 = 72$，结果一样。

> **注意。** 三条棱要相乘，不是相加：$6 + 4 + 3 = 13$ 不是体积。只算底面积 $lw$ 就漏了高；$2(lw + lh + wh)$ 是表面积，用的是面积单位。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const v = l * w * h;
        return {
          ...numberProblem({
            prompt: t("Find the volume of the box.", "求这个长方体的体积。"),
            answer: v,
            form: "integer",
            unit: `${u}^3`,
            wrong: [l + w + h, 2 * (l * w + l * h + w * h), l * w, 4 * (l + w + h)],
            solution: t(
              `**Step 1: the base.** The base is $${l}$ by $${w}$, so one layer holds${steps(`B = ${l} \\cdot ${w} = ${tex(l * w, u, 2)}`)}**Step 2: the layers.** There are $${h}$ layers, one for each unit of height:${steps(`V = Bh = ${l * w} \\cdot ${h} = ${tex(v, u, 3)}`)}**Check.** Stand the box on another face: the $${w} \\times ${h}$ face has area $${w * h}$, and the box is $${l}$ long, $${w * h} \\cdot ${l} = ${v}$. Length times length times length gives cubic units, $\\text{${u}}^3$.`,
              `**第一步：底面。** 底面是 $${l}$ 乘 $${w}$，所以一层有${steps(`B = ${l} \\cdot ${w} = ${tex(l * w, u, 2)}`)}**第二步：层数。** 高是几个单位就有几层，共 $${h}$ 层：${steps(`V = Bh = ${l * w} \\cdot ${h} = ${tex(v, u, 3)}`)}**检验。** 换一个面当底面：$${w} \\times ${h}$ 的面面积是 $${w * h}$，长是 $${l}$，$${w * h} \\cdot ${l} = ${v}$。三个长度相乘，单位是 $\\text{${u}}^3$。`,
            ),
          }),
          figure: figure(
            boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }),
            `A box ${l} ${u} long, ${w} ${u} deep and ${h} ${u} high.`,
            `一个长 ${l} ${u}、宽 ${w} ${u}、高 ${h} ${u} 的长方体。`,
          ),
        };
      },
    },
    {
      id: "missing-dimension-from-the-volume",
      title: t("A missing dimension", "求未知的棱长"),
      explanation: t(
        `Since $V = lwh$ is a product of three numbers, a missing one is found by division: divide the volume by the product of the two that are known.

A box with volume $210\\text{ cm}^3$, length $7$ cm and width $5$ cm: the unknown height $h$ satisfies $7 \\cdot 5 \\cdot h = 210$, so $35h = 210$ and $h = \\frac{210}{35} = 6$ cm. In the same way, a box with base area $B$ and volume $V$ has height $h = \\frac{V}{B}$.

> **Watch out.** Divide by the product of both known dimensions, not by just one of them: $\\frac{210}{7} = 30$ is the area of a $5 \\times 6$ face, not a length. And subtracting the known dimensions from the volume, $210 - 7 - 5$, means nothing.`,
        `$V = lwh$ 是三个数的积，所以求其中一个未知数要用除法：用体积除以已知两条棱长的积。

体积 $210\\text{ cm}^3$、长 $7$ 厘米、宽 $5$ 厘米的长方体：未知的高 $h$ 满足 $7 \\cdot 5 \\cdot h = 210$，即 $35h = 210$，$h = \\frac{210}{35} = 6$ 厘米。同样，底面积为 $B$、体积为 $V$ 的长方体，高是 $h = \\frac{V}{B}$。

> **注意。** 要除以两条已知棱长的积，不能只除以其中一条：$\\frac{210}{7} = 30$ 是 $5 \\times 6$ 那个面的面积，不是长度。用体积减去已知的棱长，比如 $210 - 7 - 5$，没有任何意义。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const v = l * w * h;
        const ask = rng.int(0, 2);
        const names = [
          ["length", "长"],
          ["width", "宽"],
          ["height", "高"],
        ] as const;
        const dims = [l, w, h];
        const known = [0, 1, 2].filter((i) => i !== ask);
        const [a, b] = known.map((i) => dims[i]!) as [number, number];
        const [ka, kb] = known.map((i) => names[i]!) as [readonly [string, string], readonly [string, string]];
        const x = dims[ask]!;
        const labels = dims.map((d, i) => (i === ask ? "?" : len(d, u))) as [string, string, string];
        return {
          ...numberProblem({
            prompt: t(
              `A box has a volume of $${tex(v, u, 3)}$, a ${ka[0]} of $${tex(a, u)}$ and a ${kb[0]} of $${tex(b, u)}$. Find its ${names[ask]![0]}.`,
              `一个长方体的体积是 $${tex(v, u, 3)}$，${ka[1]}是 $${tex(a, u)}$，${kb[1]}是 $${tex(b, u)}$。求它的${names[ask]![1]}。`,
            ),
            answer: x,
            form: "integer",
            unit: u,
            wrong: [v - a - b, Q.of(v, a), Q.of(v, b), v * a * b],
            solution: t(
              `**Step 1: the equation.** Call the unknown ${names[ask]![0]} $x$. The volume is the product of the three dimensions:${steps(`${a} \\cdot ${b} \\cdot x = ${v}`, `${a * b}x = ${v}`)}{{figure 0}}

**Step 2: divide.** Divide the volume by the product of the known dimensions:${steps(`x = \\frac{${v}}{${a * b}} = ${tex(x, u)}`)}**Check.** Multiply back: $${a} \\cdot ${b} \\cdot ${x} = ${a * b} \\cdot ${x} = ${v}$, the volume given.`,
              `**第一步：列方程。** 设未知的${names[ask]![1]}为 $x$。体积是三条棱长的积：${steps(`${a} \\cdot ${b} \\cdot x = ${v}`, `${a * b}x = ${v}`)}{{figure 0}}

**第二步：相除。** 用体积除以已知两条棱长的积：${steps(`x = \\frac{${v}}{${a * b}} = ${tex(x, u)}`)}**检验。** 乘回去：$${a} \\cdot ${b} \\cdot ${x} = ${a * b} \\cdot ${x} = ${v}$，正是给出的体积。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(l, w, h, { l: labels[0], d: labels[1], h: labels[2] }),
              `The box with its known dimensions marked and the unknown ${names[ask]![0]} marked "?".`,
              `标出已知棱长的长方体，未知的${names[ask]![1]}标为"?"。`,
            ),
          ],
        };
      },
    },
    {
      id: "solids-made-of-boxes",
      title: t("Solids made of boxes", "由长方体组成的立体图形"),
      explanation: t(
        `Volume adds: when a solid is made of two boxes that do not overlap, every unit cube of it lies in exactly one of them, so its volume is the sum of their volumes. A hole subtracts: a box with a smaller box cut out of it has the difference.

A step made of a $8 \\times 5 \\times 2$ cm block with a $4 \\times 5 \\times 3$ cm block on top has volume $80 + 60 = 140\\text{ cm}^3$. A $9 \\times 7 \\times 5$ cm block with a $3 \\times 2$ cm hole cut straight through its $5$ cm height loses $3 \\cdot 2 \\cdot 5 = 30\\text{ cm}^3$, leaving $315 - 30 = 285\\text{ cm}^3$.

> **Watch out.** A hole that goes all the way through has the full height of the block: subtract $a \\cdot b \\cdot h$, not just its cross-section $a \\cdot b$. And for two boxes, find each volume and add them; multiplying the sums of their dimensions counts a box that is not there.`,
        `体积可以相加：由两个不重叠的长方体组成的立体图形，它的每个单位正方体都恰好属于其中一个，所以体积是两者的体积之和。挖去的部分要减去：从长方体中挖去一个小长方体，体积是两者之差。

由 $8 \\times 5 \\times 2$ 厘米的木块和放在上面的 $4 \\times 5 \\times 3$ 厘米的木块组成的台阶，体积是 $80 + 60 = 140\\text{ cm}^3$。一个 $9 \\times 7 \\times 5$ 厘米的木块，沿 $5$ 厘米的高直直地挖穿一个 $3 \\times 2$ 厘米的孔，挖去 $3 \\cdot 2 \\cdot 5 = 30\\text{ cm}^3$，剩下 $315 - 30 = 285\\text{ cm}^3$。

> **注意。** 挖穿的孔和木块一样高：要减去 $a \\cdot b \\cdot h$，不只是横截面 $a \\cdot b$。两个长方体要分别求体积再相加；把棱长分别相加后再相乘，算的是一个并不存在的长方体。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(6, 15), rng.int(4, 10), rng.int(3, 10)];
        const big = l * w * h;
        if (rng.bool()) {
          const [a, b, c] = [rng.int(2, l - 1), rng.int(2, w - 1), rng.int(2, 10)];
          const small = a * b * c;
          const enclosing = l * w * (h + c);
          return {
            ...numberProblem({
              prompt: t(
                `A solid is made of a box $${l} \\times ${w} \\times ${h}$ ${u} with a smaller box $${a} \\times ${b} \\times ${c}$ ${u} placed on top of it. Find the volume of the solid.`,
                `一个立体图形由一个 $${l} \\times ${w} \\times ${h}$ ${u} 的长方体和放在它上面的一个 $${a} \\times ${b} \\times ${c}$ ${u} 的小长方体组成。求这个立体图形的体积。`,
              ),
              answer: big + small,
              form: "integer",
              unit: `${u}^3`,
              wrong: [big - small, big, (l + a) * (w + b) * (h + c)],
              solution: t(
                `**Step 1: each box.** The two boxes do not overlap, so find their volumes separately:

{{figure 0}}${steps(`${l} \\cdot ${w} \\cdot ${h} = ${big}`, `${a} \\cdot ${b} \\cdot ${c} = ${small}`)}**Step 2: add.**${steps(`V = ${big} + ${small} = ${tex(big + small, u, 3)}`)}**Check.** The solid fits inside a $${l} \\times ${w} \\times ${h + c}$ box, of volume $${enclosing}$, with room to spare beside the small box, so its volume must be more than $${big}$ and less than $${enclosing}$; $${big + small}$ is.`,
                `**第一步：分别求体积。** 两个长方体不重叠，分别求出它们的体积：

{{figure 0}}${steps(`${l} \\cdot ${w} \\cdot ${h} = ${big}`, `${a} \\cdot ${b} \\cdot ${c} = ${small}`)}**第二步：相加。**${steps(`V = ${big} + ${small} = ${tex(big + small, u, 3)}`)}**检验。** 这个立体图形能放进一个 $${l} \\times ${w} \\times ${h + c}$ 的长方体，体积 $${enclosing}$，小长方体旁边还有空余，所以它的体积应大于 $${big}$、小于 $${enclosing}$；$${big + small}$ 正是如此。`,
              ),
            }),
            solutionFigures: [
              figure(
                twoBoxes([l, w, h], [a, b, c], u),
                `The two boxes of the solid drawn apart: ${l} by ${w} by ${h} and ${a} by ${b} by ${c} ${u}.`,
                `把立体图形的两个长方体分开画：${l} × ${w} × ${h} 和 ${a} × ${b} × ${c} ${u}。`,
              ),
            ],
          };
        }
        const [a, b] = [rng.int(1, l - 2), rng.int(1, w - 2)];
        const hole = a * b * h;
        const rest = big - hole;
        return {
          ...numberProblem({
            prompt: t(
              `A block $${l} \\times ${w} \\times ${h}$ ${u} has a hole with ${article(a)} $${a} \\times ${b}$ ${u} rectangular cross-section cut straight through it, from top to bottom ($${h}$ ${u}). Find the volume of what remains.`,
              `一个 $${l} \\times ${w} \\times ${h}$ ${u} 的木块被从上到下（$${h}$ ${u}）直直地挖穿一个横截面为 $${a} \\times ${b}$ ${u} 长方形的孔。求剩下部分的体积。`,
            ),
            answer: rest,
            form: "integer",
            unit: `${u}^3`,
            wrong: [big + hole, big - a * b, big],
            solution: t(
              `**Step 1: the block and the hole.** The hole is a box too, $${a} \\times ${b}$ across and $${h}$ high, the full height of the block:

{{figure 0}}${steps(`\\text{block: } ${l} \\cdot ${w} \\cdot ${h} = ${big}`, `\\text{hole: } ${a} \\cdot ${b} \\cdot ${h} = ${hole}`)}**Step 2: subtract.**${steps(`V = ${big} - ${hole} = ${tex(rest, u, 3)}`)}**Check.** What remains is a prism: its base is the $${l} \\times ${w}$ rectangle with the $${a} \\times ${b}$ hole, of area $${l * w} - ${a * b} = ${l * w - a * b}$, and its height is $${h}$, $${l * w - a * b} \\cdot ${h} = ${rest}$.`,
              `**第一步：木块和孔。** 孔也是一个长方体，横截面 $${a} \\times ${b}$，高 $${h}$，和木块一样高：

{{figure 0}}${steps(`\\text{木块：} ${l} \\cdot ${w} \\cdot ${h} = ${big}`, `\\text{孔：} ${a} \\cdot ${b} \\cdot ${h} = ${hole}`)}**第二步：相减。**${steps(`V = ${big} - ${hole} = ${tex(rest, u, 3)}`)}**检验。** 剩下的部分是一个柱体：底面是挖去 $${a} \\times ${b}$ 孔的 $${l} \\times ${w}$ 长方形，面积 $${l * w} - ${a * b} = ${l * w - a * b}$，高 $${h}$，$${l * w - a * b} \\cdot ${h} = ${rest}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              holeBox(l, w, h, a, b, u),
              `The block ${l} by ${w} by ${h} ${u} with the ${a} by ${b} ${u} hole running from its top face to its bottom face.`,
              `${l} × ${w} × ${h} ${u} 的木块，${a} × ${b} ${u} 的孔从顶面一直通到底面。`,
            ),
          ],
        };
      },
    },
  ],
};

export const surfaceAreasOfRectangularSolids: TopicDef = {
  id: "surface-areas-of-rectangular-solids",
  title: t("Surface Areas of Rectangular Solids", "长方体的表面积"),
  summary: t(
    "Find the surface area of a box, a missing dimension from it, and the area of open boxes and lateral faces.",
    "求长方体的表面积，由表面积求未知棱长，并求无盖盒子和侧面的面积。",
  ),
  prerequisites: ["surface-areas-of-cubes", "volumes-of-rectangular-solids"],
  encompasses: [{ topic: "finding-surface-areas-using-nets", weight: 0.4 }],
  xp: 12,
  intro: t(
    `A cube's six faces are all the same square, but a box's are not. Take a box $6$ cm long, $2$ cm wide and $4$ cm high. Its top and bottom are $6 \\times 2$ rectangles, its front and back $6 \\times 4$, and its two ends $2 \\times 4$:

{{figure 0}}

The faces come in three pairs of equal rectangles, one pair for each choice of two dimensions. So the surface area is twice the sum of three different faces: $2(12 + 24 + 8) = 2 \\cdot 44 = 88\\text{ cm}^2$. In this lesson we find surface areas of boxes, find a missing dimension from the surface area, and count only the faces that are asked for, as for a box with no lid.`,
    `正方体的六个面都是同样的正方形，长方体却不是。取一个长 $6$ 厘米、宽 $2$ 厘米、高 $4$ 厘米的长方体。它的上下两面是 $6 \\times 2$ 的长方形，前后两面是 $6 \\times 4$，左右两端是 $2 \\times 4$：

{{figure 0}}

六个面分成三对相等的长方形，每对对应两条棱的一种组合。所以表面积是三个不同的面之和的两倍：$2(12 + 24 + 8) = 2 \\cdot 44 = 88\\text{ cm}^2$。这节课我们求长方体的表面积，由表面积求未知棱长，并且只计算题目要求的面，比如无盖的盒子。`,
  ),
  introFigures: [
    figure(
      boxMarks(6, 2, 4, { l: "6 cm", d: "2 cm", h: "4 cm" }),
      "A box 6 cm long, 2 cm deep and 4 cm high.",
      "一个长 6 厘米、宽 2 厘米、高 4 厘米的长方体。",
    ),
  ],
  knowledgePoints: [
    {
      id: "surface-area-of-a-box",
      title: t("Surface area of a box", "长方体的表面积"),
      explanation: t(
        `A box $l$ long, $w$ wide and $h$ high has three pairs of congruent faces: top and bottom ($lw$ each), front and back ($lh$), and the two ends ($wh$). Add one face of each pair and double:

$$S = 2(lw + lh + wh).$$

A box $8$ cm by $5$ cm by $3$ cm has faces of $8 \\cdot 5 = 40$, $8 \\cdot 3 = 24$ and $5 \\cdot 3 = 15\\text{ cm}^2$, so $S = 2(40 + 24 + 15) = 2 \\cdot 79 = 158\\text{ cm}^2$.

> **Watch out.** Double the sum: $lw + lh + wh$ counts only three of the six faces. The faces are not all equal, so $6lw$ is wrong, and $lwh$ is the volume, in cubic units.`,
        `长 $l$、宽 $w$、高 $h$ 的长方体有三对全等的面：上下两面（各 $lw$）、前后两面（$lh$）和左右两端（$wh$）。每对取一个面相加，再乘 $2$：

$$S = 2(lw + lh + wh).$$

长 $8$ 厘米、宽 $5$ 厘米、高 $3$ 厘米的长方体，三种面分别是 $8 \\cdot 5 = 40$、$8 \\cdot 3 = 24$ 和 $5 \\cdot 3 = 15\\text{ cm}^2$，所以 $S = 2(40 + 24 + 15) = 2 \\cdot 79 = 158\\text{ cm}^2$。

> **注意。** 和要乘 $2$：$lw + lh + wh$ 只算了六个面中的三个。各个面并不都相等，所以 $6lw$ 是错的；$lwh$ 是体积，用的是体积单位。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const s = 2 * (l * w + l * h + w * h);
        const lateral = 2 * h * (l + w);
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the box.", "求这个长方体的表面积。"),
            answer: s,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s / 2, l * w * h, 6 * l * w, 2 * (l + w + h)],
            solution: t(
              `**Step 1: the three kinds of face.** Top and bottom are $${l} \\cdot ${w} = ${l * w}$, front and back $${l} \\cdot ${h} = ${l * h}$, and the two ends $${w} \\cdot ${h} = ${w * h}$:

{{figure 0}}

**Step 2: add and double.** Each face has an equal partner opposite it:${steps(`S = 2(${l * w} + ${l * h} + ${w * h}) = 2 \\cdot ${l * w + l * h + w * h} = ${tex(s, u, 2)}`)}**Check.** Count another way: the four sides wrap around the base, a strip $2(${l} + ${w}) = ${2 * (l + w)}$ long and $${h}$ high, of area $${lateral}$; with the top and bottom, $${lateral} + 2 \\cdot ${l * w} = ${s}$.`,
              `**第一步：三种面。** 上下两面是 $${l} \\cdot ${w} = ${l * w}$，前后两面是 $${l} \\cdot ${h} = ${l * h}$，左右两端是 $${w} \\cdot ${h} = ${w * h}$：

{{figure 0}}

**第二步：相加再乘 2。** 每个面都有一个相对的面和它相等：${steps(`S = 2(${l * w} + ${l * h} + ${w * h}) = 2 \\cdot ${l * w + l * h + w * h} = ${tex(s, u, 2)}`)}**检验。** 换一种算法：四个侧面围成一条长 $2(${l} + ${w}) = ${2 * (l + w)}$、高 $${h}$ 的带子，面积 $${lateral}$；加上上下两面，$${lateral} + 2 \\cdot ${l * w} = ${s}$。`,
            ),
          }),
          figure: figure(
            boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }),
            `A box ${l} ${u} long, ${w} ${u} deep and ${h} ${u} high.`,
            `一个长 ${l} ${u}、宽 ${w} ${u}、高 ${h} ${u} 的长方体。`,
          ),
          solutionFigures: [
            figure(
              boxNet(l, w, h),
              `The net of the box, each face labeled with its area: two of ${l * w}, two of ${l * h} and two of ${w * h}.`,
              `长方体的展开图，每个面标出面积：两个 ${l * w}、两个 ${l * h}、两个 ${w * h}。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-dimension-from-the-surface-area",
      title: t("A missing dimension", "由表面积求未知棱长"),
      explanation: t(
        `When the surface area and two dimensions are known, substitute them into $S = 2(lw + lh + wh)$. The unknown appears only to the first power, so this is a linear equation: halve both sides, subtract the known face, and divide.

A box with $S = 82\\text{ cm}^2$, $l = 5$ cm and $w = 1$ cm: $82 = 2(5 + 5h + 1h)$, so $41 = 5 + 6h$, $6h = 36$ and $h = 6$ cm. Check: $2(5 + 30 + 6) = 82$.

> **Watch out.** Halve the surface area before anything else: skipping it, $\\frac{82 - 10}{6} = 12$, gives twice the height. Then divide by $l + w$, the coefficient of $h$, not by $lw$. And $S \\div lw$ is not the height at all: that shortcut works for volume, not for area.`,
        `已知表面积和两条棱长时，把它们代入 $S = 2(lw + lh + wh)$。未知数只以一次方出现，所以这是一元一次方程：两边除以 $2$，减去已知的面，再相除。

$S = 82\\text{ cm}^2$、$l = 5$ 厘米、$w = 1$ 厘米的长方体：$82 = 2(5 + 5h + 1h)$，所以 $41 = 5 + 6h$，$6h = 36$，$h = 6$ 厘米。检验：$2(5 + 30 + 6) = 82$。

> **注意。** 先把表面积除以 $2$：漏掉这一步，$\\frac{82 - 10}{6} = 12$，得到的是高的两倍。然后除以 $h$ 的系数 $l + w$，不是除以 $lw$。$S \\div lw$ 根本不是高：这个捷径适用于体积，不适用于面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const s = 2 * (l * w + l * h + w * h);
        return {
          ...numberProblem({
            prompt: t(
              `A box has a surface area of $${tex(s, u, 2)}$, a length of $${tex(l, u)}$ and a width of $${tex(w, u)}$. Find its height.`,
              `一个长方体的表面积是 $${tex(s, u, 2)}$，长是 $${tex(l, u)}$，宽是 $${tex(w, u)}$。求它的高。`,
            ),
            answer: h,
            form: "integer",
            unit: u,
            wrong: [Q.of(s, l * w), Q.of(s - 2 * l * w, l + w), Q.of(s / 2 - l * w, l * w)],
            solution: t(
              `**Step 1: the equation.** Substitute $l = ${l}$ and $w = ${w}$ into $S = 2(lw + lh + wh)$:${steps(`${s} = 2(${l * w} + ${l}h + ${w}h)`)}{{figure 0}}

**Step 2: solve for $h$.** Halve both sides, collect the $h$ terms, and subtract the known face:${steps(`${s / 2} = ${l * w} + ${l + w}h`, `${l + w}h = ${s / 2 - l * w}`, `h = ${tex(h, u)}`)}**Check.** Substitute back: $2(${l} \\cdot ${w} + ${l} \\cdot ${h} + ${w} \\cdot ${h}) = 2(${l * w} + ${l * h} + ${w * h}) = ${s}$, the surface area given.`,
              `**第一步：列方程。** 把 $l = ${l}$、$w = ${w}$ 代入 $S = 2(lw + lh + wh)$：${steps(`${s} = 2(${l * w} + ${l}h + ${w}h)`)}{{figure 0}}

**第二步：解出 $h$。** 两边除以 $2$，合并含 $h$ 的项，再减去已知的面：${steps(`${s / 2} = ${l * w} + ${l + w}h`, `${l + w}h = ${s / 2 - l * w}`, `h = ${tex(h, u)}`)}**检验。** 代回去：$2(${l} \\cdot ${w} + ${l} \\cdot ${h} + ${w} \\cdot ${h}) = 2(${l * w} + ${l * h} + ${w * h}) = ${s}$，正是给出的表面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: "h" }),
              `The box ${l} ${u} long and ${w} ${u} deep, with its unknown height h.`,
              `长 ${l} ${u}、宽 ${w} ${u} 的长方体，高 h 未知。`,
            ),
          ],
        };
      },
    },
    {
      id: "open-boxes-and-lateral-area",
      title: t("Open boxes and lateral area", "无盖盒子与侧面积"),
      explanation: t(
        `Read carefully which faces count. The **lateral area** is the area of the sides only, without the top and bottom. Unrolled, the four sides make one long rectangle whose length is the perimeter of the base and whose height is the box's height: $2lh + 2wh = 2(l + w)h$. A box without a lid has the bottom but no top: $lw + 2(l + w)h$.

For a box $7 \\times 4 \\times 5$ cm, the perimeter of the base is $2(7 + 4) = 22$ cm, so the lateral area is $22 \\cdot 5 = 110\\text{ cm}^2$. Without a lid, add the bottom: $110 + 28 = 138\\text{ cm}^2$.

> **Watch out.** An open box has one face of $lw$, not two: only the lid is missing. The lateral area has none of them. And the perimeter of the base is $2(l + w)$: $(l + w)h$ counts only two of the four sides.`,
        `要看清楚计算哪些面。**侧面积**只包括侧面，不包括上下两个面。把四个侧面展开，就是一个长方形，长是底面周长，高是长方体的高：$2lh + 2wh = 2(l + w)h$。无盖的盒子有底面而没有顶面：$lw + 2(l + w)h$。

对于 $7 \\times 4 \\times 5$ 厘米的长方体，底面周长是 $2(7 + 4) = 22$ 厘米，所以侧面积是 $22 \\cdot 5 = 110\\text{ cm}^2$。无盖时再加上底面：$110 + 28 = 138\\text{ cm}^2$。

> **注意。** 无盖盒子只有一个 $lw$ 的面，不是两个：只少了盖子。侧面积则一个也没有。底面周长是 $2(l + w)$：$(l + w)h$ 只算了四个侧面中的两个。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(3, 15), rng.int(2, 12), rng.int(2, 12)];
        const lateral = 2 * h * (l + w);
        const open = rng.bool();
        const answer = open ? lateral + l * w : lateral;
        const full = lateral + 2 * l * w;
        return {
          ...numberProblem({
            prompt: open
              ? t(
                  `An open box (with no lid) is $${tex(l, u)}$ long, $${tex(w, u)}$ wide and $${tex(h, u)}$ high. How much material is needed to make it, in square ${unitWord(u)}?`,
                  `一个无盖的盒子长 $${tex(l, u)}$、宽 $${tex(w, u)}$、高 $${tex(h, u)}$。做这个盒子需要多少材料（单位：平方 ${u}）？`,
                )
              : t(
                  `Find the lateral area of a box $${tex(l, u)}$ long, $${tex(w, u)}$ wide and $${tex(h, u)}$ high.`,
                  `求长 $${tex(l, u)}$、宽 $${tex(w, u)}$、高 $${tex(h, u)}$ 的长方体的侧面积。`,
                ),
            answer,
            form: "integer",
            unit: `${u}^2`,
            wrong: [lateral + 2 * l * w, open ? lateral : lateral + l * w, h * (l + w), l * w * h],
            solution: open
              ? t(
                  `**Step 1: which faces.** The box has a bottom and four sides, but no top:

{{figure 0}}

**Step 2: add them.** The four sides unroll into a rectangle $2(${l} + ${w}) = ${2 * (l + w)}$ long and $${h}$ high, and the bottom is $${l} \\cdot ${w}$:${steps(`${l} \\cdot ${w} + 2(${l} + ${w}) \\cdot ${h} = ${l * w} + ${lateral} = ${tex(answer, u, 2)}`)}**Check.** Start from the closed box, $2(${l * w} + ${l * h} + ${w * h}) = ${full}$, and take away the lid: $${full} - ${l * w} = ${answer}$.`,
                  `**第一步：有哪些面。** 盒子有底面和四个侧面，没有顶面：

{{figure 0}}

**第二步：相加。** 四个侧面展开成长 $2(${l} + ${w}) = ${2 * (l + w)}$、高 $${h}$ 的长方形，底面是 $${l} \\cdot ${w}$：${steps(`${l} \\cdot ${w} + 2(${l} + ${w}) \\cdot ${h} = ${l * w} + ${lateral} = ${tex(answer, u, 2)}`)}**检验。** 从有盖的盒子算起，$2(${l * w} + ${l * h} + ${w * h}) = ${full}$，去掉盖子：$${full} - ${l * w} = ${answer}$。`,
                )
              : t(
                  `**Step 1: which faces.** The lateral area is the four sides only, without the top and bottom:

{{figure 0}}

**Step 2: perimeter times height.** Unrolled, the sides make a rectangle as long as the perimeter of the base, $2(${l} + ${w}) = ${2 * (l + w)}$, and $${h}$ high:${steps(`${2 * (l + w)} \\cdot ${h} = ${tex(lateral, u, 2)}`)}**Check.** Add the four sides one by one: $${l * h} + ${w * h} + ${l * h} + ${w * h} = ${lateral}$.`,
                  `**第一步：有哪些面。** 侧面积只包括四个侧面，不包括上下两面：

{{figure 0}}

**第二步：周长乘高。** 把侧面展开，得到一个长方形，长等于底面周长 $2(${l} + ${w}) = ${2 * (l + w)}$，高是 $${h}$：${steps(`${2 * (l + w)} \\cdot ${h} = ${tex(lateral, u, 2)}`)}**检验。** 把四个侧面逐个相加：$${l * h} + ${w * h} + ${l * h} + ${w * h} = ${lateral}$。`,
                ),
          }),
          solutionFigures: [
            open
              ? figure(
                  boxNet(l, w, h, "no-top"),
                  `The net of the open box: the bottom, of area ${l * w}, and four sides, with no lid.`,
                  `无盖盒子的展开图：面积为 ${l * w} 的底面和四个侧面，没有盖子。`,
                )
              : figure(
                  boxNet(l, w, h, "sides"),
                  `The net of the box with its four side faces highlighted: ${l * h}, ${w * h}, ${l * h} and ${w * h}.`,
                  `长方体的展开图，突出显示四个侧面：${l * h}、${w * h}、${l * h} 和 ${w * h}。`,
                ),
          ],
        };
      },
    },
  ],
};

export const diagonalsOfRectangularSolids: TopicDef = {
  id: "diagonals-of-rectangular-solids",
  title: t("Diagonals of Rectangular Solids", "长方体的对角线"),
  summary: t(
    "Find the diagonals of the faces and the interior of a box, √(l² + w² + h²), and a missing dimension.",
    "求长方体的面对角线和体对角线 √(l² + w² + h²)，以及未知的棱长。",
  ),
  prerequisites: ["diagonals-of-cubes", "volumes-of-rectangular-solids"],
  encompasses: [{ topic: "the-pythagorean-theorem", weight: 0.5 }],
  xp: 14,
  intro: t(
    `Will an umbrella $70$ cm long fit inside a suitcase $60$ cm long, $20$ cm wide and $30$ cm high? It is longer than every edge, but it does not have to lie along an edge. The longest straight line inside the case runs from a bottom corner to the opposite top corner, and two right triangles give its length, just as for a cube.

{{figure 0}}

Along the bottom, the diagonal is $\\sqrt{60^2 + 20^2} = \\sqrt{4000}$. Rising from its far end is the height, $30$, at right angles, so the diagonal through the case is $\\sqrt{4000 + 30^2} = \\sqrt{4900} = 70$ cm. The umbrella just fits. In this lesson we find the diagonals of a box's faces and the diagonal through its interior, and work back to a missing dimension.`,
    `一把长 $70$ 厘米的伞能放进长 $60$ 厘米、宽 $20$ 厘米、高 $30$ 厘米的箱子吗？伞比每条棱都长，但它不必沿着棱放。箱子里最长的线段从底面的一个角连到相对的顶面的角，和正方体一样，用两个直角三角形就能求出它的长。

{{figure 0}}

沿着底面，对角线是 $\\sqrt{60^2 + 20^2} = \\sqrt{4000}$。它的远端竖直立着高 $30$，与它成直角，所以穿过箱子的对角线是 $\\sqrt{4000 + 30^2} = \\sqrt{4900} = 70$ 厘米。伞正好放得下。这节课我们求长方体各个面的对角线和穿过内部的体对角线，并由它们反求未知的棱长。`,
  ),
  introFigures: [
    figure(
      boxTriangle(60, 20, 30, { l: "60 cm", d: "20 cm", h: "30 cm" }, "√4000", "D"),
      "A suitcase 60 cm long, 20 cm deep and 30 cm high, with the diagonal of its bottom and the diagonal through its interior.",
      "长 60 厘米、宽 20 厘米、高 30 厘米的箱子，画出了底面的对角线和穿过内部的体对角线。",
    ),
  ],
  knowledgePoints: [
    {
      id: "face-diagonals-of-a-box",
      figure: solidDrawings["face-diagonals-of-a-box"],
      title: t("Face diagonals of a box", "长方体的面对角线"),
      explanation: t(
        `Each face of a box is a rectangle, and its diagonal is the hypotenuse of a right triangle whose legs are the two edges of that face. A box has three kinds of face, so it has three lengths of face diagonal: $\\sqrt{l^2 + w^2}$ on the top and bottom, $\\sqrt{l^2 + h^2}$ on the front and back, and $\\sqrt{w^2 + h^2}$ on the ends.

The front face of a box $6$ cm long and $4$ cm high is $6$ by $4$, so its diagonal is $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ cm.

> **Watch out.** Use only the two edges of the face that is asked for: the third dimension belongs to the diagonal through the interior. Square the edges before adding: the diagonal is not $a + b$, and not $\\sqrt{a + b}$.`,
        `长方体的每个面都是长方形，面的对角线是直角三角形的斜边，两条直角边就是这个面的两条棱。长方体有三种面，所以面对角线有三种长度：上下两面是 $\\sqrt{l^2 + w^2}$，前后两面是 $\\sqrt{l^2 + h^2}$，左右两端是 $\\sqrt{w^2 + h^2}$。

长 $6$ 厘米、高 $4$ 厘米的长方体，正面是 $6 \\times 4$ 的长方形，所以它的对角线是 $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ 厘米。

> **注意。** 只用所求那个面的两条棱：第三条棱属于穿过内部的体对角线。先平方再相加：对角线不是 $a + b$，也不是 $\\sqrt{a + b}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const face = rng.int(0, 2);
        const [a, b] = (
          [
            [l, w],
            [l, h],
            [w, h],
          ] as const
        )[face]!;
        const which = [t("bottom face", "底面"), t("front face", "正面"), t("side face (an end)", "侧面（左右两端的面）")][face]!;
        const edges = [t("length and width", "长和宽"), t("length and height", "长和高"), t("width and height", "宽和高")][face]!;
        const n = a * a + b * b;
        const approx = Math.sqrt(n).toFixed(2);
        return {
          ...rootProblem({
            prompt: t(
              `A box is $${tex(l, u)}$ long, $${tex(w, u)}$ wide and $${tex(h, u)}$ high. How long is a diagonal of its ${which.en}, in ${unitWord(u)}? Write it in simplest radical form.`,
              `一个长方体长 $${tex(l, u)}$、宽 $${tex(w, u)}$、高 $${tex(h, u)}$。它的${which["zh-CN"]}的对角线有多长（单位：${u}）？用最简根式表示。`,
            ),
            n,
            wrong: [String(a + b), `\\sqrt{${l * l + w * w + h * h}}`, `\\sqrt{${a + b}}`],
            solution: t(
              `**Step 1: the face.** The ${which.en} is bounded by the ${edges.en} of the box, so it is a $${a}$ by $${b}$ rectangle:

{{figure 0}}

**Step 2: the Pythagorean theorem.** The diagonal is the hypotenuse with legs $${a}$ and $${b}$:${steps(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = ${rootSteps(n)}`)}**Check.** $\\sqrt{${n}} \\approx ${approx}$: longer than the longer edge, $${Math.max(a, b)}$, and shorter than the way along both edges, $${a} + ${b} = ${a + b}$.`,
              `**第一步：这个面。** ${which["zh-CN"]}由长方体的${edges["zh-CN"]}围成，所以它是 $${a} \\times ${b}$ 的长方形：

{{figure 0}}

**第二步：勾股定理。** 对角线是直角边为 $${a}$ 和 $${b}$ 的斜边：${steps(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = ${rootSteps(n)}`)}**检验。** $\\sqrt{${n}} \\approx ${approx}$：比较长的那条棱 $${Math.max(a, b)}$ 长，又比沿两条棱走的 $${a} + ${b} = ${a + b}$ 短。`,
            ),
          }),
          solutionFigures: [
            figure(
              rectFace(a, b, len(a, u), len(b, u), "d"),
              `The ${which.en} of the box: a ${a} by ${b} rectangle with its diagonal d.`,
              `长方体的${which["zh-CN"]}：${a} × ${b} 的长方形和它的对角线 d。`,
            ),
          ],
        };
      },
    },
    {
      id: "diagonal-of-a-box",
      figure: solidDrawings["diagonal-of-a-box"],
      title: t("The diagonal of a box", "长方体的体对角线"),
      explanation: t(
        `The diagonal of a box through its interior takes the Pythagorean theorem twice. The diagonal of the bottom face has $d^2 = l^2 + w^2$. The height stands at right angles to the bottom at the far end of that diagonal, so the space diagonal is the hypotenuse of a second right triangle, with legs $d$ and $h$:

$$D^2 = d^2 + h^2 = l^2 + w^2 + h^2, \\qquad D = \\sqrt{l^2 + w^2 + h^2}.$$

A box $3 \\times 4 \\times 12$ cm: $d^2 = 9 + 16 = 25$, and $D^2 = 25 + 144 = 169$, so $D = 13$ cm. For a cube, $l = w = h = s$ gives $D = \\sqrt{3s^2} = s\\sqrt{3}$ again.

> **Watch out.** All three dimensions go in: $\\sqrt{l^2 + w^2}$ is only the diagonal of the bottom. And as with every hypotenuse, square first: $D$ is not $l + w + h$, nor $\\sqrt{l + w + h}$.`,
        `长方体穿过内部的体对角线要用两次勾股定理。底面的对角线满足 $d^2 = l^2 + w^2$。高在这条对角线的远端垂直于底面，所以体对角线是第二个直角三角形的斜边，两条直角边是 $d$ 和 $h$：

$$D^2 = d^2 + h^2 = l^2 + w^2 + h^2, \\qquad D = \\sqrt{l^2 + w^2 + h^2}.$$

$3 \\times 4 \\times 12$ 厘米的长方体：$d^2 = 9 + 16 = 25$，$D^2 = 25 + 144 = 169$，所以 $D = 13$ 厘米。对于正方体，$l = w = h = s$，又得到 $D = \\sqrt{3s^2} = s\\sqrt{3}$。

> **注意。** 三条棱都要用上：$\\sqrt{l^2 + w^2}$ 只是底面的对角线。和所有斜边一样，要先平方：$D$ 不是 $l + w + h$，也不是 $\\sqrt{l + w + h}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const base = l * l + w * w;
        const n = base + h * h;
        const approx = Math.sqrt(n).toFixed(2);
        return {
          ...rootProblem({
            prompt: t(
              `Find the length $D$ of the diagonal of the box, in ${unitWord(u)}. Write it in simplest radical form.`,
              `求这个长方体体对角线的长 $D$（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(l + w + h), `\\sqrt{${l * l + w * w}}`, `\\sqrt{${l + w + h}}`],
            solution: t(
              `**Step 1: the diagonal of the bottom.** The bottom is $${l}$ by $${w}$:${steps(`d^2 = ${l}^2 + ${w}^2 = ${l * l} + ${w * w} = ${base}`)}**Step 2: the right triangle inside.** $D$ is the hypotenuse with legs $d$ and the height $${h}$:

{{figure 0}}${steps(`D^2 = d^2 + ${h}^2 = ${base} + ${h * h} = ${n}`, `D = ${rootSteps(n)}`)}**Check.** $\\sqrt{${n}} \\approx ${approx}$: longer than the longest edge, $${Math.max(l, w, h)}$, and shorter than the path along three edges, $${l} + ${w} + ${h} = ${l + w + h}$.`,
              `**第一步：底面的对角线。** 底面是 $${l} \\times ${w}$：${steps(`d^2 = ${l}^2 + ${w}^2 = ${l * l} + ${w * w} = ${base}`)}**第二步：内部的直角三角形。** $D$ 是斜边，两条直角边是 $d$ 和高 $${h}$：

{{figure 0}}${steps(`D^2 = d^2 + ${h}^2 = ${base} + ${h * h} = ${n}`, `D = ${rootSteps(n)}`)}**检验。** $\\sqrt{${n}} \\approx ${approx}$：比最长的棱 $${Math.max(l, w, h)}$ 长，又比沿三条棱走的路程 $${l} + ${w} + ${h} = ${l + w + h}$ 短。`,
            ),
          }),
          figure: figure(
            boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }, "space"),
            `A box ${l} ${u} long, ${w} ${u} deep and ${h} ${u} high, with a diagonal through its interior.`,
            `一个长 ${l} ${u}、宽 ${w} ${u}、高 ${h} ${u} 的长方体，画出了一条体对角线。`,
          ),
          solutionFigures: [
            figure(
              boxTriangle(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }, "d", "D"),
              `The box with the diagonal d of its bottom and the height ${h} ${u} as the legs of a right triangle whose hypotenuse is D.`,
              `长方体中，底面对角线 d 和高 ${h} ${u} 是直角三角形的两条直角边，斜边是 D。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-dimension-from-the-diagonal",
      title: t("A missing dimension", "由对角线求未知棱长"),
      explanation: t(
        `The formula $D^2 = l^2 + w^2 + h^2$ links four lengths, so any one of them follows from the other three. Square the diagonal, subtract the squares of the two known dimensions, and take the square root:

$$h = \\sqrt{D^2 - l^2 - w^2}.$$

A box with diagonal $11$ cm, length $6$ cm and width $2$ cm: $h^2 = 121 - 36 - 4 = 81$, so $h = 9$ cm. Check: $36 + 4 + 81 = 121 = 11^2$.

> **Watch out.** Subtract the squares from $D^2$, do not add them: the diagonal is the longest length, so its square is the largest. And square the known dimensions too: $D^2 - l - w$ mixes lengths with areas.`,
        `公式 $D^2 = l^2 + w^2 + h^2$ 把四个长度联系在一起，所以知道其中三个就能求出第四个。把体对角线平方，减去两条已知棱长的平方，再开平方：

$$h = \\sqrt{D^2 - l^2 - w^2}.$$

体对角线 $11$ 厘米、长 $6$ 厘米、宽 $2$ 厘米的长方体：$h^2 = 121 - 36 - 4 = 81$，所以 $h = 9$ 厘米。检验：$36 + 4 + 81 = 121 = 11^2$。

> **注意。** 要从 $D^2$ 中减去平方，不是加上：体对角线是最长的，它的平方也最大。已知的棱长也要平方：$D^2 - l - w$ 把长度和面积混在了一起。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w] = [rng.int(2, 12), rng.int(2, 10)];
        const h2 = rng.bool() ? rng.int(2, 12) ** 2 : rng.int(5, 80);
        const d2 = l * l + w * w + h2;
        const [dk, dm] = simplifyRadical(d2);
        const dTex = dm === 1 ? `${dk}` : `\\sqrt{${d2}}`;
        const square = dm === 1 ? `${dk}^2 = ${d2}` : `(\\sqrt{${d2}})^2 = ${d2}`;
        const [hk, hm] = simplifyRadical(h2);
        const hTex = hm === 1 ? `${hk}` : radical(hk, hm);
        return {
          ...rootProblem({
            prompt: t(
              `A box has a diagonal of $${dTex}\\text{ ${u}}$, a length of $${tex(l, u)}$ and a width of $${tex(w, u)}$. How high is it, in ${unitWord(u)}? Write it in simplest radical form.`,
              `一个长方体的体对角线是 $${dTex}\\text{ ${u}}$，长是 $${tex(l, u)}$，宽是 $${tex(w, u)}$。它的高是多少（单位：${u}）？用最简根式表示。`,
            ),
            n: h2,
            wrong: [`\\sqrt{${d2 + l * l + w * w}}`, `\\sqrt{${Math.abs(d2 - l - w)}}`],
            solution: t(
              `**Step 1: the equation.** The diagonal satisfies $D^2 = l^2 + w^2 + h^2$, and $D^2 = ${square}$:${steps(`${d2} = ${l}^2 + ${w}^2 + h^2 = ${l * l} + ${w * w} + h^2`)}{{figure 0}}

**Step 2: solve for $h$.** Subtract the known squares and take the square root:${steps(`h^2 = ${d2} - ${l * l} - ${w * w} = ${h2}`, `h = ${rootSteps(h2)}`)}**Check.** Put the height back: $${l * l} + ${w * w} + ${h2} = ${d2} = D^2$. And $h = ${hTex}$ is shorter than the diagonal, as every edge must be.`,
              `**第一步：列方程。** 体对角线满足 $D^2 = l^2 + w^2 + h^2$，而 $D^2 = ${square}$：${steps(`${d2} = ${l}^2 + ${w}^2 + h^2 = ${l * l} + ${w * w} + h^2`)}{{figure 0}}

**第二步：解出 $h$。** 减去已知的平方，再开平方：${steps(`h^2 = ${d2} - ${l * l} - ${w * w} = ${h2}`, `h = ${rootSteps(h2)}`)}**检验。** 把高代回去：$${l * l} + ${w * w} + ${h2} = ${d2} = D^2$。而且 $h = ${hTex}$ 比体对角线短，每条棱都应如此。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(l, w, Math.sqrt(h2), { l: len(l, u), d: len(w, u), h: "h" }, "space"),
              `The box ${l} ${u} long and ${w} ${u} deep, with its unknown height h and its diagonal of ${dm === 1 ? dk : `√${d2}`} ${u}.`,
              `长 ${l} ${u}、宽 ${w} ${u} 的长方体，高 h 未知，体对角线长 ${dm === 1 ? dk : `√${d2}`} ${u}。`,
            ),
          ],
        };
      },
    },
  ],
};

export const theDistanceFormulaInThreeDimensions: TopicDef = {
  id: "the-distance-formula-in-three-dimensions",
  title: t("The Distance Formula in Three Dimensions", "空间中的距离公式"),
  summary: t(
    "Find the distance between points (x, y, z) in space, and a missing coordinate from a distance.",
    "求空间中点 (x, y, z) 之间的距离，并由距离求未知坐标。",
  ),
  prerequisites: ["diagonals-of-rectangular-solids", "the-distance-formula"],
  encompasses: [
    { topic: "the-distance-formula", weight: 0.5 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 14,
  intro: t(
    `In the plane, a point needs two coordinates. In space it needs three: put the origin in a corner of a room, measure $x$ along one wall, $y$ along the other, and $z$ straight up. A lamp $4$ m along the first wall, $3$ m along the second and $12$ m up is the point $(4, 3, 12)$.

How far is the lamp from the corner? The lamp and the corner are opposite corners of a box $4$ by $3$ by $12$:

{{figure 0}}

So the distance is the diagonal of that box: $\\sqrt{4^2 + 3^2 + 12^2} = \\sqrt{16 + 9 + 144} = \\sqrt{169} = 13$ m. That is the distance formula of the plane with a third square added under the root. In this lesson we find distances from the origin and between two points in space, and find a missing coordinate from a distance.`,
    `在平面上，一个点需要两个坐标；在空间中则需要三个：把原点放在房间的一个墙角，沿一面墙量 $x$，沿另一面墙量 $y$，竖直向上量 $z$。沿第一面墙 $4$ 米、沿第二面墙 $3$ 米、高 $12$ 米处的灯就是点 $(4, 3, 12)$。

灯离墙角有多远？灯和墙角是一个 $4 \\times 3 \\times 12$ 的长方体相对的两个顶点：

{{figure 0}}

所以距离就是这个长方体的体对角线：$\\sqrt{4^2 + 3^2 + 12^2} = \\sqrt{16 + 9 + 144} = \\sqrt{169} = 13$ 米。这就是平面上的距离公式在根号下多加了一个平方。这节课我们求空间中的点到原点的距离、两点之间的距离，并由距离求未知坐标。`,
  ),
  introFigures: [
    figure(
      boxMarks(4, 3, 12, { l: "4", d: "3", h: "12" }, "space"),
      "A box 4 by 3 by 12 with the origin at one corner and the point (4, 3, 12) at the opposite corner, joined by the diagonal.",
      "一个 4 × 3 × 12 的长方体，原点在一个顶点，点 (4, 3, 12) 在相对的顶点，两者由体对角线相连。",
    ),
  ],
  knowledgePoints: [
    {
      id: "distance-from-the-origin",
      figure: geometryDrawings2["the-distance-formula-in-three-dimensions#distance-from-the-origin"],
      title: t("Distance from the origin", "到原点的距离"),
      explanation: t(
        `In space, a point has three coordinates $(x, y, z)$ on three perpendicular axes. The point $(x, y, z)$ and the origin are opposite corners of a box with edges $|x|$, $|y|$ and $|z|$, so the distance between them is the diagonal of that box:

$$d = \\sqrt{x^2 + y^2 + z^2}.$$

The point $(2, -3, 6)$ is the corner of a $2 \\times 3 \\times 6$ box, so it is $\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$ units from the origin. A negative coordinate does no harm: its square is positive, $(-3)^2 = 9$.

> **Watch out.** Square each coordinate before adding: $2 + (-3) + 6 = 5$ and $2 + 3 + 6 = 11$ are not distances. And use all three: $\\sqrt{x^2 + y^2}$ is only the distance in the floor, below the point.`,
        `在空间中，点有三个坐标 $(x, y, z)$，对应三条互相垂直的坐标轴。点 $(x, y, z)$ 和原点是一个棱长为 $|x|$、$|y|$、$|z|$ 的长方体相对的两个顶点，所以它们之间的距离就是这个长方体的体对角线：

$$d = \\sqrt{x^2 + y^2 + z^2}.$$

点 $(2, -3, 6)$ 是一个 $2 \\times 3 \\times 6$ 长方体的顶点，所以它到原点的距离是 $\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$。负坐标没有影响：它的平方是正的，$(-3)^2 = 9$。

> **注意。** 先把每个坐标平方再相加：$2 + (-3) + 6 = 5$ 和 $2 + 3 + 6 = 11$ 都不是距离。三个坐标都要用：$\\sqrt{x^2 + y^2}$ 只是点正下方在地面上的距离。`,
      ),
      generate(rng) {
        const [x, y, z] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const n = x * x + y * y + z * z;
        const [ax, ay, az] = [Math.abs(x), Math.abs(y), Math.abs(z)];
        return {
          ...rootProblem({
            prompt: t(
              `How far is the point $(${x}, ${y}, ${z})$ from the origin? Write the distance in simplest radical form.`,
              `点 $(${x}, ${y}, ${z})$ 到原点的距离是多少？用最简根式表示。`,
            ),
            n,
            wrong: [
              ...(x + y + z === 0 ? [] : [String(Math.abs(x + y + z)), `\\sqrt{${Math.abs(x + y + z)}}`]),
              String(ax + ay + az),
              `\\sqrt{${x * x + y * y}}`,
            ],
            solution: t(
              `**Step 1: the box.** The point and the origin are opposite corners of a box with edges $${ax}$, $${ay}$ and $${az}$, and the distance is its diagonal:

{{figure 0}}

**Step 2: the formula.** Square each coordinate, add, and take the square root:${steps(`d = \\sqrt{${squareOf(x)} + ${squareOf(y)} + ${squareOf(z)}} = \\sqrt{${x * x} + ${y * y} + ${z * z}} = ${rootSteps(n)}`)}**Check.** $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$: at least the longest edge, $${Math.max(ax, ay, az)}$, and less than the way along the three edges, $${ax} + ${ay} + ${az} = ${ax + ay + az}$, as a diagonal must be.`,
              `**第一步：长方体。** 这个点和原点是棱长为 $${ax}$、$${ay}$、$${az}$ 的长方体相对的两个顶点，距离就是它的体对角线：

{{figure 0}}

**第二步：公式。** 把每个坐标平方，相加，再开平方：${steps(`d = \\sqrt{${squareOf(x)} + ${squareOf(y)} + ${squareOf(z)}} = \\sqrt{${x * x} + ${y * y} + ${z * z}} = ${rootSteps(n)}`)}**检验。** $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$：不短于最长的棱 $${Math.max(ax, ay, az)}$，又比沿三条棱走的 $${ax} + ${ay} + ${az} = ${ax + ay + az}$ 短，体对角线理应如此。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(ax, ay, az, { l: `${ax}`, d: `${ay}`, h: `${az}` }, "space"),
              `A box ${ax} by ${ay} by ${az} whose diagonal joins the origin to the point.`,
              `一个 ${ax} × ${ay} × ${az} 的长方体，它的体对角线连接原点和这个点。`,
            ),
          ],
        };
      },
    },
    {
      id: "distance-between-two-points",
      title: t("Distance between two points", "两点之间的距离"),
      explanation: t(
        `Two points in space are opposite corners of a box whose edges run along the axes. Its edges are the differences of the coordinates, so the distance between $(x_1, y_1, z_1)$ and $(x_2, y_2, z_2)$ is its diagonal:

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}.$$

From $(2, 0, -3)$ to $(5, 4, 9)$ the differences are $3$, $4$ and $12$, so $d = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$. The order does not matter: subtracting the other way changes only the signs, and the squares are the same.

> **Watch out.** Subtract the coordinates, do not add them: the edges of the box are the differences. And square the differences before adding, since a plain sum of differences can even come out $0$ between two different points.`,
        `空间中的两个点是一个棱与坐标轴平行的长方体相对的两个顶点。长方体的棱长是坐标之差，所以 $(x_1, y_1, z_1)$ 与 $(x_2, y_2, z_2)$ 之间的距离就是它的体对角线：

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}.$$

从 $(2, 0, -3)$ 到 $(5, 4, 9)$，坐标之差是 $3$、$4$ 和 $12$，所以 $d = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$。先后顺序无关：反过来相减只改变符号，平方不变。

> **注意。** 坐标要相减，不是相加：长方体的棱长是坐标之差。坐标之差要先平方再相加，因为两个不同的点，坐标之差直接相加甚至可能等于 $0$。`,
      ),
      generate(rng) {
        const p = [rng.int(-8, 8), rng.int(-8, 8), rng.int(-8, 8)] as const;
        const delta = [rng.nonZero(-8, 8), rng.nonZero(-8, 8), rng.int(-8, 8)] as const;
        const q = p.map((v, i) => v + delta[i]!);
        const n = delta.reduce((s, v) => s + v * v, 0);
        const sumWrong = Math.abs(delta[0] + delta[1] + delta[2]);
        const plus = p.map((v, i) => (v + q[i]!) ** 2).reduce((s, v) => s + v, 0);
        const diff = (i: number) => `${q[i]} - ${p[i]! < 0 ? `(${p[i]})` : p[i]} = ${delta[i]}`;
        const back = delta.map((v) => squareOf(-v)).join(" + ");
        const abs = delta.map((v) => Math.abs(v));
        return {
          ...rootProblem({
            prompt: t(
              `Find the distance between $(${p.join(", ")})$ and $(${q.join(", ")})$. Write it in simplest radical form.`,
              `求点 $(${p.join(", ")})$ 与 $(${q.join(", ")})$ 之间的距离。用最简根式表示。`,
            ),
            n,
            wrong: [...(sumWrong === 0 ? [] : [`\\sqrt{${sumWrong}}`, String(sumWrong)]), ...(plus > 0 ? [rootTex(plus)] : [])],
            solution: t(
              `**Step 1: the differences.** Subtract each coordinate of the first point from that of the second:${steps(diff(0), diff(1), diff(2))}These are the edges of the box with the two points as opposite corners:

{{figure 0}}

**Step 2: the diagonal.**${steps(`d = \\sqrt{${squareOf(delta[0])} + ${squareOf(delta[1])} + ${squareOf(delta[2])}} = \\sqrt{${delta.map((v) => v * v).join(" + ")}} = ${rootSteps(n)}`)}**Check.** Subtract the other way, first point minus second: the differences change sign, and $${back} = ${n}$ again.`,
              `**第一步：坐标之差。** 用第二个点的每个坐标减去第一个点对应的坐标：${steps(diff(0), diff(1), diff(2))}它们就是以这两个点为相对顶点的长方体的棱长：

{{figure 0}}

**第二步：体对角线。**${steps(`d = \\sqrt{${squareOf(delta[0])} + ${squareOf(delta[1])} + ${squareOf(delta[2])}} = \\sqrt{${delta.map((v) => v * v).join(" + ")}} = ${rootSteps(n)}`)}**检验。** 反过来用第一个点减第二个点：坐标之差都变号，而 $${back} = ${n}$，结果不变。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(
                Math.max(abs[0]!, 0.5),
                Math.max(abs[1]!, 0.5),
                Math.max(abs[2]!, 0.5),
                { l: `${abs[0]}`, d: `${abs[1]}`, h: `${abs[2]}` },
                "space",
              ),
              `A box with edges ${abs.join(", ")} along the axes, the two points at opposite corners.`,
              `一个棱与坐标轴平行、棱长为 ${abs.join("、")} 的长方体，两个点在相对的顶点。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-coordinate",
      title: t("A missing coordinate", "求未知坐标"),
      explanation: t(
        `If the distance is known and one coordinate is not, substitute into the distance formula, square both sides and solve. Squaring loses the sign, so there are usually two answers: one on each side of the other point.

The point $(4, 1, z)$ is $9$ units from $(0, -3, 2)$: the differences are $4$, $4$ and $z - 2$, so $16 + 16 + (z - 2)^2 = 81$, $(z - 2)^2 = 49$, $z - 2 = \\pm 7$, and $z = 9$ or $z = -5$. Both points lie $7$ above or below the height $2$.

> **Watch out.** Keep both square roots, $\\pm 7$: dropping the negative one loses an answer. And $z - 2 = \\pm 7$ still has to be solved for $z$: $\\pm 7$ is how far $z$ is from $2$, not $z$ itself.`,
        `如果已知距离而有一个坐标未知，就代入距离公式，两边平方后解方程。平方会丢掉符号，所以通常有两个解：分别在另一点的两侧。

点 $(4, 1, z)$ 到 $(0, -3, 2)$ 的距离是 $9$：坐标之差是 $4$、$4$ 和 $z - 2$，所以 $16 + 16 + (z - 2)^2 = 81$，$(z - 2)^2 = 49$，$z - 2 = \\pm 7$，$z = 9$ 或 $z = -5$。这两个点分别比高度 $2$ 高 $7$ 或低 $7$。

> **注意。** 两个平方根 $\\pm 7$ 都要保留：丢掉负的就少了一个解。$z - 2 = \\pm 7$ 还要解出 $z$：$\\pm 7$ 是 $z$ 与 $2$ 的距离，不是 $z$ 本身。`,
      ),
      generate(rng) {
        const p = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        const [dx, dy, dz] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.int(1, 9)];
        const d2 = dx * dx + dy * dy + dz * dz;
        const [dk, dm] = simplifyRadical(d2);
        const dTex = dm === 1 ? String(dk) : `\\sqrt{${d2}}`;
        const dSquared = dm === 1 ? `${dk}^2` : `(\\sqrt{${d2}})^2`;
        const z1 = p[2] + dz;
        const z2 = p[2] - dz;
        const q = [p[0] + dx, p[1] + dy];
        const zTex = p[2] === 0 ? "z" : `(z ${p[2] > 0 ? "-" : "+"} ${Math.abs(p[2])})`;
        const zDiff = (z: number) => `${z} - ${p[2] < 0 ? `(${p[2]})` : p[2]} = ${z - p[2]}`;
        return {
          ...solutionsProblem({
            prompt: t(
              `The point $(${q[0]}, ${q[1]}, z)$ is $${dTex}$ units from $(${p.join(", ")})$. Find all possible values of $z$.`,
              `点 $(${q[0]}, ${q[1]}, z)$ 到 $(${p.join(", ")})$ 的距离是 $${dTex}$。求 $z$ 的所有可能值。`,
            ),
            variable: "z",
            values: [String(z1), String(z2)],
            wrong: [[String(z1)], [String(dz), String(-dz)], [String(-p[2] + dz), String(-p[2] - dz)]],
            solution: t(
              `**Step 1: the equation.** The differences in $x$ and $y$ are $${dx}$ and $${dy}$. Square the distance, $${dSquared} = ${d2}$:${steps(`${squareOf(dx)} + ${squareOf(dy)} + ${zTex}^2 = ${d2}`, `${zTex}^2 = ${d2} - ${dx * dx + dy * dy} = ${dz * dz}`)}{{figure 0}}

**Step 2: both square roots.** A square of $${dz * dz}$ comes from $${dz}$ or $-${dz}$:${steps(`${p[2] === 0 ? "z" : zTex.slice(1, -1)} = \\pm ${dz}`, p[2] === 0 ? `z = \\pm ${dz}` : `z = ${p[2]} \\pm ${dz}`)}So $z = ${z1}$ or $z = ${z2}$.

**Check.** For each value the third difference is $${zDiff(z1)}$ or $${zDiff(z2)}$, both with square $${dz * dz}$, and $${dx * dx} + ${dy * dy} + ${dz * dz} = ${d2}$.`,
              `**第一步：列方程。** $x$ 和 $y$ 坐标之差是 $${dx}$ 和 $${dy}$。把距离平方，$${dSquared} = ${d2}$：${steps(`${squareOf(dx)} + ${squareOf(dy)} + ${zTex}^2 = ${d2}`, `${zTex}^2 = ${d2} - ${dx * dx + dy * dy} = ${dz * dz}`)}{{figure 0}}

**第二步：两个平方根。** 平方等于 $${dz * dz}$ 的数是 $${dz}$ 或 $-${dz}$：${steps(`${p[2] === 0 ? "z" : zTex.slice(1, -1)} = \\pm ${dz}`, p[2] === 0 ? `z = \\pm ${dz}` : `z = ${p[2]} \\pm ${dz}`)}所以 $z = ${z1}$ 或 $z = ${z2}$。

**检验。** 两个值对应的第三个坐标之差是 $${zDiff(z1)}$ 或 $${zDiff(z2)}$，平方都是 $${dz * dz}$，而 $${dx * dx} + ${dy * dy} + ${dz * dz} = ${d2}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              boxMarks(Math.abs(dx), Math.abs(dy), dz, { l: `${Math.abs(dx)}`, d: `${Math.abs(dy)}`, h: "?" }, "space"),
              `A box ${Math.abs(dx)} by ${Math.abs(dy)} with unknown height, whose diagonal is ${dm === 1 ? dk : `√${d2}`}.`,
              `一个 ${Math.abs(dx)} × ${Math.abs(dy)} 的长方体，高未知，体对角线是 ${dm === 1 ? dk : `√${d2}`}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** reduced writes the fraction n/d followed by its value q, or the fraction alone when it is already in lowest terms. */
function reduced(n: number, d: number, q: Q): string {
  return q.n === BigInt(n) && q.d === BigInt(d) ? `\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}} = ${num(q)}`;
}

/** triPyramid draws a pyramid on a triangle with base b and height hb, the pyramid h high, with the three lengths labeled. */
function triPyramid(b: number, hb: number, h: number, labels: { b: string; hb: string; h: string }): Mark[] {
  const [B, HB, H] = fitBox([b, hb, h]) as [number, number, number];
  const [A, Bv, C] = [P3(0, 0, 0), P3(B, 0, 0), P3(0.4 * B, 0, HB)];
  const g: [number, number, number] = [(1.4 * B) / 3, 0, HB / 3];
  const apex = P3(g[0], H, g[2]);
  const foot = P3(g[0], 0, g[2]);
  const [hFoot, hTop] = [P3(0.4 * B, 0, 0), C];
  return [
    { kind: "segment", a: A, b: Bv },
    { kind: "segment", a: Bv, b: C },
    { kind: "segment", a: C, b: A, dashed: true },
    { kind: "segment", a: apex, b: A },
    { kind: "segment", a: apex, b: Bv },
    { kind: "segment", a: apex, b: C, dashed: true },
    { kind: "segment", a: hFoot, b: hTop, dashed: true, accent: true },
    { kind: "segment", a: apex, b: foot, dashed: true, accent: true },
    { kind: "dot", at: foot },
    { kind: "side", a: A, b: Bv, text: labels.b },
    { kind: "label", at: [(hFoot[0] + hTop[0]) / 2, (hFoot[1] + hTop[1]) / 2], text: labels.hb, dir: "w" },
    { kind: "label", at: [(apex[0] + foot[0]) / 2, (apex[1] + foot[1]) / 2], text: labels.h, dir: "e" },
  ];
}

/** squarePyramidNet draws the net of a square pyramid with base edge s and slant height l, the base area and the slant height marked. */
function squarePyramidNet(s: number, l: number, baseArea: string, sLabel: string, lLabel: string): Mark[] {
  const [S, Lh] = [2, (2 * l) / s];
  const square: Point[] = [
    [0, 0],
    [S, 0],
    [S, S],
    [0, S],
  ];
  const tips: Point[] = [
    [S / 2, -Lh],
    [S + Lh, S / 2],
    [S / 2, S + Lh],
    [-Lh, S / 2],
  ];
  return [
    { kind: "polygon", points: square, accent: true },
    ...square.map((a, i): Mark => ({ kind: "polygon", points: [a, tips[i]!, square[(i + 1) % 4]!] })),
    { kind: "segment", a: [S / 2, 0], b: [S / 2, -Lh], dashed: true, accent: true },
    { kind: "label", at: [S / 2, -Lh / 2], text: lLabel, dir: "e" },
    { kind: "label", at: [S / 2, 0.2], text: sLabel, dir: "n" },
    { kind: "label", at: [S / 2, S / 2], text: baseArea, dir: "n" },
  ];
}

/** pyramidTriangle draws a square pyramid with the right triangle of its height, half a base edge and its slant height. */
function pyramidTriangle(s: number, h: number, labels: { s: string; h: string; half: string; l: string }): Mark[] {
  const [L, D] = fitBox([s, s, h]) as [number, number, number];
  const foot = P3(L / 2, 0, D / 2);
  const mid = P3(L / 2, 0, 0);
  return [
    ...pyramidMarks(s, s, h, { l: labels.s, h: labels.h, s: labels.l }),
    { kind: "segment", a: foot, b: mid, accent: true },
    { kind: "label", at: [(foot[0] + mid[0]) / 2, (foot[1] + mid[1]) / 2], text: labels.half, dir: "se" },
  ];
}

export const volumesOfPyramids: TopicDef = {
  id: "volumes-of-pyramids",
  title: t("Volumes of Pyramids", "棱锥的体积"),
  summary: t(
    "Find the volume of a pyramid, one third of base area times height, and a missing height or base edge.",
    "求棱锥的体积（底面积乘高的三分之一），以及未知的高或底边长。",
  ),
  prerequisites: ["volumes-of-rectangular-solids", "area-of-triangles"],
  encompasses: [{ topic: "area-of-rectangles-and-squares", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSG.GMD.A.3"],
  intro: t(
    `Take a box with a $3 \\times 3$ cm square base and a height of $4$ cm, and a pyramid on the same base with the same height, its apex right above the center of the base. Fill the pyramid with sand and pour it into the box: it takes exactly three pyramids to fill the box.

{{figure 0}}

The box holds $3 \\cdot 3 \\cdot 4 = 36\\text{ cm}^3$, so the pyramid holds $36 \\div 3 = 12\\text{ cm}^3$. The pyramid narrows to a point, so it must hold less than the box; that it is exactly a third is true of every pyramid, whatever the shape of its base. In this lesson we find volumes of pyramids on rectangles and triangles, and find a missing height or base edge from the volume.`,
    `取一个底面是 $3 \\times 3$ 厘米正方形、高 $4$ 厘米的长方体盒子，再取一个同底等高的棱锥，顶点在底面中心的正上方。把棱锥装满沙子倒进盒子：恰好倒三次才能装满。

{{figure 0}}

盒子的容积是 $3 \\cdot 3 \\cdot 4 = 36\\text{ cm}^3$，所以棱锥的体积是 $36 \\div 3 = 12\\text{ cm}^3$。棱锥向上收成一个点，装得当然比盒子少；而恰好是三分之一，对任何棱锥都成立，不论底面是什么形状。这节课我们求底面为长方形和三角形的棱锥的体积，并由体积求未知的高或底边长。`,
  ),
  introFigures: [
    figure(
      [...boxMarks(3, 3, 4, { l: "3 cm", d: "3 cm", h: "4 cm" }), ...shift(pyramidMarks(3, 3, 4, { l: "3 cm", h: "4 cm" }), 6.5)],
      "A box with a 3 cm by 3 cm base and height 4 cm, beside a pyramid with the same base and height.",
      "底面 3 厘米 × 3 厘米、高 4 厘米的长方体，旁边是同底等高的棱锥。",
    ),
  ],
  knowledgePoints: [
    {
      id: "pyramids-on-rectangles",
      figure: geometryDrawings2["volumes-of-pyramids#pyramids-on-rectangles"],
      title: t("Pyramids on rectangles", "底面为长方形的棱锥"),
      explanation: t(
        `The **height** of a pyramid is the perpendicular distance from its apex to the plane of its base, not the length of a slanted edge. A pyramid holds exactly one third of the prism with the same base and height, so

$$V = \\frac{1}{3}Bh,$$

where $B$ is the area of the base. A pyramid on a $6$ cm by $5$ cm rectangle with height $8$ cm has $B = 30\\text{ cm}^2$; the box with that base and height holds $30 \\cdot 8 = 240\\text{ cm}^3$, and the pyramid a third of it, $V = 80\\text{ cm}^3$.

> **Watch out.** Do not forget the $\\frac{1}{3}$: $lwh$ is the volume of the box around the pyramid. The fraction is $\\frac{1}{3}$, not the $\\frac{1}{2}$ of a triangle's area, and it multiplies the product $Bh$, not the sum $B + h$.`,
        `棱锥的**高**是从顶点到底面所在平面的垂直距离，不是一条斜棱的长。棱锥的体积恰好是同底等高的棱柱的三分之一，所以

$$V = \\frac{1}{3}Bh,$$

其中 $B$ 是底面积。底面是 $6$ 厘米 × $5$ 厘米的长方形、高 $8$ 厘米的棱锥，$B = 30\\text{ cm}^2$；同底等高的长方体体积是 $30 \\cdot 8 = 240\\text{ cm}^3$，棱锥是它的三分之一，$V = 80\\text{ cm}^3$。

> **注意。** 不要忘了 $\\frac{1}{3}$：$lwh$ 是套在棱锥外面的长方体的体积。系数是 $\\frac{1}{3}$，不是三角形面积公式里的 $\\frac{1}{2}$；它乘的是积 $Bh$，不是和 $B + h$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const square = rng.bool(0.4);
        const l = rng.int(2, 15);
        const w = square ? l : rng.int(2, 12);
        const h = rng.int(2, 15);
        const v = Q.of(l * w * h, 3);
        return {
          ...numberProblem({
            prompt: t(
              "Find the volume of the pyramid. Its apex is directly above the center of its rectangular base.",
              "求这个棱锥的体积。它的顶点在长方形底面中心的正上方。",
            ),
            answer: v,
            unit: `${u}^3`,
            wrong: [l * w * h, Q.of(l * w * h, 2), Q.of(l * w + h, 3)],
            solution: t(
              `**Step 1: the base.** The base is a $${l}$ by $${w}$ rectangle:${steps(`B = ${l} \\cdot ${w} = ${l * w}`)}**Step 2: one third of base times height.** The height is $${h}$:${steps(`V = \\frac{1}{3}Bh = \\frac{1}{3} \\cdot ${l * w} \\cdot ${h} = ${reduced(l * w * h, 3, v)}\\text{ ${u}}^3`)}{{figure 0}}

**Check.** The box with the same base and height holds $${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}$, and three pyramids fill it: $3 \\cdot ${num(v)} = ${l * w * h}$.`,
              `**第一步：底面。** 底面是 $${l} \\times ${w}$ 的长方形：${steps(`B = ${l} \\cdot ${w} = ${l * w}`)}**第二步：底面积乘高的三分之一。** 高是 $${h}$：${steps(`V = \\frac{1}{3}Bh = \\frac{1}{3} \\cdot ${l * w} \\cdot ${h} = ${reduced(l * w * h, 3, v)}\\text{ ${u}}^3`)}{{figure 0}}

**检验。** 同底等高的长方体体积是 $${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}$，三个棱锥正好装满它：$3 \\cdot ${num(v)} = ${l * w * h}$。`,
            ),
          }),
          figure: figure(
            pyramidMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }),
            `A pyramid on a ${l} by ${w} ${u} rectangle, with height ${h} ${u}.`,
            `一个底面为 ${l} × ${w} ${u} 长方形、高 ${h} ${u} 的棱锥。`,
          ),
          solutionFigures: [
            figure(
              [...boxMarks(l, w, h, { l: len(l, u), d: len(w, u) }), ...pyramidMarks(l, w, h, { h: len(h, u) })],
              `The pyramid inside the box with the same ${l} by ${w} ${u} base and height ${h} ${u}.`,
              `棱锥放在同底（${l} × ${w} ${u}）等高（${h} ${u}）的长方体里。`,
            ),
          ],
        };
      },
    },
    {
      id: "pyramids-on-triangles",
      figure: geometryDrawings2["volumes-of-pyramids#pyramids-on-triangles"],
      title: t("Pyramids on triangles", "底面为三角形的棱锥"),
      explanation: t(
        `The formula $V = \\frac{1}{3}Bh$ works for any base, so first find the area of the base. For a triangular base that takes the triangle's own base and height, $B = \\frac{1}{2}bh_b$.

A pyramid on a triangle with base $6$ cm and height $4$ cm, and with height $9$ cm itself, has $B = \\frac{1}{2} \\cdot 6 \\cdot 4 = 12\\text{ cm}^2$ and $V = \\frac{1}{3} \\cdot 12 \\cdot 9 = 36\\text{ cm}^3$.

> **Watch out.** There are two heights and two fractions. The triangle's height lies in the base and goes with $\\frac{1}{2}$; the pyramid's height rises from the base and goes with $\\frac{1}{3}$. Leaving out either fraction gives twice or three times the volume.`,
        `公式 $V = \\frac{1}{3}Bh$ 对任何底面都成立，所以先求底面积。底面是三角形时，要用三角形自己的底和高，$B = \\frac{1}{2}bh_b$。

底面是底 $6$ 厘米、高 $4$ 厘米的三角形，棱锥本身高 $9$ 厘米，则 $B = \\frac{1}{2} \\cdot 6 \\cdot 4 = 12\\text{ cm}^2$，$V = \\frac{1}{3} \\cdot 12 \\cdot 9 = 36\\text{ cm}^3$。

> **注意。** 这里有两个高、两个分数。三角形的高在底面里，配 $\\frac{1}{2}$；棱锥的高从底面向上，配 $\\frac{1}{3}$。漏掉任何一个分数，体积就成了正确答案的两倍或三倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [b, hb, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 15)];
        const base = Q.of(b * hb, 2);
        const v = Q.of(b * hb * h, 6);
        return {
          ...numberProblem({
            prompt: t(
              `The base of a pyramid is a triangle with base $${tex(b, u)}$ and height $${tex(hb, u)}$. The height of the pyramid is $${tex(h, u)}$. Find its volume.`,
              `一个棱锥的底面是底为 $${tex(b, u)}$、高为 $${tex(hb, u)}$ 的三角形，棱锥的高是 $${tex(h, u)}$。求它的体积。`,
            ),
            answer: v,
            unit: `${u}^3`,
            wrong: [Q.of(b * hb * h, 3), Q.of(b * hb * h, 2), b * hb * h],
            solution: t(
              `**Step 1: the area of the base.** The triangle has base $${b}$ and height $${hb}$:${steps(`B = \\frac{1}{2} \\cdot ${b} \\cdot ${hb} = ${num(base)}`)}{{figure 0}}

**Step 2: the volume.** The pyramid's own height is $${h}$:${steps(`V = \\frac{1}{3}Bh = \\frac{1}{3} \\cdot ${num(base)} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}**Check.** Both fractions at once: $V = \\frac{1}{3} \\cdot \\frac{1}{2} \\cdot ${b} \\cdot ${hb} \\cdot ${h} = ${reduced(b * hb * h, 6, v)}$. And the triangular prism with the same base and height, $${num(base)} \\cdot ${h} = ${num(base.mul(Q.of(h)))}$, is three times as much.`,
              `**第一步：底面积。** 三角形的底是 $${b}$，高是 $${hb}$：${steps(`B = \\frac{1}{2} \\cdot ${b} \\cdot ${hb} = ${num(base)}`)}{{figure 0}}

**第二步：体积。** 棱锥自己的高是 $${h}$：${steps(`V = \\frac{1}{3}Bh = \\frac{1}{3} \\cdot ${num(base)} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}**检验。** 两个分数一起算：$V = \\frac{1}{3} \\cdot \\frac{1}{2} \\cdot ${b} \\cdot ${hb} \\cdot ${h} = ${reduced(b * hb * h, 6, v)}$。同底等高的三棱柱体积是 $${num(base)} \\cdot ${h} = ${num(base.mul(Q.of(h)))}$，正好是它的三倍。`,
            ),
          }),
          solutionFigures: [
            figure(
              triPyramid(b, hb, h, { b: len(b, u), hb: len(hb, u), h: len(h, u) }),
              `A pyramid on a triangle with base ${b} ${u} and height ${hb} ${u}; the pyramid is ${h} ${u} high.`,
              `底面是底 ${b} ${u}、高 ${hb} ${u} 的三角形的棱锥；棱锥高 ${h} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-height-or-base-edge",
      figure: solidDrawings["missing-height-or-base-edge"],
      title: t("A missing height or base edge", "求未知的高或底边长"),
      explanation: t(
        `Solve $V = \\frac{1}{3}Bh$ for the unknown. Multiplying both sides by $3$ clears the fraction, $3V = Bh$, so the height is $h = \\frac{3V}{B}$. For a square base with edge $s$, $s^2 = \\frac{3V}{h}$, and the edge is the square root of that.

A square pyramid with volume $150\\text{ cm}^3$ and height $18$ cm: $s^2 = \\frac{3 \\cdot 150}{18} = \\frac{450}{18} = 25$, so $s = 5$ cm. Check: $\\frac{1}{3} \\cdot 25 \\cdot 18 = 150$.

> **Watch out.** Multiply the volume by $3$ before dividing: $\\frac{V}{B}$ is only a third of the height. And for the base edge, $\\frac{3V}{h}$ is the area of the square, $s^2$: take its square root.`,
        `由 $V = \\frac{1}{3}Bh$ 解出未知量。两边同乘 $3$ 去掉分数，$3V = Bh$，所以高是 $h = \\frac{3V}{B}$。底面是边长为 $s$ 的正方形时，$s^2 = \\frac{3V}{h}$，边长就是它的平方根。

体积 $150\\text{ cm}^3$、高 $18$ 厘米的正方形底棱锥：$s^2 = \\frac{3 \\cdot 150}{18} = \\frac{450}{18} = 25$，所以 $s = 5$ 厘米。检验：$\\frac{1}{3} \\cdot 25 \\cdot 18 = 150$。

> **注意。** 先把体积乘 $3$ 再除：$\\frac{V}{B}$ 只是高的三分之一。求底边长时，$\\frac{3V}{h}$ 是正方形的面积 $s^2$，还要开平方。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const h = rng.int(2, 15);
        const v = Q.of(s * s * h, 3);
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `A pyramid with a square base of edge $${tex(s, u)}$ has a volume of $${num(v)}\\text{ ${u}}^3$. Find its height.`,
                `一个底面是边长 $${tex(s, u)}$ 的正方形的棱锥，体积是 $${num(v)}\\text{ ${u}}^3$。求它的高。`,
              ),
              answer: h,
              form: "number",
              unit: u,
              wrong: [v.div(Q.of(s * s)), v.mul(Q.of(3)), v.div(Q.of(s))],
              solution: t(
                `**Step 1: clear the fraction.** The base has area $B = ${s}^2 = ${s * s}$. Multiply $V = \\frac{1}{3}Bh$ by $3$:${steps(`${s * s}h = 3 \\cdot ${num(v)} = ${s * s * h}`)}{{figure 0}}

**Step 2: divide by the base area.**${steps(`h = \\frac{${s * s * h}}{${s * s}} = ${tex(h, u)}`)}**Check.** $\\frac{1}{3} \\cdot ${s * s} \\cdot ${h} = ${reduced(s * s * h, 3, v)}$, the volume given.`,
                `**第一步：去掉分数。** 底面积 $B = ${s}^2 = ${s * s}$。把 $V = \\frac{1}{3}Bh$ 两边乘 $3$：${steps(`${s * s}h = 3 \\cdot ${num(v)} = ${s * s * h}`)}{{figure 0}}

**第二步：除以底面积。**${steps(`h = \\frac{${s * s * h}}{${s * s}} = ${tex(h, u)}`)}**检验。** $\\frac{1}{3} \\cdot ${s * s} \\cdot ${h} = ${reduced(s * s * h, 3, v)}$，正是给出的体积。`,
              ),
            }),
            solutionFigures: [
              figure(
                pyramidMarks(s, s, h, { l: len(s, u), d: len(s, u), h: "h" }),
                `A pyramid on a square with edge ${s} ${u}, its height h unknown.`,
                `底面是边长 ${s} ${u} 的正方形的棱锥，高 h 未知。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `A pyramid with a square base has a volume of $${num(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. How long is each edge of the base?`,
              `一个底面是正方形的棱锥，体积是 $${num(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。底面边长是多少？`,
            ),
            answer: s,
            form: "number",
            unit: u,
            wrong: [s * s, v.div(Q.of(h)), Q.of(s * s * 3)],
            solution: t(
              `**Step 1: the area of the base.** Multiply $V = \\frac{1}{3}s^2h$ by $3$ and divide by the height:${steps(`s^2 = \\frac{3 \\cdot ${num(v)}}{${h}} = \\frac{${s * s * h}}{${h}} = ${s * s}`)}{{figure 0}}

**Step 2: the edge.** The base is a square of area $${s * s}$:${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}**Check.** $\\frac{1}{3} \\cdot ${s}^2 \\cdot ${h} = ${reduced(s * s * h, 3, v)}$, the volume given.`,
              `**第一步：底面积。** 把 $V = \\frac{1}{3}s^2h$ 两边乘 $3$，再除以高：${steps(`s^2 = \\frac{3 \\cdot ${num(v)}}{${h}} = \\frac{${s * s * h}}{${h}} = ${s * s}`)}{{figure 0}}

**第二步：边长。** 底面是面积为 $${s * s}$ 的正方形：${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}**检验。** $\\frac{1}{3} \\cdot ${s}^2 \\cdot ${h} = ${reduced(s * s * h, 3, v)}$，正是给出的体积。`,
            ),
          }),
          solutionFigures: [
            figure(
              pyramidMarks(s, s, h, { l: "s", d: "s", h: len(h, u) }),
              `A pyramid ${h} ${u} high on a square with unknown edge s.`,
              `高 ${h} ${u}、底面是边长 s 未知的正方形的棱锥。`,
            ),
          ],
        };
      },
    },
  ],
};

export const surfaceAreasOfPyramids: TopicDef = {
  id: "surface-areas-of-pyramids",
  title: t("Surface Areas of Pyramids", "棱锥的表面积"),
  summary: t(
    "Find the lateral and total surface area of regular pyramids from the slant height, or from the height.",
    "由斜高或高求正棱锥的侧面积和表面积。",
  ),
  prerequisites: ["finding-surface-areas-using-nets", "volumes-of-pyramids", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "finding-surface-areas-using-nets", weight: 0.5 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 14,
  intro: t(
    `A tent shaped like a square pyramid has a floor $6$ m on each side, and each of its four walls is a triangle that rises $5$ m from the middle of its bottom edge to the top. How much canvas is in the tent, floor included?

{{figure 0}}

Unfold it: a $6 \\times 6$ square, $36\\text{ m}^2$, and four triangles with base $6$ and height $5$, each $\\frac{1}{2} \\cdot 6 \\cdot 5 = 15\\text{ m}^2$. In all, $36 + 4 \\cdot 15 = 96\\text{ m}^2$. The $5$ m is not how tall the tent is: it runs up the slope of a wall, so it is called the **slant height**. The tent itself is only $4$ m tall, since $3^2 + 4^2 = 5^2$. In this lesson we find surface areas of regular pyramids from the slant height, find the slant height from the height when that is what is given, and find lateral areas.`,
    `一顶正四棱锥形的帐篷，地面是边长 $6$ 米的正方形，四面墙都是三角形，从底边中点到顶点长 $5$ 米。连地面在内，这顶帐篷用了多少帆布？

{{figure 0}}

把它展开：一个 $6 \\times 6$ 的正方形，$36\\text{ m}^2$，还有四个底为 $6$、高为 $5$ 的三角形，每个 $\\frac{1}{2} \\cdot 6 \\cdot 5 = 15\\text{ m}^2$。合计 $36 + 4 \\cdot 15 = 96\\text{ m}^2$。这 $5$ 米不是帐篷的高度：它沿着墙面的斜坡向上，所以叫作**斜高**。帐篷本身只有 $4$ 米高，因为 $3^2 + 4^2 = 5^2$。这节课我们由斜高求正棱锥的表面积，在只知道高时先求出斜高，并求侧面积。`,
  ),
  introFigures: [
    figure(
      pyramidMarks(6, 6, 4, { l: "6 m", s: "5 m" }),
      "A tent shaped like a square pyramid: base edges of 6 m, and a slant height of 5 m up the middle of each wall.",
      "正四棱锥形的帐篷：底边长 6 米，每面墙正中的斜高 5 米。",
    ),
  ],
  knowledgePoints: [
    {
      id: "square-pyramids-from-the-slant-height",
      figure: solidDrawings["square-pyramids-from-the-slant-height"],
      title: t("Square pyramids from the slant height", "由斜高求四棱锥的表面积"),
      explanation: t(
        `In a **regular pyramid** the base is a regular polygon and the apex is above its center, so the lateral faces are congruent isosceles triangles. The height of each triangle, from the middle of a base edge up to the apex, is the **slant height** $l$. Do not confuse it with the height $h$ of the pyramid, which goes straight down inside and is shorter.

A square pyramid with base edge $s$ has a square base and four triangles of base $s$ and height $l$:

$$S = s^2 + 4 \\cdot \\frac{1}{2}sl = s^2 + 2sl.$$

With $s = 10$ cm and $l = 13$ cm, the base is $100\\text{ cm}^2$, each triangle $65\\text{ cm}^2$, and $S = 100 + 260 = 360\\text{ cm}^2$.

> **Watch out.** Each triangle has area $\\frac{1}{2}sl$: forgetting the $\\frac{1}{2}$ doubles the four walls. Count the base too, unless only the lateral area is asked, and count it once. The slant height goes into the area, not the volume formula's $\\frac{1}{3}$.`,
        `**正棱锥**的底面是正多边形，顶点在底面中心的正上方，所以各侧面是全等的等腰三角形。每个侧面三角形的高（从底边中点到顶点）叫作**斜高** $l$。不要和棱锥的高 $h$ 混淆，棱锥的高在内部竖直向下，更短。

底面边长为 $s$ 的正四棱锥有一个正方形底面和四个底为 $s$、高为 $l$ 的三角形：

$$S = s^2 + 4 \\cdot \\frac{1}{2}sl = s^2 + 2sl.$$

当 $s = 10$ 厘米、$l = 13$ 厘米时，底面 $100\\text{ cm}^2$，每个三角形 $65\\text{ cm}^2$，$S = 100 + 260 = 360\\text{ cm}^2$。

> **注意。** 每个三角形的面积是 $\\frac{1}{2}sl$：忘了 $\\frac{1}{2}$，四面墙就算成了两倍。除非只求侧面积，底面也要算上，而且只算一次。斜高用于求面积，和体积公式里的 $\\frac{1}{3}$ 无关。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 16);
        const l = rng.int(Math.floor(s / 2) + 2, 20);
        const area = s * s + 2 * s * l;
        const triangle = Q.of(s * l, 2);
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the regular square pyramid.", "求这个正四棱锥的表面积。"),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [2 * s * l, s * s + 4 * s * l, s * s + s * l, Q.of(s * s * l, 3)],
            solution: t(
              `**Step 1: the faces.** Unfolded, the pyramid is a square of side $${s}$ and four triangles of base $${s}$ and height $${l}$, the slant height:

{{figure 0}}${steps(`\\text{base: } ${s}^2 = ${s * s}`, `\\text{each triangle: } \\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(triangle)}`)}**Step 2: add them.**${steps(`S = ${s * s} + 4 \\cdot ${num(triangle)} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}**Check.** Two triangles side by side, one turned over, make a $${s} \\times ${l}$ rectangle, so the four walls are two such rectangles: $2 \\cdot ${s} \\cdot ${l} = ${2 * s * l}$, and $${s * s} + ${2 * s * l} = ${area}$.`,
              `**第一步：各个面。** 把棱锥展开，是一个边长 $${s}$ 的正方形和四个底为 $${s}$、高为斜高 $${l}$ 的三角形：

{{figure 0}}${steps(`\\text{底面：} ${s}^2 = ${s * s}`, `\\text{每个三角形：} \\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(triangle)}`)}**第二步：相加。**${steps(`S = ${s * s} + 4 \\cdot ${num(triangle)} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}**检验。** 两个三角形一正一倒拼在一起，是一个 $${s} \\times ${l}$ 的长方形，所以四面墙是两个这样的长方形：$2 \\cdot ${s} \\cdot ${l} = ${2 * s * l}$，$${s * s} + ${2 * s * l} = ${area}$。`,
            ),
          }),
          figure: figure(
            pyramidMarks(s, s, l * 0.9, { l: len(s, u), s: len(l, u) }),
            `A regular square pyramid with base edge ${s} ${u} and slant height ${l} ${u}.`,
            `一个底面边长 ${s} ${u}、斜高 ${l} ${u} 的正四棱锥。`,
          ),
          solutionFigures: [
            figure(
              squarePyramidNet(s, l, `${s * s}`, len(s, u), len(l, u)),
              `The net of the pyramid: a square of side ${s} ${u} and four triangles with slant height ${l} ${u}.`,
              `棱锥的展开图：边长 ${s} ${u} 的正方形和四个斜高 ${l} ${u} 的三角形。`,
            ),
          ],
        };
      },
    },
    {
      id: "slant-height-from-the-height",
      figure: solidDrawings["slant-height-from-the-height"],
      title: t("Slant height from the height", "由高求斜高"),
      explanation: t(
        `If the height $h$ is given instead, find the slant height first. Inside the pyramid, the height, the slant height and the segment from the center of the base to the middle of an edge form a right triangle, with the slant height as hypotenuse. For a square base with edge $s$, that segment is half an edge, $\\frac{s}{2}$, so

$$l = \\sqrt{h^2 + \\left(\\frac{s}{2}\\right)^2}.$$

With $s = 16$ cm and $h = 6$ cm, $l = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm, and $S = 256 + 2 \\cdot 16 \\cdot 10 = 576\\text{ cm}^2$.

> **Watch out.** The leg along the base is half an edge, not the whole edge. And the faces are triangles whose height is the slant height: putting the height $h$ in their place gives too little area.`,
        `如果给出的是高 $h$，先求斜高。在棱锥内部，高、斜高以及从底面中心到一条底边中点的线段构成一个直角三角形，斜高是斜边。底面是边长为 $s$ 的正方形时，这条线段是半条边 $\\frac{s}{2}$，所以

$$l = \\sqrt{h^2 + \\left(\\frac{s}{2}\\right)^2}.$$

当 $s = 16$ 厘米、$h = 6$ 厘米时，$l = \\sqrt{36 + 64} = \\sqrt{100} = 10$ 厘米，$S = 256 + 2 \\cdot 16 \\cdot 10 = 576\\text{ cm}^2$。

> **注意。** 底面上的那条直角边是半条边，不是整条边。侧面三角形的高是斜高：用高 $h$ 代替它，算出的面积就偏小。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples);
        const [half, h] = rng.bool() ? [a, b] : [b, a];
        const s = 2 * half;
        const area = s * s + 2 * s * c;
        return {
          ...numberProblem({
            prompt: t(
              `A regular square pyramid has base edge $${tex(s, u)}$ and height $${tex(h, u)}$. Find its surface area.`,
              `一个正四棱锥的底面边长是 $${tex(s, u)}$，高是 $${tex(h, u)}$。求它的表面积。`,
            ),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s * s + 2 * s * h, 2 * s * c, Q.of(s * s * h, 3)],
            solution: t(
              `**Step 1: the slant height.** The height $${h}$, half an edge $\\frac{${s}}{2} = ${half}$ and the slant height form a right triangle with the slant height as hypotenuse:

{{figure 0}}${steps(`l = \\sqrt{${h}^2 + ${half}^2} = \\sqrt{${h * h} + ${half * half}} = \\sqrt{${c * c}} = ${c}`)}**Step 2: the surface area.** The base is $${s}^2 = ${s * s}$, and the four triangles have base $${s}$ and height $${c}$:${steps(`S = ${s * s} + 4 \\cdot \\tfrac{1}{2} \\cdot ${s} \\cdot ${c} = ${s * s} + ${2 * s * c} = ${tex(area, u, 2)}`)}**Check.** The slant height $${c}$ is longer than the height $${h}$, as a hypotenuse must be. And by the perimeter, the four triangles make $\\frac{1}{2} \\cdot ${4 * s} \\cdot ${c} = ${2 * s * c}$, the same lateral area.`,
              `**第一步：斜高。** 高 $${h}$、半条边 $\\frac{${s}}{2} = ${half}$ 和斜高构成直角三角形，斜高是斜边：

{{figure 0}}${steps(`l = \\sqrt{${h}^2 + ${half}^2} = \\sqrt{${h * h} + ${half * half}} = \\sqrt{${c * c}} = ${c}`)}**第二步：表面积。** 底面是 $${s}^2 = ${s * s}$，四个三角形底为 $${s}$、高为 $${c}$：${steps(`S = ${s * s} + 4 \\cdot \\tfrac{1}{2} \\cdot ${s} \\cdot ${c} = ${s * s} + ${2 * s * c} = ${tex(area, u, 2)}`)}**检验。** 斜高 $${c}$ 比高 $${h}$ 长，斜边理应如此。用周长算，四个三角形是 $\\frac{1}{2} \\cdot ${4 * s} \\cdot ${c} = ${2 * s * c}$，侧面积相同。`,
            ),
          }),
          figure: figure(
            pyramidMarks(s, s, h, { l: len(s, u), h: len(h, u) }),
            `A regular square pyramid with base edge ${s} ${u} and height ${h} ${u}.`,
            `一个底面边长 ${s} ${u}、高 ${h} ${u} 的正四棱锥。`,
          ),
          solutionFigures: [
            figure(
              pyramidTriangle(s, h, { s: len(s, u), h: len(h, u), half: len(half, u), l: "?" }),
              `The right triangle inside the pyramid: the height ${h} ${u}, half an edge ${half} ${u}, and the unknown slant height.`,
              `棱锥内部的直角三角形：高 ${h} ${u}、半条边 ${half} ${u} 和未知的斜高。`,
            ),
          ],
        };
      },
    },
    {
      id: "lateral-area-of-regular-pyramids",
      figure: geometryDrawings2["surface-areas-of-pyramids#lateral-area-of-regular-pyramids"],
      title: t("Lateral area of regular pyramids", "正棱锥的侧面积"),
      explanation: t(
        `The **lateral area** of a pyramid is the area of its triangular faces only, without the base. A regular pyramid whose base has $n$ edges of length $s$ has $n$ congruent triangles, each with area $\\frac{1}{2}sl$. Their total can be written with the perimeter $P = ns$ of the base:

$$L = n \\cdot \\frac{1}{2}sl = \\frac{1}{2}Pl.$$

A regular pentagonal pyramid with base edge $6$ cm and slant height $10$ cm has $P = 30$ cm and $L = \\frac{1}{2} \\cdot 30 \\cdot 10 = 150\\text{ cm}^2$: five triangles of $30\\text{ cm}^2$.

> **Watch out.** Take half of $Pl$: each face is a triangle, not a rectangle. Use the whole perimeter, all $n$ edges, not one edge. And add no base: the lateral area leaves it out.`,
        `棱锥的**侧面积**只包括它的三角形侧面，不包括底面。底面有 $n$ 条长为 $s$ 的边的正棱锥有 $n$ 个全等的三角形，每个面积是 $\\frac{1}{2}sl$。它们的总和可以用底面周长 $P = ns$ 来写：

$$L = n \\cdot \\frac{1}{2}sl = \\frac{1}{2}Pl.$$

底面边长 $6$ 厘米、斜高 $10$ 厘米的正五棱锥，$P = 30$ 厘米，$L = \\frac{1}{2} \\cdot 30 \\cdot 10 = 150\\text{ cm}^2$：五个 $30\\text{ cm}^2$ 的三角形。

> **注意。** $Pl$ 要取一半：每个侧面是三角形，不是长方形。要用整个周长，即全部 $n$ 条边，不是一条边。不要加底面：侧面积不包括底面。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const n = rng.int(3, 8);
        const s = rng.int(2, 12);
        const l = rng.int(s, 20);
        const p = n * s;
        const lateral = Q.of(p * l, 2);
        const one = Q.of(s * l, 2);
        const name =
          n === 4 ? t("regular square pyramid", "正四棱锥") : t(`regular ${polygonNames[n]![1]} pyramid`, `正${zhDigits[n]}棱锥`);
        return {
          ...numberProblem({
            prompt: t(
              `A ${name.en} has base edges of $${tex(s, u)}$ and slant height $${tex(l, u)}$. Find its lateral area.`,
              `一个${name["zh-CN"]}的底面边长是 $${tex(s, u)}$，斜高是 $${tex(l, u)}$。求它的侧面积。`,
            ),
            answer: lateral,
            unit: `${u}^2`,
            wrong: [p * l, Q.of(s * l, 2), lateral.add(Q.of(s * s))],
            solution: t(
              `**Step 1: the perimeter.** The base has $${n}$ edges of $${s}$:${steps(`P = ${n} \\cdot ${s} = ${p}`)}{{figure 0}}

**Step 2: half the perimeter times the slant height.**${steps(`L = \\frac{1}{2}Pl = \\frac{1}{2} \\cdot ${p} \\cdot ${l} = ${num(lateral)}\\text{ ${u}}^2`)}**Check.** Face by face: each triangle has area $\\frac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(one)}$, and $${n}$ of them make $${n} \\cdot ${num(one)} = ${num(lateral)}$.`,
              `**第一步：周长。** 底面有 $${n}$ 条长 $${s}$ 的边：${steps(`P = ${n} \\cdot ${s} = ${p}`)}{{figure 0}}

**第二步：周长的一半乘斜高。**${steps(`L = \\frac{1}{2}Pl = \\frac{1}{2} \\cdot ${p} \\cdot ${l} = ${num(lateral)}\\text{ ${u}}^2`)}**检验。** 逐个面算：每个三角形面积是 $\\frac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(one)}$，$${n}$ 个共 $${n} \\cdot ${num(one)} = ${num(lateral)}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              [
                ...pyramidNet(n, (2 * l) / s),
                { kind: "segment", a: [1, 0], b: [1, -(2 * l) / s], dashed: true, accent: true },
                { kind: "label", at: [1, -l / s], text: len(l, u), dir: "e" },
                { kind: "label", at: [1, 0.15], text: len(s, u), dir: "n" },
              ],
              `The net of the pyramid: a regular polygon with ${n} edges of ${s} ${u}, and ${n} triangles with slant height ${l} ${u}.`,
              `棱锥的展开图：有 ${n} 条 ${s} ${u} 边的正多边形，以及 ${n} 个斜高 ${l} ${u} 的三角形。`,
            ),
          ],
        };
      },
    },
  ],
};

/** scaleRatio draws a ratio a : b of corresponding lengths in lowest terms, with a < b. */
function scaleRatio(rng: Rng): [number, number] {
  for (;;) {
    const a = rng.int(1, 6);
    const b = rng.int(a + 1, 9);
    if (Q.of(a, b).n === BigInt(a)) return [a, b];
  }
}

/** markPoints lists the points a mark is drawn through, to measure or rescale a drawing. */
function markPoints(m: Mark): Point[] {
  switch (m.kind) {
    case "segment":
    case "side":
    case "ticks":
    case "arrows":
      return [m.a, m.b];
    case "polygon":
    case "shade":
      return [...m.points];
    case "arc":
    case "right":
      return [m.vertex, m.from, m.to];
    default:
      return [m.at];
  }
}

/** scaleMarks enlarges or shrinks a drawing by the factor f about the origin, so that similar solids are drawn to scale. */
function scaleMarks(marks: readonly Mark[], f: number): Mark[] {
  const p = (q: Point): Point => [q[0] * f, q[1] * f];
  return marks.map((m): Mark => {
    switch (m.kind) {
      case "segment":
      case "side":
      case "ticks":
      case "arrows":
        return { ...m, a: p(m.a), b: p(m.b) };
      case "polygon":
        return { ...m, points: m.points.map(p) };
      case "shade":
        return { ...m, points: m.points.map(p), ...(m.holes && { holes: m.holes.map((h) => h.map(p)) }) };
      case "arc":
      case "right":
        return { ...m, vertex: p(m.vertex), from: p(m.from), to: p(m.to) };
      default:
        return { ...m, at: p(m.at) };
    }
  });
}

/** SimilarKind is the kind of solid a pair of similar solids is drawn as. */
type SimilarKind = "cylinder" | "cone" | "box" | "pyramid" | "sphere";

/** similarShape draws one solid of a kind at a fixed shape, with its height (a sphere: its radius) labeled. */
function similarShape(kind: SimilarKind, label: string): Mark[] {
  switch (kind) {
    case "cylinder":
      return cylinderMarks(1, 2.4, { h: label });
    case "cone":
      return coneMarks(1, 2.4, { h: label });
    case "box":
      return boxMarks(3, 2, 2.4, { h: label });
    case "pyramid":
      return pyramidMarks(3, 3, 2.4, { h: label });
    case "sphere":
      return scaleMarks(sphereMarks({ r: label }), 1.2);
  }
}

/** similarPair draws two similar solids side by side, the smaller one at a : b of the larger (at least a third, to stay legible). */
function similarPair(kind: SimilarKind, a: number, b: number, small: string, big: string): Mark[] {
  const first = scaleMarks(similarShape(kind, small), Math.max(a / b, 1 / 3));
  const second = similarShape(kind, big);
  const right = Math.max(...first.flatMap(markPoints).map((q) => q[0]));
  const left = Math.min(...second.flatMap(markPoints).map((q) => q[0]));
  return [...first, ...shift(second, right - left + 1.2)];
}

/** similarKinds names the solids of the problems on similar solids, with the kind each is drawn as. */
const similarKinds: readonly { readonly name: Text; readonly kind: SimilarKind }[] = [
  { name: t("cylinders", "圆柱"), kind: "cylinder" },
  { name: t("cones", "圆锥"), kind: "cone" },
  { name: t("rectangular prisms", "长方体"), kind: "box" },
  { name: t("square pyramids", "四棱锥"), kind: "pyramid" },
  { name: t("spheres", "球"), kind: "sphere" },
];

export const surfaceAreasAndVolumesOfSimilarSolids: TopicDef = {
  id: "surface-areas-and-volumes-of-similar-solids",
  title: t("Surface Areas and Volumes of Similar Solids", "相似立体图形的表面积与体积"),
  summary: t(
    "Use the ratios k, k² and k³ of lengths, areas and volumes of similar solids.",
    "利用相似立体图形长度、面积、体积之比 k、k²、k³ 解题。",
  ),
  prerequisites: ["surface-areas-of-rectangular-solids", "proportions"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 14,
  intro: t(
    `Build a cube with $4$ cm edges out of cubes with $2$ cm edges. Every edge of the big cube is twice as long, so it takes $2$ small cubes along each edge: $2 \\cdot 2 \\cdot 2 = 8$ small cubes in all.

{{figure 0}}

Doubling every length did not double the volume: it multiplied it by $8$, from $2^3 = 8\\text{ cm}^3$ to $4^3 = 64\\text{ cm}^3$. Each face of the big cube is covered by $2 \\cdot 2 = 4$ faces of small cubes, so the surface area was multiplied by $4$, from $6 \\cdot 4 = 24\\text{ cm}^2$ to $6 \\cdot 16 = 96\\text{ cm}^2$. A length is one length, an area is a product of two, and a volume of three, so they grow by $2$, $2^2$ and $2^3$. In this lesson we use this for any two solids of the same shape: we find ratios of their areas and volumes, find a measure of one from the other, and go from one ratio to another.`,
    `用棱长 $2$ 厘米的小正方体搭一个棱长 $4$ 厘米的大正方体。大正方体的每条棱都是小正方体的两倍长，所以每条棱上要放 $2$ 个小正方体，一共 $2 \\cdot 2 \\cdot 2 = 8$ 个。

{{figure 0}}

所有长度扩大到两倍，体积并没有扩大到两倍，而是扩大到 $8$ 倍：从 $2^3 = 8\\text{ cm}^3$ 变成 $4^3 = 64\\text{ cm}^3$。大正方体的每个面由 $2 \\cdot 2 = 4$ 个小正方形面拼成，所以表面积扩大到 $4$ 倍：从 $6 \\cdot 4 = 24\\text{ cm}^2$ 变成 $6 \\cdot 16 = 96\\text{ cm}^2$。长度是一个长度，面积是两个长度的乘积，体积是三个长度的乘积，所以它们分别扩大到 $2$、$2^2$、$2^3$ 倍。这节课我们把这个道理用于任意两个形状相同的立体图形：求面积比和体积比，由一个图形的量求另一个的量，并由一种比求另一种比。`,
  ),
  introFigures: [
    figure(
      [
        ...scaleMarks(boxMarks(1, 1, 1, { l: "2 cm" }), 1.2),
        ...shift([...scaleMarks(cubeGrid(2), 2.4), { kind: "side", a: [0, 0], b: [2.4, 0], text: "4 cm" }], 2.9),
      ],
      "A cube with 2 cm edges beside a cube with 4 cm edges divided into 8 cubes with 2 cm edges.",
      "棱长 2 厘米的正方体，旁边是棱长 4 厘米的正方体，它被分成 8 个棱长 2 厘米的小正方体。",
    ),
  ],
  knowledgePoints: [
    {
      id: "ratios-of-similar-solids",
      title: t("Ratios of areas and volumes", "面积比与体积比"),
      explanation: t(
        `Two solids are **similar** when one is a scaled copy of the other: all corresponding lengths are in the same ratio $k$, the **scale factor**. An area is a product of two lengths, and each of them is multiplied by $k$, so the area is multiplied by $k \\cdot k = k^2$. A volume is a product of three lengths, so it is multiplied by $k^3$:

- surface areas are in the ratio $k^2$;
- volumes are in the ratio $k^3$.

Two similar boxes with corresponding edges in the ratio $2 : 3$ have $k = \\frac{2}{3}$. Their surface areas are in the ratio $\\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$ and their volumes in the ratio $\\left(\\frac{2}{3}\\right)^3 = \\frac{8}{27}$. Think of a $2 \\times 2 \\times 2$ block of unit cubes against a $3 \\times 3 \\times 3$ block: $8$ cubes against $27$.

> **Watch out.** The ratio of the lengths is not the ratio of the volumes: $\\frac{2}{3}$ would say the larger box holds only half as much again, when it holds more than three times as much. Square for areas and cube for volumes, not the other way round. And keep the order asked for: smaller to larger is a fraction less than $1$.`,
        `如果一个立体图形是另一个按比例缩放得到的，这两个立体图形就是**相似**的：所有对应长度之比都等于同一个数 $k$，叫作**相似比**。面积是两个长度的乘积，每个长度都乘以 $k$，所以面积乘以 $k \\cdot k = k^2$。体积是三个长度的乘积，所以乘以 $k^3$：

- 表面积之比是 $k^2$；
- 体积之比是 $k^3$。

两个相似长方体的对应棱长之比是 $2 : 3$，$k = \\frac{2}{3}$。它们的表面积之比是 $\\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$，体积之比是 $\\left(\\frac{2}{3}\\right)^3 = \\frac{8}{27}$。想一想 $2 \\times 2 \\times 2$ 个单位正方体和 $3 \\times 3 \\times 3$ 个单位正方体：$8$ 个对 $27$ 个。

> **注意。** 长度之比不是体积之比：$\\frac{2}{3}$ 会让人以为大长方体只多装一半，其实它装的是小长方体的三倍多。面积要平方，体积要立方，不要弄反。还要按题目要求的顺序：小比大是一个小于 $1$ 的分数。`,
      ),
      generate(rng) {
        const [a, b] = scaleRatio(rng);
        const solid = rng.pick(similarKinds);
        const askVolume = rng.bool();
        const isSphere = solid.kind === "sphere";
        const length = isSphere ? t("radii", "半径") : t("heights", "高");
        const answer = askVolume ? Q.of(a ** 3, b ** 3) : Q.of(a * a, b * b);
        const power = askVolume ? 3 : 2;
        const measure = askVolume ? t("volumes", "体积") : t("surface areas", "表面积");
        const block = askVolume
          ? t(
              `a cube of edge $${a}$ is made of $${a}^3 = ${a ** 3}$ unit cubes and a cube of edge $${b}$ of $${b}^3 = ${b ** 3}$`,
              `棱长 $${a}$ 的正方体由 $${a}^3 = ${a ** 3}$ 个单位正方体组成，棱长 $${b}$ 的由 $${b}^3 = ${b ** 3}$ 个组成`,
            )
          : t(
              `a square of side $${a}$ is made of $${a}^2 = ${a * a}$ unit squares and a square of side $${b}$ of $${b}^2 = ${b * b}$`,
              `边长 $${a}$ 的正方形由 $${a}^2 = ${a * a}$ 个单位正方形组成，边长 $${b}$ 的由 $${b}^2 = ${b * b}$ 个组成`,
            );
        return {
          ...numberProblem({
            prompt: t(
              `Two similar ${solid.name.en} have ${length.en} in the ratio $${a} : ${b}$. Write the ratio of their ${measure.en} (smaller to larger) as a fraction.`,
              `两个相似的${solid.name["zh-CN"]}的${length["zh-CN"]}之比是 $${a} : ${b}$。把它们的${measure["zh-CN"]}之比（小比大）写成分数。`,
            ),
            answer,
            form: "fraction",
            wrong: [
              Q.of(a, b),
              askVolume ? Q.of(a * a, b * b) : Q.of(a ** 3, b ** 3),
              Q.of(b ** (askVolume ? 3 : 2), a ** (askVolume ? 3 : 2)),
            ],
            solution: t(
              `**Step 1: the scale factor.** The solids are similar, so every pair of corresponding lengths is in the ratio of the ${length.en}, smaller to larger:

{{figure 0}}${steps(`k = \\frac{${a}}{${b}}`)}**Step 2: the power.** ${askVolume ? "A volume is a product of three lengths, so volumes are in the ratio $k^3$" : "An area is a product of two lengths, so surface areas are in the ratio $k^2$"}:${steps(`\\left(\\frac{${a}}{${b}}\\right)^{${power}} = \\frac{${a}^{${power}}}{${b}^{${power}}} = ${num(answer)}`)}**Check.** Count unit pieces: ${block.en}, so the ratio is $${a ** power} : ${b ** power}$ again. It is less than $1$, as smaller to larger must be, and less than $\\frac{${a}}{${b}}$, since a fraction below $1$ shrinks when raised to a power.`,
              `**第一步：相似比。** 两个立体图形相似，所以每一对对应长度之比都等于${length["zh-CN"]}之比，小比大：

{{figure 0}}${steps(`k = \\frac{${a}}{${b}}`)}**第二步：乘方。** ${askVolume ? "体积是三个长度的乘积，所以体积之比是 $k^3$" : "面积是两个长度的乘积，所以表面积之比是 $k^2$"}：${steps(`\\left(\\frac{${a}}{${b}}\\right)^{${power}} = \\frac{${a}^{${power}}}{${b}^{${power}}} = ${num(answer)}`)}**检验。** 数单位块：${block["zh-CN"]}，比还是 $${a ** power} : ${b ** power}$。它小于 $1$，小比大理应如此；它也小于 $\\frac{${a}}{${b}}$，因为小于 $1$ 的分数乘方后会变小。`,
            ),
          }),
          solutionFigures: [
            figure(
              similarPair(solid.kind, a, b, `${a}`, `${b}`),
              `Two similar ${solid.name.en} with ${length.en} ${a} and ${b}.`,
              `两个相似的${solid.name["zh-CN"]}，${length["zh-CN"]}分别是 ${a} 和 ${b}。`,
            ),
          ],
        };
      },
    },
    {
      id: "measures-of-a-similar-solid",
      title: t("Measures of a similar solid", "求相似立体图形的量"),
      explanation: t(
        `To find a measure of the other solid, find the scale factor from a pair of corresponding lengths, and multiply by its square for an area or its cube for a volume. Write the factor as new over old: from the solid you know to the one you want.

Two similar boxes have heights $4$ cm and $6$ cm, and the smaller has volume $40\\text{ cm}^3$. Going from the smaller to the larger, $k = \\frac{6}{4} = \\frac{3}{2}$, and the volume is multiplied by $\\left(\\frac{3}{2}\\right)^3 = \\frac{27}{8}$:

$$40 \\cdot \\frac{27}{8} = 135\\text{ cm}^3.$$

The larger box came out larger, as it must.

> **Watch out.** Multiplying by $k$ alone treats a volume or an area like a length: $40 \\cdot \\frac{3}{2} = 60$ is far too small. Use $k^2$ for areas and $k^3$ for volumes, not the other power. And put the solid you are finding on top: $\\frac{4}{6}$ here would shrink the volume when it should grow.`,
        `要求另一个立体图形的量，先由一对对应长度求出相似比，面积就乘以它的平方，体积就乘以它的立方。相似比写成"新比旧"：从已知的图形到要求的图形。

两个相似长方体的高分别是 $4$ 厘米和 $6$ 厘米，较小的体积是 $40\\text{ cm}^3$。从小到大，$k = \\frac{6}{4} = \\frac{3}{2}$，体积乘以 $\\left(\\frac{3}{2}\\right)^3 = \\frac{27}{8}$：

$$40 \\cdot \\frac{27}{8} = 135\\text{ cm}^3.$$

较大的长方体算出来更大，理应如此。

> **注意。** 只乘以 $k$ 就把体积或面积当成了长度：$40 \\cdot \\frac{3}{2} = 60$ 小得太多。面积用 $k^2$，体积用 $k^3$，不要用错次方。要求的图形放在分子上：这里写成 $\\frac{4}{6}$，体积就会变小，而它本该变大。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b] = scaleRatio(rng);
        const m = rng.int(1, 4);
        const [ha, hb] = [a * m, b * m];
        const askVolume = rng.bool();
        const power = askVolume ? 3 : 2;
        const unit = rng.int(1, 5);
        const small = Q.of(a ** power * unit);
        const big = Q.of(b ** power * unit);
        const up = rng.bool();
        const [given, answer] = up ? [small, big] : [big, small];
        const solid = rng.pick(similarKinds.filter((s) => s.kind !== "sphere"));
        const measure = askVolume ? t("volume", "体积") : t("surface area", "表面积");
        const k = up ? Q.of(b, a) : Q.of(a, b);
        const kTex = up ? reduced(hb, ha, k) : reduced(ha, hb, k);
        const kp = k.pow(power);
        const [na, nb] = up ? [a, b] : [b, a];
        const why2 = askVolume
          ? t("A volume is a product of three lengths, so it is multiplied by $k^3$", "体积是三个长度的乘积，所以乘以 $k^3$")
          : t("An area is a product of two lengths, so it is multiplied by $k^2$", "面积是两个长度的乘积，所以乘以 $k^2$");
        return {
          ...numberProblem({
            prompt: t(
              `Two similar ${solid.name.en} have heights $${tex(ha, u)}$ and $${tex(hb, u)}$. The ${up ? "smaller" : "larger"} one has a ${measure.en} of $${tex(given, u, power)}$. Find the ${measure.en} of the ${up ? "larger" : "smaller"} one.`,
              `两个相似的${solid.name["zh-CN"]}的高分别是 $${tex(ha, u)}$ 和 $${tex(hb, u)}$。${up ? "较小" : "较大"}的那个${measure["zh-CN"]}是 $${tex(given, u, power)}$。求${up ? "较大" : "较小"}的那个的${measure["zh-CN"]}。`,
            ),
            answer,
            unit: `${u}^${power}`,
            wrong: [given.mul(k), given.mul(k.pow(askVolume ? 2 : 3)), given.div(kp)],
            solution: t(
              `**Step 1: the scale factor.** Go from the ${up ? "smaller" : "larger"} solid, which we know, to the ${up ? "larger" : "smaller"}, which we want: its height over the known height.

{{figure 0}}${steps(`k = ${kTex}`)}**Step 2: the ${measure.en}.** ${why2.en}:${steps(`${num(given)} \\cdot \\left(${num(k)}\\right)^{${power}} = ${num(given)} \\cdot ${num(kp)} = ${tex(answer, u, power)}`)}**Check.** In lowest terms the heights are in the ratio $${a} : ${b}$, so the ${measure.en}s are in the ratio $${a ** power} : ${b ** power}$. Dividing each ${measure.en} by its own part gives the same: $${num(given)} \\div ${na ** power} = ${unit}$ and $${num(answer)} \\div ${nb ** power} = ${unit}$. The ${up ? "larger" : "smaller"} solid came out ${up ? "larger" : "smaller"}, as it must.`,
              `**第一步：相似比。** 从已知的${up ? "较小" : "较大"}图形到要求的${up ? "较大" : "较小"}图形：要求图形的高比已知图形的高。

{{figure 0}}${steps(`k = ${kTex}`)}**第二步：${measure["zh-CN"]}。** ${why2["zh-CN"]}：${steps(`${num(given)} \\cdot \\left(${num(k)}\\right)^{${power}} = ${num(given)} \\cdot ${num(kp)} = ${tex(answer, u, power)}`)}**检验。** 化简后两个高之比是 $${a} : ${b}$，所以${measure["zh-CN"]}之比是 $${a ** power} : ${b ** power}$。每个${measure["zh-CN"]}除以自己对应的份数，结果相同：$${num(given)} \\div ${na ** power} = ${unit}$，$${num(answer)} \\div ${nb ** power} = ${unit}$。${up ? "较大" : "较小"}的图形算出来${up ? "更大" : "更小"}，理应如此。`,
            ),
          }),
          solutionFigures: [
            figure(
              similarPair(solid.kind, a, b, len(ha, u), len(hb, u)),
              `Two similar ${solid.name.en} with heights ${ha} ${u} and ${hb} ${u}.`,
              `两个相似的${solid.name["zh-CN"]}，高分别是 ${ha} ${u} 和 ${hb} ${u}。`,
            ),
          ],
        };
      },
    },
    {
      id: "from-one-ratio-to-another",
      title: t("From one ratio to another", "由一种比求另一种比"),
      explanation: t(
        `There is no direct step from an area ratio to a volume ratio: go back to the scale factor first. An area ratio is $k^2$, so its square root is $k$; a volume ratio is $k^3$, so its cube root is $k$. Then raise $k$ to the power you need.

Two similar solids have volumes in the ratio $8 : 125$. Then $k^3 = \\frac{8}{125}$, and since $2^3 = 8$ and $5^3 = 125$,

$$k = \\sqrt[3]{\\frac{8}{125}} = \\frac{2}{5}, \\qquad k^2 = \\frac{4}{25}.$$

Their surface areas are in the ratio $4 : 25$. In the same way, surface areas in the ratio $9 : 16$ give $k = \\frac{3}{4}$ and volumes in the ratio $\\frac{27}{64}$.

> **Watch out.** The given ratio is not the scale factor: $\\frac{8}{125}$ is already $k^3$, and squaring it gives nothing meaningful. Take the root first, the square root of an area ratio and the cube root of a volume ratio. And keep smaller to larger: the answer is a fraction less than $1$.`,
        `面积比不能一步变成体积比：先回到相似比。面积比是 $k^2$，开平方得到 $k$；体积比是 $k^3$，开立方得到 $k$。再把 $k$ 乘到需要的次方。

两个相似立体图形的体积之比是 $8 : 125$。那么 $k^3 = \\frac{8}{125}$，因为 $2^3 = 8$、$5^3 = 125$，

$$k = \\sqrt[3]{\\frac{8}{125}} = \\frac{2}{5}, \\qquad k^2 = \\frac{4}{25}.$$

它们的表面积之比是 $4 : 25$。同样，表面积之比是 $9 : 16$ 时，$k = \\frac{3}{4}$，体积之比是 $\\frac{27}{64}$。

> **注意。** 已知的比不是相似比：$\\frac{8}{125}$ 已经是 $k^3$，再平方没有意义。先开方：面积比开平方，体积比开立方。还要保持小比大：答案是小于 $1$ 的分数。`,
      ),
      generate(rng) {
        const [a, b] = scaleRatio(rng);
        const fromVolume = rng.int(0, 2);
        const k = Q.of(a, b);
        if (fromVolume === 2) {
          return numberProblem({
            prompt: t(
              `Two similar solids have surface areas in the ratio $${a * a} : ${b * b}$. Write the ratio of their corresponding lengths as a fraction (smaller to larger).`,
              `两个相似立体图形的表面积之比是 $${a * a} : ${b * b}$。把它们对应长度之比（小比大）写成分数。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.of(a * a, b * b), Q.of(a ** 3, b ** 3), Q.of(b, a)],
            solution: t(
              `**Step 1: what the ratio is.** Surface areas are in the ratio $k^2$, where $k$ is the ratio of lengths:${steps(`k^2 = \\frac{${a * a}}{${b * b}}`)}**Step 2: the square root.** Take the square root of the top and of the bottom, since $${a}^2 = ${a * a}$ and $${b}^2 = ${b * b}$:${steps(`k = \\sqrt{\\frac{${a * a}}{${b * b}}} = \\frac{${a}}{${b}}`)}**Check.** Square back: $\\left(\\frac{${a}}{${b}}\\right)^2 = \\frac{${a * a}}{${b * b}}$, the given ratio. The length ratio $\\frac{${a}}{${b}}$ is closer to $1$ than the area ratio, as it must be, since squaring a fraction below $1$ makes it smaller.`,
              `**第一步：已知的是什么比。** 表面积之比是 $k^2$，$k$ 是长度之比：${steps(`k^2 = \\frac{${a * a}}{${b * b}}`)}**第二步：开平方。** 分子分母分别开平方，因为 $${a}^2 = ${a * a}$，$${b}^2 = ${b * b}$：${steps(`k = \\sqrt{\\frac{${a * a}}{${b * b}}} = \\frac{${a}}{${b}}`)}**检验。** 平方回去：$\\left(\\frac{${a}}{${b}}\\right)^2 = \\frac{${a * a}}{${b * b}}$，正是已知的比。长度之比 $\\frac{${a}}{${b}}$ 比面积之比更接近 $1$，理应如此，因为小于 $1$ 的分数平方后会变小。`,
            ),
          });
        }
        const volumeGiven = fromVolume === 1;
        const answer = volumeGiven ? k.pow(2) : k.pow(3);
        return numberProblem({
          prompt: volumeGiven
            ? t(
                `Two similar solids have volumes in the ratio $${a ** 3} : ${b ** 3}$. Write the ratio of their surface areas as a fraction (smaller to larger).`,
                `两个相似立体图形的体积之比是 $${a ** 3} : ${b ** 3}$。把它们的表面积之比（小比大）写成分数。`,
              )
            : t(
                `Two similar solids have surface areas in the ratio $${a * a} : ${b * b}$. Write the ratio of their volumes as a fraction (smaller to larger).`,
                `两个相似立体图形的表面积之比是 $${a * a} : ${b * b}$。把它们的体积之比（小比大）写成分数。`,
              ),
          answer,
          form: "fraction",
          wrong: [k, volumeGiven ? k.pow(3) : k.pow(2), volumeGiven ? Q.of(b * b, a * a) : Q.of(b ** 3, a ** 3)],
          solution: volumeGiven
            ? t(
                `**Step 1: the scale factor.** Volumes are in the ratio $k^3$, so take the cube root of the top and of the bottom, since $${a}^3 = ${a ** 3}$ and $${b}^3 = ${b ** 3}$:${steps(`k^3 = \\frac{${a ** 3}}{${b ** 3}}`, `k = \\sqrt[3]{\\frac{${a ** 3}}{${b ** 3}}} = \\frac{${a}}{${b}}`)}**Step 2: the surface areas.** Surface areas are in the ratio $k^2$:${steps(`k^2 = \\left(\\frac{${a}}{${b}}\\right)^2 = ${num(answer)}`)}**Check.** Cube back: $\\left(\\frac{${a}}{${b}}\\right)^3 = \\frac{${a ** 3}}{${b ** 3}}$, the given volume ratio. The area ratio $${num(answer)}$ lies between the length ratio $\\frac{${a}}{${b}}$ and the volume ratio, as a square lies between a first power and a cube.`,
                `**第一步：相似比。** 体积之比是 $k^3$，所以分子分母分别开立方，因为 $${a}^3 = ${a ** 3}$，$${b}^3 = ${b ** 3}$：${steps(`k^3 = \\frac{${a ** 3}}{${b ** 3}}`, `k = \\sqrt[3]{\\frac{${a ** 3}}{${b ** 3}}} = \\frac{${a}}{${b}}`)}**第二步：表面积之比。** 表面积之比是 $k^2$：${steps(`k^2 = \\left(\\frac{${a}}{${b}}\\right)^2 = ${num(answer)}`)}**检验。** 立方回去：$\\left(\\frac{${a}}{${b}}\\right)^3 = \\frac{${a ** 3}}{${b ** 3}}$，正是已知的体积比。面积比 $${num(answer)}$ 介于长度比 $\\frac{${a}}{${b}}$ 和体积比之间，正如平方介于一次方和立方之间。`,
              )
            : t(
                `**Step 1: the scale factor.** Surface areas are in the ratio $k^2$, so take the square root of the top and of the bottom, since $${a}^2 = ${a * a}$ and $${b}^2 = ${b * b}$:${steps(`k^2 = \\frac{${a * a}}{${b * b}}`, `k = \\sqrt{\\frac{${a * a}}{${b * b}}} = \\frac{${a}}{${b}}`)}**Step 2: the volumes.** Volumes are in the ratio $k^3$:${steps(`k^3 = \\left(\\frac{${a}}{${b}}\\right)^3 = ${num(answer)}`)}**Check.** Square back: $\\left(\\frac{${a}}{${b}}\\right)^2 = \\frac{${a * a}}{${b * b}}$, the given area ratio. The volume ratio $${num(answer)}$ is smaller than the area ratio, as a cube of a fraction below $1$ is smaller than its square.`,
                `**第一步：相似比。** 表面积之比是 $k^2$，所以分子分母分别开平方，因为 $${a}^2 = ${a * a}$，$${b}^2 = ${b * b}$：${steps(`k^2 = \\frac{${a * a}}{${b * b}}`, `k = \\sqrt{\\frac{${a * a}}{${b * b}}} = \\frac{${a}}{${b}}`)}**第二步：体积之比。** 体积之比是 $k^3$：${steps(`k^3 = \\left(\\frac{${a}}{${b}}\\right)^3 = ${num(answer)}`)}**检验。** 平方回去：$\\left(\\frac{${a}}{${b}}\\right)^2 = \\frac{${a * a}}{${b * b}}$，正是已知的面积比。体积比 $${num(answer)}$ 小于面积比，因为小于 $1$ 的分数，立方比平方更小。`,
              ),
        });
      },
    },
  ],
};

/** RoundSize is a radius r, given either as the radius or as the diameter 2r. */
interface RoundSize {
  readonly r: number;
  readonly byDiameter: boolean;
}

/** roundSize draws a radius, given as a diameter a third of the time. */
const roundSize = (rng: Rng, min: number, max: number): RoundSize => ({ r: rng.int(min, max), byDiameter: rng.bool(0.3) });

/** sizeText says "radius 3 cm" or "diameter 6 cm". */
function sizeText(size: RoundSize, u: Unit): Text {
  return size.byDiameter
    ? t(`diameter $${tex(2 * size.r, u)}$`, `直径为 $${tex(2 * size.r, u)}$`)
    : t(`radius $${tex(size.r, u)}$`, `半径为 $${tex(size.r, u)}$`);
}

/** sizeStep explains how the radius comes from a diameter, or nothing. */
function sizeStep(size: RoundSize): Text {
  return size.byDiameter ? t(`The radius is half the diameter: $r = ${size.r}$. `, `半径是直径的一半：$r = ${size.r}$。`) : t("", "");
}

/** sizeLabels labels the radius or the diameter in a figure. */
const sizeLabels = (size: RoundSize, u: Unit): RoundLabels => (size.byDiameter ? { d: len(2 * size.r, u) } : { r: len(size.r, u) });

/** volumeOf asks for a volume in a unit. */
const volumeIn = (what: Text, u: Unit) =>
  t(
    `Find the volume of the ${what.en}, in $${unitTex(u, 3)}$. ${inPi.en}`,
    `求这个${what["zh-CN"]}的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
  );

export const volumesOfCylinders: TopicDef = {
  id: "volumes-of-cylinders",
  title: t("Volumes of Cylinders", "圆柱的体积"),
  summary: t(
    "Find the volume of a cylinder, πr²h, exactly and approximately, and a missing radius or height.",
    "求圆柱的体积 πr²h 的精确值和近似值，以及未知的半径或高。",
  ),
  prerequisites: ["volumes-of-rectangular-solids", "areas-of-circles"],
  encompasses: [{ topic: "areas-of-circles", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.8.G.C.9"],
  intro: t(
    `A stack of coins is a cylinder. Picture a can with radius $4$ cm and height $10$ cm as a stack of round layers, each $1$ cm thick.

{{figure 0}}

Each layer is a disk of area $\\pi \\cdot 4^2 = 16\\pi\\text{ cm}^2$, $1$ cm thick, so it holds $16\\pi\\text{ cm}^3$. Ten layers hold $16\\pi \\cdot 10 = 160\\pi\\text{ cm}^3$, about $160 \\cdot 3.14 = 502.4\\text{ cm}^3$: half a liter. It is the rule for a box, base area times height, with a circle for the base. In this lesson we find volumes of cylinders exactly in terms of $\\pi$ and as decimals, and find a missing radius or height from the volume.`,
    `一摞硬币就是一个圆柱。把半径 $4$ 厘米、高 $10$ 厘米的罐子想成一层层圆片摞起来，每层厚 $1$ 厘米。

{{figure 0}}

每一层是面积 $\\pi \\cdot 4^2 = 16\\pi\\text{ cm}^2$、厚 $1$ 厘米的圆片，体积 $16\\pi\\text{ cm}^3$。十层共 $16\\pi \\cdot 10 = 160\\pi\\text{ cm}^3$，约为 $160 \\cdot 3.14 = 502.4\\text{ cm}^3$：半升。这就是长方体的规则"底面积乘高"，只是底面换成了圆。这节课我们用含 $\\pi$ 的式子精确地求圆柱的体积，也求它的小数近似值，并由体积求未知的半径或高。`,
  ),
  introFigures: [
    figure(
      cylinderMarks(4, 10, { r: "4 cm", h: "10 cm" }),
      "A can shaped like a cylinder with radius 4 cm and height 10 cm.",
      "半径 4 厘米、高 10 厘米的圆柱形罐子。",
    ),
  ],
  knowledgePoints: [
    {
      id: "volume-in-terms-of-pi",
      figure: solidDrawings["volume-in-terms-of-pi"],
      title: t("Volume in terms of π", "用 π 表示体积"),
      explanation: t(
        `Like a prism, a cylinder is the same all the way up: every slice parallel to the base is a copy of the base. So its volume is base area times height, $V = Bh$. Its base is a circle of radius $r$, with area $\\pi r^2$, so

$$V = \\pi r^2 h.$$

A cylinder with radius $3$ cm and height $5$ cm has base $\\pi \\cdot 3^2 = 9\\pi\\text{ cm}^2$ and volume $9\\pi \\cdot 5 = 45\\pi\\text{ cm}^3$. Leaving the answer in terms of $\\pi$ keeps it exact.

> **Watch out.** Square the radius, not the diameter: with a diameter of $6$, use $r = 3$, or the answer is four times too big. Square it at all: $\\pi r h$ is not an area. And $2\\pi r h$ is the curved side's area, not the volume.`,
        `和棱柱一样，圆柱上下一样粗：每个平行于底面的截面都和底面一样。所以它的体积是底面积乘高，$V = Bh$。它的底面是半径为 $r$ 的圆，面积是 $\\pi r^2$，所以

$$V = \\pi r^2 h.$$

半径 $3$ 厘米、高 $5$ 厘米的圆柱，底面积 $\\pi \\cdot 3^2 = 9\\pi\\text{ cm}^2$，体积 $9\\pi \\cdot 5 = 45\\pi\\text{ cm}^3$。用含 $\\pi$ 的式子表示可以保持答案精确。

> **注意。** 平方的是半径，不是直径：直径是 $6$ 时用 $r = 3$，否则答案大了四倍。半径一定要平方：$\\pi r h$ 不是面积。$2\\pi r h$ 是侧面的面积，不是体积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 10);
        const { r } = size;
        const h = rng.int(2, 15);
        const coef = r * r * h;
        const box = 4 * r * r * h;
        const approx = dec(Q.parse("3.14").mul(Q.of(coef)));
        const radiusStep = size.byDiameter
          ? t(
              `The diameter is $${2 * r}$, and the formula needs the radius, half of it: $r = \\frac{${2 * r}}{2} = ${r}$.`,
              `已知直径是 $${2 * r}$，公式要用半径，即它的一半：$r = \\frac{${2 * r}}{2} = ${r}$。`,
            )
          : t(`The radius is given: $r = ${r}$.`, `已知半径：$r = ${r}$。`);
        return {
          ...piProblem({
            prompt: volumeIn(t("cylinder", "圆柱"), u),
            coef,
            wrong: [2 * r * h, r * h, 4 * r * r * h, 2 * r * r * h],
            solution: t(
              `**Step 1: the radius.** ${radiusStep.en}

**Step 2: the base.** The base is a circle:${steps(`B = \\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 3: the volume.** Base times height:${steps(`V = Bh = ${piTex(r * r)} \\cdot ${h} = ${piTex(coef)}\\text{ ${u}}^3`)}**Check.** The cylinder fits inside a box $${2 * r} \\times ${2 * r} \\times ${h}$ with volume $${box}$. It fills $\\frac{\\pi}{4} \\approx 0.79$ of it: $${piTex(coef)} \\approx ${approx}$, a bit over three quarters of $${box}$. And three lengths in ${unitWord(u)} multiply to cubic ${unitWord(u)}.`,
              `**第一步：半径。** ${radiusStep["zh-CN"]}

**第二步：底面积。** 底面是圆：${steps(`B = \\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第三步：体积。** 底面积乘高：${steps(`V = Bh = ${piTex(r * r)} \\cdot ${h} = ${piTex(coef)}\\text{ ${u}}^3`)}**检验。** 这个圆柱恰好放进 $${2 * r} \\times ${2 * r} \\times ${h}$ 的长方体，长方体体积 $${box}$。圆柱占它的 $\\frac{\\pi}{4} \\approx 0.79$：$${piTex(coef)} \\approx ${approx}$，比 $${box}$ 的四分之三多一点。三个以 ${u} 为单位的长度相乘，单位是立方 ${u}。`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder with ${sizeText(size, u)
              .en.replace(/\$/g, "")
              .replace(/\\text\{ ?([^}]*)\}/g, " $1")} and height ${h} ${u}.`,
            `一个${sizeText(size, u)
              ["zh-CN"].replace(/\$/g, "")
              .replace(/\\text\{ ?([^}]*)\}/g, " $1")}、高 ${h} ${u} 的圆柱。`,
          ),
        };
      },
    },
    {
      id: "approximating-with-pi",
      figure: geometryDrawings2["volumes-of-cylinders#approximating-with-pi"],
      title: t("Approximating with 3.14", "用 3.14 近似计算"),
      explanation: t(
        `For a decimal answer, work the volume out in terms of $\\pi$ first, and replace $\\pi$ by an approximation such as $3.14$ only at the end. Rounding early, or rounding the radius, carries the error through every later step.

A cylinder with radius $2$ m and height $10$ m has $V = \\pi \\cdot 2^2 \\cdot 10 = 40\\pi\\text{ m}^3$, and

$$40\\pi \\approx 40 \\cdot 3.14 = 125.6\\text{ m}^3.$$

Since $\\pi$ is between $3$ and $4$, the answer must lie between $3 \\cdot 40 = 120$ and $4 \\cdot 40 = 160$.

> **Watch out.** Volume is $\\pi r^2 h$, not $2\\pi r h$, which is the area of the curved side. Square the radius, not the diameter, and do not drop $\\pi$: $40$ alone is the volume of a box, not of the cylinder.`,
        `需要小数答案时，先用含 $\\pi$ 的式子算出体积，最后才用 $3.14$ 之类的近似值代替 $\\pi$。过早取近似，或者把半径取近似，误差会带到后面每一步。

半径 $2$ 米、高 $10$ 米的圆柱，$V = \\pi \\cdot 2^2 \\cdot 10 = 40\\pi\\text{ m}^3$，

$$40\\pi \\approx 40 \\cdot 3.14 = 125.6\\text{ m}^3.$$

因为 $\\pi$ 在 $3$ 和 $4$ 之间，答案一定在 $3 \\cdot 40 = 120$ 和 $4 \\cdot 40 = 160$ 之间。

> **注意。** 体积是 $\\pi r^2 h$，不是 $2\\pi r h$，后者是侧面的面积。平方的是半径，不是直径；也不要丢掉 $\\pi$：只写 $40$ 是长方体的体积，不是圆柱的。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const pi = Q.parse("3.14");
        const coef = r * r * h;
        const v = pi.mul(Q.of(coef));
        return {
          ...numberProblem({
            prompt: t(
              `A cylinder has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find its volume using $\\pi \\approx 3.14$.`,
              `一个圆柱的半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。取 $\\pi \\approx 3.14$，求它的体积。`,
            ),
            answer: v,
            form: "decimal",
            unit: `${u}^3`,
            mistakes: [
              why(
                pi.mul(Q.of(2 * r * h)),
                "That uses $2\\pi r h$, the area of the curved side. Volume is the area of the base times the height, $\\pi r^2 h$.",
                "这是 $2\\pi r h$，即侧面积。体积是底面积乘高，$\\pi r^2 h$。",
              ),
              why(
                pi.mul(Q.of(r * h)),
                "You did not square the radius. The base is a circle of area $\\pi r^2$.",
                "你没有把半径平方。底面是面积为 $\\pi r^2$ 的圆。",
              ),
              why(
                Q.of(r * r * h),
                "You left out $\\pi$. The base is a circle, so its area is $\\pi r^2$.",
                "你漏掉了 $\\pi$。底面是圆，面积是 $\\pi r^2$。",
              ),
              why(
                pi.mul(Q.of(4 * r * r * h)),
                "That squares the diameter. Square the radius instead.",
                "这是把直径平方了。应该把半径平方。",
              ),
            ],
            solution: t(
              `**Step 1: the exact volume.** Base area times height, keeping $\\pi$:

{{figure 0}}${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(coef)}`)}**Step 2: the approximation.** Only now replace $\\pi$ by $3.14$:${steps(`${piTex(coef)} \\approx ${coef} \\cdot 3.14 = ${dec(v)}\\text{ ${u}}^3`)}**Check.** Since $3 < \\pi < 4$, the volume lies between $3 \\cdot ${coef} = ${3 * coef}$ and $4 \\cdot ${coef} = ${4 * coef}$, the volume of the box $${2 * r} \\times ${2 * r} \\times ${h}$ around the cylinder. $${dec(v)}$ is in that range, close to its lower end, as $3.14$ is close to $3$.`,
              `**第一步：精确的体积。** 底面积乘高，保留 $\\pi$：

{{figure 0}}${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(coef)}`)}**第二步：近似值。** 这时才用 $3.14$ 代替 $\\pi$：${steps(`${piTex(coef)} \\approx ${coef} \\cdot 3.14 = ${dec(v)}\\text{ ${u}}^3`)}**检验。** 因为 $3 < \\pi < 4$，体积在 $3 \\cdot ${coef} = ${3 * coef}$ 和 $4 \\cdot ${coef} = ${4 * coef}$ 之间，后者是圆柱外面 $${2 * r} \\times ${2 * r} \\times ${h}$ 长方体的体积。$${dec(v)}$ 在这个范围内，靠近下端，因为 $3.14$ 接近 $3$。`,
            ),
          }),
          solutionFigures: [
            figure(
              cylinderMarks(r, h, { r: len(r, u), h: len(h, u) }),
              `A cylinder with radius ${r} ${u} and height ${h} ${u}.`,
              `半径 ${r} ${u}、高 ${h} ${u} 的圆柱。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-radius-or-height",
      figure: solidDrawings["missing-radius-or-height"],
      title: t("A missing radius or height", "求未知的半径或高"),
      explanation: t(
        `The formula $V = \\pi r^2 h$ links four quantities, so knowing the volume and one length gives the other. Substitute what you know, divide both sides by $\\pi$, and undo what is left.

A cylinder with volume $72\\pi\\text{ cm}^3$ and radius $3$ cm has $\\pi \\cdot 9 \\cdot h = 72\\pi$, so $9h = 72$ and $h = 8$ cm. A cylinder with volume $80\\pi\\text{ cm}^3$ and height $5$ cm has $\\pi r^2 \\cdot 5 = 80\\pi$, so $r^2 = 16$ and $r = 4$ cm: the last step is a square root.

> **Watch out.** For the height, divide by $r^2$, not by $r$ or $2r$. For the radius, $\\frac{V}{\\pi h}$ is $r^2$, not $r$: take its square root. And the radius is not the diameter: do not double it at the end.`,
        `公式 $V = \\pi r^2 h$ 联系着四个量，所以知道体积和一个长度，就能求出另一个。代入已知量，两边同除以 $\\pi$，再解剩下的方程。

体积 $72\\pi\\text{ cm}^3$、半径 $3$ 厘米的圆柱满足 $\\pi \\cdot 9 \\cdot h = 72\\pi$，所以 $9h = 72$，$h = 8$ 厘米。体积 $80\\pi\\text{ cm}^3$、高 $5$ 厘米的圆柱满足 $\\pi r^2 \\cdot 5 = 80\\pi$，所以 $r^2 = 16$，$r = 4$ 厘米：最后一步是开平方。

> **注意。** 求高时要除以 $r^2$，不是 $r$ 或 $2r$。求半径时，$\\frac{V}{\\pi h}$ 是 $r^2$，不是 $r$：还要开平方。半径不是直径：最后不要乘以 $2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const v = r * r * h;
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `A cylinder has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a radius of $${tex(r, u)}$. Find its height.`,
                `一个圆柱的体积是 $${piTex(v)}\\text{ ${u}}^3$，半径是 $${tex(r, u)}$。求它的高。`,
              ),
              answer: h,
              unit: u,
              wrong: [Q.of(v, r), Q.of(v, 2 * r), v],
              solution: t(
                `**Step 1: substitute.** Put the volume and the radius into $V = \\pi r^2 h$:

{{figure 0}}${steps(`\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`)}**Step 2: solve for $h$.** Divide both sides by $\\pi$, then by $${r}^2 = ${r * r}$:${steps(...(r === 1 ? [] : [`${r * r}h = ${v}`]), r === 1 ? `h = ${tex(h, u)}` : `h = \\frac{${v}}{${r * r}} = ${tex(h, u)}`)}**Check.** Put it back: $\\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(v)}$, the given volume. The base has area $${piTex(r * r)}$, and $${h}$ layers of it, each $1$ ${unitWord(u)} thick, make $${piTex(v)}$.`,
                `**第一步：代入。** 把体积和半径代入 $V = \\pi r^2 h$：

{{figure 0}}${steps(`\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`)}**第二步：解出 $h$。** 两边同除以 $\\pi$，再除以 $${r}^2 = ${r * r}$：${steps(...(r === 1 ? [] : [`${r * r}h = ${v}`]), r === 1 ? `h = ${tex(h, u)}` : `h = \\frac{${v}}{${r * r}} = ${tex(h, u)}`)}**检验。** 代回去：$\\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(v)}$，正是已知的体积。底面积是 $${piTex(r * r)}$，$${h}$ 层厚 $1$ ${u} 的圆片合起来是 $${piTex(v)}$。`,
              ),
            }),
            solutionFigures: [
              figure(
                cylinderMarks(r, h, { r: len(r, u), h: "h" }),
                `A cylinder with radius ${r} ${u} and unknown height h.`,
                `半径 ${r} ${u}、高 h 未知的圆柱。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `A cylinder has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. Find its radius.`,
              `一个圆柱的体积是 $${piTex(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。求它的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [r * r, Q.of(v, h * 2), 2 * r],
            solution: t(
              `**Step 1: substitute.** Put the volume and the height into $V = \\pi r^2 h$:

{{figure 0}}${steps(`\\pi r^2 \\cdot ${h} = ${piTex(v)}`)}**Step 2: solve for $r^2$.** Divide both sides by $\\pi$, then by $${h}$:${steps(`r^2 = \\frac{${v}}{${h}} = ${r * r}`)}**Step 3: the square root.** The radius is positive:${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**Check.** Put it back: $\\pi \\cdot ${r}^2 \\cdot ${h} = \\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(v)}$, the given volume. And $${r * r}$ is the area of the base divided by $\\pi$, not a length: the radius is its square root.`,
              `**第一步：代入。** 把体积和高代入 $V = \\pi r^2 h$：

{{figure 0}}${steps(`\\pi r^2 \\cdot ${h} = ${piTex(v)}`)}**第二步：解出 $r^2$。** 两边同除以 $\\pi$，再除以 $${h}$：${steps(`r^2 = \\frac{${v}}{${h}} = ${r * r}`)}**第三步：开平方。** 半径是正数：${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**检验。** 代回去：$\\pi \\cdot ${r}^2 \\cdot ${h} = \\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(v)}$，正是已知的体积。$${r * r}$ 是底面积除以 $\\pi$，不是长度：半径是它的平方根。`,
            ),
          }),
          solutionFigures: [
            figure(
              cylinderMarks(r, h, { r: "r", h: len(h, u) }),
              `A cylinder with height ${h} ${u} and unknown radius r.`,
              `高 ${h} ${u}、半径 r 未知的圆柱。`,
            ),
          ],
        };
      },
    },
  ],
};

/** cylinderNet draws the net of a cylinder: the side unrolled into a 2πr by h rectangle, with 0, 1 (below) or 2 circular bases at its left end. */
function cylinderNet(R: number, H: number, bases: 0 | 1 | 2, labels: { r?: string; h?: string; w?: string }): Mark[] {
  const [W, h] = fitBox([2 * Math.PI * R, H]) as [number, number];
  const r = W / (2 * Math.PI);
  const marks: Mark[] = [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [W, 0],
        [W, h],
        [0, h],
      ],
    },
  ];
  const circles: Point[] = [];
  if (bases >= 1) circles.push([r + 0.1 * W, -r]);
  if (bases === 2) circles.push([r + 0.1 * W, h + r]);
  for (const c of circles) marks.push(ellipse(c[0], c[1], r, r));
  const top = circles[circles.length - 1];
  if (labels.r && top) {
    marks.push({ kind: "segment", a: top, b: [top[0] + r, top[1]], accent: true }, { kind: "dot", at: top });
    marks.push({ kind: "label", at: [top[0] + r / 2, top[1]], text: labels.r, dir: "n" });
  }
  if (labels.w) {
    marks.push({ kind: "segment", a: [0, h * 0.12], b: [W, h * 0.12], accent: true, dashed: true });
    marks.push({ kind: "label", at: [W * 0.62, h * 0.12], text: labels.w, dir: "n" });
  }
  if (labels.h) marks.push({ kind: "side", a: [W, 0], b: [W, h], text: labels.h });
  return marks;
}

/** circumferenceLabel writes the width of the unrolled side, 2π times the radius, for a net. */
const circumferenceLabel = (r: number, u: Unit): string => `2π · ${r} = ${2 * r}π ${u}`;

export const surfaceAreasOfCylinders: TopicDef = {
  id: "surface-areas-of-cylinders",
  title: t("Surface Areas of Cylinders", "圆柱的表面积"),
  summary: t(
    "Find the lateral and total surface area of a cylinder, open cylinders, and a missing height.",
    "求圆柱的侧面积和表面积、无盖圆柱的面积，以及未知的高。",
  ),
  prerequisites: ["volumes-of-cylinders", "finding-surface-areas-using-nets"],
  encompasses: [
    { topic: "the-circumference-of-a-circle", weight: 0.4 },
    { topic: "areas-of-circles", weight: 0.3 },
  ],
  xp: 12,
  intro: t(
    `How much tin does it take to make a can with radius $5$ cm and height $12$ cm, lids included? Peel off the label and lay it flat: it is a rectangle. Its height is the can's height, $12$ cm, and its width wrapped once around the can, so it is the circumference $2\\pi \\cdot 5 = 10\\pi$ cm, about $31.4$ cm.

{{figure 0}}

The side is $10\\pi \\cdot 12 = 120\\pi\\text{ cm}^2$. Each lid is a circle of area $\\pi \\cdot 5^2 = 25\\pi\\text{ cm}^2$, and there are two. In all, $120\\pi + 50\\pi = 170\\pi\\text{ cm}^2$, about $533.8\\text{ cm}^2$. In this lesson we find the lateral area of a cylinder, the side alone, its total surface area, the area of a cylinder open at one end, and a missing height from the area.`,
    `做一个半径 $5$ 厘米、高 $12$ 厘米、带上下盖的罐头需要多少铁皮？把罐头上的标签撕下来摊平：它是一个长方形。它的高就是罐头的高 $12$ 厘米，宽恰好绕罐头一圈，就是周长 $2\\pi \\cdot 5 = 10\\pi$ 厘米，约 $31.4$ 厘米。

{{figure 0}}

侧面是 $10\\pi \\cdot 12 = 120\\pi\\text{ cm}^2$。每个盖子是面积 $\\pi \\cdot 5^2 = 25\\pi\\text{ cm}^2$ 的圆，共两个。合计 $120\\pi + 50\\pi = 170\\pi\\text{ cm}^2$，约 $533.8\\text{ cm}^2$。这节课我们求圆柱的侧面积（只算侧面）、表面积、一端开口的圆柱的面积，并由面积求未知的高。`,
  ),
  introFigures: [
    figure(
      [
        ...cylinderMarks(5, 12, { r: "5 cm", h: "12 cm" }),
        ...shift(cylinderNet(5, 12, 2, { r: "5 cm", h: "12 cm", w: "10π cm" }), 10, 0.5),
      ],
      "A can with radius 5 cm and height 12 cm, and its net: a rectangle 12 cm high and 10π cm wide, with two circles of radius 5 cm.",
      "半径 5 厘米、高 12 厘米的罐头，以及它的展开图：一个高 12 厘米、宽 10π 厘米的长方形和两个半径 5 厘米的圆。",
    ),
  ],
  knowledgePoints: [
    {
      id: "lateral-area-of-a-cylinder",
      figure: solidDrawings["lateral-area-of-a-cylinder"],
      title: t("Lateral area", "侧面积"),
      explanation: t(
        `Cut the curved side of a cylinder straight down and unroll it: it becomes a rectangle. Its height is the height $h$ of the cylinder, and its width went once around the base, so it is the circumference $2\\pi r$. So the **lateral area**, the area of the side alone, is

$$L = 2\\pi r h.$$

A cylinder with radius $4$ cm and height $7$ cm unrolls into a rectangle $2\\pi \\cdot 4 = 8\\pi$ cm wide and $7$ cm high, so $L = 8\\pi \\cdot 7 = 56\\pi\\text{ cm}^2$.

> **Watch out.** The width is $2\\pi r$, not $\\pi r$: keep the $2$. With a diameter given, $2\\pi r = \\pi d$; putting the diameter in for $r$ doubles the answer. Leave out the bases, and do not confuse the side with the volume $\\pi r^2 h$.`,
        `把圆柱的侧面沿一条直线剪开并展平，就得到一个长方形。它的高是圆柱的高 $h$，宽恰好绕底面一圈，就是周长 $2\\pi r$。所以**侧面积**（只算侧面）是

$$L = 2\\pi r h.$$

半径 $4$ 厘米、高 $7$ 厘米的圆柱，展开成宽 $2\\pi \\cdot 4 = 8\\pi$ 厘米、高 $7$ 厘米的长方形，所以 $L = 8\\pi \\cdot 7 = 56\\pi\\text{ cm}^2$。

> **注意。** 宽是 $2\\pi r$，不是 $\\pi r$：不要丢掉 $2$。给的是直径时，$2\\pi r = \\pi d$；把直径当 $r$ 代入，答案就大了一倍。不要算上底面，也不要和体积 $\\pi r^2 h$ 混淆。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const h = rng.int(2, 15);
        const coef = 2 * r * h;
        return {
          ...piProblem({
            prompt: t(
              `Find the lateral area of the cylinder, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆柱的侧面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef,
            mistakes: [
              why(
                r * h,
                "You left out the $2$: the side unrolls into a rectangle as wide as the circumference.",
                "你漏掉了 $2$：侧面展开后的矩形，宽等于底面周长。",
              ),
              why(r * r * h, "That is the volume. The lateral area is only the curved side.", "这是体积。侧面积只算弯曲的侧面。"),
              why(
                2 * r * h + 2 * r * r,
                "That includes the two bases. The lateral area is only the curved side.",
                "这包含了两个底面。侧面积只算弯曲的侧面。",
              ),
              why(4 * r * h, "You used the diameter where the radius belongs.", "你把直径当成半径代入了。"),
            ],
            solution: t(
              `**Step 1: unroll the side.** ${sizeStep(size).en}The side unrolls into a rectangle $${h}$ high, as wide as the circumference of the base:

{{figure 0}}${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**Step 2: the area of the rectangle.** Width times height:${steps(`L = ${piTex(2 * r)} \\cdot ${h} = ${piTex(coef)}\\text{ ${u}}^2`)}**Check.** The box around the cylinder, $${2 * r} \\times ${2 * r} \\times ${h}$, has four sides of total area $4 \\cdot ${2 * r} \\cdot ${h} = ${8 * r * h}$. The curved side runs around a circle instead of a square, and the circumference is $\\frac{\\pi}{4}$ of the square's perimeter: $\\frac{\\pi}{4} \\cdot ${8 * r * h} = ${piTex(coef)}$, the same.`,
              `**第一步：展开侧面。** ${sizeStep(size)["zh-CN"]}侧面展开成一个高 $${h}$ 的长方形，宽等于底面周长：

{{figure 0}}${steps(`2\\pi r = 2\\pi \\cdot ${r} = ${piTex(2 * r)}`)}**第二步：长方形的面积。** 宽乘高：${steps(`L = ${piTex(2 * r)} \\cdot ${h} = ${piTex(coef)}\\text{ ${u}}^2`)}**检验。** 圆柱外面 $${2 * r} \\times ${2 * r} \\times ${h}$ 的长方体，四个侧面共 $4 \\cdot ${2 * r} \\cdot ${h} = ${8 * r * h}$。圆柱的侧面绕的是圆而不是正方形，圆的周长是正方形周长的 $\\frac{\\pi}{4}$：$\\frac{\\pi}{4} \\cdot ${8 * r * h} = ${piTex(coef)}$，结果相同。`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and height ${h} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、高 ${h} ${u} 的圆柱。`,
          ),
          solutionFigures: [
            figure(
              cylinderNet(r, h, 0, { h: len(h, u), w: circumferenceLabel(r, u) }),
              `The side unrolled: a rectangle ${h} ${u} high and ${2 * r}π ${u} wide.`,
              `展开的侧面：高 ${h} ${u}、宽 ${2 * r}π ${u} 的长方形。`,
            ),
          ],
        };
      },
    },
    {
      id: "total-surface-area-of-a-cylinder",
      figure: solidDrawings["total-surface-area-of-a-cylinder"],
      title: t("Total surface area", "表面积"),
      explanation: t(
        `The net of a closed cylinder is two circles and a rectangle: the two bases, each $\\pi r^2$, and the unrolled side, $2\\pi r h$. Adding them gives the surface area

$$S = 2\\pi r^2 + 2\\pi r h.$$

A cylinder with radius $3$ cm and height $5$ cm has bases $2 \\cdot \\pi \\cdot 3^2 = 18\\pi\\text{ cm}^2$ and side $2\\pi \\cdot 3 \\cdot 5 = 30\\pi\\text{ cm}^2$, so $S = 18\\pi + 30\\pi = 48\\pi\\text{ cm}^2$.

> **Watch out.** Count both bases, not one, and do not stop at the side: the side alone is the lateral area. Halve a given diameter before squaring. And $\\pi r^2 h$ is the volume, not an area.`,
        `封闭圆柱的展开图是两个圆和一个长方形：两个底面，每个 $\\pi r^2$，以及展开的侧面 $2\\pi r h$。把它们加起来得到表面积

$$S = 2\\pi r^2 + 2\\pi r h.$$

半径 $3$ 厘米、高 $5$ 厘米的圆柱，两个底面 $2 \\cdot \\pi \\cdot 3^2 = 18\\pi\\text{ cm}^2$，侧面 $2\\pi \\cdot 3 \\cdot 5 = 30\\pi\\text{ cm}^2$，所以 $S = 18\\pi + 30\\pi = 48\\pi\\text{ cm}^2$。

> **注意。** 两个底面都要算，不是一个；也不要只算侧面：只算侧面是侧面积。给的是直径时，先减半再平方。$\\pi r^2 h$ 是体积，不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const h = rng.int(2, 15);
        const s = 2 * r * r + 2 * r * h;
        const box = 8 * r * r + 8 * r * h;
        return {
          ...piProblem({
            prompt: t(
              `Find the surface area of the cylinder, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆柱的表面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: [2 * r * r + r * h],
            mistakes: [
              why(2 * r * h, "That is only the curved side. Add the two bases.", "这只是弯曲的侧面，还要加上两个底面。"),
              why(r * r + 2 * r * h, "That counts only one base. A closed cylinder has two.", "这只算了一个底面。封闭的圆柱有两个底面。"),
              why(r * r * h, "That is the volume, not the surface area.", "这是体积，不是表面积。"),
            ],
            solution: t(
              `**Step 1: the two bases.** ${sizeStep(size).en}Each base is a circle of area $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$:

{{figure 0}}${steps(`2\\pi r^2 = 2 \\cdot ${piTex(r * r)} = ${piTex(2 * r * r)}`)}**Step 2: the side.** It unrolls into a rectangle $${piTex(2 * r)}$ wide and $${h}$ high:${steps(`2\\pi r h = ${piTex(2 * r)} \\cdot ${h} = ${piTex(2 * r * h)}`)}**Step 3: add.**${steps(`S = ${piTex(2 * r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}\\text{ ${u}}^2`)}**Check.** The box around the cylinder, $${2 * r} \\times ${2 * r} \\times ${h}$, has surface area $2 \\cdot ${2 * r}^2 + 4 \\cdot ${2 * r} \\cdot ${h} = ${box}$. Every face of the cylinder is the matching face of the box with a circle in place of a square, and a circle has $\\frac{\\pi}{4}$ of the area and of the perimeter of the square around it: $\\frac{\\pi}{4} \\cdot ${box} = ${piTex(s)}$, the same.`,
              `**第一步：两个底面。** ${sizeStep(size)["zh-CN"]}每个底面是面积 $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$ 的圆：

{{figure 0}}${steps(`2\\pi r^2 = 2 \\cdot ${piTex(r * r)} = ${piTex(2 * r * r)}`)}**第二步：侧面。** 它展开成宽 $${piTex(2 * r)}$、高 $${h}$ 的长方形：${steps(`2\\pi r h = ${piTex(2 * r)} \\cdot ${h} = ${piTex(2 * r * h)}`)}**第三步：相加。**${steps(`S = ${piTex(2 * r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}\\text{ ${u}}^2`)}**检验。** 圆柱外面 $${2 * r} \\times ${2 * r} \\times ${h}$ 的长方体，表面积是 $2 \\cdot ${2 * r}^2 + 4 \\cdot ${2 * r} \\cdot ${h} = ${box}$。圆柱的每一部分都对应长方体的一部分，只是正方形换成了圆；圆的面积和周长都是外切正方形的 $\\frac{\\pi}{4}$：$\\frac{\\pi}{4} \\cdot ${box} = ${piTex(s)}$，结果相同。`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and height ${h} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、高 ${h} ${u} 的圆柱。`,
          ),
          solutionFigures: [
            figure(
              cylinderNet(r, h, 2, { r: len(r, u), h: len(h, u), w: circumferenceLabel(r, u) }),
              `The net of the cylinder: two circles of radius ${r} ${u} and a rectangle ${h} ${u} high and ${2 * r}π ${u} wide.`,
              `圆柱的展开图：两个半径 ${r} ${u} 的圆和一个高 ${h} ${u}、宽 ${2 * r}π ${u} 的长方形。`,
            ),
          ],
        };
      },
    },
    {
      id: "open-cylinders-and-missing-heights",
      figure: geometryDrawings2["surface-areas-of-cylinders#open-cylinders-and-missing-heights"],
      title: t("Open cylinders and missing heights", "无盖圆柱与未知的高"),
      explanation: t(
        `Count only the faces that are there. A cylinder open at the top, like a cup, has one base and the side: $S = \\pi r^2 + 2\\pi r h$. A cup with radius $3$ cm and height $10$ cm has $9\\pi + 60\\pi = 69\\pi\\text{ cm}^2$.

To find a missing height, substitute what you know, divide by $\\pi$, take away the bases, and divide by what multiplies $h$. A closed cylinder with radius $2$ cm and surface area $40\\pi\\text{ cm}^2$ has $8\\pi + 4\\pi h = 40\\pi$, so $4h = 32$ and $h = 8$ cm.

> **Watch out.** A cup has one base, not two, and it does have a bottom: the side alone is too little. For a missing height, subtract both bases of a closed cylinder before dividing; dividing the whole area by $2\\pi r$ leaves the bases in the height.`,
        `只算实际存在的面。上面开口的圆柱（比如杯子）有一个底面和侧面：$S = \\pi r^2 + 2\\pi r h$。半径 $3$ 厘米、高 $10$ 厘米的杯子，面积是 $9\\pi + 60\\pi = 69\\pi\\text{ cm}^2$。

求未知的高时，代入已知量，两边除以 $\\pi$，减去底面，再除以 $h$ 的系数。半径 $2$ 厘米、表面积 $40\\pi\\text{ cm}^2$ 的封闭圆柱满足 $8\\pi + 4\\pi h = 40\\pi$，所以 $4h = 32$，$h = 8$ 厘米。

> **注意。** 杯子只有一个底面，不是两个；但它有杯底：只算侧面就少了。求封闭圆柱的高时，要先减去两个底面再除；把整个面积除以 $2\\pi r$，底面就被算进了高里。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        if (rng.bool()) {
          const s = r * r + 2 * r * h;
          const box = 4 * r * r + 8 * r * h;
          return {
            ...piProblem({
              prompt: t(
                `A cylindrical cup with no lid has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find the area of its outside surface, in $${unitTex(u, 2)}$. ${inPi.en}`,
                `一个无盖的圆柱形杯子半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。求它外表面的面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
              ),
              coef: s,
              wrong: [2 * r * r + 2 * r * h, 2 * r * h, r * r + r * h],
              solution: t(
                `**Step 1: the faces.** The cup has a bottom and a side, but no top. Its net is one circle and a rectangle:

{{figure 0}}

**Step 2: each face.** The bottom is a circle, and the side unrolls into a rectangle $${piTex(2 * r)}$ wide and $${h}$ high:${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}, \\qquad ${piTex(2 * r)} \\cdot ${h} = ${piTex(2 * r * h)}`)}**Step 3: add.**${steps(`S = ${piTex(r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}\\text{ ${u}}^2`)}**Check.** An open box $${2 * r} \\times ${2 * r} \\times ${h}$ around the cup has a bottom of $${4 * r * r}$ and four sides of $${8 * r * h}$, $${box}$ in all. Circle for square, the cup has $\\frac{\\pi}{4}$ of that: $\\frac{\\pi}{4} \\cdot ${box} = ${piTex(s)}$, the same.`,
                `**第一步：有哪些面。** 杯子有底和侧面，没有盖。它的展开图是一个圆和一个长方形：

{{figure 0}}

**第二步：每个面。** 杯底是圆，侧面展开成宽 $${piTex(2 * r)}$、高 $${h}$ 的长方形：${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}, \\qquad ${piTex(2 * r)} \\cdot ${h} = ${piTex(2 * r * h)}`)}**第三步：相加。**${steps(`S = ${piTex(r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}\\text{ ${u}}^2`)}**检验。** 杯子外面 $${2 * r} \\times ${2 * r} \\times ${h}$ 的无盖长方体，底面 $${4 * r * r}$，四个侧面 $${8 * r * h}$，共 $${box}$。正方形换成圆，杯子的面积是它的 $\\frac{\\pi}{4}$：$\\frac{\\pi}{4} \\cdot ${box} = ${piTex(s)}$，结果相同。`,
              ),
            }),
            solutionFigures: [
              figure(
                cylinderNet(r, h, 1, { r: len(r, u), h: len(h, u), w: circumferenceLabel(r, u) }),
                `The net of the cup: one circle of radius ${r} ${u} and a rectangle ${h} ${u} high and ${2 * r}π ${u} wide.`,
                `杯子的展开图：一个半径 ${r} ${u} 的圆和一个高 ${h} ${u}、宽 ${2 * r}π ${u} 的长方形。`,
              ),
            ],
          };
        }
        const s = 2 * r * r + 2 * r * h;
        return {
          ...numberProblem({
            prompt: t(
              `A cylinder has radius $${tex(r, u)}$ and surface area $${piTex(s)}\\text{ ${u}}^2$. Find its height.`,
              `一个圆柱的半径是 $${tex(r, u)}$，表面积是 $${piTex(s)}\\text{ ${u}}^2$。求它的高。`,
            ),
            answer: h,
            unit: u,
            wrong: [Q.of(s - r * r, 2 * r), Q.of(s, r * r)],
            mistakes: [
              why(
                Q.of(s, 2 * r),
                "You left the bases in the area. Subtract them first, then divide by $2\\pi r$.",
                "你没有去掉底面积。应先减去两个底面，再除以 $2\\pi r$。",
              ),
            ],
            solution: t(
              `**Step 1: substitute.** Put the radius and the area into $S = 2\\pi r^2 + 2\\pi r h$, and divide by $\\pi$:

{{figure 0}}${steps(`2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot h = ${piTex(s)}`, `${2 * r * r} + ${2 * r}h = ${s}`)}**Step 2: take away the bases.** The two bases account for $${2 * r * r}$; the side is the rest:${steps(`${2 * r}h = ${s} - ${2 * r * r} = ${2 * r * h}`)}**Step 3: divide.**${steps(`h = \\frac{${2 * r * h}}{${2 * r}} = ${tex(h, u)}`)}**Check.** Put it back: the bases are $${piTex(2 * r * r)}$ and the side is $2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * h)}$, together $${piTex(s)}$, the given area.`,
              `**第一步：代入。** 把半径和面积代入 $S = 2\\pi r^2 + 2\\pi r h$，两边除以 $\\pi$：

{{figure 0}}${steps(`2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot h = ${piTex(s)}`, `${2 * r * r} + ${2 * r}h = ${s}`)}**第二步：减去底面。** 两个底面占 $${2 * r * r}$，其余是侧面：${steps(`${2 * r}h = ${s} - ${2 * r * r} = ${2 * r * h}`)}**第三步：相除。**${steps(`h = \\frac{${2 * r * h}}{${2 * r}} = ${tex(h, u)}`)}**检验。** 代回去：两个底面是 $${piTex(2 * r * r)}$，侧面是 $2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * h)}$，合计 $${piTex(s)}$，正是已知的表面积。`,
            ),
          }),
          solutionFigures: [
            figure(
              cylinderNet(r, h, 2, { r: len(r, u), h: "h", w: circumferenceLabel(r, u) }),
              `The net of the cylinder: two circles of radius ${r} ${u} and a rectangle ${2 * r}π ${u} wide with unknown height h.`,
              `圆柱的展开图：两个半径 ${r} ${u} 的圆和一个宽 ${2 * r}π ${u}、高 h 未知的长方形。`,
            ),
          ],
        };
      },
    },
  ],
};

export const volumesOfRightCones: TopicDef = {
  id: "volumes-of-right-cones",
  title: t("Volumes of Right Cones", "圆锥的体积"),
  summary: t(
    "Find the volume of a right cone, one third of πr²h, compare it with a cylinder, and find a missing radius or height.",
    "求圆锥的体积（πr²h 的三分之一），与圆柱比较，并求未知的半径或高。",
  ),
  prerequisites: ["volumes-of-cylinders", "volumes-of-pyramids"],
  encompasses: [{ topic: "volumes-of-cylinders", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.8.G.C.9"],
  intro: t(
    `Take a cylindrical glass with radius $6$ cm and height $5$ cm, and a cone with the same base and the same height. Fill the cone with water and pour it into the glass: after three cones, the glass is full.

{{figure 0}}

The glass holds $\\pi \\cdot 6^2 \\cdot 5 = 180\\pi\\text{ cm}^3$, so the cone holds $180\\pi \\div 3 = 60\\pi\\text{ cm}^3$, about $188\\text{ cm}^3$. This is the same third as for a pyramid in a box: a cone is a pyramid with a circle for a base. In this lesson we find volumes of cones, compare cones with cylinders, and find a missing radius or height from the volume.`,
    `取一个半径 $6$ 厘米、高 $5$ 厘米的圆柱形杯子，再取一个同底等高的圆锥。用圆锥装满水倒进杯子：倒三次，杯子就满了。

{{figure 0}}

杯子的容积是 $\\pi \\cdot 6^2 \\cdot 5 = 180\\pi\\text{ cm}^3$，所以圆锥的容积是 $180\\pi \\div 3 = 60\\pi\\text{ cm}^3$，约 $188\\text{ cm}^3$。这和长方体里的棱锥是同一个三分之一：圆锥就是底面为圆的"棱锥"。这节课我们求圆锥的体积，比较圆锥和圆柱，并由体积求未知的半径或高。`,
  ),
  introFigures: [
    figure(
      [...cylinderMarks(6, 5, { r: "6 cm", h: "5 cm" }), ...shift(coneMarks(6, 5, { r: "6 cm", h: "5 cm" }), 15)],
      "A cylinder with radius 6 cm and height 5 cm, beside a cone with the same radius and height.",
      "半径 6 厘米、高 5 厘米的圆柱，旁边是同底等高的圆锥。",
    ),
  ],
  knowledgePoints: [
    {
      id: "one-third-of-a-cylinder",
      figure: solidDrawings["one-third-of-a-cylinder"],
      title: t("One third of a cylinder", "圆柱的三分之一"),
      explanation: t(
        `In a **right cone** the apex is directly above the center of the circular base; the **height** $h$ is the distance from the apex straight down to the base. A cone narrows from its base to a point just as a pyramid does, and like a pyramid it holds one third of the cylinder with the same base and height:

$$V = \\frac{1}{3}\\pi r^2 h.$$

A cone with radius $3$ cm and height $4$ cm sits in a cylinder of $\\pi \\cdot 3^2 \\cdot 4 = 36\\pi\\text{ cm}^3$, so it holds $\\frac{1}{3} \\cdot 36\\pi = 12\\pi\\text{ cm}^3$.

> **Watch out.** Keep the $\\frac{1}{3}$: without it you have the cylinder. Use $\\frac{1}{3}$, not $\\frac{1}{2}$. Square the radius, and square the radius rather than the diameter: halve a given diameter first.`,
        `**圆锥**（直圆锥）的顶点在圆形底面圆心的正上方，**高** $h$ 是顶点竖直到底面的距离。圆锥和棱锥一样从底面收成一个点，它的体积也是同底等高的圆柱体积的三分之一：

$$V = \\frac{1}{3}\\pi r^2 h.$$

半径 $3$ 厘米、高 $4$ 厘米的圆锥放在体积 $\\pi \\cdot 3^2 \\cdot 4 = 36\\pi\\text{ cm}^3$ 的圆柱里，所以它的体积是 $\\frac{1}{3} \\cdot 36\\pi = 12\\pi\\text{ cm}^3$。

> **注意。** 不要丢掉 $\\frac{1}{3}$：没有它算的是圆柱。是 $\\frac{1}{3}$，不是 $\\frac{1}{2}$。半径要平方，平方的是半径而不是直径：给的是直径时先减半。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 10);
        const { r } = size;
        const h = rng.int(2, 15);
        const v = Q.of(r * r * h, 3);
        const box = 4 * r * r * h;
        const approx = String(Math.round((314 * r * r * h) / 30) / 10);
        return {
          ...piProblem({
            prompt: volumeIn(t("cone", "圆锥"), u),
            coef: v,
            wrong: [r * r * h, Q.of(r * h, 3), Q.of(2 * r * r * h, 3), Q.of(r * r * h, 2)],
            solution: t(
              `**Step 1: the cylinder.** ${sizeStep(size).en}The cylinder with the same base and height holds base times height:${steps(`\\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}**Step 2: one third.** The cone holds a third of it:${steps(`V = \\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}\\text{ ${u}}^3`)}**Check.** The cone fits in a box $${2 * r} \\times ${2 * r} \\times ${h}$ of volume $${box}$, and fills $\\frac{\\pi}{12} \\approx 0.26$ of it, about a quarter: $${piTex(v)} \\approx ${approx}$, a bit over $\\frac{${box}}{4} = ${r * r * h}$.`,
              `**第一步：圆柱。** ${sizeStep(size)["zh-CN"]}同底等高的圆柱，体积是底面积乘高：${steps(`\\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}**第二步：三分之一。** 圆锥的体积是它的三分之一：${steps(`V = \\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}\\text{ ${u}}^3`)}**检验。** 这个圆锥放得进体积 $${box}$ 的 $${2 * r} \\times ${2 * r} \\times ${h}$ 长方体，占它的 $\\frac{\\pi}{12} \\approx 0.26$，约四分之一：$${piTex(v)} \\approx ${approx}$，比 $\\frac{${box}}{4} = ${r * r * h}$ 多一点。`,
            ),
          }),
          figure: figure(
            coneMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cone of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and height ${h} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、高 ${h} ${u} 的圆锥。`,
          ),
        };
      },
    },
    {
      id: "cones-and-cylinders",
      figure: geometryDrawings2["volumes-of-right-cones#cones-and-cylinders"],
      title: t("Cones and cylinders", "圆锥与圆柱"),
      explanation: t(
        `A cone and a cylinder with the same base and the same height have volumes in the ratio $1 : 3$: it takes three cones of water to fill the cylinder. So divide the cylinder by $3$ to get the cone, and multiply the cone by $3$ to get the cylinder.

If such a cylinder holds $60\\pi\\text{ cm}^3$, the cone holds $60\\pi \\div 3 = 20\\pi\\text{ cm}^3$; if the cone holds $15\\text{ cm}^3$, the cylinder holds $3 \\cdot 15 = 45\\text{ cm}^3$.

> **Watch out.** Go the right way: the cone is the smaller one, so it is a third of the cylinder, never three times it. The factor is $3$, not $2$. And this works only when the base and the height are both the same.`,
        `同底等高的圆锥与圆柱的体积之比是 $1 : 3$：用圆锥装水，倒三次才能装满圆柱。所以圆柱除以 $3$ 得圆锥，圆锥乘以 $3$ 得圆柱。

如果这样的圆柱容积是 $60\\pi\\text{ cm}^3$，圆锥的容积就是 $60\\pi \\div 3 = 20\\pi\\text{ cm}^3$；如果圆锥的容积是 $15\\text{ cm}^3$，圆柱的容积就是 $3 \\cdot 15 = 45\\text{ cm}^3$。

> **注意。** 方向不要弄反：圆锥小，它是圆柱的三分之一，绝不是三倍。倍数是 $3$，不是 $2$。而且只有底面和高都相同时才成立。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 60);
        const fromCylinder = rng.bool();
        const [given, answer] = fromCylinder ? [3 * k, k] : [k, 3 * k];
        return {
          ...numberProblem({
            prompt: fromCylinder
              ? t(
                  `A cone and a cylinder have the same base and the same height. The cylinder has a volume of $${tex(given, u, 3)}$. What is the volume of the cone?`,
                  `一个圆锥和一个圆柱同底等高。圆柱的体积是 $${tex(given, u, 3)}$。圆锥的体积是多少？`,
                )
              : t(
                  `A cone and a cylinder have the same base and the same height. The cone has a volume of $${tex(given, u, 3)}$. What is the volume of the cylinder?`,
                  `一个圆锥和一个圆柱同底等高。圆锥的体积是 $${tex(given, u, 3)}$。圆柱的体积是多少？`,
                ),
            answer,
            form: "integer",
            unit: `${u}^3`,
            wrong: [given, fromCylinder ? 9 * k : k, fromCylinder ? Q.of(3 * k, 2) : 2 * k],
            solution: fromCylinder
              ? t(
                  `**Step 1: the ratio.** With the same base and height, the cone is $\\frac{1}{3}$ of the cylinder, $V = \\frac{1}{3}\\pi r^2 h$ against $\\pi r^2 h$:

{{figure 0}}

**Step 2: divide.** The cone holds a third of the cylinder:${steps(`${given} \\div 3 = ${tex(answer, u, 3)}`)}**Check.** Three cones fill the cylinder: $3 \\cdot ${answer} = ${given}$. The cone came out smaller, as it must.`,
                  `**第一步：比。** 同底等高时，圆锥是圆柱的 $\\frac{1}{3}$：$V = \\frac{1}{3}\\pi r^2 h$ 对 $\\pi r^2 h$：

{{figure 0}}

**第二步：相除。** 圆锥的体积是圆柱的三分之一：${steps(`${given} \\div 3 = ${tex(answer, u, 3)}`)}**检验。** 三个圆锥装满圆柱：$3 \\cdot ${answer} = ${given}$。圆锥算出来更小，理应如此。`,
                )
              : t(
                  `**Step 1: the ratio.** With the same base and height, the cylinder is $3$ times the cone, $\\pi r^2 h$ against $\\frac{1}{3}\\pi r^2 h$:

{{figure 0}}

**Step 2: multiply.** The cylinder holds three cones:${steps(`3 \\cdot ${given} = ${tex(answer, u, 3)}`)}**Check.** A third of the cylinder is the cone: $${answer} \\div 3 = ${given}$. The cylinder came out larger, as it must.`,
                  `**第一步：比。** 同底等高时，圆柱是圆锥的 $3$ 倍：$\\pi r^2 h$ 对 $\\frac{1}{3}\\pi r^2 h$：

{{figure 0}}

**第二步：相乘。** 圆柱装得下三个圆锥：${steps(`3 \\cdot ${given} = ${tex(answer, u, 3)}`)}**检验。** 圆柱的三分之一是圆锥：$${answer} \\div 3 = ${given}$。圆柱算出来更大，理应如此。`,
                ),
          }),
          solutionFigures: [
            figure(
              [...cylinderMarks(1, 2, {}), ...coneMarks(1, 2, {})],
              "A cone inside a cylinder with the same base and the same height.",
              "圆柱里放着一个同底等高的圆锥。",
            ),
          ],
        };
      },
    },
    {
      id: "missing-radius-or-height-of-a-cone",
      figure: solidDrawings["missing-radius-or-height-of-a-cone"],
      title: t("A missing radius or height", "求未知的半径或高"),
      explanation: t(
        `Undo the formula step by step. Substitute into $V = \\frac{1}{3}\\pi r^2 h$, divide by $\\pi$, and multiply by $3$ to clear the third: that leaves $r^2 h$, the cylinder's share. Then divide, and take a square root if it is the radius.

A cone with volume $50\\pi\\text{ cm}^3$ and radius $5$ cm has $\\frac{1}{3} \\cdot 25h = 50$, so $25h = 150$ and $h = 6$ cm. A cone with volume $12\\pi\\text{ cm}^3$ and height $4$ cm has $\\frac{1}{3} \\cdot 4r^2 = 12$, so $4r^2 = 36$, $r^2 = 9$ and $r = 3$ cm.

> **Watch out.** Multiply by $3$ before dividing: forgetting the $\\frac{1}{3}$ gives a third of the answer. Divide by $r^2$, not by $r$. For the radius, $r^2 = 9$ is not the answer: take the square root, and keep the $3$ under it with $r^2$.`,
        `一步步把公式倒过来。代入 $V = \\frac{1}{3}\\pi r^2 h$，两边除以 $\\pi$，再乘以 $3$ 去掉三分之一：剩下 $r^2 h$，也就是圆柱的那一份。然后相除；如果求的是半径，还要开平方。

体积 $50\\pi\\text{ cm}^3$、半径 $5$ 厘米的圆锥满足 $\\frac{1}{3} \\cdot 25h = 50$，所以 $25h = 150$，$h = 6$ 厘米。体积 $12\\pi\\text{ cm}^3$、高 $4$ 厘米的圆锥满足 $\\frac{1}{3} \\cdot 4r^2 = 12$，所以 $4r^2 = 36$，$r^2 = 9$，$r = 3$ 厘米。

> **注意。** 先乘 $3$ 再除：漏掉 $\\frac{1}{3}$，答案就只有三分之一。要除以 $r^2$，不是 $r$。求半径时，$r^2 = 9$ 不是答案：还要开平方，而且 $3$ 要和 $r^2$ 一起留在根号内。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const v = Q.of(r * r * h, 3);
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `A cone has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a radius of $${tex(r, u)}$. Find its height.`,
                `一个圆锥的体积是 $${piTex(v)}\\text{ ${u}}^3$，半径是 $${tex(r, u)}$。求它的高。`,
              ),
              answer: h,
              unit: u,
              mistakes: [
                why(
                  v.div(Q.of(r * r)),
                  "You forgot the $\\frac{1}{3}$ in the cone formula. Multiply by $3$ before you divide by $\\pi r^2$.",
                  "你漏掉了圆锥公式中的 $\\frac{1}{3}$。除以 $\\pi r^2$ 之前要先乘 $3$。",
                ),
                why(v.mul(Q.of(3)).div(Q.of(r)), "You did not square the radius. Divide by $r^2$.", "你没有把半径平方。应除以 $r^2$。"),
                why(v.mul(Q.of(3)), "You multiplied by $3$ but did not divide by $r^2$.", "你乘了 $3$，但没有除以 $r^2$。"),
              ],
              solution: t(
                `**Step 1: substitute.** Put the volume and the radius into $V = \\frac{1}{3}\\pi r^2 h$:

{{figure 0}}${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`)}**Step 2: clear $\\pi$ and the third.** Divide both sides by $\\pi$ and multiply by $3$:${steps(`${r === 1 ? "" : r * r}h = 3 \\cdot ${num(v)} = ${r * r * h}`)}**Step 3: divide.**${steps(r === 1 ? `h = ${tex(h, u)}` : `h = \\frac{${r * r * h}}{${r * r}} = ${tex(h, u)}`)}**Check.** Put it back: the cylinder on the same base would hold $\\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(r * r * h)}$, and a third of it is $${piTex(v)}$, the given volume.`,
                `**第一步：代入。** 把体积和半径代入 $V = \\frac{1}{3}\\pi r^2 h$：

{{figure 0}}${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`)}**第二步：去掉 $\\pi$ 和三分之一。** 两边除以 $\\pi$，再乘以 $3$：${steps(`${r === 1 ? "" : r * r}h = 3 \\cdot ${num(v)} = ${r * r * h}`)}**第三步：相除。**${steps(r === 1 ? `h = ${tex(h, u)}` : `h = \\frac{${r * r * h}}{${r * r}} = ${tex(h, u)}`)}**检验。** 代回去：同底等高的圆柱体积是 $\\pi \\cdot ${r * r} \\cdot ${h} = ${piTex(r * r * h)}$，它的三分之一是 $${piTex(v)}$，正是已知的体积。`,
              ),
            }),
            solutionFigures: [
              figure(
                coneMarks(r, h, { r: len(r, u), h: "h" }),
                `A cone with radius ${r} ${u} and unknown height h.`,
                `半径 ${r} ${u}、高 h 未知的圆锥。`,
              ),
            ],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `A cone has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. Find its radius.`,
              `一个圆锥的体积是 $${piTex(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。求它的半径。`,
            ),
            answer: r,
            unit: u,
            mistakes: [
              why(r * r, "That is $r^2$. Take the square root to get the radius.", "这是 $r^2$，还要开平方才是半径。"),
              why(
                v.div(Q.of(h)),
                "You forgot the $\\frac{1}{3}$ in the cone formula and did not take the root. Multiply by $3$, divide by $h$, then take the square root.",
                "你漏掉了圆锥公式中的 $\\frac{1}{3}$，也没有开方。应先乘 $3$，再除以 $h$，然后开平方。",
              ),
              why(
                3 * r,
                "You multiplied by $3$ after taking the root. The $3$ goes under the root, with $r^2$.",
                "你开方之后才乘 $3$。这个 $3$ 要和 $r^2$ 一起留在根号内。",
              ),
            ],
            solution: t(
              `**Step 1: substitute.** Put the volume and the height into $V = \\frac{1}{3}\\pi r^2 h$:

{{figure 0}}${steps(`\\frac{1}{3}\\pi r^2 \\cdot ${h} = ${piTex(v)}`)}**Step 2: clear $\\pi$ and the third, then divide.** Divide by $\\pi$, multiply by $3$, and divide by $${h}$:${steps(`${h}r^2 = 3 \\cdot ${num(v)} = ${r * r * h}`, `r^2 = \\frac{${r * r * h}}{${h}} = ${r * r}`)}**Step 3: the square root.** The radius is positive:${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**Check.** Put it back: $\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = \\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}$, the given volume.`,
              `**第一步：代入。** 把体积和高代入 $V = \\frac{1}{3}\\pi r^2 h$：

{{figure 0}}${steps(`\\frac{1}{3}\\pi r^2 \\cdot ${h} = ${piTex(v)}`)}**第二步：去掉 $\\pi$ 和三分之一，再相除。** 两边除以 $\\pi$，乘以 $3$，再除以 $${h}$：${steps(`${h}r^2 = 3 \\cdot ${num(v)} = ${r * r * h}`, `r^2 = \\frac{${r * r * h}}{${h}} = ${r * r}`)}**第三步：开平方。** 半径是正数：${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**检验。** 代回去：$\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = \\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}$，正是已知的体积。`,
            ),
          }),
          solutionFigures: [
            figure(
              coneMarks(r, h, { r: "r", h: len(h, u) }),
              `A cone with height ${h} ${u} and unknown radius r.`,
              `高 ${h} ${u}、半径 r 未知的圆锥。`,
            ),
          ],
        };
      },
    },
  ],
};

/** rootSize says how large √n is: exactly k when n is a square, otherwise between the two whole numbers around it. */
function rootSize(n: number): Text {
  const a = Math.floor(Math.sqrt(n));
  if (a * a === n) return t(`$\\sqrt{${n}} = ${a}$ exactly`, `$\\sqrt{${n}} = ${a}$`);
  return t(
    `$\\sqrt{${n}}$ lies between $${a}$ and $${a + 1}$, since $${a}^2 = ${a * a} < ${n} < ${(a + 1) ** 2} = ${a + 1}^2$`,
    `$\\sqrt{${n}}$ 介于 $${a}$ 和 $${a + 1}$ 之间，因为 $${a}^2 = ${a * a} < ${n} < ${(a + 1) ** 2} = ${a + 1}^2$`,
  );
}

/** legCheck checks a hypotenuse √n against its legs a and b: longer than each, shorter than their sum. */
function legCheck(n: number, a: number, b: number): Text {
  const size = rootSize(n);
  return t(
    `**Check.** ${size.en}. The slant height is the hypotenuse, so it must be longer than each leg, $${a}$ and $${b}$, and shorter than the path along both, $${a} + ${b} = ${a + b}$: it is.`,
    `**检验。** ${size["zh-CN"]}。母线是斜边，必须比每条直角边（$${a}$ 和 $${b}$）都长，又比沿两条直角边走的路 $${a} + ${b} = ${a + b}$ 短：确实如此。`,
  );
}

/** innerLegCheck checks a leg √n found from the hypotenuse l and the other leg a: shorter than l, and l² comes back. */
function innerLegCheck(n: number, l: number, a: number): Text {
  const size = rootSize(n);
  return t(
    `**Check.** ${size.en}; so the leg is shorter than the slant height $${l}$, as it must be. And the legs give back the hypotenuse: $${a}^2 + ${n} = ${a * a + n} = ${l}^2$.`,
    `**检验。** ${size["zh-CN"]}；所以这条直角边比母线 $${l}$ 短，理应如此。两条直角边也能还原斜边：$${a}^2 + ${n} = ${a * a + n} = ${l}^2$。`,
  );
}

export const slantHeightsOfRightCones: TopicDef = {
  id: "slant-heights-of-right-cones",
  title: t("Slant Heights of Right Cones", "圆锥的母线"),
  summary: t(
    "Relate the radius, height and slant height of a right cone with the Pythagorean theorem.",
    "用勾股定理联系圆锥的半径、高和母线长。",
  ),
  prerequisites: ["volumes-of-right-cones", "the-pythagorean-theorem"],
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.6 },
    { topic: "simplifying-square-roots", weight: 0.3 },
  ],
  xp: 12,
  intro: t(
    `A party hat is a cone with radius $9$ cm and height $12$ cm. How long is the hat measured along its side, from the tip down to the rim?

{{figure 0}}

Cut the hat in half straight down through the tip. The cut shows a right triangle: the height $12$ goes straight down the middle, a radius $9$ runs along the bottom, and they meet at a right angle at the center of the base. The side of the hat is the hypotenuse, so it is $\\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15$ cm. This length is the **slant height** of the cone. In this lesson we find the slant height from the radius and the height, and the height or the radius from the slant height.`,
    `一顶派对帽是半径 $9$ 厘米、高 $12$ 厘米的圆锥。沿着帽子的侧面，从帽尖到帽沿有多长？

{{figure 0}}

过帽尖竖直地把帽子切成两半。切面上有一个直角三角形：高 $12$ 竖直地在正中，半径 $9$ 沿着底面，两者在底面圆心处成直角。帽子的侧边是斜边，所以长 $\\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15$ 厘米。这个长度就是圆锥的**母线长**。这节课我们由半径和高求母线长，也由母线长求高或半径。`,
  ),
  introFigures: [
    figure(
      coneMarks(9, 12, { r: "9 cm", h: "12 cm", l: "?" }),
      "A party hat shaped like a cone with radius 9 cm and height 12 cm; the length along its side is unknown.",
      "圆锥形派对帽，半径 9 厘米、高 12 厘米；沿侧面的长度未知。",
    ),
  ],
  knowledgePoints: [
    {
      id: "slant-height-from-radius-and-height",
      figure: solidDrawings["slant-height-from-radius-and-height"],
      title: t("Slant height from radius and height", "由半径和高求母线长"),
      explanation: t(
        `The **slant height** $l$ of a right cone is the distance from the apex to any point on the edge of the base. The apex is right above the center, so the height $h$ meets a radius $r$ at a right angle, and the slant height closes the right triangle as its hypotenuse:

$$l = \\sqrt{r^2 + h^2}.$$

A cone with radius $5$ cm and height $12$ cm has $l = \\sqrt{25 + 144} = \\sqrt{169} = 13$ cm. With radius $2$ and height $4$, $l = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$: simplify the root when it is not whole.

> **Watch out.** Square, add, then take the root: $\\sqrt{r^2 + h^2}$ is not $r + h$, and not $\\sqrt{r + h}$. Add the squares, since the slant height is the hypotenuse; subtracting is for finding a leg.`,
        `圆锥的**母线**是从顶点到底面圆周上任意一点的线段，它的长 $l$ 叫母线长。顶点在圆心正上方，所以高 $h$ 和半径 $r$ 成直角，母线作为斜边把直角三角形补全：

$$l = \\sqrt{r^2 + h^2}.$$

半径 $5$ 厘米、高 $12$ 厘米的圆锥 $l = \\sqrt{25 + 144} = \\sqrt{169} = 13$ 厘米。半径 $2$、高 $4$ 时，$l = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$：开不尽时要化简根式。

> **注意。** 先平方、再相加、最后开方：$\\sqrt{r^2 + h^2}$ 不是 $r + h$，也不是 $\\sqrt{r + h}$。母线是斜边，所以平方要相加；相减是求直角边时用的。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const h = rng.int(2, 15);
        const n = r * r + h * h;
        return {
          ...rootProblem({
            prompt: t(
              `Find the slant height $l$ of the cone, in ${unitWord(u)}. Write it in simplest radical form.`,
              `求这个圆锥的母线长 $l$（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(r + h), `\\sqrt{${Math.abs(h * h - r * r)}}`, `\\sqrt{${r + h}}`],
            solution: t(
              `**Step 1: the right triangle.** The height $${h}$ and the radius $${r}$ meet at a right angle at the center of the base; the slant height is the hypotenuse:${steps(`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${n}`)}**Step 2: the square root.**${steps(`l = ${rootSteps(n)}`)}${legCheck(n, r, h).en}`,
              `**第一步：直角三角形。** 高 $${h}$ 和半径 $${r}$ 在底面圆心处成直角，母线是斜边：${steps(`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${n}`)}**第二步：开平方。**${steps(`l = ${rootSteps(n)}`)}${legCheck(n, r, h)["zh-CN"]}`,
            ),
          }),
          figure: figure(
            coneMarks(r, h, { r: len(r, u), h: len(h, u), l: "?" }),
            `A cone with radius ${r} ${u}, height ${h} ${u} and unknown slant height l.`,
            `一个半径 ${r} ${u}、高 ${h} ${u}、母线长 l 未知的圆锥。`,
          ),
        };
      },
    },
    {
      id: "height-from-slant-height",
      figure: solidDrawings["height-from-slant-height"],
      title: t("Height from the slant height", "由母线长求高"),
      explanation: t(
        `The slant height is the hypotenuse, the longest side, and the height is a leg. So take the square of the radius away from the square of the slant height:

$$h = \\sqrt{l^2 - r^2}.$$

A cone with slant height $10$ cm and radius $6$ cm has $h = \\sqrt{100 - 36} = \\sqrt{64} = 8$ cm, shorter than the slant height, as it must be.

> **Watch out.** Subtract the squares, not the lengths: $l - r$ is not the height. Subtract, do not add: $\\sqrt{l^2 + r^2}$ would be longer than the slant height. And take the root of the whole difference, not $\\sqrt{l - r}$.`,
        `母线是斜边，是最长的边；高是一条直角边。所以用母线长的平方减去半径的平方：

$$h = \\sqrt{l^2 - r^2}.$$

母线长 $10$ 厘米、半径 $6$ 厘米的圆锥 $h = \\sqrt{100 - 36} = \\sqrt{64} = 8$ 厘米，比母线短，理应如此。

> **注意。** 相减的是平方，不是长度：$l - r$ 不是高。要相减，不是相加：$\\sqrt{l^2 + r^2}$ 会比母线还长。开方要开整个差，不是 $\\sqrt{l - r}$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const l = rng.int(r + 1, 20);
        const n = l * l - r * r;
        return {
          ...rootProblem({
            prompt: t(
              `A cone has slant height $${tex(l, u)}$ and radius $${tex(r, u)}$. Find its height, in ${unitWord(u)}. Write it in simplest radical form.`,
              `一个圆锥的母线长是 $${tex(l, u)}$，半径是 $${tex(r, u)}$。求它的高（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(l - r), rootTex(l * l + r * r), `\\sqrt{${l - r}}`],
            solution: t(
              `**Step 1: the right triangle.** The slant height $${l}$ is the hypotenuse; the radius $${r}$ and the height are the legs:${steps(`${r}^2 + h^2 = ${l}^2`, `h^2 = ${l * l} - ${r * r} = ${n}`)}**Step 2: the square root.**${steps(`h = ${rootSteps(n)}`)}${innerLegCheck(n, l, r).en}`,
              `**第一步：直角三角形。** 母线 $${l}$ 是斜边，半径 $${r}$ 和高是直角边：${steps(`${r}^2 + h^2 = ${l}^2`, `h^2 = ${l * l} - ${r * r} = ${n}`)}**第二步：开平方。**${steps(`h = ${rootSteps(n)}`)}${innerLegCheck(n, l, r)["zh-CN"]}`,
            ),
          }),
          figure: figure(
            coneMarks(r, Math.sqrt(n), { r: len(r, u), h: "h", l: len(l, u) }),
            `A cone with radius ${r} ${u}, slant height ${l} ${u} and height h.`,
            `一个半径 ${r} ${u}、母线长 ${l} ${u}、高为 h 的圆锥。`,
          ),
        };
      },
    },
    {
      id: "radius-from-slant-height",
      figure: geometryDrawings2["slant-heights-of-right-cones#radius-from-slant-height"],
      title: t("Radius or diameter", "求半径或由直径求母线"),
      explanation: t(
        `The same right triangle gives the radius: it is a leg, so $r = \\sqrt{l^2 - h^2}$. A cone with slant height $17$ cm and height $15$ cm has $r = \\sqrt{289 - 225} = \\sqrt{64} = 8$ cm.

The triangle has a radius along its bottom, not a diameter: the height stands at the center. If the diameter is given, halve it first. A cone with diameter $10$ cm and height $12$ cm has $r = 5$ cm and $l = \\sqrt{25 + 144} = 13$ cm.

> **Watch out.** Use the radius, not the diameter, in the triangle: $\\sqrt{10^2 + 12^2}$ is the wrong side. When finding the radius, subtract the squares, not the lengths, and do not double the result: the root is the radius itself.`,
        `同一个直角三角形也能求半径：半径是直角边，所以 $r = \\sqrt{l^2 - h^2}$。母线长 $17$ 厘米、高 $15$ 厘米的圆锥 $r = \\sqrt{289 - 225} = \\sqrt{64} = 8$ 厘米。

三角形的底边是半径，不是直径：高立在圆心处。如果给的是直径，先把它减半。直径 $10$ 厘米、高 $12$ 厘米的圆锥 $r = 5$ 厘米，$l = \\sqrt{25 + 144} = 13$ 厘米。

> **注意。** 三角形里用半径，不用直径：$\\sqrt{10^2 + 12^2}$ 是错的边。求半径时相减的是平方，不是长度；结果也不要乘以 $2$：开出来的就是半径。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool()) {
          const h = rng.int(1, 12);
          const l = rng.int(h + 1, 20);
          const n = l * l - h * h;
          return {
            ...rootProblem({
              prompt: t(
                `A cone has slant height $${tex(l, u)}$ and height $${tex(h, u)}$. Find its radius, in ${unitWord(u)}. Write it in simplest radical form.`,
                `一个圆锥的母线长是 $${tex(l, u)}$，高是 $${tex(h, u)}$。求它的半径（单位：${u}）。用最简根式表示。`,
              ),
              n,
              wrong: [String(l - h), rootTex(l * l + h * h), rootTex(4 * n)],
              solution: t(
                `**Step 1: the right triangle.** The slant height $${l}$ is the hypotenuse; the height $${h}$ and the radius are the legs:

{{figure 0}}${steps(`r^2 + ${h}^2 = ${l}^2`, `r^2 = ${l * l} - ${h * h} = ${n}`)}**Step 2: the square root.**${steps(`r = ${rootSteps(n)}`)}${innerLegCheck(n, l, h).en}`,
                `**第一步：直角三角形。** 母线 $${l}$ 是斜边，高 $${h}$ 和半径是直角边：

{{figure 0}}${steps(`r^2 + ${h}^2 = ${l}^2`, `r^2 = ${l * l} - ${h * h} = ${n}`)}**第二步：开平方。**${steps(`r = ${rootSteps(n)}`)}${innerLegCheck(n, l, h)["zh-CN"]}`,
              ),
            }),
            solutionFigures: [
              figure(
                coneMarks(Math.sqrt(n), h, { r: "r", h: len(h, u), l: len(l, u) }),
                `A cone with height ${h} ${u}, slant height ${l} ${u} and unknown radius r.`,
                `高 ${h} ${u}、母线长 ${l} ${u}、半径 r 未知的圆锥。`,
              ),
            ],
          };
        }
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const n = r * r + h * h;
        return {
          ...rootProblem({
            prompt: t(
              `A cone has diameter $${tex(2 * r, u)}$ and height $${tex(h, u)}$. Find its slant height, in ${unitWord(u)}. Write it in simplest radical form.`,
              `一个圆锥的直径是 $${tex(2 * r, u)}$，高是 $${tex(h, u)}$。求它的母线长（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [rootTex(4 * r * r + h * h), String(r + h)],
            solution: t(
              `**Step 1: the radius.** The height stands at the center, so the triangle's bottom is a radius, half the diameter: $r = \\frac{${2 * r}}{2} = ${r}$.

{{figure 0}}

**Step 2: the slant height.** It is the hypotenuse:${steps(`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${n}`, `l = ${rootSteps(n)}`)}${legCheck(n, r, h).en}`,
              `**第一步：半径。** 高立在圆心处，所以三角形的底边是半径，即直径的一半：$r = \\frac{${2 * r}}{2} = ${r}$。

{{figure 0}}

**第二步：母线长。** 它是斜边：${steps(`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${n}`, `l = ${rootSteps(n)}`)}${legCheck(n, r, h)["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            figure(
              coneMarks(r, h, { r: len(r, u), h: len(h, u), l: "?" }),
              `A cone with radius ${r} ${u} (half the diameter ${2 * r} ${u}), height ${h} ${u} and unknown slant height.`,
              `半径 ${r} ${u}（直径 ${2 * r} ${u} 的一半）、高 ${h} ${u}、母线长未知的圆锥。`,
            ),
          ],
        };
      },
    },
  ],
};

/** coneSector draws the unrolled side of a cone, a sector of radius l whose arc is the base's circumference, and optionally the base below it. */
function coneSector(r: number, l: number, base: boolean, labels: { l?: string; arc?: string; r?: string }): Mark[] {
  const L = 3;
  const theta = (2 * Math.PI * r) / l;
  const [a0, a1] = [-Math.PI / 2 - theta / 2, -Math.PI / 2 + theta / 2];
  const end = (a: number): Point => [L * Math.cos(a), L * Math.sin(a)];
  const marks: Mark[] = [
    ...Array.from(
      { length: 48 },
      (_, i): Mark => ({ kind: "segment", a: end(a0 + ((a1 - a0) * i) / 48), b: end(a0 + ((a1 - a0) * (i + 1)) / 48) }),
    ),
    { kind: "segment", a: [0, 0], b: end(a0) },
    { kind: "segment", a: [0, 0], b: end(a1) },
  ];
  if (labels.l) marks.push({ kind: "side", a: end(a1), b: [0, 0], text: labels.l });
  if (labels.arc) marks.push({ kind: "label", at: [0, -L], text: labels.arc, dir: "s" });
  if (base) {
    const rr = (L * r) / l;
    const c: Point = [0, -L - rr - (labels.arc ? 0.9 : 0.1)];
    marks.push(ellipse(c[0], c[1], rr, rr));
    if (labels.r) {
      marks.push({ kind: "segment", a: c, b: [c[0] + rr, c[1]], accent: true }, { kind: "dot", at: c });
      marks.push({ kind: "label", at: [c[0] + rr / 2, c[1]], text: labels.r, dir: "n" });
    }
  }
  return marks;
}

/** sectorCheck checks a cone's lateral area πrl as the fraction r/l of the full circle of radius l. */
function sectorCheck(r: number, l: number): Text {
  return t(
    `**Check.** Unrolled, the side is a sector of a circle of radius $${l}$. Its arc is the circumference of the base, $${piTex(2 * r)}$, out of the full circle's $${piTex(2 * l)}$, so the sector is $\\frac{${r}}{${l}}$ of the area $${piTex(l * l)}$: $\\frac{${r}}{${l}} \\cdot ${piTex(l * l)} = ${piTex(r * l)}$, the same.`,
    `**检验。** 侧面展开是半径 $${l}$ 的扇形。它的弧长等于底面周长 $${piTex(2 * r)}$，整个圆的周长是 $${piTex(2 * l)}$，所以扇形是面积 $${piTex(l * l)}$ 的 $\\frac{${r}}{${l}}$：$\\frac{${r}}{${l}} \\cdot ${piTex(l * l)} = ${piTex(r * l)}$，结果相同。`,
  );
}

export const surfaceAreasOfRightCones: TopicDef = {
  id: "surface-areas-of-right-cones",
  title: t("Surface Areas of Right Cones", "圆锥的表面积"),
  summary: t("Find the lateral area πrl and the surface area πr² + πrl of a right cone.", "求圆锥的侧面积 πrl 和表面积 πr² + πrl。"),
  prerequisites: ["slant-heights-of-right-cones", "surface-areas-of-cylinders"],
  encompasses: [{ topic: "slant-heights-of-right-cones", weight: 0.4 }],
  xp: 14,
  intro: t(
    `A paper cup shaped like a cone has radius $4$ cm and slant height $12$ cm. Cut it straight up its side and flatten it: the paper becomes a sector, a slice of a circle whose radius is the slant height, $12$ cm.

{{figure 0}}

The curved edge of the slice went once around the rim, so it is $2\\pi \\cdot 4 = 8\\pi$ cm long. The whole circle of radius $12$ would have a rim of $24\\pi$ cm, three times as long, so the slice is a third of the circle: $\\frac{1}{3} \\cdot \\pi \\cdot 12^2 = 48\\pi\\text{ cm}^2$, about $151\\text{ cm}^2$. That is $\\pi \\cdot 4 \\cdot 12$: radius times slant height times $\\pi$. In this lesson we find the lateral area of a cone, add the base for its surface area, and find the slant height first when only the height is given.`,
    `一个圆锥形纸杯半径 $4$ 厘米，母线长 $12$ 厘米。沿侧面剪开摊平：纸变成一个扇形，也就是半径为母线长 $12$ 厘米的圆的一部分。

{{figure 0}}

扇形的弧恰好绕杯口一圈，所以长 $2\\pi \\cdot 4 = 8\\pi$ 厘米。半径 $12$ 的整个圆周长是 $24\\pi$ 厘米，是它的三倍，所以扇形是整个圆的三分之一：$\\frac{1}{3} \\cdot \\pi \\cdot 12^2 = 48\\pi\\text{ cm}^2$，约 $151\\text{ cm}^2$。这正是 $\\pi \\cdot 4 \\cdot 12$：$\\pi$ 乘半径乘母线长。这节课我们求圆锥的侧面积，加上底面得到表面积，并在只知道高时先求出母线长。`,
  ),
  introFigures: [
    figure(
      [
        ...coneMarks(4, Math.sqrt(128), { r: "4 cm", l: "12 cm" }),
        ...shift(scaleMarks(coneSector(4, 12, false, { l: "12 cm", arc: "8π cm" }), 3.5), 17, 11),
      ],
      "A paper cup shaped like a cone with radius 4 cm and slant height 12 cm, and its side flattened into a sector of radius 12 cm with an arc of 8π cm.",
      "半径 4 厘米、母线长 12 厘米的圆锥形纸杯，以及把侧面摊平得到的扇形：半径 12 厘米，弧长 8π 厘米。",
    ),
  ],
  knowledgePoints: [
    {
      id: "lateral-area-of-a-cone",
      figure: solidDrawings["lateral-area-of-a-cone"],
      title: t("Lateral area", "侧面积"),
      explanation: t(
        `Unrolled, the curved surface of a cone is a sector of a circle of radius $l$, the slant height. Its arc went once around the base, so it is $2\\pi r$ long, out of the full circle's $2\\pi l$. The sector is that fraction $\\frac{2\\pi r}{2\\pi l} = \\frac{r}{l}$ of the full circle's area $\\pi l^2$, so the **lateral area** is

$$L = \\frac{r}{l} \\cdot \\pi l^2 = \\pi r l.$$

A cone with radius $3$ cm and slant height $5$ cm unrolls into $\\frac{3}{5}$ of a circle of area $25\\pi\\text{ cm}^2$: $L = \\pi \\cdot 3 \\cdot 5 = 15\\pi\\text{ cm}^2$.

> **Watch out.** Use the slant height here, not the height. The formula is $\\pi r l$, not $2\\pi r l$ like a cylinder's side, and not half of it. Leave out the base for the lateral area, and do not square the radius.`,
        `圆锥的侧面展开后是一个半径为母线长 $l$ 的扇形。它的弧绕底面一圈，长 $2\\pi r$，而整个圆的周长是 $2\\pi l$。扇形就是整个圆面积 $\\pi l^2$ 的 $\\frac{2\\pi r}{2\\pi l} = \\frac{r}{l}$，所以**侧面积**是

$$L = \\frac{r}{l} \\cdot \\pi l^2 = \\pi r l.$$

半径 $3$ 厘米、母线长 $5$ 厘米的圆锥展开成面积 $25\\pi\\text{ cm}^2$ 的圆的 $\\frac{3}{5}$：$L = \\pi \\cdot 3 \\cdot 5 = 15\\pi\\text{ cm}^2$。

> **注意。** 这里用的是母线长，而不是高。公式是 $\\pi r l$，不是像圆柱侧面那样的 $2\\pi r l$，也不是它的一半。侧面积不包括底面，也不要把半径平方。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const l = rng.int(r + 1, 20);
        return {
          ...piProblem({
            prompt: t(
              `Find the lateral area of the cone, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆锥的侧面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: r * l,
            wrong: [2 * r * l, r * r + r * l, Q.of(r * l, 2), r * r * l],
            solution: t(
              `**Step 1: the lengths.** The lateral area uses the radius $${r}$ and the slant height $${l}$, the length along the side:

{{figure 0}}

**Step 2: the area.**${steps(`L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}\\text{ ${u}}^2`)}${sectorCheck(r, l).en}`,
              `**第一步：长度。** 侧面积要用半径 $${r}$ 和母线长 $${l}$，即沿侧面的长度：

{{figure 0}}

**第二步：面积。**${steps(`L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}\\text{ ${u}}^2`)}${sectorCheck(r, l)["zh-CN"]}`,
            ),
          }),
          figure: figure(
            coneMarks(r, Math.sqrt(l * l - r * r), { r: len(r, u), l: len(l, u) }),
            `A cone with radius ${r} ${u} and slant height ${l} ${u}.`,
            `一个半径 ${r} ${u}、母线长 ${l} ${u} 的圆锥。`,
          ),
          solutionFigures: [
            figure(
              coneSector(r, l, false, { l: len(l, u), arc: `2π · ${r} = ${2 * r}π ${u}` }),
              `The side unrolled: a sector of radius ${l} ${u} with an arc of ${2 * r}π ${u}.`,
              `展开的侧面：半径 ${l} ${u}、弧长 ${2 * r}π ${u} 的扇形。`,
            ),
          ],
        };
      },
    },
    {
      id: "total-surface-area-of-a-cone",
      figure: geometryDrawings2["surface-areas-of-right-cones#total-surface-area-of-a-cone"],
      title: t("Total surface area", "表面积"),
      explanation: t(
        `The net of a cone is the sector of its side and one circle, the base. Add the base to the lateral area:

$$S = \\pi r^2 + \\pi r l.$$

A cone with radius $3$ cm and slant height $5$ cm has base $9\\pi\\text{ cm}^2$ and side $15\\pi\\text{ cm}^2$, so $S = 9\\pi + 15\\pi = 24\\pi\\text{ cm}^2$. Both terms share $\\pi r$, so also $S = \\pi r(r + l) = \\pi \\cdot 3 \\cdot 8 = 24\\pi$.

> **Watch out.** A cone has one base, not two like a cylinder. Do not stop at the side: that is only the lateral area. The side is $\\pi r l$, not $2\\pi r l$. Halve a given diameter before using it.`,
        `圆锥的展开图是侧面的扇形和一个圆，即底面。把底面加到侧面积上：

$$S = \\pi r^2 + \\pi r l.$$

半径 $3$ 厘米、母线长 $5$ 厘米的圆锥，底面 $9\\pi\\text{ cm}^2$，侧面 $15\\pi\\text{ cm}^2$，所以 $S = 9\\pi + 15\\pi = 24\\pi\\text{ cm}^2$。两项都有因数 $\\pi r$，所以也可以写成 $S = \\pi r(r + l) = \\pi \\cdot 3 \\cdot 8 = 24\\pi$。

> **注意。** 圆锥只有一个底面，不像圆柱有两个。不要只算侧面：那只是侧面积。侧面是 $\\pi r l$，不是 $2\\pi r l$。给的是直径时先减半。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const l = rng.int(r + 1, 20);
        const s = r * r + r * l;
        return {
          ...piProblem({
            prompt: t(
              `Find the surface area of the cone, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆锥的表面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: [r * l, 2 * r * r + r * l, r * r + 2 * r * l, 2 * r * r + 2 * r * l],
            solution: t(
              `**Step 1: the base.** ${sizeStep(size).en}The base is one circle:

{{figure 0}}${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 2: the side.** The lateral area uses the slant height $${l}$:${steps(`\\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}`)}**Step 3: add.**${steps(`S = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}\\text{ ${u}}^2`)}**Check.** Factor out $\\pi r$: $S = \\pi r(r + l) = \\pi \\cdot ${r} \\cdot ${r + l} = ${piTex(s)}$, the same. The side is larger than the base, as it must be, since the slant height $${l}$ is longer than the radius $${r}$.`,
              `**第一步：底面。** ${sizeStep(size)["zh-CN"]}底面是一个圆：

{{figure 0}}${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第二步：侧面。** 侧面积用母线长 $${l}$：${steps(`\\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}`)}**第三步：相加。**${steps(`S = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}\\text{ ${u}}^2`)}**检验。** 提出 $\\pi r$：$S = \\pi r(r + l) = \\pi \\cdot ${r} \\cdot ${r + l} = ${piTex(s)}$，结果相同。侧面比底面大，理应如此，因为母线长 $${l}$ 比半径 $${r}$ 长。`,
            ),
          }),
          figure: figure(
            coneMarks(r, Math.sqrt(l * l - r * r), { ...sizeLabels(size, u), l: len(l, u) }),
            `A cone of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and slant height ${l} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、母线长 ${l} ${u} 的圆锥。`,
          ),
          solutionFigures: [
            figure(
              coneSector(r, l, true, { l: len(l, u), r: len(r, u) }),
              `The net of the cone: a sector of radius ${l} ${u} and a circle of radius ${r} ${u}.`,
              `圆锥的展开图：半径 ${l} ${u} 的扇形和半径 ${r} ${u} 的圆。`,
            ),
          ],
        };
      },
    },
    {
      id: "surface-area-from-the-height",
      figure: solidDrawings["surface-area-from-the-height"],
      title: t("Surface area from the height", "由高求表面积"),
      explanation: t(
        `The area formulas need the slant height, the length along the side. If the height is given instead, find the slant height first: the height, a radius and the slant height form a right triangle, so $l = \\sqrt{r^2 + h^2}$.

A cone with radius $6$ cm and height $8$ cm has $l = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm, so $S = \\pi \\cdot 6^2 + \\pi \\cdot 6 \\cdot 10 = 36\\pi + 60\\pi = 96\\pi\\text{ cm}^2$.

> **Watch out.** Do not put the height in place of the slant height: $\\pi \\cdot 6 \\cdot 8$ is not the side. Read whether the lateral area or the whole surface is asked, and add the base only for the whole surface. And $\\frac{1}{3}\\pi r^2 h$ is the volume, not an area.`,
        `面积公式要用母线长，即沿侧面的长度。如果给的是高，先求母线长：高、半径和母线组成直角三角形，所以 $l = \\sqrt{r^2 + h^2}$。

半径 $6$ 厘米、高 $8$ 厘米的圆锥 $l = \\sqrt{36 + 64} = \\sqrt{100} = 10$ 厘米，所以 $S = \\pi \\cdot 6^2 + \\pi \\cdot 6 \\cdot 10 = 36\\pi + 60\\pi = 96\\pi\\text{ cm}^2$。

> **注意。** 不要用高代替母线长：$\\pi \\cdot 6 \\cdot 8$ 不是侧面积。看清求的是侧面积还是表面积，只有表面积才加底面。$\\frac{1}{3}\\pi r^2 h$ 是体积，不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples);
        const m = rng.int(1, 2);
        const [r, h] = (rng.bool() ? [a * m, b * m] : [b * m, a * m]) as [number, number];
        const l = c * m;
        const lateralOnly = rng.bool(0.3);
        const s = lateralOnly ? r * l : r * r + r * l;
        const area = lateralOnly
          ? t("the lateral area, the side alone", "侧面积，只算侧面")
          : t("the surface area, base and side", "表面积，底面加侧面");
        return {
          ...piProblem({
            prompt: t(
              `A cone has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find its ${lateralOnly ? "lateral area" : "surface area"}, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `一个圆锥的半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。求它的${lateralOnly ? "侧面积" : "表面积"}（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: lateralOnly ? [r * h, r * r + r * l, r * r + r * h] : [r * r + r * h, r * l, Q.of(r * r * h, 3)],
            solution: t(
              `**Step 1: the slant height.** The height $${h}$, the radius $${r}$ and the slant height form a right triangle with the slant height as hypotenuse:

{{figure 0}}${steps(`l = \\sqrt{${r}^2 + ${h}^2} = \\sqrt{${r * r} + ${h * h}} = \\sqrt{${l * l}} = ${l}`)}**Step 2: the area.** We want ${area.en}:${steps(lateralOnly ? `L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}\\text{ ${u}}^2` : `S = \\pi r^2 + \\pi r l = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}\\text{ ${u}}^2`)}${
                lateralOnly
                  ? sectorCheck(r, l).en
                  : `**Check.** Factor out $\\pi r$: $\\pi \\cdot ${r} \\cdot (${r} + ${l}) = ${piTex(s)}$, the same. The slant height $${l}$ is longer than the height $${h}$, as a hypotenuse must be.`
              }`,
              `**第一步：母线长。** 高 $${h}$、半径 $${r}$ 和母线组成直角三角形，母线是斜边：

{{figure 0}}${steps(`l = \\sqrt{${r}^2 + ${h}^2} = \\sqrt{${r * r} + ${h * h}} = \\sqrt{${l * l}} = ${l}`)}**第二步：面积。** 要求的是${area["zh-CN"]}：${steps(lateralOnly ? `L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}\\text{ ${u}}^2` : `S = \\pi r^2 + \\pi r l = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}\\text{ ${u}}^2`)}${
                lateralOnly
                  ? sectorCheck(r, l)["zh-CN"]
                  : `**检验。** 提出 $\\pi r$：$\\pi \\cdot ${r} \\cdot (${r} + ${l}) = ${piTex(s)}$，结果相同。母线长 $${l}$ 比高 $${h}$ 长，斜边理应如此。`
              }`,
            ),
          }),
          figure: figure(
            coneMarks(r, h, { r: len(r, u), h: len(h, u) }),
            `A cone with radius ${r} ${u} and height ${h} ${u}.`,
            `一个半径 ${r} ${u}、高 ${h} ${u} 的圆锥。`,
          ),
          solutionFigures: [
            figure(
              coneMarks(r, h, { r: len(r, u), h: len(h, u), l: "?" }),
              `The right triangle inside the cone: radius ${r} ${u}, height ${h} ${u}, and the unknown slant height.`,
              `圆锥内部的直角三角形：半径 ${r} ${u}、高 ${h} ${u} 和未知的母线长。`,
            ),
          ],
        };
      },
    },
  ],
};

/** sphereInCylinder draws a sphere inside the cylinder that just holds it, radius r and height 2r, with the radius labeled. */
function sphereInCylinder(labels: RoundLabels): Mark[] {
  return [...sphereMarks(labels), ...shift(cylinderMarks(1, 2, {}), 0, -1)];
}

/** hemisphereMarks draws a hemisphere resting on its flat face, with a radius or diameter of that face labeled. */
function hemisphereMarks(labels: RoundLabels): Mark[] {
  const marks: Mark[] = [ellipse(0, 0, 1, 0.28), ...arc(0, 0, 1, 1, 0, Math.PI, false), { kind: "dot", at: [0, 0] }];
  if (labels.r) {
    marks.push({ kind: "segment", a: [0, 0], b: [1, 0], accent: true });
    marks.push({ kind: "label", at: [0.5, 0], text: labels.r, dir: "n" });
  }
  if (labels.d) {
    marks.push({ kind: "segment", a: [-1, 0], b: [1, 0], accent: true });
    marks.push({ kind: "label", at: [0.35, 0], text: labels.d, dir: "n" });
  }
  return marks;
}

/** sizeDescription says "radius 3 cm" or "diameter 6 cm" in plain text, for a figure's description. */
const sizeDescription = (size: RoundSize, u: Unit): Text =>
  size.byDiameter ? t(`diameter ${2 * size.r} ${u}`, `直径 ${2 * size.r} ${u}`) : t(`radius ${size.r} ${u}`, `半径 ${size.r} ${u}`);

export const volumesOfSpheres: TopicDef = {
  id: "volumes-of-spheres",
  title: t("Volumes of Spheres", "球的体积"),
  summary: t(
    "Find the volume of a sphere, 4/3 πr³, of a hemisphere, and the radius from the volume.",
    "求球的体积 4/3 πr³ 和半球的体积，并由体积求半径。",
  ),
  prerequisites: ["volumes-of-cylinders"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.8.G.C.9"],
  intro: t(
    `A ball with radius $5$ cm just fits in a cylindrical can: the can has radius $5$ cm and height $10$ cm, the ball's diameter. How much of the can does the ball fill?

{{figure 0}}

The can holds $\\pi \\cdot 5^2 \\cdot 10 = 250\\pi\\text{ cm}^3$. Archimedes found that the ball fills exactly two thirds of it: $\\frac{2}{3} \\cdot 250\\pi = \\frac{500}{3}\\pi\\text{ cm}^3$, about $524\\text{ cm}^3$. In general the can is $\\pi r^2 \\cdot 2r = 2\\pi r^3$, and two thirds of that is $\\frac{4}{3}\\pi r^3$. In this lesson we find volumes of spheres and hemispheres, and the radius of a sphere from its volume.`,
    `一个半径 $5$ 厘米的球恰好放进一个圆柱形罐子：罐子半径 $5$ 厘米，高 $10$ 厘米，也就是球的直径。球占了罐子的多少？

{{figure 0}}

罐子的容积是 $\\pi \\cdot 5^2 \\cdot 10 = 250\\pi\\text{ cm}^3$。阿基米德发现，球恰好占它的三分之二：$\\frac{2}{3} \\cdot 250\\pi = \\frac{500}{3}\\pi\\text{ cm}^3$，约 $524\\text{ cm}^3$。一般地，罐子是 $\\pi r^2 \\cdot 2r = 2\\pi r^3$，它的三分之二是 $\\frac{4}{3}\\pi r^3$。这节课我们求球和半球的体积，并由球的体积求半径。`,
  ),
  introFigures: [
    figure(
      [...sphereInCylinder({ r: "5 cm" }), { kind: "side", a: [1, -1], b: [1, 1], text: "10 cm" }],
      "A ball with radius 5 cm inside a cylindrical can with radius 5 cm and height 10 cm.",
      "半径 5 厘米的球放在半径 5 厘米、高 10 厘米的圆柱形罐子里。",
    ),
  ],
  knowledgePoints: [
    {
      id: "volume-of-a-sphere",
      figure: solidDrawings["volume-of-a-sphere"],
      title: t("Volume of a sphere", "球的体积"),
      explanation: t(
        `A sphere of radius $r$ fits exactly in a cylinder of radius $r$ and height $2r$, which holds $\\pi r^2 \\cdot 2r = 2\\pi r^3$. The sphere fills two thirds of it, so

$$V = \\frac{2}{3} \\cdot 2\\pi r^3 = \\frac{4}{3}\\pi r^3.$$

A sphere with radius $3$ cm has $r^3 = 27$ and $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$. With a diameter of $4$ cm, first $r = 2$, then $V = \\frac{4}{3}\\pi \\cdot 8 = \\frac{32}{3}\\pi\\text{ cm}^3$.

> **Watch out.** Cube the radius, do not square it: $4\\pi r^2$ is the surface area. Keep both parts of $\\frac{4}{3}$, the $4$ and the division by $3$. And halve a given diameter first: cubing the diameter makes the answer eight times too big.`,
        `半径为 $r$ 的球恰好放进半径 $r$、高 $2r$ 的圆柱，圆柱的体积是 $\\pi r^2 \\cdot 2r = 2\\pi r^3$。球占它的三分之二，所以

$$V = \\frac{2}{3} \\cdot 2\\pi r^3 = \\frac{4}{3}\\pi r^3.$$

半径 $3$ 厘米的球 $r^3 = 27$，$V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$。直径 $4$ 厘米时，先得 $r = 2$，再得 $V = \\frac{4}{3}\\pi \\cdot 8 = \\frac{32}{3}\\pi\\text{ cm}^3$。

> **注意。** 半径要立方，不是平方：$4\\pi r^2$ 是表面积。$\\frac{4}{3}$ 的两部分都要用上：乘 $4$，也要除以 $3$。给的是直径时先减半：把直径立方，答案会大八倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const v = Q.of(4 * r ** 3, 3);
        return {
          ...piProblem({
            prompt: volumeIn(t("sphere", "球"), u),
            coef: v,
            mistakes: [
              why(4 * r * r, "That is the surface area of a sphere, not its volume.", "这是球的表面积，不是体积。"),
              why(Q.of(4 * r * r, 3), "You squared the radius. In the volume it is cubed.", "你把半径平方了。体积公式中半径要立方。"),
              why(Q.of(r ** 3, 3), "You left out the $4$ in $\\frac{4}{3}$.", "你漏掉了 $\\frac{4}{3}$ 中的 $4$。"),
              why(Q.of(4 * 8 * r ** 3, 3), "You used the diameter where the radius belongs.", "你把直径当成半径代入了。"),
              why(4 * r ** 3, "You left out the division by $3$ in $\\frac{4}{3}$.", "你漏掉了 $\\frac{4}{3}$ 中的除以 $3$。"),
            ],
            solution: t(
              `**Step 1: the radius cubed.** ${sizeStep(size).en}A volume is built from three lengths, so the radius is cubed:${steps(`r^3 = ${r}^3 = ${r ** 3}`)}**Step 2: the volume.**${steps(`V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}\\text{ ${u}}^3`)}**Check.** The cylinder that just holds the sphere has radius $${r}$ and height $${2 * r}$, so it holds $\\pi \\cdot ${r}^2 \\cdot ${2 * r} = ${piTex(2 * r ** 3)}$. Two thirds of it is $\\frac{2}{3} \\cdot ${piTex(2 * r ** 3)} = ${piTex(v)}$, the same.

{{figure 0}}`,
              `**第一步：半径的立方。** ${sizeStep(size)["zh-CN"]}体积由三个长度相乘得到，所以半径要立方：${steps(`r^3 = ${r}^3 = ${r ** 3}`)}**第二步：体积。**${steps(`V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}\\text{ ${u}}^3`)}**检验。** 恰好装下这个球的圆柱半径 $${r}$、高 $${2 * r}$，体积 $\\pi \\cdot ${r}^2 \\cdot ${2 * r} = ${piTex(2 * r ** 3)}$。它的三分之二是 $\\frac{2}{3} \\cdot ${piTex(2 * r ** 3)} = ${piTex(v)}$，结果相同。

{{figure 0}}`,
            ),
          }),
          figure: figure(
            sphereMarks(sizeLabels(size, u)),
            `A sphere with ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"}为 ${size.byDiameter ? 2 * r : r} ${u} 的球。`,
          ),
          solutionFigures: [
            figure(
              [...sphereInCylinder({ r: len(r, u) }), { kind: "side", a: [1, -1], b: [1, 1], text: len(2 * r, u) }],
              `The sphere inside a cylinder with radius ${r} ${u} and height ${2 * r} ${u}.`,
              `球放在半径 ${r} ${u}、高 ${2 * r} ${u} 的圆柱里。`,
            ),
          ],
        };
      },
    },
    {
      id: "volume-of-a-hemisphere",
      figure: geometryDrawings2["volumes-of-spheres#volume-of-a-hemisphere"],
      title: t("Volume of a hemisphere", "半球的体积"),
      explanation: t(
        `Cutting a sphere through its center gives two equal halves called **hemispheres**. Each half holds half of the sphere's volume, and the radius of the hemisphere is the radius of the sphere, so

$$V = \\frac{1}{2} \\cdot \\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3.$$

A hemispherical bowl with radius $6$ cm has $r^3 = 216$ and holds $\\frac{2}{3}\\pi \\cdot 216 = 144\\pi\\text{ cm}^3$, half of the $288\\pi\\text{ cm}^3$ of the whole ball.

> **Watch out.** Halve the sphere: $\\frac{4}{3}\\pi r^3$ is the whole ball. Cube the radius, not square it, and keep the $2$ of $\\frac{2}{3}$. The width of the bowl across the top is the diameter: halve it before cubing.`,
        `过球心把球切开，得到两个相等的**半球**。每个半球的体积是球的一半，半球的半径就是球的半径，所以

$$V = \\frac{1}{2} \\cdot \\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3.$$

半径 $6$ 厘米的半球形碗，$r^3 = 216$，能装 $\\frac{2}{3}\\pi \\cdot 216 = 144\\pi\\text{ cm}^3$，是整个球 $288\\pi\\text{ cm}^3$ 的一半。

> **注意。** 要取球的一半：$\\frac{4}{3}\\pi r^3$ 是整个球。半径要立方，不是平方；$\\frac{2}{3}$ 里的 $2$ 也不要丢。碗口的宽度是直径：先减半再立方。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const v = Q.of(2 * r ** 3, 3);
        const what = rng.pick([
          t("hemisphere", "半球"),
          t("hemispherical bowl", "半球形碗"),
          t("dome shaped like a hemisphere", "半球形圆顶"),
        ]);
        return {
          ...piProblem({
            prompt: t(
              `A ${what.en} has ${sizeText(size, u).en}. Find its volume, in $${unitTex(u, 3)}$. ${inPi.en}`,
              `一个${sizeText(size, u)["zh-CN"]}的${what["zh-CN"]}。求它的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [Q.of(4 * r ** 3, 3), 2 * r * r, Q.of(r ** 3, 3), Q.of(2 * 8 * r ** 3, 3)],
            solution: t(
              `**Step 1: the whole sphere.** ${sizeStep(size).en}A sphere of radius $${r}$ would hold:

{{figure 0}}${steps(`\\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(Q.of(4 * r ** 3, 3))}`)}**Step 2: half of it.**${steps(`V = \\frac{1}{2} \\cdot ${piTex(Q.of(4 * r ** 3, 3))} = ${piTex(v)}\\text{ ${u}}^3`)}**Check.** The hemisphere fits in a cylinder of radius $${r}$ and height $${r}$, which holds $\\pi \\cdot ${r}^2 \\cdot ${r} = ${piTex(r ** 3)}$, and it fills two thirds of it, as the sphere does its cylinder: $\\frac{2}{3} \\cdot ${piTex(r ** 3)} = ${piTex(v)}$, the same.`,
              `**第一步：整个球。** ${sizeStep(size)["zh-CN"]}半径 $${r}$ 的球体积是：

{{figure 0}}${steps(`\\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(Q.of(4 * r ** 3, 3))}`)}**第二步：取一半。**${steps(`V = \\frac{1}{2} \\cdot ${piTex(Q.of(4 * r ** 3, 3))} = ${piTex(v)}\\text{ ${u}}^3`)}**检验。** 半球放得进半径 $${r}$、高 $${r}$ 的圆柱，圆柱体积 $\\pi \\cdot ${r}^2 \\cdot ${r} = ${piTex(r ** 3)}$；和球占它的圆柱一样，半球占这个圆柱的三分之二：$\\frac{2}{3} \\cdot ${piTex(r ** 3)} = ${piTex(v)}$，结果相同。`,
            ),
          }),
          solutionFigures: [
            figure(
              hemisphereMarks(sizeLabels(size, u)),
              `A hemisphere with ${sizeDescription(size, u).en}.`,
              `一个${sizeDescription(size, u)["zh-CN"]}的半球。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-the-volume",
      figure: solidDrawings["radius-from-the-volume"],
      title: t("Radius from the volume", "由体积求半径"),
      explanation: t(
        `Undo the formula in reverse order. Substitute into $V = \\frac{4}{3}\\pi r^3$, divide by $\\pi$, multiply by $\\frac{3}{4}$ to clear the fraction, and take the cube root, since the radius was cubed.

A sphere with volume $288\\pi\\text{ cm}^3$ has $\\frac{4}{3}r^3 = 288$, so $r^3 = 288 \\cdot \\frac{3}{4} = 216$ and $r = \\sqrt[3]{216} = 6$ cm, as $6 \\cdot 6 \\cdot 6 = 216$.

> **Watch out.** $216$ is $r^3$, not the radius: take the cube root, not the square root. Multiply by $\\frac{3}{4}$, the reciprocal of $\\frac{4}{3}$. And answer what is asked: the diameter is twice the radius.`,
        `把公式倒过来一步步做。代入 $V = \\frac{4}{3}\\pi r^3$，两边除以 $\\pi$，乘以 $\\frac{3}{4}$ 去掉分数，再开立方，因为半径是被立方的。

体积 $288\\pi\\text{ cm}^3$ 的球满足 $\\frac{4}{3}r^3 = 288$，所以 $r^3 = 288 \\cdot \\frac{3}{4} = 216$，$r = \\sqrt[3]{216} = 6$ 厘米，因为 $6 \\cdot 6 \\cdot 6 = 216$。

> **注意。** $216$ 是 $r^3$，不是半径：要开立方，不是开平方。乘的是 $\\frac{4}{3}$ 的倒数 $\\frac{3}{4}$。还要回答所问的量：直径是半径的两倍。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const v = Q.of(4 * r ** 3, 3);
        const askDiameter = rng.bool(0.3);
        const last = askDiameter
          ? t(
              `**Step 3: the diameter.** It is twice the radius:${steps(`d = 2r = ${tex(2 * r, u)}`)}`,
              `**第三步：直径。** 它是半径的两倍：${steps(`d = 2r = ${tex(2 * r, u)}`)}`,
            )
          : t("", "");
        return {
          ...numberProblem({
            prompt: t(
              `A sphere has a volume of $${piTex(v)}\\text{ ${u}}^3$. Find its ${askDiameter ? "diameter" : "radius"}.`,
              `一个球的体积是 $${piTex(v)}\\text{ ${u}}^3$。求它的${askDiameter ? "直径" : "半径"}。`,
            ),
            answer: askDiameter ? 2 * r : r,
            unit: u,
            wrong: askDiameter ? [r, r ** 3, 4 * r] : [r ** 3, 2 * r, v],
            solution: t(
              `**Step 1: solve for $r^3$.** Substitute, divide by $\\pi$, and multiply by $\\frac{3}{4}$:${steps(`\\frac{4}{3}\\pi r^3 = ${piTex(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`)}**Step 2: the cube root.** ${r === 1 ? "$1 \\cdot 1 \\cdot 1 = 1$" : `$${r} \\cdot ${r} \\cdot ${r} = ${r ** 3}$`}, so:${steps(`r = \\sqrt[3]{${r ** 3}} = ${tex(r, u)}`)}${last.en}**Check.** Put the radius back: $\\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}$, the given volume.`,
              `**第一步：解出 $r^3$。** 代入，两边除以 $\\pi$，再乘以 $\\frac{3}{4}$：${steps(`\\frac{4}{3}\\pi r^3 = ${piTex(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`)}**第二步：开立方。** ${r === 1 ? "$1 \\cdot 1 \\cdot 1 = 1$" : `$${r} \\cdot ${r} \\cdot ${r} = ${r ** 3}$`}，所以：${steps(`r = \\sqrt[3]{${r ** 3}} = ${tex(r, u)}`)}${last["zh-CN"]}**检验。** 把半径代回去：$\\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}$，正是已知的体积。`,
            ),
          }),
        };
      },
    },
  ],
};

export const surfaceAreasOfSpheres: TopicDef = {
  id: "surface-areas-of-spheres",
  title: t("Surface Areas of Spheres", "球的表面积"),
  summary: t(
    "Find the surface area of a sphere, 4πr², of a hemisphere, and the radius from the surface area.",
    "求球的表面积 4πr² 和半球的表面积，并由表面积求半径。",
  ),
  prerequisites: ["volumes-of-spheres"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 12,
  intro: t(
    `Cut an orange with radius $4$ cm in half and trace its round cut face four times on paper: four circles of radius $4$ cm. Peel the orange and lay the pieces of peel on the circles: they fill all four, just about exactly.

{{figure 0}}

Each circle has area $\\pi \\cdot 4^2 = 16\\pi\\text{ cm}^2$, so the peel has area $4 \\cdot 16\\pi = 64\\pi\\text{ cm}^2$, about $201\\text{ cm}^2$. The surface of a sphere is four times the area of a circle through its center, $4\\pi r^2$. In this lesson we find surface areas of spheres and hemispheres, and the radius from the surface area or the volume.`,
    `把一个半径 $4$ 厘米的橙子切成两半，在纸上把圆形切面描四次：得到四个半径 $4$ 厘米的圆。剥下橙皮，把碎片铺在这些圆上：差不多恰好铺满四个圆。

{{figure 0}}

每个圆的面积是 $\\pi \\cdot 4^2 = 16\\pi\\text{ cm}^2$，所以橙皮的面积是 $4 \\cdot 16\\pi = 64\\pi\\text{ cm}^2$，约 $201\\text{ cm}^2$。球的表面积是过球心的圆面积的四倍，即 $4\\pi r^2$。这节课我们求球和半球的表面积，并由表面积或体积求半径。`,
  ),
  introFigures: [
    figure(
      [
        ...sphereMarks({ r: "4 cm" }),
        ...[
          [3.2, 1.1],
          [5.4, 1.1],
          [3.2, -1.1],
          [5.4, -1.1],
        ].flatMap(([x, y]): Mark[] => [
          ellipse(x as number, y as number, 1, 1),
          { kind: "label", at: [x as number, (y as number) - 0.2], text: "16π cm²", dir: "n" },
        ]),
      ],
      "An orange with radius 4 cm, beside four circles of radius 4 cm that its peel covers.",
      "半径 4 厘米的橙子，旁边是它的皮能铺满的四个半径 4 厘米的圆。",
    ),
  ],
  knowledgePoints: [
    {
      id: "surface-area-of-a-sphere",
      figure: geometryDrawings2["surface-areas-of-spheres#surface-area-of-a-sphere"],
      title: t("Surface area of a sphere", "球的表面积"),
      explanation: t(
        `A sphere of radius $r$ has surface area

$$S = 4\\pi r^2,$$

exactly four times the area of a circle through its center, a **great circle**. Archimedes saw it another way: the sphere's surface equals the curved side of the cylinder that just holds it, $2\\pi r \\cdot 2r = 4\\pi r^2$.

A sphere with radius $5$ cm has great circles of area $25\\pi\\text{ cm}^2$, and $S = 4 \\cdot 25\\pi = 100\\pi\\text{ cm}^2$.

> **Watch out.** Keep the $4$: $\\pi r^2$ is only one great circle, and $2\\pi r^2$ is a hemisphere's curved half. Square the radius, not the diameter, which gives four times too much; $4\\pi r$ is not an area at all. And $\\frac{4}{3}\\pi r^3$ is the volume.`,
        `半径为 $r$ 的球的表面积是

$$S = 4\\pi r^2,$$

恰好是过球心的圆（**大圆**）面积的四倍。阿基米德用另一种方式看它：球面面积等于恰好装下这个球的圆柱的侧面积，$2\\pi r \\cdot 2r = 4\\pi r^2$。

半径 $5$ 厘米的球，大圆面积是 $25\\pi\\text{ cm}^2$，$S = 4 \\cdot 25\\pi = 100\\pi\\text{ cm}^2$。

> **注意。** 不要丢掉 $4$：$\\pi r^2$ 只是一个大圆，$2\\pi r^2$ 是半个球面。平方的是半径，不是直径，否则答案会变成四倍；$4\\pi r$ 根本不是面积。$\\frac{4}{3}\\pi r^3$ 是体积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 15);
        const { r } = size;
        return {
          ...piProblem({
            prompt: t(
              `Find the surface area of the sphere, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个球的表面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: 4 * r * r,
            wrong: [r * r, 2 * r * r, 16 * r * r, Q.of(4 * r ** 3, 3), 4 * r],
            solution: t(
              `**Step 1: a great circle.** ${sizeStep(size).en}A circle through the center has the sphere's radius:${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 2: four of them.** The sphere's surface is four great circles:${steps(`S = 4\\pi r^2 = 4 \\cdot ${piTex(r * r)} = ${piTex(4 * r * r)}\\text{ ${u}}^2`)}**Check.** The cylinder that just holds the sphere has radius $${r}$ and height $${2 * r}$. Its curved side unrolls into a rectangle $${piTex(2 * r)}$ by $${2 * r}$, of area $${piTex(2 * r)} \\cdot ${2 * r} = ${piTex(4 * r * r)}$, equal to the sphere's surface, as Archimedes found.

{{figure 0}}`,
              `**第一步：大圆。** ${sizeStep(size)["zh-CN"]}过球心的圆，半径就是球的半径：${steps(`\\pi r^2 = \\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第二步：四个大圆。** 球面面积是四个大圆：${steps(`S = 4\\pi r^2 = 4 \\cdot ${piTex(r * r)} = ${piTex(4 * r * r)}\\text{ ${u}}^2`)}**检验。** 恰好装下这个球的圆柱半径 $${r}$、高 $${2 * r}$。它的侧面展开成 $${piTex(2 * r)} \\times ${2 * r}$ 的长方形，面积 $${piTex(2 * r)} \\cdot ${2 * r} = ${piTex(4 * r * r)}$，与球面面积相等，正如阿基米德的发现。

{{figure 0}}`,
            ),
          }),
          figure: figure(
            sphereMarks(sizeLabels(size, u)),
            `A sphere with ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"}为 ${size.byDiameter ? 2 * r : r} ${u} 的球。`,
          ),
          solutionFigures: [
            figure(
              [...sphereInCylinder({ r: len(r, u) }), { kind: "side", a: [1, -1], b: [1, 1], text: len(2 * r, u) }],
              `The sphere inside a cylinder with radius ${r} ${u} and height ${2 * r} ${u}.`,
              `球放在半径 ${r} ${u}、高 ${2 * r} ${u} 的圆柱里。`,
            ),
          ],
        };
      },
    },
    {
      id: "radius-from-the-surface-area",
      figure: geometryDrawings2["surface-areas-of-spheres#radius-from-the-surface-area"],
      title: t("Radius from the surface area", "由表面积求半径"),
      explanation: t(
        `Undo $S = 4\\pi r^2$ in reverse order: divide by $4\\pi$ to get $r^2$, the area of a great circle over $\\pi$, then take the square root.

A sphere with surface area $196\\pi\\text{ cm}^2$ has $4r^2 = 196$, so $r^2 = 49$ and $r = 7$ cm.

> **Watch out.** Divide by $4$ as well as by $\\pi$: $196$ is not $r^2$. Then take the square root: $49$ is $r^2$, not the radius. And the radius is not the diameter: do not double it.`,
        `把 $S = 4\\pi r^2$ 倒过来做：除以 $4\\pi$ 得到 $r^2$（大圆面积除以 $\\pi$），再开平方。

表面积 $196\\pi\\text{ cm}^2$ 的球满足 $4r^2 = 196$，所以 $r^2 = 49$，$r = 7$ 厘米。

> **注意。** 既要除以 $\\pi$，也要除以 $4$：$196$ 不是 $r^2$。然后开平方：$49$ 是 $r^2$，不是半径。半径也不是直径：不要乘以 $2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 15);
        const s = 4 * r * r;
        return {
          ...numberProblem({
            prompt: t(
              `A sphere has a surface area of $${piTex(s)}\\text{ ${u}}^2$. Find its radius.`,
              `一个球的表面积是 $${piTex(s)}\\text{ ${u}}^2$。求它的半径。`,
            ),
            answer: r,
            unit: u,
            wrong: [r * r, 2 * r, Q.of(s, 4), s],
            solution: t(
              `**Step 1: solve for $r^2$.** Substitute into $S = 4\\pi r^2$ and divide both sides by $4\\pi$:${steps(`4\\pi r^2 = ${piTex(s)}`, `r^2 = \\frac{${s}}{4} = ${r * r}`)}**Step 2: the square root.** The radius is positive:${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**Check.** Put it back: a great circle has area $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$, and four of them make $${piTex(s)}$, the given area.`,
              `**第一步：解出 $r^2$。** 代入 $S = 4\\pi r^2$，两边除以 $4\\pi$：${steps(`4\\pi r^2 = ${piTex(s)}`, `r^2 = \\frac{${s}}{4} = ${r * r}`)}**第二步：开平方。** 半径是正数：${steps(`r = \\sqrt{${r * r}} = ${tex(r, u)}`)}**检验。** 代回去：大圆面积 $\\pi \\cdot ${r}^2 = ${piTex(r * r)}$，四个合起来是 $${piTex(s)}$，正是已知的表面积。`,
            ),
          }),
        };
      },
    },
    {
      id: "hemispheres-and-volume",
      figure: geometryDrawings2["surface-areas-of-spheres#hemispheres-and-volume"],
      title: t("Hemispheres, and surface area from volume", "半球，以及由体积求表面积"),
      explanation: t(
        `A solid hemisphere has two faces: its curved surface, half of the sphere's $4\\pi r^2$, and a flat circular face of area $\\pi r^2$:

$$S = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2.$$

A solid hemisphere with radius $2$ cm has $S = 3\\pi \\cdot 4 = 12\\pi\\text{ cm}^2$: three great circles' worth.

To pass from volume to surface area, find the radius first. A sphere with volume $36\\pi\\text{ cm}^3$ has $\\frac{4}{3}r^3 = 36$, so $r^3 = 27$, $r = 3$ cm, and $S = 4\\pi \\cdot 9 = 36\\pi\\text{ cm}^2$.

> **Watch out.** A solid hemisphere has a flat face too: $2\\pi r^2$ alone is only the dome. It is half of $4\\pi r^2$ plus one circle, not $4\\pi r^2$ plus anything. From a volume, take the cube root for the radius before squaring; the volume number is not the area.`,
        `实心半球有两个面：曲面，即球面 $4\\pi r^2$ 的一半；以及面积为 $\\pi r^2$ 的平的圆面：

$$S = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2.$$

半径 $2$ 厘米的实心半球 $S = 3\\pi \\cdot 4 = 12\\pi\\text{ cm}^2$：相当于三个大圆。

由体积求表面积时，先求半径。体积 $36\\pi\\text{ cm}^3$ 的球满足 $\\frac{4}{3}r^3 = 36$，所以 $r^3 = 27$，$r = 3$ 厘米，$S = 4\\pi \\cdot 9 = 36\\pi\\text{ cm}^2$。

> **注意。** 实心半球还有一个平面：只算 $2\\pi r^2$ 只是圆顶。它是 $4\\pi r^2$ 的一半加一个圆，不是 $4\\pi r^2$ 再加什么。由体积求表面积，要先开立方求半径再平方；体积的数值不是面积。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        if (rng.bool()) {
          return {
            ...piProblem({
              prompt: t(
                `A solid hemisphere has radius $${tex(r, u)}$. Find its total surface area, including the flat face, in $${unitTex(u, 2)}$. ${inPi.en}`,
                `一个实心半球的半径是 $${tex(r, u)}$。求它的表面积（包括平的圆面，单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
              ),
              coef: 3 * r * r,
              wrong: [2 * r * r, 4 * r * r, 5 * r * r, r * r],
              solution: t(
                `**Step 1: the curved surface.** It is half of a sphere of radius $${r}$:

{{figure 0}}${steps(`\\frac{1}{2} \\cdot 4\\pi \\cdot ${r}^2 = ${piTex(2 * r * r)}`)}**Step 2: the flat face.** It is a circle of radius $${r}$:${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**Step 3: add.**${steps(`S = ${piTex(2 * r * r)} + ${piTex(r * r)} = ${piTex(3 * r * r)}\\text{ ${u}}^2`)}**Check.** The dome is two great circles' worth and the flat face is one, so the total is three great circles of $${piTex(r * r)}$ each: $3 \\cdot ${piTex(r * r)} = ${piTex(3 * r * r)}$. It is less than the whole sphere's $${piTex(4 * r * r)}$, as it must be.`,
                `**第一步：曲面。** 它是半径 $${r}$ 的球面的一半：

{{figure 0}}${steps(`\\frac{1}{2} \\cdot 4\\pi \\cdot ${r}^2 = ${piTex(2 * r * r)}`)}**第二步：平面。** 它是半径 $${r}$ 的圆：${steps(`\\pi \\cdot ${r}^2 = ${piTex(r * r)}`)}**第三步：相加。**${steps(`S = ${piTex(2 * r * r)} + ${piTex(r * r)} = ${piTex(3 * r * r)}\\text{ ${u}}^2`)}**检验。** 圆顶相当于两个大圆，平面是一个，合计三个面积为 $${piTex(r * r)}$ 的大圆：$3 \\cdot ${piTex(r * r)} = ${piTex(3 * r * r)}$。它比整个球面 $${piTex(4 * r * r)}$ 小，理应如此。`,
              ),
            }),
            solutionFigures: [
              figure(hemisphereMarks({ r: len(r, u) }), `A solid hemisphere with radius ${r} ${u}.`, `半径 ${r} ${u} 的实心半球。`),
            ],
          };
        }
        const v = Q.of(4 * r ** 3, 3);
        return piProblem({
          prompt: t(
            `A sphere has a volume of $${piTex(v)}\\text{ ${u}}^3$. Find its surface area, in $${unitTex(u, 2)}$. ${inPi.en}`,
            `一个球的体积是 $${piTex(v)}\\text{ ${u}}^3$。求它的表面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
          ),
          coef: 4 * r * r,
          wrong: [v, 4 * r ** 3, r * r, 3 * r * r],
          solution: t(
            `**Step 1: the radius.** Substitute into $V = \\frac{4}{3}\\pi r^3$, divide by $\\pi$, multiply by $\\frac{3}{4}$, and take the cube root:${steps(`\\frac{4}{3}r^3 = ${num(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`, `r = \\sqrt[3]{${r ** 3}} = ${r}`)}**Step 2: the surface area.**${steps(`S = 4\\pi r^2 = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}\\text{ ${u}}^2`)}**Check.** Put the radius back into the volume: $\\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}$, as given. And $S = 4\\pi r^2$ and $V = \\frac{4}{3}\\pi r^3$ give $V = \\frac{r}{3} S$: $\\frac{${r}}{3} \\cdot ${piTex(4 * r * r)} = ${piTex(v)}$.`,
            `**第一步：半径。** 代入 $V = \\frac{4}{3}\\pi r^3$，两边除以 $\\pi$，乘以 $\\frac{3}{4}$，再开立方：${steps(`\\frac{4}{3}r^3 = ${num(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`, `r = \\sqrt[3]{${r ** 3}} = ${r}`)}**第二步：表面积。**${steps(`S = 4\\pi r^2 = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}\\text{ ${u}}^2`)}**检验。** 把半径代回体积：$\\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}$，与已知相同。由 $S = 4\\pi r^2$ 和 $V = \\frac{4}{3}\\pi r^3$ 得 $V = \\frac{r}{3} S$：$\\frac{${r}}{3} \\cdot ${piTex(4 * r * r)} = ${piTex(v)}$。`,
          ),
        });
      },
    },
  ],
};

/** frustumMarks draws a frustum with bottom radius R, top radius r and height H. */
function frustumMarks(R: number, r: number, H: number, labels: { R?: string; r?: string; h?: string; l?: string }): Mark[] {
  const [w, h] = fitBox([2 * R, H]) as [number, number];
  const big = w / 2;
  const small = (big * r) / R;
  const [ry, sy] = [0.28 * big, 0.28 * small];
  const marks: Mark[] = [
    ellipse(0, h, small, sy),
    ...arc(0, 0, big, ry, Math.PI, 2 * Math.PI, false),
    ...arc(0, 0, big, ry, 0, Math.PI, true),
    { kind: "segment", a: [-big, 0], b: [-small, h] },
    { kind: "segment", a: [big, 0], b: [small, h] },
  ];
  if (labels.R)
    marks.push({ kind: "segment", a: [0, 0], b: [big, 0], accent: true }, { kind: "label", at: [big / 2, 0], text: labels.R, dir: "s" });
  if (labels.r)
    marks.push(
      { kind: "segment", a: [0, h], b: [small, h], accent: true },
      { kind: "label", at: [small / 2, h], text: labels.r, dir: "n" },
    );
  if (labels.h) {
    marks.push({ kind: "segment", a: [0, h], b: [0, 0], dashed: true, accent: true });
    marks.push({ kind: "label", at: [0, h / 2], text: labels.h, dir: "w" });
  }
  if (labels.l) marks.push({ kind: "side", a: [big, 0], b: [small, h], text: labels.l });
  return marks;
}

/** frustumTip extends the sides of the frustum drawn by frustumMarks(R, r, H) in dashes to the tip of the whole cone, labeling the extra height. */
function frustumTip(R: number, r: number, H: number, label: string): Mark[] {
  const [w, h] = fitBox([2 * R, H]) as [number, number];
  const small = (w / 2) * (r / R);
  const tip = (h * R) / (R - r);
  return [
    { kind: "segment", a: [-small, h], b: [0, tip], dashed: true },
    { kind: "segment", a: [small, h], b: [0, tip], dashed: true },
    { kind: "label", at: [small / 2, (h + tip) / 2], text: label, dir: "e" },
  ];
}

export const conicalFrustums: TopicDef = {
  id: "conical-frustums",
  title: t("Conical Frustums", "圆台"),
  summary: t(
    "Find the volume and surface area of a frustum of a cone, as a difference of cones and by formula.",
    "把圆台看成两个圆锥之差，或用公式求它的体积和表面积。",
  ),
  prerequisites: ["surface-areas-of-right-cones"],
  encompasses: [{ topic: "volumes-of-right-cones", weight: 0.4 }],
  xp: 16,
  intro: t(
    `A bucket is a cone with its tip cut off. Take one with a rim of radius $10$ cm, a bottom of radius $5$ cm, and a height of $12$ cm. Extend its sloping side until it meets in a point: since the radius halves over $12$ cm, it shrinks to nothing $12$ cm further on.

{{figure 0}}

So the bucket is a cone of radius $10$ and height $24$ with a cone of radius $5$ and height $12$ removed:

$$\\frac{1}{3}\\pi \\cdot 10^2 \\cdot 24 - \\frac{1}{3}\\pi \\cdot 5^2 \\cdot 12 = 800\\pi - 100\\pi = 700\\pi\\text{ cm}^3,$$

about $2.2$ liters. A solid like this, between two parallel circles cut from a cone, is a **frustum**. In this lesson we find its volume as a difference of cones and by a formula, and its lateral and total surface area.`,
    `水桶就是截去尖顶的圆锥。取一个桶口半径 $10$ 厘米、桶底半径 $5$ 厘米、高 $12$ 厘米的水桶。把它倾斜的侧面延长，直到交于一点：半径每经过 $12$ 厘米就减半，所以再往前 $12$ 厘米就缩成一点。

{{figure 0}}

所以水桶是半径 $10$、高 $24$ 的圆锥去掉半径 $5$、高 $12$ 的圆锥：

$$\\frac{1}{3}\\pi \\cdot 10^2 \\cdot 24 - \\frac{1}{3}\\pi \\cdot 5^2 \\cdot 12 = 800\\pi - 100\\pi = 700\\pi\\text{ cm}^3,$$

约 $2.2$ 升。像这样从圆锥上截下、夹在两个平行圆面之间的立体叫**圆台**。这节课我们把圆台的体积看成两个圆锥之差来求，也用公式求，并求它的侧面积和表面积。`,
  ),
  introFigures: [
    figure(
      [...frustumMarks(10, 5, 12, { R: "10 cm", r: "5 cm", h: "12 cm" }), ...frustumTip(10, 5, 12, "12 cm")],
      "A bucket shaped like a frustum: radii 10 cm and 5 cm, height 12 cm, with its sides extended in dashes to the tip of the whole cone, 12 cm higher.",
      "圆台形的水桶：半径 10 厘米和 5 厘米，高 12 厘米；虚线把侧面延长到整个圆锥的顶点，再高 12 厘米。",
    ),
  ],
  knowledgePoints: [
    {
      id: "frustum-as-a-difference-of-cones",
      figure: solidDrawings["frustum-as-a-difference-of-cones"],
      title: t("A difference of cones", "两个圆锥之差"),
      explanation: t(
        `Cutting a cone by a plane parallel to its base removes a small cone from the top and leaves a **frustum**: a solid with two parallel circular faces of different sizes. The whole cone is the frustum and the small cone together, so the frustum's volume is the whole cone minus the small cone.

A cone of radius $6$ cm and height $8$ cm, with the top cone of radius $3$ cm and height $4$ cm cut off, leaves

$$V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 - \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 96\\pi - 12\\pi = 84\\pi\\text{ cm}^3.$$

> **Watch out.** Subtract the small cone, do not add it. Do not subtract the lengths first: a cone of radius $6 - 3$ and height $8 - 4$ is not the frustum. Keep the $\\frac{1}{3}$ on both cones, and do not stop at the whole cone.`,
        `用平行于底面的平面截圆锥，截去顶部的小圆锥，剩下的部分叫**圆台**：它有两个大小不同、互相平行的圆面。整个圆锥由圆台和小圆锥组成，所以圆台的体积是整个圆锥减去小圆锥。

半径 $6$ 厘米、高 $8$ 厘米的圆锥，截去半径 $3$ 厘米、高 $4$ 厘米的顶部小圆锥后，剩下

$$V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 - \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 96\\pi - 12\\pi = 84\\pi\\text{ cm}^3.$$

> **注意。** 小圆锥要减去，不是加上。不要先把长度相减：半径 $6 - 3$、高 $8 - 4$ 的圆锥不是圆台。两个圆锥都要乘 $\\frac{1}{3}$，也不要只算整个圆锥。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [p, q] = [rng.int(1, 4), rng.int(1, 4)];
        const a = rng.int(2, 4);
        const b = rng.int(1, a - 1);
        const [R, H, r, h] = [a * p, a * q * 2, b * p, b * q * 2];
        const big = Q.of(R * R * H, 3);
        const small = Q.of(r * r * h, 3);
        const v = big.sub(small);
        const inner = R * R + R * r + r * r;
        return {
          ...piProblem({
            prompt: t(
              `A cone has radius $${tex(R, u)}$ and height $${tex(H, u)}$. A plane parallel to the base cuts off a small cone of radius $${tex(r, u)}$ and height $${tex(h, u)}$ from the top. Find the volume of the frustum that remains, in $${unitTex(u, 3)}$. ${inPi.en}`,
              `一个圆锥的半径是 $${tex(R, u)}$，高是 $${tex(H, u)}$。用平行于底面的平面从顶部截去一个半径 $${tex(r, u)}$、高 $${tex(h, u)}$ 的小圆锥。求剩下的圆台的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [big.add(small), Q.of((R - r) ** 2 * (H - h), 3), big, Q.of(R * R * H - r * r * h)],
            solution: t(
              `**Step 1: the whole cone.**${steps(`\\frac{1}{3}\\pi \\cdot ${R}^2 \\cdot ${H} = ${piTex(big)}`)}**Step 2: the small cone.**${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(small)}`)}**Step 3: subtract.** The frustum is what is left of the whole cone:${steps(`V = ${piTex(big)} - ${piTex(small)} = ${piTex(v)}\\text{ ${u}}^3`)}**Check.** The frustum is $${H} - ${h} = ${H - h}$ tall with radii $${R}$ and $${r}$, and the frustum formula gives the same: $\\frac{1}{3}\\pi \\cdot ${H - h} \\cdot (${R}^2 + ${R} \\cdot ${r} + ${r}^2) = \\frac{1}{3}\\pi \\cdot ${H - h} \\cdot ${inner} = ${piTex(v)}$.`,
              `**第一步：整个圆锥。**${steps(`\\frac{1}{3}\\pi \\cdot ${R}^2 \\cdot ${H} = ${piTex(big)}`)}**第二步：小圆锥。**${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(small)}`)}**第三步：相减。** 圆台是整个圆锥剩下的部分：${steps(`V = ${piTex(big)} - ${piTex(small)} = ${piTex(v)}\\text{ ${u}}^3`)}**检验。** 圆台高 $${H} - ${h} = ${H - h}$，两个半径是 $${R}$ 和 $${r}$，用圆台公式得到同样的结果：$\\frac{1}{3}\\pi \\cdot ${H - h} \\cdot (${R}^2 + ${R} \\cdot ${r} + ${r}^2) = \\frac{1}{3}\\pi \\cdot ${H - h} \\cdot ${inner} = ${piTex(v)}$。`,
            ),
          }),
          figure: figure(
            [
              ...coneMarks(R, H, { r: len(R, u), h: len(H, u) }),
              {
                kind: "segment",
                a: [(-fitBox([2 * R, H])[0]! / 2) * (b / a), fitBox([2 * R, H])[1]! * (1 - b / a)],
                b: [(fitBox([2 * R, H])[0]! / 2) * (b / a), fitBox([2 * R, H])[1]! * (1 - b / a)],
                accent: true,
              },
            ],
            `A cone with radius ${R} ${u} and height ${H} ${u}, cut by a plane parallel to its base.`,
            `一个半径 ${R} ${u}、高 ${H} ${u} 的圆锥，被平行于底面的平面所截。`,
          ),
        };
      },
    },
    {
      id: "frustum-volume-formula",
      title: t("The volume formula", "圆台的体积公式"),
      explanation: t(
        `Working out the difference of the two cones once and for all gives the volume of a frustum with radii $R$ and $r$ and height $h$, the distance between the circular faces:

$$V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right).$$

It needs no cone at all, only the frustum's own measurements. With $R = 6$, $r = 3$ and $h = 4$: $V = \\frac{1}{3}\\pi \\cdot 4 \\cdot (36 + 18 + 9) = \\frac{1}{3}\\pi \\cdot 4 \\cdot 63 = 84\\pi$, as before.

> **Watch out.** Do not leave out the middle term $Rr$, and keep the $\\frac{1}{3}$: it is not $\\frac{1}{2}$, and without it the answer is three times too big. $(R - r)^2$ is not $R^2 + Rr + r^2$.`,
        `一次性地把两个圆锥之差算出来，就得到上下底面半径为 $R$ 和 $r$、高为 $h$（两个圆面之间的距离）的圆台的体积：

$$V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right).$$

它不需要圆锥，只用圆台自己的尺寸。当 $R = 6$、$r = 3$、$h = 4$ 时：$V = \\frac{1}{3}\\pi \\cdot 4 \\cdot (36 + 18 + 9) = \\frac{1}{3}\\pi \\cdot 4 \\cdot 63 = 84\\pi$，与前面相同。

> **注意。** 不要漏掉中间项 $Rr$，也不要丢掉 $\\frac{1}{3}$：它不是 $\\frac{1}{2}$，没有它答案就大了三倍。$(R - r)^2$ 不等于 $R^2 + Rr + r^2$。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 8);
        const R = rng.int(r + 1, 12);
        const h = rng.int(2, 12);
        const inner = R * R + R * r + r * r;
        const v = Q.of(h * inner, 3);
        return {
          ...piProblem({
            prompt: t(
              `A frustum of a cone has radii $${tex(R, u)}$ and $${tex(r, u)}$, and height $${tex(h, u)}$. Find its volume, in $${unitTex(u, 3)}$. ${inPi.en}`,
              `一个圆台的上下底面半径分别是 $${tex(r, u)}$ 和 $${tex(R, u)}$，高是 $${tex(h, u)}$。求它的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [Q.of(h * (R * R + r * r), 3), h * inner, Q.of(h * (R * R + r * r), 2), Q.of(h * (R - r) ** 2, 3)],
            solution: t(
              `**Step 1: the bracket.** Square each radius and add their product:${steps(`R^2 + Rr + r^2 = ${R}^2 + ${R} \\cdot ${r} + ${r}^2 = ${R * R} + ${R * r} + ${r * r} = ${inner}`)}**Step 2: the volume.**${steps(`V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right) = \\frac{1}{3}\\pi \\cdot ${h} \\cdot ${inner} = ${piTex(v)}\\text{ ${u}}^3`)}**Check.** The frustum sits between the cylinder of radius $${r}$ inside it and the cylinder of radius $${R}$ around it, both $${h}$ tall: $\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}$ and $\\pi \\cdot ${R}^2 \\cdot ${h} = ${piTex(R * R * h)}$. Its volume $${piTex(v)}$ lies between them, as it must.`,
              `**第一步：括号里的数。** 两个半径各自平方，再加上它们的乘积：${steps(`R^2 + Rr + r^2 = ${R}^2 + ${R} \\cdot ${r} + ${r}^2 = ${R * R} + ${R * r} + ${r * r} = ${inner}`)}**第二步：体积。**${steps(`V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right) = \\frac{1}{3}\\pi \\cdot ${h} \\cdot ${inner} = ${piTex(v)}\\text{ ${u}}^3`)}**检验。** 圆台介于里面半径 $${r}$ 的圆柱和外面半径 $${R}$ 的圆柱之间，两个圆柱都高 $${h}$：$\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}$，$\\pi \\cdot ${R}^2 \\cdot ${h} = ${piTex(R * R * h)}$。圆台的体积 $${piTex(v)}$ 在两者之间，理应如此。`,
            ),
          }),
          figure: figure(
            frustumMarks(R, r, h, { R: len(R, u), r: len(r, u), h: len(h, u) }),
            `A frustum of a cone with radii ${R} ${u} and ${r} ${u} and height ${h} ${u}.`,
            `一个底面半径 ${R} ${u}、顶面半径 ${r} ${u}、高 ${h} ${u} 的圆台。`,
          ),
        };
      },
    },
    {
      id: "surface-area-of-a-frustum",
      figure: geometryDrawings2["conical-frustums#surface-area-of-a-frustum"],
      title: t("Surface area of a frustum", "圆台的表面积"),
      explanation: t(
        `The slant height $l$ of a frustum is measured along its side, between the two circles. Unrolled, the side is a curved band whose two edges are the circumferences $2\\pi R$ and $2\\pi r$, $l$ apart. Like a trapezoid, its area is the average of the two edges times the width:

$$L = \\frac{2\\pi R + 2\\pi r}{2} \\cdot l = \\pi(R + r)l.$$

The total surface area adds the two circles: $S = \\pi(R + r)l + \\pi R^2 + \\pi r^2$. If the height is given, the slant height is the hypotenuse of a right triangle with legs $h$ and $R - r$.

With $R = 7$, $r = 4$ and $l = 5$: $L = \\pi \\cdot 11 \\cdot 5 = 55\\pi$ and $S = 55\\pi + 49\\pi + 16\\pi = 120\\pi$.

> **Watch out.** Add the radii, $R + r$, not subtract them. Use the slant height, not the height, in the lateral area. And for the total, add both circles, not just the bottom one.`,
        `圆台的母线长 $l$ 是沿侧面量出的两个圆之间的距离。侧面展开后是一条弯曲的带子，两条边分别是周长 $2\\pi R$ 和 $2\\pi r$，相距 $l$。和梯形一样，它的面积是两条边的平均数乘以宽：

$$L = \\frac{2\\pi R + 2\\pi r}{2} \\cdot l = \\pi(R + r)l.$$

表面积再加上两个圆：$S = \\pi(R + r)l + \\pi R^2 + \\pi r^2$。如果给的是高，母线就是直角边为 $h$ 和 $R - r$ 的直角三角形的斜边。

当 $R = 7$、$r = 4$、$l = 5$ 时：$L = \\pi \\cdot 11 \\cdot 5 = 55\\pi$，$S = 55\\pi + 49\\pi + 16\\pi = 120\\pi$。

> **注意。** 两个半径要相加，$R + r$，不是相减。侧面积用母线长，不用高。求表面积要加上两个圆，不只是底面。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples.slice(0, 5));
        const [d, h] = rng.bool() ? [a, b] : [b, a];
        const r = rng.int(1, 8);
        const R = r + d;
        const l = c;
        const lateral = (R + r) * l;
        const total = lateral + R * R + r * r;
        const fromHeight = rng.bool();
        const askTotal = rng.bool();
        const answer = askTotal ? total : lateral;
        const [bigL, smallL] = [Q.of(l * R, d), Q.of(l * r, d)];
        const [latBig, latSmall] = [Q.of(R * R * l, d), Q.of(r * r * l, d)];
        const given = fromHeight
          ? t(`height $${tex(h, u)}$`, `高是 $${tex(h, u)}$`)
          : t(`slant height $${tex(l, u)}$`, `母线长是 $${tex(l, u)}$`);
        const slantStep = fromHeight
          ? t(
              `**Step 1: the slant height.** Drop the height from the edge of the top circle: it makes a right triangle with legs $${h}$ and $${R} - ${r} = ${d}$, and the slant height as hypotenuse:${steps(`l = \\sqrt{${h}^2 + ${d}^2} = \\sqrt{${l * l}} = ${l}`)}`,
              `**第一步：母线长。** 从上底圆周向下作高：它和母线组成直角三角形，两条直角边是 $${h}$ 和 $${R} - ${r} = ${d}$，母线是斜边：${steps(`l = \\sqrt{${h}^2 + ${d}^2} = \\sqrt{${l * l}} = ${l}`)}`,
            )
          : t(
              `**Step 1: the slant height.** It is given: $l = ${l}$, measured along the side between the circles.

`,
              `**第一步：母线长。** 已知 $l = ${l}$，沿侧面量出的两个圆之间的距离。

`,
            );
        const totalStep = askTotal
          ? t(
              `**Step 3: the two circles.** Add the bottom and the top:${steps(`S = ${piTex(lateral)} + \\pi \\cdot ${R}^2 + \\pi \\cdot ${r}^2 = ${piTex(lateral)} + ${piTex(R * R)} + ${piTex(r * r)} = ${piTex(total)}\\text{ ${u}}^2`)}`,
              `**第三步：两个圆。** 加上下底和上底：${steps(`S = ${piTex(lateral)} + \\pi \\cdot ${R}^2 + \\pi \\cdot ${r}^2 = ${piTex(lateral)} + ${piTex(R * R)} + ${piTex(r * r)} = ${piTex(total)}\\text{ ${u}}^2`)}`,
            )
          : t("", "");
        return {
          ...piProblem({
            prompt: t(
              `A frustum of a cone has radii $${tex(R, u)}$ and $${tex(r, u)}$, and ${given.en}. Find its ${askTotal ? "total surface area" : "lateral area"}, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `一个圆台的上下底面半径分别是 $${tex(r, u)}$ 和 $${tex(R, u)}$，${given["zh-CN"]}。求它的${askTotal ? "表面积" : "侧面积"}（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: answer,
            wrong: askTotal ? [lateral, lateral + R * R, (R + r) * h + R * R + r * r] : [(R - r) * l, total, (R + r) * h, R * l],
            solution: t(
              `${slantStep.en}{{figure 0}}

**Step 2: the lateral area.**${steps(`L = \\pi(R + r)l = \\pi(${R} + ${r}) \\cdot ${l} = ${piTex(lateral)}${askTotal ? "" : `\\text{ ${u}}^2`}`)}${totalStep.en}**Check.** As a difference of cones: extend the side to the tip. Slant heights grow in step with the radii, and the frustum's $${l}$ covers the difference $${R} - ${r} = ${d}$, so the whole cone has slant height $\\frac{${l} \\cdot ${R}}{${d}} = ${num(bigL)}$ and the cut-off cone $\\frac{${l} \\cdot ${r}}{${d}} = ${num(smallL)}$. Their lateral areas $\\pi r l$ differ by $\\pi \\cdot ${R} \\cdot ${num(bigL)} - \\pi \\cdot ${r} \\cdot ${num(smallL)} = ${piTex(latBig)} - ${piTex(latSmall)} = ${piTex(lateral)}$, the same lateral area.`,
              `${slantStep["zh-CN"]}{{figure 0}}

**第二步：侧面积。**${steps(`L = \\pi(R + r)l = \\pi(${R} + ${r}) \\cdot ${l} = ${piTex(lateral)}${askTotal ? "" : `\\text{ ${u}}^2`}`)}${totalStep["zh-CN"]}**检验。** 看成两个圆锥之差：把侧面延长到顶点。母线长与半径成比例，圆台的母线 $${l}$ 对应半径之差 $${R} - ${r} = ${d}$，所以整个圆锥的母线长是 $\\frac{${l} \\cdot ${R}}{${d}} = ${num(bigL)}$，截去的小圆锥的母线长是 $\\frac{${l} \\cdot ${r}}{${d}} = ${num(smallL)}$。它们的侧面积 $\\pi r l$ 之差是 $\\pi \\cdot ${R} \\cdot ${num(bigL)} - \\pi \\cdot ${r} \\cdot ${num(smallL)} = ${piTex(latBig)} - ${piTex(latSmall)} = ${piTex(lateral)}$，侧面积相同。`,
            ),
          }),
          solutionFigures: [
            figure(
              frustumMarks(R, r, h, { R: len(R, u), r: len(r, u), ...(fromHeight ? { h: len(h, u), l: "?" } : { l: len(l, u) }) }),
              `A frustum with radii ${R} ${u} and ${r} ${u}, ${fromHeight ? `height ${h} ${u} and unknown slant height` : `slant height ${l} ${u}`}.`,
              `圆台，半径 ${R} ${u} 和 ${r} ${u}，${fromHeight ? `高 ${h} ${u}，母线长未知` : `母线长 ${l} ${u}`}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** revolutionSolids are the solids a rotation can produce. */
const revolutionSolids: readonly Text[] = [t("cylinder", "圆柱"), t("cone", "圆锥"), t("sphere", "球"), t("frustum of a cone", "圆台")];

/** revolutionReasons explain why each solid of revolutionSolids, other than the one swept out, does not fit. */
const revolutionReasons: readonly [string, string][] = [
  [
    "A cylinder needs a side parallel to the axis, so that the radius is the same all along; here the radius changes.",
    "圆柱需要一条与轴平行的边，使半径处处相同；这里的半径是变化的。",
  ],
  [
    "A cone needs a straight slanted side that reaches the axis at one point, the apex; this shape has no such side.",
    "圆锥需要一条倾斜的直边，在一点（顶点）与轴相交；这个图形没有这样的边。",
  ],
  [
    "A sphere comes from a curved edge, every point of it the same distance from a center on the axis; this shape has straight sides.",
    "球由一条曲线边旋转而成，曲线上每一点到轴上的球心距离都相同；这个图形的边是直的。",
  ],
  [
    "A frustum needs two parallel sides of different lengths at right angles to the axis, joined by a slanted side; this shape has no such pair.",
    "圆台需要两条与轴垂直、长度不同的平行边，由一条斜边连接；这个图形没有这样的一对边。",
  ],
];

export const volumesOfRevolution: TopicDef = {
  id: "volumes-of-revolution",
  title: t("Volumes of Revolution", "旋转体的体积"),
  summary: t(
    "Name the solid swept out by rotating a plane shape about a line, and find the volume of cylinders and cones made this way.",
    "说出平面图形绕直线旋转形成的立体图形，并求这样得到的圆柱和圆锥的体积。",
  ),
  prerequisites: ["volumes-of-right-cones", "volumes-of-spheres", "the-coordinate-plane"],
  encompasses: [{ topic: "volumes-of-right-cones", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSG.GMD.B.4"],
  intro: t(
    `Spin a paper right triangle on a stick taped along one leg, fast, and you see a solid cone. Take legs of $4$ cm and $3$ cm, with the stick along the $4$ cm leg. That leg stays where it is and becomes the height. The $3$ cm leg, at a right angle to the stick, sweeps a circle of radius $3$ cm: the base. The slanted side sweeps the curved surface between the base and the tip.

{{figure 0}}

So the triangle sweeps a cone of radius $3$ cm and height $4$ cm, of volume

$$V = \\frac{1}{3}\\pi \\cdot 3^2 \\cdot 4 = 12\\pi \\approx 37.7\\text{ cm}^3.$$

Turning a plane shape a full turn about a line sweeps out a **solid of revolution**. In this lesson we name the solid a shape sweeps out and find the volumes of the cylinders and cones made this way.`,
    `把一张直角三角形纸片的一条直角边贴在小棒上，快速转动，就会看到一个实心的圆锥。取两条直角边为 $4$ 厘米和 $3$ 厘米，小棒贴着 $4$ 厘米的直角边。这条直角边不动，成为高。与小棒垂直的 $3$ 厘米直角边扫出半径 $3$ 厘米的圆：底面。斜边在底面和顶点之间扫出曲面。

{{figure 0}}

所以这个三角形扫出半径 $3$ 厘米、高 $4$ 厘米的圆锥，体积是

$$V = \\frac{1}{3}\\pi \\cdot 3^2 \\cdot 4 = 12\\pi \\approx 37.7\\text{ cm}^3.$$

把一个平面图形绕一条直线旋转一周，扫出的立体图形叫**旋转体**。这节课我们说出图形旋转后形成的立体图形，并求这样得到的圆柱和圆锥的体积。`,
  ),
  introFigures: [
    figure(
      [
        {
          kind: "shade",
          points: [
            [0, 0],
            [3, 0],
            [0, 4],
          ],
        },
        ...coneMarks(3, 4, { r: "3 cm", h: "4 cm" }),
        { kind: "segment", a: [0, -1.4], b: [0, 0], dashed: true },
        { kind: "segment", a: [0, 4], b: [0, 5], dashed: true },
        { kind: "label", at: [0, 5], text: "axis", dir: "n" },
      ],
      "A right triangle with legs 4 cm and 3 cm, shaded, turned about its 4 cm leg on a vertical axis, sweeping out a cone of radius 3 cm and height 4 cm.",
      "一个两条直角边为 4 厘米和 3 厘米的直角三角形（阴影），绕竖直的轴上 4 厘米的直角边旋转，扫出半径 3 厘米、高 4 厘米的圆锥。",
    ),
  ],
  knowledgePoints: [
    {
      id: "solids-of-revolution",
      figure: geometryDrawings2["volumes-of-revolution#solids-of-revolution"],
      title: t("Solids of revolution", "旋转体"),
      explanation: t(
        `Rotating a plane shape a full turn about a line in its plane, the **axis**, sweeps out a **solid of revolution**. Each point of the shape traces a circle around the axis, so what matters is how far each part of the shape is from the axis.

- A rectangle rotated about one of its sides makes a cylinder: the opposite side stays at one distance.
- A right triangle rotated about one of its legs makes a cone: the distance shrinks to nothing at the apex.
- A semicircle rotated about its diameter makes a sphere: every point of the arc stays the same distance from the center.
- A right trapezoid rotated about the side perpendicular to its bases makes a frustum of a cone: two circles of different sizes joined by a slanted side.

For example, a right trapezoid with parallel sides $2$ and $5$, turned about the side joining them at right angles, sweeps circles of radius $2$ and $5$, joined by the slanted side: a frustum.

> **Watch out.** A shape that is symmetric about the axis, such as a whole circle or an isosceles triangle, sweeps the same solid as its half: the other half passes through the same space. A whole circle gives a sphere, not a cylinder, and an isosceles triangle turned about its line of symmetry gives a cone, not a frustum.`,
        `把一个平面图形绕它所在平面内的一条直线（**轴**）旋转一周，扫过的空间形成**旋转体**。图形上的每一点都绕轴画出一个圆，所以关键是图形的各部分离轴有多远。

- 长方形绕它的一条边旋转得到圆柱：对边到轴的距离始终不变。
- 直角三角形绕它的一条直角边旋转得到圆锥：距离在顶点处缩为零。
- 半圆绕它的直径旋转得到球：弧上每一点到圆心的距离都相同。
- 直角梯形绕垂直于两底的腰旋转得到圆台：两个大小不同的圆由斜腰连接。

例如，两底为 $2$ 和 $5$ 的直角梯形绕与两底垂直的腰旋转，扫出半径 $2$ 和 $5$ 的两个圆，由斜腰连接：得到圆台。

> **注意。** 关于轴对称的图形，比如整个圆或等腰三角形，扫出的立体图形和它的一半相同：另一半经过的是同一片空间。整个圆得到球，不是圆柱；等腰三角形绕对称轴旋转得到圆锥，不是圆台。`,
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const x = rng.int(2, 12);
        const other = rng.int(2, 12);
        // Different lengths, so that "its x leg" names one leg.
        const y = other === x ? other + 1 : other;
        const rectangle = t(
          "The side on the axis stays where it is. The opposite side is parallel to it, so every point of it stays at the same distance from the axis and it sweeps a curved surface of constant radius. The two sides at right angles to the axis sweep two equal circles.",
          "轴上的边不动。对边与它平行，上面每一点到轴的距离都相同，扫出半径不变的曲面。与轴垂直的两条边扫出两个相等的圆。",
        );
        const cases: readonly [Text, number, Text][] = [
          [
            t(
              `A rectangle $${x}$ ${u} by $${y}$ ${u} is rotated about one of its sides.`,
              `一个 $${x}$ ${u} × $${y}$ ${u} 的长方形绕它的一条边旋转一周。`,
            ),
            0,
            rectangle,
          ],
          [
            t(`A square with side $${x}$ ${u} is rotated about one of its sides.`, `一个边长 $${x}$ ${u} 的正方形绕它的一条边旋转一周。`),
            0,
            t(
              `A square is a rectangle. ${rectangle.en} Here the radius and the height are both $${x}$.`,
              `正方形是长方形。${rectangle["zh-CN"]}这里半径和高都是 $${x}$。`,
            ),
          ],
          [
            t(
              `A right triangle with legs $${x}$ ${u} and $${y}$ ${u} is rotated about its $${x}$ ${u} leg.`,
              `一个两条直角边为 $${x}$ ${u} 和 $${y}$ ${u} 的直角三角形绕长 $${x}$ ${u} 的直角边旋转一周。`,
            ),
            1,
            t(
              `The $${x}$ leg on the axis stays where it is and becomes the height. The $${y}$ leg meets the axis at a right angle and sweeps a circle of radius $${y}$, the base. The hypotenuse runs from the edge of that circle to a point on the axis, so it sweeps a surface that narrows to a point.`,
              `轴上长 $${x}$ 的直角边不动，成为高。长 $${y}$ 的直角边与轴垂直，扫出半径 $${y}$ 的圆，即底面。斜边从这个圆的边缘连到轴上的一点，所以扫出收拢到一点的曲面。`,
            ),
          ],
          [
            t(
              `An isosceles triangle with base $${2 * x}$ ${u} is rotated about its line of symmetry.`,
              `一个底边为 $${2 * x}$ ${u} 的等腰三角形绕它的对称轴旋转一周。`,
            ),
            1,
            t(
              `The line of symmetry cuts the triangle into two right triangles, and the other half passes through the space the first one sweeps, so look at one half. Its leg on the axis becomes the height, its other leg, half the base, sweeps a circle of radius $${x}$, and its slanted side reaches the axis at the apex.`,
              `对称轴把三角形分成两个直角三角形，另一半经过的正是前一半扫出的空间，所以只看一半。它在轴上的直角边成为高，另一条直角边（底边的一半）扫出半径 $${x}$ 的圆，斜边在顶点处与轴相交。`,
            ),
          ],
          [
            t(`A semicircle of radius $${x}$ ${u} is rotated about its diameter.`, `一个半径为 $${x}$ ${u} 的半圆绕它的直径旋转一周。`),
            2,
            t(
              `The diameter lies on the axis, and so does the center. Every point of the arc is $${x}$ from the center, and it stays $${x}$ from the center as it turns, so the arc sweeps every point at distance $${x}$ from the center.`,
              `直径在轴上，圆心也在轴上。弧上每一点到圆心的距离都是 $${x}$，旋转时仍然是 $${x}$，所以弧扫出到圆心距离为 $${x}$ 的所有点。`,
            ),
          ],
          [
            t(
              `A circle of radius $${x}$ ${u} is rotated about one of its diameters.`,
              `一个半径为 $${x}$ ${u} 的圆绕它的一条直径旋转一周。`,
            ),
            2,
            t(
              `The diameter cuts the circle into two semicircles, and the other half passes through the space the first one sweeps, so look at one semicircle. Every point of it is $${x}$ from the center on the axis and stays so as it turns.`,
              `直径把圆分成两个半圆，另一半经过的正是前一半扫出的空间，所以只看一个半圆。它上面每一点到轴上圆心的距离都是 $${x}$，旋转时始终如此。`,
            ),
          ],
          [
            t(
              `A right trapezoid with parallel sides $${x}$ ${u} and $${x + y}$ ${u} is rotated about the side perpendicular to them.`,
              `一个两底分别为 $${x}$ ${u} 和 $${x + y}$ ${u} 的直角梯形绕垂直于两底的腰旋转一周。`,
            ),
            3,
            t(
              `The side on the axis stays where it is and becomes the height. The parallel sides meet the axis at right angles and sweep circles of radii $${x}$ and $${x + y}$. The slanted side joins the edges of those circles without reaching the axis.`,
              `轴上的腰不动，成为高。两底与轴垂直，扫出半径 $${x}$ 和 $${x + y}$ 的两个圆。斜腰连接这两个圆的边缘，不与轴相交。`,
            ),
          ],
          [
            t(
              `A rectangle $${x}$ ${u} by $${y}$ ${u} is rotated about the line joining the midpoints of two opposite sides.`,
              `一个 $${x}$ ${u} × $${y}$ ${u} 的长方形绕连接一组对边中点的直线旋转一周。`,
            ),
            0,
            t(
              "The line cuts the rectangle into two smaller rectangles, and the other half passes through the space the first one sweeps, so look at one half: a rectangle turned about one of its sides. Its side parallel to the axis stays at one distance and sweeps a curved surface of constant radius.",
              "这条直线把长方形分成两个小长方形，另一半经过的正是前一半扫出的空间，所以只看一半：一个绕自己一条边旋转的长方形。它与轴平行的边到轴的距离不变，扫出半径不变的曲面。",
            ),
          ],
        ];
        const [desc, answer, parts] = rng.pick(cases);
        const named = revolutionSolids[answer]!;
        const section = [
          t("a rectangle, which is what a cut through the axis of a cylinder shows", "一个长方形，正是圆柱过轴的截面"),
          t("an isosceles triangle, which is what a cut through the axis of a cone shows", "一个等腰三角形，正是圆锥过轴的截面"),
          t("a circle, which is what a cut through the center of a sphere shows", "一个圆，正是球过球心的截面"),
          t("an isosceles trapezoid, which is what a cut through the axis of a frustum shows", "一个等腰梯形，正是圆台过轴的截面"),
        ][answer]!;
        const problem = choiceProblem({
          prompt: t(`${desc.en} What solid does it sweep out?`, `${desc["zh-CN"]}它形成什么立体图形？`),
          options: revolutionSolids,
          correct: answer,
          solution: t(
            `**Step 1: follow each side around the axis.** ${parts.en}

**Step 2: name the solid.** The shape sweeps out a ${named.en}.

**Check.** Cut the solid by a plane through the axis. The cut shows the shape together with its mirror image across the axis: ${section.en}.`,
            `**第一步：看每条边绕轴转出什么。** ${parts["zh-CN"]}

**第二步：说出立体图形。** 这个图形扫出${named["zh-CN"]}。

**检验。** 用过轴的平面截这个立体图形，截面是原图形和它关于轴的镜像合在一起：${section["zh-CN"]}。`,
          ),
        });
        const reasons: Reason[] = revolutionSolids.flatMap((o, i): Reason[] =>
          i === answer ? [] : [[o.en, revolutionReasons[i]![0], revolutionReasons[i]![1]]],
        );
        return reasoned(problem, reasons);
      },
    },
    {
      id: "rotating-rectangles",
      figure: geometryDrawings2["volumes-of-revolution#rotating-rectangles"],
      title: t("Rotating rectangles", "旋转长方形"),
      explanation: t(
        `When a rectangle is rotated about one of its sides, that side stays on the axis and becomes the height of the cylinder. The adjacent side meets the axis at a right angle and sweeps the base, so it becomes the radius. Which side is which depends on the axis.

The rectangle with vertices $(0, 0)$, $(5, 0)$, $(5, 2)$ and $(0, 2)$ rotated about the $x$-axis makes a cylinder with height $5$ and radius $2$, so $V = \\pi \\cdot 2^2 \\cdot 5 = 20\\pi$. Rotated about the $y$-axis it makes a cylinder with height $2$ and radius $5$: $V = \\pi \\cdot 5^2 \\cdot 2 = 50\\pi$. The same rectangle gives different volumes, because the radius is squared.

> **Watch out.** The side on the axis is the height, not the radius: do not swap them. The answer is a volume, not the rectangle's area $ab$ or its double, and a cylinder has no $\\frac{1}{3}$.`,
        `长方形绕它的一条边旋转时，这条边留在轴上，成为圆柱的高。相邻的边与轴垂直，扫出底面，成为底面半径。哪条边是高、哪条边是半径，取决于轴。

顶点为 $(0, 0)$、$(5, 0)$、$(5, 2)$、$(0, 2)$ 的长方形绕 $x$ 轴旋转，得到高 $5$、半径 $2$ 的圆柱，所以 $V = \\pi \\cdot 2^2 \\cdot 5 = 20\\pi$。绕 $y$ 轴旋转则得到高 $2$、半径 $5$ 的圆柱：$V = \\pi \\cdot 5^2 \\cdot 2 = 50\\pi$。同一个长方形得到的体积不同，因为半径要平方。

> **注意。** 轴上的边是高，不是半径：不要弄反。答案是体积，不是长方形的面积 $ab$ 或它的两倍，圆柱也没有 $\\frac{1}{3}$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.int(1, 10), rng.int(1, 10)];
        } while (a === b);
        const aboutX = rng.bool();
        const [r, h] = aboutX ? [b, a] : [a, b];
        const axis = aboutX ? "x" : "y";
        const v = r * r * h;
        const box = 4 * v;
        const approx = String(Math.round(314 * v) / 100);
        return {
          ...piProblem({
            prompt: t(
              `The rectangle with vertices $(0, 0)$, $(${a}, 0)$, $(${a}, ${b})$ and $(0, ${b})$ is rotated about the $${axis}$-axis. Find the volume of the solid it sweeps out. ${inPi.en}`,
              `顶点为 $(0, 0)$、$(${a}, 0)$、$(${a}, ${b})$、$(0, ${b})$ 的长方形绕 $${axis}$ 轴旋转一周。求所得立体图形的体积。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [h * h * r, a * b, 2 * a * b, Q.of(v, 3)],
            solution: t(
              `**Step 1: the height and the radius.** The side on the $${axis}$-axis, from $(0, 0)$ to $${aboutX ? `(${a}, 0)` : `(0, ${b})`}$, stays put and becomes the height: $h = ${h}$. The side at a right angle to the axis sweeps the base, so it is the radius: $r = ${r}$.

{{figure 0}}

**Step 2: the volume of the cylinder.**${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}**Check.** The cylinder fits in a box $${2 * r}$ by $${2 * r}$ by $${h}$, of volume $${box}$. A circle fills $\\frac{\\pi}{4}$, about four fifths, of its square, and $${piTex(v)} \\approx ${approx}$ is indeed about four fifths of $${box}$.`,
              `**第一步：高和半径。** 在 $${axis}$ 轴上的边，从 $(0, 0)$ 到 $${aboutX ? `(${a}, 0)` : `(0, ${b})`}$，保持不动，成为高：$h = ${h}$。与轴垂直的边扫出底面，是半径：$r = ${r}$。

{{figure 0}}

**第二步：圆柱的体积。**${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}**检验。** 这个圆柱正好放进 $${2 * r} \\times ${2 * r} \\times ${h}$ 的长方体，长方体体积是 $${box}$。圆占它外切正方形的 $\\frac{\\pi}{4}$，约五分之四；$${piTex(v)} \\approx ${approx}$ 确实约为 $${box}$ 的五分之四。`,
            ),
          }),
          solutionFigures: [
            figure(
              cylinderMarks(r, h, { r: String(r), h: String(h) }),
              `The cylinder swept out, standing on its axis: radius ${r}, height ${h}.`,
              `扫出的圆柱，立在它的轴上：半径 ${r}，高 ${h}。`,
            ),
          ],
        };
      },
    },
    {
      id: "rotating-right-triangles",
      figure: geometryDrawings2["volumes-of-revolution#rotating-right-triangles"],
      title: t("Rotating right triangles", "旋转直角三角形"),
      explanation: t(
        `When a right triangle is rotated about one of its legs, that leg stays on the axis and becomes the height of the cone. The other leg meets the axis at a right angle and sweeps the base, so it becomes the radius, and the hypotenuse sweeps the curved surface.

The triangle with vertices $(0, 0)$, $(6, 0)$ and $(0, 3)$ rotated about the $x$-axis makes a cone with height $6$ and radius $3$: $V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 6 = 18\\pi$. Rotated about the $y$-axis it makes a cone with height $3$ and radius $6$: $V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 3 = 36\\pi$.

> **Watch out.** The leg on the axis is the height, not the radius. Keep the $\\frac{1}{3}$ of a cone: without it you have the cylinder, and $\\frac{1}{2}$ belongs to the triangle's area, not the cone.`,
        `直角三角形绕它的一条直角边旋转时，这条直角边留在轴上，成为圆锥的高。另一条直角边与轴垂直，扫出底面，成为底面半径；斜边扫出侧面。

顶点为 $(0, 0)$、$(6, 0)$、$(0, 3)$ 的三角形绕 $x$ 轴旋转，得到高 $6$、半径 $3$ 的圆锥：$V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 6 = 18\\pi$。绕 $y$ 轴旋转则得到高 $3$、半径 $6$ 的圆锥：$V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 3 = 36\\pi$。

> **注意。** 轴上的直角边是高，不是半径。圆锥的 $\\frac{1}{3}$ 不能丢：没有它就成了圆柱；$\\frac{1}{2}$ 属于三角形的面积，不属于圆锥。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.int(1, 10), rng.int(1, 10)];
        } while (a === b);
        const aboutX = rng.bool();
        const [r, h] = aboutX ? [b, a] : [a, b];
        const axis = aboutX ? "x" : "y";
        const v = Q.of(r * r * h, 3);
        return {
          ...piProblem({
            prompt: t(
              `The triangle with vertices $(0, 0)$, $(${a}, 0)$ and $(0, ${b})$ is rotated about the $${axis}$-axis. Find the volume of the solid it sweeps out. ${inPi.en}`,
              `顶点为 $(0, 0)$、$(${a}, 0)$、$(0, ${b})$ 的三角形绕 $${axis}$ 轴旋转一周。求所得立体图形的体积。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [Q.of(h * h * r, 3), r * r * h, Q.of(a * b, 2), Q.of(r * r * h, 2)],
            solution: t(
              `**Step 1: the height and the radius.** The triangle has a right angle at the origin. Its leg on the $${axis}$-axis stays put and becomes the height, $h = ${h}$; the other leg sweeps the base, so it is the radius, $r = ${r}$. The hypotenuse sweeps the curved surface of a cone.

{{figure 0}}

**Step 2: the volume of the cone.**${steps(`V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}**Check.** The rectangle with vertices $(0, 0)$, $(${a}, 0)$, $(${a}, ${b})$ and $(0, ${b})$ contains the triangle and sweeps a cylinder of the same radius and height: $\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}$. A cone is one third of its cylinder, and $\\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}$.`,
              `**第一步：高和半径。** 三角形的直角在原点。它在 $${axis}$ 轴上的直角边不动，成为高 $h = ${h}$；另一条直角边扫出底面，是半径 $r = ${r}$。斜边扫出圆锥的侧面。

{{figure 0}}

**第二步：圆锥的体积。**${steps(`V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}**检验。** 顶点为 $(0, 0)$、$(${a}, 0)$、$(${a}, ${b})$、$(0, ${b})$ 的长方形包含这个三角形，它扫出半径和高都相同的圆柱：$\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}$。圆锥是同底等高圆柱的三分之一：$\\frac{1}{3} \\cdot ${piTex(r * r * h)} = ${piTex(v)}$。`,
            ),
          }),
          solutionFigures: [
            figure(
              coneMarks(r, h, { r: String(r), h: String(h) }),
              `The cone swept out, standing on its axis: radius ${r}, height ${h}.`,
              `扫出的圆锥，立在它的轴上：半径 ${r}，高 ${h}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** solidGeometryTopics are the topics on solid geometry, in teaching order. */
export const solidGeometryTopics: readonly TopicDef[] = [
  identifyingThreeDimensionalShapes,
  facesVerticesAndEdgesOfPolyhedrons,
  netsOfPolyhedrons,
  findingSurfaceAreasUsingNets,
  eulersFormulaForPolyhedra,
  theFivePlatonicSolids,
  volumesOfCubes,
  surfaceAreasOfCubes,
  faceDiagonalsOfCubes,
  diagonalsOfCubes,
  volumesOfRectangularSolids,
  surfaceAreasOfRectangularSolids,
  diagonalsOfRectangularSolids,
  theDistanceFormulaInThreeDimensions,
  volumesOfPyramids,
  surfaceAreasOfPyramids,
  surfaceAreasAndVolumesOfSimilarSolids,
  volumesOfCylinders,
  surfaceAreasOfCylinders,
  volumesOfRightCones,
  slantHeightsOfRightCones,
  surfaceAreasOfRightCones,
  volumesOfSpheres,
  surfaceAreasOfSpheres,
  conicalFrustums,
  volumesOfRevolution,
];
