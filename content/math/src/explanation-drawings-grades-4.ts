// Drawings in more explanations of grades 6 and 7: each shows the explanation's own
// numbers, or an example with numbers of its own when the explanation has none.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { ln, prismMarks, pt, pyramidOn, rect, shift, view } from "./explanation-drawings-geometry-2.ts";
import { clock, fill, hop, poly, side, spot, text } from "./explanation-drawings-grades-2.ts";
import {
  arrows,
  between,
  boxPlot,
  dash,
  edge,
  histogram,
  outline,
  ray,
  rays,
  realLine,
  stacks,
  ticks,
  triPrism,
} from "./explanation-drawings-grades-3.ts";
import {
  angle,
  cylinderMarks,
  drawing,
  ellipse,
  fromAngles,
  graphed,
  name,
  note,
  on,
  pair,
  ring,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

/** row is a row of n equal boxes at height y, with the boxes from shadedFrom on shaded. */
const row = (y: number, n: number, shadedFrom = n, tone: "action" | "result" = "action"): Mark[] =>
  Array.from({ length: n }, (_, i): Mark[] => [...(i >= shadedFrom ? [fill(i, y, 1, 1, tone)] : []), rect(i, y, 1, 1)]).flat();

/** frame shades a border between an outer and an inner rectangle. */
const frame = (w: number, h: number, b: number, tone: "action" | "result" = "result"): Mark[] => [
  {
    kind: "shade",
    points: [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ],
    holes: [
      [
        [b, b],
        [w - b, b],
        [w - b, h - b],
        [b, h - b],
      ],
    ],
    tone,
  },
  rect(0, 0, w, h),
  rect(b, b, w - 2 * b, h - 2 * b),
];

const sumOfHeights = [4, 9, 12, 5];
const skewed = [1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7];
const plotData = [1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 6, 7];

// A parallelogram with sides 10 and 8 and height 6 onto the side 10.
const slant = Math.acos(Math.sqrt(1 - 0.75 * 0.75));
const pgD: Point = [8 * Math.cos(slant), 6];
const pgFoot: Point = [10 * Math.cos(slant) * Math.cos(slant), 10 * Math.cos(slant) * Math.sin(slant)];

// A parallelogram with sides 8 and 6 and height 4.5 onto the side 8.
const slant2 = Math.asin(0.75);
const qD: Point = [6 * Math.cos(slant2), 4.5];
const qFoot: Point = [8 * Math.cos(slant2) * Math.cos(slant2), 8 * Math.cos(slant2) * Math.sin(slant2)];

// Points at distance 7.5 from both ends of a segment of length 6, and at distances 7.5 and 8 from them.
const conP: Point = [0, Math.sqrt(7.5 * 7.5 - 9)];
const conQx = (7.5 * 7.5 - 8 * 8) / 12;
const conQ: Point = [conQx, Math.sqrt(7.5 * 7.5 - (conQx + 3) * (conQx + 3))];

const heightPanel = (x: number, base: "BC" | "CA" | "AB"): Mark[] => {
  const A: Point = [1.2, 3];
  const B: Point = [0, 0];
  const C: Point = [4, 0];
  const foot = (p: Point, a: Point, b: Point): Point => {
    const t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  };
  const [v, a, b] = base === "BC" ? [A, B, C] : base === "CA" ? [B, C, A] : [C, A, B];
  const f = foot(v, a, b);
  return shift(
    [
      poly(A, B, C),
      seg(a, b, "accent"),
      seg(v, f, "result"),
      square(f, v, a),
      name(A, "A", "n"),
      name(B, "B", "sw"),
      name(C, "C", "se"),
      text([2, 0], `onto ${base}`, "s"),
    ],
    x,
  );
};

const cylinderCut = (x: number): Mark[] =>
  shift(
    [
      ...cylinderMarks(1.3, 3),
      {
        kind: "shade",
        points: [
          [-1.3, 0],
          [1.3, 0],
          [1.3, 3],
          [-1.3, 3],
        ],
        tone: "result",
      },
      seg([-1.3, 0], [1.3, 0], "result"),
      seg([-1.3, 3], [1.3, 3], "result"),
    ],
    x,
  );

/** gradeDrawings4 are drawings in further explanations of grades 6 and 7, by topic and knowledge point. */
export const gradeDrawings4: Readonly<Record<string, Figure>> = {
  "graphing-ratios#the-height-at-one": graphed(
    view(-1, 7, 1, -1, 8),
    [ln([0, 0], [4, 6]), edge([1, 0], [1, 1.5], undefined, true), pt([4, 6], "(4, 6)", "e"), pt([1, 1.5], "(1, 1.5)", "e", "result")],
    "For example, a line through the origin and (4, 6): 6 ÷ 4 = 1.5, so the height at x = 1 is 1.5.",
    "例如，过原点和 (4, 6) 的直线：6 ÷ 4 = 1.5，所以 x = 1 处的高度是 1.5。",
  ),
  "tape-diagrams#giving-away-to-make-two-amounts-equal": drawing(
    [
      text([0, 2.1], "A", "w"),
      ...shift(row(0, 7, 5), 0, 1.6),
      text([0, 0.5], "B", "w"),
      ...row(0, 3),
      fill(3, 0, 2, 1, "result"),
      dash([3, 0], [5, 0]),
      dash([3, 1], [5, 1]),
      dash([4, 0], [4, 1]),
      dash([5, 0], [5, 1]),
    ],
    "For example, A has 7 boxes and B has 3, a difference of 4. Moving the 2 shaded boxes, half of the difference, gives 5 and 5.",
    "例如，A 有 7 格，B 有 3 格，相差 4 格。移动涂色的 2 格（差的一半）后，两者都是 5 格。",
  ),
  "interpreting-absolute-value#numbers-at-a-given-distance": drawing(
    [...realLine(-6, 2), spot(4, "action"), spot(1), spot(7), ...hop(4, 1, "3"), ...hop(4, 7, "3")],
    "For example, the numbers at distance 3 from −2: moving left gives −5 and moving right gives 1.",
    "例如，与 −2 相距 3 的数：向左得 −5，向右得 1。",
  ),
  "identifying-rational-numbers-on-a-number-line#the-number-halfway-between-two-rationals": drawing(
    [...realLine(-4, 6), spot(1, "action"), spot(9, "action"), spot(5), ...hop(1, 5, "4"), ...hop(5, 9, "4")],
    "For example, halfway between −3 and 5 is 1: the distance 8 splits into 4 and 4, and (−3 + 5) ÷ 2 = 1.",
    "例如，−3 和 5 的正中间是 1：距离 8 分成 4 和 4，且 (−3 + 5) ÷ 2 = 1。",
  ),
  "reflections-of-points-in-the-coordinate-plane#the-distance-from-a-point-to-its-reflection": graphed(
    view(-2, 6, 1, -4, 4),
    [
      edge([3, 2], [3, -2], undefined, true),
      pt([3, 2], "(3, 2)", "e"),
      pt([3, -2], "(3, −2)", "e", "result"),
      tag([3, 1], "2", "w"),
      tag([3, -1], "2", "w"),
    ],
    "For example, (3, 2) reflected across the x-axis is (3, −2): each is 2 from the axis, so they are 4 apart.",
    "例如，(3, 2) 关于 x 轴的对称点是 (3, −2)：两点各距 x 轴 2，所以相距 4。",
  ),
  "solving-problems-in-the-coordinate-plane#the-area-from-opposite-corners": graphed(
    view(-1, 7, 1, -1, 6),
    [
      ...outline([
        [1, 1],
        [5, 1],
        [5, 4],
        [1, 4],
      ]),
      pt([1, 1], "(1, 1)", "sw"),
      pt([5, 4], "(5, 4)", "ne"),
      tag([3, 1], "4", "s"),
      tag([5, 2.5], "3", "e"),
    ],
    "For example, opposite corners (1, 1) and (5, 4): the width is 5 − 1 = 4 and the height is 4 − 1 = 3.",
    "例如，对角顶点 (1, 1) 和 (5, 4)：宽是 5 − 1 = 4，高是 4 − 1 = 3。",
  ),
  "evaluating-algebraic-expressions#expressions-with-two-variables": drawing(
    [
      poly([0, 0], [10, 0], [3, 7]),
      dash([3, 7], [3, 0]),
      square([3, 0], [3, 7], [10, 0]),
      side([0, 0], [10, 0], "b = 10"),
      note([3, 3.5], "h = 7", "e"),
      note([5, 2], "A = 35", "e"),
    ],
    "A triangle with b = 10 and h = 7, of area 35.",
    "b = 10、h = 7 的三角形，面积是 35。",
  ),
  "simplifying-linear-expressions#a-perimeter-as-an-expression": drawing(
    [rect(0, 0, 6, 3), side([0, 0], [6, 0], "x + 2"), side([6, 3], [0, 3], "x + 2"), side([6, 0], [6, 3], "3"), side([0, 3], [0, 0], "3")],
    "For example, a rectangle with sides x + 2 and 3, and sides of the same name equal: the perimeter is 2(x + 2 + 3) = 2x + 10.",
    "例如，边长为 x + 2 和 3 的长方形，同名的边相等：周长是 2(x + 2 + 3) = 2x + 10。",
  ),
  "representing-inequalities-on-number-lines#whole-numbers-on-the-graph": drawing(
    [...realLine(0, 8), ...ray(0, 8, 2, false, 6), spot(6)],
    "For example, an open circle at 2 and a filled circle at 6: the whole numbers in the graph are 3, 4, 5 and 6, four in all.",
    "例如，2 处是空心圆、6 处是实心圆：图中的整数是 3、4、5、6，共 4 个。",
  ),
  "analyzing-two-variable-equations-using-graphs#the-point-on-the-graph": graphed(
    view(-1, 6, 1, -1, 8),
    [curveOf((x) => 2 * x + 1), pt([2, 5], "(2, 5)", "w", "result"), pt([4, 5], "(4, 5)", "e", "action")],
    "For example, y = 2x + 1: (2, 5) lies on the line because 2 · 2 + 1 = 5, and (4, 5) does not because 2 · 4 + 1 = 9.",
    "例如，y = 2x + 1：(2, 5) 在直线上，因为 2 · 2 + 1 = 5；(4, 5) 不在，因为 2 · 4 + 1 = 9。",
  ),
  "areas-of-rectangles#missing-side-length": drawing(
    [rect(0, 0, 6, 5), side([0, 0], [6, 0], "3 m"), side([6, 0], [6, 5], "2½ m"), note([3, 2.5], "7½ m²", "n")],
    "A rectangle of area 7½ m² and length 3 m: the width is 2½ m.",
    "面积 7½ m²、长 3 m 的长方形：宽是 2½ m。",
  ),
  "areas-of-rectangles#a-path-around-a-rectangle": drawing(
    [
      ...frame(8, 6, 1),
      side([0, 0], [8, 0], "8"),
      side([8, 0], [8, 6], "6"),
      side([1, 5], [7, 5], "6"),
      side([1, 1], [1, 5], "4"),
      note([4, 5.5], "1", "e"),
    ],
    "For example, a path of width 1 around a 6 by 4 rectangle makes an 8 by 6 rectangle: the path's area is 48 − 24 = 24.",
    "例如，6 × 4 的长方形外围宽 1 的小路，组成 8 × 6 的长方形：小路的面积是 48 − 24 = 24。",
  ),
  "areas-of-right-triangles#the-height-onto-the-longest-side": drawing(
    [
      poly([0, 0], [5, 0], [1.8, 2.4]),
      seg([1.8, 2.4], [1.8, 0], "result", true),
      square([1.8, 0], [1.8, 2.4], [5, 0]),
      square([1.8, 2.4], [0, 0], [5, 0]),
      side([0, 0], [5, 0], "5"),
      side([1.8, 2.4], [0, 0], "3"),
      side([5, 0], [1.8, 2.4], "4"),
      note([1.8, 1.2], "2.4", "e"),
    ],
    "For example, a right triangle with sides 3, 4 and 5: 3 · 4 = 5 · h gives the height h = 2.4 onto the longest side.",
    "例如，边长 3、4、5 的直角三角形：由 3 · 4 = 5 · h 得到最长边上的高 h = 2.4。",
  ),
  "areas-of-triangles#the-height-from-the-area": drawing(
    [
      poly([0, 0], [8, 0], [3, 6]),
      dash([3, 6], [3, 0]),
      square([3, 0], [3, 6], [8, 0]),
      side([0, 0], [8, 0], "8"),
      note([3, 3], "?", "e"),
      note([5, 1.2], "A = 24", "n"),
    ],
    "For example, a triangle of area 24 and base 8: the height is 2 · 24 ÷ 8 = 6.",
    "例如，面积 24、底 8 的三角形：高是 2 · 24 ÷ 8 = 6。",
  ),
  "areas-and-perimeters-of-parallelograms#the-second-height-of-a-parallelogram": drawing(
    [
      poly([0, 0], [10, 0], [10 + pgD[0], 6], pgD),
      seg(pgD, [pgD[0], 0], "accent", true),
      seg([10, 0], pgFoot, "result", true),
      square([pgD[0], 0], pgD, [10, 0]),
      square(pgFoot, [10, 0], pgD),
      side([0, 0], [10, 0], "10"),
      side(pgD, [0, 0], "8"),
      note([pgD[0], 2.2], "6", "w"),
      note([(10 + pgFoot[0]) / 2, pgFoot[1] / 2], "7.5", "ne"),
    ],
    "For example, sides 10 and 8 with height 6 onto the side 10: the area is 60, so the height onto the side 8 is 60 ÷ 8 = 7.5.",
    "例如，边长 10 和 8，边 10 上的高是 6：面积是 60，所以边 8 上的高是 60 ÷ 8 = 7.5。",
  ),
  "finding-areas-of-polygons-using-decomposition#the-area-of-a-border": drawing(
    [
      ...frame(10, 8, 1, "action"),
      side([0, 0], [10, 0], "10"),
      side([10, 0], [10, 8], "8"),
      side([1, 7], [9, 7], "8"),
      side([1, 1], [1, 7], "6"),
      note([5, 7.5], "1", "e"),
    ],
    "For example, a border of width 1 in a 10 by 8 rectangle: the inner rectangle is 8 by 6, each side 2 shorter, and the border's area is 80 − 48 = 32.",
    "例如，10 × 8 的长方形中宽 1 的边框：内部长方形是 8 × 6，每边短 2，边框的面积是 80 − 48 = 32。",
  ),
  "lines-of-symmetry#sides-from-the-lines-of-symmetry": drawing(
    [
      poly(...Array.from({ length: 6 }, (_, i) => on(90 + i * 60, 3))),
      ...Array.from({ length: 6 }, (_, i) => seg(on(90 + i * 30, 3.5), on(270 + i * 30, 3.5), "accent", true)),
    ],
    "For example, a regular polygon with 6 lines of symmetry has 6 sides.",
    "例如，有 6 条对称轴的正多边形有 6 条边。",
  ),
  "faces-vertices-and-edges-of-polyhedrons#finding-the-base": drawing(
    [...prismMarks(8, 2, 3), text([0, -1], "24 edges", "s"), ...shift([...pyramidOn(8, 2, 3), text([0, -1], "9 faces", "s")], 6)],
    "An octagonal prism, which has 3 · 8 = 24 edges, and an octagonal pyramid, which has 8 + 1 = 9 faces.",
    "八棱柱有 3 · 8 = 24 条棱，八棱锥有 8 + 1 = 9 个面。",
  ),
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems#water-still-needed": drawing(
    (() => {
      const [dx, dy] = [1.5, 1];
      return [
        rect(0, 0, 5, 4),
        seg([0, 4], [dx, 4 + dy]),
        seg([5, 4], [5 + dx, 4 + dy]),
        seg([dx, 4 + dy], [5 + dx, 4 + dy]),
        seg([5, 0], [5 + dx, dy]),
        seg([5 + dx, dy], [5 + dx, 4 + dy]),
        seg([0, 2], [5, 2], "accent"),
        seg([5, 2], [5 + dx, 2 + dy], "accent"),
        fill(0, 2, 5, 2, "result"),
        side([0, 0], [5, 0], "5"),
        side([5, 0], [5 + dx, dy], "3"),
        note([0, 3], "1½", "w"),
        note([0, 1], "2½", "w"),
      ];
    })(),
    "For example, a tank 5 by 3 by 4 holding water to a height of 2½: the empty part, shaded on top, is a prism 5 by 3 by 1½.",
    "例如，5 × 3 × 4 的水箱，水深 2½：上方涂色的空余部分是 5 × 3 × 1½ 的长方体。",
  ),
  "distances-between-points-in-the-coordinate-plane#a-point-and-its-reflection": graphed(
    view(-6, 6, 2, -2, 6),
    [
      edge([-4, 3], [4, 3], undefined, true),
      pt([-4, 3], "(−4, 3)", "n"),
      pt([4, 3], "(4, 3)", "n", "result"),
      tag([-2, 3], "4", "s"),
      tag([2, 3], "4", "s"),
    ],
    "For example, (−4, 3) and its reflection (4, 3) in the y-axis: each is 4 from the axis, so they are 8 apart.",
    "例如，(−4, 3) 和它关于 y 轴的对称点 (4, 3)：各距 y 轴 4，所以相距 8。",
  ),
  "polygons-in-the-coordinate-plane#the-fourth-vertex-of-a-rectangle": graphed(
    view(-1, 7, 1, -1, 5),
    [
      ...outline([
        [1, 1],
        [5, 1],
        [5, 3],
        [1, 3],
      ]),
      pt([1, 1], "(1, 1)", "sw"),
      pt([5, 1], "(5, 1)", "se"),
      pt([5, 3], "(5, 3)", "ne"),
      pt([1, 3], "(1, 3)", "nw", "result"),
    ],
    "For example, vertices (1, 1), (5, 1) and (5, 3): the fourth, (1, 3), shares its first coordinate with (1, 1) and its second with (5, 3).",
    "例如，顶点 (1, 1)、(5, 1)、(5, 3)：第四个顶点 (1, 3) 的第一个坐标同 (1, 1)，第二个坐标同 (5, 3)。",
  ),
  "finding-areas-and-perimeters-in-the-coordinate-plane#a-missing-corner-from-the-area": graphed(
    view(-1, 7, 1, -1, 7),
    [
      ...outline([
        [1, 2],
        [5, 2],
        [5, 5],
        [1, 5],
      ]),
      pt([1, 2], "(1, 2)", "sw"),
      pt([5, 2], "(5, 2)", "se"),
      pt([1, 5], "(1, 5)", "nw", "result"),
      pt([5, 5], "(5, 5)", "ne", "result"),
      tag([3, 3.5], "12"),
      tag([3, 2], "4", "s"),
      tag([5, 3.5], "3", "e"),
    ],
    "For example, corners (1, 2) and (5, 2) with area 12: the width is 4, the height is 12 ÷ 4 = 3, and the other corners are 3 higher.",
    "例如，顶点 (1, 2) 和 (5, 2)，面积 12：宽是 4，高是 12 ÷ 4 = 3，另两个顶点高 3。",
  ),
  "mean-absolute-deviation#the-mad-after-changing-every-value": drawing(
    [
      ...shift(stacks([2, 3, 4], 0, 9), 0, 6),
      text([9.5, 6.4], "2, 3, 4: MAD ⅔", "e"),
      ...shift(stacks([5, 6, 7], 0, 9), 0, 3),
      text([9.5, 3.4], "add 3: MAD ⅔", "e"),
      ...stacks([4, 6, 8], 0, 9),
      text([9.5, 0.4], "times 2: MAD 4⁄3", "e"),
    ],
    "For example, the values 2, 3, 4 have MAD 2/3. Adding 3 gives 5, 6, 7 with the same MAD; multiplying by 2 gives 4, 6, 8 with MAD 4/3.",
    "例如，2、3、4 的 MAD 是 2/3。都加 3 得 5、6、7，MAD 不变；都乘 2 得 4、6、8，MAD 是 4/3。",
  ),
  "dot-plots#the-median-from-a-dot-plot": drawing(
    stacks(plotData, 0, 8, { 6: "result" }),
    "The dot plot with 13 dots: 1 at 1, 2 at 2, 4 at 3, 2 at 4, 1 at 5, 2 at 6 and 1 at 7. The 7th dot from the left, the top one at 3, is the median.",
    "共 13 个点的点图：1 处 1 个，2 处 2 个，3 处 4 个，4 处 2 个，5 处 1 个，6 处 2 个，7 处 1 个。从左数第 7 个点，即 3 处最上面的点，是中位数。",
  ),
  "dot-plots#the-fraction-of-the-dots": drawing(
    stacks(plotData, 0, 8, { 9: "result", 10: "result", 11: "result", 12: "result" }),
    "For example, in a dot plot with 13 dots, the 4 dots at 5 or more make up 4/13 of the data.",
    "例如，在共 13 个点的点图中，5 及以上的 4 个点占数据的 4/13。",
  ),
  "box-plots#quarters-of-the-data": drawing(
    [
      ...realLine(0, 20, 2, 0, 0.5),
      ...boxPlot([2, 6, 9, 12, 18], 0, 1.2, 0.5),
      note([2, 1.3], "25%", "n"),
      note([3.75, 1.7], "25%", "n"),
      note([5.25, 1.7], "25%", "n"),
      note([7.5, 1.3], "25%", "n"),
    ],
    "The box plot with minimum 2, Q1 6, median 9, Q3 12 and maximum 18: each of the four parts holds about 25% of the data, however wide it looks.",
    "最小值 2、Q1 为 6、中位数 9、Q3 为 12、最大值 18 的箱线图：四部分各约占数据的 25%，与看上去的宽窄无关。",
  ),
  "box-plots#how-many-values-from-the-quarters": drawing(
    [
      ...realLine(0, 16, 2, 0, 0.6),
      ...boxPlot([1, 4, 7, 9, 15], 0, 1.2, 0.6),
      note([1.5, 1.3], "5", "n"),
      note([3.3, 1.7], "5", "n"),
      note([4.8, 1.7], "5", "n"),
      note([7.2, 1.3], "5", "n"),
    ],
    "For example, a box plot of 20 values: each of the four parts holds about 20 ÷ 4 = 5 values, the wide ones as well as the narrow ones.",
    "例如，20 个数据的箱线图：四部分各约有 20 ÷ 4 = 5 个数据，宽的和窄的都一样。",
  ),
  "measuring-centrality-from-dot-plots#the-mode-from-a-dot-plot": drawing(
    stacks([1, 1, 2, 2, 2, 3, 3, 3, 3, 6], 0, 7, { 5: "result", 6: "result", 7: "result", 8: "result" }),
    "The dot plot with 2 dots at 1, 3 at 2, 4 at 3 and 1 at 6: the tallest stack, of 4 dots, is at 3, so the mode is 3.",
    "1 处 2 个点、2 处 3 个、3 处 4 个、6 处 1 个的点图：最高的一堆有 4 个点，在 3 处，所以众数是 3。",
  ),
  "symmetry-skew-and-outliers#skew-and-the-mean-and-median": drawing(
    [
      ...stacks(skewed, 0, 8),
      seg([3, 0], [3, 3.2], "result"),
      note([3, 3.2], "median 3", "nw"),
      seg([59 / 18, 0], [59 / 18, 2.6], "action"),
      note([59 / 18, 2.6], "mean ≈ 3.3", "ne"),
    ],
    "The dot plot with 2 dots at 1, 5 at 2, 4 at 3, 3 at 4, 2 at 5, 1 at 6 and 1 at 7. The median is 3, and the mean, about 3.3, lies to its right, toward the tail.",
    "1 处 2 个点、2 处 5 个、3 处 4 个、4 处 3 个、5 处 2 个、6 处 1 个、7 处 1 个的点图。中位数是 3，平均数约 3.3，在它右边，靠近尾部。",
  ),
  "symmetry-skew-and-outliers#an-outlier-in-a-dot-plot": drawing(
    [...stacks([3, 3, 4, 4, 4, 5, 5, 6, 6, 14], 2, 15, { 9: "action" }, 2), dash([7, 0], [7, 2]), note([7, 2], "Q3 + 1.5 × IQR = 9", "n")],
    "For example, the values 3, 3, 4, 4, 4, 5, 5, 6, 6, 14: Q1 = 4 and Q3 = 6, so the IQR is 2 and Q3 + 1.5 × IQR = 9. The dot at 14 lies beyond 9 and is an outlier.",
    "例如，3、3、4、4、4、5、5、6、6、14：Q1 = 4，Q3 = 6，IQR 是 2，Q3 + 1.5 × IQR = 9。14 处的点超过 9，是离群值。",
  ),

  // Grade 7
  "understanding-proportional-relationships-using-graphs#meaning-of-a-point-on-the-graph": drawing(
    (() => {
      const k = 0.15;
      const x = 1;
      return [
        seg([0, 0], [6, 0]),
        seg([0, 0], [0, 6]),
        ...[1, 2, 3, 4, 5].map((v) => text([v * x, 0], String(v), "s")),
        ...[10, 20, 30].map((v) => text([0, v * k], String(v), "w")),
        ...[10, 20, 30].map((v) => seg([-0.08, v * k], [0.08, v * k])),
        ...[1, 2, 3, 4, 5].map((v) => seg([v, -0.08], [v, 0.08])),
        seg([0, 0], [5.4, 40.5 * k]),
        { kind: "dot", at: [1, 7.5 * k], tone: "result" } as Mark,
        note([1, 7.5 * k], "(1, 7.5)", "se"),
        { kind: "dot", at: [4, 30 * k] } as Mark,
        note([4, 30 * k], "(4, 30)", "w"),
        text([6, 0], "tickets", "e"),
        text([0, 6], "$", "n"),
      ];
    })(),
    "The graph of the cost of tickets, through (4, 30) and (1, 7.5): one ticket costs $7.50.",
    "门票费用的图像，经过 (4, 30) 和 (1, 7.5)：一张门票 7.50 美元。",
  ),
  "subtracting-a-positive-number-from-a-negative-number#the-number-subtracted-from-a-negative-number": drawing(
    [...realLine(-9, 1), spot(6, "action"), spot(1), ...hop(6, 1, "?")],
    "For example, −3 − ? = −8: the move left from −3 to −8 is 8 − 3 = 5, the difference of the sizes.",
    "例如，−3 − ? = −8：从 −3 向左到 −8 移动了 8 − 3 = 5，是两数大小之差。",
  ),
  "systems-of-linear-equations#solving-by-graphing": graphed(
    view(-2, 5, 1, -2, 5),
    [curveOf((x) => x + 1), curveOf((x) => -x + 3, "action"), pt([1, 2], "(1, 2)", "e", "result")],
    "For example, the lines y = x + 1 and y = −x + 3 meet at (1, 2), the solution of the system.",
    "例如，直线 y = x + 1 和 y = −x + 3 相交于 (1, 2)，这就是方程组的解。",
  ),
  "inequalities-and-solutions#writing-inequalities": drawing(
    [...realLine(-6, 4), ...ray(-6, 4, -3, true, 4.5)],
    "The graph of x ≥ −3: a filled circle at −3 and an arrow to the right.",
    "x ≥ −3 的图像：−3 处是实心圆，箭头向右。",
  ),
  "solving-multi-step-inequalities#the-extreme-integer-solution-of-an-inequality": drawing(
    [...realLine(0, 7), ...ray(0, 7, 2.5, false, 7.5), spot(3)],
    "For example, x > 2.5: looking right from the boundary 2.5, the least integer solution is 3.",
    "例如，x > 2.5：从边界 2.5 向右看，最小的整数解是 3。",
  ),
  "representing-solutions-to-inequalities-on-number-lines#the-first-whole-number-on-the-graph": drawing(
    [...realLine(-6, 2), ...ray(-6, 2, -2, false, -6.5), spot(3)],
    "For example, −2x > 4 gives x < −2: dividing by −2 turned the arrow to the left, and the first integer past the open circle is −3.",
    "例如，由 −2x > 4 得 x < −2：除以 −2 使箭头向左，越过空心圆的第一个整数是 −3。",
  ),
  "segment-bisectors-and-the-perpendicular-bisector-theorem#the-converse": drawing(
    [
      seg([-3, 0], [3, 0]),
      seg([0, -0.6], [0, 8], "accent", true),
      square([0, 0], [3, 0], [0, 3]),
      ticks([-3, 0], [0, 0]),
      ticks([0, 0], [3, 0]),
      seg([-3, 0], conP, "result"),
      seg([3, 0], conP, "result"),
      seg([-3, 0], conQ, "action"),
      seg([3, 0], conQ, "action"),
      name([-3, 0], "A", "w"),
      name([3, 0], "B", "e"),
      name(conP, "P", "ne"),
      name(conQ, "Q", "nw"),
    ],
    "P is 7.5 cm from both A and B, so it lies on the perpendicular bisector of AB. A point Q that is 7.5 cm from A and 8 cm from B lies off it.",
    "P 到 A 和 B 都是 7.5 cm，所以在 AB 的垂直平分线上。到 A 为 7.5 cm、到 B 为 8 cm 的点 Q 不在线上。",
  ),
  "congruent-angles#congruent-angles-with-algebra": drawing(
    [
      seg([0, 0], on(0, 3.2)),
      seg([0, 0], on(60, 3.2)),
      angle([0, 0], on(0, 3), on(60, 3), "accent", "(3x + 12)°"),
      name([0, 0], "P", "sw"),
      ...shift(
        [
          seg([0, 0], on(0, 3.2)),
          seg([0, 0], on(60, 3.2)),
          angle([0, 0], on(0, 3), on(60, 3), "accent", "(5x − 20)°"),
          name([0, 0], "Q", "sw"),
        ],
        5.5,
      ),
    ],
    "Two congruent angles, (3x + 12)° and (5x − 20)°: with x = 16 each measures 60°, and both are drawn at 60°.",
    "两个全等的角 (3x + 12)° 和 (5x − 20)°：x = 16 时都是 60°，图中都画成 60°。",
  ),
  "congruent-angles#the-whole-angle-from-its-bisector": drawing(
    [...rays(0, 35, 70), between(0, 35, "35°"), between(35, 70, "35°", "action")],
    "For example, a bisector cuts an angle into 35° and 35°, so the whole angle is 70°.",
    "例如，角平分线把一个角分成 35° 和 35°，所以整个角是 70°。",
  ),
  "vertical-angles#the-angles-around-a-crossing": drawing(
    [
      seg(on(0, 3.4), on(180, 3.4)),
      seg(on(50, 3.4), on(230, 3.4)),
      angle([0, 0], on(0, 3), on(50, 3), "accent", "50°"),
      angle([0, 0], on(180, 3), on(230, 3), "accent", "50°"),
      angle([0, 0], on(50, 3), on(180, 3), "action", "130°"),
      angle([0, 0], on(230, 3), on(360, 3), "action", "130°"),
    ],
    "For example, a vertical pair that sums to 100° is 50° and 50°, and the other pair is 130° and 130°: all four total 360°.",
    "例如，一对对顶角之和是 100°，则各为 50°，另一对各为 130°：四个角合计 360°。",
  ),
  "complementary-angles#equations-for-complementary-angles": drawing(
    [
      ...rays(0, 40, 90),
      square([0, 0], on(0, 1), on(90, 1)),
      between(0, 40, "(2x + 10)°"),
      between(40, 90, "(3x + 5)°", "action"),
      name(on(0, 3.2), "", "e"),
    ],
    "Complementary angles (2x + 10)° and (3x + 5)° making a right angle: with x = 15 they are 40° and 50°, as drawn.",
    "互余的角 (2x + 10)° 和 (3x + 5)° 组成一个直角：x = 15 时是 40° 和 50°，图中就这样画。",
  ),
  "complementary-angles#an-angle-and-its-complement": drawing(
    [...rays(0, 72, 90), square([0, 0], on(0, 1), on(90, 1)), between(0, 72, "72°"), between(72, 90, "18°", "action")],
    "An angle of 72° and its complement of 18°: the angle is 4 times its complement.",
    "72° 的角和它的余角 18°：这个角是余角的 4 倍。",
  ),
  "supplementary-angles#equations-for-supplementary-angles": drawing(
    [seg(on(0, 3.4), on(180, 3.4)), seg([0, 0], on(114, 3.4)), between(114, 180, "(2x + 6)°", "action"), between(0, 114, "(4x − 6)°")],
    "Supplementary angles on a line: with x = 30, (4x − 6)° is 114° and (2x + 6)° is 66°, as drawn.",
    "直线上互补的角：x = 30 时，(4x − 6)° 是 114°，(2x + 6)° 是 66°，图中就这样画。",
  ),
  "supplementary-angles#an-angle-and-its-supplement": drawing(
    [seg(on(0, 3.4), on(180, 3.4)), seg([0, 0], on(135, 3.4)), between(0, 135, "135°"), between(135, 180, "45°", "action")],
    "An angle of 135° and its supplement of 45°: the angle is 3 times its supplement.",
    "135° 的角和它的补角 45°：这个角是补角的 3 倍。",
  ),
  "angle-bisectors#bisectors-with-algebra": drawing(
    [
      ...rays(0, 25, 50),
      between(0, 25, "(4x − 15)°", "action"),
      between(25, 50, "(2x + 5)°"),
      name(on(50, 3.2), "A", "n"),
      name([0, 0], "B", "sw"),
      name(on(25, 3.2), "D", "e"),
      name(on(0, 3.2), "C", "e"),
    ],
    "BD bisects angle ABC: with x = 10, both (2x + 5)° and (4x − 15)° are 25°, as drawn.",
    "BD 平分角 ABC：x = 10 时，(2x + 5)° 和 (4x − 15)° 都是 25°，图中就这样画。",
  ),
  "angle-bisectors#the-angle-between-two-bisectors": drawing(
    [
      seg(on(0, 3.4), on(180, 3.4)),
      seg([0, 0], on(80, 3.4)),
      seg([0, 0], on(40, 3.2), "result"),
      seg([0, 0], on(130, 3.2), "result"),
      angle([0, 0], on(0, 3), on(40, 3), "accent", "40°"),
      angle([0, 0], on(40, 3), on(80, 3), "accent", "40°"),
      angle([0, 0], on(80, 3), on(130, 3), "action", "50°"),
      angle([0, 0], on(130, 3), on(180, 3), "action", "50°"),
      square([0, 0], on(40, 0.5), on(130, 0.5)),
    ],
    "For example, angles of 80° and 100° on a straight line, each bisected: the bisectors make 40° + 50° = 90°, a right angle.",
    "例如，直线上 80° 和 100° 的角分别被平分：两条平分线夹成 40° + 50° = 90°，是直角。",
  ),
  "solving-problems-with-angles#clock-angles-between-the-hours": drawing(
    [...clock(3, 20), angle([0, 0], on(90 - 120, 1), on(90 - 100, 1), "result"), note(on(-20, 1.1), "20°", "e")],
    "For example, at 3:20 the minute hand is 120° from 12 and the hour hand is 3 · 30 + 20 · ½ = 100° from 12, so the angle between them is 20°.",
    "例如，3:20 时分针距 12 为 120°，时针距 12 为 3 · 30 + 20 · ½ = 100°，所以夹角是 20°。",
  ),
  "angles-of-a-triangle#triangle-angles-in-a-ratio": drawing(
    (() => {
      const [a, b, c] = fromAngles(40, 80, 6);
      return [poly(a, b, c), angle(a, b, c, "accent", "40°"), angle(b, c, a, "action", "80°"), angle(c, a, b, "result", "60°")];
    })(),
    "For example, angles in the ratio 2 : 3 : 4 are 9 equal parts of 180°, so one part is 20° and the angles are 40°, 60° and 80°.",
    "例如，比为 2 : 3 : 4 的三个角是 180° 的 9 等份，一份 20°，三个角是 40°、60° 和 80°。",
  ),
  "classifying-triangles#what-a-triangle-must-be": drawing(
    (() => {
      const [a, b, c] = fromAngles(60, 60, 5);
      return [
        poly(a, b, c),
        ticks(a, b),
        ticks(b, c),
        ticks(c, a),
        angle(a, b, c, "accent", "60°"),
        angle(b, c, a, "accent", "60°"),
        angle(c, a, b, "accent", "60°"),
      ];
    })(),
    "An equilateral triangle has three angles of 60°, so it can be neither right nor obtuse.",
    "等边三角形的三个角都是 60°，所以既不可能是直角三角形，也不可能是钝角三角形。",
  ),
  "heights-of-triangles#heights-for-each-base": drawing(
    [...heightPanel(0, "BC"), ...heightPanel(5.5, "CA"), ...heightPanel(11, "AB")],
    "One triangle ABC three times: the height onto BC from A, onto CA from B, and onto AB from C.",
    "同一个三角形 ABC 画三次：从 A 到 BC 的高、从 B 到 CA 的高、从 C 到 AB 的高。",
  ),
  "properties-of-trapezoids#angles-of-trapezoids": drawing(
    (() => {
      const dx = 2;
      const h = dx * Math.tan((70 * Math.PI) / 180);
      const A: Point = [0, 0];
      const B: Point = [8, 0];
      const C: Point = [8 - dx, h];
      const D: Point = [dx, h];
      return [
        poly(A, B, C, D),
        arrows([3.5, 0], [4.5, 0]),
        arrows([3.5, h], [4.5, h]),
        ticks(A, D),
        ticks(B, C),
        name(A, "A", "sw"),
        name(B, "B", "se"),
        name(C, "C", "ne"),
        name(D, "D", "nw"),
        angle(A, B, D, "accent", "70°"),
        angle(B, C, A, "accent", "70°"),
        angle(C, B, D, "action", "110°"),
        angle(D, C, A, "action", "110°"),
      ];
    })(),
    "An isosceles trapezoid with AB parallel to DC: the angles at A and B are 70°, those at C and D are 110°, and the angles at the ends of a leg add up to 180°.",
    "AB 平行于 DC 的等腰梯形：A、B 处的角是 70°，C、D 处的角是 110°，一腰两端的角之和是 180°。",
  ),
  "congruent-polygons#corresponding-parts": pair(
    {
      shape: fromAngles(55, 65),
      names: ["A", "B", "C", "R", "P", "Q"],
      ticks: [[1, 2]],
      corners: [[1, "accent"]],
    },
    "Triangles ABC and RPQ, with A matching R, B matching P and C matching Q: BC corresponds to PQ, and angle B to angle P.",
    "三角形 ABC 和 RPQ，A 对应 R，B 对应 P，C 对应 Q：BC 对应 PQ，角 B 对应角 P。",
  ),
  "congruent-polygons#measures-of-congruent-triangles": pair(
    {
      shape: fromAngles(50, 60),
      names: ["A", "B", "C", "F", "D", "E"],
      lengths: [[1, "9", "9"]],
      corners: [
        [0, "accent", "50°", "50°"],
        [1, "action", "60°", "60°"],
        [2, "result", "70°", "70°"],
      ],
    },
    "Triangles ABC and FDE: BC = DE = 9, and the angles 50°, 60° and 70° at A, B and C are the angles at F, D and E.",
    "三角形 ABC 和 FDE：BC = DE = 9，A、B、C 处的 50°、60°、70° 就是 F、D、E 处的角。",
  ),
  "congruent-polygons#congruent-polygons-with-algebra": pair(
    {
      shape: fromAngles(55, 65),
      lengths: [[0, "2x + 5", "4x − 3"]],
      ticks: [[0, 1]],
    },
    "Triangles ABC and DEF: AB = 2x + 5 corresponds to DE = 4x − 3, marked with one tick each, and they are equal at x = 4.",
    "三角形 ABC 和 DEF：AB = 2x + 5 对应 DE = 4x − 3，各画一条短线，x = 4 时相等。",
  ),
  "area-of-rectangles-and-squares#the-area-after-percent-changes-to-the-sides": drawing(
    [
      rect(0, 0, 5, 5),
      side([0, 0], [5, 0], "100"),
      side([5, 0], [5, 5], "100"),
      note([2.5, 2.5], "10 000", "n"),
      ...shift([rect(0, 0, 6, 4), side([0, 0], [6, 0], "120"), side([6, 0], [6, 4], "80"), note([3, 2], "9 600", "n")], 8),
    ],
    "For example, a 100 by 100 rectangle with its length raised 20% and its width lowered 20% becomes 120 by 80: 1.2 × 0.8 = 0.96, so the area falls 4%, not 0%.",
    "例如，100 × 100 的长方形，长增加 20%、宽减少 20%，变成 120 × 80：1.2 × 0.8 = 0.96，面积减少 4%，而不是不变。",
  ),
  "area-of-parallelograms#two-heights-of-one-parallelogram": drawing(
    [
      poly([0, 0], [8, 0], [8 + qD[0], 4.5], qD),
      seg(qD, [qD[0], 0], "accent", true),
      seg([8, 0], qFoot, "result", true),
      square([qD[0], 0], qD, [8, 0]),
      square(qFoot, [8, 0], qD),
      side([0, 0], [8, 0], "8"),
      side(qD, [0, 0], "6"),
      note([qD[0], 1.8], "4.5", "w"),
      note([(8 + qFoot[0]) / 2, qFoot[1] / 2], "6", "ne"),
    ],
    "For example, base 8 with height 4.5 and base 6 with height 6: both products are 36.",
    "例如，底 8、高 4.5 和底 6、高 6：两个乘积都是 36。",
  ),
  "area-of-trapezoids#a-missing-base-or-height": drawing(
    [
      poly([0, 0], [8, 0], [6.5, 6], [-0.5, 6]),
      dash([-0.5, 6], [-0.5, 0]),
      seg([-0.5, 0], [0, 0], undefined, true),
      side([0, 0], [8, 0], "8 cm"),
      side([6.5, 6], [-0.5, 6], "7 cm"),
      note([-0.5, 3], "6 cm", "w"),
      note([3.5, 3], "45 cm²", "n"),
    ],
    "A trapezoid of area 45 cm², height 6 cm and one base 7 cm: the other base, found from the area, is 8 cm.",
    "面积 45 cm²、高 6 cm、一底 7 cm 的梯形：由面积求出的另一底是 8 cm。",
  ),
  "area-of-trapezoids#the-missing-base-of-a-trapezoid": drawing(
    [
      poly([0, 0], [10, 0], [7.5, 5], [1.5, 5]),
      dash([1.5, 5], [1.5, 0]),
      side([0, 0], [10, 0], "?"),
      side([7.5, 5], [1.5, 5], "6"),
      note([1.5, 2.5], "5", "e"),
      note([5, 2.2], "A = 40", "n"),
    ],
    "For example, area 40, height 5 and one base 6: 2 · 40 ÷ 5 = 16 is the sum of the bases, so the other base is 10.",
    "例如，面积 40、高 5、一底 6：2 · 40 ÷ 5 = 16 是两底之和，所以另一底是 10。",
  ),
  "composite-shapes#area-of-composite-shapes": drawing(
    [
      fill(0, 0, 3, 5, "result"),
      fill(3, 0, 4, 2, "action"),
      poly([0, 0], [7, 0], [7, 2], [3, 2], [3, 5], [0, 5]),
      dash([3, 0], [3, 2]),
      side([0, 0], [3, 0], "3"),
      side([3, 0], [7, 0], "4"),
      side([7, 0], [7, 2], "2"),
      side([0, 5], [0, 0], "5"),
    ],
    "For example, an L-shape 7 wide, split into a 3 by 5 and a 4 by 2 rectangle: the full width 7 is 3 + 4, and the area is 15 + 8 = 23.",
    "例如，宽 7 的 L 形，分成 3 × 5 和 4 × 2 两个长方形：全宽 7 是 3 + 4，面积是 15 + 8 = 23。",
  ),
  "composite-shapes#perimeter-of-composite-shapes": drawing(
    [
      poly([0, 0], [12, 0], [12, 4], [7, 4], [7, 9], [0, 9]),
      side([0, 0], [12, 0], "12"),
      side([0, 9], [0, 0], "9"),
      dash([7, 9], [12, 9]),
      dash([12, 4], [12, 9]),
    ],
    "An L-shape 12 wide and 9 tall: moving the two sides of the notch out to the dashed lines shows that the perimeter is 2 · 12 + 2 · 9 = 42.",
    "宽 12、高 9 的 L 形：把缺口的两条边移到虚线处，可见周长是 2 · 12 + 2 · 9 = 42。",
  ),
  "composite-shapes#subtracting-a-hole": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [10, 0],
          [10, 6],
          [0, 6],
        ],
        holes: [
          [
            [3, 2],
            [7, 2],
            [7, 4],
            [3, 4],
          ],
        ],
        tone: "result",
      },
      rect(0, 0, 10, 6),
      rect(3, 2, 4, 2),
      side([0, 0], [10, 0], "10"),
      side([10, 0], [10, 6], "6"),
      note([5, 3], "4 × 2", "n"),
    ],
    "For example, a 10 by 6 rectangle with a 4 by 2 piece removed: the shaded area is 60 − 8 = 52.",
    "例如，10 × 6 的长方形去掉 4 × 2 的一块：涂色部分的面积是 60 − 8 = 52。",
  ),
  "calculating-perimeters-and-areas-of-scaled-shapes#actual-perimeters-and-areas": drawing(
    [
      rect(0, 0, 2.5, 2),
      side([0, 0], [2.5, 0], "5 cm"),
      side([2.5, 0], [2.5, 2], "4 cm"),
      note([1.25, 2], "drawing", "n"),
      ...shift(
        [
          rect(0, 0, 7.5, 6),
          side([0, 0], [7.5, 0], "15 m"),
          side([7.5, 0], [7.5, 6], "12 m"),
          note([3.75, 3], "180 m²", "n"),
          note([3.75, 6], "room", "n"),
        ],
        5,
      ),
    ],
    "A 5 cm by 4 cm drawing at 1 cm : 3 m, and the room it shows, 15 m by 12 m, three times as long each way, with area 180 m².",
    "比例尺 1 cm : 3 m 的 5 cm × 4 cm 图，以及它表示的 15 m × 12 m 的房间，每个方向都是 3 倍，面积 180 m²。",
  ),
  "relating-the-circumference-and-area-of-a-circle#area-from-circumference": drawing(
    [
      ring(5),
      seg([0, 0], [5, 0], "accent"),
      { kind: "dot", at: [0, 0] },
      note([2.5, 0], "r = 5 cm", "n"),
      note(on(45, 5), "C = 31.4 cm", "ne"),
      note([0, -2], "A = 78.5 cm²", "n"),
    ],
    "A circle with circumference 31.4 cm, radius 5 cm and area 78.5 cm².",
    "周长 31.4 cm、半径 5 cm、面积 78.5 cm² 的圆。",
  ),
  "relating-the-circumference-and-area-of-a-circle#circumference-from-area": drawing(
    [
      ring(6),
      seg([0, 0], [6, 0], "accent"),
      { kind: "dot", at: [0, 0] },
      note([3, 0], "r = 6 cm", "n"),
      note(on(45, 6), "C = 37.68 cm", "ne"),
      note([0, -2.5], "A = 113.04 cm²", "n"),
    ],
    "A circle with area 113.04 cm², radius 6 cm and circumference 37.68 cm.",
    "面积 113.04 cm²、半径 6 cm、周长 37.68 cm 的圆。",
  ),
  "volumes-of-triangular-prisms#missing-dimensions-from-volume": drawing(
    [
      ...triPrism([0, 0], [8, 0], [3, 5], 5, 3),
      seg([3, 5], [3, 0], "accent", true),
      side([0, 0], [8, 0], "8 cm"),
      note([3, 2.5], "5 cm", "e"),
      note([10.5, 1.5], "9 cm", "se"),
    ],
    "A triangular prism with volume 180 cm³: its triangle has base 8 cm and height 5 cm, so the base area is 20 cm² and the length is 9 cm.",
    "体积 180 cm³ 的三棱柱：底面三角形的底 8 cm、高 5 cm，所以底面积是 20 cm²，长是 9 cm。",
  ),
  "volumes-of-triangular-prisms#a-house-shaped-prism": drawing(
    (() => {
      const f: Point[] = [
        [0, 0],
        [4, 0],
        [4, 3],
        [2, 5],
        [0, 3],
      ];
      const up = (p: Point): Point => [p[0] + 3, p[1] + 2];
      return [
        { kind: "shade", points: f, tone: "result" } as Mark,
        poly(...f),
        dash([0, 3], [4, 3]),
        ...([1, 2, 3] as const).map((i) => seg(f[i] as Point, up(f[i] as Point))),
        seg(up(f[1] as Point), up(f[2] as Point)),
        seg(up(f[2] as Point), up(f[3] as Point)),
        side([0, 0], [4, 0], "4"),
        note([0, 1.5], "3", "w"),
        note([2, 4], "2", "s"),
        note([5.5, 1], "6", "se"),
      ];
    })(),
    "For example, a house shape made of a 4 by 3 rectangle and a triangle of base 4 and height 2: the base area is 12 + 4 = 16, and with length 6 the volume is 96.",
    "例如，由 4 × 3 的长方形和底 4、高 2 的三角形组成的房子形：底面积是 12 + 4 = 16，长 6 时体积是 96。",
  ),
  "surface-areas-of-combined-rectangular-prisms#painting-combined-prisms": drawing(
    (() => {
      const [dx, dy] = [0.45, 0.35];
      const boxAt = (x: number, y: number, l: number, w: number, h: number): Mark[] => {
        const d = (k: number): Point => [w * dx * k, w * dy * k];
        const p = (a: number, b: number, k: number): Point => [x + a + d(k)[0], y + b + d(k)[1]];
        return [
          poly(p(0, 0, 0), p(l, 0, 0), p(l, h, 0), p(0, h, 0)),
          seg(p(l, 0, 0), p(l, 0, 1)),
          seg(p(l, 0, 1), p(l, h, 1)),
          seg(p(l, h, 0), p(l, h, 1)),
          seg(p(0, h, 0), p(0, h, 1)),
          seg(p(0, h, 1), p(l, h, 1)),
        ];
      };
      return [
        ...boxAt(0, 0, 10, 6, 5),
        side([0, 0], [10, 0], "10"),
        side([10, 0], [12.7, 2.1], "6"),
        note([0, 2.5], "5", "w"),
        ...boxAt(3, 6, 4, 3, 2),
        note([5, 6], "4", "s"),
        note([3, 7], "2", "w"),
        note([7.7, 6.5], "3", "se"),
      ];
    })(),
    "A 4 by 3 by 2 box on a 10 by 6 by 5 box: the contact area 12 is not painted on either box, and the bottom, 10 by 6, is not painted, which gives 52 + 280 − 2 · 12 − 60 = 248.",
    "4 × 3 × 2 的盒子放在 10 × 6 × 5 的盒子上：接触面 12 在两个盒子上都不涂，底面 10 × 6 也不涂，所以 52 + 280 − 2 · 12 − 60 = 248。",
  ),
  "cross-sections-of-three-dimensional-shapes#naming-cross-sections": drawing(
    [
      ...cylinderMarks(1.3, 3),
      ...ellipse([0, 1.5], 1.3, 0.39, false, "result"),
      text([0, -0.5], "circle", "s"),
      ...cylinderCut(4),
      text([4, -0.5], "rectangle", "s"),
      ...shift(
        [
          ...pyramidOn(4, 1.6, 3),
          ...(() => {
            const k = 0.5;
            const p = Array.from(
              { length: 4 },
              (_, i): Point => [k * 1.6 * Math.cos(((i + 0.5) * Math.PI) / 2), 1.5 + k * 1.6 * 0.3 * Math.sin(((i + 0.5) * Math.PI) / 2)],
            );
            return p.map((a, i) => seg(a, p[(i + 1) % 4] as Point, "result"));
          })(),
          text([0, -0.9], "smaller square", "s"),
        ],
        8.3,
      ),
    ],
    "A cylinder cut parallel to its base gives a circle, cut straight down through its center it gives a rectangle, and a square pyramid cut parallel to its base gives a smaller square.",
    "圆柱平行于底面切开得到圆，竖直穿过中心切开得到长方形；正四棱锥平行于底面切开得到较小的正方形。",
  ),
  "cross-sections-of-three-dimensional-shapes#areas-of-cross-sections": drawing(
    [...cylinderCut(0), note([1.3, 1.5], "8 cm", "e"), note([0, 0], "r = 3 cm", "n"), note([0, -0.5], "6 × 8 = 48 cm²", "s")],
    "A cylinder of radius 3 cm and height 8 cm cut through its center: the shaded rectangle is 6 by 8, because its width is the diameter, with area 48 cm².",
    "半径 3 cm、高 8 cm 的圆柱穿过中心切开：涂色的长方形是 6 × 8，因为宽是直径，面积 48 cm²。",
  ),
  "calculating-modes-and-medians-from-histograms#the-share-of-the-modal-class": drawing(
    histogram([10, 20, 30, 40, 50], sumOfHeights, { 2: "result" }),
    "For example, bars of heights 4, 9, 12 and 5: the tallest bar, 12, is the modal class, and its share is 12 ÷ 30 = 2/5.",
    "例如，高度为 4、9、12、5 的条形：最高的 12 是众数组，所占份额是 12 ÷ 30 = 2/5。",
  ),
  "calculating-means-from-histograms#the-greatest-possible-total": drawing(
    histogram([0, 10, 20, 30], [4, 9, 7], {}),
    "For example, classes 0 to 10, 10 to 20 and 20 to 30 with heights 4, 9 and 7. Upper ends give at most 4 · 10 + 9 · 20 + 7 · 30 = 430, and midpoints estimate 4 · 5 + 9 · 15 + 7 · 25 = 330.",
    "例如，0–10、10–20、20–30 三组，高度为 4、9、7。用上端得到最多 4 · 10 + 9 · 20 + 7 · 30 = 430，用中点估计为 4 · 5 + 9 · 15 + 7 · 25 = 330。",
  ),
  "comparing-data-set-visualizations-using-standard-deviation-and-mad#the-greater-spread-on-dot-plots": drawing(
    [
      ...shift(stacks([9, 9, 9, 10, 10, 10, 10, 11, 11, 11], 4, 16, {}, 2), 0, 3.5),
      text([-0.5, 4], "A", "w"),
      ...stacks([4, 7, 10, 13, 16], 4, 16, {}, 2),
      text([-0.5, 0.4], "B", "w"),
    ],
    "A has tall stacks at 9, 10 and 11, and B has a few dots from 4 to 16: B's values lie farther from the mean, so B has the greater spread.",
    "A 在 9、10、11 处堆得很高，B 只有几个点，从 4 到 16：B 的数据离平均数更远，所以 B 的离散程度更大。",
  ),
};
