// Further drawings in the explanations of the elementary courses: number lines, graphs, bar models, shapes, areas, clocks and angles.

import type { Figure } from "@ga/content";
import type { Compass, Mark, Point } from "@ga/subject-math";

import { ln, pt, rect, shift } from "./explanation-drawings-geometry-2.ts";
import {
  angle,
  boxMarks,
  coneMarks,
  cylinderMarks,
  drawing,
  graphed,
  name,
  note,
  on,
  ring,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";

/** fill shades a rectangle. */
export const fill = (x: number, y: number, w: number, h: number, tone: Tone = "result"): Mark => ({
  kind: "shade",
  points: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
  tone,
});

/** side labels the segment from a to b on its right-hand side. */
export const side = (a: Point, b: Point, text: string): Mark => ({ kind: "side", a, b, text });
/** poly is a closed outline through the points. */
export const poly = (...points: Point[]): Mark => ({ kind: "polygon", points });
/** text is a short note at a place, above it by default. */
export const text = (at: Point, s: string, dir: Compass = "n"): Mark => note(at, s, dir);

/** line draws a number line with a tick at each step, one unit apart; label says what each value shows. */
export function line(lo: number, hi: number, step: number, label: (v: number) => string | undefined, y = 0): Mark[] {
  const at = (v: number) => (v - lo) / step;
  const count = Math.round((hi - lo) / step);
  const marks: Mark[] = [seg([-0.5, y], [count + 0.5, y])];
  for (let i = 0; i <= count; i += 1) {
    const v = lo + i * step;
    marks.push(seg([at(v), y - 0.12], [at(v), y + 0.12]));
    const s = label(v);
    if (s) marks.push(note([at(v), y - 0.12], s, "s"));
  }
  return marks;
}

/** spot marks a place of a line with a dot, in units of ticks. */
export const spot = (x: number, tone: Tone = "result", y = 0): Mark => ({ kind: "dot", at: [x, y], tone });

/** hop draws a jump between two places of a line as a low curve, with its size above when given. */
export function hop(a: number, b: number, s?: string, y = 0, tone: "accent" | Tone = "action"): Mark[] {
  const rx = Math.abs(b - a) / 2;
  const c = (a + b) / 2;
  const ry = Math.min(1.1, 0.25 + rx * 0.4);
  const pts = Array.from({ length: 19 }, (_, i): Point => [c + rx * Math.cos((Math.PI * i) / 18), y + ry * Math.sin((Math.PI * i) / 18)]);
  return [...pts.slice(1).map((p, i) => seg(pts[i] as Point, p, tone)), ...(s ? [note([c, y + ry], s, "n")] : [])];
}

/** hops draws one hop for each step from a to b. */
const hops = (a: number, b: number, tone: "accent" | Tone = "action"): Mark[] => {
  const dir = b > a ? 1 : -1;
  return Array.from({ length: Math.abs(b - a) }, (_, i) => hop(a + i * dir, a + (i + 1) * dir, undefined, 0, tone)).flat();
};

/** dotRows draws a picture graph: one row of dots for each label. */
function dotRows(rows: readonly (readonly [string, number])[], tones: Readonly<Record<number, Tone>> = {}): Mark[] {
  return rows.flatMap(([label, n], i) => [
    text([0, -i * 0.9], label, "w"),
    ...Array.from({ length: n }, (_, j): Mark => ({ kind: "dot", at: [0.7 + j * 0.8, -i * 0.9], ...(tones[i] && { tone: tones[i] }) })),
  ]);
}

/** bars draws a bar graph with a scale at the side. */
function bars(rows: readonly (readonly [string, number])[], step: number, top: number, tones: Readonly<Record<number, Tone>> = {}): Mark[] {
  const h = (v: number) => (v / step) * 0.7;
  const marks: Mark[] = [seg([0, 0], [0, h(top) + 0.2]), seg([0, 0], [rows.length * 1.6 + 0.2, 0])];
  for (let v = 0; v <= top; v += step) {
    marks.push(seg([-0.08, h(v)], [rows.length * 1.6 + 0.2, h(v)], undefined, true), text([0, h(v)], String(v), "w"));
  }
  rows.forEach(([label, value], i) => {
    const x = 0.4 + i * 1.6;
    marks.push(fill(x, 0, 1, h(value), tones[i] ?? "result"), rect(x, 0, 1, h(value)), text([x + 0.5, 0], label, "s"));
  });
  return marks;
}

/** linePlot draws a number line with stacked marks above it. */
function linePlot(lo: number, counts: readonly number[], unit = ""): Mark[] {
  return [
    ...line(lo, lo + counts.length - 1, 1, (v) => `${v}${unit}`),
    ...counts.flatMap((c, i) => Array.from({ length: c }, (_, j): Mark => ({ kind: "dot", at: [i, 0.4 + j * 0.45] }))),
  ];
}

/** regular is a regular polygon with n sides, with a flat bottom. */
export const regular = (n: number, r = 1, c: Point = [0, 0]): Point[] =>
  Array.from({ length: n }, (_, i) => on(-90 - 180 / n + (i * 360) / n, r, c));

/** gridRect draws a rectangle cut into unit squares. */
export function gridRect(cols: number, rows: number, x = 0, y = 0): Mark[] {
  const marks: Mark[] = [rect(x, y, cols, rows)];
  for (let i = 1; i < cols; i += 1) marks.push(seg([x + i, y], [x + i, y + rows]));
  for (let j = 1; j < rows; j += 1) marks.push(seg([x, y + j], [x + cols, y + j]));
  return marks;
}

/** barModel draws a whole over its parts, with widths in proportion to values and the given texts. */
function barModel(whole: string, parts: readonly (readonly [number, string])[]): Mark[] {
  const total = parts.reduce((s, [v]) => s + v, 0);
  const scale = 10 / total;
  const marks: Mark[] = [rect(0, 1, 10, 1), text([5, 1.25], whole)];
  let x = 0;
  for (const [v, s] of parts) {
    marks.push(rect(x, 0, v * scale, 1), text([x + (v * scale) / 2, 0.25], s));
    x += v * scale;
  }
  return marks;
}

/** factTriangle draws a fact triangle with the whole or product at the top. */
const factTriangle = (top: string, left: string, right: string): Mark[] => [
  poly([0, 0], [6, 0], [3, 5]),
  text([3, 3.6], top),
  text([1.2, 0.3], left),
  text([4.8, 0.3], right),
];

/** clock draws a clock face with hands pointing at the given time, numbering the hours that are multiples of numberEvery. */
export function clock(hour: number, minute: number, numberEvery = 1): Mark[] {
  const minuteAt = 90 - minute * 6;
  const hourAt = 90 - (hour % 12) * 30 - minute / 2;
  const marks: Mark[] = [ring(3)];
  for (let h = 1; h <= 12; h += 1) {
    const d = 90 - h * 30;
    marks.push(seg(on(d, 2.8), on(d, 3)));
    if (h % numberEvery === 0) marks.push({ kind: "label", at: on(d, 2.35), text: String(h), dir: "n" });
  }
  marks.push(seg([0, 0], on(minuteAt, 2.4), "accent"), seg([0, 0], on(hourAt, 1.6), "action"), { kind: "dot", at: [0, 0] });
  return marks;
}

/** corner draws an angle at the origin from degrees a to degrees b, with a label. */
export const corner = (a: number, b: number, label?: string, r = 3): Mark[] => {
  const from = on(a, r);
  const to = on(b, r);
  return [seg([0, 0], from), seg([0, 0], to), angle([0, 0], from, to, "accent", label)];
};

/** fractionLine draws 0 to the whole cut into parts, labeling whole numbers. */
const fractionLine = (whole: number, parts: number, y = 0, extra: Readonly<Record<number, string>> = {}): Mark[] =>
  line(
    0,
    whole,
    1 / parts,
    (v) => {
      const n = Math.round(v * parts);
      return extra[n] ?? (n % parts === 0 ? String(n / parts) : undefined);
    },
    y,
  );

/** areaModel draws a rectangle with one side and the other side split into parts, each with its area inside. */
function areaModel(sideText: string, parts: readonly (readonly [number, string, string])[]): Mark[] {
  const marks: Mark[] = [];
  let x = 0;
  for (const [w, top, area] of parts) {
    marks.push(rect(x, 0, w, 3), text([x + w / 2, 3], top), text([x + w / 2, 1.2], area));
    x += w;
  }
  marks.push(text([0, 1.5], sideText, "w"));
  return marks;
}

const halfCircle = (c: Point, r = 0.3): Mark => ({
  kind: "polygon",
  points: Array.from({ length: 19 }, (_, i) => on(90 + i * 10, r, c)),
});

/** symbolRows draws a picture graph of whole and half circles; each row is a label and a number of circles. */
function symbolRows(rows: readonly (readonly [string, number])[]): Mark[] {
  return rows.flatMap(([label, n], i) => {
    const y = -i * 0.9;
    const whole = Math.floor(n);
    return [
      text([0, y], label, "w"),
      ...Array.from({ length: whole }, (_, j): Mark => ring(0.3, [0.7 + j * 0.8, y])),
      ...(n > whole ? [halfCircle([0.7 + whole * 0.8, y])] : []),
    ];
  });
}

const quadRow: readonly Mark[][] = [
  [poly([0, 0], [2.4, 0], [2.4, 2.4], [0, 2.4])],
  [poly([0, 0], [3.4, 0], [3.4, 1.8], [0, 1.8])],
  [poly([1.2, 0], [2.4, 1.3], [1.2, 2.6], [0, 1.3])],
  [poly([0, 0], [3, 0], [3.8, 1.8], [0.8, 1.8])],
];

const quadFamily = (zh: readonly number[]): Mark[] => {
  let x = 0;
  const out: Mark[] = [];
  for (const i of zh) {
    out.push(...shift(quadRow[i]!, x));
    x += 5.2;
  }
  return out;
};

/** polygonRow draws regular polygons side by side with their numbers of sides. */
function polygonRow(ns: readonly number[]): Mark[] {
  return ns.flatMap((n, i) => [poly(...regular(n, 1.1, [i * 3, 0])), text([i * 3, -1.15], String(n), "s")]);
}

const diagonalFan = (n: number): Mark[] => {
  const p = regular(n, 3);
  return [poly(...p), ...p.slice(2, n - 1).map((q) => seg(p[0]!, q, "action")), { kind: "dot", at: p[0]! }];
};

const squareCorners = (a: number): Mark[] => [
  rect(0, 0, a, a),
  square([0, 0], [a, 0], [0, a]),
  square([a, 0], [a, a], [0, 0]),
  square([a, a], [0, a], [a, 0]),
  square([0, a], [0, 0], [a, a]),
];

const lRoom: Point[] = [
  [0, 0],
  [8, 0],
  [8, 3],
  [3, 3],
  [3, 6],
  [0, 6],
];

/** gradeDrawings2 are further explanation drawings of the elementary courses, by topic and knowledge point. */
export const gradeDrawings2: Readonly<Record<string, Figure>> = {
  "counting-on-to-add#counting-on-along-a-number-line": drawing(
    [...line(0, 10, 1, String), spot(4, "action"), spot(7), ...hops(4, 7)],
    "A number line from 0 to 10 with three hops to the right from 4, landing on 7.",
    "从 0 到 10 的数轴，从 4 向右跳三次，落在 7。",
  ),
  "counting-back-to-subtract#counting-back-along-a-number-line": drawing(
    [...line(0, 10, 1, String), spot(8, "action"), spot(5), ...hops(8, 5)],
    "A number line from 0 to 10 with three hops to the left from 8, landing on 5.",
    "从 0 到 10 的数轴，从 8 向左跳三次，落在 5。",
  ),
  "first-picture-graphs#reading-a-first-picture-graph": drawing(
    dotRows(
      [
        ["A", 5],
        ["B", 3],
        ["C", 6],
      ],
      { 0: "result" },
    ),
    "A picture graph with a row of dots for each group: 5 apples, 3 pears and 6 plums.",
    "每组一行点的象形图：苹果 5，梨 3，李子 6。",
  ),
  "first-picture-graphs#comparing-on-a-picture-graph": drawing(
    [
      ...dotRows([
        ["A", 7],
        ["B", 4],
      ]),
      {
        kind: "polygon",
        points: [
          [3.8, -1.2],
          [6.0, -1.2],
          [6.0, 0.3],
          [3.8, 0.3],
        ],
        tone: "action",
      },
    ],
    "Rows of 7 and 4 dots lined up: the 3 dots with no partner show how many more.",
    "7 个点和 4 个点对齐：没有配对的 3 个点就是多出来的数目。",
  ),
  "first-picture-graphs#votes-in-all-on-a-picture-graph": drawing(
    [
      ...dotRows([
        ["A", 4],
        ["B", 6],
        ["C", 3],
      ]),
      text([3, -2.6], "4 + 6 + 3 = 13", "s"),
    ],
    "Three rows of 4, 6 and 3 votes: 13 votes in all.",
    "三行投票 4、6、3：一共 13 票。",
  ),
  "first-bar-graphs#reading-a-first-bar-graph": drawing(
    bars(
      [
        ["A", 6],
        ["B", 3],
        ["C", 8],
      ],
      2,
      10,
    ),
    "A bar graph with bars of height 6, 3 and 8 read against the numbers at the side.",
    "高度为 6、3、8 的条形图，对照旁边的数字来读。",
  ),
  "first-bar-graphs#comparing-on-a-bar-graph": drawing(
    bars(
      [
        ["A", 8],
        ["B", 5],
      ],
      1,
      9,
      { 1: "action" },
    ),
    "Bars of 8 and 5: the gap between their tops is 3.",
    "8 和 5 两个条形：顶端相差 3。",
  ),
  "first-bar-graphs#how-many-more-on-a-bar-graph": drawing(
    bars(
      [
        ["A", 4],
        ["B", 9],
      ],
      1,
      10,
      { 0: "action" },
    ),
    "Bars of 4 and 9: subtracting gives 5 more.",
    "4 和 9 两个条形：相减得多 5。",
  ),
  "defining-attributes-of-shapes#what-makes-a-shape-that-shape": drawing(
    [
      poly([0, 0], [3, 0], [1.5, 2.6]),
      ...shift([poly([0, 0], [1.5, 0.8], [0.2, 1.8])], 4.2),
      ...shift([poly([0, 0], [4, 0], [3.6, 1.2])], 6.6),
    ],
    "Three triangles of different sizes, turned different ways: each has 3 straight sides.",
    "三个大小、方向都不同的三角形：每个都有 3 条直边。",
  ),
  "composing-shapes#pieces-to-finish-a-shape": drawing(
    [...gridRect(4, 3), fill(0, 0, 2, 3), fill(2, 0, 2, 1)],
    "A rectangle being covered with 12 square tiles: 8 are in place, so 4 empty spaces need one tile each.",
    "正在铺 12 块方砖的长方形：已铺 8 块，还有 4 个空位各需要一块。",
  ),
  "composing-shapes#how-many-pieces-for-several-shapes": drawing(
    [0, 3.2, 6.4].flatMap((x) => [rect(x, 0, 2.6, 2.6), seg([x, 0], [x + 2.6, 2.6])]),
    "Three squares, each cut into two triangles: six triangles in all.",
    "三个正方形，每个切成两个三角形：一共六个三角形。",
  ),
  "number-lines-to-120#reading-a-line-marked-by-ones": drawing(
    [...line(50, 60, 1, (v) => (v === 50 || v === 60 ? String(v) : undefined)), spot(7), text([7, 0.1], "57")],
    "A number line with only 50 and 60 written: the point is 7 spaces from 50, at 57.",
    "只标出 50 和 60 的数轴：这个点距 50 有 7 格，在 57。",
  ),
  "number-lines-to-120#reading-a-line-marked-by-tens": drawing(
    [...line(0, 100, 10, String), spot(7), text([7, 0.1], "70")],
    "A number line whose spaces are each worth 10: the point is at 70.",
    "每格为 10 的数轴：这个点在 70。",
  ),
  "number-lines-to-120#which-number-lies-between": drawing(
    [
      ...line(40, 50, 1, (v) => (v === 40 || v === 50 ? String(v) : undefined)),
      spot(0, "action"),
      spot(10, "action"),
      spot(6),
      text([6, 0.1], "46"),
    ],
    "46 lies between 40 and 50: it is to the right of 40 and to the left of 50.",
    "46 在 40 和 50 之间：它在 40 的右边、50 的左边。",
  ),
  "fact-triangles#the-missing-number-of-a-triangle": drawing(
    factTriangle("?", "5", "8"),
    "A fact triangle with parts 5 and 8 at the bottom corners and the whole missing at the top.",
    "数字三角形：底角是部分 5 和 8，顶上的整体未知。",
  ),
  "fact-triangles#facts-from-a-triangle": drawing(
    [
      ...factTriangle("13", "5", "8"),
      text([10, 3.2], "5 + 8 = 13"),
      text([10, 2.2], "8 + 5 = 13"),
      text([10, 1.2], "13 − 5 = 8"),
      text([10, 0.2], "13 − 8 = 5"),
    ],
    "A fact triangle with whole 13 and parts 5 and 8, and its two additions and two subtractions.",
    "整体 13、部分 5 和 8 的数字三角形，以及两个加法和两个减法算式。",
  ),
  "part-and-whole-bar-models#the-whole-from-its-parts": drawing(
    barModel("?", [
      [6, "6"],
      [9, "9"],
    ]),
    "A bar model: the long bar on top has the question mark, and the bar below is cut into parts 6 and 9.",
    "线段图：上面的长条是问号，下面同样长的条分成 6 和 9 两段。",
  ),
  "how-many-in-all-on-a-graph#two-rows-of-a-picture-graph": drawing(
    dotRows(
      [
        ["A", 4],
        ["B", 6],
        ["C", 3],
      ],
      { 0: "result", 1: "result" },
    ),
    "A picture graph with the rows of 4 and 6 dots picked out: those two rows together have 10.",
    "象形图中标出 4 个点和 6 个点的两行：这两行合起来是 10。",
  ),
  "how-many-in-all-on-a-graph#how-many-more-than-the-other-two": drawing(
    bars(
      [
        ["A", 9],
        ["B", 2],
        ["C", 4],
      ],
      1,
      10,
      { 1: "action", 2: "action" },
    ),
    "A bar graph with bars of 9, 2 and 4: the other two together make 6, and 9 is 3 more.",
    "高为 9、2、4 的条形图：另外两个合起来是 6，9 比它多 3。",
  ),
  "naming-solid-shapes#the-name-of-a-solid": drawing(
    [
      ...boxMarks(3, 2, 2).marks,
      ...shift(boxMarks(2, 2, 2).marks, 5),
      ...shift(cylinderMarks(1.2, 2.6), 10),
      ...shift(coneMarks(1.2, 2.6), 13.4),
      ...shift([ring(1.3), ...[0].map(() => seg([-1.3, 0], [1.3, 0], undefined, true))], 16.8),
    ],
    "A rectangular prism, a cube, a cylinder, a cone and a sphere.",
    "长方体、立方体、圆柱、圆锥和球。",
  ),
  "naming-solid-shapes#what-a-solid-can-do": drawing(
    [
      ...shift([ring(1.3), seg([-1.3, 0], [1.3, 0], undefined, true)], 0),
      ...shift(cylinderMarks(1.2, 2.6), 3.6),
      ...shift(coneMarks(1.2, 2.6), 7),
      ...shift(boxMarks(2, 2, 2).marks, 9.6),
    ],
    "A sphere, which rolls in every direction; a cylinder and a cone, which have flat circles; and a cube, which stacks.",
    "球向各方向滚动；圆柱和圆锥有圆形平面；立方体可以堆叠。",
  ),
  "skip-counting-by-2s-5s-and-10s#a-missing-point-on-a-skip-count": drawing(
    [...line(0, 30, 5, (v) => (v === 25 ? "?" : String(v))), spot(5), ...hops(0, 5)],
    "A number line that counts by fives: five jumps from 0 land on the marked point, 25.",
    "按 5 跳数的数轴：从 0 跳五次，落在标记点 25。",
  ),
  "sums-and-differences-on-a-number-line#jumping-right-to-add": drawing(
    [...line(20, 40, 1, (v) => (v % 5 === 0 ? String(v) : undefined)), spot(4, "action"), spot(16), ...hop(4, 16, "+12")],
    "On a number line, 24 + 12: begin at 24 and move right by 12 to land on 36.",
    "数轴上的 24 + 12：从 24 开始向右移 12，落在 36。",
  ),
  "sums-and-differences-on-a-number-line#jumping-left-to-subtract": drawing(
    [...line(20, 40, 1, (v) => (v % 5 === 0 ? String(v) : undefined)), spot(16, "action"), spot(7), ...hop(16, 7, "−9")],
    "On a number line, 36 − 9: begin at 36 and move left by 9 to land on 27.",
    "数轴上的 36 − 9：从 36 开始向左移 9，落在 27。",
  ),
  "sums-and-differences-on-a-number-line#the-size-of-the-jump": drawing(
    [...line(20, 40, 1, (v) => (v % 5 === 0 ? String(v) : undefined)), spot(3, "action"), spot(15), ...hop(3, 15, "12")],
    "Two points at 23 and 35: the jump between them is 35 − 23 = 12.",
    "位于 23 和 35 的两点：它们之间的距离是 35 − 23 = 12。",
  ),
  "line-plots-of-lengths#reading-marks-on-a-line-plot": drawing(
    linePlot(4, [1, 3, 2, 4, 1]),
    "A line plot of lengths from 4 to 8, with 1, 3, 2, 4 and 1 marks stacked above them.",
    "长度从 4 到 8 的线图，上方分别堆叠 1、3、2、4、1 个记号。",
  ),
  "picture-graphs-of-single-units#how-many-more-in-a-row": drawing(
    dotRows([
      ["A", 8],
      ["B", 5],
    ]),
    "Rows of 8 and 5 pictures: the pictures that line up cancel, leaving 3 more.",
    "8 个和 5 个图案的两行：对齐的相互抵消，多 3 个。",
  ),
  "picture-graphs-of-single-units#adding-rows-of-a-picture-graph": drawing(
    [
      ...dotRows([
        ["A", 5],
        ["B", 7],
        ["C", 4],
      ]),
      text([3, -2.6], "5 + 7 + 4 = 16", "s"),
    ],
    "Three rows of 5, 7 and 4 pictures: 16 together.",
    "5、7、4 个图案的三行：合起来是 16。",
  ),
  "picture-graphs-of-single-units#the-missing-row": drawing(
    [
      ...dotRows([
        ["A", 5],
        ["B", 3],
      ]),
      text([0, -1.8], "C", "w"),
      text([0.7, -1.8], "? = 15 − 5 − 3 = 7", "e"),
    ],
    "A graph with total 15 and visible rows of 5 and 3: the hidden row has 7.",
    "总数为 15 的图，看得见的两行是 5 和 3：隐藏的一行是 7。",
  ),
  "reading-bar-graphs#the-value-of-a-bar-by-ones": drawing(
    bars(
      [
        ["W", 7],
        ["X", 4],
        ["Y", 9],
      ],
      1,
      10,
    ),
    "A bar graph with a scale by ones and bars of 7, 4 and 9.",
    "刻度为一的条形图，条形为 7、4、9。",
  ),
  "naming-polygons-by-their-sides#the-name-of-a-drawn-shape": drawing(
    polygonRow([3, 4, 5, 6]),
    "A triangle with 3 sides, a quadrilateral with 4, a pentagon with 5 and a hexagon with 6.",
    "3 条边的三角形、4 条边的四边形、5 条边的五边形和 6 条边的六边形。",
  ),
  "naming-polygons-by-their-sides#the-name-from-the-number-of-sides": drawing(
    [poly(...regular(5, 3)), ...regular(5, 3).map((p, i): Mark => ({ kind: "label", at: p, text: String(i + 1), dir: i < 2 ? "s" : "n" }))],
    "A pentagon with its 5 corners numbered: 5 sides and 5 angles.",
    "角编号的五边形：5 条边、5 个角。",
  ),
  "naming-polygons-by-their-sides#sides-from-the-name": drawing(
    polygonRow([3, 4, 5, 6, 8]),
    "Polygons with 3, 4, 5, 6 and 8 sides: triangle, quadrilateral, pentagon, hexagon and octagon.",
    "3、4、5、6、8 条边的多边形：三角形、四边形、五边形、六边形和八边形。",
  ),
  "counting-sides-and-angles#angles-of-a-drawn-shape": drawing(
    (() => {
      const p = regular(6, 3);
      return [poly(...p), ...p.map((q, i) => angle(q, p[(i + 1) % 6]!, p[(i + 5) % 6]!, i === 0 ? "action" : "accent"))];
    })(),
    "A hexagon with its 6 angles marked, going around from one corner.",
    "标出 6 个角的六边形，从一个角开始绕一圈。",
  ),
  "counting-sides-and-angles#sides-of-several-shapes": drawing(
    polygonRow([3, 4, 5]),
    "A triangle, a quadrilateral and a pentagon: 3 + 4 + 5 = 12 sides in all.",
    "三角形、四边形和五边形：一共 3 + 4 + 5 = 12 条边。",
  ),
  "counting-sides-and-angles#angles-match-sides": drawing(
    (() => {
      const p = regular(5, 3);
      return [poly(...p), ...p.map((q, i) => angle(q, p[(i + 1) % 5]!, p[(i + 4) % 5]!, "accent"))];
    })(),
    "A pentagon: each of its 5 corners joins two sides, so it has 5 angles and 5 sides.",
    "五边形：5 个角中的每一个都连接两条边，所以有 5 个角和 5 条边。",
  ),
  "rows-and-columns-of-squares#counting-squares-in-a-rectangle": drawing(
    [...gridRect(5, 3), fill(0, 2, 5, 1), text([2.5, 0], "3 × 5", "s")],
    "A rectangle cut into 3 rows of 5 squares, 15 in all, with one row picked out.",
    "分成 3 行、每行 5 个方格的长方形，一共 15 个，标出其中一行。",
  ),
  "rows-and-columns-of-squares#the-missing-rows-from-the-total": drawing(
    [...gridRect(6, 4), ...[1, 2, 3, 4].map((r) => text([6, 4 - r + 0.3], String(r * 6), "e"))],
    "A rectangle with 6 squares in each row: counting 6, 12, 18, 24 takes 4 rows to reach 24.",
    "每行 6 个方格的长方形：数 6、12、18、24，用 4 行达到 24。",
  ),
  "adding-on-an-open-number-line#the-missing-jump": drawing(
    [seg([-0.5, 0], [8.5, 0]), spot(0, "action"), spot(8), text([0, -0.1], "47", "s"), text([8, -0.1], "67", "s"), ...hop(0, 8, "20")],
    "An open number line with a jump from 47 to 67, of size 20.",
    "空数轴上从 47 到 67 的一跳，大小为 20。",
  ),
  "stories-with-bar-models#a-part-in-a-bar": drawing(
    barModel("42", [
      [15, "15"],
      [27, "?"],
    ]),
    "A bar model with whole 42, one part 15 and the other part missing: subtract the part from the whole.",
    "整体 42、一部分 15、另一部分未知的线段图：用整体减去部分。",
  ),
  "two-step-stories-with-bar-models#a-whole-with-three-parts": drawing(
    barModel("?", [
      [18, "18"],
      [12, "12"],
      [25, "25"],
    ]),
    "A bar cut into three parts, 18, 12 and 25, with the whole missing.",
    "分成 18、12、25 三段的长条，整体未知。",
  ),
  "making-line-plots#dots-from-a-list": drawing(
    linePlot(4, [1, 2, 3, 1]),
    "A line plot from the list 4, 5, 5, 6, 6, 6, 7: the length 6 shows up three times, so it has three dots.",
    "由 4、5、5、6、6、6、7 画成的线图：6 出现三次，所以有三个点。",
  ),
  "graphs-from-tables#how-tall-should-the-bar-be": drawing(
    [
      ...bars(
        [
          ["A", 3],
          ["B", 7],
          ["C", 5],
        ],
        1,
        8,
      ),
      text([7, 2.6], "A  B  C", "e"),
      text([7, 1.8], "3  7  5", "e"),
    ],
    "A table with A 3, B 7 and C 5 beside the bar graph it makes: each number tells how tall to draw one bar.",
    "表格 A 3、B 7、C 5 和它画出的条形图：每个数说明一个条形画多高。",
  ),
  "graphs-from-tables#filling-a-table-from-a-graph": drawing(
    bars(
      [
        ["A", 6],
        ["B", 3],
        ["C", 7],
      ],
      2,
      8,
    ),
    "A bar graph with a scale by twos: the bars read 6, 3 and 7, and the bars for 3 and 7 stop between labeled marks.",
    "刻度为二的条形图：读数为 6、3、7，其中 3 和 7 的条形顶端在两条标记线之间。",
  ),
  "equal-shares-can-look-different#which-rectangle-is-cut-fairly": drawing(
    [
      rect(0, 0, 4, 2.4),
      seg([2, 0], [2, 2.4]),
      fill(0, 0, 2, 2.4),
      text([2, 0], "✓", "s"),
      ...shift([rect(0, 0, 4, 2.4), seg([1, 0], [1, 2.4]), fill(0, 0, 1, 2.4, "action"), text([2, 0], "✗", "s")], 5.5),
    ],
    "A rectangle cut into two equal halves, and one cut into two pieces of different sizes, which are not halves.",
    "切成相等两半的长方形，以及切成大小不同两块的长方形（不是一半）。",
  ),
  "equal-shares-can-look-different#same-size-different-shape": drawing(
    [
      rect(0, 0, 4, 2.4),
      seg([0, 1.2], [4, 1.2]),
      fill(0, 0, 4, 1.2),
      ...shift([rect(0, 0, 4, 2.4), seg([2, 0], [2, 2.4]), fill(0, 0, 2, 2.4)], 5),
      ...shift(
        [
          rect(0, 0, 4, 2.4),
          seg([0, 0], [4, 2.4]),
          {
            kind: "shade",
            points: [
              [0, 0],
              [4, 0],
              [4, 2.4],
            ],
            tone: "result",
          },
        ],
        10,
      ),
    ],
    "Half of a rectangle cut across, down the middle and from corner to corner: different shapes, the same area.",
    "横切、竖切和对角切得到的长方形的一半：形状不同，面积相同。",
  ),
  "shape-riddles#guess-the-shape": drawing(
    polygonRow([3, 4, 5, 6]),
    "Shapes with 3, 4, 5 and 6 sides, each with as many corners as sides.",
    "3、4、5、6 条边的图形，每个的角数都等于边数。",
  ),
  "division-as-making-groups#division-by-repeated-subtraction": drawing(
    [
      ...line(0, 12, 1, (v) => (v % 3 === 0 ? String(v) : undefined)),
      ...hop(12, 9, "−3"),
      ...hop(9, 6, "−3"),
      ...hop(6, 3, "−3"),
      ...hop(3, 0, "−3"),
    ],
    "A number line for 12 ÷ 3: four jumps of 3 back from 12 to 0, so the quotient is 4.",
    "12 ÷ 3 的数轴：从 12 向左每次跳 3，跳四次到 0，所以商是 4。",
  ),
  "fractions-on-the-number-line#counting-jumps-to-a-point": drawing(
    [...fractionLine(1, 4, 0, { 3: "3/4" }), spot(3), ...hops(0, 3)],
    "A line from 0 to 1 cut into 4 equal parts: three jumps of one fourth reach 3/4.",
    "从 0 到 1 分成 4 等份的数轴：跳三个四分之一到 3/4。",
  ),
  "fractions-on-the-number-line#the-fraction-of-spaces-between-whole-numbers": drawing(
    [...fractionLine(3, 3), ...hop(3, 6, "1")],
    "A line from 0 to 3 with 3 spaces in each unit: each space is one third, however long the line is.",
    "从 0 到 3 的数轴，每个单位有 3 格：无论线多长，每格都是三分之一。",
  ),
  "fractions-on-the-number-line#the-point-past-one": drawing(
    [...fractionLine(2, 4, 0, { 5: "5/4" }), spot(5)],
    "A line with 4 parts in each whole: the point 5 parts from 0 is 5/4, between 1 and 2.",
    "每个整体有 4 份的数轴：距 0 有 5 份的点是 5/4，在 1 和 2 之间。",
  ),
  "elapsed-time-in-minutes#minutes-between-two-times": drawing(
    [
      seg([-0.5, 0], [9.5, 0]),
      spot(0, "action"),
      spot(4, "action"),
      spot(9),
      text([0, -0.1], "2:40", "s"),
      text([4, -0.1], "3:00", "s"),
      text([9, -0.1], "3:25", "s"),
      ...hop(0, 4, "20 min"),
      ...hop(4, 9, "25 min"),
    ],
    "A time line from 2:40 to 3:25: a jump of 20 minutes to the hour and 25 more, 45 minutes in all.",
    "从 2:40 到 3:25 的时间线：跳 20 分钟到整点，再跳 25 分钟，一共 45 分钟。",
  ),
  "scaled-picture-graphs#reading-a-row": drawing(
    [
      ...dotRows(
        [
          ["A", 4],
          ["B", 6],
        ],
        { 0: "result" },
      ),
      text([0.7, -1.9], "● = 5", "e"),
    ],
    "A scaled picture graph whose key says each picture stands for 5: 4 pictures show 20.",
    "图例为每个图案代表 5 的象形图：4 个图案表示 20。",
  ),
  "scaled-picture-graphs#how-many-more-in-a-picture-graph": drawing(
    [
      ...dotRows([
        ["A", 7],
        ["B", 4],
      ]),
      text([0.7, -1.9], "● = 2", "e"),
    ],
    "Rows of 7 and 4 pictures with key 2: 3 more pictures, so 6 more items.",
    "7 个和 4 个图案，图例为 2：多 3 个图案，即多 6 个。",
  ),
  "scaled-bar-graphs#reading-a-bar": drawing(
    bars(
      [
        ["A", 25],
        ["B", 40],
        ["C", 15],
      ],
      5,
      45,
    ),
    "A bar graph with a scale by fives and bars of 25, 40 and 15.",
    "刻度为五的条形图，条形为 25、40、15。",
  ),
  "scaled-bar-graphs#total-and-difference-from-a-bar-graph": drawing(
    bars(
      [
        ["A", 30],
        ["B", 50],
      ],
      10,
      60,
      { 0: "action" },
    ),
    "Bars of 30 and 50 on a scale by tens: the difference is 20 and the total 80.",
    "刻度为十的条形 30 和 50：差为 20，和为 80。",
  ),
  "line-plots-of-measurements#counting-the-marks-above-a-length": drawing(
    linePlot(5, [2, 4, 1, 3]),
    "A line plot of lengths 5 to 8 with stacks of 2, 4, 1 and 3 marks.",
    "长度 5 到 8 的线图，分别堆叠 2、4、1、3 个记号。",
  ),
  "area-of-a-rectangle-by-multiplying#multiplying-the-side-lengths": drawing(
    [...gridRect(6, 4), side([0, 0], [6, 0], "6 m"), side([6, 0], [6, 4], "4 m")],
    "A rectangle 6 meters by 4 meters: 6 × 4 = 24 square meters.",
    "6 米 × 4 米的长方形：6 × 4 = 24 平方米。",
  ),
  "area-of-a-rectangle-by-multiplying#a-side-from-the-area": drawing(
    [rect(0, 0, 7, 4), text([3.5, 1.6], "28 cm²"), side([0, 0], [7, 0], "7 cm"), side([7, 0], [7, 4], "?")],
    "A rectangle with area 28 square centimeters and one side 7 centimeters: the other side is 28 ÷ 7 = 4.",
    "面积 28 平方厘米、一边 7 厘米的长方形：另一边是 28 ÷ 7 = 4。",
  ),
  "area-of-a-rectangle-by-multiplying#doubling-a-side-of-a-rectangle": drawing(
    [...gridRect(3, 2), ...shift([...gridRect(6, 2), fill(3, 0, 3, 2)], 5)],
    "A rectangle 3 by 2 and the rectangle with one side doubled, 6 by 2: the area doubles from 6 to 12.",
    "3 × 2 的长方形和一边加倍后的 6 × 2：面积从 6 加倍到 12。",
  ),
  "area-of-combined-rectangles#adding-two-rectangles": drawing(
    [
      poly(...lRoom),
      seg([3, 0], [3, 3], "action", true),
      fill(0, 0, 3, 6),
      fill(3, 0, 5, 3, "action"),
      side([0, 0], [8, 0], "8"),
      side([8, 0], [8, 3], "3"),
      side([3, 6], [0, 6], "3"),
      side([0, 6], [0, 0], "6"),
    ],
    "An L-shaped room split into a 3 by 6 rectangle and a 5 by 3 rectangle: 18 + 15 = 33.",
    "L 形房间分成 3 × 6 和 5 × 3 两个长方形：18 + 15 = 33。",
  ),
  "area-of-combined-rectangles#the-area-left-after-a-cut-out": drawing(
    [
      rect(0, 0, 8, 6),
      {
        kind: "shade",
        points: [
          [0, 0],
          [8, 0],
          [8, 6],
          [0, 6],
        ],
        holes: [
          [
            [3, 2],
            [6, 2],
            [6, 4],
            [3, 4],
          ],
        ],
        tone: "result",
      },
      rect(3, 2, 3, 2),
      text([4.5, 2.4], "3 × 2"),
      side([0, 0], [8, 0], "8"),
      side([8, 0], [8, 6], "6"),
    ],
    "A rectangle 8 by 6 with a 3 by 2 piece missing: 48 − 6 = 42.",
    "8 × 6 的长方形缺一块 3 × 2：48 − 6 = 42。",
  ),
  "area-of-combined-rectangles#an-l-shape-from-its-sides": drawing(
    [
      poly(...lRoom),
      {
        kind: "polygon",
        points: [
          [3, 3],
          [8, 3],
          [8, 6],
          [3, 6],
        ],
        tone: "action",
      },
      side([0, 0], [8, 0], "8"),
      side([0, 6], [0, 0], "6"),
      text([5.5, 4.2], "5 × 3"),
    ],
    "An L shape as an 8 by 6 rectangle with a 5 by 3 corner taken out: 48 − 15 = 33.",
    "L 形可看作 8 × 6 的长方形去掉 5 × 3 的一角：48 − 15 = 33。",
  ),
  "perimeter-of-polygons#adding-the-sides": drawing(
    [rect(0, 0, 7, 3), side([0, 0], [7, 0], "7"), side([7, 0], [7, 3], "3"), side([7, 3], [0, 3], "7"), side([0, 3], [0, 0], "3")],
    "A rectangle with sides 7, 3, 7 and 3: the perimeter is 20.",
    "边长为 7、3、7、3 的长方形：周长是 20。",
  ),
  "perimeter-of-polygons#a-missing-side-from-the-perimeter": drawing(
    [
      poly([0, 0], [6, 0], [7, 3], [1, 4]),
      side([0, 0], [6, 0], "6"),
      side([6, 0], [7, 3], "3"),
      side([7, 3], [1, 4], "6"),
      side([1, 4], [0, 0], "?"),
    ],
    "A quadrilateral with perimeter 19 and sides 6, 3 and 6: the missing side is 19 − 15 = 4.",
    "周长为 19、三边为 6、3、6 的四边形：缺少的边是 19 − 15 = 4。",
  ),
  "perimeter-of-polygons#a-side-from-a-regular-perimeter": drawing(
    (() => {
      const p = regular(5, 3);
      return [poly(...p), side(p[0]!, p[1]!, "?"), text([0, -0.2], "P = 40")];
    })(),
    "A regular pentagon with perimeter 40: each side is 40 ÷ 5 = 8.",
    "周长为 40 的正五边形：每条边是 40 ÷ 5 = 8。",
  ),
  "same-perimeter-or-same-area#the-largest-area-for-a-perimeter": drawing(
    [...gridRect(5, 1), ...shift(gridRect(4, 2), 6.5), ...shift(gridRect(3, 3), 12)],
    "Three rectangles with perimeter 12: 5 by 1 with area 5, 4 by 2 with area 8, and 3 by 3 with area 9, the largest.",
    "周长都是 12 的三个长方形：5 × 1 面积 5，4 × 2 面积 8，3 × 3 面积 9，最大。",
  ),
  "same-perimeter-or-same-area#the-perimeter-of-a-rectangle-with-a-given-area": drawing(
    [...gridRect(12, 1), ...shift(gridRect(6, 2), 13.5), ...shift(gridRect(4, 3), 21)],
    "Three rectangles with area 12: perimeters 26, 16 and 14.",
    "面积都是 12 的三个长方形：周长为 26、16、14。",
  ),
  "same-perimeter-or-same-area#the-longest-perimeter-for-an-area": drawing(
    [...gridRect(16, 1), ...shift(gridRect(4, 4), 17.5)],
    "Two rectangles with area 16: the thin one with side 1 has perimeter 34, the square 16.",
    "面积都是 16 的两个长方形：边长为 1 的细长条周长 34，正方形周长 16。",
  ),
  "sorting-quadrilaterals#naming-a-quadrilateral": drawing(
    quadFamily([0, 1, 2]),
    "A square, a rectangle and a rhombus: a rectangle has four square corners and a rhombus four equal sides.",
    "正方形、长方形和菱形：长方形有四个直角，菱形有四条等边。",
  ),
  "sorting-quadrilaterals#counting-shapes-with-a-feature": drawing(
    [
      poly([1.3, 0], [2.6, 1.3], [1.3, 2.6], [0, 1.3]),
      square([1.3, 0], [2.6, 1.3], [0, 1.3]),
      ...shift([poly([0, 0], [3.4, 0], [3.4, 1.8], [0, 1.8])], 4),
      ...shift([poly([1.2, 0], [2.4, 1.3], [1.2, 2.6], [0, 1.3])], 9),
    ],
    "A square turned on its corner is still a square; beside it a rectangle and a rhombus, all with opposite sides parallel.",
    "转到角朝下的正方形仍是正方形；旁边是长方形和菱形，它们的对边都平行。",
  ),
  "sorting-quadrilaterals#true-of-every-rectangle": drawing(
    quadFamily([0, 1]),
    "A square and a rectangle that is not a square: every square is a rectangle, not the reverse.",
    "正方形和不是正方形的长方形：每个正方形都是长方形，反之不成立。",
  ),
  "equal-parts-of-shapes#the-area-of-several-parts": drawing(
    [rect(0, 0, 8, 3), ...[2, 4, 6].map((x) => seg([x, 0], [x, 3])), fill(0, 0, 6, 3), text([4, 0], "24 cm²", "s")],
    "A rectangle of area 24 square centimeters cut into 4 equal parts with 3 shaded: 24 ÷ 4 = 6, then 3 × 6 = 18.",
    "面积 24 平方厘米的长方形分成 4 等份，涂 3 份：24 ÷ 4 = 6，3 × 6 = 18。",
  ),
  "fact-families-for-multiplying-and-dividing#the-missing-number-in-a-triangle": drawing(
    factTriangle("24", "6", "?"),
    "A fact triangle with product 24 at the top and factor 6 at a corner: the missing factor is 24 ÷ 6 = 4.",
    "顶上是积 24、一角是因数 6 的三角形：缺少的因数是 24 ÷ 6 = 4。",
  ),
  "area-models-for-multiplying#the-area-of-one-part": drawing(
    areaModel("4", [
      [6, "10", "4 × 10 = 40"],
      [3, "3", "12"],
    ]),
    "An area model for 4 × 13: the long side is split into 10 and 3, making parts of 40 and 12.",
    "4 × 13 的面积模型：长边分成 10 和 3，得到 40 和 12 两部分。",
  ),
  "equivalent-fractions-on-number-lines#the-same-point-on-two-lines": drawing(
    [...scaledThirds(), spot(4, "result", 0), spot(4, "result", 1.4), seg([4, 0], [4, 1.4], "action", true)],
    "Two lines from 0 to 1: 2/3 on the line cut into thirds and 4/6 on the line cut into sixths are at the same point.",
    "从 0 到 1 的两条数轴：三等分线上的 2/3 和六等分线上的 4/6 在同一点。",
  ),
  "comparing-fractions-with-pictures-and-lines#comparing-on-two-lines": drawing(
    [...scaledCompare(), spot(9, "result", 1.4), spot(8, "action", 0)],
    "Two lines of the same length: 3/4 on the top line is farther right than 2/3 on the lower line, so it is greater.",
    "长度相同的两条数轴：上面的 3/4 比下面的 2/3 更靠右，所以更大。",
  ),
  "picture-graphs-with-half-symbols#what-half-a-symbol-means": drawing(
    [
      ring(1),
      text([0, -1], "10", "s"),
      ...shift([{ kind: "polygon", points: Array.from({ length: 19 }, (_, i) => on(90 + i * 10, 1)) }, text([-0.4, -1], "5", "s")], 3),
    ],
    "A whole circle standing for 10 books and a half circle standing for 5.",
    "一个整圆代表 10 本书，半圆代表 5 本。",
  ),
  "picture-graphs-with-half-symbols#comparing-rows-with-halves": drawing(
    [
      ...symbolRows([
        ["A", 3.5],
        ["B", 2],
      ]),
      ring(0.3, [0.7, -1.9]),
      text([1.1, -1.9], "= 4", "e"),
    ],
    "Rows of 3½ and 2 circles with each circle 4: one row has 1½ more circles, which is 4 + 2 = 6 more.",
    "3½ 个圆和 2 个圆的两行，每个圆代表 4：一行多 1½ 个圆，即多 4 + 2 = 6。",
  ),
  "choosing-a-scale-and-drawing-bars#which-scale-fits": drawing(
    bars(
      [
        ["A", 15],
        ["B", 35],
        ["C", 25],
      ],
      5,
      40,
    ),
    "Bars of 15, 35 and 25 on a scale that counts by fives: all fit, and all can be read exactly.",
    "刻度为五的 15、35、25 三个条形：都画得下，也都能准确读数。",
  ),
  "choosing-a-scale-and-drawing-bars#how-many-spaces-tall": drawing(
    bars([["A", 35]], 5, 40),
    "A bar of 35 on a scale counting by fives: it is 7 spaces tall.",
    "刻度为五时 35 的条形：高 7 格。",
  ),
  "quadrilateral-categories#which-statement-is-true": drawing(
    quadFamily([0, 1, 2]),
    "A square, which is both a rectangle and a rhombus, beside a rectangle and a rhombus that are not squares.",
    "正方形既是长方形也是菱形，旁边是不是正方形的长方形和菱形。",
  ),
  "quadrilateral-categories#quadrilaterals-of-other-kinds": drawing(
    [poly([0, 0], [4, 0.5], [3, 2.8], [0.8, 2]), ...shift([poly([0, 0], [4, 0], [3, 2], [1, 2])], 5)],
    "Two quadrilaterals that are not in a special category: 4 sides of different lengths and no square corners.",
    "不属于特殊类别的四边形：4 条边长度不同，也没有直角。",
  ),
  "two-digit-by-one-digit-multiplication-using-area-models#adding-the-parts": drawing(
    areaModel("6", [
      [8, "40", "6 × 40 = 240"],
      [3, "7", "42"],
    ]),
    "An area model for 6 × 47: parts of 240 and 42.",
    "6 × 47 的面积模型：两部分为 240 和 42。",
  ),
  "two-digit-by-one-digit-multiplication-using-area-models#the-factors-from-the-parts": drawing(
    areaModel("4", [
      [8, "20", "80"],
      [2.4, "3", "12"],
    ]),
    "An area model with side 4 and parts 80 and 12: the other side was split into 20 and 3, which is 23.",
    "一边为 4、两部分为 80 和 12 的面积模型：另一边分成 20 和 3，即 23。",
  ),
  "two-digit-by-one-digit-division-using-area-models#finding-the-quotient-from-a-model": drawing(
    areaModel("6", [
      [7, "10", "60"],
      [2.2, "2", "12"],
    ]),
    "An area model for 72 ÷ 6: lengths 10 and 2 make the quotient 12.",
    "72 ÷ 6 的面积模型：长度 10 和 2 合起来是商 12。",
  ),
  "two-digit-by-one-digit-division-using-area-models#the-total-area-from-the-side-lengths": drawing(
    areaModel("5", [
      [7, "10", "50"],
      [3.5, "4", "20"],
    ]),
    "An area model with divisor 5 and quotient parts 10 and 4: the total area is 50 + 20 = 70.",
    "除数 5、商的部分 10 和 4 的面积模型：总面积 50 + 20 = 70。",
  ),
  "plotting-decimals-on-number-lines#hundredth-steps-between-two-decimals": drawing(
    [
      ...line(0.3, 0.4, 0.01, (v) =>
        Math.round(v * 100) % 10 === 0
          ? v.toFixed(1)
          : Math.round(v * 100) === 34
            ? "0.34"
            : Math.round(v * 100) === 37
              ? "0.37"
              : undefined,
      ),
      spot(4, "action"),
      spot(7),
      ...hops(4, 7),
    ],
    "A tenth cut into ten hundredths: from 0.34 to 0.37 is 3 steps of 0.01.",
    "把十分之一分成十个百分之一：从 0.34 到 0.37 是 3 步 0.01。",
  ),
  "angles-and-angle-measures#an-angle-cut-into-equal-angles": drawing(
    [
      seg([0, 0], on(0, 4)),
      seg([0, 0], on(30, 4), "action"),
      seg([0, 0], on(60, 4), "action"),
      seg([0, 0], on(90, 4)),
      angle([0, 0], on(0, 4), on(30, 4), "accent", "30°"),
      angle([0, 0], on(30, 4), on(60, 4), "accent", "30°"),
      angle([0, 0], on(60, 4), on(90, 4), "accent", "30°"),
    ],
    "An angle of 90° cut by rays into 3 equal angles of 30°.",
    "90° 的角被射线分成 3 个相等的 30° 角。",
  ),
  "connecting-angles-and-circles#how-far-the-minute-hand-turns": drawing(
    [...clock(12, 15), angle([0, 0], on(90, 2), on(0, 2), "result", "90°")],
    "In 15 minutes the minute hand turns from 12 to 3: 15 × 6 = 90 degrees.",
    "15 分钟内分针从 12 转到 3：15 × 6 = 90 度。",
  ),
  "measuring-angles-using-a-protractor#the-other-scale-of-a-protractor": drawing(
    [
      ...Array.from({ length: 36 }, (_, i) => seg(on(i * 5, 4), on((i + 1) * 5, 4))),
      seg([-4, 0], [4, 0]),
      ...[0, 30, 60, 90, 120, 150, 180].flatMap((d) => [
        seg(on(d, 3.8), on(d, 4)),
        text(on(d, 4), String(d), d > 90 ? "nw" : d === 90 ? "n" : "ne"),
        { kind: "label", at: on(d, 3.1), text: String(180 - d), dir: "n" } as Mark,
      ]),
      seg([0, 0], on(60, 3.8), "accent"),
    ],
    "A protractor with two scales: the same ray reads 60 on one scale and 120 on the other, and the two add to 180.",
    "有两圈刻度的量角器：同一条射线在一圈读 60，另一圈读 120，两者之和是 180。",
  ),
  "right-straight-full-and-null-angles#measures-of-special-angles": drawing(
    [
      ...corner(0, 90, "90°", 2),
      ...shift([seg([-2, 0], [2, 0]), { kind: "dot", at: [0, 0] }, text([0, 0.3], "180°")], 5),
      ...shift(
        [
          seg([0, 0], [2.4, 0]),
          ...Array.from({ length: 36 }, (_, i) => seg(on(i * 10, 0.7), on((i + 1) * 10, 0.7), "accent")),
          text([0, 0.7], "360°"),
        ],
        8.5,
      ),
      ...shift([seg([0, 0], [2.4, 0]), text([1.2, 0], "0°", "s")], 12.5),
    ],
    "A right angle of 90°, a straight angle of 180°, a full angle of 360° and a null angle of 0°.",
    "直角 90°、平角 180°、周角 360° 和零角 0°。",
  ),
  "right-straight-full-and-null-angles#naming-angles-on-a-clock": drawing(
    [
      ...clock(3, 0, 3),
      text([0, -3], "3:00", "s"),
      ...shift([...clock(6, 0, 3), text([0, -3], "6:00", "s")], 8),
      ...shift([...clock(12, 0, 3), text([0, -3], "12:00", "s")], 16),
    ],
    "Clocks at 3:00 with a right angle, at 6:00 with a straight angle and at 12:00 with a null angle.",
    "3:00 成直角，6:00 成平角，12:00 成零角的钟面。",
  ),
  "right-straight-full-and-null-angles#how-far-a-minute-hand-turns": drawing(
    [...clock(12, 15), angle([0, 0], on(90, 2), on(0, 2), "result", "90°")],
    "A quarter of an hour on a clock: the minute hand sweeps a right angle.",
    "钟面上的一刻钟：分针转过一个直角。",
  ),
  "acute-obtuse-and-reflex-angles#classifying-angles-by-measure": drawing(
    [
      ...corner(0, 35, "35°", 2),
      ...shift(corner(0, 125, "125°", 2), 5),
      ...shift(
        [
          seg([0, 0], on(0, 2)),
          seg([0, 0], on(250, 2)),
          ...Array.from({ length: 25 }, (_, i) => seg(on(i * 10, 0.6), on((i + 1) * 10, 0.6), "accent")),
          text([-0.2, 0.7], "250°"),
        ],
        10,
      ),
    ],
    "An acute angle of 35°, an obtuse angle of 125° and a reflex angle of 250°.",
    "35° 的锐角、125° 的钝角和 250° 的优角。",
  ),
  "acute-obtuse-and-reflex-angles#the-angle-left-around-a-point": drawing(
    [
      seg([0, 0], on(0, 3)),
      seg([0, 0], on(110, 3)),
      seg([0, 0], on(200, 3)),
      angle([0, 0], on(0, 3), on(110, 3), "accent", "110°"),
      angle([0, 0], on(110, 3), on(200, 3), "action", "90°"),
      text(on(280, 1.2), "?"),
    ],
    "Angles of 110° and 90° around a point: the one left is 360° − 200° = 160°.",
    "一点周围有 110° 和 90° 的角：剩下的是 360° − 200° = 160°。",
  ),
  "classifying-figures-based-on-angles#counting-right-angles-in-shapes": drawing(
    [0, 3]
      .flatMap((x) => shift(squareCorners(2), x))
      .concat([6.2, 9.2, 12.2].flatMap((x) => shift([poly([0, 0], [2.4, 0], [2.4, 2]), square([2.4, 0], [2.4, 2], [0, 0])], x))),
    "2 squares with 4 right angles each and 3 right triangles with 1 each: 2 × 4 + 3 × 1 = 11.",
    "2 个各有 4 个直角的正方形和 3 个各有 1 个直角的直角三角形：2 × 4 + 3 × 1 = 11。",
  ),
  "classifying-figures-based-on-angles#classifying-from-two-angles": drawing(
    (() => {
      const a: Point = [0, 0];
      const b: Point = [6, 0];
      const k = 6 / Math.sin((105 * Math.PI) / 180);
      const c = on(35, k * Math.sin((40 * Math.PI) / 180));
      return [poly(a, b, c), angle(a, b, c, "accent", "35°"), angle(b, c, a, "accent", "40°"), angle(c, a, b, "result", "105°")];
    })(),
    "A triangle with angles of 35° and 40°: the third is 105°, so the triangle is obtuse.",
    "有 35° 和 40° 两个角的三角形：第三个角是 105°，所以是钝角三角形。",
  ),
  "sums-of-angles#equal-angles-around-a-point": drawing(
    [
      seg([0, 0], on(0, 3)),
      seg([0, 0], on(100, 3)),
      seg([0, 0], on(230, 3)),
      angle([0, 0], on(0, 3), on(100, 3), "accent", "100°"),
      angle([0, 0], on(100, 3), on(230, 3), "action", "130°"),
      text(on(295, 1.3), "130°"),
    ],
    "Around a point, a known angle of 100° leaves 260°, shared equally by two angles of 130°.",
    "一点周围，已知角 100° 后还剩 260°，由两个 130° 的角平分。",
  ),
  "solving-angle-problems#angle-word-problems": drawing(
    [
      seg([-4, 0], [4, 0]),
      ...[45, 90, 135].map((d) => seg([0, 0], on(d, 4), "action")),
      ...[0, 45, 90, 135].map((d) => angle([0, 0], on(d, 4), on(d + 45, 4), "accent", "45°")),
    ],
    "A sprinkler turning 45° at a time: 4 turns make 180°.",
    "每次转 45° 的喷头：转 4 次是 180°。",
  ),
  "solving-angle-problems#the-angle-between-clock-hands-on-the-hour": drawing(
    [...clock(4, 0), angle([0, 0], on(90, 2), on(-30, 2), "result", "120°")],
    "A clock at 4:00: the hands are 4 hour marks apart, 4 × 30 = 120 degrees.",
    "4:00 的钟面：两针相隔 4 个小时刻度，4 × 30 = 120 度。",
  ),
  "parallel-and-perpendicular-lines#chains-of-line-relations": drawing(
    [
      seg([-1, 0], [7, 0]),
      seg([1, -1], [1, 4]),
      seg([5, -1], [5, 4]),
      square([1, 0], [2, 0], [1, 1]),
      square([5, 0], [6, 0], [5, 1]),
      { kind: "arrows", a: [1, 2.6], b: [1, 3.4], count: 1 },
      { kind: "arrows", a: [5, 2.6], b: [5, 3.4], count: 1 },
    ],
    "Two lines perpendicular to the same line never meet, so they are parallel.",
    "垂直于同一条直线的两条直线不会相交，所以平行。",
  ),
  "modeling-with-rectangles#finding-a-missing-side": drawing(
    [rect(0, 0, 9, 6), side([0, 0], [9, 0], "9 m"), side([9, 0], [9, 6], "6 m"), text([4.5, 2.5], "P = 30 m")],
    "A rectangle with perimeter 30 meters and length 9 meters: its width is 6 meters.",
    "周长 30 米、长 9 米的长方形：宽 6 米。",
  ),
  "negative-numbers#reading-negative-numbers-on-number-lines": drawing(
    [...line(-6, 2, 1, String), spot(2), ...hops(6, 2)],
    "A number line with a point 4 ticks to the left of 0, at −4.",
    "数轴上位于 0 左边 4 格的点，即 −4。",
  ),
  "negative-numbers#the-gap-across-zero": drawing(
    [
      ...line(-5, 8, 1, (v) => (v === -5 || v === 0 || v === 8 ? String(v) : undefined)),
      spot(0, "action"),
      spot(13, "action"),
      ...hop(0, 5, "5"),
      ...hop(5, 13, "8"),
    ],
    "From −5 to 8 the path goes through 0: distances of 5 and 8 add to 13.",
    "从 −5 到 8 要经过 0：距离 5 和 8 相加得 13。",
  ),
  "multiplying-mixed-numbers-word-problems#areas-and-scaling-with-mixed-numbers": drawing(
    [rect(0, 0, 5, 8 / 3), side([0, 0], [5, 0], "2½ yd"), side([5, 0], [5, 8 / 3], "1⅓ yd")],
    "A rug 2½ yards by 1⅓ yards.",
    "2½ 码 × 1⅓ 码的地毯。",
  ),
  "connecting-fraction-multiplication-and-area#area-of-a-unit-fraction-tile": drawing(
    [
      ...gridRect(4, 3),
      fill(0, 2, 1, 1),
      side([0, 0], [4, 0], "1"),
      side([4, 0], [4, 3], "1"),
      text([0.5, 3], "¼"),
      text([0, 2.3], "⅓", "w"),
    ],
    "A unit square cut into 3 rows and 4 columns: each of the 12 tiles is 1/3 by 1/4.",
    "分成 3 行 4 列的单位正方形：12 块中的每块都是 1/3 × 1/4。",
  ),
  "finding-areas-using-fraction-multiplication#areas-with-fraction-sides": drawing(
    [
      rect(0, 0, 6, 4),
      fill(0, 0, 5, 3),
      ...[1, 2, 3, 4, 5].map((x) => seg([x, 0], [x, 4])),
      ...[1, 2, 3].map((y) => seg([0, y], [6, y])),
      text([2.5, 0], "5/6", "s"),
      text([0, 1.5], "3/4", "w"),
    ],
    "A unit square in sixths and fourths with a rectangle 5/6 by 3/4 shaded.",
    "分成六等份和四等份的单位正方形，阴影是 5/6 × 3/4 的长方形。",
  ),
  "finding-areas-using-fraction-multiplication#areas-with-mixed-number-sides": drawing(
    [rect(0, 0, 7, 4.5), side([0, 0], [7, 0], "3½ ft"), side([7, 0], [7, 4.5], "2¼ ft")],
    "A rectangle 3½ feet by 2¼ feet.",
    "3½ 英尺 × 2¼ 英尺的长方形。",
  ),
  "graphing-patterns#extending-a-graphed-pattern": graphed(
    { xMin: -1, xMax: 5, yMin: -1, yMax: 13, step: 1, labelEvery: 2 },
    [ln([0, 0], [1, 4]), ...[0, 1, 2, 3].map((x) => pt([x, 4 * x], `(${x}, ${4 * x})`, "e", x === 0 ? undefined : "result"))],
    "Points going 1 right and 4 up from (0, 0), on the line y = 4x.",
    "从 (0, 0) 起每次向右 1、向上 4 的点，都在直线 y = 4x 上。",
  ),
  "graphing-patterns#a-far-point-on-the-graph": graphed(
    { xMin: -1, xMax: 8, yMin: -1, yMax: 14, step: 1, labelEvery: 2 },
    [ln([0, 0], [1, 2]), pt([1, 2], "(1, 2)", "e", "result"), pt([3, 6], "(3, 6)", "e", "result"), pt([6, 12], "(6, 12)", "e", "result")],
    "Points from two patterns starting at 0, on a line through the origin: the second coordinate is always 2 times the first.",
    "两个都从 0 开始的规律所得的点，在过原点的直线上：第二个坐标总是第一个的 2 倍。",
  ),
  "polygons#sides-vertices-and-names": drawing(
    [poly(...regular(8, 3)), ...regular(8, 3).map((p): Mark => ({ kind: "dot", at: p }))],
    "An octagon with 8 sides, 8 vertices and 8 angles.",
    "有 8 条边、8 个顶点和 8 个角的八边形。",
  ),
  "polygons#diagonals-from-one-vertex": drawing(
    diagonalFan(7),
    "A heptagon with the 4 diagonals from one vertex: 7 − 3 = 4.",
    "七边形中从一个顶点出发的 4 条对角线：7 − 3 = 4。",
  ),
  "quadrilaterals#identifying-quadrilaterals": drawing(
    [
      rect(0, 0, 5, 3),
      square([0, 0], [5, 0], [0, 3]),
      square([5, 0], [5, 3], [0, 0]),
      square([5, 3], [0, 3], [5, 0]),
      square([0, 3], [0, 0], [5, 3]),
    ],
    "A parallelogram with four right angles and sides of two different lengths: a rectangle.",
    "有四个直角、两种边长的平行四边形：长方形。",
  ),
  "quadrilaterals#properties-of-quadrilaterals": drawing(
    (() => {
      const a: Point = [0, 0];
      const b: Point = [4, 0];
      const c: Point = [6.4, 3.2];
      const d: Point = [2.4, 3.2];
      return [
        poly(a, b, c, d),
        { kind: "ticks" as const, a, b, count: 1 },
        { kind: "ticks" as const, a: b, b: c, count: 1 },
        { kind: "ticks" as const, a: c, b: d, count: 1 },
        { kind: "ticks" as const, a: d, b: a, count: 1 },
      ];
    })(),
    "A rhombus: four equal sides and two pairs of parallel sides, but no right angles.",
    "菱形：四边相等、两组对边平行，但没有直角。",
  ),
  "quadrilaterals#the-missing-angle-of-a-quadrilateral": drawing(
    (() => {
      const a: Point = [0, 0];
      const b: Point = [6, 0];
      const c: Point = [7, 3.5];
      const d: Point = [1, 4];
      return [poly(a, b, c, d), seg(a, c, "action", true), name(a, "A", "sw"), name(b, "B", "se"), name(c, "C", "ne"), name(d, "D", "nw")];
    })(),
    "A diagonal cuts quadrilateral ABCD into two triangles, so its angles total 360°.",
    "对角线把四边形 ABCD 分成两个三角形，所以内角和为 360°。",
  ),
  "rectangles-rhombuses-and-squares#sides-from-perimeters": drawing(
    [rect(0, 0, 4, 4), side([0, 0], [4, 0], "9 in"), text([2, 1.6], "P = 36 in")],
    "A square with perimeter 36 inches has sides of 9 inches.",
    "周长 36 英寸的正方形，边长 9 英寸。",
  ),
  "rectangles-rhombuses-and-squares#a-square-with-the-same-perimeter": drawing(
    [...gridRect(8, 2), ...shift(gridRect(5, 5), 10)],
    "A wire bent into a rectangle 8 by 2 and then a square with side 5: both have perimeter 20, with areas 16 and 25.",
    "铁丝先弯成 8 × 2 的长方形，再弯成边长为 5 的正方形：周长都是 20，面积为 16 和 25。",
  ),
  "perimeters-of-shapes#a-side-from-a-regular-perimeter": drawing(
    (() => {
      const p = regular(6, 3);
      return [poly(...p), side(p[0]!, p[1]!, "?"), text([0, -0.2], "P = 42")];
    })(),
    "A regular hexagon with perimeter 42: each side is 42 ÷ 6 = 7.",
    "周长为 42 的正六边形：每条边是 42 ÷ 6 = 7。",
  ),
  "classifying-quadrilaterals#every-one-is-also": drawing(
    quadFamily([0, 2, 3]),
    "A square, a rhombus and a parallelogram: every square is a rhombus, and every rhombus is a parallelogram.",
    "正方形、菱形和平行四边形：每个正方形都是菱形，每个菱形都是平行四边形。",
  ),
  "classifying-quadrilaterals#one-right-angle-settles-the-rest": drawing(
    [rect(0, 0, 5, 3), square([0, 0], [5, 0], [0, 3]), text([5, 0], "90°", "se"), text([5, 3], "90°", "ne"), text([0, 3], "90°", "nw")],
    "A parallelogram with one right angle: its neighbors add to 180°, so all four angles are right.",
    "有一个直角的平行四边形：相邻的角之和为 180°，所以四个角都是直角。",
  ),
};

/** scaledThirds draws lines cut into thirds above and sixths below, with the same length. */
function scaledThirds(): Mark[] {
  const lineAt = (parts: number, y: number, label: Readonly<Record<number, string>>): Mark[] => [
    seg([-0.5, y], [6.5, y]),
    ...Array.from({ length: parts + 1 }, (_, i) => i).flatMap((i) => {
      const x = (i * 6) / parts;
      const s = label[i] ?? (i === 0 ? "0" : i === parts ? "1" : undefined);
      return [seg([x, y - 0.12], [x, y + 0.12]), ...(s ? [note([x, y - 0.12], s, "s")] : [])];
    }),
  ];
  return [...lineAt(3, 1.4, { 2: "2/3" }), ...lineAt(6, 0, { 4: "4/6" })];
}

/** scaledCompare draws lines cut into fourths above and thirds below, with the same length. */
function scaledCompare(): Mark[] {
  const lineAt = (parts: number, y: number, label: Readonly<Record<number, string>>): Mark[] => [
    seg([-0.5, y], [12.5, y]),
    ...Array.from({ length: parts + 1 }, (_, i) => i).flatMap((i) => {
      const x = (i * 12) / parts;
      const s = label[i] ?? (i === 0 ? "0" : i === parts ? "1" : undefined);
      return [seg([x, y - 0.12], [x, y + 0.12]), ...(s ? [note([x, y - 0.12], s, "s")] : [])];
    }),
  ];
  return [...lineAt(4, 1.4, { 3: "3/4" }), ...lineAt(3, 0, { 2: "2/3" })];
}
