// Drawings of the explanations of Partial Differential Equations: heat, waves, reflections, Laplace and Poisson.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { dashedRing, disc, plane, polar, sector } from "./explanation-drawings-complex-kit.ts";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";

const O: Point = [0, 0];

const bump =
  (a: number, h = 1, w = 0.6) =>
  (x: number) =>
    h * Math.exp(-((x - a) * (x - a)) / (w * w));

// A grid of cells with alternating signs, the shaded ones positive, and dashed nodal lines between them.
const cells = (cols: number, rows: number, k: number): Mark[] => {
  const w = cols * k;
  const h = rows * k;
  const out: Mark[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const plus = (c + r) % 2 === 0;
      if (plus) {
        out.push({
          kind: "shade",
          points: [
            [c * k, r * k],
            [(c + 1) * k, r * k],
            [(c + 1) * k, (r + 1) * k],
            [c * k, (r + 1) * k],
          ],
          tone: "result",
        });
      }
      out.push(note([(c + 0.5) * k, (r + 0.5) * k - 0.15], plus ? "+" : "−", "n"));
    }
  }
  for (let c = 1; c < cols; c++) out.push(seg([c * k, 0], [c * k, h], undefined, true));
  for (let r = 1; r < rows; r++) out.push(seg([0, r * k], [w, r * k], undefined, true));
  out.push({
    kind: "polygon",
    points: [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ],
  });
  return out;
};

/** pdeDrawings1 draws the explanations of Partial Differential Equations, by knowledge point. */
export const pdeDrawings1: Readonly<Record<string, Figure>> = {
  "nonhomogeneous-heat-problems#a-steady-state-with-a-source": drawing(
    pane(0, [0, 2, 1], [0, 2, 1], 6, 4, "x", "u")
      .f((x) => x * (2 - x), 0, 2, "result")
      .dot(1, 1, "(1, 1)", "n", "result")
      .dot(0, 0)
      .dot(2, 0)
      .say(1, 1.6, "u = 2x(2 − x)/2", "n")
      .marks(),
    "For example, q = 2, c = 1 and L = 2. With both ends at zero, the steady temperature is the parabola qx(L − x)/(2c) = 2x(2 − x)/2, not a line. The rod is hottest in the middle, where the temperature is 1.",
    "例如，q = 2，c = 1，L = 2。两端为零时，稳态温度是抛物线 qx(L − x)/(2c) = 2x(2 − x)/2，而不是直线。杆在中点最热，温度为 1。",
  ),
  "dalemberts-formula#dalembert-from-a-drawn-initial-shape": (() => {
    const tent = (a: number, h: number): Point[] => [
      [a - 1, 0],
      [a, h],
      [a + 1, 0],
    ];
    return drawing(
      [
        ...pane(0, [-4, 4, 2], [0, 3, 1], 6.4, 3.4, "x", "u").path(tent(0, 2), "action").say(2.6, 2.2, "t = 0", "n").marks(),
        ...pane(8, [-4, 4, 2], [0, 3, 1], 6.4, 3.4, "x", "u")
          .path(tent(-2, 1), "result")
          .path(tent(2, 1), "result")
          .dot(2, 1, "(2, 1)", "n", "result")
          .say(2.6, 2.2, "t = 2", "n")
          .say(0, -0.9, "u(2, 2) = (f(0) + f(4))/2 = (2 + 0)/2 = 1", "s")
          .marks(),
      ],
      "For example, an initial tent of height 2 on [−1, 1], with c = 1 and zero initial velocity. At t = 2 it has split into two halves of height 1 centered at −2 and 2. To evaluate u(2, 2), read f at 2 − 2 = 0 and 2 + 2 = 4 and average: (2 + 0)/2 = 1.",
      "例如，[−1, 1] 上高为 2 的初始帐篷形，c = 1，初速度为零。t = 2 时它分成两半，高为 1，中心在 −2 和 2。要求 u(2, 2)，读出 f 在 2 − 2 = 0 和 2 + 2 = 4 处的值再平均：(2 + 0)/2 = 1。",
    );
  })(),
  "laplaces-equation#the-mean-value-property": drawing(
    [
      ...plane(O, 4, 3, "x", "y"),
      ring(1.2, [2, 1]),
      ...dotAt([3.2, 1], "3.2", "e", "result"),
      ...dotAt([2, 2.2], "2", "n", "result"),
      ...dotAt([0.8, 1], "0.8", "w", "result"),
      ...dotAt([2, -0.2], "2", "s", "result"),
      ...dotAt([2, 1], "2", "n"),
      note([0.5, -2.2], "(3.2 + 2 + 0.8 + 2)/4 = 2", "s"),
    ],
    "For example, the harmonic function u = x on a circle of radius 1.2 centered at (2, 1). The values at four evenly spaced points of the circle average to 2, and so does the whole circle. This equals the value at the center, with no integration needed.",
    "例如，调和函数 u = x，圆半径 1.2，圆心 (2, 1)。圆上四个等距点的值平均为 2，整个圆的平均值也是 2。这等于圆心处的值，无需积分。",
  ),
  "laplaces-equation-in-a-rectangle-and-a-disc#a-boundary-value-on-a-disc": drawing(
    [
      ...plane(O, 3.2, 3, "x", "y"),
      ring(2),
      ...dotAt([2, 0], "+", "ne", "result"),
      ...dotAt([-2, 0], "+", "nw", "result"),
      ...dotAt([0, 2], "−", "ne", "action"),
      ...dotAt([0, -2], "−", "se", "action"),
      note([0, -3.2], "R = 2,  n = 2", "s"),
      ...pane(5.2, [0, 2, 1], [0, 4, 1], 5, 4.4, "r", "u")
        .f((r) => 3 * (r / 2) * (r / 2), 0, 2, "result")
        .dot(2, 3, "3", "n", "result")
        .dot(1, 0.75, "3/4", "ne", "result")
        .marks(),
    ],
    "For example, boundary value 3cos 2θ on the circle R = 2, positive and negative around the circle as the signs show. The solution inside is 3(r/2)²cos 2θ. On the right it is graphed along θ = 0: it reaches 3 at the rim and 3/4 at r = 1, and stays bounded at the center.",
    "例如，圆 R = 2 上的边界值 3cos 2θ，沿圆的正负如符号所示。内部的解为 3(r/2)²cos 2θ。右图是沿 θ = 0 的图像：在边界达到 3，r = 1 处为 3/4，在中心保持有界。",
  ),
  "laplaces-equation-in-a-rectangle-and-a-disc#the-mean-value-property": drawing(
    [
      {
        kind: "polygon",
        points: [
          [-3, -2.4],
          [3, -2.4],
          [3, 2.4],
          [-3, 2.4],
        ],
      },
      disc(O, 1.6),
      ring(1.6),
      ...dotAt([1.6, 0], "6", "e", "result"),
      ...dotAt([0, 1.6], "4", "n", "action"),
      ...dotAt([-1.6, 0], "6", "w", "result"),
      ...dotAt([0, -1.6], "4", "s", "action"),
      ...dotAt(O, "5", "n"),
      note([0, -2.6], "(6 + 4 + 6 + 4)/4 = 5", "s"),
    ],
    "For example, u = 5 + x² − y² on the shaded closed disc of radius 1, which lies inside the domain drawn as a rectangle. At the four marked points of the circle u is 6, 4, 6 and 4, and these average to 5. That is the value at the center, found with no integration.",
    "例如，u = 5 + x² − y²，阴影闭圆盘半径为 1，位于画成矩形的定义域内。圆上四个标出的点处 u 为 6、4、6、4，平均为 5。这就是圆心处的值，无需积分。",
  ),
  "domains-of-dependence#the-domain-of-dependence-of-a-marked-point": drawing(
    pane(0, [0, 6, 1], [0, 3, 1], 7, 4, "x", "t")
      .under((x) => (x <= 3 ? x - 1 : 5 - x), 1, 5, "result")
      .path(
        [
          [1, 0],
          [3, 2],
          [5, 0],
        ],
        "result",
      )
      .dot(3, 2, "(3, 2)", "n", "result")
      .dot(1, 0, undefined, "n", "result")
      .dot(5, 0, undefined, "n", "result")
      .marks(),
    "For example, c = 1 and the point (x₀, t₀) = (3, 2). Its value depends only on the initial data on the base of the shaded triangle, from 3 − 2 = 1 to 3 + 2 = 5. Data outside this interval has not had time to arrive.",
    "例如，c = 1，点 (x₀, t₀) = (3, 2)。它的值只依赖阴影三角形底边上的初始数据，从 3 − 2 = 1 到 3 + 2 = 5。这个区间外的数据还来不及到达。",
  ),
  "reflection-at-a-boundary#fixed-and-free-ends": drawing(
    [
      ...pane(0, [-4, 4, 4], [-2, 2, 1], 6, 3.8, "x", "u")
        .f(bump(2), -4, 0.2, undefined)
        .f(bump(2), 0.2, 4, "result")
        .f((x) => -bump(-2)(x), -4, 0.2, "action", true)
        .say(2, 1.3, "u = 0", "n")
        .marks(),
      ...pane(8.6, [-4, 4, 4], [-2, 2, 1], 6, 3.8, "x", "u")
        .f(bump(2), 0.2, 4, "result")
        .f(bump(-2), -4, 0.2, "action", true)
        .say(2, 1.3, "uₓ = 0", "n")
        .marks(),
    ],
    "A pulse on the right heading for an end at x = 0, with its dashed image beyond the end. At a fixed end, u = 0, on the left, the image is upside down, so the reflected pulse comes back inverted. At a free end, uₓ = 0, on the right, the image is upright, so it comes back the same way up with the same height.",
    "右侧脉冲向 x = 0 的端点行进，端点外是虚线的像。左图固定端 u = 0，像是倒置的，所以反射脉冲倒着返回。右图自由端 uₓ = 0，像是正立的，所以它以相同高度正着返回。",
  ),
  "reflection-at-a-boundary#a-pulse-after-a-drawn-reflection": drawing(
    [
      ...pane(0, [0, 6, 2], [-2, 2, 1], 6, 3.8, "x", "u")
        .f(bump(4, 1, 0.5), 2, 6, "action")
        .wall(6)
        .say(4, 1.1, "t = 0", "n")
        .marks(),
      ...pane(9, [0, 6, 2], [-2, 2, 1], 6, 3.8, "x", "u")
        .f((x) => -bump(3, 1, 0.5)(x), 1, 5, "result")
        .wall(6)
        .say(3, 0.4, "t = 5", "n")
        .say(3, -2.6, "2 + 3 = 5", "s")
        .marks(),
    ],
    "For example, a pulse centered at x = 4 moving right at speed 1 toward a fixed end at x = 6. In time t = 5 it travels 5: 2 to reach the end and 3 back. So it is centered at x = 3, upside down.",
    "例如，中心在 x = 4 的脉冲以速度 1 向右行进，朝向 x = 6 的固定端。在 t = 5 时间内走了 5：2 到达端点，3 返回。所以它的中心在 x = 3，上下颠倒。",
  ),
  "the-heat-kernel#times-from-drawn-heat-kernels": (() => {
    const k = (t: number) => (x: number) => Math.exp(-(x * x) / (4 * t)) / Math.sqrt(4 * Math.PI * t);
    return drawing(
      pane(0, [-6, 6, 2], [0, 0.6, 0.3], 8, 4.2, "x", "u")
        .f(k(0.25), -6, 6, "result")
        .f(k(1), -6, 6)
        .f(k(4), -6, 6, "action")
        .say(0.5, 0.52, "t = 1/4", "e")
        .say(0.8, 0.26, "t = 1", "e")
        .say(4.4, 0.12, "t = 4", "n")
        .marks(),
      "For example, the heat kernel at t = 1/4, 1 and 4, all with total area 1. The peak height falls as time grows, from about 0.56 to 0.28 to 0.14, and the curve gets wider. So the tallest and narrowest curve is the earliest and the lowest and widest is the latest.",
      "例如，t = 1/4、1、4 时的热核，总面积都是 1。峰高随时间下降，约从 0.56 到 0.28 到 0.14，曲线变宽。所以最高最窄的曲线最早，最低最宽的最晚。",
    );
  })(),
  "the-maximum-principle-for-heat#bounding-a-temperature": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [6, 0],
          [6, 3.4],
          [0, 3.4],
        ],
        tone: "action",
      },
      seg([0, 3.4], [6, 3.4], undefined, true),
      seg([0, 0], [6, 0], "result"),
      seg([0, 0], [0, 3.4], "result"),
      seg([6, 0], [6, 3.4], "result"),
      note([3, 0], "t = 0", "s"),
      note([0, 1.7], "x = 0", "w"),
      note([6, 1.7], "x = L", "e"),
      note([3, 3.4], "t = T", "n"),
    ],
    "The space-time rectangle of a rod. The maximum and minimum are reached on the three highlighted sides: the bottom, at the initial time, or the two sides, at the ends of the rod. The top edge, dashed, and the interior do not need to be checked.",
    "杆的时空矩形。最大值和最小值在三条突出显示的边上取得：底边（初始时刻）或两条侧边（杆的两端）。虚线的顶边和内部无需检查。",
  ),
  "poissons-equation#a-value-at-the-center-of-a-disc": drawing(
    pane(0, [-2, 2, 1], [-4, 1, 1], 6, 4.6, "x", "u")
      .f((x) => x * x - 4, -2, 2, "result")
      .dot(0, -4, "(0, −4)", "e", "result")
      .dot(-2, 0)
      .dot(2, 0)
      .say(0.1, -2, "u = x² − 4", "e")
      .marks(),
    "For example, f = 4 and R = 2, drawn along a diameter. The solution u = (f/4)(x² + y² − R²) = x² + y² − 4 vanishes at the rim and has the value −4 at the center.",
    "例如，f = 4，R = 2，沿直径作图。解 u = (f/4)(x² + y² − R²) = x² + y² − 4 在边界为零，在中心的值为 −4。",
  ),
  "poissons-equation#a-radial-solution-of-poissons-equation": drawing(
    pane(0, [-2, 2, 1], [-3, 1, 1], 6, 4.2, "r", "−u")
      .f((r) => (r * r - 4) / 2, -2, 2, "result")
      .path(
        [
          [0.02, 0],
          [0.02, -2],
        ],
        "action",
      )
      .dot(0, -2, undefined, "n", "result")
      .dot(-2, 0)
      .dot(2, 0)
      .say(0.1, -1, "u(0) = 2", "e")
      .marks(),
    "For example, f = 2 and R = 2, so u = (f/4)(R² − r²) = (4 − r²)/2. The curve is the section of the loaded membrane, sagging by u below the rim: level with the rim at r = 2 and deepest at the center, with u(0) = 2.",
    "例如，f = 2，R = 2，所以 u = (f/4)(R² − r²) = (4 − r²)/2。曲线是受载膜的截面，在边界下方下垂 u：r = 2 处与边界齐平，中心最深，u(0) = 2。",
  ),
  "the-vibrating-membrane#a-frequency-of-a-rectangular-drum": drawing(
    [
      ...cells(3, 2, 1.2),
      note([1.8, 0], "a = 3", "s"),
      note([3.6, 1.2], "b = 2", "e"),
      note([1.8, -0.8], "(m, n) = (3, 2),  ω = cπ√(9/9 + 4/4) = cπ√2", "s"),
    ],
    "For example, a drum with sides a = 3 and b = 2 and the mode (3, 2). The dashed lines stay at rest and neighboring cells move in opposite directions, as the signs show. There are 3 cells along a and 2 along b, and each mode number is divided by its own side: ω = cπ√(9/9 + 4/4) = cπ√2.",
    "例如，边长 a = 3、b = 2 的鼓，模式 (3, 2)。虚线保持静止，相邻格子运动方向相反，如符号所示。沿 a 有 3 格，沿 b 有 2 格，每个模式数除以自己的边长：ω = cπ√(9/9 + 4/4) = cπ√2。",
  ),
  "eigenvalues-in-two-dimensions#an-eigenvalue-on-a-rectangle": drawing(
    [
      ...cells(1, 2, 2),
      note([1, 0], "a = 2", "s"),
      note([2, 2], "b = 4", "e"),
      note([1, -0.8], "(m, n) = (1, 2),  π²(1/4 + 4/16) = π²/2", "s"),
    ],
    "For example, a = 2, b = 4 and (m, n) = (1, 2). The function sin(πx/2) sin(2πy/4) changes sign across the dashed line. Its eigenvalue is the sum of the two one-dimensional eigenvalues: π²(1/4 + 4/16) = π²/2.",
    "例如，a = 2，b = 4，(m, n) = (1, 2)。函数 sin(πx/2) sin(2πy/4) 在虚线两侧变号。它的特征值是两个一维特征值之和：π²(1/4 + 4/16) = π²/2。",
  ),
  "greens-functions-on-an-interval#integrating-against-the-kernel": drawing(
    pane(0, [0, 4, 1], [0, 2.5, 1], 7, 4.4, "x", "u")
      .f((x) => (x * (4 - x)) / 2, 0, 4, "result")
      .path(
        [
          [0, 0],
          [1, 0.75],
          [4, 0],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 0],
          [2, 1],
          [4, 0],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 0],
          [3, 0.75],
          [4, 0],
        ],
        undefined,
        true,
      )
      .dot(2, 2, "2", "n", "result")
      .say(3.2, 1.6, "fx(L − x)/2", "e")
      .marks(),
    "For example, f = 1 and L = 4. The dashed tents are the kernel G for sources at 1, 2 and 3. Adding up such tents along the whole interval, each weighted by f, gives the parabola (f/2)x(L − x) = x(4 − x)/2, whose top is 2.",
    "例如，f = 1，L = 4。虚线帐篷形是源在 1、2、3 处的核 G。沿整个区间把这些帐篷形按 f 加权相加，得到抛物线 (f/2)x(L − x) = x(4 − x)/2，顶点高度为 2。",
  ),
  "the-method-of-images#odd-or-even-reflection": (() => {
    const a = (x: number) => x * Math.exp(-(x * x) / 3);
    const b = (x: number) => Math.exp(-(x * x) / 3);
    return drawing(
      [
        ...pane(0, [-4, 4, 4], [-2, 2, 1], 6, 3.8, "x", "u")
          .f(a, 0, 4, "result")
          .f(a, -4, 0, "action", true)
          .dot(0, 0, undefined, "n", "result")
          .say(2, -1.5, "u(0) = 0", "n")
          .marks(),
        ...pane(8.6, [-4, 4, 4], [-2, 2, 1], 6, 3.8, "x", "u")
          .f(b, 0, 4, "result")
          .f(b, -4, 0, "action", true)
          .dot(0, 1, undefined, "n", "result")
          .say(2.4, 1.2, "uₓ(0) = 0", "n")
          .marks(),
      ],
      "Extending a function from x > 0, dashed. At a fixed end, on the left, the image has the opposite sign, so the extension is odd and passes through zero. At an insulated end, on the right, the image has the same sign, so the extension is even and has zero slope.",
      "把函数从 x > 0 延拓（虚线）。左图固定端的像符号相反，所以延拓是奇的，过零点。右图绝热端的像符号相同，所以延拓是偶的，斜率为零。",
    );
  })(),
  "the-method-of-images#a-wave-reflected-from-a-fixed-end": drawing(
    [
      ...[
        { d: 0, t: 0 },
        { d: 7.6, t: 3 },
        { d: 15.2, t: 5 },
      ].flatMap(({ d, t }) => {
        const pulse = (x: number) => bump(3 - t, 1, 0.5)(x);
        const image = (x: number) => -bump(t - 3, 1, 0.5)(x);
        return pane(d, [-5, 5, 5], [-2, 2, 1], 5.4, 3.6, "x", "u")
          .f((x) => pulse(x), -5, 5, "action", true)
          .f((x) => image(x), -5, 5, "result", true)
          .f((x) => pulse(x) + image(x), 0, 5, "result")
          .say(3.2, -2.1, `t = ${t}`, "s")
          .marks();
      }),
    ],
    "For example, c = 1 and a pulse starting at x = 3 moving toward the fixed end at 0, with its odd image starting at −3, both dashed. The solid curve is the sum on x > 0, the real string. At t = 3 they cancel at the end. At t = 5 the original has passed the end, and the flipped image has emerged as the reflection at x = 2.",
    "例如，c = 1，脉冲从 x = 3 出发，向 0 处的固定端运动，其奇像从 −3 出发，两者都用虚线。实线是 x > 0 上（真实弦上）的和。t = 3 时它们在端点抵消。t = 5 时原脉冲已越过端点，翻转的像作为反射出现在 x = 2。",
  ),
  "waves-in-three-dimensions#when-a-signal-is-heard": drawing(
    [
      disc(O, 0.8),
      ring(0.8),
      ...dotAt(O, undefined, "n", "result"),
      ...dotAt([4, 0], "P", "e"),
      seg(O, [4, 0], undefined, true),
      ...dashedRing([4, 0], 3.2),
      ...dashedRing([4, 0], 4.8),
      note([0, -0.9], "a = 1", "s"),
      note([4, -5], "4 ≤ ct ≤ 6", "s"),
      note([2, 0.1], "d = 5", "n"),
    ],
    "For example, a brief signal in the shaded ball of radius a = 1, with a listener P at distance d = 5. The sphere of radius ct around the listener first touches the ball at ct = 4, the inner dashed circle, and leaves it at ct = 6, the outer one. The listener hears the signal only while 4 ≤ ct ≤ 6.",
    "例如，阴影球（半径 a = 1）中的短暂信号，听者 P 距离 d = 5。以听者为心、半径 ct 的球面在 ct = 4（内虚线圆）时第一次接触到球，在 ct = 6（外虚线圆）时离开。听者只在 4 ≤ ct ≤ 6 时听到信号。",
  ),
  "laplaces-equation-on-wedges-and-annuli#the-power-on-a-wedge": drawing(
    [
      ...sector(O, 2.2, 0, 90),
      note(polar(O, 2.2, 45), "β = π/2", "ne"),
      note([2.2, 0], "u = 0", "s"),
      note([0, 2.2], "u = 0", "w"),
      note([1, -1], "ν = 2", "s"),
      ...sector([7.4, 0], 2.2, 0, 270),
      note(polar([7.4, 0], 2.2, 135), "β = 3π/2", "nw"),
      note([9.6, 0], "u = 0", "s"),
      note([7.4, -2.2], "u = 0", "e"),
      note([5.4, -2], "ν = 2/3", "s"),
    ],
    "With n = 1, the power is ν = π/β. A wedge of angle β = π/2 allows r² sin 2θ, with ν = 2, and it vanishes on both edges. A wider wedge of angle β = 3π/2 allows the power ν = 2/3 instead. So the geometry of the corner fixes which power of r is allowed.",
    "n = 1 时，幂次 ν = π/β。角 β = π/2 的楔形允许 r² sin 2θ，ν = 2，它在两条边上为零。更宽的角 β = 3π/2 的楔形则允许幂次 ν = 2/3。所以角的几何决定了 r 的哪个幂次是允许的。",
  ),
  "the-maximum-principle-for-harmonic-functions#extremes-on-the-boundary": drawing(
    [
      disc(O, 2),
      ring(2),
      ...plane(O, 3.2, 3, "x", "y"),
      ...dotAt([2, 0], "4", "ne", "result"),
      ...dotAt([-2, 0], "4", "nw", "result"),
      ...dotAt([0, 2], "−4", "ne", "action"),
      ...dotAt([0, -2], "−4", "se", "action"),
      ...dotAt(O, "0", "ne"),
      note([0, -3.2], "u = r² cos 2θ", "s"),
    ],
    "For example, u = x² − y² = r² cos 2θ on the disc r ≤ 2. On the boundary it is 4 cos 2θ, so the maximum 4 is at (±2, 0) and the minimum −4 is at (0, ±2). Inside, at the center, it is only 0.",
    "例如，圆盘 r ≤ 2 上的 u = x² − y² = r² cos 2θ。在边界上它等于 4 cos 2θ，所以最大值 4 在 (±2, 0)，最小值 −4 在 (0, ±2)。在内部的圆心处只有 0。",
  ),
  "fundamental-solutions-of-laplaces-equation#the-formula-in-each-dimension": drawing(
    [
      ...pane(0, [0, 3, 1], [-0.5, 1, 0.5], 5.4, 4.2, "r", "u")
        .f((r) => -Math.log(r) / (2 * Math.PI), 0.003, 0.05, "result")
        .f((r) => -Math.log(r) / (2 * Math.PI), 0.05, 3, "result")
        .say(1.1, 0.5, "−ln r/(2π)", "e")
        .marks(),
      ...pane(7.2, [0, 3, 1], [-0.5, 1, 0.5], 5.4, 4.2, "r", "u")
        .f((r) => 1 / (4 * Math.PI * r), 0.085, 3, "result")
        .say(0.9, 0.5, "1/(4πr)", "e")
        .marks(),
    ],
    "The two fundamental solutions as functions of the distance r. In the plane, on the left, −ln r/(2π) blows up slowly at r = 0 and becomes negative for r > 1. In space, on the right, 1/(4πr) blows up faster at r = 0 and stays positive.",
    "两个基本解作为距离 r 的函数。左图平面中的 −ln r/(2π) 在 r = 0 处缓慢爆破，r > 1 时变为负值。右图空间中的 1/(4πr) 在 r = 0 处爆破更快，且保持为正。",
  ),
};
