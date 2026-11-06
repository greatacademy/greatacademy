// Drawings in the explanations of Calculus I about optimization, Riemann sums and integrals. Each coordinate is computed from the function in the alt text.

import type { Figure } from "@ga/content";
import { area, bars, can, joined, lines, pane, slabs, sum, traps } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { bend, dotAt, drawing, graphed, note, on, ring, seg, wedge } from "./explanation-drawings-kit.ts";

const { PI: pi, sin, sqrt } = Math;
const hump = (x: number): number => 1 + (x * x) / 4;
const half = (x: number): number => (x * x) / 2;

/** calculusDrawings3 are the drawings in the explanations of optimization and integration in Calculus I, by topic and knowledge point. */
export const calculusDrawings3: Readonly<Record<string, Figure>> = {
  "solving-optimization-problems-using-derivatives#optimizing-fenced-areas": drawing(
    [
      seg([-1, 3], [7, 3], "action"),
      note([3, 3], "wall", "n"),
      seg([0, 3], [0, 0]),
      seg([0, 0], [6, 0]),
      seg([6, 0], [6, 3]),
      note([0, 1.5], "x = L/4", "w"),
      note([6, 1.5], "x = L/4", "e"),
      note([3, 0], "L − 2x = L/2", "s"),
      note([3, 1.5], "A = L²/8", "n"),
    ],
    "A rectangle against a wall with L m of fence on three sides: the best has sides x = L/4 perpendicular to the wall and L − 2x = L/2 along it, with area A = L²/8.",
    "靠墙的矩形，三边共用 L m 围栏：最佳尺寸是与墙垂直的边 x = L/4，平行于墙的边 L − 2x = L/2，面积 A = L²/8。",
  ),
  "solving-optimization-problems-using-derivatives#the-largest-rectangle-under-a-parabola": drawing(
    pane(0, [-4, 4, 2], [0, 12, 4], 8, 5)
      .under(() => 8, -2, 2)
      .path(
        [
          [-2, 0],
          [-2, 8],
          [2, 8],
          [2, 0],
        ],
        "result",
      )
      .f((x) => 12 - x * x)
      .dot(2, 8, "(2, 8)", "ne", "result")
      .say(0.9, 3, "A = 32", "n")
      .marks(),
    "For example, under y = 12 − x² a rectangle with right corner at x has area 2x(12 − x²), greatest at x = 2. Its width is 4, its height is 8 and its area is 32.",
    "例如，在 y = 12 − x² 下方，右上角在 x 处的矩形面积为 2x(12 − x²)，在 x = 2 时最大。此时宽 4、高 8，面积 32。",
  ),
  "optimization-problems-involving-sectors-of-circles#the-least-perimeter-for-a-given-area": drawing(
    [
      wedge(0, (2 * 180) / pi, 3, [0, 0], "result"),
      seg([0, 0], on(0, 3)),
      seg([0, 0], on((2 * 180) / pi, 3)),
      ...bend(0, (2 * 180) / pi, 3, [0, 0], "action"),
      note(on(0, 1.5), "r", "s"),
      note(on((2 * 180) / pi, 1.5), "r", "w"),
      note(on(57, 3), "arc 2r", "ne"),
      note(on(57, 0.5), "2 rad", "ne"),
    ],
    "The best sector for a given area A has radius r = √A and central angle 2 radians. Its arc is 2r, so its perimeter is r + r + 2r = 4r = 4√A.",
    "给定面积 A 时，最佳扇形的半径 r = √A，圆心角为 2 弧度。其弧长为 2r，所以周长为 r + r + 2r = 4r = 4√A。",
  ),
  "optimization-problems-involving-cylinders#closed-cylinders": drawing(
    [...can(1.5, 3), seg([0, 3], [1.5, 3], "action"), note([0.75, 3], "r", "n"), note([1.5, 1.5], "h = 2r", "e")],
    "The closed can of least surface area has h = 2r: its height equals its width, the diameter.",
    "表面积最小的有盖圆柱满足 h = 2r：高等于宽，即直径。",
  ),
  "optimization-problems-involving-cylinders#open-cylinders": drawing(
    [...can(2, 2, [0, 0], false), seg([0, 2], [2, 2], "action"), note([1, 2], "r", "n"), note([2, 1], "h = r", "e")],
    "The can without a lid of least surface area has h = r: its height equals its radius.",
    "表面积最小的无盖圆柱满足 h = r：高等于半径。",
  ),
  "optimizing-distances-to-curves#closest-points-on-parabolas": graphed(
    wide(-3, 3, -1, 4),
    [
      curveOf((x) => x * x, undefined, -2, 2),
      joined(
        [
          [0, 2],
          [sqrt(1.5), 1.5],
        ],
        "action",
      ),
      joined(
        [
          [0, 2],
          [-sqrt(1.5), 1.5],
        ],
        "action",
      ),
      joined(
        [
          [0, 2],
          [0, 0],
        ],
        "result",
        true,
      ),
      pt([0, 2], "(0, 2)", "ne"),
      bare([sqrt(1.5), 1.5], "action"),
      bare([-sqrt(1.5), 1.5], "action"),
      bare([0, 0], "result"),
      tag([sqrt(1.5) + 0.2, 1.5], "x² = 3/2", "e"),
    ],
    "For example, b = 2: the closest points of y = x² to (0, 2) have x² = 2 − 1/2 = 3/2, with D² = 3/2 + 1/4 = 7/4. The vertex x = 0 has D² = 4, a local maximum of D².",
    "例如，b = 2：y = x² 上离 (0, 2) 最近的点满足 x² = 2 − 1/2 = 3/2，此时 D² = 3/2 + 1/4 = 7/4。顶点 x = 0 处 D² = 4，是 D² 的局部最大值。",
  ),
  "optimizing-distances-to-curves#the-least-distance-and-an-endpoint-trap": graphed(
    wide(-2, 4, -1, 3),
    [
      curveOf((x) => sqrt(2 * x), undefined, 0, 4),
      pt([0.5, 0], "(1/2, 0)", "se", "action"),
      pt([0, 0], "closest", "nw", "result"),
      tag([1.6, 2.4], "y = √(2x)", "n"),
    ],
    "For example, y = √(2x) and the point (1/2, 0): D² = (x − 1/2)² + 2x has its vertex at x = −1/2, which is off the curve. So D² grows for all x ≥ 0 and the closest point is the endpoint (0, 0).",
    "例如，y = √(2x) 和点 (1/2, 0)：D² = (x − 1/2)² + 2x 的顶点在 x = −1/2，不在曲线上。所以 x ≥ 0 时 D² 一直增大，最近点是端点 (0, 0)。",
  ),
  "optimization-problems-with-inscribed-shapes#rectangles-under-parabolas": graphed(
    wide(-3, 3, -1, 4),
    [
      ...sum(() => 2, -1, 1, 1, "left"),
      curveOf((x) => 3 - x * x, undefined, -sqrt(3), sqrt(3)),
      pt([1, 2], "(1, 2)", "ne", "action"),
      tag([0.5, 1], "A = 4", "n"),
    ],
    "For example, y = 3 − x²: H = 3 and k = 1 give x = √(3/3) = 1. The corners are (±1, 2), so the rectangle is 2 wide and 2 high, with area 4.",
    "例如，y = 3 − x²：H = 3、k = 1，得 x = √(3/3) = 1。顶角为 (±1, 2)，所以矩形宽 2、高 2，面积 4。",
  ),
  "optimization-problems-with-inscribed-shapes#rectangles-in-triangles-and-circles": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [6, 0],
          [0, 4],
        ],
      },
      {
        kind: "shade",
        points: [
          [0, 0],
          [3, 0],
          [3, 2],
          [0, 2],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [0, 0],
          [3, 0],
          [3, 2],
          [0, 2],
        ],
        tone: "result",
      },
      note([3, 0], "6", "s"),
      note([0, 2], "4", "w"),
      note([1.5, 0.8], "3 by 2", "n"),
      ring(3, [11, 2]),
      { kind: "shade", points: [on(45, 3, [11, 2]), on(135, 3, [11, 2]), on(225, 3, [11, 2]), on(315, 3, [11, 2])], tone: "result" },
      { kind: "polygon", points: [on(45, 3, [11, 2]), on(135, 3, [11, 2]), on(225, 3, [11, 2]), on(315, 3, [11, 2])], tone: "result" },
      seg([11, 2], on(45, 3, [11, 2]), "action"),
      note(on(45, 1.5, [11, 2]), "r = 3", "nw"),
    ],
    "For example, legs 6 and 4: the best rectangle has x = 6/2 = 3 and height 2, with area 6 · 4/4 = 6. In a circle of radius 3, the best rectangle is a square, with area 2 · 3² = 18.",
    "例如，直角边 6 和 4：最佳矩形 x = 6/2 = 3，高 2，面积 6 · 4/4 = 6。在半径 3 的圆中，最佳矩形是正方形，面积 2 · 3² = 18。",
  ),
  "optimization-problems-with-inscribed-shapes#the-largest-cylinder-in-a-cone": drawing(
    [
      {
        kind: "polygon",
        points: [
          [-3, 0],
          [3, 0],
          [0, 6],
        ],
      },
      {
        kind: "shade",
        points: [
          [-2, 0],
          [2, 0],
          [2, 2],
          [-2, 2],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [-2, 0],
          [2, 0],
          [2, 2],
          [-2, 2],
        ],
        tone: "result",
      },
      seg([0, 0], [0, 6], undefined, true),
      note([1, 0], "r = 2", "s"),
      note([2, 1], "h = 2", "w"),
      note([0, 6], "6", "n"),
      note([3, 0], "3", "se"),
      ...dotAt([2, 2], undefined, "n", "action"),
    ],
    "For example, a vertical slice of a cone with radius 3 and height 6: the corner on the side gives h = 6 − 2r, so V = πr²(6 − 2r), greatest at r = 2 and h = 2.",
    "例如，半径 3、高 6 的圆锥的竖直截面：侧边上的顶点给出 h = 6 − 2r，所以 V = πr²(6 − 2r)，在 r = 2、h = 2 时最大。",
  ),
  "optimization-problems-in-economics#the-price-that-maximizes-revenue": drawing(
    pane(0, [-10, 20, 5], [0, 1500, 500], 9, 5, "x", "R")
      .f((x) => (10 + x) * (100 - 5 * x))
      .path(
        [
          [5, 0],
          [5, 1125],
        ],
        "action",
        true,
      )
      .dot(-10, 0, undefined, "n", "action")
      .dot(20, 0, undefined, "n", "action")
      .dot(5, 1125, "(5, 1125)", "n", "result")
      .marks(),
    "For example, price 10 + x and sales 100 − 5x: the revenue is a downward parabola with roots x = −10 and x = 20. Its maximum is halfway between them, at x = 5, where R = 15 · 75 = 1125.",
    "例如，价格 10 + x，销量 100 − 5x：收入是开口向下的抛物线，根为 x = −10 和 x = 20。最大值在两根正中间 x = 5 处，R = 15 · 75 = 1125。",
  ),
  "newtons-method-for-optimizing-single-variable-functions#one-newton-step-on-a-quadratic": drawing(
    pane(0, [0, 6, 1], [0, 10, 2], 8, 5)
      .f((x) => (x - 2) ** 2 + 1)
      .dot(5, 10, "x₀ = 5", "w")
      .dot(2, 1, "x₁ = 2", "s", "result")
      .marks(),
    "For example, f = (x − 2)² + 1 from x₀ = 5: f′(5) = 6 and f″(5) = 2, so x₁ = 5 − 6/2 = 2, exactly the vertex, in one step.",
    "例如，f = (x − 2)² + 1，从 x₀ = 5 开始：f′(5) = 6，f″(5) = 2，所以 x₁ = 5 − 6/2 = 2，一步就恰好到达顶点。",
  ),
  "newtons-second-law#when-the-force-vanishes": drawing(
    pane(0, [0, 4, 1], [0, 5, 1], 8, 5, "t", "v")
      .f((t) => 4 * t - t * t)
      .dot(2, 4, "t = 2: a = 0, F = 0", "n", "result")
      .marks(),
    "For example, v = 4t − t² has a = 4 − 2t, which is 0 at t = 2. The net force vanishes there, at the peak of the velocity, where v is neither increasing nor decreasing.",
    "例如，v = 4t − t² 的 a = 4 − 2t，在 t = 2 时为 0。合力此时为零，正是速度的峰值，v 既不增加也不减少。",
  ),
  "newtons-second-law#the-rate-of-work-of-the-net-force": drawing(
    pane(0, [0, 3, 1], [0, 24, 8], 8, 5, "t", "")
      .f(() => 4, undefined, undefined, "action")
      .f((t) => 8 * t)
      .say(2.3, 4, "F = 4", "n")
      .say(2.3, 8 * 2.3, "P = 8t", "w")
      .marks(),
    "For example, m = 2 and s = t²: v = 2t and a = 2, so the force F = 4 is constant, yet the power P = Fv = 8t grows with time.",
    "例如，m = 2，s = t²：v = 2t，a = 2，所以力 F = 4 是常数，但功率 P = Fv = 8t 随时间增大。",
  ),
  "approximating-areas-with-the-right-riemann-sum#overestimates-and-underestimates": drawing(
    [
      ...bars(pane(0, [0, 4, 1], [0, 8, 2], 6, 5), half, 0, 4, 4, "left")
        .f(half)
        .say(2, -1.2, "left sum: under", "s")
        .marks(),
      ...bars(pane(9, [0, 4, 1], [0, 8, 2], 6, 5), half, 0, 4, 4, "right")
        .f(half)
        .say(2, -1.2, "right sum: over", "s")
        .marks(),
    ],
    "For example, y = x²/2 is increasing on [0, 4]. With 4 pieces, each left rectangle lies under the curve, an underestimate, and each right rectangle pokes above it, an overestimate.",
    "例如，y = x²/2 在 [0, 4] 上递增。分成 4 段时，每个左矩形都在曲线下方，偏小；每个右矩形都伸到曲线上方，偏大。",
  ),
  "approximating-areas-with-the-midpoint-riemann-sum#midpoint-sums-of-linear-functions-are-exact": graphed(
    wide(-1, 5, -1, 6),
    [
      ...sum((x) => x + 1, 0, 4, 2, "mid"),
      curveOf((x) => x + 1, undefined, 0, 4),
      bare([1, 2], "action"),
      bare([3, 4], "action"),
      tag([1, 1], "2 · 2", "n"),
      tag([3, 2], "4 · 2", "n"),
    ],
    "For example, y = x + 1 on [0, 4] with 2 pieces: the midpoint rectangles have heights 2 and 4 and width 2, so M = 12. The small triangle cut off above each midpoint matches the one left out, and the exact area is also 12.",
    "例如，y = x + 1 在 [0, 4] 上分成 2 段：中点矩形高 2 和 4，宽 2，所以 M = 12。每个中点处切掉的小三角形与缺少的小三角形相等，精确面积也是 12。",
  ),
  "approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-a-formula": drawing(
    slabs(pane(0, [0, 4, 1], [0, 8, 2], 8, 5), half, 0, 4, 4)
      .f(half, undefined, undefined, "action")
      .dot(1, 0.5, "0.5", "nw")
      .dot(2, 2, "2", "nw")
      .dot(3, 4.5, "4.5", "nw")
      .dot(4, 8, "8", "w")
      .marks(),
    "For example, y = x²/2 on [0, 4] with Δx = 1: T = (1/2)[0 + 2(0.5 + 2 + 4.5) + 8] = 11. The inner heights count twice, since each is shared by two trapezoids.",
    "例如，y = x²/2 在 [0, 4] 上，Δx = 1：T = (1/2)[0 + 2(0.5 + 2 + 4.5) + 8] = 11。内部高度计两次，因为每个都由两个梯形共用。",
  ),
  "approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-a-table": graphed(
    wide(-1, 7, -1, 7),
    [
      ...traps(
        lines([
          [0, 3],
          [2, 5],
          [4, 4],
          [6, 6],
        ]),
        0,
        6,
        3,
      ),
      pt([0, 3], "3", "se"),
      pt([2, 5], "5", "n"),
      pt([4, 4], "4", "n"),
      pt([6, 6], "6", "n"),
    ],
    "For example, a table with x = 0, 2, 4, 6 and f = 3, 5, 4, 6, so Δx = 2: T = (2/2)[3 + 2(5) + 2(4) + 6] = 27, the area of the 3 trapezoids.",
    "例如，表中 x = 0、2、4、6，f = 3、5、4、6，所以 Δx = 2：T = (2/2)[3 + 2(5) + 2(4) + 6] = 27，即 3 个梯形的面积。",
  ),
  "approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-the-left-sum": drawing(
    [
      ...bars(pane(0, [0, 4, 1], [0, 6, 2], 5, 5), hump, 0, 4, 4, "left")
        .f(hump)
        .say(2, -1, "L = 7.5", "s")
        .marks(),
      ...bars(pane(7.5, [0, 4, 1], [0, 6, 2], 5, 5), hump, 0, 4, 4, "right")
        .f(hump)
        .say(2, -1, "R = 11.5", "s")
        .marks(),
      ...slabs(pane(15, [0, 4, 1], [0, 6, 2], 5, 5), hump, 0, 4, 4)
        .f(hump, undefined, undefined, "action")
        .say(2, -1, "T = 9.5", "s")
        .marks(),
    ],
    "For example, y = 1 + x²/4 on [0, 4] with Δx = 1: L = 7.5 and R = 11.5, so T = (7.5 + 11.5)/2 = 9.5, which is also L + (1/2)(5 − 1).",
    "例如，y = 1 + x²/4 在 [0, 4] 上，Δx = 1：L = 7.5，R = 11.5，所以 T = (7.5 + 11.5)/2 = 9.5，也等于 L + (1/2)(5 − 1)。",
  ),
  "left-and-right-riemann-sums-in-sigma-notation#writing-left-and-right-sums": drawing(
    [
      ...bars(pane(0, [0, 4, 1], [0, 6, 2], 6, 5), hump, 0, 4, 4, "left")
        .f(hump)
        .say(2, -1, "left: i = 0 to 3", "s")
        .marks(),
      ...bars(pane(9, [0, 4, 1], [0, 6, 2], 6, 5), hump, 0, 4, 4, "right")
        .f(hump)
        .say(2, -1, "right: i = 1 to 4", "s")
        .marks(),
    ],
    "For example, y = 1 + x²/4 on [0, 4] with n = 4 and Δx = 1, so xᵢ = i. The left sum takes its heights at i = 0 to 3, and the right sum at i = 1 to 4.",
    "例如，y = 1 + x²/4 在 [0, 4] 上，n = 4，Δx = 1，所以 xᵢ = i。左和取 i = 0 到 3 处的高度，右和取 i = 1 到 4 处的高度。",
  ),
  "midpoint-and-trapezoidal-rules-in-sigma-notation#the-trapezoidal-rule-in-sigma-notation": drawing(
    slabs(pane(0, [0, 4, 1], [0, 6, 2], 8, 5), hump, 0, 4, 4)
      .f(hump, undefined, undefined, "action")
      .dot(0, 1, "×1", "ne")
      .dot(1, 1.25, "×2", "n")
      .dot(2, 2, "×2", "n")
      .dot(3, 3.25, "×2", "n")
      .dot(4, 5, "×1", "n")
      .marks(),
    "For example, y = 1 + x²/4 on [0, 4] with 4 trapezoids: the inner heights at x = 1, 2, 3 are each shared by two trapezoids and count twice, and the ends count once.",
    "例如，y = 1 + x²/4 在 [0, 4] 上分成 4 个梯形：x = 1、2、3 处的内部高度各由两个梯形共用，计两次；两端计一次。",
  ),
  "approximating-areas-under-graphs-of-composite-functions#overestimates-from-monotonicity-and-concavity": drawing(
    [
      ...bars(pane(0, [0, 3, 1], [0, 3, 1], 6, 5), (x) => sqrt(x + 1), 0, 3, 3, "right")
        .f((x) => sqrt(x + 1))
        .say(1.5, -0.6, "right sum: over", "s")
        .marks(),
      ...bars(pane(9, [0, 3, 1], [0, 3, 1], 6, 5), (x) => sqrt(x + 1), 0, 3, 3, "mid")
        .f((x) => sqrt(x + 1))
        .say(1.5, -0.6, "midpoint sum: over", "s")
        .marks(),
    ],
    "y = √(x + 1), here on [0, 3], is increasing and concave down. So the right sum overestimates, because of the increase, and the midpoint sum overestimates, because of the concavity.",
    "y = √(x + 1)（这里取 [0, 3]）递增且上凸。所以右和因递增而偏大，中点和因上凸而偏大。",
  ),
  "approximating-areas-under-graphs-of-composite-functions#ordering-the-midpoint-and-trapezoidal-estimates": drawing(
    [
      ...bars(pane(0, [0, 4, 2], [0, 6, 2], 6, 5), hump, 0, 4, 2, "mid")
        .f(hump)
        .say(2, -1, "M = 9", "s")
        .marks(),
      ...slabs(pane(9, [0, 4, 2], [0, 6, 2], 6, 5), hump, 0, 4, 2)
        .f(hump, undefined, undefined, "action")
        .say(2, -1, "T = 10", "s")
        .marks(),
    ],
    "For example, the concave-up y = 1 + x²/4 on [0, 4] with 2 pieces: M = 9, the exact area is 28/3 ≈ 9.33, and T = 10, so M < ∫f < T. The chords lie above the curve.",
    "例如，下凸的 y = 1 + x²/4 在 [0, 4] 上分成 2 段：M = 9，精确面积 28/3 ≈ 9.33，T = 10，所以 M < ∫f < T。弦在曲线上方。",
  ),
  "defining-definite-integrals-using-left-and-right-riemann-sums#reading-a-riemann-sum-from-its-rectangles": drawing(
    bars(pane(0, [0, 4, 1], [0, 6, 2], 8, 5), hump, 0, 4, 4, "left")
      .f(hump)
      .dot(0, 1, "1", "ne")
      .dot(1, 1.25, "1.25", "n")
      .dot(2, 2, "2", "n")
      .dot(3, 3.25, "3.25", "n")
      .marks(),
    "For example, the rectangles touch the graph at their left corners, so this is a left sum. Its heights are 1, 1.25, 2 and 3.25, with width 1, so its value is 7.5.",
    "例如，矩形的左上角接触图象，所以这是左和。高度为 1、1.25、2、3.25，宽为 1，所以值为 7.5。",
  ),
  "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions#trigonometric-integrals": graphed(
    wide(-1, 4, -1, 2),
    [area(sin, 0, pi / 3), curveOf(sin, undefined, -1, 4), tag([pi / 3, 0], "π/3", "s"), tag([0.7, 0.2], "1/2", "n")],
    "The shaded area under y = sin x from 0 to π/3 is −cos(π/3) − (−cos 0) = −1/2 + 1 = 1/2.",
    "y = sin x 下方从 0 到 π/3 的阴影面积为 −cos(π/3) − (−cos 0) = −1/2 + 1 = 1/2。",
  ),
  "the-sum-and-constant-multiple-rules-for-definite-integrals#integrals-with-a-constant-term": graphed(
    wide(-1, 6, -1, 7),
    [...sum(() => 5, 1, 4, 1, "left"), tag([2.5, 2.5], "5 · 3 = 15", "n"), tag([5, 5], "y = 5", "n")],
    "The constant 5 on [1, 4] gives a rectangle of height 5 and width 3, so its integral is 15.",
    "常数 5 在 [1, 4] 上形成高 5、宽 3 的矩形，所以积分为 15。",
  ),
  "properties-of-definite-integrals-involving-the-limits-of-integration#integrals-on-overlapping-intervals": drawing(
    [
      seg([-0.5, 0], [8.5, 0]),
      ...dotAt([0, 0], "a", "s"),
      ...dotAt([3, 0], "b", "s"),
      ...dotAt([5, 0], "c", "s"),
      ...dotAt([8, 0], "d", "s"),
      seg([0, 0.6], [5, 0.6], "action"),
      note([2.5, 0.6], "∫ from a to c", "n"),
      seg([3, -1.2], [8, -1.2], "result"),
      note([5.5, -1.2], "∫ from b to d", "s"),
      {
        kind: "shade",
        points: [
          [3, -1.2],
          [5, -1.2],
          [5, 0.6],
          [3, 0.6],
        ],
        tone: "result",
      },
      note([4, -0.6], "twice", "n"),
    ],
    "With a < b < c < d, the intervals [a, c] and [b, d] overlap on [b, c], which is counted twice in their sum. So the integral from a to d is the two integrals added, minus the integral from b to c.",
    "当 a < b < c < d 时，区间 [a, c] 和 [b, d] 在 [b, c] 上重叠，相加时计了两次。所以从 a 到 d 的积分等于两个积分之和减去从 b 到 c 的积分。",
  ),
  "the-area-bounded-by-a-curve-and-the-x-axis#the-area-cut-off-by-a-parabola": graphed(
    wide(-1, 6, -2, 4),
    [
      area((x) => (x - 1) * (4 - x), 1, 4),
      curveOf((x) => (x - 1) * (4 - x), undefined, 0.3, 4.7),
      bare([1, 0], "action"),
      bare([4, 0], "action"),
      tag([2.5, 0.7], "4.5", "n"),
    ],
    "For example, y = (x − 1)(4 − x) has k = 1 and roots r = 1 and s = 4, which are the limits. The area is 1 · 3³/6 = 9/2.",
    "例如，y = (x − 1)(4 − x) 中 k = 1，根 r = 1、s = 4 就是积分限。面积为 1 · 3³/6 = 9/2。",
  ),
  "evaluating-definite-integrals-using-symmetry#using-symmetry-with-known-integrals": drawing(
    [
      ...pane(0, [-2, 2, 2], [-2, 4, 2], 6, 5)
        .under((x) => 3 - (x * x) / 2, -2, 2)
        .f((x) => 3 - (x * x) / 2)
        .say(-1, 0.7, "P", "n")
        .say(1, 0.7, "P", "n")
        .say(0, -2.7, "even: 2P", "s")
        .marks(),
      ...pane(9, [-2, 2, 2], [-3, 3, 3], 6, 5)
        .under((x) => 1.5 * x, 0, 2)
        .under((x) => 1.5 * x, -2, 0, "action")
        .f((x) => 1.5 * x)
        .say(1.3, 0.3, "P", "n")
        .say(-1.3, -0.4, "−P", "s")
        .say(0, -3.7, "odd: 0", "s")
        .marks(),
    ],
    "For example, an even graph and an odd graph, with area P to the right of 0. For the even graph the two sides are equal, so the integral over [−a, a] is 2P. For the odd graph the sides are P and −P, so it is 0.",
    "例如，一个偶函数图象和一个奇函数图象，0 右侧面积都是 P。偶函数两侧相等，所以 [−a, a] 上的积分是 2P。奇函数两侧为 P 和 −P，所以积分为 0。",
  ),
  "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect#where-signed-areas-cancel": graphed(
    wide(-1, 5, -3, 3),
    [
      area((x) => x - 2, 0, 2, "action"),
      area((x) => x - 2, 2, 4),
      curveOf((x) => x - 2, undefined, -0.5, 4.5),
      tag([0.6, -0.6], "−2", "s"),
      tag([3.2, 0.4], "+2", "n"),
      pt([2, 0], "r = 2", "nw"),
    ],
    "For example, y = x − 2 from a = 0 to c = 4 crosses at r = 2, the midpoint. The triangles are congruent, with signed areas −2 and 2, so the integral is 0, while the total area is 4.",
    "例如，y = x − 2 从 a = 0 到 c = 4，在中点 r = 2 处穿过坐标轴。两个三角形全等，有向面积为 −2 和 2，所以积分为 0，而总面积为 4。",
  ),
  "calculating-the-definite-integral-of-a-function-given-its-graph#signed-areas-from-a-graph": graphed(
    wide(-1, 7, -3, 3),
    [
      area(() => 2, 0, 2),
      area((x) => 4 - x, 2, 4),
      area((x) => 4 - x, 4, 6, "action"),
      joined([
        [0, 2],
        [2, 2],
        [4, 0],
        [6, -2],
      ]),
      tag([1, 0.6], "+4", "n"),
      tag([2.7, 0.2], "+2", "n"),
      tag([5.2, -0.3], "−2", "s"),
    ],
    "For example, this graph has signed areas +4, +2 and −2 on [0, 2], [2, 4] and [4, 6], so its integral over [0, 6] is 4 + 2 − 2 = 4.",
    "例如，这个图象在 [0, 2]、[2, 4]、[4, 6] 上的有向面积为 +4、+2、−2，所以在 [0, 6] 上的积分为 4 + 2 − 2 = 4。",
  ),
  "calculating-the-definite-integral-of-a-function-given-its-graph#integrals-of-combinations-from-a-graph": drawing(
    [
      ...pane(0, [0, 4, 2], [-2, 8, 2], 6, 5)
        .under(
          lines([
            [0, 0],
            [2, 3],
            [4, 0],
          ]),
          0,
          4,
        )
        .path([
          [0, 0],
          [2, 3],
          [4, 0],
        ])
        .dot(2, 3, "(2, 3)", "n")
        .say(2, 0.6, "6", "n")
        .say(2, -2.6, "f", "s")
        .marks(),
      ...pane(9, [0, 4, 2], [-2, 8, 2], 6, 5)
        .path(
          [
            [0, -2],
            [2, 7],
            [4, -2],
          ],
          "action",
        )
        .dot(2, 7, "(2, 7)", "ne")
        .say(2, -2.6, "3f − 2: 18 − 8 = 10", "s")
        .marks(),
    ],
    "A graph of f with ∫₀⁴ f = 6, for example a triangle with base 4 and height 3. Then 3f − 2 runs from −2 up to 7 and back to −2, and its integral over [0, 4] is 3(6) − 2(4) = 10.",
    "∫₀⁴ f = 6 的 f 的图象，例如底 4、高 3 的三角形。此时 3f − 2 从 −2 升到 7 再回到 −2，它在 [0, 4] 上的积分为 3(6) − 2(4) = 10。",
  ),
  "calculating-the-definite-integral-of-a-function-given-its-graph#definite-integrals-from-symmetry": drawing(
    [
      ...pane(0, [-2, 2, 2], [-1, 4, 1], 6, 5)
        .under((x) => 4 - x * x, -2, 2)
        .f((x) => 4 - x * x)
        .say(0, -1.6, "even: sides equal", "s")
        .marks(),
      ...pane(9, [-2, 2, 2], [-4, 4, 4], 6, 5)
        .under((x) => x ** 3 / 2, 0, 2)
        .under((x) => x ** 3 / 2, -2, 0, "action")
        .f((x) => x ** 3 / 2)
        .say(0, -4.8, "odd: integral 0", "s")
        .marks(),
    ],
    "For example, the even y = 4 − x² has equal areas with the same sign on the two sides of the y-axis. The odd y = x³/2 has equal areas with opposite signs, so its integral over [−2, 2] is 0.",
    "例如，偶函数 y = 4 − x² 在 y 轴两侧面积相等、符号相同。奇函数 y = x³/2 两侧面积相等、符号相反，所以在 [−2, 2] 上的积分为 0。",
  ),
  "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph#net-change-from-a-graph": graphed(
    wide(-1, 6, -1, 7),
    [
      curveOf((x) => 2 + (x - 1) ** 2 / 3, undefined, 0, 5),
      pt([1, 2], "f(1) = 2", "se", "result"),
      pt([4, 5], "f(4) = 5", "w", "result"),
      joined(
        [
          [1, 2],
          [4, 2],
        ],
        "action",
        true,
      ),
      toward([4, 2], [4, 5], "action"),
      tag([4, 3.5], "3", "e"),
    ],
    "For example, this graph of f has f(1) = 2 and f(4) = 5, so the integral of f′ from 1 to 4 is 5 − 2 = 3, read from the two heights.",
    "例如，f 的图象上 f(1) = 2，f(4) = 5，所以 f′ 从 1 到 4 的积分是 5 − 2 = 3，由两个高度读出。",
  ),
  "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph#a-value-of-the-function-from-its-net-change": graphed(
    wide(-1, 6, -1, 7),
    [
      curveOf((x) => 2 + (x - 1) ** 2 / 3, undefined, 0, 5),
      pt([1, 2], "f(1) = 5 − 3 = 2", "se", "action"),
      pt([4, 5], "f(4) = 5", "w", "result"),
    ],
    "For example, the integral of f′ from 1 to 4 is 3 and f(4) = 5, the value at the upper limit. So the unknown f(1) is found by subtracting: f(1) = 5 − 3 = 2.",
    "例如，f′ 从 1 到 4 的积分是 3，f(4) = 5 是上限处的值。所以未知的 f(1) 要用减法求：f(1) = 5 − 3 = 2。",
  ),
  "the-integral-as-an-accumulation-function#accumulation-functions-from-a-graph": drawing(
    [
      ...pane(0, [0, 4, 1], [-2, 2, 1], 6, 5, "t", "f")
        .under((t) => 2 - t, 0, 2)
        .under((t) => 2 - t, 2, 4, "action")
        .f((t) => 2 - t)
        .say(0.5, 0.2, "+2", "n")
        .say(3.5, -0.55, "−2", "s")
        .marks(),
      ...pane(9, [0, 4, 1], [-2, 3, 1], 6, 5, "x", "g")
        .f((x) => 2 * x - (x * x) / 2)
        .dot(0, 0, undefined, "n")
        .dot(2, 2, "g(2) = 2", "n", "result")
        .dot(4, 0, undefined, "n")
        .marks(),
    ],
    "For example, f(t) = 2 − t and a = 0: g(x) = 2x − x²/2. g(0) = 0, g grows to g(2) = 2 while f > 0, and shrinks back to g(4) = 0 while f < 0.",
    "例如，f(t) = 2 − t，a = 0：g(x) = 2x − x²/2。g(0) = 0，f > 0 时 g 增长到 g(2) = 2，f < 0 时又减回 g(4) = 0。",
  ),
  "maximizing-a-function-using-the-graph-of-its-derivative#locating-the-absolute-maximum": drawing(
    [
      ...pane(0, [0, 6, 2], [-3, 4, 1], 6, 5, "x", "f′")
        .under(
          lines([
            [0, 3],
            [2, 0],
          ]),
          0,
          2,
        )
        .under(
          lines([
            [2, 0],
            [4, -2],
            [6, 0],
          ]),
          2,
          6,
          "action",
        )
        .path([
          [0, 3],
          [2, 0],
          [4, -2],
          [6, 0],
        ])
        .say(0.7, 0.3, "+3", "n")
        .say(4, -2.1, "area −4", "s")
        .marks(),
      ...pane(9, [0, 6, 2], [0, 5, 1], 6, 5, "x", "f")
        .f((x) => 1 + 3 * x - (3 * x * x) / 4, 0, 2)
        .f((x) => 4 - (x - 2) ** 2 / 2, 2, 4)
        .f((x) => (x - 6) ** 2 / 2, 4, 6)
        .dot(0, 1, "1", "e")
        .dot(2, 4, "max 4", "n", "result")
        .dot(6, 0, "0", "n")
        .marks(),
    ],
    "For example, with f(0) = 1, the areas under f′ give f(2) = 1 + 3 = 4 and f(6) = 4 − 4 = 0. Comparing 1, 4 and 0, the absolute maximum is 4, at x = 2.",
    "例如，f(0) = 1，由 f′ 下方的面积得 f(2) = 1 + 3 = 4，f(6) = 4 − 4 = 0。比较 1、4、0，绝对最大值是 x = 2 处的 4。",
  ),
  "maximizing-a-function-using-the-graph-of-its-derivative#the-absolute-maximum-from-areas-under-the-derivative": drawing(
    pane(0, [0, 5, 1], [-2, 4, 1], 9, 5, "x", "f′")
      .under(
        lines([
          [0, 2],
          [1, 0],
        ]),
        0,
        1,
      )
      .under(
        lines([
          [1, 0],
          [2, -1],
          [3, 0],
        ]),
        1,
        3,
        "action",
      )
      .under(
        lines([
          [3, 0],
          [5, 3],
        ]),
        3,
        5,
      )
      .path([
        [0, 2],
        [1, 0],
        [2, -1],
        [3, 0],
        [5, 3],
      ])
      .say(0.3, 0.3, "+1", "n")
      .say(2, -1, "−1", "s")
      .say(4.4, 0.3, "+3", "n")
      .marks(),
    "For example, with f(0) = 0: f(1) = 1, f(3) = 1 − 1 = 0 and f(5) = 0 + 3 = 3. The area gained after the dip is more than the area lost in it, so the right endpoint beats the interior peak, and the absolute maximum is 3.",
    "例如，f(0) = 0：f(1) = 1，f(3) = 1 − 1 = 0，f(5) = 0 + 3 = 3。下凹之后增加的面积大于其中失去的面积，所以右端点胜过内部的峰，绝对最大值是 3。",
  ),
  "minimizing-a-function-using-the-graph-of-its-derivative#locating-the-absolute-minimum": drawing(
    pane(0, [0, 6, 1], [-4, 3, 1], 9, 5, "x", "f′")
      .under(
        lines([
          [0, -3],
          [2, 0],
        ]),
        0,
        2,
        "action",
      )
      .under(
        lines([
          [2, 0],
          [4, 2],
          [6, 0],
        ]),
        2,
        6,
      )
      .path([
        [0, -3],
        [2, 0],
        [4, 2],
        [6, 0],
      ])
      .say(0.7, -0.5, "−3", "s")
      .say(4, 0.5, "+4", "n")
      .dot(2, 0, "min", "nw", "result")
      .marks(),
    "For example, with f(0) = 4, the areas under f′ give f(2) = 4 − 3 = 1 and f(6) = 1 + 4 = 5. Comparing 4, 1 and 5, the absolute minimum is 1, at x = 2, where f′ changes from negative to positive.",
    "例如，f(0) = 4，由 f′ 下方的面积得 f(2) = 4 − 3 = 1，f(6) = 1 + 4 = 5。比较 4、1、5，绝对最小值是 x = 2 处的 1，那里 f′ 由负变正。",
  ),
  "further-optimizing-functions-using-graphs-of-derivatives#local-extrema-from-the-graph-of-the-derivative": drawing(
    pane(0, [-4, 5, 1], [-6, 6, 2], 10, 5, "x", "f′")
      .f((x) => 0.08 * (x + 3) * x * (x - 3) ** 2, -3.4, 4.4)
      .dot(-3, 0, "max", "ne", "result")
      .dot(0, 0, "min", "nw", "action")
      .dot(3, 0)
      .say(3, -1.7, "neither", "s")
      .marks(),
    "For example, this f′ changes from positive to negative at x = −3, a local maximum of f, and from negative to positive at x = 0, a local minimum. At x = 3 it touches zero without changing sign, so that point is neither.",
    "例如，这个 f′ 在 x = −3 处由正变负，是 f 的局部最大值；在 x = 0 处由负变正，是局部最小值。在 x = 3 处与零相切而不变号，所以该点两者都不是。",
  ),
};
