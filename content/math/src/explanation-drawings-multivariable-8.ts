// Drawings in the explanations of Multivariable Calculus about motion, averages, charge, centers of mass, moments of inertia and joint densities.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, ring, seg, square } from "./explanation-drawings-kit.ts";
import { flat, type P3, scene } from "./explanation-drawings-multivariable-kit.ts";

const { sqrt } = Math;
const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const box = (x0: number, y0: number, x1: number, y1: number): Point[] => [...rect(x0, y0, x1, y1), [x0, y0]];

// A body with a center of mass, its dashed axis through it and a parallel dashed axis at each listed distance.
const axes = (ds: readonly number[], names: readonly string[]): Mark[] => [
  ring(1.2, [0, 0]),
  { kind: "dot", at: [0, 0] },
  seg([0, -2], [0, 2], undefined, true),
  ...ds.flatMap((d, i) => [
    seg([d, -2], [d, 2], "action", true),
    ...head([0, -1.7 - 0.5 * i], [d, -1.7 - 0.5 * i], "action"),
    note([d / 2, -1.7 - 0.5 * i], names[i] as string, "s"),
  ]),
];

/** multivariableDrawings8 holds the drawings of the Multivariable Calculus explanations about motion, averages, charge, centers of mass, moments of inertia and joint densities, by key. */
export const multivariableDrawings8: Readonly<Record<string, Figure>> = {
  "velocity-and-acceleration-as-functions-of-displacement#the-acceleration-when-speed-is-a-power-of-position": graphed(
    wide(-1, 6, -1, 9, 1, 1, "x", "v"),
    [
      curveOf((x) => x * x, undefined, 0, 2.9),
      curveOf((x) => 4 * x - 4, "action", 1.2, 3),
      pt([2, 4], "(2, 4)", "w"),
      tag([3, 7.2], "m = 4", "e"),
      tag([3.2, 3], "a = v · m", "e"),
      tag([3.2, 2], "= 4 · 4 = 16", "e"),
    ],
    "For example, v = x² at x = 2. The speed there is 4 and the slope of the velocity graph is 4, so the acceleration is the speed times the slope: a = 16.",
    "例如，v = x²，x = 2。此处速度为 4，速度图像的斜率为 4，所以加速度是速度乘斜率：a = 16。",
  ),
  "the-components-of-acceleration#the-normal-acceleration-from-the-total-and-tangential": drawing(
    [
      ...head([0, 0], [3, 0], "action"),
      ...head([3, 0], [3, 4], "action"),
      ...head([0, 0], [3, 4], "result"),
      square([3, 0], [0, 0], [3, 4]),
      note([1.5, 0], "aₜ = 3", "s"),
      note([3, 2], "aₙ = √(25 − 9) = 4", "e"),
      note([1.5, 2], "|a| = 5", "nw"),
    ],
    "For example, a total acceleration of size 5 and a rate of change of speed of 3. The two components are the perpendicular legs of a right triangle, so the normal part is √(25 − 9) = 4.",
    "例如，总加速度大小为 5，速率变化率为 3。两个分量是直角三角形互相垂直的两条直角边，所以法向部分为 √(25 − 9) = 4。",
  ),
  "circular-motion-about-the-origin#the-greatest-speed-a-force-can-hold-on-a-circle": graphed(
    wide(-3, 7, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      toward([2, 0], [0.5, 0], "action"),
      toward([2, 0], [2, 1.6], "result"),
      pt([2, 0], "", "n"),
      tag([1.2, 0], "F", "n"),
      tag([2.1, 1.6], "v", "e"),
      tag([3.2, 2], "mRω² ≤ 8", "e"),
      tag([3.2, 1.1], "ω = 2,  v = 4", "e"),
    ],
    "For example, m = 1 and R = 2, with an inward force of at most 8. Then 2ω² ≤ 8 gives the greatest angular speed ω = 2, and the speed v = Rω = 4. The inward force points to the center and the velocity along the circle.",
    "例如，m = 1，R = 2，向内的力至多为 8。于是 2ω² ≤ 8 给出最大角速度 ω = 2，速度 v = Rω = 4。向内的力指向圆心，速度沿圆周。",
  ),
  "circular-motion-about-the-origin#acceleration-on-a-drawn-circle": graphed(
    wide(-3, 7, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      toward([0, 2], [0, 0.3], "action"),
      toward([0, 2], [-1.5, 2], "result"),
      joined([
        [0, 0],
        [2, 0],
      ]),
      pt([0, 2], "", "n"),
      tag([1, 0], "R = 2", "n"),
      tag([-1.5, 2.1], "v = 3", "n"),
      tag([0.05, 1.1], "a", "e"),
      tag([3.2, 2], "a = v²/R = 9/2", "e"),
      tag([3.2, 1.1], "ω = v/R = 3/2", "e"),
    ],
    "For example, R = 2 and v = 3, moving counterclockwise. The acceleration points to the center with size v²/R = 9/2, and the angular speed is v/R = 3/2.",
    "例如，R = 2，v = 3，逆时针运动。加速度指向圆心，大小为 v²/R = 9/2，角速度为 v/R = 3/2。",
  ),
  "the-average-value-of-a-multivariable-function#calculating-average-values-over-planar-domains": graphed(
    wide(-1, 7, -1, 4),
    [
      shape(rect(0, 0, 4, 2)),
      joined(box(0, 0, 4, 2)),
      pt([2, 1], "(W/2, H/2)", "n"),
      tag([2.5, 3], "f = x + 2y", "n"),
      tag([5.5, 1.6], "2 + 2 = 4", "n"),
    ],
    "For example, f = x + 2y on [0, 4] × [0, 2]. The integral is 32 and the area is 8, so the average is a · W/2 + b · H/2 = 2 + 2 = 4. For this function, the average is its value at the center of the rectangle.",
    "例如，f = x + 2y，在 [0, 4] × [0, 2] 上。积分为 32，面积为 8，所以平均值为 a · W/2 + b · H/2 = 2 + 2 = 4。对这个函数，平均值就是它在矩形中心的值。",
  ),
  "the-average-value-of-a-multivariable-function#the-average-of-xy-over-a-right-triangle": graphed(
    wide(-1, 8, -1, 4),
    [
      shape([
        [0, 0],
        [4, 0],
        [0, 3],
      ]),
      joined([
        [0, 0],
        [4, 0],
        [0, 3],
        [0, 0],
      ]),
      pt([4 / 3, 1], "(a/3, b/3)", "ne"),
      tag([5.8, 3], "∬ xy dA = 6", "n"),
      tag([5.8, 2.2], "A = 6", "n"),
      tag([5.8, 1.4], "6/6 = 1 ≠ 4/3", "n"),
    ],
    "For example, legs a = 4 and b = 3. The integral is a²b²/24 = 6 and the area is 6, so the average of xy is ab/12 = 1. The averages of x and y are 4/3 and 1, whose product 4/3 is a different number.",
    "例如，直角边 a = 4，b = 3。积分为 a²b²/24 = 6，面积为 6，所以 xy 的平均值为 ab/12 = 1。x 和 y 的平均值为 4/3 和 1，其积 4/3 是另一个数。",
  ),
  "density-mass-and-charge-of-plane-laminas#charge-on-a-triangular-plate": graphed(
    wide(-1, 8, -1, 4),
    [
      shape([
        [0, 0],
        [3, 0],
        [3, 3],
      ]),
      joined([
        [0, 0],
        [3, 0],
        [3, 3],
        [0, 0],
      ]),
      { kind: "polygon", points: rect(1.85, 0, 2.15, 2), tone: "action" },
      tag([1.3, 1.3], "y = x", "nw"),
      tag([2.2, 0.5], "x", "e"),
      tag([5.5, 2.6], "∫₀ˣ x dy = x²", "n"),
      tag([5.5, 1.6], "∫₀³ x² dx = 9", "n"),
    ],
    "For example, σ = x (c = 1) and L = 3. The strip at x runs from y = 0 up to y = x, so the inner integral is x². Then cL³/3 = 9.",
    "例如，σ = x（c = 1），L = 3。x 处的窄条从 y = 0 到 y = x，所以内层积分为 x²。于是 cL³/3 = 9。",
  ),
  "density-mass-and-charge-of-plane-laminas#the-charge-on-a-disk-with-radial-density": graphed(
    wide(-3, 7, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      { kind: "circle", center: [0, 0], r: 1.2, tone: "action" },
      { kind: "circle", center: [0, 0], r: 1.4, tone: "action" },
      joined(
        [
          [0, 0],
          [1.2, 0],
        ],
        "action",
      ),
      tag([0.6, 0], "r", "n"),
      tag([3.2, 2], "dA = 2πr dr", "e"),
      tag([3.2, 1.1], "σ = r", "e"),
      tag([3.2, 0.3], "∫₀² r · 2πr dr", "e"),
      tag([3.2, -0.5], "= 16π/3", "e"),
    ],
    "For example, σ = r on a disk of radius 2. A thin ring at distance r has area 2πr dr, so the factor 2π comes from the angle and the extra r from the area element. The charge is 2π · 8/3 = 16π/3.",
    "例如，σ = r，半径 2 的圆盘。距离 r 处的细环面积为 2πr dr，所以因子 2π 来自角度，多出的 r 来自面积元。电荷为 2π · 8/3 = 16π/3。",
  ),
  "moments-and-center-of-mass#the-centroid-of-a-region-made-of-two-rectangles": graphed(
    wide(-1, 8, -1, 4),
    [
      shape(rect(0, 0, 4, 1)),
      shape(rect(0, 1, 1, 3)),
      joined([
        [0, 0],
        [4, 0],
        [4, 1],
        [1, 1],
        [1, 3],
        [0, 3],
        [0, 0],
      ]),
      pt([2, 0.5], "(2, ½)", "e"),
      pt([0.5, 2], "", "n"),
      tag([1.05, 2], "(½, 2)", "e"),
      { kind: "point", at: [1.5, 1], tone: "result" },
      tag([1.5, 1], "(3/2, 1)", "ne"),
      tag([5.8, 3], "A₁ = 4,  A₂ = 2", "n"),
      tag([5.8, 2.2], "(8 + 1)/6 = 3/2", "n"),
      tag([5.8, 1.4], "(2 + 4)/6 = 1", "n"),
    ],
    "For example, the rectangles [0, 4] × [0, 1] and [0, 1] × [1, 3], of areas 4 and 2 and with centers (2, ½) and (½, 2). The weighted averages by area are x̄ = 9/6 = 3/2 and ȳ = 6/6 = 1.",
    "例如，矩形 [0, 4] × [0, 1] 和 [0, 1] × [1, 3]，面积为 4 和 2，中心为 (2, ½) 和 (½, 2)。按面积的加权平均为 x̄ = 9/6 = 3/2，ȳ = 6/6 = 1。",
  ),
  "moments-and-centers-of-mass-of-plane-laminas#two-dimensional-center-of-mass-calculations": graphed(
    wide(-1, 6, -1, 4),
    [
      shape(rect(0, 0, 3, 2)),
      joined(box(0, 0, 3, 2)),
      joined(
        [
          [1.5, 0],
          [1.5, 2],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [2, 0],
          [2, 2],
        ],
        "action",
      ),
      tag([1.5, 2], "W/2", "n"),
      tag([2.1, 2.05], "x̄ = 2w", "ne"),
      tag([3, 1], "W = 3w", "e"),
      tag([3.5, 2], "ρ = cx", "e"),
    ],
    "With w = 1, so W = 3w as in the text. With density ρ = cx, the center of mass moves from the geometric center W/2, dashed, toward the denser side, to x̄ = (2/3)W = 2w.",
    "取 w = 1，所以如文中 W = 3w。密度 ρ = cx 时，质心从几何中心 W/2（虚线）移向密度较大的一侧，到 x̄ = (2/3)W = 2w。",
  ),
  "moments-and-centers-of-mass-of-plane-laminas#centroid-of-the-region-under-a-parabola": graphed(
    wide(-1, 6, -1, 5),
    [
      curveOf((x) => x * x, undefined, 0, 2),
      joined([
        [2, 0],
        [2, 4],
      ]),
      { kind: "polygon", points: rect(0.85, 0, 1.15, 1), tone: "action" },
      { kind: "point", at: [1, 0.5], tone: "action" },
      tag([1.2, 0.3], "f/2", "e"),
      { kind: "point", at: [1.5, 1.2], tone: "result" },
      tag([2.1, 1.2], "(3/2, 6/5)", "e"),
      tag([4, 4], "A = 8/3", "n"),
      tag([4, 3.2], "Mᵧ = 4", "n"),
      tag([4, 2.4], "Mₓ = 16/5", "n"),
    ],
    "For example, f = x² on [0, 2]. The area is 8/3, the moment about the y-axis is 4, and the moment about the x-axis is 16/5, because each strip has its own center at height f/2. So x̄ = 3/2 and ȳ = 6/5.",
    "例如，f = x²，在 [0, 2] 上。面积为 8/3，对 y 轴的矩为 4，对 x 轴的矩为 16/5，因为每个窄条的中心在高度 f/2 处。所以 x̄ = 3/2，ȳ = 6/5。",
  ),
  "moments-and-centers-of-mass-of-plane-laminas#the-center-of-mass-of-a-drawn-l-shape": graphed(
    wide(-1, 5, -3, 3),
    [
      shape(rect(0, 0, 4, 1)),
      shape(rect(0, 1, 1, 2)),
      joined([
        [0, 0],
        [4, 0],
        [4, 1],
        [1, 1],
        [1, 2],
        [0, 2],
        [0, 0],
      ]),
      pt([2, 0.5], "", "n"),
      pt([0.5, 1.5], "", "n"),
      joined(
        [
          [2, 0.5],
          [0.5, 1.5],
        ],
        undefined,
        true,
      ),
      { kind: "point", at: [1.7, 0.7], tone: "result" },
      tag([1.7, 0.7], "(1.7, 0.7)", "ne"),
      { kind: "point", at: [1.25, 1], open: true },
      tag([2, -1.2], "A₁ = 4,  A₂ = 1", "n"),
      tag([2, -2], "(8 + ½)/5 = 1.7", "n"),
      tag([2, -2.8], "(2 + 3/2)/5 = 0.7", "n"),
    ],
    "For example, rectangles of areas 4 and 1 with centers (2, ½) and (½, 3/2). The weighted average is (1.7, 0.7), near the larger piece. The plain average of the centers, the open point (1.25, 1) on the dashed segment, ignores the weights and is wrong.",
    "例如，面积为 4 和 1 的矩形，中心为 (2, ½) 和 (½, 3/2)。加权平均为 (1.7, 0.7)，靠近较大的部分。两中心的简单平均，即虚线段上的空心点 (1.25, 1)，忽略了权重，是错的。",
  ),
  "moments-of-inertia-of-laminas-about-the-coordinate-axes#evaluating-moments-of-inertia-about-axes": graphed(
    wide(-1, 7, -1, 4),
    [
      shape(rect(0, 0, 3, 2)),
      joined(box(0, 0, 3, 2)),
      { kind: "polygon", points: rect(0, 1.35, 3, 1.55), tone: "action" },
      toward([2.5, 0], [2.5, 1.35], "action"),
      tag([2.5, 0.7], "y", "e"),
      tag([3.05, 1.45], "y²", "e"),
      tag([5, 1.8], "Iₓ = W H³/3", "n"),
      tag([5, 1], "= 3 · 8/3 = 8", "n"),
    ],
    "For example, W = 3 and H = 2, with ρ = 1. A thin strip at height y is at distance y from the x-axis, so it is weighted by y². Then Iₓ = WH³/3 = 8.",
    "例如，W = 3，H = 2，ρ = 1。高度 y 处的窄条到 x 轴的距离为 y，所以权重为 y²。于是 Iₓ = WH³/3 = 8。",
  ),
  "moments-of-inertia-of-laminas-about-the-coordinate-axes#the-polar-moment-of-inertia": graphed(
    wide(-1, 7, -1, 4),
    [
      shape(rect(0, 0, 3, 2)),
      joined(box(0, 0, 3, 2)),
      joined(
        [
          [0, 0],
          [2, 1.3],
        ],
        "action",
      ),
      joined(
        [
          [2, 0],
          [2, 1.3],
        ],
        undefined,
        true,
      ),
      pt([2, 1.3], "(x, y)", "ne"),
      tag([0.9, 0.7], "r", "n"),
      tag([5, 2.6], "Iₓ = 8,  Iᵧ = 18", "n"),
      tag([5, 1.8], "I₀ = 8 + 18 = 26", "n"),
    ],
    "For example, W = 3 and H = 2 with ρ = 1. The squared distance from the origin is r² = x² + y², so I₀ = Iₓ + Iᵧ = 8 + 18 = 26.",
    "例如，W = 3，H = 2，ρ = 1。到原点距离的平方为 r² = x² + y²，所以 I₀ = Iₓ + Iᵧ = 8 + 18 = 26。",
  ),
  "moments-of-inertia-of-laminas-about-the-coordinate-axes#a-moment-of-inertia-of-a-drawn-rectangle": graphed(
    wide(-1, 7, -1, 4),
    [
      shape(rect(0, 0, 2, 3)),
      joined(box(0, 0, 2, 3)),
      tag([1, 0.05], "a = 2", "n"),
      tag([2, 1.5], "b = 3", "e"),
      tag([5, 2.6], "Iₓ = 2 · 27/3 = 18", "n"),
      tag([5, 1.8], "Iᵧ = 3 · 8/3 = 8", "n"),
    ],
    "For example, a = 2 and b = 3, with δ = 1. In Iₓ the side b across the x-axis is cubed, which gives 18. In Iᵧ the side a is cubed, which gives 8.",
    "例如，a = 2，b = 3，δ = 1。在 Iₓ 中，横跨 x 轴的边 b 取立方，得 18。在 Iᵧ 中，边 a 取立方，得 8。",
  ),
  "moments-of-inertia-of-laminas-about-other-axes#evaluating-moments-of-inertia-about-shifted-axes": drawing(
    [
      seg([0, 0], [6, 0], "result"),
      seg([0, -1.2], [0, 1.2], undefined, true),
      ...[1, 2, 3, 4, 5, 6].map((x) => seg([x, -0.12], [x, 0.12], "result")),
      note([3, -0.2], "L = 6ℓ", "s"),
      ...head([0, 0.6], [4, 0.6], "action"),
      note([2, 0.6], "x", "n"),
      note([3, 1.6], "∫₀ᴸ (M/L) x² dx = ML²/3 = 12Mℓ²", "n"),
    ],
    "A uniform rod of length L = 6ℓ, turning about the dashed axis through its end. A piece at distance x has mass (M/L) dx and is weighted by x², so I = ML²/3 = 12Mℓ².",
    "长度 L = 6ℓ 的均匀细杆，绕过其一端的虚线轴转动。距离 x 处的一小段质量为 (M/L) dx，权重为 x²，所以 I = ML²/3 = 12Mℓ²。",
  ),
  "moments-of-inertia-of-laminas-about-other-axes#moment-of-inertia-about-a-line-outside-the-lamina": graphed(
    wide(-1, 8, -2, 3),
    [
      shape(rect(0, 0, 3, 2)),
      joined(box(0, 0, 3, 2)),
      joined(
        [
          [-1, -1],
          [8, -1],
        ],
        "action",
        true,
      ),
      toward([1.2, -1], [1.2, 1.2], "action"),
      pt([1.2, 1.2], "", "n"),
      tag([1.25, 0.4], "y + d", "e"),
      tag([5.5, -1], "y = −d", "n"),
      tag([5.8, 2], "3(27 − 1)/3 = 26", "n"),
    ],
    "For example, W = 3, H = 2 and d = 1. The dashed line is y = −1, and a point at height y is at distance y + 1 from it. So I = W[(H + d)³ − d³]/3 = 3(27 − 1)/3 = 26.",
    "例如，W = 3，H = 2，d = 1。虚线为 y = −1，高度 y 处的点到它的距离为 y + 1。所以 I = W[(H + d)³ − d³]/3 = 3(27 − 1)/3 = 26。",
  ),
  "moments-of-inertia-of-laminas-about-other-axes#the-moment-of-inertia-of-a-rectangle-about-a-central-axis": graphed(
    wide(-1, 8, -1, 3),
    [
      shape(rect(0, 0, 3, 2)),
      joined(box(0, 0, 3, 2)),
      joined(
        [
          [-1, 1],
          [3.8, 1],
        ],
        "action",
        true,
      ),
      tag([3, 1.5], "h/2", "e"),
      tag([3, 0.5], "h/2", "e"),
      tag([1.5, 2], "w = 3", "n"),
      tag([5.8, 2.2], "ρwh³/12 = 2", "n"),
      tag([5.8, 1.2], "ρwh³/3 = 8", "n"),
    ],
    "For example, ρ = 1, w = 3 and h = 2. About the dashed axis through the center, the distance runs from −h/2 to h/2, and the moment is ρwh³/12 = 2, a quarter of the moment ρwh³/3 = 8 about an edge.",
    "例如，ρ = 1，w = 3，h = 2。绕过中心的虚线轴，距离从 −h/2 到 h/2，矩为 ρwh³/12 = 2，是绕一边的矩 ρwh³/3 = 8 的四分之一。",
  ),
  "calculating-the-radius-of-gyration-of-a-plane-lamina#determining-the-squared-radius-of-gyration": drawing(
    [
      ...flat(rect(0, 0, 4, 3)),
      seg([-0.8, sqrt(3)], [4.8, sqrt(3)], "action", true),
      ...head([4.4, 0], [4.4, sqrt(3)], "action"),
      note([4.4, 0.85], "k̄ = √3 h", "e"),
      seg([-0.6, 0], [4.8, 0]),
      note([0, 1.5], "H = 3h", "w"),
      note([2, -0.2], "k̄² = H²/3 = 3h²", "s"),
    ],
    "A uniform rectangle of height H = 3h about its base. The moment is Iₓ = MH²/3, so k̄² = H²/3 = 3h². The dashed line is at distance k̄ = √3 h from the base, where all the mass could sit for the same moment.",
    "高度 H = 3h 的均匀矩形，绕其底边。矩为 Iₓ = MH²/3，所以 k̄² = H²/3 = 3h²。虚线到底边的距离为 k̄ = √3 h，全部质量放在那里时矩相同。",
  ),
  "the-parallel-axis-theorem#applying-the-parallel-axis-theorem": drawing(
    [...axes([2], ["d = 2"]), note([3, 1.2], "I = Ic + Md²", "e"), note([3, 0.2], "= 2 + 3 · 4 = 14", "e")],
    "For example, a moment Ic = 2 about the axis through the center of mass, the point, with M = 3 and a parallel axis at distance d = 2. Then I = 2 + 3 · 4 = 14.",
    "例如，绕过质心（图中的点）的轴的矩 Ic = 2，M = 3，平行轴距离 d = 2。于是 I = 2 + 3 · 4 = 14。",
  ),
  "the-parallel-axis-theorem#moving-between-two-parallel-axes": drawing(
    [
      ...axes([1, 3], ["d₁", ""]),
      note([3, -2.1], "d₂ = 3", "s"),
      note([1, 2], "I₁ = 10", "n"),
      note([3, 2], "I₂ = 26", "n"),
      note([0, -2.9], "10 − 2 · 1 + 2 · 9 = 26", "s"),
    ],
    "For example, M = 2 and d₁ = 1, d₂ = 3, with I₁ = 10. First go back to the center of mass, then out again: I₂ = 10 − 2 · 1 + 2 · 9 = 26. Adding M(d₂ − d₁)² = 8 directly would give 18, which is wrong.",
    "例如，M = 2，d₁ = 1，d₂ = 3，I₁ = 10。先回到质心，再出去：I₂ = 10 − 2 · 1 + 2 · 9 = 26。直接加 M(d₂ − d₁)² = 8 会得 18，是错的。",
  ),
  "the-parallel-axis-theorem#the-mass-from-two-parallel-axes": drawing(
    [
      ...axes([1, 2], ["", ""]),
      note([1, 2], "I₁ = 5", "n"),
      note([2.3, 2.7], "I₂ = 14", "n"),
      note([3, 1], "14 − 5 = M(4 − 1)", "e"),
      note([3, 0], "M = 3", "e"),
      note([1, -2.1], "d₁ = 1,  d₂ = 2", "s"),
    ],
    "For example, axes at distances d₁ = 1 and d₂ = 2 from the center of mass, with moments 5 and 14. Subtracting removes the moment about the center: 14 − 5 = M(4 − 1), so M = 3.",
    "例如，到质心距离 d₁ = 1 和 d₂ = 2 的两轴，矩为 5 和 14。相减消去绕质心的矩：14 − 5 = M(4 − 1)，所以 M = 3。",
  ),
  "the-parallel-axis-theorem#the-parallel-axis-theorem-with-a-drawn-distance": drawing(
    [...axes([3], ["d = 3"]), note([4, 1.2], "I = 4 + 2 · 9", "e"), note([4, 0.2], "= 22", "e")],
    "For example, Ic = 4 about the axis through the center of mass and M = 2. The drawn distance between the axes is d = 3, so I = 4 + 2 · 9 = 22.",
    "例如，绕过质心的轴 Ic = 4，M = 2。图中两轴距离 d = 3，所以 I = 4 + 2 · 9 = 22。",
  ),
  "probability-density-functions-of-continuous-random-variables#normalizing-multivariable-probability-density-functions": (() => {
    const s = scene(1.3);
    const up = 1;
    const corner = (x: number, y: number, z: number): P3 => [x, y, z];
    return drawing(
      [
        ...s.axes(3, 4, 2),
        ...s.patch([corner(0, 0, up), corner(2, 0, up), corner(2, 3, up), corner(0, 3, up)]),
        ...s.line(corner(2, 0, 0), corner(2, 0, up)),
        ...s.line(corner(2, 3, 0), corner(2, 3, up)),
        ...s.line(corner(0, 3, 0), corner(0, 3, up)),
        ...s.line(corner(2, 0, 0), corner(2, 3, 0)),
        ...s.line(corner(0, 3, 0), corner(2, 3, 0)),
        ...s.say(corner(2, 0, 0), "a = 2", "se"),
        ...s.say(corner(0, 3, 0), "b = 3", "se"),
        note([3, 1.6], "C = 1/6", "e"),
      ],
      "For example, a = 2 and b = 3. The box over the rectangle has base area 6 and height C, drawn taller than to scale. Its volume must be 1, so C = 1/6.",
      "例如，a = 2，b = 3。矩形上的长方体底面积为 6，高为 C，画得比实际高。其体积必须为 1，所以 C = 1/6。",
    );
  })(),
  "probability-density-functions-of-continuous-random-variables#normalizing-a-non-uniform-joint-density": (() => {
    const s = scene(1.5);
    return drawing(
      [
        ...s.axes(3, 3, 2),
        ...s.mesh((x, y) => [x, y, (x * y) / 4], [0, 2, 4], [0, 2, 4]),
        note([3, 1.6], "(a²/2)(b²/2) = 4", "e"),
        note([3, 0.8], "C = 1/4", "e"),
      ],
      "For example, g = xy on [0, 2] × [0, 2]. The double integral factors as (4/2)(4/2) = 4, so C = 1/4 and the surface z = xy/4, drawn here, encloses volume 1.",
      "例如，g = xy，在 [0, 2] × [0, 2] 上。二重积分分解为 (4/2)(4/2) = 4，所以 C = 1/4，图中曲面 z = xy/4 围成的体积为 1。",
    );
  })(),
  "probability-density-functions-of-continuous-random-variables#an-expected-coordinate-from-a-joint-density": drawing(
    pane(0, [0, 4, 1], [0, 1, 0.5], 7, 4, "x", "f")
      .under((x) => (2 * x) / 9, 0, 3)
      .f((x) => (2 * x) / 9, 0, 3)
      .path([
        [3, 0],
        [3, 2 / 3],
      ])
      .wall(2)
      .say(2, 0.8, "E[X] = 2", "n")
      .say(1.4, 0.45, "2x/9", "nw")
      .marks(),
    "For example, a = 3. A density proportional to xy gives X the density 2x/9 on [0, 3], and its mean, dashed, is two thirds of the way along, at 2.",
    "例如，a = 3。与 xy 成正比的密度使 X 的密度为 2x/9，在 [0, 3] 上，其均值（虚线）在三分之二处，即 2。",
  ),
  "probability-density-functions-of-continuous-random-variables#the-height-that-makes-a-density": drawing(
    [
      ...pane(0, [0, 4, 1], [0, 1, 0.5], 4, 3, "x", "f")
        .under(() => 0.25, 0, 4)
        .path([
          [0, 0.25],
          [4, 0.25],
          [4, 0],
        ])
        .say(2, 0.4, "4k = 1", "n")
        .say(2, -0.3, "k = 1/4", "s")
        .marks(),
      ...pane(6, [0, 4, 1], [0, 1, 0.5], 4, 3, "x", "f")
        .under((x) => (x <= 2 ? x / 4 : (4 - x) / 4), 0, 4)
        .path([
          [0, 0],
          [2, 0.5],
          [4, 0],
        ])
        .say(2, 0.6, "2k = 1", "n")
        .say(2, -0.3, "k = 1/2", "s")
        .marks(),
      ...pane(12, [0, 4, 1], [0, 1, 0.5], 4, 3, "x", "f")
        .under((x) => (x < 1 ? x / 3 : x <= 3 ? 1 / 3 : (4 - x) / 3), 0, 4)
        .path([
          [0, 0],
          [1, 1 / 3],
          [3, 1 / 3],
          [4, 0],
        ])
        .say(2, 0.5, "3k = 1", "n")
        .say(2, -0.3, "k = 1/3", "s")
        .marks(),
    ],
    "For example, three densities on [0, 4] with unknown height k. The rectangle has area 4k, so k = 1/4. The triangle has area 2k, so k = 1/2. The trapezoid with parallel sides 4 and 2 has area 3k, so k = 1/3.",
    "例如，[0, 4] 上三个高度 k 未知的密度。矩形面积 4k，所以 k = 1/4。三角形面积 2k，所以 k = 1/2。平行边为 4 和 2 的梯形面积 3k，所以 k = 1/3。",
  ),
  "calculating-probabilities-with-continuous-random-variables#probability-that-a-sum-is-small": graphed(
    wide(-1, 7, -1, 4),
    [
      joined(box(0, 0, 3, 3)),
      shape([
        [0, 0],
        [2, 0],
        [0, 2],
      ]),
      joined(
        [
          [2, 0],
          [0, 2],
        ],
        "action",
      ),
      tag([1, 1], "x + y = s", "ne"),
      tag([3.05, 1.5], "L = 3", "e"),
      tag([5.8, 2.5], "s = 2", "n"),
      tag([5.8, 1.7], "(4/2)/9 = 2/9", "n"),
    ],
    "For example, L = 3 and s = 2. The event X + Y ≤ 2 is the triangle with legs 2, of area 2, inside the square of area 9. The probability is s²/(2L²) = 2/9.",
    "例如，L = 3，s = 2。事件 X + Y ≤ 2 是直角边为 2 的三角形，面积 2，在面积 9 的正方形内。概率为 s²/(2L²) = 2/9。",
  ),
  "calculating-probabilities-with-continuous-random-variables#the-probability-that-one-uniform-variable-is-smaller": graphed(
    wide(-1, 7, -1, 4),
    [
      joined(box(0, 0, 2, 3)),
      shape([
        [0, 0],
        [2, 0],
        [2, 2],
      ]),
      joined(
        [
          [0, 0],
          [2, 2],
        ],
        "action",
      ),
      tag([1, 1], "y = x", "nw"),
      tag([5, 2.6], "1 − 2/6", "n"),
      tag([5, 1.8], "P(X < Y) = 2/3", "n"),
    ],
    "For example, X uniform on [0, 2] and Y uniform on [0, 3]. The line y = x cuts off a triangle of area 2 out of the rectangle of area 6, where Y < X. So P(X < Y) = 1 − 2/6 = 2/3.",
    "例如，X 在 [0, 2] 上均匀，Y 在 [0, 3] 上均匀。直线 y = x 从面积 6 的矩形中切出面积 2 的三角形，其中 Y < X。所以 P(X < Y) = 1 − 2/6 = 2/3。",
  ),
  "calculating-probabilities-with-continuous-random-variables#a-probability-shaded-under-a-step-density": drawing(
    pane(0, [0, 6, 1], [0, 0.4, 0.2], 7, 4, "x", "f")
      .path([
        [0, 0.1],
        [2, 0.1],
        [2, 0.3],
        [4, 0.3],
        [4, 0.1],
        [6, 0.1],
      ])
      .under(() => 0.1, 1, 2)
      .under(() => 0.3, 2, 3)
      .say(5, 0.1, "0.1", "n")
      .say(3.4, 0.3, "0.3", "n")
      .say(3.5, 0.38, "0.1 · 1 + 0.3 · 1 = 0.4", "n")
      .marks(),
    "For example, a density of heights 0.1, 0.3, 0.1 on [0, 2], [2, 4], [4, 6], with total area 1. The probability of 1 ≤ X ≤ 3 is the shaded area, 0.1 · 1 + 0.3 · 1 = 0.4.",
    "例如，密度在 [0, 2]、[2, 4]、[4, 6] 上高度为 0.1、0.3、0.1，总面积为 1。1 ≤ X ≤ 3 的概率是阴影面积，0.1 · 1 + 0.3 · 1 = 0.4。",
  ),
  "joint-distributions-for-continuous-random-variables#a-marginal-density-of-a-uniform-triangle": graphed(
    wide(-1, 7, -1, 3),
    [
      shape([
        [0, 0],
        [2, 0],
        [0, 2],
      ]),
      joined([
        [0, 0],
        [2, 0],
        [0, 2],
        [0, 0],
      ]),
      joined(
        [
          [1, 0],
          [1, 1],
        ],
        "action",
      ),
      tag([1, 0], "x", "s"),
      tag([1.05, 1.05], "2 − x", "ne"),
      tag([4.5, 2], "f = 1/2", "n"),
      tag([4.5, 1.2], "(1/2)(2 − x)", "n"),
    ],
    "For example, the triangle with vertices (0, 0), (2, 0), (0, 2), of area 2, so the joint density is 1/2. The vertical slice at x has length 2 − x, and the marginal is (1/2)(2 − x), which shrinks with x.",
    "例如，顶点为 (0, 0)、(2, 0)、(0, 2) 的三角形，面积 2，所以联合密度为 1/2。x 处竖直切片长度为 2 − x，边缘密度为 (1/2)(2 − x)，随 x 减小。",
  ),
  "joint-distributions-for-continuous-random-variables#a-joint-probability-from-a-shaded-rectangle": graphed(
    wide(-1, 8, -1, 3),
    [
      joined(box(0, 0, 4, 2)),
      shape([
        [0, 0],
        [2, 0],
        [0, 2],
      ]),
      joined(
        [
          [2, 0],
          [0, 2],
        ],
        "action",
      ),
      tag([0.6, 0.6], "2", "n"),
      tag([2, 2], "8", "n"),
      tag([6, 1.2], "2/8 = 1/4", "n"),
    ],
    "For example, a pair uniform on [0, 4] × [0, 2], of area 8, so the joint density is 1/8. The corner triangle with legs 2 has area 2, so its probability is 2/8 = 1/4.",
    "例如，在 [0, 4] × [0, 2] 上均匀，面积 8，所以联合密度为 1/8。直角边为 2 的角上三角形面积为 2，所以其概率为 2/8 = 1/4。",
  ),
};
