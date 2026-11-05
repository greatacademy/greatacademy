// Drawings in the explanations of angles, the unit circle and the laws of sines and cosines:
// angles in standard position and triangles built from the numbers in the text.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { circleAxes, cross, labeled, spoke, standard, sweep } from "./explanation-drawings-curves.ts";
import { shift } from "./explanation-drawings-geometry-2.ts";
import { angle, dotAt, drawing, fromAngles, fromSides, note, on, seg, square } from "./explanation-drawings-kit.ts";

const R = 3;
const facing = (deg: number): "e" | "ne" | "n" | "nw" | "w" | "sw" | "s" | "se" => {
  const d = ((deg % 360) + 360) % 360;
  if (d < 15 || d > 345) return "e";
  if (Math.abs(d - 90) < 15) return "n";
  if (Math.abs(d - 180) < 15) return "w";
  if (Math.abs(d - 270) < 15) return "s";
  return d < 90 ? "ne" : d < 180 ? "nw" : d < 270 ? "sw" : "se";
};
const tip = (deg: number, s: string, r = R) => note(on(deg, r), s, facing(deg));
const axisOf = (deg: number): Point => {
  const c = Math.cos((deg * Math.PI) / 180);
  return [c < 0 ? -R : R, 0];
};
/** the angle in standard position with its name at the end of its terminal side */
const turned = (deg: number, s: string): Mark[] => [...standard(deg), tip(deg, s, R)];
/** the acute angle between a terminal side and the x-axis */
const ref = (deg: number, s: string): Mark => angle([0, 0], on(deg, R), axisOf(deg), "result", s);
/** the point of the unit circle at an angle, with its coordinates */
const onCircle = (deg: number, s: string): Mark[] => [
  ...circleAxes(),
  spoke(deg, R, "result"),
  ...dotAt(on(deg, R), s, facing(deg), "result"),
];
/** the point of the unit circle at x, y (in units of the radius), with the drop to the x-axis */
const dropped = (x: number, y: number, s: string): Mark[] => {
  const p: Point = [x * R, y * R];
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  return [...circleAxes(), seg([0, 0], p, "result"), seg(p, [x * R, 0], "action", true), ...dotAt(p, s, facing(deg), "result")];
};

/** trigDrawings are drawings in the explanations of angles and triangles of Algebra II, by topic and knowledge point. */
export const trigDrawings: Readonly<Record<string, Figure>> = {
  "angles-in-the-coordinate-plane#quadrants-of-angles": drawing(
    [...turned(200, "200°"), note([-2, -1.8], "III", "s")],
    "200° is more than 180° and less than 270°, so its terminal side is in Quadrant III.",
    "200° 大于 180° 且小于 270°，所以终边在第三象限。",
  ),
  "angles-in-the-coordinate-plane#angles-from-the-terminal-side": drawing(
    [...turned(145, "145°"), ref(145, "35°")],
    "A terminal side 35° above the negative x-axis stops 35° short of 180°: the angle is 145°.",
    "终边在 x 轴负半轴上方 35°，比 180° 少 35°：这个角是 145°。",
  ),
  "angles-in-the-coordinate-plane#coterminal-angles": drawing(
    [...cross(R + 0.3), spoke(40, R, "result"), ...sweep(400), tip(40, "40° and 400°")],
    "For example, 400° is one full turn and 40° more, so it ends on the same terminal side as 40°.",
    "例如，400° 是转一整圈再转 40°，所以它与 40° 的终边相同。",
  ),
  "negative-angles-in-the-coordinate-plane#quadrants-of-negative-angles": drawing(
    [...turned(-130, "−130°"), note([-2, -1.8], "III", "w")],
    "−130° turns clockwise past −90° but not as far as −180°, so its terminal side is in Quadrant III.",
    "−130° 顺时针转过 −90°，但未到 −180°，所以终边在第三象限。",
  ),
  "negative-angles-in-the-coordinate-plane#negative-angles-from-the-terminal-side": drawing(
    [...turned(-130, "−130°"), angle([0, 0], on(-130, R), [0, -R], "result", "40°")],
    "A terminal side 40° clockwise past the negative y-axis has turned 90° + 40°, so the angle is −130°.",
    "终边从 y 轴负半轴再顺时针转 40°，共转了 90° + 40°，所以这个角是 −130°。",
  ),
  "negative-angles-in-the-coordinate-plane#negative-and-positive-measures": drawing(
    [...cross(R + 0.3), spoke(300, R, "result"), ...sweep(300, 1), ...sweep(-60, 0.6, "result", 0), tip(300, "300° and −60°")],
    "The same terminal side is reached by 300° counterclockwise and by 60° clockwise, so 300° and −60° end together.",
    "逆时针转 300° 和顺时针转 60° 到达同一条终边，所以 300° 和 −60° 的终边相同。",
  ),
  "coterminal-angles#coterminal-angles-in-degrees": drawing(
    [...cross(R + 0.3), spoke(130, R, "result"), ...sweep(850, 0.6, "action", 0.45), tip(130, "850° and 130°")],
    "850° is 2 full turns, 720°, and 130° more, so it ends on the same terminal side as 130°.",
    "850° 是转 2 整圈（720°）再转 130°，所以它与 130° 的终边相同。",
  ),
  "coterminal-angles#coterminal-angles-in-radians": drawing(
    [...cross(R + 0.3), spoke(150, R, "result"), ...sweep(510, 0.7, "action", 0.6), tip(150, "17π/6 and 5π/6")],
    "17π/6 is one full turn, 12π/6, and 5π/6 more, so it ends on the same terminal side as 5π/6.",
    "17π/6 是转一整圈（12π/6）再转 5π/6，所以它与 5π/6 的终边相同。",
  ),
  "coterminal-angles#testing-for-coterminal-angles": drawing(
    [
      ...cross(R + 0.3),
      spoke(110, R, "result"),
      ...sweep(830, 0.9, "action", 0.45),
      ...sweep(-250, 0.5, "result", 0.2),
      tip(110, "−250° and 830°"),
    ],
    "−250° and 830° differ by 1080°, exactly 3 full turns, and both end on the terminal side of 110°.",
    "−250° 和 830° 相差 1080°，恰好是 3 整圈，两者的终边都与 110° 相同。",
  ),
  "calculating-reference-angles#reference-angles-in-degrees": drawing(
    [
      ...turned(130, "130°"),
      ref(130, "50°"),
      ...shift([...turned(200, "200°"), ref(200, "20°")], 11),
      ...shift([...turned(300, "300°"), ref(300, "60°")], 22),
    ],
    "For example, the reference angle of 130° is 180° − 130° = 50°, of 200° is 200° − 180° = 20°, and of 300° is 360° − 300° = 60°.",
    "例如，130° 的参考角是 180° − 130° = 50°，200° 的参考角是 200° − 180° = 20°，300° 的参考角是 360° − 300° = 60°。",
  ),
  "calculating-reference-angles#reference-angles-of-negative-and-large-angles": drawing(
    [...turned(-140, "−140°"), ref(-140, "40°")],
    "−140° ends on the same terminal side as 220°, so its reference angle is 220° − 180° = 40°.",
    "−140° 与 220° 的终边相同，所以它的参考角是 220° − 180° = 40°。",
  ),
  "calculating-reference-angles#reference-angles-in-radians": drawing(
    [...turned(210, "7π/6"), ref(210, "π/6"), ...shift([...turned(300, "5π/3"), ref(300, "π/3")], 9.5)],
    "The reference angle of 7π/6 is 7π/6 − π = π/6, and of 5π/3 is 2π − 5π/3 = π/3.",
    "7π/6 的参考角是 7π/6 − π = π/6，5π/3 的参考角是 2π − 5π/3 = π/3。",
  ),
  "properties-of-the-unit-circle-in-the-first-quadrant#coordinates-on-the-unit-circle": drawing(
    [
      ...circleAxes(),
      seg([0, 0], on(50, R), "result"),
      seg(on(50, R), [on(50, R)[0], 0], "action"),
      square([on(50, R)[0], 0], [0, 0], on(50, R)),
      note([on(50, R)[0] / 2, 0], "x", "s"),
      note([on(50, R)[0], on(50, R)[1] / 2], "y", "e"),
      note(on(50, R / 2), "1", "nw"),
      angle([0, 0], [R, 0], on(50, R), "result", "θ"),
      ...dotAt(on(50, R), "P(x, y)", "ne", "result"),
    ],
    "The right triangle under P has hypotenuse 1 and legs x and y, so cos θ = x and sin θ = y.",
    "P 下方的直角三角形斜边为 1，直角边为 x 和 y，所以 cos θ = x，sin θ = y。",
  ),
  "properties-of-the-unit-circle-in-the-first-quadrant#ratios-from-a-point-in-the-first-quadrant": drawing(
    dropped(5 / 13, 12 / 13, "P(5/13, 12/13)"),
    "P(5/13, 12/13) on the unit circle: the cosine is the x-coordinate 5/13 and the sine is the y-coordinate 12/13.",
    "单位圆上的点 P(5/13, 12/13)：余弦是横坐标 5/13，正弦是纵坐标 12/13。",
  ),
  "properties-of-the-unit-circle-in-the-first-quadrant#the-missing-coordinate": drawing(
    dropped(1 / 3, (2 * Math.SQRT2) / 3, "(1/3, 2√2/3)"),
    "With x = 1/3 in the first quadrant, y is positive and x² + y² = 1 gives y = 2√2/3.",
    "第一象限中 x = 1/3，y 为正，由 x² + y² = 1 得 y = 2√2/3。",
  ),
  "extending-the-trigonometric-ratios-using-the-unit-circle#ratios-from-a-point-in-any-quadrant": drawing(
    dropped(-3 / 5, -4 / 5, "(−3/5, −4/5)"),
    "At (−3/5, −4/5) in Quadrant III, the cosine is −3/5 and the sine is −4/5, both negative.",
    "第三象限的点 (−3/5, −4/5)：余弦是 −3/5，正弦是 −4/5，都为负。",
  ),
  "extending-the-trigonometric-ratios-using-the-unit-circle#ratios-using-the-reference-angle": drawing(
    [...circleAxes(), ...sweep(220), spoke(220, R, "result"), ref(220, "40°"), tip(220, "220°", R + 0.1)],
    "220° is in Quadrant III with reference angle 40°, so its ratios are those of 40° with the signs of Quadrant III.",
    "220° 在第三象限，参考角为 40°，所以它的三角比等于 40° 的三角比配上第三象限的符号。",
  ),
  "extending-the-trigonometric-ratios-using-angles-in-radians#ratios-in-radians-using-the-reference-angle": drawing(
    [...circleAxes(), ...sweep(216), spoke(216, R, "result"), ref(216, "π/5"), tip(216, "6π/5", R + 0.1)],
    "6π/5 is in Quadrant III with reference angle 6π/5 − π = π/5.",
    "6π/5 在第三象限，参考角为 6π/5 − π = π/5。",
  ),
  "extending-the-trigonometric-ratios-using-angles-in-radians#ratios-in-radians-with-a-calculator": drawing(
    (() => {
      const deg = (2.5 * 180) / Math.PI;
      const p = on(deg, R);
      return [
        ...circleAxes(),
        ...sweep(deg),
        spoke(deg, R, "result"),
        seg(p, [p[0], 0], "action", true),
        tip(deg, "2.5", R + 0.1),
        note([p[0], 0], "−0.80", "se"),
      ];
    })(),
    "2.5 radians lies between π/2 and π, in Quadrant II, where the x-coordinate, cos 2.5 ≈ −0.80, is negative.",
    "2.5 弧度介于 π/2 和 π 之间，在第二象限，那里的横坐标 cos 2.5 ≈ −0.80 为负。",
  ),
  "extending-the-trigonometric-ratios-to-negative-angles#signs-of-the-ratios-of-negative-angles": drawing(
    [...turned(-100, "−100°"), note([-2.2, -1.8], "III", "w")],
    "−100° ends in Quadrant III, on the terminal side of 260°, where the sine and the cosine are both negative.",
    "−100° 的终边在第三象限，与 260° 相同，那里的正弦和余弦都为负。",
  ),
  "extending-the-trigonometric-ratios-to-negative-angles#ratios-of-negative-angles-using-the-reference-angle": drawing(
    [...turned(-130, "−130°"), ref(-130, "50°")],
    "−130° ends on the terminal side of 230°, in Quadrant III, with reference angle 50°.",
    "−130° 与 230° 的终边相同，在第三象限，参考角为 50°。",
  ),
  "extending-the-trigonometric-ratios-to-negative-angles#ratios-of-opposite-angles": drawing(
    [
      ...circleAxes(),
      spoke(35, R, "result"),
      spoke(-35, R, "action"),
      seg(on(35, R), on(-35, R), undefined, true),
      ...dotAt(on(35, R), "(x, y)", "ne", "result"),
      ...dotAt(on(-35, R), "(x, −y)", "se", "action"),
      angle([0, 0], [R, 0], on(35, R), "result", "θ"),
      angle([0, 0], [R, 0], on(-35, R), "action", "−θ"),
    ],
    "θ and −θ are mirror images across the x-axis: (x, y) and (x, −y) share the cosine, and their sines are opposite.",
    "θ 和 −θ 关于 x 轴对称：(x, y) 和 (x, −y) 的余弦相同，正弦互为相反数。",
  ),
  "extending-the-trigonometric-ratios-to-large-angles#ratios-of-large-angles-in-degrees": drawing(
    [...cross(R + 0.3), spoke(200, R, "result"), ...sweep(920, 0.6, "action", 0.4), ref(200, "20°"), tip(200, "920°")],
    "920° is 2 full turns and 200° more: it ends in Quadrant III with reference angle 20°.",
    "920° 是转 2 整圈再转 200°：终边在第三象限，参考角为 20°。",
  ),
  "extending-the-trigonometric-ratios-to-large-angles#ratios-of-large-angles-in-radians": drawing(
    [...cross(R + 0.3), spoke(157.5, R, "result"), ...sweep(517.5, 0.7, "action", 0.6), ref(157.5, "π/8"), tip(157.5, "23π/8")],
    "23π/8 is one full turn and 7π/8 more: it ends in Quadrant II with reference angle π/8.",
    "23π/8 是转一整圈再转 7π/8：终边在第二象限，参考角为 π/8。",
  ),
  "extending-the-trigonometric-ratios-to-large-angles#signs-of-the-ratios-of-large-angles": drawing(
    [...cross(R + 0.3), spoke(280, R, "result"), ...sweep(1000, 0.6, "action", 0.4), tip(280, "1000°"), note([2.1, -1.6], "IV", "e")],
    "1000° is 2 full turns and 280° more, so it ends in Quadrant IV, where the cosine is positive and the sine negative.",
    "1000° 是转 2 整圈再转 280°，终边在第四象限，那里余弦为正、正弦为负。",
  ),
  "using-the-pythagorean-identity-in-the-first-quadrant#the-other-ratio-in-the-first-quadrant": drawing(
    dropped(Math.sqrt(21) / 5, 2 / 5, "(√21/5, 2/5)"),
    "With sin θ = 2/5 the point has height 2/5, and x² + y² = 1 gives its x-coordinate, cos θ = √21/5.",
    "sin θ = 2/5 时，点的高度为 2/5，由 x² + y² = 1 得横坐标 cos θ = √21/5。",
  ),
  "using-the-pythagorean-identity-in-the-first-quadrant#the-tangent-from-sine-or-cosine": drawing(
    dropped(1 / 3, (2 * Math.SQRT2) / 3, "(1/3, 2√2/3)"),
    "With cos θ = 1/3 the point is (1/3, 2√2/3), so tan θ = y/x = 2√2.",
    "cos θ = 1/3 时，点为 (1/3, 2√2/3)，所以 tan θ = y/x = 2√2。",
  ),
  "extending-the-pythagorean-identity-to-all-quadrants#sine-and-cosine-from-the-tangent": drawing(
    [
      ...cross(5.6),
      seg([0, 0], [-3, 4], "result"),
      seg([-3, 4], [-3, 0], "action", true),
      note([-1.5, 2], "5", "ne"),
      note([-3, 2], "4", "w"),
      note([-1.5, 0], "3", "s"),
      ...dotAt([-3, 4], "(−3, 4)", "nw", "result"),
    ],
    "The point (−3, 4) is 5 from the origin, so the point on the unit circle is (−3/5, 4/5).",
    "点 (−3, 4) 到原点的距离为 5，所以单位圆上的对应点是 (−3/5, 4/5)。",
  ),
  "finding-trigonometric-ratios-of-quadrantal-angles#sine-and-cosine-of-quadrantal-angles": drawing(
    [
      ...circleAxes(R, false),
      ...dotAt([R, 0], "0°: (1, 0)", "ne", "result"),
      ...dotAt([0, R], undefined, "n", "result"),
      note([0.35, R], "90°: (0, 1)", "ne"),
      ...dotAt([-R, 0], "180°: (−1, 0)", "nw", "result"),
      ...dotAt([0, -R], undefined, "n", "result"),
      note([0.35, -R], "270°: (0, −1)", "se"),
    ],
    "The terminal sides of 0°, 90°, 180° and 270° meet the unit circle at (1, 0), (0, 1), (−1, 0) and (0, −1).",
    "0°、90°、180°、270° 的终边与单位圆分别交于 (1, 0)、(0, 1)、(−1, 0)、(0, −1)。",
  ),
  "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range#quadrantal-angles-in-degrees-outside-the-standard-range": drawing(
    [...circleAxes(R, false), ...sweep(900, 0.6, "action", 0.3), ...dotAt([-R, 0], "900°: (−1, 0)", "nw", "result")],
    "900° is 2 full turns and 180° more, so it ends at (−1, 0).",
    "900° 是转 2 整圈再转 180°，所以终点在 (−1, 0)。",
  ),
  "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range#quadrantal-angles-in-radians-outside-the-standard-range": drawing(
    [
      ...circleAxes(R, false),
      ...sweep(630, 0.7, "action", 0.5),
      ...dotAt([0, -R], undefined, "n", "result"),
      note([0.35, -R], "7π/2: (0, −1)", "se"),
    ],
    "7π/2 is one full turn and 3π/2 more, so it ends at (0, −1).",
    "7π/2 是转一整圈再转 3π/2，所以终点在 (0, −1)。",
  ),
  "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle#special-angles-from-points-on-the-unit-circle": drawing(
    [...onCircle(240, "(−½, −√3/2)"), ...sweep(240), ref(240, "60°")],
    "(−½, −√3/2) is in Quadrant III with reference angle 60°, so the angle is 180° + 60° = 240°.",
    "(−½, −√3/2) 在第三象限，参考角为 60°，所以这个角是 180° + 60° = 240°。",
  ),
  "further-extensions-of-the-special-trigonometric-ratios#reciprocal-ratios-of-special-angles": drawing(
    [...onCircle(210, "(−√3/2, −½)"), ...sweep(210), ref(210, "π/6")],
    "7π/6 meets the unit circle at (−√3/2, −½); the reciprocal ratios come from these coordinates.",
    "7π/6 与单位圆交于 (−√3/2, −½)；倒数三角比由这两个坐标得到。",
  ),
  "further-extensions-of-the-special-trigonometric-ratios#special-angles-outside-the-standard-range": drawing(
    [...onCircle(60, "(½, √3/2)"), ...sweep(-300)],
    "−5π/3 turns clockwise to the terminal side of π/3, which meets the unit circle at (½, √3/2).",
    "−5π/3 顺时针转到 π/3 的终边，它与单位圆交于 (½, √3/2)。",
  ),

  "the-law-of-sines#a-side-opposite-a-known-angle": drawing(
    labeled(fromAngles(40, 65, 18.03), { names: ["A", "B", "C"], sides: [undefined, "a = 12", "b ≈ 16.9"], angles: ["40°", "65°"] }),
    "With A = 40°, B = 65° and a = 12, the side b opposite B is about 16.9.",
    "A = 40°，B = 65°，a = 12 时，B 所对的边 b 约为 16.9。",
  ),
  "the-law-of-sines#two-angles-and-the-included-side": drawing(
    labeled(fromAngles(50, 70, 10), { names: ["A", "B", "C"], sides: ["c = 10", "a ≈ 8.8"], angles: ["50°", "70°", "60°"] }),
    "With A = 50°, B = 70° and c = 10 between them, C = 60° and a ≈ 8.8.",
    "A = 50°，B = 70°，夹边 c = 10，则 C = 60°，a ≈ 8.8。",
  ),
  "the-law-of-sines#finding-an-angle": drawing(
    labeled(fromAngles(72, 37.7, 13.86), { names: ["A", "B", "C"], sides: [undefined, "a = 14", "b = 9"], angles: ["72°", "≈ 37.7°"] }),
    "With a = 14, b = 9 and A = 72°, the angle opposite the shorter side b is B ≈ 37.7°.",
    "a = 14，b = 9，A = 72° 时，较短边 b 所对的角 B ≈ 37.7°。",
  ),
  "the-law-of-sines#the-ambiguous-case": drawing(
    (() => {
      const C = on(35, 12);
      const d = Math.sqrt(81 - C[1] ** 2);
      const near: Point = [C[0] - d, 0];
      const far: Point = [C[0] + d, 0];
      return [
        seg([0, 0], [17, 0]),
        seg([0, 0], C),
        seg(C, near, "action"),
        seg(C, far, "result"),
        seg(C, [C[0], 0], undefined, true),
        note([C[0], 3], "h ≈ 6.88", "e"),
        note([C[0] / 2, C[1] / 2], "b = 12", "nw"),
        note(C, "C", "n"),
        note([0, 0], "A", "w"),
        note(near, "B₂", "s"),
        note(far, "B₁", "s"),
        note([(C[0] + near[0]) / 2, 3.5], "9", "w"),
        note([(C[0] + far[0]) / 2, 3.5], "9", "e"),
        angle([0, 0], [17, 0], C, undefined, "35°"),
        angle(far, near, C, "result", "≈ 49.9°"),
        angle(near, [0, 0], C, "action", "≈ 130.1°"),
      ];
    })(),
    "With A = 35°, b = 12 and a = 9, the height is about 6.88, less than a and a less than b: a meets the line twice, with B ≈ 49.9° or B ≈ 130.1°.",
    "A = 35°，b = 12，a = 9 时，高约为 6.88，小于 a，且 a 小于 b：a 与直线有两个交点，B ≈ 49.9° 或 B ≈ 130.1°。",
  ),
  "the-law-of-cosines#finding-a-side": drawing(
    labeled(fromSides(11, Math.sqrt(273), 8), { names: ["A", "B", "C"], sides: ["c = 11", "a = √273", "b = 8"], angles: ["120°"] }),
    "With b = 8, c = 11 and A = 120° between them, a² = 64 + 121 + 88 = 273.",
    "b = 8，c = 11，夹角 A = 120°，则 a² = 64 + 121 + 88 = 273。",
  ),
  "the-law-of-cosines#finding-an-angle-from-three-sides": drawing(
    labeled(fromSides(8, 7, 9), { names: ["A", "B", "C"], sides: ["c = 8", "a = 7", "b = 9"], angles: [undefined, undefined, "≈ 58.4°"] }),
    "With sides 7, 9 and 8, the angle opposite the side 8 is C ≈ 58.4°.",
    "三边为 7、9、8 时，边 8 所对的角 C ≈ 58.4°。",
  ),
  "the-law-of-cosines#an-obtuse-angle-from-three-sides": drawing(
    labeled(fromSides(10, 5, 6), {
      names: ["A", "B", "C"],
      sides: ["c = 10", "a = 5", "b = 6"],
      angles: [undefined, undefined, "≈ 130.5°"],
    }),
    "With sides 5, 6 and 10, the cosine of C is negative, so the angle opposite the longest side is obtuse: C ≈ 130.5°.",
    "三边为 5、6、10 时，cos C 为负，所以最长边所对的角是钝角：C ≈ 130.5°。",
  ),
  "the-area-of-a-general-triangle#two-sides-and-an-obtuse-or-acute-included-angle": drawing(
    labeled(fromSides(Math.sqrt(130 + 126 * Math.cos((50 * Math.PI) / 180)), 9, 7), {
      names: ["A", "B", "C"],
      sides: [undefined, "a = 9", "b = 7"],
      angles: [undefined, undefined, "130°"],
    }),
    "With a = 9, b = 7 and C = 130° between them, the area is ½ · 9 · 7 · sin 130° ≈ 24.1. The included angle is obtuse, and its sine is still positive.",
    "a = 9，b = 7，夹角 C = 130°，面积为 ½ · 9 · 7 · sin 130° ≈ 24.1。夹角是钝角，它的正弦仍为正。",
  ),
  "the-area-of-a-general-triangle#a-side-from-the-area": (() => {
    const a = 60 / (8 * Math.sin((48 * Math.PI) / 180));
    const t = fromSides(Math.sqrt(a * a + 64 - 16 * a * Math.cos((48 * Math.PI) / 180)), a, 8);
    return drawing(
      [
        ...labeled(t, { names: ["A", "B", "C"], sides: [undefined, "a ≈ 10.1", "b = 8"], angles: [undefined, undefined, "48°"] }),
        note([(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3], "area 30", "s"),
      ],
      "An area of 30 with b = 8 and included angle 48° gives a ≈ 10.1.",
      "面积为 30，b = 8，夹角 48°，得 a ≈ 10.1。",
    );
  })(),
  "the-area-of-a-general-triangle#area-from-three-sides": (() => {
    const t = fromSides(12, 7, 9);
    return drawing(
      [
        ...labeled(t, { names: ["A", "B", "C"], sides: ["c = 12", "a = 7", "b = 9"], angles: [undefined, undefined, "≈ 96.4°"] }),
        note([(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3], "area ≈ 31.3", "s"),
      ],
      "Sides 7, 9 and 12 give C ≈ 96.4° from the law of cosines, and then an area of about 31.3.",
      "三边 7、9、12 由余弦定理得 C ≈ 96.4°，进而得面积约为 31.3。",
    );
  })(),
  "modeling-using-the-law-of-sines#distances-from-two-points": drawing(
    labeled(fromAngles(62, 48, 200), { names: ["A", "B", "C"], sides: ["200 m"], angles: ["62°", "48°", "70°"] }),
    "Observers A and B, 200 m apart, sight C at 62° and 48°, so the angle at C is 70°.",
    "观察者 A、B 相距 200 m，看 C 的角度为 62° 和 48°，所以 C 处的角为 70°。",
  ),
  "modeling-using-the-law-of-sines#heights-from-two-angles-of-elevation": drawing(
    (() => {
      const T: Point = [30 + 51.45 * Math.cos((50 * Math.PI) / 180), 51.45 * Math.sin((50 * Math.PI) / 180)];
      return [
        seg([0, 0], [T[0], 0]),
        seg([T[0], 0], T, "result"),
        seg([0, 0], T),
        seg([30, 0], T, "action"),
        square([T[0], 0], [0, 0], T),
        note([0, 0], "A", "sw"),
        note([30, 0], "B", "s"),
        note(T, "T", "n"),
        note([15, 0], "30 m", "s"),
        note([T[0], T[1] / 2], "h ≈ 39.4", "e"),
        note([30 + (T[0] - 30) / 2, T[1] / 2], "≈ 51.45", "se"),
        angle([0, 0], [T[0], 0], T, undefined, "32°"),
        angle([30, 0], [T[0], 0], T, "action", "50°"),
        angle(T, [0, 0], [30, 0], "result", "18°"),
      ];
    })(),
    "From A the top T is at 32°, and from B, 30 m closer, at 50°. The angle at T is 18°, BT ≈ 51.45, and the height is about 39.4.",
    "从 A 看顶点 T 的仰角为 32°，从近 30 m 的 B 看为 50°。T 处的角为 18°，BT ≈ 51.45，高约为 39.4。",
  ),
  "modeling-using-the-law-of-sines#how-many-triangles-fit": drawing(
    (() => {
      const C = on(35, 12);
      const panel = (dx: number, a: number, s: string): Mark[] => {
        const d = a > C[1] ? Math.sqrt(a * a - C[1] ** 2) : 0;
        const ends: Point[] =
          a < C[1]
            ? []
            : a < 12
              ? [
                  [C[0] - d, 0],
                  [C[0] + d, 0],
                ]
              : [[C[0] + d, 0]];
        return shift(
          [
            seg([0, 0], [23, 0]),
            seg([0, 0], C),
            ...(ends.length === 0 ? [seg(C, [C[0], C[1] - a], "action")] : ends.map((p) => seg(C, p, "action"))),
            seg(C, [C[0], 0], undefined, true),
            note([11, -1.5], s, "s"),
          ],
          dx,
        );
      };
      return [...panel(0, 5, "a = 5: none"), ...panel(26, 9, "a = 9: two"), ...panel(52, 14, "a = 14: one")];
    })(),
    "For example, with A = 35° and b = 12 the height is about 6.88: a = 5 does not reach the line, a = 9 meets it twice, and a = 14 meets it on one side only.",
    "例如，A = 35°，b = 12 时，高约为 6.88：a = 5 够不到直线，a = 9 与直线有两个交点，a = 14 只在一侧与直线相交。",
  ),
  "modeling-using-the-law-of-cosines#distances-across-obstacles": drawing(
    labeled(fromSides(420, 472, 350), { names: ["P", "A", "B"], sides: ["420 m", "≈ 472 m", "350 m"], angles: ["75°"] }),
    "With PA = 420 m, PB = 350 m and 75° between them, the distance across is AB ≈ 472 m.",
    "PA = 420 m，PB = 350 m，夹角 75°，跨越的距离 AB ≈ 472 m。",
  ),
  "modeling-using-the-law-of-cosines#diverging-paths": drawing(
    labeled(fromSides(48, Math.sqrt(1296 + 2304 - 3456 * Math.cos((65 * Math.PI) / 180)), 36), {
      sides: ["48 km", "x ≈ 46.3 km", "36 km"],
      angles: ["65°"],
    }),
    "After 2 hours the ships have gone 36 km and 48 km on courses 65° apart, and are about 46.3 km from each other.",
    "2 小时后两艘船分别行驶了 36 km 和 48 km，航向夹角 65°，彼此相距约 46.3 km。",
  ),
  "modeling-using-the-law-of-cosines#angles-of-a-triangular-plot": drawing(
    labeled(fromSides(55, 70, 40), { sides: ["55 m", "70 m", "40 m"], angles: ["θ ≈ 93.6°"] }),
    "In a garden with sides 40 m, 55 m and 70 m, the angle opposite the 70 m side is θ ≈ 93.6°.",
    "三边为 40 m、55 m、70 m 的花园中，70 m 边所对的角 θ ≈ 93.6°。",
  ),
};
