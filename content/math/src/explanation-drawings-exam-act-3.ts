// Drawings of the ACT explanations: motions in the plane, parallel segments, right triangles, composite areas, and circles.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { box, dash, fill, holed, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { angle, bend, drawing, fromSides, graphed, name, note, on, ring, seg, square } from "./explanation-drawings-kit.ts";

const rad = (deg: number) => (deg * Math.PI) / 180;
const lerp = (a: Point, b: Point, f: number): Point => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];

/** cutAt is a triangle with BC = 15, CA = 12 and AB = 9 and the segment DE parallel to BC, two thirds of the way from A. */
function cutAt(labels: readonly [string, string, string?, string?], extra: (D: Point, E: Point, B: Point, C: Point) => Mark[]): Mark[] {
  const [B, C, A] = fromSides(15, 12, 9);
  const D = lerp(A, B, 2 / 3);
  const E = lerp(A, C, 2 / 3);
  return [
    { kind: "polygon", points: [B, C, A] },
    seg(D, E),
    { kind: "arrows", a: D, b: E, count: 1 },
    { kind: "arrows", a: [5, 0], b: [8, 0], count: 1 },
    name(A, "A", "n"),
    name(B, "B", "sw"),
    name(C, "C", "se"),
    name(D, "D", "w"),
    name(E, "E", "e"),
    { kind: "side", a: A, b: D, text: labels[0] },
    { kind: "side", a: D, b: B, text: labels[1] },
    ...(labels[2] ? [{ kind: "side", a: E, b: A, text: labels[2] } as Mark] : []),
    ...(labels[3] ? [{ kind: "side", a: C, b: E, text: labels[3] } as Mark] : []),
    ...extra(D, E, B, C),
  ];
}

/** examActDrawings3 draws the explanations of ACT Math Prep, by knowledge point: motions, parallels, right triangles, areas and circles. */
export const examActDrawings3: Readonly<Record<string, Figure>> = {
  "act-exam-translating-and-reflecting-a-point#exam-question": graphed(
    wide(-4, 6, -7, 7, 2),
    [dash([2, -5], [2, 5], "action"), pt([2, -5], "(2, −5)", "e"), pt([2, 5], "(2, 5)", "e", "result")],
    "Reflecting (2, −5) across the x-axis keeps x and negates y, giving the colored point (2, 5).",
    "把 (2, −5) 关于 x 轴翻折，x 不变，y 取相反数，得到标色的点 (2, 5)。",
  ),
  "act-exam-translating-and-reflecting-a-point#harder-exam-question": graphed(
    wide(-6, 6, -8, 2, 2),
    [
      toward([1, -2], [4, -2], "action"),
      toward([4, -2], [4, -6], "action"),
      dash([4, -6], [-4, -6], "action"),
      pt([1, -2], "(1, −2)", "s"),
      pt([4, -6], "(4, −6)", "se"),
      pt([-4, -6], "(−4, −6)", "s", "result"),
    ],
    "From (1, −2), going right 3 and down 4 reaches (4, −6). Reflecting that new point across the y-axis, along the dashed line, gives the colored point (−4, −6).",
    "从 (1, −2) 向右 3、向下 4 到达 (4, −6)。把这个新点沿虚线关于 y 轴翻折，得到标色的点 (−4, −6)。",
  ),
  "act-exam-applying-a-rigid-motion#exam-question": drawing(
    [
      seg([0, 0], [9, 0]),
      note([4.5, 0], "9", "s"),
      seg([0, 0], on(60, 9), "result"),
      note(on(60, 4.5), "9", "nw"),
      { kind: "dot", at: [0, 0] },
      ...bend(0, 60, 9, [0, 0], "action"),
    ],
    "For example, a segment of length 9 turned about one end. The colored image still has length 9, whatever the angle of the rotation.",
    "例如，长度为 9 的线段绕一端旋转。无论旋转角多大，标色的像长度仍是 9。",
  ),
  "act-exam-applying-a-rigid-motion#harder-exam-question": graphed(
    wide(-7, 5, -2, 7),
    [solid([0, 0], [2, 5]), solid([0, 0], [-5, 2], "result"), pt([2, 5], "(2, 5)", "e"), pt([-5, 2], "(−5, 2)", "n", "result")],
    "A counterclockwise quarter turn about the origin sends (2, 5) to the colored point (−5, 2). The two segments from the origin are perpendicular and equal.",
    "绕原点逆时针转四分之一圈把 (2, 5) 变到标色的点 (−5, 2)。从原点出发的两条线段垂直且相等。",
  ),
  "act-exam-dilating-a-figure#exam-question": graphed(
    wide(-2, 10, -14, 2, 2),
    [dash([0, 0], [8, -12], "action"), pt([2, -3], "(2, −3)", "e"), pt([8, -12], "(8, −12)", "w", "result"), pt([0, 0], "", "n")],
    "A dilation by k = 4 from the origin slides (2, −3) along the dashed line to the colored point (8, −12). Both coordinates are multiplied by 4.",
    "以原点为中心、k = 4 的位似把 (2, −3) 沿虚线移到标色的点 (8, −12)。两个坐标都乘以 4。",
  ),
  "act-exam-dilating-a-figure#harder-exam-question": drawing(
    [...box(0, 0, 5, 2, { bottom: "5", right: "2" }), ...box(7, 0, 15, 6, { bottom: "15", right: "6", inside: "90", shade: "result" })],
    "A 2 by 5 rectangle dilated by a factor of 3 becomes 6 by 15. Lengths triple, but the shaded area is 9 times as large, from 10 to 90.",
    "2 乘 5 的长方形按因子 3 位似后变成 6 乘 15。长度变为 3 倍，但阴影面积变为 9 倍，从 10 到 90。",
  ),
  "act-exam-finding-lengths-using-parallel-lines#exam-question": drawing(
    cutAt(["6", "3", "8", "4"], (_D, E, _B, C) => [seg(E, C, "result")]),
    "The line through D and E parallel to BC cuts the sides in the same ratio. So 6 : 3 on AB matches 8 : 4 on AC, and the colored piece EC is 4.",
    "过 D、E 且平行于 BC 的直线把两边分成相同的比。所以 AB 上的 6 : 3 与 AC 上的 8 : 4 相等，标色的 EC 是 4。",
  ),
  "act-exam-finding-lengths-using-parallel-lines#harder-exam-question": drawing(
    cutAt(["6", "3"], (D, E) => [seg(D, E, "result"), note(lerp(D, E, 0.5), "10", "n"), note([7.5, 0], "15", "s")]),
    "The ratio of the whole sides is AD : AB, which is 6 : 9 or 2/3. So the colored segment DE is two thirds of the base 15, namely 10.",
    "整条边的比是 AD : AB，即 6 : 9 或 2/3。所以标色的 DE 是底 15 的三分之二，即 10。",
  ),
  "act-exam-finding-diagonals-and-perimeters-with-the-pythagorean-theorem#exam-question": drawing(
    [...box(0, 0, 8, 6, { bottom: "8", right: "6" }), seg([0, 0], [8, 6], "result"), note([4, 3], "10", "nw")],
    "The diagonal of a 6 by 8 rectangle is the hypotenuse of a right triangle with those legs. Its colored length is 10, shorter than the 14 along two sides.",
    "6 乘 8 长方形的对角线是以这两边为直角边的直角三角形的斜边。标色的长度是 10，比沿两边走的 14 短。",
  ),
  "act-exam-finding-lengths-in-figures-with-the-pythagorean-theorem#exam-question": drawing(
    rt(6, 8, { sides: ["6", "8", "10"], sideStyles: [undefined, "result"] }),
    "A 10-foot ladder is the hypotenuse, and its foot is 6 feet from the wall. Subtracting squares gives the colored height on the wall, 8 feet.",
    "10 英尺的梯子是斜边，梯脚离墙 6 英尺。平方相减得到标色的墙上高度 8 英尺。",
  ),
  "act-exam-finding-lengths-in-figures-with-the-pythagorean-theorem#harder-exam-question": drawing(
    tri(
      [
        [0, 0],
        [6, 8],
        [0, 8],
      ],
      { sides: ["10", "6", "8"], sideStyles: ["result"], right: 2 },
    ),
    "Walking 6 miles west and then 8 miles south forms the legs of a right triangle. The colored hypotenuse, 10 miles, is the direct distance from the start.",
    "向西走 6 英里再向南走 8 英里，构成直角三角形的两条直角边。标色的斜边 10 英里是到起点的直线距离。",
  ),
  "act-exam-finding-altitudes-and-areas-with-the-pythagorean-theorem#exam-question": drawing(
    [
      ...tri(
        [
          [0, 0],
          [12, 0],
          [6, 8],
        ],
        {
          sides: [undefined, "10", "10"],
          ticks: [
            [1, 1],
            [2, 1],
          ],
        },
      ),
      seg([6, 0], [6, 8], "result", true),
      square([6, 0], [12, 0], [6, 8]),
      note([3, 0], "6", "s"),
      note([9, 0], "6", "s"),
      note([6, 4], "8", "e"),
    ],
    "The dashed altitude cuts the base of 12 in half, forming right triangles with hypotenuse 10 and leg 6. So the colored altitude is 8.",
    "虚线高把长为 12 的底分成两半，形成斜边 10、直角边 6 的直角三角形。所以标色的高是 8。",
  ),
  "act-exam-checking-and-applying-pythagorean-relationships#exam-question": drawing(
    rt(15, 8, { sides: ["15", "8", "17"], sideStyles: [undefined, undefined, "action"], angleStyles: [undefined, "result"] }),
    "Since 64 + 225 = 289, the triangle with sides 8, 15 and 17 is right. The right angle, in color, lies opposite the longest side.",
    "因为 64 + 225 = 289，边长为 8、15、17 的三角形是直角三角形。标色的直角在最长边的对面。",
  ),
  "act-exam-checking-and-applying-pythagorean-relationships#harder-exam-question": drawing(
    rt(15, 8, { sides: ["15", "8", "x"], sideStyles: [undefined, undefined, "result"] }),
    "With a right angle opposite the longest side x, in color, x² = 64 + 225 = 289. So x is 17, not the sum 23.",
    "最长边 x（标色）的对面是直角，所以 x² = 64 + 225 = 289。因此 x 是 17，而不是和 23。",
  ),
  "act-exam-finding-a-length-from-an-angle-measure#exam-question": drawing(
    rt(9 * Math.cos(rad(50)), 9 * Math.sin(rad(50)), {
      sides: [undefined, "9 sin 50°", "9"],
      sideStyles: [undefined, "result"],
      angles: ["50°"],
    }),
    "With hypotenuse 9 at 50°, the colored opposite side is the one sine reaches: 9 sin 50°.",
    "斜边为 9、角为 50° 时，标色的对边由正弦得到：9 sin 50°。",
  ),
  "act-exam-finding-a-length-from-an-angle-measure#harder-exam-question": drawing(
    rt(25, 25 * Math.tan(rad(50)), { sides: ["25", "25 tan 50°"], sideStyles: [undefined, "result"], angles: ["50°"] }),
    "A vertical pole and a 25-foot shadow form a right angle. The colored height is opposite the 50° angle of elevation, so it is 25 tan 50°.",
    "竖直的杆和 25 英尺的影子成直角。标色的高度对着 50° 的仰角，所以是 25 tan 50°。",
  ),
  "act-exam-writing-an-inverse-trigonometric-expression#exam-question": drawing(
    rt(Math.sqrt(55), 3, {
      sides: [undefined, "3", "8"],
      sideStyles: [undefined, "action", "action"],
      angles: ["θ"],
      angleStyles: ["result"],
    }),
    "The known sides are 3, opposite θ, and 8, the hypotenuse. Their ratio 3/8 goes with the sine, so the colored angle is sin⁻¹(3/8).",
    "已知的边是对着 θ 的 3 和斜边 8。它们的比 3/8 对应正弦，所以标色的角是 sin⁻¹(3/8)。",
  ),
  "act-exam-writing-an-inverse-trigonometric-expression#harder-exam-question": drawing(
    [...rt(15, 2, { sides: ["15", "2"], sideStyles: ["action", "action"], angleStyles: ["result"] }), note([1.6, 0], "θ", "s")],
    "A ramp with rise 2 opposite the angle and run 15 adjacent to it. Those two legs make a tangent, so the colored angle is tan⁻¹(2/15).",
    "坡道的升高 2 对着角，水平距离 15 与角相邻。这两条直角边构成正切，所以标色的角是 tan⁻¹(2/15)。",
  ),
  "act-exam-finding-areas-of-composite-rectilinear-figures#exam-question": drawing(
    [
      fill(
        [
          [0, 5],
          [6, 5],
          [6, 7],
          [0, 7],
        ],
        "action",
      ),
      fill(
        [
          [0, 0],
          [3, 0],
          [3, 5],
          [0, 5],
        ],
        "result",
      ),
      {
        kind: "polygon",
        points: [
          [0, 0],
          [3, 0],
          [3, 5],
          [6, 5],
          [6, 7],
          [0, 7],
        ],
      },
      seg([0, 5], [3, 5], undefined, true),
      note([3, 7], "6", "n"),
      note([6, 6], "2", "e"),
      note([1.5, 0], "3", "s"),
      note([0, 2.5], "5", "w"),
      note([3, 5.8], "12", "n"),
      note([1.5, 2.3], "15", "n"),
    ],
    "A dashed line splits the L into a 6 by 2 rectangle above a 3 by 5 rectangle. The areas 12 and 15 add to 27.",
    "虚线把 L 形分成上面 6 乘 2 和下面 3 乘 5 的长方形。面积 12 和 15 相加得 27。",
  ),
  "act-exam-finding-areas-of-composite-rectilinear-figures#harder-exam-question": drawing(
    [
      seg([6, 3], [6, 7], undefined, true),
      seg([2, 7], [6, 7], undefined, true),
      seg([0, 0], [6, 0], "result"),
      seg([0, 0], [0, 7], "result"),
      seg([6, 0], [6, 3], "result"),
      seg([0, 7], [2, 7], "result"),
      seg([6, 3], [4, 3], "result"),
      seg([4, 3], [4, 5], "result"),
      seg([4, 5], [2, 5], "result"),
      seg([2, 5], [2, 7], "result"),
      note([3, 0], "6", "s"),
      note([0, 3.5], "7", "w"),
    ],
    "A staircase with its corner cut out, in color, inside a dashed 6 by 7 box. The inward edges only move, so the perimeter matches the box's: 26.",
    "切去一角的阶梯形（标色）位于 6 乘 7 的虚线框内。向内的边只是移动，所以周长与框相同：26。",
  ),
  "act-exam-finding-areas-of-divided-rectangles#exam-question": drawing(
    [
      ...box(0, 0, 7, 6, { right: "6", shade: "result" }),
      seg([3, 0], [3, 6], undefined, true),
      note([1.5, 0], "3", "s"),
      note([5, 0], "4", "s"),
    ],
    "A dashed vertical cut gives two rectangles of height 6. The widths 3 and 4 add to 7, so the shaded whole has area 42.",
    "竖直的虚线切出两个高为 6 的长方形。宽 3 和 4 相加得 7，所以整个阴影部分面积是 42。",
  ),
  "act-exam-finding-areas-of-quadrilaterals#exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [9, 0],
          [12, 4],
          [3, 4],
        ],
        "result",
      ),
      {
        kind: "polygon",
        points: [
          [0, 0],
          [9, 0],
          [12, 4],
          [3, 4],
        ],
      },
      seg([3, 0], [3, 4], "action", true),
      square([3, 0], [9, 0], [3, 4]),
      note([6, 0], "9", "s"),
      note([3, 2], "4", "e"),
    ],
    "A parallelogram with base 9 and dashed perpendicular height 4. Its shaded area is base times height, 36, with no half.",
    "底为 9、虚线垂直高为 4 的平行四边形。阴影面积是底乘高，为 36，没有一半。",
  ),
  "act-exam-finding-areas-of-quadrilaterals#harder-exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [11, 0],
          [8, 4],
          [3, 4],
        ],
        "result",
      ),
      {
        kind: "polygon",
        points: [
          [0, 0],
          [11, 0],
          [8, 4],
          [3, 4],
        ],
      },
      seg([3, 0], [3, 4], "action", true),
      square([3, 0], [11, 0], [3, 4]),
      note([5.5, 0], "11", "s"),
      note([5.5, 4], "5", "n"),
      note([3, 2], "4", "e"),
    ],
    "A trapezoid with parallel bases 5 and 11 and dashed height 4. The shaded area averages the bases, 8, and multiplies by the height: 32.",
    "平行的底为 5 和 11、虚线高为 4 的梯形。阴影面积取两底的平均值 8，再乘以高：32。",
  ),
  "act-exam-finding-areas-of-triangles#exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [6, 0],
          [2, 7],
        ],
        "result",
      ),
      ...tri(
        [
          [0, 0],
          [6, 0],
          [2, 7],
        ],
        { sides: ["6"] },
      ),
      seg([2, 0], [2, 7], "action", true),
      square([2, 0], [6, 0], [2, 7]),
      seg([0, 0], [0, 7], undefined, true),
      seg([0, 7], [6, 7], undefined, true),
      seg([6, 7], [6, 0], undefined, true),
      note([2, 3.5], "7", "e"),
    ],
    "A shaded triangle with base 6 and height 7. Its area, 21, is half of the dashed rectangle around it.",
    "底为 6、高为 7 的阴影三角形。面积 21 是外面虚线长方形的一半。",
  ),
  "act-exam-finding-shaded-areas-with-circles#exam-question": drawing(
    [
      holed(
        [
          [5, 0],
          [5, 5],
          [-5, 5],
          [-5, -5],
          [5, -5],
          [5, 0],
        ],
        5,
        "result",
      ),
      ...box(-5, -5, 10, 10, { bottom: "10" }),
      ring(5),
      seg([0, 0], [5, 0]),
      note([2.5, 0], "5", "n"),
    ],
    "The side of the square equals the diameter, 10. The shaded region between them is 100 − 25π.",
    "正方形的边长等于直径 10。它们之间的阴影部分是 100 − 25π。",
  ),
  "act-exam-finding-shaded-areas-with-circles#harder-exam-question": drawing(
    [
      holed(
        Array.from({ length: 73 }, (_, i) => on(i * 5, 7)),
        3,
        "result",
      ),
      ring(7),
      ring(3),
      seg([0, 0], on(150, 7)),
      seg([0, 0], on(30, 3)),
      note(on(150, 4.5), "7", "ne"),
      note(on(30, 1.6), "3", "se"),
    ],
    "A shaded ring between circles of radius 3 and 7. Its area is the larger circle's minus the smaller circle's, π(49 − 9) = 40π.",
    "半径为 3 和 7 的圆之间的阴影圆环。面积是大圆减小圆，π(49 − 9) = 40π。",
  ),
  "act-exam-comparing-areas-of-figures#harder-exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [3, 6],
          [0, 6],
        ],
        "result",
      ),
      fill(
        [
          [8, 0],
          [8, 6],
          [3, 6],
        ],
        "result",
      ),
      ...box(0, 0, 8, 6, { bottom: "8", right: "6" }),
      {
        kind: "polygon",
        points: [
          [0, 0],
          [8, 0],
          [3, 6],
        ],
      },
      note([3.7, 1.4], "24", "n"),
    ],
    "The triangle shares the base 8 and the height 6 of the rectangle. It has area 24, half of 48, so the shaded excess is also 24.",
    "三角形与长方形共用底 8 和高 6。它的面积是 24，为 48 的一半，所以阴影多出的部分也是 24。",
  ),
  "act-exam-finding-a-length-from-area#harder-exam-question": drawing(
    [
      ...tri(
        [
          [0, 0],
          [12, 0],
          [4, 5],
        ],
        { sides: ["12"] },
      ),
      seg([4, 0], [4, 5], "result", true),
      square([4, 0], [12, 0], [4, 5]),
      note([4, 2.5], "5", "w"),
      note([6.4, 1.4], "30", "n"),
    ],
    "Undoing the area formula: double 30 and divide by the base 12. That gives the colored height, 5.",
    "把面积公式反过来：30 加倍再除以底 12，得到标色的高 5。",
  ),
  "act-exam-finding-distance-along-a-circle#exam-question": drawing(
    [
      ring(5, [5, 5]),
      seg([5, 5], [5, 10]),
      note([5, 10], "5", "n"),
      seg([0, 0], [10 + 40 * Math.PI, 0]),
      seg([5, 0], [5 + 40 * Math.PI, 0], "result"),
      ...[0, 1, 2, 3, 4].map((i) => seg([5 + i * 10 * Math.PI, -1.5], [5 + i * 10 * Math.PI, 1.5])),
      note([5 + 5 * Math.PI, 1.5], "10π", "n"),
      note([5 + 20 * Math.PI, 0], "40π", "s"),
    ],
    "One turn of a wheel of radius 5 rolls it forward one circumference, 10π. Four turns give the colored distance, 40π.",
    "半径为 5 的轮子转一圈向前滚动一个周长 10π。四圈得到标色的距离 40π。",
  ),
  "act-exam-finding-distance-along-a-circle#harder-exam-question": drawing(
    [
      ring(6),
      seg([0, 0], on(0, 6)),
      seg([0, 0], on(120, 6)),
      ...bend(0, 120, 6, [0, 0], "result"),
      angle([0, 0], on(0, 6), on(120, 6), undefined, "120°"),
      note([3, 0], "6", "s"),
      note(on(60, 6), "4π", "ne"),
    ],
    "A central angle of 120° is one third of the circle, so the colored arc is one third of 12π, which is 4π.",
    "120° 的圆心角是圆的三分之一，所以标色的弧是 12π 的三分之一，即 4π。",
  ),
  "act-exam-comparing-areas-of-circles#exam-question": drawing(
    [
      ring(3),
      seg([0, 0], [3, 0]),
      note([1.5, 0], "3", "n"),
      ring(9, [13, 0]),
      { kind: "shade", points: Array.from({ length: 73 }, (_, i) => on(i * 5, 9, [13, 0])), tone: "result" },
      seg([13, 0], [22, 0]),
      note([17.5, 0], "9", "n"),
    ],
    "The radius grows by a factor of 3, from 3 to 9. The shaded area grows by a factor of 3², which is 9.",
    "半径从 3 增大到 9，是 3 倍。阴影面积增大到 3² 倍，即 9 倍。",
  ),
  "act-exam-finding-arc-measure#exam-question": drawing(
    [
      ring(4),
      seg([0, 0], on(0, 4)),
      seg([0, 0], on(50, 4)),
      angle([0, 0], on(0, 4), on(50, 4), undefined, "50°"),
      ...bend(50, 360, 4, [0, 0], "result"),
      note(on(205, 4), "310°", "sw"),
    ],
    "A central angle of 50° cuts off a minor arc of 50°. The colored major arc, the longer way around, is 360° − 50° = 310°.",
    "50° 的圆心角截出 50° 的劣弧。标色的优弧是较长的一段，360° − 50° = 310°。",
  ),
  "act-exam-finding-arc-measure#harder-exam-question": drawing(
    [
      ring(4),
      seg([0, 0], on(0, 4)),
      seg([0, 0], on(100, 4)),
      seg([0, 0], on(160, 4)),
      angle([0, 0], on(0, 4), on(100, 4), undefined, "100°"),
      angle([0, 0], on(100, 4), on(160, 4), undefined, "60°"),
      ...bend(160, 360, 4, [0, 0], "result"),
      note(on(260, 2), "200°", "n"),
    ],
    "Central angles of 100° and 60° leave a third angle of 200°. Its colored arc has the same measure, and an angle over 180° is possible.",
    "100° 和 60° 的圆心角留下第三个角 200°。标色的弧度数相同，超过 180° 的角是可能的。",
  ),
  "act-exam-finding-angles-in-circles#exam-question": (() => {
    const A = on(-40, 4);
    const B = on(40, 4);
    const P = on(180, 4);
    return drawing(
      [
        ring(4),
        seg([0, 0], A),
        seg([0, 0], B),
        seg(P, A),
        seg(P, B),
        angle([0, 0], A, B, "action", "80°"),
        angle(P, A, B, "result", "40°"),
        { kind: "dot", at: [0, 0] },
      ],
      "The central angle of 80° and the colored inscribed angle cut the same arc. The inscribed angle, with its vertex on the circle, is half: 40°.",
      "80° 的圆心角和标色的圆周角截同一段弧。顶点在圆上的圆周角是它的一半：40°。",
    );
  })(),
  "act-exam-finding-angles-in-circles#harder-exam-question": (() => {
    const P: Point = [-4, 0];
    const Q: Point = [4, 0];
    const R = on(130, 4);
    return drawing(
      [
        ring(4),
        ...tri([P, Q, R], { names: ["P", "Q"], angles: ["25°", "65°"], angleStyles: [undefined, "result"], right: 2 }),
        { kind: "dot", at: [0, 0] },
      ],
      "With diameter PQ as a side, the third vertex holds a right angle. So the acute angles are complementary, and 25° at P leaves the colored 65° at Q.",
      "以直径 PQ 为一边时，第三个顶点处是直角。所以两个锐角互余，P 处的 25° 留下 Q 处标色的 65°。",
    );
  })(),
  "act-exam-problem-solving-with-circle-lengths#harder-exam-question": drawing(
    [
      ring(3),
      { kind: "shade", points: [on(45, 3), on(135, 3), on(225, 3), on(315, 3)], tone: "result" },
      { kind: "polygon", points: [on(45, 3), on(135, 3), on(225, 3), on(315, 3)] },
      seg(on(225, 3), on(45, 3), "action"),
      note([0, 0], "6", "nw"),
    ],
    "The diagonal of the square is a diameter of the circle of radius 3, namely 6. The shaded area is half of that diagonal squared: 36 ÷ 2 = 18.",
    "正方形的对角线是半径为 3 的圆的直径，即 6。阴影面积是对角线平方的一半：36 ÷ 2 = 18。",
  ),
};
