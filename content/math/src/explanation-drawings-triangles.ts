// Drawings in the explanations of Geometry's congruent and similar triangles.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";

import {
  angle,
  cutMarks,
  cutTriangle,
  drawing,
  fromAngles,
  fromSides,
  name,
  note,
  on,
  pair,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

const crossing: readonly Point[] = [
  [0, 0],
  [6, 2],
  [0, 2],
  [6, 0],
];

/** crossingMarks draws segments AD and BE crossing at their common midpoint C. */
function crossingMarks(parallel: boolean): Mark[] {
  const [a, d, b, e] = crossing as [Point, Point, Point, Point];
  const c: Point = [3, 1];
  return [
    seg(a, d),
    seg(b, e),
    seg(a, b, "accent"),
    seg(d, e, "accent"),
    name(a, "A", "sw"),
    name(d, "D", "ne"),
    name(b, "B", "nw"),
    name(e, "E", "se"),
    name(c, "C", "n"),
    { kind: "ticks", a, b: c, count: 1 },
    { kind: "ticks", a: c, b: d, count: 1 },
    ...(parallel
      ? ([
          angle(a, d, b, "action"),
          angle(d, a, e, "action"),
          { kind: "arrows", a, b, count: 1 },
          { kind: "arrows", a: e, b: d, count: 1 },
        ] satisfies Mark[])
      : ([
          { kind: "ticks", a: b, b: c, count: 2 },
          { kind: "ticks", a: c, b: e, count: 2 },
        ] satisfies Mark[])),
    angle(c, a, b, "result"),
    angle(c, d, e, "result"),
  ];
}

const u: Point = [0, 0];
const v: Point = [5, 0];
const x: Point = [2, 2.2];
const y: Point = [2, -2.2];

/** congruenceDrawings are the explanation drawings of congruent triangles. */
export const congruenceDrawings = {
  "congruence-statements": pair(
    {
      names: ["A", "B", "C", "P", "Q", "R"],
      ticks: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
      corners: [
        [0, "accent"],
        [1, "action"],
        [2, "result"],
      ],
    },
    "Triangles ABC and PQR with matching marks: side AB matches PQ, BC matches QR, CA matches RP, and the angles at A, B and C match those at P, Q and R.",
    "三角形 ABC 和 PQR，标记相同的部分相对应：AB 对 PQ，BC 对 QR，CA 对 RP；A、B、C 处的角对应 P、Q、R 处的角。",
  ),
  "applying-asa": pair(
    {
      ticks: [[0, 1]],
      corners: [
        [0, "accent"],
        [1, "action"],
      ],
    },
    "Triangles ABC and DEF with angles at A and D marked, angles at B and E marked, and the included sides AB and DE marked.",
    "三角形 ABC 和 DEF，A 与 D 处的角、B 与 E 处的角分别标记相同，夹边 AB 与 DE 也标记相同。",
  ),
  "solving-with-asa": pair(
    {
      lengths: [[0, "14", "3x + 2"]],
      corners: [
        [0, "accent"],
        [1, "action"],
      ],
    },
    "Triangles ABC and DEF, congruent by ASA, with AB = 14 and DE = 3x + 2.",
    "由 ASA 全等的三角形 ABC 和 DEF，AB = 14，DE = 3x + 2。",
  ),
  "third-angles": pair(
    {
      shape: fromAngles(50, 75),
      corners: [
        [0, "accent", "50°", "50°"],
        [1, "action", "75°", "75°"],
        [2, "result"],
      ],
    },
    "Triangles ABC and DEF with angles of 50° and 75° in each: the third angles match too.",
    "三角形 ABC 和 DEF 都有 50° 和 75° 的角：第三个角也相等。",
  ),
  "asa-or-aas": pair(
    {
      ticks: [[1, 1]],
      corners: [
        [0, "accent"],
        [1, "action"],
      ],
    },
    "Triangles ABC and DEF with matching angles at A and D and at B and E, and matching sides BC and EF, which are not between the two angles: AAS.",
    "三角形 ABC 和 DEF，A 与 D、B 与 E 处的角分别相等，BC 与 EF 也相等，这两条边不夹在两角之间：AAS。",
  ),
  "solving-with-aas": pair(
    {
      shape: fromAngles(40, 65),
      outsideTop: true,
      ticks: [[1, 1]],
      corners: [
        [0, "accent", "40°"],
        [1, "action", "65°"],
        [2, "result", undefined, "(2x + 15)°"],
      ],
    },
    "Triangles ABC and DEF, congruent by AAS. Angle A is 40°, angle B is 65°, and angle F, the partner of angle C, is (2x + 15)°.",
    "由 AAS 全等的三角形 ABC 和 DEF。角 A 是 40°，角 B 是 65°，角 C 的对应角 F 是 (2x + 15)°。",
  ),
  "included-angles": drawing(
    (() => {
      const [p, q, r] = fromAngles(55, 70);
      return [
        { kind: "polygon", points: [p, q, r] },
        seg(p, q, "accent"),
        seg(q, r, "accent"),
        angle(q, r, p, "result"),
        name(p, "P", "sw"),
        name(q, "Q", "se"),
        name(r, "R", "n"),
      ] satisfies Mark[];
    })(),
    "Triangle PQR. Sides PQ and QR share the vertex Q, so the angle at Q is their included angle.",
    "三角形 PQR。边 PQ 和 QR 有公共顶点 Q，所以 Q 处的角是它们的夹角。",
  ),
  "applying-sas": pair(
    {
      ticks: [
        [0, 1],
        [1, 2],
      ],
      corners: [[1, "action"]],
    },
    "Triangles ABC and DEF with AB matching DE, BC matching EF, and the included angles at B and E matching.",
    "三角形 ABC 和 DEF，AB 对 DE，BC 对 EF，夹角 B 与 E 相等。",
  ),
  "solving-with-sas": pair(
    {
      ticks: [
        [0, 1],
        [1, 2],
      ],
      corners: [[1, "action"]],
      lengths: [[2, "17", "4x − 3"]],
    },
    "Triangles ABC and DEF, congruent by SAS, with third sides AC = 17 and DF = 4x − 3.",
    "由 SAS 全等的三角形 ABC 和 DEF，第三边 AC = 17，DF = 4x − 3。",
  ),
  "applying-sss": pair(
    {
      shape: fromSides(9, 7, 5),
      lengths: [
        [0, "9", "9"],
        [1, "7", "7"],
        [2, "5", "5"],
      ],
    },
    "Two triangles with sides 5, 7 and 9: their sides match, so they are congruent.",
    "两个边长都是 5、7、9 的三角形：三边对应相等，所以全等。",
  ),
  "matching-vertices": pair(
    {
      shape: fromSides(6, 8, 11),
      names: ["A", "B", "C", "F", "D", "E"],
      lengths: [
        [0, "6", "6"],
        [1, "8", "8"],
        [2, "11", "11"],
      ],
    },
    "Triangle ABC with AB = 6, BC = 8 and CA = 11, and triangle FDE with FD = 6, DE = 8 and EF = 11: A matches F, B matches D and C matches E.",
    "三角形 ABC 的 AB = 6，BC = 8，CA = 11；三角形 FDE 的 FD = 6，DE = 8，EF = 11：A 对 F，B 对 D，C 对 E。",
  ),
  "the-pythagorean-theorem#the-converse": drawing(
    (() => {
      const [a, b, c] = fromSides(9, 7, 5);
      return [
        { kind: "polygon", points: [a, b, c] },
        { kind: "side", a, b, text: "9" },
        { kind: "side", a: b, b: c, text: "7" },
        { kind: "side", a: c, b: a, text: "5" },
        angle(c, a, b, "accent"),
      ] satisfies Mark[];
    })(),
    "A triangle with sides 5, 7 and 9. The angle opposite the longest side is obtuse.",
    "边长为 5、7、9 的三角形。最长边所对的角是钝角。",
  ),
  "hypotenuse-and-leg": pair(
    {
      shape: [
        [0, 2.6],
        [4, 0],
        [0, 0],
      ],
      rightAt: 2,
      ticks: [
        [0, 2],
        [2, 1],
      ],
    },
    "Right triangles ABC and DEF, with right angles at C and F, congruent hypotenuses AB and DE, and congruent legs AC and DF.",
    "直角三角形 ABC 和 DEF，直角在 C 和 F，斜边 AB 与 DE 相等，直角边 AC 与 DF 相等。",
  ),
  "missing-legs": pair(
    {
      shape: [
        [0, 8],
        [15, 0],
        [0, 0],
      ],
      rightAt: 2,
      lengths: [
        [0, "17", "17"],
        [2, "8", "8"],
        [1, "15", "15"],
      ],
    },
    "Right triangles ABC and DEF, with right angles at C and F, AB = DE = 17 and AC = DF = 8. Leg BC is 15, so leg EF is 15 too.",
    "直角三角形 ABC 和 DEF，直角在 C 和 F，AB = DE = 17，AC = DF = 8。直角边 BC 是 15，所以 EF 也是 15。",
  ),
  "solving-with-hl": pair(
    {
      shape: [
        [0, 7],
        [24, 0],
        [0, 0],
      ],
      rightAt: 2,
      lengths: [
        [0, "25", "5x − 5"],
        [2, "7", "7"],
      ],
    },
    "Right triangles ABC and DEF, with right angles at C and F: AB = 25 and DE = 5x − 5 are hypotenuses, AC = DF = 7 are legs.",
    "直角三角形 ABC 和 DEF，直角在 C 和 F：AB = 25 和 DE = 5x − 5 是斜边，AC = DF = 7 是直角边。",
  ),
  "shared-sides": drawing(
    [
      { kind: "polygon", points: [u, y, v, x] },
      seg(u, v, "accent"),
      name(u, "U", "w"),
      name(v, "V", "e"),
      name(x, "X", "n"),
      name(y, "Y", "s"),
      { kind: "ticks", a: u, b: x, count: 1 },
      { kind: "ticks", a: u, b: y, count: 1 },
      { kind: "ticks", a: v, b: x, count: 2 },
      { kind: "ticks", a: v, b: y, count: 2 },
    ],
    "Triangles UXV and UYV share the side UV. UX matches UY and VX matches VY.",
    "三角形 UXV 和 UYV 有公共边 UV。UX 与 UY 相等，VX 与 VY 相等。",
  ),
  "corresponding-parts-of-images": pair(
    {
      names: ["A", "B", "C", "F", "D", "E"],
      lengths: [[0, "2x + 1", "13"]],
      corners: [
        [0, "accent"],
        [1, "action"],
        [2, "result"],
      ],
    },
    "A rigid motion maps triangle ABC onto triangle FDE, so side AB, of length 2x + 1, goes to side FD, of length 13.",
    "刚体运动把三角形 ABC 变到三角形 FDE，所以长为 2x + 1 的边 AB 变到长为 13 的边 FD。",
  ),
  "proofs-with-sss-and-sas": drawing(
    crossingMarks(false),
    "Segments AD and BE cross at C, the midpoint of both. Triangles ABC and DEC have two pairs of equal sides and equal vertical angles at C.",
    "线段 AD 和 BE 相交于 C，C 是它们的中点。三角形 ABC 和 DEC 有两组相等的边，C 处的对顶角也相等。",
  ),
  "proofs-with-asa-and-aas": drawing(
    crossingMarks(true),
    "Segments AD and BE cross at C, the midpoint of AD, with AB parallel to DE: alternate interior angles at A and D match, and so do the vertical angles at C.",
    "线段 AD 和 BE 相交于 C，C 是 AD 的中点，且 AB 平行于 DE：A 与 D 处的内错角相等，C 处的对顶角也相等。",
  ),
  "proofs-with-right-angles": drawing(
    [
      {
        kind: "polygon",
        points: [
          [-3, 0],
          [3, 0],
          [0, 4],
        ],
      },
      seg([0, 4], [0, 0], "accent"),
      square([0, 0], [3, 0], [0, 4]),
      square([0, 0], [-3, 0], [0, 4]),
      name([0, 4], "U", "n"),
      name([0, 0], "V", "s"),
      name([-3, 0], "X", "w"),
      name([3, 0], "Y", "e"),
      { kind: "ticks", a: [0, 4], b: [-3, 0], count: 1 },
      { kind: "ticks", a: [0, 4], b: [3, 0], count: 1 },
    ],
    "Segment UV is perpendicular to XY at V, and UX matches UY, making two right triangles with the shared leg UV.",
    "线段 UV 在 V 处垂直于 XY，UX 与 UY 相等，构成共直角边 UV 的两个直角三角形。",
  ),
  "vertical-angles": drawing(
    [
      seg([0, 0], [6, 2]),
      seg([0, 2], [6, 0]),
      seg([0, 0], [0, 2]),
      seg([6, 0], [6, 2]),
      angle([3, 1], [0, 0], [0, 2], "accent"),
      angle([3, 1], [6, 2], [6, 0], "accent"),
    ],
    "Two segments crossing, with their ends joined: the two triangles meet at the crossing, where their vertical angles are equal.",
    "两条线段相交，端点相连：两个三角形在交点处相遇，那里的对顶角相等。",
  ),
} satisfies Record<string, Figure>;

const cut23 = cutTriangle(0.4);
const half = cutTriangle(0.5);
const ad = cutTriangle(0.6);
const ad5 = cutTriangle(0.625);

/** side writes a length beside a segment. */
const side = (a: Point, b: Point, text: string): Mark => ({ kind: "side", a, b, text });

const rect = (x: number, w: number, h: number): Point[] => [
  [x, 0],
  [x + w, 0],
  [x + w, h],
  [x, h],
];

const ab = on(60, 5, [-4, 0]);
const cc: Point = [-1.5 * ab[0], -1.5 * ab[1]];

/** similarityDrawings are the explanation drawings of similar triangles. */
export const similarityDrawings = {
  "corresponding-parts": pair(
    {
      k: 1.4,
      names: ["A", "B", "C", "F", "D", "E"],
      corners: [
        [0, "accent"],
        [1, "action"],
        [2, "result"],
      ],
    },
    "Similar triangles ABC and FDE: A matches F, B matches D and C matches E, with matching angles marked alike.",
    "相似三角形 ABC 和 FDE：A 对 F，B 对 D，C 对 E，相等的角标记相同。",
  ),
  "deciding-whether-rectangles-are-similar": drawing(
    [
      { kind: "polygon", points: rect(0, 6, 4), accent: true },
      note([3, 0], "6", "s"),
      note([0, 2], "4", "w"),
      { kind: "polygon", points: rect(8, 9, 6), tone: "result" },
      note([12.5, 0], "9", "s"),
      note([8, 3], "6", "w"),
    ],
    "A 4 by 6 rectangle and a 6 by 9 rectangle: shorter over shorter and longer over longer are both 3/2, so they are similar.",
    "4 × 6 的长方形和 6 × 9 的长方形：短边之比和长边之比都是 3/2，所以相似。",
  ),
  "finding-the-scale-factor": pair(
    { shape: fromSides(6, 7, 5), k: 2.5, lengths: [[0, "6", "15"]] },
    "Similar triangles ABC and DEF with AB = 6 and DE = 15: the scale factor is 15/6, or 5/2.",
    "相似三角形 ABC 和 DEF，AB = 6，DE = 15：比例是 15/6，即 5/2。",
  ),
  "side-lengths-and-angle-measures-of-similar-polygons#missing-side-lengths": pair(
    {
      shape: fromSides(4, 6, 7),
      k: 2.5,
      lengths: [
        [0, "4", "10"],
        [1, "6", "EF"],
      ],
    },
    "Similar triangles ABC and DEF with AB = 4, BC = 6 and DE = 10; side EF is unknown.",
    "相似三角形 ABC 和 DEF，AB = 4，BC = 6，DE = 10；边 EF 未知。",
  ),
  "missing-angle-measures": pair(
    {
      shape: fromAngles(50, 70),
      k: 1.4,
      corners: [
        [0, "accent", "50°"],
        [1, "action", undefined, "70°"],
        [2, "result", "?"],
      ],
    },
    "Similar triangles ABC and DEF. Angle A is 50° and angle E is 70°, so angle B is 70° as well, and angle C is the rest of 180°.",
    "相似三角形 ABC 和 DEF。角 A 是 50°，角 E 是 70°，所以角 B 也是 70°，角 C 是 180° 余下的部分。",
  ),
  "sides-given-by-expressions": pair(
    {
      shape: fromSides(6, 9, 7),
      k: 10 / 6,
      lengths: [
        [0, "6", "10"],
        [1, "9", "2x + 3"],
      ],
    },
    "Similar triangles ABC and DEF with AB = 6, BC = 9, DE = 10 and EF = 2x + 3.",
    "相似三角形 ABC 和 DEF，AB = 6，BC = 9，DE = 10，EF = 2x + 3。",
  ),
  "ratios-of-perimeters-and-areas": pair(
    { shape: fromSides(2, 2.4, 1.8), k: 1.5, lengths: [[0, "2", "3"]] },
    "Similar triangles with corresponding sides in the ratio 2 : 3.",
    "相似三角形，对应边之比是 2 : 3。",
  ),
  "area-from-corresponding-sides": pair(
    {
      shape: [
        [0, 0],
        [4, 0],
        [1.5, 6],
      ],
      k: 2.5,
      names: ["C", "B", "A", "F", "E", "D"],
      lengths: [[0, "4", "10"]],
    },
    "Similar triangles ABC and DEF with BC = 4 and EF = 10; triangle ABC has area 12.",
    "相似三角形 ABC 和 DEF，BC = 4，EF = 10；三角形 ABC 的面积是 12。",
  ),
  "side-length-from-areas": pair(
    { shape: fromSides(10, 9, 7), k: 1.5, lengths: [[0, "10", "15"]] },
    "Similar triangles of areas 16 and 36. The scale factor is 3/2, so a side of 10 corresponds to a side of 15.",
    "面积为 16 和 36 的相似三角形。比例是 3/2，所以长为 10 的边对应长为 15 的边。",
  ),
  "similar-by-two-angles": pair(
    {
      shape: fromAngles(40, 75),
      outsideTop: true,
      corners: [
        [0, "accent", "40°", "40°"],
        [1, "action", "75°"],
        [2, "result", "65°", "65°"],
      ],
    },
    "A triangle with angles of 40°, 75° and 65°, and a triangle with angles of 40° and 65°: they are similar.",
    "一个三角形的角是 40°、75° 和 65°，另一个有 40° 和 65° 的角：它们相似。",
  ),
  "writing-the-similarity-statement": pair(
    {
      shape: fromAngles(50, 60),
      outsideTop: true,
      names: ["A", "B", "C", "E", "F", "D"],
      corners: [
        [0, "accent", "50°", "50°"],
        [1, "action", "60°", "60°"],
        [2, "result", "70°", "70°"],
      ],
    },
    "Triangle ABC with angles of 50°, 60° and 70° at A, B and C, and triangle EFD with the same angles at E, F and D.",
    "三角形 ABC 在 A、B、C 处的角是 50°、60°、70°；三角形 EFD 在 E、F、D 处的角相同。",
  ),
  "a-line-parallel-to-a-side": drawing(
    [
      ...cutMarks(cut23),
      side(cut23.b, cut23.c, "15"),
      side(cut23.d, cut23.e, "6"),
      note([(cut23.a[0] + cut23.d[0]) / 2, (cut23.a[1] + cut23.d[1]) / 2], "4", "w"),
      note([(cut23.b[0] + cut23.d[0]) / 2, (cut23.b[1] + cut23.d[1]) / 2], "6", "w"),
    ],
    "Triangle ABC with DE parallel to BC: AD = 4, DB = 6 and DE = 6, so BC = 15.",
    "三角形 ABC，DE 平行于 BC：AD = 4，DB = 6，DE = 6，所以 BC = 15。",
  ),
  "checking-three-ratios": pair(
    {
      shape: fromSides(8, 6, 4),
      k: 1.5,
      lengths: [
        [0, "8", "12"],
        [1, "6", "9"],
        [2, "4", "6"],
      ],
    },
    "Triangles with sides 4, 6, 8 and 6, 9, 12: each ratio is 3/2, so they are similar.",
    "边长为 4、6、8 和 6、9、12 的三角形：每组比都是 3/2，所以相似。",
  ),
  "matching-sides-and-the-scale-factor": pair(
    {
      shape: fromSides(8, 6, 10),
      k: 1.5,
      names: ["A", "B", "C", "F", "D", "E"],
      lengths: [
        [0, "8", "12"],
        [1, "6", "9"],
        [2, "10", "15"],
      ],
    },
    "Triangle ABC with AB = 8, BC = 6 and CA = 10, and triangle FDE with FD = 12, DE = 9 and EF = 15: the scale factor is 3/2.",
    "三角形 ABC 的 AB = 8，BC = 6，CA = 10；三角形 FDE 的 FD = 12，DE = 9，EF = 15：比例是 3/2。",
  ),
  "finding-an-unknown-for-sss": pair(
    {
      shape: fromSides(4, 5, 6),
      k: 1.5,
      lengths: [
        [0, "4", "6"],
        [1, "5", "7.5"],
        [2, "6", "2x + 1"],
      ],
    },
    "Triangle ABC with sides 4, 5 and 6, and triangle DEF with DE = 6, EF = 7.5 and FD = 2x + 1.",
    "三角形 ABC 的边长是 4、5、6；三角形 DEF 的 DE = 6，EF = 7.5，FD = 2x + 1。",
  ),
  "checking-sas": pair(
    {
      shape: [[6, 0], on(50, 4), [0, 0]],
      k: 1.5,
      corners: [[2, "accent", "50°", "50°"]],
      lengths: [
        [1, "4", "6"],
        [2, "6", "9"],
      ],
    },
    "Triangles with sides 4 and 6 and with sides 6 and 9, each with an angle of 50° between those sides.",
    "两个三角形，一个有边 4 和 6，另一个有边 6 和 9，这两边的夹角都是 50°。",
  ),
  "triangles-sharing-an-angle": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [8, 0],
          [0, 6],
        ],
      },
      seg([3, 0], [0, 4], "accent"),
      name([0, 0], "A", "sw"),
      name([8, 0], "B", "e"),
      name([0, 6], "C", "n"),
      name([3, 0], "D", "s"),
      name([0, 4], "E", "w"),
      note([1.5, 0], "3", "s"),
      note([0, 2], "4", "w"),
      note([5.5, 0], "AB = 8", "s"),
      note([0, 5], "AC = 6", "w"),
      note([4, 3], "10", "ne"),
    ],
    "Triangle ABC with AB = 8, AC = 6 and BC = 10, with D on AB and E on AC, AD = 3 and AE = 4. The triangles sharing angle A are similar, with D matching C and E matching B.",
    "三角形 ABC，AB = 8，AC = 6，BC = 10，D 在 AB 上，E 在 AC 上，AD = 3，AE = 4。共用角 A 的两个三角形相似，D 对 C，E 对 B。",
  ),
  "finding-an-unknown-for-sas": pair(
    {
      shape: [[0, 0], [6, 0], on(60, 8)],
      k: 1.5,
      corners: [[0, "accent"]],
      lengths: [
        [0, "6", "9"],
        [2, "8", "x + 5"],
      ],
    },
    "Triangles ABC and DEF with congruent angles at A and D, AB = 6, AC = 8, DE = 9 and DF = x + 5.",
    "三角形 ABC 和 DEF，A 与 D 处的角相等，AB = 6，AC = 8，DE = 9，DF = x + 5。",
  ),
  "crossing-segments": drawing(
    [
      seg([-4, 0], [6, 0]),
      seg(ab, cc),
      seg([-4, 0], ab, "accent"),
      seg([6, 0], cc, "result"),
      name([-4, 0], "A", "w"),
      name([6, 0], "D", "e"),
      name(ab, "B", "n"),
      name(cc, "C", "s"),
      name([0, 0], "E", "se"),
      note([-2, 0], "4", "s"),
      note([3, 0], "6", "n"),
      { kind: "side", a: ab, b: [-4, 0], text: "5" },
      { kind: "arrows", a: [-4, 0], b: ab, count: 1 },
      { kind: "arrows", a: cc, b: [6, 0], count: 1 },
    ],
    "Segments AD and BC cross at E, with AB parallel to CD, EA = 4, ED = 6 and AB = 5.",
    "线段 AD 和 BC 相交于 E，AB 平行于 CD，EA = 4，ED = 6，AB = 5。",
  ),
  "indirect-measurement": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [4, 0],
          [0, 6],
        ],
        accent: true,
      },
      note([2, 0], "4", "s"),
      note([0, 3], "6", "w"),
      {
        kind: "polygon",
        points: [
          [14, 0],
          [44, 0],
          [14, 45],
        ],
        tone: "result",
      },
      note([29, 0], "30", "s"),
      note([14, 22], "h", "w"),
      square([0, 0], [4, 0], [0, 6]),
      square([14, 0], [44, 0], [14, 45]),
    ],
    "A person 6 feet tall with a shadow of 4 feet, and a tree of height h with a shadow of 30 feet: two similar right triangles.",
    "身高 6 英尺的人影子长 4 英尺，高 h 的树影子长 30 英尺：两个相似的直角三角形。",
  ),
  "proving-the-angle-sum-theorem": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [5, 0],
          [2, 3],
        ],
      },
      seg([-1, 3], [5.5, 3], "accent"),
      name([0, 0], "A", "sw"),
      name([5, 0], "B", "se"),
      name([2, 3], "C", "n"),
      name([-1, 3], "D", "w"),
      name([5.5, 3], "E", "e"),
      angle([0, 0], [5, 0], [2, 3], "action"),
      angle([2, 3], [-1, 3], [0, 0], "action"),
      angle([5, 0], [2, 3], [0, 0], "result"),
      angle([2, 3], [5, 0], [5.5, 3], "result"),
    ],
    "Triangle ABC with line DE through C parallel to AB: angle DCA equals angle A, and angle ECB equals angle B.",
    "三角形 ABC，过 C 作 DE 平行于 AB：角 DCA 等于角 A，角 ECB 等于角 B。",
  ),
  "proving-the-exterior-angle-theorem": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [4, 0],
          [1.2, 2.6],
        ],
      },
      seg([4, 0], [7, 0]),
      name([1.2, 2.6], "A", "n"),
      name([0, 0], "B", "sw"),
      name([4, 0], "C", "s"),
      name([7, 0], "D", "e"),
      angle([1.2, 2.6], [0, 0], [4, 0], "accent"),
      angle([0, 0], [4, 0], [1.2, 2.6], "accent"),
      angle([4, 0], [7, 0], [1.2, 2.6], "result"),
    ],
    "Triangle ABC with BC extended to D: the exterior angle ACD equals the sum of the angles at A and B.",
    "三角形 ABC，BC 延长到 D：外角 ACD 等于 A、B 处两角之和。",
  ),
  "proving-the-third-angles-theorem": pair(
    {
      corners: [
        [0, "accent"],
        [1, "action"],
        [2, "result"],
      ],
    },
    "Triangles ABC and DEF with angle A equal to angle D and angle B equal to angle E: the third angles C and F are equal too.",
    "三角形 ABC 和 DEF，角 A 等于角 D，角 B 等于角 E：第三个角 C 和 F 也相等。",
  ),
  "proving-triangles-similar-with-aa": drawing(
    [
      ...cutMarks(half),
      angle(half.d, half.a, half.e, "action"),
      angle(half.b, half.a, half.c, "action"),
      angle(half.a, half.b, half.c, "accent"),
    ],
    "Triangle ABC with DE parallel to BC: corresponding angles at D and B match, and the triangles share the angle at A.",
    "三角形 ABC，DE 平行于 BC：D 与 B 处的同位角相等，两个三角形共用 A 处的角。",
  ),
  "using-similar-triangles-to-prove-parallel-lines": drawing(
    [...cutMarks(ad, false), angle(ad.a, ad.b, ad.c, "accent"), angle(ad.d, ad.a, ad.e, "result"), angle(ad.b, ad.a, ad.c, "result")],
    "Triangle ABC with D on AB and E on AC, cutting the sides proportionally: the triangles share the angle at A, so the angles at D and B match, and DE is parallel to BC.",
    "三角形 ABC，D 在 AB 上，E 在 AC 上，按比例分两边：两个三角形共用 A 处的角，所以 D 与 B 处的角相等，DE 平行于 BC。",
  ),
  "length-of-a-midsegment": drawing(
    [...cutMarks(half), side(half.b, half.c, "18"), side(half.d, half.e, "9"), ...midTicks()],
    "Triangle ABC with D and E the midpoints of AB and AC: DE is parallel to BC and half as long, 9 against 18.",
    "三角形 ABC，D、E 是 AB、AC 的中点：DE 平行于 BC，长度是它的一半，9 对 18。",
  ),
  "the-midsegment-triangle": drawing(
    (() => {
      const [a, b, c] = fromSides(16, 14, 10);
      const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const [m, n, l] = [mid(a, b), mid(b, c), mid(c, a)];
      return [
        { kind: "polygon", points: [a, b, c] },
        { kind: "polygon", points: [m, n, l], tone: "result" },
        { kind: "side", a, b, text: "16" },
        { kind: "side", a: b, b: c, text: "14" },
        { kind: "side", a: c, b: a, text: "10" },
        note([(n[0] + l[0]) / 2, (n[1] + l[1]) / 2], "8", "n"),
        note([(m[0] + l[0]) / 2, (m[1] + l[1]) / 2], "7", "e"),
        note([(m[0] + n[0]) / 2, (m[1] + n[1]) / 2], "5", "w"),
      ] satisfies Mark[];
    })(),
    "A triangle with sides 10, 14 and 16. The triangle formed by the midpoints has sides 5, 7 and 8.",
    "边长为 10、14、16 的三角形。由中点构成的三角形边长是 5、7、8。",
  ),
  "angles-at-a-midsegment": drawing(
    [
      ...cutMarks(half),
      angle(half.b, half.c, half.a, "accent", "65°"),
      angle(half.d, half.a, half.e, "result", "65°"),
      angle(half.d, half.e, half.b, "action", "115°"),
    ],
    "Triangle ABC with midsegment DE. Angle B is 65°, so angle ADE is 65° and angle BDE is 115°.",
    "三角形 ABC，中位线 DE。角 B 是 65°，所以角 ADE 是 65°，角 BDE 是 115°。",
  ),
  "proving-the-theorem": drawing(
    [...cutMarks(half, false), ...midTicks(), angle(half.a, half.b, half.c, "accent")],
    "Triangle ABC with D and E the midpoints of AB and AC: the triangles ADE and ABC share the angle at A, with sides in the ratio 1 to 2.",
    "三角形 ABC，D、E 是 AB、AC 的中点：三角形 ADE 与 ABC 共用 A 处的角，夹边之比都是 1 比 2。",
  ),
  "proving-the-midpoint-theorem#proving-the-converse": drawing(
    [...cutMarks(half), { kind: "ticks", a: half.a, b: half.d, count: 1 }, { kind: "ticks", a: half.d, b: half.b, count: 1 }],
    "Triangle ABC with D the midpoint of AB and DE parallel to BC: E turns out to be the midpoint of AC.",
    "三角形 ABC，D 是 AB 的中点，DE 平行于 BC：E 正是 AC 的中点。",
  ),
  "dividing-sides-proportionally": drawing(
    [...cutMarks(ad), ...cutLengths(ad, "6", "4", "9", "EC")],
    "Triangle ABC with DE parallel to BC: AD = 6, DB = 4 and AE = 9, so EC follows from the same ratio.",
    "三角形 ABC，DE 平行于 BC：AD = 6，DB = 4，AE = 9，EC 由相同的比得出。",
  ),
  "proportionality-with-algebra": drawing(
    [...cutMarks(cut23), ...cutLengths(cut23, "4", "6", "x + 2", "9")],
    "Triangle ABC with DE parallel to BC: AD = 4, DB = 6, AE = x + 2 and EC = 9.",
    "三角形 ABC，DE 平行于 BC：AD = 4，DB = 6，AE = x + 2，EC = 9。",
  ),
  "the-triangle-proportionality-theorem#the-converse": drawing(
    [...cutMarks(ad5, false), ...cutLengths(ad5, "5", "3", "10", "6")],
    "Triangle ABC with D on AB and E on AC: AD = 5, DB = 3, AE = 10 and EC = 6. Both ratios are 5/3, so DE is parallel to BC.",
    "三角形 ABC，D 在 AB 上，E 在 AC 上：AD = 5，DB = 3，AE = 10，EC = 6。两个比都是 5/3，所以 DE 平行于 BC。",
  ),
} satisfies Record<string, Figure>;

/** midTicks marks D and E as midpoints in a triangle cut at one half. */
function midTicks(): Mark[] {
  return [
    { kind: "ticks", a: half.a, b: half.d, count: 1 },
    { kind: "ticks", a: half.d, b: half.b, count: 1 },
    { kind: "ticks", a: half.a, b: half.e, count: 2 },
    { kind: "ticks", a: half.e, b: half.c, count: 2 },
  ];
}

/** cutLengths writes the lengths of the four pieces of a cut triangle's sides. */
function cutLengths(k: ReturnType<typeof cutTriangle>, ad: string, db: string, ae: string, ec: string): Mark[] {
  const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  return [note(mid(k.a, k.d), ad, "w"), note(mid(k.d, k.b), db, "w"), note(mid(k.a, k.e), ae, "e"), note(mid(k.e, k.c), ec, "e")];
}
