// Drawings in the explanations of the elementary courses: number lines, area models, fraction models, angles and shapes.

import type { Figure } from "@ga/content";
import type { Compass, Mark, Point } from "@ga/subject-math";

import { angle, bend, drawing, name, note, on, seg, square } from "./explanation-drawings-kit.ts";

/** rect is the corners of a rectangle at a place. */
const rect = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

const box = (x: number, y: number, w: number, h: number): Mark => ({ kind: "polygon", points: rect(x, y, w, h) });

const fill = (x: number, y: number, w: number, h: number, tone: "action" | "result" = "result"): Mark => ({
  kind: "shade",
  points: rect(x, y, w, h),
  tone,
});

/** lineMarks draws a number line at height y from lo to hi with ticks at each step, labeled through a function. */
function lineMarks(lo: number, hi: number, step: number, label: (v: number) => string | undefined, scale = 1, y = 0): Mark[] {
  const marks: Mark[] = [seg([(lo - step / 2) * scale, y], [(hi + step / 2) * scale, y])];
  const count = Math.round((hi - lo) / step);
  for (let i = 0; i <= count; i += 1) {
    const v = lo + i * step;
    const x = v * scale;
    marks.push(seg([x, y - 0.12], [x, y + 0.12]));
    const text = label(v);
    if (text) marks.push(note([x, y - 0.12], text, "s"));
  }
  return marks;
}

/** spot marks a point of a number line with a dot. */
const spot = (x: number, text?: string, tone: "action" | "result" = "result", y = 0, dir: Compass = "n"): Mark[] => [
  { kind: "dot", at: [x, y], tone },
  ...(text ? [note([x, y + 0.1], text, dir)] : []),
];

/** hop draws a jump between two places of a number line as a low curve, with its size written above. */
function hop(a: number, b: number, text: string, y = 0, tone: "accent" | "action" | "result" = "accent"): Mark[] {
  const rx = Math.abs(b - a) / 2;
  const c = (a + b) / 2;
  const ry = Math.min(1.1, 0.3 + rx * 0.5);
  const pts = Array.from({ length: 25 }, (_, i): Point => [c + rx * Math.cos((Math.PI * i) / 24), y + ry * Math.sin((Math.PI * i) / 24)]);
  return [...pts.slice(1).map((p, i) => seg(pts[i] as Point, p, tone)), note([c, y + ry], text, "n")];
}

/** fractionLine draws 0 to the given whole with a tick at each part, labeling whole numbers and optionally each part. */
function fractionLine(whole: number, parts: number, unit = 8, y = 0, labelParts = false): Mark[] {
  return lineMarks(
    0,
    whole,
    1 / parts,
    (v) => {
      const n = Math.round(v * parts);
      if (n % parts === 0) return String(n / parts);
      return labelParts ? `${n}/${parts}` : undefined;
    },
    unit,
    y,
  );
}

/** areaModel draws a rectangle split across its long side, with sides outside and areas inside. */
function areaModel(height: string, parts: readonly (readonly [string, string, number])[], tall = 3): Mark[] {
  const marks: Mark[] = [];
  let x = 0;
  const tones = ["accent", "result", "action"] as const;
  parts.forEach(([side, area, width], i) => {
    marks.push({
      kind: "polygon",
      points: rect(x, 0, width, tall),
      ...(tones[i] === "accent" ? { accent: true } : { tone: tones[i] as "action" | "result" }),
    });
    marks.push(note([x + width / 2, tall], side, "n"), note([x + width / 2, tall / 2], area, "n"));
    x += width;
  });
  marks.push(note([0, tall / 2], height, "w"));
  return marks;
}

/** gridMarks draws a rectangle cut into columns and rows, shading some columns and some rows. */
function gridMarks(columns: number, rows: number, shadedColumns: number, shadedRows: number, w = 6, h = 6): Mark[] {
  const [cw, rh] = [w / columns, h / rows];
  const marks: Mark[] = [];
  if (shadedColumns) marks.push(fill(0, 0, cw * shadedColumns, h, "action"));
  if (shadedRows) marks.push(fill(0, h - rh * shadedRows, w, rh * shadedRows, "result"));
  for (let i = 1; i < columns; i += 1) marks.push(seg([cw * i, 0], [cw * i, h]));
  for (let i = 1; i < rows; i += 1) marks.push(seg([0, rh * i], [w, rh * i]));
  marks.push(box(0, 0, w, h));
  return marks;
}

/** labeled draws a rectangle with all four sides labeled. */
const labeled = (w: number, h: number, wide: string, tall: string, x = 0): Mark[] => [
  box(x, 0, w, h),
  note([x + w / 2, 0], wide, "s"),
  note([x + w / 2, h], wide, "n"),
  note([x, h / 2], tall, "w"),
  note([x + w, h / 2], tall, "e"),
];

const lPoints: Point[] = [
  [0, 0],
  [6, 0],
  [6, 2],
  [3, 2],
  [3, 5],
  [0, 5],
];

/** lGrid is the grid lines of the L shape. */
const lGrid: Mark[] = [
  ...[1, 2, 3, 4, 5].map((x) => seg([x, 0], [x, x < 3 ? 5 : 2])),
  ...[1, 2, 3, 4].map((y) => seg([0, y], [y < 2 ? 6 : 3, y])),
];

/** barOf draws a bar cut into equal parts with some shaded. */
function barOf(parts: number, shaded: number, y: number, w = 8, h = 1): Mark[] {
  const cw = w / parts;
  return [
    ...(shaded ? [fill(0, y, cw * shaded, h)] : []),
    ...Array.from({ length: parts - 1 }, (_, i) => seg([cw * (i + 1), y], [cw * (i + 1), y + h])),
    box(0, y, w, h),
  ];
}

/** rayFan draws rays from a vertex at given degrees, with the angles between neighbors labeled. */
function rayFan(degrees: readonly number[], labels: readonly (string | undefined)[], r = 4): Mark[] {
  const O: Point = [0, 0];
  const tones = ["accent", "action", "result"] as const;
  return [
    ...degrees.map((d) => seg(O, on(d, r))),
    ...labels.flatMap((label, i) => {
      const a = degrees[i] as number;
      const b = degrees[i + 1] as number;
      return [angle(O, on(a, r), on(b, r), tones[i % 3], label)];
    }),
  ];
}

/** protractor draws a half circle scale with rays at two readings. */
function protractor(a: number, b: number): Mark[] {
  const R = 4;
  const O: Point = [0, 0];
  const ticks = Array.from({ length: 19 }, (_, i) => i * 10).flatMap((d) => [
    seg(on(d, R), on(d, d % 30 === 0 ? R - 0.3 : R - 0.15)),
    ...(d % 30 === 0 ? [note(on(d, R + 0.05), String(d), d < 80 ? "ne" : d > 100 ? "nw" : "n")] : []),
  ]);
  return [
    seg([-R, 0], [R, 0]),
    ...bend(0, 180, R, O, "action").map((m) => ({ ...m, tone: undefined, accent: undefined }) as Mark),
    ...ticks,
    seg(O, on(a, R), "accent"),
    seg(O, on(b, R), "accent"),
    ...(a === 0 ? [] : [note(on(a, R + 0.45), `${a}°`, a < 90 ? "ne" : "nw")]),
    note(on(b, R + 0.45), `${b}°`, b < 90 ? "ne" : "nw"),
    angle(O, on(a, R), on(b, R), "result"),
  ];
}

const shape = (points: readonly Point[]): Mark => ({ kind: "polygon", points });

const regular = (n: number, r: number, c: Point, start = 90): Point[] =>
  Array.from({ length: n }, (_, i) => on(start + (360 * i) / n, r, c));

const integers = (lo: number, hi: number, marks: readonly (readonly [number, string, Compass?])[], labelEvery = 2): Mark[] => [
  ...lineMarks(lo, hi, 1, (v) => (v % labelEvery === 0 ? String(v).replace("-", "−") : undefined), 0.8),
  ...marks.flatMap(([v, text, dir]) => spot(v * 0.8, text, "result", 0, dir ?? "n")),
];

/** gradeDrawings are the explanation drawings of the elementary courses. */
export const gradeDrawings = {
  "where-tens-jumps-land": drawing(
    [...lineMarks(17, 47, 10, (v) => String(v), 0.3), ...hop(5.1, 8.1, "+10"), ...hop(8.1, 11.1, "+10"), ...hop(11.1, 14.1, "+10")],
    "A number line starting at 17 with jumps of ten landing on 27, 37 and 47.",
    "从 17 开始的数轴，每次跳十，落在 27、37、47。",
  ),
  "jumping-by-tens-then-ones": drawing(
    [
      seg([0, 0], [9.5, 0]),
      ...spot(0.5, undefined, "action"),
      ...spot(6.5, undefined, "action"),
      ...spot(9, undefined),
      note([0.5, -0.1], "47", "s"),
      note([6.5, -0.1], "67", "s"),
      note([9, -0.1], "72", "s"),
      ...hop(0.5, 6.5, "+20"),
      ...hop(6.5, 9, "+5", 0, "result"),
    ],
    "An open number line for 47 + 25: a jump of 20 from 47 to 67, then a jump of 5 to 72.",
    "47 + 25 的空数轴：从 47 跳 20 到 67，再跳 5 到 72。",
  ),
  "three-jumps-back": drawing(
    [
      seg([-0.5, 0], [8.5, 0]),
      ...spot(0, undefined, "result"),
      ...spot(1.5, undefined, "action"),
      ...spot(4, undefined, "action"),
      ...spot(8, undefined, "action"),
      note([0, -0.1], "343", "s"),
      note([1.5, -0.1], "346", "s"),
      note([4, -0.1], "386", "s"),
      note([8, -0.1], "586", "s"),
      ...hop(8, 4, "−200"),
      ...hop(4, 1.5, "−40", 0, "action"),
      ...hop(1.5, 0, "−3", 0, "result"),
    ],
    "An open number line for 586 − 243: jump back 200 to 386, 40 to 346, and 3 to 343.",
    "586 − 243 的空数轴：向左跳 200 到 386，跳 40 到 346，跳 3 到 343。",
  ),
  "around-a-rectangle": drawing(
    [box(0, 0, 5, 3), note([2.5, 0], "5", "s"), note([0, 1.5], "3", "w")],
    "A rectangle with sides of 5 and 3: four sides to add, 5 + 3 + 5 + 3 = 16.",
    "边长 5 和 3 的长方形：要加四条边，5 + 3 + 5 + 3 = 16。",
  ),
  "adding-the-two-parts": drawing(
    areaModel("6", [
      ["10", "60", 7],
      ["4", "24", 2.8],
    ]),
    "An area model for 6 × 14: a rectangle with height 6 split into parts of 10 and 4, with areas 60 and 24.",
    "6 × 14 的面积模型：高 6 的长方形分成 10 和 4 两部分，面积 60 和 24。",
  ),
  "finding-a-missing-side-from-area": drawing(
    [box(0, 0, 7, 6), note([3.5, 0], "7 ft", "s"), note([0, 3], "?", "w"), note([3.5, 3], "42 ft²", "n")],
    "A rug with an area of 42 square feet and a side of 7 feet: the other side is 42 ÷ 7, or 6 feet.",
    "面积 42 平方英尺、一边 7 英尺的地毯：另一边是 42 ÷ 7，即 6 英尺。",
  ),
  "comparing-two-areas": drawing(
    [
      box(0, 0, 8, 2),
      note([4, 0], "8", "s"),
      note([0, 1], "2", "w"),
      note([4, 1], "16", "n"),
      box(10, 0, 5, 4),
      note([12.5, 0], "5", "s"),
      note([10, 2], "4", "w"),
      note([12.5, 2], "20", "n"),
    ],
    "A rectangle 8 by 2 with area 16 and a rectangle 5 by 4 with area 20.",
    "8 × 2 的长方形面积 16，5 × 4 的长方形面积 20。",
  ),
  "putting-a-fence-around": drawing(
    [...labeled(7, 3, "7 m", "3 m")],
    "A garden 7 meters by 3 meters: the fence goes around all four sides.",
    "7 米 × 3 米的花园：篱笆围绕全部四条边。",
  ),
  "perimeter-of-rectangles-and-word-problems#a-missing-side-from-the-perimeter": drawing(
    [...labeled(8, 5, "8", "?")],
    "A rectangle with perimeter 26 and a side of 8: half the perimeter is 13, so the other side is 5.",
    "周长 26、一边 8 的长方形：周长的一半是 13，所以另一边是 5。",
  ),
  "reading-a-row-with-a-half": drawing(
    [
      ...[0, 1, 2].flatMap((i) => [
        { kind: "shade", points: regular(32, 0.45, [i * 1.2, 0]), tone: "result" } satisfies Mark,
        shape(regular(32, 0.45, [i * 1.2, 0])),
      ]),
      { kind: "shade", points: Array.from({ length: 17 }, (_, i): Point => on(90 + i * 11.25, 0.45, [3.6, 0])), tone: "result" },
      shape(regular(32, 0.45, [3.6, 0])),
      note([5, 0], "● = 4", "e"),
    ],
    "A row of 3 and a half circles, with each whole circle worth 4: 3 × 4 = 12, and 2 more for the half, making 14.",
    "一行 3 个半圆圈，每个整圆代表 4：3 × 4 = 12，半个再加 2，共 14。",
  ),
  "jumping-to-an-end-time": drawing(
    [
      seg([-0.5, 0], [8.5, 0]),
      ...spot(0, undefined, "action"),
      ...spot(6, undefined, "result"),
      note([0, -0.1], "3:50", "s"),
      note([6, -0.1], "4:00", "s"),
      ...hop(0, 6, "10 min"),
    ],
    "A time line: a jump of 10 minutes from 3:50 lands on 4:00, on the hour.",
    "时间轴：从 3:50 跳 10 分钟，正好落在整点 4:00。",
  ),
  "one-space-from-zero": drawing(
    [...fractionLine(1, 4, 8), ...spot(2, "1/4")],
    "A number line from 0 to 1 cut into 4 equal spaces: there are 5 marks, and the first mark after 0 is 1/4.",
    "从 0 到 1 被分成 4 个相等空格的数轴：有 5 个刻度，0 之后的第一个刻度是 1/4。",
  ),
  "rows-of-unit-squares": drawing(
    gridMarks(6, 4, 0, 1, 6, 4),
    "A rectangle covered with unit squares in 4 rows of 6, with one row shaded: 4 × 6 squares.",
    "铺满单位正方形的长方形，4 行每行 6 个，涂色的是一行：4 × 6 个正方形。",
  ),
  "counting-squares-in-an-l": drawing(
    [shape(lPoints), ...lGrid],
    "An L shape on a grid, made of unit squares: count the squares in each row.",
    "方格上的 L 形，由单位正方形组成：数每一行的方格。",
  ),
  "splitting-an-l-into-two": drawing(
    [
      { kind: "shade", points: rect(0, 0, 3, 5), tone: "action" },
      { kind: "shade", points: rect(3, 0, 3, 2), tone: "result" },
      shape(lPoints),
      seg([3, 0], [3, 2], "accent", true),
      note([3, 0], "6", "s"),
      note([0, 2.5], "5", "w"),
      note([6, 1], "2", "e"),
      note([1.5, 5], "3", "n"),
    ],
    "An L shape split by a dashed line into a rectangle 3 by 5 and a rectangle 3 by 2.",
    "L 形被虚线分成 3 × 5 和 3 × 2 两个长方形。",
  ),
  "taking-away-a-corner": drawing(
    [
      { kind: "shade", points: rect(3, 2, 3, 3), tone: "action" },
      shape(lPoints),
      seg([3, 5], [6, 5], "accent", true),
      seg([6, 5], [6, 2], "accent", true),
      note([3, 0], "6", "s"),
      note([0, 2.5], "5", "w"),
      note([4.5, 3.5], "3 × 3", "n"),
    ],
    "An L shape inside a rectangle 6 by 5: the missing corner, 3 by 3, is taken away from the big rectangle.",
    "6 × 5 长方形内的 L 形：从大长方形中减去缺失的 3 × 3 角。",
  ),
  "perimeter-of-an-l": drawing(
    [
      shape(lPoints),
      seg([3, 5], [6, 5], undefined, true),
      seg([6, 5], [6, 2], undefined, true),
      note([3, 0], "6", "s"),
      note([6, 1], "2", "e"),
      note([4.5, 2], "3", "n"),
      note([3, 3.5], "3", "e"),
      note([1.5, 5], "3", "n"),
      note([0, 2.5], "5", "w"),
    ],
    "An L shape with sides 6, 2, 3, 3, 3 and 5 around it: its perimeter, 22, equals that of the dashed rectangle around it, 6 by 5.",
    "L 形的六条边是 6、2、3、3、3、5：周长 22，等于外面虚线长方形（6 × 5）的周长。",
  ),
  "naming-the-special-quadrilaterals": drawing(
    [
      shape(rect(0, 0, 4, 2.4)),
      ...[
        [0, 0],
        [4, 0],
        [4, 2.4],
        [0, 2.4],
      ].map(([x, y], i): Mark => square([x as number, y as number], [i === 0 || i === 3 ? 1 : 3, y as number], [x as number, 1.2])),
      shape([
        [6, 0],
        [8.6, 0],
        [9.8, 2.3],
        [7.2, 2.3],
      ]),
      { kind: "ticks", a: [6, 0], b: [8.6, 0], count: 1 },
      { kind: "ticks", a: [8.6, 0], b: [9.8, 2.3], count: 1 },
      { kind: "ticks", a: [9.8, 2.3], b: [7.2, 2.3], count: 1 },
      { kind: "ticks", a: [7.2, 2.3], b: [6, 0], count: 1 },
      shape(rect(11.5, 0, 2.4, 2.4)),
      square([11.5, 0], [12.5, 0], [11.5, 1]),
      square([13.9, 0], [12.9, 0], [13.9, 1]),
      square([13.9, 2.4], [12.9, 2.4], [13.9, 1.4]),
      square([11.5, 2.4], [12.5, 2.4], [11.5, 1.4]),
      { kind: "ticks", a: [11.5, 0], b: [13.9, 0], count: 1 },
      { kind: "ticks", a: [13.9, 0], b: [13.9, 2.4], count: 1 },
      { kind: "ticks", a: [13.9, 2.4], b: [11.5, 2.4], count: 1 },
      { kind: "ticks", a: [11.5, 2.4], b: [11.5, 0], count: 1 },
    ],
    "A rectangle with 4 square corners, a rhombus with 4 equal sides, and a square with both.",
    "有 4 个直角的长方形，4 条边相等的菱形，以及两者兼有的正方形。",
  ),
  "parts-of-the-model": drawing(
    areaModel("6", [
      ["40", "240", 8],
      ["7", "42", 1.8],
    ]),
    "An area model for 6 × 47: height 6, split into parts of 40 and 7, with areas 240 and 42.",
    "6 × 47 的面积模型：高 6，分成 40 和 7 两部分，面积 240 和 42。",
  ),
  "hundreds-tens-and-ones": drawing(
    areaModel("4", [
      ["300", "1,200", 9],
      ["20", "80", 2.6],
      ["6", "24", 1.6],
    ]),
    "An area model for 4 × 326: height 4, split into 300, 20 and 6, with areas 1,200, 80 and 24.",
    "4 × 326 的面积模型：高 4，分成 300、20、6，面积 1,200、80、24。",
  ),
  "four-parts": drawing(
    [
      fill(0, 2, 8, 4, "action"),
      fill(8, 2, 2.4, 4, "result"),
      fill(0, 0, 8, 2),
      box(0, 0, 10.4, 6),
      seg([8, 0], [8, 6]),
      seg([0, 2], [10.4, 2]),
      note([4, 6], "40", "n"),
      note([9.2, 6], "5", "n"),
      note([0, 4], "20", "w"),
      note([0, 1], "3", "w"),
      note([4, 4], "800", "n"),
      note([9.2, 4], "100", "n"),
      note([4, 1], "120", "n"),
      note([9.2, 1], "15", "n"),
    ],
    "An area model for 23 × 45 with four parts: 800, 100, 120 and 15.",
    "23 × 45 的面积模型，有四部分：800、100、120、15。",
  ),
  "two-digit-by-one-digit-division-using-area-models#missing-side-lengths": drawing(
    areaModel("6", [
      ["10", "60", 7],
      ["2", "12", 2.4],
    ]),
    "An area model for 72 ÷ 6: side 6, areas 60 and 12, lengths 10 and 2.",
    "72 ÷ 6 的面积模型：边 6，面积 60 和 12，长度 10 和 2。",
  ),
  "three-part-models": drawing(
    areaModel("3", [
      ["300", "900", 8],
      ["20", "60", 2.6],
      ["1", "3", 1.4],
    ]),
    "An area model for 963 ÷ 3: side 3, areas 900, 60 and 3, lengths 300, 20 and 1.",
    "963 ÷ 3 的面积模型：边 3，面积 900、60、3，长度 300、20、1。",
  ),
  "choosing-the-point-for-a-fraction": drawing(
    [
      ...fractionLine(1, 5, 10),
      ...spot(6),
      note([6, -0.12], "3/5", "s"),
      ...hop(0, 2, "1/5", 0.1),
      ...hop(2, 4, "1/5", 0.1),
      ...hop(4, 6, "1/5", 0.1),
    ],
    "A number line from 0 to 1 cut into 5 equal steps, with 3 steps from 0 reaching 3/5.",
    "从 0 到 1 分成 5 个相等步长的数轴，从 0 走 3 步到 3/5。",
  ),
  "finding-mixed-numbers-on-number-lines": drawing(
    [
      ...fractionLine(2, 3, 5),
      ...spot((5 * 5) / 3),
      note([(5 * 5) / 3, -0.12], "1 2/3", "s"),
      ...hop(5, 5 + 5 / 3, "1/3", 0.1),
      ...hop(5 + 5 / 3, 5 + 10 / 3, "1/3", 0.1),
    ],
    "A number line from 0 to 2 in thirds: from 1, two steps of 1/3 reach 1 2/3, between 1 and 2.",
    "以三分之一为单位的 0 到 2 数轴：从 1 走两步 1/3 到 1 2/3，在 1 和 2 之间。",
  ),
  "equivalent-fractions-from-grids": drawing(
    gridMarks(3, 4, 2, 0),
    "A rectangle with 2 of 3 columns shaded, cut into 4 rows: 8 of the 12 small rectangles are shaded.",
    "3 列中有 2 列涂色的长方形，分成 4 行：12 个小长方形中有 8 个涂色。",
  ),
  "comparing-two-bar-models": drawing(
    [...barOf(4, 3, 1.6), ...barOf(8, 5, 0), note([8, 2.1], "3/4", "e"), note([8, 0.5], "5/8", "e")],
    "Bars showing 3/4 and 5/8, one above the other: 3/4 reaches farther.",
    "上下两条分别表示 3/4 和 5/8 的长条：3/4 更长。",
  ),
  "classifying-angles": drawing(
    [
      seg([0, 0], [3, 0]),
      seg([0, 0], on(40, 3)),
      angle([0, 0], [3, 0], on(40, 3), "accent"),
      seg([5, 0], [8, 0]),
      seg([5, 0], [5, 3]),
      square([5, 0], [8, 0], [5, 3]),
      seg([11, 0], [14, 0]),
      seg([11, 0], on(130, 3, [11, 0])),
      angle([11, 0], [14, 0], on(130, 3, [11, 0]), "action"),
      seg([16, 0], [22, 0]),
      { kind: "dot", at: [19, 0] },
      angle([19, 0], [22, 0], [16, 0], "result"),
    ],
    "Four angles: acute, right with its small square, obtuse, and straight with its rays forming a line.",
    "四个角：锐角、带小方块的直角、钝角，以及两条射线成一直线的平角。",
  ),
  "adjacent-angles": drawing(
    [
      ...rayFan([0, 45, 110], ["45°", "65°"]),
      name(on(0, 4), "A", "e"),
      name(on(45, 4), "B", "ne"),
      name(on(110, 4), "C", "n"),
      name([0, 0], "O", "sw"),
    ],
    "Angle AOC of 110° split by ray OB into angle AOB of 45° and angle BOC of 65°.",
    "110° 的角 AOC 被射线 OB 分成 45° 的角 AOB 和 65° 的角 BOC。",
  ),
  "reading-a-protractor-from-zero": drawing(
    protractor(0, 65),
    "A protractor with one ray at 0° and the other crossing the scale at 65°.",
    "量角器上一条射线在 0°，另一条过 65° 刻度。",
  ),
  "reading-a-protractor-between-two-marks": drawing(
    protractor(40, 115),
    "A protractor with rays at 40° and 115°: the angle between them is 75°.",
    "量角器上的射线在 40° 和 115°：它们之间的角是 75°。",
  ),
  "finding-reflex-angles": drawing(
    [
      seg([0, 0], on(0, 4)),
      seg([0, 0], on(70, 4)),
      angle([0, 0], on(0, 4), on(70, 4), "accent", "70°"),
      ...bend(70, 360, 1, [0, 0], "result"),
      note(on(215, 1.1), "290°", "sw"),
    ],
    "Two rays from a point make a smaller angle of 70° and a reflex angle of 290°.",
    "从一点出发的两条射线构成 70° 的小角和 290° 的优角。",
  ),
  "adding-several-adjacent-angles": drawing(
    rayFan([0, 25, 65, 95], ["25°", "40°", "30°"]),
    "An angle split into parts of 25°, 40° and 30°, which together make 95°.",
    "分成 25°、40°、30° 三部分的角，合起来是 95°。",
  ),
  "angles-around-a-point": drawing(
    rayFan([90, 190, 320, 450], ["100°", "130°", "130°"], 3),
    "Three angles of 100°, 130° and 130° fill the space around a point: 360°.",
    "100°、130°、130° 三个角填满一点周围：360°。",
  ),
  "unknown-parts-of-right-and-straight-angles": drawing(
    [
      seg([-4, 0], [4, 0]),
      seg([0, 0], on(65, 4)),
      angle([0, 0], [4, 0], on(65, 4), "accent", "65°"),
      angle([0, 0], on(65, 4), [-4, 0], "result", "x"),
    ],
    "A straight angle split into 65° and x, with x = 115°.",
    "分成 65° 和 x 的平角，x = 115°。",
  ),
  "identifying-parallel-and-perpendicular-lines": drawing(
    [
      seg([0, 0], [5, 0]),
      seg([0, 2], [5, 2]),
      { kind: "arrows", a: [2, 0], b: [3, 0], count: 1 },
      { kind: "arrows", a: [2, 2], b: [3, 2], count: 1 },
      seg([7, 1], [12, 1]),
      seg([9.5, -0.6], [9.5, 2.6]),
      square([9.5, 1], [11, 1], [9.5, 2.6]),
    ],
    "Left: lines marked with matching arrows are parallel. Right: lines crossing with a right-angle mark are perpendicular.",
    "左：带相同箭头的直线平行。右：相交并标有直角的直线垂直。",
  ),
  "parallel-sides-of-shapes": drawing(
    [
      shape(rect(0, 0, 4, 2.6)),
      { kind: "arrows", a: [1.5, 0], b: [2.5, 0], count: 1 },
      { kind: "arrows", a: [1.5, 2.6], b: [2.5, 2.6], count: 1 },
      { kind: "arrows", a: [0, 0.8], b: [0, 1.8], count: 2 },
      { kind: "arrows", a: [4, 0.8], b: [4, 1.8], count: 2 },
      shape(regular(6, 1.6, [7.2, 1.3], 0)),
      shape([
        [10.4, 0],
        [14, 0],
        [11.6, 2.6],
      ]),
    ],
    "A rectangle with 2 pairs of parallel sides, a regular hexagon with 3 pairs, and a triangle with none.",
    "有 2 组平行边的长方形，有 3 组的正六边形，以及没有平行边的三角形。",
  ),
  "finding-the-least-and-greatest": drawing(
    integers(
      -13,
      4,
      [
        [-12, "−12"],
        [-7, "−7"],
        [0, ""],
        [3, "3"],
      ],
      1000,
    ),
    "A number line with −12, −7, 0 and 3: the leftmost, −12, is the least and the rightmost, 3, the greatest.",
    "数轴上的 −12、−7、0、3：最左的 −12 最小，最右的 3 最大。",
  ),
  opposites: drawing(
    [
      ...integers(
        -6,
        6,
        [
          [-5, "−5", "nw"],
          [5, "5", "ne"],
        ],
        2,
      ),
      ...hop(0, 4, "5", 0.1),
      ...hop(0, -4, "5", 0.1, "result"),
    ],
    "On a number line, 5 and −5 are the same distance from 0 on opposite sides.",
    "数轴上，5 和 −5 在 0 的两侧，到 0 的距离相同。",
  ),
  "comparing-integers": drawing(
    integers(
      -8,
      2,
      [
        [-7, "−7"],
        [-2, "−2"],
      ],
      2,
    ),
    "On a number line, −2 lies to the right of −7, so −2 > −7.",
    "数轴上 −2 在 −7 的右边，所以 −2 > −7。",
  ),
  "evaluating-absolute-values": drawing(
    [
      ...integers(
        -8,
        8,
        [
          [-7, "−7", "nw"],
          [7, "7", "ne"],
        ],
        2,
      ),
      ...hop(0, 5.6, "7", 0.1),
      ...hop(0, -5.6, "7", 0.1, "result"),
    ],
    "On a number line, both 7 and −7 are at a distance of 7 from 0.",
    "数轴上，7 和 −7 到 0 的距离都是 7。",
  ),
  "whole-number-plus-proper-fraction-models": drawing(
    [
      ...[0, 1, 2].flatMap((i) => [fill(i * 3.2, 0, 3, 1), box(i * 3.2, 0, 3, 1)]),
      fill(9.6, 0, (3 * 2) / 5, 1),
      ...[1, 2, 3, 4].map((i) => seg([9.6 + (3 * i) / 5, 0], [9.6 + (3 * i) / 5, 1])),
      box(9.6, 0, 3, 1),
    ],
    "3 fully shaded bars and a bar with 2 of 5 parts shaded: 3 2/5.",
    "3 条全涂色的长条和 1 条 5 份中涂 2 份的长条：3 2/5。",
  ),
  "unit-fraction-times-unit-fraction-models": drawing(
    gridMarks(4, 2, 1, 1),
    "A square cut into 4 columns with 1 shaded and 2 rows with 1 shaded: 1 of 8 small rectangles is shaded twice.",
    "正方形分成 4 列涂 1 列，分成 2 行涂 1 行：8 个小长方形中有 1 个涂了两次。",
  ),
  "unit-fraction-times-fraction-models": drawing(
    gridMarks(4, 3, 3, 1),
    "A square with 3 of 4 columns and 1 of 3 rows shaded: 3 of 12 small rectangles are shaded twice.",
    "正方形 4 列中涂 3 列，3 行中涂 1 行：12 个小长方形中有 3 个涂了两次。",
  ),
  "fraction-times-fraction-models": drawing(
    gridMarks(5, 3, 2, 2),
    "A grid of 5 by 3, 15 small rectangles, with 2 of 5 columns and 2 of 3 rows shaded: 4 are shaded twice.",
    "5 × 3 的方格共 15 个小长方形，5 列中涂 2 列，3 行中涂 2 行：4 个涂了两次。",
  ),
  "counting-tiles-in-a-fractional-rectangle": drawing(
    gridMarks(4, 3, 3, 2),
    "A unit square of 12 tiles, with a 2/3 by 3/4 rectangle shaded twice: 2 × 3 = 6 tiles.",
    "12 块小砖组成的单位正方形，2/3 × 3/4 的长方形涂了两次：2 × 3 = 6 块。",
  ),
  "naming-polygons-from-figures": drawing(
    [shape(regular(6, 2, [0, 0])), ...regular(6, 2, [0, 0]).map((p): Mark => ({ kind: "dot", at: p }))],
    "A figure with 6 straight sides: a hexagon.",
    "有 6 条直边的图形：六边形。",
  ),
  "perimeters-of-special-quadrilaterals": drawing(
    [
      shape([
        [0, 0],
        [7, 0],
        [10.5, 6],
        [3.5, 6],
      ]),
      note([3.5, 0], "7 cm", "s"),
      { kind: "ticks", a: [0, 0], b: [7, 0], count: 1 },
      { kind: "ticks", a: [7, 0], b: [10.5, 6], count: 1 },
      { kind: "ticks", a: [10.5, 6], b: [3.5, 6], count: 1 },
      { kind: "ticks", a: [3.5, 6], b: [0, 0], count: 1 },
    ],
    "A rhombus with one side 7 cm: all four sides are equal, so the perimeter is 28 cm.",
    "一边 7 cm 的菱形：四条边相等，所以周长是 28 cm。",
  ),
  "adding-decimal-side-lengths": drawing(
    [
      shape([
        [0, 0],
        [5.1, 0],
        [4.4, 2.6],
        [0.6, 3.2],
      ]),
      note([2.5, 0], "5.1", "s"),
      note([4.75, 1.3], "2.75", "e"),
      note([2.5, 2.9], "4", "n"),
      note([0.3, 1.6], "3.2", "w"),
    ],
    "A quadrilateral with sides 3.2, 4, 2.75 and 5.1 cm.",
    "边长 3.2、4、2.75、5.1 cm 的四边形。",
  ),
  "naming-from-a-description": drawing(
    [
      box(0, 0, 6, 4),
      note([3, 0], "6", "s"),
      note([6, 2], "4", "e"),
      note([3, 4], "6", "n"),
      note([0, 2], "4", "w"),
      square([0, 0], [1, 0], [0, 1]),
      square([6, 0], [5, 0], [6, 1]),
      square([6, 4], [5, 4], [6, 3]),
      square([0, 4], [1, 4], [0, 3]),
    ],
    "A quadrilateral with sides 6, 4, 6, 4 and four right angles: a rectangle.",
    "边长 6、4、6、4 且有四个直角的四边形：长方形。",
  ),
} satisfies Record<string, Figure>;
