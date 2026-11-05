// Drawings in the explanations of Geometry's special triangles, trigonometry, solids, coordinates and geometric probability.

import type { Figure } from "@ga/content";
import type { Compass, Mark, PlaneMark, Point } from "@ga/subject-math";

import {
  angle,
  boxMarks,
  coneMarks,
  cylinderMarks,
  drawing,
  ellipse,
  graphed,
  name,
  note,
  on,
  pyramidMarks,
  ring,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

const s3 = Math.sqrt(3);
const rad = (d: number) => (d * Math.PI) / 180;

/** RightLabels say what a right triangle with its right angle at the bottom right shows. */
interface RightLabels {
  /** bottom, up and long label the bottom leg, the upright leg and the hypotenuse. */
  readonly bottom?: string;
  readonly up?: string;
  readonly long?: string;
  /** left and top label the acute angles at the left end and at the top. */
  readonly left?: string;
  readonly top?: string;
  /** names are the corners: left end, right angle, top. */
  readonly names?: readonly [string, string, string];
  /** hot colors the sides to look at. */
  readonly hot?: readonly ("bottom" | "up" | "long")[];
}

/** right draws a right triangle with legs w and h. */
function right(w: number, h: number, o: RightLabels): Mark[] {
  const [p, r, q]: [Point, Point, Point] = [
    [-w, 0],
    [0, 0],
    [0, h],
  ];
  const hot = o.hot ?? [];
  const tones = ["accent", "result"] as const;
  const toneOf = (k: "bottom" | "up" | "long") => (hot.includes(k) ? tones[hot.indexOf(k)] : undefined);
  return [
    { kind: "polygon", points: [p, r, q] },
    ...(toneOf("bottom") ? [seg(p, r, toneOf("bottom"))] : []),
    ...(toneOf("up") ? [seg(r, q, toneOf("up"))] : []),
    ...(toneOf("long") ? [seg(q, p, toneOf("long"))] : []),
    square(r, p, q),
    ...(o.bottom ? [{ kind: "side", a: p, b: r, text: o.bottom } satisfies Mark] : []),
    ...(o.up ? [{ kind: "side", a: r, b: q, text: o.up } satisfies Mark] : []),
    ...(o.long ? [{ kind: "side", a: q, b: p, text: o.long } satisfies Mark] : []),
    ...(o.left ? [angle(p, r, q, "action", o.left)] : []),
    ...(o.top ? [angle(q, p, r, "action", o.top)] : []),
    ...(o.names ? [name(p, o.names[0], "sw"), name(r, o.names[1], "se"), name(q, o.names[2], "n")] : []),
  ];
}

/** equilateral draws an equilateral triangle cut by its height, labeled. */
function equilateral(side: string, half: string, height: string): Mark[] {
  const [a, b, c]: [Point, Point, Point] = [
    [-2, 0],
    [2, 0],
    [0, 2 * s3],
  ];
  return [
    { kind: "polygon", points: [a, b, c] },
    seg(c, [0, 0], "accent"),
    square([0, 0], b, c),
    { kind: "side", a: b, b: c, text: side },
    note([-1, 0], half, "s"),
    note([0, s3], height, "w"),
    angle(a, b, c, "action", "60°"),
    angle(c, a, [0, 0], "result", "30°"),
  ];
}

/** parallelogram are the corners of a parallelogram ABCD. */
const para: readonly [Point, Point, Point, Point] = [
  [0, 0],
  [5, 0],
  [6.6, 2.8],
  [1.6, 2.8],
];

const paraNames: Mark[] = [name(para[0], "A", "sw"), name(para[1], "B", "se"), name(para[2], "C", "ne"), name(para[3], "D", "nw")];

const tick = (a: Point, b: Point, count: number): Mark => ({ kind: "ticks", a, b, count });

const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/** centroidMarks draws a triangle with its three medians meeting at G. */
function centroidMarks(): Mark[] {
  const [a, b, c]: [Point, Point, Point] = [
    [1.4, 4.2],
    [0, 0],
    [6, 0],
  ];
  const [m, n, l] = [mid(b, c), mid(c, a), mid(a, b)];
  const g: Point = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
  return [
    { kind: "polygon", points: [a, b, c] },
    seg(a, m, "accent"),
    seg(b, n),
    seg(c, l),
    { kind: "dot", at: g, tone: "result" },
    name(a, "A", "n"),
    name(b, "B", "sw"),
    name(c, "C", "se"),
    name(m, "M", "s"),
    name(g, "G", "e"),
    note(mid(a, g), "12", "e"),
    note(mid(g, m), "6", "e"),
    tick(b, m, 1),
    tick(m, c, 1),
  ];
}

/** specialDrawings are the explanation drawings of special triangles, medians, squares and parallelograms. */
export const specialDrawings = {
  "hypotenuse-from-a-leg": drawing(
    right(7, 7, { bottom: "7", up: "7", long: "7√2", left: "45°", top: "45°" }),
    "An isosceles right triangle with legs of 7, hypotenuse of 7√2 and two angles of 45°.",
    "等腰直角三角形，直角边 7，斜边 7√2，两个角都是 45°。",
  ),
  "perimeter-of-an-isosceles-right-triangle": drawing(
    right(6, 6, { bottom: "6", up: "6", long: "6√2" }),
    "An isosceles right triangle with legs of 6 and hypotenuse of 6√2.",
    "等腰直角三角形，直角边 6，斜边 6√2。",
  ),
  "from-the-shorter-leg": drawing(
    right(5 * s3, 5, { bottom: "5√3", up: "5", long: "10", left: "30°", top: "60°" }),
    "A 30°-60°-90° triangle: the shorter leg of 5 is opposite the 30° angle, the longer leg is 5√3 and the hypotenuse is 10.",
    "30°-60°-90° 三角形：短直角边 5 对着 30° 的角，长直角边 5√3，斜边 10。",
  ),
  "area-from-a-leg": drawing(
    right(6, 6, { bottom: "6", up: "6", hot: ["bottom", "up"] }),
    "An isosceles right triangle whose legs of 6 serve as base and height: its area is 18.",
    "等腰直角三角形，长 6 的两条直角边是底和高：面积是 18。",
  ),
  "area-of-isosceles-right-triangles#area-from-the-hypotenuse": drawing(
    right(5 * Math.SQRT2, 5 * Math.SQRT2, { bottom: "5√2", up: "5√2", long: "10", hot: ["long"] }),
    "An isosceles right triangle with hypotenuse 10 and legs of 5√2: its area is 25.",
    "斜边 10、直角边 5√2 的等腰直角三角形：面积是 25。",
  ),
  "area-of-thirty-sixty-ninety-triangles#area-from-the-hypotenuse": drawing(
    right(6 * s3, 6, { bottom: "6√3", up: "6", long: "12", left: "30°", top: "60°", hot: ["long"] }),
    "A 30°-60°-90° triangle with hypotenuse 12, shorter leg 6 and longer leg 6√3.",
    "30°-60°-90° 三角形，斜边 12，短直角边 6，长直角边 6√3。",
  ),
  "area-from-the-longer-leg": drawing(
    right(6, 2 * s3, { bottom: "6", up: "2√3", left: "30°", top: "60°" }),
    "A 30°-60°-90° triangle with longer leg 6 and shorter leg 2√3.",
    "30°-60°-90° 三角形，长直角边 6，短直角边 2√3。",
  ),
  "height-of-an-equilateral-triangle": drawing(
    equilateral("10", "5", "5√3"),
    "An equilateral triangle with side 10, cut by its height of 5√3 into two 30°-60°-90° triangles with shorter leg 5.",
    "边长 10 的等边三角形，被长 5√3 的高分成两个短直角边为 5 的 30°-60°-90° 三角形。",
  ),
  "area-from-the-side": drawing(
    equilateral("6", "3", "3√3"),
    "An equilateral triangle with side 6, half base 3 and height 3√3.",
    "边长 6 的等边三角形，底的一半是 3，高是 3√3。",
  ),
  medians: drawing(
    (() => {
      const [a, b, c]: [Point, Point, Point] = [
        [1.4, 4.2],
        [0, 0],
        [6, 0],
      ];
      return [
        { kind: "polygon", points: [a, b, c] },
        seg(a, [3, 0], "accent"),
        name(a, "A", "n"),
        name(b, "B", "sw"),
        name(c, "C", "se"),
        name([3, 0], "M", "n"),
        note([1.5, 0], "2x + 3", "s"),
        note([4.5, 0], "4x − 5", "s"),
        tick(b, [3, 0], 1),
        tick([3, 0], c, 1),
      ] satisfies Mark[];
    })(),
    "Median AM of triangle ABC: M is the midpoint of BC, so BM = 2x + 3 equals MC = 4x − 5.",
    "三角形 ABC 的中线 AM：M 是 BC 的中点，所以 BM = 2x + 3 等于 MC = 4x − 5。",
  ),
  "the-centroid-theorem": drawing(
    centroidMarks(),
    "The three medians of triangle ABC meet at the centroid G, with AG = 12 and GM = 6 on a median of 18.",
    "三角形 ABC 的三条中线交于重心 G，长 18 的中线上 AG = 12，GM = 6。",
  ),
  "properties-of-the-diagonals": drawing(
    (() => {
      const [a, b, c, d]: Point[] = [
        [0, 0],
        [4, 0],
        [4, 4],
        [0, 4],
      ];
      const e: Point = [2, 2];
      return [
        { kind: "polygon", points: [a!, b!, c!, d!] },
        seg(a!, c!, "accent"),
        seg(b!, d!, "action"),
        square(e, c!, d!),
        name(a!, "A", "sw"),
        name(b!, "B", "se"),
        name(c!, "C", "ne"),
        name(d!, "D", "nw"),
        name(e, "E", "s"),
        note(mid(a!, e), "3x − 4", "se"),
        note(mid(d!, e), "BD = 4x + 2", "ne"),
      ] satisfies Mark[];
    })(),
    "Square ABCD with diagonals meeting at E: they are equal and perpendicular, AE = 3x − 4 and BD = 4x + 2 is twice AE.",
    "正方形 ABCD，对角线交于 E：它们相等且垂直，AE = 3x − 4，BD = 4x + 2 是 AE 的两倍。",
  ),
  "the-diagonal-from-the-side": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [6, 0],
          [6, 6],
          [0, 6],
        ],
      },
      seg([0, 0], [6, 6], "accent"),
      square([6, 0], [0, 0], [6, 6]),
      note([3, 0], "6", "s"),
      note([6, 3], "6", "e"),
      note([3, 3], "6√2", "nw"),
    ],
    "A square with side 6: a diagonal cuts it into two isosceles right triangles and has length 6√2.",
    "边长 6 的正方形：对角线把它分成两个等腰直角三角形，长 6√2。",
  ),
  "angles-of-a-parallelogram": drawing(
    [
      { kind: "polygon", points: para },
      ...paraNames,
      angle(para[0], para[1], para[3], "accent", "70°"),
      angle(para[1], para[2], para[0], "action", "110°"),
      angle(para[2], para[3], para[1], "accent", "70°"),
      angle(para[3], para[0], para[2], "action", "110°"),
    ],
    "Parallelogram ABCD: opposite angles A and C are 70°, B and D are 110°, and consecutive angles add up to 180°.",
    "平行四边形 ABCD：对角 A、C 是 70°，B、D 是 110°，邻角的和是 180°。",
  ),
  "angle-equations-in-parallelograms": drawing(
    [
      { kind: "polygon", points: para },
      ...paraNames,
      angle(para[0], para[1], para[3], "accent", "(2x + 10)°"),
      angle(para[1], para[2], para[0], "action", "(3x − 5)°"),
    ],
    "Parallelogram ABCD with consecutive angles A of (2x + 10)° and B of (3x − 5)°, which add up to 180°.",
    "平行四边形 ABCD，邻角 A（(2x + 10)°）和 B（(3x − 5)°）的和是 180°。",
  ),
  "opposite-sides-of-a-parallelogram": drawing(
    [
      { kind: "polygon", points: para },
      ...paraNames,
      tick(para[0], para[1], 1),
      tick(para[3], para[2], 1),
      tick(para[1], para[2], 2),
      tick(para[0], para[3], 2),
      note(mid(para[0], para[1]), "3x − 4", "s"),
      note(mid(para[3], para[2]), "x + 10", "n"),
    ],
    "Parallelogram ABCD: opposite sides AB of length 3x − 4 and CD of length x + 10 are congruent.",
    "平行四边形 ABCD：对边 AB（长 3x − 4）和 CD（长 x + 10）相等。",
  ),
  "diagonals-of-a-parallelogram": drawing(
    [
      { kind: "polygon", points: para },
      ...paraNames,
      seg(para[0], para[2], "accent"),
      seg(para[1], para[3], "action"),
      name(mid(para[0], para[2]), "E", "n"),
      note(mid(para[0], mid(para[0], para[2])), "2x + 1", "n"),
      note(mid(para[2], mid(para[0], para[2])), "4x − 7", "s"),
      tick(para[0], mid(para[0], para[2]), 1),
      tick(mid(para[0], para[2]), para[2], 1),
    ],
    "Parallelogram ABCD with diagonals meeting at E: AE = 2x + 1 equals CE = 4x − 7, since the diagonals bisect each other.",
    "平行四边形 ABCD，对角线交于 E：AE = 2x + 1 等于 CE = 4x − 7，因为对角线互相平分。",
  ),
} satisfies Record<string, Figure>;

/** trigDrawings are the explanation drawings of trigonometry. */
export const trigDrawings = {
  "naming-the-sides": drawing(
    right(5, 3, { names: ["A", "C", "B"], left: "A", hot: ["up", "bottom"] }),
    "Right triangle ABC with its right angle at C: seen from angle A, BC is opposite, AC is adjacent and AB is the hypotenuse.",
    "直角三角形 ABC，直角在 C：从角 A 看，BC 是对边，AC 是邻边，AB 是斜边。",
  ),
  "the-other-acute-angle": drawing(
    right(5, 5 * Math.tan(rad(35)), { left: "35°", top: "55°" }),
    "A right triangle with acute angles of 35° and 55°, which add up to 90°.",
    "直角三角形的两个锐角是 35° 和 55°，和是 90°。",
  ),
  "acute-angles-as-expressions": drawing(
    right(5, 5 * Math.tan(rad(38)), { left: "(2x + 6)°", top: "(4x − 12)°" }),
    "A right triangle with acute angles of (2x + 6)° and (4x − 12)°, which add up to 90°.",
    "直角三角形的两个锐角是 (2x + 6)° 和 (4x − 12)°，和是 90°。",
  ),
  "the-sine": drawing(
    right(12, 5, { bottom: "12", up: "5", long: "13", left: "θ", hot: ["up", "long"] }),
    "A right triangle with legs 5 and 12 and hypotenuse 13. For angle θ, opposite the 5, the sine uses the opposite side 5 and the hypotenuse 13.",
    "直角边 5 和 12、斜边 13 的直角三角形。对角 θ（对着 5），正弦用对边 5 和斜边 13。",
  ),
  "the-cosine": drawing(
    right(12, 5, { bottom: "12", up: "5", long: "13", left: "θ", hot: ["bottom", "long"] }),
    "The same triangle. For angle θ, the cosine uses the adjacent side 12 and the hypotenuse 13.",
    "同一个三角形。对角 θ，余弦用邻边 12 和斜边 13。",
  ),
  "the-tangent": drawing(
    right(12, 5, { bottom: "12", up: "5", long: "13", left: "θ", hot: ["up", "bottom"] }),
    "The same triangle. For angle θ, the tangent uses the opposite side 5 and the adjacent side 12.",
    "同一个三角形。对角 θ，正切用对边 5 和邻边 12。",
  ),
  "ratios-with-a-missing-hypotenuse": drawing(
    right(4, 2, { bottom: "4", up: "2", long: "2√5", left: "θ", hot: ["long"] }),
    "A right triangle with legs 2 and 4; the hypotenuse is 2√5, and θ is opposite the leg of 2.",
    "直角边 2 和 4 的直角三角形；斜边是 2√5，θ 对着长 2 的直角边。",
  ),
  "ratios-with-a-missing-leg": drawing(
    right(2 * Math.sqrt(10), 3, { bottom: "2√10", up: "3", long: "7", left: "θ", hot: ["bottom"] }),
    "A right triangle with hypotenuse 7 and leg 3; the other leg is 2√10, and θ is opposite the leg of 3.",
    "斜边 7、直角边 3 的直角三角形；另一条直角边是 2√10，θ 对着长 3 的直角边。",
  ),
  "one-ratio-from-another": drawing(
    right(Math.sqrt(5), 2, { bottom: "√5", up: "2", long: "3", left: "θ", hot: ["bottom"] }),
    "A right triangle for sin θ = 2/3: opposite side 2, hypotenuse 3 and adjacent side √5.",
    "sin θ = 2/3 对应的直角三角形：对边 2，斜边 3，邻边 √5。",
  ),
  "the-unknown-in-the-numerator": drawing(
    right(12 * Math.cos(rad(35)), 12 * Math.sin(rad(35)), { up: "x", long: "12", left: "35°", hot: ["up", "long"] }),
    "A right triangle with hypotenuse 12 and an angle of 35°; x is the side opposite that angle.",
    "斜边 12、有一个 35° 角的直角三角形；x 是该角的对边。",
  ),
  "the-unknown-in-the-denominator": drawing(
    right(8 / Math.tan(rad(25)), 8, { up: "8", long: "x", left: "25°", hot: ["up", "long"] }),
    "A right triangle with an angle of 25° whose opposite side is 8; x is the hypotenuse.",
    "有一个 25° 角、其对边为 8 的直角三角形；x 是斜边。",
  ),
  "choosing-the-ratio": drawing(
    right(9 / Math.tan(rad(32)), 9, { bottom: "x", up: "9", left: "32°", hot: ["up", "bottom"] }),
    "A right triangle with an angle of 32°, opposite side 9 and adjacent side x.",
    "有一个 32° 角的直角三角形，对边 9，邻边 x。",
  ),
  "an-angle-from-the-two-legs": drawing(
    right(8, 5, { bottom: "8", up: "5", left: "θ", hot: ["up", "bottom"] }),
    "A right triangle with opposite side 5 and adjacent side 8 for angle θ.",
    "直角三角形，对角 θ 而言对边 5，邻边 8。",
  ),
  "an-angle-from-a-leg-and-the-hypotenuse": drawing(
    right(4, Math.sqrt(65), { bottom: "4", long: "9", left: "θ", hot: ["bottom", "long"] }),
    "A right triangle with adjacent side 4 and hypotenuse 9 for angle θ.",
    "直角三角形，对角 θ 而言邻边 4，斜边 9。",
  ),
  "angles-of-elevation": drawing(
    [
      seg([0, 0], [30, 0]),
      seg([0, 0], [0, 1.6], "action"),
      seg([0, 1.6], [30, 1.6], undefined, true),
      seg([0, 1.6], [30, 25], "accent"),
      seg([30, 0], [30, 25], "result"),
      square([30, 1.6], [0, 1.6], [30, 25]),
      angle([0, 1.6], [30, 1.6], [30, 25], "action", "38°"),
      note([15, 0], "30 m", "s"),
      note([0, 0.8], "1.6 m", "w"),
      note([30, 13], "≈ 23.44 m", "e"),
    ],
    "A person with eyes 1.6 m high stands 30 m from a tree and looks up to the top at an angle of elevation of 38°; the tree rises about 23.44 m above eye level.",
    "眼睛高 1.6 m 的人站在离树 30 m 处，以 38° 的仰角看树顶；树在视线水平以上约 23.44 m。",
  ),
  "angles-of-depression": drawing(
    [
      seg([0, 0], [111.4, 0]),
      seg([0, 0], [0, 45], "result"),
      seg([0, 45], [60, 45], undefined, true),
      seg([0, 45], [111.4, 0], "accent"),
      square([0, 0], [10, 0], [0, 10]),
      angle([0, 45], [60, 45], [111.4, 0], "action", "22°"),
      angle([111.4, 0], [0, 45], [0, 0], "action", "22°"),
      note([0, 22], "45 m", "w"),
      note([55, 0], "d", "s"),
    ],
    "From the top of a 45 m cliff, a boat is seen at an angle of depression of 22°; at the boat, the angle of elevation is also 22°.",
    "从 45 m 高的悬崖顶看船，俯角 22°；从船看崖顶，仰角也是 22°。",
  ),
  "angles-in-context": drawing(
    right(2, Math.sqrt(32), { bottom: "2", long: "6", left: "θ", hot: ["bottom", "long"] }),
    "A 6 m ladder against a wall with its foot 2 m from the wall: the ground is adjacent to θ and the ladder is the hypotenuse.",
    "6 m 长的梯子靠墙，梯脚离墙 2 m：地面是 θ 的邻边，梯子是斜边。",
  ),
  "equal-angles-have-equal-ratios": drawing(
    [
      ...right(8, 6, { bottom: "8", up: "6", long: "10", left: "A", names: ["A", "C", "B"] }),
      ...shift(right(4, 3, { left: "D", names: ["D", "F", "E"] }), [-10, 0]),
    ],
    "Similar right triangles: the larger with AC = 8, BC = 6, AB = 10, and a smaller one with the same angles, so tan D = tan A = 3/4.",
    "相似的直角三角形：大的 AC = 8，BC = 6，AB = 10，小的角相同，所以 tan D = tan A = 3/4。",
  ),
  "sides-from-a-similar-triangle": drawing(
    [
      ...right(8, 6, { bottom: "8", up: "6", long: "10", left: "A", names: ["A", "C", "B"] }),
      ...shift(right(20, 15, { up: "15", long: "25", left: "D", names: ["D", "F", "E"], hot: ["up"] }), [25, 0]),
    ],
    "Triangle ABC with AC = 8, BC = 6, AB = 10, and a similar triangle DEF with hypotenuse 25, so EF = 15.",
    "三角形 ABC，AC = 8，BC = 6，AB = 10，相似三角形 DEF 的斜边是 25，所以 EF = 15。",
  ),
  "cofunction-identities": drawing(
    right(5, 5 * Math.tan(rad(28)), { names: ["A", "C", "B"], left: "28°", top: "62°", hot: ["up"] }),
    "Right triangle ABC with angles of 28° at A and 62° at B: the side opposite A is adjacent to B, so sin 28° = cos 62°.",
    "直角三角形 ABC，A 处 28°，B 处 62°：A 的对边是 B 的邻边，所以 sin 28° = cos 62°。",
  ),
  "ratios-of-the-other-acute-angle": drawing(
    right(15, 8, { bottom: "15", up: "8", long: "17", names: ["A", "C", "B"], hot: ["up", "long"] }),
    "Right triangle ABC with BC = 8 and AB = 17: sin A = 8/17, and the same fraction is cos B.",
    "直角三角形 ABC，BC = 8，AB = 17：sin A = 8/17，同一个分数也是 cos B。",
  ),
  "exact-values": drawing(
    [
      ...right(s3 * 2, 2, { bottom: "√3", up: "1", long: "2", left: "30°", top: "60°" }),
      ...shift(right(3, 3, { bottom: "1", up: "1", long: "√2", left: "45°", top: "45°" }), [4.5, 0]),
    ],
    "The two special right triangles: 30°-60°-90° with sides 1, √3, 2, and 45°-45°-90° with sides 1, 1, √2.",
    "两个特殊直角三角形：30°-60°-90°，边长 1、√3、2；45°-45°-90°，边长 1、1、√2。",
  ),
  "exact-sides-with-special-angles": drawing(
    right(8, 8 * s3, { bottom: "8", up: "8√3", long: "16", left: "60°" }),
    "A right triangle with a 60° angle and adjacent side 8: the opposite side is 8√3 and the hypotenuse is 16.",
    "有一个 60° 角、邻边为 8 的直角三角形：对边 8√3，斜边 16。",
  ),
  "area-from-a-leg-and-an-angle": drawing(
    right(6, 6 * Math.tan(rad(35)), { bottom: "6", up: "6 tan 35°", left: "35°", hot: ["bottom", "up"] }),
    "A right triangle with adjacent leg 6 and an angle of 35°: the other leg is 6 tan 35°.",
    "邻边 6、有一个 35° 角的直角三角形：另一条直角边是 6 tan 35°。",
  ),
  "area-from-the-hypotenuse-and-an-angle": drawing(
    right(10 * Math.cos(rad(40)), 10 * Math.sin(rad(40)), {
      bottom: "10 cos 40°",
      up: "10 sin 40°",
      long: "10",
      left: "40°",
      hot: ["bottom", "up"],
    }),
    "A right triangle with hypotenuse 10 and an angle of 40°: the legs are 10 sin 40° and 10 cos 40°.",
    "斜边 10、有一个 40° 角的直角三角形：直角边是 10 sin 40° 和 10 cos 40°。",
  ),
  "area-from-two-sides-and-the-included-angle": drawing(
    (() => {
      const c: Point = [0, 0];
      const a: Point = [7, 0];
      const b = on(50, 9);
      return [
        { kind: "polygon", points: [c, a, b] },
        seg(b, [b[0], 0], "accent", true),
        square([b[0], 0], a, b),
        angle(c, a, b, "action", "50°"),
        name(c, "C", "sw"),
        name(a, "A", "se"),
        name(b, "B", "n"),
        note([3.5, 0], "b = 7", "s"),
        note(mid(c, b), "a = 9", "nw"),
        note([b[0], b[1] / 2], "h", "e"),
      ] satisfies Mark[];
    })(),
    "Triangle ABC with CB = 9, CA = 7 and an angle of 50° at C: the height from B is h = 9 sin 50°.",
    "三角形 ABC，CB = 9，CA = 7，C 处的角是 50°：从 B 引的高 h = 9 sin 50°。",
  ),
  "a-shared-height": drawing(
    (() => {
      const h = 10 * Math.sin(rad(50));
      const b: Point = [-10 * Math.cos(rad(50)), 0];
      const c: Point = [h / Math.tan(rad(35)), 0];
      const a: Point = [0, h];
      return [
        { kind: "polygon", points: [b, c, a] },
        seg(a, [0, 0], "accent"),
        square([0, 0], c, a),
        angle(b, c, a, "action", "50°"),
        angle(c, a, b, "action", "35°"),
        name(a, "A", "n"),
        name(b, "B", "sw"),
        name(c, "C", "se"),
        name([0, 0], "D", "s"),
        note(mid(a, b), "10", "nw"),
      ] satisfies Mark[];
    })(),
    "Triangle ABC with height AD, AB = 10, an angle of 50° at B and of 35° at C: two right triangles share the side AD.",
    "三角形 ABC，高 AD，AB = 10，B 处 50°，C 处 35°：两个直角三角形共用边 AD。",
  ),
  "two-angles-of-elevation": drawing(
    (() => {
      const h = 52.5;
      const t: Point = [0, h];
      const q: Point = [-h / Math.tan(rad(40)), 0];
      const p: Point = [-h / Math.tan(rad(25)), 0];
      return [
        seg(p, [0, 0]),
        seg([0, 0], t, "result"),
        seg(p, t, "accent"),
        seg(q, t, "action"),
        square([0, 0], p, t),
        angle(p, [0, 0], t, "accent", "25°"),
        angle(q, [0, 0], t, "action", "40°"),
        name(p, "P", "s"),
        name(q, "Q", "s"),
        note(mid(p, q), "50 m", "s"),
        note([0, h / 2], "h", "e"),
      ] satisfies Mark[];
    })(),
    "An object of height h seen at 25° from P and at 40° from Q, 50 m closer: two right triangles with the same height.",
    "高 h 的物体，从 P 看仰角 25°，从近 50 m 的 Q 看仰角 40°：两个直角三角形高相同。",
  ),
  "stacked-right-triangles": drawing(
    (() => {
      const a: Point = [0, 0];
      const b: Point = [8, 0];
      const c: Point = [8, 8 * Math.tan(rad(30))];
      const ac = 8 / Math.cos(rad(30));
      const d = on(55, ac / Math.cos(rad(25)));
      return [
        { kind: "polygon", points: [a, b, c] },
        { kind: "polygon", points: [a, c, d], tone: "result" },
        square(b, a, c),
        square(c, a, d),
        angle(a, b, c, "action", "30°"),
        angle(a, c, d, "accent", "25°"),
        name(a, "A", "sw"),
        name(b, "B", "se"),
        name(c, "C", "e"),
        name(d, "D", "n"),
        note([4, 0], "8", "s"),
      ] satisfies Mark[];
    })(),
    "Right triangle ABC with its right angle at B and right triangle ACD with its right angle at C share AC; AB = 8, angle BAC is 30° and angle CAD is 25°.",
    "直角在 B 的直角三角形 ABC 和直角在 C 的直角三角形 ACD 共用 AC；AB = 8，角 BAC 是 30°，角 CAD 是 25°。",
  ),
} satisfies Record<string, Figure>;

/** shift moves marks by a vector, for drawing two figures side by side. */
function shift(marks: readonly Mark[], by: Point): Mark[] {
  const move = (p: Point): Point => [p[0] + by[0], p[1] + by[1]];
  return marks.map((m): Mark => {
    switch (m.kind) {
      case "polygon":
        return { ...m, points: m.points.map(move) };
      case "segment":
      case "side":
      case "ticks":
      case "arrows":
        return { ...m, a: move(m.a), b: move(m.b) };
      case "arc":
      case "right":
        return { ...m, vertex: move(m.vertex), from: move(m.from), to: move(m.to) };
      case "label":
      case "dot":
        return { ...m, at: move(m.at) };
      default:
        return m;
    }
  });
}

/** cube is a box with labeled and marked diagonals. */
const box = (l: number, w: number, h: number) => boxMarks(l, w, h);

const cube5 = box(5, 5, 5);
const cube4 = box(4, 4, 4);
const box64 = box(6, 3, 4);
const box12 = box(3, 4, 12);

/** sphereMarks draws a sphere with an equator and a labeled radius. */
const sphereMarks = (text: string): Mark[] => [
  ring(3),
  ...ellipse([0, 0], 3, 0.9, true),
  seg([0, 0], [3, 0], "accent"),
  note([1.5, 0], text, "n"),
];

/** solidDrawings are the explanation drawings of solids. */
export const solidDrawings = {
  "face-diagonal-from-the-edge": drawing(
    [
      ...cube5.marks,
      seg(cube5.corners.A!, cube5.corners.F!, "accent"),
      note(mid(cube5.corners.A!, cube5.corners.B!), "5", "s"),
      note(mid(cube5.corners.B!, cube5.corners.F!), "5", "e"),
      note(mid(cube5.corners.A!, cube5.corners.F!), "5√2", "nw"),
    ],
    "A cube with edge 5 cm: the diagonal of a face is the hypotenuse of a right triangle with two edges as legs, 5√2 cm.",
    "棱长 5 cm 的正方体：面对角线是以两条棱为直角边的直角三角形的斜边，长 5√2 cm。",
  ),
  "space-diagonal-from-the-edge": drawing(
    [
      ...cube4.marks,
      seg(cube4.corners.A!, cube4.corners.C!, "action", true),
      seg(cube4.corners.C!, cube4.corners.G!, "result"),
      seg(cube4.corners.A!, cube4.corners.G!, "accent"),
      note(mid(cube4.corners.B!, cube4.corners.F!), "4", "w"),
      note(mid(cube4.corners.A!, cube4.corners.G!), "4√3", "nw"),
    ],
    "A cube with edge 4 cm: a space diagonal of 4√3 cm is the hypotenuse of a right triangle with an edge and a face diagonal as legs.",
    "棱长 4 cm 的正方体：长 4√3 cm 的体对角线是以一条棱和一条面对角线为直角边的直角三角形的斜边。",
  ),
  "face-diagonals-of-a-box": drawing(
    [
      ...box64.marks,
      seg(box64.corners.A!, box64.corners.F!, "accent"),
      note(mid(box64.corners.A!, box64.corners.B!), "6", "s"),
      note(mid(box64.corners.A!, box64.corners.E!), "4", "w"),
      note(mid(box64.corners.A!, box64.corners.F!), "2√13", "nw"),
    ],
    "A box 6 cm long and 4 cm high: the diagonal of its front face is 2√13 cm.",
    "长 6 cm、高 4 cm 的长方体：前面的对角线长 2√13 cm。",
  ),
  "diagonal-of-a-box": drawing(
    [
      ...box12.marks,
      seg(box12.corners.A!, box12.corners.C!, "action", true),
      seg(box12.corners.C!, box12.corners.G!, "result"),
      seg(box12.corners.A!, box12.corners.G!, "accent"),
      note(mid(box12.corners.A!, box12.corners.B!), "3", "s"),
      note(mid(box12.corners.B!, box12.corners.C!), "4", "se"),
      note(mid(box12.corners.C!, box12.corners.G!), "12", "e"),
      note(mid(box12.corners.A!, box12.corners.G!), "13", "nw"),
    ],
    "A box 3 by 4 by 12 cm: its diagonal of 13 cm is the hypotenuse of a right triangle with the height and the diagonal of the bottom as legs.",
    "3 × 4 × 12 cm 的长方体：长 13 cm 的对角线是以高和底面对角线为直角边的直角三角形的斜边。",
  ),
  "missing-height-or-base-edge": drawing(
    pyramidMarks(6, 8, "6", "8"),
    "A square pyramid with base edge 6 cm and height 8 cm, of volume 96 cubic centimeters.",
    "底面边长 6 cm、高 8 cm 的正四棱锥，体积 96 立方厘米。",
  ),
  "square-pyramids-from-the-slant-height": drawing(
    pyramidMarks(10, 12, "10", undefined, "13"),
    "A square pyramid with base edge 10 cm and slant height 13 cm, measured up the middle of a face.",
    "底面边长 10 cm、斜高 13 cm 的正四棱锥，斜高沿侧面正中量。",
  ),
  "slant-height-from-the-height": drawing(
    pyramidMarks(10, 12, "10", "12", "13"),
    "A square pyramid with base edge 10 cm and height 12 cm: the height and half the edge, 5 cm, are legs of a right triangle with hypotenuse the slant height, 13 cm.",
    "底面边长 10 cm、高 12 cm 的正四棱锥：高和边长的一半（5 cm）是直角边，斜边是斜高 13 cm。",
  ),
  "volume-in-terms-of-pi": drawing(
    cylinderMarks(3, 5, "3", "5"),
    "A cylinder with radius 3 cm and height 5 cm.",
    "半径 3 cm、高 5 cm 的圆柱。",
  ),
  "missing-radius-or-height": drawing(
    cylinderMarks(3, 8, "3", "8"),
    "A cylinder with radius 3 cm and height 8 cm, of volume 72π cubic centimeters.",
    "半径 3 cm、高 8 cm 的圆柱，体积 72π 立方厘米。",
  ),
  "lateral-area-of-a-cylinder": drawing(
    [
      ...cylinderMarks(2, 3.5, "4", "7"),
      {
        kind: "polygon",
        points: [
          [5, 0],
          [5 + 12.57, 0],
          [5 + 12.57, 3.5],
          [5, 3.5],
        ],
        tone: "result",
      },
      note([5 + 6.28, 0], "2π · 4 = 8π", "s"),
      note([5 + 12.57, 1.75], "7", "e"),
    ],
    "A cylinder with radius 4 cm and height 7 cm, and its side unrolled into a rectangle 8π cm wide and 7 cm high.",
    "半径 4 cm、高 7 cm 的圆柱，以及侧面展开得到的宽 8π cm、高 7 cm 的长方形。",
  ),
  "total-surface-area-of-a-cylinder": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [18.85, 0],
          [18.85, 5],
          [0, 5],
        ],
        tone: "result",
      },
      ring(3, [9.42, 8]),
      ring(3, [9.42, -3]),
      note([9.42, 8], "r = 3", "n"),
      note([18.85, 2.5], "5", "e"),
      note([9.42, 2.5], "6π", "n"),
    ],
    "The net of a cylinder with radius 3 cm and height 5 cm: two circles and a rectangle 6π cm wide and 5 cm high.",
    "半径 3 cm、高 5 cm 的圆柱的展开图：两个圆和一个宽 6π cm、高 5 cm 的长方形。",
  ),
  "one-third-of-a-cylinder": drawing(coneMarks(3, 4, "3", "4"), "A cone with radius 3 cm and height 4 cm.", "半径 3 cm、高 4 cm 的圆锥。"),
  "missing-radius-or-height-of-a-cone": drawing(
    coneMarks(5, 6, "5", "6"),
    "A cone with radius 5 cm and height 6 cm, of volume 50π cubic centimeters.",
    "半径 5 cm、高 6 cm 的圆锥，体积 50π 立方厘米。",
  ),
  "slant-height-from-radius-and-height": drawing(
    coneMarks(5, 12, "5", "12", "13"),
    "A cone with radius 5 cm and height 12 cm: radius, height and the slant height of 13 cm form a right triangle.",
    "半径 5 cm、高 12 cm 的圆锥：半径、高和 13 cm 的斜高构成直角三角形。",
  ),
  "height-from-slant-height": drawing(
    coneMarks(6, 8, "6", "8", "10"),
    "A cone with slant height 10 cm and radius 6 cm has height 8 cm.",
    "斜高 10 cm、半径 6 cm 的圆锥，高是 8 cm。",
  ),
  "lateral-area-of-a-cone": drawing(
    coneMarks(3, 4, "3", undefined, "5"),
    "A cone with radius 3 cm and slant height 5 cm.",
    "半径 3 cm、斜高 5 cm 的圆锥。",
  ),
  "surface-area-from-the-height": drawing(
    coneMarks(6, 8, "6", "8", "10"),
    "A cone with radius 6 cm and height 8 cm has slant height 10 cm.",
    "半径 6 cm、高 8 cm 的圆锥，斜高是 10 cm。",
  ),
  "volume-of-a-sphere": drawing(sphereMarks("3"), "A sphere with radius 3 cm.", "半径 3 cm 的球。"),
  "radius-from-the-volume": drawing(
    sphereMarks("6"),
    "A sphere with radius 6 cm, of volume 288π cubic centimeters.",
    "半径 6 cm 的球，体积 288π 立方厘米。",
  ),
  "frustum-as-a-difference-of-cones": drawing(
    [
      ...coneMarks(6, 8, "6", "8"),
      ...ellipse([0, 4], 3, 0.9, true, "result"),
      seg([0, 4], [3, 4], "result"),
      note([1.5, 4], "3", "n"),
      note([0, 6], "4", "e"),
    ],
    "A cone of radius 6 cm and height 8 cm with the top cone of radius 3 cm and height 4 cm cut off.",
    "半径 6 cm、高 8 cm 的圆锥，切去顶部半径 3 cm、高 4 cm 的小圆锥。",
  ),
} satisfies Record<string, Figure>;

const view = (xMin: number, xMax: number, yMin: number, yMax: number, labelEvery = 2) => ({
  xMin,
  xMax,
  yMin,
  yMax,
  step: 1,
  labelEvery,
  xName: "x",
  yName: "y",
});

const pt = (at: Point, label: string, dir: Compass, tone?: "action" | "result"): PlaneMark => ({
  kind: "point",
  at,
  label,
  dir,
  ...(tone && { tone }),
});

const poly = (points: readonly Point[]): PlaneMark[] => [
  { kind: "polygon", points, tone: "action" },
  ...points.map((a, i): PlaneMark => ({ kind: "segment", a, b: points[(i + 1) % points.length] as Point })),
];

const span = (a: Point, b: Point, tone?: "action" | "result"): PlaneMark => ({ kind: "segment", a, b, ...(tone && { tone }) });

const line = (a: Point, b: Point, tone?: "action" | "result"): PlaneMark => ({
  kind: "line",
  a,
  b,
  ...(tone ? { tone } : { accent: true }),
});

const word = (at: Point, text: string, dir: Compass): PlaneMark => ({ kind: "label", at, text, dir });

/** coordinateDrawings are the explanation drawings of lines, distances and areas in the plane. */
export const coordinateDrawings = {
  "perpendicular-to-a-line-through-two-points": graphed(
    view(-4, 6, -2, 8),
    [
      line([-1, 2], [3, 4]),
      line([0, 7], [3.5, 0], "result"),
      pt([-1, 2], "A", "nw"),
      pt([3, 4], "B", "ne"),
      pt([1, 5], "(1, 5)", "ne", "result"),
    ],
    "The line through A(−1, 2) and B(3, 4) has slope 1/2; the perpendicular through (1, 5) has slope −2: y = −2x + 7.",
    "过 A(−1, 2) 和 B(3, 4) 的直线斜率 1/2；过 (1, 5) 的垂线斜率 −2：y = −2x + 7。",
  ),
  "perpendicular-horizontal-and-vertical-lines": graphed(
    view(-7, 6, -4, 6),
    [
      line([4, -4], [4, 6]),
      line([-7, 2], [6, 2], "result"),
      line([-5, -4], [-5, 6], "action"),
      pt([-5, 2], "(−5, 2)", "ne"),
      word([4, 5], "x = 4", "e"),
      word([0, 2], "y = 2", "n"),
      word([-5, -3], "x = −5", "e"),
    ],
    "Through (−5, 2): y = 2 is perpendicular to the vertical line x = 4, and x = −5 is perpendicular to the x-axis.",
    "过 (−5, 2)：y = 2 垂直于竖直线 x = 4，x = −5 垂直于 x 轴。",
  ),
  "midpoint-from-a-graph": graphed(
    view(-6, 4, -1, 7),
    [span([-4, 1], [2, 5], "action"), pt([-4, 1], "A(−4, 1)", "s"), pt([2, 5], "B(2, 5)", "ne"), pt([-1, 3], "(−1, 3)", "nw", "result")],
    "The segment from A(−4, 1) to B(2, 5) has midpoint (−1, 3).",
    "从 A(−4, 1) 到 B(2, 5) 的线段，中点是 (−1, 3)。",
  ),
  "distance-to-horizontal-and-vertical-lines": graphed(
    view(-6, 7, -3, 7),
    [
      line([4, -3], [4, 7]),
      line([-6, -1], [7, -1]),
      span([-3, 5], [4, 5], "action"),
      span([-3, 5], [-3, -1], "result"),
      pt([-3, 5], "(−3, 5)", "nw"),
      word([0.5, 5], "7", "n"),
      word([-3, 2], "6", "w"),
      word([4, 1], "x = 4", "e"),
      word([1, -1], "y = −1", "s"),
    ],
    "The point (−3, 5) is 7 units from x = 4 and 6 units from y = −1, measured along perpendiculars.",
    "点 (−3, 5) 沿垂线到 x = 4 的距离是 7，到 y = −1 的距离是 6。",
  ),
  "the-foot-of-the-perpendicular": graphed(
    view(-2, 7, -1, 9),
    [
      line([0, 0], [4, 8]),
      line([1, 7], [5, 5], "action"),
      pt([1, 7], "P(1, 7)", "n"),
      pt([3, 6], "F(3, 6)", "e", "result"),
      word([1, 2], "y = 2x", "e"),
    ],
    "The perpendicular through P(1, 7) meets y = 2x at its foot F(3, 6).",
    "过 P(1, 7) 的垂线与 y = 2x 交于垂足 F(3, 6)。",
  ),
  "distance-from-a-point-to-a-line": graphed(
    view(-2, 7, -1, 9),
    [
      line([0, 0], [4, 8]),
      span([1, 7], [3, 6], "result"),
      pt([1, 7], "P(1, 7)", "n"),
      pt([3, 6], "F(3, 6)", "e"),
      word([2, 6.5], "√5", "n"),
      word([1, 2], "y = 2x", "e"),
    ],
    "The distance from P(1, 7) to y = 2x is the length of PF, √5.",
    "P(1, 7) 到 y = 2x 的距离是 PF 的长度，√5。",
  ),
  "perimeters-with-whole-number-sides": graphed(
    view(-2, 8, -2, 10),
    [
      ...poly([
        [0, 0],
        [6, 0],
        [6, 8],
      ]),
      pt([0, 0], "A", "sw"),
      pt([6, 0], "B", "se"),
      pt([6, 8], "C", "n"),
      word([3, 0], "6", "s"),
      word([6, 4], "8", "e"),
      word([3, 4], "10", "nw"),
    ],
    "Triangle A(0, 0), B(6, 0), C(6, 8) with sides 6, 8 and 10.",
    "三角形 A(0, 0)、B(6, 0)、C(6, 8)，边长 6、8、10。",
  ),
  "perimeters-in-simplest-radical-form": graphed(
    view(-2, 6, -2, 6),
    [
      ...poly([
        [0, 0],
        [4, 0],
        [2, 4],
      ]),
      pt([0, 0], "A", "sw"),
      pt([4, 0], "B", "se"),
      pt([2, 4], "C", "n"),
      word([2, 0], "4", "s"),
      word([3, 2], "2√5", "e"),
      word([1, 2], "2√5", "w"),
    ],
    "Triangle A(0, 0), B(4, 0), C(2, 4) with sides 4, 2√5 and 2√5.",
    "三角形 A(0, 0)、B(4, 0)、C(2, 4)，边长 4、2√5、2√5。",
  ),
  "rectangles-with-horizontal-and-vertical-sides": graphed(
    view(-5, 6, -3, 7),
    [
      ...poly([
        [-3, -1],
        [4, -1],
        [4, 5],
        [-3, 5],
      ]),
      pt([-3, -1], "A", "sw"),
      pt([4, -1], "B", "se"),
      pt([4, 5], "C", "ne"),
      pt([-3, 5], "D", "nw"),
      word([0.5, -1], "7", "s"),
      word([4, 2], "6", "e"),
    ],
    "The rectangle A(−3, −1), B(4, −1), C(4, 5), D(−3, 5) has width 7 and height 6.",
    "长方形 A(−3, −1)、B(4, −1)、C(4, 5)、D(−3, 5)，宽 7，高 6。",
  ),
  "tilted-rectangles": graphed(
    view(-4, 4, -1, 7),
    [
      ...poly([
        [0, 0],
        [2, 1],
        [0, 5],
        [-2, 4],
      ]),
      pt([0, 0], "A", "s"),
      pt([2, 1], "B", "e"),
      pt([0, 5], "C", "n"),
      pt([-2, 4], "D", "w"),
      word([1, 0.5], "√5", "se"),
      word([1, 3], "√20", "ne"),
    ],
    "Rectangle A(0, 0), B(2, 1), C(0, 5), D(−2, 4) with sides √5 and √20, area 10.",
    "长方形 A(0, 0)、B(2, 1)、C(0, 5)、D(−2, 4)，边长 √5 和 √20，面积 10。",
  ),
  "triangles-with-a-horizontal-or-vertical-side": graphed(
    view(-4, 7, -1, 9),
    [
      ...poly([
        [-2, 1],
        [5, 1],
        [3, 7],
      ]),
      span([3, 1], [3, 7], "result"),
      pt([-2, 1], "A", "sw"),
      pt([5, 1], "B", "se"),
      pt([3, 7], "C", "n"),
      word([1.5, 1], "7", "s"),
      word([3, 4], "6", "w"),
    ],
    "A(−2, 1), B(5, 1), C(3, 7): base AB of 7 and height of 6, area 21.",
    "A(−2, 1)、B(5, 1)、C(3, 7)：底 AB 长 7，高 6，面积 21。",
  ),
  "areas-of-quadrilaterals": graphed(
    view(-2, 8, -2, 8),
    [
      ...poly([
        [2, 0],
        [6, 3],
        [4, 6],
        [0, 2],
      ]),
      {
        kind: "polygon",
        points: [
          [0, 0],
          [6, 0],
          [6, 6],
          [0, 6],
        ],
      },
      pt([2, 0], "A", "s"),
      pt([6, 3], "B", "e"),
      pt([4, 6], "C", "n"),
      pt([0, 2], "D", "w"),
      word([3, -0.6], "6", "s"),
      word([-0.6, 4], "6", "w"),
    ],
    "Quadrilateral A(2, 0), B(6, 3), C(4, 6), D(0, 2) inside a 6 by 6 rectangle: subtract the corner triangles from 36 to get 17.",
    "四边形 A(2, 0)、B(6, 3)、C(4, 6)、D(0, 2) 在 6 × 6 的长方形内：从 36 减去四角的三角形，得 17。",
  ),
  "coordinates-of-the-centroid": graphed(
    view(-1, 9, -3, 7),
    [
      ...poly([
        [1, 2],
        [7, -1],
        [4, 5],
      ]),
      span([1, 2], [5.5, 2]),
      span([7, -1], [2.5, 3.5]),
      span([4, 5], [4, 0.5]),
      pt([1, 2], "A", "w"),
      pt([7, -1], "B", "e"),
      pt([4, 5], "C", "n"),
      pt([4, 2], "G(4, 2)", "ne", "result"),
    ],
    "Triangle A(1, 2), B(7, −1), C(4, 5) with medians meeting at the centroid G(4, 2).",
    "三角形 A(1, 2)、B(7, −1)、C(4, 5)，中线交于重心 G(4, 2)。",
  ),
} satisfies Record<string, Figure>;

/** probabilityDrawings are the explanation drawings of geometric probability. */
export const probabilityDrawings = {
  "probability-with-areas": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [10, 0],
          [10, 8],
          [0, 8],
        ],
      },
      {
        kind: "shade",
        points: [
          [3, 3],
          [7, 3],
          [7, 6],
          [3, 6],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [3, 3],
          [7, 3],
          [7, 6],
          [3, 6],
        ],
        tone: "result",
      },
      note([5, 0], "10", "s"),
      note([0, 4], "8", "w"),
      note([5, 3], "4", "s"),
      note([3, 4.5], "3", "w"),
    ],
    "A 10 by 8 board with a 4 by 3 rectangle inside it, shaded: the probability of hitting it is 12/80.",
    "10 × 8 的板内有一个 4 × 3 的长方形（涂色）：击中它的概率是 12/80。",
  ),
  "probability-with-circles": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [10, 0],
          [10, 8],
          [0, 8],
        ],
      },
      { kind: "shade", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, 3, [5, 4])), tone: "result" },
      ring(3, [5, 4], "result"),
      seg([5, 4], [8, 4], "accent"),
      note([6.5, 4], "3", "n"),
      note([5, 0], "10", "s"),
      note([0, 4], "8", "w"),
    ],
    "A circle of radius 3 inside a 10 by 8 rectangle, shaded: the probability of landing in it is 9π/80.",
    "10 × 8 的长方形内有一个半径 3 的圆（涂色）：落入其中的概率是 9π/80。",
  ),
} satisfies Record<string, Figure>;
