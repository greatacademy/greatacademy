import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, type Mark, num, type Point, Q, radical, simplifyRadical, sketch } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, radicalProblem, solutionsProblem, steps, yesNo } from "../problems.ts";

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** len writes a length for a figure: "8 cm". */
const len = (v: Coefficient, u: Unit) => `${toQ(v).isInteger() ? toQ(v).toString() : dec(v)} ${u}`;

/** tex writes a length, an area or a volume in LaTeX: "8\text{ cm}", "24\text{ cm}^2". */
const tex = (v: Coefficient, u: Unit, power = 1) => `${num(v)}\\text{ ${u}}${power > 1 ? `^${power}` : ""}`;

/** unitTex writes a unit of length, area or volume alone: "\text{cm}^3". */
const unitTex = (u: Unit, power: number) => `\\text{${u}}${power > 1 ? `^${power}` : ""}`;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** piTex writes c·π: "\pi", "36\pi", "\frac{32}{3}\pi". */
function piTex(c: Coefficient): string {
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
function piProblem(p: { prompt: Text; coef: Coefficient; solution: Text; wrong?: readonly Coefficient[] }): Problem {
  return expressionProblem({
    prompt: p.prompt,
    answer: piTex(p.coef),
    simplified: true,
    solution: p.solution,
    wrong: (p.wrong ?? []).filter((w) => toQ(w).sign() > 0).map(piTex),
  });
}

/** inPi is the instruction to answer exactly, in terms of π. */
const inPi = t("Give the exact answer in terms of $\\pi$.", "用含 $\\pi$ 的式子给出精确答案。");

/** fitBox enlarges small dimensions so that a drawing stays readable: none is less than a third of the largest. */
function fitBox(vs: readonly number[]): number[] {
  const m = Math.max(...vs);
  return vs.map((v) => Math.max(v, m / 3));
}

/** P3 projects a point of space onto the page in oblique projection, depth going up and to the right. */
const P3 = (x: number, y: number, z: number): Point => [x + 0.45 * z, y + 0.3 * z];

/** BoxLabels are the labels of a box's length, depth and height. */
interface BoxLabels {
  readonly l?: string;
  readonly d?: string;
  readonly h?: string;
}

/** boxMarks draws a box l long, d deep and h high, with hidden edges dashed and an optional diagonal. */
function boxMarks(L: number, D: number, H: number, labels: BoxLabels, diagonal?: "space" | "front"): Mark[] {
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
function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, dashed: boolean): Mark[] {
  const n = 16;
  const at = (i: number): Point => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  };
  return Array.from({ length: n }, (_, i): Mark => ({ kind: "segment", a: at(i), b: at(i + 1), dashed }));
}

/** ellipse is a closed ellipse drawn as a polygon. */
function ellipse(cx: number, cy: number, rx: number, ry: number): Mark {
  return {
    kind: "polygon",
    points: Array.from({ length: 40 }, (_, i): Point => [cx + rx * Math.cos((i * Math.PI) / 20), cy + ry * Math.sin((i * Math.PI) / 20)]),
  };
}

/** RoundLabels are the labels of a round solid's radius (or diameter), height and slant height. */
interface RoundLabels {
  readonly r?: string;
  readonly d?: string;
  readonly h?: string;
  readonly l?: string;
}

/** cylinderMarks draws a cylinder of radius R and height H. */
function cylinderMarks(R: number, H: number, labels: RoundLabels): Mark[] {
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
function coneMarks(R: number, H: number, labels: RoundLabels): Mark[] {
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
interface PyramidLabels {
  readonly l?: string;
  readonly d?: string;
  readonly h?: string;
  readonly s?: string;
}

/** pyramidMarks draws a pyramid on an l by d rectangular base, with its apex above the center. */
function pyramidMarks(L: number, D: number, H: number, labels: PyramidLabels): Mark[] {
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
    marks.push({ kind: "label", at: [(apex[0] + foot[0]) / 2, (apex[1] + foot[1]) / 2], text: labels.h, dir: "w" });
  }
  if (labels.s) {
    const mid = p(0.5, 0);
    marks.push({ kind: "segment", a: apex, b: mid, accent: true });
    marks.push({ kind: "label", at: [(apex[0] + mid[0]) / 2, (apex[1] + mid[1]) / 2], text: labels.s, dir: "e" });
  }
  if (labels.l) marks.push({ kind: "side", a: p(0, 0), b: p(1, 0), text: labels.l });
  if (labels.d) marks.push({ kind: "side", a: p(1, 0), b: p(1, 1), text: labels.d });
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

/** squaresNet draws unit squares at cells, with optional labels at their centers. */
function squaresNet(cells: readonly Cell[], labels?: readonly string[]): Mark[] {
  return cells.flatMap(([c, r], i): Mark[] => {
    const square: Mark = {
      kind: "polygon",
      points: [
        [c, r],
        [c + 1, r],
        [c + 1, r + 1],
        [c, r + 1],
      ],
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

/** article is "a" or "an" before an English word. */
const article = (word: string) => (/^[aeiou]/.test(word) ? "an" : "a");

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

export const identifyingThreeDimensionalShapes: TopicDef = {
  id: "identifying-three-dimensional-shapes",
  title: t("Identifying Three-Dimensional Shapes", "认识立体图形"),
  summary: t(
    "Recognize prisms, pyramids, cylinders, cones and spheres, and tell polyhedra from solids with curved surfaces.",
    "认识棱柱、棱锥、圆柱、圆锥和球，并区分多面体与有曲面的立体图形。",
  ),
  prerequisites: ["angles-of-polygons"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.GMD.B.4"],
  knowledgePoints: [
    {
      id: "prisms-and-pyramids",
      title: t("Prisms and pyramids", "棱柱与棱锥"),
      explanation: t(
        "A **solid** is a three-dimensional shape. A **prism** has two congruent, parallel faces called **bases**, joined by rectangles. A **pyramid** has one base, and triangles rise from the sides of the base to meet at a single point, the **apex**.\n\nPrisms and pyramids are named after the shape of the base: a prism whose bases are hexagons is a **hexagonal prism**, and a pyramid whose base is a square is a **square pyramid**. A prism with rectangular bases is a **rectangular prism** (a box), and a rectangular prism whose faces are all squares is a **cube**.\n\nFor example, a solid whose faces are $2$ pentagons and $5$ rectangles is a pentagonal prism.",
        "**立体图形**是三维的图形。**棱柱**有两个全等且互相平行的面，叫作**底面**，两个底面之间由长方形连接。**棱锥**只有一个底面，从底面各边升起的三角形交于一点，这一点叫作棱锥的**顶点**。\n\n棱柱和棱锥按底面的形状命名：底面是六边形的棱柱是**六棱柱**，底面是正方形的棱锥是**四棱锥**。底面是长方形的棱柱是**长方体**，各面都是正方形的长方体是**正方体**。\n\n例如，各面是 $2$ 个五边形和 $5$ 个长方形的立体图形是五棱柱。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 7, 8]);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const shape = kind === "prism" ? prism(n) : pyramid(n);
        const style = rng.int(0, 2);
        const p = shape.polygon;
        let desc: Text;
        if (style === 0) {
          desc =
            kind === "prism"
              ? n === 4
                ? t("Its faces are $6$ rectangles.", "它的各面是 $6$ 个长方形。")
                : t(`Its faces are $2$ ${p.en}s and $${n}$ rectangles.`, `它的各面是 $2$ 个${p["zh-CN"]}和 $${n}$ 个长方形。`)
              : t(`Its faces are $1$ ${p.en} and $${n}$ triangles.`, `它的各面是 $1$ 个${p["zh-CN"]}和 $${n}$ 个三角形。`);
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
        } else {
          desc =
            kind === "prism"
              ? t(
                  `It has $${2 * n}$ vertices: $${n}$ on each of two parallel ${shape.adjective} bases.`,
                  `它有 $${2 * n}$ 个顶点：两个平行的${p["zh-CN"]}底面上各有 $${n}$ 个。`,
                )
              : t(
                  `It has $${n + 1}$ vertices: $${n}$ around ${article(shape.adjective)} ${shape.adjective} base and one apex above it.`,
                  `它有 $${n + 1}$ 个顶点：${p["zh-CN"]}底面上有 $${n}$ 个，上方还有一个顶点。`,
                );
        }
        const { options, correct } = shapeOptions(rng, shape, kind);
        return choiceProblem({
          prompt: t(
            `A solid is described as follows. ${desc.en} What is it?`,
            `一个立体图形的描述如下。${desc["zh-CN"]}它是什么立体图形？`,
          ),
          options,
          correct,
          solution:
            kind === "prism"
              ? t(
                  `Two parallel congruent bases joined by rectangles make a prism, and its bases are ${p.en}s: it is ${article(shape.name.en)} ${shape.name.en}.`,
                  `由长方形连接的两个平行且全等的底面说明它是棱柱，底面是${p["zh-CN"]}，所以它是${shape.name["zh-CN"]}。`,
                )
              : t(
                  `One base with triangles meeting at an apex makes a pyramid, and its base is ${article(p.en)} ${p.en}: it is ${article(shape.name.en)} ${shape.name.en}.`,
                  `一个底面加上交于一点的三角形说明它是棱锥，底面是${p["zh-CN"]}，所以它是${shape.name["zh-CN"]}。`,
                ),
        });
      },
    },
    {
      id: "solids-with-curved-surfaces",
      title: t("Cylinders, cones and spheres", "圆柱、圆锥与球"),
      explanation: t(
        "Some solids have curved surfaces. A **cylinder** has two congruent, parallel circular bases joined by a curved surface. A **cone** has one circular base and a curved surface that narrows to a single point, its apex. A **sphere** is the set of all points in space at the same distance, the **radius**, from a center; half of a sphere, cut through its center, is a **hemisphere**.\n\nEveryday objects are modeled by solids: a can of soup is a cylinder, an ice-cream cone is a cone, a basketball is a sphere and a shoebox is a rectangular prism.",
        "有些立体图形有曲面。**圆柱**有两个全等且平行的圆形底面，由一个曲面连接。**圆锥**有一个圆形底面，曲面收拢到一点，即它的顶点。**球**是空间中到一个定点（球心）距离等于定长（**半径**）的所有点组成的图形；过球心把球截成两半，每一半是**半球**。\n\n日常物体可以用立体图形来表示：汤罐头是圆柱，冰淇淋蛋筒是圆锥，篮球是球，鞋盒是长方体。",
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
        return choiceProblem({
          prompt: useObject
            ? t(`Which solid best models ${en}?`, `哪种立体图形最能表示${zh}？`)
            : t(`Which solid is described? ${en}`, `下面描述的是哪种立体图形？${zh}`),
          options: order.map((i) => everydaySolids[i]!),
          correct: order.indexOf(index),
          solution: useObject
            ? t(`The shape of ${en} is that of a ${answer.en}.`, `${zh}的形状是${answer["zh-CN"]}。`)
            : t(`This is the definition of a ${answer.en}.`, `这是${answer["zh-CN"]}的定义。`),
        });
      },
    },
    {
      id: "polyhedra",
      title: t("Polyhedra", "多面体"),
      explanation: t(
        "A **polyhedron** (plural *polyhedra*) is a solid whose faces are all polygons. Prisms, pyramids and cubes are polyhedra. Cylinders, cones, spheres and hemispheres are not, because part of their surface is curved.\n\nOf a cone, a cube, a sphere and a cylinder, only the cube is a polyhedron.",
        "**多面体**是各面都是多边形的立体图形。棱柱、棱锥和正方体都是多面体。圆柱、圆锥、球和半球都不是多面体，因为它们的表面有一部分是弯曲的。\n\n在圆锥、正方体、球和圆柱中，只有正方体是多面体。",
      ),
      generate(rng) {
        const askPolyhedron = rng.bool();
        const odd = askPolyhedron ? rng.pick(polyhedra) : rng.pick(roundSolids);
        const rest = askPolyhedron ? rng.sample(roundSolids, 3) : rng.sample(polyhedra, 3);
        const all = rng.shuffle([odd, ...rest]);
        const listEn = `${all
          .slice(0, 3)
          .map((s) => `${article(s.en)} ${s.en}`)
          .join(", ")} and ${article(all[3]!.en)} ${all[3]!.en}`;
        const listZh = `${all
          .slice(0, 3)
          .map((s) => s["zh-CN"])
          .join("、")}和${all[3]!["zh-CN"]}`;
        return choiceProblem({
          prompt: askPolyhedron
            ? t(`Here are four solids: ${listEn}. Which of them is a polyhedron?`, `这里有四个立体图形：${listZh}。其中哪一个是多面体？`)
            : t(
                `Here are four solids: ${listEn}. Which of them is not a polyhedron?`,
                `这里有四个立体图形：${listZh}。其中哪一个不是多面体？`,
              ),
          options: all,
          correct: all.indexOf(odd),
          solution: askPolyhedron
            ? t(
                `Every face of ${article(odd.en)} ${odd.en} is a polygon, so it is a polyhedron; the other three have curved surfaces.`,
                `${odd["zh-CN"]}的每个面都是多边形，所以它是多面体；另外三个都有曲面。`,
              )
            : t(
                `${article(odd.en) === "a" ? "A" : "An"} ${odd.en} has a curved surface, so it is not a polyhedron; the other three have only polygon faces.`,
                `${odd["zh-CN"]}有曲面，所以不是多面体；另外三个的面都是多边形。`,
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
    return t(`${article(s.name.en)} ${s.name.en}`, s.name["zh-CN"]);
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

export const facesVerticesAndEdgesOfPolyhedrons: TopicDef = {
  id: "faces-vertices-and-edges-of-polyhedrons",
  title: t("Faces, Vertices, and Edges of Polyhedrons", "多面体的面、顶点和棱"),
  summary: t(
    "Count the faces, vertices and edges of prisms and pyramids, and find the base from a count.",
    "数出棱柱和棱锥的面数、顶点数和棱数，并由这些数确定底面。",
  ),
  prerequisites: ["identifying-three-dimensional-shapes"],
  encompasses: [{ topic: "identifying-three-dimensional-shapes", weight: 0.3 }],
  xp: 12,
  knowledgePoints: [
    {
      id: "counting-for-prisms",
      title: t("Counting for prisms", "棱柱的计数"),
      explanation: t(
        "A **face** of a polyhedron is one of its flat polygon surfaces, an **edge** is a segment where two faces meet, and a **vertex** is a corner where edges meet.\n\nA prism whose bases have $n$ sides has\n\n- $n + 2$ faces: two bases and $n$ rectangles;\n- $2n$ vertices: $n$ on each base;\n- $3n$ edges: $n$ on each base and $n$ joining the bases.\n\nA pentagonal prism has $7$ faces, $10$ vertices and $15$ edges.",
        "多面体的**面**是它的平面多边形表面，**棱**是两个面相交的线段，**顶点**是棱相交的角点。\n\n底面有 $n$ 条边的棱柱有\n\n- $n + 2$ 个面：两个底面和 $n$ 个长方形；\n- $2n$ 个顶点：每个底面上 $n$ 个；\n- $3n$ 条棱：每个底面上 $n$ 条，连接两个底面的 $n$ 条。\n\n五棱柱有 $7$ 个面、$10$ 个顶点和 $15$ 条棱。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const which = rng.int(0, 2);
        const [en, zh] = counts[which]!;
        const values = [n + 2, 2 * n, 3 * n];
        const name = solidName(n, "prism");
        const answer = values[which]!;
        return numberProblem({
          prompt: t(`How many ${en} does ${name.en} have?`, `${name["zh-CN"]}有多少个${zh}？`),
          answer,
          form: "integer",
          wrong: [...values, n, n + 1, 2 * n + 2],
          solution: t(
            `The bases have $n = ${n}$ sides. A prism has $n + 2$ faces, $2n$ vertices and $3n$ edges, so it has $${answer}$ ${en}.`,
            `底面边数 $n = ${n}$。棱柱有 $n + 2$ 个面、$2n$ 个顶点、$3n$ 条棱，所以它有 $${answer}$ 个${zh}。`,
          ),
        });
      },
    },
    {
      id: "counting-for-pyramids",
      title: t("Counting for pyramids", "棱锥的计数"),
      explanation: t(
        "A pyramid whose base has $n$ sides has\n\n- $n + 1$ faces: the base and $n$ triangles;\n- $n + 1$ vertices: $n$ on the base and the apex;\n- $2n$ edges: $n$ around the base and $n$ rising to the apex.\n\nA hexagonal pyramid has $7$ faces, $7$ vertices and $12$ edges.",
        "底面有 $n$ 条边的棱锥有\n\n- $n + 1$ 个面：底面和 $n$ 个三角形；\n- $n + 1$ 个顶点：底面上 $n$ 个，再加上顶点；\n- $2n$ 条棱：底面上 $n$ 条，通向顶点的 $n$ 条。\n\n六棱锥有 $7$ 个面、$7$ 个顶点和 $12$ 条棱。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const which = rng.int(0, 2);
        const [en, zh] = counts[which]!;
        const values = [n + 1, n + 1, 2 * n];
        const name = solidName(n, "pyramid");
        const answer = values[which]!;
        return numberProblem({
          prompt: t(`How many ${en} does ${name.en} have?`, `${name["zh-CN"]}有多少个${zh}？`),
          answer,
          form: "integer",
          wrong: [n, n + 2, 2 * n, 3 * n, 2 * n + 2],
          solution: t(
            `The base has $n = ${n}$ sides. A pyramid has $n + 1$ faces, $n + 1$ vertices and $2n$ edges, so it has $${answer}$ ${en}.`,
            `底面边数 $n = ${n}$。棱锥有 $n + 1$ 个面、$n + 1$ 个顶点、$2n$ 条棱，所以它有 $${answer}$ 个${zh}。`,
          ),
        });
      },
    },
    {
      id: "finding-the-base",
      title: t("Finding the base from a count", "由计数确定底面"),
      explanation: t(
        "The counts can be read backward. A prism with $24$ edges has $3n = 24$, so each base has $n = 8$ sides: it is an octagonal prism. A pyramid with $9$ faces has $n + 1 = 9$, so its base has $8$ sides.",
        "这些计数也可以倒过来用。有 $24$ 条棱的棱柱满足 $3n = 24$，所以每个底面有 $n = 8$ 条边，它是八棱柱。有 $9$ 个面的棱锥满足 $n + 1 = 9$，所以底面有 $8$ 条边。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const which = rng.int(0, 2);
        const [en, zh, letter] = counts[which]!;
        const formula = kind === "prism" ? ["n + 2", "2n", "3n"][which]! : ["n + 1", "n + 1", "2n"][which]!;
        const value = kind === "prism" ? [n + 2, 2 * n, 3 * n][which]! : [n + 1, n + 1, 2 * n][which]!;
        const wrong = [value, value - 1, value - 2, value / 2, value / 3].filter((w) => Number.isInteger(w) && w > 0);
        return numberProblem({
          prompt:
            kind === "prism"
              ? t(
                  `A prism has $${value}$ ${en}. How many sides does each of its bases have?`,
                  `一个棱柱有 $${value}$ 个${zh}。它的每个底面有几条边？`,
                )
              : t(
                  `A pyramid has $${value}$ ${en}. How many sides does its base have?`,
                  `一个棱锥有 $${value}$ 个${zh}。它的底面有几条边？`,
                ),
          answer: n,
          form: "integer",
          wrong,
          solution: t(
            `For a ${kind} with $n$ sides on the base, $${letter} = ${formula}$:${steps(`${formula} = ${value}`, `n = ${n}`)}`,
            `底面有 $n$ 条边的${kind === "prism" ? "棱柱" : "棱锥"}满足 $${letter} = ${formula}$：${steps(`${formula} = ${value}`, `n = ${n}`)}`,
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
  encompasses: [
    { topic: "faces-vertices-and-edges-of-polyhedrons", weight: 0.3 },
    { topic: "identifying-three-dimensional-shapes", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.6.G.A.4"],
  knowledgePoints: [
    {
      id: "folding-a-net",
      title: t("The solid of a net", "展开图对应的立体图形"),
      explanation: t(
        "A **net** of a polyhedron is a flat pattern of its faces, joined edge to edge, that folds up into the solid.\n\nA net of a prism has two copies of the base and a strip of rectangles, one for each side of the base. A net of a pyramid has one base with a triangle on each of its sides.\n\nSo a net made of one hexagon with six triangles around it folds into a hexagonal pyramid.",
        "多面体的**展开图**是把它的各面沿棱连接、平铺在平面上的图形，折起来就得到这个立体图形。\n\n棱柱的展开图有两个底面和一排长方形，底面的每条边对应一个长方形。棱锥的展开图有一个底面，底面的每条边上各有一个三角形。\n\n所以由一个六边形和它周围六个三角形组成的展开图，折起来是六棱锥。",
      ),
      generate(rng) {
        const n = rng.int(3, 8);
        const kind = rng.pick(["prism", "pyramid"] as const);
        const shape = kind === "prism" ? prism(n) : pyramid(n);
        const marks =
          kind === "prism" ? prismNet(n, rng.int(0, n - 1), rng.pick([2.5, 3, 3.5, 4])) : pyramidNet(n, rng.pick([1.6, 2, 2.4, 2.8]));
        const { options, correct } = shapeOptions(rng, shape, kind);
        const p = shape.polygon;
        return {
          ...choiceProblem({
            prompt: t("Which solid does this net fold into?", "这个展开图折起来是什么立体图形？"),
            options,
            correct,
            solution:
              kind === "prism"
                ? t(
                    `The net has two ${p.en}s and a strip of $${n}$ rectangles, so it folds into ${article(shape.name.en)} ${shape.name.en}.`,
                    `展开图有两个${p["zh-CN"]}和一排 $${n}$ 个长方形，所以折起来是${shape.name["zh-CN"]}。`,
                  )
                : t(
                    `The net has one ${p.en} with a triangle on each of its $${n}$ sides, so it folds into ${article(shape.name.en)} ${shape.name.en}.`,
                    `展开图有一个${p["zh-CN"]}，它的 $${n}$ 条边上各有一个三角形，所以折起来是${shape.name["zh-CN"]}。`,
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
        };
      },
    },
    {
      id: "opposite-faces-of-a-cube",
      title: t("Opposite faces of a cube", "正方体的相对面"),
      explanation: t(
        "A cube has $6$ square faces in $3$ pairs of opposite faces. In a net, two squares in a straight row with exactly one square between them become opposite faces: in a row of four squares, the first and third are opposite, and so are the second and fourth. A square attached above the row and a square attached below it are opposite each other.\n\nTwo squares that share an edge in the net are never opposite: they meet along that edge.",
        "正方体有 $6$ 个正方形的面，组成 $3$ 对相对面。在展开图中，同一行里中间恰好隔着一个正方形的两个正方形折起来是相对面：一行四个正方形中，第一个与第三个相对，第二个与第四个相对。连在这一行上方的正方形与连在下方的正方形相对。\n\n在展开图中有公共边的两个正方形一定不是相对面：它们沿这条边相邻。",
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
        return {
          ...choiceProblem({
            prompt: t(
              `The net is folded into a cube. Which face is opposite face ${label}?`,
              `把这个展开图折成正方体。哪个面与面 ${label} 相对？`,
            ),
            options: options.map((o) => t(o, o)),
            correct: options.indexOf(answer),
            solution: rowCase
              ? t(
                  `Faces ${label} and ${answer} lie in the row of four with one square between them, so they are opposite.`,
                  `面 ${label} 和面 ${answer} 在四个一行的正方形中，中间隔着一个正方形，所以它们相对。`,
                )
              : t(
                  `Faces ${label} and ${answer} are the squares attached above and below the row of four, so they are opposite.`,
                  `面 ${label} 和面 ${answer} 分别连在四个一行的正方形的上方和下方，所以它们相对。`,
                ),
          }),
          figure: figure(
            squaresNet(cubeNetCells(a, b), labels),
            "A net of a cube: a row of four squares with one square above and one below, labeled with letters.",
            "一个正方体的展开图：一行四个正方形，上方和下方各连一个正方形，各面标有字母。",
          ),
        };
      },
    },
    {
      id: "nets-of-a-cube",
      title: t("Is it a net of a cube?", "是不是正方体的展开图"),
      explanation: t(
        "Not every pattern of six squares folds into a cube. Fold it in your mind, one square at a time: if two squares would land on the same face, the pattern is not a net.\n\n- A row of five or more squares overlaps itself.\n- Two squares attached on the same side of a row of four both land on the same face.\n- A $2 \\times 3$ block of squares cannot fold closed.\n\nA row of four squares with one square attached above it and one below it, anywhere along the row, is always a net of a cube.",
        "并不是任意六个正方形拼成的图形都能折成正方体。在脑中一个面一个面地折：如果有两个正方形落在同一个面上，它就不是展开图。\n\n- 五个或更多正方形排成一行会重叠。\n- 在一行四个正方形的同一侧连两个正方形，它们会落在同一个面上。\n- $2 \\times 3$ 的正方形方块无法折成封闭的正方体。\n\n一行四个正方形，上方连一个、下方连一个（连在这一行的任何位置），一定是正方体的展开图。",
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        let cells: Cell[];
        let reason: Text;
        if (kind <= 2) {
          cells = cubeNetCells(rng.int(0, 3), rng.int(0, 3));
          reason = t(
            "It is a row of four squares with one square above and one below, so it folds into a cube.",
            "它是一行四个正方形，上方和下方各连一个正方形，所以能折成正方体。",
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
            "The two squares on the same side of the row of four would land on the same face.",
            "连在一行四个正方形同一侧的两个正方形会落在同一个面上。",
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
          reason = t("A row of five squares overlaps itself when folded.", "一行五个正方形折起来会重叠。");
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
            "A $2 \\times 3$ block of squares cannot fold into a closed cube.",
            "$2 \\times 3$ 的正方形方块无法折成封闭的正方体。",
          );
        }
        const isNet = kind <= 2;
        return {
          ...choiceProblem({
            prompt: t("Can this pattern of six squares be folded into a cube?", "这六个正方形组成的图形能折成正方体吗？"),
            options: yesNo,
            correct: isNet ? 0 : 1,
            solution: reason,
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
  prerequisites: ["nets-of-polyhedrons", "area-of-triangles"],
  encompasses: [
    { topic: "area-of-triangles", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.6.G.A.4"],
  knowledgePoints: [
    {
      id: "nets-of-boxes",
      title: t("Nets of boxes", "长方体的展开图"),
      explanation: t(
        "The **surface area** of a polyhedron is the total area of its faces, which is the area of its net. It is measured in square units.\n\nA box $l$ long, $w$ wide and $h$ high has three pairs of equal rectangular faces, so\n\n$$S = 2lw + 2lh + 2wh.$$\n\nA box $5$ cm by $3$ cm by $2$ cm has $S = 2 \\cdot 15 + 2 \\cdot 10 + 2 \\cdot 6 = 62\\text{ cm}^2$.",
        "多面体的**表面积**是它各个面的面积之和，也就是展开图的面积，用面积单位计量。\n\n长 $l$、宽 $w$、高 $h$ 的长方体有三对相等的长方形面，所以\n\n$$S = 2lw + 2lh + 2wh.$$\n\n长 $5$ 厘米、宽 $3$ 厘米、高 $2$ 厘米的长方体，$S = 2 \\cdot 15 + 2 \\cdot 10 + 2 \\cdot 6 = 62\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const l = rng.int(3, 12);
        const w = rng.int(2, 9);
        const h = rng.int(2, 9);
        const s = 2 * (l * w + l * h + w * h);
        const xs = [0, w, w + l, 2 * w + l, 2 * w + 2 * l];
        const marks: Mark[] = [0, 1, 2, 3].map(
          (i): Mark => ({
            kind: "polygon",
            points: [
              [xs[i]!, 0],
              [xs[i + 1]!, 0],
              [xs[i + 1]!, h],
              [xs[i]!, h],
            ],
          }),
        );
        marks.push(
          {
            kind: "polygon",
            points: [
              [w, h],
              [w + l, h],
              [w + l, h + w],
              [w, h + w],
            ],
          },
          {
            kind: "polygon",
            points: [
              [w, 0],
              [w, -w],
              [w + l, -w],
              [w + l, 0],
            ],
          },
          { kind: "side", a: [0, h], b: [0, 0], text: len(h, u) },
          { kind: "side", a: [0, 0], b: [w, 0], text: len(w, u) },
          { kind: "side", a: [w, -w], b: [w + l, -w], text: len(l, u) },
        );
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
              `The faces come in pairs: two $${l} \\times ${w}$, two $${l} \\times ${h}$ and two $${w} \\times ${h}$ rectangles.${steps(`S = 2 \\cdot ${l * w} + 2 \\cdot ${l * h} + 2 \\cdot ${w * h} = ${tex(s, u, 2)}`)}`,
              `各面成对出现：两个 $${l} \\times ${w}$、两个 $${l} \\times ${h}$ 和两个 $${w} \\times ${h}$ 的长方形。${steps(`S = 2 \\cdot ${l * w} + 2 \\cdot ${l * h} + 2 \\cdot ${w * h} = ${tex(s, u, 2)}`)}`,
            ),
          }),
          figure: figure(
            marks,
            `A net of a box: four rectangles ${h} ${u} high in a row, ${w}, ${l}, ${w} and ${l} ${u} wide, with an ${l} by ${w} rectangle above and below the second one.`,
            `一个长方体的展开图：一排四个高 ${h} ${u} 的长方形，宽依次为 ${w}、${l}、${w}、${l} ${u}，第二个长方形的上下各连着一个 ${l} × ${w} 的长方形。`,
          ),
        };
      },
    },
    {
      id: "nets-of-triangular-prisms",
      title: t("Nets of triangular prisms", "三棱柱的展开图"),
      explanation: t(
        "The net of a triangular prism has two triangles and three rectangles. Each rectangle is as long as the prism, and as wide as one side of the triangle, so the three rectangles together have area (perimeter of the triangle) × (length).\n\nA prism of length $10$ cm whose bases are right triangles with legs $3$ and $4$ cm and hypotenuse $5$ cm has\n\n$$S = 2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 + (3 + 4 + 5) \\cdot 10 = 12 + 120 = 132\\text{ cm}^2.$$",
        "三棱柱的展开图有两个三角形和三个长方形。每个长方形的长等于棱柱的长，宽等于三角形的一条边，所以三个长方形的面积之和是（三角形的周长）×（棱柱的长）。\n\n长 $10$ 厘米、底面是两条直角边为 $3$ 和 $4$ 厘米、斜边为 $5$ 厘米的直角三角形的三棱柱，\n\n$$S = 2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 + (3 + 4 + 5) \\cdot 10 = 12 + 120 = 132\\text{ cm}^2.$$",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples.slice(0, 5));
        const L = rng.int(4, 20);
        const bases = a * b;
        const sides = (a + b + c) * L;
        const s = bases + sides;
        return numberProblem({
          prompt: t(
            `A triangular prism is $${tex(L, u)}$ long. Its bases are right triangles with legs $${tex(a, u)}$ and $${tex(b, u)}$ and hypotenuse $${tex(c, u)}$. Using its net of two triangles and three rectangles, find its surface area.`,
            `一个三棱柱长 $${tex(L, u)}$，底面是两条直角边为 $${tex(a, u)}$ 和 $${tex(b, u)}$、斜边为 $${tex(c, u)}$ 的直角三角形。利用由两个三角形和三个长方形组成的展开图，求它的表面积。`,
          ),
          answer: s,
          form: "integer",
          unit: `${u}^2`,
          wrong: [sides, bases / 2 + sides, 2 * bases + sides, (a * b * L) / 2],
          solution: t(
            `The two triangles have area $2 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${bases}$, and the three rectangles $(${a} + ${b} + ${c}) \\cdot ${L} = ${sides}$:${steps(`S = ${bases} + ${sides} = ${tex(s, u, 2)}`)}`,
            `两个三角形的面积是 $2 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${bases}$，三个长方形的面积是 $(${a} + ${b} + ${c}) \\cdot ${L} = ${sides}$：${steps(`S = ${bases} + ${sides} = ${tex(s, u, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "nets-of-square-pyramids",
      title: t("Nets of square pyramids", "四棱锥的展开图"),
      explanation: t(
        "The net of a square pyramid is a square with a triangle on each side. If the base has side $s$ and each triangle has height $l$ (measured from the base side to the apex), then\n\n$$S = s^2 + 4 \\cdot \\tfrac{1}{2} s l = s^2 + 2sl.$$\n\nWith $s = 6$ cm and $l = 5$ cm, $S = 36 + 60 = 96\\text{ cm}^2$.",
        "四棱锥的展开图是一个正方形，每条边上连着一个三角形。如果底面边长为 $s$，每个三角形的高（从底边到顶点）为 $l$，那么\n\n$$S = s^2 + 4 \\cdot \\tfrac{1}{2} s l = s^2 + 2sl.$$\n\n当 $s = 6$ 厘米、$l = 5$ 厘米时，$S = 36 + 60 = 96\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 14);
        const l = rng.int(Math.ceil(s / 2) + 1, 18);
        const area = s * s + 2 * s * l;
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
              `The square has area $${s}^2 = ${s * s}$ and each triangle $\\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(Q.of(s * l, 2))}$:${steps(`S = ${s * s} + 4 \\cdot ${num(Q.of(s * l, 2))} = ${tex(area, u, 2)}`)}`,
              `正方形的面积是 $${s}^2 = ${s * s}$，每个三角形的面积是 $\\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${num(Q.of(s * l, 2))}$：${steps(`S = ${s * s} + 4 \\cdot ${num(Q.of(s * l, 2))} = ${tex(area, u, 2)}`)}`,
            ),
          }),
          figure: figure(
            pyramidNet(4, (2 * l) / s),
            "A net of a square pyramid: a square with a triangle on each side.",
            "一个四棱锥的展开图：正方形的每条边上连着一个三角形。",
          ),
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
  encompasses: [{ topic: "faces-vertices-and-edges-of-polyhedrons", weight: 0.4 }],
  xp: 12,
  knowledgePoints: [
    {
      id: "missing-count",
      title: t("A missing count", "求未知的计数"),
      explanation: t(
        "For every convex polyhedron (one without dents or holes), the numbers of vertices $V$, edges $E$ and faces $F$ satisfy **Euler's formula**\n\n$$V - E + F = 2.$$\n\nA cube has $8 - 12 + 6 = 2$. If a polyhedron has $10$ faces and $16$ edges, then $V = 2 + E - F = 2 + 16 - 10 = 8$.",
        "每个凸多面体（没有凹陷或孔洞的多面体）的顶点数 $V$、棱数 $E$ 和面数 $F$ 都满足**欧拉公式**\n\n$$V - E + F = 2.$$\n\n正方体有 $8 - 12 + 6 = 2$。如果一个多面体有 $10$ 个面和 $16$ 条棱，那么 $V = 2 + E - F = 2 + 16 - 10 = 8$。",
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
        const solve =
          letter === "E"
            ? `E = V + F - 2 = ${v} + ${f} - 2`
            : letter === "V"
              ? `V = 2 + E - F = 2 + ${e} - ${f}`
              : `F = 2 + E - V = 2 + ${e} - ${v}`;
        return numberProblem({
          prompt: t(
            `A convex polyhedron has $${values[known[0]![2]]}$ ${known[0]![0]} and $${values[known[1]![2]]}$ ${known[1]![0]}. How many ${en} does it have?`,
            `一个凸多面体有 $${values[known[0]![2]]}$ 个${known[0]![1]}和 $${values[known[1]![2]]}$ 个${known[1]![1]}。它有多少个${zh}？`,
          ),
          answer,
          form: "integer",
          wrong: wrongs.filter((w) => w > 0),
          solution: t(
            `By Euler's formula $V - E + F = 2$:${steps(`${solve} = ${answer}`)}`,
            `由欧拉公式 $V - E + F = 2$：${steps(`${solve} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "possible-counts",
      title: t("Possible counts", "判断计数是否可能"),
      explanation: t(
        "Euler's formula is a quick test. If $V - E + F \\ne 2$, no convex polyhedron has those counts.\n\nCan a convex polyhedron have $9$ vertices, $14$ edges and $8$ faces? $9 - 14 + 8 = 3 \\ne 2$, so no.",
        "欧拉公式可以用来快速检验。如果 $V - E + F \\ne 2$，就没有凸多面体具有这样的计数。\n\n一个凸多面体能有 $9$ 个顶点、$14$ 条棱和 $8$ 个面吗？$9 - 14 + 8 = 3 \\ne 2$，所以不能。",
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
        return choiceProblem({
          prompt: t(
            `Can a convex polyhedron have $${v}$ vertices, $${e}$ edges and $${f}$ faces?`,
            `一个凸多面体能有 $${v}$ 个顶点、$${e}$ 条棱和 $${f}$ 个面吗？`,
          ),
          options: yesNo,
          correct: possible ? 0 : 1,
          solution: possible
            ? t(
                `$V - E + F = ${v} - ${e} + ${f} = 2$, as Euler's formula requires, so these counts are possible.`,
                `$V - E + F = ${v} - ${e} + ${f} = 2$，符合欧拉公式，所以这组计数是可能的。`,
              )
            : t(
                `$V - E + F = ${v} - ${e} + ${f} = ${sum} \\ne 2$, so no convex polyhedron has these counts.`,
                `$V - E + F = ${v} - ${e} + ${f} = ${sum} \\ne 2$，所以没有凸多面体具有这组计数。`,
              ),
        });
      },
    },
    {
      id: "counting-from-the-faces",
      title: t("Counting from the faces", "由各面计数"),
      explanation: t(
        "Each edge is shared by exactly two faces. So adding up the sides of all the faces counts every edge twice:\n\n$$E = \\frac{\\text{total number of sides of the faces}}{2}.$$\n\nThen Euler's formula gives $V = 2 + E - F$. A polyhedron with $8$ triangles and $6$ squares as faces has $E = \\frac{8 \\cdot 3 + 6 \\cdot 4}{2} = 24$ edges, $F = 14$ faces and $V = 2 + 24 - 14 = 12$ vertices.",
        "每条棱恰好被两个面共用。所以把所有面的边数加起来，每条棱都被数了两次：\n\n$$E = \\frac{\\text{各面边数之和}}{2}.$$\n\n再由欧拉公式得 $V = 2 + E - F$。各面是 $8$ 个三角形和 $6$ 个正方形的多面体有 $E = \\frac{8 \\cdot 3 + 6 \\cdot 4}{2} = 24$ 条棱、$F = 14$ 个面、$V = 2 + 24 - 14 = 12$ 个顶点。",
      ),
      generate(rng) {
        const { faces, v } = realPolyhedron(rng);
        const sides = faces.reduce((s, [n, c]) => s + n * c, 0);
        const f = faces.reduce((s, [, c]) => s + c, 0);
        const e = sides / 2;
        const askEdges = rng.bool();
        const desc = facesText(faces);
        const sum = faces.map(([n, c]) => `${c} \\cdot ${n}`).join(" + ");
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
                `Each edge belongs to two faces:${steps(`E = \\frac{${sum}}{2} = \\frac{${sides}}{2} = ${e}`)}`,
                `每条棱属于两个面：${steps(`E = \\frac{${sum}}{2} = \\frac{${sides}}{2} = ${e}`)}`,
              )
            : t(
                `Each edge belongs to two faces, so $E = \\frac{${sides}}{2} = ${e}$. There are $F = ${f}$ faces, so by Euler's formula:${steps(`V = 2 + E - F = 2 + ${e} - ${f} = ${v}`)}`,
                `每条棱属于两个面，所以 $E = \\frac{${sides}}{2} = ${e}$。共有 $F = ${f}$ 个面，由欧拉公式：${steps(`V = 2 + E - F = 2 + ${e} - ${f} = ${v}`)}`,
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
  encompasses: [
    { topic: "eulers-formula-for-polyhedra", weight: 0.3 },
    { topic: "angles-of-polygons", weight: 0.2 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "naming-platonic-solids",
      title: t("The five Platonic solids", "五种正多面体"),
      explanation: t(
        "A **Platonic solid** (regular polyhedron) is a convex polyhedron whose faces are congruent regular polygons, with the same number of faces meeting at every vertex. There are exactly five:\n\n| Solid | Faces | At each vertex | $F$ | $V$ | $E$ |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| Tetrahedron | triangles | $3$ | $4$ | $4$ | $6$ |\n| Cube | squares | $3$ | $6$ | $8$ | $12$ |\n| Octahedron | triangles | $4$ | $8$ | $6$ | $12$ |\n| Dodecahedron | pentagons | $3$ | $12$ | $20$ | $30$ |\n| Icosahedron | triangles | $5$ | $20$ | $12$ | $30$ |\n\nThe name gives the number of faces: *tetra* $4$, *octa* $8$, *dodeca* $12$, *icosa* $20$.",
        "**正多面体**（柏拉图立体）是各面都是全等的正多边形、且每个顶点处汇聚的面数都相同的凸多面体。正多面体恰好有五种：\n\n| 名称 | 面的形状 | 每个顶点处的面数 | $F$ | $V$ | $E$ |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| 正四面体 | 正三角形 | $3$ | $4$ | $4$ | $6$ |\n| 正方体 | 正方形 | $3$ | $6$ | $8$ | $12$ |\n| 正八面体 | 正三角形 | $4$ | $8$ | $6$ | $12$ |\n| 正十二面体 | 正五边形 | $3$ | $12$ | $20$ | $30$ |\n| 正二十面体 | 正三角形 | $5$ | $20$ | $12$ | $30$ |\n\n中文名称直接给出面数：四、六、八、十二、二十。",
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
        return choiceProblem({
          prompt: t(
            `A Platonic solid is described as follows. ${desc.en} Which is it?`,
            `一种正多面体的描述如下。${desc["zh-CN"]}它是哪一种？`,
          ),
          options: platonic.map((p) => p.name),
          correct: index,
          solution: t(
            `The ${s.name.en} has $${s.f}$ faces (${many}), $${s.v}$ vertices and $${s.e}$ edges, with $${s.q}$ faces at each vertex.`,
            `${s.name["zh-CN"]}有 $${s.f}$ 个面（${zh}）、$${s.v}$ 个顶点和 $${s.e}$ 条棱，每个顶点处有 $${s.q}$ 个面。`,
          ),
        });
      },
    },
    {
      id: "counting-platonic-solids",
      title: t("Counting with Platonic solids", "正多面体的计数"),
      explanation: t(
        "The counts follow from the faces. An icosahedron has $20$ triangular faces, so it has $\\frac{20 \\cdot 3}{2} = 30$ edges; $5$ faces meet at each vertex, so it has $\\frac{20 \\cdot 3}{5} = 12$ vertices. Euler's formula checks the result: $12 - 30 + 20 = 2$.\n\nThe face angles around one vertex add up to the number of faces there times the angle of one face: at a vertex of an icosahedron, $5 \\cdot 60^\\circ = 300^\\circ$.",
        "这些计数都可以由各面推出。正二十面体有 $20$ 个三角形面，所以有 $\\frac{20 \\cdot 3}{2} = 30$ 条棱；每个顶点处有 $5$ 个面，所以有 $\\frac{20 \\cdot 3}{5} = 12$ 个顶点。用欧拉公式检验：$12 - 30 + 20 = 2$。\n\n一个顶点周围各面的角之和等于这个顶点处的面数乘以一个面的内角：正二十面体的一个顶点处是 $5 \\cdot 60^\\circ = 300^\\circ$。",
      ),
      generate(rng) {
        const s = rng.pick(platonic);
        const [, one, zh] = regularFaces[s.p]!;
        const ask = rng.int(0, 5);
        const angle = interior(s.p);
        const intro = t(
          `A ${s.name.en} has $${s.f}$ faces, each ${one}, with $${s.q}$ faces meeting at each vertex.`,
          `${s.name["zh-CN"]}有 $${s.f}$ 个面，每个面都是${zh}，每个顶点处有 $${s.q}$ 个面。`,
        );
        const sides = s.f * s.p;
        const cases: readonly [Text, number, number[], Text, string?][] = [
          [
            t("How many edges does it have?", "它有多少条棱？"),
            s.e,
            [sides, s.v, sides / s.q],
            t(
              `Each edge is shared by two faces:${steps(`E = \\frac{${s.f} \\cdot ${s.p}}{2} = ${s.e}`)}`,
              `每条棱被两个面共用：${steps(`E = \\frac{${s.f} \\cdot ${s.p}}{2} = ${s.e}`)}`,
            ),
          ],
          [
            t("How many vertices does it have?", "它有多少个顶点？"),
            s.v,
            [sides, s.e, sides / 2 - s.f],
            t(
              `Each vertex is shared by $${s.q}$ faces:${steps(`V = \\frac{${s.f} \\cdot ${s.p}}{${s.q}} = ${s.v}`)}`,
              `每个顶点被 $${s.q}$ 个面共用：${steps(`V = \\frac{${s.f} \\cdot ${s.p}}{${s.q}} = ${s.v}`)}`,
            ),
          ],
          [
            t("What is the sum of the face angles at one vertex, in degrees?", "一个顶点处各面的角之和是多少度？"),
            s.q * angle,
            [360, s.p * angle, 360 - s.q * angle],
            t(
              `Each face angle of ${one} is $${angle}^\\circ$, and $${s.q}$ meet at a vertex:${steps(`${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ`)}`,
              `${zh}的每个内角是 $${angle}^\\circ$，每个顶点处有 $${s.q}$ 个：${steps(`${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ`)}`,
            ),
            "°",
          ],
          [
            t(
              "The **angle defect** at a vertex is $360^\\circ$ minus the sum of the face angles there. What is the angle defect at one vertex, in degrees?",
              "一个顶点处的**角亏**是 $360^\\circ$ 减去这个顶点处各面的角之和。一个顶点处的角亏是多少度？",
            ),
            360 - s.q * angle,
            [s.q * angle, 360 - angle, 720 / s.f],
            t(
              `The face angles at a vertex add to $${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ$:${steps(`360^\\circ - ${s.q * angle}^\\circ = ${360 - s.q * angle}^\\circ`)}`,
              `一个顶点处各面的角之和是 $${s.q} \\cdot ${angle}^\\circ = ${s.q * angle}^\\circ$：${steps(`360^\\circ - ${s.q * angle}^\\circ = ${360 - s.q * angle}^\\circ`)}`,
            ),
            "°",
          ],
          [
            t("What is the sum of all the face angles of all its faces, in degrees?", "它所有面的所有内角之和是多少度？"),
            s.f * s.p * angle,
            [s.f * 180, s.v * 360, s.f * angle],
            t(
              `Each face has $${s.p}$ angles of $${angle}^\\circ$:${steps(`${s.f} \\cdot ${s.p} \\cdot ${angle}^\\circ = ${s.f * s.p * angle}^\\circ`)}`,
              `每个面有 $${s.p}$ 个 $${angle}^\\circ$ 的角：${steps(`${s.f} \\cdot ${s.p} \\cdot ${angle}^\\circ = ${s.f * s.p * angle}^\\circ`)}`,
            ),
            "°",
          ],
          [
            t("How many edges meet at each vertex?", "每个顶点处有多少条棱？"),
            s.q,
            [s.p, s.q + 1, 2 * s.q],
            t(
              `Around a vertex, faces and edges alternate, so as many edges as faces meet there: $${s.q}$.`,
              `在一个顶点周围，面和棱交替出现，所以棱数与面数相同：$${s.q}$。`,
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
      title: t("Why only five", "为什么只有五种"),
      explanation: t(
        "At each vertex of a convex polyhedron, at least $3$ faces meet, and their angles must add up to **less than** $360^\\circ$: at exactly $360^\\circ$ they lie flat, and above it they cannot fitBox.\n\n- Equilateral triangles ($60^\\circ$): $3$, $4$ or $5$ at a vertex ($180^\\circ$, $240^\\circ$, $300^\\circ$), but $6$ make $360^\\circ$.\n- Squares ($90^\\circ$): only $3$ ($270^\\circ$).\n- Regular pentagons ($108^\\circ$): only $3$ ($324^\\circ$).\n- Regular hexagons ($120^\\circ$): $3$ already make $360^\\circ$.\n\nThat leaves five possibilities, the five Platonic solids.",
        "凸多面体的每个顶点处至少有 $3$ 个面，并且这些面的角之和必须**小于** $360^\\circ$：恰好 $360^\\circ$ 时它们铺成平面，超过时则放不下。\n\n- 正三角形（$60^\\circ$）：每个顶点处可以有 $3$、$4$ 或 $5$ 个（$180^\\circ$、$240^\\circ$、$300^\\circ$），$6$ 个就成了 $360^\\circ$。\n- 正方形（$90^\\circ$）：只能有 $3$ 个（$270^\\circ$）。\n- 正五边形（$108^\\circ$）：只能有 $3$ 个（$324^\\circ$）。\n- 正六边形（$120^\\circ$）：$3$ 个就已经是 $360^\\circ$。\n\n只剩下五种可能，就是五种正多面体。",
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
        return choiceProblem({
          prompt: t(
            `Can $${q}$ ${polygon.en} meet at a vertex of a convex polyhedron?`,
            `$${q}$ 个${polygon["zh-CN"]}能在一个凸多面体的顶点处相交吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `Each angle is $${angleTex}^\\circ$, so the angles at the vertex add to $${q} \\cdot ${angleTex}^\\circ = ${sumTex}^\\circ$, which is ${ok ? "less than" : flat ? "exactly" : "more than"} $360^\\circ$. ${ok ? "They can fold up around a vertex." : "They cannot form a vertex of a convex polyhedron."}`,
            `每个角是 $${angleTex}^\\circ$，所以顶点处各角之和是 $${q} \\cdot ${angleTex}^\\circ = ${sumTex}^\\circ$，${ok ? "小于" : flat ? "恰好等于" : "大于"} $360^\\circ$。${ok ? "它们可以围成一个顶点。" : "它们不能构成凸多面体的顶点。"}`,
          ),
        });
      },
    },
  ],
};

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
  encompasses: [
    { topic: "square-roots-and-cube-roots", weight: 0.2 },
    { topic: "powers-of-integers", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.6.G.A.2"],
  knowledgePoints: [
    {
      id: "volume-from-the-edge",
      title: t("Volume from the edge", "由棱长求体积"),
      explanation: t(
        "The **volume** of a solid is the amount of space it fills: the number of unit cubes it takes to fill it. It is measured in cubic units, such as cubic centimeters ($\\text{cm}^3$).\n\nA cube with edge $s$ holds $s$ layers of $s \\times s$ unit cubes, so its volume is\n\n$$V = s^3.$$\n\nA cube with edge $4$ cm has volume $4^3 = 64\\text{ cm}^3$. With edge $1.5$ m, $V = 1.5^3 = 3.375\\text{ m}^3$.",
        "立体图形的**体积**是它所占空间的大小，即填满它需要的单位正方体的个数，用立方厘米（$\\text{cm}^3$）等体积单位计量。\n\n棱长为 $s$ 的正方体可以放 $s$ 层、每层 $s \\times s$ 个单位正方体，所以它的体积是\n\n$$V = s^3.$$\n\n棱长 $4$ 厘米的正方体体积是 $4^3 = 64\\text{ cm}^3$。棱长 $1.5$ 米时，$V = 1.5^3 = 3.375\\text{ m}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.bool(0.75) ? Q.of(rng.int(2, 15)) : Q.of(2 * rng.int(1, 6) + 1, 2);
        const v = s.pow(3);
        const decimal = !s.isInteger();
        return {
          ...numberProblem({
            prompt: t("Find the volume of the cube.", "求这个正方体的体积。"),
            answer: v,
            form: decimal ? "decimal" : "integer",
            unit: `${u}^3`,
            wrong: [s.pow(2), s.mul(Q.of(3)), s.pow(2).mul(Q.of(6)), s.mul(Q.of(12))],
            solution: t(
              `Cube the edge:${steps(`V = ${dec(s)}^3 = ${dec(v)}\\text{ ${u}}^3`)}`,
              `把棱长立方：${steps(`V = ${dec(s)}^3 = ${dec(v)}\\text{ ${u}}^3`)}`,
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
        "To find the edge from the volume, undo the cube with a cube root:\n\n$$s = \\sqrt[3]{V}.$$\n\nA cube with volume $343\\text{ cm}^3$ has edge $\\sqrt[3]{343} = 7$ cm, because $7^3 = 343$.",
        "已知体积求棱长，用立方根抵消立方：\n\n$$s = \\sqrt[3]{V}.$$\n\n体积为 $343\\text{ cm}^3$ 的正方体棱长是 $\\sqrt[3]{343} = 7$ 厘米，因为 $7^3 = 343$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 15);
        const v = s ** 3;
        return numberProblem({
          prompt: t(
            `A cube has a volume of $${tex(v, u, 3)}$. How long is each edge?`,
            `一个正方体的体积是 $${tex(v, u, 3)}$。它的棱长是多少？`,
          ),
          answer: s,
          form: "integer",
          unit: u,
          wrong: [Q.of(v, 3), Q.of(v, 6), s * s, Q.of(v, 12)],
          solution: t(
            `Take the cube root:${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`, `\\text{since } ${s}^3 = ${v}`)}`,
            `取立方根：${steps(`s = \\sqrt[3]{${v}} = ${tex(s, u)}`, `\\text{因为 } ${s}^3 = ${v}`)}`,
          ),
        });
      },
    },
    {
      id: "small-cubes-in-a-large-cube",
      title: t("Small cubes in a large cube", "大正方体中的小正方体"),
      explanation: t(
        "A cube with edge $12$ cm can be packed with cubes of edge $3$ cm: $12 \\div 3 = 4$ fitBox along each edge, so it holds $4^3 = 64$ of them. The same answer comes from the volumes: $\\frac{12^3}{3^3} = \\frac{1728}{27} = 64$.\n\nIn the same way, doubling the edge of a cube multiplies its volume by $2^3 = 8$.",
        "棱长 $12$ 厘米的正方体可以用棱长 $3$ 厘米的小正方体装满：每条棱上能放 $12 \\div 3 = 4$ 个，所以共能放 $4^3 = 64$ 个。用体积计算也得到同样的结果：$\\frac{12^3}{3^3} = \\frac{1728}{27} = 64$。\n\n同理，正方体的棱长扩大到 $2$ 倍，体积就扩大到 $2^3 = 8$ 倍。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool(0.3)) {
          const k = rng.int(2, 6);
          return numberProblem({
            prompt: t(
              `Each edge of a cube is multiplied by $${k}$. By what number is its volume multiplied?`,
              `把一个正方体的每条棱都乘以 $${k}$。它的体积乘以多少？`,
            ),
            answer: k ** 3,
            form: "integer",
            wrong: [k, k * k, 3 * k, 6 * k * k],
            solution: t(`The volume $s^3$ becomes $(${k}s)^3 = ${k ** 3}s^3$.`, `体积 $s^3$ 变成 $(${k}s)^3 = ${k ** 3}s^3$。`),
          });
        }
        const small = rng.int(1, 5);
        const k = rng.int(2, 6);
        const big = small * k;
        return numberProblem({
          prompt: t(
            `How many cubes with edge $${tex(small, u)}$ fitBox exactly inside a cube with edge $${tex(big, u)}$?`,
            `棱长为 $${tex(big, u)}$ 的正方体中恰好能放多少个棱长为 $${tex(small, u)}$ 的小正方体？`,
          ),
          answer: k ** 3,
          form: "integer",
          wrong: [k, k * k, 3 * k, big ** 3],
          solution: t(
            `Along each edge, $${big} \\div ${small} = ${k}$ small cubes fitBox:${steps(`${k}^3 = ${k ** 3}`)}`,
            `每条棱上能放 $${big} \\div ${small} = ${k}$ 个小正方体：${steps(`${k}^3 = ${k ** 3}`)}`,
          ),
        });
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
  encompasses: [
    { topic: "volumes-of-cubes", weight: 0.3 },
    { topic: "finding-surface-areas-using-nets", weight: 0.3 },
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "surface-area-from-the-edge",
      title: t("Surface area from the edge", "由棱长求表面积"),
      explanation: t(
        "A cube has $6$ congruent square faces. With edge $s$, each face has area $s^2$, so the surface area is\n\n$$S = 6s^2.$$\n\nA cube with edge $5$ cm has $S = 6 \\cdot 25 = 150\\text{ cm}^2$. Do not confuse it with the volume, $5^3 = 125\\text{ cm}^3$.",
        "正方体有 $6$ 个全等的正方形面。棱长为 $s$ 时，每个面的面积是 $s^2$，所以表面积是\n\n$$S = 6s^2.$$\n\n棱长 $5$ 厘米的正方体 $S = 6 \\cdot 25 = 150\\text{ cm}^2$。不要和体积 $5^3 = 125\\text{ cm}^3$ 混淆。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the cube.", "求这个正方体的表面积。"),
            answer: 6 * s * s,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s ** 3, s * s, 4 * s * s, 6 * s, 12 * s],
            solution: t(
              `Six square faces of area $${s}^2 = ${s * s}$:${steps(`S = 6 \\cdot ${s * s} = ${tex(6 * s * s, u, 2)}`)}`,
              `六个面积为 $${s}^2 = ${s * s}$ 的正方形面：${steps(`S = 6 \\cdot ${s * s} = ${tex(6 * s * s, u, 2)}`)}`,
            ),
          }),
          figure: cubeFigure(len(s, u)),
        };
      },
    },
    {
      id: "edge-from-the-surface-area",
      title: t("Edge from the surface area", "由表面积求棱长"),
      explanation: t(
        "To find the edge from the surface area, divide by $6$ to get the area of one face, then take the square root:\n\n$$s = \\sqrt{\\frac{S}{6}}.$$\n\nA cube with surface area $294\\text{ cm}^2$ has faces of area $49\\text{ cm}^2$, so its edge is $7$ cm.",
        "已知表面积求棱长，先除以 $6$ 得到一个面的面积，再开平方：\n\n$$s = \\sqrt{\\frac{S}{6}}.$$\n\n表面积为 $294\\text{ cm}^2$ 的正方体每个面的面积是 $49\\text{ cm}^2$，所以棱长是 $7$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 20);
        const area = 6 * s * s;
        return numberProblem({
          prompt: t(
            `A cube has a surface area of $${tex(area, u, 2)}$. How long is each edge?`,
            `一个正方体的表面积是 $${tex(area, u, 2)}$。它的棱长是多少？`,
          ),
          answer: s,
          form: "integer",
          unit: u,
          wrong: [s * s, area / 6, Q.of(area, 4), 6 * s],
          solution: t(
            `One face has area $${area} \\div 6 = ${s * s}$:${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}`,
            `一个面的面积是 $${area} \\div 6 = ${s * s}$：${steps(`s = \\sqrt{${s * s}} = ${tex(s, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "surface-area-and-volume",
      title: t("Surface area and volume", "表面积与体积"),
      explanation: t(
        "To go from one measure of a cube to another, find the edge first.\n\nA cube with volume $216\\text{ cm}^3$ has edge $\\sqrt[3]{216} = 6$ cm, so its surface area is $6 \\cdot 6^2 = 216\\text{ cm}^2$. A cube with surface area $54\\text{ cm}^2$ has edge $\\sqrt{54 \\div 6} = 3$ cm, so its volume is $27\\text{ cm}^3$.",
        "在正方体的两个量之间换算时，先求出棱长。\n\n体积为 $216\\text{ cm}^3$ 的正方体棱长是 $\\sqrt[3]{216} = 6$ 厘米，所以表面积是 $6 \\cdot 6^2 = 216\\text{ cm}^2$。表面积为 $54\\text{ cm}^2$ 的正方体棱长是 $\\sqrt{54 \\div 6} = 3$ 厘米，所以体积是 $27\\text{ cm}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const [v, area] = [s ** 3, 6 * s * s];
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A cube has a volume of $${tex(v, u, 3)}$. Find its surface area.`,
              `一个正方体的体积是 $${tex(v, u, 3)}$。求它的表面积。`,
            ),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [v, 6 * v, s * s, 4 * s * s],
            solution: t(
              `The edge is $\\sqrt[3]{${v}} = ${s}$:${steps(`S = 6 \\cdot ${s}^2 = ${tex(area, u, 2)}`)}`,
              `棱长是 $\\sqrt[3]{${v}} = ${s}$：${steps(`S = 6 \\cdot ${s}^2 = ${tex(area, u, 2)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A cube has a surface area of $${tex(area, u, 2)}$. Find its volume.`,
            `一个正方体的表面积是 $${tex(area, u, 2)}$。求它的体积。`,
          ),
          answer: v,
          form: "integer",
          unit: `${u}^3`,
          wrong: [area, s * s, Q.of(area, 6), 6 * v],
          solution: t(
            `The edge is $\\sqrt{${area} \\div 6} = \\sqrt{${s * s}} = ${s}$:${steps(`V = ${s}^3 = ${tex(v, u, 3)}`)}`,
            `棱长是 $\\sqrt{${area} \\div 6} = \\sqrt{${s * s}} = ${s}$：${steps(`V = ${s}^3 = ${tex(v, u, 3)}`)}`,
          ),
        });
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
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.3 },
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "rationalizing-denominators", weight: 0.3 },
    { topic: "volumes-of-cubes", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "face-diagonal-from-the-edge",
      title: t("Face diagonal from the edge", "由棱长求面对角线"),
      explanation: t(
        "A **face diagonal** of a cube joins opposite corners of one face. It is the hypotenuse of a right triangle whose legs are two edges, so by the Pythagorean theorem ($a^2 + b^2 = c^2$ in a right triangle with hypotenuse $c$):\n\n$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = s\\sqrt{2}.$$\n\nA cube with edge $5$ cm has face diagonals $5\\sqrt{2}$ cm long.",
        "正方体的**面对角线**连接一个面上相对的两个顶点。它是以两条棱为直角边的直角三角形的斜边，所以由勾股定理（斜边为 $c$ 的直角三角形中 $a^2 + b^2 = c^2$）：\n\n$$d^2 = s^2 + s^2 = 2s^2, \\qquad d = s\\sqrt{2}.$$\n\n棱长 $5$ 厘米的正方体面对角线长 $5\\sqrt{2}$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        return {
          ...radicalProblem({
            prompt: t(`Find the length $d$ of a face diagonal of the cube, in ${u}.`, `求这个正方体面对角线的长 $d$（单位：${u}）。`),
            answer: [s, 2],
            wrong: [String(2 * s), `${s}\\sqrt{3}`, `\\sqrt{${2 * s}}`, String(s * s * 2)],
            solution: t(
              `The diagonal is the hypotenuse of a right triangle with legs $${s}$ and $${s}$:${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${s}\\sqrt{2}`)}`,
              `面对角线是两条直角边都为 $${s}$ 的直角三角形的斜边：${steps(`d = \\sqrt{${s}^2 + ${s}^2} = \\sqrt{${2 * s * s}} = ${s}\\sqrt{2}`)}`,
            ),
          }),
          figure: cubeFigure(len(s, u), "front", "d"),
        };
      },
    },
    {
      id: "edge-from-the-face-diagonal",
      title: t("Edge from the face diagonal", "由面对角线求棱长"),
      explanation: t(
        "Divide the face diagonal by $\\sqrt{2}$ to get the edge, and rationalize the denominator:\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\nA face diagonal of $6\\sqrt{2}$ cm gives an edge of $6$ cm; a face diagonal of $10$ cm gives an edge of $\\frac{10}{\\sqrt{2}} = 5\\sqrt{2}$ cm.",
        "把面对角线除以 $\\sqrt{2}$ 就得到棱长，再把分母有理化：\n\n$$s = \\frac{d}{\\sqrt{2}} = \\frac{d\\sqrt{2}}{2}.$$\n\n面对角线为 $6\\sqrt{2}$ 厘米时棱长是 $6$ 厘米；面对角线为 $10$ 厘米时棱长是 $\\frac{10}{\\sqrt{2}} = 5\\sqrt{2}$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 25);
        const rational = rng.bool();
        const d = rational ? tex(k, u) : `${k}\\sqrt{2}\\text{ ${u}}`;
        const answer: [Q, number] = rational ? [Q.of(k, 2), 2] : [Q.of(k), 1];
        return radicalProblem({
          prompt: t(
            `A face diagonal of a cube is $${d}$ long. How long is each edge, in ${u}?`,
            `一个正方体的面对角线长 $${d}$。它的棱长是多少（单位：${u}）？`,
          ),
          answer,
          wrong: rational
            ? [`\\frac{${k}}{2}`, `${k}\\sqrt{2}`, `\\frac{${k}}{\\sqrt{2}}`]
            : [`${k}\\sqrt{2}`, `${2 * k}`, `\\frac{${k}}{2}`],
          solution: rational
            ? t(
                `$s = \\frac{${k}}{\\sqrt{2}}$; rationalize the denominator:${steps(`s = \\frac{${k}\\sqrt{2}}{2} = ${radical(Q.of(k, 2), 2)}`)}`,
                `$s = \\frac{${k}}{\\sqrt{2}}$，把分母有理化：${steps(`s = \\frac{${k}\\sqrt{2}}{2} = ${radical(Q.of(k, 2), 2)}`)}`,
              )
            : t(
                `The face diagonal is $s\\sqrt{2}$:${steps(`s\\sqrt{2} = ${k}\\sqrt{2}`, `s = ${k}`)}`,
                `面对角线是 $s\\sqrt{2}$：${steps(`s\\sqrt{2} = ${k}\\sqrt{2}`, `s = ${k}`)}`,
              ),
        });
      },
    },
    {
      id: "face-diagonal-from-other-measures",
      title: t("Face diagonal from other measures", "由其他量求面对角线"),
      explanation: t(
        "If the volume or the surface area of a cube is given, find the edge first, then the face diagonal.\n\nA cube with volume $64\\text{ cm}^3$ has edge $4$ cm and face diagonal $4\\sqrt{2}$ cm. A cube with surface area $150\\text{ cm}^2$ has faces of area $25\\text{ cm}^2$, edge $5$ cm and face diagonal $5\\sqrt{2}$ cm.",
        "如果已知正方体的体积或表面积，先求出棱长，再求面对角线。\n\n体积为 $64\\text{ cm}^3$ 的正方体棱长 $4$ 厘米，面对角线 $4\\sqrt{2}$ 厘米。表面积为 $150\\text{ cm}^2$ 的正方体每个面的面积是 $25\\text{ cm}^2$，棱长 $5$ 厘米，面对角线 $5\\sqrt{2}$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const fromVolume = rng.bool();
        const given = fromVolume
          ? t(`volume of $${tex(s ** 3, u, 3)}$`, `体积是 $${tex(s ** 3, u, 3)}$`)
          : t(`surface area of $${tex(6 * s * s, u, 2)}$`, `表面积是 $${tex(6 * s * s, u, 2)}$`);
        const edge = fromVolume ? `s = \\sqrt[3]{${s ** 3}} = ${s}` : `s = \\sqrt{${6 * s * s} \\div 6} = ${s}`;
        return radicalProblem({
          prompt: t(
            `A cube has a ${given.en}. How long is a face diagonal, in ${u}?`,
            `一个正方体的${given["zh-CN"]}。它的面对角线有多长（单位：${u}）？`,
          ),
          answer: [s, 2],
          wrong: [`${s}\\sqrt{3}`, String(2 * s), `${s * s}\\sqrt{2}`],
          solution: t(
            `First the edge, then the diagonal:${steps(edge, `d = ${s}\\sqrt{2}`)}`,
            `先求棱长，再求对角线：${steps(edge, `d = ${s}\\sqrt{2}`)}`,
          ),
        });
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
    { topic: "face-diagonals-of-cubes", weight: 0.5 },
    { topic: "rationalizing-denominators", weight: 0.3 },
    { topic: "the-pythagorean-theorem", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "space-diagonal-from-the-edge",
      title: t("Diagonal from the edge", "由棱长求体对角线"),
      explanation: t(
        "A **diagonal** of a cube (a space diagonal) joins two opposite corners through the interior. It is the hypotenuse of a right triangle whose legs are an edge $s$ and a face diagonal $s\\sqrt{2}$:\n\n$$D^2 = s^2 + (s\\sqrt{2})^2 = 3s^2, \\qquad D = s\\sqrt{3}.$$\n\nA cube with edge $4$ cm has diagonal $4\\sqrt{3}$ cm.",
        "正方体的**体对角线**穿过内部，连接相对的两个顶点。它是以一条棱 $s$ 和一条面对角线 $s\\sqrt{2}$ 为直角边的直角三角形的斜边：\n\n$$D^2 = s^2 + (s\\sqrt{2})^2 = 3s^2, \\qquad D = s\\sqrt{3}.$$\n\n棱长 $4$ 厘米的正方体体对角线长 $4\\sqrt{3}$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        return {
          ...radicalProblem({
            prompt: t(
              `Find the length $D$ of a diagonal of the cube through its interior, in ${u}.`,
              `求这个正方体体对角线的长 $D$（单位：${u}）。`,
            ),
            answer: [s, 3],
            wrong: [`${s}\\sqrt{2}`, String(3 * s), `\\sqrt{${3 * s}}`],
            solution: t(
              `Use the edge and a face diagonal as the legs:${steps(`D = \\sqrt{${s}^2 + (${s}\\sqrt{2})^2} = \\sqrt{${3 * s * s}} = ${s}\\sqrt{3}`)}`,
              `以棱和面对角线为直角边：${steps(`D = \\sqrt{${s}^2 + (${s}\\sqrt{2})^2} = \\sqrt{${3 * s * s}} = ${s}\\sqrt{3}`)}`,
            ),
          }),
          figure: cubeFigure(len(s, u), "space", "D"),
        };
      },
    },
    {
      id: "edge-from-the-space-diagonal",
      title: t("Edge from the diagonal", "由体对角线求棱长"),
      explanation: t(
        "Divide the diagonal by $\\sqrt{3}$ and rationalize:\n\n$$s = \\frac{D}{\\sqrt{3}} = \\frac{D\\sqrt{3}}{3}.$$\n\nA diagonal of $6$ cm gives an edge of $\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ cm, and a diagonal of $7\\sqrt{3}$ cm an edge of $7$ cm.",
        "把体对角线除以 $\\sqrt{3}$，再有理化：\n\n$$s = \\frac{D}{\\sqrt{3}} = \\frac{D\\sqrt{3}}{3}.$$\n\n体对角线为 $6$ 厘米时，棱长是 $\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ 厘米；体对角线为 $7\\sqrt{3}$ 厘米时，棱长是 $7$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 25);
        const rational = rng.bool(0.6);
        const d = rational ? tex(k, u) : `${k}\\sqrt{3}\\text{ ${u}}`;
        const answer: [Q, number] = rational ? [Q.of(k, 3), 3] : [Q.of(k), 1];
        return radicalProblem({
          prompt: t(
            `A diagonal through the interior of a cube is $${d}$ long. How long is each edge, in ${u}?`,
            `一个正方体的体对角线长 $${d}$。它的棱长是多少（单位：${u}）？`,
          ),
          answer,
          wrong: rational
            ? [`\\frac{${k}}{3}`, `${k}\\sqrt{3}`, `\\frac{${k}}{\\sqrt{3}}`, radical(Q.of(k, 2), 2)]
            : [`${k}\\sqrt{3}`, String(3 * k), `\\frac{${k}}{3}`],
          solution: rational
            ? t(
                `$s = \\frac{${k}}{\\sqrt{3}}$; rationalize the denominator:${steps(`s = \\frac{${k}\\sqrt{3}}{3} = ${radical(Q.of(k, 3), 3)}`)}`,
                `$s = \\frac{${k}}{\\sqrt{3}}$，把分母有理化：${steps(`s = \\frac{${k}\\sqrt{3}}{3} = ${radical(Q.of(k, 3), 3)}`)}`,
              )
            : t(
                `The diagonal is $s\\sqrt{3}$:${steps(`s\\sqrt{3} = ${k}\\sqrt{3}`, `s = ${k}`)}`,
                `体对角线是 $s\\sqrt{3}$：${steps(`s\\sqrt{3} = ${k}\\sqrt{3}`, `s = ${k}`)}`,
              ),
        });
      },
    },
    {
      id: "face-and-space-diagonals",
      title: t("Face and space diagonals", "面对角线与体对角线"),
      explanation: t(
        "Both diagonals are multiples of the edge, so go through the edge to pass from one to the other.\n\nIf a face diagonal is $5\\sqrt{2}$ cm, the edge is $5$ cm and the cube's diagonal is $5\\sqrt{3}$ cm. If the cube's diagonal is $3\\sqrt{3}$ cm, the edge is $3$ cm and a face diagonal is $3\\sqrt{2}$ cm.",
        "两种对角线都是棱长的倍数，所以通过棱长在两者之间换算。\n\n若面对角线是 $5\\sqrt{2}$ 厘米，则棱长是 $5$ 厘米，体对角线是 $5\\sqrt{3}$ 厘米。若体对角线是 $3\\sqrt{3}$ 厘米，则棱长是 $3$ 厘米，面对角线是 $3\\sqrt{2}$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 25);
        const fromFace = rng.bool();
        return radicalProblem({
          prompt: fromFace
            ? t(
                `A face diagonal of a cube is $${s}\\sqrt{2}\\text{ ${u}}$ long. How long is a diagonal through its interior, in ${u}?`,
                `一个正方体的面对角线长 $${s}\\sqrt{2}\\text{ ${u}}$。它的体对角线有多长（单位：${u}）？`,
              )
            : t(
                `A diagonal through the interior of a cube is $${s}\\sqrt{3}\\text{ ${u}}$ long. How long is a face diagonal, in ${u}?`,
                `一个正方体的体对角线长 $${s}\\sqrt{3}\\text{ ${u}}$。它的面对角线有多长（单位：${u}）？`,
              ),
          answer: [s, fromFace ? 3 : 2],
          wrong: fromFace ? [`${s}\\sqrt{2}`, `${s}\\sqrt{6}`, `${s + 1}\\sqrt{2}`] : [`${s}\\sqrt{3}`, `${s}\\sqrt{6}`, String(s)],
          solution: fromFace
            ? t(`The edge is $${s}$, so:${steps(`D = ${s}\\sqrt{3}`)}`, `棱长是 $${s}$，所以：${steps(`D = ${s}\\sqrt{3}`)}`)
            : t(`The edge is $${s}$, so:${steps(`d = ${s}\\sqrt{2}`)}`, `棱长是 $${s}$，所以：${steps(`d = ${s}\\sqrt{2}`)}`),
        });
      },
    },
  ],
};

export const volumesOfRectangularSolids: TopicDef = {
  id: "volumes-of-rectangular-solids",
  title: t("Volumes of Rectangular Solids", "长方体的体积"),
  summary: t(
    "Find the volume of a box, a missing dimension from the volume, and the volume of solids made of boxes.",
    "求长方体的体积，由体积求未知的棱长，并求由长方体组成的立体图形的体积。",
  ),
  prerequisites: ["volumes-of-cubes"],
  encompasses: [{ topic: "volumes-of-cubes", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.5.MD.C.5"],
  knowledgePoints: [
    {
      id: "length-times-width-times-height",
      title: t("Length × width × height", "长 × 宽 × 高"),
      explanation: t(
        "A rectangular solid (box) $l$ long, $w$ wide and $h$ high holds $h$ layers of $l \\times w$ unit cubes, so\n\n$$V = lwh.$$\n\nThe area of the base is $B = lw$, so this is also $V = Bh$: base area times height. A box $6$ cm by $4$ cm by $3$ cm has $V = 6 \\cdot 4 \\cdot 3 = 72\\text{ cm}^3$.",
        "长 $l$、宽 $w$、高 $h$ 的长方体可以放 $h$ 层、每层 $l \\times w$ 个单位正方体，所以\n\n$$V = lwh.$$\n\n底面积是 $B = lw$，所以也可以写成 $V = Bh$：底面积乘高。长 $6$ 厘米、宽 $4$ 厘米、高 $3$ 厘米的长方体 $V = 6 \\cdot 4 \\cdot 3 = 72\\text{ cm}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        return {
          ...numberProblem({
            prompt: t("Find the volume of the box.", "求这个长方体的体积。"),
            answer: l * w * h,
            form: "integer",
            unit: `${u}^3`,
            wrong: [l + w + h, 2 * (l * w + l * h + w * h), l * w, 4 * (l + w + h)],
            solution: t(
              `Multiply the three dimensions:${steps(`V = ${l} \\cdot ${w} \\cdot ${h} = ${tex(l * w * h, u, 3)}`)}`,
              `把长、宽、高相乘：${steps(`V = ${l} \\cdot ${w} \\cdot ${h} = ${tex(l * w * h, u, 3)}`)}`,
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
        "If the volume and two dimensions are known, divide the volume by their product. A box with volume $180\\text{ cm}^3$, length $6$ cm and width $5$ cm has height $\\frac{180}{6 \\cdot 5} = 6$ cm.\n\nIn the same way, a box with base area $B$ and volume $V$ has height $h = \\frac{V}{B}$.",
        "已知体积和两条棱长时，用体积除以这两条棱长的积。体积 $180\\text{ cm}^3$、长 $6$ 厘米、宽 $5$ 厘米的长方体高是 $\\frac{180}{6 \\cdot 5} = 6$ 厘米。\n\n同样，底面积为 $B$、体积为 $V$ 的长方体，高是 $h = \\frac{V}{B}$。",
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
        return numberProblem({
          prompt: t(
            `A box has a volume of $${tex(v, u, 3)}$, a ${ka[0]} of $${tex(a, u)}$ and a ${kb[0]} of $${tex(b, u)}$. Find its ${names[ask]![0]}.`,
            `一个长方体的体积是 $${tex(v, u, 3)}$，${ka[1]}是 $${tex(a, u)}$，${kb[1]}是 $${tex(b, u)}$。求它的${names[ask]![1]}。`,
          ),
          answer: dims[ask]!,
          form: "integer",
          unit: u,
          wrong: [v - a - b, Q.of(v, a), Q.of(v, b), v * a * b],
          solution: t(
            `Divide the volume by the product of the known dimensions:${steps(`\\frac{${v}}{${a} \\cdot ${b}} = \\frac{${v}}{${a * b}} = ${tex(dims[ask]!, u)}`)}`,
            `用体积除以已知两条棱长的积：${steps(`\\frac{${v}}{${a} \\cdot ${b}} = \\frac{${v}}{${a * b}} = ${tex(dims[ask]!, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "solids-made-of-boxes",
      title: t("Solids made of boxes", "由长方体组成的立体图形"),
      explanation: t(
        "Volume adds: a solid made of two boxes that do not overlap has the sum of their volumes. A hole subtracts: a box with a smaller box cut out of it has the difference.\n\nA $10 \\times 6 \\times 4$ cm block with a $3 \\times 2 \\times 4$ cm hole cut straight through it has volume $240 - 24 = 216\\text{ cm}^3$.",
        "体积可以相加：由两个不重叠的长方体组成的立体图形，体积是它们的体积之和。挖去的部分要减去：从长方体中挖去一个小长方体，体积是两者之差。\n\n一个 $10 \\times 6 \\times 4$ 厘米的木块，被直直地挖穿一个 $3 \\times 2 \\times 4$ 厘米的孔，体积是 $240 - 24 = 216\\text{ cm}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(6, 15), rng.int(4, 10), rng.int(3, 10)];
        const big = l * w * h;
        if (rng.bool()) {
          const [a, b, c] = [rng.int(2, l - 1), rng.int(2, w - 1), rng.int(2, 10)];
          const small = a * b * c;
          return numberProblem({
            prompt: t(
              `A solid is made of a box $${l} \\times ${w} \\times ${h}$ ${u} with a smaller box $${a} \\times ${b} \\times ${c}$ ${u} placed on top of it. Find the volume of the solid.`,
              `一个立体图形由一个 $${l} \\times ${w} \\times ${h}$ ${u} 的长方体和放在它上面的一个 $${a} \\times ${b} \\times ${c}$ ${u} 的小长方体组成。求这个立体图形的体积。`,
            ),
            answer: big + small,
            form: "integer",
            unit: `${u}^3`,
            wrong: [big - small, big, (l + a) * (w + b) * (h + c)],
            solution: t(
              `Add the two volumes:${steps(`${l} \\cdot ${w} \\cdot ${h} + ${a} \\cdot ${b} \\cdot ${c} = ${big} + ${small} = ${tex(big + small, u, 3)}`)}`,
              `把两个体积相加：${steps(`${l} \\cdot ${w} \\cdot ${h} + ${a} \\cdot ${b} \\cdot ${c} = ${big} + ${small} = ${tex(big + small, u, 3)}`)}`,
            ),
          });
        }
        const [a, b] = [rng.int(1, l - 2), rng.int(1, w - 2)];
        const hole = a * b * h;
        return numberProblem({
          prompt: t(
            `A block $${l} \\times ${w} \\times ${h}$ ${u} has a hole with a $${a} \\times ${b}$ ${u} rectangular cross-section cut straight through it, from top to bottom ($${h}$ ${u}). Find the volume of what remains.`,
            `一个 $${l} \\times ${w} \\times ${h}$ ${u} 的木块被从上到下（$${h}$ ${u}）直直地挖穿一个横截面为 $${a} \\times ${b}$ ${u} 长方形的孔。求剩下部分的体积。`,
          ),
          answer: big - hole,
          form: "integer",
          unit: `${u}^3`,
          wrong: [big + hole, big - a * b, big],
          solution: t(
            `Subtract the hole from the block:${steps(`${l} \\cdot ${w} \\cdot ${h} - ${a} \\cdot ${b} \\cdot ${h} = ${big} - ${hole} = ${tex(big - hole, u, 3)}`)}`,
            `从木块中减去孔的体积：${steps(`${l} \\cdot ${w} \\cdot ${h} - ${a} \\cdot ${b} \\cdot ${h} = ${big} - ${hole} = ${tex(big - hole, u, 3)}`)}`,
          ),
        });
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
  encompasses: [
    { topic: "finding-surface-areas-using-nets", weight: 0.4 },
    { topic: "surface-areas-of-cubes", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "surface-area-of-a-box",
      title: t("Surface area of a box", "长方体的表面积"),
      explanation: t(
        "A box $l$ long, $w$ wide and $h$ high has three pairs of congruent faces: top and bottom ($lw$), front and back ($lh$), and the two ends ($wh$):\n\n$$S = 2(lw + lh + wh).$$\n\nA box $8$ cm by $5$ cm by $3$ cm has $S = 2(40 + 24 + 15) = 158\\text{ cm}^2$.",
        "长 $l$、宽 $w$、高 $h$ 的长方体有三对全等的面：上下两个面（$lw$）、前后两个面（$lh$）和左右两个面（$wh$）：\n\n$$S = 2(lw + lh + wh).$$\n\n长 $8$ 厘米、宽 $5$ 厘米、高 $3$ 厘米的长方体 $S = 2(40 + 24 + 15) = 158\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const s = 2 * (l * w + l * h + w * h);
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the box.", "求这个长方体的表面积。"),
            answer: s,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s / 2, l * w * h, 6 * l * w, 2 * (l + w + h)],
            solution: t(
              `Add the three pairs of faces:${steps(`S = 2(${l} \\cdot ${w} + ${l} \\cdot ${h} + ${w} \\cdot ${h}) = 2(${l * w} + ${l * h} + ${w * h}) = ${tex(s, u, 2)}`)}`,
              `把三对面的面积相加：${steps(`S = 2(${l} \\cdot ${w} + ${l} \\cdot ${h} + ${w} \\cdot ${h}) = 2(${l * w} + ${l * h} + ${w * h}) = ${tex(s, u, 2)}`)}`,
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
      id: "missing-dimension-from-the-surface-area",
      title: t("A missing dimension", "由表面积求未知棱长"),
      explanation: t(
        "Substitute what is known into $S = 2(lw + lh + wh)$ and solve the linear equation for the missing dimension.\n\nA box with $S = 94\\text{ cm}^2$, $l = 5$ cm and $w = 3$ cm has $94 = 2(15 + 5h + 3h)$, so $47 = 15 + 8h$ and $h = 4$ cm.",
        "把已知量代入 $S = 2(lw + lh + wh)$，解关于未知棱长的一元一次方程。\n\n$S = 94\\text{ cm}^2$、$l = 5$ 厘米、$w = 3$ 厘米的长方体满足 $94 = 2(15 + 5h + 3h)$，所以 $47 = 15 + 8h$，$h = 4$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const s = 2 * (l * w + l * h + w * h);
        return numberProblem({
          prompt: t(
            `A box has a surface area of $${tex(s, u, 2)}$, a length of $${tex(l, u)}$ and a width of $${tex(w, u)}$. Find its height.`,
            `一个长方体的表面积是 $${tex(s, u, 2)}$，长是 $${tex(l, u)}$，宽是 $${tex(w, u)}$。求它的高。`,
          ),
          answer: h,
          form: "integer",
          unit: u,
          wrong: [Q.of(s, l * w), Q.of(s - 2 * l * w, l + w), Q.of(s / 2 - l * w, l * w)],
          solution: t(
            `Substitute and solve for $h$:${steps(`${s} = 2(${l * w} + ${l}h + ${w}h)`, `${s / 2} = ${l * w} + ${l + w}h`, `${l + w}h = ${s / 2 - l * w}`, `h = ${tex(h, u)}`)}`,
            `代入并解出 $h$：${steps(`${s} = 2(${l * w} + ${l}h + ${w}h)`, `${s / 2} = ${l * w} + ${l + w}h`, `${l + w}h = ${s / 2 - l * w}`, `h = ${tex(h, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "open-boxes-and-lateral-area",
      title: t("Open boxes and lateral area", "无盖盒子与侧面积"),
      explanation: t(
        "Read carefully which faces count. The **lateral area** is the area of the sides only, without the top and bottom: $2lh + 2wh = 2h(l + w)$, the perimeter of the base times the height. A box without a lid has the bottom but no top: $lw + 2lh + 2wh$.\n\nFor a box $8 \\times 5 \\times 3$ cm, the lateral area is $2 \\cdot 3 \\cdot 13 = 78\\text{ cm}^2$, and without a lid the area is $40 + 78 = 118\\text{ cm}^2$.",
        "要看清楚计算哪些面。**侧面积**只包括侧面，不包括上下两个面：$2lh + 2wh = 2h(l + w)$，即底面周长乘高。无盖的盒子有底面而没有顶面：$lw + 2lh + 2wh$。\n\n对于 $8 \\times 5 \\times 3$ 厘米的长方体，侧面积是 $2 \\cdot 3 \\cdot 13 = 78\\text{ cm}^2$，无盖时面积是 $40 + 78 = 118\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(3, 15), rng.int(2, 12), rng.int(2, 12)];
        const lateral = 2 * h * (l + w);
        const open = rng.bool();
        const answer = open ? lateral + l * w : lateral;
        return numberProblem({
          prompt: open
            ? t(
                `An open box (with no lid) is $${tex(l, u)}$ long, $${tex(w, u)}$ wide and $${tex(h, u)}$ high. How much material is needed to make it, in square ${u}?`,
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
                `The bottom and four sides:${steps(`${l} \\cdot ${w} + 2 \\cdot ${h}(${l} + ${w}) = ${l * w} + ${lateral} = ${tex(answer, u, 2)}`)}`,
                `底面和四个侧面：${steps(`${l} \\cdot ${w} + 2 \\cdot ${h}(${l} + ${w}) = ${l * w} + ${lateral} = ${tex(answer, u, 2)}`)}`,
              )
            : t(
                `The perimeter of the base times the height:${steps(`2(${l} + ${w}) \\cdot ${h} = ${tex(lateral, u, 2)}`)}`,
                `底面周长乘高：${steps(`2(${l} + ${w}) \\cdot ${h} = ${tex(lateral, u, 2)}`)}`,
              ),
        });
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
  encompasses: [
    { topic: "the-pythagorean-theorem", weight: 0.5 },
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "diagonals-of-cubes", weight: 0.2 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "face-diagonals-of-a-box",
      title: t("Face diagonals of a box", "长方体的面对角线"),
      explanation: t(
        "Each face of a box is a rectangle, and its diagonal is the hypotenuse of a right triangle with two edges as legs. The diagonal of the bottom face of a box $l$ long and $w$ wide is $\\sqrt{l^2 + w^2}$.\n\nThe front face of a box $6$ cm long and $4$ cm high has diagonal $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ cm.",
        "长方体的每个面都是长方形，面的对角线是以两条棱为直角边的直角三角形的斜边。长 $l$、宽 $w$ 的长方体底面的对角线是 $\\sqrt{l^2 + w^2}$。\n\n长 $6$ 厘米、高 $4$ 厘米的长方体正面的对角线是 $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ 厘米。",
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
        const n = a * a + b * b;
        return rootProblem({
          prompt: t(
            `A box is $${tex(l, u)}$ long, $${tex(w, u)}$ wide and $${tex(h, u)}$ high. How long is a diagonal of its ${which.en}, in ${u}? Write it in simplest radical form.`,
            `一个长方体长 $${tex(l, u)}$、宽 $${tex(w, u)}$、高 $${tex(h, u)}$。它的${which["zh-CN"]}的对角线有多长（单位：${u}）？用最简根式表示。`,
          ),
          n,
          wrong: [String(a + b), `\\sqrt{${l * l + w * w + h * h}}`, `\\sqrt{${a + b}}`],
          solution: t(
            `That face is $${a}$ by $${b}$:${steps(`\\sqrt{${a}^2 + ${b}^2} = ${rootSteps(n)}`)}`,
            `这个面是 $${a} \\times ${b}$ 的长方形：${steps(`\\sqrt{${a}^2 + ${b}^2} = ${rootSteps(n)}`)}`,
          ),
        });
      },
    },
    {
      id: "diagonal-of-a-box",
      title: t("The diagonal of a box", "长方体的体对角线"),
      explanation: t(
        "The diagonal of a box through its interior is the hypotenuse of a right triangle whose legs are the height $h$ and the diagonal of the bottom face, $\\sqrt{l^2 + w^2}$:\n\n$$D = \\sqrt{l^2 + w^2 + h^2}.$$\n\nA box $3 \\times 4 \\times 12$ cm has $D = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$ cm. For a cube, $l = w = h = s$ gives $D = s\\sqrt{3}$ again.",
        "长方体的体对角线是一个直角三角形的斜边，它的直角边是高 $h$ 和底面对角线 $\\sqrt{l^2 + w^2}$：\n\n$$D = \\sqrt{l^2 + w^2 + h^2}.$$\n\n$3 \\times 4 \\times 12$ 厘米的长方体 $D = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$ 厘米。对于正方体，$l = w = h = s$，又得到 $D = s\\sqrt{3}$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
        const n = l * l + w * w + h * h;
        return {
          ...rootProblem({
            prompt: t(
              `Find the length $D$ of the diagonal of the box, in ${u}. Write it in simplest radical form.`,
              `求这个长方体体对角线的长 $D$（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(l + w + h), `\\sqrt{${l * l + w * w}}`, `\\sqrt{${l + w + h}}`],
            solution: t(
              `$D = \\sqrt{l^2 + w^2 + h^2}$:${steps(`D = \\sqrt{${l}^2 + ${w}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
              `$D = \\sqrt{l^2 + w^2 + h^2}$：${steps(`D = \\sqrt{${l}^2 + ${w}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
            ),
          }),
          figure: figure(
            boxMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }, "space"),
            `A box ${l} ${u} long, ${w} ${u} deep and ${h} ${u} high, with a diagonal through its interior.`,
            `一个长 ${l} ${u}、宽 ${w} ${u}、高 ${h} ${u} 的长方体，画出了一条体对角线。`,
          ),
        };
      },
    },
    {
      id: "missing-dimension-from-the-diagonal",
      title: t("A missing dimension", "由对角线求未知棱长"),
      explanation: t(
        "If the diagonal and two dimensions are known, square the diagonal and subtract:\n\n$$h = \\sqrt{D^2 - l^2 - w^2}.$$\n\nA box with diagonal $9$ cm, length $4$ cm and width $4$ cm has $h = \\sqrt{81 - 16 - 16} = \\sqrt{49} = 7$ cm.",
        "已知体对角线和两条棱长时，把体对角线平方后减去两条棱长的平方：\n\n$$h = \\sqrt{D^2 - l^2 - w^2}.$$\n\n体对角线 $9$ 厘米、长 $4$ 厘米、宽 $4$ 厘米的长方体 $h = \\sqrt{81 - 16 - 16} = \\sqrt{49} = 7$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w] = [rng.int(2, 12), rng.int(2, 10)];
        const h2 = rng.bool() ? rng.int(2, 12) ** 2 : rng.int(5, 80);
        const d2 = l * l + w * w + h2;
        const [dk, dm] = simplifyRadical(d2);
        const dTex = dm === 1 ? `${dk}` : `\\sqrt{${d2}}`;
        return rootProblem({
          prompt: t(
            `A box has a diagonal of $${dTex}\\text{ ${u}}$, a length of $${tex(l, u)}$ and a width of $${tex(w, u)}$. How high is it, in ${u}? Write it in simplest radical form.`,
            `一个长方体的体对角线是 $${dTex}\\text{ ${u}}$，长是 $${tex(l, u)}$，宽是 $${tex(w, u)}$。它的高是多少（单位：${u}）？用最简根式表示。`,
          ),
          n: h2,
          wrong: [`\\sqrt{${d2 + l * l + w * w}}`, `\\sqrt{${Math.abs(d2 - l - w)}}`],
          solution: t(
            `Square the diagonal and subtract the squares of the other dimensions:${steps(`h = \\sqrt{${d2} - ${l}^2 - ${w}^2} = ${rootSteps(h2)}`)}`,
            `把体对角线平方，减去另外两条棱长的平方：${steps(`h = \\sqrt{${d2} - ${l}^2 - ${w}^2} = ${rootSteps(h2)}`)}`,
          ),
        });
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
    { topic: "diagonals-of-rectangular-solids", weight: 0.4 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "distance-from-the-origin",
      title: t("Distance from the origin", "到原点的距离"),
      explanation: t(
        "In space, a point has three coordinates $(x, y, z)$ on three perpendicular axes. The point $(x, y, z)$ is the far corner of a box with edges $|x|$, $|y|$ and $|z|$ whose opposite corner is the origin, so its distance from the origin is the diagonal of that box:\n\n$$d = \\sqrt{x^2 + y^2 + z^2}.$$\n\nThe point $(2, -3, 6)$ is $\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$ units from the origin.",
        "在空间中，点有三个坐标 $(x, y, z)$，对应三条互相垂直的坐标轴。点 $(x, y, z)$ 和原点是一个棱长为 $|x|$、$|y|$、$|z|$ 的长方体相对的两个顶点，所以它到原点的距离就是这个长方体的体对角线：\n\n$$d = \\sqrt{x^2 + y^2 + z^2}.$$\n\n点 $(2, -3, 6)$ 到原点的距离是 $\\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$。",
      ),
      generate(rng) {
        const [x, y, z] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const n = x * x + y * y + z * z;
        return rootProblem({
          prompt: t(
            `How far is the point $(${x}, ${y}, ${z})$ from the origin? Write the distance in simplest radical form.`,
            `点 $(${x}, ${y}, ${z})$ 到原点的距离是多少？用最简根式表示。`,
          ),
          n,
          wrong: [
            String(Math.abs(x + y + z)),
            `\\sqrt{${Math.abs(x + y + z)}}`,
            String(Math.abs(x) + Math.abs(y) + Math.abs(z)),
            `\\sqrt{${x * x + y * y}}`,
          ],
          solution: t(
            `${steps(`d = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = ${rootSteps(n)}`)}`,
            `${steps(`d = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = ${rootSteps(n)}`)}`,
          ),
        });
      },
    },
    {
      id: "distance-between-two-points",
      title: t("Distance between two points", "两点之间的距离"),
      explanation: t(
        "The distance between $(x_1, y_1, z_1)$ and $(x_2, y_2, z_2)$ is the diagonal of the box whose edges are the differences of the coordinates:\n\n$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}.$$\n\nFrom $(1, 4, -2)$ to $(3, 1, 4)$: $d = \\sqrt{2^2 + (-3)^2 + 6^2} = \\sqrt{49} = 7$.",
        "点 $(x_1, y_1, z_1)$ 与 $(x_2, y_2, z_2)$ 之间的距离是以坐标之差为棱长的长方体的体对角线：\n\n$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}.$$\n\n从 $(1, 4, -2)$ 到 $(3, 1, 4)$：$d = \\sqrt{2^2 + (-3)^2 + 6^2} = \\sqrt{49} = 7$。",
      ),
      generate(rng) {
        const p = [rng.int(-8, 8), rng.int(-8, 8), rng.int(-8, 8)] as const;
        const delta = [rng.nonZero(-8, 8), rng.nonZero(-8, 8), rng.int(-8, 8)] as const;
        const q = p.map((v, i) => v + delta[i]!);
        const n = delta.reduce((s, v) => s + v * v, 0);
        const sumWrong = Math.abs(delta[0] + delta[1] + delta[2]);
        const plus = p.map((v, i) => (v + q[i]!) ** 2).reduce((s, v) => s + v, 0);
        return rootProblem({
          prompt: t(
            `Find the distance between $(${p.join(", ")})$ and $(${q.join(", ")})$. Write it in simplest radical form.`,
            `求点 $(${p.join(", ")})$ 与 $(${q.join(", ")})$ 之间的距离。用最简根式表示。`,
          ),
          n,
          wrong: [`\\sqrt{${sumWrong}}`, String(sumWrong), ...(plus > 0 ? [rootTex(plus)] : [])],
          solution: t(
            `The differences are $${delta.join("$, $")}$:${steps(`d = \\sqrt{(${delta[0]})^2 + (${delta[1]})^2 + (${delta[2]})^2} = ${rootSteps(n)}`)}`,
            `坐标之差是 $${delta.join("$、$")}$：${steps(`d = \\sqrt{(${delta[0]})^2 + (${delta[1]})^2 + (${delta[2]})^2} = ${rootSteps(n)}`)}`,
          ),
        });
      },
    },
    {
      id: "missing-coordinate",
      title: t("A missing coordinate", "求未知坐标"),
      explanation: t(
        "If the distance is known and one coordinate is not, substitute and solve. Squaring loses the sign, so there are usually two answers.\n\nThe point $(3, 2, z)$ is $7$ units from $(1, 5, 4)$: $2^2 + (-3)^2 + (z - 4)^2 = 49$, so $(z - 4)^2 = 36$, $z - 4 = \\pm 6$, and $z = 10$ or $z = -2$.",
        "如果已知距离而有一个坐标未知，就代入后解方程。平方会丢掉符号，所以通常有两个解。\n\n点 $(3, 2, z)$ 到 $(1, 5, 4)$ 的距离是 $7$：$2^2 + (-3)^2 + (z - 4)^2 = 49$，所以 $(z - 4)^2 = 36$，$z - 4 = \\pm 6$，$z = 10$ 或 $z = -2$。",
      ),
      generate(rng) {
        const p = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        const [dx, dy, dz] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.int(1, 9)];
        const d2 = dx * dx + dy * dy + dz * dz;
        const [dk, dm] = simplifyRadical(d2);
        const dTex = dm === 1 ? String(dk) : `\\sqrt{${d2}}`;
        const z1 = p[2] + dz;
        const z2 = p[2] - dz;
        const q = [p[0] + dx, p[1] + dy];
        const zTex = p[2] === 0 ? "z" : `(z ${p[2] > 0 ? "-" : "+"} ${Math.abs(p[2])})`;
        return solutionsProblem({
          prompt: t(
            `The point $(${q[0]}, ${q[1]}, z)$ is $${dTex}$ units from $(${p.join(", ")})$. Find all possible values of $z$.`,
            `点 $(${q[0]}, ${q[1]}, z)$ 到 $(${p.join(", ")})$ 的距离是 $${dTex}$。求 $z$ 的所有可能值。`,
          ),
          variable: "z",
          values: [String(z1), String(z2)],
          wrong: [[String(z1)], [String(dz), String(-dz)], [String(-p[2] + dz), String(-p[2] - dz)]],
          solution: t(
            `${steps(`(${dx})^2 + (${dy})^2 + ${zTex}^2 = ${d2}`, `${zTex}^2 = ${dz * dz}`, `z = ${p[2]} \\pm ${dz}`)}So $z = ${z1}$ or $z = ${z2}$.`,
            `${steps(`(${dx})^2 + (${dy})^2 + ${zTex}^2 = ${d2}`, `${zTex}^2 = ${dz * dz}`, `z = ${p[2]} \\pm ${dz}`)}所以 $z = ${z1}$ 或 $z = ${z2}$。`,
          ),
        });
      },
    },
  ],
};

export const volumesOfPyramids: TopicDef = {
  id: "volumes-of-pyramids",
  title: t("Volumes of Pyramids", "棱锥的体积"),
  summary: t(
    "Find the volume of a pyramid, one third of base area times height, and a missing height or base edge.",
    "求棱锥的体积（底面积乘高的三分之一），以及未知的高或底边长。",
  ),
  prerequisites: ["volumes-of-rectangular-solids", "area-of-triangles"],
  encompasses: [
    { topic: "area-of-triangles", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.2 },
    { topic: "volumes-of-rectangular-solids", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.GMD.A.3"],
  knowledgePoints: [
    {
      id: "pyramids-on-rectangles",
      title: t("Pyramids on rectangles", "底面为长方形的棱锥"),
      explanation: t(
        "The **height** of a pyramid is the perpendicular distance from its apex to the plane of its base. A pyramid holds exactly one third of the prism with the same base and height:\n\n$$V = \\frac{1}{3}Bh,$$\n\nwhere $B$ is the area of the base. A pyramid on a $6$ cm by $5$ cm rectangle with height $8$ cm has $V = \\frac{1}{3} \\cdot 30 \\cdot 8 = 80\\text{ cm}^3$.",
        "棱锥的**高**是从顶点到底面所在平面的垂直距离。棱锥的体积恰好是同底等高的棱柱体积的三分之一：\n\n$$V = \\frac{1}{3}Bh,$$\n\n其中 $B$ 是底面积。底面是 $6$ 厘米 × $5$ 厘米的长方形、高 $8$ 厘米的棱锥 $V = \\frac{1}{3} \\cdot 30 \\cdot 8 = 80\\text{ cm}^3$。",
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
              `The base has area $${l} \\cdot ${w} = ${l * w}$:${steps(`V = \\frac{1}{3} \\cdot ${l * w} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}`,
              `底面积是 $${l} \\cdot ${w} = ${l * w}$：${steps(`V = \\frac{1}{3} \\cdot ${l * w} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}`,
            ),
          }),
          figure: figure(
            pyramidMarks(l, w, h, { l: len(l, u), d: len(w, u), h: len(h, u) }),
            `A pyramid on a ${l} by ${w} ${u} rectangle, with height ${h} ${u}.`,
            `一个底面为 ${l} × ${w} ${u} 长方形、高 ${h} ${u} 的棱锥。`,
          ),
        };
      },
    },
    {
      id: "pyramids-on-triangles",
      title: t("Pyramids on triangles", "底面为三角形的棱锥"),
      explanation: t(
        "The formula $V = \\frac{1}{3}Bh$ works for any base: find the area of the base first. A triangular pyramid whose base is a triangle with base $6$ cm and height $4$ cm, and whose height is $9$ cm, has $B = \\frac{1}{2} \\cdot 6 \\cdot 4 = 12\\text{ cm}^2$ and $V = \\frac{1}{3} \\cdot 12 \\cdot 9 = 36\\text{ cm}^3$.\n\nKeep the two heights apart: one belongs to the triangle, the other to the pyramid.",
        "公式 $V = \\frac{1}{3}Bh$ 对任何底面都成立：先求底面积。底面是底 $6$ 厘米、高 $4$ 厘米的三角形，棱锥的高是 $9$ 厘米的三棱锥，$B = \\frac{1}{2} \\cdot 6 \\cdot 4 = 12\\text{ cm}^2$，$V = \\frac{1}{3} \\cdot 12 \\cdot 9 = 36\\text{ cm}^3$。\n\n注意区分两个高：一个是三角形的高，一个是棱锥的高。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [b, hb, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 15)];
        const base = Q.of(b * hb, 2);
        const v = Q.of(b * hb * h, 6);
        return numberProblem({
          prompt: t(
            `The base of a pyramid is a triangle with base $${tex(b, u)}$ and height $${tex(hb, u)}$. The height of the pyramid is $${tex(h, u)}$. Find its volume.`,
            `一个棱锥的底面是底为 $${tex(b, u)}$、高为 $${tex(hb, u)}$ 的三角形，棱锥的高是 $${tex(h, u)}$。求它的体积。`,
          ),
          answer: v,
          unit: `${u}^3`,
          wrong: [Q.of(b * hb * h, 3), Q.of(b * hb * h, 2), b * hb * h],
          solution: t(
            `The base has area $\\frac{1}{2} \\cdot ${b} \\cdot ${hb} = ${num(base)}$:${steps(`V = \\frac{1}{3} \\cdot ${num(base)} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}`,
            `底面积是 $\\frac{1}{2} \\cdot ${b} \\cdot ${hb} = ${num(base)}$：${steps(`V = \\frac{1}{3} \\cdot ${num(base)} \\cdot ${h} = ${num(v)}\\text{ ${u}}^3`)}`,
          ),
        });
      },
    },
    {
      id: "missing-height-or-base-edge",
      title: t("A missing height or base edge", "求未知的高或底边长"),
      explanation: t(
        "Solve $V = \\frac{1}{3}Bh$ for the unknown. The height is $h = \\frac{3V}{B}$. For a square base with edge $s$, $B = s^2 = \\frac{3V}{h}$, so $s = \\sqrt{\\frac{3V}{h}}$.\n\nA square pyramid with volume $96\\text{ cm}^3$ and height $8$ cm has $s^2 = \\frac{288}{8} = 36$, so $s = 6$ cm.",
        "由 $V = \\frac{1}{3}Bh$ 解出未知量。高是 $h = \\frac{3V}{B}$。底面是边长为 $s$ 的正方形时，$B = s^2 = \\frac{3V}{h}$，所以 $s = \\sqrt{\\frac{3V}{h}}$。\n\n体积 $96\\text{ cm}^3$、高 $8$ 厘米的四棱锥 $s^2 = \\frac{288}{8} = 36$，所以 $s = 6$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 12);
        const h = rng.int(2, 15);
        const v = Q.of(s * s * h, 3);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A pyramid with a square base of edge $${tex(s, u)}$ has a volume of $${num(v)}\\text{ ${u}}^3$. Find its height.`,
              `一个底面是边长 $${tex(s, u)}$ 的正方形的棱锥，体积是 $${num(v)}\\text{ ${u}}^3$。求它的高。`,
            ),
            answer: h,
            form: "number",
            unit: u,
            wrong: [v.div(Q.of(s * s)), v.mul(Q.of(3)), v.div(Q.of(s))],
            solution: t(
              `$h = \\frac{3V}{B}$ with $B = ${s * s}$:${steps(`h = \\frac{3 \\cdot ${num(v)}}{${s * s}} = \\frac{${s * s * h}}{${s * s}} = ${tex(h, u)}`)}`,
              `$h = \\frac{3V}{B}$，其中 $B = ${s * s}$：${steps(`h = \\frac{3 \\cdot ${num(v)}}{${s * s}} = \\frac{${s * s * h}}{${s * s}} = ${tex(h, u)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A pyramid with a square base has a volume of $${num(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. How long is each edge of the base?`,
            `一个底面是正方形的棱锥，体积是 $${num(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。底面边长是多少？`,
          ),
          answer: s,
          form: "number",
          unit: u,
          wrong: [s * s, v.div(Q.of(h)), Q.of(s * s * 3)],
          solution: t(
            `The base area is $\\frac{3V}{h}$:${steps(`s^2 = \\frac{3 \\cdot ${num(v)}}{${h}} = \\frac{${s * s * h}}{${h}} = ${s * s}`, `s = ${tex(s, u)}`)}`,
            `底面积是 $\\frac{3V}{h}$：${steps(`s^2 = \\frac{3 \\cdot ${num(v)}}{${h}} = \\frac{${s * s * h}}{${h}} = ${s * s}`, `s = ${tex(s, u)}`)}`,
          ),
        });
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
    { topic: "the-pythagorean-theorem", weight: 0.3 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "square-pyramids-from-the-slant-height",
      title: t("Square pyramids from the slant height", "由斜高求四棱锥的表面积"),
      explanation: t(
        "In a **regular pyramid** the base is a regular polygon and the apex is above its center, so the lateral faces are congruent isosceles triangles. The height of each triangle, from the middle of a base edge up to the apex, is the **slant height** $l$. Do not confuse it with the height $h$ of the pyramid, which is shorter.\n\nA square pyramid with base edge $s$ has\n\n$$S = s^2 + 4 \\cdot \\frac{1}{2}sl = s^2 + 2sl.$$\n\nWith $s = 10$ cm and $l = 13$ cm, $S = 100 + 260 = 360\\text{ cm}^2$.",
        "**正棱锥**的底面是正多边形，顶点在底面中心的正上方，所以各侧面是全等的等腰三角形。每个侧面三角形的高（从底边中点到顶点）叫作**斜高** $l$。不要和棱锥的高 $h$ 混淆，棱锥的高更短。\n\n底面边长为 $s$ 的正四棱锥\n\n$$S = s^2 + 4 \\cdot \\frac{1}{2}sl = s^2 + 2sl.$$\n\n当 $s = 10$ 厘米、$l = 13$ 厘米时，$S = 100 + 260 = 360\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const s = rng.int(2, 16);
        const l = rng.int(Math.floor(s / 2) + 2, 20);
        const area = s * s + 2 * s * l;
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the regular square pyramid.", "求这个正四棱锥的表面积。"),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [2 * s * l, s * s + 4 * s * l, s * s + s * l, Q.of(s * s * l, 3)],
            solution: t(
              `The base and four triangles:${steps(`S = ${s}^2 + 4 \\cdot \\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}`,
              `底面加四个三角形：${steps(`S = ${s}^2 + 4 \\cdot \\tfrac{1}{2} \\cdot ${s} \\cdot ${l} = ${s * s} + ${2 * s * l} = ${tex(area, u, 2)}`)}`,
            ),
          }),
          figure: figure(
            pyramidMarks(s, s, l * 0.9, { l: len(s, u), s: len(l, u) }),
            `A regular square pyramid with base edge ${s} ${u} and slant height ${l} ${u}.`,
            `一个底面边长 ${s} ${u}、斜高 ${l} ${u} 的正四棱锥。`,
          ),
        };
      },
    },
    {
      id: "slant-height-from-the-height",
      title: t("Slant height from the height", "由高求斜高"),
      explanation: t(
        "If the height $h$ is given instead, find the slant height first. The height, the slant height and the segment from the center of the base to the middle of an edge form a right triangle. For a square base with edge $s$, that segment is $\\frac{s}{2}$, so by the Pythagorean theorem\n\n$$l = \\sqrt{h^2 + \\left(\\frac{s}{2}\\right)^2}.$$\n\nWith $s = 10$ cm and $h = 12$ cm, $l = \\sqrt{144 + 25} = 13$ cm and $S = 100 + 2 \\cdot 10 \\cdot 13 = 360\\text{ cm}^2$.",
        "如果给出的是高 $h$，先求斜高。高、斜高以及从底面中心到一条底边中点的线段构成一个直角三角形。底面是边长为 $s$ 的正方形时，这条线段长 $\\frac{s}{2}$，所以由勾股定理\n\n$$l = \\sqrt{h^2 + \\left(\\frac{s}{2}\\right)^2}.$$\n\n当 $s = 10$ 厘米、$h = 12$ 厘米时，$l = \\sqrt{144 + 25} = 13$ 厘米，$S = 100 + 2 \\cdot 10 \\cdot 13 = 360\\text{ cm}^2$。",
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
              `The slant height is the hypotenuse of a right triangle with legs $${h}$ and $\\frac{${s}}{2} = ${half}$:${steps(`l = \\sqrt{${h}^2 + ${half}^2} = \\sqrt{${c * c}} = ${c}`, `S = ${s}^2 + 2 \\cdot ${s} \\cdot ${c} = ${tex(area, u, 2)}`)}`,
              `斜高是直角边为 $${h}$ 和 $\\frac{${s}}{2} = ${half}$ 的直角三角形的斜边：${steps(`l = \\sqrt{${h}^2 + ${half}^2} = \\sqrt{${c * c}} = ${c}`, `S = ${s}^2 + 2 \\cdot ${s} \\cdot ${c} = ${tex(area, u, 2)}`)}`,
            ),
          }),
          figure: figure(
            pyramidMarks(s, s, h, { l: len(s, u), h: len(h, u) }),
            `A regular square pyramid with base edge ${s} ${u} and height ${h} ${u}.`,
            `一个底面边长 ${s} ${u}、高 ${h} ${u} 的正四棱锥。`,
          ),
        };
      },
    },
    {
      id: "lateral-area-of-regular-pyramids",
      title: t("Lateral area of regular pyramids", "正棱锥的侧面积"),
      explanation: t(
        "The **lateral area** of a pyramid is the area of its triangular faces only. A regular pyramid whose base has $n$ edges of length $s$ has $n$ congruent triangles:\n\n$$L = n \\cdot \\frac{1}{2}sl = \\frac{1}{2}Pl,$$\n\nwhere $P = ns$ is the perimeter of the base. A regular hexagonal pyramid with base edge $4$ cm and slant height $9$ cm has $L = \\frac{1}{2} \\cdot 24 \\cdot 9 = 108\\text{ cm}^2$.",
        "棱锥的**侧面积**只包括它的三角形侧面。底面有 $n$ 条长为 $s$ 的边的正棱锥有 $n$ 个全等的三角形：\n\n$$L = n \\cdot \\frac{1}{2}sl = \\frac{1}{2}Pl,$$\n\n其中 $P = ns$ 是底面周长。底面边长 $4$ 厘米、斜高 $9$ 厘米的正六棱锥 $L = \\frac{1}{2} \\cdot 24 \\cdot 9 = 108\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const n = rng.int(3, 8);
        const s = rng.int(2, 12);
        const l = rng.int(s, 20);
        const p = n * s;
        const lateral = Q.of(p * l, 2);
        const name =
          n === 4 ? t("regular square pyramid", "正四棱锥") : t(`regular ${polygonNames[n]![1]} pyramid`, `正${zhDigits[n]}棱锥`);
        return numberProblem({
          prompt: t(
            `A ${name.en} has base edges of $${tex(s, u)}$ and slant height $${tex(l, u)}$. Find its lateral area.`,
            `一个${name["zh-CN"]}的底面边长是 $${tex(s, u)}$，斜高是 $${tex(l, u)}$。求它的侧面积。`,
          ),
          answer: lateral,
          unit: `${u}^2`,
          wrong: [p * l, Q.of(s * l, 2), lateral.add(Q.of(s * s))],
          solution: t(
            `The base has $${n}$ edges, so its perimeter is $${n} \\cdot ${s} = ${p}$:${steps(`L = \\frac{1}{2} \\cdot ${p} \\cdot ${l} = ${num(lateral)}\\text{ ${u}}^2`)}`,
            `底面有 $${n}$ 条边，周长是 $${n} \\cdot ${s} = ${p}$：${steps(`L = \\frac{1}{2} \\cdot ${p} \\cdot ${l} = ${num(lateral)}\\text{ ${u}}^2`)}`,
          ),
        });
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

export const surfaceAreasAndVolumesOfSimilarSolids: TopicDef = {
  id: "surface-areas-and-volumes-of-similar-solids",
  title: t("Surface Areas and Volumes of Similar Solids", "相似立体图形的表面积与体积"),
  summary: t(
    "Use the ratios k, k² and k³ of lengths, areas and volumes of similar solids.",
    "利用相似立体图形长度、面积、体积之比 k、k²、k³ 解题。",
  ),
  prerequisites: ["surface-areas-of-rectangular-solids", "proportions"],
  encompasses: [
    { topic: "proportions", weight: 0.3 },
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "ratios-of-similar-solids",
      title: t("Ratios of areas and volumes", "面积比与体积比"),
      explanation: t(
        "Two solids are **similar** when one is a scaled copy of the other: all corresponding lengths are in the same ratio $k$, the **scale factor**. Areas are products of two lengths, and volumes of three, so\n\n- surface areas are in the ratio $k^2$;\n- volumes are in the ratio $k^3$.\n\nIf corresponding edges are in the ratio $2 : 3$, the surface areas are in the ratio $4 : 9$ and the volumes $8 : 27$.",
        "如果一个立体图形是另一个按比例缩放得到的，这两个立体图形就是**相似**的：所有对应长度之比都等于同一个数 $k$，叫作**相似比**。面积是两个长度的乘积，体积是三个长度的乘积，所以\n\n- 表面积之比是 $k^2$；\n- 体积之比是 $k^3$。\n\n如果对应棱长之比是 $2 : 3$，那么表面积之比是 $4 : 9$，体积之比是 $8 : 27$。",
      ),
      generate(rng) {
        const [a, b] = scaleRatio(rng);
        const solid = rng.pick([
          t("cylinders", "圆柱"),
          t("cones", "圆锥"),
          t("rectangular prisms", "长方体"),
          t("square pyramids", "四棱锥"),
          t("spheres", "球"),
        ]);
        const askVolume = rng.bool();
        const length = solid.en === "spheres" ? t("radii", "半径") : t("heights", "高");
        const answer = askVolume ? Q.of(a ** 3, b ** 3) : Q.of(a * a, b * b);
        return numberProblem({
          prompt: t(
            `Two similar ${solid.en} have ${length.en} in the ratio $${a} : ${b}$. Write the ratio of their ${askVolume ? "volumes" : "surface areas"} (smaller to larger) as a fraction.`,
            `两个相似的${solid["zh-CN"]}的${length["zh-CN"]}之比是 $${a} : ${b}$。把它们的${askVolume ? "体积" : "表面积"}之比（小比大）写成分数。`,
          ),
          answer,
          form: "fraction",
          wrong: [
            Q.of(a, b),
            askVolume ? Q.of(a * a, b * b) : Q.of(a ** 3, b ** 3),
            Q.of(b ** (askVolume ? 3 : 2), a ** (askVolume ? 3 : 2)),
          ],
          solution: askVolume
            ? t(
                `Volumes are in the ratio $k^3$:${steps(`\\left(\\frac{${a}}{${b}}\\right)^3 = ${num(answer)}`)}`,
                `体积之比是 $k^3$：${steps(`\\left(\\frac{${a}}{${b}}\\right)^3 = ${num(answer)}`)}`,
              )
            : t(
                `Surface areas are in the ratio $k^2$:${steps(`\\left(\\frac{${a}}{${b}}\\right)^2 = ${num(answer)}`)}`,
                `表面积之比是 $k^2$：${steps(`\\left(\\frac{${a}}{${b}}\\right)^2 = ${num(answer)}`)}`,
              ),
        });
      },
    },
    {
      id: "measures-of-a-similar-solid",
      title: t("Measures of a similar solid", "求相似立体图形的量"),
      explanation: t(
        "To find a measure of the other solid, multiply by the right power of the scale factor. Two similar boxes have heights $4$ cm and $6$ cm, so $k = \\frac{6}{4} = \\frac{3}{2}$. If the smaller has volume $40\\text{ cm}^3$, the larger has volume $40 \\cdot \\left(\\frac{3}{2}\\right)^3 = 40 \\cdot \\frac{27}{8} = 135\\text{ cm}^3$.",
        "要求另一个立体图形的量，就乘以相似比的相应次方。两个相似长方体的高分别是 $4$ 厘米和 $6$ 厘米，所以 $k = \\frac{6}{4} = \\frac{3}{2}$。如果较小的体积是 $40\\text{ cm}^3$，较大的体积就是 $40 \\cdot \\left(\\frac{3}{2}\\right)^3 = 40 \\cdot \\frac{27}{8} = 135\\text{ cm}^3$。",
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
        const solid = rng.pick([t("cylinders", "圆柱"), t("cones", "圆锥"), t("boxes", "长方体"), t("pyramids", "棱锥")]);
        const measure = askVolume ? t("volume", "体积") : t("surface area", "表面积");
        const k = up ? Q.of(b, a) : Q.of(a, b);
        return numberProblem({
          prompt: t(
            `Two similar ${solid.en} have heights $${tex(ha, u)}$ and $${tex(hb, u)}$. The ${up ? "smaller" : "larger"} one has a ${measure.en} of $${tex(given, u, power)}$. Find the ${measure.en} of the ${up ? "larger" : "smaller"} one.`,
            `两个相似的${solid["zh-CN"]}的高分别是 $${tex(ha, u)}$ 和 $${tex(hb, u)}$。${up ? "较小" : "较大"}的那个${measure["zh-CN"]}是 $${tex(given, u, power)}$。求${up ? "较大" : "较小"}的那个的${measure["zh-CN"]}。`,
          ),
          answer,
          unit: `${u}^${power}`,
          wrong: [given.mul(k), given.mul(k.pow(askVolume ? 2 : 3)), given.mul(k.pow(power === 2 ? 1 : 2))],
          solution: t(
            `The scale factor is $k = ${num(k)}$, and ${measure.en}s scale by $k^${power}$:${steps(`${num(given)} \\cdot \\left(${num(k)}\\right)^${power} = ${num(answer)}\\text{ ${u}}^${power}`)}`,
            `相似比 $k = ${num(k)}$，${measure["zh-CN"]}按 $k^${power}$ 变化：${steps(`${num(given)} \\cdot \\left(${num(k)}\\right)^${power} = ${num(answer)}\\text{ ${u}}^${power}`)}`,
          ),
        });
      },
    },
    {
      id: "from-one-ratio-to-another",
      title: t("From one ratio to another", "由一种比求另一种比"),
      explanation: t(
        "Go back to the scale factor first. If two similar solids have volumes in the ratio $8 : 125$, then $k^3 = \\frac{8}{125}$, so $k = \\sqrt[3]{\\frac{8}{125}} = \\frac{2}{5}$, and their surface areas are in the ratio $k^2 = \\frac{4}{25}$.\n\nIf their surface areas are in the ratio $9 : 16$, then $k = \\frac{3}{4}$ and their volumes are in the ratio $\\frac{27}{64}$.",
        "先回到相似比。如果两个相似立体图形的体积之比是 $8 : 125$，那么 $k^3 = \\frac{8}{125}$，所以 $k = \\sqrt[3]{\\frac{8}{125}} = \\frac{2}{5}$，它们的表面积之比是 $k^2 = \\frac{4}{25}$。\n\n如果表面积之比是 $9 : 16$，那么 $k = \\frac{3}{4}$，体积之比是 $\\frac{27}{64}$。",
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
            wrong: [Q.of(a * a, b * b), Q.of(a ** 3, b ** 3), Q.of(a * a, 2 * b * b)],
            solution: t(
              `$k^2 = \\frac{${a * a}}{${b * b}}$, so:${steps(`k = \\sqrt{\\frac{${a * a}}{${b * b}}} = ${num(k)}`)}`,
              `$k^2 = \\frac{${a * a}}{${b * b}}$，所以：${steps(`k = \\sqrt{\\frac{${a * a}}{${b * b}}} = ${num(k)}`)}`,
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
          wrong: [k, volumeGiven ? k.pow(3) : k.pow(2), volumeGiven ? Q.of(a ** 3 * 2, b ** 3 * 3) : Q.of(a * a * 3, b * b * 2)],
          solution: volumeGiven
            ? t(
                `$k^3 = \\frac{${a ** 3}}{${b ** 3}}$, so $k = ${num(k)}$:${steps(`k^2 = ${num(answer)}`)}`,
                `$k^3 = \\frac{${a ** 3}}{${b ** 3}}$，所以 $k = ${num(k)}$：${steps(`k^2 = ${num(answer)}`)}`,
              )
            : t(
                `$k^2 = \\frac{${a * a}}{${b * b}}$, so $k = ${num(k)}$:${steps(`k^3 = ${num(answer)}`)}`,
                `$k^2 = \\frac{${a * a}}{${b * b}}$，所以 $k = ${num(k)}$：${steps(`k^3 = ${num(answer)}`)}`,
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
  knowledgePoints: [
    {
      id: "volume-in-terms-of-pi",
      title: t("Volume in terms of π", "用 π 表示体积"),
      explanation: t(
        "Like a prism, a cylinder has volume base area times height, $V = Bh$. Its base is a circle of radius $r$, with area $\\pi r^2$, so\n\n$$V = \\pi r^2 h.$$\n\nA cylinder with radius $3$ cm and height $5$ cm has $V = \\pi \\cdot 9 \\cdot 5 = 45\\pi\\text{ cm}^3$. Leaving the answer in terms of $\\pi$ keeps it exact. If the diameter is given, halve it first.",
        "和棱柱一样，圆柱的体积是底面积乘高，$V = Bh$。它的底面是半径为 $r$ 的圆，面积是 $\\pi r^2$，所以\n\n$$V = \\pi r^2 h.$$\n\n半径 $3$ 厘米、高 $5$ 厘米的圆柱 $V = \\pi \\cdot 9 \\cdot 5 = 45\\pi\\text{ cm}^3$。用含 $\\pi$ 的式子表示可以保持答案精确。如果给的是直径，先把它减半。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 10);
        const { r } = size;
        const h = rng.int(2, 15);
        return {
          ...piProblem({
            prompt: volumeIn(t("cylinder", "圆柱"), u),
            coef: r * r * h,
            wrong: [2 * r * h, r * h, 4 * r * r * h, 2 * r * r * h],
            solution: t(
              `${sizeStep(size).en}${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder with ${sizeText(size, u).en.replace(/\$|\\text\{ ?|\}/g, "")} and height ${h} ${u}.`,
            `一个${sizeText(size, u)["zh-CN"].replace(/\$|\\text\{ ?|\}/g, "")}、高 ${h} ${u} 的圆柱。`,
          ),
        };
      },
    },
    {
      id: "approximating-with-pi",
      title: t("Approximating with 3.14", "用 3.14 近似计算"),
      explanation: t(
        "For a decimal answer, replace $\\pi$ by an approximation such as $3.14$ at the end.\n\nA cylinder with radius $2$ m and height $10$ m has $V = 40\\pi \\approx 40 \\cdot 3.14 = 125.6\\text{ m}^3$.",
        "需要小数答案时，最后再用 $3.14$ 之类的近似值代替 $\\pi$。\n\n半径 $2$ 米、高 $10$ 米的圆柱 $V = 40\\pi \\approx 40 \\cdot 3.14 = 125.6\\text{ m}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const pi = Q.parse("3.14");
        const v = pi.mul(Q.of(r * r * h));
        return numberProblem({
          prompt: t(
            `A cylinder has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find its volume using $\\pi \\approx 3.14$.`,
            `一个圆柱的半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。取 $\\pi \\approx 3.14$，求它的体积。`,
          ),
          answer: v,
          form: "decimal",
          unit: `${u}^3`,
          wrong: [pi.mul(Q.of(2 * r * h)), pi.mul(Q.of(r * h)), Q.of(r * r * h), pi.mul(Q.of(4 * r * r * h))],
          solution: t(
            `${steps(`V = \\pi r^2 h = ${piTex(r * r * h)} \\approx ${r * r * h} \\cdot 3.14 = ${dec(v)}\\text{ ${u}}^3`)}`,
            `${steps(`V = \\pi r^2 h = ${piTex(r * r * h)} \\approx ${r * r * h} \\cdot 3.14 = ${dec(v)}\\text{ ${u}}^3`)}`,
          ),
        });
      },
    },
    {
      id: "missing-radius-or-height",
      title: t("A missing radius or height", "求未知的半径或高"),
      explanation: t(
        "Substitute into $V = \\pi r^2 h$ and divide both sides by $\\pi$.\n\nA cylinder with volume $72\\pi\\text{ cm}^3$ and radius $3$ cm has $9h = 72$, so $h = 8$ cm. A cylinder with volume $80\\pi\\text{ cm}^3$ and height $5$ cm has $r^2 = 16$, so $r = 4$ cm.",
        "代入 $V = \\pi r^2 h$，两边同除以 $\\pi$。\n\n体积 $72\\pi\\text{ cm}^3$、半径 $3$ 厘米的圆柱满足 $9h = 72$，所以 $h = 8$ 厘米。体积 $80\\pi\\text{ cm}^3$、高 $5$ 厘米的圆柱满足 $r^2 = 16$，所以 $r = 4$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const v = r * r * h;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A cylinder has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a radius of $${tex(r, u)}$. Find its height.`,
              `一个圆柱的体积是 $${piTex(v)}\\text{ ${u}}^3$，半径是 $${tex(r, u)}$。求它的高。`,
            ),
            answer: h,
            unit: u,
            wrong: [Q.of(v, r), Q.of(v, 2 * r), v],
            solution: t(
              `${steps(`\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`, `${r * r}h = ${v}`, `h = ${tex(h, u)}`)}`,
              `${steps(`\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`, `${r * r}h = ${v}`, `h = ${tex(h, u)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A cylinder has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. Find its radius.`,
            `一个圆柱的体积是 $${piTex(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。求它的半径。`,
          ),
          answer: r,
          unit: u,
          wrong: [r * r, Q.of(v, h * 2), 2 * r],
          solution: t(
            `${steps(`\\pi r^2 \\cdot ${h} = ${piTex(v)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
            `${steps(`\\pi r^2 \\cdot ${h} = ${piTex(v)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
          ),
        });
      },
    },
  ],
};

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
    { topic: "finding-surface-areas-using-nets", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "lateral-area-of-a-cylinder",
      title: t("Lateral area", "侧面积"),
      explanation: t(
        "Cut the curved side of a cylinder straight down and unroll it: it becomes a rectangle. Its height is the height $h$ of the cylinder, and its width is the circumference of the base, $2\\pi r$. So the **lateral area** is\n\n$$L = 2\\pi r h.$$\n\nA cylinder with radius $4$ cm and height $7$ cm has $L = 2\\pi \\cdot 4 \\cdot 7 = 56\\pi\\text{ cm}^2$.",
        "把圆柱的侧面沿一条直线剪开并展平，就得到一个长方形。它的高是圆柱的高 $h$，宽是底面的周长 $2\\pi r$。所以**侧面积**是\n\n$$L = 2\\pi r h.$$\n\n半径 $4$ 厘米、高 $7$ 厘米的圆柱 $L = 2\\pi \\cdot 4 \\cdot 7 = 56\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const h = rng.int(2, 15);
        return {
          ...piProblem({
            prompt: t(
              `Find the lateral area of the cylinder, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆柱的侧面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: 2 * r * h,
            wrong: [r * h, r * r * h, 2 * r * h + 2 * r * r, 4 * r * h],
            solution: t(
              `${sizeStep(size).en}${steps(`L = 2\\pi r h = 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * h)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`L = 2\\pi r h = 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * h)}`)}`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and height ${h} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、高 ${h} ${u} 的圆柱。`,
          ),
        };
      },
    },
    {
      id: "total-surface-area-of-a-cylinder",
      title: t("Total surface area", "表面积"),
      explanation: t(
        "The net of a cylinder is two circles and a rectangle. Adding the two bases to the lateral area gives the surface area\n\n$$S = 2\\pi r^2 + 2\\pi r h.$$\n\nA cylinder with radius $3$ cm and height $5$ cm has $S = 18\\pi + 30\\pi = 48\\pi\\text{ cm}^2$.",
        "圆柱的展开图是两个圆和一个长方形。把两个底面加到侧面积上，得到表面积\n\n$$S = 2\\pi r^2 + 2\\pi r h.$$\n\n半径 $3$ 厘米、高 $5$ 厘米的圆柱 $S = 18\\pi + 30\\pi = 48\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 12);
        const { r } = size;
        const h = rng.int(2, 15);
        const s = 2 * r * r + 2 * r * h;
        return {
          ...piProblem({
            prompt: t(
              `Find the surface area of the cylinder, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `求这个圆柱的表面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: [2 * r * h, r * r + 2 * r * h, r * r * h, 2 * r * r + r * h],
            solution: t(
              `${sizeStep(size).en}${steps(`S = 2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`S = 2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(2 * r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}`)}`,
            ),
          }),
          figure: figure(
            cylinderMarks(r, h, { ...sizeLabels(size, u), h: len(h, u) }),
            `A cylinder of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and height ${h} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、高 ${h} ${u} 的圆柱。`,
          ),
        };
      },
    },
    {
      id: "open-cylinders-and-missing-heights",
      title: t("Open cylinders and missing heights", "无盖圆柱与未知的高"),
      explanation: t(
        "A cylinder open at the top, like a cup, has one base: $S = \\pi r^2 + 2\\pi r h$.\n\nTo find a missing height, substitute and solve. A cylinder with radius $2$ cm and surface area $40\\pi\\text{ cm}^2$ has $8\\pi + 4\\pi h = 40\\pi$, so $4h = 32$ and $h = 8$ cm.",
        "上面开口的圆柱（比如杯子）只有一个底面：$S = \\pi r^2 + 2\\pi r h$。\n\n求未知的高时，代入后解方程。半径 $2$ 厘米、表面积 $40\\pi\\text{ cm}^2$ 的圆柱满足 $8\\pi + 4\\pi h = 40\\pi$，所以 $4h = 32$，$h = 8$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        if (rng.bool()) {
          const s = r * r + 2 * r * h;
          return piProblem({
            prompt: t(
              `A cylindrical cup with no lid has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find the area of its outside surface, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `一个无盖的圆柱形杯子半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。求它外表面的面积（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: [2 * r * r + 2 * r * h, 2 * r * h, r * r + r * h],
            solution: t(
              `One base and the lateral surface:${steps(`S = \\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}`)}`,
              `一个底面加侧面：${steps(`S = \\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot ${h} = ${piTex(r * r)} + ${piTex(2 * r * h)} = ${piTex(s)}`)}`,
            ),
          });
        }
        const s = 2 * r * r + 2 * r * h;
        return numberProblem({
          prompt: t(
            `A cylinder has radius $${tex(r, u)}$ and surface area $${piTex(s)}\\text{ ${u}}^2$. Find its height.`,
            `一个圆柱的半径是 $${tex(r, u)}$，表面积是 $${piTex(s)}\\text{ ${u}}^2$。求它的高。`,
          ),
          answer: h,
          unit: u,
          wrong: [Q.of(s, 2 * r), Q.of(s - r * r, 2 * r), Q.of(s, r * r)],
          solution: t(
            `${steps(`2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot h = ${piTex(s)}`, `${2 * r * r} + ${2 * r}h = ${s}`, `${2 * r}h = ${2 * r * h}`, `h = ${tex(h, u)}`)}`,
            `${steps(`2\\pi \\cdot ${r}^2 + 2\\pi \\cdot ${r} \\cdot h = ${piTex(s)}`, `${2 * r * r} + ${2 * r}h = ${s}`, `${2 * r}h = ${2 * r * h}`, `h = ${tex(h, u)}`)}`,
          ),
        });
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
  encompasses: [
    { topic: "volumes-of-cylinders", weight: 0.4 },
    { topic: "volumes-of-pyramids", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.8.G.C.9"],
  knowledgePoints: [
    {
      id: "one-third-of-a-cylinder",
      title: t("One third of a cylinder", "圆柱的三分之一"),
      explanation: t(
        "In a **right cone** the apex is directly above the center of the circular base; the **height** $h$ is the distance from the apex to the base. Like a pyramid, a cone holds one third of the cylinder with the same base and height:\n\n$$V = \\frac{1}{3}\\pi r^2 h.$$\n\nA cone with radius $3$ cm and height $4$ cm has $V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi\\text{ cm}^3$.",
        "**圆锥**（直圆锥）的顶点在圆形底面圆心的正上方，**高** $h$ 是顶点到底面的距离。和棱锥一样，圆锥的体积是同底等高的圆柱体积的三分之一：\n\n$$V = \\frac{1}{3}\\pi r^2 h.$$\n\n半径 $3$ 厘米、高 $4$ 厘米的圆锥 $V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi\\text{ cm}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const size = roundSize(rng, 1, 10);
        const { r } = size;
        const h = rng.int(2, 15);
        const v = Q.of(r * r * h, 3);
        return {
          ...piProblem({
            prompt: volumeIn(t("cone", "圆锥"), u),
            coef: v,
            wrong: [r * r * h, Q.of(r * h, 3), Q.of(2 * r * r * h, 3), Q.of(r * r * h, 2)],
            solution: t(
              `${sizeStep(size).en}${steps(`V = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`V = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}`,
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
      title: t("Cones and cylinders", "圆锥与圆柱"),
      explanation: t(
        "A cone and a cylinder with the same base and the same height have volumes in the ratio $1 : 3$. If such a cylinder holds $60\\pi\\text{ cm}^3$, the cone holds $20\\pi\\text{ cm}^3$; if the cone holds $15\\text{ cm}^3$, the cylinder holds $45\\text{ cm}^3$.\n\nIt takes three cones of water to fill the cylinder.",
        "同底等高的圆锥与圆柱的体积之比是 $1 : 3$。如果这样的圆柱容积是 $60\\pi\\text{ cm}^3$，圆锥的容积就是 $20\\pi\\text{ cm}^3$；如果圆锥的容积是 $15\\text{ cm}^3$，圆柱的容积就是 $45\\text{ cm}^3$。\n\n用圆锥装水，倒三次才能装满圆柱。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const k = rng.int(2, 60);
        const fromCylinder = rng.bool();
        const [given, answer] = fromCylinder ? [3 * k, k] : [k, 3 * k];
        return numberProblem({
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
                `The cone holds one third of the cylinder:${steps(`${given} \\div 3 = ${tex(answer, u, 3)}`)}`,
                `圆锥的体积是圆柱的三分之一：${steps(`${given} \\div 3 = ${tex(answer, u, 3)}`)}`,
              )
            : t(
                `The cylinder holds three times as much as the cone:${steps(`3 \\cdot ${given} = ${tex(answer, u, 3)}`)}`,
                `圆柱的体积是圆锥的三倍：${steps(`3 \\cdot ${given} = ${tex(answer, u, 3)}`)}`,
              ),
        });
      },
    },
    {
      id: "missing-radius-or-height-of-a-cone",
      title: t("A missing radius or height", "求未知的半径或高"),
      explanation: t(
        "Substitute into $V = \\frac{1}{3}\\pi r^2 h$, divide by $\\pi$ and multiply by $3$.\n\nA cone with volume $50\\pi\\text{ cm}^3$ and radius $5$ cm has $\\frac{1}{3} \\cdot 25h = 50$, so $25h = 150$ and $h = 6$ cm.",
        "代入 $V = \\frac{1}{3}\\pi r^2 h$，两边除以 $\\pi$ 再乘以 $3$。\n\n体积 $50\\pi\\text{ cm}^3$、半径 $5$ 厘米的圆锥满足 $\\frac{1}{3} \\cdot 25h = 50$，所以 $25h = 150$，$h = 6$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const v = Q.of(r * r * h, 3);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A cone has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a radius of $${tex(r, u)}$. Find its height.`,
              `一个圆锥的体积是 $${piTex(v)}\\text{ ${u}}^3$，半径是 $${tex(r, u)}$。求它的高。`,
            ),
            answer: h,
            unit: u,
            wrong: [v.div(Q.of(r * r)), v.mul(Q.of(3)).div(Q.of(r)), v.mul(Q.of(3))],
            solution: t(
              `${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`, `${r * r}h = ${r * r * h}`, `h = ${tex(h, u)}`)}`,
              `${steps(`\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot h = ${piTex(v)}`, `${r * r}h = ${r * r * h}`, `h = ${tex(h, u)}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A cone has a volume of $${piTex(v)}\\text{ ${u}}^3$ and a height of $${tex(h, u)}$. Find its radius.`,
            `一个圆锥的体积是 $${piTex(v)}\\text{ ${u}}^3$，高是 $${tex(h, u)}$。求它的半径。`,
          ),
          answer: r,
          unit: u,
          wrong: [r * r, v.div(Q.of(h)), 3 * r],
          solution: t(
            `${steps(`\\frac{1}{3}\\pi r^2 \\cdot ${h} = ${piTex(v)}`, `${h}r^2 = ${r * r * h}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
            `${steps(`\\frac{1}{3}\\pi r^2 \\cdot ${h} = ${piTex(v)}`, `${h}r^2 = ${r * r * h}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
          ),
        });
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "slant-height-from-radius-and-height",
      title: t("Slant height from radius and height", "由半径和高求母线长"),
      explanation: t(
        "The **slant height** $l$ of a right cone is the distance from the apex to any point on the edge of the base. The height $h$, a radius $r$ and the slant height form a right triangle with $l$ as hypotenuse, so\n\n$$l = \\sqrt{r^2 + h^2}.$$\n\nA cone with radius $5$ cm and height $12$ cm has $l = \\sqrt{25 + 144} = 13$ cm; with radius $2$ and height $4$, $l = \\sqrt{20} = 2\\sqrt{5}$.",
        "圆锥的**母线**是从顶点到底面圆周上任意一点的线段，它的长 $l$ 叫母线长。高 $h$、半径 $r$ 和母线组成一个以 $l$ 为斜边的直角三角形，所以\n\n$$l = \\sqrt{r^2 + h^2}.$$\n\n半径 $5$ 厘米、高 $12$ 厘米的圆锥 $l = \\sqrt{25 + 144} = 13$ 厘米；半径 $2$、高 $4$ 时，$l = \\sqrt{20} = 2\\sqrt{5}$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const h = rng.int(2, 15);
        const n = r * r + h * h;
        return {
          ...rootProblem({
            prompt: t(
              `Find the slant height $l$ of the cone, in ${u}. Write it in simplest radical form.`,
              `求这个圆锥的母线长 $l$（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(r + h), `\\sqrt{${Math.abs(h * h - r * r)}}`, `\\sqrt{${r + h}}`],
            solution: t(
              `${steps(`l = \\sqrt{${r}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
              `${steps(`l = \\sqrt{${r}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
            ),
          }),
          figure: figure(
            coneMarks(r, h, { r: len(r, u), h: len(h, u), l: "l" }),
            `A cone with radius ${r} ${u}, height ${h} ${u} and slant height l.`,
            `一个半径 ${r} ${u}、高 ${h} ${u}、母线长为 l 的圆锥。`,
          ),
        };
      },
    },
    {
      id: "height-from-slant-height",
      title: t("Height from the slant height", "由母线长求高"),
      explanation: t(
        "The slant height is the hypotenuse, so subtract to find a leg:\n\n$$h = \\sqrt{l^2 - r^2}.$$\n\nA cone with slant height $10$ cm and radius $6$ cm has $h = \\sqrt{100 - 36} = 8$ cm.",
        "母线是斜边，所以用减法求直角边：\n\n$$h = \\sqrt{l^2 - r^2}.$$\n\n母线长 $10$ 厘米、半径 $6$ 厘米的圆锥 $h = \\sqrt{100 - 36} = 8$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const l = rng.int(r + 1, 20);
        const n = l * l - r * r;
        return {
          ...rootProblem({
            prompt: t(
              `A cone has slant height $${tex(l, u)}$ and radius $${tex(r, u)}$. Find its height, in ${u}. Write it in simplest radical form.`,
              `一个圆锥的母线长是 $${tex(l, u)}$，半径是 $${tex(r, u)}$。求它的高（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(l - r), rootTex(l * l + r * r), `\\sqrt{${l - r}}`],
            solution: t(
              `${steps(`h = \\sqrt{${l}^2 - ${r}^2} = ${rootSteps(n)}`)}`,
              `${steps(`h = \\sqrt{${l}^2 - ${r}^2} = ${rootSteps(n)}`)}`,
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
      title: t("Radius or diameter", "求半径或由直径求母线"),
      explanation: t(
        "In the same way, $r = \\sqrt{l^2 - h^2}$. If the diameter is given, halve it before using the right triangle: a cone with diameter $10$ cm and height $12$ cm has $r = 5$ cm and $l = \\sqrt{25 + 144} = 13$ cm.",
        "同样地，$r = \\sqrt{l^2 - h^2}$。如果给的是直径，先把它减半再用直角三角形：直径 $10$ 厘米、高 $12$ 厘米的圆锥 $r = 5$ 厘米，$l = \\sqrt{25 + 144} = 13$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool()) {
          const h = rng.int(1, 12);
          const l = rng.int(h + 1, 20);
          const n = l * l - h * h;
          return rootProblem({
            prompt: t(
              `A cone has slant height $${tex(l, u)}$ and height $${tex(h, u)}$. Find its radius, in ${u}. Write it in simplest radical form.`,
              `一个圆锥的母线长是 $${tex(l, u)}$，高是 $${tex(h, u)}$。求它的半径（单位：${u}）。用最简根式表示。`,
            ),
            n,
            wrong: [String(l - h), rootTex(l * l + h * h), rootTex(4 * n)],
            solution: t(
              `${steps(`r = \\sqrt{${l}^2 - ${h}^2} = ${rootSteps(n)}`)}`,
              `${steps(`r = \\sqrt{${l}^2 - ${h}^2} = ${rootSteps(n)}`)}`,
            ),
          });
        }
        const r = rng.int(1, 10);
        const h = rng.int(2, 15);
        const n = r * r + h * h;
        return rootProblem({
          prompt: t(
            `A cone has diameter $${tex(2 * r, u)}$ and height $${tex(h, u)}$. Find its slant height, in ${u}. Write it in simplest radical form.`,
            `一个圆锥的直径是 $${tex(2 * r, u)}$，高是 $${tex(h, u)}$。求它的母线长（单位：${u}）。用最简根式表示。`,
          ),
          n,
          wrong: [rootTex(4 * r * r + h * h), String(r + h)],
          solution: t(
            `The radius is $${r}$:${steps(`l = \\sqrt{${r}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
            `半径是 $${r}$：${steps(`l = \\sqrt{${r}^2 + ${h}^2} = ${rootSteps(n)}`)}`,
          ),
        });
      },
    },
  ],
};

export const surfaceAreasOfRightCones: TopicDef = {
  id: "surface-areas-of-right-cones",
  title: t("Surface Areas of Right Cones", "圆锥的表面积"),
  summary: t("Find the lateral area πrl and the surface area πr² + πrl of a right cone.", "求圆锥的侧面积 πrl 和表面积 πr² + πrl。"),
  prerequisites: ["slant-heights-of-right-cones", "surface-areas-of-cylinders"],
  encompasses: [
    { topic: "slant-heights-of-right-cones", weight: 0.4 },
    { topic: "areas-of-circles", weight: 0.2 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "lateral-area-of-a-cone",
      title: t("Lateral area", "侧面积"),
      explanation: t(
        "Unrolled, the curved surface of a cone is a sector of a circle of radius $l$, whose arc is the circumference of the base, $2\\pi r$. Its area is a fraction $\\frac{2\\pi r}{2\\pi l} = \\frac{r}{l}$ of the full circle $\\pi l^2$, so the **lateral area** is\n\n$$L = \\pi r l.$$\n\nA cone with radius $3$ cm and slant height $5$ cm has $L = 15\\pi\\text{ cm}^2$. Use the slant height here, not the height.",
        "圆锥的侧面展开后是一个半径为 $l$ 的扇形，它的弧长等于底面周长 $2\\pi r$。它的面积是整个圆 $\\pi l^2$ 的 $\\frac{2\\pi r}{2\\pi l} = \\frac{r}{l}$，所以**侧面积**是\n\n$$L = \\pi r l.$$\n\n半径 $3$ 厘米、母线长 $5$ 厘米的圆锥 $L = 15\\pi\\text{ cm}^2$。这里用的是母线长，而不是高。",
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
              `${steps(`L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}`)}`,
              `${steps(`L = \\pi r l = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * l)}`)}`,
            ),
          }),
          figure: figure(
            coneMarks(r, Math.sqrt(l * l - r * r), { r: len(r, u), l: len(l, u) }),
            `A cone with radius ${r} ${u} and slant height ${l} ${u}.`,
            `一个半径 ${r} ${u}、母线长 ${l} ${u} 的圆锥。`,
          ),
        };
      },
    },
    {
      id: "total-surface-area-of-a-cone",
      title: t("Total surface area", "表面积"),
      explanation: t(
        "Add the circular base to the lateral area:\n\n$$S = \\pi r^2 + \\pi r l.$$\n\nA cone with radius $3$ cm and slant height $5$ cm has $S = 9\\pi + 15\\pi = 24\\pi\\text{ cm}^2$.",
        "把圆形底面加到侧面积上：\n\n$$S = \\pi r^2 + \\pi r l.$$\n\n半径 $3$ 厘米、母线长 $5$ 厘米的圆锥 $S = 9\\pi + 15\\pi = 24\\pi\\text{ cm}^2$。",
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
              `${sizeStep(size).en}${steps(`S = \\pi \\cdot ${r}^2 + \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`S = \\pi \\cdot ${r}^2 + \\pi \\cdot ${r} \\cdot ${l} = ${piTex(r * r)} + ${piTex(r * l)} = ${piTex(s)}`)}`,
            ),
          }),
          figure: figure(
            coneMarks(r, Math.sqrt(l * l - r * r), { ...sizeLabels(size, u), l: len(l, u) }),
            `A cone of ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u} and slant height ${l} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"} ${size.byDiameter ? 2 * r : r} ${u}、母线长 ${l} ${u} 的圆锥。`,
          ),
        };
      },
    },
    {
      id: "surface-area-from-the-height",
      title: t("Surface area from the height", "由高求表面积"),
      explanation: t(
        "If the height is given instead of the slant height, find $l = \\sqrt{r^2 + h^2}$ first.\n\nA cone with radius $6$ cm and height $8$ cm has $l = \\sqrt{36 + 64} = 10$ cm, so $S = 36\\pi + 60\\pi = 96\\pi\\text{ cm}^2$.",
        "如果给的是高而不是母线长，先求 $l = \\sqrt{r^2 + h^2}$。\n\n半径 $6$ 厘米、高 $8$ 厘米的圆锥 $l = \\sqrt{36 + 64} = 10$ 厘米，所以 $S = 36\\pi + 60\\pi = 96\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [a, b, c] = rng.pick(rightTriples);
        const m = rng.int(1, 2);
        const [r, h] = (rng.bool() ? [a * m, b * m] : [b * m, a * m]) as [number, number];
        const l = c * m;
        const lateralOnly = rng.bool(0.3);
        const s = lateralOnly ? r * l : r * r + r * l;
        return {
          ...piProblem({
            prompt: t(
              `A cone has radius $${tex(r, u)}$ and height $${tex(h, u)}$. Find its ${lateralOnly ? "lateral area" : "surface area"}, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `一个圆锥的半径是 $${tex(r, u)}$，高是 $${tex(h, u)}$。求它的${lateralOnly ? "侧面积" : "表面积"}（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: s,
            wrong: lateralOnly ? [r * h, r * r + r * l, r * r + r * h] : [r * r + r * h, r * l, Q.of(r * r * h, 3)],
            solution: t(
              `First the slant height:${steps(`l = \\sqrt{${r}^2 + ${h}^2} = \\sqrt{${l * l}} = ${l}`, lateralOnly ? `L = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}` : `S = \\pi \\cdot ${r}^2 + \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}`)}`,
              `先求母线长：${steps(`l = \\sqrt{${r}^2 + ${h}^2} = \\sqrt{${l * l}} = ${l}`, lateralOnly ? `L = \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}` : `S = \\pi \\cdot ${r}^2 + \\pi \\cdot ${r} \\cdot ${l} = ${piTex(s)}`)}`,
            ),
          }),
          figure: figure(
            coneMarks(r, h, { r: len(r, u), h: len(h, u) }),
            `A cone with radius ${r} ${u} and height ${h} ${u}.`,
            `一个半径 ${r} ${u}、高 ${h} ${u} 的圆锥。`,
          ),
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "volume-of-a-sphere",
      title: t("Volume of a sphere", "球的体积"),
      explanation: t(
        "A sphere of radius $r$ has volume\n\n$$V = \\frac{4}{3}\\pi r^3.$$\n\nIt is two thirds of the cylinder that just contains it (radius $r$, height $2r$, volume $2\\pi r^3$). A sphere with radius $3$ cm has $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$; with diameter $4$ cm, $r = 2$ and $V = \\frac{32}{3}\\pi\\text{ cm}^3$.",
        "半径为 $r$ 的球的体积是\n\n$$V = \\frac{4}{3}\\pi r^3.$$\n\n它是恰好装下这个球的圆柱（半径 $r$、高 $2r$、体积 $2\\pi r^3$）体积的三分之二。半径 $3$ 厘米的球 $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$；直径 $4$ 厘米时，$r = 2$，$V = \\frac{32}{3}\\pi\\text{ cm}^3$。",
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
            wrong: [4 * r * r, Q.of(4 * r * r, 3), Q.of(r ** 3, 3), Q.of(4 * 8 * r ** 3, 3), 4 * r ** 3],
            solution: t(
              `${sizeStep(size).en}${steps(`V = \\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`V = \\frac{4}{3}\\pi \\cdot ${r}^3 = \\frac{4}{3}\\pi \\cdot ${r ** 3} = ${piTex(v)}`)}`,
            ),
          }),
          figure: figure(
            sphereMarks(sizeLabels(size, u)),
            `A sphere with ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"}为 ${size.byDiameter ? 2 * r : r} ${u} 的球。`,
          ),
        };
      },
    },
    {
      id: "volume-of-a-hemisphere",
      title: t("Volume of a hemisphere", "半球的体积"),
      explanation: t(
        "A hemisphere is half a sphere, so its volume is\n\n$$V = \\frac{1}{2} \\cdot \\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3.$$\n\nA hemispherical bowl with radius $6$ cm holds $\\frac{2}{3}\\pi \\cdot 216 = 144\\pi\\text{ cm}^3$.",
        "半球是球的一半，所以它的体积是\n\n$$V = \\frac{1}{2} \\cdot \\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3.$$\n\n半径 $6$ 厘米的半球形碗能装 $\\frac{2}{3}\\pi \\cdot 216 = 144\\pi\\text{ cm}^3$。",
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
        return piProblem({
          prompt: t(
            `A ${what.en} has ${sizeText(size, u).en}. Find its volume, in $${unitTex(u, 3)}$. ${inPi.en}`,
            `一个${sizeText(size, u)["zh-CN"]}的${what["zh-CN"]}。求它的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
          ),
          coef: v,
          wrong: [Q.of(4 * r ** 3, 3), 2 * r * r, Q.of(r ** 3, 3), Q.of(2 * 8 * r ** 3, 3)],
          solution: t(
            `${sizeStep(size).en}${steps(`V = \\frac{2}{3}\\pi \\cdot ${r}^3 = ${piTex(v)}`)}`,
            `${sizeStep(size)["zh-CN"]}${steps(`V = \\frac{2}{3}\\pi \\cdot ${r}^3 = ${piTex(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "radius-from-the-volume",
      title: t("Radius from the volume", "由体积求半径"),
      explanation: t(
        "Substitute into $V = \\frac{4}{3}\\pi r^3$, divide by $\\pi$, multiply by $\\frac{3}{4}$, and take the cube root.\n\nA sphere with volume $288\\pi\\text{ cm}^3$ has $\\frac{4}{3}r^3 = 288$, so $r^3 = 216$ and $r = 6$ cm.",
        "代入 $V = \\frac{4}{3}\\pi r^3$，两边除以 $\\pi$，再乘以 $\\frac{3}{4}$，最后开立方。\n\n体积 $288\\pi\\text{ cm}^3$ 的球满足 $\\frac{4}{3}r^3 = 288$，所以 $r^3 = 216$，$r = 6$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        const v = Q.of(4 * r ** 3, 3);
        const askDiameter = rng.bool(0.3);
        return numberProblem({
          prompt: t(
            `A sphere has a volume of $${piTex(v)}\\text{ ${u}}^3$. Find its ${askDiameter ? "diameter" : "radius"}.`,
            `一个球的体积是 $${piTex(v)}\\text{ ${u}}^3$。求它的${askDiameter ? "直径" : "半径"}。`,
          ),
          answer: askDiameter ? 2 * r : r,
          unit: u,
          wrong: askDiameter ? [r, r ** 3, 4 * r] : [r ** 3, 2 * r, v],
          solution: t(
            `${steps(`\\frac{4}{3}\\pi r^3 = ${piTex(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`, `r = \\sqrt[3]{${r ** 3}} = ${r}`)}${askDiameter ? `The diameter is $2r = ${tex(2 * r, u)}$.` : ""}`,
            `${steps(`\\frac{4}{3}\\pi r^3 = ${piTex(v)}`, `r^3 = ${num(v)} \\cdot \\frac{3}{4} = ${r ** 3}`, `r = \\sqrt[3]{${r ** 3}} = ${r}`)}${askDiameter ? `直径是 $2r = ${tex(2 * r, u)}$。` : ""}`,
          ),
        });
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
  encompasses: [
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
    { topic: "volumes-of-spheres", weight: 0.2 },
    { topic: "areas-of-circles", weight: 0.2 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "surface-area-of-a-sphere",
      title: t("Surface area of a sphere", "球的表面积"),
      explanation: t(
        "A sphere of radius $r$ has surface area\n\n$$S = 4\\pi r^2,$$\n\nexactly four times the area of a circle through its center (a **great circle**). A sphere with radius $5$ cm has $S = 4\\pi \\cdot 25 = 100\\pi\\text{ cm}^2$.",
        "半径为 $r$ 的球的表面积是\n\n$$S = 4\\pi r^2,$$\n\n恰好是过球心的圆（**大圆**）面积的四倍。半径 $5$ 厘米的球 $S = 4\\pi \\cdot 25 = 100\\pi\\text{ cm}^2$。",
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
              `${sizeStep(size).en}${steps(`S = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}`)}`,
              `${sizeStep(size)["zh-CN"]}${steps(`S = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}`)}`,
            ),
          }),
          figure: figure(
            sphereMarks(sizeLabels(size, u)),
            `A sphere with ${size.byDiameter ? "diameter" : "radius"} ${size.byDiameter ? 2 * r : r} ${u}.`,
            `一个${size.byDiameter ? "直径" : "半径"}为 ${size.byDiameter ? 2 * r : r} ${u} 的球。`,
          ),
        };
      },
    },
    {
      id: "radius-from-the-surface-area",
      title: t("Radius from the surface area", "由表面积求半径"),
      explanation: t(
        "Substitute into $S = 4\\pi r^2$, divide by $4\\pi$ and take the square root.\n\nA sphere with surface area $196\\pi\\text{ cm}^2$ has $r^2 = 49$, so $r = 7$ cm.",
        "代入 $S = 4\\pi r^2$，两边除以 $4\\pi$，再开平方。\n\n表面积 $196\\pi\\text{ cm}^2$ 的球 $r^2 = 49$，所以 $r = 7$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 15);
        const s = 4 * r * r;
        return numberProblem({
          prompt: t(
            `A sphere has a surface area of $${piTex(s)}\\text{ ${u}}^2$. Find its radius.`,
            `一个球的表面积是 $${piTex(s)}\\text{ ${u}}^2$。求它的半径。`,
          ),
          answer: r,
          unit: u,
          wrong: [r * r, 2 * r, Q.of(s, 4), s],
          solution: t(
            `${steps(`4\\pi r^2 = ${piTex(s)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
            `${steps(`4\\pi r^2 = ${piTex(s)}`, `r^2 = ${r * r}`, `r = ${tex(r, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "hemispheres-and-volume",
      title: t("Hemispheres, and surface area from volume", "半球，以及由体积求表面积"),
      explanation: t(
        "A solid hemisphere has a curved surface, half of $4\\pi r^2$, and a flat circular face $\\pi r^2$:\n\n$$S = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2.$$\n\nTo pass from volume to surface area, find the radius first: a sphere with volume $36\\pi\\text{ cm}^3$ has $r^3 = 27$, $r = 3$ cm, and $S = 36\\pi\\text{ cm}^2$.",
        "实心半球有一个曲面（$4\\pi r^2$ 的一半）和一个平的圆面 $\\pi r^2$：\n\n$$S = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2.$$\n\n由体积求表面积时，先求半径：体积 $36\\pi\\text{ cm}^3$ 的球 $r^3 = 27$，$r = 3$ 厘米，$S = 36\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const r = rng.int(1, 12);
        if (rng.bool()) {
          return piProblem({
            prompt: t(
              `A solid hemisphere has radius $${tex(r, u)}$. Find its total surface area, including the flat face, in $${unitTex(u, 2)}$. ${inPi.en}`,
              `一个实心半球的半径是 $${tex(r, u)}$。求它的表面积（包括平的圆面，单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
            ),
            coef: 3 * r * r,
            wrong: [2 * r * r, 4 * r * r, 5 * r * r, r * r],
            solution: t(
              `The curved half plus the flat circle:${steps(`S = 2\\pi \\cdot ${r}^2 + \\pi \\cdot ${r}^2 = ${piTex(3 * r * r)}`)}`,
              `半个球面加上平的圆面：${steps(`S = 2\\pi \\cdot ${r}^2 + \\pi \\cdot ${r}^2 = ${piTex(3 * r * r)}`)}`,
            ),
          });
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
            `${steps(`\\frac{4}{3}r^3 = ${num(v)}`, `r^3 = ${r ** 3}, \\quad r = ${r}`, `S = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}`)}`,
            `${steps(`\\frac{4}{3}r^3 = ${num(v)}`, `r^3 = ${r ** 3}, \\quad r = ${r}`, `S = 4\\pi \\cdot ${r}^2 = ${piTex(4 * r * r)}`)}`,
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

export const conicalFrustums: TopicDef = {
  id: "conical-frustums",
  title: t("Conical Frustums", "圆台"),
  summary: t(
    "Find the volume and surface area of a frustum of a cone, as a difference of cones and by formula.",
    "把圆台看成两个圆锥之差，或用公式求它的体积和表面积。",
  ),
  prerequisites: ["surface-areas-of-right-cones"],
  encompasses: [
    { topic: "volumes-of-right-cones", weight: 0.4 },
    { topic: "surface-areas-of-right-cones", weight: 0.3 },
  ],
  xp: 16,
  knowledgePoints: [
    {
      id: "frustum-as-a-difference-of-cones",
      title: t("A difference of cones", "两个圆锥之差"),
      explanation: t(
        "Cutting a cone by a plane parallel to its base removes a small cone from the top and leaves a **frustum**: a solid with two parallel circular faces of different sizes. Its volume is the volume of the whole cone minus the volume of the small cone.\n\nA cone of radius $6$ cm and height $8$ cm, with the top cone of radius $3$ cm and height $4$ cm cut off, leaves\n\n$$V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 - \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 96\\pi - 12\\pi = 84\\pi\\text{ cm}^3.$$",
        "用平行于底面的平面截圆锥，截去顶部的小圆锥，剩下的部分叫**圆台**：它有两个大小不同、互相平行的圆面。圆台的体积是整个圆锥的体积减去小圆锥的体积。\n\n半径 $6$ 厘米、高 $8$ 厘米的圆锥，截去半径 $3$ 厘米、高 $4$ 厘米的顶部小圆锥后，剩下\n\n$$V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 - \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 96\\pi - 12\\pi = 84\\pi\\text{ cm}^3.$$",
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
        return {
          ...piProblem({
            prompt: t(
              `A cone has radius $${tex(R, u)}$ and height $${tex(H, u)}$. A plane parallel to the base cuts off a small cone of radius $${tex(r, u)}$ and height $${tex(h, u)}$ from the top. Find the volume of the frustum that remains, in $${unitTex(u, 3)}$. ${inPi.en}`,
              `一个圆锥的半径是 $${tex(R, u)}$，高是 $${tex(H, u)}$。用平行于底面的平面从顶部截去一个半径 $${tex(r, u)}$、高 $${tex(h, u)}$ 的小圆锥。求剩下的圆台的体积（单位：$${unitTex(u, 3)}$）。${inPi["zh-CN"]}`,
            ),
            coef: v,
            wrong: [big.add(small), Q.of((R - r) ** 2 * (H - h), 3), big, Q.of(R * R * H - r * r * h)],
            solution: t(
              `Whole cone minus small cone:${steps(`V = \\frac{1}{3}\\pi \\cdot ${R}^2 \\cdot ${H} - \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(big)} - ${piTex(small)} = ${piTex(v)}`)}`,
              `整个圆锥减去小圆锥：${steps(`V = \\frac{1}{3}\\pi \\cdot ${R}^2 \\cdot ${H} - \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(big)} - ${piTex(small)} = ${piTex(v)}`)}`,
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
        "Working out the difference of the two cones in general gives the volume of a frustum with radii $R$ and $r$ and height $h$ (the distance between the circular faces):\n\n$$V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right).$$\n\nWith $R = 6$, $r = 3$ and $h = 4$: $V = \\frac{1}{3}\\pi \\cdot 4 \\cdot (36 + 18 + 9) = 84\\pi$, as before.",
        "一般地算出两个圆锥之差，得到上下底面半径为 $R$ 和 $r$、高为 $h$（两个圆面之间的距离）的圆台的体积：\n\n$$V = \\frac{1}{3}\\pi h\\left(R^2 + Rr + r^2\\right).$$\n\n当 $R = 6$、$r = 3$、$h = 4$ 时：$V = \\frac{1}{3}\\pi \\cdot 4 \\cdot (36 + 18 + 9) = 84\\pi$，与前面相同。",
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
              `${steps(`V = \\frac{1}{3}\\pi \\cdot ${h} \\cdot (${R}^2 + ${R} \\cdot ${r} + ${r}^2) = \\frac{1}{3}\\pi \\cdot ${h} \\cdot ${inner} = ${piTex(v)}`)}`,
              `${steps(`V = \\frac{1}{3}\\pi \\cdot ${h} \\cdot (${R}^2 + ${R} \\cdot ${r} + ${r}^2) = \\frac{1}{3}\\pi \\cdot ${h} \\cdot ${inner} = ${piTex(v)}`)}`,
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
      title: t("Surface area of a frustum", "圆台的表面积"),
      explanation: t(
        "The slant height $l$ of a frustum is measured along its side, between the two circles. Its lateral area is the difference of the lateral areas of the two cones, which works out to\n\n$$L = \\pi(R + r)l.$$\n\nThe total surface area adds the two circles: $S = \\pi(R + r)l + \\pi R^2 + \\pi r^2$. If the height is given, the slant height is the hypotenuse of a right triangle with legs $h$ and $R - r$.\n\nWith $R = 7$, $r = 4$ and $l = 5$: $L = 55\\pi$ and $S = 55\\pi + 49\\pi + 16\\pi = 120\\pi$.",
        "圆台的母线长 $l$ 是沿侧面量出的两个圆之间的距离。它的侧面积是两个圆锥侧面积之差，化简得\n\n$$L = \\pi(R + r)l.$$\n\n表面积再加上两个圆：$S = \\pi(R + r)l + \\pi R^2 + \\pi r^2$。如果给的是高，母线就是直角边为 $h$ 和 $R - r$ 的直角三角形的斜边。\n\n当 $R = 7$、$r = 4$、$l = 5$ 时：$L = 55\\pi$，$S = 55\\pi + 49\\pi + 16\\pi = 120\\pi$。",
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
        const given = fromHeight
          ? t(`height $${tex(h, u)}$`, `高是 $${tex(h, u)}$`)
          : t(`slant height $${tex(l, u)}$`, `母线长是 $${tex(l, u)}$`);
        const slant = fromHeight ? [`l = \\sqrt{${h}^2 + (${R} - ${r})^2} = \\sqrt{${l * l}} = ${l}`] : [];
        return piProblem({
          prompt: t(
            `A frustum of a cone has radii $${tex(R, u)}$ and $${tex(r, u)}$, and ${given.en}. Find its ${askTotal ? "total surface area" : "lateral area"}, in $${unitTex(u, 2)}$. ${inPi.en}`,
            `一个圆台的上下底面半径分别是 $${tex(r, u)}$ 和 $${tex(R, u)}$，${given["zh-CN"]}。求它的${askTotal ? "表面积" : "侧面积"}（单位：$${unitTex(u, 2)}$）。${inPi["zh-CN"]}`,
          ),
          coef: answer,
          wrong: askTotal ? [lateral, lateral + R * R, (R + r) * h + R * R + r * r] : [(R - r) * l, total, (R + r) * h, R * l],
          solution: t(
            `${steps(...slant, `L = \\pi(${R} + ${r}) \\cdot ${l} = ${piTex(lateral)}`, ...(askTotal ? [`S = ${piTex(lateral)} + \\pi \\cdot ${R}^2 + \\pi \\cdot ${r}^2 = ${piTex(total)}`] : []))}`,
            `${steps(...slant, `L = \\pi(${R} + ${r}) \\cdot ${l} = ${piTex(lateral)}`, ...(askTotal ? [`S = ${piTex(lateral)} + \\pi \\cdot ${R}^2 + \\pi \\cdot ${r}^2 = ${piTex(total)}`] : []))}`,
          ),
        });
      },
    },
  ],
};

/** revolutionSolids are the solids a rotation can produce. */
const revolutionSolids: readonly Text[] = [t("cylinder", "圆柱"), t("cone", "圆锥"), t("sphere", "球"), t("frustum of a cone", "圆台")];

export const volumesOfRevolution: TopicDef = {
  id: "volumes-of-revolution",
  title: t("Volumes of Revolution", "旋转体的体积"),
  summary: t(
    "Name the solid swept out by rotating a plane shape about a line, and find the volume of cylinders and cones made this way.",
    "说出平面图形绕直线旋转形成的立体图形，并求这样得到的圆柱和圆锥的体积。",
  ),
  prerequisites: ["volumes-of-right-cones", "volumes-of-spheres", "the-coordinate-plane"],
  encompasses: [
    { topic: "volumes-of-right-cones", weight: 0.3 },
    { topic: "volumes-of-cylinders", weight: 0.3 },
    { topic: "the-coordinate-plane", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.GMD.B.4"],
  knowledgePoints: [
    {
      id: "solids-of-revolution",
      title: t("Solids of revolution", "旋转体"),
      explanation: t(
        "Rotating a plane shape a full turn about a line in its plane, the **axis**, sweeps out a **solid of revolution**. Each point of the shape traces a circle around the axis.\n\n- A rectangle rotated about one of its sides makes a cylinder.\n- A right triangle rotated about one of its legs makes a cone.\n- A semicircle rotated about its diameter makes a sphere.\n- A right trapezoid rotated about the side perpendicular to its bases makes a frustum of a cone.",
        "把一个平面图形绕它所在平面内的一条直线（**轴**）旋转一周，扫过的空间形成**旋转体**。图形上的每一点都绕轴画出一个圆。\n\n- 长方形绕它的一条边旋转得到圆柱。\n- 直角三角形绕它的一条直角边旋转得到圆锥。\n- 半圆绕它的直径旋转得到球。\n- 直角梯形绕垂直于两底的腰旋转得到圆台。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [x, y] = [rng.int(2, 12), rng.int(2, 12)];
        const cases: readonly [Text, number][] = [
          [
            t(
              `A rectangle $${x}$ ${u} by $${y}$ ${u} is rotated about one of its sides.`,
              `一个 $${x}$ ${u} × $${y}$ ${u} 的长方形绕它的一条边旋转一周。`,
            ),
            0,
          ],
          [
            t(`A square with side $${x}$ ${u} is rotated about one of its sides.`, `一个边长 $${x}$ ${u} 的正方形绕它的一条边旋转一周。`),
            0,
          ],
          [
            t(
              `A right triangle with legs $${x}$ ${u} and $${y}$ ${u} is rotated about its $${x}$ ${u} leg.`,
              `一个两条直角边为 $${x}$ ${u} 和 $${y}$ ${u} 的直角三角形绕长 $${x}$ ${u} 的直角边旋转一周。`,
            ),
            1,
          ],
          [
            t(
              `An isosceles triangle with base $${2 * x}$ ${u} is rotated about its line of symmetry.`,
              `一个底边为 $${2 * x}$ ${u} 的等腰三角形绕它的对称轴旋转一周。`,
            ),
            1,
          ],
          [t(`A semicircle of radius $${x}$ ${u} is rotated about its diameter.`, `一个半径为 $${x}$ ${u} 的半圆绕它的直径旋转一周。`), 2],
          [
            t(
              `A circle of radius $${x}$ ${u} is rotated about one of its diameters.`,
              `一个半径为 $${x}$ ${u} 的圆绕它的一条直径旋转一周。`,
            ),
            2,
          ],
          [
            t(
              `A right trapezoid with parallel sides $${x}$ ${u} and $${x + y}$ ${u} is rotated about the side perpendicular to them.`,
              `一个两底分别为 $${x}$ ${u} 和 $${x + y}$ ${u} 的直角梯形绕垂直于两底的腰旋转一周。`,
            ),
            3,
          ],
          [
            t(
              `A rectangle $${x}$ ${u} by $${y}$ ${u} is rotated about the line joining the midpoints of two opposite sides.`,
              `一个 $${x}$ ${u} × $${y}$ ${u} 的长方形绕连接一组对边中点的直线旋转一周。`,
            ),
            0,
          ],
        ];
        const [desc, answer] = rng.pick(cases);
        return choiceProblem({
          prompt: t(`${desc.en} What solid does it sweep out?`, `${desc["zh-CN"]}它形成什么立体图形？`),
          options: revolutionSolids,
          correct: answer,
          solution: [
            t(
              "Each point traces a circle, and the side opposite the axis sweeps a curved surface at a constant distance: a cylinder.",
              "每一点都画出一个圆，与轴平行的对边在固定距离处扫出曲面：得到圆柱。",
            ),
            t(
              "The side on the axis becomes the height, the other side through the axis becomes a radius of the base, and the slanted side sweeps the curved surface of a cone.",
              "轴上的边成为高，另一条过轴的边成为底面半径，斜边扫出圆锥的侧面：得到圆锥。",
            ),
            t("Every point of the curve stays at the same distance from the center: a sphere.", "曲线上每一点到圆心的距离都不变：得到球。"),
            t(
              "The two parallel sides become circles of different radii, and the slanted side sweeps the curved surface of a frustum of a cone.",
              "两条平行的边成为半径不同的两个圆，斜腰扫出圆台的侧面：得到圆台。",
            ),
          ][answer]!,
        });
      },
    },
    {
      id: "rotating-rectangles",
      title: t("Rotating rectangles", "旋转长方形"),
      explanation: t(
        "When a rectangle is rotated about one of its sides, that side becomes the height of the cylinder and the adjacent side becomes its radius.\n\nThe rectangle with vertices $(0, 0)$, $(5, 0)$, $(5, 2)$ and $(0, 2)$ rotated about the $x$-axis makes a cylinder with height $5$ and radius $2$, so $V = \\pi \\cdot 2^2 \\cdot 5 = 20\\pi$. Rotated about the $y$-axis it makes a cylinder with height $2$ and radius $5$: $V = 50\\pi$.",
        "长方形绕它的一条边旋转时，这条边成为圆柱的高，相邻的边成为底面半径。\n\n顶点为 $(0, 0)$、$(5, 0)$、$(5, 2)$、$(0, 2)$ 的长方形绕 $x$ 轴旋转，得到高 $5$、半径 $2$ 的圆柱，所以 $V = \\pi \\cdot 2^2 \\cdot 5 = 20\\pi$。绕 $y$ 轴旋转则得到高 $2$、半径 $5$ 的圆柱：$V = 50\\pi$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.int(1, 10), rng.int(1, 10)];
        } while (a === b);
        const aboutX = rng.bool();
        const [r, h] = aboutX ? [b, a] : [a, b];
        return piProblem({
          prompt: t(
            `The rectangle with vertices $(0, 0)$, $(${a}, 0)$, $(${a}, ${b})$ and $(0, ${b})$ is rotated about the $${aboutX ? "x" : "y"}$-axis. Find the volume of the solid it sweeps out. ${inPi.en}`,
            `顶点为 $(0, 0)$、$(${a}, 0)$、$(${a}, ${b})$、$(0, ${b})$ 的长方形绕 $${aboutX ? "x" : "y"}$ 轴旋转一周。求所得立体图形的体积。${inPi["zh-CN"]}`,
          ),
          coef: r * r * h,
          wrong: [h * h * r, a * b, 2 * a * b, Q.of(r * r * h, 3)],
          solution: t(
            `The side on the $${aboutX ? "x" : "y"}$-axis becomes the height $h = ${h}$, and the other side the radius $r = ${r}$:${steps(`V = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}`,
            `在 $${aboutX ? "x" : "y"}$ 轴上的边成为高 $h = ${h}$，另一条边成为半径 $r = ${r}$：${steps(`V = \\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(r * r * h)}`)}`,
          ),
        });
      },
    },
    {
      id: "rotating-right-triangles",
      title: t("Rotating right triangles", "旋转直角三角形"),
      explanation: t(
        "When a right triangle is rotated about one of its legs, that leg becomes the height of the cone and the other leg its radius.\n\nThe triangle with vertices $(0, 0)$, $(6, 0)$ and $(0, 3)$ rotated about the $x$-axis makes a cone with height $6$ and radius $3$: $V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 6 = 18\\pi$. Rotated about the $y$-axis it makes a cone with height $3$ and radius $6$: $V = 36\\pi$.",
        "直角三角形绕它的一条直角边旋转时，这条直角边成为圆锥的高，另一条直角边成为底面半径。\n\n顶点为 $(0, 0)$、$(6, 0)$、$(0, 3)$ 的三角形绕 $x$ 轴旋转，得到高 $6$、半径 $3$ 的圆锥：$V = \\frac{1}{3}\\pi \\cdot 9 \\cdot 6 = 18\\pi$。绕 $y$ 轴旋转则得到高 $3$、半径 $6$ 的圆锥：$V = 36\\pi$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.int(1, 10), rng.int(1, 10)];
        } while (a === b);
        const aboutX = rng.bool();
        const [r, h] = aboutX ? [b, a] : [a, b];
        const v = Q.of(r * r * h, 3);
        return piProblem({
          prompt: t(
            `The triangle with vertices $(0, 0)$, $(${a}, 0)$ and $(0, ${b})$ is rotated about the $${aboutX ? "x" : "y"}$-axis. Find the volume of the solid it sweeps out. ${inPi.en}`,
            `顶点为 $(0, 0)$、$(${a}, 0)$、$(0, ${b})$ 的三角形绕 $${aboutX ? "x" : "y"}$ 轴旋转一周。求所得立体图形的体积。${inPi["zh-CN"]}`,
          ),
          coef: v,
          wrong: [Q.of(h * h * r, 3), r * r * h, Q.of(a * b, 2), Q.of(r * r * h, 2)],
          solution: t(
            `It sweeps out a cone. The leg on the $${aboutX ? "x" : "y"}$-axis is the height $h = ${h}$, and the other leg the radius $r = ${r}$:${steps(`V = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}`,
            `它形成一个圆锥。在 $${aboutX ? "x" : "y"}$ 轴上的直角边是高 $h = ${h}$，另一条直角边是半径 $r = ${r}$：${steps(`V = \\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${h} = ${piTex(v)}`)}`,
          ),
        });
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
