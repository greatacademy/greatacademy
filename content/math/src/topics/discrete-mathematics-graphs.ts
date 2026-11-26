import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { discreteDrawings1 } from "../explanation-drawings-discrete-mathematics-1.ts";
import { remainingDrawings9 } from "../explanation-drawings-remaining-9.ts";
import { article, choiceProblem, numberProblem, verdictChoice, why, withMistakes, yesNo } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
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

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** distinct keeps the finite mistakes that differ from the answer, each value once. */
const distinct = (answer: number, ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i, all) => Number.isFinite(m.value as number) && m.value !== answer && all.findIndex((o) => o.value === m.value) === i);

/** times writes a product of numbers, leaving out factors of one: "3 \cdot 4", "5". */
const times = (...fs: readonly number[]) => {
  const kept = fs.filter((f) => f !== 1);
  return kept.length === 0 ? "1" : kept.join(" \\cdot ");
};

/** pw writes a power, leaving out an exponent of one. */
const pw = (base: number, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

/** chain joins the sides of an equation, leaving out a side that repeats the one before it. */
const chain = (...sides: readonly string[]) => sides.filter((s, i) => i === 0 || s !== sides[i - 1]).join(" = ");

/** letters writes vertices as separate formulas: "$A$, $B$" in English, "$A$、$B$" in Chinese. */
const letters = (vs: readonly number[], zh = false) => vs.map((v) => `$${vx(v)}$`).join(zh ? "、" : ", ");

/** neighborsOf lists the neighbors of each vertex. */
const neighborsOf = (g: Graph): number[][] =>
  range(0, g.n - 1).map((v) => g.edges.flatMap(([a, b]) => (a === v ? [b] : b === v ? [a] : [])));

/** cycleOf finds a cycle of the given length from its smallest vertex, listing its start again at the end. */
function cycleOf(g: Graph, length: number): number[] {
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
  return [...path, path[0]!];
}

/** cycleTex writes a cycle of the given length, from its smallest vertex: "A - B - C - A". */
const cycleTex = (g: Graph, length: number): string =>
  cycleOf(g, length)
    .map((v) => vx(v))
    .join(" - ");

/** piecesOf lists the vertex sets of the connected components, each in alphabetical order. */
function piecesOf(g: Graph): number[][] {
  const adjacent = neighborsOf(g);
  const seen = new Set<number>();
  const pieces: number[][] = [];
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
    pieces.push(piece.sort((a, b) => a - b));
  }
  return pieces;
}

/** piecesTex writes the vertex sets of the connected components: "\{A, B\}, \{C\}". */
const piecesTex = (g: Graph): string =>
  piecesOf(g)
    .map((piece) => `\\{${piece.map((v) => vx(v)).join(", ")}\\}`)
    .join(", ");

/** pathTo finds a shortest path from s to e, stepping back to the earliest letter one layer closer each time. */
function pathTo(g: Graph, s: number, e: number, directed = false): number[] {
  const dist = bfs(g, s, directed).dist;
  const out = neighbors(g, directed);
  const path = [e];
  let at = e;
  while (at !== s) {
    const here = at;
    at = range(0, g.n - 1).find((w) => dist[w] === dist[here]! - 1 && out[w]!.includes(here))!;
    path.push(at);
  }
  return path.reverse();
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
  intro: t(
    "At a meeting of $50$ people, draw a vertex for each person and an edge for each pair who shook hands. No one shakes their own hand and no pair is joined twice, so this simple graph has at most $\\binom{50}{2} = \\frac{50 \\cdot 49}{2} = 1225$ edges.\n\nCheck: each person can shake at most $49$ hands, and the $50 \\cdot 49 = 2450$ handshakes counted person by person count every handshake twice, once from each side: $\\frac{2450}{2} = 1225$.\n\nIn this lesson we read a graph from its neighbor lists, count its edges, find the most edges a simple graph can have, and count the labeled graphs with a given number of edges.",
    "在一次 $50$ 人的会议上，每人画一个顶点，每对握过手的人之间画一条边。没有人和自己握手，每对人也不会连两次，所以这个简单图至多有 $\\binom{50}{2} = \\frac{50 \\cdot 49}{2} = 1225$ 条边。\n\n检验：每人至多和 $49$ 人握手，按人逐个数出的 $50 \\cdot 49 = 2450$ 次握手把每次握手都数了两次，两边各一次：$\\frac{2450}{2} = 1225$。\n\n本课我们由邻点表读出一个图，数它的边，求简单图边数的最大值，并统计给定边数的标号图。",
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
        "If $N(A) = \\{B, C\\}$, $N(B) = \\{A\\}$, $N(C) = \\{A\\}$, the edges are $AB$ and $AC$. Each edge appears in two lists, so the number of edges is half the total length of the lists: $\\frac{4}{2} = 2$.\n\n> **Watch out.** The edge $AB$ is listed under $A$ and again under $B$: halve the total number of entries, and do not count each entry as an edge.",
        "若 $N(A) = \\{B, C\\}$，$N(B) = \\{A\\}$，$N(C) = \\{A\\}$，则边为 $AB$ 和 $AC$。每条边出现在两个表中，所以边数是各表长度总和的一半：$\\frac{4}{2} = 2$。\n\n> **注意。** 边 $AB$ 在 $A$ 的表中列了一次，在 $B$ 的表中又列了一次：要把表项总数减半，不能把每一项都当作一条边。",
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
        const lengths = adj.map((l) => l.length).join(" + ");
        const edges = g.edges.map(edgeTex).join(", ");
        return numberProblem({
          prompt: t(
            `A simple graph has these neighbor lists: $${lists}$. How many edges does it have?`,
            `一个简单图的邻点表如下：$${lists}$。它有多少条边？`,
          ),
          answer: m,
          mistakes: distinct(m, [
            why(
              2 * m,
              "That counts every entry as an edge; each edge appears in two lists, so halve the total.",
              "那是把每一项都当作一条边；每条边出现在两个表中，要把总数减半。",
            ),
            why(n, "That is the number of vertices, the number of lists, not the number of edges.", "那是顶点数，即表的个数，不是边数。"),
            why(m + 1, "That is one too many: add the list lengths again and halve the total.", "多了一条：重新把各表长度相加，再减半。"),
            why(m - 1, "That is one too few: add the list lengths again and halve the total.", "少了一条：重新把各表长度相加，再减半。"),
          ]),
          solution: walked(
            [
              [["Add the list lengths", "把各表长度相加"], t(`$${lengths} = ${2 * m}$.`, `$${lengths} = ${2 * m}$。`)],
              [
                ["Halve the total", "把总数减半"],
                t(
                  `Each edge is listed twice, once under each end, so there are $\\frac{${2 * m}}{2} = ${m}$ edges.`,
                  `每条边在两个端点下各列一次，所以共有 $\\frac{${2 * m}}{2} = ${m}$ 条边。`,
                ),
              ],
            ],
            t(
              `Writing each edge once, with its earlier letter first, gives $${edges}$: $${m}$ edges.`,
              `把每条边只写一次，较前的字母在前，得 $${edges}$：共 $${m}$ 条。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-maximum-number-of-edges",
      figure: discreteDrawings1["introduction-to-graphs#the-maximum-number-of-edges"],
      title: t("The maximum number of edges", "边数的最大值"),
      explanation: t(
        "In a simple graph on $n$ vertices each pair of vertices is joined at most once, so there are at most $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ edges, reached by the complete graph. The drawing shows the complete graph on $10$ vertices, with $\\frac{10 \\cdot 9}{2} = 45$ edges. For $n = 60$ that is $\\frac{60 \\cdot 59}{2} = 1770$.\n\n> **Watch out.** An edge joins an unordered pair: $n(n - 1)$ counts every edge twice, once from each end, so divide it by $2$.",
        "$n$ 个顶点的简单图中，每对顶点至多连一条边，所以至多有 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ 条边，完全图达到这个值。图中是 $10$ 个顶点的完全图，有 $\\frac{10 \\cdot 9}{2} = 45$ 条边。$n = 60$ 时为 $\\frac{60 \\cdot 59}{2} = 1770$。\n\n> **注意。** 边连接的是无序的顶点对：$n(n - 1)$ 把每条边从两端各数了一次，要除以 $2$。",
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
          mistakes: distinct(value, [
            why(
              n * (n - 1),
              "That counts ordered pairs, so every edge is counted from both ends; divide by $2$.",
              "那是数了有序对，每条边从两端各数了一次；要除以 $2$。",
            ),
            why(
              n * n,
              "That pairs every vertex with every vertex, itself included; a simple graph has no loops and joins each pair once.",
              "那是把每个顶点和所有顶点（包括自身）配对；简单图没有环，每对顶点只连一次。",
            ),
            why(
              n - 1,
              "That is the degree of one vertex in the complete graph, not its number of edges.",
              "那是完全图中一个顶点的度，不是边数。",
            ),
            why(
              choose(n + 1, 2),
              `That counts the pairs of $${n + 1}$ vertices; there are $${n}$.`,
              `那是 $${n + 1}$ 个顶点的顶点对数；顶点只有 $${n}$ 个。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the pairs", "数顶点对"],
                t(
                  `Each edge joins a different pair of vertices, and the complete graph uses every pair, so the most is $\\binom{${n}}{2}$.`,
                  `每条边连接不同的一对顶点，完全图用到了每一对，所以最多为 $\\binom{${n}}{2}$。`,
                ),
              ],
              [
                ["Compute", "计算"],
                t(
                  `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${value}$.`,
                  `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Each of the $${n}$ vertices has at most $${n - 1}$ neighbors, so the degrees add to at most $${n} \\cdot ${n - 1} = ${n * (n - 1)} = 2 \\cdot ${value}$, twice the number of edges.`,
              `$${n}$ 个顶点中每个至多有 $${n - 1}$ 个邻点，所以度数和至多为 $${n} \\cdot ${n - 1} = ${n * (n - 1)} = 2 \\cdot ${value}$，正是边数的两倍。`,
            ),
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
  intro: t(
    "In the square with edges $AB$, $BC$, $CD$ and $DA$, the sequence $A, B, C, D$ is a path of length $3$, yet $d(A, D) = 1$, because the edge $DA$ joins the two ends directly.\n\nCheck: $A, D$ is itself a walk of length $1$, and a walk of length $0$ never leaves $A$, so no route from $A$ to $D$ is shorter than $1$.\n\nIn this lesson we tell walks, trails and paths apart, find distances layer by layer, and count the walks between two vertices of a complete graph.",
    "在边为 $AB$、$BC$、$CD$、$DA$ 的正方形中，序列 $A, B, C, D$ 是长度为 $3$ 的路径，但 $d(A, D) = 1$，因为边 $DA$ 直接连接两端。\n\n检验：$A, D$ 本身就是长度为 $1$ 的途径，而长度为 $0$ 的途径不会离开 $A$，所以从 $A$ 到 $D$ 没有比 $1$ 更短的路线。\n\n本课我们区分途径、迹与路径，逐层求出距离，并统计完全图中两个顶点之间的途径。",
  ),
  prerequisites: ["introduction-to-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-walks",
      figure: discreteDrawings1["walks-trails-paths-and-distances#classifying-walks"],
      title: t("Walks, trails and paths", "途径、迹与路径"),
      explanation: t(
        "In a triangle $ABC$ with a pendant edge $CD$: $A, B, C, D$ is a path; $A, B, C, A$ repeats a vertex but no edge, so it is a trail; $C, D, C$ uses $CD$ twice, so it is only a walk; $A, D$ is not a walk because $AD$ is not an edge.\n\n> **Watch out.** Test the steps first: if two consecutive vertices are not joined, the sequence is not a walk at all, however few repeats it has. A trail may repeat vertices; only a path may not.",
        "在三角形 $ABC$ 加悬挂边 $CD$ 的图中：$A, B, C, D$ 是路径；$A, B, C, A$ 重复顶点但不重复边，是迹；$C, D, C$ 两次经过 $CD$，只是途径；$A, D$ 不是途径，因为 $AD$ 不是边。\n\n> **注意。** 先检查每一步：只要有两个相邻的顶点之间没有边，这个序列就根本不是途径，不管它重复得多少。迹可以重复顶点，只有路径不可以。",
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
        const reasons = [
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
        ];
        const reason = reasons[cls]!;
        const s = seq.map(vx).join(", ");
        const pairs = seq.slice(1).map((v, i) => [seq[i]!, v] as const);
        const key = ([a, b]: readonly [number, number]) => Math.min(a, b) * 32 + Math.max(a, b);
        const has = new Set(g.edges.map(([a, b]) => a * 32 + b));
        const stepTex = (p: readonly [number, number]) => `${vx(p[0])}${vx(p[1])}`;
        const missing = pairs.find((p) => !has.has(key(p)));
        const twice = pairs.find((p, i) => pairs.slice(0, i).some((q) => key(q) === key(p)));
        const again = seq.find((v, i) => seq.indexOf(v) !== i);
        const first = missing
          ? t(
              `$${stepTex(missing)}$ is not an edge of $G$, so the sequence breaks at that step.`,
              `$${stepTex(missing)}$ 不是 $G$ 的边，所以序列在这一步断开了。`,
            )
          : t(
              `Each step $${pairs.map(stepTex).join(", ")}$ is an edge of $G$.`,
              `每一步 $${pairs.map(stepTex).join(", ")}$ 都是 $G$ 的边。`,
            );
        const second =
          cls === 3
            ? t(
                "A sequence with a missing edge is not a walk, so its repeats no longer matter.",
                "缺了一条边的序列不是途径，所以是否重复已无关紧要。",
              )
            : cls === 2
              ? t(`The edge $${stepTex(twice!)}$ is used twice.`, `边 $${stepTex(twice!)}$ 被经过了两次。`)
              : cls === 1
                ? t(`No edge is used twice, but $${vx(again!)}$ appears twice.`, `没有边被经过两次，但 $${vx(again!)}$ 出现了两次。`)
                : t("No edge and no vertex appears twice.", "没有边，也没有顶点出现两次。");
        return withFigure(
          withMistakes(
            choiceProblem({
              prompt: t(`${graphIntro(g).en} What is the sequence $${s}$?`, `${graphIntro(g)["zh-CN"]}序列 $${s}$ 是什么？`),
              options: WALK_CLASSES,
              correct: cls,
              solution: walked(
                [
                  [["Check each step", "检查每一步"], first],
                  [["Look for repeats", "寻找重复"], second],
                ],
                t(
                  `Every path is a trail and every trail is a walk, so the answer is the narrowest class whose tests the sequence passes. ${reason.en}`,
                  `路径都是迹，迹都是途径，所以答案是序列能通过其检验的最窄的一类。${reason["zh-CN"]}`,
                ),
              ),
            }),
            WALK_CLASSES.map((c) => ({ response: c.en, why: reason })),
          ),
          g,
        );
      },
    },
    {
      id: "distances-in-graphs",
      title: t("Distances", "距离"),
      explanation: t(
        "To find $d(A, F)$, list the vertices at distance $1$ from $A$, then those at distance $2$ (new neighbors of the previous layer), and so on until $F$ appears. With $E = \\{AB, AC, BC, CD, DE\\}$ the layers from $A$ are $0\\colon A$; $1\\colon B, C$; $2\\colon D$; $3\\colon E$, so $d(A, E) = 3$, along the path $A - C - D - E$.\n\n> **Watch out.** A distance counts edges, not vertices: the path $A - C - D - E$ passes through $4$ vertices but has length $3$. And only a shortest route counts; a longer walk never sets the distance.",
        "求 $d(A, F)$ 时，先列出与 $A$ 距离为 $1$ 的顶点，再列出距离为 $2$ 的（上一层的新邻点），依此类推，直到出现 $F$。若 $E = \\{AB, AC, BC, CD, DE\\}$，从 $A$ 出发的各层为 $0\\colon A$；$1\\colon B, C$；$2\\colon D$；$3\\colon E$，所以 $d(A, E) = 3$，沿路径 $A - C - D - E$。\n\n> **注意。** 距离数的是边而不是顶点：路径 $A - C - D - E$ 经过 $4$ 个顶点，长度却是 $3$。而且只有最短的路线才算，更长的途径决定不了距离。",
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
        const route = pathTo(g, s, e)
          .map((v) => vx(v))
          .join(" - ");
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} Find $d(${vx(s)}, ${vx(e)})$.`, `${graphIntro(g)["zh-CN"]}求 $d(${vx(s)}, ${vx(e)})$。`),
            answer: d,
            mistakes: distinct(d, [
              why(
                d + 1,
                "That counts the vertices on a shortest path; the distance counts its edges.",
                "那是数了最短路径上的顶点；距离数的是边。",
              ),
              why(
                d - 1,
                `That is too short: $${vx(e)}$ is not in layer $${d - 1}$, so no path that short reaches it.`,
                `太短了：$${vx(e)}$ 不在第 $${d - 1}$ 层，没有那么短的路径能到达它。`,
              ),
              why(
                d + 2,
                "That follows a longer route; the distance is the length of a shortest one.",
                "那是走了更长的路线；距离是最短路线的长度。",
              ),
            ]),
            solution: walked(
              [
                [
                  [`Build the layers from $${vx(s)}$`, `从 $${vx(s)}$ 出发分层`],
                  t(`The layers are ${layers(g, s)}.`, `各层为 ${layers(g, s)}。`),
                ],
                [
                  [`Find $${vx(e)}$`, `找到 $${vx(e)}$`],
                  t(
                    `$${vx(e)}$ first appears in layer $${d}$, so $d(${vx(s)}, ${vx(e)}) = ${d}$.`,
                    `$${vx(e)}$ 首次出现在第 $${d}$ 层，所以 $d(${vx(s)}, ${vx(e)}) = ${d}$。`,
                  ),
                ],
              ],
              t(
                `The path $${route}$ uses $${d}$ edges, all in $E$, and $${vx(e)}$ lies in no earlier layer, so no shorter path exists.`,
                `路径 $${route}$ 用了 $${d}$ 条边，都在 $E$ 中；$${vx(e)}$ 不在更早的层里，所以没有更短的路径。`,
              ),
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
  intro: t(
    "Around the one-way loop with arcs $(A, B)$, $(B, C)$, $(C, D)$ and $(D, A)$, the directed distance from $A$ to $D$ is $3$, along $A \\to B \\to C \\to D$, while the distance from $D$ back to $A$ is only $1$.\n\nCheck: the only arc leaving $A$ goes to $B$, the only one leaving $B$ goes to $C$, and only then can $D$ be reached, so no directed path from $A$ to $D$ is shorter than $3$; the arc $(D, A)$ alone gives the reverse trip.\n\nIn this lesson we find directed distances, count directed walks of length $2$ through their middle vertices, and count walks of length $3$ with powers of an adjacency matrix.",
    "沿着弧为 $(A, B)$、$(B, C)$、$(C, D)$、$(D, A)$ 的单向环，从 $A$ 到 $D$ 的有向距离是 $3$，沿 $A \\to B \\to C \\to D$；而从 $D$ 回到 $A$ 的距离只有 $1$。\n\n检验：离开 $A$ 的唯一一条弧通向 $B$，离开 $B$ 的唯一一条弧通向 $C$，之后才能到达 $D$，所以从 $A$ 到 $D$ 没有比 $3$ 更短的有向路径；而单独一条弧 $(D, A)$ 就完成了反向的行程。\n\n本课我们求有向距离，按中间顶点数长度为 $2$ 的有向途径，并用邻接矩阵的幂数长度为 $3$ 的途径。",
  ),
  prerequisites: ["walks-trails-paths-and-distances", "graphical-representations-of-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "directed-distances",
      figure: discreteDrawings1["walks-paths-and-distances-in-directed-graphs#directed-distances"],
      title: t("Directed distances", "有向距离"),
      explanation: t(
        "In a directed graph you may only travel along arcs in their direction, so the distance from one vertex to another can differ from the reverse distance. With arcs $(A, B), (B, C), (C, A)$: $d(A, C) = 2$ via $A \\to B \\to C$, but $d(C, A) = 1$. Distances in directed graphs need not be symmetric.\n\n> **Watch out.** An arc $(u, v)$ does not let you go from $v$ to $u$: build the layers from the out-neighbors only, never reading the graph as undirected.",
        "在有向图中只能沿弧的方向行进，所以从一个顶点到另一个顶点的距离可能与反方向的距离不同。若弧为 $(A, B), (B, C), (C, A)$：$d(A, C) = 2$（经 $A \\to B \\to C$），但 $d(C, A) = 1$。有向图中的距离不一定对称。\n\n> **注意。** 弧 $(u, v)$ 不能让你从 $v$ 走到 $u$：分层时只用出邻点，绝不能把图当作无向图来读。",
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
        const route = pathTo(g, s, e, true);
        const arcs = route
          .slice(1)
          .map((v, i) => `(${vx(route[i]!)}, ${vx(v)})`)
          .join(", ");
        return withFigure(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} Find the directed distance from $${vx(s)}$ to $${vx(e)}$.`,
              `${digraphIntro(g)["zh-CN"]}求从 $${vx(s)}$ 到 $${vx(e)}$ 的有向距离。`,
            ),
            answer: d,
            mistakes: distinct(d, [
              why(
                undirected,
                "That ignores the directions of the arcs; an arc can be followed only forward.",
                "那是忽略了弧的方向；弧只能顺着方向走。",
              ),
              why(
                back,
                `That is the distance from $${vx(e)}$ to $${vx(s)}$, the reverse direction.`,
                `那是从 $${vx(e)}$ 到 $${vx(s)}$ 的距离，方向反了。`,
              ),
              why(
                d + 1,
                "That counts the vertices on a shortest directed path; the distance counts its arcs.",
                "那是数了最短有向路径上的顶点；距离数的是弧。",
              ),
              why(
                d - 1,
                `That is too short: $${vx(e)}$ is not in layer $${d - 1}$ when the arcs are followed forward.`,
                `太短了：顺着弧的方向，$${vx(e)}$ 不在第 $${d - 1}$ 层。`,
              ),
            ]),
            solution: walked(
              [
                [
                  [`Build the layers from $${vx(s)}$`, `从 $${vx(s)}$ 出发分层`],
                  t(
                    `Following arcs forward only, the layers are ${layers(g, s, true)}.`,
                    `只顺着弧的方向走，各层为 ${layers(g, s, true)}。`,
                  ),
                ],
                [
                  [`Find $${vx(e)}$`, `找到 $${vx(e)}$`],
                  t(
                    `$${vx(e)}$ first appears in layer $${d}$, so the directed distance is $${d}$.`,
                    `$${vx(e)}$ 首次出现在第 $${d}$ 层，所以有向距离为 $${d}$。`,
                  ),
                ],
              ],
              t(
                `The arcs $${arcs}$ lead from $${vx(s)}$ to $${vx(e)}$ in $${d}$ steps, and $${vx(e)}$ lies in no earlier layer.`,
                `弧 $${arcs}$ 用 $${d}$ 步从 $${vx(s)}$ 走到 $${vx(e)}$，而 $${vx(e)}$ 不在更早的层里。`,
              ),
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
        "A directed walk of length $2$ from $u$ to $v$ is $u \\to w \\to v$, one for each $w$ with arcs $(u, w)$ and $(w, v)$. Count the out-neighbors of $u$ that are in-neighbors of $v$. With arcs $(A, B), (A, C), (A, D), (B, D), (C, D)$, the walks from $A$ to $D$ of length $2$ are $A \\to B \\to D$ and $A \\to C \\to D$: there are $2$.\n\n> **Watch out.** The arc $(A, D)$ is a walk of length $1$, not $2$, and a middle vertex needs both arcs pointing the right way: an arc from $u$ into it and an arc from it into $v$.",
        "从 $u$ 到 $v$ 的长度为 $2$ 的有向途径形如 $u \\to w \\to v$，每个同时有弧 $(u, w)$ 和 $(w, v)$ 的 $w$ 对应一条。数一数 $u$ 的出邻点中有多少是 $v$ 的入邻点。若弧为 $(A, B), (A, C), (A, D), (B, D), (C, D)$，从 $A$ 到 $D$ 的长度为 $2$ 的途径是 $A \\to B \\to D$ 和 $A \\to C \\to D$：共 $2$ 条。\n\n> **注意。** 弧 $(A, D)$ 是长度为 $1$ 的途径，不是长度为 $2$ 的；中间顶点的两条弧都要方向正确：一条从 $u$ 指向它，一条从它指向 $v$。",
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
        const outs = neighbors(g, true)[u]!;
        const ins = range(0, n - 1).filter((w) => has.has(w * 32 + v));
        const U = vx(u);
        const V = vx(v);
        const first = t(
          outs.length === 0 ? `$${U}$ has no out-neighbors.` : `The out-neighbors of $${U}$ are ${letters(outs)}.`,
          outs.length === 0 ? `$${U}$没有出邻点。` : `$${U}$ 的出邻点是 ${letters(outs, true)}。`,
        );
        const second =
          ws.length === 0
            ? t(
                `None of them has an arc to $${V}$, so no walk $${U} \\to w \\to ${V}$ exists.`,
                `它们都没有指向 $${V}$ 的弧，所以不存在途径 $${U} \\to w \\to ${V}$。`,
              )
            : t(
                `Of these, ${letters(ws)} ${ws.length === 1 ? "has an arc" : "have arcs"} to $${V}$, giving ${ws.map((w) => `$${U} \\to ${vx(w)} \\to ${V}$`).join(", ")}: $${ws.length}$ ${ws.length === 1 ? "walk" : "walks"}.`,
                `其中 ${letters(ws, true)} 有指向 $${V}$ 的弧，得到 ${ws.map((w) => `$${U} \\to ${vx(w)} \\to ${V}$`).join("、")}：共 $${ws.length}$ 条。`,
              );
        const check =
          ins.length === 0
            ? t(
                `From the other end, $${V}$ has no in-neighbors at all, so no walk can end there.`,
                `从另一端看，$${V}$ 根本没有入邻点，所以没有途径能在那里结束。`,
              )
            : t(
                `From the other end, the in-neighbors of $${V}$ are ${letters(ins)}, and ${ws.length === 0 ? "none of them is" : `exactly ${letters(ws)} ${ws.length === 1 ? "is" : "are"}`} reached by an arc from $${U}$.`,
                `从另一端看，$${V}$ 的入邻点是 ${letters(ins, true)}，其中${ws.length === 0 ? "没有一个" : `恰有 ${letters(ws, true)}`}能由 $${U}$ 的弧到达。`,
              );
        return withFigure(
          numberProblem({
            prompt: t(
              `${digraphIntro(g).en} How many directed walks of length $2$ go from $${U}$ to $${V}$?`,
              `${digraphIntro(g)["zh-CN"]}从 $${U}$ 到 $${V}$ 的长度为 $2$ 的有向途径有多少条？`,
            ),
            answer: ws.length,
            mistakes: distinct(ws.length, [
              why(
                rev,
                `That counts the walks from $${V}$ to $${U}$, the reverse direction.`,
                `那是数了从 $${V}$ 到 $${U}$ 的途径，方向反了。`,
              ),
              why(
                outs.length,
                `That counts every out-neighbor of $${U}$; each must also have an arc to $${V}$.`,
                `那是数了 $${U}$ 的所有出邻点；每个还必须有指向 $${V}$ 的弧。`,
              ),
              why(
                ws.length + 1,
                "That is one too many; a direct arc is a walk of length $1$ and does not count.",
                "多了一条；直接相连的弧是长度为 $1$ 的途径，不算在内。",
              ),
            ]),
            solution: walked(
              [
                [[`List the out-neighbors of $${U}$`, `列出 $${U}$ 的出邻点`], first],
                [[`Keep those with an arc to $${V}$`, `保留有指向 $${V}$ 的弧的顶点`], second],
              ],
              check,
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
  intro: t(
    "In a star with a center joined to $11$ outer vertices, the center has degree $11$ and each outer vertex has degree $1$.\n\nCheck: the degrees add to $11 + 11 = 22$, which is twice the $11$ edges, since every edge has one end at the center and one outside.\n\nIn this lesson we find degrees in simple graphs, count loops and repeated edges in multigraphs, and find a missing degree from the others.",
    "在一个星形图中，中心与 $11$ 个外围顶点相连，中心的度是 $11$，每个外围顶点的度是 $1$。\n\n检验：度数之和为 $11 + 11 = 22$，正是 $11$ 条边的两倍，因为每条边一端在中心、一端在外围。\n\n本课我们求简单图中顶点的度，在多重图中计入环和重边，并由其他顶点的度求出缺失的度。",
  ),
  prerequisites: ["introduction-to-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "degrees-in-simple-graphs",
      figure: discreteDrawings1["the-degree-of-a-vertex#degrees-in-simple-graphs"],
      title: t("Degrees in simple graphs", "简单图中的度"),
      explanation: t(
        "The degree of a vertex is the number of edges that meet it, which in a simple graph equals the number of its neighbors. If $E = \\{AB, AC, BC, CD\\}$, then $C$ lies on $AC$, $BC$ and $CD$, so $\\deg(C) = 3$.\n\n> **Watch out.** Count only the edges that contain the vertex, not all the edges of the graph, and count each such edge once: in a simple graph an edge adds $1$ to the degree of each end.",
        "顶点的度是与它相连的边数，在简单图中它等于该顶点的邻居个数。若 $E = \\{AB, AC, BC, CD\\}$，则 $C$ 在 $AC$、$BC$、$CD$ 上，所以 $\\deg(C) = 3$。\n\n> **注意。** 只数含这个顶点的边，不要数图中所有的边；每条这样的边只数一次：在简单图中，一条边使两端的度各加 $1$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomGraph(rng, n, rng.int(n, n + 5));
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const at = g.edges.filter(([a, b]) => a === v || b === v).map(edgeTex);
        const near = neighbors(g)[v]!;
        const V = vx(v);
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} Find $\\deg(${V})$.`, `${graphIntro(g)["zh-CN"]}求 $\\deg(${V})$。`),
            answer: d,
            mistakes: distinct(d, [
              why(
                g.edges.length - d,
                `That counts the edges that miss $${V}$; the degree counts those that contain it.`,
                `那是数了不含 $${V}$ 的边；度数的是含它的边。`,
              ),
              why(
                2 * d,
                "That doubles the count; in a simple graph each edge at the vertex adds only $1$.",
                "那是数了两倍；在简单图中，与该顶点相连的每条边只加 $1$。",
              ),
              why(d + 1, `That is one too many: list the edges containing $${V}$ again.`, `多了一条：重新列出含 $${V}$ 的边。`),
              why(d - 1, `That is one too few: list the edges containing $${V}$ again.`, `少了一条：重新列出含 $${V}$ 的边。`),
            ]),
            solution: walked(
              [
                [
                  [`List the edges at $${V}$`, `列出含 $${V}$ 的边`],
                  t(
                    at.length === 0 ? `No edge contains $${V}$.` : `The edges containing $${V}$ are $${at.join(", ")}$.`,
                    at.length === 0 ? `没有边含 $${V}$。` : `含 $${V}$ 的边为 $${at.join(", ")}$。`,
                  ),
                ],
                [["Count them", "数一数"], t(`So $\\deg(${V}) = ${d}$.`, `所以 $\\deg(${V}) = ${d}$。`)],
              ],
              t(
                near.length === 0
                  ? `$${V}$ has no neighbors, which matches degree $0$.`
                  : `The neighbors of $${V}$ are ${letters(near)}, one for each edge: $${d}$ of them.`,
                near.length === 0
                  ? `$${V}$ 没有邻点，与度为 $0$ 相符。`
                  : `$${V}$ 的邻点是 ${letters(near, true)}，每条边对应一个：共 $${d}$ 个。`,
              ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "degrees-with-loops-and-multiple-edges",
      figure: discreteDrawings1["the-degree-of-a-vertex#degrees-with-loops-and-multiple-edges"],
      title: t("Loops and multiple edges", "环与重边"),
      explanation: t(
        "In a multigraph a loop meets its vertex at both ends, so it adds $2$ to the degree, and each copy of a repeated edge adds $1$. In the drawing, with edges $AA, AB, AB, BC$, vertex $A$ meets the loop twice and each copy of $AB$ once, so $\\deg(A) = 2 + 2 = 4$. In the multigraph on $A, B$ with edges $AA, AA, AB, AB, AB$, vertex $A$ meets each loop twice and each copy of $AB$ once: $\\deg(A) = 2 \\cdot 2 + 3 = 7$.\n\n> **Watch out.** A loop counts $2$, not $1$, and repeated edges are counted one copy at a time, never merged into one.",
        "在多重图中，环的两端都在它的顶点上，所以使度加 $2$；重边的每个副本各加 $1$。图中的边为 $AA, AB, AB, BC$，$A$ 与环关联两次，与 $AB$ 的每个副本关联一次，所以 $\\deg(A) = 2 + 2 = 4$。在顶点为 $A, B$、边为 $AA, AA, AB, AB, AB$ 的多重图中，$A$ 与每个环关联两次，与 $AB$ 的每个副本关联一次：$\\deg(A) = 2 \\cdot 2 + 3 = 7$。\n\n> **注意。** 一个环计 $2$ 而不是 $1$；重边要一个副本一个副本地数，不能合并成一条。",
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
        const other = d - 2 * ownLoops;
        const all = range(0, n - 1).map((x) => sorted.reduce((s, [a, b]) => s + (a === x ? 1 : 0) + (b === x ? 1 : 0), 0));
        const V = vx(v);
        return numberProblem({
          prompt: t(
            `A multigraph has vertices ${range(0, n - 1)
              .map((x) => `$${vx(x)}$`)
              .join(", ")} and edges $${sorted.map(edgeTex).join(", ")}$ (repeated edges are listed separately). Find $\\deg(${V})$.`,
            `一个多重图的顶点为 ${range(0, n - 1)
              .map((x) => `$${vx(x)}$`)
              .join("、")}，边为 $${sorted.map(edgeTex).join(", ")}$（重边分别列出）。求 $\\deg(${V})$。`,
          ),
          answer: d,
          mistakes: distinct(d, [
            why(
              d - ownLoops,
              "That counts each loop once; a loop meets its vertex at both ends and adds $2$.",
              "那是把每个环只数了一次；环的两端都在该顶点上，要加 $2$。",
            ),
            why(d + 1, `That is one too many: go through the edges at $${V}$ again.`, `多了一：重新检查含 $${V}$ 的边。`),
          ]),
          solution: walked(
            [
              [
                [`Count the loops at $${V}$`, `数 $${V}$ 处的环`],
                t(
                  `$${V}$ has $${ownLoops}$ ${ownLoops === 1 ? "loop" : "loops"}, which ${ownLoops === 1 ? "adds" : "add"} $${2 * ownLoops}$ to its degree.`,
                  `$${V}$ 处有 $${ownLoops}$ 个环，使它的度增加 $${2 * ownLoops}$。`,
                ),
              ],
              [
                ["Add the other edges", "加上其余的边"],
                t(
                  other === 0
                    ? `No other edge meets $${V}$, so $\\deg(${V}) = ${d}$.`
                    : `$${other}$ other ${other === 1 ? "edge meets" : "edges meet"} $${V}$ once each: $\\deg(${V}) = ${2 * ownLoops} + ${other} = ${d}$.`,
                  other === 0
                    ? `没有其他边与 $${V}$ 关联，所以 $\\deg(${V}) = ${d}$。`
                    : `另有 $${other}$ 条边各与 $${V}$ 关联一次：$\\deg(${V}) = ${2 * ownLoops} + ${other} = ${d}$。`,
                ),
              ],
            ],
            t(
              `The degrees of ${letters(range(0, n - 1))} are $${all.join(", ")}$, and $${all.join(" + ")} = ${2 * sorted.length} = 2 \\cdot ${sorted.length}$, twice the number of edges, as every edge has two ends.`,
              `${letters(range(0, n - 1), true)} 的度为 $${all.join(", ")}$，且 $${all.join(" + ")} = ${2 * sorted.length} = 2 \\cdot ${sorted.length}$，正是边数的两倍，因为每条边有两个端点。`,
            ),
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
  intro: t(
    "A graph has $12$ vertices, each of degree $3$. Its degrees add to $12 \\cdot 3 = 36$, and every edge adds $2$ to that sum, so it has $\\frac{36}{2} = 18$ edges.\n\nCheck: all $12$ vertices have odd degree, and $12$ is even, as the lemma requires; with $11$ such vertices the sum $33$ would be odd and no graph could exist.\n\nIn this lesson we find the number of edges from the degrees, count vertices of a given degree, and find the fewest vertices a graph needs when its degrees are bounded.",
    "一个图有 $12$ 个顶点，每个顶点的度都是 $3$。度数之和为 $12 \\cdot 3 = 36$，每条边使这个和增加 $2$，所以它有 $\\frac{36}{2} = 18$ 条边。\n\n检验：$12$ 个顶点的度都是奇数，而 $12$ 是偶数，与引理相符；若有 $11$ 个这样的顶点，度数和 $33$ 是奇数，这样的图就不存在。\n\n本课我们由度数求边数，求给定度数的顶点个数，并在度数有上界时求图至少需要的顶点数。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-from-a-degree-sequence",
      figure: discreteDrawings1["the-handshaking-lemma#edges-from-a-degree-sequence"],
      title: t("Edges from degrees", "由度数求边数"),
      explanation: t(
        "Every edge has two ends and adds one to the degree of each, so the degrees sum to twice the number of edges. The graph drawn has degrees $3, 3, 2, 2, 2$, so it has $\\frac{3 + 3 + 2 + 2 + 2}{2} = 6$ edges. A graph with degrees $3, 2, 2, 1$ has $\\frac{3 + 2 + 2 + 1}{2} = 4$ edges.\n\n> **Watch out.** Halve the sum of the degrees: each edge is counted once at each of its two ends, so the sum itself is twice the number of edges.",
        "每条边有两个端点，使每个端点的度各加 1，所以度数之和等于边数的两倍。图中的图度数为 $3, 3, 2, 2, 2$，所以有 $\\frac{3 + 3 + 2 + 2 + 2}{2} = 6$ 条边。度数为 $3, 2, 2, 1$ 的图有 $\\frac{3 + 2 + 2 + 1}{2} = 4$ 条边。\n\n> **注意。** 度数之和要减半：每条边在两个端点各被数一次，所以度数之和本身是边数的两倍。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const g = randomGraph(rng, n, rng.int(n, Math.min(n + 8, (n * (n - 1)) / 2)));
        const ds = degrees(g).sort((a, b) => b - a);
        const sum = ds.reduce((a, b) => a + b, 0);
        const odd = ds.filter((d) => d % 2 === 1).length;
        return numberProblem({
          prompt: t(
            `A graph has vertex degrees $${ds.join(", ")}$. How many edges does it have?`,
            `一个图各顶点的度为 $${ds.join(", ")}$。它有多少条边？`,
          ),
          answer: sum / 2,
          mistakes: distinct(sum / 2, [
            why(
              sum,
              "That is the sum of the degrees, which counts every edge twice; halve it.",
              "那是度数之和，它把每条边数了两次；要减半。",
            ),
            why(n, "That is the number of vertices, not the number of edges.", "那是顶点数，不是边数。"),
            why(Math.max(...ds), "That is the largest degree, the edges at a single vertex.", "那是最大的度，只是一个顶点处的边数。"),
            why(sum / 2 + 1, "That is one too many: add the degrees again and halve the sum.", "多了一条：重新把度数相加，再减半。"),
          ]),
          solution: walked(
            [
              [["Add the degrees", "把度数相加"], t(`$${ds.join(" + ")} = ${sum}$.`, `$${ds.join(" + ")} = ${sum}$。`)],
              [["Halve the sum", "把和减半"], t(`$|E| = \\frac{${sum}}{2} = ${sum / 2}$.`, `$|E| = \\frac{${sum}}{2} = ${sum / 2}$。`)],
            ],
            t(
              `$2 \\cdot ${sum / 2} = ${sum}$ gives back the degree sum, and ${odd === 0 ? "no vertex has odd degree" : `the $${odd}$ vertices of odd degree are an even number`}, as the lemma requires.`,
              `$2 \\cdot ${sum / 2} = ${sum}$ 还原出度数之和，而且${odd === 0 ? "没有奇度顶点" : `$${odd}$ 个奇度顶点的个数是偶数`}，与引理相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-vertices-with-the-handshaking-lemma",
      figure: discreteDrawings1["the-handshaking-lemma#counting-vertices-with-the-handshaking-lemma"],
      title: t("Counting vertices", "求顶点数"),
      explanation: t(
        "When the degrees are known up to how many vertices have each, the handshaking lemma gives one equation for the unknown count. The graph drawn has $10$ edges, $4$ vertices of degree $3$ and $k$ of degree $2$: $4 \\cdot 3 + 2k = 20$, so $k = 4$. A graph with $13$ edges has $2$ vertices of degree $7$ and the rest of degree $3$. Then $2 \\cdot 7 + 3k = 2 \\cdot 13 = 26$, so $3k = 12$ and $k = 4$ vertices have degree $3$.\n\n> **Watch out.** The degrees add to twice the number of edges, not to the number of edges, and the known vertices' share must be subtracted before you divide.",
        "当只知道各种度数的顶点有多少个时，握手引理给出关于未知个数的一个方程。图中的图有 $10$ 条边，$4$ 个顶点的度为 $3$，$k$ 个顶点的度为 $2$：$4 \\cdot 3 + 2k = 20$，所以 $k = 4$。一个图有 $13$ 条边，其中 $2$ 个顶点的度为 $7$，其余的度为 $3$。则 $2 \\cdot 7 + 3k = 2 \\cdot 13 = 26$，所以 $3k = 12$，有 $k = 4$ 个度为 $3$ 的顶点。\n\n> **注意。** 度数之和等于边数的两倍，而不是边数本身；而且要先减去已知顶点的那部分，再做除法。",
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
        const ky = y === 1 ? "k" : `${y}k`;
        return numberProblem({
          prompt: t(
            `A graph has $${m}$ edges. Exactly $${a}$ of its vertices have degree $${x}$, and all the others have degree $${y}$. How many vertices have degree $${y}$?`,
            `一个图有 $${m}$ 条边。恰有 $${a}$ 个顶点的度为 $${x}$，其余顶点的度都为 $${y}$。度为 $${y}$ 的顶点有多少个？`,
          ),
          answer: k,
          mistakes: distinct(
            k,
            [
              why(
                k + a,
                `That counts all the vertices; only those of degree $${y}$ are asked for.`,
                `那是数了所有顶点；问的只是度为 $${y}$ 的顶点。`,
              ),
              why(
                (m - a * x) / y,
                `That uses $${m}$ for the degree sum; the degrees add to twice the number of edges.`,
                `那是把 $${m}$ 当作度数之和；度数之和是边数的两倍。`,
              ),
              why(
                (2 * m) / y,
                `That leaves out the $${a}$ vertices of degree $${x}$; subtract their share first.`,
                `那是漏掉了 $${a}$ 个度为 $${x}$ 的顶点；要先减去它们的那部分。`,
              ),
              why(2 * k, "That doubles the count; the factor $2$ belongs to the edges.", "那是把个数翻了倍；因子 $2$ 属于边数。"),
            ].filter((w) => Number.isInteger(w.value)),
          ),
          solution: walked(
            [
              [
                ["Apply the handshaking lemma", "用握手引理"],
                t(
                  `With $k$ vertices of degree $${y}$: $${a} \\cdot ${x} + ${ky} = 2 \\cdot ${m} = ${2 * m}$.`,
                  `设有 $k$ 个度为 $${y}$ 的顶点：$${a} \\cdot ${x} + ${ky} = 2 \\cdot ${m} = ${2 * m}$。`,
                ),
              ],
              [
                ["Solve for $k$", "解出 $k$"],
                t(
                  y === 1 ? `$k = ${2 * m} - ${a * x} = ${k}$.` : `$${ky} = ${2 * m} - ${a * x} = ${k * y}$, so $k = ${k}$.`,
                  y === 1 ? `$k = ${2 * m} - ${a * x} = ${k}$。` : `$${ky} = ${2 * m} - ${a * x} = ${k * y}$，所以 $k = ${k}$。`,
                ),
              ],
            ],
            t(
              `$${a} \\cdot ${x} + ${times(y, k)} = ${a * x} + ${k * y} = ${2 * m}$, twice the $${m}$ edges.`,
              `$${a} \\cdot ${x} + ${times(y, k)} = ${a * x} + ${k * y} = ${2 * m}$，正是 $${m}$ 条边的两倍。`,
            ),
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
  intro: t(
    "On the vertices $A, B, C, D$, the graph with edges $AB$ and $CD$ has as its complement the graph with the other $\\binom{4}{2} - 2 = 4$ edges: $AC$, $AD$, $BC$ and $BD$.\n\nCheck: together the two graphs use each of the $6$ pairs exactly once, and $A$ has degree $1$ in the first and $2$ in the second, adding to the $3$ other vertices.\n\nIn this lesson we count the edges and degrees of a complement, count the edges of an induced subgraph, and work with complements of regular graphs.",
    "在顶点 $A, B, C, D$ 上，边为 $AB$ 和 $CD$ 的图，其补图由其余 $\\binom{4}{2} - 2 = 4$ 条边组成：$AC$、$AD$、$BC$、$BD$。\n\n检验：两个图合起来恰好把 $6$ 对顶点各用一次；$A$ 在前者中度为 $1$，在后者中度为 $2$，相加正是其余的 $3$ 个顶点。\n\n本课我们求补图的边数和度数，求导出子图的边数，并研究正则图的补图。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-and-degrees-in-the-complement",
      figure: discreteDrawings1["subgraphs-and-graph-complements#edges-and-degrees-in-the-complement"],
      title: t("The complement", "补图"),
      explanation: t(
        "In the drawing, $G$ has $6$ vertices and $7$ edges, so $\\overline{G}$ has $15 - 7 = 8$ edges, and vertex $2$, of degree $2$ in $G$, has degree $5 - 2 = 3$ in $\\overline{G}$. If $G$ has $10$ vertices and $12$ edges, its complement $\\overline{G}$ has $\\binom{10}{2} - 12 = 45 - 12 = 33$ edges, and a vertex of degree $4$ in $G$ has degree $9 - 4 = 5$ in $\\overline{G}$, since it has $9$ possible neighbors.\n\n> **Watch out.** A vertex is never its own neighbor, so it has $n - 1$ possible neighbors, not $n$; and the pairs of vertices number $\\binom{n}{2}$, not $n(n - 1)$.",
        "图中的 $G$ 有 $6$ 个顶点、$7$ 条边，所以 $\\overline{G}$ 有 $15 - 7 = 8$ 条边；顶点 $2$ 在 $G$ 中的度为 $2$，在 $\\overline{G}$ 中的度为 $5 - 2 = 3$。若 $G$ 有 $10$ 个顶点、$12$ 条边，则补图 $\\overline{G}$ 有 $\\binom{10}{2} - 12 = 45 - 12 = 33$ 条边；$G$ 中度为 $4$ 的顶点在 $\\overline{G}$ 中的度为 $9 - 4 = 5$，因为它有 $9$ 个可能的邻点。\n\n> **注意。** 顶点不是自己的邻点，所以它有 $n - 1$ 个可能的邻点，而不是 $n$ 个；顶点对的个数是 $\\binom{n}{2}$，而不是 $n(n - 1)$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomGraph(rng, n, rng.int(n - 1, n + 4));
        const m = g.edges.length;
        const askDegree = rng.bool();
        const v = rng.int(0, n - 1);
        const d = degrees(g)[v]!;
        const total = choose(n, 2);
        const V = vx(v);
        const near = neighbors(g)[v]!;
        const far = range(0, n - 1).filter((w) => w !== v && !near.includes(w));
        const listed = (vs: readonly number[], zh = false) => (vs.length === 0 ? (zh ? "没有" : "none") : letters(vs, zh));
        return withFigure(
          numberProblem({
            prompt: askDegree
              ? t(
                  `${graphIntro(g).en} Find the degree of $${V}$ in the complement $\\overline{G}$.`,
                  `${graphIntro(g)["zh-CN"]}求 $${V}$ 在补图 $\\overline{G}$ 中的度。`,
                )
              : t(
                  `${graphIntro(g).en} How many edges does the complement $\\overline{G}$ have?`,
                  `${graphIntro(g)["zh-CN"]}补图 $\\overline{G}$ 有多少条边？`,
                ),
            answer: askDegree ? n - 1 - d : total - m,
            mistakes: askDegree
              ? distinct(n - 1 - d, [
                  why(
                    n - d,
                    `That counts $${V}$ among its own possible neighbors; it has only $${n - 1}$.`,
                    `那是把 $${V}$ 算作了自己可能的邻点；它只有 $${n - 1}$ 个。`,
                  ),
                  why(d, `That is the degree of $${V}$ in $G$, not in the complement.`, `那是 $${V}$ 在 $G$ 中的度，不是在补图中的。`),
                  why(
                    n - 2 - d,
                    `That is one too few: $${V}$ has $${n - 1}$ possible neighbors.`,
                    `少了一：$${V}$ 有 $${n - 1}$ 个可能的邻点。`,
                  ),
                ])
              : distinct(total - m, [
                  why(
                    n * (n - 1) - m,
                    `That uses $${n} \\cdot ${n - 1}$ for the pairs; each pair is counted twice there, so halve it first.`,
                    `那是用 $${n} \\cdot ${n - 1}$ 作为顶点对数；其中每对数了两次，要先减半。`,
                  ),
                  why(
                    total,
                    `That counts every pair; the $${m}$ edges of $G$ must be removed.`,
                    `那是数了所有顶点对；要去掉 $G$ 的 $${m}$ 条边。`,
                  ),
                  why(total - m + 1, "That is one too many: subtract the edges of $G$ again.", "多了一条：重新减去 $G$ 的边数。"),
                ]),
            solution: askDegree
              ? walked(
                  [
                    [
                      ["Count the possible neighbors", "数可能的邻点"],
                      t(
                        `$${V}$ can be joined to each of the other $${n - 1}$ vertices.`,
                        `$${V}$ 可以与其余 $${n - 1}$ 个顶点中的每一个相连。`,
                      ),
                    ],
                    [
                      ["Remove the neighbors in $G$", "去掉 $G$ 中的邻点"],
                      t(
                        `$\\deg_G(${V}) = ${d}$, so its degree in $\\overline{G}$ is $${n - 1} - ${d} = ${n - 1 - d}$.`,
                        `$\\deg_G(${V}) = ${d}$，所以它在 $\\overline{G}$ 中的度为 $${n - 1} - ${d} = ${n - 1 - d}$。`,
                      ),
                    ],
                  ],
                  t(
                    `In $G$ the neighbors of $${V}$ are ${listed(near)}; the other vertices, ${listed(far)}, are its neighbors in $\\overline{G}$: $${d} + ${n - 1 - d} = ${n - 1}$ in all.`,
                    `在 $G$ 中 $${V}$ 的邻点是 ${listed(near, true)}；其余顶点 ${listed(far, true)} 是它在 $\\overline{G}$ 中的邻点：共 $${d} + ${n - 1 - d} = ${n - 1}$ 个。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Count all the pairs", "数所有顶点对"],
                      t(`$\\binom{${n}}{2} = ${total}$ pairs of vertices.`, `共 $\\binom{${n}}{2} = ${total}$ 对顶点。`),
                    ],
                    [
                      ["Remove the edges of $G$", "去掉 $G$ 的边"],
                      t(`$${total} - ${m} = ${total - m}$.`, `$${total} - ${m} = ${total - m}$。`),
                    ],
                  ],
                  t(
                    `In $\\overline{G}$ each vertex $v$ has degree $${n - 1} - \\deg_G(v)$, so its degrees add to $${n} \\cdot ${n - 1} - 2 \\cdot ${m} = ${2 * (total - m)}$, twice the $${total - m}$ edges.`,
                    `在 $\\overline{G}$ 中每个顶点 $v$ 的度为 $${n - 1} - \\deg_G(v)$，所以度数之和为 $${n} \\cdot ${n - 1} - 2 \\cdot ${m} = ${2 * (total - m)}$，正是 $${total - m}$ 条边的两倍。`,
                  ),
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
        "The subgraph induced by a set of vertices keeps those vertices and every edge with both ends among them. If $E = \\{AB, AC, BD, CD, DE\\}$, the subgraph induced by $\\{A, B, D\\}$ keeps only $AB$ and $BD$: $AC$, $CD$ and $DE$ each have an end outside the set.\n\n> **Watch out.** An edge with only one end in the set is dropped, and an edge is kept only if it is in $G$: the induced subgraph need not be complete.",
        "由一组顶点导出的子图保留这些顶点以及两端都在其中的所有边。若 $E = \\{AB, AC, BD, CD, DE\\}$，由 $\\{A, B, D\\}$ 导出的子图只保留 $AB$ 和 $BD$：$AC$、$CD$、$DE$ 都有一端在集合之外。\n\n> **注意。** 只有一端在集合中的边要去掉；而且只保留 $G$ 中原有的边：导出子图不一定是完全图。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomGraph(rng, n, rng.int(n + 1, n + 5));
        const S = rng.sample(range(0, n - 1), rng.int(3, 5)).sort((a, b) => a - b);
        const inS = new Set(S);
        const kept = g.edges.filter(([a, b]) => inS.has(a) && inS.has(b));
        const touching = g.edges.filter(([a, b]) => inS.has(a) || inS.has(b)).length;
        const m = g.edges.length;
        const set = `\\{${S.map(vx).join(", ")}\\}`;
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many edges does the subgraph induced by $\\{${S.map(vx).join(", ")}\\}$ have?`,
              `${graphIntro(g)["zh-CN"]}由 $\\{${S.map(vx).join(", ")}\\}$ 导出的子图有多少条边？`,
            ),
            answer: kept.length,
            mistakes: distinct(kept.length, [
              why(
                touching,
                "That counts the edges with at least one end in the set; both ends must be in it.",
                "那是数了至少有一端在集合中的边；两端都必须在集合中。",
              ),
              why(
                choose(S.length, 2),
                "That counts every pair in the set, as if the subgraph were complete; only the edges of $G$ are kept.",
                "那是数了集合中的所有顶点对，好像子图是完全图；只保留 $G$ 中的边。",
              ),
              why(
                kept.length + 1,
                "That is one too many: check each edge for both ends in the set.",
                "多了一条：逐条检查边的两端是否都在集合中。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Test each edge", "逐条检查边"],
                  t(`An edge is kept exactly when both of its ends lie in $${set}$.`, `一条边被保留，当且仅当它的两端都在 $${set}$ 中。`),
                ],
                [
                  ["Count the kept edges", "数保留的边"],
                  t(
                    kept.length === 0
                      ? "No edge has both ends in the set, so there are $0$."
                      : `The edges with both ends in the set are $${kept.map(edgeTex).join(", ")}$: $${kept.length}$ ${kept.length === 1 ? "edge" : "edges"}.`,
                    kept.length === 0
                      ? "没有两端都在该集合中的边，所以为 $0$。"
                      : `两端都在该集合中的边为 $${kept.map(edgeTex).join(", ")}$：共 $${kept.length}$ 条。`,
                  ),
                ],
              ],
              t(
                `Each of the other $${m - kept.length}$ edges has an end outside the set, and $${kept.length} + ${m - kept.length} = ${m}$ accounts for every edge of $G$.`,
                `其余 $${m - kept.length}$ 条边都有一端在集合之外，而 $${kept.length} + ${m - kept.length} = ${m}$ 正是 $G$ 的全部边数。`,
              ),
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

/** twoColoring colors each component alternately from its first vertex, reporting the first edge whose ends get the same color. */
function twoColoring(g: Graph): { color: number[]; conflict: readonly [number, number, number] | null } {
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
        } else if (color[w] === color[u]) return { color, conflict: [s, Math.min(u, w), Math.max(u, w)] };
      }
    }
  }
  return { color, conflict: null };
}

/** oddCycle finds a shortest cycle of odd length, listing its start again at the end. */
function oddCycle(g: Graph): number[] {
  for (let length = 3; length <= g.n; length += 2) {
    const c = cycleOf(g, length);
    if (c.length === length + 1) return c;
  }
  return [];
}

/** completeAndBipartiteGraphs counts edges of Kₙ and Kₘ,ₙ and recognizes bipartite graphs. */
export const completeAndBipartiteGraphs: TopicDef = {
  id: "complete-and-bipartite-graphs",
  title: t("Complete and Bipartite Graphs", "完全图与二部图"),
  summary: t(
    "Kₙ joins every pair of n vertices and has C(n, 2) edges. A graph is bipartite if its vertices split into two parts with every edge between the parts; Kₘ,ₙ has all mn such edges. A graph is bipartite exactly when it has no odd cycle.",
    "Kₙ 连接 n 个顶点中的每一对，有 C(n, 2) 条边。若图的顶点能分成两部分且每条边都连接两部分，则它是二部图；Kₘ,ₙ 有全部 mn 条这样的边。图是二部图当且仅当它没有奇圈。",
  ),
  intro: t(
    "A school pairs each of its $10$ teachers with each of its $40$ students for a short talk. Drawn as a graph, this is $K_{10,40}$, with $10 \\cdot 40 = 400$ edges and no edge inside either group.\n\nCheck: all $50$ people form $\\binom{50}{2} = 1225$ pairs; removing the $\\binom{10}{2} = 45$ teacher pairs and the $\\binom{40}{2} = 780$ student pairs leaves $1225 - 45 - 780 = 400$.\n\nIn this lesson we count the edges of complete and complete bipartite graphs, decide whether a graph is bipartite, and find how many edges a bipartite graph can have.",
    "一所学校让 $10$ 位老师与 $40$ 名学生两两进行简短交谈。画成图就是 $K_{10,40}$，有 $10 \\cdot 40 = 400$ 条边，两组内部都没有边。\n\n检验：$50$ 个人共组成 $\\binom{50}{2} = 1225$ 对；去掉 $\\binom{10}{2} = 45$ 对老师和 $\\binom{40}{2} = 780$ 对学生，剩下 $1225 - 45 - 780 = 400$ 对。\n\n本课我们求完全图和完全二部图的边数，判断一个图是否为二部图，并求二部图最多能有多少条边。",
  ),
  prerequisites: ["the-degree-of-a-vertex"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "edges-of-complete-and-complete-bipartite-graphs",
      figure: discreteDrawings1["complete-and-bipartite-graphs#edges-of-complete-and-complete-bipartite-graphs"],
      title: t("Counting edges", "数边"),
      explanation: t(
        "A complete graph joins every pair of vertices, while a complete bipartite graph joins every vertex on one side to every vertex on the other. The drawing shows $K_7$, with $\\frac{7 \\cdot 6}{2} = 21$ edges, and $K_{3,5}$, with $3 \\cdot 5 = 15$ edges. $K_{40}$ has $\\binom{40}{2} = \\frac{40 \\cdot 39}{2} = 780$ edges and $K_{10,13}$ has $10 \\cdot 13 = 130$ edges.\n\n> **Watch out.** In $K_n$ the product $n(n - 1)$ counts each edge from both ends, so halve it; in $K_{m,n}$ there are no edges inside a side, so do not add $\\binom{m}{2}$ or $\\binom{n}{2}$.",
        "完全图连接每一对顶点，而完全二部图把一侧的每个顶点连接到另一侧的每个顶点。图中画的是 $K_7$，有 $\\frac{7 \\cdot 6}{2} = 21$ 条边，以及 $K_{3,5}$，有 $3 \\cdot 5 = 15$ 条边。$K_{40}$ 有 $\\binom{40}{2} = \\frac{40 \\cdot 39}{2} = 780$ 条边，$K_{10,13}$ 有 $10 \\cdot 13 = 130$ 条边。\n\n> **注意。** 在 $K_n$ 中，乘积 $n(n - 1)$ 从两端各数了每条边一次，要减半；在 $K_{m,n}$ 中同一侧内部没有边，不要加上 $\\binom{m}{2}$ 或 $\\binom{n}{2}$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const n = rng.int(4, 30);
          return numberProblem({
            prompt: t(`How many edges does $K_{${n}}$ have?`, `$K_{${n}}$ 有多少条边？`),
            answer: choose(n, 2),
            mistakes: distinct(choose(n, 2), [
              why(n * (n - 1), "That counts each edge twice, once from each end; halve it.", "那是把每条边从两端各数了一次；要减半。"),
              why(n - 1, "That is the degree of one vertex, not the number of edges.", "那是一个顶点的度，不是边数。"),
              why(choose(n + 1, 2), `That is the number of edges of $K_{${n + 1}}$.`, `那是 $K_{${n + 1}}$ 的边数。`),
            ]),
            solution: walked(
              [
                [
                  ["Count the pairs", "数顶点对"],
                  t(
                    `Every pair of the $${n}$ vertices is joined by exactly one edge, so the edges are the $\\binom{${n}}{2}$ pairs.`,
                    `$${n}$ 个顶点中每两个之间恰有一条边，所以边数就是 $\\binom{${n}}{2}$ 个顶点对。`,
                  ),
                ],
                [
                  ["Compute", "计算"],
                  t(
                    `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${choose(n, 2)}$.`,
                    `$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${choose(n, 2)}$。`,
                  ),
                ],
              ],
              t(
                `Each vertex has degree $${n - 1}$, so the degrees add to $${n} \\cdot ${n - 1} = ${n * (n - 1)} = 2 \\cdot ${choose(n, 2)}$.`,
                `每个顶点的度为 $${n - 1}$，所以度数之和为 $${n} \\cdot ${n - 1} = ${n * (n - 1)} = 2 \\cdot ${choose(n, 2)}$。`,
              ),
            ),
          });
        }
        const m = rng.int(2, 9);
        const n = rng.int(m, 12);
        return numberProblem({
          prompt: t(`How many edges does $K_{${m},${n}}$ have?`, `$K_{${m},${n}}$ 有多少条边？`),
          answer: m * n,
          mistakes: distinct(m * n, [
            why(m + n, "That is the number of vertices, not the number of edges.", "那是顶点数，不是边数。"),
            why(
              choose(m + n, 2),
              `That counts every pair of the $${m + n}$ vertices, as in $K_{${m + n}}$; no edge joins two vertices on the same side.`,
              `那是数了 $${m + n}$ 个顶点的所有顶点对，就像 $K_{${m + n}}$；同侧的两个顶点之间没有边。`,
            ),
            why(
              choose(m, 2) + choose(n, 2),
              "That counts the pairs inside each side, which are exactly the pairs with no edge.",
              "那是数了每一侧内部的顶点对，而这些恰好是没有边的顶点对。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the edges at one side", "数一侧顶点的边"],
                t(
                  `Each of the $${m}$ vertices on one side is joined to all $${n}$ on the other, and to nothing on its own side.`,
                  `一侧的 $${m}$ 个顶点各与另一侧的全部 $${n}$ 个顶点相连，与本侧顶点都不相连。`,
                ),
              ],
              [["Multiply", "相乘"], t(`$${m} \\cdot ${n} = ${m * n}$.`, `$${m} \\cdot ${n} = ${m * n}$。`)],
            ],
            t(
              `The degrees add to $${m} \\cdot ${n} + ${n} \\cdot ${m} = ${2 * m * n} = 2 \\cdot ${m * n}$, twice the number of edges.`,
              `度数之和为 $${m} \\cdot ${n} + ${n} \\cdot ${m} = ${2 * m * n} = 2 \\cdot ${m * n}$，正是边数的两倍。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-bipartite-graphs",
      figure: discreteDrawings1["complete-and-bipartite-graphs#recognizing-bipartite-graphs"],
      title: t("Recognizing bipartite graphs", "判断二部图"),
      explanation: t(
        "Color a vertex red, its neighbors blue, their neighbors red, and so on. If two adjacent vertices get the same color, the graph has an odd cycle and is not bipartite; otherwise the colors give the two parts. In the drawing the marks $a$ and $b$ alternate around the $6$-cycle with no clash, so it is bipartite, while on the $5$-cycle one edge joins two vertices marked $a$, so it is not. The square $A - B - C - D - A$ colors as $A, C$ red and $B, D$ blue, so it is bipartite; adding the edge $AC$ joins two red vertices and creates the triangle $A - B - C - A$, so the new graph is not.\n\n> **Watch out.** A cycle alone does not rule a graph out: only a cycle of odd length does. The square has a cycle and is still bipartite.",
        "把一个顶点涂红，它的邻点涂蓝，邻点的邻点涂红，依此类推。若两个相邻顶点同色，图中有奇圈，不是二部图；否则两种颜色给出两个部分。图中 $6$-圈上的标记 $a$ 与 $b$ 交替出现、没有冲突，所以是二部图；而 $5$-圈上有一条边连接两个标为 $a$ 的顶点，所以不是。正方形 $A - B - C - D - A$ 可涂成 $A, C$ 红、$B, D$ 蓝，所以是二部图；加上边 $AC$ 后它连接了两个红色顶点，并形成三角形 $A - B - C - A$，所以新图不是二部图。\n\n> **注意。** 仅仅有圈并不能排除二部图：只有长度为奇数的圈才能。正方形有圈，却仍是二部图。",
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
        const { color, conflict } = twoColoring(g);
        const red = range(0, n - 1).filter((v) => color[v] === 0);
        const blue = range(0, n - 1).filter((v) => color[v] === 1);
        const cycle = oddCycle(g);
        const set = (vs: readonly number[]) => `\\{${vs.map(vx).join(", ")}\\}`;
        return withFigure(
          verdictChoice(rng, {
            prompt: t(`${graphIntro(g).en} Is $G$ bipartite?`, `${graphIntro(g)["zh-CN"]}$G$ 是二部图吗？`),
            holds: yes,
            yes: t("two colors can alternate along every edge", "沿每条边都能交替涂两种颜色"),
            no: t("it contains a cycle of odd length", "它含有长度为奇数的圈"),
            yesWrong: t("every vertex has at least one neighbor", "每个顶点都至少有一个邻点"),
            noWrong: t("it contains a cycle", "它含有圈"),
            solution:
              conflict === null
                ? walked(
                    [
                      [
                        ["Color alternately", "交替涂色"],
                        t(
                          `Coloring each new neighbor the opposite color gives red $${set(red)}$ and blue $${set(blue)}$.`,
                          `把每个新邻点涂成相反的颜色，得到红色 $${set(red)}$ 和蓝色 $${set(blue)}$。`,
                        ),
                      ],
                      [
                        ["Look for a clash", "寻找冲突"],
                        t(
                          "No edge has both ends the same color, so the two colors are the two parts and $G$ is bipartite.",
                          "没有一条边的两端同色，所以两种颜色就是两个部分，$G$ 是二部图。",
                        ),
                      ],
                    ],
                    t(
                      `Each of the edges $${g.edges.map(edgeTex).join(", ")}$ has exactly one end in $${set(red)}$.`,
                      `边 $${g.edges.map(edgeTex).join(", ")}$ 中的每一条都恰有一端在 $${set(red)}$ 中。`,
                    ),
                  )
                : walked(
                    [
                      [
                        ["Color alternately", "交替涂色"],
                        t(
                          `Starting with $${vx(conflict[0])}$ red and coloring each new neighbor the opposite color, every color is forced, and the edge $${vx(conflict[1])}${vx(conflict[2])}$ gets the same color at both ends.`,
                          `从 $${vx(conflict[0])}$ 涂红开始，把每个新邻点涂成相反的颜色，每种颜色都是被迫的，而边 $${vx(conflict[1])}${vx(conflict[2])}$ 的两端同色。`,
                        ),
                      ],
                      [
                        ["Conclude", "得出结论"],
                        t(
                          "So no way of splitting the vertices into two parts keeps every edge between them: $G$ is not bipartite.",
                          "所以无论怎样把顶点分成两部分，都不能让每条边都连接两部分：$G$ 不是二部图。",
                        ),
                      ],
                    ],
                    t(
                      `The cycle $${cycle.map((v) => vx(v)).join(" - ")}$ has odd length $${cycle.length - 1}$, and colors cannot alternate around an odd cycle.`,
                      `圈 $${cycle.map((v) => vx(v)).join(" - ")}$ 的长度为奇数 $${cycle.length - 1}$，而在奇圈上颜色无法交替。`,
                    ),
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
  intro: t(
    "A $10$-regular graph on $22$ vertices has $22 \\cdot 10 = 220$ edge ends, so it has $\\frac{220}{2} = 110$ edges. Its complement is $11$-regular, since each vertex has $21$ possible neighbors, and has $\\frac{22 \\cdot 11}{2} = 121$ edges.\n\nCheck: $110 + 121 = 231 = \\binom{22}{2}$, so the graph and its complement together use every pair of vertices exactly once.\n\nIn this lesson we count the edges of regular graphs, decide which regular graphs exist, and find the number of vertices from the edges and the degree.",
    "$22$ 个顶点的 $10$-正则图共有 $22 \\cdot 10 = 220$ 个边端点，所以有 $\\frac{220}{2} = 110$ 条边。它的补图是 $11$-正则的，因为每个顶点有 $21$ 个可能的邻点，补图有 $\\frac{22 \\cdot 11}{2} = 121$ 条边。\n\n检验：$110 + 121 = 231 = \\binom{22}{2}$，所以这个图与它的补图合起来恰好把每对顶点各用一次。\n\n本课我们求正则图的边数，判断哪些正则图存在，并由边数和度数求顶点数。",
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
        "In an $r$-regular graph every vertex has degree $r$, so $n$ vertices have $nr$ edge ends and, since each edge has two ends, $\\frac{nr}{2}$ edges. The graph drawn is $3$-regular on $6$ vertices, so it has $\\frac{6 \\cdot 3}{2} = 9$ edges. A $12$-regular graph on $25$ vertices has $\\frac{25 \\cdot 12}{2} = 150$ edges. Conversely a regular graph on $30$ vertices with $135$ edges is $\\frac{2 \\cdot 135}{30} = 9$-regular.\n\n> **Watch out.** $nr$ counts edge ends, two for each edge, so halve it to get the edges; going back, double the edges before dividing by the number of vertices.",
        "在 $r$-正则图中每个顶点的度都是 $r$，所以 $n$ 个顶点共有 $nr$ 个边端点；每条边有两个端点，所以共有 $\\frac{nr}{2}$ 条边。图中的图是 $6$ 个顶点的 $3$-正则图，所以有 $\\frac{6 \\cdot 3}{2} = 9$ 条边。$25$ 个顶点的 $12$-正则图有 $\\frac{25 \\cdot 12}{2} = 150$ 条边。反过来，$30$ 个顶点、$135$ 条边的正则图是 $\\frac{2 \\cdot 135}{30} = 9$-正则的。\n\n> **注意。** $nr$ 数的是边端点，每条边有两个，所以要减半才得到边数；反过来求度数时，要先把边数加倍，再除以顶点数。",
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
        const c = n - 1 - r;
        const cm = (n * c) / 2;
        if (rng.bool())
          return numberProblem({
            prompt: t(
              `How many edges does ${article(r)} $${r}$-regular graph on $${n}$ vertices have?`,
              `$${n}$ 个顶点的 $${r}$-正则图有多少条边？`,
            ),
            answer: m,
            mistakes: distinct(m, [
              why(n * r, "That counts edge ends, two for each edge; halve it.", "那是数了边端点，每条边有两个；要减半。"),
              why(
                n + r,
                "That adds the number of vertices and the degree; multiply them and halve.",
                "那是把顶点数与度数相加；应当相乘再减半。",
              ),
              why(m + n, "That is too many: the edges are half the number of edge ends.", "太多了：边数是边端点数的一半。"),
            ]),
            solution: walked(
              [
                [
                  ["Count the edge ends", "数边端点"],
                  t(
                    `$${n}$ vertices of degree $${r}$ give $${n} \\cdot ${r} = ${n * r}$ edge ends.`,
                    `$${n}$ 个度为 $${r}$ 的顶点共有 $${n} \\cdot ${r} = ${n * r}$ 个边端点。`,
                  ),
                ],
                [
                  ["Halve", "减半"],
                  t(`Each edge has two ends: $\\frac{${n * r}}{2} = ${m}$.`, `每条边有两个端点：$\\frac{${n * r}}{2} = ${m}$。`),
                ],
              ],
              c === 0
                ? t(
                    `Here $${r} = ${n} - 1$, so the graph is $K_{${n}}$, and indeed $\\binom{${n}}{2} = ${m}$.`,
                    `这里 $${r} = ${n} - 1$，所以这个图就是 $K_{${n}}$，而 $\\binom{${n}}{2} = ${m}$ 正相符。`,
                  )
                : t(
                    `The complement is $${c}$-regular with $\\frac{${times(n, c)}}{2} = ${cm}$ edges, and $${m} + ${cm} = ${m + cm} = \\binom{${n}}{2}$.`,
                    `补图是 $${c}$-正则的，有 $\\frac{${times(n, c)}}{2} = ${cm}$ 条边，而 $${m} + ${cm} = ${m + cm} = \\binom{${n}}{2}$。`,
                  ),
            ),
          });
        return numberProblem({
          prompt: t(
            `A regular graph has $${n}$ vertices and $${m}$ edges. What is the degree of each vertex?`,
            `一个正则图有 $${n}$ 个顶点、$${m}$ 条边。每个顶点的度是多少？`,
          ),
          answer: r,
          mistakes: distinct(
            r,
            [
              why(
                r / 2,
                "That divides the edges by the vertices; each edge has two ends, so double the edges first.",
                "那是用边数除以顶点数；每条边有两个端点，要先把边数加倍。",
              ),
              why(
                2 * r,
                "That doubles twice; the degree sum is twice the number of edges, once.",
                "那是加倍了两次；度数之和只是边数的两倍。",
              ),
              why(
                n - 1,
                `That is the degree in $K_{${n}}$, which would have $${choose(n, 2)}$ edges.`,
                `那是 $K_{${n}}$ 中的度，它会有 $${choose(n, 2)}$ 条边。`,
              ),
            ].filter((w) => Number.isInteger(w.value)),
          ),
          solution: walked(
            [
              [
                ["Count the edge ends", "数边端点"],
                t(`$${m}$ edges have $2 \\cdot ${m} = ${2 * m}$ ends.`, `$${m}$ 条边共有 $2 \\cdot ${m} = ${2 * m}$ 个端点。`),
              ],
              [
                ["Share them among the vertices", "平均分给各顶点"],
                t(
                  `Each of the $${n}$ vertices has $r = \\frac{${2 * m}}{${n}} = ${r}$.`,
                  `$${n}$ 个顶点各有 $r = \\frac{${2 * m}}{${n}} = ${r}$。`,
                ),
              ],
            ],
            t(
              `$${n} \\cdot ${r} = ${n * r} = 2 \\cdot ${m}$, and $${r} \\le ${n - 1}$, so such a simple graph can exist.`,
              `$${n} \\cdot ${r} = ${n * r} = 2 \\cdot ${m}$，且 $${r} \\le ${n - 1}$，所以这样的简单图可以存在。`,
            ),
          ),
        });
      },
    },
    {
      id: "existence-of-regular-graphs",
      figure: discreteDrawings1["regular-graphs#existence-of-regular-graphs"],
      title: t("Which regular graphs exist", "哪些正则图存在"),
      explanation: t(
        "A simple $r$-regular graph on $n$ vertices exists exactly when $nr$ is even and $r \\le n - 1$. The drawing shows a $3$-regular graph on $8$ vertices, whose degrees add to $8 \\cdot 3 = 24$; on $7$ vertices the sum $7 \\cdot 3 = 21$ would be odd, so no such graph exists. There is no $5$-regular graph on $17$ vertices, because $17 \\cdot 5 = 85$ is odd. There is a $4$-regular simple graph on $17$ vertices, but no $17$-regular simple graph on $17$ vertices, since a vertex has only $16$ possible neighbors.\n\n> **Watch out.** Check both conditions: an even product $nr$ is not enough if $r > n - 1$, and a small degree is not enough if $nr$ is odd.",
        "$n$ 个顶点的 $r$-正则简单图存在，当且仅当 $nr$ 为偶数且 $r \\le n - 1$。图中是 $8$ 个顶点的 $3$-正则图，度数之和为 $8 \\cdot 3 = 24$；若只有 $7$ 个顶点，和 $7 \\cdot 3 = 21$ 是奇数，这样的图不存在。不存在 $17$ 个顶点的 $5$-正则图，因为 $17 \\cdot 5 = 85$ 是奇数。存在 $17$ 个顶点的 $4$-正则简单图，但不存在 $17$ 个顶点的 $17$-正则简单图，因为一个顶点只有 $16$ 个可能的邻点。\n\n> **注意。** 两个条件都要检查：若 $r > n - 1$，乘积 $nr$ 为偶数也不够；若 $nr$ 是奇数，度数小也不够。",
      ),
      generate(rng) {
        const n = rng.int(4, 15);
        const r = rng.int(2, n + 1);
        const odd = (n * r) % 2 === 1;
        const tooBig = r > n - 1;
        const yes = !odd && !tooBig;
        const half = Math.floor(r / 2);
        const parity = odd
          ? t(
              `The degrees would add to $${n} \\cdot ${r} = ${n * r}$, which is odd, but they must add to twice the number of edges.`,
              `度数之和将为 $${n} \\cdot ${r} = ${n * r}$，是奇数，但它必须等于边数的两倍。`,
            )
          : t(
              `The degrees would add to $${n} \\cdot ${r} = ${n * r}$, which is even, as twice the number of edges must be.`,
              `度数之和将为 $${n} \\cdot ${r} = ${n * r}$，是偶数，与边数的两倍相符。`,
            );
        const bound = tooBig
          ? t(
              `Each vertex has only $${n - 1}$ possible neighbors, fewer than $${r}$.`,
              `每个顶点只有 $${n - 1}$ 个可能的邻点，少于 $${r}$。`,
            )
          : t(
              `Each vertex has $${n - 1}$ possible neighbors, and $${r} \\le ${n - 1}$.`,
              `每个顶点有 $${n - 1}$ 个可能的邻点，且 $${r} \\le ${n - 1}$。`,
            );
        const reason = tooBig
          ? t(
              `No: a vertex has only $${n - 1}$ possible neighbors, fewer than $${r}$.`,
              `不存在：一个顶点只有 $${n - 1}$ 个可能的邻点，少于 $${r}$。`,
            )
          : t(`No: the degrees would add to $${n * r}$, which is odd.`, `不存在：度数之和将为 $${n * r}$，是奇数。`);
        const nearest =
          half === 1 ? t("the nearest vertex", "最近的一个顶点") : t(`the $${half}$ nearest vertices`, `最近的 $${half}$ 个顶点`);
        return withMistakes(
          choiceProblem({
            prompt: t(`Is there a simple $${r}$-regular graph on $${n}$ vertices?`, `是否存在 $${n}$ 个顶点的 $${r}$-正则简单图？`),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: walked(
              [
                [["Check the parity", "检查奇偶性"], parity],
                [["Check the degree bound", "检查度数上界"], bound],
              ],
              yes
                ? t(
                    `Both conditions hold. Arrange the vertices in a circle and join each to ${nearest.en} on both sides${r % 2 === 1 ? " and to the opposite one" : ""}: every vertex then has exactly $${r}$ neighbors, so such a graph exists.`,
                    `两个条件都满足。把顶点排成一圈，把每个顶点与两侧${nearest["zh-CN"]}相连${r % 2 === 1 ? "，再与正对面的顶点相连" : ""}：每个顶点恰有 $${r}$ 个邻点，所以这样的图存在。`,
                  )
                : tooBig
                  ? t(
                      `Even $K_{${n}}$, which has every possible edge, is only $${n - 1}$-regular, so no simple graph reaches degree $${r}$.`,
                      `即使是拥有所有可能边的 $K_{${n}}$ 也只是 $${n - 1}$-正则的，所以没有简单图能达到度 $${r}$。`,
                    )
                  : t(
                      `All $${n}$ vertices would have odd degree, an odd number of them, while the number of odd-degree vertices is always even; so no such graph exists.`,
                      `$${n}$ 个顶点的度都是奇数，奇度顶点的个数是奇数，而奇度顶点的个数总是偶数；所以这样的图不存在。`,
                    ),
            ),
          }),
          yes
            ? [
                {
                  response: yesNo[1]!.en,
                  why: t(
                    `Both tests pass: $${n * r}$ is even and $${r} \\le ${n - 1}$, and the circle construction gives such a graph.`,
                    `两项检验都通过：$${n * r}$ 是偶数且 $${r} \\le ${n - 1}$，而排成一圈的构造就给出这样的图。`,
                  ),
                },
              ]
            : [{ response: yesNo[0]!.en, why: reason }],
        );
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
  intro: t(
    "A soccer ball is stitched from $12$ pentagons and $20$ hexagons. As a graph drawn on the sphere it has $60$ corners and $90$ seams, and Euler's formula gives $f = 2 - 60 + 90 = 32$ faces, exactly the $12 + 20$ patches.\n\nCheck: each seam borders two patches, and $12 \\cdot 5 + 20 \\cdot 6 = 180 = 2 \\cdot 90$.\n\nIn this lesson we use Euler's formula $v - e + f = 2$, bound the number of edges of a planar graph, and count the faces of regular planar graphs.",
    "足球由 $12$ 块五边形和 $20$ 块六边形缝成。把它看作画在球面上的图，有 $60$ 个角点和 $90$ 条缝线，欧拉公式给出 $f = 2 - 60 + 90 = 32$ 个面，恰好是 $12 + 20$ 块皮。\n\n检验：每条缝线与两块皮相邻，而 $12 \\cdot 5 + 20 \\cdot 6 = 180 = 2 \\cdot 90$。\n\n本课我们使用欧拉公式 $v - e + f = 2$，给出平面图边数的上界，并求正则平面图的面数。",
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
        "A connected graph drawn in the plane without crossings satisfies Euler's formula $v - e + f = 2$, where $f$ counts the faces, including the unbounded outer face. The graph drawn has $6$ vertices and $9$ edges, so it has $f = 2 - 6 + 9 = 5$ faces. A connected planar graph with $30$ vertices and $50$ edges divides the plane into $f = 2 - 30 + 50 = 22$ faces.\n\n> **Watch out.** The outer face counts as a face, and the $2$ stays on its own side: solve $v - e + f = 2$ for the unknown, keeping track of the signs.",
        "在平面上画成没有交叉的连通图满足欧拉公式 $v - e + f = 2$，其中 $f$ 是面的个数，包括无界的外部面。图中的图有 $6$ 个顶点、$9$ 条边，所以有 $f = 2 - 6 + 9 = 5$ 个面。有 $30$ 个顶点、$50$ 条边的连通平面图把平面分成 $f = 2 - 30 + 50 = 22$ 个面。\n\n> **注意。** 外部面也算一个面，而 $2$ 留在等号的一边：从 $v - e + f = 2$ 解出未知量时要注意符号。",
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
        const letter = ["f", "e", "v"][ask]!;
        return numberProblem({
          prompt: t(
            `A connected planar graph is drawn without crossings. It has ${given.en}. How many ${name.en} does the drawing have${ask === 0 ? ", counting the outer face" : ""}?`,
            `一个连通平面图画成无交叉的样子，它有${given["zh-CN"]}。这个画法有多少${ask === 1 ? "条" : "个"}${name["zh-CN"]}${ask === 0 ? "（含外部面）" : ""}？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              value + 2,
              "That moves the $2$ to the wrong side; solve $v - e + f = 2$ again.",
              "那是把 $2$ 移错了边；重新解 $v - e + f = 2$。",
            ),
            why(
              value - 2,
              "That leaves out or misplaces the $2$; solve $v - e + f = 2$ again.",
              "那是漏掉或放错了 $2$；重新解 $v - e + f = 2$。",
            ),
            why(
              value - 1,
              ask === 0
                ? "That leaves out the outer face, which counts as a face."
                : "That is one too few: substitute into $v - e + f = 2$ again.",
              ask === 0 ? "那是漏掉了外部面，它也算一个面。" : "少了一：重新代入 $v - e + f = 2$。",
            ),
            why(value + 1, "That is one too many: substitute into $v - e + f = 2$ again.", "多了一：重新代入 $v - e + f = 2$。"),
          ]),
          solution: walked(
            [
              [
                ["Write Euler's formula", "写出欧拉公式"],
                t("For a connected planar drawing, $v - e + f = 2$.", "对连通的平面画法，$v - e + f = 2$。"),
              ],
              [[`Solve for $${letter}$`, `解出 $${letter}$`], t(`$${work} = ${value}$.`, `$${work} = ${value}$。`)],
            ],
            t(`$${v} - ${e} + ${f} = 2$, as Euler's formula requires.`, `$${v} - ${e} + ${f} = 2$，符合欧拉公式。`),
          ),
        });
      },
    },
    {
      id: "edge-bounds-for-planar-graphs",
      figure: discreteDrawings1["planar-graphs#edge-bounds-for-planar-graphs"],
      title: t("Edge bounds", "边数上界"),
      explanation: t(
        "In a simple planar drawing each face is bounded by at least $3$ edges and each edge borders at most $2$ faces, so $3f \\le 2e$; with Euler's formula this gives $e \\le 3v - 6$. With no triangles each face needs $4$ edges, and $e \\le 2v - 4$. The drawing shows $K_5$: its $10$ edges exceed $3 \\cdot 5 - 6 = 9$, so it cannot be drawn without crossings. A simple planar graph on $50$ vertices has at most $3 \\cdot 50 - 6 = 144$ edges, or $2 \\cdot 50 - 4 = 96$ if it has no triangles; so a simple graph on $50$ vertices with $150$ edges is not planar.\n\n> **Watch out.** Use $3v - 6$ only when triangles are allowed and $2v - 4$ only when they are not; and the bound is far below $\\binom{v}{2}$, the edges of a complete graph.",
        "在简单平面画法中，每个面至少由 $3$ 条边围成，每条边至多与 $2$ 个面相邻，所以 $3f \\le 2e$；结合欧拉公式得 $e \\le 3v - 6$。若没有三角形，每个面至少需要 $4$ 条边，得 $e \\le 2v - 4$。图中是 $K_5$：它的 $10$ 条边超过了 $3 \\cdot 5 - 6 = 9$，所以无法画成没有交叉。$50$ 个顶点的简单平面图至多有 $3 \\cdot 50 - 6 = 144$ 条边；若无三角形，则至多 $2 \\cdot 50 - 4 = 96$ 条；所以 $50$ 个顶点、$150$ 条边的简单图不是平面图。\n\n> **注意。** 允许有三角形时才用 $3v - 6$，没有三角形时才用 $2v - 4$；而且这个上界远小于完全图的边数 $\\binom{v}{2}$。",
      ),
      generate(rng) {
        const v = rng.int(3, 40);
        const noTriangles = rng.bool();
        const value = noTriangles ? 2 * v - 4 : 3 * v - 6;
        const side = noTriangles ? 4 : 3;
        const faces = 2 - v + value;
        return numberProblem({
          prompt: noTriangles
            ? t(
                `A simple planar graph on $${v}$ vertices has no triangles. At most how many edges can it have?`,
                `一个 $${v}$ 个顶点的简单平面图没有三角形。它至多有多少条边？`,
              )
            : t(`At most how many edges can a simple planar graph on $${v}$ vertices have?`, `$${v}$ 个顶点的简单平面图至多有多少条边？`),
          answer: value,
          mistakes: distinct(
            value,
            noTriangles
              ? [
                  why(
                    3 * v - 6,
                    "That is the bound when triangles are allowed; without them each face needs $4$ edges.",
                    "那是允许有三角形时的上界；没有三角形时每个面至少需要 $4$ 条边。",
                  ),
                  why(2 * v - 2, "That drops the wrong constant: the bound is $2v - 4$.", "常数用错了：上界是 $2v - 4$。"),
                  why(
                    choose(v, 2),
                    "That counts every pair of vertices; a planar graph has far fewer edges.",
                    "那是数了所有顶点对；平面图的边要少得多。",
                  ),
                ]
              : [
                  why(
                    2 * v - 4,
                    "That is the bound for graphs with no triangles; here triangles are allowed.",
                    "那是没有三角形时的上界；这里允许有三角形。",
                  ),
                  why(3 * v - 3, "That drops the wrong constant: the bound is $3v - 6$.", "常数用错了：上界是 $3v - 6$。"),
                  why(
                    choose(v, 2),
                    "That counts every pair of vertices; a planar graph has far fewer edges.",
                    "那是数了所有顶点对；平面图的边要少得多。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Count face boundaries", "数面的边界"],
                t(
                  `Each face is bounded by at least $${side}$ edges${noTriangles ? ", as there are no triangles" : ""}, and each edge borders at most $2$ faces, so $${side}f \\le 2e$.`,
                  `每个面至少由 $${side}$ 条边围成${noTriangles ? "（因为没有三角形）" : ""}，每条边至多与 $2$ 个面相邻，所以 $${side}f \\le 2e$。`,
                ),
              ],
              [
                ["Combine with Euler's formula", "结合欧拉公式"],
                t(
                  `Substituting $f = 2 - v + e$ gives $e \\le ${noTriangles ? "2v - 4" : "3v - 6"} = ${value}$.`,
                  `代入 $f = 2 - v + e$，得 $e \\le ${noTriangles ? "2v - 4" : "3v - 6"} = ${value}$。`,
                ),
              ],
            ],
            t(
              `At $e = ${value}$ a connected drawing has $f = 2 - ${v} + ${value} = ${faces}$ faces, and $${chain(times(side, faces), `${side * faces}`, `2 \\cdot ${value}`)}$: every face then has exactly $${side}$ sides, so the bound cannot be pushed higher.`,
              `当 $e = ${value}$ 时，连通画法有 $f = 2 - ${v} + ${value} = ${faces}$ 个面，且 $${chain(times(side, faces), `${side * faces}`, `2 \\cdot ${value}`)}$：此时每个面恰有 $${side}$ 条边，所以上界不能再提高。`,
            ),
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
  intro: t(
    "In $K_{12}$ every $3$ vertices form a triangle, so it has $\\binom{12}{3} = 220$ cycles of length $3$.\n\nCheck: there are $12 \\cdot 11 \\cdot 10 = 1320$ ordered lists of $3$ distinct vertices, and each triangle appears as $6$ of them, from $3$ starting points in $2$ directions: $\\frac{1320}{6} = 220$.\n\nIn this lesson we find shortest cycles, count the cycles of a complete graph, and count the $4$-cycles of a complete bipartite graph.",
    "在 $K_{12}$ 中任意 $3$ 个顶点都构成三角形，所以它有 $\\binom{12}{3} = 220$ 个长度为 $3$ 的圈。\n\n检验：$3$ 个不同顶点的有序排列有 $12 \\cdot 11 \\cdot 10 = 1320$ 个，每个三角形对应其中 $6$ 个（$3$ 个起点、$2$ 个方向）：$\\frac{1320}{6} = 220$。\n\n本课我们求最短圈，数完全图中的圈，并数完全二部图中长度为 $4$ 的圈。",
  ),
  prerequisites: ["walks-trails-paths-and-distances"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "shortest-cycles",
      figure: discreteDrawings1["cycles-in-graphs#shortest-cycles"],
      title: t("Shortest cycles", "最短圈"),
      explanation: t(
        "To find a shortest cycle, look for triangles first, then cycles of length $4$, and so on. In the drawing, with edges $AB, BC, CD, DA, AE, EC$, every edge joins one of $A, C$ to one of $B, D, E$, so there is no triangle, and $A - B - C - D - A$ is a shortest cycle, of length $4$. The square with $E = \\{AB, BC, CD, DA\\}$ has no triangle, so its shortest cycle is $A - B - C - D - A$, of length $4$; adding the edge $AC$ creates the triangle $A - B - C - A$, and the shortest length drops to $3$.\n\n> **Watch out.** A cycle needs at least $3$ edges and may not repeat a vertex before returning to its start, so going along an edge and straight back is not a cycle.",
        "求最短圈时，先找三角形，再找长度为 $4$ 的圈，依此类推。图中的边为 $AB, BC, CD, DA, AE, EC$，每条边都连接 $A, C$ 之一与 $B, D, E$ 之一，所以没有三角形，$A - B - C - D - A$ 是一个最短圈，长度为 $4$。边为 $E = \\{AB, BC, CD, DA\\}$ 的正方形没有三角形，所以最短圈是 $A - B - C - D - A$，长度为 $4$；加上边 $AC$ 后形成三角形 $A - B - C - A$，最短长度降为 $3$。\n\n> **注意。** 圈至少要有 $3$ 条边，回到起点之前不能重复顶点，所以沿一条边走过去再原路返回不是圈。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const g = randomConnected(rng, n, rng.int(1, 2));
        const gi = girth(g);
        const cycle = cycleOf(g, gi);
        const along = cycle.slice(1).map((v, i) => edgeTex([Math.min(cycle[i]!, v), Math.max(cycle[i]!, v)]));
        const shorter = range(3, gi - 1);
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} What is the length of a shortest cycle in $G$?`,
              `${graphIntro(g)["zh-CN"]}$G$ 中最短圈的长度是多少？`,
            ),
            answer: gi,
            mistakes: distinct(gi, [
              why(
                3,
                "That assumes a triangle; check whether any three vertices are joined to each other.",
                "那是假设有三角形；检查是否有三个顶点两两相连。",
              ),
              why(gi - 1, `That is too short: $G$ has no cycle of length $${gi - 1}$.`, `太短了：$G$ 中没有长度为 $${gi - 1}$ 的圈。`),
              why(gi + 1, `That is not the shortest: $${cycleTex(g, gi)}$ is shorter.`, `那不是最短的：$${cycleTex(g, gi)}$ 更短。`),
              why(
                n,
                "That is the number of vertices; a shortest cycle need not pass through all of them.",
                "那是顶点数；最短圈不一定经过所有顶点。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Rule out shorter cycles", "排除更短的圈"],
                  t(
                    shorter.length === 0
                      ? "No cycle is shorter than a triangle, so look for triangles first."
                      : `$G$ has no cycle of length ${shorter.map((k) => `$${k}$`).join(" or ")}: ${gi === 4 ? "no two neighbors of a vertex are adjacent" : "no short loop of edges returns to its start"}.`,
                    shorter.length === 0
                      ? "没有比三角形更短的圈，所以先找三角形。"
                      : `$G$ 中没有长度为 ${shorter.map((k) => `$${k}$`).join(" 或 ")} 的圈：${gi === 4 ? "任一顶点的两个邻点都不相邻" : "没有一圈短的边能回到起点"}。`,
                  ),
                ],
                [
                  ["Find a shortest cycle", "找出一个最短圈"],
                  t(`$${cycleTex(g, gi)}$ is a cycle of length $${gi}$.`, `$${cycleTex(g, gi)}$ 是长度为 $${gi}$ 的圈。`),
                ],
              ],
              t(
                `Its edges $${along.join(", ")}$ are all edges of $G$, and its $${gi}$ vertices are distinct.`,
                `它的边 $${along.join(", ")}$ 都是 $G$ 的边，而且它的 $${gi}$ 个顶点互不相同。`,
              ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "counting-cycles-in-complete-graphs",
      figure: discreteDrawings1["cycles-in-graphs#counting-cycles-in-complete-graphs"],
      title: t("Cycles in complete graphs", "完全图中的圈"),
      explanation: t(
        "In the drawing, $K_5$ has $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$ ordered choices of $4$ vertices, and the highlighted $4$-cycle arises from $4$ starting points and $2$ directions, so there are $\\frac{120}{8} = 15$ four-cycles. In $K_{12}$, an ordered choice of $5$ vertices gives $12 \\cdot 11 \\cdot 10 \\cdot 9 \\cdot 8 = 95040$ sequences, and each $5$-cycle arises from $5$ starting points and $2$ directions: $\\frac{95040}{10} = 9504$ cycles.\n\n> **Watch out.** Divide by both the $k$ starting points and the $2$ directions; and a set of $k$ vertices carries more than one cycle once $k \\ge 4$, so $\\binom{n}{k}$ alone is too small.",
        "图中的 $K_5$ 有序选取 $4$ 个顶点有 $5 \\cdot 4 \\cdot 3 \\cdot 2 = 120$ 种，突出显示的 $4$-圈对应 $4$ 个起点和 $2$ 个方向，所以共有 $\\frac{120}{8} = 15$ 个 $4$-圈。在 $K_{12}$ 中，有序选取 $5$ 个顶点有 $12 \\cdot 11 \\cdot 10 \\cdot 9 \\cdot 8 = 95040$ 个序列，每个 $5$-圈对应 $5$ 个起点和 $2$ 个方向：$\\frac{95040}{10} = 9504$ 个圈。\n\n> **注意。** 既要除以 $k$ 个起点，也要除以 $2$ 个方向；而当 $k \\ge 4$ 时，一组 $k$ 个顶点上不止一个圈，所以只算 $\\binom{n}{k}$ 太少了。",
      ),
      generate(rng) {
        const n = rng.int(4, 10);
        const k = rng.int(3, n);
        const seqs = factorial(n) / factorial(n - k);
        const value = seqs / (2 * k);
        const sets = choose(n, k);
        const orders = factorial(k - 1) / 2;
        return numberProblem({
          prompt: t(`How many cycles of length $${k}$ does $K_{${n}}$ have?`, `$K_{${n}}$ 中长度为 $${k}$ 的圈有多少个？`),
          answer: value,
          mistakes: distinct(value, [
            why(seqs / k, "That divides out the starting points but not the $2$ directions.", "那是除掉了起点，却没有除掉 $2$ 个方向。"),
            why(
              seqs,
              "That counts ordered sequences; each cycle appears many times among them.",
              "那是数了有序序列；每个圈在其中出现了多次。",
            ),
            why(
              sets,
              `That counts sets of $${k}$ vertices; one set can be joined into several cycles.`,
              `那是数了 $${k}$ 个顶点的集合；一个集合可以连成多个圈。`,
            ),
            why(
              seqs / 2,
              `That divides out the $2$ directions but not the $${k}$ starting points.`,
              `那是除掉了 $2$ 个方向，却没有除掉 $${k}$ 个起点。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count ordered sequences", "数有序序列"],
                t(
                  `Choosing $${k}$ distinct vertices in order gives $\\frac{${n}!}{${n - k}!} = ${seqs}$ sequences.`,
                  `按顺序选取 $${k}$ 个不同顶点，有 $\\frac{${n}!}{${n - k}!} = ${seqs}$ 个序列。`,
                ),
              ],
              [
                ["Divide out the repeats", "除去重复"],
                t(
                  `Each cycle arises from $${k}$ starting points in $2$ directions: $\\frac{${seqs}}{${2 * k}} = ${value}$.`,
                  `每个圈对应 $${k}$ 个起点和 $2$ 个方向：$\\frac{${seqs}}{${2 * k}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Choosing the vertex set first: $\\binom{${n}}{${k}}$ sets, each joined into $\\frac{${k - 1}!}{2}$ cycles, and $${chain(`\\binom{${n}}{${k}} \\cdot \\frac{${k - 1}!}{2}`, times(sets, orders), `${value}`)}$.`,
              `先选顶点集：共 $\\binom{${n}}{${k}}$ 个集合，每个可连成 $\\frac{${k - 1}!}{2}$ 个圈，而 $${chain(`\\binom{${n}}{${k}} \\cdot \\frac{${k - 1}!}{2}`, times(sets, orders), `${value}`)}$。`,
            ),
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
  intro: t(
    "On the vertices $A, B, C, D, E$, the edges $AB$, $BC$ and $DE$ leave two separate pieces, $\\{A, B, C\\}$ and $\\{D, E\\}$. Adding the single edge $CD$ joins them, and the graph becomes connected.\n\nCheck: after adding $CD$ the path $A - B - C - D - E$ passes through every vertex, so any two vertices are joined along it.\n\nIn this lesson we count connected components, find the fewest and the most edges that force or allow connectivity, and find the most components a graph with a given number of edges can have.",
    "在顶点 $A, B, C, D, E$ 上，边 $AB$、$BC$、$DE$ 留下两个互不相连的部分 $\\{A, B, C\\}$ 和 $\\{D, E\\}$。只要加上一条边 $CD$ 就把它们连起来，图就变成连通的。\n\n检验：加上 $CD$ 后，路径 $A - B - C - D - E$ 经过每个顶点，所以任意两个顶点都能沿它相连。\n\n本课我们数连通分支，求保证连通或允许不连通的边数界，并求给定边数的图最多能有多少个分支。",
  ),
  prerequisites: ["walks-trails-paths-and-distances"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-connected-components",
      figure: discreteDrawings1["connected-graphs#counting-connected-components"],
      title: t("Connected components", "连通分支"),
      explanation: t(
        "Start at any vertex and follow edges to everything it reaches: that is one component. Repeat from a vertex not yet reached until none is left. In the drawing, the vertices $A$ to $F$ with edges $AB, BC, DE$ fall into the three components $\\{A, B, C\\}$, $\\{D, E\\}$ and $\\{F\\}$. If $V = \\{A, B, C, D, E\\}$ and $E = \\{AB, CD\\}$, the components are $\\{A, B\\}$, $\\{C, D\\}$ and $\\{E\\}$: three components. An isolated vertex is a component on its own.\n\n> **Watch out.** Do not forget isolated vertices, which form components of their own, and do not split a piece that is joined through a longer path.",
        "从任一顶点出发，沿边走到它能到达的所有顶点：这是一个分支。再从尚未到达的顶点出发重复，直到没有剩下的顶点。图中顶点 $A$ 到 $F$、边为 $AB, BC, DE$ 的图分成三个分支 $\\{A, B, C\\}$、$\\{D, E\\}$ 和 $\\{F\\}$。若 $V = \\{A, B, C, D, E\\}$，$E = \\{AB, CD\\}$，则连通分支为 $\\{A, B\\}$、$\\{C, D\\}$ 和 $\\{E\\}$：共三个。孤立顶点自成一个分支。\n\n> **注意。** 不要漏掉孤立顶点，它们各自成为一个分支；也不要把经由较长路径相连的部分拆开。",
      ),
      generate(rng) {
        const n = rng.int(6, 9);
        const k = rng.int(1, 4);
        const g = randomComponents(rng, n, k);
        const c = componentCount(g);
        const sizes = piecesOf(g).map((p) => p.length);
        return withFigure(
          numberProblem({
            prompt: t(
              `${graphIntro(g).en} How many connected components does $G$ have?`,
              `${graphIntro(g)["zh-CN"]}$G$ 有多少个连通分支？`,
            ),
            answer: c,
            mistakes: distinct(c, [
              why(
                c + 1,
                "That splits a piece that is joined; follow every edge before closing a component.",
                "那是把相连的部分拆开了；关闭一个分支前要沿所有边走完。",
              ),
              why(
                c - 1,
                "That merges pieces that no edge joins, or leaves out an isolated vertex.",
                "那是把没有边相连的部分合并了，或漏掉了孤立顶点。",
              ),
              why(
                n - g.edges.length,
                "That uses $n - |E|$, which counts components only when there are no cycles.",
                "那是用了 $n - |E|$，它只在没有圈时才等于分支数。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Explore from each unvisited vertex", "从每个未访问的顶点出发搜索"],
                  t(`Following edges finds the separate pieces $${piecesTex(g)}$.`, `沿边搜索，得到互不相连的部分 $${piecesTex(g)}$。`),
                ],
                [["Count the pieces", "数部分"], t(`There ${c === 1 ? "is" : "are"} $${c}$.`, `共 $${c}$ 个。`)],
              ],
              t(
                c === 1
                  ? `The single piece contains all $${n}$ vertices, so $G$ is connected.`
                  : `The pieces have $${sizes.join(" + ")} = ${n}$ vertices, so every vertex lies in exactly one of them.`,
                c === 1
                  ? `唯一的部分包含全部 $${n}$ 个顶点，所以 $G$ 是连通的。`
                  : `各部分共有 $${sizes.join(" + ")} = ${n}$ 个顶点，所以每个顶点恰好属于其中一个。`,
              ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "edge-bounds-for-connectivity",
      figure: discreteDrawings1["connected-graphs#edge-bounds-for-connectivity"],
      title: t("Edge bounds", "边数界"),
      explanation: t(
        "A connected graph on $50$ vertices needs at least $49$ edges, since each edge lowers the number of components by at most $1$. A simple graph on $50$ vertices with more than $\\binom{49}{2} = 1176$ edges must be connected: the most edges a disconnected one can have is when one vertex is isolated and the other $49$ form $K_{49}$. The drawing shows this on $10$ vertices: $K_9$ and one isolated vertex, with $\\binom{9}{2} = 36$ edges.\n\n> **Watch out.** Removing one edge from $K_n$ does not disconnect it; a disconnected graph must miss every edge between two groups, which is why the bound is $\\binom{n - 1}{2}$ and not $\\binom{n}{2} - 1$.",
        "$50$ 个顶点的连通图至少需要 $49$ 条边，因为每条边至多使分支数减少 $1$。$50$ 个顶点、多于 $\\binom{49}{2} = 1176$ 条边的简单图一定连通：不连通的图边数最多的情形是一个顶点孤立，其余 $49$ 个构成 $K_{49}$。图中画的是 $10$ 个顶点的情形：$K_9$ 加一个孤立顶点，有 $\\binom{9}{2} = 36$ 条边。\n\n> **注意。** 从 $K_n$ 中去掉一条边并不会使它不连通；不连通的图必须缺少两组顶点之间的所有边，所以上界是 $\\binom{n - 1}{2}$ 而不是 $\\binom{n}{2} - 1$。",
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
            mistakes: distinct(choose(n - 1, 2), [
              why(
                choose(n, 2) - 1,
                `Removing one edge from $K_{${n}}$ leaves it connected; every edge between two groups must be missing.`,
                `从 $K_{${n}}$ 中去掉一条边后它仍连通；两组之间的所有边都必须缺少。`,
              ),
              why(choose(n, 2), `That is the complete graph $K_{${n}}$, which is connected.`, `那是完全图 $K_{${n}}$，它是连通的。`),
              why(n - 2, "That is far too few; the large group can be complete.", "太少了；较大的一组可以是完全图。"),
              why(
                choose(n - 1, 2) + 1,
                "That is one too many: with that many edges the graph is forced to be connected.",
                "多了一条：边数这么多时图一定连通。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Split the vertices", "把顶点分组"],
                  t(
                    `A disconnected graph splits into two groups of sizes $a$ and $${n} - a$ with no edge between them, so it has at most $\\binom{a}{2} + \\binom{${n} - a}{2}$ edges.`,
                    `不连通的图可分成大小为 $a$ 和 $${n} - a$ 的两组，组间没有边，所以它至多有 $\\binom{a}{2} + \\binom{${n} - a}{2}$ 条边。`,
                  ),
                ],
                [
                  ["Make the split as uneven as possible", "让分组尽量不均"],
                  t(
                    `This is largest with one vertex isolated and the other $${n - 1}$ complete: $\\binom{${n - 1}}{2} = ${choose(n - 1, 2)}$.`,
                    `当一个顶点孤立、其余 $${n - 1}$ 个构成完全图时最大：$\\binom{${n - 1}}{2} = ${choose(n - 1, 2)}$。`,
                  ),
                ],
              ],
              t(
                `The next most uneven split, $2$ and $${n - 2}$, allows only $1 + ${choose(n - 2, 2)} = ${1 + choose(n - 2, 2)} < ${choose(n - 1, 2)}$ edges.`,
                `次不均的分组 $2$ 与 $${n - 2}$ 只允许 $1 + ${choose(n - 2, 2)} = ${1 + choose(n - 2, 2)} < ${choose(n - 1, 2)}$ 条边。`,
              ),
            ),
          });
        return numberProblem({
          prompt: t(
            `What is the smallest number of edges a connected graph on $${n}$ vertices can have?`,
            `$${n}$ 个顶点的连通图最少有多少条边？`,
          ),
          answer: n - 1,
          mistakes: distinct(n - 1, [
            why(
              n,
              "That is one too many; a tree is connected with one fewer edge than vertices.",
              "多了一条；树是连通的，边数比顶点数少一。",
            ),
            why(
              n - 2,
              "That is too few: each edge lowers the number of components by at most $1$.",
              "太少了：每条边至多使分支数减少 $1$。",
            ),
            why(choose(n, 2), "That is the largest number of edges, not the smallest.", "那是最多的边数，不是最少的。"),
          ]),
          solution: walked(
            [
              [
                ["Add edges one at a time", "一条一条地加边"],
                t(
                  `With no edges there are $${n}$ components, and each new edge lowers the number of components by at most $1$.`,
                  `没有边时有 $${n}$ 个分支，每加一条边，分支数至多减少 $1$。`,
                ),
              ],
              [
                ["Count the edges needed", "数所需的边"],
                t(
                  `Going from $${n}$ components to $1$ takes at least $${n - 1}$ edges.`,
                  `从 $${n}$ 个分支变为 $1$ 个至少需要 $${n - 1}$ 条边。`,
                ),
              ],
            ],
            t(
              `The path $v_1 - v_2 - \\dots - v_{${n}}$ is connected and uses exactly $${n - 1}$ edges, so the bound is reached.`,
              `路径 $v_1 - v_2 - \\dots - v_{${n}}$ 是连通的，恰好用了 $${n - 1}$ 条边，所以这个下界可以达到。`,
            ),
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
  intro: t(
    "In a path through $50$ vertices, removing any of the $48$ inner vertices splits it in two, and so does removing any of its $49$ edges: it has $48$ cut vertices and $49$ cut edges.\n\nCheck: removing an end vertex leaves a path on the other $49$ vertices, still connected, so only the $50 - 2 = 48$ inner vertices are cut vertices; and no edge lies on a cycle, so every edge is a cut edge.\n\nIn this lesson we find the cut vertices and cut edges of a graph and count the cut vertices of a tree.",
    "在经过 $50$ 个顶点的路径中，删去 $48$ 个内部顶点中的任何一个都会把它分成两段，删去 $49$ 条边中的任何一条也是如此：它有 $48$ 个割点和 $49$ 条割边。\n\n检验：删去一个端点后，剩下的 $49$ 个顶点仍构成一条连通的路径，所以只有 $50 - 2 = 48$ 个内部顶点是割点；而没有边在圈上，所以每条边都是割边。\n\n本课我们求图的割点和割边，并求树的割点个数。",
  ),
  prerequisites: ["connected-graphs", "cycles-in-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cut-vertices",
      figure: discreteDrawings1["cut-vertices-and-cut-edges#counting-cut-vertices"],
      title: t("Cut vertices", "割点"),
      explanation: t(
        "Remove each vertex in turn, together with its edges, and see whether the rest falls apart. In the path $A, B, C$ with a triangle $CDE$ attached at $C$, removing $B$ or $C$ disconnects the graph, so there are $2$ cut vertices; removing $A$, $D$ or $E$ does not.\n\n> **Watch out.** A leaf is never a cut vertex, but a vertex of high degree need not be one either: if its neighbors stay joined through a cycle, removing it leaves the graph connected.",
        "依次删去每个顶点及其关联的边，看剩下的部分是否断开。在路径 $A, B, C$ 上于 $C$ 处接一个三角形 $CDE$，删去 $B$ 或 $C$ 会使图不连通，所以有 $2$ 个割点；删去 $A$、$D$ 或 $E$ 则不会。\n\n> **注意。** 叶子绝不是割点，但度数大的顶点也不一定是：若它的邻点通过圈仍然相连，删去它后图仍连通。",
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
            mistakes: distinct(cuts.length, [
              why(
                cuts.length + 1,
                "That counts a vertex whose removal leaves the rest connected.",
                "那是把删去后其余部分仍连通的顶点也算进去了。",
              ),
              why(
                n - leaves,
                "That counts every vertex that is not a leaf; a vertex on a cycle may not disconnect anything.",
                "那是数了所有非叶子顶点；在圈上的顶点删去后可能不会使图断开。",
              ),
              why(
                Math.max(0, cuts.length - 1),
                "That misses a cut vertex: remove each vertex in turn.",
                "漏掉了一个割点：要依次删去每个顶点。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Remove each vertex in turn", "依次删去每个顶点"],
                  t(
                    "Delete one vertex and its edges, and check whether the rest is still connected.",
                    "删去一个顶点及其关联的边，检查剩下的部分是否仍连通。",
                  ),
                ],
                [
                  ["Count the ones that disconnect", "数使图断开的顶点"],
                  t(
                    cuts.length === 0
                      ? "Removing any single vertex leaves the rest connected, so there are none."
                      : `Removing ${letters(cuts)} disconnects $G$, and no other vertex does: $${cuts.length}$ cut ${cuts.length === 1 ? "vertex" : "vertices"}.`,
                    cuts.length === 0
                      ? "删去任何一个顶点后其余部分仍连通，所以没有割点。"
                      : `删去 ${letters(cuts, true)} 会使 $G$ 不连通，删去其他顶点则不会：共 $${cuts.length}$ 个割点。`,
                  ),
                ],
              ],
              cuts.length === 0
                ? t(
                    `Every vertex lies on a cycle or is a leaf, so after removing it the others stay joined: $G$ minus any vertex has $1$ component.`,
                    `每个顶点都在圈上或是叶子，删去它后其余顶点仍相连：$G$ 删去任一顶点后都只有 $1$ 个分支。`,
                  )
                : t(
                    `Without ${cuts.map((v) => `$${vx(v)}$ there are $${componentCount(g, [v])}$ components`).join(", without ")}, more than the $1$ of $G$.`,
                    `删去 ${cuts.map((v) => `$${vx(v)}$ 后有 $${componentCount(g, [v])}$ 个分支`).join("，删去 ")}，都多于 $G$ 的 $1$ 个。`,
                  ),
            ),
          }),
          g,
        );
      },
    },
    {
      id: "counting-cut-edges",
      figure: discreteDrawings1["cut-vertices-and-cut-edges#counting-cut-edges"],
      title: t("Cut edges", "割边"),
      explanation: t(
        "An edge is a cut edge exactly when it lies on no cycle: if it is on a cycle, the rest of the cycle still joins its ends. In a triangle $ABC$ with a pendant edge $CD$, the edge $CD$ is a cut edge; $AB$, $BC$ and $CA$ lie on the triangle, so removing one of them leaves the graph connected.\n\n> **Watch out.** Count only the edges on no cycle; the edges on cycles are exactly the ones that are not cut edges, and a graph with cycles is not a tree, so its count is not $n - 1$.",
        "一条边是割边当且仅当它不在任何圈上：若它在圈上，圈的其余部分仍连接它的两端。在三角形 $ABC$ 加悬挂边 $CD$ 的图中，$CD$ 是割边；$AB$、$BC$、$CA$ 在三角形上，删去其中一条后图仍连通。\n\n> **注意。** 只数不在任何圈上的边；在圈上的边恰好不是割边，而有圈的图不是树，所以割边数不是 $n - 1$。",
      ),
      generate(rng) {
        const n = rng.int(6, 8);
        const g = randomConnected(rng, n, rng.int(1, 3));
        const bridges = g.edges.filter((e) => componentCount({ n, edges: g.edges.filter((f) => f !== e) }) > 1);
        const onCycles = g.edges.filter((e) => !bridges.includes(e));
        const first = bridges[0];
        return withFigure(
          numberProblem({
            prompt: t(`${graphIntro(g).en} How many cut edges does $G$ have?`, `${graphIntro(g)["zh-CN"]}$G$ 有多少条割边？`),
            answer: bridges.length,
            mistakes: distinct(bridges.length, [
              why(
                bridges.length + 1,
                "That counts an edge that lies on a cycle; removing it leaves the graph connected.",
                "那是把在圈上的边也算进去了；删去它后图仍连通。",
              ),
              why(
                g.edges.length - bridges.length,
                "That counts the edges on cycles, which are exactly the ones that are not cut edges.",
                "那是数了在圈上的边，而它们恰好不是割边。",
              ),
              why(
                n - 1,
                `That is the number of edges of a tree on $${n}$ vertices; $G$ has cycles.`,
                `那是 $${n}$ 个顶点的树的边数；$G$ 有圈。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the edges on cycles", "找出在圈上的边"],
                  t(
                    `The edges $${onCycles.map(edgeTex).join(", ")}$ lie on cycles, so none of them is a cut edge.`,
                    `边 $${onCycles.map(edgeTex).join(", ")}$ 在圈上，所以都不是割边。`,
                  ),
                ],
                [
                  ["Count the others", "数其余的边"],
                  t(
                    bridges.length === 0
                      ? "Every edge lies on a cycle, so there are none."
                      : `The edges on no cycle are $${bridges.map(edgeTex).join(", ")}$: $${bridges.length}$ cut ${bridges.length === 1 ? "edge" : "edges"}.`,
                    bridges.length === 0
                      ? "每条边都在某个圈上，所以没有割边。"
                      : `不在任何圈上的边为 $${bridges.map(edgeTex).join(", ")}$：共 $${bridges.length}$ 条割边。`,
                  ),
                ],
              ],
              first === undefined
                ? t(
                    "Removing any one edge leaves the rest of its cycle joining its two ends, so $G$ stays connected.",
                    "删去任何一条边后，它所在圈的其余部分仍连接它的两端，所以 $G$ 仍连通。",
                  )
                : t(
                    `Removing $${edgeTex(first)}$, for instance, leaves $${componentCount({ n, edges: g.edges.filter((f) => f !== first) })}$ components.`,
                    `例如删去 $${edgeTex(first)}$ 后，图有 $${componentCount({ n, edges: g.edges.filter((f) => f !== first) })}$ 个分支。`,
                  ),
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
  intro: t(
    "A forest of $10$ trees has $50$ vertices in all. Each tree has one fewer edge than vertices, so the forest has $50 - 10 = 40$ edges.\n\nCheck: joining the $10$ trees with $9$ more edges gives one tree on $50$ vertices, with $40 + 9 = 49$ edges, one fewer than its vertices.\n\nIn this lesson we count the edges and components of forests, count the leaves of a tree from its other degrees, and work with full trees and spanning trees.",
    "一个由 $10$ 棵树组成的森林共有 $50$ 个顶点。每棵树的边数比顶点数少一，所以这个森林有 $50 - 10 = 40$ 条边。\n\n检验：再用 $9$ 条边把这 $10$ 棵树连起来，得到一棵有 $50$ 个顶点的树，它有 $40 + 9 = 49$ 条边，比顶点数少一。\n\n本课我们求森林的边数和分支数，由树的其他度数求叶子数，并研究满树和生成树。",
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
        "A forest with $60$ vertices and $12$ components has $60 - 12 = 48$ edges: each component is a tree with one fewer edge than vertices, and the components lose one edge each.\n\n> **Watch out.** Subtract the number of components, not $1$: only a single tree has $n - 1$ edges.",
        "有 $60$ 个顶点、$12$ 个分支的森林有 $60 - 12 = 48$ 条边：每个分支都是边数比顶点数少一的树，每个分支各少一条边。\n\n> **注意。** 要减去分支数，而不是减去 $1$：只有一棵树时才有 $n - 1$ 条边。",
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
          mistakes: askEdges
            ? distinct(n - k, [
                why(
                  n - 1,
                  "That is the number of edges of a single tree; each component loses one edge.",
                  "那是一棵树的边数；每个分支各少一条边。",
                ),
                why(n - k - 1, "That is one too few: subtract only the number of components.", "少了一条：只减去分支数。"),
                why(n - k + 1, "That is one too many: subtract the number of components.", "多了一条：要减去分支数。"),
              ])
            : distinct(k, [
                why(k + 1, "That is one too many: the components are the vertices minus the edges.", "多了一：分支数等于顶点数减去边数。"),
                why(k - 1, "That is one too few: the components are the vertices minus the edges.", "少了一：分支数等于顶点数减去边数。"),
                why(
                  1,
                  "That treats the forest as a single tree; a tree would have one fewer edge than vertices.",
                  "那是把森林当成了一棵树；树的边数比顶点数少一。",
                ),
              ]),
          solution: walked(
            [
              [
                ["Count edges tree by tree", "逐棵树数边"],
                t(
                  "Each component is a tree with one fewer edge than vertices, so a forest with $n$ vertices and $k$ components has $n - k$ edges.",
                  "每个分支都是边数比顶点数少一的树，所以 $n$ 个顶点、$k$ 个分支的森林有 $n - k$ 条边。",
                ),
              ],
              [
                [askEdges ? "Subtract the components" : "Solve for the components", askEdges ? "减去分支数" : "解出分支数"],
                askEdges
                  ? t(`$${n} - ${k} = ${n - k}$ edges.`, `$${n} - ${k} = ${n - k}$ 条边。`)
                  : t(`$k = ${n} - ${n - k} = ${k}$.`, `$k = ${n} - ${n - k} = ${k}$。`),
              ],
            ],
            k === 1
              ? t(
                  `The forest is a single tree, and a tree on $${n}$ vertices has $${n - 1}$ edges.`,
                  `这个森林就是一棵树，而 $${n}$ 个顶点的树有 $${n - 1}$ 条边。`,
                )
              : t(
                  `Joining the $${k}$ trees with $${k - 1}$ more edges gives one tree on $${n}$ vertices with $${n - k} + ${k - 1} = ${n - 1}$ edges, as it should.`,
                  `再用 $${k - 1}$ 条边把这 $${k}$ 棵树连起来，得到一棵 $${n}$ 个顶点的树，有 $${n - k} + ${k - 1} = ${n - 1}$ 条边，正相符。`,
                ),
          ),
        });
      },
    },
    {
      id: "counting-leaves-of-a-tree",
      title: t("Counting leaves", "数叶子"),
      explanation: t(
        "A tree has $2$ vertices of degree $5$, $1$ of degree $3$, and the rest are leaves. With $\\ell$ leaves there are $3 + \\ell$ vertices and $2 + \\ell$ edges, so $2 \\cdot 5 + 3 + \\ell = 2(2 + \\ell)$, that is $13 + \\ell = 4 + 2\\ell$, and $\\ell = 9$. In general $\\ell = 2 + \\sum (d - 2)$ over the vertices that are not leaves.\n\n> **Watch out.** The degree sum is twice the number of edges, which is one fewer than the vertices, and the leaves themselves count among the vertices.",
        "一棵树有 $2$ 个度为 $5$ 的顶点、$1$ 个度为 $3$ 的顶点，其余都是叶子。设有 $\\ell$ 片叶子，则有 $3 + \\ell$ 个顶点、$2 + \\ell$ 条边，所以 $2 \\cdot 5 + 3 + \\ell = 2(2 + \\ell)$，即 $13 + \\ell = 4 + 2\\ell$，$\\ell = 9$。一般地，$\\ell = 2 + \\sum (d - 2)$，求和遍及所有非叶子顶点。\n\n> **注意。** 度数之和是边数的两倍，而边数比顶点数少一；叶子本身也算在顶点里。",
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
        const inner = a + b + c;
        const known = parts.reduce((s, [k, d]) => s + k! * d!, 0);
        const sumTex = parts.map(([k, d]) => times(k!, d!)).join(" + ");
        const edgesTex = inner === 1 ? "\\ell" : `${inner - 1} + \\ell`;
        const twiceEdges = inner === 1 ? "2\\ell" : `2(${edgesTex})`;
        const excess = parts.filter(([, d]) => d! > 2).map(([k, d]) => times(k!, d! - 2));
        return numberProblem({
          prompt: t(
            `A tree has ${en}, and every other vertex is a leaf. How many leaves does it have?`,
            `一棵树有${zh}，其余顶点都是叶子。它有多少片叶子？`,
          ),
          answer: leaves,
          mistakes: distinct(leaves, [
            why(b + 2 * c, "That leaves out the $2$ in $\\ell = 2 + \\sum (d - 2)$.", "那是漏掉了 $\\ell = 2 + \\sum (d - 2)$ 中的 $2$。"),
            why(
              2 + a + b + c,
              "That adds one leaf for each inner vertex; a vertex of degree $d$ adds $d - 2$ leaves.",
              "那是每个内部顶点加一片叶子；度为 $d$ 的顶点增加 $d - 2$ 片叶子。",
            ),
            why(
              leaves + a,
              "That lets the vertices of degree $2$ add leaves; they add $2 - 2 = 0$.",
              "那是让度为 $2$ 的顶点也增加叶子；它们增加 $2 - 2 = 0$。",
            ),
            why(
              2 + b + c,
              "That gives each vertex of degree $4$ only one extra leaf; it adds $4 - 2 = 2$.",
              "那是让每个度为 $4$ 的顶点只增加一片叶子；它增加 $4 - 2 = 2$ 片。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply the handshaking lemma", "用握手引理"],
                t(
                  `With $\\ell$ leaves the tree has $${inner} + \\ell$ vertices and $${edgesTex}$ edges, so $${sumTex} + \\ell = ${twiceEdges}$.`,
                  `设有 $\\ell$ 片叶子，则树有 $${inner} + \\ell$ 个顶点、$${edgesTex}$ 条边，所以 $${sumTex} + \\ell = ${twiceEdges}$。`,
                ),
              ],
              [
                ["Solve for $\\ell$", "解出 $\\ell$"],
                t(
                  `This rearranges to $\\ell = 2 + \\sum (d - 2) = ${chain(`2 + ${excess.join(" + ")}`, `${leaves}`)}$.`,
                  `整理得 $\\ell = 2 + \\sum (d - 2) = ${chain(`2 + ${excess.join(" + ")}`, `${leaves}`)}$。`,
                ),
              ],
            ],
            t(
              `The tree has $${inner + leaves}$ vertices, and its degrees add to $${known} + ${leaves} = ${known + leaves} = 2 \\cdot ${inner + leaves - 1}$, twice its $${inner + leaves - 1}$ edges.`,
              `这棵树有 $${inner + leaves}$ 个顶点，度数之和为 $${known} + ${leaves} = ${known + leaves} = 2 \\cdot ${inner + leaves - 1}$，正是它 $${inner + leaves - 1}$ 条边的两倍。`,
            ),
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
  intro: t(
    "By Cayley's formula there are $10^8 = 100000000$ labeled trees on the vertices $1, 2, \\dots, 10$: each matches one Prüfer sequence of length $8$ with entries from $1$ to $10$.\n\nCheck: on $2$ vertices the formula gives $2^0 = 1$, and indeed the single edge $12$ is the only tree.\n\nIn this lesson we count labeled trees with Cayley's formula, count the trees with given degrees through their Prüfer sequences, and count the trees in which one vertex has a given degree.",
    "由 Cayley 公式，顶点为 $1, 2, \\dots, 10$ 的标号树有 $10^8 = 100000000$ 棵：每棵对应一个长度为 $8$、各项取自 $1$ 到 $10$ 的 Prüfer 序列。\n\n检验：对 $2$ 个顶点，公式给出 $2^0 = 1$，而单独一条边 $12$ 确实是唯一的树。\n\n本课我们用 Cayley 公式数标号树，借助 Prüfer 序列数给定度数的树，并数某个顶点有给定度数的树。",
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
        "There are $11^9$ labeled trees on $11$ vertices, one for each Prüfer sequence of length $9$. Those in which vertex $1$ is a leaf have Prüfer sequences avoiding $1$: $10^9$ of them.\n\n> **Watch out.** The Prüfer sequence has length $n - 2$, not $n - 1$, and a vertex of degree $d$ appears in it exactly $d - 1$ times.",
        "$11$ 个顶点的标号树有 $11^9$ 棵，每棵对应一个长度为 $9$ 的 Prüfer 序列。其中顶点 $1$ 为叶子的树，其 Prüfer 序列不含 $1$：共 $10^9$ 棵。\n\n> **注意。** Prüfer 序列的长度是 $n - 2$，不是 $n - 1$；度为 $d$ 的顶点在其中恰好出现 $d - 1$ 次。",
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
            mistakes: distinct(n ** (n - 2), [
              why(
                n ** (n - 1),
                `That uses length $${n - 1}$ for the Prüfer sequence; it has length $${n - 2}$.`,
                `那是把 Prüfer 序列的长度当作 $${n - 1}$；它的长度是 $${n - 2}$。`,
              ),
              why(
                (n - 1) ** (n - 2),
                `That allows only $${n - 1}$ labels in the sequence; all $${n}$ can appear.`,
                `那是序列中只允许 $${n - 1}$ 个标号；全部 $${n}$ 个都可以出现。`,
              ),
              why(factorial(n) / 2, "That counts only the trees that are paths.", "那是只数了是路径的树。"),
            ]),
            solution: walked(
              [
                [
                  ["Use Prüfer sequences", "用 Prüfer 序列"],
                  t(
                    `Labeled trees on $${n}$ vertices match Prüfer sequences of length $${n - 2}$ with entries from $1$ to $${n}$.`,
                    `$${n}$ 个顶点的标号树与长度为 $${n - 2}$、各项取自 $1$ 到 $${n}$ 的 Prüfer 序列一一对应。`,
                  ),
                ],
                [["Count the sequences", "数序列"], t(`$${pw(n, n - 2)} = ${n ** (n - 2)}$.`, `$${pw(n, n - 2)} = ${n ** (n - 2)}$。`)],
              ],
              t(
                `The $\\frac{${n}!}{2} = ${factorial(n) / 2}$ labeled paths are among these trees, and $${factorial(n) / 2} \\le ${n ** (n - 2)}$.`,
                `这些树中包括 $\\frac{${n}!}{2} = ${factorial(n) / 2}$ 条标号路径，而 $${factorial(n) / 2} \\le ${n ** (n - 2)}$。`,
              ),
            ),
          });
        const value = choose(n - 2, d - 1) * (n - 1) ** (n - 1 - d);
        const places = choose(n - 2, d - 1);
        const rest = n - 1 - d;
        const product =
          [...(places === 1 ? [] : [`\\binom{${n - 2}}{${d - 1}}`]), ...(rest === 0 ? [] : [pw(n - 1, rest)])].join(" \\cdot ") || "1";
        return numberProblem({
          prompt: t(
            `How many labeled trees with vertex set $\\{1, 2, \\dots, ${n}\\}$ have $\\deg(1) = ${d}$?`,
            `顶点集为 $\\{1, 2, \\dots, ${n}\\}$ 的标号树中，有多少棵满足 $\\deg(1) = ${d}$？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why((n - 1) ** (n - 2), "That counts the trees in which vertex $1$ is a leaf.", "那是数了顶点 $1$ 为叶子的树。"),
            why(
              choose(n - 2, d) * (n - 1) ** (n - 2 - d),
              `That puts $1$ in the sequence $${d}$ times; a vertex of degree $${d}$ appears $${d - 1}$ times.`,
              `那是让 $1$ 在序列中出现 $${d}$ 次；度为 $${d}$ 的顶点出现 $${d - 1}$ 次。`,
            ),
            why(
              choose(n - 2, d - 1) * n ** (n - 1 - d),
              "That lets the other positions hold the label $1$ as well, which would raise its degree.",
              "那是让其余位置也可以填标号 $1$，这会使它的度变大。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Place the label $1$", "放置标号 $1$"],
                t(
                  d === 1
                    ? `A vertex of degree $1$ appears $0$ times, so $1$ is left out of the Prüfer sequence of length $${n - 2}$.`
                    : `Vertex $1$ appears $${d - 1}$ times in the Prüfer sequence of length $${n - 2}$: choose those positions in $\\binom{${n - 2}}{${d - 1}}$ ways.`,
                  d === 1
                    ? `度为 $1$ 的顶点出现 $0$ 次，所以长度为 $${n - 2}$ 的 Prüfer 序列中不出现 $1$。`
                    : `顶点 $1$ 在长度为 $${n - 2}$ 的 Prüfer 序列中出现 $${d - 1}$ 次：选这些位置有 $\\binom{${n - 2}}{${d - 1}}$ 种方法。`,
                ),
              ],
              [
                ["Fill the other positions", "填其余位置"],
                t(
                  rest === 0
                    ? `No positions remain, so the count is $${chain(product, `${value}`)}$.`
                    : `The other $${rest}$ ${rest === 1 ? "position takes" : "positions each take"} any of the $${n - 1}$ other labels: $${chain(product, `${value}`)}$.`,
                  rest === 0
                    ? `没有剩余位置，所以个数为 $${chain(product, `${value}`)}$。`
                    : `其余 $${rest}$ 个位置各填其他 $${n - 1}$ 个标号之一：$${chain(product, `${value}`)}$。`,
                ),
              ],
            ],
            t(
              `The positions add up: $${d - 1} + ${rest} = ${n - 2}$, the length of the sequence.`,
              `位置数相加：$${d - 1} + ${rest} = ${n - 2}$，正是序列的长度。`,
            ),
          ),
        });
      },
    },
    {
      id: "trees-with-a-given-degree-sequence",
      title: t("Trees with given degrees", "给定度数的树"),
      figure: remainingDrawings9["counting-trees#trees-with-a-given-degree-sequence"],
      explanation: t(
        "In the Prüfer sequence of a tree, each vertex appears one time fewer than its degree, so counting trees with given degrees means counting arrangements of that sequence. The tree drawn has degrees $3, 2, 2, 1, 1, 1$ and Prüfer sequence $1, 2, 1, 3$, with vertex $1$ twice; arranging two $1$s, one $2$ and one $3$ gives $\\frac{4!}{2!} = 12$ such trees. Trees on $\\{1, \\dots, 10\\}$ with $\\deg(1) = 5$, $\\deg(2) = \\deg(3) = 3$ and every other vertex a leaf have Prüfer sequences of length $8$ with $1$ four times, $2$ twice and $3$ twice: $\\frac{8!}{4!\\,2!\\,2!} = 420$ trees.\n\n> **Watch out.** Divide by $(d - 1)!$ for each vertex, not by $d!$, and the leaves do not appear in the sequence at all.",
        "在树的普吕弗序列中，每个顶点出现的次数比它的度数少一，所以数给定度数的树就是数这个序列的排列方式。图中的树度数为 $3, 2, 2, 1, 1, 1$，普吕弗序列为 $1, 2, 1, 3$，顶点 $1$ 出现两次；把两个 $1$、一个 $2$ 和一个 $3$ 排列，得到 $\\frac{4!}{2!} = 12$ 棵这样的树。顶点集为 $\\{1, \\dots, 10\\}$、$\\deg(1) = 5$、$\\deg(2) = \\deg(3) = 3$ 且其余顶点都是叶子的树，其普吕弗序列长度为 $8$，$1$ 出现四次，$2$ 和 $3$ 各出现两次：共 $\\frac{8!}{4!\\,2!\\,2!} = 420$ 棵。\n\n> **注意。** 每个顶点要除以 $(d - 1)!$，而不是 $d!$；叶子根本不出现在序列中。",
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
          mistakes: distinct(
            value,
            [
              why(
                factorial(n - 2),
                "That counts every order of the sequence as different; repeated labels give the same sequence.",
                "那是把序列的每种顺序都当作不同；重复的标号给出相同的序列。",
              ),
              why(
                factorial(n - 2) / big.reduce((p, [, d]) => p * factorial(d), 1),
                "That divides by $d!$; a vertex of degree $d$ appears only $d - 1$ times.",
                "那是除以了 $d!$；度为 $d$ 的顶点只出现 $d - 1$ 次。",
              ),
              why(n ** (n - 2), "That counts all labeled trees, whatever their degrees.", "那是数了所有标号树，不管度数如何。"),
            ].filter((w) => Number.isInteger(w.value)),
          ),
          solution: walked(
            [
              [
                ["Count the appearances", "数出现次数"],
                t(
                  `In the Prüfer sequence of length $${n - 2}$, ${big.map(([v, d]) => `$${v}$ appears $${d - 1}$ ${d - 1 === 1 ? "time" : "times"}`).join(", ")}, and the leaves do not appear.`,
                  `在长度为 $${n - 2}$ 的 Prüfer 序列中，${big.map(([v, d]) => `$${v}$ 出现 $${d - 1}$ 次`).join("，")}，叶子不出现。`,
                ),
              ],
              [
                ["Count the arrangements", "数排列方式"],
                t(
                  `$\\frac{${n - 2}!}{${big.map(([, d]) => `${d - 1}!`).join("\\,")}} = ${value}$.`,
                  `$\\frac{${n - 2}!}{${big.map(([, d]) => `${d - 1}!`).join("\\,")}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `The appearances fill the sequence: $${chain(big.map(([, d]) => `${d - 1}`).join(" + "), `${n - 2}`)}$.`,
              `出现次数正好填满序列：$${chain(big.map(([, d]) => `${d - 1}`).join(" + "), `${n - 2}`)}$。`,
            ),
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
