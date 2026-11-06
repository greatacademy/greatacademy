// Drawings of the remaining explanations in the calculus shard: matrices as motions, parametric and polar curves, and complex numbers.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { go } from "./explanation-drawings-algebra-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { circleAxes, cross, spoke, sweep, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, on, ring, seg } from "./explanation-drawings-kit.ts";
import { arcTo, circleOn, dot, outline, outlineOn } from "./explanation-drawings-remaining-kit.ts";

const o: Point = [0, 0];
const sq: Point[] = [
  [0, 0],
  [2, 0],
  [2, 2],
  [0, 2],
];
const plain = (r: number, l = -1): Mark[] => [seg([l, 0], [r, 0]), seg([0, l], [0, r])];
const pathOf = (points: readonly Point[], tone?: "action" | "result") => ({ kind: "path", points, ...(tone && { tone }) }) as const;

/** remainingDrawings8 draws the explanations of the calculus shard about matrices as motions, parametric and polar curves, and complex numbers. */
export const remainingDrawings8: Readonly<Record<string, Figure>> = {
  "linear-transformations-of-points-and-lines-in-the-plane#the-origin-stays-fixed": drawing(
    [
      ...plain(6.5),
      ...outline(sq, undefined, true),
      ...outline(
        [
          [0, 0],
          [4, 0],
          [6, 2],
          [2, 2],
        ],
        "result",
      ),
      dot(o, "result"),
      ...shift(
        [
          ...plain(5),
          ...outline(sq, undefined, true),
          ...outline(
            sq.map((p): Point => [p[0] + 2, p[1] + 1]),
            "action",
          ),
          ...go(o, [2, 1], "action"),
        ],
        9,
      ),
    ],
    "Left: for example, the matrix with rows 2 1 and 0 1 reshapes the dashed square, and the colored origin stays where it is. Right: a translation moves the origin too, so it is not linear.",
    "左图：例如，行为 2 1 和 0 1 的矩阵改变虚线正方形的形状，标色的原点保持不动。右图：平移把原点也移动了，所以不是线性的。",
  ),
  "right-angle-rotations-as-linear-transformations#many-quarter-turns": graphed(
    wide(-4, 4, -4, 4, 99),
    [
      circleOn(o, Math.sqrt(5), undefined, true),
      toward([2, 1], [-1, 2], "action"),
      toward([-1, 2], [-2, -1], "action"),
      toward([-2, -1], [1, -2], "action"),
      pt([2, 1], "(2, 1)", "e"),
      pt([-1, 2], "(−1, 2)", "nw"),
      pt([-2, -1], "(−2, −1)", "w"),
      pt([1, -2], "(1, −2)", "se", "result"),
    ],
    "For example, 7 quarter turns of (2, 1). Four turns bring the point back, and 7 leaves a remainder of 3, so it takes just the 3 steps shown, to the colored (1, −2).",
    "例如，把 (2, 1) 旋转 7 次 90°。转 4 次回到原位，7 除以 4 余 3，所以只需图中 3 步，到达标色的 (1, −2)。",
  ),
  "rotations-as-linear-transformations#rotating-points-and-vectors-by-arbitrary-angles": drawing(
    [
      ...cross(3),
      ring(2.4),
      spoke(0, 2.4),
      spoke(60, 2.4, "result"),
      ...sweep(60),
      note(on(0, 2.4), "(2, 0)", "se"),
      note(on(60, 2.4), "(1, √3)", "ne"),
    ],
    "For example, rotating (2, 0) by 60°. The matrix gives 2 cos 60° = 1 and 2 sin 60° = √3, the colored point (1, √3), at the same distance from the origin.",
    "例如，把 (2, 0) 旋转 60°。矩阵给出 2 cos 60° = 1 和 2 sin 60° = √3，即标色的点 (1, √3)，到原点的距离不变。",
  ),
  "rotations-as-linear-transformations#powers-of-a-rotation": drawing(
    [...circleAxes(3, false), spoke(405, 3, "result"), ...sweep(405)],
    "For example, the 9th power of a rotation by 45° turns by 405°. Removing the whole turn leaves the colored 45°.",
    "例如，旋转 45° 的 9 次方旋转了 405°。去掉整周，剩下标色的 45°。",
  ),
  "inverting-linear-transformations#matrix-of-inverse-linear-transformation": drawing(
    [
      ...cross(3.6),
      ring(3),
      ...arcTo(20, 110, 2.3, "result"),
      ...arcTo(110, 20, 1.6, "action"),
      dot(on(20, 3)),
      dot(on(110, 3)),
      note(on(20, 3), "P", "e"),
      note(on(110, 3), "P′", "nw"),
    ],
    "For example, a rotation by 90° takes P to P′, in one color. Its inverse, a rotation by −90°, in the other color, takes P′ back to P.",
    "例如，旋转 90° 把 P 变到 P′（一种颜色）。它的逆，即旋转 −90°（另一种颜色），把 P′ 变回 P。",
  ),
  "area-scale-factors-of-linear-transformations#orientation-and-sign-of-determinant": graphed(
    wide(-6, 6, -1, 5, 99),
    [
      ...outlineOn([
        [1, 1],
        [4, 1],
        [2, 3],
      ]),
      ...outlineOn(
        [
          [-1, 1],
          [-4, 1],
          [-2, 3],
        ],
        "result",
      ),
      tag([1, 1], "A", "s"),
      tag([4, 1], "B", "s"),
      tag([2, 3], "C", "n"),
      tag([-1, 1], "A′", "s"),
      tag([-4, 1], "B′", "s"),
      tag([-2, 3], "C′", "n"),
    ],
    "For example, a reflection in the y-axis, with determinant −1. Going A, B, C on the right is counterclockwise, and going A′, B′, C′ on the colored image is clockwise.",
    "例如，关于 y 轴反射，行列式为 −1。右边按 A、B、C 是逆时针方向，标色的像按 A′、B′、C′ 是顺时针方向。",
  ),
  "singular-linear-transformations-in-the-plane#the-slope-of-the-image-line-of-a-singular-transformation": graphed(
    wide(-4, 4, -5, 5, 99),
    [
      ln(o, [1, 2], "result"),
      ln(o, [2, -1], "action", true),
      toward(o, [1, 2]),
      toward(o, [2, 4]),
      tag([1, 2], "(1, 2)", "e"),
      tag([2, 4], "(2, 4)", "e"),
    ],
    "For example, the matrix with rows 1 2 and 2 4. Its columns (1, 2) and (2, 4) are parallel and lie along the colored image line, with slope 2. The dashed line, with slope −1/2, is the line of vectors sent to the origin.",
    "例如，行为 1 2 和 2 4 的矩阵。它的列 (1, 2) 和 (2, 4) 平行，都在标色的像直线上，斜率为 2。斜率为 −1/2 的虚线是被送到原点的向量所在的直线。",
  ),
  "finding-intersections-of-parametric-curves-and-lines#the-line-that-touches-a-parametric-parabola-once": graphed(
    wide(-3, 4, -2, 6, 99),
    [
      curveOf((x) => x * x, undefined, -2.4, 2.4),
      ln([0, -1], [1, 1], "result"),
      ln(o, [1, 2], undefined, true),
      pt([1, 1], "(1, 1)", "se", "result"),
    ],
    "For example, x = t, y = t² and the line y = 2x + c. The equation t² − 2t − c = 0 has one root when c = −1, so the colored line touches once. With c = 0, dashed, there are two points.",
    "例如，x = t，y = t² 和直线 y = 2x + c。方程 t² − 2t − c = 0 在 c = −1 时只有一个根，所以标色的直线只相切一次。c = 0（虚线）时有两个交点。",
  ),
  "parametric-equations-of-parabolas#the-focus-of-a-parabola-given-parametrically": graphed(
    wide(-2, 7, -5, 5, 99),
    [
      pathOf(
        Array.from({ length: 41 }, (_, i): Point => {
          const t = -2.3 + (4.6 * i) / 40;
          return [t * t, 2 * t];
        }),
      ),
      pt([1, 0], "(1, 0)", "ne", "result"),
    ],
    "For example, x = t², y = 2t. Squaring gives y² = 4t² = 4x, and 4 is four times the focal distance 1, so the colored focus is (1, 0).",
    "例如，x = t²，y = 2t。平方得 y² = 4t² = 4x，4 是焦距 1 的四倍，所以标色的焦点是 (1, 0)。",
  ),
  "parametric-equations-of-parabolas-centered-at-hk#the-vertex-from-the-parameter": graphed(
    wide(-6, 8, -1, 10, 99),
    [
      pathOf(
        Array.from({ length: 41 }, (_, i): Point => {
          const t = -2.5 + (5 * i) / 40;
          return [2 * t + 1, t * t + 3];
        }),
      ),
      pt([1, 3], "(1, 3)", "se", "result"),
      pt([3, 4], "(3, 4)", "e"),
      pt([-1, 4], "(−1, 4)", "w"),
    ],
    "For example, x = 2t + 1, y = t² + 3. The value of y turns around at t = 0, so the colored vertex is (1, 3). The values t = 1 and t = −1 give the points (3, 4) and (−1, 4).",
    "例如，x = 2t + 1，y = t² + 3。y 的值在 t = 0 处转向，所以标色的顶点是 (1, 3)。t = 1 和 t = −1 给出点 (3, 4) 和 (−1, 4)。",
  ),
  "polar-equations-of-circles-centered-on-the-coordinate-axes#a-polar-circle-through-a-given-point": graphed(
    wide(-4, 5, -1, 5, 99),
    [circleOn([0, 2], 2), pt(o, "", "s"), pt([0, 4], "(0, 4)", "ne"), pt([2, 2], "(2, 2)", "e", "result")],
    "For example, r = 4 sin θ is the circle through the pole with diameter 4. Multiplying by r gives x² + y² = 4y. The colored point (2, 2) passes, as 4 + 4 = 8.",
    "例如，r = 4 sin θ 是过极点、直径为 4 的圆。乘以 r 得 x² + y² = 4y。标色的点 (2, 2) 满足它，因为 4 + 4 = 8。",
  ),
  "the-cis-notation#cis-definition-and-evaluation": drawing(
    [
      seg([-3.6, 0], [3.6, 0]),
      seg([0, -3.6], [0, 3.6]),
      ring(3),
      dot([3, 0], "result"),
      dot([0, 3], "result"),
      dot([-3, 0], "result"),
      dot([0, -3], "result"),
      note([3, 0], "1", "se"),
      note([0, 3], "i", "ne"),
      note([-3, 0], "−1", "sw"),
      note([0, -3], "−i", "se"),
    ],
    "The angles 0, π/2, π and 3π/2 on the unit circle of the complex plane. Their cis values are the colored points 1, i, −1 and −i.",
    "复平面单位圆上的角 0、π/2、π 和 3π/2。它们的 cis 值是标色的点 1、i、−1 和 −i。",
  ),
  "the-cis-notation#products-and-quotients-in-cis-notation": drawing(
    [
      ...cross(3.6),
      spoke(20, 2),
      spoke(40, 1.5),
      spoke(60, 3, "result"),
      note(on(20, 2), "2 cis 20°", "e"),
      note([1.3, 1.35], "1.5 cis 40°", "e"),
      note(on(60, 3), "3 cis 60°", "e"),
    ],
    "For example, the product of 2 cis 20° and 1.5 cis 40°. The moduli multiply to 3 and the angles add to 60°, which gives the colored 3 cis 60°.",
    "例如，2 cis 20° 与 1.5 cis 40° 的积。模相乘得 3，角相加得 60°，结果是标色的 3 cis 60°。",
  ),
  "finding-powers-of-complex-numbers-using-de-moivres-theorem#polar-powers-in-rectangular-form": drawing(
    [
      seg([-1, 0], [10, 0]),
      seg([0, -1], [0, 15]),
      spoke(15, 2),
      spoke(60, 16, "result"),
      seg([8, 0], on(60, 16), undefined, true),
      seg([0, 8 * Math.sqrt(3)], on(60, 16), undefined, true),
      note([8, 0], "8", "s"),
      note([0, 8 * Math.sqrt(3)], "8√3", "w"),
      note(on(15, 2), "2", "e"),
      note(on(60, 8), "16", "nw"),
    ],
    "The example. Modulus 2 at angle π/12 becomes 2⁴ = 16 at angle 4 · π/12 = π/3, the colored spoke, and its dashed legs read 8 + 8√3 i.",
    "例题。模为 2、角为 π/12 变成 2⁴ = 16、角为 4 · π/12 = π/3，即标色的线段，它的虚线直角边读出 8 + 8√3 i。",
  ),
};
