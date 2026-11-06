// Drawings of the ACT explanations: dimensions, number lines, areas, graphs of functions, and ratios and trigonometric graphs.

import type { Figure } from "@ga/content";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { standard, wide } from "./explanation-drawings-curves.ts";
import { box, dash, fill, hop, numberLine, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { pt, shift } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, on, seg } from "./explanation-drawings-kit.ts";

/** examActDrawings1 draws the explanations of ACT Math Prep, by knowledge point: dimensions, number lines, areas, graphs and trigonometry. */
export const examActDrawings1: Readonly<Record<string, Figure>> = {
  "act-exam-writing-structural-linear-models#harder-exam-question": drawing(
    box(0, 0, 11, 3, { bottom: "2w + 5", right: "w", top: "2w + 5", left: "w", line: "result" }),
    "A rectangle of width w and length 2w + 5, drawn to scale for w = 3. The colored perimeter counts each side twice, the 5 as well as the w part.",
    "宽为 w、长为 2w + 5 的长方形，按 w = 3 的比例画出。标色的周长把每条边算两次，5 和 w 的部分都要加倍。",
  ),
  "act-exam-modeling-with-nonlinear-equations#exam-question": drawing(
    box(0, 0, 7, 5, { bottom: "w + 2", right: "w", inside: "35", shade: "result" }),
    "A rectangle of width w and length w + 2, drawn to scale for its area of 35. The shaded area is the product of the sides, w(w + 2).",
    "宽为 w、长为 w + 2 的长方形，按面积 35 的比例画出。阴影面积是两边的积 w(w + 2)。",
  ),
  "act-exam-comparing-signed-number-changes#exam-question": (() => {
    const l = numberLine(-6, 9, 3);
    return drawing(
      [...l.marks, ...hop(l, -6, 9, 0.5, "15", "result")],
      "On a number line, the distance from −6 to 9 is the colored arrow, 15 degrees, and it passes through 0.",
      "在数轴上，从 −6 到 9 的距离是标色的箭头，15 度，并且经过 0。",
    );
  })(),
  "act-exam-locating-numbers-on-a-number-line#exam-question": (() => {
    const l = numberLine(-6, 4, 1);
    return drawing(
      [
        ...l.marks,
        ...hop(l, -1, -5, 0.5, "4", "result"),
        seg([l.at(-1)[0], 0.5], [l.at(3)[0], 0.5], undefined, true),
        note([l.at(1)[0], 0.5], "4", "n"),
      ],
      "From −1, 4 units left ends at −5, the colored arrow. The dashed move to the right ends at 3, the wrong direction.",
      "从 −1 向左 4 个单位到达 −5，即标色的箭头。向右的虚线到达 3，方向错误。",
    );
  })(),
  "act-exam-finding-the-area-of-a-triangle#exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [8, 0],
          [3, 5],
        ],
        "result",
      ),
      ...tri(
        [
          [0, 0],
          [8, 0],
          [3, 5],
        ],
        { sides: ["8"] },
      ),
      seg([3, 0], [3, 5], "action", true),
      { kind: "right", vertex: [3, 0], from: [8, 0], to: [3, 5] },
      seg([0, 0], [0, 5], undefined, true),
      seg([0, 5], [8, 5], undefined, true),
      seg([8, 5], [8, 0], undefined, true),
      note([3, 2.5], "5", "e"),
    ],
    "The shaded triangle has base 8 and perpendicular height 5, so its area is half of the dashed rectangle around it: 20.",
    "阴影三角形底为 8，垂直高为 5，所以面积是外面虚线长方形的一半：20。",
  ),
  "act-exam-finding-the-area-of-a-triangle#harder-exam-question": drawing(
    [
      fill(
        [
          [0, 0],
          [14, 0],
          [14, 6],
        ],
        "result",
      ),
      ...rt(14, 6, { sides: ["14", "6"] }),
    ],
    "The legs 14 and 6 are perpendicular, so they serve as base and height. The shaded area is 42; the hypotenuse plays no part.",
    "直角边 14 和 6 互相垂直，所以可作底和高。阴影面积是 42；斜边不起作用。",
  ),
  "act-exam-finding-a-side-from-equal-areas#exam-question": drawing(
    [
      ...box(0, 0, 25, 4, { bottom: "25", right: "4", inside: "100" }),
      ...box(0, 6, 10, 10, { right: "10", inside: "100", shade: "result" }),
    ],
    "The 4 by 25 rectangle and the shaded square have the same area, 100. So the square's side is 10.",
    "4 乘 25 的长方形和阴影正方形面积相同，都是 100。所以正方形的边长是 10。",
  ),
  "act-exam-finding-a-side-from-equal-areas#harder-exam-question": drawing(
    [
      ...tri(
        [
          [0, 0],
          [10, 0],
          [3, 6],
        ],
        { sides: ["10"] },
      ),
      seg([3, 0], [3, 6], undefined, true),
      note([3, 3], "6", "e"),
      note([5.6, 0.6], "30", "n"),
      ...box(12, 0, 5, 6, { bottom: "5", right: "6", inside: "30", shade: "result" }),
    ],
    "The triangle with base 10 and height 6 has area 30, half the product. The shaded rectangle has the same area, so width 5 gives length 6.",
    "底为 10、高为 6 的三角形面积是 30，即乘积的一半。阴影长方形面积相同，所以宽 5 对应长 6。",
  ),
  "act-exam-finding-the-perimeter-of-a-rectangle#exam-question": drawing(
    box(0, 0, 7, 4, { bottom: "7", right: "4", top: "7", left: "4", line: "result" }),
    "The perimeter of the 7 by 4 rectangle is the colored distance around all four sides, 22.",
    "7 乘 4 的长方形的周长是标色的四条边一周，为 22。",
  ),
  "act-exam-finding-inputs-of-exponential-functions#harder-exam-question": drawing(
    pane(0, [0, 3, 1], [0, 90, 15], 6, 5)
      .f((x) => 2 ** (4 * x - 2), 0, 2.1)
      .f((x) => 4 ** (x + 1), 0, 2.2)
      .path(
        [
          [2, 0],
          [2, 64],
        ],
        "action",
        true,
      )
      .dot(2, 64, "(2, 64)", "w", "result")
      .say(2.3, 80, "4ˣ⁺¹", "e")
      .say(1.6, 14, "2⁴ˣ⁻²", "e")
      .marks(),
    "Where the graphs of 2⁴ˣ⁻² and 4ˣ⁺¹ meet, the values are equal. They cross at x = 2, the colored point.",
    "2⁴ˣ⁻² 和 4ˣ⁺¹ 的图象相交处函数值相等。它们交于 x = 2，即标色的点。",
  ),
  "act-exam-identifying-features-of-logarithmic-functions#harder-exam-question": drawing(
    pane(0, [0, 12, 2], [0, 8, 2], 6, 5)
      .f((x) => Math.log(x - 2) / Math.log(3) + 4, 2.02, 12)
      .path(
        [
          [2, 0],
          [2, 8],
        ],
        "result",
        true,
      )
      .say(2, 7, "x = 2", "e")
      .say(8.5, 7, "y = log₃(x − 2) + 4", "s")
      .marks(),
    "The graph of y = log₃(x − 2) + 4 falls steeply toward the colored dashed line x = 2, where the input of the logarithm is 0. The added 4 only moves the graph up.",
    "y = log₃(x − 2) + 4 的图象向标色虚线 x = 2 急剧下降，那里对数的输入为 0。加 4 只是把图象上移。",
  ),
  "act-exam-reading-domain-from-a-graph#exam-question": graphed(
    wide(-2, 7, -4, 5),
    [
      solid([1, -2], [5, 3]),
      dash([1, -2], [1, 0], "action"),
      dash([5, 3], [5, 0], "action"),
      solid([1, 0], [5, 0], "result"),
      pt([1, -2], "(1, −2)", "e"),
      pt([5, 3], "(5, 3)", "e"),
    ],
    "Looking from the ends of the segment to the x-axis, along the dashed lines, gives the colored stretch from 1 to 5. That is the domain.",
    "沿虚线从线段两端看向 x 轴，得到从 1 到 5 的标色部分。这就是定义域。",
  ),
  "act-exam-reading-domain-from-a-graph#harder-exam-question": graphed(
    wide(-2, 7, -4, 5),
    [
      solid([1, -2], [5, 3]),
      dash([1, -2], [0, -2], "action"),
      dash([5, 3], [0, 3], "action"),
      solid([0, -2], [0, 3], "result"),
      pt([1, -2], "(1, −2)", "e"),
      pt([5, 3], "(5, 3)", "e"),
    ],
    "Looking from the ends of the segment to the y-axis, along the dashed lines, gives the colored stretch from −2 to 3. That is the range.",
    "沿虚线从线段两端看向 y 轴，得到从 −2 到 3 的标色部分。这就是值域。",
  ),
  "act-exam-finding-asymptotes-of-a-rational-function#exam-question": graphed(
    wide(-7, 3, -5, 5),
    [
      curveOf((x) => 3 / (x + 2), undefined, -7, -2.6),
      curveOf((x) => 3 / (x + 2), undefined, -1.4, 3),
      dash([-2, -5], [-2, 5], "result"),
      tag([-2, 4], "x = −2", "w"),
    ],
    "The graph of y = 3/(x + 2) has a colored dashed vertical asymptote at x = −2, where the denominator is zero.",
    "y = 3/(x + 2) 的图象在分母为零的 x = −2 处有一条标色的竖直渐近虚线。",
  ),
  "act-exam-finding-asymptotes-of-a-rational-function#harder-exam-question": graphed(
    wide(-12, 6, -8, 10, 2),
    [
      curveOf((x) => 1 - 6 / (x + 3), undefined, -12, -3.67),
      curveOf((x) => 1 - 6 / (x + 3), undefined, -2.33, 6),
      dash([-12, 1], [6, 1], "result"),
      dash([-3, -8], [-3, 10]),
      tag([3.5, 1], "y = 1", "n"),
    ],
    "For very large x, the fraction approaches 2, and the outside −1 shifts this level down. So the graph settles on the colored dashed line y = 1.",
    "x 很大时分式趋于 2，外面的 −1 把这个水平下移。所以图象趋近标色虚线 y = 1。",
  ),
  "act-exam-translating-horizontally-and-reflecting-graphs#harder-exam-question": graphed(
    wide(-3, 7, -7, 7, 2),
    [
      curveOf((x) => (x - 2) ** 2 - 5, undefined, undefined, undefined, true),
      curveOf((x) => -((x - 2) ** 2) + 5, "result"),
      dash([2, -5], [2, 5], "action"),
      pt([2, -5], "(2, −5)", "e"),
      pt([2, 5], "(2, 5)", "e", "result"),
    ],
    "Reflecting the dashed y = (x − 2)² − 5 across the x-axis gives the colored parabola. Its vertex (2, −5) moves to (2, 5), with the x-coordinate unchanged.",
    "把虚线 y = (x − 2)² − 5 关于 x 轴翻折得到标色的抛物线。顶点 (2, −5) 移到 (2, 5)，x 坐标不变。",
  ),
  "act-exam-matching-a-graph-to-an-equation#exam-question": graphed(
    wide(-4, 6, -5, 5),
    [curveOf((x) => (x - 3) * (x + 1)), pt([3, 0], "", "n", "result"), pt([-1, 0], "", "n", "result")],
    "A parabola opening up crosses the x-axis at 3 and −1, the colored points. Those crossings give the factors x − 3 and x + 1, with the signs reversed.",
    "开口向上的抛物线与 x 轴交于 3 和 −1（标色的点）。这些交点给出因式 x − 3 和 x + 1，符号相反。",
  ),
  "act-exam-matching-a-graph-to-an-equation#harder-exam-question": graphed(
    wide(-3, 7, -5, 7),
    [curveOf((x) => -((x - 2) ** 2) + 5), pt([2, 5], "(2, 5)", "n", "result")],
    "A parabola opening down with its vertex at (2, 5), in color, fits y = −(x − 2)² + 5. The minus in front gives the direction, and the sign inside is opposite to the 2.",
    "顶点在 (2, 5)（标色）且开口向下的抛物线符合 y = −(x − 2)² + 5。前面的负号决定方向，括号内的符号与 2 相反。",
  ),
  "act-exam-interpreting-piecewise-graphs#exam-question": drawing(
    pane(0, [0, 7, 1], [0, 6, 1], 6, 5)
      .path([
        [0, 1],
        [3, 4],
      ])
      .path([
        [3, 2],
        [7, 6],
      ])
      .dot(3, 4)
      .open(3, 2)
      .path(
        [
          [5, 0],
          [5, 4],
        ],
        "action",
        true,
      )
      .path(
        [
          [0, 4],
          [5, 4],
        ],
        "action",
        true,
      )
      .dot(5, 4, undefined, "n", "result")
      .marks(),
    "For example, a graph in two pieces. Going up from x = 5 to the piece above that input, then across, reads a height of 4.",
    "例如，由两段组成的图象。从 x = 5 向上到该输入上方的那一段，再向左读出高度 4。",
  ),
  "act-exam-interpreting-piecewise-graphs#harder-exam-question": drawing(
    pane(0, [0, 8, 1], [0, 5, 1], 6, 5)
      .path([
        [0, 1],
        [2, 4],
      ])
      .path(
        [
          [2, 4],
          [5, 4],
        ],
        "result",
      )
      .path([
        [5, 4],
        [8, 1],
      ])
      .path(
        [
          [2, 0],
          [5, 0],
        ],
        "action",
      )
      .path(
        [
          [2, 0],
          [2, 4],
        ],
        undefined,
        true,
      )
      .path(
        [
          [5, 0],
          [5, 4],
        ],
        undefined,
        true,
      )
      .marks(),
    "For example, the colored flat piece spans x from 2 to 5, shown along the axis. The function is constant on that interval of inputs, and its height, 4, is not the answer.",
    "例如，标色的水平段跨越 x 从 2 到 5，在轴上标出。函数在这一输入区间上是常数，而它的高度 4 不是答案。",
  ),
  "act-exam-converting-angle-measures#exam-question": drawing(
    [...standard(150, 2.4), note(on(75, 1.1), "5π/6", "ne"), ...shift(standard(400, 2.4), 7), note([7 + 1.2, 1.1], "2π/9", "ne")],
    "On the left, 150° is 5π/6 radians. On the right, 400° is one full turn plus 40°, which ends in the same place as 2π/9 radians.",
    "左图中 150° 是 5π/6 弧度。右图中 400° 是一整圈加 40°，与 2π/9 弧度终边相同。",
  ),
  "act-exam-finding-cosine-from-sine#exam-question": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], sideStyles: ["result"], angles: ["θ"], angleStyles: ["accent"] }),
    "Sine 3/5 gives a triangle with opposite side 3 and hypotenuse 5. The missing colored leg is 4, so the cosine is 4/5.",
    "正弦 3/5 给出对边 3、斜边 5 的三角形。缺少的标色直角边是 4，所以余弦是 4/5。",
  ),
  "act-exam-finding-cosine-from-sine#harder-exam-question": graphed(
    wide(-6, 6, -6, 6, 2),
    [
      { kind: "circle", center: [0, 0], r: 5 },
      solid([0, 0], [-4, 3]),
      solid([-4, 3], [-4, 0], "action"),
      solid([-4, 0], [0, 0], "result"),
      pt([-4, 3], "(−4, 3)", "nw"),
      tag([-4, 1.5], "3", "e"),
      tag([-2, 0], "−4", "n"),
      tag([-2, 1.5], "5", "ne"),
    ],
    "Between π/2 and π, the point (−4, 3) lies left of the y-axis. The colored x-distance is negative while the height stays positive, so the cosine is −4/5.",
    "在 π/2 和 π 之间，点 (−4, 3) 在 y 轴左侧。标色的 x 距离为负，而高度仍为正，所以余弦是 −4/5。",
  ),
  "act-exam-identifying-equivalent-trig-representations#exam-question": (() => {
    const a = (20 * Math.PI) / 180;
    return drawing(
      rt(5 * Math.cos(a), 5 * Math.sin(a), { angles: ["20°", undefined, "70°"], sideStyles: [undefined, "result"] }),
      "In a right triangle, 20° and 70° are complementary. The colored side is opposite 20° and adjacent to 70°, so sin 20° = cos 70°.",
      "在直角三角形中，20° 和 70° 互余。标色的边对着 20° 且与 70° 相邻，所以 sin 20° = cos 70°。",
    );
  })(),
  "act-exam-identifying-equivalent-trig-representations#harder-exam-question": drawing(
    [...standard(400, 3), note(on(40, 1.1), "40°", "e"), note(on(200, 1.3), "400°", "sw")],
    "An angle of 40° plus a full turn of 360° ends on the same colored side as 40°. So cos 400° and cos 40° have the same value.",
    "40° 加上 360° 的一整圈，终边与 40° 的标色边相同。所以 cos 400° 与 cos 40° 的值相同。",
  ),
  "act-exam-finding-amplitude-period-and-range#exam-question": drawing(
    pane(0, [0, 3.5, 99], [-6, 3, 1], 6, 5)
      .f((x) => 3 * Math.sin(4 * x) - 1, 0, 3.3)
      .path(
        [
          [0, -4.7],
          [Math.PI / 2, -4.7],
        ],
        "result",
      )
      .path(
        [
          [Math.PI / 2, -4.7],
          [Math.PI / 2, -1],
        ],
        undefined,
        true,
      )
      .say(Math.PI / 4, -4.7, "π/2", "s")
      .marks(),
    "The graph of y = 3 sin(4x) − 1 repeats after the colored stretch, π/2, which is 2π/4. The 3 sets the height and the −1 moves the middle line.",
    "y = 3 sin(4x) − 1 的图象每隔标色的一段重复，这一段是 π/2，即 2π/4。3 决定高度，−1 移动中线。",
  ),
  "act-exam-finding-amplitude-period-and-range#harder-exam-question": drawing(
    pane(0, [0, 4.5, 99], [-4, 8, 2], 6, 5)
      .f((x) => 5 * Math.cos(3 * x) + 2, 0, 4.2)
      .level(7, "result")
      .level(-3, "result")
      .level(2)
      .say(4.3, 7, "7", "e")
      .say(4.3, -3, "−3", "e")
      .marks(),
    "The graph of y = 5 cos(3x) + 2 is centered at 2 and reaches 5 above and below it. The colored dashed lines at −3 and 7 are the ends of the range.",
    "y = 5 cos(3x) + 2 的图象以 2 为中心，上下各到 5。标色虚线 −3 和 7 是值域的两端。",
  ),
  "act-exam-matching-and-transforming-trig-graphs#exam-question": drawing(
    pane(0, [0, 7, 99], [-6, 2, 1], 6, 5)
      .f((x) => 3 * Math.sin(x) - 2, 0, 7)
      .level(-2)
      .path(
        [
          [Math.PI / 2, -2],
          [Math.PI / 2, 1],
        ],
        "result",
      )
      .say(Math.PI / 2, -0.5, "3", "e")
      .marks(),
    "For a graph peaking at 1 with troughs at −5, the dashed center line is at −2. The amplitude is the colored distance from it to a peak, 3, half the full height of 6.",
    "峰值为 1、谷值为 −5 的图象，虚线中线在 −2。振幅是从中线到峰值的标色距离 3，是全高 6 的一半。",
  ),
};
