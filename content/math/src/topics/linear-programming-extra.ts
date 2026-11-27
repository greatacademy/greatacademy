// The rest of a first course in Linear Programming: polyhedra, anti-cycling, bounded variables, complexity,
// modeling techniques, post-optimal analysis, starting plans, network and integer methods, and large programs.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { linearProgrammingDrawings1 } from "../explanation-drawings-linear-programming-1.ts";
import { point, topic } from "../university-kit.ts";
import { drawn } from "./figure-reading-more.ts";
import { plus, solved } from "./linear-programming.ts";
import { arcsFigure } from "./linear-programming-more.ts";
import { chosen, lesson, type Miss, type Slip } from "./number-theory-course.ts";

/** binomial computes a small binomial coefficient exactly. */
const binomial = (n: number, k: number): number => {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
};

/** permutationsOf3 lists the six assignments of three workers to three jobs. */
const permutationsOf3 = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;

const polyhedra = lesson(
  topic(
    "polyhedra-and-extreme-points",
    ["Polyhedra and Extreme Points", "多面体和极点"],
    ["Connect corners of the feasible region with basic solutions, and count them.", "把可行域的角点与基本解联系起来，并计算它们的个数。"],
    ["basic-feasible-solutions", "convex-sets-and-convex-combinations"],
    [],
    [
      point(
        "counting-basic-solutions",
        ["Counting basic solutions", "计算基本解的个数"],
        [
          "A system with $m$ equations and $n$ variables picks $m$ basic columns, so there are at most $\\binom{n}{m}$ basic solutions. This finite count is why the search for an optimal corner must end.\n\nWith 2 equations and 4 variables, the basic columns are one of the pairs $\\{1, 2\\}, \\{1, 3\\}, \\{1, 4\\}, \\{2, 3\\}, \\{2, 4\\}, \\{3, 4\\}$, so there are at most $\\binom{4}{2} = 6$ basic solutions.\n\nCheck: $\\binom{4}{2} = \\frac{4 \\times 3}{2} = 6$, the number of pairs listed.\n\n> **Watch out.** The count is an upper bound: a choice of columns that are dependent gives no basic solution at all.",
          "有 $m$ 个方程和 $n$ 个变量的方程组选 $m$ 个基本列，所以至多有 $\\binom{n}{m}$ 个基本解。这个有限的个数就是寻找最优角点必然结束的原因。\n\n有 2 个方程和 4 个变量时，基本列是 $\\{1, 2\\}, \\{1, 3\\}, \\{1, 4\\}, \\{2, 3\\}, \\{2, 4\\}, \\{3, 4\\}$ 中的一对，所以至多有 $\\binom{4}{2} = 6$ 个基本解。\n\n检验：$\\binom{4}{2} = \\frac{4 \\times 3}{2} = 6$，正是列出的对数。\n\n> **注意。** 这个数是上界：线性相关的列组不给出基本解。",
        ],
        (rng) => {
          const m = rng.int(2, 7);
          const n = m + rng.int(1, 8);
          const v = binomial(n, m);
          return solved(
            [
              `A standard form program has ${m} equations and ${n} variables. At most how many basic solutions does it have?`,
              `标准形式的规划有 ${m} 个方程和 ${n} 个变量。它至多有多少个基本解？`,
            ],
            v,
            [
              [
                n * m,
                `That multiplies the counts; a basis is a choice of ${m} columns out of ${n}.`,
                `这是把两个数相乘；基是从 ${n} 列中选 ${m} 列。`,
              ],
              [2 ** n, `That counts every set of columns, not only the sets of ${m}.`, `这数的是所有列组，而不只是 ${m} 列的列组。`],
              [
                binomial(n, m - 1),
                `That chooses ${m - 1} columns; a basis needs one column for each of the ${m} equations.`,
                `这是选 ${m - 1} 列；基需要为 ${m} 个方程各配一列。`,
              ],
            ],
            [
              [
                ["Choose the basic columns", "选基本列"],
                [
                  `A basic solution comes from choosing which ${m} of the ${n} columns are basic, one for each equation.`,
                  `基本解来自从 ${n} 列中选出 ${m} 列作为基本列，每个方程一列。`,
                ],
              ],
              [
                ["Count the choices", "数选法"],
                [
                  `Choose which ${m} of the ${n} columns are basic, which gives $\\binom{${n}}{${m}} = ${v}$ choices.`,
                  `从 ${n} 列中选 ${m} 列作为基本列，有 $\\binom{${n}}{${m}} = ${v}$ 种选法。`,
                ],
              ],
            ],
            [
              `Choosing the ${n - m} nonbasic columns instead gives the same count, $\\binom{${n}}{${n - m}} = ${v}$.`,
              `改为选 ${n - m} 个非基本列，得到同样的个数 $\\binom{${n}}{${n - m}} = ${v}$。`,
            ],
          );
        },
      ),
      point(
        "corners-of-a-box-and-a-simplex",
        ["Corners of a box and a simplex", "长方体和单纯形的角点"],
        [
          "The number of corners can grow fast or slowly. A box in $n$ variables has $2^{n}$ corners with only $2n$ constraints, while a simplex with $n$ nonnegative variables and one sum constraint has $n + 1$.\n\nThe cube $0 \\le x_i \\le 1$ in 3 variables has 6 constraints and $2^{3} = 8$ corners, while $x_i \\ge 0$, $x_1 + x_2 + x_3 \\le 1$ has the 4 corners $(0, 0, 0)$, $(1, 0, 0)$, $(0, 1, 0)$ and $(0, 0, 1)$.\n\nCheck: each corner of the cube picks 0 or 1 for each of 3 coordinates, and $2 \\times 2 \\times 2 = 8$.\n\n> **Watch out.** The number of corners is not the number of constraints; it can be far larger.",
          "角点的个数可能增长得快或慢。$n$ 个变量的长方体只有 $2n$ 个约束，却有 $2^{n}$ 个角点，而有 $n$ 个非负变量和一个和约束的单纯形有 $n + 1$ 个角点。\n\n三个变量的立方体 $0 \\le x_i \\le 1$ 有 6 个约束和 $2^{3} = 8$ 个角点，而 $x_i \\ge 0$，$x_1 + x_2 + x_3 \\le 1$ 有 4 个角点 $(0, 0, 0)$、$(1, 0, 0)$、$(0, 1, 0)$ 和 $(0, 0, 1)$。\n\n检验：立方体的每个角点给 3 个坐标各选 0 或 1，$2 \\times 2 \\times 2 = 8$。\n\n> **注意。** 角点的个数不是约束的个数，它可能大得多。",
        ],
        (rng) => {
          const n = rng.int(2, 20);
          const box = rng.bool();
          const u = rng.int(2, 30);
          return solved(
            box
              ? [
                  `How many corners does the box $0 \\le x_i \\le ${u}$ have, for $i = 1, \\ldots, ${n}$?`,
                  `长方体 $0 \\le x_i \\le ${u}$（$i = 1, \\ldots, ${n}$）有多少个角点？`,
                ]
              : [
                  `How many corners does the region $x_i \\ge 0$, $x_1 + \\cdots + x_{${n}} \\le ${u}$ have?`,
                  `区域 $x_i \\ge 0$，$x_1 + \\cdots + x_{${n}} \\le ${u}$ 有多少个角点？`,
                ],
            box ? 2 ** n : n + 1,
            box
              ? [
                  [2 * n, "That is the number of constraints, not the number of corners.", "这是约束的个数，不是角点的个数。"],
                  [n + 1, "That is the count for a simplex, which has one sum constraint.", "这是单纯形的角点数，单纯形只有一个和约束。"],
                  [
                    2 ** (n - 1),
                    "That halves the count; every coordinate has two choices independently.",
                    "这少了一半；每个坐标都独立地有两种选择。",
                  ],
                ]
              : [
                  [
                    2 ** n,
                    "That is the count for a box, where each coordinate has two bounds.",
                    "这是长方体的角点数，那里每个坐标有两个界。",
                  ],
                  [
                    2 * n,
                    "That puts two corners on each axis; each axis has only one besides the origin.",
                    "这在每条轴上放了两个角点；除原点外每条轴只有一个。",
                  ],
                  [n, "That forgets the origin, which is also a corner.", "这漏掉了原点，原点也是角点。"],
                ],
            box
              ? [
                  [
                    ["Place each coordinate", "确定每个坐标"],
                    [`At a corner each of the ${n} coordinates is at 0 or at ${u}.`, `在角点处，${n} 个坐标各取 0 或 ${u}。`],
                  ],
                  [
                    ["Count the corners", "数角点"],
                    [
                      `Each of the ${n} coordinates is independently at one of its two bounds, so there are $2^{${n}} = ${2 ** n}$ corners.`,
                      `这 ${n} 个坐标各自独立地取两个界之一，所以有 $2^{${n}} = ${2 ** n}$ 个角点。`,
                    ],
                  ],
                ]
              : [
                  [
                    ["List the corners", "列出角点"],
                    [
                      `The corners are the origin and one point on each of the ${n} axes, where that coordinate is ${u}.`,
                      `角点是原点和 ${n} 条坐标轴上各一点，那里该坐标等于 ${u}。`,
                    ],
                  ],
                  [
                    ["Count the corners", "数角点"],
                    [`That is $1 + ${n} = ${n + 1}$ corners.`, `共 $1 + ${n} = ${n + 1}$ 个角点。`],
                  ],
                ],
            box
              ? [
                  `Each corner makes ${n} of the ${2 * n} bound constraints tight, one for each coordinate, as a corner in ${n} variables needs.`,
                  `每个角点使 ${2 * n} 个界约束中的 ${n} 个取等号，每个坐标一个，正是 ${n} 个变量中角点所需的个数。`,
                ]
              : [
                  `Each corner makes ${n} of the ${n + 1} constraints tight: the origin makes all ${n} sign constraints tight, and the point on an axis makes the sum and the other ${n - 1} sign constraints tight.`,
                  `每个角点使 ${n + 1} 个约束中的 ${n} 个取等号：原点使全部 ${n} 个符号约束取等号，轴上的点使和约束与其余 ${n - 1} 个符号约束取等号。`,
                ],
          );
        },
      ),
      point(
        "testing-a-point-for-a-corner",
        ["Testing a point for a corner", "判断一点是否是角点"],
        [
          "In two variables, a feasible point is a corner when two independent constraints are tight there. A feasible point with fewer tight constraints is the midpoint of a small segment in the region, so it is not extreme.\n\nIn the region $x \\ge 0$, $y \\ge 0$, $x + y \\le 6$, the point $(6, 0)$ makes $y \\ge 0$ and $x + y \\le 6$ tight, so it is a corner. The point $(2, 4)$ makes only $x + y \\le 6$ tight, so it is not.\n\nCheck: $(2, 4)$ is the midpoint of $(1, 5)$ and $(3, 3)$, both in the region.\n\n> **Watch out.** A point on the boundary need not be a corner; count the tight constraints.",
          "在两个变量中，可行点是角点，当且仅当有两个独立约束在那里取等号。取等号的约束更少的可行点是区域内一小段线段的中点，所以不是极点。\n\n在区域 $x \\ge 0$，$y \\ge 0$，$x + y \\le 6$ 中，点 $(6, 0)$ 使 $y \\ge 0$ 和 $x + y \\le 6$ 取等号，所以是角点。点 $(2, 4)$ 只使 $x + y \\le 6$ 取等号，所以不是。\n\n检验：$(2, 4)$ 是 $(1, 5)$ 和 $(3, 3)$ 的中点，这两点都在区域内。\n\n> **注意。** 边界上的点不一定是角点；要数取等号的约束。",
        ],
        (rng) => {
          const s = rng.int(4, 12);
          const kind = rng.int(0, 2);
          const x = rng.int(1, s - 1);
          const [px, py] =
            kind === 0 ? [s, 0] : kind === 1 ? [x, s - x] : [Math.max(1, Math.floor(x / 2)), 1 >= s - Math.floor(x / 2) ? 0 : 1];
          const tight = (px === 0 ? 1 : 0) + (py === 0 ? 1 : 0) + (px + py === s ? 1 : 0);
          const yes: [string, string] = ["Yes, it is a corner", "是，它是角点"];
          const no: [string, string] = ["No, it is not a corner", "不，它不是角点"];
          const onSum = px + py === s;
          const [ends0, ends1] = onSum
            ? [`(${px - 1}, ${py + 1})`, `(${px + 1}, ${py - 1})`]
            : [`(${px - 1}, ${py})`, `(${px + 1}, ${py})`];
          return chosen(
            rng,
            [
              `Is $(${px}, ${py})$ a corner of the region $x \\ge 0$, $y \\ge 0$, $x + y \\le ${s}$?`,
              `$(${px}, ${py})$ 是区域 $x \\ge 0$，$y \\ge 0$，$x + y \\le ${s}$ 的角点吗？`,
            ],
            tight >= 2 ? yes : no,
            [
              tight >= 2
                ? [
                    no,
                    `Two constraints are tight at $(${px}, ${py})$, which is enough in two variables.`,
                    `在 $(${px}, ${py})$ 处有两个约束取等号，在两个变量中这就够了。`,
                  ]
                : [
                    yes,
                    tight === 0
                      ? "No constraint is tight there, and a corner needs two."
                      : "Only one constraint is tight there, and a corner needs two.",
                    tight === 0 ? "那里没有约束取等号，而角点需要两个。" : "那里只有一个约束取等号，而角点需要两个。",
                  ],
              [
                ["Only if the objective is maximized there", "只有当目标函数在那里取最大值时"],
                "Being a corner depends only on the region, not on any objective.",
                "是否是角点只取决于区域，与目标函数无关。",
              ],
              [
                ["It is outside the region", "它在区域之外"],
                `Its coordinates are nonnegative and add up to ${px + py}, at most ${s}, so it lies in the region.`,
                `它的坐标非负，和为 ${px + py}，不超过 ${s}，所以它在区域内。`,
              ],
            ],
            [
              [
                ["Check feasibility", "检查可行性"],
                [
                  `The point has nonnegative coordinates and $${px} + ${py} = ${px + py} \\le ${s}$, so it is feasible.`,
                  `该点坐标非负，且 $${px} + ${py} = ${px + py} \\le ${s}$，所以可行。`,
                ],
              ],
              [
                ["Count the tight constraints", "数取等号的约束"],
                [
                  `Exactly ${tight} of the constraints ${tight === 1 ? "is" : "are"} tight at this point, and a corner needs two.`,
                  `在这一点恰有 ${tight} 个约束取等号，而角点需要两个。`,
                ],
              ],
            ],
            tight >= 2
              ? [
                  `The lines $y = 0$ and $x + y = ${s}$ meet only at $(${s}, 0)$, so no segment of the region has it in its middle.`,
                  `直线 $y = 0$ 和 $x + y = ${s}$ 只交于 $(${s}, 0)$，所以它不在区域内任何线段的中间。`,
                ]
              : [
                  `The point is the midpoint of $${ends0}$ and $${ends1}$, which both lie in the region.`,
                  `该点是 $${ends0}$ 和 $${ends1}$ 的中点，这两点都在区域内。`,
                ],
            drawn(
              { xMin: -1, xMax: s + 1, yMin: -1, yMax: s + 1, labelEvery: s > 8 ? 2 : 1 },
              [
                {
                  kind: "polygon",
                  points: [
                    [0, 0],
                    [s, 0],
                    [0, s],
                  ],
                },
                { kind: "point", at: [px, py], accent: true },
              ],
              t(
                `The triangle with corners (0, 0), (${s}, 0) and (0, ${s}), with the point (${px}, ${py}) marked.`,
                `顶点为 (0, 0)，(${s}, 0) 和 (0, ${s}) 的三角形，标出了点 (${px}, ${py})。`,
              ),
            ),
          );
        },
      ),
    ],
  ),
  [
    "The triangle $x \\ge 0$, $y \\ge 0$, $x + y \\le 4$ has the corners $(0, 0)$, $(4, 0)$ and $(0, 4)$. With a slack $s$, its constraint becomes $x + y + s = 4$: one equation in three variables, and each corner is a basic solution with one basic variable.",
    "三角形 $x \\ge 0$，$y \\ge 0$，$x + y \\le 4$ 的角点是 $(0, 0)$、$(4, 0)$ 和 $(0, 4)$。加上松弛变量 $s$，约束变为 $x + y + s = 4$：三个变量的一个方程，每个角点都是只有一个基本变量的基本解。",
  ],
  ["$\\binom{3}{1} = 3$, the number of corners.", "$\\binom{3}{1} = 3$，正是角点的个数。"],
  [
    "count basic solutions, count the corners of boxes and simplices, and test whether a point is a corner.",
    "计算基本解的个数，数长方体和单纯形的角点，并判断一点是否是角点。",
  ],
);

const bland = lesson(
  topic(
    "blands-rule-and-cycling",
    ["Bland's Rule and Cycling", "布兰德法则和循环"],
    [
      "Recognize a degenerate pivot, and use an index rule that guarantees the method stops.",
      "识别退化的主元运算，并使用保证方法停止的下标规则。",
    ],
    ["unboundedness-and-degeneracy"],
    [],
    [
      point(
        "the-entering-variable",
        ["The entering variable", "进基变量"],
        [
          "Dantzig's rule enters the variable with the most negative reduced cost, but with degeneracy it can cycle forever. Bland's rule instead enters the eligible variable with the smallest index, and this prevents any cycle.\n\nWith reduced costs $3, -2, -5, 1$ for $x_1, \\ldots, x_4$, Dantzig's rule enters $x_3$, because $-5$ is the most negative, while Bland's rule enters $x_2$, the first negative.\n\nCheck: the only negative entries are at indices 2 and 3, and $-5 < -2$.\n\n> **Watch out.** Bland's rule looks at the index, not at the size of the reduced cost.",
          "丹齐格规则让检验数最负的变量进基，但在退化时它可能永远循环。布兰德法则改为让下标最小的合格变量进基，这样就不会出现循环。\n\n$x_1, \\ldots, x_4$ 的检验数是 $3, -2, -5, 1$ 时，丹齐格规则让 $x_3$ 进基，因为 $-5$ 最负；布兰德法则让第一个负的 $x_2$ 进基。\n\n检验：负的元素只在下标 2 和 3 处，且 $-5 < -2$。\n\n> **注意。** 布兰德法则看的是下标，而不是检验数的大小。",
        ],
        (rng) => {
          const costs = [rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8)];
          const at = rng.int(0, 4);
          costs[at] = -rng.int(1, 12);
          const bland = costs.findIndex((c) => c < 0) + 1;
          const low = Math.min(...costs);
          const dantzig = costs.indexOf(low) + 1;
          const useBland = rng.bool();
          const negatives = costs.flatMap((c, i) => (c < 0 ? [i + 1] : []));
          const last = negatives[negatives.length - 1] as number;
          const high = costs.indexOf(Math.max(...costs)) + 1;
          return solved(
            [
              `In a maximization tableau, the reduced costs of $x_1, \\ldots, x_5$ are $${costs.join(", ")}$, and negative ones can enter. Which index enters under ${useBland ? "Bland's rule" : "Dantzig's rule"}?`,
              `在最大化单纯形表中，$x_1, \\ldots, x_5$ 的检验数是 $${costs.join(", ")}$，负的可以进基。按${useBland ? "布兰德法则" : "丹齐格规则"}哪个下标进基？`,
            ],
            useBland ? bland : dantzig,
            useBland
              ? [
                  [
                    dantzig,
                    "That is Dantzig's choice, the most negative; Bland's rule takes the first negative.",
                    "这是丹齐格规则的选择，即最负的；布兰德法则取第一个负的。",
                  ],
                  [
                    last,
                    "That is the last negative entry; Bland's rule takes the smallest index.",
                    "这是最后一个负的元素；布兰德法则取最小的下标。",
                  ],
                  [low, "That is a reduced cost, not an index.", "这是检验数，不是下标。"],
                ]
              : [
                  [
                    bland,
                    "That is the first negative entry; Dantzig's rule takes the most negative.",
                    "这是第一个负的元素；丹齐格规则取最负的。",
                  ],
                  [high, "That is the largest reduced cost; the most negative one enters.", "这是最大的检验数；应让最负的进基。"],
                  [low, "That is the reduced cost itself, not its index.", "这是检验数本身，不是它的下标。"],
                ],
            [
              [
                ["Find the negative entries", "找出负的元素"],
                [`The negative reduced costs are at the indices ${negatives.join(", ")}.`, `负的检验数在下标 ${negatives.join("、")} 处。`],
              ],
              [
                ["Apply the rule", "使用规则"],
                useBland
                  ? [
                      `Bland's rule picks the first negative value, which is at index ${bland}.`,
                      `布兰德法则选第一个负值，它在下标 ${bland} 处。`,
                    ]
                  : [
                      `Dantzig's rule picks the most negative value, ${low}, at index ${dantzig}.`,
                      `丹齐格规则选最负的值 ${low}，它在下标 ${dantzig} 处。`,
                    ],
              ],
            ],
            useBland
              ? bland === 1
                ? ["Index 1 is negative, and no index is smaller.", "下标 1 处是负的，没有更小的下标。"]
                : [
                    `Every index before ${bland} has a reduced cost of at least 0, so none of them can enter.`,
                    `${bland} 之前的每个下标的检验数都不小于 0，所以它们都不能进基。`,
                  ]
              : [`No reduced cost is below ${low}, so index ${dantzig} enters.`, `没有检验数小于 ${low}，所以下标 ${dantzig} 进基。`],
          );
        },
      ),
      point(
        "breaking-a-tie-for-leaving",
        ["Breaking a tie for leaving", "打破离基的平局"],
        [
          "When the minimum ratio is shared by several rows, Bland's rule removes the basic variable with the smallest index. Ties of this kind are exactly what makes the next basis degenerate, since a basic variable becomes zero.\n\nIf the rows of $x_4$ and $x_2$ both have the minimum ratio 3, Bland's rule removes $x_2$, the smaller index, and $x_4$ stays basic with the value 0.\n\nCheck: both rows reach zero when the entering variable reaches 3, so whichever stays basic is 0.\n\n> **Watch out.** Compare the indices of the basic variables, not the positions of the rows.",
          "当几行共享最小比值时，布兰德法则让下标最小的基本变量离基。这种平局正是下一个基退化的原因，因为有基本变量变成零。\n\n如果 $x_4$ 和 $x_2$ 所在行的最小比值都是 3，布兰德法则让下标较小的 $x_2$ 离基，$x_4$ 留在基中，值为 0。\n\n检验：进基变量达到 3 时两行都降到零，所以留在基中的那个等于 0。\n\n> **注意。** 比较的是基本变量的下标，而不是行的位置。",
        ],
        (rng) => {
          const r = rng.int(2, 12);
          const idx = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
          const pivots = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)] as [number, number, number];
          const rhs = [r * pivots[0], r * pivots[1], (r + rng.int(1, 5)) * pivots[2]] as [number, number, number];
          const least = Math.min(idx[0], idx[1]);
          const most = Math.max(idx[0], idx[1]);
          const third = rhs[2] / pivots[2];
          const ratio = (i: 0 | 1 | 2) => `$\\frac{${rhs[i]}}{${pivots[i]}} = ${rhs[i] / pivots[i]}$`;
          return solved(
            [
              `Rows with basic variables $x_{${idx[0]}}, x_{${idx[1]}}, x_{${idx[2]}}$ have right sides ${rhs.join(", ")} and pivot column entries ${pivots.join(", ")}. Which index leaves under Bland's rule?`,
              `基本变量为 $x_{${idx[0]}}, x_{${idx[1]}}, x_{${idx[2]}}$ 的各行右端是 ${rhs.join(", ")}，主元列的元素是 ${pivots.join(", ")}。按布兰德法则哪个下标离基？`,
            ],
            least,
            [
              [
                most,
                "That is the larger index of the tied rows; Bland's rule removes the smaller.",
                "这是并列两行中较大的下标；布兰德法则让较小的离基。",
              ],
              [
                idx[2],
                `That row has the ratio ${third}, larger than ${r}, so it does not tie for the minimum.`,
                `这一行的比值是 ${third}，大于 ${r}，所以不在最小比值的并列之中。`,
              ],
              [r, "That is the tied ratio, not the index of a variable.", "这是并列的比值，不是变量的下标。"],
            ],
            [
              [
                ["Compute the ratios", "计算比值"],
                [`The ratios are ${ratio(0)}, ${ratio(1)} and ${ratio(2)}.`, `比值是 ${ratio(0)}、${ratio(1)} 和 ${ratio(2)}。`],
              ],
              [
                ["Break the tie", "打破平局"],
                [
                  `The first two rows tie with the ratio ${r}, and the smaller index among them, ${least}, leaves.`,
                  `前两行的比值都是 ${r}，其中较小的下标 ${least} 离基。`,
                ],
              ],
            ],
            [
              `Both tied rows reach zero at the ratio ${r}, so $x_{${most}}$ stays basic with the value 0, and the next basis is degenerate.`,
              `两行在比值 ${r} 处都降到零，所以 $x_{${most}}$ 留在基中，值为 0，下一个基是退化的。`,
            ],
          );
        },
      ),
      point(
        "a-degenerate-pivot",
        ["A degenerate pivot", "退化的主元运算"],
        [
          "If the leaving row has right side zero, the entering variable stays at zero. The basis changes but the point and the objective do not, so several consecutive pivots can make no visible progress at all.\n\nWith objective 40, an entering reduced cost of $-3$ and minimum ratio 0, the entering variable stays at 0 and the objective stays 40. With ratio 2 instead, it would rise by $3(2) = 6$ to 46.\n\nCheck: $40 + 3(0) = 40$ and $40 + 3(2) = 46$.\n\n> **Watch out.** A change of basis is not progress by itself: at a degenerate pivot the point does not move.",
          "如果离基行的右端是零，进基变量仍然是零。基变了，但点和目标值都不变，所以连续几次主元运算可能完全看不到进展。\n\n目标值为 40，进基检验数为 $-3$，最小比值为 0 时，进基变量仍为 0，目标值仍是 40。若比值改为 2，目标值增加 $3(2) = 6$，变为 46。\n\n检验：$40 + 3(0) = 40$，$40 + 3(2) = 46$。\n\n> **注意。** 换基本身不等于进展：退化的主元运算中点并不移动。",
        ],
        (rng) => {
          const z = rng.int(10, 300);
          const c = rng.int(1, 15);
          const degenerate = rng.bool();
          const ratio = degenerate ? 0 : rng.int(1, 12);
          const answer = z + c * ratio;
          return solved(
            [
              `The objective is ${z}, the entering variable has reduced cost $-${c}$, and the minimum ratio is ${ratio}. What is the objective after the pivot?`,
              `目标值是 ${z}，进基变量的检验数是 $-${c}$，最小比值是 ${ratio}。主元运算后目标值是多少？`,
            ],
            answer,
            degenerate
              ? [
                  [
                    z + c,
                    "That moves the entering variable to 1; with the ratio 0 it stays at 0.",
                    "这让进基变量变成 1；比值为 0 时它仍是 0。",
                  ],
                  [
                    z - c,
                    "That subtracts the reduced cost, and the ratio 0 means nothing changes at all.",
                    "这减去了检验数，而比值为 0 意味着什么都不变。",
                  ],
                  [c, "That is the size of the reduced cost, not the objective.", "这是检验数的大小，不是目标值。"],
                ]
              : [
                  [
                    z - c * ratio,
                    "That subtracts; entering a variable with a negative reduced cost raises a maximization objective.",
                    "这是减；让检验数为负的变量进基会使最大化的目标增大。",
                  ],
                  [
                    z,
                    `That treats the pivot as degenerate; the ratio is ${ratio}, not 0.`,
                    `这把主元运算当成退化的；比值是 ${ratio}，不是 0。`,
                  ],
                  [z + ratio, `That adds the ratio alone, without multiplying by ${c}.`, `这只加了比值，没有乘 ${c}。`],
                  [z + c, "That adds the reduced cost once, without multiplying by the ratio.", "这只加了一次检验数，没有乘比值。"],
                ],
            [
              [
                ["Find the step", "求步长"],
                [`The entering variable rises from 0 to the minimum ratio, ${ratio}.`, `进基变量从 0 增加到最小比值 ${ratio}。`],
              ],
              [
                ["Change the objective", "改变目标值"],
                [
                  `Each unit raises the objective by ${c}, so it rises by $${c}(${ratio}) = ${c * ratio}$ to ${answer}.`,
                  `每一单位使目标值增加 ${c}，所以增加 $${c}(${ratio}) = ${c * ratio}$，变为 ${answer}。`,
                ],
              ],
            ],
            degenerate
              ? [
                  `The entering variable stays at 0, so the point and the objective ${z} are unchanged.`,
                  `进基变量仍为 0，所以点和目标值 ${z} 都不变。`,
                ]
              : [
                  `$${answer} - ${z} = ${c * ratio}$, and dividing this rise by ${c} gives back the ratio ${ratio}.`,
                  `$${answer} - ${z} = ${c * ratio}$，把这个增量除以 ${c} 又得到比值 ${ratio}。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "With reduced costs $-1$ and $-4$ for $x_1$ and $x_2$, Dantzig's rule enters $x_2$ and Bland's rule enters $x_1$. If the minimum ratio is 0, the pivot changes the basis but leaves the objective where it was.",
    "$x_1$ 和 $x_2$ 的检验数是 $-1$ 和 $-4$ 时，丹齐格规则让 $x_2$ 进基，布兰德法则让 $x_1$ 进基。如果最小比值是 0，主元运算改变了基，但目标值不变。",
  ],
  ["At a degenerate pivot the objective changes by $4(0) = 0$.", "在退化的主元运算中，目标值的变化是 $4(0) = 0$。"],
  [
    "pick the entering and leaving variables by Bland's rule, and follow the objective through a degenerate pivot.",
    "按布兰德法则选进基和离基变量，并跟踪退化主元运算中的目标值。",
  ],
);

const boundedVariables = lesson(
  topic(
    "the-simplex-method-with-bounded-variables",
    ["The Simplex Method With Bounded Variables", "带界变量的单纯形法"],
    ["Handle lower and upper bounds without adding rows for them.", "不为上下界增加行就能处理它们。"],
    ["pivoting-in-the-simplex-method"],
    [],
    [
      point(
        "shifting-a-lower-bound",
        ["Shifting a lower bound", "平移下界"],
        [
          "A lower bound $x \\ge l$ disappears when we substitute $x = l + x'$ with $x' \\ge 0$. Each constraint's right side then falls by the coefficient of $x$ times $l$, and the objective gains a constant.\n\nIn $3x + 2y \\le 20$ with $x \\ge 4$, put $x = 4 + x'$: then $12 + 3x' + 2y \\le 20$, so $3x' + 2y \\le 8$.\n\nCheck: at $x' = 0$ the variable $x$ is 4, which uses $3(4) = 12$ of the 20, and $12 + 8 = 20$.\n\n> **Watch out.** Subtract the coefficient times the bound, not the bound alone.",
          "令 $x = l + x'$，$x' \\ge 0$，下界 $x \\ge l$ 就消失了。每个约束的右端减少 $x$ 的系数乘 $l$，目标函数增加一个常数。\n\n在 $3x + 2y \\le 20$ 中，$x \\ge 4$，令 $x = 4 + x'$：得 $12 + 3x' + 2y \\le 20$，即 $3x' + 2y \\le 8$。\n\n检验：$x' = 0$ 时 $x$ 等于 4，用掉 20 中的 $3(4) = 12$，而 $12 + 8 = 20$。\n\n> **注意。** 减去的是系数乘界，而不是界本身。",
        ],
        (rng) => {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const l = rng.int(2, 15);
          const r = a * l + rng.int(5, 200);
          return solved(
            [
              `In $${a}x + ${b}y \\le ${r}$ with $x \\ge ${l}$, substitute $x = ${l} + x'$. What is the new right side?`,
              `在 $${a}x + ${b}y \\le ${r}$ 中，$x \\ge ${l}$，代入 $x = ${l} + x'$。新的右端是多少？`,
            ],
            r - a * l,
            [
              [
                r + a * l,
                `That adds the constant; moving ${a * l} to the right side subtracts it.`,
                `这是加上常数；把 ${a * l} 移到右边应减去它。`,
              ],
              [
                r - l,
                `That subtracts ${l} alone; the term $${a}x$ contributes ${a} times ${l}.`,
                `这只减去了 ${l}；项 $${a}x$ 贡献的是 ${a} 乘 ${l}。`,
              ],
              [
                r - b * l,
                "That multiplies the bound by the coefficient of $y$; the bound is on $x$.",
                "这把界乘了 $y$ 的系数；界是关于 $x$ 的。",
              ],
              [a * l, "That is the constant moved across, not the new right side.", "这是移过去的常数，不是新的右端。"],
            ],
            [
              [
                ["Substitute", "代入"],
                [
                  `The left side becomes $${a}(${l} + x') + ${b}y = ${a * l} + ${a}x' + ${b}y$.`,
                  `左边变为 $${a}(${l} + x') + ${b}y = ${a * l} + ${a}x' + ${b}y$。`,
                ],
              ],
              [
                ["Move the constant", "移项"],
                [
                  `Substituting adds the constant $${a}(${l}) = ${a * l}$ on the left. Moving it across leaves the right side $${r} - ${a * l} = ${r - a * l}$.`,
                  `代入后左边多出常数 $${a}(${l}) = ${a * l}$。把它移到右边，右端变成 $${r} - ${a * l} = ${r - a * l}$。`,
                ],
              ],
            ],
            [
              `Adding the constant back gives $${r - a * l} + ${a * l} = ${r}$, the old right side.`,
              `把常数加回去得 $${r - a * l} + ${a * l} = ${r}$，正是原来的右端。`,
            ],
          );
        },
      ),
      {
        ...point(
          "reflecting-an-upper-bound",
          ["Reflecting an upper bound", "反射上界"],
          [
            "A variable at its upper bound $u$ can be replaced by $x = u - x'$, so that $x' \\ge 0$ measures the distance below the bound. In the new row, the coefficient of the variable changes sign and the right side shifts.\n\nIn $2x + y = 10$ with $x \\le 3$, put $x = 3 - x'$: then $6 - 2x' + y = 10$, so $-2x' + y = 4$.\n\nCheck: at $x' = 0$ the variable $x$ is 3, the new row gives $y = 4$, and $2(3) + 4 = 10$.\n\n> **Watch out.** The coefficient of $x'$ is the negative of the coefficient of $x$; forgetting the sign change breaks the row.",
            "处于上界 $u$ 的变量可以换成 $x = u - x'$，于是 $x' \\ge 0$ 表示距上界的距离。在新的行中，这个变量的系数变号，右端也平移。\n\n在 $2x + y = 10$ 中，$x \\le 3$，令 $x = 3 - x'$：得 $6 - 2x' + y = 10$，即 $-2x' + y = 4$。\n\n检验：$x' = 0$ 时 $x$ 等于 3，新的行给出 $y = 4$，而 $2(3) + 4 = 10$。\n\n> **注意。** $x'$ 的系数是 $x$ 的系数的相反数；忘了变号，这一行就错了。",
          ],
          (rng) => {
            const a = rng.int(2, 12);
            const u = rng.int(2, 20);
            const b = rng.int(1, 200);
            const answer = b - a * u;
            return solved(
              [
                `In $${a}x + y = ${b}$ with $x \\le ${u}$, substitute $x = ${u} - x'$. In the form $-${a}x' + y = R$, what is $R$?`,
                `在 $${a}x + y = ${b}$ 中，$x \\le ${u}$，代入 $x = ${u} - x'$。写成 $-${a}x' + y = R$，$R$ 是多少？`,
              ],
              answer,
              [
                [b + a * u, `That adds; the constant ${a * u} moves across and is subtracted.`, `这是加；常数 ${a * u} 移过去后应被减去。`],
                [b - u, `That subtracts ${u} alone, not ${a} times ${u}.`, `这只减去了 ${u}，而不是 ${a} 乘 ${u}。`],
                [a * u - b, "That reverses the subtraction.", "这把减法的顺序弄反了。"],
              ],
              [
                [
                  ["Substitute", "代入"],
                  [
                    `The left side becomes $${a}(${u} - x') + y = ${a * u} - ${a}x' + y$.`,
                    `左边变为 $${a}(${u} - x') + y = ${a * u} - ${a}x' + y$。`,
                  ],
                ],
                [
                  ["Move the constant", "移项"],
                  [
                    `The constant ${a * u} moves to the right side and is subtracted from ${b}: $R = ${b} - ${a * u} = ${answer}$.`,
                    `常数 ${a * u} 移到右端，从 ${b} 中减去：$R = ${b} - ${a * u} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `At $x' = 0$ the variable $x$ is ${u}, the new row gives $y = ${answer}$, and $${a * u} ${plus(answer)} = ${b}$.`,
                `$x' = 0$ 时 $x$ 等于 ${u}，新的行给出 $y = ${answer}$，而 $${a * u} ${plus(answer)} = ${b}$。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["the-simplex-method-with-bounded-variables#reflecting-an-upper-bound"],
      },
      point(
        "the-bound-in-the-ratio-test",
        ["The bound in the ratio test", "比值检验中的界"],
        [
          "With an upper bound, the entering variable may stop for a new reason: it reaches its own bound. So the step is the smallest of the usual ratios and the bound, and if the bound wins, no basis change happens.\n\nWith rows of right sides 8 and 12, pivot column entries 2 and 2, and an upper bound of 3, the ratios are 4 and 6, so the step is 3, set by the bound, and the basis stays the same.\n\nCheck: after a step of 3 the rows keep $8 - 2(3) = 2$ and $12 - 2(3) = 6$, both still positive.\n\n> **Watch out.** Include the bound of the entering variable among the candidates; the ratios alone may allow a step past it.",
          "有上界时，进基变量可能因新的原因停下：它达到自己的界。所以步长是通常的比值和这个界中最小的，如果界最小，基就不变。\n\n两行右端为 8 和 12，主元列元素为 2 和 2，上界为 3，比值是 4 和 6，所以步长是 3，由界决定，基不变。\n\n检验：步长为 3 后，两行剩下 $8 - 2(3) = 2$ 和 $12 - 2(3) = 6$，都仍为正。\n\n> **注意。** 要把进基变量的界也列为候选；只看比值，步长可能越过这个界。",
        ],
        (rng) => {
          const [p1, p2] = [rng.int(1, 6), rng.int(1, 6)];
          const [r1, r2] = [p1 * rng.int(2, 15), p2 * rng.int(2, 15)];
          const u = rng.int(2, 15);
          const step = Math.min(r1 / p1, r2 / p2, u);
          return solved(
            [
              `An entering variable has upper bound ${u}. Two rows have right sides ${r1} and ${r2}, with pivot column entries ${p1} and ${p2}. How far can the variable increase?`,
              `进基变量的上界是 ${u}。两行的右端是 ${r1} 和 ${r2}，主元列元素是 ${p1} 和 ${p2}。这个变量能增加多少？`,
            ],
            step,
            [
              [
                Math.max(r1 / p1, r2 / p2, u),
                "That is the largest limit; the variable must stop at the first one it meets.",
                "这是最大的限制；变量必须在遇到的第一个限制处停下。",
              ],
              [Math.min(r1 / p1, r2 / p2), `That ignores the upper bound ${u} of the entering variable.`, `这忽略了进基变量的上界 ${u}。`],
              [u, "That is the bound, but a row reaches zero before it.", "这是界，但有一行在此之前就降到零了。"],
              [
                Math.min(r1, r2),
                "That uses a right side without dividing by its pivot column entry.",
                "这用了右端，却没有除以主元列元素。",
              ],
              [r1 + r2, "That adds the right sides; each row limits the step separately.", "这把右端相加了；每一行各自限制步长。"],
            ],
            [
              [
                ["Compute the ratios", "计算比值"],
                [
                  `The ratios are $\\frac{${r1}}{${p1}} = ${r1 / p1}$ and $\\frac{${r2}}{${p2}} = ${r2 / p2}$.`,
                  `比值是 $\\frac{${r1}}{${p1}} = ${r1 / p1}$ 和 $\\frac{${r2}}{${p2}} = ${r2 / p2}$。`,
                ],
              ],
              [
                ["Compare with the bound", "与界比较"],
                [
                  `Take the smallest of ${r1 / p1}, ${r2 / p2} and the bound ${u}, which is ${step}.`,
                  `取 ${r1 / p1}、${r2 / p2} 和界 ${u} 中最小的，即 ${step}。`,
                ],
              ],
            ],
            [
              `After a step of ${step} the rows keep ${r1 - p1 * step} and ${r2 - p2 * step}, both at least 0, and the variable is at most its bound ${u}.`,
              `步长为 ${step} 后，两行剩下 ${r1 - p1 * step} 和 ${r2 - p2 * step}，都不小于 0，变量也不超过界 ${u}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "If $2 \\le x \\le 6$, substitute $x = 2 + x'$, so that $0 \\le x' \\le 4$. The row $x + y \\le 10$ becomes $x' + y \\le 8$, and the bound on $x'$ is handled in the ratio test instead of by a row of its own.",
    "若 $2 \\le x \\le 6$，令 $x = 2 + x'$，于是 $0 \\le x' \\le 4$。行 $x + y \\le 10$ 变为 $x' + y \\le 8$，$x'$ 的界在比值检验中处理，而不另设一行。",
  ],
  ["At $x' = 0$ the variable $x$ is 2, and $2 + 8 = 10$.", "$x' = 0$ 时 $x$ 等于 2，而 $2 + 8 = 10$。"],
  ["shift lower bounds, reflect upper bounds, and use a bound in the ratio test.", "平移下界，反射上界，并在比值检验中使用界。"],
);

const complexity = lesson(
  topic(
    "the-complexity-of-linear-programming",
    ["The Complexity of Linear Programming", "线性规划的复杂度"],
    [
      "See the worst case of the simplex method, and the central path of interior point methods.",
      "了解单纯形法的最坏情形，以及内点法的中心路径。",
    ],
    ["the-simplex-tableau", "polyhedra-and-extreme-points"],
    [],
    [
      point(
        "the-klee-minty-cube",
        ["The Klee-Minty cube", "克利-明蒂立方体"],
        [
          "The Klee-Minty example squashes a cube so that Dantzig's rule visits every corner, which takes $2^{n} - 1$ pivots in $n$ variables. In practice, though, the simplex method usually needs only a modest multiple of the number of rows.\n\nIn 3 variables the squashed cube has $2^{3} = 8$ corners, and Dantzig's rule moves from the first to the last through all of them, taking $8 - 1 = 7$ pivots.\n\nCheck: each pivot moves to a new corner, and after 7 pivots all 8 corners have been visited.\n\n> **Watch out.** This is the worst case; typical programs take far fewer pivots than corners.",
          "克利-明蒂例子把立方体压扁，使丹齐格规则访问每个角点，在 $n$ 个变量中需要 $2^{n} - 1$ 次主元运算。但实际上，单纯形法通常只需要行数的不大的倍数。\n\n3 个变量时，压扁的立方体有 $2^{3} = 8$ 个角点，丹齐格规则从第一个走到最后一个，经过所有角点，需要 $8 - 1 = 7$ 次主元运算。\n\n检验：每次主元运算移到一个新角点，7 次后 8 个角点都访问过了。\n\n> **注意。** 这是最坏情形；一般的规划所需的主元运算远少于角点数。",
        ],
        (rng) => {
          const n = rng.int(3, 30);
          return solved(
            [
              `On the Klee-Minty cube in ${n} variables, how many pivots does Dantzig's rule take?`,
              `在 ${n} 个变量的克利-明蒂立方体上，丹齐格规则需要多少次主元运算？`,
            ],
            2 ** n - 1,
            [
              [
                2 ** n,
                "That counts the corners; the start needs no pivot, so the pivots are one fewer.",
                "这是角点数；起点不需要主元运算，所以次数少一。",
              ],
              [n, "That is the number of variables; the path visits every corner.", "这是变量个数；路径访问每个角点。"],
              [
                2 * n,
                "That is the number of constraints of the cube; the path visits every corner.",
                "这是立方体的约束个数；路径访问每个角点。",
              ],
              [2 ** (n - 1), "That visits only half of the corners.", "这只访问了一半的角点。"],
            ],
            [
              [
                ["Count the corners", "数角点"],
                [
                  `The cube in ${n} variables has $2^{${n}} = ${2 ** n}$ corners, and the path visits them all.`,
                  `${n} 个变量的立方体有 $2^{${n}} = ${2 ** n}$ 个角点，路径全部访问。`,
                ],
              ],
              [
                ["Count the pivots", "数主元运算"],
                [
                  `It visits all $2^{${n}}$ corners, and the number of pivots is one fewer: $${2 ** n} - 1 = ${2 ** n - 1}$.`,
                  `它访问全部 $2^{${n}}$ 个角点，主元运算的次数少一：$${2 ** n} - 1 = ${2 ** n - 1}$。`,
                ],
              ],
            ],
            [
              "In 2 variables the squashed square has 4 corners and the path takes 3 pivots, which matches $2^{2} - 1 = 3$.",
              "2 个变量时，压扁的正方形有 4 个角点，路径需要 3 次主元运算，与 $2^{2} - 1 = 3$ 相符。",
            ],
          );
        },
      ),
      point(
        "a-point-on-the-central-path",
        ["A point on the central path", "中心路径上的点"],
        [
          "Interior point methods add a barrier $-\\mu \\ln x$ that keeps variables positive. Minimizing $cx - \\mu \\ln x$ gives $x = \\frac{\\mu}{c}$, so as $\\mu$ shrinks, the point follows a smooth central path to the optimum.\n\nWith $c = 4$ and $\\mu = \\frac{1}{2}$, the minimizer is $x = \\frac{1}{2} \\div 4 = \\frac{1}{8}$.\n\nCheck: the derivative $4 - \\frac{\\mu}{x}$ at $x = \\frac{1}{8}$ is $4 - \\frac{1}{2} \\div \\frac{1}{8} = 4 - 4 = 0$.\n\n> **Watch out.** The minimizer is $\\mu$ divided by $c$, not $\\mu$ times $c$.",
          "内点法加入障碍项 $-\\mu \\ln x$，使变量保持为正。最小化 $cx - \\mu \\ln x$ 得 $x = \\frac{\\mu}{c}$，所以随着 $\\mu$ 减小，这个点沿光滑的中心路径到达最优解。\n\n$c = 4$，$\\mu = \\frac{1}{2}$ 时，最小点是 $x = \\frac{1}{2} \\div 4 = \\frac{1}{8}$。\n\n检验：导数 $4 - \\frac{\\mu}{x}$ 在 $x = \\frac{1}{8}$ 处是 $4 - \\frac{1}{2} \\div \\frac{1}{8} = 4 - 4 = 0$。\n\n> **注意。** 最小点是 $\\mu$ 除以 $c$，而不是 $\\mu$ 乘 $c$。",
        ],
        (rng) => {
          const c = rng.int(2, 25);
          const a = rng.int(1, 12);
          const b = rng.int(2, 40);
          const mu = Q.of(a, b).toLatex();
          const x = Q.of(a, b * c);
          return solved(
            [
              `With $\\mu = ${Q.of(a, b).toLatex()}$, what value of $x > 0$ minimizes $${c}x - \\mu \\ln x$?`,
              `当 $\\mu = ${Q.of(a, b).toLatex()}$ 时，什么 $x > 0$ 使 $${c}x - \\mu \\ln x$ 最小？`,
            ],
            x,
            [
              [
                Q.of(a * c, b),
                `That multiplies $\\mu$ by ${c}; setting the derivative to zero divides by ${c}.`,
                `这是 $\\mu$ 乘 ${c}；令导数为零应除以 ${c}。`,
              ],
              [Q.of(c * b, a), "That is the reciprocal of the minimizer.", "这是最小点的倒数。"],
              [Q.of(a, b), `That is $\\mu$ itself; it must still be divided by ${c}.`, `这是 $\\mu$ 本身；还要除以 ${c}。`],
            ],
            [
              [
                ["Differentiate", "求导"],
                [
                  `The derivative of $${c}x - \\mu \\ln x$ is $${c} - \\frac{\\mu}{x}$.`,
                  `$${c}x - \\mu \\ln x$ 的导数是 $${c} - \\frac{\\mu}{x}$。`,
                ],
              ],
              [
                ["Set it to zero", "令其为零"],
                [
                  `Setting the derivative $${c} - \\frac{\\mu}{x}$ to zero gives $x = \\frac{\\mu}{${c}} = ${mu} \\div ${c} = ${x.toLatex()}$.`,
                  `令导数 $${c} - \\frac{\\mu}{x}$ 等于零，得 $x = \\frac{\\mu}{${c}} = ${mu} \\div ${c} = ${x.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $x = ${x.toLatex()}$ the derivative is $${c} - ${mu} \\div ${x.toLatex()} = ${c} - ${c} = 0$, and it is negative to the left and positive to the right.`,
              `在 $x = ${x.toLatex()}$ 处导数是 $${c} - ${mu} \\div ${x.toLatex()} = ${c} - ${c} = 0$，左边为负，右边为正。`,
            ],
          );
        },
      ),
      point(
        "the-duality-gap-on-the-path",
        ["The duality gap on the path", "路径上的对偶间隙"],
        [
          "On the central path, each product of a primal variable and its dual slack equals $\\mu$. So the duality gap is $n\\mu$ with $n$ variables, and this tells us how small $\\mu$ must be for a required accuracy.\n\nWith 10 variables and $\\mu = \\frac{1}{100}$, the gap is $10 \\times \\frac{1}{100} = \\frac{1}{10}$.\n\nCheck: the 10 products each equal $\\frac{1}{100}$, and they add up to $\\frac{10}{100} = \\frac{1}{10}$.\n\n> **Watch out.** The gap grows with the number of variables: for a gap of $\\varepsilon$, $\\mu$ must be $\\frac{\\varepsilon}{n}$.",
          "在中心路径上，每个原始变量与其对偶松弛的乘积等于 $\\mu$。所以 $n$ 个变量时对偶间隙是 $n\\mu$，这告诉我们达到所需精度时 $\\mu$ 必须多小。\n\n有 10 个变量，$\\mu = \\frac{1}{100}$ 时，间隙是 $10 \\times \\frac{1}{100} = \\frac{1}{10}$。\n\n检验：10 个乘积都等于 $\\frac{1}{100}$，加起来是 $\\frac{10}{100} = \\frac{1}{10}$。\n\n> **注意。** 间隙随变量个数增大：要使间隙为 $\\varepsilon$，$\\mu$ 必须是 $\\frac{\\varepsilon}{n}$。",
        ],
        (rng) => {
          const n = rng.int(3, 200);
          const a = rng.int(1, 9);
          const b = rng.pick([10, 100, 1000, 20, 50]);
          const mu = Q.of(a, b).toLatex();
          const gap = Q.of(n * a, b);
          return solved(
            [
              `A program has ${n} variables, and an iterate on the central path has $\\mu = ${Q.of(a, b).toLatex()}$. What is the duality gap?`,
              `规划有 ${n} 个变量，中心路径上的迭代点 $\\mu = ${Q.of(a, b).toLatex()}$。对偶间隙是多少？`,
            ],
            gap,
            [
              [Q.of(a, b), `That is $\\mu$, the share of one variable; there are ${n}.`, `这是 $\\mu$，只是一个变量的份额；共有 ${n} 个。`],
              [Q.of(a, n * b), `That divides by ${n} instead of multiplying.`, `这是除以 ${n}，而不是乘。`],
              [
                Q.of(2 * n * a, b),
                "That doubles the gap; each of the products equals $\\mu$ once.",
                "这把间隙加倍了；每个乘积只等于一个 $\\mu$。",
              ],
            ],
            [
              [
                ["Use the path condition", "用路径条件"],
                [
                  `On the central path each of the ${n} products of a variable and its dual slack equals $\\mu = ${mu}$.`,
                  `在中心路径上，${n} 个变量与其对偶松弛的乘积都等于 $\\mu = ${mu}$。`,
                ],
              ],
              [
                ["Add the products", "把乘积相加"],
                [
                  `The gap is the number of variables times $\\mu$: $${n} \\times ${mu} = ${gap.toLatex()}$.`,
                  `间隙是变量个数乘 $\\mu$：$${n} \\times ${mu} = ${gap.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Dividing the gap $${gap.toLatex()}$ by the ${n} variables gives back $\\mu = ${mu}$.`,
              `把间隙 $${gap.toLatex()}$ 除以 ${n} 个变量，又得到 $\\mu = ${mu}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "On the Klee-Minty cube in 3 variables, Dantzig's rule visits all 8 corners and takes 7 pivots. An interior point method instead follows the central path: minimizing $2x - \\mu \\ln x$ gives $x = \\frac{\\mu}{2}$, which moves toward 0 as $\\mu$ shrinks.",
    "在 3 个变量的克利-明蒂立方体上，丹齐格规则访问全部 8 个角点，需要 7 次主元运算。内点法则沿中心路径前进：最小化 $2x - \\mu \\ln x$ 得 $x = \\frac{\\mu}{2}$，随着 $\\mu$ 减小趋向 0。",
  ],
  [
    "$2^{3} - 1 = 7$, and at $x = \\frac{\\mu}{2}$ the derivative $2 - \\frac{\\mu}{x}$ is $2 - 2 = 0$.",
    "$2^{3} - 1 = 7$，在 $x = \\frac{\\mu}{2}$ 处导数 $2 - \\frac{\\mu}{x}$ 等于 $2 - 2 = 0$。",
  ],
  [
    "count the pivots on the Klee-Minty cube, find points on the central path, and measure the duality gap there.",
    "数克利-明蒂立方体上的主元运算次数，求中心路径上的点，并计算那里的对偶间隙。",
  ],
);

const modeling = lesson(
  topic(
    "diet-blending-and-multiperiod-models",
    ["Diet, Blending and Multiperiod Models", "配餐、混合和多阶段模型"],
    ["Write constraints for three classic kinds of planning problem.", "为三类经典的计划问题写约束。"],
    ["formulating-linear-programs"],
    [],
    [
      point(
        "checking-a-diet",
        ["Checking a diet", "检查配餐"],
        [
          "A diet model chooses amounts of foods at the lowest cost, with one lower bound for each nutrient. The amount of a nutrient supplied by a plan is the sum of each food's content times the quantity used.\n\nIf food A has 10 units of protein and food B has 4, a plan with 3 of A and 5 of B supplies $10(3) + 4(5) = 50$ units. With 45 needed, the surplus is $50 - 45 = 5$.\n\nCheck: $45 + 5 = 50$, the amount supplied.\n\n> **Watch out.** Multiply each food's content by the quantity used before adding.",
          "配餐模型以最低成本选择食物的数量，每种营养素有一个下界。计划提供的营养素的量是每种食物的含量乘使用量之和。\n\n若食物 A 含 10 单位蛋白质，食物 B 含 4 单位，用 3 份 A 和 5 份 B 的计划提供 $10(3) + 4(5) = 50$ 单位。需要 45 单位时，盈余是 $50 - 45 = 5$。\n\n检验：$45 + 5 = 50$，正是提供的量。\n\n> **注意。** 先把每种食物的含量乘使用量，再相加。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 30), rng.int(2, 30)];
          const [x, y] = [rng.int(1, 15), rng.int(1, 15)];
          const need = a * x + b * y + rng.int(-20, 20);
          const supply = a * x + b * y;
          const answer = supply - need;
          return solved(
            [
              `Food A has ${a} units of protein and food B has ${b}. A plan uses ${x} of A and ${y} of B, and at least ${need} units are needed. What is the surplus, with a shortfall counted as negative?`,
              `食物 A 含 ${a} 单位蛋白质，食物 B 含 ${b} 单位。计划使用 ${x} 份 A 和 ${y} 份 B，至少需要 ${need} 单位。盈余是多少（不足记为负）？`,
            ],
            answer,
            [
              [supply + need, "That adds the requirement; the surplus subtracts it.", "这是加上需求；盈余要减去它。"],
              [a + b - need, "That uses one unit of each food instead of the planned amounts.", "这是每种食物各用一份，而不是计划的用量。"],
              [supply, "That is the supply; the requirement still has to be subtracted.", "这是供给量；还要减去需求。"],
            ],
            [
              [
                ["Find the supply", "求供给量"],
                [`The plan supplies $${a}(${x}) + ${b}(${y}) = ${supply}$ units.`, `计划提供 $${a}(${x}) + ${b}(${y}) = ${supply}$ 单位。`],
              ],
              [
                ["Subtract the requirement", "减去需求"],
                [`The surplus is $${supply} ${plus(-need)} = ${answer}$.`, `盈余是 $${supply} ${plus(-need)} = ${answer}$。`],
              ],
            ],
            [
              `Adding the surplus to the requirement gives $${need} ${plus(answer)} = ${supply}$, the supply.`,
              `把盈余加到需求上得 $${need} ${plus(answer)} = ${supply}$，正是供给量。`,
            ],
          );
        },
      ),
      point(
        "linearizing-a-blend-requirement",
        ["Linearizing a blend requirement", "把混合要求线性化"],
        [
          "A ratio such as $\\frac{ax + by}{x + y} \\ge r$ looks nonlinear, but multiplying by $x + y$ gives $(a - r)x + (b - r)y \\ge 0$. So percentage requirements for a blend still fit a linear program.\n\nFor ingredients 30 and 60 percent pure and a blend at least 40 percent pure, $30x + 60y \\ge 40(x + y)$ becomes $-10x + 20y \\ge 0$.\n\nCheck: with $x = 2$ and $y = 1$ the blend is $\\frac{60 + 60}{3} = 40$ percent pure, and $-10(2) + 20(1) = 0$.\n\n> **Watch out.** Multiplying by $x + y$ keeps the direction of the inequality only because $x + y$ is positive.",
          "像 $\\frac{ax + by}{x + y} \\ge r$ 这样的比值看起来是非线性的，但乘 $x + y$ 得 $(a - r)x + (b - r)y \\ge 0$。所以混合的百分比要求仍然适合线性规划。\n\n两种原料纯度为百分之 30 和百分之 60，混合物纯度至少百分之 40 时，$30x + 60y \\ge 40(x + y)$ 变为 $-10x + 20y \\ge 0$。\n\n检验：$x = 2$，$y = 1$ 时混合物纯度是 $\\frac{60 + 60}{3} = 40$，而 $-10(2) + 20(1) = 0$。\n\n> **注意。** 乘 $x + y$ 不改变不等号方向，只是因为 $x + y$ 为正。",
        ],
        (rng) => {
          const a = rng.int(5, 90);
          const b = rng.int(5, 90);
          const r = rng.int(5, 90);
          const first = rng.bool();
          const own = first ? a : b;
          const [name, v] = first ? ["p", "x"] : ["q", "y"];
          return solved(
            [
              `Two ingredients have purity ${a} and ${b} percent, and a blend of amounts $x$ and $y$ of them must be at least ${r} percent pure. Written linearly as $px + qy \\ge 0$, what is ${first ? "$p$" : "$q$"}?`,
              `两种原料的纯度是百分之 ${a} 和百分之 ${b}，用量分别为 $x$ 和 $y$ 的混合物纯度至少要达到百分之 ${r}。写成线性形式 $px + qy \\ge 0$ 时，${first ? "$p$" : "$q$"} 是多少？`,
            ],
            own - r,
            [
              [
                r - own,
                "That subtracts the wrong way; the coefficient is the purity minus the requirement.",
                "减反了；系数是纯度减去要求。",
              ],
              [
                own,
                `That leaves out the requirement; multiplying by $x + y$ moves $${r}${v}$ to the left.`,
                `这漏掉了要求；乘 $x + y$ 后要把 $${r}${v}$ 移到左边。`,
              ],
              [own + r, "That adds the requirement instead of subtracting it.", "这是加上要求，而不是减去。"],
            ],
            [
              [
                ["Clear the fraction", "去分母"],
                [`Multiplying by $x + y$ gives $${a}x + ${b}y \\ge ${r}(x + y)$.`, `乘 $x + y$ 得 $${a}x + ${b}y \\ge ${r}(x + y)$。`],
              ],
              [
                ["Collect the terms", "合并同类项"],
                [
                  `Each coefficient is that ingredient's purity minus the required ${r}, so $${name} = ${own} - ${r} = ${own - r}$.`,
                  `每个系数是该原料的纯度减去要求的 ${r}，所以 $${name} = ${own} - ${r} = ${own - r}$。`,
                ],
              ],
            ],
            [
              `A blend of that ingredient alone is ${own} percent pure, and $${name} = ${own - r}$ is at least 0 exactly when ${own} is at least ${r}.`,
              `只用这种原料的混合物纯度是百分之 ${own}，而 $${name} = ${own - r}$ 不小于 0 恰好当 ${own} 不小于 ${r}。`,
            ],
          );
        },
      ),
      point(
        "inventory-balance",
        ["Inventory balance", "库存平衡"],
        [
          "A multiperiod plan links its periods with a balance equation: inventory at the end equals inventory at the start, plus production, minus demand. Holding cost is then charged on these inventory variables.\n\nStarting with 10 units, producing 30 and 40 and meeting demands of 25 and 50, the inventory is $10 + 30 - 25 = 15$ after the first month and $15 + 40 - 50 = 5$ after the second.\n\nCheck: in total, $10 + 70 - 75 = 5$.\n\n> **Watch out.** The inventory at the end of one month is the inventory at the start of the next; do not start each month from zero.",
          "多阶段计划用平衡方程连接各阶段：期末库存等于期初库存加产量减需求。持有成本再按这些库存变量计算。\n\n期初 10 单位，产量为 30 和 40，需求为 25 和 50，第一个月末库存是 $10 + 30 - 25 = 15$，第二个月末是 $15 + 40 - 50 = 5$。\n\n检验：总的来看，$10 + 70 - 75 = 5$。\n\n> **注意。** 一个月的期末库存就是下个月的期初库存；不要每个月都从零开始。",
        ],
        (rng) => {
          const i0 = rng.int(0, 40);
          const p = [rng.int(20, 80), rng.int(20, 80), rng.int(20, 80)];
          const d = [rng.int(10, 60), rng.int(10, 60), rng.int(10, 60)];
          const end = i0 + (p[0] as number) + (p[1] as number) + (p[2] as number) - (d[0] as number) - (d[1] as number) - (d[2] as number);
          const made = (p[0] as number) + (p[1] as number) + (p[2] as number);
          const used = (d[0] as number) + (d[1] as number) + (d[2] as number);
          const i1 = i0 + (p[0] as number) - (d[0] as number);
          const i2 = i1 + (p[1] as number) - (d[1] as number);
          return solved(
            [
              `Starting inventory is ${i0}. Production is ${p.join(", ")} and demand is ${d.join(", ")} in three months. What is the ending inventory, with backorders counted as negative?`,
              `期初库存是 ${i0}。三个月的产量是 ${p.join(", ")}，需求是 ${d.join(", ")}。期末库存是多少（缺货记为负）？`,
            ],
            end,
            [
              [end - i0, "That leaves out the starting inventory.", "这漏掉了期初库存。"],
              [end + (d[2] as number), "That leaves out the demand of the last month.", "这漏掉了最后一个月的需求。"],
              [end - (p[2] as number), "That leaves out the production of the last month.", "这漏掉了最后一个月的产量。"],
              [i0 + made + used, "That adds the demand instead of subtracting it.", "这是加上需求，而不是减去。"],
            ],
            [
              [
                ["Add the totals", "求总量"],
                [`Production totals ${made} and demand totals ${used}.`, `总产量是 ${made}，总需求是 ${used}。`],
              ],
              [
                ["Balance", "平衡"],
                [
                  `Add the starting stock and all production, and then subtract all of the demand: $${i0} + ${made} - ${used} = ${end}$.`,
                  `加上期初库存和全部产量，再减去全部需求：$${i0} + ${made} - ${used} = ${end}$。`,
                ],
              ],
            ],
            [
              `Month by month the inventory is ${i1}, ${i2} and ${end}, ending at the same value.`,
              `逐月计算，库存依次是 ${i1}、${i2} 和 ${end}，结果相同。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A plan using 2 units of a food with 5 grams of protein each supplies 10 grams. A blend at least 40 percent pure, from ingredients 30 and 60 percent pure, needs $-10x + 20y \\ge 0$. And a month starting with 10 units that makes 30 and sells 25 ends with 15.",
    "使用 2 份每份含 5 克蛋白质的食物，提供 10 克。用纯度为百分之 30 和百分之 60 的原料配成纯度至少百分之 40 的混合物，需要 $-10x + 20y \\ge 0$。期初 10 单位、生产 30、售出 25 的月份，期末是 15。",
  ],
  [
    "$5(2) = 10$, $-10(2) + 20(1) = 0$ for the exact blend, and $10 + 30 - 25 = 15$.",
    "$5(2) = 10$；恰好合格的混合 $-10(2) + 20(1) = 0$；$10 + 30 - 25 = 15$。",
  ],
  [
    "check a diet against its requirement, write a blend requirement linearly, and balance inventory across periods.",
    "检查配餐是否满足要求，把混合要求写成线性形式，并在各阶段之间平衡库存。",
  ],
);

const linearizing = lesson(
  topic(
    "linearizing-absolute-values-and-minimax",
    ["Linearizing Absolute Values and Minimax", "绝对值和极小极大的线性化"],
    ["Rewrite absolute values and largest-of objectives using extra variables.", "用额外变量改写绝对值和最大值目标。"],
    ["formulating-linear-programs"],
    [],
    [
      point(
        "splitting-an-absolute-value",
        ["Splitting an absolute value", "拆分绝对值"],
        [
          "Write a free variable as $x = u - v$ with $u, v \\ge 0$, so that $|x|$ becomes $u + v$ in a minimization. At an optimum, at most one of the two parts is positive, because otherwise both could shrink.\n\nFor $x = -4$, the optimum has $u = 0$ and $v = 4$. The split $u = 1$, $v = 5$ also gives $x = -4$, but its $u + v = 6$ is larger.\n\nCheck: $0 - 4 = -4$ and $0 + 4 = 4 = |-4|$.\n\n> **Watch out.** The parts are never negative: a negative $x$ shows up as a positive $v$.",
          "把自由变量写成 $x = u - v$，$u, v \\ge 0$，于是在最小化中 $|x|$ 变成 $u + v$。在最优解处至多一个部分为正，否则两者都可以减小。\n\n对 $x = -4$，最优解是 $u = 0$，$v = 4$。拆成 $u = 1$，$v = 5$ 也给出 $x = -4$，但 $u + v = 6$ 更大。\n\n检验：$0 - 4 = -4$，$0 + 4 = 4 = |-4|$。\n\n> **注意。** 两个部分都不会是负的：负的 $x$ 表现为正的 $v$。",
        ],
        (rng) => {
          const x = rng.int(-60, 60) || 7;
          const first = rng.bool();
          const u = Math.max(x, 0);
          const v = Math.max(-x, 0);
          const answer = first ? u : v;
          const other = first ? v : u;
          const [own, rest] = first ? ["u", "v"] : ["v", "u"];
          return solved(
            [
              `At an optimum, $x = u - v$ with $|x| = u + v$, and $x = ${x}$. What is ${first ? "$u$" : "$v$"}?`,
              `在最优解处，$x = u - v$，$|x| = u + v$，$x = ${x}$。${first ? "$u$" : "$v$"} 是多少？`,
            ],
            answer,
            [
              [
                other,
                answer === 0
                  ? `That is the value of $${rest}$; with $x = ${x}$ the positive part is $${rest}$, and $${own}$ is 0.`
                  : `That is the value of $${rest}$, the other part, which is 0 here.`,
                answer === 0
                  ? `这是 $${rest}$ 的值；$x = ${x}$ 时为正的是 $${rest}$，$${own}$ 等于 0。`
                  : `这是另一部分 $${rest}$ 的值，这里是 0。`,
              ],
              [
                x,
                "That is $x$ itself; the parts are never negative, and only one is positive.",
                "这是 $x$ 本身；两部分都不会是负的，且只有一个为正。",
              ],
              [-x, "Both parts are at least 0, and this one carries the sign the other way.", "两部分都不小于 0，这个值的符号弄反了。"],
              [
                2 * Math.abs(x),
                "That puts $|x|$ into both parts; at an optimum only one part is positive.",
                "这让两个部分都等于 $|x|$；最优解处只有一个部分为正。",
              ],
            ],
            [
              [
                ["Read the sign", "看符号"],
                [
                  `Only one part is positive, and the sign of ${x} tells which one: ${x > 0 ? "$x > 0$, so it is $u$" : "$x < 0$, so it is $v$"}.`,
                  `只有一个部分为正，${x} 的符号决定是哪一个：${x > 0 ? "$x > 0$，所以是 $u$" : "$x < 0$，所以是 $v$"}。`,
                ],
              ],
              [
                ["Write the parts", "写出两部分"],
                [`So $u = ${u}$ and $v = ${v}$.`, `所以 $u = ${u}$，$v = ${v}$。`],
              ],
            ],
            [
              `Then $u - v = ${u} - ${v} = ${x}$ and $u + v = ${u + v} = |${x}|$.`,
              `于是 $u - v = ${u} - ${v} = ${x}$，$u + v = ${u + v} = |${x}|$。`,
            ],
          );
        },
      ),
      point(
        "the-best-fit-to-absolute-deviations",
        ["The best fit to absolute deviations", "绝对偏差的最佳拟合"],
        [
          "Minimizing the sum of $|x - a_i|$ is a linear program, and the optimal $x$ is a median of the data. This is less sensitive to outliers than the mean, which minimizes the sum of squares instead.\n\nFor the data $1, 4, 10$, the median is 4, and the sum of distances is $3 + 0 + 6 = 9$.\n\nCheck: at the mean $x = 5$ the sum is $4 + 1 + 5 = 10$, which is larger.\n\n> **Watch out.** The best $x$ is the median, not the mean; and the question may ask for the smallest sum, not for $x$.",
          "最小化 $|x - a_i|$ 之和是线性规划，最优的 $x$ 是数据的中位数。它比均值对异常值更不敏感，均值是最小化平方和的结果。\n\n对数据 $1, 4, 10$，中位数是 4，距离之和是 $3 + 0 + 6 = 9$。\n\n检验：在均值 $x = 5$ 处，和是 $4 + 1 + 5 = 10$，更大。\n\n> **注意。** 最佳的 $x$ 是中位数而不是均值；而且题目可能问的是最小的和，而不是 $x$。",
        ],
        (rng) => {
          const count = rng.pick([3, 5, 7]);
          const data = rng
            .sample(
              Array.from({ length: 90 }, (_, i) => i + 1),
              count,
            )
            .sort((a, b) => a - b);
          const med = data[(count - 1) / 2] as number;
          const total = data.reduce((sum, v) => sum + Math.abs(v - med), 0);
          const low = data[0] as number;
          return solved(
            [
              `What is the smallest possible value of $\\sum |x - a_i|$ for the data $${data.join(", ")}$?`,
              `对数据 $${data.join(", ")}$，$\\sum |x - a_i|$ 的最小可能值是多少？`,
            ],
            total,
            [
              [
                med,
                "That is the best $x$, the median; the question asks for the sum of the distances.",
                "这是最佳的 $x$，即中位数；题目问的是距离之和。",
              ],
              [
                data.reduce((sum, v) => sum + v, 0),
                "That adds the data; the distances from the median are needed.",
                "这是把数据相加；需要的是到中位数的距离。",
              ],
              [
                data.reduce((sum, v) => sum + v - low, 0),
                `That measures from the smallest value ${low}; measuring from the median gives a smaller sum.`,
                `这是从最小值 ${low} 量起；从中位数量起和更小。`,
              ],
            ],
            [
              [
                ["Find the median", "求中位数"],
                [`The middle of the ${count} sorted values is ${med}.`, `${count} 个排好序的值中间的是 ${med}。`],
              ],
              [
                ["Add the distances", "把距离相加"],
                [
                  `The best $x$ is the median ${med}; the distances from it add up to $${data.map((v) => Math.abs(v - med)).join(" + ")} = ${total}$.`,
                  `最佳的 $x$ 是中位数 ${med}；到它的距离之和是 $${data.map((v) => Math.abs(v - med)).join(" + ")} = ${total}$。`,
                ],
              ],
            ],
            [
              `At $x = ${med + 1}$ the sum is ${total + 1}, one more, since ${(count + 1) / 2} values lie at or below ${med} and only ${(count - 1) / 2} above it.`,
              `在 $x = ${med + 1}$ 处和是 ${total + 1}，多 1，因为有 ${(count + 1) / 2} 个值不大于 ${med}，只有 ${(count - 1) / 2} 个比它大。`,
            ],
          );
        },
      ),
      point(
        "a-minimax-objective",
        ["A minimax objective", "极小极大目标"],
        [
          "To minimize the largest of several linear expressions, add a variable $z$ with $z$ at least each expression, and minimize $z$. At the optimum, $z$ equals the largest of the values, and that expression is tight.\n\nTo minimize the larger of $2x + 1$ and $7 - x$, set them equal: $3x = 6$, so $x = 2$, where both are 5. The smallest value of the larger one is 5.\n\nCheck: at $x = 1$ the larger is $7 - 1 = 6$, and at $x = 3$ it is $2(3) + 1 = 7$, both more than 5.\n\n> **Watch out.** The question asks for the value $z$, not for the $x$ where the lines cross.",
          "要最小化几个线性表达式中最大的一个，增加变量 $z$，使 $z$ 不小于每个表达式，再最小化 $z$。在最优解处，$z$ 等于这些值中最大的，那个表达式取等号。\n\n要最小化 $2x + 1$ 和 $7 - x$ 中较大的，令两者相等：$3x = 6$，$x = 2$，两者都是 5。较大者的最小值是 5。\n\n检验：$x = 1$ 时较大者是 $7 - 1 = 6$，$x = 3$ 时是 $2(3) + 1 = 7$，都大于 5。\n\n> **注意。** 题目问的是值 $z$，而不是两直线相交处的 $x$。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const [c, d] = [rng.int(1, 40), rng.int(41, 90)];
          const x = Q.of(d - c, a + b);
          const z = Q.of(a * (d - c) + c * (a + b), a + b);
          return solved(
            [
              `Minimize the larger of $${a}x + ${c}$ and $${d} - ${b}x$ over all $x$. What is the smallest value?`,
              `对所有 $x$ 最小化 $${a}x + ${c}$ 和 $${d} - ${b}x$ 中较大的。最小值是多少？`,
            ],
            z,
            [
              [x, "That is where the lines cross; the question asks for the value there.", "这是两直线相交的位置；题目问的是那里的值。"],
              [
                Q.of(c + d, 2),
                "That averages the constants; the slopes decide where the lines meet.",
                "这是常数的平均；两直线在哪里相交由斜率决定。",
              ],
              [
                d,
                `At $x = 0$ the larger value is ${d}, but moving $x$ toward the crossing lowers it.`,
                `在 $x = 0$ 处较大的值是 ${d}，但把 $x$ 移向交点会使它变小。`,
              ],
            ],
            [
              [
                ["Set them equal", "令两者相等"],
                [
                  `The lines cross where $${a}x + ${c} = ${d} - ${b}x$, so $${a + b}x = ${d - c}$ and $x = ${x.toLatex()}$.`,
                  `两直线在 $${a}x + ${c} = ${d} - ${b}x$ 处相交，所以 $${a + b}x = ${d - c}$，$x = ${x.toLatex()}$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `The value there is $${a}\\left(${x.toLatex()}\\right) + ${c} = ${z.toLatex()}$, and it is the answer.`,
                  `那里的值是 $${a}\\left(${x.toLatex()}\\right) + ${c} = ${z.toLatex()}$，这就是答案。`,
                ],
              ],
            ],
            [
              `The second expression gives the same value, $${d} - ${b}\\left(${x.toLatex()}\\right) = ${z.toLatex()}$, and away from the crossing one of the two is larger.`,
              `第二个表达式给出相同的值 $${d} - ${b}\\left(${x.toLatex()}\\right) = ${z.toLatex()}$，离开交点后两者中总有一个更大。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "In a minimization, $|x|$ with $x = -3$ becomes $u + v$ with $u = 0$ and $v = 3$. And the larger of $x + 1$ and $5 - x$ is smallest where the two meet, at $x = 2$, where both are 3.",
    "在最小化中，$x = -3$ 时 $|x|$ 变为 $u + v$，$u = 0$，$v = 3$。而 $x + 1$ 和 $5 - x$ 中较大者在两者相等处最小，即 $x = 2$，两者都是 3。",
  ],
  ["$0 - 3 = -3$ and $0 + 3 = 3$, and $2 + 1 = 5 - 2 = 3$.", "$0 - 3 = -3$，$0 + 3 = 3$，且 $2 + 1 = 5 - 2 = 3$。"],
  [
    "split absolute values into two parts, fit data by absolute deviations, and minimize the largest of several expressions.",
    "把绝对值拆成两部分，按绝对偏差拟合数据，并最小化几个表达式中最大的一个。",
  ],
);

const piecewise = lesson(
  topic(
    "piecewise-linear-objectives",
    ["Piecewise Linear Objectives", "分段线性目标"],
    [
      "Model rising costs with one variable per segment, and see why falling costs need integers.",
      "每段用一个变量为上升的成本建模，并了解下降的成本为什么需要整数。",
    ],
    ["linearizing-absolute-values-and-minimax"],
    [],
    [
      point(
        "the-cost-of-a-quantity",
        ["The cost of a quantity", "数量的成本"],
        [
          "Suppose the first units cost one rate and later units cost a higher rate. We give each segment its own variable with a capacity, and the cost of any quantity is the sum over segments of rate times the amount used.\n\nIf the first 10 units cost 3 each and further units cost 5, then 14 units cost $3(10) + 5(4) = 30 + 20 = 50$.\n\nCheck: 50 lies between $3(14) = 42$ and $5(14) = 70$, the costs at either rate alone.\n\n> **Watch out.** The higher rate applies only to the units beyond the first segment.",
          "假设最初几单位按一个费率，后面的单位按更高的费率。给每段一个有容量的变量，任何数量的成本是各段费率乘使用量之和。\n\n若最初 10 单位每单位 3，之后每单位 5，则 14 单位的成本是 $3(10) + 5(4) = 30 + 20 = 50$。\n\n检验：50 在 $3(14) = 42$ 和 $5(14) = 70$ 之间，这是全按一个费率的成本。\n\n> **注意。** 较高的费率只用于第一段之外的单位。",
        ],
        (rng) => {
          const [r1, r2] = [rng.int(2, 9), rng.int(10, 25)];
          const cap = rng.int(10, 60);
          const q = cap + rng.int(1, 40);
          const answer = r1 * cap + r2 * (q - cap);
          return solved(
            [
              `The first ${cap} units cost ${r1} each, and further units cost ${r2} each. What is the cost of ${q} units?`,
              `最初 ${cap} 单位每单位 ${r1}，之后每单位 ${r2}。${q} 单位的成本是多少？`,
            ],
            answer,
            [
              [r1 * q, `That charges every unit at the first rate ${r1}.`, `这把每单位都按第一段的费率 ${r1} 计算。`],
              [r2 * q, `That charges every unit at the second rate ${r2}.`, `这把每单位都按第二段的费率 ${r2} 计算。`],
              [
                r1 * cap + r2 * q,
                `That charges the second rate on all ${q} units, on top of the first ${cap}.`,
                `这在前 ${cap} 单位之外，又对全部 ${q} 单位按第二段费率计价。`,
              ],
            ],
            [
              [
                ["Split the quantity", "拆分数量"],
                [
                  `The ${q} units are ${cap} in the first segment and ${q - cap} in the second.`,
                  `${q} 单位中 ${cap} 单位在第一段，${q - cap} 单位在第二段。`,
                ],
              ],
              [
                ["Price each segment", "按段计价"],
                [
                  `Compute $${r1}(${cap}) + ${r2}(${q - cap}) = ${r1 * cap} + ${r2 * (q - cap)} = ${answer}$, using the two segments in order.`,
                  `按顺序用两段计算 $${r1}(${cap}) + ${r2}(${q - cap}) = ${r1 * cap} + ${r2 * (q - cap)} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The cost ${answer} lies between $${r1}(${q}) = ${r1 * q}$ and $${r2}(${q}) = ${r2 * q}$, the costs at either rate alone.`,
              `成本 ${answer} 在 $${r1}(${q}) = ${r1 * q}$ 和 $${r2}(${q}) = ${r2 * q}$ 之间，这是全按一个费率的成本。`,
            ],
          );
        },
      ),
      point(
        "the-optimal-production-level",
        ["The optimal production level", "最优的生产水平"],
        [
          "With rising unit cost and a fixed selling price, profit is concave. So it is best to produce through every segment whose rate is below the price, and to stop at the first segment whose rate is above it.\n\nWith unit costs 3, 8 and 12, capacities 10, 20 and 5, and a price of 10, the first two segments earn $10 - 3 = 7$ and $10 - 8 = 2$ per unit, so make $10 + 20 = 30$ units.\n\nCheck: a unit of the third segment would cost 12 and sell for 10, a loss of 2.\n\n> **Watch out.** Compare each segment's own rate with the price; a profitable early segment does not pay for a loss-making later one.",
          "单位成本上升而售价固定时，利润是凹函数。所以最好生产完费率低于售价的每一段，并在第一个费率高于售价的段停下。\n\n单位成本为 3、8、12，容量为 10、20、5，售价为 10 时，前两段每单位分别赚 $10 - 3 = 7$ 和 $10 - 8 = 2$，所以生产 $10 + 20 = 30$ 单位。\n\n检验：第三段的一单位成本 12、售价 10，亏 2。\n\n> **注意。** 要用每段自己的费率与售价比较；前面有利润的段不能弥补后面亏损的段。",
        ],
        (rng) => {
          const rates = [rng.int(2, 6), rng.int(7, 11), rng.int(12, 16), rng.int(17, 22)];
          const caps = [rng.int(5, 30), rng.int(5, 30), rng.int(5, 30), rng.int(5, 30)];
          const price = rng.int(5, 23);
          let q = 0;
          for (let i = 0; i < 4; i++) if ((rates[i] as number) < price) q += caps[i] as number;
          const used = rates.filter((r) => r < price).length;
          const all = caps.reduce((a, b) => a + b, 0);
          const next = used < 4 ? { rate: rates[used] as number, cap: caps[used] as number } : undefined;
          const misses: Miss[] = [
            [
              all,
              `That makes every segment, including those that cost at least ${price} per unit.`,
              `这把每段都生产了，包括单位成本不低于 ${price} 的段。`,
            ],
            [used, "That counts the profitable segments, not their capacities.", "这数的是有利润的段数，不是它们的容量。"],
          ];
          if (next)
            misses.push([
              q + next.cap,
              `That also makes the next segment, whose cost ${next.rate} is at least the price ${price}.`,
              `这还生产了下一段，而它的成本 ${next.rate} 不低于售价 ${price}。`,
            ]);
          if (used > 0)
            misses.push([
              q - (caps[used - 1] as number),
              `That stops one segment early; the segment with cost ${rates[used - 1]} still earns ${price - (rates[used - 1] as number)} per unit.`,
              `这早停了一段；成本为 ${rates[used - 1]} 的段每单位仍赚 ${price - (rates[used - 1] as number)}。`,
            ]);
          return solved(
            [
              `Segments have the unit costs ${rates.join(", ")} and capacities ${caps.join(", ")}, in order. Output sells at ${price} each. How many units should be made, using only profitable segments?`,
              `各段的单位成本依次是 ${rates.join(", ")}，容量依次是 ${caps.join(", ")}。产品每单位售价 ${price}。只用有利润的段，应生产多少单位？`,
            ],
            q,
            misses,
            [
              [
                ["Compare each rate with the price", "把每段费率与售价比较"],
                used === 0
                  ? [`No segment costs less than ${price}.`, `没有一段的成本低于 ${price}。`]
                  : [
                      `The segments with unit costs ${rates.slice(0, used).join(", ")} cost less than ${price}.`,
                      `单位成本为 ${rates.slice(0, used).join("、")} 的段成本低于 ${price}。`,
                    ],
              ],
              [
                ["Add their capacities", "把容量相加"],
                [
                  `Include each segment whose unit cost is below ${price}, and add up their capacities: ${used === 0 ? "nothing is made, so the total is 0" : `$${caps.slice(0, used).join(" + ")} = ${q}$`}.`,
                  `包括单位成本低于 ${price} 的每一段，再把容量相加：${used === 0 ? "什么都不生产，所以总数是 0" : `$${caps.slice(0, used).join(" + ")} = ${q}$`}。`,
                ],
              ],
            ],
            next
              ? [
                  `The first segment left out costs ${next.rate} per unit, at least the price ${price}, so making more would not add profit.`,
                  `第一个未用的段每单位成本 ${next.rate}，不低于售价 ${price}，所以多生产不会增加利润。`,
                ]
              : [
                  `Every segment costs less than ${price}, so all ${all} units are profitable.`,
                  `每一段的成本都低于 ${price}，所以全部 ${all} 单位都有利润。`,
                ],
          );
        },
      ),
      point(
        "convex-or-not",
        ["Convex or not", "是否是凸的"],
        [
          "A minimization fills cheap segments first by itself only if the rates increase, which makes the cost convex. With falling rates, such as volume discounts, it would fill the wrong segment, so integer variables are needed.\n\nWith rates 2 and then 5, a minimization uses the first segment before the second, as the real cost does, so a linear program is enough. With rates 5 and then 2, it would use the cheaper second segment first, which the real cost does not allow.\n\nCheck: in the first case $2 < 5$, so the cheap segment is the one that must come first anyway.\n\n> **Watch out.** Volume discounts make rates fall, and then the plain linear model is wrong.",
          "只有费率递增，使成本是凸函数时，最小化才会自动先填便宜的段。费率下降时，例如批量折扣，它会先填错误的段，所以需要整数变量。\n\n费率先 2 后 5 时，最小化先用第一段再用第二段，与真实成本一致，所以线性规划就够了。费率先 5 后 2 时，它会先用便宜的第二段，而真实成本不允许这样。\n\n检验：第一种情形中 $2 < 5$，便宜的段本来就该先用。\n\n> **注意。** 批量折扣使费率下降，这时普通的线性模型是错的。",
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 30);
          const c = a === b ? a + 1 : b;
          const rising = c > a;
          const lp: [string, string] = ["An ordinary linear program is enough", "普通线性规划就够了"];
          const ip: [string, string] = ["Integer variables are needed", "需要整数变量"];
          return chosen(
            rng,
            [
              `In a minimization, a cost has unit rate ${a} on the first segment and ${c} on the second. How can it be modeled?`,
              `在最小化中，成本第一段的单位费率是 ${a}，第二段是 ${c}。怎样建模？`,
            ],
            rising ? lp : ip,
            [
              rising
                ? [
                    ip,
                    "With rising rates the minimization fills the cheap segment first by itself, so no integer variables are needed.",
                    "费率上升时，最小化会自动先填便宜的段，所以不需要整数变量。",
                  ]
                : [
                    lp,
                    `With the rate falling from ${a} to ${c}, a linear program would fill the cheaper second segment first, which is not allowed.`,
                    `费率从 ${a} 降到 ${c}，线性规划会先填便宜的第二段，这是不允许的。`,
                  ],
              [
                ["It cannot be modeled at all", "它根本不能建模"],
                "A cost made of linear pieces can always be modeled, with integer variables when needed.",
                "由线性段组成的成本总能建模，必要时用整数变量。",
              ],
              [
                ["Only by a quadratic program", "只能用二次规划"],
                "The cost is made of linear pieces, so no quadratic term is involved.",
                "成本由线性段组成，不涉及二次项。",
              ],
            ],
            [
              [
                ["Compare the rates", "比较费率"],
                [
                  `The rate goes from ${a} to ${c}, so it ${rising ? "rises" : "falls"}.`,
                  `费率从 ${a} 变到 ${c}，所以是${rising ? "上升" : "下降"}的。`,
                ],
              ],
              [
                ["Decide", "判断"],
                [
                  `The rates ${rising ? "rise, so the cost is convex and the cheap segment fills first" : "fall, so the cost is not convex and the order must be forced"}.`,
                  `费率${rising ? "上升，所以成本是凸的，便宜的段先填满" : "下降，所以成本不是凸的，必须强制顺序"}。`,
                ],
              ],
            ],
            rising
              ? [
                  `Filling the segment at ${a} before the one at ${c} is exactly what a minimization does, so the model gives the true cost.`,
                  `先填费率 ${a} 的段再填费率 ${c} 的段，正是最小化会做的，所以模型给出真实成本。`,
                ]
              : [
                  `A linear program would use the segment at ${c} before the one at ${a}, which the real cost does not allow.`,
                  `线性规划会先用费率 ${c} 的段再用费率 ${a} 的段，而真实成本不允许这样。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "If the first 10 units cost 2 each and later units cost 5, then 14 units cost $2(10) + 5(4) = 40$. One variable for each segment, with capacities 10 and unlimited, gives this cost in a linear program because the rates rise.",
    "若最初 10 单位每单位 2，之后每单位 5，则 14 单位的成本是 $2(10) + 5(4) = 40$。每段一个变量，容量分别为 10 和无限，由于费率上升，线性规划给出的正是这个成本。",
  ],
  ["40 lies between $2(14) = 28$ and $5(14) = 70$.", "40 在 $2(14) = 28$ 和 $5(14) = 70$ 之间。"],
  [
    "price a quantity on a piecewise cost, choose the best production level, and tell when integer variables are needed.",
    "按分段成本计算数量的成本，选择最佳生产水平，并判断何时需要整数变量。",
  ],
);

const shadow = lesson(
  topic(
    "shadow-prices-in-decisions",
    ["Shadow Prices in Decisions", "决策中的影子价格"],
    ["Use dual values to decide whether to buy more of a resource.", "用对偶值决定是否购买更多资源。"],
    ["right-hand-side-ranging"],
    [],
    [
      point(
        "the-gain-from-more-resource",
        ["The gain from more of a resource", "更多资源的收益"],
        [
          "A shadow price is the dual value of a constraint, and it tells how fast the optimal objective improves per extra unit. The rate holds as long as the change stays within the range where the basis remains optimal.\n\nWith optimal profit 500 and a shadow price of 4, ten more units within the range raise the profit by $4(10) = 40$ to 540.\n\nCheck: the rise 40 divided by the 10 units is 4, the shadow price.\n\n> **Watch out.** The rate holds only within the range; beyond it the basis changes and the shadow price may change too.",
          "影子价格是约束的对偶值，它说明每多一单位，最优目标改善多快。只要变化保持在基仍最优的范围内，这个比率就成立。\n\n最优利润为 500，影子价格为 4，在范围内多 10 单位，利润增加 $4(10) = 40$，变为 540。\n\n检验：增量 40 除以 10 单位得 4，正是影子价格。\n\n> **注意。** 这个比率只在范围内成立；超出范围基会改变，影子价格也可能改变。",
        ],
        (rng) => {
          const y = rng.int(2, 25);
          const z = rng.int(100, 900);
          const d = rng.int(1, 15);
          return solved(
            [
              `The optimal profit is ${z}, a resource has shadow price ${y}, and ${d} more units are added, within the allowed range. What is the new profit?`,
              `最优利润是 ${z}，某资源的影子价格是 ${y}，在允许范围内增加 ${d} 单位。新的利润是多少？`,
            ],
            z + y * d,
            [
              [z + y, `That adds the worth of one unit; there are ${d} more units.`, `这只加了一单位的价值；共多了 ${d} 单位。`],
              [z + d, "That adds the units themselves, not their worth.", "这加的是单位数，而不是它们的价值。"],
              [
                z - y * d,
                "That subtracts; more of a resource with a positive shadow price raises the profit.",
                "这是减；影子价格为正的资源增多会使利润增加。",
              ],
            ],
            [
              [
                ["Find the rise", "求增量"],
                [
                  `The profit rises by $${y}(${d}) = ${y * d}$, because the change is within the range.`,
                  `利润增加 $${y}(${d}) = ${y * d}$，因为变化在范围内。`,
                ],
              ],
              [
                ["Add it", "加上增量"],
                [`The new profit is $${z} + ${y * d} = ${z + y * d}$.`, `新的利润是 $${z} + ${y * d} = ${z + y * d}$。`],
              ],
            ],
            [
              `The rise ${y * d} divided by the ${d} units is ${y}, the shadow price.`,
              `增量 ${y * d} 除以 ${d} 单位得 ${y}，正是影子价格。`,
            ],
          );
        },
      ),
      point(
        "whether-to-buy",
        ["Whether to buy", "是否购买"],
        [
          "Extra capacity is worth buying only when its market price is below the shadow price. The net gain per unit is then the difference, while a resource with slack has shadow price zero and is not worth buying at any positive price.\n\nWith a shadow price of 8 for up to 10 more units and a market price of 5, buying all 10 gains $8 - 5 = 3$ on each, $3(10) = 30$ in all. At a market price of 9, buying would lose 1 per unit, so buy nothing.\n\nCheck: the 10 units add $8(10) = 80$ to the profit and cost $5(10) = 50$, and $80 - 50 = 30$.\n\n> **Watch out.** Compare the market price with the shadow price, not with the profit of a product.",
          "只有市场价低于影子价格时，额外的产能才值得购买。这时每单位的净收益是两者之差，而有松弛的资源影子价格为零，任何正价格都不值得买。\n\n影子价格为 8（最多再增加 10 单位），市场价为 5 时，买下全部 10 单位，每单位赚 $8 - 5 = 3$，共 $3(10) = 30$。市场价为 9 时，买一单位亏 1，所以不买。\n\n检验：10 单位使利润增加 $8(10) = 80$，成本是 $5(10) = 50$，而 $80 - 50 = 30$。\n\n> **注意。** 要把市场价与影子价格比较，而不是与某产品的利润比较。",
        ],
        (rng) => {
          const y = rng.int(3, 30);
          const price = rng.int(1, 4) === 1 ? y + rng.int(0, 6) : rng.int(1, y - 1);
          const d = rng.int(2, 20);
          const net = Math.max(y - price, 0) * d;
          return solved(
            [
              `A resource has shadow price ${y} for up to ${d} more units, and the market price is ${price} per unit. What is the largest net gain from buying?`,
              `某资源在再增加 ${d} 单位内的影子价格是 ${y}，市场价是每单位 ${price}。购买的最大净收益是多少？`,
            ],
            net,
            [
              [y * d, "That ignores the market price paid for each unit.", "这忽略了每单位要付的市场价。"],
              [
                Math.abs(y - price) * d,
                "That counts a loss as a gain; buying above the shadow price loses money.",
                "这把亏损当成了收益；高于影子价格购买会亏钱。",
              ],
              y > price
                ? [y - price, `That is the gain on one unit; there are ${d} units.`, `这是一单位的收益；共有 ${d} 单位。`]
                : [y - price, "That is the loss on one unit; buying nothing gives 0 instead.", "这是一单位的亏损；不买则收益为 0。"],
              [price * d, "That is the cost of the units, not the gain from them.", "这是购买的成本，而不是收益。"],
            ],
            [
              [
                ["Compare the prices", "比较价格"],
                y > price
                  ? [
                      `The market price ${price} is below the shadow price ${y}, so buying pays.`,
                      `市场价 ${price} 低于影子价格 ${y}，所以购买划算。`,
                    ]
                  : [`The market price ${price} is at least the shadow price ${y}.`, `市场价 ${price} 不低于影子价格 ${y}。`],
              ],
              [
                ["Find the gain", "求收益"],
                y > price
                  ? [
                      `Buying all ${d} units gains $${y} - ${price} = ${y - price}$ on each of them, $${y - price}(${d}) = ${net}$ in all.`,
                      `买下全部 ${d} 单位，每单位收益 $${y} - ${price} = ${y - price}$，共 $${y - price}(${d}) = ${net}$。`,
                    ]
                  : [
                      "The price is at least the shadow price, so the best choice is to buy nothing, for a gain of 0.",
                      "价格不低于影子价格，所以最好的选择是不买，收益为 0。",
                    ],
              ],
            ],
            y > price
              ? [
                  `The ${d} units add $${y}(${d}) = ${y * d}$ to the profit and cost $${price}(${d}) = ${price * d}$, and $${y * d} - ${price * d} = ${net}$.`,
                  `${d} 单位使利润增加 $${y}(${d}) = ${y * d}$，成本是 $${price}(${d}) = ${price * d}$，而 $${y * d} - ${price * d} = ${net}$。`,
                ]
              : [
                  `Buying one unit would add ${y} and cost ${price}, a change of ${y - price}, so buying nothing is best.`,
                  `买一单位会增加 ${y}、花费 ${price}，变化为 ${y - price}，所以不买最好。`,
                ],
          );
        },
      ),
      point(
        "the-objective-from-dual-values",
        ["The objective from dual values", "由对偶值得目标值"],
        [
          "By strong duality, the optimal value equals the sum of each right side times its shadow price. So every unit of profit can be attributed to the resources that are actually in short supply.\n\nWith right sides 10 and 20 and shadow prices 3 and 0, the optimal value is $10(3) + 20(0) = 30$; the second resource has slack and earns nothing.\n\nCheck: by strong duality the primal optimum is also 30.\n\n> **Watch out.** Multiply each right side by its own shadow price; do not add the right sides or the prices alone.",
          "由强对偶性，最优值等于每个右端乘其影子价格之和。所以每单位利润都可以归因于实际短缺的资源。\n\n右端为 10 和 20，影子价格为 3 和 0 时，最优值是 $10(3) + 20(0) = 30$；第二种资源有松弛，没有贡献。\n\n检验：由强对偶性，原始最优值也是 30。\n\n> **注意。** 要把每个右端乘它自己的影子价格；不要只把右端或价格相加。",
        ],
        (rng) => {
          const b = [rng.int(5, 60), rng.int(5, 60), rng.int(5, 60)] as [number, number, number];
          const y = [rng.int(1, 12), 0, rng.int(1, 12)] as [number, number, number];
          const value = b[0] * y[0] + b[2] * y[2];
          return solved(
            [
              `Three constraints have right sides ${b.join(", ")} and shadow prices ${y.join(", ")}. What is the optimal value?`,
              `三个约束的右端是 ${b.join(", ")}，影子价格是 ${y.join(", ")}。最优值是多少？`,
            ],
            value,
            [
              [b[0] + b[1] + b[2], "That adds the right sides without their shadow prices.", "这是把右端相加，没有乘影子价格。"],
              [y[0] + y[2], "That adds the shadow prices without the right sides.", "这是把影子价格相加，没有乘右端。"],
              [
                value + b[1],
                "That counts the second right side, whose shadow price is 0.",
                "这把第二个右端也算进去了，而它的影子价格是 0。",
              ],
            ],
            [
              [
                ["Multiply each pair", "逐对相乘"],
                [
                  `The products are $${b[0]}(${y[0]}) = ${b[0] * y[0]}$, $${b[1]}(0) = 0$ and $${b[2]}(${y[2]}) = ${b[2] * y[2]}$.`,
                  `乘积是 $${b[0]}(${y[0]}) = ${b[0] * y[0]}$、$${b[1]}(0) = 0$ 和 $${b[2]}(${y[2]}) = ${b[2] * y[2]}$。`,
                ],
              ],
              [
                ["Add them", "相加"],
                [
                  `Compute $${b[0] * y[0]} + 0 + ${b[2] * y[2]} = ${value}$; the slack constraint contributes nothing.`,
                  `计算 $${b[0] * y[0]} + 0 + ${b[2] * y[2]} = ${value}$；有松弛的约束没有贡献。`,
                ],
              ],
            ],
            [
              `By strong duality this dual value ${value} is also the optimal value of the primal program.`,
              `由强对偶性，这个对偶值 ${value} 也是原始规划的最优值。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "If a constraint has shadow price 6, five more units of its resource raise the optimal profit by $6(5) = 30$, as long as the basis stays optimal. Buying them at 4 each would then gain $30 - 20 = 10$.",
    "若某约束的影子价格是 6，在基保持最优时，该资源多 5 单位使最优利润增加 $6(5) = 30$。以每单位 4 买入，净赚 $30 - 20 = 10$。",
  ],
  ["$\\frac{30}{5} = 6$, the shadow price, and $4(5) = 20$ is the cost.", "$\\frac{30}{5} = 6$ 正是影子价格，$4(5) = 20$ 是成本。"],
  [
    "use shadow prices to find the gain from more of a resource, decide whether to buy it, and rebuild the optimal value from dual values.",
    "用影子价格求更多资源的收益，决定是否购买，并由对偶值重新得到最优值。",
  ],
);

const objectiveRanging = lesson(
  topic(
    "objective-coefficient-ranging",
    ["Objective Coefficient Ranging", "目标系数的灵敏度范围"],
    ["Find how far a profit can change before the optimal plan changes.", "求利润能变化多少而最优计划不变。"],
    ["sensitivity-analysis"],
    [],
    [
      point(
        "the-range-at-a-corner",
        ["The range at a corner", "角点处的范围"],
        [
          "A corner stays optimal while the objective's slope lies between the slopes of the two tight constraints. So for a corner of $x + y \\le S$ and $kx + y \\le T$, the plan holds while $c_1$ is between $c_2$ and $kc_2$.\n\nFor a corner of $x + y \\le 8$ and $3x + y \\le 12$ with objective $c_1 x + 2y$, the ratio $\\frac{c_1}{2}$ must lie between 1 and 3, so $c_1$ runs from 2 to 6.\n\nCheck: at $c_1 = 6$ the objective $6x + 2y = 2(3x + y)$ is parallel to the second constraint.\n\n> **Watch out.** The ends of the range are $c_2$ times the slopes, not the slopes themselves.",
          "只要目标函数的斜率在两个紧约束的斜率之间，角点就保持最优。所以对 $x + y \\le S$ 和 $kx + y \\le T$ 的角点，只要 $c_1$ 在 $c_2$ 和 $kc_2$ 之间，计划就不变。\n\n对 $x + y \\le 8$ 和 $3x + y \\le 12$ 的角点，目标为 $c_1 x + 2y$，比值 $\\frac{c_1}{2}$ 必须在 1 和 3 之间，所以 $c_1$ 从 2 到 6。\n\n检验：$c_1 = 6$ 时目标 $6x + 2y = 2(3x + y)$ 与第二个约束平行。\n\n> **注意。** 范围的端点是 $c_2$ 乘斜率，而不是斜率本身。",
        ],
        (rng) => {
          const k = rng.int(2, 9);
          const c2 = rng.int(2, 25);
          const top = rng.bool();
          return solved(
            [
              `A corner of $x + y \\le S$ and $${k}x + y \\le T$ is optimal for the objective $c_1 x + ${c2}y$. What is the ${top ? "largest" : "smallest"} value of $c_1$ that keeps it optimal?`,
              `$x + y \\le S$ 和 $${k}x + y \\le T$ 的角点对目标 $c_1 x + ${c2}y$ 最优。使它保持最优的 $c_1$ 的${top ? "最大" : "最小"}值是多少？`,
            ],
            top ? k * c2 : c2,
            top
              ? [
                  [c2, "That is the smallest value of the range, not the largest.", "这是范围的最小值，而不是最大值。"],
                  [k + c2, `That adds the slope ${k} to ${c2}; the slope multiplies it.`, `这是把斜率 ${k} 加到 ${c2} 上；应该相乘。`],
                  [k, `That is the slope itself; $c_1$ is ${c2} times it.`, `这是斜率本身；$c_1$ 是它的 ${c2} 倍。`],
                ]
              : [
                  [k * c2, "That is the largest value of the range, not the smallest.", "这是范围的最大值，而不是最小值。"],
                  [
                    Q.of(c2, k),
                    `That divides by ${k}; the lower end is ${c2} times the slope 1.`,
                    `这是除以 ${k}；下端是 ${c2} 乘斜率 1。`,
                  ],
                  [1, `That is the slope itself; $c_1$ is ${c2} times it.`, `这是斜率本身；$c_1$ 是它的 ${c2} 倍。`],
                ],
            [
              [
                ["Read the slopes", "读出斜率"],
                [
                  `The tight constraints $x + y$ and $${k}x + y$ have the ratios 1 and ${k} of their $x$ and $y$ coefficients.`,
                  `紧约束 $x + y$ 和 $${k}x + y$ 中 $x$ 与 $y$ 系数的比分别是 1 和 ${k}。`,
                ],
              ],
              [
                ["Bound the coefficient", "确定系数的范围"],
                [
                  `The ratio $\\frac{c_1}{${c2}}$ must lie between the constraint slopes 1 and ${k}, so $c_1$ runs from ${c2} to ${k * c2}.`,
                  `比值 $\\frac{c_1}{${c2}}$ 必须在约束斜率 1 和 ${k} 之间，所以 $c_1$ 从 ${c2} 到 ${k * c2}。`,
                ],
              ],
            ],
            top
              ? [
                  `At $c_1 = ${k * c2}$ the objective $${k * c2}x + ${c2}y = ${c2}(${k}x + y)$ is parallel to the second constraint, so the whole edge ties.`,
                  `$c_1 = ${k * c2}$ 时目标 $${k * c2}x + ${c2}y = ${c2}(${k}x + y)$ 与第二个约束平行，整条边上目标值相同。`,
                ]
              : [
                  `At $c_1 = ${c2}$ the objective $${c2}x + ${c2}y = ${c2}(x + y)$ is parallel to the first constraint, so the whole edge ties.`,
                  `$c_1 = ${c2}$ 时目标 $${c2}x + ${c2}y = ${c2}(x + y)$ 与第一个约束平行，整条边上目标值相同。`,
                ],
          );
        },
      ),
      point(
        "a-nonbasic-coefficient",
        ["A nonbasic coefficient", "非基变量的系数"],
        [
          "A product not in the optimal plan stays out until its profit rises by the size of its reduced cost. At that point it becomes attractive to bring in, so that reduced cost measures how far the profit falls short.\n\nA product with profit 12 and a shortfall of 5 first becomes worth making at a profit of $12 + 5 = 17$.\n\nCheck: $17 - 12 = 5$, the shortfall made up.\n\n> **Watch out.** Below that profit the product stays out, however close it is.",
          "不在最优计划中的产品，要等利润上升到其检验数的大小才进入。到那时才值得引入，所以这个检验数衡量利润差多少。\n\n利润为 12、差额为 5 的产品，利润达到 $12 + 5 = 17$ 时才开始值得生产。\n\n检验：$17 - 12 = 5$，差额正好补上。\n\n> **注意。** 利润低于这个值时，无论差得多少，产品都不进入。",
        ],
        (rng) => {
          const c = rng.int(2, 40);
          const r = rng.int(1, 20);
          return solved(
            [
              `A product not made in the optimal plan has profit ${c} and reduced cost ${r}, in the amount it falls short. At what profit does it first become worth making?`,
              `最优计划中不生产的产品利润是 ${c}，检验数是 ${r}（表示差额）。利润达到多少时它才开始值得生产？`,
            ],
            c + r,
            [
              [c, `That is the present profit; it must first rise by ${r}.`, `这是现在的利润；它还要先上升 ${r}。`],
              [r, `That is the shortfall alone; add it to the present profit ${c}.`, `这只是差额；要把它加到现在的利润 ${c} 上。`],
              [c - r, "That lowers the profit; it has to rise to close the shortfall.", "这是降低利润；要补上差额，利润必须上升。"],
            ],
            [
              [
                ["Read the shortfall", "读出差额"],
                [`The reduced cost says the profit falls short by ${r}.`, `检验数说明利润差 ${r}。`],
              ],
              [
                ["Raise the profit", "提高利润"],
                [
                  `Its profit needs to rise by ${r}, starting from ${c}, to $${c} + ${r} = ${c + r}$.`,
                  `它的利润需要从 ${c} 上升 ${r}，达到 $${c} + ${r} = ${c + r}$。`,
                ],
              ],
            ],
            [
              `At a profit of ${c + r} the shortfall is $${c + r} - ${c} - ${r} = 0$, so the product just pays for the resources it would use.`,
              `利润为 ${c + r} 时差额为 $${c + r} - ${c} - ${r} = 0$，产品恰好抵得上它所用资源的价值。`,
            ],
          );
        },
      ),
      point(
        "the-value-after-a-change",
        ["The value after a change", "变化后的值"],
        [
          "Within the allowed range the plan stays the same, so only the value of the objective changes. A change of a coefficient changes the objective by that change times the quantity of the product in the plan.\n\nWith optimal value 300 and 20 units of a product in the plan, a rise of 2 in its profit raises the value by $2(20) = 40$ to 340.\n\nCheck: the rise 40 divided by the 20 units is 2.\n\n> **Watch out.** The plan does not change, but its value does: every unit made earns the new profit.",
          "在允许范围内计划不变，所以只有目标值变化。系数的变化使目标值改变这个变化量乘计划中产品的数量。\n\n最优值为 300，计划中有某产品 20 单位，它的利润上升 2，最优值增加 $2(20) = 40$，变为 340。\n\n检验：增量 40 除以 20 单位得 2。\n\n> **注意。** 计划不变，但它的值会变：生产的每一单位都按新利润计算。",
        ],
        (rng) => {
          const x = rng.int(2, 40);
          const d = rng.int(1, 9);
          const z = rng.int(100, 900);
          const up = rng.bool();
          const answer = up ? z + d * x : z - d * x;
          return solved(
            [
              `The optimal value is ${z}, with ${x} units of a product in the plan. Its profit ${up ? "rises" : "falls"} by ${d}, within the range. What is the new optimal value?`,
              `最优值是 ${z}，计划中有某产品 ${x} 单位。它的利润${up ? "上升" : "下降"} ${d}，在范围内。新的最优值是多少？`,
            ],
            answer,
            [
              [
                up ? z + d : z - d,
                `That changes the value by ${d} once; each of the ${x} units changes.`,
                `这只让值改变了一次 ${d}；${x} 单位中每单位都变。`,
              ],
              [up ? z - d * x : z + d * x, "That moves the value the wrong way.", "这让值朝相反的方向变了。"],
              [
                z,
                "That leaves the value unchanged; the plan stays the same, but its value changes.",
                "这让值不变；计划不变，但它的值会变。",
              ],
            ],
            [
              [
                ["Find the change", "求变化量"],
                [`The plan is unchanged, so the value moves by $${d}(${x}) = ${d * x}$.`, `计划不变，所以值改变 $${d}(${x}) = ${d * x}$。`],
              ],
              [
                ["Apply it", "代入"],
                [
                  `The new value is $${z} ${up ? "+" : "-"} ${d * x} = ${answer}$.`,
                  `新的值是 $${z} ${up ? "+" : "-"} ${d * x} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The change ${d * x} divided by the ${x} units is ${d}, the change in profit per unit.`,
              `变化量 ${d * x} 除以 ${x} 单位得 ${d}，正是每单位利润的变化。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A corner of $x + y \\le 8$ and $2x + y \\le 12$ is optimal for $c_1 x + 3y$ while $c_1$ lies between 3 and 6. Within that range the plan stays put, and only the optimal value moves with $c_1$.",
    "$x + y \\le 8$ 和 $2x + y \\le 12$ 的角点在 $c_1$ 介于 3 和 6 之间时对 $c_1 x + 3y$ 最优。在这个范围内计划不变，只有最优值随 $c_1$ 变化。",
  ],
  [
    "at $c_1 = 6$ the objective $6x + 3y = 3(2x + y)$ is parallel to the second constraint.",
    "$c_1 = 6$ 时目标 $6x + 3y = 3(2x + y)$ 与第二个约束平行。",
  ],
  [
    "find the range of a coefficient at a corner, the profit at which a product enters, and the value after a change.",
    "求角点处系数的范围、产品开始进入时的利润，以及变化后的值。",
  ],
);

/** scaled writes k times a value as k(v), leaving out a factor of one. */
const scaled = (k: number, v: number | string) => (k === 1 ? `${v}` : `${k}(${v})`);

const addRow = lesson(
  topic(
    "adding-a-variable-or-a-constraint",
    ["Adding a Variable or a Constraint", "增加变量或约束"],
    ["Re-solve efficiently after a new product or a new requirement appears.", "在出现新产品或新要求后高效地重新求解。"],
    ["sensitivity-analysis", "the-dual-simplex-method"],
    [],
    [
      point(
        "pricing-a-new-product",
        ["Pricing a new product", "为新产品定价"],
        [
          "A new variable should enter when its profit exceeds the value of the resources it uses, at their shadow prices. So we compute its reduced cost from the dual values, and we need no fresh solve when it is not attractive.\n\nWith shadow prices 2 and 3, a new product using 4 and 1 units is worth $2(4) + 3(1) = 11$ in resources. If it earns 15, the difference is $15 - 11 = 4 > 0$, so it should enter.\n\nCheck: $11 + 4 = 15$, the profit.\n\n> **Watch out.** A positive difference means the product is worth adding in a maximization; a negative one means the current plan stays optimal.",
          "当新变量的利润超过它所用资源按影子价格计算的价值时，它应该进入。所以用对偶值计算它的检验数，不值得引入时无需重新求解。\n\n影子价格为 2 和 3，新产品使用 4 和 1 单位资源，资源价值是 $2(4) + 3(1) = 11$。若它赚 15，差是 $15 - 11 = 4 > 0$，所以应该进入。\n\n检验：$11 + 4 = 15$，正是利润。\n\n> **注意。** 在最大化中，差为正说明值得加入新产品；为负说明当前计划仍然最优。",
        ],
        (rng) => {
          const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
          const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
          const c = rng.int(5, 80);
          const worth = y1 * a1 + y2 * a2;
          const answer = c - worth;
          return solved(
            [
              `Shadow prices are ${y1} and ${y2}. A new product uses ${a1} and ${a2} units of the resources and earns ${c}. What is its profit minus the value of the resources it uses?`,
              `影子价格是 ${y1} 和 ${y2}。新产品使用这些资源 ${a1} 和 ${a2} 单位，赚 ${c}。它的利润减去所用资源的价值是多少？`,
            ],
            answer,
            [
              [c + worth, "That adds the worth of the resources; it is subtracted from the profit.", "这是加上资源价值；应从利润中减去。"],
              [worth, `That is the worth of the resources alone; subtract it from ${c}.`, `这只是资源价值；还要从 ${c} 中减去它。`],
              [c - y1 - y2, "That subtracts the prices without multiplying by the amounts used.", "这减去了价格，却没有乘使用量。"],
            ],
            [
              [
                ["Value the resources", "计算资源价值"],
                [
                  `Resources are worth $${scaled(y1, a1)} + ${scaled(y2, a2)} = ${worth}$.`,
                  `资源价值 $${scaled(y1, a1)} + ${scaled(y2, a2)} = ${worth}$。`,
                ],
              ],
              [
                ["Subtract from the profit", "从利润中减去"],
                [`That is subtracted from ${c}: $${c} - ${worth} = ${answer}$.`, `从 ${c} 中减去：$${c} - ${worth} = ${answer}$。`],
              ],
            ],
            [
              `Adding the worth back gives $${worth} ${plus(answer)} = ${c}$, the profit, so the product is ${answer > 0 ? "worth bringing in" : "not worth bringing in"}.`,
              `把资源价值加回去得 $${worth} ${plus(answer)} = ${c}$，正是利润，所以这个产品${answer > 0 ? "值得引入" : "不值得引入"}。`,
            ],
          );
        },
      ),
      point(
        "whether-a-new-constraint-matters",
        ["Whether a new constraint matters", "新约束是否起作用"],
        [
          "If the current optimum already satisfies a new constraint, then it is still optimal and nothing needs to be done. Otherwise, the new row makes the basis primal infeasible, and the dual simplex method repairs it.\n\nAt the optimum $(2, 3)$, the new constraint $3x + y \\le 10$ gives $3(2) + 3 = 9 \\le 10$, so the optimum is unchanged. The constraint $3x + y \\le 8$ would be broken, since $9 > 8$, and the dual simplex method would repair the plan.\n\nCheck: $3(2) + 3 = 6 + 3 = 9$.\n\n> **Watch out.** Test the current point, not the region: a new constraint that cuts off other points still leaves the old optimum if it holds there.",
          "如果当前最优解已经满足新约束，它仍然最优，什么都不用做。否则新的行使基原始不可行，由对偶单纯形法修复。\n\n在最优解 $(2, 3)$ 处，新约束 $3x + y \\le 10$ 给出 $3(2) + 3 = 9 \\le 10$，所以最优解不变。约束 $3x + y \\le 8$ 会被违反，因为 $9 > 8$，这时要用对偶单纯形法修复。\n\n检验：$3(2) + 3 = 6 + 3 = 9$。\n\n> **注意。** 要检验当前点，而不是整个区域：新约束即使切掉别的点，只要在旧最优解处成立，旧最优解就仍然最优。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const [x, y] = [rng.int(1, 20), rng.int(1, 20)];
          const r = a * x + b * y + rng.int(-15, 15);
          const ok = a * x + b * y <= r;
          const lhs = a * x + b * y;
          const still: [string, string] = ["The optimum is unchanged", "最优解不变"];
          const repair: [string, string] = ["The dual simplex method must repair it", "必须用对偶单纯形法修复"];
          return chosen(
            rng,
            [
              `The current optimum is $(${x}, ${y})$, and we add the constraint $${a}x + ${b}y \\le ${r}$. What happens?`,
              `当前最优解是 $(${x}, ${y})$，增加约束 $${a}x + ${b}y \\le ${r}$。会发生什么？`,
            ],
            ok ? still : repair,
            [
              ok
                ? [
                    repair,
                    `The current point gives ${lhs}, at most ${r}, so it already satisfies the new constraint and stays optimal.`,
                    `当前点给出 ${lhs}，不超过 ${r}，所以已经满足新约束，仍然最优。`,
                  ]
                : [
                    still,
                    `The current point gives ${lhs}, above ${r}, so it breaks the new constraint.`,
                    `当前点给出 ${lhs}，超过 ${r}，所以违反了新约束。`,
                  ],
              [
                ["The program becomes unbounded", "规划变得无界"],
                "Adding a constraint can only shrink the region, so it cannot make the program unbounded.",
                "增加约束只会缩小区域，所以不会使规划无界。",
              ],
              [
                ["The dual becomes infeasible", "对偶变得不可行"],
                "A new row leaves the reduced costs as they are, so the dual stays feasible; only the primal side can break.",
                "新的行不改变检验数，所以对偶仍可行；只有原始一侧可能被破坏。",
              ],
            ],
            [
              [
                ["Evaluate the left side", "计算左端"],
                [
                  `At $(${x}, ${y})$ the left side is $${a}(${x}) + ${b}(${y}) = ${lhs}$.`,
                  `在 $(${x}, ${y})$ 处左端是 $${a}(${x}) + ${b}(${y}) = ${lhs}$。`,
                ],
              ],
              [
                ["Compare with the limit", "与限制比较"],
                [
                  `At this point the left side is ${lhs}, which is ${ok ? "within" : "above"} the limit ${r}.`,
                  `在这一点左端是 ${lhs}，${ok ? "未超过" : "超过了"}限制 ${r}。`,
                ],
              ],
            ],
            ok
              ? [
                  "The old optimum is feasible for the new, smaller region, and nothing in that region can beat it.",
                  "旧的最优解在新的、更小的区域中可行，而这个区域中没有更好的点。",
                ]
              : [
                  `The slack of the new row would be $${r} - ${lhs} = ${r - lhs}$, which is negative, so the basis is primal infeasible.`,
                  `新行的松弛变量是 $${r} - ${lhs} = ${r - lhs}$，为负，所以基原始不可行。`,
                ],
          );
        },
      ),
      point(
        "the-new-slack-value",
        ["The new slack value", "新的松弛值"],
        [
          "When a constraint is added, its slack becomes a new basic variable, with the value of the right side minus the left side at the current point. A negative value signals which row the dual simplex method should pivot on.\n\nAt the optimum $(2, 3)$, adding $3x + y + s = 12$ gives $s = 12 - 9 = 3$. Adding $3x + y + s = 7$ would give $s = 7 - 9 = -2$, a row for the dual simplex method.\n\nCheck: $9 + 3 = 12$ and $9 - 2 = 7$.\n\n> **Watch out.** The slack is the right side minus the left side; a negative slack means the new constraint is broken.",
          "增加约束时，它的松弛变量成为新的基本变量，值是右端减去当前点处的左端。负值表明对偶单纯形法应在哪一行进行主元运算。\n\n在最优解 $(2, 3)$ 处，增加 $3x + y + s = 12$ 得 $s = 12 - 9 = 3$。增加 $3x + y + s = 7$ 则得 $s = 7 - 9 = -2$，这一行要用对偶单纯形法处理。\n\n检验：$9 + 3 = 12$，$9 - 2 = 7$。\n\n> **注意。** 松弛值是右端减左端；松弛值为负说明新约束被违反。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const [x, y] = [rng.int(1, 20), rng.int(1, 20)];
          const r = rng.int(5, 200);
          const lhs = a * x + b * y;
          const s = r - lhs;
          return solved(
            [
              `At the optimum $(${x}, ${y})$, add $${a}x + ${b}y + s = ${r}$. What is the initial value of the slack $s$?`,
              `在最优解 $(${x}, ${y})$ 处，增加 $${a}x + ${b}y + s = ${r}$。松弛变量 $s$ 的初值是多少？`,
            ],
            s,
            [
              [lhs - r, "That subtracts the wrong way; the slack is the right side minus the left side.", "减反了；松弛值是右端减左端。"],
              [r, "That is the right side; the left side at the point must be subtracted.", "这是右端；还要减去该点处的左端。"],
              [r - x - y, `That leaves out the coefficients ${a} and ${b}.`, `这漏掉了系数 ${a} 和 ${b}。`],
            ],
            [
              [
                ["Evaluate the left side", "计算左端"],
                [`At the point, $${a}(${x}) + ${b}(${y}) = ${lhs}$.`, `在该点处，$${a}(${x}) + ${b}(${y}) = ${lhs}$。`],
              ],
              [
                ["Solve for the slack", "解出松弛值"],
                [
                  `Put the point into the new constraint and solve for $s$: $s = ${r} - ${lhs} = ${s}$.`,
                  `把这一点代入新约束，解出 $s$：$s = ${r} - ${lhs} = ${s}$。`,
                ],
              ],
            ],
            [
              `Then $${lhs} ${plus(s)} = ${r}$, so the new row holds with this slack${s < 0 ? ", and its negative value marks the row for the dual simplex method" : ""}.`,
              `于是 $${lhs} ${plus(s)} = ${r}$，新行在这个松弛值下成立${s < 0 ? "，而它为负，说明这一行要用对偶单纯形法处理" : ""}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "With shadow prices 2 and 3, a new product using 4 and 1 units of the resources is worth $2(4) + 3(1) = 11$ in resources, so if it earns 15 it should enter. A new constraint $3x + y \\le 10$ at the optimum $(2, 3)$ is already satisfied, since $3(2) + 3 = 9$.",
    "影子价格为 2 和 3，新产品使用 4 和 1 单位资源，资源价值 $2(4) + 3(1) = 11$，所以若它赚 15 就应进入。新约束 $3x + y \\le 10$ 在最优解 $(2, 3)$ 处已经满足，因为 $3(2) + 3 = 9$。",
  ],
  ["$15 - 11 = 4 > 0$, and the new slack is $10 - 9 = 1$.", "$15 - 11 = 4 > 0$，新的松弛值是 $10 - 9 = 1$。"],
  [
    "price a new product with the dual values, decide whether a new constraint matters, and find the slack of a new row.",
    "用对偶值为新产品定价，判断新约束是否起作用，并求新行的松弛值。",
  ],
);

const matrixForm = lesson(
  topic(
    "the-tableau-in-matrix-form",
    ["The Tableau in Matrix Form", "矩阵形式的单纯形表"],
    ["Read every entry of the tableau from the inverse of the basis.", "从基的逆矩阵读出单纯形表的每个元素。"],
    ["the-revised-simplex-method"],
    [],
    [
      point(
        "the-basic-values",
        ["The basic values", "基本变量的值"],
        [
          "With basis matrix $B$, the basic variables take the values $B^{-1}b$. This is the right-hand column of the tableau, and it is the only computation needed to find the current corner point.\n\nWith $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $b = (3, 4)$, the basic values are $2(3) + 4 = 10$ and $3 + 2(4) = 11$.\n\nCheck: the right-hand column of the tableau is $(10, 11)$, one entry for each row of $B^{-1}$.\n\n> **Watch out.** Each basic value is a row of $B^{-1}$ times $b$, entry by entry in the same order.",
          "基矩阵为 $B$ 时，基本变量取值 $B^{-1}b$。这是单纯形表的右端列，也是求当前角点所需的唯一计算。\n\n取 $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$，$b = (3, 4)$，基本变量的值是 $2(3) + 4 = 10$ 和 $3 + 2(4) = 11$。\n\n检验：单纯形表的右端列是 $(10, 11)$，$B^{-1}$ 的每一行对应一个元素。\n\n> **注意。** 每个基本变量的值是 $B^{-1}$ 的一行乘 $b$，按相同的顺序逐项相乘。",
        ],
        (rng) => {
          const [a, c] = [rng.int(1, 6), rng.int(1, 6)];
          const b1 = rng.int(1, 40);
          const b2 = rng.int(1, 40);
          const first = rng.bool();
          const v1 = a * b1 + b2;
          const v2 = c * b1 + 2 * b2;
          return solved(
            [
              `Here $B^{-1} = \\begin{pmatrix} ${a} & 1 \\\\ ${c} & 2 \\end{pmatrix}$ and $b = (${b1}, ${b2})$. What is the ${first ? "first" : "second"} basic value?`,
              `这里 $B^{-1} = \\begin{pmatrix} ${a} & 1 \\\\ ${c} & 2 \\end{pmatrix}$，$b = (${b1}, ${b2})$。第${first ? "一" : "二"}个基本变量的值是多少？`,
            ],
            first ? v1 : v2,
            first
              ? [
                  [
                    v2,
                    "That is the second basic value, from the second row of $B^{-1}$.",
                    "这是第二个基本变量的值，来自 $B^{-1}$ 的第二行。",
                  ],
                  [a * b2 + b1, "That pairs the row with $b$ in the reverse order.", "这把这一行与 $b$ 按相反的顺序配对了。"],
                  [a + b1, "That adds the entries instead of multiplying the row by $b$.", "这是把元素相加，而不是用这一行乘 $b$。"],
                ]
              : [
                  [
                    v1,
                    "That is the first basic value, from the first row of $B^{-1}$.",
                    "这是第一个基本变量的值，来自 $B^{-1}$ 的第一行。",
                  ],
                  [c * b2 + 2 * b1, "That pairs the row with $b$ in the reverse order.", "这把这一行与 $b$ 按相反的顺序配对了。"],
                  [c + b1, "That adds the entries instead of multiplying the row by $b$.", "这是把元素相加，而不是用这一行乘 $b$。"],
                ],
            [
              [
                ["Take the row", "取出这一行"],
                [
                  `The ${first ? "first" : "second"} row of $B^{-1}$ is $(${first ? `${a}, 1` : `${c}, 2`})$.`,
                  `$B^{-1}$ 的第${first ? "一" : "二"}行是 $(${first ? `${a}, 1` : `${c}, 2`})$。`,
                ],
              ],
              [
                ["Multiply by b", "乘以右端向量"],
                [
                  `Multiply the ${first ? "first" : "second"} row of $B^{-1}$ by the vector $b$: $${first ? `${scaled(a, b1)} + ${b2} = ${v1}` : `${scaled(c, b1)} + 2(${b2}) = ${v2}`}$.`,
                  `用 $B^{-1}$ 的第${first ? "一" : "二"}行乘向量 $b$：$${first ? `${scaled(a, b1)} + ${b2} = ${v1}` : `${scaled(c, b1)} + 2(${b2}) = ${v2}`}$。`,
                ],
              ],
            ],
            [
              `The other row gives ${first ? v2 : v1}, so the right-hand column of the tableau is $B^{-1}b = (${v1}, ${v2})$.`,
              `另一行给出 ${first ? v2 : v1}，所以单纯形表的右端列是 $B^{-1}b = (${v1}, ${v2})$。`,
            ],
          );
        },
      ),
      point(
        "the-dual-values-from-the-inverse",
        ["The dual values from the inverse", "由逆矩阵得对偶值"],
        [
          "The simplex multipliers are $y = c_B B^{-1}$, and at the optimum they solve the dual program. They appear in the objective row under the slack columns, so the final tableau shows the dual solution for free.\n\nWith $c_B = (3, 2)$ and $B^{-1} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$, the multipliers are $3(1) + 2(0) = 3$ and $3(2) + 2(1) = 8$, so $y = (3, 8)$.\n\nCheck: the second column of $B^{-1}$ is $(2, 1)$, and $6 + 2 = 8$.\n\n> **Watch out.** The row vector $c_B$ multiplies the columns of $B^{-1}$, not its rows.",
          "单纯形乘子是 $y = c_B B^{-1}$，在最优解处它们解对偶规划。它们出现在目标行中松弛列的下方，所以最终的单纯形表直接给出对偶解。\n\n取 $c_B = (3, 2)$，$B^{-1} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$，乘子是 $3(1) + 2(0) = 3$ 和 $3(2) + 2(1) = 8$，所以 $y = (3, 8)$。\n\n检验：$B^{-1}$ 的第二列是 $(2, 1)$，而 $6 + 2 = 8$。\n\n> **注意。** 行向量 $c_B$ 乘的是 $B^{-1}$ 的列，而不是行。",
        ],
        (rng) => {
          const [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
          const [c1, c2] = [rng.int(1, 12), rng.int(1, 12)];
          const first = rng.bool();
          const y1 = c1 * a + c2 * c;
          const y2 = c1 * b + c2 * d;
          const [top, bottom] = first ? [a, c] : [b, d];
          return solved(
            [
              `With $c_B = (${c1}, ${c2})$ and $B^{-1} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$, what is the ${first ? "first" : "second"} entry of $y = c_B B^{-1}$?`,
              `取 $c_B = (${c1}, ${c2})$，$B^{-1} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$，$y = c_B B^{-1}$ 的第${first ? "一" : "二"}个元素是多少？`,
            ],
            first ? y1 : y2,
            first
              ? [
                  [
                    c1 * a + c2 * b,
                    "That uses the first row of $B^{-1}$; $y$ needs its first column.",
                    "这用了 $B^{-1}$ 的第一行；$y$ 需要它的第一列。",
                  ],
                  [c1 * a, `That leaves out the second term, ${c2} times ${c}.`, `这漏掉了第二项，即 ${c2} 乘 ${c}。`],
                  [c2 * c, `That leaves out the first term, ${c1} times ${a}.`, `这漏掉了第一项，即 ${c1} 乘 ${a}。`],
                ]
              : [
                  [
                    c1 * c + c2 * d,
                    "That uses the second row of $B^{-1}$; $y$ needs its second column.",
                    "这用了 $B^{-1}$ 的第二行；$y$ 需要它的第二列。",
                  ],
                  [c1 * b, `That leaves out the second term, ${c2} times ${d}.`, `这漏掉了第二项，即 ${c2} 乘 ${d}。`],
                  [c2 * d, `That leaves out the first term, ${c1} times ${b}.`, `这漏掉了第一项，即 ${c1} 乘 ${b}。`],
                ],
            [
              [
                ["Take the column", "取出这一列"],
                [
                  `The ${first ? "first" : "second"} column of $B^{-1}$ is $(${top}, ${bottom})$.`,
                  `$B^{-1}$ 的第${first ? "一" : "二"}列是 $(${top}, ${bottom})$。`,
                ],
              ],
              [
                ["Multiply by the costs", "乘以成本向量"],
                [
                  `Multiply the row vector $c_B$ by the ${first ? "first" : "second"} column of $B^{-1}$: $${scaled(c1, top)} + ${scaled(c2, bottom)} = ${first ? y1 : y2}$.`,
                  `用行向量 $c_B$ 乘 $B^{-1}$ 的第${first ? "一" : "二"}列：$${scaled(c1, top)} + ${scaled(c2, bottom)} = ${first ? y1 : y2}$。`,
                ],
              ],
            ],
            [
              `The other column gives ${first ? y2 : y1}, so $y = (${y1}, ${y2})$, the entries under the slack columns of the final tableau.`,
              `另一列给出 ${first ? y2 : y1}，所以 $y = (${y1}, ${y2})$，即最终单纯形表中松弛列下方的元素。`,
            ],
          );
        },
      ),
      point(
        "a-reduced-cost-in-matrix-form",
        ["A reduced cost in matrix form", "矩阵形式的检验数"],
        [
          "A column's reduced cost is $c_j - ya_j$, the profit minus the value of the resources it uses. The current basis is optimal for a maximization when every one of these values is at most zero.\n\nWith $y = (2, 1)$, a column $a_j = (3, 4)$ and $c_j = 12$, the dot product is $2(3) + 4 = 10$, and $c_j - ya_j = 12 - 10 = 2$.\n\nCheck: $10 + 2 = 12$, and the positive value means this column would improve a maximization.\n\n> **Watch out.** Subtract the dot product from $c_j$, not the other way round; the sign decides whether the column enters.",
          "一列的检验数是 $c_j - ya_j$，即利润减去它所用资源的价值。对最大化问题，当所有这些值都不超过零时，当前的基就是最优的。\n\n取 $y = (2, 1)$，列 $a_j = (3, 4)$，$c_j = 12$，点积是 $2(3) + 4 = 10$，$c_j - ya_j = 12 - 10 = 2$。\n\n检验：$10 + 2 = 12$，正值说明这一列能改进最大化。\n\n> **注意。** 是用 $c_j$ 减点积，而不是反过来；符号决定这一列是否进基。",
        ],
        (rng) => {
          const [y1, y2] = [rng.int(0, 9), rng.int(0, 9)];
          const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
          const c = rng.int(1, 60);
          const dot = y1 * a1 + y2 * a2;
          const answer = c - dot;
          return solved(
            [
              `With $y = (${y1}, ${y2})$, a column $a_j = (${a1}, ${a2})$ has $c_j = ${c}$. What is $c_j - ya_j$?`,
              `取 $y = (${y1}, ${y2})$，列 $a_j = (${a1}, ${a2})$ 的 $c_j = ${c}$。$c_j - ya_j$ 是多少？`,
            ],
            answer,
            [
              [c + dot, "That adds the dot product; it is subtracted from $c_j$.", "这是加上点积；应从 $c_j$ 中减去。"],
              [
                dot - c,
                "That subtracts the wrong way; the reduced cost is $c_j$ minus the dot product.",
                "减反了；检验数是 $c_j$ 减点积。",
              ],
              [
                c - y1 - y2,
                "That subtracts the entries of $y$ without multiplying by the column.",
                "这减去了 $y$ 的元素，却没有乘这一列。",
              ],
            ],
            [
              [
                ["Form the dot product", "求点积"],
                [
                  `The dot product is $${scaled(y1, a1)} + ${scaled(y2, a2)} = ${dot}$.`,
                  `点积是 $${scaled(y1, a1)} + ${scaled(y2, a2)} = ${dot}$。`,
                ],
              ],
              [
                ["Subtract it", "相减"],
                [`It is subtracted from ${c}: $${c} - ${dot} = ${answer}$.`, `从 ${c} 中减去：$${c} - ${dot} = ${answer}$。`],
              ],
            ],
            [
              `Adding the dot product back gives $${dot} ${plus(answer)} = ${c}$, and the column ${answer > 0 ? "would improve a maximization" : "would not improve a maximization"}.`,
              `把点积加回去得 $${dot} ${plus(answer)} = ${c}$，这一列${answer > 0 ? "能改进最大化" : "不能改进最大化"}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "With $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $b = (3, 4)$, the basic values are $B^{-1}b = (10, 11)$. With $c_B = (1, 1)$, the multipliers are $y = c_B B^{-1} = (3, 3)$, the column sums of $B^{-1}$.",
    "取 $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$，$b = (3, 4)$，基本变量的值是 $B^{-1}b = (10, 11)$。取 $c_B = (1, 1)$，乘子是 $y = c_B B^{-1} = (3, 3)$，即 $B^{-1}$ 的列和。",
  ],
  [
    "$2(3) + 4 = 10$, $3 + 2(4) = 11$, and each column of $B^{-1}$ adds up to $2 + 1 = 3$.",
    "$2(3) + 4 = 10$，$3 + 2(4) = 11$，$B^{-1}$ 每列之和是 $2 + 1 = 3$。",
  ],
  [
    "compute the basic values, the dual values and a reduced cost from the inverse of the basis.",
    "由基的逆矩阵计算基本变量的值、对偶值和检验数。",
  ],
);

const startingPlans = lesson(
  topic(
    "starting-plans-for-transportation",
    ["Starting Plans for Transportation", "运输问题的初始方案"],
    ["Build a first feasible shipping plan with the northwest corner and Vogel's rules.", "用西北角法和沃格尔法建立第一个可行的运输方案。"],
    ["the-transportation-problem"],
    [],
    [
      point(
        "the-northwest-corner-rule",
        ["The northwest corner rule", "西北角法"],
        [
          "The northwest corner rule starts at the top left and ships as much as possible, moving right when a demand is met and down when a supply runs out. It ignores costs, but it always produces a feasible plan.\n\nWith a first supply of 20 and demands of 12 and then 15, cell $(1, 1)$ ships 12, and the remaining $20 - 12 = 8$ goes to cell $(1, 2)$.\n\nCheck: source 1 ships $12 + 8 = 20$, all of its supply, and destination 2 still needs $15 - 8 = 7$ from the next source.\n\n> **Watch out.** Ship what the source has left, not the whole demand of the next destination.",
          "西北角法从左上角开始，尽量多运，满足一个需求就向右移，一个供应用完就向下移。它不考虑成本，但总能得到可行方案。\n\n第一个供应是 20，需求依次是 12 和 15，单元格 $(1, 1)$ 运 12，剩下的 $20 - 12 = 8$ 运到单元格 $(1, 2)$。\n\n检验：产地 1 运出 $12 + 8 = 20$，正是它的全部供应，销地 2 还需要下一个产地运 $15 - 8 = 7$。\n\n> **注意。** 运的是产地剩下的量，而不是下一个销地的全部需求。",
        ],
        (rng) => {
          const s1 = rng.int(10, 60);
          const d1 = rng.int(5, s1 - 1);
          const d2 = s1 - d1 + rng.int(5, 40);
          return solved(
            [
              `Supplies start with ${s1}, and demands are ${d1} then ${d2}. Under the northwest corner rule, how much does source 1 ship to destination 2?`,
              `第一个供应是 ${s1}，需求依次是 ${d1} 和 ${d2}。按西北角法，产地 1 运到销地 2 多少？`,
            ],
            s1 - d1,
            [
              [d1, "That is the shipment in cell $(1, 1)$, to destination 1.", "这是单元格 $(1, 1)$ 运到销地 1 的量。"],
              [
                d2,
                `That is the whole second demand; source 1 has only ${s1 - d1} left.`,
                `这是第二个销地的全部需求；产地 1 只剩 ${s1 - d1}。`,
              ],
              [
                s1,
                "That is the whole first supply; part of it went to destination 1.",
                "这是第一个产地的全部供应；其中一部分已运到销地 1。",
              ],
            ],
            [
              [
                ["Fill the first cell", "填第一个单元格"],
                [
                  `Cell (1, 1) ships the smaller of ${s1} and ${d1}, which is ${d1}, and destination 1 is done.`,
                  `单元格 (1, 1) 运 ${s1} 和 ${d1} 中较小的 ${d1}，销地 1 满足了。`,
                ],
              ],
              [
                ["Move right", "向右移"],
                [
                  `That leaves $${s1} - ${d1} = ${s1 - d1}$ for the next cell, less than the demand ${d2}, so all of it is shipped.`,
                  `剩下 $${s1} - ${d1} = ${s1 - d1}$ 给下一个单元格，少于需求 ${d2}，所以全部运出。`,
                ],
              ],
            ],
            [
              `Source 1 ships $${d1} + ${s1 - d1} = ${s1}$, all of its supply, and destination 2 still needs $${d2} - ${s1 - d1} = ${d2 - s1 + d1}$ from source 2.`,
              `产地 1 运出 $${d1} + ${s1 - d1} = ${s1}$，正是全部供应，销地 2 还需要产地 2 运 $${d2} - ${s1 - d1} = ${d2 - s1 + d1}$。`,
            ],
          );
        },
      ),
      point(
        "the-number-of-shipping-cells",
        ["The number of shipping cells", "运输单元格的个数"],
        [
          "A balanced plan with $m$ sources and $n$ destinations has $m + n - 1$ basic cells, because one equation among the supply and demand constraints is redundant. A starting rule produces exactly that many cells in a nondegenerate case.\n\nWith 3 sources and 4 destinations there are $3 + 4 = 7$ supply and demand equations, one of them redundant, so a basic plan has $7 - 1 = 6$ cells.\n\nCheck: the northwest corner rule finishes a row or a column at each step and both at its last step, so it fills $7 - 1 = 6$ cells.\n\n> **Watch out.** Only one equation is redundant, so subtract exactly one.",
          "$m$ 个产地和 $n$ 个销地的平衡方案有 $m + n - 1$ 个基本单元格，因为供需约束中有一个方程是多余的。非退化时，初始规则恰好产生这么多单元格。\n\n有 3 个产地和 4 个销地时，供需方程有 $3 + 4 = 7$ 个，其中一个多余，所以基本方案有 $7 - 1 = 6$ 个单元格。\n\n检验：西北角法每一步完成一行或一列，最后一步同时完成两者，所以填 $7 - 1 = 6$ 个单元格。\n\n> **注意。** 只有一个方程是多余的，所以恰好减一。",
        ],
        (rng) => {
          const m = rng.int(2, 15);
          const n = rng.int(2, 15);
          return solved(
            [
              `A balanced transportation problem has ${m} sources and ${n} destinations. How many basic cells does a plan have?`,
              `平衡运输问题有 ${m} 个产地和 ${n} 个销地。方案有多少个基本单元格？`,
            ],
            m + n - 1,
            [
              [
                m * n,
                `That counts every cell; a basic plan uses only ${m + n - 1} of them.`,
                `这数的是全部单元格；基本方案只用其中 ${m + n - 1} 个。`,
              ],
              [m + n, "That forgets that one of the equations is redundant.", "这忘了有一个方程是多余的。"],
              [m + n - 2, "That subtracts two; only one equation is redundant.", "这减了二；只有一个方程是多余的。"],
            ],
            [
              [
                ["Count the equations", "数方程"],
                [`There are $${m} + ${n} = ${m + n}$ supply and demand equations.`, `供需方程有 $${m} + ${n} = ${m + n}$ 个。`],
              ],
              [
                ["Remove the redundant one", "去掉多余的方程"],
                [
                  `One of the ${m + n} equations is redundant, so the count is $${m} + ${n} - 1 = ${m + n - 1}$.`,
                  `${m + n} 个方程中有一个多余，所以个数是 $${m} + ${n} - 1 = ${m + n - 1}$。`,
                ],
              ],
            ],
            [
              `The northwest corner rule finishes a row or a column at each step and both at its last step, so it fills $${m + n} - 1 = ${m + n - 1}$ cells.`,
              `西北角法每一步完成一行或一列，最后一步同时完成两者，所以填 $${m + n} - 1 = ${m + n - 1}$ 个单元格。`,
            ],
          );
        },
      ),
      point(
        "vogels-penalty",
        ["Vogel's penalty", "沃格尔罚数"],
        [
          "Vogel's method looks at each row's two cheapest cells, and their difference is the penalty for missing the best choice. It ships first in the row or column with the largest penalty, so its plans are usually close to optimal.\n\nFor a row with costs $7, 3, 9, 4$, the two cheapest are 3 and 4, so the penalty is $4 - 3 = 1$.\n\nCheck: missing the cell at 3 and using the next cheapest, at 4, costs 1 more per unit.\n\n> **Watch out.** The penalty uses the two smallest costs, not the smallest and the largest.",
          "沃格尔法看每行最便宜的两个单元格，它们的差是错过最佳选择的罚数。它先在罚数最大的行或列运输，所以方案通常接近最优。\n\n一行的成本是 $7, 3, 9, 4$，最便宜的两个是 3 和 4，罚数是 $4 - 3 = 1$。\n\n检验：错过成本为 3 的单元格、改用次便宜的 4，每单位多花 1。\n\n> **注意。** 罚数用的是最小的两个成本，而不是最小和最大的。",
        ],
        (rng) => {
          const costs = rng.sample(
            Array.from({ length: 60 }, (_, i) => i + 1),
            4,
          );
          const sorted = [...costs].sort((a, b) => a - b);
          const [s0, s1, s2, s3] = sorted as [number, number, number, number];
          const p = s1 - s0;
          return solved(
            [
              `A row has the costs $${costs.join(", ")}$. What is its Vogel penalty?`,
              `一行的成本是 $${costs.join(", ")}$。它的沃格尔罚数是多少？`,
            ],
            p,
            [
              [
                s3 - s0,
                "That subtracts the cheapest from the most expensive; the penalty uses the two cheapest.",
                "这是最贵的减最便宜的；罚数用的是最便宜的两个。",
              ],
              [s0, "That is the cheapest cost itself, not a difference.", "这是最便宜的成本本身，而不是差。"],
              [
                s2 - s1,
                "That uses the second and third cheapest; the penalty uses the two cheapest.",
                "这用了第二和第三便宜的；罚数用的是最便宜的两个。",
              ],
            ],
            [
              [
                ["Sort the costs", "排序"],
                [`In order the costs are ${sorted.join(", ")}.`, `按从小到大的顺序，成本是 ${sorted.join("、")}。`],
              ],
              [
                ["Take the difference", "求差"],
                [
                  `The two smallest costs are ${s0} and ${s1}, and the penalty is their difference, $${s1} - ${s0} = ${p}$.`,
                  `最小的两个成本是 ${s0} 和 ${s1}，罚数是它们的差 $${s1} - ${s0} = ${p}$。`,
                ],
              ],
            ],
            [
              `Missing the cheapest cell, at ${s0}, and using the next one, at ${s1}, costs ${p} more per unit, which is the penalty.`,
              `错过最便宜的成本为 ${s0} 的单元格、改用成本为 ${s1} 的下一个，每单位多花 ${p}，这就是罚数。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "With supplies 20 and 15 and demands 12 and 23, the northwest corner rule ships 12 in cell $(1, 1)$, then the remaining 8 in cell $(1, 2)$, then 15 in cell $(2, 2)$.",
    "供应为 20 和 15，需求为 12 和 23 时，西北角法在单元格 $(1, 1)$ 运 12，再在 $(1, 2)$ 运剩下的 8，然后在 $(2, 2)$ 运 15。",
  ],
  [
    "$12 + 8 = 20$, $8 + 15 = 23$, and the plan uses $2 + 2 - 1 = 3$ cells.",
    "$12 + 8 = 20$，$8 + 15 = 23$，方案用了 $2 + 2 - 1 = 3$ 个单元格。",
  ],
  [
    "build a plan with the northwest corner rule, count its basic cells, and compute Vogel's penalties.",
    "用西北角法建立方案，数它的基本单元格，并计算沃格尔罚数。",
  ],
);

const hungarian = lesson(
  topic(
    "the-hungarian-algorithm",
    ["The Hungarian Algorithm", "匈牙利算法"],
    ["Solve an assignment problem by creating zeros in the cost matrix.", "通过在成本矩阵中产生零来解指派问题。"],
    ["the-assignment-problem"],
    [],
    [
      point(
        "reducing-a-row",
        ["Reducing a row", "行化简"],
        [
          "Subtracting a constant from a whole row changes every assignment's cost by the same amount, so the best assignment stays the same. The algorithm subtracts each row's minimum, and then each column's minimum, to create zeros.\n\nThe row $8, 5, 12$ has minimum 5, so it becomes $3, 0, 7$.\n\nCheck: $3 + 5 = 8$, $0 + 5 = 5$ and $7 + 5 = 12$ give back the row.\n\n> **Watch out.** Subtract the row's own minimum, so that every entry stays at least 0 and one becomes 0.",
          "从整行减去一个常数，每个指派的成本改变相同的量，所以最佳指派不变。算法减去每行的最小值，再减去每列的最小值，以产生零。\n\n行 $8, 5, 12$ 的最小值是 5，化简后变成 $3, 0, 7$。\n\n检验：$3 + 5 = 8$，$0 + 5 = 5$，$7 + 5 = 12$，又得到原来的行。\n\n> **注意。** 要减去这一行自己的最小值，使每个元素都不小于 0，且有一个等于 0。",
        ],
        (rng) => {
          const row = rng.sample(
            Array.from({ length: 70 }, (_, i) => i + 5),
            4,
          );
          const m = Math.min(...row);
          const first = rng.int(0, 3);
          const i = row[first] === m ? (first + 1) % 4 : first;
          const entry = row[i] as number;
          return solved(
            [
              `A row of the cost matrix is $${row.join(", ")}$. After row reduction, what does entry ${i + 1} become?`,
              `成本矩阵的一行是 $${row.join(", ")}$。行化简后第 ${i + 1} 个元素变成多少？`,
            ],
            entry - m,
            [
              [entry, "That is the entry before the reduction.", "这是化简前的元素。"],
              [m, "That is the row minimum, which is subtracted.", "这是这一行的最小值，是要减去的数。"],
              [m - entry, "That subtracts the wrong way; reduced entries are never negative.", "减反了；化简后的元素不会是负的。"],
            ],
            [
              [
                ["Find the minimum", "找最小值"],
                [`The smallest entry of the row is ${m}.`, `这一行最小的元素是 ${m}。`],
              ],
              [
                ["Subtract it", "减去它"],
                [
                  `It is subtracted from every entry, so ${entry} becomes $${entry} - ${m} = ${entry - m}$.`,
                  `每个元素都减去它，所以 ${entry} 变成 $${entry} - ${m} = ${entry - m}$。`,
                ],
              ],
            ],
            [
              `Adding the minimum back gives $${entry - m} + ${m} = ${entry}$, and the reduced entry is at least 0, as every reduced entry is.`,
              `把最小值加回去得 $${entry - m} + ${m} = ${entry}$，化简后的元素不小于 0，每个化简后的元素都是这样。`,
            ],
          );
        },
      ),
      point(
        "the-test-for-optimality",
        ["The test for optimality", "最优性检验"],
        [
          "Cover all the zeros using as few lines as possible. By Konig's theorem, a full assignment on zeros exists exactly when the number of lines equals $n$, and otherwise the matrix is adjusted to create more zeros.\n\nIn a 4 by 4 reduced matrix whose zeros can be covered by 3 lines, no assignment uses only zeros, so the matrix is adjusted. If 4 lines are needed, an optimal assignment can be read from the zeros.\n\nCheck: 3 lines can hold at most 3 zeros in different rows and columns, and an assignment needs 4.\n\n> **Watch out.** Count the fewest lines that cover the zeros; a careless cover with extra lines says nothing.",
          "用尽可能少的线覆盖所有的零。由柯尼希定理，在零上存在完全指派，当且仅当线数等于 $n$，否则调整矩阵以产生更多的零。\n\n在 4 乘 4 的化简矩阵中，如果 3 条线就能覆盖所有的零，就没有只用零的指派，所以要调整矩阵。如果需要 4 条线，就可以从零读出最优指派。\n\n检验：3 条线上至多有 3 个不同行不同列的零，而指派需要 4 个。\n\n> **注意。** 要数覆盖所有零的最少线数；随手画的多余的线说明不了什么。",
        ],
        (rng) => {
          const n = rng.int(3, 12);
          const lines = rng.int(1, n);
          const done: [string, string] = ["An optimal assignment can be read from the zeros", "可以从零读出最优指派"];
          const more: [string, string] = ["The matrix must be adjusted to create more zeros", "必须调整矩阵以产生更多的零"];
          return chosen(
            rng,
            [
              `In a ${n} by ${n} reduced matrix, the fewest lines covering all zeros number ${lines}. What should be done next?`,
              `在 ${n} 乘 ${n} 的化简矩阵中，覆盖所有零的最少线数是 ${lines}。下一步应做什么？`,
            ],
            lines === n ? done : more,
            [
              lines === n
                ? [
                    more,
                    `${n} lines are needed, as many as the size, so ${n} zeros in different rows and columns already exist.`,
                    `需要 ${n} 条线，与大小相同，所以已有 ${n} 个不同行不同列的零。`,
                  ]
                : [
                    done,
                    `Only ${lines} lines cover the zeros, fewer than ${n}, so there are not ${n} zeros in different rows and columns.`,
                    `只用 ${lines} 条线就覆盖了所有的零，少于 ${n}，所以没有 ${n} 个不同行不同列的零。`,
                  ],
              [
                ["The problem has no assignment", "问题没有指派"],
                "Every square cost matrix has assignments; the test only asks whether the zeros give one.",
                "每个方阵成本矩阵都有指派；这个检验只问零能否给出一个。",
              ],
              [
                ["Every entry must be doubled", "每个元素都要加倍"],
                "Doubling every entry doubles every cost and creates no new zeros.",
                "把每个元素加倍只会使每个成本加倍，不会产生新的零。",
              ],
            ],
            [
              [
                ["Compare the counts", "比较个数"],
                [`The test compares the ${lines} lines with the size ${n}.`, `这个检验比较 ${lines} 条线和大小 ${n}。`],
              ],
              [
                ["Decide", "判断"],
                lines === n
                  ? [`The counts are equal, so an assignment on zeros exists.`, `两者相等，所以存在只用零的指派。`]
                  : [`${lines} is less than ${n}, so more zeros are needed.`, `${lines} 小于 ${n}，所以需要更多的零。`],
              ],
            ],
            lines === n
              ? [
                  `With ${n} lines, ${n} zeros lie in different rows and columns, and an assignment on them costs 0 in the reduced matrix, the least possible.`,
                  `需要 ${n} 条线时，有 ${n} 个零位于不同行不同列，用它们的指派在化简矩阵中成本为 0，已是最小。`,
                ]
              : [
                  `With ${lines} lines, at most ${lines} zeros can lie in different rows and columns, fewer than the ${n} an assignment needs.`,
                  `只有 ${lines} 条线时，至多 ${lines} 个零位于不同行不同列，少于指派所需的 ${n} 个。`,
                ],
          );
        },
      ),
      point(
        "the-best-assignment",
        ["The best assignment", "最佳指派"],
        [
          "Once a complete set of zeros is found, the optimal cost is computed from the original matrix, or equally from the total amount subtracted. For a small matrix, we can confirm the answer by checking every assignment.\n\nFor the costs $\\begin{pmatrix} 1 & 4 & 6 \\\\ 5 & 2 & 7 \\\\ 3 & 6 & 2 \\end{pmatrix}$, the six assignments cost $5, 14, 11, 14, 17, 11$, so the best is the diagonal, at $1 + 2 + 2 = 5$.\n\nCheck: the row minima 1, 2 and 2 lie in different columns, and no assignment can cost less than their sum 5.\n\n> **Watch out.** An assignment uses one entry in each row and one in each column; taking each row's cheapest entry may put two workers on one job.",
          "找到一整组零后，最优成本由原矩阵计算，或者等于减去的总量。对小矩阵，可以检查每个指派来确认答案。\n\n对成本 $\\begin{pmatrix} 1 & 4 & 6 \\\\ 5 & 2 & 7 \\\\ 3 & 6 & 2 \\end{pmatrix}$，六种指派的成本是 $5, 14, 11, 14, 17, 11$，所以最好的是对角线，$1 + 2 + 2 = 5$。\n\n检验：各行最小值 1、2、2 在不同的列，任何指派的成本都不会少于它们的和 5。\n\n> **注意。** 指派在每行每列各用一个元素；每行取最便宜的元素，可能让两名工人做同一项工作。",
        ],
        (rng) => {
          const m = Array.from({ length: 3 }, () => [rng.int(1, 30), rng.int(1, 30), rng.int(1, 30)]);
          const cost = (p: readonly number[]) => p.reduce((sum, j, i) => sum + ((m[i] as number[])[j] as number), 0);
          const all = permutationsOf3.map(cost);
          const best = Math.min(...all);
          const worst = Math.max(...all);
          const bestPerm = permutationsOf3[all.indexOf(best)] as readonly number[];
          const bestOrder = bestPerm.map((j) => j + 1).join(", ");
          const tex = m.map((r) => r.join(" & ")).join(" \\\\ ");
          const used = bestPerm.map((j, i) => (m[i] as number[])[j] as number);
          const rowMins = m.reduce((sum, r) => sum + Math.min(...r), 0);
          return solved(
            [
              `What is the smallest total cost of assigning three workers to three jobs, one each, with costs $\\begin{pmatrix} ${tex} \\end{pmatrix}$?`,
              `把三名工人一对一指派给三项工作，成本是 $\\begin{pmatrix} ${tex} \\end{pmatrix}$，最小总成本是多少？`,
            ],
            best,
            [
              [worst, "That is the most expensive assignment, not the cheapest.", "这是最贵的指派，而不是最便宜的。"],
              [cost([0, 1, 2]), "That is the diagonal assignment, which is not the cheapest here.", "这是对角线指派，这里它不是最便宜的。"],
              [
                rowMins,
                "That takes each row's cheapest entry, but two workers then share a job.",
                "这是每行取最便宜的元素，但这样有两名工人做同一项工作。",
              ],
            ],
            [
              [
                ["List the assignments", "列出指派"],
                [`The six assignments cost ${all.join(", ")}.`, `六种指派的成本是 ${all.join("、")}。`],
              ],
              [
                ["Take the cheapest", "取最便宜的"],
                [
                  `The cheapest, ${best}, gives rows 1, 2, 3 the columns ${bestOrder}.`,
                  `最便宜的是 ${best}，第 1、2、3 行分别取第 ${bestOrder.replaceAll(", ", "、")} 列。`,
                ],
              ],
            ],
            [
              `Rows 1, 2, 3 with columns ${bestOrder} use the entries $${used.join(" + ")} = ${best}$, one in each row and each column.`,
              `第 1、2、3 行取第 ${bestOrder.replaceAll(", ", "、")} 列，用到的元素是 $${used.join(" + ")} = ${best}$，每行每列各一个。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "For the costs $\\begin{pmatrix} 1 & 4 \\\\ 5 & 2 \\end{pmatrix}$, subtracting each row's minimum gives $\\begin{pmatrix} 0 & 3 \\\\ 3 & 0 \\end{pmatrix}$. The zeros lie on the diagonal, so the diagonal assignment is optimal, at $1 + 2 = 3$.",
    "对成本 $\\begin{pmatrix} 1 & 4 \\\\ 5 & 2 \\end{pmatrix}$，每行减去最小值得 $\\begin{pmatrix} 0 & 3 \\\\ 3 & 0 \\end{pmatrix}$。零在对角线上，所以对角线指派最优，成本 $1 + 2 = 3$。",
  ],
  ["the other assignment costs $4 + 5 = 9$, which is more.", "另一种指派成本是 $4 + 5 = 9$，更多。"],
  [
    "reduce rows, test a reduced matrix for optimality, and find the best assignment of a small problem.",
    "做行化简，检验化简矩阵是否最优，并求小问题的最佳指派。",
  ],
);

const networkSimplex = lesson(
  topic(
    "the-network-simplex-method",
    ["The Network Simplex Method", "网络单纯形法"],
    ["Run the simplex method directly on a spanning tree of a network.", "直接在网络的生成树上运行单纯形法。"],
    ["minimum-cost-flow"],
    [],
    [
      point(
        "a-basis-is-a-tree",
        ["A basis is a tree", "基是一棵树"],
        [
          "In a minimum cost flow problem, a basis corresponds to a spanning tree of the network. So with $n$ nodes there are $n - 1$ basic arcs, and the flows on them are fixed by working in from the leaves.\n\nA connected network with 5 nodes and 8 arcs has a spanning tree of $5 - 1 = 4$ arcs, so 4 arcs are basic and the other $8 - 4 = 4$ are not.\n\nCheck: a tree with 4 arcs joins 5 nodes without a cycle, and one more arc would close a cycle.\n\n> **Watch out.** The count depends on the nodes, not on the arcs: extra arcs are nonbasic.",
          "在最小费用流问题中，基对应网络的一棵生成树。所以 $n$ 个结点时有 $n - 1$ 条基本弧，它们上的流从叶子向内依次确定。\n\n有 5 个结点和 8 条弧的连通网络，其生成树有 $5 - 1 = 4$ 条弧，所以 4 条弧是基本弧，其余 $8 - 4 = 4$ 条不是。\n\n检验：4 条弧的树连接 5 个结点且没有圈，再加一条弧就会形成圈。\n\n> **注意。** 个数取决于结点数而不是弧数：多出的弧都是非基本弧。",
        ],
        (rng) => {
          const n = rng.int(4, 60);
          const e = n - 1 + rng.int(1, 40);
          return solved(
            [
              `A connected network has ${n} nodes and ${e} arcs. How many arcs are basic in the network simplex method?`,
              `连通网络有 ${n} 个结点和 ${e} 条弧。在网络单纯形法中有多少条基本弧？`,
            ],
            n - 1,
            [
              [n, `That counts the nodes; a tree on ${n} nodes has one arc fewer.`, `这是结点数；${n} 个结点的树少一条弧。`],
              [e - n + 1, "That is the number of nontree arcs, the ones left out of the tree.", "这是非树弧的条数，即树之外的弧。"],
              [e, "That counts every arc; only the arcs of a spanning tree are basic.", "这数的是所有弧；只有生成树的弧是基本弧。"],
            ],
            [
              [
                ["Identify the basis", "确定基"],
                [`A basis is a spanning tree, which reaches all ${n} nodes.`, `基是一棵生成树，它到达全部 ${n} 个结点。`],
              ],
              [
                ["Count its arcs", "数树的弧"],
                [
                  `A spanning tree on ${n} nodes has $${n} - 1 = ${n - 1}$ arcs, whatever the number of arcs overall.`,
                  `${n} 个结点的生成树有 $${n} - 1 = ${n - 1}$ 条弧，与弧的总数无关。`,
                ],
              ],
            ],
            [
              `The other $${e} - ${n - 1} = ${e - n + 1}$ arcs are nonbasic, and adding any one of them to the tree closes a cycle.`,
              `其余 $${e} - ${n - 1} = ${e - n + 1}$ 条弧是非基本弧，把其中任何一条加到树上都会形成圈。`,
            ],
          );
        },
      ),
      {
        ...point(
          "potentials-and-reduced-costs",
          ["Potentials and reduced costs", "势和检验数"],
          [
            "Node potentials play the role of dual values, with $\\pi_j = \\pi_i + c_{ij}$ along each tree arc. A nontree arc has reduced cost $c_{ij} + \\pi_i - \\pi_j$, and a negative value means it can improve the plan.\n\nWith tree arcs $S \\to A$ of cost 2, $A \\to T$ of cost 3 and $S \\to B$ of cost 1, and $\\pi_S = 0$, the potentials are $\\pi_A = 2$, $\\pi_T = 5$ and $\\pi_B = 1$. A nontree arc $B \\to T$ of cost 6 has reduced cost $6 + 1 - 5 = 2$.\n\nCheck: the route $S \\to B \\to T$ costs $1 + 6 = 7$, and the tree route $S \\to A \\to T$ costs 5; the difference is 2.\n\n> **Watch out.** The reduced cost is $c_{ij} + \\pi_i - \\pi_j$; swapping the potentials flips its sign.",
            "结点势起对偶值的作用，沿每条树弧 $\\pi_j = \\pi_i + c_{ij}$。非树弧的检验数是 $c_{ij} + \\pi_i - \\pi_j$，负值表示它可以改善方案。\n\n树弧 $S \\to A$ 费用 2，$A \\to T$ 费用 3，$S \\to B$ 费用 1，$\\pi_S = 0$，则势为 $\\pi_A = 2$，$\\pi_T = 5$，$\\pi_B = 1$。费用为 6 的非树弧 $B \\to T$ 的检验数是 $6 + 1 - 5 = 2$。\n\n检验：路线 $S \\to B \\to T$ 费用 $1 + 6 = 7$，树上的路线 $S \\to A \\to T$ 费用 5，相差 2。\n\n> **注意。** 检验数是 $c_{ij} + \\pi_i - \\pi_j$；把两个势对调，符号就反了。",
          ],
          (rng) => {
            const [sa, at, sb] = [rng.int(1, 20), rng.int(1, 20), rng.int(1, 20)];
            const bt = rng.int(1, 40);
            const value = bt + sb - sa - at;
            return solved(
              [
                `In the network drawn, the tree arcs are $S \\to A$, $A \\to T$ and $S \\to B$, with $\\pi_S = 0$. What is the reduced cost of the nontree arc $B \\to T$?`,
                `在图示网络中，树弧是 $S \\to A$，$A \\to T$ 和 $S \\to B$，$\\pi_S = 0$。非树弧 $B \\to T$ 的检验数是多少？`,
              ],
              value,
              [
                [
                  bt - sb + sa + at,
                  "That swaps the signs of the potentials; the reduced cost is $c_{BT} + \\pi_B - \\pi_T$.",
                  "这把势的符号弄反了；检验数是 $c_{BT} + \\pi_B - \\pi_T$。",
                ],
                [sa + at - bt - sb, "That is the negative of the reduced cost.", "这是检验数的相反数。"],
                [bt - sa - at, `That leaves out the potential $\\pi_B = ${sb}$.`, `这漏掉了势 $\\pi_B = ${sb}$。`],
              ],
              [
                [
                  ["Find the potentials", "求势"],
                  [
                    `Along the tree, $\\pi_A = ${sa}$, $\\pi_T = ${sa} + ${at} = ${sa + at}$ and $\\pi_B = ${sb}$.`,
                    `沿树，$\\pi_A = ${sa}$，$\\pi_T = ${sa} + ${at} = ${sa + at}$，$\\pi_B = ${sb}$。`,
                  ],
                ],
                [
                  ["Price the arc", "计算检验数"],
                  [
                    `The tree gives $\\pi_B = ${sb}$ and $\\pi_T = ${sa + at}$, so the value is $${bt} + ${sb} - ${sa + at} = ${value}$.`,
                    `树给出 $\\pi_B = ${sb}$ 和 $\\pi_T = ${sa + at}$，所以值是 $${bt} + ${sb} - ${sa + at} = ${value}$。`,
                  ],
                ],
              ],
              [
                `The route $S \\to B \\to T$ costs ${sb + bt} and the tree route $S \\to A \\to T$ costs ${sa + at}, and their difference ${value} is the reduced cost.`,
                `路线 $S \\to B \\to T$ 费用 ${sb + bt}，树上的路线 $S \\to A \\to T$ 费用 ${sa + at}，两者之差 ${value} 正是检验数。`,
              ],
              arcsFigure(
                [
                  ["S", "A", sa],
                  ["A", "T", at],
                  ["S", "B", sb],
                  ["B", "T", bt],
                ],
                [
                  `A network with arcs S to A cost ${sa}, A to T cost ${at}, S to B cost ${sb} and B to T cost ${bt}.`,
                  `网络的弧是 S 到 A 费用 ${sa}，A 到 T 费用 ${at}，S 到 B 费用 ${sb}，B 到 T 费用 ${bt}。`,
                ],
              ),
            );
          },
        ),
        figure: linearProgrammingDrawings1["the-network-simplex-method#potentials-and-reduced-costs"],
      },
      {
        ...point(
          "pushing-around-a-cycle",
          ["Pushing around a cycle", "沿圈推流"],
          [
            "An entering arc closes one cycle with the tree. Flow increases on forward arcs and decreases on backward arcs, so the push is limited by the smallest flow on a backward arc, and that arc leaves the tree.\n\nIf the backward arcs carry 5, 3 and 8 and a forward arc carries 2, the push is 3, the smallest backward flow.\n\nCheck: after pushing 3, the backward flows are 2, 0 and 5, none negative, and the forward arc carries 5.\n\n> **Watch out.** Forward arcs gain flow, so their flows do not limit the push.",
            "进基弧与树形成一个圈。流在前向弧上增加，在后向弧上减少，所以推流量受后向弧上最小流的限制，那条弧离开树。\n\n若后向弧上的流是 5、3、8，前向弧上的流是 2，推流量是后向弧上最小的流 3。\n\n检验：推 3 之后，后向弧上的流是 2、0、5，都不为负，前向弧上的流是 5。\n\n> **注意。** 前向弧上的流增加，所以它们的流不限制推流量。",
          ],
          (rng) => {
            const back = rng.sample(
              Array.from({ length: 50 }, (_, i) => i + 1),
              3,
            );
            const forward = rng.int(1, 40);
            const m = Math.min(...back);
            return solved(
              [
                `A cycle has backward arcs with the flows $${back.join(", ")}$, and a forward arc with the flow ${forward}. How much flow can be pushed?`,
                `一个圈有流为 $${back.join(", ")}$ 的后向弧和流为 ${forward} 的前向弧。能推多少流？`,
              ],
              m,
              [
                [
                  Math.max(...back),
                  "That is the largest backward flow; the smallest one runs out first.",
                  "这是最大的后向流；最小的那个先用完。",
                ],
                [forward, "Forward arcs gain flow, so they do not limit the push.", "前向弧上的流增加，所以它们不限制推流量。"],
                [
                  m + forward,
                  "That adds the forward flow; only the backward arcs limit the push.",
                  "这加上了前向流；只有后向弧限制推流量。",
                ],
              ],
              [
                [
                  ["Find the arcs that lose flow", "找减少流的弧"],
                  [
                    `Pushing flow around the cycle lowers the backward flows ${back.join(", ")}.`,
                    `沿圈推流会使后向弧上的流 ${back.join("、")} 减少。`,
                  ],
                ],
                [
                  ["Take the smallest", "取最小值"],
                  [
                    `Only backward arcs lose flow, so the limit is the smallest of them, ${m}.`,
                    `只有后向弧减少流，所以限制是其中最小的 ${m}。`,
                  ],
                ],
              ],
              [
                `After pushing ${m}, the backward flows become ${back.map((f) => f - m).join(", ")}, none negative, and the arc that reaches 0 leaves the tree.`,
                `推 ${m} 之后，后向弧上的流变成 ${back.map((f) => f - m).join("、")}，都不为负，降到 0 的那条弧离开树。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["the-network-simplex-method#pushing-around-a-cycle"],
      },
    ],
  ),
  [
    "In a network with nodes $S, A, B, T$, the tree arcs $S \\to A$, $A \\to T$ and $S \\to B$ form a basis of $4 - 1 = 3$ arcs. With $\\pi_S = 0$ and costs 2, 3 and 1 on them, the potentials are $\\pi_A = 2$, $\\pi_T = 5$ and $\\pi_B = 1$.",
    "在结点为 $S, A, B, T$ 的网络中，树弧 $S \\to A$、$A \\to T$ 和 $S \\to B$ 构成 $4 - 1 = 3$ 条弧的基。取 $\\pi_S = 0$，这些弧的费用为 2、3、1，则势为 $\\pi_A = 2$，$\\pi_T = 5$，$\\pi_B = 1$。",
  ],
  ["$\\pi_T - \\pi_A = 5 - 2 = 3$, the cost of $A \\to T$.", "$\\pi_T - \\pi_A = 5 - 2 = 3$，正是 $A \\to T$ 的费用。"],
  [
    "count the arcs of a basis, price a nontree arc with potentials, and find how much flow a cycle can carry.",
    "数基的弧，用势计算非树弧的检验数，并求一个圈能推多少流。",
  ],
);

const branchBound = lesson(
  topic(
    "branch-and-bound",
    ["Branch and Bound", "分支定界"],
    ["Split on a fractional variable, and discard branches using bounds.", "按分数变量分支，并用界剪去分支。"],
    ["integer-programming"],
    [],
    [
      point(
        "the-two-branches",
        ["The two branches", "两个分支"],
        [
          "When a variable has a fractional value in the relaxation, no integer solution has that variable strictly between the neighboring integers. So we split the problem into one branch with $x \\le \\lfloor v \\rfloor$ and another with $x \\ge \\lceil v \\rceil$.\n\nIf the relaxation gives $x = \\frac{7}{2}$, the branches are $x \\le 3$ and $x \\ge 4$.\n\nCheck: $3 < \\frac{7}{2} < 4$, and no integer lies strictly between 3 and 4, so no integer solution is lost.\n\n> **Watch out.** The $\\le$ branch rounds down and the $\\ge$ branch rounds up; rounding the other way cuts off an integer.",
          "当松弛解中变量取分数值时，没有整数解使这个变量严格在相邻整数之间。所以把问题分成 $x \\le \\lfloor v \\rfloor$ 和 $x \\ge \\lceil v \\rceil$ 两个分支。\n\n若松弛解给出 $x = \\frac{7}{2}$，两个分支是 $x \\le 3$ 和 $x \\ge 4$。\n\n检验：$3 < \\frac{7}{2} < 4$，3 和 4 之间没有整数，所以不会丢掉整数解。\n\n> **注意。** $\\le$ 分支向下取整，$\\ge$ 分支向上取整；取反了会切掉一个整数。",
        ],
        (rng) => {
          const b = rng.int(2, 9);
          const a = rng.int(1, 200) * b + rng.int(1, b - 1);
          const lo = Math.floor(a / b);
          const up = rng.bool();
          const v = Q.of(a, b);
          return solved(
            [
              `The relaxation has $x = ${Q.of(a, b).toLatex()}$. What bound does the ${up ? "upper" : "lower"} branch use, with ${up ? "$x \\ge k$" : "$x \\le k$"}?`,
              `松弛解有 $x = ${Q.of(a, b).toLatex()}$。${up ? "上" : "下"}分支用什么界，${up ? "$x \\ge k$" : "$x \\le k$"}？`,
            ],
            up ? lo + 1 : lo,
            up
              ? [
                  [lo, "That is the bound of the lower branch.", "这是下分支的界。"],
                  [lo + 2, `That skips the integer ${lo + 1}, which is still allowed.`, `这跳过了整数 ${lo + 1}，而它仍然是允许的。`],
                  [v, "That is the fractional value itself; a branch needs an integer bound.", "这是分数值本身；分支需要整数的界。"],
                ]
              : [
                  [lo + 1, "That is the bound of the upper branch.", "这是上分支的界。"],
                  [lo - 1, `That cuts off the integer ${lo}, which is still allowed.`, `这切掉了整数 ${lo}，而它仍然是允许的。`],
                  [v, "That is the fractional value itself; a branch needs an integer bound.", "这是分数值本身；分支需要整数的界。"],
                ],
            [
              [
                ["Locate the value", "确定位置"],
                [`$${lo} < ${v.toLatex()} < ${lo + 1}$.`, `$${lo} < ${v.toLatex()} < ${lo + 1}$。`],
              ],
              [
                ["Round", "取整"],
                [
                  `The value lies between ${lo} and ${lo + 1}, so ${up ? "round up" : "round down"} to $k = ${up ? lo + 1 : lo}$.`,
                  `这个值在 ${lo} 和 ${lo + 1} 之间，所以${up ? "向上取整" : "向下取整"}，$k = ${up ? lo + 1 : lo}$。`,
                ],
              ],
            ],
            [
              `The branches $x \\le ${lo}$ and $x \\ge ${lo + 1}$ together keep every integer value of $x$ and leave out only the values strictly between ${lo} and ${lo + 1}.`,
              `分支 $x \\le ${lo}$ 和 $x \\ge ${lo + 1}$ 合起来保留了 $x$ 的每个整数值，只去掉严格介于 ${lo} 和 ${lo + 1} 之间的值。`,
            ],
          );
        },
      ),
      point(
        "pruning-a-branch",
        ["Pruning a branch", "剪枝"],
        [
          "In a maximization, a relaxation's value is an upper bound for its branch, while the best integer solution so far is a lower bound overall. A branch whose bound does not beat the incumbent can be discarded.\n\nWith an incumbent of 50, a branch whose relaxation has value 48 is discarded, while a branch with value 53 is kept and explored.\n\nCheck: every integer point of the first branch has value at most 48, and $48 \\le 50$.\n\n> **Watch out.** A fractional relaxation is a bound, not a solution; it can never become the incumbent.",
          "在最大化问题中，松弛的值是其分支的上界，而目前最好的整数解是总的下界。界不超过当前最好解的分支可以丢弃。\n\n当前最好解为 50 时，松弛值为 48 的分支被丢弃，而值为 53 的分支要保留并继续探索。\n\n检验：第一个分支的每个整数点的值都不超过 48，而 $48 \\le 50$。\n\n> **注意。** 分数的松弛解只是界，不是解；它永远不能成为当前最好解。",
        ],
        (rng) => {
          const inc = rng.int(20, 300);
          const b = inc + rng.int(-20, 20);
          const prune = b <= inc;
          const cut: [string, string] = ["Discard this branch", "丢弃这个分支"];
          const keep: [string, string] = ["Keep exploring this branch", "继续探索这个分支"];
          return chosen(
            rng,
            [
              `Maximizing, the incumbent has value ${inc}, and a branch's relaxation has value ${b} with a fractional solution. What should be done?`,
              `在最大化中，当前最好解的值是 ${inc}，一个分支的松弛值是 ${b}，解是分数。应该怎么做？`,
            ],
            prune ? cut : keep,
            [
              prune
                ? [
                    keep,
                    `Its bound ${b} is no better than ${inc}, so nothing in this branch can beat the incumbent.`,
                    `它的界 ${b} 不比 ${inc} 好，所以这个分支中没有点能胜过当前最好解。`,
                  ]
                : [
                    cut,
                    `Its bound ${b} exceeds ${inc}, so the branch may still hold a better integer solution.`,
                    `它的界 ${b} 超过 ${inc}，所以这个分支中可能还有更好的整数解。`,
                  ],
              [
                ["Accept it as the new incumbent", "接受它作为新的最好解"],
                "Its solution is fractional, so it is not an integer solution and cannot be the incumbent.",
                "它的解是分数，不是整数解，不能成为当前最好解。",
              ],
              [
                ["Stop the whole search at once", "立刻停止整个搜索"],
                "Other branches may still be open; one branch alone does not end the search.",
                "可能还有其他未处理的分支；一个分支不能结束整个搜索。",
              ],
            ],
            [
              [
                ["Read the bound", "读出界"],
                [`The relaxation value ${b} bounds every integer point of the branch.`, `松弛值 ${b} 是这个分支每个整数点的上界。`],
              ],
              [
                ["Compare with the incumbent", "与当前最好解比较"],
                [
                  `The bound ${b} ${prune ? "does not exceed" : "exceeds"} the incumbent ${inc}, which decides the branch.`,
                  `界 ${b} ${prune ? "不超过" : "超过"}当前最好解 ${inc}，这决定了这个分支。`,
                ],
              ],
            ],
            prune
              ? [
                  `Every integer point in the branch has value at most ${b}, and ${b} is at most ${inc}.`,
                  `这个分支中每个整数点的值都不超过 ${b}，而 ${b} 不超过 ${inc}。`,
                ]
              : [
                  `The branch could still hold an integer point with a value up to ${b}, more than ${inc}.`,
                  `这个分支中仍可能有值高达 ${b} 的整数点，比 ${inc} 大。`,
                ],
          );
        },
      ),
      point(
        "the-optimality-gap",
        ["The optimality gap", "最优性间隙"],
        [
          "The largest bound among the open branches and the incumbent's value enclose the true optimum. Their difference is the gap, which can be reported at any time, so the search may stop as soon as the gap is small enough.\n\nWith an incumbent of 100 and open bounds 104, 110 and 107, the optimum lies between 100 and 110, so the gap is $110 - 100 = 10$.\n\nCheck: no open branch can give more than 110, and the incumbent already gives 100.\n\n> **Watch out.** Use the largest open bound; a smaller one could understate how far the incumbent may be from the optimum.",
          "未处理分支的最大界和当前最好解的值夹住真正的最优值。它们的差是间隙，可以随时报告，所以间隙足够小时搜索就可以停止。\n\n当前最好解为 100，未处理分支的界为 104、110、107 时，最优值在 100 和 110 之间，所以间隙是 $110 - 100 = 10$。\n\n检验：没有未处理的分支能超过 110，而当前最好解已经给出 100。\n\n> **注意。** 要用最大的未处理界；用较小的界会低估当前最好解离最优值有多远。",
        ],
        (rng) => {
          const inc = rng.int(50, 400);
          const bounds = [inc + rng.int(1, 30), inc + rng.int(1, 30), inc + rng.int(1, 30)];
          const top = Math.max(...bounds);
          return solved(
            [
              `Maximizing, the incumbent has value ${inc}, and the open branches have bounds $${bounds.join(", ")}$. What is the gap?`,
              `在最大化中，当前最好解的值是 ${inc}，未处理分支的界是 $${bounds.join(", ")}$。间隙是多少？`,
            ],
            top - inc,
            [
              [
                Math.min(...bounds) - inc,
                "That uses the smallest bound; the gap uses the largest open bound.",
                "这用了最小的界；间隙要用最大的未处理界。",
              ],
              [
                top,
                "That is the largest bound itself, not its difference from the incumbent.",
                "这是最大的界本身，而不是它与当前最好解的差。",
              ],
              [inc, "That is the incumbent, not the gap.", "这是当前最好解，不是间隙。"],
            ],
            [
              [
                ["Find the largest bound", "找最大的界"],
                [`The largest of ${bounds.join(", ")} is ${top}.`, `${bounds.join("、")} 中最大的是 ${top}。`],
              ],
              [
                ["Subtract the incumbent", "减去当前最好解"],
                [
                  `Use the largest bound, ${top}, minus the incumbent ${inc}: $${top} - ${inc} = ${top - inc}$.`,
                  `用最大的界 ${top} 减去当前最好解 ${inc}：$${top} - ${inc} = ${top - inc}$。`,
                ],
              ],
            ],
            [
              `The optimum lies between ${inc} and ${top}, an interval of length ${top - inc}.`,
              `最优值在 ${inc} 和 ${top} 之间，区间长度为 ${top - inc}。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "If the relaxation gives $x = \\frac{7}{2}$ with value 41, branch on $x \\le 3$ and $x \\ge 4$. With an incumbent of 40, a branch whose relaxation is worth 39 is discarded at once.",
    "若松弛解给出 $x = \\frac{7}{2}$，值为 41，就按 $x \\le 3$ 和 $x \\ge 4$ 分支。当前最好解为 40 时，松弛值为 39 的分支立即被丢弃。",
  ],
  ["$39 \\le 40$, and the optimum lies between 40 and 41.", "$39 \\le 40$，而最优值在 40 和 41 之间。"],
  [
    "set the bounds of two branches, decide when to prune, and measure the gap between the incumbent and the best bound.",
    "确定两个分支的界，判断何时剪枝，并计算当前最好解与最好界之间的间隙。",
  ],
);

const knapsack = lesson(
  topic(
    "the-knapsack-problem",
    ["The Knapsack Problem", "背包问题"],
    ["Compare the greedy relaxation with the true integer optimum.", "比较贪心松弛和真正的整数最优解。"],
    ["integer-programming"],
    [],
    [
      point(
        "the-relaxation-by-ratios",
        ["The relaxation by ratios", "按比值的松弛"],
        [
          "If fractions of items are allowed, the optimal rule is greedy: take items in order of value per unit weight, until the capacity runs out. So only one item is ever fractional, and this gives a quick upper bound.\n\nItem A has weight 4 and value 40, a ratio of 10, and item B has weight 5 and value 25, a ratio of 5. With capacity 6, take all of A and 2 units of B: $40 + 5(2) = 50$.\n\nCheck: the weight used is $4 + 2 = 6$, the whole capacity.\n\n> **Watch out.** Order the items by value per unit weight, not by value.",
          "如果允许取物品的一部分，最优规则是贪心的：按单位重量价值的顺序取，直到容量用完。所以至多一个物品是分数，这给出一个快速的上界。\n\n物品 A 重 4、价值 40，比值 10；物品 B 重 5、价值 25，比值 5。容量为 6 时，全取 A，再取 B 的 2 单位：$40 + 5(2) = 50$。\n\n检验：用掉的重量是 $4 + 2 = 6$，正好是全部容量。\n\n> **注意。** 要按单位重量价值排序，而不是按价值排序。",
        ],
        (rng) => {
          const w1 = rng.int(2, 9);
          const w2 = rng.int(2, 9);
          const r1 = rng.int(8, 12);
          const r2 = rng.int(3, 7);
          const cap = w1 + rng.int(1, w2 - 1);
          const left = cap - w1;
          const answer = r1 * w1 + r2 * left;
          return solved(
            [
              `Item A has weight ${w1} and value ${r1 * w1}, and item B has weight ${w2} and value ${r2 * w2}. With capacity ${cap} and fractions allowed, what is the best total value?`,
              `物品 A 重 ${w1}，价值 ${r1 * w1}；物品 B 重 ${w2}，价值 ${r2 * w2}。容量为 ${cap} 且允许取部分时，最佳总价值是多少？`,
            ],
            answer,
            [
              [
                r1 * w1,
                `That leaves the remaining capacity ${left} empty; fractions of B are allowed.`,
                `这让剩下的容量 ${left} 空着；B 是可以取一部分的。`,
              ],
              [r1 * w1 + r2 * w2, "That takes all of B, which does not fit.", "这取了全部的 B，而它放不下。"],
              [
                r1 * cap,
                `That fills the whole capacity at A's ratio, but there is only ${w1} of A.`,
                `这按 A 的比值装满全部容量，但 A 只有 ${w1}。`,
              ],
            ],
            [
              [
                ["Compare the ratios", "比较比值"],
                [
                  `A is worth $\\frac{${r1 * w1}}{${w1}} = ${r1}$ per unit and B is worth $\\frac{${r2 * w2}}{${w2}} = ${r2}$ per unit.`,
                  `A 每单位价值 $\\frac{${r1 * w1}}{${w1}} = ${r1}$，B 每单位价值 $\\frac{${r2 * w2}}{${w2}} = ${r2}$。`,
                ],
              ],
              [
                ["Fill greedily", "贪心地装"],
                [
                  `A has the better ratio, so take all of it, and then ${left} units of B at ${r2} per unit: $${r1 * w1} + ${r2}(${left}) = ${answer}$.`,
                  `A 的比值更好，所以全取，再取 B 的 ${left} 单位，每单位 ${r2}：$${r1 * w1} + ${r2}(${left}) = ${answer}$。`,
                ],
              ],
            ],
            [
              `The weight used is $${w1} + ${left} = ${cap}$, the whole capacity, and the value ${answer} is less than $${r1}(${cap}) = ${r1 * cap}$, which no mix can reach.`,
              `用掉的重量是 $${w1} + ${left} = ${cap}$，正好是全部容量，价值 ${answer} 小于任何组合都达不到的 $${r1}(${cap}) = ${r1 * cap}$。`,
            ],
          );
        },
      ),
      point(
        "the-integer-optimum",
        ["The integer optimum", "整数最优解"],
        [
          "With whole items only, the greedy choice can be wrong, because it may leave capacity unused. A small instance can be solved by checking the subsets, and a larger one by dynamic programming over the capacity.\n\nWith items $(5, 10)$, $(4, 7)$ and $(4, 7)$ as (weight, value) and capacity 8, the greedy choice by ratio takes $(5, 10)$ and then nothing else fits, for 10. Taking the two items of weight 4 instead gives $7 + 7 = 14$.\n\nCheck: the two items weigh $4 + 4 = 8$, exactly the capacity.\n\n> **Watch out.** With whole items, the best ratio first can leave capacity unused; check the subsets.",
          "只能取整个物品时，贪心选择可能出错，因为它可能留下未用的容量。小实例可以检查子集来解，大实例可以对容量做动态规划。\n\n物品的（重量，价值）为 $(5, 10)$、$(4, 7)$、$(4, 7)$，容量为 8，按比值贪心先取 $(5, 10)$，之后什么都放不下，得 10。改取两个重量为 4 的物品得 $7 + 7 = 14$。\n\n检验：两个物品重 $4 + 4 = 8$，正好是容量。\n\n> **注意。** 只能取整个物品时，先取比值最好的可能留下未用的容量；要检查各个子集。",
        ],
        (rng) => {
          const items = Array.from({ length: 4 }, () => ({ w: rng.int(2, 12), v: rng.int(3, 40) }));
          const total = items.reduce((sum, it) => sum + it.w, 0);
          const cap = rng.int(Math.max(...items.map((it) => it.w)), total - 1);
          let best = 0;
          let bestWeight = 0;
          let bestItems: string[] = [];
          for (let mask = 0; mask < 16; mask++) {
            let w = 0;
            let v = 0;
            items.forEach((it, i) => {
              if (mask & (1 << i)) {
                w += it.w;
                v += it.v;
              }
            });
            if (w <= cap && v > best) {
              best = v;
              bestWeight = w;
              bestItems = items.flatMap((it, i) => (mask & (1 << i) ? [`(${it.w}, ${it.v})`] : []));
            }
          }
          const sumV = items.reduce((sum, it) => sum + it.v, 0);
          let room = cap;
          let greedy = 0;
          for (const it of [...items].sort((p, q) => q.v / q.w - p.v / p.w))
            if (it.w <= room) {
              room -= it.w;
              greedy += it.v;
            }
          const single = Math.max(...items.filter((it) => it.w <= cap).map((it) => it.v));
          return solved(
            [
              `Items have (weight, value) pairs ${items.map((it) => `(${it.w}, ${it.v})`).join(", ")}. With capacity ${cap} and whole items only, what is the best total value?`,
              `物品的（重量，价值）是 ${items.map((it) => `(${it.w}, ${it.v})`).join(", ")}。容量为 ${cap} 且只能取整个物品时，最佳总价值是多少？`,
            ],
            best,
            [
              [
                sumV,
                `That takes every item, whose total weight ${total} is over the capacity.`,
                `这取了全部物品，总重量 ${total} 超过了容量。`,
              ],
              [
                greedy,
                "That is the greedy choice by value per unit weight, which leaves capacity unused here.",
                "这是按单位重量价值贪心选的结果，这里它留下了未用的容量。",
              ],
              [single, "That takes only the most valuable single item that fits.", "这只取了放得下的最有价值的一个物品。"],
            ],
            [
              [
                ["Check the subsets", "检查子集"],
                [
                  `List the subsets of the four items and keep those whose total weight is at most ${cap}.`,
                  `列出四个物品的子集，保留总重量不超过 ${cap} 的。`,
                ],
              ],
              [
                ["Take the best", "取最好的"],
                [
                  `Among the subsets whose total weight is at most ${cap}, the best takes ${bestItems.join(", ")}, with weight ${bestWeight} and value ${best}.`,
                  `在总重量不超过 ${cap} 的子集中，最好的是取 ${bestItems.join("、")}，重量 ${bestWeight}，价值 ${best}。`,
                ],
              ],
            ],
            [
              `The chosen items weigh ${bestWeight}, at most ${cap}, and adding any other item would go over the capacity.`,
              `选中的物品重 ${bestWeight}，不超过 ${cap}，再加任何一个物品都会超过容量。`,
            ],
          );
        },
      ),
      point(
        "a-step-of-dynamic-programming",
        ["A step of dynamic programming", "动态规划的一步"],
        [
          "Let $f(c)$ be the best value at capacity $c$ with the items so far. For a new item of weight $w$ and value $v$, we have $f'(c) = \\max(f(c), f(c - w) + v)$, which compares leaving the item out with taking it.\n\nWith $f(10) = 30$, $f(6) = 20$ and a new item of weight 4 and value 15, the new value is $\\max(30, 20 + 15) = 35$.\n\nCheck: taking the item uses 4 of the 10, leaving 6 for the old items, which give 20, and $20 + 15 = 35 > 30$.\n\n> **Watch out.** Taking the item uses $f(c - w)$, not $f(c)$: the item needs its own room.",
          "设 $f(c)$ 是容量 $c$ 时用目前物品的最佳价值。对重量 $w$、价值 $v$ 的新物品，$f'(c) = \\max(f(c), f(c - w) + v)$，比较不取和取这个物品。\n\n若 $f(10) = 30$，$f(6) = 20$，新物品重 4、价值 15，新的值是 $\\max(30, 20 + 15) = 35$。\n\n检验：取这个物品用掉 10 中的 4，剩下 6 给原来的物品，得 20，而 $20 + 15 = 35 > 30$。\n\n> **注意。** 取这个物品时用 $f(c - w)$ 而不是 $f(c)$：物品需要占用自己的容量。",
        ],
        (rng) => {
          const b = rng.int(5, 50);
          const a = b + rng.int(0, 30);
          const v = rng.int(3, 40);
          const w = rng.int(2, 9);
          const c = w + rng.int(1, 20);
          const answer = Math.max(a, b + v);
          return solved(
            [
              `Before a new item of weight ${w} and value ${v}, $f(${c}) = ${a}$ and $f(${c - w}) = ${b}$. What is the new $f(${c})$?`,
              `在重量 ${w}、价值 ${v} 的新物品之前，$f(${c}) = ${a}$，$f(${c - w}) = ${b}$。新的 $f(${c})$ 是多少？`,
            ],
            answer,
            [
              [
                Math.min(a, b + v),
                "That keeps the smaller; the new value is the better of the two choices.",
                "这取了较小的；新的值是两种选择中较好的。",
              ],
              [a + b + v, "That adds both choices; only one of them can be taken.", "这把两种选择相加了；只能取其中之一。"],
              [
                a + v,
                `That adds the item to $f(${c})$, but the item needs ${w} of the capacity, leaving ${c - w}.`,
                `这把物品加到 $f(${c})$ 上，但物品要占用 ${w} 的容量，只剩 ${c - w}。`,
              ],
            ],
            [
              [
                ["List the choices", "列出两种选择"],
                [
                  `Leaving the item out gives $f(${c}) = ${a}$, and taking it gives $f(${c - w}) + ${v} = ${b} + ${v} = ${b + v}$.`,
                  `不取这个物品得 $f(${c}) = ${a}$，取它得 $f(${c - w}) + ${v} = ${b} + ${v} = ${b + v}$。`,
                ],
              ],
              [
                ["Keep the larger", "取较大的"],
                [
                  `Compare ${a} with $${b} + ${v}$, and keep the larger one, ${answer}.`,
                  `比较 ${a} 和 $${b} + ${v}$，取较大的 ${answer}。`,
                ],
              ],
            ],
            [
              `The new value ${answer} is at least the old value ${a}, as it must be, since leaving the item out is always possible.`,
              `新的值 ${answer} 不小于原来的 ${a}，这是必然的，因为总可以不取这个物品。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Item A has weight 4 and value 40, item B weight 5 and value 25, and the capacity is 6. With fractions allowed, take A and 2 units of B for 50; with whole items only, A alone gives 40.",
    "物品 A 重 4、价值 40，物品 B 重 5、价值 25，容量为 6。允许取部分时，取 A 和 B 的 2 单位，得 50；只能取整个物品时，只取 A，得 40。",
  ],
  [
    "$4 + 2 = 6$, and $4 + 5 = 9 > 6$, so the two whole items do not fit together.",
    "$4 + 2 = 6$，而 $4 + 5 = 9 > 6$，所以两个整物品放不到一起。",
  ],
  [
    "solve the relaxation by ratios, find the integer optimum of a small instance, and take one step of dynamic programming.",
    "按比值解松弛问题，求小实例的整数最优解，并做动态规划的一步。",
  ],
);

const unimodular = lesson(
  topic(
    "total-unimodularity",
    ["Total Unimodularity", "全单模性"],
    ["See why network programs give whole number answers without integer constraints.", "了解为什么网络规划不加整数约束也给出整数解。"],
    ["integer-programming", "the-assignment-problem"],
    [],
    [
      point(
        "the-determinant-test",
        ["The determinant test", "行列式检验"],
        [
          "A matrix is totally unimodular when every square submatrix has determinant 0, 1 or $-1$. So a single submatrix with a different determinant is enough to show that the matrix does not have this property.\n\nThe submatrix $\\begin{pmatrix} 1 & 1 \\\\ -1 & 1 \\end{pmatrix}$ has determinant $1(1) - 1(-1) = 2$, so a matrix containing it is not totally unimodular.\n\nCheck: 2 is not one of 0, 1 and $-1$.\n\n> **Watch out.** The determinant is $ad - bc$, a difference; adding $bc$ or using the sum $a + d$ gives a different number.",
          "矩阵是全单模的，当且仅当每个方子矩阵的行列式是 0、1 或 $-1$。所以只要有一个子矩阵的行列式不同，就说明矩阵没有这个性质。\n\n子矩阵 $\\begin{pmatrix} 1 & 1 \\\\ -1 & 1 \\end{pmatrix}$ 的行列式是 $1(1) - 1(-1) = 2$，所以含有它的矩阵不是全单模的。\n\n检验：2 不是 0、1、$-1$ 之一。\n\n> **注意。** 行列式是 $ad - bc$，是差；加上 $bc$ 或用和 $a + d$ 得到的是别的数。",
        ],
        (rng) => {
          const [a, b, c, d] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
          const det = a * d - b * c;
          const allowed = det === 0 || det === 1 || det === -1;
          return solved(
            [
              `What is the determinant of the submatrix $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$?`,
              `子矩阵 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的行列式是多少？`,
            ],
            det,
            [
              [a * d + b * c, "That adds $bc$; the determinant subtracts it.", "这加上了 $bc$；行列式要减去它。"],
              [b * c - a * d, "That is $bc - ad$, the determinant with its sign flipped.", "这是 $bc - ad$，符号反了的行列式。"],
              [a + d, "That is the sum of the diagonal entries, not the determinant.", "这是对角线元素之和，不是行列式。"],
            ],
            [
              [
                ["Multiply the diagonals", "计算两条对角线的积"],
                [
                  `The main diagonal gives $(${a})(${d}) = ${a * d}$ and the other diagonal gives $(${b})(${c}) = ${b * c}$.`,
                  `主对角线得 $(${a})(${d}) = ${a * d}$，另一条对角线得 $(${b})(${c}) = ${b * c}$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`The determinant is $ad - bc = ${a * d} - (${b * c}) = ${det}$.`, `行列式是 $ad - bc = ${a * d} - (${b * c}) = ${det}$。`],
              ],
            ],
            allowed
              ? [
                  `The value ${det} is one of 0, 1 and $-1$, so this submatrix does not rule out total unimodularity.`,
                  `值 ${det} 是 0、1、$-1$ 之一，所以这个子矩阵不排除全单模性。`,
                ]
              : [
                  `The value ${det} is not one of 0, 1 and $-1$, so a matrix containing this submatrix is not totally unimodular.`,
                  `值 ${det} 不是 0、1、$-1$ 之一，所以含有这个子矩阵的矩阵不是全单模的。`,
                ],
          );
        },
      ),
      point(
        "whole-number-corners",
        ["Whole number corners", "整数角点"],
        [
          "By Cramer's rule, each basic value is the determinant of the basis with that variable's column replaced by the right side, divided by the determinant of the basis. With whole data the numerator is an integer. When the determinant of the basis is $\\pm 1$ and the right side is whole, every corner is a whole number point, so rounding is never needed.\n\nFor the basis $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ with right side $\\begin{pmatrix} 7 \\\\ 4 \\end{pmatrix}$, the determinant is $2(1) - 1(1) = 1$ and the first numerator is $7(1) - 1(4) = 3$, so the first value is $\\frac{3}{1} = 3$.\n\nCheck: the second value is $4 - 3 = 1$, and $2(3) + 1 = 7$.\n\n> **Watch out.** Replace the column of the variable you want, here the first, by the right side; replacing the other column gives the other variable.",
          "由克拉默法则，每个基本变量的值等于把基中该变量的列换成右端后的行列式，除以基的行列式。数据都是整数时，分子是整数。当基的行列式是 $\\pm 1$ 且右端是整数时，每个角点都是整数点，所以不需要取整。\n\n基 $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，右端 $\\begin{pmatrix} 7 \\\\ 4 \\end{pmatrix}$，行列式是 $2(1) - 1(1) = 1$，第一个分子是 $7(1) - 1(4) = 3$，所以第一个值是 $\\frac{3}{1} = 3$。\n\n检验：第二个值是 $4 - 3 = 1$，而 $2(3) + 1 = 7$。\n\n> **注意。** 要把所求变量的列（这里是第一列）换成右端；换另一列得到的是另一个变量。",
        ],
        (rng) => {
          const [p, q, r, s] = rng.pick([
            [2, 1, 1, 1],
            [3, 2, 1, 1],
            [3, 1, 2, 1],
            [2, 3, 1, 2],
            [1, 2, 1, 1],
            [1, 3, 1, 2],
            [2, 1, 3, 1],
            [3, 2, 4, 3],
          ] as const);
          const det = p * s - q * r;
          const [x1, x2] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
          const [b1, b2] = [p * x1 + q * x2, r * x1 + s * x2];
          const numerator = b1 * s - q * b2;
          return solved(
            [
              `A basis has the matrix $\\begin{pmatrix} ${p} & ${q} \\\\ ${r} & ${s} \\end{pmatrix}$ and the right side is $\\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}$. By Cramer's rule, what is the value of the first basic variable?`,
              `基的矩阵是 $\\begin{pmatrix} ${p} & ${q} \\\\ ${r} & ${s} \\end{pmatrix}$，右端是 $\\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}$。由克拉默法则，第一个基本变量的值是多少？`,
            ],
            x1,
            [
              [x2, "That is the second basic variable, from replacing the second column.", "这是第二个基本变量，来自替换第二列。"],
              [
                -x1,
                `That has the wrong sign; the numerator ${numerator} divided by the determinant ${det} is ${x1}.`,
                `这个符号错了；分子 ${numerator} 除以行列式 ${det} 得 ${x1}。`,
              ],
              [
                x1 + x2,
                "That adds the two basic variables; the question asks for the first alone.",
                "这把两个基本变量相加了；题目只问第一个。",
              ],
            ],
            [
              [
                ["Find the determinant", "求行列式"],
                [
                  `The determinant of the basis is $${p}(${s}) - ${q}(${r}) = ${det}$.`,
                  `基的行列式是 $${p}(${s}) - ${q}(${r}) = ${det}$。`,
                ],
              ],
              [
                ["Replace the first column", "替换第一列"],
                [
                  `With the right side in the first column the numerator is $${b1}(${s}) - ${q}(${b2}) = ${numerator}$, so the value is $\\frac{${numerator}}{${det}} = ${x1}$.`,
                  `把右端放进第一列，分子是 $${b1}(${s}) - ${q}(${b2}) = ${numerator}$，所以这个值是 $\\frac{${numerator}}{${det}} = ${x1}$。`,
                ],
              ],
            ],
            [
              `The value ${x1} is a whole number because the determinant is $${det}$, and with the second value ${x2} the first row gives $${p}(${x1}) + ${q}(${x2}) = ${b1}$.`,
              `值 ${x1} 是整数，因为行列式是 $${det}$；再取第二个值 ${x2}，第一行给出 $${p}(${x1}) + ${q}(${x2}) = ${b1}$。`,
            ],
          );
        },
      ),
      {
        ...point(
          "recognizing-network-matrices",
          ["Recognizing network matrices", "识别网络矩阵"],
          [
            "Node-arc incidence matrices of directed graphs are totally unimodular, and so are bipartite incidence matrices. That is why transportation, assignment and flow problems give whole number answers from plain linear programs.\n\nIn a transportation problem each variable appears once in a supply row and once in a demand row, with coefficient 1, so the matrix is a bipartite incidence matrix and its corners are whole numbers.\n\nCheck: each column of that matrix has exactly two entries equal to 1, one in each part.\n\n> **Watch out.** Whole corners need whole supplies and demands too; the matrix alone is not enough.",
            "有向图的结点-弧关联矩阵是全单模的，二部图的关联矩阵也是。这就是运输、指派和流问题用普通线性规划就给出整数解的原因。\n\n在运输问题中，每个变量在一个供应行和一个需求行中各出现一次，系数为 1，所以矩阵是二部图的关联矩阵，它的角点是整数。\n\n检验：这个矩阵的每一列恰有两个等于 1 的元素，两部分各一个。\n\n> **注意。** 角点是整数还要求供应量和需求量是整数；只有矩阵还不够。",
          ],
          (rng) => {
            const n = rng.int(3, 40);
            const family = rng.int(0, 2);
            const name: [string, string] =
              family === 0
                ? [`a transportation problem with ${n} sources`, `有 ${n} 个产地的运输问题`]
                : family === 1
                  ? [`an assignment problem with ${n} workers`, `有 ${n} 名工人的指派问题`]
                  : [`a maximum flow problem with ${n} nodes`, `有 ${n} 个结点的最大流问题`];
            const right: [string, string] = [
              "Its corners are whole numbers, so the plain relaxation is enough",
              "它的角点是整数，所以普通松弛就够了",
            ];
            const wrong: Slip[] = [
              [
                ["Its corners are fractional, so branching is required", "它的角点是分数，所以需要分支"],
                "A network matrix is totally unimodular, so with whole data every corner is whole and no branching is needed.",
                "网络矩阵是全单模的，数据是整数时每个角点都是整数，不需要分支。",
              ],
              [
                ["It has no optimal corner at all", "它根本没有最优角点"],
                "A feasible bounded linear program always has an optimal corner.",
                "可行且有界的线性规划总有最优角点。",
              ],
              [
                ["Its dual always fails to exist", "它的对偶总是不存在"],
                "Every linear program has a dual; for a network problem it is the problem of node potentials.",
                "每个线性规划都有对偶；网络问题的对偶就是结点势的问题。",
              ],
            ];
            return chosen(
              rng,
              [
                `With whole number data, what do we know about solving ${name[0]} as a linear program?`,
                `数据是整数时，关于把${name[1]}当作线性规划求解，我们知道什么？`,
              ],
              right,
              wrong,
              [
                [
                  ["Name the matrix", "确定矩阵"],
                  [
                    "Its constraint matrix is a network matrix: an incidence matrix of a directed or bipartite graph.",
                    "它的约束矩阵是网络矩阵：有向图或二部图的关联矩阵。",
                  ],
                ],
                [
                  ["Apply Cramer's rule", "应用克拉默法则"],
                  [
                    "That matrix is totally unimodular, so every basis has determinant $\\pm 1$ and every corner is whole.",
                    "这个矩阵是全单模的，所以每个基的行列式都是 $\\pm 1$，每个角点都是整数。",
                  ],
                ],
              ],
              [
                "The simplex method stops at a corner, so the optimum it returns is already a whole number plan.",
                "单纯形法停在角点上，所以它给出的最优解已经是整数方案。",
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["total-unimodularity#recognizing-network-matrices"],
      },
    ],
  ),
  [
    "The basis $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ has determinant $2(1) - 1(1) = 1$. With the right side $\\begin{pmatrix} 7 \\\\ 4 \\end{pmatrix}$, Cramer's rule gives $x_1 = 7(1) - 1(4) = 3$ and $x_2 = 2(4) - 7(1) = 1$, both whole.",
    "基 $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ 的行列式是 $2(1) - 1(1) = 1$。右端为 $\\begin{pmatrix} 7 \\\\ 4 \\end{pmatrix}$ 时，克拉默法则给出 $x_1 = 7(1) - 1(4) = 3$，$x_2 = 2(4) - 7(1) = 1$，都是整数。",
  ],
  ["$2(3) + 1 = 7$ and $3 + 1 = 4$.", "$2(3) + 1 = 7$，$3 + 1 = 4$。"],
  [
    "compute the determinant of a submatrix, find a whole number corner by Cramer's rule, and recognize the network matrices.",
    "计算子矩阵的行列式，用克拉默法则求整数角点，并识别网络矩阵。",
  ],
);

const goal = lesson(
  topic(
    "goal-programming",
    ["Goal Programming", "目标规划"],
    ["Balance several competing targets using deviation variables and priorities.", "用偏差变量和优先级平衡多个相互竞争的目标。"],
    ["linearizing-absolute-values-and-minimax"],
    [],
    [
      point(
        "deviation-variables",
        ["Deviation variables", "偏差变量"],
        [
          "A goal is written as $f(x) + d^{-} - d^{+} = t$, where $d^{-}$ measures a shortfall and $d^{+}$ measures an excess. At any plan, at most one of the two is positive, since they measure opposite failures.\n\nWith target 100 and an achieved 92, the shortfall is $d^{-} = 8$ and the excess is $d^{+} = 0$.\n\nCheck: $92 + 8 - 0 = 100$.\n\n> **Watch out.** A deviation variable is never negative: a plan above the target has no shortfall, not a negative one.",
          "目标写成 $f(x) + d^{-} - d^{+} = t$，其中 $d^{-}$ 衡量不足，$d^{+}$ 衡量超出。在任何方案中两者至多一个为正，因为它们衡量相反的偏离。\n\n目标为 100，达到 92 时，不足 $d^{-} = 8$，超出 $d^{+} = 0$。\n\n检验：$92 + 8 - 0 = 100$。\n\n> **注意。** 偏差变量永远不为负：超过目标的方案没有不足，而不是不足为负。",
        ],
        (rng) => {
          const t = rng.int(20, 200);
          const f = t + rng.int(-30, 30);
          const under = rng.bool();
          const short = Math.max(t - f, 0);
          const excess = Math.max(f - t, 0);
          return solved(
            [
              `A goal has target ${t}, and a plan achieves ${f}. What is the ${under ? "shortfall $d^{-}$" : "excess $d^{+}$"}?`,
              `目标值是 ${t}，方案达到 ${f}。${under ? "不足 $d^{-}$" : "超出 $d^{+}$"} 是多少？`,
            ],
            under ? short : excess,
            under
              ? [
                  [excess, "That is the excess $d^{+}$, the other deviation.", "这是超出 $d^{+}$，另一个偏差。"],
                  [t - f, "That is the signed difference; a deviation variable is never negative.", "这是带符号的差；偏差变量永远不为负。"],
                  [f, "That is the achieved value, not its distance from the target.", "这是达到的值，不是它与目标的距离。"],
                ]
              : [
                  [short, "That is the shortfall $d^{-}$, the other deviation.", "这是不足 $d^{-}$，另一个偏差。"],
                  [f - t, "That is the signed difference; a deviation variable is never negative.", "这是带符号的差；偏差变量永远不为负。"],
                  [t, "That is the target, not the distance from it.", "这是目标值，不是与它的距离。"],
                ],
            [
              [
                ["Compare with the target", "与目标比较"],
                [
                  `The plan achieves ${f} against the target ${t}, so it is ${f < t ? "below" : f > t ? "above" : "exactly on"} the target.`,
                  `方案达到 ${f}，目标是 ${t}，所以它${f < t ? "低于" : f > t ? "高于" : "正好等于"}目标。`,
                ],
              ],
              [
                ["Read the deviations", "读出偏差"],
                [
                  `The shortfall is $d^{-} = ${short}$ and the excess is $d^{+} = ${excess}$, neither negative.`,
                  `不足是 $d^{-} = ${short}$，超出是 $d^{+} = ${excess}$，都不为负。`,
                ],
              ],
            ],
            [
              `With these values, $${f} + ${short} - ${excess} = ${t}$, the target, and at most one deviation is positive.`,
              `代入这些值，$${f} + ${short} - ${excess} = ${t}$，正是目标，而且至多一个偏差为正。`,
            ],
          );
        },
      ),
      point(
        "a-weighted-penalty",
        ["A weighted penalty", "加权罚分"],
        [
          "A weighted goal program minimizes a sum of deviations, each multiplied by a penalty. Only the unwanted direction of each goal is charged, so exceeding a profit target costs nothing while falling short does.\n\nWith a profit target of 100 at penalty 3, an overtime limit of 40 at penalty 2, a profit of 90 and overtime of 45, the penalty is $3(10) + 2(5) = 40$.\n\nCheck: the profit falls 10 short and the overtime is 5 over, both unwanted directions.\n\n> **Watch out.** A profit above the target or overtime below the limit is not charged.",
          "加权目标规划最小化偏差之和，每个偏差乘一个罚数。每个目标只对不希望的方向收费，所以超过利润目标不花钱，而不足才收费。\n\n利润目标 100，罚数 3；加班上限 40，罚数 2；利润 90，加班 45 时，罚分是 $3(10) + 2(5) = 40$。\n\n检验：利润不足 10，加班超出 5，都是不希望的方向。\n\n> **注意。** 利润超过目标或加班低于上限都不收费。",
        ],
        (rng) => {
          const [t1, t2] = [rng.int(50, 200), rng.int(20, 90)];
          const [f1, f2] = [t1 + rng.int(-25, 25), t2 + rng.int(-20, 20)];
          const [w1, w2] = [rng.int(1, 9), rng.int(1, 9)];
          const short = Math.max(t1 - f1, 0);
          const over = Math.max(f2 - t2, 0);
          const pen = w1 * short + w2 * over;
          return solved(
            [
              `Profit should reach ${t1} and overtime should not exceed ${t2}, with penalties ${w1} and ${w2} per unit. A plan has profit ${f1} and overtime ${f2}. What is the total penalty?`,
              `利润应达到 ${t1}，加班不应超过 ${t2}，每单位罚数是 ${w1} 和 ${w2}。方案的利润是 ${f1}，加班是 ${f2}。总罚分是多少？`,
            ],
            pen,
            [
              [
                w1 * Math.abs(t1 - f1) + w2 * Math.abs(f2 - t2),
                "That charges both directions; only a profit shortfall and an overtime excess are charged.",
                "这对两个方向都收费；只对利润不足和加班超出收费。",
              ],
              [
                w1 * Math.max(f1 - t1, 0) + w2 * Math.max(t2 - f2, 0),
                "That charges the wanted directions, a profit excess and unused overtime.",
                "这对希望的方向收费，即利润超出和未用的加班。",
              ],
              [short + over, "That adds the deviations without their penalties.", "这把偏差相加，没有乘罚数。"],
            ],
            [
              [
                ["Find the unwanted deviations", "找不希望的偏差"],
                [
                  `The profit shortfall is $\\max(${t1} - ${f1}, 0) = ${short}$ and the overtime excess is $\\max(${f2} - ${t2}, 0) = ${over}$.`,
                  `利润不足是 $\\max(${t1} - ${f1}, 0) = ${short}$，加班超出是 $\\max(${f2} - ${t2}, 0) = ${over}$。`,
                ],
              ],
              [
                ["Weight them", "加权"],
                [
                  `Multiply each by its penalty and add: $${w1}(${short}) + ${w2}(${over}) = ${pen}$.`,
                  `各乘自己的罚数再相加：$${w1}(${short}) + ${w2}(${over}) = ${pen}$。`,
                ],
              ],
            ],
            [
              `The penalty ${pen} is 0 exactly when the profit reaches ${t1} and the overtime stays within ${t2}.`,
              `罚分 ${pen} 为 0 当且仅当利润达到 ${t1} 且加班不超过 ${t2}。`,
            ],
          );
        },
      ),
      point(
        "priorities-come-first",
        ["Priorities come first", "优先级优先"],
        [
          "In preemptive goal programming, a higher priority goal is never traded for a lower one. Plans are compared first on the top goal's deviation, and only ties are settled by the next goal in the list.\n\nPlan P has deviations 3 and 50 and plan Q has 5 and 0. With the first goal on top, P is better, since $3 < 5$, even though its second deviation is far larger.\n\nCheck: the second goal would matter only if the first deviations were equal, and $3 \\ne 5$.\n\n> **Watch out.** Do not add the deviations: a priority order is not a weighted sum.",
          "在抢占式目标规划中，高优先级目标绝不用来交换低优先级目标。方案先比较最高目标的偏差，只有相同时才由下一个目标决定。\n\n方案 P 的偏差是 3 和 50，方案 Q 的是 5 和 0。第一个目标优先时，P 更好，因为 $3 < 5$，尽管它的第二个偏差大得多。\n\n检验：只有第一个偏差相等时第二个目标才起作用，而 $3 \\ne 5$。\n\n> **注意。** 不要把偏差相加：优先级顺序不是加权和。",
        ],
        (rng) => {
          const a1 = rng.int(1, 30);
          const b1 = a1 + rng.int(1, 20);
          const a2 = rng.int(20, 60);
          const b2 = rng.int(0, 19);
          const flip = rng.bool();
          const [p1, p2, q1, q2] = flip ? [b1, b2, a1, a2] : [a1, a2, b1, b2];
          const good: [string, string] = [flip ? "Plan Q" : "Plan P", flip ? "方案 Q" : "方案 P"];
          const bad: [string, string] = [flip ? "Plan P" : "Plan Q", flip ? "方案 P" : "方案 Q"];
          return chosen(
            rng,
            [
              `Plan P has deviations ${p1} on the first goal and ${p2} on the second. Plan Q has ${q1} and ${q2}. The first goal has strict priority. Which plan is better?`,
              `方案 P 在第一个目标上偏差 ${p1}，在第二个目标上偏差 ${p2}。方案 Q 分别是 ${q1} 和 ${q2}。第一个目标有严格优先级。哪个方案更好？`,
            ],
            good,
            [
              [
                bad,
                `Its first deviation ${b1} is larger than ${a1}, and a better second goal cannot make up for that.`,
                `它的第一个偏差 ${b1} 大于 ${a1}，第二个目标再好也弥补不了。`,
              ],
              [
                ["They are tied", "它们相同"],
                `The first deviations ${a1} and ${b1} differ, so there is no tie.`,
                `第一个偏差 ${a1} 和 ${b1} 不同，所以不相同。`,
              ],
              [
                ["It depends on the total of the deviations", "取决于偏差的总和"],
                "With strict priority the deviations are never added; the first goal is compared alone.",
                "有严格优先级时偏差从不相加；先单独比较第一个目标。",
              ],
            ],
            [
              [
                ["Compare the first goal", "比较第一个目标"],
                [
                  `On the first goal the deviations are ${p1} for P and ${q1} for Q, and the smaller is ${a1}.`,
                  `在第一个目标上，P 的偏差是 ${p1}，Q 的是 ${q1}，较小的是 ${a1}。`,
                ],
              ],
              [
                ["Decide", "作出判断"],
                [
                  `The first deviations differ, so the plan with ${a1} on the first goal wins, whatever the second goal says.`,
                  `第一个偏差不同，所以第一个目标偏差为 ${a1} 的方案胜出，与第二个目标无关。`,
                ],
              ],
            ],
            [
              `The second deviations ${a2} and ${b2} would matter only if the first deviations were equal, and $${a1} \\ne ${b1}$.`,
              `只有第一个偏差相等时，第二个偏差 ${a2} 和 ${b2} 才起作用，而 $${a1} \\ne ${b1}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A profit goal of 100 is written $f(x) + d^{-} - d^{+} = 100$. A plan with profit 92 has $d^{-} = 8$ and $d^{+} = 0$, and at penalty 3 per unit its charge is $3(8) = 24$.",
    "利润目标 100 写成 $f(x) + d^{-} - d^{+} = 100$。利润为 92 的方案有 $d^{-} = 8$，$d^{+} = 0$，每单位罚数为 3 时，收费是 $3(8) = 24$。",
  ],
  ["$92 + 8 - 0 = 100$.", "$92 + 8 - 0 = 100$。"],
  [
    "read the deviation variables of a goal, total a weighted penalty, and compare plans under strict priorities.",
    "读出目标的偏差变量，计算加权罚分，并在严格优先级下比较方案。",
  ],
);

const gamesLp = lesson(
  topic(
    "solving-matrix-games-by-linear-programming",
    ["Solving Matrix Games by Linear Programming", "用线性规划解矩阵博弈"],
    [
      "Turn a mixed strategy search into a linear program, and read the game value from it.",
      "把混合策略的搜索变成线性规划，并从中读出博弈的值。",
    ],
    ["matrix-games", "strong-duality-and-complementary-slackness"],
    [],
    [
      point(
        "a-mixed-strategy-for-two-by-two",
        ["A mixed strategy for two by two", "二乘二的混合策略"],
        [
          "For the row player in $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ with no saddle point, the best mix makes both columns pay the same. This gives the probability $\\frac{d - c}{a + d - b - c}$ for the first row.\n\nIn $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ the denominator is $6 + 5 - 2 - 1 = 8$, so row 1 gets $\\frac{5 - 1}{8} = \\frac{1}{2}$.\n\nCheck: with $\\frac{1}{2}$ on each row, column 1 pays $\\frac{6 + 1}{2} = \\frac{7}{2}$ and column 2 pays $\\frac{2 + 5}{2} = \\frac{7}{2}$.\n\n> **Watch out.** Row 1's probability uses $d - c$, the entries of row 2; $a - b$ gives the probability of row 2.",
          "对没有鞍点的 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 中的行玩家，最佳混合使两列的收益相同。这给出第一行的概率 $\\frac{d - c}{a + d - b - c}$。\n\n在 $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ 中，分母是 $6 + 5 - 2 - 1 = 8$，所以第 1 行的概率是 $\\frac{5 - 1}{8} = \\frac{1}{2}$。\n\n检验：两行各取 $\\frac{1}{2}$ 时，第 1 列收益 $\\frac{6 + 1}{2} = \\frac{7}{2}$，第 2 列收益 $\\frac{2 + 5}{2} = \\frac{7}{2}$。\n\n> **注意。** 第 1 行的概率用 $d - c$，即第 2 行的元素；$a - b$ 给出的是第 2 行的概率。",
        ],
        (rng) => {
          const [a, d] = [rng.int(6, 20), rng.int(6, 20)];
          const [b, c] = [rng.int(0, 5), rng.int(0, 5)];
          const den = a + d - b - c;
          const p = Q.of(d - c, den);
          return solved(
            [
              `In the game $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$, with what probability should the row player choose row 1?`,
              `在博弈 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 中，行玩家应以什么概率选第 1 行？`,
            ],
            p,
            [
              [Q.of(a - b, den), "That is the probability of row 2.", "这是第 2 行的概率。"],
              [
                Q.of(a, a + d),
                "That uses only the diagonal entries and leaves out $b$ and $c$.",
                "这只用了对角线元素，漏掉了 $b$ 和 $c$。",
              ],
              [Q.of(d - b, den), "That is the column player's probability of column 1.", "这是列玩家选第 1 列的概率。"],
            ],
            [
              [
                ["Find the denominator", "求分母"],
                [`$a + d - b - c = ${a} + ${d} - ${b} - ${c} = ${den}$.`, `$a + d - b - c = ${a} + ${d} - ${b} - ${c} = ${den}$。`],
              ],
              [
                ["Equalize the columns", "使两列相等"],
                [
                  `Making the two columns pay the same gives row 1 the probability $\\frac{${d} - ${c}}{${den}} = ${p.toLatex()}$.`,
                  `使两列收益相同，得第 1 行的概率 $\\frac{${d} - ${c}}{${den}} = ${p.toLatex()}$。`,
                ],
              ],
            ],
            [
              `With row 1 at $${p.toLatex()}$, column 1 pays $${Q.of(a * (d - c) + c * (a - b), den).toLatex()}$ and so does column 2, since $${a}(${d - c}) + ${c}(${a - b}) = ${b}(${d - c}) + ${d}(${a - b})$.`,
              `第 1 行取 $${p.toLatex()}$ 时，第 1 列收益 $${Q.of(a * (d - c) + c * (a - b), den).toLatex()}$，第 2 列也一样，因为 $${a}(${d - c}) + ${c}(${a - b}) = ${b}(${d - c}) + ${d}(${a - b})$。`,
            ],
          );
        },
      ),
      point(
        "the-value-of-the-game",
        ["The value of the game", "博弈的值"],
        [
          "Strong duality shows that the row player's best guarantee equals the column player's best guarantee, which is the minimax theorem. For a two by two game without a saddle point, the value is $\\frac{ad - bc}{a + d - b - c}$.\n\nIn $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ the value is $\\frac{6(5) - 2(1)}{8} = \\frac{28}{8} = \\frac{7}{2}$.\n\nCheck: the value lies between the row minima 2 and 1 and the column maxima 6 and 5, as it must, since $2 \\le \\frac{7}{2} \\le 5$.\n\n> **Watch out.** The formula holds only without a saddle point; with one, the value is the saddle entry.",
          "强对偶性说明行玩家的最佳保证等于列玩家的最佳保证，这就是极小极大定理。对没有鞍点的二乘二博弈，值是 $\\frac{ad - bc}{a + d - b - c}$。\n\n在 $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ 中，值是 $\\frac{6(5) - 2(1)}{8} = \\frac{28}{8} = \\frac{7}{2}$。\n\n检验：值必须在行最小值 2、1 中较大者和列最大值 6、5 中较小者之间，而 $2 \\le \\frac{7}{2} \\le 5$。\n\n> **注意。** 这个公式只在没有鞍点时成立；有鞍点时，值就是鞍点的元素。",
        ],
        (rng) => {
          const [a, d] = [rng.int(6, 20), rng.int(6, 20)];
          const [b, c] = [rng.int(0, 5), rng.int(0, 5)];
          const den = a + d - b - c;
          const value = Q.of(a * d - b * c, den);
          return solved(
            [
              `What is the value of the game $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$?`,
              `博弈 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的值是多少？`,
            ],
            value,
            [
              [
                Q.of(a * d + b * c, den),
                "That adds $bc$ in the numerator; the formula subtracts it.",
                "这在分子中加上了 $bc$；公式要减去它。",
              ],
              [
                Q.of(a + d, 2),
                "That averages the diagonal entries, which ignores the other two payoffs.",
                "这是对角线元素的平均，忽略了另外两个收益。",
              ],
              [Q.of(a * d - b * c, a + d), "That leaves $b$ and $c$ out of the denominator.", "这在分母中漏掉了 $b$ 和 $c$。"],
            ],
            [
              [
                ["Rule out a saddle point", "排除鞍点"],
                [
                  `The diagonal entries ${a} and ${d} are large and the others ${b} and ${c} small, so no entry is both a row minimum and a column maximum.`,
                  `对角线上的 ${a} 和 ${d} 大，其余的 ${b} 和 ${c} 小，所以没有元素既是行最小又是列最大。`,
                ],
              ],
              [
                ["Apply the formula", "代入公式"],
                [
                  `$\\frac{ad - bc}{a + d - b - c} = \\frac{${a}(${d}) - ${b}(${c})}{${den}} = ${value.toLatex()}$.`,
                  `$\\frac{ad - bc}{a + d - b - c} = \\frac{${a}(${d}) - ${b}(${c})}{${den}} = ${value.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The value $${value.toLatex()}$ lies between the larger row minimum ${Math.max(b, c)} and the smaller column maximum ${Math.min(a, d)}.`,
              `值 $${value.toLatex()}$ 在较大的行最小值 ${Math.max(b, c)} 和较小的列最大值 ${Math.min(a, d)} 之间。`,
            ],
          );
        },
      ),
      point(
        "shifting-and-rescaling",
        ["Shifting and rescaling", "平移和缩放"],
        [
          "To set up the program, add a constant so all payoffs are positive, which raises the value by that constant. Then with $x_i = \\frac{p_i}{v}$, we minimize $\\sum x_i$, whose optimum is $\\frac{1}{v}$.\n\nIf 4 is added to every payoff and the optimal $\\sum x_i$ is $\\frac{1}{6}$, the shifted game has value 6 and the original game has value $6 - 4 = 2$.\n\nCheck: adding 4 back to 2 gives 6, and $\\frac{1}{6}$ is its reciprocal.\n\n> **Watch out.** Take the reciprocal first and then undo the shift; the shift is subtracted, not added.",
          "建立规划时，加一个常数使所有收益为正，值也增加这个常数。然后令 $x_i = \\frac{p_i}{v}$，最小化 $\\sum x_i$，它的最优值是 $\\frac{1}{v}$。\n\n若每个收益加 4，最优 $\\sum x_i$ 是 $\\frac{1}{6}$，平移后的博弈值为 6，原博弈的值是 $6 - 4 = 2$。\n\n检验：2 加回 4 得 6，而 $\\frac{1}{6}$ 正是它的倒数。\n\n> **注意。** 先取倒数再撤销平移；平移量要减去，而不是加上。",
        ],
        (rng) => {
          const v = rng.int(2, 30);
          const opt = Q.of(1, v);
          const shift = rng.int(1, 20);
          const k = shift === v ? shift + 1 : shift;
          return solved(
            [
              `After adding ${k} to every payoff, the program's optimal $\\sum x_i$ is $${opt.toLatex()}$. What is the value of the original game?`,
              `每个收益加 ${k} 后，规划的最优 $\\sum x_i$ 是 $${opt.toLatex()}$。原博弈的值是多少？`,
            ],
            v - k,
            [
              [
                v,
                `That is the value of the shifted game; the shift ${k} must still be subtracted.`,
                `这是平移后博弈的值；还要减去平移量 ${k}。`,
              ],
              [v + k, "That adds the shift instead of subtracting it.", "这加上了平移量，而不是减去它。"],
              [k, "That is the shift itself, not the value.", "这是平移量本身，不是值。"],
            ],
            [
              [
                ["Take the reciprocal", "取倒数"],
                [
                  `The optimum $${opt.toLatex()}$ is $\\frac{1}{v}$, so the shifted game has value ${v}.`,
                  `最优值 $${opt.toLatex()}$ 是 $\\frac{1}{v}$，所以平移后的博弈值为 ${v}。`,
                ],
              ],
              [
                ["Undo the shift", "撤销平移"],
                [`Subtract the ${k} that was added: $${v} - ${k} = ${v - k}$.`, `减去加上的 ${k}：$${v} - ${k} = ${v - k}$。`],
              ],
            ],
            [
              `Adding ${k} back to ${v - k} gives ${v}, whose reciprocal is $${opt.toLatex()}$.`,
              `${v - k} 加回 ${k} 得 ${v}，它的倒数是 $${opt.toLatex()}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "In the game $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ there is no saddle point. The row player mixes the rows half and half, and the value is $\\frac{6(5) - 2(1)}{6 + 5 - 2 - 1} = \\frac{7}{2}$.",
    "博弈 $\\begin{pmatrix} 6 & 2 \\\\ 1 & 5 \\end{pmatrix}$ 没有鞍点。行玩家各以一半的概率选两行，值是 $\\frac{6(5) - 2(1)}{6 + 5 - 2 - 1} = \\frac{7}{2}$。",
  ],
  [
    "Column 1 pays $\\frac{6 + 1}{2} = \\frac{7}{2}$ and column 2 pays $\\frac{2 + 5}{2} = \\frac{7}{2}$.",
    "第 1 列收益 $\\frac{6 + 1}{2} = \\frac{7}{2}$，第 2 列收益 $\\frac{2 + 5}{2} = \\frac{7}{2}$。",
  ],
  [
    "find the row player's mixed strategy, compute the value of a game, and undo the shift used to set up the program.",
    "求行玩家的混合策略，计算博弈的值，并撤销建立规划时用的平移。",
  ],
);

const columnGeneration = lesson(
  topic(
    "column-generation",
    ["Column Generation", "列生成"],
    [
      "Solve huge programs by creating only the columns that are needed, as in cutting stock.",
      "只产生需要的列来解巨大的规划，例如下料问题。",
    ],
    ["the-revised-simplex-method"],
    [],
    [
      point(
        "a-lower-bound-on-rolls",
        ["A lower bound on rolls", "卷数的下界"],
        [
          "In cutting stock, orders must be cut from rolls of fixed width, and there may be an enormous number of cutting patterns. The total width ordered divided by the roll width gives a simple lower bound on the number of rolls.\n\nWith rolls of width 10 and orders of 7 pieces of width 3 and 4 pieces of width 4, the total width is $3(7) + 4(4) = 37$, so at least $\\lceil 3.7 \\rceil = 4$ rolls are needed.\n\nCheck: 3 rolls give only $3(10) = 30 < 37$.\n\n> **Watch out.** Round up, not down: part of a roll still needs a whole roll.",
          "在下料问题中，订单要从固定宽度的卷上切割，切割方式的数量可能极大。订购的总宽度除以卷宽，给出卷数的一个简单下界。\n\n卷宽 10，订单是 7 件宽 3 和 4 件宽 4，总宽度是 $3(7) + 4(4) = 37$，所以至少需要 $\\lceil 3.7 \\rceil = 4$ 卷。\n\n检验：3 卷只有 $3(10) = 30 < 37$。\n\n> **注意。** 要向上取整而不是向下：用到一卷的一部分也要用一整卷。",
        ],
        (rng) => {
          const big = rng.pick([10, 12, 15, 20, 25]);
          const w = rng.sample([2, 3, 4, 5, 6, 7], 2) as [number, number];
          const n = [rng.int(5, 40), rng.int(5, 40)] as [number, number];
          const total = w[0] * n[0] + w[1] * n[1];
          const rolls = Math.ceil(total / big);
          return solved(
            [
              `Rolls have width ${big}. Orders are ${n[0]} pieces of width ${w[0]} and ${n[1]} pieces of width ${w[1]}. What is the smallest whole number of rolls allowed by total width?`,
              `卷宽是 ${big}。订单是 ${n[0]} 件宽 ${w[0]} 和 ${n[1]} 件宽 ${w[1]}。按总宽度，卷数的最小整数是多少？`,
            ],
            rolls,
            [
              [
                rolls + 1,
                `That is one roll more than needed by total width; ${rolls} rolls already hold ${rolls * big}.`,
                `这比按总宽度所需的多一卷；${rolls} 卷已经有 ${rolls * big}。`,
              ],
              [
                Math.floor(total / big),
                "That rounds down, but part of a roll still needs a whole roll.",
                "这向下取整了，但用到一卷的一部分也要用一整卷。",
              ],
              [n[0] + n[1], "That counts the pieces, not the rolls.", "这数的是件数，不是卷数。"],
            ],
            [
              [
                ["Total the width", "求总宽度"],
                [
                  `The total width is $${w[0]}(${n[0]}) + ${w[1]}(${n[1]}) = ${total}$.`,
                  `总宽度是 $${w[0]}(${n[0]}) + ${w[1]}(${n[1]}) = ${total}$。`,
                ],
              ],
              [
                ["Divide and round up", "相除并向上取整"],
                [
                  `Dividing ${total} by the roll width ${big} and rounding up gives ${rolls}.`,
                  `${total} 除以卷宽 ${big} 再向上取整得 ${rolls}。`,
                ],
              ],
            ],
            [
              `${rolls} rolls give $${rolls}(${big}) = ${rolls * big}$, at least ${total}, while ${rolls - 1} rolls give only ${(rolls - 1) * big}.`,
              `${rolls} 卷共有 $${rolls}(${big}) = ${rolls * big}$，不少于 ${total}，而 ${rolls - 1} 卷只有 ${(rolls - 1) * big}。`,
            ],
          );
        },
      ),
      point(
        "pricing-a-pattern",
        ["Pricing a pattern", "为切割方式定价"],
        [
          "Rather than listing all patterns, we ask whether any pattern has negative reduced cost. A pattern uses one roll, at a cost of 1, and earns the dual value of each piece, so its reduced cost is $1 - \\sum y_i a_i$.\n\nWith dual values $\\frac{1}{4}$ and $\\frac{1}{2}$, a pattern of 2 and 1 pieces earns $2\\left(\\frac{1}{4}\\right) + \\frac{1}{2} = 1$, so its reduced cost is $1 - 1 = 0$.\n\nCheck: a reduced cost of 0 means the pattern neither helps nor hurts the current plan.\n\n> **Watch out.** Multiply each dual value by the number of pieces of that width before adding.",
          "不列出所有切割方式，而是问是否有检验数为负的切割方式。一种切割方式用一卷，成本是 1，并赚取每件的对偶值，所以检验数是 $1 - \\sum y_i a_i$。\n\n对偶值为 $\\frac{1}{4}$ 和 $\\frac{1}{2}$ 时，切 2 件和 1 件的方式赚取 $2\\left(\\frac{1}{4}\\right) + \\frac{1}{2} = 1$，所以检验数是 $1 - 1 = 0$。\n\n检验：检验数为 0 表示这种切割方式对当前方案既无帮助也无害处。\n\n> **注意。** 相加之前要把每个对偶值乘该宽度的件数。",
        ],
        (rng) => {
          const den = rng.pick([4, 5, 6, 8, 10, 12, 16, 20]);
          const [y1, y2] = rng.sample(
            Array.from({ length: den - 1 }, (_, i) => i + 1),
            2,
          ) as [number, number];
          const [a1, a2] = [rng.int(1, 4), rng.int(1, 4)];
          const earned = Q.of(y1 * a1 + y2 * a2, den);
          const reduced = Q.of(den - y1 * a1 - y2 * a2, den);
          return solved(
            [
              `With dual values $${Q.of(y1, den).toLatex()}$ and $${Q.of(y2, den).toLatex()}$, a pattern cuts ${a1} and ${a2} pieces of the two widths. What is its reduced cost?`,
              `对偶值是 $${Q.of(y1, den).toLatex()}$ 和 $${Q.of(y2, den).toLatex()}$，一种切割方式切两种宽度各 ${a1} 和 ${a2} 件。它的检验数是多少？`,
            ],
            reduced,
            [
              [
                earned,
                "That is what the pattern earns; subtract it from the cost 1 of the roll.",
                "这是这种切割方式赚取的值；要从一卷的成本 1 中减去它。",
              ],
              [
                Q.of(den + y1 * a1 + y2 * a2, den),
                "That adds the earnings to the cost instead of subtracting them.",
                "这把赚取的值加到成本上，而不是减去。",
              ],
              [
                Q.of(den - y1 - y2, den),
                "That counts one piece of each width, ignoring the numbers of pieces.",
                "这每种宽度只算一件，忽略了件数。",
              ],
            ],
            [
              [
                ["Total the earnings", "求赚取的总值"],
                [
                  `The pattern earns $${a1}\\left(${Q.of(y1, den).toLatex()}\\right) + ${a2}\\left(${Q.of(y2, den).toLatex()}\\right) = ${earned.toLatex()}$.`,
                  `这种切割方式赚取 $${a1}\\left(${Q.of(y1, den).toLatex()}\\right) + ${a2}\\left(${Q.of(y2, den).toLatex()}\\right) = ${earned.toLatex()}$。`,
                ],
              ],
              [
                ["Subtract from the cost", "从成本中减去"],
                [
                  `The roll costs 1, so the reduced cost is $1 - ${earned.toLatex()} = ${reduced.toLatex()}$.`,
                  `一卷成本是 1，所以检验数是 $1 - ${earned.toLatex()} = ${reduced.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The reduced cost and the earnings add to $${reduced.toLatex()} + ${earned.toLatex()} = 1$, the cost of one roll.`,
              `检验数与赚取的值之和是 $${reduced.toLatex()} + ${earned.toLatex()} = 1$，正是一卷的成本。`,
            ],
          );
        },
      ),
      point(
        "the-best-new-pattern",
        ["The best new pattern", "最好的新切割方式"],
        [
          "Finding the most attractive pattern is itself a knapsack problem: maximize the total dual value of the pieces, subject to fitting in the roll. If the best value is at most 1, the current solution is optimal.\n\nWith a roll of width 10 and pieces of width 3 and 4 worth 5 and 7 hundredths, the counts $(2, 1)$ give $2(5) + 7 = 17$, the counts $(0, 2)$ give 14 and $(3, 0)$ give 15, so the best is 17.\n\nCheck: $(2, 1)$ uses $2(3) + 4 = 10$, the whole roll.\n\n> **Watch out.** Each count of the first piece leaves a different room for the second; try every count.",
          "寻找最有吸引力的切割方式本身就是背包问题：在能放入卷中的条件下，最大化各件的对偶总价值。如果最佳价值不超过 1，当前解就是最优的。\n\n卷宽 10，宽 3 和宽 4 的件价值 5 和 7（单位：百分之一），件数 $(2, 1)$ 得 $2(5) + 7 = 17$，$(0, 2)$ 得 14，$(3, 0)$ 得 15，所以最好的是 17。\n\n检验：$(2, 1)$ 用掉 $2(3) + 4 = 10$，正好是整卷。\n\n> **注意。** 第一种件的每个件数给第二种件留下的空间不同；要试每个件数。",
        ],
        (rng) => {
          const big = rng.int(8, 30);
          const [w1, w2] = rng.sample([2, 3, 4, 5, 6, 7], 2) as [number, number];
          const [v1, v2] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
          let best = 0;
          let bestCounts = [0, 0];
          for (let a = 0; a * w1 <= big; a++) {
            const b = Math.floor((big - a * w1) / w2);
            if (a * v1 + b * v2 > best) {
              best = a * v1 + b * v2;
              bestCounts = [a, b];
            }
          }
          const [ca, cb] = bestCounts as [number, number];
          return solved(
            [
              `Pieces of width ${w1} and ${w2} have the dual values ${v1} and ${v2}, in hundredths. What is the largest total value, in hundredths, that fits in a roll of width ${big}?`,
              `宽 ${w1} 和宽 ${w2} 的件的对偶值是 ${v1} 和 ${v2}（单位：百分之一）。在宽 ${big} 的卷中能放下的最大总价值（单位：百分之一）是多少？`,
            ],
            best,
            [
              [
                Math.floor(big / w1) * v1 + Math.floor(big / w2) * v2,
                "That fills the roll once with each width, using more than one roll.",
                "这用每种宽度各填满一次卷，用了不止一卷。",
              ],
              [Math.floor(big / w1) * v1, `That uses only pieces of width ${w1}.`, `这只用了宽 ${w1} 的件。`],
              [Math.floor(big / w2) * v2, `That uses only pieces of width ${w2}.`, `这只用了宽 ${w2} 的件。`],
            ],
            [
              [
                ["Try each count", "试每个件数"],
                [
                  `For each count of width ${w1}, from 0 to ${Math.floor(big / w1)}, fill what is left of the ${big} with pieces of width ${w2}.`,
                  `对宽 ${w1} 的每个件数（从 0 到 ${Math.floor(big / w1)}），用宽 ${w2} 的件填满 ${big} 中剩下的部分。`,
                ],
              ],
              [
                ["Keep the best", "取最好的"],
                [
                  `The best is ${ca} of width ${w1} and ${cb} of width ${w2}, worth $${v1}(${ca}) + ${v2}(${cb}) = ${best}$.`,
                  `最好的是宽 ${w1} 的 ${ca} 件和宽 ${w2} 的 ${cb} 件，价值 $${v1}(${ca}) + ${v2}(${cb}) = ${best}$。`,
                ],
              ],
            ],
            [
              `The pattern uses $${w1}(${ca}) + ${w2}(${cb}) = ${w1 * ca + w2 * cb}$ of the width ${big}, so it fits in one roll.`,
              `这种切割方式用掉宽度 ${big} 中的 $${w1}(${ca}) + ${w2}(${cb}) = ${w1 * ca + w2 * cb}$，所以能放进一卷。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Rolls have width 10, and orders are 7 pieces of width 3 and 4 of width 4. The total width $3(7) + 4(4) = 37$ needs at least 4 rolls, and a new pattern is priced by $1 - \\sum y_i a_i$.",
    "卷宽为 10，订单是 7 件宽 3 和 4 件宽 4。总宽度 $3(7) + 4(4) = 37$ 至少需要 4 卷，新的切割方式按 $1 - \\sum y_i a_i$ 定价。",
  ],
  ["$4(10) = 40 \\ge 37$ while $3(10) = 30 < 37$.", "$4(10) = 40 \\ge 37$，而 $3(10) = 30 < 37$。"],
  [
    "bound the number of rolls, price a cutting pattern with dual values, and find the best new pattern as a knapsack.",
    "给卷数定下界，用对偶值为切割方式定价，并把最好的新切割方式当作背包问题来求。",
  ],
);

/** linearProgrammingExtraTopics holds the topics that complete the Linear Programming course. */
export const linearProgrammingExtraTopics: readonly TopicDef[] = [
  polyhedra,
  bland,
  boundedVariables,
  complexity,
  modeling,
  linearizing,
  piecewise,
  shadow,
  objectiveRanging,
  addRow,
  matrixForm,
  startingPlans,
  hungarian,
  networkSimplex,
  branchBound,
  knapsack,
  unimodular,
  goal,
  gamesLp,
  columnGeneration,
];
