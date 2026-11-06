// Further drawings in the explanations of grades 6 to 8: tape diagrams, signed number lines, plotted points, areas, angles, solids and data displays.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { ln, pt, rect, shift, view } from "./explanation-drawings-geometry-2.ts";
import { fill, gridRect, hop, line, poly, regular, side, spot, text } from "./explanation-drawings-grades-2.ts";
import {
  angle,
  bend,
  boxMarks,
  coneMarks,
  cylinderMarks,
  drawing,
  ellipse,
  fromAngles,
  fromSides,
  graphed,
  name,
  note,
  on,
  rightTriangle,
  ring,
  seg,
  square,
  transversal,
  wedge,
} from "./explanation-drawings-kit.ts";

/** edge is a segment of the plane between two points. */
export const edge = (a: Point, b: Point, tone?: "action" | "result", dashed = false): PlaneMark => ({
  kind: "segment",
  a,
  b,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});
/** outline joins the points of the plane into a closed chain. */
export const outline = (points: readonly Point[], tone?: "action" | "result"): PlaneMark[] =>
  points.map((p, i) => edge(p, points[(i + 1) % points.length] as Point, tone));
/** dash is a dashed segment. */
export const dash = (a: Point, b: Point): Mark => seg(a, b, undefined, true);
/** ticks marks a segment with equal-length ticks. */
export const ticks = (a: Point, b: Point, count = 1): Mark => ({ kind: "ticks", a, b, count });
/** arrows marks a segment as parallel. */
export const arrows = (a: Point, b: Point, count = 1): Mark => ({ kind: "arrows", a, b, count });
/** mid is the point halfway between two points. */
export const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** tape draws rows of equal boxes with a name and a value inside the boxes. */
export function tape(rows: readonly (readonly [string, number])[], value: string, extra = 0): Mark[] {
  return rows.flatMap(([label, n], r) => {
    const y = -r * 1.2;
    return [
      text([0, y + 0.5], label, "w"),
      ...Array.from({ length: n }, (_, i): Mark[] => [
        ...(extra && i >= n - extra && r === rows.length - 1 ? [fill(i * 1.2, y, 1.2, 1, "action")] : []),
        rect(i * 1.2, y, 1.2, 1),
        text([i * 1.2 + 0.6, y + 0.25], value),
      ]).flat(),
    ];
  });
}

/** realLine draws a number line with x = v − lo, with whole numbers marked every labelEvery. */
export function realLine(lo: number, hi: number, labelEvery = 1, y = 0, scale = 1): Mark[] {
  const marks: Mark[] = [seg([-0.5, y], [(hi - lo) * scale + 0.5, y])];
  for (let v = lo; v <= hi; v += 1) {
    marks.push(seg([(v - lo) * scale, y - 0.1], [(v - lo) * scale, y + 0.1]));
    if ((v - lo) % labelEvery === 0) marks.push(note([(v - lo) * scale, y - 0.1], String(v).replace("-", "−"), "s"));
  }
  return marks;
}

/** ray graphs an inequality on a line from lo to hi: a closed or open circle at v, shaded to the end or to another place. */
export function ray(lo: number, hi: number, v: number, closed: boolean, to: number, y = 0): Mark[] {
  const x = v - lo;
  const end = to - lo;
  const r = 0.17;
  return [
    seg([x + Math.sign(end - x) * (closed ? 0 : r), y], [end, y], "result"),
    closed ? { kind: "dot", at: [x, y], tone: "result" } : ring(r, [x, y], "result"),
    ...(to === lo - 0.5 || to === hi + 0.5 ? [arrows(end > x ? [end - 0.4, y] : [end + 0.4, y], [end, y])] : []),
  ];
}

/** stacks draws a dot plot of the sorted values over a line from lo to hi, with a tone for the dots at the given places of the list. */
export function stacks(
  values: readonly number[],
  lo: number,
  hi: number,
  tones: Readonly<Record<number, "action" | "result">> = {},
  labelEvery = 1,
): Mark[] {
  const seen = new Map<number, number>();
  const dots = values.map((v, i): Mark => {
    const n = seen.get(v) ?? 0;
    seen.set(v, n + 1);
    return { kind: "dot", at: [v - lo, 0.4 + n * 0.45], ...(tones[i] && { tone: tones[i] }) };
  });
  return [...realLine(lo, hi, labelEvery), ...dots];
}

/** boxPlot draws a box plot of a five-number summary, in the units of a line from lo. */
export function boxPlot(
  [a, b, c, d, e]: readonly [number, number, number, number, number],
  lo: number,
  y: number,
  scale = 1,
  label?: string,
): Mark[] {
  const at = (v: number) => (v - lo) * scale;
  return [
    ...(label ? [text([at(a) - 0.2, y], label, "w")] : []),
    seg([at(a), y], [at(b), y]),
    seg([at(d), y], [at(e), y]),
    seg([at(a), y - 0.25], [at(a), y + 0.25]),
    seg([at(e), y - 0.25], [at(e), y + 0.25]),
    rect(at(b), y - 0.4, at(d) - at(b), 0.8),
    seg([at(c), y - 0.4], [at(c), y + 0.4], "result"),
  ];
}

/** histogram draws touching bars over the class edges, with their heights on top. */
export function histogram(
  edges: readonly number[],
  heights: readonly number[],
  tones: Readonly<Record<number, "action" | "result">> = {},
): Mark[] {
  const w = 2.2;
  const k = 0.4;
  return [
    seg([0, 0], [w * heights.length + 0.3, 0]),
    ...edges.map((e, i) => text([i * w, 0], String(e), "s")),
    ...heights.flatMap((h, i): Mark[] => [
      ...(tones[i] ? [fill(i * w, 0, w, h * k, tones[i])] : []),
      rect(i * w, 0, w, h * k),
      text([i * w + w / 2, h * k], String(h)),
    ]),
  ];
}

/** rays draws rays from the origin at the given degrees. */
export const rays = (...degrees: readonly number[]): Mark[] => degrees.map((d) => seg([0, 0], on(d, 3.2)));

/** between marks the angle between two rays from the origin. */
export const between = (a: number, b: number, label: string, tone: "accent" | "action" | "result" = "accent"): Mark =>
  angle([0, 0], on(a, 3.2), on(b, 3.2), tone, label);

/** triPrism draws a prism on a triangle with its length going back. */
export function triPrism(a: Point, b: Point, c: Point, dx: number, dy: number): Mark[] {
  const up = (p: Point): Point => [p[0] + dx, p[1] + dy];
  return [poly(a, b, c), seg(b, up(b)), seg(c, up(c)), seg(up(b), up(c)), dash(a, up(a)), dash(up(a), up(b)), dash(up(a), up(c))];
}

const quartileData = [2, 3, 3, 4, 4, 5, 6, 7, 7, 8, 9];
/** mini is a small pair of axes with marks on it, placed at x, with a label under it. */
export const mini = (x: number, body: readonly Mark[], label: string): Mark[] =>
  shift([seg([-2.2, 0], [2.2, 0]), seg([0, -2.2], [0, 2.2]), ...body, text([0, -2.2], label, "s")], x);

/** gradeDrawings3 are further explanation drawings of grades 6 to 8, by topic and knowledge point. */
export const gradeDrawings3: Readonly<Record<string, Figure>> = {
  "graphing-ratios#reading-a-ratio-graph": graphed(
    view(-1, 16, 2),
    [
      ln([0, 0], [2, 3]),
      pt([2, 3], "(2, 3)", "nw"),
      pt([4, 6], "(4, 6)", "nw"),
      pt([6, 9], "(6, 9)", "nw"),
      pt([10, 15], "(10, 15)", "nw", "result"),
    ],
    "The points (2, 3), (4, 6) and (6, 9) on a line through the origin, which also passes through (10, 15).",
    "直线过原点和点 (2, 3)、(4, 6)、(6, 9)，也过 (10, 15)。",
  ),
  "graphing-ratios#points-on-a-ratio-graph": graphed(
    view(-1, 14, 2),
    [ln([0, 0], [2, 3]), pt([8, 12], "(8, 12)", "nw", "result"), pt([8, 9], "(8, 9)", "se", "action")],
    "The line of the ratio 2 : 3, with (8, 12) on it and (8, 9) off it.",
    "比 2 : 3 的直线：(8, 12) 在线上，(8, 9) 不在线上。",
  ),
  "tape-diagrams#tape-diagrams-with-a-total": drawing(
    [
      ...tape(
        [
          ["A", 3],
          ["B", 5],
        ],
        "5",
      ),
      text([7, -0.2], "Σ = 40", "e"),
    ],
    "A tape of 3 boxes and a tape of 5 boxes: 8 boxes make 40, so one box is 5 and B is 25.",
    "3 格和 5 格的两条带：8 格合计 40，所以一格是 5，B 是 25。",
  ),
  "tape-diagrams#tape-diagrams-with-a-difference": drawing(
    [
      ...tape(
        [
          ["A", 3],
          ["B", 5],
        ],
        "6",
        2,
      ),
      text([4.8, -1.2], "12", "s"),
    ],
    "A tape of 3 boxes and a tape of 5 boxes: the 2 extra boxes are 12, so one box is 6 and A is 18.",
    "3 格和 5 格的两条带：多出的 2 格是 12，所以一格是 6，A 是 18。",
  ),
  "understanding-percentages-using-models#percent-from-a-bar-model": drawing(
    [fill(0, 0, 2, 1), ...gridRect(5, 1), text([2.5, 0], "2/5 = 40/100 = 40%", "s")],
    "A bar of 5 equal parts with 2 shaded: 2/5 = 40/100 = 40%.",
    "分成 5 等份、涂 2 份的长条：2/5 = 40/100 = 40%。",
  ),
  "finding-side-lengths-using-fraction-division#side-from-a-fractional-area": drawing(
    [rect(0, 0, 6, 2), text([3, 0.7], "¾ ft²"), side([0, 0], [6, 0], "1½ ft"), side([6, 0], [6, 2], "½ ft")],
    "A rectangle with area 3/4 square foot and width 1/2 foot, drawn to scale: its length is 1 1/2 feet.",
    "面积 3/4 平方英尺、宽 1/2 英尺的长方形（按比例）：长为 1 1/2 英尺。",
  ),
  "comparing-rational-numbers#comparing-two-rational-numbers": drawing(
    [...realLine(-1, 0, 1, 0, 10), spot(2.5, "result"), spot(3), text([2.4, 0.1], "−¾", "nw"), text([3.1, 0.1], "−0.7", "ne")],
    "A number line from −1 to 0: −3/4, which is −0.75, is left of −0.7.",
    "从 −1 到 0 的数轴：−3/4 即 −0.75，在 −0.7 的左边。",
  ),
  "ordering-rational-numbers#ordering-least-to-greatest": drawing(
    [
      ...realLine(-3, 1, 1, 0, 3),
      ...[-2.5, -1.8, 0.4, 0.75].map((v) => spot((v + 3) * 3)),
      text([1.5, 0.1], "−2½"),
      text([3.6, 0.1], "−1.8"),
      text([10.2, 0.1], "0.4"),
      text([11.25, 0.1], "¾"),
    ],
    "The numbers on a line, from left to right: −2 1/2, −1.8, 0.4 and 3/4.",
    "数轴上从左到右的数：−2 1/2、−1.8、0.4 和 3/4。",
  ),
  "ordering-rational-numbers#finding-the-least": drawing(
    [
      ...realLine(-2, -1, 1, 0, 12),
      spot((2 - 5 / 3) * 12, "result"),
      spot(0.4 * 12),
      spot(0.5 * 12),
      text([4, 0.1], "−1⅔"),
      text([4.8, 0.3], "−1.6", "ne"),
      text([6.2, 0.1], "−3/2", "ne"),
    ],
    "On a line from −2 to −1, −1 2/3 is the farthest left of −1 2/3, −1.6 and −3/2.",
    "从 −2 到 −1 的数轴上，−1 2/3、−1.6 和 −3/2 中 −1 2/3 最靠左。",
  ),
  "the-cartesian-coordinate-system#reflecting-a-point-in-an-axis": graphed(
    view(-5, 5, 2),
    [
      pt([3, 2], "(3, 2)", "ne"),
      pt([3, -2], "(3, −2)", "se", "result"),
      pt([-3, 2], "(−3, 2)", "nw", "action"),
      edge([3, 2], [3, -2], undefined, true),
      edge([3, 2], [-3, 2], undefined, true),
    ],
    "The point (3, 2) with its reflection (3, −2) in the x-axis and its reflection (−3, 2) in the y-axis.",
    "点 (3, 2)、它关于 x 轴的像 (3, −2) 和关于 y 轴的像 (−3, 2)。",
  ),
  "reflections-of-points-in-the-coordinate-plane#reflecting-across-an-axis": graphed(
    view(-6, 6, 2),
    [
      pt([-2, 5], "(−2, 5)", "nw"),
      pt([-2, -5], "(−2, −5)", "sw", "result"),
      pt([2, 5], "(2, 5)", "ne", "action"),
      edge([-2, 5], [-2, -5], undefined, true),
      edge([-2, 5], [2, 5], undefined, true),
    ],
    "The point (−2, 5) goes to (−2, −5) across the x-axis and to (2, 5) across the y-axis.",
    "点 (−2, 5) 关于 x 轴到 (−2, −5)，关于 y 轴到 (2, 5)。",
  ),
  "reflections-of-points-in-the-coordinate-plane#identifying-the-reflection": graphed(
    view(-6, 6, 2),
    [pt([4, -1], "(4, −1)", "se"), pt([-4, -1], "(−4, −1)", "sw", "result"), edge([4, -1], [-4, -1], undefined, true)],
    "The points (4, −1) and (−4, −1), with the y-axis halfway between them.",
    "点 (4, −1) 和 (−4, −1)，y 轴在它们正中间。",
  ),
  "solving-problems-in-the-coordinate-plane#the-fourth-vertex-of-a-rectangle": graphed(
    view(-4, 6, 2, -3, 5),
    [
      ...outline([
        [-2, 3],
        [4, 3],
        [4, -1],
        [-2, -1],
      ]),
      pt([-2, 3], "(−2, 3)", "nw"),
      pt([4, 3], "(4, 3)", "ne"),
      pt([4, -1], "(4, −1)", "se"),
      pt([-2, -1], "(−2, −1)", "sw", "result"),
    ],
    "A rectangle with vertices (−2, 3), (4, 3) and (4, −1), and the fourth vertex (−2, −1).",
    "顶点为 (−2, 3)、(4, 3)、(4, −1) 的长方形和第四个顶点 (−2, −1)。",
  ),
  "representing-inequalities-on-number-lines#writing-an-inequality-from-a-graph": drawing(
    [
      ...realLine(-6, 6, 2, 1.5),
      ...ray(-6, 6, -3, true, 6.5, 1.5),
      text([12.8, 1.5], "x ≥ −3", "e"),
      ...realLine(-6, 6, 2, 0),
      ...ray(-6, 6, 4, false, -6.5, 0),
      text([12.8, 0], "x < 4", "e"),
    ],
    "A closed dot at −3 with shading to the right, and an open circle at 4 with shading to the left.",
    "在 −3 处实心点向右画线，在 4 处空心圈向左画线。",
  ),
  "representing-inequalities-on-number-lines#describing-the-graph-of-an-inequality": drawing(
    [...realLine(0, 10, 2), ...ray(0, 10, 6, true, -0.5)],
    "The graph of x ≤ 6: a closed dot at 6 with shading to the left.",
    "x ≤ 6 的图：在 6 处实心点向左画线。",
  ),
  "analyzing-two-variable-equations-using-graphs#reading-values-from-a-graph": graphed(
    view(-1, 10, 2),
    [ln([0, 1], [4, 9]), edge([4, 0], [4, 9], "action", true), edge([4, 9], [0, 9], "action", true), pt([4, 9], "(4, 9)", "ne", "result")],
    "The graph of y = 2x + 1: go up from x = 4 to the line, then across to y = 9.",
    "y = 2x + 1 的图：从 x = 4 向上到直线，再横向读到 y = 9。",
  ),
  "areas-of-rectangles#fractional-and-decimal-side-lengths": drawing(
    [rect(0, 0, 3.5, 2.4), side([0, 0], [3.5, 0], "3.5 m"), side([3.5, 0], [3.5, 2.4], "2.4 m"), text([1.75, 0.9], "8.4 m²")],
    "A rectangle 3.5 meters long and 2.4 meters wide, with area 8.4 square meters.",
    "长 3.5 米、宽 2.4 米的长方形，面积 8.4 平方米。",
  ),
  "areas-of-right-triangles#area-from-the-legs": rightTriangle(
    { legs: [12, 5], a: "12 m", b: "5 m", c: "13 m" },
    "A right triangle with legs 5 and 12 meeting at the right angle, and longest side 13.",
    "直角三角形，5 和 12 两条直角边相交成直角，最长边 13。",
  ),
  "areas-of-right-triangles#missing-leg": rightTriangle(
    { legs: [9, 8], a: "b = 9 cm", b: "8 cm" },
    "A right triangle with area 36 square centimeters, one leg 8 centimeters and the other 9.",
    "面积 36 平方厘米的直角三角形，一条直角边 8 厘米，另一条 9 厘米。",
  ),
  "areas-of-triangles#height-inside-the-triangle": drawing(
    [
      poly([0, 0], [14, 0], [6, 8]),
      dash([6, 0], [6, 8]),
      square([6, 0], [14, 0], [6, 8]),
      side([0, 0], [14, 0], "14 cm"),
      side([6, 8], [0, 0], "10 cm"),
      text([6, 3.6], "8 cm", "e"),
    ],
    "A triangle with base 14, slanted side 10 and a dashed height of 8 meeting the base at a right angle.",
    "底 14、斜边 10 的三角形，虚线高 8 与底成直角。",
  ),
  "areas-of-triangles#height-outside-the-triangle": drawing(
    [
      poly([0, 0], [6, 0], [10, 5]),
      dash([6, 0], [10, 0]),
      dash([10, 0], [10, 5]),
      square([10, 0], [6, 0], [10, 5]),
      side([0, 0], [6, 0], "6 m"),
      text([8, 0], "4 m", "s"),
      text([10, 2.5], "5 m", "e"),
    ],
    "An obtuse triangle with base 6: the height of 5 falls on the extension of the base, 4 past its end.",
    "底为 6 的钝角三角形：高 5 落在底的延长线上，超出端点 4。",
  ),
  "areas-and-perimeters-of-parallelograms#area-of-a-parallelogram": drawing(
    [
      poly([0, 0], [15, 0], [21, 8], [6, 8]),
      dash([6, 0], [6, 8]),
      square([6, 0], [15, 0], [6, 8]),
      side([0, 0], [15, 0], "15 m"),
      side([6, 8], [0, 0], "10 m"),
      text([6, 3.6], "8 m", "e"),
    ],
    "A parallelogram with base 15, slanted side 10 and height 8.",
    "底 15、斜边 10、高 8 的平行四边形。",
  ),
  "finding-areas-of-polygons-using-decomposition#rectilinear-figures": drawing(
    [
      fill(0, 0, 7, 9),
      fill(7, 0, 5, 4, "action"),
      poly([0, 0], [12, 0], [12, 4], [7, 4], [7, 9], [0, 9]),
      dash([7, 0], [7, 4]),
      side([0, 0], [12, 0], "12 m"),
      side([12, 0], [12, 4], "4 m"),
      side([7, 9], [0, 9], "7 m"),
      side([0, 9], [0, 0], "9 m"),
      text([3.5, 4], "63 m²"),
      text([9.5, 1.6], "20 m²"),
    ],
    "An L shape cut by a vertical line into 7 by 9 and 5 by 4: 63 + 20 = 83.",
    "L 形被竖线切成 7 × 9 和 5 × 4：63 + 20 = 83。",
  ),
  "finding-areas-of-polygons-using-decomposition#rectangles-and-triangles": drawing(
    [
      fill(0, 0, 10, 6),
      poly([0, 0], [10, 0], [10, 6], [5, 9], [0, 6]),
      dash([0, 6], [10, 6]),
      dash([5, 6], [5, 9]),
      side([0, 0], [10, 0], "10 ft"),
      side([10, 0], [10, 6], "6 ft"),
      text([5, 6.8], "3 ft", "e"),
    ],
    "A house shape: a rectangle 10 by 6 with a triangle 3 tall on top, area 60 + 15 = 75.",
    "房子形：10 × 6 的长方形上加高 3 的三角形，面积 60 + 15 = 75。",
  ),
  "lines-of-symmetry#counting-lines-of-symmetry": drawing(
    (() => {
      const h = regular(6, 3, [10, 1.5]);
      const c: Point = [10, 1.5];
      return [
        rect(0, 0, 6, 3),
        dash([3, -0.5], [3, 3.5]),
        dash([-0.5, 1.5], [6.5, 1.5]),
        poly(...h),
        ...h.slice(0, 3).map((p, i) => dash(p, h[i + 3] as Point)),
        ...h.slice(0, 3).map((p, i) => {
          const m = mid(p, h[i + 1] as Point);
          return dash(m, [2 * c[0] - m[0], 2 * c[1] - m[1]]);
        }),
      ];
    })(),
    "A rectangle with its 2 lines of symmetry and a regular hexagon with its 6.",
    "长方形的 2 条对称轴和正六边形的 6 条对称轴。",
  ),
  "lines-of-symmetry#testing-a-line-of-symmetry": drawing(
    [
      rect(0, 0, 6, 3),
      seg([0, 0], [6, 3], "action"),
      dash([0, 0], [3.6, 4.8]),
      dash([3.6, 4.8], [6, 3]),
      { kind: "dot", at: [3.6, 4.8], tone: "result" },
    ],
    "A long rectangle folded along its diagonal: the corner lands outside the rectangle.",
    "沿对角线折叠的长方形：角落在长方形外面。",
  ),
  "finding-areas-and-perimeters-in-the-coordinate-plane#perimeters-of-rectangles-from-vertices": graphed(
    view(-6, 5, 2, -1, 9),
    [
      ...outline([
        [-5, 2],
        [3, 2],
        [3, 7],
        [-5, 7],
      ]),
      pt([-5, 2], "A(−5, 2)", "sw"),
      pt([3, 2], "B(3, 2)", "se"),
      pt([3, 7], "C(3, 7)", "ne"),
      pt([-5, 7], "D(−5, 7)", "nw"),
    ],
    "The rectangle with AB = 8 and BC = 5, so its perimeter is 26.",
    "AB = 8、BC = 5 的长方形，周长 26。",
  ),
  "finding-areas-and-perimeters-in-the-coordinate-plane#areas-of-triangles-from-vertices": graphed(
    view(-4, 6, 2, -4, 6),
    [
      ...outline([
        [-3, -2],
        [5, -2],
        [1, 4],
      ]),
      edge([1, -2], [1, 4], "action", true),
      pt([-3, -2], "A(−3, −2)", "sw"),
      pt([5, -2], "B(5, −2)", "se"),
      pt([1, 4], "C(1, 4)", "n"),
    ],
    "The triangle with horizontal base AB of 8 and dashed height 6, so area 24.",
    "水平底 AB 为 8、虚线高 6 的三角形，面积 24。",
  ),
  "measuring-range-and-mad-from-dot-plots#the-range-from-a-dot-plot": drawing(
    [...stacks([2, 3, 3, 4, 5, 5, 5, 6, 7, 9], 0, 10, { 0: "result", 9: "result" }), ...hop(2, 9, "9 − 2 = 7", 2)],
    "A dot plot on a line from 0 to 10 whose leftmost dot is at 2 and rightmost at 9: the range is 7.",
    "数轴从 0 到 10 的点图，最左的点在 2，最右在 9：极差为 7。",
  ),
  "measuring-quartiles-and-iqr-from-dot-plots#a-quartile-from-a-dot-plot": drawing(
    stacks(quartileData, 0, 10, { 2: "action", 5: "result", 8: "action" }),
    "A dot plot with 11 dots, counted across the stacks: the 3rd dot is Q₁, the 6th the median and the 9th Q₃.",
    "有 11 个点的点图，按列数：第 3 个是 Q₁，第 6 个是中位数，第 9 个是 Q₃。",
  ),
  "measuring-quartiles-and-iqr-from-dot-plots#the-iqr-from-a-dot-plot": drawing(
    [...stacks(quartileData, 0, 10, { 2: "action", 8: "action" }), ...hop(3, 7, "7 − 3 = 4", 1.5)],
    "A dot plot with Q₁ = 3 and Q₃ = 7: the IQR is 4.",
    "Q₁ = 3、Q₃ = 7 的点图：四分位距为 4。",
  ),
  "measuring-quartiles-and-iqr-from-dot-plots#the-five-number-summary-from-a-dot-plot": drawing(
    [
      ...stacks(quartileData, 0, 10, { 0: "result", 2: "result", 5: "result", 8: "result", 10: "result" }),
      ...boxPlot([2, 3, 5, 7, 9], 0, -1.4),
    ],
    "A dot plot with its five numbers 2, 3, 5, 7 and 9, and the box plot of the same data below it.",
    "点图的五个数 2、3、5、7、9，以及下方相同数据的箱线图。",
  ),
  "understanding-proportional-relationships-using-graphs#is-the-graph-proportional": graphed(
    view(-1, 7),
    [ln([0, 2], [4, 6]), pt([0, 2], "(0, 2)", "nw"), pt([4, 6], "(4, 6)", "se"), pt([0, 0], "(0, 0)", "se", "action")],
    "A straight line through (0, 2) and (4, 6) that misses the origin.",
    "过 (0, 2) 和 (4, 6) 但不过原点的直线。",
  ),
  "understanding-proportional-relationships-using-graphs#constant-of-proportionality-from-a-graph": graphed(
    view(-1, 8),
    [ln([0, 0], [6, 4]), edge([0, 0], [6, 0], "action", true), edge([6, 0], [6, 4], "action", true), pt([6, 4], "(6, 4)", "ne", "result")],
    "A line through the origin and (6, 4): its y over its x is 2/3.",
    "过原点和 (6, 4) 的直线：y 除以 x 得 2/3。",
  ),
  "subtracting-a-positive-number-from-a-smaller-positive-number#smaller-minus-larger": drawing(
    [...line(-6, 5, 1, String), spot(10, "action"), spot(1), ...hop(10, 6, "4"), ...hop(6, 1, "5")],
    "4 − 9 on a number line: 4 units left reaches 0 and 5 more reach −5.",
    "数轴上的 4 − 9：向左 4 到 0，再 5 到 −5。",
  ),
  "adding-a-positive-number-to-a-negative-number#negative-plus-positive-integers": drawing(
    [
      ...line(-8, 5, 1, String, 4),
      spot(0, "action", 4),
      spot(3, "result", 4),
      ...hop(0, 3, "+3", 4),
      ...line(-8, 5, 1, String),
      spot(5, "action"),
      spot(13),
      ...hop(5, 13, "+8"),
    ],
    "−8 + 3 stays negative at −5, and −3 + 8 moves past 0 to 5.",
    "−8 + 3 仍为负，等于 −5；−3 + 8 越过 0 到 5。",
  ),
  "adding-a-negative-number#positive-plus-negative": drawing(
    [...line(-4, 6, 1, String), spot(9, "action"), spot(1), ...hop(9, 1, "−8")],
    "5 + (−8) on a number line: from 5 move 8 to the left, to −3.",
    "数轴上的 5 + (−8)：从 5 向左 8，到 −3。",
  ),
  "interpreting-additive-opposites-and-addition-using-absolute-value#locating-a-sum-on-the-number-line": drawing(
    [...realLine(-3, 4), spot(6.5, "action"), spot(0.5), text([6.5, 0.1], "3.5"), text([0.5, 0.1], "−2.5"), ...hop(6.5, 0.5, "6")],
    "3.5 + (−6) is 6 units to the left of 3.5, at −2.5.",
    "3.5 + (−6) 在 3.5 左边 6 个单位，即 −2.5。",
  ),
  "interpreting-additive-opposites-and-addition-using-absolute-value#distance-between-rational-numbers": drawing(
    [
      ...realLine(-5, 3),
      spot(0.5, "action"),
      spot(7.25, "action"),
      text([0.5, 0.1], "−4.5"),
      text([7.25, 0.1], "2.25"),
      ...hop(0.5, 7.25, "6.75"),
    ],
    "The numbers −4.5 and 2.25 on a line, 6.75 apart.",
    "数轴上的 −4.5 和 2.25，相距 6.75。",
  ),
  "graphing-linear-equations#reading-a-solution-from-the-graph": graphed(
    view(-2, 6, 2, -7, 5),
    [
      ln([0, 3], [2, -1]),
      edge([4, 0], [4, -5], "action", true),
      edge([4, -5], [0, -5], "action", true),
      pt([0, 3], "(0, 3)", "ne"),
      pt([2, -1], "(2, −1)", "ne"),
      pt([4, -5], "(4, −5)", "e", "result"),
    ],
    "A line through (0, 3) and (2, −1): below x = 4 it is at (4, −5).",
    "过 (0, 3) 和 (2, −1) 的直线：x = 4 处在 (4, −5)。",
  ),
  "graphing-linear-equations#matching-an-equation-to-its-graph": graphed(
    view(-2, 6, 2, -2, 7),
    [
      ln([0, 1], [2, 5]),
      pt([0, 1], "(0, 1)", "se"),
      pt([2, 5], "(2, 5)", "se"),
      pt([0, 2], "(0, 2)", "nw", "action"),
      ln([0, 2], [1, 3], "action", true),
    ],
    "The line through (0, 1) and (2, 5), which is y = 2x + 1, and the dashed line y = x + 2, which crosses the y-axis at (0, 2) and misses (0, 1).",
    "过 (0, 1) 和 (2, 5) 的直线即 y = 2x + 1；虚线 y = x + 2 交 y 轴于 (0, 2)，不过 (0, 1)。",
  ),
  "compound-inequalities#writing-from-a-graph": drawing(
    [
      ...realLine(-6, 6, 2, 1.5),
      ...ray(-6, 6, -3, false, 4, 1.5),
      { kind: "dot", at: [10, 1.5], tone: "result" },
      text([12.8, 1.5], "−3 < x ≤ 4", "e"),
      ...realLine(-6, 6, 2, 0),
      ...ray(-6, 6, -1, true, -6.5, 0),
      ...ray(-6, 6, 2, false, 6.5, 0),
      text([12.8, 0], "x ≤ −1, x > 2", "e"),
    ],
    "A segment from an open circle at −3 to a closed dot at 4, and two rays from a closed dot at −1 and an open circle at 2.",
    "从 −3 空心圈到 4 实心点的线段；以及从 −1 实心点和 2 空心圈出发的两条射线。",
  ),
  "representing-solutions-to-inequalities-on-number-lines#describing-the-graph-of-the-solutions": drawing(
    [...realLine(-6, 2, 2), ...ray(-6, 2, -2, true, -6.5)],
    "The graph of x ≤ −2: a closed dot at −2, shaded to the left.",
    "x ≤ −2 的图：在 −2 处实心点，向左画线。",
  ),
  "representing-solutions-to-inequalities-on-number-lines#choosing-the-inequality-for-a-graph": drawing(
    [...realLine(-2, 6, 2), ...ray(-2, 6, 3, false, -2.5)],
    "The graph of x < 3: an open circle at 3, shaded to the left.",
    "x < 3 的图：在 3 处空心圈，向左画线。",
  ),
  "measures-of-segments#lengths-on-a-number-line": drawing(
    [
      ...realLine(-6, 2, 2),
      spot(0, "action"),
      spot(8, "action"),
      text([0, 0.1], "A"),
      text([8, 0.1], "B"),
      ...hop(0, 6, "6"),
      ...hop(6, 8, "2"),
    ],
    "A at −6 and B at 2: 6 units to 0 and 2 more, so AB = 8.",
    "A 在 −6，B 在 2：到 0 有 6 个单位，再 2 个，所以 AB = 8。",
  ),
  "midpoints#midpoint-on-a-number-line": drawing(
    [
      ...realLine(-7, 4, 1),
      spot(0, "action"),
      spot(11, "action"),
      spot(5.5),
      text([0, 0.1], "A"),
      text([11, 0.1], "B"),
      ...hop(0, 5.5, "5.5"),
      ...hop(5.5, 11, "5.5"),
    ],
    "A at −7 and B at 4, with the midpoint at −1.5, 5.5 units from each.",
    "A 在 −7，B 在 4，中点在 −1.5，到两端都是 5.5 个单位。",
  ),
  "collinear-points#collinear-points-in-the-coordinate-plane": graphed(
    view(-1, 8, 1, -3, 10),
    [
      ln([3, 0], [3, 1]),
      pt([3, -2], "A(3, −2)", "e"),
      pt([3, 4], "B(3, 4)", "w"),
      pt([3, 9], "(3, 9)", "e"),
      ln([1, 1], [3, 4], "action"),
      pt([1, 1], "P(1, 1)", "se", "action"),
      pt([3, 4], "Q(3, 4)", "e", "action"),
      pt([5, 7], "(5, 7)", "se", "action"),
    ],
    "The vertical line through A and B contains (3, 9), and the line through P and Q contains (5, 7).",
    "过 A、B 的竖直线含 (3, 9)，过 P、Q 的直线含 (5, 7)。",
  ),
  "segment-bisectors-and-the-perpendicular-bisector-theorem#the-perpendicular-bisector-theorem": drawing(
    [
      seg([-3, 0], [3, 0]),
      seg([0, -1], [0, 4.6], "action"),
      square([0, 0], [3, 0], [0, 4]),
      ticks([-3, 0], [0, 0]),
      ticks([0, 0], [3, 0]),
      seg([-3, 0], [0, 4]),
      seg([3, 0], [0, 4]),
      name([-3, 0], "A", "w"),
      name([3, 0], "B", "e"),
      name([0, 4], "P", "ne"),
      note([0, 4.6], "ℓ", "n"),
      side([0, 4], [-3, 0], "4x − 3"),
      side([3, 0], [0, 4], "2x + 9"),
    ],
    "Line ℓ is the perpendicular bisector of AB, and P on ℓ has PA = PB.",
    "直线 ℓ 是 AB 的垂直平分线，ℓ 上的点 P 满足 PA = PB。",
  ),
  "congruent-angles#identifying-congruent-angles": drawing(
    [
      seg([0, 0], on(0, 5)),
      seg([0, 0], on(40, 5)),
      angle([0, 0], on(0, 5), on(40, 5), "accent", "40°"),
      ...shift([seg([0, 0], on(120, 2)), seg([0, 0], on(160, 2)), angle([0, 0], on(120, 2), on(160, 2), "accent", "40°")], 8),
    ],
    "An angle of 40° with long arms and one with short arms that points the other way.",
    "长边的 40° 角和短边、朝向不同的 40° 角。",
  ),
  "vertical-angles#vertical-angles-and-linear-pairs": drawing(
    [
      ...rays(0, 50, 180, 230),
      between(0, 50, "50°"),
      between(180, 230, "50°"),
      between(50, 180, "130°", "action"),
      between(230, 360, "130°", "action"),
    ],
    "Two crossing lines: the opposite angles are 50° and 50°, and each of the others is 130°.",
    "两条相交直线：对顶角为 50° 和 50°，其余两个都是 130°。",
  ),
  "vertical-angles#equations-from-crossing-lines": drawing(
    [...rays(0, 70, 180, 250), between(0, 70, "(3x + 10)°"), between(180, 250, "(5x − 30)°")],
    "Vertical angles measuring (3x + 10)° and (5x − 30)°, each 70° when x = 20.",
    "度数为 (3x + 10)° 和 (5x − 30)° 的对顶角，x = 20 时都是 70°。",
  ),
  "complementary-angles#complements-in-a-figure": drawing(
    [...rays(0, 35, 90), square([0, 0], on(0, 3.2), on(90, 3.2)), between(0, 35, "35°"), between(35, 90, "x°", "action")],
    "A ray splits a right angle, marked with a small square, into 35° and x°: x = 55.",
    "一条射线把标有小方块的直角分成 35° 和 x°：x = 55。",
  ),
  "supplementary-angles#supplements-in-a-figure": drawing(
    [seg([-3.2, 0], [3.2, 0]), seg([0, 0], on(112, 3.2)), between(0, 112, "112°"), between(112, 180, "x°", "action")],
    "A ray from a point on a line splits the straight angle into 112° and x°: x = 68.",
    "从直线上一点出发的射线把平角分成 112° 和 x°：x = 68。",
  ),
  "angle-bisectors#halves-and-wholes": drawing(
    [
      ...rays(0, 42, 84),
      between(0, 42, "42°"),
      between(42, 84, "42°"),
      name([0, 0], "B", "sw"),
      name(on(84, 3.2), "A", "n"),
      name(on(42, 3.2), "D", "ne"),
      name(on(0, 3.2), "C", "e"),
    ],
    "Ray BD bisects angle ABC of 84° into two angles of 42°.",
    "射线 BD 把 84° 的 ∠ABC 平分成两个 42° 的角。",
  ),
  "solving-problems-with-angles#angles-on-a-line-and-around-a-point": drawing(
    [
      seg([-3.2, 0], [3.2, 0]),
      seg([0, 0], on(40, 3.2)),
      seg([0, 0], on(115, 3.2)),
      between(0, 40, "40°"),
      between(40, 115, "x°", "action"),
      between(115, 180, "65°"),
      ...shift(
        [
          ...rays(0, 90, 210, 295),
          between(0, 90, "90°"),
          between(90, 210, "120°"),
          between(210, 295, "85°"),
          between(295, 360, "x°", "action"),
        ],
        8,
      ),
    ],
    "Angles of 40°, x° and 65° on a line give x = 75, and angles of 90°, 120°, 85° and x° around a point give x = 65.",
    "直线上 40°、x°、65° 得 x = 75；一点周围 90°、120°、85°、x° 得 x = 65。",
  ),
  "solving-problems-with-angles#chaining-angle-relationships": drawing(
    [
      seg(on(180, 3.2), on(0, 3.2)),
      seg(on(120, 3.2), on(300, 3.2)),
      seg([0, 0], on(90, 3.2), "action"),
      square([0, 0], on(0, 3.2), on(90, 3.2)),
      between(90, 120, "30°"),
      between(120, 180, "60°", "result"),
      between(300, 360, "60°", "result"),
      between(180, 300, "120°", "action"),
      name(on(180, 3.2), "A", "w"),
      name(on(0, 3.2), "B", "e"),
      name(on(120, 3.2), "C", "nw"),
      name(on(300, 3.2), "D", "se"),
      name(on(90, 3.2), "E", "n"),
      name([0, 0], "O", "se"),
    ],
    "Lines AB and CD cross at O with OE perpendicular to AB: angle COE of 30° gives AOC and BOD of 60°, and AOD of 120°.",
    "直线 AB、CD 交于 O，OE ⊥ AB：∠COE = 30° 得 ∠AOC、∠BOD = 60°，∠AOD = 120°。",
  ),
  "angles-of-a-triangle#triangle-angle-equations": drawing(
    (() => {
      const [a, b, c] = fromAngles(30, 70, 6);
      return [
        poly(a, b, c),
        angle(a, b, c, "accent", "x°"),
        angle(b, c, a, "accent", "(2x + 10)°"),
        angle(c, a, b, "accent", "(3x − 10)°"),
      ];
    })(),
    "A triangle with angles x°, (2x + 10)° and (3x − 10)°, which are 30°, 70° and 80°.",
    "三个角为 x°、(2x + 10)°、(3x − 10)° 的三角形，即 30°、70°、80°。",
  ),
  "classifying-triangles#classifying-by-sides": drawing(
    (() => {
      const e = fromSides(3, 3, 3);
      const i = fromSides(3, 3.6, 3.6);
      const s = fromSides(4, 2.6, 3.2);
      const marks = (t: readonly [Point, Point, Point], counts: readonly [number, number, number]) => [
        poly(...t),
        ...t.flatMap((p, k): Mark[] => (counts[k] ? [ticks(p, t[(k + 1) % 3] as Point, counts[k])] : [])),
      ];
      return [...marks(e, [1, 1, 1]), ...shift([...marks(i, [0, 1, 1])], 5), ...shift([...marks(s, [0, 0, 0])], 10)];
    })(),
    "An equilateral triangle with three matching tick marks, an isosceles one with two, and a scalene one with none.",
    "等边三角形有三个相同记号，等腰三角形有两个，不等边三角形没有。",
  ),
  "classifying-triangles#classifying-by-angles": drawing(
    [
      (() => poly(...fromAngles(60, 70, 3)))(),
      ...shift([poly([0, 0], [3, 0], [0, 2.4]), square([0, 0], [3, 0], [0, 2.4])], 5),
      ...shift([poly(...fromAngles(25, 30, 4))], 9.5),
    ],
    "An acute triangle, a right triangle and an obtuse triangle.",
    "锐角三角形、直角三角形和钝角三角形。",
  ),
  "heights-of-triangles#recognizing-a-height": drawing(
    [
      poly([0, 0], [5, 0], [1.6, 3.4]),
      dash([1.6, 0], [1.6, 3.4]),
      square([1.6, 0], [5, 0], [1.6, 3.4]),
      name([0, 0], "B", "sw"),
      name([5, 0], "C", "se"),
      name([1.6, 3.4], "A", "n"),
      ...shift(
        [
          poly([0, 0], [3, 0], [-1.4, 3]),
          dash([-1.4, 0], [0, 0]),
          dash([-1.4, 0], [-1.4, 3]),
          square([-1.4, 0], [0, 0], [-1.4, 3]),
          name([0, 0], "B", "s"),
          name([3, 0], "C", "se"),
          name([-1.4, 3], "A", "n"),
        ],
        9,
      ),
    ],
    "The height from A to base BC inside a triangle, and outside one with an obtuse angle at B, where BC must be extended.",
    "从 A 到底 BC 的高：一个在三角形内；另一个在 B 处为钝角时落在外面，要延长 BC。",
  ),
  "heights-of-triangles#heights-in-the-coordinate-plane": graphed(
    view(-1, 10, 2, -1, 8),
    [
      ...outline([
        [1, 2],
        [7, 2],
        [9, 6],
      ]),
      edge([7, 2], [9, 2], undefined, true),
      edge([9, 2], [9, 6], "action", true),
      pt([1, 2], "A(1, 2)", "sw"),
      pt([7, 2], "B(7, 2)", "s"),
      pt([9, 6], "C(9, 6)", "n"),
    ],
    "Triangle ABC with base AB: the dashed height from C falls outside the triangle and has length 6 − 2 = 4.",
    "以 AB 为底的三角形 ABC：C 处的虚线高落在外面，长 6 − 2 = 4。",
  ),
  "properties-of-rectangles-and-squares#diagonals-of-rectangles": drawing(
    [
      rect(0, 0, 6, 4),
      seg([0, 0], [6, 4]),
      seg([6, 0], [0, 4]),
      ...(
        [
          [0, 0],
          [6, 0],
          [6, 4],
          [0, 4],
        ] as Point[]
      ).map((p) => ticks(p, [3, 2])),
      name([0, 0], "A", "sw"),
      name([6, 0], "B", "se"),
      name([6, 4], "C", "ne"),
      name([0, 4], "D", "nw"),
      name([3, 2], "E", "n"),
    ],
    "Rectangle ABCD with diagonals meeting at E: the four segments from E are equal.",
    "长方形 ABCD 的对角线交于 E：从 E 出发的四段相等。",
  ),
  "properties-of-rectangles-and-squares#angles-in-rectangles": drawing(
    (() => {
      const h = 6 * Math.tan((35 * Math.PI) / 180);
      const [a, b, c, d]: Point[] = [
        [0, 0],
        [6, 0],
        [6, h],
        [0, h],
      ] as Point[];
      return [
        poly(a as Point, b as Point, c as Point, d as Point),
        seg(a as Point, c as Point),
        angle(a as Point, b as Point, c as Point, "accent", "35°"),
        angle(a as Point, c as Point, d as Point, "action", "55°"),
        angle(c as Point, a as Point, b as Point, "action", "55°"),
        square(b as Point, c as Point, a as Point),
        name(a as Point, "A", "sw"),
        name(b as Point, "B", "se"),
        name(c as Point, "C", "ne"),
        name(d as Point, "D", "nw"),
      ];
    })(),
    "A rectangle whose diagonal AC makes angle BAC of 35°, so CAD and BCA are 55°.",
    "对角线 AC 使 ∠BAC = 35° 的长方形，所以 ∠CAD 和 ∠BCA 是 55°。",
  ),
  "properties-of-rectangles-and-squares#diagonals-of-squares": drawing(
    [
      rect(0, 0, 5, 5),
      seg([0, 0], [5, 5]),
      seg([5, 0], [0, 5]),
      square([2.5, 2.5], [0, 0], [5, 0]),
      angle([0, 0], [5, 0], [5, 5], "accent", "45°"),
      name([0, 0], "A", "sw"),
      name([5, 0], "B", "se"),
      name([5, 5], "C", "ne"),
      name([0, 5], "D", "nw"),
      name([2.5, 2.5], "E", "n"),
    ],
    "Square ABCD: the diagonals meet at right angles at E, and each splits a corner into 45°.",
    "正方形 ABCD：对角线在 E 处垂直相交，且把每个角分成 45°。",
  ),
  "properties-of-trapezoids#isosceles-trapezoids-with-algebra": drawing(
    [
      poly([0, 0], [10, 0], [8, 4], [2, 4]),
      ticks([10, 0], [8, 4]),
      ticks([2, 4], [0, 0]),
      seg([0, 0], [8, 4], "action"),
      seg([10, 0], [2, 4], "action"),
      name([0, 0], "A", "sw"),
      name([10, 0], "B", "se"),
      name([8, 4], "C", "ne"),
      name([2, 4], "D", "nw"),
    ],
    "An isosceles trapezoid with equal legs and equal diagonals AC and BD.",
    "等腰梯形：两腰相等，对角线 AC 和 BD 相等。",
  ),
  "properties-of-trapezoids#the-midsegment-of-a-trapezoid": drawing(
    [
      poly([0, 0], [16, 0], [13, 6], [3, 6]),
      seg([1.5, 3], [14.5, 3], "result"),
      ticks([0, 0], [1.5, 3]),
      ticks([1.5, 3], [3, 6]),
      ticks([16, 0], [14.5, 3], 2),
      ticks([14.5, 3], [13, 6], 2),
      side([0, 0], [16, 0], "16"),
      side([13, 6], [3, 6], "10"),
      text([8, 3], "13"),
    ],
    "A trapezoid with bases 10 and 16 and the midsegment of 13 joining the midpoints of its legs.",
    "底为 10 和 16 的梯形，中位线 13 连接两腰中点。",
  ),
  "perimeter#perimeter-of-polygons": drawing(
    [
      rect(0, 0, 8, 5),
      side([0, 0], [8, 0], "8 cm"),
      side([8, 0], [8, 5], "5 cm"),
      side([8, 5], [0, 5], "8 cm"),
      side([0, 5], [0, 0], "5 cm"),
    ],
    "A rectangle 8 centimeters long and 5 wide: its perimeter is 26 centimeters.",
    "长 8 厘米、宽 5 厘米的长方形：周长 26 厘米。",
  ),
  "perimeter#missing-side-from-perimeter": drawing(
    [rect(0, 0, 9, 6), side([0, 0], [9, 0], "l = 9 m"), side([9, 0], [9, 6], "6 m"), text([4.5, 2.6], "P = 30 m")],
    "A rectangle with perimeter 30 meters and width 6: its length is 9.",
    "周长 30 米、宽 6 米的长方形：长为 9 米。",
  ),
  "area-of-rectangles-and-squares#area-of-a-rectangle": drawing(
    [...gridRect(8, 5), side([0, 0], [8, 0], "8 cm"), side([8, 0], [8, 5], "5 cm")],
    "A rectangle 8 centimeters by 5, covered by 5 rows of 8 unit squares: 40 square centimeters.",
    "8 厘米 × 5 厘米的长方形，由 5 行、每行 8 个单位方格铺满：40 平方厘米。",
  ),
  "area-of-rectangles-and-squares#missing-side-from-area": drawing(
    [rect(0, 0, 8, 6), side([0, 0], [8, 0], "8 m"), side([8, 0], [8, 6], "6 m"), text([4, 2.6], "48 m²")],
    "A rectangle with area 48 square meters and width 6 is 8 meters long.",
    "面积 48 平方米、宽 6 米的长方形，长 8 米。",
  ),
  "area-of-parallelograms#missing-base-or-height": drawing(
    [
      poly([0, 0], [9, 0], [12, 6], [3, 6]),
      dash([3, 0], [3, 6]),
      square([3, 0], [9, 0], [3, 6]),
      side([0, 0], [9, 0], "9 m"),
      text([3, 2.6], "6 m", "e"),
      text([6.5, 3.2], "54 m²"),
    ],
    "A parallelogram with area 54 square meters and base 9: its height is 6.",
    "面积 54 平方米、底 9 米的平行四边形：高 6 米。",
  ),
  "area-of-trapezoids#the-trapezoid-formula": drawing(
    [
      poly([0, 0], [10, 0], [8, 4], [2, 4]),
      {
        kind: "polygon",
        points: [
          [8, 4],
          [10, 0],
          [16, 0],
          [18, 4],
        ],
        tone: "action",
      },
      dash([2, 0], [2, 4]),
      side([0, 0], [10, 0], "10"),
      side([8, 4], [2, 4], "6"),
      text([2, 1.6], "4", "e"),
    ],
    "A trapezoid with bases 6 and 10 and height 4, and a copy turned over: together they make a parallelogram with base 16.",
    "底 6 和 10、高 4 的梯形，与翻转的一份合成底为 16 的平行四边形。",
  ),
  "composite-shapes-with-circles#areas-with-semicircles": drawing(
    [
      rect(0, 0, 10, 6),
      ...bend(-90, 90, 3, [10, 3]),
      wedge(-90, 90, 3, [10, 3], "result"),
      side([0, 0], [10, 0], "10 cm"),
      side([0, 6], [0, 0], "6 cm"),
      seg([10, 3], [13, 3], "action"),
      text([11.5, 3], "3 cm"),
    ],
    "A rectangle 10 by 6 with a semicircle of radius 3 on one side of 6.",
    "10 × 6 的长方形，在一条长 6 的边上有半径 3 的半圆。",
  ),
  "composite-shapes-with-circles#perimeters-with-semicircles": drawing(
    [
      seg([10, 0], [0, 0], "result"),
      seg([0, 0], [0, 6], "result"),
      seg([0, 6], [10, 6], "result"),
      ...bend(-90, 90, 3, [10, 3], "result"),
      dash([10, 0], [10, 6]),
      side([0, 0], [10, 0], "10"),
      side([0, 6], [0, 0], "6"),
      side([10, 6], [0, 6], "10"),
      text([13, 3], "3π", "e"),
    ],
    "Going around the outside: 10, 6, 10 and a curve of 3π, while the dashed side of 6 under the semicircle does not count.",
    "绕外围一周：10、6、10 和长 3π 的曲线；半圆下方长 6 的虚线边不计。",
  ),
  "composite-shapes-with-circles#regions-around-circles": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
        ],
        holes: [Array.from({ length: 96 }, (_, i) => on(i * 3.75, 3, [5, 5]))],
        tone: "result",
      },
      rect(0, 0, 10, 10),
      ring(3, [5, 5]),
      seg([5, 5], [8, 5]),
      text([6.5, 5], "3 m"),
      side([0, 0], [10, 0], "10 m"),
    ],
    "A circular pond of radius 3 in a square lawn of side 10: the grass is the shaded part.",
    "边长 10 的方形草坪中有半径 3 的圆形池塘：阴影部分是草地。",
  ),
  "finding-areas-and-perimeters-of-part-circles#areas-of-part-circles": drawing(
    [
      wedge(0, 90, 3),
      seg([0, 0], [3, 0]),
      seg([0, 0], [0, 3]),
      ...bend(0, 90, 3),
      text([1.5, 0], "6 cm", "s"),
      ...shift([wedge(0, 180, 2.5), seg([-2.5, 0], [2.5, 0]), ...bend(0, 180, 2.5), text([0, 0], "10 cm", "s")], 7),
    ],
    "A quarter circle of radius 6 and a semicircle of diameter 10, whose radius is 5.",
    "半径 6 的四分之一圆和直径 10（半径 5）的半圆。",
  ),
  "finding-areas-and-perimeters-of-part-circles#perimeters-of-part-circles": drawing(
    [
      seg([-2.5, 0], [2.5, 0], "action"),
      ...bend(0, 180, 2.5, [0, 0], "result"),
      text([0, 0], "10", "s"),
      text([0, 2.5], "5π"),
      ...shift(
        [
          seg([0, 0], [4, 0], "action"),
          seg([0, 0], [0, 4], "action"),
          ...bend(0, 90, 4, [0, 0], "result"),
          text([2, 0], "8", "s"),
          text([0, 2], "8", "w"),
          text(on(45, 4), "4π", "ne"),
        ],
        5,
      ),
    ],
    "A semicircle with arc 5π and diameter 10, and a quarter circle with arc 4π and two radii of 8.",
    "弧长 5π、直径 10 的半圆，弧长 4π、两条半径为 8 的四分之一圆。",
  ),
  "finding-areas-and-perimeters-of-part-circles#part-circles-with-approximations": drawing(
    [
      wedge(90, 360, 4),
      seg([0, 0], [4, 0], "action"),
      seg([0, 0], [0, 4], "action"),
      ...bend(90, 360, 4, [0, 0], "result"),
      text([2, 0], "4 cm", "n"),
      text([0, 2], "4 cm", "e"),
    ],
    "A three-quarter circle of radius 4: its perimeter is the arc and the two radii.",
    "半径 4 的四分之三圆：周长是弧和两条半径。",
  ),
  "volumes-of-triangular-prisms#volume-of-a-triangular-prism": drawing(
    [
      ...triPrism([0, 0], [6, 0], [2, 4], 7, 3),
      dash([2, 0], [2, 4]),
      side([0, 0], [6, 0], "6 cm"),
      text([2, 1.8], "4 cm", "e"),
      text([9.5, 1.5], "10 cm", "e"),
    ],
    "A prism whose triangular face has base 6 and height 4, and which is 10 long.",
    "三角形面底 6、高 4，长为 10 的棱柱。",
  ),
  "surface-areas-of-triangular-prisms#surface-area-of-a-right-triangular-prism": drawing(
    [
      ...triPrism([0, 0], [4, 0], [0, 3], 7, 3),
      square([0, 0], [4, 0], [0, 3]),
      side([0, 0], [4, 0], "4"),
      side([0, 3], [0, 0], "3"),
      side([4, 0], [0, 3], "5"),
      text([7.5, 1.5], "10", "e"),
    ],
    "A prism 10 long on a right triangle with legs 3 and 4 and slanted side 5.",
    "长 10 的棱柱，底面是直角边 3、4，斜边 5 的直角三角形。",
  ),
  "surface-areas-of-triangular-prisms#tents-and-roofs": drawing(
    [
      ...triPrism([0, 0], [6, 0], [3, 4], 6, 2.5),
      dash([3, 0], [3, 4]),
      side([0, 0], [6, 0], "6 ft"),
      side([3, 4], [0, 0], "5 ft"),
      text([3, 1.8], "4 ft", "e"),
      text([9, 1.25], "8 ft", "e"),
    ],
    "A tent on an isosceles triangle with base 6, height 4 and slanted sides 5, and 8 long.",
    "以底 6、高 4、斜边 5 的等腰三角形为端面，长 8 的帐篷。",
  ),
  "calculating-modes-and-medians-from-histograms#the-modal-class-from-a-histogram": drawing(
    histogram([10, 20, 30, 40, 50], [4, 9, 12, 5], { 2: "result" }),
    "A histogram with heights 4, 9, 12 and 5: the tallest bar stands over the class from 30 to 40.",
    "高为 4、9、12、5 的直方图：最高的条形在 30 到 40 这一组上。",
  ),
  "calculating-modes-and-medians-from-histograms#the-class-of-the-median-from-a-histogram": drawing(
    [...histogram([10, 20, 30, 40, 50], [4, 9, 12, 5], { 2: "action" }), text([3.3, 4.2], "4, 13, 25, 30", "n")],
    "A histogram with heights 4, 9, 12 and 5, running totals 4, 13, 25 and 30: the 15th and 16th values are in the third bar.",
    "高为 4、9、12、5 的直方图，累计 4、13、25、30：第 15、16 个值在第三个条形内。",
  ),
  "calculating-means-from-histograms#estimating-a-total-from-a-histogram": drawing(
    [
      ...histogram([0, 10, 20, 30], [4, 9, 7]),
      ...[5, 15, 25].map((_, i): Mark => ({ kind: "dot", at: [1.1 + i * 2.2, 0], tone: "result" })),
    ],
    "A histogram with heights 4, 9 and 7, with the midpoints 5, 15 and 25 dotted on the classes: 20 + 135 + 175 = 330.",
    "高为 4、9、7 的直方图，各组中点 5、15、25 用点标出：20 + 135 + 175 = 330。",
  ),
  "calculating-means-from-histograms#estimating-a-mean-from-a-histogram": drawing(
    histogram([0, 10, 20, 30], [4, 9, 7]),
    "A histogram with heights 4, 9 and 7: 20 values in all, and the estimated total 330 gives a mean of 16.5.",
    "高为 4、9、7 的直方图：共 20 个值，估计总和 330，平均数 16.5。",
  ),
  "comparing-medians#medians-on-box-plots": drawing(
    [
      ...boxPlot([6, 12, 16, 20, 26], 0, 1.2, 0.5, "A"),
      ...boxPlot([3, 8, 11, 15, 22], 0, 0, 0.5, "B"),
      dash([8, 1.6], [8, -0.8]),
      dash([5.5, 1.6], [5.5, -0.8]),
      text([8, -0.8], "16", "s"),
      text([5.5, -0.8], "11", "s"),
    ],
    "Two box plots on one scale: the line inside A's box is at 16 and inside B's box at 11.",
    "同一刻度上的两个箱线图：A 箱内的线在 16，B 箱内的线在 11。",
  ),
  "comparing-data-sets-using-range-and-quartiles#ranges-and-iqrs-on-box-plots": drawing(
    [
      ...boxPlot([4, 9, 12, 14, 20], 0, 1.2, 0.5, "A"),
      ...boxPlot([6, 10, 11, 15, 17], 0, 0, 0.5, "B"),
      ...[0, 5, 10, 15, 20].flatMap((v) => [seg([v * 0.5, -0.9], [v * 0.5, -0.75]), text([v * 0.5, -0.9], String(v), "s")]),
      seg([0, -0.75], [10, -0.75]),
    ],
    "Box plots of A with 4, 9, 12, 14, 20 and of B with 6, 10, 11, 15, 17: the ranges are 16 and 11 and both IQRs are 5.",
    "A 为 4、9、12、14、20，B 为 6、10、11、15、17 的箱线图：极差 16 和 11，四分位距都是 5。",
  ),
  "comparing-data-set-visualizations-using-standard-deviation-and-mad#shifted-data-keeps-its-spread": drawing(
    (() => {
      const a = [1, 2, 2, 3, 3, 3, 4];
      const one = (v: readonly number[], y: number, tone: "action" | "result"): Mark[] => {
        const seen = new Map<number, number>();
        return v.map((x): Mark => {
          const n = seen.get(x) ?? 0;
          seen.set(x, n + 1);
          return { kind: "dot", at: [x, y + 0.35 + n * 0.4], tone };
        });
      };
      return [
        ...realLine(0, 10, 1, 2.2),
        ...one(a, 2.2, "action"),
        text([11, 2.5], "A", "e"),
        ...realLine(0, 10, 1, 0),
        ...one(
          a.map((x) => x + 5),
          0,
          "result",
        ),
        text([11, 0.3], "B", "e"),
      ];
    })(),
    "A dot plot and the same plot moved 5 to the right: its shape does not change.",
    "点图和向右平移 5 的相同点图：形状不变。",
  ),
  "slope-intercept-form#reading-from-a-graph": graphed(
    view(-3, 6, 1, -5, 5),
    [
      ln([0, -3], [2, 2]),
      edge([0, -3], [2, -3], "action", true),
      edge([2, -3], [2, 2], "action", true),
      pt([0, -3], "(0, −3)", "w", "result"),
      pt([2, 2], "(2, 2)", "nw"),
    ],
    "A line crossing the y-axis at (0, −3) and through (2, 2): the rise is 5 and the run 2.",
    "交 y 轴于 (0, −3) 且过 (2, 2) 的直线：升高 5，水平 2。",
  ),
  "systems-with-no-solution-or-infinitely-many-solutions#by-slopes-and-intercepts": drawing(
    [
      ...mini(0, [seg([-2, -1.4], [2, 1.4], "action"), seg([-2, 1], [2, -0.6], "result"), { kind: "dot", at: [0.5, 0.35] }], "1"),
      ...mini(6, [seg([-2, -1.4], [2, 0.6], "action"), seg([-2, -0.2], [2, 1.8], "result")], "0"),
      ...mini(12, [seg([-2, -1], [2, 1], "action"), seg([-2, -1], [2, 1], "result", true)], "∞"),
    ],
    "Lines with different slopes cross once; equal slopes with different intercepts are parallel, with no solution; the same line gives infinitely many.",
    "斜率不同的直线相交一次；斜率相同、截距不同的平行，无解；同一条直线有无穷多解。",
  ),
  "corresponding-angles#identifying-corresponding-angles": transversal(
    {
      angles: [
        [2, "accent"],
        [6, "accent"],
      ],
    },
    "Two lines cut by a transversal, with the corresponding angles at the upper right of each crossing marked.",
    "被截线所截的两条直线，标出每个交点右上方的同位角。",
  ),
  "corresponding-angles#using-corresponding-angles": transversal(
    {
      angles: [
        [2, "accent", "65°"],
        [6, "accent", "65°"],
      ],
    },
    "Parallel lines cut by a transversal: the angle of 65° above ℓ, right of the transversal, equals the corresponding angle at m.",
    "被截线所截的平行线：ℓ 上方、截线右边的 65° 角等于 m 处的同位角。",
  ),
  "alternate-angles#identifying-alternate-angles": transversal(
    {
      angles: [
        [4, "accent", ""],
        [5, "accent", ""],
        [1, "action", ""],
        [8, "action", ""],
      ],
    },
    "Alternate interior angles marked in one color, between the lines, and alternate exterior angles in another, outside them.",
    "一种颜色标出两线之间的内错角，另一种颜色标出两线之外的外错角。",
  ),
  "alternate-angles#alternate-angle-equations": transversal(
    {
      angles: [
        [4, "accent", "(3x − 15)°"],
        [5, "accent", "(x + 45)°"],
      ],
    },
    "Parallel lines with alternate interior angles of (3x − 15)° and (x + 45)°, which are equal.",
    "内错角为 (3x − 15)° 和 (x + 45)° 的平行线，两角相等。",
  ),
  "alternate-angles#the-angle-at-a-bend-between-parallel-lines": drawing(
    [
      seg([-1, 4], [8, 4]),
      seg([-1, 0], [8, 0]),
      arrows([0, 4], [1, 4]),
      arrows([0, 0], [1, 0]),
      dash([-1, 2], [8, 2]),
      seg([1, 4], [4, 2], "action"),
      seg([4, 2], [1, 0], "action"),
      angle([4, 2], [1, 4], [-1, 2], "accent"),
      angle([4, 2], [-1, 2], [1, 0], "result"),
      angle([1, 4], [4, 2], [8, 4], "accent"),
      angle([1, 0], [8, 0], [4, 2], "result"),
    ],
    "A path bending between parallel lines, and a third parallel line through the bend: each part of the bend equals an alternate angle at a line.",
    "在平行线间弯折的路径，过弯折点作第三条平行线：弯折角的每一部分等于直线处的一个内错角。",
  ),
  "consecutive-angles#consecutive-angle-equations": transversal(
    {
      angles: [
        [3, "accent", "85°"],
        [5, "action", "95°"],
      ],
    },
    "Consecutive interior angles of (2x + 15)° and (3x − 10)°, which are 85° and 95° when x = 35.",
    "同旁内角 (2x + 15)° 和 (3x − 10)°，x = 35 时为 85° 和 95°。",
  ),
  "angle-criteria-for-parallel-lines#are-the-lines-parallel": transversal(
    {
      marked: false,
      angles: [
        [4, "accent", "68°"],
        [5, "action", "72°"],
      ],
    },
    "Two lines cut by a transversal with alternate interior angles of 68° and 72°, which differ, so the lines are not parallel.",
    "内错角为 68° 和 72° 的两条直线，两角不等，所以不平行。",
  ),
  "exterior-angles-of-triangles#the-exterior-angle-theorem": drawing(
    (() => {
      const [a, b, c] = fromAngles(50, 70, 6);
      const d: Point = [c[0] + (c[0] - a[0]) * 0.6, c[1] + (c[1] - a[1]) * 0.6];
      return [poly(a, b, c), seg(c, d), angle(a, b, c, "accent", "a"), angle(b, c, a, "accent", "b"), angle(c, d, b, "result", "a + b")];
    })(),
    "A triangle with one side extended: the exterior angle equals the sum of the two remote interior angles.",
    "一边延长的三角形：外角等于两个不相邻内角之和。",
  ),
  "exterior-angles-of-triangles#exterior-angle-equations": drawing(
    (() => {
      const [a, b, c] = fromAngles(35, 75, 6);
      const d: Point = [c[0] + (c[0] - a[0]) * 0.6, c[1] + (c[1] - a[1]) * 0.6];
      return [
        poly(a, b, c),
        seg(c, d),
        angle(a, b, c, "accent", "x°"),
        angle(b, c, a, "accent", "(2x + 5)°"),
        angle(c, d, b, "result", "110°"),
      ];
    })(),
    "Remote interior angles of x° and (2x + 5)° and an exterior angle of 110°: x = 35.",
    "不相邻内角 x° 和 (2x + 5)°，外角 110°：x = 35。",
  ),
  "problem-solving-with-angles-of-triangles#angles-in-a-ratio": drawing(
    (() => {
      const [a, b, c] = fromAngles(40, 60, 6);
      return [poly(a, b, c), angle(a, b, c, "accent", "40°"), angle(b, c, a, "accent", "60°"), angle(c, a, b, "accent", "80°")];
    })(),
    "A triangle with angles in the ratio 2 : 3 : 4: 40°, 60° and 80°.",
    "角之比为 2 : 3 : 4 的三角形：40°、60°、80°。",
  ),
  "the-triangle-inequality#range-of-the-third-side": drawing(
    [
      seg([0, 0], [9, 0]),
      seg([0, 0.25], [5, 0.25], "action"),
      text([4.5, 0], "c = 4 ✗", "s"),
      ...shift(
        [seg([0, 0], [14, 0]), seg([0, 0.25], [5, 0.25], "action"), seg([5, 0.25], [14, 0.25], "result"), text([7, 0], "c = 14 ✗", "s")],
        0,
      ).map((m) => shiftY(m, -2)),
      ...shift([poly(...fromSides(9, 5, 8)), text([4.5, 0], "9", "s"), text([1, 2.5], "c", "w"), text([7, 1.8], "5", "e")], 11),
    ],
    "Sides 5 and 9: a third side of 4 or 14 would lie flat, and a side between them closes a triangle.",
    "边 5 和 9：第三边为 4 或 14 时会压成一条线，介于两者之间才能围成三角形。",
  ),
  "isosceles-triangles#base-angles": drawing(
    (() => {
      const [a, b, c] = fromAngles(70, 70, 3.2);
      return [
        poly(a, b, c),
        ticks(b, c),
        ticks(c, a),
        angle(a, b, c, "accent", "70°"),
        angle(b, c, a, "accent", "70°"),
        angle(c, a, b, "action", "40°"),
      ];
    })(),
    "An isosceles triangle with vertex angle 40°: the base angles share 140°, so each is 70°.",
    "顶角 40° 的等腰三角形：底角平分 140°，各 70°。",
  ),
  "angles-of-polygons#missing-angles-in-polygons": drawing(
    (() => {
      const a: Point = [0, 0];
      const b: Point = [6, 0];
      const d = on(80, 7.13);
      const c: Point = [6 + 4.63 * Math.cos((85 * Math.PI) / 180), 4.63 * Math.sin((85 * Math.PI) / 180)];
      return [
        poly(a, b, c, d),
        angle(a, b, d, "accent", "80°"),
        angle(b, c, a, "accent", "95°"),
        angle(c, d, b, "accent", "110°"),
        angle(d, a, c, "result", "75°"),
      ];
    })(),
    "A quadrilateral with angles of 80°, 95° and 110°: the fourth is 75°.",
    "有 80°、95°、110° 三个角的四边形：第四个角是 75°。",
  ),
  "regular-polygons#recognizing-regular-polygons": drawing(
    [poly([1.3, 0], [2.6, 1.8], [1.3, 3.6], [0, 1.8]), ...shift([rect(0, 0.6, 3.8, 2)], 3.8), ...shift([rect(0, 0.3, 2.8, 2.8)], 9)],
    "A rhombus with equal sides only, a rectangle with equal angles only, and a square with both.",
    "菱形只有边相等，长方形只有角相等，正方形两者兼有。",
  ),
  "understanding-and-proving-the-pythagorean-theorem#squares-on-the-sides": drawing(
    [
      poly([0, 0], [4, 0], [0, 3]),
      square([0, 0], [4, 0], [0, 3]),
      fill(0, -4, 4, 4, "action"),
      rect(0, -4, 4, 4),
      text([2, -2.3], "16"),
      fill(-3, 0, 3, 3, "action"),
      rect(-3, 0, 3, 3),
      text([-1.5, 1.2], "9"),
      {
        kind: "shade",
        points: [
          [4, 0],
          [7, 4],
          [3, 7],
          [0, 3],
        ],
        tone: "result",
      },
      poly([4, 0], [7, 4], [3, 7], [0, 3]),
      text([3.5, 3.2], "25"),
    ],
    "A square on each side of a right triangle, with areas 9 and 16 on the legs and 25 on the hypotenuse.",
    "直角三角形每边上的正方形：直角边上面积 9 和 16，斜边上 25。",
  ),
  "understanding-and-proving-the-pythagorean-theorem#the-rearrangement-proof": drawing(
    [
      rect(0, 0, 7, 7),
      {
        kind: "shade",
        points: [
          [3, 0],
          [7, 3],
          [4, 7],
          [0, 4],
        ],
        tone: "result",
      },
      poly([3, 0], [7, 3], [4, 7], [0, 4]),
      side([0, 0], [3, 0], "3"),
      side([3, 0], [7, 0], "4"),
      text([3.5, 3.2], "c²"),
    ],
    "Four right triangles with legs 3 and 4 in the corners of a square of side 7, leaving a square of side c in the middle.",
    "边长 7 的正方形四角放四个直角边 3、4 的直角三角形，中间留下边长 c 的正方形。",
  ),
  "understanding-and-proving-the-pythagorean-theorem#the-inner-square-proof": drawing(
    [
      poly([0, 0], [5, -3], [8, 2], [3, 5]),
      fill(3, 0, 2, 2),
      seg([0, 0], [5, 0]),
      seg([5, -3], [5, 2]),
      seg([8, 2], [3, 2]),
      seg([3, 5], [3, 0]),
      side([3, 0], [5, 0], "2"),
    ],
    "A square of side c cut into four right triangles with legs 3 and 5 and a small square of side 2.",
    "边长 c 的正方形切成四个直角边 3、5 的直角三角形和一个边长 2 的小正方形。",
  ),
  "solving-real-world-problems-using-the-pythagorean-theorem#ladders-ramps-and-wires": rightTriangle(
    { legs: [6, 8], a: "6 ft", b: "8 ft", c: "10 ft" },
    "A ladder of 10 feet with its foot 6 feet from a wall: it reaches 8 feet up.",
    "10 英尺的梯子，脚距墙 6 英尺：够到 8 英尺高。",
  ),
  "solving-real-world-problems-using-the-pythagorean-theorem#diagonals-of-rectangles": drawing(
    [
      rect(0, 0, 12, 5),
      seg([0, 0], [12, 5], "result"),
      square([12, 0], [12, 5], [0, 0]),
      side([0, 0], [12, 0], "48 in"),
      side([12, 0], [12, 5], "20 in"),
      text([6, 2.7], "52 in", "nw"),
    ],
    "A screen 48 inches wide and 20 tall, with a diagonal of 52: the width and height are the legs.",
    "宽 48 英寸、高 20 英寸的屏幕，对角线 52：宽和高是直角边。",
  ),
  "solving-real-world-problems-using-the-pythagorean-theorem#shortcuts": drawing(
    [
      seg([0, 0], [4, 0], "action"),
      seg([4, 0], [4, 3], "action"),
      seg([0, 0], [4, 3], "result"),
      square([4, 0], [4, 3], [0, 0]),
      side([0, 0], [4, 0], "40 m"),
      side([4, 0], [4, 3], "30 m"),
      text([2, 1.6], "50 m", "nw"),
    ],
    "Along sides of 40 and 30 you walk 70 meters, and straight across 50.",
    "沿 40 和 30 的边走 70 米，直穿走 50 米。",
  ),
  "finding-the-distance-between-two-points-using-the-pythagorean-theorem#distance-on-the-grid": graphed(
    view(-1, 7),
    [
      edge([1, 2], [4, 2], "action", true),
      edge([4, 2], [4, 6], "action", true),
      edge([1, 2], [4, 6], "result"),
      pt([1, 2], "(1, 2)", "sw"),
      pt([4, 6], "(4, 6)", "ne"),
    ],
    "A segment from (1, 2) to (4, 6) as the hypotenuse of a right triangle with legs 3 and 4.",
    "从 (1, 2) 到 (4, 6) 的线段是直角边 3、4 的直角三角形的斜边。",
  ),
  "applying-the-pythagorean-theorem-to-three-dimensional-figures#the-diagonal-of-a-box": drawing(
    (() => {
      const { marks, corners } = boxMarks(4, 3, 12);
      const [a, c, g, b, f] = [corners.A, corners.C, corners.G, corners.B, corners.F] as Point[];
      return [
        ...marks,
        seg(a as Point, c as Point, "action"),
        seg(a as Point, g as Point, "result"),
        seg(c as Point, g as Point, "accent"),
        side(a as Point, b as Point, "4"),
        side(b as Point, c as Point, "3"),
        side(b as Point, f as Point, "12"),
      ];
    })(),
    "A 3 by 4 by 12 box: the diagonal of the bottom and the height form a right triangle with the diagonal of the box.",
    "3 × 4 × 12 的盒子：底面对角线和高与盒子的对角线组成直角三角形。",
  ),
  "applying-the-pythagorean-theorem-to-three-dimensional-figures#heights-and-slant-heights": drawing(
    coneMarks(2.4, 4, "r", "h", "l"),
    "Inside a right cone, the height h, the radius r and the slant height l form a right triangle.",
    "直圆锥内，高 h、半径 r 和斜高 l 组成直角三角形。",
  ),
  "applying-the-pythagorean-theorem-to-three-dimensional-figures#the-longest-rod-in-a-cylinder": drawing(
    [...cylinderMarks(3, 8, "3 cm", "8 cm"), seg([-3, 0], [3, 8], "result"), seg([-3, 0], [3, 0], "action")],
    "A can of radius 3 and height 8, with the rod from the bottom rim to the opposite top rim; the legs are the diameter of 6 and the height of 8.",
    "半径 3、高 8 的罐子，棒从底缘到对面的顶缘；直角边是直径 6 和高 8。",
  ),
  "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres#volumes-of-composite-solids": drawing(
    [...cylinderMarks(3, 10, "3 m", "10 m"), ...bend(0, 180, 3, [0, 10], undefined), ...ellipse([0, 10], 3, 0.9, true)],
    "A silo: a cylinder of radius 3 and height 10 topped by a hemisphere of radius 3.",
    "筒仓：半径 3、高 10 的圆柱，上方是半径 3 的半球。",
  ),
  "scatter-plots#making-a-scatter-plot": graphed(
    view(-1, 9),
    [
      pt([2, 7], "(2, 7)", "ne", "result"),
      pt([7, 2], "(7, 2)", "ne", "action"),
      edge([0, 0], [2, 0], "action", true),
      edge([2, 0], [2, 7], "action", true),
    ],
    "The pair x = 2, y = 7: go right 2, then up 7, to (2, 7), not to (7, 2).",
    "数对 x = 2、y = 7：向右 2，再向上 7，到 (2, 7)，不是 (7, 2)。",
  ),
};

/** shiftY moves a mark up or down. */
function shiftY(m: Mark, dy: number): Mark {
  return shift([m], 0, dy)[0] as Mark;
}
