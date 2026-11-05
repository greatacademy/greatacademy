import type { Figure, Rng, Text } from "@ga/content";
import { t } from "@ga/content";

import { range } from "./methods-of-proof-common.ts";

// Shared helpers for the graph theory topics of Discrete Mathematics. Vertices are numbered from 0 and named A, B, C, ….

/** vx names vertex i by a capital letter, skipping G, which names the graph. */
export const vx = (i: number) => "ABCDEFHIJKLM"[i]!;

/** Edge is an edge or arc between two vertices; undirected edges keep the smaller vertex first. */
export type Edge = readonly [number, number];

/** Graph is a simple graph, or a directed graph when its edges are read as arcs. */
export interface Graph {
  readonly n: number;
  readonly edges: readonly Edge[];
}

/** WeightedGraph is a simple graph with a weight for each edge, aligned with edges. */
export interface WeightedGraph extends Graph {
  readonly weights: readonly number[];
}

/** allPairs lists the pairs i < j of n vertices. */
export const allPairs = (n: number): Edge[] => range(0, n - 2).flatMap((i) => range(i + 1, n - 1).map((j) => [i, j] as const));

/** allArcs lists the ordered pairs of distinct vertices of n vertices. */
export const allArcs = (n: number): Edge[] =>
  range(0, n - 1).flatMap((i) => range(0, n - 1).flatMap((j) => (i === j ? [] : [[i, j] as const])));

/** sortEdges orders each undirected edge's ends and sorts the edges. */
export const sortEdges = (es: readonly Edge[]): Edge[] =>
  es.map(([a, b]) => (a < b ? [a, b] : [b, a]) as Edge).sort((x, y) => x[0] - y[0] || x[1] - y[1]);

/** sortArcs sorts arcs without reordering their ends. */
export const sortArcs = (es: readonly Edge[]): Edge[] => [...es].sort((x, y) => x[0] - y[0] || x[1] - y[1]);

/** randomGraph picks m random edges on n vertices. */
export function randomGraph(rng: Rng, n: number, m: number): Graph {
  return { n, edges: sortEdges(rng.sample(allPairs(n), m)) };
}

/** randomTree builds a random spanning tree on n vertices. */
export function randomTree(rng: Rng, n: number): Edge[] {
  const order = rng.shuffle(range(0, n - 1));
  return sortEdges(range(1, n - 1).map((i) => [order[i]!, order[rng.int(0, i - 1)]!] as const));
}

/** randomConnected builds a random connected graph: a spanning tree plus extra edges. */
export function randomConnected(rng: Rng, n: number, extra: number): Graph {
  const tree = randomTree(rng, n);
  const used = new Set(tree.map(([a, b]) => a * 32 + b));
  const rest = allPairs(n).filter(([a, b]) => !used.has(a * 32 + b));
  return { n, edges: sortEdges([...tree, ...rng.sample(rest, Math.min(extra, rest.length))]) };
}

/** randomWeighted builds a random connected graph with distinct weights from 1 to maxWeight. */
export function randomWeighted(rng: Rng, n: number, extra: number, maxWeight = 20): WeightedGraph {
  const g = randomConnected(rng, n, extra);
  return { ...g, weights: rng.sample(range(1, maxWeight), g.edges.length) };
}

/** randomDag builds a random directed acyclic graph with m arcs that respect a hidden random order. */
export function randomDag(rng: Rng, n: number, m: number): Graph {
  const order = rng.shuffle(range(0, n - 1));
  const arcs = allPairs(n).map(([i, j]) => [order[i]!, order[j]!] as const);
  return { n, edges: sortArcs(rng.sample(arcs, m)) };
}

/** vertexSetTex writes V = {A, B, …}. */
export const vertexSetTex = (n: number) =>
  `V = \\{${range(0, n - 1)
    .map(vx)
    .join(", ")}\\}`;

/** edgeTex writes an edge as two letters, such as AB. */
export const edgeTex = ([a, b]: Edge) => `${vx(a)}${vx(b)}`;

/** arcTex writes an arc as an ordered pair, such as (A, B). */
export const arcTex = ([a, b]: Edge) => `(${vx(a)}, ${vx(b)})`;

/** edgeSetTex writes E = {AB, AC, …}. */
export const edgeSetTex = (g: Graph) => `E = \\{${g.edges.map(edgeTex).join(", ")}\\}`;

/** arcSetTex writes E = {(A, B), …}. */
export const arcSetTex = (g: Graph) => `E = \\{${g.edges.map(arcTex).join(", ")}\\}`;

/** graphIntro introduces a graph G by its vertex and edge sets. */
export const graphIntro = (g: Graph): Text =>
  t(
    `Let $G$ be the graph with $${vertexSetTex(g.n)}$ and $${edgeSetTex(g)}$.`,
    `设图 $G$ 的顶点集为 $${vertexSetTex(g.n)}$，边集为 $${edgeSetTex(g)}$。`,
  );

/** digraphIntro introduces a directed graph G by its vertex and arc sets. */
export const digraphIntro = (g: Graph): Text =>
  t(
    `Let $G$ be the directed graph with $${vertexSetTex(g.n)}$ and $${arcSetTex(g)}$.`,
    `设有向图 $G$ 的顶点集为 $${vertexSetTex(g.n)}$，弧集为 $${arcSetTex(g)}$。`,
  );

/** weightedTex writes the weighted edges of a graph, such as AB: 4. */
export const weightedTex = (g: WeightedGraph) => `$${g.edges.map((e, i) => `${edgeTex(e)}\\colon ${g.weights[i]}`).join(",\\ ")}$`;

/** neighbors lists the neighbors of every vertex in alphabetical order. */
export function neighbors(g: Graph, directed = false): number[][] {
  const adj: number[][] = range(0, g.n - 1).map(() => []);
  for (const [a, b] of g.edges) {
    adj[a]!.push(b);
    if (!directed) adj[b]!.push(a);
  }
  return adj.map((l) => l.sort((x, y) => x - y));
}

/** degrees counts the edges at each vertex. */
export const degrees = (g: Graph) => neighbors(g).map((l) => l.length);

/** bfs returns the distance from s to every vertex (Infinity if unreachable) and the visiting order with alphabetical tie-breaks. */
export function bfs(g: Graph, s: number, directed = false): { dist: number[]; order: number[] } {
  const adj = neighbors(g, directed);
  const dist = range(0, g.n - 1).map(() => Number.POSITIVE_INFINITY);
  dist[s] = 0;
  const order = [s];
  for (let i = 0; i < order.length; i++) {
    const u = order[i]!;
    for (const w of adj[u]!) {
      if (dist[w] === Number.POSITIVE_INFINITY) {
        dist[w] = dist[u]! + 1;
        order.push(w);
      }
    }
  }
  return { dist, order };
}

/** componentCount counts the connected components of a graph, ignoring the vertices in removed. */
export function componentCount(g: Graph, removed: readonly number[] = []): number {
  const gone = new Set(removed);
  const parent = range(0, g.n - 1);
  const find = (x: number): number => (parent[x] === x ? x : find(parent[x]!));
  for (const [a, b] of g.edges) if (!gone.has(a) && !gone.has(b)) parent[find(a)] = find(b);
  return range(0, g.n - 1).filter((x) => !gone.has(x) && find(x) === x).length;
}

/** adjacencyMatrix builds the adjacency matrix of a graph. */
export function adjacencyMatrix(g: Graph, directed = false): number[][] {
  const m = range(0, g.n - 1).map(() => range(0, g.n - 1).map(() => 0));
  for (const [a, b] of g.edges) {
    m[a]![b]! += 1;
    if (!directed) m[b]![a]! += 1;
  }
  return m;
}

/** matMul multiplies two square matrices. */
export const matMul = (x: readonly (readonly number[])[], y: readonly (readonly number[])[]) =>
  x.map((row) => y[0]!.map((_, j) => row.reduce((s, v, k) => s + v * y[k]![j]!, 0)));

/** matPow raises a square matrix to a positive power. */
export function matPow(x: readonly (readonly number[])[], k: number): number[][] {
  let r = x.map((row) => [...row]);
  for (let i = 1; i < k; i++) r = matMul(r, x);
  return r;
}

/** matTex writes a matrix of numbers. */
export const matTex = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

/** orderTex names the rows and columns of a matrix in vertex order. */
export const orderTex = (n: number) =>
  range(0, n - 1)
    .map(vx)
    .join(", ");

/** kruskal returns the weights of the edges Kruskal's algorithm adds, in order. */
export function kruskal(g: WeightedGraph): number[] {
  const parent = range(0, g.n - 1);
  const find = (x: number): number => (parent[x] === x ? x : find(parent[x]!));
  const added: number[] = [];
  const idx = range(0, g.edges.length - 1).sort((i, j) => g.weights[i]! - g.weights[j]!);
  for (const i of idx) {
    const [a, b] = g.edges[i]!;
    if (find(a) !== find(b)) {
      parent[find(a)] = find(b);
      added.push(g.weights[i]!);
    }
  }
  return added;
}

/** prim returns the vertices Prim's algorithm adds from vertex 0 and the weights of the edges it uses, in order; ties go to the lighter edge, then the earlier letter. */
export function prim(n: number, weight: (a: number, b: number) => number | undefined): { vertices: number[]; weights: number[] } {
  const inTree = new Set([0]);
  const vertices = [0];
  const weights: number[] = [];
  while (inTree.size < n) {
    let best: [number, number] | undefined;
    for (const u of inTree) {
      for (let v = 0; v < n; v++) {
        const w = inTree.has(v) ? undefined : weight(u, v);
        if (w !== undefined && (best === undefined || w < best[0] || (w === best[0] && v < best[1]))) best = [w, v];
      }
    }
    if (best === undefined) throw new Error("prim on a disconnected graph");
    inTree.add(best[1]);
    vertices.push(best[1]);
    weights.push(best[0]);
  }
  return { vertices, weights };
}

/** weightOf looks up the weight of the edge between a and b. */
export function weightOf(g: WeightedGraph): (a: number, b: number) => number | undefined {
  const w = new Map(g.edges.map(([a, b], i) => [a * 32 + b, g.weights[i]!] as const));
  return (a, b) => w.get(Math.min(a, b) * 32 + Math.max(a, b));
}

/** dijkstra returns the shortest distances from vertex 0 and the order in which vertices are finalized, ties broken alphabetically. */
export function dijkstra(g: WeightedGraph): { dist: number[]; order: number[] } {
  const w = weightOf(g);
  const dist = range(0, g.n - 1).map(() => Number.POSITIVE_INFINITY);
  dist[0] = 0;
  const done = new Set<number>();
  const order: number[] = [];
  while (done.size < g.n) {
    let u = -1;
    for (let v = 0; v < g.n; v++) if (!done.has(v) && (u === -1 || dist[v]! < dist[u]!)) u = v;
    done.add(u);
    order.push(u);
    for (let v = 0; v < g.n; v++) {
      const e = w(u, v);
      if (e !== undefined && dist[u]! + e < dist[v]!) dist[v] = dist[u]! + e;
    }
  }
  return { dist, order };
}

/** kahn returns the order Kahn's algorithm produces, always taking the earliest available letter. */
export function kahn(g: Graph): number[] {
  const indeg = range(0, g.n - 1).map((v) => g.edges.filter(([, b]) => b === v).length);
  const out: number[] = [];
  const done = new Set<number>();
  while (out.length < g.n) {
    const v = range(0, g.n - 1).find((x) => !done.has(x) && indeg[x] === 0);
    if (v === undefined) throw new Error("kahn on a cyclic graph");
    done.add(v);
    out.push(v);
    for (const [a, b] of g.edges) if (a === v) indeg[b]! -= 1;
  }
  return out;
}

/** isAcyclic reports whether a directed graph has no directed cycle. */
export function isAcyclic(g: Graph): boolean {
  const indeg = range(0, g.n - 1).map((v) => g.edges.filter(([, b]) => b === v).length);
  const queue = range(0, g.n - 1).filter((v) => indeg[v] === 0);
  let seen = 0;
  while (queue.length > 0) {
    const v = queue.pop()!;
    seen++;
    for (const [a, b] of g.edges) if (a === v && --indeg[b]! === 0) queue.push(b);
  }
  return seen === g.n;
}

/** fx rounds a figure coordinate. */
const fx = (x: number) => Math.round(x * 10) / 10;

/** graphFigure draws a graph with its vertices on a circle; arcs get arrowheads and weighted edges get labels. */
export function graphFigure(g: Graph, opts: { readonly directed?: boolean; readonly weights?: readonly number[] } = {}): Figure {
  const R = 80;
  const r = 11;
  const pos = range(0, g.n - 1).map((i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / g.n;
    return [110 + R * Math.cos(a), 105 + R * Math.sin(a)] as const;
  });
  let body = "";
  g.edges.forEach(([a, b], i) => {
    const [x1, y1] = pos[a]!;
    const [x2, y2] = pos[b]!;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const sx = x1 + ux * r;
    const sy = y1 + uy * r;
    const ex = x2 - ux * r;
    const ey = y2 - uy * r;
    body += `<line x1="${fx(sx)}" y1="${fx(sy)}" x2="${fx(ex)}" y2="${fx(ey)}"/>`;
    if (opts.directed) {
      const bx = ex - ux * 8;
      const by = ey - uy * 8;
      body += `<polygon fill="currentColor" points="${fx(ex)},${fx(ey)} ${fx(bx - uy * 3.5)},${fx(by + ux * 3.5)} ${fx(bx + uy * 3.5)},${fx(by - ux * 3.5)}"/>`;
    }
    const w = opts.weights?.[i];
    if (w !== undefined) {
      const mx = (x1 + x2) / 2 - uy * 8;
      const my = (y1 + y2) / 2 + ux * 8 + 4;
      body += `<text class="accent" x="${fx(mx)}" y="${fx(my)}" stroke="none" fill="currentColor" font-size="11">${w}</text>`;
    }
  });
  for (const [i, [x, y]] of pos.entries()) {
    body += `<circle cx="${fx(x)}" cy="${fx(y)}" r="${r}"/><text x="${fx(x)}" y="${fx(y + 4.5)}" stroke="none" fill="currentColor">${vx(i)}</text>`;
  }
  const list = g.edges.map((e, i) => `${opts.directed ? arcTex(e) : edgeTex(e)}${opts.weights ? ` (${opts.weights[i]})` : ""}`).join(", ");
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 210" fill="none" stroke="currentColor" stroke-width="1.2" font-size="13" text-anchor="middle">${body}</svg>`,
    alt: t(
      `A ${opts.directed ? "directed " : ""}graph with vertices ${range(0, g.n - 1)
        .map(vx)
        .join(", ")} and ${opts.directed ? "arcs" : "edges"} ${list || "none"}.`,
      `一个${opts.directed ? "有向" : ""}图，顶点为 ${range(0, g.n - 1)
        .map(vx)
        .join("、")}，${opts.directed ? "弧" : "边"}为 ${list || "无"}。`,
    ),
  };
}
