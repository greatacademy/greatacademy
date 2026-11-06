// Drawings of the remaining explanations in the school shard: counting, number lines, rectangles, reflections, polygons and undoing motions.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { go } from "./explanation-drawings-algebra-kit.ts";
import { tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { box, dash, numberLine } from "./explanation-drawings-exam-kit.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { angle, drawing, graphed, note, on, ring, seg, wedge } from "./explanation-drawings-kit.ts";
import { dot, outline, outlineOn } from "./explanation-drawings-remaining-kit.ts";

/** piece draws one thing of a mix at a place of the grid: a circle in color, a square or a triangle. */
const piece = (kind: string, at: Point): Mark[] => {
  const [x, y] = at;
  if (kind === "o") return [wedge(0, 360, 0.42, at, "result"), ring(0.42, at, "result")];
  if (kind === "s") {
    return outline([
      [x - 0.36, y - 0.36],
      [x + 0.36, y - 0.36],
      [x + 0.36, y + 0.36],
      [x - 0.36, y + 0.36],
    ]);
  }
  return outline([
    [x - 0.42, y - 0.36],
    [x + 0.42, y - 0.36],
    [x, y + 0.42],
  ]);
};

const mix = ["ostoo", "tosts", "sotto"];
const octagon: Point[] = Array.from({ length: 8 }, (_, i) => on(247.5 + 45 * i, 3));
const v0 = octagon[0] as Point;
const v1 = octagon[1] as Point;
const v2 = octagon[2] as Point;
const past: Point = [v1[0] + 2.4, v1[1]];
const line = numberLine(-6, 3);

/** remainingDrawings2 draws the explanations of the school shard that earlier tables leave out: counting, number lines, rectangles, reflections, polygons and undoing motions. */
export const remainingDrawings2: Readonly<Record<string, Figure>> = {
  "sorting-and-counting-data#counting-one-kind-in-a-mix": drawing(
    mix.flatMap((row, r) => [...row].flatMap((kind, c) => piece(kind, [c * 1.5, (2 - r) * 1.5]))),
    "For example, a mix of three kinds. Choose the circles, in color, and go through the rows from left to right, touching each one as you count. There are 6.",
    "例如，三种东西混在一起。选圆形（标色），一行一行从左到右，数到一个就碰一下。一共有 6 个。",
  ),
  "fractions-on-the-number-line#choosing-the-number-line-of-a-fraction": drawing(
    [
      seg([-0.3, 0], [4.3, 0]),
      ...[0, 1, 2, 3, 4].map((v) => seg([v, -0.14], [v, 0.14])),
      note([0, -0.1], "0", "s"),
      note([4, -0.1], "1", "s"),
      seg([0, 0], [3, 0], "action"),
      dot([3, 0], "result"),
      note([3, 0.1], "3/4", "n"),
    ],
    "For example, 3/4. The denominator cuts the line from 0 to 1 into 4 equal parts, which takes 5 tick marks, and the numerator counts 3 parts from 0, in color.",
    "例如，3/4。分母把 0 到 1 的线段分成 4 等份，共有 5 个刻度，分子从 0 数 3 份（标色）。",
  ),
  "modeling-with-rectangles#a-rectangle-from-its-perimeter-and-a-side-comparison": drawing(
    [...box(0, 0, 8, 4, { bottom: "8", right: "4", shade: "result" }), seg([4, 0], [4, 4], undefined, true)],
    "For example, a perimeter of 24 with the length 2 times the width. Half the perimeter, 12, makes 3 equal parts, so the width is 4 and the length 8. The colored area is 32.",
    "例如，周长 24，长是宽的 2 倍。周长的一半 12 分成 3 等份，所以宽是 4，长是 8。标色的面积是 32。",
  ),
  "solving-real-world-problems-using-coordinates#the-area-of-a-rectangle-from-its-corners": graphed(
    wide(-1, 8, -1, 6),
    [
      shape(
        [
          [1, 1],
          [6, 1],
          [6, 4],
          [1, 4],
        ],
        "result",
      ),
      ...outlineOn([
        [1, 1],
        [6, 1],
        [6, 4],
        [1, 4],
      ]),
      pt([1, 1], "(1, 1)", "ne"),
      pt([6, 4], "(6, 4)", "sw"),
      tag([3.5, 4], "5", "n"),
      tag([6, 2.5], "3", "e"),
    ],
    "For example, opposite corners (1, 1) and (6, 4). The first coordinates give 6 − 1 = 5 and the second give 4 − 1 = 3, so the colored area is 15.",
    "例如，相对的两个角是 (1, 1) 和 (6, 4)。第一个坐标给出 6 − 1 = 5，第二个给出 4 − 1 = 3，所以标色的面积是 15。",
  ),
  "coordinate-planes-as-maps#the-area-of-a-rectangle-on-a-map": graphed(
    wide(-1, 9, -1, 7),
    [
      shape(
        [
          [2, 1],
          [7, 1],
          [7, 5],
          [2, 5],
        ],
        "result",
      ),
      ...outlineOn([
        [2, 1],
        [7, 1],
        [7, 5],
        [2, 5],
      ]),
      tag([4.5, 5], "7 − 2 = 5", "n"),
      tag([7, 3], "5 − 1 = 4", "e"),
    ],
    "For example, a rectangle with x-coordinates 2 and 7 and y-coordinates 1 and 5. The width is 5, the height is 4 and the colored area is 20 grid squares.",
    "例如，矩形的 x 坐标是 2 和 7，y 坐标是 1 和 5。宽是 5，高是 4，标色的面积是 20 个方格。",
  ),
  "finding-side-lengths-using-fraction-division#the-perimeter-from-a-fractional-area": drawing(
    box(0, 0, 6, 2, { bottom: "3/2", right: "1/2", inside: "3/4", line: "action" }),
    "For example, an area of 3/4 and a side of 3/2. Dividing gives the other side, 1/2, and adding and doubling gives the colored perimeter, 4 units.",
    "例如，面积 3/4，一边 3/2。相除得另一边 1/2，相加再乘 2 得标色的周长 4 个单位。",
  ),
  "reflections-of-points-in-the-coordinate-plane#choosing-the-drawing-of-a-reflected-point": graphed(
    wide(-1, 6, -4, 4, 99),
    [
      dash([3, 2], [3, -2], "action"),
      pt([3, 2], "(3, 2)", "e"),
      pt([3, -2], "(3, −2)", "e", "result"),
      tag([3, 1], "2", "w"),
      tag([3, -1], "2", "w"),
    ],
    "For example, (3, 2) reflected across the x-axis. The axis lies exactly halfway between the point and its colored image, 2 from each.",
    "例如，(3, 2) 关于 x 轴反射。x 轴正好在点和标色的像中间，与两者距离都是 2。",
  ),
  "reflections-of-points-in-the-coordinate-plane#marking-a-reflected-point": graphed(
    wide(-6, 6, -4, 4, 99),
    [
      dash([3, 2], [3, -2], "result"),
      dash([3, 2], [-3, 2], "action"),
      pt([3, 2], "(3, 2)", "e"),
      pt([3, -2], "(3, −2)", "e", "result"),
      pt([-3, 2], "(−3, 2)", "w", "action"),
    ],
    "For example, (3, 2). Across the x-axis it moves down to (3, −2), so the second coordinate changes sign. Across the y-axis it moves left to (−3, 2), so the first coordinate does.",
    "例如，(3, 2)。关于 x 轴反射时向下移到 (3, −2)，第二个坐标变号。关于 y 轴反射时向左移到 (−3, 2)，第一个坐标变号。",
  ),
  "representing-solutions-to-inequalities-on-number-lines#choosing-the-number-line-of-an-inequality": drawing(
    [...line.marks, dot(line.at(-3), "result"), ...go(line.at(-3), line.at(3), "result")],
    "For example, −2x ≤ 6. Dividing by −2 reverses the sign, so x ≥ −3. The filled dot means −3 is a solution, and the colored arrow points toward the other solutions.",
    "例如，−2x ≤ 6。除以 −2 使不等号反向，所以 x ≥ −3。实心点表示 −3 是解，标色的箭头指向其他解。",
  ),
  "exterior-angles-of-polygons#sides-from-the-ratio-of-interior-to-exterior": drawing(
    [...outline(octagon), seg(v1, past, undefined, true), angle(v1, v0, v2, undefined, "135°"), angle(v1, past, v2, "result", "45°")],
    "For example, interior to exterior 3 : 1. Splitting 180° in that ratio gives 135° and the colored 45°, and 360° ÷ 45° = 8 sides.",
    "例如，内角比外角为 3 : 1。把 180° 按此比分开得 135° 和标色的 45°，360° ÷ 45° = 8 条边。",
  ),
  "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another#undoing-the-sequence": graphed(
    wide(-1, 9, -3, 7, 99),
    [
      ...outlineOn([
        [1, 1],
        [2, 1],
        [1, 2],
      ]),
      dash([3, 3], [6, 3]),
      dash([6, 3], [3, 6]),
      dash([3, 6], [3, 3]),
      ...outlineOn(
        [
          [5, -2],
          [8, -2],
          [5, 1],
        ],
        "result",
      ),
      toward([5, -2], [3, 3], "action"),
      toward([3, 3], [1, 1], "action"),
      tag([0.8, 1.5], "F", "w"),
      tag([6.2, -1.3], "G", "ne"),
    ],
    "F is dilated by 3, dashed, and moved by (2, −5) onto the colored G. The arrows undo this in reverse order: first the move (−2, 5), then the dilation by 1/3.",
    "F 放大 3 倍（虚线），再平移 (2, −5) 到标色的 G。箭头按相反顺序撤销：先平移 (−2, 5)，再缩放 1/3。",
  ),
};
