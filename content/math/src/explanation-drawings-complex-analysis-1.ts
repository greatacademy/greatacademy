// Drawings of the explanations of Complex Analysis: maps, contours, winding numbers and zeros.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { dashedRing, disc, loopOf, maps, plane, plot, polar, sector, spin, upperPath } from "./explanation-drawings-complex-kit.ts";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";

const O: Point = [0, 0];
const R: Point = [9, 0];
const dots = (points: readonly Point[], s?: "action" | "result"): Mark[] => points.flatMap((p) => dotAt(p, undefined, "n", s));

/** complexDrawings1 draws the first explanations of Complex Analysis, by knowledge point. */
export const complexDrawings1: Readonly<Record<string, Figure>> = {
  "functions-of-a-complex-variable#the-image-of-a-circle-under-a-power": drawing(
    [
      ...plane(O, 2.6),
      ...loopOf(O, 1, 45),
      note([0.8, 0.8], "|z| = 1", "ne"),
      ...maps(4, 2.4, "w = 2z²"),
      ...plane(R, 2.8),
      ring(2, R, "result"),
      ...spin(R, 2, 45, true, "result"),
      ...spin(R, 2, 225, true, "result"),
      note([9, -2.9], "|w| = 2 · 1² = 2", "s"),
    ],
    "For example, f(z) = 2z² with k = 2. The circle |z| = 1 on the left goes to the circle |w| = 2 · 1² = 2 on the right, also around the origin. The two arrows show that the image is traversed 2 times.",
    "例如，f(z) = 2z²，k = 2。左图的圆 |z| = 1 映到右图同样以原点为圆心的圆 |w| = 2 · 1² = 2。两个箭头表示像被走过 2 次。",
  ),
  "the-complex-derivative#the-conjugate-has-no-derivative": drawing(
    [
      ...plane(O, 2.6),
      ...head(O, [1.8, 0], "result"),
      note([1.1, 0.05], "h = h̄", "n"),
      note([0, -2.9], "h̄/h = 1", "s"),
      ...plane(R, 2.6),
      ...head(R, [9, 1.8], "result"),
      ...head(R, [9, -1.8], "action"),
      note([9.1, 1.2], "h", "e"),
      note([9.1, -1.2], "h̄", "e"),
      note([9, -2.9], "h̄/h = −1", "s"),
    ],
    "On the left, a real h equals its conjugate, so the quotient h̄/h is 1. On the right, an imaginary h is reflected to −h, so h̄/h is −1. The two values differ, so the limit does not exist.",
    "左图中，实数 h 等于其共轭，所以商 h̄/h 为 1。右图中，纯虚数 h 被反射为 −h，所以 h̄/h 为 −1。两个值不同，所以极限不存在。",
  ),
  "the-complex-exponential-function#evaluating-the-exponential": drawing(
    [
      ...plane(O, 3),
      seg([1, -2.6], [1, 2.6], "result"),
      seg([-2.6, Math.PI / 4], [2.6, Math.PI / 4], "action"),
      note([1, 2.6], "x = 1", "e"),
      note([-2.6, Math.PI / 4], "y = π/4", "n"),
      ...maps(4.6, 3, "w = eᶻ"),
      ...plane([10, 0], 3.6),
      ring(Math.E, [10, 0], "result"),
      seg([10, 0], polar([10, 0], 3.5, 45), "action"),
      note(polar([10, 0], 3.5, 45), "arg w = π/4", "e"),
      note([10, -3.6], "|w| = e¹", "s"),
    ],
    "For example, the vertical line x = 1 goes to the circle |w| = e¹, because the real part sets the modulus. The horizontal line y = π/4 goes to the ray at angle π/4, because the imaginary part sets the argument.",
    "例如，竖直线 x = 1 映到圆 |w| = e¹，因为实部决定模。水平线 y = π/4 映到辐角为 π/4 的射线，因为虚部决定辐角。",
  ),
  "the-complex-exponential-function#the-modulus-of-the-exponential": drawing(
    [
      ...plane(O, 3.4),
      ...dashedRing(O, Math.E),
      seg(O, polar(O, Math.E, 60), "result"),
      ...dotAt(polar(O, Math.E, 60), "w", "ne", "result"),
      note(polar(O, 1.5, 60), "e¹", "w"),
      note([1.5, 0.25], "π/3", "n"),
      note([0, -3.6], "ln|w| = 1 = x", "s"),
    ],
    "For example, z = 1 + iπ/3 gives the point w = eᶻ. Its modulus is e¹, set by the real part, and its angle is π/3, set by the imaginary part. So ln|w| = 1 recovers the real part x. The dashed circle shows every point of that modulus.",
    "例如，z = 1 + iπ/3 给出点 w = eᶻ。它的模为 e¹，由实部决定，辐角为 π/3，由虚部决定。所以 ln|w| = 1 恢复实部 x。虚线圆表示所有这个模的点。",
  ),
  "contour-integrals#the-conjugate-around-a-circle": drawing(
    [
      ...plane(O, 3),
      ...loopOf(O, 2, 120),
      seg(O, polar(O, 2, 40), "result"),
      seg(O, polar(O, 2, -40), "action"),
      ...dotAt(polar(O, 2, 40), "z = 2eⁱᵗ", "ne", "result"),
      ...dotAt(polar(O, 2, -40), "z̄ = 2e⁻ⁱᵗ", "se", "action"),
      note([0, -3.2], "∮ z̄ dz = 2πi · 2² = 8πi", "s"),
    ],
    "For example, r = 2. The point z = 2eⁱᵗ and its mirror image z̄ = 2e⁻ⁱᵗ turn in opposite directions, so their exponentials cancel and the integrand is a constant. The integral is 2πi · 2² = 8πi, which grows with the square of the radius.",
    "例如，r = 2。点 z = 2eⁱᵗ 及其镜像 z̄ = 2e⁻ⁱᵗ 向相反方向转动，所以指数相消，被积函数为常数。积分为 2πi · 2² = 8πi，随半径的平方增长。",
  ),
  "contour-integrals#integrating-powers-around-a-circle": drawing(
    [...plane(O, 3), ...loopOf(O, 2), note([0, -3.2], "∮ dz/z = 2πi", "s"), note([0, -4], "∮ zⁿ dz = 0,  n ≠ −1", "s")],
    "A counterclockwise circle around the origin. Every integer power integrates to 0 around it, except n = −1, whose integral is 2πi.",
    "绕原点的逆时针圆。每个整数次幂沿它的积分都为 0，只有 n = −1 例外，其积分为 2πi。",
  ),
  "cauchys-integral-theorem#whether-a-pole-is-enclosed": drawing(
    [
      ...loopOf(O, 2),
      ...dotAt([0.6, 0.3], "a", "ne", "result"),
      note([0, -2.3], "∮ = 2πic", "s"),
      ...loopOf([7, 0], 2),
      ...dotAt([9.7, 1], "a", "ne", "result"),
      note([7, -2.3], "∮ = 0", "s"),
    ],
    "The integral of c/(z − a) around a circle. On the left a lies inside, so the integral is 2πic. On the right a lies outside, so the function is analytic inside and the integral is 0.",
    "c/(z − a) 沿圆的积分。左图中 a 在圆内，积分为 2πic。右图中 a 在圆外，函数在圆内解析，积分为 0。",
  ),
  "cauchys-integral-formula#cauchys-formula-inside-or-outside": drawing(
    [
      ...loopOf(O, 2),
      ...dotAt([-0.5, 0.4], "a", "n", "result"),
      note([0, -2.3], "(1/2πi) ∮ = g(a)", "s"),
      ...loopOf([7, 0], 2),
      ...dotAt([9.7, -1], "a", "ne", "result"),
      note([7, -2.3], "(1/2πi) ∮ = 0", "s"),
    ],
    "The same integral around a counterclockwise circle has two values. When the point a lies inside the circle, on the left, it equals g(a). When a lies outside, on the right, it equals 0.",
    "沿逆时针圆的同一个积分有两个值。点 a 在圆内时（左图），它等于 g(a)。a 在圆外时（右图），它等于 0。",
  ),
  "cauchys-estimates-and-liouvilles-theorem#a-cauchy-estimate": drawing(
    [
      ring(2.2, O, "result"),
      seg(O, polar(O, 2.2, 30)),
      ...dotAt(O, "a", "w"),
      note(polar(O, 1.1, 30), "r", "n"),
      note(polar(O, 2.2, 110), "|f| ≤ M", "nw"),
      note([0, -2.5], "|f⁽ⁿ⁾(a)| ≤ n! M/rⁿ", "s"),
    ],
    "A circle of radius r about the point a, on which the analytic function is bounded by M. That gives |f⁽ⁿ⁾(a)| ≤ n! M/rⁿ. If f is entire and bounded, r can grow without limit, so the first derivative is 0 everywhere.",
    "以点 a 为圆心、半径为 r 的圆，解析函数在其上以 M 为界。这给出 |f⁽ⁿ⁾(a)| ≤ n! M/rⁿ。如果 f 是有界整函数，r 可以无限增大，所以一阶导数处处为 0。",
  ),
  "cauchys-estimates-and-liouvilles-theorem#the-maximum-modulus": drawing(
    [
      disc(O, 2),
      ring(2, O),
      ...plane(O, 3),
      ...dotAt([2, 0], "|f(2)| = 4 + 3 = 7", "ne", "result"),
      ...dotAt(O),
      note([0.15, -0.1], "|f(0)| = 3", "se"),
    ],
    "For example, f(z) = z² + 3 on the disc |z| ≤ 2. The triangle inequality gives |f| ≤ 4 + 3 = 7, and the point z = 2 on the boundary circle attains it, so 7 is exact. At the center the modulus is only 3.",
    "例如，圆盘 |z| ≤ 2 上的 f(z) = z² + 3。三角不等式给出 |f| ≤ 4 + 3 = 7，边界圆上的点 z = 2 达到它，所以 7 是精确的。圆心处的模只有 3。",
  ),
  "the-residue-theorem#a-real-integral-from-residues": drawing(
    [
      ...upperPath(O, 3),
      seg([0, -2], [0, 3.6]),
      ...dotAt([0, 1], "i", "e", "result"),
      ...dotAt([0, -1], "−i", "e"),
      note([-3, 0], "−R", "s"),
      note([3, 0], "R", "s"),
      note([0, -2.1], "2πi · 1/(2i) = π", "s"),
    ],
    "For example, ∫ dx/(1 + x²) over the whole line. The interval is closed by a large semicircle in the upper half plane, whose contribution vanishes. It encloses only the pole i, where the residue is 1/(2i), so the integral is 2πi · 1/(2i) = π. The pole −i stays outside.",
    "例如，∫ dx/(1 + x²) 在整条实轴上的积分。用上半平面的大半圆把区间封闭，半圆的贡献趋于零。它只包围极点 i，留数为 1/(2i)，所以积分为 2πi · 1/(2i) = π。极点 −i 在外面。",
  ),
  "the-residue-theorem#residues-of-a-rational-function-sum-to-zero": drawing(
    [
      ...plane(O, 3.6),
      ...loopOf(O, 3, 60),
      ...dotAt([1, 0], "1/2", "n", "result"),
      ...dotAt([-1, 0], "−1/2", "n", "result"),
      note([0, -3.8], "1/2 − 1/2 = 0", "s"),
    ],
    "For example, 1/((z − 1)(z + 1)), with degrees differing by 2. A large circle encloses both poles, and the integral around it tends to 0. So the residues 1/2 at z = 1 and −1/2 at z = −1 add up to 0.",
    "例如，1/((z − 1)(z + 1))，次数相差 2。大圆包围两个极点，沿它的积分趋于 0。所以 z = 1 处的留数 1/2 与 z = −1 处的留数 −1/2 之和为 0。",
  ),
  "conformal-maps#the-local-scale-factor": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      },
      ...head([0, 0], [1, 0], "result"),
      ...dotAt([0, 0], "z", "sw"),
      note([0.5, -0.1], "1", "s"),
      ...maps(3, 0.5, "f′ = 2i"),
      {
        kind: "polygon",
        points: [
          [7, 0],
          [7, 2],
          [5, 2],
          [5, 0],
        ],
      },
      ...head([7, 0], [7, 2], "result"),
      ...dotAt([7, 0], "f(z)", "se"),
      note([7, 1], "2", "e"),
      note([6, -0.6], "|f′| = 2,  arg f′ = π/2", "s"),
    ],
    "For example, f′(z) = 2i at a point. Near it the map multiplies by 2i, so a small square keeps its shape: it turns by arg f′ = π/2, and the marked side grows from 1 to |f′| = 2. All directions turn and stretch by the same amounts.",
    "例如，某点处 f′(z) = 2i。在其附近映射相当于乘以 2i，所以小正方形保持形状：它转过 arg f′ = π/2，标出的边从 1 变为 |f′| = 2。所有方向都转过并伸长相同的量。",
  ),
  "conformal-maps#where-conformality-fails": drawing(
    [
      ...plane(O, 2.6),
      ...sector(O, 2, 0, 45),
      note(polar(O, 2, 22), "π/4", "e"),
      ...maps(4.3, 2.4, "w = z²"),
      ...plane([8.6, 0], 2.6),
      ...sector([8.6, 0], 2, 0, 90),
      note(polar([8.6, 0], 2, 45), "π/2", "ne"),
      note([0, -2.8], "f′(0) = 0", "s"),
    ],
    "The map w = z² has derivative 2z, which vanishes at the critical point 0. There it doubles angles: the wedge of opening π/4 on the left becomes the wedge of opening π/2 on the right.",
    "映射 w = z² 的导数为 2z，在临界点 0 处为零。在那里它使角度加倍：左图张角为 π/4 的楔形变成右图张角为 π/2 的楔形。",
  ),
  "conformal-maps#the-local-rotation-angle": drawing(
    [
      ...plane(O, 3),
      ...loopOf(O, 2.2, 150),
      ...dotAt(polar(O, 2.2, 30), "z", "n", "result"),
      ...head(polar(O, 2.2, 30), [polar(O, 2.2, 30)[0] + 0.5, polar(O, 2.2, 30)[1]], "action"),
      note([0, -3.1], "θ = π/6", "s"),
      ...maps(4.5, 3, "w = z³"),
      ...plane(R, 3),
      ring(2.2, R),
      ...dotAt([9, 2.2], "w", "nw", "result"),
      ...head([9, 2.2], polar([9, 2.2], 1.5, 60), "action"),
      note([9, -3.1], "(3 − 1) · π/6 = π/3", "s"),
    ],
    "For example, f(z) = z³ at z with |z| = 1 and argument θ = π/6. The derivative is 3z², so the small horizontal arrow at z turns by (3 − 1) · π/6 = π/3, while growing by the modulus 3, at the image w.",
    "例如，f(z) = z³，z 满足 |z| = 1，辐角 θ = π/6。导数为 3z²，所以 z 处的水平小箭头在像 w 处转过 (3 − 1) · π/6 = π/3，同时伸长为模 3 倍。",
  ),
  "conformal-maps#the-image-of-a-drawn-wedge": drawing(
    [
      ...plane(O, 2.6),
      ...sector(O, 2, 0, 45),
      note(polar(O, 2, 22), "π/4", "e"),
      ...maps(4.3, 2.4, "w = z³"),
      ...plane([8.6, 0], 2.6),
      ...sector([8.6, 0], 2, 0, 135),
      note(polar([8.6, 0], 2, 135), "3π/4", "nw"),
    ],
    "For example, k = 3. The wedge of opening π/4 with its tip at the origin goes to the wedge of opening 3 · π/4 = 3π/4, also with its tip at the origin. Conformality fails at the origin, so the angle there changes.",
    "例如，k = 3。顶点在原点、张角为 π/4 的楔形映到张角为 3 · π/4 = 3π/4 的楔形，顶点也在原点。保角性在原点失效，所以那里的角度发生变化。",
  ),
  "power-series-on-discs#a-point-against-the-disc": drawing(
    [
      disc(O, 2),
      ring(2, O),
      seg(O, polar(O, 2, 130)),
      note(polar(O, 1, 130), "R = 2", "sw"),
      ...dotAt(O, "a", "s"),
      ...dotAt([1, 0.3], "✓", "n", "result"),
      ...dotAt([3, -0.6], "✗", "n", "action"),
      ...dotAt(polar(O, 2, 50), "?", "ne"),
    ],
    "For example, center a and radius R = 2. A point at a distance less than 2 lies in the shaded disc, and the series converges there (✓). A point farther than 2 lies outside, and it diverges there (✗). On the circle itself the radius decides nothing (?), and each point needs its own test.",
    "例如，中心 a，半径 R = 2。距离小于 2 的点在阴影圆盘内，级数在那里收敛（✓）。距离大于 2 的点在外面，级数在那里发散（✗）。在圆上半径不能决定什么（?），每个点都要单独检验。",
  ),
  "the-ml-inequality#a-bound-on-a-large-arc": drawing(
    [
      seg([-3, 0], [3, 0]),
      ...chain(
        Array.from({ length: 49 }, (_, i) => polar(O, 3, i * 3.75)),
        "result",
      ),
      ...dotAt(polar(O, 3, 60), "L = πR", "ne", "result"),
      note([0, 1.2], "|z² + 1| ≥ R² − 1", "s"),
      note([3, 0], "R", "s"),
      note([0, -0.6], "πR/(R² − 1)", "s"),
    ],
    "An upper semicircle of radius R, with length L = πR. On it |z² + 1| ≥ R² − 1. So the integral of 1/(z² + 1) along it is at most πR/(R² − 1), which shrinks like 1/R.",
    "半径为 R 的上半圆，长度 L = πR。在其上 |z² + 1| ≥ R² − 1。所以 1/(z² + 1) 沿它的积分至多为 πR/(R² − 1)，以 1/R 的速度缩小。",
  ),
  "winding-numbers#reading-a-winding-number": (() => {
    const c = (t: number): Point => [(1 + 2 * Math.cos(t)) * Math.cos(t), (1 + 2 * Math.cos(t)) * Math.sin(t)];
    return drawing(
      [
        ...chain(
          Array.from({ length: 145 }, (_, i) => c((i * Math.PI) / 72)),
          "result",
        ),
        ...head(c(0.5), c(0.6), "result"),
        ...head(c(2.65), c(2.75), "result"),
        seg([0.5, 0], [4.4, 0], undefined, true),
        ...dotAt([0.5, 0], "2", "nw"),
        ...dotAt([2, 0], "1", "n"),
        ...dotAt([4.4, 0], "0", "n"),
        note([1.05, 0], "+1", "se"),
        note([3.05, 0], "+1", "se"),
      ],
      "For example, a loop with an inner loop. The dashed ray from the point in the inner loop crosses the path twice, both times counterclockwise, so the winding number is +1 + 1 = 2. The point between the loops has winding number 1, and the point far away has 0.",
      "例如，一条带内环的闭路。从内环中的点出发的虚线射线与路径相交两次，都是逆时针方向，所以环绕数为 +1 + 1 = 2。两环之间的点环绕数为 1，远处的点环绕数为 0。",
    );
  })(),
  "winding-numbers#the-winding-number-of-a-repeated-circle": drawing(
    [
      ring(2, O, "result"),
      ...spin(O, 2, 60, false, "result"),
      ...spin(O, 2, 240, false, "result"),
      ...dotAt(O, "c,  n = −2", "n"),
      ...dotAt([3, 0.8], "n = 0", "n"),
      note([0, -2.3], "z(t) = c + 2e⁻²ⁱᵗ", "s"),
    ],
    "For example, k = −2 and r = 2. The path goes around the circle 2 times clockwise, shown by the two arrows. The center and every point inside have winding number n = −2. A point outside has n = 0, because the path never encircles it.",
    "例如，k = −2，r = 2。路径沿顺时针绕圆 2 次（两个箭头）。圆心及圆内每一点的环绕数 n = −2。圆外的点 n = 0，因为路径不包围它。",
  ),
  "winding-numbers#the-winding-number-of-a-drawn-loop": (() => {
    const c = (t: number): Point => [2.4 * Math.cos(t), 1.6 * Math.sin(2 * t)];
    return drawing(
      [
        ...chain(
          Array.from({ length: 121 }, (_, i) => c((i * Math.PI) / 60)),
          "result",
        ),
        ...head(c(0.6), c(0.7), "result"),
        ...head(c(2.5), c(2.6), "result"),
        ...dotAt([1.2, 0], "+1", "n"),
        ...dotAt([-1.2, 0], "−1", "n"),
        ...dotAt([3.2, 1.2], "0", "n"),
      ],
      "For example, a figure-eight loop. It passes counterclockwise around the point in the right lobe, winding number +1, and clockwise around the point in the left lobe, winding number −1. The point outside has winding number 0.",
      "例如，8 字形闭路。它沿逆时针绕右瓣中的点，环绕数为 +1；沿顺时针绕左瓣中的点，环绕数为 −1。外面的点环绕数为 0。",
    );
  })(),
  "laurent-series-on-annuli#counting-the-regions-of-expansion": drawing(
    [
      ...plane(O, 4.2),
      ring(1, O),
      ring(2, O),
      ring(3, O),
      ...dotAt([1, 0], undefined, "n", "result"),
      ...dotAt([0, 2], undefined, "n", "result"),
      ...dotAt([3, 0], undefined, "n", "result"),
      ...["1", "2", "3", "4"].map((t, i) => note(polar(O, 0.5 + i, 225), t, "s")),
    ],
    "For example, poles at 1, 2i and 3, at the distances 1, 2 and 3 from the center. The three circles split the plane into one disc, two annuli and one outer region, numbered 1 to 4. The function has one Laurent series on each of the 4 regions.",
    "例如，极点在 1、2i 和 3，到中心的距离为 1、2、3。三个圆把平面分成一个圆盘、两个圆环和一个外部区域，编号为 1 到 4。函数在这 4 个区域上各有一个洛朗级数。",
  ),
  "laurent-series-on-annuli#a-coefficient-in-an-annulus-between-two-poles": drawing(
    [
      disc(O, 2, 1),
      ring(1, O),
      ring(2, O),
      ...plane(O, 3),
      ...dotAt([1, 0], "z⁻ⁿ", "nw", "result"),
      ...dotAt([2, 0], "zⁿ", "ne", "result"),
      note([0, -3.2], "1/(z − 2) − 1/(z − 1)", "s"),
    ],
    "For example, 1/((z − 1)(z − 2)) = 1/(z − 2) − 1/(z − 1) on the shaded annulus 1 < |z| < 2. The pole at 1, inside the inner circle, gives negative powers of z, written z⁻ⁿ. The pole at 2, outside the outer circle, gives nonnegative powers, written zⁿ. Both kinds appear in one series.",
    "例如，阴影圆环 1 < |z| < 2 上的 1/((z − 1)(z − 2)) = 1/(z − 2) − 1/(z − 1)。内圆内的极点 1 给出 z 的负次幂，写作 z⁻ⁿ。外圆外的极点 2 给出非负次幂，写作 zⁿ。两种幂出现在同一个级数中。",
  ),
  "laurent-series-on-annuli#counting-laurent-expansions-from-a-drawing": drawing(
    [
      ...plane(O, 3.4),
      ring(1, O),
      ring(2, O),
      ...dotAt([1, 0], "1", "ne", "result"),
      ...dotAt([-1, 0], "−1", "nw", "result"),
      ...dotAt([0, 2], "2i", "ne", "result"),
      ...["1", "2", "3"].map((t, i) => note(polar(O, 0.5 + i, 225), t, "s")),
    ],
    "For example, singularities at 1, −1 and 2i. The first two lie at the same distance, so they add just one circle. The two circles give 3 regions, numbered 1, 2 and 3: an inner disk, an annulus and an outer region, so there are 3 Laurent expansions about the origin.",
    "例如，奇点在 1、−1 和 2i。前两个距离相同，所以只增加一个圆。两个圆给出 3 个区域，编号为 1、2 和 3：内圆盘、圆环和外部区域，所以关于原点有 3 个洛朗展开。",
  ),
  "the-argument-principle-and-rouches-theorem#counting-with-rouches-theorem": (() => {
    const k = 1.6;
    const zeros: Point[] = [
      [-0.008, 0.499],
      [-0.008, -0.499],
      [0.825, 1.33],
      [0.825, -1.33],
      [-1.635, 0],
    ];
    return drawing(
      [
        ...plane(O, 3.4),
        ...loopOf(O, k, 45, true),
        ...dots(
          zeros.slice(0, 2).map(([x, y]) => [k * x, k * y]),
          "result",
        ),
        ...dots(zeros.slice(2).map(([x, y]) => [k * x, k * y])),
        note([0, -3.6], "|4z²| = 4 > 2 ≥ |z⁵ + 1|", "s"),
      ],
      "For example, z⁵ + 4z² + 1 on the circle |z| = 1. There 4z² dominates, since 4 > 2 ≥ |z⁵ + 1|, so inside the circle the polynomial has as many zeros as 4z², namely 2. The drawing marks all five zeros: the two inside are highlighted.",
      "例如，圆 |z| = 1 上的 z⁵ + 4z² + 1。在圆上 4z² 占优，因为 4 > 2 ≥ |z⁵ + 1|，所以多项式在圆内的零点数与 4z² 相同，即 2 个。图中标出全部五个零点，圆内的两个突出显示。",
    );
  })(),
  "the-argument-principle-and-rouches-theorem#counting-zeros-in-an-annulus": (() => {
    const k = 1.5;
    const outer: Point[] = [
      [1.104, 1.06],
      [1.104, -1.06],
      [-1.004, 1.061],
      [-1.004, -1.061],
    ];
    return drawing(
      [
        disc(O, 2 * k, k),
        ring(k, O),
        ring(2 * k, O),
        ...plane(O, 3.8),
        ...dots(
          outer.map(([x, y]) => [k * x, k * y]),
          "result",
        ),
        ...dots([[-0.2 * k, 0]]),
        note([0, -4], "5 − 1 = 4", "s"),
      ],
      "For example, z⁵ + 5z + 1. On |z| = 2 the term z⁵ dominates, since 32 > 11, so 5 zeros lie inside the outer circle. On |z| = 1 the term 5z dominates, since 5 > 2, so 1 zero lies inside the inner circle. The shaded annulus holds 5 − 1 = 4 zeros, as the marked points show.",
      "例如，z⁵ + 5z + 1。在 |z| = 2 上 z⁵ 占优，因为 32 > 11，所以外圆内有 5 个零点。在 |z| = 1 上 5z 占优，因为 5 > 2，所以内圆内有 1 个零点。阴影圆环内有 5 − 1 = 4 个零点，如图中所标。",
    );
  })(),
  "trigonometric-integrals-by-residues#substituting-on-the-unit-circle": drawing(
    [
      ...plane(O, 3.2),
      ...loopOf(O, 2.4, 120),
      seg(O, polar(O, 2.4, 50), "result"),
      seg(O, polar(O, 2.4, -50), "action"),
      seg(polar(O, 2.4, 50), polar(O, 2.4, -50), undefined, true),
      ...dotAt(polar(O, 2.4, 50), "z = eⁱᶿ", "ne", "result"),
      ...dotAt(polar(O, 2.4, -50), "1/z", "se", "action"),
      ...dotAt([2.4 * Math.cos((50 * Math.PI) / 180), 0]),
      note([1.7, -0.1], "cos θ", "se"),
      note([0.55, 0.15], "θ", "ne"),
      note([0, -3.4], "cos θ = (z + 1/z)/2", "s"),
    ],
    "On the unit circle, z = eⁱᶿ and 1/z is its mirror image in the real axis. The dashed segment joins them, and its midpoint on the real axis is cos θ = (z + 1/z)/2. As θ runs from 0 to 2π, z goes once around the circle.",
    "在单位圆上，z = eⁱᶿ，1/z 是它关于实轴的镜像。虚线连接两者，其在实轴上的中点为 cos θ = (z + 1/z)/2。θ 从 0 到 2π 时，z 绕圆一周。",
  ),
  "trigonometric-integrals-by-residues#the-classic-period-integral": drawing(
    [
      ...plane(O, 4.2, 3),
      ...loopOf(O, 2, 45),
      ...dotAt([-1, 0], "−1/2", "n", "result"),
      ...dotAt([-4, 0], "−2", "n"),
      note([2, 0], "1", "se"),
      note([0, -3.2], "2π/√(25 − 16) = 2π/3", "s"),
    ],
    "For example, a = 5 and b = 4. The substitution gives the poles z = −1/2 and z = −2 of 1/(2z² + 5z + 2). Only −1/2 lies inside the unit circle, so only it counts, and the integral is 2π/√(25 − 16) = 2π/3.",
    "例如，a = 5，b = 4。代换后 1/(2z² + 5z + 2) 的极点为 z = −1/2 和 z = −2。只有 −1/2 在单位圆内，所以只有它起作用，积分为 2π/√(25 − 16) = 2π/3。",
  ),
  "trigonometric-integrals-by-residues#the-integral-of-a-squared-trigonometric-sum": (() => {
    const p = plot(0, 1, 3.2, 7.2, 0, 1.25, "θ", "");
    const f = (x: number) => Math.cos(x) ** 2;
    const xs = Array.from({ length: 97 }, (_, i) => (i * 2 * Math.PI) / 96);
    return drawing(
      [
        { kind: "shade", points: [p.at(0, 0), ...xs.map((x) => p.at(x, f(x))), p.at(2 * Math.PI, 0)], tone: "result" },
        ...p.axes,
        ...chain(
          xs.map((x) => p.at(x, f(x))),
          "result",
        ),
        seg(p.at(0, 0.5), p.at(2 * Math.PI, 0.5), undefined, true),
        note(p.at(0, 0.5), "1/2", "w"),
        note(p.at(0, 1), "1", "w"),
        note(p.at(Math.PI, 0), "π", "s"),
        note(p.at(2 * Math.PI, 0), "2π", "s"),
        note(p.at(Math.PI, 1.12), "cos²θ", "n"),
        note(p.at(Math.PI, -0.3), "∫ = 2π · 1/2 = π", "s"),
      ],
      "The graph of cos²θ over a full period. It balances around the dashed level 1/2, the constant term of its Laurent polynomial, so the shaded area is 2π · 1/2 = π.",
      "cos²θ 在一个完整周期上的图像。它围绕虚线高度 1/2 平衡，1/2 是其洛朗多项式的常数项，所以阴影面积为 2π · 1/2 = π。",
    );
  })(),
};
