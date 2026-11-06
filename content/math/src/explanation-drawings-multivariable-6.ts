// Drawings in the explanations of Multivariable Calculus about vector line integrals, normals, circulation, flux and Green's theorem. Every arrow is computed from the field it shows, and every side of a region is integrated on its own.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { head, joined, polarBand, sector } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note } from "./explanation-drawings-kit.ts";
import { swing } from "./explanation-drawings-multivariable-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
type Tone = "action" | "result";
const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const hoop = (c: Point, r: number, tone?: Tone) => ({ kind: "circle", center: c, r, ...(tone ? { tone } : {}) }) as const;
/** A closed path with an arrow at the middle of each side, in the order of its corners. */
const loop = (ps: readonly Point[], tone: Tone = "result") => [
  joined([...ps, ps[0] as Point], tone),
  ...ps.map((p, i) => {
    const q = ps[(i + 1) % ps.length] as Point;
    return toward([0.45 * q[0] + 0.55 * p[0], 0.45 * q[1] + 0.55 * p[1]], [0.58 * q[0] + 0.42 * p[0], 0.58 * q[1] + 0.42 * p[1]], tone);
  }),
];
/** Arrows of a field at points of the circle of radius r, scaled by s. */
const rim = (F: (x: number, y: number) => Point, r: number, n: number, s: number, tone: Tone = "action", c: Point = [0, 0]) =>
  Array.from({ length: n }, (_, i) => {
    const t = (2 * pi * i) / n + pi / n;
    const at: Point = [c[0] + r * cos(t), c[1] + r * sin(t)];
    const [u, v] = F(at[0], at[1]);
    return toward(at, [at[0] + s * u, at[1] + s * v], tone);
  });
/** Small arrows along a circle in the direction of travel, one per marked angle. */
const spinOn = (r: number, ts: readonly number[], tone: Tone = "result", sense = 1) =>
  ts.map((t) => toward([r * cos(t), r * sin(t)], [r * cos(t + (sense * 0.45) / r), r * sin(t + (sense * 0.45) / r)], tone));

/** multivariableDrawings6 holds the drawings of the Multivariable Calculus explanations about vector line integrals, circulation, flux and Green's theorem, by explanation key. */
export const multivariableDrawings6: Readonly<Record<string, Figure>> = {
  "line-integrals-of-vector-valued-functions-over-parametric-curves#a-rotational-field-along-a-circular-arc": graphed(
    wide(-1, 4, -1, 4),
    [
      { kind: "path", points: swing((t) => [2 * cos(t), 2 * sin(t)] as Point, 0, pi / 2, 40), tone: "result" },
      ...[0.3, 0.8, 1.3].map((t) => toward([2 * cos(t), 2 * sin(t)], [2 * cos(t) - 0.5 * 2 * sin(t), 2 * sin(t) + 0.5 * 2 * cos(t)])),
      tag([2.4, 2.6], "F·r′ = aR² = 4", "e"),
      tag([2.4, 3.3], "∫ = 4 · π/2 = 2π", "e"),
    ],
    "For example, a = 1 and R = 2 on the quarter circle. The field ⟨−y, x⟩, shown scaled, is along the path everywhere, and F · r′ = aR² = 4. The integral over t from 0 to π/2 is 2π.",
    "例如，a = 1，R = 2，在四分之一圆上。场 ⟨−y, x⟩（按比例缩小）处处沿路径方向，F · r′ = aR² = 4。对 t 从 0 到 π/2 积分得 2π。",
  ),
  "line-integrals-of-vector-valued-functions-over-general-curves#a-vector-line-integral-along-a-graph-y-equals-x-squared": graphed(
    wide(-1, 5, -1, 5),
    [
      curveOf((x) => x * x, "result", 0, 2),
      toward([1.4, 1.96], [1.5, 2.25], "result"),
      pt([2, 4], "(2, 4)", "e"),
      tag([2, 1.6], "dy = 2x dx", "e"),
      tag([2, 0.8], "∫₀² (x³ + 2x) dx = 8", "e"),
    ],
    "For example, F = ⟨xy, 1⟩ along y = x² from x = 0 to x = 2. With dy = 2x dx, the integrand is x · x² + 2x, and the integral is 4 + 4 = 8.",
    "例如，F = ⟨xy, 1⟩，沿 y = x² 从 x = 0 到 x = 2。由 dy = 2x dx，被积函数为 x · x² + 2x，积分为 4 + 4 = 8。",
  ),
  "line-integrals-of-vector-valued-functions-over-general-curves#a-vector-line-integral-along-a-graph-x-in-terms-of-y": graphed(
    wide(-0.5, 3, -0.5, 1.5, 1, 0.5),
    [
      { kind: "path", points: swing((y) => [y * y, y] as Point, 0, 1, 30), tone: "result" },
      toward([0.49, 0.7], [0.64, 0.8], "result"),
      pt([1, 1], "(1, 1)", "e"),
      tag([0.9, 0.5], "dx = 2y dy", "e"),
      tag([0.9, 0.2], "∫₀¹ 3y² dy = 1", "e"),
    ],
    "For example, F = ⟨y, x⟩ along x = y² from (0, 0) to (1, 1). The term in dx gives y · 2y dy and the term in dy gives y² dy, so the integrand is 3y² and the integral is 1.",
    "例如，F = ⟨y, x⟩，沿 x = y² 从 (0, 0) 到 (1, 1)。dx 项给出 y · 2y dy，dy 项给出 y² dy，所以被积函数为 3y²，积分为 1。",
  ),
  "interpreting-line-integrals-of-vector-valued-functions#the-sign-of-a-vector-line-integral": (() => {
    const panel = (dx: number, f: (x: number) => [Point, Point], label: string) => [
      ...head([dx, 0], [dx + 5, 0], "result"),
      ...[0.6, 2.2, 3.8].flatMap((x) => {
        const [a, b] = f(x);
        return head([dx + a[0], a[1]], [dx + b[0], b[1]], "action");
      }),
      note([dx + 2.5, -0.8], label, "s"),
    ];
    return drawing(
      [
        ...panel(
          0,
          (x) => [
            [x, 0.8],
            [x + 1, 0.8],
          ],
          "∫ F·dr > 0",
        ),
        ...panel(
          7,
          (x) => [
            [x + 1, 0.8],
            [x, 0.8],
          ],
          "∫ F·dr < 0",
        ),
        ...panel(
          14,
          (x) => [
            [x + 0.5, 0.4],
            [x + 0.5, 1.4],
          ],
          "∫ F·dr = 0",
        ),
      ],
      "A path and a field in three cases. The integral is positive when the field mostly pushes along the path, negative when it mostly pushes against it, and zero when the field is perpendicular to it.",
      "路径和场的三种情况。场大体沿路径推动时积分为正，大体逆路径推动时积分为负，场与路径垂直时积分为零。",
    );
  })(),
  "interpreting-line-integrals-of-vector-valued-functions#the-sign-of-the-work-from-a-drawing": graphed(
    wide(-1, 5, -1, 4),
    [
      ...[0, 1, 2, 3].flatMap((x) => [0.5, 1.5, 2.5].map((y) => toward([x, y], [x + 0.7, y]))),
      joined(
        [
          [0, 0],
          [3, 2],
        ],
        "result",
      ),
      toward([2.4, 1.6], [2.8, 1.87], "result"),
      tag([3.5, 3], "F·T > 0", "e"),
    ],
    "For example, a field of arrows pointing right and a path going up and to the right. The arrows have a positive part along the direction of travel everywhere, so the work is positive.",
    "例如，向右的场和向右上方的路径。箭头处处有沿前进方向的正分量，所以功为正。",
  ),
  "conservative-vector-fields-and-closed-paths#a-nonzero-circulation-rules-out-a-potential": graphed(
    wide(-3, 6, -3, 3),
    [
      hoop([0, 0], 1.5, "result"),
      ...rim((x, y) => [-y, x], 1.5, 8, 0.45),
      tag([2, 1.8], "∮ F·dr = 2πR² ≠ 0", "e"),
      tag([0.5, 0], "R", "n"),
      joined([
        [0, 0],
        [1.5, 0],
      ]),
    ],
    "For example, a = b = 1: the field ⟨−y, x⟩ runs along the counterclockwise circle of radius R everywhere, so its circulation is 2πR², which is not 0. So this field has no potential.",
    "例如，a = b = 1：场 ⟨−y, x⟩ 处处沿半径 R 的逆时针圆，所以环量为 2πR²，不为 0。所以这个场没有势函数。",
  ),
  "outward-pointing-unit-normal-vectors-in-2d#outward-normals-on-a-circle": graphed(
    wide(-3, 6, -3, 4),
    [
      hoop([0, 0], 2),
      bare([sqrt(2), sqrt(2)]),
      toward([sqrt(2), sqrt(2)], [sqrt(2) + 0.71, sqrt(2) + 0.71], "result"),
      toward([sqrt(2), sqrt(2)], [sqrt(2) - 0.71, sqrt(2) + 0.71], "action"),
      tag([sqrt(2) + 0.71, sqrt(2) + 0.71], "n = ⟨1, 1⟩/√2", "e"),
      tag([sqrt(2) - 0.71, sqrt(2) + 0.71], "r′", "n"),
    ],
    "For example, R = 2 at t = π/4, the point (√2, √2). The tangent r′ = ⟨−√2, √2⟩, shown scaled, points counterclockwise. Turning it a quarter turn clockwise gives ⟨y′, −x′⟩ = ⟨√2, √2⟩, and dividing by its length gives the outward unit normal n = ⟨1, 1⟩/√2.",
    "例如，R = 2，t = π/4，点 (√2, √2)。切向量 r′ = ⟨−√2, √2⟩（按比例缩短画出）指向逆时针方向。顺时针转四分之一圈得 ⟨y′, −x′⟩ = ⟨√2, √2⟩，除以其长度得外单位法向量 n = ⟨1, 1⟩/√2。",
  ),
  "outward-pointing-unit-normal-vectors-in-2d#outward-normals-on-a-polygon": graphed(
    wide(-1, 6, -1, 5),
    [
      ...loop([
        [0, 0],
        [4, 0],
        [0, 3],
      ]),
      toward([2, 1.5], [3.2, 3.1], "action"),
      tag([3.2, 3.1], "n = ⟨3, 4⟩/5", "e"),
      tag([1.2, 2.3], "⟨−4, 3⟩", "ne"),
    ],
    "For example, on the triangle with vertices (0, 0), (4, 0), (0, 3), the side from (4, 0) to (0, 3) has tangent direction ⟨−4, 3⟩. So ⟨d_y, −d_x⟩ = ⟨3, 4⟩, of length 5, and the outward unit normal is ⟨3, 4⟩/5.",
    "例如，在顶点为 (0, 0)、(4, 0)、(0, 3) 的三角形上，从 (4, 0) 到 (0, 3) 的边切方向为 ⟨−4, 3⟩。所以 ⟨d_y, −d_x⟩ = ⟨3, 4⟩，长度为 5，外单位法向量为 ⟨3, 4⟩/5。",
  ),
  "outward-pointing-unit-normal-vectors-in-2d#the-outward-normal-on-an-ellipse": graphed(
    wide(-4, 5, -2, 4),
    [
      { kind: "path", points: swing((t) => [sqrt(8) * cos(t), sqrt(2) * sin(t)] as Point, 0, 2 * pi, 80) },
      joined(
        [
          [0, 0],
          [2, 1],
        ],
        undefined,
        true,
      ),
      toward([2, 1], [3, 3], "result"),
      pt([2, 1], "(2, 1)", "nw"),
      tag([3, 3], "⟨4, 8⟩ ∥ ⟨1, 2⟩", "n"),
      toward([2, 1], [3, 1.5], "action"),
      tag([3.1, 1.6], "⟨2, 1⟩", "e"),
    ],
    "For example, x² + 4y² = 8 at (2, 1). The gradient ⟨2x, 8y⟩ = ⟨4, 8⟩ gives the outward normal, along ⟨1, 2⟩. The position vector ⟨2, 1⟩, dashed, points another way: they agree only on a circle.",
    "例如，x² + 4y² = 8，在 (2, 1) 处。梯度 ⟨2x, 8y⟩ = ⟨4, 8⟩ 给出外法向量，沿 ⟨1, 2⟩ 方向。位置向量 ⟨2, 1⟩（虚线）指向另一方向：二者只在圆上一致。",
  ),
  "circulation#circulation-around-a-rectangle": graphed(
    wide(-1, 6, -1, 4),
    [
      ...loop(rect(0, 0, 3, 2)),
      tag([1.5, 0.05], "0", "n"),
      tag([3, 1], "6", "e"),
      tag([1.5, 2], "6", "n"),
      tag([0.05, 1], "0", "e"),
      tag([4.5, 3], "∮ = 12", "n"),
    ],
    "For example, F = ⟨−y, x⟩ around [0, 3] × [0, 2]. On the bottom y = 0 and on the left x = 0, so both give 0. The right side gives ∫₀² 3 dy = 6, and the top, going backwards, gives ∫₃⁰ (−2) dx = 6. The circulation is 12.",
    "例如，F = ⟨−y, x⟩，沿 [0, 3] × [0, 2]。底边 y = 0，左边 x = 0，都给出 0。右边给出 ∫₀² 3 dy = 6，顶边反向给出 ∫₃⁰ (−2) dx = 6。环量为 12。",
  ),
  "circulation#circulation-around-a-circle": graphed(
    wide(-3, 6, -3, 3),
    [
      hoop([0, 0], 2, "result"),
      ...rim((x, y) => [-y, x], 2, 8, 0.35),
      tag([3, 1.5], "F·T = kR = 2", "e"),
      tag([3, 0.5], "∮ = 2 · 4π = 8π", "e"),
    ],
    "For example, k = 1 and R = 2: the field is tangent to the circle with constant length kR = 2, and the length of the circle is 4π. The circulation is 8π.",
    "例如，k = 1，R = 2：场与圆相切，长度恒为 kR = 2，圆长为 4π。环量为 8π。",
  ),
  "flux-in-two-dimensional-vector-fields#the-flux-of-a-constant-field-across-an-arc": graphed(
    wide(-1, 5, -1, 4),
    [
      { kind: "path", points: swing((t) => [2 * cos(t), 2 * sin(t)] as Point, 0, pi / 2, 40), tone: "result" },
      joined(
        [
          [2, 0],
          [0, 2],
        ],
        undefined,
        true,
      ),
      ...[
        [2.5, 1],
        [2.5, 2.5],
        [1, 2.8],
      ].map(([x, y]) => toward([x as number, y as number], [(x as number) + 1, (y as number) + 0.5])),
      pt([2, 0], "(2, 0)", "se"),
      pt([0, 2], "(0, 2)", "nw"),
      tag([3.8, 0.5], "Φ = 6", "n"),
    ],
    "For example, F = ⟨2, 1⟩ across arcs from (2, 0) to (0, 2). Here Δy = 2 and Δx = −2, so ∫ P dy − Q dx = 2 · 2 − 1 · (−2) = 6, for the quarter circle and for the dashed segment alike.",
    "例如，F = ⟨2, 1⟩，穿过从 (2, 0) 到 (0, 2) 的弧。Δy = 2，Δx = −2，所以 ∫ P dy − Q dx = 2 · 2 − 1 · (−2) = 6，四分之一圆和虚线段都一样。",
  ),
  "calculating-flux-in-two-dimensional-vector-fields#outward-flux-across-a-rectangle": graphed(
    wide(-2, 6, -2, 4),
    [
      ...loop(rect(0, 0, 3, 2)),
      toward([3, 1], [3.8, 1], "action"),
      toward([1.5, 2], [1.5, 2.8], "action"),
      toward([0, 1], [-0.8, 1], "action"),
      toward([1.5, 0], [1.5, -0.8], "action"),
      tag([3.8, 1], "6", "e"),
      tag([1.5, 2.8], "6", "n"),
      tag([-0.8, 1], "0", "w"),
      tag([1.5, -0.8], "0", "s"),
      tag([4.5, 3], "Φ = 12", "n"),
    ],
    "For example, F = ⟨x, y⟩ out of [0, 3] × [0, 2]. On the right P = 3 over length 2 gives 6, on the top Q = 2 over length 3 gives 6, and on the left and bottom the field's normal part is 0. The outward flux is 12.",
    "例如，F = ⟨x, y⟩，穿出 [0, 3] × [0, 2]。右边 P = 3，长度 2，得 6；顶边 Q = 2，长度 3，得 6；左边和底边场的法向分量为 0。外通量为 12。",
  ),
  "calculating-flux-in-two-dimensional-vector-fields#outward-flux-across-a-circle": graphed(
    wide(-3, 6, -3, 3),
    [hoop([0, 0], 2, "result"), ...rim((x, y) => [x, y], 2, 8, 0.35), tag([3, 1.5], "F·n = R = 2", "e"), tag([3, 0.5], "2 · 4π = 8π", "e")],
    "For example, F = ⟨x, y⟩ on the circle of radius R = 2. Using ∫ cos²t dt = ∫ sin²t dt = π, the flux is R²(π + π) = 8π.",
    "例如，F = ⟨x, y⟩，半径 R = 2 的圆。利用 ∫ cos²t dt = ∫ sin²t dt = π，通量为 R²(π + π) = 8π。",
  ),
  "calculating-flux-in-two-dimensional-vector-fields#the-flux-through-one-edge": graphed(
    wide(-1, 5, -1, 5),
    [
      shape(rect(0, 0, 2, 3)),
      joined(
        [
          [0, 3],
          [2, 3],
        ],
        "result",
      ),
      joined([
        [0, 3],
        [0, 0],
        [2, 0],
        [2, 3],
      ]),
      toward([1, 3], [1, 3.8], "action"),
      tag([1, 3.8], "n = ⟨0, 1⟩", "n"),
      tag([2.5, 2], "∫₀² Q(x, 3) dx = 6", "e"),
    ],
    "For example, F = ⟨x, xy⟩ on the top edge of [0, 2] × [0, 3]. The outward normal is ⟨0, 1⟩, so only Q enters, with y fixed at 3: ∫₀² 3x dx = 6.",
    "例如，F = ⟨x, xy⟩，在 [0, 2] × [0, 3] 的顶边上。外法向量为 ⟨0, 1⟩，所以只有 Q 起作用，y 固定为 3：∫₀² 3x dx = 6。",
  ),
  "source-free-vector-fields#balanced-flux-of-source-free-fields": graphed(
    wide(-2, 5, -1, 3),
    [
      ...loop(rect(0, 0, 2, 2)),
      toward([-1.2, 0.5], [-0.2, 0.5], "action"),
      toward([-1.2, 1.5], [-0.2, 1.5], "action"),
      toward([2.2, 0.5], [3.2, 0.5], "action"),
      toward([2.2, 1.5], [3.2, 1.5], "action"),
      tag([0, 1], "−2", "e"),
      tag([2, 1], "+2", "w"),
      tag([3.5, 2.4], "−2 + 2 = 0", "n"),
    ],
    "For example, the constant field ⟨1, 0⟩, which has no sources, on the square [0, 2] × [0, 2]. The outward flux is −2 on the left, +2 on the right and 0 on the other two sides, and the total is 0.",
    "例如，无源的常向量场 ⟨1, 0⟩，在正方形 [0, 2] × [0, 2] 上。外通量左边为 −2，右边为 +2，其余两边为 0，总和为 0。",
  ),
  "circulation-and-flux-across-simple-closed-plane-curves#circulation-around-a-rectangle-edge-by-edge": graphed(
    wide(-1, 6, -1, 4),
    [
      ...loop(rect(0, 0, 3, 2)),
      tag([1.5, 0.05], "0", "n"),
      tag([3, 1], "12", "e"),
      tag([1.5, 2], "−6", "n"),
      tag([0.05, 1], "0", "e"),
      tag([4.5, 3], "∮ = 6", "n"),
    ],
    "For example, F = ⟨y, 2x⟩ with w = 3 and h = 2, so a = 1 and b = 2. The bottom and left edges give 0. The right edge gives bwh = 12 and the top, going backwards, gives −awh = −6. The circulation is 6.",
    "例如，F = ⟨y, 2x⟩，w = 3，h = 2，即 a = 1，b = 2。底边和左边给出 0。右边给出 bwh = 12，顶边反向给出 −awh = −6。环量为 6。",
  ),
  "greens-theorem-in-circulation-curl-form#applying-greens-theorem-for-circulation": graphed(
    wide(-1, 5, -1, 3),
    [
      shape(rect(0, 0, 2, 1)),
      ...loop(rect(0, 0, 2, 1)),
      tag([1, 0.25], "A = 2", "n"),
      tag([3, 2], "∇×F = 5", "n"),
      tag([3.4, 0.6], "5 · 2 = 10", "e"),
    ],
    "For example, F = ⟨−3y, 2x⟩ around [0, 2] × [0, 1]. Then ∂Q/∂x − ∂P/∂y = 2 + 3 = 5, a constant, so the circulation is 5 times the area 2, that is 10.",
    "例如，F = ⟨−3y, 2x⟩，沿 [0, 2] × [0, 1]。于是 ∂Q/∂x − ∂P/∂y = 2 + 3 = 5 是常数，所以环量是 5 乘面积 2，即 10。",
  ),
  "greens-theorem-in-circulation-curl-form#circulation-around-a-circle-by-greens-theorem": graphed(
    wide(-3, 6, -3, 3),
    [
      hoop([0, 0], 2, "result"),
      ...spinOn(2, [0.5, 2.5, 4.5]),
      tag([3, 2], "⟨x² − y, y³ + x⟩", "e"),
      tag([3, 1.3], "∇×F = 2", "e"),
      tag([3, 0.6], "2 · 4π = 8π", "e"),
    ],
    "For example, F = ⟨x² − y, y³ + x⟩. The terms x² and y³ drop out of the curl, which is 1 − (−1) = 2. Over the disk of radius 2, of area 4π, the circulation is 8π.",
    "例如，F = ⟨x² − y, y³ + x⟩。x² 和 y³ 两项不进入旋度，旋度为 1 − (−1) = 2。在半径 2、面积 4π 的圆盘上，环量为 8π。",
  ),
  "greens-theorem-in-circulation-curl-form#circulation-around-a-drawn-oriented-rectangle": graphed(
    wide(-1, 7, -1, 4),
    [
      ...loop([
        [0, 0],
        [0, 2],
        [3, 2],
        [3, 0],
      ]),
      tag([1.5, 0.7], "A = 6", "n"),
      tag([5, 2.5], "∇×F = 3", "n"),
      tag([5, 1.5], "−3 · 6 = −18", "n"),
    ],
    "For example, a scalar curl of 3 and a clockwise boundary, as the arrows show, around [0, 3] × [0, 2] of area 6. The double integral would be 18 for a counterclockwise boundary, so here the sign changes and the result is −18.",
    "例如，标量旋度为 3，边界按箭头所示为顺时针，绕面积 6 的 [0, 3] × [0, 2]。逆时针时二重积分为 18，这里符号改变，结果为 −18。",
  ),
  "greens-theorem-in-polar-coordinates#greens-theorem-over-a-disk-in-polar-coordinates": graphed(
    wide(-3, 6, -3, 3),
    [
      hoop([0, 0], 2, "result"),
      ...spinOn(2, [0.5, 2.5, 4.5]),
      hoop([0, 0], 1.2, "action"),
      tag([0.6, 0], "r", "n"),
      joined(
        [
          [0, 0],
          [1.2, 0],
        ],
        "action",
      ),
      tag([3, 1.5], "∇×F = 3r²", "e"),
      tag([3, 0.5], "2π · 3 · 2⁴/4 = 24π", "e"),
    ],
    "For example, a = 1 and radius 2. The curl 3r² is constant on each circle of radius r. So ∫₀²π ∫₀² 3r² · r dr dθ = 2π · 3 · 4 = 24π.",
    "例如，a = 1，半径 2。旋度 3r² 在半径 r 的每个圆上为常数。所以 ∫₀²π ∫₀² 3r² · r dr dθ = 2π · 3 · 4 = 24π。",
  ),
  "greens-theorem-in-polar-coordinates#greens-theorem-over-an-annulus-in-polar-coordinates": graphed(
    wide(-3, 8, -3, 3),
    [
      polarBand(
        () => 2,
        () => 1,
        0,
        2 * pi,
      ),
      hoop([0, 0], 2, "result"),
      hoop([0, 0], 1, "result"),
      ...spinOn(2, [0.5, 2.5, 4.5]),
      ...spinOn(1, [1, 3.4, 5.5], "action", -1),
      tag([3, 2.2], "r₁ = 1,  r₂ = 2", "e"),
      tag([3, 1.4], "2π · 3 · 15/4", "e"),
      tag([3, 0.6], "= 45π/2", "e"),
    ],
    "For example, F = ⟨−y³, x³⟩, curl 3r², on 1 ≤ r ≤ 2. The outer circle runs counterclockwise and the inner one clockwise, as the arrows show. So the circulation is 2π ∫₁² 3r³ dr = 2π · 3 · 15/4 = 45π/2.",
    "例如，F = ⟨−y³, x³⟩，旋度 3r²，在 1 ≤ r ≤ 2 上。外圆逆时针，内圆顺时针，如箭头所示。所以环量为 2π ∫₁² 3r³ dr = 2π · 3 · 15/4 = 45π/2。",
  ),
  "greens-theorem-in-polar-coordinates#a-sector-with-a-curl-that-depends-on-r": graphed(
    wide(-1, 5, -1, 3),
    [
      sector(() => 2, 0, pi / 2),
      joined([[0, 0], [2, 0], ...swing((t) => [2 * cos(t), 2 * sin(t)] as Point, 0, pi / 2, 30), [0, 0]], "result"),
      tag([2.2, 2], "(π/2) ∫₀² 3r² dr = 4π", "e"),
      tag([0.7, 0.5], "3r", "n"),
    ],
    "For example, a curl of 3r over the quarter disk of radius 2. The element r dr dθ makes the integrand 3r², and the angular width π/2 is a simple factor: (π/2) · 8 = 4π.",
    "例如，旋度 3r，在半径 2 的四分之一圆盘上。面积元 r dr dθ 使被积函数为 3r²，角宽 π/2 是简单的因子：(π/2) · 8 = 4π。",
  ),
  "calculating-areas-using-greens-theorem#the-area-of-a-triangle-from-a-boundary-integral": graphed(
    wide(-1, 7, -1, 5),
    [
      ...loop([
        [0, 0],
        [4, 0],
        [0, 3],
      ]),
      tag([2.6, 0.05], "0", "n"),
      tag([0.05, 1.5], "0", "e"),
      tag([2, 1.5], "12", "ne"),
      tag([5, 3.5], "A = 12/2 = 6", "n"),
    ],
    "For example, the triangle with vertices (0, 0), (4, 0), (0, 3). Along the two sides through the origin, x dy − y dx = 0. Along the third side it integrates to 12, so A = 12/2 = 6.",
    "例如，顶点为 (0, 0)、(4, 0)、(0, 3) 的三角形。沿过原点的两边，x dy − y dx = 0。沿第三边积分为 12，所以 A = 12/2 = 6。",
  ),
  "calculating-areas-using-greens-theorem#an-area-from-greens-theorem-and-a-drawing": graphed(
    wide(-1, 7, -1, 4),
    [
      shape([
        [0, 0],
        [4, 0],
        [3, 2],
        [1, 2],
      ]),
      ...loop([
        [0, 0],
        [4, 0],
        [3, 2],
        [1, 2],
      ]),
      tag([2, 0.7], "A = 6", "n"),
      tag([5, 2.5], "∮ x dy = 6", "n"),
    ],
    "For example, a counterclockwise trapezoid with vertices (0, 0), (4, 0), (3, 2), (1, 2) has area (4 + 2)/2 · 2 = 6, so ∮ x dy = 6. A clockwise boundary would give −6.",
    "例如，逆时针的梯形，顶点为 (0, 0)、(4, 0)、(3, 2)、(1, 2)，面积为 (4 + 2)/2 · 2 = 6，所以 ∮ x dy = 6。顺时针边界给出 −6。",
  ),
  "greens-theorem-in-flux-divergence-form#two-dimensional-divergence-theorem": graphed(
    wide(-3, 6, -3, 3),
    [
      hoop([0, 0], 2, "result"),
      ...rim((x, y) => [2 * x, y], 2, 8, 0.25),
      tag([3, 1.5], "∇·F = 3", "e"),
      tag([3, 0.5], "3 · 4π = 12π", "e"),
    ],
    "For example, F = ⟨2x, y⟩ out of the disk of radius 2. Its divergence is the constant 3, so the outward flux is 3 times the area 4π, that is 12π.",
    "例如，F = ⟨2x, y⟩，穿出半径 2 的圆盘。其散度为常数 3，所以外通量是 3 乘面积 4π，即 12π。",
  ),
  "greens-theorem-on-regions-with-holes#an-outer-circulation-from-an-inner-one": graphed(
    wide(-3, 7, -3, 4),
    [
      polarBand(
        () => 2,
        () => 1,
        0,
        2 * pi,
      ),
      hoop([0, 0], 2, "result"),
      hoop([0, 0], 1, "action"),
      ...spinOn(2, [0.5, 2.5, 4.5]),
      ...spinOn(1, [0.5, 2.5, 4.5], "action"),
      tag([3, 3], "C₁: 2π", "e"),
      tag([3, 2.1], "∇×F = 3,  A = 3π", "e"),
      tag([3, 1.2], "C₂: 2π + 9π = 11π", "e"),
    ],
    "For example, the circulation around the inner circle C₁ of radius 1 is 2π, and the curl is the constant 3 on the annulus up to the outer circle C₂ of radius 2, of area 3π. So the circulation around C₂ is 2π + 3 · 3π = 11π.",
    "例如，绕半径 1 的内圆 C₁ 的环量为 2π，在到半径 2 的外圆 C₂ 的圆环（面积 3π）上旋度恒为 3。所以绕 C₂ 的环量为 2π + 3 · 3π = 11π。",
  ),
};
