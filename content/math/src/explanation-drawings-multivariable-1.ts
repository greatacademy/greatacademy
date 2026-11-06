// Drawings in the explanations of Multivariable Calculus about space curves, curvature, vector fields, regions, level sets and quadric surfaces. Each coordinate is computed from the curve or surface it shows.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { dotAt, drawing, graphed, note, ring, seg } from "./explanation-drawings-kit.ts";
import { arrows, band, cross, disk, flat, type P3, scene, spin, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
const grid = [-2, -1, 0, 1, 2];
const helix =
  (a: number, b: number) =>
  (t: number): P3 => [a * cos(t), a * sin(t), b * t];

/** multivariableDrawings1 holds the drawings of the Multivariable Calculus explanations about curves, curvature and multivariable domains, by explanation key. */
export const multivariableDrawings1: Readonly<Record<string, Figure>> = {
  "differentiation-rules-for-vector-valued-functions#the-rate-of-change-of-a-squared-length": graphed(
    wide(-1, 6, -1, 7),
    [
      toward([0, 0], [3, 4]),
      tag([1.5, 2], "r", "nw"),
      toward([3, 4], [5, 4], "result"),
      tag([5, 4], "2r·r′ = 12", "n"),
      toward([3, 4], [1, 5.5], "action"),
      tag([1, 5.5], "2r·r′ = 0", "n"),
    ],
    "For example, at r = ⟨3, 4⟩ a velocity ⟨2, 0⟩ gives 2r·r′ = 2(6) = 12, so the squared length is growing. The velocity ⟨−2, 1.5⟩ is perpendicular to r and gives 2r·r′ = 0, so the length is momentarily not changing.",
    "例如，在 r = ⟨3, 4⟩ 处，速度 ⟨2, 0⟩ 给出 2r·r′ = 2(6) = 12，所以长度的平方在增大。速度 ⟨−2, 1.5⟩ 与 r 垂直，给出 2r·r′ = 0，所以此刻长度不变。",
  ),
  "the-arc-length-of-a-vector-valued-function#computing-arc-length-of-a-space-curve": (() => {
    const s = scene(0.8);
    const r = helix(2, 1);
    return drawing(
      [
        ...s.axes(4, 4, 8),
        ...s.curve(r, 0, 2 * pi, "result"),
        ...s.dot(r(0), "r(a)", "e"),
        ...s.dot(r(2 * pi), "r(b)", "e"),
        ...s.dot(r(pi / 2)),
        ...s.arrow(r(pi / 2), [-2, 2, pi / 2 + 1], "action"),
        ...s.say([-2, 2, pi / 2 + 1], "r′(t)", "n"),
        note([3.5, 4], "L = ∫ ‖r′(t)‖ dt", "e"),
      ],
      "For example, a space curve from r(a) to r(b) with its velocity r′(t) at one point. The length L of the curve is the integral of the speed ‖r′(t)‖ from a to b.",
      "例如，一条从 r(a) 到 r(b) 的空间曲线，并画出某点的速度 r′(t)。曲线长度 L 是速率 ‖r′(t)‖ 从 a 到 b 的积分。",
    );
  })(),
  "the-arc-length-of-a-vector-valued-function#arc-length-when-the-speed-is-a-perfect-square": (() => {
    const s = scene(0.5);
    const r = (t: number): P3 => [2 * t, t * t, (t * t * t) / 3];
    return drawing(
      [
        ...s.axes(7, 11, 11),
        ...s.curve(r, 0, 3, "result"),
        ...s.dot(r(0), "t = 0", "w"),
        ...s.dot(r(3), "t = 3", "e"),
        note(s.p(r(2.3)), "L = 15", "e"),
      ],
      "With a = 1, the curve r(t) = ⟨2t, t², t³/3⟩ has speed t² + 2. For example, from t = 0 to t = 3 its length is L = [t³/3 + 2t] = 9 + 6 = 15.",
      "取 a = 1，曲线 r(t) = ⟨2t, t², t³/3⟩ 的速率为 t² + 2。例如，从 t = 0 到 t = 3，其长度为 L = [t³/3 + 2t] = 9 + 6 = 15。",
    );
  })(),
  "the-arc-length-of-a-vector-valued-function#the-length-of-a-helix": (() => {
    const s = scene(1);
    const r = helix(1, 1);
    const w = 2 * pi;
    return drawing(
      [
        ...s.curve(r, 0, w, "result"),
        ...s.curve((t) => [cos(t), sin(t), 0], 0, w),
        ...s.curve((t) => [cos(t), sin(t), w], 0, w),
        ...s.line([0, 1, 0], [0, 1, w]),
        ...s.line([0, -1, 0], [0, -1, w]),
        ...flat(
          [
            [4, -0.5],
            [4 + w, -0.5],
            [4 + w, w - 0.5],
            [4, w - 0.5],
          ],
          "action",
        ),
        seg([4, -0.5], [4 + w, w - 0.5], "result"),
        note([4 + w / 2, -0.5], "2π", "s"),
        note([4, w / 2 - 0.5], "2π", "w"),
        note([4 + w / 2, w / 2 - 0.5], "L = 2π√2", "se"),
      ],
      "For example, one turn of the helix ⟨cos t, sin t, t⟩ has speed √2. Unrolling the cylinder turns the helix into the diagonal of a rectangle 2π wide and 2π tall, of length 2π√2, the speed times the elapsed parameter.",
      "例如，螺旋线 ⟨cos t, sin t, t⟩ 的一圈，速率为 √2。把圆柱面展开后，螺旋线变成一个宽 2π、高 2π 的矩形的对角线，长度为 2π√2，等于速率乘以参数的变化量。",
    );
  })(),
  "the-arc-length-of-a-vector-valued-function#the-length-of-a-drawn-broken-path": graphed(
    wide(-1, 9, -1, 11),
    [
      joined(
        [
          [0, 0],
          [4, 3],
          [4, 7],
          [8, 10],
        ],
        "result",
      ),
      pt([0, 0], "(0, 0)", "se"),
      pt([4, 3], "(4, 3)", "se"),
      pt([4, 7], "(4, 7)", "nw"),
      pt([8, 10], "(8, 10)", "w"),
      tag([2, 1.5], "5", "nw"),
      tag([4, 5], "4", "e"),
      tag([6, 8.5], "5", "se"),
    ],
    "For example, a path through (0, 0), (4, 3), (4, 7) and (8, 10). Its straight pieces have lengths 5, 4 and 5, so the arc length is L = 14.",
    "例如，一条经过 (0, 0)、(4, 3)、(4, 7) 和 (8, 10) 的路径。其各直线段长度为 5、4 和 5，所以弧长 L = 14。",
  ),
  "tangent-vectors-and-tangent-lines-to-curves#where-a-tangent-line-is-parallel-to-the-xy-plane": (() => {
    const s = scene(1.1);
    const r = (t: number): P3 => [t, 2 * t, (t - 1) * (t - 1) + 2];
    return drawing(
      [
        ...s.axes(3, 5.5, 5),
        ...s.curve(r, -0.4, 2.4),
        ...s.line([0.2, 0.4, 2], [1.8, 3.6, 2], "result"),
        ...s.line([0.2, 0.4, 0], [1.8, 3.6, 0], undefined, true),
        ...s.line([1, 2, 0], [1, 2, 2], undefined, true),
        ...s.dot(r(1), "t = 1", "sw", "result"),
        ...s.say([1.8, 3.6, 2], "z′ = 0", "e"),
      ],
      "For example, r(t) = ⟨t, 2t, (t − 1)² + 2⟩ has z′(t) = 2(t − 1), which is 0 at t = 1. The tangent line there has direction ⟨1, 2, 0⟩ and is parallel to its dashed shadow in the xy-plane.",
      "例如，r(t) = ⟨t, 2t, (t − 1)² + 2⟩ 有 z′(t) = 2(t − 1)，在 t = 1 时为 0。该处切线的方向为 ⟨1, 2, 0⟩，与它在 xy 平面上的虚线投影平行。",
    );
  })(),
  "principal-normal-vectors#the-principal-normal-of-a-circle-points-to-its-center": graphed(
    wide(-5, 7, -5, 7, 2),
    [
      { kind: "circle", center: [1, 1], r: 5 },
      joined(
        [
          [1, 1],
          [4, 5],
        ],
        undefined,
        true,
      ),
      pt([1, 1], "C", "sw"),
      pt([4, 5], "P", "ne"),
      toward([4, 5], [3.4, 4.2], "result"),
      tag([3.4, 4.2], "N", "w"),
      toward([4, 5], [4.8, 4.4], "action"),
      tag([4.8, 4.4], "T", "e"),
    ],
    "For example, on the circle with center C = (1, 1) and radius 5, at P = (4, 5) the principal normal is N = (C − P)/‖C − P‖ = ⟨−3/5, −4/5⟩, pointing to the center and perpendicular to the tangent T.",
    "例如，在圆心 C = (1, 1)、半径为 5 的圆上，在 P = (4, 5) 处，主法向量 N = (C − P)/‖C − P‖ = ⟨−3/5, −4/5⟩，指向圆心并与切向量 T 垂直。",
  ),
  "principal-normal-vectors#the-normal-points-to-the-concave-side": graphed(
    wide(-3, 3, -2, 5),
    [
      curveOf((x) => 4 - x * x, undefined, -2.6, 2.6),
      pt([1, 3], "P", "ne"),
      toward([1, 3], [1 + 1 / sqrt(5), 3 - 2 / sqrt(5)], "action"),
      tag([1 + 1 / sqrt(5), 3 - 2 / sqrt(5)], "T", "e"),
      toward([1, 3], [1 - 2 / sqrt(5), 3 - 1 / sqrt(5)], "result"),
      tag([1 - 2 / sqrt(5), 3 - 1 / sqrt(5)], "N", "s"),
    ],
    "For example, on the downward parabola y = 4 − x² at P = (1, 3), T = ⟨1, −2⟩/√5 and N = ⟨−2, −1⟩/√5. N is the perpendicular toward which the curve bends, and its second component is negative.",
    "例如，在开口向下的抛物线 y = 4 − x² 上的点 P = (1, 3) 处，T = ⟨1, −2⟩/√5，N = ⟨−2, −1⟩/√5。N 是曲线弯向的那个垂直方向，其第二个分量为负。",
  ),
  "binormal-vectors#the-binormal-of-a-plane-curve": (() => {
    const panel = (dx: number, sign: number, text: string): Mark[] => {
      const s = scene(1.6, dx);
      const P: P3 = [2, 0, 0];
      return [
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2),
        ...s.dot(P, undefined),
        ...s.arrow(P, [2, sign, 0], "action"),
        ...s.say([2, sign, 0], "T", sign > 0 ? "e" : "w"),
        ...s.arrow(P, [1, 0, 0], "action"),
        ...s.say([1, 0, 0], "N", "n"),
        ...s.arrow(P, [2, 0, sign], "result"),
        ...s.say([2, 0, sign], "B", sign > 0 ? "n" : "s"),
        note([dx, -3.8], text, "s"),
      ];
    };
    return drawing(
      [...panel(0, 1, "B = ⟨0, 0, 1⟩"), ...panel(10, -1, "B = ⟨0, 0, −1⟩")],
      "A circle in a horizontal plane, in two directions of travel. Traversed counterclockwise from above, on the left, B = T × N = ⟨0, 0, 1⟩. Traversed clockwise, on the right, B = ⟨0, 0, −1⟩. Either way B is normal to the plane.",
      "水平面内的一个圆，有两种行进方向。从上方看逆时针行进（左图），B = T × N = ⟨0, 0, 1⟩。顺时针行进（右图），B = ⟨0, 0, −1⟩。无论哪种，B 都垂直于该平面。",
    );
  })(),
  "binormal-vectors#the-binormal-from-the-unit-tangent-and-normal": (() => {
    const s = scene(2.4);
    const O: P3 = [0, 0, 0];
    return drawing(
      [
        ...s.dot(O),
        ...s.arrow(O, [1, 0, 0], "action"),
        ...s.say([1, 0, 0], "T", "sw"),
        ...s.arrow(O, [0, 1, 0], "action"),
        ...s.say([0, 1, 0], "N", "e"),
        ...s.arrow(O, [0, 0, 1], "result"),
        ...s.say([0, 0, 1], "B = T × N", "e"),
        ...s.line(O, [0, 0, -1], undefined, true),
        ...s.say([0, 0, -1], "N × T = −B", "e"),
      ],
      "T and N are perpendicular unit vectors, so B = T × N is a unit vector perpendicular to both. Reversing the order gives the opposite vector, N × T = −B, drawn dashed.",
      "T 与 N 是互相垂直的单位向量，所以 B = T × N 是同时垂直于二者的单位向量。交换顺序得到相反的向量 N × T = −B，用虚线表示。",
    );
  })(),
  "the-osculating-plane#the-binormal-of-a-helix": (() => {
    const s = scene(1.5);
    const r = helix(1, 0.5);
    const q = sqrt(1.25);
    const frame = (t: number, names: boolean): Mark[] => {
      const P = r(t);
      const T: P3 = [-sin(t) / q, cos(t) / q, 0.5 / q];
      const N: P3 = [-cos(t), -sin(t), 0];
      const B: P3 = [(0.5 * sin(t)) / q, (-0.5 * cos(t)) / q, 1 / q];
      const add = (a: P3, b: P3, k = 1): P3 => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
      return [
        ...(names
          ? s.patch(
              [add(add(P, T, 0.8), N, 0.8), add(add(P, T, 0.8), N, -0.8), add(add(P, T, -0.8), N, -0.8), add(add(P, T, -0.8), N, 0.8)],
              "action",
            )
          : []),
        ...s.dot(P),
        ...s.arrow(P, add(P, B), "result"),
        ...s.say(add(P, B), "B", "n"),
        ...(names
          ? [
              ...s.arrow(P, add(P, T), "action"),
              ...s.say(add(P, T), "T", "e"),
              ...s.arrow(P, add(P, N), "action"),
              ...s.say(add(P, N), "N", "w"),
            ]
          : []),
      ];
    };
    return drawing(
      [...s.curve(r, 0, 3 * pi), ...s.line([0, 0, 0], [0, 0, 1.5 * pi + 1]), ...frame(pi / 2, false), ...frame(2.2 * pi, true)],
      "For example, on the helix ⟨cos t, sin t, t/2⟩ the binormal B = T × N is the unit normal of the shaded osculating plane spanned by T and N. Its vertical component is 2/√5 at every point, so it makes a constant angle with the axis.",
      "例如，在螺旋线 ⟨cos t, sin t, t/2⟩ 上，副法向量 B = T × N 是由 T、N 张成的（阴影）密切平面的单位法向量。它的竖直分量处处为 2/√5，所以它与轴的夹角不变。",
    );
  })(),
  "parameterization-by-arc-length#reparameterizing-curves-by-arc-length": drawing(
    pane(0, [0, 4, 1], [0, 8, 2], 7, 5, "t", "s")
      .f((t) => 2 * t, 0, 4, "result")
      .path(
        [
          [3, 0],
          [3, 6],
          [0, 6],
        ],
        undefined,
        true,
      )
      .dot(3, 6, "s = 2t", "nw", "result")
      .say(1.5, 1, "t = s/2", "e")
      .marks(),
    "For example, with constant speed c = 2 the arc length is s = 2t. Reading the line the other way gives t = s/2, here t = 3 when s = 6. Substituting t(s) gives the arc length parameterization.",
    "例如，当速率为常数 c = 2 时，弧长 s = 2t。反过来读这条直线得 t = s/2，这里 s = 6 时 t = 3。代入 t(s) 就得到弧长参数化。",
  ),
  "parameterization-by-arc-length#a-point-at-a-given-arc-length-along-a-line": graphed(
    wide(-1, 9, -1, 11),
    [
      joined(
        [
          [1, 1],
          [7, 9],
        ],
        undefined,
        true,
      ),
      toward([1, 1], [4, 5], "action"),
      tag([2.5, 3], "v", "nw"),
      tag([4, 5], "‖v‖ = 5", "se"),
      pt([1, 1], "P", "se"),
      pt([7, 9], "(7, 9)", "e", "result"),
      tag([7, 9], "s = 10", "nw"),
    ],
    "For example, with P = (1, 1) and v = ⟨3, 4⟩, the speed is ‖v‖ = 5. The point at arc length s = 10 is P + 10⟨3/5, 4/5⟩ = (7, 9), reached at t = 2.",
    "例如，取 P = (1, 1)，v = ⟨3, 4⟩，速率 ‖v‖ = 5。弧长 s = 10 处的点为 P + 10⟨3/5, 4/5⟩ = (7, 9)，对应 t = 2。",
  ),
  "parameterization-by-arc-length#the-height-on-a-helix-after-a-given-arc-length": (() => {
    const s = scene(0.42);
    const r = helix(3, 4);
    return drawing(
      [
        ...s.axes(5, 5, 16),
        ...s.curve(r, 0, 1.15 * pi),
        ...s.curve(r, 0, pi, "result"),
        ...s.dot(r(0), "t = 0", "w"),
        ...s.dot(r(pi), "t = π", "e", "result"),
        ...s.line(r(pi), [-3, 0, 0], undefined, true),
        ...s.say([-3, 0, 2 * pi], "z = 4π", "w"),
        ...s.say(r(pi / 2), "s = 5π", "e"),
      ],
      "For example, the helix ⟨3 cos t, 3 sin t, 4t⟩ has speed v = 5, so s = 5t. After travelling s = 5π, t = π and the height is z = 4π.",
      "例如，螺旋线 ⟨3 cos t, 3 sin t, 4t⟩ 的速率 v = 5，所以 s = 5t。走过 s = 5π 后，t = π，高度 z = 4π。",
    );
  })(),
  "introduction-to-curvature#the-curvature-of-a-circle-is-the-reciprocal-of-its-radius": graphed(
    wide(-5, 9, -4, 4),
    [
      { kind: "circle", center: [0, 0], r: 1 },
      { kind: "circle", center: [5, 0], r: 3, tone: "result" },
      joined([
        [0, 0],
        [1, 0],
      ]),
      joined(
        [
          [5, 0],
          [8, 0],
        ],
        "result",
      ),
      tag([-1.1, 1.4], "R = 1", "w"),
      tag([-1.1, 0.7], "κ = 1", "w"),
      tag([6.5, 0], "R = 3", "n"),
      tag([5, -3], "κ = 1/3", "n"),
    ],
    "For example, a circle of radius R = 1 has curvature κ = 1, and a circle of radius R = 3 has κ = 1/3: the tangent turns 2π while the point travels 2πR, so κ = 1/R.",
    "例如，半径 R = 1 的圆曲率 κ = 1，半径 R = 3 的圆 κ = 1/3：点走过 2πR 时切线转过 2π，所以 κ = 1/R。",
  ),
  "introduction-to-curvature#the-curvature-of-a-helix": (() => {
    const panel = (dx: number, b: number, text: string): Mark[] => {
      const s = scene(1, dx);
      return [...s.curve(helix(1, b), 0, b === 0 ? 2 * pi : 3 * pi, "result", false, 160), note([dx, -1.6], text, "s")];
    };
    return drawing(
      [...panel(0, 0, "b = 0, κ = 1"), ...panel(8, 0.5, "b = 1/2, κ = 4/5"), ...panel(16, 1, "b = 1, κ = 1/2")],
      "For example, with a = 1 the helix ⟨cos t, sin t, bt⟩ has curvature κ = a/(a² + b²). At b = 0 it is a circle with κ = 1, at b = 1/2 κ = 4/5, and at b = 1 κ = 1/2. Raising the pitch lowers the curvature.",
      "例如，取 a = 1，螺旋线 ⟨cos t, sin t, bt⟩ 的曲率 κ = a/(a² + b²)。b = 0 时为圆，κ = 1；b = 1/2 时 κ = 4/5；b = 1 时 κ = 1/2。螺距越大，曲率越小。",
    );
  })(),
  "finding-curvature-using-the-cross-product#curvature-of-a-cubic-space-curve-by-the-cross-product": drawing(
    pane(0, [-3, 3, 1], [0, 0.6, 0.3], 8, 5, "t", "κ")
      .f((t) => 2 / (t * t + 2) ** 2, -3, 3, "result")
      .dot(0, 0.5, "κ = 1/2", "e", "result")
      .dot(1, 2 / 9, "κ = 2/9", "ne", "result")
      .dot(2, 1 / 18, "κ = 1/18", "n", "result")
      .marks(),
    "With a = 1, the curve ⟨2t, t², t³/3⟩ has κ(t) = 2/(t² + 2)². Its curvature is 1/2 at t = 0, 2/9 at t = 1 and 1/18 at t = 2.",
    "取 a = 1，曲线 ⟨2t, t², t³/3⟩ 的曲率 κ(t) = 2/(t² + 2)²。t = 0 时为 1/2，t = 1 时为 2/9，t = 2 时为 1/18。",
  ),
  "finding-curvature-using-the-cross-product#the-curvature-of-a-helix": (() => {
    const panel = (dx: number, b: number, text: string): Mark[] => {
      const s = scene(0.5, dx);
      return [
        ...s.curve(helix(3, b), 0, 4 * pi, "result", false, 200),
        ...s.line([0, 0, 0], [0, 0, b === 0 ? 3 : 4 * pi]),
        note([dx, -2.4], text, "s"),
      ];
    };
    return drawing(
      [...panel(0, 0, "a = 3, b = 0, κ = 1/3"), ...panel(9, 1, "a = 3, b = 1, κ = 3/10")],
      "For example, with a = 3 the helix has constant curvature κ = a/(a² + b²). At b = 0 it is the circle with κ = 1/3, and at b = 1 it is κ = 3/(9 + 1) = 3/10. Stretching upward lowers the curvature.",
      "例如，取 a = 3，螺旋线的曲率为常数 κ = a/(a² + b²)。b = 0 时是圆，κ = 1/3；b = 1 时 κ = 3/(9 + 1) = 3/10。向上拉伸使曲率变小。",
    );
  })(),
  "radius-of-curvature#calculating-the-radius-of-curvature": graphed(
    wide(-10, 4, -3, 10, 2),
    [
      curveOf((x) => x * x, undefined, -3, 3),
      { kind: "circle", center: [-4, 3.5], r: (5 * sqrt(5)) / 2, tone: "result" },
      joined(
        [
          [-4, 3.5],
          [1, 1],
        ],
        "result",
      ),
      pt([1, 1], "(1, 1)", "e"),
      bare([-4, 3.5], "result"),
      tag([-1.5, 2.25], "ρ = 1/κ", "n"),
    ],
    "For example, y = x² at (1, 1) has κ = 2/5^(3/2), so ρ = 1/κ = 5√5/2 ≈ 5.59. The osculating circle of that radius, centered at (−4, 7/2), touches the curve there.",
    "例如，y = x² 在 (1, 1) 处 κ = 2/5^(3/2)，所以 ρ = 1/κ = 5√5/2 ≈ 5.59。以 (−4, 7/2) 为圆心、该长度为半径的密切圆在此与曲线相切。",
  ),
  "radius-of-curvature#the-radius-of-curvature-at-a-vertex-of-an-ellipse": graphed(
    wide(-5, 5, -8, 3),
    [
      { kind: "contour", f: (x, y) => (x * x) / 9 + (y * y) / 4 - 1, level: 0 },
      { kind: "circle", center: [5 / 3, 0], r: 4 / 3, tone: "result" },
      { kind: "circle", center: [0, -2.5], r: 4.5, tone: "action" },
      pt([3, 0], "(3, 0)", "ne"),
      pt([0, 2], "(0, 2)", "n"),
      tag([2.3, -1.3], "ρ = 4/3", "e"),
      tag([0, -7], "ρ = 9/2", "n"),
    ],
    "For example, the ellipse with A = 3 and B = 2. At the vertex (3, 0) the radius of curvature is B²/A = 4/3, and at (0, 2) it is A²/B = 9/2. Each circle shown touches the ellipse at its vertex.",
    "例如，A = 3、B = 2 的椭圆。在顶点 (3, 0) 处曲率半径为 B²/A = 4/3，在 (0, 2) 处为 A²/B = 9/2。图中每个圆都在相应顶点与椭圆相切。",
  ),
  "radius-of-curvature#the-radius-of-curvature-at-the-vertex-of-a-parabola": graphed(
    wide(-3, 5, -1, 6),
    [
      curveOf((x) => (x - 1) ** 2 / 4 + 1, undefined, -3, 5),
      { kind: "circle", center: [1, 3], r: 2, tone: "result" },
      joined(
        [
          [1, 1],
          [1, 3],
        ],
        "result",
      ),
      pt([1, 1], "(1, 1)", "s"),
      tag([1, 2], "ρ = 2", "e"),
      tag([2.9, 5.3], "y″ = 1/2", "e"),
    ],
    "For example, y = (x − 1)²/4 + 1 has y″ = 1/2, so at its vertex (1, 1), where the slope is zero, κ = 1/2. The circle that best fits there has radius ρ = 2.",
    "例如，y = (x − 1)²/4 + 1 有 y″ = 1/2，所以在斜率为零的顶点 (1, 1) 处 κ = 1/2。在此最贴合的圆半径 ρ = 2。",
  ),
  "the-curvature-of-a-plane-curve#computing-curvature-of-function-graphs": drawing(
    [
      ...pane(0, [-2, 2, 1], [0, 4, 1], 5, 5)
        .f((x) => x * x, -2, 2)
        .dot(0, 0)
        .dot(1, 1)
        .say(1.85, 3.4, "y = x²", "e")
        .marks(),
      ...pane(9, [-2, 2, 1], [0, 2, 1], 5, 5, "x", "κ")
        .f((x) => 2 / (1 + 4 * x * x) ** 1.5, -2, 2, "result")
        .dot(0, 2, "κ = 2", "e", "result")
        .dot(1, 2 / 5 ** 1.5, "κ ≈ 0.18", "ne", "result")
        .marks(),
    ],
    "For example, y = x² has κ(x) = 2/(1 + 4x²)^(3/2). On the right, κ = 2 at the vertex and κ = 2/5^(3/2) ≈ 0.18 at x = 1, where the graph is steeper.",
    "例如，y = x² 有 κ(x) = 2/(1 + 4x²)^(3/2)。右图中，顶点处 κ = 2，在图形更陡的 x = 1 处 κ = 2/5^(3/2) ≈ 0.18。",
  ),
  "the-curvature-of-a-plane-curve#curvature-of-a-graph-from-its-slope-and-concavity": drawing(
    [
      ...flat(
        [
          [0, 0],
          [4, 0],
          [4, 3],
        ],
        "action",
      ),
      note([2, 0], "4", "s"),
      note([4, 1.5], "3", "e"),
      note([2, 1.5], "5", "nw"),
      note([4.6, 1.5], "f′ = 3/4,  κ = |f″| · 64/125", "e"),
    ],
    "A slope of 3/4 comes from the triple 3, 4, 5, so 1 + (3/4)² = 25/16, whose 3/2 power is 125/64. So κ = |f″| · 64/125.",
    "斜率 3/4 来自勾股数 3、4、5，所以 1 + (3/4)² = 25/16，其 3/2 次方为 125/64。于是 κ = |f″| · 64/125。",
  ),
  "the-curvature-of-a-plane-curve#the-curvature-where-the-slope-is-not-zero": graphed(
    wide(-3, 4, -1, 4),
    [
      curveOf((x) => (x * x) / 2, undefined, -2.6, 2.6),
      bare([0, 0], "result"),
      tag([0.2, -0.6], "κ = 1", "e"),
      pt([1, 0.5], "κ ≈ 0.35", "e", "result"),
      pt([2, 2], "κ ≈ 0.09", "e", "result"),
    ],
    "For example, y = x²/2 has f″ = 1 everywhere. At x = 0 the slope is 0 and κ = 1, at x = 1 κ = 1/2^(3/2) ≈ 0.35, and at x = 2 κ = 1/5^(3/2) ≈ 0.09. The steeper the point, the smaller the curvature.",
    "例如，y = x²/2 处处 f″ = 1。x = 0 处斜率为 0，κ = 1；x = 1 处 κ = 1/2^(3/2) ≈ 0.35；x = 2 处 κ = 1/5^(3/2) ≈ 0.09。越陡，曲率越小。",
  ),
  "the-curvature-of-a-plane-curve#the-curvature-at-the-vertex-of-a-drawn-parabola": graphed(
    wide(-5, 6, -1, 5),
    [
      curveOf((x) => (x * x) / 2, undefined, -2.8, 2.8),
      curveOf((x) => 2 * x * x, "result", -1.4, 1.4),
      pt([2, 2], "(2, 2)", "e"),
      tag([2.85, 3.8], "a = 1/2, κ = 1", "e"),
      pt([1, 2], "(1, 2)", "nw", "result"),
      tag([-1.6, 4.3], "a = 2, κ = 4", "w"),
    ],
    "For example, a parabola y = ax² through (2, 2) has a = 1/2 and vertex curvature κ = 2|a| = 1. The narrower one through (1, 2) has a = 2 and κ = 4.",
    "例如，经过 (2, 2) 的抛物线 y = ax² 有 a = 1/2，顶点曲率 κ = 2|a| = 1。经过 (1, 2) 的更窄的抛物线有 a = 2，κ = 4。",
  ),
  "visualizing-vector-fields#interpreting-vector-field-plots": drawing(
    [
      ...cross([0, 0], 2.8, false),
      ...arrows((x, y) => [x, y], [0, 0], grid, 0.3),
      note([0, -3], "⟨x, y⟩", "s"),
      ...cross([7.5, 0], 2.8, false),
      ...arrows((x, y) => [-y, x], [7.5, 0], grid, 0.3),
      note([7.5, -3], "⟨−y, x⟩", "s"),
      ...cross([15, 0], 2.8, false),
      ...arrows(() => [1, 0.5], [15, 0], grid, 0.6),
      note([15, -3], "⟨1, 1/2⟩", "s"),
    ],
    "Three fields. ⟨x, y⟩ is radial, pointing directly away from the origin. ⟨−y, x⟩ circulates counterclockwise around the origin. For example, the constant field ⟨1, 1/2⟩ has identical arrows at every point.",
    "三个场。⟨x, y⟩ 是径向的，从原点直接指向外。⟨−y, x⟩ 绕原点逆时针环流。例如，常向量场 ⟨1, 1/2⟩ 在每一点的箭头都相同。",
  ),
  "conservative-vector-fields-in-the-cartesian-plane#is-a-drawn-field-conservative": drawing(
    [
      ...cross([0, 0], 2.8, false),
      ...arrows((x, y) => [-y, x], [0, 0], grid, 0.3),
      ...spin([0, 0], 1.5, 0, 2 * pi - 0.2, "result"),
      note([0, -3], "∂Q/∂x − ∂P/∂y = 2", "s"),
      ...cross([8, 0], 2.8, false),
      ...arrows((x, y) => [y, x], [8, 0], grid, 0.3),
      note([8, -3], "∂Q/∂x − ∂P/∂y = 0", "s"),
    ],
    "For example, ⟨−y, x⟩ on the left swirls around the origin: its circulation along the circle is nonzero and ∂Q/∂x − ∂P/∂y = 2, so it is not conservative. On the right, ⟨y, x⟩ has ∂Q/∂x = ∂P/∂y = 1, so it is conservative.",
    "例如，左图 ⟨−y, x⟩ 绕原点旋转：沿圆的环量不为零，∂Q/∂x − ∂P/∂y = 2，所以不是保守场。右图 ⟨y, x⟩ 有 ∂Q/∂x = ∂P/∂y = 1，所以是保守场。",
  ),
  "connected-and-simply-connected-regions#picking-the-simply-connected-region": (() => {
    const box = (c: Point): Mark[] =>
      flat([
        [c[0] - 2, c[1] - 1.5],
        [c[0] + 2, c[1] - 1.5],
        [c[0] + 2, c[1] + 1.5],
        [c[0] - 2, c[1] + 1.5],
      ]);
    return drawing(
      [
        disk([0, 5], 1.5),
        ring(1.5, [0, 5], "result"),
        note([0, 3.4], "✓", "s"),
        ...box([5.5, 5]),
        note([5.5, 3.4], "✓", "s"),
        ...box([11, 5]),
        seg([11, 5], [13, 5]),
        ...dotAt([11, 5]),
        note([11, 3.4], "✓", "s"),
        band([0, 0], 0.7, 1.5),
        ring(1.5, [0, 0], "result"),
        ring(0.7, [0, 0], "result"),
        note([0, -1.6], "✗", "s"),
        disk([5.5, 0], 1.5),
        ring(1.5, [5.5, 0], "result"),
        ring(0.1, [5.5, 0]),
        note([5.5, -1.6], "✗", "s"),
        disk([10, 0], 1),
        ring(1, [10, 0], "result"),
        disk([12.5, 0], 1),
        ring(1, [12.5, 0], "result"),
        note([11.25, -1.6], "✗", "s"),
      ],
      "Top row, simply connected (✓): a disk, a rectangle, and the plane with a ray removed, of which only a rectangle is shown. Bottom row, not simply connected (✗): an annulus, a disk with one point removed, and two separate disks, which are not even connected.",
      "上排是单连通的（✓）：圆盘、矩形，以及去掉一条射线的平面（图中只画出它的一个矩形部分）。下排不是单连通的（✗）：环形、去掉一点的圆盘、两个分离的圆盘（它们甚至不连通）。",
    );
  })(),
  "connected-and-simply-connected-regions#counting-connected-pieces": (() => {
    const frame = (dx: number, inside: Mark[], n: string): Mark[] => [
      ...flat([
        [dx, 0],
        [dx + 3.6, 0],
        [dx + 3.6, 3],
        [dx, 3],
      ]),
      ...inside,
      note([dx + 1.8, 0], n, "s"),
    ];
    return drawing(
      [
        ...frame(0, [seg([0, 1], [3.6, 2], "action")], "2"),
        ...frame(4.4, [ring(1, [6.2, 1.5], "action")], "2"),
        ...frame(8.8, [seg([8.8, 0.5], [12.4, 2.5], "action"), seg([8.8, 2.5], [12.4, 0.5], "action")], "4"),
        ...frame(13.2, [seg([13.2, 1], [16.8, 1], "action"), seg([13.2, 2], [16.8, 2], "action")], "3"),
        ...frame(17.6, [...dotAt([19.4, 1.5], undefined, "n", "action")], "1"),
      ],
      "Pieces left after removing something from the plane, of which a rectangle is shown. A line leaves 2, a circle 2, two crossing lines 4, two parallel lines 3, and a single point leaves 1.",
      "从平面（图中画出其一个矩形部分）去掉某些东西后剩下的块数。一条直线剩 2 块，一个圆剩 2 块，两条相交直线剩 4 块，两条平行直线剩 3 块，去掉一个点仍是 1 块。",
    );
  })(),
  "stream-functions#a-velocity-field-from-its-stream-function": graphed(
    wide(-1, 5, -1, 6),
    [
      curveOf((x) => 2 / x, "result", 0.4, 5),
      curveOf((x) => 4 / x, undefined, 0.7, 5, true),
      pt([1, 2], "(1, 2)", "ne"),
      toward([1, 2], [2, 0], "action"),
      tag([1.7, 0.45], "⟨1, −2⟩", "e"),
      tag([4, 0.5], "ψ = 2", "n"),
    ],
    "For example, ψ = xy gives P = ∂ψ/∂y = x and Q = −∂ψ/∂x = −y. At (1, 2) the velocity is ⟨1, −2⟩, tangent to the streamline ψ = 2. The field is divergence free: P_x + Q_y = 1 − 1 = 0.",
    "例如，ψ = xy 给出 P = ∂ψ/∂y = x，Q = −∂ψ/∂x = −y。在 (1, 2) 处速度为 ⟨1, −2⟩，与流线 ψ = 2 相切。该场无散度：P_x + Q_y = 1 − 1 = 0。",
  ),
  "the-divergence-of-a-vector-field#the-sign-of-divergence-from-a-drawing": drawing(
    [
      ...cross([0, 0], 2.8, false),
      ...arrows((x, y) => [x, y], [0, 0], grid, 0.3),
      note([0, -3], "∇·F > 0", "s"),
      ...cross([7.5, 0], 2.8, false),
      ...arrows((x, y) => [-x, -y], [7.5, 0], grid, 0.3),
      note([7.5, -3], "∇·F < 0", "s"),
      ...cross([15, 0], 2.8, false),
      ...arrows((x, y) => [-y, x], [15, 0], grid, 0.3),
      note([15, -3], "∇·F = 0", "s"),
    ],
    "Arrows spreading away from the point give positive divergence, on the left. Arrows converging on it give negative divergence, in the middle. A pure rotation, on the right, has zero divergence because its arrows neither gather nor spread.",
    "箭头从该点散开，散度为正（左图）。箭头向该点汇聚，散度为负（中图）。纯旋转（右图）散度为零，因为它的箭头既不聚集也不散开。",
  ),
  "the-curl-of-a-vector-field#the-scalar-curl-of-a-plane-field-at-a-point": drawing(
    [
      ...cross([0, 0], 2.8, false),
      ...arrows((x, y) => [-y, x], [0, 0], grid, 0.3),
      ...spin([0, 0], 0.6, 0, 1.6 * pi, "result"),
      note([0, -3], "∂Q/∂x − ∂P/∂y = 2", "s"),
      ...cross([8, 0], 2.8, false),
      ...arrows((x, y) => [y, -x], [8, 0], grid, 0.3),
      ...spin([8, 0], 0.6, 0, -1.6 * pi, "result"),
      note([8, -3], "∂Q/∂x − ∂P/∂y = −2", "s"),
    ],
    "For example, ⟨−y, x⟩ has scalar curl 2, positive, and a tiny paddle wheel would spin counterclockwise. ⟨y, −x⟩ has scalar curl −2, negative, and the wheel would spin clockwise.",
    "例如，⟨−y, x⟩ 的标量旋度为 2，是正的，小桨轮逆时针转。⟨y, −x⟩ 的标量旋度为 −2，是负的，小桨轮顺时针转。",
  ),
  "properties-of-the-curl-operator#the-curl-of-a-rigid-rotation": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...s.line([0, 0, -0.5], [0, 0, 2.2]),
        ...s.arrow([0, 0, 0], [0, 0, 1], "result"),
        ...s.say([0, 0, 1], "ω", "w"),
        ...s.arrow([0, 0, 0], [2, 0, 1]),
        ...s.say([1, 0, 0.5], "r", "sw"),
        ...s.circle([0, 0, 1], [1, 0, 0], [0, 1, 0], 2),
        ...s.arrow([2, 0, 1], [2, 2, 1], "action"),
        ...s.say([2, 2, 1], "v = ω × r", "e"),
        note(s.p([0, 0, 2.2]), "∇ × v = 2ω", "e"),
      ],
      "For example, with ω = ⟨0, 0, 1⟩ and r = ⟨2, 0, 1⟩, v = ω × r = ⟨0, 2, 0⟩, tangent to the circle around the axis. The curl of v is 2ω = ⟨0, 0, 2⟩ at every point.",
      "例如，取 ω = ⟨0, 0, 1⟩，r = ⟨2, 0, 1⟩，则 v = ω × r = ⟨0, 2, 0⟩，与绕轴的圆相切。v 的旋度处处为 2ω = ⟨0, 0, 2⟩。",
    );
  })(),
  "interior-and-boundary-points#classifying-points-relative-to-a-region-above-a-parabola": graphed(
    wide(-3, 4, -1, 6),
    [
      shape([...swing((x) => [x, x * x + 1], -2.2, 2.2, 40)], "result"),
      curveOf((x) => x * x + 1, undefined, -2.2, 2.2, true),
      bare([0, 3]),
      tag([0, 3.5], "3 > 1", "n"),
      { kind: "circle", center: [0, 3], r: 0.4 },
      bare([1, 2]),
      tag([1.5, 1.9], "2 = 2", "e"),
      { kind: "circle", center: [1, 2], r: 0.4 },
      bare([3, 1]),
      tag([3, 1.5], "1 < 10", "n"),
      { kind: "circle", center: [3, 1], r: 0.4 },
    ],
    "For example, S = {y > x² + 1}. At (0, 3), 3 > 1 and a small disk stays in S, so it is interior. At (1, 2), 2 = 2 and every disk reaches both sides of the dashed parabola, so it is a boundary point not in S. At (3, 1), 1 < 10 and it is exterior.",
    "例如，S = {y > x² + 1}。在 (0, 3) 处，3 > 1，小圆盘留在 S 内，是内点。在 (1, 2) 处，2 = 2，每个圆盘都伸到虚线抛物线两侧，是边界点但不属于 S。在 (3, 1) 处，1 < 10，是外点。",
  ),
  "interiors-and-boundaries-of-sets#the-length-of-the-boundary-of-a-rectangle": graphed(
    wide(-4, 4, -3, 3),
    [
      shape(
        [
          [-3, -2],
          [3, -2],
          [3, 2],
          [-3, 2],
        ],
        "result",
      ),
      joined([
        [-3, -2],
        [-3, 2],
      ]),
      joined([
        [3, -2],
        [3, 2],
      ]),
      joined(
        [
          [-3, 2],
          [3, 2],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [-3, -2],
          [3, -2],
        ],
        undefined,
        true,
      ),
      { kind: "point", at: [1, 0], open: true },
      tag([1.5, 2], "2a = 6", "n"),
      tag([3, 1], "2b = 4", "e"),
      tag([-1, 0], "L = 20", "n"),
    ],
    "For example, with a = 3 and b = 2, the set {|x| ≤ 3, |y| < 2} leaves out its dashed top and bottom edges and one inner point. Its boundary still has length 4a + 4b = 20; the removed point adds no length.",
    "例如，取 a = 3，b = 2，集合 {|x| ≤ 3, |y| < 2} 不含虚线的上下两边和内部一点。它的边界长度仍为 4a + 4b = 20；去掉的点不增加长度。",
  ),
  "interiors-and-boundaries-of-sets#both-circles-belong-to-the-boundary": drawing(
    [
      band([0, 0], 1, 2),
      ...chain(
        swing((t) => [2 * cos(t), 2 * sin(t)], 0, 2 * pi, 72),
        "result",
        true,
      ),
      ring(1),
      ring(0.25, [1, 0], "action"),
      ring(0.25, [-Math.SQRT2, Math.SQRT2], "action"),
      note([0, 0], "r = 1", "n"),
      note([0, -2], "r = 2", "s"),
    ],
    "For example, the annulus 1 ≤ r < 2 contains its solid inner circle but not its dashed outer one. Each small disk centered on either circle meets points of the set and points outside it, so both circles belong to the boundary.",
    "例如，环形 1 ≤ r < 2 包含实线的内圆，不包含虚线的外圆。以任一圆上的点为圆心的小圆盘既有集合内的点，也有集合外的点，所以两个圆都属于边界。",
  ),
  "the-domain-of-a-multivariable-function#the-area-of-a-domain": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(
        [
          [0, 0],
          [4, 0],
          [0, 4],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [4, 0],
          [0, 4],
          [0, 0],
        ],
        "result",
      ),
      tag([2, 2], "x + y = 4", "ne"),
      tag([1.2, 1.2], "A = 8", "n"),
    ],
    "For example, with c = 4, √x + √y + √(4 − x − y) needs x ≥ 0, y ≥ 0 and x + y ≤ 4. These give a triangle of area c²/2 = 8.",
    "例如，取 c = 4，√x + √y + √(4 − x − y) 要求 x ≥ 0、y ≥ 0 且 x + y ≤ 4。这些条件给出面积为 c²/2 = 8 的三角形。",
  ),
};
