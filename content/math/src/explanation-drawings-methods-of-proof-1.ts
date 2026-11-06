// Drawings of the explanations of Methods of Proof: truth tables, sets, number lines, tilings, clocks and digraphs.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { head, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { dotAt, drawing, note, ring, seg } from "./explanation-drawings-kit.ts";
import { around, bow, loop, net, table, tiling, type Vertices } from "./explanation-drawings-structures-kit.ts";

// An arrow along a circle about the origin, from one angle to another in degrees.
const arc = (r: number, from: number, to: number): Mark[] => {
  const n = 40;
  const pts = Array.from({ length: n + 1 }, (_, i): Point => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
  return [...chain(pts.slice(0, -2), "result"), ...head(pts[n - 3] as Point, pts[n] as Point, "result")];
};

// A clock of the residues modulo n, read clockwise from 0 at the top.
const clock = (n: number, hot: readonly number[]): Mark[] => {
  const names = Array.from({ length: n }, (_, i) => String(i));
  return [ring(2), ...net(around(names, 2), [], { tones: Object.fromEntries(hot.map((h) => [String(h), "result" as const])) })];
};

// The distance along a ray from p, at angle t, to the circle of center c and radius r around it.
const reach = (p: Point, t: number, c: Point, r: number): number => {
  const [dx, dy] = [p[0] - c[0], p[1] - c[1]];
  const b = dx * Math.cos(t) + dy * Math.sin(t);
  return -b + Math.sqrt(b * b - (dx * dx + dy * dy - r * r));
};

const [A, B, C]: [Point, Point, Point] = [
  [0, 0.9],
  [-0.8, -0.45],
  [0.8, -0.45],
];

/** proofDrawings1 draws the explanations of Methods of Proof, by knowledge point. */
export const proofDrawings1: Readonly<Record<string, Figure>> = {
  "truth-tables#rows-with-a-given-number-of-true-variables": drawing(
    [
      ...table(
        [
          ["T", "T", "T"],
          ["T", "T", "F"],
          ["T", "F", "T"],
          ["T", "F", "F"],
          ["F", "T", "T"],
          ["F", "T", "F"],
          ["F", "F", "T"],
          ["F", "F", "F"],
        ],
        { cell: 0.7, cols: ["p", "q", "r"], shade: [1, 2, 4].flatMap((r) => [0, 1, 2].map((c) => [r, c] as const)), drop: 0.33 },
      ),
      note([2.5, -2.8], "1 + 3 + 3 + 1 = 8", "e"),
    ],
    "For example, the 8 rows for three variables. The highlighted rows have exactly 2 variables true, so they match the 3 subsets of size 2. Grouping all the rows by the number of true variables gives 1 + 3 + 3 + 1 = 8, a row of Pascal's triangle.",
    "例如，三个变量的 8 行。突出显示的行恰有 2 个变量为真，所以它们对应大小为 2 的 3 个子集。把所有行按真变量的个数分组，得 1 + 3 + 3 + 1 = 8，这是帕斯卡三角形的一行。",
  ),
  "indicator-functions#the-set-of-a-drawn-indicator-function": drawing(
    pane(0, [0, 4, 1], [0, 2, 1], 6, 3)
      .path([
        [0, 0],
        [1, 0],
      ])
      .path(
        [
          [1, 1],
          [3, 1],
        ],
        "result",
      )
      .path([
        [3, 0],
        [4, 0],
      ])
      .dot(1, 0)
      .open(1, 1)
      .dot(3, 1, undefined, "n", "result")
      .open(3, 0)
      .say(2, 1.1, "(1, 3]", "n")
      .marks(),
    "For example, a graph at height one from 1 to 3 and at zero elsewhere. At 1 the circle at height one is open, so 1 is not in the set; at 3 it is filled, so 3 is. The set is (1, 3].",
    "例如，图像从 1 到 3 高度为一，其他地方为零。在 1 处高度一上是空心圆，所以 1 不在集合中；在 3 处是实心圆，所以 3 在集合中。集合是 (1, 3]。",
  ),
  "distributive-properties-of-set-operations#the-set-marked-on-a-three-circle-diagram": (() => {
    const r = 1.4;
    const p: Point = [0, 0];
    const edge = Array.from({ length: 240 }, (_, i): Point => {
      const t = (i * 2 * Math.PI) / 240;
      const d = Math.min(reach(p, t, A, r), Math.max(reach(p, t, B, r), reach(p, t, C, r)));
      return [d * Math.cos(t), d * Math.sin(t)];
    });
    return drawing(
      [
        { kind: "shade", points: edge, tone: "result" },
        ring(r, A),
        ring(r, B),
        ring(r, C),
        note([0, 2.3], "A", "n"),
        note([-2.2, -0.9], "B", "w"),
        note([2.2, -0.9], "C", "e"),
        note([0, -2], "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)", "s"),
      ],
      "For example, the shaded regions are those inside A and also inside B or C. A region only in A is not shaded, and neither is one in B or C but outside A. Checking the eight regions this way gives A ∩ (B ∪ C), which is the same set as (A ∩ B) ∪ (A ∩ C).",
      "例如，阴影区域在 A 内，并且也在 B 或 C 内。只在 A 内的区域没有阴影，在 B 或 C 内但在 A 外的区域也没有。这样检查八个区域，得到 A ∩ (B ∪ C)，它与 (A ∩ B) ∪ (A ∩ C) 是同一个集合。",
    );
  })(),
  "the-division-algorithm#the-division-algorithm-on-a-number-line": (() => {
    const x = (t: number) => t * 0.8;
    return drawing(
      [
        ...head([x(-10.5), 0], [x(1), 0]),
        ...[-9, -8, -7, -6, -5, -4, -3, -2, -1, 0].map((t) => seg([x(t), -0.08], [x(t), 0.08])),
        ...[-9, -6, -3, 0].flatMap((t) => dotAt([x(t), 0], String(t), "s", "action")),
        seg([x(-9), 0], [x(-7), 0], "result"),
        ...dotAt([x(-7), 0], "a = −7", "ne", "result"),
        note([x(-9), 0.05], "r = 2", "n"),
        note([x(-4.5), -0.9], "−7 = (−3) · 3 + 2", "s"),
      ],
      "For example, a = −7 and d = 3. The multiples of 3 are marked, and the nearest one at or to the left of −7 is −9 = (−3) · 3, not −6. Stepping back from a to it gives r = 2, so q = −3 and −7 = (−3) · 3 + 2.",
      "例如，a = −7，d = 3。图中标出了 3 的倍数，−7 左侧或恰好在其上的最近倍数是 −9 = (−3) · 3，而不是 −6。从 a 退到它得 r = 2，所以 q = −3，−7 = (−3) · 3 + 2。",
    );
  })(),
  "the-euclidean-algorithm#the-gcd-from-cutting-squares": drawing(
    [...tiling(15, 6, 0.5), note([3.75, -0.1], "15 = 2 · 6 + 3,  6 = 2 · 3,  gcd = 3", "s")],
    "For example, a 15 by 6 rectangle. It holds 2 squares of side 6, since 15 = 2 · 6 + 3, and leaves a 3 by 6 piece. That piece holds 2 squares of side 3 exactly, since 6 = 2 · 3. The last square has side 3, the greatest common divisor.",
    "例如，15 乘 6 的矩形。它能放 2 个边长为 6 的正方形，因为 15 = 2 · 6 + 3，剩下 3 乘 6 的一块。这一块恰好放下 2 个边长为 3 的正方形，因为 6 = 2 · 3。最后的正方形边长为 3，就是最大公约数。",
  ),
  "the-euclidean-algorithm#the-euclidean-algorithm-as-a-tiling-by-squares": drawing(
    [...tiling(13, 5, 0.6), note([3.9, -0.1], "13 = 2 · 5 + 3,  5 = 1 · 3 + 2,  3 = 1 · 2 + 1,  2 = 2 · 1", "s")],
    "For example, a 13 by 5 rectangle cut into 2 squares of side 5, 1 of side 3, 1 of side 2 and 2 of side 1. The numbers of squares 2, 1, 1 and 2 are the quotients of the algorithm. The final squares of side 1 fill the last leftover exactly, so the greatest common divisor of 13 and 5 is 1.",
    "例如，13 乘 5 的矩形切成 2 个边长 5、1 个边长 3、1 个边长 2 和 2 个边长 1 的正方形。正方形的个数 2、1、1、2 就是算法的商。最后边长为 1 的正方形恰好填满最后的剩余部分，所以 13 和 5 的最大公约数是 1。",
  ),
  "injections#injectivity-from-a-drawn-graph": drawing(
    pane(0, [-3, 3, 1], [0, 6, 1], 6, 5)
      .f((x) => x * x, -2.4, 2.4, "result")
      .path(
        [
          [-3, 4],
          [3, 4],
        ],
        "action",
        true,
      )
      .dot(-2, 4, "(−2, 4)", "nw", "action")
      .dot(2, 4, "(2, 4)", "ne", "action")
      .say(1.6, 1, "y = x²", "e")
      .marks(),
    "For example, y = x². The dashed horizontal line y = 4 meets the graph twice, at x = −2 and x = 2. These different inputs give the same output, so the function is not injective.",
    "例如，y = x²。虚线水平线 y = 4 与图像相交两次，在 x = −2 和 x = 2。这两个不同的输入给出相同的输出，所以函数不是单射。",
  ),
  "proving-injectivity#injectivity-on-a-restricted-domain": drawing(
    pane(0, [-1, 7, 1], [-9, 9, 3], 7, 5.4)
      .f((x) => x * x - 6 * x, -1, 3, undefined, true)
      .f((x) => x * x - 6 * x, 3, 7, "result")
      .dot(0, 0, "f(0) = 0", "ne")
      .dot(6, 0, "f(6) = 0", "se", "result")
      .dot(3, -9, "(3, −9)", "e", "result")
      .marks(),
    "The graph of f(x) = x² − 6x with its vertex at (3, −9). The two points f(0) = f(6) = 0 lie on opposite sides of the vertex, so f is not injective on all the real numbers. The solid part on [3, ∞) has only points on one side, and there f is injective.",
    "f(x) = x² − 6x 的图像，顶点在 (3, −9)。满足 f(0) = f(6) = 0 的两点位于顶点两侧，所以 f 在全体实数上不是单射。[3, ∞) 上的实线部分只有一侧的点，在那里 f 是单射。",
  ),
  "modular-congruence#walking-around-a-residue-clock": drawing(
    [...clock(7, [0, 3]), ...arc(1.55, 90, 90 - (3 * 360) / 7), note([0, -2.5], "17 = 2 · 7 + 3", "s")],
    "For example, n = 7 and a walk of 17 steps from 0. Since 17 = 2 · 7 + 3, the 2 full turns change nothing, and the arrow shows the 3 steps that count, ending at 3.",
    "例如，n = 7，从 0 出发走 17 步。因为 17 = 2 · 7 + 3，2 个整圈没有改变，箭头表示真正起作用的 3 步，终点是 3。",
  ),
  "symmetric-and-antisymmetric-relations#properties-of-a-relation-from-its-digraph": (() => {
    const v: Vertices = { a: [0, 0], b: [3.4, 0], c: [1.7, 2.6] };
    return drawing(
      [
        ...bow(v.a as Point, v.b as Point, 0.4),
        ...bow(v.b as Point, v.a as Point, 0.4),
        ...head(v.b as Point, [1.78, 2.48], "result"),
        loop(v.a as Point, 200),
        loop(v.b as Point, -20),
        loop(v.c as Point, 90),
        ...net(v, [], { plain: true }),
        note([-0.1, -0.5], "a", "s"),
        note([3.5, -0.5], "b", "s"),
        note([1.95, 2.6], "c", "e"),
      ],
      "For example, a relation on three points. Every point has a loop, so it is reflexive. The highlighted arrow from b to c has no partner going back, so it is not symmetric. And a and b have arrows in both directions, so it is not antisymmetric either.",
      "例如，三个点上的关系。每个点都有环，所以它是自反的。突出显示的从 b 到 c 的箭头没有返回的配对，所以它不是对称的。而 a 和 b 之间有两个方向的箭头，所以它也不是反对称的。",
    );
  })(),
  "the-integers-modulo-n#walking-on-a-residue-clock": drawing(
    [...clock(12, [3, 8]), ...arc(1.55, 0, -150), note([0, -2.5], "29 = 2 · 12 + 5", "s")],
    "For example, ℤ₁₂, starting at 3 and adding 29. Since 29 = 2 · 12 + 5, only 5 steps matter, and the arrow shows them going clockwise from 3 to 8.",
    "例如，在 ℤ₁₂ 中从 3 出发加 29。因为 29 = 2 · 12 + 5，只有 5 步起作用，箭头表示它们沿顺时针从 3 走到 8。",
  ),
};
