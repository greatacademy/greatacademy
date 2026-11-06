// Drawings in the explanations of Multivariable Calculus about level curves, quadric surfaces, tangent planes, gradients, affine and nonlinear maps, extrema, and double integrals. Each coordinate is computed from the surface, curve or map it shows.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";
import { cross, type P3, plate, scene, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt, cosh, sinh } = Math;
const tw = 2 * pi;
const rows = (n: number, f: (i: number) => Mark[]): Mark[] => Array.from({ length: n }, (_, i) => f(i)).flat();
const plain = (f: (t: number) => Point, a: number, b: number): Mark[] => chain(swing(f, a, b));
const clipLine = (a: Point, b: Point, s?: "action" | "result"): Mark[] => [seg(a, b, s)];
const ellipsoid =
  (a: number, b: number, c: number) =>
  (u: number, v: number): P3 => [a * cos(u) * cos(v), b * sin(u) * cos(v), c * sin(v)];
const oneSheet = (u: number, v: number): P3 => [cosh(v) * cos(u), cosh(v) * sin(u), sinh(v)];
const twoUp = (u: number, v: number): P3 => [sinh(v) * cos(u), sinh(v) * sin(u), cosh(v)];
const twoDown = (u: number, v: number): P3 => [sinh(v) * cos(u), sinh(v) * sin(u), -cosh(v)];
const cone = (u: number, v: number): P3 => [v * cos(u), v * sin(u), v];
const bowl = (u: number, v: number): P3 => [v * cos(u), v * sin(u), v * v];
const saddle = (x: number, y: number): P3 => [x, y, x * x - y * y];
const round3: readonly [number, number, number] = [0, tw, 8];

/** multivariableDrawings2 holds the drawings of the Multivariable Calculus explanations about level curves and surfaces, limits, partial derivatives, tangent planes and gradients, by explanation key. */
export const multivariableDrawings2: Readonly<Record<string, Figure>> = {
  "level-curves#the-function-from-its-level-curves": (() => {
    const hoop = (c: Point, rx: number, ry: number): Mark[] => plain((t) => [c[0] + rx * cos(t), c[1] + ry * sin(t)], 0, tw);
    const c0: Point = [0, 8];
    const c1: Point = [8, 8];
    const c2: Point = [16, 8];
    const c3: Point = [4, 0];
    const c4: Point = [12, 0];
    return drawing(
      [
        ...cross(c0, 2.8, false),
        ...[1, 1.6, 2.2].flatMap((r) => hoop(c0, r, r)),
        note([c0[0], c0[1] - 2.9], "x² + y²", "s"),
        ...cross(c1, 2.8, false),
        ...[1, 1.6, 2.2].flatMap((r) => hoop(c1, r, r / 2)),
        note([c1[0], c1[1] - 2.9], "x² + 4y²", "s"),
        ...cross(c2, 2.8, false),
        ...[-1.5, 0, 1.5].flatMap((d) =>
          clipLine([c2[0] - 1 + d / 2, c2[1] + 2 + d / 2 - 0.5], [c2[0] + 1 + d / 2, c2[1] - 2 + d / 2 + 0.5]),
        ),
        note([c2[0], c2[1] - 2.9], "2x + y", "s"),
        ...cross(c3, 2.8, false),
        ...[-1.5, 0, 1.5].flatMap((d) => plain((t) => [c3[0] + t, c3[1] + t * t + d - 0.5], -1.2, 1.2)),
        note([c3[0], c3[1] - 2.9], "y − x²", "s"),
        ...cross(c4, 2.8, false),
        ...[0.8, 2].flatMap((k) => [
          ...plain((t) => [c4[0] + t, c4[1] + k / t], k / 2.6, 2.6),
          ...plain((t) => [c4[0] - t, c4[1] - k / t], k / 2.6, 2.6),
        ]),
        note([c4[0], c4[1] - 2.9], "xy", "s"),
      ],
      "Level curves of five functions. Circles belong to x² + y², with equal coefficients. For example, unequal coefficients in x² + 4y² stretch them into ellipses. Parallel lines belong to the linear function 2x + y, translated parabolas to y − x², and hyperbolas to xy.",
      "五个函数的等高线。圆属于系数相等的 x² + y²。例如，x² + 4y² 中不相等的系数把它们拉成椭圆。平行直线属于线性函数 2x + y，平移的抛物线属于 y − x²，双曲线属于 xy。",
    );
  })(),
  "level-surfaces#the-shape-of-the-level-surface-through-a-point": (() => {
    const a = scene(1);
    const b = scene(1, 7);
    const c = scene(1, 14);
    return drawing(
      [
        ...a.mesh(oneSheet, round3, [-1.2, 1.2, 4]),
        ...a.dot([1, 1, 1], "(1, 1, 1)", "e", "result"),
        note([0, -3], "c = 1", "s"),
        ...b.mesh(twoUp, round3, [0, 1.3, 3]),
        ...b.mesh(twoDown, round3, [0, 1.3, 3]),
        ...b.dot([0, 0, 1], "(0, 0, 1)", "e", "result"),
        note([7, -3], "c = −1", "s"),
        ...c.mesh(cone, round3, [-1.6, 1.6, 4]),
        ...c.dot([1, 0, 1], "(1, 0, 1)", "e", "result"),
        note([14, -3], "c = 0", "s"),
      ],
      "Level surfaces of F = x² + y² − z². At (1, 1, 1), c = 1 and the surface is a hyperboloid of one sheet. At (0, 0, 1), c = −1 and it is a hyperboloid of two sheets. At (1, 0, 1), c = 0 and it is a double cone.",
      "F = x² + y² − z² 的等值面。在 (1, 1, 1) 处 c = 1，曲面是单叶双曲面。在 (0, 0, 1) 处 c = −1，是双叶双曲面。在 (1, 0, 1) 处 c = 0，是双圆锥面。",
    );
  })(),
  "limits-and-continuity-of-multivariable-functions#limits-along-parabolic-paths": graphed(
    wide(-3, 3, -2, 5),
    [
      curveOf((x) => x, undefined, -2, 1, true),
      curveOf((x) => x * x, "result", -1.6, 1.6),
      curveOf((x) => 2 * x * x, "action", -1.2, 1.2),
      tag([-1.5, -1.5], "f → 0", "se"),
      tag([1.6, 2.56], "f = 1/2", "e"),
      tag([-1.2, 2.88], "f = 2/5", "w"),
    ],
    "For f = x²y/(x⁴ + y²), the line y = x, dashed, gives values tending to 0. Along the parabola y = x² the value is 1/2, and along y = 2x² it is 2/5. Different parabolas give different values, so there is no limit at the origin.",
    "对 f = x²y/(x⁴ + y²)，虚线 y = x 上的值趋于 0。沿抛物线 y = x² 值为 1/2，沿 y = 2x² 值为 2/5。不同抛物线给出不同的值，所以原点处极限不存在。",
  ),
  "ellipsoids#the-volume-of-an-ellipsoid": (() => {
    const s = scene(1.2);
    return drawing(
      [
        ...s.mesh(ellipsoid(3, 2, 1), [0, tw, 8], [-pi / 2, pi / 2, 6]),
        ...s.line([0, 0, 0], [3, 0, 0], "result"),
        ...s.line([0, 0, 0], [0, 2, 0], "result"),
        ...s.line([0, 0, 0], [0, 0, 1], "result"),
        ...s.say([3, 0, 0], "a = 3", "sw"),
        ...s.say([0, 2, 0], "b = 2", "e"),
        ...s.say([0, 0, 1.3], "c = 1", "n"),
        note([0, -3.3], "V = 8π", "s"),
      ],
      "For example, x²/9 + y²/4 + z²/1 = 1 has semi-axes a = 3, b = 2 and c = 1, the square roots of the denominators. Its volume is V = (4/3)π · 3 · 2 · 1 = 8π.",
      "例如，x²/9 + y²/4 + z²/1 = 1 的半轴为 a = 3、b = 2、c = 1，是分母的平方根。其体积 V = (4/3)π · 3 · 2 · 1 = 8π。",
    );
  })(),
  "paraboloids#classifying-paraboloids": (() => {
    const a = scene(1.1);
    const b = scene(1.1, 8);
    return drawing(
      [
        ...a.mesh(bowl, round3, [0, 1.8, 3]),
        note([0, -1.5], "z = x² + y²", "s"),
        ...b.mesh(saddle, [-1.4, 1.4, 6], [-1.4, 1.4, 6]),
        note([8, -3.2], "z = x² − y²", "s"),
      ],
      "For example, on the left the elliptic paraboloid z = x² + y² is bowl-shaped, with circles as horizontal traces. On the right the hyperbolic paraboloid z = x² − y² is saddle-shaped, with parabolas as traces along the grid.",
      "例如，左图椭圆抛物面 z = x² + y² 呈碗形，水平截线是圆。右图双曲抛物面 z = x² − y² 呈马鞍形，沿网格线的截线是抛物线。",
    );
  })(),
  "paraboloids#the-volume-of-a-paraboloid-cap": (() => {
    const s = scene(1);
    const circleAt = (z: number, r: number, tone?: "action" | "result"): Mark[] => s.circle([0, 0, z], [1, 0, 0], [0, 1, 0], r, tone);
    return drawing(
      [
        ...s.mesh(bowl, [0, tw, 8], [0, 2, 1]),
        ...circleAt(0, 2),
        ...s.line([0, 2, 0], [0, 2, 4], undefined, true),
        ...s.line([0, -2, 0], [0, -2, 4], undefined, true),
        ...circleAt(2, sqrt(2), "result"),
        ...s.say([0, sqrt(2), 2], "z = 2,  πz = 2π", "e"),
        ...s.say([0, 2, 4], "V = 8π", "e"),
        ...s.say([0, 2, 0], "πr²h = 16π", "e"),
      ],
      "For example, inside z = x² + y² up to height 4, the slice at z = 2 is a disk of area 2π, since a horizontal slice has area πz. Integrating gives V = 8π, half of the dashed cylinder's 16π with the same base and height.",
      "例如，z = x² + y² 内部到高度 4，z = 2 处的截面是面积为 2π 的圆盘，因为水平截面积为 πz。积分得 V = 8π，是同底同高的虚线圆柱 16π 的一半。",
    );
  })(),
  "elliptic-cones#analyzing-traces-of-elliptic-cones": (() => {
    const s = scene(1.1);
    const f = (u: number, v: number): P3 => [2 * v * cos(u), v * sin(u), v];
    return drawing(
      [
        ...s.mesh(f, [0, tw, 8], [-1.5, 1.5, 0]),
        ...s.curve((t) => f(t, 1), 0, tw, "result"),
        ...s.curve((t) => f(t, 1.5), 0, tw),
        ...s.curve((t) => f(t, -1.5), 0, tw),
        ...s.line([0, 0, 1], [2, 0, 1], "result"),
        ...s.line([0, 0, 1], [0, 1, 1], "result"),
        ...s.say([2, 0, 1], "2|k| = 2", "w"),
        ...s.say([0, 1, 1], "|k| = 1", "ne"),
        ...s.say([0, 0, 2], "z = k = 1", "n"),
      ],
      "For example, the cone z² = x²/4 + y² with a = 2 and b = 1. The plane z = k cuts it in an ellipse with semi-axes 2|k| and |k|. At k = 1 these are 2 and 1, and the ellipses grow as the plane moves away from the vertex.",
      "例如，a = 2、b = 1 的锥面 z² = x²/4 + y²。平面 z = k 截得半轴为 2|k| 和 |k| 的椭圆。k = 1 时半轴为 2 和 1，平面离顶点越远椭圆越大。",
    );
  })(),
  "elliptic-cones#lines-on-an-elliptic-cone": (() => {
    const s = scene(1);
    const f = (u: number, v: number): P3 => [2 * v * cos(u), 3 * v * sin(u), v];
    return drawing(
      [
        ...s.mesh(f, [0, tw, 8], [0, 1.2, 0]),
        ...s.curve((t) => f(t, 1.2), 0, tw),
        ...s.line([0, 0, 0], [2.4, 0, 1.2], "result"),
        ...s.say([2.4, 0, 1.2], "(2, 0, 1)", "sw"),
        ...s.line([0, 0, 0], [0, 3.6, 1.2], "result"),
        ...s.say([0, 3.6, 1.2], "(0, 3, 1)", "e"),
        ...s.line([0, 0, 0], [4, 6, 2], "action", true),
        ...s.say([4, 6, 2], "(2, 3, 1)", "e"),
      ],
      "For example, z² = x²/4 + y²/9. The directions (2, 0, 1) and (0, 3, 1) satisfy r² = p²/4 + q²/9, so those lines lie on the cone. For the dashed direction (2, 3, 1), 1 ≠ 2, so that line meets the cone only at the origin.",
      "例如，z² = x²/4 + y²/9。方向 (2, 0, 1) 和 (0, 3, 1) 满足 r² = p²/4 + q²/9，所以这些直线在锥面上。对虚线方向 (2, 3, 1)，1 ≠ 2，所以该直线只在原点与锥面相交。",
    );
  })(),
  "elliptic-cones#the-volume-of-an-elliptic-cone": (() => {
    const s = scene(1);
    const f = (u: number, v: number): P3 => [2 * v * cos(u), v * sin(u), v];
    return drawing(
      [
        ...s.mesh(f, [0, tw, 8], [0, 2, 0]),
        ...s.curve((t) => f(t, 2), 0, tw),
        ...s.curve((t) => f(t, 1), 0, tw, "result"),
        ...s.line([0, 0, 0], [0, 0, 2], undefined, true),
        ...s.say([0, 2, 2], "A = 8π", "e"),
        ...s.say([0, 1, 1], "z = 1,  A = 2π", "e"),
        ...s.say([0, 0, 0], "V = 16π/3", "s"),
      ],
      "For example, x²/4 + y² = z² up to height 2. The slice at height z has area 2πz², which is 2π at z = 1 and 8π at the base z = 2. Integrating from the tip gives V = 16π/3, one third of the base area times the height.",
      "例如，x²/4 + y² = z²，高度到 2。高度 z 处的截面积为 2πz²，z = 1 时为 2π，底面 z = 2 时为 8π。从顶点积分得 V = 16π/3，等于底面积乘高的三分之一。",
    );
  })(),
  "cylinders#identifying-cylinders-and-their-rulings": (() => {
    const a = scene(1);
    const b = scene(1, 9.5);
    return drawing(
      [
        ...a.axes(3.2, 3.2, 4.5),
        ...a.mesh((u, v) => [2 * cos(u), 2 * sin(u), v], [0, tw, 8], [0, 3.5, 1]),
        note([0, -2.6], "x² + y² = 4", "s"),
        ...b.axes(4.5, 3.2, 3.2),
        ...b.mesh((u, v) => [v, 2 * cos(u), 2 * sin(u)], [0, tw, 8], [0, 3.5, 1]),
        note([9.5, -3.5], "y² + z² = 4", "s"),
      ],
      "For example, x² + y² = 4 has no z, so its rulings are parallel to the z-axis. In the same way y² + z² = 4 has no x, so its rulings are parallel to the x-axis.",
      "例如，x² + y² = 4 不含 z，所以母线平行于 z 轴。同样，y² + z² = 4 不含 x，所以母线平行于 x 轴。",
    );
  })(),
  "cylinders#points-on-a-parabolic-cylinder": (() => {
    const s = scene(1.1);
    return drawing(
      [
        ...s.axes(3, 4.5, 4.5),
        ...s.mesh((x, z) => [x, x * x + 1, z], [-1.6, 1.6, 4], [0, 3, 1]),
        ...s.curve((x) => [x, x * x + 1, 0], -1.6, 1.6, "result"),
        ...s.dot([1, 2, 2], "(1, 2, 2)", "e", "result"),
        ...s.line([1, 2, 0], [1, 2, 3], "result", true),
      ],
      "For example, y = x² + 1 copies its parabola from the xy-plane to every height. At x = 1, y = 2, whatever z is, so (1, 2, 2) lies on the surface, on the dashed ruling.",
      "例如，y = x² + 1 把 xy 平面上的抛物线复制到每个高度。x = 1 时 y = 2，与 z 无关，所以 (1, 2, 2) 在曲面上，位于虚线母线上。",
    );
  })(),
  "cylinders#an-oblique-slice-of-a-cylinder": (() => {
    const s = scene(1);
    const e = (t: number): P3 => [2 * cos(t), 2 * sin(t), 3 + 1.5 * cos(t)];
    return drawing(
      [
        ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2),
        ...s.circle([0, 0, 6], [1, 0, 0], [0, 1, 0], 2),
        ...s.line([0, 2, 0], [0, 2, 6]),
        ...s.line([0, -2, 0], [0, -2, 6]),
        ...s.curve(e, 0, tw, "result"),
        ...s.line([0, 0, 3], [2, 0, 4.5], "action"),
        ...s.line([0, 0, 3], [0, 2, 3], "action"),
        ...s.say([0, -2.4, 2.2], "5/2", "w"),
        ...s.say([0, 2.4, 3], "R = 2", "e"),
        ...s.say([0, 2, 5.5], "m = 3/4", "e"),
      ],
      "For example, the plane z = 3 + (3/4)x cuts a cylinder of radius R = 2 in an ellipse. One semi-axis stays 2, and the other is 2√(1 + m²) = 2 · 5/4 = 5/2.",
      "例如，平面 z = 3 + (3/4)x 截半径 R = 2 的圆柱得一椭圆。一条半轴仍为 2，另一条为 2√(1 + m²) = 2 · 5/4 = 5/2。",
    );
  })(),
  "intersections-of-lines-and-planes-with-surfaces#calculating-radius-of-circular-traces": (() => {
    const s = scene(0.7);
    return drawing(
      [
        ...s.sphere(5),
        ...s.circle([0, 0, 3], [1, 0, 0], [0, 1, 0], 4, "result"),
        ...s.line([0, 0, 0], [0, 0, 3], "action"),
        ...s.line([0, 0, 3], [0, 4, 3], "action"),
        ...s.line([0, 0, 0], [0, 4, 3], "action"),
        ...s.say([0, 0, 1.5], "h = 3", "w"),
        ...s.say([0, 2, 3], "r = 4", "n"),
        ...s.say([0, 2, 1.5], "R = 5", "se"),
      ],
      "For example, the sphere of radius R = 5 meets the plane z = 3 in a circle of radius r = √(25 − 9) = 4, from the right triangle with sides h = 3, r = 4 and R = 5.",
      "例如，半径 R = 5 的球面与平面 z = 3 相交成半径 r = √(25 − 9) = 4 的圆，由边长 h = 3、r = 4、R = 5 的直角三角形得出。",
    );
  })(),
  "intersections-of-lines-and-planes-with-surfaces#where-a-line-meets-a-sphere": (() => {
    const s = scene(1.1);
    return drawing(
      [
        ...s.sphere(3),
        ...s.line([-4, 1, 2], [4, 1, 2], "action"),
        ...s.dot([2, 1, 2], "t = 2", "se", "result"),
        ...s.dot([-2, 1, 2], "t = −2", "ne", "result"),
      ],
      "For example, the line (t, 1, 2) meets the sphere of radius 3 where t² = 9 − 1 − 4 = 4, so at t = 2 and t = −2. Each real solution gives one intersection point.",
      "例如，直线 (t, 1, 2) 与半径为 3 的球面相交于 t² = 9 − 1 − 4 = 4，即 t = 2 和 t = −2。每个实数解对应一个交点。",
    );
  })(),
  "intersections-of-lines-and-planes-with-surfaces#a-plane-meets-a-paraboloid-over-a-circle": (() => {
    const s = scene(0.55);
    const e = (t: number): P3 => [1 + 2 * cos(t), 2 * sin(t), 2 * (1 + 2 * cos(t)) + 3];
    return drawing(
      [
        ...s.axes(5, 5, 11),
        ...s.mesh(bowl, [0, tw, 8], [0, 3, 0]),
        ...s.curve((t) => bowl(t, 3), 0, tw),
        ...s.curve(e, 0, tw, "result"),
        ...s.curve((t) => [1 + 2 * cos(t), 2 * sin(t), 0], 0, tw, "action", true),
        ...s.say([3, 3, -2.2], "(x − 1)² + y² = 4", "s"),
      ],
      "For example, the plane z = 2x + 3 and the paraboloid z = x² + y² meet where x² + y² = 2x + 3, that is (x − 1)² + y² = 4. The intersection lies over the dashed circle in the xy-plane, with center (1, 0) and radius 2.",
      "例如，平面 z = 2x + 3 与抛物面 z = x² + y² 相交于 x² + y² = 2x + 3，即 (x − 1)² + y² = 4。交线位于 xy 平面上圆心 (1, 0)、半径 2 的虚线圆的正上方。",
    );
  })(),
  "identifying-quadric-surfaces#recognizing-quadric-surfaces-from-equations": (() => {
    const at = (i: number): [number, number] => [(i % 3) * 8.5, i < 3 ? 8.5 : 0];
    const items: readonly [string, (u: number, v: number) => P3, readonly [number, number, number], readonly [number, number, number]][] = [
      ["x²/4 + y² + z² = 1", ellipsoid(2, 1, 1), round3, [-pi / 2, pi / 2, 4]],
      ["x² + y² − z² = 1", oneSheet, round3, [-1.2, 1.2, 4]],
      ["−x² − y² + z² = 1", twoUp, round3, [0, 1.2, 2]],
      ["z² = x² + y²", cone, round3, [-1.5, 1.5, 4]],
      ["z = x² + y²", bowl, round3, [0, 1.6, 3]],
      ["z = x² − y²", saddle, [-1.2, 1.2, 4], [-1.2, 1.2, 4]],
    ];
    return drawing(
      rows(6, (i) => {
        const [dx, dy] = at(i);
        const it = items[i] as (typeof items)[number];
        const s = scene(1, dx, dy);
        return [...s.mesh(it[1], it[2], it[3]), ...(i === 2 ? s.mesh(twoDown, round3, [0, 1.2, 2]) : []), note([dx, dy - 2.8], it[0], "s")];
      }),
      "Six quadric surfaces with a = b = c = 1, except the ellipsoid in which a = 2: an ellipsoid, a hyperboloid of one sheet, a hyperboloid of two sheets, an elliptic cone, an elliptic paraboloid and a hyperbolic paraboloid, each labelled with its equation.",
      "六种二次曲面，a = b = c = 1（椭球面中 a = 2）：椭球面、单叶双曲面、双叶双曲面、椭圆锥面、椭圆抛物面、双曲抛物面，每个都标出其方程。",
    );
  })(),
  "identifying-quadric-surfaces#identifying-quadric-surfaces-from-their-signs": (() => {
    const panel = (
      i: number,
      f: (u: number, v: number) => P3,
      v: readonly [number, number, number],
      text: string,
      extra?: (u: number, v: number) => P3,
    ): Mark[] => {
      const dx = i * 7;
      const s = scene(1, dx);
      return [...s.mesh(f, round3, v), ...(extra ? s.mesh(extra, round3, v) : []), note([dx, -3], text, "s")];
    };
    return drawing(
      [
        ...panel(0, ellipsoid(1.5, 1.5, 1.5), [-pi / 2, pi / 2, 4], "+ + + = d"),
        ...panel(1, oneSheet, [-1.2, 1.2, 4], "+ + − = d"),
        ...panel(2, twoUp, [0, 1.2, 2], "+ − − = d", twoDown),
        ...panel(3, cone, [-1.6, 1.6, 4], "+ + − = 0"),
      ],
      "With every variable squared and d > 0, count the signs. Three positive squares give an ellipsoid, two positive and one negative a hyperboloid of one sheet, one positive and two negative a hyperboloid of two sheets, and two positive and one negative equal to 0 an elliptic cone.",
      "每个变量都有平方项且 d > 0 时，数符号。三个正平方项是椭球面，两正一负是单叶双曲面，一正两负是双叶双曲面，两正一负且等于 0 是椭圆锥面。",
    );
  })(),
  "geometric-interpretations-of-partial-derivatives#a-partial-derivative-from-a-drawn-slice": drawing(
    pane(0, [-1, 3, 1], [0, 6, 1], 6, 5, "x", "z")
      .f((x) => x * x + 1, -1, 2.2)
      .path(
        [
          [0.2, 0.4],
          [2.2, 4.4],
        ],
        "result",
      )
      .path(
        [
          [1, 2],
          [2, 2],
          [2, 4],
        ],
        "action",
        true,
      )
      .dot(1, 2, undefined, "nw", "result")
      .say(1.5, 2, "1", "s")
      .say(2, 3, "2", "e")
      .say(0.2, 5.4, "∂f/∂x = 2/1 = 2", "e")
      .marks(),
    "For example, holding y = 1 slices z = x² + y² into the curve z = x² + 1. At x = 1 the tangent rises 2 over a run of 1, so the partial derivative in x is 2.",
    "例如，固定 y = 1 把 z = x² + y² 切成曲线 z = x² + 1。在 x = 1 处，切线在水平走 1 时上升 2，所以对 x 的偏导数为 2。",
  ),
  "tangent-planes-to-surfaces#finding-equations-of-tangent-planes": (() => {
    const s = scene(1.2);
    const P: P3 = [1, 1, 2];
    return drawing(
      [
        ...s.mesh((x, y) => [x, y, x * x + y * y], [-1.5, 1.5, 6], [-1.5, 1.5, 6]),
        ...s.patch(plate(P, [-2, -2, 1], 0.9), "result"),
        ...s.dot(P, undefined, "n", "result"),
        ...s.say([1, 2.2, 2.8], "(1, 1, 2)", "e"),
        note([0, -2.7], "z − 2 = 2(x − 1) + 2(y − 1)", "s"),
      ],
      "For example, z = x² + y² at (1, 1, 2) has f_x = 2 and f_y = 2, so the tangent plane is z − 2 = 2(x − 1) + 2(y − 1). The shaded plane touches the surface at that point.",
      "例如，z = x² + y² 在 (1, 1, 2) 处 f_x = 2，f_y = 2，所以切平面为 z − 2 = 2(x − 1) + 2(y − 1)。阴影平面在该点与曲面相切。",
    );
  })(),
  "tangent-planes-to-surfaces#where-a-tangent-plane-is-parallel-to-a-given-plane": (() => {
    const s = scene(0.7);
    const P: P3 = [1, 2, 5];
    const n: P3 = [-2, -4, 1];
    return drawing(
      [
        ...s.mesh((x, y) => [x, y, x * x + y * y], [-2, 2, 4], [-1, 3, 4]),
        ...s.patch(plate(P, n, 1.6), "result"),
        ...s.patch(plate([1, 2, 1], n, 1.6), "action"),
        ...s.dot(P, "(1, 2, 5)", "w", "result"),
        ...s.say([1, 4, 7], "f_x = 2, f_y = 4", "e"),
        ...s.say([1, 3, 0], "z = 2x + 4y − 9", "e"),
      ],
      "For example, z = x² + y² and the plane z = 2x + 4y − 9, whose slopes are 2 and 4. Setting f_x = 2x = 2 and f_y = 2y = 4 gives x = 1 and y = 2, so the tangent plane at (1, 2, 5) is parallel to it.",
      "例如，z = x² + y² 与平面 z = 2x + 4y − 9，后者斜率为 2 和 4。令 f_x = 2x = 2，f_y = 2y = 4，得 x = 1，y = 2，所以 (1, 2, 5) 处的切平面与它平行。",
    );
  })(),
  "the-gradient-vector#the-most-negative-rate-of-change": graphed(
    wide(-5, 5, -5, 6),
    [
      toward([0, 0], [3, 4], "result"),
      tag([3, 4], "∇f, D = 5", "n"),
      toward([0, 0], [-3, -4], "action"),
      tag([-3, -4], "−∇f, D = −5", "s"),
      toward([0, 0], [-4, 3]),
      tag([-4, 3], "D = 0", "n"),
      toward([0, 0], [4, -3]),
      tag([4, -3], "D = 0", "s"),
    ],
    "For example, with ∇f = ⟨3, 4⟩, of length 5, the rate of change D ranges from −5 to 5. It is 5 along ∇f, −5 opposite to it, and 0 in the two perpendicular directions.",
    "例如，∇f = ⟨3, 4⟩，长度为 5，变化率 D 的范围是 −5 到 5。沿 ∇f 方向为 5，反方向为 −5，两个垂直方向为 0。",
  ),
  "the-gradient-as-a-normal-vector#normal-vectors-to-level-surfaces": (() => {
    const s = scene(1);
    const P: P3 = [1, 2, 2];
    return drawing(
      [
        ...s.sphere(3),
        ...s.patch(plate(P, [1, 2, 2], 1.4), "result"),
        ...s.dot(P, "(1, 2, 2)", "s"),
        ...s.arrow(P, [2, 4, 4], "action"),
        ...s.say([2, 4, 4], "n = ⟨1, 2, 2⟩", "e"),
      ],
      "For example, on the level surface x² + y² + z² = 9 at (1, 2, 2), ∇F = ⟨2, 4, 4⟩. The drawn n = ⟨1, 2, 2⟩ points the same way and is perpendicular to the shaded tangent plane.",
      "例如，在等值面 x² + y² + z² = 9 上的点 (1, 2, 2) 处，∇F = ⟨2, 4, 4⟩。图中 n = ⟨1, 2, 2⟩ 与它同向，并垂直于阴影切平面。",
    );
  })(),
  "the-gradient-as-a-normal-vector#the-gradient-on-a-level-curve": graphed(
    wide(-4, 7, -3, 6),
    [
      { kind: "contour", f: (x, y) => x * x + 2 * y * y - 6, level: 0 },
      pt([2, 1], "(2, 1)", "sw"),
      toward([2, 1], [6, 5], "result"),
      tag([6, 5], "∇f = ⟨4, 4⟩", "n"),
      toward([2, 1], [3, 0], "action"),
      tag([3, 0], "⟨1, −1⟩", "se"),
      tag([-2.2, 3], "∇f·⟨1, −1⟩ = 0", "n"),
    ],
    "For example, on x² + 2y² = 6 at (2, 1), ∇f = ⟨2x, 4y⟩ = ⟨4, 4⟩ points outward, since values grow away from the origin. The vector ⟨1, −1⟩ along the curve has dot product 0 with it.",
    "例如，在 x² + 2y² = 6 上的点 (2, 1) 处，∇f = ⟨2x, 4y⟩ = ⟨4, 4⟩ 指向外侧，因为值随远离原点而增大。沿曲线的向量 ⟨1, −1⟩ 与它的点积为 0。",
  ),
  "the-gradient-as-a-normal-vector#the-gradient-arrow-among-four": graphed(
    wide(-4, 4, -4, 4),
    [
      { kind: "circle", center: [0, 0], r: 1 },
      { kind: "circle", center: [0, 0], r: 2 },
      { kind: "circle", center: [0, 0], r: 3 },
      tag([-0.75, 0.75], "f = 1", "nw"),
      tag([-1.45, 1.45], "f = 4", "nw"),
      tag([-2.15, 2.15], "f = 9", "nw"),
      bare([2, 0]),
      toward([2, 0], [3, 0], "result"),
      tag([3, 0], "∇f", "ne"),
      toward([2, 0], [1, 0], "action"),
      toward([2, 0], [2, 1], "action"),
      toward([2, 0], [2, -1], "action"),
    ],
    "For example, f = x² + y² with level curves labelled 1, 4 and 9. Of the four arrows at (2, 0), only the one labelled ∇f crosses the curve at a right angle toward larger labels. The other crossing arrow points to smaller values, and the two along the curve show no change.",
    "例如，f = x² + y²，等高线标为 1、4、9。在 (2, 0) 处的四个箭头中，只有标 ∇f 的那个垂直穿过曲线并指向标值更大的一侧。另一个穿过曲线的箭头指向更小的值，沿曲线的两个箭头表示没有变化。",
  ),
  "tangent-lines-to-level-curves#the-slope-of-a-level-curve": graphed(
    wide(-6, 8, -6, 9, 2),
    [
      { kind: "circle", center: [0, 0], r: 5 },
      curveOf((x) => 4 - (3 / 4) * (x - 3), "result", -1, 7),
      pt([3, 4], "(3, 4)", "sw"),
      toward([3, 4], [6, 8], "action"),
      tag([6, 8], "∇f = ⟨3, 4⟩", "w"),
      tag([6.5, 2.4], "dy/dx = −3/4", "n"),
    ],
    "For example, f = (x² + y²)/2 at (3, 4) has ∇f = ⟨3, 4⟩, perpendicular to the level curve. The tangent has direction ⟨4, −3⟩ and slope dy/dx = −f_x/f_y = −3/4.",
    "例如，f = (x² + y²)/2 在 (3, 4) 处 ∇f = ⟨3, 4⟩，垂直于等高线。切线方向为 ⟨4, −3⟩，斜率 dy/dx = −f_x/f_y = −3/4。",
  ),
  "tangent-lines-to-level-curves#where-a-level-curve-has-a-horizontal-tangent": graphed(
    wide(-4, 4, -4, 4),
    [
      { kind: "contour", f: (x, y) => x * x + x * y + y * y - 3, level: 0 },
      curveOf((x) => -2 * x, "action", -1.9, 1.9, true),
      joined(
        [
          [-2.2, 2],
          [0.2, 2],
        ],
        "result",
      ),
      joined(
        [
          [-0.2, -2],
          [2.2, -2],
        ],
        "result",
      ),
      pt([-1, 2], "(−1, 2)", "ne"),
      pt([1, -2], "(1, −2)", "sw"),
      tag([1.6, -3.2], "F_x = 0", "e"),
    ],
    "For example, F = x² + xy + y² = 3. F_x = 2x + y = 0 gives the dashed line y = −2x through the origin. Combining it with the curve gives 3x² = 3, so the horizontal tangents are at (−1, 2) and (1, −2).",
    "例如，F = x² + xy + y² = 3。F_x = 2x + y = 0 给出过原点的虚线 y = −2x。与曲线联立得 3x² = 3，所以水平切线在 (−1, 2) 和 (1, −2) 处。",
  ),
  "tangent-lines-to-level-curves#the-tangent-to-a-drawn-level-curve": graphed(
    wide(-5, 8, -5, 8, 2),
    [
      { kind: "circle", center: [1, 1], r: 5 },
      joined(
        [
          [1, 1],
          [4, 5],
        ],
        "action",
      ),
      curveOf((x) => 5 - (3 / 4) * (x - 4), "result", 0.5, 8),
      pt([1, 1], "(1, 1)", "e"),
      pt([4, 5], "(4, 5)", "ne"),
      tag([2.5, 3], "m = 4/3", "w"),
      tag([7, 4], "m = −3/4", "n"),
    ],
    "For example, a circular level curve with center (1, 1) through (4, 5). The radius has slope 4/3, so the tangent has the negative reciprocal slope −3/4.",
    "例如，圆心 (1, 1)、过 (4, 5) 的圆形等高线。半径的斜率为 4/3，所以切线的斜率是其负倒数 −3/4。",
  ),
  "tangent-planes-to-level-surfaces#computing-tangent-planes-to-implicit-surfaces": (() => {
    const s = scene(1.3);
    const P: P3 = [1, 1, 1];
    return drawing(
      [
        ...s.mesh(ellipsoid(sqrt(6), sqrt(3), sqrt(2)), [0, tw, 6], [-pi / 2, pi / 2, 4]),
        ...s.patch(plate(P, [1, 2, 3], 1), "result"),
        ...s.dot(P, "(1, 1, 1)", "sw"),
        ...s.arrow(P, [1.5, 2, 2.5], "action"),
        ...s.say([1.5, 2, 2.5], "n ∥ ∇F", "n"),
        note([0, -2.6], "2(x − 1) + 4(y − 1) + 6(z − 1) = 0", "s"),
      ],
      "For example, x² + 2y² + 3z² = 6 at (1, 1, 1) has ∇F = ⟨2, 4, 6⟩, so the tangent plane is 2(x − 1) + 4(y − 1) + 6(z − 1) = 0. The arrow n, half of ∇F, is its normal.",
      "例如，x² + 2y² + 3z² = 6 在 (1, 1, 1) 处 ∇F = ⟨2, 4, 6⟩，所以切平面为 2(x − 1) + 4(y − 1) + 6(z − 1) = 0。箭头 n 是 ∇F 的一半，即其法向量。",
    );
  })(),
  "tangent-planes-to-level-surfaces#a-tangent-plane-parallel-to-a-given-plane": (() => {
    const s = scene(1);
    return drawing(
      [
        ...s.sphere(3),
        ...s.patch(plate([1, 2, 2], [1, 2, 2], 1.3), "result"),
        ...s.patch(plate([-1, -2, -2], [1, 2, 2], 1.3), "result"),
        ...s.dot([1, 2, 2], "(1, 2, 2)", "n"),
        ...s.dot([-1, -2, -2], "(−1, −2, −2)", "s"),
        ...s.line([-1, -2, -2], [1, 2, 2], undefined, true),
      ],
      "For example, on the sphere x² + y² + z² = 9 the tangent plane is parallel to x + 2y + 2z = d where the gradient ⟨2x, 2y, 2z⟩ is a multiple of ⟨1, 2, 2⟩. That happens at the two opposite points (1, 2, 2) and (−1, −2, −2).",
      "例如，在球面 x² + y² + z² = 9 上，切平面平行于 x + 2y + 2z = d 的位置是梯度 ⟨2x, 2y, 2z⟩ 为 ⟨1, 2, 2⟩ 倍数的点，即两个相对的点 (1, 2, 2) 和 (−1, −2, −2)。",
    );
  })(),
  "directional-derivatives#a-direction-in-which-a-function-does-not-change": graphed(
    wide(-3, 5, -2, 5),
    [
      curveOf((x) => -3 * x, undefined, -1.5, 0.6, true),
      toward([0, 0], [3, 1], "result"),
      tag([3, 1], "∇f = ⟨3, 1⟩", "n"),
      toward([0, 0], [-1, 3], "action"),
      tag([-1.1, 3.1], "⟨−1, 3⟩", "w"),
    ],
    "For example, with ∇f = ⟨3, 1⟩, swapping the components and changing one sign gives ⟨−1, 3⟩. Its dot product with the gradient is −3 + 3 = 0, so f does not change in that direction, along the dashed level curve.",
    "例如，∇f = ⟨3, 1⟩，交换分量并改变一个符号得 ⟨−1, 3⟩。它与梯度的点积为 −3 + 3 = 0，所以 f 沿这个方向（虚线等高线方向）不变。",
  ),
  "the-multivariable-chain-rule-in-vector-form#a-velocity-that-keeps-a-function-constant": graphed(
    wide(-3, 7, -3, 5),
    [
      { kind: "circle", center: [0, 0], r: sqrt(5) },
      pt([2, 1], "(2, 1)", "sw"),
      toward([2, 1], [6, 3], "result"),
      tag([6, 3], "∇f = ⟨4, 2⟩", "n"),
      toward([2, 1], [1, 3], "action"),
      tag([1, 3], "r′ = ⟨−1, 2⟩", "ne"),
    ],
    "For example, f = x² + y² at (2, 1) has ∇f = ⟨4, 2⟩. The velocity r′ = ⟨−1, 2⟩ gives ∇f·r′ = −4 + 4 = 0, so it is tangent to the level curve and f stays constant to first order.",
    "例如，f = x² + y² 在 (2, 1) 处 ∇f = ⟨4, 2⟩。速度 r′ = ⟨−1, 2⟩ 使 ∇f·r′ = −4 + 4 = 0，所以它与等高线相切，f 在一阶上保持不变。",
  ),
};
