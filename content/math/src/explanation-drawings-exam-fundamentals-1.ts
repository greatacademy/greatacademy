// Drawings of the SAT fundamentals explanations: angle pairs, tables as graphs, translations, triangles and inscribed figures.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { belowRim, box, dash, fill, moved, parallelCut, rt, tri } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { coneMarks, drawing, fromAngles, fromSides, graphed, note, on, ring, seg, square } from "./explanation-drawings-kit.ts";

/** inscribed draws an equilateral triangle in a circle of radius r around the origin, with its top corner on the vertical. */
const inscribed = (r: number): readonly [Point, Point, Point] => [on(210, r), on(330, r), on(90, r)];

const sq = Math.sqrt(3);
const s = 6;
const apothem = s / (2 * sq);
const around: readonly [Point, Point, Point] = [
  [-s / 2, -apothem],
  [s / 2, -apothem],
  [0, 2 * apothem],
];

/** examFundamentalsDrawings1 draws the explanations of SAT Math Fundamentals, by knowledge point: angle pairs, translated graphs, triangles and inscribed figures. */
export const examFundamentalsDrawings1: Readonly<Record<string, Figure>> = {
  "reasoning-from-direction-and-displacement#straight-line-distance-from-legs": graphed(
    wide(-1, 9, -1, 7),
    [
      toward([0, 0], [7, 0], "action"),
      toward([7, 0], [7, 5], "action"),
      toward([7, 5], [4, 5], "action"),
      toward([4, 5], [4, 3], "action"),
      toward([0, 0], [4, 3], "result"),
      tag([5.5, 0], "7", "n"),
      tag([7, 2.5], "5", "e"),
      tag([5.5, 5], "3", "n"),
      tag([4, 4], "2", "e"),
      tag([2, 1.5], "5", "nw"),
    ],
    "A walk of 7 east, 5 north, 3 west and 2 south is 17 long. Its end lies 4 east and 3 north of the start, so the colored straight line from start to end has length 5.",
    "向东 7、向北 5、向西 3、向南 2 的行程长 17。终点在起点以东 4、以北 3，所以从起点到终点的标色直线长 5。",
  ),
  "linear-functions-in-tabular-form#the-intercept-from-a-table": drawing(
    pane(0, [0, 5, 1], [0, 14, 2], 6, 5)
      .f((x) => 2 * x + 3, 2, 5)
      .f((x) => 2 * x + 3, 0, 2, "action", true)
      .dot(2, 7, "(2, 7)", "se")
      .dot(4, 11, "(4, 11)", "se")
      .dot(0, 3, "(0, 3)", "se", "result")
      .marks(),
    "For example, a table with entries (2, 7) and (4, 11) has slope 2. Stepping back along the dashed line to input 0 gives the colored y-intercept, 3.",
    "例如，表中有 (2, 7) 和 (4, 11)，斜率为 2。沿虚线退回到输入 0，得到标色的 y 轴截距 3。",
  ),
  "transformations-of-linear-functions-in-tabular-form#horizontal-shifts-from-a-table": graphed(
    wide(-1, 8, -1, 8, 99),
    [
      ln([1, 2], [2, 4]),
      ln([4, 2], [5, 4], "result"),
      toward([2, 4], [5, 4], "action"),
      pt([2, 4], "(2, 4)", "nw"),
      pt([5, 4], "(5, 4)", "se", "result"),
      tag([3.5, 4], "3", "n"),
    ],
    "For example, with h = 3, the graph of f moves 3 units right. The entry (2, 4) of f becomes the entry (5, 4) of g, on the colored line: same output, input increased by 3.",
    "例如，当 h = 3 时，f 的图象向右移 3 个单位。f 的 (2, 4) 变成 g 的 (5, 4)，在标色的直线上：输出不变，输入增加 3。",
  ),
  "transformations-of-linear-functions-in-tabular-form#a-reflection-from-a-table": graphed(
    wide(-5, 5, -1, 7, 99),
    [
      ln([0, 1], [1, 2]),
      ln([0, 2], [1, 1], "result"),
      dash([2, 3], [-2, 3], "action"),
      toward([-2, 3], [-2, 4], "action"),
      pt([2, 3], "(2, 3)", "e"),
      pt([-2, 4], "(−2, 4)", "w", "result"),
    ],
    "For example, with k = 1, finding g(−2) looks up f(2) = 3 across the y-axis, along the dashed line, and then adds 1. The colored point shows g(−2) = 4.",
    "例如，当 k = 1 时，求 g(−2) 要沿虚线跨过 y 轴查 f(2) = 3，再加 1。标色的点表示 g(−2) = 4。",
  ),
  "finding-equations-of-translated-functions#translating-a-quadratic": graphed(
    wide(-7, 4, -2, 8, 99),
    [
      curveOf((x) => x * x, undefined, -2.8, 2.8, true),
      curveOf((x) => (x + 3) ** 2, "result", -5.8, -0.2),
      toward([-2, 4], [-5, 4], "action"),
      tag([-3.5, 4], "3", "n"),
      pt([0, 0], "(0, 0)", "se"),
      pt([-3, 0], "(−3, 0)", "s", "result"),
    ],
    "For example, y = x², dashed, moved 3 units left gives the colored y = (x + 3)². A left shift by 3 uses x + 3, not x − 3.",
    "例如，虚线 y = x² 向左移 3 个单位，得到标色的 y = (x + 3)²。向左移 3 用 x + 3，而不是 x − 3。",
  ),
  "finding-equations-of-translated-functions#translating-a-line": graphed(
    wide(-3, 7, -5, 7, 99),
    [
      ln([0, 1], [1, 3], undefined, true),
      ln([0, -4], [1, -2], "result"),
      toward([0, 1], [3, 1], "action"),
      toward([3, 1], [3, 2], "action"),
      tag([1.5, 1], "3", "s"),
      tag([3, 1.5], "1", "e"),
      pt([0, -4], "(0, −4)", "e", "result"),
    ],
    "For example, y = 2x + 1, dashed, moved 3 right and 1 up. The colored image is parallel to it, with intercept 1 − 2 · 3 + 1 = −4.",
    "例如，虚线 y = 2x + 1 向右移 3、向上移 1。标色的像与它平行，截距是 1 − 2 · 3 + 1 = −4。",
  ),
  "finding-equations-of-translated-functions#where-a-point-moves": graphed(
    wide(-1, 7, -1, 8),
    [
      toward([1, 2], [4, 2], "action"),
      toward([4, 2], [4, 6], "action"),
      pt([1, 2], "(1, 2)", "n"),
      pt([4, 6], "(4, 6)", "n", "result"),
      tag([2.5, 2], "3", "s"),
      tag([4, 4], "4", "e"),
    ],
    "For example, with h = 3 and k = 4, the point (1, 2) moves 3 right and 4 up. The colored image is (4, 6).",
    "例如，当 h = 3、k = 4 时，点 (1, 2) 向右移 3、向上移 4。标色的像是 (4, 6)。",
  ),
  "transforming-polynomial-functions#zeros-after-a-transformation": graphed(
    wide(-7, 8, -4, 5, 99),
    [
      curveOf((x) => (x - 1) * (x - 4), undefined, -0.3, 5.3),
      curveOf((x) => (x - 3) * (x - 6), "result", 1.7, 7.3),
      curveOf((x) => (-x - 1) * (-x - 4), "action", -5.3, 0.3),
      pt([1, 0], "1", "sw"),
      pt([4, 0], "4", "se"),
      pt([3, 0], "3", "ne", "result"),
      pt([6, 0], "6", "se", "result"),
      pt([-1, 0], "−1", "se", "action"),
      pt([-4, 0], "−4", "sw", "action"),
    ],
    "For example, f has zeros at 1 and 4 and is drawn in black. The shift f(x − 2) moves them to 3 and 6. The reflection f(−x) turns them into −1 and −4.",
    "例如，f 的零点是 1 和 4，用黑色画出。平移 f(x − 2) 把它们移到 3 和 6。反射 f(−x) 把它们变成 −1 和 −4。",
  ),
  "solving-geometry-problems-by-manipulating-radicals#hypotenuse-in-radical-form": drawing(
    rt(6, 4, { sides: ["6", "4", "2√13"], sideStyles: [undefined, undefined, "result"] }),
    "Legs 4 and 6 are not part of a Pythagorean triple. The colored hypotenuse is √52, which simplifies to 2√13.",
    "直角边 4 和 6 不属于勾股数。标色的斜边是 √52，化简为 2√13。",
  ),
  "solving-problems-describing-congruent-triangles#a-perimeter-from-a-congruence": (() => {
    const t = fromSides(7, 5, 6);
    return drawing(
      [
        ...tri(t, { names: ["A", "B", "C"], sides: ["2x + 1", "5", "6"], sideStyles: ["action"] }),
        ...tri(moved(t, 9.5, 1, 0), { names: ["D", "E", "F"], sides: ["7", undefined, undefined], sideStyles: ["action"] }),
      ],
      "For example, AB matches DE, so 2x + 1 = 7 and x = 3. The sides 5 and 6 transfer across, so both perimeters are 18.",
      "例如，AB 对应 DE，所以 2x + 1 = 7，x = 3。边 5 和 6 可以转移过去，所以两个周长都是 18。",
    );
  })(),
  "reasoning-about-congruent-triangles#the-information-that-is-not-enough": (() => {
    const t = fromAngles(50, 60, 3);
    const styles = ["result", "action", "accent"] as const;
    return drawing(
      [
        ...tri(t, { angles: ["", "", ""], angleStyles: styles }),
        ...tri(moved(t, 4.2, 1.8, 0), { angles: ["", "", ""], angleStyles: styles }),
      ],
      "Two triangles with the same three angles, each pair in one color, but of different sizes. They are similar and not congruent.",
      "两个三角形的三个角都相同，每对用一种颜色标出，但大小不同。它们相似，但不全等。",
    );
  })(),
  "solving-angle-problems-from-descriptions-of-similar-triangles#angles-given-by-expressions": (() => {
    const t = fromAngles(50, 60, 4);
    const top = moved(t, 5.4, 1, 0);
    return drawing(
      [
        ...tri(t, { angles: [undefined, undefined, ""], angleStyles: [undefined, undefined, "result"] }),
        note(t[2], "(3x + 10)°", "n"),
        ...tri(top, { angles: [undefined, undefined, ""], angleStyles: [undefined, undefined, "result"] }),
        note(top[2], "70°", "n"),
      ],
      "For example, an angle (3x + 10)° matches an angle of 70° in the similar triangle. Setting them equal gives x = 20, between 0° and 180° once substituted.",
      "例如，角 (3x + 10)° 与相似三角形中的 70° 角对应。令它们相等得 x = 20，代回后角在 0° 和 180° 之间。",
    );
  })(),
  "solving-angle-problems-from-descriptions-of-similar-triangles#angles-in-a-stated-ratio": (() => {
    const t = fromAngles(40, 60, 4);
    return drawing(
      tri(t, { angles: ["40°", "60°", "80°"], angleStyles: ["result", "result", "result"] }),
      "For example, angles in the ratio 2 : 3 : 4 share 180° in 9 parts of 20°. The colored angles are 40°, 60° and 80°, and a similar triangle has the same three.",
      "例如，比为 2 : 3 : 4 的角把 180° 分成 9 份，每份 20°。标色的角是 40°、60° 和 80°，相似三角形也有相同的三个角。",
    );
  })(),
  "reasoning-about-similar-triangles#an-area-from-a-side-ratio": (() => {
    const [a, b, c] = fromSides(2, 2.4, 2.8);
    const big = moved([a, b, c], 3.6, 2, 0);
    const mid = (p: Point, q: Point): Point => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return drawing(
      [
        fill([a, b, c], "result"),
        ...tri([a, b, c], { sides: ["1"] }),
        fill([big[0], mid(big[0], big[1]), mid(big[0], big[2])], "result"),
        ...tri(big, { sides: ["2"] }),
        seg(mid(big[0], big[1]), mid(big[0], big[2])),
        seg(mid(big[0], big[1]), mid(big[1], big[2])),
        seg(mid(big[0], big[2]), mid(big[1], big[2])),
      ],
      "For example, a side ratio of 2. The larger triangle holds 4 copies of the smaller colored one, so its area is 2² = 4 times as large.",
      "例如，边长比为 2。较大的三角形可以容纳 4 个标色的小三角形，所以它的面积是 2² = 4 倍。",
    );
  })(),
  "solving-parallel-line-problems-from-descriptions#equal-angle-pairs": drawing(
    parallelCut(
      70,
      [
        [3, "result", "(3x + 10)°"],
        [6, "result", "(5x − 30)°"],
      ],
      3.4,
      4,
    ),
    "For example, alternate interior angles written as expressions are equal, so 3x + 10 = 5x − 30 and x = 20. The drawing is to scale, with both at 70°.",
    "例如，用式子表示的内错角相等，所以 3x + 10 = 5x − 30，x = 20。图按比例画出，两个角都是 70°。",
  ),
  "solving-parallel-line-problems-from-descriptions#supplementary-angle-pairs": drawing(
    [
      ...parallelCut(
        80,
        [
          [4, "action"],
          [6, "result"],
        ],
        4,
      ),
      note([1.5, 3.1], "(3x + 10)°", "e"),
      note([1.1, 0.9], "(2x + 20)°", "e"),
    ],
    "For example, consecutive interior angles on the same side add up to 180°, so 5x + 30 = 180 and x = 30. They are drawn to scale at 100° and 80°, which are not equal.",
    "例如，同一侧的同旁内角相加为 180°，所以 5x + 30 = 180，x = 30。它们按比例画为 100° 和 80°，并不相等。",
  ),
  "solving-parallel-line-problems-from-descriptions#the-other-angle-after-solving": drawing(
    parallelCut(
      70,
      [
        [2, "action", "70°"],
        [1, "result", "110°"],
      ],
      3.4,
      4,
    ),
    "For example, solving gives an angle of 70°. The colored angle next to it along the transversal is its supplement, 110°.",
    "例如，解得一个角是 70°。沿截线与它相邻的标色角是它的补角 110°。",
  ),
  "working-with-descriptions-of-similar-solids#volumes-from-a-length-ratio": drawing(
    [...coneMarks(1.5, 3, undefined, "h"), belowRim(1.5, "r"), ...shift(coneMarks(3, 6, "2r", "2h"), 6)],
    "A cone twice as tall and twice as wide as another. Each of the three lengths in its volume doubles, so it holds 2³ = 8 times as much.",
    "一个圆锥的高和宽都是另一个的两倍。体积中的三个长度都翻倍，所以容积是 2³ = 8 倍。",
  ),
  "border-problems#area-of-a-border": drawing(
    [
      ...box(0, 0, 14, 10, { bottom: "l + 2x", right: "w + 2x", shade: "result" }),
      fill([
        [2, 2],
        [12, 2],
        [12, 8],
        [2, 8],
      ]),
      ...box(2, 2, 10, 6, { inside: "w × l" }),
      seg([0, 5], [2, 5], "action"),
      seg([12, 5], [14, 5], "action"),
      note([1, 5], "x", "n"),
      note([13, 5], "x", "n"),
    ],
    "The colored border adds x on both sides of each dimension, so the outer rectangle is w + 2x by l + 2x. Its area is the outer area minus the inner area. Drawn for w = 6, l = 10, x = 2.",
    "标色的边框在每个方向的两边都加 x，所以外矩形是 w + 2x 乘 l + 2x。边框面积是外面积减内面积。按 w = 6、l = 10、x = 2 画出。",
  ),
  "constructing-functions-representing-properties-of-2d-shapes#area-as-a-function": drawing(
    box(0, 0, 9, 3, { bottom: "2w + 3", right: "w", shade: "result" }),
    "Every length written with w: width w and length 2w + 3. The colored area is their product, A(w) = w(2w + 3). Drawn for w = 3.",
    "每个长度都用 w 表示：宽 w，长 2w + 3。标色的面积是它们的积，A(w) = w(2w + 3)。按 w = 3 画出。",
  ),
  "constructing-functions-representing-properties-of-2d-shapes#area-from-a-fixed-perimeter": drawing(
    box(0, 0, 7, 3, { bottom: "P/2 − x", right: "x", shade: "result" }),
    "Width x leaves P/2 − x of half the perimeter for the length. The colored area is x(P/2 − x). Drawn for P = 20 and x = 3.",
    "宽 x 从半周长中留下 P/2 − x 作为长。标色的面积是 x(P/2 − x)。按 P = 20、x = 3 画出。",
  ),
  "constructing-functions-representing-properties-of-2d-shapes#area-as-a-function-of-the-perimeter": drawing(
    box(0, 0, 8, 4, { bottom: "P/3", right: "P/6", shade: "result" }),
    "For example, a rectangle with length twice its width. Six widths make the perimeter, so the width is P/6 and the length P/3. The colored area is P²/18.",
    "例如，长是宽两倍的矩形。周长等于六个宽，所以宽是 P/6，长是 P/3。标色的面积是 P²/18。",
  ),
  "equilateral-triangles-inscribed-in-circles#area-from-the-radius": drawing(
    [
      ring(4),
      fill(inscribed(4), "result"),
      ...tri(inscribed(4), { sides: ["r√3"] }),
      seg([0, 0], on(330, 4)),
      note(on(330, 2), "r", "ne"),
      seg(on(90, 4), [0, -2], undefined, true),
      note([0, 0.7], "3r/2", "w"),
    ],
    "The inscribed equilateral triangle has side r√3 and height 3r/2, dashed. Half the base times the height gives the colored area, (3√3/4)r².",
    "内接正三角形的边长是 r√3，高（虚线）是 3r/2。底乘高的一半得到标色的面积 (3√3/4)r²。",
  ),
  "equilateral-triangles-inscribed-in-circles#the-perimeter-from-the-radius": drawing(
    [
      ring(4),
      ...tri(inscribed(4), { sides: ["6", "6", "6"], sideStyles: ["result", "result", "result"] }),
      seg([0, 0], on(330, 4)),
      note(on(330, 2), "2√3", "sw"),
    ],
    "For example, a radius of 2√3. Each colored side is the radius times √3, which is 6, so the perimeter is 18.",
    "例如，半径为 2√3。每条标色的边是半径乘 √3，即 6，所以周长是 18。",
  ),
  "circles-inscribed-in-equilateral-triangles#area-of-the-inscribed-circle": drawing(
    [
      fill(
        Array.from({ length: 72 }, (_, i) => on(i * 5, apothem)),
        "result",
      ),
      ring(apothem),
      ...tri(around, { sides: ["s"] }),
      seg([0, 0], [0, -apothem]),
      note([0, -apothem / 2], "r", "e"),
    ],
    "The inscribed circle has radius r = (√3/6)s. Squaring removes the root, so the colored area is πs²/12.",
    "内切圆的半径 r = (√3/6)s。平方后根号消失，所以标色的面积是 πs²/12。",
  ),
  "circles-inscribed-in-equilateral-triangles#the-side-from-the-inradius": drawing(
    [
      ring(apothem),
      ...tri(around, { sides: ["2√3 r"], sideStyles: ["result"] }),
      seg([0, 0], [0, -apothem]),
      seg([0, 0], [0, 2 * apothem], undefined, true),
      note([0, -apothem / 2], "r", "e"),
      note([0, 2.2], "2r", "e"),
    ],
    "The height is three inradii: r below the center and 2r above it. It is also the side times √3/2, so the colored side is 2√3 r.",
    "高是内切圆半径的三倍：圆心以下 r，以上 2r。它也等于边长乘 √3/2，所以标色的边是 2√3 r。",
  ),
  "areas-of-inscribed-triangles#greatest-inscribed-triangle-on-a-diameter": drawing(
    [
      ring(4),
      seg([-4, 0], [4, 0]),
      seg([-4, 0], on(125, 4)),
      seg([4, 0], on(125, 4)),
      seg(on(125, 4), [on(125, 4)[0], 0], undefined, true),
      note([on(125, 4)[0], 1.2], "h", "e"),
      ...shift(
        [
          ring(4),
          ...tri(
            [
              [-4, 0],
              [4, 0],
              [0, 4],
            ],
            { sideStyles: [undefined, "result", "result"] },
          ),
          seg([0, 0], [0, 4], "result", true),
          note([0, 2], "r", "e"),
        ],
        9.5,
      ),
    ],
    "On the diameter 2r, the area is rh. On the left, the height h, dashed, is smaller than the radius. On the right, the colored triangle reaches the top of the circle, where h = r, so its area is the greatest, r².",
    "以直径 2r 为底，面积是 rh。左图中，虚线表示的高 h 小于半径。右图中，标色的三角形到达圆顶，此时 h = r，所以面积最大，为 r²。",
  ),
  "areas-of-inscribed-triangles#the-radius-from-the-legs": (() => {
    const C = on(180 - (2 * (Math.atan(3 / 4) * 180)) / Math.PI, 5);
    return drawing(
      [
        ring(5),
        seg([-5, 0], [5, 0], "result"),
        seg([5, 0], C),
        seg(C, [-5, 0]),
        square(C, [5, 0], [-5, 0]),
        note([(5 + C[0]) / 2, C[1] / 2], "8", "sw"),
        note([(-5 + C[0]) / 2, C[1] / 2], "6", "se"),
        note([0, 0], "10", "s"),
      ],
      "For example, legs of 6 and 8 opposite a diameter make a right angle. The colored diameter is 10, so the radius is 5.",
      "例如，长 6 和 8 的两条边与直径相对，夹角是直角。标色的直径是 10，所以半径是 5。",
    );
  })(),
};
