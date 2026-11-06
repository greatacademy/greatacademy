// Drawings of the explanations of Complex Analysis: residues on the line, Möbius and conformal maps, the Riemann sphere.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { disc, loopOf, maps, plane, plot, polar, sector, upperPath } from "./explanation-drawings-complex-kit.ts";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";

const O: Point = [0, 0];

// The section of the unit sphere through the north pole, at a scale k, with the plane through the equator.
const sphere = (k: number, reach: number): Mark[] => [ring(k), seg([-k - 0.6, 0], [reach, 0]), ...dotAt([0, k], "N", "nw")];

const halfPlane = (c: Point, r: number): Mark[] => [
  { kind: "shade", points: Array.from({ length: 49 }, (_, i) => polar(c, r, i * 3.75)), tone: "result" },
  ...plane(c, r + 0.7, r + 0.4),
];

const triangle: Point[] = [
  [0, 0],
  [3.4, 0],
  [0, 3.4],
];

/** complexDrawings2 draws the rest of the explanations of Complex Analysis, by knowledge point. */
export const complexDrawings2: Readonly<Record<string, Figure>> = {
  "improper-integrals-by-residues#poles-in-the-upper-half-plane": drawing(
    [
      ...upperPath(O, 3),
      ...[45, 135].flatMap((a) => dotAt(polar(O, 1.5, a), undefined, "n", "result")),
      ...[225, 315].flatMap((a) => dotAt(polar(O, 1.5, a))),
      note([0, -1.5], "2πi · (−√2 i/4) = π√2/2", "s"),
    ],
    "For example, ∫ dx/(x⁴ + 1). The denominator has degree four more than the numerator, so the arc contributes nothing. Of the four poles, only the two highlighted in the upper half-plane count. Their residues add to −√2 i/4, so the integral is 2πi · (−√2 i/4) = π√2/2.",
    "例如，∫ dx/(x⁴ + 1)。分母次数比分子高四，所以圆弧没有贡献。四个极点中，只有上半平面中突出显示的两个起作用。它们的留数之和为 −√2 i/4，所以积分为 2πi · (−√2 i/4) = π√2/2。",
  ),
  "improper-integrals-by-residues#an-integral-with-a-cosine": drawing(
    [
      { kind: "shade", points: Array.from({ length: 49 }, (_, i) => polar(O, 3, i * 3.75)), tone: "result" },
      ...upperPath(O, 3),
      seg([0, -2.4], [0, 3.5]),
      note([0.2, 1.6], "|eⁱᵏᶻ| = e⁻ᵏʸ ≤ 1", "e"),
      note([0.2, -1.2], "|eⁱᵏᶻ| = e⁻ᵏʸ > 1", "e"),
      note([3, 0], "x", "s"),
      note([0, 3.5], "y", "e"),
    ],
    "With k > 0, the modulus of eⁱᵏᶻ at height y is e⁻ᵏʸ. In the shaded upper half-plane it is at most 1, so by Jordan's lemma the arc vanishes and that is the place to close the path. In the lower half-plane it grows. Cosine itself grows on both sides, so use eⁱᵏᶻ and take the real part at the end.",
    "k > 0 时，eⁱᵏᶻ 在高度 y 处的模为 e⁻ᵏʸ。在阴影的上半平面中它至多为 1，所以由若尔当引理，圆弧趋于零，应在这里封闭路径。在下半平面中它增长。余弦本身在两侧都增长，所以用 eⁱᵏᶻ，最后取实部。",
  ),
  "the-cross-ratio#what-a-mobius-map-does-to-circles": drawing(
    [
      ...plane(O, 3.6, 2.4),
      ring(1, [1, 0], "result"),
      ring(1, [-2, 0], "action"),
      ...dotAt(O, "0", "se"),
      note([2, 0], "2", "se"),
      note([-1, 0], "−1", "sw"),
      note([-3, 0], "−3", "sw"),
      ...maps(5, 2.3, "w = 1/z"),
      ...plane([9.5, 0], 3, 2.4),
      seg([10.5, -2.2], [10.5, 2.2], "result"),
      note([10.5, -2.2], "Re w = 1/2", "s"),
      ring(0.667, [9.5 - 1.333, 0], "action"),
      note([7.5, 0], "−1", "sw"),
      note([8.83, 0], "−1/3", "se"),
    ],
    "Under w = 1/z, the circle through the origin centered at 1 goes to the line Re w = 1/2, because the origin goes to infinity and 2 goes to 1/2. The circle centered at −2 misses the origin and goes to a circle: −1 stays at −1 and −3 goes to −1/3. The right panel is drawn at twice the scale.",
    "在 w = 1/z 下，以 1 为圆心、过原点的圆映到直线 Re w = 1/2，因为原点映到无穷远，2 映到 1/2。以 −2 为圆心的圆不过原点，映到一个圆：−1 不动，−3 映到 −1/3。右图比例尺放大一倍。",
  ),
  "conformal-maps-of-regions#opening-a-wedge": drawing(
    [
      ...plane(O, 2.6),
      ...sector(O, 2, 0, 60),
      note(polar(O, 2, 30), "θ = π/3", "e"),
      ...maps(5, 2.4, "w = z³"),
      ...halfPlane([10, 0], 2),
      note([10, -0.4], "3 · π/3 = π", "s"),
      note([0, -2.8], "k = π/θ = 3", "s"),
    ],
    "For example, a wedge of opening θ = π/3 with its corner at the origin. Choosing k = π/θ = 3, the map w = z³ opens it to the angle 3 · π/3 = π, the upper half-plane. Conformality fails only at the corner.",
    "例如，张角 θ = π/3、顶点在原点的楔形。取 k = π/θ = 3，映射 w = z³ 把它张开到角度 3 · π/3 = π，即上半平面。保角性只在顶点处失效。",
  ),
  "conformal-maps-of-regions#opening-a-strip": drawing(
    [
      {
        kind: "shade",
        points: [
          [-2.4, 0],
          [2.4, 0],
          [2.4, Math.PI],
          [-2.4, Math.PI],
        ],
        tone: "result",
      },
      ...plane(O, 3, 4),
      seg([-2.4, Math.PI], [2.4, Math.PI], "action"),
      seg([-2.4, Math.PI / 2], [2.4, Math.PI / 2], undefined, true),
      seg([-2.4, 0], [2.4, 0], "result"),
      note([-2.4, Math.PI], "y = π", "n"),
      note([-2.4, Math.PI / 2], "y = π/2", "n"),
      ...maps(5, 3.4, "w = eᶻ"),
      ...halfPlane([10, 0], 3),
      seg([10, 0], [13, 0], "result"),
      seg([10, 0], [7, 0], "action"),
      seg([10, 0], [10, 3], undefined, true),
      note([10.1, 3], "π/2", "e"),
      note([7, 0], "π", "s"),
      note([13, 0], "0", "s"),
    ],
    "The map w = eᶻ sends the horizontal line at height y to the ray at angle y. The bottom edge of the strip goes to the ray at angle 0, the dashed middle line to the ray at angle π/2 and the top edge y = π to the ray at angle π. So the strip of height π goes onto the upper half-plane.",
    "映射 w = eᶻ 把高度 y 处的水平线映到辐角为 y 的射线。带形的下边映到辐角 0 的射线，虚线中线映到辐角 π/2 的射线，上边 y = π 映到辐角 π 的射线。所以高为 π 的带形映到上半平面。",
  ),
  "the-riemann-sphere#the-height-of-a-projected-point": drawing(
    [
      ...sphere(2, 5),
      seg([0, 2], [4, 0], "result"),
      ...dotAt([1.6, 1.2], "P", "ne", "result"),
      ...dotAt([4, 0], "|z| = 2", "s", "result"),
      seg([1.6, 0], [1.6, 1.2], undefined, true),
      note([0, -2.3], "Z = (4 − 1)/(4 + 1) = 3/5", "s"),
    ],
    "A section of the unit sphere through the north pole N. For example, a plane point with |z| = 2. The line from it to N meets the sphere at P, at height Z = (4 − 1)/(4 + 1) = 3/5, shown dashed. The height depends only on the distance from the origin.",
    "单位球过北极 N 的截面。例如，平面上 |z| = 2 的点。它与 N 的连线交球面于 P，高度为 Z = (4 − 1)/(4 + 1) = 3/5（虚线）。高度只取决于到原点的距离。",
  ),
  "the-riemann-sphere#from-the-sphere-back-to-the-plane": drawing(
    [
      ...sphere(1.5, 5.3),
      seg([0, 1.5], [4.5, 0], "result"),
      ...dotAt([0.9, 1.2], "(0.6, 0, 0.8)", "ne", "result"),
      ...dotAt([4.5, 0], "3", "s", "result"),
      note([0, -1.8], "0.6/(1 − 0.8) = 3", "s"),
    ],
    "For example, the sphere point (0.6, 0, 0.8) near the north pole N. The inverse map gives 0.6/(1 − 0.8) = 3: the denominator is small, so the point lands far out on the plane, where the line from N reaches it.",
    "例如，靠近北极 N 的球面点 (0.6, 0, 0.8)。逆映射给出 0.6/(1 − 0.8) = 3：分母很小，所以点落在平面上很远处，即从 N 出发的直线到达的位置。",
  ),
  "the-riemann-sphere#which-hemisphere": drawing(
    [
      ...sphere(2, 5),
      seg([0, 2], [1.6, -1.2], "action"),
      seg([0, 2], [2, 0]),
      seg([0, 2], [4, 0], "result"),
      ...dotAt([1.6, -1.2], undefined, "n", "action"),
      ...dotAt([1.6, 1.2], undefined, "n", "result"),
      ...dotAt([1, 0], "1/2", "sw", "action"),
      ...dotAt([2, 0], "1", "se"),
      ...dotAt([4, 0], "2", "s", "result"),
      note([0, -2.3], "Z = −3/5, 0, 3/5", "s"),
    ],
    "Three plane points and the lines from the north pole N. The point with |z| = 1/2, inside the circle, lands on the lower hemisphere at Z = −3/5. The point with |z| = 1 lands on the equator, Z = 0. The point with |z| = 2, outside, lands on the upper hemisphere at Z = 3/5.",
    "三个平面点及其与北极 N 的连线。圆内 |z| = 1/2 的点落在下半球，Z = −3/5。|z| = 1 的点落在赤道上，Z = 0。圆外 |z| = 2 的点落在上半球，Z = 3/5。",
  ),
  "the-mean-value-property-and-moreras-theorem#the-average-of-an-analytic-function": drawing(
    [
      ...loopOf(O, 1.2, 45),
      ...loopOf(O, 2.4, 45),
      ...dotAt(O, "f(a)", "n", "result"),
      note(polar(O, 2.4, 270), "r₂", "s"),
      note(polar(O, 1.2, 270), "r₁", "s"),
    ],
    "Two circles centered at a, with radii r₁ and r₂. The average of an analytic function around either circle is the same number f(a), the value at the center. So the average does not depend on the radius.",
    "以 a 为圆心、半径为 r₁ 和 r₂ 的两个圆。解析函数沿任一圆的平均值都是同一个数 f(a)，即圆心处的值。所以平均值与半径无关。",
  ),
  "the-mean-value-property-and-moreras-theorem#the-average-of-a-harmonic-function": drawing(
    [
      ...plane(O, 3),
      ring(2),
      ...dotAt([2, 0], "1", "ne", "result"),
      ...dotAt([0, 2], "−1", "ne", "result"),
      ...dotAt([-2, 0], "1", "nw", "result"),
      ...dotAt([0, -2], "−1", "se", "result"),
      ...dotAt(O, "0", "ne"),
      note([0, -3.2], "(1 − 1 + 1 − 1)/4 = 0", "s"),
    ],
    "For example, the harmonic function u = x² − y² on the unit circle. Its values at the four marked points are 1, −1, 1, −1, and their average, like its average around the whole circle, is 0, the value at the center.",
    "例如，单位圆上的调和函数 u = x² − y²。它在四个标出的点上的值为 1、−1、1、−1，它们的平均值和整个圆上的平均值一样，都是 0，即圆心处的值。",
  ),
  "the-mean-value-property-and-moreras-theorem#using-moreras-theorem": drawing(
    [
      disc(O, 2.6),
      ring(2.6),
      {
        kind: "polygon",
        points: [
          [-1.6, -0.6],
          [0.2, -1.2],
          [-0.4, 1.2],
        ],
      },
      ...head([-1.6, -0.6], [-0.7, -0.9]),
      {
        kind: "polygon",
        points: [
          [0.3, -0.1],
          [2.2, 0.1],
          [1.2, 2],
        ],
      },
      ...head([0.3, -0.1], [1.3, 0]),
      note([-0.6, -0.5], "∮ = 0", "n"),
      note([1.25, 0.35], "∮ = 0", "n"),
    ],
    "A disc with two of its triangles. If a continuous function has integral 0 around every triangle in the disc, it must be analytic there.",
    "一个圆盘及其中的两个三角形。如果连续函数沿圆盘内每个三角形的积分都为 0，它在那里一定解析。",
  ),
  "the-maximum-modulus-principle#bounding-a-polynomial-on-a-circle": drawing(
    [
      disc(O, 2),
      ring(2),
      ...plane(O, 3),
      ...[0, 120, 240].flatMap((a) => dotAt(polar(O, 2, a), undefined, "n", "result")),
      note(polar(O, 2, 120), "z³ = 1", "nw"),
      note([0, -3.2], "|z³ + 2| ≤ 1 + 2 = 3", "s"),
    ],
    "For example, z³ + 2 on the disc |z| ≤ 1. The triangle inequality gives the bound 1 + 2 = 3, on the boundary and so throughout the disc. It is attained at the three marked points of the circle, where z³ = 1 is a positive number.",
    "例如，圆盘 |z| ≤ 1 上的 z³ + 2。三角不等式给出上界 1 + 2 = 3，在边界上成立，因而在整个圆盘内成立。它在圆上三个标出的点达到，那里 z³ = 1 是正数。",
  ),
  "the-schwarz-lemma#the-derivative-at-the-origin": drawing(
    [
      ...plane(O, 3),
      ring(2),
      ...head(O, polar(O, 2, 30), "result"),
      note(polar(O, 2, 135), "R = 2", "nw"),
      ...maps(4.2, 2.6, "w = z/2"),
      ...plane([8.4, 0], 3),
      ring(1, [8.4, 0]),
      ...head([8.4, 0], polar([8.4, 0], 1, 30), "result"),
      note(polar([8.4, 0], 1, 60), "M = 1", "ne"),
      note([4.2, -3], "|f′(0)| ≤ M/R = 1/2", "s"),
    ],
    "For example, R = 2 and M = 1. The bound on the derivative at the origin is |f′(0)| ≤ M/R = 1/2. The map w = z/2 reaches it, sending the disc of radius 2 onto the disc of radius 1. A map reaching the bound is linear.",
    "例如，R = 2，M = 1。原点处导数的上界为 |f′(0)| ≤ M/R = 1/2。映射 w = z/2 达到它，把半径 2 的圆盘映到半径 1 的圆盘。达到上界的映射是线性的。",
  ),
  "the-local-behavior-of-analytic-maps#how-a-critical-point-changes-angles": drawing(
    [
      ...sector(O, 2.2, 0, 30),
      ...dotAt(O, "a", "s"),
      note(polar(O, 2.2, 15), "π/6", "e"),
      ...maps(4.6, 1.4, "m = 3"),
      ...sector([7.6, 0], 2.2, 0, 90),
      ...dotAt([7.6, 0], "f(a)", "s"),
      note(polar([7.6, 0], 2.2, 45), "3 · π/6 = π/2", "ne"),
    ],
    "For example, a zero of order m = 3 of f − f(a) at a. Two curves meeting at a at the angle π/6 have images meeting at f(a) at the angle 3 · π/6 = π/2.",
    "例如，f − f(a) 在 a 处有 m = 3 阶零点。在 a 处以角 π/6 相交的两条曲线，其像在 f(a) 处以角 3 · π/6 = π/2 相交。",
  ),
  "the-schwarz-reflection-principle#which-function-reflects": drawing(
    [
      ...plane(O, 2.6),
      seg([1, -1], [1, 1], undefined, true),
      ...dotAt([1, 1], "1 + i", "ne", "action"),
      ...dotAt([1, -1], "1 − i", "se", "action"),
      ...maps(4.5, 2.4, "z² + 1"),
      ...plane([9, 0], 2.6),
      seg([10, -2], [10, 2], undefined, true),
      ...dotAt([10, 2], "1 + 2i", "e", "result"),
      ...dotAt([10, -2], "1 − 2i", "e", "result"),
    ],
    "For example, f(z) = z² + 1, with real coefficients around the real center 0. It sends 1 + i to 1 + 2i and the mirror image 1 − i to the mirror image 1 − 2i. A single nonreal coefficient would break this symmetry.",
    "例如，f(z) = z² + 1，在实中心 0 处的系数都是实数。它把 1 + i 映到 1 + 2i，把镜像 1 − i 映到镜像 1 − 2i。只要有一个非实系数就会破坏这种对称。",
  ),
  "the-schwarz-reflection-principle#the-reflected-function": drawing(
    [
      ...plane(O, 3.4, 2.8),
      ...dotAt([2, 1], "z = 2 + i", "e"),
      ...head([2, 1], [2, -0.9]),
      ...dotAt([2, -1], "z̄ = 2 − i", "e"),
      ...head([2, -1], [1.05, 1.9], "action"),
      ...dotAt([1, 2], "f(z̄) = 1 + 2i", "ne", "action"),
      ...head([1, 2], [1, -1.9], "result"),
      ...dotAt([1, -2], "g(z) = 1 − 2i", "sw", "result"),
    ],
    "For example, f(z) = iz at z = 2 + i. Reflect to z̄ = 2 − i, apply f to get f(z̄) = 1 + 2i, and reflect again to get g(z) = 1 − 2i. Here g(z) = −iz has the conjugate coefficient −i, and g differs from f, so f does not reflect.",
    "例如，f(z) = iz，z = 2 + i。反射得 z̄ = 2 − i，应用 f 得 f(z̄) = 1 + 2i，再反射得 g(z) = 1 − 2i。这里 g(z) = −iz 的系数是共轭系数 −i，g 与 f 不同，所以 f 不满足反射。",
  ),
  "the-gamma-function-in-the-complex-plane#the-reflection-formula": (() => {
    const f = (x: number) => Math.PI / Math.sin(Math.PI * x);
    return drawing(
      pane(0, [-1, 2, 1], [-8, 8, 8], 7, 6, "x", "y")
        .f(f, -0.84, -0.16, "result")
        .f(f, 0.16, 0.84, "result")
        .f(f, 1.16, 1.84, "result")
        .wall(1)
        .wall(-1)
        .wall(2)
        .dot(0.5, Math.PI, "π", "s")
        .say(0.5, 0, "1/2", "s")
        .say(0.5, -9.8, "Γ(1/2)² = π", "s")
        .marks(),
      "The graph of π/sin(πx) on the real axis, which equals Γ(x)Γ(1 − x). It has poles at all the integers, shown as vertical asymptotes. At x = 1/2 the height is π, so Γ(1/2)² = π and Γ(1/2) = √π.",
      "π/sin(πx) 在实轴上的图像，它等于 Γ(x)Γ(1 − x)。它在所有整数处有极点，表现为竖直渐近线。在 x = 1/2 处高度为 π，所以 Γ(1/2)² = π，Γ(1/2) = √π。",
    );
  })(),
  "the-residue-at-infinity#from-the-coefficient-of-one-over-z": drawing(
    [...loopOf(O, 2, 45), ...dotAt([0.5, 0.3]), ...dotAt([-0.6, -0.4]), note([3, 1.8], "∞", "ne"), note([0, -2.3], "Res(∞) = −c₋₁", "s")],
    "A large circle around all the finite poles, counterclockwise as seen from the plane. Seen from infinity, the same circle runs clockwise, which is why the residue at infinity is minus the coefficient of 1/z.",
    "包围所有有限极点的大圆，从平面上看是逆时针的。从无穷远看，同一个圆是顺时针的，这就是无穷远处的留数等于 1/z 系数的相反数的原因。",
  ),
  "the-residue-at-infinity#all-the-residues-add-to-zero": drawing(
    [
      ...plane(O, 3.4),
      ...loopOf(O, 2.6, 60),
      ...dotAt(O, "1", "nw", "result"),
      ...dotAt([1.2, 0], "2", "n", "result"),
      note([2.6, 2.4], "∞: −3", "ne"),
      note([0, -3.6], "1 + 2 − 3 = 0", "s"),
    ],
    "For example, 1/z + 2/(z − 1), with residue 1 at 0 and residue 2 at 1. Far out the function is about 3/z, so the residue at infinity is −3, and 1 + 2 − 3 = 0.",
    "例如，1/z + 2/(z − 1)，在 0 处留数为 1，在 1 处留数为 2。在远处函数约为 3/z，所以无穷远处的留数为 −3，且 1 + 2 − 3 = 0。",
  ),
  "the-residue-at-infinity#a-large-circle-in-one-step": drawing(
    [
      ...plane(O, 3.2),
      ...loopOf(O, 2.2, 45),
      ...dotAt([0, 1], "i", "e", "result"),
      ...dotAt([0, -1], "−i", "e", "result"),
      note([0, -3.4], "∮ 2z/(z² + 1) dz = 2πi · 2/1 = 4πi", "s"),
    ],
    "For example, 2z/(z² + 1), whose denominator is one degree higher than its numerator. The circle encloses both poles, so the integral comes from infinity alone: 2πi times the ratio of the leading coefficients 2/1, which is 4πi.",
    "例如，2z/(z² + 1)，分母比分子高一次。圆包围两个极点，所以积分只由无穷远决定：2πi 乘以首项系数之比 2/1，即 4πi。",
  ),
  "jordans-lemma-and-fourier-integrals#the-ml-bound-on-the-arc": drawing(
    [
      seg([-2.4, 0], [2.4, 0]),
      ...chain(
        Array.from({ length: 49 }, (_, i) => polar(O, 2.4, i * 3.75)),
        "result",
      ),
      note(polar(O, 2.4, 60), "L = πR", "ne"),
      note([0, 0.8], "|eⁱᵃᶻ| ≤ 1", "n"),
      note([2.4, 0], "R", "s"),
      ...pane(5, [0, 8, 2], [0, 4, 2], 6, 4, "R", "")
        .f((r) => (Math.PI * r) / (r * r - 1), 1.5, 8, "result")
        .say(4, 1.6, "πR/(R² − 1)", "ne")
        .marks(),
    ],
    "On the upper semicircle of radius R, the factor eⁱᵃᶻ has size at most 1 and the arc has length L = πR. For example, with the denominator z² + 1 the bound is πR/(R² − 1), graphed on the right, which tends to 0 as R grows.",
    "在半径为 R 的上半圆上，因子 eⁱᵃᶻ 的大小至多为 1，圆弧长 L = πR。例如，分母为 z² + 1 时，上界为 πR/(R² − 1)（右图），R 增大时趋于 0。",
  ),
  "the-riemann-mapping-theorem#opening-a-sector": drawing(
    [
      ...plane(O, 2.6),
      ...sector(O, 2, 0, 45),
      note(polar(O, 2, 45), "π/4", "ne"),
      ...maps(4.8, 2.5, "z⁴", 1.2),
      ...halfPlane([9.4, 0], 2),
      ...maps(14, 2.5, "(w − i)/(w + i)", 1.2),
      ...plane([19, 0], 2.6),
      disc([19, 0], 2),
      ring(2, [19, 0]),
    ],
    "For example, a sector of angle α = π/4. The power π/α = 4 opens it into the upper half plane, and the Cayley transform (w − i)/(w + i) then maps the half plane onto the disc.",
    "例如，角 α = π/4 的扇形。幂 π/α = 4 把它张开成上半平面，然后凯莱变换 (w − i)/(w + i) 把半平面映到圆盘。",
  ),
  "the-joukowski-map#the-ellipse-from-a-circle": drawing(
    [
      ...plane(O, 3),
      ring(2, O, "action"),
      note([2, 0], "2", "se"),
      ...maps(4.6, 2.8, "z + 1/z"),
      ...plane([9, 0], 3.4),
      ...chain(
        Array.from({ length: 97 }, (_, i): Point => [9 + 2.5 * Math.cos((i * Math.PI) / 48), 1.5 * Math.sin((i * Math.PI) / 48)]),
        "result",
      ),
      note([11.5, 0], "5/2", "se"),
      note([9, 1.5], "3/2", "ne"),
    ],
    "For example, R = 2. The circle |z| = 2 goes to the ellipse with semi axes 2 + 1/2 = 5/2 and 2 − 1/2 = 3/2.",
    "例如，R = 2。圆 |z| = 2 映到半轴为 2 + 1/2 = 5/2 和 2 − 1/2 = 3/2 的椭圆。",
  ),
  "the-joukowski-map#the-unit-circle-collapses": drawing(
    [
      ...plane(O, 3),
      ring(1.5, O, "action"),
      note([1.5, 0], "1", "se"),
      note([-1.5, 0], "−1", "sw"),
      ...maps(4.6, 2.8, "z + 1/z"),
      ...plane([9, 0], 4),
      ...head([6, 0.1], [12, 0.1], "result"),
      ...head([12, -0.1], [6, -0.1], "result"),
      note([12, -0.1], "2", "s"),
      note([6, -0.1], "−2", "s"),
    ],
    "On the unit circle z + 1/z is twice the real part of z. So the whole circle collapses onto the real segment from −2 to 2, traversed back and forth, as the two arrows show.",
    "在单位圆上，z + 1/z 是 z 实部的两倍。所以整个圆塌缩到从 −2 到 2 的实线段上，来回走过，如两个箭头所示。",
  ),
  "the-dirichlet-problem-on-simple-regions#the-center-value": (() => {
    const p = plot(0, 1, 0.8, 7.2, 0, 6.4);
    const u = (t: number) => 3 + 2 * Math.cos(t) + Math.sin(2 * t);
    const xs = Array.from({ length: 97 }, (_, i) => (i * 2 * Math.PI) / 96);
    return drawing(
      [
        ...p.axes,
        ...chain(
          xs.map((t) => p.at(t, u(t))),
          "result",
        ),
        seg(p.at(0, 3), p.at(2 * Math.PI, 3), undefined, true),
        note(p.at(0, 3), "3", "w"),
        note(p.at(Math.PI, 0), "π", "s"),
        note(p.at(2 * Math.PI, 0), "2π", "s"),
        note(p.at(4.6, 4.6), "3 + 2cos θ + sin 2θ", "n"),
      ],
      "For example, boundary data 3 + 2cos θ + sin 2θ around a circle, plotted against θ. The cosine and sine average to zero over the full circle, so the average is the dashed level 3, and that is the value at the center.",
      "例如，圆上的边界数据 3 + 2cos θ + sin 2θ，对 θ 作图。余弦和正弦在整个圆上的平均值为零，所以平均值是虚线高度 3，这就是圆心处的值。",
    );
  })(),
  "the-schwarz-christoffel-formula#the-exponent-at-a-vertex": drawing(
    [
      {
        kind: "shade",
        points: [
          [-3, 0],
          [3, 0],
          [3, 2.6],
          [-3, 2.6],
        ],
        tone: "result",
      },
      ...head([-3.2, 0], [3.4, 0]),
      ...dotAt([-2, 0], "x₁", "s"),
      ...dotAt([0, 0], "x₂", "s"),
      ...dotAt([2, 0], "x₃", "s"),
      ...maps(4.6, 1.8, "f"),
      { kind: "shade", points: triangle.map(([x, y]) => [x + 6.4, y]), tone: "result" },
      { kind: "polygon", points: triangle.map(([x, y]) => [x + 6.4, y]) },
      note([6.5, 0], "π/2", "sw"),
      note([9.8, 0], "π/4", "se"),
      note([6.4, 3.4], "π/4", "n"),
      note([8, -1], "−1/2,  −3/4,  −3/4", "s"),
    ],
    "For example, the upper half plane mapped onto a right triangle. The interior angles π/2, π/4 and π/4 are αₖπ with αₖ = 1/2, 1/4, 1/4, so the factors of f′ at x₁, x₂, x₃ have the exponents αₖ − 1 = −1/2, −3/4, −3/4.",
    "例如，上半平面映到直角三角形。内角 π/2、π/4、π/4 为 αₖπ，其中 αₖ = 1/2、1/4、1/4，所以 f′ 在 x₁、x₂、x₃ 处的因子指数为 αₖ − 1 = −1/2、−3/4、−3/4。",
  ),
  "the-schwarz-christoffel-formula#exponents-add-to-minus-two": drawing(
    [
      { kind: "shade", points: triangle, tone: "result" },
      { kind: "polygon", points: triangle },
      ...head([3.4, 0], [5, 0], "action"),
      ...head([0, 3.4], [-1.1, 4.5], "action"),
      ...head([0, 0], [0, -1.6], "action"),
      note([3.4, 0.2], "3π/4", "ne"),
      note([0, 3.5], "3π/4", "ne"),
      note([0.1, -0.2], "π/2", "se"),
      note([2, -1.9], "π/2 + 3π/4 + 3π/4 = 2π", "s"),
      note([2, -2.7], "−1/2 − 3/4 − 3/4 = −2", "s"),
    ],
    "For example, a right triangle. Walking around it, the turn at each vertex is the exterior angle (1 − αₖ)π, here π/2, 3π/4 and 3π/4, which add to 2π. Dividing by −π, the exponents −1/2, −3/4 and −3/4 add to −2.",
    "例如，直角三角形。沿它走一圈，每个顶点处转过的是外角 (1 − αₖ)π，这里为 π/2、3π/4、3π/4，之和为 2π。除以 −π 后，指数 −1/2、−3/4、−3/4 之和为 −2。",
  ),
  "the-schwarz-christoffel-formula#a-regular-polygon": (() => {
    const hex = Array.from({ length: 6 }, (_, i) => polar([8, 0], 2.2, i * 60));
    return drawing(
      [
        ...plane(O, 2.8),
        disc(O, 2),
        ring(2),
        ...Array.from({ length: 6 }, (_, i) => dotAt(polar(O, 2, i * 60), undefined, "n", "result")).flat(),
        ...maps(4, 2.6, "f"),
        { kind: "shade", points: hex, tone: "result" },
        { kind: "polygon", points: hex },
        ...hex.flatMap((p) => dotAt(p, undefined, "n", "result")),
        note([8, 0], "2π/3", "n"),
        note([4, -2.8], "−2/6 = −1/3", "s"),
      ],
      "For example, n = 6. The sixth roots of unity on the circle go to the vertices of a regular hexagon, whose interior angle is (6 − 2)/6 · π = 2π/3. Each of the six factors of f′ has the exponent −2/6 = −1/3.",
      "例如，n = 6。圆上的六次单位根映到正六边形的顶点，其内角为 (6 − 2)/6 · π = 2π/3。f′ 的六个因子的指数都是 −2/6 = −1/3。",
    );
  })(),
};
