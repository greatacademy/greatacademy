// Drawings of the ACT explanations: matching triangles, right triangles, circles, slopes, solids and data displays.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { bars, box, cornerMark, dash, fill, moved, pie, rt, solid, tri, whisker } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import {
  angle,
  bend,
  coneMarks,
  cylinderMarks,
  drawing,
  ellipse,
  fromAngles,
  fromSides,
  graphed,
  note,
  on,
  pyramidMarks,
  ring,
  seg,
  type Triangle,
} from "./explanation-drawings-kit.ts";

const round = (c: Point, r: number): PlaneMark => ({ kind: "circle", center: c, r });
const rad = (d: number) => (d * Math.PI) / 180;

/** turned rotates the corners of a triangle by an angle about the origin and moves them by dx. */
function turned(t: Triangle, deg: number, dx: number, dy = 0): Triangle {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  const at = ([x, y]: Point): Point => [x * c - y * s + dx, x * s + y * c + dy];
  return [at(t[0]), at(t[1]), at(t[2])];
}

const scalene = fromSides(4, 5, 3.4);
const three = fromAngles(50, 60, 5);

/** examActDrawings5 draws the explanations of ACT Math Prep, by knowledge point: matching triangles, right triangles, circles, slopes, solids and data. */
export const examActDrawings5: Readonly<Record<string, Figure>> = {
  "act-exam-identifying-corresponding-parts-under-congruence#exam-question": drawing(
    [
      ...tri(scalene, { names: ["A", "B", "C"], sideStyles: [undefined, undefined, "result"] }),
      ...tri(turned(scalene, 130, 11, 1.5), { names: ["D", "E", "F"], sideStyles: [undefined, undefined, "result"] }),
    ],
    "In △ABC ≅ △DEF, the second triangle is rotated. The letters still pair the colored sides: AC matches DF.",
    "在 △ABC ≅ △DEF 中，第二个三角形被旋转了。字母仍然配对标色的边：AC 对应 DF。",
  ),
  "act-exam-identifying-corresponding-parts-under-congruence#harder-exam-question": (() => {
    const t = fromAngles(50, 65, 4.4);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], angles: ["50°", undefined, "65°"] }),
        ...tri(moved(t, 6.5, 1, 0), { names: ["D", "E", "F"], angles: [undefined, "65°"], angleStyles: [undefined, "result"] }),
      ],
      "Angles of 50° and 65° leave 65° for the third angle, B. In △ABC ≅ △DEF, angle E pairs with B, so the colored angle measures 65°.",
      "50° 和 65° 的角给第三个角 B 留下 65°。在 △ABC ≅ △DEF 中，角 E 与 B 配对，所以标色的角是 65°。",
    );
  })(),
  "act-exam-using-corresponding-parts-under-similarity#exam-question": drawing(
    [
      ...tri(three, { names: ["A", "B", "C"], angles: ["50°", "60°", "70°"], angleStyles: [undefined, "action", "result"] }),
      ...tri(moved(three, 6.5, 0.7, 0), { names: ["D", "E", "F"], angles: [undefined, "60°"], angleStyles: [undefined, "action"] }),
    ],
    "In △ABC ~ △DEF, angle E passes its 60° to the matching angle B, shown in one color. With 50° at A, the sum of 180° leaves the colored 70° at C.",
    "在 △ABC ~ △DEF 中，角 E 把它的 60° 传给对应的角 B，用同一种颜色标出。A 处为 50°，总和 180° 留给 C 标色的 70°。",
  ),
  "act-exam-using-corresponding-parts-under-similarity#harder-exam-question": (() => {
    const t = fromSides(4, 5, 6);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], sides: ["4", "5"], sideStyles: [undefined, "result"] }),
        ...tri(moved(t, 7.5, 3, 0), { names: ["D", "E", "F"], sides: ["12", "15"] }),
      ],
      "DE = 12 against AB = 4 shows the second triangle is 3 times larger. Dividing EF = 15 by 3 gives the colored side, BC = 5.",
      "DE = 12 与 AB = 4 相比，说明第二个三角形大 3 倍。EF = 15 除以 3 得到标色的边 BC = 5。",
    );
  })(),
  "act-exam-finding-corresponding-lengths-in-similar-figures#harder-exam-question": drawing(
    [...rt(2, 3, { sides: ["2", "3"] }), ...shift(rt(12, 18, { sides: ["12", "18"], sideStyles: [undefined, "result"] }), 6, 0)],
    "The stick of 3 and its shadow of 2 form a triangle similar to the pole's. The shadow of 12 is 6 times longer, so the colored pole is 18.",
    "高 3 的木棍和长 2 的影子构成的三角形与旗杆的相似。影子 12 长了 6 倍，所以标色的旗杆是 18。",
  ),
  "act-exam-applying-the-pythagorean-theorem#exam-question": drawing(
    rt(8, 6, { sides: ["8", "6", "10"], sideStyles: ["result"] }),
    "The side opposite the right angle is the hypotenuse, 10. With a leg of 6, the colored leg is 8, shorter than the hypotenuse.",
    "直角对面的边是斜边 10。一条直角边为 6，标色的直角边是 8，比斜边短。",
  ),
  "act-exam-modeling-situations-using-the-pythagorean-theorem#exam-question": drawing(
    rt(6, 8, { sides: ["6", "8", "10"], sideStyles: [undefined, undefined, "result"] }),
    "A walk of 6 east and then 8 north makes a right angle. The colored straight route between the ends is the hypotenuse, 10.",
    "向东 6 再向北 8 形成直角。两端之间标色的直线路径是斜边 10。",
  ),
  "act-exam-modeling-situations-using-the-pythagorean-theorem#harder-exam-question": drawing(
    rt(6, 8, { sides: ["6", "8", "10"], sideStyles: [undefined, "result"] }),
    "The wire of 10 is the hypotenuse, staked 6 from the base. The colored pole is 8, which is 2 shorter than the wire.",
    "长 10 的钢丝是斜边，固定在距底部 6 处。标色的杆子是 8，比钢丝短 2。",
  ),
  "act-exam-problem-solving-with-special-triangles#exam-question": drawing(
    [
      ...box(0, 0, 7, 7, { bottom: "7", right: "7" }),
      seg([0, 0], [7, 7], "result"),
      note([3.5, 3.5], "7√2", "nw"),
      angle([0, 0], [7, 0], [7, 7], undefined, "45°"),
    ],
    "The colored diagonal cuts the square of side 7 into two 45-45-90 triangles, so the diagonal is 7√2.",
    "标色的对角线把边长为 7 的正方形分成两个 45-45-90 三角形，所以对角线是 7√2。",
  ),
  "act-exam-problem-solving-with-special-triangles#harder-exam-question": drawing(
    rt(14 * Math.cos(rad(30)), 7, { sides: [undefined, "7", "14"], sideStyles: [undefined, "result"], angles: ["30°"] }),
    "The slide of 14 at 30° is the hypotenuse. The colored rise, opposite the 30° angle, is half of it: 7.",
    "长 14、倾角 30° 的滑梯是斜边。标色的高度对着 30° 角，是它的一半：7。",
  ),
  "act-exam-finding-trigonometric-ratios#exam-question": drawing(
    rt(4, 3, { names: ["A"], sides: ["4", "3", "5"], sideStyles: ["result", undefined, "result"] }),
    "Seen from A, the side 3 is opposite. The colored sides are the adjacent side and the hypotenuse, so cos A = 4/5.",
    "从 A 看，边 3 是对边。标色的是邻边和斜边，所以 cos A = 4/5。",
  ),
  "act-exam-finding-trigonometric-ratios#harder-exam-question": drawing(
    rt(4, 3, { names: ["C", "B", "A"], sides: ["4", "3"], sideStyles: ["action", "result"], angles: [""] }),
    "The sketch places the right angle at B. Seen from C, AB is the opposite side and BC the adjacent side, in two colors, so tan C = 3/4.",
    "草图把直角放在 B。从 C 看，AB 是对边，BC 是邻边，用两种颜色标出，所以 tan C = 3/4。",
  ),
  "act-exam-finding-a-trigonometric-ratio-from-other-ratios#exam-question": drawing(
    rt(8, 15, { sides: ["8", "15", "17"], sideStyles: [undefined, "result"], angles: ["θ"] }),
    "The ratio cos θ = 8/17 gives an adjacent side of 8 and a hypotenuse of 17. The colored opposite side is 15, so tan θ = 15/8.",
    "cos θ = 8/17 给出邻边 8 和斜边 17。标色的对边是 15，所以 tan θ = 15/8。",
  ),
  "act-exam-finding-a-trigonometric-ratio-from-other-ratios#harder-exam-question": graphed(
    wide(-7, 3, -6, 3, 99),
    [
      solid([0, 0], [-4, -3]),
      solid([0, 0], [-4, 0], "result"),
      solid([-4, 0], [-4, -3]),
      pt([-4, -3], "", "s"),
      tag([-2, 0], "−4", "n"),
      tag([-4, -1.5], "−3", "w"),
      tag([-2, -1.5], "5", "se"),
    ],
    "In the third quadrant, the 3-4-5 triangle reaches left and down. The hypotenuse is positive and the colored horizontal side is negative, so cos θ = −4/5.",
    "在第三象限，3-4-5 三角形向左向下伸展。斜边为正，标色的水平边为负，所以 cos θ = −4/5。",
  ),
  "act-exam-using-cofunction-relationships#exam-question": drawing(
    rt(6 * Math.cos(rad(35)), 6 * Math.sin(rad(35)), { sideStyles: [undefined, "result"], angles: ["35°", undefined, "55°"] }),
    "The acute angles of 35° and 55° are complementary. The colored side is opposite 35° and adjacent to 55°, so sin 35° and cos 55° are the same ratio.",
    "35° 和 55° 的锐角互余。标色的边是 35° 的对边、55° 的邻边，所以 sin 35° 和 cos 55° 是同一个比值。",
  ),
  "act-exam-using-cofunction-relationships#harder-exam-question": drawing(
    rt(3, 4, { names: ["A", "C", "B"], sides: ["3", undefined, "5"], sideStyles: ["result"] }),
    "The colored side is adjacent to A and opposite B. Over the hypotenuse it gives both cos A and sin B, 3/5.",
    "标色的边是 A 的邻边、B 的对边。除以斜边，同时得到 cos A 和 sin B，都是 3/5。",
  ),
  "act-exam-finding-a-side-from-a-trigonometric-ratio#harder-exam-question": drawing(
    rt(40, 30, { sides: ["40", "30"], sideStyles: [undefined, "result"], angles: ["θ"] }),
    "The level distance of 40 is adjacent to the angle of elevation, and the colored height is opposite. Multiplying 40 by tan θ = 3/4 gives 30.",
    "水平距离 40 是仰角的邻边，标色的高度是对边。40 乘以 tan θ = 3/4 得 30。",
  ),
  "act-exam-finding-perimeters-of-figures#exam-question": drawing(
    box(0, 0, 9, 4, { bottom: "9", right: "4", top: "9", left: "4", line: "result" }),
    "The colored edge goes all the way around the 9 by 4 pen, so all four sides count: 26 units.",
    "标色的边绕 9 乘 4 的围栏一整圈，所以四条边都要算：26 个单位。",
  ),
  "act-exam-finding-arc-length#exam-question": drawing(
    [
      ring(12),
      seg([0, 0], on(0, 12)),
      seg([0, 0], on(60, 12)),
      ...bend(0, 60, 12, [0, 0], "result"),
      angle([0, 0], on(0, 12), on(60, 12), undefined, "60°"),
      note([6, 0], "12", "s"),
      note(on(30, 12), "4π", "e"),
    ],
    "A sector of 60° is 1/6 of the circle of radius 12. The colored arc is 1/6 of the circumference 24π, which is 4π.",
    "60° 的扇形是半径为 12 的圆的 1/6。标色的弧是周长 24π 的 1/6，即 4π。",
  ),
  "act-exam-finding-arc-length#harder-exam-question": drawing(
    [
      ring(10, [0, 0], "action"),
      note([0, 0], "20π", "n"),
      ring(10, [24, 0], "action"),
      note([24, 0], "20π", "n"),
      ring(10, [48, 0]),
      seg([48, 0], on(0, 10, [48, 0])),
      seg([48, 0], on(90, 10, [48, 0])),
      ...bend(0, 90, 10, [48, 0], "result"),
      note([53, 0], "10", "s"),
      note(on(45, 10, [48, 0]), "5π", "ne"),
    ],
    "Two full turns of radius 10, in one color, travel 20π each. The further 90° is the colored quarter arc, 5π, for a total of 45π.",
    "半径为 10 的两整圈（同一颜色）各走 20π。再转 90° 是标色的四分之一弧 5π，共 45π。",
  ),
  "act-exam-writing-the-equation-of-a-circle#exam-question": graphed(
    wide(-4, 8, -10, 1, 2),
    [round([2, -5], 4), solid([2, -5], [6, -5], "result"), pt([2, -5], "(2, −5)", "s"), tag([4, -5], "4", "n")],
    "The circle with center (2, −5) and colored radius 4. The center's y-coordinate is negative, so its equation has y + 5, and the right side is 4² = 16.",
    "圆心 (2, −5)、标色半径 4 的圆。圆心的纵坐标为负，所以方程中是 y + 5，右边是 4² = 16。",
  ),
  "act-exam-writing-the-equation-of-a-circle#harder-exam-question": graphed(
    wide(-14, 16, -14, 16, 10),
    [
      round([1, 1], 13),
      solid([1, 1], [6, 13], "result"),
      dash([1, 1], [6, 1], "action"),
      dash([6, 1], [6, 13], "action"),
      pt([1, 1], "(1, 1)", "se"),
      pt([6, 13], "(6, 13)", "ne"),
      tag([3.5, 1], "5", "n"),
      tag([6, 7], "12", "e"),
    ],
    "From center (1, 1) to the point (6, 13), the changes are 5 and 12, dashed. The squares add to r² = 169 for the colored radius.",
    "从圆心 (1, 1) 到点 (6, 13)，变化量是 5 和 12（虚线）。平方相加得到标色半径的 r² = 169。",
  ),
  "act-exam-problem-solving-with-circles#harder-exam-question": graphed(
    wide(-4, 10, -7, 5, 2),
    [
      round([2, -1], 4),
      solid([2, -1], [6, -1], "action"),
      ln([6, 0], [6, 1], "result"),
      pt([2, -1], "", "n"),
      pt([6, -1], "", "n", "result"),
      tag([4, -1], "4", "s"),
      tag([6, 3], "x = 6", "e"),
    ],
    "The circle has center (2, −1) and radius 4. The colored tangent on the right touches it one radius from the center: x = 2 + 4 = 6.",
    "圆心 (2, −1)，半径 4。右边标色的切线在距圆心一个半径处与它相切：x = 2 + 4 = 6。",
  ),
  "act-exam-using-slopes-of-parallel-lines#exam-question": graphed(
    wide(-2, 7, -3, 5),
    [
      ln([0, 2], [4, -1]),
      dash([0, 2], [4, 2], "action"),
      dash([4, 2], [4, -1], "result"),
      tag([2, 2], "4", "n"),
      tag([4, 0.5], "3", "e"),
      pt([0, 2], "", "n"),
      pt([4, -1], "", "n"),
    ],
    "The line 3x + 4y = 8 is y = −(3/4)x + 2. Each 4 to the right, it falls by the colored 3, so its slope is −3/4.",
    "直线 3x + 4y = 8 就是 y = −(3/4)x + 2。每向右 4，就下降标色的 3，所以斜率是 −3/4。",
  ),
  "act-exam-using-slopes-of-parallel-lines#harder-exam-question": graphed(
    wide(-8, 9, -4, 11, 2),
    [
      ln([0, 9], [1, 11]),
      ln([0, -1], [1, 1], "result"),
      pt([2, 3], "(2, 3)", "e"),
      tag([-3, 3], "y = 2x + 9", "w"),
      tag([4, 7], "y = 2x − 1", "e"),
    ],
    "The colored line through (2, 3) keeps the slope 2 of y = 2x + 9 and takes the new intercept −1.",
    "过 (2, 3) 的标色直线保留 y = 2x + 9 的斜率 2，并取新的截距 −1。",
  ),
  "act-exam-using-slopes-of-perpendicular-lines#exam-question": graphed(
    wide(-6, 7, -1, 7, 99),
    [
      ln([0, 0], [5, 4]),
      ln([0, 0], [-4, 5], "result"),
      cornerMark([0, 0], [5, 4], [-4, 5]),
      dash([0, 0], [5, 0], "action"),
      dash([5, 0], [5, 4], "action"),
      dash([0, 0], [-4, 0], "action"),
      dash([-4, 0], [-4, 5], "action"),
      tag([2.5, 0], "5", "s"),
      tag([5, 2], "4", "e"),
      tag([-2, 0], "4", "s"),
      tag([-4, 2.5], "5", "w"),
    ],
    "A slope of 4/5 rises 4 over 5. The colored perpendicular line flips the two numbers and runs the other way, so its slope is −5/4.",
    "斜率 4/5 表示水平 5、上升 4。标色的垂线交换两个数并朝另一边走，所以斜率是 −5/4。",
  ),
  "act-exam-using-slopes-of-perpendicular-lines#harder-exam-question": graphed(
    wide(-3, 8, -2, 7),
    [
      ln([0, 1], [1, 3]),
      ln([0, 3], [2, 2], "action"),
      pt([0, 3], "", "n", "action"),
      dash([4, 0], [4, 1], "action"),
      pt([4, 1], "(4, 1)", "ne", "result"),
      tag([2, 5], "y = 2x + 1", "e"),
    ],
    "The second line is perpendicular to y = 2x + 1, has slope −1/2, and has its own intercept 3. At x = 4 it passes through the colored point, y = 1.",
    "第二条直线垂直于 y = 2x + 1，斜率为 −1/2，有自己的截距 3。在 x = 4 处它经过标色的点，y = 1。",
  ),
  "act-exam-finding-area-in-the-coordinate-plane#exam-question": graphed(
    wide(-1, 8, -1, 7),
    [
      shape(
        [
          [1, 2],
          [6, 2],
          [6, 5],
          [1, 5],
        ],
        "result",
      ),
      solid([1, 2], [6, 2]),
      solid([6, 2], [6, 5]),
      solid([6, 5], [1, 5]),
      solid([1, 5], [1, 2]),
      pt([1, 2], "(1, 2)", "s"),
      pt([6, 5], "(6, 5)", "n"),
      tag([3.5, 5], "5", "n"),
      tag([6, 3.5], "3", "e"),
    ],
    "The opposite vertices (1, 2) and (6, 5) differ by 5 across and 3 up. Those are the sides, so the colored area is 15.",
    "相对的顶点 (1, 2) 和 (6, 5) 横向相差 5、纵向相差 3。这就是两条边，所以标色的面积是 15。",
  ),
  "act-exam-finding-area-in-the-coordinate-plane#harder-exam-question": graphed(
    wide(-1, 9, -1, 7),
    [
      solid([1, 1], [7, 1], "action"),
      solid([7, 1], [3, 5]),
      solid([3, 5], [1, 1]),
      dash([3, 5], [3, 1], "result"),
      pt([1, 1], "(1, 1)", "s"),
      pt([7, 1], "(7, 1)", "e"),
      pt([3, 5], "(3, 5)", "n"),
      tag([5, 1], "6", "n"),
      tag([3, 3], "4", "e"),
    ],
    "The vertices (1, 1) and (7, 1) share a y-coordinate, so they give a horizontal base of 6. The dashed height is 4, and half their product is an area of 12.",
    "顶点 (1, 1) 和 (7, 1) 纵坐标相同，所以给出水平的底 6。虚线高为 4，两者乘积的一半是面积 12。",
  ),
  "act-exam-finding-volumes-of-prisms-and-cylinders#exam-question": drawing(
    [...cylinderMarks(2, 5, "2", "5"), ...ellipse([0, 5], 2, 0.6, false, "result")],
    "The colored base has area π · 2² = 4π. Multiplying by the height 5 gives a volume of 20π.",
    "标色底面的面积是 π · 2² = 4π。乘以高 5，得到体积 20π。",
  ),
  "act-exam-finding-volumes-of-prisms-and-cylinders#harder-exam-question": (() => {
    const P: Point = [0, 0];
    const Q: Point = [6, 0];
    const R: Point = [1.8, 1.4];
    const up = ([x, y]: Point): Point => [x, y + 5];
    return drawing(
      [
        fill([up(P), up(Q), up(R)], "result"),
        seg(P, Q),
        seg(Q, up(Q)),
        seg(P, up(P)),
        seg(up(P), up(Q)),
        seg(up(Q), up(R)),
        seg(up(R), up(P)),
        seg(P, R, undefined, true),
        seg(R, Q, undefined, true),
        seg(R, up(R), undefined, true),
        note([3, 0], "6", "s"),
        note([6, 2.5], "5", "e"),
        note([0.9, 5.7], "4", "nw"),
      ],
      "The colored base is a right triangle with legs 6 and 4, so its area is 12. Times the height 5, the volume is 60.",
      "标色的底面是直角边为 6 和 4 的直角三角形，面积为 12。乘以高 5，体积是 60。",
    );
  })(),
  "act-exam-finding-volumes-of-pyramids-cones-and-spheres#exam-question": drawing(
    [
      ...coneMarks(3, 4, "3", "4"),
      ...ellipse([0, 4], 3, 0.9).map((m): Mark => ({ ...m, dashed: true }) as Mark),
      seg([-3, 0], [-3, 4], undefined, true),
      seg([3, 0], [3, 4], undefined, true),
    ],
    "The cone of radius 3 and height 4 inside the dashed cylinder with the same base and height. It holds one third of the cylinder: 12π.",
    "半径为 3、高为 4 的圆锥，放在底和高相同的虚线圆柱内。它的容积是圆柱的三分之一：12π。",
  ),
  "act-exam-finding-volumes-of-pyramids-cones-and-spheres#harder-exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [6, 0],
          [8.7, 2.1],
          [2.7, 2.1],
        ],
        "result",
      ),
      ...pyramidMarks(6, 5, "6", "5"),
    ],
    "The colored square base has area 6² = 36. One third of 36 times the height 5 is a volume of 60.",
    "标色的正方形底面面积是 6² = 36。36 乘以高 5 的三分之一，得到体积 60。",
  ),
  "act-exam-reading-trend-graphs#exam-question": drawing(
    pane(0, [0, 4, 1], [0, 20, 2], 6, 5)
      .path([
        [0, 10],
        [1, 12],
        [2, 15],
        [3, 18],
        [4, 17],
      ])
      .path(
        [
          [0, 12],
          [1, 12],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 18],
          [3, 18],
        ],
        undefined,
        true,
      )
      .path(
        [
          [3, 12],
          [3, 18],
        ],
        "result",
      )
      .path(
        [
          [1, 12],
          [3, 12],
        ],
        undefined,
        true,
      )
      .dot(1, 12)
      .dot(3, 18)
      .say(3, 15, "6", "e")
      .marks(),
    "For example, a graph at 12 and later at 18. Subtracting later minus earlier gives the colored change, 6.",
    "例如，图象先在 12，后来到 18。用后者减前者，得到标色的变化量 6。",
  ),
  "act-exam-reasoning-about-data-displays#exam-question": drawing(
    [...whisker([5, 10, 18, 25, 30], 0, 35, 5, { box: "result" }), note([3.5, 1.7], "15", "n")],
    "For example, a box plot with whiskers from 5 to 30 and a median of 18. The colored box runs from 10 to 25, so the interquartile range is its width, 15.",
    "例如，须从 5 到 30、中位数为 18 的箱线图。标色的箱子从 10 到 25，所以四分位距是它的宽度 15。",
  ),
  "act-exam-fitting-a-linear-model-to-data#harder-exam-question": drawing(
    pane(0, [0, 35, 5], [0, 70, 10], 6, 5)
      .f((x) => 2 * x + 5, 0, 12)
      .f((x) => 2 * x + 5, 12, 30, "action", true)
      .dot(2, 10)
      .dot(4, 12)
      .dot(6, 18)
      .dot(8, 20)
      .dot(10, 26)
      .dot(12, 28)
      .dot(30, 65, "(30, 65)", "w", "result")
      .marks(),
    "For example, dots that stop near x = 12. The line y = 2x + 5 continues beyond them, dashed, to the colored prediction: 65 at x = 30.",
    "例如，圆点在 x = 12 附近停止。直线 y = 2x + 5 以虚线继续向前，到达标色的预测值：x = 30 时为 65。",
  ),
  "act-exam-applying-successive-percent-changes#exam-question": drawing(
    bars([200, 220, 176], { top: 240, step: 40, hi: [2], over: true }),
    "A rise of 10% takes 200 to 220, and a fall of 20% applies to that 220. The colored last bar is 176.",
    "上升 10% 使 200 变成 220，下降 20% 作用在这个 220 上。标色的最后一条是 176。",
  ),
  "act-exam-reading-bar-graphs#harder-exam-question": drawing(
    bars([20, 30, 40, 50], { top: 50, step: 10, over: true, level: [35, "35"] }),
    "All four bars count: their heights total 140, and dividing by 4 gives the colored dashed mean of 35. No bar reaches exactly that height.",
    "四条都要算：高度合计 140，除以 4 得到标色虚线的平均值 35。没有哪一条正好是这个高度。",
  ),
  "act-exam-working-with-circle-graphs#exam-question": drawing(
    pie([25, 75], 0, ["25%", ""]),
    "The colored sector is labeled 25%, the share of the whole 200-dollar budget. As an amount, it is 50 dollars.",
    "标色扇形标有 25%，是 200 美元总预算所占的份额。换成金额是 50 美元。",
  ),
  "act-exam-working-with-circle-graphs#harder-exam-question": drawing(
    [...pie([40, 60], 0, ["144°", ""]), note(on(162, 2.4), "40%", "w")],
    "The colored sector of 40% takes that same share of the full 360° circle, so its central angle is 144°.",
    "40% 的标色扇形占整个 360° 圆的同样份额，所以圆心角是 144°。",
  ),
};
