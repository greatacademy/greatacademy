// Drawings of the explanations of Discrete Mathematics: matrices, orderings, searches and spanning trees.

import type { Figure } from "@ga/content";
import type { Mark } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { dotAt, drawing, note, seg } from "./explanation-drawings-kit.ts";
import { around, bow, complete, net, table, type Vertices } from "./explanation-drawings-structures-kit.ts";

const tail: Vertices = { A: [0, 2], B: [0, 0], C: [1.8, 1], D: [3.6, 1] };
const distances = [
  ["−", "3", "1", "6"],
  ["3", "−", "2", "5"],
  ["1", "2", "−", "4"],
  ["6", "5", "4", "−"],
];
const letters = ["A", "B", "C", "D"];
const square: Vertices = { A: [0, 2.4], B: [2.4, 2.4], C: [2.4, 0], D: [0, 0] };
const row = (names: readonly string[], x = 0, y = 0, gap = 1.6): Vertices => Object.fromEntries(names.map((n, i) => [n, [x + i * gap, y]]));

/** discreteDrawings2 draws the rest of the explanations of Discrete Mathematics, by knowledge point. */
export const discreteDrawings2: Readonly<Record<string, Figure>> = {
  "incidence-matrices#edges-between-vertices-from-an-incidence-matrix": drawing(
    [
      ...bow([0, 2.6], [0, 0], 0.5, "result", false),
      ...bow([0, 2.6], [0, 0], -0.5, "result", false),
      seg([0, 0], [2.6, 0]),
      ...dotAt([0, 2.6], "A", "n"),
      ...dotAt([0, 0], "B", "sw"),
      ...dotAt([2.6, 0], "C", "e"),
      ...table(
        [
          ["1", "1", "0"],
          ["1", "1", "1"],
          ["0", "0", "1"],
        ],
        {
          at: [5, 2.6],
          rows: letters.slice(0, 3),
          cols: ["e₁", "e₂", "e₃"],
          shade: [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ],
        },
      ),
    ],
    "For example, a multigraph and its incidence matrix. Columns e₁ and e₂ both have 1s in rows A and B, shaded, so both edges join A and B: they are parallel edges. Column e₃ joins B and C.",
    "例如，一个多重图及其关联矩阵。列 e₁ 和 e₂ 都在 A、B 行有 1（阴影），所以这两条边都连接 A 和 B：它们是平行边。列 e₃ 连接 B 和 C。",
  ),
  "incidence-matrices#the-ones-in-an-incidence-matrix": drawing(
    [
      ...net(tail, ["A-B", "B-C", "A-C", "C-D"], { dirs: { C: "s" } }),
      ...table(
        [
          ["1", "1", "0", "0"],
          ["1", "0", "1", "0"],
          ["0", "1", "1", "1"],
          ["0", "0", "0", "1"],
        ],
        {
          at: [5.6, 2.6],
          cell: 0.85,
          rows: letters,
          cols: ["AB", "AC", "BC", "CD"],
          shade: [
            [0, 0],
            [1, 0],
            [0, 1],
            [2, 1],
            [1, 2],
            [2, 2],
            [2, 3],
            [3, 3],
          ],
        },
      ),
      note([7.3, -1.1], "2 · 4 = 8", "s"),
    ],
    "For example, a simple graph with 4 edges and its incidence matrix. Each column has exactly two 1s, one for each end of its edge, so the matrix has 2 · 4 = 8 ones.",
    "例如，有 4 条边的简单图及其关联矩阵。每列恰有两个 1，对应边的两个端点，所以矩阵中共有 2 · 4 = 8 个 1。",
  ),
  "adjacency-matrices#reading-an-adjacency-matrix": drawing(
    [
      ...net({ A: [0, 1.3], B: [1.6, 2.6], C: [1.6, 0], D: [3.2, 1.3] }, ["A-B", "A-C", "B-C", "B-D", "C-D"]),
      ...table(
        [
          ["0", "1", "1", "0"],
          ["1", "0", "1", "1"],
          ["1", "1", "0", "1"],
          ["0", "1", "1", "0"],
        ],
        {
          at: [5.4, 2.6],
          cell: 0.85,
          rows: letters,
          cols: letters,
          shade: [
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 2],
            [1, 3],
            [2, 0],
            [2, 1],
            [2, 3],
            [3, 1],
            [3, 2],
          ],
        },
      ),
      note([7.1, -1.1], "10/2 = 5", "s"),
    ],
    "A graph with 5 edges and its adjacency matrix. Each edge gives two 1s, so there are ten shaded 1s and 10/2 = 5 edges. Row B has three 1s, and B has degree 3.",
    "有 5 条边的图及其邻接矩阵。每条边产生两个 1，所以阴影中有十个 1，10/2 = 5 条边。B 行有三个 1，B 的度数为 3。",
  ),
  "adjacency-matrices#the-trace-of-the-cube-of-an-adjacency-matrix": drawing(
    [
      ...net(tail, ["*A-B", "*B-C", "*A-C", "C-D"], {
        names: { A: "2", B: "2", C: "2", D: "0" },
        dirs: { C: "s" },
      }),
      note([1.8, -0.7], "2 + 2 + 2 + 0 = 6 · 1", "s"),
    ],
    "For example, a graph with one triangle, highlighted. Each vertex is labeled by its diagonal entry of A³, the closed walks of length 3 from it: 2 at each corner of the triangle, one for each direction, and 0 at the pendant vertex. The trace is 6 = 6 · 1 for one triangle.",
    "例如，只有一个三角形（突出显示）的图。每个顶点标出它在 A³ 对角线上的值，即从它出发长度为 3 的闭途径数：三角形每个角上为 2（每个方向一条），悬挂顶点上为 0。迹为 6 = 6 · 1，对应一个三角形。",
  ),
  "adjacency-matrices#an-entry-of-the-adjacency-matrix-from-a-drawing": drawing(
    [
      ...net({ i: [0, 0], j: [4, 0], k: [2, 1.8], l: [2, -1.8] }, ["i-j", "*i-k", "*k-j", "*i-l", "*l-j"], {
        dirs: { i: "w", j: "e", k: "n", l: "s" },
        tones: { k: "result", l: "result" },
      }),
      note([2, -2.6], "Aᵢⱼ = 1,  (A²)ᵢⱼ = 2", "s"),
    ],
    "For example, vertices i and j joined by one edge, with two common neighbors k and l, highlighted. So the entry of A in row i and column j is 1, and the same entry of A² is 2: the walks i, k, j and i, l, j.",
    "例如，顶点 i 和 j 由一条边相连，并有两个公共邻点 k 和 l（突出显示）。所以 A 在第 i 行第 j 列的元素为 1，A² 的同一元素为 2：途径 i, k, j 和 i, l, j。",
  ),
  "adjacency-matrices-of-directed-graphs#counting-directed-walks-with-matrix-powers": drawing(
    [
      ...head([0, 0], [1.9, 1.4], "result"),
      ...head([0, 0], [1.9, -1.4]),
      ...bow([2, 1.5], [2, -1.5], 0.3, "result"),
      ...bow([2, -1.5], [2, 1.5], 0.3),
      ...head([2, 1.5], [3.9, 0.1]),
      ...head([2, -1.5], [3.9, -0.1], "result"),
      ...dotAt([0, 0], "i", "w"),
      ...dotAt([2, 1.5], "p", "n"),
      ...dotAt([2, -1.5], "q", "s"),
      ...dotAt([4, 0], "j", "e"),
      note([2, -2.4], "(A³)ᵢⱼ = 2", "s"),
    ],
    "For example, a directed graph with (A³)ᵢⱼ = 2: there are exactly two directed walks of length 3 from i to j, the highlighted i, p, q, j and the other i, q, p, j.",
    "例如，(A³)ᵢⱼ = 2 的有向图：从 i 到 j 长度为 3 的有向途径恰有两条，即突出显示的 i, p, q, j 和另一条 i, q, p, j。",
  ),
  "adjacency-matrices-of-directed-graphs#the-trace-of-the-square-of-a-directed-adjacency-matrix": drawing(
    [
      ...bow([0, 0], [3.4, 0], 0.35, "result"),
      ...bow([3.4, 0], [0, 0], 0.35, "result"),
      ...head([3.4, 0], [1.76, 2.5]),
      ...head([1.7, 2.6], [0.06, 0.1]),
      ...dotAt([0, 0], "1", "w"),
      ...dotAt([3.4, 0], "2", "e"),
      ...dotAt([1.7, 2.6], "3", "n"),
      note([1.7, -0.8], "tr(A²) = 1 + 1 + 0 = 2", "s"),
    ],
    "For example, a directed graph with arcs in both directions between 1 and 2, highlighted, and single arcs from 2 to 3 and from 3 to 1. Only vertices 1 and 2 have a closed walk of length two, so the diagonal of A² is 1, 1, 0 and the trace is 2.",
    "例如，1 和 2 之间有双向弧（突出显示），另有从 2 到 3 和从 3 到 1 的单向弧的有向图。只有顶点 1 和 2 有长度为二的闭途径，所以 A² 的对角线为 1, 1, 0，迹为 2。",
  ),
  "distance-matrices#edges-from-a-distance-matrix": drawing(
    [
      ...net(square, ["A-B", "B-C", "C-D", "D-A"]),
      ...table(
        [
          ["0", "1", "2", "1"],
          ["1", "0", "1", "2"],
          ["2", "1", "0", "1"],
          ["1", "2", "1", "0"],
        ],
        {
          at: [4.8, 2.6],
          cell: 0.85,
          rows: letters,
          cols: letters,
          shade: [
            [0, 1],
            [0, 3],
            [1, 0],
            [1, 2],
            [2, 1],
            [2, 3],
            [3, 0],
            [3, 2],
          ],
        },
      ),
      note([6.5, -1.1], "8/2 = 4", "s"),
    ],
    "For example, a 4-cycle and its distance matrix. The shaded entries equal to 1 mark the adjacent pairs. There are 8 of them, so the graph has 8/2 = 4 edges, and they alone rebuild the graph.",
    "例如，4 圈及其距离矩阵。阴影中等于 1 的元素标出相邻的顶点对。共有 8 个，所以图有 8/2 = 4 条边，仅凭它们就能重建图。",
  ),
  "directed-acyclic-graphs#recognizing-directed-acyclic-graphs": drawing(
    [
      ...net(square, ["A-B", "A-D", "B-C", "D-C"], { arcs: true }),
      note([1.2, -0.7], "✓", "s"),
      ...head([5.6, 2.4], [7.86, 2.4]),
      ...head([8, 2.4], [8, 0.14], "result"),
      ...head([8, 0], [5.74, 0], "result"),
      ...head([5.6, 0], [7.9, 2.3], "result"),
      ...dotAt([5.6, 2.4], "A", "nw"),
      ...dotAt([8, 2.4], "B", "ne"),
      ...dotAt([8, 0], "C", "se"),
      ...dotAt([5.6, 0], "D", "sw"),
      note([6.8, -0.7], "✗", "s"),
    ],
    "On the left, deleting vertices with no incoming arcs removes A, then B and D, then C, so the graph is acyclic. On the right, after A is deleted, B, C and D all have incoming arcs: the highlighted arcs form a directed cycle B, C, D, B.",
    "左图中，依次删除没有入弧的顶点：先删 A，再删 B 和 D，然后删 C，所以图无环。右图中，删去 A 后，B、C、D 都有入弧：突出显示的弧构成有向圈 B, C, D, B。",
  ),
  "directed-acyclic-graphs#the-most-edges-of-a-directed-acyclic-graph": drawing(
    [
      ...head([0, 0], [1.86, 0]),
      ...head([2, 0], [3.86, 0]),
      ...head([4, 0], [5.86, 0]),
      ...bow([0, 0], [4, 0], 0.45),
      ...bow([2, 0], [6, 0], 0.45),
      ...bow([0, 0], [6, 0], 0.9),
      ...["1", "2", "3", "4"].flatMap((n, i) => dotAt([2 * i, 0], n, "s")),
      note([3, -0.7], "4 · 3/2 = 6", "s"),
    ],
    "For example, 4 vertices in topological order with every forward arc. Each pair of vertices has one arc, which gives 4 · 3/2 = 6 arcs and no cycle, and no further arc can be added without making a cycle.",
    "例如，4 个顶点按拓扑序排列，画出所有向前的弧。每对顶点有一条弧，共 4 · 3/2 = 6 条弧且没有圈，再加任何弧都会产生圈。",
  ),
  "topological-ordering#checking-a-topological-ordering": drawing(
    [
      ...bow([0, 2.6], [3, 2.6], 0.4),
      ...head([1.5, 2.6], [2.86, 2.6]),
      ...head([3, 2.6], [4.36, 2.6]),
      ...["B", "A", "C", "D"].flatMap((n, i) => dotAt([1.5 * i, 2.6], n, "s")),
      note([5.2, 2.5], "✓", "e"),
      ...head([0, 0], [1.36, 0]),
      ...bow([1.5, 0], [4.5, 0], 0.4),
      ...bow([3, 0], [1.5, 0], 0.3, "result"),
      ...["A", "C", "B", "D"].flatMap((n, i) => dotAt([1.5 * i, 0], n, "n")),
      note([5.2, -0.1], "✗", "e"),
    ],
    "The arcs from A to C, B to C and C to D, drawn over two orders. In the order B, A, C, D every arc points forward, so it is topological. In the order A, C, B, D the highlighted arc from B to C points backward, so it is not.",
    "弧 A 到 C、B 到 C、C 到 D 画在两种顺序上。在顺序 B, A, C, D 中，所有弧都向前，所以它是拓扑序。在顺序 A, C, B, D 中，突出显示的从 B 到 C 的弧向后，所以它不是。",
  ),
  "topological-ordering#the-topological-orderings-of-two-separate-paths": drawing(
    [
      ...head([0, 3.4], [1.36, 3.4]),
      ...dotAt([0, 3.4], "a₁", "n"),
      ...dotAt([1.5, 3.4], "a₂", "n"),
      ...head([3, 3.4], [4.36, 3.4]),
      ...head([4.5, 3.4], [5.86, 3.4]),
      ...dotAt([3, 3.4], "b₁", "n"),
      ...dotAt([4.5, 3.4], "b₂", "n"),
      ...dotAt([6, 3.4], "b₃", "n"),
      ...bow([0, 1], [4.5, 1], 0.5, "action"),
      ...bow([1.5, 1], [3, 1], -0.25),
      ...bow([3, 1], [6, 1], -0.5),
      ...["a₁", "b₁", "b₂", "a₂", "b₃"].flatMap((n, i) => dotAt([1.5 * i, 1], n, "n")),
      note([3, -0.1], "5 · 4/2 = 10", "s"),
    ],
    "For example, a path of 2 vertices and a path of 3. One shuffle is a₁, b₁, b₂, a₂, b₃, with each path still in order. A shuffle is decided by the 2 positions given to the first path among 5, so there are 5 · 4/2 = 10 orderings.",
    "例如，一条 2 个顶点的路径和一条 3 个顶点的路径。一种交错为 a₁, b₁, b₂, a₂, b₃，每条路径仍保持顺序。交错由 5 个位置中分给第一条路径的 2 个位置决定，所以有 5 · 4/2 = 10 种排序。",
  ),
  "kahns-algorithm#in-degrees-during-kahns-algorithm": drawing(
    [
      ...net({ A: [0, 2.2], B: [2.6, 2.2], C: [1.3, 0] }, ["*A-B", "*A-C", "B-C"], {
        arcs: true,
        names: { A: "A: 0", B: "B: 1", C: "C: 2" },
        tones: { A: "result" },
      }),
      ...net({ B: [7, 2.2], C: [5.7, 0] }, ["B-C"], { arcs: true, names: { B: "B: 0", C: "C: 1" }, tones: { B: "result" } }),
    ],
    "For example, each vertex labeled by its in-degree. A has in-degree 0, so it is output first. Deleting its two highlighted arcs lowers B from 1 to 0 and C from 2 to 1, as on the right, so B is available next.",
    "例如，每个顶点标出其入度。A 的入度为 0，所以先输出。删除它的两条突出显示的弧后，B 从 1 降到 0，C 从 2 降到 1（如右图），所以接下来可以输出 B。",
  ),
  "kahns-algorithm#where-kahns-algorithm-stops-on-a-graph-with-a-cycle": drawing(
    net({ S: [0, 1], A: [2.2, 1], B: [4.2, 2.6], C: [4.2, -0.6], T: [6.4, -0.6] }, ["S-A", "*A-B", "*B-C", "*C-A", "C-T"], {
      arcs: true,
      names: { S: "S ✓" },
      dirs: { A: "s", B: "n", C: "s", T: "e" },
    }),
    "For example, S leads into the highlighted cycle A, B, C, and C leads on to T. The algorithm outputs S and stops: A, B and C each wait for the one before them, and T waits for C. Those 4 vertices are left over, which shows that there is a cycle.",
    "例如，S 通向突出显示的圈 A, B, C，C 又通向 T。算法输出 S 后停止：A、B、C 都在等待前一个顶点，T 在等待 C。剩下这 4 个顶点，说明存在圈。",
  ),
  "breadth-first-search#the-order-of-a-breadth-first-search": drawing(
    [
      ...net({ A: [0, 1.5], B: [2, 2.6], D: [2, 0.4], C: [4, 3], E: [4, 1], F: [6, 1] }, ["A-B", "A-D", "B-C", "B-E", "D-E", "E-F"], {
        dirs: { A: "w", B: "n", D: "s", C: "n", E: "n", F: "e" },
      }),
      ...["0", "1", "2", "3"].map((t, i) => note([2 * i, -0.6], `d = ${t}`, "s")),
      note([3, -1.4], "A, B, D, C, E, F", "s"),
    ],
    "For example, a search from A with neighbors taken alphabetically. It queues B and D, then C and E from B, nothing new from D or C, and F from E. The vertices leave the queue in the order A, B, D, C, E, F, finishing each distance d before the next.",
    "例如，从 A 出发、按字母顺序取邻点的搜索。先把 B、D 入队，再由 B 把 C、E 入队，D 和 C 没有新邻点，最后由 E 把 F 入队。顶点按 A, B, D, C, E, F 的顺序出队，每个距离 d 完成后才到下一个。",
  ),
  "breadth-first-search#the-vertices-a-breadth-first-search-finds-by-a-given-level": drawing(
    [
      ...net(
        { a: [0, 3], b: [-1.6, 1.5], c: [1.6, 1.5], d: [-2.4, 0], e: [-0.8, 0], f: [0.8, 0], g: [2.4, 0] },
        ["a-b", "a-c", "b-d", "b-e", "c-f", "c-g"],
        { plain: true },
      ),
      note([3.2, 3], "2⁰ = 1", "e"),
      note([3.2, 1.5], "2¹ = 2", "e"),
      note([3.2, 0], "2² = 4", "e"),
      note([0.4, -0.5], "1 + 2 + 4 = 7", "s"),
    ],
    "For example, a complete binary tree, m = 2. Level j has 2ʲ vertices, because each vertex has 2 children. Once level d = 2 is finished, the search has found 1 + 2 + 4 = 7 vertices.",
    "例如，完全二叉树，m = 2。第 j 层有 2ʲ 个顶点，因为每个顶点有 2 个孩子。第 d = 2 层完成时，搜索已找到 1 + 2 + 4 = 7 个顶点。",
  ),
  "prims-algorithm#the-order-prims-algorithm-adds-vertices": drawing(
    [
      ...net({ A: [0, 1.6], B: [2.6, 3.2], C: [2.6, 0], D: [5.2, 1.6] }, ["A-B:3", "*A-C:1", "*B-C:2", "*C-D:4", "B-D:5"], {
        dirs: { B: "n", C: "s" },
      }),
      note([2.6, -0.8], "A, C, B, D:  1 + 2 + 4 = 7", "s"),
    ],
    "For example, starting from A. The lightest edge leaving {A} is AC, weight 1. From {A, C} it is CB, weight 2, beating AB, weight 3. From {A, C, B} it is CD, weight 4, beating BD, weight 5. The vertices join in the order A, C, B, D and the tree weighs 7.",
    "例如，从 A 开始。离开 {A} 的最轻边是 AC，权重 1。从 {A, C} 出发是 CB，权重 2，比 AB（权重 3）轻。从 {A, C, B} 出发是 CD，权重 4，比 BD（权重 5）轻。顶点按 A, C, B, D 的顺序加入，树的总权重为 7。",
  ),
  "prims-algorithm#the-spanning-tree-of-a-graph-with-sum-weights": drawing(
    net(
      { "1": [0, 0], "2": [0, 3], "3": [-2.8, -1.8], "4": [2.8, -1.8] },
      ["*1-2:3:e", "*1-3:4:nw", "*1-4:5:ne", "~2-3:5", "~2-4:6", "~3-4:7"],
      { dirs: { "1": "e", "2": "n" } },
    ),
    "For example, 4 vertices where the edge between i and j weighs i + j. Each new vertex j is reached most cheaply from vertex 1, at weight 1 + j: 3, 4 and 5. So the highlighted spanning tree is a star at vertex 1, and the dashed edges 5, 6 and 7 are never chosen.",
    "例如，4 个顶点，i 与 j 之间的边权重为 i + j。每个新顶点 j 从顶点 1 到达最便宜，权重为 1 + j：3、4、5。所以突出显示的生成树是以顶点 1 为中心的星形，虚线边 5、6、7 从不被选中。",
  ),
  "applying-prims-algorithm-to-a-distance-matrix#minimum-spanning-trees-from-a-matrix": drawing(
    [
      ...table(distances, {
        rows: letters,
        cols: letters,
        shade: [
          [2, 0],
          [1, 2],
          [3, 2],
        ],
      }),
      note([2, -4.2], "1 + 2 + 4 = 7", "s"),
    ],
    "For example, a distance matrix on A, B, C, D. Column A's smallest entry is 1 in row C. With columns A and C, the smallest entry in rows B and D is 2 in row B. With columns A, B and C, row D's smallest is 4 in column C. The shaded entries give a tree of weight 1 + 2 + 4 = 7.",
    "例如，A、B、C、D 上的距离矩阵。A 列的最小元素是 C 行的 1。在 A、C 列中，B、D 行的最小元素是 B 行的 2。在 A、B、C 列中，D 行的最小元素是 C 列的 4。阴影元素给出权重为 1 + 2 + 4 = 7 的树。",
  ),
  "applying-prims-algorithm-to-a-distance-matrix#steps-of-prims-algorithm-on-a-matrix": drawing(
    table(distances, {
      rows: letters,
      cols: letters,
      shade: [[1, 2]],
      other: [
        [1, 0],
        [3, 0],
        [3, 2],
      ],
    }),
    "For example, with A and C already in the tree, only columns A and C are searched, and only in rows B and D. The shaded entries are 3, 6, 2 and 4. The smallest is 2, in row B and column C, so B joins by the edge CB of weight 2.",
    "例如，A 和 C 已在树中时，只搜索 A、C 列，且只看 B、D 行。阴影元素为 3、6、2、4。最小的是 B 行 C 列的 2，所以 B 通过权重为 2 的边 CB 加入。",
  ),
  "applying-prims-algorithm-to-a-distance-matrix#the-first-edge-from-a-given-start": drawing(
    table(distances, {
      rows: letters,
      cols: letters,
      shade: [[1, 2]],
      other: [
        [1, 0],
        [1, 3],
      ],
    }),
    "For example, starting from B. The first edge is the smallest entry of row B, which is 2, to C. The 1 between A and C is smaller, but it does not touch B, so it cannot be first.",
    "例如，从 B 开始。第一条边是 B 行的最小元素 2，连向 C。A 与 C 之间的 1 更小，但它不与 B 相接，所以不可能是第一条边。",
  ),
  "shortest-paths-in-unweighted-graphs#counting-shortest-paths": drawing(
    net(square, ["*A-B", "*B-C", "*A-D", "*D-C"], { names: { A: "A: 1", B: "B: 1", C: "C: 1 + 1 = 2", D: "D: 1" } }),
    "A 4-cycle A, B, C, D with each vertex labeled from A. B and D get 1 each, and C gets 1 + 1 = 2: the two shortest paths A, B, C and A, D, C.",
    "4 圈 A, B, C, D，每个顶点从 A 开始标号。B 和 D 各得 1，C 得 1 + 1 = 2：两条最短路径 A, B, C 和 A, D, C。",
  ),
  "shortest-paths-in-unweighted-graphs#the-diameter-of-a-graph": drawing(
    [
      ...net(row(["a", "b", "c", "d", "e"], 0, 1.8, 1.2), ["*a-b", "*b-c", "*c-d", "*d-e"], { plain: true }),
      note([2.4, 1.3], "d = 5 − 1 = 4", "s"),
      ...net(around(["a", "b", "c", "d"], 1.6, [7.2, 1.8], 45), complete(["a", "b", "c", "d"]), { plain: true }),
      note([7.2, -0.1], "d = 1", "s"),
    ],
    "Two graphs with their diameters d. A path on n = 5 vertices has d = 5 − 1 = 4, the highlighted distance between its ends. The complete graph on 4 vertices has d = 1, since every two vertices are adjacent.",
    "两个图及其直径 d。n = 5 个顶点的路径 d = 5 − 1 = 4，即突出显示的两端之间的距离。4 个顶点的完全图 d = 1，因为任意两个顶点都相邻。",
  ),
  "shortest-paths-in-unweighted-graphs#the-shortest-paths-across-a-grid-graph": (() => {
    const v = Object.fromEntries([0, 1, 2, 3].flatMap((i) => [0, 1, 2].map((j) => [`${i}${j}`, [1.5 * i, 1.5 * j]]))) as Vertices;
    const walk = ["00", "10", "11", "21", "31", "32"];
    const hot = new Set(walk.slice(1).map((n, i) => `${walk[i]}-${n}`));
    const edges = [0, 1, 2, 3].flatMap((i) =>
      [0, 1, 2].flatMap((j) => [...(i < 3 ? [`${i}${j}-${i + 1}${j}`] : []), ...(j < 2 ? [`${i}${j}-${i}${j + 1}`] : [])]),
    );
    const marks: Mark[] = [
      ...net(
        v,
        edges.map((e) => (hot.has(e) ? `*${e}` : e)),
        { plain: true, names: { "00": "s", "32": "t" } },
      ),
      note([2.25, -0.6], "5 · 4/2 = 10", "s"),
    ];
    return drawing(
      marks,
      "For example, a grid 3 steps wide and 2 steps high. A shortest path from corner s to corner t, like the highlighted one, uses 3 steps across and 2 steps up in some order. Choosing the 2 positions of the steps up among 5 gives 5 · 4/2 = 10 paths.",
      "例如，宽 3 步、高 2 步的网格。从角 s 到角 t 的最短路径（如突出显示的一条）以某种顺序走 3 步横向和 2 步向上。在 5 步中选 2 个位置向上，共有 5 · 4/2 = 10 条路径。",
    );
  })(),
  "dijkstras-algorithm#shortest-weighted-distances": drawing(
    [
      ...net({ A: [0, 0], B: [4, 0], C: [2, 2] }, ["A-B:4", "*A-C:1", "*C-B:2"], {
        names: { A: "d(A) = 0", B: "d(B) = 3", C: "d(C) = 1" },
        dirs: { A: "w", B: "e", C: "n" },
      }),
      note([2, -0.7], "min(4, 1 + 2) = 3", "s"),
    ],
    "The edges AB with weight 4, AC with weight 1 and CB with weight 2. Finalizing A gives d(B) = 4 and d(C) = 1. Finalizing C gives d(B) = min(4, 1 + 2) = 3, along the highlighted route, so the direct edge is not the shortest.",
    "边 AB 权重 4，AC 权重 1，CB 权重 2。确定 A 后 d(B) = 4，d(C) = 1。确定 C 后 d(B) = min(4, 1 + 2) = 3，沿突出显示的路线，所以直接的边不是最短的。",
  ),
  "dijkstras-algorithm#a-tentative-distance-during-dijkstras-algorithm": drawing(
    [
      ...net({ A: [0, 0], B: [4, 0], C: [2, 2] }, ["*A-B:7", "*A-C:2", "C-B:3"], {
        names: { A: "A: 0", B: "B: 7", C: "C: 2" },
        dirs: { A: "w", B: "e", C: "n" },
        tones: { A: "result" },
      }),
      ...net({ A: [8, 0], B: [12, 0], C: [10, 2] }, ["A-B:7", "*A-C:2", "*C-B:3"], {
        names: { A: "A: 0", B: "B: 5", C: "C: 2" },
        dirs: { A: "w", B: "e", C: "n" },
        tones: { A: "result", C: "result" },
      }),
      note([10, -1], "min(7, 2 + 3) = 5", "s"),
    ],
    "For example, on the left A is finalized, so B has tentative distance 7 and C has 2. On the right C is finalized too, and the route through it improves the label of B to min(7, 2 + 3) = 5. So 7 was larger than the true distance.",
    "例如，左图确定了 A，所以 B 的暂定距离为 7，C 为 2。右图 C 也被确定，经过它的路线把 B 的标号改进为 min(7, 2 + 3) = 5。所以 7 比真实距离大。",
  ),
};
