// Drawings of the explanations of Discrete Mathematics: graphs, degrees, walks and connectivity.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";
import { around, bow, complete, loop, missing, net, sides, type Vertices } from "./explanation-drawings-structures-kit.ts";

const triangleTail = (dx = 0): Vertices => ({ A: [dx, 2], B: [dx, 0], C: [dx + 1.8, 1], D: [dx + 3.6, 1] });
const six = (c: Point = [0, 0]): Vertices => around(["1", "2", "3", "4", "5", "6"], 2, c);
const gEdges = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-1", "1-3"];
const gHere = ["*1-2", "*2-3", "3-4", "4-5", "5-6", "6-1", "1-3"];
const cube = (c: Point = [0, 0], a = 2.4, b = 1): Vertices => ({
  p: [c[0] - a, c[1] + a],
  q: [c[0] + a, c[1] + a],
  r: [c[0] + a, c[1] - a],
  s: [c[0] - a, c[1] - a],
  t: [c[0] - b, c[1] + b],
  u: [c[0] + b, c[1] + b],
  v: [c[0] + b, c[1] - b],
  w: [c[0] - b, c[1] - b],
});
const cubeEdges = ["p-q", "q-r", "r-s", "s-p", "t-u", "u-v", "v-w", "w-t", "p-t", "q-u", "r-v", "s-w"];

const nodes = (prefix: string, n: number): string[] => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

/** discreteDrawings1 draws the first explanations of Discrete Mathematics, by knowledge point. */
export const discreteDrawings1: Readonly<Record<string, Figure>> = {
  "second-order-homogeneous-recurrence-relations-with-complex-roots#far-terms-of-a-periodic-recurrence": (() => {
    const names = ["r⁰", "r¹", "r²", "r³", "r⁴", "r⁵"];
    const dirs = ["e", "ne", "nw", "w", "sw", "se"] as const;
    const at = (k: number): Point => [2 * Math.cos((k * Math.PI) / 3), 2 * Math.sin((k * Math.PI) / 3)];
    return drawing(
      [ring(2), ...names.flatMap((n, k) => dotAt(at(k), n, dirs[k], "result")), note([0, -0.2], "r⁶ = r⁰", "n")],
      "For example, a root r at angle 60° on the unit circle. Its powers turn around the circle and r⁶ = r⁰, so the sequence repeats with period 6. A term with a large index is found by reducing the index modulo 6.",
      "例如，单位圆上辐角为 60° 的根 r。它的幂绕圆转动，且 r⁶ = r⁰，所以序列以 6 为周期重复。下标很大的项可以把下标对 6 取余得到。",
    );
  })(),
  "introduction-to-graphs#the-maximum-number-of-edges": drawing(
    [...net(around(nodes("v", 10), 2.6), complete(nodes("v", 10)), { plain: true }), note([0, -3], "10 · 9/2 = 45", "s")],
    "The complete graph on 10 vertices joins every pair exactly once, which gives the most edges a simple graph on 10 vertices can have: 10 · 9/2 = 45.",
    "10 个顶点的完全图把每一对顶点恰好连接一次，这就是 10 个顶点的简单图能有的最多边数：10 · 9/2 = 45。",
  ),
  "walks-trails-paths-and-distances#classifying-walks": drawing(
    net(triangleTail(), ["*A-B", "*B-C", "A-C", "*C-D"], { dirs: { C: "s" } }),
    "A triangle ABC with a pendant edge CD. The highlighted route A, B, C, D is a path. A, B, C, A repeats a vertex but no edge, so it is a trail. C, D, C uses CD twice, so it is only a walk. There is no edge AD, so A, D is not a walk.",
    "三角形 ABC 带一条悬挂边 CD。突出显示的路线 A, B, C, D 是路径。A, B, C, A 重复顶点但不重复边，所以是迹。C, D, C 两次使用 CD，所以只是途径。没有边 AD，所以 A, D 不是途径。",
  ),
  "walks-paths-and-distances-in-directed-graphs#directed-distances": drawing(
    [
      ...net({ A: [0, 0], B: [3, 0], C: [1.5, 2.6] }, ["A-B", "B-C", "C-A"], { arcs: true }),
      note([1.5, -0.6], "d(A, C) = 2,  d(C, A) = 1", "s"),
    ],
    "Arcs from A to B, B to C and C to A. Following the arrows, A reaches C in 2 steps, through B, but C reaches A in 1 step: d(A, C) = 2 and d(C, A) = 1.",
    "弧从 A 到 B、从 B 到 C、从 C 到 A。沿箭头走，A 经过 B 用 2 步到达 C，而 C 用 1 步到达 A：d(A, C) = 2，d(C, A) = 1。",
  ),
  "the-degree-of-a-vertex#degrees-in-simple-graphs": drawing(
    [
      ...net(triangleTail(), ["A-B", "*B-C", "*A-C", "*C-D"], { tones: { C: "result" }, dirs: { C: "s" } }),
      note([1.8, -0.5], "deg(C) = 3", "s"),
    ],
    "The graph with edges AB, AC, BC and CD. The three highlighted edges AC, BC and CD meet C, so deg(C) = 3, the same as its number of neighbors.",
    "边为 AB、AC、BC、CD 的图。突出显示的三条边 AC、BC、CD 与 C 相接，所以 deg(C) = 3，等于它的邻点数。",
  ),
  "the-degree-of-a-vertex#degrees-with-loops-and-multiple-edges": drawing(
    [
      loop([0, 0], 180, 0.55, "result"),
      ...bow([0, 0], [3, 0], 0.4, "result", false),
      ...bow([0, 0], [3, 0], -0.4, "result", false),
      seg([3, 0], [6, 0]),
      ...dotAt([0, 0], "A", "ne", "result"),
      ...dotAt([3, 0], "B", "n"),
      ...dotAt([6, 0], "C", "n"),
      note([2, -0.8], "deg(A) = 2 + 2 = 4", "s"),
    ],
    "The multigraph with edges AA, AB, AB and BC. A meets the loop twice and each copy of AB once, so deg(A) = 2 + 2 = 4.",
    "边为 AA、AB、AB、BC 的多重图。A 与环相接两次，与每条 AB 各相接一次，所以 deg(A) = 2 + 2 = 4。",
  ),
  "the-handshaking-lemma#edges-from-a-degree-sequence": drawing(
    [
      ...net(around(["a", "b", "e", "d", "c"], 2), ["a-b", "a-c", "a-d", "b-d", "b-e", "c-e"], {
        names: { a: "3", b: "3", c: "2", d: "2", e: "2" },
      }),
      note([0, -2.5], "(3 + 3 + 2 + 2 + 2)/2 = 6", "s"),
    ],
    "A graph whose vertices are labeled by their degrees 3, 3, 2, 2, 2. Every edge adds one to two degrees, so the number of edges is (3 + 3 + 2 + 2 + 2)/2 = 6, the number drawn.",
    "每个顶点标出其度数 3, 3, 2, 2, 2 的图。每条边使两个度数各加一，所以边数为 (3 + 3 + 2 + 2 + 2)/2 = 6，正是图中的边数。",
  ),
  "the-handshaking-lemma#counting-vertices-with-the-handshaking-lemma": drawing(
    [
      ...net(around(nodes("v", 8), 2.2), ["v1-v2", "v2-v3", "v3-v4", "v4-v5", "v5-v6", "v6-v7", "v7-v8", "v8-v1", "v1-v5", "v3-v7"], {
        names: { v1: "3", v2: "2", v3: "3", v4: "2", v5: "3", v6: "2", v7: "3", v8: "2" },
        tones: { v1: "result", v3: "result", v5: "result", v7: "result" },
      }),
      note([0, -2.8], "4 · 3 + 2 · 4 = 20 = 2 · 10", "s"),
    ],
    "One such graph, each vertex labeled by its degree. It has 10 edges, 4 vertices of degree 3 and k = 4 vertices of degree 2: 4 · 3 + 2 · 4 = 20, twice the number of edges.",
    "这样的一个图，每个顶点标出其度数。它有 10 条边、4 个 3 度顶点和 k = 4 个 2 度顶点：4 · 3 + 2 · 4 = 20，是边数的两倍。",
  ),
  "subgraphs-and-graph-complements#edges-and-degrees-in-the-complement": drawing(
    [
      ...net(six(), gHere, { tones: { "2": "result" } }),
      note([0, -2.6], "G: 7", "s"),
      ...net(
        six([7, 0]),
        [...missing(["1", "2", "3", "4", "5", "6"], gEdges)].map((e) => (e.startsWith("2-") ? `*${e}` : e)),
        {
          tones: { "2": "result" },
        },
      ),
      note([7, -2.6], "Ḡ: 15 − 7 = 8", "s"),
    ],
    "A graph G with 6 vertices and 7 edges, and its complement Ḡ, which has 15 − 7 = 8 edges. Vertex 2 has degree 2 in G and degree 5 − 2 = 3 in Ḡ: the highlighted edges go to exactly the vertices it was not joined to.",
    "有 6 个顶点和 7 条边的图 G，及其补图 Ḡ，后者有 15 − 7 = 8 条边。顶点 2 在 G 中度数为 2，在 Ḡ 中度数为 5 − 2 = 3：突出显示的边恰好连向原来没有与它相连的顶点。",
  ),
  "subgraphs-and-graph-complements#the-edges-of-the-complement-of-a-regular-graph": drawing(
    [
      ...net(around(nodes("v", 5), 2), ["v1-v2", "v2-v3", "v3-v4", "v4-v5", "v5-v1"], { plain: true }),
      note([0, -2.3], "r = 2", "s"),
      ...net(around(nodes("v", 5), 2, [6.5, 0]), ["v1-v3", "v3-v5", "v5-v2", "v2-v4", "v4-v1"], { plain: true }),
      note([6.5, -2.3], "5 − 1 − 2 = 2", "s"),
    ],
    "For example, the 2-regular cycle on 5 vertices and its complement, the star-shaped cycle. A vertex of degree r = 2 has degree 5 − 1 − 2 = 2 in the complement, so the complement is regular too. Each has 5 edges, and 5 + 5 = 10 = C(5, 2).",
    "例如，5 个顶点上 2-正则的圈及其补图，即星形的圈。度数 r = 2 的顶点在补图中的度数为 5 − 1 − 2 = 2，所以补图也是正则图。两者各有 5 条边，且 5 + 5 = 10 = C(5, 2)。",
  ),
  "complete-and-bipartite-graphs#edges-of-complete-and-complete-bipartite-graphs": drawing(
    [
      ...net(around(nodes("v", 7), 2.3), complete(nodes("v", 7)), { plain: true }),
      note([0, -2.7], "K₇: 7 · 6/2 = 21", "s"),
      ...net(
        sides(nodes("a", 3), nodes("b", 5), 7.5, 3.6),
        nodes("a", 3).flatMap((a) => nodes("b", 5).map((b) => `${a}-${b}`)),
        { plain: true },
      ),
      note([7.5, -0.9], "K₃,₅: 3 · 5 = 15", "s"),
    ],
    "On the left K₇, in which every pair of the 7 vertices is joined: 7 · 6/2 = 21 edges. On the right K₃,₅, in which each of the 3 vertices on one side is joined to each of the 5 on the other: 3 · 5 = 15 edges.",
    "左图是 K₇，7 个顶点中每一对都相连：7 · 6/2 = 21 条边。右图是 K₃,₅，一侧 3 个顶点中的每个都与另一侧 5 个顶点中的每个相连：3 · 5 = 15 条边。",
  ),
  "complete-and-bipartite-graphs#recognizing-bipartite-graphs": drawing(
    [
      ...net(around(nodes("v", 6), 2), ["v1-v2", "v2-v3", "v3-v4", "v4-v5", "v5-v6", "v6-v1"], {
        names: { v1: "a", v2: "b", v3: "a", v4: "b", v5: "a", v6: "b" },
        tones: { v2: "action", v4: "action", v6: "action", v1: "result", v3: "result", v5: "result" },
      }),
      note([0, -2.7], "✓", "s"),
      ...net(around(nodes("v", 5), 2, [6.5, 0]), ["v1-v2", "v2-v3", "v3-v4", "v4-v5", "*v5-v1"], {
        names: { v1: "a", v2: "b", v3: "a", v4: "b", v5: "a" },
        tones: { v2: "action", v4: "action", v1: "result", v3: "result", v5: "result" },
      }),
      note([6.5, -2.7], "✗", "s"),
    ],
    "Give a vertex one mark, its neighbors the other, and so on. On the 6-cycle the marks a and b alternate with no clash, so the graph is bipartite. On the 5-cycle the highlighted edge joins two vertices both marked a: an odd cycle, so the graph is not bipartite.",
    "给一个顶点一种标记，它的邻点另一种标记，依此类推。在 6 圈上 a 和 b 交替，没有冲突，所以图是二部图。在 5 圈上，突出显示的边连接两个都标为 a 的顶点：这是奇圈，所以图不是二部图。",
  ),
  "complete-and-bipartite-graphs#the-most-edges-of-a-bipartite-graph": drawing(
    [
      ...net(
        sides(["a", "b", "c"], ["p", "q", "r"], 0),
        ["a", "b", "c"].flatMap((x) => ["p", "q", "r"].map((y) => `${x}-${y}`)),
        {
          plain: true,
        },
      ),
      note([0, -0.8], "3 · 3 = 9", "s"),
      ...net(
        sides(["a", "b"], ["p", "q", "r", "s"], 6.5),
        ["a", "b"].flatMap((x) => ["p", "q", "r", "s"].map((y) => `${x}-${y}`)),
        { plain: true },
      ),
      note([6.5, -0.8], "2 · 4 = 8", "s"),
    ],
    "For example, n = 6. Parts of sizes 3 and 3 allow 3 · 3 = 9 edges, while parts of sizes 2 and 4 allow only 2 · 4 = 8. The equal split reaches the bound ⌊36/4⌋ = 9.",
    "例如，n = 6。大小为 3 和 3 的两部分最多有 3 · 3 = 9 条边，而大小为 2 和 4 的两部分只有 2 · 4 = 8 条边。均分时达到上界 ⌊36/4⌋ = 9。",
  ),
  "regular-graphs#existence-of-regular-graphs": drawing(
    [...net(cube(), cubeEdges, { plain: true }), note([0, -2.8], "n = 8,  r = 3,  8 · 3 = 24", "s")],
    "A 3-regular simple graph on 8 vertices: the degrees add to 8 · 3 = 24, which is even. On 7 vertices the sum 7 · 3 = 21 would be odd, so no such graph exists.",
    "8 个顶点上的一个 3-正则简单图：度数之和为 8 · 3 = 24，是偶数。在 7 个顶点上，和 7 · 3 = 21 是奇数，所以这样的图不存在。",
  ),
  "planar-graphs#edge-bounds-for-planar-graphs": drawing(
    [...net(around(nodes("v", 5), 2.2), complete(nodes("v", 5)), { plain: true }), note([0, -2.5], "10 > 3 · 5 − 6 = 9", "s")],
    "K₅, drawn with crossings. It has 10 edges, more than the bound 3 · 5 − 6 = 9 for a simple planar graph on 5 vertices, so it cannot be drawn without crossings.",
    "K₅，画出来有交叉。它有 10 条边，超过 5 个顶点的简单平面图的上界 3 · 5 − 6 = 9，所以不可能画成没有交叉。",
  ),
  "planar-graphs#faces-of-a-regular-planar-graph": drawing(
    [...net(cube(), cubeEdges, { plain: true }), note([0, -2.8], "E = 8 · 3/2 = 12", "s"), note([0, -3.6], "F = 2 − 8 + 12 = 6", "s")],
    "For example, a 3-regular planar graph on 8 vertices. The handshaking lemma gives E = 8 · 3/2 = 12 and Euler's formula gives F = 2 − 8 + 12 = 6: the inner square, four outer quadrilaterals and the outer face.",
    "例如，8 个顶点上的 3-正则平面图。握手引理给出 E = 8 · 3/2 = 12，欧拉公式给出 F = 2 − 8 + 12 = 6：内部的正方形、四个外围四边形和外部的面。",
  ),
  "cycles-in-graphs#shortest-cycles": drawing(
    net({ A: [0, 2.4], B: [-2.2, 0], D: [0, 0], E: [2.2, 0], C: [0, -2.4] }, ["*A-B", "*B-C", "*C-D", "*D-A", "A-E", "E-C"]),
    "The graph with edges AB, BC, CD, DA, AE and EC. The highlighted cycle A, B, C, D, A has length 4, and so does A, B, C, E, A. Every edge joins one of A, C to one of B, D, E, so there is no triangle.",
    "边为 AB、BC、CD、DA、AE、EC 的图。突出显示的圈 A, B, C, D, A 长度为 4，A, B, C, E, A 也是。每条边都连接 A、C 之一与 B、D、E 之一，所以没有三角形。",
  ),
  "cycles-in-graphs#counting-cycles-in-complete-graphs": drawing(
    [
      ...net(
        around(nodes("v", 5), 2.2),
        [
          "*v1-v2",
          "*v2-v3",
          "*v3-v4",
          "*v4-v1",
          ...complete(nodes("v", 5))
            .filter((e) => !["v1-v2", "v2-v3", "v3-v4", "v1-v4"].includes(e))
            .map((e) => `~${e}`),
        ],
        { plain: true },
      ),
      note([0, -2.5], "5 · 4 · 3 · 2/8 = 15", "s"),
    ],
    "K₅ with one 4-cycle highlighted. This cycle arises from 4 starting points and 2 directions, so the 120 ordered choices of 4 vertices give 120/8 = 15 cycles.",
    "K₅ 中突出显示一个 4 圈。这个圈可以从 4 个起点、沿 2 个方向得到，所以 120 种有序选择 4 个顶点的方式给出 120/8 = 15 个圈。",
  ),
  "cycles-in-graphs#four-cycles-of-a-complete-bipartite-graph": drawing(
    [
      ...net(
        sides(["a", "b", "c"], ["p", "q", "r", "s"], 0, 3.2, 1.5),
        ["*a-p", "*p-b", "*b-q", "*q-a", "a-r", "a-s", "b-r", "b-s", "c-p", "c-q", "c-r", "c-s"],
        { plain: true },
      ),
      note([0, -0.8], "3 · 6 = 18", "s"),
    ],
    "For example, K₃,₄. A 4-cycle, highlighted, uses two vertices from each part. There are C(3, 2) = 3 ways to choose two from one part and C(4, 2) = 6 from the other, so there are 3 · 6 = 18 four-cycles.",
    "例如，K₃,₄。突出显示的 4 圈在每一部分各用两个顶点。一部分有 C(3, 2) = 3 种选法，另一部分有 C(4, 2) = 6 种选法，所以共有 3 · 6 = 18 个 4 圈。",
  ),
  "connected-graphs#counting-connected-components": drawing(
    [
      ...net({ A: [0, 1.4], B: [1.2, 0], C: [2.4, 1.4] }, ["A-B", "B-C"]),
      ...net({ D: [4, 0], E: [5, 1.4] }, ["D-E"]),
      ...dotAt([6.6, 0.7], "F", "n"),
    ],
    "The graph with vertices A to F and edges AB, BC and DE. It falls into three components: {A, B, C}, {D, E} and {F}. The isolated vertex is a component on its own.",
    "顶点为 A 到 F、边为 AB、BC、DE 的图。它分成三个连通分支：{A, B, C}、{D, E} 和 {F}。孤立顶点自成一个分支。",
  ),
  "connected-graphs#edge-bounds-for-connectivity": drawing(
    [
      ...net(around(nodes("v", 9), 2.4), complete(nodes("v", 9)), { plain: true }),
      ...dotAt([4, 0], undefined, "n", "result"),
      note([0, -2.8], "K₉: 9 · 8/2 = 36", "s"),
    ],
    "The disconnected simple graph on 10 vertices with the most edges: K₉ with one isolated vertex. It has 36 edges, so any simple graph on 10 vertices with more than 36 edges must be connected.",
    "10 个顶点的不连通简单图中边数最多的：K₉ 加一个孤立顶点。它有 36 条边，所以 10 个顶点上边数多于 36 的简单图一定连通。",
  ),
  "connected-graphs#the-most-components-for-a-given-number-of-edges": drawing(
    [
      ...net({ a: [0, 2], b: [2, 2], c: [2, 0], d: [0, 0] }, ["a-b", "b-c", "c-d", "d-a"], { plain: true }),
      ...dotAt([3.5, 1]),
      ...dotAt([4.8, 1]),
      ...dotAt([6.1, 1]),
      note([3, -0.6], "m = 4,  n = 7,  1 + 3 = 4", "s"),
    ],
    "For example, m = 4 edges and n = 7 vertices. The smallest group holding 4 edges has k = 4 vertices, since C(3, 2) = 3 is too few and C(4, 2) = 6 is enough. The group is one component and the other 3 vertices are isolated, which gives 1 + 3 = 4 components.",
    "例如，m = 4 条边，n = 7 个顶点。能容纳 4 条边的最小组有 k = 4 个顶点，因为 C(3, 2) = 3 不够，而 C(4, 2) = 6 足够。这一组是一个分支，其他 3 个顶点孤立，共 1 + 3 = 4 个分支。",
  ),
  "cut-vertices-and-cut-edges#counting-cut-vertices": drawing(
    net({ A: [0, 0], B: [2, 0], C: [4, 0], D: [6, 1.4], E: [6, -1.4] }, ["A-B", "B-C", "C-D", "D-E", "E-C"], {
      tones: { B: "result", C: "result" },
      dirs: { A: "n", B: "n", C: "n" },
    }),
    "The path A, B, C with the triangle CDE attached at C. Removing the highlighted vertices B or C disconnects the graph, so there are 2 cut vertices. Removing A, D or E does not.",
    "路径 A, B, C 在 C 处连接三角形 CDE。去掉突出显示的顶点 B 或 C 会使图不连通，所以有 2 个割点。去掉 A、D 或 E 则不会。",
  ),
  "cut-vertices-and-cut-edges#counting-cut-edges": drawing(
    net(triangleTail(), ["A-B", "B-C", "A-C", "*C-D"], { dirs: { C: "s" } }),
    "A triangle ABC with a pendant edge CD. The highlighted edge CD is a cut edge. AB, BC and CA lie on the triangle, so removing one of them leaves the graph connected.",
    "三角形 ABC 带悬挂边 CD。突出显示的边 CD 是割边。AB、BC、CA 在三角形上，所以去掉其中一条后图仍然连通。",
  ),
  "cut-vertices-and-cut-edges#the-cut-vertices-of-a-tree": drawing(
    net({ a: [0, 2], b: [0, 0], c: [1.6, 1], d: [3.4, 1], e: [5, 2], f: [5, 0] }, ["a-c", "b-c", "c-d", "d-e", "d-f"], {
      plain: true,
      tones: { c: "result", d: "result" },
    }),
    "For example, a tree on 6 vertices. The two highlighted vertices are not leaves and removing either one cuts the tree. Removing any of the 4 leaves disconnects nothing.",
    "例如，6 个顶点的树。突出显示的两个顶点不是叶子，去掉任一个都会把树切开。去掉 4 片叶子中的任一片都不会使图不连通。",
  ),
  "trees-and-forests#the-leaves-of-a-full-tree": drawing(
    [
      ...net(
        { a: [0, 3], b: [-1.5, 1.5], c: [1.5, 1.5], d: [-2.2, 0], e: [-0.8, 0], f: [0.8, 0], g: [2.2, 0] },
        ["a-b", "a-c", "b-d", "b-e", "c-f", "c-g"],
        { plain: true, tones: { d: "result", e: "result", f: "result", g: "result" } },
      ),
      ...net(
        { a: [6.5, 3], b: [5.5, 2], c: [7.5, 2], d: [6.5, 1], e: [8.5, 1], f: [5.5, 0], g: [7.5, 0] },
        ["a-b", "a-c", "c-d", "c-e", "d-f", "d-g"],
        { plain: true, tones: { b: "result", e: "result", f: "result", g: "result" } },
      ),
      note([3.2, -0.6], "m = 2,  i = 3,  (2 − 1) · 3 + 1 = 4", "s"),
    ],
    "For example, two full binary trees of different shapes and depths, each with m = 2 and i = 3 internal vertices. Both have (2 − 1) · 3 + 1 = 4 leaves, highlighted.",
    "例如，两棵形状和深度不同的满二叉树，都有 m = 2 且 i = 3 个内部顶点。两者都有 (2 − 1) · 3 + 1 = 4 片叶子（突出显示）。",
  ),
  "trees-and-forests#edges-to-remove-to-get-a-tree": drawing(
    [
      ...net(around(nodes("v", 5), 2.2), ["v1-v2", "v1-v3", "v1-v4", "v1-v5", "~v2-v3", "~v3-v4", "~v4-v5"], { plain: true }),
      note([0, -2.5], "7 − 5 + 1 = 3", "s"),
    ],
    "For example, a connected graph with 5 vertices and 7 edges. The 3 dashed edges close cycles; removing them leaves a spanning tree with 4 edges. The number that must go is 7 − 5 + 1 = 3, whichever edges are chosen.",
    "例如，有 5 个顶点和 7 条边的连通图。3 条虚线边构成圈；去掉它们后得到有 4 条边的生成树。必须去掉的边数为 7 − 5 + 1 = 3，与选哪些边无关。",
  ),
};
