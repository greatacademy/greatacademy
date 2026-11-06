// Drawings in the explanations of Multivariable Calculus about parametric surfaces, surface area, surface integrals, flux, the divergence theorem and Stokes' theorem.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { joined } from "./explanation-drawings-calculus-kit.ts";
import { tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, ring } from "./explanation-drawings-kit.ts";
import { flat, type P3, plus3, type Scene, scene, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
const side: P3 = [-0.5, sqrt(3) / 2, 0];

// The side of a cylinder about the z-axis: the two rims and the two outermost rulings.
const can = (s: Scene, R: number, z0: number, z1: number): Mark[] => [
  ...s.circle([0, 0, z0], [1, 0, 0], [0, 1, 0], R, undefined, true),
  ...s.circle([0, 0, z1], [1, 0, 0], [0, 1, 0], R),
  ...s.line(plus3([0, 0, z0], side, R), plus3([0, 0, z1], side, R)),
  ...s.line(plus3([0, 0, z0], side, -R), plus3([0, 0, z1], side, -R)),
];

// A cone z = kr, with its vertex at the origin, up to radius R.
const funnel = (s: Scene, k: number, R: number): Mark[] => [
  ...s.mesh((u, v) => [u * cos(v), u * sin(v), k * u], [0, R, 3], [0, 2 * pi, 12]),
];

// Arrows of length len going out of a sphere of radius r at the center c.
const outward = (s: Scene, r: number, len: number, tone: "action" | "result" = "action"): Mark[] =>
  (
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
      [0.71, 0.71, 0],
      [0.71, -0.71, 0],
      [0.71, 0, 0.71],
      [0, 0.71, 0.71],
      [0, -0.71, 0.71],
      [0, 0.71, -0.71],
      [0, -0.71, -0.71],
    ] as P3[]
  ).flatMap((d) => s.arrow(plus3([0, 0, 0], d, r), plus3([0, 0, 0], d, r + len), tone));

// The part of the disk of radius R between two vertical lines, the side view of a zone of a sphere.
function zone(R: number, a: number, b: number): Point[] {
  const up = swing((x) => [x, sqrt(R * R - x * x)] as Point, a, b, 24);
  const down = swing((x) => [x, -sqrt(R * R - x * x)] as Point, b, a, 24);
  return [...up, ...down];
}

/** multivariableDrawings7 draws the explanations of parametric surfaces, surface area, surface integrals, flux and the two theorems of space, by key. */
export const multivariableDrawings7: Readonly<Record<string, Figure>> = {
  "parametric-surfaces#matching-a-drawing-to-its-parametrization": (() => {
    const [a, b, c] = [scene(1.5, 0, 0), scene(1.5, 8, 0), scene(1.5, 16, 0)];
    return drawing(
      [
        ...a.mesh((u, v) => [u * cos(v), u * sin(v), u * u], [0, 1.6, 4], [0, 2 * pi, 12]),
        note([0, -2.2], "x² + y² = z", "s"),
        ...can(b, 2, 0, 3),
        ...b.mesh((u, v) => [2 * cos(v), 2 * sin(v), u], [0, 3, 0], [0, 2 * pi, 8]),
        note([8, -2.2], "x² + y² = 4", "s"),
        ...funnel(c, 2, 1.3),
        note([16, -2.2], "z = 2√(x² + y²)", "s"),
      ],
      "Three surfaces from their parametrizations: ⟨u cos v, u sin v, u²⟩ is the paraboloid x² + y² = z, ⟨2 cos v, 2 sin v, u⟩ is the cylinder x² + y² = 4, and ⟨u cos v, u sin v, 2u⟩ is a cone, with height 2 times the distance from the axis.",
      "由参数式得到的三个曲面：⟨u cos v, u sin v, u²⟩ 是抛物面 x² + y² = z，⟨2 cos v, 2 sin v, u⟩ 是柱面 x² + y² = 4，⟨u cos v, u sin v, 2u⟩ 是圆锥面，高度是到轴距离的 2 倍。",
    );
  })(),
  "tangent-planes-to-parametric-surfaces#finding-normal-vectors-and-tangent-planes-for-parametric-surfaces": (() => {
    const s = scene(1.5);
    const f = (u: number, v: number): P3 => [u, v, (u * u + v * v) / 4];
    const P = f(1, 1);
    return drawing(
      [
        ...s.mesh(f, [-0.5, 2, 5], [-0.5, 2, 5]),
        ...s.arrow(P, plus3(P, [1, 0, 0.5], 1), "action"),
        ...s.arrow(P, plus3(P, [0, 1, 0.5], 1), "action"),
        ...s.arrow(P, plus3(P, [-0.5, -0.5, 1], 1.4), "result"),
        ...s.dot(P),
        ...s.say(plus3(P, [1, 0, 0.5]), "rᵤ", "sw"),
        ...s.say(plus3(P, [0, 1, 0.5]), "rᵥ", "e"),
        ...s.say(plus3(P, [-0.5, -0.5, 1], 1.4), "⟨−½, −½, 1⟩", "n"),
      ],
      "For example, a = b = 1/4 at u = v = 1. The tangent vectors are rᵤ = ⟨1, 0, ½⟩ and rᵥ = ⟨0, 1, ½⟩. Their cross product is the normal vector ⟨−½, −½, 1⟩, which is ⟨−2au, −2bv, 1⟩ here.",
      "例如，a = b = 1/4，u = v = 1。切向量为 rᵤ = ⟨1, 0, ½⟩ 和 rᵥ = ⟨0, 1, ½⟩。它们的叉积是法向量 ⟨−½, −½, 1⟩，这里即 ⟨−2au, −2bv, 1⟩。",
    );
  })(),
  "parametrizations-of-ellipsoids-and-cones#parameterizing-ellipsoidal-and-conical-surfaces": (() => {
    const s = scene(1.3);
    const Q: P3 = [2 * cos(pi / 3), 2 * sin(pi / 3), 0];
    const P: P3 = [Q[0], Q[1], 2];
    return drawing(
      [
        ...s.axes(3, 3, 3.3),
        ...funnel(s, 1, 2),
        ...s.line([0, 0, 0], Q, "action"),
        ...s.line(Q, P, "action", true),
        ...s.curve((t) => [0.8 * cos(t), 0.8 * sin(t), 0], 0, pi / 3, "action"),
        ...s.dot(P, "⟨u cos v, u sin v, u⟩", "e"),
        ...s.say([1, 0.35, 0], "v", "s"),
        ...s.say([Q[0] / 2, Q[1] / 2, 0], "u", "se"),
      ],
      "For example, k = 1, the point at u = 2, v = π/3. In the plane z = 0, u is the distance from the axis and v is the angle from the x-axis, and the height is ku = 2.",
      "例如，k = 1，u = 2、v = π/3 处的点。在平面 z = 0 上，u 是到轴的距离，v 是从 x 轴起的角，高度为 ku = 2。",
    );
  })(),
  "parametrizations-of-ellipsoids-and-cones#the-parameter-of-a-point-on-an-elliptic-cone": (() => {
    const s = scene(1.2);
    const P: P3 = [2, sqrt(3), 2];
    return drawing(
      [
        ...s.axes(5, 3.2, 3.2),
        ...s.mesh((u, v) => [2 * u * cos(v), u * sin(v), u], [0, 2, 2], [0, 2 * pi, 12]),
        ...s.line([2, sqrt(3), 0], P, "action", true),
        ...s.dot(P, "(2, √3, 2)", "e"),
        ...s.say([2, sqrt(3), 0.35], "u = 2", "e"),
      ],
      "For example, a = 2 and b = 1, the point (2, √3, 2). Dividing gives 2/2 = 1 and √3/1 = √3, and 1² + (√3)² = 4 = u², so u = 2, which is also the height above the vertex.",
      "例如，a = 2，b = 1，点 (2, √3, 2)。相除得 2/2 = 1 和 √3/1 = √3，且 1² + (√3)² = 4 = u²，所以 u = 2，也就是点到顶点的高度。",
    );
  })(),
  "parametrizations-of-paraboloids-and-hyperboloids#cross-sections-of-a-hyperboloid-of-one-sheet": (() => {
    const s = scene(1.3);
    const f = (u: number, v: number): P3 => [sqrt(1 + u * u) * cos(v), sqrt(1 + u * u) * sin(v), u];
    return drawing(
      [
        ...s.mesh(f, [-1.5, 1.5, 0], [0, 2 * pi, 12]),
        ...s.circle([0, 0, 1.5], [1, 0, 0], [0, 1, 0], sqrt(1 + 2.25)),
        ...s.circle([0, 0, -1.5], [1, 0, 0], [0, 1, 0], sqrt(1 + 2.25), undefined, true),
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 1, "result", true),
        ...s.circle([0, 0, 1], [1, 0, 0], [0, 1, 0], sqrt(2), "action", true),
        ...s.circle([0, 0, -1], [1, 0, 0], [0, 1, 0], sqrt(2), "action", true),
        note([3.2, 0], "z = 0,  r = 1", "e"),
        note([3.2, 1.3], "z = ±1,  r = √2", "e"),
      ],
      "For example, a = c = 1. The circle at height z = cu has radius a√(1 + u²). The waist at z = 0 has radius 1, and at z = 1 and z = −1 the radius is √2.",
      "例如，a = c = 1。高度 z = cu 处的圆半径为 a√(1 + u²)。z = 0 处的腰半径为 1，z = 1 和 z = −1 处半径为 √2。",
    );
  })(),
  "parametrizations-of-cylinders#parameterizing-cylindrical-surfaces": (() => {
    const s = scene(1.3);
    const u = pi / 6;
    const P: P3 = [2 * cos(u), 2 * sin(u), 1.5];
    return drawing(
      [
        ...can(s, 2, 0, 3),
        ...s.arrow(P, plus3(P, [-sin(u), cos(u), 0], 1), "action"),
        ...s.arrow(P, plus3(P, [0, 0, 1], 1), "action"),
        ...s.arrow(P, plus3(P, [cos(u), sin(u), 0], 1.4), "result"),
        ...s.dot(P),
        ...s.say(plus3(P, [-sin(u), cos(u), 0], 1), "rᵤ", "e"),
        ...s.say(plus3(P, [0, 0, 1], 1), "rᵥ", "n"),
        ...s.say(plus3(P, [cos(u), sin(u), 0], 1.4), "rᵤ × rᵥ", "sw"),
        note([0, -2.4], "‖rᵤ × rᵥ‖ = R = 2", "s"),
      ],
      "For example, R = 2. At each point rᵤ runs around the cylinder and rᵥ runs up it, and their cross product points straight out from the axis, with length R = 2. All three arrows are shown scaled.",
      "例如，R = 2。在每一点，rᵤ 绕柱面而行，rᵥ 沿柱面向上，它们的叉积垂直于轴向外，长度为 R = 2。三个箭头都按比例画出。",
    );
  })(),
  "parametrizations-of-cylinders#the-area-element-of-an-elliptic-cylinder": graphed(
    wide(-3, 6, -2, 3),
    [
      { kind: "path", points: swing((t) => [2 * cos(t), sin(t)] as Point, 0, 2 * pi, 80) },
      toward([2, 0], [2, 1], "action"),
      toward([0, 1], [-2, 1], "result"),
      pt([2, 0], "", "n"),
      tag([2.2, -0.65], "u = 0", "e"),
      pt([0, 1], "u = π/2", "ne"),
      tag([2.1, 1], "‖rᵤ‖ = b = 1", "e"),
      tag([-2, 1.2], "‖rᵤ‖ = a = 2", "n"),
    ],
    "For example, a = 2 and b = 1, the cylinder seen from above. Since rᵥ has length 1 and is perpendicular to rᵤ, the area element is ‖rᵤ‖: it equals b = 1 at u = 0 and a = 2 at u = π/2.",
    "例如，a = 2，b = 1，从上方看柱面。因为 rᵥ 长度为 1 且垂直于 rᵤ，面积元即 ‖rᵤ‖：u = 0 处等于 b = 1，u = π/2 处等于 a = 2。",
  ),
  "parametrizations-of-cylinders#integrating-the-height-over-a-cylinder": (() => {
    const s = scene(1.3);
    const piece: P3[] = [
      [2 * cos(0.2), 2 * sin(0.2), 1.3],
      [2 * cos(0.9), 2 * sin(0.9), 1.3],
      [2 * cos(0.9), 2 * sin(0.9), 1.8],
      [2 * cos(0.2), 2 * sin(0.2), 1.8],
    ];
    return drawing(
      [
        ...can(s, 2, 0, 3),
        ...s.patch(piece),
        ...s.say([2 * cos(0.55), 2 * sin(0.55), 1.3], "R du", "s"),
        ...s.say([2 * cos(0.9), 2 * sin(0.9), 1.55], "dv", "e"),
        note([0, -2], "∬ z dS = 2π · 2 · ∫₀³ v dv = 18π", "s"),
      ],
      "For example, f = z with R = 2 and H = 3. A piece of the side has area R du dv. The height does not depend on u, so going around gives the factor 2π, and 2π · 2 · 9/2 = 18π.",
      "例如，f = z，R = 2，H = 3。侧面的一小块面积为 R du dv。高度与 u 无关，所以绕一圈给出因子 2π，2π · 2 · 9/2 = 18π。",
    );
  })(),
  "areas-of-parametric-surfaces#the-lateral-area-of-a-cone": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...funnel(s, 0.75, 2),
        ...s.line([0, 0, 1.5], plus3([0, 0, 1.5], side, 2), "action"),
        ...s.line([0, 0, 0], plus3([0, 0, 1.5], side, 2), "result"),
        ...s.say(plus3([0, 0, 1.5], side, 1), "R = 2", "n"),
        ...s.say(plus3([0, 0, 0.75], side, 1), "ℓ = 5/2", "nw"),
        note([0, -0.8], "πRℓ = 5π", "s"),
      ],
      "For example, k = 3/4 and R = 2. Then √(1 + k²) = 5/4, so the slant height is ℓ = 5/2, and the area πR²√(1 + k²) = πRℓ is 5π.",
      "例如，k = 3/4，R = 2。于是 √(1 + k²) = 5/4，所以斜高为 ℓ = 5/2，面积 πR²√(1 + k²) = πRℓ 为 5π。",
    );
  })(),
  "areas-of-parametric-surfaces#the-surface-area-of-a-torus": (() => {
    const s = scene(1.2);
    const f = (u: number, v: number): P3 => [(2 + cos(v)) * cos(u), (2 + cos(v)) * sin(u), sin(v)];
    return drawing(
      [
        ...s.mesh(f, [0, 2 * pi, 10], [0, 2 * pi, 6]),
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2, "action"),
        note([0, -2.8], "2πR · 2πr = 8π²", "s"),
      ],
      "For example, R = 2 and r = 1. The central circle has length 2πR and the tube has circumference 2πr. Their product is 4π²Rr = 8π².",
      "例如，R = 2，r = 1。中心圆长 2πR，管的周长 2πr。二者之积为 4π²Rr = 8π²。",
    );
  })(),
  "surfaces-of-revolution#area-of-general-surfaces-of-revolution": (() => {
    const s = scene(1.4);
    const cyl = (u: number, v: number): P3 => [cos(v), u, sin(v)];
    return drawing(
      [
        ...s.mesh(cyl, [0, 3, 3], [0, 2 * pi, 8]),
        ...s.line([0, -0.6, 0], [0, 3.6, 0], undefined, true),
        ...s.line([0, 0, 1], [0, 3, 1], "result"),
        ...s.line([0, 0, 0], [0, 0, 1], "action"),
        ...s.say([0, 0, 0.5], "R = 1", "w"),
        ...s.say([0, 1.5, 1], "H = 3", "n"),
        note([1, -2.6], "2πRH = 6π", "s"),
      ],
      "For example, R = 1 and H = 3. The horizontal segment turns about the axis, dashed, into the side of a cylinder of area 2πRH = 6π. Divided by π, this is 2RH = 6.",
      "例如，R = 1，H = 3。水平线段绕虚线轴旋转成圆柱侧面，面积 2πRH = 6π。除以 π 得 2RH = 6。",
    );
  })(),
  "surfaces-of-revolution#the-area-of-a-spherical-zone": graphed(
    wide(-3, 3, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      { kind: "polygon", points: zone(2, 0, 1), tone: "result" },
      { kind: "polygon", points: zone(2, 1, 2), tone: "action" },
      tag([0.5, 0.9], "4π", "n"),
      tag([1.5, 0.15], "4π", "n"),
    ],
    "For example, R = 2, seen from the side, with the x-axis as the axis of revolution. The slabs 0 ≤ x ≤ 1 and 1 ≤ x ≤ 2 have the same width 1, so the zones have the same area 2πR · 1 = 4π, although they sit in different places.",
    "例如，R = 2，从侧面看，x 轴为旋转轴。薄片 0 ≤ x ≤ 1 和 1 ≤ x ≤ 2 宽度都是 1，所以两个球带面积相同，都是 2πR · 1 = 4π，尽管位置不同。",
  ),
  "surfaces-of-revolution#the-surface-area-of-a-torus": graphed(
    wide(-5, 7, -2, 3),
    [
      { kind: "circle", center: [3, 0], r: 1 },
      { kind: "circle", center: [-3, 0], r: 1, dashed: true },
      joined(
        [
          [0, 0],
          [3, 0],
        ],
        "action",
      ),
      joined(
        [
          [3, 0],
          [3, 1],
        ],
        "result",
      ),
      pt([3, 0], "", "n"),
      tag([1.5, 0], "R = 3", "n"),
      tag([4.1, 0.9], "r = 1", "e"),
      tag([0.1, 2.4], "2πr · 2πR = 12π²", "e"),
    ],
    "For example, r = 1 and R = 3, a section through the axis, which is the y-axis. The circle has length 2πr and its center travels 2πR, so the area is 2π · 2π · 3 = 12π². The dashed circle is the same circle half a turn later.",
    "例如，r = 1，R = 3，过轴（y 轴）的截面。圆长 2πr，圆心走过 2πR，所以面积为 2π · 2π · 3 = 12π²。虚线圆是同一个圆转过半圈后的位置。",
  ),
  "areas-of-surfaces#computing-surface-area-for-graphs-z-equals-f-of-x-y": (() => {
    const s = scene(1.3);
    return drawing(
      [
        ...s.axes(2, 2, 4.6),
        ...s.patch([
          [0, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ]),
        ...s.patch(
          [
            [0, 0, 0],
            [1, 0, 2],
            [1, 1, 4],
            [0, 1, 2],
          ],
          "action",
        ),
        note([1.8, 2.6], "z = 2x + 2y", "e"),
        note([1.8, 1.4], "S = 3 · 1 = 3", "e"),
      ],
      "For a = b = 2, as in the text, and for example W = H = 1 and c = 0. The plane has the constant area factor √(1 + 4 + 4) = 3, so above the square of area 1 its area is 3.",
      "取文中的 a = b = 2，并例如取 W = H = 1，c = 0。平面的面积因子恒为 √(1 + 4 + 4) = 3，所以在面积为 1 的正方形上方，其面积为 3。",
    );
  })(),
  "areas-of-surfaces#area-of-a-curved-graph-over-a-rectangle": (() => {
    const s = scene(1.2);
    const f = (x: number, y: number): P3 => [x, y, (2 / 3) * x ** 1.5];
    return drawing(
      [
        ...s.axes(4, 3, 4),
        ...s.mesh(f, [0, 3, 6], [0, 2, 4]),
        ...s.say([3, 0, 0], "a = 3", "se"),
        ...s.say([0, 2, 0], "b = 2", "s"),
        note([0, -3.2], "A = 2 ∫₀³ √(1 + x) dx = 28/3", "s"),
      ],
      "For example, a = 3 and b = 2. Since f_y = 0, the surface bends only in x, and A = 2 ∫₀³ √(1 + x) dx = (4/3)(8 − 1) = 28/3.",
      "例如，a = 3，b = 2。因为 f_y = 0，曲面只沿 x 方向弯曲，A = 2 ∫₀³ √(1 + x) dx = (4/3)(8 − 1) = 28/3。",
    );
  })(),
  "areas-of-surfaces#the-area-of-a-cone-above-a-disk": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...funnel(s, 0.75, 2),
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2, "action"),
        ...s.say(plus3([0, 0, 0], side, 2), "A(D) = 4π", "e"),
        note([0, -2.6], "√(1 + k²) = 5/4,  (5/4) · 4π = 5π", "s"),
      ],
      "For example, k = 3/4 above the disk D of radius 2. The tilt is the same at all points, so the square root is the constant 5/4, and the area of the cone is 5/4 times the area 4π of the disk, that is 5π.",
      "例如，k = 3/4，在半径 2 的圆盘 D 上方。各点倾斜相同，所以根式为常数 5/4，圆锥面积是圆盘面积 4π 的 5/4 倍，即 5π。",
    );
  })(),
  "surface-integrals-over-parametric-surfaces#a-surface-integral-over-a-cylinder": (() => {
    const s = scene(1.2);
    const W = 2 * pi * 0.6;
    const [x0, y0, h] = [4, -1, 3 * 0.8];
    return drawing(
      [
        ...can(s, 2, 0, 3),
        ...s.say(plus3([0, 0, 3], side, 1), "R = 2", "n"),
        ...s.say(plus3([0, 0, 1.5], side, -2), "H = 3", "e"),
        ...flat([
          [x0, y0],
          [x0 + W, y0],
          [x0 + W, y0 + h],
          [x0, y0 + h],
        ]),
        note([x0 + W / 2, y0], "u: 0 … 2π", "s"),
        note([x0 + W / 2, y0 + h / 2], "dS = 2 du dv", "n"),
        note([x0, y0 + h], "v: 0 … 3", "n"),
        note([0, -2.6], "∬ (x² + y²) dS = 48π", "s"),
        note([0, -3.7], "∬ z dS = 18π", "s"),
      ],
      "For example, R = 2 and H = 3. On the parameter rectangle dS = 2 du dv. Then the integral of x² + y² is 2πR³H = 48π and the integral of z is πRH² = 18π.",
      "例如，R = 2，H = 3。在参数矩形上 dS = 2 du dv。于是 x² + y² 的积分为 2πR³H = 48π，z 的积分为 πRH² = 18π。",
    );
  })(),
  "surface-integrals-over-parametric-surfaces#a-surface-integral-over-a-sphere-by-symmetry": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.sphere(2),
        ...s.axes(3.2, 3.2, 3.2),
        note([0, -3.6], "x² + y² + z² = R²", "s"),
        note([0, -4.7], "∬ x² dS = (R²/3)(4πR²) = 64π/3", "s"),
      ],
      "For example, R = 2. The integrals of x², y² and z² are equal and their sum is R² times the area, so each has average value R²/3 = 4/3. Times the area 16π, this is 64π/3.",
      "例如，R = 2。x²、y²、z² 的积分相等，其和为 R² 乘面积，所以每个的平均值为 R²/3 = 4/3。乘面积 16π，得 64π/3。",
    );
  })(),
  "surface-integrals-over-cartesian-surfaces#integrating-scalar-functions-over-graphs-z-equals-g-of-x-y": (() => {
    const s = scene(1.3);
    return drawing(
      [
        ...s.axes(2, 2, 4.6),
        ...s.patch([
          [0, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ]),
        ...s.mesh((x, y) => [x, y, 2 * x + 2 * y], [0, 1, 2], [0, 1, 2], "action"),
        note([1.8, 2.6], "dS = 3 dA", "e"),
        note([1.8, 1.4], "3c · A(D) = 6", "e"),
      ],
      "For the plane z = 2x + 2y of the text, and for example c = 2 and D the square of area 1. Every piece of the plane has 3 times the area of the piece below it, so the integral is 3 · 2 · 1 = 6.",
      "对文中的平面 z = 2x + 2y，例如取 c = 2，D 为面积 1 的正方形。平面的每一小块面积是其下方小块的 3 倍，所以积分为 3 · 2 · 1 = 6。",
    );
  })(),
  "surface-integrals-over-cartesian-surfaces#integrating-a-nonconstant-function-over-a-plane": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.axes(3, 2, 3.2),
        ...s.patch([
          [0, 0, 0],
          [2, 0, 0],
          [2, 1, 0],
          [0, 1, 0],
        ]),
        ...s.mesh((x, y) => [x, y, x / 2 + y], [0, 2, 2], [0, 1, 2], "action"),
        note([2.5, 2.2], "√(1 + p² + q²) = 3/2", "e"),
        note([2.5, 1.4], "W²H/2 = 2", "e"),
        note([2.5, 0.6], "(3/2) · 2 = 3", "e"),
      ],
      "For example, p = 1/2, q = 1, W = 2 and H = 1, with f = x. The area factor is 3/2, and the double integral is W²H/2 = 2, so the surface integral is 3.",
      "例如，p = 1/2，q = 1，W = 2，H = 1，f = x。面积因子为 3/2，二重积分 W²H/2 = 2，所以曲面积分为 3。",
    );
  })(),
  "surface-integrals-over-cartesian-surfaces#a-surface-integral-over-a-paraboloid": (() => {
    const s = scene(1.4);
    const f = (r: number, t: number): P3 => [r * cos(t), r * sin(t), (r * r) / 2];
    return drawing(
      [
        ...s.mesh(f, [0, sqrt(3), 4], [0, 2 * pi, 12]),
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], sqrt(3), "action", true),
        note([0, -1.7], "dS = √(1 + r²) r dr dθ", "s"),
        note([0, -2.7], "S = 14π/3", "s"),
      ],
      "For example, the area of the part with r ≤ √3, where f = 1. The factor √(1 + r²) changes with r, and with the factor r from polar coordinates the integral is 2π[(1 + r²)^(3/2)/3] from 0 to √3 = 2π · 7/3 = 14π/3.",
      "例如，求 r ≤ √3 部分的面积，此时 f = 1。因子 √(1 + r²) 随 r 变化，加上极坐标的因子 r，积分为 2π[(1 + r²)^(3/2)/3]，从 0 到 √3，= 2π · 7/3 = 14π/3。",
    );
  })(),
  "flux-in-three-dimensional-vector-fields#flux-of-a-position-field-through-a-horizontal-square": (() => {
    const s = scene(1.5);
    const h = 3;
    const pts: P3[] = [
      [0, 0, h],
      [2, 0, h],
      [2, 1, h],
      [0, 1, h],
    ];
    const F = (x: number, y: number): Mark[] => {
      const P: P3 = [x, y, h];
      return [...s.arrow(P, plus3(P, P, 0.4), "action"), ...s.line(P, [x, y, h + 1.2], undefined, true)];
    };
    return drawing(
      [
        ...s.axes(3, 2.2, 4.6),
        ...s.patch(pts),
        ...F(0.5, 0.5),
        ...F(1.5, 0.5),
        ...F(0.5, 1),
        note([2.2, 3.2], "F·k = z = 3", "e"),
        note([2.2, 2.2], "3 · 2 = 6", "e"),
      ],
      "For example, h = 3 and the rectangle [0, 2] × [0, 1] of area 2. The arrows of F vary, but the z-component of each, dashed and scaled like the arrows, is the same h = 3. So the flux is 3 · 2 = 6.",
      "例如，h = 3，矩形 [0, 2] × [0, 1]，面积 2。F 的箭头各不相同，但每个的 z 分量（虚线，与箭头同比例）都等于 h = 3。所以通量为 3 · 2 = 6。",
    );
  })(),
  "flux-in-three-dimensional-vector-fields#the-flux-of-a-constant-field-through-a-tilted-triangle": (() => {
    const s = scene(1.5);
    const P: P3 = [2 / 3, 2 / 3, 2 / 3];
    return drawing(
      [
        ...s.axes(2.8, 2.8, 2.8),
        ...s.patch([
          [2, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ]),
        ...s.arrow(P, plus3(P, [1, 1, 1], 1), "action"),
        ...s.say(plus3(P, [1, 1, 1], 1), "A = ⟨2, 2, 2⟩", "n"),
        note([3, 2], "F = ⟨1, 2, 3⟩", "e"),
        note([3, 1], "F·A = 2 + 4 + 6 = 12", "e"),
      ],
      "For example, the triangle with vertices (2, 0, 0), (0, 2, 0), (0, 0, 2) and F = ⟨1, 2, 3⟩. Half the cross product of the edges ⟨−2, 2, 0⟩ and ⟨−2, 0, 2⟩ is the area vector A = ⟨2, 2, 2⟩, shown scaled, and F·A = 12.",
      "例如，顶点为 (2, 0, 0)、(0, 2, 0)、(0, 0, 2) 的三角形，F = ⟨1, 2, 3⟩。边 ⟨−2, 2, 0⟩ 与 ⟨−2, 0, 2⟩ 叉积的一半是面积向量 A = ⟨2, 2, 2⟩（按比例画出），F·A = 12。",
    );
  })(),
  "flux-through-closed-surfaces#outward-orientation-and-net-flux-through-closed-surfaces": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.sphere(1.5),
        ...([-0.8, 0, 0.8] as const).flatMap((y) => s.arrow([0, y, -2.4], [0, y, -sqrt(2.25 - y * y)], "action")),
        ...([-0.8, 0, 0.8] as const).flatMap((y) => s.arrow([0, y, sqrt(2.25 - y * y)], [0, y, 2.4], "action")),
        note([0, 3.4], "+", "e"),
        note([0, -3.4], "−", "e"),
        note([3, 1], "C", "e"),
        note([3, 0], "∯ C·dS = 0", "e"),
      ],
      "For example, a constant upward field C through a sphere. What enters through the lower side, with negative flux, leaves through the upper side, with the same flux positive, and the net flux is 0.",
      "例如，竖直向上的常向量场 C 穿过球面。从下侧进入的（通量为负）从上侧离开（通量同值为正），净通量为 0。",
    );
  })(),
  "flux-through-closed-surfaces#outward-flux-of-a-radial-field-through-a-sphere": (() => {
    const s = scene(1.2);
    return drawing(
      [...s.sphere(2), ...outward(s, 2, 0.8), note([3.8, 1], "F·n = kR = 2", "e"), note([3.8, 0], "2 · 16π = 32π", "e")],
      "For example, k = 1 and R = 2. The field points along the normal with constant size kR = 2. Times the area 16π, the net outward flux is 4πkR³ = 32π.",
      "例如，k = 1，R = 2。场沿法向，大小恒为 kR = 2。乘面积 16π，净外通量为 4πkR³ = 32π。",
    );
  })(),
  "flux-through-closed-surfaces#the-flux-of-an-inverse-square-field-through-a-sphere": (() => {
    const s = scene(1.2);
    return drawing(
      [
        ...s.sphere(1),
        ...s.sphere(2),
        ring(0.1, [0, 0]),
        note([2.8, 1], "R = 1:  1 · 4π = 4π", "e"),
        note([2.8, 0], "R = 2:  (1/4) · 16π = 4π", "e"),
      ],
      "For example, k = 1 on spheres of radius 1 and 2. The field's size is 1 and 1/4 and the areas are 4π and 16π, so both fluxes are 4π. The field is not defined at the center, shown with an open circle.",
      "例如，k = 1，半径 1 和 2 的球面。场的大小为 1 和 1/4，面积为 4π 和 16π，所以两个通量都是 4π。场在中心无定义，用空心圆表示。",
    );
  })(),
  "calculating-flux-through-parametric-surfaces#outward-flux-through-a-cylinder": (() => {
    const s = scene(1.2);
    const P: P3 = [2 * cos(0.5), 2 * sin(0.5), 1.5];
    const Q: P3 = [2 * cos(1.7), 2 * sin(1.7), 2];
    return drawing(
      [
        ...can(s, 2, 0, 3),
        ...s.arrow(P, plus3(P, [cos(0.5), sin(0.5), 0], 1.2), "action"),
        ...s.arrow(Q, plus3(Q, [cos(1.7), sin(1.7), 0], 1.2), "action"),
        ...s.line(P, plus3(P, [0, 0, 1]), undefined, true),
        ...s.say(plus3(P, [0, 0, 1]), "g(z)", "n"),
        note([3.3, 1.5], "F·(rᵤ × rᵥ) = kR² = 4", "e"),
        note([3.3, 0.5], "4 · 2π · 3 = 24π", "e"),
      ],
      "For example, k = 1, R = 2 and H = 3. The dot product with the outward cross product is kR² = 4 over the parameter rectangle of area 2π · 3. The flux is 24π. The z-component g(z), dashed, lies along the side and contributes nothing.",
      "例如，k = 1，R = 2，H = 3。与向外叉积的点积为 kR² = 4，参数矩形面积 2π · 3。通量为 24π。z 分量 g(z)（虚线）沿侧面方向，没有贡献。",
    );
  })(),
  "calculating-flux-through-parametric-surfaces#the-flux-through-a-hemisphere": (() => {
    const s = scene(1.3);
    const dirs: P3[] = [
      [0, 0, 1],
      [0.71, 0, 0.71],
      [0, 0.71, 0.71],
      [0, -0.71, 0.71],
      [-0.48, 0.83, 0.3],
      [0.48, -0.83, 0.3],
    ];
    return drawing(
      [
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2, undefined, true),
        ...s.curve((t) => plus3([0, 0, 0], plus3([0, 0, sin(t)], side, cos(t)), 2), 0, pi),
        ...dirs.flatMap((d) => s.arrow(plus3([0, 0, 0], d, 2), plus3([0, 0, 0], d, 2.7), "action")),
        note([3.5, 2], "F·n = kR = 2", "e"),
        note([3.5, 1], "2 · 8π = 16π", "e"),
      ],
      "For example, k = 1 and R = 2 on the upper hemisphere. The field is normal to the surface with constant size 2, and the area is 2πR² = 8π. So the flux is 16π.",
      "例如，k = 1，R = 2，上半球面。场垂直于曲面，大小恒为 2，面积 2πR² = 8π。所以通量为 16π。",
    );
  })(),
  "calculating-flux-through-cartesian-surfaces#flux-through-explicit-surfaces-z-equals-g-of-x-y": (() => {
    const s = scene(1.5);
    const g = (x: number, y: number): P3 => [x, y, (x + y) / 2];
    const P = g(1, 1);
    return drawing(
      [
        ...s.axes(3, 3, 3),
        ...s.mesh(g, [0, 2, 4], [0, 2, 4]),
        ...s.arrow(P, plus3(P, [-0.5, -0.5, 1], 1.2), "result"),
        ...s.arrow(P, plus3(P, [2, 0, 3], 0.35), "action"),
        ...s.say(plus3(P, [-0.5, -0.5, 1], 1.2), "⟨−½, −½, 1⟩", "n"),
        ...s.say(plus3(P, [2, 0, 3], 0.35), "F", "e"),
        note([3, 2], "F = ⟨2, 0, 3⟩", "e"),
        note([3, 1], "−1 − 0 + 3 = 2", "e"),
      ],
      "For example, z = (x + y)/2, so g_x = g_y = ½ and the upward normal element is ⟨−½, −½, 1⟩ dA. For F = ⟨2, 0, 3⟩, F·dS = (−1 − 0 + 3) dA = 2 dA. The arrow of F is shown scaled.",
      "例如，z = (x + y)/2，所以 g_x = g_y = ½，向上法向元为 ⟨−½, −½, 1⟩ dA。对 F = ⟨2, 0, 3⟩，F·dS = (−1 − 0 + 3) dA = 2 dA。F 的箭头按比例画出。",
    );
  })(),
  "calculating-flux-through-cartesian-surfaces#upward-flux-through-a-paraboloid-over-a-rectangle": (() => {
    const s = scene(1.5);
    const g = (x: number, y: number): P3 => [x, y, x * x + y * y];
    const P = g(1, 1);
    return drawing(
      [
        ...s.mesh(g, [-1, 1, 6], [-1, 1, 6]),
        ...s.arrow(P, plus3(P, [-2, -2, 1], 0.3), "result"),
        ...s.arrow(P, plus3(P, [1, 1, 2], 0.3), "action"),
        ...s.dot(P),
        ...s.say(plus3(P, [-2, -2, 1], 0.3), "n", "n"),
        ...s.say(plus3(P, [1, 1, 2], 0.3), "F", "e"),
        note([0, -1.6], "(1, 1, 2):  n = ⟨−2, −2, 1⟩,  F = ⟨1, 1, 2⟩", "s"),
        note([0, -2.6], "−2 − 2 + 2 = −2", "s"),
      ],
      "For example, at (1, 1, 2) on z = x² + y². The upward normal element is ⟨−2, −2, 1⟩ dA and F = ⟨1, 1, 2⟩, both shown scaled. Their dot product is −2 = −(x² + y²): the field points mostly against the upward normal.",
      "例如，在 z = x² + y² 上的点 (1, 1, 2)。向上法向元为 ⟨−2, −2, 1⟩ dA，F = ⟨1, 1, 2⟩，都按比例画出。其点积为 −2 = −(x² + y²)：场大体与向上法向相反。",
    );
  })(),
  "calculating-flux-through-cartesian-surfaces#downward-flux-through-a-tilted-plane": (() => {
    const s = scene(1.5);
    const g = (x: number, y: number): P3 => [x, y, 2 * x + y];
    const P = g(0.5, 0.5);
    return drawing(
      [
        ...s.axes(2, 2, 3.4),
        ...s.mesh(g, [0, 1, 2], [0, 1, 2]),
        ...s.arrow(P, plus3(P, [2, 1, -1], 0.5), "result"),
        ...s.say(plus3(P, [2, 1, -1], 0.5), "n", "e"),
        note([1.8, 3.2], "n = ⟨2, 1, −1⟩", "e"),
        note([1.8, 2.4], "F = ⟨1, 1, 2⟩", "e"),
        note([1.8, 1.6], "2 + 1 − 2 = 1", "e"),
      ],
      "For example, z = 2x + y over the unit square and F = ⟨1, 1, 2⟩. The upward element is ⟨−2, −1, 1⟩ dA and the downward one is ⟨2, 1, −1⟩ dA, shown scaled. Then F·dS = (2 + 1 − 2) dA = dA, so the flux is 1. Using only the third component would give −2.",
      "例如，z = 2x + y，在单位正方形上，F = ⟨1, 1, 2⟩。向上面元为 ⟨−2, −1, 1⟩ dA，向下面元为 ⟨2, 1, −1⟩ dA（按比例画出）。于是 F·dS = (2 + 1 − 2) dA = dA，通量为 1。只用第三个分量会得到 −2。",
    );
  })(),
  "calculating-flux-through-closed-surfaces#the-flux-out-of-a-closed-cylinder": (() => {
    const s = scene(1.5);
    return drawing(
      [
        ...can(s, 1, 0, 2),
        ...s.arrow([0, 0, 2], [0, 0, 2.8], "action"),
        ...s.arrow([0, 0, 0], [0, 0, -0.8], "action"),
        ...s.arrow([cos(1.6), sin(1.6), 1], [1.8 * cos(1.6), 1.8 * sin(1.6), 1], "action"),
        ...s.say([0, 0, 2.8], "2π", "e"),
        ...s.say([0, 0, -0.8], "0", "e"),
        ...s.say([1.8 * cos(1.6), 1.8 * sin(1.6), 1], "4π", "e"),
        note([0, -2.2], "4π + 2π + 0 = 6π", "s"),
      ],
      "For example, F = ⟨x, y, z⟩ out of the cylinder with R = 1 and 0 ≤ z ≤ 2. On the side F·n = 1 over area 4π gives 4π. On the top F·k = 2 over area π gives 2π. On the bottom z = 0, which gives 0. The total is 6π.",
      "例如，F = ⟨x, y, z⟩，穿出 R = 1、0 ≤ z ≤ 2 的圆柱。侧面 F·n = 1，面积 4π，得 4π。顶面 F·k = 2，面积 π，得 2π。底面 z = 0，得 0。总和为 6π。",
    );
  })(),
  "the-divergence-theorem#divergence-theorem-on-a-sphere-or-cylinder": (() => {
    const [a, b] = [scene(1.4), scene(1.4, 6)];
    return drawing(
      [
        ...a.sphere(1),
        ...can(b, 1, 0, 2),
        note([0, -2], "V = 4π/3", "n"),
        note([0, -3], "6V = 8π", "n"),
        note([6, -2], "V = 2π", "n"),
        note([6, -3], "6V = 12π", "n"),
        note([3, 3], "∇·F = 6", "n"),
      ],
      "For example, F = ⟨x, 2y, 3z⟩, so ∇·F = 1 + 2 + 3 = 6. On the ball of radius 1 the volume is 4π/3 and the flux is 8π. On the solid cylinder with R = 1 and H = 2 the volume is 2π and the flux is 12π.",
      "例如，F = ⟨x, 2y, 3z⟩，所以 ∇·F = 1 + 2 + 3 = 6。半径 1 的球体积为 4π/3，通量为 8π。R = 1、H = 2 的实心圆柱体积为 2π，通量为 12π。",
    );
  })(),
  "stokes-theorem#stokes-theorem-on-a-tilted-triangle": (() => {
    const s = scene(1.5);
    const [A, B, C]: P3[] = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2],
    ] as P3[];
    const P: P3 = [2 / 3, 2 / 3, 2 / 3];
    const mid = (a: P3, b: P3): P3 => plus3(a, plus3(b, a, -1), 0.6);
    return drawing(
      [
        ...s.axes(2.8, 2.8, 2.8),
        ...s.patch([A as P3, B as P3, C as P3]),
        ...s.arrow(A as P3, mid(A as P3, B as P3), "result"),
        ...s.arrow(B as P3, mid(B as P3, C as P3), "result"),
        ...s.arrow(C as P3, mid(C as P3, A as P3), "result"),
        ...s.arrow(P, plus3(P, [1, 1, 1], 1), "action"),
        ...s.say(plus3(P, [1, 1, 1], 1), "∇×F = ⟨1, 1, 1⟩", "n"),
        note([3, 2], "A = a²/2 = 2", "e"),
        note([3, 1], "∮ = 2 + 2 + 2 = 6", "e"),
      ],
      "For example, a = 2 and p = q = r = 1, so the curl is the constant ⟨1, 1, 1⟩. Each projection onto a coordinate plane has area a²/2 = 2, so the flux of the curl, which equals the circulation around the triangle, is 2 + 2 + 2 = 6.",
      "例如，a = 2，p = q = r = 1，所以旋度是常向量 ⟨1, 1, 1⟩。向每个坐标平面的投影面积为 a²/2 = 2，所以旋度的通量（等于绕三角形的环量）为 2 + 2 + 2 = 6。",
    );
  })(),
};
