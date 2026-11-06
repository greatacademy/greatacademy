// Drawings of the SAT explanations: congruent and similar figures, altitudes to a hypotenuse, right-triangle ratios and angles past 90 degrees.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { cross } from "./explanation-drawings-curves.ts";
import { box, moved, rt, tri } from "./explanation-drawings-exam-kit.ts";
import { angle, drawing, fromAngles, fromSides, name, note, on, ring, seg, square, type Triangle } from "./explanation-drawings-kit.ts";

const R: Triangle = [
  [0, 0],
  [4, 0],
  [4, 3],
];
const T5 = fromAngles(50, 60, 4);
const S = fromAngles(30, 70, 4);

/** cutBase is a triangle with sides BC = 16, CA = 14, AB = 12 and the segment parallel to its base that cuts AB at a quarter from A. */
function cutBase(
  top: readonly [string, string],
  base: string,
  de: string,
  styles: readonly ["result" | undefined, "result" | undefined],
): Mark[] {
  const [B, C, A] = fromSides(16, 14, 12);
  const D: Point = [A[0] + (B[0] - A[0]) / 4, A[1] + (B[1] - A[1]) / 4];
  const E: Point = [A[0] + (C[0] - A[0]) / 4, A[1] + (C[1] - A[1]) / 4];
  return [
    { kind: "polygon", points: [B, C, A] },
    seg(D, E, styles[0]),
    seg(B, C, styles[1]),
    { kind: "arrows", a: D, b: E, count: 1 },
    { kind: "arrows", a: [B[0] + 6, 0], b: [B[0] + 10, 0], count: 1 },
    name(A, "A", "n"),
    name(B, "B", "sw"),
    name(C, "C", "se"),
    name(D, "D", "w"),
    name(E, "E", "e"),
    { kind: "side", a: A, b: D, text: top[0] },
    { kind: "side", a: D, b: B, text: top[1] },
    note([(D[0] + E[0]) / 2, D[1]], de, "s"),
    note([8, 0], base, "s"),
  ];
}

/** altitude is the right triangle whose hypotenuse is split into 4 and 9 by the altitude 6. */
function altitude(s?: "result"): Mark[] {
  const A: Point = [0, 0];
  const B: Point = [13, 0];
  const C: Point = [4, 6];
  const F: Point = [4, 0];
  return [{ kind: "polygon", points: [A, B, C] }, seg(F, C, s), square(C, A, B), square(F, B, C)];
}

/** quarterTurn draws the unit circle with the terminal side of 135 degrees, the point on it and the reference angle. */
function quarterTurn(extra: readonly Mark[]): Mark[] {
  const p = on(135, 3);
  return [
    ...cross(3.6),
    ring(3),
    seg([0, 0], p),
    { kind: "dot", at: p },
    angle([0, 0], [-1, 0], p, "action", "45°"),
    angle([0, 0], [1, 0], p, undefined, "135°"),
    ...extra,
  ];
}

const h = 3 * Math.SQRT1_2;
const sinCos = (deg: number): [number, number] => [5 * Math.cos((deg * Math.PI) / 180), 5 * Math.sin((deg * Math.PI) / 180)];

/** examSatDrawings5 draws the explanations of SAT Math Prep, by knowledge point: congruence, similarity and trigonometry. */
export const examSatDrawings5: Readonly<Record<string, Figure>> = {
  "sat-exam-congruent-triangles#exam-question": drawing(
    [
      ...tri(T5, { names: ["A", "B", "C"], angles: ["50°"], angleStyles: ["action"] }),
      ...tri(moved(T5, 5.4), { names: ["D", "E", "F"], angles: ["50°", "60°", "70°"], angleStyles: ["action", undefined, "result"] }),
    ],
    "The order in ABC ≅ DEF matches A with D, so the second triangle has 50° at D and 60° at E. The angle sum gives the colored angle at F, 70°.",
    "ABC ≅ DEF 的顺序使 A 与 D 对应，所以第二个三角形在 D 处是 50°，在 E 处是 60°。内角和得到 F 处标色的角 70°。",
  ),
  "sat-exam-congruent-triangles#harder-exam-question": drawing(
    [
      ...tri(T5, { names: ["P", "Q", "T"], sides: ["3x − 2"], sideStyles: ["result"] }),
      ...tri(moved(T5, 5.4), { names: ["R", "S", "U"], sides: ["16"], sideStyles: ["result"] }),
    ],
    "The side PQ matches the side RS, the two in color, so 3x − 2 = 16.",
    "边 PQ 与边 RS 对应（两条标色的边），所以 3x − 2 = 16。",
  ),
  "sat-exam-finding-corresponding-angles-in-similar-shapes#exam-question": drawing(
    [
      ...tri(S, { names: ["P", "R", "Q"], angles: ["30°", "", ""], angleStyles: [undefined, "result", "action"] }),
      note([3.35, 0.1], "70°", "n"),
      note([3, 1.3], "80°", "s"),
      ...tri(moved(S, 5, 0.7), {
        names: ["S", "U", "T"],
        angles: [undefined, undefined, "80°"],
        angleStyles: [undefined, undefined, "action"],
      }),
    ],
    "The angle at T moves to its match at Q, so the first triangle has 30° and 80°. The angle sum gives the colored third angle, 70°.",
    "T 处的角移到与它对应的 Q 处，所以第一个三角形有 30° 和 80°。内角和得到标色的第三个角 70°。",
  ),
  "sat-exam-finding-corresponding-angles-in-similar-shapes#harder-exam-question": (() => {
    const t = fromAngles(50, 70, 2.4);
    return drawing(
      [
        ...tri(t, { sides: ["1"], angles: ["50°"], angleStyles: ["result"] }),
        ...tri(moved(t, 3.4, 3), { sides: ["3"], angles: ["50°"], angleStyles: ["result"] }),
      ],
      "For example, a triangle and a copy scaled by a factor of 3. The sides stretch, and the colored angle stays 50°.",
      "例如，一个三角形和按因子 3 放大的副本。边被拉长，而标色的角仍是 50°。",
    );
  })(),
  "sat-exam-finding-corresponding-lengths-in-similar-shapes#exam-question": drawing(
    [...box(0, 0, 4, 3, { bottom: "4", right: "3" }), ...box(7, 0, 20, 15, { bottom: "20", right: "15", line: "result" })],
    "A 4 by 3 rectangle and a similar one with 20 matching the 4. The factor is 5, so the colored rectangle's other side is 15.",
    "4 乘 3 的长方形和相似的长方形，其中 20 对应 4。因子为 5，所以标色长方形的另一边是 15。",
  ),
  "sat-exam-solving-problems-with-similar-triangles#exam-question": drawing(
    cutBase(["3", "9"], "16", "4", [undefined, "result"]),
    "The parallel segment DE cuts off a smaller, similar triangle. Comparing whole sides from A, 12 to 3, gives a factor of 4, so the colored base is 4 times 4, or 16.",
    "平行线段 DE 截出一个较小的相似三角形。比较从 A 出发的整条边，12 比 3，因子为 4，所以标色的底边是 4 的 4 倍，即 16。",
  ),
  "sat-exam-solving-problems-with-similar-triangles#harder-exam-question": drawing(
    cutBase(["3", "9"], "16", "4", ["result", undefined]),
    "The side from A comes in pieces 3 and 9, which add to 12. The factor is 12 to 3, so the colored parallel segment is 16 divided by 4, which is 4.",
    "从 A 出发的边分成 3 和 9 两段，加起来是 12。因子是 12 比 3，所以标色的平行线段是 16 除以 4，即 4。",
  ),
  "sat-exam-further-problem-solving-with-embedded-right-triangles#exam-question": drawing(
    [...altitude("result"), note([2, 0], "4", "s"), note([8.5, 0], "9", "s"), note([4, 3], "6", "e")],
    "The altitude to the hypotenuse, in color, splits the hypotenuse into 4 and 9. Its square is their product, 36, so its length is 6.",
    "斜边上的高（标色）把斜边分成 4 和 9。高的平方等于它们的积 36，所以高为 6。",
  ),
  "sat-exam-further-problem-solving-with-embedded-right-triangles#harder-exam-question": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [13, 0],
          [4, 6],
        ],
        tone: "result",
      },
      ...altitude(),
      note([6.5, 0], "13", "s"),
      note([4, 3], "6", "e"),
      note([6.2, 1.2], "39", "e"),
    ],
    "The hypotenuse is 4 + 9 = 13 and the altitude on it is 6. So the shaded whole triangle has area 39.",
    "斜边是 4 + 9 = 13，它上面的高是 6。所以整个阴影三角形的面积是 39。",
  ),
  "sat-exam-identifying-information-needed-to-determine-similarity#exam-question": drawing(
    [
      ...tri(T5, { names: ["A", "B", "C"], angleStyles: ["action", "result"] }),
      ...tri(moved(T5, 5.2, 0.75), { names: ["D", "E", "F"], angleStyles: ["action", "result"] }),
    ],
    "For example, angles A and D are known to match, as marked. The second colored pair, angles B and E, completes the AA criterion.",
    "例如，已知角 A 与角 D 对应相等，如图所标。第二对标色的角 B 和角 E 补足 AA 判定。",
  ),
  "sat-exam-identifying-information-needed-to-determine-similarity#harder-exam-question": (() => {
    const t: Triangle = [[0, 0], [4, 0], on(50, 3)];
    return drawing(
      [
        ...tri(t, { sides: ["4", undefined, "3"], names: ["A"], angleStyles: ["result"] }),
        ...tri(moved(t, 5, 1.6), { sides: ["8", undefined, "6"], names: ["D"], angleStyles: ["result"] }),
      ],
      "For example, sides 4 and 3 are proportional to sides 8 and 6. The SAS criterion needs the colored angle between them to match, at A and D.",
      "例如，边 4 和 3 与边 8 和 6 成比例。SAS 判定要求它们之间标色的角相等，即 A 处和 D 处的角。",
    );
  })(),
  "sat-exam-trigonometric-ratios-in-right-triangles#exam-question": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], sideStyles: [undefined, "result", "action"], angles: ["θ"], angleStyles: ["accent"] }),
    "In the 3-4-5 triangle, stand at θ. The opposite side 3 and the hypotenuse 5, both in color, give a sine of 3/5.",
    "在 3-4-5 三角形中，站在 θ 处看。对边 3 和斜边 5（均标色）得到正弦 3/5。",
  ),
  "sat-exam-trigonometric-ratios-in-right-triangles#harder-exam-question": drawing(
    rt(4, 3, {
      sides: ["4", "3", "5"],
      sideStyles: ["result", "action"],
      angles: [undefined, undefined, "θ"],
      angleStyles: [undefined, undefined, "accent"],
    }),
    "At θ, the angle opposite the side of 4, the legs swap roles. The opposite side 4 and the adjacent side 3, both in color, give a tangent of 4/3.",
    "在对着边 4 的角 θ 处，两条直角边互换角色。对边 4 和邻边 3（均标色）得到正切 4/3。",
  ),
  "sat-exam-calculating-trigonometric-ratios-using-the-pythagorean-theorem#exam-question": drawing(
    rt(8, 6, { sides: ["8", "6", "10"], sideStyles: ["result", undefined, "action"], angleStyles: ["accent"] }),
    "Legs 8 and 6 give a hypotenuse of 10. At the marked angle next to the leg of 8, the adjacent side and the hypotenuse, in color, give a cosine of 8/10.",
    "直角边 8 和 6 得出斜边 10。在与边 8 相邻的标记角处，邻边和斜边（标色）得到余弦 8/10。",
  ),
  "sat-exam-calculating-trigonometric-ratios-using-the-pythagorean-theorem#harder-exam-question": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], sideStyles: ["result"], angles: ["A"], angleStyles: ["accent"] }),
    "The reduced ratio 3/5 gives a triangle with opposite side 3 and hypotenuse 5. The missing colored side is 4, the side adjacent to A.",
    "约简后的比 3/5 给出对边 3、斜边 5 的三角形。缺少的标色边是 4，是与 A 相邻的边。",
  ),
  "sat-exam-cofunction-relationships-and-identities#exam-question": (() => {
    const [w, up] = sinCos(20);
    return drawing(
      rt(w, up, { angles: ["20°", undefined, "70°"], sideStyles: [undefined, "result"] }),
      "The two acute angles add to 90°. The colored side is opposite 20° and adjacent to 70°, so sin 20° = cos 70°.",
      "两个锐角相加得 90°。标色的边对着 20°，又与 70° 相邻，所以 sin 20° = cos 70°。",
    );
  })(),
  "sat-exam-cofunction-relationships-and-identities#harder-exam-question": (() => {
    const [w, up] = sinCos(15);
    return drawing(
      rt(w, up, { angles: ["x°", undefined, "(3x + 30)°"], angleStyles: ["result", undefined, "result"] }),
      "The two colored acute angles add to 90°, so x + 3x + 30 = 90. The drawing is to scale for x = 15, with angles of 15° and 75°.",
      "两个标色的锐角相加得 90°，所以 x + 3x + 30 = 90。图按 x = 15 的比例画出，两角为 15° 和 75°。",
    );
  })(),
  "sat-exam-relations-between-trigonometric-ratios-in-similar-right-triangles#exam-question": (() => {
    const t: Triangle = [
      [0, 0],
      [3, 0],
      [3, 4],
    ];
    return drawing(
      [
        ...tri(t, { sides: ["3", undefined, "5"], right: 1, angleStyles: ["result"], names: ["P"] }),
        ...tri(moved(t, 5, 4), { sides: ["12", undefined, "20"], right: 1, angleStyles: ["result"] }),
      ],
      "The second triangle is 4 times larger. At the matching colored angle, 3/5 becomes 12/20, and the cosine stays 3/5.",
      "第二个三角形大到 4 倍。在对应的标色角处，3/5 变成 12/20，余弦仍是 3/5。",
    );
  })(),
  "sat-exam-relations-between-trigonometric-ratios-in-similar-right-triangles#harder-exam-question": drawing(
    [
      ...tri(R, { sides: ["4", "3"], right: 1, angleStyles: ["accent"], names: ["P"] }),
      ...tri(moved(R, 6, 3), { sides: ["12", "9"], right: 1, angleStyles: ["accent"], sideStyles: ["result"] }),
    ],
    "The tangent 3/4 carries over to the matching angle in the larger triangle. With 9 opposite that angle, the colored adjacent side is 12.",
    "正切 3/4 沿用到较大三角形的对应角上。对边为 9 时，标色的邻边是 12。",
  ),
  "sat-exam-problem-solving-using-trigonometric-ratios-in-similar-right-triangles#exam-question": drawing(
    rt(16, 12, { sides: ["16", "12"], sideStyles: [undefined, "result"], angles: ["A"], angleStyles: ["accent"] }),
    "The pole is opposite the angle of the sun, and the shadow of 16 is adjacent. Multiplying by tan A = 3/4 gives the colored height, 12.",
    "杆对着太阳的角，长为 16 的影子是邻边。乘以 tan A = 3/4 得到标色的高度 12。",
  ),
  "sat-exam-problem-solving-using-trigonometric-ratios-in-similar-right-triangles#harder-exam-question": drawing(
    [
      ...tri(R, { sides: ["4", undefined, "5"], right: 1, angles: ["A"], angleStyles: ["accent"] }),
      ...tri(moved(R, 6, 3), { sides: ["12", "9", "15"], right: 1, angleStyles: ["accent"], sideStyles: ["action", "result"] }),
    ],
    "Equal angles make the triangles similar, so cos A = 4/5 holds in both. With hypotenuse 15, the adjacent side is 12, and the Pythagorean theorem gives the opposite side, 9, in color.",
    "角相等使两个三角形相似，所以 cos A = 4/5 对两者都成立。斜边为 15 时邻边是 12，勾股定理给出标色的对边 9。",
  ),
  "sat-exam-trigonometric-ratios-of-large-special-angles#exam-question": drawing(
    quarterTurn([seg([-3 * Math.SQRT1_2, 0], [-3 * Math.SQRT1_2, h], "result"), note([-3 * Math.SQRT1_2, h], "√2/2", "nw")]),
    "On the unit circle, 135° lies in the second quadrant with a reference angle of 45°. Sine is the height of the point, in color, which is positive: √2/2.",
    "在单位圆上，135° 位于第二象限，参考角是 45°。正弦是该点的高度（标色），为正：√2/2。",
  ),
  "sat-exam-trigonometric-ratios-of-large-special-angles#harder-exam-question": drawing(
    quarterTurn([
      seg([-3 * Math.SQRT1_2, 0], [0, 0], "result"),
      seg([-3 * Math.SQRT1_2, 0], [-3 * Math.SQRT1_2, h], undefined, true),
      note([(-3 * Math.SQRT1_2) / 2, 0], "−√2/2", "s"),
    ]),
    "On the unit circle, cosine is the x-coordinate of the point at 135°. The colored distance lies left of the origin, so the cosine is negative: −√2/2.",
    "在单位圆上，余弦是 135° 处点的 x 坐标。标色的距离在原点左侧，所以余弦为负：−√2/2。",
  ),
};
