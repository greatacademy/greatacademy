// Drawings of the explanations of Real Analysis: bounds, metrics, convergence, discontinuities and variation.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, pane } from "./explanation-drawings-calculus-kit.ts";
import { dotAt, drawing, note, seg } from "./explanation-drawings-kit.ts";

const line = (from: Point, to: Point, ticks: readonly number[], k: number, name: (t: number) => string): Mark[] => [
  ...head(from, to),
  ...ticks.flatMap((t) => [
    seg([from[0] + 0.3 + t * k, from[1] - 0.08], [from[0] + 0.3 + t * k, from[1] + 0.08]),
    note([from[0] + 0.3 + t * k, from[1]], name(t), "s"),
  ]),
];

const tent = (a: number, w: number, h = 1): Point[] => [
  [a - w, 0],
  [a, h],
  [a + w, 0],
];

/** analysisDrawings1 draws the explanations of Real Analysis, by knowledge point. */
export const analysisDrawings1: Readonly<Record<string, Figure>> = {
  "suprema-of-sets-of-reals#the-supremum-after-a-reflection": (() => {
    const k = 1;
    const up = (t: number): Point => [0.3 + t * k, 2.2];
    const lo = (t: number): Point => [0.3 + t * k, 0];
    const ts = [0, 2, 4, 6, 8, 10];
    return drawing(
      [
        ...line([0, 2.2], [11, 2.2], ts, k, String),
        ...line([0, 0], [11, 0], ts, k, String),
        seg(up(1), up(3), "action"),
        ...dotAt(up(1), "1", "n", "action"),
        ...dotAt(up(3), "3", "n", "action"),
        seg(lo(4), lo(8), "result"),
        ...dotAt(lo(4), undefined, "n", "result"),
        ...dotAt(lo(8), undefined, "n", "result"),
        seg(up(1), lo(8), undefined, true),
        seg(up(3), lo(4), undefined, true),
        note([11, 2.2], "A", "e"),
        note([11, 0], "10 − 2A", "e"),
        note([5, -0.9], "sup = 10 − 2 · 1 = 8", "s"),
      ],
      "For example, A = [1, 3] with c = 10 and k = 2. The map x ↦ 10 − 2x turns the interval around, as the dashed lines show: the left end 1 of A goes to the right end 8. So the supremum of the new set is 10 − 2 · inf A = 8, not 10 − 2 · sup A = 4.",
      "例如，A = [1, 3]，c = 10，k = 2。映射 x ↦ 10 − 2x 把区间翻转，如虚线所示：A 的左端 1 映到右端 8。所以新集合的上确界是 10 − 2 · inf A = 8，而不是 10 − 2 · sup A = 4。",
    );
  })(),
  "distances-in-metric-spaces#three-distances-in-the-plane": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [3, 0],
          [3, 4],
        ],
      },
      seg([0, 0], [3, 4], "result"),
      seg([0, 0], [3, 0], "action"),
      seg([3, 0], [3, 4], "action"),
      ...dotAt([0, 0], undefined, "n"),
      ...dotAt([3, 4], undefined, "n"),
      note([1.5, 0], "3", "s"),
      note([3, 2], "4", "e"),
      note([1.3, 2.2], "5", "nw"),
      note([6, 3], "√(3² + 4²) = 5", "e"),
      note([6, 2], "3 + 4 = 7", "e"),
      note([6, 1], "max(3, 4) = 4", "e"),
    ],
    "For example, two points differing by 3 in x and 4 in y. The Euclidean distance is the hypotenuse, √(3² + 4²) = 5. The taxicab distance follows the two legs, 3 + 4 = 7. The maximum distance is the longer leg, max(3, 4) = 4.",
    "例如，两点的 x 相差 3，y 相差 4。欧几里得距离是斜边 √(3² + 4²) = 5。出租车距离沿两条直角边，3 + 4 = 7。最大值距离是较长的直角边 max(3, 4) = 4。",
  ),
  "compactness-on-the-real-line#extreme-values-on-a-compact-interval": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 6, 2], 5.4, 4.4, "x", "y")
        .f((x) => (x - 2) * (x - 2) + 1, 0, 3, "result")
        .dot(0, 5, "(0, 5)", "e", "result")
        .dot(2, 1, "(2, 1)", "n", "result")
        .dot(3, 2, "(3, 2)", "n")
        .marks(),
      ...pane(8.8, [0, 1, 1], [0, 6, 2], 5.4, 4.4, "x", "y")
        .f((x) => 1 / x, 0.17, 1, "result")
        .open(1, 1, "(1, 1)", "e")
        .wall(0)
        .say(0.2, 5.4, "1/x", "e")
        .marks(),
    ],
    "On the left, the closed interval [0, 3] and the quadratic (x − 2)² + 1. Comparing the vertex value 1 with the endpoint values 5 and 2 finds the minimum 1 at x = 2 and the maximum 5 at x = 0. On the right, 1/x on the open interval (0, 1), which is not compact, has no maximum and no minimum: it grows without bound near 0 and the open point at 1 is not reached.",
    "左图闭区间 [0, 3] 和二次函数 (x − 2)² + 1。比较顶点值 1 和端点值 5、2，得到最小值 1（x = 2）和最大值 5（x = 0）。右图开区间 (0, 1) 不紧致，其上的 1/x 没有最大值也没有最小值：它在 0 附近无界增长，1 处的空心点取不到。",
  ),
  "differentiability-in-analysis#gluing-two-pieces": drawing(
    pane(0, [0, 3, 1], [0, 6, 1], 6, 5, "x", "y")
      .f((x) => x * x, 0, 1, "result")
      .f((x) => 2 * x - 1, 1, 3, "action")
      .dot(1, 1, "(1, 1)", "se")
      .say(0.4, 1, "y = x²", "n")
      .say(2.2, 3.4, "y = 2x − 1", "nw")
      .marks(),
    "For example, the parabola y = x² up to x = 1, joined to a line. The pieces must meet, so the line passes through (1, 1), and they must have the same slope, 2. These two conditions fix the line completely as y = 2x − 1, the tangent at the joint.",
    "例如，抛物线 y = x² 到 x = 1 为止，接一条直线。两段必须相接，所以直线过 (1, 1)，还必须斜率相同，都是 2。这两个条件完全确定了直线 y = 2x − 1，即接点处的切线。",
  ),
  "bounds-from-the-mean-value-theorem#the-slope-guaranteed-by-a-graph": drawing(
    pane(0, [0, 4, 1], [-2, 8, 2], 6.4, 5, "x", "y")
      .f((x) => (x * x) / 2, 0, 4, "result")
      .path(
        [
          [0, 0],
          [4, 8],
        ],
        "action",
      )
      .path(
        [
          [1, 0],
          [4, 6],
        ],
        undefined,
        true,
      )
      .dot(0, 0)
      .dot(4, 8, "(4, 8)", "w")
      .dot(2, 2, "c = 2", "se", "result")
      .say(2.4, -1.1, "(8 − 0)/(4 − 0) = 2", "s")
      .marks(),
    "For example, y = x²/2 from (0, 0) to (4, 8). The chord has slope (8 − 0)/(4 − 0) = 2, using only the two endpoints. The theorem promises a point where the tangent, dashed, is parallel to the chord: here at c = 2, where the derivative is 2.",
    "例如，y = x²/2 从 (0, 0) 到 (4, 8)。弦的斜率为 (8 − 0)/(4 − 0) = 2，只用到两个端点。定理保证有一点处的切线（虚线）与弦平行：这里在 c = 2，导数为 2。",
  ),
  "pointwise-and-uniform-convergence#the-kind-of-convergence-from-graphs": drawing(
    pane(0, [0, 9, 1], [0, 2, 1], 9, 3.4, "x", "y")
      .path(tent(2, 1), "result")
      .path(tent(4, 1), "result")
      .path(tent(6, 1), "result")
      .wall(1.5)
      .say(2, 1.05, "f₁", "n")
      .say(4, 1.05, "f₂", "n")
      .say(6, 1.05, "f₃", "n")
      .say(1.5, 1.8, "x₀", "w")
      .marks(),
    "For example, a hump of height 1 that slides to the right. At the fixed point x₀, dashed, f₁ is above zero but all the later humps have passed, so the values settle at 0: the convergence to 0 is pointwise. The height of the hump stays 1, so it is not uniform.",
    "例如，高为 1 的驼峰向右滑动。在固定点 x₀（虚线）处，f₁ 大于零，但后面的驼峰都已经过去，所以值稳定在 0：向 0 的收敛是逐点的。驼峰的高度保持为 1，所以不是一致收敛。",
  ),
  "pointwise-and-uniform-convergence#the-uniform-distance-from-a-graph": drawing(
    pane(0, [0, 1, 1], [0, 1.5, 1], 7, 4, "x", "y")
      .path(
        [
          [0, 0],
          [0.25, 1],
          [0.5, 0],
          [1, 0],
        ],
        "result",
      )
      .path(
        [
          [0, 0],
          [0.125, 1],
          [0.25, 0],
        ],
        undefined,
        true,
      )
      .dot(0.25, 1, "sup |f₄ − 0| = 1", "ne", "result")
      .say(0.4, 0.05, "f₄", "n")
      .say(0.06, 1.05, "f₈", "n")
      .marks(),
    "For example, tents with fₙ peaking at x = 1/n, and limit f = 0. The largest vertical distance from the limit, marked for f₄, is 1, and the dashed f₈ has the same height. At each fixed point the functions eventually reach 0, yet this distance never shrinks, so the convergence is not uniform.",
    "例如，帐篷函数 fₙ 的峰在 x = 1/n，极限 f = 0。到极限的最大竖直距离（标在 f₄ 上）是 1，虚线的 f₈ 高度相同。在每个固定点处函数最终都为 0，但这个距离从不缩小，所以不是一致收敛。",
  ),
  "the-contraction-mapping-principle#the-fixed-point-of-a-drawn-cobweb": (() => {
    const g = (x: number) => x / 2 + 1;
    const web: Point[] = [[0, 0]];
    let x = 0;
    for (let i = 0; i < 4; i++) {
      web.push([x, g(x)], [g(x), g(x)]);
      x = g(x);
    }
    return drawing(
      pane(0, [0, 3, 1], [0, 3, 1], 5, 5, "x", "y")
        .f((t) => t, 0, 3)
        .f(g, 0, 3, "action")
        .path(web, "result")
        .dot(2, 2, "(2, 2)", "se", "result")
        .say(0.9, 1.95, "y = x/2 + 1", "n")
        .say(2.5, 2.85, "y = x", "w")
        .marks(),
      "For example, the contraction x/2 + 1 starting from x = 0. The cobweb bounces between the graph and the line y = x through 1, 1.5, 1.75, and so on. It tightens around the fixed point (2, 2), where the graph meets the line.",
      "例如，压缩映射 x/2 + 1，从 x = 0 开始。蛛网在图像和直线 y = x 之间反弹，经过 1、1.5、1.75 等。它收紧到不动点 (2, 2)，即图像与直线的交点。",
    );
  })(),
  "kinds-of-discontinuities#the-kind-of-a-drawn-discontinuity": drawing(
    [
      ...pane(0, [0, 2, 1], [-1, 4, 1], 4, 4, "x", "y")
        .f((x) => x + 1, 0, 2, "result")
        .open(1, 2, "2", "se")
        .marks(),
      ...pane(6.2, [0, 2, 1], [-1, 4, 1], 4, 4, "x", "y")
        .f((x) => x, 0, 1, "result")
        .f((x) => x + 1.5, 1, 2, "result")
        .open(1, 1, "1", "se")
        .open(1, 2.5, "5/2", "nw")
        .marks(),
      ...pane(12.4, [0, 2, 1], [-1, 4, 1], 4, 4, "x", "y")
        .f((x) => 1 / (x - 1) + 1, 1.2, 2, "result")
        .f((x) => 1 / (1 - x) - 1, 0, 0.8, "result")
        .wall(1)
        .say(1.2, 3.6, "∞", "e")
        .marks(),
    ],
    "Three discontinuities at x = 1. On the left, both one-sided limits exist and agree at 2, so it is removable. In the middle, they exist and differ, 1 and 5/2, so it is a jump. On the right, the graph grows without bound beside the dashed line, so it is an infinite discontinuity.",
    "x = 1 处的三种间断。左图两个单侧极限存在且都等于 2，所以是可去间断。中图它们存在但不同（1 和 5/2），所以是跳跃间断。右图图像在虚线旁无界增长，所以是无穷间断。",
  ),
  "rolles-theorem-and-counting-zeros#counting-the-exact-zeros-of-a-cubic": drawing(
    [
      ...pane(0, [-3, 3, 1], [-3, 6, 3], 5.6, 4.4, "x", "y")
        .f((x) => x * x * x - 3 * x + 1, -2.2, 2.25, "result")
        .dot(-1, 3, "3", "nw", "result")
        .dot(1, -1, "−1", "s", "action")
        .marks(),
      ...pane(7.4, [-3, 3, 1], [-3, 6, 3], 5.6, 4.4, "x", "y")
        .f((x) => x * x * x - 3 * x + 3, -2.35, 2.1, "result")
        .dot(-1, 5, "5", "nw", "result")
        .dot(1, 1, "1", "ne", "result")
        .marks(),
    ],
    "For example, two cubics with critical points at x = −1 and x = 1. On the left, x³ − 3x + 1 has the values 3 and −1 there, of opposite signs, so the graph crosses the axis 3 times. On the right, x³ − 3x + 3 has the values 5 and 1, both positive, so it crosses only once.",
    "例如，两个临界点都在 x = −1 和 x = 1 的三次函数。左图 x³ − 3x + 1 在这两点的值为 3 和 −1，符号相反，所以图像穿过坐标轴 3 次。右图 x³ − 3x + 3 的值为 5 和 1，都是正的，所以只穿过一次。",
  ),
  "the-real-numbers-as-an-ordered-field#the-reverse-triangle-inequality": drawing(
    [
      ...head([-0.5, 0], [8.6, 0]),
      seg([3, 0], [7, 0], "result"),
      ...dotAt([0, 0], "0", "s"),
      ...dotAt([3, 0], "3", "s", "result"),
      ...dotAt([5, 0], "a = 5", "s"),
      ...dotAt([7, 0], "7", "s", "result"),
      note([4, 0.05], "2", "n"),
      note([6, 0.05], "2", "n"),
      note([4, -0.9], "|x| ≥ 5 − 2 = 3", "s"),
    ],
    "For example, a = 5 and |x − a| ≤ 2. Every such x lies in the highlighted interval from 3 to 7, so it stays at distance at least |a| − |x − a| = 5 − 2 = 3 from zero.",
    "例如，a = 5，|x − a| ≤ 2。所有这样的 x 都在突出显示的区间 3 到 7 中，所以到零的距离至少是 |a| − |x − a| = 5 − 2 = 3。",
  ),
  "continuous-images-of-compact-sets#where-the-maximum-is-attained": (() => {
    const f = (x: number) => 4 - (x - 3) * (x - 3);
    return drawing(
      [
        ...pane(0, [0, 5, 1], [-1, 5, 1], 5.4, 4.2, "x", "y")
          .f(f, 2, 5, undefined, true)
          .f(f, 1, 2, "result")
          .dot(2, 3, "(2, 3)", "nw", "result")
          .marks(),
        ...pane(7.2, [0, 5, 1], [-1, 5, 1], 5.4, 4.2, "x", "y")
          .f(f, 1, 2, undefined, true)
          .f(f, 4, 5, undefined, true)
          .f(f, 2, 4, "result")
          .dot(3, 4, "(3, 4)", "n", "result")
          .marks(),
      ],
      "For example, the parabola 4 − (x − 3)², dashed, with its vertex at x = 3. On the interval [1, 2], on the left, the vertex lies outside, so the maximum 3 is at the end point x = 2. On [2, 4], on the right, the vertex lies inside, so the maximum 4 is at the critical point.",
      "例如，抛物线 4 − (x − 3)²（虚线），顶点在 x = 3。左图区间 [1, 2] 中顶点在外面，所以最大值 3 在端点 x = 2。右图区间 [2, 4] 中顶点在里面，所以最大值 4 在临界点。",
    );
  })(),
  "monotone-functions-and-their-jumps#the-jumps-of-a-monotone-step-graph": drawing(
    pane(0, [0, 4, 1], [0, 7, 1], 6.4, 5, "x", "y")
      .path(
        [
          [0, 1],
          [1, 1],
        ],
        "result",
      )
      .path(
        [
          [1, 3],
          [2, 3],
        ],
        "result",
      )
      .path(
        [
          [2, 4],
          [3, 4],
        ],
        "result",
      )
      .path(
        [
          [3, 6],
          [4, 6],
        ],
        "result",
      )
      .path(
        [
          [1, 1],
          [1, 3],
        ],
        "action",
        true,
      )
      .path(
        [
          [2, 3],
          [2, 4],
        ],
        "action",
        true,
      )
      .path(
        [
          [3, 4],
          [3, 6],
        ],
        "action",
        true,
      )
      .say(1, 2, "2", "e")
      .say(2, 3.5, "1", "e")
      .say(3, 5, "2", "e")
      .say(2.6, 1, "2 + 1 + 2 = 6 − 1", "n")
      .marks(),
    "For example, an increasing step function with values 1, 3, 4 and 6. The dashed jumps have sizes 2, 1 and 2, each the right limit minus the left limit. They add up to 5, which is exactly the total rise from 1 to 6.",
    "例如，取值 1、3、4、6 的递增阶梯函数。虚线的跳跃大小为 2、1、2，每个都是右极限减左极限。它们的和为 5，恰好等于从 1 到 6 的总上升量。",
  ),
  "functions-of-bounded-variation#total-variation-of-a-piecewise-monotone-function": drawing(
    pane(0, [-1, 2, 1], [0, 5, 1], 6, 5, "x", "y")
      .f((x) => x * x, -1, 0, "action")
      .f((x) => x * x, 0, 2, "result")
      .dot(-1, 1, "(−1, 1)", "n", "action")
      .dot(0, 0)
      .dot(2, 4, "(2, 4)", "w", "result")
      .say(1, 0.1, "1 + 4 = 5", "ne")
      .marks(),
    "For example, x² on [−1, 2], split at the turning point x = 0. On the first piece the function falls from 1 to 0, a change of size 1. On the second it rises from 0 to 4, a change of size 4. So the total variation is 1 + 4 = 5.",
    "例如，[−1, 2] 上的 x²，在转折点 x = 0 处分开。第一段函数从 1 降到 0，变化量为 1。第二段从 0 升到 4，变化量为 4。所以总变差为 1 + 4 = 5。",
  ),
  "functions-of-bounded-variation#the-total-variation-of-a-drawn-path": drawing(
    pane(0, [0, 4, 1], [0, 6, 1], 6.4, 5, "x", "y")
      .path(
        [
          [0, 1],
          [1, 4],
          [2, 2],
          [3, 5],
          [4, 3],
        ],
        "result",
      )
      .dot(0, 1)
      .dot(1, 4, "4", "n")
      .dot(2, 2, "2", "s")
      .dot(3, 5, "5", "n")
      .dot(4, 3, "3", "e")
      .say(2, -1, "3 + 2 + 3 + 2 = 10", "s")
      .marks(),
    "For example, a path through the heights 1, 4, 2, 5 and 3. The changes on the pieces have sizes 3, 2, 3 and 2, so the total variation is 3 + 2 + 3 + 2 = 10. The net change is only 3 − 1 = 2, and the range is only 5 − 1 = 4.",
    "例如，经过高度 1、4、2、5、3 的路径。各段变化量为 3、2、3、2，所以总变差为 3 + 2 + 3 + 2 = 10。净变化只有 3 − 1 = 2，值域长度只有 5 − 1 = 4。",
  ),
  "compactness-in-metric-spaces#a-net-for-an-interval": (() => {
    const k = 1;
    return drawing(
      [
        seg([0, 0], [10 * k, 0], "result"),
        ...dotAt([0, 0], "0", "s"),
        ...dotAt([10 * k, 0], "10", "s"),
        ...[0, 3, 6, 9].flatMap((a) => {
          const pts: Point[] = [
            [a * k, 0.25],
            [(a + 3) * k, 0.25],
            [(a + 3) * k, 0.85],
            [a * k, 0.85],
          ];
          return [{ kind: "polygon", points: pts } as Mark, ...dotAt([(a + 1.5) * k, 0.55])];
        }),
        note([5, -0.8], "10/(2ε) = 10/3,  ε = 3/2", "s"),
      ],
      "For example, the interval [0, 10] and ε = 3/2, so each ball is an interval of length 2ε = 3. The length divided by that is 10/3, which rounds up to 4, and the 4 boxes above the line show those balls covering the interval.",
      "例如，区间 [0, 10]，ε = 3/2，所以每个球是长度 2ε = 3 的区间。长度除以它得 10/3，向上取整为 4，线上方的 4 个方框表示这些球覆盖了区间。",
    );
  })(),
  "compactness-in-metric-spaces#a-net-for-a-square": drawing(
    [
      ...[0, 1, 2].flatMap((a) =>
        [0, 1, 2].flatMap((b) => {
          const pts: Point[] = [
            [a * 1.4, b * 1.4],
            [(a + 1) * 1.4, b * 1.4],
            [(a + 1) * 1.4, (b + 1) * 1.4],
            [a * 1.4, (b + 1) * 1.4],
          ];
          return [{ kind: "polygon", points: pts } as Mark, ...dotAt([(a + 0.5) * 1.4, (b + 0.5) * 1.4], undefined, "n", "result")];
        }),
      ),
      note([2.1, -0.1], "3", "s"),
      note([2.1, -0.8], "3² = 9", "s"),
      note([4.2, 2.1], "2ε = 1", "e"),
    ],
    "For example, a square of side 3 with ε = 1/2 in the maximum metric. Each ball is a square of side 2ε = 1 around its marked center. Three balls are needed along one side, so the grid has 3² = 9 balls.",
    "例如，最大值度量下边长为 3 的正方形，ε = 1/2。每个球是以标出的点为中心、边长 2ε = 1 的正方形。沿一条边需要 3 个球，所以网格有 3² = 9 个球。",
  ),
  "the-lebesgue-integral-of-simple-functions#the-integral-of-a-drawn-simple-function": drawing(
    pane(0, [0, 4, 1], [-2, 4, 1], 6.4, 5, "x", "y")
      .under(() => 2, 0, 1, "result")
      .under(() => -1, 1, 3, "action")
      .under(() => 3, 3, 4, "result")
      .path(
        [
          [0, 2],
          [1, 2],
        ],
        "result",
      )
      .path(
        [
          [1, -1],
          [3, -1],
        ],
        "action",
      )
      .path(
        [
          [3, 3],
          [4, 3],
        ],
        "result",
      )
      .say(0.5, 0.7, "2", "n")
      .say(2, -1.15, "−2", "s")
      .say(3.5, 1, "3", "n")
      .say(2, -2.3, "2 · 1 − 1 · 2 + 3 · 1 = 3", "s")
      .marks(),
    "For example, a simple function with value 2 on a set of measure 1, value −1 on a set of measure 2 and value 3 on a set of measure 1. The integral is 2 · 1 − 1 · 2 + 3 · 1 = 3. The part below the axis has a negative value, so it subtracts.",
    "例如，简单函数在测度 1 的集合上取 2，在测度 2 的集合上取 −1，在测度 1 的集合上取 3。积分为 2 · 1 − 1 · 2 + 3 · 1 = 3。轴下方的部分取负值，所以要减去。",
  ),
};
