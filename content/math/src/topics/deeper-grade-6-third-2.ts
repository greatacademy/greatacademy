// A third knowledge point for the other 6th Grade Math topics on two-variable equations, geometry and statistics.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { lowestNumerator } from "../early-grades-kit.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { mixedLatex } from "../problems.ts";
import { type Pair, tableFigure } from "./early-grades-more-kit.ts";
import { prismSvg } from "./grade-5-measurement.ts";
import { chosenMath, drawn, lesson, type Off, valued } from "./grade-6-kit.ts";
import { dotPlotFigure } from "./grade-6-statistics.ts";

/** sum adds a list of numbers. */
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** deeperGrade6Third2Points holds the third knowledge points of these 6th Grade Math topics, by topic. */
export const deeperGrade6Third2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "analyzing-two-variable-equations-using-tables": [
    lesson(
      "the-change-for-each-one",
      ["The change for each 1", "每增加 1 的变化"],
      [
        [
          "A table may skip values of $x$. To find how much $y$ changes each time $x$ rises by $1$, divide the jump in $y$ by the jump in $x$. If $x$ goes $0, 2, 4$ and $y$ goes $1, 7, 13$, then $y$ jumps by $6$ while $x$ jumps by $2$, so $y$ changes by $6 \\div 2 = 3$ for each $1$.",
          "表格可能跳过一些 $x$ 值。要求 $x$ 每增加 $1$ 时 $y$ 变化多少，就用 $y$ 的差除以 $x$ 的差。$x$ 是 $0, 2, 4$，$y$ 是 $1, 7, 13$，$y$ 每次增加 $6$，$x$ 每次增加 $2$，所以 $x$ 每增加 $1$，$y$ 增加 $6 \\div 2 = 3$。",
        ],
        ["$y = 3x + 1$ gives $1, 7, 13$ at $x = 0, 2, 4$.", "$y = 3x + 1$ 在 $x = 0, 2, 4$ 时得 $1, 7, 13$。"],
        [
          "Look at the $x$ row first. The jump of $6$ belongs to $2$ steps of $x$, not to $1$.",
          "先看 $x$ 那一行。$y$ 增加的 $6$ 对应 $x$ 增加 $2$，不是增加 $1$。",
        ],
      ],
      (rng) => {
        const x0 = rng.int(0, 6);
        const step = rng.int(2, 5);
        const m = rng.int(2, 12);
        const c = rng.int(0, 9);
        const xs = [x0, x0 + step, x0 + 2 * step, x0 + 3 * step];
        const ys = xs.map((x) => m * x + c);
        const table = `\\begin{array}{|c|c|c|c|c|}\\hline x & ${xs.join(" & ")} \\\\ \\hline y & ${ys.join(" & ")} \\\\ \\hline\\end{array}`;
        return valued(
          [
            `The table follows one straight rule. By how much does $y$ change each time $x$ rises by 1? $$${table}$$`,
            `表格遵循同一条直线规则。$x$ 每增加 1，$y$ 变化多少？$$${table}$$`,
          ],
          m,
          [
            [
              ["Find the two jumps", "找出两个差"],
              [`$x$ jumps by $${step}$ and $y$ jumps by $${m * step}$:`, `$x$ 每次增加 $${step}$，$y$ 每次增加 $${m * step}$：`],
              [`${xs[1]} - ${xs[0]} = ${step}`, `${ys[1]} - ${ys[0]} = ${m * step}`],
            ],
            [["Divide", "相除"], ["The change for each 1 is:", "$x$ 每增加 1 的变化是："], [`${m * step} \\div ${step} = ${m}`]],
          ],
          [
            `Across the whole table, $x$ rises by $${3 * step}$ and $y$ by $${3 * m * step}$, and $${3 * m * step} \\div ${3 * step} = ${m}$.`,
            `从表格第一列到最后一列，$x$ 增加 $${3 * step}$，$y$ 增加 $${3 * m * step}$，$${3 * m * step} \\div ${3 * step} = ${m}$。`,
          ],
          [
            [
              m * step,
              `That is the jump in $y$ between neighbors, but $x$ jumps by $${step}$ there, not by $1$.`,
              `这是相邻两个 $y$ 的差，但这时 $x$ 增加的是 $${step}$，不是 $1$。`,
            ],
            [step, "That is the jump in $x$. The question asks how $y$ changes.", "这是 $x$ 的差。问题问的是 $y$ 的变化。"],
            [
              m + step,
              "That adds the jumps. Divide the jump in $y$ by the jump in $x$.",
              "这是把两个差相加。应该用 $y$ 的差除以 $x$ 的差。",
            ],
          ],
        );
      },
      tableFigure(["x = 0", "x = 2", "x = 4"], [1, 7, 13]),
    ),
  ],
  "analyzing-two-variable-equations-using-graphs": [
    lesson(
      "the-point-on-the-graph",
      ["The point on the graph", "图像上的点"],
      [
        [
          "A point lies on the graph exactly when its coordinates make the equation true. Put the first coordinate in for $x$; the result must be the second coordinate. For $y = 2x + 1$, $(3, 7)$ is on the graph because $2 \\times 3 + 1 = 7$.",
          "一个点在图像上，当且仅当它的坐标使方程成立。把第一个坐标代入 $x$，结果必须等于第二个坐标。对于 $y = 2x + 1$，$(3, 7)$ 在图像上，因为 $2 \\times 3 + 1 = 7$。",
        ],
        ["Working back from $y = 7$: $7 - 1 = 6$ and $6 \\div 2 = 3$.", "从 $y = 7$ 倒推：$7 - 1 = 6$，$6 \\div 2 = 3$。"],
        [
          "The order matters: $x$ comes first. $(7, 3)$ is not on the graph, because $2 \\times 7 + 1 = 15$, not $3$.",
          "顺序很重要：$x$ 在前。$(7, 3)$ 不在图像上，因为 $2 \\times 7 + 1 = 15$，不是 $3$。",
        ],
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const b = rng.int(1, 9);
        const x = rng.int(1, 8);
        const y = m * x + b;
        return chosenMath(
          rng,
          [`Which point lies on the graph of $y = ${m}x + ${b}$?`, `哪个点在 $y = ${m}x + ${b}$ 的图像上？`],
          `(${x}, ${y})`,
          [
            [
              `(${y}, ${x})`,
              `That swaps the coordinates. At $x = ${y}$, $y$ is $${m * y + b}$, not $${x}$.`,
              `这把坐标的顺序弄反了。$x = ${y}$ 时 $y$ 是 $${m * y + b}$，不是 $${x}$。`,
            ],
            [`(${x}, ${y + 1})`, `At $x = ${x}$, $y$ is $${y}$, not $${y + 1}$.`, `$x = ${x}$ 时 $y$ 是 $${y}$，不是 $${y + 1}$。`],
            [`(${x + 1}, ${y})`, `At $x = ${x + 1}$, $y$ is $${y + m}$, not $${y}$.`, `$x = ${x + 1}$ 时 $y$ 是 $${y + m}$，不是 $${y}$。`],
          ],
          [
            [
              ["Put x in", "代入 x"],
              [`Put each first coordinate into the rule. For $x = ${x}$:`, `把每个点的第一个坐标代入规则。$x = ${x}$ 时：`],
              [`y = ${m} \\times ${x} + ${b} = ${y}`],
            ],
            [
              ["Compare", "比较"],
              [`Only $(${x}, ${y})$ has $${y}$ as its second coordinate.`, `只有 $(${x}, ${y})$ 的第二个坐标是 $${y}$。`],
            ],
          ],
          [
            `Working back from $y = ${y}$: $${y} - ${b} = ${m * x}$ and $${m * x} \\div ${m} = ${x}$, the first coordinate.`,
            `从 $y = ${y}$ 倒推：$${y} - ${b} = ${m * x}$，$${m * x} \\div ${m} = ${x}$，正是第一个坐标。`,
          ],
        );
      },
      drawn(gradeDrawings4["analyzing-two-variable-equations-using-graphs#the-point-on-the-graph"]),
    ),
  ],
  "areas-of-rectangles": [
    lesson(
      "a-path-around-a-rectangle",
      ["A path around a rectangle", "长方形四周的小路"],
      [
        [
          "A path around a rectangle makes a larger rectangle, adding the path's width on both sides of each dimension. The path's area is the larger area minus the inner one. A path $1$ m wide around a $6$ m by $4$ m garden makes an $8$ by $6$ rectangle, so the path covers $48 - 24 = 24\\text{ m}^2$.",
          "长方形四周的小路形成一个更大的长方形，每个方向两侧都要加上路宽。小路的面积是大面积减去里面的面积。$6$ 米乘 $4$ 米的花园四周有一条宽 $1$ 米的小路，组成 $8$ 乘 $6$ 的长方形，所以小路面积是 $48 - 24 = 24\\text{ m}^2$。",
        ],
        [
          "Cut the path into two strips $8 \\times 1$ along the length and two strips $4 \\times 1$ along the width: $16 + 8 = 24$.",
          "把小路切成沿长边的两条 $8 \\times 1$ 和沿宽边的两条 $4 \\times 1$：$16 + 8 = 24$。",
        ],
        [
          "Add the path width on both sides: the length grows by twice the width, not once.",
          "两侧都要加路宽：长增加的是路宽的 2 倍，不是 1 倍。",
        ],
      ],
      (rng) => {
        const l = rng.int(6, 20);
        const w = rng.int(3, 15);
        const p = rng.int(1, 3);
        const [L, W] = [l + 2 * p, w + 2 * p];
        const outer = L * W;
        const path = outer - l * w;
        return valued(
          [
            `A garden is ${l} m long and ${w} m wide. A path ${p} m wide runs all around it. What is the area of the path?`,
            `一个花园长 ${l} 米，宽 ${w} 米。四周有一条宽 ${p} 米的小路。小路的面积是多少？`,
          ],
          path,
          [
            [
              ["The outer rectangle", "外面的大长方形"],
              [`The path adds $${p}$ m on both sides of each dimension:`, `小路在每个方向的两侧各加 $${p}$ 米：`],
              [`(${l} + 2 \\times ${p}) \\times (${w} + 2 \\times ${p}) = ${L} \\times ${W} = ${outer}`],
            ],
            [
              ["Take away the garden", "减去花园"],
              ["The path is what is left:", "剩下的就是小路："],
              [`${outer} - ${l} \\times ${w} = ${path}`],
            ],
          ],
          [
            `Cut the path into two strips $${L} \\times ${p}$ and two strips $${w} \\times ${p}$: $${2 * L * p} + ${2 * w * p} = ${path}$.`,
            `把小路切成两条 $${L} \\times ${p}$ 和两条 $${w} \\times ${p}$：$${2 * L * p} + ${2 * w * p} = ${path}$。`,
          ],
          [
            [outer, "That is the whole outer rectangle; take away the garden.", "这是整个大长方形，还要减去花园。"],
            [
              2 * (l + w) * p,
              "That is the garden's perimeter times the width, which misses the four corner squares.",
              "这是花园周长乘路宽，漏掉了四个角上的小正方形。",
            ],
            [
              (l + p) * (w + p) - l * w,
              "That adds the path width to each dimension only once, not on both sides.",
              "这在每个方向只加了一次路宽，没有两侧都加。",
            ],
            [l * w, "That is the area of the garden itself.", "这是花园本身的面积。"],
          ],
          { unit: "m^2" },
        );
      },
      drawn(gradeDrawings4["areas-of-rectangles#a-path-around-a-rectangle"]),
    ),
  ],
  "areas-of-triangles": [
    lesson(
      "the-height-from-the-area",
      ["The height from the area", "由面积求高"],
      [
        [
          "A triangle's area is half of base times height, so to undo it, double the area first and then divide by the base. A triangle with area $24$ and base $8$ has height $2 \\times 24 \\div 8 = 6$.",
          "三角形面积是底乘高的一半，所以倒推时先把面积乘 2，再除以底。面积 $24$、底 $8$ 的三角形，高是 $2 \\times 24 \\div 8 = 6$。",
        ],
        ["$\\frac{1}{2} \\times 8 \\times 6 = 24$, the given area.", "$\\frac{1}{2} \\times 8 \\times 6 = 24$，正是已知的面积。"],
        ["Double the area before dividing: $24 \\div 8 = 3$ is only half the height.", "除之前要先乘 2：$24 \\div 8 = 3$ 只是高的一半。"],
      ],
      (rng) => {
        const b = rng.int(2, 20);
        let h = rng.int(2, 20);
        if ((b * h) % 2 === 1) h += 1;
        const area = (b * h) / 2;
        return valued(
          [
            `A triangle has an area of $${area}\\text{ cm}^2$ and a base of $${b}\\text{ cm}$. What is its height?`,
            `一个三角形面积为 $${area}\\text{ cm}^2$，底为 $${b}\\text{ cm}$。它的高是多少？`,
          ],
          h,
          [
            [
              ["Double the area", "面积乘 2"],
              ["Base times height is twice the area:", "底乘高是面积的 2 倍："],
              [`2 \\times ${area} = ${2 * area}`],
            ],
            [["Divide by the base", "除以底"], ["That leaves the height:", "得到高："], [`${2 * area} \\div ${b} = ${h}`]],
          ],
          [
            `$\\frac{1}{2} \\times ${b} \\times ${h} = ${area}$, the given area.`,
            `$\\frac{1}{2} \\times ${b} \\times ${h} = ${area}$，正是已知的面积。`,
          ],
          [
            [Q.of(area, b), "That divides the area by the base without doubling it first.", "这是直接用面积除以底，没有先乘 2。"],
            [2 * area, "That doubles the area but does not divide by the base.", "这把面积乘了 2，却没有除以底。"],
            [area - b, "That subtracts the base instead of dividing by it.", "这是减去底，而不是除以底。"],
          ],
          { unit: "cm", form: "number" },
        );
      },
      drawn(gradeDrawings4["areas-of-triangles#the-height-from-the-area"]),
    ),
  ],
  "lines-of-symmetry": [
    lesson(
      "sides-from-the-lines-of-symmetry",
      ["Sides from the lines of symmetry", "由对称轴数求边数"],
      [
        [
          "A regular polygon has one line of symmetry for each side, so the number of lines tells the number of sides, and from that the perimeter follows. A regular polygon with $6$ lines of symmetry has $6$ sides; with sides of $5$ cm its perimeter is $6 \\times 5 = 30$ cm.",
          "正多边形的对称轴条数等于边数，所以由对称轴的条数可以知道边数，进而求出周长。有 $6$ 条对称轴的正多边形有 $6$ 条边；边长 $5$ 厘米时，周长是 $6 \\times 5 = 30$ 厘米。",
        ],
        [
          "A square has $4$ sides and $4$ lines of symmetry: two diagonals and two through the midpoints of opposite sides.",
          "正方形有 $4$ 条边，也有 $4$ 条对称轴：两条对角线和两条过对边中点的直线。",
        ],
        [
          "This holds only for regular polygons: a rectangle that is not a square has $4$ sides but only $2$ lines of symmetry.",
          "这只对正多边形成立：不是正方形的长方形有 $4$ 条边，却只有 $2$ 条对称轴。",
        ],
      ],
      (rng) => {
        const k = rng.int(3, 20);
        const s = rng.int(2, 15);
        return valued(
          [
            `A regular polygon has ${k} lines of symmetry and sides of length ${s} cm. What is its perimeter?`,
            `一个正多边形有 ${k} 条对称轴，边长 ${s} 厘米。它的周长是多少？`,
          ],
          k * s,
          [
            [
              ["Count the sides", "数边"],
              ["A regular polygon has as many sides as lines of symmetry:", "正多边形的边数等于对称轴的条数："],
              [`${k} \\text{ sides}`],
            ],
            [
              ["Add the sides", "求周长"],
              [`$${k}$ equal sides of $${s}$ cm:`, `$${k}$ 条边，每条 $${s}$ 厘米：`],
              [`${k} \\times ${s} = ${k * s}`],
            ],
          ],
          [
            `Sharing the perimeter among the $${k}$ sides gives back one side: $${k * s} \\div ${k} = ${s}$.`,
            `把周长平均分给 $${k}$ 条边，又得到一条边长：$${k * s} \\div ${k} = ${s}$。`,
          ],
          [
            [k + s, "That adds the number of sides to the side length instead of multiplying.", "这是把边数和边长相加，而不是相乘。"],
            [2 * k * s, "That counts two sides for each line of symmetry.", "这是每条对称轴算了两条边。"],
            [(k - 1) * s, "That leaves out one side.", "这漏掉了一条边。"],
          ],
          { unit: "cm" },
        );
      },
      drawn(gradeDrawings4["lines-of-symmetry#sides-from-the-lines-of-symmetry"]),
    ),
  ],
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths": [
    lesson(
      "doubling-the-edges",
      ["Doubling the edges", "棱长加倍"],
      [
        [
          "Volume is a product of three edges, so each edge that is doubled doubles the volume once more: one edge gives $2$ times, two edges $2 \\times 2 = 4$ times, all three $2 \\times 2 \\times 2 = 8$ times. A prism of $2\\frac{1}{2}\\text{ cm}^3$ with all three edges doubled holds $2\\frac{1}{2} \\times 8 = 20\\text{ cm}^3$.",
          "体积是三条棱的积，所以每把一条棱加倍，体积就再翻一倍：一条棱是 $2$ 倍，两条棱是 $2 \\times 2 = 4$ 倍，三条都加倍是 $2 \\times 2 \\times 2 = 8$ 倍。体积 $2\\frac{1}{2}\\text{ cm}^3$ 的长方体三条棱都加倍后，体积是 $2\\frac{1}{2} \\times 8 = 20\\text{ cm}^3$。",
        ],
        [
          "A unit cube with all three edges doubled is a cube with edges $2$, which $8$ unit cubes fill, as in the picture.",
          "单位正方体三条棱都加倍，就成了棱长为 $2$ 的正方体，正好由 $8$ 个单位正方体填满，如图。",
        ],
        ["Doubling all three edges multiplies the volume by $8$, not by $2$.", "三条棱都加倍，体积乘的是 $8$，不是 $2$。"],
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 8]);
        const n = lowestNumerator(rng, d);
        const a = rng.int(1, 9);
        const v = Q.of(a * d + n, d);
        const edges = rng.int(1, 3);
        const times = 2 ** edges;
        const twos = Array.from({ length: edges }, () => "2").join(" \\times ");
        const unit = ["2 \\times 1 \\times 1", "2 \\times 2 \\times 1", "2 \\times 2 \\times 2"][edges - 1] as string;
        const [en, zh] = (
          [
            ["one edge is", "一条棱"],
            ["two edges are", "两条棱"],
            ["all three edges are", "三条棱都"],
          ] as const
        )[edges - 1] as readonly [string, string];
        const offs: Record<number, readonly [string, string]> = {
          2: ["That doubles the volume only once, as if one edge were doubled.", "这只把体积翻了一倍，像是只有一条棱加倍。"],
          4: ["That is the volume with two edges doubled.", "这是两条棱加倍时的体积。"],
          8: ["That is the volume with all three edges doubled.", "这是三条棱都加倍时的体积。"],
          6: ["That adds the doublings, $2 + 2 + 2$, instead of multiplying them.", "这是把各次加倍相加 $2 + 2 + 2$，而不是相乘。"],
        };
        return valued(
          [
            `A rectangular prism has a volume of $${mixedLatex(v)}\\text{ cm}^3$. If ${en} doubled, what is the new volume?`,
            `一个长方体体积为 $${mixedLatex(v)}\\text{ cm}^3$。如果${zh}加倍，新的体积是多少？`,
          ],
          v.mul(Q.of(times)),
          [
            [
              ["Count the doublings", "数加倍的次数"],
              ["Each doubled edge doubles the volume:", "每条加倍的棱使体积翻一倍："],
              [`${twos} = ${times}`],
            ],
            [
              ["Multiply", "相乘"],
              ["The new volume:", "新的体积："],
              [`${mixedLatex(v)} \\times ${times} = ${mixedLatex(v.mul(Q.of(times)))}`],
            ],
          ],
          [
            `A $1 \\times 1 \\times 1$ cube with ${en} doubled becomes $${unit} = ${times}$ cubic units, also $${times}$ times as much.`,
            `$1 \\times 1 \\times 1$ 的正方体${zh}加倍后变成 $${unit} = ${times}$ 个立方单位，也是 $${times}$ 倍。`,
          ],
          [2, 4, 8, 6].map((f): Off => [v.mul(Q.of(f)), ...(offs[f] as readonly [string, string])]),
          { unit: "cm^3", form: "mixed" },
        );
      },
      {
        svg: prismSvg(2, 2, 2),
        alt: t(
          "A cube with edges 2 built from 8 unit cubes: doubling all three edges of a unit cube gives 8 unit cubes.",
          "由 8 个单位正方体组成的棱长为 2 的正方体：单位正方体三条棱都加倍，就得到 8 个单位正方体。",
        ),
      },
    ),
  ],
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems": [
    lesson(
      "water-still-needed",
      ["Water still needed", "还需要多少水"],
      [
        [
          "The water still needed to fill a tank is a prism of its own: the same length and width, with the empty height. A tank $5$ by $3$ by $4$ ft holding water $2\\frac{1}{2}$ ft deep has an empty height of $1\\frac{1}{2}$ ft, so it needs $5 \\times 3 \\times 1\\frac{1}{2} = 22\\frac{1}{2}$ cubic feet.",
          "把水箱加满还需要的水也是一个长方体：长和宽相同，高是空着的高度。$5$ 乘 $3$ 乘 $4$ 英尺的水箱，水深 $2\\frac{1}{2}$ 英尺，空着的高度是 $1\\frac{1}{2}$ 英尺，所以还需要 $5 \\times 3 \\times 1\\frac{1}{2} = 22\\frac{1}{2}$ 立方英尺。",
        ],
        [
          "The whole tank holds $5 \\times 3 \\times 4 = 60$ and the water $5 \\times 3 \\times 2\\frac{1}{2} = 37\\frac{1}{2}$; $60 - 37\\frac{1}{2} = 22\\frac{1}{2}$.",
          "整个水箱能装 $5 \\times 3 \\times 4 = 60$，已有的水是 $5 \\times 3 \\times 2\\frac{1}{2} = 37\\frac{1}{2}$；$60 - 37\\frac{1}{2} = 22\\frac{1}{2}$。",
        ],
        ["Use the empty height, not the depth of the water already there.", "要用空着的高度，不是已有的水深。"],
      ],
      (rng) => {
        const l = rng.int(2, 12);
        const a = rng.int(1, 6);
        const h = rng.int(4, 9);
        const b = rng.int(0, 2);
        const width = Q.of(2 * a + 1, 2);
        const gap = Q.of(2 * b + 1, 2);
        const depth = Q.of(h).sub(gap);
        const base = Q.of(l).mul(width);
        const [full, water, need] = [base.mul(Q.of(h)), base.mul(depth), base.mul(gap)];
        return valued(
          [
            `A tank is ${l} ft long, $${mixedLatex(width)}$ ft wide and ${h} ft tall. The water in it is $${mixedLatex(depth)}$ ft deep. How many cubic feet of water are still needed to fill it?`,
            `一个水箱长 ${l} 英尺，宽 $${mixedLatex(width)}$ 英尺，高 ${h} 英尺。水深 $${mixedLatex(depth)}$ 英尺。还需要多少立方英尺的水才能加满？`,
          ],
          need,
          [
            [
              ["The empty height", "空着的高度"],
              ["The tank's height minus the water's depth:", "水箱的高减去水深："],
              [`${h} - ${mixedLatex(depth)} = ${mixedLatex(gap)}`],
            ],
            [
              ["The empty prism", "空余部分的体积"],
              ["Length times width times the empty height:", "长乘宽乘空着的高度："],
              [`${l} \\times ${mixedLatex(width)} \\times ${mixedLatex(gap)} = ${mixedLatex(need)}`],
            ],
          ],
          [
            `The whole tank holds $${mixedLatex(full)}$ and the water fills $${mixedLatex(water)}$: $${mixedLatex(full)} - ${mixedLatex(water)} = ${mixedLatex(need)}$.`,
            `整个水箱能装 $${mixedLatex(full)}$，已有的水是 $${mixedLatex(water)}$：$${mixedLatex(full)} - ${mixedLatex(water)} = ${mixedLatex(need)}$。`,
          ],
          [
            [full, "That is the volume of the whole tank.", "这是整个水箱的体积。"],
            [water, "That is the water already in the tank.", "这是水箱里已有的水。"],
            [base, "That is the area of the base; multiply it by the empty height.", "这是底面积，还要乘空着的高度。"],
          ],
          { form: "mixed" },
        );
      },
      drawn(gradeDrawings4["volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems#water-still-needed"]),
    ),
  ],
  "distances-between-points-in-the-coordinate-plane": [
    lesson(
      "a-point-and-its-reflection",
      ["A point and its reflection", "点与它的对称点"],
      [
        [
          "A point and its reflection in an axis are the same distance from that axis, on opposite sides, so they are twice that distance apart. $(-4, 3)$ reflected in the $y$-axis is $(4, 3)$: each is $4$ from the axis, so they are $8$ apart.",
          "点和它关于坐标轴的对称点到这条轴的距离相同，分在两侧，所以它们相距这个距离的两倍。$(-4, 3)$ 关于 $y$ 轴的对称点是 $(4, 3)$：两点到轴的距离都是 $4$，所以相距 $8$。",
        ],
        ["The first coordinates $-4$ and $4$ differ by $4 - (-4) = 8$.", "第一个坐标 $-4$ 和 $4$ 相差 $4 - (-4) = 8$。"],
        [
          "In the $y$-axis, use the distance to the $y$-axis, which is the size of the first coordinate, not the second.",
          "关于 $y$ 轴对称时，要用到 $y$ 轴的距离，即第一个坐标的大小，不是第二个。",
        ],
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
        const [qx, qy] = xAxis ? [x, -y] : [-x, y];
        const [from, to] = xAxis ? [Math.min(y, qy), Math.max(y, qy)] : [Math.min(x, qx), Math.max(x, qx)];
        const axis = xAxis ? "x" : "y";
        return valued(
          [
            `Point $P(${x}, ${y})$ is reflected in the $${axis}$-axis to point $Q$. How far apart are $P$ and $Q$?`,
            `点 $P(${x}, ${y})$ 关于 $${axis}$ 轴对称得到点 $Q$。$P$ 和 $Q$ 相距多远？`,
          ],
          2 * near,
          [
            [
              ["The distance to the axis", "到轴的距离"],
              [
                `$P$ is as far from the $${axis}$-axis as the size of its ${xAxis ? "second" : "first"} coordinate:`,
                `$P$ 到 $${axis}$ 轴的距离是它第${xAxis ? "二" : "一"}个坐标的大小：`,
              ],
              [`|${xAxis ? y : x}| = ${near}`],
            ],
            [
              ["Double it", "乘 2"],
              ["$Q$ is the same distance on the other side:", "$Q$ 在另一侧，距离相同："],
              [`2 \\times ${near} = ${2 * near}`],
            ],
          ],
          [
            `$Q$ is $(${qx}, ${qy})$, and the ${xAxis ? "second" : "first"} coordinates differ by $${to} - (${from}) = ${2 * near}$.`,
            `$Q$ 是 $(${qx}, ${qy})$，两点的第${xAxis ? "二" : "一"}个坐标相差 $${to} - (${from}) = ${2 * near}$。`,
          ],
          [
            [near, "That is the distance from $P$ to the axis, only half the way to $Q$.", "这是 $P$ 到轴的距离，只是到 $Q$ 的一半。"],
            [2 * far, "That doubles the distance to the other axis.", "这是把到另一条轴的距离乘了 2。"],
            [near + far, "That adds the sizes of the two coordinates.", "这是把两个坐标的大小相加。"],
          ],
        );
      },
      drawn(gradeDrawings4["distances-between-points-in-the-coordinate-plane#a-point-and-its-reflection"]),
    ),
  ],
  "polygons-in-the-coordinate-plane": [
    lesson(
      "the-fourth-vertex-of-a-rectangle",
      ["The fourth vertex of a rectangle", "长方形的第四个顶点"],
      [
        [
          "The sides of such a rectangle run along grid lines, so each vertex shares its first coordinate with one neighbor and its second coordinate with the other. For vertices $(1, 1)$, $(5, 1)$ and $(5, 3)$, the fourth vertex is $(1, 3)$: it shares $1$ with $(1, 1)$ and $3$ with $(5, 3)$.",
          "这样的长方形的边沿着网格线，所以每个顶点与一个相邻顶点第一个坐标相同，与另一个相邻顶点第二个坐标相同。顶点 $(1, 1)$、$(5, 1)$、$(5, 3)$ 的第四个顶点是 $(1, 3)$：它与 $(1, 1)$ 共用 $1$，与 $(5, 3)$ 共用 $3$。",
        ],
        [
          "The opposite sides match: both long sides are $5 - 1 = 4$ and both short sides are $3 - 1 = 2$.",
          "对边相等：两条长边都是 $5 - 1 = 4$，两条短边都是 $3 - 1 = 2$。",
        ],
        [
          "Keep the order of the coordinates: $(3, 1)$ is a different point from $(1, 3)$.",
          "坐标的顺序不能换：$(3, 1)$ 和 $(1, 3)$ 是不同的点。",
        ],
      ],
      (rng) => {
        const x1 = -rng.int(1, 12);
        const x2 = rng.int(1, 12);
        const y1 = -rng.int(1, 12);
        const y2 = rng.int(1, 12);
        return chosenMath(
          rng,
          [
            `Rectangle $ABCD$ has $A(${x1}, ${y1})$, $B(${x2}, ${y1})$ and $C(${x2}, ${y2})$. Where is $D$?`,
            `长方形 $ABCD$ 有 $A(${x1}, ${y1})$、$B(${x2}, ${y1})$ 和 $C(${x2}, ${y2})$。$D$ 在哪里？`,
          ],
          `(${x1}, ${y2})`,
          [
            [`(${y2}, ${x1})`, "That swaps the two coordinates.", "这把两个坐标的顺序弄反了。"],
            [
              `(${x1}, ${-y2})`,
              "That changes the sign of the second coordinate; $D$ is level with $C$.",
              "这改变了第二个坐标的符号；$D$ 与 $C$ 在同一水平线上。",
            ],
            [`(${x2}, ${y1})`, "That is $B$, which is already a vertex.", "这是 $B$，已经是一个顶点了。"],
          ],
          [
            [
              ["Line up with A", "与 A 对齐"],
              ["$D$ is straight above $A$, so it shares $A$'s first coordinate:", "$D$ 在 $A$ 的正上方，所以第一个坐标与 $A$ 相同："],
              [`x = ${x1}`],
            ],
            [
              ["Line up with C", "与 C 对齐"],
              ["$D$ is level with $C$, so it shares $C$'s second coordinate:", "$D$ 与 $C$ 在同一水平线上，所以第二个坐标与 $C$ 相同："],
              [`y = ${y2}`],
            ],
          ],
          [
            `$AB$ and $DC$ are both $${x2} - (${x1}) = ${x2 - x1}$ long, and $AD$ and $BC$ are both $${y2} - (${y1}) = ${y2 - y1}$ long.`,
            `$AB$ 和 $DC$ 长都是 $${x2} - (${x1}) = ${x2 - x1}$，$AD$ 和 $BC$ 长都是 $${y2} - (${y1}) = ${y2 - y1}$。`,
          ],
        );
      },
      drawn(gradeDrawings4["polygons-in-the-coordinate-plane#the-fourth-vertex-of-a-rectangle"]),
    ),
  ],
  "comparing-measures-of-spread": [
    lesson(
      "the-largest-value-raised",
      ["The largest value raised", "最大值变大"],
      [
        [
          "The range depends on the two extreme values, while the interquartile range depends only on the middle half. For $2, 4, 5, 7, 8, 10, 12$, raising $12$ to $20$ stretches the range from $10$ to $18$, but $Q_1 = 4$ and $Q_3 = 10$ do not move, so the IQR stays $6$.",
          "极差取决于两个极端值，而四分位距只取决于中间一半的数据。对 $2, 4, 5, 7, 8, 10, 12$，把 $12$ 增大到 $20$，极差从 $10$ 变成 $18$，但 $Q_1 = 4$、$Q_3 = 10$ 不动，所以四分位距仍是 $6$。",
        ],
        ["The range grew by $18 - 10 = 8$, exactly how much $12$ was raised.", "极差增大了 $18 - 10 = 8$，正好是 $12$ 增大的量。"],
        [
          "The IQR does not change at all: its increase is $0$, not the same as the range's.",
          "四分位距根本不变：它的增量是 $0$，和极差的增量不同。",
        ],
      ],
      (rng) => {
        const xs: number[] = [rng.int(1, 9)];
        for (let i = 1; i < 7; i++) xs.push((xs[i - 1] as number) + rng.int(1, 6));
        const at = (i: number) => xs[i] as number;
        const k = rng.int(2, 30);
        const range = rng.bool();
        const list = xs.join(", ");
        const r = at(6) - at(0);
        const iqr = at(5) - at(1);
        const prompt = (what: Pair): Pair => [
          `The data set $${list}$ has its largest value raised by $${k}$. By how much does the ${what[0]} increase?`,
          `数据 $${list}$ 的最大值增大 $${k}$。${what[1]}增大多少？`,
        ];
        if (range)
          return valued(
            prompt(["range", "极差"]),
            k,
            [
              [["The range before", "原来的极差"], ["Largest minus smallest:", "最大值减最小值："], [`${at(6)} - ${at(0)} = ${r}`]],
              [
                ["The range after", "后来的极差"],
                [`The largest value becomes $${at(6) + k}$:`, `最大值变成 $${at(6) + k}$：`],
                [`${at(6) + k} - ${at(0)} = ${r + k}`, `${r + k} - ${r} = ${k}`],
              ],
            ],
            [
              `Only the largest value moved, and the range ends at the largest value, so the range moves by the same $${k}$.`,
              `只有最大值动了，而极差的一端正是最大值，所以极差也增大同样的 $${k}$。`,
            ],
            [
              [2 * k, "That counts the change at both ends; only the largest value moved.", "这把两端都算上了变化；只有最大值动了。"],
              [r + k, "That is the new range, not the increase.", "这是新的极差，不是增量。"],
              [0, "That is the change in the interquartile range; the range does change.", "这是四分位距的变化；极差是会变的。"],
            ],
          );
        return valued(
          prompt(["interquartile range", "四分位距"]),
          0,
          [
            [
              ["The quartiles", "四分位数"],
              [
                `The $7$ values split into $${at(0)}, ${at(1)}, ${at(2)}$ and $${at(4)}, ${at(5)}, ${at(6)}$ around the median $${at(3)}$:`,
                `$7$ 个数以中位数 $${at(3)}$ 为界分成 $${at(0)}, ${at(1)}, ${at(2)}$ 和 $${at(4)}, ${at(5)}, ${at(6)}$：`,
              ],
              [`Q_1 = ${at(1)}, \\ Q_3 = ${at(5)}`],
            ],
            [
              ["After the change", "变化之后"],
              [
                `$${at(6) + k}$ is still the last value of the upper half, so $Q_3$ is still $${at(5)}$:`,
                `$${at(6) + k}$ 仍是上半部分的最后一个数，所以 $Q_3$ 仍是 $${at(5)}$：`,
              ],
              [`${at(5)} - ${at(1)} = ${iqr} \\text{ both times}`],
            ],
          ],
          [
            `The middle half runs from $${at(1)}$ to $${at(5)}$ and does not include the largest value at all, so the IQR cannot change.`,
            `中间一半的数据从 $${at(1)}$ 到 $${at(5)}$，根本不含最大值，所以四分位距不会变。`,
          ],
          [
            [
              k,
              "That is how much the range grows; the quartiles do not involve the largest value.",
              "这是极差的增量；四分位数与最大值无关。",
            ],
            [iqr, "That is the interquartile range itself, not its change.", "这是四分位距本身，不是它的变化。"],
            [r + k, "That is the new range.", "这是新的极差。"],
          ],
        );
      },
      dotPlotFigure([2, 4, 5, 7, 8, 10, 12], { min: 0, max: 20, step: 1 }),
    ),
  ],
  "measuring-centrality-from-dot-plots": [
    lesson(
      "a-new-dot-that-keeps-the-mean",
      ["A new dot that keeps the mean", "保持平均数不变的新点"],
      [
        [
          "A new value pulls the mean toward it unless it equals the mean, so a dot placed exactly at the mean is the only dot that leaves the mean where it was. Dots at $2, 3, 3, 4, 8$ have mean $20 \\div 5 = 4$, so a new dot at $4$ keeps the mean at $4$.",
          "新数据会把平均数拉向自己，除非它等于平均数，所以正好放在平均数处的点，是唯一不改变平均数的点。$2, 3, 3, 4, 8$ 处的点平均数是 $20 \\div 5 = 4$，所以在 $4$ 处加一个点，平均数仍是 $4$。",
        ],
        ["With the new dot there are $6$ dots with total $24$, and $24 \\div 6 = 4$.", "加点后共 $6$ 个点，总和 $24$，$24 \\div 6 = 4$。"],
        [
          "A dot at the tallest stack or at the middle of the number line moves the mean unless that value is the mean.",
          "放在最高一叠或数轴中点处的点会改变平均数，除非那个值正好是平均数。",
        ],
      ],
      (rng) => {
        const lo = rng.int(0, 9);
        const n = rng.pick([6, 8, 9, 10, 12]);
        const xs = Array.from({ length: n }, () => rng.int(lo, lo + 8));
        for (let i = 0; sum(xs) % n !== 0; i = (i + 1) % n) if ((xs[i] as number) < lo + 8) xs[i] = (xs[i] as number) + 1;
        const total = sum(xs);
        const mean = total / n;
        return valued(
          [
            "The dot plot shows a data set. One more dot is added and the mean stays the same. At what value is the new dot?",
            "点图表示一组数据。再加一个点后平均数不变。新的点在哪个值？",
          ],
          mean,
          [
            [
              ["Find the mean", "求平均数"],
              [`$${n}$ dots with total $${total}$:`, `共 $${n}$ 个点，总和是 $${total}$：`],
              [`${total} \\div ${n} = ${mean}`],
            ],
            [
              ["Place the new dot", "放新点"],
              ["Only a dot at the mean pulls neither way:", "只有放在平均数处的点不会把平均数拉向任何一边："],
              [`\\text{new dot} = ${mean}`],
            ],
          ],
          [
            `With the new dot: $(${total} + ${mean}) \\div ${n + 1} = ${total + mean} \\div ${n + 1} = ${mean}$.`,
            `加上新点后：$(${total} + ${mean}) \\div ${n + 1} = ${total + mean} \\div ${n + 1} = ${mean}$。`,
          ],
          [
            [n, "That is the number of dots, not the mean.", "这是点的个数，不是平均数。"],
            [Math.max(...xs), "A dot at the largest value pulls the mean up.", "放在最大值处的点会把平均数往上拉。"],
            [Math.min(...xs), "A dot at the smallest value pulls the mean down.", "放在最小值处的点会把平均数往下拉。"],
            [lo + 4, "That is the middle of the number line, not the mean of the dots.", "这是数轴的中点，不是这些点的平均数。"],
          ],
          { figure: dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }) },
        );
      },
      dotPlotFigure([2, 3, 3, 4, 8], { min: 0, max: 9, step: 1 }),
    ),
  ],
  "measuring-range-and-mad-from-dot-plots": [
    lesson(
      "the-range-after-a-new-dot",
      ["The range after a new dot", "新增一点后的极差"],
      [
        [
          "A new dot changes the range only if it falls outside the data, and then it becomes the new end. Dots from $3$ to $9$ have range $6$; a new dot at $5$ keeps the range $6$, but a new dot at $12$ makes it $12 - 3 = 9$.",
          "新的点只有落在数据范围之外才会改变极差，这时它成为新的一端。从 $3$ 到 $9$ 的点极差是 $6$；在 $5$ 处加一个点，极差仍是 $6$，但在 $12$ 处加一个点，极差变成 $12 - 3 = 9$。",
        ],
        ["$9 = 6 + 3$: the range grew by how far $12$ lies beyond $9$.", "$9 = 6 + 3$：极差增加的正是 $12$ 超出 $9$ 的部分。"],
        [
          "Use the new value only if it lies beyond an end dot; a dot inside changes nothing.",
          "只有新值超出两端的点时才用它；落在中间的点什么也不改变。",
        ],
      ],
      (rng) => {
        const lo = rng.int(8, 20);
        const n = rng.int(7, 14);
        const xs = [lo + 1, lo + 7, ...Array.from({ length: n - 2 }, () => rng.int(lo + 1, lo + 7))];
        const small = Math.min(...xs);
        const big = Math.max(...xs);
        const form = rng.int(0, 2);
        const v = form === 0 ? big + rng.int(1, 6) : form === 1 ? small - rng.int(1, 6) : rng.int(small + 1, big - 1);
        const [newMin, newMax] = [Math.min(small, v), Math.max(big, v)];
        const answer = newMax - newMin;
        const old = big - small;
        const where: Pair =
          form === 2
            ? [`lies between them`, `在它们之间`]
            : form === 0
              ? [`lies beyond the largest dot`, `超出了最大的点`]
              : [`lies below the smallest dot`, `低于最小的点`];
        const check: Pair =
          form === 2
            ? [
                `The new dot lies between the end dots, so the old range $${big} - ${small} = ${old}$ is unchanged.`,
                `新点在两端的点之间，所以原来的极差 $${big} - ${small} = ${old}$ 不变。`,
              ]
            : [
                `The old range $${old}$ grows by how far $${v}$ lies beyond the end: $${old} + ${Math.abs(answer - old)} = ${answer}$.`,
                `原来的极差 $${old}$ 增加了 $${v}$ 超出一端的部分：$${old} + ${Math.abs(answer - old)} = ${answer}$。`,
              ];
        return valued(
          [
            `The dot plot shows a data set. A new value of $${v}$ is added. What is the range now?`,
            `点图表示一组数据。新增一个值 $${v}$。现在的极差是多少？`,
          ],
          answer,
          [
            [
              ["The new ends", "新的两端"],
              [`The dots run from $${small}$ to $${big}$, and $${v}$ ${where[0]}:`, `点从 $${small}$ 到 $${big}$，$${v}$ ${where[1]}：`],
              [`\\text{smallest} = ${newMin}, \\ \\text{largest} = ${newMax}`],
            ],
            [["Subtract", "相减"], ["Largest minus smallest:", "最大值减最小值："], [`${newMax} - ${newMin} = ${answer}`]],
          ],
          check,
          [
            [old, "That is the range before the new dot; the new dot is now an end.", "这是加点前的极差；新点现在是一端。"],
            [
              Math.abs(v - small),
              "That measures from the new value to the smallest dot, not between the two ends.",
              "这是从新值量到最小的点，不是两端之间的距离。",
            ],
            [
              Math.abs(v - big),
              "That measures from the new value to the largest dot, not between the two ends.",
              "这是从新值量到最大的点，不是两端之间的距离。",
            ],
            [v, "That is the new value itself.", "这是新值本身。"],
          ],
          { figure: dotPlotFigure(xs, { min: lo - 6, max: lo + 13, step: 1 }) },
        );
      },
      dotPlotFigure([3, 4, 5, 5, 6, 7, 9], { min: 0, max: 13, step: 1 }),
    ),
  ],
};
