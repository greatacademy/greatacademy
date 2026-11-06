// Drawings of the SAT explanations: angles at parallel lines, triangle angles, rectangles, right triangles and arcs.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { box, crossing, dash, fill, moved, parallelCut, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { angle, bend, drawing, fromAngles, graphed, note, on, ring, seg, wedge } from "./explanation-drawings-kit.ts";

const ray = (v: Point, deg: number, r: number): Point => on(deg, r, v);

/** bowtie is two triangles that meet at the origin with the same angle c there, each with its other two angles: left a, b and right d, e. */
function bowtie(a: number, b: number, d: number, e: number, labels: readonly string[], last: "result" | "action" = "result"): Mark[] {
  const c = 180 - a - b;
  const half = c / 2;
  const sin = (x: number) => Math.sin((x * Math.PI) / 180);
  const P = on(180 - half, 3.4 * sin(b));
  const Q = on(180 + half, 3.4 * sin(a));
  const R = on(-half, 3.4 * sin(e));
  const S = on(half, 3.4 * sin(d));
  return [
    ...tri([[0, 0], P, Q], { angles: [labels[0], labels[1], labels[2]], angleStyles: ["action"] }),
    ...tri([[0, 0], R, S], { angles: [labels[3], labels[4], labels[5]], angleStyles: ["action", undefined, last] }),
  ];
}

const cutOne = (v: Point, deg: number, h: number) => [v, ray(v, deg, h / Math.sin((deg * Math.PI) / 180))] as const;

/** examSatDrawings3 draws the explanations of SAT Math Prep, by knowledge point: parallel lines, triangle angles, rectangles and arcs. */
export const examSatDrawings3: Readonly<Record<string, Figure>> = {
  "sat-exam-corresponding-angles#exam-question": drawing(
    parallelCut(60, [
      [2, "action", "60°"],
      [6, "result", "60°"],
    ]),
    "For example, the transversal makes 60° with the upper line. The corresponding angle in the matching position on the lower line, in color, is also 60°, with no arithmetic.",
    "例如，截线与上方直线成 60°。下方直线上位置相同的同位角（标色）也是 60°，不需要计算。",
  ),
  "sat-exam-corresponding-angles#harder-exam-question": drawing(
    parallelCut(
      35,
      [
        [2, "action", "3x + 5"],
        [6, "result", "5x − 15"],
      ],
      2.6,
      3.4,
    ),
    "Corresponding angles in matching positions are equal, so 3x + 5 = 5x − 15. The drawing is to scale for x = 10, when both measure 35°.",
    "位置相同的同位角相等，所以 3x + 5 = 5x − 15。图按 x = 10 的比例画出，此时两个角都是 35°。",
  ),
  "sat-exam-consecutive-angles#exam-question": drawing(
    parallelCut(65, [
      [4, "action", "115°"],
      [6, "result", "65°"],
    ]),
    "Between the parallel lines, on the same side of the transversal, the angles 115° and 65° add to 180°.",
    "在平行线之间、截线同一侧的两个角 115° 和 65° 相加得 180°。",
  ),
  "sat-exam-consecutive-angles#harder-exam-question": drawing(
    [
      ...parallelCut(
        85,
        [
          [4, "action"],
          [6, "result"],
        ],
        4,
      ),
      note([1.3, 3.1], "5x + 20", "e"),
      note([0.9, 0.9], "3x + 40", "e"),
    ],
    "The two angles between the parallel lines on one side of the transversal add to 180°. The drawing is to scale for x = 15, where they measure 95° and 85°.",
    "平行线之间、截线同一侧的两个角相加得 180°。图按 x = 15 的比例画出，此时它们是 95° 和 85°。",
  ),
  "sat-exam-vertical-angles#exam-question": drawing(
    crossing(40, ["40°", "140°", "40°"], ["action", undefined, "result"], 3.4),
    "The colored angle across from the marked 40° is also 40°. The angle next to it is supplementary, 140°.",
    "与标出的 40° 相对的标色角也是 40°。与它相邻的角互补，为 140°。",
  ),
  "sat-exam-vertical-angles#harder-exam-question": drawing(
    crossing(51, ["4x + 3", undefined, "5x − 9"], ["action", undefined, "result"], 3.4),
    "The opposite angles at the crossing are equal, so 4x + 3 = 5x − 9. The drawing is to scale for x = 12, when both measure 51°.",
    "交点处相对的两个角相等，所以 4x + 3 = 5x − 9。图按 x = 12 的比例画出，此时两个角都是 51°。",
  ),
  "sat-exam-problem-solving-with-corresponding-angles#exam-question": (() => {
    const T = fromAngles(70, 45, 4.4);
    const h = T[2][1] + 1.2;
    const [, P] = cutOne([0, 0], 70, h);
    const upper = P[1];
    return drawing(
      [
        seg([-1.2, 0], [5.8, 0]),
        seg([-1.2, upper], [5.8, upper]),
        { kind: "arrows", a: [-1.2, 0], b: [0.2, 0], count: 1 },
        { kind: "arrows", a: [-1.2, upper], b: [0.2, upper], count: 1 },
        seg([0, 0], ray(P, 70, 0.8)),
        ...tri(T, { angles: ["70°", "45°", "65°"], angleStyles: ["action", undefined, "result"] }),
        angle(P, [P[0] + 1, upper], ray(P, 70, 1), "action", "70°"),
      ],
      "The 70° at the upper line moves down its transversal to the corresponding place inside the triangle. With 45°, the third angle is 65°, in color.",
      "上方直线处的 70° 沿截线移到三角形内的同位位置。结合 45°，第三个角为 65°（标色）。",
    );
  })(),
  "sat-exam-problem-solving-with-corresponding-angles#harder-exam-question": drawing(
    parallelCut(50, [
      [1, undefined, "130°"],
      [2, "action", "50°"],
      [6, "result", "5x"],
    ]),
    "The given 130° is supplementary to the 50° beside it. That 50° corresponds to the colored angle 5x, so 5x = 50.",
    "已知的 130° 与旁边的 50° 互补。这个 50° 与标色的角 5x 是同位角，所以 5x = 50。",
  ),
  "sat-exam-interior-angles-of-triangles#exam-question": drawing(
    tri(fromAngles(62, 75, 5), { angles: ["62°", "75°", "43°"], angleStyles: [undefined, undefined, "result"] }),
    "The three angles of the triangle add to 180°. With 62° and 75°, the third, in color, is 43°.",
    "三角形的三个角相加得 180°。已知 62° 和 75°，第三个角（标色）是 43°。",
  ),
  "sat-exam-interior-angles-of-triangles#harder-exam-question": drawing(
    tri(fromAngles(25, 75, 6), { angles: ["x°", "3x°", "80°"], angleStyles: ["result", "result"] }),
    "The angles x°, 3x° and 80° add to 180°. The drawing is to scale for x = 25, so the colored angles are 25° and 75°.",
    "角 x°、3x° 和 80° 相加得 180°。图按 x = 25 的比例画出，所以标色的角是 25° 和 75°。",
  ),
  "sat-exam-interior-angles-of-special-triangles#exam-question": drawing(
    tri(fromAngles(70, 70, 3.6), {
      angles: ["70°", "70°", "40°"],
      angleStyles: ["result", "result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "An isosceles triangle with a vertex angle of 40°. The remaining 140° splits evenly between the two colored base angles, 70° each.",
    "顶角为 40° 的等腰三角形。余下的 140° 平分给两个标色的底角，各 70°。",
  ),
  "sat-exam-interior-angles-of-special-triangles#harder-exam-question": drawing(
    tri(fromAngles(35, 35, 5.4), {
      angles: ["35°", "35°", "110°"],
      angleStyles: ["action", "action", "result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "An isosceles triangle has two base angles of 35°, both at the base. The colored vertex angle is 180 − 70 = 110°.",
    "等腰三角形的底边上有两个 35° 的底角。标色的顶角是 180 − 70 = 110°。",
  ),
  "sat-exam-exterior-angles-of-triangles#exam-question": (() => {
    const T = fromAngles(50, 65, 4);
    return drawing(
      [
        ...tri(T, { angles: ["50°", undefined, "65°"] }),
        seg(T[1], [T[1][0] + 1.8, 0]),
        angle(T[1], [T[1][0] + 1, 0], T[2], "result", "115°"),
      ],
      "The exterior angle, in color, is the sum of the two interior angles not next to it: 50° + 65° = 115°.",
      "标色的外角等于与它不相邻的两个内角之和：50° + 65° = 115°。",
    );
  })(),
  "sat-exam-exterior-angles-of-triangles#harder-exam-question": (() => {
    const T = fromAngles(25, 60, 5);
    return drawing(
      [
        ...tri(T, { angles: ["x°", undefined, "(3x + 20)°"] }),
        seg(T[1], [T[1][0] + 1.8, 0]),
        angle(T[1], [T[1][0] + 1, 0], T[2], "result", "120°"),
      ],
      "The two remote angles add to the colored exterior angle, 120°, not to 180°. The drawing is to scale for x = 25.",
      "两个不相邻的内角之和等于标色的外角 120°，而不是 180°。图按 x = 25 的比例画出。",
    );
  })(),
  "sat-exam-solving-problems-with-multiple-triangles#exam-question": drawing(
    bowtie(50, 60, 45, 65, ["70°", "50°", "60°", "70°", "45°", "65°"]),
    "Two triangles meet at a point. The left one gives a crossing angle of 70°, the vertical angle on the right is also 70°, and with 45° the last angle, in color, is 65°.",
    "两个三角形交于一点。左边的三角形给出交点处的角 70°，右边的对顶角也是 70°，结合 45°，最后一个角（标色）是 65°。",
  ),
  "sat-exam-solving-problems-with-multiple-triangles#harder-exam-question": drawing(
    [
      ...tri(fromAngles(30, 50, 6), { angles: ["30°", "50°", "a"], angleStyles: [undefined, undefined, "result"] }),
      ...tri(moved(fromAngles(40, 60, 6), 0, 1, 3.2), { angles: ["40°", "60°", "b"], angleStyles: [undefined, undefined, "result"] }),
    ],
    "Two triangles hold 360° in total. The four known angles use up 180°, so the colored angles a and b together make the remaining 180°.",
    "两个三角形的内角和共 360°。已知的四个角占去 180°，所以标色的角 a 和 b 合起来是剩下的 180°。",
  ),
  "sat-exam-interior-and-exterior-angles-in-connected-triangles#exam-question": (() => {
    const T = fromAngles(35, 120, 3);
    const [B, D, A] = T;
    const C: Point = [D[0] + 2.4, 0];
    return drawing(
      [
        { kind: "polygon", points: [B, C, A] },
        seg(A, D),
        angle(B, D, A, undefined, "35°"),
        angle(A, B, D, undefined, "25°"),
        angle(D, C, A, "result", "60°"),
      ],
      "A segment from the top to a point on the base creates a smaller triangle on the left. The colored angle on the far side of the segment is its exterior angle, 35° + 25° = 60°.",
      "从顶点到底边上一点的线段在左边形成一个较小的三角形。线段另一侧标色的角是它的外角，35° + 25° = 60°。",
    );
  })(),
  "sat-exam-interior-and-exterior-angles-in-connected-triangles#harder-exam-question": (() => {
    const w = 6;
    const h = w * Math.tan((40 * Math.PI) / 180);
    const B: Point = [0, 0];
    const C: Point = [w, 0];
    const A: Point = [w, h];
    const D: Point = [w - h * Math.tan((30 * Math.PI) / 180), 0];
    return drawing(
      [
        { kind: "polygon", points: [B, C, A] },
        seg(A, D),
        angle(A, B, D, "action", "20°"),
        angle(A, D, C, "action", "30°"),
        angle(B, C, A, undefined, "40°"),
        angle(C, A, B, "result", "90°"),
      ],
      "The angle at the split vertex, at the top, is the sum of its pieces, 20° + 30° = 50°. With 40° on the left, the whole triangle leaves 90° for the colored angle.",
      "顶部被分割的角等于两部分之和，20° + 30° = 50°。结合左边的 40°，整个三角形留给标色的角 90°。",
    );
  })(),
  "sat-exam-areas-of-rectangles-and-squares#exam-question": drawing(
    box(0, 0, 9, 5, { bottom: "9", right: "5", shade: "result", inside: "45" }),
    "A 9 by 5 rectangle. The shaded space inside it has an area of 45 square units.",
    "9 乘 5 的长方形。里面的阴影部分面积是 45 平方单位。",
  ),
  "sat-exam-areas-of-rectangles-and-squares#harder-exam-question": drawing(
    [
      ...box(0, 0, 10, 10, { bottom: "10", inside: "100" }),
      ...box(13, 0, 12, 8, { bottom: "12", right: "8", inside: "96", shade: "result" }),
    ],
    "The square of area 100 has side 10, so its perimeter is 40. The shaded rectangle has that same perimeter, so width 8 gives length 12 and area 96.",
    "面积为 100 的正方形边长为 10，周长为 40。阴影长方形的周长相同，所以宽 8 对应长 12，面积 96。",
  ),
  "sat-exam-perimeters-of-squares-rectangles-and-triangles#exam-question": drawing(
    box(0, 0, 9, 5, { bottom: "9", right: "5", top: "9", left: "5", line: "result" }),
    "The perimeter of the 9 by 5 rectangle is the colored distance around it, all four sides: 9 + 5 + 9 + 5 = 28.",
    "9 乘 5 的长方形的周长是标色的一周，共四条边：9 + 5 + 9 + 5 = 28。",
  ),
  "sat-exam-calculating-areas-in-the-coordinate-plane#exam-question": graphed(
    wide(-4, 6, -1, 8),
    [
      shape(
        [
          [-2, 1],
          [4, 1],
          [4, 6],
          [-2, 6],
        ],
        "result",
      ),
      solid([-2, 1], [4, 1], "action"),
      solid([4, 1], [4, 6], "action"),
      pt([-2, 1], "(−2, 1)", "sw"),
      pt([4, 1], "(4, 1)", "se"),
      pt([4, 6], "(4, 6)", "ne"),
      tag([1, 1], "6", "n"),
      tag([4, 3.5], "5", "e"),
    ],
    "The side from (−2, 1) to (4, 1) has length 6, from the x-values. The side from (4, 1) to (4, 6) has length 5, from the y-values. The colored rectangle has area 30.",
    "从 (−2, 1) 到 (4, 1) 的边长为 6，由 x 值得出。从 (4, 1) 到 (4, 6) 的边长为 5，由 y 值得出。标色长方形面积为 30。",
  ),
  "sat-exam-calculating-areas-in-the-coordinate-plane#harder-exam-question": graphed(
    wide(-2, 12, -2, 10, 2),
    [
      shape(
        [
          [0, 2],
          [10, 2],
          [3, 8],
        ],
        "result",
      ),
      solid([0, 2], [10, 2], "action"),
      solid([10, 2], [3, 8]),
      solid([3, 8], [0, 2]),
      dash([3, 8], [3, 2], "action"),
      pt([0, 2], "(0, 2)", "nw"),
      pt([10, 2], "(10, 2)", "ne"),
      pt([3, 8], "(3, 8)", "n"),
      tag([3, 5], "6", "w"),
      tag([6, 2], "10", "s"),
    ],
    "The horizontal side is the base, with length 10. The dashed height is the vertical distance 6 from (3, 8) down to the base's line, so the area is 30.",
    "水平的边作底，长为 10。虚线高是从 (3, 8) 到底边所在直线的竖直距离 6，所以面积为 30。",
  ),
  "sat-exam-areas-of-right-triangles#exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [10, 0],
          [10, 7],
        ],
        "result",
      ),
      ...rt(10, 7, { sides: ["10", "7"] }),
      seg([0, 0], [0, 7], undefined, true),
      seg([0, 7], [10, 7], undefined, true),
    ],
    "The legs 10 and 7 are the base and the height. The shaded triangle is half of the dashed rectangle, so its area is 35.",
    "直角边 10 和 7 就是底和高。阴影三角形是虚线长方形的一半，所以面积为 35。",
  ),
  "sat-exam-areas-of-right-triangles#harder-exam-question": drawing(
    rt(40, 9, { sides: ["40", "9", "41"], sideStyles: ["result"] }),
    "Leg 9 and hypotenuse 41 give the missing leg 40, in color. The area uses the two perpendicular legs, 9 and 40, and equals 180.",
    "直角边 9 和斜边 41 求出缺少的直角边 40（标色）。面积用互相垂直的两条直角边 9 和 40 计算，等于 180。",
  ),
  "sat-exam-the-pythagorean-theorem#exam-question": drawing(
    rt(15, 8, { sides: ["15", "8", "17"], sideStyles: [undefined, undefined, "result"] }),
    "A right triangle with legs 8 and 15. Its colored hypotenuse is 17, since 64 + 225 = 289.",
    "直角边为 8 和 15 的直角三角形。标色的斜边是 17，因为 64 + 225 = 289。",
  ),
  "sat-exam-modeling-situations-using-the-pythagorean-theorem#exam-question": drawing(
    tri(
      [
        [0, 0],
        [8, 6],
        [0, 6],
      ],
      { sides: ["10", "8", "6"], sideStyles: ["result"], right: 2 },
    ),
    "A walk of 6 blocks north and then 8 east forms the legs of a right triangle. The colored hypotenuse, 10, is the straight-line distance from the start.",
    "向北走 6 个街区再向东走 8 个街区，构成直角三角形的两条直角边。标色的斜边 10 是到起点的直线距离。",
  ),
  "sat-exam-problem-solving-with-isosceles-right-triangles#exam-question": drawing(
    rt(7, 7, { sides: ["7", "7", "7√2"], angles: ["45°", undefined, "45°"], sideStyles: [undefined, undefined, "result"] }),
    "A 45-45-90 triangle with equal legs of 7. The colored hypotenuse is 7√2, shorter than 14.",
    "45-45-90 三角形，两条直角边都是 7。标色的斜边是 7√2，比 14 短。",
  ),
  "sat-exam-problem-solving-with-special-triangles#exam-question": drawing(
    rt(6 * Math.sqrt(3), 6, {
      sides: [undefined, "6", "12"],
      angles: ["30°", undefined, "60°"],
      sideStyles: [undefined, undefined, "result"],
    }),
    "A 30-60-90 triangle. The side 6 lies opposite 30°, so it is half of the colored hypotenuse, 12.",
    "30-60-90 三角形。边 6 对着 30°，所以它是标色斜边 12 的一半。",
  ),
  "sat-exam-further-problem-solving-with-special-triangles#exam-question": (() => {
    const h = 4 * Math.sqrt(3);
    return drawing(
      [
        ...tri(
          [
            [0, 0],
            [8, 0],
            [4, h],
          ],
          { sides: [undefined, "8"], angles: ["60°"] },
        ),
        seg([4, 0], [4, h], "result", true),
        { kind: "right", vertex: [4, 0], from: [8, 0], to: [4, h] },
        note([2, 0], "4", "s"),
        note([4, h / 2], "4√3", "w"),
      ],
      "The dashed altitude splits an equilateral triangle of side 8 into two 30-60-90 triangles. The short side is half of 8, namely 4, so the colored height is 4√3.",
      "虚线高把边长为 8 的等边三角形分成两个 30-60-90 三角形。短边是 8 的一半，即 4，所以标色的高是 4√3。",
    );
  })(),
  "sat-exam-arc-lengths-of-sectors#exam-question": drawing(
    [
      ring(12),
      seg([0, 0], on(0, 12)),
      seg([0, 0], on(60, 12)),
      ...bend(0, 60, 12, [0, 0], "result"),
      angle([0, 0], on(0, 12), on(60, 12), undefined, "60°"),
      note([6, 0], "12", "s"),
      note(on(30, 12), "4π", "ne"),
    ],
    "A central angle of 60° is one sixth of the full circle. So the colored arc is one sixth of the circumference 24π, which is 4π.",
    "60° 的圆心角是整圆的六分之一。所以标色的弧是周长 24π 的六分之一，即 4π。",
  ),
  "sat-exam-arc-lengths-of-sectors#harder-exam-question": drawing(
    [
      ring(6),
      seg([0, 0], on(0, 6), "result"),
      seg([0, 0], on((3 * 180) / Math.PI, 6)),
      ...bend(0, (3 * 180) / Math.PI, 6, [0, 0], "action"),
      angle([0, 0], on(0, 6), on((3 * 180) / Math.PI, 6), undefined, "3 rad"),
      note([3, 0], "6", "s"),
      note(on(70, 6), "18", "ne"),
    ],
    "An arc of 18 under an angle of 3 radians, drawn to scale. Dividing gives the colored radius, 6.",
    "角度为 3 弧度时弧长为 18，按比例画出。相除得到标色的半径 6。",
  ),
  "sat-exam-areas-and-circumferences-of-circles#exam-question": drawing(
    [wedge(0, 359.9, 9, [0, 0], "result"), ring(9), seg([0, 0], on(0, 9)), note([4.5, 0], "9", "s"), note([-3, 2.5], "81π", "n")],
    "A circle of radius 9. The shaded area is π times the square of the radius, 81π.",
    "半径为 9 的圆。阴影面积是 π 乘半径的平方，即 81π。",
  ),
};
