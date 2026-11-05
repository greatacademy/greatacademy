// Further drawings in the explanations of Geometry: motions on a grid, lines, proofs of triangles and parallelograms, circles, solids and Venn diagrams.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, PlaneView, Point } from "@ga/subject-math";

import {
  angle,
  boxMarks,
  coneMarks,
  cylinderMarks,
  drawing,
  ellipse,
  fromSides,
  graphed,
  name,
  note,
  on,
  pair,
  pyramidMarks,
  rightTriangle,
  ring,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

/** shift moves marks by dx and dy, so that several small pictures can stand in one row. */
export function shift(marks: readonly Mark[], dx: number, dy = 0): Mark[] {
  const p = (q: Point): Point => [q[0] + dx, q[1] + dy];
  return marks.map((m): Mark => {
    switch (m.kind) {
      case "segment":
      case "side":
      case "ticks":
      case "arrows":
        return { ...m, a: p(m.a), b: p(m.b) };
      case "polygon":
        return { ...m, points: m.points.map(p) };
      case "shade":
        return { ...m, points: m.points.map(p), ...(m.holes && { holes: m.holes.map((h) => h.map(p)) }) };
      case "arc":
      case "right":
        return { ...m, vertex: p(m.vertex), from: p(m.from), to: p(m.to) };
      default:
        return { ...m, at: p(m.at) };
    }
  });
}

/** view is a square window of the plane around the origin. */
export const view = (lo: number, hi: number, labelEvery = 1, yLo = lo, yHi = hi): PlaneView => ({
  xMin: lo,
  xMax: hi,
  yMin: yLo,
  yMax: yHi,
  step: 1,
  labelEvery,
});

/** pt is a labeled point of the plane. */
export const pt = (
  at: Point,
  label: string,
  dir: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" = "ne",
  tone?: "action" | "result",
): PlaneMark => ({
  kind: "point",
  at,
  label,
  dir,
  ...(tone && { tone }),
});

/** ln is a whole line through two points. */
export const ln = (a: Point, b: Point, tone?: "action" | "result", dashed = false): PlaneMark => ({
  kind: "line",
  a,
  b,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** shape is a filled polygon of the plane. */
export const shape = (points: readonly Point[], tone?: "action" | "result"): PlaneMark => ({
  kind: "polygon",
  points,
  ...(tone && { tone }),
});

/** rect is a rectangle at a place. */
export const rect = (x: number, y: number, w: number, h: number): Mark => ({
  kind: "polygon",
  points: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
});

const tick = (a: Point, b: Point, count = 1): Mark => ({ kind: "ticks", a, b, count });
const arrows = (a: Point, b: Point, count = 1): Mark => ({ kind: "arrows", a, b, count });
const label = (a: Point, b: Point, text: string): Mark => ({ kind: "side", a, b, text });
const poly = (...points: Point[]): Mark => ({ kind: "polygon", points });

// Triangles in proofs.
const isoA: Point = [0, 3.6];
const isoB: Point = [-2, 0];
const isoC: Point = [2, 0];
const isoD: Point = [0, 0];

const isoNames = (mid: string): Mark[] => [name(isoA, "A", "n"), name(isoB, "B", "sw"), name(isoC, "C", "se"), name(isoD, mid, "s")];

// Parallelograms in proofs.
const pgA: Point = [0, 0];
const pgB: Point = [5, 0];
const pgC: Point = [6.5, 3];
const pgD: Point = [1.5, 3];
const pgE: Point = [3.25, 1.5];
const pgFrame: Mark[] = [poly(pgA, pgB, pgC, pgD), name(pgA, "A", "sw"), name(pgB, "B", "se"), name(pgC, "C", "ne"), name(pgD, "D", "nw")];

// Solids.
/** ringOf is the n corners of a base seen from above, with an edge at the front. */
const ringOf = (n: number, r: number, y = 0): Point[] =>
  Array.from({ length: n }, (_, i) => {
    const d = -90 - 180 / n + (i * 360) / n;
    return [r * Math.cos((d * Math.PI) / 180), y + 0.35 * r * Math.sin((d * Math.PI) / 180)];
  });

/** hiddenCorner says whether a corner of a base lies behind the solid. */
const hiddenCorner = (c: readonly Point[], i: number, y = 0): boolean => {
  const xs = c.map((q) => q[0]);
  const x = c[i]![0];
  return c[i]![1] > y + 1e-9 && x > Math.min(...xs) + 1e-9 && x < Math.max(...xs) - 1e-9;
};

/** baseEdges draws the edges of a base, dashed behind the solid. */
const baseEdges = (c: readonly Point[], y = 0): Mark[] =>
  c.map((q, i) => {
    const r = c[(i + 1) % c.length]!;
    return seg(q, r, undefined, (q[1] + r[1]) / 2 > y + 1e-9);
  });

/** prismMarks draws a prism on a regular base with n sides. */
export function prismMarks(n: number, r: number, h: number): Mark[] {
  const bottom = ringOf(n, r);
  const top = ringOf(n, r, h);
  return [
    ...baseEdges(bottom),
    ...top.map((q, i) => seg(q, top[(i + 1) % n]!)),
    ...bottom.map((q, i) => seg(q, top[i]!, undefined, hiddenCorner(bottom, i))),
  ];
}

/** pyramidOn draws a pyramid on a regular base with n sides. */
export function pyramidOn(n: number, r: number, h: number): Mark[] {
  const base = ringOf(n, r);
  const apex: Point = [0, h];
  return [...baseEdges(base), ...base.map((q, i) => seg(q, apex, undefined, hiddenCorner(base, i)))];
}

const sphereMarks = (r: number, text?: string): Mark[] => [
  ring(r),
  ...ellipse([0, 0], r, r * 0.28, true),
  seg([0, 0], [r, 0], "accent"),
  { kind: "dot", at: [0, 0] },
  ...(text ? [note([r / 2, 0], text, "n")] : []),
];

const hemisphereMarks = (r: number, text?: string): Mark[] => [
  ...Array.from({ length: 45 }, (_, i) => seg(on(i * 4, r), on((i + 1) * 4, r))),
  ...ellipse([0, 0], r, r * 0.28),
  seg([0, 0], [r, 0], "accent"),
  { kind: "dot", at: [0, 0] },
  ...(text ? [note([r / 2, 0], text, "n")] : []),
];

/** frustumMarks draws a cone with its top cut off, with the two radii and the slant height. */
const frustumMarks = (R: number, r: number, h: number, big: string, small: string, slant: string): Mark[] => [
  ...ellipse([0, 0], R, R * 0.28, true),
  ...ellipse([0, h], r, r * 0.28),
  seg([-R, 0], [-r, h]),
  seg([R, 0], [r, h], "result"),
  seg([0, 0], [R, 0], "accent"),
  seg([0, h], [r, h], "action"),
  note([R / 2, 0], big, "s"),
  note([r / 2, h], small, "n"),
  note([(R + r) / 2, h / 2], slant, "e"),
];

/** Polyhedron corner coordinates, seen from a fixed direction with hidden edges dashed. */
const phi = (1 + Math.sqrt(5)) / 2;
const signs = [1, -1];
const cubeCorners = signs.flatMap((a) => signs.flatMap((b) => signs.map((c): number[] => [a, b, c])));
const solidsAt: Record<string, number[][]> = {
  tetrahedron: [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ],
  cube: cubeCorners,
  octahedron: [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ],
  dodecahedron: [
    ...cubeCorners,
    ...signs.flatMap((a) =>
      signs.flatMap((b) => [
        [0, a / phi, b * phi],
        [a / phi, b * phi, 0],
        [a * phi, 0, b / phi],
      ]),
    ),
  ],
  icosahedron: signs.flatMap((a) =>
    signs.flatMap((b) => [
      [0, a, b * phi],
      [a, b * phi, 0],
      [a * phi, 0, b],
    ]),
  ),
};

/** wireframe draws a Platonic solid of the given name, scaled to a radius. */
function wireframe(which: string, r: number): Mark[] {
  const rot = (v: number[]): number[] => {
    const [x, y, z] = v as [number, number, number];
    const a = 0.5;
    const b = 0.35;
    const x1 = x * Math.cos(a) + z * Math.sin(a);
    const z1 = -x * Math.sin(a) + z * Math.cos(a);
    return [x1, y * Math.cos(b) - z1 * Math.sin(b), y * Math.sin(b) + z1 * Math.cos(b)];
  };
  const raw = solidsAt[which]!.map(rot);
  const size = Math.max(...raw.map((v) => Math.hypot(v[0]!, v[1]!, v[2]!)));
  const c = raw.map((v) => v.map((u) => (u * r) / size));
  const dist = (u: number[], v: number[]) => Math.hypot(u[0]! - v[0]!, u[1]! - v[1]!, u[2]! - v[2]!);
  let least = Number.POSITIVE_INFINITY;
  for (let i = 0; i < c.length; i += 1) for (let j = i + 1; j < c.length; j += 1) least = Math.min(least, dist(c[i]!, c[j]!));
  const marks: Mark[] = [];
  for (let i = 0; i < c.length; i += 1)
    for (let j = i + 1; j < c.length; j += 1)
      if (dist(c[i]!, c[j]!) < least * 1.01) {
        const u = c[i]!;
        const v = c[j]!;
        marks.push(seg([u[0]!, u[1]!], [v[0]!, v[1]!], undefined, u[2]! + v[2]! < -0.2 * r));
      }
  return marks;
}

// Venn diagrams.
const vennFrame = (w = 5.6): Mark[] => [
  rect(-w, -3.4, 2 * w, 6.8),
  ring(2.6, [-1.5, 0]),
  ring(2.6, [1.5, 0]),
  name([-3.3, 1.85], "A", "nw"),
  name([3.3, 1.85], "B", "ne"),
];

/** vennWith writes the given texts in the regions A only, both, B only and, when given, outside. */
const vennWith = (aOnly: string, both: string, bOnly: string, outside?: string): Mark[] => [
  ...vennFrame(),
  note([-2.5, -0.45], aOnly, "n"),
  note([0, -0.45], both, "n"),
  note([2.5, -0.45], bOnly, "n"),
  ...(outside ? [note([4.7, -3.15], outside, "n")] : []),
];

// Parts of little pictures that repeat.
const smallTriangle = fromSides(4, 3.4, 3);

/** criterion is a small triangle with the congruent parts of a criterion marked. */
function criterion(text: string, sides: readonly number[], corners: readonly number[]): Mark[] {
  const [a, b, c] = smallTriangle;
  const edge: readonly (readonly [Point, Point])[] = [
    [a, b],
    [b, c],
    [c, a],
  ];
  const at: readonly (readonly [Point, Point, Point])[] = [
    [a, b, c],
    [b, c, a],
    [c, a, b],
  ];
  return [
    { kind: "polygon", points: [a, b, c] },
    ...sides.map((s, i) => tick(edge[s]![0], edge[s]![1], i + 1)),
    ...corners.map((k) => angle(at[k]![0], at[k]![1], at[k]![2], k === corners[0] ? "accent" : "action")),
    note([2, -0.25], text, "s"),
  ];
}

const flatFan = (count: number): Mark[] => [
  ...Array.from({ length: count }, (_, i) => poly([0, 0], on(i * 60, 1.5), on((i + 1) * 60, 1.5))),
];

/** geometryDrawings2 are further explanation drawings of Geometry, by topic and knowledge point. */
export const geometryDrawings2: Readonly<Record<string, Figure>> = {
  "rotation-rules-in-the-coordinate-plane#choosing-a-rotation-rule": graphed(
    view(-5, 5, 1),
    [
      pt([3, 1], "(3, 1)", "e"),
      pt([-1, 3], "(−1, 3)", "n", "result"),
      pt([-3, -1], "(−3, −1)", "w", "result"),
      pt([1, -3], "(1, −3)", "e", "result"),
      { kind: "segment", a: [0, 0], b: [3, 1], dashed: true },
      { kind: "segment", a: [0, 0], b: [-1, 3], dashed: true },
      { kind: "segment", a: [0, 0], b: [-3, -1], dashed: true },
      { kind: "segment", a: [0, 0], b: [1, -3], dashed: true },
    ],
    "The point (3, 1) and its images: (−1, 3) by a rotation of 90°, (−3, −1) by 180°, and (1, −3) by −90°.",
    "点 (3, 1) 及其像：旋转 90° 得 (−1, 3)，旋转 180° 得 (−3, −1)，旋转 −90° 得 (1, −3)。",
  ),
  "combining-stretches-of-geometric-figures#areas-under-combined-stretches": drawing(
    [poly([0, 0], [5, 0], [1, 4]), note([2, 1.2], "10", "n"), ...shift([poly([0, 0], [15, 0], [3, 2]), note([6, 0.4], "15", "n")], 7)],
    "A triangle of area 10 and its image after a horizontal stretch by 3 and a vertical stretch by one half, with area 15.",
    "面积为 10 的三角形，水平拉伸 3 倍、竖直拉伸为一半后，面积为 15。",
  ),
  "combining-geometric-transformations#a-single-rule-for-two-transformations": graphed(
    view(-5, 5, 1),
    [
      ln([0, 0], [1, 1], "action", true),
      pt([3, 1], "(3, 1)", "e"),
      pt([3, -1], "(3, −1)", "e", "action"),
      pt([-1, 3], "(−1, 3)", "n", "result"),
      { kind: "arrow", from: [3, 1], to: [3, -1], tone: "action", thin: true },
      { kind: "arrow", from: [3, -1], to: [-1, 3], tone: "action", thin: true },
    ],
    "The point (3, 1) reflected across the x-axis to (3, −1), then across y = x to (−1, 3), as the rule (x, y) to (−y, x) says.",
    "点 (3, 1) 关于 x 轴反射到 (3, −1)，再关于 y = x 反射到 (−1, 3)，与法则 (x, y) 变为 (−y, x) 一致。",
  ),
  "the-sss-congruence-criterion#solving-with-sss": drawing(
    (() => {
      const [a, b, c] = fromSides(10, 13, 7);
      return [
        poly(a, b, c),
        label(a, b, "10"),
        label(b, c, "13"),
        label(c, a, "7"),
        name(a, "A", "sw"),
        name(b, "B", "se"),
        name(c, "C", "n"),
        ...shift(
          [
            poly(a, b, c),
            label(a, b, "x + 6"),
            label(b, c, "2x + 5"),
            label(c, a, "7"),
            name(a, "D", "sw"),
            name(b, "E", "se"),
            name(c, "F", "n"),
          ],
          13,
        ),
      ];
    })(),
    "Triangles with sides 7, 10, 13 and 7, x + 6, 2x + 5: at x = 4 the expressions give 10 and 13.",
    "边长为 7、10、13 和 7、x + 6、2x + 5 的两个三角形：x = 4 时两个式子等于 10 和 13。",
  ),
  "the-pythagorean-theorem#finding-the-hypotenuse": rightTriangle(
    { legs: [8, 6], a: "8", b: "6", c: "10" },
    "A right triangle with legs 8 and 6 and hypotenuse 10.",
    "直角边为 8 和 6、斜边为 10 的直角三角形。",
  ),
  "the-pythagorean-theorem#lengths-in-simplest-radical-form": rightTriangle(
    { legs: [6, 4], a: "6", b: "4", c: "2√13" },
    "A right triangle with legs 6 and 4 and hypotenuse 2√13.",
    "直角边为 6 和 4、斜边为 2√13 的直角三角形。",
  ),
  "combining-congruence-criteria-for-triangles#choosing-a-criterion": drawing(
    [
      ...criterion("SSS", [0, 1, 2], []),
      ...shift(criterion("SAS", [0, 2], [0]), 5.5),
      ...shift(criterion("ASA", [0], [0, 1]), 11),
      ...shift(criterion("AAS", [1], [0, 1]), 16.5),
    ],
    "Four triangles with the congruent parts marked: three sides for SSS, two sides and the angle between for SAS, two angles and the side between for ASA, and two angles and another side for AAS.",
    "四个标出全等部分的三角形：SSS 是三条边，SAS 是两边及其夹角，ASA 是两角及其夹边，AAS 是两角及另一条边。",
  ),
  "rigid-motions-and-congruence#recognizing-rigid-motions": graphed(
    view(-7, 7, 2),
    [
      shape([
        [1, 1],
        [4, 1],
        [1, 3],
      ]),
      shape(
        [
          [-1, 1],
          [-4, 1],
          [-1, 3],
        ],
        "result",
      ),
      shape(
        [
          [1, -4],
          [4, -4],
          [1, -2],
        ],
        "result",
      ),
      shape(
        [
          [-1, -1],
          [-4, -1],
          [-1, -3],
        ],
        "result",
      ),
    ],
    "A triangle with three images of the same size: a reflection, a translation and a rotation. Every distance is kept, so all four are congruent.",
    "一个三角形和大小相同的三个像：反射、平移和旋转。所有距离都不变，所以四个三角形全等。",
  ),
  "properties-of-congruence#rewriting-congruence-statements": pair(
    {
      names: ["A", "B", "C", "D", "E", "F"],
      corners: [
        [0, "accent"],
        [1, "action"],
        [2, "result"],
      ],
    },
    "Triangles ABC and DEF with matching angles marked at A and D, at B and E, and at C and F.",
    "三角形 ABC 和 DEF，相同记号标出对应角：A 与 D、B 与 E、C 与 F。",
  ),
  "areas-of-similar-polygons#area-from-the-scale-factor": drawing(
    [
      rect(0, 0, 5, 4),
      note([2.5, 1.5], "20 cm²", "n"),
      label([0, 0], [5, 0], "5"),
      label([5, 0], [5, 4], "4"),
      ...shift([rect(0, 0, 7.5, 6), note([3.75, 2.5], "45 cm²", "n"), label([0, 0], [7.5, 0], "7.5"), label([7.5, 0], [7.5, 6], "6")], 7.5),
    ],
    "A rectangle of area 20 square centimeters enlarged with scale factor 3/2: its sides become 7.5 and 6, and its area 45.",
    "面积为 20 平方厘米的长方形按比例 3/2 放大：边长变为 7.5 和 6，面积变为 45。",
  ),
  "combining-similarity-criteria-for-triangles#choosing-a-criterion": drawing(
    [...criterion("AA", [], [0, 1]), ...shift(criterion("SSS", [0, 1, 2], []), 5.5), ...shift(criterion("SAS", [0, 2], [0]), 11)],
    "Three triangles with the marks of the similarity criteria: two angles for AA, three proportional sides for SSS, and two proportional sides with the angle between them for SAS.",
    "三个标出相似判定条件的三角形：AA 是两个角，SSS 是三组成比例的边，SAS 是两组成比例的边及其夹角。",
  ),
  "proving-similarity-statements#proving-proportions-and-angles": pair(
    {
      names: ["A", "B", "C", "D", "E", "F"],
      k: 1.5,
      corners: [
        [1, "accent"],
        [2, "action"],
      ],
    },
    "Triangles ABC and DEF with angle B marked equal to angle E and angle C equal to angle F.",
    "三角形 ABC 和 DEF，标出 ∠B = ∠E，∠C = ∠F。",
  ),
  "areas-of-circles#approximating-area": drawing(
    [
      ring(4),
      { kind: "shade", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, 4)) },
      seg([0, 0], [4, 0], "accent"),
      note([2, 0], "4 cm", "n"),
    ],
    "A circle with radius 4 centimeters, its area shaded.",
    "半径为 4 厘米的圆，阴影是它的面积。",
  ),
  "areas-of-circles#radius-from-area": drawing(
    [ring(7), seg([-7, 0], [0, 0], "action"), seg([0, 0], [7, 0], "accent"), note([3.5, 0], "r = 7", "n"), note([0, 0], "d = 14", "s")],
    "A circle of area 49π square centimeters, with radius 7 and diameter 14.",
    "面积为 49π 平方厘米的圆，半径为 7，直径为 14。",
  ),
  "areas-of-circles#area-and-circumference": drawing(
    [ring(5), seg([0, 0], [5, 0], "accent"), note([2.5, 0], "r = 5", "n"), note([0, 5], "C = 10π", "n"), note([0, -2], "A = 25π", "n")],
    "A circle with circumference 10π meters, radius 5 meters and area 25π square meters.",
    "周长为 10π 米、半径为 5 米、面积为 25π 平方米的圆。",
  ),
  "circle-similarity#circumferences-of-similar-circles": drawing(
    [
      ring(4),
      seg([0, 0], [4, 0], "accent"),
      note([2, 0], "4", "n"),
      note([0, -4], "C = 8π", "s"),
      ...shift([ring(6), seg([0, 0], [6, 0], "accent"), note([3, 0], "6", "n"), note([0, -6], "C = 12π", "s")], 11),
    ],
    "Two circles: circumference 8π meters with radius 4, and circumference 12π meters with radius 6.",
    "两个圆：周长 8π 米、半径 4，周长 12π 米、半径 6。",
  ),
  "circle-similarity#areas-of-similar-circles": drawing(
    [
      ring(3),
      note([0, -1.2], "18", "s"),
      seg([0, 0], [3, 0], "accent"),
      note([1.5, 0], "r", "n"),
      ...shift([ring(5), note([0, -2], "50", "s"), seg([0, 0], [5, 0], "accent"), note([2.5, 0], "5/3 r", "n")], 9),
    ],
    "Two circles with areas 18 and 50: radii in ratio 3 to 5 give areas in ratio 9 to 25.",
    "面积为 18 和 50 的两个圆：半径之比 3 比 5，面积之比 9 比 25。",
  ),
  "proving-circle-similarity#the-translation-and-the-scale-factor": graphed(
    view(-8, 14, 2, -10, 12),
    [
      { kind: "circle", center: [-2, 5], r: 4 },
      { kind: "circle", center: [3, 1], r: 10, tone: "result" },
      pt([-2, 5], "A(−2, 5)", "n"),
      pt([3, 1], "B(3, 1)", "s", "result"),
      { kind: "arrow", from: [-2, 5], to: [3, 1], tone: "action" },
    ],
    "Circle A with center (−2, 5) and radius 4 and circle B with center (3, 1) and radius 10; the translation (5, −4) carries one center to the other.",
    "圆 A 圆心 (−2, 5)、半径 4，圆 B 圆心 (3, 1)、半径 10；平移 (5, −4) 把一个圆心移到另一个。",
  ),
  "proving-circle-similarity#the-proof-that-all-circles-are-similar": drawing(
    [
      ring(1.6),
      seg([0, 0], [1.6, 0], "accent"),
      note([0.8, 0], "r", "n"),
      name([0, 0], "A", "s"),
      { kind: "dot", at: [0, 0] },
      seg([0, 0], [7, 0], "action", true),
      ring(1.6, [7, 0], "action"),
      ring(3, [7, 0]),
      seg([7, 0], [10, 0], "accent"),
      note([8.5, 0], "s", "n"),
      name([7, 0], "B", "s"),
      { kind: "dot", at: [7, 0] },
    ],
    "Circle A with radius r translated so that A goes to B, then dilated about B with scale factor s over r onto circle B with radius s.",
    "把半径为 r 的圆 A 平移，使 A 到 B，再以 B 为中心、比例 s/r 位似到半径为 s 的圆 B 上。",
  ),
  "finding-equations-of-parallel-lines#parallel-line-in-point-slope-form": graphed(
    view(-6, 6, 2),
    [ln([0, -2 / 3], [4, 4 / 3]), ln([-2, 5], [2, 7], "result"), pt([-2, 5], "(−2, 5)", "nw", "result")],
    "The line 3x − 6y = 4 and the parallel line through (−2, 5), both with slope one half.",
    "直线 3x − 6y = 4 和过 (−2, 5) 的平行线，斜率都是二分之一。",
  ),
  "finding-equations-of-parallel-lines#parallel-line-in-standard-form": graphed(
    view(-4, 9, 2, -4, 9),
    [ln([0, 5], [3, 3]), ln([4, 1], [1, 3], "result"), pt([4, 1], "(4, 1)", "se", "result")],
    "The line y = −(2/3)x + 5 and the parallel line 2x + 3y = 11 through (4, 1).",
    "直线 y = −(2/3)x + 5 和过 (4, 1) 的平行线 2x + 3y = 11。",
  ),
  "finding-equations-of-parallel-lines#parallel-to-a-line-through-two-points": graphed(
    view(-4, 8, 2, -4, 9),
    [
      ln([1, -2], [5, 4]),
      pt([1, -2], "A(1, −2)", "se"),
      pt([5, 4], "B(5, 4)", "se"),
      ln([2, 7], [4, 10], "result"),
      pt([2, 7], "(2, 7)", "nw", "result"),
    ],
    "The line through A(1, −2) and B(5, 4), with slope 3/2, and the parallel line through (2, 7).",
    "过 A(1, −2) 和 B(5, 4) 的直线，斜率为 3/2，以及过 (2, 7) 的平行线。",
  ),
  "finding-equations-of-parallel-lines#parallel-horizontal-and-vertical-lines": graphed(
    view(-6, 6, 1),
    [
      ln([-1, 0], [-1, 1]),
      ln([3, 0], [3, 1], "result"),
      ln([0, -4], [1, -4], "action"),
      pt([3, -4], "(3, −4)", "se", "result"),
      { kind: "label", at: [-1, 5], text: "x = −1", dir: "w" },
      { kind: "label", at: [3, 5], text: "x = 3", dir: "e" },
      { kind: "label", at: [-5, -4], text: "y = −4", dir: "n" },
    ],
    "Through (3, −4), the line x = 3 is parallel to x = −1, and the line y = −4 is parallel to the x-axis.",
    "过 (3, −4)，直线 x = 3 平行于 x = −1，直线 y = −4 平行于 x 轴。",
  ),
  "finding-equations-of-perpendicular-lines#perpendicular-line-in-point-slope-form": graphed(
    view(-6, 7, 2, -6, 7),
    [ln([0, 2], [5, 0]), ln([1, -3], [3, 2], "result"), pt([1, -3], "(1, −3)", "e", "result")],
    "The line 2x + 5y = 10, with slope −2/5, and the perpendicular line through (1, −3), with slope 5/2.",
    "直线 2x + 5y = 10，斜率 −2/5，以及过 (1, −3) 的垂线，斜率 5/2。",
  ),
  "finding-equations-of-perpendicular-lines#perpendicular-line-in-standard-form": graphed(
    view(-4, 8, 2, -4, 8),
    [ln([0, -1], [1, 3]), ln([2, 3], [6, 2], "result"), pt([2, 3], "(2, 3)", "ne", "result")],
    "The line y = 4x − 1 and the perpendicular line x + 4y = 14 through (2, 3), with slope −1/4.",
    "直线 y = 4x − 1 和过 (2, 3) 的垂线 x + 4y = 14，斜率 −1/4。",
  ),
  "calculating-perimeters-in-the-plane#the-perimeter-of-a-right-triangle": graphed(
    view(-1, 7, 1, -1, 6),
    [
      shape([
        [1, 1],
        [5, 1],
        [5, 4],
      ]),
      { kind: "label", at: [3, 1], text: "4", dir: "s" },
      { kind: "label", at: [5, 2.5], text: "3", dir: "e" },
      { kind: "label", at: [3, 2.5], text: "5", dir: "nw" },
    ],
    "A right triangle on a grid: its sides along the grid lines are 4 and 3 by subtracting coordinates, and the third is 5, so the perimeter is 12.",
    "网格上的直角三角形：沿网格线的两边相减坐标得 4 和 3，第三边为 5，所以周长为 12。",
  ),
  "area-of-isosceles-right-triangles#sides-from-the-area": rightTriangle(
    { legs: [8, 8], a: "8", b: "8", c: "8√2" },
    "An isosceles right triangle of area 32, with legs 8 and hypotenuse 8√2.",
    "面积为 32 的等腰直角三角形，直角边为 8，斜边为 8√2。",
  ),
  "proofs-involving-isosceles-triangles#proving-the-isosceles-triangle-theorem": drawing(
    [
      poly(isoA, isoB, isoC),
      seg(isoA, isoD, "action"),
      tick(isoA, isoB),
      tick(isoA, isoC),
      angle(isoA, isoB, isoD, "accent"),
      angle(isoA, isoC, isoD, "accent"),
      angle(isoB, isoC, isoA, "result"),
      angle(isoC, isoA, isoB, "result"),
      ...isoNames("D"),
    ],
    "Isosceles triangle ABC with AB = AC and the bisector AD of angle A; the two parts are congruent, so angle B equals angle C.",
    "等腰三角形 ABC，AB = AC，AD 平分 ∠A；两部分全等，所以 ∠B = ∠C。",
  ),
  "proofs-involving-isosceles-triangles#proving-the-converse": drawing(
    [
      poly(isoA, isoB, isoC),
      seg(isoA, isoD, "action"),
      angle(isoA, isoB, isoD, "accent"),
      angle(isoA, isoC, isoD, "accent"),
      angle(isoB, isoC, isoA, "result"),
      angle(isoC, isoA, isoB, "result"),
      ...isoNames("D"),
    ],
    "Triangle ABC with angle B equal to angle C and the bisector AD: the common side AD is not between the two marked angles of each part, so AAS applies.",
    "三角形 ABC，∠B = ∠C，AD 是角平分线：公共边 AD 不在每部分两个标记角之间，所以用 AAS。",
  ),
  "proofs-involving-isosceles-triangles#the-bisector-of-the-vertex-angle": drawing(
    [
      poly(isoA, isoB, isoC),
      seg(isoA, isoD, "action"),
      tick(isoA, isoB),
      tick(isoA, isoC),
      tick(isoB, isoD, 2),
      tick(isoD, isoC, 2),
      angle(isoA, isoB, isoD, "accent"),
      angle(isoA, isoC, isoD, "accent"),
      square(isoD, isoC, isoA),
      ...isoNames("D"),
    ],
    "The bisector AD of the vertex angle meets the base at its midpoint D at a right angle.",
    "顶角平分线 AD 与底边相交于中点 D，且互相垂直。",
  ),
  "proofs-involving-isosceles-triangles#using-the-isosceles-triangle-theorems": drawing(
    [
      poly(isoA, isoB, isoC),
      angle(isoB, isoC, isoA, "accent"),
      angle(isoC, isoA, isoB, "accent"),
      label(isoB, isoA, "3x + 2"),
      label(isoA, isoC, "5x − 8"),
      name(isoA, "A", "n"),
      name(isoB, "B", "sw"),
      name(isoC, "C", "se"),
    ],
    "Triangle ABC with equal angles at B and C, so the opposite sides AC = 5x − 8 and AB = 3x + 2 are equal.",
    "三角形 ABC 中 ∠B = ∠C，所以它们的对边 AC = 5x − 8 与 AB = 3x + 2 相等。",
  ),
  "proofs-involving-medians-and-centroids#the-median-of-an-isosceles-triangle": drawing(
    [
      poly(isoA, isoB, isoC),
      seg(isoA, isoD, "action"),
      tick(isoA, isoB),
      tick(isoA, isoC),
      tick(isoB, isoD, 2),
      tick(isoD, isoC, 2),
      square(isoD, isoC, isoA),
      ...isoNames("M"),
    ],
    "Isosceles triangle ABC with midpoint M of the base: the median AM makes two congruent triangles and is perpendicular to the base.",
    "等腰三角形 ABC，M 是底边中点：中线 AM 分出两个全等三角形，并且垂直于底边。",
  ),
  "proofs-involving-medians-and-centroids#medians-and-area": drawing(
    (() => {
      const A: Point = [1.5, 5];
      const B: Point = [-3, 0];
      const C: Point = [6, 0];
      const M: Point = [1.5, 0];
      const G: Point = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
      const toSide = (p: Point, q: Point, r: Point): Mark => seg(p, [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2], "action");
      return [
        { kind: "shade" as const, points: [G, B, M], tone: "result" as const },
        poly(A, B, C),
        toSide(A, B, C),
        toSide(B, A, C),
        toSide(C, A, B),
        tick(B, M),
        tick(M, C),
        name(A, "A", "n"),
        name(B, "B", "sw"),
        name(C, "C", "se"),
        name(M, "M", "s"),
        name(G, "G", "ne"),
      ];
    })(),
    "Triangle ABC split by its three medians into six small triangles of equal area, with triangle GBM shaded: one sixth of the area, or 10 of 60.",
    "三角形 ABC 被三条中线分成六个面积相等的小三角形，阴影是 △GBM：占六分之一，即 60 中的 10。",
  ),
  "proving-properties-of-parallelograms#proving-opposite-sides-and-angles": drawing(
    [
      ...pgFrame,
      seg(pgA, pgC, "action"),
      arrows(pgA, pgB),
      arrows(pgD, pgC),
      arrows(pgB, pgC, 2),
      arrows(pgA, pgD, 2),
      angle(pgA, pgB, pgC, "accent"),
      angle(pgC, pgD, pgA, "accent"),
      angle(pgA, pgC, pgD, "result"),
      angle(pgC, pgA, pgB, "result"),
    ],
    "Parallelogram ABCD with diagonal AC: alternate interior angles are equal, so the two triangles are congruent.",
    "平行四边形 ABCD 和对角线 AC：内错角相等，所以两个三角形全等。",
  ),
  "proving-properties-of-parallelograms#proving-the-diagonals-bisect-each-other": drawing(
    [
      ...pgFrame,
      seg(pgA, pgC, "action"),
      seg(pgB, pgD, "action"),
      tick(pgA, pgE),
      tick(pgE, pgC),
      tick(pgB, pgE, 2),
      tick(pgE, pgD, 2),
      name(pgE, "E", "s"),
    ],
    "The diagonals of parallelogram ABCD meet at E, with AE = CE and BE = DE.",
    "平行四边形 ABCD 的对角线相交于 E，AE = CE，BE = DE。",
  ),
  "proving-properties-of-parallelograms#proving-with-consecutive-angles": drawing(
    [
      ...pgFrame,
      arrows(pgA, pgB),
      arrows(pgD, pgC),
      arrows(pgA, pgD, 2),
      arrows(pgB, pgC, 2),
      angle(pgA, pgB, pgD, "accent"),
      angle(pgC, pgD, pgB, "accent"),
      angle(pgD, pgA, pgC, "action"),
    ],
    "In parallelogram ABCD, angle D is supplementary to both angle A and angle C, so angles A and C are equal.",
    "平行四边形 ABCD 中，∠D 与 ∠A、∠C 都互补，所以 ∠A = ∠C。",
  ),
  "proving-criteria-for-parallelograms-and-rectangles#proving-the-side-criteria": drawing(
    [...pgFrame, seg(pgA, pgC, "action"), tick(pgA, pgB), tick(pgD, pgC), tick(pgB, pgC, 2), tick(pgA, pgD, 2)],
    "Quadrilateral ABCD with AB = CD and BC = DA and the diagonal AC, which makes two congruent triangles.",
    "四边形 ABCD 中 AB = CD，BC = DA，对角线 AC 分出两个全等三角形。",
  ),
  "proving-criteria-for-parallelograms-and-rectangles#proving-the-diagonal-criterion": drawing(
    [
      ...pgFrame,
      seg(pgA, pgC, "action"),
      seg(pgB, pgD, "action"),
      tick(pgA, pgE),
      tick(pgE, pgC),
      tick(pgB, pgE, 2),
      tick(pgE, pgD, 2),
      angle(pgE, pgA, pgB, "accent"),
      angle(pgE, pgC, pgD, "accent"),
      name(pgE, "E", "s"),
    ],
    "Quadrilateral ABCD whose diagonals bisect each other at E, with the vertical angles AEB and CED marked.",
    "四边形 ABCD 的对角线在 E 互相平分，标出对顶角 ∠AEB 和 ∠CED。",
  ),
  "proving-criteria-for-parallelograms-and-rectangles#proving-the-rectangle-criterion": drawing(
    (() => {
      const A: Point = [0, 0];
      const B: Point = [6, 0];
      const C: Point = [6, 3.5];
      const D: Point = [0, 3.5];
      return [
        poly(A, B, C, D),
        seg(A, C, "action"),
        seg(D, B, "result"),
        square(A, B, D),
        square(B, C, A),
        name(A, "A", "sw"),
        name(B, "B", "se"),
        name(C, "C", "ne"),
        name(D, "D", "nw"),
      ];
    })(),
    "A parallelogram ABCD with equal diagonals AC and DB is a rectangle: its angles are right.",
    "对角线 AC 与 DB 相等的平行四边形 ABCD 是长方形：它的角都是直角。",
  ),
  "proving-criteria-for-parallelograms-and-rectangles#values-that-make-a-parallelogram": drawing(
    [
      ...pgFrame,
      seg(pgA, pgC, "action"),
      seg(pgB, pgD, undefined),
      name(pgE, "E", "s"),
      note([1.6, 0.75], "5x − 3", "nw"),
      note([4.9, 2.25], "2x + 9", "se"),
    ],
    "Quadrilateral ABCD with diagonals meeting at E, AE = 5x − 3 and CE = 2x + 9.",
    "四边形 ABCD 的对角线相交于 E，AE = 5x − 3，CE = 2x + 9。",
  ),
  "the-trigonometric-ratios#naming-the-ratio": rightTriangle(
    { legs: [6, 4], names: ["A", "C", "B"], at: "A", top: "B" },
    "Right triangle ABC with its right angle at C: side BC is opposite angle A and adjacent to angle B.",
    "直角三角形 ABC，直角在 C：边 BC 是 ∠A 的对边，也是 ∠B 的邻边。",
  ),
  "the-reciprocal-trigonometric-ratios#reciprocal-ratios-from-sides": rightTriangle(
    { legs: [12, 5], a: "12", b: "5", c: "13", at: "θ" },
    "The 5-12-13 triangle with the angle θ opposite the side 5.",
    "5-12-13 直角三角形，θ 是边 5 的对角。",
  ),
  "trigonometric-ratios-in-similar-right-triangles#scaling-a-right-triangle": drawing(
    [...topRight(5, 12, "5", "12", "13", "A"), ...shift(topRight(15, 36, "15", "36", "39", "D"), 15)],
    "A right triangle with sides 5, 12, 13 at angle A and the tripled triangle with sides 15, 36, 39 at angle D: the cosine is 5/13 in both.",
    "∠A 所在的直角三角形边长为 5、12、13，放大三倍后 ∠D 所在的三角形边长为 15、36、39：两者余弦都是 5/13。",
  ),
  "trigonometric-functions-of-complementary-angles#equations-with-complementary-angles": rightTriangle(
    { legs: [Math.cos((44 * Math.PI) / 180) * 7, Math.sin((44 * Math.PI) / 180) * 7], at: "44°", top: "46°" },
    "A right triangle with acute angles 44° and 46°, the values of 2x + 10 and 3x − 5 at x = 17, which add up to 90°.",
    "锐角为 44° 和 46° 的直角三角形，即 x = 17 时 2x + 10 和 3x − 5 的值，两者之和为 90°。",
  ),
  "special-trigonometric-ratios#special-angles-from-exact-values": drawing(
    [...rightMarks(2 * Math.sqrt(3), 2, "√3", "1", "2", "60°"), ...shift(rightMarks(3, 3, "1", "1", "√2", "45°"), 4.6)],
    "Two special triangles: tangent is √3 at 60°, with sides 1, √3, 2, and cosine is √2/2 at 45°, with sides 1, 1, √2.",
    "两个特殊三角形：60° 的正切为 √3，边长为 1、√3、2；45° 的余弦为 √2/2，边长为 1、1、√2。",
  ),
  "trigonometric-ratios-with-radians#exact-ratios-of-radian-angles": drawing(
    [
      ...rightMarks(2, 2 * Math.sqrt(3), "1", "√3", "2", "π/6"),
      ...shift(rightMarks(3, 3, "1", "1", "√2", "π/4"), 5.2),
      ...shift(rightMarks(2 * Math.sqrt(3), 2, "√3", "1", "2", "π/3"), 10),
    ],
    "The special right triangles with their angles in radians: π/6 with sides 1, √3, 2; π/4 with sides 1, 1, √2; π/3 with sides 1, √3, 2.",
    "用弧度标角的特殊直角三角形：π/6，边长 1、√3、2；π/4，边长 1、1、√2；π/3，边长 1、√3、2。",
  ),
  "trigonometric-ratios-with-radians#special-angles-in-radians": drawing(
    rightMarks(Math.sqrt(3), 1, "√3", "1", "2", "π/3"),
    "A right triangle with hypotenuse 2 and the side √3 opposite the angle π/3, so its sine is √3/2.",
    "斜边为 2、π/3 的对边为 √3 的直角三角形，所以其正弦是 √3/2。",
  ),
  "trigonometric-ratios-with-radians#exact-sides-with-radian-angles": rightTriangle(
    { legs: [5 * Math.sqrt(3), 5], b: "5", c: "10", names: ["A", "C", "B"], at: "π/6" },
    "Right triangle ABC with angle A equal to π/6 and hypotenuse AB = 10, so the opposite side BC is 5.",
    "直角三角形 ABC，∠A = π/6，斜边 AB = 10，所以对边 BC = 5。",
  ),
  "trigonometric-ratios-with-radians#sides-with-decimal-radian-angles": rightTriangle(
    { legs: [12 * Math.cos(0.9), 12 * Math.sin(0.9)], b: "≈ 9.4", c: "12", names: ["A", "C", "B"], at: "0.9" },
    "Right triangle ABC with angle A equal to 0.9 radians and hypotenuse 12, so the opposite side BC is about 9.4.",
    "直角三角形 ABC，∠A = 0.9 弧度，斜边为 12，所以对边 BC 约为 9.4。",
  ),
  "identifying-three-dimensional-shapes#prisms-and-pyramids": drawing(
    [
      ...prismMarks(3, 1.6, 3),
      ...shift(boxMarks(2.6, 1.8, 2.4).marks, 3),
      ...shift(pyramidMarks(2.4, 3), 8),
      ...shift(pyramidOn(3, 1.6, 3), 13.5),
    ],
    "Two prisms, one triangular and one rectangular, and two pyramids, one with a square base and one with a triangular base.",
    "两个棱柱（一个三棱柱、一个长方体）和两个棱锥（一个四棱锥、一个三棱锥）。",
  ),
  "identifying-three-dimensional-shapes#solids-with-curved-surfaces": drawing(
    [...cylinderMarks(1.3, 3), ...shift(coneMarks(1.3, 3), 4), ...shift(sphereMarks(1.5), 8), ...shift(hemisphereMarks(1.5), 12.2)],
    "A cylinder, a cone, a sphere and a hemisphere.",
    "圆柱、圆锥、球和半球。",
  ),
  "identifying-three-dimensional-shapes#polyhedra": drawing(
    [
      ...boxMarks(2, 2, 2).marks,
      ...shift(pyramidMarks(2.4, 3), 4.5),
      ...shift(cylinderMarks(1.2, 2.6), 10.5),
      ...shift(coneMarks(1.2, 2.6), 14),
    ],
    "On the left a cube and a pyramid, whose faces are all polygons; on the right a cylinder and a cone, which have curved surfaces and so are not polyhedra.",
    "左边的立方体和棱锥，所有面都是多边形；右边的圆柱和圆锥有曲面，所以不是多面体。",
  ),
  "faces-vertices-and-edges-of-polyhedrons#counting-for-prisms": drawing(
    prismMarks(5, 2, 3.2),
    "A pentagonal prism: 7 faces, 10 vertices and 15 edges.",
    "五棱柱：7 个面，10 个顶点，15 条棱。",
  ),
  "faces-vertices-and-edges-of-polyhedrons#counting-for-pyramids": drawing(
    pyramidOn(6, 2, 3.4),
    "A hexagonal pyramid: 7 faces, 7 vertices and 12 edges.",
    "六棱锥：7 个面，7 个顶点，12 条棱。",
  ),
  "nets-of-polyhedrons#folding-a-net": drawing(
    [
      poly([0, 0], [2, 0], [1, -1.6]),
      rect(0, 0, 2, 3),
      poly([0, 3], [2, 3], [1, 4.6]),
      rect(2, 0, 2, 3),
      rect(-2, 0, 2, 3),
      ...shift(
        [
          rect(0, 0, 2.6, 2.6),
          poly([0, 0], [2.6, 0], [1.3, -2]),
          poly([2.6, 0], [2.6, 2.6], [4.6, 1.3]),
          poly([2.6, 2.6], [0, 2.6], [1.3, 4.6]),
          poly([0, 2.6], [0, 0], [-2, 1.3]),
        ],
        8,
      ),
    ],
    "The net of a triangular prism, two triangles and a strip of three rectangles, and the net of a square pyramid, a square with four triangles.",
    "三棱柱的展开图是两个三角形和三个长方形组成的带子，四棱锥的展开图是一个正方形和四个三角形。",
  ),
  "nets-of-polyhedrons#opposite-faces-of-a-cube": drawing(
    [
      rect(0, 0, 1, 1),
      rect(1, 0, 1, 1),
      rect(2, 0, 1, 1),
      rect(3, 0, 1, 1),
      rect(1, 1, 1, 1),
      rect(1, -1, 1, 1),
      {
        kind: "shade",
        points: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        tone: "action",
      },
      {
        kind: "shade",
        points: [
          [2, 0],
          [3, 0],
          [3, 1],
          [2, 1],
        ],
        tone: "action",
      },
      {
        kind: "shade",
        points: [
          [1, 0],
          [2, 0],
          [2, 1],
          [1, 1],
        ],
        tone: "result",
      },
      {
        kind: "shade",
        points: [
          [3, 0],
          [4, 0],
          [4, 1],
          [3, 1],
        ],
        tone: "result",
      },
    ],
    "A net of a cube with a row of four squares: the first and third squares are opposite faces, and so are the second and fourth.",
    "立方体展开图中有一行四个正方形：第一个和第三个是相对的面，第二个和第四个也是。",
  ),
  "nets-of-polyhedrons#nets-of-a-cube": drawing(
    [
      rect(1, 2, 1, 1),
      rect(0, 1, 1, 1),
      rect(1, 1, 1, 1),
      rect(2, 1, 1, 1),
      rect(3, 1, 1, 1),
      rect(1, 0, 1, 1),
      note([2, 0], "✓", "s"),
      ...shift(
        [
          rect(0, 1, 1, 1),
          rect(1, 1, 1, 1),
          rect(2, 1, 1, 1),
          rect(3, 1, 1, 1),
          rect(4, 1, 1, 1),
          rect(2, 2, 1, 1),
          note([2.5, 1], "✗", "s"),
        ],
        6,
      ),
    ],
    "A pattern of six squares that folds into a cube, and a pattern with a row of five squares, which overlaps itself and is not a net.",
    "能折成立方体的六个正方形，以及有一行五个正方形的图形：它会重叠，不是展开图。",
  ),
  "finding-surface-areas-using-nets#nets-of-boxes": drawing(
    [
      rect(2, 0, 5, 3),
      rect(2, 3, 5, 2),
      rect(2, 5, 5, 3),
      rect(2, -2, 5, 2),
      rect(0, 0, 2, 3),
      rect(7, 0, 2, 3),
      note([4.5, 1.1], "5 × 3", "n"),
      note([4.5, 3.6], "5 × 2", "n"),
      note([4.5, 6.1], "5 × 3", "n"),
      note([4.5, -1.4], "5 × 2", "n"),
      note([1, 1.1], "2 × 3", "n"),
      note([8, 1.1], "2 × 3", "n"),
    ],
    "The net of a box 5 by 3 by 2: two faces of each size, with total area 62 square centimeters.",
    "5 × 3 × 2 长方体的展开图：每种大小的面各两个，总面积为 62 平方厘米。",
  ),
  "finding-surface-areas-using-nets#nets-of-triangular-prisms": drawing(
    [
      rect(0, 0, 3, 10),
      rect(3, 0, 4, 10),
      rect(7, 0, 5, 10),
      poly([3, 10], [7, 10], [3, 13]),
      poly([3, 0], [7, 0], [3, -3]),
      note([1.5, 0], "3", "s"),
      note([5, 5], "4 × 10", "n"),
      note([9.5, 0], "5", "s"),
      label([12, 0], [12, 10], "10"),
    ],
    "The net of a triangular prism of length 10: two right triangles with legs 3 and 4 and three rectangles, one for each side 3, 4 and 5.",
    "长为 10 的三棱柱展开图：两个直角边为 3 和 4 的直角三角形，以及对应边长 3、4、5 的三个长方形。",
  ),
  "finding-surface-areas-using-nets#nets-of-square-pyramids": drawing(
    [
      rect(0, 0, 6, 6),
      poly([0, 0], [6, 0], [3, -5]),
      poly([6, 0], [6, 6], [11, 3]),
      poly([6, 6], [0, 6], [3, 11]),
      poly([0, 6], [0, 0], [-5, 3]),
      note([3, 2.6], "6", "n"),
      seg([3, 6], [3, 11], "action", true),
      note([3, 8.5], "5", "e"),
    ],
    "The net of a square pyramid with base side 6 and triangles of height 5: a square and four triangles.",
    "底边为 6、三角形高为 5 的四棱锥展开图：一个正方形和四个三角形。",
  ),
  "the-five-platonic-solids#naming-platonic-solids": drawing(
    [
      ...wireframe("tetrahedron", 1.6),
      ...shift(wireframe("cube", 1.6), 4),
      ...shift(wireframe("octahedron", 1.6), 8),
      ...shift(wireframe("dodecahedron", 1.6), 12),
      ...shift(wireframe("icosahedron", 1.6), 16),
    ],
    "The five Platonic solids: tetrahedron, cube, octahedron, dodecahedron and icosahedron.",
    "五种柏拉图立体：正四面体、立方体、正八面体、正十二面体和正二十面体。",
  ),
  "the-five-platonic-solids#counting-platonic-solids": drawing(
    wireframe("icosahedron", 3),
    "An icosahedron: 20 triangular faces, 30 edges and 12 vertices.",
    "正二十面体：20 个三角形面，30 条棱，12 个顶点。",
  ),
  "the-five-platonic-solids#why-only-five": drawing(
    [
      ...flatFan(3),
      note([0, -0.6], "180°", "s"),
      ...shift(flatFan(5), 4),
      note([4, -1.6], "300°", "s"),
      ...shift(flatFan(6), 8),
      note([8, -1.6], "360°", "s"),
    ],
    "Equilateral triangles around a vertex: 3 make 180°, 5 make 300° and can still fold up, and 6 make 360° and lie flat.",
    "顶点周围的等边三角形：3 个合计 180°，5 个合计 300°，仍能折起；6 个合计 360°，只能铺平。",
  ),
  "the-distance-formula-in-three-dimensions#distance-from-the-origin": drawing(
    (() => {
      const b = boxMarks(3, 2, 6);
      return [
        ...b.marks,
        seg(b.corners.A!, b.corners.G!, "result"),
        name(b.corners.A!, "O", "sw"),
        note([1.5, 0], "3", "s"),
        note([3, 3], "6", "e"),
        note(b.corners.C!, "2", "se"),
        note([2.1, 3.4], "7", "nw"),
      ];
    })(),
    "A box with edges 2, 3 and 6: its diagonal from the origin to the point (2, −3, 6) has length 7.",
    "棱长为 2、3、6 的长方体：从原点到点 (2, −3, 6) 的对角线长为 7。",
  ),
  "volumes-of-pyramids#pyramids-on-rectangles": drawing(
    (() => {
      const dx = 2.25;
      const dy = 1.75;
      const A: Point = [0, 0];
      const B: Point = [6, 0];
      const C: Point = [6 + dx, dy];
      const D: Point = [dx, dy];
      const O: Point = [3 + dx / 2, dy / 2];
      const T: Point = [O[0], O[1] + 8];
      return [
        seg(A, B),
        seg(B, C),
        seg(A, D, undefined, true),
        seg(D, C, undefined, true),
        seg(T, A),
        seg(T, B),
        seg(T, C),
        seg(T, D, undefined, true),
        seg(O, T, "action", true),
        note([3, 0], "6", "s"),
        note([7.2, 0.9], "5", "se"),
        note([O[0], O[1] + 4], "8", "e"),
      ];
    })(),
    "A pyramid on a 6 by 5 rectangle with height 8.",
    "底面为 6 × 5 长方形、高为 8 的棱锥。",
  ),
  "volumes-of-pyramids#pyramids-on-triangles": drawing(
    (() => {
      const A: Point = [0, 0];
      const B: Point = [6, 0];
      const C: Point = [3.5, 2.4];
      const F: Point = [3.5, 0];
      const O: Point = [3.1, 0.8];
      const T: Point = [3.1, 9];
      return [
        seg(A, B),
        seg(A, C, undefined, true),
        seg(B, C, undefined, true),
        seg(T, A),
        seg(T, B),
        seg(T, C, undefined, true),
        seg(C, F, "accent", true),
        seg(O, T, "action", true),
        note([1.5, 0], "6", "s"),
        note([3.5, 1.2], "4", "e"),
        note([3.1, 5], "9", "e"),
      ];
    })(),
    "A pyramid on a triangle with base 6 and height 4; the pyramid's own height is 9.",
    "底面三角形的底为 6、高为 4 的棱锥；棱锥本身的高为 9。",
  ),
  "surface-areas-of-pyramids#lateral-area-of-regular-pyramids": drawing(
    (() => {
      const c = ringOf(6, 4);
      const M: Point = [(c[0]![0] + c[1]![0]) / 2, (c[0]![1] + c[1]![1]) / 2];
      return [...pyramidOn(6, 4, 8.4), seg(M, [0, 8.4], "result"), note(M, "4", "s"), note([(M[0] + 0) / 2, (M[1] + 8.4) / 2], "9", "e")];
    })(),
    "A regular hexagonal pyramid with base edge 4 and slant height 9, marked on one of its six triangles.",
    "底边为 4、斜高为 9 的正六棱锥，标在六个三角形之一上。",
  ),
  "volumes-of-cylinders#approximating-with-pi": drawing(
    cylinderMarks(2, 10, "2 m", "10 m"),
    "A cylinder with radius 2 meters and height 10 meters.",
    "半径为 2 米、高为 10 米的圆柱。",
  ),
  "surface-areas-of-cylinders#open-cylinders-and-missing-heights": drawing(
    cylinderMarks(2, 8, "2 cm", "h = 8"),
    "A cylinder with radius 2 centimeters and surface area 40π square centimeters, whose height comes out as 8.",
    "半径为 2 厘米、表面积为 40π 平方厘米的圆柱，算出的高为 8。",
  ),
  "volumes-of-right-cones#cones-and-cylinders": drawing(
    [...cylinderMarks(2, 4), note([0, -1], "60π", "s"), ...shift([...coneMarks(2, 4), note([0, -1], "20π", "s")], 6)],
    "A cylinder holding 60π and a cone with the same base and height, holding 20π.",
    "容积为 60π 的圆柱，以及同底同高、容积为 20π 的圆锥。",
  ),
  "slant-heights-of-right-cones#radius-from-slant-height": drawing(
    coneMarks(5, 12, "5", "12", "13"),
    "A cone with diameter 10, so radius 5, height 12 and slant height 13.",
    "直径为 10（半径为 5）、高为 12、斜高为 13 的圆锥。",
  ),
  "surface-areas-of-right-cones#total-surface-area-of-a-cone": drawing(
    coneMarks(3, 4, "3 cm", undefined, "5 cm"),
    "A cone with radius 3 centimeters and slant height 5 centimeters.",
    "半径为 3 厘米、斜高为 5 厘米的圆锥。",
  ),
  "volumes-of-spheres#volume-of-a-hemisphere": drawing(
    hemisphereMarks(6, "6 cm"),
    "A hemisphere with radius 6 centimeters, half of a sphere.",
    "半径为 6 厘米的半球，是球的一半。",
  ),
  "surface-areas-of-spheres#surface-area-of-a-sphere": drawing(
    sphereMarks(5, "5 cm"),
    "A sphere with radius 5 centimeters and a great circle through its center.",
    "半径为 5 厘米的球和过球心的大圆。",
  ),
  "surface-areas-of-spheres#radius-from-the-surface-area": drawing(
    sphereMarks(7, "7 cm"),
    "A sphere with radius 7 centimeters, which has surface area 196π square centimeters.",
    "半径为 7 厘米的球，表面积为 196π 平方厘米。",
  ),
  "surface-areas-of-spheres#hemispheres-and-volume": drawing(
    hemisphereMarks(3, "3 cm"),
    "A solid hemisphere with radius 3 centimeters: a curved surface and a flat circular face.",
    "半径为 3 厘米的实心半球：一个曲面和一个圆形平面。",
  ),
  "conical-frustums#surface-area-of-a-frustum": drawing(
    frustumMarks(7, 4, 4, "R = 7", "r = 4", "l = 5"),
    "A frustum with radii 7 and 4 and slant height 5.",
    "半径为 7 和 4、斜高为 5 的圆台。",
  ),
  "volumes-of-revolution#solids-of-revolution": drawing(
    [
      rect(0, 0, 1.6, 3),
      seg([0, -0.6], [0, 3.6], "action", true),
      ...shift(cylinderMarks(1.6, 3), 4.5),
      ...shift([poly([0, 0], [1.6, 0], [0, 3]), seg([0, -0.6], [0, 3.6], "action", true)], 8.5),
      ...shift(coneMarks(1.6, 3), 12.5),
    ],
    "A rectangle rotated about one of its sides makes a cylinder, and a right triangle rotated about a leg makes a cone.",
    "长方形绕一边旋转得到圆柱，直角三角形绕一条直角边旋转得到圆锥。",
  ),
  "volumes-of-revolution#rotating-rectangles": graphed(
    view(-2, 7, 1, -3, 3),
    [
      shape([
        [0, 0],
        [5, 0],
        [5, 2],
        [0, 2],
      ]),
      shape(
        [
          [0, 0],
          [5, 0],
          [5, -2],
          [0, -2],
        ],
        "action",
      ),
      { kind: "label", at: [2.5, 2], text: "5", dir: "n" },
      { kind: "label", at: [5, 1], text: "2", dir: "e" },
    ],
    "The rectangle with vertices (0, 0), (5, 0), (5, 2) and (0, 2), with its mirror image below: rotated about the x-axis it sweeps a cylinder with height 5 and radius 2.",
    "顶点为 (0, 0)、(5, 0)、(5, 2)、(0, 2) 的长方形和它下方的镜像：绕 x 轴旋转扫出高为 5、半径为 2 的圆柱。",
  ),
  "volumes-of-revolution#rotating-right-triangles": graphed(
    view(-2, 8, 1, -4, 4),
    [
      shape([
        [0, 0],
        [6, 0],
        [0, 3],
      ]),
      shape(
        [
          [0, 0],
          [6, 0],
          [0, -3],
        ],
        "action",
      ),
    ],
    "The triangle with vertices (0, 0), (6, 0) and (0, 3), with its mirror image below: rotated about the x-axis it sweeps a cone with height 6 and radius 3.",
    "顶点为 (0, 0)、(6, 0)、(0, 3) 的三角形和它下方的镜像：绕 x 轴旋转扫出高为 6、半径为 3 的圆锥。",
  ),
  "geometric-probability#probability-on-a-segment": drawing(
    [
      seg([0, 0], [20, 0]),
      seg([6, 0], [11, 0], "result"),
      ...[0, 6, 11, 20].flatMap((v) => [seg([v, -0.3], [v, 0.3]), note([v, -0.3], String(v), "s")]),
      note([8.5, 0.2], "5", "n"),
    ],
    "A segment from 0 to 20 with the part from 6 to 11 marked: length 5 out of 20.",
    "从 0 到 20 的线段，标出从 6 到 11 的部分：长度为 20 中的 5。",
  ),
  "the-union-of-sets#listing-a-union": drawing(
    vennWith("1, 7", "3, 5", "4, 6"),
    "A Venn diagram of A = {1, 3, 5, 7} and B = {3, 4, 5, 6}: 3 and 5 are in both, so the union lists them once.",
    "A = {1, 3, 5, 7} 与 B = {3, 4, 5, 6} 的韦恩图：3 和 5 在两者中，所以并集只写一次。",
  ),
  "the-union-of-sets#counting-a-union-from-a-venn-diagram": drawing(
    vennWith("12", "5", "18", "7"),
    "A Venn diagram with 12 in A only, 5 in both, 18 in B only and 7 outside.",
    "韦恩图：仅在 A 中 12，同时在两者中 5，仅在 B 中 18，在外面 7。",
  ),
  "the-intersection-of-sets#listing-an-intersection": drawing(
    vennWith("1, 7", "3, 5", "4, 6"),
    "A Venn diagram of A = {1, 3, 5, 7} and B = {3, 4, 5, 6}: the overlap holds 3 and 5.",
    "A = {1, 3, 5, 7} 与 B = {3, 4, 5, 6} 的韦恩图：重叠部分是 3 和 5。",
  ),
  "venn-diagrams-in-probability#probabilities-from-a-venn-diagram": drawing(
    vennWith("12", "5", "18", "7"),
    "A Venn diagram of 42 members: 12 in A only, 5 in both, 18 in B only and 7 outside, so A has 17 and B has 23.",
    "42 个成员的韦恩图：仅在 A 中 12，同时在两者中 5，仅在 B 中 18，在外面 7，所以 A 有 17 个，B 有 23 个。",
  ),
  "computing-probabilities-for-compound-events-using-venn-diagrams#unions-from-a-venn-diagram": drawing(
    vennWith("12", "5", "18", "7"),
    "A Venn diagram with 12 in A only, 5 in both, 18 in B only and 7 outside: the union holds 35 of the 42.",
    "韦恩图：仅在 A 中 12，同时在两者中 5，仅在 B 中 18，在外面 7：并集有 42 中的 35。",
  ),
  "the-addition-law-of-probability#finding-the-union": drawing(
    vennWith("0.25", "0.15", "0.2"),
    "A Venn diagram with P(A) = 0.4, P(B) = 0.35 and overlap 0.15: the regions are 0.25, 0.15 and 0.2, which add up to 0.6.",
    "P(A) = 0.4、P(B) = 0.35、重叠部分为 0.15 的韦恩图：三个区域为 0.25、0.15、0.2，合计 0.6。",
  ),
  "mutually-exclusive-events#recognizing-mutually-exclusive-events": drawing(
    [
      rect(-5.6, -3.4, 11.2, 6.8),
      ring(2.3, [-2.6, 0]),
      ring(2.3, [2.6, 0]),
      note([-2.6, -0.45], "2, 4, 6, 8, 10", "n"),
      note([2.6, -0.45], "1", "n"),
    ],
    "Two circles with no overlap: the even cards {2, 4, 6, 8, 10} and the card less than 2, {1}.",
    "两个不重叠的圆：偶数卡片 {2, 4, 6, 8, 10} 和小于 2 的卡片 {1}。",
  ),
};

/** topRight draws a right triangle like rightMarks with the angle at the top of the upright leg labeled. */
function topRight(h: number, w: number, up: string, bottom: string, long: string, at: string): Mark[] {
  const a: Point = [0, 0];
  const b: Point = [w, 0];
  const c: Point = [w, h];
  return [poly(a, b, c), square(b, a, c), label(a, b, bottom), label(b, c, up), label(c, a, long), angle(c, a, b, "accent", at)];
}

/** rightMarks draws a right triangle with bottom leg w and upright leg h, its bottom left angle labeled. */
function rightMarks(h: number, w: number, up: string, bottom: string, long: string, at: string): Mark[] {
  const a: Point = [0, 0];
  const b: Point = [w, 0];
  const c: Point = [w, h];
  return [poly(a, b, c), square(b, a, c), label(a, b, bottom), label(b, c, up), label(c, a, long), angle(a, b, c, "accent", at)];
}
