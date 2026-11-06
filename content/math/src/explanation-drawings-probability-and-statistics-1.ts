// Drawings of the explanations of Probability and Statistics.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, pane } from "./explanation-drawings-calculus-kit.ts";
import { dotAt, drawing, note, seg } from "./explanation-drawings-kit.ts";
import { table } from "./explanation-drawings-structures-kit.ts";

const shadeOf = (points: readonly Point[], tone: "action" | "result" = "result"): Mark => ({ kind: "shade", points, tone });

// The plane of a joint distribution with the rectangle (a, c)-(b, d) shaded.
const corners = (labels: readonly [string, string, string, string], ax = "a", bx = "b", cy = "c", dy = "d"): Mark[] => [
  shadeOf([
    [2, 1],
    [4, 1],
    [4, 3],
    [2, 3],
  ]),
  ...head([0, 0], [6, 0]),
  ...head([0, 0], [0, 4.4]),
  note([6, 0], "x", "e"),
  note([0, 4.4], "y", "n"),
  seg([2, 0], [2, 3], undefined, true),
  seg([4, 0], [4, 3], undefined, true),
  seg([0, 1], [4, 1], undefined, true),
  seg([0, 3], [4, 3], undefined, true),
  note([2, 0], ax, "s"),
  note([4, 0], bx, "s"),
  note([0, 1], cy, "w"),
  note([0, 3], dy, "w"),
  ...dotAt([4, 3], labels[0], "ne"),
  ...dotAt([2, 3], labels[1], "nw"),
  ...dotAt([4, 1], labels[2], "se"),
  ...dotAt([2, 1], labels[3], "sw"),
];

const joint = [
  ["1/12", "1/12", "2/12"],
  ["1/12", "2/12", "1/12"],
  ["2/12", "1/12", "1/12"],
];

/** probabilityDrawings1 draws the explanations of Probability and Statistics, by knowledge point. */
export const probabilityDrawings1: Readonly<Record<string, Figure>> = {
  "many-to-one-transformations-of-discrete-random-variables#cumulative-probabilities-of-many-to-one-transformations": drawing(
    pane(0, [-3, 3, 1], [0, 9, 3], 7, 5, "x", "y")
      .f((x) => x * x, -3, 3, "result")
      .level(4)
      .path(
        [
          [-2, 0],
          [-2, 4],
        ],
        undefined,
        true,
      )
      .path(
        [
          [2, 0],
          [2, 4],
        ],
        undefined,
        true,
      )
      .path(
        [
          [-2, 0],
          [2, 0],
        ],
        "action",
      )
      .say(3.05, 4, "y = 4", "e")
      .say(0, -1.3, "−2 ≤ x ≤ 2", "s")
      .marks(),
    "The graph of y = x² with the dashed level y = 4. The event Y ≤ 4 is the marked interval −2 ≤ X ≤ 2, centered at zero, so add the probabilities of all x in that range.",
    "y = x² 的图像和虚线 y = 4。事件 Y ≤ 4 对应标出的区间 −2 ≤ X ≤ 2，它以零为中心，所以把该范围内所有 x 的概率相加。",
  ),
  "cumulative-distribution-functions-for-continuous-random-variables#a-probability-from-the-graph-of-a-distribution-function": drawing(
    pane(0, [0, 4, 1], [0, 1, 0.5], 7, 5, "x", "F")
      .f((x) => (x * x) / 16, 0, 4, "result")
      .path(
        [
          [1, 0],
          [1, 1 / 16],
          [0, 1 / 16],
        ],
        undefined,
        true,
      )
      .path(
        [
          [3, 0],
          [3, 9 / 16],
          [0, 9 / 16],
        ],
        undefined,
        true,
      )
      .dot(1, 1 / 16)
      .say(0.1, 0.22, "F(1) = 1/16", "e")
      .dot(3, 9 / 16, "F(3) = 9/16", "nw")
      .say(0.1, 0.85, "9/16 − 1/16 = 1/2", "e")
      .marks(),
    "For example, F(x) = x²/16 on [0, 4]. The graph rises from 0 to 1 and never falls. P(1 < X ≤ 3) is the difference of heights F(3) − F(1) = 9/16 − 1/16 = 1/2.",
    "例如，[0, 4] 上的 F(x) = x²/16。图像从 0 上升到 1，从不下降。P(1 < X ≤ 3) 是高度之差 F(3) − F(1) = 9/16 − 1/16 = 1/2。",
  ),
  "cumulative-distribution-functions-for-continuous-random-variables#an-interval-probability-from-a-drawn-cdf": drawing(
    pane(0, [0, 6, 2], [0, 1, 0.5], 7, 5, "x", "F")
      .path(
        [
          [0, 0],
          [2, 0.2],
          [4, 0.8],
          [6, 1],
        ],
        "result",
      )
      .path(
        [
          [2, 0],
          [2, 0.2],
          [0, 0.2],
        ],
        undefined,
        true,
      )
      .path(
        [
          [4, 0],
          [4, 0.8],
          [0, 0.8],
        ],
        undefined,
        true,
      )
      .dot(2, 0.2)
      .say(1.9, 0.27, "F(2) = 0.2", "w")
      .dot(4, 0.8, "F(4) = 0.8", "se")
      .say(0.1, 0.45, "0.8 − 0.2 = 0.6", "e")
      .marks(),
    "For example, a graph through (2, 0.2) and (4, 0.8). The probability of landing between 2 and 4 is F(4) − F(2) = 0.8 − 0.2 = 0.6. Reading only F(4) = 0.8 would also count what lies below 2.",
    "例如，图像经过 (2, 0.2) 和 (4, 0.8)。落在 2 和 4 之间的概率为 F(4) − F(2) = 0.8 − 0.2 = 0.6。只读 F(4) = 0.8 会把 2 以下的部分也算进去。",
  ),
  "median-quartiles-and-percentiles-of-continuous-random-variables#a-quartile-from-a-drawn-cdf": drawing(
    pane(0, [0, 8, 2], [0, 1, 0.25], 7, 6, "x", "F")
      .path(
        [
          [0, 0],
          [1, 0.25],
          [2, 0.5],
          [6, 0.75],
          [8, 1],
        ],
        "result",
      )
      .path(
        [
          [0, 0.25],
          [1, 0.25],
          [1, 0],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 0.5],
          [2, 0.5],
          [2, 0],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 0.75],
          [6, 0.75],
          [6, 0],
        ],
        undefined,
        true,
      )
      .say(1, 0, "1", "s")
      .marks(),
    "For example, a graph through (1, 1/4), (2, 1/2) and (6, 3/4). Start at a height, go across to the graph and then down: the lower quartile is 1, the median is 2 and the upper quartile is 6.",
    "例如，图像经过 (1, 1/4)、(2, 1/2) 和 (6, 3/4)。从某一高度出发，横向走到图像，再向下走：下四分位数为 1，中位数为 2，上四分位数为 6。",
  ),
  "expected-values-of-continuous-random-variables#the-mean-of-a-triangular-density": drawing(
    [
      ...pane(0, [0, 6, 2], [0, 0.4, 0.2], 6, 4, "x", "f")
        .path(
          [
            [0, 0],
            [3, 1 / 3],
            [6, 0],
          ],
          "result",
        )
        .under((x) => (x < 3 ? x / 9 : (6 - x) / 9), 0, 6)
        .dot(3, 0, undefined, undefined, "action")
        .say(3, -0.08, "μ = (0 + 6 + 3)/3 = 3", "s")
        .marks(),
      ...pane(9, [0, 6, 2], [0, 0.4, 0.2], 6, 4, "x", "f")
        .path(
          [
            [0, 0],
            [1, 1 / 3],
            [6, 0],
          ],
          "result",
        )
        .under((x) => (x < 1 ? x / 3 : (6 - x) / 15), 0, 6)
        .dot(7 / 3, 0, undefined, undefined, "action")
        .say(3, -0.08, "μ = (0 + 6 + 1)/3 = 7/3", "s")
        .marks(),
    ],
    "For example, triangles on [0, 6]. With the peak at 3 the triangle is symmetric and balances at its peak, 3. With the peak at 1 the mean is (0 + 6 + 1)/3 = 7/3, marked on the axis, on the side of the long tail.",
    "例如，[0, 6] 上的三角形密度。峰值在 3 时三角形对称，平衡点就在峰值处，即 3。峰值在 1 时，均值为 (0 + 6 + 1)/3 = 7/3（在轴上标出），偏向长尾一侧。",
  ),
  "variance-of-continuous-random-variables#the-variance-of-a-right-triangular-density": drawing(
    pane(0, [0, 3, 1], [0, 1, 0.5], 7, 5, "x", "f")
      .under((x) => (2 * x) / 9, 0, 3)
      .path(
        [
          [0, 0],
          [3, 2 / 3],
          [3, 0],
        ],
        "result",
      )
      .path(
        [
          [0, 1 / 3],
          [3, 1 / 3],
        ],
        undefined,
        true,
      )
      .dot(2, 0, "μ = 2", "n", "action")
      .say(0.1, 0.85, "σ² = 9/18 = 1/2", "e")
      .say(0.1, 0.42, "σ² = 9/12 = 3/4", "e")
      .marks(),
    "For example, c = 3: the density rises in a straight line to 2/3 at x = 3. The mean is 2c/3 = 2 and the variance is 9/18 = 1/2. It is smaller than the variance 9/12 = 3/4 of the dashed uniform density on the same interval.",
    "例如，c = 3：密度沿直线上升，在 x = 3 处达到 2/3。均值为 2c/3 = 2，方差为 9/18 = 1/2。它小于同一区间上虚线均匀密度的方差 9/12 = 3/4。",
  ),
  "the-continuous-uniform-distribution#continuous-uniform-pdf-value": drawing(
    pane(0, [0, 8, 2], [0, 0.5, 0.25], 7, 4, "x", "f")
      .under(() => 0.25, 2, 6)
      .path(
        [
          [2, 0],
          [2, 0.25],
          [6, 0.25],
          [6, 0],
        ],
        "result",
      )
      .say(4, 0.27, "f = 1/(6 − 2) = 1/4", "n")
      .say(4, 0.08, "4 · 1/4 = 1", "n")
      .marks(),
    "For example, X ~ U(2, 6). The rectangle has width 4 and area 1, so its height is f(x) = 1/4 on [2, 6]; the density is 0 elsewhere.",
    "例如，X ~ U(2, 6)。矩形宽为 4，面积为 1，所以高度为 f(x) = 1/4，x 在 [2, 6] 上；其他位置密度为 0。",
  ),
  "the-continuous-uniform-distribution#a-uniform-probability-from-its-density": drawing(
    pane(0, [0, 6, 1], [0, 0.4, 0.2], 7, 4, "x", "f")
      .under(() => 0.2, 2, 4)
      .path(
        [
          [1, 0],
          [1, 0.2],
          [6, 0.2],
          [6, 0],
        ],
        "result",
      )
      .say(3.5, 0.22, "1/(6 − 1) = 1/5", "n")
      .say(3, 0.06, "2 · 1/5", "n")
      .marks(),
    "For example, a uniform density on [1, 6] has height 1/5. The shaded part over [2, 4] has width 2, so the probability is 2 · 1/5 = 2/5.",
    "例如，[1, 6] 上的均匀密度高度为 1/5。[2, 4] 上的阴影部分宽为 2，所以概率为 2 · 1/5 = 2/5。",
  ),
  "mean-and-variance-of-the-continuous-uniform-distribution#mean-and-variance-from-a-rectangular-density": drawing(
    pane(0, [0, 8, 1], [0, 0.4, 0.2], 7, 4, "x", "f")
      .under(() => 1 / 6, 1, 7)
      .path(
        [
          [1, 0],
          [1, 1 / 6],
          [7, 1 / 6],
          [7, 0],
        ],
        "result",
      )
      .dot(4, 0, "μ = (1 + 7)/2 = 4", "n", "action")
      .say(4, 0.2, "σ² = 6²/12 = 3", "n")
      .marks(),
    "For example, a rectangle on [1, 7] of height 1/6. The mean is the midpoint (1 + 7)/2 = 4, and the variance is 6²/12 = 3, which depends only on the width 6.",
    "例如，[1, 7] 上高为 1/6 的矩形。均值是中点 (1 + 7)/2 = 4，方差为 6²/12 = 3，只取决于宽度 6。",
  ),
  "the-joint-cdf-of-two-discrete-random-variables#probabilities-of-regions-from-a-joint-table": drawing(
    [
      ...table(joint, {
        cols: ["0", "1", "2"],
        rows: ["2", "1", "0"],
        cell: 1.3,
        shade: [
          [0, 0],
          [1, 0],
          [1, 1],
          [2, 0],
          [2, 1],
          [2, 2],
        ],
      }),
      note([1.95, 0.5], "x", "n"),
      note([-0.9, -1.95], "y", "w"),
      note([1.95, -4], "P(X + Y ≤ 2) = 8/12", "s"),
    ],
    "For example, a joint table in twelfths. The event X + Y ≤ 2 is the shaded cells, whose sum is (1 + 1 + 2 + 2 + 1 + 1)/12 = 8/12. They do not form a rectangle, so a single CDF value cannot give this probability.",
    "例如，一张以十二分之几表示的联合分布表。事件 X + Y ≤ 2 是阴影单元格，其和为 (1 + 1 + 2 + 2 + 1 + 1)/12 = 8/12。这些单元格不构成矩形，所以不能由单个 CDF 值得到这个概率。",
  ),
  "the-joint-cdf-of-two-discrete-random-variables#a-rectangle-probability-from-the-joint-cdf": drawing(
    [
      ...table(joint, { cols: ["0", "1", "2"], rows: ["2", "1", "0"], cell: 1.3, shade: [[0, 2]] }),
      note([1.95, 0.5], "x", "n"),
      note([-0.9, -1.95], "y", "w"),
      note([1.95, -4], "F(2, 2) − F(1, 2) − F(2, 1) + F(1, 1)", "s"),
      note([1.95, -4.7], "(12 − 8 − 8 + 6)/12 = 2/12", "s"),
    ],
    "For example, in the same kind of table, take the shaded cell X = 2, Y = 2. Subtract the regions to its left and below, F(1, 2) = 8/12 and F(2, 1) = 8/12, from F(2, 2) = 12/12, then add back the corner F(1, 1) = 6/12, subtracted twice. That gives 2/12, the entry of the cell.",
    "例如，在同类表格中取阴影单元格 X = 2，Y = 2。从 F(2, 2) = 12/12 中减去其左侧和下方的区域 F(1, 2) = 8/12 与 F(2, 1) = 8/12，再加回被减两次的角 F(1, 1) = 6/12。结果为 2/12，正是该单元格的值。",
  ),
  "marginal-distributions-for-continuous-random-variables#marginal-densities-on-non-rectangular-regions": drawing(
    [
      ...pane(0, [0, 1, 1], [0, 1, 1], 5, 5)
        .under((x) => x, 0, 1)
        .path(
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
          "result",
        )
        .path(
          [
            [0.5, 0],
            [0.5, 0.5],
          ],
          "action",
        )
        .say(0.1, 0.8, "f = 2", "e")
        .say(0.5, 0.25, "x", "e")
        .marks(),
      ...pane(8, [0, 1, 1], [0, 2, 1], 5, 5, "x", "fₓ")
        .f((x) => 2 * x, 0, 1, "result")
        .dot(0.5, 1, "(1/2, 1)", "nw")
        .say(0.9, 1.25, "fₓ = 2x", "s")
        .marks(),
    ],
    "On the triangle 0 ≤ y ≤ x ≤ 1 with f = 2, the slice at x runs from 0 to x, so the limits depend on x. Its length times 2 is the marginal 2x, drawn on the right. For example, at x = 1/2 it is 1.",
    "在三角形 0 ≤ y ≤ x ≤ 1 上 f = 2，x 处的切片从 0 到 x，所以积分限依赖于 x。切片长度乘以 2 就是右图的边缘密度 2x。例如，在 x = 1/2 处它等于 1。",
  ),
  "marginal-distributions-for-continuous-random-variables#marginals-of-a-non-constant-density-on-a-triangle": drawing(
    pane(0, [0, 1, 1], [0, 1, 1], 6, 6)
      .under((x) => x, 0, 1)
      .path(
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
        ],
        "result",
      )
      .path(
        [
          [0.4, 0],
          [0.4, 0.4],
        ],
        "action",
      )
      .path(
        [
          [0.7, 0.2],
          [1, 0.2],
        ],
        "action",
      )
      .path(
        [
          [0.2, 0.2],
          [0.7, 0.2],
        ],
        undefined,
        true,
      )
      .say(0.4, 0.42, "∫₀ˣ dy", "nw")
      .say(0.86, 0.2, "∫ᵧ¹ dx", "n")
      .marks(),
    "The triangle 0 ≤ y ≤ x ≤ 1 with its two kinds of slice. Integrating out y runs up from 0 to x; integrating out x runs across from y to 1. Since the limits differ, the two marginals have different forms.",
    "三角形 0 ≤ y ≤ x ≤ 1 及其两种切片。对 y 积分是从 0 向上到 x；对 x 积分是从 y 横向到 1。由于积分限不同，两个边缘密度的形式也不同。",
  ),
  "marginal-distributions-for-continuous-random-variables#a-marginal-density-on-a-triangle": drawing(
    [
      ...pane(0, [0, 2, 1], [0, 2, 1], 5, 5)
        .under((x) => 2 - x, 0, 2)
        .path(
          [
            [0, 0],
            [2, 0],
            [0, 2],
            [0, 0],
          ],
          "result",
        )
        .path(
          [
            [1, 0],
            [1, 1],
          ],
          "action",
        )
        .say(1, 1.05, "1 · 1/2", "ne")
        .say(1.1, 1.7, "f = 1/2", "e")
        .marks(),
      ...pane(8, [0, 2, 1], [0, 1.5, 0.5], 5, 5, "x", "fₓ")
        .f((x) => (2 - x) / 2, 0, 2, "result")
        .dot(1, 0.5, "(1, 1/2)", "ne")
        .marks(),
    ],
    "For example, a uniform density on the triangle with corners (0, 0), (2, 0), (0, 2). The area is 2, so the height is 1/2. The slice at x has length 2 − x, so the marginal is (2 − x)/2, a straight line: at x = 1 it is 1 · 1/2 = 1/2.",
    "例如，顶点为 (0, 0)、(2, 0)、(0, 2) 的三角形上的均匀密度。面积为 2，所以高度为 1/2。x 处切片长度为 2 − x，所以边缘密度为 (2 − x)/2，是一条直线：在 x = 1 处等于 1 · 1/2 = 1/2。",
  ),
  "independence-of-continuous-random-variables#both-the-formula-and-the-support-must-factor": drawing(
    [
      ...pane(0, [0, 1, 1], [0, 1, 1], 5, 5)
        .under(() => 1, 0, 1)
        .path(
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
          "result",
        )
        .say(0.5, 1.05, "4xy", "n")
        .say(0.5, -0.14, "✓", "s")
        .marks(),
      ...pane(8, [0, 1, 1], [0, 1, 1], 5, 5)
        .under((x) => x, 0, 1)
        .path(
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
          "result",
        )
        .path(
          [
            [0.4, 0],
            [0.4, 0.4],
          ],
          "action",
        )
        .path(
          [
            [0.8, 0],
            [0.8, 0.8],
          ],
          "action",
        )
        .say(0.5, 1.05, "8xy", "n")
        .say(0.5, -0.14, "✗", "s")
        .marks(),
    ],
    "For example, 4xy on the unit square factors and the support is a rectangle, so the variables are independent. 8xy on the triangle 0 ≤ y ≤ x ≤ 1 looks like a product, but the slices show that the range of y depends on x, so they are not independent.",
    "例如，单位正方形上的 4xy 可以分解，支撑集是矩形，所以两个变量独立。三角形 0 ≤ y ≤ x ≤ 1 上的 8xy 看起来是乘积，但切片表明 y 的范围依赖于 x，所以它们不独立。",
  ),
  "independence-of-continuous-random-variables#independence-from-the-shape-of-the-support": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 3, 1], 5, 5)
        .under(() => 2, 1, 3)
        .path(
          [
            [1, 0],
            [3, 0],
            [3, 2],
            [1, 2],
            [1, 0],
          ],
          "result",
        )
        .say(1.5, -0.8, "✓", "s")
        .marks(),
      ...pane(8, [0, 3, 1], [0, 3, 1], 5, 5)
        .under((x) => 3 - x, 0, 3)
        .path(
          [
            [0, 0],
            [3, 0],
            [0, 3],
            [0, 0],
          ],
          "result",
        )
        .say(1.5, -0.8, "✗", "s")
        .marks(),
      shadeOf([
        [16, 2.5],
        [18.5, 0],
        [21, 2.5],
        [18.5, 5],
      ]),
      ...pane(16, [0, 3, 1], [0, 3, 1], 5, 5)
        .path(
          [
            [0, 1.5],
            [1.5, 0],
            [3, 1.5],
            [1.5, 3],
            [0, 1.5],
          ],
          "result",
        )
        .say(1.5, -0.8, "✗", "s")
        .marks(),
    ],
    "A rectangle with sides along the axes can be the support of independent variables. A triangle and a tilted square cannot: there, some x and some y cannot occur together, so independence is ruled out at a glance.",
    "边平行于坐标轴的矩形可以是独立变量的支撑集。三角形和倾斜的正方形则不能：其中某些 x 和某些 y 不能同时出现，所以一眼就能排除独立性。",
  ),
  "conditional-distributions-for-continuous-random-variables#a-conditional-variance-on-a-uniform-triangle": drawing(
    pane(0, [0, 4, 1], [0, 4, 1], 6, 6)
      .under((x) => x, 0, 4)
      .path(
        [
          [0, 0],
          [4, 0],
          [4, 4],
          [0, 0],
        ],
        "result",
      )
      .path(
        [
          [3, 0],
          [3, 3],
        ],
        "action",
      )
      .dot(3, 3, "(3, 3)", "nw")
      .say(2.95, 1, "3²/12 = 3/4", "w")
      .marks(),
    "For example, c = 4 and x = 3. Fixing X = 3 leaves Y uniform on the slice from 0 to 3, so its conditional variance is 3²/12 = 3/4. The size c of the triangle plays no part.",
    "例如，c = 4，x = 3。固定 X = 3 后，Y 在从 0 到 3 的切片上均匀分布，所以条件方差为 3²/12 = 3/4。三角形的大小 c 不起作用。",
  ),
  "the-joint-cdf-of-two-continuous-random-variables#the-joint-cdf-of-a-non-uniform-density": drawing(
    pane(0, [0, 1, 0.5], [0, 1, 0.5], 6, 6)
      .under(() => 0.5, 0, 0.5)
      .path(
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
        "result",
      )
      .path(
        [
          [0.5, 0],
          [0.5, 0.5],
          [0, 0.5],
        ],
        "action",
      )
      .dot(0.5, 0.5)
      .say(0.53, 0.53, "F(1/2, 1/2) = 1/8", "e")
      .dot(1, 1)
      .say(0.95, 0.88, "F(1, 1) = 1", "w")
      .marks(),
    "With f = x + y on the unit square, F(a, b) = ab(a + b)/2 is the integral over the shaded lower-left rectangle. For example, F(1/2, 1/2) = (1/4)(1)/2 = 1/8: a quarter of the area but only 1/8 of the probability, since the density is small there. F(1, 1) = 1.",
    "单位正方形上 f = x + y，F(a, b) = ab(a + b)/2 是在左下角阴影矩形上的积分。例如，F(1/2, 1/2) = (1/4)(1)/2 = 1/8：占四分之一的面积，却只有 1/8 的概率，因为那里的密度较小。F(1, 1) = 1。",
  ),
  "the-joint-cdf-of-two-continuous-random-variables#a-rectangle-probability-from-a-joint-cdf": drawing(
    corners(["F(b, d)", "F(a, d)", "F(b, c)", "F(a, c)"]),
    "The shaded rectangle a < X ≤ b, c < Y ≤ d with the value of F at each corner. Its probability is F(b, d) − F(a, d) − F(b, c) + F(a, c). The quarter-plane below and to the left of (a, c) is subtracted twice, so F(a, c) is added back.",
    "阴影矩形 a < X ≤ b，c < Y ≤ d，每个角标出 F 的值。其概率为 F(b, d) − F(a, d) − F(b, c) + F(a, c)。(a, c) 左下方的四分之一平面被减了两次，所以要加回 F(a, c)。",
  ),
  "the-joint-cdf-of-two-continuous-random-variables#a-joint-cdf-as-a-fraction-of-a-rectangle": drawing(
    pane(0, [0, 4, 1], [0, 2, 1], 8, 4)
      .under(() => 1, 0, 3)
      .path(
        [
          [0, 0],
          [4, 0],
          [4, 2],
          [0, 2],
          [0, 0],
        ],
        "result",
      )
      .dot(3, 1, "(3, 1)", "ne")
      .say(1.5, 0.4, "3 · 1/(4 · 2) = 3/8", "n")
      .marks(),
    "For example, a uniform density on [0, 4] × [0, 2]. F(3, 1) is the fraction of the rectangle's area to the lower left of (3, 1): 3 · 1/(4 · 2) = 3/8.",
    "例如，[0, 4] × [0, 2] 上的均匀密度。F(3, 1) 是 (3, 1) 左下方部分占矩形面积的比例：3 · 1/(4 · 2) = 3/8。",
  ),
  "properties-of-the-joint-cdf-of-two-continuous-random-variables#a-rectangle-probability-from-cdf-values": drawing(
    [...corners(["0.8", "0.5", "0.4", "0.3"]), note([3, -0.9], "0.8 − 0.5 − 0.4 + 0.3 = 0.2", "s")],
    "For example, F(b, d) = 0.8, F(a, d) = 0.5, F(b, c) = 0.4 and F(a, c) = 0.3 at the corners. The shaded rectangle has probability 0.8 − 0.5 − 0.4 + 0.3 = 0.2. The corner value 0.3 is subtracted twice, in the middle terms, so it is added back once.",
    "例如，四个角的值为 F(b, d) = 0.8，F(a, d) = 0.5，F(b, c) = 0.4，F(a, c) = 0.3。阴影矩形的概率为 0.8 − 0.5 − 0.4 + 0.3 = 0.2。角值 0.3 在中间两项中被减了两次，所以要加回一次。",
  ),
  "the-rule-of-the-lazy-statistician-for-two-random-variables#expected-maximum-minimum-and-distance-of-two-uniforms": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 3, 1], 6, 6)
        .path(
          [
            [0, 0],
            [3, 0],
            [3, 3],
            [0, 3],
            [0, 0],
          ],
          "result",
        )
        .path(
          [
            [0, 0],
            [3, 3],
          ],
          undefined,
          true,
        )
        .say(2, 0.8, "max = x", "n")
        .say(1, 1.9, "max = y", "n")
        .marks(),
      seg([9, 2], [15, 2]),
      ...[0, 1, 2, 3].flatMap((k): Mark[] => [seg([9 + 2 * k, 1.85], [9 + 2 * k, 2.15]), note([9 + 2 * k, 1.85], String(k), "s")]),
      ...dotAt([11, 2], undefined, "n", "action"),
      note([10.2, 2.2], "E[min] = 1", "n"),
      ...dotAt([13, 2], undefined, "n", "action"),
      note([13.8, 2.2], "E[max] = 2", "n"),
    ],
    "For example, a = 3. The diagonal splits the square of (x, y) into two triangles: max(X, Y) is x on one and y on the other. Integrating gives E[min] = a/3 = 1 and E[max] = 2a/3 = 2, so the two points cut [0, 3] into three parts of expected length 1, and E|X − Y| = 1.",
    "例如，a = 3。对角线把 (x, y) 的正方形分成两个三角形：max(X, Y) 在一个上等于 x，在另一个上等于 y。积分得 E[min] = a/3 = 1，E[max] = 2a/3 = 2，所以两点把 [0, 3] 分成期望长度都为 1 的三段，且 E|X − Y| = 1。",
  ),
  "the-correlation-coefficient-for-two-random-variables#the-correlation-from-a-scatter-plot": (() => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8];
    const shallow = [1.1, 1.3, 1.4, 1.6, 1.8, 1.9, 2.1, 2.3];
    const steep = [1, 4, 2, 6, 3, 8, 5, 7];
    const scatter = (dx: number, ys: readonly number[], r: string): Mark[] => {
      const p = pane(dx, [0, 9, 3], [0, 9, 3], 5, 5);
      for (const [i, x] of xs.entries()) p.dot(x, ys[i] as number);
      return p.say(4.5, 9, r, "n").marks();
    };
    return drawing(
      [...scatter(0, shallow, "r ≈ 0.998"), ...scatter(8, steep, "r ≈ 0.74")],
      "For example, two clouds of eight points. On the left a shallow but tight cloud has r ≈ 0.998. On the right a steeper but looser cloud has r ≈ 0.74. Correlation measures tightness around a line, not how steep the line is.",
      "例如，两组各八个点。左图的点云平缓但紧密，r ≈ 0.998。右图的点云更陡但较松散，r ≈ 0.74。相关系数衡量点围绕直线的紧密程度，而不是直线的陡峭程度。",
    );
  })(),
  "maximum-likelihood-estimation#successes-from-the-peak-of-a-likelihood": drawing(
    pane(0, [0, 1, 0.5], [0, 0.003, 0.003], 7, 5, "p", "L")
      .f((p) => p ** 7 * (1 - p) ** 3, 0, 1, "result")
      .path(
        [
          [0.7, 0],
          [0.7, 0.7 ** 7 * 0.3 ** 3],
        ],
        undefined,
        true,
      )
      .dot(0.7, 0.7 ** 7 * 0.3 ** 3, "p̂ = 0.7", "ne")
      .say(0.1, 0.0026, "10 · 0.7 = 7", "e")
      .marks(),
    "For example, n = 10 trials. The graph of L(p) peaks at p = 0.7, so the number of successes is 10 · 0.7 = 7, and L(p) = p⁷(1 − p)³.",
    "例如，n = 10 次试验。L(p) 的图像在 p = 0.7 处达到峰值，所以成功次数为 10 · 0.7 = 7，且 L(p) = p⁷(1 − p)³。",
  ),
};
