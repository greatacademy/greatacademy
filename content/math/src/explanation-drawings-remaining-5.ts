// Drawings of the remaining explanations in the calculus shard: rational graphs, right triangles behind trigonometric ratios, and the unit circle.

import type { Figure } from "@ga/content";
import type { Mark } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { circleAxes, spoke, wide } from "./explanation-drawings-curves.ts";
import { rt, tri } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, drawing, graphed, note, on, seg } from "./explanation-drawings-kit.ts";
import { dot } from "./explanation-drawings-remaining-kit.ts";

const rad = (d: number): number => (d * Math.PI) / 180;

/** line draws a straight number line with ticks at the given places, and numbers under them. */
const line = (lo: number, hi: number, unit: number, ticks: readonly number[]): Mark[] => [
  seg([lo / unit, 0], [hi / unit, 0]),
  ...ticks.flatMap((v): Mark[] => [seg([v / unit, -0.15], [v / unit, 0.15]), note([v / unit, -0.1], String(v).replace("-", "−"), "s")]),
];

/** remainingDrawings5 draws the explanations of the calculus shard about rational graphs, right triangles behind trigonometric ratios, and the unit circle. */
export const remainingDrawings5: Readonly<Record<string, Figure>> = {
  "vertical-asymptotes-of-rational-functions#counting-vertical-asymptotes": graphed(
    wide(-4, 6, -3, 3, 99),
    [
      ln([1, 0], [1, 1], "result", true),
      curveOf((x) => 1 / ((x - 1) * (x * x + 4)), undefined, -4, 0.94),
      curveOf((x) => 1 / ((x - 1) * (x * x + 4)), undefined, 1.07, 6),
      tag([1, 2.4], "x = 1", "e"),
    ],
    "The graph of the example: 1/((x − 1)(x² + 4)). The factor x² + 4 is never 0, so the only vertical asymptote is the colored line x = 1.",
    "例题的图象：1/((x − 1)(x² + 4))。因式 x² + 4 永不为 0，所以唯一的铅直渐近线是标色的直线 x = 1。",
  ),
  "identifying-a-rational-function-from-a-graph-containing-holes#the-constant-that-makes-a-hole-instead-of-an-asymptote": drawing(
    pane(0, [0, 5, 1], [0, 7, 1], 5, 5, "x", "y")
      .f((x) => x + 2, 0, 5)
      .open(2, 4, "(2, 4)", "nw")
      .marks(),
    "For example, y = (x² − 4)/(x − 2). The numerator is 0 at x = 2, so the factor cancels and the graph is the line y = x + 2 with only a hole at (2, 4), not an asymptote.",
    "例如，y = (x² − 4)/(x − 2)。分子在 x = 2 处为 0，所以因式可以约去，图象是直线 y = x + 2，只在 (2, 4) 处有一个洞，而没有渐近线。",
  ),
  "identifying-the-graph-of-a-rational-function#matching-linear-over-linear-graphs": graphed(
    wide(-4, 8, -4, 7, 99),
    [
      ln([1, 0], [1, 1], undefined, true),
      ln([0, 2], [1, 2], undefined, true),
      curveOf((x) => (2 * (x - 3)) / (x - 1), undefined, -4, 0.2),
      curveOf((x) => (2 * (x - 3)) / (x - 1), undefined, 1.67, 8),
      tag([1, 6], "x = 1", "e"),
      tag([-3, 2], "y = 2", "s"),
      pt([3, 0], "(3, 0)", "se", "result"),
    ],
    "For example, f(x) = 2(x − 3)/(x − 1). The vertical asymptote is x = 1, the horizontal asymptote is y = 2, and the colored x-intercept is (3, 0).",
    "例如，f(x) = 2(x − 3)/(x − 1)。铅直渐近线是 x = 1，水平渐近线是 y = 2，标色的 x 轴截点是 (3, 0)。",
  ),
  "evaluating-expressions-containing-inverse-trigonometric-functions#a-ratio-of-an-inverse-ratio": drawing(
    rt(5, 12, { sides: ["5", "12", "13"], angles: ["θ"], sideStyles: [undefined, "result"] }),
    "For example, θ = arccos(5/13). The triangle has the side 5 next to θ and the hypotenuse 13. The Pythagorean theorem gives the colored side 12, so sin θ = 12/13.",
    "例如，θ = arccos(5/13)。三角形中 θ 的邻边是 5，斜边是 13。由勾股定理得标色的边 12，所以 sin θ = 12/13。",
  ),
  "simplifying-expressions-using-the-pythagorean-identity#the-sign-from-the-quadrant": drawing(
    [
      ...circleAxes(3, false),
      spoke(53.13, 3, "result"),
      spoke(126.87, 3, "action"),
      seg(on(53.13, 3), on(126.87, 3), undefined, true),
      note(on(53.13, 3), "(3/5, 4/5)", "ne"),
      note(on(126.87, 3), "(−3/5, 4/5)", "nw"),
    ],
    "For example, sin θ = 4/5. The two points at that height have cos θ = 3/5 on the right, in one color, and cos θ = −3/5 on the left, in the other.",
    "例如，sin θ = 4/5。这一高度上的两点，右边的 cos θ = 3/5（一种颜色），左边的 cos θ = −3/5（另一种颜色）。",
  ),
  "simplifying-trigonometric-expressions-using-cofunction-identities#cofunction-identities-basic": drawing(
    rt(5, 3.75, { sides: ["cos θ", "sin θ", "1"], angles: ["θ", undefined, "π/2 − θ"], sideStyles: ["result"] }),
    "A right triangle with hypotenuse 1. Its two acute angles add up to π/2. The colored side is next to θ and across from π/2 − θ, so sin(π/2 − θ) = cos θ.",
    "斜边为 1 的直角三角形，两个锐角之和为 π/2。标色的边是 θ 的邻边、π/2 − θ 的对边，所以 sin(π/2 − θ) = cos θ。",
  ),
  "simplifying-trigonometric-expressions-using-cofunction-identities#cofunction-identities-in-degree-expressions": drawing(
    [
      ...rt(2.5, 2.5 * Math.tan(rad(70)), { sides: [undefined, "b", "c"], angles: ["70°"], sideStyles: [undefined, "result"] }),
      angle([2.5, 2.5 * Math.tan(rad(70))], [0, 0], [2.5, 0]),
      note([2.5, 2.5 * Math.tan(rad(70))], "20°", "n"),
    ],
    "The angles 70° and 20° add up to 90°, so they fit in one right triangle. The colored side b is across from 70° and next to 20°, so sin 70° and cos 20° are both b/c.",
    "70° 和 20° 之和为 90°，所以它们在同一个直角三角形中。标色的边 b 是 70° 的对边、20° 的邻边，所以 sin 70° 和 cos 20° 都等于 b/c。",
  ),
  "simplifying-trigonometric-expressions-using-cofunction-identities#an-equation-from-cofunctions": drawing(
    rt(5, 5 * Math.tan(rad(40)), { angles: ["2x", undefined, "x + 30°"], angleStyles: ["result", undefined, "result"] }),
    "For example, sin 2x = cos(x + 30°). The colored angles are the two acute angles of a right triangle, so 2x + x + 30° = 90°, and x = 20°. They are 40° and 50°.",
    "例如，sin 2x = cos(x + 30°)。标色的角是直角三角形的两个锐角，所以 2x + x + 30° = 90°，x = 20°。它们是 40° 和 50°。",
  ),
  "the-sum-and-difference-formulas-for-sine#sine-of-a-sum-from-two-triangles": drawing(
    [
      ...rt(8, 6, { sides: ["4", "3", "5"], angles: ["α"], sideStyles: ["result"] }),
      ...shift(rt(12, 5, { sides: ["12", "5", "13"], angles: ["β"], sideStyles: ["result"] }), 11),
    ],
    "For example, sin α = 3/5 and sin β = 5/13, with both angles acute. The colored legs 4 and 12 give the cosines, 4/5 and 12/13.",
    "例如，sin α = 3/5，sin β = 5/13，两角都是锐角。标色的直角边 4 和 12 给出余弦 4/5 和 12/13。",
  ),
  "the-sum-and-difference-formulas-for-cosine#cosine-of-a-sum-from-two-triangles": drawing(
    [
      ...rt(8, 6, { sides: ["4", "3", "5"], angles: ["α"], sideStyles: [undefined, "result"] }),
      ...shift(rt(12, 5, { sides: ["12", "5", "13"], angles: ["β"], sideStyles: [undefined, "result"] }), 11),
    ],
    "For example, cos α = 4/5 and cos β = 12/13, with both angles acute. The colored legs 3 and 5 give the sines, 3/5 and 5/13.",
    "例如，cos α = 4/5，cos β = 12/13，两角都是锐角。标色的直角边 3 和 5 给出正弦 3/5 和 5/13。",
  ),
  "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine#cosine-after-a-quarter-or-half-turn": drawing(
    [
      ...circleAxes(3, false),
      spoke(30, 3),
      spoke(120, 3, "result"),
      spoke(210, 3, "action"),
      angle([0, 0], on(0, 1), on(30, 1), undefined, "θ"),
      note(on(30, 3), "(cos θ, sin θ)", "ne"),
      note(on(120, 3), "(−sin θ, cos θ)", "nw"),
      note(on(210, 3), "(−cos θ, −sin θ)", "sw"),
    ],
    "A point at angle θ on the unit circle. A quarter turn, in one color, has first coordinate −sin θ, and a half turn, in the other, has first coordinate −cos θ. These first coordinates are the cosines.",
    "单位圆上角 θ 处的点。旋转 90°（一种颜色）后第一个坐标是 −sin θ，旋转 180°（另一种颜色）后第一个坐标是 −cos θ。这些第一个坐标就是余弦。",
  ),
  "writing-sums-of-trigonometric-functions-in-amplitude-phase-form#amplitude-from-the-graph-of-a-sum": drawing(
    pane(0, [0, 7, 99], [-6, 8, 99], 6, 5, "x", "y")
      .f((x) => 3 * Math.sin(x), 0, 7, undefined, true)
      .f((x) => 4 * Math.cos(x), 0, 7, undefined, true)
      .f((x) => 3 * Math.sin(x) + 4 * Math.cos(x), 0, 7, "result")
      .level(7, "action")
      .dot(Math.atan2(3, 4), 5, "5", "ne", "result")
      .say(0, 7, "7", "w")
      .marks(),
    "For example, 3 sin x + 4 cos x, in color, with the two dashed waves it adds. They peak at different moments, so the highest point reached is 5, the square root of 3² + 4², and not the sum 7 in the other color.",
    "例如，3 sin x + 4 cos x（标色）和它相加的两条虚线波。它们在不同时刻达到波峰，所以最高点是 3² + 4² 的平方根 5，而不是另一种颜色的和 7。",
  ),
  "the-double-angle-formula-for-sine#double-angle-formula-for-sine-statement": drawing(
    pane(0, [0, 7, 99], [-2, 2, 1], 6, 4, "θ", "y")
      .f((x) => 2 * Math.sin(x), 0, 6.6, undefined, true)
      .f((x) => Math.sin(2 * x), 0, 6.6, "result")
      .marks(),
    "sin 2θ, in color, stays between −1 and 1 and repeats twice as fast. 2 sin θ, dashed, swings between −2 and 2. They are different functions.",
    "sin 2θ（标色）介于 −1 和 1 之间，重复速度是两倍。2 sin θ（虚线）在 −2 和 2 之间摆动。它们是不同的函数。",
  ),
  "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem#sin-double-angle-from-cos-only": drawing(
    [
      seg([-5.5, 0], [2, 0]),
      seg([0, -0.8], [0, 4]),
      note([2, 0], "x", "e"),
      note([0, 4], "y", "n"),
      ...tri(
        [
          [0, 0],
          [-4, 0],
          [-4, 3],
        ],
        { sides: ["−4", "3", "5"], right: 1, sideStyles: [undefined, "result"] },
      ),
      angle([0, 0], [1, 0], [-4, 3], "action", "θ"),
    ],
    "The angle θ in quadrant II with cos θ = −4/5. The triangle has legs 4 and 3 and hypotenuse 5. The colored leg goes up, so sin θ is positive, 3/5.",
    "第二象限的角 θ，cos θ = −4/5。三角形的直角边为 4 和 3，斜边为 5。标色的直角边向上，所以 sin θ 为正，等于 3/5。",
  ),
  "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem#double-angle-sine-from-tangent": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], angles: ["x"], sideStyles: [undefined, undefined, "result"] }),
    "For example, tan x = 3/4 gives legs 3 and 4, and the Pythagorean theorem gives the colored side 5. Then sin x = 3/5 and cos x = 4/5, so sin 2x = 24/25.",
    "例如，tan x = 3/4 给出直角边 3 和 4，由勾股定理得标色的边 5。于是 sin x = 3/5，cos x = 4/5，所以 sin 2x = 24/25。",
  ),
  "elementary-trigonometric-equations-containing-cosecant#solve-elementary-cosecant-equations-degrees": drawing(
    [
      ...circleAxes(3, false),
      seg([-3.6, 1.5], [3.6, 1.5], undefined, true),
      spoke(30, 3, "result"),
      spoke(150, 3, "result"),
      note(on(30, 3), "30°", "ne"),
      note(on(150, 3), "150°", "nw"),
      note([0, 1.5], "1/2", "ne"),
    ],
    "csc x = 2 means sin x = 1/2. The dashed height 1/2 meets the unit circle at the two colored angles, 30° and 150°.",
    "csc x = 2 即 sin x = 1/2。虚线高度 1/2 与单位圆相交于两个标色的角 30° 和 150°。",
  ),
  "general-solutions-of-elementary-trigonometric-equations#particular-solutions-from-general-trig": drawing(
    [
      ...line(-300, 930, 60, [-210, 150, 360, 510, 720, 870]),
      seg([6, 0], [12, 0], "action"),
      dot([-3.5, 0]),
      dot([2.5, 0]),
      dot([8.5, 0], "result"),
      dot([14.5, 0]),
      note([-3.5, 0.1], "k = −1", "n"),
      note([2.5, 0.1], "k = 0", "n"),
      note([8.5, 0.1], "k = 1", "n"),
      note([14.5, 0.1], "k = 2", "n"),
    ],
    "For example, x = 150 + 360k. Each integer k picks out one member of the family. To land between 360 and 720, in color, choose k = 1, which gives 510.",
    "例如，x = 150 + 360k。每个整数 k 选出族中的一个成员。要落在 360 和 720 之间（标色），取 k = 1，得 510。",
  ),
  "general-solutions-of-elementary-trigonometric-equations#the-first-solution-past-a-bound": drawing(
    [
      ...line(0, 930, 60, [30, 150, 390, 510, 750, 870]),
      seg([7.5, -0.5], [7.5, 0.9], undefined, true),
      note([7.5, 0.9], "450", "n"),
      dot([0.5, 0]),
      dot([6.5, 0]),
      dot([12.5, 0]),
      dot([2.5, 0], "action"),
      dot([8.5, 0], "result"),
      dot([14.5, 0], "action"),
    ],
    "For example, sin x = 1/2 has the families 30 + 360k, black, and 150 + 360k, colored. Past the bound 450 the smallest members are 750 and 510, so the first solution is 510.",
    "例如，sin x = 1/2 有两族解：30 + 360k（黑色）和 150 + 360k（彩色）。超过 450 的最小成员分别是 750 和 510，所以第一个解是 510。",
  ),
};
