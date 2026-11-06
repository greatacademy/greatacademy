// Drawings in the explanations of Precalculus: vectors, matrices as transformations and trigonometric equations,
// with every coordinate computed from the numbers given in the alt text.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { chart, tag, toward } from "./explanation-drawings-charts.ts";
import { piChart, plot, thick, wall, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, dotAt, drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";

const { PI: pi, cos, sin, sqrt, tan, hypot } = Math;
const rad = (d: number): number => (d * pi) / 180;
const polar = (r: number, d: number): Point => [r * cos(rad(d)), r * sin(rad(d))];
const O: Point = [0, 0];

/** the arc of a turn of deg degrees about c, starting at the angle start */
const arc = (deg: number, r = 1, start = 0, tone: "action" | "result" = "action", c: Point = O): PlaneMark => ({
  kind: "turn",
  center: c,
  from: [c[0] + r * cos(rad(start)), c[1] + r * sin(rad(start))],
  degrees: deg,
  tone,
});
/** the small square of a right angle at p, along the unit directions u and v */
const corner = (p: Point, u: Point, v: Point, s = 0.3): PlaneMark => ({
  kind: "path",
  points: [
    [p[0] + s * u[0], p[1] + s * u[1]],
    [p[0] + s * (u[0] + v[0]), p[1] + s * (u[1] + v[1])],
    [p[0] + s * v[0], p[1] + s * v[1]],
  ],
});
/** a segment with an arrowhead, for drawings without axes */
const head = (a: Point, b: Point, s?: "action" | "result"): Mark[] => {
  const l = hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  const barb = (side: number): Point => [b[0] - 0.28 * ux + side * 0.14 * uy, b[1] - 0.28 * uy - side * 0.14 * ux];
  return [seg(a, b, s), seg(b, barb(1), s), seg(b, barb(-1), s)];
};
const segD = (a: Point, b: Point, tone?: "action" | "result"): PlaneMark => ({
  kind: "path",
  points: [a, b],
  dashed: true,
  ...(tone && { tone }),
});

/** precalculusDrawings2 are drawings of vectors, transformations and equations in Precalculus, by topic and knowledge point. */
export const precalculusDrawings2: Readonly<Record<string, Figure>> = {
  "introduction-to-vectors#equal-vectors-in-a-parallelogram": graphed(
    wide(-1, 7, -1, 4),
    [
      toward([0, 0], [4, 0], "result"),
      toward([1.5, 3], [5.5, 3], "result"),
      toward([0, 0], [1.5, 3], "action"),
      toward([4, 0], [5.5, 3], "action"),
      tag([0, 0], "A", "sw"),
      tag([4, 0], "B", "se"),
      tag([5.5, 3], "C", "ne"),
      tag([1.5, 3], "D", "nw"),
    ],
    "In parallelogram ABCD, the vectors AB and DC have the same length and direction, so they are equal, and so are AD and BC.",
    "在平行四边形 ABCD 中，向量 AB 和 DC 长度和方向都相同，所以相等，AD 和 BC 也相等。",
  ),
  "the-magnitude-of-a-vector#perpendicular-vectors-and-their-sum": graphed(
    wide(-1, 6, -1, 4),
    [
      toward(O, [4, 0], "action"),
      toward([4, 0], [4, 3], "action"),
      toward(O, [4, 3], "result"),
      corner([4, 0], [-1, 0], [0, 1]),
      tag([2, 0], "4", "n"),
      tag([4, 1.5], "3", "e"),
      tag([2, 1.5], "5", "nw"),
    ],
    "For example, perpendicular vectors of lengths 4 and 3 make a right triangle, and their sum has magnitude √(4² + 3²) = 5, not 7.",
    "例如，长度为 4 和 3 的两个垂直向量构成直角三角形，它们的和的模是 √(4² + 3²) = 5，而不是 7。",
  ),
  "parallel-vectors#parallel-direction-and-sign": graphed(
    wide(-1, 5, -3, 4),
    [
      toward(O, [2, 1]),
      toward([0, 1.5], [4, 3.5], "result"),
      toward([4, -1], [1, -2.5], "action"),
      tag([2, 1], "v", "e"),
      tag([4, 3.5], "2v", "s"),
      tag([1, -2.5], "−1.5v", "n"),
    ],
    "For example, 2v points the same way as v and is twice as long, while −1.5v points the opposite way and is 1.5 times as long.",
    "例如，2v 与 v 同向且长度是它的 2 倍，而 −1.5v 与 v 反向且长度是它的 1.5 倍。",
  ),
  "calculating-the-direction-of-cartesian-vectors-in-2d#direction-angle-all-quadrants": graphed(
    wide(-5, 3, -1, 5),
    [
      toward(O, [-3, 4], "result"),
      arc(180 - (Math.atan(4 / 3) * 180) / pi, 1),
      arc(-(Math.atan(4 / 3) * 180) / pi, 1.8, 180),
      segD([-3, 4], [-3, 0]),
      tag([-3, 4], "⟨−3, 4⟩", "nw"),
      tag([0.5, 1], "θ ≈ 126.9°", "ne"),
      tag([-1.9, 0.6], "α", "w"),
    ],
    "For example, ⟨−3, 4⟩ is in Quadrant II, with reference angle α = arctan(4/3) ≈ 53.1°, so θ = 180° − α ≈ 126.9°.",
    "例如，⟨−3, 4⟩ 在第二象限，参考角 α = arctan(4/3) ≈ 53.1°，所以 θ = 180° − α ≈ 126.9°。",
  ),
  "calculating-the-direction-of-cartesian-vectors-in-2d#bearings-from-the-direction-angle": graphed(
    wide(-2, 5, -1, 5),
    [
      toward(O, polar(4, 30), "result"),
      arc(30, 2.4),
      arc(-60, 1.5, 90, "result"),
      tag([0, 4.6], "N", "e"),
      tag([4.6, 0], "E", "n"),
      tag(polar(2.5, 15), "30°", "e"),
      tag(polar(1.6, 62), "60°", "n"),
    ],
    "For example, a direction angle of 30° from east is a bearing of 90° − 30° = 60° clockwise from north.",
    "例如，从东起算的方向角 30° 对应从北顺时针量的方位角 90° − 30° = 60°。",
  ),
  "calculating-the-components-of-cartesian-vectors-in-2d#components-from-magnitude-and-angle-special": graphed(
    wide(-1, 7, -1, 4),
    [
      toward(O, polar(6, 30), "result"),
      thick(O, [polar(6, 30)[0], 0], "action"),
      thick([polar(6, 30)[0], 0], polar(6, 30), "action"),
      corner([polar(6, 30)[0], 0], [-1, 0], [0, 1]),
      arc(30, 1.5),
      tag([3, 0], "3√3", "n"),
      tag([polar(6, 30)[0], 1.5], "3", "e"),
      tag([2.6, 1.5], "6", "nw"),
      tag(polar(1.7, 14), "30°", "e"),
    ],
    "For example, magnitude 6 at 30° has components 6 cos 30° = 3√3 and 6 sin 30° = 3.",
    "例如，模为 6、方向角 30° 的向量，分量是 6 cos 30° = 3√3 和 6 sin 30° = 3。",
  ),
  "calculating-the-components-of-cartesian-vectors-in-2d#components-across-the-quadrants": graphed(
    wide(-4, 2, -1, 5),
    [
      toward(O, polar(4, 120), "result"),
      thick(O, [-2, 0], "action"),
      thick([-2, 0], polar(4, 120), "action"),
      arc(120, 0.9),
      tag([-1, 0], "x = −2", "n"),
      tag([-2, 1.7], "y = 2√3", "w"),
      tag([0.5, 0.8], "120°", "ne"),
    ],
    "For example, magnitude 4 at 120° gives x = 4 cos 120° = −2, negative, and y = 4 sin 120° = 2√3, positive.",
    "例如，模为 4、方向角 120° 时，x = 4 cos 120° = −2 为负，y = 4 sin 120° = 2√3 为正。",
  ),
  "calculating-displacement-for-plane-motion#total-displacement-and-distance": graphed(
    wide(-1, 7, -1, 5),
    [
      toward(O, [5, 1], "action"),
      toward([5, 1], [3, 4], "action"),
      toward(O, [3, 4], "result"),
      tag([4, 0.8], "⟨5, 1⟩", "n"),
      tag([4, 2.5], "⟨−2, 3⟩", "e"),
      tag([1.5, 2], "5", "e"),
    ],
    "For example, ⟨5, 1⟩ followed by ⟨−2, 3⟩ makes the net displacement ⟨3, 4⟩, at a straight-line distance of 5.",
    "例如，先 ⟨5, 1⟩ 再 ⟨−2, 3⟩，净位移是 ⟨3, 4⟩，直线距离为 5。",
  ),
  "calculating-the-dot-product-using-angle-and-magnitude#geometric-definition-of-the-dot-product": graphed(
    wide(-1, 5, -1, 4),
    [
      toward(O, [4, 0], "result"),
      toward(O, polar(3, 60), "action"),
      arc(60, 0.9),
      tag([4, 0], "‖u‖ = 4", "n"),
      tag(polar(3, 60), "‖v‖ = 3", "ne"),
      tag(polar(1, 30), "60°", "e"),
    ],
    "For example, with lengths 4 and 3 and an angle of 60° between them, u · v = 4 · 3 · cos 60° = 6.",
    "例如，长度为 4 和 3、夹角为 60° 时，u · v = 4 · 3 · cos 60° = 6。",
  ),
  "calculating-the-dot-product-using-angle-and-magnitude#sign-of-the-dot-product-and-orthogonality": drawing(
    [50, 90, 130].flatMap((d, i) =>
      shift(
        [
          ...head(O, [3, 0], "result"),
          ...head(O, polar(2.5, d), "action"),
          angle(O, [3, 0], polar(2.5, d), "action", `${d}°`),
          note([0.8, -0.5], ["u · v > 0", "u · v = 0", "u · v < 0"][i] as string, "s"),
        ],
        i * 6,
      ),
    ),
    "With the same lengths, an acute angle of 50° gives a positive dot product, 90° gives zero, and an obtuse angle of 130° gives a negative one.",
    "长度不变时，50° 的锐角使点积为正，90° 使点积为零，130° 的钝角使点积为负。",
  ),
  "calculating-a-scalar-projection#interpreting-the-sign-of-scalar-projection": drawing(
    [
      ...head(O, [3.5, 0]),
      ...head(O, polar(3, 50), "action"),
      seg(polar(3, 50), [polar(3, 50)[0], 0], undefined, true),
      seg(O, [polar(3, 50)[0], 0], "result"),
      note([1, -0.4], "comp > 0", "s"),
      note([3.5, 0], "v", "e"),
      note(polar(3, 50), "u", "n"),
      ...shift(
        [
          ...head(O, [3.5, 0]),
          ...head(O, polar(3, 130), "action"),
          seg(polar(3, 130), [polar(3, 130)[0], 0], undefined, true),
          seg(O, [polar(3, 130)[0], 0], "result"),
          note([-1, -0.4], "comp < 0", "s"),
          note([3.5, 0], "v", "e"),
          note(polar(3, 130), "u", "n"),
        ],
        7.5,
      ),
    ],
    "When the angle between u and v is acute, the projection of u falls along v and is positive. When it is obtuse, the projection points opposite to v and is negative.",
    "u 与 v 的夹角为锐角时，u 的投影落在 v 的方向上，为正；夹角为钝角时，投影与 v 反向，为负。",
  ),
  "calculating-a-vector-projection#orthogonal-component-and-vector-decomposition": graphed(
    wide(-2, 7, -1, 4),
    [
      toward(O, [4, 2]),
      toward(O, [1, 3], "action"),
      toward(O, [2, 1], "result"),
      toward([2, 1], [1, 3], "result"),
      corner([2, 1], [-2 / sqrt(5), -1 / sqrt(5)], [-1 / sqrt(5), 2 / sqrt(5)]),
      tag([4, 2], "v = ⟨4, 2⟩", "e"),
      tag([1, 3], "u = ⟨1, 3⟩", "n"),
      tag([2, 1], "u∥", "se"),
      tag([1.5, 2], "u⊥", "e"),
    ],
    "For example, u = ⟨1, 3⟩ and v = ⟨4, 2⟩ give u∥ = (10/20)v = ⟨2, 1⟩ and u⊥ = u − u∥ = ⟨−1, 2⟩, which is orthogonal to v.",
    "例如，u = ⟨1, 3⟩、v = ⟨4, 2⟩，得 u∥ = (10/20)v = ⟨2, 1⟩，u⊥ = u − u∥ = ⟨−1, 2⟩，与 v 正交。",
  ),
  "calculating-a-vector-projection#the-distance-from-a-point-to-a-line-through-the-origin": graphed(
    wide(-2, 5, -1, 4),
    [
      ln(O, [2, 1]),
      toward(O, [1, 3], "action"),
      thick(O, [2, 1], "result"),
      toward([2, 1], [1, 3], "result"),
      corner([2, 1], [-2 / sqrt(5), -1 / sqrt(5)], [-1 / sqrt(5), 2 / sqrt(5)]),
      pt([1, 3], "P(1, 3)", "n", "action"),
      tag([1, 0.5], "√5", "se"),
      tag([1.5, 2], "√5", "e"),
      tag([0.7, 2.1], "√10", "w"),
    ],
    "For example, P(1, 3) and the line through the origin along ⟨2, 1⟩: the scalar projection is √5 and ‖P‖ = √10, so the distance is √(10 − 5) = √5.",
    "例如，P(1, 3) 和过原点沿 ⟨2, 1⟩ 的直线：标量投影是 √5，‖P‖ = √10，所以距离是 √(10 − 5) = √5。",
  ),
  "the-geometric-interpretation-of-the-2x2-determinant#area-of-parallelogram-spanned-by-vectors": graphed(
    wide(-1, 6, -1, 4),
    [
      shape([O, [3, 1], [4, 3], [1, 2]], "result"),
      toward(O, [3, 1], "action"),
      toward(O, [1, 2], "action"),
      tag([3, 1], "u = ⟨3, 1⟩", "e"),
      tag([1, 2], "v = ⟨1, 2⟩", "nw"),
    ],
    "For example, u = ⟨3, 1⟩ and v = ⟨1, 2⟩ span a parallelogram of area |3 · 2 − 1 · 1| = 5.",
    "例如，u = ⟨3, 1⟩ 和 v = ⟨1, 2⟩ 张成的平行四边形面积是 |3 · 2 − 1 · 1| = 5。",
  ),
  "the-geometric-interpretation-of-the-2x2-determinant#sign-of-determinant-and-orientation": drawing(
    [
      ...head(O, [3, 1], "result"),
      ...head(O, [1, 2], "action"),
      angle(O, [3, 1], [1, 2], "action"),
      note([3, 1], "u", "e"),
      note([1, 2], "v", "n"),
      note([1.5, -0.4], "det = 5 ↺", "s"),
      ...shift(
        [
          ...head(O, [1, 2], "result"),
          ...head(O, [3, 1], "action"),
          angle(O, [3, 1], [1, 2], "action"),
          note([1, 2], "u", "n"),
          note([3, 1], "v", "e"),
          note([1.5, -0.4], "det = −5 ↻", "s"),
        ],
        6.5,
      ),
    ],
    "For example, u = ⟨3, 1⟩ and v = ⟨1, 2⟩ have determinant 5 and the turn from u to v is counterclockwise. Swapping them gives −5 and a clockwise turn.",
    "例如，u = ⟨3, 1⟩、v = ⟨1, 2⟩ 的行列式为 5，从 u 到 v 是逆时针；交换后为 −5，是顺时针。",
  ),
  "the-geometric-interpretation-of-the-2x2-determinant#the-area-of-a-triangle-from-its-vertices": graphed(
    wide(-1, 7, -1, 6),
    [
      shape(
        [
          [1, 1],
          [5, 2],
          [2, 4],
        ],
        "result",
      ),
      segD([5, 2], [6, 5]),
      segD([2, 4], [6, 5]),
      pt([1, 1], "A(1, 1)", "sw"),
      pt([5, 2], "B(5, 2)", "se"),
      pt([2, 4], "C(2, 4)", "nw"),
    ],
    "For example, A(1, 1), B(5, 2), C(2, 4): AB = ⟨4, 1⟩ and AC = ⟨1, 3⟩ have determinant 11, so the triangle has half the parallelogram's area, 11/2.",
    "例如，A(1, 1)、B(5, 2)、C(2, 4)：AB = ⟨4, 1⟩、AC = ⟨1, 3⟩ 的行列式为 11，所以三角形面积是平行四边形的一半，11/2。",
  ),
  "linear-transformations-of-objects-in-the-plane#transforming-vertices-of-polygons": graphed(
    wide(-1, 6, -1, 5),
    [
      shape([
        [1, 1],
        [3, 1],
        [1, 3],
      ]),
      shape(
        [
          [2, 1],
          [4, 1],
          [4, 3],
        ],
        "result",
      ),
      pt([1, 3], "(1, 3)", "nw"),
      pt([1, 1], "(1, 1)", "sw"),
      pt([3, 1], "(3, 1)", "s"),
      pt([4, 3], "(4, 3)", "ne", "result"),
      pt([4, 1], "(4, 1)", "se", "result"),
    ],
    "For example, (x, y) ↦ (x + y, y) sends (1, 1), (3, 1), (1, 3) to (2, 1), (4, 1), (4, 3), and the image is the triangle on those new vertices.",
    "例如，(x, y) ↦ (x + y, y) 把 (1, 1)、(3, 1)、(1, 3) 变到 (2, 1)、(4, 1)、(4, 3)，像就是以这些新顶点构成的三角形。",
  ),
  "dilations-and-reflections-as-linear-transformations#dilation-matrices-in-the-plane": graphed(
    wide(-1, 6, -1, 5),
    [
      shape([
        [1, 1],
        [2, 1],
        [1, 2],
      ]),
      shape(
        [
          [2, 2],
          [4, 2],
          [2, 4],
        ],
        "result",
      ),
      segD(O, [2, 2]),
      segD(O, [4, 2]),
      segD(O, [2, 4]),
      pt([4, 2], "(4, 2)", "e", "result"),
      pt([2, 1], "(2, 1)", "se"),
    ],
    "For example, with k = 2 each vertex moves along its line through the origin to twice the distance, as (2, 1) goes to (4, 2).",
    "例如，k = 2 时每个顶点沿过原点的直线移到两倍距离处，如 (2, 1) 变到 (4, 2)。",
  ),
  "dilations-and-reflections-as-linear-transformations#reflection-matrices-in-the-plane": graphed(
    wide(-5, 5, -5, 5),
    [
      ln(O, [1, 1], "action", true),
      ln(O, [1, -1], "action", true),
      pt([3, 1], "(3, 1)", "e"),
      pt([3, -1], "(3, −1)", "se", "result"),
      pt([-3, 1], "(−3, 1)", "nw", "result"),
      pt([1, 3], "(1, 3)", "n", "result"),
      pt([-1, -3], "(−1, −3)", "s", "result"),
      tag([4.2, 4.2], "y = x", "w"),
      tag([4.2, -4.2], "y = −x", "w"),
    ],
    "For example, (3, 1) reflects to (3, −1) across the x-axis, (−3, 1) across the y-axis, (1, 3) across y = x and (−1, −3) across y = −x.",
    "例如，(3, 1) 关于 x 轴的像是 (3, −1)，关于 y 轴的是 (−3, 1)，关于 y = x 的是 (1, 3)，关于 y = −x 的是 (−1, −3)。",
  ),
  "right-angle-rotations-as-linear-transformations#applying-right-angle-rotations-to-vectors": graphed(
    wide(-5, 5, -5, 5),
    [
      toward(O, [3, 1]),
      toward(O, [-1, 3], "result"),
      toward(O, [-3, -1], "result"),
      toward(O, [1, -3], "result"),
      arc(90, 1.4, (Math.atan(1 / 3) * 180) / pi),
      tag([3, 1], "(3, 1)", "e"),
      tag([-1, 3], "90°: (−1, 3)", "nw"),
      tag([-3, -1], "180°: (−3, −1)", "s"),
      tag([1, -3], "270°: (1, −3)", "e"),
    ],
    "For example, (3, 1) rotates to (−1, 3) by 90°, (−3, −1) by 180° and (1, −3) by 270°, all counterclockwise.",
    "例如，(3, 1) 逆时针转 90° 到 (−1, 3)，转 180° 到 (−3, −1)，转 270° 到 (1, −3)。",
  ),
  "elementary-trigonometric-equations-containing-sine#solve-elementary-sine-equations-degrees": (() => {
    const c = chart({ x: [0, 360, 90], y: [-1, 1, 0.5], xName: "x", yName: "y", w: 8, h: 3.5 });
    return drawing(
      [
        ...c.marks,
        ...Array.from({ length: 72 }, (_, i) => seg(c.at(i * 5, sin(rad(i * 5))), c.at((i + 1) * 5, sin(rad((i + 1) * 5))))),
        seg(c.at(0, 0.5), c.at(360, 0.5), "action", true),
        ...dotAt(c.at(30, 0.5), "30", "nw", "result"),
        ...dotAt(c.at(150, 0.5), "150", "ne", "result"),
      ],
      "sin x° = 1/2: the sine curve meets the line y = 1/2 at x = 30 and x = 180 − 30 = 150 on [0, 360).",
      "sin x° = 1/2：在 [0, 360) 上，正弦曲线与直线 y = 1/2 交于 x = 30 和 x = 180 − 30 = 150。",
    );
  })(),
  "general-solutions-of-trigonometric-equations-with-transformed-functions#general-solution-multi-angle": (() => {
    const c = piChart(0, 24, 12, [-1, 1, 1], 8, 3, 6);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => sin(2 * x), 0, 2 * pi, -1, 1),
        seg(c.at(0, 0.5), c.at(2 * pi, 0.5), "action", true),
        ...[1, 5, 13, 17].flatMap((n) => dotAt(c.at((n * pi) / 12, 0.5), undefined, "n", "result")),
        note(c.at(pi / 12, 0.5), "π/12", "se"),
        note(c.at((5 * pi) / 12, 0.5), "5π/12", "ne"),
        note(c.at((13 * pi) / 12, 0.5), "13π/12", "nw"),
        note(c.at((17 * pi) / 12, 0.5), "17π/12", "ne"),
      ],
      "sin 2x = 1/2 has solutions π/12 + kπ and 5π/12 + kπ: the pair repeats every π, as 13π/12 and 17π/12 show.",
      "sin 2x = 1/2 的解是 π/12 + kπ 和 5π/12 + kπ：这一对解每隔 π 重复一次，如 13π/12 和 17π/12。",
    );
  })(),
  "trigonometric-equations-containing-transformed-cosine-functions#solve-transformed-cosine-frequency-and-phase": (() => {
    const c = piChart(0, 8, 4, [-1, 1, 1], 8, 3, 1);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => cos(2 * x), 0, 2 * pi, -1, 1),
        ...[1, 3, 5, 7].flatMap((n) => dotAt(c.at((n * pi) / 4, 0), undefined, "n", "result")),
        ...[0, 1].flatMap((n) => dotAt(c.at(n * pi, 1), undefined, "n", "action")),
      ],
      "On [0, 2π), cos 2x = 1 at x = 0 and π, at the tops in the other color, and cos 2x = 0 at x = π/4, 3π/4, 5π/4 and 7π/4, on the axis.",
      "在 [0, 2π) 上，cos 2x = 1 在 x = 0 和 π（另一颜色的最高点），cos 2x = 0 在 x = π/4、3π/4、5π/4、7π/4（x 轴上）。",
    );
  })(),
  "trigonometric-equations-containing-transformed-tangent-functions#solve-transformed-tangent-equations": (() => {
    const c = piChart(0, 8, 8, [-3, 3, 1], 8, 4, 1);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => tan(2 * x), 0, pi / 4 - 0.01, -3, 3),
        ...plot(c, (x) => tan(2 * x), pi / 4 + 0.01, (3 * pi) / 4 - 0.01, -3, 3),
        ...plot(c, (x) => tan(2 * x), (3 * pi) / 4 + 0.01, pi, -3, 3),
        wall(c, pi / 4, -3, 3, "action"),
        wall(c, (3 * pi) / 4, -3, 3, "action"),
        seg(c.at(0, 1), c.at(pi, 1), "action", true),
        ...dotAt(c.at(pi / 8, 1), undefined, "n", "result"),
        ...dotAt(c.at((5 * pi) / 8, 1), undefined, "n", "result"),
      ],
      "tan 2x = 1 on [0, π): the curve meets y = 1 once per branch, at x = π/8 and x = 5π/8.",
      "tan 2x = 1 在 [0, π) 上：曲线在每一支上与 y = 1 相交一次，在 x = π/8 和 x = 5π/8。",
    );
  })(),
};
