// Drawings of the SAT explanations: circles with triangles and chords, circle equations, inscribed figures and solids.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { ball, box, holed, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { pt, shift } from "./explanation-drawings-geometry-2.ts";
import { boxMarks, coneMarks, cylinderMarks, drawing, ellipse, graphed, note, on, ring, seg, square } from "./explanation-drawings-kit.ts";

const round = (c: Point, r: number, tone?: "action" | "result", dashed = false): PlaneMark => ({
  kind: "circle",
  center: c,
  r,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** radii is two radii and the chord between their ends, below the center, with labels on the center and the base angles. */
function radii(central: number, labels: readonly [string, string, string], styles: readonly ("action" | "result" | undefined)[]): Mark[] {
  const r = 4;
  const P = on(270 - central / 2, r);
  const Q = on(270 + central / 2, r);
  return [
    ring(r),
    ...tri([[0, 0], P, Q], {
      angles: labels,
      angleStyles: styles,
      ticks: [
        [0, 1],
        [2, 1],
      ],
    }),
  ];
}

/** tangent is a circle of radius 8 with a tangent segment of 15 from the point of tangency and the line of 17 to the center. */
const tangent = (s: "action" | "result", highlight: number): Mark[] => {
  const O: Point = [0, 0];
  const P: Point = [15, 8];
  const T: Point = [0, 8];
  const sideStyles = [undefined, undefined, undefined].map((_, i) => (i === highlight ? s : undefined));
  return [
    ring(8),
    seg([-5, 8], T),
    ...tri([O, P, T], { sides: [undefined, "15", "8"], right: 2, sideStyles }),
    note([11, 5.87], "17", "se"),
    { kind: "dot", at: O },
  ];
};

/** chord is a circle of radius 10 with a chord 6 from its center. */
const chord = (extra: readonly Mark[]): Mark[] => [
  ring(10),
  seg([0, 0], [0, -6], undefined, true),
  square([0, -6], [8, -6], [0, 0]),
  { kind: "dot", at: [0, 0] },
  note([0, -3], "6", "w"),
  ...extra,
];

const can = (r: number, h: number, radius: string, height?: string): Mark[] => [
  ...cylinderMarks(r, h, undefined, height),
  note([r / 2, -r * 0.26], radius, "s"),
];

const H4 = 4 * Math.sqrt(3);

/** examSatDrawings4 draws the explanations of SAT Math Prep, by knowledge point: circles, inscribed figures and solids. */
export const examSatDrawings4: Readonly<Record<string, Figure>> = {
  "sat-exam-isosceles-triangles-formed-within-circles#exam-question": drawing(
    radii(80, ["80°", "50°", "50°"], ["action", "result", "result"]),
    "Two radii and a chord form an isosceles triangle, the equal radii marked. Taking 80° from 180° and halving gives the colored base angles, 50° each.",
    "两条半径和一条弦构成等腰三角形，相等的半径已标记。180° 减去 80° 再减半，得到标色的底角，各 50°。",
  ),
  "sat-exam-isosceles-triangles-formed-within-circles#harder-exam-question": drawing(
    [
      ...radii(130, ["", "", ""], ["result", "action", "action"]),
      note([0, 0], "130°", "n"),
      note([-2.4, -1.69], "25°", "s"),
      note([2.4, -1.69], "25°", "s"),
    ],
    "The two radii are equal, so both angles between chord and radius are 25°. The colored central angle is 180° minus twice 25°, which is 130°.",
    "两条半径相等，所以弦与半径的两个夹角都是 25°。标色的圆心角是 180° 减去 25° 的两倍，即 130°。",
  ),
  "sat-exam-tangent-lines-to-circles#exam-question": drawing(
    tangent("result", 0),
    "The radius 8 meets the tangent 15 at a right angle. The radius, the tangent and the line to the center form a right triangle, and its colored hypotenuse is 17.",
    "半径 8 与切线 15 成直角。半径、切线和到圆心的连线构成直角三角形，标色的斜边是 17。",
  ),
  "sat-exam-tangent-lines-to-circles#harder-exam-question": drawing(
    tangent("result", 2),
    "The same right triangle, with the distance 17 as hypotenuse and the tangent 15 as a leg. Subtracting squares gives the colored radius, 8, a leg shorter than the hypotenuse.",
    "同样的直角三角形，距离 17 是斜边，切线 15 是一条直角边。平方相减得到标色的半径 8，它是比斜边短的直角边。",
  ),
  "sat-exam-bisectors-of-chords#exam-question": drawing(
    chord([
      seg([-8, -6], [8, -6], "result"),
      seg([0, 0], [8, -6]),
      note([4, -3], "10", "ne"),
      note([-4, -6], "8", "n"),
      note([4, -6], "8", "n"),
    ]),
    "The perpendicular from the center bisects the chord. Radius 10 and distance 6 give half the chord as 8, so the whole colored chord is 16.",
    "从圆心作的垂线平分弦。半径 10 和距离 6 得出半弦长 8，所以整条标色的弦是 16。",
  ),
  "sat-exam-bisectors-of-chords#harder-exam-question": drawing(
    chord([
      seg([-8, -6], [8, -6]),
      seg([0, 0], [8, -6], "result"),
      note([4, -3], "10", "ne"),
      note([0, -6], "16", "s"),
      note([4, -6], "8", "n"),
    ]),
    "The chord of 16 is halved first, so the right triangle has legs 8 and 6. Its colored hypotenuse is the radius, 10.",
    "先把长为 16 的弦减半，所以直角三角形的直角边是 8 和 6。标色的斜边就是半径 10。",
  ),
  "sat-exam-the-canonical-equation-of-a-circle#exam-question": graphed(
    wide(-6, 10, -12, 2, 2),
    [round([2, -5], 6), solid([2, -5], [8, -5], "action"), pt([2, -5], "(2, −5)", "s", "result"), tag([5, -5], "6", "n")],
    "The circle with center (2, −5) and radius 6. Its equation is (x − 2)² + (y + 5)² = 36, a plus sign for the negative coordinate.",
    "圆心为 (2, −5)、半径为 6 的圆。它的方程是 (x − 2)² + (y + 5)² = 36，负坐标对应加号。",
  ),
  "sat-exam-the-canonical-equation-of-a-circle#harder-exam-question": graphed(
    wide(-8, 10, -13, 5, 2),
    [round([1, -4], 7), solid([1, -4], [8, -4], "result"), pt([1, -4], "(1, −4)", "se"), tag([4.5, -4], "7", "n")],
    "The circle (x − 1)² + (y + 4)² = 49 has center (1, −4). Its colored radius is 7, the square root of the right side.",
    "圆 (x − 1)² + (y + 4)² = 49 的圆心是 (1, −4)。标色的半径是 7，即右边的平方根。",
  ),
  "sat-exam-canonical-equations-of-transformed-circles#exam-question": graphed(
    wide(-6, 6, -7, 5, 2),
    [
      round([1, -3], 3, undefined, true),
      round([-1, 1], 3, "result"),
      solid([1, -3], [-1, -3], "action"),
      solid([-1, -3], [-1, 1], "action"),
      pt([1, -3], "(1, −3)", "e"),
      pt([-1, 1], "(−1, 1)", "nw", "result"),
      tag([0, -3], "2", "n"),
      tag([-1, 0.5], "4", "e"),
    ],
    "The dashed circle has center (1, −3). Moving it left 2 and up 4 puts the colored circle's center at (−1, 1), and the radius stays 3.",
    "虚线圆的圆心是 (1, −3)。向左移 2、向上移 4，标色圆的圆心就在 (−1, 1)，半径仍为 3。",
  ),
  "sat-exam-solving-problems-involving-the-canonical-equation-of-a-circle#exam-question": graphed(
    wide(-5, 7, -4, 8, 2),
    [
      round([1, 2], 5),
      solid([1, 2], [4, 2], "action"),
      solid([4, 2], [4, 6], "action"),
      solid([1, 2], [4, 6], "result"),
      pt([1, 2], "(1, 2)", "s"),
      pt([4, 6], "(4, 6)", "ne"),
      tag([2.5, 2], "3", "n"),
      tag([4, 4], "4", "e"),
    ],
    "The colored radius from the center (1, 2) to the point (4, 6) is the hypotenuse of a right triangle with legs 3 and 4. So r² = 25.",
    "从圆心 (1, 2) 到点 (4, 6) 的标色半径是直角边为 3 和 4 的直角三角形的斜边。所以 r² = 25。",
  ),
  "sat-exam-solving-problems-involving-inscribed-squares#exam-question": drawing(
    [
      ring(3 * Math.SQRT2),
      ...box(-3, -3, 6, 6, { bottom: "6" }),
      seg([-3, -3], [3, 3], undefined, true),
      seg([0, 0], [3, 3], "result"),
      note([1.5, 1.5], "3√2", "nw"),
    ],
    "The dashed diagonal of the square of side 6 is a diameter of the circle. The colored half of it is the radius, 3√2.",
    "边长为 6 的正方形的虚线对角线是圆的直径。标色的一半就是半径 3√2。",
  ),
  "sat-exam-solving-problems-involving-inscribed-circles#exam-question": drawing(
    [...box(-7, -7, 14, 14, { bottom: "14" }), ring(7), seg([-7, 0], [7, 0], "result"), note([3.5, 0], "7", "n")],
    "The circle touches all four sides, so the side of the square equals the colored diameter: twice the radius 7 is 14.",
    "圆与四条边都相切，所以正方形的边长等于标色的直径：半径 7 的两倍是 14。",
  ),
  "sat-exam-solving-problems-involving-inscribed-circles#harder-exam-question": drawing(
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
    "The shaded region between the shapes is the square of side 10 minus the circle of radius 5, half the side.",
    "两个图形之间的阴影部分是边长为 10 的正方形减去半径为 5（边长的一半）的圆。",
  ),
  "sat-exam-solving-problems-involving-circles-inscribed-in-equilateral-triangles#exam-question": drawing(
    [
      ...tri([
        [-H4, -4],
        [H4, -4],
        [0, 8],
      ]),
      ring(4),
      seg([0, -4], [0, 8], undefined, true),
      seg([0, -4], [0, 0], "result"),
      { kind: "dot", at: [0, 0] },
      note([0, -2], "4", "w"),
      note([0, 5.2], "8", "e"),
    ],
    "The center divides the dashed altitude in the ratio 2 : 1. The colored radius, 4, is the shorter part, so the whole height is 12.",
    "圆心把虚线高分成 2 : 1。标色的半径 4 是较短的部分，所以整个高是 12。",
  ),
  "sat-exam-solving-problems-involving-equilateral-triangles-inscribed-in-circles#exam-question": drawing(
    [
      ring(8),
      ...tri([
        [-H4, -4],
        [H4, -4],
        [0, 8],
      ]),
      seg([0, -4], [0, 8], undefined, true),
      seg([0, 0], [0, 8], "result"),
      { kind: "dot", at: [0, 0] },
      note([0, 4], "8", "e"),
      note([0, -2], "4", "w"),
    ],
    "The colored radius, 8, reaches a vertex and is the longer part of the dashed altitude, two thirds of it. So the height is 12.",
    "标色的半径 8 到达顶点，是虚线高中较长的部分，占三分之二。所以高是 12。",
  ),
  "sat-exam-solving-problems-involving-equilateral-triangles-inscribed-in-circles#harder-exam-question": drawing(
    [
      ring(8),
      ...tri(
        [
          [-H4, -4],
          [H4, -4],
          [0, 8],
        ],
        { sides: ["8√3"], sideStyles: ["result"] },
      ),
      seg([0, -4], [0, 8], undefined, true),
      seg([0, 0], on(330, 8), undefined),
      { kind: "dot", at: [0, 0] },
      note(on(330, 4), "8", "ne"),
      note([0, 2], "12", "w"),
    ],
    "With radius 8, the dashed height is 12. The colored side is 8√3, longer than the radius and shorter than the diameter.",
    "半径为 8 时，虚线高是 12。标色的边是 8√3，比半径长、比直径短。",
  ),
  "sat-exam-volumes-of-right-rectangular-prisms#exam-question": (() => {
    const { marks, corners: c } = boxMarks(4, 5, 3);
    return drawing(
      [...marks, note([2, 0], "4", "s"), note([(c.B as Point)[0] + 1.125, 0.875], "5", "se"), note([0, 1.5], "3", "w")],
      "A box of 4 by 5 by 3. Its volume is the product of the three edges, 60 cubic units.",
      "4 乘 5 乘 3 的长方体。体积是三条棱的乘积，60 立方单位。",
    );
  })(),
  "sat-exam-volumes-of-cylinders#exam-question": drawing(
    can(3, 7, "3", "7"),
    "A cylinder of radius 3 and height 7. Only the radius is squared, so the volume is 63π.",
    "半径为 3、高为 7 的圆柱。只有半径要平方，所以体积是 63π。",
  ),
  "sat-exam-volumes-of-cylinders-word-problems#harder-exam-question": drawing(
    [
      ...can(3, 9, "3"),
      ...ellipse([0, 2], 3, 0.9, true),
      ...ellipse([0, 7], 3, 0.9, true, "result"),
      seg([3, 2], [3, 7], "result"),
      note([3, 1], "2", "e"),
      note([3, 4.5], "5", "e"),
    ],
    "A tank of radius 3 with water at depth 2. Adding 45π raises the level by 5, in color, so the final depth is 7.",
    "半径为 3 的水箱，水深为 2。加入 45π 后水位升高 5（标色），所以最终水深为 7。",
  ),
  "sat-exam-volumes-of-spheres#exam-question": drawing(
    ball(3, "3"),
    "A sphere of radius 3. Cubing the radius gives 27, so the volume is 36π.",
    "半径为 3 的球。半径立方得 27，所以体积是 36π。",
  ),
  "sat-exam-volumes-of-cones#exam-question": drawing(
    [...coneMarks(3, 5, "3", "5")],
    "A cone of radius 3 and height 5. Its volume is one third of the cylinder with the same base and height, 15π.",
    "半径为 3、高为 5 的圆锥。体积是同底同高圆柱的三分之一，为 15π。",
  ),
  "sat-exam-volumes-of-composite-solids#exam-question": drawing(
    [...can(3, 4, "3", "4"), ...shift(coneMarks(3, 5, undefined, "5"), 0, 4)],
    "A cylinder of height 4 topped by a cone of height 5, with the same radius 3. Each piece uses its own height: 36π + 15π = 51π.",
    "高为 4 的圆柱上面接高为 5 的圆锥，半径都是 3。每部分用自己的高：36π + 15π = 51π。",
  ),
  "sat-exam-constructing-functions-representing-surface-area-and-volume#exam-question": drawing(
    can(4, 3, "x", "2x − 5"),
    "A cylinder with radius x and height 2x − 5, drawn to scale for x = 4. The height stays one whole expression in the formula.",
    "半径为 x、高为 2x − 5 的圆柱，按 x = 4 的比例画出。在公式中，高保持为一个整体表达式。",
  ),
};
