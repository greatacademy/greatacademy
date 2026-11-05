import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { article, choiceProblem, numberProblem, verdictChoice, yesNo } from "../problems.ts";
import {
  allPairs,
  bfs,
  componentCount,
  degrees,
  digraphIntro,
  type Edge,
  edgeTex,
  type Graph,
  graphFigure,
  graphIntro,
  neighbors,
  randomConnected,
  randomGraph,
  sortEdges,
  vx,
} from "./discrete-mathematics-graph-common.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 7, part 1: graphs, connectivity and trees.

/** neighborsOf lists the neighbors of each vertex. */
const neighborsOf = (g: Graph): number[][] =>
  range(0, g.n - 1).map((v) => g.edges.flatMap(([a, b]) => (a === v ? [b] : b === v ? [a] : [])));

/** cycleTex writes a cycle of the given length, from its smallest vertex: "A - B - C - A". */
function cycleTex(g: Graph, length: number): string {
  const adjacent = neighborsOf(g);
  const path: number[] = [];
  const extend = (v: number): boolean => {
    path.push(v);
    if (path.length === length) {
      if (adjacent[v]!.includes(path[0]!)) return true;
    } else {
      for (const w of adjacent[v]!) if (w > path[0]! && !path.includes(w) && extend(w)) return true;
    }
    path.pop();
    return false;
  };
  for (let s = 0; s < g.n; s++) if (extend(s)) break;
  return [...path, path[0]!].map((v) => vx(v)).join(" - ");
}

/** piecesTex writes the vertex sets of the connected components: "\{A, B\}, \{C\}". */
function piecesTex(g: Graph): string {
  const adjacent = neighborsOf(g);
  const seen = new Set<number>();
  const pieces: string[] = [];
  for (let s = 0; s < g.n; s++) {
    if (seen.has(s)) continue;
    const piece = [s];
    seen.add(s);
    for (let i = 0; i < piece.length; i++) {
      for (const w of adjacent[piece[i]!]!) {
        if (!seen.has(w)) {
          seen.add(w);
          piece.push(w);
        }
      }
    }
    pieces.push(
      `\\{${piece
        .sort((a, b) => a - b)
        .map((v) => vx(v))
        .join(", ")}\\}`,
    );
  }
  return pieces.join(", ");
}

/** choose computes the binomial coefficient C(n, k). */
const choose = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
};

/** factorial computes n!. */
const factorial = (n: number) => range(1, n).reduce((p, k) => p * k, 1);

/** withFigure attaches a drawing of g to a problem. */
const withFigure = <P extends object>(p: P, g: Graph, directed = false) => ({ ...p, figure: graphFigure(g, { directed }) });

/** introductionToGraphs introduces vertices, edges and neighbors. */
export const introductionToGraphs: TopicDef = {
  id: "introduction-to-graphs",
  title: t("Introduction to Graphs", "图的简介"),
  summary: t(
    "A graph $G = (V, E)$ is a set of vertices $V$ and a set $E$ of edges, each joining two vertices. In a simple graph there are no loops or repeated edges, so it has at most $\\binom{n}{2}$ edges on $n$ vertices.",
    "图 $G = (V, E)$ 由顶点集 $V$ 和边集 $E$ 组成，每条边连接两个顶点。简单图没有环和重边，所以 $n$ 个顶点的简单图至多有 $\\binom{n}{2}$ 条边。",
  ),
  prerequisites: ["relations-on-finite-sets", "combinations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-edges-from-neighbor-lists",
      title: t("Edges from neighbor lists", "由邻点表数边"),
      explanation: t(
        "If $N(A) = \\{B, C\\}$, $N(B) = \\{A\\}$, $N(C) = \\{A\\}$, the edges are $AB$ and $AC$. Each edge appears in two lists, so the number of edges is half the total length of the lists: $\\frac{4}{2} = 2$.",
        "若 $N(A) = \\{B, C\\}$，$N(B) = \\{A\\}$，$N(C) = \\{A\\}$，则边为 $AB$ 和 $AC$。每条边出现在两个表中，所以边数是各表长度总和的一半：$\\frac{4}{2} = 2$。",
      ),
      figure: graphFigure({
        n: 3,
        edges: [
          [0, 1],
          [0, 2],
        ],
      }),
      generate(rng) {
        const n = rng.int(5, 7);
        const g = randomGraph(rng, n, rng.int(n - 1, n + 4));
        const adj = neighbors(g);
        const lists = adj.map((l, i) => `N(${vx(i)}) = ${l.length === 0 ? "\\varnothing" : `\\{${l.map(vx).join(", ")}\\}`}`).join(",\\ ");
        const m = g.edges.length;
        return numberProblem({
          prompt: t(
            `A simple graph has these neighbor lists: $${lists}$. How many edges does it have?`,
            `一个简单图的邻点表如下：$${lists}$。它有多少条边？`,
          ),
          answer: m,
          wrong: [2 * m, m + 1, n, m - 1],
          solution: t(
            `The lists have $${2 * m}$ entries in total and each edge is listed twice, so there are $${m}$ edges.`,
            `各表共有 $${2 * m}$ 项，每条边被列出两次，所以共有 $${m}$ 条边。`,
          ),
        });
      },
    },
    {
      id: "the-maximum-number-of-edges",
      title: t("The maximum number of edges", "边数的最大值"),
      explanation: t(
        "In a simple graph on $n$ vertices each pair of vertices is joined at most once, so there are at most $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ edges. For $n = 10$ that is $45$.",
        "$n$ 个顶点的简单图中，每对顶点至多连一条边，所以至多有 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ 条边。$n = 10$ 时为 $45$。",
      ),
      generate(rng) {
        const n = rng.int(4, 40);
        const value = choose(n, 2);
        return numberProblem({
          prompt: t(
            `What is the largest number of edges a simple graph on $${n}$ vertices can have?`,
            `$${n}$ 个顶点的简单图最多能有多少条边？`,
          ),
          answer: value,
          wrong: [n * (n - 1), n * n, n - 1, choose(n + 1, 2)],
          solution: t(
            `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${value}$.`,
            `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** walkClass classifies a vertex sequence: 0 path, 1 trail but not path, 2 walk but not trail, 3 not a walk. */
function walkClass(g: Graph, seq: readonly number[]): number {
  const has = new Set(g.edges.map(([a, b]) => a * 32 + b));
  const keys = seq.slice(1).map((v, i) => Math.min(v, seq[i]!) * 32 + Math.max(v, seq[i]!));
  if (keys.some((k) => !has.has(k))) return 3;
  if (new Set(keys).size < keys.length) return 2;
  if (new Set(seq).size < seq.length) return 1;
  return 0;
}

/** WALK_CLASSES name the classes of walkClass. */
const WALK_CLASSES = [
  t("A path", "路径"),
  t("A trail but not a path", "迹，但不是路径"),
  t("A walk but not a trail", "途径，但不是迹"),
  t("Not a walk", "不是途径"),
] as const;

/** walksTrailsPathsAndDistances distinguishes walks, trails and paths and finds distances. */
export const walksTrailsPathsAndDistances: TopicDef = {
  id: "walks-trails-paths-and-distances",
  title: t("Walks, Trails, Paths, and Distances", "途径、迹、路径与距离"),
  summary: t(
    "A walk follows edges from vertex to vertex; a trail repeats no edge; a path repeats no vertex. The distance d(u, v) is the length of a shortest path from u to v.",
    "途径沿着边从一个顶点走到另一个顶点；迹不重复边；路径不重复顶点。距离 d(u, v) 是从 u 到 v 的最短路径的长度。",
  ),
  prerequisites: ["introduction-to-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-walks",
      title: t("Walks, trails and paths", "途径、迹与路径"),
      explanation: t(
        "In a triangle $ABC$ with a pendant edge $CD$: $A, B, C, D$ is a path; $A, B, C, A$ repeats a vertex but no edge, so it is a trail; $C, D, C$ uses $CD$ twice, so it is only a walk; $A, D$ is not a walk because $AD$ is not an edge.",
        "在三角形 $ABC$ 加悬挂边 $CD$ 的图中：$A, B, C, D$ 是路径；$A, B, C, A$ 重复顶点但不重复边，是迹；$C, D, C$ 两次经过 $CD$，只是途径；$A, D$ 不是途径，因为 $AD$ 不是边。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        const g = randomConnected(rng, n, rng.int(2, 4));
        const adj = neighbors(g);
        const target = rng.int(0, 3);
        let seq: number[] = [];
        for (let tries = 0; tries < 60; tries++) {
          const len = rng.int(3, 6);
          seq = [rng.int(0, n - 1)];
          while (seq.length < len) seq.push(rng.pick(adj[seq[seq.length - 1]!]!));
          if (target === 3) {
            const i = rng.int(1, seq.length - 1);
            const bad = range(0, n - 1).filter((v) => v !== seq[i - 1] && !adj[seq[i - 1]!]!.includes(v));
            if (bad.length > 0) seq[i] = rng.pick(bad);
          }
          if (walkClass(g, seq) === target) break;
        }
        const cls = walkClass(g, seq);
        const why = [
          t(
            "Consecutive vertices are joined by edges and no vertex is repeated, so it is a path.",
            "相邻的顶点之间都有边，且没有重复的顶点，所以它是路径。",
          ),
          t(
            "A vertex is repeated, so it is not a path, but no edge is repeated, so it is a trail.",
            "有顶点重复，所以不是路径；但没有边重复，所以它是迹。",
          ),
          t(
            "Consecutive vertices are joined by edges, so it is a walk, but an edge is used twice, so it is not a trail.",
            "相邻的顶点之间都有边，所以它是途径；但有一条边被经过两次，所以不是迹。",
          ),
          t(
            "Two consecutive vertices are not joined by an edge, so it is not a walk at all.",
            "有两个相邻的顶点之间没有边，所以它根本不是途径。",
          ),
        ][cls]!;
        const s = seq.map(vx).join(", ");
        return withFigure(
          choiceProblem({
            prompt: t(`${graphIntro(g).en} What is the sequence $${s}$?`, `${graphIntro(g)["zh-CN"]}序列 $${s}$ 是什么？`),
            options: WALK_CLASSES,
            correct: cls,
            solution: why,
          }),
          g,
        );
      },
    },
    {
      id: "distances-in-graphs",
      title: t("Distances", "距离"),
      explanation: t(
        "To find $d(A, F)$, list the vertices at distance $1$ from $A$, then those at distance $2$ (new neighbors of the previous layer), and so on until $F$ appears.",
        "求 $d(A, F)$ 时，先列出与 $A$ 距离为 $1$ 的顶点，再列出距离为 $2$ 的（上一层的新邻点），依此类推，直到出现 $F$。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        let g: Graph;
        let s: number;
        let e: number;
        let d: number;
        do {
          g = randomConnected(rng, n, rng.int(0, 3));
          s = rng.int(0, n - 1);
          const dist = bfs(g, s).dist;
          e = rng.int(0, n - 1);
          d = dist[e]!;
        } while (d < 2);
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} Find $d(${vx(s)}, ${vx(e)})$.`, `${graphIntro(g)["zh-CN"]}求 $d(${vx(s)}, ${vx(e)})$。`),
            answer: d,
            wrong: [d + 1, d - 1, d + 2],
            solution: t(
              `Layers from $${vx(s)}$: ${layers(g, s)}. So $d(${vx(s)}, ${vx(e)}) = ${d}$.`,
              `从 $${vx(s)}$ 出发的各层：${layers(g, s)}。所以 $d(${vx(s)}, ${vx(e)}) = ${d}$。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** layers writes the vertices at each distance from s. */
function layers(g: Graph, s: number, directed = false): string {
  const dist = bfs(g, s, directed).dist;
  const max = Math.max(...dist.filter(Number.isFinite));
  return range(0, max)
    .map(
      (k) =>
        `$${k}\\colon ${range(0, g.n - 1)
          .filter((v) => dist[v] === k)
          .map(vx)
          .join(", ")}$`,
    )
    .join("; ");
}

/** randomDigraph picks m random arcs on n vertices. */
function randomDigraph(rng: Rng, n: number, m: number): Graph {
  const arcs = range(0, n - 1).flatMap((i) => range(0, n - 1).flatMap((j) => (i === j ? [] : [[i, j] as const])));
  return { n, edges: rng.sample(arcs, m).sort((x, y) => x[0] - y[0] || x[1] - y[1]) };
}

/** walksPathsAndDistancesInDirectedGraphs follows arcs in their direction. */
export const walksPathsAndDistancesInDirectedGraphs: TopicDef = {
  id: "walks-paths-and-distances-in-directed-graphs",
  title: t("Walks, Paths, and Distances in Directed Graphs", "有向图中的途径、路径与距离"),
  summary: t(
    "In a directed graph each arc (u, v) can be followed only from u to v. The directed distance from u to v is the length of a shortest directed path, and it can differ from the distance from v to u.",
    "有向图中，弧 (u, v) 只能从 u 走向 v。从 u 到 v 的有向距离是最短有向路径的长度，它可能与从 v 到 u 的距离不同。",
  ),
  prerequisites: ["walks-trails-paths-and-distances", "graphical-representations-of-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "directed-distances",
      title: t("Directed distances", "有向距离"),
      explanation: t(
        "In a directed graph you may only travel along arcs in their direction, so the distance from one vertex to another can differ from the reverse distance. With arcs $(A, B), (B, C), (C, A)$: $d(A, C) = 2$ via $A \\to B \\to C$, but $d(C, A) = 1$. Distances in directed graphs need not be symmetric.",
        "在有向图中只能沿弧的方向行进，所以从一个顶点到另一个顶点的距离可能与反方向的距离不同。若弧为 $(A, B), (B, C), (C, A)$：$d(A, C) = 2$（经 $A \\to B \\to C$），但 $d(C, A) = 1$。有向图中的距离不一定对称。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        let g: Graph;
        let s: number;
        let e: number;
        let d: number;
        do {
          g = randomDigraph(rng, n, rng.int(n + 1, n + 4));
          s = rng.int(0, n - 1);
          e = rng.int(0, n - 1);
          d = bfs(g, s, true).dist[e]!;
        } while (!(d >= 2 && Number.isFinite(d)));
        const back = bfs(g, e, true).dist[s]!;
        const undirected = bfs(g, s).dist[e]!;
        return withFigure(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Find the directed distance from $${vx(s)}$ to $${vx(e)}$.`,
              `${digraphIntro(g)["zh-CN"]}求从 $${vx(s)}$ 到 $${vx(e)}$ 的有向距离。`,
            ),
            answer: d,
            wrong: [d + 1, d - 1, ...(Number.isFinite(back) ? [back] : []), undirected],
            solution: t(
              `Following arcs forward, the layers from $${vx(s)}$ are ${layers(g, s, true)}. So the distance is $${d}$.`,
              `沿弧的方向，从 $${vx(s)}$ 出发的各层为 ${layers(g, s, true)}。所以距离为 $${d}$。`,
            ),
          }),
          g,
          true,
        );
      },
    },
    {
      id: "counting-directed-walks-of-length-two",
      title: t("Directed walks of length 2", "长度为 2 的有向途径"),
      explanation: t(
        "A directed walk of length $2$ from $u$ to $v$ is $u \\to w \\to v$, one for each $w$ with arcs $(u, w)$ and $(w, v)$. Count the out-neighbors of $u$ that are in-neighbors of $v$.",
        "从 $u$ 到 $v$ 的长度为 $2$ 的有向途径形如 $u \\to w \\to v$，每个同时有弧 $(u, w)$ 和 $(w, v)$ 的 $w$ 对应一条。数一数 $u$ 的出邻点中有多少是 $v$ 的入邻点。",
      ),
      generate(rng) {
        const n = rng.int(5, 6);
        const g = randomDigraph(rng, n, rng.int(n + 3, n + 7));
        const has = new Set(g.edges.map(([a, b]) => a * 32 + b));
        const count = (u: number, v: number) => range(0, n - 1).filter((w) => has.has(u * 32 + w) && has.has(w * 32 + v));
        const pairs = allPairs(n).flatMap(([a, b]) => [[a, b] as const, [b, a] as const]);
        const good = pairs.filter(([a, b]) => count(a, b).length > 0);
        const [u, v] = good.length > 0 && rng.bool(0.85) ? rng.pick(good) : rng.pick(pairs);
        const ws = count(u, v);
        const rev = count(v, u).length;
        return withFigure(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many directed walks of length $2$ go from $${vx(u)}$ to $${vx(v)}$?`,
              `${digraphIntro(g)["zh-CN"]}从 $${vx(u)}$ 到 $${vx(v)}$ 的长度为 $2$ 的有向途径有多少条？`,
            ),
            answer: ws.length,
            wrong: [rev, ws.length + 1, neighbors(g, true)[u]!.length],
            solution:
              ws.length === 0
                ? t(
                    `No vertex $w$ has both $(${vx(u)}, w)$ and $(w, ${vx(v)})$, so there are none.`,
                    `没有顶点 $w$ 同时有 $(${vx(u)}, w)$ 和 $(w, ${vx(v)})$，所以没有。`,
                  )
                : t(
                    `The middle vertex can be ${ws.map((w) => `$${vx(w)}$`).join(", ")}, so the number of such walks is $${ws.length}$.`,
                    `中间顶点可以是 ${ws.map((w) => `$${vx(w)}$`).join("、")}，所以共 $${ws.length}$ 条。`,
                  ),
          }),
          g,
          true,
        );
      },
    },
  ],
};

/** theDegreeOfAVertex counts the edges at a vertex. */
export const theDegreeOfAVertex: TopicDef = {
  id: "the-degree-of-a-vertex",
  title: t("The Degree of a Vertex", "顶点的度"),
  summary: t(
    "The degree deg(v) is the number of edges at v; a loop at v counts twice. In a simple graph it equals the number of neighbors of v.",
    "度 deg(v) 是与 v 关联的边数；v 处的环计两次。在简单图中它等于 v 的邻点个数。",
  ),
  prerequisites: ["introduction-to-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "degrees-in-simple-graphs",
      title: t("Degrees in simple graphs", "简单图中的度"),
      explanation: t(
        "The degree of a vertex is the number of edges that meet it, which in a simple graph equals the number of its neighbors. If $E = \\{AB, AC, BC, CD\\}$, then $C$ lies on $AC$, $BC$ and $CD$, so $\\deg(C) = 3$.",
        "顶点的度是与它相连的边数，在简单图中它等于该顶点的邻居个数。若 $E = \\{AB, AC, BC, CD\\}$，则 $C$ 在 $AC$、$BC$、$CD$ 上，所以 $\\deg(C) = 3$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomGraph(rng, n, rng.int(n, n + 5));
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const at = g.edges.filter(([a, b]) => a === v || b === v).map(edgeTex);
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} Find $\\deg(${vx(v)})$.`, `${graphIntro(g)["zh-CN"]}求 $\\deg(${vx(v)})$。`),
            answer: d,
            wrong: [d + 1, d - 1, g.edges.length - d, 2 * d],
            solution: t(
              at.length === 0
                ? `No edge contains $${vx(v)}$, so its degree is $0$.`
                : `The edges at $${vx(v)}$ are $${at.join(", ")}$, so $\\deg(${vx(v)}) = ${d}$.`,
              at.length === 0
                ? `没有边含 $${vx(v)}$，所以它的度为 $0$。`
                : `含 $${vx(v)}$ 的边为 $${at.join(", ")}$，所以 $\\deg(${vx(v)}) = ${d}$。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "degrees-with-loops-and-multiple-edges",
      title: t("Loops and multiple edges", "环与重边"),
      explanation: t(
        "In the multigraph with edges $AA, AB, AB, BC$, vertex $A$ meets the loop twice and each copy of $AB$ once: $\\deg(A) = 2 + 2 = 4$.",
        "在边为 $AA, AB, AB, BC$ 的多重图中，$A$ 与环关联两次，与 $AB$ 的两个副本各关联一次：$\\deg(A) = 2 + 2 = 4$。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const v = rng.int(0, n - 1);
        const edges: Edge[] = [];
        const loops = rng.int(1, 2);
        for (let i = 0; i < loops; i++) edges.push([v, v]);
        for (let i = 0; i < rng.int(3, 6); i++) {
          const a = rng.int(0, n - 1);
          edges.push(sortEdges([[a, rng.pick(range(0, n - 1).filter((x) => x !== a))]])[0]!);
        }
        if (rng.bool()) {
          const a = rng.int(0, n - 1);
          edges.push([a, a]);
        }
        const sorted = [...edges].sort((x, y) => x[0] - y[0] || x[1] - y[1]);
        const d = sorted.reduce((s, [a, b]) => s + (a === v ? 1 : 0) + (b === v ? 1 : 0), 0);
        const ownLoops = sorted.filter(([a, b]) => a === v && b === v).length;
        return numberProblem({
          prompt: t(
            `A multigraph has vertices ${range(0, n - 1)
              .map((x) => `$${vx(x)}$`)
              .join(", ")} and edges $${sorted.map(edgeTex).join(", ")}$ (repeated edges are listed separately). Find $\\deg(${vx(v)})$.`,
            `一个多重图的顶点为 ${range(0, n - 1)
              .map((x) => `$${vx(x)}$`)
              .join("、")}，边为 $${sorted.map(edgeTex).join(", ")}$（重边分别列出）。求 $\\deg(${vx(v)})$。`,
          ),
          answer: d,
          wrong: [
            d - ownLoops,
            d + 1,
            sorted.filter(([a, b]) => a === v || b === v).length === d ? d - 1 : sorted.filter(([a, b]) => a === v || b === v).length,
          ],
          solution: t(
            `${ownLoops === 1 ? "The loop" : `Each of the $${ownLoops}$ loops`} at $${vx(v)}$ counts $2$, and every other edge at $${vx(v)}$ counts $1$: $\\deg(${vx(v)}) = ${d}$.`,
            `$${vx(v)}$ 处的 $${ownLoops}$ 个环各计 $2$，其余与 $${vx(v)}$ 关联的边各计 $1$：$\\deg(${vx(v)}) = ${d}$。`,
          ),
        });
      },
    },
  ],
};

/** theHandshakingLemma uses that degrees sum to twice the number of edges. */
export const theHandshakingLemma: TopicDef = {
  id: "the-handshaking-lemma",
  title: t("The Handshaking Lemma", "握手引理"),
  summary: t(
    "Every edge adds 2 to the sum of the degrees, so Σ deg(v) = 2|E|. Consequently the number of vertices of odd degree is even.",
    "每条边使度数和增加 2，所以 Σ deg(v) = 2|E|。因此奇度顶点的个数是偶数。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-from-a-degree-sequence",
      title: t("Edges from degrees", "由度数求边数"),
      explanation: t(
        "Every edge has two ends and adds one to the degree of each, so the degrees sum to twice the number of edges. A graph with degrees $3, 3, 2, 2, 2$ has $\\frac{3 + 3 + 2 + 2 + 2}{2} = 6$ edges.",
        "每条边有两个端点，使每个端点的度各加 1，所以度数之和等于边数的两倍。度数为 $3, 3, 2, 2, 2$ 的图有 $\\frac{3 + 3 + 2 + 2 + 2}{2} = 6$ 条边。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const g = randomGraph(rng, n, rng.int(n, Math.min(n + 8, (n * (n - 1)) / 2)));
        const ds = degrees(g).sort((a, b) => b - a);
        const sum = ds.reduce((a, b) => a + b, 0);
        return numberProblem({
          prompt: t(
            `A graph has vertex degrees $${ds.join(", ")}$. How many edges does it have?`,
            `一个图各顶点的度为 $${ds.join(", ")}$。它有多少条边？`,
          ),
          answer: sum / 2,
          wrong: [sum, n, sum / 2 + 1, Math.max(...ds)],
          solution: t(`The degrees sum to $${sum} = 2|E|$, so $|E| = ${sum / 2}$.`, `度数和为 $${sum} = 2|E|$，所以 $|E| = ${sum / 2}$。`),
        });
      },
    },
    {
      id: "counting-vertices-with-the-handshaking-lemma",
      title: t("Counting vertices", "求顶点数"),
      explanation: t(
        "A graph with $10$ edges has $4$ vertices of degree $3$ and the rest of degree $2$. Then $4 \\cdot 3 + 2k = 20$, so $k = 4$ vertices have degree $2$.",
        "一个图有 $10$ 条边，其中 $4$ 个顶点的度为 $3$，其余的度为 $2$。则 $4 \\cdot 3 + 2k = 20$，所以有 $k = 4$ 个度为 $2$ 的顶点。",
      ),
      generate(rng) {
        let x: number;
        let y: number;
        let a: number;
        let k: number;
        do {
          x = rng.int(3, 6);
          y = rng.int(1, 4);
          a = rng.int(2, 8);
          k = rng.int(2, 10);
        } while (x === y || (a * x + k * y) % 2 !== 0);
        const m = (a * x + k * y) / 2;
        return numberProblem({
          prompt: t(
            `A graph has $${m}$ edges. Exactly $${a}$ of its vertices have degree $${x}$, and all the others have degree $${y}$. How many vertices have degree $${y}$?`,
            `一个图有 $${m}$ 条边。恰有 $${a}$ 个顶点的度为 $${x}$，其余顶点的度都为 $${y}$。度为 $${y}$ 的顶点有多少个？`,
          ),
          answer: k,
          wrong: [k + a, (m - a * x) / y, (2 * m) / y, k * 2].filter(Number.isInteger),
          solution: t(
            `$${a} \\cdot ${x} + ${y}k = 2 \\cdot ${m} = ${2 * m}$, so $${y}k = ${k * y}$ and $k = ${k}$.`,
            `$${a} \\cdot ${x} + ${y}k = 2 \\cdot ${m} = ${2 * m}$，所以 $${y}k = ${k * y}$，$k = ${k}$。`,
          ),
        });
      },
    },
  ],
};

/** subgraphsAndGraphComplements works with induced subgraphs and complements. */
export const subgraphsAndGraphComplements: TopicDef = {
  id: "subgraphs-and-graph-complements",
  title: t("Subgraphs and Graph Complements", "子图与补图"),
  summary: t(
    "The subgraph induced by S ⊆ V keeps the vertices of S and every edge between them. The complement of G has the same vertices and exactly the edges G lacks, so it has C(n, 2) − |E| edges and deg(v) becomes n − 1 − deg(v).",
    "由 S ⊆ V 导出的子图保留 S 中的顶点以及它们之间的所有边。G 的补图顶点相同，边恰为 G 中没有的边，所以它有 C(n, 2) − |E| 条边，且 deg(v) 变为 n − 1 − deg(v)。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-and-degrees-in-the-complement",
      title: t("The complement", "补图"),
      explanation: t(
        "If $G$ has $6$ vertices and $7$ edges, its complement $\\overline{G}$ has $\\binom{6}{2} - 7 = 8$ edges, and a vertex of degree $2$ in $G$ has degree $5 - 2 = 3$ in $\\overline{G}$.",
        "若 $G$ 有 $6$ 个顶点、$7$ 条边，则补图 $\\overline{G}$ 有 $\\binom{6}{2} - 7 = 8$ 条边，$G$ 中度为 $2$ 的顶点在 $\\overline{G}$ 中的度为 $5 - 2 = 3$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomGraph(rng, n, rng.int(n - 1, n + 4));
        const m = g.edges.length;
        const askDegree = rng.bool();
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const total = choose(n, 2);
        return withFigure(
          numberProblem({
            prompt: askDegree
              ? t(
                  `${graphIntro(g).en} Find the degree of $${vx(v)}$ in the complement $\\overline{G}$.`,
                  `${graphIntro(g)["zh-CN"]}求 $${vx(v)}$ 在补图 $\\overline{G}$ 中的度。`,
                )
              : t(
                  `${graphIntro(g).en} How many edges does the complement $\\overline{G}$ have?`,
                  `${graphIntro(g)["zh-CN"]}补图 $\\overline{G}$ 有多少条边？`,
                ),
            answer: askDegree ? n - 1 - d : total - m,
            wrong: askDegree ? [n - d, d, n - 2 - d] : [n * (n - 1) - m, total, total - m + 1],
            solution: askDegree
              ? t(
                  `$\\deg_G(${vx(v)}) = ${d}$, and $${vx(v)}$ has $${n - 1}$ possible neighbors, so its degree in $\\overline{G}$ is $${n - 1} - ${d} = ${n - 1 - d}$.`,
                  `$\\deg_G(${vx(v)}) = ${d}$，$${vx(v)}$ 有 $${n - 1}$ 个可能的邻点，所以它在 $\\overline{G}$ 中的度为 $${n - 1} - ${d} = ${n - 1 - d}$。`,
                )
              : t(
                  `$\\binom{${n}}{2} - ${m} = ${total} - ${m} = ${total - m}$.`,
                  `$\\binom{${n}}{2} - ${m} = ${total} - ${m} = ${total - m}$。`,
                ),
          }),
          g,
        );
      },
    },
    {
      id: "edges-of-induced-subgraphs",
      title: t("Induced subgraphs", "导出子图"),
      explanation: t(
        "If $E = \\{AB, AC, BD, CD, DE\\}$, the subgraph induced by $\\{A, B, D\\}$ keeps only $AB$ and $BD$: the edges with both ends in the set.",
        "若 $E = \\{AB, AC, BD, CD, DE\\}$，由 $\\{A, B, D\\}$ 导出的子图只保留 $AB$ 和 $BD$：两端都在该集合中的边。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomGraph(rng, n, rng.int(n + 1, n + 5));
        const S = rng.sample(range(0, n - 1), rng.int(3, 5)).sort((a, b) => a - b);
        const inS = new Set(S);
        const kept = g.edges.filter(([a, b]) => inS.has(a) && inS.has(b));
        const touching = g.edges.filter(([a, b]) => inS.has(a) || inS.has(b)).length;
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many edges does the subgraph induced by $\\{${S.map(vx).join(", ")}\\}$ have?`,
              `${graphIntro(g)["zh-CN"]}由 $\\{${S.map(vx).join(", ")}\\}$ 导出的子图有多少条边？`,
            ),
            answer: kept.length,
            wrong: [touching, kept.length + 1, choose(S.length, 2)],
            solution: t(
              kept.length === 0
                ? "No edge has both ends in the set, so there are $0$."
                : `The edges with both ends in the set are $${kept.map(edgeTex).join(", ")}$: $${kept.length}$ edges.`,
              kept.length === 0
                ? "没有两端都在该集合中的边，所以为 $0$。"
                : `两端都在该集合中的边为 $${kept.map(edgeTex).join(", ")}$：共 $${kept.length}$ 条。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** isBipartite reports whether a graph can be 2-colored. */
function isBipartite(g: Graph): boolean {
  const adj = neighbors(g);
  const color = range(0, g.n - 1).map(() => -1);
  for (let s = 0; s < g.n; s++) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const queue = [s];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const w of adj[u]!) {
        if (color[w] === -1) {
          color[w] = 1 - color[u]!;
          queue.push(w);
        } else if (color[w] === color[u]) return false;
      }
    }
  }
  return true;
}

/** completeAndBipartiteGraphs counts edges of Kₙ and Kₘ,ₙ and recognizes bipartite graphs. */
export const completeAndBipartiteGraphs: TopicDef = {
  id: "complete-and-bipartite-graphs",
  title: t("Complete and Bipartite Graphs", "完全图与二部图"),
  summary: t(
    "Kₙ joins every pair of n vertices and has C(n, 2) edges. A graph is bipartite if its vertices split into two parts with every edge between the parts; Kₘ,ₙ has all mn such edges. A graph is bipartite exactly when it has no odd cycle.",
    "Kₙ 连接 n 个顶点中的每一对，有 C(n, 2) 条边。若图的顶点能分成两部分且每条边都连接两部分，则它是二部图；Kₘ,ₙ 有全部 mn 条这样的边。图是二部图当且仅当它没有奇圈。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-of-complete-and-complete-bipartite-graphs",
      title: t("Counting edges", "数边"),
      explanation: t(
        "A complete graph joins every pair of vertices, while a complete bipartite graph joins every vertex on one side to every vertex on the other. $K_7$ has $\\binom{7}{2} = 21$ edges and $K_{3,5}$ has $3 \\cdot 5 = 15$ edges.",
        "完全图连接每一对顶点，而完全二部图把一侧的每个顶点连接到另一侧的每个顶点。$K_7$ 有 $\\binom{7}{2} = 21$ 条边，$K_{3,5}$ 有 $3 \\cdot 5 = 15$ 条边。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const n = rng.int(4, 30);
          return numberProblem({
            prompt: t(`How many edges does $K_{${n}}$ have?`, `$K_{${n}}$ 有多少条边？`),
            answer: choose(n, 2),
            wrong: [n * (n - 1), n - 1, choose(n + 1, 2)],
            solution: t(
              `Every pair of the $${n}$ vertices is joined by exactly one edge, so count the pairs: $\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${choose(n, 2)}$.`,
              `$${n}$ 个顶点中每两个之间恰有一条边，所以数顶点对：$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${choose(n, 2)}$。`,
            ),
          });
        }
        const m = rng.int(2, 9);
        const n = rng.int(m, 12);
        return numberProblem({
          prompt: t(`How many edges does $K_{${m},${n}}$ have?`, `$K_{${m},${n}}$ 有多少条边？`),
          answer: m * n,
          wrong: [m + n, choose(m + n, 2), choose(m, 2) + choose(n, 2)],
          solution: t(
            `Each of the $${m}$ vertices on one side is joined to all $${n}$ on the other: $${m * n}$.`,
            `一侧的 $${m}$ 个顶点各与另一侧的 $${n}$ 个顶点相连：$${m * n}$。`,
          ),
        });
      },
    },
    {
      id: "recognizing-bipartite-graphs",
      title: t("Recognizing bipartite graphs", "判断二部图"),
      explanation: t(
        "Color a vertex red, its neighbors blue, their neighbors red, and so on. If two adjacent vertices get the same color, the graph has an odd cycle and is not bipartite; otherwise the colors give the two parts.",
        "把一个顶点涂红，它的邻点涂蓝，邻点的邻点涂红，依此类推。若两个相邻顶点同色，图中有奇圈，不是二部图；否则两种颜色给出两个部分。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        let g: Graph;
        if (rng.bool()) {
          const side = rng.shuffle(range(0, n - 1)).map((_, i) => i % 2);
          const cross = allPairs(n).filter(([a, b]) => side[a] !== side[b]);
          g = { n, edges: sortEdges(rng.sample(cross, Math.min(cross.length, rng.int(n - 1, n + 2)))) };
        } else {
          g = randomConnected(rng, n, rng.int(1, 3));
        }
        const yes = isBipartite(g);
        return withFigure(
          verdictChoice(rng, {
            prompt: t(`${graphIntro(g).en} Is $G$ bipartite?`, `${graphIntro(g)["zh-CN"]}$G$ 是二部图吗？`),
            holds: yes,
            yes: t("two colors can alternate along every edge", "沿每条边都能交替涂两种颜色"),
            no: t("it contains a cycle of odd length", "它含有长度为奇数的圈"),
            yesWrong: t("every vertex has at least one neighbor", "每个顶点都至少有一个邻点"),
            noWrong: t("it contains a cycle", "它含有圈"),
            solution: yes
              ? t(
                  "Alternating two colors along edges never puts the same color on both ends of an edge, so $G$ is bipartite.",
                  "沿边交替涂两种颜色，任何边的两端都不同色，所以 $G$ 是二部图。",
                )
              : t(
                  "Alternating two colors along edges forces some edge to have both ends the same color: $G$ contains an odd cycle, so it is not bipartite.",
                  "沿边交替涂两种颜色时，某条边的两端被迫同色：$G$ 含有奇圈，所以不是二部图。",
                ),
          }),
          g,
        );
      },
    },
  ],
};

/** regularGraphs works with graphs whose vertices all have the same degree. */
export const regularGraphs: TopicDef = {
  id: "regular-graphs",
  title: t("Regular Graphs", "正则图"),
  summary: t(
    "A graph is r-regular if every vertex has degree r. By the handshaking lemma an r-regular graph on n vertices has nr/2 edges, so nr must be even; a simple one also needs r ≤ n − 1.",
    "若每个顶点的度都是 r，则图是 r-正则的。由握手引理，n 个顶点的 r-正则图有 nr/2 条边，所以 nr 必须为偶数；简单图还需 r ≤ n − 1。",
  ),
  prerequisites: ["the-handshaking-lemma"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-of-regular-graphs",
      title: t("Edges of regular graphs", "正则图的边数"),
      explanation: t(
        "In an $r$-regular graph every vertex has degree $r$, so $n$ vertices have $nr$ edge ends and, since each edge has two ends, $\\frac{nr}{2}$ edges. The graph shown is $3$-regular on $6$ vertices, with $\\frac{6 \\cdot 3}{2} = 9$ edges. A $4$-regular graph on $9$ vertices has $\\frac{9 \\cdot 4}{2} = 18$ edges. Conversely a regular graph on $8$ vertices with $12$ edges is $\\frac{2 \\cdot 12}{8} = 3$-regular.",
        "在 $r$-正则图中每个顶点的度都是 $r$，所以 $n$ 个顶点共有 $nr$ 个边端点；每条边有两个端点，所以共有 $\\frac{nr}{2}$ 条边。图中是 $6$ 个顶点的 $3$-正则图，有 $\\frac{6 \\cdot 3}{2} = 9$ 条边。$9$ 个顶点的 $4$-正则图有 $\\frac{9 \\cdot 4}{2} = 18$ 条边。反过来，$8$ 个顶点、$12$ 条边的正则图是 $\\frac{2 \\cdot 12}{8} = 3$-正则的。",
      ),
      figure: graphFigure({
        n: 6,
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [0, 5],
          [0, 3],
          [1, 4],
          [2, 5],
        ],
      }),
      generate(rng) {
        let n: number;
        let r: number;
        do {
          n = rng.int(4, 20);
          r = rng.int(2, Math.min(8, n - 1));
        } while ((n * r) % 2 !== 0);
        const m = (n * r) / 2;
        if (rng.bool())
          return numberProblem({
            prompt: t(
              `How many edges does ${article(r)} $${r}$-regular graph on $${n}$ vertices have?`,
              `$${n}$ 个顶点的 $${r}$-正则图有多少条边？`,
            ),
            answer: m,
            wrong: [n * r, n + r, m + n],
            solution: t(`$\\frac{${n} \\cdot ${r}}{2} = ${m}$.`, `$\\frac{${n} \\cdot ${r}}{2} = ${m}$。`),
          });
        return numberProblem({
          prompt: t(
            `A regular graph has $${n}$ vertices and $${m}$ edges. What is the degree of each vertex?`,
            `一个正则图有 $${n}$ 个顶点、$${m}$ 条边。每个顶点的度是多少？`,
          ),
          answer: r,
          wrong: [r / 2, 2 * r, n - 1].filter(Number.isInteger),
          solution: t(`$${n}r = 2 \\cdot ${m}$, so $r = ${r}$.`, `$${n}r = 2 \\cdot ${m}$，所以 $r = ${r}$。`),
        });
      },
    },
    {
      id: "existence-of-regular-graphs",
      title: t("Which regular graphs exist", "哪些正则图存在"),
      explanation: t(
        "There is no $3$-regular graph on $7$ vertices, because $7 \\cdot 3 = 21$ is odd. There is a $3$-regular simple graph on $8$ vertices, but no $8$-regular simple graph on $8$ vertices, since a vertex has only $7$ possible neighbors.",
        "不存在 $7$ 个顶点的 $3$-正则图，因为 $7 \\cdot 3 = 21$ 是奇数。存在 $8$ 个顶点的 $3$-正则简单图，但不存在 $8$ 个顶点的 $8$-正则简单图，因为一个顶点只有 $7$ 个可能的邻点。",
      ),
      generate(rng) {
        const n = rng.int(4, 15);
        const r = rng.int(2, n + 1);
        const odd = (n * r) % 2 === 1;
        const tooBig = r > n - 1;
        const yes = !odd && !tooBig;
        return choiceProblem({
          prompt: t(`Is there a simple $${r}$-regular graph on $${n}$ vertices?`, `是否存在 $${n}$ 个顶点的 $${r}$-正则简单图？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: tooBig
            ? t(
                `No: a vertex has only $${n - 1}$ possible neighbors, fewer than $${r}$.`,
                `不存在：一个顶点只有 $${n - 1}$ 个可能的邻点，少于 $${r}$。`,
              )
            : odd
              ? t(
                  `No: the degrees would sum to $${n} \\cdot ${r} = ${n * r}$, which is odd.`,
                  `不存在：度数和将为 $${n} \\cdot ${r} = ${n * r}$，是奇数。`,
                )
              : t(
                  `Yes: $${n} \\cdot ${r}$ is even and $${r} \\le ${n - 1}$. For example, arrange the vertices in a circle and join each to the nearest ones on both sides${r % 2 === 1 ? ", and to the opposite one" : ""}.`,
                  `存在：$${n} \\cdot ${r}$ 是偶数且 $${r} \\le ${n - 1}$。例如把顶点排成一圈，把每个顶点与两侧最近的若干顶点相连${r % 2 === 1 ? "，再与正对面的顶点相连" : ""}。`,
                ),
        });
      },
    },
  ],
};

/** planarGraphs uses Euler's formula and its edge bounds. */
export const planarGraphs: TopicDef = {
  id: "planar-graphs",
  title: t("Planar Graphs", "平面图"),
  summary: t(
    "A planar graph can be drawn without crossing edges. For a connected planar drawing, Euler's formula v − e + f = 2 holds. A simple planar graph with v ≥ 3 has e ≤ 3v − 6, and e ≤ 2v − 4 if it has no triangles.",
    "平面图可以画成边互不交叉的样子。对连通的平面画法，欧拉公式 v − e + f = 2 成立。v ≥ 3 的简单平面图满足 e ≤ 3v − 6；若没有三角形，则 e ≤ 2v − 4。",
  ),
  prerequisites: ["the-handshaking-lemma"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "eulers-formula-for-planar-graphs",
      title: t("Euler's formula", "欧拉公式"),
      explanation: t(
        "A connected graph drawn in the plane without crossings satisfies Euler's formula $v - e + f = 2$, where $f$ counts the faces, including the unbounded outer face. The graph shown has $6$ vertices and $9$ edges, and its $4$ triangles and the outer face make $f = 2 - 6 + 9 = 5$ faces. A connected planar graph with $8$ vertices and $12$ edges divides the plane into $f = 2 - 8 + 12 = 6$ faces.",
        "在平面上画成没有交叉的连通图满足欧拉公式 $v - e + f = 2$，其中 $f$ 是面的个数，包括无界的外部面。图中的图有 $6$ 个顶点、$9$ 条边，它的 $4$ 个三角形加上外部面共 $f = 2 - 6 + 9 = 5$ 个面。有 $8$ 个顶点、$12$ 条边的连通平面图把平面分成 $f = 2 - 8 + 12 = 6$ 个面。",
      ),
      figure: graphFigure({
        n: 6,
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [0, 5],
          [0, 2],
          [0, 3],
          [0, 4],
        ],
      }),
      generate(rng) {
        const v = rng.int(4, 20);
        const e = rng.int(v - 1, 3 * v - 6);
        const f = 2 - v + e;
        const ask = rng.int(0, 2);
        const what = [
          [t("faces", "面"), f, `f = 2 - ${v} + ${e}`],
          [t("edges", "边"), e, `e = ${v} + ${f} - 2`],
          [t("vertices", "顶点"), v, `v = 2 + ${e} - ${f}`],
        ] as const;
        const [name, value, work] = what[ask]!;
        const given =
          ask === 0
            ? t(`$${v}$ vertices and $${e}$ edges`, `$${v}$ 个顶点、$${e}$ 条边`)
            : ask === 1
              ? t(`$${v}$ vertices and $${f}$ faces, including the outer face`, `$${v}$ 个顶点、$${f}$ 个面（含外部面）`)
              : t(`$${e}$ edges and $${f}$ faces, including the outer face`, `$${e}$ 条边、$${f}$ 个面（含外部面）`);
        return numberProblem({
          prompt: t(
            `A connected planar graph is drawn without crossings. It has ${given.en}. How many ${name.en} does the drawing have${ask === 0 ? ", counting the outer face" : ""}?`,
            `一个连通平面图画成无交叉的样子，它有${given["zh-CN"]}。这个画法有多少${ask === 1 ? "条" : "个"}${name["zh-CN"]}${ask === 0 ? "（含外部面）" : ""}？`,
          ),
          answer: value,
          wrong: [value + 2, value - 2, value + 1, value - 1],
          solution: t(`From $v - e + f = 2$: $${work} = ${value}$.`, `由 $v - e + f = 2$：$${work} = ${value}$。`),
        });
      },
    },
    {
      id: "edge-bounds-for-planar-graphs",
      title: t("Edge bounds", "边数上界"),
      explanation: t(
        "A simple planar graph on $10$ vertices has at most $3 \\cdot 10 - 6 = 24$ edges, or $2 \\cdot 10 - 4 = 16$ if it has no triangles. So $K_5$, with $10 > 3 \\cdot 5 - 6$ edges, is not planar.",
        "$10$ 个顶点的简单平面图至多有 $3 \\cdot 10 - 6 = 24$ 条边；若无三角形，则至多 $2 \\cdot 10 - 4 = 16$ 条。所以 $K_5$ 有 $10 > 3 \\cdot 5 - 6$ 条边，不是平面图。",
      ),
      generate(rng) {
        const v = rng.int(3, 40);
        const noTriangles = rng.bool();
        const value = noTriangles ? 2 * v - 4 : 3 * v - 6;
        return numberProblem({
          prompt: noTriangles
            ? t(
                `A simple planar graph on $${v}$ vertices has no triangles. At most how many edges can it have?`,
                `一个 $${v}$ 个顶点的简单平面图没有三角形。它至多有多少条边？`,
              )
            : t(`At most how many edges can a simple planar graph on $${v}$ vertices have?`, `$${v}$ 个顶点的简单平面图至多有多少条边？`),
          answer: value,
          wrong: noTriangles ? [3 * v - 6, 2 * v - 2, choose(v, 2)] : [2 * v - 4, 3 * v - 3, choose(v, 2)],
          solution: noTriangles
            ? t(
                `Each face has at least $4$ edges, giving $e \\le 2v - 4 = ${value}$.`,
                `每个面至少有 $4$ 条边，得 $e \\le 2v - 4 = ${value}$。`,
              )
            : t(
                `Each face has at least $3$ edges, giving $e \\le 3v - 6 = ${value}$.`,
                `每个面至少有 $3$ 条边，得 $e \\le 3v - 6 = ${value}$。`,
              ),
        });
      },
    },
  ],
};

/** girth finds the length of a shortest cycle, or Infinity. */
function girth(g: Graph): number {
  const adj = neighbors(g);
  let best = Number.POSITIVE_INFINITY;
  for (let s = 0; s < g.n; s++) {
    const dist = range(0, g.n - 1).map(() => -1);
    const parent = range(0, g.n - 1).map(() => -1);
    dist[s] = 0;
    const queue = [s];
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const w of adj[u]!) {
        if (dist[w] === -1) {
          dist[w] = dist[u]! + 1;
          parent[w] = u;
          queue.push(w);
        } else if (parent[u] !== w) best = Math.min(best, dist[u]! + dist[w]! + 1);
      }
    }
  }
  return best;
}

/** cyclesInGraphs finds shortest cycles and counts cycles in complete graphs. */
export const cyclesInGraphs: TopicDef = {
  id: "cycles-in-graphs",
  title: t("Cycles in Graphs", "图中的圈"),
  summary: t(
    "A cycle is a closed trail of length at least 3 whose only repeated vertex is its start. The girth is the length of a shortest cycle. Kₙ has n!/((n − k)!·2k) cycles of length k, since each cycle can be started at k vertices and traversed in 2 directions.",
    "圈是长度至少为 3、只有起点重复的闭迹。围长是最短圈的长度。Kₙ 中长度为 k 的圈有 n!/((n − k)!·2k) 个，因为每个圈可以从 k 个顶点出发、沿 2 个方向走。",
  ),
  prerequisites: ["walks-trails-paths-and-distances"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "shortest-cycles",
      title: t("Shortest cycles", "最短圈"),
      explanation: t(
        "If $E = \\{AB, BC, CD, DA, AE, EC\\}$, the shortest cycles have length $4$: $A, B, C, D, A$ and $A, B, C, E, A$ among others. There is no triangle, since no two neighbors of a vertex are adjacent.",
        "若 $E = \\{AB, BC, CD, DA, AE, EC\\}$，最短圈的长度为 $4$，例如 $A, B, C, D, A$ 和 $A, B, C, E, A$。没有三角形，因为任一顶点的两个邻点都不相邻。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomConnected(rng, n, rng.int(1, 2));
        const gi = girth(g);
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} What is the length of a shortest cycle in $G$?`,
              `${graphIntro(g)["zh-CN"]}$G$ 中最短圈的长度是多少？`,
            ),
            answer: gi,
            wrong: [gi + 1, gi - 1, 3, n],
            solution: t(
              `The cycle $${cycleTex(g, gi)}$ has length $${gi}$, and $G$ has no shorter cycle.`,
              `圈 $${cycleTex(g, gi)}$ 的长度为 $${gi}$，$G$ 中没有更短的圈。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "counting-cycles-in-complete-graphs",
      title: t("Cycles in complete graphs", "完全图中的圈"),
      explanation: t(
        "In $K_5$, an ordered choice of $4$ vertices gives $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$ sequences, and each $4$-cycle arises from $4$ starting points and $2$ directions: $\\frac{120}{8} = 15$ cycles.",
        "在 $K_5$ 中，有序选取 $4$ 个顶点有 $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$ 个序列，每个 $4$-圈对应 $4$ 个起点和 $2$ 个方向：$\\frac{120}{8} = 15$ 个圈。",
      ),
      generate(rng) {
        const n = rng.int(4, 10);
        const k = rng.int(3, n);
        const seqs = factorial(n) / factorial(n - k);
        const value = seqs / (2 * k);
        return numberProblem({
          prompt: t(`How many cycles of length $${k}$ does $K_{${n}}$ have?`, `$K_{${n}}$ 中长度为 $${k}$ 的圈有多少个？`),
          answer: value,
          wrong: [seqs / k, seqs, choose(n, k), seqs / 2],
          solution: t(
            `$\\frac{${n}!}{${n - k}!} = ${seqs}$ ordered sequences, each cycle counted $2 \\cdot ${k}$ times: $\\frac{${seqs}}{${2 * k}} = ${value}$.`,
            `有 $\\frac{${n}!}{${n - k}!} = ${seqs}$ 个有序序列，每个圈被计算 $2 \\cdot ${k}$ 次：$\\frac{${seqs}}{${2 * k}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** randomComponents builds a graph made of k random connected pieces. */
function randomComponents(rng: Rng, n: number, k: number): Graph {
  const labels = rng.shuffle(range(0, n - 1));
  const cuts = rng.sample(range(1, n - 1), k - 1).sort((a, b) => a - b);
  const bounds = [0, ...cuts, n];
  const edges: Edge[] = [];
  for (let i = 0; i < k; i++) {
    const part = labels.slice(bounds[i]!, bounds[i + 1]!);
    const piece = randomConnected(rng, part.length, rng.int(0, 1));
    for (const [a, b] of piece.edges) edges.push([part[a]!, part[b]!]);
  }
  return { n, edges: sortEdges(edges) };
}

/** connectedGraphs counts components and uses edge bounds for connectivity. */
export const connectedGraphs: TopicDef = {
  id: "connected-graphs",
  title: t("Connected Graphs", "连通图"),
  summary: t(
    "A graph is connected if every two vertices are joined by a path; otherwise it splits into connected components. A connected graph on n vertices has at least n − 1 edges, and a disconnected simple graph has at most C(n − 1, 2).",
    "若任意两个顶点之间都有路径，则图是连通的；否则它分成若干连通分支。n 个顶点的连通图至少有 n − 1 条边，不连通的简单图至多有 C(n − 1, 2) 条边。",
  ),
  prerequisites: ["walks-trails-paths-and-distances"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-connected-components",
      title: t("Connected components", "连通分支"),
      explanation: t(
        "If $V = \\{A, B, C, D, E, F\\}$ and $E = \\{AB, BC, DE\\}$, the components are $\\{A, B, C\\}$, $\\{D, E\\}$ and $\\{F\\}$: three components. An isolated vertex is a component on its own.",
        "若 $V = \\{A, B, C, D, E, F\\}$，$E = \\{AB, BC, DE\\}$，则连通分支为 $\\{A, B, C\\}$、$\\{D, E\\}$ 和 $\\{F\\}$：共三个。孤立顶点自成一个分支。",
      ),
      generate(rng) {
        const n = rng.int(6, 9);
        const k = rng.int(1, 4);
        const g = randomComponents(rng, n, k);
        const c = componentCount(g);
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many connected components does $G$ have?`,
              `${graphIntro(g)["zh-CN"]}$G$ 有多少个连通分支？`,
            ),
            answer: c,
            wrong: [c + 1, c - 1, n - g.edges.length],
            solution: t(
              `Following edges from each unvisited vertex finds the separate pieces $${piecesTex(g)}$, which makes $${c}$.`,
              `从每个尚未访问的顶点出发沿边搜索，得到互不相连的部分 $${piecesTex(g)}$，共 $${c}$ 个。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "edge-bounds-for-connectivity",
      title: t("Edge bounds", "边数界"),
      explanation: t(
        "A connected graph on $10$ vertices needs at least $9$ edges. A simple graph on $10$ vertices with more than $\\binom{9}{2} = 36$ edges must be connected: the most edges a disconnected one can have is when one vertex is isolated and the other $9$ form $K_9$.",
        "$10$ 个顶点的连通图至少需要 $9$ 条边。$10$ 个顶点、多于 $\\binom{9}{2} = 36$ 条边的简单图一定连通：不连通的图边数最多的情形是一个顶点孤立，其余 $9$ 个构成 $K_9$。",
      ),
      generate(rng) {
        const n = rng.int(4, 30);
        if (rng.bool())
          return numberProblem({
            prompt: t(
              `What is the largest number of edges a disconnected simple graph on $${n}$ vertices can have?`,
              `$${n}$ 个顶点的不连通简单图最多能有多少条边？`,
            ),
            answer: choose(n - 1, 2),
            wrong: [choose(n, 2) - 1, choose(n, 2), n - 2, choose(n - 1, 2) + 1],
            solution: t(
              `Isolate one vertex and make the other $${n - 1}$ complete: $\\binom{${n - 1}}{2} = ${choose(n - 1, 2)}$.`,
              `让一个顶点孤立，其余 $${n - 1}$ 个构成完全图：$\\binom{${n - 1}}{2} = ${choose(n - 1, 2)}$。`,
            ),
          });
        return numberProblem({
          prompt: t(
            `What is the smallest number of edges a connected graph on $${n}$ vertices can have?`,
            `$${n}$ 个顶点的连通图最少有多少条边？`,
          ),
          answer: n - 1,
          wrong: [n, n - 2, choose(n, 2)],
          solution: t(
            `Adding an edge reduces the number of components by at most $1$, so going from $${n}$ components to $1$ takes $${n - 1}$ edges.`,
            `每加一条边，连通分支数至多减少 $1$，所以从 $${n}$ 个分支变为 $1$ 个需要 $${n - 1}$ 条边。`,
          ),
        });
      },
    },
  ],
};

/** cutVerticesAndCutEdges finds vertices and edges whose removal disconnects a graph. */
export const cutVerticesAndCutEdges: TopicDef = {
  id: "cut-vertices-and-cut-edges",
  title: t("Cut Vertices and Cut Edges", "割点与割边"),
  summary: t(
    "A cut vertex (cut edge) is one whose removal increases the number of connected components. An edge is a cut edge exactly when it lies on no cycle.",
    "割点（割边）是删去后会使连通分支数增加的顶点（边）。一条边是割边当且仅当它不在任何圈上。",
  ),
  prerequisites: ["connected-graphs", "cycles-in-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cut-vertices",
      title: t("Cut vertices", "割点"),
      explanation: t(
        "In the path $A, B, C$ with a triangle $CDE$ attached at $C$, removing $B$ or $C$ disconnects the graph, so there are $2$ cut vertices; removing $A$, $D$ or $E$ does not.",
        "在路径 $A, B, C$ 上于 $C$ 处接一个三角形 $CDE$，删去 $B$ 或 $C$ 会使图不连通，所以有 $2$ 个割点；删去 $A$、$D$ 或 $E$ 则不会。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const cuts = range(0, n - 1).filter((v) => componentCount(g, [v]) > 1);
        const leaves = degrees(g).filter((d) => d === 1).length;
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} How many cut vertices does $G$ have?`, `${graphIntro(g)["zh-CN"]}$G$ 有多少个割点？`),
            answer: cuts.length,
            wrong: [cuts.length + 1, n - leaves, Math.max(0, cuts.length - 1)],
            solution: t(
              cuts.length === 0
                ? "Removing any single vertex leaves the rest connected, so there are none."
                : `Removing ${cuts.map((v) => `$${vx(v)}$`).join(", ")} disconnects $G$, and no other vertex does: $${cuts.length}$ cut ${cuts.length === 1 ? "vertex" : "vertices"}.`,
              cuts.length === 0
                ? "删去任何一个顶点后其余部分仍连通，所以没有割点。"
                : `删去 ${cuts.map((v) => `$${vx(v)}$`).join("、")} 会使 $G$ 不连通，删去其他顶点则不会：共 $${cuts.length}$ 个割点。`,
            ),
          }),
          g,
        );
      },
    },
    {
      id: "counting-cut-edges",
      title: t("Cut edges", "割边"),
      explanation: t(
        "In a triangle $ABC$ with a pendant edge $CD$, the edge $CD$ is a cut edge; $AB$, $BC$ and $CA$ lie on the triangle, so removing one of them leaves the graph connected.",
        "在三角形 $ABC$ 加悬挂边 $CD$ 的图中，$CD$ 是割边；$AB$、$BC$、$CA$ 在三角形上，删去其中一条后图仍连通。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const bridges = g.edges.filter((e) => componentCount({ n, edges: g.edges.filter((f) => f !== e) }) > 1);
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} How many cut edges does $G$ have?`, `${graphIntro(g)["zh-CN"]}$G$ 有多少条割边？`),
            answer: bridges.length,
            wrong: [bridges.length + 1, g.edges.length - bridges.length, n - 1],
            solution: t(
              bridges.length === 0
                ? "Every edge lies on a cycle, so there are none."
                : `The edges on no cycle are $${bridges.map(edgeTex).join(", ")}$: $${bridges.length}$ cut ${bridges.length === 1 ? "edge" : "edges"}.`,
              bridges.length === 0
                ? "每条边都在某个圈上，所以没有割边。"
                : `不在任何圈上的边为 $${bridges.map(edgeTex).join(", ")}$：共 $${bridges.length}$ 条割边。`,
            ),
          }),
          g,
        );
      },
    },
  ],
};

/** treesAndForests uses edge counts and degree counts of trees. */
export const treesAndForests: TopicDef = {
  id: "trees-and-forests",
  title: t("Trees and Forests", "树与森林"),
  summary: t(
    "A tree is a connected graph with no cycles; a forest is a graph with no cycles, so each component is a tree. A tree on n vertices has n − 1 edges, and a forest on n vertices with k components has n − k edges.",
    "树是没有圈的连通图；森林是没有圈的图，其每个分支都是树。n 个顶点的树有 n − 1 条边，n 个顶点、k 个分支的森林有 n − k 条边。",
  ),
  prerequisites: ["connected-graphs", "cycles-in-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-of-trees-and-forests",
      title: t("Edges of forests", "森林的边数"),
      explanation: t(
        "A forest with $20$ vertices and $4$ components has $20 - 4 = 16$ edges: each component is a tree with one fewer edge than vertices.",
        "有 $20$ 个顶点、$4$ 个分支的森林有 $20 - 4 = 16$ 条边：每个分支都是边数比顶点数少一的树。",
      ),
      generate(rng) {
        const n = rng.int(5, 40);
        const k = rng.int(1, Math.min(8, n - 1));
        const askEdges = rng.bool();
        return numberProblem({
          prompt: askEdges
            ? t(
                `A forest has $${n}$ vertices and $${k}$ connected component${k === 1 ? "" : "s"}. How many edges does it have?`,
                `一个森林有 $${n}$ 个顶点、$${k}$ 个连通分支。它有多少条边？`,
              )
            : t(
                `A forest has $${n}$ vertices and $${n - k}$ edges. How many connected components does it have?`,
                `一个森林有 $${n}$ 个顶点、$${n - k}$ 条边。它有多少个连通分支？`,
              ),
          answer: askEdges ? n - k : k,
          wrong: askEdges ? [n - 1, n - k - 1, n - k + 1] : [k + 1, k - 1, 1],
          solution: t(
            `A forest with $n$ vertices and $k$ components has $n - k$ edges: $${n} - ${k} = ${n - k}$.`,
            `$n$ 个顶点、$k$ 个分支的森林有 $n - k$ 条边：$${n} - ${k} = ${n - k}$。`,
          ),
        });
      },
    },
    {
      id: "counting-leaves-of-a-tree",
      title: t("Counting leaves", "数叶子"),
      explanation: t(
        "A tree has $3$ vertices of degree $3$, $2$ of degree $2$, and the rest are leaves. With $\\ell$ leaves there are $5 + \\ell$ vertices and $4 + \\ell$ edges, so $9 + 4 + \\ell = 2(4 + \\ell)$ and $\\ell = 5$.",
        "一棵树有 $3$ 个度为 $3$ 的顶点、$2$ 个度为 $2$ 的顶点，其余都是叶子。设有 $\\ell$ 片叶子，则有 $5 + \\ell$ 个顶点、$4 + \\ell$ 条边，所以 $9 + 4 + \\ell = 2(4 + \\ell)$，$\\ell = 5$。",
      ),
      generate(rng) {
        const a = rng.int(0, 5);
        const b = rng.int(1, 5);
        const c = rng.int(0, 3);
        const leaves = 2 + b + 2 * c;
        const parts = [
          [a, 2],
          [b, 3],
          [c, 4],
        ].filter(([k]) => k! > 0);
        const en = parts.map(([k, d]) => `$${k}$ ${k === 1 ? "vertex" : "vertices"} of degree $${d}$`).join(", ");
        const zh = parts.map(([k, d]) => `$${k}$ 个度为 $${d}$ 的顶点`).join("、");
        return numberProblem({
          prompt: t(
            `A tree has ${en}, and every other vertex is a leaf. How many leaves does it have?`,
            `一棵树有${zh}，其余顶点都是叶子。它有多少片叶子？`,
          ),
          answer: leaves,
          wrong: [b + 2 * c, 2 + a + b + c, leaves + a, 2 + b + c],
          solution: t(
            `With $\\ell$ leaves, the degree sum $${parts.map(([k, d]) => `${k} \\cdot ${d}`).join(" + ")} + \\ell$ equals $2(|V| - 1)$. Solving gives $\\ell = 2 + \\sum (d - 2) = ${leaves}$.`,
            `设有 $\\ell$ 片叶子，度数和 $${parts.map(([k, d]) => `${k} \\cdot ${d}`).join(" + ")} + \\ell$ 等于 $2(|V| - 1)$。解得 $\\ell = 2 + \\sum (d - 2) = ${leaves}$。`,
          ),
        });
      },
    },
  ],
};

/** countingTrees counts labeled trees with Cayley's formula and Prüfer sequences. */
export const countingTrees: TopicDef = {
  id: "counting-trees",
  title: t("Counting Trees", "树的计数"),
  summary: t(
    "Labeled trees on n vertices correspond one-to-one with Prüfer sequences of length n − 2, so there are nⁿ⁻² of them (Cayley's formula). A vertex of degree d appears d − 1 times in the sequence, so the trees with degrees d₁, …, dₙ number (n − 2)!/((d₁ − 1)!⋯(dₙ − 1)!).",
    "n 个顶点的标号树与长度为 n − 2 的 Prüfer 序列一一对应，所以共有 nⁿ⁻² 棵（Cayley 公式）。度为 d 的顶点在序列中出现 d − 1 次，所以度数为 d₁, …, dₙ 的树有 (n − 2)!/((d₁ − 1)!⋯(dₙ − 1)!) 棵。",
  ),
  prerequisites: ["trees-and-forests", "permutations-with-repetition"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cayleys-formula",
      title: t("Cayley's formula", "Cayley 公式"),
      explanation: t(
        "There are $5^3 = 125$ labeled trees on $5$ vertices. Those in which vertex $1$ is a leaf have Prüfer sequences avoiding $1$: $4^3 = 64$ of them.",
        "$5$ 个顶点的标号树有 $5^3 = 125$ 棵。其中顶点 $1$ 为叶子的树，其 Prüfer 序列不含 $1$：共 $4^3 = 64$ 棵。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        const d = rng.int(0, Math.min(4, n - 1));
        if (d === 0)
          return numberProblem({
            prompt: t(
              `How many labeled trees have vertex set $\\{1, 2, \\dots, ${n}\\}$?`,
              `顶点集为 $\\{1, 2, \\dots, ${n}\\}$ 的标号树有多少棵？`,
            ),
            answer: n ** (n - 2),
            wrong: [n ** (n - 1), (n - 1) ** (n - 2), factorial(n) / 2],
            solution: t(`Cayley's formula: $${n}^{${n - 2}} = ${n ** (n - 2)}$.`, `由 Cayley 公式：$${n}^{${n - 2}} = ${n ** (n - 2)}$。`),
          });
        const value = choose(n - 2, d - 1) * (n - 1) ** (n - 1 - d);
        return numberProblem({
          prompt: t(
            `How many labeled trees with vertex set $\\{1, 2, \\dots, ${n}\\}$ have $\\deg(1) = ${d}$?`,
            `顶点集为 $\\{1, 2, \\dots, ${n}\\}$ 的标号树中，有多少棵满足 $\\deg(1) = ${d}$？`,
          ),
          answer: value,
          wrong: [(n - 1) ** (n - 2), choose(n - 2, d) * (n - 1) ** (n - 2 - d), choose(n - 2, d - 1) * n ** (n - 1 - d)],
          solution: t(
            `Vertex $1$ appears $${d - 1}$ times in the Prüfer sequence of length $${n - 2}$: choose the positions in $\\binom{${n - 2}}{${d - 1}}$ ways and fill the other $${n - 1 - d}$ with any of the $${n - 1}$ other labels: $${value}$.`,
            `顶点 $1$ 在长度为 $${n - 2}$ 的 Prüfer 序列中出现 $${d - 1}$ 次：选位置有 $\\binom{${n - 2}}{${d - 1}}$ 种方法，其余 $${n - 1 - d}$ 个位置填其他 $${n - 1}$ 个标号之一：$${value}$。`,
          ),
        });
      },
    },
    {
      id: "trees-with-a-given-degree-sequence",
      title: t("Trees with given degrees", "给定度数的树"),
      explanation: t(
        "In the Prüfer sequence of a tree, each vertex appears one time fewer than its degree, so counting trees with given degrees means counting arrangements of that sequence. Trees on $\\{1, \\dots, 6\\}$ with degrees $3, 2, 2, 1, 1, 1$ have Prüfer sequences with $1$ twice, $2$ once and $3$ once: $\\frac{4!}{2!\\,1!\\,1!} = 12$ trees.",
        "在树的普吕弗序列中，每个顶点出现的次数比它的度数少一，所以数给定度数的树就是数这个序列的排列方式。顶点集为 $\\{1, \\dots, 6\\}$、度数依次为 $3, 2, 2, 1, 1, 1$ 的树，其 Prüfer 序列中 $1$ 出现两次，$2$、$3$ 各一次：共 $\\frac{4!}{2!\\,1!\\,1!} = 12$ 棵。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const seq = range(1, n - 2).map(() => rng.int(1, Math.min(n, 4)));
        const deg = range(1, n).map((v) => 1 + seq.filter((x) => x === v).length);
        const value = factorial(n - 2) / deg.reduce((p, d) => p * factorial(d - 1), 1);
        const big = deg.map((d, i) => [i + 1, d] as const).filter(([, d]) => d > 1);
        return numberProblem({
          prompt: t(
            `How many labeled trees on $\\{1, 2, \\dots, ${n}\\}$ have ${big.map(([v, d]) => `$\\deg(${v}) = ${d}$`).join(", ")}, and every other vertex a leaf?`,
            `顶点集为 $\\{1, 2, \\dots, ${n}\\}$ 的标号树中，有多少棵满足 ${big.map(([v, d]) => `$\\deg(${v}) = ${d}$`).join("、")}，且其余顶点都是叶子？`,
          ),
          answer: value,
          wrong: [factorial(n - 2), factorial(n - 2) / big.reduce((p, [, d]) => p * factorial(d), 1), n ** (n - 2)].filter(
            Number.isInteger,
          ),
          solution: t(
            `Each vertex of degree $d$ appears $d - 1$ times in the Prüfer sequence of length $${n - 2}$, so the count is $\\frac{${n - 2}!}{${big.map(([, d]) => `${d - 1}!`).join("\\,")}} = ${value}$.`,
            `度为 $d$ 的顶点在长度为 $${n - 2}$ 的 Prüfer 序列中出现 $d - 1$ 次，所以个数为 $\\frac{${n - 2}!}{${big.map(([, d]) => `${d - 1}!`).join("\\,")}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsGraphTopics are the topics of Discrete Mathematics unit 7 on graphs, connectivity and trees. */
export const discreteMathematicsGraphTopics: readonly TopicDef[] = [
  introductionToGraphs,
  walksTrailsPathsAndDistances,
  walksPathsAndDistancesInDirectedGraphs,
  theDegreeOfAVertex,
  theHandshakingLemma,
  subgraphsAndGraphComplements,
  completeAndBipartiteGraphs,
  regularGraphs,
  planarGraphs,
  cyclesInGraphs,
  connectedGraphs,
  cutVerticesAndCutEdges,
  treesAndForests,
  countingTrees,
];
