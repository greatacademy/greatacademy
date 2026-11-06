// Drawings of the remaining explanations in the college shard: small graphs, a tree and the symmetries of a tetrahedron.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { fill } from "./explanation-drawings-exam-kit.ts";
import { shift } from "./explanation-drawings-geometry-2.ts";
import { drawing, note, seg } from "./explanation-drawings-kit.ts";
import { dot } from "./explanation-drawings-remaining-kit.ts";

const corners: Point[] = [
  [0, 0],
  [3, 0],
  [3, 3],
  [0, 3],
];
const [a, b, c, d] = corners as [Point, Point, Point, Point];

/** pair draws an edge of a small graph, plain or in a tone. */
const pair = (p: Point, q: Point, s?: "action" | "result", dashed = false): Mark => seg(p, q, s, dashed);

const prism: Point[] = [
  [0, 0],
  [3, 0],
  [1.5, 1.4],
  [1.5, 3.6],
  [0, 2.2],
  [3, 2.2],
];

const top: Point = [0, 3];
const left: Point = [-2.4, -0.4];
const right: Point = [1, -1.4];
const back: Point = [2.6, 0.4];
const midLeft: Point = [(top[0] + left[0]) / 2, (top[1] + left[1]) / 2];
const midRight: Point = [(right[0] + back[0]) / 2, (right[1] + back[1]) / 2];

/** tetra draws a tetrahedron with its hidden edge dashed and its corners numbered. */
const tetra: Mark[] = [
  seg(top, left),
  seg(top, right),
  seg(top, back),
  seg(left, right),
  seg(right, back),
  seg(left, back, undefined, true),
  note(top, "1", "n"),
  note(left, "2", "w"),
  note(right, "3", "s"),
  note(back, "4", "e"),
];

const baseCenter: Point = [(left[0] + right[0] + back[0]) / 3, (left[1] + right[1] + back[1]) / 3];

/** remainingDrawings9 draws the explanations of the college shard that earlier tables leave out: small graphs, a tree and the symmetries of a tetrahedron. */
export const remainingDrawings9: Readonly<Record<string, Figure>> = {
  "introduction-to-graphs#labeled-graphs-with-a-given-number-of-edges": drawing(
    [
      pair(a, b, "result"),
      pair(b, c, undefined, true),
      pair(c, d, "result"),
      pair(d, a, undefined, true),
      pair(a, c, undefined, true),
      pair(b, d, undefined, true),
      ...corners.map((p) => dot(p)),
      note(a, "1", "sw"),
      note(b, "2", "se"),
      note(c, "3", "ne"),
      note(d, "4", "nw"),
    ],
    "For example, 4 labeled vertices have 6 pairs, dashed or colored. A graph with 2 edges, like the colored one, chooses 2 of the 6 pairs, so there are 15 such graphs.",
    "例如，4 个带标号的顶点有 6 对，用虚线或彩色表示。有 2 条边的图（如标色的图）从 6 对中选 2 对，所以共有 15 个这样的图。",
  ),
  "the-degree-of-a-vertex#the-missing-degree": drawing(
    [
      pair(a, b),
      pair(a, d),
      pair(a, c),
      pair(b, d),
      ...corners.map((p) => dot(p)),
      note(a, "3", "sw"),
      note(b, "2", "se"),
      note(c, "1", "ne"),
      note(d, "2", "nw"),
      dot(c, "result"),
    ],
    "For example, a graph with 4 edges, with the degree of each vertex beside it. The degrees add up to 8, twice the edges, so with 3, 2 and 2 known, the colored vertex has degree 1.",
    "例如，一个有 4 条边的图，每个顶点旁标出了度。度数之和是 8，即边数的两倍，所以已知 3、2、2 时，标色的顶点的度是 1。",
  ),
  "the-handshaking-lemma#the-fewest-vertices-for-a-given-maximum-degree": drawing(
    [pair(a, b), pair(b, c), pair(c, d), pair(d, a), pair(a, c), pair(b, d), ...corners.map((p) => dot(p, "result"))],
    "For example, 6 edges with no degree above 3. Then n is at least 2 · 6/3 = 4, and the complete graph on the 4 colored vertices reaches it.",
    "例如，6 条边，度数都不超过 3。则 n 至少为 2 · 6/3 = 4，这 4 个标色顶点上的完全图达到了这个下界。",
  ),
  "regular-graphs#the-vertices-from-the-edges": drawing(
    [
      pair(prism[0] as Point, prism[1] as Point, "result"),
      pair(prism[0] as Point, prism[2] as Point, "result"),
      pair(prism[1] as Point, prism[2] as Point),
      pair(prism[3] as Point, prism[4] as Point),
      pair(prism[3] as Point, prism[5] as Point),
      pair(prism[4] as Point, prism[5] as Point),
      pair(prism[0] as Point, prism[4] as Point, "result"),
      pair(prism[1] as Point, prism[5] as Point),
      pair(prism[2] as Point, prism[3] as Point),
      ...prism.map((p) => dot(p)),
    ],
    "For example, degree k = 3 and E = 9 edges. Then 3n = 18, so n = 6, as in this graph. Each vertex has degree 3, as the colored edges of one vertex show.",
    "例如，度 k = 3，边数 E = 9。则 3n = 18，所以 n = 6，如图所示。每个顶点的度都是 3，如一个顶点的标色的边所示。",
  ),
  "counting-trees#trees-with-a-given-degree-sequence": drawing(
    (() => {
      const v: Record<number, Point> = { 1: [0, 0], 2: [-2.2, 1.4], 3: [2.2, 1.4], 4: [0, -2], 5: [-4.4, 1.4], 6: [4.4, 1.4] };
      const at = (i: number): Point => v[i] as Point;
      return [
        pair(at(1), at(2), "result"),
        pair(at(1), at(3), "result"),
        pair(at(1), at(4), "result"),
        pair(at(2), at(5)),
        pair(at(3), at(6)),
        ...[1, 2, 3, 4, 5, 6].flatMap((i): Mark[] => [
          dot(at(i), i === 1 ? "result" : undefined),
          note(at(i), String(i), i === 4 ? "e" : "n"),
        ]),
      ];
    })(),
    "One of the 12 trees with degrees 3, 2, 2, 1, 1, 1. Its Prüfer sequence is 1, 2, 1, 3, where the colored vertex 1 of degree 3 appears twice.",
    "度数为 3、2、2、1、1、1 的 12 棵树之一。它的 Prüfer 序列是 1、2、1、3，其中度为 3 的标色顶点 1 出现两次。",
  ),
  "the-symmetry-group-of-a-tetrahedron#the-geometry-of-a-tetrahedron-permutation": drawing(
    [
      ...tetra,
      seg(top, baseCenter, "result"),
      ...shift([...tetra, seg(midLeft, midRight, "result")], 8),
      fill(
        [midLeft, right, back].map((p): Point => [p[0] + 16, p[1]]),
        "result",
      ),
      ...shift(tetra, 16),
    ],
    "Left: a three-cycle such as (2 3 4) turns about the colored axis through corner 1. Middle: a double swap such as (1 2)(3 4) turns a half turn about the colored axis through two edge midpoints. Right: the single swap (1 2) reflects in the colored plane.",
    "左图：三轮换（如 (2 3 4)）绕过顶点 1 的标色轴旋转。中图：双对换（如 (1 2)(3 4)）绕过两条棱中点的标色轴旋转半周。右图：对换 (1 2) 关于标色的平面反射。",
  ),
};
