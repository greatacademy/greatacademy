// Drawings in the explanations of Algebra I: graphs recomputed from the equations in the text,
// or an example with numbers of its own when the text has none.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { type Chart, chart, curveOf, openPt, tag, toward, traced } from "./explanation-drawings-charts.ts";
import { ln, pt, rect, shift, view } from "./explanation-drawings-geometry-2.ts";
import { hop, side, spot, text } from "./explanation-drawings-grades-2.ts";
import { edge, mini, ray, realLine } from "./explanation-drawings-grades-3.ts";
import { dotAt, drawing, graphed, note, ring, seg } from "./explanation-drawings-kit.ts";

type Fn = (x: number) => number;

/** vee is the function a|x − h| + k. */
const vee =
  (h: number, k: number, a = 1): Fn =>
  (x) =>
    a * Math.abs(x - h) + k;

/** bowl is the function a(x − h)² + k. */
const bowl =
  (h: number, k: number, a = 1): Fn =>
  (x) =>
    a * (x - h) ** 2 + k;

/** bare is a point with no label on a plane. */
const bare = (at: Point, tone?: "action" | "result"): PlaneMark => ({ kind: "point", at, ...(tone && { tone }) });

/** brokenLine joins the corners of a broken line on a plane. */
const brokenLine = (points: readonly Point[], tone?: "action" | "result"): PlaneMark[] =>
  points.slice(1).map((p, i) => edge(points[i] as Point, p, tone));

/** curveOn draws f across a chart between two values of x, inside the chart's y scale. */
const curveOn = (c: Chart, f: Fn, from: number, to: number, y: readonly [number, number], tone?: "accent" | "action" | "result"): Mark[] =>
  traced(c.at, f, from, to, y[0], y[1], tone);

/** underGraph shades a region under a speed-time graph. */
const underGraph = (c: Chart, points: readonly (readonly [number, number])[], tone: "action" | "result" = "result"): Mark => ({
  kind: "shade",
  points: points.map(([x, y]) => c.at(x, y)),
  tone,
});

/** clipLine is the part of the line y = mx + b inside a mini panel, whose axes reach ±2. */
const clipLine = (m: number, b: number, s?: "accent" | "action" | "result"): Mark => {
  const r = 2;
  const xs = (m === 0 ? [-r, r] : [(-r - b) / m, (r - b) / m]).sort((p, q) => p - q);
  const lo = Math.max(-r, xs[0] as number);
  const hi = Math.min(r, xs[1] as number);
  return seg([lo, m * lo + b], [hi, m * hi + b], s);
};

/** curveInMini is y = f(x) inside a mini panel, in short segments kept inside its axes. */
const curveInMini = (f: Fn, s: "accent" | "action" | "result" = "accent"): Mark[] => {
  const marks: Mark[] = [];
  for (let i = 0; i < 48; i++) {
    const a = -2 + (i * 4) / 48;
    const b = a + 4 / 48;
    if (Math.abs(f(a)) <= 2 && Math.abs(f(b)) <= 2) marks.push(seg([a, f(a)], [b, f(b)], s));
  }
  return marks;
};

/** dots is a dot at each point. */
const dots = (points: readonly Point[]): Mark[] => points.map((at): Mark => ({ kind: "dot", at }));

/** openAt is an open circle at a point of a chart. */
const openAt = (at: Point): Mark => ring(0.09, at);

/** scatterOn is points along a curve in a mini panel, each pushed up or down in a fixed order. */
const scatterOn = (f: Fn, push: number): Mark[] => {
  const offsets = [1, -0.6, 0.4, -1, 0.8, -0.3, 0.6, -0.9, 0.2, 0.9];
  return dots(offsets.map((o, i): Point => [-1.8 + i * 0.4, f(-1.8 + i * 0.4) + o * push]));
};

const profit: Fn = (x) => -2 * x * x + 160 * x - 1800;

const speedAxes = { xName: "t", yName: "v" };

/** algebraDrawings are drawings in the explanations of Algebra I, by topic and knowledge point. */
export const algebraDrawings: Readonly<Record<string, Figure>> = {
  "interval-notation#graphs-of-bounded-intervals": drawing(
    [...realLine(-3, 6), ...ray(-3, 6, -1, false, 4), spot(7)],
    "A segment from an open circle at −1 to a closed dot at 4: the interval (−1, 4].",
    "从 −1 处的空心圆到 4 处的实心点的线段：区间 (−1, 4]。",
  ),
  "unbounded-intervals#graphs-of-unbounded-intervals": drawing(
    [...realLine(-3, 6), ...ray(-3, 6, 2, true, -3.5)],
    "A ray from a closed dot at 2 with an arrow to the left: the interval (−∞, 2].",
    "从 2 处的实心点出发、箭头向左的射线：区间 (−∞, 2]。",
  ),
  "the-coordinate-plane#reading-coordinates": graphed(
    view(-5, 5, 1, -5, 4),
    [
      edge([0, 0], [-3, 0], "action", true),
      edge([-3, 0], [-3, 2], "action", true),
      pt([-3, 2], "(−3, 2)", "n"),
      pt([0, -4], "(0, −4)", "e", "result"),
    ],
    "To reach (−3, 2), go 3 to the left and 2 up. The point (0, −4) lies on the y-axis.",
    "到 (−3, 2)：向左 3，向上 2。点 (0, −4) 在 y 轴上。",
  ),
  "the-coordinate-plane#locating-points": graphed(
    view(-6, 4, 1, -6, 4),
    [
      edge([0, 0], [2, 0], "result", true),
      edge([2, 0], [2, -5], "result", true),
      edge([0, 0], [-5, 0], "action", true),
      edge([-5, 0], [-5, 2], "action", true),
      pt([2, -5], "(2, −5)", "e", "result"),
      pt([-5, 2], "(−5, 2)", "n", "action"),
    ],
    "(2, −5) is 2 right and 5 down, and (−5, 2) is 5 left and 2 up.",
    "(2, −5) 是向右 2、向下 5，(−5, 2) 是向左 5、向上 2。",
  ),
  "further-modeling-with-two-variable-equations#when-two-models-are-equal": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 100, 20], xName: "x", yName: "C" });
      return [
        ...c.marks,
        seg(c.at(0, 30), c.at(10, 70)),
        seg(c.at(0, 12), c.at(10, 82), "action"),
        note(c.at(10, 70), "A", "e"),
        note(c.at(10, 82), "B", "e"),
        ...dotAt(c.at(6, 54), "(6, 54)", "n", "result"),
      ];
    })(),
    "Plan A, 30 + 4x, and plan B, 12 + 7x, cross at (6, 54): at 6 units both cost 54.",
    "方案 A（30 + 4x）和方案 B（12 + 7x）交于 (6, 54)：6 个单位时都是 54。",
  ),
  "distance-time-graphs#reading-a-distance-time-graph": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 16, 4], xName: "t", yName: "d" });
      return [
        ...c.marks,
        seg(c.at(0, 0), c.at(1, 12), "result"),
        seg(c.at(1, 12), c.at(2.5, 12)),
        seg(c.at(2.5, 12), c.at(4, 0), "action"),
        note(c.at(0.5, 6), "v > 0", "e"),
        note(c.at(1.75, 12), "v = 0", "n"),
        note(c.at(3.25, 6), "v < 0", "e"),
      ];
    })(),
    "A trip going 12 km out, stopping, and coming 12 km back: it ends where it started, and the total distance is 24 km.",
    "去程 12 km、停下、回程 12 km 的行程：终点就是起点，总路程是 24 km。",
  ),
  "distance-time-graphs#speed-from-a-distance-time-graph": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 40, 10], xName: "t", yName: "d" });
      return [
        ...c.marks,
        seg(c.at(1, 12), c.at(3, 30), "result"),
        seg(c.at(1, 12), c.at(3, 12), "accent", true),
        seg(c.at(3, 12), c.at(3, 30), "action", true),
        ...dotAt(c.at(1, 12), "(1, 12)", "nw"),
        ...dotAt(c.at(3, 30), "(3, 30)", "nw"),
        note(c.at(2, 12), "2", "s"),
        note(c.at(3, 21), "18", "e"),
      ];
    })(),
    "From (1, 12) to (3, 30), the distance grows by 18 km in 2 hours: a speed of 9 km/h.",
    "从 (1, 12) 到 (3, 30)，2 小时路程增加 18 km：速度是 9 km/h。",
  ),
  "speed-time-graphs#reading-a-speed-time-graph": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 8, 2], ...speedAxes });
      return [
        ...c.marks,
        seg(c.at(0, 0), c.at(3, 6), "result"),
        seg(c.at(3, 6), c.at(7, 6)),
        seg(c.at(7, 6), c.at(10, 0), "action"),
        note(c.at(1.5, 3), "a > 0", "e"),
        note(c.at(5, 6), "a = 0", "n"),
        note(c.at(8.5, 3), "a < 0", "ne"),
      ];
    })(),
    "For example, a graph going up, then horizontal, then down: speeding up, moving at a constant speed, and slowing down to a stop at speed 0.",
    "例如，先上升、再水平、后下降的图像：加速、匀速，然后减速到速度为 0 而停下。",
  ),
  "speed-time-graphs#acceleration-from-a-speed-time-graph": drawing(
    (() => {
      const c = chart({ x: [0, 12, 2], y: [0, 16, 4], ...speedAxes });
      return [
        ...c.marks,
        seg(c.at(0, 12), c.at(4, 12)),
        seg(c.at(4, 12), c.at(10, 0), "action"),
        ...dotAt(c.at(4, 12), "(4, 12)", "ne"),
        ...dotAt(c.at(10, 0), "(10, 0)", "ne"),
        seg(c.at(4, 12), c.at(4, 0), undefined, true),
      ];
    })(),
    "From (4, 12) to (10, 0), the speed falls 12 in 6 seconds: an acceleration of −2 m/s².",
    "从 (4, 12) 到 (10, 0)，6 秒内速度下降 12：加速度是 −2 m/s²。",
  ),
  "speed-time-graphs#distance-from-the-area": drawing(
    (() => {
      const c = chart({ x: [0, 10, 2], y: [0, 12, 2], ...speedAxes });
      return [
        ...c.marks,
        underGraph(c, [
          [0, 0],
          [4, 0],
          [4, 10],
        ]),
        underGraph(
          c,
          [
            [4, 0],
            [10, 0],
            [10, 10],
            [4, 10],
          ],
          "action",
        ),
        seg(c.at(0, 0), c.at(4, 10)),
        seg(c.at(4, 10), c.at(10, 10)),
        seg(c.at(4, 0), c.at(4, 10), undefined, true),
        seg(c.at(10, 0), c.at(10, 10), undefined, true),
        note(c.at(3, 2), "20", "n"),
        note(c.at(7, 4), "60", "n"),
      ];
    })(),
    "For example, a speed-up from rest to 10 in 4 seconds makes a triangle of area 20, and 6 seconds at speed 10 makes a rectangle of area 60.",
    "例如，4 秒内从静止加速到 10 形成面积 20 的三角形，以速度 10 行驶 6 秒形成面积 60 的长方形。",
  ),
  "distance-from-speed-time-graphs#distance-at-constant-speed": drawing(
    (() => {
      const c = chart({ x: [0, 20, 5], y: [0, 16, 4], ...speedAxes });
      return [
        ...c.marks,
        underGraph(c, [
          [5, 0],
          [15, 0],
          [15, 12],
          [5, 12],
        ]),
        seg(c.at(5, 12), c.at(15, 12)),
        seg(c.at(5, 0), c.at(5, 12), undefined, true),
        seg(c.at(15, 0), c.at(15, 12), undefined, true),
        note(c.at(10, 6), "12 · 10 = 120", "n"),
      ];
    })(),
    "At 12 m/s from t = 5 to t = 15: the rectangle of height 12 and width 10 has area 120, so the distance is 120 m.",
    "从 t = 5 到 t = 15 以 12 m/s 行驶：高 12、宽 10 的长方形面积是 120，所以路程是 120 m。",
  ),
  "distance-from-speed-time-graphs#distance-while-changing-speed": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 12, 2], ...speedAxes, w: 4 });
      return [
        ...c.marks,
        underGraph(c, [
          [0, 0],
          [4, 0],
          [4, 10],
        ]),
        seg(c.at(0, 0), c.at(4, 10)),
        seg(c.at(4, 0), c.at(4, 10), undefined, true),
        note(c.at(3, 2), "20", "n"),
        ...shift(
          [
            ...c.marks,
            underGraph(c, [
              [0, 0],
              [4, 0],
              [4, 10],
              [0, 6],
            ]),
            seg(c.at(0, 6), c.at(4, 10)),
            seg(c.at(4, 0), c.at(4, 10), undefined, true),
            note(c.at(2, 3.5), "32", "n"),
          ],
          6.5,
        ),
      ];
    })(),
    "From 0 to 10 m/s in 4 s the region is a triangle of area 20. From 6 to 10 m/s in 4 s it is a trapezoid of area 32.",
    "4 秒内从 0 到 10 m/s，区域是面积 20 的三角形。4 秒内从 6 到 10 m/s，是面积 32 的梯形。",
  ),
  "distance-from-speed-time-graphs#total-distance-and-average-speed": drawing(
    (() => {
      const c = chart({ x: [0, 20, 5], y: [0, 12, 2], ...speedAxes });
      return [
        ...c.marks,
        underGraph(c, [
          [0, 0],
          [5, 10],
          [5, 0],
        ]),
        underGraph(
          c,
          [
            [5, 0],
            [15, 0],
            [15, 10],
            [5, 10],
          ],
          "action",
        ),
        underGraph(c, [
          [15, 0],
          [20, 0],
          [15, 10],
        ]),
        seg(c.at(0, 0), c.at(5, 10)),
        seg(c.at(5, 10), c.at(15, 10)),
        seg(c.at(15, 10), c.at(20, 0)),
        note(c.at(3.5, 2), "25", "n"),
        note(c.at(10, 4), "100", "n"),
        note(c.at(16.5, 2), "25", "n"),
      ];
    })(),
    "For example, areas 25, 100 and 25 make a trip of 150 m in 20 s, an average speed of 7.5 m/s.",
    "例如，面积 25、100、25 组成 20 秒 150 m 的行程，平均速度是 7.5 m/s。",
  ),
  "consistency-and-dependency#classifying-systems": drawing(
    [
      ...mini(0, [clipLine(1, 0), clipLine(-0.5, 0.5, "action")], "1"),
      ...mini(6, [clipLine(0.7, 0.2)], "∞"),
      ...mini(12, [clipLine(0.5, 0.8), clipLine(0.5, -0.8, "action")], "∅"),
    ],
    "Intersecting lines: one solution, consistent and independent. The same line: infinitely many solutions, consistent and dependent. Parallel lines: no solution, inconsistent.",
    "相交直线：一个解，相容且独立。同一条直线：无穷多解，相容且相关。平行直线：无解，不相容。",
  ),
  "consistency-and-dependency#the-coefficient-that-makes-no-solution": graphed(
    view(-3, 5, 1, -2, 4),
    [
      curveOf((x) => (-2 / 3) * x + 2),
      curveOf((x) => (-2 / 3) * x + 5 / 6, "action"),
      tag([3, 0], "2x + 3y = 6", "ne"),
      tag([-1.5, 1.8], "4x + 6y = 5", "sw"),
    ],
    "For example, 2x + 3y = 6 and 4x + 6y = 5: the left sides are in the ratio 2, the constants are not, and the lines are parallel and different.",
    "例如，2x + 3y = 6 和 4x + 6y = 5：左边之比是 2，常数之比不是，所以直线平行且不同。",
  ),
  "approximating-solutions-to-systems-of-linear-equations#estimating-from-a-graph": graphed(
    view(-1, 5, 1, -2, 4),
    [curveOf((x) => 0.5 * x - 0.15), curveOf((x) => -2 * x + 5.1, "action"), bare([2.1, 0.9], "result"), bare([2, 1])],
    "For example, lines crossing a little to the right of x = 2 and a little below y = 1: the solution is approximately (2, 1).",
    "例如，直线相交于 x = 2 略右、y = 1 略下：解约为 (2, 1)。",
  ),
  "approximating-solutions-to-systems-of-linear-equations#confirming-an-estimate": graphed(
    view(-2, 5, 1, -3, 5),
    [
      curveOf((x) => 2 * x - 1),
      curveOf((x) => -x + 3, "action"),
      edge([4 / 3, 0], [4 / 3, 5 / 3], "result", true),
      pt([4 / 3, 5 / 3], "x = 4/3", "e", "result"),
    ],
    "y = 2x − 1 and y = −x + 3 cross at x = 4/3 ≈ 1.33, a little to the right of x = 1.",
    "y = 2x − 1 和 y = −x + 3 相交于 x = 4/3 ≈ 1.33，在 x = 1 略右。",
  ),
  "graphing-strict-linear-inequalities#dashed-boundary-and-side": graphed(
    view(-4, 4, 1, -4, 4),
    [
      { kind: "region", halfPlanes: [[-2, 1, 1]] },
      curveOf((x) => 2 * x - 1, undefined, undefined, undefined, true),
      tag([-2.5, 2.5], "y > 2x − 1"),
    ],
    "2x − 1 < y means y > 2x − 1: a dashed boundary, shaded above.",
    "2x − 1 < y 即 y > 2x − 1：虚线边界，涂上方。",
  ),
  "graphing-strict-linear-inequalities#strict-inequality-from-a-graph": graphed(
    view(-4, 4, 1, -4, 4),
    [
      { kind: "region", halfPlanes: [[0.5, -1, 1]] },
      curveOf((x) => 0.5 * x + 1, undefined, undefined, undefined, true),
      pt([0, 1], "(0, 1)", "nw"),
      pt([2, 2], "(2, 2)", "nw"),
      tag([1.5, -2.5], "y < ½x + 1"),
    ],
    "For example, a dashed line with y-intercept 1 and slope ½, shaded below: y < ½x + 1.",
    "例如，y 截距 1、斜率 ½ 的虚线，涂下方：y < ½x + 1。",
  ),
  "graphing-non-strict-linear-inequalities#inequality-from-a-graph": graphed(
    view(-4, 5, 1, -4, 5),
    [{ kind: "region", halfPlanes: [[1, 1, -2]] }, curveOf((x) => -x + 2), tag([2.5, 2.5], "y ≥ −x + 2")],
    "For example, a solid boundary y = −x + 2, shaded above: y ≥ −x + 2.",
    "例如，实线边界 y = −x + 2，涂上方：y ≥ −x + 2。",
  ),
  "further-graphing-linear-inequalities#solving-for-y-first": graphed(
    view(-4, 5, 1, -4, 4),
    [
      { kind: "region", halfPlanes: [[-2 / 3, 1, 2]] },
      curveOf((x) => (2 / 3) * x - 2, undefined, undefined, undefined, true),
      pt([0, -2], "(0, −2)", "e"),
      pt([3, 0], "(3, 0)", "se"),
      tag([-1.5, 2], "y > ⅔x − 2"),
    ],
    "2x − 3y < 6 becomes y > ⅔x − 2: a dashed boundary through (0, −2) and (3, 0), shaded above.",
    "2x − 3y < 6 变为 y > ⅔x − 2：虚线边界过 (0, −2) 和 (3, 0)，涂上方。",
  ),
  "further-graphing-linear-inequalities#horizontal-and-vertical-boundaries": graphed(
    view(-4, 5, 1, -4, 4),
    [
      { kind: "region", halfPlanes: [[1, 0, -2]] },
      { kind: "region", halfPlanes: [[0, -1, -1]] },
      ln([2, -4], [2, 4], undefined, true),
      ln([-4, -1], [5, -1]),
      tag([2, 3.3], "x > 2", "e"),
      tag([-2.5, -1], "y ≤ −1", "s"),
    ],
    "x > 2 is the region to the right of the dashed line x = 2, and y ≤ −1 is the region on or below the solid line y = −1.",
    "x > 2 是虚线 x = 2 右边的区域，y ≤ −1 是实线 y = −1 上及其下方的区域。",
  ),
  "systems-of-linear-inequalities#system-from-a-graph": graphed(
    view(-3, 6, 1, -4, 4),
    [
      {
        kind: "region",
        halfPlanes: [
          [1, -1, -2],
          [-1, -1, 3],
        ],
      },
      curveOf((x) => x - 2),
      curveOf((x) => -x + 3, "action", undefined, undefined, true),
      tag([4.5, 2.5], "y ≤ x − 2", "w"),
      tag([-2.6, 3.2], "y < −x + 3", "e"),
    ],
    "For example, y ≤ x − 2 with a solid boundary and y < −x + 3 with a dashed one: the solutions are the overlap of the two regions.",
    "例如，实线边界的 y ≤ x − 2 和虚线边界的 y < −x + 3：解是两个区域的重叠部分。",
  ),
  "converting-units-of-area#areas-of-rectangles-in-other-units": drawing(
    [
      rect(0, 0, 6, 2.5),
      side([0, 0], [6, 0], "1.2 m = 120 cm"),
      side([6, 0], [6, 2.5], "0.5 m = 50 cm"),
      note([3, 1.25], "0.6 m² = 6000 cm²", "n"),
    ],
    "A rectangle 1.2 m by 0.5 m is 120 cm by 50 cm, with area 0.6 m² or 6000 cm².",
    "1.2 m × 0.5 m 的长方形就是 120 cm × 50 cm，面积 0.6 m² 或 6000 cm²。",
  ),
  "direct-variation#recognizing-direct-variation": drawing(
    (() => {
      const c = chart({ x: [0, 6, 1], y: [0, 16, 4], xName: "x", yName: "y" });
      return [
        ...c.marks,
        seg(c.at(0, 0), c.at(5.33, 16), "result"),
        seg(c.at(0, 3), c.at(6, 15), "action", true),
        ...dotAt(c.at(2, 6), "(2, 6)", "se"),
        ...dotAt(c.at(3, 9), "(3, 9)", "se"),
        ...dotAt(c.at(5, 15), "(5, 15)", "se"),
        ...dotAt(c.at(1, 5), "(1, 5)", "nw"),
        ...dotAt(c.at(2, 7), "(2, 7)", "nw"),
      ];
    })(),
    "(2, 6), (3, 9) and (5, 15) lie on a line through the origin: direct variation. (1, 5), (2, 7) and (3, 9) lie on a dashed line that misses the origin: no direct variation.",
    "(2, 6)、(3, 9)、(5, 15) 在过原点的直线上：是正比例。(1, 5)、(2, 7)、(3, 9) 在不过原点的虚线上：不是正比例。",
  ),
  "modeling-with-quadratic-equations#rectangles": drawing(
    [rect(0, 0, 8, 5), side([0, 0], [8, 0], "w + 3 = 8"), side([8, 0], [8, 5], "w = 5"), note([4, 2.5], "40 m²", "n")],
    "A rectangle of width 5 m, length 8 m, 3 m more, and area 40 m².",
    "宽 5 m、长 8 m（多 3 m）、面积 40 m² 的长方形。",
  ),
  "vertical-line-test#endpoints-and-the-vertical-line-test": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 5, 1], xName: "x", yName: "y", w: 4, h: 5 });
      const pieces = [seg(c.at(0, 2), c.at(2, 1)), seg(c.at(2, 4), c.at(4, 3)), seg(c.at(2, 0), c.at(2, 5), "action", true)];
      return [
        ...c.marks,
        ...pieces,
        ...dotAt(c.at(2, 1), "(2, 1)", "se"),
        openAt(c.at(2, 4)),
        note(c.at(2, 4), "(2, 4)", "ne"),
        note(c.at(2, 5), "✓", "n"),
        ...shift(
          [...c.marks, ...pieces, ...dotAt(c.at(2, 1), "(2, 1)", "se"), ...dotAt(c.at(2, 4), "(2, 4)", "ne"), note(c.at(2, 5), "✗", "n")],
          6.5,
        ),
      ];
    })(),
    "A filled dot at (2, 1) and an open dot at (2, 4): a function, with f(2) = 1. Filled dots at both: not a function.",
    "(2, 1) 处实心点、(2, 4) 处空心点：是函数，f(2) = 1。两处都是实心点：不是函数。",
  ),
  "domain-of-a-function#domain-from-a-graph": graphed(
    view(-5, 6, 1, -2, 5),
    [
      edge([-3, 1], [0, 3]),
      edge([0, 3], [4, 2]),
      bare([-3, 1]),
      openPt([4, 2]),
      edge([-3, 0], [4, 0], "result"),
      tag([0.5, -0.9], "[−3, 4)", "s"),
    ],
    "A graph from a filled dot at x = −3 to an open dot at x = 4, with domain [−3, 4).",
    "从 x = −3 处实心点到 x = 4 处空心点的图像，定义域是 [−3, 4)。",
  ),
  "end-behavior#end-behavior-from-a-graph": graphed(
    view(-4, 4, 1, -1, 9),
    [curveOf((x) => x * x, undefined, -2.8, 2.8), toward([2.5, 6.25], [2.9, 8.4], "result"), toward([-2.5, 6.25], [-2.9, 8.4], "result")],
    "y = x²: both ends rise, so f(x) → ∞ as x → ∞ and as x → −∞.",
    "y = x²：两端都上升，所以 x → ∞ 和 x → −∞ 时都有 f(x) → ∞。",
  ),
  "range-of-a-function#range-from-a-graph": graphed(
    view(-5, 5, 1, -4, 6),
    [
      ...brokenLine([
        [-4, 1],
        [-1, 5],
        [2, -2],
        [4, 2],
      ]),
      bare([-4, 1]),
      bare([4, 2]),
      edge([-1, 5], [0, 5], "action", true),
      edge([2, -2], [0, -2], "action", true),
      edge([0, -2], [0, 5], "result"),
      pt([-1, 5], "(−1, 5)", "n"),
      pt([2, -2], "(2, −2)", "s"),
    ],
    "For example, a graph with its highest point (−1, 5) and lowest point (2, −2), neither at an end: the range is [−2, 5].",
    "例如，最高点 (−1, 5)、最低点 (2, −2)，都不在端点的图像：值域是 [−2, 5]。",
  ),
  "range-advanced-cases#ranges-of-graphs-in-pieces": graphed(
    view(-5, 5, 1, -4, 5),
    [
      edge([-4, -3], [-1, -1]),
      bare([-4, -3]),
      bare([-1, -1]),
      edge([1, 2], [4, 4]),
      bare([1, 2]),
      openPt([4, 4], "(4, 4)", "e"),
      edge([0, -3], [0, -1], "result"),
      edge([0, 2], [0, 4], "result"),
    ],
    "For example, one piece covers heights from −3 to −1, and another from 2 up to an open dot at 4: the range is [−3, −1] ∪ [2, 4), with a gap.",
    "例如，一段覆盖高度 −3 到 −1，另一段从 2 到 4 处的空心点：值域是 [−3, −1] ∪ [2, 4)，中间有空隙。",
  ),
  "range-advanced-cases#ranges-of-squares-and-roots": graphed(
    view(-5, 7, 1, -3, 8),
    [
      curveOf(bowl(3, 2)),
      curveOf(bowl(-1, 5, -2), "action"),
      pt([3, 2], "(3, 2)", "s"),
      pt([-1, 5], "(−1, 5)", "n", "action"),
      tag([5, 6], "f", "e"),
      tag([-2.3, 1.6], "g", "w"),
    ],
    "f(x) = (x − 3)² + 2 has its lowest point at (3, 2), so its range is [2, ∞). g(x) = −2(x + 1)² + 5 has its highest point at (−1, 5), so its range is (−∞, 5].",
    "f(x) = (x − 3)² + 2 的最低点是 (3, 2)，值域是 [2, ∞)。g(x) = −2(x + 1)² + 5 的最高点是 (−1, 5)，值域是 (−∞, 5]。",
  ),
  "range-advanced-cases#the-range-of-a-reciprocal-function": graphed(
    view(-4, 6, 1, -2, 8),
    [
      curveOf((x) => 2 / (x - 1) + 3, undefined, -4, 0.6),
      curveOf((x) => 2 / (x - 1) + 3, undefined, 1.4, 6),
      ln([-4, 3], [6, 3], "action", true),
      ln([1, -2], [1, 8], undefined, true),
      tag([-3, 3], "y = 3", "n"),
    ],
    "For example, y = 2/(x − 1) + 3 comes close to the line y = 3 but never meets it, so it takes every value except 3.",
    "例如，y = 2/(x − 1) + 3 接近直线 y = 3 但永不相交，所以取除 3 以外的所有值。",
  ),
  "roots-of-a-function#roots-from-a-graph": graphed(
    view(-3, 5, 1, -5, 4),
    [
      curveOf((x) => (x + 1) * (x - 3)),
      pt([-1, 0], "−1", "nw", "result"),
      pt([3, 0], "3", "ne", "result"),
      pt([0, -3], "(0, −3)", "e", "action"),
    ],
    "For example, a graph meeting the x-axis at x = −1 and x = 3: these are its roots. It meets the y-axis at (0, −3), which is the y-intercept and not a root.",
    "例如，与 x 轴交于 x = −1 和 x = 3 的图像：它们是根。与 y 轴交于 (0, −3)，这是 y 截距，不是根。",
  ),
  "roots-of-a-function#roots-of-linear-functions": graphed(
    view(-4, 3, 1, -3, 6),
    [curveOf((x) => 4 * x + 6), pt([-1.5, 0], "(−3/2, 0)", "se", "result")],
    "f(x) = 4x + 6 crosses the x-axis at x = −3/2, its root.",
    "f(x) = 4x + 6 与 x 轴交于 x = −3/2，这就是根。",
  ),
  "roots-of-a-function#x-and-y-intercepts": graphed(
    view(-2, 7, 1, -9, 3),
    [curveOf((x) => 2 * x - 8), pt([4, 0], "(4, 0)", "se", "result"), pt([0, -8], "(0, −8)", "e", "action")],
    "f(x) = 2x − 8 meets the x-axis at (4, 0) and the y-axis at (0, −8).",
    "f(x) = 2x − 8 与 x 轴交于 (4, 0)，与 y 轴交于 (0, −8)。",
  ),
  "absolute-value-expressions#distance-on-the-number-line": drawing(
    [...realLine(-7, 5), spot(1, "action"), spot(11, "action"), ...hop(1, 11, "10")],
    "The distance between −6 and 4 is |−6 − 4| = 10.",
    "−6 和 4 之间的距离是 |−6 − 4| = 10。",
  ),
  "absolute-value-graphs#vertex-of-a-translated-graph": graphed(
    view(-6, 4, 1, -2, 5),
    [
      curveOf(vee(0, 0), undefined, undefined, undefined, true),
      curveOf(vee(-2, -1), "result"),
      pt([0, 0], "(0, 0)", "se"),
      pt([-2, -1], "(−2, −1)", "s", "result"),
    ],
    "y = |x| with vertex (0, 0), dashed, and y = |x + 2| − 1 with vertex (−2, −1).",
    "y = |x| 顶点 (0, 0)，虚线；y = |x + 2| − 1 顶点 (−2, −1)。",
  ),
  "absolute-value-graphs#equations-from-graphs": graphed(
    view(-3, 5, 1, -1, 6),
    [curveOf(vee(1, 2)), pt([1, 2], "(1, 2)", "s", "result"), pt([2, 3], "(2, 3)", "e"), tag([-0.4, 5], "y = |x − 1| + 2", "e")],
    "For example, the vertex (1, 2) gives y = |x − 1| + 2. One unit right of the vertex, at (2, 3), the graph is one unit higher.",
    "例如，顶点 (1, 2) 给出 y = |x − 1| + 2。顶点右边一个单位 (2, 3) 处，图像高一个单位。",
  ),
  "absolute-value-graphs#translating-the-graph": graphed(
    view(-7, 4, 1, -3, 5),
    [
      curveOf(vee(0, 0), undefined, undefined, undefined, true),
      curveOf(vee(-3, -2), "result"),
      toward([0, 0], [-3, -2]),
      pt([0, 0], "(0, 0)", "se"),
      pt([-3, -2], "(−3, −2)", "s", "result"),
    ],
    "y = |x| moved 3 units left and 2 units down is y = |x + 3| − 2.",
    "y = |x| 向左 3、向下 2 得 y = |x + 3| − 2。",
  ),
  "vertical-reflections-of-absolute-value-graphs#opening-upward-or-downward": graphed(
    view(-5, 5, 1, -5, 5),
    [
      curveOf(vee(0, 0), undefined, undefined, undefined, true),
      curveOf(vee(0, 0, -1), "result"),
      tag([3.5, 3.5], "y = |x|", "w"),
      tag([3.5, -3.5], "y = −|x|", "w"),
    ],
    "y = −|x| is y = |x| reflected in the x-axis: a V opening downward, with the vertex as its highest point.",
    "y = −|x| 是 y = |x| 关于 x 轴的对称图形：开口向下的 V，顶点是最高点。",
  ),
  "vertical-reflections-of-absolute-value-graphs#equations-of-downward-graphs": graphed(
    view(-4, 6, 1, -3, 5),
    [curveOf(vee(1, 3, -1)), pt([1, 3], "(1, 3)", "n", "result"), tag([3.5, 1.5], "y = −|x − 1| + 3", "e")],
    "For example, a V opening downward with vertex (1, 3) is y = −|x − 1| + 3.",
    "例如，开口向下、顶点 (1, 3) 的 V 是 y = −|x − 1| + 3。",
  ),
  "vertical-reflections-of-absolute-value-graphs#reflecting-in-the-x-axis": graphed(
    view(-4, 6, 1, -6, 6),
    [
      curveOf(vee(1, 3)),
      curveOf(vee(1, -3, -1), "result"),
      edge([1, 3], [1, -3], undefined, true),
      pt([1, 3], "(1, 3)", "e"),
      pt([1, -3], "(1, −3)", "e", "result"),
    ],
    "y = |x − 1| + 3 with vertex (1, 3), and its reflection y = −|x − 1| − 3 with vertex (1, −3).",
    "y = |x − 1| + 3 顶点 (1, 3)，它的对称图形 y = −|x − 1| − 3 顶点 (1, −3)。",
  ),
  "stretches-of-absolute-value-graphs#slopes-of-the-arms": graphed(
    view(-3, 4, 1, -3, 5),
    [
      curveOf(vee(0, -2, 3)),
      edge([0, -2], [1, -2], "action"),
      edge([1, -2], [1, 1], "result"),
      pt([0, -2], "(0, −2)", "w"),
      pt([1, 1], "(1, 1)", "e"),
      tag([0.5, -2], "1", "s"),
      tag([1, -0.5], "3", "e"),
    ],
    "y = 3|x| − 2: from the vertex (0, −2), its right arm rises 3 per unit, and its left arm has slope −3.",
    "y = 3|x| − 2：从顶点 (0, −2) 起，右臂每单位升 3，左臂斜率是 −3。",
  ),
  "stretches-of-absolute-value-graphs#narrower-and-wider-graphs": graphed(
    view(-5, 5, 1, -1, 5),
    [
      curveOf(vee(0, 0, 4), "result"),
      curveOf(vee(0, 0, 0.5), "action"),
      tag([1.25, 4.6], "y = 4|x|", "e"),
      tag([-3.5, 2.1], "y = ½|x|", "n"),
    ],
    "y = 4|x| is narrower than y = ½|x|.",
    "y = 4|x| 比 y = ½|x| 窄。",
  ),
  "stretches-of-absolute-value-graphs#stretched-graphs-from-graphs": graphed(
    view(-5, 5, 1, -2, 3),
    [
      curveOf(vee(0, -1, 0.5)),
      edge([0, -1], [2, -1], "action", true),
      edge([2, -1], [2, 0], "result", true),
      pt([0, -1], "(0, −1)", "s"),
      pt([2, 0], "(2, 0)", "ne"),
    ],
    "A graph through (0, −1) and (2, 0): a rise of 1 over a run of 2 gives a = ½, so y = ½|x| − 1.",
    "过 (0, −1) 和 (2, 0) 的图像：水平 2、升高 1，a = ½，所以 y = ½|x| − 1。",
  ),
  "combining-transformations-of-absolute-value-graphs#describing-transformations": graphed(
    view(-7, 4, 1, -6, 4),
    [
      curveOf(vee(0, 0), undefined, undefined, undefined, true),
      curveOf(vee(-3, -1, -2), "result"),
      pt([-3, -1], "(−3, −1)", "e", "result"),
      pt([0, 0], "(0, 0)", "se"),
    ],
    "y = |x|, dashed, and y = −2|x + 3| − 1: reflected, stretched by 2, with its vertex moved 3 left and 1 down to (−3, −1).",
    "y = |x|（虚线）和 y = −2|x + 3| − 1：反射、拉伸 2 倍，顶点向左 3、向下 1 移到 (−3, −1)。",
  ),
  "combining-transformations-of-absolute-value-graphs#combined-equations-from-graphs": graphed(
    view(-3, 5, 1, -4, 4),
    [
      curveOf(vee(1, 2, -2)),
      edge([1, 2], [3, 2], "action", true),
      edge([3, 2], [3, -2], "result", true),
      pt([1, 2], "(1, 2)", "n"),
      pt([3, -2], "(3, −2)", "e"),
      tag([2, 2], "2", "n"),
      tag([3, 1], "−4", "e"),
    ],
    "Vertex (1, 2) and point (3, −2): a change of −4 in y over 2 in x gives a = −2, so y = −2|x − 1| + 2.",
    "顶点 (1, 2) 和点 (3, −2)：x 变 2、y 变 −4，a = −2，所以 y = −2|x − 1| + 2。",
  ),
  "domain-and-range-of-absolute-value-functions#domain-and-range-from-an-equation": graphed(
    view(-1, 10, 1, -4, 5),
    [curveOf(vee(5, 3, -2)), edge([0, 3], [0, -4], "result"), edge([5, 3], [0, 3], "action", true), pt([5, 3], "(5, 3)", "n")],
    "f(x) = −2|x − 5| + 3 opens downward from (5, 3), so its range, marked on the y-axis, is (−∞, 3].",
    "f(x) = −2|x − 5| + 3 从 (5, 3) 开口向下，所以值域（标在 y 轴上）是 (−∞, 3]。",
  ),
  "domain-and-range-of-absolute-value-functions#domain-and-range-from-a-graph": graphed(
    view(-4, 4, 1, -1, 4),
    [
      edge([-2, 3], [1, 0]),
      edge([1, 0], [2, 1]),
      pt([-2, 3], "(−2, 3)", "n"),
      bare([1, 0], "result"),
      tag([1, -0.5], "(1, 0)", "s"),
      pt([2, 1], "(2, 1)", "e"),
      edge([0, 0], [0, 3], "result"),
    ],
    "y = |x − 1| from (−2, 3) to (2, 1) has domain [−2, 2] and range [0, 3], because the vertex (1, 0) is on it.",
    "y = |x − 1| 从 (−2, 3) 到 (2, 1)，定义域 [−2, 2]，值域 [0, 3]，因为顶点 (1, 0) 在图上。",
  ),
  "domain-and-range-of-absolute-value-functions#range-on-a-closed-interval": graphed(
    view(-5, 4, 1, -4, 4),
    [
      edge([-3, 1], [-1, -3]),
      edge([-1, -3], [2, 3]),
      pt([-3, 1], "(−3, 1)", "w"),
      pt([-1, -3], "(−1, −3)", "s", "result"),
      pt([2, 3], "(2, 3)", "e"),
      edge([0, -3], [0, 3], "result"),
    ],
    "f(x) = 2|x + 1| − 3 on −3 ≤ x ≤ 2: the values 1 and 3 at the ends and −3 at the vertex give the range [−3, 3].",
    "f(x) = 2|x + 1| − 3，−3 ≤ x ≤ 2：两端的值 1、3 和顶点的值 −3 给出值域 [−3, 3]。",
  ),
  "roots-of-absolute-value-functions#how-many-roots": drawing(
    [...mini(0, curveInMini(vee(0, -1)), "2"), ...mini(6, curveInMini(vee(0, 0)), "1"), ...mini(12, curveInMini(vee(0, 0.8)), "0")],
    "A V opening upward with its vertex below the x-axis has two roots, with its vertex on the axis one root, and with its vertex above no roots.",
    "开口向上的 V：顶点在 x 轴下方有两个根，在轴上有一个根，在上方没有根。",
  ),
  "roots-of-absolute-value-functions#roots-from-the-graph": graphed(
    view(-3, 7, 1, -4, 4),
    [
      curveOf(vee(2, -3)),
      ln([2, -4], [2, 4], undefined, true),
      pt([-1, 0], "−1", "nw", "result"),
      pt([5, 0], "5", "ne", "result"),
      pt([2, -3], "(2, −3)", "e"),
      tag([0.5, 0], "3", "n"),
      tag([3.5, 0], "3", "n"),
    ],
    "For example, a V with vertex (2, −3) meets the x-axis at −1 and 5, each 3 from x = 2.",
    "例如，顶点 (2, −3) 的 V 与 x 轴交于 −1 和 5，各距 x = 2 为 3。",
  ),
  "graphing-exponential-growth-functions#growth-equation-from-graph": graphed(
    view(-3, 3, 1, -1, 9),
    [curveOf((x) => 2 * 3 ** x), pt([0, 2], "(0, 2)", "w"), pt([1, 6], "(1, 6)", "w")],
    "The graph through (0, 2) and (1, 6): a = 2 and b = 3, so y = 2(3)^x.",
    "过 (0, 2) 和 (1, 6) 的图像：a = 2，b = 3，所以 y = 2(3)^x。",
  ),
  "graphing-exponential-growth-functions#growth-horizontal-asymptote": graphed(
    view(-5, 3, 1, -6, 5),
    [curveOf((x) => 3 * 2 ** x - 4), ln([-5, -4], [3, -4], "action", true), tag([-3.5, -4], "y = −4", "s"), pt([0, -1], "(0, −1)", "e")],
    "y = 3(2)^x − 4 comes close to the dashed line y = −4 on the left, without reaching it.",
    "y = 3(2)^x − 4 在左边接近虚线 y = −4，但不相交。",
  ),
  "graphing-exponential-growth-functions#growth-range": graphed(
    view(-5, 3, 1, -1, 7),
    [
      curveOf((x) => 2 ** x + 1),
      ln([-5, 1], [3, 1], "action", true),
      openPt([0, 1]),
      edge([0, 1], [0, 7], "result"),
      tag([0, 4], "(1, ∞)", "w"),
    ],
    "For example, y = 2^x + 1: the values, marked on the y-axis, are all above the asymptote y = 1, and 1 itself is left out.",
    "例如，y = 2^x + 1：值（标在 y 轴上）都在渐近线 y = 1 之上，1 本身不取。",
  ),
  "graphing-exponential-decay-functions#decay-equation-from-graph": graphed(
    view(-2, 5, 1, -1, 10),
    [curveOf((x) => 8 * 0.5 ** x), pt([0, 8], "(0, 8)", "e"), pt([1, 4], "(1, 4)", "e")],
    "The graph through (0, 8) and (1, 4): a = 8 and b = ½, so y = 8(½)^x.",
    "过 (0, 8) 和 (1, 4) 的图像：a = 8，b = ½，所以 y = 8(½)^x。",
  ),
  "graphing-exponential-decay-functions#decay-horizontal-asymptote": graphed(
    view(-2, 6, 1, -1, 7),
    [curveOf((x) => 3 * 0.5 ** x + 1), ln([-2, 1], [6, 1], "action", true), tag([4.5, 1], "y = 1", "s"), pt([0, 4], "(0, 4)", "e")],
    "For example, y = 3(½)^x + 1 comes close to the asymptote y = 1 on the right.",
    "例如，y = 3(½)^x + 1 在右边接近渐近线 y = 1。",
  ),
  "graphing-exponential-decay-functions#range-with-reflections": graphed(
    view(-3, 5, 1, -4, 5),
    [
      curveOf((x) => -2 * 0.5 ** x + 3),
      ln([-3, 3], [5, 3], "action", true),
      tag([-1.5, 3], "y = 3", "n"),
      pt([0, 1], "(0, 1)", "e"),
      pt([1, 2], "(1, 2)", "se"),
    ],
    "y = −2(½)^x + 3 lies entirely below y = 3, so its range is (−∞, 3).",
    "y = −2(½)^x + 3 全在 y = 3 下方，所以值域是 (−∞, 3)。",
  ),
  "graphing-elementary-quadratic-functions#finding-a-from-a-point": drawing(
    (() => {
      const c = chart({ x: [-4, 4, 1], y: [0, 20, 4], xName: "x", yName: "y" });
      return [...c.marks, ...curveOn(c, (x) => 2 * x * x, -3.15, 3.15, [0, 20]), ...dotAt(c.at(3, 18), "(3, 18)", "w", "result")];
    })(),
    "y = ax² through (3, 18): 18 = 9a, so a = 2.",
    "y = ax² 过 (3, 18)：18 = 9a，所以 a = 2。",
  ),
  "vertical-reflections-of-quadratic-functions#reflecting-in-the-x-axis": drawing(
    (() => {
      const c = chart({ x: [-3, 3, 1], y: [-16, 16, 4], xName: "x", yName: "y", h: 7 });
      return [
        ...c.marks,
        ...curveOn(c, (x) => 3 * x * x, -2.3, 2.3, [-16, 16]),
        ...curveOn(c, (x) => -3 * x * x, -2.3, 2.3, [-16, 16], "action"),
        seg(c.at(2, 12), c.at(2, -12), undefined, true),
        ...dotAt(c.at(2, 12), "(2, 12)", "e"),
        ...dotAt(c.at(2, -12), "(2, −12)", "e", "action"),
      ];
    })(),
    "y = 3x² and its reflection y = −3x²: the point (2, 12) goes to (2, −12).",
    "y = 3x² 和它的对称图形 y = −3x²：点 (2, 12) 变为 (2, −12)。",
  ),
  "graphs-of-general-quadratic-functions#the-y-intercept": graphed(
    view(-2, 4, 1, -1, 7),
    [curveOf((x) => 2 * x * x - 5 * x + 3), pt([0, 3], "(0, 3)", "w", "result")],
    "y = 2x² − 5x + 3 opens upward and meets the y-axis at (0, 3).",
    "y = 2x² − 5x + 3 开口向上，与 y 轴交于 (0, 3)。",
  ),
  "graphs-of-general-quadratic-functions#points-on-the-graph": drawing(
    (() => {
      const c = chart({ x: [-3, 4, 1], y: [-4, 16, 4], xName: "x", yName: "y" });
      return [
        ...c.marks,
        ...curveOn(c, (x) => 2 * x * x - 3 * x - 1, -2.3, 4, [-4, 16]),
        ...dotAt(c.at(-2, 13), "(−2, 13)", "e", "result"),
      ];
    })(),
    "The graph of y = 2x² − 3x − 1 passes through (−2, 13).",
    "y = 2x² − 3x − 1 的图像经过 (−2, 13)。",
  ),
  "graphs-of-general-quadratic-functions#matching-a-graph": graphed(
    view(-4, 6, 1, -5, 6),
    [curveOf((x) => x * x - 2 * x - 3), pt([0, -3], "(0, −3)", "w", "result"), pt([1, -4], "(1, −4)", "se", "action")],
    "For example, a parabola opening upward through (0, −3) needs a > 0 and c = −3. Its vertex (1, −4) separates y = x² − 2x − 3 from other equations that fit.",
    "例如，开口向上、过 (0, −3) 的抛物线需要 a > 0、c = −3。顶点 (1, −4) 把 y = x² − 2x − 3 与其他符合的方程区分开。",
  ),
  "roots-of-quadratic-functions#roots-with-the-quadratic-formula": graphed(
    view(-2, 6, 1, -4, 5),
    [
      curveOf((x) => x * x - 4 * x + 1),
      pt([2 - Math.sqrt(3), 0], "0.27", "nw", "result"),
      pt([2 + Math.sqrt(3), 0], "3.73", "ne", "result"),
    ],
    "f(x) = x² − 4x + 1 crosses the x-axis at x = 2 − √3 ≈ 0.27 and x = 2 + √3 ≈ 3.73.",
    "f(x) = x² − 4x + 1 与 x 轴交于 x = 2 − √3 ≈ 0.27 和 x = 2 + √3 ≈ 3.73。",
  ),
  "the-discriminant-of-a-quadratic-function#counting-x-intercepts": graphed(
    view(-3, 4, 1, -1, 8),
    [curveOf((x) => 2 * x * x - 3 * x + 4), pt([0.75, 2.875], "(0.75, 2.875)", "e", "result")],
    "y = 2x² − 3x + 4 has discriminant −23: its lowest point is above the x-axis, so it has no x-intercepts.",
    "y = 2x² − 3x + 4 的判别式是 −23：最低点在 x 轴上方，所以没有 x 截距。",
  ),
  "the-discriminant-of-a-quadratic-function#the-discriminant-from-a-graph": drawing(
    [
      ...mini(0, curveInMini(bowl(0, -1, 0.8)), "2"),
      ...mini(6, curveInMini(bowl(0, 0, 0.8)), "1"),
      ...mini(12, curveInMini(bowl(0, 0.7, 0.8)), "0"),
    ],
    "Two crossings mean a positive discriminant, the vertex on the x-axis means 0, and no meeting point means a negative one.",
    "两个交点表示判别式为正，顶点在 x 轴上表示为 0，没有交点表示为负。",
  ),
  "the-discriminant-of-a-quadratic-function#touching-the-x-axis": graphed(
    view(-1, 7, 1, -1, 7),
    [curveOf((x) => 2 * x * x - 12 * x + 18), bare([3, 0], "result"), tag([3, -0.5], "(3, 0)", "s")],
    "y = 2x² − 12x + 18 touches the x-axis at exactly one point, (3, 0).",
    "y = 2x² − 12x + 18 恰好在一点 (3, 0) 与 x 轴相切。",
  ),
  "the-axis-of-symmetry-of-a-parabola#mirror-points": graphed(
    view(-4, 6, 1, -3, 9),
    [
      curveOf(bowl(1, -2)),
      ln([1, -3], [1, 9], "action", true),
      edge([-2, 7], [4, 7], undefined, true),
      pt([4, 7], "(4, 7)", "e", "result"),
      pt([-2, 7], "(−2, 7)", "w", "result"),
      tag([2.5, 7], "3", "n"),
      tag([-0.5, 7], "3", "n"),
      tag([1, 8.5], "x = 1", "e"),
    ],
    "With axis x = 1, the point (4, 7) is 3 to the right of the axis, and its mirror image (−2, 7) is 3 to the left. The parabola is an example.",
    "轴为 x = 1 时，点 (4, 7) 在轴右边 3，它的对称点 (−2, 7) 在轴左边 3。抛物线只是示例。",
  ),
  "the-average-of-the-roots-formula#the-axis-from-the-roots": drawing(
    (() => {
      const c = chart({ x: [-2, 6, 1], y: [-20, 8, 4], xName: "x", yName: "y", h: 6 });
      const f: Fn = (x) => 2 * (x - 5) * (x + 1);
      return [
        ...c.marks,
        ...curveOn(c, f, -1.5, 5.5, [-20, 8]),
        seg(c.at(2, -20), c.at(2, 8), "action", true),
        ...dotAt(c.at(-1, 0), "−1", "nw", "result"),
        ...dotAt(c.at(5, 0), "5", "ne", "result"),
        note(c.at(2, 8), "x = 2", "e"),
      ];
    })(),
    "y = 2(x − 5)(x + 1) has roots −1 and 5. The axis lies halfway between them, at x = 2.",
    "y = 2(x − 5)(x + 1) 的根是 −1 和 5。对称轴在两者正中，x = 2。",
  ),
  "the-average-of-the-roots-formula#the-vertex-from-the-roots": drawing(
    (() => {
      const c = chart({ x: [-2, 6, 1], y: [-20, 8, 4], xName: "x", yName: "y", h: 6 });
      const f: Fn = (x) => 2 * (x - 5) * (x + 1);
      return [
        ...c.marks,
        ...curveOn(c, f, -1.5, 5.5, [-20, 8]),
        seg(c.at(2, 0), c.at(2, -18), "action", true),
        ...dotAt(c.at(-1, 0), "−1", "nw"),
        ...dotAt(c.at(5, 0), "5", "ne"),
        ...dotAt(c.at(2, -18), "(2, −18)", "e", "result"),
      ];
    })(),
    "The vertex of y = 2(x − 5)(x + 1) is on the axis x = 2, at (2, −18).",
    "y = 2(x − 5)(x + 1) 的顶点在对称轴 x = 2 上，是 (2, −18)。",
  ),
  "the-vertex-form-of-a-parabola#reading-the-vertex": graphed(
    view(-5, 2, 1, -6, 5),
    [curveOf(bowl(-2, -5, 3)), ln([-2, -6], [-2, 5], "action", true), pt([-2, -5], "(−2, −5)", "e", "result")],
    "y = 3(x + 2)² − 5 has its vertex at (−2, −5) and the axis of symmetry x = −2.",
    "y = 3(x + 2)² − 5 的顶点是 (−2, −5)，对称轴是 x = −2。",
  ),
  "the-vertex-form-of-a-parabola#expanding-vertex-form": drawing(
    (() => {
      const c = chart({ x: [-1, 6, 1], y: [0, 20, 4], xName: "x", yName: "y" });
      return [
        ...c.marks,
        ...curveOn(c, bowl(3, 1, 2), 0, 6, [0, 20]),
        ...dotAt(c.at(3, 1), "(3, 1)", "n", "action"),
        ...dotAt(c.at(0, 19), "(0, 19)", "e", "result"),
      ];
    })(),
    "y = 2(x − 3)² + 1 is y = 2x² − 12x + 19: the vertex form shows the vertex (3, 1), and the standard form the y-intercept (0, 19).",
    "y = 2(x − 3)² + 1 即 y = 2x² − 12x + 19：顶点式显示顶点 (3, 1)，一般式显示 y 截距 (0, 19)。",
  ),
  "writing-the-equation-of-a-parabola-in-vertex-form#completing-the-square": drawing(
    (() => {
      const c = chart({ x: [-1, 7, 1], y: [0, 12, 2], xName: "x", yName: "y" });
      return [
        ...c.marks,
        ...curveOn(c, bowl(3, 2), 0, 6, [0, 12]),
        ...dotAt(c.at(3, 2), "(3, 2)", "s", "result"),
        ...dotAt(c.at(0, 11), "(0, 11)", "e"),
      ];
    })(),
    "y = x² − 6x + 11 is y = (x − 3)² + 2, with vertex (3, 2).",
    "y = x² − 6x + 11 即 y = (x − 3)² + 2，顶点 (3, 2)。",
  ),
  "writing-the-equation-of-a-parabola-in-vertex-form#with-a-leading-coefficient": drawing(
    (() => {
      const c = chart({ x: [-6, 1, 1], y: [-16, 8, 4], xName: "x", yName: "y", h: 6 });
      return [
        ...c.marks,
        ...curveOn(c, bowl(-3, -13, 2), -6, 0.3, [-16, 8]),
        ...dotAt(c.at(-3, -13), "(−3, −13)", "e", "result"),
        ...dotAt(c.at(0, 5), "(0, 5)", "e"),
      ];
    })(),
    "y = 2x² + 12x + 5 is y = 2(x + 3)² − 13, with vertex (−3, −13).",
    "y = 2x² + 12x + 5 即 y = 2(x + 3)² − 13，顶点 (−3, −13)。",
  ),
  "writing-the-equation-of-a-parabola-in-vertex-form#from-the-vertex-and-a-point": graphed(
    view(-3, 5, 1, -5, 6),
    [curveOf(bowl(1, -4, 2)), pt([1, -4], "(1, −4)", "s", "result"), pt([3, 4], "(3, 4)", "e")],
    "Vertex (1, −4) and the point (3, 4) give a = 2: y = 2(x − 1)² − 4.",
    "顶点 (1, −4) 和点 (3, 4) 给出 a = 2：y = 2(x − 1)² − 4。",
  ),
  "domain-and-range-of-quadratic-functions#from-a-graph": graphed(
    view(-4, 3, 1, -4, 5),
    [curveOf(bowl(-1, -3)), pt([-1, -3], "(−1, −3)", "s"), edge([0, -3], [0, 5], "result")],
    "For example, a parabola opening upward from the vertex (−1, −3): the range, marked on the y-axis, is [−3, ∞), with a closed bracket.",
    "例如，从顶点 (−1, −3) 开口向上的抛物线：值域（标在 y 轴上）是 [−3, ∞)，含端点。",
  ),
  "domain-and-range-of-quadratic-functions#from-vertex-form": graphed(
    view(-4, 3, 1, -5, 5),
    [curveOf(bowl(-1, 4, -3)), pt([-1, 4], "(−1, 4)", "n"), edge([0, 4], [0, -5], "result")],
    "f(x) = −3(x + 1)² + 4 opens downward from (−1, 4), so the range is (−∞, 4].",
    "f(x) = −3(x + 1)² + 4 从 (−1, 4) 开口向下，值域是 (−∞, 4]。",
  ),
  "domain-and-range-of-quadratic-functions#from-standard-form": graphed(
    view(-2, 5, 1, -6, 5),
    [curveOf((x) => 2 * x * x - 8 * x + 3), pt([2, -5], "(2, −5)", "e", "result"), pt([0, 3], "(0, 3)", "w", "action")],
    "f(x) = 2x² − 8x + 3 has its vertex at (2, −5), so the range is [−5, ∞). The y-intercept 3 is not the minimum.",
    "f(x) = 2x² − 8x + 3 的顶点是 (2, −5)，值域是 [−5, ∞)。y 截距 3 不是最小值。",
  ),
  "finding-intersections-of-lines-and-quadratic-functions#counting-intersections": graphed(
    view(-3, 5, 1, -4, 7),
    [
      curveOf((x) => x * x + 1),
      curveOf((x) => 2 * x - 3, "action"),
      tag([2.3, 5.8], "y = x² + 1", "e"),
      tag([3.2, 3.4], "y = 2x − 3", "e"),
    ],
    "The line y = 2x − 3 misses the parabola y = x² + 1.",
    "直线 y = 2x − 3 与抛物线 y = x² + 1 不相交。",
  ),
  "finding-intersections-of-lines-and-quadratic-functions#tangent-lines": graphed(
    view(-4, 4, 1, -3, 10),
    [curveOf((x) => x * x + 2 * x + 3), curveOf((x) => 4 * x + 2, "action"), pt([1, 6], "(1, 6)", "e", "result")],
    "With k = 2, the line y = 4x + 2 is tangent to y = x² + 2x + 3 at (1, 6).",
    "k = 2 时，直线 y = 4x + 2 与 y = x² + 2x + 3 相切于 (1, 6)。",
  ),
  "solving-systems-of-nonlinear-equations-using-graphs#reading-solutions-from-a-graph": graphed(
    view(-3, 4, 1, -1, 6),
    [curveOf((x) => x * x), curveOf((x) => x + 2, "action"), pt([-1, 1], "(−1, 1)", "w", "result"), pt([2, 4], "(2, 4)", "e", "result")],
    "For example, y = x² and y = x + 2 cross at (−1, 1) and (2, 4), the two solutions.",
    "例如，y = x² 和 y = x + 2 相交于 (−1, 1) 和 (2, 4)，这是两个解。",
  ),
  "approximating-solutions-to-systems-of-nonlinear-equations#estimating-from-a-graph": graphed(
    view(-3, 4, 1, -1, 7),
    [
      curveOf((x) => x * x),
      curveOf((x) => x + 3, "action"),
      pt([(1 + Math.sqrt(13)) / 2, (7 + Math.sqrt(13)) / 2], "x ≈ 2.30", "e", "result"),
      pt([(1 - Math.sqrt(13)) / 2, (7 - Math.sqrt(13)) / 2], "x ≈ −1.30", "w", "result"),
    ],
    "For example, y = x² and y = x + 3 cross at x = (1 ± √13)/2: nearest to the grid lines x = 2 and x = −1.",
    "例如，y = x² 和 y = x + 3 相交于 x = (1 ± √13)/2：最接近网格线 x = 2 和 x = −1。",
  ),
  "approximating-solutions-to-systems-of-nonlinear-equations#narrowing-to-tenths": drawing(
    (() => {
      const c = chart({ x: [2, 3, 1], y: [4, 6, 1], xName: "x", yName: "y", w: 7, h: 5 });
      return [
        ...c.marks,
        text(c.at(2, 4), "2", "s"),
        text(c.at(2, 4), "4", "w"),
        ...curveOn(c, (x) => x * x, 2, 2.44, [4, 6]),
        seg(c.at(2, 5), c.at(3, 5), "action"),
        note(c.at(3, 5), "y = 5", "e"),
        ...dotAt(c.at(2.2, 4.84), "2.2² = 4.84", "se"),
        ...dotAt(c.at(2.3, 5.29), "2.3² = 5.29", "nw"),
        seg(c.at(2.2, 4), c.at(2.2, 4.84), undefined, true),
        seg(c.at(2.3, 4), c.at(2.3, 5.29), undefined, true),
        note(c.at(2.2, 4), "2.2", "s"),
        note(c.at(2.3, 4), "2.3", "s"),
      ];
    })(),
    "A close-up of y = x² and y = 5: at x = 2.2 the parabola is below 5, at x = 2.3 it is above, so the crossing lies between them.",
    "y = x² 和 y = 5 的局部图：x = 2.2 时抛物线在 5 下方，x = 2.3 时在上方，所以交点在两者之间。",
  ),
  "modeling-downwards-vertical-motion#height-of-a-dropped-object": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 200, 50], xName: "t", yName: "h" });
      return [
        ...c.marks,
        ...curveOn(c, (t) => -16 * t * t + 200, 0, Math.sqrt(12.5), [0, 200]),
        ...dotAt(c.at(0, 200), "(0, 200)", "e", "result"),
        ...dotAt(c.at(3, 56), "(3, 56)", "ne"),
      ];
    })(),
    "h = −16t² + 200 is half of a downward parabola with vertex (0, 200). After 3 seconds, the height is 56 feet.",
    "h = −16t² + 200 是顶点 (0, 200)、开口向下的抛物线的一半。3 秒后高度是 56 英尺。",
  ),
  "modeling-upwards-vertical-motion#time-to-the-maximum-height": drawing(
    (() => {
      const c = chart({ x: [0, 4, 1], y: [0, 50, 10], xName: "t", yName: "h" });
      return [
        ...c.marks,
        ...curveOn(c, (t) => -16 * t * t + 48 * t + 6, 0, 3.12, [0, 50]),
        seg(c.at(1.5, 0), c.at(1.5, 42), "action", true),
        ...dotAt(c.at(1.5, 42), undefined, "n", "result"),
        note(c.at(1.5, 0), "t = 1.5", "s"),
      ];
    })(),
    "h = −16t² + 48t + 6: the highest point is on the axis t = 1.5.",
    "h = −16t² + 48t + 6：最高点在对称轴 t = 1.5 上。",
  ),
  "modeling-upwards-vertical-motion#the-maximum-height": drawing(
    (() => {
      const c = chart({ x: [0, 5, 1], y: [0, 80, 20], xName: "t", yName: "h" });
      return [
        ...c.marks,
        ...curveOn(c, (t) => -16 * t * t + 64 * t + 5, 0, 4.07, [0, 80]),
        seg(c.at(0, 69), c.at(2, 69), "action", true),
        ...dotAt(c.at(2, 69), "(2, 69)", "e", "result"),
      ];
    })(),
    "h = −16t² + 64t + 5 reaches its maximum height of 69 feet after 2 seconds.",
    "h = −16t² + 64t + 5 在 2 秒时达到最大高度 69 英尺。",
  ),
  "maximizing-profit-and-break-even-points#the-most-profitable-quantity": drawing(
    (() => {
      const c = chart({ x: [0, 80, 20], y: [-2000, 2000, 1000], xName: "x", yName: "P" });
      return [
        ...c.marks,
        ...curveOn(c, profit, 5, 75, [-2000, 2000]),
        seg(c.at(40, 0), c.at(40, 1400), "action", true),
        ...dotAt(c.at(40, 1400), undefined, "n", "result"),
      ];
    })(),
    "P(x) = −2x² + 160x − 1800 is a downward parabola, highest at x = 40.",
    "P(x) = −2x² + 160x − 1800 是开口向下的抛物线，在 x = 40 处最高。",
  ),
  "maximizing-profit-and-break-even-points#the-maximum-profit": drawing(
    (() => {
      const c = chart({ x: [0, 80, 20], y: [-2000, 2000, 1000], xName: "x", yName: "P" });
      return [
        ...c.marks,
        ...curveOn(c, profit, 5, 75, [-2000, 2000]),
        seg(c.at(0, 1400), c.at(40, 1400), "action", true),
        ...dotAt(c.at(40, 1400), "(40, 1400)", "e", "result"),
      ];
    })(),
    "The vertex of P is (40, 1400): the maximum profit is $1400, a value of P and not the number of items.",
    "P 的顶点是 (40, 1400)：最大利润是 1400 美元，是 P 的值，不是件数。",
  ),
  "maximizing-profit-and-break-even-points#profitable-quantities": drawing(
    (() => {
      const c = chart({ x: [0, 100, 10], y: [-500, 2000, 500], xName: "x", yName: "P" });
      const p: Fn = (x) => -(x - 10) * (x - 90);
      return [
        ...c.marks,
        ...curveOn(c, p, 4, 96, [-500, 2000]),
        seg(c.at(10, 0), c.at(90, 0), "result"),
        openAt(c.at(10, 0)),
        openAt(c.at(90, 0)),
      ];
    })(),
    "A downward profit parabola with break-even points 10 and 90: it is above the x-axis, making a profit, for 10 < x < 90.",
    "保本点为 10 和 90 的开口向下的利润抛物线：10 < x < 90 时在 x 轴上方，有利润。",
  ),
  "linear-correlation#strength-of-a-correlation": drawing(
    [
      ...mini(
        0,
        scatterOn((x) => 0.8 * x, 0.15),
        "r ≈ 1",
      ),
      ...mini(
        6,
        scatterOn((x) => 0.8 * x, 0.8),
        "r < 1",
      ),
    ],
    "Points hugging a line show a strong correlation. Points widely scattered around the same trend show a weak one.",
    "紧贴直线的点表示强相关。在同一趋势周围分散很开的点表示弱相关。",
  ),
  "selecting-a-regression-model#model-from-a-scatter-plot": drawing(
    [
      ...mini(
        0,
        scatterOn((x) => 0.8 * x, 0.1),
        "y = mx + b",
      ),
      ...mini(
        6,
        scatterOn((x) => 0.25 * 2.4 ** (x + 0.4) - 1.6, 0.06),
        "y = abˣ",
      ),
      ...mini(
        12,
        scatterOn((x) => 0.9 * x * x - 1.6, 0.06),
        "y = ax²",
      ),
    ],
    "Points along a straight line suggest a linear model, points curving faster and faster an exponential one, and points in a U shape a quadratic one.",
    "沿直线的点适合线性模型，越弯越快的点适合指数模型，呈 U 形的点适合二次模型。",
  ),
};
