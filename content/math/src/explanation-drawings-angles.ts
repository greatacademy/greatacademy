// Drawings in the explanations of Geometry's angle proofs and of its transformations.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";

import {
  allEight,
  angle,
  dotAt,
  drawing,
  fromAngles,
  graphed,
  name,
  note,
  on,
  seg,
  square,
  transversal,
} from "./explanation-drawings-kit.ts";
import { trail } from "./graph-figures.ts";
import { movedPoint, movedPolygon, viewAround } from "./motion-figures.ts";

/** rays draws rays from a point o to named points, with arcs. */
const rays = (o: Point, tips: readonly (readonly [Point, string])[], vertexName: string): Mark[] => [
  ...tips.flatMap(([p, n]) => [seg(o, p), name(p, n, "e")]),
  name(o, vertexName, "sw"),
];

const O: Point = [0, 0];
const A: Point = on(0, 4);
const B: Point = on(35, 4);
const C: Point = on(70, 4);

/** stage draws the path of a point through a sequence of transformations. */
const stage = (names: readonly string[], points: readonly Point[], en: string, zh: string): Figure =>
  graphed(viewAround([...points]), trail(names, points), en, zh);

/** angleDrawings are the explanation drawings of angle proofs. */
export const angleDrawings = {
  "angle-addition-postulate": drawing(
    [
      ...rays(
        O,
        [
          [A, "A"],
          [B, "B"],
          [C, "C"],
        ],
        "O",
      ),
      angle(O, A, B, "accent", "(2x + 5)°"),
      angle(O, B, C, "action", "(3x − 10)°"),
    ],
    "Rays from O through A, B and C. Point B lies inside angle AOC, which is split into angles of (2x + 5)° and (3x − 10)°, together 70°.",
    "从 O 出发过 A、B、C 的射线。点 B 在角 AOC 内部，把它分成 (2x + 5)° 和 (3x − 10)° 两个角，合起来是 70°。",
  ),
  "linear-pair-postulate": drawing(
    [
      seg([-4, 0], [4, 0]),
      seg(O, on(50, 3.6)),
      angle(O, on(50, 3), [-4, 0], "accent", "(4x + 10)°"),
      angle(O, [4, 0], on(50, 3), "action", "(2x − 10)°"),
    ],
    "A ray from a point of a line makes a linear pair: angles of (4x + 10)° and (2x − 10)°, which add up to 180°.",
    "从直线上一点出发的射线构成一对邻补角：(4x + 10)° 和 (2x − 10)°，它们的和是 180°。",
  ),
  "making-lines-parallel": transversal(
    {
      angles: [
        [1, "accent", "(3x + 15)°"],
        [5, "result", "(5x − 25)°"],
      ],
      marked: false,
    },
    "Lines ℓ and m cut by a transversal t, with corresponding angles of (3x + 15)° and (5x − 25)°.",
    "直线 ℓ 和 m 被截线 t 所截，一对同位角分别是 (3x + 15)° 和 (5x − 25)°。",
  ),
  "congruent-supplements-and-complements": drawing(
    [
      seg([-4, 0], [4, 0]),
      seg(on(55, 3.5), on(235, 3.5)),
      angle(O, on(55, 3), [-4, 0], undefined, "2"),
      angle(O, [-4, 0], on(235, 3), "accent", "3"),
      angle(O, [4, 0], on(55, 3), "accent", "1"),
    ],
    "Two crossing lines: angles 1 and 3 are both supplementary to angle 2, so they are congruent.",
    "两条相交直线：角 1 和角 3 都与角 2 互补，所以它们全等。",
  ),
  "theorems-about-parallel-lines": transversal(
    { angles: allEight({ 3: "accent", 6: "accent", 1: "action", 8: "action", 4: "result" }) },
    "Parallel lines ℓ and m cut by a transversal t, with angles numbered 1 to 8. Angles 3 and 6 are alternate interior, 1 and 8 alternate exterior; angle 4 is one of a consecutive interior pair with angle 6.",
    "平行线 ℓ 和 m 被截线 t 所截，角编号为 1 到 8。角 3 和角 6 是内错角，角 1 和角 8 是外错角，角 4 和角 6 是同旁内角。",
  ),
  "alternate-interior-reasons": transversal(
    { angles: allEight({ 3: "accent", 6: "accent", 7: "action" }) },
    "Parallel lines ℓ and m cut by t, angles numbered 1 to 8. Angle 3 corresponds to angle 7, and angle 7 is vertical to angle 6.",
    "平行线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 3 与角 7 是同位角，角 7 与角 6 是对顶角。",
  ),
  "alternate-interior-statements": transversal(
    { angles: allEight({ 4: "accent", 5: "accent", 8: "action" }) },
    "Parallel lines ℓ and m cut by t, angles numbered 1 to 8. Angle 4 corresponds to angle 8, and angle 8 is vertical to angle 5.",
    "平行线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 4 与角 8 是同位角，角 8 与角 5 是对顶角。",
  ),
  "alternate-exterior-proof": transversal(
    { angles: allEight({ 1: "accent", 8: "accent", 5: "action" }) },
    "Parallel lines ℓ and m cut by t, angles numbered 1 to 8. Angle 1 corresponds to angle 5, and angle 5 is vertical to angle 8.",
    "平行线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 1 与角 5 是同位角，角 5 与角 8 是对顶角。",
  ),
  "alternate-interior-converse-reasons": transversal(
    { angles: allEight({ 3: "accent", 6: "accent", 7: "action" }), marked: false },
    "Lines ℓ and m cut by t, angles numbered 1 to 8. Angle 6 is vertical to angle 7, and angle 7 corresponds to angle 3.",
    "直线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 6 与角 7 是对顶角，角 7 与角 3 是同位角。",
  ),
  "alternate-exterior-converse-proof": transversal(
    { angles: allEight({ 2: "accent", 7: "accent", 6: "action" }), marked: false },
    "Lines ℓ and m cut by t, angles numbered 1 to 8. Angle 7 is vertical to angle 6, and angle 6 corresponds to angle 2.",
    "直线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 7 与角 6 是对顶角，角 6 与角 2 是同位角。",
  ),
  "values-that-make-lines-parallel": transversal(
    {
      angles: [
        [1, "accent", "(4x − 12)°"],
        [8, "result", "(2x + 30)°"],
      ],
      marked: false,
    },
    "Lines ℓ and m cut by t, with alternate exterior angles of (4x − 12)° and (2x + 30)°.",
    "直线 ℓ 和 m 被 t 所截，一对外错角分别是 (4x − 12)° 和 (2x + 30)°。",
  ),
  "consecutive-interior-reasons": transversal(
    { angles: allEight({ 3: "accent", 5: "accent", 7: "action" }) },
    "Parallel lines ℓ and m cut by t, angles numbered 1 to 8. Angle 3 corresponds to angle 7, and angles 7 and 5 form a linear pair.",
    "平行线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 3 与角 7 是同位角，角 7 与角 5 是邻补角。",
  ),
  "consecutive-interior-statements": transversal(
    { angles: allEight({ 4: "accent", 6: "accent", 8: "action" }) },
    "Parallel lines ℓ and m cut by t, angles numbered 1 to 8. Angle 4 corresponds to angle 8, and angles 8 and 6 form a linear pair.",
    "平行线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 4 与角 8 是同位角，角 8 与角 6 是邻补角。",
  ),
  "using-consecutive-interior-angles": transversal(
    {
      angles: [
        [3, "accent", ""],
        [5, "result", ""],
      ],
      extra: [note([3.2, 2.45], "(3x + 20)°", "w"), note([1.2, 0.5], "(2x − 15)°", "w")],
    },
    "Parallel lines ℓ and m cut by t, with consecutive interior angles of (3x + 20)° and (2x − 15)°, which add up to 180°.",
    "平行线 ℓ 和 m 被 t 所截，一对同旁内角分别是 (3x + 20)° 和 (2x − 15)°，它们的和是 180°。",
  ),
  "consecutive-converse-reasons": transversal(
    { angles: allEight({ 3: "accent", 5: "accent", 7: "action" }), marked: false },
    "Lines ℓ and m cut by t, angles numbered 1 to 8. Angles 3 and 7 are both supplementary to angle 5.",
    "直线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 3 和角 7 都与角 5 互补。",
  ),
  "consecutive-converse-statements": transversal(
    { angles: allEight({ 4: "accent", 6: "accent", 8: "action" }), marked: false },
    "Lines ℓ and m cut by t, angles numbered 1 to 8. Angles 4 and 8 are both supplementary to angle 6.",
    "直线 ℓ 和 m 被 t 所截，角编号为 1 到 8。角 4 和角 8 都与角 6 互补。",
  ),
  "deciding-whether-lines-are-parallel": transversal(
    {
      angles: [
        [3, "accent", "118°"],
        [5, "action", "72°"],
      ],
      marked: false,
    },
    "Lines ℓ and m cut by t, with consecutive interior angles of 118° and 72°: their sum is 190°, so the lines are not parallel.",
    "直线 ℓ 和 m 被 t 所截，一对同旁内角是 118° 和 72°：和为 190°，所以两直线不平行。",
  ),
  "perpendicular-transversal-theorem": drawing(
    perpendicularMarks(["1", "5"]),
    "Parallel lines ℓ and m and a transversal t perpendicular to ℓ: corresponding angles 1 and 5 are both right angles.",
    "平行线 ℓ 和 m，截线 t 垂直于 ℓ：同位角 1 和 5 都是直角。",
  ),
  "lines-perpendicular-to-the-same-line": drawing(
    perpendicularMarks(["2", "6"], false),
    "Lines ℓ and m, both perpendicular to t: corresponding angles 2 and 6 are right angles, so the lines are parallel.",
    "直线 ℓ 和 m 都垂直于 t：同位角 2 和 6 都是直角，所以两直线平行。",
  ),
  "congruent-linear-pairs": drawing(
    [
      seg([-4, 0], [4, 0]),
      seg(O, [0, 3.5]),
      square(O, [3, 0], [0, 3]),
      square(O, [-3, 0], [0, 3]),
      note([4, 0], "ℓ", "e"),
      note([0, 3.5], "t", "n"),
      note([1, 1], "2", "e"),
      note([-1, 1], "1", "w"),
    ],
    "A line t meets a line ℓ, forming a linear pair of congruent angles 1 and 2, each of them 90°.",
    "直线 t 与直线 ℓ 相交，形成一对全等的邻补角 1 和 2，每个都是 90°。",
  ),
  "using-perpendicular-transversals": drawing(
    [...perpendicularMarks([], true), note([3.6, 0.7], "(4x − 10)°", "e")],
    "Parallel lines ℓ and m and a transversal t perpendicular to ℓ. An angle between t and m, marked (4x − 10)°, is a right angle too.",
    "平行线 ℓ 和 m，截线 t 垂直于 ℓ。t 与 m 之间标为 (4x − 10)° 的角也是直角。",
  ),
  "perpendicular-lines-form-four-right-angles": drawing(
    [
      seg([-4, 0], [4, 0]),
      seg([0, -3], [0, 3]),
      square(O, [3, 0], [0, 3]),
      square(O, [0, 3], [-3, 0]),
      square(O, [-3, 0], [0, -3]),
      square(O, [0, -3], [3, 0]),
      note([4, 0], "ℓ", "e"),
      note([0, 3], "t", "n"),
      note([-1, 1], "1", "nw"),
      note([1, 1], "2", "ne"),
    ],
    "Perpendicular lines ℓ and t form four right angles; angles 1 and 2 form a linear pair.",
    "互相垂直的直线 ℓ 和 t 形成四个直角；角 1 和角 2 是邻补角。",
  ),
  "perpendicular-sides-make-complementary-angles": drawing(
    complementaryMarks("accent", "action"),
    "Rays BA and BC are perpendicular, with ray BD between them: angles ABD and DBC together make the right angle.",
    "射线 BA 与 BC 垂直，射线 BD 在它们之间：角 ABD 与角 DBC 合起来是直角。",
  ),
  "complementary-adjacent-angles-make-perpendicular-sides": drawing(
    complementaryMarks("accent", "action", false),
    "Adjacent angles ABD and DBC are complementary, so together they make a right angle ABC.",
    "相邻的角 ABD 与 DBC 互余，所以合起来是直角 ABC。",
  ),
  "finding-angles-with-perpendicular-lines": drawing(
    complementaryMarks("accent", "action", true, "(2x + 5)°", "(3x − 15)°"),
    "Rays BA and BC are perpendicular, with ray BD between them, making angles of (2x + 5)° and (3x − 15)°, together 90°.",
    "射线 BA 与 BC 垂直，射线 BD 在它们之间，形成 (2x + 5)° 和 (3x − 15)° 两个角，合起来是 90°。",
  ),
  "sum-of-exterior-angles": drawing(
    exteriorMarks(),
    "A triangle with each side extended in turn, making exterior angles of 110°, 130° and 120°, which add up to 360°.",
    "把三角形的每条边依次延长，得到 110°、130° 和 120° 的外角，它们的和是 360°。",
  ),
  "exterior-angle-equations": drawing(
    remoteMarks("(x + 10)°", "2x°", "(4x − 15)°"),
    "Triangle ABC with AB extended to D. The exterior angle CBD, (4x − 15)°, equals the sum of the remote interior angles, (x + 10)° and 2x°.",
    "三角形 ABC，AB 延长到 D。外角 CBD 是 (4x − 15)°，等于不相邻的两个内角 (x + 10)° 和 2x° 之和。",
  ),
  "angles-from-exterior-angle-equations": drawing(
    remoteMarks("35°", "50°", "85°", "95°"),
    "Triangle ABC with AB extended to D. Angle A is 35°, angle C is 50°, the exterior angle CBD is 85° and the interior angle at B is 95°.",
    "三角形 ABC，AB 延长到 D。角 A 是 35°，角 C 是 50°，外角 CBD 是 85°，B 处的内角是 95°。",
  ),
} satisfies Record<string, Figure>;

/** perpendicularMarks draws parallel lines ℓ and m with a transversal perpendicular to them: odd angle numbers sit upper left of a crossing and even ones upper right, as in the numbering of the proofs. */
function perpendicularMarks(numbers: readonly string[], arrows = true): Mark[] {
  const side = (n: string | undefined) => (Number(n) % 2 === 1 ? -1 : 1);
  const d = side(numbers[0]);
  return [
    seg([0, 3], [6, 3]),
    seg([0, 0], [6, 0]),
    seg([3, -1.4], [3, 4.4]),
    square([3, 3], [3 + d, 3], [3, 4]),
    square([3, 0], [3 + d, 0], [3, 1]),
    note([6, 3], "ℓ", "e"),
    note([6, 0], "m", "e"),
    note([3, 4.4], "t", "n"),
    ...(arrows
      ? ([
          { kind: "arrows", a: [0.6, 3], b: [1.6, 3], count: 1 },
          { kind: "arrows", a: [0.6, 0], b: [1.6, 0], count: 1 },
        ] satisfies Mark[])
      : []),
    ...(numbers[0] ? [note([3 + 0.8 * d, 3.6], numbers[0], d > 0 ? "e" : "w")] : []),
    ...(numbers[1] ? [note([3 + 0.8 * d, 0.6], numbers[1], d > 0 ? "e" : "w")] : []),
  ];
}

/** complementaryMarks draws a right angle ABC split by ray BD. */
function complementaryMarks(first: "accent", second: "action", right = true, labelA?: string, labelB?: string): Mark[] {
  const [a, c, d]: Point[] = [[0, 4], [4, 0], on(50, 4)];
  const b: Point = [0, 0];
  return [
    seg(b, a!, undefined),
    seg(b, c!, undefined),
    seg(b, d!, undefined),
    name(a!, "A", "n"),
    name(b, "B", "sw"),
    name(c!, "C", "e"),
    name(d!, "D", "ne"),
    angle(b, a!, d!, first, labelA),
    angle(b, d!, c!, second, labelB),
    ...(right ? [square(b, c!, a!)] : []),
  ];
}

/** exteriorMarks draws a triangle with interior angles of 70°, 50° and 60° and one exterior angle at each corner. */
function exteriorMarks(): Mark[] {
  const [a, b, c] = fromAngles(70, 50, 5);
  const beyond = (from: Point, to: Point): Point => [to[0] + (to[0] - from[0]) * 0.5, to[1] + (to[1] - from[1]) * 0.5];
  const [ab, bc, ca] = [beyond(a, b), beyond(b, c), beyond(c, a)];
  return [
    { kind: "polygon", points: [a, b, c] },
    seg(b, ab),
    seg(c, bc),
    seg(a, ca),
    angle(b, ab, c, "accent", "130°"),
    angle(c, bc, a, "action", "120°"),
    angle(a, ca, b, "result", "110°"),
  ];
}

/** remoteMarks draws triangle ABC with AB extended to D and the labels of an exterior angle and its remote interior angles. */
function remoteMarks(atA: string, atC: string, exterior: string, atB?: string): Mark[] {
  const [a, b, c] = fromAngles(35, 95, 4);
  const d: Point = [7, 0];
  return [
    { kind: "polygon", points: [a, b, c] },
    seg(b, d),
    name(a, "A", "sw"),
    name(b, "B", "s"),
    name(c, "C", "n"),
    name(d, "D", "e"),
    angle(a, b, c, "accent", atA),
    angle(c, a, b, "accent", atC),
    angle(b, d, c, "result", exterior),
    ...(atB ? [angle(b, c, a, undefined, atB)] : []),
  ];
}

/** motionDrawings are the explanation drawings of transformations. */
export const motionDrawings = {
  "translating-a-point": movedPoint("P", [2, -1], [-2, 2], { kind: "slide" }),
  "translation-rules": movedPoint("B", [1, -3], [-3, -1], { kind: "slide" }),
  "finding-a-translation": movedPoint("P", [3, -2], [-1, 4], { kind: "slide" }),
  "finding-the-preimage": movedPoint("P", [-2, 7], [1, 2], { kind: "slide" }),
  "quarter-turns": movedPoint("P", [4, 1], [-1, 4], { kind: "turn", degrees: 90 }),
  "half-and-three-quarter-turns": movedPoint("P", [-3, 5], [3, -5], { kind: "turn", degrees: 180 }),
  "identifying-a-rotation": movedPoint("P", [2, 5], [-5, 2], { kind: "turn", degrees: 90 }),
  "rotating-about-another-center": movedPoint("P", [5, 3], [0, 4], { kind: "turn", degrees: 90, center: [2, 1], centerName: "C" }),
  "composing-rotations": movedPoint("P", [2, -3], [-3, -2], { kind: "turn", degrees: 270 }),
  "inverting-a-rotation": movedPoint("P", [-1, -4], [4, -1], { kind: "turn", degrees: 90 }, "f(P)"),
  "reflecting-across-the-axes": movedPoint("P", [3, -4], [-3, -4], { kind: "flip", a: [0, 0], b: [0, 1] }),
  "reflecting-across-diagonal-lines": movedPoint("P", [5, -2], [-2, 5], { kind: "flip", a: [0, 0], b: [1, 1] }),
  "reflecting-across-horizontal-and-vertical-lines": movedPoint("P", [5, 1], [-1, 1], { kind: "flip", a: [2, 0], b: [2, 1] }),
  "identifying-the-line-of-reflection": movedPoint("P", [4, -1], [1, -4], { kind: "flip", a: [0, 0], b: [1, -1] }),
  "reflecting-across-shifted-diagonals": movedPoint("P", [5, 1], [-1, 7], { kind: "flip", a: [0, 2], b: [1, 3] }),
  "finding-the-line-of-reflection": movedPoint("P", [1, 1], [5, 3], { kind: "flip", a: [3, 2], b: [4, 0] }),
  "reflecting-across-any-line": movedPoint("P", [-4, 2], [4, -2], { kind: "flip", a: [0, 0], b: [1, 2] }),
  "dilating-about-the-origin": movedPoint("P", [4, -6], [6, -9], { kind: "scale" }),
  "dilating-a-figure": movedPoint("B", [-4, 6], [-2, 3], { kind: "scale" }),
  "scale-factors-from-coordinates": movedPoint("P", [6, -4], [9, -6], { kind: "scale" }),
  "dilating-about-another-center": movedPoint("P", [7, 1], [5, 0], { kind: "scale", center: [3, -1], centerName: "C" }),
  "horizontal-and-vertical-stretches": movedPoint("P", [3, -4], [3, -10], { kind: "slide" }),
  "points-paired-by-a-line-of-symmetry": movedPoint("P", [5, -2], [1, -2], { kind: "flip", a: [3, 0], b: [3, 1] }),
  "rotational-symmetry-in-the-coordinate-plane": movedPoint("P", [4, 7], [-2, -3], {
    kind: "turn",
    degrees: 180,
    center: [1, 2],
    centerName: "C",
  }),
  "applying-two-transformations": stage(
    ["P", "", "P′"],
    [
      [2, 5],
      [2, -5],
      [-1, -4],
    ],
    "P (2, 5) is reflected across the x-axis to (2, −5), then translated to P′ (−1, −4).",
    "P (2, 5) 先关于 x 轴反射到 (2, −5)，再平移到 P′ (−1, −4)。",
  ),
  "sequences-with-dilations": stage(
    ["P", "P₁", "P₂", "P′"],
    [
      [1, -2],
      [3, -6],
      [6, 3],
      [8, -1],
    ],
    "P (1, −2) is dilated to (3, −6), rotated to (6, 3), then translated to (8, −1).",
    "P (1, −2) 先位似到 (3, −6)，再旋转到 (6, 3)，最后平移到 (8, −1)。",
  ),
  "undoing-a-sequence": stage(
    ["P", "", "P′"],
    [
      [5, -3],
      [3, 5],
      [4, 3],
    ],
    "P (5, −3) is rotated 90° counterclockwise to (3, 5), then translated to P′ (4, 3). Undoing goes back along the same steps.",
    "P (5, −3) 逆时针旋转 90° 到 (3, 5)，再平移到 P′ (4, 3)。还原时沿相同的步骤倒退。",
  ),
  "dilations-centered-at-the-origin": movedPoint("P", [6, -4], [3, -2], { kind: "scale" }),
  "dilations-followed-by-rigid-motions": stage(
    ["P", "", "P′"],
    [
      [2, -3],
      [4, -6],
      [-1, -5],
    ],
    "The point (2, −3) is dilated by 2 about the origin to (4, −6), then translated to (−1, −5).",
    "点 (2, −3) 以原点为中心放大 2 倍到 (4, −6)，再平移到 (−1, −5)。",
  ),
  "describing-a-similarity-transformation": movedPolygon(
    ["A", "B"],
    [
      [1, 2],
      [3, 2],
    ],
    [
      [5, 3],
      [9, 3],
    ],
    { kind: "slide" },
  ),
  "identifying-the-motion": movedPolygon(
    ["A", "B"],
    [
      [2, 5],
      [4, 1],
    ],
    [
      [-5, 2],
      [-1, 4],
    ],
    { kind: "turn", degrees: 90 },
  ),
  "image-lengths": drawing(
    imageMarks(),
    "A dilation with center C and scale factor 3/4 carries segment AB of length 12 to segment A′B′ of length 9.",
    "以 C 为中心、比例 3/4 的位似把长为 12 的线段 AB 变成长为 9 的线段 A′B′。",
  ),
  "enlargements-and-reductions": drawing(
    enlargementMarks(),
    "A triangle with its image under a dilation with scale factor 7/5, larger, and with scale factor 0.8, smaller, from the same center.",
    "一个三角形，以及同一中心下比例 7/5 的像（更大）和比例 0.8 的像（更小）。",
  ),
  "distances-from-the-center": drawing(
    [
      seg([0, 0], [10, 0]),
      ...dotAt([0, 0], "C", "s"),
      ...dotAt([4, 0], "A", "s"),
      ...dotAt([10, 0], "A′", "s", "result"),
      note([2, 0], "4", "n"),
      note([7, 0], "6", "n"),
      seg([0, 1.2], [10, 1.2], "result"),
      note([5, 1.2], "10", "n"),
    ],
    "On a ray from C: CA is 4 and A′ lies 6 units beyond A, so CA′ is 10.",
    "在从 C 出发的射线上：CA 是 4，A′ 在 A 之外 6 个单位，所以 CA′ 是 10。",
  ),
  "areas-of-stretched-figures": drawing(
    stretchedMarks(),
    "A 4 by 3 rectangle, of area 12, stretched vertically by a factor of 2 into a 4 by 6 rectangle, of area 24.",
    "4 × 3 的长方形（面积 12）竖直拉伸 2 倍，变成 4 × 6 的长方形（面积 24）。",
  ),
  "lines-of-symmetry-of-polygons": drawing(
    symmetryMarks(),
    "A square with 4 lines of symmetry, a rectangle with 2, an isosceles triangle with 1, and a parallelogram with none.",
    "正方形有 4 条对称轴，长方形有 2 条，等腰三角形有 1 条，平行四边形没有。",
  ),
  "order-of-rotational-symmetry": drawing(
    orderMarks(),
    "A regular pentagon, which has order 5, and a parallelogram, which has order 2: a half turn about its center maps it onto itself.",
    "正五边形的阶是 5；平行四边形的阶是 2：绕中心转半圈与自身重合。",
  ),
  "angles-of-rotational-symmetry": drawing(
    pentagonMarks(),
    "A regular pentagon with spokes from its center to its vertices: each angle between spokes is 72°.",
    "正五边形，从中心到各顶点连线：相邻连线之间的角都是 72°。",
  ),
} satisfies Record<string, Figure>;

/** imageMarks draws a segment and its image under a dilation with scale factor 3/4. */
function imageMarks(): Mark[] {
  const c: Point = [0, 2];
  const a: Point = [10, 0];
  const b: Point = [10, 12];
  const scaled = (p: Point): Point => [c[0] + 0.75 * (p[0] - c[0]), c[1] + 0.75 * (p[1] - c[1])];
  const [a2, b2] = [scaled(a), scaled(b)];
  return [
    seg(c, a, undefined, true),
    seg(c, b, undefined, true),
    seg(a, b, "accent"),
    seg(a2, b2, "result"),
    ...dotAt(c, "C", "w"),
    name(a, "A", "e"),
    name(b, "B", "e"),
    name(a2, "A′", "s"),
    name(b2, "B′", "n"),
    note([10, 6], "12", "e"),
    note([a2[0], (a2[1] + b2[1]) / 2], "9", "w"),
  ];
}

/** enlargementMarks draws a triangle with an enlargement and a reduction from one center. */
function enlargementMarks(): Mark[] {
  const c: Point = [0, 0];
  const tri: readonly Point[] = [
    [5, 0.6],
    [7, 1.6],
    [5.4, 3],
  ];
  const scaled = (k: number) => tri.map((p): Point => [p[0] * k, p[1] * k]);
  return [
    ...dotAt(c, "C", "sw"),
    ...tri.map((p) => seg(c, [p[0] * 1.4, p[1] * 1.4], undefined, true)),
    { kind: "polygon", points: tri, accent: true },
    { kind: "polygon", points: scaled(1.4), tone: "result" },
    { kind: "polygon", points: scaled(0.8), tone: "action" },
    note([7 * 1.4, 1.6 * 1.4], "k = 7/5", "e"),
    note([5 * 0.8, 0.6 * 0.8], "k = 0.8", "s"),
  ];
}

/** stretchedMarks draws a rectangle before and after a vertical stretch. */
function stretchedMarks(): Mark[] {
  const rect = (x: number, w: number, h: number): Point[] => [
    [x, 0],
    [x + w, 0],
    [x + w, h],
    [x, h],
  ];
  return [
    { kind: "polygon", points: rect(0, 4, 3), accent: true },
    note([2, 0], "4", "s"),
    note([0, 1.5], "3", "w"),
    { kind: "polygon", points: rect(7, 4, 6), tone: "result" },
    note([9, 0], "4", "s"),
    note([7, 3], "6", "w"),
  ];
}

/** symmetryMarks draws four shapes with their lines of symmetry dashed. */
function symmetryMarks(): Mark[] {
  const dash = (a: Point, b: Point) => seg(a, b, "action", true);
  return [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [3, 0],
        [3, 3],
        [0, 3],
      ],
      accent: true,
    },
    dash([1.5, -0.4], [1.5, 3.4]),
    dash([-0.4, 1.5], [3.4, 1.5]),
    dash([-0.3, -0.3], [3.3, 3.3]),
    dash([-0.3, 3.3], [3.3, -0.3]),
    {
      kind: "polygon",
      points: [
        [5, 0],
        [9, 0],
        [9, 3],
        [5, 3],
      ],
      accent: true,
    },
    dash([7, -0.4], [7, 3.4]),
    dash([4.6, 1.5], [9.4, 1.5]),
    {
      kind: "polygon",
      points: [
        [11, 0],
        [14, 0],
        [12.5, 3],
      ],
      accent: true,
    },
    dash([12.5, -0.4], [12.5, 3.4]),
    {
      kind: "polygon",
      points: [
        [16, 0],
        [19, 0],
        [20, 3],
        [17, 3],
      ],
      accent: true,
    },
  ];
}

/** regular is the corners of a regular polygon. */
function regular(n: number, r: number, c: Point, start = 90): Point[] {
  return Array.from({ length: n }, (_, i) => on(start + (360 * i) / n, r, c));
}

/** orderMarks draws a regular pentagon and a parallelogram with their centers. */
function orderMarks(): Mark[] {
  const p: Point[] = [
    [4, -1.5],
    [8, -1.5],
    [9.5, 1.5],
    [5.5, 1.5],
  ];
  return [
    { kind: "polygon", points: regular(5, 2, [0, 0]), accent: true },
    ...dotAt([0, 0]),
    { kind: "polygon", points: p, accent: true },
    seg(p[0]!, p[2]!, "action", true),
    seg(p[1]!, p[3]!, "action", true),
    ...dotAt([6.75, 0]),
  ];
}

/** pentagonMarks draws a regular pentagon with spokes. */
function pentagonMarks(): Mark[] {
  const v = regular(5, 3, [0, 0]);
  return [
    { kind: "polygon", points: v, accent: true },
    ...v.map((p) => seg([0, 0], p, undefined, true)),
    angle([0, 0], v[0]!, v[1]!, "result", "72°"),
    ...dotAt([0, 0]),
  ];
}
