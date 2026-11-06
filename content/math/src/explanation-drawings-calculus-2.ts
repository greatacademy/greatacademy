// Drawings in the explanations of Calculus I about derivatives, related rates, the mean value theorem, extrema and linearization. Each coordinate is computed from the function in the alt text.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { head, joined, lines, pane, tangent } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, dotAt, drawing, graphed, note, ring, seg, square } from "./explanation-drawings-kit.ts";

const { PI: pi, abs, cbrt, cos, cosh, exp, log, sin, sinh, sqrt, tan, tanh } = Math;
const sec = (x: number): number => 1 / cos(x);

/** calculusDrawings2 are the drawings in the explanations of derivatives and what they show about graphs in Calculus I, by topic and knowledge point. */
export const calculusDrawings2: Readonly<Record<string, Figure>> = {
  "continuity-and-differentiability-of-functions#differentiability-from-a-graph": drawing(
    [
      ...shift(pane(0, [-2, 2, 2], [-2, 2, 2], 5, 3.5).f(abs).dot(0, 0, undefined, "n", "result").say(0, -2.4, "", "s").marks(), 0, 6.5),
      ...shift(
        pane(8, [-2, 2, 2], [-2, 2, 2], 5, 3.5)
          .f((x) => cbrt(x * x))
          .dot(0, 0, undefined, "n", "result")
          .marks(),
        0,
        6.5,
      ),
      ...pane(0, [-2, 2, 2], [-2, 2, 2], 5, 3.5).f(cbrt).dot(0, 0, undefined, "n", "result").say(0, -2.4, "", "s").marks(),
      ...pane(8, [-2, 2, 2], [-2, 2, 2], 5, 3.5)
        .f((x) => x / 2 + 1, -2, -0.02)
        .f((x) => x / 2 - 1, 0, 2)
        .open(0, 1)
        .dot(0, -1, undefined, "e", "result")
        .marks(),
    ],
    "For example, y = |x|, y = x^(2/3), y = x^(1/3) and a graph with a jump, all not differentiable at x = 0: a corner, a cusp, a vertical tangent and a discontinuity.",
    "例如，y = |x|、y = x^(2/3)、y = x^(1/3) 和一个有跳跃的图象，在 x = 0 处都不可导：分别是角点、尖点、竖直切线和间断。",
  ),
  "calculating-the-slope-of-a-tangent-line-using-differentiation#the-extreme-slope-on-a-cubic": drawing(
    [
      ...pane(0, [-1, 3, 1], [-2, 6, 2], 6, 5)
        .f((x) => x ** 3 - 3 * x * x + 4)
        .path(
          [
            [0, 5],
            [2, -1],
          ],
          "action",
        )
        .dot(1, 2, "(1, 2)", "ne", "result")
        .say(1, -3, "y = x³ − 3x² + 4", "s")
        .marks(),
      ...pane(9, [-1, 3, 1], [-4, 8, 4], 6, 5, "x", "y′")
        .f((x) => 3 * x * x - 6 * x)
        .dot(1, -3, "(1, −3)", "s", "result")
        .say(1, -5.6, "y′ = 3x² − 6x", "s")
        .marks(),
    ],
    "For example, y = x³ − 3x² + 4 has the slope 3x² − 6x, a parabola with vertex (1, −3). So the least slope is −3, at the point (1, 2), where the tangent is steepest downward.",
    "例如，y = x³ − 3x² + 4 的斜率为 3x² − 6x，这是顶点为 (1, −3) 的抛物线。所以最小斜率是 −3，出现在点 (1, 2) 处，那里的切线向下最陡。",
  ),
  "calculating-the-equation-of-a-normal-line-using-differentiation#the-slope-of-a-normal-line": graphed(
    wide(-3, 6, -2, 5),
    [
      curveOf((x) => x * x, undefined, -2.2, 2.2),
      tangent([1, 1], 2, "action"),
      tangent([1, 1], -0.5, "result"),
      pt([1, 1], "(1, 1)", "se"),
      tag([2.4, 3.8], "m = 2", "e"),
      tag([3, 0], "m = −1/2", "ne"),
    ],
    "For example, on y = x² at (1, 1) the tangent has slope m = 2, so the perpendicular normal has slope −1/m = −1/2.",
    "例如，在 y = x² 上的点 (1, 1) 处，切线斜率 m = 2，所以与之垂直的法线斜率为 −1/m = −1/2。",
  ),
  "calculating-the-equation-of-a-normal-line-using-differentiation#where-a-normal-line-meets-the-curve-again": graphed(
    wide(-3, 3, -1, 5),
    [
      curveOf((x) => x * x, undefined, -2.2, 2.2),
      tangent([1, 1], -0.5, "result"),
      bare([1, 1]),
      tag([1.35, 1.25], "a = 1", "e"),
      pt([-1.5, 2.25], "b = −3/2", "sw", "action"),
    ],
    "For example, on y = x² the normal at a = 1 has slope −1/2. Setting c(a + b) = 1 + b equal to −1/2 gives b = −3/2, so it meets the parabola again at (−3/2, 9/4).",
    "例如，在 y = x² 上，a = 1 处的法线斜率为 −1/2。令 c(a + b) = 1 + b 等于 −1/2，得 b = −3/2，所以它在 (−3/2, 9/4) 处再次与抛物线相交。",
  ),
  "differentiating-logarithmic-functions#the-derivative-of-ln-x": graphed(
    wide(-1, 7, -3, 3),
    [
      curveOf(log, undefined, 0.05, 7),
      tangent([1, 0], 1, "action"),
      tangent([2, log(2)], 0.5, "action"),
      tangent([4, log(4)], 0.25, "action"),
      bare([1, 0], "result"),
      bare([2, log(2)], "result"),
      bare([4, log(4)], "result"),
      tag([3.4, 2.4], "m = 1", "w"),
      tag([5.5, 2.5], "m = 1/2", "w"),
      tag([5, 1.3], "m = 1/4", "s"),
    ],
    "For example, the slope of ln x is 1/x: the tangents at x = 1, 2 and 4 have slopes 1, 1/2 and 1/4, so the graph flattens as x grows.",
    "例如，ln x 的斜率是 1/x：x = 1、2、4 处的切线斜率分别为 1、1/2、1/4，所以图象随 x 增大而变平。",
  ),
  "differentiating-trigonometric-functions#slopes-of-trigonometric-curves": graphed(
    wide(-1, 7, -4, 4),
    [
      curveOf((x) => 3 * sin(x) - 2 * cos(x)),
      tangent([pi, 2], -3, "action"),
      pt([pi, 2], "(π, 2)", "ne", "result"),
      tag([2.25, 4], "m = −3", "w"),
    ],
    "y = 3 sin x − 2 cos x passes through (π, 2), and its tangent there has slope 3 cos π + 2 sin π = −3.",
    "y = 3 sin x − 2 cos x 经过 (π, 2)，该处切线的斜率为 3 cos π + 2 sin π = −3。",
  ),
  "differentiating-reciprocal-hyperbolic-functions#the-slope-of-a-hyperbolic-combination-at-zero": drawing(
    [
      ...pane(0, [-2, 2, 2], [-2, 2, 2], 6, 5)
        .f(sinh)
        .f(tanh, undefined, undefined, "result")
        .path(
          [
            [-2, -2],
            [2, 2],
          ],
          "action",
          true,
        )
        .dot(0, 0)
        .say(0, -2.5, "sinh, tanh: m = 1", "s")
        .marks(),
      ...pane(9, [-2, 2, 2], [0, 3, 1], 6, 5)
        .f(cosh)
        .f((x) => 1 / cosh(x), undefined, undefined, "result")
        .level(1, "action")
        .dot(0, 1)
        .say(0, -0.5, "cosh, sech: m = 0", "s")
        .marks(),
    ],
    "At x = 0, sinh and tanh both pass through (0, 0) with slope 1, so both touch the line y = x. cosh and sech both pass through (0, 1) with slope 0, so both have the horizontal tangent y = 1.",
    "在 x = 0 处，sinh 和 tanh 都以斜率 1 经过 (0, 0)，都与直线 y = x 相切。cosh 和 sech 都以斜率 0 经过 (0, 1)，都有水平切线 y = 1。",
  ),
  "differentiating-reciprocal-trigonometric-functions#a-sum-of-squares-of-secant-and-tangent": drawing(
    pane(0, [-1.5, 1.5, 1], [0, 6, 2], 8, 5)
      .f((x) => sec(x) ** 2)
      .f((x) => tan(x) ** 2, undefined, undefined, "action")
      .path(
        [
          [1, 1 + tan(1) ** 2],
          [1, tan(1) ** 2],
        ],
        "result",
      )
      .say(1, tan(1) ** 2 + 0.5, "1", "e")
      .say(0.4, 2.3, "sec² x", "n")
      .say(-1.1, 0.6, "tan² x", "w")
      .marks(),
    "The graph of sec² x is the graph of tan² x moved up by 1, since sec² x = 1 + tan² x. The gap is the same everywhere, so the two have the same slope at each x.",
    "sec² x 的图象是 tan² x 的图象向上平移 1，因为 sec² x = 1 + tan² x。两者的距离处处相同，所以在每个 x 处斜率相同。",
  ),
  "calculating-derivatives-from-graphs#derivatives-from-a-piecewise-linear-graph": graphed(
    wide(-1, 7, -1, 6),
    [
      joined([
        [0, 1],
        [2, 5],
        [6, 3],
      ]),
      pt([0, 1], "(0, 1)", "e"),
      pt([2, 5], "(2, 5)", "n"),
      pt([6, 3], "(6, 3)", "se"),
      tag([1, 3], "m = 2", "se"),
      tag([4.3, 4.1], "m = −1/2", "ne"),
    ],
    "For example, the segment from (0, 1) to (2, 5) has slope 4/2 = 2, so f′(1) = 2. The segment from (2, 5) to (6, 3) has slope −2/4 = −1/2, so f′(4) = −1/2.",
    "例如，从 (0, 1) 到 (2, 5) 的线段斜率为 4/2 = 2，所以 f′(1) = 2。从 (2, 5) 到 (6, 3) 的线段斜率为 −2/4 = −1/2，所以 f′(4) = −1/2。",
  ),
  "calculating-derivatives-from-graphs#derivatives-of-products-from-a-graph": graphed(
    wide(-1, 5, -1, 6),
    [
      joined([
        [1, 2],
        [3, 4],
      ]),
      joined(
        [
          [2, 0],
          [2, 3],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [0, 3],
          [2, 3],
        ],
        undefined,
        true,
      ),
      pt([2, 3], "f(2) = 3", "nw", "result"),
      tag([2.6, 3.2], "f′(2) = 1", "e"),
    ],
    "For example, the graph gives f(2) = 3 and f′(2) = 1. For h(x) = x²f(x) this gives h′(2) = 2(2)(3) + 2²(1) = 16.",
    "例如，由图象得 f(2) = 3，f′(2) = 1。对 h(x) = x²f(x)，得 h′(2) = 2(2)(3) + 2²(1) = 16。",
  ),
  "calculating-derivatives-from-graphs-using-the-chain-rule#inner-linear-functions-from-a-graph": graphed(
    wide(-1, 7, -1, 5),
    [
      joined([
        [0, 0],
        [2, 4],
        [6, 2],
      ]),
      joined(
        [
          [3, 0],
          [3, 3.5],
        ],
        "action",
        true,
      ),
      pt([3, 3.5], "x = 3", "ne", "result"),
      tag([5, 2.5], "m = −1/2", "ne"),
    ],
    "For example, h(x) = f(2x + 1) at a = 1: the input is 2(1) + 1 = 3, where the graph of f has slope −1/2, so h′(1) = 2(−1/2) = −1.",
    "例如，h(x) = f(2x + 1)，a = 1：输入为 2(1) + 1 = 3，f 的图象在此处斜率为 −1/2，所以 h′(1) = 2(−1/2) = −1。",
  ),
  "calculating-derivatives-from-graphs-using-the-chain-rule#outer-functions-of-a-graphed-function": graphed(
    wide(-1, 5, -1, 6),
    [
      joined([
        [1, 2],
        [3, 4],
      ]),
      joined(
        [
          [2, 0],
          [2, 3],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [0, 3],
          [2, 3],
        ],
        undefined,
        true,
      ),
      pt([2, 3], "f(2) = 3", "nw", "result"),
      tag([2.6, 3.2], "f′(2) = 1", "e"),
    ],
    "For example, the graph gives f(2) = 3 and f′(2) = 1. So [f(x)]² has derivative 2(3)(1) = 6 at x = 2, and e^f(x) has derivative 1 · e³ = e³ there.",
    "例如，由图象得 f(2) = 3，f′(2) = 1。所以 [f(x)]² 在 x = 2 处的导数为 2(3)(1) = 6，e^f(x) 在该处的导数为 1 · e³ = e³。",
  ),
  "differentiating-inverse-functions#the-derivative-of-an-inverse-function": graphed(
    wide(-3, 5, -3, 5),
    [
      curveOf((x) => exp(2 * x), undefined, -3, 0.8),
      curveOf((x) => 0.5 * log(x), "action", 0.01, 5),
      ln([0, 0], [1, 1], undefined, true),
      tangent([0, 1], 2, "result", true),
      tangent([1, 0], 0.5, "result", true),
      bare([0, 1], "result"),
      tag([-0.3, 1.6], "(0, 1), m = 2", "w"),
      pt([1, 0], "(1, 0), m = 1/2", "se", "result"),
      tag([0.75, 4.5], "e²ˣ", "e"),
      tag([4, 0.5 * log(4)], "(1/2) ln x", "s"),
    ],
    "e²ˣ and (1/2) ln x are reflections of each other in the line y = x. The slope 2 of e²ˣ at (0, 1) becomes the slope 1/(2 · 1) = 1/2 of (1/2) ln x at the reflected point (1, 0).",
    "e²ˣ 和 (1/2) ln x 关于直线 y = x 对称。e²ˣ 在 (0, 1) 处的斜率 2，在对称点 (1, 0) 处变为 (1/2) ln x 的斜率 1/(2 · 1) = 1/2。",
  ),
  "differentiating-inverse-functions#slopes-of-inverse-functions-are-reciprocals": graphed(
    wide(-1, 7, -1, 7),
    [
      curveOf((x) => x * x, undefined, 0, 2.6),
      curveOf(sqrt, "action", 0, 7),
      ln([0, 0], [1, 1], undefined, true),
      pt([2, 4], "(2, 4), m = 4", "e", "result"),
      pt([4, 2], "(4, 2), m = 1/4", "se", "result"),
    ],
    "For example, f(x) = x² on x ≥ 0 and f⁻¹(x) = √x are reflections in y = x. Since f(2) = 4 and f′(2) = 4, the inverse has slope 1/4 at the reflected point (4, 2).",
    "例如，x ≥ 0 上的 f(x) = x² 与 f⁻¹(x) = √x 关于 y = x 对称。由 f(2) = 4、f′(2) = 4，反函数在对称点 (4, 2) 处的斜率为 1/4。",
  ),
  "differentiating-an-inverse-function-at-a-point#the-second-derivative-of-an-inverse-function": graphed(
    wide(-3, 6, -3, 6),
    [
      curveOf(exp, undefined, -3, 1.75),
      curveOf(log, "action", 0.01, 6),
      ln([0, 0], [1, 1], undefined, true),
      tag([1.7, 5], "eˣ: ∪", "e"),
      tag([4, -0.7], "ln x: ∩", "s"),
    ],
    "For example, the increasing function eˣ is concave up, and its reflection in y = x, ln x, is concave down: the sign in g″ = −f″/(f′)³ reverses the concavity.",
    "例如，增函数 eˣ 是下凸的，它关于 y = x 的对称图象 ln x 是上凸的：g″ = −f″/(f′)³ 中的负号使凹凸性反转。",
  ),
  "related-rates-with-implicit-functions#related-rates-on-circles": graphed(
    wide(-6, 10, -6, 6),
    [
      { kind: "circle", center: [0, 0], r: 5 },
      pt([3, 4], "(3, 4)", "ne", "result"),
      toward([3, 4], [5, 2.5], "action"),
      tag([5.2, 3], "dx/dt = 2", "e"),
      tag([5.2, 2], "dy/dt = −3/2", "e"),
    ],
    "At (3, 4) on x² + y² = 25 the point moves along the circle: with dx/dt = 2 it has dy/dt = −3/2, so it moves right and down, along the tangent.",
    "在 x² + y² = 25 上的 (3, 4) 处，点沿圆运动：当 dx/dt = 2 时 dy/dt = −3/2，所以它向右下方沿切线方向运动。",
  ),
  "calculating-related-rates-with-circles-and-spheres#finding-the-rate-of-change-of-a-radius": drawing(
    [
      ring(2.5),
      ...chain(
        Array.from({ length: 73 }, (_, i): Point => [2.5 * cos((i * pi) / 36), 0.6 * sin((i * pi) / 36)]),
        undefined,
        true,
      ),
      seg([0, 0], [2.5, 0], "action"),
      note([1.25, 0], "r = 5", "n"),
      ...head([1.77, 1.77], [2.6, 2.6], "result"),
      note([2.6, 2.6], "dr/dt = 1/π cm/s", "e"),
      note([0, -2.5], "100 cm³/s", "s"),
    ],
    "Air enters a sphere at 100 cm³/s. When r = 5 cm, 100 = 4π(25) dr/dt, so the radius grows at dr/dt = 1/π cm/s.",
    "空气以 100 cm³/s 的速度进入球体。当 r = 5 cm 时，100 = 4π(25) dr/dt，所以半径以 dr/dt = 1/π cm/s 增长。",
  ),
  "calculating-related-rates-using-the-pythagorean-theorem#distances-between-moving-objects": drawing(
    [
      seg([-0.8, 0], [4.8, 0]),
      seg([0, -0.2], [0, 5]),
      seg([3, 0], [0, 4], "result"),
      square([0, 0], [1, 0], [0, 1]),
      ...dotAt([3, 0]),
      ...dotAt([0, 4]),
      ...head([3, 0.0], [2, 0.0], "action"),
      ...head([0, 4], [0, 3], "action"),
      note([1.9, -0.1], "x = 3, dx/dt = −2", "s"),
      note([0.1, 2.2], "y = 4, dy/dt = −1", "w"),
      note([1.6, 2.1], "s = 5, ds/dt = −2", "ne"),
    ],
    "For example, x = 3, y = 4 and s = 5, with both objects moving towards the crossing at dx/dt = −2 and dy/dt = −1. Then 5 ds/dt = 3(−2) + 4(−1) = −10, so ds/dt = −2: the distance is shrinking.",
    "例如，x = 3、y = 4、s = 5，两个物体都向路口移动，dx/dt = −2，dy/dt = −1。于是 5 ds/dt = 3(−2) + 4(−1) = −10，所以 ds/dt = −2：距离在缩小。",
  ),
  "calculating-related-rates-using-the-pythagorean-theorem#a-boat-pulled-by-a-rope": drawing(
    [
      seg([-0.8, 0], [5.4, 0]),
      seg([0, 0], [0, 3]),
      seg([0, 3], [4, 0], "result"),
      square([0, 0], [1, 0], [0, 1]),
      ...dotAt([0, 3], "", "w"),
      ...dotAt([4, 0], "", "se"),
      ...head([4, 0], [2.9, 0], "action"),
      note([0, 1.5], "h = 3", "w"),
      note([1.4, -0.05], "x = 4", "s"),
      note([2, 1.5], "s = 5", "ne"),
      note([3.4, -0.05], "2.5 m/s", "s"),
      ...head([1.32, 2.17], [0.52, 2.77], "action"),
      note([0.9, 2.6], "2 m/s", "ne"),
    ],
    "For example, h = 3, x = 4 and s = 5, with the rope pulled in at 2 m/s. Then 4 dx/dt = 5(−2), so dx/dt = −2.5: the boat moves at 2.5 m/s, faster than the rope, because the rope is longer than the base.",
    "例如，h = 3、x = 4、s = 5，绳子以 2 m/s 被拉入。于是 4 dx/dt = 5(−2)，所以 dx/dt = −2.5：船以 2.5 m/s 移动，比绳子快，因为绳子比底边长。",
  ),
  "calculating-related-rates-using-similar-triangles#the-rising-depth-in-a-triangular-trough": drawing(
    [
      {
        kind: "polygon",
        points: [
          [-2, 2],
          [2, 2],
          [0, 0],
        ],
      },
      {
        kind: "shade",
        points: [
          [-1, 1],
          [1, 1],
          [0, 0],
        ],
        tone: "action",
      },
      seg([-1, 1], [1, 1], "action"),
      seg([2.4, 0], [2.4, 1]),
      note([2.4, 0.5], "d = 1", "w"),
      seg([2.9, 0], [2.9, 2], undefined, true),
      note([2.9, 1.4], "2", "e"),
      note([0, 1], "w = 2", "n"),
      note([0, 2], "4", "n"),
    ],
    "For example, the end of the trough is a triangle 4 wide and 2 deep. Similar triangles give w/d = 4/2, so w = 2d: at depth d = 1 the water surface has width w = 2.",
    "例如，水槽的端面是宽 4、深 2 的三角形。由相似三角形得 w/d = 4/2，所以 w = 2d：深度 d = 1 时水面宽 w = 2。",
  ),
  "calculating-related-rates-using-trigonometry#rates-of-change-of-angles": drawing(
    [
      seg([-0.5, 0], [5.5, 0]),
      seg([4.5, 0], [4.5, 2.5], undefined, true),
      seg([0, 0], [4.5, 2.5], "result"),
      square([4.5, 0], [0, 0], [4.5, 2.5]),
      angle([0, 0], [4.5, 0], [4.5, 2.5], "accent", "θ"),
      ...dotAt([0, 0], "", "s"),
      ...dotAt([4.5, 2.5]),
      ...head([4.5, 2.5], [3.3, 2.5], "action"),
      note([2.25, 0], "x", "s"),
      note([4.5, 1.25], "h", "e"),
    ],
    "A plane at constant height h flies towards an observer. x is its horizontal distance and θ its angle of elevation, with tan θ = h/x. As x shrinks, θ grows.",
    "飞机在恒定高度 h 向观察者飞行。x 是水平距离，θ 是仰角，tan θ = h/x。x 缩小时 θ 增大。",
  ),
  "calculating-related-rates-using-trigonometry#rates-of-change-of-lengths-from-angles": drawing(
    [
      seg([3, -0.5], [3, 4]),
      seg([0, 0], [3, 0]),
      seg([0, 0], [3, 3], "result"),
      square([3, 0], [0, 0], [3, 3]),
      angle([0, 0], [3, 0], [3, 3], "accent", "π/4"),
      ...dotAt([0, 0], "", "s"),
      ...dotAt([3, 3], "", "e", "action"),
      note([1.5, 0], "d", "s"),
      note([3, 1.5], "x = d tan θ = d", "e"),
    ],
    "A searchlight d from a wall throws a spot at x = d tan θ along the wall. At θ = π/4, x = d and the slanted beam has length √2 d, so sec²θ = 2.",
    "探照灯距墙 d，光斑在墙上的位置为 x = d tan θ。当 θ = π/4 时，x = d，斜光束长 √2 d，所以 sec²θ = 2。",
  ),
  "calculating-related-rates-using-trigonometry#the-area-of-a-triangle-with-a-growing-angle": drawing(
    pane(0, [0, 180, 90], [0, 4, 1], 8, 5, "θ°", "A")
      .f((x) => 3 * sin((x * pi) / 180))
      .dot(90, 3, "90°: A = 3", "n", "result")
      .say(30, 2.2, "↗", "nw")
      .say(150, 2.2, "↘", "ne")
      .marks(),
    "For example, sides a = 2 and b = 3 give A = (1/2)(2)(3) sin θ = 3 sin θ. The area grows until θ = 90°, where A = 3, and shrinks after it, though θ keeps growing.",
    "例如，边 a = 2、b = 3，得 A = (1/2)(2)(3) sin θ = 3 sin θ。面积增大到 θ = 90° 时的 A = 3，此后缩小，尽管 θ 仍在增大。",
  ),
  "calculating-related-rates-with-cones#a-conical-tank-with-a-leak": drawing(
    [
      {
        kind: "polygon",
        points: [
          [-2, 4],
          [2, 4],
          [0, 0],
        ],
      },
      {
        kind: "shade",
        points: [
          [-1.5, 3],
          [1.5, 3],
          [0, 0],
        ],
        tone: "action",
      },
      seg([-1.5, 3], [1.5, 3], "action"),
      seg([0, 0], [0, 3], undefined, true),
      seg([0, 3], [1.5, 3], "result"),
      note([0, 1.5], "h", "e"),
      note([0.75, 3], "r = h/2", "n"),
      ...head([-0.9, 5.2], [-0.9, 3.4], "result"),
      ...head([0, -0.1], [0, -1.2], "result"),
    ],
    "For example, a cone whose surface radius is r = h/2. The rate dV/dt found from h and dh/dt is the net rate: the inflow minus the leak. So the inflow is dV/dt plus the leak.",
    "例如，水面半径 r = h/2 的圆锥。由 h 和 dh/dt 求出的 dV/dt 是净速率：流入减去泄漏。所以流入量是 dV/dt 加上泄漏。",
  ),
  "the-mean-value-theorem#finding-mean-value-theorem-values": graphed(
    wide(-2, 4, -2, 5),
    [
      curveOf((x) => x * x, undefined, -1, 2.3),
      joined(
        [
          [0, 0],
          [2, 4],
        ],
        "result",
      ),
      tangent([1, 1], 2, "action", true),
      pt([1, 1], "c = 1", "se", "action"),
      bare([0, 0]),
      pt([2, 4], "(2, 4)", "e"),
    ],
    "For example, y = x² on [0, 2]: the secant has slope (4 − 0)/(2 − 0) = 2. Setting f′(c) = 2c equal to 2 gives c = 1, where the tangent is parallel to the secant.",
    "例如，y = x² 在 [0, 2] 上：割线斜率为 (4 − 0)/(2 − 0) = 2。令 f′(c) = 2c 等于 2，得 c = 1，该处切线与割线平行。",
  ),
  "the-mean-value-theorem#checking-the-hypotheses-of-the-mean-value-theorem": drawing(
    [
      ...pane(0, [0, 4, 2], [0, 4, 2], 5, 4)
        .f((x) => x / 2 + 0.5, 0, 1.97)
        .f((x) => x / 2 + 1.5, 2, 4)
        .open(2, 1.5)
        .dot(2, 2.5, undefined, "n", "result")
        .marks(),
      ...pane(8, [0, 4, 2], [0, 4, 2], 5, 4)
        .f((x) => 3 - abs(x - 2))
        .dot(2, 3, undefined, "n", "result")
        .marks(),
      ...pane(16, [0, 4, 2], [0, 4, 2], 5, 4)
        .f((x) => 1 + cbrt((x - 2) ** 2))
        .dot(2, 1, undefined, "n", "result")
        .marks(),
    ],
    "For example, on [0, 4] with a problem at x = 2: a jump breaks continuity on the closed interval, and a corner or a cusp breaks differentiability on the open interval. The theorem does not apply to any of these.",
    "例如，在 [0, 4] 上，问题都出在 x = 2：跳跃破坏闭区间上的连续性，角点或尖点破坏开区间上的可导性。定理对这些都不适用。",
  ),
  "the-mean-value-theorem#the-mean-value-slope-from-a-graph": graphed(
    wide(-1, 5, -1, 5),
    [
      curveOf((x) => 1 + x / 2 + sin((pi * x) / 2), undefined, 0, 4),
      joined(
        [
          [0, 1],
          [4, 3],
        ],
        "result",
      ),
      tangent([1, 2.5], 0.5, "action", true),
      tangent([3, 1.5], 0.5, "action", true),
      bare([1, 2.5], "action"),
      bare([3, 1.5], "action"),
      pt([0, 1], "(0, 1)", "nw"),
      pt([4, 3], "(4, 3)", "se"),
    ],
    "For example, this curve runs from (0, 1) to (4, 3), so the chord has slope 2/4 = 1/2. At x = 1 and x = 3 its tangents are parallel to the chord, so they have slope 1/2 too.",
    "例如，这条曲线从 (0, 1) 到 (4, 3)，所以弦的斜率为 2/4 = 1/2。在 x = 1 和 x = 3 处切线与弦平行，所以斜率也是 1/2。",
  ),
  "global-vs-local-extrema-and-critical-points#global-extrema-from-graphs": graphed(
    wide(-1, 7, -1, 7),
    [
      joined([
        [0, 1],
        [2, 4],
        [4, 2],
        [6, 6],
      ]),
      bare([0, 1]),
      bare([6, 6]),
      pt([0, 1], "min = 1", "e", "action"),
      pt([6, 6], "max = 6", "w", "result"),
    ],
    "For example, on [0, 6] the largest value is 6, at the endpoint x = 6, and the smallest is 1, at the endpoint x = 0. The peak of height 4 at x = 2 is not the global maximum.",
    "例如，在 [0, 6] 上最大值是 6，在端点 x = 6；最小值是 1，在端点 x = 0。x = 2 处高度为 4 的峰不是全局最大值。",
  ),
  "global-vs-local-extrema-and-critical-points#local-extrema-from-graphs": graphed(
    wide(-1, 7, -1, 6),
    [
      joined([
        [0, 2],
        [2, 5],
        [4, 1],
        [6, 4],
      ]),
      pt([2, 5], "", "n", "result"),
      pt([4, 1], "", "s", "action"),
    ],
    "For example, the graph rises to x = 2 and falls after it, a local maximum, and falls to x = 4 and rises after it, a local minimum. Both are corners, where f′ does not exist.",
    "例如，图象上升到 x = 2 后下降，是局部最大值；下降到 x = 4 后上升，是局部最小值。两者都是角点，f′ 不存在。",
  ),
  "the-extreme-value-theorem#whether-a-drawn-maximum-is-attained": drawing(
    [
      ...pane(0, [0, 4, 2], [0, 5, 1], 6, 5)
        .f((x) => 4 - (x - 2) ** 2, 0, 1.97)
        .f((x) => 4 - (x - 2) ** 2, 2.03, 4)
        .open(2, 4)
        .say(2, -1, "∄ max", "s")
        .marks(),
      ...pane(9, [0, 4, 2], [0, 5, 1], 6, 5)
        .f((x) => 4 - (x - 2) ** 2)
        .dot(2, 4, undefined, "n", "result")
        .say(2, -1, "max = 4", "s")
        .marks(),
    ],
    "For example, on the left the top of the graph is an open circle at height 4, so the function comes arbitrarily close to 4 but never reaches it and has no maximum. On the right the top is on the graph, so the maximum 4 is attained.",
    "例如，左图顶部是高度 4 处的空心圆，所以函数可以任意接近 4，但达不到，没有最大值。右图顶部在图象上，所以最大值 4 能取到。",
  ),
  "determining-intervals-on-which-a-function-is-increasing-or-decreasing#the-least-coefficient-that-makes-a-cubic-increasing": drawing(
    [
      ...pane(0, [-3, 1, 1], [-4, 4, 2], 6, 5)
        .f((x) => x ** 3 + 3 * x * x + 3 * x)
        .dot(-1, -1, undefined, "n", "result")
        .say(-1, -5.2, "f = x³ + 3x² + 3x", "s")
        .marks(),
      ...pane(9, [-3, 1, 1], [0, 8, 2], 6, 5, "x", "f′")
        .f((x) => 3 * (x + 1) ** 2)
        .dot(-1, 0, undefined, "n", "result")
        .say(-1, -1.6, "f′ = 3(x + 1)²", "s")
        .marks(),
    ],
    "For example, x³ + 3x² + kx has f′ = 3x² + 6x + k, with discriminant 36 − 12k. The least k making it not positive is k = 3. Then f′ = 3(x + 1)² only touches zero at x = −1, and f still increases through that point.",
    "例如，x³ + 3x² + kx 的 f′ = 3x² + 6x + k，判别式为 36 − 12k。使它不为正的最小 k 是 3。此时 f′ = 3(x + 1)² 只在 x = −1 处与零相切，f 仍然增大地经过该点。",
  ),
  "intervals-of-concavity#concavity-from-the-graph-of-the-derivative": drawing(
    [
      ...pane(0, [0, 6, 2], [0, 3, 1], 6, 5, "x", "f′")
        .path([
          [0, 0],
          [2, 2],
          [4, 2],
          [6, 0],
        ])
        .say(2, 0.6, "↗", "n")
        .say(3, 2, "→", "n")
        .say(4, 0.6, "↘", "n")
        .marks(),
      ...pane(9, [0, 6, 2], [0, 8, 2], 6, 5, "x", "f")
        .f((x) => (x * x) / 2, 0, 2)
        .f((x) => 2 + 2 * (x - 2), 2, 4, "action")
        .f((x) => 6 + 6 * (x - 4) - (x * x - 16) / 2, 4, 6)
        .say(1, 2, "∪", "n")
        .say(5, 7.5, "∩", "w")
        .marks(),
    ],
    "For example, f′ rises on [0, 2], so f is concave up there. f′ is constant on [2, 4], so f is a line there. f′ falls on [4, 6], so f is concave down there.",
    "例如，f′ 在 [0, 2] 上上升，所以 f 在此下凸。f′ 在 [2, 4] 上为常数，所以 f 在此是直线。f′ 在 [4, 6] 上下降，所以 f 在此上凸。",
  ),
  "points-of-inflection#finding-points-of-inflection": graphed(
    wide(-3, 5, -3, 4),
    [
      curveOf((x) => x ** 3 - 3 * x * x + 2, undefined, -1, 3.1),
      pt([1, 0], "(1, 0)", "ne", "result"),
      tag([-0.5, 3], "∩: x < 1", "w"),
      tag([3.1, 0.3], "∪: x > 1", "e"),
    ],
    "For example, y = x³ − 3x² + 2 has f″ = 6x − 6, which changes sign once, at x = −(−3)/(3 · 1) = 1. So the only inflection point is (1, 0): concave down before it and concave up after it.",
    "例如，y = x³ − 3x² + 2 的 f″ = 6x − 6 只变号一次，在 x = −(−3)/(3 · 1) = 1。所以唯一的拐点是 (1, 0)：之前上凸，之后下凸。",
  ),
  "the-second-derivative-test#classifying-with-the-second-derivative": graphed(
    wide(-4, 4, -4, 4),
    [
      curveOf((x) => x ** 3 - 3 * x, undefined, -2.4, 2.4),
      bare([-1, 2], "result"),
      tag([-1.2, 2.3], "f″(−1) = −6", "w"),
      bare([1, -2], "action"),
      tag([1, -2.4], "f″(1) = 6", "e"),
    ],
    "For example, y = x³ − 3x has f′ = 0 at x = ±1 and f″ = 6x. f″(−1) = −6 < 0 gives a local maximum at (−1, 2), and f″(1) = 6 > 0 gives a local minimum at (1, −2).",
    "例如，y = x³ − 3x 在 x = ±1 处 f′ = 0，f″ = 6x。f″(−1) = −6 < 0，得局部最大值点 (−1, 2)；f″(1) = 6 > 0，得局部最小值点 (1, −2)。",
  ),
  "sketching-the-derivative-of-a-function-from-the-functions-graph#derivatives-of-piecewise-linear-graphs": drawing(
    [
      ...pane(0, [0, 6, 2], [0, 4, 2], 6, 5, "x", "f")
        .path([
          [0, 0],
          [2, 4],
          [4, 4],
          [6, 0],
        ])
        .marks(),
      ...pane(9, [0, 6, 2], [-3, 3, 1], 6, 5, "x", "f′")
        .path(
          [
            [0, 2],
            [2, 2],
          ],
          "result",
        )
        .path(
          [
            [2, 0],
            [4, 0],
          ],
          "result",
        )
        .path(
          [
            [4, -2],
            [6, -2],
          ],
          "result",
        )
        .open(2, 2)
        .open(2, 0)
        .open(4, 0)
        .open(4, -2)
        .marks(),
    ],
    "For example, f has pieces of slope 2, 0 and −2, so the graph of f′ is the steps at heights 2, 0 and −2, with jumps and no derivative at the corners x = 2 and x = 4.",
    "例如，f 各段的斜率为 2、0、−2，所以 f′ 的图象是高度 2、0、−2 的阶梯，在角点 x = 2 和 x = 4 处跳跃，导数不存在。",
  ),
  "sketching-the-derivative-of-a-function-from-the-functions-graph#the-sign-of-the-derivative-from-a-graph": drawing(
    [
      ...pane(0, [-2, 2, 1], [-3, 3, 3], 6, 5, "x", "f")
        .f((x) => 3 * x - x ** 3)
        .dot(-1, -2, undefined, "n", "action")
        .dot(1, 2, undefined, "n", "result")
        .marks(),
      ...pane(9, [-2, 2, 1], [-3, 3, 3], 6, 5, "x", "f′")
        .f((x) => 3 - 3 * x * x)
        .dot(-1, 0, undefined, "n", "action")
        .dot(1, 0, undefined, "n", "result")
        .marks(),
    ],
    "For example, f = 3x − x³ has a valley at x = −1 and a peak at x = 1, so f′ = 3 − 3x² crosses the axis at both. f′ is positive between them, where f rises, and negative outside, where f falls.",
    "例如，f = 3x − x³ 在 x = −1 处有谷，在 x = 1 处有峰，所以 f′ = 3 − 3x² 在这两处都穿过坐标轴。f′ 在两者之间为正，f 上升；在外侧为负，f 下降。",
  ),
  "sketching-the-derivative-of-a-function-from-the-functions-graph#the-derivative-at-a-corner": graphed(
    wide(-1, 7, -1, 6),
    [
      joined([
        [0, 0],
        [2, 4],
        [5, 1],
      ]),
      pt([2, 4], "∄ f′(2)", "n", "result"),
      tag([1, 2], "m = 2", "se"),
      tag([3.5, 2.5], "m = −1", "ne"),
    ],
    "For example, the slopes on the two sides of x = 2 are 2 and −1. They differ, so f′(2) does not exist, although f is continuous there.",
    "例如，x = 2 两侧的斜率为 2 和 −1。它们不同，所以 f′(2) 不存在，尽管 f 在该处连续。",
  ),
  "interpreting-the-graph-of-a-functions-derivative#local-extrema-from-the-graph-of-the-derivative": drawing(
    pane(0, [-4, 5, 1], [-3, 3, 1], 10, 5, "x", "f′")
      .f((x) => -0.03 * (x + 3) * x * (x - 3) ** 2)
      .dot(-3, 0, "min", "n", "action")
      .dot(0, 0, "max", "ne", "result")
      .dot(3, 0, "∅", "n")
      .marks(),
    "For example, this graph of f′ crosses the axis from below to above at x = −3, so f has a local minimum there, and from above to below at x = 0, a local maximum. At x = 3 it only touches the axis, so f has no extremum there.",
    "例如，这个 f′ 的图象在 x = −3 处从下向上穿过坐标轴，所以 f 在此有局部最小值；在 x = 0 处从上向下穿过，是局部最大值。在 x = 3 处只是与坐标轴相切，所以 f 在此没有极值。",
  ),
  "interpreting-the-graph-of-a-functions-derivative#monotonicity-from-the-graph-of-the-derivative": drawing(
    pane(0, [-4, 4, 2], [-3, 4, 1], 8, 5, "x", "f′")
      .f((x) => 0.5 * (x + 2) * (x - 2))
      .say(-3.2, 0.3, "f ↗", "n")
      .say(-0.1, -0.3, "f ↘", "se")
      .say(3.2, 0.3, "f ↗", "n")
      .marks(),
    "For example, this graph of f′ is above the axis for x < −2 and x > 2, where f increases, and below it for −2 < x < 2, where f decreases, even though f′ itself rises on part of that stretch.",
    "例如，这个 f′ 的图象在 x < −2 和 x > 2 时在坐标轴上方，f 增加；在 −2 < x < 2 时在下方，f 减少，尽管 f′ 本身在这一段的一部分上升。",
  ),
  "interpreting-the-graph-of-a-functions-derivative#a-peak-of-the-derivative-is-not-a-peak-of-the-function": drawing(
    [
      ...pane(0, [-2, 4, 2], [-4, 4, 2], 6, 5, "x", "f′")
        .f((x) => 3 - (x - 1) ** 2)
        .dot(1, 3, "max", "n", "result")
        .marks(),
      ...pane(9, [-2, 4, 2], [-2, 8, 2], 6, 5, "x", "f")
        .f((x) => 3 * x - (x - 1) ** 3 / 3)
        .dot(1, 3, "", "e", "result")
        .dot(1 + sqrt(3), 3 * (1 + sqrt(3)) - sqrt(3), "max", "n", "action")
        .marks(),
    ],
    "For example, f′ = 3 − (x − 1)² peaks at x = 1, where f has a point of inflection and is rising fastest, not a peak. The peak of f is at x = 1 + √3, where f′ crosses the axis from above to below.",
    "例如，f′ = 3 − (x − 1)² 在 x = 1 处达到峰值，此处 f 有拐点，上升最快，并不是峰。f 的峰在 x = 1 + √3 处，那里 f′ 从上向下穿过坐标轴。",
  ),
  "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection#inflection-points-from-the-graph-of-the-derivative":
    drawing(
      pane(0, [-2.5, 2.5, 1], [-3, 3, 1], 8, 5, "x", "f′")
        .f((x) => x ** 3 - 3 * x)
        .dot(-1, 2, "", "n", "result")
        .dot(1, -2, "", "s", "result")
        .marks(),
      "For example, f′ = x³ − 3x has a peak at x = −1 and a valley at x = 1, so f has points of inflection at those two values, not at the zeros of f′, x = 0 and x = ±√3.",
      "例如，f′ = x³ − 3x 在 x = −1 处有峰，在 x = 1 处有谷，所以 f 的拐点在这两个值处，而不在 f′ 的零点 x = 0 和 x = ±√3 处。",
    ),
  "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection#concavity-from-a-smooth-graph-of-the-derivative":
    drawing(
      pane(0, [0, 7, 1], [-2, 2, 1], 9, 5, "x", "f′")
        .f(sin, 0, 2 * pi)
        .dot(pi / 2, 1, "π/2", "n", "result")
        .dot((3 * pi) / 2, -1, "3π/2", "s", "result")
        .say(4.8, 1.2, "↘ ∩", "n")
        .marks(),
      "For example, f′ = sin x rises on (0, π/2) and (3π/2, 2π), where f is concave up, and falls on (π/2, 3π/2), where f is concave down. Whether f′ is above or below the axis does not matter.",
      "例如，f′ = sin x 在 (0, π/2) 和 (3π/2, 2π) 上上升，f 下凸；在 (π/2, 3π/2) 上下降，f 上凸。f′ 在坐标轴上方还是下方无关紧要。",
    ),
  "sketching-a-function-from-the-graph-of-its-derivative#global-extrema-from-the-graph-of-the-derivative": drawing(
    [
      ...pane(0, [0, 6, 2], [-3, 3, 1], 6, 5, "x", "f′")
        .under(
          lines([
            [0, 2],
            [2, 0],
          ]),
          0,
          2,
        )
        .under(
          lines([
            [2, 0],
            [4, -2],
            [5, 0],
          ]),
          2,
          5,
          "action",
        )
        .under(
          lines([
            [5, 0],
            [6, 2],
          ]),
          5,
          6,
        )
        .path([
          [0, 2],
          [2, 0],
          [4, -2],
          [5, 0],
          [6, 2],
        ])
        .say(0.5, 0.3, "+2", "ne")
        .say(4, -2, "−3", "s")
        .say(5.7, 0.3, "+1", "w")
        .marks(),
      ...pane(9, [0, 6, 2], [-2, 3, 1], 6, 5, "x", "f")
        .f((x) => 2 * x - (x * x) / 2, 0, 2)
        .f((x) => 2 - (x - 2) ** 2 / 2, 2, 4)
        .f((x) => (x - 5) ** 2 - 1, 4, 5)
        .f((x) => (x - 5) ** 2 - 1, 5, 6)
        .dot(0, 0)
        .dot(2, 2, "max 2", "n", "result")
        .dot(5, -1, "min −1", "s", "action")
        .dot(6, 0)
        .marks(),
    ],
    "For example, with f(0) = 0 the signed areas under f′ give f(2) = 2, f(5) = 2 − 3 = −1 and f(6) = −1 + 1 = 0. Comparing the endpoints and the sign changes, the maximum is 2 at x = 2 and the minimum is −1 at x = 5.",
    "例如，f(0) = 0，由 f′ 下方的有向面积得 f(2) = 2，f(5) = 2 − 3 = −1，f(6) = −1 + 1 = 0。比较端点和变号点，最大值是 x = 2 处的 2，最小值是 x = 5 处的 −1。",
  ),
  "sketching-a-function-from-the-graph-of-its-derivative#values-from-a-sloped-segment-of-the-derivative": drawing(
    pane(0, [0, 4, 1], [0, 4, 1], 7, 5, "x", "f′")
      .under(
        lines([
          [1, 1],
          [3, 3],
        ]),
        1,
        3,
      )
      .path([
        [1, 1],
        [3, 3],
      ])
      .dot(1, 1, "1", "nw")
      .dot(3, 3, "3", "ne")
      .say(2, 0.8, "A = 4", "n")
      .marks(),
    "For example, f′ goes from 1 at x = 1 to 3 at x = 3. The area beneath is a trapezoid, so f changes by (1 + 3)/2 · 2 = 4, not by 1 · 2 or 3 · 2.",
    "例如，f′ 从 x = 1 处的 1 变到 x = 3 处的 3。其下方面积是梯形，所以 f 的变化量为 (1 + 3)/2 · 2 = 4，而不是 1 · 2 或 3 · 2。",
  ),
  "sketching-a-function-given-some-derivative-properties#shapes-from-the-signs-of-the-derivatives": drawing(
    [
      ...shift(
        pane(0, [0, 2, 2], [0, 4, 4], 5, 3.5)
          .f((x) => x * x)
          .say(1, -0.7, "f′ > 0, f″ > 0", "s")
          .marks(),
        0,
        6.5,
      ),
      ...shift(
        pane(8, [0, 2, 2], [0, 4, 4], 5, 3.5)
          .f((x) => 4 - (x - 2) ** 2)
          .say(1, -0.7, "f′ > 0, f″ < 0", "s")
          .marks(),
        0,
        6.5,
      ),
      ...pane(0, [0, 2, 2], [0, 4, 4], 5, 3.5)
        .f((x) => (x - 2) ** 2)
        .say(1, -0.7, "f′ < 0, f″ > 0", "s")
        .marks(),
      ...pane(8, [0, 2, 2], [0, 4, 4], 5, 3.5)
        .f((x) => 4 - x * x)
        .say(1, -0.7, "f′ < 0, f″ < 0", "s")
        .marks(),
    ],
    "The four shapes, for example with parabolas: rising and getting steeper, rising and levelling off, falling and levelling off, and falling and getting steeper.",
    "四种形状，例如用抛物线表示：上升且变陡，上升且趋平，下降且趋平，下降且变陡。",
  ),
  "approximating-functions-using-local-linearity-and-linearization#finding-a-linearization": graphed(
    wide(-1, 9, -1, 4),
    [curveOf(sqrt, undefined, 0, 9), tangent([4, 2], 0.25, "action"), pt([4, 2], "(4, 2)", "s", "result"), tag([8, 3.2], "L(x)", "n")],
    "For example, f(x) = √x at a = 4: f(4) = 2 and f′(4) = 1/4, so L(x) = 2 + (1/4)(x − 4). Near x = 4 the curve and the line are almost the same.",
    "例如，f(x) = √x，a = 4：f(4) = 2，f′(4) = 1/4，所以 L(x) = 2 + (1/4)(x − 4)。在 x = 4 附近曲线与直线几乎重合。",
  ),
  "approximating-functions-using-local-linearity-and-linearization#over-and-underestimates": drawing(
    [
      ...pane(0, [0, 3, 1], [-1, 5, 1], 6, 5)
        .f((x) => x * x)
        .f((x) => 2 * x - 1, undefined, undefined, "action")
        .dot(1, 1, undefined, "n", "result")
        .say(1.5, -2, "x²: <", "s")
        .marks(),
      ...pane(9, [0, 3, 1], [0, 3, 1], 6, 5)
        .f(sqrt)
        .f((x) => x / 2 + 0.5, undefined, undefined, "action")
        .dot(1, 1, undefined, "n", "result")
        .say(1.5, -0.5, "√x: >", "s")
        .marks(),
    ],
    "For example, at x = 1: y = x² is concave up, so it lies above its tangent y = 2x − 1, and the linearization underestimates. y = √x is concave down, so it lies below its tangent y = x/2 + 1/2, and the linearization overestimates.",
    "例如，在 x = 1 处：y = x² 下凸，在切线 y = 2x − 1 之上，线性近似偏小。y = √x 上凸，在切线 y = x/2 + 1/2 之下，线性近似偏大。",
  ),
  "approximating-trigonometric-functions-using-local-linearity#small-angle-approximations": drawing(
    [
      ...pane(0, [-1, 1, 1], [-2, 2, 1], 6, 5)
        .f(tan, -1, 1, "action")
        .f(sin, -1, 1)
        .path(
          [
            [-1, -1],
            [1, 1],
          ],
          "result",
          true,
        )
        .say(0.85, 1.6, "tan x", "w")
        .say(0.7, -0.4, "sin x", "s")
        .marks(),
      ...pane(9, [-1, 1, 1], [0, 2, 1], 6, 5).f(cos, -1, 1).level(1, "result").say(0.5, 0.5, "cos x", "s").say(0, 1, "y = 1", "ne").marks(),
    ],
    "Near 0, sin x and tan x hug the line y = x, one on each side of it, and cos x stays close to its maximum 1, so sin x ≈ x, tan x ≈ x and cos x ≈ 1.",
    "在 0 附近，sin x 和 tan x 紧贴直线 y = x，各在一侧；cos x 接近最大值 1，所以 sin x ≈ x，tan x ≈ x，cos x ≈ 1。",
  ),
  "approximating-trigonometric-functions-using-local-linearity#approximations-near-special-angles": graphed(
    wide(-1, 3, -1, 2),
    [curveOf(sin, undefined, -1, 3), tangent([pi / 6, 0.5], sqrt(3) / 2, "action"), pt([pi / 6, 0.5], "(π/6, 1/2)", "se", "result")],
    "sin x and its tangent at π/6, which has slope √3/2. One degree along, at π/6 + π/180, the line gives 1/2 + (√3/2)(π/180) ≈ 0.515 for sin 31°.",
    "sin x 及其在 π/6 处斜率为 √3/2 的切线。再走一度，到 π/6 + π/180 处，切线给出 sin 31° ≈ 1/2 + (√3/2)(π/180) ≈ 0.515。",
  ),
  "approximating-trigonometric-functions-using-local-linearity#whether-a-trigonometric-linearization-is-too-high-or-too-low": graphed(
    wide(-3, 3, -3, 3),
    [curveOf(sin), tangent([0, 0], 1, "action"), bare([0, 0], "result")],
    "The tangent to sin x at 0 is y = x. For x > 0 sine is concave down, so the line lies above the curve and is too high. For x < 0 sine is concave up, so the line lies below the curve and is too low.",
    "sin x 在 0 处的切线是 y = x。x > 0 时正弦上凸，直线在曲线上方，偏大。x < 0 时正弦下凸，直线在曲线下方，偏小。",
  ),
};
