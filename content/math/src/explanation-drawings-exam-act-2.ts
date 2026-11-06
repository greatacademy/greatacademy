// Drawings of the ACT explanations: laws of triangles, angles at lines, triangle facts, polygons and parallelograms.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { circleAxes } from "./explanation-drawings-curves.ts";
import { cornersFromAngles, crossing, fill, tri } from "./explanation-drawings-exam-kit.ts";
import { angle, bend, drawing, fromAngles, fromSides, name, note, on, seg, square } from "./explanation-drawings-kit.ts";

const rad = (deg: number) => (deg * Math.PI) / 180;

/** para lists the corners of a parallelogram with a horizontal base and the given angle at its first corner. */
const para = (base: number, side: number, deg: number): [Point, Point, Point, Point] => {
  const d = on(deg, side);
  return [[0, 0], [base, 0], [base + d[0], d[1]], d];
};

const rays = (degs: readonly number[], r: number): Mark[] => degs.map((d) => seg([0, 0], on(d, r)));

/** regular lists the corners of a regular polygon with its base at the bottom. */
const regular = (n: number, r: number): Point[] => Array.from({ length: n }, (_, i) => on(270 - 180 / n + (i * 360) / n, r));

/** examActDrawings2 draws the explanations of ACT Math Prep, by knowledge point: triangle laws, angles and polygons. */
export const examActDrawings2: Readonly<Record<string, Figure>> = {
  "act-exam-finding-triangle-area-using-sine#exam-question": (() => {
    const C = on(30, 6);
    return drawing(
      [
        fill([[0, 0], [10, 0], C], "result"),
        ...tri([[0, 0], [10, 0], C], { sides: ["10", undefined, "6"], angles: ["30°"], angleStyles: ["accent"] }),
        seg(C, [C[0], 0], undefined, true),
        square([C[0], 0], [10, 0], C),
      ],
      "Sides 10 and 6 with the angle of 30° between them. The dashed height is 6 sin 30°, which gives the shaded area of 15.",
      "边 10 和 6，夹角为 30°。虚线高是 6 sin 30°，得到阴影面积 15。",
    );
  })(),
  "act-exam-finding-triangle-area-using-sine#harder-exam-question": (() => {
    const C = on((Math.asin(0.6) * 180) / Math.PI, 6);
    return drawing(
      [
        fill([[0, 0], [10, 0], C], "result"),
        ...tri([[0, 0], [10, 0], C], { sides: ["10", undefined, "6"], angleStyles: ["accent"], names: ["C"] }),
        seg(C, [C[0], 0], undefined, true),
        square([C[0], 0], [10, 0], C),
        note([C[0], 1.8], "3.6", "e"),
      ],
      "Sides 10 and 6 with sin C = 3/5 at the marked angle. The dashed height is 6 · 3/5 = 3.6, which gives the shaded area of 18.",
      "边 10 和 6，标记的角满足 sin C = 3/5。虚线高是 6 · 3/5 = 3.6，得到阴影面积 18。",
    );
  })(),
  "act-exam-using-the-law-of-sines#exam-question": (() => {
    const c = (8 * Math.sin(rad(75))) / Math.sin(rad(40));
    return drawing(
      tri(fromAngles(40, 65, c), {
        names: ["A", "B", "C"],
        sides: ["c", "8"],
        sideStyles: ["result", "action"],
        angles: ["40°", undefined, "75°"],
        angleStyles: ["action", undefined, "result"],
      }),
      "Each side pairs with the angle across from it. The side 8 faces 40° at A, and the side c faces 75° at C, the pairs shown in matching colors.",
      "每条边与它对面的角配对。边 8 对着 A 处的 40°，边 c 对着 C 处的 75°，配对的以相同颜色标出。",
    );
  })(),
  "act-exam-using-the-law-of-cosines#exam-question": drawing(
    tri([[0, 0], [5, 0], on(120, 3)], {
      sides: ["5", "c", "3"],
      sideStyles: [undefined, "result"],
      angles: ["120°"],
      angleStyles: ["accent"],
    }),
    "Sides 5 and 3 with an included angle of 120°. The colored third side c satisfies c² = 25 + 9 − 30 cos 120°.",
    "边 5 和 3，夹角为 120°。标色的第三边 c 满足 c² = 25 + 9 − 30 cos 120°。",
  ),
  "act-exam-solving-trig-equations-and-inequalities#exam-question": drawing(
    [
      ...circleAxes(3, false),
      seg([0, 0], on(60, 3)),
      seg([on(60, 3)[0], 0], on(60, 3), "result"),
      { kind: "dot", at: on(60, 3) },
      angle([0, 0], [1, 0], on(60, 3), "accent", "60°"),
      note(on(60, 3), "√3/2", "ne"),
    ],
    "On the unit circle, the colored height at 60° is √3/2. So t = 60° solves sin t = √3/2 in the first quadrant.",
    "在单位圆上，60° 处标色的高度是 √3/2。所以在第一象限 t = 60° 满足 sin t = √3/2。",
  ),
  "act-exam-solving-trig-equations-and-inequalities#harder-exam-question": drawing(
    [
      ...circleAxes(3, false),
      seg([0, 0], on(60, 3)),
      seg([0, 0], on(120, 3)),
      seg(on(120, 3), on(60, 3), "action", true),
      { kind: "dot", at: on(60, 3), tone: "result" },
      { kind: "dot", at: on(120, 3), tone: "result" },
      note(on(60, 3), "60°", "ne"),
      note(on(120, 3), "120°", "nw"),
    ],
    "A dashed level at the height √3/2 meets the unit circle twice, in color: at 60° and at 180° − 60° = 120°.",
    "高度 √3/2 处的虚线与单位圆相交两次（标色）：在 60° 和 180° − 60° = 120°。",
  ),
  "act-exam-finding-reflex-and-divided-angles#exam-question": drawing(
    [
      ...rays([0, 40], 3),
      angle([0, 0], [1, 0], on(40, 1), undefined, "40°"),
      ...bend(40, 360, 1.3, [0, 0], "result"),
      note([-1.3, 0], "320°", "w"),
    ],
    "An angle of 40° and the colored reflex angle that completes the full turn, 360° − 40° = 320°.",
    "40° 的角和补足一整圈的标色优角，360° − 40° = 320°。",
  ),
  "act-exam-finding-reflex-and-divided-angles#harder-exam-question": drawing(
    [
      ...rays([0, 10, 60], 6),
      angle([0, 0], [1, 0], on(10, 1), "result"),
      note(on(5, 6), "10°", "e"),
      angle([0, 0], on(10, 1), on(60, 1), undefined, "50°"),
    ],
    "An angle of 60° divided in the ratio 1 : 5, which is 6 parts of 10°. The colored smaller part is 10°.",
    "60° 的角按 1 : 5 分割，即 6 份，每份 10°。标色的较小部分是 10°。",
  ),
  "act-exam-problem-solving-with-intersecting-lines#exam-question": drawing(
    crossing(50, ["50°", "130°", "50°", "130°"], ["action", "result", "action", "result"], 3.4),
    "Two crossing lines form two equal pairs. The opposite angles are 50° and 50°, and the neighbors are 130° and 130°, in color. All four total 360°.",
    "两条相交直线形成两对相等的角。相对的角是 50° 和 50°，相邻的角是 130° 和 130°（标色）。四个角共 360°。",
  ),
  "act-exam-problem-solving-with-intersecting-lines#harder-exam-question": drawing(
    crossing(55, ["(3x + 10)°", undefined, "(5x − 20)°"], ["action", undefined, "result"], 3.6),
    "The two opposite angles are equal, so 3x + 10 = 5x − 20. The drawing is to scale for x = 15, when both measure 55°.",
    "相对的两个角相等，所以 3x + 10 = 5x − 20。图按 x = 15 的比例画出，此时两角都是 55°。",
  ),
  "act-exam-solving-angle-bisector-problems#exam-question": drawing(
    [
      ...rays([0, 80], 5),
      seg([0, 0], on(40, 5), "result"),
      angle([0, 0], [1, 0], on(40, 1), undefined, "40°"),
      angle([0, 0], on(40, 1), on(80, 1), undefined, "40°"),
    ],
    "The colored bisector cuts the whole angle of 80° into two equal parts of 40°.",
    "标色的角平分线把 80° 的整个角分成相等的两部分，各 40°。",
  ),
  "act-exam-solving-angle-bisector-problems#harder-exam-question": drawing(
    [
      ...rays([0, 50], 7),
      seg([0, 0], on(25, 7), "result"),
      angle([0, 0], [1, 0], on(25, 1)),
      angle([0, 0], on(25, 1), on(50, 1)),
      note([3, 0.6], "(2x + 5)°", "e"),
      note([2.35, 2.2], "(3x − 5)°", "e"),
    ],
    "The two parts on either side of the colored bisector are equal. The drawing is to scale for x = 10, when each part is 25° and the whole is 50°.",
    "标色角平分线两侧的部分相等。图按 x = 10 的比例画出，此时每部分是 25°，整个角是 50°。",
  ),
  "act-exam-relating-sides-to-opposite-angles#exam-question": drawing(
    tri(fromAngles(50, 60, 5), { angles: ["50°", "60°", "70°"], angleStyles: [undefined, undefined, "result"], sideStyles: ["result"] }),
    "The third angle is 70°, the largest. The longest side lies across from it, both in color.",
    "第三个角是 70°，最大。最长的边在它对面，两者都标色。",
  ),
  "act-exam-relating-sides-to-opposite-angles#harder-exam-question": drawing(
    tri(fromSides(8, 7, 5), {
      names: ["A", "C", "B"],
      sides: ["8", "7", "5"],
      sideStyles: [undefined, undefined, "action"],
      angleStyles: [undefined, "action", "result"],
    }),
    "The shortest side AB, 5, faces the smallest angle, C. The longest side AC, 8, faces the largest angle, B, in color. The middle side BC, 7, faces A.",
    "最短边 AB（5）对着最小的角 C。最长边 AC（8）对着最大的角 B（标色）。中间的边 BC（7）对着 A。",
  ),
  "act-exam-applying-the-triangle-inequality#exam-question": drawing(
    [
      seg([0, 0], [3, 0], "action"),
      seg([3, 0], [11, 0]),
      note([1.5, 0], "3", "n"),
      note([7, 0], "8", "n"),
      note([5.5, 0], "11", "s"),
      ...tri(
        [
          [0, 1.6],
          [8, 1.6],
          [1.5, 1.6 + Math.sqrt(9 - 2.25)],
        ],
        { sides: ["8", "7", "3"], sideStyles: [undefined, "result"] },
      ),
      seg([0, 5.8], [8, 5.8]),
      seg([0, 5.8], [3, 5.8], "action"),
      note([1.5, 5.8], "3", "n"),
      note([5.5, 5.8], "5", "n"),
      note([4, 5.8], "8", "s"),
    ],
    "The top and bottom figures, with a third side of 5 and of 11, collapse flat. Between them a real triangle forms, as with the colored side 7.",
    "上下两个图形（第三边为 5 和 11）压成一条线。在它们之间才能形成真正的三角形，比如标色的边 7。",
  ),
  "act-exam-classifying-triangles#exam-question": drawing(
    tri(fromAngles(50, 30, 6), { angles: ["50°", "30°", "100°"], angleStyles: [undefined, undefined, "result"] }),
    "The angles 50° and 30° leave a third angle of 100°, in color. It is over 90°, so the triangle is obtuse.",
    "50° 和 30° 留下第三个角 100°（标色）。它超过 90°，所以是钝角三角形。",
  ),
  "act-exam-classifying-triangles#harder-exam-question": drawing(
    tri(fromSides(7, 4, 5), { sides: ["7", "4", "5"], sideStyles: ["result"], angleStyles: [undefined, undefined, "result"] }),
    "The longest side, 7, squared is 49, which exceeds 16 + 25 = 41. So the colored angle across from it is obtuse.",
    "最长边 7 的平方是 49，超过 16 + 25 = 41。所以它对面标色的角是钝角。",
  ),
  "act-exam-identifying-angle-and-shape-properties#exam-question": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [6, 0],
          [6, 4],
          [0, 4],
        ],
      },
      square([0, 0], [6, 0], [0, 4]),
      square([6, 0], [6, 4], [0, 0]),
      square([6, 4], [0, 4], [6, 0]),
      square([0, 4], [0, 0], [6, 4]),
      note([3, 0], "6", "s"),
      note([3, 4], "6", "n"),
      note([0, 2], "4", "w"),
      note([6, 2], "4", "e"),
    ],
    "A figure with sides 6, 4, 6, 4 and four right angles is a rectangle. It is not a square, since its adjacent sides differ.",
    "边长为 6、4、6、4 且有四个直角的图形是长方形。相邻的边不相等，所以它不是正方形。",
  ),
  "act-exam-identifying-angle-and-shape-properties#harder-exam-question": (() => {
    const [P, Q, R, S] = para(6, 3.2, 65);
    return drawing(
      [
        { kind: "polygon", points: [P, Q, R, S] },
        { kind: "ticks", a: P, b: Q, count: 1 },
        { kind: "ticks", a: R, b: S, count: 1 },
        { kind: "ticks", a: Q, b: R, count: 2 },
        { kind: "ticks", a: S, b: P, count: 2 },
        angle(P, Q, S, "result"),
        angle(R, S, Q, "result"),
        angle(Q, R, P, "action"),
        angle(S, P, R, "action"),
        name(P, "P", "sw"),
        name(Q, "Q", "se"),
        name(R, "R", "ne"),
        name(S, "S", "nw"),
      ],
      "In parallelogram PQRS, the angles at P and R match in one color, and those at Q and S match in the other. Sides with the same marks, such as PQ and RS, are equal.",
      "在平行四边形 PQRS 中，P 和 R 处的角用一种颜色标出相等，Q 和 S 处的角用另一种颜色。标记相同的边（如 PQ 和 RS）相等。",
    );
  })(),
  "act-exam-finding-interior-angles-of-polygons#exam-question": (() => {
    const c = regular(10, 4);
    return drawing(
      [{ kind: "polygon", points: c }, ...c.slice(2, 9).map((p) => seg(c[0] as Point, p, "result"))],
      "The colored diagonals from one vertex divide a decagon into 8 triangles, 10 − 2, so its angles total 8 · 180° = 1440°.",
      "从一个顶点出发的标色对角线把十边形分成 8 个三角形（10 − 2），所以内角和是 8 · 180° = 1440°。",
    );
  })(),
  "act-exam-finding-interior-angles-of-polygons#harder-exam-question": (() => {
    const c = cornersFromAngles([90, 100, 110, 120, 120], [5, 3.4, 3.2, 3]);
    const label = ["90°", "100°", "110°", "120°", "120°"];
    return drawing(
      [
        { kind: "polygon", points: c },
        ...c.map((p, i) => angle(p, c[(i + 1) % 5] as Point, c[(i + 4) % 5] as Point, i === 4 ? "result" : undefined, label[i])),
      ],
      "A pentagon has angles totaling 3 · 180° = 540°. Subtracting 90°, 100°, 110° and 120° leaves the colored fifth angle, 120°.",
      "五边形的内角和是 3 · 180° = 540°。减去 90°、100°、110° 和 120°，剩下标色的第五个角 120°。",
    );
  })(),
  "act-exam-finding-angles-in-parallelograms#exam-question": (() => {
    const [A, B, C, D] = para(6, 3.2, 60);
    return drawing(
      [
        { kind: "polygon", points: [A, B, C, D] },
        angle(A, B, D, undefined, "60°"),
        angle(B, C, A, "result", "120°"),
        name(A, "A", "sw"),
        name(B, "B", "se"),
        name(C, "C", "ne"),
        name(D, "D", "nw"),
      ],
      "The consecutive angles at A and B add to 180°. With 60° at A, the colored angle at B is 120°.",
      "A 和 B 处的相邻角相加得 180°。A 处为 60° 时，B 处标色的角是 120°。",
    );
  })(),
  "act-exam-finding-angles-in-parallelograms#harder-exam-question": (() => {
    const [A, B, C, D] = para(6, 3.2, 70);
    return drawing(
      [
        { kind: "polygon", points: [A, B, C, D] },
        angle(A, B, D, "action", "(3x + 10)°"),
        angle(C, D, B, "action", "(4x − 10)°"),
        angle(B, C, A, "result", "110°"),
      ],
      "Opposite angles are equal, so 3x + 10 = 4x − 10 and x = 20, making each 70°. The colored neighboring angle is its supplement, 110°.",
      "对角相等，所以 3x + 10 = 4x − 10，x = 20，每个角都是 70°。标色的相邻角是它的补角 110°。",
    );
  })(),
  "act-exam-finding-lengths-with-parallel-sides#exam-question": (() => {
    const [A, B, C, D] = para(8, 12, 60);
    return drawing(
      [
        { kind: "polygon", points: [A, B, C, D] },
        seg(B, C, "result"),
        note([4, 0], "8", "s"),
        note([4 + D[0], D[1]], "8", "n"),
        note([(B[0] + C[0]) / 2, C[1] / 2], "12", "e"),
        note([D[0] / 2, D[1] / 2], "12", "w"),
      ],
      "A parallelogram with perimeter 40 has adjacent sides adding to half of it, 20. With one side 8, the colored adjacent side is 12.",
      "周长为 40 的平行四边形，相邻两边之和是一半，即 20。一边为 8 时，标色的相邻边是 12。",
    );
  })(),
  "act-exam-finding-lengths-with-parallel-sides#harder-exam-question": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [14, 0],
          [10, 4],
          [4, 4],
        ],
      },
      seg([2, 2], [12, 2], "result"),
      { kind: "dot", at: [2, 2] },
      { kind: "dot", at: [12, 2] },
      note([7, 0], "14", "s"),
      note([7, 4], "6", "n"),
      note([7, 2], "10", "n"),
    ],
    "The colored midsegment joins the midpoints of the legs. Its length is the average of the bases 6 and 14, which is 10.",
    "标色的中位线连接两腰的中点。它的长度是底 6 和 14 的平均值，即 10。",
  ),
  "act-exam-finding-lengths-in-regular-polygons#exam-question": (() => {
    const c = regular(5, 4);
    return drawing(
      [{ kind: "polygon", points: c }, seg(c[0] as Point, c[1] as Point, "result"), note([0, (c[0] as Point)[1]], "7", "s")],
      "A regular pentagon with perimeter 35 has five equal sides, so each one, like the colored side, is 7.",
      "周长为 35 的正五边形有五条相等的边，所以每条边（如标色的边）都是 7。",
    );
  })(),
  "act-exam-finding-lengths-in-regular-polygons#harder-exam-question": (() => {
    const c = regular(6, 4);
    return drawing(
      [{ kind: "polygon", points: c, tone: "result" }, ...c.map((p) => seg([0, 0], p)), note([0, (c[0] as Point)[1]], "10", "s")],
      "A regular hexagon splits into 6 equilateral triangles of side 10. Only the 6 colored outer edges count toward the perimeter, 60.",
      "正六边形分成 6 个边长为 10 的等边三角形。周长只算 6 条标色的外边，为 60。",
    );
  })(),
};
