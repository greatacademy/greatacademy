// Drawings in the explanations of Multivariable Calculus about affine and nonlinear maps, polar and hyperbolic coordinates, Lagrange multipliers, Newton's method and double integrals. Each coordinate is computed from the map or region it shows.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";
import { cross, flat, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const box = (x0: number, y0: number, x1: number, y1: number, tone?: "action" | "result", dashed = false) =>
  joined([...rect(x0, y0, x1, y1), [x0, y0]], tone, dashed);
const hyperRegion = (c1: number, c2: number, k1: number, k2: number): Point[] => [
  ...swing((x) => [x, k1 * x], sqrt(c1 / k1), sqrt(c2 / k1), 2),
  ...swing((t) => [sqrt(c2 / t), sqrt(c2 * t)], k1, k2, 30),
  ...swing((x) => [x, k2 * x], sqrt(c2 / k2), sqrt(c1 / k2), 2),
  ...swing((t) => [sqrt(c1 / t), sqrt(c1 * t)], k2, k1, 30),
];

/** multivariableDrawings3 holds the drawings of the Multivariable Calculus explanations about affine and nonlinear maps, coordinate changes, constrained extrema and double integrals, by explanation key. */
export const multivariableDrawings3: Readonly<Record<string, Figure>> = {
  "affine-transformations#evaluating-affine-transformations-on-points": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(rect(0, 0, 1, 1), "action"),
      box(0, 0, 1, 1, "action"),
      shape(
        [
          [1, 2],
          [3, 2],
          [4, 3],
          [2, 3],
        ],
        "result",
      ),
      joined(
        [
          [1, 2],
          [3, 2],
          [4, 3],
          [2, 3],
          [1, 2],
        ],
        "result",
      ),
      pt([1, 1], "(1, 1)", "e", "action"),
      pt([4, 3], "(4, 3)", "e", "result"),
      toward([1, 1], [3.85, 2.95]),
      tag([2.5, 4], "T(x, y) = (2x + y + 1, y + 2)", "n"),
    ],
    "For example, T(x, y) = (2x + y + 1, y + 2) stretches, shears and shifts the unit square into a parallelogram. The point (1, 1) goes to (2 + 1 + 1, 1 + 2) = (4, 3).",
    "例如，T(x, y) = (2x + y + 1, y + 2) 把单位正方形拉伸、错切并平移成一个平行四边形。点 (1, 1) 变为 (2 + 1 + 1, 1 + 2) = (4, 3)。",
  ),
  "affine-transformations#affine-maps-do-not-commute": graphed(
    wide(-1, 6, -1, 4),
    [
      pt([1, 1], "x", "w"),
      pt([2, 1], "S(x)", "s"),
      pt([2, 2], "T(x)", "nw"),
      pt([4, 2], "T(S(x))", "e", "result"),
      pt([3, 2], "S(T(x))", "n", "action"),
      toward([1, 1], [1.9, 1]),
      toward([2, 1], [3.92, 1.96], "result"),
      toward([1, 1], [1.93, 1.93]),
      toward([2, 2], [2.9, 2], "action"),
    ],
    "For example, T(x) = 2x and S(x) = x + ⟨1, 0⟩, applied to x = (1, 1). T(S(x)) = (4, 2) while S(T(x)) = (3, 2). They differ by ⟨1, 0⟩, the image ⟨2, 0⟩ of the shift under the linear part minus the shift itself.",
    "例如，T(x) = 2x，S(x) = x + ⟨1, 0⟩，作用于 x = (1, 1)。T(S(x)) = (4, 2)，而 S(T(x)) = (3, 2)。它们相差 ⟨1, 0⟩，即平移在线性部分下的像 ⟨2, 0⟩ 减去平移本身。",
  ),
  "the-image-of-an-affine-transformation#the-area-of-the-image-of-a-triangle": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(
        [
          [0, 0],
          [2, 0],
          [0, 1],
        ],
        "action",
      ),
      joined(
        [
          [0, 0],
          [2, 0],
          [0, 1],
          [0, 0],
        ],
        "action",
      ),
      tag([0.6, 0.3], "1", "n"),
      shape(
        [
          [1, 1],
          [5, 1],
          [2, 4],
        ],
        "result",
      ),
      joined(
        [
          [1, 1],
          [5, 1],
          [2, 4],
          [1, 1],
        ],
        "result",
      ),
      tag([2.7, 1.8], "6", "n"),
      tag([4.2, 3.4], "|det A| = 6", "n"),
    ],
    "For example, with A having rows (2, 1) and (0, 3), det A = 6, and b = ⟨1, 1⟩. The triangle with vertices (0, 0), (2, 0), (0, 1) has area 1. Its image, with vertices (1, 1), (5, 1), (2, 4), has area 1 · 6 = 6.",
    "例如，A 的两行为 (2, 1) 和 (0, 3)，det A = 6，b = ⟨1, 1⟩。顶点为 (0, 0)、(2, 0)、(0, 1) 的三角形面积为 1。它的像的顶点为 (1, 1)、(5, 1)、(2, 4)，面积为 1 · 6 = 6。",
  ),
  "the-image-of-an-affine-transformation#the-point-that-an-affine-map-sends-to-a-target": graphed(
    wide(-1, 7, -1, 7),
    [
      pt([5, 5], "y = (5, 5)", "e", "result"),
      pt([4, 4], "y − b = (4, 4)", "se"),
      pt([2, 2], "x = (2, 2)", "se", "action"),
      toward([5, 5], [4.1, 4.1]),
      toward([4, 4], [2.1, 2.1]),
      tag([3, 3], "A⁻¹", "nw"),
      tag([4.5, 4.5], "−b", "nw"),
    ],
    "For example, A has rows (1, 1) and (0, 2), b = ⟨1, 1⟩, and the target is y = (5, 5). First subtract b to get (4, 4), then solve Ax = (4, 4) to get x = (2, 2), the one preimage. Check: A(2, 2) + b = (5, 5).",
    "例如，A 的两行为 (1, 1) 和 (0, 2)，b = ⟨1, 1⟩，目标 y = (5, 5)。先减去 b 得 (4, 4)，再解 Ax = (4, 4) 得 x = (2, 2)，这是唯一的原像。验算：A(2, 2) + b = (5, 5)。",
  ),
  "the-image-of-an-affine-transformation#the-image-of-a-drawn-vertex-under-an-affine-map": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(
        [
          [0, 0],
          [1, 2],
          [2, 0],
        ],
        "action",
      ),
      joined(
        [
          [0, 0],
          [1, 2],
          [2, 0],
          [0, 0],
        ],
        "action",
      ),
      shape(
        [
          [1, 1],
          [3, 3],
          [5, 1],
        ],
        "result",
      ),
      joined(
        [
          [1, 1],
          [3, 3],
          [5, 1],
          [1, 1],
        ],
        "result",
      ),
      pt([1, 2], "(1, 2)", "n", "action"),
      pt([3, 3], "(3, 3)", "n", "result"),
    ],
    "For example, T(x, y) = (2x + 1, y + 1) is a linear map followed by a shift. Substituting the vertex (1, 2) gives (3, 3).",
    "例如，T(x, y) = (2x + 1, y + 1) 是线性映射后接平移。代入顶点 (1, 2) 得 (3, 3)。",
  ),
  "the-inverse-of-an-affine-transformation#inverting-affine-maps": graphed(
    wide(-1, 5, -1, 5),
    [
      pt([1, 1], "x = (1, 1)", "s"),
      pt([2, 1], "Ax = (2, 1)", "se"),
      pt([3, 3], "y = (3, 3)", "n", "result"),
      toward([1, 1], [1.9, 1], "action"),
      toward([2, 1], [2.95, 2.9], "action"),
      tag([1.4, 1.1], "A", "n"),
      tag([2.5, 2], "b", "e"),
      tag([2.6, 4.1], "T⁻¹(y) = A⁻¹(y − b)", "n"),
    ],
    "For example, with A having rows (2, 0) and (0, 1) and b = ⟨1, 2⟩, T takes (1, 1) to (2, 1) and then to (3, 3). To invert, reverse the steps in the opposite order: remove the shift, then apply A⁻¹.",
    "例如，A 的两行为 (2, 0) 和 (0, 1)，b = ⟨1, 2⟩，T 把 (1, 1) 先变为 (2, 1)，再变为 (3, 3)。求逆时按相反顺序撤销：先去掉平移，再作用 A⁻¹。",
  ),
  "the-inverse-of-an-affine-transformation#applying-the-inverse-of-a-coupled-affine-map": graphed(
    wide(-1, 6, -1, 4),
    [
      pt([4, 2], "(4, 2)", "ne", "result"),
      pt([3, 2], "(3, 2)", "se"),
      pt([1, 1], "(1, 1)", "s", "action"),
      toward([4, 2], [3.1, 2]),
      toward([3, 2], [1.1, 1.05]),
      tag([2, 1.5], "A⁻¹", "nw"),
    ],
    "For example, A has rows (2, 1) and (1, 1), so det A = 1, and b = ⟨1, 0⟩. For (u, v) = (4, 2), subtract b to get (3, 2), then apply A⁻¹, with rows (1, −1) and (−1, 2), to get (1, 1). Check: T(1, 1) = (3 + 1, 2) = (4, 2).",
    "例如，A 的两行为 (2, 1) 和 (1, 1)，所以 det A = 1，b = ⟨1, 0⟩。对 (u, v) = (4, 2)，减去 b 得 (3, 2)，再作用两行为 (1, −1)、(−1, 2) 的 A⁻¹ 得 (1, 1)。验算：T(1, 1) = (3 + 1, 2) = (4, 2)。",
  ),
  "the-inverse-of-an-affine-transformation#the-area-of-a-region-from-the-area-of-its-image": graphed(
    wide(-1, 10, -1, 4),
    [
      shape(rect(0, 0, 2, 2), "action"),
      box(0, 0, 2, 2, "action"),
      tag([1, 0.7], "4", "n"),
      shape(rect(3, 0, 9, 2), "result"),
      box(3, 0, 9, 2, "result"),
      tag([6, 0.7], "12", "n"),
      tag([5, 2.5], "|det A| = 3,  12/3 = 4", "n"),
    ],
    "For example, an image of area 12 under a map with |det A| = 3 comes from a region of area 12/3 = 4. There is no need to find the inverse map.",
    "例如，|det A| = 3 的映射下面积为 12 的像，来自面积为 12/3 = 4 的区域。不必求逆映射。",
  ),
  "nonlinear-transformations-of-plane-regions#the-image-of-a-vertical-line-under-a-nonlinear-map": drawing(
    [
      ...pane(0, [-1, 4, 1], [-2, 2, 1], 5, 4)
        .path(
          [
            [1, -2],
            [1, 2],
          ],
          "action",
        )
        .say(1, 1.4, "x = 1", "e")
        .marks(),
      ...head([6.3, 2], [7.9, 2]),
      note([7.1, 2], "T", "n"),
      ...pane(9, [-1, 6, 1], [-2, 2, 1], 7, 4, "u", "v")
        .path(
          swing((v) => [1 + v * v, v], -2, 2),
          "result",
        )
        .say(2.3, 0.7, "u = 1 + v²", "e")
        .marks(),
    ],
    "For example, with a = 1 and c = 1, the map T(x, y) = (x + y², y) sends the line x = 1 to the points (1 + y², y). With v = y its image is the parabola u = 1 + v².",
    "例如，取 a = 1，c = 1，映射 T(x, y) = (x + y², y) 把直线 x = 1 变为点 (1 + y², y)。令 v = y，其像是抛物线 u = 1 + v²。",
  ),
  "polar-coordinate-transformations#jacobian-of-polar-coordinate-transformation": (() => {
    const arc = (r: number, a: number, b: number, s?: "action" | "result"): Mark[] =>
      chain(
        swing((t) => [r * cos(t), r * sin(t)], a, b, 30),
        s,
      );
    const [a, b] = [0.5, 0.8];
    return drawing(
      [
        ...cross([0, 0], 5, true).slice(0, 4),
        seg([0, 0], [5 * cos(a), 5 * sin(a)]),
        seg([0, 0], [5 * cos(b), 5 * sin(b)]),
        {
          kind: "shade",
          points: [...swing((t) => [3 * cos(t), 3 * sin(t)], a, b, 20), ...swing((t) => [4 * cos(t), 4 * sin(t)], b, a, 20)],
          tone: "result",
        },
        ...arc(3, a, b, "result"),
        ...arc(4, a, b, "result"),
        note([3.5 * cos(a), 3.5 * sin(a)], "dr", "se"),
        note([4 * cos(0.65), 4 * sin(0.65)], "r dθ", "ne"),
        note([0.8, 0.25], "dθ", "e"),
        note([-1, 3.5], "J = r", "w"),
      ],
      "A small piece between radii r and r + dr and angles θ and θ + dθ has sides dr and r dθ. Its area is r dr dθ, so the Jacobian of polar coordinates is J = r.",
      "半径 r 到 r + dr、角度 θ 到 θ + dθ 之间的小块，两边为 dr 和 r dθ。其面积为 r dr dθ，所以极坐标的雅可比行列式 J = r。",
    );
  })(),
  "polar-coordinate-transformations#the-area-of-a-polar-rectangle": drawing(
    [
      ...pane(0, [0, 4, 1], [0, 2, 1], 5, 4, "r", "θ")
        .path(
          [
            [1, 0],
            [3, 0],
            [3, pi / 2],
            [1, pi / 2],
            [1, 0],
          ],
          "action",
        )
        .say(3, pi / 2, "θ = π/2", "e")
        .marks(),
      ...head([7.8, 2], [9, 2]),
      ...flat([...swing((t) => [10 + 3 * cos(t), 3 * sin(t)], 0, pi / 2, 30), ...swing((t) => [10 + cos(t), sin(t)], pi / 2, 0, 15)]),
      ...head([9.6, 0], [14, 0]),
      ...head([10, -0.4], [10, 4]),
      note([11, 0], "1", "s"),
      note([13, 0], "3", "s"),
      note([12.6, 2.6], "A = 2π", "ne"),
    ],
    "For example, the rectangle 1 ≤ r ≤ 3, 0 ≤ θ ≤ π/2 maps to a quarter of an annulus. Its area is (1/2)(π/2)(9 − 1) = 2π, the fraction (π/2)/(2π) of the full annulus of area 8π.",
    "例如，矩形 1 ≤ r ≤ 3，0 ≤ θ ≤ π/2 映射为四分之一圆环。其面积为 (1/2)(π/2)(9 − 1) = 2π，是面积 8π 的整个圆环的 (π/2)/(2π)。",
  ),
  "polar-coordinate-transformations#polar-coordinates-from-a-drawn-point": graphed(
    wide(-5, 4, -2, 5),
    [
      joined(
        [
          [0, 0],
          [-3, 3],
        ],
        "result",
      ),
      joined(
        [
          [-3, 0],
          [-3, 3],
        ],
        undefined,
        true,
      ),
      pt([-3, 3], "(−3, 3)", "nw"),
      { kind: "turn", center: [0, 0], from: [0.9, 0], degrees: 135 },
      tag([-1.5, 1.5], "r = 3√2", "ne"),
      tag([0.7, 0.7], "θ = 3π/4", "ne"),
    ],
    "For example, (−3, 3) lies in the second quadrant, at distance r = √(9 + 9) = 3√2 and angle θ = 3π/4. The arctangent alone would give −π/4, off by half a turn.",
    "例如，(−3, 3) 在第二象限，距原点 r = √(9 + 9) = 3√2，角度 θ = 3π/4。只用反正切会得到 −π/4，差半圈。",
  ),
  "transformations-of-regions-between-curves#mapping-hyperbolic-regions-to-rectangles": (() => {
    const c0 = pane(0, [0, 3, 1], [0, 4, 1], 9, 10);
    const scale = (p: Point): Point => [p[0] * 3, p[1] * 2.5];
    return drawing(
      [
        ...flat(hyperRegion(1, 4, 1, 4).map(scale)),
        ...c0.say(1.05, 4, "y = 4x", "e").say(1.65, 2.7, "xy = 4", "e").say(1.65, 1.45, "y = x", "e").say(0.75, 1.2, "xy = 1", "s").marks(),
        ...head([10.5, 5], [12.5, 5]),
        ...flat(rect(14 + 1.8, 2, 14 + 7.2, 8)),
        ...pane(14, [0, 5, 1], [0, 5, 1], 9, 10, "u", "v").marks(),
      ],
      "For example, the region between xy = 1, xy = 4, y = x and y = 4x is mapped by u = xy, v = y/x to the rectangle 1 ≤ u ≤ 4, 1 ≤ v ≤ 4.",
      "例如，xy = 1、xy = 4、y = x、y = 4x 之间的区域，在 u = xy、v = y/x 下映射为矩形 1 ≤ u ≤ 4，1 ≤ v ≤ 4。",
    );
  })(),
  "transformations-of-regions-between-curves#the-jacobian-of-the-hyperbola-ray-coordinates": graphed(
    wide(-0.5, 5, -0.5, 5),
    [
      ...[1, 2, 3].map((c) => curveOf((x) => c / x, undefined, c / 5, 5)),
      ...[1, 2, 4].map((m) => curveOf((x) => m * x, "action", 0, 5 / m)),
      pt([1, 2], "(1, 2)", "ne", "result"),
      tag([3.5, 2], "2v = 4", "e"),
    ],
    "For example, at (1, 2) the coordinates are u = xy = 2 and v = y/x = 2. Their Jacobian ∂(u, v)/∂(x, y) = 2y/x = 2v equals 4 there. The hyperbolas are curves of constant u and the rays are lines of constant v.",
    "例如，在 (1, 2) 处，坐标为 u = xy = 2，v = y/x = 2。雅可比行列式 ∂(u, v)/∂(x, y) = 2y/x = 2v 在此等于 4。双曲线是 u 为常数的曲线，射线是 v 为常数的直线。",
  ),
  "transformations-of-regions-between-curves#the-area-between-hyperbolas-and-rays": graphed(
    wide(-0.5, 3, -0.5, 4),
    [
      shape(hyperRegion(1, 2, 1, 4), "result"),
      joined([...hyperRegion(1, 2, 1, 4), [1, 1]], "result"),
      curveOf((x) => 1 / x, undefined, 0.35, 3, true),
      curveOf((x) => 2 / x, undefined, 0.55, 3, true),
      curveOf((x) => x, undefined, 0, 3, true),
      curveOf((x) => 4 * x, undefined, 0, 1, true),
      tag([0.9, 1.5], "A", "n"),
      tag([1.3, 3.5], "A = ln 2", "e"),
    ],
    "For example, between xy = 1, xy = 2, y = x and y = 4x. The area element 1/(2v) du dv gives A = ∫₁² du · ∫₁⁴ dv/(2v) = 1 · (1/2) ln 4 = ln 2.",
    "例如，xy = 1、xy = 2、y = x、y = 4x 之间的区域。面积元 1/(2v) du dv 给出 A = ∫₁² du · ∫₁⁴ dv/(2v) = 1 · (1/2) ln 4 = ln 2。",
  ),
  "the-jacobian#area-under-a-nonlinear-map-by-the-jacobian": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 3, 1], 5, 5, "u", "v")
        .path(
          [
            [1, 0],
            [2, 0],
            [2, 1],
            [1, 1],
            [1, 0],
          ],
          "action",
        )
        .marks(),
      ...flat(
        [
          [5 / 3, 0],
          [10 / 3, 0],
          [10 / 3, 5 / 3],
          [5 / 3, 5 / 3],
        ],
        "action",
      ),
      ...head([5.6, 3], [7, 3]),
      note([6.3, 3], "T", "n"),
      ...pane(8, [0, 3, 1], [0, 3, 1], 5, 5).marks(),
      ...flat([
        [8 + 5 / 3, 0],
        [8 + 10 / 3, 0],
        [8 + 10 / 3, 10 / 3],
        [8 + 5 / 3, 5 / 3],
      ]),
      note([8 + 4, 3], "A = 3/2", "n"),
    ],
    "For example, T(u, v) = (u, uv) has Jacobian u. The rectangle 1 ≤ u ≤ 2, 0 ≤ v ≤ 1 goes to the trapezoid with vertices (1, 0), (2, 0), (2, 2), (1, 1). Integrating u over the rectangle gives its area, 3/2.",
    "例如，T(u, v) = (u, uv) 的雅可比行列式为 u。矩形 1 ≤ u ≤ 2，0 ≤ v ≤ 1 变为顶点 (1, 0)、(2, 0)、(2, 2)、(1, 1) 的梯形。在矩形上对 u 积分得其面积 3/2。",
  ),
  "calculating-global-extrema-of-multivariable-functions#the-maximum-of-a-linear-function-on-a-triangle": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(
        [
          [0, 0],
          [4, 0],
          [1, 3],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [4, 0],
          [1, 3],
          [0, 0],
        ],
        "result",
      ),
      pt([0, 0], "f = 0", "sw"),
      pt([4, 0], "f = 4", "ne"),
      pt([1, 3], "f = 7", "ne", "result"),
      curveOf((x) => (7 - x) / 2, "action", -0.8, 5.5, true),
    ],
    "For example, f = x + 2y on the triangle with vertices (0, 0), (4, 0) and (1, 3). It is linear, so only the vertices need checking: the values are 0, 4 and 7. The maximum 7 is at (1, 3), on the dashed line x + 2y = 7.",
    "例如，f = x + 2y 在顶点为 (0, 0)、(4, 0)、(1, 3) 的三角形上。它是线性的，只需检查顶点：值为 0、4、7。最大值 7 在 (1, 3) 处，位于虚线 x + 2y = 7 上。",
  ),
  "lagrange-multipliers-with-one-constraint#optimizing-linear-functions-on-circles-using-lagrange": graphed(
    wide(-6, 9, -6, 9, 2),
    [
      { kind: "circle", center: [0, 0], r: 5 },
      curveOf((x) => (25 - 3 * x) / 4, "action", -1, 8.3, true),
      pt([3, 4], "(3, 4)", "sw", "result"),
      toward([3, 4], [6, 8], "result"),
      tag([6, 8], "∇f = ⟨3, 4⟩", "w"),
      tag([7, 2.2], "f = 25", "e"),
    ],
    "For example, f = 3x + 4y on x² + y² = 25. At the maximum (3, 4), ∇f = ⟨3, 4⟩ is parallel to ∇g = ⟨6, 8⟩, and the dashed level line 3x + 4y = 25 touches the circle. The maximum value is r√(a² + b²) = 5 · 5 = 25.",
    "例如，f = 3x + 4y，约束 x² + y² = 25。在最大值点 (3, 4) 处，∇f = ⟨3, 4⟩ 平行于 ∇g = ⟨6, 8⟩，虚线等值线 3x + 4y = 25 与圆相切。最大值为 r√(a² + b²) = 5 · 5 = 25。",
  ),
  "lagrange-multipliers-with-one-constraint#the-minimum-on-a-drawn-line-from-tangent-level-curves": graphed(
    wide(-1, 6, -1, 6),
    [
      curveOf((x) => 4 - x, undefined, -1, 5),
      { kind: "circle", center: [0, 0], r: sqrt(8), tone: "result" },
      joined(
        [
          [0, 0],
          [2, 2],
        ],
        "action",
        true,
      ),
      pt([2, 2], "(2, 2)", "ne", "result"),
      tag([3.2, 1.6], "x + y = 4", "ne"),
      tag([-0.7, 2.7], "f = 8", "n"),
    ],
    "For example, f = x² + y² on the line x + y = 4. The circle tangent to the line has f = 8 and touches it at (2, 2), the foot of the dashed perpendicular from the origin.",
    "例如，f = x² + y²，约束为直线 x + y = 4。与直线相切的圆 f = 8，切点 (2, 2) 是从原点作的虚线垂线的垂足。",
  ),
  "optimizing-multivariable-functions-using-lagrange-multipliers#the-minimum-of-a-sum-of-squares-on-a-line": graphed(
    wide(-1, 6, -1, 4),
    [
      curveOf((x) => (5 - x) / 2, undefined, -1, 5.5),
      toward([0, 0], [1, 2], "result"),
      pt([1, 2], "(1, 2)", "ne", "result"),
      { kind: "circle", center: [0, 0], r: sqrt(5), tone: "action" },
      tag([0.6, 1], "⟨1, 2⟩", "e"),
      tag([3.5, 1.6], "x + 2y = 5", "e"),
    ],
    "For example, to minimize x² + y² on x + 2y = 5, the gradient ⟨2x, 2y⟩ must be parallel to ⟨1, 2⟩. So the best point is the multiple (1, 2) of the normal vector, with x² + y² = 5, where the perpendicular from the origin meets the line.",
    "例如，要在 x + 2y = 5 上使 x² + y² 最小，梯度 ⟨2x, 2y⟩ 必须平行于 ⟨1, 2⟩。所以最优点是法向量的倍数 (1, 2)，此时 x² + y² = 5，也是从原点作的垂线与直线的交点。",
  ),
  "newtons-method-for-multivariable-functions#a-newton-step-for-a-circle-and-a-line": graphed(
    wide(-2, 3, -2, 3),
    [
      { kind: "circle", center: [0, 0], r: sqrt(2) },
      curveOf((x) => x, undefined, -2, 3),
      curveOf((x) => (-3 - 4 * (x - 2)) / 2 + 1, "action", 0.3, 2.3, true),
      pt([2, 1], "x₀ = (2, 1)", "e"),
      pt([7 / 6, 7 / 6], "x₁", "ne", "result"),
      tag([-1.9, 2.5], "x₁ = (7/6, 7/6)", "e"),
      bare([1, 1]),
      toward([2, 1], [1.27, 1.13], "result"),
    ],
    "For example, with a = 2, from x₀ = (2, 1), J has rows (4, 2) and (1, −1), and F = (3, 1). Solving JΔ = −F gives Δ = (−5/6, 1/6), so x₁ = (7/6, 7/6), where the dashed linearization of the circle meets the line. The root is (1, 1).",
    "例如，取 a = 2，从 x₀ = (2, 1) 出发，J 的两行为 (4, 2) 和 (1, −1)，F = (3, 1)。解 JΔ = −F 得 Δ = (−5/6, 1/6)，所以 x₁ = (7/6, 7/6)，即圆的虚线线性化与直线的交点。根为 (1, 1)。",
  ),
  "calculating-double-summations-over-partitions#area-of-subrectangles-in-grid-partitions": graphed(
    wide(-1, 7, -1, 5),
    [
      box(0, 0, 6, 4),
      joined([
        [2, 0],
        [2, 4],
      ]),
      joined([
        [4, 0],
        [4, 4],
      ]),
      joined([
        [0, 2],
        [6, 2],
      ]),
      shape(rect(2, 2, 4, 4), "result"),
      tag([3, 4], "Δx = 2", "n"),
      tag([4, 3], "Δy = 2", "e"),
      tag([3, 2.7], "ΔA = 4", "n"),
    ],
    "For example, R = [0, 6] × [0, 4] with m = 3 divisions in x and n = 2 in y. Each subrectangle has Δx = 2 and Δy = 2, so its area is ΔA = 4.",
    "例如，R = [0, 6] × [0, 4]，x 方向分 m = 3 份，y 方向分 n = 2 份。每个小矩形 Δx = 2，Δy = 2，面积 ΔA = 4。",
  ),
  "lower-riemann-sums-over-general-rectangular-partitions#lower-sum-with-unequal-subinterval-widths": graphed(
    wide(-1, 5, -1, 5),
    [
      box(0, 0, 3, 3),
      joined([
        [1, 0],
        [1, 3],
      ]),
      joined([
        [0, 2],
        [3, 2],
      ]),
      pt([0, 0], "0", "ne", "result"),
      pt([1, 0], "1", "ne", "result"),
      pt([0, 2], "2", "ne", "result"),
      pt([1, 2], "3", "ne", "result"),
      tag([1.5, 3.2], "L = 12", "n"),
    ],
    "For example, f = x + y with cut points x = [0, 1, 3] and y = [0, 2, 3]. On each rectangle the smallest value is at the corner nearest the origin: 0, 1, 2 and 3. So L = 0·1·2 + 1·2·2 + 2·1·1 + 3·2·1 = 12.",
    "例如，f = x + y，分点 x = [0, 1, 3]，y = [0, 2, 3]。每个矩形上的最小值在最靠近原点的角：0、1、2、3。所以 L = 0·1·2 + 1·2·2 + 2·1·1 + 3·2·1 = 12。",
  ),
  "double-integrals-over-rectangular-domains#evaluating-iterated-integrals-over-rectangles": graphed(
    wide(-1, 6, -1, 5),
    [
      shape(rect(0, 0, 2, 3), "result"),
      box(0, 0, 2, 3, "result"),
      joined(
        [
          [1.2, 0],
          [1.2, 3],
        ],
        "action",
      ),
      tag([1.2, 3], "∫ (x + y) dy", "n"),
      tag([3, 1.5], "∬ (x + y) dA = 15", "e"),
    ],
    "For example, with p = q = 1 on [0, 2] × [0, 3], hold x fixed and integrate along the strip in y, then integrate in x. This gives 1 · (4/2) · 3 + 1 · 2 · (9/2) = 6 + 9 = 15.",
    "例如，取 p = q = 1，在 [0, 2] × [0, 3] 上，固定 x 沿竖条对 y 积分，再对 x 积分。结果为 1 · (4/2) · 3 + 1 · 2 · (9/2) = 6 + 9 = 15。",
  ),
  "double-integrals-over-rectangular-domains#separable-double-integrals-of-monomials": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 3, 1], 5, 5)
        .f((x) => x, 0, 3)
        .under((x) => x, 0, 2)
        .wall(2)
        .say(1.5, 2.5, "∫ x dx = 2", "n")
        .marks(),
      ...pane(7.5, [0, 3, 1], [0, 9, 3], 5, 5, "y", "")
        .f((y) => y * y, 0, 3)
        .under((y) => y * y, 0, 3)
        .say(1.1, 6.5, "∫ y² dy = 9", "n")
        .marks(),
      note([12.6, 2.5], "2 · 9 = 18", "e"),
    ],
    "For example, xy² on [0, 2] × [0, 3] splits into a product of single integrals: ∫₀² x dx = 2 and ∫₀³ y² dy = 9, so the double integral is 18.",
    "例如，xy² 在 [0, 2] × [0, 3] 上分解为两个单积分的积：∫₀² x dx = 2，∫₀³ y² dy = 9，所以二重积分为 18。",
  ),
  "double-integrals-over-rectangular-domains#integrating-a-maximum-or-minimum-over-a-square": graphed(
    wide(-0.5, 2, -0.5, 1.5),
    [
      shape(
        [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
        "result",
      ),
      shape(
        [
          [0, 0],
          [1, 1],
          [0, 1],
        ],
        "action",
      ),
      box(0, 0, 1, 1),
      joined(
        [
          [0, 0],
          [1, 1],
        ],
        undefined,
        true,
      ),
      tag([0.32, 0.62], "max = y", "n"),
      tag([0.68, 0.22], "max = x", "n"),
      tag([1.1, 0.5], "∬ = 2/3", "e"),
    ],
    "For example, on the square [0, 1] × [0, 1], max(x, y) is y above the diagonal y = x and x below it. By symmetry the two triangles give equal integrals, each 1/3, so the integral is 2/3.",
    "例如，在正方形 [0, 1] × [0, 1] 上，max(x, y) 在对角线 y = x 上方等于 y，下方等于 x。由对称性，两个三角形的积分相等，各为 1/3，所以积分为 2/3。",
  ),
  "double-integrals-over-rectangular-domains#a-double-integral-over-a-drawn-rectangle": graphed(
    wide(-1, 7, -1, 5),
    [
      shape(rect(1, 1, 5, 3), "result"),
      box(1, 1, 5, 3, "result"),
      pt([3, 2], "(3, 2)", "e", "action"),
      tag([3, 3], "A = 8", "n"),
      tag([3, 3.8], "f = x + y,  f(3, 2) = 5,  ∬ = 40", "n"),
    ],
    "For example, f = x + y on [1, 5] × [1, 3], of area 8. Its center is (3, 2), where f = 5, so the integral is 8 · 5 = 40, the area times the value at the center.",
    "例如，f = x + y 在 [1, 5] × [1, 3] 上，面积为 8。中心 (3, 2) 处 f = 5，所以积分为 8 · 5 = 40，即面积乘中心的值。",
  ),
  "double-integrals-over-non-rectangular-domains#integrating-over-triangular-domains": graphed(
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
      joined(
        [
          [1.5, 0],
          [1.5, 2.5],
        ],
        "action",
      ),
      tag([2.8, 1.2], "y = 4 − x", "e"),
      tag([1.5, 2.5], "x", "n"),
      tag([3.5, 3.5], "∬ x dA = 32/3", "n"),
    ],
    "For example, with c = 4 and a = 1, at each x the strip runs from y = 0 to y = 4 − x. So ∬ x dA = ∫₀⁴ x(4 − x) dx = 4³/6 = 32/3.",
    "例如，取 c = 4，a = 1，在每个 x 处竖条从 y = 0 到 y = 4 − x。所以 ∬ x dA = ∫₀⁴ x(4 − x) dx = 4³/6 = 32/3。",
  ),
};
