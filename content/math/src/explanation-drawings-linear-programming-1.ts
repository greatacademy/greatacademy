// Drawings of the explanations of Linear Programming: feasible regions, level lines, networks and flows.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, pane } from "./explanation-drawings-calculus-kit.ts";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";
import { net, table, type Vertices } from "./explanation-drawings-structures-kit.ts";

// The region x, y ≥ 0, x + y ≤ 4, x + 2y ≤ 6 and its corners; a pane unit is a drawing unit, so raw points fit.
const top = (x: number) => Math.min(4 - x, (6 - x) / 2);
const outline: Point[] = [
  [0, 0],
  [4, 0],
  [2, 2],
  [0, 3],
  [0, 0],
];
const region = (X = 6, Y = 5) => pane(0, [0, X, 1], [0, Y, 1], X, Y).under(top, 0, 4, "action").path(outline);

const polygon: Point[] = [
  [0, 0],
  [4, 0],
  [5, 2],
  [3, 4],
  [0, 3],
];

// An arc that stays dashed up to an arrowhead at its end.
const dashedArc = (a: Point, b: Point): Mark[] => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const at = (d: number): Point => [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l];
  return [seg(a, at(l - 0.5), undefined, true), ...head(at(l - 0.5), at(l - 0.14))];
};

/** linearProgrammingDrawings1 draws the explanations of Linear Programming, by knowledge point. */
export const linearProgrammingDrawings1: Readonly<Record<string, Figure>> = {
  "the-graphical-method-for-linear-programs#finding-a-corner-point": drawing(
    region()
      .path([
        [0, 3],
        [6, 0],
      ])
      .path([
        [0, 4],
        [4, 0],
      ])
      .dot(0, 0)
      .dot(4, 0)
      .dot(0, 3)
      .dot(2, 2, "(2, 2)", "ne", "result")
      .say(0.3, 4, "x + y = 4", "e")
      .say(4.5, 1, "x + 2y = 6", "e")
      .marks(),
    "For example, x + y ≤ 4 and x + 2y ≤ 6 with x, y ≥ 0. The feasible region is the shaded polygon, with corners (0, 0), (4, 0), (2, 2) and (0, 3). The corner (2, 2) is where the two lines meet: subtracting the equations gives y = 2, and then x = 2.",
    "例如，x + y ≤ 4，x + 2y ≤ 6，x, y ≥ 0。可行域是阴影多边形，角点为 (0, 0)、(4, 0)、(2, 2)、(0, 3)。角点 (2, 2) 是两条直线的交点：两个方程相减得 y = 2，于是 x = 2。",
  ),
  "the-graphical-method-for-linear-programs#the-best-corner": drawing(
    region(6, 6)
      .path(
        [
          [4, 0],
          [0, 6],
        ],
        "result",
        true,
      )
      .dot(0, 0, "0", "ne")
      .dot(4, 0, "12", "ne", "result")
      .dot(2, 2, "10", "w")
      .dot(0, 3, "6", "ne")
      .say(1.6, 3.7, "3x + 2y = 12", "e")
      .marks(),
    "For example, maximize 3x + 2y on the shaded region. Its values at the corners (0, 0), (4, 0), (2, 2) and (0, 3) are 0, 12, 10 and 6, as marked. The best is 12 at (4, 0), and the dashed level line 3x + 2y = 12 touches the region only there.",
    "例如，在阴影区域上最大化 3x + 2y。它在角点 (0, 0)、(4, 0)、(2, 2)、(0, 3) 的值依次为 0、12、10、6，如图所标。最好的是 (4, 0) 处的 12，虚线等值线 3x + 2y = 12 只在那里接触区域。",
  ),
  "the-graphical-method-for-linear-programs#the-slope-of-the-objective-line": drawing(
    region()
      .path(
        [
          [3, 0],
          [0, 2],
        ],
        undefined,
        true,
      )
      .path(
        [
          [5, 0],
          [0, 10 / 3],
        ],
        "result",
        true,
      )
      .dot(2, 2, "(2, 2)", "ne", "result")
      .say(1.5, 0.5, "6", "n")
      .say(4.1, 0.75, "10", "e")
      .say(3, 4.1, "−1 < −2/3 < −1/2", "s")
      .marks(),
    "For example, the objective 2x + 3y on the shaded region. Its level lines, dashed for the values 6 and 10, have slope −2/3, between the slopes −1 and −1/2 of the two edges at (2, 2). So sliding the line outward, it leaves the region last at (2, 2), with value 10.",
    "例如，阴影区域上的目标 2x + 3y。它的等值线（虚线，值为 6 和 10）斜率为 −2/3，介于 (2, 2) 处两条边的斜率 −1 和 −1/2 之间。所以把直线向外平移，它最后在 (2, 2) 离开区域，值为 10。",
  ),
  "the-graphical-method-for-linear-programs#the-maximum-on-a-drawn-polygon": drawing(
    [
      { kind: "shade", points: polygon, tone: "action" },
      ...pane(0, [0, 7, 1], [0, 5, 1], 7, 5)
        .path([...polygon, [0, 0]])
        .dot(0, 0, "0", "ne")
        .dot(4, 0, "(4, 0) → 4", "nw")
        .dot(5, 2, "(5, 2) → 9", "e")
        .dot(3, 4, "(3, 4) → 11", "ne", "result")
        .dot(0, 3)
        .say(0.25, 2.55, "(0, 3) → 6", "e")
        .marks(),
    ],
    "For example, the objective x + 2y on a drawn polygon. Each corner is read from the drawing and substituted: (0, 0) gives 0, (4, 0) gives 4, (5, 2) gives 9, (3, 4) gives 11 and (0, 3) gives 6. The maximum is 11 at (3, 4).",
    "例如，图中多边形上的目标 x + 2y。从图上读出每个角点并代入：(0, 0) 得 0，(4, 0) 得 4，(5, 2) 得 9，(3, 4) 得 11，(0, 3) 得 6。最大值是 (3, 4) 处的 11。",
  ),
  "basic-feasible-solutions#computing-a-basic-solution": drawing(
    region(7, 5)
      .path([
        [0, 3],
        [6, 0],
      ])
      .path([
        [0, 4],
        [4, 0],
      ])
      .dot(2, 2, "(2, 2)", "ne", "result")
      .dot(4, 0, undefined, "n", "result")
      .dot(0, 3, undefined, "n", "result")
      .open(6, 0)
      .say(5.5, 0.55, "s₁ = −2", "e")
      .open(0, 4, "s₂ = −2", "e")
      .marks(),
    "For example, x + y + s₁ = 4 and x + 2y + s₂ = 6. Setting x and s₁ to zero gives y = 4 and s₂ = −2, and setting y and s₂ to zero gives x = 6 and s₁ = −2: these hollow points are basic but lie outside the polygon. Setting s₁ and s₂ to zero gives (2, 2), where every value is nonnegative, so it is a corner.",
    "例如，x + y + s₁ = 4，x + 2y + s₂ = 6。令 x 和 s₁ 为零得 y = 4，s₂ = −2；令 y 和 s₂ 为零得 x = 6，s₁ = −2：这两个空心点是基本解，但在多边形之外。令 s₁ 和 s₂ 为零得 (2, 2)，所有值都非负，所以它是角点。",
  ),
  "alternative-optimal-solutions#an-objective-parallel-to-an-edge": drawing(
    region()
      .path(
        [
          [2, 2],
          [4, 0],
        ],
        "result",
      )
      .path(
        [
          [2, 0],
          [0, 2],
        ],
        undefined,
        true,
      )
      .dot(2, 2, "8", "ne", "result")
      .dot(4, 0, "8", "ne", "result")
      .say(1, 1, "4", "n")
      .say(3.6, 3.9, "(c, d) = 2(a, b)", "s")
      .marks(),
    "For example, the objective 2x + 2y and the edge x + y = 4, with (c, d) = (2, 2) = 2(a, b) for (a, b) = (1, 1). The level lines, one dashed with value 4, are parallel to that edge. It is the last part reached, so its corners (2, 2) and (4, 0) both give 8, and so does every point between them.",
    "例如，目标 2x + 2y 和边 x + y = 4，(c, d) = (2, 2) = 2(a, b)，其中 (a, b) = (1, 1)。等值线（其中一条虚线的值为 4）与这条边平行。这条边最后被到达，所以它的角点 (2, 2) 和 (4, 0) 都得 8，它们之间的每个点也一样。",
  ),
  "alternative-optimal-solutions#the-objective-with-many-optimal-points": drawing(
    region()
      .path(
        [
          [0, 3],
          [2, 2],
        ],
        "result",
      )
      .path(
        [
          [2, 0],
          [0, 1],
        ],
        undefined,
        true,
      )
      .dot(0, 3, "12", "ne", "result")
      .dot(2, 2, "12", "ne", "result")
      .dot(4, 0, "8", "ne")
      .say(1, 0.5, "4", "n")
      .say(3.6, 3.9, "2 : 4 = 1 : 2", "s")
      .marks(),
    "For example, the objective 2x + 4y, whose coefficients have the ratio 2 : 4 = 1 : 2 of the edge x + 2y = 6. Its dashed level line for the value 4 is parallel to that edge. The edge faces the direction of improvement, so all of it from (0, 3) to (2, 2) has the best value 12, against 8 at (4, 0).",
    "例如，目标 2x + 4y，系数之比 2 : 4 = 1 : 2 与边 x + 2y = 6 相同。值为 4 的虚线等值线与这条边平行。这条边朝向改进的方向，所以从 (0, 3) 到 (2, 2) 的整条边都取最优值 12，而 (4, 0) 处只有 8。",
  ),
  "infeasible-programs-and-farkas-lemma#half-planes-that-cannot-all-hold": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
        tone: "action",
      },
      {
        kind: "shade",
        points: [
          [3, 0],
          [5, 0],
          [5, 5],
          [0, 5],
          [0, 3],
        ],
        tone: "result",
      },
      ...pane(0, [0, 5, 1], [0, 5, 1], 5, 5)
        .path(
          [
            [1, 0],
            [0, 1],
          ],
          "action",
        )
        .path(
          [
            [3, 0],
            [0, 3],
          ],
          "result",
        )
        .say(1, 0.85, "x + y ≤ 1", "n")
        .say(3, 3, "x + y ≥ 3", "n")
        .say(2.5, -0.7, "(x + y) − (x + y) ≤ 1 − 3,  0 ≤ −2", "s")
        .marks(),
    ],
    "For example, x + y ≤ 1 and x + y ≥ 3. The boundaries are parallel and the shading faces away, so no point lies in both half-planes. Adding the first to minus the second gives the Farkas certificate 0 ≤ −2, which is false.",
    "例如，x + y ≤ 1，x + y ≥ 3。两条边界平行，阴影方向相背，所以没有点同时在两个半平面中。把第一式与第二式的相反式相加，得到法卡斯证书 0 ≤ −2，这是假的。",
  ),
  "shortest-paths-as-linear-programs#the-potential-of-a-node": (() => {
    const v: Vertices = { s: [0, 1.5], a: [2.8, 3], b: [2.8, 0], t: [5.6, 1.5] };
    return drawing(
      net(v, ["*s-a:2", "s-b:5", "*a-b:1:e", "a-t:6", "*b-t:2"], {
        arcs: true,
        names: { s: "d(s) = 0", a: "d(a) = 2", b: "d(b) = 3", t: "d(t) = 5" },
        dirs: { s: "w", a: "n", b: "s", t: "e" },
      }),
      "For example, arcs s→a of length 2, s→b of 5, a→b of 1, a→t of 6 and b→t of 2, with the potentials marked. Each arc satisfies its limit, and the highlighted arcs hold it exactly: 2 = 0 + 2, 3 = 2 + 1 and 5 = 3 + 2. They hold the sink down at 5, its true distance from s.",
      "例如，弧 s→a 长 2，s→b 长 5，a→b 长 1，a→t 长 6，b→t 长 2，势如图所标。每条弧都满足它的限制，突出显示的弧恰好取等：2 = 0 + 2，3 = 2 + 1，5 = 3 + 2。它们把汇点压在 5，也就是它到 s 的真实距离。",
    );
  })(),
  "minimum-cost-flow#the-cost-of-a-flow": (() => {
    const v: Vertices = { s: [0, 1.5], a: [2.8, 3], b: [2.8, 0], t: [5.6, 1.5] };
    return drawing(
      [
        ...dashedArc(v.a as Point, v.b as Point),
        note([2.8, 1.5], "0 · 9", "e"),
        ...net(v, ["s-a:2 · 3", "s-b:1 · 1", "a-t:2 · 1", "b-t:1 · 4"], { arcs: true, dirs: { s: "w", a: "n", b: "s", t: "e" } }),
        note([2.8, -0.7], "6 + 1 + 2 + 4 = 13", "s"),
      ],
      "For example, each arc is marked flow · cost. The arcs in use give 2 · 3 = 6, 1 · 1 = 1, 2 · 1 = 2 and 1 · 4 = 4, for a total cost of 13. The dashed arc from a to b costs 9 per unit but carries no flow, so it adds nothing.",
      "例如，每条弧标为 流量 · 成本。使用中的弧贡献 2 · 3 = 6，1 · 1 = 1，2 · 1 = 2，1 · 4 = 4，总成本为 13。从 a 到 b 的虚线弧每单位成本为 9，但没有流量，所以不增加成本。",
    );
  })(),
  "polyhedra-and-extreme-points#counting-extreme-points-in-a-drawing": drawing(
    [
      { kind: "shade", points: polygon, tone: "action" },
      { kind: "polygon", points: polygon },
      ...dotAt([0, 0], "1", "sw", "result"),
      ...dotAt([4, 0], "2", "se", "result"),
      ...dotAt([5, 2], "3", "e", "result"),
      ...dotAt([3, 4], "4", "n", "result"),
      ...dotAt([0, 3], "5", "w", "result"),
      ring(0.12, [4, 3]),
    ],
    "For example, a polygon with its 5 corners numbered. These are its extreme points. The hollow point on the upper right edge is not extreme, since it is the midpoint of the segment between corners 3 and 4.",
    "例如，一个多边形，5 个角点已编号。它们就是极点。右上边上的空心点不是极点，因为它是角点 3 和 4 之间线段的中点。",
  ),
  "the-simplex-method-with-bounded-variables#reflecting-an-upper-bound": drawing(
    [
      ...head([-0.5, 0], [6.2, 0]),
      seg([3, 0], [5, 0], "result"),
      ...[0, 1, 2, 3, 4, 5].map((t) => seg([t, -0.08], [t, 0.08])),
      ...[0, 1, 2, 4].map((t) => note([t, -0.05], String(t), "s")),
      ...dotAt([3, 0], "x = 3", "s", "result"),
      ...dotAt([5, 0], "u = 5", "s", "result"),
      note([4, 0.1], "x′ = u − x = 2", "n"),
    ],
    "For example, u = 5 and x = 3. Then x′ = u − x = 2 is the highlighted distance below the bound. It is nonnegative, and it is zero exactly when x sits at its upper bound.",
    "例如，u = 5，x = 3。那么 x′ = u − x = 2 就是突出显示的、到上界的距离。它非负，并且恰好在 x 位于上界时为零。",
  ),
  "the-network-simplex-method#potentials-and-reduced-costs": (() => {
    const v: Vertices = { "1": [0, 0], "2": [2.6, 2.4], "3": [5.2, 0] };
    return drawing(
      [
        ...dashedArc(v["1"] as Point, v["3"] as Point),
        note([2.6, 0], "c = 1", "n"),
        ...net(v, ["*1-2:c = 2:nw", "*2-3:c = 1:ne"], {
          arcs: true,
          names: { "1": "π₁ = 0", "2": "π₂ = 2", "3": "π₃ = 3" },
          dirs: { "1": "s", "2": "n", "3": "s" },
        }),
        note([2.6, -0.8], "1 + 0 − 3 = −2", "s"),
      ],
      "For example, the tree arcs 1→2 with cost 2 and 2→3 with cost 1, highlighted, give the potentials 0, 2 = 0 + 2 and 3 = 2 + 1. The dashed nontree arc 1→3 with cost 1 has reduced cost 1 + 0 − 3 = −2. That is negative, so bringing it in can improve the plan.",
      "例如，突出显示的树弧 1→2（成本 2）和 2→3（成本 1）给出势 0、2 = 0 + 2、3 = 2 + 1。虚线的非树弧 1→3（成本 1）的既约成本为 1 + 0 − 3 = −2。它是负的，所以引入它可以改进方案。",
    );
  })(),
  "the-network-simplex-method#pushing-around-a-cycle": (() => {
    const v: Vertices = { A: [0, 2.8], B: [3.6, 2.8], C: [3.6, 0], D: [0, 0] };
    return drawing(
      [
        ...net(v, ["*A-B:0 + 2:n", "B-C:4 + 2:e", "D-C:3 − 2:s", "*A-D:2 − 2:w"], {
          arcs: true,
          dirs: { A: "nw", B: "ne", C: "se", D: "sw" },
        }),
        note([1.8, -0.9], "min(3, 2) = 2", "s"),
      ],
      "For example, the entering arc A→B closes the cycle, with B→C carrying 4 forward. D→C with flow 3 and A→D with flow 2 run backward. The push is limited by the smallest backward flow, min(3, 2) = 2, so A→D drops to 0 and leaves the tree. The two highlighted arcs are the one entering and the one leaving.",
      "例如，进入弧 A→B 闭合了圈，B→C 向前运载 4。流量 3 的 D→C 和流量 2 的 A→D 方向相反。推送量受最小反向流量限制，min(3, 2) = 2，所以 A→D 降到 0 并离开树。突出显示的两条弧分别是进入的和离开的。",
    );
  })(),
  "total-unimodularity#recognizing-network-matrices": (() => {
    const v: Vertices = { "1": [0, 0], "2": [2.4, 2.2], "3": [4.8, 0] };
    return drawing(
      [
        ...net(v, ["1-2:a:nw", "2-3:b:ne", "1-3:c:s"], { arcs: true, dirs: { "1": "w", "2": "n", "3": "e" } }),
        ...table(
          [
            ["1", "0", "1"],
            ["−1", "1", "0"],
            ["0", "−1", "−1"],
          ],
          { at: [6.8, 2.2], cell: 0.8, rows: ["1", "2", "3"], cols: ["a", "b", "c"], drop: 0.3 },
        ),
      ],
      "For example, the arcs a from 1 to 2, b from 2 to 3 and c from 1 to 3, and the node-arc incidence matrix with a row for each node. Each column has a 1 at the node where its arc starts and a −1 where it ends, and the rest are 0. Any matrix of this form is totally unimodular.",
      "例如，弧 a 从 1 到 2，b 从 2 到 3，c 从 1 到 3，以及每个结点一行的结点-弧关联矩阵。每一列在弧的起点处为 1，在终点处为 −1，其余为 0。任何这种形式的矩阵都是全单模的。",
    );
  })(),
};
