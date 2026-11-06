// Drawings in the explanations of Linear Algebra about sets, lines and planes of space, spans, images of maps and rotation-scaling matrices.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { head, joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, tag, toward } from "./explanation-drawings-charts.ts";
import { thick, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, ring, seg, square } from "./explanation-drawings-kit.ts";
import { cross, type P3, plus3, scene } from "./explanation-drawings-multivariable-kit.ts";

const { sqrt, cos, sin, atan2, PI: pi } = Math;

const disc = (c: Point, r: number): Point[] =>
  Array.from({ length: 73 }, (_, i): Point => [c[0] + r * cos((2 * pi * i) / 72), c[1] + r * sin((2 * pi * i) / 72)]);

const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

// The small square at o between the directions of a and b.
const corner = (o: Point, a: Point, b: Point, d = 0.25): PlaneMark => {
  const unit = (p: Point): Point => {
    const l = Math.hypot(p[0] - o[0], p[1] - o[1]);
    return [(d * (p[0] - o[0])) / l, (d * (p[1] - o[1])) / l];
  };
  const [u, v] = [unit(a), unit(b)];
  return joined([
    [o[0] + u[0], o[1] + u[1]],
    [o[0] + u[0] + v[0], o[1] + u[1] + v[1]],
    [o[0] + v[0], o[1] + v[1]],
  ]);
};

// Two circles of radius 2 with centers (∓1.2, 0), inside a box: the marks and the counts of the regions.
const arc = (c: Point, a: number, b: number): Point[] =>
  Array.from({ length: 41 }, (_, i): Point => [c[0] + 2 * cos(a + ((b - a) * i) / 40), c[1] + 2 * sin(a + ((b - a) * i) / 40)]);
const meet = atan2(1.6, 1.2);
const onlyA = [...arc([-1.2, 0], meet, 2 * pi - meet), ...arc([1.2, 0], pi + meet, pi - meet)];
const onlyB = onlyA.map(([x, y]): Point => [-x, y]);
const venn = (counts: readonly [string, string, string, string?]): Mark[] => [
  ...chain([...rect(-4, -2.6, 4, 2.6), [-4, -2.6]]),
  ring(2, [-1.2, 0]),
  ring(2, [1.2, 0]),
  note([-2.2, 1.75], "A", "n"),
  note([2.2, 1.75], "B", "n"),
  note([-1.8, -0.3], counts[0], "n"),
  note([0, -0.3], counts[1], "n"),
  note([1.8, -0.3], counts[2], "n"),
  ...(counts[3] ? [note([3.5, -2.45], counts[3], "n")] : []),
];

// The triangle a plane cuts from the positive axes.
const cut = (a: number, b: number, c: number): P3[] => [
  [a, 0, 0],
  [0, b, 0],
  [0, 0, c],
];

// The arrows from the origin of the plane.
const from0 = (to: Point, tone?: "action" | "result"): PlaneMark => toward([0, 0], to, tone);

/** linearAlgebraDrawings1 holds the drawings of the first half of the Linear Algebra explanations, by "topic#point". */
export const linearAlgebraDrawings1: Readonly<Record<string, Figure>> = {
  "describing-planar-regions-using-set-builder-notation#circular-disks-and-regions": graphed(
    wide(-1, 5, -2, 4),
    [
      shape(disc([2, 1], 2), "result"),
      { kind: "circle", center: [2, 1], r: 2, tone: "result" },
      pt([2, 1], "(2, 1)", "w"),
      joined(
        [
          [2, 1],
          [4, 1],
        ],
        "action",
      ),
      tag([3, 1], "r = 2", "n"),
      tag([0.2, 3.6], "(x − 2)² + (y − 1)² ≤ 4", "e"),
    ],
    "For example, the closed disk with center (2, 1) and radius 2 is shaded, with its boundary circle: (x − 2)² + (y − 1)² ≤ 4. The boundary circle is the equality, and the open disk leaves it out.",
    "例如，圆心 (2, 1)、半径 2 的闭圆盘涂色，并画出边界圆：(x − 2)² + (y − 1)² ≤ 4。边界圆是等号的情形，开圆盘不含边界圆。",
  ),
  "cardinality-of-finite-sets#reading-counts-from-a-two-circle-diagram": drawing(
    [...venn(["5", "3", "4", "2"]), note([0, -2.75], "|A| = 8,  |A ∪ B| = 12,  |Aᶜ| = 6", "s")],
    "For example, the regions hold 5 in A only, 3 in both, 4 in B only and 2 outside. Then |A| = 5 + 3 = 8, |A ∪ B| = 5 + 3 + 4 = 12, and the complement of A holds 4 + 2 = 6.",
    "例如，各区域的个数为：仅 A 中 5，两者中 3，仅 B 中 4，两者之外 2。于是 |A| = 5 + 3 = 8，|A ∪ B| = 5 + 3 + 4 = 12，A 的补集有 4 + 2 = 6 个元素。",
  ),
  "the-difference-of-sets#the-size-of-a-symmetric-difference": drawing(
    [
      { kind: "shade", points: onlyA, tone: "result" },
      { kind: "shade", points: onlyB, tone: "result" },
      ...venn(["5", "3", "4"]),
      note([0, -2.75], "|A △ B| = 2 · 12 − 8 − 7 = 9", "s"),
    ],
    "For example, |A| = 8, |B| = 7 and |A ∪ B| = 12, so the regions hold 5, 3 and 4. The symmetric difference is the two shaded regions, 5 + 4 = 9, which agrees with 2 · 12 − 8 − 7 = 9.",
    "例如，|A| = 8，|B| = 7，|A ∪ B| = 12，所以各区域为 5、3、4。对称差是涂色的两个区域，5 + 4 = 9，与 2 · 12 − 8 − 7 = 9 一致。",
  ),
  "visualizing-cartesian-products#cartesian-product-of-intervals": graphed(
    wide(-1, 6, -1, 4),
    [
      shape(rect(1, 1, 4, 3), "result"),
      thick([1, 0], [4, 0], "action"),
      thick([0, 1], [0, 3], "action"),
      tag([2.5, 1.9], "A = 6", "n"),
      tag([2.5, 3], "b − a = 3", "n"),
      tag([4, 2], "d − c = 2", "e"),
    ],
    "For example, [1, 4] × [1, 3] is the shaded rectangle above the marked intervals on the axes. Its width is 4 − 1 = 3, its height is 3 − 1 = 2 and its area is 6.",
    "例如，[1, 4] × [1, 3] 是坐标轴上所标区间之上的涂色矩形。宽为 4 − 1 = 3，高为 3 − 1 = 2，面积为 6。",
  ),
  "visualizing-cartesian-products#the-overlap-of-two-products-of-intervals": graphed(
    wide(-1, 7, -1, 5),
    [
      shape(rect(1, 0, 4, 3)),
      shape(rect(2, 1, 6, 4)),
      shape(rect(2, 1, 4, 3), "result"),
      tag([3, 1.6], "[2, 4] × [1, 3]", "n"),
      tag([2.5, 0.4], "[1, 4] × [0, 3]", "n"),
      tag([4.9, 3], "[2, 6] × [1, 4]", "n"),
    ],
    "For example, [1, 4] × [0, 3] and [2, 6] × [1, 4] overlap in the rectangle [2, 4] × [1, 3], shaded darker. The first coordinates lie in both [1, 4] and [2, 6], which is [2, 4], and the second in both [0, 3] and [1, 4], which is [1, 3].",
    "例如，[1, 4] × [0, 3] 与 [2, 6] × [1, 4] 重叠于矩形 [2, 4] × [1, 3]（颜色较深）。第一坐标同时属于 [1, 4] 和 [2, 6]，即 [2, 4]；第二坐标同时属于 [0, 3] 和 [1, 4]，即 [1, 3]。",
  ),
  "the-vector-equation-of-a-line#vector-equation-from-point-and-direction": (() => {
    const s = scene(1.5);
    const P: P3 = [2, 0, 1];
    const v: P3 = [1, 2, 2];
    return drawing(
      [
        ...s.axes(4.5, 4.5, 5),
        ...s.line(plus3(P, v, -0.5), plus3(P, v, 1.6), "result"),
        ...s.arrow([0, 0, 0], P),
        ...s.arrow(P, plus3(P, v), "action"),
        ...s.say([1, 0, 0.5], "r₀", "w"),
        ...s.say(plus3(P, v, 0.5), "v", "se"),
        ...s.dot(P, "(2, 0, 1)", "w"),
        ...s.dot(plus3(P, v), "t = 1", "e"),
      ],
      "For example, the line through (2, 0, 1) along v = ⟨1, 2, 2⟩ is r(t) = ⟨2, 0, 1⟩ + t⟨1, 2, 2⟩. At t = 1 it reaches (3, 2, 3), the tip of v drawn from the point.",
      "例如，过 (2, 0, 1)、方向 v = ⟨1, 2, 2⟩ 的直线为 r(t) = ⟨2, 0, 1⟩ + t⟨1, 2, 2⟩。当 t = 1 时到达 (3, 2, 3)，即从该点作出的 v 的终点。",
    );
  })(),
  "the-vector-equation-of-a-plane#normal-vector-and-vector-plane-equation": (() => {
    const s = scene(1.6);
    const [P, R]: [P3, P3] = [
      [3, 1, 2],
      [2, 3, 2],
    ];
    return drawing(
      [
        ...s.axes(5, 5, 4.5),
        ...s.patch([
          [0, 0, 2],
          [4, 0, 2],
          [4, 4, 2],
          [0, 4, 2],
        ]),
        ...s.arrow(P, [3, 1, 3.4], "action"),
        ...s.arrow(P, R, "action"),
        ...s.arrow([0, 0, 0], P),
        ...s.arrow([0, 0, 0], R),
        ...s.say([3, 1, 3.4], "n", "n"),
        ...s.say([2.5, 2, 2], "r − r₀", "n"),
        ...s.say([1.5, 0.5, 1], "r₀", "w"),
        ...s.say([1, 1.5, 1], "r", "e"),
        note(s.p([3, 3, -1.2]), "n · (r − r₀) = 0", "s"),
      ],
      "For example, the plane z = 2 has the normal n = ⟨0, 0, 1⟩. With r₀ = ⟨3, 1, 2⟩ and r = ⟨2, 3, 2⟩, the difference r − r₀ = ⟨−1, 2, 0⟩ lies in the plane, so n · (r − r₀) = 0. Here d = n · r₀ = 2.",
      "例如，平面 z = 2 的法向量为 n = ⟨0, 0, 1⟩。取 r₀ = ⟨3, 1, 2⟩，r = ⟨2, 3, 2⟩，差 r − r₀ = ⟨−1, 2, 0⟩ 在平面内，所以 n · (r − r₀) = 0。此处 d = n · r₀ = 2。",
    );
  })(),
  "the-vector-equation-of-a-plane#plane-through-three-points-vector-form": (() => {
    const s = scene(1.9);
    const [P, Q, R]: [P3, P3, P3] = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 1],
    ];
    const c: P3 = [2 / 3, 2 / 3, 1 / 3];
    const tip = plus3(c, [2, 2, 4], 0.5);
    return drawing(
      [
        ...s.axes(3, 3, 3.5),
        ...s.patch([P, Q, R]),
        ...s.arrow(P, Q, "action"),
        ...s.arrow(P, R, "action"),
        ...s.arrow(c, tip, "action"),
        ...s.dot(P, "P", "nw"),
        ...s.dot(Q, "Q", "se"),
        ...s.dot(R, "R", "w"),
        ...s.say(tip, "n", "n"),
        note(s.p([2, 2, -0.7]), "n = PQ × PR = ⟨2, 2, 4⟩", "s"),
      ],
      "For example, P(2, 0, 0), Q(0, 2, 0) and R(0, 0, 1). Then PQ = ⟨−2, 2, 0⟩ and PR = ⟨−2, 0, 1⟩ lie along the plane, and PQ × PR = ⟨2, 2, 4⟩ is a normal, drawn at half its length.",
      "例如，P(2, 0, 0)，Q(0, 2, 0)，R(0, 0, 1)。于是 PQ = ⟨−2, 2, 0⟩ 和 PR = ⟨−2, 0, 1⟩ 平行于平面，PQ × PR = ⟨2, 2, 4⟩ 是法向量，图中按一半长度画出。",
    );
  })(),
  "the-cartesian-equation-of-a-plane#general-linear-equation-of-a-plane": (() => {
    const s = scene(1.9);
    const c: P3 = [1, 2 / 3, 1 / 3];
    return drawing(
      [
        ...s.axes(4, 3, 2.5),
        ...s.patch(cut(3, 2, 1)),
        ...s.arrow(c, plus3(c, [2, 3, 6], 0.25), "action"),
        ...s.say(plus3(c, [2, 3, 6], 0.25), "n = ⟨2, 3, 6⟩", "e"),
        note(s.p([3, 0, 0]), "3", "w"),
        note(s.p([0, 2, 0]), "2", "s"),
        note(s.p([0, 0, 1]), "1", "w"),
        note(s.p([3, 0, -0.7]), "2x + 3y + 6z − 6 = 0", "se"),
      ],
      "For example, 2x + 3y + 6z − 6 = 0. The coefficients give the normal ⟨2, 3, 6⟩, drawn at a quarter of its length, and the plane meets the axes at 3, 2 and 1.",
      "例如，2x + 3y + 6z − 6 = 0。系数给出法向量 ⟨2, 3, 6⟩（图中按四分之一长度画出），平面与三条坐标轴交于 3、2、1。",
    );
  })(),
  "the-cartesian-equation-of-a-plane#identifying-normal-vectors-from-cartesian-form": (() => {
    const s = scene(1.5);
    return drawing(
      [
        ...s.axes(4.2, 4.2, 4.2),
        ...s.patch(cut(1, 1, 1), "action"),
        ...s.patch(cut(3, 3, 3)),
        ...s.arrow([1 / 3, 1 / 3, 1 / 3], [0.9, 0.9, 0.9], "action"),
        ...s.arrow([1, 1, 1], [2.2, 2.2, 2.2]),
        ...s.say([0.9, 0.9, 0.9], "n₁", "w"),
        ...s.say([2.2, 2.2, 2.2], "n₂ = 2n₁", "e"),
        note(s.p([3, 0, -0.9]), "x + y + z = 1,  2x + 2y + 2z = 6", "s"),
      ],
      "For example, x + y + z = 1 has the normal n₁ = ⟨1, 1, 1⟩ and 2x + 2y + 2z = 6 has n₂ = ⟨2, 2, 2⟩ = 2n₁. So the two planes are parallel. Arrows show the directions, not the lengths.",
      "例如，x + y + z = 1 的法向量为 n₁ = ⟨1, 1, 1⟩，2x + 2y + 2z = 6 的法向量为 n₂ = ⟨2, 2, 2⟩ = 2n₁，所以两平面平行。箭头表示方向，不表示长度。",
    );
  })(),
  "the-cartesian-equation-of-a-plane#the-plane-through-a-point-parallel-to-a-plane": (() => {
    const s = scene(1.15);
    return drawing(
      [
        ...s.axes(4, 7, 4),
        ...s.patch(cut(2, 4, 2), "action"),
        ...s.patch(cut(3, 6, 3)),
        ...s.dot([1, 2, 1], "(1, 2, 1)", "e"),
        note(s.p([0, 4, 0]), "4", "s"),
        note(s.p([0, 6, 0]), "6", "s"),
        note(s.p([3, 0, -0.9]), "2x + y + 2z = 4", "s"),
        note(s.p([3, 0, -2]), "2x + y + 2z = 6", "s"),
      ],
      "For example, the plane through (1, 2, 1) parallel to 2x + y + 2z = 4. Keep the left side and substitute the point: 2 + 2 + 2 = 6, so the new plane is 2x + y + 2z = 6.",
      "例如，过 (1, 2, 1) 且平行于 2x + y + 2z = 4 的平面。保留左边并代入该点：2 + 2 + 2 = 6，所以新平面为 2x + y + 2z = 6。",
    );
  })(),
  "the-parametric-equations-of-a-plane#two-parameter-form-of-a-plane": (() => {
    const s = scene(1.3);
    const P: P3 = [1, 1, 1];
    const [u, v]: [P3, P3] = [
      [2, 0, 0],
      [0, 1, 2],
    ];
    const at = (a: number, b: number): P3 => plus3(plus3(P, u, a), v, b);
    return drawing(
      [
        ...s.axes(5.5, 4, 5.5),
        ...s.patch([at(0, 0), at(1.5, 0), at(1.5, 1.5), at(0, 1.5)]),
        ...[0.5, 1].flatMap((a) => [...s.line(at(a, 0), at(a, 1.5), undefined, true), ...s.line(at(0, a), at(1.5, a), undefined, true)]),
        ...s.arrow(P, at(1, 0), "action"),
        ...s.arrow(P, at(0, 1), "action"),
        ...s.say(at(0.5, 0), "u", "sw"),
        ...s.say(at(0, 0.5), "v", "nw"),
        ...s.dot(P, "r₀", "e"),
        ...s.dot(at(1, 1), undefined, undefined, "result"),
        note(s.p(at(1.5, 1)), "r(1, 1)", "e"),
      ],
      "For example, r₀ = ⟨1, 1, 1⟩, u = ⟨2, 0, 0⟩ and v = ⟨0, 1, 2⟩. The dashed lines are the steps of s and t, and s = t = 1 reaches r(1, 1) = (3, 2, 3).",
      "例如，r₀ = ⟨1, 1, 1⟩，u = ⟨2, 0, 0⟩，v = ⟨0, 1, 2⟩。虚线表示 s 和 t 的等步长线，s = t = 1 时到达 r(1, 1) = (3, 2, 3)。",
    );
  })(),
  "the-parametric-equations-of-a-plane#the-scalar-equation-from-a-parametric-plane": (() => {
    const s = scene(1.5);
    const p: P3 = [1, 1, 1];
    return drawing(
      [
        ...s.axes(4, 4, 4),
        ...s.patch(cut(3, 3, 3)),
        ...s.arrow(p, [2, 1, 0], "action"),
        ...s.arrow(p, [1, 2, 0], "action"),
        ...s.arrow(p, [2, 2, 2], "action"),
        ...s.dot(p, "p", "w"),
        ...s.say([2, 1, 0], "u", "s"),
        ...s.say([1, 2, 0], "v", "s"),
        ...s.say([2, 2, 2], "n = u × v", "e"),
        note(s.p([3, 0, -0.9]), "n · p = 3,  x + y + z = 3", "s"),
      ],
      "For example, u = ⟨1, 0, −1⟩, v = ⟨0, 1, −1⟩ and p = (1, 1, 1). Then n = u × v = ⟨1, 1, 1⟩, the constant is d = n · p = 3, and the plane is x + y + z = 3.",
      "例如，u = ⟨1, 0, −1⟩，v = ⟨0, 1, −1⟩，p = (1, 1, 1)。于是 n = u × v = ⟨1, 1, 1⟩，常数 d = n · p = 3，平面为 x + y + z = 3。",
    );
  })(),
  "the-intersection-of-two-planes#direction-vector-of-plane-intersection": (() => {
    const s = scene(1.5);
    return drawing(
      [
        ...s.axes(3.6, 5.4, 4),
        ...s.patch(
          [
            [0, 0, 0],
            [3, 0, 0],
            [3, 4, 0],
            [0, 4, 0],
          ],
          "action",
        ),
        ...s.patch([
          [2, 0, 0],
          [2, 4, 0],
          [0, 4, 2],
          [0, 0, 2],
        ]),
        ...s.line([2, -0.8, 0], [2, 4.8, 0], undefined),
        ...s.arrow([2, 2, 0], [2, 3.4, 0], "result"),
        ...s.arrow([2.6, 3.5, 0], [2.6, 3.5, 1.3], "action"),
        ...s.arrow([1, 3, 1], [1.8, 3, 1.8], "action"),
        ...s.say([2.6, 3.5, 1.3], "n₁", "e"),
        ...s.say([1.8, 3, 1.8], "n₂", "e"),
        ...s.say([2, 2.7, 0], "v", "n"),
        ...s.say([2, 4.8, 0], "L", "e"),
        note(s.p([3, 0, -0.7]), "v = n₁ × n₂ = ⟨0, 1, 0⟩", "s"),
      ],
      "For example, z = 0 and x + z = 2 have normals n₁ = ⟨0, 0, 1⟩ and n₂ = ⟨1, 0, 1⟩. Their line of intersection L has the direction n₁ × n₂ = ⟨0, 1, 0⟩, perpendicular to both.",
      "例如，z = 0 与 x + z = 2 的法向量为 n₁ = ⟨0, 0, 1⟩ 和 n₂ = ⟨1, 0, 1⟩。交线 L 的方向为 n₁ × n₂ = ⟨0, 1, 0⟩，与两法向量都垂直。",
    );
  })(),
  "the-intersection-of-two-planes#the-parameter-that-makes-two-planes-perpendicular": drawing(
    [
      seg([-3, 0], [3, 0], "result"),
      seg([0, -2.4], [0, 2.4], "result"),
      ...head([0, 0], [1.7, 0], "action"),
      ...head([0, 0], [0, 1.7], "action"),
      square([0, 0], [1, 0], [0, 1]),
      note([0, 1.7], "n₁ = ⟨3, 1, 1⟩", "e"),
      note([1.5, 0], "n₂ = ⟨1, 2, k⟩", "n"),
      note([0, -2.5], "n₁ · n₂ = 3 + 2 + k = 0,  k = −5", "s"),
    ],
    "For example, planes with normals ⟨3, 1, 1⟩ and ⟨1, 2, k⟩, seen edge-on as two lines. They are perpendicular exactly when the dot product is zero: 3 + 2 + k = 0, so k = −5.",
    "例如，法向量为 ⟨3, 1, 1⟩ 和 ⟨1, 2, k⟩ 的两平面，沿交线方向看去成两条直线。它们垂直当且仅当点积为零：3 + 2 + k = 0，所以 k = −5。",
  ),
  "the-shortest-distance-between-a-plane-and-a-point#point-plane-distance-formula": (() => {
    const s = scene(1.3);
    const [P, F]: [P3, P3] = [
      [3, 3, 3],
      [2, 1, 1],
    ];
    return drawing(
      [
        ...s.axes(7, 4.5, 4.5),
        ...s.patch(cut(6, 3, 3)),
        ...s.line(P, F, "action", true),
        ...s.dot(P, "P₀ (3, 3, 3)", "n"),
        ...s.dot(F, "(2, 1, 1)", "w"),
        ...s.say([2.5, 2, 2], "d = 3", "e"),
        note(s.p([6, 0, -0.8]), "x + 2y + 2z − 6 = 0", "s"),
        note(s.p([6, 0, -1.6]), "d = |3 + 6 + 6 − 6| / √9 = 3", "s"),
      ],
      "For example, from P₀(3, 3, 3) to x + 2y + 2z − 6 = 0: d = |3 + 6 + 6 − 6| / √(1 + 4 + 4) = 9/3 = 3. The dashed perpendicular ends at (2, 1, 1), which lies on the plane.",
      "例如，从 P₀(3, 3, 3) 到 x + 2y + 2z − 6 = 0：d = |3 + 6 + 6 − 6| / √(1 + 4 + 4) = 9/3 = 3。虚线垂线的垂足是平面上的点 (2, 1, 1)。",
    );
  })(),
  "the-shortest-distance-between-a-plane-and-a-point#distance-between-parallel-planes": drawing(
    [
      seg([-3.5, 0], [3.5, 0], "result"),
      seg([-3.5, 2], [3.5, 2], "result"),
      ...head([0, 0], [0, 2], "action"),
      square([0, 0], [1, 0], [0, 1]),
      note([0, 1], "d = 2", "e"),
      note([-3.5, 2], "2x + y + 2z − 8 = 0", "ne"),
      note([-3.5, 0], "2x + y + 2z − 2 = 0", "se"),
      note([0, -1.6], "d = |−2 + 8| / √9 = 2", "s"),
    ],
    "For example, 2x + y + 2z − 2 = 0 and 2x + y + 2z − 8 = 0, seen edge-on. The shared normal has length √(4 + 1 + 4) = 3, so d = |−2 − (−8)|/3 = 2.",
    "例如，2x + y + 2z − 2 = 0 与 2x + y + 2z − 8 = 0，从侧面看成两条直线。公共法向量的长度为 √(4 + 1 + 4) = 3，所以 d = |−2 − (−8)|/3 = 2。",
  ),
  "the-shortest-distance-between-a-plane-and-a-point#the-foot-of-the-perpendicular-on-a-plane": (() => {
    const s = scene(1.5);
    return drawing(
      [
        ...s.axes(4.2, 4, 4.2),
        ...s.patch([
          [0, 2, 0],
          [3, 2, 0],
          [3, 0, 2],
          [0, 0, 2],
        ]),
        ...s.line([1, 3, 3], [1, 1, 1], "action", true),
        ...s.dot([1, 3, 3], "P (1, 3, 3)", "e"),
        ...s.dot([1, 1, 1], "(1, 1, 1)", "s", "result"),
        ...s.say([1, 2, 2], "P + sn", "w"),
        note(s.p([4.2, 0, -0.5]), "y + z = 2,  s = −2", "s"),
      ],
      "For example, P(1, 3, 3) and the plane y + z = 2 with n = ⟨0, 1, 1⟩. Substituting P + sn gives (3 + s) + (3 + s) = 2, so s = −2 and the foot of the perpendicular is (1, 1, 1).",
      "例如，P(1, 3, 3) 和平面 y + z = 2，n = ⟨0, 1, 1⟩。代入 P + sn 得 (3 + s) + (3 + s) = 2，所以 s = −2，垂足为 (1, 1, 1)。",
    );
  })(),
  "the-intersection-between-a-line-and-a-plane#parallel-and-contained-lines": (() => {
    const s = scene(1.6);
    return drawing(
      [
        ...s.axes(5, 5, 4.6),
        ...s.patch([
          [0, 0, 2],
          [4, 0, 2],
          [4, 4, 2],
          [0, 4, 2],
        ]),
        ...s.line([3, 0, 2], [0, 3, 2], "action"),
        ...s.line([3, 0, 3], [0, 3, 3], "action"),
        ...s.arrow([3, 3, 2], [3, 3, 3], "action"),
        ...s.dot([3, 0, 2], "P₁", "w"),
        ...s.dot([3, 0, 3], "P₂", "w"),
        ...s.say([3, 3, 3], "n", "e"),
        ...s.say([1.5, 1.5, 3], "v", "n"),
        ...s.say([4, 4, 2], "z = 2", "e"),
        note(s.p([2, 4, -0.8]), "n · v = 0", "s"),
      ],
      "For example, n = ⟨0, 0, 1⟩ for the plane z = 2 and v = ⟨−1, 1, 0⟩, so n · v = 0. The line through P₁(3, 0, 2) lies in the plane, since its base point satisfies the equation; the line through P₂(3, 0, 3) stays above and never meets it.",
      "例如，平面 z = 2 的 n = ⟨0, 0, 1⟩，v = ⟨−1, 1, 0⟩，所以 n · v = 0。过 P₁(3, 0, 2) 的直线在平面内，因为它的基点满足方程；过 P₂(3, 0, 3) 的直线始终在上方，与平面不相交。",
    );
  })(),
  "the-intersection-between-a-line-and-a-plane#the-parameter-that-makes-a-line-parallel-to-a-plane": (() => {
    const s = scene(1.15);
    const [A, B]: [P3, P3] = [
      [1, 2, 2],
      [2, 4, 0],
    ];
    return drawing(
      [
        ...s.axes(4, 7, 4.5),
        ...s.patch(cut(3, 6, 3)),
        ...s.arrow([1, 2, 1], [1.8, 2.4, 1.8], "action"),
        ...s.say([1.8, 2.4, 1.8], "n", "n"),
        ...s.line(A, B, "action"),
        ...s.arrow(A, plus3(A, [1, 2, -2], 0.5), "action"),
        ...s.say(plus3(A, [1, 2, -2], 0.5), "v", "e"),
        note(s.p([3, 0, -0.9]), "n · v = 2 + 2 + 2k = 0,  k = −2", "s"),
      ],
      "For example, the direction v = ⟨1, 2, k⟩ and the plane 2x + y + 2z = 6 with n = ⟨2, 1, 2⟩. Setting n · v = 2 + 2 + 2k = 0 gives k = −2. The line drawn starts at (1, 2, 2) with 2x + y + 2z = 8, so it stays off the plane.",
      "例如，方向 v = ⟨1, 2, k⟩，平面 2x + y + 2z = 6，n = ⟨2, 1, 2⟩。令 n · v = 2 + 2 + 2k = 0 得 k = −2。图中的直线从 (1, 2, 2) 出发，在此 2x + y + 2z = 8，所以它不在平面上。",
    );
  })(),
  "basic-properties-of-determinants#the-area-of-a-parallelogram-from-a-determinant": graphed(
    wide(-1, 5, -1, 4),
    [
      shape(rect(0, 0, 1, 1)),
      shape(
        [
          [0, 0],
          [3, 1],
          [4, 3],
          [1, 2],
        ],
        "result",
      ),
      from0([3, 1], "action"),
      from0([1, 2], "action"),
      tag([3, 1], "(3, 1)", "e"),
      tag([1, 2], "(1, 2)", "n"),
      tag([2, 1.3], "|det A| = 5", "n"),
      tag([0.5, 0.15], "1", "n"),
    ],
    "For example, A has the columns (3, 1) and (1, 2), so det A = 3 · 2 − 1 · 1 = 5. The unit square of area 1 goes to the shaded parallelogram of area 5.",
    "例如，A 的列为 (3, 1) 和 (1, 2)，所以 det A = 3 · 2 − 1 · 1 = 5。面积为 1 的单位正方形变为面积为 5 的涂色平行四边形。",
  ),
  "solving-2x2-singular-systems-of-equations-using-gaussian-elimination#ranks-of-a-system-from-its-drawn-lines": (() => {
    const top = (p: ReturnType<typeof pane>, a: string, b: string): Mark[] => p.say(2, 5.3, a, "n").say(2, 4.6, b, "n").marks();
    const z: [number, number, number] = [0, 4, 2];
    return drawing(
      [
        ...top(
          pane(0, z, z, 6, 6)
            .f((x) => 2 - x, 0, 2, "result")
            .f((x) => x, 0, 4, "action"),
          "r(A) = 2",
          "r(A|b) = 2",
        ),
        ...top(
          pane(8, z, z, 6, 6)
            .f((x) => 2 - x, 0, 2, "result")
            .f((x) => 4 - x, 0, 4, "action"),
          "r(A) = 1",
          "r(A|b) = 2",
        ),
        ...top(
          pane(16, z, z, 6, 6).f((x) => 2 - x, 0, 2, "result"),
          "r(A) = 1",
          "r(A|b) = 1",
        ),
      ],
      "For example, from left to right. The crossing lines x + y = 2 and x − y = 0 have both ranks 2. The parallel lines x + y = 2 and x + y = 4 have r(A) = 1 and r(A|b) = 2, where r(A|b) is the rank of the augmented matrix. The line x + y = 2 drawn twice, as 2x + 2y = 4, has both ranks 1.",
      "例如，从左到右。相交直线 x + y = 2 和 x − y = 0 的两个秩都是 2。平行直线 x + y = 2 和 x + y = 4 的 r(A) = 1，r(A|b) = 2，其中 r(A|b) 是增广矩阵的秩。同一条直线 x + y = 2 写两次（2x + 2y = 4），两个秩都是 1。",
    );
  })(),
  "linear-span-of-vectors-in-n-dimensional-euclidean-space#reading-a-combination-of-two-arrows": graphed(
    wide(-2, 5, -1, 4),
    [
      from0([2, 1], "action"),
      from0([-1, 1], "action"),
      joined(
        [
          [2, 1],
          [4, 2],
        ],
        "result",
      ),
      toward([4, 2], [3, 3], "result"),
      pt([3, 3], "(3, 3) = 2a + b", "n"),
      tag([1, 0.5], "a", "s"),
      tag([-0.5, 0.5], "b", "w"),
      tag([3, 1.5], "2a", "s"),
      tag([3.5, 2.5], "b", "e"),
    ],
    "For example, a = (2, 1) and b = (−1, 1). To reach (3, 3), solve 2c₁ − c₂ = 3 and c₁ + c₂ = 3: c₁ = 2 and c₂ = 1. The coefficients 2 and 1 differ from the coordinates 3 and 3.",
    "例如，a = (2, 1)，b = (−1, 1)。要到达 (3, 3)，解 2c₁ − c₂ = 3，c₁ + c₂ = 3，得 c₁ = 2，c₂ = 1。系数 2 和 1 不同于坐标 3 和 3。",
  ),
  "the-column-space-of-a-matrix#the-equation-of-a-column-space": (() => {
    const s = scene(1.7);
    const at = (a: number, b: number): P3 => [a, b, a + b];
    return drawing(
      [
        ...s.axes(3, 3, 4),
        ...s.patch([at(-1, -1), at(1.5, -1), at(1.5, 1.5), at(-1, 1.5)]),
        ...s.arrow([0, 0, 0], [1, 0, 1], "action"),
        ...s.arrow([0, 0, 0], [0, 1, 1], "action"),
        ...s.arrow([0, 0, 0], [-1, -1, 1], "action"),
        ...s.say([1, 0, 1], "a₁", "w"),
        ...s.say([0, 1, 1], "a₂", "e"),
        ...s.say([-1, -1, 1], "n = a₁ × a₂", "w"),
        note(s.p(at(1.5, 1.5)), "z = x + y", "e"),
      ],
      "For example, the columns a₁ = (1, 0, 1) and a₂ = (0, 1, 1). Their cross product is n = ⟨−1, −1, 1⟩, so the column space is the plane −x − y + z = 0, that is z = x + y, through the origin.",
      "例如，列向量 a₁ = (1, 0, 1)，a₂ = (0, 1, 1)。它们的叉积为 n = ⟨−1, −1, 1⟩，所以列空间是过原点的平面 −x − y + z = 0，即 z = x + y。",
    );
  })(),
  "the-null-space-of-a-matrix#the-matrix-from-a-drawn-null-space": graphed(
    wide(-3, 5, -3, 5),
    [
      { kind: "line", a: [0, 0], b: [1, 2], tone: "result" },
      from0([1, 2], "result"),
      from0([2, -1], "action"),
      from0([4, -2], "action"),
      corner([0, 0], [1, 2], [2, -1]),
      tag([1, 2], "x = (1, 2)", "e"),
      tag([2, -1], "(2, −1)", "sw"),
      tag([4, -2], "(4, −2)", "ne"),
      tag([-2.8, 4.5], "Ax = 0", "e"),
    ],
    "For example, the null space is the line y = 2x, along (1, 2). The rows (2, −1) and (4, −2) are perpendicular to it, since 2 − 2 = 0 and 4 − 4 = 0, so A has these rows and Ax = 0 on the whole line.",
    "例如，零空间是沿 (1, 2) 的直线 y = 2x。行向量 (2, −1) 和 (4, −2) 与它垂直，因为 2 − 2 = 0，4 − 4 = 0，所以 A 以它们为行，整条直线上 Ax = 0。",
  ),
  "the-change-of-coordinates-matrix#the-determinant-of-a-change-of-coordinates-matrix": graphed(
    wide(-1, 5, -1, 4),
    [
      shape(
        [
          [0, 0],
          [2, 0],
          [3, 2],
          [1, 2],
        ],
        "result",
      ),
      {
        kind: "path",
        points: [
          [0, 0],
          [1, 0],
          [1, 2],
          [0, 2],
          [0, 0],
        ],
        tone: "action",
        dashed: true,
      },
      tag([2.1, 1], "det B = 4", "e"),
      tag([0.1, 2.05], "det C = 2", "ne"),
      tag([0.2, 3.4], "det(C⁻¹B) = 4/2 = 2", "e"),
    ],
    "For example, B has the columns (2, 0), (1, 2) and C has the columns (1, 0), (0, 2). The shaded B parallelogram has area det B = 4 and the dashed C rectangle has area det C = 2, so det(C⁻¹B) = 4/2 = 2.",
    "例如，B 的列为 (2, 0)、(1, 2)，C 的列为 (1, 0)、(0, 2)。涂色的 B 平行四边形面积为 det B = 4，虚线的 C 矩形面积为 det C = 2，所以 det(C⁻¹B) = 4/2 = 2。",
  ),
  "image-and-rank-of-a-linear-transformation#the-rank-from-the-image-of-the-basis": (() => {
    const q: Point = [10, 0];
    return drawing(
      [
        ...cross([0, 0], 3.2),
        ...head([0, 0], [2, 1], "action"),
        ...head([0, 0], [1, 2], "action"),
        note([2, 1], "T(e₁)", "e"),
        note([1, 2], "T(e₂)", "n"),
        note([0, -3.3], "r(T) = 2", "s"),
        ...cross(q, 3.2),
        seg([q[0] - 3, q[1] - 1.5], [q[0] + 4.4, q[1] + 2.2], "result", true),
        ...head(q, [q[0] + 4, q[1] + 2], "action"),
        ...head(q, [q[0] + 2, q[1] + 1], "action"),
        note([q[0] + 2, q[1] + 1], "T(e₁)", "nw"),
        note([q[0] + 4, q[1] + 2], "T(e₂)", "n"),
        note([q[0], -3.3], "r(T) = 1", "s"),
      ],
      "For example, on the left T(e₁) = (2, 1) and T(e₂) = (1, 2) are not parallel, so they span the plane and the rank is 2. On the right T(e₁) = (2, 1) and T(e₂) = (4, 2) are parallel, so they span only the dashed line and the rank is 1.",
      "例如，左图 T(e₁) = (2, 1)，T(e₂) = (1, 2) 不平行，张成整个平面，秩为 2。右图 T(e₁) = (2, 1)，T(e₂) = (4, 2) 平行，只张成虚线这条直线，秩为 1。",
    );
  })(),
  "image-of-a-linear-transformation-in-the-cartesian-plane#testing-membership-in-a-line-image": graphed(
    wide(-3, 6, -2, 5),
    [
      { kind: "line", a: [0, 0], b: [1, 2], tone: "result" },
      from0([1, 2], "action"),
      tag([1, 2], "u = (1, 2)", "e"),
      pt([2, 4], "(2, 4)", "e", "result"),
      pt([3, 1], "(3, 1)", "e"),
      tag([2, 3.4], "2 · 2 − 4 · 1 = 0", "e"),
      tag([3, 0.5], "3 · 2 − 1 · 1 = 5", "e"),
    ],
    "For example, the image is the line spanned by u = (1, 2). The point (2, 4) lies on it since 2 · 2 − 4 · 1 = 0, and (3, 1) does not since 3 · 2 − 1 · 1 = 5 ≠ 0.",
    "例如，像是由 u = (1, 2) 张成的直线。点 (2, 4) 在其上，因为 2 · 2 − 4 · 1 = 0；(3, 1) 不在其上，因为 3 · 2 − 1 · 1 = 5 ≠ 0。",
  ),
  "finding-complex-eigenvalues-of-real-2x2-matrices#complex-eigenvalues-from-a-drawn-rotation-scaling": graphed(
    wide(-3, 3, -1, 3),
    [
      from0([1, 0]),
      from0([0, 1]),
      from0([1, 2], "result"),
      from0([-2, 1], "result"),
      tag([0.7, 0], "e₁", "n"),
      tag([0, 0.7], "e₂", "e"),
      tag([1, 2], "(1, 2)", "e"),
      tag([-2, 1], "(−2, 1)", "n"),
      tag([0.9, 2.8], "λ = 1 ± 2i", "e"),
    ],
    "For example, with a = 1 and b = 2 the matrix sends e₁ to (1, 2) and e₂ to (−2, 1). Every vector turns, so there is no real eigenvector, and the eigenvalues are 1 ± 2i.",
    "例如，a = 1，b = 2，矩阵把 e₁ 变为 (1, 2)，把 e₂ 变为 (−2, 1)。每个向量都转动，所以没有实特征向量，特征值为 1 ± 2i。",
  ),
  "rotation-scaling-matrices#rotation-scaling-scale-factor": graphed(
    wide(-1, 5, -1, 5),
    [
      from0([1, 0]),
      from0([3, 4], "result"),
      joined(
        [
          [3, 0],
          [3, 4],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [1, 0],
          [3, 0],
        ],
        undefined,
        true,
      ),
      tag([0.5, 0], "1", "n"),
      tag([2, 0], "a = 3", "n"),
      tag([3, 2], "b = 4", "e"),
      tag([1.5, 2], "r = 5", "nw"),
      tag([0.2, 4.5], "r² = 25", "e"),
    ],
    "For example, a = 3 and b = 4. The matrix turns the unit vector to (3, 4), so lengths are multiplied by r, where r² = 3² + 4² = 25 and r = 5.",
    "例如，a = 3，b = 4。矩阵把单位向量转到 (3, 4)，所以长度乘以 r，其中 r² = 3² + 4² = 25，r = 5。",
  ),
  "rotation-scaling-matrices#the-rotation-angle-of-a-rotation-scaling-matrix": graphed(
    wide(-2, 2, -1, 3),
    [
      from0([-1, sqrt(3)], "result"),
      joined(
        [
          [-1, 0],
          [-1, sqrt(3)],
        ],
        undefined,
        true,
      ),
      { kind: "turn", center: [0, 0], from: [1, 0], degrees: 120 },
      pt([-1, sqrt(3)], "(−1, √3)", "n"),
      tag([0.1, 0.35], "θ = 2π/3", "e"),
      tag([-0.75, 1.3], "r = 2", "e"),
    ],
    "For example, a = −1 and b = √3, so r = 2. The point (−1, √3) lies in the second quadrant, the reference angle is π/3, and θ = π − π/3 = 2π/3.",
    "例如，a = −1，b = √3，所以 r = 2。点 (−1, √3) 在第二象限，参考角为 π/3，θ = π − π/3 = 2π/3。",
  ),
  "rotation-scaling-matrices#the-length-of-a-vector-under-a-power-of-a-rotation-scaling": graphed(
    wide(-1, 4, -1, 5),
    [
      from0([2, 0]),
      from0([2, 2], "action"),
      from0([0, 4], "result"),
      tag([1.75, 0], "v, ‖v‖ = 2", "n"),
      tag([2, 2], "Cv, ‖Cv‖ = 2√2", "e"),
      tag([0, 4], "C²v, ‖C²v‖ = 4", "e"),
    ],
    "For example, a = b = 1, so r = √2. Each application turns by π/4 and multiplies lengths by √2. With v = (2, 0): Cv = (2, 2) has length 2√2, and C²v = (0, 4) has length (√2)² · 2 = 4.",
    "例如，a = b = 1，所以 r = √2。每作用一次转过 π/4，长度乘以 √2。取 v = (2, 0)：Cv = (2, 2) 的长度为 2√2，C²v = (0, 4) 的长度为 (√2)² · 2 = 4。",
  ),
  "rotation-scaling-matrices#a-rotation-scaling-matrix-from-a-drawing": graphed(
    wide(-3, 3, -1, 3),
    [
      from0([1, 0]),
      from0([2, 1], "result"),
      from0([-1, 2], "action"),
      corner([0, 0], [2, 1], [-1, 2]),
      tag([0.7, 0], "e₁", "n"),
      tag([2, 1], "(a, b) = (2, 1)", "n"),
      tag([-1, 2], "(−b, a) = (−1, 2)", "nw"),
    ],
    "For example, e₁ goes to (2, 1), so a = 2 and b = 1. The first column is (2, 1) and the second is (−1, 2), and the matrix has rows (2, −1) and (1, 2).",
    "例如，e₁ 变为 (2, 1)，所以 a = 2，b = 1。第一列是 (2, 1)，第二列是 (−1, 2)，矩阵的行为 (2, −1) 和 (1, 2)。",
  ),
  "reducing-real-2x2-matrices-to-rotation-scaling-form#constructing-rotation-scaling-basis": graphed(
    wide(-1, 4, -1, 3),
    [
      shape([
        [0, 0],
        [2, 0],
        [3, 1],
        [1, 1],
      ]),
      from0([2, 0], "action"),
      from0([1, 1], "action"),
      tag([1.1, -0.4], "Re v = (2, 0)", "s"),
      tag([1, 1], "Im v = (1, 1)", "n"),
      tag([1, 2.3], "v = (2 + i, i)", "n"),
    ],
    "For example, the eigenvector v = (2 + i, i) has the real part (2, 0) and the imaginary part (1, 1). These two arrows are the columns of P, whose rows are (2, 1) and (0, 1).",
    "例如，特征向量 v = (2 + i, i) 的实部为 (2, 0)，虚部为 (1, 1)。这两个箭头是 P 的列，P 的行为 (2, 1) 和 (0, 1)。",
  ),
  "reducing-real-2x2-matrices-to-rotation-scaling-form#the-scaling-factor-of-a-real-matrix-with-complex-eigenvalues": graphed(
    wide(-1, 5, -5, 5, 1, 1, "Re", "Im"),
    [
      from0([3, 4], "result"),
      from0([3, -4], "action"),
      pt([3, 4], "3 + 4i", "e"),
      pt([3, -4], "3 − 4i", "e"),
      tag([1.5, 2], "r = 5", "nw"),
      tag([0.3, 4.6], "r = √(det A) = √25", "e"),
    ],
    "For example, eigenvalues 3 ± 4i. The real and imaginary parts give r = √(3² + 4²) = 5, and det A = 3² + 4² = 25, so r = √(det A).",
    "例如，特征值 3 ± 4i。实部和虚部给出 r = √(3² + 4²) = 5，而 det A = 3² + 4² = 25，所以 r = √(det A)。",
  ),
  "reducing-real-2x2-matrices-to-rotation-scaling-form#the-angle-in-a-rotation-scaling-form": graphed(
    wide(-1, 3, -1, 3),
    [
      from0([1, sqrt(3)], "result"),
      joined(
        [
          [1, 0],
          [1, sqrt(3)],
        ],
        undefined,
        true,
      ),
      { kind: "turn", center: [0, 0], from: [1, 0], degrees: 60 },
      tag([0.5, 0], "a = 1", "s"),
      tag([1, 0.9], "b = √3", "e"),
      tag([0.5, 1], "r = 2", "nw"),
      tag([0.55, 0.28], "θ", "e"),
      tag([0.1, 2.5], "cos θ = 1/2,  sin θ = √3/2", "e"),
    ],
    "For example, a = 1 and b = √3 give r = 2, so cos θ = 1/2 and sin θ = √3/2, and θ = π/3. The eigenvalues are 1 ± √3 i = 2(cos(π/3) ± i sin(π/3)).",
    "例如，a = 1，b = √3，得 r = 2，所以 cos θ = 1/2，sin θ = √3/2，θ = π/3。特征值为 1 ± √3 i = 2(cos(π/3) ± i sin(π/3))。",
  ),
  "reducing-real-2x2-matrices-to-rotation-scaling-form#the-rotation-scaling-form-from-a-drawn-image": graphed(
    wide(-2, 4, -1, 4),
    [
      from0([1, 0]),
      from0([3, 1], "result"),
      from0([-1, 3], "action"),
      corner([0, 0], [3, 1], [-1, 3]),
      tag([0.7, 0], "e₁", "n"),
      tag([3, 1], "(3, 1)", "n"),
      tag([-1, 3], "(−1, 3)", "n"),
    ],
    "For example, e₁ goes to (3, 1), so the first column is (3, 1). Turning it a quarter turn counterclockwise gives the second column (−1, 3).",
    "例如，e₁ 变为 (3, 1)，所以第一列是 (3, 1)。把它逆时针转四分之一圈，得第二列 (−1, 3)。",
  ),
};
