// Drawings of the ACT explanations: slopes, solids, conics, systems, quadratics, and angles at lines and in triangles.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { crossing, dash, parallelCut, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { ln, prismMarks, pt, pyramidOn } from "./explanation-drawings-geometry-2.ts";
import { angle, cylinderMarks, drawing, fromAngles, fromSides, graphed, name, note, seg } from "./explanation-drawings-kit.ts";

const round = (c: Point, r: number): PlaneMark => ({ kind: "circle", center: c, r });
const oval = (h: number, k: number, a: number, b: number): PlaneMark => ({
  kind: "path",
  points: Array.from({ length: 121 }, (_, i): Point => [h + a * Math.cos((i * Math.PI) / 60), k + b * Math.sin((i * Math.PI) / 60)]),
});

/** outward draws a triangle with base angles a, b and a base extended past its second corner, with the exterior angle marked. */
function outward(a: number, b: number, labels: readonly (string | undefined)[], exterior: string, base = 5): Mark[] {
  const T = fromAngles(a, b, base);
  return [...tri(T, { angles: labels }), seg(T[1], [T[1][0] + 2, 0]), angle(T[1], [T[1][0] + 1, 0], T[2], "result", exterior)];
}

/** examActDrawings4 draws the explanations of ACT Math Prep, by knowledge point: slopes, solids, conics, systems, quadratics and angles. */
export const examActDrawings4: Readonly<Record<string, Figure>> = {
  "act-exam-comparing-and-reading-slopes#harder-exam-question": graphed(
    wide(-5, 5, -5, 5, 2),
    [
      ln([0, 1], [1, 3]),
      ln([0, -2], [1, 0]),
      ln([0, 0], [2, -1], "result"),
      tag([-3, -4.6], "2", "e"),
      tag([3.4, -1.7], "−1/2", "n"),
      tag([0.8, 3.8], "2", "w"),
    ],
    "The line y = 2x + 1 with a parallel line of the same slope 2, and a perpendicular line, in color, whose slope is the negative reciprocal −1/2.",
    "直线 y = 2x + 1，斜率同为 2 的平行线，以及标色的垂线，其斜率是负倒数 −1/2。",
  ),
  "act-exam-placing-figures-in-the-coordinate-plane#exam-question": graphed(
    wide(-1, 8, -1, 7),
    [
      solid([1, 2], [6, 2]),
      solid([6, 2], [6, 5]),
      dash([6, 5], [1, 5], "action"),
      dash([1, 5], [1, 2], "action"),
      pt([1, 2], "(1, 2)", "s"),
      pt([6, 2], "(6, 2)", "s"),
      pt([6, 5], "(6, 5)", "n"),
      pt([1, 5], "(1, 5)", "n", "result"),
    ],
    "A rectangle uses two x-values, 1 and 6, and two y-values, 2 and 5, each twice. The colored fourth corner takes the values that appear only once: (1, 5).",
    "长方形用到两个 x 值 1 和 6、两个 y 值 2 和 5，各两次。标色的第四个顶点取只出现一次的值：(1, 5)。",
  ),
  "act-exam-finding-a-dimension-from-volume#harder-exam-question": drawing(
    [...cylinderMarks(3, 5, undefined, "5"), seg([3, 0], [3, 5], "result"), note([1.5, -0.78], "3", "s")],
    "A cylinder of volume 45π and radius 3. Dividing by π · 3² = 9π gives the colored height, 5.",
    "体积为 45π、半径为 3 的圆柱。除以 π · 3² = 9π，得到标色的高 5。",
  ),
  "act-exam-identifying-features-of-a-solid#exam-question": drawing(
    prismMarks(5, 3, 4),
    "A pentagonal prism has 7 faces, 15 edges and 10 vertices: two bases of 5 edges each, and 5 edges joining them.",
    "五棱柱有 7 个面、15 条棱和 10 个顶点：两个底面各 5 条棱，还有 5 条棱连接它们。",
  ),
  "act-exam-identifying-features-of-a-solid#harder-exam-question": drawing(
    pyramidOn(4, 3, 4),
    "A square pyramid has 5 faces, 8 edges and 5 vertices: 4 edges around the base and 4 up to the one apex.",
    "四棱锥有 5 个面、8 条棱和 5 个顶点：底面一周 4 条棱，通向唯一顶点的 4 条棱。",
  ),
  "act-exam-writing-ellipse-equations#harder-exam-question": graphed(
    wide(-8, 10, -3, 6, 2),
    [
      oval(1, 1, 5, 3),
      solid([1, 1], [6, 1], "result"),
      solid([1, 1], [1, 4], "action"),
      pt([-4, 1], "(−4, 1)", "w"),
      pt([6, 1], "(6, 1)", "e"),
      pt([1, 4], "(1, 4)", "ne"),
      pt([1, 1], "", "n"),
      tag([3.5, 1], "5", "s"),
      tag([1, 2.5], "3", "e"),
    ],
    "The center (1, 1) is the midpoint of the vertices. The colored distance to a vertex is a = 5, half the whole width, and the distance to the co-vertex is b = 3.",
    "圆心 (1, 1) 是两顶点的中点。到顶点的标色距离是 a = 5，为全宽的一半；到余顶点的距离是 b = 3。",
  ),
  "act-exam-working-with-hyperbolas#harder-exam-question": (() => {
    const y = (x: number) => (4 / 3) * Math.sqrt(x * x - 9);
    return graphed(
      wide(-7, 7, -7, 7, 2),
      [
        curveOf(y, undefined, 3, 6),
        curveOf((x) => -y(x), undefined, 3, 6),
        curveOf(y, undefined, -6, -3),
        curveOf((x) => -y(x), undefined, -6, -3),
        ln([0, 0], [3, 4], "result", true),
        ln([0, 0], [3, -4], "result", true),
        solid([3, 0], [3, 4], "action"),
        tag([3, 2], "4", "w"),
        tag([1.5, 0], "3", "n"),
      ],
      "The colored dashed asymptotes of x²/9 − y²/16 = 1 have slopes ±4/3, from the rise 4 over the run 3, the square roots of the denominators.",
      "x²/9 − y²/16 = 1 的标色渐近虚线斜率为 ±4/3，由升高 4 比水平 3 得出，它们是分母的平方根。",
    );
  })(),
  "act-exam-analyzing-intersections-of-conics#exam-question": graphed(
    wide(-7, 7, -6, 8, 2),
    [
      round([0, 0], 5),
      solid([-7, 7], [7, 7]),
      solid([-7, 5], [7, 5], "result"),
      pt([0, 5], "", "n", "result"),
      tag([4.8, 7], "y = 7", "n"),
      tag([4.8, 5], "y = 5", "n"),
    ],
    "The circle x² + y² = 25 reaches only as high as 5. The line y = 7 misses it, while the colored line y = 5 touches it once.",
    "圆 x² + y² = 25 最高只到 5。直线 y = 7 与它不相交，标色直线 y = 5 与它相碰一次。",
  ),
  "act-exam-analyzing-intersections-of-conics#harder-exam-question": graphed(
    wide(-12, 12, -12, 12, 4),
    [
      round([0, 0], 10),
      solid([-8, 6], [8, 6], "result"),
      solid([0, 0], [8, 6]),
      pt([-8, 6], "(−8, 6)", "nw"),
      pt([8, 6], "(8, 6)", "ne"),
      tag([-4, 6], "16", "n"),
      tag([4, 3], "10", "se"),
    ],
    "The line y = 6 meets the circle of radius 10 at x = ±8. The colored distance between the two points is twice the root, 16.",
    "直线 y = 6 与半径为 10 的圆交于 x = ±8。两点之间标色的距离是根的两倍，为 16。",
  ),
  "act-exam-determining-how-many-solutions-a-system-has#exam-question": graphed(
    wide(-3, 6, -3, 6),
    [
      ln([0, 5], [1, 3]),
      ln([0, 5], [1, 3], "action", true),
      ln([0, 3.5], [1, 1.5], "result"),
      tag([3, -1], "2x + y = 5", "e"),
      tag([-0.8, 4.8], "4x + 2y = 7", "w"),
    ],
    "The partner 4x + 2y = 10, dashed, lies on 2x + y = 5, which gives infinitely many solutions. The colored 4x + 2y = 7 is parallel, which gives none.",
    "4x + 2y = 10（虚线）落在 2x + y = 5 上，有无穷多解。标色的 4x + 2y = 7 与它平行，无解。",
  ),
  "act-exam-determining-how-many-solutions-a-system-has#harder-exam-question": graphed(
    wide(-4, 4, -3, 7),
    [
      ln([0, 1], [1, 5]),
      ln([0, 4.5], [1, 8.5], "result"),
      pt([0, 1], "", "n"),
      pt([0, 4.5], "", "n", "result"),
      tag([-1.8, 0.4], "2y = 8x + 9", "w"),
      tag([1.5, 2], "y = 4x + 1", "e"),
    ],
    "With m = 8, the line 2y = 8x + 9 has slope 4 and intercept 4.5, in color. It runs parallel to y = 4x + 1 and never meets it.",
    "当 m = 8 时，直线 2y = 8x + 9 斜率为 4、截距为 4.5（标色）。它与 y = 4x + 1 平行，永不相交。",
  ),
  "act-exam-modeling-with-quadratic-equations#harder-exam-question": drawing(
    pane(0, [0, 4, 1], [0, 45, 5], 6, 5, "t", "h")
      .f((t) => -16 * t * t + 48 * t + 5, 0, 3.1)
      .path(
        [
          [1.5, 0],
          [1.5, 41],
        ],
        "action",
        true,
      )
      .dot(1.5, 41, undefined, "n", "result")
      .say(1.5, 3, "3/2", "e")
      .marks(),
    "The graph of h = −16t² + 48t + 5 peaks at its vertex, in color, above t = 3/2. The question asks when, so the answer is that input.",
    "h = −16t² + 48t + 5 的图象在顶点（标色）达到最高，它位于 t = 3/2 上方。问的是何时，所以答案就是这个输入。",
  ),
  "act-exam-modeling-perimeter-problems#harder-exam-question": drawing(
    tri(fromSides(11, 7, 7), {
      sides: ["s + 4", "s", "s"],
      sideStyles: ["result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "Three sides to add: two equal sides s and a colored base that is 4 longer. Drawn to scale for s = 7, where the perimeter is 25.",
    "三条边相加：两条相等的边 s 和长出 4 的标色底边。按 s = 7 的比例画出，此时周长为 25。",
  ),
  "act-exam-matching-functions-to-representations#harder-exam-question": graphed(
    wide(-2, 6, -7, 5),
    [ln([0, 3], [1, 1]), dash([4, 0], [4, -5], "action"), pt([4, -5], "(4, −5)", "w", "result"), tag([1, 1], "y = −2x + 3", "ne")],
    "On the line y = −2x + 3, going to x = 4 and reading the height, along the dashed line, gives the colored point. So f(4) = −5.",
    "在直线 y = −2x + 3 上，沿虚线到 x = 4 读出高度，得到标色的点。所以 f(4) = −5。",
  ),
  "act-exam-finding-extreme-values-of-quadratics#exam-question": graphed(
    wide(-6, 3, -10, 6, 3),
    [curveOf((x) => 3 * (x + 2) ** 2 - 7), pt([-2, -7], "(−2, −7)", "s", "result"), dash([-2, 0], [-2, -7], "action")],
    "The graph of 3(x + 2)² − 7 has its lowest point at (−2, −7), in color. The minimum value is the height −7; the input −2 is only where it occurs.",
    "3(x + 2)² − 7 的图象最低点在 (−2, −7)（标色）。最小值是高度 −7；输入 −2 只是它出现的位置。",
  ),
  "act-exam-finding-extreme-values-of-quadratics#harder-exam-question": graphed(
    wide(-2, 10, -4, 15, 3),
    [curveOf((x) => -x * x + 8 * x - 3), dash([4, 0], [4, 13], "action"), pt([4, 13], "(4, 13)", "e", "result"), pt([4, 0], "", "n")],
    "With a negative leading coefficient, y = −x² + 8x − 3 has a maximum, in color, on the dashed line x = 4.",
    "首项系数为负时，y = −x² + 8x − 3 有最大值（标色），位于虚线 x = 4 上。",
  ),
  "act-exam-locating-points-on-a-parabola#exam-question": graphed(
    wide(-3, 7, -4, 5),
    [
      curveOf((x) => (x - 2) ** 2 / 3 - 2),
      dash([2, -4], [2, 5], "action"),
      solid([-1, 1], [5, 1]),
      pt([5, 1], "(5, 1)", "se"),
      pt([-1, 1], "(−1, 1)", "sw", "result"),
      tag([3.5, 1], "3", "n"),
      tag([0.5, 1], "3", "n"),
    ],
    "The point (5, 1) lies 3 to the right of the dashed axis x = 2. Its mirror image, in color, lies 3 to the left at the same height: (−1, 1).",
    "点 (5, 1) 在虚线轴 x = 2 右边 3 处。它的镜像（标色）在左边 3 处，高度相同：(−1, 1)。",
  ),
  "act-exam-locating-points-on-a-parabola#harder-exam-question": graphed(
    wide(-1, 7, -10, 6, 2),
    [
      curveOf((x) => 2 * (x - 1) * (x - 5)),
      dash([3, 0], [3, -8], "action"),
      pt([1, 0], "", "n"),
      pt([5, 0], "", "n"),
      pt([3, -8], "(3, −8)", "se", "result"),
    ],
    "For example, a parabola with intercepts 1 and 5. The axis x = 3, dashed, lies halfway between them, so the colored vertex gives f(3) = −8.",
    "例如，截距为 1 和 5 的抛物线。虚线轴 x = 3 在它们正中间，所以标色的顶点给出 f(3) = −8。",
  ),
  "act-exam-transforming-quadratic-functions#harder-exam-question": graphed(
    wide(-2, 9, -1, 12, 2),
    [
      curveOf((x) => (x - 1) ** 2 + 6, undefined, -1.2, 3.2, true),
      curveOf((x) => (x - 6) ** 2 + 8, "result", 4.2, 7.8),
      toward([1, 6], [6, 6], "action"),
      toward([6, 6], [6, 8], "action"),
      pt([1, 6], "(1, 6)", "s"),
      pt([6, 8], "(6, 8)", "se", "result"),
      tag([3.5, 6], "5", "s"),
      tag([6, 7], "2", "w"),
    ],
    "The dashed y = (x − 1)² + 6 has vertex (1, 6). Moving 5 right and 2 up puts the colored vertex at (6, 8).",
    "虚线 y = (x − 1)² + 6 的顶点是 (1, 6)。向右 5、向上 2，标色的顶点就在 (6, 8)。",
  ),
  "act-exam-identifying-features-of-exponential-functions#harder-exam-question": graphed(
    wide(-7, 4, -1, 16, 2),
    [curveOf((x) => 3 * 2 ** x + 4, undefined, -7, 1.9), ln([0, 4], [1, 4], "result", true), tag([-4.5, 4], "y = 4", "s")],
    "As x decreases, the term 3 · 2ˣ shrinks toward 0, so the graph settles on the colored dashed line y = 4 and never reaches it.",
    "x 减小时，3 · 2ˣ 趋于 0，所以图象趋近标色虚线 y = 4，但永远到不了。",
  ),
  "act-exam-finding-points-and-zeros-of-a-function#exam-question": graphed(
    wide(-2, 8, -14, 4, 2),
    [ln([4, 0], [5, 3]), pt([4, 0], "(4, 0)", "nw", "result"), pt([0, -12], "(0, −12)", "e"), tag([5, 3], "y = 3x − 12", "e")],
    "The line y = 3x − 12 meets the horizontal axis at (4, 0), in color. The constant −12 gives the y-intercept, a different point.",
    "直线 y = 3x − 12 与横轴交于 (4, 0)（标色）。常数 −12 给出的是 y 轴截距，另一个点。",
  ),
  "act-exam-finding-angles-formed-by-intersecting-lines#exam-question": drawing(
    crossing(70, ["70°", "110°", "70°"], ["action", "result", "action"], 3.4),
    "The neighbor of a 70° angle lies on a straight line with it, so the colored angle is 110°. The opposite angle equals 70°.",
    "与 70° 相邻的角和它在一条直线上，所以标色的角是 110°。相对的角等于 70°。",
  ),
  "act-exam-finding-angles-formed-by-intersecting-lines#harder-exam-question": drawing(
    crossing(50, ["(3x + 5)°", "130°", "50°"], ["action", "result", "action"], 3.6),
    "The angle written with x is opposite 50°, so it is also 50°. The colored neighbor is 130°, with no need to solve for x.",
    "用 x 表示的角与 50° 相对，所以也是 50°。标色的相邻角是 130°，不需要解 x。",
  ),
  "act-exam-finding-angles-with-parallel-lines#exam-question": drawing(
    parallelCut(65, [
      [2, "action", "65°"],
      [6, "result", "65°"],
      [5, undefined, "115°"],
    ]),
    "A line crossing parallel lines repeats the same picture. The colored angle in the matching position is 65°, and its neighbor is the supplement, 115°.",
    "直线穿过平行线时重复同样的图形。位置相同的标色角是 65°，相邻的角是补角 115°。",
  ),
  "act-exam-finding-angles-with-parallel-lines#harder-exam-question": drawing(
    parallelCut(55, [
      [2, "action", "(3x + 10)°"],
      [6, "result", "55°"],
    ]),
    "Corresponding angles match, so 3x + 10 = 55. The two angles in matching positions are drawn at 55°, and x = 15.",
    "同位角相等，所以 3x + 10 = 55。位置相同的两个角都按 55° 画出，x = 15。",
  ),
  "act-exam-problem-solving-with-parallel-lines#exam-question": (() => {
    const T = fromAngles(50, 70, 6);
    const [B, C, A] = T;
    const f = 0.55;
    const D: Point = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f];
    const E: Point = [A[0] + (C[0] - A[0]) * f, A[1] + (C[1] - A[1]) * f];
    return drawing(
      [
        { kind: "polygon", points: [B, C, A] },
        seg(D, E),
        { kind: "arrows", a: D, b: E, count: 1 },
        { kind: "arrows", a: B, b: [B[0] + 3.6, 0], count: 1 },
        angle(D, E, A, "action"),
        angle(B, C, A, "action"),
        angle(E, A, D, "result"),
        angle(C, A, B, "result"),
        name(A, "A", "n"),
        name(B, "B", "sw"),
        name(C, "C", "se"),
        name(D, "D", "w"),
        name(E, "E", "e"),
      ],
      "With DE parallel to BC, the angle at D matches the angle at B, and the angle at E matches the angle at C, each pair in one color.",
      "DE 平行于 BC 时，D 处的角与 B 处的角相等，E 处的角与 C 处的角相等，每对用一种颜色标出。",
    );
  })(),
  "act-exam-problem-solving-with-parallel-lines#harder-exam-question": drawing(
    parallelCut(50, [
      [1, "result", "130°"],
      [2, undefined, "50°"],
      [3, undefined, "50°"],
      [4, "result", "130°"],
      [5, "result", "130°"],
      [6, undefined, "50°"],
      [7, undefined, "50°"],
      [8, "result", "130°"],
    ]),
    "The eight angles have only two sizes. The four colored angles of 130° total 520°, and all eight total 720°.",
    "八个角只有两种大小。四个标色的 130° 共 520°，八个角共 720°。",
  ),
  "act-exam-finding-interior-angles-of-triangles#exam-question": drawing(
    tri(fromAngles(50, 60, 5), { angles: ["50°", "60°", "70°"], angleStyles: [undefined, undefined, "result"] }),
    "The three interior angles total 180°. With 50° and 60°, the colored third angle is 70°.",
    "三个内角共 180°。已知 50° 和 60°，标色的第三个角是 70°。",
  ),
  "act-exam-finding-interior-angles-of-triangles#harder-exam-question": drawing(
    tri(fromAngles(25, 50, 6), { angles: ["x°", "2x°", "(3x + 30)°"], angleStyles: [undefined, undefined, "result"] }),
    "The angles x°, 2x° and (3x + 30)° total 180°. The drawing is to scale for x = 25, so they are 25°, 50° and, in color, 105°.",
    "角 x°、2x° 和 (3x + 30)° 共 180°。图按 x = 25 的比例画出，所以它们是 25°、50° 和标色的 105°。",
  ),
  "act-exam-finding-exterior-angles-of-triangles#exam-question": drawing(
    outward(35, 85, ["35°", undefined, "60°"], "95°"),
    "The colored exterior angle is the sum of the two interior angles that do not touch it: 35° + 60° = 95°.",
    "标色的外角等于与它不相邻的两个内角之和：35° + 60° = 95°。",
  ),
  "act-exam-finding-exterior-angles-of-triangles#harder-exam-question": drawing(
    (() => {
      const T = fromAngles(50, 60, 5);
      return [
        ...tri(T, { angles: ["50°", "60°"], angleStyles: [undefined, "result"] }),
        seg(T[1], [T[1][0] + 2, 0]),
        angle(T[1], [T[1][0] + 1, 0], T[2], "action", "120°"),
      ];
    })(),
    "The exterior angle of 120° and the colored interior angle beside it form a straight line, so that neighbor is 60°. The remote 50° is a distractor.",
    "120° 的外角和旁边标色的内角在一条直线上，所以这个相邻角是 60°。不相邻的 50° 是干扰项。",
  ),
  "act-exam-finding-angles-in-isosceles-triangles#exam-question": drawing(
    tri(fromAngles(55, 55, 4.4), {
      angles: ["55°", "55°", "70°"],
      angleStyles: ["action", "action", "result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "Equal sides face equal base angles of 55°, so both count. The colored top angle is 180° − 110° = 70°.",
    "相等的边对着相等的底角 55°，两个都要算。标色的顶角是 180° − 110° = 70°。",
  ),
  "act-exam-finding-angles-in-isosceles-triangles#harder-exam-question": drawing(
    (() => {
      const T = fromAngles(50, 50, 5);
      return [
        ...tri(T, {
          angles: ["50°", "50°", "80°"],
          angleStyles: [undefined, "action", "result"],
          ticks: [
            [1, 1],
            [2, 1],
          ],
        }),
        seg(T[1], [T[1][0] + 2, 0]),
        angle(T[1], [T[1][0] + 1, 0], T[2], undefined, "130°"),
      ];
    })(),
    "The outside angle of 130° and the base angle next to it are supplementary, so both base angles are 50°. The colored top angle is then 80°.",
    "130° 的外角和旁边的底角互补，所以两个底角都是 50°。标色的顶角就是 80°。",
  ),
  "act-exam-problem-solving-with-isosceles-triangles#exam-question": (() => {
    const B: Point = [0, 0];
    const D: Point = [4, 0];
    const A: Point = [4 + 4 * Math.cos((80 * Math.PI) / 180), 4 * Math.sin((80 * Math.PI) / 180)];
    const C: Point = [8, 0];
    return drawing(
      [
        { kind: "polygon", points: [B, C, A] },
        seg(A, D),
        { kind: "ticks", a: A, b: D, count: 1 },
        { kind: "ticks", a: B, b: D, count: 1 },
        angle(B, D, A, undefined, "40°"),
        angle(A, B, D, "action", "40°"),
        angle(D, C, A, "result", "80°"),
        name(A, "A", "n"),
        name(B, "B", "sw"),
        name(C, "C", "se"),
        name(D, "D", "s"),
      ],
      "AD = BD makes a hidden isosceles triangle, so the angles at B and at A are both 40°. The colored exterior angle ADC is their sum, 80°.",
      "AD = BD 形成一个隐藏的等腰三角形，所以 B 处和 A 处的角都是 40°。标色的外角 ADC 是它们的和 80°。",
    );
  })(),
  "act-exam-problem-solving-with-isosceles-triangles#harder-exam-question": drawing(
    tri(fromSides(8, 11, 11), {
      sides: ["8", "11", "11"],
      sideStyles: [undefined, "result", "result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "Perimeter 30 minus the base 8 leaves 22 for the two equal sides, so each colored side is 11.",
    "周长 30 减去底 8，剩下 22 给两条相等的边，所以每条标色的边都是 11。",
  ),
};
