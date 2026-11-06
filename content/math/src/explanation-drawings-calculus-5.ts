// Drawings in the explanations of Calculus II about motion, parametric and polar curves, series and differential equations, and of the calculator topics of AP Calculus. Each coordinate is computed from the function in the alt text.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import {
  area,
  bars,
  count,
  field,
  head,
  hoop,
  joined,
  lines,
  pane,
  polarBand,
  polarPts,
  sector,
  tangent,
} from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { across, bare, upright, wide } from "./explanation-drawings-curves.ts";
import { pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import { dotAt, drawing, graphed, note, ring, seg } from "./explanation-drawings-kit.ts";

const { PI: pi, cos, exp, sin, sqrt } = Math;
const params = (x: (t: number) => number, y: (t: number) => number, a: number, b: number, n = 120): Point[] =>
  count(0, n).map((i): Point => [x(a + ((b - a) * i) / n), y(a + ((b - a) * i) / n)]);
const ray = (angle: number, r: number, tone: "action" | "result" = "action") =>
  joined(
    [
      [0, 0],
      [r * cos(angle), r * sin(angle)],
    ],
    tone,
    true,
  );
const polarPanel = (r: (t: number) => number, a: number, b: number, size: number, shaded = true): Mark[] => [
  seg([-size, 0], [size, 0]),
  seg([0, -size], [0, size]),
  ...(shaded ? [{ kind: "shade", points: [[0, 0] as Point, ...polarPts(r, a, b)], tone: "result" } as Mark] : []),
  ...chain(polarPts(r, a, b), "result"),
];

/** calculusDrawings5 are the drawings in the explanations of motion, curves, series and differential equations in Calculus II and of the calculator topics of AP Calculus, by topic and knowledge point. */
export const calculusDrawings5: Readonly<Record<string, Figure>> = {
  "calculating-velocity-using-integration#velocity-at-a-given-time": drawing(
    pane(0, [0, 3, 1], [0, 18, 6], 8, 5, "t", "a")
      .under((t) => 6 * t, 0, 3)
      .f((t) => 6 * t)
      .dot(3, 18, "18", "w")
      .say(2.2, 3, "A = 27", "n")
      .marks(),
    "The acceleration a(t) = 6t on [0, 3] encloses a triangle with base 3 and height 18, of area 27. With v(0) = 2, this gives v(3) = 2 + 27 = 29 m/s.",
    "加速度 a(t) = 6t 在 [0, 3] 上围成底 3、高 18 的三角形，面积为 27。由 v(0) = 2 得 v(3) = 2 + 27 = 29 m/s。",
  ),
  "calculating-the-position-function-of-a-particle-using-integration#a-later-position-from-a-drawn-velocity-graph": graphed(
    wide(-1, 6, -1, 4, 1, 1, "t", "v"),
    [
      area(
        lines([
          [0, 2],
          [2, 2],
          [4, 0],
        ]),
        0,
        4,
      ),
      joined([
        [0, 2],
        [2, 2],
        [4, 0],
      ]),
      tag([1, 0.8], "+4", "n"),
      tag([2.7, 0.3], "+2", "n"),
    ],
    "For example, s(0) = 1 and this velocity graph, with signed areas +4 and +2 on [0, 4]. Then s(4) = 1 + 4 + 2 = 7.",
    "例如，s(0) = 1，速度图象在 [0, 4] 上的有向面积为 +4 和 +2。于是 s(4) = 1 + 4 + 2 = 7。",
  ),
  "calculating-the-displacement-of-a-particle-using-integration#displacement-from-a-drawn-velocity-graph": graphed(
    wide(-1, 6, -3, 3, 1, 1, "t", "v"),
    [
      area(
        lines([
          [0, 2],
          [2, 2],
          [3, 0],
        ]),
        0,
        3,
      ),
      area(
        lines([
          [3, 0],
          [5, -2],
        ]),
        3,
        5,
        "action",
      ),
      joined([
        [0, 2],
        [2, 2],
        [3, 0],
        [5, -2],
      ]),
      tag([1.3, 0.6], "+5", "n"),
      tag([4.1, -0.3], "−2", "s"),
    ],
    "For example, the area above the t-axis is 5 and the area below it is 2, which counts as negative. So the displacement is 5 − 2 = 3.",
    "例如，t 轴上方面积为 5，下方面积为 2，计为负。所以位移为 5 − 2 = 3。",
  ),
  "calculating-the-total-distance-traveled-by-a-particle#the-gap-between-distance-and-displacement": graphed(
    wide(-1, 7, -3, 4, 1, 1, "t", "v"),
    [
      area(
        lines([
          [0, 0],
          [2, 3],
          [4, 0],
        ]),
        0,
        4,
      ),
      area(
        lines([
          [4, 0],
          [5, -2],
          [6, 0],
        ]),
        4,
        6,
        "action",
      ),
      joined([
        [0, 0],
        [2, 3],
        [4, 0],
        [5, -2],
        [6, 0],
      ]),
      tag([2, 0.7], "6", "n"),
      tag([5, -0.5], "2", "s"),
    ],
    "For example, forward 6 and back 2: the distance is 6 + 2 = 8 and the displacement is 6 − 2 = 4. The gap is 4, twice the shorter leg 2.",
    "例如，前进 6，后退 2：路程为 6 + 2 = 8，位移为 6 − 2 = 4。差为 4，是较短一段 2 的两倍。",
  ),
  "calculating-the-total-distance-traveled-by-a-particle#total-distance-from-a-drawn-velocity-graph": graphed(
    wide(-1, 6, -3, 4, 1, 1, "t", "v"),
    [
      area((t) => 3 - t, 0, 3),
      area((t) => 3 - t, 3, 5, "action"),
      curveOf((t) => 3 - t, undefined, 0, 5),
      tag([0.9, 0.5], "4.5", "n"),
      tag([4.2, -0.3], "2", "s"),
    ],
    "For example, v = 3 − t on [0, 5] crosses the axis at t = 3 and splits into two triangles, of areas 4.5 and 2. Both count as positive, so the total distance is 6.5.",
    "例如，v = 3 − t 在 [0, 5] 上于 t = 3 处穿过坐标轴，分成面积为 4.5 和 2 的两个三角形。两者都计为正，所以总路程为 6.5。",
  ),
  "average-position-velocity-and-acceleration#average-velocity-from-a-drawn-velocity-graph": graphed(
    wide(-1, 7, -1, 5, 1, 1, "t", "v"),
    [
      area(
        lines([
          [0, 0],
          [2, 4],
          [6, 0],
        ]),
        0,
        6,
      ),
      joined([
        [0, 0],
        [2, 4],
        [6, 0],
      ]),
      joined(
        [
          [0, 2],
          [6, 2],
        ],
        "action",
        true,
      ),
      tag([2.5, 0.6], "A = 12", "n"),
      tag([6, 2], "ȳ = 2", "ne"),
    ],
    "For example, this velocity graph has area 12 on [0, 6], so the average is 12/6 = 2. The end heights are both 0, and their average, 0, is not the answer.",
    "例如，这个速度图象在 [0, 6] 上的面积为 12，所以平均值为 12/6 = 2。两端高度都是 0，它们的平均值 0 不是答案。",
  ),
  "calculating-tangent-and-normal-lines-with-parametric-equations#normal-lines-to-parametric-curves": graphed(
    wide(-2, 5, -2, 4),
    [
      joined(
        params(
          (t) => t * t,
          (t) => t,
          -1.3,
          2,
        ),
      ),
      tangent([1, 1], 0.5),
      tangent([1, 1], -2, "result"),
      pt([1, 1], "(1, 1)", "e"),
      tag([2.6, 2.6], "m = 1/2", "n"),
      tag([0.1, 3], "m = −2", "e"),
    ],
    "For example, x = t², y = t at t = 1, the point (1, 1). Here dx/dt = 2 and dy/dt = 1, so the tangent has slope 1/2 and the normal has slope −2/1 = −2.",
    "例如，x = t²，y = t，t = 1 时在点 (1, 1)。此处 dx/dt = 2，dy/dt = 1，所以切线斜率为 1/2，法线斜率为 −2/1 = −2。",
  ),
  "the-arc-length-of-a-parametric-curve#arc-length-with-a-perfect-square-speed": graphed(
    wide(-2, 7, -1, 10),
    [
      joined(
        params(
          (t) => t ** 3 / 3 - t,
          (t) => t * t,
          0,
          3,
        ),
        "result",
      ),
      pt([0, 0], "t = 0", "ne"),
      pt([6, 9], "t = 3", "w"),
      tag([3.2, 4], "L = 12", "e"),
    ],
    "The curve x = t³/3 − t, y = t² from t = 0 at (0, 0) to t = 3 at (6, 9). The speed is t² + 1, so L = ∫₀³ (t² + 1) dt = 12.",
    "曲线 x = t³/3 − t，y = t²，从 t = 0 的 (0, 0) 到 t = 3 的 (6, 9)。速率为 t² + 1，所以 L = ∫₀³ (t² + 1) dt = 12。",
  ),
  "the-arc-length-of-a-parametric-curve#exact-arc-lengths": graphed(
    wide(-2, 4, -2, 4),
    [
      { kind: "circle", center: [1, 1], r: 2 },
      joined(
        params(
          (t) => 2 * cos(t) + 1,
          (t) => 2 * sin(t) + 1,
          0,
          pi / 2,
        ),
        "result",
      ),
      bare([1, 1]),
      joined(
        [
          [1, 1],
          [3, 1],
        ],
        "action",
        true,
      ),
      joined(
        [
          [1, 1],
          [1, 3],
        ],
        "action",
        true,
      ),
      tag([2.1, 1], "r = 2", "s"),
      tag([2.5, 2.5], "2 · π/2 = π", "ne"),
    ],
    "For example, r = 2, h = 1, k = 1: the circle x = 2cos t + 1, y = 2sin t + 1 has constant speed 2. The arc for 0 ≤ t ≤ π/2 has length 2 · π/2 = π.",
    "例如，r = 2，h = 1，k = 1：圆 x = 2cos t + 1，y = 2sin t + 1 的速率恒为 2。0 ≤ t ≤ π/2 的弧长为 2 · π/2 = π。",
  ),
  "the-arc-length-of-a-parametric-curve#the-length-of-a-drawn-arc-traced-parametrically": graphed(
    wide(-4, 4, -1, 4),
    [
      { kind: "circle", center: [0, 0], r: 3 },
      joined(
        params(
          (t) => 3 * cos(t),
          (t) => 3 * sin(t),
          0,
          (2 * pi) / 3,
        ),
        "result",
      ),
      ray((2 * pi) / 3, 3),
      ray(0, 3),
      tag([0.4, 0], "2π/3", "ne"),
      tag([2.4, 2.1], "3 · 2π/3 = 2π", "ne"),
    ],
    "For example, R = 3 and t from 0 to 2π/3: the integrand is the constant 3, so the length is 3 · 2π/3 = 2π.",
    "例如，R = 3，t 从 0 到 2π/3：被积函数是常数 3，所以长度为 3 · 2π/3 = 2π。",
  ),
  "calculating-areas-bounded-by-parametric-functions#the-area-inside-an-astroid": graphed(
    wide(-3, 3, -3, 3),
    [
      shape(
        [
          [0, 0],
          ...params(
            (t) => 2 * cos(t) ** 3,
            (t) => 2 * sin(t) ** 3,
            0,
            pi / 2,
          ),
        ],
        "result",
      ),
      joined(
        params(
          (t) => 2 * cos(t) ** 3,
          (t) => 2 * sin(t) ** 3,
          0,
          2 * pi,
          240,
        ),
      ),
      toward([1, 1], [0.4, 0.4], "result"),
      tag([1, 1], "3π/8", "ne"),
    ],
    "For example, the astroid x = 2cos³t, y = 2sin³t. One quarter, where the integrand has a single sign, has area 3π/8, so the whole region has area 4 · 3π/8 = 3π/2.",
    "例如，星形线 x = 2cos³t，y = 2sin³t。被积函数符号不变的四分之一部分面积为 3π/8，所以整个区域面积为 4 · 3π/8 = 3π/2。",
  ),
  "calculating-areas-bounded-by-parametric-functions#the-area-inside-a-drawn-parametric-ellipse": graphed(
    wide(-4, 4, -3, 3),
    [
      shape(
        params(
          (t) => 3 * cos(t),
          (t) => 2 * sin(t),
          0,
          2 * pi,
        ),
        "result",
      ),
      joined(
        params(
          (t) => 3 * cos(t),
          (t) => 2 * sin(t),
          0,
          2 * pi,
        ),
      ),
      pt([3, 0], "a = 3", "ne"),
      pt([0, 2], "b = 2", "ne"),
      tag([-1.4, -0.9], "6π", "n"),
    ],
    "For example, x = 3cos t, y = 2sin t: a = 3 and b = 2, so the area is π · 3 · 2 = 6π.",
    "例如，x = 3cos t，y = 2sin t：a = 3，b = 2，所以面积为 π · 3 · 2 = 6π。",
  ),
  "surface-areas-of-revolution-for-parametric-curves#surfaces-from-polynomial-parametric-curves": graphed(
    wide(-1, 6, -5, 5),
    [
      joined(
        params(
          (t) => t * t,
          (t) => 2 * t,
          0,
          2,
        ),
        "result",
      ),
      joined(
        params(
          (t) => t * t,
          (t) => -2 * t,
          0,
          2,
        ),
        undefined,
        true,
      ),
      hoop([4, 0], 1.2, 4),
      hoop([1, 0], 0.6, 2, "action"),
      joined(
        [
          [1, 0],
          [1, 2],
        ],
        "action",
      ),
      tag([1.7, 0.9], "y = 2", "e"),
    ],
    "For example, x = t², y = 2t for 0 ≤ t ≤ 2, rotated about the x-axis. At t = 1 the band has radius y = 2 and arc length element √(4t² + 4) dt = 2√2 dt.",
    "例如，x = t²，y = 2t（0 ≤ t ≤ 2）绕 x 轴旋转。t = 1 处的带半径 y = 2，弧长元为 √(4t² + 4) dt = 2√2 dt。",
  ),
  "surface-areas-of-revolution-for-parametric-curves#zones-of-a-sphere": graphed(
    wide(-3, 3, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      joined(
        params(
          (t) => 2 * cos(t),
          (t) => 2 * sin(t),
          0,
          pi / 2,
        ),
        "result",
      ),
      hoop([0, 0], 0.6, 2, "action"),
      tag([1.5, 1.4], "t ∈ [0, π/2]", "ne"),
    ],
    "For example, r = 2 and β = π/2: rotating the arc about the x-axis gives S = 2π · 4 · (1 − cos(π/2)) = 8π, a hemisphere. With β = π it is the whole sphere, 16π = 4πr².",
    "例如，r = 2，β = π/2：弧绕 x 轴旋转得 S = 2π · 4 · (1 − cos(π/2)) = 8π，是半球面。β = π 时是整个球面，16π = 4πr²。",
  ),
  "differentiating-vector-valued-functions#derivatives-of-polynomial-vector-functions": graphed(
    wide(-1, 6, -1, 5),
    [
      joined(
        params(
          (t) => t ** 3,
          (t) => 2 * t,
          0,
          1.45,
        ),
      ),
      toward([1, 2], [4, 4], "action"),
      pt([1, 2], "(1, 2)", "nw"),
      tag([2.5, 3], "r′(1) = ⟨3, 2⟩", "nw"),
    ],
    "The curve r(t) = ⟨t³, 2t⟩ at t = 1 is at (1, 2). The derivative r′(1) = ⟨3, 2⟩ is drawn from that point: it is tangent to the curve and points in the direction of motion.",
    "曲线 r(t) = ⟨t³, 2t⟩ 在 t = 1 时位于 (1, 2)。从该点画出导数 r′(1) = ⟨3, 2⟩：它与曲线相切，指向运动方向。",
  ),
  "calculating-velocity-for-plane-motion-using-differentiation#velocity-vectors-from-position": graphed(
    wide(-2, 18, -2, 18, 2),
    [
      joined(
        params(
          (t) => t * t,
          (t) => 4 * t,
          0,
          4,
        ),
      ),
      toward([9, 12], [15, 16], "action"),
      pt([9, 12], "t = 3: (9, 12)", "nw"),
      tag([12.5, 13.8], "⟨6, 4⟩", "se"),
    ],
    "The path r(t) = ⟨t², 4t⟩ at t = 3 is at (9, 12). The velocity v(3) = ⟨6, 4⟩ is tangent to the path there, in the direction of motion.",
    "路径 r(t) = ⟨t², 4t⟩ 在 t = 3 时位于 (9, 12)。速度 v(3) = ⟨6, 4⟩ 在该处与路径相切，沿运动方向。",
  ),
  "calculating-acceleration-for-plane-motion-using-differentiation#uniform-circular-motion": graphed(
    wide(-4, 4, -4, 4),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      toward([sqrt(2), sqrt(2)], [0, 2 * sqrt(2)], "action"),
      toward([sqrt(2), sqrt(2)], [0, 0], "result"),
      bare([sqrt(2), sqrt(2)]),
      tag([0.7, 2.1], "v", "ne"),
      tag([0.7, 0.7], "a", "se"),
    ],
    "For example, R = 2 and ω = 1. The speed is the constant Rω = 2, and v is tangent to the circle. Yet a = −ω²r points to the center, with magnitude Rω² = 2.",
    "例如，R = 2，ω = 1。速率恒为 Rω = 2，v 与圆相切。但 a = −ω²r 指向圆心，大小为 Rω² = 2。",
  ),
  "calculating-acceleration-for-plane-motion-using-differentiation#speed-changes-from-the-dot-product": drawing(
    [
      ...head([0, 0], [3, 0], "action"),
      ...head([0, 0], [1.5, 1.5], "result"),
      note([3, 0], "v", "e"),
      note([1.5, 1.5], "a", "n"),
      note([1.5, -0.3], "v · a > 0", "s"),
      ...shift(
        [
          ...head([0, 0], [3, 0], "action"),
          ...head([0, 0], [-1.5, 1.5], "result"),
          note([3, 0], "v", "e"),
          note([-1.5, 1.5], "a", "n"),
          note([0.8, -0.3], "v · a < 0", "s"),
        ],
        7.5,
      ),
      ...shift(
        [
          ...head([0, 0], [3, 0], "action"),
          ...head([0, 0], [0, 2], "result"),
          note([3, 0], "v", "e"),
          note([0, 2], "a", "n"),
          note([1.3, -0.3], "v · a = 0", "s"),
        ],
        14.5,
      ),
    ],
    "With a at an acute angle to v the dot product is positive and the particle speeds up. At an obtuse angle it is negative and the particle slows down. At a right angle it is zero and the acceleration only turns the particle.",
    "a 与 v 成锐角时点积为正，质点加速。成钝角时点积为负，质点减速。成直角时点积为零，加速度只使质点转向。",
  ),
  "applying-newtons-second-law-in-the-plane#force-vectors-from-position": graphed(
    wide(-1, 15, -1, 7, 2),
    [
      joined(
        params(
          (t) => t ** 3,
          (t) => t * t,
          0,
          1.2,
        ),
      ),
      toward([1, 1], [13, 5], "result"),
      toward([1, 1], [7, 3], "action"),
      bare([1, 1]),
      tag([1.7, 1.6], "(1, 1)", "n"),
      tag([5, 2.5], "a = ⟨6, 2⟩", "se"),
      tag([10, 4], "F = ⟨12, 4⟩", "se"),
    ],
    "For m = 2 and r(t) = ⟨t³, t²⟩ at t = 1, the point (1, 1): a(1) = ⟨6, 2⟩, and F = 2a = ⟨12, 4⟩ points the same way, twice as long.",
    "m = 2，r(t) = ⟨t³, t²⟩，t = 1 时在点 (1, 1)：a(1) = ⟨6, 2⟩，F = 2a = ⟨12, 4⟩ 方向相同，长度是两倍。",
  ),
  "differentiating-curves-given-in-polar-form#slopes-of-polar-curves": graphed(
    wide(-3, 4, -3, 4),
    [
      joined(polarPts((t) => 2 + cos(t), 0, 2 * pi)),
      tangent([0, 2], 0.5),
      pt([0, 2], "(0, 2)", "nw", "result"),
      tag([2.2, 3.1], "m = 1/2", "nw"),
    ],
    "For r = 2 + cos θ at θ = π/2, the point (0, 2): dy/dθ = −1 and dx/dθ = −2, so the tangent has slope 1/2. That is not dr/dθ, which is −1.",
    "r = 2 + cos θ 在 θ = π/2 处，即点 (0, 2)：dy/dθ = −1，dx/dθ = −2，所以切线斜率为 1/2。它不是 dr/dθ，后者为 −1。",
  ),
  "further-differentiation-of-curves-given-in-polar-form#slopes-at-odd-multiples-of-a-quarter-turn": graphed(
    wide(-5, 5, -5, 5),
    [
      joined(polarPts((t) => 3 + cos(2 * t), 0, 2 * pi)),
      tangent([3 * cos(pi / 4), 3 * sin(pi / 4)], -0.2),
      ray(pi / 4, 3),
      pt([3 * cos(pi / 4), 3 * sin(pi / 4)], "r = 3", "ne", "result"),
      tag([-1.8, 3.6], "m = −1/5", "n"),
    ],
    "For r = 3 + cos 2θ at θ = π/4: r = 3 and r′ = −2, so dy/dx = (−2 + 3)/(−2 − 3) = −1/5 after the common factor cancels.",
    "r = 3 + cos 2θ 在 θ = π/4 处：r = 3，r′ = −2，约去公因子后 dy/dx = (−2 + 3)/(−2 − 3) = −1/5。",
  ),
  "further-differentiation-of-curves-given-in-polar-form#slopes-of-logarithmic-spirals": graphed(
    wide(-6, 6, -3, 7),
    [
      joined(polarPts((t) => 0.2 * exp(2 * t), -1.5, 1.7)),
      tangent([0, 0.2 * exp(pi)], -2),
      pt([0, 0.2 * exp(pi)], "θ = π/2", "ne", "result"),
      tag([1.4, 1.8], "m = −2", "e"),
    ],
    "For example, r = 0.2e^(2θ), so k = 2. At θ = π/2 the radius cancels and dy/dx = (2 · 1 + 0)/(2 · 0 − 1) = −2.",
    "例如，r = 0.2e^(2θ)，所以 k = 2。在 θ = π/2 处半径约去，dy/dx = (2 · 1 + 0)/(2 · 0 − 1) = −2。",
  ),
  "horizontal-and-vertical-tangents-to-polar-curves#tangents-to-polar-circles": graphed(
    wide(-1, 5, -3, 3),
    [
      joined(polarPts((t) => 4 * cos(t), -pi / 2, pi / 2)),
      across(2, "action"),
      across(-2, "action"),
      ray(pi / 4, 2 * sqrt(2), "result"),
      ray(-pi / 4, 2 * sqrt(2), "result"),
      pt([2, 2], "(2, 2)", "ne"),
      pt([2, -2], "(2, −2)", "se"),
      tag([0.9, 0.4], "π/4", "e"),
    ],
    "On r = 4cos θ, y = 2sin 2θ, so dy/dθ = 4cos 2θ = 0 at θ = ±π/4. There r = 2√2, and the horizontal tangents touch at (2, ±2), the top and bottom of the circle of radius 2 centered at (2, 0).",
    "在 r = 4cos θ 上，y = 2sin 2θ，所以 dy/dθ = 4cos 2θ 在 θ = ±π/4 时为 0。此时 r = 2√2，水平切线切于 (2, ±2)，即以 (2, 0) 为圆心、半径 2 的圆的最高点和最低点。",
  ),
  "horizontal-and-vertical-tangents-to-polar-curves#dr-zero-does-not-mean-a-horizontal-tangent": graphed(
    wide(-4, 4, -4, 4),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      upright(2, "action"),
      across(2, "action"),
      tangent([sqrt(2), sqrt(2)], -1, "action", true),
      ray(0, 2, "result"),
      ray(pi / 4, 2, "result"),
      ray(pi / 2, 2, "result"),
      bare([2, 0]),
      bare([0, 2]),
      bare([sqrt(2), sqrt(2)]),
    ],
    "For example, r = 2 has r′ = 0 everywhere, so the tangent is perpendicular to the radius. It is vertical on the x-axis, horizontal on the y-axis and slanted in between, with slope −1 at θ = π/4.",
    "例如，r = 2 处处有 r′ = 0，所以切线垂直于半径。它在 x 轴上竖直，在 y 轴上水平，其间倾斜，在 θ = π/4 处斜率为 −1。",
  ),
  "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases#counting-the-tangent-lines-at-the-pole": graphed(
    wide(-4, 4, -4, 4),
    [
      joined(polarPts((t) => 3 * cos(2 * t), 0, 2 * pi, 320)),
      tangent([0, 0], 1, "action", true),
      tangent([0, 0], -1, "action", true),
      tag([2.5, 2.5], "θ = π/4", "se"),
      tag([-2.5, 2.5], "θ = 3π/4", "sw"),
    ],
    "For example, r = 3cos 2θ has n = 2 and 2n = 4 petals, but it passes through the pole only at θ = π/4 and θ = 3π/4 in [0, π). Larger angles repeat these lines, so there are 2 tangent lines.",
    "例如，r = 3cos 2θ 中 n = 2，有 2n = 4 个花瓣，但在 [0, π) 内只在 θ = π/4 和 θ = 3π/4 处过极点。更大的角重复这些直线，所以共有 2 条切线。",
  ),
  "finding-the-area-of-a-polar-region#areas-of-sectors-and-spirals": drawing(
    [
      ...polarPanel(() => 3, 0, pi / 2, 3.6),
      note([1.3, 1.1], "9π/4", "n"),
      note([0, -3.6], "r = 3, [0, π/2]", "s"),
      ...shift([...polarPanel((t) => t, 0, pi, 3.6), note([-1.1, 0.4], "π³/6", "n"), note([0, -3.6], "r = θ, [0, π]", "s")], 9),
    ],
    "A sector of r = 3 from 0 to π/2 has area (9/2)(π/2) = 9π/4. The region of the spiral r = θ from 0 to π has area (1/2)∫₀^π θ² dθ = π³/6.",
    "r = 3 从 0 到 π/2 的扇形面积为 (9/2)(π/2) = 9π/4。螺线 r = θ 从 0 到 π 围成的区域面积为 (1/2)∫₀^π θ² dθ = π³/6。",
  ),
  "finding-the-area-of-a-polar-region#areas-bounded-by-limacons": graphed(
    wide(-2, 4, -3, 3),
    [sector((t) => 2 + cos(t), 0, pi / 2), joined(polarPts((t) => 2 + cos(t), 0, 2 * pi)), tag([1.1, 0.7], "9π/8 + 2", "n")],
    "The limaçon r = 2 + cos θ with the part from 0 to π/2 shaded. Expanding r² and lowering the power of the cosine gives the area (1/2)(2π + 4 + π/4) = 9π/8 + 2.",
    "limaçon 曲线 r = 2 + cos θ，阴影为 0 到 π/2 的部分。展开 r² 并降低余弦的次数，得面积 (1/2)(2π + 4 + π/4) = 9π/8 + 2。",
  ),
  "finding-the-limits-of-integration-for-a-given-polar-region#the-limits-of-one-petal-from-a-drawing": graphed(
    wide(-4, 4, -4, 4),
    [
      sector((t) => 3 * cos(3 * t), -pi / 6, pi / 6),
      joined(polarPts((t) => 3 * cos(3 * t), 0, pi, 240)),
      ray(pi / 6, 3.4),
      ray(-pi / 6, 3.4),
      tag([3, 1.7], "π/6", "e"),
      tag([3, -1.7], "−π/6", "e"),
    ],
    "For example, r = 3cos 3θ, so k = 3. The radius is zero where 3θ is an odd multiple of a right angle, so the petal along the positive x-axis runs from −π/6 to π/6, not a full turn.",
    "例如，r = 3cos 3θ，所以 k = 3。3θ 是直角的奇数倍时半径为零，所以沿 x 轴正方向的花瓣从 −π/6 到 π/6，而不是一整圈。",
  ),
  "the-total-area-bounded-by-a-single-polar-curve#the-equation-of-a-drawn-polar-curve": drawing(
    [
      ...polarPanel((t) => 2 * cos(3 * t), 0, pi, 2.5, false),
      note([0, -2.5], "2cos 3θ: 3", "s"),
      ...shift([...polarPanel((t) => 2 * cos(2 * t), 0, 2 * pi, 2.5, false), note([0, -2.5], "2cos 2θ: 4", "s")], 8.5),
      ...shift([...polarPanel((t) => 1 + cos(t), 0, 2 * pi, 2.5, false), note([0, -2.5], "1 + cos θ", "s")], 17),
    ],
    "For example, r = 2cos 3θ, with the odd multiple 3 of the angle, has 3 petals, and r = 2cos 2θ, with the even multiple 2, has 2 · 2 = 4 petals. The cardioid r = 1 + cos θ has one dent at the origin and reaches farthest to the right, where its cosine term adds most.",
    "例如，r = 2cos 3θ 中角的倍数 3 是奇数，有 3 个花瓣；r = 2cos 2θ 中倍数 2 是偶数，有 2 · 2 = 4 个花瓣。心形线 r = 1 + cos θ 在原点有一个凹陷，向右伸得最远，那里余弦项加得最多。",
  ),
  "the-area-bounded-by-two-polar-curves#areas-between-two-circles": graphed(
    wide(-2, 3, -2, 2),
    [
      polarBand(
        (t) => 2 * cos(t),
        () => 1,
        -pi / 3,
        pi / 3,
      ),
      { kind: "circle", center: [1, 0], r: 1 },
      { kind: "circle", center: [0, 0], r: 1 },
      ray(pi / 3, 1.7),
      ray(-pi / 3, 1.7),
      tag([0.9, 1.5], "π/3", "ne"),
      tag([0.9, -1.5], "−π/3", "se"),
    ],
    "Inside r = 2cos θ and outside r = 1: the circles meet at θ = ±π/3, and between these rays the area is (1/2)∫(4cos²θ − 1) dθ = π/3 + √3/2.",
    "在 r = 2cos θ 内、r = 1 外：两圆在 θ = ±π/3 处相交，这两条射线之间的面积为 (1/2)∫(4cos²θ − 1) dθ = π/3 + √3/2。",
  ),
  "the-area-bounded-by-two-polar-curves#areas-between-a-cardioid-and-a-circle": graphed(
    wide(-2, 3, -2, 2),
    [
      polarBand(
        (t) => 1 + cos(t),
        () => 1,
        -pi / 2,
        pi / 2,
      ),
      joined(polarPts((t) => 1 + cos(t), 0, 2 * pi)),
      { kind: "circle", center: [0, 0], r: 1 },
      pt([0, 1], "π/2", "nw"),
      pt([0, -1], "−π/2", "sw"),
    ],
    "For example, a = 1: the cardioid r = 1 + cos θ and the circle r = 1 meet where cos θ = 0. The cardioid is outside the circle for −π/2 < θ < π/2, and the area between them there is 2 + π/4.",
    "例如，a = 1：心形线 r = 1 + cos θ 与圆 r = 1 在 cos θ = 0 处相交。−π/2 < θ < π/2 时心形线在圆外，其间面积为 2 + π/4。",
  ),
  "the-area-bounded-by-two-polar-curves#the-region-common-to-two-circles": graphed(
    wide(-2, 3, -1, 3),
    [
      sector((t) => 2 * sin(t), 0, pi / 4),
      sector((t) => 2 * cos(t), pi / 4, pi / 2),
      { kind: "circle", center: [1, 0], r: 1 },
      { kind: "circle", center: [0, 1], r: 1 },
      ray(pi / 4, sqrt(2)),
      pt([1, 1], "π/4", "ne"),
    ],
    "For example, a = 1: inside r = 2cos θ and r = 2sin θ. The circles meet at θ = π/4. The sine is the smaller on [0, π/4] and the cosine on [π/4, π/2], so the integral splits there.",
    "例如，a = 1：在 r = 2cos θ 和 r = 2sin θ 内部。两圆在 θ = π/4 处相交。在 [0, π/4] 上正弦较小，在 [π/4, π/2] 上余弦较小，所以积分在此处分开。",
  ),
  "the-area-bounded-by-two-polar-curves#the-area-between-two-drawn-polar-circles": graphed(
    wide(-3, 5, -3, 3),
    [
      polarBand(
        (t) => 4 * cos(t),
        () => 2,
        -pi / 3,
        pi / 3,
      ),
      { kind: "circle", center: [2, 0], r: 2 },
      { kind: "circle", center: [0, 0], r: 2 },
      ray(pi / 3, 2.6),
      ray(-pi / 3, 2.6),
      tag([1.3, 2.3], "π/3", "ne"),
      tag([1.3, -2.3], "−π/3", "se"),
      tag([2.5, 2.6], "r = 4cos θ", "e"),
    ],
    "For example, inside r = 4cos θ and outside r = 2. The rays θ = ±π/3 pass through the intersection points, and r = 4cos θ is the outer curve between them, so the area is (1/2)∫(16cos²θ − 4) dθ = 4π/3 + 2√3.",
    "例如，在 r = 4cos θ 内、r = 2 外。射线 θ = ±π/3 过交点，其间 r = 4cos θ 是外侧曲线，所以面积为 (1/2)∫(16cos²θ − 4) dθ = 4π/3 + 2√3。",
  ),
  "the-arc-length-of-a-polar-curve#arc-lengths-of-cardioids": graphed(
    wide(-1, 3, -2, 2),
    [
      joined(polarPts((t) => 1 + cos(t), 0, 2 * pi)),
      joined(
        polarPts((t) => 1 + cos(t), 0, pi),
        "result",
      ),
      tag([1.1, 1.1], "½: 4", "ne"),
    ],
    "The cardioid r = 1 + cos θ has integrand 2|cos(θ/2)|. The upper half, 0 to π, has length 4, so the whole cardioid has length 8.",
    "心形线 r = 1 + cos θ 的被积函数为 2|cos(θ/2)|。上半部分（0 到 π）长度为 4，所以整条心形线长度为 8。",
  ),
  "the-arc-length-of-a-polar-curve#arc-lengths-of-other-polar-curves": graphed(
    wide(-2, 3, -1, 3),
    [
      { kind: "circle", center: [0, 1], r: 1 },
      joined(
        polarPts((t) => 2 * sin(t), 0, pi / 2),
        "result",
      ),
      tag([1, 1], "2 · π/2 = π", "e"),
    ],
    "For example, a = 1: on r = 2sin θ, r² + r′² = 4, so the length is 2 times the change in θ. From θ = 0 to π/2 the point traces the right half of the circle, of length π.",
    "例如，a = 1：在 r = 2sin θ 上，r² + r′² = 4，所以长度是 θ 变化量的 2 倍。θ 从 0 到 π/2 时点走过圆的右半部分，长度为 π。",
  ),
  "the-arc-length-of-a-polar-curve#the-length-of-a-logarithmic-spiral": graphed(
    wide(-4, 4, -4, 4),
    [
      joined(polarPts((t) => exp(0.2 * t), 0, 2 * pi)),
      bare([1, 0], "action"),
      bare([exp(0.4 * pi), 0], "result"),
      tag([1, -0.55], "r = 1", "s"),
      tag([3.4, 0.2], "r ≈ 3.51", "n"),
    ],
    "For example, r = e^(θ/5), so k = 1/5. The length element is (√(1 + k²)/k) dr ≈ 5.10 dr, so from r = 1 to r ≈ 3.51 the length is about 5.10 · 2.51 ≈ 12.8. The angle never has to be found.",
    "例如，r = e^(θ/5)，所以 k = 1/5。长度元为 (√(1 + k²)/k) dr ≈ 5.10 dr，所以从 r = 1 到 r ≈ 3.51 的长度约为 5.10 · 2.51 ≈ 12.8。无需求出角度。",
  ),
  "the-arc-length-of-a-polar-curve#the-length-of-a-drawn-polar-arc": graphed(
    wide(-1, 5, -3, 3),
    [
      joined(polarPts((t) => 4 * cos(t), -pi / 2, pi / 2)),
      joined(
        polarPts((t) => 4 * cos(t), 0, pi / 4),
        "result",
      ),
      ray(pi / 4, 2 * sqrt(2)),
      pt([2, 2], "θ = π/4", "ne"),
      pt([4, 0], "θ = 0", "ne"),
    ],
    "For example, r = 4cos θ, so 2a = 4. For θ from 0 to π/4 the integrand is the constant 4, so the length is 4 · π/4 = π.",
    "例如，r = 4cos θ，所以 2a = 4。θ 从 0 到 π/4 时被积函数是常数 4，所以长度为 4 · π/4 = π。",
  ),
  "the-integral-test#evaluating-the-comparison-integral": drawing(
    bars(pane(0, [0, 6, 1], [0, 1, 0.25], 9, 5), (x) => 3 / (x + 1) ** 2, 1, 6, 5, "left")
      .f((x) => 3 / (x + 1) ** 2, 0.8, 6)
      .say(4.3, 0.4, "∫[1, ∞) = 3/2", "n")
      .marks(),
    "For a_n = 3/(n + 1)², the rectangles of width 1 from x = 1 lie over the graph of 3/(x + 1)². The integral from 1 to ∞ is 3/2, which is finite, so the series converges, though its sum is not 3/2.",
    "a_n = 3/(n + 1)² 时，从 x = 1 起宽为 1 的矩形位于 3/(x + 1)² 的图象上方。从 1 到 ∞ 的积分为 3/2，是有限值，所以级数收敛，但其和不是 3/2。",
  ),
  "the-integral-test#bounding-the-tail-with-an-integral": drawing(
    bars(pane(0, [0, 8, 1], [0, 0.2, 0.1], 9, 5), (x) => 1 / (x * x), 3, 8, 5, "right")
      .f((x) => 1 / (x * x), 2.3, 8)
      .dot(3, 1 / 9, "N = 3", "ne")
      .marks(),
    "For example, f = 1/x² and N = 3: the terms after N are rectangles under the curve from x = 3 on, so the tail is at most ∫₃^∞ dx/x² = 1/3. The lower limit is N, not N + 1.",
    "例如，f = 1/x²，N = 3：N 之后的项是从 x = 3 起位于曲线下方的矩形，所以余项至多为 ∫₃^∞ dx/x² = 1/3。下限是 N，不是 N + 1。",
  ),
  "the-integral-test#what-a-drawing-of-the-integral-test-shows": drawing(
    [
      ...bars(pane(0, [0, 6, 1], [0, 1, 1], 6, 5), (x) => 1 / (x * x), 1, 6, 5, "right")
        .f((x) => 1 / (x * x), 1, 6)
        .say(3, -0.25, "< 1/x²", "s")
        .marks(),
      ...bars(pane(9, [0, 6, 1], [0, 1, 1], 6, 5), (x) => 1 / x, 1, 6, 5, "left")
        .f((x) => 1 / x, 1, 6)
        .say(3, -0.25, "> 1/x", "s")
        .marks(),
    ],
    "For example, rectangles under 1/x², whose improper integral is finite, show that the series converges. Rectangles over 1/x, whose improper integral is infinite, show that it diverges. Rectangles over a finite integral or under an infinite one prove nothing.",
    "例如，矩形在 1/x² 下方，其反常积分有限，说明级数收敛。矩形在 1/x 上方，其反常积分无穷，说明级数发散。矩形在有限积分上方或在无穷积分下方都不能证明什么。",
  ),
  "the-remainder-estimate-for-the-integral-test#bounding-the-remainder": drawing(
    bars(pane(0, [10, 16, 1], [0, 0.01, 0.005], 9, 5), (x) => 1 / (x * x), 10, 16, 6, "right")
      .f((x) => 1 / (x * x))
      .say(14, 0.0065, "R₁₀ ≤ 1/10", "n")
      .marks(),
    "For the series of 1/n² and N = 10: the rectangles for the terms after n = 10 lie under y = 1/x² from x = 10 on, so R₁₀ ≤ ∫₁₀^∞ dx/x² = 1/10.",
    "级数 1/n²，N = 10：n = 10 之后各项的矩形从 x = 10 起位于 y = 1/x² 下方，所以 R₁₀ ≤ ∫₁₀^∞ dx/x² = 1/10。",
  ),
  "the-remainder-estimate-for-the-integral-test#a-remainder-bound-from-drawn-rectangles": drawing(
    bars(pane(0, [0, 8, 1], [0, 1, 0.25], 9, 5), (x) => 4 / (x * x), 2, 8, 6, "right")
      .f((x) => 4 / (x * x), 2, 8)
      .say(5.5, 0.3, "R₂ ≤ 2", "n")
      .marks(),
    "For example, f = 4/x² and N = 2: the rectangles for the terms after n = 2 lie under the curve from x = 2 onward, so R₂ ≤ ∫₂^∞ 4/x² dx = 2.",
    "例如，f = 4/x²，N = 2：n = 2 之后各项的矩形从 x = 2 起位于曲线下方，所以 R₂ ≤ ∫₂^∞ 4/x² dx = 2。",
  ),
  "second-degree-taylor-polynomials#a-taylor-polynomial-from-a-drawing": graphed(
    wide(-1, 5, -1, 5),
    [
      curveOf((x) => 2 + Math.log(x), undefined, 0.2, 5),
      curveOf((x) => 2 + (x - 1) - (x - 1) ** 2 / 2, "action", -0.3, 3, true),
      pt([1, 2], "(1, 2)", "nw", "result"),
      tag([3.5, 3.35], "y = 2 + ln x", "n"),
    ],
    "For example, y = 2 + ln x at x = 1 is rising and bending downward. Its height 2 is the constant, its slope 1 is the linear coefficient and the square coefficient is −1/2: P₂ = 2 + (x − 1) − (x − 1)²/2.",
    "例如，y = 2 + ln x 在 x = 1 处上升且向下弯。高度 2 是常数项，斜率 1 是一次项系数，二次项系数为 −1/2：P₂ = 2 + (x − 1) − (x − 1)²/2。",
  ),
  "analyzing-second-degree-taylor-polynomials#signs-of-taylor-coefficients-from-a-graph": graphed(
    wide(-1, 5, -1, 5),
    [
      curveOf((x) => 3 - (x - 2) ** 2, undefined, 0.2, 3.8),
      tangent([1, 2], 2, "action", true),
      pt([1, 2], "a = 1", "se", "result"),
      tag([3, 2.3], "∩", "e"),
    ],
    "For example, y = 3 − (x − 2)² at a = 1. The height is f(a) = 2, so it is positive. The graph rises through a, so f′(a) = 2 is positive. It bends downward, so f″(a) = −2 is negative.",
    "例如，y = 3 − (x − 2)² 在 a = 1 处。高度 f(a) = 2 为正。图象经过 a 时上升，所以 f′(a) = 2 为正。它向下弯，所以 f″(a) = −2 为负。",
  ),
  "the-lagrange-error-bound#a-taylor-error-bound-from-a-drawn-derivative": drawing(
    pane(0, [0, 5, 1], [0, 6, 2], 8, 5, "x", "|f‴|")
      .under((x) => 1 + x, 0, 2)
      .f((x) => 1 + x)
      .dot(2, 3, "M = 3", "nw", "result")
      .dot(5, 6, "6 ✗", "w")
      .marks(),
    "For example, n = 2, a = 0 and x = 2. Between 0 and 2 the graph of |f‴| reaches at most M = 3, so |R₂(2)| ≤ 3 · 2³/3! = 4. The bigger values farther right, up to 6, do not matter.",
    "例如，n = 2，a = 0，x = 2。在 0 与 2 之间 |f‴| 的图象最高为 M = 3，所以 |R₂(2)| ≤ 3 · 2³/3! = 4。右边更大的值（最大到 6）无关紧要。",
  ),
  "radius-of-convergence-of-power-series#radius-from-a-drawn-interval-of-convergence": drawing(
    [
      seg([-2.5, 0], [6.5, 0]),
      seg([-1, 0], [5, 0], "result"),
      ring(0.13, [-1, 0]),
      ...dotAt([5, 0], undefined, "s", "result"),
      ...dotAt([2, 0], undefined, "s"),
      note([-1, 0], "−1", "s"),
      note([5, 0], "5", "s"),
      note([2, 0], "2", "s"),
      seg([2, 0.7], [5, 0.7], "action"),
      note([3.5, 0.7], "R = 3", "n"),
    ],
    "For example, an interval centered at 2 from −1 to 5, open at −1 and closed at 5. The radius is half the length: 6/2 = 3. The open and filled circles affect the ends only, not the radius.",
    "例如，以 2 为中心、从 −1 到 5 的区间，在 −1 处开、在 5 处闭。半径是长度的一半：6/2 = 3。空心和实心圆只影响端点，不影响半径。",
  ),
  "qualitative-analysis-of-first-order-odes#the-long-run-from-a-graph-of-the-right-side": graphed(
    wide(-1, 5, -3, 3, 1, 1, "y", "f"),
    [
      curveOf((y) => (y - 1) * (3 - y), undefined, 0, 4),
      toward([1.3, 0.2], [2.7, 0.2], "result"),
      toward([0.8, 0.2], [-0.8, 0.2], "action"),
      toward([4.7, 0.2], [3.3, 0.2], "action"),
      bare([1, 0]),
      bare([3, 0]),
    ],
    "For example, y′ = (y − 1)(3 − y). Between the roots 1 and 3 the graph is above zero, so y rises to 3. Above 3 it is below zero, so y falls to 3. Below 1 it is below zero and there is no root in that direction, so y runs off without bound.",
    "例如，y′ = (y − 1)(3 − y)。在根 1 和 3 之间图象在零上方，所以 y 上升到 3。高于 3 时图象在零下方，所以 y 下降到 3。低于 1 时图象在零下方且该方向没有根，所以 y 无限下降。",
  ),
  "equilibrium-solutions-of-first-order-odes#the-stable-equilibrium-from-a-graph-of-the-right-side": graphed(
    wide(-3, 4, -3, 3, 1, 1, "y", "f"),
    [
      curveOf((y) => -(y + 1) * (y - 2), undefined, -1.8, 2.8),
      toward([0.2, 0.2], [1.7, 0.2], "result"),
      toward([3.4, 0.2], [2.3, 0.2], "result"),
      pt([2, 0], "→ • ←", "ne", "result"),
      pt([-1, 0], "← • →", "nw", "action"),
    ],
    "For example, f(y) = −(y + 1)(y − 2). At y = 2 the graph crosses from positive to negative, so solutions on both sides move toward it: it is stable. At y = −1 it crosses from negative to positive, so it is not.",
    "例如，f(y) = −(y + 1)(y − 2)。在 y = 2 处图象由正变负，两侧的解都向它靠近：它是稳定的。在 y = −1 处图象由负变正，所以不稳定。",
  ),
  "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems#half-life-from-a-decay-curve": drawing(
    pane(0, [0, 12, 3], [0, 80, 20], 9, 5, "t", "A")
      .f((t) => 80 * 0.5 ** (t / 3))
      .path(
        [
          [0, 40],
          [3, 40],
          [3, 0],
        ],
        "action",
        true,
      )
      .path(
        [
          [0, 20],
          [6, 20],
          [6, 0],
        ],
        "action",
        true,
      )
      .path(
        [
          [0, 10],
          [9, 10],
          [9, 0],
        ],
        "action",
        true,
      )
      .dot(3, 40)
      .dot(6, 20)
      .dot(9, 10)
      .say(4.5, 42, "t½ = 3", "e")
      .marks(),
    "For example, a curve starting at 80 falls to 40 at t = 3, to 20 at t = 6 and to 10 at t = 9. Each step of 3 halves the height, wherever it starts, and the curve never reaches zero.",
    "例如，从 80 开始的曲线在 t = 3 时降到 40，t = 6 时降到 20，t = 9 时降到 10。每隔 3 高度减半，无论从哪里开始，曲线都不会到达零。",
  ),
  "qualitative-analysis-of-the-logistic-growth-equation#fastest-logistic-growth": drawing(
    pane(0, [0, 800, 200], [0, 3, 1], 9, 5, "P", "P′")
      .f((p) => 0.01 * p * (1 - p / 800))
      .path(
        [
          [400, 0],
          [400, 2],
        ],
        "action",
        true,
      )
      .dot(400, 2, "P = 400", "n", "result")
      .marks(),
    "dP/dt = kP − (k/K)P² is a downward parabola in P with zeros at 0 and K = 800, drawn for example with k = 0.01. It is largest halfway, at P = 400.",
    "dP/dt = kP − (k/K)P² 是关于 P 的开口向下的抛物线，零点为 0 和 K = 800，图中举例取 k = 0.01。它在正中间 P = 400 处最大。",
  ),
  "qualitative-analysis-of-the-logistic-growth-equation#reading-a-logistic-curve": drawing(
    pane(0, [0, 12, 2], [0, 1000, 200], 9, 5, "t", "P")
      .level(800, "action")
      .f((t) => 800 / (1 + 7 * exp(-0.5 * t)))
      .dot(Math.log(7) / 0.5, 400, "K/2", "se", "result")
      .say(2.5, 800, "K = 800", "n")
      .marks(),
    "For example, a logistic curve with capacity 800 rises slowly, then quickly, then levels off at 800. It is steepest at P = 400, half of the capacity, which is the inflection point.",
    "例如，容量为 800 的 logistic 曲线先慢后快地上升，然后趋于 800。它在 P = 400（容量的一半）处最陡，那里是拐点。",
  ),
  "slope-fields-for-directly-integrable-differential-equations#matching-a-field-of-a-function-of-x": graphed(
    wide(-3, 3, -3, 4),
    [
      ...field(
        (x) => x,
        count(-2, 2),
        count(-2.5, 2.5, 1),
        0.5,
        (x) => (x === 0 ? "action" : undefined),
      ),
      tag([0.2, 3.3], "x = 0", "e"),
    ],
    "For example, dy/dx = x. Every column of segments is parallel, because moving up or down does not change the slope. The slopes are 0 at x = 0 and positive on the right, negative on the left.",
    "例如，dy/dx = x。每一列线段都平行，因为上下移动不改变斜率。x = 0 处斜率为 0，右边为正，左边为负。",
  ),
  "slope-fields-for-directly-integrable-differential-equations#where-a-field-of-a-function-of-x-is-flat": graphed(
    wide(-2, 4, -3, 3),
    [
      ...field(
        (x) => x - 1,
        count(-1, 3),
        count(-2.5, 2.5, 1),
        0.6,
        (x) => (x === 1 ? "action" : undefined),
      ),
      tag([1, 2.6], "x = 1", "n"),
    ],
    "For example, dy/dx = x − 1. The slope depends on the column only, so the horizontal segments fill the whole vertical line x = 1, the zero of f, not a horizontal row.",
    "例如，dy/dx = x − 1。斜率只取决于列，所以水平线段填满 f 的零点所在的竖直线 x = 1，而不是水平的一行。",
  ),
  "slope-fields-for-directly-integrable-differential-equations#the-equation-of-a-directly-integrable-field": graphed(
    wide(-1, 5, -4, 4),
    [
      ...field(
        (x) => 2 - x,
        count(0, 4),
        count(-3.5, 3.5, 1),
        0.55,
        (x) => (x === 2 ? "action" : undefined),
      ),
      curveOf((x) => 2 * x - (x * x) / 2 - 1, "result", -0.6, 4.6),
      curveOf((x) => 2 * x - (x * x) / 2 - 3, "result", 0, 4),
    ],
    "For example, y′ = 2 − x. The segments in each column have one slope, and they are flat at x = 2, where f is zero. The slopes change from positive to negative there, and the solution curves are vertical translates of one another.",
    "例如，y′ = 2 − x。每一列线段斜率相同，在 f 为零的 x = 2 处水平。斜率在此由正变负，解曲线彼此是上下平移的关系。",
  ),
  "slope-fields-for-autonomous-differential-equations#matching-a-field-of-a-function-of-y": graphed(
    wide(-3, 3, -2, 4),
    [
      ...field(
        (_, y) => y - 1,
        count(-2.5, 2.5, 1),
        count(-1, 3),
        0.6,
        (_, y) => (y === 1 ? "action" : undefined),
      ),
      tag([2.8, 1], "y = 1", "e"),
    ],
    "For example, y′ = y − 1. Every row of segments is parallel, so the equation is autonomous. The row of horizontal segments at y = 1 shows that g(1) = 0, so y = 1 is an equilibrium solution.",
    "例如，y′ = y − 1。每一行线段都平行，所以方程是自治的。y = 1 处的一行水平线段说明 g(1) = 0，所以 y = 1 是平衡解。",
  ),
  "slope-fields-for-autonomous-differential-equations#the-steepest-row-of-an-autonomous-field": graphed(
    wide(-1, 6, -1, 5),
    [
      ...field(
        (_, y) => (y - 1) * (y - 3),
        count(0.5, 5.5, 1),
        count(1, 3, 0.5),
        0.6,
        (_, y) => (y === 2 ? "action" : undefined),
      ),
      tag([5.8, 2], "m = −1", "e"),
      tag([5.8, 3], "y = 3", "e"),
      tag([5.8, 1], "y = 1", "e"),
    ],
    "For example, y′ = (y − 1)(y − 3). The slopes between the equilibria y = 1 and y = 3 are negative, and they are most negative on the row y = 2 halfway between, where the parabola has its vertex and the slope is −1.",
    "例如，y′ = (y − 1)(y − 3)。平衡解 y = 1 与 y = 3 之间斜率为负，在正中间的 y = 2 这一行最负，那里是抛物线的顶点，斜率为 −1。",
  ),
  "slope-fields-for-nonautonomous-differential-equations#the-line-of-equal-slopes": graphed(
    wide(-3, 3, -3, 3),
    [
      curveOf((x) => 2 * x - 1, "action", -1, 2, true),
      ...[-0.5, 0, 0.5, 1, 1.5].flatMap((x) =>
        field(
          () => 1,
          [x],
          [2 * x - 1],
          0.6,
          () => "result",
        ),
      ),
      tag([2, 3], "y = 2x − 1", "w"),
    ],
    "For example, dy/dx = 2x − y. Setting it equal to s = 1 gives the isocline y = 2x − 1, a line where all segments have slope 1. Other values of s give lines parallel to it.",
    "例如，dy/dx = 2x − y。令其等于 s = 1，得等斜线 y = 2x − 1，这条直线上所有线段的斜率都是 1。s 取其他值时得到与它平行的直线。",
  ),
  "analyzing-slope-fields-for-directly-integrable-differential-equations#vertical-translates-of-solutions": graphed(
    wide(-1, 4, -1, 9),
    [
      curveOf((x) => (5 * x * x) / 4, undefined, 0, 2.3),
      curveOf((x) => (5 * x * x) / 4 + 3, "result", 0, 2.1),
      pt([0, 0], "(0, 0)", "se"),
      pt([2, 5], "(2, 5)", "e"),
      pt([0, 3], "(0, 3)", "se", "result"),
      pt([2, 8], "(2, 8)", "e", "result"),
      toward([2, 5.2], [2, 7.8], "action"),
      tag([2, 6.5], "+3", "w"),
    ],
    "For example, solutions of the same equation through (0, 0) and (0, 3). They differ by the constant 3, so the first passing through (2, 5) means the second passes through (2, 8).",
    "例如，同一方程过 (0, 0) 和 (0, 3) 的两个解。它们相差常数 3，所以第一个过 (2, 5) 意味着第二个过 (2, 8)。",
  ),
  "analyzing-slope-fields-for-nonautonomous-differential-equations#the-zero-slope-isocline": graphed(
    wide(-3, 5, -3, 5),
    [
      curveOf((x) => 2 * x + 1, "action", -2, 2, true),
      ...field(
        (x, y) => 2 * x - y + 1,
        count(-2, 2),
        count(-3, 5),
        0.5,
        (x, y) => (2 * x - y + 1 === 0 ? "result" : undefined),
      ),
      tag([2.3, 4.8], "y = 2x + 1", "e"),
    ],
    "For dy/dx = 2x − y + 1, the slope is 0 along the line y = 2x + 1. The segments on it are horizontal, and solutions have horizontal tangents there.",
    "对 dy/dx = 2x − y + 1，沿直线 y = 2x + 1 斜率为 0。这条线上的线段是水平的，解在那里有水平切线。",
  ),
  "analyzing-slope-fields-for-nonautonomous-differential-equations#the-isocline-of-a-given-slope": graphed(
    wide(-4, 5, -4, 4),
    [
      ...[1, 0, -1].flatMap((m) => [
        curveOf((x) => x - m, "action", -3, 3, true),
        ...count(-2.5, 2.5, 1.25).flatMap((x) =>
          field(
            () => m,
            [x],
            [x - m],
            0.7,
            () => "result",
          ),
        ),
      ]),
      tag([3.05, 2.05], "m = 1", "e"),
      tag([3.05, 3.05], "m = 0", "e"),
      tag([3.05, 4], "m = −1", "e"),
    ],
    "For example, y′ = x − y. Setting it equal to m gives y = x − m. So m = 1, 0 and −1 give three parallel lines, each carrying short segments of its own slope.",
    "例如，y′ = x − y。令其等于 m，得 y = x − m。所以 m = 1、0、−1 给出三条平行线，每条线上有相应斜率的短线段。",
  ),
  "analyzing-slope-fields-for-nonautonomous-differential-equations#matching-a-slope-field-to-its-equation": drawing(
    [
      ...count(-2, 2)
        .reduce(
          (p, x) => {
            for (const y of count(-1.5, 1.5, 1)) {
              const dx = 0.3 / Math.hypot(1, x);
              p.path(
                [
                  [x - dx, y - x * dx],
                  [x + dx, y + x * dx],
                ],
                x === 0 ? "action" : undefined,
              );
            }
            return p;
          },
          pane(0, [-3, 3, 3], [-3, 3, 3], 6, 6),
        )
        .say(0, -3.6, "y′ = x", "s")
        .marks(),
      ...count(-2, 2)
        .reduce(
          (p, y) => {
            for (const x of count(-1.5, 1.5, 1)) {
              const dx = 0.3 / Math.hypot(1, y);
              p.path(
                [
                  [x - dx, y - y * dx],
                  [x + dx, y + y * dx],
                ],
                y === 0 ? "action" : undefined,
              );
            }
            return p;
          },
          pane(9, [-3, 3, 3], [-3, 3, 3], 6, 6),
        )
        .say(0, -3.6, "y′ = y", "s")
        .marks(),
    ],
    "For example, in the field of y′ = x each vertical column is parallel and the flat segments lie on x = 0. In the field of y′ = y each horizontal row is parallel and the flat segments lie on y = 0.",
    "例如，在 y′ = x 的斜率场中，每个竖列平行，水平线段在 x = 0 上。在 y′ = y 的斜率场中，每个横行平行，水平线段在 y = 0 上。",
  ),
  "finding-roots-of-functions-using-a-graphing-calculator#bracketing-a-root-with-sign-changes": graphed(
    wide(-1, 3, -2, 6),
    [
      curveOf((x) => x ** 3 - x - 1, undefined, -0.5, 2.1),
      pt([1, -1], "f(1) = −1", "se", "action"),
      pt([2, 5], "f(2) = 5", "w", "result"),
      bare([1.3247, 0]),
    ],
    "For example, f = x³ − x − 1 with left bound 1 and right bound 2. Since f(1) = −1 and f(2) = 5 have opposite signs, the Intermediate Value Theorem guarantees a root between them, near 1.325.",
    "例如，f = x³ − x − 1，左界 1，右界 2。f(1) = −1 与 f(2) = 5 异号，由介值定理知其间有根，约为 1.325。",
  ),
  "finding-roots-of-functions-using-a-graphing-calculator#solving-equations-with-a-difference-function": graphed(
    wide(-3, 3, -3, 5),
    [
      curveOf((x) => x * x, undefined, -2.2, 2.2),
      curveOf((x) => x * x - 2, "result", -2.2, 2.2),
      across(2, "action"),
      joined(
        [
          [sqrt(2), 0],
          [sqrt(2), 2],
        ],
        "action",
        true,
      ),
      bare([sqrt(2), 2]),
      bare([sqrt(2), 0], "result"),
      tag([-2.8, 2], "c = 2", "n"),
      tag([2.1, 4.4], "g", "e"),
      tag([2.1, 2.4], "Y₁ = g − 2", "e"),
      tag([1.45, 0], "x ≈ 1.414", "se"),
    ],
    "For example, g(x) = x² and c = 2. Instead of solving g(x) = 2 directly, graph Y₁ = x² − 2: its x-intercept x ≈ 1.414 is directly below the point where g reaches the level 2.",
    "例如，g(x) = x²，c = 2。不直接解 g(x) = 2，而是画 Y₁ = x² − 2：它的 x 截距 x ≈ 1.414 正好在 g 达到 2 的点的正下方。",
  ),
  "finding-intersections-of-functions-using-a-graphing-calculator#locating-intersection-coordinates": graphed(
    wide(-1, 3, -2, 2),
    [
      curveOf(cos, undefined, -1, 3),
      curveOf((x) => x, "result", -1, 2),
      bare([0.739, 0.739], "action"),
      toward([1.25, 0.92], [0.82, 0.76], "action"),
      tag([1.3, 0.95], "(0.739, 0.739)", "e"),
    ],
    "For example, Y₁ = cos x and Y₂ = x. The intersect command gives the point (0.739, 0.739), rounded, and the stored x-coordinate can be used as a limit of integration.",
    "例如，Y₁ = cos x，Y₂ = x。intersect 命令给出点 (0.739, 0.739)（四舍五入），存储的 x 坐标可用作积分限。",
  ),
  "finding-intersections-of-functions-using-a-graphing-calculator#intersections-from-sign-changes": drawing(
    pane(0, [-3, 4, 1], [0, 10, 2], 8, 5)
      .f((x) => x * x, -3, 3.1)
      .f((x) => x + 2, -2, 4, "result")
      .dot(-1, 1, undefined, "n", "action")
      .dot(2, 4, undefined, "n", "action")
      .say(-2.5, 7.5, "f − g > 0", "e")
      .say(2.8, 0.4, "f − g < 0", "n")
      .marks(),
    "For example, f = x² and g = x + 2. The difference f − g is 4 at x = −2, −2 at x = 0 and 4 at x = 3. Two sign changes guarantee at least 2 intersections, and here they are at x = −1 and x = 2.",
    "例如，f = x²，g = x + 2。差 f − g 在 x = −2 时为 4，x = 0 时为 −2，x = 3 时为 4。两次变号保证至少有 2 个交点，这里在 x = −1 和 x = 2。",
  ),
  "finding-extrema-of-functions-using-a-graphing-calculator#finding-extrema-directly-from-the-graph": drawing(
    pane(0, [-2, 3, 1], [-3, 9, 3], 8, 5)
      .f((x) => x ** 3 - 3 * x, -1.5, 2.5)
      .dot(-1, 2, "(−1, 2)", "n")
      .dot(1, -2, "(1, −2)", "s", "action")
      .dot(2.5, 8.125, "(2.5, 8.125)", "w", "result")
      .marks(),
    "For example, f = x³ − 3x on [−1.5, 2.5]. The local maximum is at x = −1, with value 2, and the local minimum at x = 1, with value −2. The endpoint value f(2.5) = 8.125 beats the interior maximum, so it is the absolute maximum.",
    "例如，f = x³ − 3x 在 [−1.5, 2.5] 上。局部最大值在 x = −1 处，值为 2；局部最小值在 x = 1 处，值为 −2。端点值 f(2.5) = 8.125 超过内部最大值，所以它是绝对最大值。",
  ),
  "finding-extrema-of-functions-using-a-graphing-calculator#finding-extrema-via-zeros-of-the-derivative": drawing(
    pane(0, [-3, 4, 1], [-4, 4, 2], 9, 5, "x", "f′")
      .f((x) => 0.1 * (x + 2) * (x - 1) * (x - 3) ** 2, -2.3, 4)
      .dot(-2, 0, "max", "ne", "result")
      .dot(1, 0, "min", "nw", "action")
      .dot(3, 0)
      .marks(),
    "For example, this f′ changes from positive to negative at x = −2, a local maximum of f, and from negative to positive at x = 1, a local minimum. At x = 3 it is zero without changing sign, so that point is neither.",
    "例如，这个 f′ 在 x = −2 处由正变负，是 f 的局部最大值；在 x = 1 处由负变正，是局部最小值。在 x = 3 处为零但不变号，所以该点两者都不是。",
  ),
  "finding-derivatives-using-a-graphing-calculator#numerical-derivative-command-and-symmetric-difference": graphed(
    wide(-1, 6, -1, 5),
    [
      curveOf((x) => x ** 3, undefined, -0.5, 1.7),
      tangent([1, 1], 3, "result", true),
      joined(
        [
          [0.5, 0.125],
          [1.5, 3.375],
        ],
        "action",
      ),
      bare([0.5, 0.125], "action"),
      bare([1.5, 3.375], "action"),
      pt([1, 1], "a = 1", "se"),
      tag([2, 2.4], "m = 3.25", "e"),
      tag([2.4, 4.2], "f′ = 3", "e"),
    ],
    "For example, f = x³ (k = 1), a = 1 and h = 0.5. The chord from x = 0.5 to x = 1.5 has slope 3.25 = 3 + 0.25, which differs from the exact derivative 3 by kh² = 0.25.",
    "例如，f = x³（k = 1），a = 1，h = 0.5。x = 0.5 到 x = 1.5 的弦斜率为 3.25 = 3 + 0.25，与精确导数 3 相差 kh² = 0.25。",
  ),
  "finding-definite-integrals-using-a-graphing-calculator#numerical-integration-and-accumulation": drawing(
    pane(0, [0, 2, 1], [-1, 1, 1], 8, 5, "x", "f′")
      .under((x) => sin(x * x), 0, 1.5)
      .f((x) => sin(x * x))
      .dot(1.5, sin(2.25), "x = 1.5", "e")
      .say(0.95, 0.15, "≈ 0.778", "n")
      .marks(),
    "For example, f′(x) = sin(x²), which has no elementary antiderivative. The calculator gives ∫₀^1.5 sin(x²) dx ≈ 0.778, so with f(0) = 2, f(1.5) ≈ 2 + 0.778 = 2.778.",
    "例如，f′(x) = sin(x²) 没有初等原函数。计算器给出 ∫₀^1.5 sin(x²) dx ≈ 0.778，所以由 f(0) = 2 得 f(1.5) ≈ 2 + 0.778 = 2.778。",
  ),
  "finding-definite-integrals-using-a-graphing-calculator#total-distance-and-absolute-value-integrals-on-calculators": drawing(
    [
      ...pane(0, [0, 4, 1], [-2, 2, 1], 6, 5, "t", "v")
        .under((t) => 2 - t, 0, 2)
        .under((t) => 2 - t, 2, 4, "action")
        .f((t) => 2 - t)
        .say(0.6, 0.15, "+2", "n")
        .say(3.5, -0.55, "−2", "s")
        .say(2, -2.5, "∫v = 0", "s")
        .marks(),
      ...pane(9, [0, 4, 1], [-2, 2, 1], 6, 5, "t", "|v|")
        .under((t) => Math.abs(2 - t), 0, 4)
        .f((t) => Math.abs(2 - t))
        .say(0.6, 0.15, "2", "n")
        .say(3.4, 0.15, "2", "n")
        .say(2, -2.5, "∫|v| = 4", "s")
        .marks(),
    ],
    "For example, v = 2 − t on [0, 4]. The signed integral is 2 − 2 = 0, so the displacement is 0. With abs( the integral of |v| is 2 + 2 = 4, the total distance: 2 in each direction.",
    "例如，v = 2 − t 在 [0, 4] 上。有向积分为 2 − 2 = 0，所以位移为 0。用 abs( 后 |v| 的积分为 2 + 2 = 4，即总路程：每个方向各 2。",
  ),
  "exploring-functions-using-technology#simultaneous-monotonicity-and-concavity-conditions": drawing(
    pane(0, [-3, 3, 1], [-6, 6, 2], 9, 5)
      .under(() => 6, 0, 2)
      .under(() => -6, 0, 2)
      .f((x) => 4 - x * x, -3, 3)
      .f((x) => -2 * x, -3, 3, "action")
      .say(-2.2, 5.3, "Y₂ = f″", "e")
      .say(-2.2, -5.2, "Y₁ = f′", "e")
      .marks(),
    "For example, Y₁ = f′ = 4 − x² and Y₂ = f″ = −2x. The shaded strip 0 < x < 2 is where f′ > 0 and f″ < 0, so f is both increasing and concave down.",
    "例如，Y₁ = f′ = 4 − x²，Y₂ = f″ = −2x。阴影带 0 < x < 2 上 f′ > 0 且 f″ < 0，所以 f 既递增又上凸。",
  ),
  "exploring-functions-using-technology#a-minimum-from-the-graph-of-the-derivative": graphed(
    wide(-3, 4, -2, 4, 1, 1, "x", "f′"),
    [
      curveOf((x) => x * (x - 2), undefined, -1, 3.2),
      bare([2, 0], "result"),
      bare([0, 0], "action"),
      tag([3, -0.7], "min", "s"),
      tag([-1.5, -0.7], "✗", "s"),
    ],
    "For example, f′ = x(x − 2). At x = 2 the graph crosses from negative to positive, so f has a local minimum there. At x = 0 it crosses from positive to negative, which is a local maximum, not a minimum.",
    "例如，f′ = x(x − 2)。在 x = 2 处图象由负变正，f 在此有局部最小值。在 x = 0 处由正变负，是局部最大值而不是最小值。",
  ),
  "finding-improper-integrals-using-a-graphing-calculator#approximating-infinite-interval-integrals-with-large-bounds": drawing(
    pane(0, [0, 14, 2], [0, 1, 1], 9, 5)
      .under((x) => 1 / (x * x), 1, 10)
      .under((x) => 1 / (x * x), 10, 14, "action")
      .f((x) => 1 / (x * x), 1, 14)
      .say(2.2, 0.35, "I(10) = 0.9", "e")
      .say(11.5, 0.05, "0.1", "n")
      .marks(),
    "For example, f = 1/x² from a = 1. Stopping at B = 10 gives I(10) = 1 − 1/10 = 0.9. The truncation error is the tail, the integral from 10 to ∞, which equals 0.1.",
    "例如，f = 1/x²，a = 1。在 B = 10 处停止得 I(10) = 1 − 1/10 = 0.9。截断误差是尾部，即从 10 到 ∞ 的积分，等于 0.1。",
  ),
  "finding-improper-integrals-using-a-graphing-calculator#improper-integrals-near-vertical-asymptotes-with-technology": drawing(
    pane(0, [0, 4, 1], [0, 4, 1], 8, 5)
      .under((x) => 1 / sqrt(x), 0.25, 4)
      .f((x) => 1 / sqrt(x), 0.07, 4)
      .path(
        [
          [0.25, 0],
          [0.25, 2],
        ],
        "action",
        true,
      )
      .say(0.3, 2.3, "ε = 1/4", "e")
      .say(2, 0.1, "J = 3", "n")
      .marks(),
    "For example, f = 1/√x on (0, 4], with a vertical asymptote at x = 0. Then J(ε) = 4 − 2√ε. With ε = 1/4 the shaded area is J = 3, and with ε = 0.01 it is 3.8, approaching 4.",
    "例如，f = 1/√x 在 (0, 4] 上，在 x = 0 处有竖直渐近线。于是 J(ε) = 4 − 2√ε。ε = 1/4 时阴影面积 J = 3，ε = 0.01 时为 3.8，趋于 4。",
  ),
};
