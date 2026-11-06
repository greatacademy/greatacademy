// Drawings of the explanations of Differential Equations.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { head, joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, openPt, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, thick, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note } from "./explanation-drawings-kit.ts";
import { swing } from "./explanation-drawings-multivariable-kit.ts";

const { sqrt, cos, sin, exp, PI: pi, abs } = Math;

const from0 = (to: Point, tone?: "action" | "result"): PlaneMark => toward([0, 0], to, tone);

const corner = (o: Point, a: Point, b: Point, d = 0.2): PlaneMark => {
  const unit = (p: Point): Point => {
    const l = Math.hypot(p[0] - o[0], p[1] - o[1]);
    return [(d * (p[0] - o[0])) / l, (d * (p[1] - o[1])) / l];
  };
  const [u, v] = [unit(a), unit(b)];
  return joined([
    [o[0] + u[0], o[1] + u[1]],
    [o[0] + u[0] + v[0], o[1] + u[1] + v[1]],
    [o[0] + v[0], o[1] + v[1]],
  ]);
};

// The dashed ellipse with these semi-axes, centered at the origin.
const oval = (a: number, b: number): PlaneMark => ({
  kind: "path",
  points: swing((t) => [a * cos(t), b * sin(t)], 0, 2 * pi, 96),
  dashed: true,
});

// Two axes with their letters around a center of a drawing.
const axes = (c: Point, r: number): Mark[] => [
  ...head([c[0] - r, c[1]], [c[0] + r, c[1]]),
  ...head([c[0], c[1] - r], [c[0], c[1] + r]),
  note([c[0] + r, c[1]], "x", "e"),
  note([c[0], c[1] + r], "y", "n"),
];

// A trajectory of a phase portrait: the curve of f over [0, end], with an arrowhead at time t.
const orbit = (f: (t: number) => Point, end: number, t: number, s?: "action" | "result"): Mark[] => [
  ...chain(swing(f, 0, end, 48), s),
  ...head(f(t), f(t + 0.05), s),
];

/** differentialEquationsDrawings1 draws the explanations of Differential Equations, by knowledge point. */
export const differentialEquationsDrawings1: Readonly<Record<string, Figure>> = {
  "the-floor-and-ceiling-functions#reading-a-floor-graph": graphed(
    wide(-2, 4, -3, 4),
    [
      ...[-2, -1, 0, 1, 2, 3].flatMap((n): PlaneMark[] => [thick([n, n], [n + 1, n], "action"), bare([n, n]), openPt([n + 1, n])]),
      joined(
        [
          [2, 0],
          [2, 1.9],
        ],
        undefined,
        true,
      ),
      tag([2, 2], "⌊2⌋ = 2", "nw"),
    ],
    "For example, y = ⌊x⌋ is a staircase. Each step has a filled dot at its left end and an open dot at its right end. At x = 2 the filled dot is at height 2, and the open dot at height 1 is not on the graph, so ⌊2⌋ = 2.",
    "例如，y = ⌊x⌋ 的图像是阶梯。每一级的左端是实心点，右端是空心点。在 x = 2 处，实心点的高度为 2，高度 1 处的空心点不在图像上，所以 ⌊2⌋ = 2。",
  ),
  "clairaut-differential-equations#the-solution-lines-through-a-point": graphed(
    wide(-4, 5, -5, 4),
    [
      curveOf((x) => (-x * x) / 4, "result", -4, 4.4),
      ln([0, 1], [1, 2], "action"),
      ln([0, 4], [1, 2], "action"),
      ln([0, 1], [1, 0], undefined, true),
      pt([1, 2], "(1, 2)", "e"),
      pt([2, -1], "(2, −1)", "sw"),
      pt([0, -1], "(0, −1)", "e"),
      tag([2.6, 3.6], "c = 1", "se"),
      tag([0.5, 3], "c = −2", "e"),
      tag([-2, 3], "c = −1", "e"),
      tag([-2.8, -2.6], "y = −x²/4", "se"),
    ],
    "For example, three points and the parabola y = −x²/4. Above it, (1, 2) gives 2 = c + c², so c = 1 and c = −2: two lines, y = x + 1 and y = −2x + 4. On it, (2, −1) gives (c + 1)² = 0: the one dashed line y = −x + 1. Below it, (0, −1) gives −1 = c², which has no real c, so no line passes through it.",
    "例如，取三个点和抛物线 y = −x²/4。在其上方的 (1, 2) 给出 2 = c + c²，即 c = 1 和 c = −2：两条直线 y = x + 1 和 y = −2x + 4。在其上的 (2, −1) 给出 (c + 1)² = 0：只有一条虚线 y = −x + 1。在其下方的 (0, −1) 给出 −1 = c²，没有实数 c，所以没有直线经过它。",
  ),
  "phase-lines-of-first-order-odes#stable-equilibria-from-a-graph": graphed(
    wide(-2, 4, -2, 4, 1, 1, "x", "f"),
    [
      curveOf((x) => x * (x - 2), "result", -1, 3),
      toward([-1.8, 0], [-0.25, 0], "action"),
      toward([1.75, 0], [0.25, 0], "action"),
      toward([2.25, 0], [3.8, 0], "action"),
      bare([0, 0]),
      openPt([2, 0]),
      tag([-1.2, 1], "f > 0", "w"),
      tag([1, -1.05], "f < 0", "s"),
      tag([3.1, 1.5], "f > 0", "e"),
    ],
    "For example, f(x) = x(x − 2). At x = 0 the graph crosses from above the axis to below it, and the arrows on both sides point in: the filled dot is a stable equilibrium. At x = 2 it crosses from below to above, and the arrows point away: the open dot is unstable.",
    "例如，f(x) = x(x − 2)。在 x = 0 处，图像从轴上方穿到下方，两侧的箭头都指向它：实心点是稳定平衡点。在 x = 2 处，图像从轴下方穿到上方，箭头背离它：空心点是不稳定平衡点。",
  ),
  "classifying-equilibrium-solutions-of-first-order-odes#stability-from-the-graph-of-the-right-side": graphed(
    wide(-3, 3, -3, 3, 1, 1, "y", "f"),
    [
      curveOf((y) => 1 - y * y, "result", -2, 2),
      toward([-1.2, 0], [-2.8, 0], "action"),
      toward([-0.8, 0], [0.8, 0], "action"),
      toward([2.8, 0], [1.2, 0], "action"),
      openPt([-1, 0]),
      bare([1, 0]),
      tag([0.6, 1.4], "f = 1 − y²", "e"),
    ],
    "For example, f(y) = 1 − y². At y = 1 the graph goes from positive to negative and the solutions on both sides move toward it: the filled dot is stable. At y = −1 it goes from negative to positive and the solutions move away: the open dot is unstable.",
    "例如，f(y) = 1 − y²。在 y = 1 处，图像由正变负，两侧的解都向它移动：实心点是稳定的。在 y = −1 处，图像由负变正，解都远离它：空心点是不稳定的。",
  ),
  "orthogonal-trajectories#finding-orthogonal-trajectories-of-a-family-of-curves": graphed(
    wide(-4, 4, -3, 3),
    [
      curveOf((x) => x * x, "result", -1.73, 1.73),
      curveOf((x) => -x * x, "result", -1.73, 1.73),
      oval(sqrt(3), sqrt(1.5)),
      oval(sqrt(6), sqrt(3)),
      corner([1, 1], [2, 3], [3, 0], 0.32),
      bare([1, 1]),
      tag([1.5, 1.35], "(1, 1)", "e"),
      tag([1.6, 2.6], "y = x²", "w"),
      tag([-3.9, 2.6], "x² + 2y² = 3, 6", "e"),
      tag([1.7, -2.6], "2 · (−1/2) = −1", "e"),
    ],
    "For example, k = 2. The solid curves are y = x² and y = −x², and the dashed ellipses are the trajectories x² + 2y² = 3 and x² + 2y² = 6. At (1, 1) the parabola has slope 2 and the ellipse slope −1/2. Their product is −1, so they cross at a right angle.",
    "例如，k = 2。实线是 y = x² 和 y = −x²，虚线椭圆是正交轨线 x² + 2y² = 3 和 x² + 2y² = 6。在 (1, 1) 处，抛物线的斜率为 2，椭圆的斜率为 −1/2。两者之积为 −1，所以它们垂直相交。",
  ),
  "orthogonal-trajectories#orthogonal-trajectories-of-exponential-curves": graphed(
    wide(-6, 2, -5, 5),
    [
      curveOf((x) => exp(x), "result", -4, 1.5),
      curveOf((x) => 2 * exp(x), "result", -4, 0.9),
      curveOf((x) => -exp(x), "result", -4, 1.5),
      ...[1, 4].map(
        (c): PlaneMark => ({
          kind: "path",
          points: swing((y) => [(c - y * y) / 2, y], -sqrt(c + 8), sqrt(c + 8), 60),
          dashed: true,
        }),
      ),
      corner([0, 1], [1, 2], [1, 0], 0.35),
      bare([0, 1]),
      tag([-5.9, 4.6], "y = Ceˣ,  C = 1, 2, −1", "e"),
      tag([-5.9, -4.6], "y² = −2x + C′,  C′ = 1, 4", "e"),
      tag([-5.9, 3.9], "(0, 1):  m = 1, −1", "e"),
    ],
    "For example, k = 1. The solid curves are y = Ceˣ, and the dashed trajectories are the parabolas y² = −2x + C′, here with C′ = 1 and 4. They open to the left, away from the direction in which the exponentials grow. At (0, 1) the curve y = eˣ has slope 1 and the parabola y² = −2x + 1 has slope −1, so they cross at a right angle.",
    "例如，k = 1。实线是 y = Ceˣ，虚线轨线是抛物线 y² = −2x + C′，这里取 C′ = 1 和 4。它们向左开口，与指数函数增长的方向相反。在 (0, 1) 处，曲线 y = eˣ 的斜率为 1，抛物线 y² = −2x + 1 的斜率为 −1，所以它们垂直相交。",
  ),
  "orthogonal-trajectories#the-orthogonal-trajectory-through-a-point": graphed(
    wide(-4, 4, -2, 2),
    [
      curveOf((x) => x * x * x, "result", -1.25, 1.25),
      curveOf((x) => -x * x * x, "result", -1.25, 1.25),
      oval(2, 2 / sqrt(3)),
      corner([1, 1], [2, 4], [4, 0], 0.25),
      bare([1, 1]),
      tag([1.2, 1.05], "(1, 1)", "e"),
      tag([1.25, 1.75], "y = x³", "e"),
      tag([-3.9, 1.7], "x² + 3y² = 4", "e"),
      tag([1.35, -1.6], "3 · (−1/3) = −1", "e"),
    ],
    "For example, n = 3 and the point (1, 1). The family y = cx³ has y′ = 3y/x, so the trajectories satisfy y′ = −x/(3y) and x² + 3y² = C. The point fixes C = 1 + 3 = 4: the dashed ellipse. At (1, 1) the slopes are 3 and −1/3, with product −1.",
    "例如，n = 3，点为 (1, 1)。曲线族 y = cx³ 满足 y′ = 3y/x，所以正交轨线满足 y′ = −x/(3y)，即 x² + 3y² = C。该点确定 C = 1 + 3 = 4：虚线椭圆。在 (1, 1) 处，两条曲线的斜率为 3 和 −1/3，乘积为 −1。",
  ),
  "falling-body-problems-with-quadratic-drag#acceleration-at-a-given-speed": drawing(
    pane(0, [0, 1.5, 0.5], [-1, 1, 0.5], 7, 6, "v/vₜ", "a/g")
      .f((v) => 1 - v * v, 0, 1.4, "result")
      .dot(0.5, 0.75, "a = 3g/4", "ne")
      .dot(1, 0, "a = 0", "ne")
      .dot(1.25, 1 - 1.25 * 1.25, "a < 0", "e", "action")
      .marks(),
    "The curve is the acceleration g(1 − v²/vₜ²) against the speed, as a share of the terminal speed vₜ. At half the terminal speed, 1 − 1/4 = 3/4, so the acceleration is 3g/4. It is 0 at the terminal speed and negative above it.",
    "曲线表示加速度 g(1 − v²/vₜ²) 随速度（以终端速度 vₜ 为单位）的变化。在终端速度的一半处，1 − 1/4 = 3/4，所以加速度为 3g/4。在终端速度处加速度为 0，超过终端速度后为负。",
  ),
  "introduction-to-second-order-linear-odes#zero-initial-data-force-the-zero-solution": drawing(
    [
      ...pane(0, [0, 6, 2], [-2, 3, 1], 6, 5, "t", "y")
        .f((t) => sin(t), 0, 6, "result")
        .dot(pi, 0, "y′(π) = −1", "ne")
        .say(3, -2.3, "y = sin t  ✓", "s")
        .marks(),
      ...pane(9, [0, 4, 1], [-2, 3, 1], 6, 5, "t", "y")
        .f((t) => (t - 2) * (t - 2), 0.4, 3.6, "result", true)
        .dot(2, 0, undefined, undefined, "action")
        .say(2, -2.3, "y(2) = y′(2) = 0  ✗", "s")
        .marks(),
    ],
    "For example, y″ + y = 0. On the left, the solution y = sin t crosses the axis at t = π with slope −1. On the right, the dashed curve touches the axis at t = 2 with zero slope. It cannot be a nonzero solution, because y(2) = 0 and y′(2) = 0 force the zero solution.",
    "例如，y″ + y = 0。左图中，解 y = sin t 在 t = π 处以斜率 −1 穿过轴。右图中，虚线曲线在 t = 2 处以零斜率与轴相切。它不可能是非零解，因为 y(2) = 0 和 y′(2) = 0 迫使解为零解。",
  ),
  "simple-harmonic-oscillators#an-oscillator-from-its-drawn-graph": drawing(
    pane(0, [0, 8, 2], [-3, 3, 1], 8, 6, "t", "y")
      .f((t) => 2 * cos((pi * t) / 2), 0, 8, "result")
      .level(2)
      .level(-2)
      .path(
        [
          [0, 2.6],
          [4, 2.6],
        ],
        "action",
      )
      .say(2, 2.65, "T = 4", "n")
      .say(6, 2.05, "R = 4/2 = 2", "n")
      .say(4, -2.05, "ω = π/2,  Rω = π", "s")
      .marks(),
    "For example, the top is at 2 and the bottom at −2, so R = 4/2 = 2. Neighboring tops are 4 apart, so T = 4 and ω = 2π/4 = π/2. The largest speed is Rω = 2 · π/2 = π.",
    "例如，最高点为 2，最低点为 −2，所以 R = 4/2 = 2。相邻最高点相距 4，所以 T = 4，ω = 2π/4 = π/2。最大速度为 Rω = 2 · π/2 = π。",
  ),
  "damped-oscillators#the-kind-of-damping-from-a-drawn-graph": (() => {
    const w = sqrt(15) / 4;
    return drawing(
      [
        ...pane(0, [0, 16, 8], [-1, 1, 1], 7, 5, "t", "y")
          .f((t) => exp(-t / 4) * (cos(w * t) + sin(w * t) / (4 * w)), 0, 16, "result")
          .say(8, -1.2, "c = 1/2", "s")
          .say(8, -2, "c² − 4mk < 0", "s")
          .marks(),
        ...pane(11, [0, 16, 8], [-1, 1, 1], 7, 5, "t", "y")
          .f((t) => (1 + t) * exp(-t), 0, 16, "result")
          .say(8, -1.2, "c = 2", "s")
          .say(8, -2, "c² − 4mk = 0", "s")
          .marks(),
        ...pane(22, [0, 16, 8], [-1, 1, 1], 7, 5, "t", "y")
          .f((t) => cos(t), 0, 16, "result")
          .say(8, -1.2, "c = 0", "s")
          .marks(),
      ],
      "For example, m = k = 1 with y(0) = 1 and y′(0) = 0. On the left, c = 1/2 makes the discriminant negative, and the waves shrink. In the middle, c = 2 makes it zero, and the curve decays without crossing zero. On the right, c = 0 means no damping, and the waves keep their size.",
      "例如，m = k = 1，y(0) = 1，y′(0) = 0。左图中，c = 1/2 使判别式为负，波动逐渐缩小。中图中，c = 2 使判别式为零，曲线衰减而不穿过零。右图中，c = 0 表示没有阻尼，波动大小不变。",
    );
  })(),
  "linear-independence-for-homogeneous-systems-of-odes#the-entry-that-makes-vector-solutions-dependent": graphed(
    wide(-1, 6, -1, 7),
    [
      from0([3, 6], "result"),
      from0([1, 2], "action"),
      joined(
        [
          [0, 0],
          [3, 1],
        ],
        "action",
        true,
      ),
      tag([1, 2], "x₁(0) = (1, 2)", "e"),
      tag([3, 6], "x₂(0) = (3, 6)", "e"),
      tag([3, 1], "(3, 1)", "e"),
      tag([3.6, 3], "det = k − 6 = 0", "e"),
    ],
    "For example, x₁(0) = (1, 2) and x₂(0) = (3, k). Then det = 1 · k − 3 · 2 = k − 6, which is 0 when k = 6, and the vectors are parallel. The dashed vector, with k = 1, has det = −5 and is not parallel to x₁(0).",
    "例如，x₁(0) = (1, 2)，x₂(0) = (3, k)。则 det = 1 · k − 3 · 2 = k − 6，当 k = 6 时为 0，两个向量平行。虚线向量对应 k = 1，det = −5，与 x₁(0) 不平行。",
  ),
  "solving-homogeneous-systems-of-odes-with-complex-eigenvalues#real-solutions-from-complex-eigenvalues": (() => {
    const p = (t: number): Point => [3 * exp(-0.1 * t) * cos(t), 3 * exp(-0.1 * t) * sin(t)];
    return graphed(
      wide(-4, 4, -3, 3),
      [
        { kind: "path", points: swing(p, 0, 24, 240), tone: "result" },
        ...[pi / 2, pi, (3 * pi) / 2].map((t) => toward(p(t), p(t + 0.2), "result")),
        pt([3, 0], "(3, 0)", "ne"),
        tag([-3.9, 2.6], "λ = −0.1 ± i", "e"),
      ],
      "For example, α = −0.1 and β = 1, so λ = −0.1 ± i. The trajectory from (3, 0) has radius 3e^(−0.1t), which the real part makes shrink, and it turns counterclockwise with angular speed 1, the imaginary part.",
      "例如，α = −0.1，β = 1，所以 λ = −0.1 ± i。从 (3, 0) 出发的轨线半径为 3e^(−0.1t)，实部使它缩小；它以角速度 1（即虚部）逆时针旋转。",
    );
  })(),
  "equilibrium-points-and-stability-for-systems-of-odes#the-type-of-equilibrium-from-the-trace-determinant-plane": graphed(
    wide(-4, 4, -3, 5, 1, 1, "T", "D"),
    [
      curveOf((t) => (t * t) / 4, "result", -4, 4),
      thick([0, 0], [0, 5], "action"),
      pt([1, -2], "A", "e"),
      pt([-3, 1], "B", "s"),
      pt([3, 1], "C", "s"),
      pt([-2, 3], "E", "w"),
      pt([2, 3], "F", "e"),
      pt([0, 3], "G", "e"),
      tag([-3.9, 4.6], "D = T²/4", "e"),
    ],
    "For example, six points around the parabola D = T²/4. A(1, −2) has D < 0: a saddle. B(−3, 1) and C(3, 1) lie below the parabola: a stable node and an unstable node. E(−2, 3) and F(2, 3) lie above it: a stable spiral and an unstable spiral. G(0, 3) lies on the marked half-line T = 0, D > 0: a center.",
    "例如，抛物线 D = T²/4 周围的六个点。A(1, −2) 满足 D < 0：鞍点。B(−3, 1) 和 C(3, 1) 在抛物线下方：稳定结点和不稳定结点。E(−2, 3) 和 F(2, 3) 在抛物线上方：稳定螺旋点和不稳定螺旋点。G(0, 3) 在标出的半直线 T = 0、D > 0 上：中心。",
  ),
  "phase-portraits-for-linear-systems-with-repeated-eigenvalues#telling-a-star-node-from-a-degenerate-node": drawing(
    [
      ...axes([0, 0], 3.2),
      ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((k) => {
        const [c, s] = [cos((k * pi) / 4 + pi / 8), sin((k * pi) / 4 + pi / 8)];
        return head([3 * c, 3 * s], [0.5 * c, 0.5 * s], "action");
      }),
      note([0, -3.7], "λ = −1,  A − λI = 0", "s"),
      ...axes([9, 0], 3.2),
      ...head([6, 0], [8.5, 0], "action"),
      ...head([12, 0], [9.5, 0], "action"),
      ...(
        [
          [-3, 3],
          [0, 3],
          [3, 3],
          [-3, 1],
          [3, -1],
          [3, -3],
          [0, -3],
          [-3, -3],
        ] as const
      ).flatMap(([a, b]) => orbit((t) => [9 + (a + b * t) * exp(-t), b * exp(-t)], 5, 0.5, "result")),
      note([9, -3.7], "λ = −1,  A − λI ≠ 0", "s"),
    ],
    "For example, λ = −1 on both sides. On the left A = −I, so every vector is an eigenvector and the trajectories are straight rays into the origin: a stable star node. On the right A has rows (−1, 1) and (0, −1), with the x-axis as its only eigenvector line, and the trajectories curve to become tangent to it: a stable degenerate node.",
    "例如，两侧都是 λ = −1。左图中 A = −I，每个向量都是特征向量，轨线是通向原点的直射线：稳定的星形结点。右图中 A 的两行为 (−1, 1) 和 (0, −1)，唯一的特征向量直线是 x 轴，轨线弯曲并与它相切：稳定的退化结点。",
  ),
  "phase-portraits-for-linear-systems-with-zero-eigenvalues#the-nonzero-eigenvalue-of-a-singular-system": graphed(
    wide(-5, 5, -4, 4),
    [
      ln([1, -1], [-1, 1], "result"),
      ...[-2, -1, 0, 1, 2].flatMap((a): PlaneMark[] => [
        toward([a + 1.6, -a + 0.8], [a + 0.1, -a + 0.05], "action"),
        toward([a - 1.6, -a - 0.8], [a - 0.1, -a - 0.05], "action"),
        bare([a, -a], "result"),
      ]),
      tag([-3, 3], "λ₁ = 0", "e"),
      tag([-4.9, -3.5], "λ₂ = tr A = −3", "e"),
      tag([0.4, -3.5], "v = (2, 1)", "e"),
    ],
    "For example, A has rows (−2, −2) and (−1, −1), so det A = 0 and the other eigenvalue is tr A = −3. The line y = −x consists of equilibria, with eigenvalue 0. The trajectories are parallel to the eigenvector (2, 1), and since tr A < 0 they move toward the line.",
    "例如，A 的两行为 (−2, −2) 和 (−1, −1)，所以 det A = 0，另一个特征值为 tr A = −3。直线 y = −x 由平衡点组成，对应特征值 0。轨线平行于特征向量 (2, 1)，又因 tr A < 0，它们向这条直线移动。",
  ),
  "phase-portraits-for-linear-systems-with-complex-eigenvalues#centers-and-spiral-points": drawing(
    [
      ...axes([0, 0], 3.4),
      ...[1, 2].flatMap((r): Mark[] => [
        ...chain(
          swing((t) => [r * cos(t), r * sin(t)], 0, 2 * pi, 64),
          "result",
        ),
        ...head([0.1, r], [-0.1, r], "result"),
      ]),
      note([0, -3.9], "ω = 2,  λ = ±2i", "s"),
      ...axes([9, 0], 3.4),
      ...[2, 3].flatMap((a): Mark[] => [
        ...chain(
          swing((t) => [9 + a * cos(t), (a / 2) * sin(t)], 0, 2 * pi, 64),
          "result",
        ),
        ...head([8.9, a / 2], [9.1, a / 2], "result"),
      ]),
      note([9, -3.9], "a = 4,  b = −1,  λ = ±2i", "s"),
    ],
    "For example, on the left ω = 2: A has rows (0, −2) and (2, 0), with eigenvalues ±2i, and the closed orbits are circles run counterclockwise. On the right a = 4 and b = −1, so ab < 0 and the eigenvalues are ±i√4 = ±2i. The closed orbits are the ellipses x² + 4y² = C, run clockwise. Both are centers with frequency 2.",
    "例如，左图中 ω = 2：A 的两行为 (0, −2) 和 (2, 0)，特征值为 ±2i，闭轨线是沿逆时针方向的圆。右图中 a = 4，b = −1，所以 ab < 0，特征值为 ±i√4 = ±2i。闭轨线是沿顺时针方向的椭圆 x² + 4y² = C。两者都是频率为 2 的中心。",
  ),
  "matrix-exponentials#the-matrix-exponential-of-a-rotation-generator": graphed(
    wide(-1, 4, -1, 3),
    [
      from0([2, 0], "action"),
      from0([1, sqrt(3)], "result"),
      { kind: "turn", center: [0, 0], from: [0.7, 0], degrees: 60 },
      tag([2, 0], "v = (2, 0)", "ne"),
      tag([1, sqrt(3)], "eᴬᵗv = (1, √3)", "e"),
      tag([0.75, 0.55], "ωt = π/3", "e"),
    ],
    "For example, ω = 2 and t = π/6, so ωt = π/3, with cos(π/3) = 1/2 and sin(π/3) = √3/2. The matrix eᴬᵗ has rows (1/2, −√3/2) and (√3/2, 1/2), and it sends (2, 0) to (1, √3), turned counterclockwise by π/3.",
    "例如，ω = 2，t = π/6，所以 ωt = π/3，且 cos(π/3) = 1/2，sin(π/3) = √3/2。矩阵 eᴬᵗ 的两行为 (1/2, −√3/2) 和 (√3/2, 1/2)，它把 (2, 0) 变为 (1, √3)，即逆时针旋转 π/3。",
  ),
  "the-unit-step-function#integrating-a-sum-of-steps": graphed(
    wide(-1, 6, -1, 4, 1, 1, "t", "f"),
    [
      shape([
        [1, 0],
        [3, 0],
        [3, 2],
        [1, 2],
      ]),
      shape([
        [3, 0],
        [4, 0],
        [4, 1],
        [3, 1],
      ]),
      thick([0, 0], [1, 0], "action"),
      thick([1, 2], [3, 2], "action"),
      thick([3, 1], [4, 1], "action"),
      joined(
        [
          [1, 0],
          [1, 2],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [3, 1],
          [3, 2],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [4, 0],
          [4, 1],
        ],
        undefined,
        true,
      ),
      tag([2.5, 2.1], "2 · 3 − 1 · 1 = 5", "n"),
      tag([4.05, 0.5], "T = 4", "e"),
      tag([0.2, 3.5], "f = 2u(t − 1) − u(t − 3)", "e"),
    ],
    "For example, f = 2u(t − 1) − u(t − 3) from 0 to T = 4. The first term gives a rectangle of width 4 − 1 = 3, scaled by 2, and the second subtracts one of width 4 − 3 = 1. The area is 2 · 3 − 1 · 1 = 5, the same as the shaded 2 · 2 + 1 · 1.",
    "例如，f = 2u(t − 1) − u(t − 3)，从 0 积分到 T = 4。第一项给出宽为 4 − 1 = 3 的矩形，再乘以 2；第二项减去宽为 4 − 3 = 1 的矩形。面积为 2 · 3 − 1 · 1 = 5，与阴影部分的 2 · 2 + 1 · 1 相同。",
  ),
  "the-unit-step-function#a-step-function-from-its-graph": graphed(
    wide(-1, 7, -1, 5, 1, 1, "t", "f"),
    [
      thick([0, 1], [2, 1], "action"),
      thick([2, 3], [5, 3], "action"),
      thick([5, 0], [7, 0], "action"),
      joined(
        [
          [2, 1],
          [2, 3],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [5, 0],
          [5, 3],
        ],
        undefined,
        true,
      ),
      tag([2, 2], "+2", "e"),
      tag([5, 1.5], "−3", "e"),
      tag([0.2, 4.4], "f = 1 + 2u(t − 2) − 3u(t − 5)", "e"),
    ],
    "For example, the graph starts at the level 1, jumps up by 2 at t = 2 and down by 3 at t = 5. Each jump gives one step term, so f = 1 + 2u(t − 2) − 3u(t − 5).",
    "例如，图像从高度 1 开始，在 t = 2 处上跳 2，在 t = 5 处下跳 3。每次跳跃对应一个阶跃项，所以 f = 1 + 2u(t − 2) − 3u(t − 5)。",
  ),
  "piecewise-continuity-and-piecewise-smoothness#recognizing-piecewise-continuous-functions": (() => {
    const floor = [0, 1, 2, 3].reduce(
      (p, n) =>
        p
          .path(
            [
              [n, n],
              [n + 1, n],
            ],
            "result",
          )
          .dot(n, n)
          .open(n + 1, n),
      pane(0, [0, 4, 1], [-3, 3, 3], 6, 6, "t", "y"),
    );
    return drawing(
      [
        ...floor.say(2, -3.3, "⌊t⌋  ✓", "s").marks(),
        ...pane(10, [0, 4, 1], [-3, 3, 3], 6, 6, "t", "y")
          .f((t) => 1 / (t - 2), 0, 1.7, "result")
          .f((t) => 1 / (t - 2), 2.25, 4, "result")
          .wall(2)
          .say(2, -3.3, "1/(t − 2)  ✗", "s")
          .marks(),
        ...pane(20, [0, 2, 1], [-3, 3, 3], 6, 6, "t", "y")
          .path(
            Array.from({ length: 250 }, (_, i): Point => {
              const s = 0.5 + i * 0.2;
              return [1 / s, sin(s)];
            }),
            "result",
          )
          .say(1, -3.3, "sin(1/t)  ✗", "s")
          .marks(),
      ],
      "The floor function on the left has finite jumps only, so it is piecewise continuous. In the middle, 1/(t − 2) has a vertical asymptote at t = 2, where the one-sided limits are infinite. On the right, sin(1/t) oscillates ever faster near 0 and has no limit there. Neither of those two qualifies.",
      "左图的取整函数只有有限跳跃，所以是分段连续的。中图的 1/(t − 2) 在 t = 2 处有竖直渐近线，单侧极限为无穷。右图的 sin(1/t) 在 0 附近振荡越来越快，在那里没有极限。后两者都不符合条件。",
    );
  })(),
  "second-order-inhomogeneous-boundary-value-problems#inhomogeneous-bvp-solution": graphed(
    wide(-1, 6, -1, 6),
    [
      curveOf((x) => x * (4 - x), "result", 0, 4),
      joined(
        [
          [2, 0],
          [2, 4],
        ],
        undefined,
        true,
      ),
      bare([2, 4]),
      tag([2, 4], "y(2) = qL²/8 = 4", "ne"),
      tag([4, 0], "L = 4", "ne"),
      tag([0.1, 5.4], "y = x(4 − x),  q = 2", "e"),
    ],
    "For example, q = 2 and L = 4, so y = (2/2)x(4 − x) = x(4 − x). The two boundary conditions hold at x = 0 and x = 4, and the maximum is at the midpoint x = 2, where qL²/8 = 2 · 16/8 = 4.",
    "例如，q = 2，L = 4，所以 y = (2/2)x(4 − x) = x(4 − x)。在 x = 0 和 x = 4 处满足两个边界条件，最大值在中点 x = 2 处，等于 qL²/8 = 2 · 16/8 = 4。",
  ),
  "second-order-inhomogeneous-boundary-value-problems#the-end-slope-of-a-loaded-boundary-value-problem": graphed(
    wide(-1, 6, -5, 2),
    [
      curveOf((x) => x * x - 4 * x, "result", 0, 4),
      joined(
        [
          [0, 0],
          [1, -4],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [4, 0],
          [3, -4],
        ],
        undefined,
        true,
      ),
      tag([2, -1.5], "y′(0) = −4,  y′(4) = 4", "n"),
      tag([4, 0], "L = 4", "ne"),
      tag([2, 0.9], "y″ = 2,  y = x² − 4x", "n"),
    ],
    "For example, c = 2 and L = 4. Then y = x² + Ax, and y(4) = 16 + 4A = 0 gives A = −4, so y = x² − 4x. The dashed tangents at the ends have slopes −4 and 4: equal and opposite, since the parabola is symmetric about x = 2.",
    "例如，c = 2，L = 4。则 y = x² + Ax，由 y(4) = 16 + 4A = 0 得 A = −4，所以 y = x² − 4x。两端的虚线切线斜率为 −4 和 4：大小相等、方向相反，因为抛物线关于 x = 2 对称。",
  ),
  "properties-of-fourier-series#which-fourier-terms-a-drawn-wave-needs": (() => {
    const wave = (dx: number, f: (x: number) => number, a: string): Mark[] => [
      ...head([dx - 3.7, 0], [dx + 3.7, 0]),
      ...head([dx, -2.2], [dx, 2.2]),
      note([dx + 3.7, 0], "x", "e"),
      note([dx, 2.2], "y", "n"),
      note([dx + 0.55 * pi, -0.05], "π", "s"),
      note([dx - 0.55 * pi, -0.05], "−π", "s"),
      ...chain(
        swing((x) => [dx + 0.55 * x, f(x)], -2 * pi, 2 * pi, 120),
        "result",
      ),
      note([dx, -2.5], a, "s"),
    ];
    return drawing(
      [
        ...wave(0, (x) => sin(x) + sin(2 * x) / 2, "aₙ = 0"),
        ...wave(10, (x) => cos(x) + cos(2 * x) / 2, "bₙ = 0"),
        ...wave(20, (x) => sin(x) + cos(2 * x), "aₙ ≠ 0,  bₙ ≠ 0"),
      ],
      "For example, on the left y = sin x + ½ sin 2x has rotation symmetry about the origin: it is odd and needs only sine terms, so every aₙ is 0. In the middle y = cos x + ½ cos 2x has mirror symmetry in the vertical axis: it is even and needs only cosine terms, so every bₙ is 0. On the right y = sin x + cos 2x has neither symmetry and needs both kinds of terms.",
      "例如，左图 y = sin x + ½ sin 2x 关于原点旋转对称：它是奇函数，只需要正弦项，所以每个 aₙ 都为 0。中图 y = cos x + ½ cos 2x 关于竖直轴镜像对称：它是偶函数，只需要余弦项，所以每个 bₙ 都为 0。右图 y = sin x + cos 2x 两种对称都没有，两类项都需要。",
    );
  })(),
  "fourier-cosine-series#the-cosine-series-of-a-linear-function": (() => {
    const k = 0.6;
    return drawing(
      [
        ...head([-6.2, 0], [6.2, 0]),
        ...head([0, -0.6], [0, 4]),
        note([6.2, 0], "x", "e"),
        note([0, 4], "y", "n"),
        ...[-3, -2, -1, 1, 2, 3].map((n) =>
          note([k * n * pi, -0.05], n === 1 ? "π" : n === -1 ? "−π" : `${n < 0 ? "−" : ""}${abs(n)}π`, "s"),
        ),
        note([-0.1, pi], "π", "w"),
        ...chain(
          [-3, -2, -1, 0, 1, 2, 3].map((n): Point => [k * n * pi, n % 2 === 0 ? 0 : pi]),
          "result",
        ),
        ...swing((x) => [k * x, pi / 2 - (4 / pi) * cos(x)], -3 * pi, 3 * pi, 200).flatMap((p, i, all): Mark[] => {
          const q = all[i + 1];
          return q && i % 5 < 3 ? chain([p, q], "action") : [];
        }),
        note([0, -1], "a₀ = π,  a₁ = −4/π,  a₂ = 0,  a₃ = −4/(9π)", "s"),
      ],
      "For example, c = 1. The even extension of f(x) = x is the triangle wave |x|, repeated with period 2π, with no jumps. Then a₀ = π, a₁ = −4/π, a₂ = 0 and a₃ = −4/(9π). The dashed curve π/2 − (4/π) cos x, the first terms of the series, already follows the wave closely.",
      "例如，c = 1。f(x) = x 的偶延拓是周期为 2π 的三角波 |x|，没有跳跃。于是 a₀ = π，a₁ = −4/π，a₂ = 0，a₃ = −4/(9π)。虚线曲线 π/2 − (4/π) cos x 是级数的前几项，已经与三角波非常接近。",
    );
  })(),
  "the-abm2-method#the-adams-moulton-corrector-step": graphed(
    wide(-1, 7, -1, 7, 1, 1, "t", "y"),
    [
      joined(
        [
          [1, 1],
          [2, 3],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [1, 1],
          [2, 6.5],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [1, 1],
          [2, 4.75],
        ],
        "result",
      ),
      bare([1, 1]),
      pt([2, 3.5], "y⁽ᵖ⁾ = 3.5", "e", "action"),
      pt([2, 4.75], "yₙ₊₁ = 4.75,  m = 3.75", "e", "result"),
      tag([2, 2.9], "fₙ = 2", "e"),
      tag([2, 6.5], "f(2, 3.5) = 5.5", "e"),
      tag([1, 1], "(1, 1)", "se"),
    ],
    "For example, y′ = t + y with h = 1, yₙ = 1 at t = 1, fₙ = 2 and fₙ₋₁ = 1. The predictor gives y⁽ᵖ⁾ = 1 + ½(3 · 2 − 1) = 3.5, where the slope is f(2, 3.5) = 5.5. The corrector uses the two dashed slopes with equal weights, the mean 3.75, so yₙ₊₁ = 1 + ½(5.5 + 2) = 4.75.",
    "例如，y′ = t + y，h = 1，t = 1 时 yₙ = 1，fₙ = 2，fₙ₋₁ = 1。预测步给出 y⁽ᵖ⁾ = 1 + ½(3 · 2 − 1) = 3.5，该点的斜率为 f(2, 3.5) = 5.5。校正步对两条虚线的斜率取相等权重，平均值为 3.75，所以 yₙ₊₁ = 1 + ½(5.5 + 2) = 4.75。",
  ),
  "the-trapezoidal-method#two-trapezoidal-steps-for-pure-decay": drawing(
    pane(0, [0, 2, 1], [0, 1, 0.5], 7, 6, "t", "y")
      .f((t) => exp(-t), 0, 2, undefined, true)
      .path(
        [
          [0, 1],
          [1, 1 / 3],
          [2, 1 / 9],
        ],
        "result",
      )
      .dot(0, 1, undefined, undefined, "result")
      .dot(1, 1 / 3, "1/3", "sw", "result")
      .dot(2, 1 / 9, "1/9", "e", "result")
      .say(0.9, 0.85, "(2 − hk)/(2 + hk) = 1/3", "e")
      .marks(),
    "For example, h = k = 1 and y₀ = 1. Each step multiplies by (2 − 1)/(2 + 1) = 1/3, so one step gives 1/3 and two steps give (1/3)² = 1/9. The dashed curve is the exact solution e^(−t).",
    "例如，h = k = 1，y₀ = 1。每一步乘以 (2 − 1)/(2 + 1) = 1/3，所以一步得 1/3，两步得 (1/3)² = 1/9。虚线曲线是精确解 e^(−t)。",
  ),
  "using-the-trapezoidal-method-with-newtons-method#one-newton-iteration-for-a-trapezoidal-step": graphed(
    wide(-2, 4, -2, 3, 1, 1, "y", "g"),
    [
      curveOf((y) => (y * y) / 2 + y - 0.5, "result", -2, 1.7),
      joined(
        [
          [0.25, -0.5],
          [1.75, 2.5],
        ],
        "action",
      ),
      bare([1, 1]),
      bare([0.5, 0]),
      tag([1.05, 0.95], "g(1) = 1", "e"),
      tag([1.75, 2.5], "g′(1) = 2", "e"),
      tag([1.3, -0.9], "y⁽¹⁾ = 1 − 1/2 = 1/2", "e"),
    ],
    "For example, yₙ = 1 and h = 1, so g(y) = y − 1 + ½(1 + y²). From y⁽⁰⁾ = 1, g(1) = 1 and g′(1) = 1 + 1 = 2. The tangent meets the axis at y⁽¹⁾ = 1 − 1/2 = 1/2, near the root √2 − 1 of g.",
    "例如，yₙ = 1，h = 1，所以 g(y) = y − 1 + ½(1 + y²)。从 y⁽⁰⁾ = 1 出发，g(1) = 1，g′(1) = 1 + 1 = 2。切线与轴交于 y⁽¹⁾ = 1 − 1/2 = 1/2，接近 g 的根 √2 − 1。",
  ),
  "using-the-trapezoidal-method-with-newtons-method#the-amplification-factor-of-the-trapezoidal-method": drawing(
    pane(0, [0, 40, 10], [-1, 1, 1], 8, 5, "hk", "R")
      .f((z) => (1 - z / 2) / (1 + z / 2), 0, 40, "result")
      .level(-1)
      .dot(2, 0, "hk = 2,  R = 0", "ne")
      .dot(38, (1 - 19) / (1 + 19), "R = −0.9", "n")
      .marks(),
    "For example, the factor R = (1 − hk/2)/(1 + hk/2) against hk. It starts at 1, is 0 at hk = 2 and stays above the dashed level −1. At hk = 38, R = (1 − 19)/(1 + 19) = −0.9: its size is below 1, but it is near −1, so such a component oscillates and hardly decays.",
    "例如，因子 R = (1 − hk/2)/(1 + hk/2) 随 hk 的变化。它从 1 开始，在 hk = 2 处为 0，并始终高于虚线 −1。在 hk = 38 处，R = (1 − 19)/(1 + 19) = −0.9：绝对值小于 1，但接近 −1，所以这样的分量会振荡且几乎不衰减。",
  ),
};
