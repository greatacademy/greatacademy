// Drawings in the explanations of Multivariable Calculus about cylindrical and spherical coordinates, simple curves and line integrals. Every point of space goes through one projection, and every value is computed from the curve it belongs to.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, joined, polarPts } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { dotAt, drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";
import type { P3 } from "./explanation-drawings-multivariable-kit.ts";
import { scene, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
type Tone = "action" | "result";
type Sc = ReturnType<typeof scene>;
const [ex, ey]: [P3, P3] = [
  [1, 0, 0],
  [0, 1, 0],
];
/** Side lines fall where the line of sight touches the round wall: az = 30°. */
const side: Point = [-0.5, sqrt(3) / 2];
const can = (s: Sc, r: number, h: number, tone?: Tone): Mark[] => [
  ...s.circle([0, 0, 0], ex, ey, r, tone, true),
  ...s.circle([0, 0, h], ex, ey, r, tone),
  ...s.line([r * side[0], r * side[1], 0], [r * side[0], r * side[1], h], tone),
  ...s.line([-r * side[0], -r * side[1], 0], [-r * side[0], -r * side[1], h], tone),
];
const coneUp = (s: Sc, R: number, m: number, tone?: Tone): Mark[] => [
  ...s.mesh((u, v) => [u * cos(v), u * sin(v), m * u], [0, R, 1], [0, 2 * pi, 8], tone),
];
const cup = (s: Sc, R: number, c: number): Mark[] => s.mesh((u, v) => [u * cos(v), u * sin(v), c * u * u], [0, R, 2], [0, 2 * pi, 8]);
const halfPlane = (s: Sc, th: number, R: number, h: number, tone: Tone = "result"): Mark[] =>
  s.patch(
    [
      [0, 0, 0],
      [R * cos(th), R * sin(th), 0],
      [R * cos(th), R * sin(th), h],
      [0, 0, h],
    ],
    tone,
  );
const arcAt = (s: Sc, f: (t: number) => P3, a: number, b: number, tone?: Tone): Mark[] => s.curve(f, a, b, tone);
const circleOn = (c: Point, r: number, tone?: Tone) => ({ kind: "circle", center: c, r, ...(tone ? { tone } : {}) }) as const;
const onward = (a: Point, b: Point, tone?: Tone) => toward(a, [a[0] + 0.9 * (b[0] - a[0]), a[1] + 0.9 * (b[1] - a[1])], tone);

/** multivariableDrawings5 holds the drawings of the Multivariable Calculus explanations about cylindrical and spherical coordinates and line integrals of scalar functions and differentials, by explanation key. */
export const multivariableDrawings5: Readonly<Record<string, Figure>> = {
  "cylindrical-polar-coordinates#converting-cartesian-points-to-cylindrical-coordinates": (() => {
    const s = scene(2);
    const [x, y, z] = [1, sqrt(3), 2];
    return drawing(
      [
        ...s.axes(3, 3, 3),
        ...s.line([0, 0, 0], [x, y, 0], "action"),
        ...s.line([x, y, 0], [x, y, z], undefined, true),
        ...s.dot([x, y, z], "(1, √3, 2)", "e", "result"),
        ...s.say([x, y, 0], "r = 2", "s"),
        ...s.say([x, y, 1], "z = 2", "e"),
        ...arcAt(s, (t) => [0.8 * cos(t), 0.8 * sin(t), 0], 0, pi / 3),
        ...s.say([1, 0.3, 0], "θ = π/3", "sw"),
      ],
      "For example, (1, √3, 2): r = √(1 + 3) = 2 in the horizontal plane, θ = π/3 from the positive x-axis, and the height z = 2 stays.",
      "例如，(1, √3, 2)：水平面内 r = √(1 + 3) = 2，从 x 轴正向起 θ = π/3，高度 z = 2 不变。",
    );
  })(),
  "cylindrical-polar-coordinates#converting-cylindrical-coordinates-to-x": graphed(
    wide(-1, 5, -1, 5),
    [
      joined(
        [
          [0, 0],
          [2, 2 * sqrt(3)],
        ],
        "result",
      ),
      joined(
        [
          [2, 0],
          [2, 2 * sqrt(3)],
        ],
        undefined,
        true,
      ),
      pt([2, 2 * sqrt(3)], "r = 4", "e"),
      bare([2, 0], "result"),
      tag([2.1, 0.35], "x = 2", "e"),
      { kind: "turn", center: [0, 0], from: [1, 0], degrees: 60 },
      tag([0.8, 0.35], "θ = π/3", "e"),
    ],
    "For example, r = 4 and θ = π/3: the x-coordinate is r cos θ = 4 · 1/2 = 2, the foot of the dashed drop from the point to the x-axis.",
    "例如，r = 4，θ = π/3：x 坐标为 r cos θ = 4 · 1/2 = 2，即从该点向 x 轴作的虚线垂足。",
  ),
  "cylindrical-polar-coordinates#the-distance-across-the-axis": (() => {
    const s = scene(1.8);
    const [A, B, C]: [P3, P3, P3] = [
      [0, 2, 1],
      [0, -2, 4],
      [0, -2, 1],
    ];
    return drawing(
      [
        ...s.axes(2, 3, 5),
        ...s.line(A, C, "action"),
        ...s.line(C, B, "action"),
        ...s.line(A, B, "result"),
        ...s.dot(A, undefined, "n", "result"),
        ...s.dot(B, undefined, "n", "result"),
        ...s.say([0, -1, 1], "2r = 4", "s"),
        ...s.say([0, -2, 2.5], "3", "w"),
        ...s.say([0, 0, 2.5], "d = 5", "e"),
      ],
      "For example, two points at r = 2 with angles differing by π and heights 1 and 4. Their horizontal separation is 2r = 4 and the height difference is 3, so the distance is √(16 + 9) = 5.",
      "例如，两点都在 r = 2，角度相差 π，高度为 1 和 4。水平距离为 2r = 4，高度差为 3，所以距离为 √(16 + 9) = 5。",
    );
  })(),
  "cylindrical-polar-coordinates#cylindrical-coordinates-of-a-drawn-point": (() => {
    const s = scene(1.8);
    return drawing(
      [
        ...s.axes(3.5, 3.5, 4),
        ...s.line([0, 0, 0], [2, 2, 0], "action"),
        ...s.line([2, 2, 0], [2, 2, 3], undefined, true),
        ...s.line([2, 0, 0], [2, 2, 0], undefined, true),
        ...s.line([0, 2, 0], [2, 2, 0], undefined, true),
        ...s.dot([2, 2, 3], "(2, 2, 3)", "e", "result"),
        ...s.say([2, 2, 0], "r = 2√2", "se"),
        ...arcAt(s, (t) => [0.9 * cos(t), 0.9 * sin(t), 0], 0, pi / 4),
        ...s.say([0.3, -0.9, 0], "θ = π/4", "w"),
        ...s.say([2, 2, 1.5], "z = 3", "e"),
      ],
      "For example, (2, 2, 3) has its shadow at (2, 2) in the xy-plane, so r = 2√2 and θ = π/4, while z = 3 does not change.",
      "例如，(2, 2, 3) 在 xy 平面上的影子是 (2, 2)，所以 r = 2√2，θ = π/4，而 z = 3 不变。",
    );
  })(),
  "surfaces-in-cylindrical-polar-coordinates#identifying-surfaces-given-in-cylindrical-coordinates": (() => {
    const [a, b, c, d] = [scene(1.2, 0, 0), scene(1.2, 9, 0), scene(1.2, 0, -10), scene(1.2, 9, -10)];
    return drawing(
      [
        ...can(a, 1.6, 4),
        note([0, -3.2], "r = c", "s"),
        ...coneUp(b, 2.2, 1.6),
        note([9, -3.2], "z = cr", "s"),
        ...cup(c, 2, 1),
        note([0, -13.2], "z = cr²", "s"),
        ...d.axes(1.5, 1.5, 4.6),
        ...halfPlane(d, pi / 3, 3, 4),
        note([9, -13.2], "θ = c", "s"),
      ],
      "From left to right: r = c is a circular cylinder parallel to the z-axis, z = cr is a circular cone with apex at the origin, z = cr² is a circular paraboloid opening along the z-axis, and θ = c is a vertical half-plane with its edge on the z-axis.",
      "从左到右：r = c 是平行于 z 轴的圆柱面，z = cr 是顶点在原点的圆锥面，z = cr² 是沿 z 轴开口的圆抛物面，θ = c 是以 z 轴为边的竖直半平面。",
    );
  })(),
  "surfaces-in-cylindrical-polar-coordinates#writing-cartesian-surfaces-in-cylindrical-coordinates": (() => {
    const [a, b, c] = [scene(1.7, 0, 0), scene(1.7, 10, 0), scene(1.7, 20, 0)];
    return drawing(
      [
        ...can(a, 2, 4),
        note([0, -4], "x² + y² = 4", "s"),
        note([0, -5.4], "r = 2", "s"),
        ...cup(b, 2, 1),
        note([10, -4], "z = x² + y²", "s"),
        note([10, -5.4], "z = r²", "s"),
        ...c.sphere(2),
        note([20, -4], "x² + y² + z² = 4", "s"),
        note([20, -5.4], "r² + z² = 4", "s"),
      ],
      "For example, with a = 2 and k = 1. Replacing x² + y² by r² turns the cylinder into r = 2, the paraboloid into z = r² and the sphere into r² + z² = 4; z stays as it is.",
      "例如，取 a = 2，k = 1。把 x² + y² 换成 r²，圆柱面变为 r = 2，抛物面变为 z = r²，球面变为 r² + z² = 4；z 保持不变。",
    );
  })(),
  "surfaces-in-cylindrical-polar-coordinates#a-cylinder-whose-axis-is-not-the-z-axis": graphed(
    wide(-2, 6, -2, 6),
    [
      circleOn([1.5, 2], 2.5, "result"),
      joined(
        [
          [1.5, 2],
          [4, 2],
        ],
        "action",
      ),
      pt([1.5, 2], "(3/2, 2)", "n"),
      tag([2.8, 2], "5/2", "s"),
      tag([3.5, 5], "r = 3 cos θ + 4 sin θ", "n"),
    ],
    "For example, with p = 3 and q = 4, multiplying by r gives x² + y² = 3x + 4y. Completing the square shows the circle with center (3/2, 2) and radius (1/2)√(9 + 16) = 5/2 through the origin, the cross-section of a cylinder through the z-axis.",
    "例如，取 p = 3，q = 4，乘以 r 得 x² + y² = 3x + 4y。配方得圆心 (3/2, 2)、半径 (1/2)√(9 + 16) = 5/2 的圆，它过原点，是过 z 轴的圆柱面的截面。",
  ),
  "spherical-polar-coordinates#converting-cartesian-points-to-spherical-coordinates": (() => {
    const s = scene(2.2);
    const P: P3 = [1, 1, sqrt(2)];
    return drawing(
      [
        ...s.axes(2.4, 2.4, 2.8),
        ...s.line([0, 0, 0], P, "result"),
        ...s.line([0, 0, 0], [1, 1, 0], "action"),
        ...s.line([1, 1, 0], P, undefined, true),
        ...s.dot(P, "(1, 1, √2),  ρ = 2", "e", "result"),
        ...arcAt(s, (t) => [0.5 * sin(t) * cos(pi / 4), 0.5 * sin(t) * sin(pi / 4), 0.5 * cos(t)], 0, pi / 4),
        ...s.say([0, 0, 1.1], "φ = π/4", "w"),
        ...arcAt(s, (t) => [0.8 * cos(t), 0.8 * sin(t), 0], 0, pi / 4),
        ...s.say([0.8, 0.2, 0], "θ = π/4", "s"),
      ],
      "For example, (1, 1, √2) has ρ = √(1 + 1 + 2) = 2, cos φ = √2/2 so φ = π/4 from the positive z-axis, and tan θ = 1 so θ = π/4 from the positive x-axis.",
      "例如，(1, 1, √2) 有 ρ = √(1 + 1 + 2) = 2，cos φ = √2/2，所以从 z 轴正向起 φ = π/4，tan θ = 1，所以从 x 轴正向起 θ = π/4。",
    );
  })(),
  "spherical-polar-coordinates#finding-the-polar-angle-phi-of-a-point": graphed(
    wide(-1, 5, -4, 4, 1, 1, "r", "z"),
    [
      joined(
        [
          [0, 0],
          [3, 3],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [4, 0],
        ],
        "action",
      ),
      joined(
        [
          [0, 0],
          [3, -3],
        ],
        "result",
      ),
      tag([3, 3], "z = r,  φ = π/4", "n"),
      tag([3.2, 0], "z = 0,  φ = π/2", "n"),
      tag([3, -3], "z = −r,  φ = 3π/4", "s"),
    ],
    "φ is measured from the positive z-axis. In the plane of r and z: if z = r then φ = π/4, if z = 0 then φ = π/2, and if z = −r then φ = 3π/4.",
    "φ 从 z 轴正向量起。在 r、z 平面内：若 z = r，则 φ = π/4；若 z = 0，则 φ = π/2；若 z = −r，则 φ = 3π/4。",
  ),
  "spherical-polar-coordinates#a-cartesian-coordinate-from-spherical-coordinates": (() => {
    const s = scene(1.5);
    const P: P3 = [1, sqrt(3), 2 * sqrt(3)];
    return drawing(
      [
        ...s.axes(3, 3, 4.5),
        ...s.line([0, 0, 0], P, "result"),
        ...s.line([0, 0, 0], [1, sqrt(3), 0], "action"),
        ...s.line([1, sqrt(3), 0], P, undefined, true),
        ...s.line([1, 0, 0], [1, sqrt(3), 0], undefined, true),
        ...s.dot(P, "ρ = 4", "e", "result"),
        ...s.say([0.5, sqrt(3) / 2, 0], "ρ sin φ = 2", "se"),
        ...s.say([1, 0, 0], "x = 1", "w"),
      ],
      "For example, ρ = 4, φ = π/6 and θ = π/3. The distance from the z-axis is ρ sin φ = 2, and it acts as the polar radius, so x = 2 cos(π/3) = 1.",
      "例如，ρ = 4，φ = π/6，θ = π/3。到 z 轴的距离为 ρ sin φ = 2，它充当极半径，所以 x = 2 cos(π/3) = 1。",
    );
  })(),
  "surfaces-in-spherical-polar-coordinates#identifying-surfaces-given-in-spherical-coordinates": (() => {
    const [a, b, c] = [scene(1.6, 0, 0), scene(1.6, 9, 0), scene(1.6, 18, 0)];
    return drawing(
      [
        ...a.sphere(2),
        note([0, -3.8], "ρ = c", "s"),
        ...coneUp(b, 2, 1.7),
        note([9, -3.8], "φ = c", "s"),
        ...c.axes(1.5, 1.5, 4.6),
        ...halfPlane(c, pi / 3, 3, 4),
        note([18, -3.8], "θ = c", "s"),
      ],
      "From left to right: ρ = c is a sphere of radius c centered at the origin, φ = c with 0 < c < π/2 is a circular cone around the positive z-axis, and θ = c is a vertical half-plane.",
      "从左到右：ρ = c 是球心在原点、半径为 c 的球面；φ = c（0 < c < π/2）是绕 z 轴正向的圆锥面；θ = c 是竖直半平面。",
    );
  })(),
  "surfaces-in-spherical-polar-coordinates#spheres-through-the-origin-in-spherical-coordinates": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...s.axes(3, 3, 5),
        ...s.sphere(2, [0, 0, 2]),
        ...s.dot([0, 0, 0], undefined, "n"),
        ...s.dot([0, 0, 2], "(0, 0, 2)", "e", "result"),
        ...s.say([0, 0, 4], "4", "ne"),
        ...s.say([0, 3, 4], "ρ = 4 cos φ", "e"),
      ],
      "For example, k = 4: ρ = 4 cos φ becomes x² + y² + z² = 4z, that is x² + y² + (z − 2)² = 4, a sphere of radius 2 with center (0, 0, 2), passing through the origin.",
      "例如，k = 4：ρ = 4 cos φ 变为 x² + y² + z² = 4z，即 x² + y² + (z − 2)² = 4，是球心 (0, 0, 2)、半径 2、过原点的球面。",
    );
  })(),
  "surfaces-in-spherical-polar-coordinates#recognizing-planes-and-cylinders-in-spherical-form": (() => {
    const [a, b, c] = [scene(1.7, 0, 0), scene(1.7, 10, 0), scene(1.7, 20, 0)];
    return drawing(
      [
        ...a.axes(2, 2, 3.4),
        ...a.patch([
          [-2, -2, 2],
          [2, -2, 2],
          [2, 2, 2],
          [-2, 2, 2],
        ]),
        note([0, -4], "ρ = 2 sec φ", "s"),
        note([0, -5.4], "z = 2", "s"),
        ...can(b, 2, 4),
        note([10, -4], "ρ = 2 csc φ", "s"),
        note([10, -5.4], "r = 2", "s"),
        ...c.sphere(2, [0, 0, 2]),
        note([20, -4], "ρ = 4 cos φ", "s"),
        note([20, -5.4], "x² + y² + z² = 4z", "s"),
      ],
      "For example, a = 2. Since z = ρ cos φ, ρ = 2 sec φ is the plane z = 2. Since r = ρ sin φ, ρ = 2 csc φ is the cylinder r = 2. And ρ = 2a cos φ = 4 cos φ is a sphere through the origin, not centered there.",
      "例如，a = 2。因为 z = ρ cos φ，ρ = 2 sec φ 是平面 z = 2。因为 r = ρ sin φ，ρ = 2 csc φ 是圆柱面 r = 2。而 ρ = 2a cos φ = 4 cos φ 是过原点、球心不在原点的球面。",
    );
  })(),
  "triple-integrals-in-cylindrical-polar-coordinates#volume-of-cylindrical-solid-via-triple-integral": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...can(s, 2, 3),
        ...s.line([0, 0, 3], [2, 0, 3], "action"),
        ...s.say([1, 0, 3], "R = 2", "e"),
        ...s.say([-1, 1.73, 1.5], "H = 3", "e"),
        ...s.say([0, 0, -1.5], "V/π = R²H = 12", "s"),
      ],
      "For example, with R = 2 and H = 3, all three variables have constant limits, and the factor r gives V/π = R²H = 12.",
      "例如，取 R = 2，H = 3，三个变量的积分限都是常数，因子 r 给出 V/π = R²H = 12。",
    );
  })(),
  "triple-integrals-in-cylindrical-polar-coordinates#integrating-x-squared-plus-y-squared-over-a-cylinder": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...can(s, 2, 3),
        ...can(s, 1.2, 3, "action"),
        ...s.line([0, 0, 3], [1.2, 0, 3], "action"),
        ...s.say([0.6, 0, 3], "r", "s"),
        ...s.say([-1, 1.73, 1.5], "H = 3", "e"),
        ...s.say([0, 0, -1.5], "∭ (x² + y²) dV = 24π", "s"),
      ],
      "For example, with R = 2 and H = 3, the integrand is r² on every thin shell at radius r, and dV = r dz dr dθ. The result is 2π · R⁴/4 · H = 2π · 4 · 3 = 24π.",
      "例如，取 R = 2，H = 3，半径 r 处的薄壳上被积函数为 r²，且 dV = r dz dr dθ。结果为 2π · R⁴/4 · H = 2π · 4 · 3 = 24π。",
    );
  })(),
  "triple-integrals-in-cylindrical-polar-coordinates#the-volume-of-a-cone-in-cylindrical-coordinates": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...coneUp(s, 2, 2),
        ...s.circle([0, 0, 2], ex, ey, 1, "action"),
        ...s.line([0, 0, 0], [0, 0, 4], undefined, true),
        ...s.say([-0.5, 0.87, 2], "z/m = 1", "e"),
        ...s.say([-1, 1.73, 4], "h = 4", "e"),
        ...s.say([0, 0, -0.7], "V = 16π/3", "s"),
      ],
      "For example, z = 2r between the tip and the plane z = h = 4. The disk at height z has radius z/2, which is 1 at z = 2. So V = ∫₀⁴ π(z/2)² dz = 16π/3.",
      "例如，z = 2r，在锥尖和平面 z = h = 4 之间。高度 z 处的圆盘半径为 z/2，z = 2 时为 1。所以 V = ∫₀⁴ π(z/2)² dz = 16π/3。",
    );
  })(),
  "triple-integrals-in-spherical-polar-coordinates#volume-of-spherical-ball-via-triple-integral": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.sphere(3),
        ...s.line([0, 0, 0], [0, 0, 3], undefined, true),
        ...s.line([0, 0, 0], [1.5, 1.5, 2.12], "action"),
        ...s.say([0.75, 0.75, 1.06], "ρ", "e"),
        ...s.say([0, 0, 3.4], "R = 3", "n"),
        ...s.say([0, 0, -3.7], "V/π = (4/3)R³ = 36", "s"),
      ],
      "For example, with R = 3, the limits 0 ≤ ρ ≤ 3, 0 ≤ φ ≤ π and 0 ≤ θ ≤ 2π are constant, and the element ρ² sin φ gives V/π = (4/3) · 27 = 36.",
      "例如，取 R = 3，积分限 0 ≤ ρ ≤ 3，0 ≤ φ ≤ π，0 ≤ θ ≤ 2π 都是常数，体积元 ρ² sin φ 给出 V/π = (4/3) · 27 = 36。",
    );
  })(),
  "triple-integrals-in-spherical-polar-coordinates#integrating-the-squared-distance-over-a-ball": (() => {
    const s = scene(1.8);
    return drawing(
      [
        ...s.sphere(2),
        ...s.sphere(1.2),
        ...s.line([0, 0, 0], [0.85, 0.85, 0], "action"),
        ...s.say([0.4, 0.4, 0.3], "ρ", "e"),
        ...s.say([0, 0, 2.2], "R = 2", "n"),
        ...s.say([0, 0, -2.6], "4π · 2⁵/5 = 128π/5", "s"),
      ],
      "For example, with c = 1 and R = 2, the value is ρ² on the whole sphere of radius ρ, and the angular integrals give 4π. The result is 4π ∫₀² ρ⁴ dρ = 4π · 32/5 = 128π/5.",
      "例如，取 c = 1，R = 2，半径 ρ 的整个球面上值都是 ρ²，角度积分给出 4π。结果为 4π ∫₀² ρ⁴ dρ = 4π · 32/5 = 128π/5。",
    );
  })(),
  "triple-integrals-in-spherical-polar-coordinates#the-volume-of-a-spherical-sector": (() => {
    const s = scene(1.5);
    const f0 = pi / 3;
    const R = 3;
    return drawing(
      [
        ...s.mesh((u, v) => [R * sin(u) * cos(v), R * sin(u) * sin(v), R * cos(u)], [0, f0, 2], [0, 2 * pi, 8], "result"),
        ...s.mesh((u, v) => [u * sin(f0) * cos(v), u * sin(f0) * sin(v), u * cos(f0)], [0, R, 1], [0, 2 * pi, 8]),
        ...s.line([0, 0, 0], [0, 0, 3.6], undefined, true),
        ...s.say([0, 0, 3.6], "φ₀ = π/3", "e"),
        ...s.say([-0.5 * R * sin(f0), 0.87 * R * sin(f0), R * cos(f0)], "R = 3", "e"),
        ...s.say([0, 0, -0.5], "V = 9π", "s"),
      ],
      "For example, with R = 3 and φ₀ = π/3, the part of the ball with φ ≤ φ₀ is an ice-cream cone of volume (2π/3) · 27 · (1 − 1/2) = 9π.",
      "例如，取 R = 3，φ₀ = π/3，球中 φ ≤ φ₀ 的部分是冰淇淋锥形，体积为 (2π/3) · 27 · (1 − 1/2) = 9π。",
    );
  })(),
  "computing-triple-integrals-using-a-change-of-variables#the-volume-of-a-parallelepiped-by-a-linear-change-of-variables": (() => {
    const s = scene(1.8);
    const [a, b, c]: [P3, P3, P3] = [
      [2, 0, 0],
      [1, 2, 0],
      [0, 0, 2],
    ];
    const add = (...v: P3[]): P3 => [v.reduce((q, w) => q + w[0], 0), v.reduce((q, w) => q + w[1], 0), v.reduce((q, w) => q + w[2], 0)];
    const O: P3 = [0, 0, 0];
    return drawing(
      [
        ...s.line(O, a, undefined, true),
        ...s.line(O, b, undefined, true),
        ...s.line(O, c, undefined, true),
        ...s.line(a, add(a, b)),
        ...s.line(b, add(a, b)),
        ...s.line(a, add(a, c)),
        ...s.line(b, add(b, c)),
        ...s.line(c, add(a, c)),
        ...s.line(c, add(b, c)),
        ...s.line(add(a, b), add(a, b, c)),
        ...s.line(add(a, c), add(a, b, c)),
        ...s.line(add(b, c), add(a, b, c)),
        ...s.say(add(a, b), "UVW/|det| = 16/2 = 8", "s"),
      ],
      "For example, u = 2x − y, v = y, w = z with U = 4, V = 2 and W = 2. The solid is a parallelepiped on the edges ⟨2, 0, 0⟩, ⟨1, 2, 0⟩, ⟨0, 0, 2⟩. The box in u, v, w has volume 16, the determinant of the map is 2, so the volume is 8.",
      "例如，u = 2x − y，v = y，w = z，U = 4，V = 2，W = 2。该立体是棱为 ⟨2, 0, 0⟩、⟨1, 2, 0⟩、⟨0, 0, 2⟩ 的平行六面体。u、v、w 中的长方体体积为 16，映射的行列式为 2，所以体积为 8。",
    );
  })(),
  "simple-closed-and-oriented-curves#identifying-curve-topologies-and-orientations": (() => {
    const eight = swing((t) => [2 * sin(t), 1.3 * sin(2 * t)] as Point, 0, 2 * pi, 100);
    const c = swing((t) => [2 * cos(t), 1.5 * sin(t)] as Point, 0, 2 * pi, 80);
    const shifted = eight.map(([x, y]) => [x + 6, y] as Point);
    return drawing(
      [
        ...chain(c, "result"),
        ...head(c[9] as Point, c[11] as Point, "result"),
        ...chain(shifted, "action"),
        ...dotAt([6, 0]),
        ...chain(swing((t) => [10 + t, 0.6 * sin(t * 2)] as Point, 0, 3, 30)),
        ...dotAt([10, 0]),
        ...dotAt([13, 0.6 * sin(6)]),
      ],
      "For example, from left to right: an ellipse, simple and closed, with an arrow giving its counterclockwise orientation; a figure-eight, closed but not simple, since it crosses itself at the marked point; and an open arc with two distinct ends, simple but not closed.",
      "例如，从左到右：椭圆，是简单闭曲线，箭头表示逆时针定向；8 字形曲线，闭合但不简单，在标记的点自交；两端不同的开弧，简单但不闭合。",
    );
  })(),
  "line-integrals-of-scalar-functions#evaluating-scalar-line-integrals-using-arc-length": graphed(
    wide(-1, 5, -1, 5),
    [
      joined(
        [
          [0, 0],
          [3, 4],
        ],
        "result",
      ),
      pt([3, 4], "(3, 4)", "e"),
      tag([1.5, 2], "‖r′‖ = 5", "nw"),
      tag([3.5, 1], "∫ (x + y) ds = 35/2", "n"),
    ],
    "For example, r(t) = (3t, 4t) on [0, 1] has speed 5, so ds = 5 dt. For f = x + y the integrand is 7t · 5, and the integral is 35/2.",
    "例如，r(t) = (3t, 4t)，t ∈ [0, 1]，速率为 5，所以 ds = 5 dt。对 f = x + y，被积函数为 7t · 5，积分为 35/2。",
  ),
  "line-integrals-of-scalar-functions#a-scalar-line-integral-of-xy-along-a-segment": graphed(
    wide(-1, 5, -1, 5),
    [
      joined(
        [
          [0, 0],
          [3, 4],
        ],
        "result",
      ),
      pt([3, 4], "(3, 4)", "e"),
      tag([1.5, 2], "ds = 5 dt", "nw"),
      tag([3.5, 1], "∫ xy ds = 20", "n"),
    ],
    "For example, from (0, 0) to (3, 4): r(t) = (3t, 4t), f = xy = 12t² and ds = 5 dt. The integral is ∫₀¹ 60t² dt = 20.",
    "例如，从 (0, 0) 到 (3, 4)：r(t) = (3t, 4t)，f = xy = 12t²，ds = 5 dt。积分为 ∫₀¹ 60t² dt = 20。",
  ),
  "properties-of-line-integrals-of-scalar-functions#invariance-under-orientation-reversal": drawing(
    [
      ...chain(
        swing((t) => [t, 1.5 * sin(t)] as Point, 0, 3, 30),
        "result",
      ),
      ...head([2.8, 1.5 * sin(2.8)], [3, 1.5 * sin(3)], "result"),
      note([1.5, 1.6], "C", "n"),
      ...chain(
        swing((t) => [7 + t, 1.5 * sin(t)] as Point, 0, 3, 30),
        "action",
      ),
      ...head([7.2, 1.5 * sin(0.2)], [7, 0], "action"),
      note([8.5, 1.6], "−C", "n"),
      note([1.5, -0.8], "∫ f ds", "s"),
      note([5, -0.8], "=", "s"),
      note([8.5, -0.8], "∫ f ds", "s"),
    ],
    "The same curve traversed in the two directions, C on the left and −C on the right. Since ds is never negative, the scalar line integral has the same value on both.",
    "同一条曲线沿两个方向走，左边为 C，右边为 −C。由于 ds 不取负值，两者的标量线积分相等。",
  ),
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#line-integrals-along-explicit-curves-y-equals-g-of-x": graphed(
    wide(-3, 3, -1, 3),
    [
      joined(
        [
          [0, 0],
          [1, 2],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [1, 0],
          [1, 2],
        ],
        "action",
      ),
      tag([0.5, 0], "dx", "s"),
      tag([1, 1], "m dx", "e"),
      tag([0, 1.5], "ds = √5 dx", "w"),
    ],
    "For example, y = 2x with 0 ≤ x ≤ 1. Over a run dx the rise is m dx, so ds = √(1 + m²) dx = √5 dx.",
    "例如，y = 2x，0 ≤ x ≤ 1。水平走 dx 时上升 m dx，所以 ds = √(1 + m²) dx = √5 dx。",
  ),
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#integrating-x-squared-along-a-line-through-the-origin":
    graphed(
      wide(-1, 5, -1, 5),
      [
        joined(
          [
            [0, 0],
            [3, 4],
          ],
          "result",
        ),
        pt([3, 4], "(3, 4)", "e"),
        tag([1.5, 2], "L = 5", "nw"),
        tag([3.6, 1], "∫ x² ds = 15", "n"),
      ],
      "For example, p = 3, q = 4 and k = 1, so L = 5. Then ds = (5/3) dx and ∫ x² ds = (5/3) ∫₀³ x² dx = 15.",
      "例如，p = 3，q = 4，k = 1，所以 L = 5。于是 ds = (5/3) dx，∫ x² ds = (5/3) ∫₀³ x² dx = 15。",
    ),
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#a-line-integral-along-a-parabola": graphed(
    wide(-1, 3, -1, 3),
    [
      curveOf((x) => (x * x) / 2, "result", 0, sqrt(3)),
      pt([sqrt(3), 3 / 2], "(√3, 3/2)", "e"),
      tag([1, 0.5], "ds = √(1 + x²) dx", "e"),
      tag([0.8, 2], "∫ x ds = 7/3", "n"),
    ],
    "For example, on y = x²/2 from x = 0 to x = √3, ∫ x √(1 + x²) dx = (1/3)(1 + x²)^(3/2) from 0 to √3, which is (8 − 1)/3 = 7/3.",
    "例如，在 y = x²/2 上从 x = 0 到 x = √3，∫ x √(1 + x²) dx = (1/3)(1 + x²)^(3/2)，从 0 到 √3，等于 (8 − 1)/3 = 7/3。",
  ),
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y#integrating-y-squared-along-a-line-x-equals-my": graphed(
    wide(-1, 5, -1, 5),
    [
      joined(
        [
          [0, 0],
          [3, 4],
        ],
        "result",
      ),
      pt([3, 4], "(3, 4)", "e"),
      tag([1.5, 2], "x = (3/4)y", "nw"),
      tag([3.6, 1], "∫ y² ds = 80/3", "n"),
    ],
    "For example, p = 3, q = 4 and k = 1, so L = 5 and ds = (5/4) dy. Then ∫ y² ds = (5/4) ∫₀⁴ y² dy = 80/3.",
    "例如，p = 3，q = 4，k = 1，所以 L = 5，ds = (5/4) dy。于是 ∫ y² ds = (5/4) ∫₀⁴ y² dy = 80/3。",
  ),
  "line-integrals-of-scalar-functions-over-line-segments#the-average-of-a-linear-function-along-a-segment": graphed(
    wide(-1, 5, -1, 6),
    [
      joined(
        [
          [1, 1],
          [3, 5],
        ],
        "result",
      ),
      pt([1, 1], "f = 2", "e"),
      pt([3, 5], "f = 8", "e"),
      pt([2, 3], "f = 5", "e", "action"),
    ],
    "For example, f = x + y along the segment from (1, 1) to (3, 5). The end values are 2 and 8, and the value at the midpoint (2, 3) is their average, 5, which is the average of f along the segment.",
    "例如，f = x + y，沿从 (1, 1) 到 (3, 5) 的线段。端点值为 2 和 8，中点 (2, 3) 处的值是它们的平均 5，也就是 f 沿线段的平均值。",
  ),
  "line-integrals-of-scalar-functions-over-circles#integrating-a-quadratic-density-around-a-circle": graphed(
    wide(-3, 5, -3, 3),
    [
      circleOn([0, 0], 2, "result"),
      joined(
        [
          [0, 0],
          [2 * cos(0.8), 2 * sin(0.8)],
        ],
        "action",
      ),
      tag([0.7, 0.7], "R = 2", "se"),
      tag([2.1, 2.1], "ds = 2 dt", "e"),
      tag([3.8, 1], "∮ (1 + x²) ds = 12π", "n"),
    ],
    "For example, with R = 2, ds = 2 dt. The constant 1 gives 1 · 2π · 2 = 4π, and x² gives 8π, since ∫ x² ds = R³π. So ∮ (1 + x²) ds = 12π.",
    "例如，取 R = 2，ds = 2 dt。常数 1 给出 1 · 2π · 2 = 4π，x² 给出 8π，因为 ∫ x² ds = R³π。所以 ∮ (1 + x²) ds = 12π。",
  ),
  "line-integrals-of-scalar-functions-over-circles#a-circle-that-is-not-centered-at-the-origin": graphed(
    wide(-1, 5, -1, 3),
    [circleOn([2, 1], 1, "result"), pt([2, 1], "(2, 1)", "n"), tag([3.1, 2], "∮ x ds = 2 · 2π = 4π", "n")],
    "For example, the circle of radius 1 with center (2, 1). The cosine term integrates to zero over a full turn, so ∮ x ds is the center's x-coordinate 2 times the length 2π, that is 4π.",
    "例如，半径 1、圆心 (2, 1) 的圆。余弦项在一整圈上积分为零，所以 ∮ x ds 等于圆心的 x 坐标 2 乘周长 2π，即 4π。",
  ),
  "line-integrals-of-scalar-functions-over-circles#a-scalar-line-integral-over-a-drawn-circle": graphed(
    wide(-2, 5, -2, 4),
    [circleOn([1, 1], 2, "result"), pt([1, 1], "f = 3", "e", "action"), tag([3.2, 3.2], "2π · 2 · 3 = 12π", "n")],
    "For example, f = x + 2y on the circle of radius 2 with center (1, 1), where f = 3. The integral is 2πR times this value: 2π · 2 · 3 = 12π.",
    "例如，f = x + 2y，在半径 2、圆心 (1, 1) 的圆上，圆心处 f = 3。积分等于 2πR 乘这个值：2π · 2 · 3 = 12π。",
  ),
  "line-integrals-of-scalar-functions-over-ellipses#spotting-a-zero-line-integral-on-an-ellipse-by-symmetry": graphed(
    wide(-4, 4, -3, 3),
    [
      { kind: "path", points: swing((t) => [3 * cos(t), 2 * sin(t)] as Point, 0, 2 * pi, 80) },
      pt([3 * cos(1), 2 * sin(1)], "f = x₀", "e", "result"),
      pt([-3 * cos(1), 2 * sin(1)], "f = −x₀", "w", "action"),
      joined(
        [
          [3 * cos(1), 2 * sin(1)],
          [-3 * cos(1), 2 * sin(1)],
        ],
        undefined,
        true,
      ),
      tag([2, -2.3], "∮ x ds = 0", "e"),
    ],
    "For example, x²/9 + y²/4 = 1 and f = x. Reflecting in the y-axis keeps ds and changes the sign of x, so the values at mirror points cancel and ∮ x ds = 0.",
    "例如，x²/9 + y²/4 = 1，f = x。关于 y 轴反射时 ds 不变，x 变号，所以镜像点的值相互抵消，∮ x ds = 0。",
  ),
  "line-integrals-of-scalar-functions-over-ellipses#a-quarter-of-an-ellipse-by-substitution": graphed(
    wide(-1, 4, -1, 2),
    [
      { kind: "path", points: swing((t) => [2 * cos(t), sin(t)] as Point, 0, pi / 2, 40), tone: "result" },
      pt([2, 0], "t = 0", "ne"),
      pt([0, 1], "t = π/2", "ne"),
      tag([2, 1.3], "∫ xy ds = 14/9", "e"),
    ],
    "For example, a = 2 and b = 1 in the first quadrant. With u = 4 sin²t + cos²t, du = 6 sin t cos t dt, and u runs from 1 to 4. So ∫ xy ds = (2/6) ∫₁⁴ √u du = (1/3)(2/3)(8 − 1) = 14/9.",
    "例如，a = 2，b = 1，在第一象限。令 u = 4 sin²t + cos²t，则 du = 6 sin t cos t dt，u 从 1 到 4。所以 ∫ xy ds = (2/6) ∫₁⁴ √u du = (1/3)(2/3)(8 − 1) = 14/9。",
  ),
  "line-integrals-of-scalar-functions-over-polar-curves#arc-length-element-in-polar-coordinates": (() => {
    const g = (t: number) => 2 + t;
    const [a, b] = [0.7, 1];
    const P = [g(a) * cos(a), g(a) * sin(a)] as Point;
    const Q = [g(b) * cos(b), g(b) * sin(b)] as Point;
    const R = [g(a) * cos(b), g(a) * sin(b)] as Point;
    return drawing(
      [
        ...chain(polarPts(g, 0.2, 1.5), "result"),
        seg([0, 0], Q, undefined, true),
        seg([0, 0], P, undefined, true),
        seg(P, R, "action"),
        seg(R, Q, "action"),
        note([(P[0] + R[0]) / 2, (P[1] + R[1]) / 2], "r dθ", "sw"),
        note([(Q[0] + R[0]) / 2, (Q[1] + R[1]) / 2], "dr", "nw"),
        note([(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], "ds", "e"),
      ],
      "A short piece of a polar curve has a sideways part r dθ and a radial part dr. These are the legs of a small right triangle with hypotenuse ds, so ds = √(r² + (dr/dθ)²) dθ.",
      "极曲线的一小段有横向部分 r dθ 和径向部分 dr。它们是一个小直角三角形的两条直角边，斜边为 ds，所以 ds = √(r² + (dr/dθ)²) dθ。",
    );
  })(),
  "line-integrals-of-scalar-functions-over-polar-curves#the-mass-of-a-cardioid-wire": graphed(
    wide(-1, 3, -2, 2),
    [
      { kind: "path", points: polarPts((t) => 1 + cos(t), 0, 2 * pi), tone: "result" },
      tag([2.05, 0.3], "2a = 2", "e"),
      tag([1.4, 1.5], "L = 8a = 8", "e"),
    ],
    "For example, r = a(1 + cos θ) with a = 1. Since ds = 2a|cos(θ/2)| dθ, the whole curve has length 8a = 8, and a wire of constant density 1 has mass 8.",
    "例如，r = a(1 + cos θ)，a = 1。因为 ds = 2a|cos(θ/2)| dθ，整条曲线长 8a = 8，密度恒为 1 的金属丝质量为 8。",
  ),
  "line-integrals-of-scalar-functions-over-polar-curves#a-circle-through-the-pole": graphed(
    wide(-1, 3, -2, 2),
    [circleOn([1, 0], 1, "result"), pt([0, 0], "θ = ±π/2", "nw"), pt([2, 0], "θ = 0", "ne"), tag([1.2, 1.2], "ds = 2 dθ", "e")],
    "For example, r = 2 cos θ with a = 1. The circle passes through the pole, and a single turn takes θ from −π/2 to π/2. Since ds = 2 dθ, its length is 2π.",
    "例如，r = 2 cos θ，a = 1。圆过极点，走一圈时 θ 从 −π/2 到 π/2。因为 ds = 2 dθ，其长度为 2π。",
  ),
  "line-integrals-with-respect-to-x-and-y#x-dy-versus-y-dx-on-a-parametric-parabola": graphed(
    wide(-1, 3, -1, 2, 1, 1),
    [
      shape([...swing((t) => [2 * t, t * t] as Point, 0, 1, 30), [2, 0]], "result"),
      shape([...swing((t) => [2 * t, t * t] as Point, 0, 1, 30), [0, 1]], "action"),
      { kind: "path", points: swing((t) => [2 * t, t * t] as Point, 0, 1, 30) },
      tag([1.6, 0.05], "∫ y dx = 2/3", "n"),
      tag([0.65, 0.6], "∫ x dy = 4/3", "n"),
      pt([2, 1], "(2, 1)", "e"),
    ],
    "For example, x = 2t, y = t², 0 ≤ t ≤ 1, so p = 2 and q = 1. ∫ y dx = pq/3 = 2/3 is the area under the curve, and ∫ x dy = 2pq/3 = 4/3 is the area to its left. Together they fill the rectangle of area 2.",
    "例如，x = 2t，y = t²，0 ≤ t ≤ 1，即 p = 2，q = 1。∫ y dx = pq/3 = 2/3 是曲线下方的面积，∫ x dy = 2pq/3 = 4/3 是曲线左侧的面积。二者合起来填满面积为 2 的矩形。",
  ),
  "properties-of-line-integrals-with-respect-to-x-and-y#orientation-reversal-for-differential-integrals": drawing(
    [
      seg([0, 0], [4, 2], "result"),
      ...head([3.4, 1.7], [4, 2], "result"),
      note([2, 1.1], "C", "nw"),
      note([2, -0.8], "∫ y dx = 1", "s"),
      seg([7, 0], [11, 2], "action"),
      ...head([7.6, 0.3], [7, 0], "action"),
      note([9, 1.1], "−C", "nw"),
      note([9, -0.8], "∫ y dx = −1", "s"),
    ],
    "For example, y = x/2 from (0, 0) to (2, 1), drawn enlarged. ∫ y dx = 1 along C. Going backwards makes dx negative, so along −C the integral is −1.",
    "例如，y = x/2，从 (0, 0) 到 (2, 1)，图已放大。沿 C，∫ y dx = 1。反向走时 dx 为负，所以沿 −C 积分为 −1。",
  ),
  "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves#p-dx-plus-q-dy-on-a-quarter-circle": graphed(
    wide(-1, 4, -1, 3),
    [
      { kind: "path", points: swing((t) => [2 * cos(t), 2 * sin(t)] as Point, 0, pi / 2, 40), tone: "result" },
      onward([2 * cos(0.8), 2 * sin(0.8)], [2 * cos(0.95), 2 * sin(0.95)], "result"),
      tag([1.9, 1.4], "∫ y dx = −π", "e"),
      tag([1.9, 2.1], "∫ x dy = π", "e"),
      tag([0.3, 0.8], "r = 2", "e"),
    ],
    "For example, r = 2 and t from 0 to π/2. Since dx = −2 sin t dt carries a minus sign, ∫ y dx = −πr²/4 = −π, while ∫ x dy = πr²/4 = π.",
    "例如，r = 2，t 从 0 到 π/2。由于 dx = −2 sin t dt 带负号，∫ y dx = −πr²/4 = −π，而 ∫ x dy = πr²/4 = π。",
  ),
  "sums-of-line-integrals-with-respect-to-x-and-y#p-dx-plus-q-dy-along-a-two-segment-path": graphed(
    wide(-1, 7, -1, 4),
    [
      joined(
        [
          [0, 0],
          [3, 0],
          [3, 2],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [0, 2],
          [3, 2],
        ],
        "action",
      ),
      pt([3, 2], "(3, 2)", "ne"),
      tag([4, 0.7], "∫ = 12", "e"),
      tag([1.5, 2], "∫ = 6", "n"),
      tag([4.8, 3.4], "y dx + 2x dy", "n"),
    ],
    "For example, ∫ y dx + 2x dy from (0, 0) to (3, 2). Along the bottom and then up, y = 0 first and then x = 3, giving 2 · 3 · 2 = 12. Up and then across, x = 0 first and then y = 2, giving 2 · 3 = 6. The two paths differ.",
    "例如，∫ y dx + 2x dy，从 (0, 0) 到 (3, 2)。先沿底边再向上：先 y = 0，后 x = 3，得 2 · 3 · 2 = 12。先向上再向右：先 x = 0，后 y = 2，得 2 · 3 = 6。两条路径结果不同。",
  ),
};
