// Drawings of the ACT fundamentals explanations: similar figures, coordinate triangles, round figures, inverse ratios, conic slices, polygons and regions.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { belowRim, box, dash, fill, holed, moved, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import {
  angle,
  bend,
  coneMarks,
  cylinderMarks,
  drawing,
  ellipse,
  fromSides,
  graphed,
  note,
  on,
  ring,
  seg,
  square,
  wedge,
} from "./explanation-drawings-kit.ts";

/** round draws a circle on a coordinate plane. */
const round = (center: Point, r: number, tone?: "action" | "result"): PlaneMark => ({ kind: "circle", center, r, tone }) as PlaneMark;

/** outline draws the closed outline through the points. */
const outline = (points: readonly Point[], style?: "action" | "result"): Mark[] =>
  points.map((p, i) => seg(p, points[(i + 1) % points.length] as Point, style));

/** slice draws the side view of a double cone with half angle alpha, its axis, and a colored plane at the angle theta with the axis through the point on the axis. */
const slice = (alpha: number, theta: number, at: number, reach = 3.4): Mark[] => {
  const h = 3.2;
  const w = h * Math.tan((alpha * Math.PI) / 180);
  const dx = Math.sin((theta * Math.PI) / 180) * reach;
  const dy = Math.cos((theta * Math.PI) / 180) * reach;
  return [
    seg([-w, -h], [w, h]),
    seg([w, -h], [-w, h]),
    seg([0, -h], [0, h], undefined, true),
    seg([-dx, at - dy], [dx, at + dy], "result"),
  ];
};

/** region lists the points of the part of a circle around the origin between two directions, which also closes along the chord. */
const region = (r: number, from: number, to: number): Point[] => {
  const span = (((to - from) % 360) + 360) % 360;
  return Array.from({ length: 49 }, (_, i) => on(from + (span * i) / 48, r));
};

const root = (Math.sqrt(17) - 1) / 2;
const upperAngle = (Math.atan2(root + 1, root) * 180) / Math.PI;
const lowerAngle = (Math.atan2(-root, -root - 1) * 180) / Math.PI + 360;
const hex: Point[] = Array.from({ length: 6 }, (_, i) => on(30 + 60 * i, 4));

/** examFundamentalsDrawings4 draws the explanations of ACT Math Fundamentals, by knowledge point: similar figures, coordinate triangles, round figures, inverse ratios, conic slices, polygons and regions. */
export const examFundamentalsDrawings4: Readonly<Record<string, Figure>> = {
  "matching-parts-across-congruence-and-similarity#a-perimeter-from-a-similarity": (() => {
    const t = fromSides(4, 3, 5);
    return drawing(
      [
        ...tri(t, { sides: ["4", "3", "5"], sideStyles: ["result"] }),
        ...tri(moved(t, 6, 2, 0), { sides: ["8", "6", "10"], sideStyles: ["result"] }),
      ],
      "For example, sides 3, 4, 5 and 6, 8, 10. The colored matching sides are in the ratio 1 : 2, and so are the perimeters, 12 and 24.",
      "例如，边长 3、4、5 和 6、8、10。标色的对应边之比是 1 : 2，周长 12 和 24 之比也一样。",
    );
  })(),
  "recovering-lengths-from-similarity-descriptions#a-similar-triangle-described-in-words": (() => {
    const t = fromSides(10, 8, 6);
    return drawing(
      [
        ...tri(t, { sides: ["10", "8", "6"], sideStyles: ["result"] }),
        ...tri(moved(t, 13, 1.5, 0), { sides: ["15"], sideStyles: ["result"] }),
      ],
      "For example, colored longest sides of 10 and 15 give the scale factor 1.5. A perimeter of 24 in the smaller triangle becomes 36 in the larger, without finding each side.",
      "例如，标色的最长边 10 和 15 给出比例系数 1.5。较小三角形的周长 24 在较大三角形中变成 36，不必求出每条边。",
    );
  })(),
  "recovering-lengths-from-similarity-descriptions#a-length-cut-off-by-a-parallel-line": drawing(
    [
      fill(
        [
          [6, 8],
          [3.6, 4.8],
          [8.4, 4.8],
        ],
        "result",
      ),
      ...outline([
        [0, 0],
        [12, 0],
        [6, 8],
      ]),
      seg([3.6, 4.8], [8.4, 4.8], "action"),
      note([6, 8], "A", "n"),
      note([0, 0], "B", "sw"),
      note([12, 0], "C", "se"),
      note([3.6, 4.8], "D", "w"),
      note([8.4, 4.8], "E", "e"),
      note([4.8, 6.4], "4", "nw"),
      note([1.8, 2.4], "6", "nw"),
    ],
    "With DE parallel to BC, the colored triangle is similar to the whole. Compare with the whole side, AB = 10, so DE/BC = 4/10. Using 4/6 is the common mistake.",
    "DE 平行于 BC，标色的三角形与整个三角形相似。要与整条边 AB = 10 比较，所以 DE/BC = 4/10。用 4/6 是常见错误。",
  ),
  "recovering-lengths-from-similarity-descriptions#a-height-from-a-shadow": drawing(
    [
      ...rt(4, 6, { sides: ["4", "6"], angles: [""], angleStyles: ["action"] }),
      ...shift(rt(10, 15, { sides: ["10", "x"], sideStyles: [undefined, "result"], angles: [""], angleStyles: ["action"] }), 6),
    ],
    "For example, a 6 m pole with a 4 m shadow and a tree with a 10 m shadow. The sunlight makes the same angle, so 6/4 = x/10 and the colored height is 15 m.",
    "例如，6 米高的杆影长 4 米，一棵树影长 10 米。阳光的角度相同，所以 6/4 = x/10，标色的高是 15 米。",
  ),
  "recovering-measures-of-squares-and-rectangles#from-a-relation-to-the-sides-of-a-rectangle": drawing(
    [...box(0, 0, 6, 3, { bottom: "2w = 6", right: "w = 3", shade: "result" }), seg([3, 0], [3, 3], undefined, true)],
    "For example, k = 2 and P = 18. Writing both sides with w gives 2(2w + w) = 18, so w = 3 and the length is 6. Only then comes the colored area, 18.",
    "例如，k = 2，P = 18。用 w 表示两边得 2(2w + w) = 18，所以 w = 3，长是 6。然后才求标色的面积 18。",
  ),
  "finding-a-coordinate-triangles-area#a-side-along-a-grid-line": graphed(
    wide(-1, 7, -1, 6),
    [
      solid([1, 1], [5, 1], "action"),
      solid([5, 1], [3, 4]),
      solid([3, 4], [1, 1]),
      dash([3, 4], [3, 1], "result"),
      pt([1, 1], "", "n"),
      pt([5, 1], "", "n"),
      pt([3, 4], "", "n"),
    ],
    "For example, vertices (1, 1), (5, 1) and (3, 4). Two share a y-coordinate, so the base along the grid is 4, and the dashed height is 4 − 1 = 3. The area is 6.",
    "例如，顶点 (1, 1)、(5, 1) 和 (3, 4)。其中两个 y 坐标相同，所以沿网格的底是 4，虚线的高是 4 − 1 = 3。面积是 6。",
  ),
  "finding-a-coordinate-triangles-area#using-an-enclosing-rectangle": graphed(
    wide(-1, 7, -1, 6),
    [
      shape(
        [
          [1, 1],
          [5, 1],
          [5, 2],
        ],
        "action",
      ),
      shape(
        [
          [5, 2],
          [5, 5],
          [2, 5],
        ],
        "action",
      ),
      shape(
        [
          [2, 5],
          [1, 5],
          [1, 1],
        ],
        "action",
      ),
      dash([1, 1], [5, 1]),
      dash([5, 1], [5, 5]),
      dash([5, 5], [1, 5]),
      dash([1, 5], [1, 1]),
      solid([1, 1], [5, 2], "result"),
      solid([5, 2], [2, 5], "result"),
      solid([2, 5], [1, 1], "result"),
    ],
    "For example, vertices (1, 1), (5, 2) and (2, 5) inside a dashed 4 by 4 rectangle of area 16. The colored corner triangles have areas 2, 4.5 and 2, which leaves 7.5.",
    "例如，顶点 (1, 1)、(5, 2) 和 (2, 5)，在虚线的 4 乘 4 矩形内，矩形面积 16。标色的角上三角形面积是 2、4.5 和 2，剩下 7.5。",
  ),
  "finding-a-coordinate-triangles-area#a-vertex-from-the-area": graphed(
    wide(-1, 7, -1, 5),
    [
      solid([1, 0], [5, 0], "action"),
      solid([5, 0], [2, 3]),
      solid([2, 3], [1, 0]),
      dash([2, 3], [2, 0]),
      pt([1, 0], "", "n"),
      pt([5, 0], "", "n"),
      pt([2, 3], "(2, 3)", "n", "result"),
    ],
    "For example, a base of 4 along the x-axis and an area of 6. Twice the area over the base is 12/4 = 3, the y-coordinate of the colored vertex.",
    "例如，x 轴上的底是 4，面积是 6。面积的两倍除以底是 12/4 = 3，这就是标色顶点的 y 坐标。",
  ),
  "recovering-solid-measures-from-diagrams#a-cylinder-with-one-measure-missing": drawing(
    [...cylinderMarks(3, 4, undefined, "h"), belowRim(3, "3")],
    "For example, radius 3 and volume 36π. Dividing by π · 3² cancels π, so the height is 4, as drawn.",
    "例如，半径 3，体积 36π。除以 π · 3² 消去 π，所以高是 4，如图所示。",
  ),
  "recovering-solid-measures-from-diagrams#a-cone-with-its-height-missing": drawing(
    [...coneMarks(3, 4, undefined, "h"), belowRim(3, "3")],
    "For example, radius 3 and volume 12π. Three times the volume is 36π, and dividing by 3² and π gives the height 4, as drawn.",
    "例如，半径 3，体积 12π。体积的三倍是 36π，除以 3² 和 π 得高 4，如图所示。",
  ),
  "reasoning-from-composite-circle-figures#the-area-between-two-circles": (() => {
    const circle = Array.from({ length: 73 }, (_, i) => on(i * 5, 5));
    return drawing(
      [
        holed(circle, 3, "result"),
        ring(5),
        ring(3),
        seg([0, 0], on(40, 5)),
        seg([0, 0], on(160, 3)),
        note(on(40, 3.8), "5", "se"),
        note(on(160, 1.5), "3", "n"),
        ring(2, [8.5, 0], undefined),
        seg([8.5, 0], [10.5, 0]),
        note([9.5, 0], "2", "n"),
      ],
      "For example, radii 5 and 3. The colored region has area 25π − 9π = 16π. On the right, the tempting π(5 − 3)² is a circle of radius 2 with area 4π, which is much too small.",
      "例如，半径 5 和 3。标色区域的面积是 25π − 9π = 16π。右图中，诱人的 π(5 − 3)² 是半径 2 的圆，面积 4π，太小了。",
    );
  })(),
  "reasoning-from-composite-circle-figures#a-square-around-a-circle": drawing(
    [
      holed(
        [
          [4, 0],
          [4, 4],
          [-4, 4],
          [-4, -4],
          [4, -4],
          [4, 0],
        ],
        4,
        "result",
      ),
      ...box(-4, -4, 8, 8, { bottom: "s" }),
      ring(4),
      seg([0, 0], [4, 0]),
      note([2, 0], "s/2", "n"),
    ],
    "The inscribed circle touches all four sides, so its radius is half the side. The colored corners are the square with the circle removed, s² − π(s/2)².",
    "内切圆与四条边都相切，所以半径是边长的一半。标色的角是正方形去掉圆，即 s² − π(s/2)²。",
  ),
  "recovering-measures-from-central-angles#the-radius-from-a-sector": drawing(
    [
      ring(4),
      seg([0, 0], on(0, 4)),
      seg([0, 0], on(90, 4)),
      ...bend(0, 90, 4, [0, 0], "result"),
      angle([0, 0], on(0, 1), on(90, 1), undefined, "90°"),
      note(on(45, 4), "3π", "ne"),
      note(on(0, 2), "r", "s"),
    ],
    "For example, an arc of 3π from a central angle of 90°, which is 90/360 of the circle. The whole circumference is 12π, so r = 6. The colored arc is drawn to scale.",
    "例如，圆心角 90° 对应的弧长是 3π，占圆的 90/360。整个圆周长是 12π，所以 r = 6。标色的弧按比例画出。",
  ),
  "recovering-measures-from-central-angles#the-central-angle-from-a-sector": drawing(
    [
      ring(6),
      seg([0, 0], on(0, 6)),
      seg([0, 0], on(120, 6)),
      ...bend(0, 120, 6, [0, 0], "action"),
      angle([0, 0], on(0, 1), on(120, 1), "result", "120°"),
      note(on(60, 6), "4π", "ne"),
      note(on(0, 3), "6", "s"),
    ],
    "The colored arc of 4π on a circle of radius 6 is 4π/12π = 1/3 of the circumference. One third of 360° gives the colored angle, 120°.",
    "半径 6 的圆上标色的弧 4π 是周长的 4π/12π = 1/3。360° 的三分之一就是标色的角 120°。",
  ),
  "recovering-measures-from-central-angles#the-area-of-a-sector": drawing(
    [
      ring(6),
      wedge(0, 60, 6, [0, 0], "result"),
      seg([0, 0], on(0, 6)),
      seg([0, 0], on(60, 6)),
      angle([0, 0], on(0, 1), on(60, 1), undefined, "60°"),
      note(on(0, 3), "6", "s"),
    ],
    "For example, radius 6 and a central angle of 60°. The colored sector is 60/360 of the area 36π, which is 6π.",
    "例如，半径 6，圆心角 60°。标色的扇形是面积 36π 的 60/360，即 6π。",
  ),
  "using-a-circle-with-a-second-condition#a-point-on-a-circle-in-a-quadrant": graphed(
    wide(-7, 7, -6, 6, 99),
    [
      round([0, 0], 5),
      solid([0, 0], [-3, 4], "action"),
      dash([-3, 4], [-3, 0]),
      pt([-3, 4], "(−3, 4)", "nw", "result"),
      pt([-3, -4], "(−3, −4)", "sw"),
      tag([-3, 2], "4", "w"),
      tag([-1.5, 0], "3", "s"),
    ],
    "For example, x² + y² = 25 with x = −3 gives y = 4 or y = −4. In quadrant II, y is positive, which chooses the colored point (−3, 4).",
    "例如，x² + y² = 25，x = −3 得 y = 4 或 y = −4。在第二象限 y 为正，选标色的点 (−3, 4)。",
  ),
  "using-a-circle-with-a-second-condition#a-chord-at-a-distance-from-the-center": drawing(
    [
      ring(5),
      seg([-4, -3], [4, -3]),
      seg([0, 0], [4, -3]),
      seg([0, 0], [0, -3]),
      seg([0, -3], [4, -3], "result"),
      square([0, -3], [4, -3], [0, 0]),
      note([2, -1.5], "5", "ne"),
      note([0, -1.5], "3", "w"),
      note([2, -3], "4", "s"),
    ],
    "For example, radius 5 and distance 3. The right triangle gives half the chord, in color, as 4, so the whole chord is 8.",
    "例如，半径 5，距离 3。直角三角形给出标色的半弦 4，所以整条弦是 8。",
  ),
  "using-a-circle-with-a-second-condition#a-tangent-from-an-outside-point": drawing(
    [
      ring(5),
      seg([0, 0], [25 / 13, 60 / 13]),
      seg([25 / 13, 60 / 13], [13, 0], "result"),
      seg([0, 0], [13, 0]),
      square([25 / 13, 60 / 13], [0, 0], [13, 0]),
      note([25 / 26, 30 / 13], "5", "w"),
      note([(25 / 13 + 13) / 2, 30 / 13], "12", "ne"),
      note([9, 0], "13", "s"),
    ],
    "For example, radius 5 and a point 13 from the center. The radius meets the tangent at a right angle, so the colored tangent is 12.",
    "例如，半径 5，点到圆心的距离是 13。半径与切线成直角，所以标色的切线长是 12。",
  ),
  "evaluating-trigonometric-functions-of-inverse-ratios#from-a-positive-ratio-to-a-triangle": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], sideStyles: ["result"], angles: ["θ"] }),
    "For θ = sin⁻¹(3/5), the opposite side is 3 and the hypotenuse 5. The Pythagorean theorem gives the colored adjacent side, 4.",
    "对 θ = sin⁻¹(3/5)，对边是 3，斜边是 5。勾股定理给出标色的邻边 4。",
  ),
  "evaluating-trigonometric-functions-of-inverse-ratios#from-a-negative-ratio-to-a-quadrant": drawing(
    [
      seg([-5, 0], [3, 0]),
      seg([0, -1], [0, 5.5]),
      seg([0, 0], [-3, 4]),
      seg([-3, 0], [0, 0]),
      seg([-3, 0], [-3, 4], "result"),
      square([-3, 0], [0, 0], [-3, 4]),
      angle([0, 0], [1, 0], [-3, 4], "action", "θ"),
      note([3, 0], "x", "e"),
      note([0, 5.5], "y", "n"),
      note([-1.5, 2], "5", "ne"),
      note([-3, 2], "4", "w"),
      note([-1.5, 0], "3", "s"),
    ],
    "The angle θ = cos⁻¹(−3/5) lies in quadrant II. The triangle has sides 3, 4 and 5, and the colored vertical side points up, so sin θ is positive, 4/5.",
    "角 θ = cos⁻¹(−3/5) 在第二象限。三角形的边是 3、4、5，标色的竖直边向上，所以 sin θ 为正，等于 4/5。",
  ),
  "evaluating-trigonometric-functions-of-inverse-ratios#a-reciprocal-ratio-of-an-inverse": drawing(
    rt(3, 4, { sides: ["3", "4", "5"], sideStyles: ["action", undefined, "result"], angles: ["θ"] }),
    "For example, θ = cos⁻¹(3/5). The third side is 4, and the secant is the colored hypotenuse over the adjacent side, 5/3.",
    "例如，θ = cos⁻¹(3/5)。第三条边是 4，正割是标色的斜边比邻边，即 5/3。",
  ),
  "conic-sections-as-slices-of-a-cone#naming-the-conic-section": drawing(
    [
      ...slice(30, 90, 1.4, 2.2),
      ...shift(slice(30, 60, 1.2, 2.2), 6),
      ...shift(slice(30, 30, 1.2, 3), 0, -7.6),
      ...shift(slice(30, 8, 0.5, 3.1), 6, -7.6),
    ],
    "A double cone seen from the side, with half angle 30°, cut by a colored plane that misses the vertex. Top left: 90° with the axis, a circle. Top right: 60°, an ellipse. Bottom left: 30°, parallel to a side, a parabola. Bottom right: 8°, cutting both parts, a hyperbola.",
    "从侧面看的双圆锥，半顶角 30°，被一个不过顶点的标色平面切割。左上：与轴成 90°，得圆。右上：60°，得椭圆。左下：30°，平行于一条母线，得抛物线。右下：8°，切到两部分，得双曲线。",
  ),
  "conic-sections-as-slices-of-a-cone#slices-through-the-vertex": drawing(
    [...slice(30, 70, 0, 2.6), ...shift(slice(30, 30, 0, 3.7), 6), ...shift(slice(30, 12, 0, 3.3), 12)],
    "A double cone with a colored plane through the vertex. On the left, the plane makes a larger angle with the axis than the sides do and meets the cone only at the vertex, a point. In the middle, it lies along a side, a line. On the right, it cuts through, two lines.",
    "双圆锥和过顶点的标色平面。左图中，平面与轴的夹角大于母线与轴的夹角，只在顶点与圆锥相交，得一个点。中图中，它沿着一条母线，得一条直线。右图中，它穿过圆锥，得两条直线。",
  ),
  "conic-sections-as-slices-of-a-cone#the-angle-that-gives-a-parabola": drawing(
    [
      ...slice(30, 30, 1.6, 3.2),
      angle([0, 0], [0, 1], on(60, 1), "action", "α"),
      angle([0, 1.6], [0, 2.6], on(60, 1, [0, 1.6]), "result", "θ"),
    ],
    "A plane, in color, parallel to a side of the cone. Its angle θ with the axis equals the angle α between the side and the axis.",
    "标色的平面与圆锥的一条母线平行。它与轴的夹角 θ 等于母线与轴的夹角 α。",
  ),
  "areas-of-regular-polygons#the-apothem-from-the-area": drawing(
    [
      ...outline(hex),
      seg([0, 0], [4 * Math.cos(Math.PI / 6), 0], "result"),
      square([4 * Math.cos(Math.PI / 6), 0], [0, 0], hex[0] as Point),
      note([1.7, 0], "2√3", "s"),
      note([4 * Math.cos(Math.PI / 6), 0], "4", "e"),
    ],
    "For example, a regular hexagon with side 4 and area 24√3. Its perimeter is 24, so twice the area over the perimeter gives the colored apothem, 2√3.",
    "例如，边长 4、面积 24√3 的正六边形。周长是 24，所以面积的两倍除以周长得标色的边心距 2√3。",
  ),
  "areas-of-rhombuses-and-kites#area-from-the-diagonals": drawing(
    [
      fill(
        [
          [-5, 0],
          [5, 0],
          [0, 5],
        ],
        "action",
      ),
      fill(
        [
          [-5, 0],
          [5, 0],
          [0, -11],
        ],
        "result",
      ),
      ...outline([
        [-5, 0],
        [0, -11],
        [5, 0],
        [0, 5],
      ]),
      seg([-5, 0], [5, 0]),
      seg([0, 5], [0, -11]),
      square([0, 0], [5, 0], [0, 5]),
      note([2.5, 0], "10", "n"),
      note([0, -5], "16", "e"),
    ],
    "A kite with diagonals 10 and 16. The diagonal 10 is the base of two colored triangles whose heights add up to 16, so the area is ½ · 10 · 16 = 80.",
    "对角线为 10 和 16 的筝形。对角线 10 是两个标色三角形的底，它们的高相加为 16，所以面积是 ½ · 10 · 16 = 80。",
  ),
  "areas-of-rhombuses-and-kites#side-of-a-rhombus-from-its-diagonals": drawing(
    [
      fill(
        [
          [0, 0],
          [8, 0],
          [0, 6],
        ],
        "result",
      ),
      ...outline([
        [-8, 0],
        [0, -6],
        [8, 0],
        [0, 6],
      ]),
      seg([-8, 0], [8, 0]),
      seg([0, -6], [0, 6]),
      square([0, 0], [8, 0], [0, 6]),
      note([4, 0], "8", "s"),
      note([0, 3], "6", "w"),
      note([4, 3], "10", "ne"),
    ],
    "A rhombus with diagonals 12 and 16. The colored right triangle has half of each diagonal as legs, 6 and 8, and a side as hypotenuse, 10. The perimeter is 40.",
    "对角线为 12 和 16 的菱形。标色的直角三角形以对角线的一半 6 和 8 为直角边，以边 10 为斜边。周长是 40。",
  ),
  "spheres-and-cubes-inscribed-in-each-other#a-sphere-inside-a-cube": drawing(
    [...box(-3, -3, 6, 6, { bottom: "6" }), ring(3), seg([0, 0], [3, 0], "result"), note([1.5, 0], "3", "n")],
    "A slice through the center of a cube of edge 6 and its inscribed sphere. The diameter equals the edge, so the colored radius is 3 and the volume is 36π.",
    "穿过棱长 6 的立方体及其内切球中心的截面。直径等于棱长，所以标色的半径是 3，体积是 36π。",
  ),
  "spheres-and-cubes-inscribed-in-each-other#a-cube-inside-a-sphere": (() => {
    const w = 2 * Math.SQRT2;
    return drawing(
      [
        ring(2 * Math.sqrt(3)),
        ...box(-w, -2, 2 * w, 4, { bottom: "4√2", left: "4" }),
        seg([-w, -2], [w, 2], "result"),
        note([0.5, 0.2], "4√3", "se"),
      ],
      "A slice through opposite edges of a cube with edge 4. The face diagonal is 4√2, and the colored space diagonal, 4√3, is a diameter, so the radius is 2√3.",
      "穿过棱长 4 的立方体相对两条棱的截面。面对角线是 4√2，标色的体对角线 4√3 是直径，所以半径是 2√3。",
    );
  })(),
  "spheres-and-cubes-inscribed-in-each-other#the-volume-of-the-inscribed-sphere": drawing(
    [...box(-3, -3, 6, 6, { bottom: "e" }), ring(3), seg([0, 0], [3, 0], "result"), note([1.5, 0], "e/2", "n")],
    "A slice through the center of the cube and the inscribed sphere. The diameter equals the edge e, so the colored radius is e/2, which goes into (4/3)π times its cube.",
    "穿过立方体和内切球中心的截面。直径等于棱长 e，所以标色的半径是 e/2，代入 (4/3)π 乘它的立方。",
  ),
  "graphing-systems-of-linear-and-circular-inequalities#testing-points-in-the-system": graphed(
    wide(-4, 4, -4, 4, 99),
    [shape(region(3, 45, 225), "action"), round([0, 0], 3), ln([0, 0], [1, 1], undefined, true), pt([1, 2], "(1, 2)", "n", "result")],
    "The colored region satisfies x² + y² ≤ 9, on or inside the circle, and y > x, above the dashed line. The point (1, 2) lies in both, so it is a solution.",
    "标色区域满足 x² + y² ≤ 9（圆上或圆内）和 y > x（虚线上方）。点 (1, 2) 同时满足两者，所以是解。",
  ),
  "graphing-systems-of-linear-and-circular-inequalities#reading-a-system-from-its-graph": graphed(
    wide(-4, 4, -4, 4, 99),
    [shape(region(3, upperAngle, lowerAngle), "action"), round([0, 0], 3), ln([0, 1], [1, 2]), pt([0, 2], "(0, 2)", "w", "result")],
    "For example, shading inside the circle gives x² + y² ≤ 9, and shading above the line gives y ≥ x + 1. The colored point (0, 2) checks both: 4 ≤ 9 and 2 ≥ 1.",
    "例如，阴影在圆内得 x² + y² ≤ 9，阴影在直线上方得 y ≥ x + 1。标色的点 (0, 2) 验证两者：4 ≤ 9，2 ≥ 1。",
  ),
  "graphing-systems-of-linear-and-circular-inequalities#matching-a-system-to-its-region": graphed(
    wide(-4, 4, -4, 4, 99),
    [shape(region(3, lowerAngle, upperAngle), "result"), round([0, 0], 3), ln([0, 1], [1, 2])],
    "For example, inside the circle and below the line. The colored overlap is x² + y² ≤ 9 together with y ≤ x + 1, with ≤ for both.",
    "例如，圆内且在直线下方。标色的重叠部分是 x² + y² ≤ 9 与 y ≤ x + 1，两个都用 ≤。",
  ),
  "focal-distance-properties-of-ellipses-and-hyperbolas#the-focal-difference-of-a-hyperbola": graphed(
    wide(-8, 9, -3, 9, 99),
    [
      curveOf((x) => 4 * Math.sqrt(Math.max(0, (x * x) / 9 - 1)), undefined, 3, 7.5),
      curveOf((x) => -4 * Math.sqrt(Math.max(0, (x * x) / 9 - 1)), undefined, 3, 4),
      curveOf((x) => 4 * Math.sqrt(Math.max(0, (x * x) / 9 - 1)), undefined, -7.5, -3),
      curveOf((x) => -4 * Math.sqrt(Math.max(0, (x * x) / 9 - 1)), undefined, -4, -3),
      solid([-5, 0], [6, 4 * Math.sqrt(3)], "result"),
      solid([5, 0], [6, 4 * Math.sqrt(3)], "action"),
      pt([-5, 0], "(−5, 0)", "s"),
      pt([5, 0], "(5, 0)", "s"),
      pt([6, 4 * Math.sqrt(3)], "", "n"),
      tag([-1, 2.4], "13", "nw"),
      tag([5.6, 3.46], "7", "e"),
    ],
    "For example, a = 3 and c = 5, with the point (6, 4√3). It is 7 from the nearer focus and 13 from the farther one, a difference of 6, which is 2a.",
    "例如，a = 3，c = 5，点 (6, 4√3)。它到较近焦点的距离是 7，到较远焦点的距离是 13，差是 6，即 2a。",
  ),
  "focal-distance-properties-of-ellipses-and-hyperbolas#the-perimeter-of-a-focal-triangle": drawing(
    [
      ...ellipse([0, 0], 5, 3),
      seg([-4, 0], [4, 0], "result"),
      seg([-4, 0], [3, 2.4]),
      seg([4, 0], [3, 2.4]),
      seg([-4, 0], [-1, 2.939], undefined, true),
      seg([4, 0], [-1, 2.939], undefined, true),
      { kind: "dot", at: [3, 2.4] },
      { kind: "dot", at: [-1, 2.939] },
      note([3, 2.4], "P", "ne"),
      note([-4, 0], "F₁", "sw"),
      note([4, 0], "F₂", "se"),
      note([0, 0], "8", "s"),
    ],
    "For example, a = 5 and c = 4. Wherever P is, the two sides from P add up to 2a = 10 and the colored side is 2c = 8, so the perimeter is 18. The dashed triangle is P in another place.",
    "例如，a = 5，c = 4。无论 P 在哪里，从 P 出发的两条边相加为 2a = 10，标色的边是 2c = 8，所以周长是 18。虚线三角形是 P 在另一个位置时的情形。",
  ),
};
