// A third knowledge point for the other 6th Grade Math topics on two-variable equations, geometry and statistics.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";
import { dotPlotFigure } from "./grade-6-statistics.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** fraction builds a problem whose answer is a fraction, dropping wrong answers equal to it. */
const fraction = (prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair) =>
  numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    wrong: wrong.filter((w) => !w.eq(answer)),
    solution: t(solution[0], solution[1]),
  });

/** frac writes a fraction in LaTeX. */
const frac = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** sum adds a list of numbers. */
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** deeperGrade6Third2Points holds the third knowledge points of these 6th Grade Math topics, by topic. */
export const deeperGrade6Third2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "analyzing-two-variable-equations-using-tables": [
    skill(
      "the-change-for-each-one",
      ["The change for each 1", "每增加 1 的变化"],
      [
        "A table may skip values of $x$, so the jump between neighboring values of $y$ is not always the change for each 1. Dividing the jump in $y$ by the jump in $x$ gives that change.",
        "表格可能跳过一些 $x$ 值，所以相邻 $y$ 值的差不一定是 $x$ 每增加 1 的变化。用 $y$ 的差除以 $x$ 的差才得到这个变化。",
      ],
      (rng) => {
        const x0 = rng.int(0, 6);
        const step = rng.int(2, 5);
        const m = rng.int(2, 12);
        const c = rng.int(0, 9);
        const xs = [x0, x0 + step, x0 + 2 * step, x0 + 3 * step];
        const table = `\\begin{array}{|c|c|c|c|c|}\\hline x & ${xs.join(" & ")} \\\\ \\hline y & ${xs.map((x) => m * x + c).join(" & ")} \\\\ \\hline\\end{array}`;
        return whole(
          [
            `The table follows one straight rule. By how much does $y$ change each time $x$ rises by 1? $$${table}$$`,
            `表格遵循同一条直线规则。$x$ 每增加 1，$y$ 变化多少？$$${table}$$`,
          ],
          m,
          [m * step, step, m + step],
          [
            `$x$ jumps by ${step} while $y$ jumps by ${m * step}, and $${m * step} \\div ${step} = ${m}$.`,
            `$x$ 每次跳 ${step}，$y$ 每次跳 ${m * step}，$${m * step} \\div ${step} = ${m}$。`,
          ],
        );
      },
    ),
  ],
  "analyzing-two-variable-equations-using-graphs": [
    skill(
      "the-point-on-the-graph",
      ["The point on the graph", "图像上的点"],
      [
        "A point lies on the graph of an equation exactly when its coordinates make the equation true. Substituting the first coordinate for $x$ must give the second coordinate as $y$.",
        "一个点在方程的图像上，当且仅当它的坐标使方程成立。把第一个坐标代入 $x$，必须得到第二个坐标作为 $y$。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const b = rng.int(1, 9);
        const x = rng.int(1, 8);
        const y = m * x + b;
        return chooseMath(
          rng,
          [`Which point lies on the graph of $y = ${m}x + ${b}$?`, `哪个点在 $y = ${m}x + ${b}$ 的图像上？`],
          `(${x}, ${y})`,
          [`(${y}, ${x})`, `(${x}, ${y + 1})`, `(${x + 1}, ${y})`],
          [
            `$${m} \\times ${x} + ${b} = ${y}$, so $(${x}, ${y})$ makes the equation true.`,
            `$${m} \\times ${x} + ${b} = ${y}$，所以 $(${x}, ${y})$ 使方程成立。`,
          ],
        );
      },
    ),
  ],
  "areas-of-rectangles": [
    skill(
      "a-path-around-a-rectangle",
      ["A path around a rectangle", "长方形四周的小路"],
      [
        "A path around a rectangle makes a larger rectangle, adding its width on both sides of each dimension. The path's area is the larger area minus the inner one.",
        "长方形四周的小路形成一个更大的长方形，每个方向两侧都加上路宽。小路的面积是大面积减去里面的面积。",
      ],
      (rng) => {
        const l = rng.int(6, 20);
        const w = rng.int(3, 15);
        const p = rng.int(1, 3);
        const outer = (l + 2 * p) * (w + 2 * p);
        return whole(
          [
            `A garden is ${l} m long and ${w} m wide. A path ${p} m wide runs all around it. What is the area of the path, in square meters?`,
            `一个花园长 ${l} 米，宽 ${w} 米。四周有一条宽 ${p} 米的小路。小路的面积是多少平方米？`,
          ],
          outer - l * w,
          [outer, 2 * (l + w) * p, (l + p) * (w + p) - l * w],
          [
            `The larger rectangle is ${l + 2 * p} by ${w + 2 * p}, with area ${outer}. Taking away $${l} \\times ${w} = ${l * w}$ leaves ${outer - l * w}.`,
            `大长方形是 ${l + 2 * p} 乘 ${w + 2 * p}，面积 ${outer}。减去 $${l} \\times ${w} = ${l * w}$，剩下 ${outer - l * w}。`,
          ],
        );
      },
    ),
  ],
  "areas-of-triangles": [
    skill(
      "the-height-from-the-area",
      ["The height from the area", "由面积求高"],
      [
        "A triangle's area is half of base times height. So undoing it means doubling the area before dividing by the base, and leaving out the doubling is the usual slip.",
        "三角形面积是底乘高的一半。所以还原时要先把面积乘 2，再除以底，漏掉乘 2 是常见错误。",
      ],
      (rng) => {
        const b = rng.int(2, 20);
        let h = rng.int(2, 20);
        if ((b * h) % 2 === 1) h += 1;
        const area = (b * h) / 2;
        return whole(
          [
            `A triangle has an area of $${area}\\text{ cm}^2$ and a base of $${b}\\text{ cm}$. What is its height, in cm?`,
            `一个三角形面积为 $${area}\\text{ cm}^2$，底为 $${b}\\text{ cm}$。它的高是多少厘米？`,
          ],
          h,
          [Math.floor(area / b), 2 * area, area - b],
          [
            `$2 \\times ${area} = ${2 * area}$, and $${2 * area} \\div ${b} = ${h}$.`,
            `$2 \\times ${area} = ${2 * area}$，$${2 * area} \\div ${b} = ${h}$。`,
          ],
        );
      },
    ),
  ],
  "lines-of-symmetry": [
    skill(
      "sides-from-the-lines-of-symmetry",
      ["Sides from the lines of symmetry", "由对称轴数求边数"],
      [
        "A regular polygon has one line of symmetry for each side. So the number of lines reveals the number of sides, and from that its perimeter can be found.",
        "正多边形的对称轴条数等于边数。所以由对称轴的条数可以知道边数，进而求出周长。",
      ],
      (rng) => {
        const k = rng.int(3, 20);
        const s = rng.int(2, 15);
        return whole(
          [
            `A regular polygon has ${k} lines of symmetry and sides of length ${s} cm. What is its perimeter, in cm?`,
            `一个正多边形有 ${k} 条对称轴，边长 ${s} 厘米。它的周长是多少厘米？`,
          ],
          k * s,
          [k + s, 2 * k * s, (k - 1) * s],
          [
            `${k} lines of symmetry mean ${k} sides, and $${k} \\times ${s} = ${k * s}$.`,
            `${k} 条对称轴表示 ${k} 条边，$${k} \\times ${s} = ${k * s}$。`,
          ],
        );
      },
    ),
  ],
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths": [
    skill(
      "doubling-the-edges",
      ["Doubling the edges", "棱长加倍"],
      [
        "Volume is a product of three edges, so each edge that is doubled doubles the volume once more. Doubling all three edges multiplies the volume by eight and not by two.",
        "体积是三条棱的积，所以每把一条棱加倍，体积就再翻一倍。三条棱都加倍，体积变成 8 倍，而不是 2 倍。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 8]);
        const n = rng.int(1, d - 1);
        const a = rng.int(1, 9);
        const v = Q.of(a * d + n, d);
        const edges = rng.int(1, 3);
        const times = 2 ** edges;
        const [en, zh] = (
          [
            ["one edge is", "一条棱"],
            ["two edges are", "两条棱"],
            ["all three edges are", "三条棱都"],
          ] as const
        )[edges - 1]!;
        return fraction(
          [
            `A rectangular prism has a volume of $${a}${frac(n, d)}\\text{ cm}^3$. If ${en} doubled, what is the new volume, in cubic cm?`,
            `一个长方体体积为 $${a}${frac(n, d)}\\text{ cm}^3$。如果${zh}加倍，新的体积是多少立方厘米？`,
          ],
          v.mul(Q.of(times)),
          [v.mul(Q.of(2)), v.mul(Q.of(4)), v.mul(Q.of(8)), v.mul(Q.of(6))],
          [
            `Each doubled edge doubles the volume, so it is multiplied by $${times}$: $${frac(a * d + n, d)} \\times ${times}$.`,
            `每条加倍的棱使体积翻一倍，所以乘 $${times}$：$${frac(a * d + n, d)} \\times ${times}$。`,
          ],
        );
      },
    ),
  ],
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems": [
    skill(
      "water-still-needed",
      ["Water still needed", "还需要多少水"],
      [
        "The water still needed to fill a tank is a prism of its own: the same length and width, with the empty height. That is quicker than finding two volumes and subtracting.",
        "把水箱加满还需要的水也是一个长方体：长和宽相同，高是空着的高度。这比求两个体积再相减更快。",
      ],
      (rng) => {
        const l = rng.int(2, 12);
        const a = rng.int(1, 6);
        const h = rng.int(4, 9);
        const b = rng.int(0, 2);
        const width = Q.of(2 * a + 1, 2);
        const gap = Q.of(2 * b + 1, 2);
        const depth = Q.of(h).add(gap.mul(Q.of(-1)));
        const base = Q.of(l).mul(width);
        const low = h - b - 1;
        return fraction(
          [
            `A tank is ${l} ft long, $${a}${frac(1, 2)}$ ft wide and ${h} ft tall. The water in it is $${low}${frac(1, 2)}$ ft deep. How many cubic feet of water are still needed to fill it?`,
            `一个水箱长 ${l} 英尺，宽 $${a}${frac(1, 2)}$ 英尺，高 ${h} 英尺。水深 $${low}${frac(1, 2)}$ 英尺。还需要多少立方英尺的水才能加满？`,
          ],
          base.mul(gap),
          [base.mul(Q.of(h)), base.mul(depth), base],
          [
            `The empty height is $${h} - ${low}${frac(1, 2)} = ${frac(2 * b + 1, 2)}$ ft, and $${l} \\times ${frac(2 * a + 1, 2)} \\times ${frac(2 * b + 1, 2)}$ gives the volume.`,
            `空着的高度是 $${h} - ${low}${frac(1, 2)} = ${frac(2 * b + 1, 2)}$ 英尺，$${l} \\times ${frac(2 * a + 1, 2)} \\times ${frac(2 * b + 1, 2)}$ 就是所求的体积。`,
          ],
        );
      },
    ),
  ],
  "distances-between-points-in-the-coordinate-plane": [
    skill(
      "a-point-and-its-reflection",
      ["A point and its reflection", "点与它的对称点"],
      [
        "A point and its reflection in an axis are the same distance from that axis, on opposite sides. So the distance between them is twice the point's distance from the axis.",
        "点和它关于坐标轴的对称点到这条轴的距离相同，分在两侧。所以它们之间的距离是点到这条轴距离的两倍。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        let c = rng.int(2, 15);
        if (c === a) c += 1;
        const x = rng.bool() ? a : -a;
        const y = rng.bool() ? c : -c;
        const xAxis = rng.bool();
        const near = xAxis ? c : a;
        const far = xAxis ? a : c;
        return whole(
          xAxis
            ? [
                `Point $P(${x}, ${y})$ is reflected in the $x$-axis to point $Q$. How far apart are $P$ and $Q$?`,
                `点 $P(${x}, ${y})$ 关于 $x$ 轴对称得到点 $Q$。$P$ 和 $Q$ 相距多远？`,
              ]
            : [
                `Point $P(${x}, ${y})$ is reflected in the $y$-axis to point $Q$. How far apart are $P$ and $Q$?`,
                `点 $P(${x}, ${y})$ 关于 $y$ 轴对称得到点 $Q$。$P$ 和 $Q$ 相距多远？`,
              ],
          2 * near,
          [near, 2 * far, near + far],
          [
            `$P$ is $${near}$ from the axis, and $Q$ is $${near}$ on the other side, so they are $2 \\times ${near} = ${2 * near}$ apart.`,
            `$P$ 到这条轴的距离是 $${near}$，$Q$ 在另一侧也是 $${near}$，所以相距 $2 \\times ${near} = ${2 * near}$。`,
          ],
        );
      },
    ),
  ],
  "polygons-in-the-coordinate-plane": [
    skill(
      "the-fourth-vertex-of-a-rectangle",
      ["The fourth vertex of a rectangle", "长方形的第四个顶点"],
      [
        "Sides of such a rectangle run along grid lines, so each vertex shares its first coordinate with one neighbor and its second coordinate with the other. That fixes the missing vertex.",
        "这样的长方形的边沿着网格线，所以每个顶点与一个相邻顶点第一个坐标相同，与另一个相邻顶点第二个坐标相同。由此确定缺少的顶点。",
      ],
      (rng) => {
        const x1 = -rng.int(1, 12);
        const x2 = rng.int(1, 12);
        const y1 = -rng.int(1, 12);
        const y2 = rng.int(1, 12);
        return chooseMath(
          rng,
          [
            `Rectangle $ABCD$ has $A(${x1}, ${y1})$, $B(${x2}, ${y1})$ and $C(${x2}, ${y2})$. Where is $D$?`,
            `长方形 $ABCD$ 有 $A(${x1}, ${y1})$、$B(${x2}, ${y1})$ 和 $C(${x2}, ${y2})$。$D$ 在哪里？`,
          ],
          `(${x1}, ${y2})`,
          [`(${y2}, ${x1})`, `(${x1}, ${-y2})`, `(${x1 + x2 === x1 ? x1 + 1 : x1 + x2}, ${y2})`],
          [
            `$D$ shares its first coordinate with $A$ and its second with $C$, so it is $(${x1}, ${y2})$.`,
            `$D$ 的第一个坐标与 $A$ 相同，第二个与 $C$ 相同，所以是 $(${x1}, ${y2})$。`,
          ],
        );
      },
    ),
  ],
  "comparing-measures-of-spread": [
    skill(
      "the-largest-value-raised",
      ["The largest value raised", "最大值变大"],
      [
        "The range depends on the two extreme values, while the interquartile range depends only on the middle half. So raising the largest value stretches the range and leaves the other measure alone.",
        "极差取决于两个极端值，而四分位距只取决于中间一半的数据。所以增大最大值会拉长极差，四分位距不变。",
      ],
      (rng) => {
        const xs: number[] = [rng.int(1, 9)];
        for (let i = 1; i < 7; i++) xs.push(xs[i - 1]! + rng.int(1, 6));
        const k = rng.int(2, 30);
        const range = rng.bool();
        const list = xs.join(", ");
        return whole(
          range
            ? [
                `The data set $${list}$ has its largest value raised by $${k}$. By how much does the range increase?`,
                `数据 $${list}$ 的最大值增大 $${k}$。极差增大多少？`,
              ]
            : [
                `The data set $${list}$ has its largest value raised by $${k}$. By how much does the interquartile range increase?`,
                `数据 $${list}$ 的最大值增大 $${k}$。四分位距增大多少？`,
              ],
          range ? k : 0,
          range ? [k + 1, 2 * k, xs[6]! - xs[0]!] : [k, Math.ceil(k / 2), Math.ceil(k / 4)],
          range
            ? [`The range is the largest minus the smallest, so it grows by the full ${k}.`, `极差是最大值减最小值，所以增大整整 ${k}。`]
            : [
                `The quartiles are ${xs[1]} and ${xs[5]}, which do not involve the largest value, so the change is $0$.`,
                `四分位数是 ${xs[1]} 和 ${xs[5]}，不涉及最大值，所以变化为 $0$。`,
              ],
        );
      },
    ),
  ],
  "measuring-centrality-from-dot-plots": [
    skill(
      "a-new-dot-that-keeps-the-mean",
      ["A new dot that keeps the mean", "保持平均数不变的新点"],
      [
        "A new value pulls the mean toward it, unless the value equals the mean. So a dot placed exactly at the mean is the only dot that leaves the mean where it was.",
        "新数据会把平均数拉向自己，除非它等于平均数。所以正好放在平均数处的点，是唯一不改变平均数的点。",
      ],
      (rng) => {
        const lo = rng.int(0, 9);
        const n = rng.pick([6, 8, 9, 10, 12]);
        const xs = Array.from({ length: n }, () => rng.int(lo, lo + 8));
        for (let i = 0; sum(xs) % n !== 0; i = (i + 1) % n) if (xs[i]! < lo + 8) xs[i]! += 1;
        const mean = sum(xs) / n;
        return whole(
          [
            "The dot plot shows a data set. One more dot is added and the mean stays the same. At what value is the new dot?",
            "点图表示一组数据。再加一个点后平均数不变。新的点在哪个值？",
          ],
          mean,
          [mean + 1, Math.max(...xs), n],
          [
            `The mean is $${sum(xs)} \\div ${n} = ${mean}$, and only a value equal to the mean leaves it unchanged.`,
            `平均数是 $${sum(xs)} \\div ${n} = ${mean}$，只有等于平均数的值才不改变它。`,
          ],
          dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
        );
      },
    ),
  ],
  "measuring-range-and-mad-from-dot-plots": [
    skill(
      "the-range-after-a-new-dot",
      ["The range after a new dot", "新增一点后的极差"],
      [
        "A new dot changes the range only if it falls outside the data, and then it becomes the new extreme. A dot inside the data leaves the range as it was.",
        "新的点只有落在数据范围之外才会改变极差，这时它成为新的极端值。落在数据范围之内的点不改变极差。",
      ],
      (rng) => {
        const lo = rng.int(8, 20);
        const n = rng.int(7, 14);
        const xs = [lo + 1, lo + 7, ...Array.from({ length: n - 2 }, () => rng.int(lo + 1, lo + 7))];
        const small = Math.min(...xs);
        const big = Math.max(...xs);
        const form = rng.int(0, 2);
        const v = form === 0 ? big + rng.int(1, 6) : form === 1 ? small - rng.int(1, 6) : rng.int(small, big);
        const answer = Math.max(big, v) - Math.min(small, v);
        return whole(
          [
            `The dot plot shows a data set. A new value of $${v}$ is added. What is the range now?`,
            `点图表示一组数据。新增一个值 $${v}$。现在的极差是多少？`,
          ],
          answer,
          [big - small === answer ? answer + 1 : big - small, v - small === answer ? answer + 2 : Math.abs(v - small), answer + 3],
          [
            `The extremes are now ${Math.min(small, v)} and ${Math.max(big, v)}, and their difference is $${answer}$.`,
            `现在的极端值是 ${Math.min(small, v)} 和 ${Math.max(big, v)}，差是 $${answer}$。`,
          ],
          dotPlotFigure(xs, { min: lo - 6, max: lo + 13, step: 1 }),
        );
      },
    ),
  ],
};
