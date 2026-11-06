// Drawings in more explanations of grade 8 and of Geometry: each shows the explanation's own
// numbers, or an example with numbers of its own when the explanation has none.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { chart, curveOf, openPt, tag, toward, traced } from "./explanation-drawings-charts.ts";
import { ln, pt, shift, view } from "./explanation-drawings-geometry-2.ts";
import { gridRect, poly, regular, side, text } from "./explanation-drawings-grades-2.ts";
import { arrows, dash, edge, mini, ticks } from "./explanation-drawings-grades-3.ts";
import {
  angle,
  coneMarks,
  cylinderMarks,
  dotAt,
  drawing,
  fromAngles,
  fromSides,
  graphed,
  name,
  note,
  on,
  pair,
  ring,
  type Style,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

type Corner = readonly [n: number, style: Style, label: string];

/** crossed is two parallel lines cut by a transversal whose upper part points at the given angle, with angles 1 to 4 on ℓ and 5 to 8 on m: upper left, upper right, lower left, lower right. */
const crossed = (up: number, corners: readonly Corner[], w = 7, h = 3): Mark[] => {
  const low: Point = [w / 2 - h / (2 * Math.tan((up * Math.PI) / 180)), 0];
  const high: Point = [w / 2 + h / (2 * Math.tan((up * Math.PI) / 180)), h];
  const marks: Mark[] = [
    seg([0, h], [w, h]),
    seg([0, 0], [w, 0]),
    seg(on(up, 1.6, high), on(up + 180, 1.6, low)),
    arrows([0.3, h], [1.1, h]),
    arrows([0.3, 0], [1.1, 0]),
    note([w, h], "ℓ", "e"),
    note([w, 0], "m", "e"),
  ];
  for (const [n, style, label] of corners) {
    const v = n <= 4 ? high : low;
    const i = (n - 1) % 4;
    const a = i === 0 || i === 2 ? 180 : 0;
    const b = i < 2 ? up : up + 180;
    marks.push(angle(v, on(a, 1.2, v), on(b, 1.2, v), style, label));
  }
  return marks;
};

/** clipped is the part of the line y = mx + b inside a mini panel, whose axes reach ±2. */
const clipped = (m: number, b: number, s?: Style, dashed = false, r = 2): Mark => {
  const xs = (m === 0 ? [-r, r] : [(-r - b) / m, (r - b) / m]).sort((p, q) => p - q);
  const lo = Math.max(-r, xs[0] as number);
  const hi = Math.min(r, xs[1] as number);
  return seg([lo, m * lo + b], [hi, m * hi + b], s, dashed);
};

/** dots is a dot at each point. */
const dots = (points: readonly Point[], tone?: "action" | "result"): Mark[] =>
  points.map((at): Mark => ({ kind: "dot", at, ...(tone && { tone }) }));

/** bare is a point with no label on a plane. */
const bare = (at: Point, tone?: "action" | "result"): PlaneMark => ({ kind: "point", at, ...(tone && { tone }) });

/** anglePanel is one angle of the given size at x. */
const anglePanel = (x: number, degrees: number, label: string, s?: Style): Mark[] =>
  shift([seg([0, 0], [2.2, 0]), seg([0, 0], on(degrees, 2.2)), angle([0, 0], on(0, 2), on(degrees, 2), s, label)], x);

const rising: Point[] = [
  [-1.7, -1.5],
  [-1.2, -0.7],
  [-0.8, -0.9],
  [-0.3, -0.2],
  [0.2, -0.3],
  [0.6, 0.5],
  [1.1, 0.6],
  [1.6, 1.4],
];
const falling = rising.map(([x, y]): Point => [x, -y]);
const noTrend: Point[] = [
  [-1.6, 0.8],
  [-1.2, -1.2],
  [-0.7, 1.4],
  [-0.3, -0.4],
  [0.2, 1],
  [0.6, -1.5],
  [1.1, 0.3],
  [1.6, -0.8],
];
const curved: Point[] = [-1.8, -1.3, -0.8, -0.3, 0.2, 0.7, 1.2, 1.7].map((x): Point => [x, x * x * 0.9 - 1.5]);
const close: Point[] = [
  [-1.6, -1.1],
  [-1.1, -0.6],
  [-0.6, -0.5],
  [-0.1, 0],
  [0.4, 0.1],
  [0.9, 0.7],
  [1.4, 0.8],
];

// A quadrilateral with exterior angles 36°, 72°, 108° and 144°: the first two sides are chosen and the other two close it.
const headings = [0, 36, 108, 216];
const dir = (d: number): Point => on(d, 1);
const quadSides = (() => {
  const [u0, u1, u2, u3] = headings.map(dir) as [Point, Point, Point, Point];
  const [l0, l1] = [5, 3];
  const r: Point = [-(l0 * u0[0] + l1 * u1[0]), -(l0 * u0[1] + l1 * u1[1])];
  const det = u2[0] * u3[1] - u3[0] * u2[1];
  return [l0, l1, (r[0] * u3[1] - u3[0] * r[1]) / det, (u2[0] * r[1] - r[0] * u2[1]) / det] as const;
})();
const quad: Point[] = headings.reduce<Point[]>(
  (acc, h, i) => {
    const last = acc[acc.length - 1] as Point;
    if (i < 3) acc.push(on(h, quadSides[i] as number, last));
    return acc;
  },
  [[0, 0]],
);

// Two triangles meeting at a crossing with angles of 60° there.
const crossingO: Point = [0, 0];
const crossP = on(150, 3 * Math.sin((70 * Math.PI) / 180));
const crossQ = on(210, 3 * Math.sin((50 * Math.PI) / 180));
const crossR = on(30, 3 * Math.sin((55 * Math.PI) / 180));
const crossS = on(-30, 3 * Math.sin((65 * Math.PI) / 180));

const octagon = regular(8, 3);
const decagon = regular(10, 3);
const pentagon = regular(5, 3);

const ownPoints: readonly Point[] = [
  [1, 2],
  [2, 4],
  [3, 3],
  [4, 5],
  [5, 4],
  [5, 6],
  [6, 5],
  [7, 7],
  [8, 6],
];

const scoreChart = chart({ x: [0, 8, 2], y: [0, 10, 2], xName: "h", yName: "y" });
const motionQuad: Point[] = [
  [0, 0],
  [2, 0],
  [2.4, 1.4],
  [0.6, 1.8],
];

/** gradeDrawings5 are drawings in further explanations of grade 8 and of Geometry, by topic and knowledge point. */
export const gradeDrawings5: Readonly<Record<string, Figure>> = {
  "finding-greatest-common-factors-using-prime-factorization#the-largest-square-tile-for-a-floor": drawing(
    [...gridRect(3, 2), side([0, 0], [3, 0], "18"), side([3, 0], [3, 2], "12"), note([0.5, 2], "6", "n"), note([0, 1.5], "6", "w")],
    "For example, a 12 by 18 floor: the greatest common factor is 6, so a tile of side 6 fits 3 along one side and 2 along the other, 6 tiles in all.",
    "例如，12 × 18 的地面：最大公因数是 6，所以边长 6 的地砖一边放 3 块、另一边放 2 块，共 6 块。",
  ),
  "horizontal-and-vertical-lines#points-on-a-horizontal-or-vertical-line": graphed(
    view(-4, 8, 2, -4, 8),
    [
      ln([-4, -2], [8, -2], "action"),
      ln([4, -4], [4, 8]),
      pt([7, -2], "(7, −2)", "n", "result"),
      pt([-2, 7], "(−2, 7)", "e", "action"),
      tag([-3, -2], "y = −2", "n"),
      tag([4, 6], "x = 4", "e"),
    ],
    "The horizontal line y = −2 passes through (7, −2) and misses (−2, 7). The line x = 4 is vertical, parallel to the y-axis.",
    "水平直线 y = −2 经过 (7, −2)，不经过 (−2, 7)。直线 x = 4 是竖直的，平行于 y 轴。",
  ),
  "horizontal-and-vertical-lines#the-rectangle-inside-four-lines": graphed(
    view(-1, 7, 1, -3, 4),
    [
      ln([1, -3], [1, 4]),
      ln([5, -3], [5, 4]),
      ln([-1, 2], [7, 2]),
      ln([-1, -1], [7, -1]),
      tag([3, -1], "4", "s"),
      tag([5, 0.5], "3", "e"),
      tag([1, 3.5], "x = 1", "w"),
      tag([5, 3.5], "x = 5", "e"),
      tag([6, 2], "y = 2", "n"),
      tag([6, -1], "y = −1", "s"),
    ],
    "For example, the lines x = 1, x = 5, y = −1 and y = 2 enclose a rectangle of width 5 − 1 = 4 and height 2 − (−1) = 3.",
    "例如，直线 x = 1、x = 5、y = −1、y = 2 围成宽 5 − 1 = 4、高 2 − (−1) = 3 的长方形。",
  ),
  "slope-as-a-unit-rate-in-proportional-relationships#unit-rate-from-two-points": drawing(
    (() => {
      const c = chart({ x: [0, 6, 1], y: [0, 300, 50], xName: "t", yName: "d" });
      return [
        ...c.marks,
        seg(c.at(0, 0), c.at(300 / 55, 300)),
        seg(c.at(2, 110), c.at(5, 110), "accent", true),
        seg(c.at(5, 110), c.at(5, 275), "result", true),
        ...dotAt(c.at(2, 110), "(2, 110)", "nw"),
        ...dotAt(c.at(5, 275), "(5, 275)", "nw"),
        note(c.at(3.5, 110), "3", "s"),
        note(c.at(5, 192), "165", "e"),
      ];
    })(),
    "The car's graph through (2, 110) and (5, 275): a rise of 165 miles over a run of 3 hours, 55 miles per hour.",
    "汽车的图像经过 (2, 110) 和 (5, 275)：3 小时升高 165 英里，每小时 55 英里。",
  ),
  "identifying-the-number-of-solutions-to-a-system-by-inspection#comparing-coefficients": drawing(
    [
      ...mini(0, [clipped(1, 0), clipped(-0.5, 0.5, "action"), ...dots([[1 / 3, 1 / 3]], "result")], "1"),
      ...mini(6, [clipped(0.5, 0.8), clipped(0.5, -0.8, "action")], "∅"),
      ...mini(12, [clipped(0.7, 0.2, "accent")], "∞"),
    ],
    "Lines with different slopes meet once, parallel lines never meet, and two equations of one line share every point.",
    "斜率不同的直线相交一次，平行线不相交，同一条直线的两个方程共有所有点。",
  ),
  "representations-of-functions#the-rule-behind-a-table": graphed(
    view(-1, 5, 1, -1, 9),
    [
      curveOf((x) => 2 * x + 1),
      pt([0, 1], "(0, 1)", "w", "result"),
      pt([1, 3], "(1, 3)", "w"),
      pt([2, 5], "(2, 5)", "w"),
      pt([3, 7], "(3, 7)", "w"),
    ],
    "For example, a table with outputs 1, 3, 5, 7 at inputs 0, 1, 2, 3 goes up 2 per step and is 1 at zero: y = 2x + 1.",
    "例如，输入 0、1、2、3 时输出 1、3、5、7 的表：每步增加 2，零处为 1，所以 y = 2x + 1。",
  ),
  "graphs-of-functions#reading-values-from-a-graph": graphed(
    view(-4, 4, 1, -8, 3),
    [curveOf((x) => x * x - 7), edge([2, 0], [2, -3], "action", true), pt([2, -3], "(2, −3)", "e", "result")],
    "A graph through (2, −3), here f(x) = x² − 7: from x = 2 on the axis, move down to the graph, so f(2) = −3.",
    "经过 (2, −3) 的图像，这里是 f(x) = x² − 7：从轴上 x = 2 向下移到图像，所以 f(2) = −3。",
  ),
  "graphs-of-functions#solving-equations-from-a-graph": graphed(
    view(-4, 4, 1, -2, 6),
    [
      curveOf((x) => x * x - 1),
      ln([-4, 3], [4, 3], "action", true),
      pt([-2, 3], "(−2, 3)", "nw", "result"),
      pt([2, 3], "(2, 3)", "ne", "result"),
      tag([-3.2, 3], "y = 3", "s"),
    ],
    "For example, f(x) = x² − 1 and c = 3: the line y = 3 meets the graph at x = −2 and x = 2, so there are two solutions.",
    "例如，f(x) = x² − 1，c = 3：直线 y = 3 与图像交于 x = −2 和 x = 2，所以有两个解。",
  ),
  "graphs-of-functions#points-on-a-graph": graphed(
    view(-3, 8, 1, -2, 9),
    [curveOf((x) => 2 * x * x - 1), pt([2, 7], "(2, 7)", "e", "result"), pt([7, 2], "(7, 2)", "n", "action")],
    "The graph of f(x) = 2x² − 1 passes through (2, 7), and (7, 2) lies far from it.",
    "f(x) = 2x² − 1 的图像经过 (2, 7)，而 (7, 2) 离它很远。",
  ),
  "increasing-and-decreasing#intervals-of-increase-and-decrease": graphed(
    view(-5, 6, 1, -4, 5),
    [
      edge([-4, -2], [1, 3], "result"),
      edge([1, 3], [5, -1], "action"),
      bare([-4, -2]),
      pt([1, 3], "(1, 3)", "n"),
      bare([5, -1]),
      tag([-2.5, 0.5], "↗", "nw"),
      tag([3.5, 0.5], "↘", "ne"),
    ],
    "A graph that rises from x = −4 to x = 1 and falls from x = 1 to x = 5: increasing on (−4, 1) and decreasing on (1, 5).",
    "从 x = −4 到 x = 1 上升、从 x = 1 到 x = 5 下降的图像：在 (−4, 1) 上递增，在 (1, 5) 上递减。",
  ),
  "identifying-maximum-and-minimum-values-of-a-function#the-greatest-or-least-value": graphed(
    view(-4, 5, 1, -3, 5),
    [
      edge([-3, 1], [-1, 4]),
      edge([-1, 4], [2, -2]),
      edge([2, -2], [4, 1]),
      edge([-1, 4], [0, 4], "result", true),
      edge([2, -2], [0, -2], "action", true),
      pt([-1, 4], "max 4", "n", "result"),
      pt([2, -2], "min −2", "s", "action"),
    ],
    "For example, the highest point (−1, 4) reads across to a maximum of 4, and the lowest point (2, −2) to a minimum of −2. The maximum is not at the right end.",
    "例如，最高点 (−1, 4) 向纵轴读得最大值 4，最低点 (2, −2) 读得最小值 −2。最大值不在右端。",
  ),
  "identifying-maximum-and-minimum-values-of-a-function#where-the-extreme-value-occurs": graphed(
    view(-2, 6, 1, -2, 6),
    [
      curveOf((x) => -((x - 2) ** 2) + 4, undefined, -0.5, 4.6),
      edge([2, 4], [0, 4], "action", true),
      edge([2, 4], [2, 0], "result", true),
      pt([2, 4], "(2, 4)", "ne"),
      tag([2, 0], "x = 2", "s"),
      tag([0, 4], "4", "nw"),
    ],
    "For example, the highest point of this parabola is (2, 4): the maximum value is 4, and it occurs at x = 2.",
    "例如，这条抛物线的最高点是 (2, 4)：最大值是 4，在 x = 2 处取得。",
  ),
  "identifying-maximum-and-minimum-values-of-a-function#the-extreme-value-on-an-interval": graphed(
    view(-1, 7, 1, -1, 11),
    [
      curveOf((x) => (x - 2) ** 2 + 1, undefined, 0, 5),
      pt([0, 5], "(0, 5)", "w"),
      pt([2, 1], "(2, 1)", "s", "action"),
      pt([5, 10], "(5, 10)", "e", "result"),
    ],
    "For example, y = (x − 2)² + 1 on 0 ≤ x ≤ 5: the vertex gives the least value 1, and comparing the ends, 5 and 10, gives the greatest value 10.",
    "例如，y = (x − 2)² + 1，0 ≤ x ≤ 5：顶点给出最小值 1，比较两端 5 和 10，得最大值 10。",
  ),
  "global-extrema#maximum-and-minimum-values": graphed(
    view(-5, 7, 1, -5, 6),
    [
      edge([-4, 0], [-2, 3]),
      edge([-2, 3], [0, -1]),
      edge([0, -1], [2, 5]),
      edge([2, 5], [4, -3]),
      pt([2, 5], "max = 5", "e", "result"),
      pt([4, -3], "min = −3", "s", "action"),
    ],
    "For example, the highest point is (2, 5), so the maximum value is 5, and the lowest is (4, −3), so the minimum value is −3.",
    "例如，最高点是 (2, 5)，最大值是 5；最低点是 (4, −3)，最小值是 −3。",
  ),
  "global-extrema#extrema-that-do-not-exist": graphed(
    view(-1, 6, 1, -1, 6),
    [edge([0, 1], [4, 5]), bare([0, 1]), openPt([4, 5], "(4, 5)", "e")],
    "A graph rising to an open dot at (4, 5): the outputs get as close to 5 as we like but never equal 5, so there is no maximum value.",
    "上升到 (4, 5) 处空心点的图像：输出可以任意接近 5，但永远不等于 5，所以没有最大值。",
  ),
  "describing-the-functional-relationship-between-two-quantities-from-a-graph#reading-the-intervals": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 6, 2], xName: "t", yName: "y" });
      return [
        ...c.marks,
        seg(c.at(0, 0), c.at(2, 4), "result"),
        seg(c.at(2, 4), c.at(4, 4)),
        seg(c.at(4, 4), c.at(8, 6), "accent"),
        seg(c.at(8, 6), c.at(10, 0), "action"),
        note(c.at(1, 2), "↗", "nw"),
        note(c.at(3, 4), "=", "n"),
        note(c.at(6, 5), "↗", "nw"),
        note(c.at(9, 3), "↘", "e"),
      ];
    })(),
    "For example, a steep rise, a flat piece, a gentle rise that ends higher, and a fall. The first rise is the faster, even though the second ends higher.",
    "例如，陡升、水平段、结束时更高的缓升，以及下降。第一次上升更快，尽管第二次结束时更高。",
  ),
  "describing-the-functional-relationship-between-two-quantities-from-a-graph#describing-the-whole-graph": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 6, 2], xName: "t", yName: "y" });
      return [...c.marks, seg(c.at(0, 0), c.at(1, 5), "result"), seg(c.at(1, 5), c.at(4, 5)), seg(c.at(4, 5), c.at(9, 0), "action")];
    })(),
    "A graph that rises steeply, is horizontal, then falls gently: the quantity increases quickly, stays the same, then decreases slowly.",
    "陡升、水平、再缓降的图像：量先快速增加，再保持不变，然后缓慢减少。",
  ),
  "describing-the-functional-relationship-between-two-quantities-from-a-graph#the-fastest-part-of-a-trip": drawing(
    (() => {
      const c = chart({ x: [0, 5, 1], y: [0, 8, 2], xName: "t", yName: "d" });
      return [...c.marks, seg(c.at(0, 0), c.at(2, 2)), seg(c.at(2, 2), c.at(3, 6), "result"), seg(c.at(3, 6), c.at(5, 8))];
    })(),
    "For example, a trip of distance 2 in the first 2 hours, 4 in the next hour and 2 in the last 2 hours: the steepest part, the third hour, is the fastest.",
    "例如，前 2 小时走 2，下一小时走 4，最后 2 小时走 2：最陡的部分，即第三小时，最快。",
  ),
  "modeling-with-two-variable-linear-equations#slope-and-intercept-in-context": drawing(
    (() => {
      const c = chart({ x: [0, 40, 10], y: [0, 1000, 200], xName: "t", yName: "V" });
      return [
        ...c.marks,
        seg(c.at(0, 900), c.at(30, 0)),
        ...dotAt(c.at(0, 900), "900", "e", "result"),
        seg(c.at(10, 600), c.at(20, 600), "accent", true),
        seg(c.at(20, 600), c.at(20, 300), "action", true),
        note(c.at(15, 600), "10 min", "n"),
        note(c.at(20, 450), "−300 L", "e"),
      ];
    })(),
    "V = −30t + 900: the line starts at 900 and loses 300 liters in every 10 minutes, which is 30 liters a minute.",
    "V = −30t + 900：直线从 900 开始，每 10 分钟减少 300 升，即每分钟 30 升。",
  ),
  "analyzing-graphs-of-linear-models#rate-from-a-graph": drawing(
    (() => {
      const c = chart({ x: [0, 30, 5], y: [0, 500, 100], xName: "t", yName: "V" });
      return [
        ...c.marks,
        seg(c.at(0, 400), c.at(26.67, 0)),
        seg(c.at(0, 100), c.at(20, 100), "accent", true),
        seg(c.at(20, 100), c.at(20, 400), "action", true),
        seg(c.at(0, 400), c.at(20, 400), undefined, true),
        ...dotAt(c.at(0, 400), "(0, 400)", "ne"),
        ...dotAt(c.at(20, 100), "(20, 100)", "ne"),
      ];
    })(),
    "A tank with 400 liters at t = 0 and 100 liters at t = 20: axes counting in 5s and 100s give a slope of −300 ÷ 20 = −15 liters per minute.",
    "t = 0 时 400 升、t = 20 时 100 升的水箱：坐标轴以 5 和 100 为单位，斜率是 −300 ÷ 20 = −15 升/分钟。",
  ),
  "analyzing-graphs-of-linear-models#values-from-a-graph": drawing(
    (() => {
      const c = chart({ x: [0, 100, 20], y: [0, 500, 100], xName: "t", yName: "V" });
      return [
        ...c.marks,
        seg(c.at(0, 400), c.at(80, 0)),
        ...dotAt(c.at(0, 400), "(0, 400)", "ne", "result"),
        ...dotAt(c.at(80, 0), "(80, 0)", "ne", "action"),
      ];
    })(),
    "A tank draining along the line through (0, 400) and (80, 0): it starts at 400 liters and is empty after 80 minutes.",
    "沿过 (0, 400) 和 (80, 0) 的直线放水的水箱：开始有 400 升，80 分钟后放空。",
  ),
  "modeling-totals-with-two-variable-equations#intercepts-of-a-total": drawing(
    (() => {
      const c = chart({ x: [0, 100, 20], y: [0, 160, 40], xName: "x", yName: "y" });
      return [
        ...c.marks,
        seg(c.at(0, 144), c.at(80, 0)),
        ...dotAt(c.at(0, 144), "(0, 144)", "ne", "result"),
        ...dotAt(c.at(80, 0), "(80, 0)", "ne", "action"),
        note(c.at(45, 70), "9x + 5y = 720", "ne"),
      ];
    })(),
    "The graph of 9x + 5y = 720 meets the axes at (80, 0) and (0, 144): 80 adult tickets alone bring in $720.",
    "9x + 5y = 720 的图像与坐标轴交于 (80, 0) 和 (0, 144)：只卖 80 张成人票就收入 720 美元。",
  ),
  "comparing-properties-of-two-functions-represented-differently#comparing-initial-values": drawing(
    (() => {
      const c = chart({ x: [-1, 6, 1], y: [-4, 16, 4], xName: "x", yName: "y" });
      return [
        ...c.marks,
        ...traced(c.at, (x) => 3 * x - 4, 0, 6, -4, 16),
        ...traced(c.at, (x) => 2 * x + 5, 0, 5.5, -4, 16, "action"),
        ...dotAt(c.at(0, -4), "A: −4", "e", "result"),
        ...dotAt(c.at(0, 5), "B: 5", "w", "result"),
        ...dotAt(c.at(2, 9), "(2, 9)", "nw"),
        ...dotAt(c.at(5, 15), "(5, 15)", "nw"),
      ];
    })(),
    "A is y = 3x − 4 and starts at −4. B passes through (2, 9) and (5, 15) and starts at 5, which is 9 greater.",
    "A 是 y = 3x − 4，初始值 −4。B 经过 (2, 9) 和 (5, 15)，初始值 5，大 9。",
  ),
  "non-adjacent-complementary-angles#spotting-complementary-angles": drawing(
    [
      ...anglePanel(0, 28, "28°", "result"),
      text([1, -0.2], "A", "s"),
      ...anglePanel(5, 152, "152°"),
      text([5.5, -0.2], "B", "s"),
      ...anglePanel(8, 62, "62°", "result"),
      text([9, -0.2], "C", "s"),
      ...anglePanel(12, 75, "75°"),
      text([13, -0.2], "D", "s"),
    ],
    "Four separate angles: A of 28° and C of 62° are complementary, though they are apart. A of 28° and B of 152° are supplementary.",
    "四个分开的角：A 为 28°、C 为 62°，互余，虽然它们不在一起。A 为 28°、B 为 152°，互补。",
  ),
  "non-adjacent-complementary-angles#complements-in-figures": drawing(
    (() => {
      const [a, b, c] = fromAngles(34, 90, 4);
      return [
        seg(on(0, 3.2), on(180, 3.2)),
        seg([0, 0], on(34, 3)),
        seg([0, 0], on(124, 3)),
        angle([0, 0], on(0, 2.4), on(34, 2.4), "result", "34°"),
        square([0, 0], on(34, 1), on(124, 1)),
        angle([0, 0], on(124, 2.4), on(180, 2.4), "action", "56°"),
        ...shift([poly(a, b, c), square(b, a, c), angle(a, b, c, "result", "34°"), angle(c, a, b, "action", "56°")], 4.5),
      ];
    })(),
    "On a line, angles of 34° and 56° lie on either side of a right angle. In a right triangle, the acute angles 34° and 56° also add up to 90°.",
    "直线上，34° 和 56° 的角分别在直角两侧。直角三角形中，锐角 34° 和 56° 之和也是 90°。",
  ),
  "non-adjacent-complementary-angles#complements-with-algebra": drawing(
    [
      seg(on(0, 3.4), on(180, 3.4)),
      seg([0, 0], on(48, 3.2)),
      seg([0, 0], on(138, 3.2)),
      square([0, 0], on(48, 1), on(138, 1)),
      angle([0, 0], on(0, 2.6), on(48, 2.6), "action", "(3x − 6)°"),
      angle([0, 0], on(138, 2.6), on(180, 2.6), "result", "(2x + 6)°"),
      name(on(180, 3.4), "A", "w"),
      name([0, 0], "B", "s"),
      name(on(0, 3.4), "C", "e"),
      name(on(138, 3.2), "D", "nw"),
      name(on(48, 3.2), "E", "ne"),
    ],
    "A right angle between two angles on a line: with x = 18, angle ABD is 42° and angle EBC is 48°, as drawn.",
    "直线上两角之间夹一个直角：x = 18 时，角 ABD 是 42°，角 EBC 是 48°，图中就这样画。",
  ),
  "corresponding-angles#the-value-that-makes-lines-parallel": drawing(
    crossed(65, [
      [2, "accent", "(3x + 5)°"],
      [6, "accent", "(x + 45)°"],
    ]),
    "For example, corresponding angles (3x + 5)° and (x + 45)°: setting them equal gives x = 20, so both are 65°, as drawn.",
    "例如，同位角 (3x + 5)° 和 (x + 45)°：令其相等得 x = 20，两角都是 65°，图中就这样画。",
  ),
  "consecutive-angles#consecutive-angles-are-supplementary": drawing(
    crossed(
      110,
      [
        [4, "accent", "∠4 = 70°"],
        [6, "action", "∠6 = 110°"],
      ],
      7,
      4.5,
    ),
    "Parallel lines ℓ and m: ∠4 of 70° and its consecutive interior partner ∠6 of 110° are between the lines, on the same side of the transversal.",
    "平行线 ℓ 和 m：70° 的 ∠4 与它的同旁内角 110° 的 ∠6 都在两线之间，在截线同侧。",
  ),
  "consecutive-angles#consecutive-angles-in-a-ratio": drawing(
    crossed(108, [
      [4, "accent", "72°"],
      [6, "action", "108°"],
    ]),
    "For example, consecutive interior angles in the ratio 2 : 3 split 180° into 5 shares of 36°, giving 72° and 108°.",
    "例如，比为 2 : 3 的同旁内角把 180° 分成 5 份，每份 36°，得 72° 和 108°。",
  ),
  "angle-criteria-for-parallel-lines#making-lines-parallel": drawing(
    crossed(70, [
      [2, "accent", "(4x − 10)°"],
      [6, "accent", "(2x + 30)°"],
    ]),
    "Corresponding angles (4x − 10)° and (2x + 30)°: the lines are parallel when x = 20, when both are 70°, as drawn.",
    "同位角 (4x − 10)° 和 (2x + 30)°：x = 20 时两线平行，此时两角都是 70°，图中就这样画。",
  ),
  "angle-criteria-for-parallel-lines#reasons-for-parallel-lines": drawing(
    [
      ...shift(
        [
          ...crossed(
            65,
            [
              [2, "accent", ""],
              [6, "accent", ""],
            ],
            5,
            2,
          ),
        ],
        0,
        6,
      ),
      ...shift(
        [
          ...crossed(
            65,
            [
              [3, "accent", ""],
              [6, "accent", ""],
            ],
            5,
            2,
          ),
        ],
        7,
        6,
      ),
      ...crossed(
        65,
        [
          [1, "accent", ""],
          [8, "accent", ""],
        ],
        5,
        2,
      ),
      ...shift(
        [
          ...crossed(
            65,
            [
              [4, "accent", ""],
              [6, "action", ""],
            ],
            5,
            2,
          ),
        ],
        7,
      ),
    ],
    "Four pairs: corresponding angles at the same corner, alternate interior angles between the lines on opposite sides, alternate exterior angles outside on opposite sides, and consecutive interior angles between the lines on the same side.",
    "四对角：同位角在相同位置，内错角在两线之间、截线两侧，外错角在两线之外、截线两侧，同旁内角在两线之间、截线同侧。",
  ),
  "exterior-angles-of-triangles#an-exterior-angle-of-an-isosceles-triangle": drawing(
    (() => {
      const [a, b, c] = fromAngles(70, 70, 4);
      const beyond: Point = [c[0] + (c[0] - a[0]) * 0.6, c[1] + (c[1] - a[1]) * 0.6];
      return [
        poly(a, b, c),
        seg(c, beyond, undefined, true),
        ticks(a, c),
        ticks(b, c),
        angle(a, b, c, "accent"),
        angle(b, c, a, "accent"),
        note(a, "70°", "w"),
        note(b, "70°", "e"),
        angle(c, beyond, b, "result", "140°"),
        angle(c, a, b, undefined, "40°"),
      ];
    })(),
    "For example, an isosceles triangle with apex 40° and base angles 70°: the exterior angle at the apex is 70° + 70° = 140°, twice a base angle.",
    "例如，顶角 40°、底角 70° 的等腰三角形：顶点处的外角是 70° + 70° = 140°，是底角的两倍。",
  ),
  "problem-solving-with-angles-of-triangles#angles-described-in-words": drawing(
    (() => {
      const [a, b, c] = fromAngles(40, 80, 5);
      return [
        poly(a, b, c),
        angle(a, b, c, "accent", "40°"),
        angle(b, c, a, "action", "80°"),
        angle(c, a, b, "result", "60°"),
        name(a, "A", "sw"),
        name(b, "B", "se"),
        name(c, "C", "n"),
      ];
    })(),
    "A triangle with angle A of 40°, angle B of 80°, twice A, and angle C of 60°, 20° more than A.",
    "角 A 为 40°、角 B 为 80°（是 A 的两倍）、角 C 为 60°（比 A 大 20°）的三角形。",
  ),
  "problem-solving-with-angles-of-triangles#angles-across-two-triangles": drawing(
    [
      poly(crossingO, crossP, crossQ),
      poly(crossingO, crossR, crossS),
      angle(crossP, crossQ, crossingO, "accent", "50°"),
      angle(crossQ, crossingO, crossP, "accent", "70°"),
      angle(crossingO, crossP, crossQ, "result", "60°"),
      angle(crossingO, crossR, crossS, "result", "60°"),
      angle(crossR, crossS, crossingO, "action", "65°"),
      angle(crossS, crossingO, crossR, "action", "55°"),
    ],
    "Two triangles meeting at a crossing with vertical angles of 60°: one has angles 50° and 70°, and the other has 65° and the missing 55°, because 50 + 70 = 65 + 55.",
    "两个三角形在交叉处相接，对顶角都是 60°：一个有 50° 和 70° 的角，另一个有 65° 和所求的 55°，因为 50 + 70 = 65 + 55。",
  ),
  "isosceles-triangles#isosceles-angle-equations": drawing(
    (() => {
      const [a, b, c] = fromAngles(40, 40, 6);
      return [
        poly(a, b, c),
        ticks(a, c),
        ticks(b, c),
        angle(a, b, c, "accent", "x°"),
        angle(b, c, a, "accent", "x°"),
        note(c, "(2x + 20)°", "n"),
        angle(c, a, b, "action"),
      ];
    })(),
    "Base angles x° and vertex (2x + 20)°: with x = 40 the vertex is 100°, as drawn.",
    "底角 x°，顶角 (2x + 20)°：x = 40 时顶角是 100°，图中就这样画。",
  ),
  "isosceles-triangles#two-cases-for-the-given-angle": drawing(
    (() => {
      const one = fromAngles(40, 40, 5);
      const two = fromAngles(70, 70, 3);
      return [
        poly(...one),
        ticks(one[0], one[2]),
        ticks(one[1], one[2]),
        angle(one[0], one[1], one[2], "result", "40°"),
        angle(one[1], one[2], one[0], "accent", "40°"),
        note(one[2], "100°", "n"),
        ...shift(
          [
            poly(...two),
            ticks(two[0], two[2]),
            ticks(two[1], two[2]),
            angle(two[0], two[1], two[2], "accent"),
            angle(two[1], two[2], two[0], "accent"),
            note(two[0], "70°", "w"),
            note(two[1], "70°", "e"),
            angle(two[2], two[0], two[1], "result", "40°"),
          ],
          6.5,
        ),
      ];
    })(),
    "For example, a known angle of 40°: as a base angle it gives 40°, 40° and 100°, and as the vertex it gives 40°, 70° and 70°.",
    "例如，已知角为 40°：作为底角，得 40°、40°、100°；作为顶角，得 40°、70°、70°。",
  ),
  "angles-of-polygons#angles-of-regular-polygons": drawing(
    (() => {
      const [v, next, prev] = [octagon[0] as Point, octagon[1] as Point, octagon[7] as Point];
      const beyond: Point = [v[0] + (v[0] - prev[0]) * 0.9, v[1] + (v[1] - prev[1]) * 0.9];
      return [
        poly(...octagon),
        seg(v, beyond, undefined, true),
        angle(v, beyond, next, "result", "45°"),
        angle(v, next, prev, "accent", "135°"),
      ];
    })(),
    "A regular octagon: each exterior angle is 360° ÷ 8 = 45°, and the interior angle beside it is 135°.",
    "正八边形：每个外角是 360° ÷ 8 = 45°，相邻的内角是 135°。",
  ),
  "exterior-angles-of-polygons#exterior-angle-equations": drawing(
    (() => {
      const n = quad.length;
      const ext = [144, 36, 72, 108];
      const letters = ["4x°", "x°", "2x°", "3x°"];
      return [
        poly(...quad),
        ...quad.flatMap((v, i): Mark[] => {
          const prev = quad[(i + n - 1) % n] as Point;
          const next = quad[(i + 1) % n] as Point;
          const len = Math.hypot(v[0] - prev[0], v[1] - prev[1]);
          const beyond: Point = [v[0] + ((v[0] - prev[0]) / len) * 1.6, v[1] + ((v[1] - prev[1]) / len) * 1.6];
          return [seg(v, beyond, undefined, true), angle(v, beyond, next, ext[i] === 144 ? "result" : "accent", letters[i])];
        }),
      ];
    })(),
    "A quadrilateral with exterior angles x°, 2x°, 3x° and 4x°, drawn with x = 36: the largest exterior angle, 144°, is beside the smallest interior angle, 36°.",
    "外角为 x°、2x°、3x°、4x° 的四边形，按 x = 36 画：最大的外角 144° 紧邻最小的内角 36°。",
  ),
  "regular-polygons#sides-from-angle-relationships": drawing(
    (() => {
      const [v, next, prev] = [decagon[0] as Point, decagon[1] as Point, decagon[9] as Point];
      const beyond: Point = [v[0] + (v[0] - prev[0]) * 1.2, v[1] + (v[1] - prev[1]) * 1.2];
      return [
        poly(...decagon),
        seg(v, beyond, undefined, true),
        angle(v, beyond, next, "result", "36°"),
        angle(v, next, prev, "accent", "144°"),
      ];
    })(),
    "A regular decagon: the interior angle of 144° is 4 times the exterior angle of 36°, and 360 ÷ 36 = 10 sides.",
    "正十边形：144° 的内角是 36° 外角的 4 倍，且 360 ÷ 36 = 10 条边。",
  ),
  "regular-polygons#angles-formed-by-a-diagonal": drawing(
    (() => {
      const [a, b, c] = [pentagon[0] as Point, pentagon[1] as Point, pentagon[2] as Point];
      return [
        poly(...pentagon),
        seg(a, c, "result"),
        ticks(a, b),
        ticks(b, c),
        angle(b, c, a, "action", "108°"),
        angle(a, b, c, "accent", "36°"),
        angle(c, a, b, "accent", "36°"),
        name(a, "A", "n"),
        name(b, "B", "w"),
        name(c, "C", "s"),
      ];
    })(),
    "A regular pentagon: the diagonal AC cuts off an isosceles triangle ABC with the angle 108° at B and base angles of 36°.",
    "正五边形：对角线 AC 截出等腰三角形 ABC，B 处的角是 108°，底角是 36°。",
  ),
  "verifying-properties-of-rigid-motions#corresponding-measures": pair(
    {
      shape: fromAngles(60, 70),
      names: ["A", "B", "C", "Q", "R", "P"],
      lengths: [[0, "7", "7"]],
      corners: [[2, "accent", "50°", "50°"]],
    },
    "A rigid motion maps A to Q, B to R and C to P: AB = QR = 7, and the angles at C and P are both 50°.",
    "刚体运动把 A 映到 Q，B 到 R，C 到 P：AB = QR = 7，C 和 P 处的角都是 50°。",
  ),
  "verifying-properties-of-rigid-motions#what-a-rigid-motion-keeps": drawing(
    (() => {
      const labels = ["A", "B", "C", "D"];
      const copy = (points: Point[], x: number, primed = false): Mark[] =>
        shift(
          [poly(...points), ...points.map((p, i) => name(p, `${labels[i]}${primed ? "′" : ""}`, ["sw", "se", "ne", "nw"][i] as "sw"))],
          x,
        );
      return [
        ...copy(motionQuad, 0),
        ...copy(
          motionQuad.map(([x, y]): Point => [x + 0.8, y - 2.9]),
          0,
          true,
        ),
        ...copy(motionQuad, 4.6),
        ...shift(
          [
            poly(...motionQuad.map(([x, y]): Point => [-y + 2, x - 3.4])),
            ...motionQuad.map(([x, y], i) => name([-y + 2, x - 3.4], `${labels[i]}′`, (["se", "ne", "nw", "sw"] as const)[i] as "se")),
          ],
          4.6,
        ),
        text([5.8, -4.2], "90°", "s"),
        ...copy(motionQuad, 9.2),
        ...shift(
          [
            poly(...motionQuad.map(([x, y]): Point => [x, -y - 1.8])),
            ...motionQuad.map(([x, y], i) => name([x, -y - 1.8], `${labels[i]}′`, (["nw", "ne", "se", "sw"] as const)[i] as "nw")),
            dash([-0.3, -0.9], [2.7, -0.9]),
          ],
          9.2,
        ),
      ];
    })(),
    "A translation keeps each segment parallel to its image. A rotation of 90° makes each segment perpendicular to its image. A reflection turns the counterclockwise order A, B, C, D into a clockwise one.",
    "平移使每条线段与其像平行。旋转 90° 使每条线段与其像垂直。反射把逆时针的 A、B、C、D 变成顺时针。",
  ),
  "applying-sequences-of-rigid-motions#a-figure-under-a-sequence": graphed(
    view(-3, 8, 1, -4, 8),
    [
      toward([4, 1], [-1, 4], "result"),
      toward([-1, 4], [1, 1], "result"),
      toward([4, 1], [6, -2], "action"),
      toward([6, -2], [2, 6], "action"),
      pt([4, 1], "B(4, 1)", "e"),
      pt([-1, 4], "(−1, 4)", "n", "result"),
      pt([1, 1], "(1, 1)", "s", "result"),
      pt([6, -2], "(6, −2)", "e", "action"),
      pt([2, 6], "(2, 6)", "n", "action"),
    ],
    "B(4, 1) rotated and then translated goes through (−1, 4) to (1, 1). Translated first, it goes through (6, −2) to (2, 6), a different point.",
    "B(4, 1) 先旋转再平移，经 (−1, 4) 到 (1, 1)。先平移，经 (6, −2) 到 (2, 6)，是另一个点。",
  ),
  "applying-sequences-of-rigid-motions#does-the-order-matter": drawing(
    (() => {
      const panel = (x: number, stops: readonly [number, string][], s: Style): Mark[] => {
        const c = chart({ x: [0, 4, 4], y: [-6, 6, 2], xName: "x", yName: "y", w: 2.4, h: 8 });
        const a = (y: number): Point => c.at(3, y);
        return shift(
          [
            ...c.marks,
            ...stops.slice(1).map(([y], i) => seg(a((stops[i] as [number, string])[0]), a(y), s)),
            ...stops.flatMap(([y, label], i) => (label ? dotAt(a(y), label, "e", i === stops.length - 1 ? "result" : undefined) : [])),
          ],
          x,
        );
      };
      return [
        ...panel(
          0,
          [
            [2, ""],
            [-2, "(3, −2)"],
            [2, "P(3, 2)"],
          ],
          "accent",
        ),
        ...panel(
          10,
          [
            [2, "P(3, 2)"],
            [6, "(3, 6)"],
            [-6, "(3, −6)"],
          ],
          "action",
        ),
      ];
    })(),
    "P(3, 2) reflected across the x-axis and then moved up 4 goes to (3, −2) and back to (3, 2). Moved up 4 first, it goes to (3, 6) and then (3, −6).",
    "P(3, 2) 先关于 x 轴对称再上移 4，到 (3, −2) 又回到 (3, 2)。先上移 4，到 (3, 6)，再到 (3, −6)。",
  ),
  "applying-sequences-of-rigid-motions#a-single-motion-for-a-sequence": graphed(
    view(-2, 7, 1, -2, 6),
    [
      toward([2, 1], [5, 0]),
      toward([5, 0], [0, 4]),
      toward([2, 1], [0, 4], "result"),
      pt([2, 1], "(2, 1)", "s"),
      pt([5, 0], "(5, 0)", "s"),
      pt([0, 4], "(0, 4)", "w", "result"),
    ],
    "For example, (2, 1) moved by (+3, −1) and then by (−5, +4) reaches (0, 4), the same as one move by (−2, +3).",
    "例如，(2, 1) 按 (+3, −1) 再按 (−5, +4) 移动，到达 (0, 4)，等同于一次按 (−2, +3) 移动。",
  ),
  "congruence-through-rigid-motions#are-the-figures-congruent": drawing(
    [
      poly([0, 0], [5, 0], [0, 3]),
      square([0, 0], [5, 0], [0, 3]),
      side([0, 0], [5, 0], "5"),
      side([0, 3], [0, 0], "3"),
      ...shift([poly([0, 0], [4, 0], [0, 3]), square([0, 0], [4, 0], [0, 3]), side([0, 0], [4, 0], "4"), side([0, 3], [0, 0], "3")], 7),
    ],
    "Right triangles with legs 3 and 5 and with legs 3 and 4: no rigid motion can map one onto the other.",
    "直角边为 3 和 5 与直角边为 3 和 4 的直角三角形：任何刚体运动都不能把一个映到另一个。",
  ),
  "congruence-through-rigid-motions#using-a-congruence-statement": pair(
    {
      shape: fromSides(5, 11 / 3, 3),
      names: ["A", "B", "C", "Q", "R", "P"],
      lengths: [
        [0, "2x + 3", "15"],
        [1, undefined, "11"],
        [2, undefined, "9"],
      ],
    },
    "Triangles ABC and QRP in the same position: AB = 2x + 3 corresponds to QR = 15, RP is 11 and PQ is 9.",
    "三角形 ABC 和 QRP 位置对应：AB = 2x + 3 对应 QR = 15，RP 是 11，PQ 是 9。",
  ),
  "congruence-through-rigid-motions#finding-the-sequence": graphed(
    view(-6, 4, 1, -1, 5),
    [
      toward([1, 2], [-2, 1]),
      toward([-2, 1], [-4, 3], "action"),
      pt([1, 2], "A(1, 2)", "e"),
      pt([-2, 1], "(−2, 1)", "s"),
      pt([-4, 3], "A′(−4, 3)", "n", "result"),
    ],
    "A(1, 2) rotated 90° counterclockwise about the origin goes to (−2, 1), and moved by (−2, +2) it reaches A′(−4, 3).",
    "A(1, 2) 绕原点逆时针旋转 90° 到 (−2, 1)，再按 (−2, +2) 移动，到达 A′(−4, 3)。",
  ),
  "using-similar-triangles-to-explain-slope#similar-slope-triangles": graphed(
    view(-1, 11, 3, -1, 8),
    [
      ln([-1, -2 / 3], [11, 22 / 3]),
      edge([0, 0], [9, 0], "action"),
      edge([9, 0], [9, 6], "action"),
      edge([0, 0], [6, 0], "result"),
      edge([6, 0], [6, 4], "result"),
      tag([3, 0], "Δx = 6", "s"),
      tag([6, 2], "4", "e"),
      tag([7.5, 0], "Δx = 9", "s"),
      tag([9, 3], "r = 6", "e"),
    ],
    "Two slope triangles on one line: rise 4 over run 6, and with run 9 a rise of 6, the same ratio.",
    "同一条直线上的两个斜率三角形：升高 4、水平 6，水平 9 时升高 6，比值相同。",
  ),
  "using-similar-triangles-to-explain-slope#is-the-point-on-the-line": graphed(
    view(-1, 12, 1, -1, 10),
    [
      ln([-0.5, 1], [11.5, 9]),
      pt([1, 2], "A(1, 2)", "nw"),
      pt([4, 4], "B(4, 4)", "nw"),
      pt([10, 8], "(10, 8)", "se", "result"),
      pt([10, 9], "(10, 9)", "nw", "action"),
    ],
    "The line through A(1, 2) and B(4, 4) of slope 2/3 passes through (10, 8) and misses (10, 9).",
    "过 A(1, 2) 和 B(4, 4)、斜率 2/3 的直线经过 (10, 8)，不经过 (10, 9)。",
  ),
  "using-similar-triangles-to-explain-slope#deriving-the-equation-of-a-line": graphed(
    view(-1, 6, 1, -1, 9),
    [
      curveOf((x) => 1.5 * x + 1),
      edge([0, 1], [4, 1], "action"),
      edge([4, 1], [4, 7], "result"),
      pt([0, 1], "(0, 1)", "nw"),
      pt([4, 7], "(4, 7)", "nw"),
      tag([2, 1], "4", "s"),
      tag([4, 4], "6", "e"),
    ],
    "The line through (0, 1) and (4, 7): a slope triangle with run 4 and rise 6 gives the slope 3/2, so y = (3/2)x + 1.",
    "过 (0, 1) 和 (4, 7) 的直线：水平 4、升高 6 的斜率三角形给出斜率 3/2，所以 y = (3/2)x + 1。",
  ),
  "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another#choosing-the-sequence": graphed(
    view(-1, 7, 1, -1, 5),
    [
      edge([2, 4], [6, 4]),
      edge([1, 2], [3, 2], "action"),
      edge([0, 1], [2, 1], "result"),
      pt([2, 4], "A(2, 4)", "n"),
      pt([6, 4], "B(6, 4)", "n"),
      pt([1, 2], "(1, 2)", "n", "action"),
      pt([3, 2], "(3, 2)", "n", "action"),
      pt([0, 1], "A′(0, 1)", "s", "result"),
      pt([2, 1], "B′(2, 1)", "s", "result"),
    ],
    "AB of length 4 maps to A′B′ of length 2, so k = 1/2. The dilation gives the segment from (1, 2) to (3, 2), and moving it by (−1, −1) gives A′B′.",
    "长 4 的 AB 映到长 2 的 A′B′，所以 k = 1/2。位似得到从 (1, 2) 到 (3, 2) 的线段，再按 (−1, −1) 移动得到 A′B′。",
  ),
  "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another#finding-the-translation": graphed(
    view(-1, 14, 2, -1, 12),
    [
      edge([2, 1], [4, 3]),
      edge([6, 3], [12, 9], "action"),
      edge([1, 5], [7, 11], "result"),
      toward([6, 3], [1, 5]),
      pt([2, 1], "A", "s"),
      pt([4, 3], "B", "se"),
      pt([6, 3], "(6, 3)", "e", "action"),
      pt([12, 9], "(12, 9)", "e", "action"),
      pt([1, 5], "A′(1, 5)", "nw", "result"),
      pt([7, 11], "B′(7, 11)", "nw", "result"),
    ],
    "A(2, 1) and B(4, 3) are dilated by 3 to (6, 3) and (12, 9), and the move by (−5, +2) carries these to A′(1, 5) and B′(7, 11).",
    "A(2, 1) 和 B(4, 3) 按 3 位似到 (6, 3) 和 (12, 9)，再按 (−5, +2) 移动到 A′(1, 5) 和 B′(7, 11)。",
  ),
  "the-converse-of-the-pythagorean-theorem#is-it-a-right-triangle": drawing(
    [
      poly([0, 0], [4, 0], [0, 3]),
      square([0, 0], [4, 0], [0, 3]),
      side([0, 0], [4, 0], "2"),
      side([0, 3], [0, 0], "1.5"),
      side([4, 0], [0, 3], "2.5"),
    ],
    "A triangle with sides 1.5, 2 and 2.5: 1.5² + 2² = 2.5², so the angle opposite the longest side is a right angle.",
    "边长 1.5、2、2.5 的三角形：1.5² + 2² = 2.5²，所以最长边的对角是直角。",
  ),
  "the-converse-of-the-pythagorean-theorem#which-angle-is-the-right-angle": drawing(
    [
      poly([0, 0], [6, 0], [0, 2.5]),
      square([0, 0], [6, 0], [0, 2.5]),
      side([0, 0], [6, 0], "12"),
      side([0, 2.5], [0, 0], "5"),
      side([6, 0], [0, 2.5], "13"),
      name([0, 0], "A", "sw"),
      name([0, 2.5], "B", "n"),
      name([6, 0], "C", "se"),
    ],
    "Triangle ABC with AB = 5, AC = 12 and BC = 13: the longest side is BC, and the right angle is at A, opposite it.",
    "AB = 5、AC = 12、BC = 13 的三角形 ABC：最长边是 BC，直角在它的对角 A 处。",
  ),
  "the-converse-of-the-pythagorean-theorem#which-set-forms-a-right-triangle": drawing(
    (() => {
      const other = fromSides(3, 2.5, 2);
      return [
        poly([0, 0], [4, 0], [0, 3]),
        square([0, 0], [4, 0], [0, 3]),
        side([0, 0], [4, 0], "8"),
        side([0, 3], [0, 0], "6"),
        side([4, 0], [0, 3], "10"),
        ...shift([poly(...other), side(other[0], other[1], "6"), side(other[1], other[2], "5"), side(other[2], other[0], "4")], 6),
      ];
    })(),
    "6, 8, 10 forms a right triangle, because 36 + 64 = 100. 4, 5, 6 does not: 16 + 25 = 41, not 36, and its largest angle is drawn smaller than a right angle.",
    "6、8、10 组成直角三角形，因为 36 + 64 = 100。4、5、6 不能：16 + 25 = 41，不等于 36，图中它的最大角小于直角。",
  ),
  "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres#filling-one-container-with-another": drawing(
    [
      ...cylinderMarks(3, 5, "6", "10"),
      text([0, -1.2], "360π", "s"),
      ...shift([...coneMarks(1, 3, "2", "6"), text([0, -0.6], "8π", "s")], 6),
    ],
    "A cylindrical tank of radius 6 and height 10, holding 360π, and a cone-shaped cup of radius 2 and height 6, holding 8π, at the same scale: 360π ÷ 8π = 45 cups.",
    "半径 6、高 10 的圆柱形水箱容积 360π，半径 2、高 6 的圆锥形杯子容积 8π，比例相同：360π ÷ 8π = 45 杯。",
  ),
  "scatter-plots#reading-a-scatter-plot": drawing(
    [
      ...scoreChart.marks,
      ...dots(
        [
          [1, 3],
          [2, 4],
          [3, 4],
          [5, 7],
          [6, 8],
          [7, 9],
        ].map(([x, y]) => scoreChart.at(x as number, y as number)),
      ),
      seg(scoreChart.at(4, 0), scoreChart.at(4, 7), "action", true),
      seg(scoreChart.at(0, 7), scoreChart.at(4, 7), "action", true),
      ...dotAt(scoreChart.at(4, 7), "(4, 7)", "nw", "result"),
    ],
    "A scatter plot of hours and scores: the point (4, 7) is the student who studied 4 hours and scored 7. The other points are examples.",
    "学习时数和分数的散点图：点 (4, 7) 是学习 4 小时、得 7 分的学生。其他点只是示例。",
  ),
  "scatter-plots#counting-points": graphed(
    view(-1, 9, 1, -1, 8),
    [ln([5, -1], [5, 8], "action", true), ...ownPoints.map((p) => bare(p, p[0] > 5 ? "result" : undefined)), tag([5, 7.5], "x = 5", "w")],
    "For example, nine points and the line x = 5: 3 points lie strictly to the right, so x > 5 counts 3, and x ≥ 5 also counts the 2 points on the line, 5 in all.",
    "例如，九个点和直线 x = 5：3 个点严格在右边，所以 x > 5 有 3 个；x ≥ 5 还要算线上的 2 个，共 5 个。",
  ),
  "describing-patterns-of-association-in-scatter-plots#describing-an-association-in-context": drawing(
    [...mini(0, dots(rising), "+"), ...mini(6, dots(falling), "−"), ...mini(12, dots(noTrend), "∅")],
    "Points that rise from left to right show a positive association, points that fall show a negative one, and points with no trend show none.",
    "从左到右上升的点表示正相关，下降的点表示负相关，没有趋势的点表示不相关。",
  ),
  "trend-lines#judging-a-trend-line": drawing(
    [
      ...mini(0, [...dots(rising), clipped(0.85, -0.05, "result")], "✓"),
      ...mini(6, [...dots(rising), clipped(0.85, 1, "action")], ""),
      ...mini(12, [...dots(rising), clipped(-0.85, 0, "action")], "✗"),
    ],
    "One set of rising points with three lines: a line through the middle follows them well, a line above all the points is too high, and a falling line goes the wrong way.",
    "同一组上升的点和三条直线：穿过中间的直线合适，在所有点上方的直线太高，下降的直线方向不对。",
  ),
  "informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot#does-a-line-fit-the-data": drawing(
    [
      ...mini(0, [...dots(close), clipped(0.65, 0, "result")], "✓"),
      ...mini(6, [...dots(curved), clipped(0.1, -0.2, "action")], ""),
      ...mini(12, [...dots(noTrend), clipped(-0.15, 0.1, "action")], "✗"),
    ],
    "Points close to the line on both sides fit it well. Points along a curve, or scattered with no pattern, do not fit any line.",
    "在直线两侧、靠近直线的点拟合得好。沿曲线的点，或无规律分散的点，都不适合用直线拟合。",
  ),
  "predictions-with-trend-lines#predicting-a-value": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 80, 20], xName: "h", yName: "y" });
      return [
        ...c.marks,
        seg(c.at(0, 40), c.at(10, 65)),
        seg(c.at(6, 0), c.at(6, 55), "action", true),
        seg(c.at(6, 55), c.at(0, 55), "action", true),
        ...dotAt(c.at(6, 55), "(6, 55)", "nw", "result"),
      ];
    })(),
    "The trend line y = 2.5x + 40: at x = 6 hours it predicts a score of 55.",
    "趋势线 y = 2.5x + 40：x = 6 小时时预测得 55 分。",
  ),

  // Geometry
  "identifying-angle-postulates#naming-angle-postulates": drawing(
    [
      ...shift(
        [
          seg([0, 0], on(0, 3)),
          seg([0, 0], on(35, 3)),
          seg([0, 0], on(80, 3)),
          angle([0, 0], on(0, 2), on(35, 2), "accent", "a"),
          angle([0, 0], on(35, 2), on(80, 2), "action", "b"),
          text([1.5, -0.3], "+", "s"),
        ],
        0,
      ),
      ...shift(
        [
          seg(on(0, 2), on(180, 2)),
          seg([0, 0], on(60, 2.4)),
          angle([0, 0], on(0, 1.5), on(60, 1.5), "accent", "60°"),
          angle([0, 0], on(60, 1.5), on(180, 1.5), "action", "120°"),
          text([0, -0.3], "180°", "s"),
        ],
        6.5,
      ),
      ...shift(
        [
          ...crossed(
            65,
            [
              [2, "accent", ""],
              [6, "accent", ""],
            ],
            5,
            2,
          ),
        ],
        10,
      ),
    ],
    "Three pictures: two adjacent angles make a larger one, a linear pair adds up to 180°, and parallel lines cut by a transversal have congruent corresponding angles.",
    "三幅图：两个相邻的角组成更大的角，邻补角之和是 180°，平行线被截线所截时同位角全等。",
  ),
  "parallel-lines-in-the-coordinate-plane#parallel-slopes": graphed(
    view(-4, 5, 1, -6, 6),
    [
      curveOf((x) => 2 * x + 1),
      curveOf((x) => 2 * x - 5, "action"),
      curveOf((x) => 2 * x - 1.5, "result"),
      tag([2, 5], "y = 2x + 1", "w"),
      tag([4, 3], "y = 2x − 5", "e"),
      tag([3, 4.5], "4x − 2y = 3", "e"),
    ],
    "y = 2x + 1, y = 2x − 5 and 4x − 2y = 3, which is y = 2x − 1.5: three different lines with slope 2, never meeting.",
    "y = 2x + 1、y = 2x − 5 和 4x − 2y = 3（即 y = 2x − 1.5）：斜率都是 2 的三条不同直线，永不相交。",
  ),
  "parallel-lines-in-the-coordinate-plane#parallel-line-through-a-point": graphed(
    view(-6, 7, 1, -5, 7),
    [
      curveOf((x) => 0.5 * x + 3),
      curveOf((x) => 0.5 * x - 3, "result"),
      pt([4, -1], "(4, −1)", "se", "action"),
      tag([-2, 2], "y = ½x + 3", "nw"),
      tag([-2, -4], "y = ½x − 3", "se"),
    ],
    "The line through (4, −1) parallel to y = ½x + 3 is y = ½x − 3.",
    "过 (4, −1) 且平行于 y = ½x + 3 的直线是 y = ½x − 3。",
  ),
  "parallel-lines-in-the-coordinate-plane#parallel-same-or-intersecting": drawing(
    [
      ...mini(0, [clipped(1, 0), clipped(-0.5, 0.5, "action"), ...dots([[1 / 3, 1 / 3]], "result")], "m₁ ≠ m₂"),
      ...mini(6, [clipped(1, 0.8), clipped(1, -0.8, "action")], "m₁ = m₂"),
      ...mini(12, [clipped(3, -1, "accent")], "≡"),
    ],
    "Different slopes meet in one point. The same slope with different y-intercepts gives parallel lines. y = 3x − 1 and 6x − 2y = 2 are one line.",
    "斜率不同的直线交于一点。斜率相同、y 截距不同的直线平行。y = 3x − 1 和 6x − 2y = 2 是同一条直线。",
  ),
  "perpendicular-lines-in-the-coordinate-plane#perpendicular-slopes": graphed(
    view(-5, 5, 1, -5, 5),
    [
      curveOf((x) => (2 / 3) * x),
      curveOf((x) => (-3 / 2) * x, "action"),
      edge([0, 0], [3, 0], "result"),
      edge([3, 0], [3, 2], "result"),
      edge([0, 0], [0, 3], "result"),
      edge([0, 3], [-2, 3], "result"),
      tag([1.5, 0], "3", "s"),
      tag([3, 1], "2", "e"),
      tag([0, 1.5], "3", "e"),
      tag([-1, 3], "2", "n"),
    ],
    "Lines through the origin with slopes 2/3 and −3/2: turning the first slope triangle, run 3 and rise 2, a quarter turn gives rise 3 and run −2.",
    "过原点、斜率 2/3 和 −3/2 的直线：把第一个斜率三角形（水平 3、升高 2）转四分之一圈，得到升高 3、水平 −2。",
  ),
  "perpendicular-lines-in-the-coordinate-plane#perpendicular-line-through-a-point": graphed(
    view(-5, 6, 1, -3, 8),
    [
      curveOf((x) => (-2 / 3) * x + 1),
      curveOf((x) => 1.5 * x + 2, "result"),
      pt([2, 5], "(2, 5)", "e", "action"),
      tag([-3.5, 3.5], "y = −⅔x + 1", "n"),
      tag([3.2, 6.8], "y = (3/2)x + 2", "w"),
    ],
    "The line through (2, 5) perpendicular to y = −⅔x + 1 is y = (3/2)x + 2.",
    "过 (2, 5) 且垂直于 y = −⅔x + 1 的直线是 y = (3/2)x + 2。",
  ),
  "perpendicular-lines-in-the-coordinate-plane#parallel-perpendicular-or-neither": graphed(
    view(-4, 6, 1, -5, 5),
    [
      curveOf((x) => -2 * x + 1),
      curveOf((x) => 0.5 * x - 3, "action"),
      tag([-1.5, 4], "y = −2x + 1", "e"),
      tag([4.5, -0.75], "x − 2y = 6", "s"),
      pt([1.6, -2.2], "(1.6, −2.2)", "sw", "result"),
    ],
    "y = −2x + 1 and x − 2y = 6, of slopes −2 and ½, meet at right angles.",
    "y = −2x + 1 和 x − 2y = 6，斜率为 −2 和 ½，垂直相交。",
  ),
  "determining-circle-properties-by-completing-the-square#circle-point-or-nothing": drawing(
    [...mini(0, [ring(1.2)], "c > 0"), ...mini(6, dots([[0.8, 0.6]], "result"), "c = 0"), ...mini(12, [], "c < 0: ∅")],
    "Completing the square gives a circle when c is positive, a single point when c is 0, and no points when c is negative.",
    "配方后，c 为正时是圆，c 为 0 时是一个点，c 为负时没有点。",
  ),
};
