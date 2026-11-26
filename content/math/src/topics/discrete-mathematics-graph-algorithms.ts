import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { discreteDrawings2 } from "../explanation-drawings-discrete-mathematics-2.ts";

import { numberProblem, verdictChoice, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
import {
  adjacencyMatrix,
  allArcs,
  allPairs,
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

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** distinct keeps the finite mistakes that differ from the answer, each value once. */
const distinct = (answer: number, ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i, all) => Number.isFinite(m.value as number) && m.value !== answer && all.findIndex((o) => o.value === m.value) === i);

/** letters writes vertices as separate formulas: "$A$, $B$" in English, "$A$、$B$" in Chinese. */
const letters = (vs: readonly number[], zh = false) => vs.map((v) => `$${vx(v)}$`).join(zh ? "、" : ", ");

/** times writes a product of numbers, leaving out factors of one: "3 \cdot 4", "5". */
const times = (...fs: readonly number[]) => {
  const kept = fs.filter((f) => f !== 1);
  return kept.length === 0 ? "1" : kept.join(" \\cdot ");
};

/** addUp adds the entries of values where ones has a 1: "2 + 1 = 3", or the total alone when at most one entry is picked. */
const addUp = (values: readonly number[], ones: readonly number[], total: number) => {
  const kept = values.filter((_, k) => ones[k] === 1);
  return kept.length <= 1 ? `${total}` : `${kept.join(" + ")} = ${total}`;
};

/** onesAt lists the positions of the 1s in a row or column. */
const onesAt = (xs: readonly number[]) => range(0, xs.length - 1).filter((k) => xs[k] === 1);

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

/** columnsTex names edge columns: "$e_1$, $e_3$". */
const columnsTex = (cols: readonly number[], zh = false) => cols.map((c) => `$e_{${c + 1}}$`).join(zh ? "、" : ", ");

/** incidenceMatrices reads degrees and edges from incidence matrices. */
export const incidenceMatrices: TopicDef = {
  id: "incidence-matrices",
  title: t("Incidence Matrices", "关联矩阵"),
  summary: t(
    "The incidence matrix of a loopless graph has a row for each vertex and a column for each edge, with a 1 where the vertex lies on the edge. Each column has two 1s, and the sum of a row is the degree of its vertex.",
    "无环图的关联矩阵每个顶点对应一行、每条边对应一列，顶点在边上时该位置为 1。每列有两个 1，每行之和是对应顶点的度。",
  ),
  intro: t(
    "A graph with $8$ vertices and $12$ edges has an incidence matrix with $8$ rows and $12$ columns. Each column marks the two ends of its edge, so the matrix holds $2 \\cdot 12 = 24$ ones, and each row holds as many ones as its vertex has edges.\n\nCheck: the row sums are the degrees, and by the handshaking lemma the degrees add up to twice the number of edges, $24$, the same count of ones.\n\nIn this lesson we read the degree of a vertex from its row, find the edges joining two vertices from the columns, and count the ones in an incidence matrix.",
    "一个有 $8$ 个顶点、$12$ 条边的图，其关联矩阵有 $8$ 行 $12$ 列。每一列标出它那条边的两个端点，所以矩阵中共有 $2 \\cdot 12 = 24$ 个 $1$；每一行的 $1$ 的个数等于该顶点所在的边数。\n\n检验：各行之和就是各顶点的度，由握手引理，度数之和是边数的两倍，即 $24$，与 $1$ 的个数相同。\n\n本课我们由一行读出顶点的度，由各列找出连接两个顶点的边，并数关联矩阵中 $1$ 的个数。",
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
        "Each column of an incidence matrix is an edge, and a $1$ in the row of a vertex means the vertex lies on that edge. So the degree of a vertex is the number of $1$s in its row. In a graph with $12$ edges, if the row of $F$ has $1$s in columns $e_2$, $e_5$, $e_7$, $e_8$ and $e_{11}$, then $F$ lies on those five edges and $\\deg(F) = 5$.\n\n> **Watch out.** Count the $1$s along the row of the vertex, not down a column: every column holds exactly two $1$s, one for each end of its edge. And each $1$ in the row is one edge, so do not double the count.",
        "关联矩阵的每一列是一条边，某顶点所在行中的 $1$ 表示该顶点在这条边上。所以顶点的度就是它所在行中 $1$ 的个数。在一个有 $12$ 条边的图中，若 $F$ 所在行在 $e_2$、$e_5$、$e_7$、$e_8$、$e_{11}$ 列为 $1$，则 $F$ 在这五条边上，$\\deg(F) = 5$。\n\n> **注意。** 要沿该顶点所在的行数 $1$，而不是沿一列往下数：每一列恰有两个 $1$，对应边的两个端点。而且行中的每个 $1$ 就是一条边，不要把个数加倍。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomGraph(rng, n, rng.int(n, n + 2));
        const edges = rng.shuffle(g.edges);
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const row = edges.map(([a, b]) => (a === v || b === v ? 1 : 0));
        const cols = onesAt(row);
        const all = degrees(g);
        return numberProblem({
          prompt: t(
            `The incidence matrix of a graph, with rows for vertices $${orderTex(n)}$ and columns for edges $e_1, \\dots, e_{${edges.length}}$, is $${incidenceTex(n, edges)}$. Find $\\deg(${vx(v)})$.`,
            `一个图的关联矩阵（行依次对应顶点 $${orderTex(n)}$，列对应边 $e_1, \\dots, e_{${edges.length}}$）为 $${incidenceTex(n, edges)}$。求 $\\deg(${vx(v)})$。`,
          ),
          answer: d,
          mistakes: distinct(d, [
            why(
              edges.length - d,
              "That counts the zeros in the row: the edges that do not touch the vertex.",
              "那是数了行中的 $0$：不经过这个顶点的边。",
            ),
            why(
              2,
              "That reads a column: every column has two $1$s, one for each end of its edge.",
              "那是读了一列：每一列都有两个 $1$，对应边的两个端点。",
            ),
            why(
              2 * d,
              "That doubles the count; each $1$ in the row is already one edge.",
              "那是把个数加倍了；行中的每个 $1$ 已经是一条边。",
            ),
            why(d + 1, "That is one too many: count the $1$s in the row again.", "多了一：重新数一遍行中的 $1$。"),
          ]),
          solution: walked(
            [
              [
                ["Read the row", "读出这一行"],
                t(`The row of $${vx(v)}$ is $(${row.join(", ")})$.`, `$${vx(v)}$ 所在行为 $(${row.join(", ")})$。`),
              ],
              [
                ["Count the ones", "数 $1$ 的个数"],
                d === 0
                  ? t(
                      `It has no $1$s, so $${vx(v)}$ lies on no edge and $\\deg(${vx(v)}) = 0$.`,
                      `其中没有 $1$，所以 $${vx(v)}$ 不在任何边上，$\\deg(${vx(v)}) = 0$。`,
                    )
                  : t(
                      `Its $1$s are in ${d === 1 ? "column" : "columns"} ${columnsTex(cols)}, so $${vx(v)}$ lies on $${d}$ ${d === 1 ? "edge" : "edges"} and $\\deg(${vx(v)}) = ${d}$.`,
                      `其中的 $1$ 在 ${columnsTex(cols, true)} 列，所以 $${vx(v)}$ 在 $${d}$ 条边上，$\\deg(${vx(v)}) = ${d}$。`,
                    ),
              ],
            ],
            t(
              `The rows give the degrees $${all.join(", ")}$, which add up to $${all.join(" + ")} = ${2 * edges.length}$, twice the $${edges.length}$ edges, as the handshaking lemma requires.`,
              `各行给出的度为 $${all.join(", ")}$，其和为 $${all.join(" + ")} = ${2 * edges.length}$，是 $${edges.length}$ 条边的两倍，符合握手引理。`,
            ),
          ),
        });
      },
    },
    {
      id: "edges-between-vertices-from-an-incidence-matrix",
      figure: discreteDrawings2["incidence-matrices#edges-between-vertices-from-an-incidence-matrix"],
      title: t("Edges joining two vertices", "连接两个顶点的边"),
      explanation: t(
        "An edge joins $A$ and $B$ exactly when its column has $1$s in rows $A$ and $B$. In a multigraph several columns can do so: those are parallel edges. In the drawing, columns $e_1$ and $e_2$ both have $1$s in rows $A$ and $B$, so two parallel edges join $A$ and $B$, while $e_3$ joins $B$ and $C$. In a multigraph with $9$ edges, if columns $e_2$, $e_4$, $e_5$ and $e_8$ have their $1$s in rows $C$ and $F$, then $4$ edges join $C$ and $F$.\n\n> **Watch out.** A column with a $1$ in only one of the two rows is an edge at that vertex leading somewhere else, so do not count it. And the row sum of a vertex counts all its edges, not just those to the other vertex.",
        "一条边连接 $A$ 和 $B$，当且仅当它所在列在 $A$、$B$ 两行都是 $1$。在多重图中可能有好几列如此：它们是平行边。图中 $e_1$ 列和 $e_2$ 列在 $A$、$B$ 两行都是 $1$，所以有两条平行边连接 $A$ 和 $B$，而 $e_3$ 连接 $B$ 和 $C$。在一个有 $9$ 条边的多重图中，若 $e_2$、$e_4$、$e_5$、$e_8$ 列的 $1$ 都在 $C$、$F$ 两行，则有 $4$ 条边连接 $C$ 和 $F$。\n\n> **注意。** 只在两行之一为 $1$ 的列，是该顶点通向别处的边，不要算进去。而一个顶点所在行之和数的是它的所有边，不只是通向另一个顶点的边。",
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
        const at = (x: number) => range(0, edges.length - 1).filter((c) => edges[c]![0] === x || edges[c]![1] === x);
        const both = at(u).filter((c) => at(w).includes(c));
        const degU = at(u).length;
        const degW = at(w).length;
        return numberProblem({
          prompt: t(
            `The incidence matrix of a multigraph, with rows for vertices $${orderTex(n)}$, is $${incidenceTex(n, edges)}$. How many edges join $${vx(u)}$ and $${vx(w)}$?`,
            `一个多重图的关联矩阵（行依次对应顶点 $${orderTex(n)}$）为 $${incidenceTex(n, edges)}$。连接 $${vx(u)}$ 和 $${vx(w)}$ 的边有多少条？`,
          ),
          answer: k,
          mistakes: distinct(k, [
            why(
              degU,
              `That counts every column with a $1$ in row $${vx(u)}$: the degree of $${vx(u)}$, including edges to other vertices.`,
              `那是数了 $${vx(u)}$ 行中所有为 $1$ 的列：即 $${vx(u)}$ 的度，包括通向其他顶点的边。`,
            ),
            why(
              degW,
              `That counts every column with a $1$ in row $${vx(w)}$: the degree of $${vx(w)}$, including edges to other vertices.`,
              `那是数了 $${vx(w)}$ 行中所有为 $1$ 的列：即 $${vx(w)}$ 的度，包括通向其他顶点的边。`,
            ),
            why(
              k + 1,
              "That is one too many: a column counts only when both of its $1$s are in these two rows.",
              "多了一：只有两个 $1$ 都在这两行的列才算。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the columns at each vertex", "找出两个顶点各自所在的列"],
                t(
                  `Row $${vx(u)}$ has $1$s in ${columnsTex(at(u))}, and row $${vx(w)}$ has $1$s in ${columnsTex(at(w))}.`,
                  `$${vx(u)}$ 行在 ${columnsTex(at(u), true)} 列为 $1$，$${vx(w)}$ 行在 ${columnsTex(at(w), true)} 列为 $1$。`,
                ),
              ],
              [
                ["Keep the columns they share", "保留共同的列"],
                k === 0
                  ? t(
                      "No column appears in both lists, so no edge joins them: the answer is $0$.",
                      "没有一列同时出现在两个列表中，所以没有边连接它们：答案为 $0$。",
                    )
                  : t(
                      `${k === 1 ? "Only" : "The columns"} ${columnsTex(both)} ${k === 1 ? "appears" : "appear"} in both lists, so $${k}$ ${k === 1 ? "edge joins" : "edges join"} $${vx(u)}$ and $${vx(w)}$.`,
                      `同时出现在两个列表中的是 ${columnsTex(both, true)} 列，所以有 $${k}$ 条边连接 $${vx(u)}$ 和 $${vx(w)}$。`,
                    ),
              ],
            ],
            t(
              `Every column has exactly two $1$s, so each shared column is an edge from $${vx(u)}$ to $${vx(w)}$, and the other $${degU} - ${k} = ${degU - k}$ columns at $${vx(u)}$ lead to other vertices.`,
              `每一列恰有两个 $1$，所以每个共同的列都是一条从 $${vx(u)}$ 到 $${vx(w)}$ 的边，而 $${vx(u)}$ 所在的其余 $${degU} - ${k} = ${degU - k}$ 列通向其他顶点。`,
            ),
          ),
        });
      },
    },
  ],
};

/** commonOf lists the vertices x with rowOf[x] = 1 and colOf[x] = 1. */
const commonOf = (rowOf: readonly number[], colOf: readonly number[]) =>
  range(0, rowOf.length - 1).filter((x) => rowOf[x] === 1 && colOf[x] === 1);

/** walkSolution explains an entry of the square or cube of an adjacency matrix M, step by step, with a check by the other grouping. */
function walkSolution(A: readonly (readonly number[])[], k: number, i: number, j: number, value: number, arrow: string) {
  const row = A[i]!;
  const col = A.map((r) => r[j]!);
  const P = matPow(A, k);
  if (k === 2) {
    const mids = commonOf(row, col);
    const walks = mids.map((x) => `${vx(i)} ${arrow} ${vx(x)} ${arrow} ${vx(j)}`).join(";\\ ");
    return walked(
      [
        [
          ["Read the row and the column", "读出行和列"],
          t(
            `Row $${vx(i)}$ of $M$ is $(${row.join(", ")})$ and column $${vx(j)}$ is $(${col.join(", ")})$.`,
            `$M$ 的 $${vx(i)}$ 行为 $(${row.join(", ")})$，$${vx(j)}$ 列为 $(${col.join(", ")})$。`,
          ),
        ],
        [
          ["Count the middle vertices", "数中间的顶点"],
          mids.length === 0
            ? t(
                "No position has a $1$ in both, so there is no walk of length $2$ and the entry is $0$.",
                "没有一个位置两者都为 $1$，所以没有长度为 $2$ 的途径，该元为 $0$。",
              )
            : t(
                `Both have a $1$ at ${letters(mids)}, so the walks are $${walks}$: the entry is $${value}$.`,
                `两者都在 ${letters(mids, true)} 处为 $1$，所以途径为 $${walks}$：该元为 $${value}$。`,
              ),
        ],
      ],
      t(
        `Multiplying out, $M^2 = ${matTex(P)}$, whose $(${vx(i)}, ${vx(j)})$ entry is $${value}$.`,
        `直接相乘得 $M^2 = ${matTex(P)}$，其 $(${vx(i)}, ${vx(j)})$ 元为 $${value}$。`,
      ),
    );
  }
  const S = matPow(A, 2);
  const rowOfSquare = S[i]!;
  const colOfSquare = S.map((r) => r[j]!);
  return walked(
    [
      [
        ["Square the matrix", "求矩阵的平方"],
        t(
          `$M^2 = ${matTex(S)}$, whose row $${vx(i)}$, $(${rowOfSquare.join(", ")})$, counts the walks of length $2$ from $${vx(i)}$.`,
          `$M^2 = ${matTex(S)}$，其 $${vx(i)}$ 行 $(${rowOfSquare.join(", ")})$ 是从 $${vx(i)}$ 出发长度为 $2$ 的途径数。`,
        ),
      ],
      [
        [`Multiply by column $${vx(j)}$`, `乘以 $${vx(j)}$ 列`],
        onesAt(col).length === 0
          ? t(
              `Column $${vx(j)}$ of $M$ has no $1$s, so no walk can take a last step to $${vx(j)}$ and the entry is $0$.`,
              `$M$ 的 $${vx(j)}$ 列没有 $1$，所以没有途径能最后一步走到 $${vx(j)}$，该元为 $0$。`,
            )
          : t(
              `Column $${vx(j)}$ of $M$ has $1$s in the rows of ${letters(onesAt(col))}, so add those entries of the row: $${addUp(rowOfSquare, col, value)}$.`,
              `$M$ 的 $${vx(j)}$ 列在 ${letters(onesAt(col), true)} 所在行为 $1$，所以把行中这些位置的元相加：$${addUp(rowOfSquare, col, value)}$。`,
            ),
      ],
    ],
    onesAt(row).length === 0
      ? t(
          `Grouping the other way, row $${vx(i)}$ of $M$ has no $1$s, so no walk leaves $${vx(i)}$ and the entry is $0$ again.`,
          `换一种结合方式：$M$ 的 $${vx(i)}$ 行没有 $1$，所以没有途径从 $${vx(i)}$ 出发，该元同样为 $0$。`,
        )
      : t(
          `Grouping the other way, row $${vx(i)}$ of $M$ has $1$s at ${letters(onesAt(row))}, and adding those entries of column $${vx(j)}$ of $M^2$, $(${colOfSquare.join(", ")})$, gives $${addUp(colOfSquare, row, value)}$ again.`,
          `换一种结合方式：$M$ 的 $${vx(i)}$ 行在 ${letters(onesAt(row), true)} 处为 $1$，把 $M^2$ 的 $${vx(j)}$ 列 $(${colOfSquare.join(", ")})$ 中这些位置的元相加，同样得到 $${addUp(colOfSquare, row, value)}$。`,
        ),
  );
}

/** adjacencyMatrices reads graphs from adjacency matrices and counts walks with matrix powers. */
export const adjacencyMatrices: TopicDef = {
  id: "adjacency-matrices",
  title: t("Adjacency Matrices", "邻接矩阵"),
  summary: t(
    "The adjacency matrix A has aᵢⱼ = 1 when vertices i and j are adjacent; for an undirected graph it is symmetric, its row sums are degrees, and its entries sum to 2|E|. The entry (Aᵏ)ᵢⱼ counts the walks of length k from i to j.",
    "邻接矩阵 A 中，若顶点 i 与 j 相邻则 aᵢⱼ = 1；无向图的邻接矩阵是对称的，行和为度，元素之和为 2|E|。(Aᵏ)ᵢⱼ 等于从 i 到 j 长度为 k 的途径数。",
  ),
  intro: t(
    "A graph on $8$ vertices whose adjacency matrix holds $22$ ones has $11$ edges: each edge $ij$ puts a $1$ at $(i, j)$ and another at $(j, i)$, so the ones come in pairs.\n\nCheck: the row sums of the matrix are the degrees, and the degrees add up to twice the number of edges, $2 \\cdot 11 = 22$.\n\nIn this lesson we read edges and degrees from an adjacency matrix, count walks with its powers, count triangles with the trace of its cube, and read its entries from a drawing.",
    "一个有 $8$ 个顶点的图，若邻接矩阵中有 $22$ 个 $1$，则它有 $11$ 条边：每条边 $ij$ 在 $(i, j)$ 和 $(j, i)$ 各放一个 $1$，所以 $1$ 成对出现。\n\n检验：矩阵的行和就是各顶点的度，度数之和是边数的两倍，$2 \\cdot 11 = 22$。\n\n本课我们由邻接矩阵读出边数和度，用它的幂数途径，用它立方的迹数三角形，并由图读出矩阵的元。",
  ),
  prerequisites: ["the-degree-of-a-vertex", "powers-of-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reading-an-adjacency-matrix",
      figure: discreteDrawings2["adjacency-matrices#reading-an-adjacency-matrix"],
      title: t("Reading an adjacency matrix", "读邻接矩阵"),
      explanation: t(
        "Each edge contributes two $1$s, at $(i, j)$ and $(j, i)$. So the number of edges is half the number of $1$s, and the number of $1$s in row $i$ is the degree of vertex $i$. In the drawing the ten shaded $1$s give $\\frac{10}{2} = 5$ edges, and row $B$, with three $1$s, gives $\\deg(B) = 3$. An adjacency matrix with $30$ ones describes a graph with $15$ edges.\n\n> **Watch out.** Halve the number of $1$s to get the edges, since each edge appears twice; but for a degree, count the $1$s in one row only, without halving.",
        "每条边贡献两个 $1$，分别在 $(i, j)$ 和 $(j, i)$。所以边数是 $1$ 的个数的一半，第 $i$ 行中 $1$ 的个数是顶点 $i$ 的度。图中十个带阴影的 $1$ 给出 $\\frac{10}{2} = 5$ 条边，$B$ 行有三个 $1$，所以 $\\deg(B) = 3$。有 $30$ 个 $1$ 的邻接矩阵表示有 $15$ 条边的图。\n\n> **注意。** 求边数要把 $1$ 的个数减半，因为每条边出现两次；但求度时只数一行中的 $1$，不要减半。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomGraph(rng, n, rng.int(n - 1, Math.min(n + 3, (n * (n - 1)) / 2)));
        const A = adjacencyMatrix(g);
        const m = g.edges.length;
        const askEdges = rng.bool();
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const all = degrees(g);
        const row = A[v]!;
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
          mistakes: askEdges
            ? distinct(m, [
                why(
                  2 * m,
                  "That counts the $1$s; each edge puts two of them in the matrix, so halve.",
                  "那是数了 $1$ 的个数；每条边在矩阵中放两个 $1$，要减半。",
                ),
                why(n, "That is the number of vertices, the rows of the matrix.", "那是顶点数，即矩阵的行数。"),
                why(m + 1, "That is one too many: count the $1$s again and halve.", "多了一：重新数 $1$ 的个数再减半。"),
              ])
            : distinct(d, [
                why(n - d, "That counts the zeros in the row, including the diagonal.", "那是数了行中的 $0$，还包括对角线上的。"),
                why(
                  2 * d,
                  "That doubles the count; each $1$ in the row is already one edge.",
                  "那是把个数加倍了；行中的每个 $1$ 已经是一条边。",
                ),
                why(d + 1, "That is one too many: count the $1$s in the row again.", "多了一：重新数一遍行中的 $1$。"),
              ]),
          solution: askEdges
            ? walked(
                [
                  [
                    ["Count the ones", "数 $1$ 的个数"],
                    t(`The rows hold $${all.join(" + ")} = ${2 * m}$ ones.`, `各行中 $1$ 的个数之和为 $${all.join(" + ")} = ${2 * m}$。`),
                  ],
                  [
                    ["Halve", "减半"],
                    t(
                      `Each edge gives two of them, so there are $\\frac{${2 * m}}{2} = ${m}$ edges.`,
                      `每条边给出两个 $1$，所以有 $\\frac{${2 * m}}{2} = ${m}$ 条边。`,
                    ),
                  ],
                ],
                t(
                  `Reading the $1$s above the diagonal gives the edges $${g.edges.map(edgeTex).join(", ")}$, which are $${m}$.`,
                  `读出对角线上方的 $1$，得到边 $${g.edges.map(edgeTex).join(", ")}$，共 $${m}$ 条。`,
                ),
              )
            : walked(
                [
                  [
                    ["Read the row", "读出这一行"],
                    t(`Row $${vx(v)}$ is $(${row.join(", ")})$.`, `$${vx(v)}$ 行为 $(${row.join(", ")})$。`),
                  ],
                  [
                    ["Count the ones", "数 $1$ 的个数"],
                    d === 0
                      ? t(`It has no $1$s, so $\\deg(${vx(v)}) = 0$.`, `其中没有 $1$，所以 $\\deg(${vx(v)}) = 0$。`)
                      : t(
                          `Its $1$s are in the columns of ${letters(onesAt(row))}, the neighbors of $${vx(v)}$, so $\\deg(${vx(v)}) = ${d}$.`,
                          `其中的 $1$ 在 ${letters(onesAt(row), true)} 所在列，即 $${vx(v)}$ 的邻点，所以 $\\deg(${vx(v)}) = ${d}$。`,
                        ),
                  ],
                ],
                t(
                  `The matrix is symmetric, so column $${vx(v)}$ is the same list read downward, and it also holds $${d}$ ${d === 1 ? "one" : "ones"}.`,
                  `矩阵是对称的，$${vx(v)}$ 列就是同一组数竖着读，其中也有 $${d}$ 个 $1$。`,
                ),
              ),
        });
      },
    },
    {
      id: "counting-walks-with-powers-of-the-adjacency-matrix",
      title: t("Counting walks", "数途径"),
      explanation: t(
        "$(M^2)_{ij} = \\sum_k m_{ik}m_{kj}$ counts the vertices $k$ adjacent to both $i$ and $j$: the walks $i, k, j$ of length $2$. In general $(M^k)_{ij}$ counts walks of length $k$ from $i$ to $j$, and $M^3$ can be found as $M^2$ times $M$. In the complete graph $K_6$ any two vertices $A$ and $B$ have the $4$ common neighbors $C, D, E, F$, so the $(A, B)$ entry of $M^2$ is $4$.\n\n> **Watch out.** The power is the length of the walk: $M^2$ counts walks of length $2$ and $M$ itself only the edges. And a walk may revisit vertices, so the entry can be larger than the number of paths.",
        "$(M^2)_{ij} = \\sum_k m_{ik}m_{kj}$ 数的是同时与 $i$、$j$ 相邻的顶点 $k$，即长度为 $2$ 的途径 $i, k, j$。一般地，$(M^k)_{ij}$ 是从 $i$ 到 $j$ 长度为 $k$ 的途径数，而 $M^3$ 可以由 $M^2$ 乘以 $M$ 得到。在完全图 $K_6$ 中，任意两个顶点 $A$、$B$ 有 $4$ 个公共邻点 $C, D, E, F$，所以 $M^2$ 的 $(A, B)$ 元为 $4$。\n\n> **注意。** 幂次就是途径的长度：$M^2$ 数的是长度为 $2$ 的途径，$M$ 本身只数边。而且途径可以重复经过顶点，所以该元可能比路径的条数大。",
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
              `${graphIntro(g).en} With rows and columns in the order $${orderTex(n)}$, let $M$ be its adjacency matrix. Find the $(${vx(i)}, ${vx(j)})$ entry of $M^{${k}}$.`,
              `${graphIntro(g)["zh-CN"]}行与列按 $${orderTex(n)}$ 排列，设 $M$ 为其邻接矩阵。求 $M^{${k}}$ 的 $(${vx(i)}, ${vx(j)})$ 元。`,
            ),
            answer: value,
            mistakes: distinct(value, [
              why(
                other,
                `That is the entry of $M^{${k === 2 ? 3 : 2}}$, which counts walks of length $${k === 2 ? 3 : 2}$.`,
                `那是 $M^{${k === 2 ? 3 : 2}}$ 的元，数的是长度为 $${k === 2 ? 3 : 2}$ 的途径。`,
              ),
              why(
                A[i]![j]!,
                "That is the entry of $M$ itself, which only says whether there is an edge.",
                "那是 $M$ 本身的元，只说明有没有边。",
              ),
              why(value + 1, "That is one too many: multiply the row by the column again.", "多了一：重新用行乘以列。"),
              why(value - 1, "That is one too few: multiply the row by the column again.", "少了一：重新用行乘以列。"),
            ]),
            solution: walkSolution(A, k, i, j, value, "-"),
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
  intro: t(
    "A town has $10$ junctions joined by $17$ one-way streets. In its adjacency matrix the entry in row $i$ and column $j$ is $1$ when a street runs from $i$ to $j$, so the row of a junction counts the streets leaving it and its column the streets arriving.\n\nCheck: every street leaves one junction and arrives at another, so the $10$ row sums and the $10$ column sums each add up to the $17$ streets.\n\nIn this lesson we read in-degrees and out-degrees from the matrix of a directed graph, count directed walks with its powers, and read the trace of its square.",
    "一个小镇有 $10$ 个路口，由 $17$ 条单行道相连。在它的邻接矩阵中，若有一条街从 $i$ 通向 $j$，则第 $i$ 行第 $j$ 列为 $1$，所以一个路口所在行数的是离开它的街道，所在列数的是到达它的街道。\n\n检验：每条街都从一个路口出发、到达另一个路口，所以 $10$ 个行和与 $10$ 个列和分别相加，都等于 $17$ 条街。\n\n本课我们由有向图的矩阵读出入度和出度，用它的幂数有向途径，并读出它平方的迹。",
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
        "Row $B$ lists the arcs leaving $B$ and column $B$ the arcs entering it, so the out-degree is a row sum and the in-degree a column sum. In a directed graph on $7$ vertices, if row $D$ has five $1$s and column $D$ has two, then $\\deg^+(D) = 5$ and $\\deg^-(D) = 2$.\n\n> **Watch out.** The matrix of a directed graph need not be symmetric, so the row and the column of a vertex usually differ: rows go with arcs leaving, columns with arcs entering. And do not add the two, which gives the total degree.",
        "$B$ 行列出从 $B$ 出发的弧，$B$ 列列出指向 $B$ 的弧，所以出度是行和，入度是列和。在一个有 $7$ 个顶点的有向图中，若 $D$ 行有五个 $1$，$D$ 列有两个 $1$，则 $\\deg^+(D) = 5$，$\\deg^-(D) = 2$。\n\n> **注意。** 有向图的矩阵不一定对称，所以一个顶点的行和列通常不同：行对应出弧，列对应入弧。也不要把两者相加，那是总度数。",
      ),
      generate(rng) {
        const n = rng.int(4, 5);
        const g = randomDigraph(rng, n, rng.int(n + 1, n + 5));
        const A = adjacencyMatrix(g, true);
        const v = rng.int(0, n - 1);
        const out = sum(A[v]!);
        const inn = sum(A.map((r) => r[v]!));
        const askOut = rng.bool();
        const value = askOut ? out : inn;
        const line = askOut ? A[v]! : A.map((r) => r[v]!);
        const ends = onesAt(line);
        const arcs = ends.map((x) => (askOut ? `(${vx(v)}, ${vx(x)})` : `(${vx(x)}, ${vx(v)})`)).join(", ");
        return numberProblem({
          prompt: t(
            `A directed graph on vertices $${orderTex(n)}$ has adjacency matrix $${matTex(A)}$, where the $(i, j)$ entry is $1$ when there is an arc from $i$ to $j$. Find the ${askOut ? "out" : "in"}-degree of $${vx(v)}$.`,
            `顶点为 $${orderTex(n)}$ 的有向图的邻接矩阵为 $${matTex(A)}$，其中有从 $i$ 到 $j$ 的弧时 $(i, j)$ 元为 $1$。求 $${vx(v)}$ 的${askOut ? "出" : "入"}度。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              askOut ? inn : out,
              askOut
                ? "That is the column sum, the in-degree: the out-degree is the sum of the row."
                : "That is the row sum, the out-degree: the in-degree is the sum of the column.",
              askOut ? "那是列和，即入度：出度是行和。" : "那是行和，即出度：入度是列和。",
            ),
            why(out + inn, "That adds the row and the column, which gives the total degree.", "那是把行和与列和相加，得到的是总度数。"),
            why(value + 1, "That is one too many: count the $1$s again.", "多了一：重新数一遍 $1$。"),
          ]),
          solution: walked(
            [
              [
                askOut ? [`Read row $${vx(v)}$`, `读出 $${vx(v)}$ 行`] : [`Read column $${vx(v)}$`, `读出 $${vx(v)}$ 列`],
                askOut
                  ? t(
                      `Arcs leaving $${vx(v)}$ are recorded in its row, $(${line.join(", ")})$.`,
                      `从 $${vx(v)}$ 出发的弧记录在它的行中：$(${line.join(", ")})$。`,
                    )
                  : t(
                      `Arcs entering $${vx(v)}$ are recorded in its column, $(${line.join(", ")})$.`,
                      `指向 $${vx(v)}$ 的弧记录在它的列中：$(${line.join(", ")})$。`,
                    ),
              ],
              [["Add the entries", "把各元相加"], t(`$${line.join(" + ")} = ${value}$.`, `$${line.join(" + ")} = ${value}$。`)],
            ],
            value === 0
              ? t(
                  `No arc of the graph has $${vx(v)}$ as its ${askOut ? "tail" : "head"}, so the ${askOut ? "out" : "in"}-degree is $0$.`,
                  `图中没有以 $${vx(v)}$ 为${askOut ? "起点" : "终点"}的弧，所以${askOut ? "出" : "入"}度为 $0$。`,
                )
              : t(
                  `The arcs ${askOut ? "leaving" : "entering"} $${vx(v)}$ are $${arcs}$, which are $${value}$.`,
                  `${askOut ? "从" : "指向"} $${vx(v)}$ ${askOut ? "出发" : ""}的弧为 $${arcs}$，共 $${value}$ 条。`,
                ),
          ),
        });
      },
    },
    {
      id: "counting-directed-walks-with-matrix-powers",
      figure: discreteDrawings2["adjacency-matrices-of-directed-graphs#counting-directed-walks-with-matrix-powers"],
      title: t("Counting directed walks", "数有向途径"),
      explanation: t(
        "If $M$ is the adjacency matrix of a directed graph, the $(i, j)$ entry of $M^3$ is the number of directed walks $i \\to \\cdot \\to \\cdot \\to j$ of length $3$, and in general $M^k$ counts walks of length $k$, following the arrows. In the drawing that entry of the cube is $2$: the walks $i \\to p \\to q \\to j$ and $i \\to q \\to p \\to j$. In the directed cycle $A \\to B \\to C \\to D \\to E \\to F \\to A$, the only walk of length $4$ from $A$ ends at $E$, so row $A$ of $M^4$ has a single $1$, in column $E$.\n\n> **Watch out.** The row of the entry is where the walk starts and the column where it ends, so the $(j, i)$ entry counts walks the other way. And the power must match the length asked for.",
        "若 $M$ 是有向图的邻接矩阵，则 $M^3$ 的 $(i, j)$ 元是长度为 $3$ 的有向途径 $i \\to \\cdot \\to \\cdot \\to j$ 的条数；一般地，$M^k$ 数的是沿箭头方向长度为 $k$ 的途径。图中立方的这个元为 $2$：途径 $i \\to p \\to q \\to j$ 和 $i \\to q \\to p \\to j$。在有向圈 $A \\to B \\to C \\to D \\to E \\to F \\to A$ 中，从 $A$ 出发长度为 $4$ 的唯一途径终止于 $E$，所以 $M^4$ 的 $A$ 行只有一个 $1$，在 $E$ 列。\n\n> **注意。** 元所在的行是途径的起点，列是终点，所以 $(j, i)$ 元数的是反方向的途径。而且幂次要与所问的长度一致。",
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
            mistakes: distinct(value, [
              why(
                P[j]![i]!,
                `That counts the walks from $${vx(j)}$ to $${vx(i)}$; the row gives the start.`,
                `那是数了从 $${vx(j)}$ 到 $${vx(i)}$ 的途径；行表示起点。`,
              ),
              why(
                matPow(A, k === 2 ? 3 : 2)[i]![j]!,
                `That counts the walks of length $${k === 2 ? 3 : 2}$, not $${k}$.`,
                `那是数了长度为 $${k === 2 ? 3 : 2}$ 的途径，而不是 $${k}$。`,
              ),
              why(value + 1, "That is one too many: multiply the row by the column again.", "多了一：重新用行乘以列。"),
            ]),
            solution: t(
              `Let $M$ be the adjacency matrix in the order $${orderTex(n)}$; the count is the $(${vx(i)}, ${vx(j)})$ entry of $M^{${k}}$.\n\n${walkSolution(A, k, i, j, value, "\\to").en}`,
              `设 $M$ 为按 $${orderTex(n)}$ 排列的邻接矩阵；所求的数是 $M^{${k}}$ 的 $(${vx(i)}, ${vx(j)})$ 元。\n\n${walkSolution(A, k, i, j, value, "\\to")["zh-CN"]}`,
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

/** layersOf groups the vertices by their distance in a row of distances: layer k holds the vertices at distance k. */
const layersOf = (dist: readonly number[]) =>
  range(0, Math.max(...dist)).map((k) => range(0, dist.length - 1).filter((v) => dist[v] === k));

/** layersTex lists the layers of a breadth-first search: "distance 1: $B$, $C$; distance 2: $D$". */
const layersTex = (layers: readonly (readonly number[])[], zh = false) =>
  layers
    .map((l, k) => (zh ? `距离 $${k}$：${letters(l, true)}` : `distance $${k}$: ${letters(l)}`))
    .slice(1)
    .join(zh ? "；" : "; ");

/** distanceMatrices builds and reads distance matrices. */
export const distanceMatrices: TopicDef = {
  id: "distance-matrices",
  title: t("Distance Matrices", "距离矩阵"),
  summary: t(
    "The distance matrix D of a connected graph has dᵢⱼ = d(i, j). It is symmetric with zeros on the diagonal, its entries equal to 1 mark the edges, and the largest entry in row i is the eccentricity of i.",
    "连通图的距离矩阵 D 中 dᵢⱼ = d(i, j)。它是对称的，对角线为零，等于 1 的元标出各条边，第 i 行的最大元是 i 的离心率。",
  ),
  intro: t(
    "Eight stations stand around a circular railway line. In the distance matrix of this $8$-cycle, the row of any station is $(0, 1, 2, 3, 4, 3, 2, 1)$: its two neighbors are $1$ stop away, the next two $2$, the next two $3$, and the opposite station $4$. The row adds up to $16$, and its largest entry is $4$.\n\nCheck: each distance $1$, $2$ and $3$ occurs on both sides of the circle and $4$ once, so the row sum is $2(1 + 2 + 3) + 4 = 16$.\n\nIn this lesson we read the rows of a distance matrix, find the edges of a graph from its distance matrix, and add up the distance matrix of a path.",
    "八个车站分布在一条环形铁路上。在这个 $8$-圈的距离矩阵中，任一车站所在行都是 $(0, 1, 2, 3, 4, 3, 2, 1)$：两个相邻的车站距离 $1$ 站，再往外两个距离 $2$，再两个距离 $3$，对面的车站距离 $4$。这一行之和为 $16$，最大元为 $4$。\n\n检验：距离 $1$、$2$、$3$ 在环的两侧各出现一次，$4$ 出现一次，所以行和为 $2(1 + 2 + 3) + 4 = 16$。\n\n本课我们读距离矩阵的行，由距离矩阵求图的边，并求路径的距离矩阵各元之和。",
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
        "Row $A$ of the distance matrix lists $d(A, v)$ for every $v$, and a breadth-first search from $A$ finds these distances layer by layer. The largest entry of the row is the eccentricity of $A$. For the path on $9$ vertices, the row of an end is $(0, 1, 2, 3, 4, 5, 6, 7, 8)$, whose sum is $36$ and whose largest entry is $8$.\n\n> **Watch out.** The diagonal entry $d(A, A)$ is $0$, not $1$. And a distance is the fewest edges between two vertices, so the row is not the row of the adjacency matrix: only the neighbors are at distance $1$.",
        "距离矩阵的 $A$ 行列出每个 $v$ 的 $d(A, v)$，从 $A$ 出发的广度优先搜索逐层求出这些距离。这一行的最大元是 $A$ 的离心率。对 $9$ 个顶点的路径，端点所在行为 $(0, 1, 2, 3, 4, 5, 6, 7, 8)$，其和为 $36$，最大元为 $8$。\n\n> **注意。** 对角线上的 $d(A, A)$ 是 $0$，不是 $1$。而且距离是两个顶点之间最少的边数，所以这一行不是邻接矩阵的行：只有邻点的距离是 $1$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomConnected(rng, n, rng.int(0, 2));
        const D = distanceMatrix(g);
        const v = rng.int(0, n - 1);
        const row = D[v]!;
        const askSum = rng.bool();
        const value = askSum ? sum(row) : Math.max(...row);
        const layers = layersOf(row);
        const deg = degrees(g)[v]!;
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
            mistakes: distinct(
              value,
              askSum
                ? [
                    why(
                      deg,
                      "That counts only the neighbors, the entries equal to $1$; the farther vertices count too.",
                      "那只数了邻点，即等于 $1$ 的元；更远的顶点也要算进去。",
                    ),
                    why(
                      value + 1,
                      "That counts $d(v, v)$ as $1$; a vertex is at distance $0$ from itself.",
                      "那是把 $d(v, v)$ 算成了 $1$；顶点到自身的距离是 $0$。",
                    ),
                    why(value - 1, "That is one too few: recheck the distances layer by layer.", "少了一：逐层重新检查距离。"),
                  ]
                : [
                    why(deg, "That is the number of neighbors, the vertices at distance $1$.", "那是邻点的个数，即距离为 $1$ 的顶点数。"),
                    why(
                      value + 1,
                      "That is one too many: the last layer of the search is the largest distance.",
                      "多了一：搜索的最后一层就是最大距离。",
                    ),
                    why(value - 1, "That is one too few: some vertex is still farther away.", "少了一：还有更远的顶点。"),
                  ],
            ),
            solution: walked(
              [
                [
                  ["Search in layers", "逐层搜索"],
                  t(
                    `A breadth-first search from $${vx(v)}$ finds ${layersTex(layers)}.`,
                    `从 $${vx(v)}$ 出发的广度优先搜索找到 ${layersTex(layers, true)}。`,
                  ),
                ],
                [
                  ["Read the row", "读出这一行"],
                  askSum
                    ? t(
                        `Row $${vx(v)}$ is $(${row.join(", ")})$, and its entries add up to $${row.join(" + ")} = ${value}$.`,
                        `$${vx(v)}$ 行为 $(${row.join(", ")})$，各元之和为 $${row.join(" + ")} = ${value}$。`,
                      )
                    : t(
                        `Row $${vx(v)}$ is $(${row.join(", ")})$, and its largest entry is $${value}$.`,
                        `$${vx(v)}$ 行为 $(${row.join(", ")})$，最大元为 $${value}$。`,
                      ),
                ],
              ],
              askSum
                ? t(
                    `By layers, each vertex at distance $k$ adds $k$: $${layers
                      .map((l, k) => [k, l.length] as const)
                      .slice(1)
                      .map(([k, s]) => times(k, s))
                      .join(" + ")} = ${value}$.`,
                    `按层计算，每个距离为 $k$ 的顶点贡献 $k$：$${layers
                      .map((l, k) => [k, l.length] as const)
                      .slice(1)
                      .map(([k, s]) => times(k, s))
                      .join(" + ")} = ${value}$。`,
                  )
                : t(
                    `The last layer the search reaches is at distance $${value}$, namely ${letters(layers[value]!)}, so no vertex is farther from $${vx(v)}$.`,
                    `搜索到达的最后一层距离为 $${value}$，即 ${letters(layers[value]!, true)}，所以没有顶点离 $${vx(v)}$ 更远。`,
                  ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "edges-from-a-distance-matrix",
      figure: discreteDrawings2["distance-matrices#edges-from-a-distance-matrix"],
      title: t("Edges from a distance matrix", "由距离矩阵求边"),
      explanation: t(
        "Two vertices are adjacent exactly when their distance is $1$. So the number of edges is half the number of entries equal to $1$, and the whole graph can be rebuilt from its distance matrix. In the drawing, the distance matrix of the $4$-cycle has $8$ shaded entries equal to $1$, so the graph has $\\frac{8}{2} = 4$ edges. A distance matrix with $24$ entries equal to $1$ belongs to a graph with $12$ edges.\n\n> **Watch out.** Count only the entries equal to $1$; larger entries are pairs joined through other vertices. And halve the count, since the matrix is symmetric and lists each pair twice.",
        "两个顶点相邻当且仅当它们的距离为 $1$。所以边数是等于 $1$ 的元个数的一半，整个图都可以由距离矩阵还原。图中 $4$-圈的距离矩阵有 $8$ 个带阴影的元等于 $1$，所以这个图有 $\\frac{8}{2} = 4$ 条边。有 $24$ 个元等于 $1$ 的距离矩阵对应有 $12$ 条边的图。\n\n> **注意。** 只数等于 $1$ 的元；更大的元是经过其他顶点相连的顶点对。还要把个数减半，因为矩阵是对称的，每对顶点列了两次。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomConnected(rng, n, rng.int(0, 3));
        const D = distanceMatrix(g);
        const m = g.edges.length;
        const ones = 2 * m;
        const perRow = D.map((r) => r.filter((x) => x === 1).length);
        return numberProblem({
          prompt: t(
            `A connected graph on vertices $${orderTex(n)}$ has distance matrix $${matTex(D)}$. How many edges does it have?`,
            `顶点为 $${orderTex(n)}$ 的连通图的距离矩阵为 $${matTex(D)}$。它有多少条边？`,
          ),
          answer: m,
          mistakes: distinct(m, [
            why(
              ones,
              "That counts the entries equal to $1$ without halving; each edge appears twice.",
              "那是数了等于 $1$ 的元却没有减半；每条边出现两次。",
            ),
            why(
              n - 1,
              "That is the number of edges of a spanning tree; a connected graph can have more.",
              "那是生成树的边数；连通图可以有更多的边。",
            ),
            ...(Number.isInteger(sum(D.flat()) / 2)
              ? [
                  why(
                    sum(D.flat()) / 2,
                    "That halves the sum of all the distances; only the entries equal to $1$ are edges.",
                    "那是把所有距离之和减半；只有等于 $1$ 的元才是边。",
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["Count the entries equal to $1$", "数等于 $1$ 的元"],
                t(
                  `Row by row there are $${perRow.join(" + ")} = ${ones}$ entries equal to $1$.`,
                  `逐行数，等于 $1$ 的元共有 $${perRow.join(" + ")} = ${ones}$ 个。`,
                ),
              ],
              [
                ["Halve", "减半"],
                t(
                  `Each edge is listed twice, so there are $\\frac{${ones}}{2} = ${m}$ edges.`,
                  `每条边列了两次，所以有 $\\frac{${ones}}{2} = ${m}$ 条边。`,
                ),
              ],
            ],
            t(
              `The pairs at distance $1$ above the diagonal are $${g.edges.map(edgeTex).join(", ")}$, which are $${m}$ edges.`,
              `对角线上方距离为 $1$ 的顶点对为 $${g.edges.map(edgeTex).join(", ")}$，共 $${m}$ 条边。`,
            ),
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

/** deleteSources deletes vertices with no incoming arcs, alphabetically, until none is left: the vertices deleted, and those left over. */
function deleteSources(g: Graph): { removed: number[]; left: number[] } {
  const gone = new Set<number>();
  const removed: number[] = [];
  for (;;) {
    const v = range(0, g.n - 1).find((x) => !gone.has(x) && g.edges.every(([a, b]) => b !== x || gone.has(a)));
    if (v === undefined) break;
    gone.add(v);
    removed.push(v);
  }
  return { removed, left: range(0, g.n - 1).filter((x) => !gone.has(x)) };
}

/** cycleAmong finds a directed cycle among vertices that all have an incoming arc from one another, listing its start again at the end. */
function cycleAmong(g: Graph, left: readonly number[]): number[] {
  const inLeft = new Set(left);
  const back: number[] = [];
  let v = left[0]!;
  while (!back.includes(v)) {
    back.push(v);
    v = g.edges.find(([a, b]) => b === v && inLeft.has(a))![0];
  }
  const cycle = back.slice(back.indexOf(v)).reverse();
  return [...cycle, cycle[0]!];
}

/** arrows writes a directed walk: "A \to B \to C". */
const arrows = (vs: readonly number[]) => vs.map(vx).join(" \\to ");

/** directedAcyclicGraphs recognizes DAGs and their sources and sinks. */
export const directedAcyclicGraphs: TopicDef = {
  id: "directed-acyclic-graphs",
  title: t("Directed Acyclic Graphs", "有向无环图"),
  summary: t(
    "A directed acyclic graph (DAG) has no directed cycle. Every finite DAG has at least one source (in-degree 0) and at least one sink (out-degree 0); a directed graph is acyclic exactly when repeatedly deleting sources removes every vertex.",
    "有向无环图（DAG）没有有向圈。每个有限 DAG 至少有一个源（入度为 0）和一个汇（出度为 0）；一个有向图无环当且仅当反复删去源能删去所有顶点。",
  ),
  intro: t(
    "Ten tasks must be done in a chain, each one before the next: $T_1 \\to T_2 \\to \\dots \\to T_{10}$. This directed graph has no directed cycle, its only source is $T_1$, nothing has to come first, and its only sink is $T_{10}$, which nothing waits for. Deleting sources one at a time removes $T_1$, then $T_2$, and so on until all ten are gone.\n\nCheck: every arc goes from a lower number to a higher one, so a walk along the arcs only climbs and can never return to where it started.\n\nIn this lesson we decide whether a directed graph is acyclic, count its sources and sinks, and find the most arcs a directed acyclic graph can have.",
    "十项任务必须按链条顺序完成，每一项都在下一项之前：$T_1 \\to T_2 \\to \\dots \\to T_{10}$。这个有向图没有有向圈，唯一的源是 $T_1$，它之前不需要做任何事；唯一的汇是 $T_{10}$，没有任务等待它。逐个删去源，先删去 $T_1$，再删去 $T_2$，依此类推，直到十项全部删去。\n\n检验：每条弧都从编号小的指向编号大的，所以沿弧行走只会向上，永远回不到起点。\n\n本课我们判断有向图是否无环，数它的源和汇，并求有向无环图最多能有多少条弧。",
  ),
  prerequisites: ["walks-paths-and-distances-in-directed-graphs", "cycles-in-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-directed-acyclic-graphs",
      figure: discreteDrawings2["directed-acyclic-graphs#recognizing-directed-acyclic-graphs"],
      title: t("Recognizing DAGs", "判断有向无环图"),
      explanation: t(
        "Repeatedly delete a vertex with no incoming arcs. If you can delete every vertex, the graph is acyclic; if you get stuck, the remaining vertices all have incoming arcs and contain a directed cycle. In the drawing, on the left the deletions remove $A$, then $B$ and $D$, then $C$, so that graph is acyclic; on the right, once $A$ is gone, $B$, $C$ and $D$ all have incoming arcs, and $B \\to C \\to D \\to B$ is a cycle. With the arcs $(A, B), (B, C), (C, D), (D, E), (E, F), (F, H), (H, B)$ on seven vertices, only $A$ can be deleted, and the six vertices left contain the cycle $B \\to C \\to D \\to E \\to F \\to H \\to B$.\n\n> **Watch out.** Follow the arrows: a cycle that appears only when the directions are ignored does not count. And having one vertex with no incoming arcs is not enough; the deletions must remove every vertex.",
        "反复删去没有入弧的顶点。若能删去所有顶点，图是无环的；若中途卡住，剩下的顶点都有入弧，其中含有向圈。图中左边依次删去 $A$，再删去 $B$ 和 $D$，最后删去 $C$，所以那个图无环；右边删去 $A$ 后，$B$、$C$、$D$ 都有入弧，$B \\to C \\to D \\to B$ 是一个圈。在七个顶点上，若弧为 $(A, B), (B, C), (C, D), (D, E), (E, F), (F, H), (H, B)$，则只能删去 $A$，剩下的六个顶点含有圈 $B \\to C \\to D \\to E \\to F \\to H \\to B$。\n\n> **注意。** 要按箭头方向走：只有忽略方向才出现的圈不算。而且有一个没有入弧的顶点还不够；必须能删去所有顶点。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        const m = rng.int(n, n + 3);
        const g = rng.bool() ? randomDag(rng, n, m) : randomCyclic(rng, n, m - 2);
        const yes = isAcyclic(g);
        const { removed, left } = deleteSources(g);
        return fig(
          verdictChoice(rng, {
            prompt: t(`${digraphIntro(g).en} Is $G$ acyclic?`, `${digraphIntro(g)["zh-CN"]}$G$ 是无环的吗？`),
            holds: yes,
            yes: t("deleting sources one at a time removes every vertex", "逐个删去源可以删去所有顶点"),
            no: t("deleting sources gets stuck with vertices left over", "逐个删去源会卡住，还剩下顶点"),
            yesWrong: t("it has a vertex with no incoming arcs", "它有一个没有入弧的顶点"),
            noWrong: t("it has a cycle if the arrows are ignored", "不看箭头方向时它含有圈"),
            solution: yes
              ? walked(
                  [
                    [
                      ["Delete sources", "删去源"],
                      t(
                        `Deleting a vertex with no incoming arcs each time removes $${removed.map(vx).join(", ")}$ in turn.`,
                        `每次删去一个没有入弧的顶点，依次删去 $${removed.map(vx).join(", ")}$。`,
                      ),
                    ],
                    [["Conclude", "得出结论"], t("Every vertex is deleted, so $G$ is acyclic.", "所有顶点都被删去，所以 $G$ 无环。")],
                  ],
                  t(
                    `In the order $${removed.map(vx).join(", ")}$ every arc points forward, so a walk along the arcs moves only forward and can never close a cycle.`,
                    `在顺序 $${removed.map(vx).join(", ")}$ 中每条弧都指向后面，所以沿弧行走只会向后，不可能形成圈。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Delete sources", "删去源"],
                      removed.length === 0
                        ? t(
                            "Every vertex has an incoming arc, so no vertex can be deleted at all.",
                            "每个顶点都有入弧，所以一个顶点也删不掉。",
                          )
                        : t(
                            `Deleting vertices with no incoming arcs removes $${removed.map(vx).join(", ")}$, and then it gets stuck.`,
                            `删去没有入弧的顶点，依次删去 $${removed.map(vx).join(", ")}$，然后就卡住了。`,
                          ),
                    ],
                    [
                      ["Look at what is left", "看剩下的顶点"],
                      t(
                        `Each of ${letters(left)} still has an incoming arc from another of them, so $G$ is not acyclic.`,
                        `${letters(left, true)} 中每个顶点都还有来自其中另一个顶点的入弧，所以 $G$ 不是无环的。`,
                      ),
                    ],
                  ],
                  t(
                    `Following those incoming arcs backward closes the directed cycle $${arrows(cycleAmong(g, left))}$.`,
                    `沿这些入弧反向追溯，得到有向圈 $${arrows(cycleAmong(g, left))}$。`,
                  ),
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
        "A source has no incoming arcs and a sink has no outgoing arcs, so find them from the in-degrees and the out-degrees. In the DAG on $9$ vertices with an arc from $A$ to each of the other $8$, the only source is $A$, and all $8$ other vertices are sinks.\n\n> **Watch out.** A source may have many outgoing arcs; only its incoming arcs must be missing. And a vertex with no arcs at all is both a source and a sink, so count it in both.",
        "源没有入弧，汇没有出弧，所以要由入度和出度找出它们。在 $9$ 个顶点的 DAG 中，若从 $A$ 到其余 $8$ 个顶点各有一条弧，则唯一的源是 $A$，其余 $8$ 个顶点都是汇。\n\n> **注意。** 源可以有很多出弧；只要求它没有入弧。没有任何弧的顶点既是源又是汇，两边都要算。",
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
        const degs = askSources ? ins : outs;
        const others = range(0, n - 1).filter((v) => !list.includes(v));
        const witness = others.map((v) => {
          const [a, b] = askSources ? g.edges.find(([, y]) => y === v)! : g.edges.find(([x]) => x === v)!;
          return `(${vx(a)}, ${vx(b)})`;
        });
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many ${askSources ? "sources" : "sinks"} does $G$ have?`,
              `${digraphIntro(g)["zh-CN"]}$G$ 有多少个${askSources ? "源" : "汇"}？`,
            ),
            answer: list.length,
            mistakes: distinct(list.length, [
              why(
                (askSources ? sinks : sources).length,
                askSources
                  ? "That counts the sinks, which have no outgoing arcs."
                  : "That counts the sources, which have no incoming arcs.",
                askSources ? "那是数了汇，即没有出弧的顶点。" : "那是数了源，即没有入弧的顶点。",
              ),
              why(
                list.length + 1,
                askSources
                  ? "That is one too many: a vertex with an incoming arc is not a source."
                  : "That is one too many: a vertex with an outgoing arc is not a sink.",
                askSources ? "多了一：有入弧的顶点不是源。" : "多了一：有出弧的顶点不是汇。",
              ),
              why(
                list.length - 1,
                "That is one too few: check every vertex, including any with no arcs at all.",
                "少了一：要检查每个顶点，包括没有任何弧的顶点。",
              ),
            ]),
            solution: walked(
              [
                [
                  askSources ? ["Find the in-degrees", "求入度"] : ["Find the out-degrees", "求出度"],
                  t(
                    `The ${askSources ? "in" : "out"}-degrees are ${range(0, n - 1)
                      .map((v) => `$${vx(v)}\\colon ${degs[v]}$`)
                      .join(", ")}.`,
                    `各顶点的${askSources ? "入" : "出"}度为 ${range(0, n - 1)
                      .map((v) => `$${vx(v)}\\colon ${degs[v]}$`)
                      .join("、")}。`,
                  ),
                ],
                [
                  ["Pick the zeros", "找出为零的顶点"],
                  t(
                    `The vertices with ${askSources ? "in" : "out"}-degree $0$ are ${letters(list)}, so there ${list.length === 1 ? "is" : "are"} $${list.length}$.`,
                    `${askSources ? "入" : "出"}度为 $0$ 的顶点为 ${letters(list, true)}，共 $${list.length}$ 个。`,
                  ),
                ],
              ],
              t(
                `Each of the other $${others.length}$ vertices has ${askSources ? "an incoming" : "an outgoing"} arc: $${witness.join(", ")}$, so none of them is a ${askSources ? "source" : "sink"}.`,
                `其余 $${others.length}$ 个顶点各有一条${askSources ? "入" : "出"}弧：$${witness.join(", ")}$，所以它们都不是${askSources ? "源" : "汇"}。`,
              ),
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** countTopologicalOrders counts the topological orderings of a DAG by brute force, with the vertices in placed already set down. */
function countTopologicalOrders(g: Graph, placed: Set<number> = new Set()): number {
  const preds = range(0, g.n - 1).map((v) => g.edges.filter(([, b]) => b === v).map(([a]) => a));
  const go = (): number => {
    if (placed.size === g.n) return 1;
    let total = 0;
    for (let v = 0; v < g.n; v++) {
      if (!placed.has(v) && preds[v]!.every((p) => placed.has(p))) {
        placed.add(v);
        total += go();
        placed.delete(v);
      }
    }
    return total;
  };
  return go();
}

/** reversed turns every arc of a directed graph around. */
const reversed = (g: Graph): Graph => ({ n: g.n, edges: g.edges.map(([a, b]) => [b, a] as const) });

/** sumTex writes a sum of terms equal to a total, or the total alone for a single term. */
const sumTex = (terms: readonly number[], total: number) => (terms.length === 1 ? `${total}` : `${terms.join(" + ")} = ${total}`);

/** topologicalOrdering checks and counts orderings compatible with every arc. */
export const topologicalOrdering: TopicDef = {
  id: "topological-ordering",
  title: t("Topological Ordering", "拓扑排序"),
  summary: t(
    "A topological ordering lists the vertices of a directed graph so that every arc points from an earlier vertex to a later one. A directed graph has one exactly when it is acyclic, and it may have many.",
    "拓扑排序把有向图的顶点排成一列，使每条弧都从前面的顶点指向后面的顶点。有向图有拓扑排序当且仅当它无环，而且可能有很多个。",
  ),
  intro: t(
    "Seven chores can be done in any order, except that chore $A$ must come before chore $B$. Of the $7! = 5040$ orders of the chores, exactly half put $A$ before $B$, so $2520$ of them respect the rule: these are the topological orderings of the graph with the single arc $(A, B)$.\n\nCheck: swapping $A$ and $B$ turns each order that keeps the rule into one that breaks it, and back, so the orders split into two equal halves, $\\frac{5040}{2} = 2520$.\n\nIn this lesson we check whether an ordering is topological, count the topological orderings of a directed graph, and count those of two separate paths.",
    "七项家务可以按任意顺序完成，只是家务 $A$ 必须在家务 $B$ 之前。在这些家务的 $7! = 5040$ 种顺序中，恰好一半把 $A$ 排在 $B$ 之前，所以有 $2520$ 种符合规则：它们就是只有一条弧 $(A, B)$ 的图的拓扑排序。\n\n检验：交换 $A$ 和 $B$，就把每个符合规则的顺序变成一个违反规则的顺序，反之亦然，所以所有顺序分成相等的两半，$\\frac{5040}{2} = 2520$。\n\n本课我们检验一个顺序是不是拓扑排序，计数有向图的拓扑排序，并计数两条分离路径的拓扑排序。",
  ),
  prerequisites: ["directed-acyclic-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-topological-ordering",
      figure: discreteDrawings2["topological-ordering#checking-a-topological-ordering"],
      title: t("Checking an ordering", "检验排序"),
      explanation: t(
        "An ordering is topological when every arc goes from an earlier vertex to a later one, so check that no arc points backward. With arcs $(A, C), (B, C), (C, D)$, as drawn, the order $B, A, C, D$ is topological, but $A, C, B, D$ is not, because the arc $(B, C)$ points backward. On eight vertices with the arcs $(A, B), (B, C), (C, D), (D, E), (E, F), (F, H), (H, I)$, the only topological ordering is $A, B, C, D, E, F, H, I$, and swapping any two neighbors in it makes an arc point backward.\n\n> **Watch out.** Starting with a vertex that has no incoming arcs is not enough; every single arc must point forward. And a directed acyclic graph often has many topological orderings, so an ordering can be correct without matching one you found.",
        "如果每条弧都从排在前面的顶点指向排在后面的顶点，这个顺序就是拓扑序，所以要检查没有弧指向后方。若弧为 $(A, C), (B, C), (C, D)$，如图所示，则 $B, A, C, D$ 是拓扑排序，而 $A, C, B, D$ 不是，因为弧 $(B, C)$ 指向前面。在八个顶点上，若弧为 $(A, B), (B, C), (C, D), (D, E), (E, F), (F, H), (H, I)$，则唯一的拓扑排序是 $A, B, C, D, E, F, H, I$，交换其中任意两个相邻顶点都会使一条弧指向前面。\n\n> **注意。** 以没有入弧的顶点开头还不够；每一条弧都必须指向后面。而有向无环图常常有很多种拓扑排序，所以一个顺序即使与你找到的不同，也可能是对的。",
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
        const arc = bad[0] ?? g.edges[0]!;
        const at = (v: number) => pos.get(v)! + 1;
        const positions = t(
          `In $${order.map(vx).join(", ")}$ the positions are ${order.map((v) => `$${vx(v)}\\colon ${at(v)}$`).join(", ")}.`,
          `在 $${order.map(vx).join(", ")}$ 中各顶点的位置为 ${order.map((v) => `$${vx(v)}\\colon ${at(v)}$`).join("、")}。`,
        );
        return fig(
          verdictChoice(rng, {
            prompt: t(
              `${digraphIntro(g).en} Is $${order.map(vx).join(", ")}$ a topological ordering of $G$?`,
              `${digraphIntro(g)["zh-CN"]}$${order.map(vx).join(", ")}$ 是 $G$ 的拓扑排序吗？`,
            ),
            holds: bad.length === 0,
            yes: t("every arc goes from an earlier vertex to a later one", "每条弧都从前面的顶点指向后面的顶点"),
            no: t(`the arc $(${vx(arc[0])}, ${vx(arc[1])})$ points backward`, `弧 $(${vx(arc[0])}, ${vx(arc[1])})$ 指向前面`),
            yesWrong: t("the ordering starts with a vertex with no incoming arcs", "这个顺序以一个没有入弧的顶点开头"),
            noWrong: t("a DAG has only one topological ordering, and this is not it", "有向无环图只有一种拓扑排序，而这不是那一种"),
            solution:
              bad.length === 0
                ? walked(
                    [
                      [["Number the positions", "标出位置"], positions],
                      [
                        ["Check each arc", "逐条检查弧"],
                        t(
                          `Every arc goes to a later position: ${g.edges.map(([a, b]) => `$(${vx(a)}, ${vx(b)})\\colon ${at(a)} < ${at(b)}$`).join(", ")}. So it is a topological ordering.`,
                          `每条弧都指向更靠后的位置：${g.edges.map(([a, b]) => `$(${vx(a)}, ${vx(b)})\\colon ${at(a)} < ${at(b)}$`).join("、")}。所以它是拓扑排序。`,
                        ),
                      ],
                    ],
                    t(
                      `As a topological ordering must, it starts with $${vx(order[0]!)}$, which has no incoming arcs, and ends with $${vx(order[n - 1]!)}$, which has no outgoing arcs.`,
                      `正如拓扑排序必须做到的，它以没有入弧的 $${vx(order[0]!)}$ 开头，以没有出弧的 $${vx(order[n - 1]!)}$ 结尾。`,
                    ),
                  )
                : walked(
                    [
                      [["Number the positions", "标出位置"], positions],
                      [
                        ["Find a backward arc", "找出指向前面的弧"],
                        t(
                          `The arc $(${vx(arc[0])}, ${vx(arc[1])})$ goes from position $${at(arc[0])}$ back to position $${at(arc[1])}$, so it is not a topological ordering.`,
                          `弧 $(${vx(arc[0])}, ${vx(arc[1])})$ 从位置 $${at(arc[0])}$ 指回位置 $${at(arc[1])}$，所以它不是拓扑排序。`,
                        ),
                      ],
                    ],
                    t(
                      `That arc requires $${vx(arc[0])}$ before $${vx(arc[1])}$, and no rearrangement of the other vertices can repair an order that lists $${vx(arc[1])}$ first.`,
                      `这条弧要求 $${vx(arc[0])}$ 在 $${vx(arc[1])}$ 之前，而把 $${vx(arc[1])}$ 排在前面的顺序，无论怎样调整其他顶点都无法补救。`,
                    ),
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
        "Build the ordering one vertex at a time: the first vertex must be a source, and after it is placed, the rest of the ordering is a topological ordering of what is left. So the count is the sum, over the sources, of the counts for the graph with that source removed. On eight vertices whose only arcs are $(A, B)$ and $(A, C)$, $A$ must come before $B$ and $C$ and the other five vertices are free: of the $3! = 6$ orders of $A, B, C$, two put $A$ first, so there are $\\frac{8!}{3} = 13440$ orderings.\n\n> **Watch out.** $n!$ counts every order and ignores the arcs. And the choices at each step depend on the choices before, so do not simply multiply the numbers of sources at the start.",
        "逐个放置顶点来构造排序：第一个顶点必须是源，放好它之后，其余部分就是剩下的图的拓扑排序。所以计数等于对每个源，把去掉它后的图的排序数相加。在八个顶点上，若只有弧 $(A, B)$ 和 $(A, C)$，则 $A$ 必须在 $B$、$C$ 之前，其余五个顶点不受限制：$A, B, C$ 的 $3! = 6$ 种顺序中有两种以 $A$ 开头，所以共有 $\\frac{8!}{3} = 13440$ 种排序。\n\n> **注意。** $n!$ 数的是所有顺序，忽略了弧。而且每一步的选择取决于之前的选择，所以不能简单地把开始时源的个数相乘。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const g = randomDag(rng, n, rng.int(n - 1, n + 1));
        const value = countTopologicalOrders(g);
        const sources = range(0, n - 1).filter((v) => g.edges.every(([, b]) => b !== v));
        const sinks = range(0, n - 1).filter((v) => g.edges.every(([a]) => a !== v));
        const bySource = sources.map((s) => countTopologicalOrders(g, new Set([s])));
        const bySink = sinks.map((s) => countTopologicalOrders(reversed(g), new Set([s])));
        const factorial = range(1, n).reduce((p, k) => p * k, 1);
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many topological orderings does $G$ have?`,
              `${digraphIntro(g)["zh-CN"]}$G$ 有多少种拓扑排序？`,
            ),
            answer: value,
            mistakes: distinct(value, [
              why(
                factorial,
                `That is $${n}!$, every order of the vertices, ignoring the arcs.`,
                `那是 $${n}!$，即顶点的所有顺序，忽略了弧。`,
              ),
              why(
                value * 2,
                "That is twice the count: recount the orderings for each first vertex.",
                "那是计数的两倍：对每个第一个顶点重新计数。",
              ),
              why(value + 1, "That is one too many: recount the orderings for each first vertex.", "多了一：对每个第一个顶点重新计数。"),
              why(value - 1, "That is one too few: recount the orderings for each first vertex.", "少了一：对每个第一个顶点重新计数。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the possible first vertices", "找出可能的第一个顶点"],
                  t(
                    `An ordering must start with a source, a vertex with no incoming arcs: ${letters(sources)}.`,
                    `排序必须以源开头，即没有入弧的顶点：${letters(sources, true)}。`,
                  ),
                ],
                [
                  ["Count after each start", "对每个开头分别计数"],
                  t(
                    `Placing ${sources.map((s, i) => `$${vx(s)}$ first leaves $${bySource[i]}$ ${bySource[i] === 1 ? "ordering" : "orderings"} of the rest`).join(", and ")}, for a total of $${sumTex(bySource, value)}$.`,
                    `${sources.map((s, i) => `把 $${vx(s)}$ 放在第一位，其余部分有 $${bySource[i]}$ 种排序`).join("；")}，共 $${sumTex(bySource, value)}$ 种。`,
                  ),
                ],
              ],
              t(
                `Counting by the last vertex instead, which must be a sink (${letters(sinks)}), gives $${sumTex(bySink, value)}$ again.`,
                `改为按最后一个顶点计数，它必须是汇（${letters(sinks, true)}），同样得到 $${sumTex(bySink, value)}$。`,
              ),
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
  ],
};

/** indegreesTex writes the in-degrees of the remaining vertices: "$B\colon 1$, $C\colon 0$". */
const indegreesTex = (vs: readonly number[], indeg: readonly number[], zh = false) =>
  vs.map((v) => `$${vx(v)}\\colon ${indeg[v]}$`).join(zh ? "、" : ", ");

/** kahnsAlgorithm runs Kahn's algorithm with alphabetical tie-breaks. */
export const kahnsAlgorithm: TopicDef = {
  id: "kahns-algorithm",
  title: t("Kahn's Algorithm", "Kahn 算法"),
  summary: t(
    "Kahn's algorithm builds a topological ordering by repeatedly outputting a vertex of in-degree 0 and deleting its outgoing arcs, updating the in-degrees. If it stops before outputting every vertex, the graph has a directed cycle.",
    "Kahn 算法反复输出一个入度为 0 的顶点并删去它的出弧、更新入度，从而得到拓扑排序。若在输出所有顶点之前停止，则图有有向圈。",
  ),
  intro: t(
    "Eight vertices have an arc from $A$ to each of the other seven. Kahn's algorithm, which always outputs a vertex of in-degree $0$, starts with $A$, the only one. Deleting its seven arcs leaves all the others at in-degree $0$, and taking them alphabetically gives the ordering $A, B, C, D, E, F, H, I$.\n\nCheck: every arc is $(A, x)$, and $A$ comes first, so every arc points forward and the ordering is topological.\n\nIn this lesson we run Kahn's algorithm, follow the in-degrees as it goes, and see where it stops on a graph with a cycle.",
    "八个顶点中，从 $A$ 到其余七个顶点各有一条弧。Kahn 算法总是输出一个入度为 $0$ 的顶点，它从唯一的这样的顶点 $A$ 开始。删去 $A$ 的七条弧后，其余顶点的入度都变为 $0$，按字母顺序取出，得到排序 $A, B, C, D, E, F, H, I$。\n\n检验：每条弧都是 $(A, x)$，而 $A$ 排在最前，所以每条弧都指向后面，这个排序是拓扑排序。\n\n本课我们运行 Kahn 算法，跟踪过程中的入度，并看它在有圈的图上停在哪里。",
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
        "At each step, output the alphabetically first vertex whose in-degree is $0$, delete its outgoing arcs, and lower the in-degrees of their heads. With arcs $(B, A), (B, C), (A, D), (C, D)$ on four vertices: only $B$ has in-degree $0$, so output $B$; then $A$ and $C$ are available, output $A$, then $C$, then $D$. The ordering is $B, A, C, D$.\n\n> **Watch out.** Recompute the in-degrees after every output: a vertex becomes available only when all its predecessors are out. So the position is neither the alphabetical position nor the distance from the first vertex.",
        "每一步输出入度为 $0$ 的顶点中字母序最前的一个，删去它的出弧，并把这些弧终点的入度减一。在四个顶点上，若弧为 $(B, A), (B, C), (A, D), (C, D)$：只有 $B$ 入度为 $0$，输出 $B$；然后 $A$、$C$ 可用，输出 $A$，再输出 $C$，最后 $D$。排序为 $B, A, C, D$。\n\n> **注意。** 每次输出后都要重新计算入度：只有所有前驱都已输出，一个顶点才可用。所以它的位置既不是字母顺序中的位置，也不是与第一个顶点的距离。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomDag(rng, n, rng.int(n, n + 3));
        const order = kahn(g);
        const v = rng.int(0, n - 1);
        const p = order.indexOf(v) + 1;
        const start = range(0, n - 1).filter((x) => g.edges.every(([, b]) => b !== x));
        const preds = g.edges.filter(([, b]) => b === v).map(([a]) => a);
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Kahn's algorithm is run on $G$, always choosing the alphabetically first vertex of in-degree $0$. In which position is $${vx(v)}$ output?`,
              `${digraphIntro(g)["zh-CN"]}对 $G$ 运行 Kahn 算法，每次选择入度为 $0$ 的顶点中字母序最前的一个。$${vx(v)}$ 是第几个输出的？`,
            ),
            answer: p,
            mistakes: distinct(
              p,
              [
                why(
                  v + 1,
                  "That is its position in the alphabet; the algorithm waits for its predecessors.",
                  "那是它在字母表中的位置；算法要等它的前驱都输出。",
                ),
                why(
                  bfs(g, order[0]!, true).dist[v]! + 1,
                  "That is one more than its distance from the first vertex output, not its place in the output.",
                  "那是它与第一个输出顶点的距离加一，不是它在输出中的位置。",
                ),
                why(p + 1, "That is one place too late: list the output again, one vertex at a time.", "晚了一位：重新逐个列出输出。"),
                why(p - 1, "That is one place too early: list the output again, one vertex at a time.", "早了一位：重新逐个列出输出。"),
              ].filter((m) => (m.value as number) >= 1),
            ),
            solution: walked(
              [
                [
                  ["Start", "开始"],
                  t(
                    `The vertices with in-degree $0$ at the start are ${letters(start)}.`,
                    `开始时入度为 $0$ 的顶点为 ${letters(start, true)}。`,
                  ),
                ],
                [
                  ["Output and update", "输出并更新"],
                  t(
                    `Outputting the alphabetically first available vertex and deleting its arcs each time gives $${order.map(vx).join(", ")}$, so $${vx(v)}$ is output in position $${p}$.`,
                    `每次输出字母序最前的可用顶点并删去它的弧，得到 $${order.map(vx).join(", ")}$，所以 $${vx(v)}$ 是第 $${p}$ 个输出的。`,
                  ),
                ],
              ],
              preds.length === 0
                ? t(
                    `$${vx(v)}$ has no incoming arcs, so it was available from the start and waited only for alphabetically earlier vertices.`,
                    `$${vx(v)}$ 没有入弧，所以一开始就可用，只是在等字母序更前的顶点。`,
                  )
                : t(
                    `The arcs into $${vx(v)}$ come from ${letters(preds)}, which are output in positions $${preds.map((a) => order.indexOf(a) + 1).join(", ")}$, all before $${p}$.`,
                    `指向 $${vx(v)}$ 的弧来自 ${letters(preds, true)}，它们的输出位置为 $${preds.map((a) => order.indexOf(a) + 1).join(", ")}$，都在 $${p}$ 之前。`,
                  ),
            ),
          }),
          g,
          { directed: true },
        );
      },
    },
    {
      id: "in-degrees-during-kahns-algorithm",
      figure: discreteDrawings2["kahns-algorithm#in-degrees-during-kahns-algorithm"],
      title: t("Updating in-degrees", "更新入度"),
      explanation: t(
        "After a vertex is output, its outgoing arcs are deleted and each target's in-degree drops by $1$. The vertices available next are those whose in-degree has reached $0$. In the drawing, $A$ has in-degree $0$ and is output first; deleting its two arcs lowers $B$ from $1$ to $0$ and $C$ from $2$ to $1$, so $B$ is available next. In a graph on $10$ vertices where $J$ has arcs from $A$, $B$, $C$ and $D$, once $A$, $B$ and $C$ are output, $J$ still has in-degree $1$.\n\n> **Watch out.** Count only the vertices not yet output, and only the arcs whose tails are still there. Vertices already output had in-degree $0$ too, but they are no longer available.",
        "输出一个顶点后，删去它的出弧，每个终点的入度减 $1$。接下来可用的顶点是入度已降为 $0$ 的那些。图中 $A$ 的入度为 $0$，最先输出；删去它的两条弧后，$B$ 从 $1$ 降为 $0$，$C$ 从 $2$ 降为 $1$，所以接下来 $B$ 可用。在一个有 $10$ 个顶点的图中，若 $J$ 有来自 $A$、$B$、$C$、$D$ 的弧，则输出 $A$、$B$、$C$ 后，$J$ 的入度仍为 $1$。\n\n> **注意。** 只数尚未输出的顶点，也只算起点还在的弧。已输出的顶点入度也曾是 $0$，但它们已经不再可用。",
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
        const remaining = range(0, n - 1).filter((v) => !removed.has(v));
        const blocked = remaining.filter((v) => indeg[v]! > 0);
        const witness = blocked.map((v) => {
          const a = g.edges.find(([x, y]) => y === v && !removed.has(x))![0];
          return `(${vx(a)}, ${vx(v)})`;
        });
        return fig(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Kahn's algorithm is run on $G$, always choosing the alphabetically first vertex of in-degree $0$. After ${k === 1 ? "the first vertex has" : `the first $${k}$ vertices have`} been output, how many remaining vertices have in-degree $0$?`,
              `${digraphIntro(g)["zh-CN"]}对 $G$ 运行 Kahn 算法，每次选择入度为 $0$ 的顶点中字母序最前的一个。输出前 $${k}$ 个顶点后，剩下的顶点中有多少个入度为 $0$？`,
            ),
            answer: available.length,
            mistakes: distinct(available.length, [
              why(
                initial,
                "That counts the vertices of in-degree $0$ at the start, before any arcs were deleted.",
                "那是开始时入度为 $0$ 的顶点数，还没有删去任何弧。",
              ),
              why(
                available.length + 1,
                "That is one too many: a vertex already output is no longer remaining.",
                "多了一：已经输出的顶点不再算剩下的。",
              ),
              why(
                available.length - 1,
                "That is one too few: recompute the in-degrees after deleting the arcs.",
                "少了一：删去弧后重新计算入度。",
              ),
            ]),
            solution: walked(
              [
                [
                  [k === 1 ? "Output the first vertex" : `Output the first $${k}$ vertices`, `输出前 $${k}$ 个顶点`],
                  t(
                    `The algorithm outputs $${order.slice(0, k).map(vx).join(", ")}$ first.`,
                    `算法先输出 $${order.slice(0, k).map(vx).join(", ")}$。`,
                  ),
                ],
                [
                  ["Update the in-degrees", "更新入度"],
                  t(
                    `Deleting their arcs leaves the in-degrees ${indegreesTex(remaining, indeg)}, so ${letters(available)} ${available.length === 1 ? "has" : "have"} in-degree $0$: $${available.length}$.`,
                    `删去它们的弧后，入度为 ${indegreesTex(remaining, indeg, true)}，所以入度为 $0$ 的是 ${letters(available, true)}：共 $${available.length}$ 个。`,
                  ),
                ],
              ],
              blocked.length === 0
                ? t(
                    "Every remaining vertex has lost all its incoming arcs, so none of them is still waiting.",
                    "剩下的每个顶点都已失去所有入弧，所以没有顶点还在等待。",
                  )
                : t(
                    `Each other remaining vertex still has an arc from a vertex not yet output: $${witness.join(", ")}$.`,
                    `其余剩下的顶点都还有来自尚未输出顶点的弧：$${witness.join(", ")}$。`,
                  ),
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
  intro: t(
    "Ten friends sit around a round table, and a message starts with $A$ and is passed only between neighbors. A breadth-first search from $A$ on this $10$-cycle reaches the vertices in layers: $A$ itself, then its $2$ neighbors, then $2$ at distance $2$, $2$ at distance $3$, $2$ at distance $4$, and finally the $1$ friend opposite $A$, at distance $5$.\n\nCheck: the layers hold every friend exactly once, $1 + 2 + 2 + 2 + 2 + 1 = 10$.\n\nIn this lesson we find the order in which a breadth-first search visits the vertices and count the vertices in each of its layers.",
    "十个朋友围坐在一张圆桌旁，一条消息从 $A$ 开始，只在相邻的人之间传递。在这个 $10$-圈上从 $A$ 出发做广度优先搜索，按层到达各顶点：先是 $A$ 自己，然后是它的 $2$ 个邻点，接着距离 $2$ 的 $2$ 个、距离 $3$ 的 $2$ 个、距离 $4$ 的 $2$ 个，最后是 $A$ 对面距离 $5$ 的 $1$ 个朋友。\n\n检验：各层恰好包含每个朋友一次，$1 + 2 + 2 + 2 + 2 + 1 = 10$。\n\n本课我们求广度优先搜索访问各顶点的顺序，并数它每一层的顶点个数。",
  ),
  prerequisites: ["connected-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-order-of-a-breadth-first-search",
      figure: discreteDrawings2["breadth-first-search#the-order-of-a-breadth-first-search"],
      title: t("The visiting order", "访问顺序"),
      explanation: t(
        "Take the vertex at the front of the queue, visit it, and add its unvisited neighbors to the back of the queue in alphabetical order. In the drawing the search from $A$ visits $A$, $B$, $D$, $C$, $E$, $F$: first $A$, then its neighbors $B$ and $D$, then the new neighbors of $B$, then those of $D$. In a star whose center $A$ is joined to $10$ leaves $B, C, D, E, F, H, I, J, K, L$, the search visits $A$ and then the leaves alphabetically, so $L$ is visited $11$th, last.\n\n> **Watch out.** A vertex is visited when it leaves the queue, so all of one layer comes before any of the next. Its position is therefore neither its place in the alphabet nor its distance from $A$ plus one.",
        "取出队首的顶点并访问它，再把它尚未访问的邻点按字母顺序加到队尾。图中从 $A$ 出发的搜索依次访问 $A$、$B$、$D$、$C$、$E$、$F$：先访问 $A$，然后是它的邻点 $B$ 和 $D$，接着是 $B$ 的新邻点，再是 $D$ 的新邻点。在中心 $A$ 与 $10$ 个叶子 $B, C, D, E, F, H, I, J, K, L$ 相连的星形图中，搜索先访问 $A$，再按字母顺序访问各叶子，所以 $L$ 是第 $11$ 个被访问的，也是最后一个。\n\n> **注意。** 顶点在出队时才被访问，所以一层的顶点全部排在下一层之前。因此它的位置既不是它在字母表中的位置，也不是它与 $A$ 的距离加一。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const { order } = bfs(g, 0);
        const v = rng.int(1, n - 1);
        const p = order.indexOf(v) + 1;
        const { dist } = bfs(g, 0);
        const d = dist[v]!;
        const before = dist.filter((x) => x < d).length;
        const upTo = dist.filter((x) => x <= d).length;
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} A breadth-first search starts at $A$ and adds neighbors to the queue in alphabetical order. In which position is $${vx(v)}$ visited ($A$ is visited first)?`,
              `${graphIntro(g)["zh-CN"]}从 $A$ 开始广度优先搜索，邻点按字母顺序入队。$${vx(v)}$ 是第几个被访问的（$A$ 是第一个）？`,
            ),
            answer: p,
            mistakes: distinct(
              p,
              [
                why(v + 1, "That is its place in the alphabet; the search visits by layers.", "那是它在字母表中的位置；搜索是按层访问的。"),
                why(
                  d + 1,
                  "That is its distance from $A$ plus one, the number of its layer, not its place in the visiting order.",
                  "那是它与 $A$ 的距离加一，即它所在的层号，不是它在访问顺序中的位置。",
                ),
                why(p + 1, "That is one place too late: follow the queue again, one vertex at a time.", "晚了一位：重新逐个跟踪队列。"),
                why(p - 1, "That is one place too early: follow the queue again, one vertex at a time.", "早了一位：重新逐个跟踪队列。"),
              ].filter((m) => (m.value as number) >= 2),
            ),
            solution: walked(
              [
                [
                  ["Find the layers", "找出各层"],
                  t(`From $A$ the layers are ${layersTex(layersOf(dist))}.`, `从 $A$ 出发，各层为 ${layersTex(layersOf(dist), true)}。`),
                ],
                [
                  ["Follow the queue", "跟踪队列"],
                  t(
                    `Taking vertices off the front of the queue and adding their new neighbors alphabetically visits $${order.map(vx).join(", ")}$, so $${vx(v)}$ is visited in position $${p}$.`,
                    `从队首取出顶点，并按字母顺序把新邻点入队，依次访问 $${order.map(vx).join(", ")}$，所以 $${vx(v)}$ 是第 $${p}$ 个被访问的。`,
                  ),
                ],
              ],
              t(
                `$${vx(v)}$ is at distance $${d}$, so it comes after the $${before}$ vertices closer to $A$ and no later than the $${upTo}$ vertices at distance at most $${d}$: $${before} < ${p} \\le ${upTo}$.`,
                `$${vx(v)}$ 的距离为 $${d}$，所以它排在离 $A$ 更近的 $${before}$ 个顶点之后，且不晚于距离不超过 $${d}$ 的 $${upTo}$ 个顶点：$${before} < ${p} \\le ${upTo}$。`,
              ),
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
        "Breadth-first search from $s$ finds the vertices in layers: layer $k$ is the set of vertices at distance $k$ from $s$, found as the unvisited neighbors of layer $k - 1$. On the $12$-cycle, the search from $A$ finds layers of $2$ vertices at each distance from $1$ to $5$, and a single vertex, the one opposite $A$, at distance $6$.\n\n> **Watch out.** Layer $k$ holds only the vertices at distance exactly $k$, not all those within distance $k$. And a neighbor of layer $k - 1$ that was already found belongs to an earlier layer, so do not count it again.",
        "从 $s$ 出发的广度优先搜索逐层找到顶点：第 $k$ 层是与 $s$ 距离为 $k$ 的顶点，它们是第 $k - 1$ 层的尚未访问的邻点。在 $12$-圈上，从 $A$ 出发的搜索在距离 $1$ 到 $5$ 处各找到 $2$ 个顶点，在距离 $6$ 处只找到 $A$ 对面的 $1$ 个顶点。\n\n> **注意。** 第 $k$ 层只含距离恰为 $k$ 的顶点，而不是距离不超过 $k$ 的所有顶点。第 $k - 1$ 层的邻点若已被找到，就属于更早的层，不要重复计数。",
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
        const layers = layersOf(dist);
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} A breadth-first search starts at $${vx(s)}$. How many vertices are at distance exactly $${k}$ from $${vx(s)}$?`,
              `${graphIntro(g)["zh-CN"]}从 $${vx(s)}$ 开始广度优先搜索。与 $${vx(s)}$ 的距离恰为 $${k}$ 的顶点有多少个？`,
            ),
            answer: layer.length,
            mistakes: distinct(
              layer.length,
              [
                why(
                  upTo,
                  `That counts every vertex within distance $${k}$; only those at distance exactly $${k}$ count.`,
                  `那是数了距离不超过 $${k}$ 的所有顶点；只有距离恰为 $${k}$ 的才算。`,
                ),
                why(
                  layer.length + 1,
                  "That is one too many: a vertex found in an earlier layer is not counted again.",
                  "多了一：在更早的层中找到的顶点不再重复计数。",
                ),
                why(degrees(g)[s]!, "That is the number of neighbors of the start, the first layer.", "那是起点的邻点个数，即第一层。"),
              ].filter((m) => (m.value as number) >= 1),
            ),
            solution: walked(
              [
                [
                  ["Search in layers", "逐层搜索"],
                  t(`From $${vx(s)}$ the layers are ${layersTex(layers)}.`, `从 $${vx(s)}$ 出发，各层为 ${layersTex(layers, true)}。`),
                ],
                [
                  ["Count the layer", "数这一层"],
                  t(
                    `Layer $${k}$ is ${letters(layer)}, so $${layer.length}$ ${layer.length === 1 ? "vertex is" : "vertices are"} at distance $${k}$.`,
                    `第 $${k}$ 层为 ${letters(layer, true)}，所以距离为 $${k}$ 的顶点有 $${layer.length}$ 个。`,
                  ),
                ],
              ],
              t(
                `The layers, $${vx(s)}$ itself included, hold every vertex once: $${layers.map((l) => l.length).join(" + ")} = ${n}$.`,
                `连同 $${vx(s)}$ 本身，各层恰好包含每个顶点一次：$${layers.map((l) => l.length).join(" + ")} = ${n}$。`,
              ),
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** KruskalStep is an edge Kruskal's algorithm examines, with whether it takes the edge. */
interface KruskalStep {
  readonly e: Edge;
  readonly w: number;
  readonly take: boolean;
}

/** kruskalSteps lists the edges Kruskal's algorithm examines, lightest first, until the tree is complete. */
function kruskalSteps(g: WeightedGraph): KruskalStep[] {
  const parent = range(0, g.n - 1);
  const find = (x: number): number => (parent[x] === x ? x : find(parent[x]!));
  const steps: KruskalStep[] = [];
  let taken = 0;
  for (const i of range(0, g.edges.length - 1).sort((x, y) => g.weights[x]! - g.weights[y]!)) {
    if (taken === g.n - 1) break;
    const [a, b] = g.edges[i]!;
    const take = find(a) !== find(b);
    if (take) {
      parent[find(a)] = find(b);
      taken++;
    }
    steps.push({ e: g.edges[i]!, w: g.weights[i]!, take });
  }
  return steps;
}

/** kruskalTex writes the edges Kruskal's algorithm examines: "$AB\colon 1$ taken, $AC\colon 3$ skipped". */
const kruskalTex = (steps: readonly KruskalStep[], zh = false) =>
  steps
    .map(({ e, w, take }) =>
      zh ? `${take ? "取" : "跳过"} $${edgeTex(e)}\\colon ${w}$` : `$${edgeTex(e)}\\colon ${w}$ ${take ? "taken" : "skipped"}`,
    )
    .join(zh ? "，" : ", ");

/** sorted sorts numbers in increasing order. */
const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);

/** kruskalsAlgorithm finds minimum spanning trees by adding the lightest safe edges. */
export const kruskalsAlgorithm: TopicDef = {
  id: "kruskals-algorithm",
  title: t("Kruskal's Algorithm", "Kruskal 算法"),
  summary: t(
    "Kruskal's algorithm sorts the edges by weight and adds each one that does not form a cycle with the edges already chosen. It stops after n − 1 edges, which form a minimum spanning tree.",
    "Kruskal 算法把边按权排序，依次加入不会与已选边构成圈的边。选够 n − 1 条边后停止，它们构成最小生成树。",
  ),
  intro: t(
    "Four villages $A, B, C, D$ are to be joined by roads, and the possible roads cost $AB\\colon 30$, $AC\\colon 35$, $BC\\colon 40$, $CD\\colon 50$, $DA\\colon 60$. Kruskal's algorithm takes the cheapest roads first: $AB$ and $AC$; it skips $BC$, because $B$ and $C$ are already joined through $A$; then it takes $CD$. The cheapest network costs $30 + 35 + 50 = 115$.\n\nCheck: Prim's algorithm from $A$ adds $AB\\colon 30$, then $AC\\colon 35$, then $CD\\colon 50$, the same total of $115$.\n\nIn this lesson we find the weight of a minimum spanning tree with Kruskal's algorithm and follow the edges it adds step by step.",
    "要用道路连接四个村庄 $A, B, C, D$，可修的道路造价为 $AB\\colon 30$、$AC\\colon 35$、$BC\\colon 40$、$CD\\colon 50$、$DA\\colon 60$。Kruskal 算法先取最便宜的道路：$AB$ 和 $AC$；它跳过 $BC$，因为 $B$ 和 $C$ 已经经由 $A$ 连通；然后取 $CD$。最便宜的路网造价为 $30 + 35 + 50 = 115$。\n\n检验：从 $A$ 出发的 Prim 算法依次加入 $AB\\colon 30$、$AC\\colon 35$、$CD\\colon 50$，总价同样是 $115$。\n\n本课我们用 Kruskal 算法求最小生成树的权，并逐步跟踪它加入的边。",
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
        "Take edges in increasing weight, skipping any that would close a cycle, until $n - 1$ edges are chosen. With weights $AB\\colon 1$, $BC\\colon 2$, $AC\\colon 3$, $CD\\colon 4$ on four vertices: take $AB$, $BC$, skip $AC$, take $CD$; the minimum spanning tree has weight $1 + 2 + 4 = 7$.\n\n> **Watch out.** The $n - 1$ lightest edges need not form a tree: one of them may close a cycle and must be skipped. And a spanning tree has exactly $n - 1$ edges, no fewer.",
        "按权从小到大取边，跳过会构成圈的边，直到选出 $n - 1$ 条边。在四个顶点上，若权为 $AB\\colon 1$、$BC\\colon 2$、$AC\\colon 3$、$CD\\colon 4$：取 $AB$、$BC$，跳过 $AC$，取 $CD$；最小生成树的权为 $1 + 2 + 4 = 7$。\n\n> **注意。** 最轻的 $n - 1$ 条边不一定构成树：其中某条可能构成圈，必须跳过。而生成树恰好有 $n - 1$ 条边，不能更少。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const added = kruskal(g);
        const value = sum(added);
        const naive = sum(sorted(g.weights).slice(0, n - 1));
        const steps = kruskalSteps(g);
        const primWeights = prim(n, weightOf(g)).weights;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Find the total weight of a minimum spanning tree.`,
              `${weightedIntro(g)["zh-CN"]}求最小生成树的总权。`,
            ),
            answer: value,
            mistakes: distinct(value, [
              why(
                naive,
                `That adds the $${n - 1}$ lightest edges, but one of them closes a cycle and must be skipped.`,
                `那是把最轻的 $${n - 1}$ 条边相加，但其中有边构成圈，必须跳过。`,
              ),
              why(
                value - Math.min(...added),
                `That leaves out the lightest edge; a spanning tree on $${n}$ vertices needs $${n - 1}$ edges.`,
                `那漏掉了最轻的边；$${n}$ 个顶点的生成树需要 $${n - 1}$ 条边。`,
              ),
              why(sum(g.weights) - value, "That is the weight of the edges left out of the tree.", "那是没有选入树中的边的权。"),
            ]),
            solution: walked(
              [
                [
                  ["Take edges lightest first", "从最轻的边开始取"],
                  t(`In increasing order of weight: ${kruskalTex(steps)}.`, `按权从小到大：${kruskalTex(steps, true)}。`),
                ],
                [
                  ["Add the weights", "把权相加"],
                  t(
                    `The tree uses the weights $${added.join(", ")}$, for a total of $${added.join(" + ")} = ${value}$.`,
                    `树所用的权为 $${added.join(", ")}$，总权为 $${added.join(" + ")} = ${value}$。`,
                  ),
                ],
              ],
              t(
                `Prim's algorithm from $A$ adds the weights $${primWeights.join(", ")}$, again $${primWeights.join(" + ")} = ${value}$.`,
                `从 $A$ 出发的 Prim 算法加入的权为 $${primWeights.join(", ")}$，同样是 $${primWeights.join(" + ")} = ${value}$。`,
              ),
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
        "Kruskal's algorithm may skip edges: an edge whose ends are already joined by chosen edges would form a cycle. So the $k$th edge added is not always the $k$th lightest edge. With $AB\\colon 21$, $BC\\colon 22$, $AC\\colon 23$, $CD\\colon 24$, the algorithm takes $AB$ and $BC$, skips $AC$, and takes $CD$, so the $3$rd edge added weighs $24$, while the $3$rd lightest edge weighs $23$.\n\n> **Watch out.** Count only the edges taken, not the ones skipped. And an edge is skipped only when its two ends are already connected; being heavier than the edges before it is not a reason.",
        "Kruskal 算法可能跳过一些边：两端已经被已选边连通的边会构成圈。所以加入的第 $k$ 条边不一定是第 $k$ 轻的边。若 $AB\\colon 21$、$BC\\colon 22$、$AC\\colon 23$、$CD\\colon 24$，算法取 $AB$ 和 $BC$，跳过 $AC$，再取 $CD$，所以加入的第 $3$ 条边权为 $24$，而第 $3$ 轻的边权为 $23$。\n\n> **注意。** 只数取到的边，不数跳过的边。而且只有两端已经连通时才跳过一条边；比前面的边重不是跳过的理由。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(3, 5));
        const added = kruskal(g);
        const sortedWeights = sorted(g.weights);
        const k = rng.int(3, n - 1);
        const value = added[k - 1]!;
        const steps = kruskalSteps(g);
        const rank = sortedWeights.indexOf(value) + 1;
        const skipped = rank - k;
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Kruskal's algorithm is used to build a minimum spanning tree. What is the weight of the ${ordinal(k)} edge it adds?`,
              `${weightedIntro(g)["zh-CN"]}用 Kruskal 算法构造最小生成树。它加入的第 $${k}$ 条边的权是多少？`,
            ),
            answer: value,
            mistakes: distinct(value, [
              why(
                sortedWeights[k - 1]!,
                `That is the ${ordinal(k)} lightest edge, but an edge that closes a cycle is skipped.`,
                `那是第 $${k}$ 轻的边，但构成圈的边要跳过。`,
              ),
              why(
                added[k - 2]!,
                `That is the ${ordinal(k - 1)} edge added, one step too early.`,
                `那是加入的第 $${k - 1}$ 条边，早了一步。`,
              ),
              why(added[k] ?? value + 1, "That is one step too late: count only the edges taken.", "晚了一步：只数取到的边。"),
              why(
                sortedWeights[k]!,
                "That counts a skipped edge as added; count only the edges taken.",
                "那是把跳过的边也算作加入了；只数取到的边。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Take edges lightest first", "从最轻的边开始取"],
                  t(`In increasing order of weight: ${kruskalTex(steps)}.`, `按权从小到大：${kruskalTex(steps, true)}。`),
                ],
                [
                  ["Count the edges taken", "数取到的边"],
                  t(
                    `The edges taken have weights $${added.join(", ")}$, so the ${ordinal(k)} has weight $${value}$.`,
                    `取到的边权依次为 $${added.join(", ")}$，所以第 $${k}$ 条的权为 $${value}$。`,
                  ),
                ],
              ],
              skipped === 0
                ? t(
                    `No edge was skipped before it, so $${value}$ is also the ${ordinal(rank)} lightest weight.`,
                    `在它之前没有跳过任何边，所以 $${value}$ 也是第 $${rank}$ 轻的权。`,
                  )
                : t(
                    `$${value}$ is the ${ordinal(rank)} lightest weight, and the $${skipped}$ ${skipped === 1 ? "edge" : "edges"} skipped before it make up the difference: $${k} + ${skipped} = ${rank}$.`,
                    `$${value}$ 是第 $${rank}$ 轻的权，在它之前跳过的 $${skipped}$ 条边正好补足差额：$${k} + ${skipped} = ${rank}$。`,
                  ),
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
  ],
};

/** PrimStep is a vertex Prim's algorithm adds, with the tree vertex it joins through and the weight of that edge. */
interface PrimStep {
  readonly u: number;
  readonly v: number;
  readonly w: number;
}

/** primSteps pairs each vertex Prim's algorithm adds with the tree vertex it joins through; the weights must be distinct. */
const primSteps = (
  vertices: readonly number[],
  weights: readonly number[],
  weight: (a: number, b: number) => number | undefined,
): PrimStep[] =>
  vertices.slice(1).map((v, i) => ({ u: vertices.slice(0, i + 1).find((u) => weight(u, v) === weights[i])!, v, w: weights[i]! }));

/** primTex writes the steps of Prim's algorithm: "$AC\colon 1$ adds $C$". */
const primTex = (steps: readonly PrimStep[], zh = false) =>
  steps
    .map(({ u, v, w }) => (zh ? `$${vx(u)}${vx(v)}\\colon ${w}$ 加入 $${vx(v)}$` : `$${vx(u)}${vx(v)}\\colon ${w}$ adds $${vx(v)}$`))
    .join(zh ? "，" : ", ");

/** candidatesTex lists the edges from the tree vertices to the others: "$AB\colon 3$, $CB\colon 2$". */
const candidatesTex = (n: number, tree: readonly number[], weight: (a: number, b: number) => number | undefined, zh = false) =>
  tree
    .flatMap((u) =>
      range(0, n - 1)
        .filter((v) => !tree.includes(v) && weight(u, v) !== undefined)
        .map((v) => `$${vx(u)}${vx(v)}\\colon ${weight(u, v)}$`),
    )
    .join(zh ? "、" : ", ");

/** primsAlgorithm grows a minimum spanning tree from a starting vertex. */
export const primsAlgorithm: TopicDef = {
  id: "prims-algorithm",
  title: t("Prim's Algorithm", "Prim 算法"),
  summary: t(
    "Prim's algorithm grows a tree from a starting vertex, each time adding the lightest edge that joins the tree to a vertex outside it. After n − 1 steps it has a minimum spanning tree.",
    "Prim 算法从一个起点开始生长一棵树，每次加入连接树与树外顶点的最轻边。经过 n − 1 步得到最小生成树。",
  ),
  intro: t(
    "A cable network starts at the station $A$ and must reach $B$, $C$ and $D$; the possible cables cost $AB\\colon 25$, $BC\\colon 30$, $CD\\colon 22$, $DA\\colon 40$, $AC\\colon 35$. Prim's algorithm grows the network from $A$: the cheapest cable leaving $A$ is $AB\\colon 25$; from $A$ and $B$ it is $BC\\colon 30$; from $A$, $B$ and $C$ it is $CD\\colon 22$. The network costs $25 + 30 + 22 = 77$.\n\nCheck: Kruskal's algorithm takes $CD\\colon 22$, $AB\\colon 25$ and $BC\\colon 30$, the same three cables, again $77$.\n\nIn this lesson we follow the edges Prim's algorithm adds and the order in which it adds the vertices.",
    "一个电缆网络从站点 $A$ 出发，要连到 $B$、$C$、$D$；可铺的电缆造价为 $AB\\colon 25$、$BC\\colon 30$、$CD\\colon 22$、$DA\\colon 40$、$AC\\colon 35$。Prim 算法从 $A$ 开始扩展网络：离开 $A$ 的最便宜电缆是 $AB\\colon 25$；从 $A$、$B$ 出发的是 $BC\\colon 30$；从 $A$、$B$、$C$ 出发的是 $CD\\colon 22$。网络造价为 $25 + 30 + 22 = 77$。\n\n检验：Kruskal 算法取 $CD\\colon 22$、$AB\\colon 25$、$BC\\colon 30$，正是同样三条电缆，同样是 $77$。\n\n本课我们跟踪 Prim 算法加入的边，以及它加入各顶点的顺序。",
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
        "Unlike Kruskal's algorithm, Prim's algorithm only considers edges leaving the current tree. Starting at $A$ with $AB\\colon 50$, $AC\\colon 22$, $CB\\colon 21$, it adds $AC$ first, because $CB$ does not touch the tree yet, and then $CB$; it never adds $AB$.\n\n> **Watch out.** At each step look at every edge from any tree vertex to a vertex outside, not only the edges at the vertex added last. And the lightest edge of the whole graph may wait until the tree reaches it.",
        "与 Kruskal 算法不同，Prim 算法只考虑离开当前树的边。从 $A$ 出发，若 $AB\\colon 50$、$AC\\colon 22$、$CB\\colon 21$，则先加入 $AC$，因为 $CB$ 还没有接触到树，然后加入 $CB$；它永远不会加入 $AB$。\n\n> **注意。** 每一步都要看从任一树中顶点到树外顶点的所有边，而不只是最后加入的顶点的边。整个图中最轻的边可能要等树延伸到它时才加入。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const { weights, vertices } = prim(n, weightOf(g));
        const k = rng.int(2, n - 1);
        const value = weights[k - 1]!;
        const steps = primSteps(vertices, weights, weightOf(g));
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Prim's algorithm is run starting from $A$. What is the weight of the ${ordinal(k)} edge it adds?`,
              `${weightedIntro(g)["zh-CN"]}从 $A$ 开始运行 Prim 算法。它加入的第 $${k}$ 条边的权是多少？`,
            ),
            answer: value,
            mistakes: distinct(value, [
              why(
                kruskal(g)[k - 1]!,
                `That is the ${ordinal(k)} edge Kruskal's algorithm adds; Prim's algorithm only uses edges leaving its tree.`,
                `那是 Kruskal 算法加入的第 $${k}$ 条边；Prim 算法只用离开树的边。`,
              ),
              why(
                weights[k - 2]!,
                `That is the ${ordinal(k - 1)} edge added, one step too early.`,
                `那是加入的第 $${k - 1}$ 条边，早了一步。`,
              ),
              why(
                weights[k] ?? value + 1,
                "That is one step too late: count the edges from the first one added.",
                "晚了一步：从加入的第一条边开始数。",
              ),
              why(
                sorted(g.weights)[k - 1]!,
                `That is the ${ordinal(k)} lightest edge of the whole graph; only edges leaving the tree count.`,
                `那是整个图中第 $${k}$ 轻的边；只有离开树的边才算。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Grow the tree", "扩展树"],
                  t(
                    `From $A$, the lightest edge leaving the tree each time gives ${primTex(steps)}.`,
                    `从 $A$ 出发，每次取离开树的最轻边：${primTex(steps, true)}。`,
                  ),
                ],
                [
                  ["Read the step", "读出这一步"],
                  t(
                    `The edges added have weights $${weights.join(", ")}$, so the ${ordinal(k)} has weight $${value}$.`,
                    `加入的边权依次为 $${weights.join(", ")}$，所以第 $${k}$ 条的权为 $${value}$。`,
                  ),
                ],
              ],
              t(
                `Before step $${k}$ the tree holds ${letters(vertices.slice(0, k))}, and the edges leaving it are ${candidatesTex(n, vertices.slice(0, k), weightOf(g))}; the lightest is $${value}$.`,
                `第 $${k}$ 步之前树中有 ${letters(vertices.slice(0, k), true)}，离开树的边为 ${candidatesTex(n, vertices.slice(0, k), weightOf(g), true)}；其中最轻的是 $${value}$。`,
              ),
            ),
          }),
          g,
          { weights: g.weights },
        );
      },
    },
    {
      id: "the-order-prims-algorithm-adds-vertices",
      figure: discreteDrawings2["prims-algorithm#the-order-prims-algorithm-adds-vertices"],
      title: t("The order of the vertices", "顶点的加入顺序"),
      explanation: t(
        "Prim's algorithm adds one new vertex at each step. Track the tree's vertices and, at each step, the lightest edge from them to the rest. In the drawing, from $A$ it adds $AC\\colon 1$, then $CB\\colon 2$, which beats $AB\\colon 3$, then $CD\\colon 4$, which beats $BD\\colon 5$: the vertices join in the order $A, C, B, D$, and the tree weighs $7$. With $AB\\colon 21$, $AC\\colon 28$, $BC\\colon 22$, $CD\\colon 23$, the algorithm adds $B$ at step $1$, $C$ at step $2$ through $BC$, and $D$ at step $3$.\n\n> **Watch out.** Step $1$ is the first edge added; the start $A$ is there before any step. And a vertex near $A$ in the drawing can still join late, if the edges reaching it are heavy.",
        "Prim 算法每一步加入一个新顶点。记录树中的顶点，每一步找出从它们到其余顶点的最轻边。图中从 $A$ 出发，先加入 $AC\\colon 1$，然后是胜过 $AB\\colon 3$ 的 $CB\\colon 2$，再是胜过 $BD\\colon 5$ 的 $CD\\colon 4$：顶点依次加入的顺序为 $A, C, B, D$，树的权为 $7$。若 $AB\\colon 21$、$AC\\colon 28$、$BC\\colon 22$、$CD\\colon 23$，算法在第 $1$ 步加入 $B$，第 $2$ 步经由 $BC$ 加入 $C$，第 $3$ 步加入 $D$。\n\n> **注意。** 第 $1$ 步是加入第一条边；起点 $A$ 在任何一步之前就在树中。图中离 $A$ 很近的顶点，如果连到它的边都很重，也可能很晚才加入。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomWeighted(rng, n, rng.int(2, 4));
        const { vertices, weights } = prim(n, weightOf(g));
        const v = rng.int(1, n - 1);
        const step = vertices.indexOf(v);
        const steps = primSteps(vertices, weights, weightOf(g));
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Prim's algorithm is run starting from $A$. At which step is $${vx(v)}$ added to the tree (the first edge added is step $1$)?`,
              `${weightedIntro(g)["zh-CN"]}从 $A$ 开始运行 Prim 算法。$${vx(v)}$ 在第几步加入树中（加入第一条边为第 $1$ 步）？`,
            ),
            answer: step,
            mistakes: distinct(
              step,
              [
                why(
                  step + 1,
                  "That counts the start $A$ as step $1$; the first edge added is step $1$.",
                  "那是把起点 $A$ 算作第 $1$ 步；加入第一条边才是第 $1$ 步。",
                ),
                why(step - 1, "That is one step too early: list the vertices as they join.", "早了一步：按加入顺序列出各顶点。"),
                why(
                  v,
                  "That is its place after $A$ in the alphabet; the weights decide the order.",
                  "那是它在字母表中排在 $A$ 之后的位置；顺序由权决定。",
                ),
                why(
                  bfs(g, 0).dist[v]!,
                  "That is the number of edges between $A$ and it; the weights decide the order.",
                  "那是它与 $A$ 之间的边数；顺序由权决定。",
                ),
              ].filter((m) => (m.value as number) >= 1),
            ),
            solution: walked(
              [
                [
                  ["Grow the tree", "扩展树"],
                  t(
                    `From $A$, the lightest edge leaving the tree each time gives ${primTex(steps)}.`,
                    `从 $A$ 出发，每次取离开树的最轻边：${primTex(steps, true)}。`,
                  ),
                ],
                [
                  ["Find the step", "找出这一步"],
                  t(
                    `The vertices join in the order $${vertices.map(vx).join(", ")}$, so $${vx(v)}$ joins at step $${step}$.`,
                    `顶点加入的顺序为 $${vertices.map(vx).join(", ")}$，所以 $${vx(v)}$ 在第 $${step}$ 步加入。`,
                  ),
                ],
              ],
              t(
                `Before step $${step}$ the tree holds ${letters(vertices.slice(0, step))}, and the edges leaving it are ${candidatesTex(n, vertices.slice(0, step), weightOf(g))}; the lightest, $${weights[step - 1]}$, reaches $${vx(v)}$.`,
                `第 $${step}$ 步之前树中有 ${letters(vertices.slice(0, step), true)}，离开树的边为 ${candidatesTex(n, vertices.slice(0, step), weightOf(g), true)}；其中最轻的 $${weights[step - 1]}$ 连到 $${vx(v)}$。`,
              ),
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

/** matrixGraph turns a symmetric matrix of weights into the complete weighted graph it describes. */
const matrixGraph = (M: readonly (readonly number[])[]): WeightedGraph => {
  const edges = allPairs(M.length);
  return { n: M.length, edges, weights: edges.map(([a, b]) => M[a]![b]!) };
};

/** applyingPrimsAlgorithmToADistanceMatrix runs Prim's algorithm on a table of weights. */
export const applyingPrimsAlgorithmToADistanceMatrix: TopicDef = {
  id: "applying-prims-algorithm-to-a-distance-matrix",
  title: t("Applying Prim's Algorithm to a Distance Matrix", "在距离矩阵上应用 Prim 算法"),
  summary: t(
    "When a complete weighted graph is given as a matrix, Prim's algorithm works on the table: cross out the rows of vertices in the tree, and at each step pick the smallest entry in their columns among the rows not yet crossed out.",
    "当完全带权图以矩阵给出时，Prim 算法可以直接在表上进行：划去树中顶点所在的行，每一步在这些顶点的列中、尚未划去的行里选最小的元。",
  ),
  intro: t(
    "A table gives the distances between three towns: $AB\\colon 45$, $AC\\colon 50$, $BC\\colon 60$. Prim's algorithm on the table starts in column $A$, whose smallest entry, $45$, is in row $B$; it adds $B$. In columns $A$ and $B$, the only row left is $C$, holding $50$ and $60$, so it adds $C$ through the entry $50$. The shortest network is $45 + 50 = 95$ long.\n\nCheck: a spanning tree of three towns leaves out exactly one of the three roads, and leaving out the longest, $60$, gives $45 + 50 + 60 - 60 = 95$.\n\nIn this lesson we run Prim's algorithm directly on a matrix of weights, to find the weight of a minimum spanning tree and the entry chosen at each step.",
    "一张表给出三个城镇之间的距离：$AB\\colon 45$、$AC\\colon 50$、$BC\\colon 60$。在表上运行 Prim 算法，从 $A$ 列开始，它最小的元 $45$ 在 $B$ 行，于是加入 $B$。在 $A$、$B$ 两列中只剩 $C$ 行，其中为 $50$ 和 $60$，于是经由元 $50$ 加入 $C$。最短的路网长 $45 + 50 = 95$。\n\n检验：三个城镇的生成树恰好舍去三条路中的一条，舍去最长的 $60$，得 $45 + 50 + 60 - 60 = 95$。\n\n本课我们直接在权矩阵上运行 Prim 算法，求最小生成树的权，以及每一步选出的元。",
  ),
  prerequisites: ["prims-algorithm", "distance-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "minimum-spanning-trees-from-a-matrix",
      figure: discreteDrawings2["applying-prims-algorithm-to-a-distance-matrix#minimum-spanning-trees-from-a-matrix"],
      title: t("The minimum weight", "最小权"),
      explanation: t(
        "Start with column $A$. Pick its smallest entry in a row not yet in the tree; add that row's vertex and include its column. Repeat with the columns of all tree vertices until every vertex is in the tree, then add the chosen entries. In the drawing, the entries chosen are $1$ in row $C$, then $2$ in row $B$, then $4$, for a total of $1 + 2 + 4 = 7$. With $AB\\colon 52$, $AC\\colon 47$, $BC\\colon 44$, column $A$ gives $47$ in row $C$, then columns $A$ and $C$ give $44$ in row $B$, for a total of $47 + 44 = 91$.\n\n> **Watch out.** Search the columns of every vertex already in the tree, not only column $A$. And take entries only in rows outside the tree, or the chosen edges can close a cycle.",
        "从 $A$ 列开始。在尚未加入树的行中选出该列最小的元；加入该行的顶点，并把它的列也纳入考虑。对所有树中顶点的列重复此步，直到所有顶点都在树中，再把选出的元相加。图中依次选出 $C$ 行的 $1$、$B$ 行的 $2$，然后是 $4$，总和为 $1 + 2 + 4 = 7$。若 $AB\\colon 52$、$AC\\colon 47$、$BC\\colon 44$，$A$ 列给出 $C$ 行的 $47$，然后 $A$、$C$ 两列给出 $B$ 行的 $44$，总和为 $47 + 44 = 91$。\n\n> **注意。** 要搜索已在树中的每个顶点的列，而不只是 $A$ 列。而且只取树外顶点所在行的元，否则选出的边可能构成圈。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const M = randomWeightMatrix(rng, n);
        const { weights, vertices } = prim(n, (a, b) => M[a]![b]!);
        const value = sum(weights);
        const shown = M.map((r, i) => r.map((x, j) => (i === j ? "-" : x)));
        const rowMins = sum(M.slice(1).map((r, i) => Math.min(...r.filter((_, j) => j !== i + 1))));
        const steps = primSteps(vertices, weights, (a, b) => M[a]![b]!);
        const kw = kruskal(matrixGraph(M));
        return numberProblem({
          prompt: t(
            `The weights of the edges of a complete graph on $${orderTex(n)}$ are given by the matrix $${matTex(shown)}$. Use Prim's algorithm from $A$ to find the total weight of a minimum spanning tree.`,
            `顶点为 $${orderTex(n)}$ 的完全图的边权由矩阵 $${matTex(shown)}$ 给出。从 $A$ 开始用 Prim 算法求最小生成树的总权。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              rowMins,
              "That adds the smallest entry of each row after $A$; two rows can pick the same edge, and the edges need not form a tree.",
              "那是把 $A$ 之后每一行的最小元相加；两行可能选到同一条边，选出的边也不一定构成树。",
            ),
            why(
              sum(M[0]!),
              "That adds all of row $A$, the edges from $A$ alone; the tree may branch from other vertices.",
              "那是把 $A$ 行全部相加，即只用从 $A$ 出发的边；树也可以从其他顶点分支。",
            ),
            why(
              value - weights[weights.length - 1]!,
              `That stops a step early; a spanning tree on $${n}$ vertices needs $${n - 1}$ edges.`,
              `那早停了一步；$${n}$ 个顶点的生成树需要 $${n - 1}$ 条边。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Choose entries", "选元"],
                t(
                  `From column $A$, the smallest entry in the tree's columns and the other rows each time gives ${primTex(steps)}.`,
                  `从 $A$ 列开始，每次在树中顶点的列、树外顶点的行里取最小的元：${primTex(steps, true)}。`,
                ),
              ],
              [
                ["Add them", "相加"],
                t(
                  `The chosen entries add up to $${weights.join(" + ")} = ${value}$.`,
                  `选出的元之和为 $${weights.join(" + ")} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Kruskal's algorithm on the same weights takes $${kw.join(", ")}$, again $${kw.join(" + ")} = ${value}$.`,
              `对同样的权运行 Kruskal 算法，取到 $${kw.join(", ")}$，同样是 $${kw.join(" + ")} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "steps-of-prims-algorithm-on-a-matrix",
      figure: discreteDrawings2["applying-prims-algorithm-to-a-distance-matrix#steps-of-prims-algorithm-on-a-matrix"],
      title: t("The steps", "步骤"),
      explanation: t(
        "At each step only the columns of the vertices already in the tree are searched, and only in rows of vertices outside it. The entry chosen gives both the edge's weight and the vertex added. In the drawing, with $A$ and $C$ in the tree, rows $B$ and $D$ of columns $A$ and $C$ hold $3$, $6$, $2$ and $4$; the smallest, $2$, adds $B$ by the edge $CB$. If instead row $B$ held $47$ and $42$ and row $D$ held $55$ and $50$ in columns $A$ and $C$, the smallest, $42$, would add $B$ by the edge $CB$.\n\n> **Watch out.** The smallest entry of the whole matrix need not be chosen at this step: it may lie in a row already in the tree, or wait until its column joins. And search every tree column, not only that of the vertex added last.",
        "每一步只在已在树中的顶点所在的列里搜索，并且只看树外顶点所在的行。选出的元同时给出边的权和加入的顶点。图中 $A$、$C$ 已在树中，$A$、$C$ 两列在 $B$、$D$ 两行的元为 $3$、$6$、$2$、$4$；最小的 $2$ 经由边 $CB$ 加入 $B$。若 $A$、$C$ 两列中 $B$ 行为 $47$ 和 $42$，$D$ 行为 $55$ 和 $50$，则最小的 $42$ 经由边 $CB$ 加入 $B$。\n\n> **注意。** 整个矩阵的最小元不一定在这一步被选中：它可能位于已在树中的行，或者要等它的列加入后才能选。还要搜索每个树中顶点的列，而不只是最后加入的顶点的列。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const M = randomWeightMatrix(rng, n);
        const { weights, vertices } = prim(n, (a, b) => M[a]![b]!);
        const k = rng.int(2, n - 1);
        const value = weights[k - 1]!;
        const shown = M.map((r, i) => r.map((x, j) => (i === j ? "-" : x)));
        const lightest = [...new Set(M.flat().filter((x) => x > 0))].sort((a, b) => a - b);
        const weight = (a: number, b: number) => (a === b ? undefined : M[a]![b]!);
        const steps = primSteps(vertices, weights, weight);
        return numberProblem({
          prompt: t(
            `The weights of the edges of a complete graph on $${orderTex(n)}$ are given by the matrix $${matTex(shown)}$. Prim's algorithm is run from $A$. What is the weight of the ${ordinal(k)} edge it adds?`,
            `顶点为 $${orderTex(n)}$ 的完全图的边权由矩阵 $${matTex(shown)}$ 给出。从 $A$ 开始运行 Prim 算法。它加入的第 $${k}$ 条边的权是多少？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              lightest[k - 1]!,
              `That is the ${ordinal(k)} smallest entry of the whole matrix; only the tree's columns and the other rows count.`,
              `那是整个矩阵中第 $${k}$ 小的元；只有树中顶点的列、树外顶点的行才算。`,
            ),
            why(
              weights[k - 2]!,
              `That is the ${ordinal(k - 1)} entry chosen, one step too early.`,
              `那是选出的第 $${k - 1}$ 个元，早了一步。`,
            ),
            why(
              Math.min(...M[vertices[k - 1]!]!.filter((x, j) => x > 0 && !vertices.slice(0, k).includes(j))),
              "That searches only the column of the vertex added last; every tree column counts.",
              "那只搜索了最后加入的顶点的列；每个树中顶点的列都要算。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Choose entries", "选元"],
                t(
                  `From column $A$, the smallest entry in the tree's columns and the other rows each time gives ${primTex(steps)}.`,
                  `从 $A$ 列开始，每次在树中顶点的列、树外顶点的行里取最小的元：${primTex(steps, true)}。`,
                ),
              ],
              [
                ["Read the step", "读出这一步"],
                t(
                  `The entries chosen are $${weights.join(", ")}$, so the ${ordinal(k)} edge has weight $${value}$.`,
                  `选出的元依次为 $${weights.join(", ")}$，所以第 $${k}$ 条边的权为 $${value}$。`,
                ),
              ],
            ],
            t(
              `Before step $${k}$ the tree holds ${letters(vertices.slice(0, k))}, and the entries in their columns and the other rows are ${candidatesTex(n, vertices.slice(0, k), weight)}; the smallest is $${value}$.`,
              `第 $${k}$ 步之前树中有 ${letters(vertices.slice(0, k), true)}，它们的列在其余行中的元为 ${candidatesTex(n, vertices.slice(0, k), weight, true)}；其中最小的是 $${value}$。`,
            ),
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

/** shortestPathList lists every shortest path from s to v, each as its vertices in order. */
function shortestPathList(g: Graph, s: number, v: number): number[][] {
  const { dist } = bfs(g, s);
  const adj = neighbors(g);
  const go = (x: number): number[][] =>
    x === s ? [[s]] : adj[x]!.filter((u) => dist[u] === dist[x]! - 1).flatMap((u) => go(u).map((p) => [...p, x]));
  return go(v);
}

/** pathTex writes a path as its vertices: "$A, B, D$". */
const pathTex = (p: readonly number[]) => `$${p.map(vx).join(", ")}$`;

/** shortestPathsInUnweightedGraphs counts shortest paths and finds diameters. */
export const shortestPathsInUnweightedGraphs: TopicDef = {
  id: "shortest-paths-in-unweighted-graphs",
  title: t("Shortest Paths in Unweighted Graphs", "无权图中的最短路径"),
  summary: t(
    "Breadth-first search finds shortest paths in an unweighted graph. The number of shortest paths from s to v is the sum of those to the neighbors of v one layer closer to s. The diameter is the largest distance between two vertices.",
    "广度优先搜索可以求无权图中的最短路径。从 s 到 v 的最短路径数等于到 v 的那些更靠近 s 一层的邻点的最短路径数之和。直径是两个顶点之间的最大距离。",
  ),
  intro: t(
    "Ten stops lie on a circular bus route, and $A$ wants to reach the stop directly opposite, $5$ stops away either way. Labeling each stop with its number of shortest routes from $A$, every stop before the opposite one gets $1$, since it is reached from one side only, and the opposite stop gets $1 + 1 = 2$, one from each of its neighbors.\n\nCheck: the two shortest routes are clockwise and counterclockwise around the circle, each with $5$ edges.\n\nIn this lesson we count the shortest paths between two vertices with breadth-first search, and find the diameter of a graph.",
    "一条环形公交线路上有十个车站，$A$ 要去正对面的车站，往哪个方向走都要 $5$ 站。给每个车站标上从 $A$ 出发的最短路线数：对面车站之前的每一站都标 $1$，因为只能从一侧到达；对面的车站标 $1 + 1 = 2$，两个邻站各贡献一条。\n\n检验：两条最短路线分别是沿环顺时针和逆时针走，各有 $5$ 条边。\n\n本课我们用广度优先搜索计数两个顶点之间的最短路径，并求图的直径。",
  ),
  prerequisites: ["breadth-first-search"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-shortest-paths",
      figure: discreteDrawings2["shortest-paths-in-unweighted-graphs#counting-shortest-paths"],
      title: t("Counting shortest paths", "数最短路径"),
      explanation: t(
        "Label $s$ with $1$. Going layer by layer, label each vertex with the sum of the labels of its neighbors in the previous layer. In the drawing, in the $4$-cycle $A, B, C, D$, vertex $C$ gets $1 + 1 = 2$: the shortest paths $A, B, C$ and $A, D, C$. In the complete bipartite graph $K_{2,7}$, whose two vertices $A$ and $B$ are each joined to the same $7$ others, $B$ is at distance $2$ from $A$ and gets $1 + 1 + 1 + 1 + 1 + 1 + 1 = 7$.\n\n> **Watch out.** Add only the labels of neighbors in the previous layer; neighbors in the same layer or the next lie on no shortest path to the vertex. And the count of paths is not the distance.",
        "给 $s$ 标 $1$。逐层进行，每个顶点的标号等于它在上一层的邻点的标号之和。图中在 $4$-圈 $A, B, C, D$ 中，$C$ 的标号为 $1 + 1 = 2$：最短路径为 $A, B, C$ 和 $A, D, C$。在完全二部图 $K_{2,7}$ 中，$A$ 和 $B$ 两个顶点各与同样的 $7$ 个顶点相连，$B$ 与 $A$ 的距离为 $2$，标号为 $1 + 1 + 1 + 1 + 1 + 1 + 1 = 7$。\n\n> **注意。** 只加上一层邻点的标号；同一层或下一层的邻点都不在到这个顶点的最短路径上。而且路径的条数不是距离。",
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
        const d = dist[v]!;
        const reached = range(0, n - 1).filter((u) => u !== 0 && dist[u]! <= d);
        const paths = shortestPathList(g, 0, v);
        return fig(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many shortest paths are there from $A$ to $${vx(v)}$?`,
              `${graphIntro(g)["zh-CN"]}从 $A$ 到 $${vx(v)}$ 的最短路径有多少条？`,
            ),
            answer: value,
            mistakes: distinct(
              value,
              [
                why(
                  d,
                  "That is the distance, the length of a shortest path, not the number of them.",
                  "那是距离，即最短路径的长度，不是它们的条数。",
                ),
                why(
                  value + 1,
                  "That is one too many: add only the labels of neighbors in the previous layer.",
                  "多了一：只加上一层邻点的标号。",
                ),
                why(
                  degrees(g)[v]!,
                  "That counts every neighbor; only the neighbors one layer closer to $A$ count.",
                  "那数了所有邻点；只有离 $A$ 近一层的邻点才算。",
                ),
                why(
                  value - 1,
                  "That is one too few: recheck each label against the layer before it.",
                  "少了一：对照上一层重新检查每个标号。",
                ),
              ].filter((m) => (m.value as number) >= 1),
            ),
            solution: walked(
              [
                [
                  ["Find the layers", "找出各层"],
                  t(
                    `From $A$ the layers are ${layersTex(layersOf(dist))}, so $d(A, ${vx(v)}) = ${d}$.`,
                    `从 $A$ 出发，各层为 ${layersTex(layersOf(dist), true)}，所以 $d(A, ${vx(v)}) = ${d}$。`,
                  ),
                ],
                [
                  ["Label layer by layer", "逐层标号"],
                  t(
                    `Starting from $A\\colon 1$ and adding the labels of the neighbors in the previous layer gives ${reached
                      .map((u) => `$${vx(u)}\\colon ${counts[u]}$`)
                      .join(", ")}, so there ${value === 1 ? "is" : "are"} $${value}$.`,
                    `从 $A\\colon 1$ 开始，每次加上一层邻点的标号，得 ${reached.map((u) => `$${vx(u)}\\colon ${counts[u]}$`).join("、")}，所以共 $${value}$ 条。`,
                  ),
                ],
              ],
              t(
                `Listing them: ${paths.map(pathTex).join("; ")}, which ${paths.length === 1 ? "is" : "are"} $${paths.length}$ ${paths.length === 1 ? "path" : "paths"} with $${d}$ edges each.`,
                `逐一列出：${paths.map(pathTex).join("；")}，共 $${paths.length}$ 条，每条都有 $${d}$ 条边。`,
              ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "the-diameter-of-a-graph",
      figure: discreteDrawings2["shortest-paths-in-unweighted-graphs#the-diameter-of-a-graph"],
      title: t("The diameter", "直径"),
      explanation: t(
        "The diameter is $\\max_{u, v} d(u, v)$. Run a breadth-first search from every vertex and take the largest distance found. In the drawing, the path on $5$ vertices has diameter $4$, the distance between its two ends, and the complete graph $K_4$ has diameter $1$, since every two vertices are adjacent. The $12$-cycle has diameter $6$, the distance between opposite vertices.\n\n> **Watch out.** The search from a single vertex finds only that vertex's largest distance; another pair can be farther apart. And the diameter is the largest distance, not the smallest of the vertices' largest distances.",
        "直径是 $\\max_{u, v} d(u, v)$。从每个顶点出发做广度优先搜索，取找到的最大距离。图中有 $5$ 个顶点的路径直径为 $4$，即两个端点之间的距离；完全图 $K_4$ 的直径为 $1$，因为任意两个顶点都相邻。$12$-圈的直径为 $6$，即相对顶点之间的距离。\n\n> **注意。** 从一个顶点出发的搜索只能找到该顶点的最大距离；另一对顶点可能相距更远。而且直径是最大距离，不是各顶点最大距离中的最小者。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomConnected(rng, n, rng.int(0, 3));
        const ecc = range(0, n - 1).map((s) => Math.max(...bfs(g, s).dist));
        const value = Math.max(...ecc);
        const pair = range(0, n - 1)
          .flatMap((u) => range(u + 1, n - 1).map((w) => [u, w] as const))
          .find(([u, w]) => bfs(g, u).dist[w] === value)!;
        const path = shortestPathList(g, pair[0], pair[1])[0]!;
        return fig(
          numberProblem({
            prompt: t(`${graphIntro(g).en} What is the diameter of $G$?`, `${graphIntro(g)["zh-CN"]}$G$ 的直径是多少？`),
            answer: value,
            mistakes: distinct(
              value,
              [
                why(
                  ecc[0]!,
                  "That is the largest distance from $A$ only; another pair of vertices is farther apart.",
                  "那只是从 $A$ 出发的最大距离；另一对顶点相距更远。",
                ),
                why(
                  Math.min(...ecc),
                  "That is the smallest of the largest distances, the radius, not the diameter.",
                  "那是各顶点最大距离中的最小者，即半径，不是直径。",
                ),
                why(value - 1, "That is one too few: some pair of vertices is farther apart.", "少了一：有一对顶点相距更远。"),
                why(
                  n - 1,
                  `That is the diameter of a path on $${n}$ vertices; the extra edges make distances shorter.`,
                  `那是 $${n}$ 个顶点的路径的直径；多出的边会缩短距离。`,
                ),
              ].filter((m) => (m.value as number) >= 1),
            ),
            solution: walked(
              [
                [
                  ["Search from every vertex", "从每个顶点出发搜索"],
                  t(
                    `A breadth-first search from each vertex gives its largest distance: ${range(0, n - 1)
                      .map((u) => `$${vx(u)}\\colon ${ecc[u]}$`)
                      .join(", ")}.`,
                    `从每个顶点出发做广度优先搜索，得到它的最大距离：${range(0, n - 1)
                      .map((u) => `$${vx(u)}\\colon ${ecc[u]}$`)
                      .join("、")}。`,
                  ),
                ],
                [
                  ["Take the largest", "取最大值"],
                  t(
                    `The largest of these is $${value}$, so the diameter is $${value}$.`,
                    `其中最大的是 $${value}$，所以直径为 $${value}$。`,
                  ),
                ],
              ],
              t(
                `The farthest pair includes $${vx(pair[0])}$ and $${vx(pair[1])}$: a shortest path between them is ${pathTex(path)}, with $${value}$ edges.`,
                `最远的一对顶点包括 $${vx(pair[0])}$ 和 $${vx(pair[1])}$：它们之间的一条最短路径为 ${pathTex(path)}，有 $${value}$ 条边。`,
              ),
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** weightedRoute finds a shortest weighted path from A to v, given the shortest distances. */
function weightedRoute(g: WeightedGraph, dist: readonly number[], v: number): number[] {
  const w = weightOf(g);
  const route = [v];
  let x = v;
  while (x !== 0) {
    const y = x;
    x = range(0, g.n - 1).find((u) => u !== y && w(u, y) !== undefined && dist[u]! + w(u, y)! === dist[y])!;
    route.unshift(x);
  }
  return route;
}

/** distancesTex writes the distances of every vertex: "$A\colon 0$, $B\colon 3$". */
const distancesTex = (vs: readonly number[], dist: readonly number[], zh = false) =>
  vs.map((u) => `$${vx(u)}\\colon ${dist[u]}$`).join(zh ? "、" : ", ");

/** dijkstrasAlgorithm finds shortest weighted distances. */
export const dijkstrasAlgorithm: TopicDef = {
  id: "dijkstras-algorithm",
  title: t("Dijkstra's Algorithm", "Dijkstra 算法"),
  summary: t(
    "Dijkstra's algorithm finds shortest distances from s in a graph with nonnegative weights. It repeatedly finalizes the unvisited vertex with the smallest tentative distance and relaxes the edges leaving it: d(v) ← min(d(v), d(u) + w(u, v)).",
    "Dijkstra 算法求非负权图中从 s 出发的最短距离。它反复确定暂定距离最小的未访问顶点，并松弛从它出发的边：d(v) ← min(d(v), d(u) + w(u, v))。",
  ),
  intro: t(
    "A road runs straight from town $A$ to town $B$ in $50$ minutes, but there is also a road from $A$ to $C$ of $20$ minutes and one from $C$ to $B$ of $25$. Dijkstra's algorithm sets $d(A) = 0$, finalizes $A$ and gives $d(B) = 50$, $d(C) = 20$; then it finalizes $C$, the closest, and improves $d(B)$ to $\\min(50, 20 + 25) = 45$.\n\nCheck: the route $A, C, B$ takes $20 + 25 = 45$ minutes, less than the $50$ of the direct road.\n\nIn this lesson we find shortest weighted distances with Dijkstra's algorithm and the order in which it finalizes the vertices.",
    "从城镇 $A$ 到城镇 $B$ 有一条直达公路，需要 $50$ 分钟；另有一条从 $A$ 到 $C$ 的公路需要 $20$ 分钟，从 $C$ 到 $B$ 需要 $25$ 分钟。Dijkstra 算法令 $d(A) = 0$，确定 $A$，得 $d(B) = 50$，$d(C) = 20$；然后确定最近的 $C$，把 $d(B)$ 改进为 $\\min(50, 20 + 25) = 45$。\n\n检验：路线 $A, C, B$ 需要 $20 + 25 = 45$ 分钟，比直达公路的 $50$ 分钟少。\n\n本课我们用 Dijkstra 算法求最短带权距离，以及它确定各顶点的顺序。",
  ),
  prerequisites: ["shortest-paths-in-unweighted-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "shortest-weighted-distances",
      figure: discreteDrawings2["dijkstras-algorithm#shortest-weighted-distances"],
      title: t("Shortest distances", "最短距离"),
      explanation: t(
        "Dijkstra's algorithm repeatedly finalizes the closest unfinished vertex and updates its neighbors, which works because weights are never negative. In the drawing, with $AB\\colon 4$, $AC\\colon 1$, $CB\\colon 2$: start $d(A) = 0$; finalize $A$, so $d(B) = 4$, $d(C) = 1$; finalize $C$, and $d(B) = \\min(4, 1 + 2) = 3$. With $AB\\colon 30$, $AC\\colon 18$, $CB\\colon 16$, $CD\\colon 17$, $BD\\colon 40$: finalizing $A$ gives $d(B) = 30$, $d(C) = 18$; finalizing $C$ gives $d(D) = 18 + 17 = 35$ and leaves $d(B) = \\min(30, 18 + 16) = 30$.\n\n> **Watch out.** The direct edge is not always shortest, and neither is the path with the fewest edges. Add up the weights along the path, not the number of edges.",
        "迪杰斯特拉算法反复确定距离最近的未完成顶点并更新它的邻居，这之所以可行，是因为权重从不为负。图中若 $AB\\colon 4$、$AC\\colon 1$、$CB\\colon 2$：开始 $d(A) = 0$；确定 $A$，得 $d(B) = 4$，$d(C) = 1$；确定 $C$，$d(B) = \\min(4, 1 + 2) = 3$。若 $AB\\colon 30$、$AC\\colon 18$、$CB\\colon 16$、$CD\\colon 17$、$BD\\colon 40$：确定 $A$ 得 $d(B) = 30$，$d(C) = 18$；确定 $C$ 得 $d(D) = 18 + 17 = 35$，而 $d(B) = \\min(30, 18 + 16) = 30$ 不变。\n\n> **注意。** 直接的边不一定最短，边数最少的路径也不一定最短。要把路径上的权相加，而不是数边数。",
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
        const { order } = dijkstra(g);
        const route = weightedRoute(g, dist, v);
        const legs = route.slice(1).map((y, i) => weightOf(g)(route[i]!, y)!);
        return fig(
          numberProblem({
            prompt: t(
              `${weightedIntro(g).en} Find the length of a shortest path from $A$ to $${vx(v)}$.`,
              `${weightedIntro(g)["zh-CN"]}求从 $A$ 到 $${vx(v)}$ 的最短路径的长度。`,
            ),
            answer: value,
            mistakes: distinct(value, [
              ...(direct !== undefined
                ? [
                    why(
                      direct,
                      "That is the direct edge; a route through other vertices is lighter.",
                      "那是直接的边；经过其他顶点的路线更轻。",
                    ),
                  ]
                : []),
              why(hops, "That counts the edges on the path; add their weights instead.", "那是数了路径上的边数；应当把它们的权相加。"),
              why(value + 1, "That is one too much: recheck the sums along the path.", "多了一：重新检查路径上的权之和。"),
              why(value + Math.min(...g.weights), "That adds one edge too many to the path.", "那是给路径多加了一条边。"),
            ]),
            solution: walked(
              [
                [
                  ["Finalize the closest vertex each time", "每次确定最近的顶点"],
                  t(
                    `From $A$, Dijkstra's algorithm finalizes $${order.map(vx).join(", ")}$ in turn, relaxing the edges of each, and the distances are ${distancesTex(range(0, n - 1), dist)}.`,
                    `从 $A$ 出发，Dijkstra 算法依次确定 $${order.map(vx).join(", ")}$，并松弛各自的边，得距离为 ${distancesTex(range(0, n - 1), dist, true)}。`,
                  ),
                ],
                [["Read the distance", "读出距离"], t(`So $d(${vx(v)}) = ${value}$.`, `所以 $d(${vx(v)}) = ${value}$。`)],
              ],
              t(
                `The path ${pathTex(route)} has weight $${sumTex(legs, value)}$.`,
                `路径 ${pathTex(route)} 的权为 $${sumTex(legs, value)}$。`,
              ),
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
        "Dijkstra's algorithm finalizes vertices in increasing order of their distance from the start, which can differ from the order of the number of edges on their shortest paths. With $AB\\colon 40$, $AC\\colon 16$, $CD\\colon 17$, $DB\\colon 18$, the distances are $d(C) = 16$, $d(D) = 33$ and $d(B) = 40$, so the order is $A, C, D, B$: $D$, two edges from $A$, comes before $B$, which is adjacent to $A$.\n\n> **Watch out.** Finalize by distance, not by the alphabet or by the number of edges. A vertex's tentative distance can still drop before it is finalized, so compare the final distances.",
        "Dijkstra 算法按与起点距离从小到大的顺序确定顶点，这可能与最短路径所含边数的顺序不同。若 $AB\\colon 40$、$AC\\colon 16$、$CD\\colon 17$、$DB\\colon 18$，则距离为 $d(C) = 16$、$d(D) = 33$、$d(B) = 40$，所以顺序为 $A, C, D, B$：离 $A$ 两条边的 $D$ 排在与 $A$ 相邻的 $B$ 之前。\n\n> **注意。** 要按距离确定，而不是按字母顺序或边数。一个顶点的暂定距离在被确定之前还可能下降，所以要比较最终距离。",
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
            mistakes: distinct(
              p,
              [
                why(p + 1, "That is one place too late: order the vertices by distance again.", "晚了一位：重新按距离给顶点排序。"),
                why(p - 1, "That is one place too early: order the vertices by distance again.", "早了一位：重新按距离给顶点排序。"),
                why(
                  bfs(g, 0).order.indexOf(v) + 1,
                  "That is its place in a breadth-first search, which ignores the weights.",
                  "那是它在广度优先搜索中的位置，忽略了权。",
                ),
                why(
                  v + 1,
                  "That is its place in the alphabet; the distances decide the order.",
                  "那是它在字母表中的位置；顺序由距离决定。",
                ),
              ].filter((m) => (m.value as number) >= 2),
            ),
            solution: walked(
              [
                [
                  ["Find the distances", "求距离"],
                  t(
                    `Dijkstra's algorithm from $A$ gives the final distances ${distancesTex(range(0, n - 1), dist)}.`,
                    `从 $A$ 出发运行 Dijkstra 算法，得最终距离为 ${distancesTex(range(0, n - 1), dist, true)}。`,
                  ),
                ],
                [
                  ["Order by distance", "按距离排序"],
                  t(
                    `Finalizing in increasing order of distance gives $${order.map(vx).join(", ")}$, so $${vx(v)}$ is in position $${p}$.`,
                    `按距离从小到大确定，顺序为 $${order.map(vx).join(", ")}$，所以 $${vx(v)}$ 是第 $${p}$ 个。`,
                  ),
                ],
              ],
              t(
                `Along that order the distances never decrease: $${order.map((u) => dist[u]).join(" \\le ")}$.`,
                `沿这个顺序，距离从不减小：$${order.map((u) => dist[u]).join(" \\le ")}$。`,
              ),
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
