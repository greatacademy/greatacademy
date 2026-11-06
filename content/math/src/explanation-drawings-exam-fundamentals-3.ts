// Drawings of the ACT fundamentals explanations: strips, boxes, inverse tangents, hyperbolas, inscribed polygons, number lines and rigid motions.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { box, cornerMark, dash, fill, moved, numberLine, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { angle, boxMarks, drawing, fromSides, graphed, note, on, ring, seg, square, type Triangle } from "./explanation-drawings-kit.ts";

/** round draws a circle on a coordinate plane. */
const round = (center: Point, r: number, tone?: "action" | "result"): PlaneMark => ({ kind: "circle", center, r, tone }) as PlaneMark;

/** dot marks a point of a drawing. */
const dot = (at: Point, tone?: "action" | "result"): Mark => ({ kind: "dot", at, ...(tone && { tone }) });

/** rect lists the corners of a rectangle counterclockwise. */
const rect = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** hyperbola draws both branches of x²/a² − y²/b² = 1 up to the edge x = ±reach. */
const hyperbola = (a: number, b: number, reach: number): PlaneMark[] => {
  const y = (x: number): number => b * Math.sqrt(Math.max(0, (x * x) / (a * a) - 1));
  return [
    curveOf(y, undefined, a, reach),
    curveOf((x) => -y(x), undefined, a, reach),
    curveOf(y, undefined, -reach, -a),
    curveOf((x) => -y(x), undefined, -reach, -a),
  ];
};

/** polygonAround lists the corners of a regular polygon around the origin, starting at the angle from. */
const polygonAround = (n: number, r: number, from = 0): Point[] => Array.from({ length: n }, (_, i) => on(from + (360 * i) / n, r));

/** outline draws the closed outline through the points. */
const outline = (points: readonly Point[], style?: "action" | "result"): Mark[] =>
  points.map((p, i) => seg(p, points[(i + 1) % points.length] as Point, style));

/** turned rotates a triangle about the origin by deg degrees and moves it by (dx, dy). */
const turned = (t: Triangle, deg: number, dx: number, dy: number): Triangle => {
  const c = Math.cos((deg * Math.PI) / 180);
  const s = Math.sin((deg * Math.PI) / 180);
  const go = (p: Point): Point => [p[0] * c - p[1] * s + dx, p[0] * s + p[1] * c + dy];
  return [go(t[0]), go(t[1]), go(t[2])];
};

/** stairs lists a staircase of n steps from a point, each a run and then a rise. */
const stairs = (from: Point, run: number, rise: number, n: number): Point[] => {
  const out: Point[] = [from];
  for (let i = 0; i < n; i++) {
    const [x, y] = out[out.length - 1] as Point;
    out.push([x + run, y], [x + run, y + rise]);
  }
  return out;
};

const a60: Point[] = polygonAround(6, 5);

/** examFundamentalsDrawings3 draws the explanations of ACT Math Fundamentals, by knowledge point: strips, boxes, inverse tangents, hyperbolas, inscribed polygons, number lines and rigid motions. */
export const examFundamentalsDrawings3: Readonly<Record<string, Figure>> = {
  "systems-with-a-circle-and-a-line#the-chord-cut-by-a-horizontal-line": graphed(
    wide(-7, 7, -6, 6, 99),
    [round([0, 0], 5), solid([-4, 3], [4, 3], "result"), pt([-4, 3], "(−4, 3)", "nw"), pt([4, 3], "(4, 3)", "ne"), tag([2, 3], "8", "s")],
    "For example, the circle x² + y² = 25 and the line y = 3. The height gives x = 4 or x = −4, so the colored chord is twice 4, which is 8.",
    "例如，圆 x² + y² = 25 和直线 y = 3。代入高度得 x = 4 或 x = −4，所以标色的弦是 4 的两倍，即 8。",
  ),
  "finding-the-length-of-a-trapezoid-midsegment#the-midsegment-from-the-bases": drawing(
    [
      ...outline([
        [0, 0],
        [16, 0],
        [14, 6],
        [4, 6],
      ]),
      seg([2, 3], [15, 3], "result"),
      note([9, 6], "10", "n"),
      note([8, 0], "16", "s"),
      note([8.5, 3], "13", "n"),
      note([4, 6], "A", "nw"),
      note([14, 6], "B", "ne"),
      note([16, 0], "C", "se"),
      note([0, 0], "D", "sw"),
      note([2, 3], "E", "w"),
      note([15, 3], "F", "e"),
    ],
    "A trapezoid with bases 10 and 16. The colored midsegment EF joins the midpoints of the legs, and its length is their average, 13.",
    "底为 10 和 16 的梯形。标色的中位线 EF 连接两腰的中点，长度是两底的平均数 13。",
  ),
  "finding-the-area-covered-by-crossing-rectangular-strips#the-area-of-the-strips": drawing(
    [
      fill(rect(0, 5, 20, 2), "action"),
      fill(rect(8, 0, 3, 12), "action"),
      fill(rect(8, 5, 3, 2), "result"),
      ...box(0, 0, 20, 12, { bottom: "20", right: "12" }),
      note([0, 6], "2", "w"),
      note([9.5, 12], "3", "n"),
    ],
    "A 20 by 12 lawn with paths 2 and 3 wide. The darkest rectangle, 2 by 3, lies in both paths, so it is subtracted once: 40 + 36 − 6 = 70.",
    "20 乘 12 的草坪，小路宽 2 和 3。颜色最深的 2 乘 3 矩形同时在两条小路上，所以减去一次：40 + 36 − 6 = 70。",
  ),
  "finding-the-area-covered-by-crossing-rectangular-strips#the-area-left-uncovered": drawing(
    [
      fill(rect(0, 0, 8, 4), "result"),
      fill(rect(10, 0, 10, 4), "result"),
      fill(rect(0, 7, 8, 5), "result"),
      fill(rect(10, 7, 10, 5), "result"),
      ...box(0, 0, 20, 12, { bottom: "20", right: "12" }),
      note([0, 5.5], "3", "w"),
      note([9, 12], "2", "n"),
      ...box(26, 0, 18, 9, { bottom: "18", right: "9", inside: "162", shade: "result" }),
    ],
    "On the left, paths 3 and 2 wide leave four colored corner pieces. On the right, the pieces slide together into one rectangle, 18 by 9, with area 162.",
    "左图中，宽 3 和 2 的小路留下四块标色的角。右图中，这四块拼成一个 18 乘 9 的矩形，面积是 162。",
  ),
  "finding-the-area-covered-by-crossing-rectangular-strips#the-width-from-the-area-left": drawing(
    [
      fill(rect(0, 0, 4, 3), "result"),
      fill(rect(6, 0, 4, 3), "result"),
      fill(rect(0, 5, 4, 3), "result"),
      fill(rect(6, 5, 4, 3), "result"),
      ...box(0, 0, 10, 8, { bottom: "10", right: "8" }),
      note([0, 4], "x", "w"),
      note([5, 8], "x", "n"),
      ...box(14.5, 0, 8, 6, { bottom: "10 − x", right: "8 − x", inside: "48", shade: "result" }),
    ],
    "For example, a 10 by 8 rectangle with an area of 48 left. The colored pieces fit together with sides 10 − x and 8 − x, and the factor pair 8 and 6 gives x = 2.",
    "例如，10 乘 8 的矩形，剩余面积 48。标色的部分拼成边长 10 − x 和 8 − x 的矩形，因数对 8 和 6 给出 x = 2。",
  ),
  "reasoning-from-a-rectangular-prism#the-diagonal-through-a-box": (() => {
    const { marks, corners } = boxMarks(3, 2, 6);
    const a = corners.A as Point;
    const c = corners.C as Point;
    const g = corners.G as Point;
    return drawing(
      [
        ...marks,
        seg(a, c, "action", true),
        seg(a, g, "result"),
        note([1.5, 0], "3", "s"),
        note([3.45, 0.35], "2", "se"),
        note([3.9, 3.7], "6", "e"),
        note([1.7, 3.6], "7", "nw"),
      ],
      "A 2 by 3 by 6 box. The dashed base diagonal and the height 6 are the legs of a right triangle, and the colored diagonal through the box is √(4 + 9 + 36) = 7.",
      "2 乘 3 乘 6 的长方体。虚线的底面对角线和高 6 是直角三角形的直角边，标色的体对角线是 √(4 + 9 + 36) = 7。",
    );
  })(),
  "writing-angles-as-inverse-tangents#an-angle-from-its-legs": drawing(
    rt(12, 5, { sides: ["12", "5"], sideStyles: [undefined, "result"], angles: ["A"], angleStyles: ["action"] }),
    "A right triangle with the colored leg 5 opposite angle A and the leg 12 next to it, so A = tan⁻¹(5/12).",
    "直角三角形中，标色的直角边 5 是角 A 的对边，12 是邻边，所以 A = tan⁻¹(5/12)。",
  ),
  "writing-angles-as-inverse-tangents#the-angle-of-a-line": drawing(
    [
      seg([-1, 0], [6, 0]),
      seg([0, -1], [0, 4.5]),
      note([6, 0], "x", "e"),
      note([0, 4.5], "y", "n"),
      seg([-0.8, -0.6], [5.2, 3.9]),
      seg([4, 0], [4, 3], "result", true),
      square([4, 0], [0, 0], [4, 3]),
      dot([4, 3]),
      dot([0, 0]),
      angle([0, 0], [1, 0], [4, 3], "action", "θ"),
      note([4, 3], "(4, 3)", "nw"),
      note([4, 1.5], "3", "e"),
      note([2, 0], "4", "s"),
    ],
    "The line through (0, 0) and (4, 3) rises the colored 3 over a run of 4. Its angle with the positive x-axis is θ = tan⁻¹(3/4).",
    "过 (0, 0) 和 (4, 3) 的直线，水平走 4，上升标色的 3。它与 x 轴正方向的夹角是 θ = tan⁻¹(3/4)。",
  ),
  "writing-angles-as-inverse-tangents#the-other-acute-angle": drawing(
    rt(12, 5, { sides: ["12", "5"], angles: ["A", undefined, "B"], angleStyles: ["action", undefined, "result"] }),
    "For example, legs 5 and 12. From A, tan A = 5/12. From B the legs trade places, so tan B = 12/5, and the two colored angles add up to 90°.",
    "例如，直角边 5 和 12。从 A 看，tan A = 5/12。从 B 看两条直角边交换，所以 tan B = 12/5，两个标色的角相加为 90°。",
  ),
  "recovering-unstated-features-of-hyperbolas#foci-from-a-vertex-and-an-asymptote": graphed(
    wide(-8, 8, -6, 6, 99),
    [
      ...hyperbola(4, 3, 7.6),
      { kind: "line", a: [0, 0], b: [4, 3], tone: "action", dashed: true } as PlaneMark,
      { kind: "line", a: [0, 0], b: [4, -3], tone: "action", dashed: true } as PlaneMark,
      pt([4, 0], "(4, 0)", "nw"),
      pt([5, 0], "(5, 0)", "se", "result"),
      pt([-5, 0], "(−5, 0)", "sw", "result"),
      tag([5.6, 4.2], "y = 3x/4", "nw"),
    ],
    "The hyperbola with vertex (4, 0) and dashed asymptote y = 3x/4, so a = 4 and b = 3. Then c = 5, which places the colored foci at (±5, 0).",
    "顶点 (4, 0)、虚线渐近线 y = 3x/4 的双曲线，所以 a = 4，b = 3。于是 c = 5，标色的焦点在 (±5, 0)。",
  ),
  "recovering-unstated-features-of-hyperbolas#the-asymptote-from-vertices-and-foci": graphed(
    wide(-8, 8, -7, 7, 99),
    [
      ...hyperbola(3, 4, 6),
      { kind: "line", a: [0, 0], b: [3, 4], tone: "result", dashed: true } as PlaneMark,
      { kind: "line", a: [0, 0], b: [3, -4], tone: "result", dashed: true } as PlaneMark,
      pt([3, 0], "(3, 0)", "nw"),
      pt([5, 0], "(5, 0)", "se", "action"),
      pt([-5, 0], "(−5, 0)", "sw", "action"),
    ],
    "For example, vertices (±3, 0) and foci (±5, 0), so a = 3, c = 5 and b = 4. The colored asymptotes have slopes ±4/3.",
    "例如，顶点 (±3, 0)，焦点 (±5, 0)，所以 a = 3，c = 5，b = 4。标色的渐近线斜率是 ±4/3。",
  ),
  "reasoning-from-incomplete-linear-graphs#an-output-past-the-grid": drawing(
    pane(0, [0, 12, 4], [0, 18, 2], 6, 5)
      .path(stairs([3, 5], 2, 3, 4), "action")
      .f((x) => 1.5 * x + 0.5, 1, 3)
      .f((x) => 1.5 * x + 0.5, 3, 11, undefined, true)
      .dot(1, 2, "", "se")
      .dot(3, 5, "(3, 5)", "nw")
      .dot(11, 17, "(11, 17)", "w", "result")
      .marks(),
    "From (1, 2) to (3, 5), each run of 2 adds a rise of 3. Four more of these steps, in color, reach x = 11 at the height y = 17.",
    "从 (1, 2) 到 (3, 5)，每走 2 上升 3。再走四步这样的台阶（标色），到达 x = 11，高度 y = 17。",
  ),
  "reasoning-from-incomplete-linear-graphs#an-input-for-an-output-past-the-grid": drawing(
    pane(0, [0, 24, 8], [0, 16, 2], 6, 5)
      .path(stairs([5, 3], 3, 2, 6), "action")
      .f((x) => (2 * x - 1) / 3, 2, 5)
      .f((x) => (2 * x - 1) / 3, 5, 23, undefined, true)
      .dot(2, 1, "(2, 1)", "se")
      .dot(5, 3, "(5, 3)", "nw")
      .dot(23, 15, "(23, 15)", "w", "result")
      .marks(),
    "From (2, 1) to (5, 3), each rise of 2 comes with a run of 3. Six more rises, in color, climb to y = 15 at x = 23.",
    "从 (2, 1) 到 (5, 3)，每上升 2 走 3。再上升六次（标色），到达 y = 15，此时 x = 23。",
  ),
  "reasoning-from-inscribed-special-polygons#a-hexagon-and-its-circle": drawing(
    [
      ring(5),
      fill([[0, 0], a60[0] as Point, a60[1] as Point], "result"),
      ...outline(a60),
      seg([0, 0], a60[0] as Point),
      seg([0, 0], a60[1] as Point),
      angle([0, 0], a60[0] as Point, a60[1] as Point, undefined, "60°"),
      note(on(60, 2.5), "5", "nw"),
      note(on(0, 2.5), "5", "s"),
      note(on(30, 4.3), "5", "sw"),
    ],
    "A circle with circumference 10π has radius 5. The colored triangle has two radii and a 60° angle, so it is equilateral and each side of the hexagon is 5, giving a perimeter of 30.",
    "周长 10π 的圆半径是 5。标色的三角形有两条半径和 60° 的角，所以是等边三角形，六边形每边是 5，周长是 30。",
  ),
  "reasoning-from-inscribed-special-polygons#the-hexagon-and-the-triangle-on-alternate-vertices": (() => {
    const inner = [a60[1], a60[3], a60[5]] as Point[];
    return drawing(
      [ring(5), fill(inner, "result"), ...outline(a60), ...outline(inner), ...inner.map((p) => seg([0, 0], p, undefined, true))],
      "An inscribed hexagon with the colored equilateral triangle on alternate vertices. The dashed radii split the triangle into three pieces, each matching a piece of the hexagon outside it, so the hexagon's area is twice the triangle's.",
      "内接六边形和隔点连成的标色等边三角形。虚线半径把三角形分成三块，每块都与六边形在三角形外的一块相同，所以六边形的面积是三角形的两倍。",
    );
  })(),
  "reasoning-from-inscribed-special-polygons#a-square-and-its-circle": (() => {
    const c = polygonAround(4, 4, 45);
    return drawing(
      [ring(4), ...outline(c), seg(c[0] as Point, c[2] as Point, "result"), note(on(45, 2), "r", "se"), note(on(225, 2), "r", "se")],
      "The colored diagonal of the inscribed square is a diameter, 2r. Half the square of that diagonal is the square's area, 2r².",
      "内接正方形标色的对角线是直径 2r。对角线平方的一半就是正方形的面积 2r²。",
    );
  })(),
  "matching-simple-quadratic-inequalities-to-number-lines#from-an-inequality-to-its-number-line": (() => {
    const up = numberLine(-5, 5, 1, 3);
    const down = numberLine(-5, 5, 1, 0);
    return drawing(
      [
        ...up.marks,
        seg(up.at(-3), up.at(3), "result"),
        ring(0.2, up.at(-3), "result"),
        ring(0.2, up.at(3), "result"),
        note(up.at(0), "x² < 9", "n"),
        ...down.marks,
        seg(down.at(-5), down.at(-3), "result"),
        seg(down.at(3), down.at(5), "result"),
        dot(down.at(-3), "result"),
        dot(down.at(3), "result"),
        note(down.at(0), "x² ≥ 9", "n"),
      ],
      "On top, x² < 9 is shaded between −3 and 3 with open circles. Below, x² ≥ 9 is shaded outward from them with closed dots.",
      "上图中，x² < 9 的阴影在 −3 和 3 之间，用空心圆。下图中，x² ≥ 9 的阴影从它们向外，用实心点。",
    );
  })(),
  "matching-simple-quadratic-inequalities-to-number-lines#from-a-number-line-to-its-inequality": (() => {
    const l = numberLine(-4, 4);
    return drawing(
      [...l.marks, seg(l.at(-2), l.at(2), "result"), dot(l.at(-2), "result"), dot(l.at(2), "result")],
      "For example, closed dots at −2 and 2 with the shading between them. Shading between means below zero and closed dots add the equal sign, so this is x² ≤ 4, with the square of the marked value.",
      "例如，−2 和 2 处是实心点，阴影在它们之间。阴影在中间表示小于零，实心点加上等号，所以这是 x² ≤ 4，用的是标记值的平方。",
    );
  })(),
  "matching-simple-quadratic-inequalities-to-number-lines#counting-integers-in-the-graph": (() => {
    const up = numberLine(-4, 4, 1, 2.4);
    const down = numberLine(-4, 4, 1, 0);
    return drawing(
      [
        ...up.marks,
        seg(up.at(-3), up.at(3), "action"),
        ...[-3, -2, -1, 0, 1, 2, 3].map((v) => dot(up.at(v), "result")),
        ...down.marks,
        seg(down.at(-3), down.at(3), "action"),
        ring(0.2, down.at(-3), "action"),
        ring(0.2, down.at(3), "action"),
        ...[-2, -1, 0, 1, 2].map((v) => dot(down.at(v), "result")),
      ],
      "For example, with zeros at −3 and 3. On top, the closed interval holds 7 integers, in color, with both ends. Below, the open interval holds 5.",
      "例如，零点是 −3 和 3。上图中，闭区间含 7 个整数（标色），包括两端。下图中，开区间含 5 个。",
    );
  })(),
  "estimating-segment-lengths-from-other-lengths-in-a-figure#estimating-a-measure-that-depends-on-a-length": drawing(
    [...box(0, 0, 12, 6, { bottom: "≈ 12", right: "6", shade: "result" }), seg([6, 0], [6, 6], undefined, true)],
    "A rectangle of width 6 whose length looks like about two widths, split by the dashed line. That makes the length about 12 and the colored area near 72.",
    "宽 6 的矩形，长看起来约等于两个宽，用虚线分开。所以长约为 12，标色的面积接近 72。",
  ),
  "finding-angles-from-linear-pairs-and-adjacent-angles#a-linear-pair-given-by-expressions": drawing(
    [
      seg([-6, 0], [6, 0]),
      seg([0, 0], on(80, 6)),
      angle([0, 0], on(0, 1), on(80, 1), "action"),
      angle([0, 0], on(80, 1), on(180, 1), "result"),
      note([3.2, 1.4], "(2x + 20)°", "n"),
      note([-3.2, 1.4], "(3x + 10)°", "n"),
    ],
    "For example, angles of (2x + 20)° and (3x + 10)° on a straight line. Their sum 5x + 30 = 180 gives x = 30, and the angles of 80° and 100° are drawn to scale.",
    "例如，直线上的角 (2x + 20)° 和 (3x + 10)°。它们的和 5x + 30 = 180 得 x = 30，图中 80° 和 100° 按比例画出。",
  ),
  "finding-angles-from-linear-pairs-and-adjacent-angles#three-adjacent-angles-on-a-line": drawing(
    [
      seg([-6, 0], [6, 0]),
      seg([0, 0], on(40, 6)),
      seg([0, 0], on(140 / 3 + 40, 6)),
      angle([0, 0], on(0, 1), on(40, 1), undefined, "40°"),
      angle([0, 0], on(40, 1), on(140 / 3 + 40, 1), "action", "x°"),
      angle([0, 0], on(140 / 3 + 40, 1), on(180, 1), "result", "2x°"),
    ],
    "Angles of 40°, x° and 2x° side by side on a line add up to 180°, so 3x = 140. The colored angles are drawn to scale for that value.",
    "直线上相邻的角 40°、x° 和 2x° 相加为 180°，所以 3x = 140。标色的角按这个值的比例画出。",
  ),
  "finding-angles-from-linear-pairs-and-adjacent-angles#vertical-angles-from-expressions": drawing(
    [
      seg(on(0, 6), on(180, 6)),
      seg(on(70, 6), on(250, 6)),
      angle([0, 0], on(70, 1), on(180, 1)),
      angle([0, 0], on(250, 1), on(360, 1)),
      angle([0, 0], on(0, 1), on(70, 1), "result"),
      angle([0, 0], on(180, 1), on(250, 1), "result"),
      note(on(35, 1.4), "(3x + 10)°", "e"),
      note(on(215, 1.4), "(5x − 30)°", "w"),
    ],
    "For example, colored vertical angles of (3x + 10)° and (5x − 30)° are equal, so x = 20 and each measures 70°, as drawn.",
    "例如，标色的对顶角 (3x + 10)° 和 (5x − 30)° 相等，所以 x = 20，每个角都是 70°，如图所示。",
  ),
  "reasoning-from-rigid-motions#following-a-point-through-a-sequence": graphed(
    wide(-1, 8, -5, 5, 99),
    [
      toward([2, 2], [5, 3], "result"),
      toward([5, 3], [5, -3], "result"),
      toward([2, 2], [2, -2], "action"),
      toward([2, -2], [5, -1], "action"),
      pt([2, 2], "(2, 2)", "w"),
      pt([5, 3], "(5, 3)", "e"),
      pt([5, -3], "(5, −3)", "e", "result"),
      pt([2, -2], "(2, −2)", "w"),
      pt([5, -1], "(5, −1)", "e", "action"),
    ],
    "For example, the point (2, 2). Moving by (3, 1) and then reflecting over the x-axis ends at (5, −3). Reflecting first and then moving ends at (5, −1), so the order matters.",
    "例如，点 (2, 2)。先平移 (3, 1) 再关于 x 轴反射，终点是 (5, −3)。先反射再平移，终点是 (5, −1)，所以顺序很重要。",
  ),
  "reasoning-from-rigid-motions#measures-a-rigid-motion-preserves": (() => {
    const t = fromSides(11, 7, 8);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], sides: ["2x + 1"], sideStyles: ["result"] }),
        ...tri(moved(t, 14, 1, 1.5), { names: ["D", "E", "F"], sides: ["3x − 4"], sideStyles: ["result"] }),
      ],
      "A triangle and its image under a rigid motion. The colored matching sides are equal, so 2x + 1 = 3x − 4 and x = 5, and both measure 11.",
      "三角形和它在刚体运动下的像。标色的对应边相等，所以 2x + 1 = 3x − 4，x = 5，两边都是 11。",
    );
  })(),
  "reasoning-from-rigid-motions#a-quarter-turn-then-a-slide": graphed(
    wide(-1, 8, -5, 4, 99),
    [
      dash([0, 0], [3, 2]),
      dash([0, 0], [2, -3]),
      cornerMark([0, 0], [3, 2], [2, -3]),
      toward([2, -3], [5, -1], "action"),
      pt([3, 2], "(3, 2)", "ne"),
      pt([2, -3], "(2, −3)", "s"),
      pt([5, -1], "(5, −1)", "e", "result"),
    ],
    "For example, the point (3, 2). The clockwise quarter turn about the origin gives (2, −3). Then the slide by (3, 2) adds to the new coordinates, giving the colored (5, −1).",
    "例如，点 (3, 2)。绕原点顺时针旋转 90° 得 (2, −3)。再平移 (3, 2)，加到新坐标上，得到标色的 (5, −1)。",
  ),
  "reasoning-from-compound-right-triangles#two-right-triangles-sharing-a-leg": drawing(
    [
      ...outline([
        [-5, 0],
        [9, 0],
        [0, 12],
      ]),
      seg([0, 0], [0, 12], "result"),
      square([0, 0], [9, 0], [0, 12]),
      note([-2.5, 0], "5", "s"),
      note([4.5, 0], "9", "s"),
      note([-2.5, 6], "13", "nw"),
      note([4.5, 6], "15", "ne"),
      note([0, 6], "12", "e"),
    ],
    "For example, an altitude splits a triangle in two. The left triangle has 5 and 13, which give the colored shared leg 12. Then the right triangle, with 12 and 15, gives 9.",
    "例如，高把三角形分成两个。左边的三角形有 5 和 13，得出标色的公共直角边 12。然后右边的三角形由 12 和 15 得出 9。",
  ),
  "reasoning-from-compound-right-triangles#two-right-triangles-joined-along-a-side": drawing(
    [
      seg([0, 0], [4, 0]),
      seg([4, 0], [4, 3]),
      seg([0, 0], [4, 3], "result"),
      seg([4, 3], [-3.2, 12.6]),
      seg([0, 0], [-3.2, 12.6]),
      square([4, 0], [0, 0], [4, 3]),
      square([4, 3], [0, 0], [-3.2, 12.6]),
      note([2, 0], "4", "s"),
      note([4, 1.5], "3", "e"),
      note([2, 1.5], "5", "nw"),
      note([0.4, 7.8], "12", "ne"),
      note([-1.6, 6.3], "13", "w"),
    ],
    "For example, the colored side links the triangles. From the legs 3 and 4 it is 5, and in the next triangle it is a leg with 12, which gives 13.",
    "例如，标色的边连接两个三角形。由直角边 3 和 4 得它是 5，它又是下一个三角形中与 12 相配的直角边，得出 13。",
  ),
  "reasoning-from-compound-right-triangles#two-triangles-on-a-shared-hypotenuse": drawing(
    [
      seg([0, 0], [12, 0]),
      seg([12, 0], [12, 9]),
      seg([0, 0], [12, 9], "result"),
      seg([12, 9], [0, 25]),
      seg([0, 0], [0, 25]),
      square([12, 0], [0, 0], [12, 9]),
      square([12, 9], [0, 0], [0, 25]),
      note([6, 0], "12", "s"),
      note([12, 4.5], "9", "e"),
      note([6, 4.5], "15", "nw"),
      note([6, 17], "20", "ne"),
      note([0, 12.5], "25", "w"),
    ],
    "For example, the colored segment is the hypotenuse of the lower triangle, so legs 9 and 12 give 15. It is a leg of the upper triangle, where 15 and 20 give 25.",
    "例如，标色的线段是下面三角形的斜边，由直角边 9 和 12 得 15。它又是上面三角形的直角边，由 15 和 20 得 25。",
  ),
  "matching-parts-across-congruence-and-similarity#reading-parts-from-the-order-of-the-letters": (() => {
    const t = fromSides(5, 6, 4);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], sideStyles: [undefined, "result"] }),
        ...tri(turned(t, 150, 13, 3.5), { names: ["F", "D", "E"], sideStyles: [undefined, "result"] }),
      ],
      "For △ABC ≅ △FDE, the letters match by position, whatever the figure looks like. So the colored BC, second and third letters, matches DE.",
      "对 △ABC ≅ △FDE，字母按位置对应，与图形看起来如何无关。所以标色的 BC（第二、三个字母）对应 DE。",
    );
  })(),
  "matching-parts-across-congruence-and-similarity#a-length-from-a-stated-similarity": (() => {
    const t = fromSides(4, 6, 5);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], sides: ["4", "6"], sideStyles: ["action", "result"] }),
        ...tri(moved(t, 6.5, 1.5, 0), { names: ["E", "F", "D"], sides: ["6", "x"], sideStyles: ["action", "result"] }),
      ],
      "For example, △ABC ~ △EFD with AB = 4, BC = 6 and EF = 6. Each ratio has the first triangle over the second, so 4/6 = 6/x and the colored FD is 9.",
      "例如，△ABC ~ △EFD，AB = 4，BC = 6，EF = 6。每个比都是第一个三角形比第二个，所以 4/6 = 6/x，标色的 FD 是 9。",
    );
  })(),
};
