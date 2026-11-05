// Drawings in the explanations of Geometry's circles: parts, arcs, sectors, theorems and circles in the plane.

import type { Figure } from "@ga/content";
import type { Compass, Mark, PlaneMark, Point } from "@ga/subject-math";

import { angle, bend, dotAt, drawing, graphed, name, note, on, ring, seg, square, wedge } from "./explanation-drawings-kit.ts";

const O: Point = [0, 0];
const R = 3;

/** at is the point of the unit drawing's circle at an angle in degrees. */
const at = (deg: number): Point => on(deg, R);

/** toward is the compass direction of an angle in degrees. */
function toward(deg: number): Compass {
  const names: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return names[Math.round((((deg % 360) + 360) % 360) / 45) % 8] as Compass;
}

/** arcNote writes a label just outside the circle at an angle in degrees. */
const arcNote = (deg: number, text: string): Mark => note(on(deg, R + 0.1), text, toward(deg));

/** pointAt names a point of the circle at an angle in degrees. */
const pointAt = (deg: number, text: string): Mark[] => dotAt(at(deg), text, toward(deg));

/** centerDot marks the center. */
const centerDot = (dir: Compass = "s"): Mark[] => dotAt(O, "O", dir);

/** spoke is a labeled radius at an angle in degrees. */
const spoke = (deg: number, text?: string, s?: "accent" | "action" | "result"): Mark[] => [
  seg(O, at(deg), s),
  ...(text ? [note(on(deg, R / 2), text, toward(deg + 90))] : []),
];

/** sector draws a circle with radii at two angles and the arc between them marked, counterclockwise. */
function sector(
  a: number,
  b: number,
  o: { readonly shade?: boolean; readonly angle?: string; readonly arc?: string; readonly radius?: string; readonly major?: boolean },
): Mark[] {
  const mid = a + ((((b - a) % 360) + 360) % 360) / 2;
  return [
    ...(o.shade ? [wedge(a, b, R, O, "result")] : []),
    ring(R),
    ...bend(a, b, R, O, o.shade ? "result" : "accent"),
    ...spoke(a),
    ...(o.radius ? [note(on(a, R / 2), o.radius, toward(a - 90))] : []),
    ...spoke(b),
    ...centerDot(toward(mid + 180)),
    ...(o.angle ? [note(on(mid, 0.75), o.angle, toward(mid))] : []),
    ...(o.arc ? [arcNote(mid, o.arc)] : []),
  ];
}

/** circleSketch makes a figure from a sector. */
const circleWith = (a: number, b: number, o: Parameters<typeof sector>[2], en: string, zh: string): Figure =>
  drawing(sector(a, b, o), en, zh);

const square10: Point[] = [
  [-3, -3],
  [3, -3],
  [3, 3],
  [-3, 3],
];
const disk = Array.from({ length: 96 }, (_, i) => on(i * 3.75, 3));
const inner: Point[] = [at(45), at(135), at(225), at(315)];

/** partsDrawings are the explanation drawings of parts of circles, arcs and sectors. */
export const partsDrawings = {
  "radius-and-diameter": drawing(
    [
      ring(R),
      seg(at(180), at(0), "action"),
      ...spoke(90, undefined, "accent"),
      ...centerDot("sw"),
      note(on(90, 1.5), "7 cm", "e"),
      note([1.5, 0], "14 cm", "s"),
    ],
    "A circle with center O, a radius of 7 cm and a diameter of 14 cm, twice the radius.",
    "圆心为 O 的圆，半径 7 cm，直径 14 cm，是半径的两倍。",
  ),
  "parts-of-a-circle": drawing(
    [
      ring(R),
      seg(at(180), at(0), "action"),
      ...spoke(70, undefined, "accent"),
      seg(at(215), at(320), "result"),
      ...centerDot("sw"),
      ...pointAt(70, "R"),
      ...pointAt(180, "D"),
      ...pointAt(0, "E"),
      ...pointAt(215, "A"),
      ...pointAt(320, "B"),
    ],
    "A circle with center O: OR is a radius, DE through the center is a diameter, and AB, not through the center, is a chord.",
    "圆心为 O 的圆：OR 是半径，过圆心的 DE 是直径，不过圆心的 AB 是弦。",
  ),
  "circles#inside-on-or-outside": drawing(
    [
      ring(R),
      ...spoke(120, "10 cm", "accent"),
      seg(O, on(0, 3.6), "action"),
      ...centerDot("sw"),
      ...dotAt(on(0, 3.6), "P", "e", "action"),
      note([1.8, 0], "12 cm", "s"),
    ],
    "A circle of radius 10 cm with center O, and a point P 12 cm from O: farther than the radius, so outside.",
    "圆心为 O、半径 10 cm 的圆，点 P 距 O 为 12 cm：比半径远，所以在圆外。",
  ),
  "classifying-arcs": drawing(
    [
      ring(R),
      ...bend(30, 120, R, O, "accent"),
      ...bend(120, 30, R, O, "result"),
      ...pointAt(30, "A"),
      ...pointAt(120, "B"),
      ...pointAt(260, "X"),
    ],
    "Points A and B split a circle into the shorter minor arc AB and the longer major arc AXB.",
    "点 A 和 B 把圆分成较短的劣弧 AB 和较长的优弧 AXB。",
  ),
  "measures-of-arcs": drawing(
    [
      ring(R),
      ...bend(55, 125, R, O, "accent"),
      ...bend(125, 55, R, O, "result"),
      ...pointAt(55, "A"),
      ...pointAt(125, "B"),
      ...pointAt(270, "C"),
      arcNote(90, "70°"),
      note([0, 0], "290°", "s"),
    ],
    "Minor arc AB measures 70° and major arc ACB measures 290°; together they make 360°.",
    "劣弧 AB 是 70°，优弧 ACB 是 290°；合起来是 360°。",
  ),
  "sectors-and-segments": drawing(
    [
      wedge(30, 110, R, O, "result"),
      ring(R),
      ...spoke(30),
      ...spoke(110),
      { kind: "shade", points: Array.from({ length: 21 }, (_, i) => on(30 + 4 * i, R, [8, 0])), tone: "action" },
      ring(R, [8, 0]),
      seg(on(30, R, [8, 0]), on(110, R, [8, 0]), "action"),
    ],
    "Left: a sector, bounded by two radii and an arc. Right: a segment of a circle, bounded by a chord and an arc.",
    "左：扇形，由两条半径和一段弧围成。右：弓形，由一条弦和一段弧围成。",
  ),
  "circumference-in-terms-of-pi": drawing(
    [ring(R, O, "accent"), ...spoke(40, "7 cm"), ...centerDot("sw"), arcNote(250, "C = 14π cm")],
    "A circle of radius 7 cm: the distance around it is 14π cm.",
    "半径 7 cm 的圆：绕一周的长度是 14π cm。",
  ),
  "approximating-circumference": drawing(
    [ring(R, O, "accent"), seg(at(180), at(0), "action"), note([0, 0], "12 m", "n"), arcNote(270, "C ≈ 37.68 m")],
    "A circle of diameter 12 m: the distance around it is about 37.68 m.",
    "直径 12 m 的圆：绕一周的长度约为 37.68 m。",
  ),
  "radius-from-circumference": drawing(
    [ring(R, O, "accent"), seg(at(180), at(0), "action"), ...spoke(90, "9 cm"), note([0, 0], "18 cm", "s"), arcNote(270, "C = 18π cm")],
    "A circle of circumference 18π cm has diameter 18 cm and radius 9 cm.",
    "周长 18π cm 的圆，直径 18 cm，半径 9 cm。",
  ),
  "area-from-the-radius": drawing(
    [{ kind: "shade", points: disk, tone: "result" }, ring(R), ...spoke(30, "6 cm"), ...centerDot("sw"), arcNote(270, "A = 36π cm²")],
    "A circle of radius 6 cm with its inside shaded: its area is 36π square centimeters.",
    "半径 6 cm 的圆，内部涂色：面积是 36π 平方厘米。",
  ),
  "central-angles": drawing(
    [
      ...sector(50, 125, { angle: "75°", arc: "75°" }),
      ...pointAt(50, "A"),
      ...pointAt(125, "B"),
      ...pointAt(270, "C"),
      note(on(270, 1.5), "285°", "n"),
    ],
    "Central angle AOB of 75° cuts off minor arc AB of 75°; major arc ACB measures 285°.",
    "圆心角 AOB 为 75°，所对的劣弧 AB 是 75°；优弧 ACB 是 285°。",
  ),
  "adding-arcs": drawing(
    [
      ring(R),
      ...bend(240, 340, R, O, "accent"),
      ...bend(340, 120, R, O, "action"),
      ...bend(120, 240, R, O, "result"),
      ...spoke(240),
      ...spoke(340),
      ...spoke(120),
      ...centerDot("w"),
      ...pointAt(240, "A"),
      ...pointAt(340, "B"),
      ...pointAt(120, "C"),
      note(on(290, 0.7), "100°", "se"),
      note(on(50, 0.7), "140°", "ne"),
      note(on(180, 0.7), "120°", "w"),
    ],
    "Radii OA, OB and OC make central angles of 100° and 140°, leaving 120° for arc CA.",
    "半径 OA、OB、OC 构成 100° 和 140° 的圆心角，弧 CA 剩下 120°。",
  ),
  "central-angles-with-algebra": drawing(
    [
      ring(R),
      ...spoke(90),
      ...spoke(180),
      ...spoke(300),
      note(on(135, 0.6), "(2x + 10)°", "nw"),
      note(on(240, 0.6), "(3x)°", "sw"),
      note(on(15, 0.6), "(5x − 50)°", "e"),
    ],
    "Three radii split a circle into central angles of (2x + 10)°, (3x)° and (5x − 50)°, which add up to 360°.",
    "三条半径把圆分成 (2x + 10)°、(3x)° 和 (5x − 50)° 的圆心角，它们的和是 360°。",
  ),
  "arc-length": circleWith(
    30,
    110,
    { angle: "80°", arc: "4π cm", radius: "9 cm" },
    "In a circle of radius 9 cm, an arc of 80° has length 4π cm.",
    "半径 9 cm 的圆中，80° 的弧长是 4π cm。",
  ),
  "major-arc-length": circleWith(
    150,
    30,
    { angle: "240°", arc: "8π m", radius: "6 m" },
    "In a circle of radius 6 m, the major arc of 240° has length 8π m; the minor angle is 120°.",
    "半径 6 m 的圆中，240° 的优弧长 8π m；较小的角是 120°。",
  ),
  "radius-or-angle-from-arc-length": circleWith(
    40,
    100,
    { angle: "60°", arc: "5π cm", radius: "15 cm" },
    "An arc of 60° with length 5π cm lies on a circle of radius 15 cm.",
    "60° 的弧长 5π cm，所在圆的半径是 15 cm。",
  ),
  "sector-area": circleWith(
    30,
    70,
    { shade: true, angle: "40°", radius: "6 cm" },
    "A sector of 40° in a circle of radius 6 cm, shaded: one ninth of the disk, 4π square centimeters.",
    "半径 6 cm 的圆中 40° 的扇形（涂色）：整个圆面的九分之一，4π 平方厘米。",
  ),
  "major-sector-area": circleWith(
    150,
    30,
    { shade: true, angle: "240°", radius: "3 m" },
    "A major sector of 240° in a circle of radius 3 m, shaded; the minor angle is 120°.",
    "半径 3 m 的圆中 240° 的优扇形（涂色）；较小的角是 120°。",
  ),
  "approximating-sector-area": circleWith(
    20,
    92,
    { shade: true, angle: "72°", radius: "10 cm" },
    "A sector of 72° in a circle of radius 10 cm, shaded: one fifth of the disk.",
    "半径 10 cm 的圆中 72° 的扇形（涂色）：整个圆面的五分之一。",
  ),
  "angle-from-sector-area": circleWith(
    30,
    130,
    { shade: true, angle: "100°", radius: "6 cm" },
    "A sector of area 10π square centimeters in a circle of radius 6 cm has an angle of 100°.",
    "半径 6 cm 的圆中面积 10π 平方厘米的扇形，圆心角是 100°。",
  ),
  "radius-from-sector-area": circleWith(
    0,
    90,
    { shade: true, angle: "90°", radius: "8 m" },
    "A sector of 90° with area 16π square meters has radius 8 m.",
    "90° 的扇形面积是 16π 平方米，半径是 8 m。",
  ),
  "sector-area-from-arc-length": circleWith(
    30,
    150,
    { shade: true, arc: "4π cm", radius: "6 cm" },
    "A sector of a circle of radius 6 cm with arc length 4π cm.",
    "半径 6 cm 的圆中弧长 4π cm 的扇形。",
  ),
  "perimeter-of-a-sector": circleWith(
    0,
    90,
    { arc: "4π cm", radius: "8 cm", angle: "90°" },
    "A sector of 90° in a circle of radius 8 cm: its boundary is two radii of 8 cm and an arc of 4π cm.",
    "半径 8 cm 的圆中 90° 的扇形：边界是两条 8 cm 的半径和一段 4π cm 的弧。",
  ),
  "area-of-a-ring": drawing(
    [
      { kind: "shade", points: disk, holes: [Array.from({ length: 96 }, (_, i) => on(i * 3.75, 1.8))], tone: "result" },
      ring(R),
      ring(1.8),
      seg(O, at(30), "accent"),
      seg(O, on(150, 1.8), "action"),
      note(on(30, 2.4), "5 cm", "n"),
      note(on(150, 1), "3 cm", "s"),
    ],
    "A ring between circles of radii 5 cm and 3 cm with the same center, shaded.",
    "半径 5 cm 和 3 cm 的同心圆之间的圆环，已涂色。",
  ),
  "area-of-shapes-with-semicircles": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [10, 0],
          [10, 6],
          [0, 6],
        ],
      },
      ...bend(270, 90, 3, [10, 3], "result"),
      note([5, 0], "10 cm", "s"),
      note([0, 3], "6 cm", "w"),
      seg([10, 3], [13, 3], "action"),
      note([11.5, 3], "3", "n"),
    ],
    "A 10 cm by 6 cm rectangle with a semicircle on a side of 6 cm, whose radius is 3 cm.",
    "10 cm × 6 cm 的长方形，在 6 cm 的边上有一个半圆，半径 3 cm。",
  ),
  "perimeter-of-shapes-with-semicircles": drawing(
    [
      seg([0, 0], [10, 0], "accent"),
      seg([0, 6], [10, 6], "accent"),
      seg([0, 0], [0, 6], "accent"),
      seg([10, 0], [10, 6], undefined, true),
      ...bend(270, 90, 3, [10, 3], "result"),
      note([5, 0], "10", "s"),
      note([5, 6], "10", "n"),
      note([0, 3], "6", "w"),
      note([13, 3], "3π", "e"),
    ],
    "A 10 cm by 6 cm rectangle with a semicircle on a side of 6 cm. The boundary is 10, 6, 10 and an arc of 3π; the dashed side is inside and does not count.",
    "10 cm × 6 cm 的长方形，在 6 cm 的边上有一个半圆。边界由 10、6、10 和长 3π 的弧组成；虚线那条边在内部，不计入。",
  ),
  "shaded-regions-with-quarter-circles": drawing(
    [
      {
        kind: "shade",
        points: [[6, 0], [6, 6], [0, 6], ...Array.from({ length: 23 }, (_, i): Point => on(90 - (i * 90) / 22, 6))],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [0, 0],
          [6, 0],
          [6, 6],
          [0, 6],
        ],
      },
      ...bend(0, 90, 6, O, "accent"),
      seg(O, on(45, 6), "action"),
      note(on(45, 3), "6", "nw"),
      note([3, 0], "6", "s"),
      note([0, 3], "6", "w"),
    ],
    "A square of side 6 cm with a quarter circle of radius 6 cm centered at a corner; the part of the square outside it is shaded.",
    "边长 6 cm 的正方形，以一个顶点为圆心画半径 6 cm 的四分之一圆；正方形在其外的部分已涂色。",
  ),
  "side-and-radius": drawing(
    [
      { kind: "polygon", points: square10 },
      ring(R, O, "accent"),
      ...spoke(45, "5", "action"),
      note([0, -3], "10", "s"),
      note([-3, 0], "10", "w"),
    ],
    "A circle of radius 5 cm inscribed in a square of side 10 cm: the diameter equals the side.",
    "半径 5 cm 的圆内切于边长 10 cm 的正方形：直径等于边长。",
  ),
  "area-of-an-inscribed-circle": drawing(
    [
      { kind: "shade", points: disk, tone: "result" },
      { kind: "polygon", points: square10 },
      ring(R),
      ...spoke(45, "4", "action"),
      note([0, -3], "8 m", "s"),
    ],
    "A square of side 8 m with its inscribed circle of radius 4 m, shaded.",
    "边长 8 m 的正方形及其内切圆（半径 4 m，已涂色）。",
  ),
  "between-the-square-and-the-circle": drawing(
    [
      { kind: "shade", points: square10, holes: [disk], tone: "result" },
      { kind: "polygon", points: square10 },
      ring(R),
      note([0, -3], "10 cm", "s"),
    ],
    "A square of side 10 cm and its inscribed circle; the four corners outside the circle are shaded.",
    "边长 10 cm 的正方形及其内切圆；圆外的四个角已涂色。",
  ),
  "area-of-an-inscribed-square": drawing(
    [
      ring(R),
      { kind: "polygon", points: inner, tone: "result" },
      seg(at(45), at(225), "accent"),
      seg(at(135), at(315), "accent"),
      square(O, at(45), at(135)),
      note(on(45, 1.5), "5", "nw"),
      note(on(135, 1.5), "5", "ne"),
    ],
    "A square inscribed in a circle of radius 5 cm: its diagonals are perpendicular diameters, cutting it into four right triangles with legs of 5 cm.",
    "内接于半径 5 cm 的圆的正方形：对角线是互相垂直的直径，把它分成四个直角边为 5 cm 的直角三角形。",
  ),
  "side-of-an-inscribed-square": drawing(
    [
      ring(R),
      { kind: "polygon", points: inner, tone: "result" },
      seg(O, at(45), "accent"),
      seg(O, at(315), "accent"),
      square(O, at(45), at(315)),
      note(on(45, 1.5), "6", "nw"),
      note(on(315, 1.5), "6", "sw"),
      note(on(0, 2.12), "6√2", "e"),
    ],
    "A square inscribed in a circle of radius 6 cm: two radii are the legs of a right triangle whose hypotenuse, a side of the square, is 6√2 cm.",
    "内接于半径 6 cm 的圆的正方形：两条半径是直角三角形的直角边，斜边即正方形的边，长 6√2 cm。",
  ),
  "between-the-circle-and-the-square": drawing(
    [
      { kind: "shade", points: disk, holes: [inner], tone: "result" },
      ring(R),
      { kind: "polygon", points: inner },
      ...spoke(90, "4 cm", "accent"),
    ],
    "A circle of radius 4 cm with its inscribed square; the part of the circle outside the square is shaded.",
    "半径 4 cm 的圆及其内接正方形；圆在正方形外的部分已涂色。",
  ),
} satisfies Record<string, Figure>;

/** radianDrawings are the explanation drawings of radians. */
export const radianDrawings = {
  "radian-measure-from-arc-length": circleWith(
    20,
    20 + (12 / 5) * (180 / Math.PI),
    { arc: "12 cm", radius: "5 cm", angle: "2.4" },
    "An arc of length 12 cm on a circle of radius 5 cm: its central angle measures 2.4 radians.",
    "半径 5 cm 的圆上长 12 cm 的弧：圆心角是 2.4 弧度。",
  ),
  "arc-length-with-radians": circleWith(
    30,
    150,
    { arc: "6π cm", radius: "9 cm", angle: "2π/3" },
    "In a circle of radius 9 cm, a central angle of 2π/3 cuts off an arc of length 6π cm.",
    "半径 9 cm 的圆中，2π/3 的圆心角所对的弧长是 6π cm。",
  ),
  "arc-length-with-decimal-radians": circleWith(
    20,
    20 + 1.5 * (180 / Math.PI),
    { arc: "12 m", radius: "8 m", angle: "1.5" },
    "In a circle of radius 8 m, a central angle of 1.5 radians cuts off an arc of 12 m.",
    "半径 8 m 的圆中，1.5 弧度的圆心角所对的弧长是 12 m。",
  ),
  "radius-or-angle-from-arc-length-in-radians": circleWith(
    20,
    155,
    { arc: "6π cm", radius: "8 cm", angle: "3π/4" },
    "An arc of 3π/4 radians with length 6π cm lies on a circle of radius 8 cm.",
    "3π/4 弧度的弧长 6π cm，所在圆的半径是 8 cm。",
  ),
  "sector-area-with-radians": circleWith(
    20,
    80,
    { shade: true, angle: "π/3", radius: "6 cm" },
    "A sector of π/3 radians in a circle of radius 6 cm, shaded: its area is 6π square centimeters.",
    "半径 6 cm 的圆中 π/3 弧度的扇形（涂色）：面积是 6π 平方厘米。",
  ),
  "sector-area-from-decimal-angle-or-arc-length": circleWith(
    20,
    20 + 0.8 * (180 / Math.PI),
    { shade: true, angle: "0.8", radius: "5 m" },
    "A sector of 0.8 radians in a circle of radius 5 m, shaded: its area is 10 square meters.",
    "半径 5 m 的圆中 0.8 弧度的扇形（涂色）：面积是 10 平方米。",
  ),
  "radius-or-angle-from-sector-area": circleWith(
    20,
    65,
    { shade: true, angle: "π/4", radius: "8 cm" },
    "A sector of π/4 radians with area 8π square centimeters has radius 8 cm.",
    "π/4 弧度、面积 8π 平方厘米的扇形，半径是 8 cm。",
  ),
} satisfies Record<string, Figure>;

/** inscribed draws points on a circle joined into an inscribed angle at C over arc AB. */
function inscribed(
  aDeg: number,
  bDeg: number,
  cDeg: number,
  labels: { readonly c?: string; readonly arc?: string; readonly center?: string },
): Mark[] {
  const [a, b, c] = [at(aDeg), at(bDeg), at(cDeg)];
  const mid = aDeg + ((((bDeg - aDeg) % 360) + 360) % 360) / 2;
  return [
    ring(R),
    ...bend(aDeg, bDeg, R, O, "accent"),
    seg(c, a, "action"),
    seg(c, b, "action"),
    angle(c, a, b, "action", labels.c),
    ...pointAt(aDeg, "A"),
    ...pointAt(bDeg, "B"),
    ...pointAt(cDeg, "C"),
    ...(labels.arc ? [arcNote(mid, labels.arc)] : []),
    ...(labels.center
      ? [seg(O, a, "result"), seg(O, b, "result"), angle(O, a, b, "result", labels.center), ...dotAt(O, "O", "n", "result")]
      : []),
  ];
}

/** semicircle draws a triangle inscribed on diameter AB with C at an angle in degrees. */
function semicircle(cDeg: number, extra: readonly Mark[] = []): Mark[] {
  const [a, b, c] = [at(180), at(0), at(cDeg)];
  return [
    ring(R),
    { kind: "polygon", points: [a, b, c] },
    square(c, a, b),
    ...pointAt(180, "A"),
    ...pointAt(0, "B"),
    ...pointAt(cDeg, "C"),
    ...extra,
  ];
}

/** tangents draws a circle, center O, and the tangent segments from P at distance d, touching at A and B. */
function tangents(half: number): { readonly marks: Mark[]; readonly a: Point; readonly b: Point; readonly p: Point } {
  const a = at(half);
  const b = at(-half);
  const p: Point = [R / Math.cos((half * Math.PI) / 180), 0];
  return {
    a,
    b,
    p,
    marks: [
      ring(R),
      seg(p, a, "accent"),
      seg(p, b, "accent"),
      seg(O, a),
      seg(O, b),
      square(a, O, p),
      square(b, O, p),
      ...centerDot("w"),
      name(a, "A", "n"),
      name(b, "B", "s"),
      name(p, "P", "e"),
    ],
  };
}

const t65 = tangents(65);
const t58 = tangents(58);
const t50 = tangents(50);

/** tangentPoint is P on the tangent at A from circle R, for a right triangle OAP with legs in the given ratio. */
function rightAtTangent(ratio: number, labels: { readonly oa: string; readonly pa: string; readonly op: string }): Mark[] {
  const a = at(90);
  const p: Point = [R * ratio, R];
  return [
    ring(R),
    seg(a, p, "accent"),
    seg(O, a, "action"),
    seg(O, p, "result"),
    square(a, O, p),
    ...centerDot("sw"),
    name(a, "A", "n"),
    name(p, "P", "e"),
    note([0, 1.5], labels.oa, "w"),
    note([p[0] / 2, R], labels.pa, "n"),
    note([p[0] / 2, R / 2], labels.op, "se"),
  ];
}

/** theoremDrawings are the explanation drawings of the circle theorems. */
export const theoremDrawings = {
  "inscribed-angle-from-the-arc": drawing(
    inscribed(215, 325, 95, { c: "55°", arc: "110°", center: "110°" }),
    "Inscribed angle ACB of 55° and central angle AOB of 110° on the same arc AB of 110°.",
    "同一段 110° 的弧 AB 上，圆周角 ACB 是 55°，圆心角 AOB 是 110°。",
  ),
  "intercepted-arc-from-the-angle": drawing(
    inscribed(232, 308, 95, { c: "38°", arc: "76°", center: "76°" }),
    "Inscribed angle ACB of 38° intercepts an arc of 76°, and the central angle on it is 76° too.",
    "38° 的圆周角 ACB 所对的弧是 76°，这段弧上的圆心角也是 76°。",
  ),
  "inscribed-angles-on-the-same-arc": drawing(
    [
      ring(R),
      ...bend(210, 330, R, O, "accent"),
      seg(at(60), at(210), "action"),
      seg(at(60), at(330), "action"),
      seg(at(135), at(210), "result"),
      seg(at(135), at(330), "result"),
      angle(at(60), at(210), at(330), "action", "(3x − 15)°"),
      angle(at(135), at(210), at(330), "result", "(2x + 10)°"),
      ...pointAt(210, "A"),
      ...pointAt(330, "B"),
      ...pointAt(135, "C"),
      ...pointAt(60, "D"),
    ],
    "Inscribed angles ACB, (2x + 10)°, and ADB, (3x − 15)°, intercept the same arc AB, so they are equal.",
    "圆周角 ACB（(2x + 10)°）和 ADB（(3x − 15)°）对同一段弧 AB，所以相等。",
  ),
  "angles-of-an-inscribed-triangle": drawing(
    (() => {
      const [a, b, c] = [at(200), at(300), at(80)];
      return [
        ring(R),
        { kind: "polygon", points: [a, b, c] },
        ...pointAt(200, "A"),
        ...pointAt(300, "B"),
        ...pointAt(80, "C"),
        arcNote(250, "100°"),
        arcNote(10, "140°"),
        arcNote(140, "120°"),
        angle(c, a, b, "accent", "50°"),
        angle(a, b, c, "action", "70°"),
        angle(b, c, a, "result", "60°"),
      ] satisfies Mark[];
    })(),
    "Triangle ABC inscribed in a circle with arcs of 100°, 140° and 120°. Each angle is half the arc opposite it: 50° at C, 70° at A, 60° at B.",
    "内接于圆的三角形 ABC，弧分别是 100°、140°、120°。每个角是对弧的一半：C 处 50°，A 处 70°，B 处 60°。",
  ),
  "inscribed-angles-with-algebra": drawing(
    inscribed(238, 302, 95, { c: "(x + 12)°", arc: "(3x + 4)°" }),
    "Inscribed angle ACB of (x + 12)° on arc AB of (3x + 4)°: the arc is twice the angle.",
    "圆周角 ACB 是 (x + 12)°，所对的弧 AB 是 (3x + 4)°：弧是角的两倍。",
  ),
  "inscribed-angles-and-radii": drawing(
    [...inscribed(235, 305, 95, { c: "35°", center: "70°" }), seg(at(235), at(305)), note(at(235), "55°", "e"), note(at(305), "55°", "w")],
    "Inscribed angle ACB of 35°, central angle AOB of 70°, and base angles of 55° in the isosceles triangle AOB.",
    "圆周角 ACB 是 35°，圆心角 AOB 是 70°，等腰三角形 AOB 的底角是 55°。",
  ),
  "angles-in-a-semicircle": drawing(
    semicircle(56, [angle(at(180), at(0), at(56), "accent", "28°"), angle(at(0), at(56), at(180), "action", "62°")]),
    "Triangle ABC on the diameter AB, with a right angle at C, 28° at A and 62° at B.",
    "直径 AB 上的三角形 ABC，C 处是直角，A 处 28°，B 处 62°。",
  ),
  "the-converse-of-thales-theorem": drawing(
    semicircle(70, [angle(at(180), at(0), at(70), "accent", "35°"), angle(at(0), at(70), at(180), "action", "55°")]),
    "Triangle ABC inscribed in a circle with angles of 35° at A and 55° at B, so the angle at C is 90° and AB is a diameter.",
    "内接于圆的三角形 ABC，A 处 35°，B 处 55°，所以 C 处是 90°，AB 是直径。",
  ),
  "the-hypotenuse-is-a-diameter": drawing(
    (() => {
      const cDeg = (2 * (Math.atan(8 / 6) * 180)) / Math.PI;
      const c = at(cDeg);
      return semicircle(cDeg, [
        note([(at(180)[0] + c[0]) / 2, c[1] / 2], "6", "nw"),
        note([(at(0)[0] + c[0]) / 2, c[1] / 2], "8", "ne"),
        ...centerDot("s"),
        note([1.5, 0], "5", "s"),
      ]);
    })(),
    "A right triangle with legs 6 cm and 8 cm inscribed in a circle: its hypotenuse of 10 cm is a diameter, so the radius is 5 cm.",
    "直角边 6 cm 和 8 cm 的直角三角形内接于圆：10 cm 的斜边是直径，所以半径是 5 cm。",
  ),
  "acute-angles-with-algebra": drawing(
    semicircle(108, [
      angle(at(180), at(0), at(108), "accent"),
      angle(at(0), at(108), at(180), "action"),
      note([-1.7, 0], "(2x + 4)°", "s"),
      note([1.7, 0], "(x + 11)°", "s"),
    ]),
    "Triangle ABC on the diameter AB. Angles at A and B of (2x + 4)° and (x + 11)° add up to 90°.",
    "直径 AB 上的三角形 ABC。A、B 处的角 (2x + 4)° 和 (x + 11)° 的和是 90°。",
  ),
  "arcs-from-angles": drawing(
    semicircle(50, [angle(at(180), at(0), at(50), "accent", "25°"), arcNote(25, "50°"), arcNote(115, "130°")]),
    "Triangle ABC on the diameter AB, with 25° at A: arc BC is 50° and arc AC is 130°.",
    "直径 AB 上的三角形 ABC，A 处 25°：弧 BC 是 50°，弧 AC 是 130°。",
  ),
  "angles-from-arcs": drawing(
    semicircle(110, [
      arcNote(145, "70°"),
      arcNote(55, "110°"),
      angle(at(0), at(110), at(180), "accent", "35°"),
      angle(at(180), at(0), at(110), "action", "55°"),
    ]),
    "Triangle ABC on the diameter AB with arc AC of 70°: the angle at B is 35° and the angle at A is 55°.",
    "直径 AB 上的三角形 ABC，弧 AC 是 70°：B 处 35°，A 处 55°。",
  ),
  "angles-at-the-radius": drawing(
    semicircle(64, [
      seg(O, at(64), "action"),
      ...centerDot("s"),
      angle(at(180), at(0), at(64), "accent", "32°"),
      angle(O, at(64), at(180), "result", "116°"),
      angle(O, at(0), at(64), "action", "64°"),
    ]),
    "Triangle ABC on the diameter AB, with the radius OC. Angle A is 32°, angle AOC is 116° and angle BOC is 64°.",
    "直径 AB 上的三角形 ABC，以及半径 OC。角 A 是 32°，角 AOC 是 116°，角 BOC 是 64°。",
  ),
  "the-radius-is-half-the-hypotenuse": drawing(
    semicircle(70, [seg(O, at(70), "action"), ...centerDot("s"), note(on(70, 1.5), "2x + 1", "e"), note([-1.5, 0], "5x − 4", "s")]),
    "Triangle ABC on the diameter AB of length 5x − 4; the segment OC of length 2x + 1 is a radius, half of AB.",
    "直径 AB（长 5x − 4）上的三角形 ABC；线段 OC（长 2x + 1）是半径，是 AB 的一半。",
  ),
  "radius-angles-with-algebra": drawing(
    semicircle(46, [
      seg(O, at(46), "action"),
      ...centerDot("s"),
      angle(at(46), at(180), O, "accent", "(x + 9)°"),
      angle(O, at(0), at(46), "result", "(3x + 4)°"),
    ]),
    "Triangle ABC on the diameter AB, with the radius OC: angle ACO is (x + 9)° and angle BOC, an exterior angle of triangle AOC, is (3x + 4)°.",
    "直径 AB 上的三角形 ABC，以及半径 OC：角 ACO 是 (x + 9)°，角 BOC 是三角形 AOC 的外角，为 (3x + 4)°。",
  ),
  "opposite-angles-are-supplementary": drawing(
    quadrilateral(
      [200, 280, 352, 100],
      [
        [1, "accent", "104°"],
        [3, "accent", "76°"],
      ],
    ),
    "Quadrilateral ABCD inscribed in a circle: angle B of 104° and the opposite angle D of 76° add up to 180°.",
    "内接于圆的四边形 ABCD：角 B（104°）与对角 D（76°）的和是 180°。",
  ),
  "inscribed-quadrilaterals-with-algebra": drawing(
    [
      ...quadrilateral(
        [215, 300, 30, 130],
        [
          [0, "accent"],
          [2, "action"],
        ],
      ),
      note(on(215, 2), "(3x + 5)°", "e"),
      note(on(30, 2), "(2x + 25)°", "w"),
    ],
    "Quadrilateral ABCD inscribed in a circle: opposite angles A of (3x + 5)° and C of (2x + 25)° add up to 180°.",
    "内接于圆的四边形 ABCD：对角 A（(3x + 5)°）和 C（(2x + 25)°）的和是 180°。",
  ),
  "angles-of-inscribed-quadrilaterals-from-arcs": drawing(
    (() => {
      const stops = [200, 280, 20, 130];
      const pts = stops.map(at);
      return [
        ring(R),
        { kind: "polygon", points: pts },
        ...pointAt(200, "A"),
        ...pointAt(280, "B"),
        ...pointAt(20, "C"),
        ...pointAt(130, "D"),
        arcNote(240, "80°"),
        arcNote(330, "100°"),
        arcNote(75, "110°"),
        arcNote(165, "70°"),
        angle(pts[0]!, pts[1]!, pts[3]!, "accent", "105°"),
        angle(pts[1]!, pts[2]!, pts[0]!, "action", "90°"),
      ] satisfies Mark[];
    })(),
    "Quadrilateral ABCD inscribed in a circle with arcs AB of 80°, BC of 100°, CD of 110° and DA of 70°: angle A is 105° and angle B is 90°.",
    "内接于圆的四边形 ABCD，弧 AB 80°，BC 100°，CD 110°，DA 70°：角 A 是 105°，角 B 是 90°。",
  ),
  "tangents-are-perpendicular-to-radii": drawing(
    (() => {
      const a = at(52);
      const p: Point = [R / Math.cos((52 * Math.PI) / 180), 0];
      return [
        ring(R),
        seg(a, p, "accent"),
        seg(O, a),
        seg(O, p),
        square(a, O, p),
        angle(O, p, a, "action", "52°"),
        angle(p, a, O, "result", "38°"),
        ...centerDot("w"),
        name(a, "A", "n"),
        name(p, "P", "e"),
      ] satisfies Mark[];
    })(),
    "Tangent PA touching circle O at A, with a right angle at A: angle AOP is 52° and angle APO is 38°.",
    "PA 切圆 O 于 A，A 处是直角：角 AOP 是 52°，角 APO 是 38°。",
  ),
  "lengths-with-tangents": drawing(
    rightAtTangent(12 / 5, { oa: "5", pa: "12", op: "13" }),
    "Tangent PA with radius OA = 5 cm, PA = 12 cm and OP = 13 cm: a right triangle with its right angle at A.",
    "切线 PA，半径 OA = 5 cm，PA = 12 cm，OP = 13 cm：直角在 A 的直角三角形。",
  ),
  "testing-for-tangency": drawing(
    rightAtTangent(15 / 8, { oa: "8", pa: "15", op: "17" }),
    "With OA = 8, PA = 15 and OP = 17, the sides fit the Pythagorean theorem, so the angle at A is right and PA is tangent.",
    "OA = 8，PA = 15，OP = 17 满足勾股定理，所以 A 处是直角，PA 是切线。",
  ),
  "tangent-segments-are-equal": drawing(
    [
      ...t58.marks,
      note([(t58.a[0] + t58.p[0]) / 2, (t58.a[1] + t58.p[1]) / 2], "3x − 4", "ne"),
      note([(t58.b[0] + t58.p[0]) / 2, (t58.b[1] + t58.p[1]) / 2], "x + 10", "se"),
    ],
    "Two tangents from P touch the circle at A and B: PA of length 3x − 4 equals PB of length x + 10.",
    "从 P 引的两条切线切圆于 A 和 B：PA（长 3x − 4）等于 PB（长 x + 10）。",
  ),
  "the-angle-between-two-tangents": drawing(
    [...t65.marks, angle(O, t65.b, t65.a, "result", "130°"), angle(t65.p, t65.a, t65.b, "action", "50°")],
    "Tangents from P touch at A and B. The central angle AOB of 130° and the angle APB of 50° add up to 180°.",
    "从 P 引的切线切于 A 和 B。圆心角 AOB（130°）与角 APB（50°）的和是 180°。",
  ),
  "the-line-to-the-center": drawing(
    [
      ...t58.marks,
      seg(O, t58.p, "result"),
      angle(t58.p, t58.a, O, "action", "32°"),
      angle(t58.p, O, t58.b, "action", "32°"),
      angle(O, t58.p, t58.a, "accent", "58°"),
    ],
    "Tangents from P with the segment OP, which bisects the 64° at P into two angles of 32°; angle AOP is 58°.",
    "从 P 引的切线及线段 OP，OP 把 P 处的 64° 平分成两个 32°；角 AOP 是 58°。",
  ),
  "chords-intersecting-inside": drawing(
    (() => {
      const [a, b, c, d] = [at(150), at(220), at(330), at(80)];
      const e = crossing(a, c, b, d);
      return [
        ring(R),
        seg(a, c, "action"),
        seg(b, d, "action"),
        ...bend(150, 220, R, O, "accent"),
        ...bend(330, 80, R, O, "result"),
        angle(e, a, b, "accent", "90°"),
        ...pointAt(150, "A"),
        ...pointAt(220, "B"),
        ...pointAt(330, "C"),
        ...pointAt(80, "D"),
        name(e, "E", "e"),
        arcNote(185, "70°"),
        arcNote(25, "110°"),
      ] satisfies Mark[];
    })(),
    "Chords AC and BD cross at E inside a circle. Arc AB is 70° and the vertical arc CD is 110°, so angle AEB is half their sum, 90°.",
    "弦 AC 和 BD 在圆内相交于 E。弧 AB 是 70°，对顶的弧 CD 是 110°，所以角 AEB 是它们和的一半，即 90°。",
  ),
  "secants-intersecting-outside": drawing(
    secants(40, 130, ["A", "C", "B", "D"], "45°", "40°", "130°"),
    "Secants from P cut the circle at A and B and at C and D. The far arc BD is 130° and the near arc AC is 40°, so angle P is half their difference, 45°.",
    "从 P 引的割线与圆交于 A、B 和 C、D。远弧 BD 是 130°，近弧 AC 是 40°，所以角 P 是它们差的一半，即 45°。",
  ),
  "finding-arcs-from-secant-angles": drawing(
    secants(50, 120, ["A", "C", "B", "D"], "35°", "50°", "120°"),
    "Secants from P with angle P of 35° and near arc of 50°: the far arc is 120°.",
    "从 P 引的割线，角 P 是 35°，近弧 50°：远弧是 120°。",
  ),
  "secant-and-tangent": drawing(
    secantTangent(60, 150, "45°"),
    "Tangent at T and a secant through A and B meet at P. The far arc BT is 150° and the near arc TA is 60°, so angle P is 45°.",
    "T 处的切线和过 A、B 的割线交于 P。远弧 BT 是 150°，近弧 TA 是 60°，所以角 P 是 45°。",
  ),
  "finding-arcs-from-secant-tangent-angles": drawing(
    secantTangent(80, 140, "30°"),
    "Tangent at T and a secant meet at P with angle P of 30° and far arc of 140°: the near arc is 80°.",
    "T 处的切线和割线交于 P，角 P 是 30°，远弧 140°：近弧是 80°。",
  ),
  "two-tangents-and-their-arcs": drawing(
    [
      ...t50.marks,
      ...bend(-50, 50, R, O, "result"),
      ...bend(50, -50, R, O, "action"),
      arcNote(180, "260°"),
      note(on(0, 1.5), "100°", "n"),
      angle(t50.p, t50.a, t50.b, "accent", "80°"),
    ],
    "Tangents from P touch at A and B. The minor arc is 100° and the major arc 260°, so angle APB is half their difference, 80°.",
    "从 P 引的切线切于 A 和 B。劣弧是 100°，优弧是 260°，所以角 APB 是它们差的一半，即 80°。",
  ),
  "the-angle-from-the-arc": drawing(
    tangentChord(124, "62°", "118°"),
    "Tangent ST at A and chord AB with arc AB of 124°: angle TAB is 62° and angle SAB is 118°.",
    "A 处的切线 ST 和弦 AB，弧 AB 是 124°：角 TAB 是 62°，角 SAB 是 118°。",
  ),
  "the-arc-from-the-angle": drawing(
    tangentChord(94, "47°"),
    "Tangent at A and chord AB: angle TAB of 47° intercepts an arc of 94°.",
    "A 处的切线和弦 AB：47° 的角 TAB 所对的弧是 94°。",
  ),
  "tangent-chord-and-inscribed-angles": drawing(
    (() => {
      const a = at(270);
      const b = at(270 + 104);
      const c = at(270 + 104 + 114);
      return [
        ring(R),
        seg([-4, -R], [4, -R], "action"),
        { kind: "polygon", points: [a, b, c] },
        angle(a, [4, -R], b, "accent", "52°"),
        angle(c, a, b, "accent", "52°"),
        angle(b, c, a, "action", "71°"),
        angle(a, b, c, "result", "57°"),
        name(a, "A", "s"),
        name(b, "B", "e"),
        name(c, "C", "nw"),
        name([4, -R], "T", "s"),
      ] satisfies Mark[];
    })(),
    "Tangent AT and triangle ABC inscribed in a circle: tangent-chord angle TAB and inscribed angle ACB are both 52°, angle ABC is 71° and angle BAC is 57°.",
    "切线 AT 和内接于圆的三角形 ABC：弦切角 TAB 与圆周角 ACB 都是 52°，角 ABC 是 71°，角 BAC 是 57°。",
  ),
} satisfies Record<string, Figure>;

/** quadrilateral draws ABCD inscribed in a circle with some of its angles marked. */
function quadrilateral(stops: readonly number[], marked: readonly (readonly [number, "accent" | "action" | "result", string?])[]): Mark[] {
  const pts = stops.map(at);
  return [
    ring(R),
    { kind: "polygon", points: pts },
    ...["A", "B", "C", "D"].flatMap((n, i) => pointAt(stops[i]!, n)),
    ...marked.map(([i, s, label]) => angle(pts[i]!, pts[(i + 1) % 4]!, pts[(i + 3) % 4]!, s, label)),
  ];
}

/** crossing is where segment ab meets segment cd. */
function crossing(a: Point, b: Point, c: Point, d: Point): Point {
  const [x1, y1, x2, y2] = [b[0] - a[0], b[1] - a[1], d[0] - c[0], d[1] - c[1]];
  const k = ((c[0] - a[0]) * y2 - (c[1] - a[1]) * x2) / (x1 * y2 - y1 * x2);
  return [a[0] + k * x1, a[1] + k * y1];
}

/** secants draws two secants from an outside point symmetric about the x axis, with a near and a far arc of the given degrees. */
function secants(
  near: number,
  far: number,
  names: readonly [string, string, string, string],
  label: string,
  nearText: string,
  farText: string,
): Mark[] {
  const [a, c, b, d] = [at(near / 2), at(-near / 2), at(180 - far / 2), at(180 + far / 2)];
  const p = crossing(a, b, c, d);
  return [
    ring(R),
    seg(p, b, "action"),
    seg(p, d, "action"),
    ...bend(-near / 2, near / 2, R, O, "result"),
    ...bend(180 - far / 2, 180 + far / 2, R, O, "accent"),
    angle(p, a, c, "action", label),
    name(a, names[0], "n"),
    name(c, names[1], "s"),
    name(b, names[2], "n"),
    name(d, names[3], "s"),
    name(p, "P", "e"),
    note(on(0, 1.5), nearText, "w"),
    arcNote(180, farText),
  ];
}

/** secantTangent draws a tangent at T and a secant through A and B meeting at P. */
function secantTangent(near: number, far: number, label: string): Mark[] {
  const tDeg = 90;
  const aDeg = tDeg - near;
  const bDeg = tDeg - near - (360 - near - far);
  const [t, a, b] = [at(tDeg), at(aDeg), at(bDeg)];
  const x = a[0] + ((R - a[1]) * (a[0] - b[0])) / (a[1] - b[1]);
  const p: Point = [x, R];
  return [
    ring(R),
    seg(t, p, "action"),
    seg(p, b, "action"),
    square(t, O, p),
    ...bend(aDeg, tDeg, R, O, "result"),
    ...bend(tDeg, tDeg + far, R, O, "accent"),
    angle(p, t, b, "accent", label),
    name(t, "T", "n"),
    name(a, "A", "ne"),
    name(b, "B", toward(bDeg)),
    name(p, "P", "e"),
    arcNote(tDeg - near / 2, `${near}°`),
    arcNote(tDeg + far / 2, `${far}°`),
  ];
}

/** tangentChord draws the tangent at A, at the bottom, and a chord AB with its arc. */
function tangentChord(arc: number, inside: string, other?: string): Mark[] {
  const a = at(270);
  const b = at(270 + arc);
  const t: Point = [4.5, -R];
  const s: Point = [-4.5, -R];
  return [
    ring(R),
    seg(s, t, "action"),
    seg(a, b, "accent"),
    ...bend(270, 270 + arc, R, O, "accent"),
    angle(a, t, b, "accent", inside),
    ...(other ? [angle(a, b, s, "result", other)] : []),
    arcNote(270 + arc / 2, `${arc}°`),
    name(a, "A", "s"),
    name(b, "B", toward(270 + arc)),
    name(t, "T", "s"),
    ...(other ? [name(s, "S", "s")] : []),
  ];
}

const view = (xMin: number, xMax: number, yMin: number, yMax: number) => ({
  xMin,
  xMax,
  yMin,
  yMax,
  step: 1,
  labelEvery: 2,
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

const circle = (center: Point, r: number): PlaneMark => ({ kind: "circle", center, r, accent: true });

/** planeCircleDrawings are the explanation drawings of circles in the coordinate plane. */
export const planeCircleDrawings = {
  "center-and-radius-from-a-graph": graphed(
    view(-3, 9, -4, 8),
    [
      circle([3, 2], 4),
      pt([3, 2], "(3, 2)", "n", "result"),
      pt([-1, 2], "(−1, 2)", "w"),
      pt([7, 2], "(7, 2)", "e"),
      { kind: "segment", a: [3, 2], b: [7, 2], tone: "action" },
    ],
    "A circle with leftmost point (−1, 2) and rightmost point (7, 2): its center is (3, 2) and its radius 4.",
    "最左点 (−1, 2)、最右点 (7, 2) 的圆：圆心是 (3, 2)，半径是 4。",
  ),
  "radius-from-the-center-and-a-point": graphed(
    view(-7, 9, -9, 7),
    [
      circle([1, -2], Math.sqrt(45)),
      pt([1, -2], "(1, −2)", "sw", "result"),
      pt([4, 4], "(4, 4)", "ne"),
      { kind: "segment", a: [1, -2], b: [4, -2], tone: "action" },
      { kind: "segment", a: [4, -2], b: [4, 4], tone: "action" },
      { kind: "segment", a: [1, -2], b: [4, 4], tone: "result" },
      { kind: "label", at: [2.5, -2], text: "3", dir: "s" },
      { kind: "label", at: [4, 1], text: "6", dir: "e" },
    ],
    "A circle with center (1, −2) through (4, 4): the radius is the hypotenuse of a right triangle with legs 3 and 6.",
    "圆心 (1, −2)、过 (4, 4) 的圆：半径是直角边为 3 和 6 的直角三角形的斜边。",
  ),
  "circles-in-the-coordinate-plane#inside-on-or-outside": graphed(
    view(-5, 9, -6, 8),
    [circle([2, 1], 5), pt([2, 1], "(2, 1)", "w", "result"), pt([6, 4], "(6, 4)", "nw"), pt([7, 3], "(7, 3)", "e", "action")],
    "The circle with center (2, 1) and radius 5: the point (6, 4) is on it and the point (7, 3) is outside.",
    "圆心 (2, 1)、半径 5 的圆：点 (6, 4) 在圆上，点 (7, 3) 在圆外。",
  ),
  "equation-from-the-radius": graphed(
    view(-8, 8, -8, 8),
    [circle([0, 0], 6), { kind: "segment", a: [0, 0], b: [6, 0], tone: "action" }, { kind: "label", at: [3, 0], text: "6", dir: "n" }],
    "The circle of radius 6 centered at the origin, with equation x² + y² = 36.",
    "以原点为圆心、半径 6 的圆，方程是 x² + y² = 36。",
  ),
  "center-and-radius-from-standard-form": graphed(
    view(-10, 2, -5, 6),
    [
      circle([-4, 1], Math.sqrt(18)),
      pt([-4, 1], "(−4, 1)", "s", "result"),
      { kind: "segment", a: [-4, 1], b: [-1, 4], tone: "action" },
      { kind: "label", at: [-2.5, 2.5], text: "3√2", dir: "se" },
    ],
    "The circle (x + 4)² + (y − 1)² = 18, with center (−4, 1) and radius 3√2.",
    "圆 (x + 4)² + (y − 1)² = 18，圆心 (−4, 1)，半径 3√2。",
  ),
  "intersection-points": graphed(
    view(-3, 5, -3, 5),
    [
      circle([1, 1], Math.sqrt(5)),
      { kind: "line", a: [0, -1], b: [2, 3], tone: "action" },
      pt([0, -1], "(0, −1)", "sw", "result"),
      pt([2, 3], "(2, 3)", "ne", "result"),
      { kind: "label", at: [-2.8, 4.4], text: "(x − 1)² + (y − 1)² = 5", dir: "e" },
    ],
    "The line y = 2x − 1 and the circle (x − 1)² + (y − 1)² = 5 meet at (0, −1) and (2, 3).",
    "直线 y = 2x − 1 与圆 (x − 1)² + (y − 1)² = 5 交于 (0, −1) 和 (2, 3)。",
  ),
  "the-other-endpoint-of-a-diameter": graphed(
    view(-5, 9, -8, 6),
    [
      circle([2, -1], 5),
      { kind: "segment", a: [5, 3], b: [-1, -5], tone: "action" },
      pt([5, 3], "A(5, 3)", "ne"),
      pt([2, -1], "M(2, −1)", "e", "result"),
      pt([-1, -5], "B(−1, −5)", "sw", "result"),
    ],
    "The center M(2, −1) is the midpoint of diameter AB: from A(5, 3) the same step past M lands on B(−1, −5).",
    "圆心 M(2, −1) 是直径 AB 的中点：从 A(5, 3) 走到 M，再走相同的一步到 B(−1, −5)。",
  ),
  "perpendicular-bisector-of-a-diameter": graphed(
    view(-3, 7, -2, 8),
    [
      circle([2, 3], Math.sqrt(13)),
      { kind: "segment", a: [-1, 1], b: [5, 5] },
      { kind: "line", a: [0, 6], b: [4, 0], tone: "action" },
      pt([-1, 1], "A", "w"),
      pt([5, 5], "B", "e"),
      pt([2, 3], "(2, 3)", "ne", "result"),
    ],
    "The diameter from A(−1, 1) to B(5, 5) and its perpendicular bisector y = −(3/2)x + 6, through the center (2, 3).",
    "从 A(−1, 1) 到 B(5, 5) 的直径及其垂直平分线 y = −(3/2)x + 6，过圆心 (2, 3)。",
  ),
  "endpoints-of-the-perpendicular-diameter": graphed(
    view(-4, 6, -3, 7),
    [
      circle([1, 2], Math.sqrt(10)),
      { kind: "segment", a: [4, 3], b: [-2, 1] },
      { kind: "segment", a: [0, 5], b: [2, -1], tone: "action" },
      pt([1, 2], "(1, 2)", "w", "result"),
      pt([4, 3], "A(4, 3)", "e"),
      pt([0, 5], "(0, 5)", "n", "action"),
      pt([2, -1], "(2, −1)", "s", "action"),
    ],
    "Center (1, 2) and A(4, 3): the step (3, 1) turned a quarter turn gives the perpendicular diameter from (0, 5) to (2, −1).",
    "圆心 (1, 2) 和 A(4, 3)：步长 (3, 1) 转四分之一圈，得到从 (0, 5) 到 (2, −1) 的垂直直径。",
  ),
  "perpendicular-bisector-of-a-chord": graphed(
    view(-7, 7, -7, 7),
    [
      circle([0, 0], 5),
      { kind: "segment", a: [-3, 4], b: [4, 3], tone: "action" },
      { kind: "line", a: [-1, -7], b: [1, 7], tone: "result" },
      pt([-3, 4], "P", "nw"),
      pt([4, 3], "Q", "ne"),
    ],
    "Chord PQ of the circle x² + y² = 25, from P(−3, 4) to Q(4, 3), and its perpendicular bisector y = 7x through the center.",
    "圆 x² + y² = 25 的弦 PQ，从 P(−3, 4) 到 Q(4, 3)，以及它过圆心的垂直平分线 y = 7x。",
  ),
  "center-from-three-points": graphed(
    view(-2, 10, -2, 11),
    [
      circle([4, 5.5], Math.sqrt(16.25)),
      { kind: "line", a: [4, -2], b: [4, 11], tone: "action" },
      { kind: "line", a: [-1, 3], b: [9, 8], tone: "action" },
      { kind: "segment", a: [2, 2], b: [6, 2] },
      { kind: "segment", a: [0, 6], b: [2, 2] },
      pt([0, 6], "A", "w"),
      pt([2, 2], "B", "sw"),
      pt([6, 2], "C", "se"),
      pt([4, 5.5], "(4, 5.5)", "ne", "result"),
    ],
    "A(0, 6), B(2, 2), C(6, 2): the perpendicular bisectors x = 4 and x − 2y = −7 of two chords meet at the center (4, 5.5).",
    "A(0, 6)、B(2, 2)、C(6, 2)：两条弦的垂直平分线 x = 4 和 x − 2y = −7 交于圆心 (4, 5.5)。",
  ),
  "chord-cut-by-a-line": graphed(
    view(-7, 5, -4, 8),
    [
      circle([-1, 2], 5),
      { kind: "line", a: [-7, 5], b: [5, 5], tone: "action" },
      { kind: "segment", a: [-5, 5], b: [3, 5], tone: "result" },
      { kind: "segment", a: [-1, 2], b: [-1, 5] },
      pt([-1, 2], "(−1, 2)", "s"),
      { kind: "label", at: [-1, 3.5], text: "3", dir: "e" },
      { kind: "label", at: [1, 5], text: "8", dir: "n" },
    ],
    "The line y = 5 is 3 from the center of (x + 1)² + (y − 2)² = 25 and cuts a chord of length 8.",
    "直线 y = 5 距圆 (x + 1)² + (y − 2)² = 25 的圆心 3，截得长为 8 的弦。",
  ),
  "right-angle-or-not": graphed(
    view(-7, 7, -7, 7),
    [
      circle([0, 0], 5),
      { kind: "segment", a: [-5, 0], b: [5, 0] },
      { kind: "segment", a: [-5, 0], b: [3, 4], tone: "action" },
      { kind: "segment", a: [5, 0], b: [3, 4], tone: "action" },
      pt([-5, 0], "A", "w"),
      pt([5, 0], "B", "e"),
      pt([3, 4], "P(3, 4)", "ne", "result"),
    ],
    "A(−5, 0), B(5, 0) and P(3, 4): P is on the circle with diameter AB, so angle APB is a right angle.",
    "A(−5, 0)、B(5, 0)、P(3, 4)：P 在以 AB 为直径的圆上，所以角 APB 是直角。",
  ),
  "circumcircle-of-a-right-triangle": graphed(
    view(-3, 7, -1, 9),
    [
      circle([2, 4], Math.sqrt(10)),
      { kind: "segment", a: [1, 1], b: [5, 3], tone: "action" },
      { kind: "segment", a: [5, 3], b: [3, 7], tone: "action" },
      { kind: "segment", a: [3, 7], b: [1, 1], tone: "result" },
      pt([1, 1], "A", "sw"),
      pt([5, 3], "B", "e"),
      pt([3, 7], "C", "n"),
      pt([2, 4], "(2, 4)", "w", "result"),
    ],
    "Right triangle with A(1, 1), B(5, 3), C(3, 7): the hypotenuse AC is a diameter of the circle through the vertices, with center (2, 4).",
    "直角三角形 A(1, 1)、B(5, 3)、C(3, 7)：斜边 AC 是过三顶点的圆的直径，圆心是 (2, 4)。",
  ),
  "missing-coordinate": graphed(
    view(-6, 8, -5, 7),
    [
      circle([1, 1], 5),
      { kind: "segment", a: [-4, 1], b: [6, 1] },
      { kind: "segment", a: [-4, 1], b: [5, 4], tone: "action" },
      { kind: "segment", a: [6, 1], b: [5, 4], tone: "action" },
      pt([-4, 1], "A", "w"),
      pt([6, 1], "B", "e"),
      pt([5, 4], "P(5, 4)", "ne", "result"),
      pt([1, 1], "(1, 1)", "s"),
    ],
    "A(−4, 1) and B(6, 1) are the ends of a diameter of the circle with center (1, 1) and radius 5; P(5, y) above AB is (5, 4).",
    "A(−4, 1) 和 B(6, 1) 是圆心 (1, 1)、半径 5 的圆的直径端点；AB 上方的 P(5, y) 是 (5, 4)。",
  ),
} satisfies Record<string, Figure>;

/** chordMarks draws a chord at distance d below the center with the right triangle of radius, half chord and distance. */
function chordMarks(half: number, d: number, rText: string, dText: string, halfText: string): Mark[] {
  const r = Math.hypot(half, d);
  const k = R / r;
  const m: Point = [0, -d * k];
  const a: Point = [-half * k, -d * k];
  const b: Point = [half * k, -d * k];
  return [
    ring(R),
    seg(a, b, "accent"),
    seg(O, m, "action"),
    seg(O, a, "result"),
    square(m, O, b),
    ...centerDot("n"),
    name(a, "A", "sw"),
    name(b, "B", "se"),
    name(m, "M", "s"),
    note([-half * k * 0.55, -d * k * 0.45], rText, "nw"),
    note([0, -d * k * 0.5], dText, "e"),
    note([-half * k * 0.5, -d * k], halfText, "s"),
  ];
}

/** chordDrawings are the explanation drawings of chords and their distance from the center. */
export const chordDrawings = {
  "length-of-a-chord": drawing(
    chordMarks(8, 6, "10", "6", "8"),
    "A chord AB with M its midpoint: radius OA = 10 and OM = 6 give AM = 8, so the chord is 16.",
    "弦 AB，M 是它的中点：半径 OA = 10，OM = 6，得 AM = 8，所以弦长 16。",
  ),
  "distance-from-the-center": drawing(
    chordMarks(12, 5, "13", "5", "12"),
    "In a circle of radius 13, a chord of 24 has half-length 12 and lies 5 from the center.",
    "半径 13 的圆中，长 24 的弦一半是 12，距圆心 5。",
  ),
  "radius-from-a-chord": drawing(
    chordMarks(8, 4, "4√5", "4", "8"),
    "A chord of 16 at distance 4 from the center: half-length 8 and distance 4 give a radius of 4√5.",
    "距圆心 4、长 16 的弦：一半 8 和距离 4 得半径 4√5。",
  ),
} satisfies Record<string, Figure>;
