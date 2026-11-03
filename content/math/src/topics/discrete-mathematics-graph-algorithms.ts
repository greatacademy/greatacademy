import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem, numberProblem, yesNo } from "../problems.ts";
import {
  adjacencyMatrix,
  allArcs,
  bfs,
  degrees,
  digraphIntro,
  dijkstra,
  type Edge,
  edgeTex,
  type Graph,
  graphFigure,
  graphIntro,
  isAcyclic,
  kahn,
  kruskal,
  matPow,
  matTex,
  neighbors,
  orderTex,
  prim,
  randomConnected,
  randomDag,
  randomGraph,
  randomWeighted,
  sortArcs,
  sortEdges,
  vx,
  type WeightedGraph,
  weightedTex,
  weightOf,
} from "./discrete-mathematics-graph-common.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 7, part 2: matrix representations, DAGs and algorithms on graphs.

/** fig attaches a drawing of g to a problem. */
const fig = <P extends object>(p: P, g: Graph, opts: { readonly directed?: boolean; readonly weights?: readonly number[] } = {}) => ({
  ...p,
  figure: graphFigure(g, opts),
});

/** ordinal writes 1st, 2nd, 3rd, …. */
const ordinal = (k: number) =>
  `${k}${k % 10 === 1 && k !== 11 ? "st" : k % 10 === 2 && k !== 12 ? "nd" : k % 10 === 3 && k !== 13 ? "rd" : "th"}`;

/** sum adds numbers. */
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** vertexList writes the vertex names in math, separated by sep. */
const vertexList = (n: number, sep: string) =>
  range(0, n - 1)
    .map((v) => `$${vx(v)}$`)
    .join(sep);

/** weightedIntro introduces a weighted graph by its edges and weights. */
const weightedIntro = (g: WeightedGraph) =>
  t(
    `A weighted graph on vertices ${vertexList(g.n, ", ")} has edges with weights ${weightedTex(g)}.`,
    `一个带权图的顶点为 ${vertexList(g.n, "、")}，各边及其权为 ${weightedTex(g)}。`,
  );

/** incidenceTex writes the incidence matrix of a multigraph with edges e₁, e₂, …. */
const incidenceTex = (n: number, edges: readonly Edge[]) =>
  matTex(range(0, n - 1).map((v) => edges.map(([a, b]) => (a === v || b === v ? 1 : 0))));

/** incidenceMatrices reads degrees and edges from incidence matrices. */
export const incidenceMatrices: TopicDef = {
  id: "incidence-matrices",
  title: t("Incidence Matrices", "关联矩阵"),
  summary: t(
    "The incidence matrix of a loopless graph has a row for each vertex and a column for each edge, with a 1 where the vertex lies on the edge. Each column has two 1s, and the sum of a row is the degree of its vertex.",
    "无环图的关联矩阵每个顶点对应一行、每条边对应一列，顶点在边上时该位置为 1。每列有两个 1，每行之和是对应顶点的度。",
  ),
  prerequisites: ["the-degree-of-a-vertex", "introduction-to-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "degrees-from-an-incidence-matrix",
      title: t("Degrees", "度"),
      explanation: t(
        "If the row of $C$ in an incidence matrix is $(0, 1, 1, 0, 1)$, then $C$ lies on edges $e_2$, $e_3$ and $e_5$, so $\\deg(C) = 3$.",
        "若关联矩阵中 $C$ 所在行为 $(0, 1, 1, 0, 1)$，则 $C$ 在边 $e_2$、$e_3$、$e_5$ 上，所以 $\\deg(C) = 3$。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomGraph(rng, n, rng.int(n, n + 2));
        const edges = rng.shuffle(g.edges);
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        return numberProblem({
          prompt: t(
            `The incidence matrix of a graph, with rows for vertices $${orderTex(n)}$ and columns for edges $e_1, \\dots, e_{${edges.length}}$, is $${incidenceTex(n, edges)}$. Find $\\deg(${vx(v)})$.`,
            `一个图的关联矩阵（行依次对应顶点 $${orderTex(n)}$，列对应边 $e_1, \\dots, e_{${edges.length}}$）为 $${incidenceTex(n, edges)}$。求 $\\deg(${vx(v)})$。`,
          ),
          answer: d,
          wrong: [edges.length - d, d + 1, 2 * d],
          solution: t(
            `The row of $${vx(v)}$ has $${d}$ ones, so $\\deg(${vx(v)}) = ${d}$.`,
            `$${vx(v)}$ 所在行有 $${d}$ 个 $1$，所以 $\\deg(${vx(v)}) = ${d}$。`,
          ),
        });
      },
    },
    {
      id: "edges-between-vertices-from-an-incidence-matrix",
      title: t("Edges joining two vertices", "连接两个顶点的边"),
      explanation: t(
        "An edge joins $A$ and $B$ exactly when its column has $1$s in rows $A$ and $B$. In a multigraph several columns can do so: those are parallel edges.",
        "一条边连接 $A$ 和 $B$，当且仅当它所在列在 $A$、$B$ 两行都是 $1$。在多重图中可能有好几列如此：它们是平行边。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const u = rng.int(0, n - 2);
        const w = rng.int(u + 1, n - 1);
        const k = rng.int(0, 3);
        const others = range(0, rng.int(2, 4)).map(() => {
          let e: Edge;
          do {
            const [a, b] = rng.sample(range(0, n - 1), 2);
            e = sortEdges([[a!, b!]])[0]!;
          } while (e[0] === u && e[1] === w);
          return e;
        });
        const edges = rng.shuffle([...range(1, k).map(() => [u, w] as const), ...others]);
        const shared = (a: number, b: number) => edges.filter(([x, y]) => (x === a && y === b) || (x === b && y === a)).length;
        return numberProblem({
          prompt: t(
            `The incidence matrix of a multigraph, with rows for vertices $${orderTex(n)}$, is $${incidenceTex(n, edges)}$. How many edges join $${vx(u)}$ and $${vx(w)}$?`,
            `一个多重图的关联矩阵（行依次对应顶点 $${orderTex(n)}$）为 $${incidenceTex(n, edges)}$。连接 $${vx(u)}$ 和 $${vx(w)}$ 的边有多少条？`,
          ),
          answer: k,
          wrong: [
            edges.filter(([a, b]) => a === u || b === u).length,
            edges.filter(([a, b]) => a === w || b === w).length,
            k + 1,
            shared(0, n - 1) === k ? k + 2 : shared(0, n - 1),
          ],
          solution: t(
            `Count the columns with $1$ in both row $${vx(u)}$ and row $${vx(w)}$: there ${k === 1 ? "is" : "are"} $${k}$.`,
            `数一数在 $${vx(u)}$ 行和 $${vx(w)}$ 行都为 $1$ 的列：共 $${k}$ 列。`,
          ),
        });
      },
    },
  ],
};

/** adjacencyMatrices reads graphs from adjacency matrices and counts walks with matrix powers. */
export const adjacencyMatrices: TopicDef = {
  id: "adjacency-matrices",
  title: t("Adjacency Matrices", "邻接矩阵"),
  summary: t(
    "The adjacency matrix A has aᵢⱼ = 1 when vertices i and j are adjacent; for an undirected graph it is symmetric, its row sums are degrees, and its entries sum to 2|E|. The entry (Aᵏ)ᵢⱼ counts the walks of length k from i to j.",
    "邻接矩阵 A 中，若顶点 i 与 j 相邻则 aᵢⱼ = 1；无向图的邻接矩阵是对称的，行和为度，元素之和为 2|E|。(Aᵏ)ᵢⱼ 等于从 i 到 j 长度为 k 的途径数。",
  ),
  prerequisites: ["the-degree-of-a-vertex", "powers-of-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reading-an-adjacency-matrix",
      title: t("Reading an adjacency matrix", "读邻接矩阵"),
      explanation: t(
        "Each edge contributes two $1$s, at $(i, j)$ and $(j, i)$. So an adjacency matrix with ten $1$s describes a graph with $5$ edges, and the number of $1$s in row $i$ is the degree of vertex $i$.",
        "每条边贡献两个 $1$，分别在 $(i, j)$ 和 $(j, i)$。所以有十个 $1$ 的邻接矩阵表示有 $5$ 条边的图，第 $i$ 行中 $1$ 的个数是顶点 $i$ 的度。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomGraph(rng, n, rng.int(n - 1, Math.min(n + 3, (n * (n - 1)) / 2)));
        const A = adjacencyMatrix(g);
        const m = g.edges.length;
        const askEdges = rng.bool();
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        return numberProblem({
          prompt: askEdges
            ? t(
                `A graph on vertices $${orderTex(n)}$ has adjacency matrix $${matTex(A)}$. How many edges does it have?`,
                `顶点为 $${orderTex(n)}$ 的图的邻接矩阵为 $${matTex(A)}$。它有多少条边？`,
              )
            : t(
                `A graph on vertices $${orderTex(n)}$ has adjacency matrix $${matTex(A)}$. Find $\\deg(${vx(v)})$.`,
                `顶点为 $${orderTex(n)}$ 的图的邻接矩阵为 $${matTex(A)}$。求 $\\deg(${vx(v)})$。`,
              ),
          answer: askEdges ? m : d,
          wrong: askEdges ? [2 * m, m + 1, n] : [d + 1, n - d, 2 * d],
          solution: askEdges
            ? t(
                `The matrix has $${2 * m}$ ones, two for each edge, so there are $${m}$ edges.`,
                `矩阵中有 $${2 * m}$ 个 $1$，每条边两个，所以有 $${m}$ 条边。`,
              )
            : t(
                `Row $${vx(v)}$ has $${d}$ ones, so $\\deg(${vx(v)}) = ${d}$.`,
                `$${vx(v)}$ 行有 $${d}$ 个 $1$，所以 $\\deg(${vx(v)}) = ${d}$。`,
              ),
        });
      },
    },
    {
      id: "counting-walks-with-powers-of-the-adjacency-matrix",
      title: t("Counting walks", "数途径"),
      explanation: t(
        "$(A^2)_{ij} = \\sum_k a_{ik}a_{kj}$ counts the vertices $k$ adjacent to both $i$ and $j$: the walks $i, k, j$ of length $2$. In general $(A^k)_{ij}$ counts walks of length $k$ from $i$ to $j$.",
        "$(A^2)_{ij} = \\sum_k a_{ik}a_{kj}$ 数的是同时与 $i$、$j$ 相邻的顶点 $k$，即长度为 $2$ 的途径 $i, k, j$。一般地，$(A^k)_{ij}$ 是从 $i$ 到 $j$ 长度为 $k$ 的途径数。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const A = adjacencyMatrix(g);
        const k = rng.int(2, 3);
        const P = matPow(A, k);
        const i = rng.int(0, n - 1);
        const j = rng.int(0, n - 1);
        const value = P[i]![j]!;
        const other = matPow(A, k === 2 ? 3 : 2)[i]![j]!;
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} With rows and columns in the order $${orderTex(n)}$, let $A$ be its adjacency matrix. Find the $(${vx(i)}, ${vx(j)})$ entry of $A^{${k}}$.`,
              `${graphIntro(g)["zh-CN"]}行与列按 $${orderTex(n)}$ 排列，设 $A$ 为其邻接矩阵。求 $A^{${k}}$ 的 $(${vx(i)}, ${vx(j)})$ 元。`,
            ),
            answer: value,
            wrong: [other, A[i]![j]!, value + 1, Math.max(0, value - 1)],
            solution: t(
              `The entry counts walks of length $${k}$ from $${vx(i)}$ to $${vx(j)}$. Computing $A^{${k}} = ${matTex(P)}$ gives $${value}$.`,
              `该元等于从 $${vx(i)}$ 到 $${vx(j)}$ 长度为 $${k}$ 的途径数。计算得 $A^{${k}} = ${matTex(P)}$，所以为 $${value}$。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** randomDigraph picks m random arcs on n vertices. */
function randomDigraph(rng: Rng, n: number, m: number): Graph {
  return { n, edges: sortArcs(rng.sample(allArcs(n), m)) };
}

/** adjacencyMatricesOfDirectedGraphs reads in- and out-degrees and counts directed walks. */
export const adjacencyMatricesOfDirectedGraphs: TopicDef = {
  id: "adjacency-matrices-of-directed-graphs",
  title: t("Adjacency Matrices of Directed Graphs", "有向图的邻接矩阵"),
  summary: t(
    "For a directed graph, aᵢⱼ = 1 when there is an arc from i to j, so the matrix need not be symmetric. Row sums are out-degrees, column sums are in-degrees, and (Aᵏ)ᵢⱼ counts directed walks of length k from i to j.",
    "对有向图，若有从 i 到 j 的弧，则 aᵢⱼ = 1，所以矩阵不一定对称。行和为出度，列和为入度，(Aᵏ)ᵢⱼ 是从 i 到 j 长度为 k 的有向途径数。",
  ),
  prerequisites: ["adjacency-matrices", "walks-paths-and-distances-in-directed-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "in-degrees-and-out-degrees-from-a-matrix",
      title: t("In-degrees and out-degrees", "入度与出度"),
      explanation: t(
        "Row $B$ lists the arcs leaving $B$ and column $B$ the arcs entering it. If row $B$ is $(1, 0, 1, 1)$ and column $B$ is $(0, 0, 1, 0)^T$, then $\\deg^+(B) = 3$ and $\\deg^-(B) = 1$.",
        "$B$ 行列出从 $B$ 出发的弧，$B$ 列列出指向 $B$ 的弧。若 $B$ 行为 $(1, 0, 1, 1)$，$B$ 列为 $(0, 0, 1, 0)^T$，则 $\\deg^+(B) = 3$，$\\deg^-(B) = 1$。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomDigraph(rng, n, rng.int(n + 1, n + 5));
        const A = adjacencyMatrix(g, true);
        const v = rng.int(0, n - 1);
        const out = sum(A[v]!);
        const inn = sum(A.map((r) => r[v]!));
        const askOut = rng.bool();
        return numberProblem({
          prompt: t(
            `A directed graph on vertices $${orderTex(n)}$ has adjacency matrix $${matTex(A)}$, where the $(i, j)$ entry is $1$ when there is an arc from $i$ to $j$. Find the ${askOut ? "out" : "in"}-degree of $${vx(v)}$.`,
            `顶点为 $${orderTex(n)}$ 的有向图的邻接矩阵为 $${matTex(A)}$，其中有从 $i$ 到 $j$ 的弧时 $(i, j)$ 元为 $1$。求 $${vx(v)}$ 的${askOut ? "出" : "入"}度。`,
          ),
          answer: askOut ? out : inn,
          wrong: [askOut ? inn : out, out + inn, (askOut ? out : inn) + 1],
          solution: askOut
            ? t(`The out-degree is the sum of row $${vx(v)}$: $${out}$.`, `出度是 $${vx(v)}$ 行之和：$${out}$。`)
            : t(`The in-degree is the sum of column $${vx(v)}$: $${inn}$.`, `入度是 $${vx(v)}$ 列之和：$${inn}$。`),
        });
      },
    },
    {
      id: "counting-directed-walks-with-matrix-powers",
      title: t("Counting directed walks", "数有向途径"),
      explanation: t(
        "If $A$ is the adjacency matrix of a directed graph, the $(i, j)$ entry of $A^3$ is the number of directed walks $i \\to \\cdot \\to \\cdot \\to j$ of length $3$.",
        "若 $A$ 是有向图的邻接矩阵，则 $A^3$ 的 $(i, j)$ 元是长度为 $3$ 的有向途径 $i \\to \\cdot \\to \\cdot \\to j$ 的条数。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomDigraph(rng, n, rng.int(n + 2, n + 5));
        const A = adjacencyMatrix(g, true);
        const k = rng.int(2, 3);
        const P = matPow(A, k);
        const i = rng.int(0, n - 1);
        const j = rng.int(0, n - 1);
        const value = P[i]![j]!;
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many directed walks of length $${k}$ go from $${vx(i)}$ to $${vx(j)}$?`,
              `${digraphIntro(g)["zh-CN"]}从 $${vx(i)}$ 到 $${vx(j)}$ 长度为 $${k}$ 的有向途径有多少条？`,
            ),
            answer: value,
            wrong: [P[j]![i]!, matPow(A, k === 2 ? 3 : 2)[i]![j]!, value + 1],
            solution: t(
              `With $A$ the adjacency matrix in the order $${orderTex(n)}$, $A^{${k}} = ${matTex(P)}$, and its $(${vx(i)}, ${vx(j)})$ entry is $${value}$.`,
              `设 $A$ 为按 $${orderTex(n)}$ 排列的邻接矩阵，则 $A^{${k}} = ${matTex(P)}$，其 $(${vx(i)}, ${vx(j)})$ 元为 $${value}$。`,
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** distanceMatrix computes the distances between all pairs of vertices of a connected graph. */
const distanceMatrix = (g: Graph) => range(0, g.n - 1).map((s) => bfs(g, s).dist);

/** distanceMatrices builds and reads distance matrices. */
export const distanceMatrices: TopicDef = {
  id: "distance-matrices",
  title: t("Distance Matrices", "距离矩阵"),
  summary: t(
    "The distance matrix D of a connected graph has dᵢⱼ = d(i, j). It is symmetric with zeros on the diagonal, its entries equal to 1 mark the edges, and the largest entry in row i is the eccentricity of i.",
    "连通图的距离矩阵 D 中 dᵢⱼ = d(i, j)。它是对称的，对角线为零，等于 1 的元标出各条边，第 i 行的最大元是 i 的离心率。",
  ),
  prerequisites: ["adjacency-matrices", "walks-trails-paths-and-distances"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rows-of-the-distance-matrix",
      title: t("Rows of the distance matrix", "距离矩阵的行"),
      explanation: t(
        "Row $A$ of the distance matrix lists $d(A, v)$ for every $v$. For the path $A, B, C, D$ it is $(0, 1, 2, 3)$, whose sum is $6$ and whose largest entry, the eccentricity of $A$, is $3$.",
        "距离矩阵的 $A$ 行列出每个 $v$ 的 $d(A, v)$。对路径 $A, B, C, D$，它是 $(0, 1, 2, 3)$，其和为 $6$，最大元（$A$ 的离心率）为 $3$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomConnected(rng, n, rng.int(0, 2));
        const D = distanceMatrix(g);
        const v = rng.int(0, n - 1);
        const row = D[v]!;
        const askSum = rng.bool();
        const value = askSum ? sum(row) : Math.max(...row);
        return fig(
          numberProblem({
            prompt: askSum
              ? t(
                  `${graphIntro(g).en} Find the sum of the entries in row $${vx(v)}$ of its distance matrix.`,
                  `${graphIntro(g)["zh-CN"]}求其距离矩阵 $${vx(v)}$ 行各元之和。`,
                )
              : t(
                  `${graphIntro(g).en} Find the largest entry in row $${vx(v)}$ of its distance matrix.`,
                  `${graphIntro(g)["zh-CN"]}求其距离矩阵 $${vx(v)}$ 行的最大元。`,
                ),
            answer: value,
            wrong: askSum ? [degrees(g)[v]!, value + 1, value - 1] : [value + 1, value - 1, degrees(g)[v]!],
            solution: t(
              `Row $${vx(v)}$ is $(${row.join(", ")})$, ${askSum ? "whose entries sum to" : "whose largest entry is"} $${value}$.`,
              `$${vx(v)}$ 行为 $(${row.join(", ")})$，${askSum ? "各元之和为" : "最大元为"} $${value}$。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "edges-from-a-distance-matrix",
      title: t("Edges from a distance matrix", "由距离矩阵求边"),
      explanation: t(
        "Two vertices are adjacent exactly when their distance is $1$. So the number of edges is half the number of entries equal to $1$, and the whole graph can be rebuilt from its distance matrix.",
        "两个顶点相邻当且仅当它们的距离为 $1$。所以边数是等于 $1$ 的元个数的一半，整个图都可以由距离矩阵还原。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomConnected(rng, n, rng.int(0, 3));
        const D = distanceMatrix(g);
        const m = g.edges.length;
        const ones = 2 * m;
        return numberProblem({
          prompt: t(
            `A connected graph on vertices $${orderTex(n)}$ has distance matrix $${matTex(D)}$. How many edges does it have?`,
            `顶点为 $${orderTex(n)}$ 的连通图的距离矩阵为 $${matTex(D)}$。它有多少条边？`,
          ),
          answer: m,
          wrong: [ones, n - 1, sum(D.flat()) / 2].filter(Number.isInteger),
          solution: t(
            `The edges are the pairs at distance $1$: $${g.edges.map(edgeTex).join(", ")}$. There are $${m}$.`,
            `边就是距离为 $1$ 的顶点对：$${g.edges.map(edgeTex).join(", ")}$。共 $${m}$ 条。`,
          ),
        });
      },
    },
  ],
};

/** randomCyclic builds a directed graph with a directed cycle. */
function randomCyclic(rng: Rng, n: number, m: number): Graph {
  const dag = randomDag(rng, n, m);
  const order = kahn(dag);
  const i = rng.int(0, n - 3);
  const j = rng.int(i + 2, n - 1);
  const path = order.slice(i, j + 1);
  const arcs = new Set(dag.edges.map(([a, b]) => a * 32 + b));
  for (let k = 0; k + 1 < path.length; k++) arcs.add(path[k]! * 32 + path[k + 1]!);
  arcs.add(path[path.length - 1]! * 32 + path[0]!);
  return { n, edges: sortArcs([...arcs].map((x) => [Math.floor(x / 32), x % 32] as const)) };
}

/** directedAcyclicGraphs recognizes DAGs and their sources and sinks. */
export const directedAcyclicGraphs: TopicDef = {
  id: "directed-acyclic-graphs",
  title: t("Directed Acyclic Graphs", "有向无环图"),
  summary: t(
    "A directed acyclic graph (DAG) has no directed cycle. Every finite DAG has at least one source (in-degree 0) and at least one sink (out-degree 0); a directed graph is acyclic exactly when repeatedly deleting sources removes every vertex.",
    "有向无环图（DAG）没有有向圈。每个有限 DAG 至少有一个源（入度为 0）和一个汇（出度为 0）；一个有向图无环当且仅当反复删去源能删去所有顶点。",
  ),
  prerequisites: ["walks-paths-and-distances-in-directed-graphs", "cycles-in-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-directed-acyclic-graphs",
      title: t("Recognizing DAGs", "判断有向无环图"),
      explanation: t(
        "Repeatedly delete a vertex with no incoming arcs. If you can delete every vertex, the graph is acyclic; if you get stuck, the remaining vertices all have incoming arcs and contain a directed cycle.",
        "反复删去没有入弧的顶点。若能删去所有顶点，图是无环的；若中途卡住，剩下的顶点都有入弧，其中含有向圈。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        const m = rng.int(n, n + 3);
        const g = rng.bool() ? randomDag(rng, n, m) : randomCyclic(rng, n, m - 2);
        const yes = isAcyclic(g);
        return fig(
          choiceProblem({
            prompt: t(`${digraphIntro(g).en} Is $G$ acyclic?`, `${digraphIntro(g)["zh-CN"]}$G$ 是无环的吗？`),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: yes
              ? t(
                  `Deleting sources one at a time removes every vertex, in the order $${kahn(g).map(vx).join(", ")}$, so $G$ is acyclic.`,
                  `逐个删去源可以删去所有顶点，顺序为 $${kahn(g).map(vx).join(", ")}$，所以 $G$ 无环。`,
                )
              : t(
                  "Deleting sources gets stuck while vertices remain, each with an incoming arc, so $G$ contains a directed cycle.",
                  "逐个删去源时会卡住，剩下的顶点都有入弧，所以 $G$ 含有向圈。",
                ),
          }),
          g,
          { directed: true },
        );
      },
    },
    {
      id: "sources-and-sinks",
      title: t("Sources and sinks", "源与汇"),
      explanation: t(
        "A source has no incoming arcs and a sink has no outgoing arcs. In the DAG with arcs $(A, B), (A, C), (B, D), (C, D)$, the only source is $A$ and the only sink is $D$.",
        "源没有入弧，汇没有出弧。在弧为 $(A, B), (A, C), (B, D), (C, D)$ 的 DAG 中，唯一的源是 $A$，唯一的汇是 $D$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomDag(rng, n, rng.int(n - 1, n + 3));
        const askSources = rng.bool();
        const ins = range(0, n - 1).map((v) => g.edges.filter(([, b]) => b === v).length);
        const outs = range(0, n - 1).map((v) => g.edges.filter(([a]) => a === v).length);
        const sources = range(0, n - 1).filter((v) => ins[v] === 0);
        const sinks = range(0, n - 1).filter((v) => outs[v] === 0);
        const list = askSources ? sources : sinks;
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many ${askSources ? "sources" : "sinks"} does $G$ have?`,
              `${digraphIntro(g)["zh-CN"]}$G$ 有多少个${askSources ? "源" : "汇"}？`,
            ),
            answer: list.length,
            wrong: [(askSources ? sinks : sources).length, list.length + 1, Math.max(1, list.length - 1)],
            solution: t(
              `The vertices with no ${askSources ? "incoming" : "outgoing"} arcs are ${list.map((v) => `$${vx(v)}$`).join(", ")}: $${list.length}$.`,
              `没有${askSources ? "入" : "出"}弧的顶点为 ${list.map((v) => `$${vx(v)}$`).join("、")}：共 $${list.length}$ 个。`,
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** countTopologicalOrders counts the topological orderings of a DAG by brute force. */
function countTopologicalOrders(g: Graph): number {
  const preds = range(0, g.n - 1).map((v) => g.edges.filter(([, b]) => b === v).map(([a]) => a));
  const go = (placed: Set<number>): number => {
    if (placed.size === g.n) return 1;
    let total = 0;
    for (let v = 0; v < g.n; v++) {
      if (!placed.has(v) && preds[v]!.every((p) => placed.has(p))) {
        placed.add(v);
        total += go(placed);
        placed.delete(v);
      }
    }
    return total;
  };
  return go(new Set());
}

/** topologicalOrdering checks and counts orderings compatible with every arc. */
export const topologicalOrdering: TopicDef = {
  id: "topological-ordering",
  title: t("Topological Ordering", "拓扑排序"),
  summary: t(
    "A topological ordering lists the vertices of a directed graph so that every arc points from an earlier vertex to a later one. A directed graph has one exactly when it is acyclic, and it may have many.",
    "拓扑排序把有向图的顶点排成一列，使每条弧都从前面的顶点指向后面的顶点。有向图有拓扑排序当且仅当它无环，而且可能有很多个。",
  ),
  prerequisites: ["directed-acyclic-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-topological-ordering",
      title: t("Checking an ordering", "检验排序"),
      explanation: t(
        "An ordering is topological when every arc goes from an earlier vertex to a later one, so check that no arc points backward. With arcs $(A, C), (B, C), (C, D)$, the order $B, A, C, D$ is topological, but $A, C, B, D$ is not, because the arc $(B, C)$ points backward.",
        "如果每条弧都从排在前面的顶点指向排在后面的顶点，这个顺序就是拓扑序，所以要检查没有弧指向后方。若弧为 $(A, C), (B, C), (C, D)$，则 $B, A, C, D$ 是拓扑排序，而 $A, C, B, D$ 不是，因为弧 $(B, C)$ 指向前面。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        const g = randomDag(rng, n, rng.int(n, n + 3));
        let order = rng.shuffle(range(0, n - 1));
        if (rng.bool()) {
          const placed = new Set<number>();
          order = [];
          while (order.length < n) {
            const ready = range(0, n - 1).filter((v) => !placed.has(v) && g.edges.every(([a, b]) => b !== v || placed.has(a)));
            const v = rng.pick(ready);
            placed.add(v);
            order.push(v);
          }
        }
        const pos = new Map(order.map((v, i) => [v, i] as const));
        const bad = g.edges.filter(([a, b]) => pos.get(a)! > pos.get(b)!);
        return fig(
          choiceProblem({
            prompt: t(
              `${digraphIntro(g).en} Is $${order.map(vx).join(", ")}$ a topological ordering of $G$?`,
              `${digraphIntro(g)["zh-CN"]}$${order.map(vx).join(", ")}$ 是 $G$ 的拓扑排序吗？`,
            ),
            options: yesNo,
            correct: bad.length === 0 ? 0 : 1,
            solution:
              bad.length === 0
                ? t("Every arc goes from an earlier vertex to a later one, so it is.", "每条弧都从前面的顶点指向后面的顶点，所以是。")
                : t(
                    `No: the arc $(${vx(bad[0]![0])}, ${vx(bad[0]![1])})$ points backward.`,
                    `不是：弧 $(${vx(bad[0]![0])}, ${vx(bad[0]![1])})$ 指向前面。`,
                  ),
          }),
          g,
          { directed: true },
        );
      },
    },
    {
      id: "counting-topological-orderings",
      title: t("Counting orderings", "计数排序"),
      explanation: t(
        "With arcs $(A, B), (A, C)$ on $\\{A, B, C, D\\}$, $A$ must precede $B$ and $C$, and $D$ is free. Placing $A, B, C$ in $2$ ways and inserting $D$ in any of $4$ positions gives $8$ orderings.",
        "在 $\\{A, B, C, D\\}$ 上有弧 $(A, B), (A, C)$，则 $A$ 必须在 $B$、$C$ 之前，$D$ 不受限制。排列 $A, B, C$ 有 $2$ 种方法，再把 $D$ 插入 $4$ 个位置之一，共 $8$ 种排序。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomDag(rng, n, rng.int(n - 1, n + 1));
        const value = countTopologicalOrders(g);
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many topological orderings does $G$ have?`,
              `${digraphIntro(g)["zh-CN"]}$G$ 有多少种拓扑排序？`,
            ),
            answer: value,
            wrong: [value + 1, value * 2, Math.max(1, value - 1), range(1, n).reduce((p, k) => p * k, 1)],
            solution: t(
              `Building the ordering one vertex at a time, each time choosing among the vertices whose predecessors are all placed, gives $${value}$ orderings.`,
              `逐个放置顶点，每次从前驱都已放置的顶点中选择，共得 $${value}$ 种排序。`,
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** kahnsAlgorithm runs Kahn's algorithm with alphabetical tie-breaks. */
export const kahnsAlgorithm: TopicDef = {
  id: "kahns-algorithm",
  title: t("Kahn's Algorithm", "Kahn 算法"),
  summary: t(
    "Kahn's algorithm builds a topological ordering by repeatedly outputting a vertex of in-degree 0 and deleting its outgoing arcs, updating the in-degrees. If it stops before outputting every vertex, the graph has a directed cycle.",
    "Kahn 算法反复输出一个入度为 0 的顶点并删去它的出弧、更新入度，从而得到拓扑排序。若在输出所有顶点之前停止，则图有有向圈。",
  ),
  prerequisites: ["topological-ordering"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "running-kahns-algorithm",
      title: t("Running the algorithm", "运行算法"),
      explanation: t(
        "With arcs $(B, A), (B, C), (A, D), (C, D)$ and ties broken alphabetically: only $B$ has in-degree $0$, so output $B$; then $A$ and $C$ are available, output $A$, then $C$, then $D$. The ordering is $B, A, C, D$.",
        "若弧为 $(B, A), (B, C), (A, D), (C, D)$，平局时按字母顺序：只有 $B$ 入度为 $0$，输出 $B$；然后 $A$、$C$ 可用，输出 $A$，再输出 $C$，最后 $D$。排序为 $B, A, C, D$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomDag(rng, n, rng.int(n, n + 3));
        const order = kahn(g);
        const v = rng.int(0, n - 1);
        const p = order.indexOf(v) + 1;
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Kahn's algorithm is run on $G$, always choosing the alphabetically first vertex of in-degree $0$. In which position is $${vx(v)}$ output?`,
              `${digraphIntro(g)["zh-CN"]}对 $G$ 运行 Kahn 算法，每次选择入度为 $0$ 的顶点中字母序最前的一个。$${vx(v)}$ 是第几个输出的？`,
            ),
            answer: p,
            wrong: [p + 1, p - 1, v + 1, bfs(g, order[0]!, true).dist[v]! + 1].filter((x) => Number.isFinite(x) && x >= 1),
            solution: t(
              `The algorithm outputs $${order.map(vx).join(", ")}$, so $${vx(v)}$ is in position $${p}$.`,
              `算法依次输出 $${order.map(vx).join(", ")}$，所以 $${vx(v)}$ 是第 $${p}$ 个。`,
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
    {
      id: "in-degrees-during-kahns-algorithm",
      title: t("Updating in-degrees", "更新入度"),
      explanation: t(
        "After a vertex is output, its outgoing arcs are deleted and each target's in-degree drops by $1$. The vertices available next are those whose in-degree has reached $0$.",
        "输出一个顶点后，删去它的出弧，每个终点的入度减 $1$。接下来可用的顶点是入度已降为 $0$ 的那些。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomDag(rng, n, rng.int(n + 1, n + 4));
        const order = kahn(g);
        const k = rng.int(1, n - 2);
        const removed = new Set(order.slice(0, k));
        const indeg = range(0, n - 1).map((v) => g.edges.filter(([a, b]) => b === v && !removed.has(a)).length);
        const available = range(0, n - 1).filter((v) => !removed.has(v) && indeg[v] === 0);
        const initial = range(0, n - 1).filter((v) => g.edges.every(([, b]) => b !== v)).length;
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Kahn's algorithm is run on $G$, always choosing the alphabetically first vertex of in-degree $0$. After ${k === 1 ? "the first vertex has" : `the first $${k}$ vertices have`} been output, how many remaining vertices have in-degree $0$?`,
              `${digraphIntro(g)["zh-CN"]}对 $G$ 运行 Kahn 算法，每次选择入度为 $0$ 的顶点中字母序最前的一个。输出前 $${k}$ 个顶点后，剩下的顶点中有多少个入度为 $0$？`,
            ),
            answer: available.length,
            wrong: [initial, available.length + 1, available.length - 1].filter((x) => x >= 1),
            solution: t(
              `The output so far is $${order.slice(0, k).map(vx).join(", ")}$. Deleting the arcs leaving these vertices leaves in-degree $0$ at ${available.map((v) => `$${vx(v)}$`).join(", ")}: $${available.length}$.`,
              `前 $${k}$ 个输出为 $${order.slice(0, k).map(vx).join(", ")}$。删去它们的弧后，入度为 $0$ 的顶点为 ${available.map((v) => `$${vx(v)}$`).join("、")}：共 $${available.length}$ 个。`,
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** breadthFirstSearch runs BFS with alphabetical tie-breaks. */
export const breadthFirstSearch: TopicDef = {
  id: "breadth-first-search",
  title: t("Breadth-First Search", "广度优先搜索"),
  summary: t(
    "Breadth-first search from s visits s, then all its neighbors, then their unvisited neighbors, and so on, using a queue. It visits vertices in order of distance from s, layer by layer.",
    "从 s 出发的广度优先搜索先访问 s，再访问它的所有邻点，然后是这些邻点尚未访问的邻点，依此类推，用队列实现。它按与 s 的距离逐层访问顶点。",
  ),
  prerequisites: ["connected-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-order-of-a-breadth-first-search",
      title: t("The visiting order", "访问顺序"),
      explanation: t(
        "From $A$ with neighbors taken alphabetically: visit $A$, queue its neighbors $B, D$; visit $B$ and queue its new neighbors, then $D$ and its new neighbors, and so on. Each vertex is visited when it leaves the queue.",
        "从 $A$ 出发，邻点按字母顺序处理：访问 $A$，把邻点 $B, D$ 入队；访问 $B$ 并把它的新邻点入队，再访问 $D$ 并把它的新邻点入队，依此类推。每个顶点在出队时被访问。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const { order } = bfs(g, 0);
        const v = rng.int(1, n - 1);
        const p = order.indexOf(v) + 1;
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} A breadth-first search starts at $A$ and adds neighbors to the queue in alphabetical order. In which position is $${vx(v)}$ visited ($A$ is visited first)?`,
              `${graphIntro(g)["zh-CN"]}从 $A$ 开始广度优先搜索，邻点按字母顺序入队。$${vx(v)}$ 是第几个被访问的（$A$ 是第一个）？`,
            ),
            answer: p,
            wrong: [p + 1, p - 1, v + 1, bfs(g, 0).dist[v]! + 1].filter((x) => x >= 2),
            solution: t(
              `The search visits $${order.map(vx).join(", ")}$, so $${vx(v)}$ is in position $${p}$.`,
              `搜索依次访问 $${order.map(vx).join(", ")}$，所以 $${vx(v)}$ 是第 $${p}$ 个。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "layers-of-a-breadth-first-search",
      title: t("Layers", "层"),
      explanation: t(
        "Breadth-first search from $s$ finds the vertices in layers: layer $k$ is the set of vertices at distance $k$ from $s$, found as the unvisited neighbors of layer $k - 1$.",
        "从 $s$ 出发的广度优先搜索逐层找到顶点：第 $k$ 层是与 $s$ 距离为 $k$ 的顶点，它们是第 $k - 1$ 层的尚未访问的邻点。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(0, 2));
        const s = rng.int(0, n - 1);
        const { dist } = bfs(g, s);
        const max = Math.max(...dist);
        const k = rng.int(1, Math.max(1, max));
        const layer = range(0, n - 1).filter((v) => dist[v] === k);
        const upTo = range(0, n - 1).filter((v) => dist[v]! <= k && dist[v]! > 0).length;
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} A breadth-first search starts at $${vx(s)}$. How many vertices are at distance exactly $${k}$ from $${vx(s)}$?`,
              `${graphIntro(g)["zh-CN"]}从 $${vx(s)}$ 开始广度优先搜索。与 $${vx(s)}$ 的距离恰为 $${k}$ 的顶点有多少个？`,
            ),
            answer: layer.length,
            wrong: [upTo, layer.length + 1, degrees(g)[s]!].filter((x) => x >= 1),
            solution: t(
              `Layer $${k}$ is ${layer.map((v) => `$${vx(v)}$`).join(", ")}: $${layer.length}$ vertices.`,
              `第 $${k}$ 层为 ${layer.map((v) => `$${vx(v)}$`).join("、")}：共 $${layer.length}$ 个顶点。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** kruskalsAlgorithm finds minimum spanning trees by adding the lightest safe edges. */
export const kruskalsAlgorithm: TopicDef = {
  id: "kruskals-algorithm",
  title: t("Kruskal's Algorithm", "Kruskal 算法"),
  summary: t(
    "Kruskal's algorithm sorts the edges by weight and adds each one that does not form a cycle with the edges already chosen. It stops after n − 1 edges, which form a minimum spanning tree.",
    "Kruskal 算法把边按权排序，依次加入不会与已选边构成圈的边。选够 n − 1 条边后停止，它们构成最小生成树。",
  ),
  prerequisites: ["trees-and-forests"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-weight-of-a-minimum-spanning-tree",
      title: t("The minimum weight", "最小权"),
      explanation: t(
        "Take edges in increasing weight, skipping any that would close a cycle. With weights $AB\\colon 1$, $BC\\colon 2$, $AC\\colon 3$, $CD\\colon 4$: take $AB$, $BC$, skip $AC$, take $CD$; the minimum spanning tree has weight $7$.",
        "按权从小到大取边，跳过会构成圈的边。若权为 $AB\\colon 1$、$BC\\colon 2$、$AC\\colon 3$、$CD\\colon 4$：取 $AB$、$BC$，跳过 $AC$，取 $CD$；最小生成树的权为 $7$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const added = kruskal(g);
        const value = sum(added);
        const naive = sum([...g.weights].sort((a, b) => a - b).slice(0, n - 1));
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Find the total weight of a minimum spanning tree.`,
              `${weightedIntro(g)["zh-CN"]}求最小生成树的总权。`,
            ),
            answer: value,
            wrong: [naive === value ? value + 1 : naive, value - Math.min(...added), sum(g.weights) - value],
            solution: t(
              `Kruskal's algorithm adds edges of weights $${added.join(", ")}$, for a total of $${value}$.`,
              `Kruskal 算法依次加入权为 $${added.join(", ")}$ 的边，总权为 $${value}$。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
    {
      id: "steps-of-kruskals-algorithm",
      title: t("The steps", "步骤"),
      explanation: t(
        "Kruskal's algorithm may skip edges: an edge whose ends are already joined by chosen edges would form a cycle. So the $k$th edge added is not always the $k$th lightest edge.",
        "Kruskal 算法可能跳过一些边：两端已经被已选边连通的边会构成圈。所以加入的第 $k$ 条边不一定是第 $k$ 轻的边。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(3, 5));
        const added = kruskal(g);
        const sorted = [...g.weights].sort((a, b) => a - b);
        const k = rng.int(3, n - 1);
        const value = added[k - 1]!;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Kruskal's algorithm is used to build a minimum spanning tree. What is the weight of the ${ordinal(k)} edge it adds?`,
              `${weightedIntro(g)["zh-CN"]}用 Kruskal 算法构造最小生成树。它加入的第 $${k}$ 条边的权是多少？`,
            ),
            answer: value,
            wrong: [sorted[k - 1]!, added[k - 2]!, added[k] ?? value + 1, sorted[k]!],
            solution: t(
              `The edges added have weights $${added.join(", ")}$, so the ${ordinal(k)} has weight $${value}$.`,
              `依次加入的边权为 $${added.join(", ")}$，所以第 $${k}$ 条的权为 $${value}$。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
  ],
};

/** primsAlgorithm grows a minimum spanning tree from a starting vertex. */
export const primsAlgorithm: TopicDef = {
  id: "prims-algorithm",
  title: t("Prim's Algorithm", "Prim 算法"),
  summary: t(
    "Prim's algorithm grows a tree from a starting vertex, each time adding the lightest edge that joins the tree to a vertex outside it. After n − 1 steps it has a minimum spanning tree.",
    "Prim 算法从一个起点开始生长一棵树，每次加入连接树与树外顶点的最轻边。经过 n − 1 步得到最小生成树。",
  ),
  prerequisites: ["trees-and-forests"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-added-by-prims-algorithm",
      title: t("The edges added", "加入的边"),
      explanation: t(
        "Unlike Kruskal's algorithm, Prim's algorithm only considers edges leaving the current tree. Starting at $A$ with $AB\\colon 5$, $AC\\colon 2$, $CB\\colon 1$, it adds $AC$ first and then $CB$, never $AB$.",
        "与 Kruskal 算法不同，Prim 算法只考虑离开当前树的边。从 $A$ 出发，若 $AB\\colon 5$、$AC\\colon 2$、$CB\\colon 1$，则先加入 $AC$，再加入 $CB$，不会加入 $AB$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const { weights, vertices } = prim(n, weightOf(g));
        const k = rng.int(2, n - 1);
        const value = weights[k - 1]!;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Prim's algorithm is run starting from $A$. What is the weight of the ${ordinal(k)} edge it adds?`,
              `${weightedIntro(g)["zh-CN"]}从 $A$ 开始运行 Prim 算法。它加入的第 $${k}$ 条边的权是多少？`,
            ),
            answer: value,
            wrong: [kruskal(g)[k - 1]!, weights[k - 2]!, weights[k] ?? value + 1, [...g.weights].sort((a, b) => a - b)[k - 1]!],
            solution: t(
              `The tree grows by the vertices $${vertices.map(vx).join(", ")}$ through edges of weights $${weights.join(", ")}$; the ${ordinal(k)} has weight $${value}$.`,
              `树依次加入顶点 $${vertices.map(vx).join(", ")}$，所用边的权为 $${weights.join(", ")}$；第 $${k}$ 条的权为 $${value}$。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
    {
      id: "the-order-prims-algorithm-adds-vertices",
      title: t("The order of the vertices", "顶点的加入顺序"),
      explanation: t(
        "Prim's algorithm adds one new vertex at each step. Track the tree's vertices and, at each step, the lightest edge from them to the rest.",
        "Prim 算法每一步加入一个新顶点。记录树中的顶点，每一步找出从它们到其余顶点的最轻边。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const { vertices } = prim(n, weightOf(g));
        const v = rng.int(1, n - 1);
        const step = vertices.indexOf(v);
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Prim's algorithm is run starting from $A$. At which step is $${vx(v)}$ added to the tree (the first edge added is step $1$)?`,
              `${weightedIntro(g)["zh-CN"]}从 $A$ 开始运行 Prim 算法。$${vx(v)}$ 在第几步加入树中（加入第一条边为第 $1$ 步）？`,
            ),
            answer: step,
            wrong: [step + 1, step - 1, v, bfs(g, 0).dist[v]!].filter((x) => x >= 1),
            solution: t(
              `The vertices join in the order $${vertices.map(vx).join(", ")}$, so $${vx(v)}$ joins at step $${step}$.`,
              `顶点加入的顺序为 $${vertices.map(vx).join(", ")}$，所以 $${vx(v)}$ 在第 $${step}$ 步加入。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
  ],
};

/** randomWeightMatrix builds a symmetric matrix of distinct weights for a complete graph. */
function randomWeightMatrix(rng: Rng, n: number): number[][] {
  const ws = rng.sample(range(1, 40), (n * (n - 1)) / 2);
  const M = range(0, n - 1).map(() => range(0, n - 1).map(() => 0));
  let k = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      M[i]![j] = ws[k]!;
      M[j]![i] = ws[k]!;
      k++;
    }
  return M;
}

/** applyingPrimsAlgorithmToADistanceMatrix runs Prim's algorithm on a table of weights. */
export const applyingPrimsAlgorithmToADistanceMatrix: TopicDef = {
  id: "applying-prims-algorithm-to-a-distance-matrix",
  title: t("Applying Prim's Algorithm to a Distance Matrix", "在距离矩阵上应用 Prim 算法"),
  summary: t(
    "When a complete weighted graph is given as a matrix, Prim's algorithm works on the table: cross out the rows of vertices in the tree, and at each step pick the smallest entry in their columns among the rows not yet crossed out.",
    "当完全带权图以矩阵给出时，Prim 算法可以直接在表上进行：划去树中顶点所在的行，每一步在这些顶点的列中、尚未划去的行里选最小的元。",
  ),
  prerequisites: ["prims-algorithm", "distance-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "minimum-spanning-trees-from-a-matrix",
      title: t("The minimum weight", "最小权"),
      explanation: t(
        "Start with column $A$. Pick its smallest entry in a row not yet in the tree, say row $C$; add $C$ and include column $C$. Repeat with the columns of all tree vertices until every vertex is in the tree, then add the chosen entries.",
        "从 $A$ 列开始。在尚未加入树的行中选出该列最小的元，比如 $C$ 行；加入 $C$，并把 $C$ 列也纳入考虑。对所有树中顶点的列重复此步，直到所有顶点都在树中，再把选出的元相加。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const M = randomWeightMatrix(rng, n);
        const { weights, vertices } = prim(n, (a, b) => M[a]![b]!);
        const value = sum(weights);
        const shown = M.map((r, i) => r.map((x, j) => (i === j ? "-" : x)));
        const rowMins = sum(M.slice(1).map((r, i) => Math.min(...r.filter((_, j) => j !== i + 1))));
        return numberProblem({
          prompt: t(
            `The weights of the edges of a complete graph on $${orderTex(n)}$ are given by the matrix $${matTex(shown)}$. Use Prim's algorithm from $A$ to find the total weight of a minimum spanning tree.`,
            `顶点为 $${orderTex(n)}$ 的完全图的边权由矩阵 $${matTex(shown)}$ 给出。从 $A$ 开始用 Prim 算法求最小生成树的总权。`,
          ),
          answer: value,
          wrong: [rowMins === value ? value + 1 : rowMins, sum(M[0]!), value - weights[weights.length - 1]!],
          solution: t(
            `The vertices join in the order $${vertices.map(vx).join(", ")}$ with entries $${weights.join(", ")}$, for a total of $${value}$.`,
            `顶点依次加入 $${vertices.map(vx).join(", ")}$，所选的元为 $${weights.join(", ")}$，总权为 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "steps-of-prims-algorithm-on-a-matrix",
      title: t("The steps", "步骤"),
      explanation: t(
        "At each step only the columns of the vertices already in the tree are searched, and only in rows of vertices outside it. The entry chosen gives both the edge's weight and the vertex added.",
        "每一步只在已在树中的顶点所在的列里搜索，并且只看树外顶点所在的行。选出的元同时给出边的权和加入的顶点。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const M = randomWeightMatrix(rng, n);
        const { weights, vertices } = prim(n, (a, b) => M[a]![b]!);
        const k = rng.int(2, n - 1);
        const value = weights[k - 1]!;
        const shown = M.map((r, i) => r.map((x, j) => (i === j ? "-" : x)));
        const lightest = [...new Set(M.flat().filter((x) => x > 0))].sort((a, b) => a - b);
        return numberProblem({
          prompt: t(
            `The weights of the edges of a complete graph on $${orderTex(n)}$ are given by the matrix $${matTex(shown)}$. Prim's algorithm is run from $A$. What is the weight of the ${ordinal(k)} edge it adds?`,
            `顶点为 $${orderTex(n)}$ 的完全图的边权由矩阵 $${matTex(shown)}$ 给出。从 $A$ 开始运行 Prim 算法。它加入的第 $${k}$ 条边的权是多少？`,
          ),
          answer: value,
          wrong: [
            lightest[k - 1]!,
            weights[k - 2]!,
            Math.min(...M[vertices[k - 1]!]!.filter((x, j) => x > 0 && !vertices.slice(0, k).includes(j))),
          ].filter(Number.isFinite),
          solution: t(
            `The vertices join in the order $${vertices.map(vx).join(", ")}$ with entries $${weights.join(", ")}$; the ${ordinal(k)} is $${value}$.`,
            `顶点依次加入 $${vertices.map(vx).join(", ")}$，所选的元为 $${weights.join(", ")}$；第 $${k}$ 个为 $${value}$。`,
          ),
        });
      },
    },
  ],
};

/** countShortestPaths counts the shortest paths from s to every vertex. */
function countShortestPaths(g: Graph, s: number): number[] {
  const { dist, order } = bfs(g, s);
  const adj = neighbors(g);
  const count = range(0, g.n - 1).map((v) => (v === s ? 1 : 0));
  for (const u of order) for (const w of adj[u]!) if (dist[w] === dist[u]! + 1) count[w]! += count[u]!;
  return count;
}

/** shortestPathsInUnweightedGraphs counts shortest paths and finds diameters. */
export const shortestPathsInUnweightedGraphs: TopicDef = {
  id: "shortest-paths-in-unweighted-graphs",
  title: t("Shortest Paths in Unweighted Graphs", "无权图中的最短路径"),
  summary: t(
    "Breadth-first search finds shortest paths in an unweighted graph. The number of shortest paths from s to v is the sum of those to the neighbors of v one layer closer to s. The diameter is the largest distance between two vertices.",
    "广度优先搜索可以求无权图中的最短路径。从 s 到 v 的最短路径数等于到 v 的那些更靠近 s 一层的邻点的最短路径数之和。直径是两个顶点之间的最大距离。",
  ),
  prerequisites: ["breadth-first-search"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-shortest-paths",
      title: t("Counting shortest paths", "数最短路径"),
      explanation: t(
        "Label $s$ with $1$. Going layer by layer, label each vertex with the sum of the labels of its neighbors in the previous layer. In a $4$-cycle $A, B, C, D$, vertex $C$ gets $1 + 1 = 2$: the shortest paths $A, B, C$ and $A, D, C$.",
        "给 $s$ 标 $1$。逐层进行，每个顶点的标号等于它在上一层的邻点的标号之和。在 $4$-圈 $A, B, C, D$ 中，$C$ 的标号为 $1 + 1 = 2$：最短路径为 $A, B, C$ 和 $A, D, C$。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        let g: Graph;
        let v: number;
        let counts: number[];
        let dist: number[];
        do {
          g = randomConnected(rng, n, rng.int(2, 5));
          counts = countShortestPaths(g, 0);
          dist = bfs(g, 0).dist;
          v = rng.int(1, n - 1);
        } while (dist[v]! < 2 || (counts[v]! < 2 && rng.bool(0.7)));
        const value = counts[v]!;
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many shortest paths are there from $A$ to $${vx(v)}$?`,
              `${graphIntro(g)["zh-CN"]}从 $A$ 到 $${vx(v)}$ 的最短路径有多少条？`,
            ),
            answer: value,
            wrong: [dist[v]!, value + 1, degrees(g)[v]!, Math.max(1, value - 1)],
            solution: t(
              `$d(A, ${vx(v)}) = ${dist[v]}$. Labeling layer by layer, the numbers of shortest paths from $A$ are ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${counts[u]}$`)
                .join(", ")}, so the number of shortest paths is $${value}$.`,
              `$d(A, ${vx(v)}) = ${dist[v]}$。逐层标号，从 $A$ 出发的最短路径数为 ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${counts[u]}$`)
                .join("、")}，所以共 $${value}$ 条。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "the-diameter-of-a-graph",
      title: t("The diameter", "直径"),
      explanation: t(
        "The diameter is $\\max_{u, v} d(u, v)$. Run a breadth-first search from every vertex and take the largest distance found. A path on $n$ vertices has diameter $n - 1$; a complete graph has diameter $1$.",
        "直径是 $\\max_{u, v} d(u, v)$。从每个顶点出发做广度优先搜索，取找到的最大距离。$n$ 个顶点的路径的直径为 $n - 1$；完全图的直径为 $1$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomConnected(rng, n, rng.int(0, 3));
        const ecc = range(0, n - 1).map((s) => Math.max(...bfs(g, s).dist));
        const value = Math.max(...ecc);
        const pair = range(0, n - 1)
          .flatMap((u) => range(u + 1, n - 1).map((w) => [u, w] as const))
          .find(([u, w]) => bfs(g, u).dist[w] === value)!;
        return fig(
          numberProblem({
            prompt: t(`${graphIntro(g).en} What is the diameter of $G$?`, `${graphIntro(g)["zh-CN"]}$G$ 的直径是多少？`),
            answer: value,
            wrong: [ecc[0]! === value ? value + 1 : ecc[0]!, Math.min(...ecc), value - 1, n - 1].filter((x) => x >= 1),
            solution: t(
              `The largest distance is $d(${vx(pair[0])}, ${vx(pair[1])}) = ${value}$, so the diameter is $${value}$.`,
              `最大距离为 $d(${vx(pair[0])}, ${vx(pair[1])}) = ${value}$，所以直径为 $${value}$。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** dijkstrasAlgorithm finds shortest weighted distances. */
export const dijkstrasAlgorithm: TopicDef = {
  id: "dijkstras-algorithm",
  title: t("Dijkstra's Algorithm", "Dijkstra 算法"),
  summary: t(
    "Dijkstra's algorithm finds shortest distances from s in a graph with nonnegative weights. It repeatedly finalizes the unvisited vertex with the smallest tentative distance and relaxes the edges leaving it: d(v) ← min(d(v), d(u) + w(u, v)).",
    "Dijkstra 算法求非负权图中从 s 出发的最短距离。它反复确定暂定距离最小的未访问顶点，并松弛从它出发的边：d(v) ← min(d(v), d(u) + w(u, v))。",
  ),
  prerequisites: ["shortest-paths-in-unweighted-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "shortest-weighted-distances",
      title: t("Shortest distances", "最短距离"),
      explanation: t(
        "Dijkstra's algorithm repeatedly finalizes the closest unfinished vertex and updates its neighbors, which works because weights are never negative. With $AB\\colon 4$, $AC\\colon 1$, $CB\\colon 2$: start $d(A) = 0$; finalize $A$, so $d(B) = 4$, $d(C) = 1$; finalize $C$, and $d(B) = \\min(4, 1 + 2) = 3$. The direct edge is not always shortest.",
        "迪杰斯特拉算法反复确定距离最近的未完成顶点并更新它的邻居，这之所以可行，是因为权重从不为负。若 $AB\\colon 4$、$AC\\colon 1$、$CB\\colon 2$：开始 $d(A) = 0$；确定 $A$，得 $d(B) = 4$，$d(C) = 1$；确定 $C$，$d(B) = \\min(4, 1 + 2) = 3$。直接的边不一定最短。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        let g: WeightedGraph;
        let v: number;
        let dist: number[];
        do {
          g = randomWeighted(rng, n, rng.int(2, 4), 15);
          dist = dijkstra(g).dist;
          v = rng.int(1, n - 1);
        } while (bfs(g, 0).dist[v]! < 2 && rng.bool(0.7));
        const value = dist[v]!;
        const direct = weightOf(g)(0, v);
        const hops = bfs(g, 0).dist[v]!;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Find the length of a shortest path from $A$ to $${vx(v)}$.`,
              `${weightedIntro(g)["zh-CN"]}求从 $A$ 到 $${vx(v)}$ 的最短路径的长度。`,
            ),
            answer: value,
            wrong: [...(direct !== undefined && direct !== value ? [direct] : []), hops, value + 1, value + Math.min(...g.weights)],
            solution: t(
              `Dijkstra's algorithm from $A$ gives the distances ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${dist[u]}$`)
                .join(", ")}, so the answer is $${value}$.`,
              `从 $A$ 出发运行 Dijkstra 算法，得距离为 ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${dist[u]}$`)
                .join("、")}，所以答案为 $${value}$。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
    {
      id: "the-order-dijkstras-algorithm-finalizes-vertices",
      title: t("The order of finalization", "确定顺序"),
      explanation: t(
        "Dijkstra's algorithm finalizes vertices in increasing order of their distance from the start, which can differ from the order of the number of edges on their shortest paths.",
        "Dijkstra 算法按与起点距离从小到大的顺序确定顶点，这可能与最短路径所含边数的顺序不同。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4), 15);
        const { dist, order } = dijkstra(g);
        const v = rng.int(1, n - 1);
        const p = order.indexOf(v) + 1;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Dijkstra's algorithm is run from $A$, breaking ties alphabetically. In which position is $${vx(v)}$ finalized ($A$ is first)?`,
              `${weightedIntro(g)["zh-CN"]}从 $A$ 开始运行 Dijkstra 算法，平局时按字母顺序。$${vx(v)}$ 是第几个被确定的（$A$ 是第一个）？`,
            ),
            answer: p,
            wrong: [p + 1, p - 1, bfs(g, 0).order.indexOf(v) + 1, v + 1].filter((x) => x >= 2),
            solution: t(
              `The final distances are ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${dist[u]}$`)
                .join(
                  ", ",
                )}, so the vertices are finalized in the order $${order.map(vx).join(", ")}$ and $${vx(v)}$ is in position $${p}$.`,
              `最终距离为 ${range(0, n - 1)
                .map((u) => `$${vx(u)}\\colon ${dist[u]}$`)
                .join("、")}，所以确定的顺序为 $${order.map(vx).join(", ")}$，$${vx(v)}$ 是第 $${p}$ 个。`,
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
  ],
};

/** discreteMathematicsGraphAlgorithmTopics are the topics of Discrete Mathematics unit 7 on matrices, DAGs and graph algorithms. */
export const discreteMathematicsGraphAlgorithmTopics: readonly TopicDef[] = [
  incidenceMatrices,
  adjacencyMatrices,
  adjacencyMatricesOfDirectedGraphs,
  distanceMatrices,
  directedAcyclicGraphs,
  topologicalOrdering,
  kahnsAlgorithm,
  breadthFirstSearch,
  kruskalsAlgorithm,
  primsAlgorithm,
  applyingPrimsAlgorithmToADistanceMatrix,
  shortestPathsInUnweightedGraphs,
  dijkstrasAlgorithm,
];
