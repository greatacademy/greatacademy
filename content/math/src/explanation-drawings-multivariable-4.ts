// Drawings in the explanations of Multivariable Calculus about double and triple integrals: regions, strips, solids and changes of variables. Every region is computed from its bounds, and every solid goes through one projection.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { between, head, joined, pane, polarBand } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";
import type { P3 } from "./explanation-drawings-multivariable-kit.ts";
import { flat, scene, swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
type Tone = "action" | "result";
const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const box = (x0: number, y0: number, x1: number, y1: number, tone?: Tone) => joined([...rect(x0, y0, x1, y1), [x0, y0]], tone);
const poly = (points: readonly Point[], tone: Tone = "result") => [shape(points, tone), joined([...points, points[0] as Point], tone)];
const ringPiece = (r1: number, r2: number, a: number, b: number) => [
  polarBand(
    () => r2,
    () => r1,
    a,
    b,
  ),
  joined(
    swing((t) => [r2 * cos(t), r2 * sin(t)], a, b, 40),
    "result",
  ),
  joined(
    swing((t) => [r1 * cos(t), r1 * sin(t)], a, b, 30),
    "result",
  ),
  joined(
    [
      [r1 * cos(a), r1 * sin(a)],
      [r2 * cos(a), r2 * sin(a)],
    ],
    "result",
  ),
  joined(
    [
      [r1 * cos(b), r1 * sin(b)],
      [r2 * cos(b), r2 * sin(b)],
    ],
    "result",
  ),
];
/** The twelve edges of the box from the origin to (a, b, c), with the hidden three dashed. */
const brick = (s: ReturnType<typeof scene>, a: number, b: number, c: number, tone?: Tone): Mark[] => [
  ...(
    [
      [
        [a, 0, 0],
        [a, b, 0],
      ],
      [
        [0, b, 0],
        [a, b, 0],
      ],
      [
        [a, 0, 0],
        [a, 0, c],
      ],
      [
        [a, b, 0],
        [a, b, c],
      ],
      [
        [0, b, 0],
        [0, b, c],
      ],
      [
        [0, 0, c],
        [a, 0, c],
      ],
      [
        [0, 0, c],
        [0, b, c],
      ],
      [
        [a, 0, c],
        [a, b, c],
      ],
      [
        [0, b, c],
        [a, b, c],
      ],
    ] as [P3, P3][]
  ).flatMap(([p, q]) => s.line(p, q, tone)),
  ...s.line([0, 0, 0], [a, 0, 0], tone, true),
  ...s.line([0, 0, 0], [0, b, 0], tone, true),
  ...s.line([0, 0, 0], [0, 0, c], tone, true),
];

/** multivariableDrawings4 holds the drawings of the Multivariable Calculus explanations about double and triple integrals, by explanation key. */
export const multivariableDrawings4: Readonly<Record<string, Figure>> = {
  "double-integrals-over-non-rectangular-domains#integrating-over-the-region-between-a-line-and-a-parabola": graphed(
    wide(-1, 4, -1, 5),
    [
      between(
        (x) => 2 * x,
        (x) => x * x,
        0,
        2,
      ),
      curveOf((x) => x * x, undefined, -0.5, 2.2),
      curveOf((x) => 2 * x, undefined, -0.5, 2.4),
      pt([2, 4], "(2, 4)", "e"),
      tag([1, 2.2], "y = 2x", "nw"),
      tag([1.7, 2.6], "y = x²", "se"),
      tag([2.3, 1.5], "∬ 1 dA = 4/3", "e"),
    ],
    "For example, with k = 2 and c = 1, y = x² and y = 2x meet at x = 0 and x = 2, and the line is on top between them. The integral is 1 · 2³/6 = 4/3.",
    "例如，取 k = 2，c = 1，y = x² 与 y = 2x 交于 x = 0 和 x = 2，二者之间直线在上方。积分为 1 · 2³/6 = 4/3。",
  ),
  "double-integrals-over-non-rectangular-domains#a-nonconstant-integrand-between-a-line-and-a-parabola": graphed(
    wide(-1, 7, -1, 10, 2),
    [
      between(
        (x) => 3 * x,
        (x) => x * x,
        0,
        3,
      ),
      curveOf((x) => x * x, undefined, -0.5, 3.2),
      curveOf((x) => 3 * x, undefined, -0.3, 3.3),
      joined(
        [
          [1.5, 2.25],
          [1.5, 4.5],
        ],
        "action",
      ),
      pt([3, 9], "(3, 9)", "e"),
      tag([3.2, 3], "∬ x dA = 27/4", "e"),
    ],
    "For example, with m = 3 the curves meet at x = 0 and x = 3. The strip at x has height 3x − x², so the integral is ∫₀³ x(3x − x²) dx = 27 − 81/4 = 27/4.",
    "例如，取 m = 3，两曲线交于 x = 0 和 x = 3。x 处竖条高为 3x − x²，所以积分为 ∫₀³ x(3x − x²) dx = 27 − 81/4 = 27/4。",
  ),
  "properties-of-double-integrals#adding-a-constant-to-the-integrand": graphed(
    wide(-1, 6, -1, 4),
    [
      shape(rect(0, 0, 3, 2)),
      box(0, 0, 3, 2, "result"),
      tag([1.5, 0.7], "A = 6", "n"),
      tag([1.5, 2.1], "k = 2", "n"),
      tag([3.2, 1], "k · A = 12", "e"),
    ],
    "For example, on R = [0, 3] × [0, 2], of area 6, adding the constant k = 2 to the integrand adds k · 6 = 12 to the integral, not just 2.",
    "例如，在面积为 6 的 R = [0, 3] × [0, 2] 上，给被积函数加常数 k = 2，积分增加 k · 6 = 12，而不是 2。",
  ),
  "type-i-and-ii-regions-in-two-dimensional-space#identifying-type-i-and-type-ii-regions": (() => {
    const low = (x: number) => (x * x) / 4;
    const top = (x: number) => x / 2 + 2;
    const u = 2;
    const n = Array.from({ length: 41 }, (_, i) => 1 + i / 20);
    const a: Point[] = [...n.map((x): Point => [x * u, low(x) * u]), ...[...n].reverse().map((x): Point => [x * u, top(x) * u])];
    const b: Point[] = a.map(([x, y]) => [y, x]);
    return drawing(
      [
        ...flat(a),
        seg([4, low(2) * u], [4, top(2) * u], "action"),
        note([2, 0], "a", "s"),
        note([6, 0], "b", "s"),
        seg([2, 0], [2, top(1) * u], undefined, true),
        seg([6, 0], [6, low(3) * u], undefined, true),
        note([3.6, 6.4], "g₂(x)", "n"),
        note([6.2, 3.2], "g₁(x)", "e"),
        ...shift(
          [
            ...flat(b),
            seg([low(2) * u, 4], [top(2) * u, 4], "action"),
            note([0, 2], "c", "w"),
            note([0, 6], "d", "w"),
            seg([0, 2], [top(1) * u, 2], undefined, true),
            seg([0, 6], [low(3) * u, 6], undefined, true),
            note([2, 4.2], "h₁(y)", "nw"),
            note([6.6, 3.6], "h₂(y)", "e"),
          ],
          11,
          0,
        ),
      ],
      "For example, on the left a region with a ≤ x ≤ b and g₁(x) ≤ y ≤ g₂(x): a vertical strip runs from the lower graph to the upper one, so it is Type I. On the right a region with c ≤ y ≤ d and h₁(y) ≤ x ≤ h₂(y): a horizontal strip runs from the left graph to the right one, so it is Type II.",
      "例如，左边的区域满足 a ≤ x ≤ b，g₁(x) ≤ y ≤ g₂(x)：竖条从下方图像到上方图像，所以是 I 型。右边的区域满足 c ≤ y ≤ d，h₁(y) ≤ x ≤ h₂(y)：横条从左边图像到右边图像，所以是 II 型。",
    );
  })(),
  "type-i-and-ii-regions-in-two-dimensional-space#rewriting-a-type-i-triangle-as-type-ii": graphed(
    wide(-1, 5, -1, 5),
    [
      ...poly([
        [0, 0],
        [2, 0],
        [2, 4],
      ]),
      joined(
        [
          [1, 2],
          [2, 2],
        ],
        "action",
      ),
      tag([1.5, 3], "x = y/2", "w"),
      tag([2, 2], "x = 2", "e"),
      pt([2, 4], "(2, 4)", "e"),
      tag([3.2, 0.8], "0 ≤ y ≤ 4", "e"),
    ],
    "For example, with a = 2 and m = 2, the triangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 2x also reads 0 ≤ y ≤ 4, y/2 ≤ x ≤ 2. A horizontal slice at height y enters at x = y/2 and leaves at x = 2.",
    "例如，取 a = 2，m = 2，三角形 0 ≤ x ≤ 2，0 ≤ y ≤ 2x 也可写成 0 ≤ y ≤ 4，y/2 ≤ x ≤ 2。高度 y 处的横切片从 x = y/2 进入，从 x = 2 离开。",
  ),
  "double-integrals-over-type-i-regions#integrating-xy-over-a-type-i-triangle": graphed(
    wide(-1, 4, -1, 3),
    [
      ...poly([
        [0, 0],
        [2, 0],
        [2, 2],
      ]),
      joined(
        [
          [1.3, 0],
          [1.3, 1.3],
        ],
        "action",
      ),
      tag([1, 1], "y = x", "nw"),
      tag([2.1, 1], "x = 2", "e"),
      tag([2.5, 2.3], "∬ xy dA = 2", "n"),
    ],
    "For example, with a = 2 and c = 1, the strip at x runs from y = 0 to y = x. The integral is 1 · 2⁴/8 = 2.",
    "例如，取 a = 2，c = 1，x 处的竖条从 y = 0 到 y = x。积分为 1 · 2⁴/8 = 2。",
  ),
  "double-integrals-over-type-i-regions#integrating-x-between-a-line-and-a-parabola": graphed(
    wide(-0.5, 2, -0.5, 1.5, 1, 0.5),
    [
      between(
        (x) => x,
        (x) => x * x,
        0,
        1,
      ),
      curveOf((x) => x * x, undefined, -0.3, 1.15),
      curveOf((x) => x, undefined, -0.3, 1.3),
      joined(
        [
          [0.6, 0.36],
          [0.6, 0.6],
        ],
        "action",
      ),
      tag([1.2, 1.2], "y = x", "e"),
      tag([1.05, 1.1], "y = x²", "se"),
      tag([1.1, 0.4], "∬ x dA = 1/12", "e"),
    ],
    "For example, with k = 1, y = x² and y = x cross at x = 0 and x = 1. The strip at x has height x − x², so the integral is ∫₀¹ x(x − x²) dx = 1/3 − 1/4 = 1/12.",
    "例如，取 k = 1，y = x² 与 y = x 交于 x = 0 和 x = 1。x 处竖条高为 x − x²，所以积分为 ∫₀¹ x(x − x²) dx = 1/3 − 1/4 = 1/12。",
  ),
  "double-integrals-over-type-ii-regions#type-ii-limits-of-a-drawn-triangle": graphed(
    wide(-1, 6, -1, 3),
    [
      ...poly([
        [0, 0],
        [4, 0],
        [0, 2],
      ]),
      joined(
        [
          [0, 1],
          [2, 1],
        ],
        "action",
      ),
      tag([0, 0.5], "x = 0", "w"),
      tag([2, 1], "x = 4 − 2y", "ne"),
      tag([4, 1.9], "0 ≤ y ≤ 2", "n"),
    ],
    "For example, the triangle with vertices (0, 0), (4, 0) and (0, 2). A horizontal slice at height y runs from x = 0 to x = 4 − 2y, and y runs from 0 to 2.",
    "例如，顶点为 (0, 0)、(4, 0)、(0, 2) 的三角形。高度 y 处的横切片从 x = 0 到 x = 4 − 2y，y 从 0 到 2。",
  ),
  "double-integrals-over-partitioned-regions#evaluating-double-integrals-by-domain-decomposition": graphed(
    wide(-1, 6, -1, 4),
    [
      shape(rect(0, 0, 2, 3), "action"),
      box(0, 0, 2, 3, "action"),
      shape(rect(2, 0, 5, 1)),
      box(2, 0, 5, 1, "result"),
      tag([1, 1.2], "6", "n"),
      tag([3.5, 0.2], "3", "n"),
      tag([4, 2.3], "6 + 3 = 9", "n"),
    ],
    "For example, with the constant 1, R₁ = [0, 2] × [0, 3] gives 6 and R₂ = [2, 5] × [0, 1] gives 3. The integral over the whole region is their sum, 9.",
    "例如，被积函数为常数 1，R₁ = [0, 2] × [0, 3] 给出 6，R₂ = [2, 5] × [0, 1] 给出 3。整个区域上的积分是二者之和 9。",
  ),
  "double-integrals-over-partitioned-regions#a-region-with-a-rectangular-hole": graphed(
    wide(-1, 7, -1, 5),
    [
      shape(rect(0, 0, 2, 4)),
      shape(rect(4, 0, 6, 4)),
      shape(rect(2, 0, 4, 1)),
      shape(rect(2, 3, 4, 4)),
      box(0, 0, 6, 4, "result"),
      box(2, 1, 4, 3, "result"),
      tag([3, 1.7], "4", "n"),
      tag([3, 4.1], "24 − 4 = 20", "n"),
    ],
    "For example, with the constant 1, the rectangle [0, 6] × [0, 4] has the hole [2, 4] × [1, 3]. The integral over the whole rectangle, 24, minus the integral over the hole, 4, gives 20.",
    "例如，被积函数为常数 1，矩形 [0, 6] × [0, 4] 中有洞 [2, 4] × [1, 3]。整个矩形上的积分 24 减去洞上的积分 4，得 20。",
  ),
  "double-integrals-over-partitioned-regions#a-double-integral-over-a-drawn-l-shape": graphed(
    wide(-1, 7, -1, 5),
    [
      shape(rect(0, 0, 2, 4), "action"),
      box(0, 0, 2, 4, "action"),
      shape(rect(2, 0, 5, 1)),
      box(2, 0, 5, 1, "result"),
      tag([1, 1.7], "8", "n"),
      tag([3.5, 0.15], "21/2", "n"),
      tag([4, 2.6], "∬ x dA = 37/2", "n"),
    ],
    "For example, cut the L-shape into [0, 2] × [0, 4] and [2, 5] × [0, 1]. The integral of x is 4 · 2²/2 = 8 on the first and 1 · (25 − 4)/2 = 21/2 on the second, 37/2 in all.",
    "例如，把 L 形切成 [0, 2] × [0, 4] 和 [2, 5] × [0, 1]。x 的积分在前者上为 4 · 2²/2 = 8，在后者上为 1 · (25 − 4)/2 = 21/2，共 37/2。",
  ),
  "changing-the-order-of-integration-in-double-integrals#integrating-a-drawn-triangle-the-other-way": graphed(
    wide(-1, 6, -1, 3),
    [
      ...poly([
        [0, 0],
        [4, 0],
        [4, 2],
      ]),
      joined(
        [
          [2, 1],
          [4, 1],
        ],
        "action",
      ),
      tag([2, 1], "x = 2y", "nw"),
      tag([4, 1], "x = 4", "e"),
      pt([4, 2], "(4, 2)", "n"),
    ],
    "For example, the triangle under y = x/2 with vertices (0, 0), (4, 0) and (4, 2). With x first, y runs from 0 to 2 and a horizontal slice runs from x = 2y to x = 4.",
    "例如，y = x/2 下方的三角形，顶点为 (0, 0)、(4, 0)、(4, 2)。先对 x 积分时，y 从 0 到 2，横切片从 x = 2y 到 x = 4。",
  ),
  "triple-integrals-over-rectangular-domains#a-triple-integral-of-a-single-variable-over-a-box": (() => {
    const s = scene(2);
    return drawing(
      [
        ...s.axes(4, 3, 2),
        ...brick(s, 3, 2, 1),
        ...s.patch(
          [
            [2, 0, 0],
            [2, 2, 0],
            [2, 2, 1],
            [2, 0, 1],
          ],
          "action",
        ),
        ...s.say([3, 0, 0], "a = 3", "s"),
        ...s.say([3, 2, 0], "b = 2", "se"),
        ...s.say([0, 2, 1], "d = 1", "ne"),
        ...s.say([0, 0, 2.4], "∭ x² dV = 9 · 2 · 1 = 18", "e"),
      ],
      "For example, with c = 1, a = 3, b = 2 and d = 1, the integrand x² gives a³/3 = 9, multiplied by b · d = 2, the area of the shaded cross-section perpendicular to the x-axis. The result is 18.",
      "例如，取 c = 1，a = 3，b = 2，d = 1，被积函数 x² 给出 a³/3 = 9，再乘 b · d = 2，即垂直于 x 轴的阴影截面的面积。结果为 18。",
    );
  })(),
  "type-i-ii-and-iii-regions-in-three-dimensional-space#the-projection-of-a-tetrahedron-for-each-region-type": (() => {
    const s = scene(2);
    const [A, B, C]: [P3, P3, P3] = [
      [3, 0, 0],
      [0, 4, 0],
      [0, 0, 2],
    ];
    const O: P3 = [0, 0, 0];
    return drawing(
      [
        ...s.axes(4, 5, 3),
        ...s.patch([O, A, B], "result"),
        ...s.patch([O, B, C], "action"),
        ...s.line(A, C),
        ...s.line(A, B),
        ...s.line(B, C),
        ...s.say([1, 1.2, 0], "6", "n"),
        ...s.say([1, 0, 0.6], "3", "n"),
        ...s.say([0, 1.3, 0.6], "4", "n"),
        ...s.say(A, "a = 3", "w"),
        ...s.say(B, "b = 4", "s"),
        ...s.say(C, "c = 2", "w"),
      ],
      "For example, with intercepts a = 3, b = 4 and c = 2, the projections onto the coordinate planes are right triangles: area ab/2 = 6 in the xy-plane, ac/2 = 3 in the xz-plane and bc/2 = 4 in the yz-plane.",
      "例如，截距 a = 3，b = 4，c = 2，在坐标平面上的投影都是直角三角形：xy 平面上面积为 ab/2 = 6，xz 平面上为 ac/2 = 3，yz 平面上为 bc/2 = 4。",
    );
  })(),
  "triple-integrals-over-type-i-regions#integrating-under-a-surface-over-a-rectangle": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.axes(3, 3, 5),
        ...s.mesh((x, y) => [x, y, x * y], [0, 2, 4], [0, 2, 4]),
        ...s.line([2, 0, 0], [2, 2, 0]),
        ...s.line([0, 2, 0], [2, 2, 0]),
        ...s.line([2, 2, 0], [2, 2, 4], undefined, true),
        ...s.say([2, 2, 4], "z = xy", "e"),
        ...s.say([2, 2, 0], "V = 4", "se"),
      ],
      "For example, with a = b = 2 and c = 1, the solid lies over [0, 2] × [0, 2] and under z = xy. Its volume is 1 · 2² · 2²/4 = 4.",
      "例如，取 a = b = 2，c = 1，立体位于 [0, 2] × [0, 2] 上方、z = xy 下方。其体积为 1 · 2² · 2²/4 = 4。",
    );
  })(),
  "calculating-volumes-of-solids-using-triple-integrals#volume-of-a-standard-simplex": (() => {
    const s = scene(2);
    const [A, B, C]: [P3, P3, P3] = [
      [3, 0, 0],
      [0, 4, 0],
      [0, 0, 2],
    ];
    return drawing(
      [
        ...brick(s, 3, 4, 2),
        ...s.patch([A, B, C]),
        ...s.say(A, "a = 3", "sw"),
        ...s.say(B, "b = 4", "e"),
        ...s.say(C, "c = 2", "nw"),
        ...s.say([3, 4, 0], "abc = 24,  abc/6 = 4", "s"),
      ],
      "For example, with a = 3, b = 4 and c = 2, the box with the same intercepts has volume 24, and the tetrahedron cut off by the shaded plane has one sixth of it, 4.",
      "例如，取 a = 3，b = 4，c = 2，截距相同的长方体体积为 24，阴影平面截出的四面体体积是它的六分之一，即 4。",
    );
  })(),
  "calculating-volumes-of-solids-using-triple-integrals#the-volume-under-a-paraboloid-over-a-rectangle": (() => {
    const s = scene(1.4);
    return drawing(
      [
        ...s.axes(3, 2, 6),
        ...s.mesh((x, y) => [x, y, x * x + y * y], [0, 2, 4], [0, 1, 2]),
        ...s.line([2, 0, 0], [2, 1, 0]),
        ...s.line([0, 1, 0], [2, 1, 0]),
        ...s.line([2, 0, 0], [2, 0, 4], undefined, true),
        ...s.line([2, 1, 0], [2, 1, 5], undefined, true),
        ...s.line([0, 1, 0], [0, 1, 1], undefined, true),
        ...s.say([2, 1, 5], "z = x² + y²", "e"),
        ...s.say([2, 1, 0], "V = 8/3 + 2/3 = 10/3", "e"),
      ],
      "For example, over [0, 2] × [0, 1], the height is x² + y². The volume is a³b/3 + ab³/3 = 8/3 + 2/3 = 10/3.",
      "例如，在 [0, 2] × [0, 1] 上，高度为 x² + y²。体积为 a³b/3 + ab³/3 = 8/3 + 2/3 = 10/3。",
    );
  })(),
  "calculating-volumes-of-solids-using-triple-integrals#the-volume-common-to-two-cylinders": (() => {
    const s = scene(1.7);
    const r = 2;
    const edge = (sy: number, sz: number): Mark[] => s.curve((t) => [r * sin(t), sy * r * cos(t), sz * r * cos(t)], -pi / 2, pi / 2);
    const slice = (x: number, tone?: Tone): Mark[] => {
      const h = sqrt(r * r - x * x);
      return s
        .line([x, -h, -h], [x, h, -h], tone)
        .concat(s.line([x, h, -h], [x, h, h], tone), s.line([x, h, h], [x, -h, h], tone), s.line([x, -h, h], [x, -h, -h], tone));
    };
    const h1 = sqrt(3);
    return drawing(
      [
        ...edge(1, 1),
        ...edge(1, -1),
        ...edge(-1, 1),
        ...edge(-1, -1),
        ...slice(0),
        ...slice(-1),
        ...s.patch([
          [1, -h1, -h1],
          [1, h1, -h1],
          [1, h1, h1],
          [1, -h1, h1],
        ]),
        ...s.say([1, -h1, 0], "2√3", "e"),
        ...s.say([1, 0, -h1], "x = 1", "s"),
        ...s.say([0, 2.4, 2], "V = 128/3", "e"),
      ],
      "For example, with r = 2, at x = 1 both y and z run between ±√3, so the shaded cross section is a square of side 2√3 and area 12. In general the area is 4(4 − x²), and integrating it from −2 to 2 gives V = 128/3.",
      "例如，取 r = 2，在 x = 1 处 y 和 z 都在 ±√3 之间，所以阴影截面是边长 2√3、面积 12 的正方形。一般地，面积为 4(4 − x²)，从 −2 到 2 积分得 V = 128/3。",
    );
  })(),
  "changing-the-order-of-integration-in-triple-integrals-changing-projection#reprojecting-triple-integrals-from-xy-to-xz-plane": (() => {
    const s = scene(2.2);
    return drawing(
      [
        ...s.axes(4, 3, 2),
        ...s.patch(
          [
            [0, 0, 0],
            [3, 0, 0],
            [0, 0, 1],
          ],
          "action",
        ),
        ...s.patch([
          [0, 2, 0],
          [3, 2, 0],
          [0, 2, 1],
        ]),
        ...s.line([3, 0, 0], [3, 2, 0]),
        ...s.line([0, 0, 1], [0, 2, 1]),
        ...s.say([1.5, 1, 0.5], "1 − x/3", "n"),
        ...s.say([3, 2, 0], "V = 3", "e"),
      ],
      "For example, with a = 3 and b = 2, the wedge 0 ≤ z ≤ 1 − x/3, 0 ≤ y ≤ 2 projects onto the xz-plane as a triangle of area 3/2, with constant limits for y. Its volume is (3/2) · 2 = 3.",
      "例如，取 a = 3，b = 2，楔形 0 ≤ z ≤ 1 − x/3，0 ≤ y ≤ 2 在 xz 平面上的投影是面积 3/2 的三角形，y 的积分限为常数。其体积为 (3/2) · 2 = 3。",
    );
  })(),
  "changing-the-order-of-integration-in-triple-integrals-changing-projection#the-volume-of-a-parabolic-cylinder-slab": (() => {
    const s = scene(1.3);
    const par =
      (z: number) =>
      (x: number): P3 => [x, x * x, z];
    return drawing(
      [
        ...s.axes(3, 6, 4),
        ...s.patch(swing((x) => [x, x * x], -2, 2, 40).map(([x, y]) => [x, y, 0])),
        ...s.curve(par(2), -2, 2),
        ...s.line([-2, 4, 2], [2, 4, 2]),
        ...s.line([-2, 4, 0], [-2, 4, 2]),
        ...s.line([2, 4, 0], [2, 4, 2]),
        ...s.say([2, 4.4, 1], "h = 2", "e"),
        ...s.say([-2, 4.2, 0], "y = 4", "e"),
        ...s.say([0, 6, 3], "V = (32/3) · 2 = 64/3", "e"),
      ],
      "For example, with a = 2 and h = 2, the shaded projection x² ≤ y ≤ 4 has area ∫₋₂² (4 − x²) dx = 32/3. The height is constant, so the volume is (32/3) · 2 = 64/3.",
      "例如，取 a = 2，h = 2，阴影投影 x² ≤ y ≤ 4 的面积为 ∫₋₂² (4 − x²) dx = 32/3。高度不变，所以体积为 (32/3) · 2 = 64/3。",
    );
  })(),
  "changing-the-order-of-integration-in-triple-integrals-changing-projection#a-projection-that-separates-the-variables": (() => {
    const s = scene(1.8);
    return drawing(
      [
        ...s.axes(3, 4, 3),
        ...s.patch(
          [
            [0, 0, 0],
            [2, 0, 0],
            [0, 0, 2],
          ],
          "action",
        ),
        ...s.patch([
          [0, 3, 0],
          [2, 3, 0],
          [0, 3, 2],
        ]),
        ...s.line([2, 0, 0], [2, 3, 0]),
        ...s.line([0, 0, 2], [0, 3, 2]),
        ...s.say([0.6, 0, 0.4], "A = 2", "n"),
        ...s.say([0, 4, 2], "∫₀³ y dy = 9/2", "e"),
      ],
      "For example, ∭ y dV over the prism x + z ≤ 2, x, z ≥ 0, 0 ≤ y ≤ 3. Its projection to the xz-plane is a triangle of area 2 and the limits for y are constant, so the integral is 2 · 9/2 = 9.",
      "例如，棱柱 x + z ≤ 2，x, z ≥ 0，0 ≤ y ≤ 3 上的 ∭ y dV。它在 xz 平面上的投影是面积 2 的三角形，y 的积分限为常数，所以积分为 2 · 9/2 = 9。",
    );
  })(),
  "changing-the-order-of-integration-in-triple-integrals-changing-region#changing-the-order-to-do-the-easy-integrals-first": (() => {
    const s = scene(3);
    const [o, a, b, c]: [P3, P3, P3, P3] = [
      [0, 0, 0],
      [2, 0, 0],
      [2, 2, 0],
      [2, 2, 2],
    ];
    return drawing(
      [
        ...s.axes(3, 3, 3),
        ...s.line(o, a),
        ...s.line(a, b),
        ...s.line(b, c),
        ...s.line(o, b),
        ...s.line(o, c),
        ...s.line(a, c),
        ...s.patch([
          [1.5, 0, 0],
          [1.5, 1.5, 0],
          [1.5, 1.5, 1.5],
        ]),
        ...s.say(c, "(2, 2, 2)", "e"),
        ...s.say([1.5, 1.5, 0], "x = 3/2", "se"),
        ...s.say([1.5, 1.5, 1.5], "x²/2 = 9/8", "nw"),
      ],
      "For example, with a = 2, the limits 0 ≤ z ≤ y ≤ x ≤ 2 describe this tetrahedron. At x = 3/2 the shaded slice is a right triangle with legs 3/2, whose area x²/2 = 9/8 is the factor left after integrating z and y.",
      "例如，取 a = 2，界限 0 ≤ z ≤ y ≤ x ≤ 2 描述这个四面体。在 x = 3/2 处，阴影切片是两直角边为 3/2 的直角三角形，面积 x²/2 = 9/8，正是对 z 和 y 积分后留下的因子。",
    );
  })(),
  "double-integrals-in-plane-polar-coordinates#polar-limits-from-a-drawing": graphed(
    wide(-1, 5, -1, 4),
    [...ringPiece(1, 3, pi / 6, pi / 2), tag([1.7, 0.8], "1 ≤ r ≤ 3", "e"), tag([2.2, 2.9], "π/6 ≤ θ ≤ π/2", "e")],
    "For example, between the arcs r = 1 and r = 3 and the rays θ = π/6 and θ = π/2, the limits are 1 ≤ r ≤ 3 and π/6 ≤ θ ≤ π/2, and the area element is r dr dθ.",
    "例如，圆弧 r = 1、r = 3 与射线 θ = π/6、θ = π/2 之间的区域，积分限为 1 ≤ r ≤ 3，π/6 ≤ θ ≤ π/2，面积元为 r dr dθ。",
  ),
  "double-integrals-in-plane-polar-coordinates#polar-limits-of-a-drawn-sector": graphed(
    wide(-1, 6, -1, 5),
    [...ringPiece(2, 4, 0, pi / 3), tag([2.5, 4], "2 ≤ r ≤ 4", "e"), tag([4, 2], "0 ≤ θ ≤ π/3", "e"), tag([3.2, 1.2], "A = 2π", "s")],
    "For example, the sector of a ring with 2 ≤ r ≤ 4 and 0 ≤ θ ≤ π/3. With the factor r, its area is (π/3) · (16 − 4)/2 = 2π.",
    "例如，2 ≤ r ≤ 4，0 ≤ θ ≤ π/3 的环形扇区。计入因子 r，面积为 (π/3) · (16 − 4)/2 = 2π。",
  ),
  "double-integrals-between-polar-curves#integrating-over-annular-polar-regions": graphed(
    wide(-1, 5, -1, 4),
    [
      ...ringPiece(1, 3, 0, pi / 2),
      tag([1, -0.45], "r₁ = 1", "s"),
      tag([3, -0.45], "r₂ = 3", "s"),
      tag([2.2, 2.3], "A/π = (9 − 1)/4 = 2", "e"),
    ],
    "For example, with r₁ = 1, r₂ = 3 and k = 2, the sector 0 ≤ θ ≤ π/2 has area over π equal to (r₂² − r₁²)/(2k) = 8/4 = 2.",
    "例如，取 r₁ = 1，r₂ = 3，k = 2，扇区 0 ≤ θ ≤ π/2 的面积除以 π 等于 (r₂² − r₁²)/(2k) = 8/4 = 2。",
  ),
  "double-integrals-between-polar-curves#areas-enclosed-by-classic-polar-curves": (() => {
    const loop = (r: (t: number) => number, a: number, b: number): Point[] => swing((t) => [r(t) * cos(t), r(t) * sin(t)], a, b, 200);
    const u = 2;
    const up = (ps: readonly Point[], dx: number): Point[] => ps.map(([x, y]) => [dx + u * x, 3 + u * y]);
    return drawing(
      [
        ...flat(
          up(
            loop((t) => 2 * cos(t), 0, pi),
            0,
          ),
        ),
        note([2, 0], "r = 2a cos θ", "s"),
        note([2, 3], "πa²", "n"),
        ...flat(
          up(
            loop((t) => 1 + cos(t), 0, 2 * pi),
            8,
          ),
        ),
        note([9.5, 0], "r = a(1 + cos θ)", "s"),
        note([10, 3], "3πa²/2", "n"),
        ...flat(
          up(
            loop((t) => 1.5 * cos(3 * t), 0, pi),
            18,
          ),
        ),
        note([18, 0], "r = a cos 3θ", "s"),
        note([18, 5.4], "πa²/4", "n"),
      ],
      "Three curves: the circle r = 2a cos θ encloses πa², the cardioid r = a(1 + cos θ) encloses 3πa²/2, and the rose r = a cos 3θ, with n = 3 odd and 3 petals, encloses πa²/4.",
      "三条曲线：圆 r = 2a cos θ 围成面积 πa²，心形线 r = a(1 + cos θ) 围成 3πa²/2，玫瑰线 r = a cos 3θ（n = 3 为奇数，3 瓣）围成 πa²/4。",
    );
  })(),
  "double-integrals-between-polar-curves#the-area-of-a-drawn-piece-of-a-ring": graphed(
    wide(-1, 4, -1, 3),
    [
      ...ringPiece(1, 2, 0, pi / 2),
      tag([1, -0.35], "a = 1", "s"),
      tag([2, -0.35], "b = 2", "s"),
      tag([-0.9, 2.55], "A = (1/2)(π/2)(4 − 1) = 3π/4", "e"),
    ],
    "For example, radii a = 1 and b = 2 and angle Δθ = π/2. The area is (1/2)(π/2)(4 − 1) = 3π/4.",
    "例如，半径 a = 1，b = 2，角 Δθ = π/2。面积为 (1/2)(π/2)(4 − 1) = 3π/4。",
  ),
  "computing-areas-using-a-change-of-variables#the-area-of-a-parallelogram-from-a-linear-change-of-variables": drawing(
    [
      ...pane(0, [0, 4, 1], [-2, 2, 1], 7, 7).marks(),
      ...flat(
        [
          [0, 3.5],
          [3.5, 5.25],
          [5.25, 3.5],
          [1.75, 1.75],
        ].map(([x, y]) => [x as number, y as number]),
      ),
      note([4.5, 5], "A = 3", "ne"),
      ...head([8.4, 3.5], [10, 3.5]),
      ...pane(11, [0, 4, 1], [0, 4, 1], 7, 7, "u", "v").marks(),
      ...flat([
        [11, 0],
        [11 + 5.25, 0],
        [11 + 5.25, 5.25],
        [11, 5.25],
      ]),
      note([11 + 2.6, 2.2], "9", "n"),
      note([11 + 2.6, 6.6], "|J| = 3", "n"),
    ],
    "For example, u = x + y and v = x − 2y with 0 ≤ u ≤ 3 and 0 ≤ v ≤ 3. The parallelogram with vertices (0, 0), (2, 1), (3, 0), (1, −1) maps to a square of area 9. Since ps − qr = −3, the area is 9/3 = 3.",
    "例如，u = x + y，v = x − 2y，0 ≤ u ≤ 3，0 ≤ v ≤ 3。顶点为 (0, 0)、(2, 1)、(3, 0)、(1, −1) 的平行四边形映射为面积 9 的正方形。由于 ps − qr = −3，面积为 9/3 = 3。",
  ),
  "computing-areas-using-a-change-of-variables#an-integral-through-a-drawn-change-of-variables": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 3, 1], 6, 6, "u", "v").marks(),
      ...flat(rect(0, 0, 4, 2), "action"),
      note([2, 0.6], "2", "n"),
      ...head([8, 3], [9.8, 3]),
      note([8.9, 3], "T", "n"),
      ...pane(11, [0, 6, 1], [0, 5, 1], 7.2, 6).marks(),
      ...flat(
        (
          [
            [0, 0],
            [4, 2],
            [5, 4],
            [1, 2],
          ] as Point[]
        ).map(([x, y]) => [11 + x * 1.2, y * 1.2] as Point),
      ),
      note([11 + 3.2, 2.4], "6", "n"),
      note([11 + 3.6, 7], "|J| = 3,  k = 2,  ∬ = 12", "n"),
    ],
    "For example, T(1, 0) = (2, 1) and T(0, 1) = (1, 2), so J = 4 − 1 = 3. The rectangle [0, 2] × [0, 1] of area 2 goes to a parallelogram of area 6. With k = 2 the integral is 2 · 3 · 2 = 12.",
    "例如，T(1, 0) = (2, 1)，T(0, 1) = (1, 2)，所以 J = 4 − 1 = 3。面积为 2 的矩形 [0, 2] × [0, 1] 变为面积 6 的平行四边形。取 k = 2，积分为 2 · 3 · 2 = 12。",
  ),
  "computing-double-integrals-using-a-change-of-variables#integrating-over-parallelograms-via-linear-coordinates": graphed(
    wide(-1, 4, -2, 3),
    [
      ...poly([
        [0, 0],
        [1, 1],
        [2, 0],
        [1, -1],
      ]),
      tag([0.5, 0.5], "u = x + y", "n"),
      tag([0.5, -0.5], "v = x − y", "s"),
      tag([2.3, 1.5], "A = UV/2 = 2", "e"),
    ],
    "For example, with U = V = 2, the region 0 ≤ x + y ≤ 2, 0 ≤ x − y ≤ 2 is the square with vertices (0, 0), (1, 1), (2, 0), (1, −1). The rectangle in u and v has area 4, and the Jacobian factor 1/2 gives area UV/2 = 2.",
    "例如，取 U = V = 2，区域 0 ≤ x + y ≤ 2，0 ≤ x − y ≤ 2 是顶点为 (0, 0)、(1, 1)、(2, 0)、(1, −1) 的正方形。u、v 中的矩形面积为 4，雅可比因子 1/2 给出面积 UV/2 = 2。",
  ),
  "computing-double-integrals-using-a-change-of-variables#integrating-x-plus-y-over-a-rotated-square": graphed(
    wide(-1, 4, -2, 3),
    [
      ...poly([
        [0, 0],
        [1, 1],
        [2, 0],
        [1, -1],
      ]),
      ...[0.5, 1, 1.5].map((c) =>
        joined(
          [
            [c / 2, c / 2],
            [c / 2 + 1, c / 2 - 1],
          ],
          "action",
          true,
        ),
      ),
      tag([2.3, 1.5], "(1/2)(U²/2)V = 2", "e"),
    ],
    "For example, with U = V = 2, x + y = u is constant along the dashed lines. The integral is (1/2) ∫₀² ∫₀² u dv du = (1/2) · 2 · 2 = 2.",
    "例如，取 U = V = 2，x + y = u 沿虚线为常数。积分为 (1/2) ∫₀² ∫₀² u dv du = (1/2) · 2 · 2 = 2。",
  ),
  "computing-double-integrals-using-a-change-of-variables#a-difference-of-squares-under-a-rotated-rectangle": drawing(
    [
      ...pane(0, [0, 4, 1], [-3, 2, 1], 7, 8.75).marks(),
      ...flat(
        (
          [
            [0, 0],
            [1, 1],
            [3, -1],
            [2, -2],
          ] as Point[]
        ).map(([x, y]) => [x * 1.75, (y + 3) * 1.75] as Point),
      ),
      ...head([8.6, 4.4], [10.6, 4.4]),
      ...pane(12, [0, 3, 1], [0, 5, 1], 5.25, 8.75, "u", "v").marks(),
      ...flat(rect(12, 0, 12 + 3.5, 7)),
      note([12 + 1.75, 2.6], "uv", "n"),
      note([16, 4], "(1/2) · 2 · 8 = 8", "e"),
    ],
    "For example, 0 ≤ x + y ≤ 2 and 0 ≤ x − y ≤ 4 give a rotated rectangle with vertices (0, 0), (1, 1), (3, −1), (2, −2). In u and v it is [0, 2] × [0, 4] and x² − y² = uv. With the factor 1/2, the integral is (1/2) · 2 · 8 = 8.",
    "例如，0 ≤ x + y ≤ 2，0 ≤ x − y ≤ 4 给出顶点为 (0, 0)、(1, 1)、(3, −1)、(2, −2) 的旋转矩形。在 u、v 中它是 [0, 2] × [0, 4]，且 x² − y² = uv。乘因子 1/2，积分为 (1/2) · 2 · 8 = 8。",
  ),
};
