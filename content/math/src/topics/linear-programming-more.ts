// More of Linear Programming: convexity, alternative optima, infeasibility certificates,
// minimization, reduced costs, the revised and dual simplex methods, the Big M method,
// ranging, cutting planes and network programs.

import type { Figure, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, svgDocument } from "@ga/subject-math";
import { linearProgrammingDrawings1 } from "../explanation-drawings-linear-programming-1.ts";

import { type Pair, point, same, topic } from "../university-kit.ts";
import { label, node } from "./figure-reading-more.ts";
import { plus, solved } from "./linear-programming.ts";
import { chosen, lesson, type Miss, type Slip } from "./number-theory-course.ts";

/** vector2 writes a column vector with two entries in LaTeX. */
const vector2 = (a: number, b: number) => `\\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}`;

/** matrix2 writes a two by two matrix in LaTeX. */
const matrix2 = (a: number, b: number, c: number, d: number) => `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

/** coef writes a coefficient in front of a variable, leaving out a coefficient of one. */
const coef = (c: number) => (c === 1 ? "" : `${c}`);

const convexity = lesson(
  topic(
    "convex-sets-and-convex-combinations",
    ["Convex Sets and Convex Combinations", "凸集和凸组合"],
    ["Why a linear objective has nothing to gain from the inside of a feasible region.", "为什么线性目标在可行域内部不会更优。"],
    ["the-graphical-method-for-linear-programs"],
    [],
    [
      point(
        "a-point-on-a-segment",
        ["A point on a segment", "线段上的点"],
        [
          "A convex combination of two points $A$ and $B$ is $\\lambda A + (1 - \\lambda) B$ with $\\lambda$ between 0 and 1. It lies on the segment joining them, and the larger $\\lambda$ is, the closer it lies to $A$. A set is convex when it contains every such point for every pair of its points.\n\nWith $A = (0, 0)$, $B = (8, 4)$ and $\\lambda = \\frac{1}{4}$, the point is $\\frac{1}{4}(0, 0) + \\frac{3}{4}(8, 4) = (6, 3)$.\n\nCheck: $B$ carries the larger weight, and $(6, 3)$ is three quarters of the way from $A$ to $B$.\n\n> **Watch out.** The weight $\\lambda$ goes with $A$ and $1 - \\lambda$ with $B$; swapping them reflects the point across the middle of the segment.",
          "两点 $A$ 和 $B$ 的凸组合是 $\\lambda A + (1 - \\lambda) B$，其中 $\\lambda$ 在 0 和 1 之间。它在连接两点的线段上，$\\lambda$ 越大越靠近 $A$。如果一个集合中任意两点的这类点都还在集合里，这个集合就是凸集。\n\n取 $A = (0, 0)$，$B = (8, 4)$，$\\lambda = \\frac{1}{4}$，这个点是 $\\frac{1}{4}(0, 0) + \\frac{3}{4}(8, 4) = (6, 3)$。\n\n检验：$B$ 的权重较大，而 $(6, 3)$ 正好在从 $A$ 到 $B$ 的四分之三处。\n\n> **注意。** 权重 $\\lambda$ 配 $A$，$1 - \\lambda$ 配 $B$；把它们对调，点就关于线段中点对称过去了。",
        ],
        (rng) => {
          const lambda = rng.pick([1, 3]);
          const [x1, x2] = (rng.sample([-3, -2, -1, 1, 2, 3, 4, 5, 6], 2) as [number, number]).map((v) => v * 4) as [number, number];
          const [y1, y2] = [rng.int(0, 9), rng.int(0, 9)];
          const value = (lambda * x1 + (4 - lambda) * x2) / 4;
          const [partA, partB] = [(lambda * x1) / 4, ((4 - lambda) * x2) / 4];
          return solved(
            [
              `Let $A = (${x1}, ${y1})$ and $B = (${x2}, ${y2})$. What is the $x$-coordinate of $\\frac{${lambda}}{4} A + \\frac{${4 - lambda}}{4} B$?`,
              `设 $A = (${x1}, ${y1})$，$B = (${x2}, ${y2})$。$\\frac{${lambda}}{4} A + \\frac{${4 - lambda}}{4} B$ 的 $x$ 坐标是多少？`,
            ],
            value,
            [
              [
                ((4 - lambda) * x1 + lambda * x2) / 4,
                `That gives the weight $\\frac{${lambda}}{4}$ to $B$ instead of $A$.`,
                `这把权重 $\\frac{${lambda}}{4}$ 给了 $B$，而不是 $A$。`,
              ],
              [(x1 + x2) / 2, "That takes the midpoint, as if both weights were one half.", "这取的是中点，好像两个权重都是二分之一。"],
              [x1 + x2, "That adds the two coordinates without weighting them.", "这把两个坐标直接相加，没有加权。"],
            ],
            [
              [
                ["Weight each coordinate", "给每个坐标加权"],
                [
                  `$\\frac{${lambda}}{4}(${x1}) = ${partA}$ and $\\frac{${4 - lambda}}{4}(${x2}) = ${partB}$.`,
                  `$\\frac{${lambda}}{4}(${x1}) = ${partA}$，$\\frac{${4 - lambda}}{4}(${x2}) = ${partB}$。`,
                ],
              ],
              [
                ["Add the parts", "相加"],
                [`$${partA} ${plus(partB)} = ${value}$.`, `$${partA} ${plus(partB)} = ${value}$。`],
              ],
            ],
            [
              `$${value}$ lies between ${Math.min(x1, x2)} and ${Math.max(x1, x2)}, nearer to ${lambda === 3 ? `$A$'s ${x1}` : `$B$'s ${x2}`}, the point with the larger weight.`,
              `$${value}$ 在 ${Math.min(x1, x2)} 和 ${Math.max(x1, x2)} 之间，更靠近权重较大的${lambda === 3 ? `$A$ 的 ${x1}` : `$B$ 的 ${x2}`}。`,
            ],
          );
        },
      ),
      point(
        "the-objective-at-a-mixture",
        ["The objective at a mixture", "混合点的目标值"],
        [
          "A linear objective at a convex combination of two points equals the same combination of its two values. So the value at a mixture always lies between the values at the ends, and it can never beat both. This is why some corner of a bounded feasible region is always optimal.\n\nFor $z = 2x + 3y$, the values at $(0, 4)$ and $(6, 2)$ are 12 and 18, so at their midpoint $(3, 3)$ the value is the average, 15.\n\nCheck: $2(3) + 3(3) = 15$ directly.\n\n> **Watch out.** At the midpoint the value is the average of the two values, not their sum.",
          "线性目标在两点凸组合处的值，等于两个目标值的同样组合。所以混合点的值总在两端的值之间，不可能同时胜过两端。这就是有界可行域总有一个角点最优的原因。\n\n对 $z = 2x + 3y$，在 $(0, 4)$ 和 $(6, 2)$ 处的值是 12 和 18，所以在它们的中点 $(3, 3)$ 处的值是平均值 15。\n\n检验：直接计算 $2(3) + 3(3) = 15$。\n\n> **注意。** 中点处的值是两个值的平均，而不是它们的和。",
        ],
        (rng) => {
          const [c, d] = [rng.int(1, 6), rng.int(1, 6)];
          const [p, q] = rng.sample([0, 2, 4, 6, 8, 10], 2) as [number, number];
          const [r, s] = rng.sample([0, 2, 4, 6, 8, 10], 2) as [number, number];
          const [za, zb] = [c * p + d * r, c * q + d * s];
          const mid = (za + zb) / 2;
          const [mx, my] = [(p + q) / 2, (r + s) / 2];
          return solved(
            [
              `For $z = ${c}x + ${d}y$, what is the value of $z$ at the midpoint of $(${p}, ${r})$ and $(${q}, ${s})$?`,
              `对 $z = ${c}x + ${d}y$，$(${p}, ${r})$ 和 $(${q}, ${s})$ 的中点处 $z$ 的值是多少？`,
            ],
            mid,
            [
              [za, "That is the value at the first point only.", "这只是第一点处的值。"],
              [zb, "That is the value at the second point only.", "这只是第二点处的值。"],
              [za + zb, "That adds the two values; the midpoint takes their average.", "这把两个值相加了；中点取的是平均值。"],
            ],
            [
              [
                ["Evaluate at the ends", "计算两端的值"],
                [
                  `$z = ${c}(${p}) + ${d}(${r}) = ${za}$ at the first point and $z = ${c}(${q}) + ${d}(${s}) = ${zb}$ at the second.`,
                  `第一点处 $z = ${c}(${p}) + ${d}(${r}) = ${za}$，第二点处 $z = ${c}(${q}) + ${d}(${s}) = ${zb}$。`,
                ],
              ],
              [
                ["Average them", "取平均"],
                [
                  `Since $z$ is linear, its midpoint value is $\\frac{${za} + ${zb}}{2} = ${mid}$.`,
                  `因为 $z$ 是线性的，中点处的值是 $\\frac{${za} + ${zb}}{2} = ${mid}$。`,
                ],
              ],
            ],
            [
              `The midpoint is $(${mx}, ${my})$, and $${c}(${mx}) + ${d}(${my}) = ${mid}$ directly.`,
              `中点是 $(${mx}, ${my})$，直接计算 $${c}(${mx}) + ${d}(${my}) = ${mid}$。`,
            ],
          );
        },
      ),
      point(
        "recognizing-a-set-that-is-not-convex",
        ["Recognizing a set that is not convex", "识别非凸集"],
        [
          "Every half-plane is convex, and an intersection of convex sets is convex, so the feasible region of a linear program is always convex. A set that is the outside of a disc, or two separate pieces, is not convex: some segment between two of its points leaves the set. One such segment is enough to show it.\n\nThe set where $x \\le -1$ or $x \\ge 1$ contains $(-1, 0)$ and $(1, 0)$, but not the origin between them, so it is not convex.\n\nCheck: $0$ is neither at most $-1$ nor at least $1$.\n\n> **Watch out.** To show that a set is not convex, one segment that leaves it is enough; to show that a set is convex, every segment must stay inside.",
          "每个半平面都是凸集，凸集的交还是凸集，所以线性规划的可行域总是凸的。圆盘的外部或分开的两块都不是凸集：其中两点之间的某条线段会离开集合。只要找到一条这样的线段就够了。\n\n满足 $x \\le -1$ 或 $x \\ge 1$ 的点集包含 $(-1, 0)$ 和 $(1, 0)$，却不包含它们之间的原点，所以它不是凸集。\n\n检验：$0$ 既不小于等于 $-1$，也不大于等于 $1$。\n\n> **注意。** 要说明一个集合不是凸集，一条离开它的线段就够了；要说明它是凸集，则每条线段都必须留在里面。",
        ],
        (rng) => {
          const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
          const r = rng.int(2, 9);
          const h = rng.int(3, 12);
          const outsideDisc = rng.bool();
          const bad: Pair = outsideDisc
            ? same(`\\{(x, y) : x^2 + y^2 \\ge ${r * r}\\}`)
            : same(`\\{(x, y) : x \\le -${a} \\text{ or } x \\ge ${b}\\}`);
          const [left, right] = outsideDisc ? [-r, r] : [-a, b];
          return chosen(
            rng,
            ["Which of these sets is not convex?", "下面哪个集合不是凸集？"],
            bad,
            [
              [
                same(`\\{(x, y) : ${a === 1 ? "" : a}x + ${b === 1 ? "" : b}y \\le ${h}\\}`),
                "That is a half-plane, which is convex.",
                "这是半平面，它是凸集。",
              ],
              [
                same(`\\{(x, y) : x^2 + y^2 \\le ${r * r}\\}`),
                "That is a disc, which is convex: the segment between two of its points stays inside.",
                "这是圆盘，它是凸集：其中两点之间的线段留在里面。",
              ],
              [
                same(`\\{(x, y) : x \\ge ${a},\\ y \\ge ${b},\\ x + y \\le ${h + a + b}\\}`),
                "That is an intersection of half-planes, which is convex.",
                "这是半平面的交，它是凸集。",
              ],
            ],
            [
              [
                ["Find two points of the set", "找集合中的两点"],
                [`$(${left}, 0)$ and $(${right}, 0)$ both lie in ${bad[0]}.`, `$(${left}, 0)$ 和 $(${right}, 0)$ 都在 ${bad[1]} 中。`],
              ],
              [
                ["Test a point between them", "检验它们之间的点"],
                [
                  "The origin lies on the segment between them, but not in the set, so the set is not convex.",
                  "原点在它们之间的线段上，却不在集合中，所以这个集合不是凸集。",
                ],
              ],
            ],
            outsideDisc
              ? [
                  `At the origin $0^2 + 0^2 = 0 < ${r * r}$, so the origin is outside the set.`,
                  `在原点处 $0^2 + 0^2 = 0 < ${r * r}$，所以原点不在集合中。`,
                ]
              : [
                  `$0$ is neither at most $-${a}$ nor at least ${b}, so the origin is outside the set.`,
                  `$0$ 既不小于等于 $-${a}$，也不大于等于 ${b}，所以原点不在集合中。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "Take the points $(0, 0)$ and $(4, 2)$. With $\\lambda = \\frac{1}{2}$ their convex combination is the midpoint $(2, 1)$. The objective $x + y$ is 0 and 6 at the ends and 3 at the midpoint, between the two.",
    "取点 $(0, 0)$ 和 $(4, 2)$。取 $\\lambda = \\frac{1}{2}$，它们的凸组合是中点 $(2, 1)$。目标 $x + y$ 在两端是 0 和 6，在中点是 3，介于两者之间。",
  ],
  ["$3 = \\frac{0 + 6}{2}$, the same mixture of the two end values.", "$3 = \\frac{0 + 6}{2}$，正是两端值的同样混合。"],
  [
    "compute convex combinations, see why a linear objective at a mixture never beats both ends, and recognize sets that are not convex.",
    "计算凸组合，理解线性目标在混合点处为什么不会同时胜过两端，并识别非凸集。",
  ],
);

const alternativeOptima = lesson(
  topic(
    "alternative-optimal-solutions",
    ["Alternative Optimal Solutions", "多重最优解"],
    [
      "When a whole edge of the feasible region is optimal, and how the tableau shows it.",
      "可行域的整条边都最优时的情形，以及单纯形表如何显示它。",
    ],
    ["the-simplex-tableau", "convex-sets-and-convex-combinations"],
    [],
    [
      {
        ...point(
          "an-objective-parallel-to-an-edge",
          ["An objective parallel to an edge", "目标平行于一条边"],
          [
            "The level lines of $cx + dy$ are parallel to the edge $ax + by = h$ exactly when $(c, d)$ is a multiple of $(a, b)$. If that edge is the last one the level lines reach, every point on the edge is optimal, not only its two corners.\n\nThe objective $4x + 6y$ is $2(2x + 3y)$, so it is parallel to the edge $2x + 3y = 12$ and equals 24 everywhere on it.\n\nCheck: at the corners $(6, 0)$ and $(0, 4)$ the objective is $24$ and $24$.\n\n> **Watch out.** Both coefficients must scale by the same factor; matching only one of them does not make the lines parallel.",
            "当 $(c, d)$ 是 $(a, b)$ 的倍数时，$cx + dy$ 的等值线平行于边 $ax + by = h$。如果等值线最后碰到的就是这条边，那么边上每一点都是最优解，不只是两个角点。\n\n目标 $4x + 6y$ 等于 $2(2x + 3y)$，所以它平行于边 $2x + 3y = 12$，在边上处处等于 24。\n\n检验：在角点 $(6, 0)$ 和 $(0, 4)$ 处目标值都是 $24$。\n\n> **注意。** 两个系数必须按同一个倍数缩放；只对上一个系数，直线并不平行。",
          ],
          (rng) => {
            const [a, b] = rng.pick([
              [1, 2],
              [2, 1],
              [2, 3],
              [3, 2],
              [1, 3],
              [3, 1],
              [3, 4],
              [4, 3],
            ] as const);
            const m = rng.int(2, 6);
            const h = rng.int(6, 30);
            return solved(
              [
                `The edge of a feasible region lies on $${a}x + ${b}y = ${h}$. For what value of $c$ is the objective $z = cx + ${m * b}y$ parallel to that edge?`,
                `可行域的一条边在 $${a}x + ${b}y = ${h}$ 上。$c$ 取何值时，目标 $z = cx + ${m * b}y$ 平行于这条边？`,
              ],
              m * a,
              [
                [
                  a,
                  `That copies the coefficient of $x$ from the edge without scaling it by ${m}.`,
                  `这照搬了边中 $x$ 的系数，没有乘以 ${m}。`,
                ],
                [m * b, "That is the coefficient of $y$, not of $x$.", "这是 $y$ 的系数，不是 $x$ 的。"],
                [m, "That is the scale factor itself, not the coefficient.", "这是倍数本身，不是系数。"],
                [h, "That is the right side of the edge, which plays no part in its direction.", "这是边的右端，与方向无关。"],
              ],
              [
                [
                  ["Find the scale factor", "求倍数"],
                  [
                    `$${m * b} = ${m} \\times ${b}$, so the objective must be ${m} times the left side of the edge.`,
                    `$${m * b} = ${m} \\times ${b}$，所以目标必须是边左边的 ${m} 倍。`,
                  ],
                ],
                [
                  ["Scale the other coefficient", "缩放另一个系数"],
                  [`So $c = ${m} \\times ${a} = ${m * a}$.`, `所以 $c = ${m} \\times ${a} = ${m * a}$。`],
                ],
              ],
              [
                `$${m * a}x + ${m * b}y = ${m}(${coef(a)}x + ${coef(b)}y)$, which equals ${m * h} at every point of the edge.`,
                `$${m * a}x + ${m * b}y = ${m}(${coef(a)}x + ${coef(b)}y)$，在边上每一点都等于 ${m * h}。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["alternative-optimal-solutions#an-objective-parallel-to-an-edge"],
      },
      point(
        "the-value-along-an-optimal-edge",
        ["The value along an optimal edge", "最优边上的值"],
        [
          "If two corners of a feasible region are both optimal, then every convex combination of them is optimal too, with the same objective value. Testing any one point of the edge therefore gives the optimal value, and all points in between are equally good plans.\n\nIf $(0, 4)$ and $(4, 0)$ are both optimal for $z = 2x + 2y$, with value 8, then the midpoint $(2, 2)$ is optimal too.\n\nCheck: $2(2) + 2(2) = 8$.\n\n> **Watch out.** A point between two optimal corners has the same value as each of them, not their sum.",
          "如果可行域的两个角点都最优，那么它们的每个凸组合也都最优，目标值相同。所以检验边上任何一点都能得到最优值，中间的点都是同样好的方案。\n\n如果 $(0, 4)$ 和 $(4, 0)$ 对 $z = 2x + 2y$ 都最优，值为 8，那么中点 $(2, 2)$ 也最优。\n\n检验：$2(2) + 2(2) = 8$。\n\n> **注意。** 两个最优角点之间的点，值与每个角点相同，而不是它们的和。",
        ],
        (rng) => {
          const [a, b] = rng.pick([
            [1, 1],
            [1, 2],
            [2, 1],
            [3, 1],
            [1, 3],
          ] as const);
          const k = rng.int(2, 5);
          const y1 = rng.int(4, 8) * a;
          const x1 = rng.int(0, 2) * b;
          const [x2, y2] = [x1 + 2 * b, y1 - 2 * a];
          const value = k * (a * x1 + b * y1);
          return solved(
            [
              `For $z = ${k * a}x + ${k * b}y$, both $(${x1}, ${y1})$ and $(${x2}, ${y2})$ are optimal corners. What is the value of $z$ at $(${x1 + b}, ${y1 - a})$?`,
              `对 $z = ${k * a}x + ${k * b}y$，$(${x1}, ${y1})$ 和 $(${x2}, ${y2})$ 都是最优角点。$z$ 在 $(${x1 + b}, ${y1 - a})$ 处的值是多少？`,
            ],
            value,
            [
              [
                2 * value,
                "That adds the values at the two corners; a point between them has the same value as each.",
                "这把两个角点的值相加了；它们之间的点与每个角点的值相同。",
              ],
              [value / k, `That leaves out the factor ${k} in the objective.`, `这漏掉了目标中的因子 ${k}。`],
              [k * b * y1, "That evaluates only the $y$ term at the first corner.", "这只算了第一个角点处的 $y$ 项。"],
            ],
            [
              [
                ["Place the point", "确定点的位置"],
                [
                  `$(${x1 + b}, ${y1 - a})$ is the midpoint of the two optimal corners, so it is optimal too.`,
                  `$(${x1 + b}, ${y1 - a})$ 是两个最优角点的中点，所以它也最优。`,
                ],
              ],
              [
                ["Evaluate at a corner", "在角点处计算"],
                [
                  `At the first corner $z = ${k * a}(${x1}) + ${k * b}(${y1}) = ${value}$, the common optimal value.`,
                  `在第一个角点处 $z = ${k * a}(${x1}) + ${k * b}(${y1}) = ${value}$，这就是共同的最优值。`,
                ],
              ],
            ],
            [
              `At the point itself, $${k * a}(${x1 + b}) + ${k * b}(${y1 - a}) = ${value}$ too.`,
              `直接在这一点计算，$${k * a}(${x1 + b}) + ${k * b}(${y1 - a}) = ${value}$，结果相同。`,
            ],
          );
        },
      ),
      point(
        "a-zero-in-the-objective-row",
        ["A zero in the objective row", "目标行中的零"],
        [
          "At an optimal tableau every basic variable has a zero in the objective row. If a nonbasic variable also has a zero there, bringing it into the basis leaves the objective unchanged. That pivot reaches another optimal corner, so the program has alternative optimal solutions.\n\nIf an optimal tableau has basic variables $x_1$ and $x_2$ and objective row $0, 0, 0, 3$ under $x_1, x_2, s_1, s_2$, then $s_1$ is nonbasic with a zero, so the optimum is not unique.\n\nCheck: entering $s_1$ changes the objective by $0$ per unit.\n\n> **Watch out.** The basic variables always have zeros in the objective row; only a zero under a nonbasic variable signals another optimal corner.",
          "在最优单纯形表中，每个基变量在目标行的系数都是零。如果某个非基变量的系数也是零，让它进基不会改变目标值。这次主元运算到达另一个最优角点，所以规划有多重最优解。\n\n如果一个最优表的基变量是 $x_1$ 和 $x_2$，目标行在 $x_1, x_2, s_1, s_2$ 下是 $0, 0, 0, 3$，那么 $s_1$ 是系数为零的非基变量，最优解不唯一。\n\n检验：$s_1$ 进基时目标值每单位变化 $0$。\n\n> **注意。** 基变量在目标行的系数总是零；只有非基变量下的零才说明还有别的最优角点。",
        ],
        (rng) => {
          const names = ["x_1", "x_2", "s_1", "s_2"];
          const basic = rng.sample(names, 2);
          const others = names.filter((n) => !basic.includes(n));
          const [zero, positive] = rng.shuffle(others) as [string, string];
          const value = rng.int(2, 9);
          const row = names.map((n) => (n === positive ? value : 0));
          const [b0, b1] = [basic[0] as string, basic[1] as string];
          return chosen(
            rng,
            [
              `This optimal tableau has basic variables $${basic[0]}$ and $${basic[1]}$. Its objective row has entries $${row.join(", ")}$ under $${names.join(", ")}$. Which variable can enter the basis without changing the objective?`,
              `这个最优单纯形表的基变量是 $${basic[0]}$ 和 $${basic[1]}$。目标行在 $${names.join(", ")}$ 下的系数是 $${row.join(", ")}$。哪个变量进基不会改变目标值？`,
            ],
            same(zero),
            [
              [
                same(positive),
                `Its entry is ${value}, so entering it would lower the objective by ${value} per unit.`,
                `它的系数是 ${value}，进基会使目标值每单位降低 ${value}。`,
              ],
              [same(b0), `$${b0}$ is already basic, so it cannot enter.`, `$${b0}$ 已经是基变量，不能再进基。`],
              [same(b1), `$${b1}$ is already basic, so it cannot enter.`, `$${b1}$ 已经是基变量，不能再进基。`],
            ],
            [
              [
                ["Set aside the basic variables", "排除基变量"],
                [
                  `$${b0}$ and $${b1}$ are basic, so only $${zero}$ and $${positive}$ can enter.`,
                  `$${b0}$ 和 $${b1}$ 是基变量，所以只有 $${zero}$ 和 $${positive}$ 能进基。`,
                ],
              ],
              [
                ["Read their entries", "读它们的系数"],
                [
                  `$${zero}$ has 0 and $${positive}$ has ${value}, so $${zero}$ enters at no cost.`,
                  `$${zero}$ 的系数是 0，$${positive}$ 的系数是 ${value}，所以 $${zero}$ 进基没有代价。`,
                ],
              ],
            ],
            [
              `Entering $${zero}$ moves to another corner with the same objective value, so the optimum is not unique.`,
              `$${zero}$ 进基后到达目标值相同的另一个角点，所以最优解不唯一。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Maximize $2x + 2y$ on $x + y \\le 4$, $x, y \\ge 0$. The corners $(4, 0)$ and $(0, 4)$ both give 8, because the objective is parallel to the edge $x + y = 4$, and so does every point between them, such as $(2, 2)$.",
    "在 $x + y \\le 4$，$x, y \\ge 0$ 上使 $2x + 2y$ 最大。角点 $(4, 0)$ 和 $(0, 4)$ 都给出 8，因为目标平行于边 $x + y = 4$；它们之间的每一点也一样，比如 $(2, 2)$。",
  ],
  ["$2(2) + 2(2) = 8$, the same optimal value.", "$2(2) + 2(2) = 8$，最优值相同。"],
  [
    "recognize an objective parallel to an edge, find the value along an optimal edge, and spot alternative optima in a tableau.",
    "识别平行于一条边的目标，求最优边上的值，并在单纯形表中发现多重最优解。",
  ],
);

const infeasible = lesson(
  topic(
    "infeasible-programs-and-farkas-lemma",
    ["Infeasible Programs and Farkas' Lemma", "无可行解的规划和法卡斯引理"],
    ["Prove that constraints have no solution by combining them into a contradiction.", "把约束组合成矛盾，证明它们没有解。"],
    ["convex-sets-and-convex-combinations"],
    [],
    [
      point(
        "when-two-constraints-conflict",
        ["When two constraints conflict", "两个约束冲突时"],
        [
          "Two constraints on the same combination of variables can contradict each other. Scale them to the same left side and compare the right sides. If one demands at least more than the other allows at most, the feasible region is empty, whatever the objective is, and no corner exists to test.\n\nThe constraints $x + y \\le a$ and $3x + 3y \\ge 12$ say that $x + y$ is at most $a$ and at least 4, so the program is feasible exactly when $a \\ge 4$.\n\nCheck: with $a = 4$, the point $(4, 0)$ satisfies both constraints.\n\n> **Watch out.** Divide the whole constraint, right side included, before comparing; the right side 12 belongs to $3x + 3y$, not to $x + y$.",
          "对同一个变量组合的两个约束可能互相矛盾。把它们化成相同的左边，再比较右边。如果一个要求的下限超过另一个允许的上限，可行域就是空的，与目标无关，也没有角点可检验。\n\n约束 $x + y \\le a$ 和 $3x + 3y \\ge 12$ 是说 $x + y$ 至多是 $a$、至少是 4，所以规划有可行解当且仅当 $a \\ge 4$。\n\n检验：取 $a = 4$，点 $(4, 0)$ 满足两个约束。\n\n> **注意。** 比较之前要把整个约束连同右端一起相除；右端 12 属于 $3x + 3y$，不属于 $x + y$。",
        ],
        (rng) => {
          const [p, q] = [rng.int(1, 3), rng.int(1, 3)];
          const m = rng.int(2, 5);
          const low = rng.int(3, 12);
          const c = m * low;
          const combo = `${coef(p)}x + ${coef(q)}y`;
          return solved(
            [
              `The constraints are $${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y \\le a$ and $${m * p}x + ${m * q}y \\ge ${c}$. What is the smallest value of $a$ for which the program is feasible?`,
              `约束是 $${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y \\le a$ 和 $${m * p}x + ${m * q}y \\ge ${c}$。$a$ 最小取何值时规划有可行解？`,
            ],
            low,
            [
              [c, `That is the right side before dividing by ${m}.`, `这是还没有除以 ${m} 的右端。`],
              [
                low - 1,
                `That leaves no room: $${combo}$ must reach ${low}, so $a$ must be at least ${low}.`,
                `这样没有余地：$${combo}$ 必须达到 ${low}，所以 $a$ 至少是 ${low}。`,
              ],
              [m, `That is the factor ${m} between the two left sides, not a bound.`, `这是两个左边之间的倍数 ${m}，不是界。`],
            ],
            [
              [
                ["Match the left sides", "化成相同的左边"],
                [
                  `Dividing the second constraint by ${m} gives $${combo} \\ge ${low}$.`,
                  `第二个约束除以 ${m}，得 $${combo} \\ge ${low}$。`,
                ],
              ],
              [
                ["Compare the right sides", "比较右边"],
                [
                  `The same combination must be at most $a$ and at least ${low}, so the program is feasible exactly when $a \\ge ${low}$.`,
                  `同一个组合至多是 $a$，至少是 ${low}，所以规划有可行解当且仅当 $a \\ge ${low}$。`,
                ],
              ],
            ],
            [
              `With $a = ${low}$, both constraints hold where $${combo} = ${low}$; any smaller $a$ would ask the combination to be below ${low} and at least ${low} at once.`,
              `取 $a = ${low}$，在 $${combo} = ${low}$ 处两个约束都成立；$a$ 再小，组合就要同时小于 ${low} 又至少是 ${low}。`,
            ],
          );
        },
      ),
      point(
        "a-certificate-of-infeasibility",
        ["A certificate of infeasibility", "无解的证书"],
        [
          "Farkas' Lemma says that a system $Ax \\le b$ has no solution exactly when some nonnegative multipliers combine the rows so that the left side vanishes and the right side is negative. That combination reads $0 \\le$ a negative number, a contradiction that anyone can check without searching for a solution.\n\nMultiplying $x + y \\le 3$ by 2 gives $2x + 2y \\le 6$, and adding $-2x - 2y \\le -8$ gives $0 \\le -2$.\n\nCheck: $0 \\le -2$ is false, so no point satisfies both constraints.\n\n> **Watch out.** Multiply the right side by the same multiplier as the left side; otherwise the left side vanishes but the right side is wrong.",
          "法卡斯引理说：$Ax \\le b$ 无解，当且仅当存在非负乘数，使各行组合后左边为零、右边为负。这个组合就是 $0 \\le$ 一个负数，是矛盾，任何人都能检验，而不必去找解。\n\n把 $x + y \\le 3$ 乘 2 得 $2x + 2y \\le 6$，再加上 $-2x - 2y \\le -8$，得 $0 \\le -2$。\n\n检验：$0 \\le -2$ 不成立，所以没有点同时满足两个约束。\n\n> **注意。** 右端要乘以和左边相同的乘数；否则左边消去了，右端却不对。",
        ],
        (rng) => {
          const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
          const m = rng.int(2, 4);
          const p = rng.int(1, 9);
          const q = -(m * p + rng.int(1, 9));
          const value = m * p + q;
          return solved(
            [
              `Multiply $${a}x + ${b}y \\le ${p}$ by ${m} and add $-${m * a}x - ${m * b}y \\le ${q}$. The left side vanishes. What number is on the right side?`,
              `把 $${a}x + ${b}y \\le ${p}$ 乘 ${m}，再加上 $-${m * a}x - ${m * b}y \\le ${q}$。左边消去。右边是什么数？`,
            ],
            value,
            [
              [p + q, `That adds the first right side without multiplying it by ${m}.`, `这把第一个右端直接相加，没有乘以 ${m}。`],
              [
                m * p - q,
                "That subtracts the second right side, but the constraints are added.",
                "这减去了第二个右端，但两个约束是相加的。",
              ],
              [-value, "That has the sign reversed.", "这把符号弄反了。"],
              [q, "That is the second right side alone.", "这只是第二个右端。"],
            ],
            [
              [
                ["Multiply the first constraint", "第一个约束乘以乘数"],
                [
                  `${m} times the first constraint is $${m * a}x + ${m * b}y \\le ${m * p}$.`,
                  `第一个约束乘 ${m}，得 $${m * a}x + ${m * b}y \\le ${m * p}$。`,
                ],
              ],
              [
                ["Add the second", "加上第二个"],
                [
                  `The left sides cancel, and the right sides give $${m * p} + (${q}) = ${value}$.`,
                  `左边相消，右边得 $${m * p} + (${q}) = ${value}$。`,
                ],
              ],
            ],
            [
              `The result reads $0 \\le ${value}$, which is false, so the two constraints have no common solution.`,
              `结果是 $0 \\le ${value}$，这不成立，所以两个约束没有公共解。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "The constraints $x + y \\le 3$ and $x + y \\ge 5$ cannot both hold. Written as $x + y \\le 3$ and $-x - y \\le -5$, their sum is $0 \\le -2$, a contradiction that proves the feasible region is empty.",
    "约束 $x + y \\le 3$ 和 $x + y \\ge 5$ 不可能同时成立。写成 $x + y \\le 3$ 和 $-x - y \\le -5$，两者相加得 $0 \\le -2$，这个矛盾证明可行域是空的。",
  ],
  ["no number $x + y$ is both at most 3 and at least 5.", "没有一个数 $x + y$ 既不超过 3 又不小于 5。"],
  [
    "find when two constraints conflict, and combine constraints into a certificate that proves a program infeasible.",
    "找出两个约束何时冲突，并把约束组合成证明规划无解的证书。",
  ],
);

const minimization = lesson(
  topic(
    "minimization-and-surplus-variables",
    ["Minimization and Surplus Variables", "最小化和剩余变量"],
    ["Handle at-least constraints and turn a minimum into a maximum.", "处理“至少”型约束，把最小化转成最大化。"],
    ["standard-form-and-slack-variables"],
    [],
    [
      point(
        "the-value-of-a-surplus-variable",
        ["The value of a surplus variable", "剩余变量的值"],
        [
          "A constraint $ax + by \\ge h$ becomes an equation by subtracting a nonnegative surplus variable: $ax + by - s = h$. The surplus measures how far a plan goes beyond the requirement. A surplus of zero means the plan meets the requirement exactly, and a negative value would mean the plan is not feasible.\n\nFor $2x + 3y \\ge 10$ at $(2, 3)$, the plan provides $4 + 9 = 13$, so the surplus is $s = 13 - 10 = 3$.\n\nCheck: $13 - 3 = 10$, as $2x + 3y - s = 10$ requires.\n\n> **Watch out.** The surplus is the excess over the requirement, the amount provided minus the right side, and it is never negative for a feasible plan.",
          "约束 $ax + by \\ge h$ 减去一个非负的剩余变量就成为等式：$ax + by - s = h$。剩余变量衡量方案超出要求多少。剩余为零说明方案恰好满足要求，负值则说明方案不可行。\n\n对 $2x + 3y \\ge 10$，在 $(2, 3)$ 处方案提供 $4 + 9 = 13$，所以剩余是 $s = 13 - 10 = 3$。\n\n检验：$13 - 3 = 10$，正如 $2x + 3y - s = 10$ 所要求的。\n\n> **注意。** 剩余是超出要求的量，即提供的量减去右端；可行方案的剩余从不为负。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 7), rng.int(2, 7)];
          const [x, y] = [rng.int(1, 9), rng.int(1, 9)];
          const surplus = rng.int(1, 12);
          const h = a * x + b * y - surplus;
          const provided = a * x + b * y;
          return solved(
            [
              `A diet must provide $${a}x + ${b}y \\ge ${h}$ units of protein. For the plan $x = ${x}$, $y = ${y}$, what is the value of the surplus variable?`,
              `饮食必须提供 $${a}x + ${b}y \\ge ${h}$ 单位蛋白质。方案 $x = ${x}$，$y = ${y}$ 的剩余变量是多少？`,
            ],
            surplus,
            [
              [
                provided,
                "That is the amount the plan provides, not the excess over the requirement.",
                "这是方案提供的量，不是超出要求的部分。",
              ],
              [
                -surplus,
                "That has the sign reversed: the surplus is subtracted in the equation, but it is itself positive.",
                "这把符号弄反了：剩余变量在等式中被减去，但它本身是正的。",
              ],
              [h, "That is the requirement itself.", "这是要求本身。"],
            ],
            [
              [
                ["Evaluate the left side", "计算左边"],
                [
                  `The plan provides $${a}(${x}) + ${b}(${y}) = ${provided}$ units.`,
                  `方案提供 $${a}(${x}) + ${b}(${y}) = ${provided}$ 单位。`,
                ],
              ],
              [
                ["Take the excess", "求超出的量"],
                [`The surplus is $${provided} ${plus(-h)} = ${surplus}$.`, `剩余是 $${provided} ${plus(-h)} = ${surplus}$。`],
              ],
            ],
            [
              `$${provided} - ${surplus} = ${h}$, as $${a}x + ${b}y - s = ${h}$ requires.`,
              `$${provided} - ${surplus} = ${h}$，正如 $${a}x + ${b}y - s = ${h}$ 所要求的。`,
            ],
          );
        },
      ),
      point(
        "the-cheapest-corner",
        ["The cheapest corner", "最便宜的角点"],
        [
          "In a covering problem the feasible region is usually unbounded, stretching away from the origin, so there is no largest cost. A smallest cost still exists when the costs are nonnegative, and it occurs at a corner. Evaluate the cost at every corner of the boundary and take the smallest value.\n\nIf the corners are $(0, 6)$, $(2, 2)$ and $(6, 0)$, the cost $3x + 2y$ there is 12, 10 and 18, so the minimum is 10, at $(2, 2)$.\n\nCheck: a point farther out, such as $(3, 3)$, costs 15, more than 10.\n\n> **Watch out.** Take the smallest corner value; the largest means nothing here, since the region stretches away without end.",
          "覆盖问题的可行域通常是无界的，向远离原点的方向延伸，所以没有最大成本。成本非负时最小成本仍然存在，并且出现在角点。计算边界上每个角点的成本，取最小值。\n\n如果角点是 $(0, 6)$，$(2, 2)$ 和 $(6, 0)$，成本 $3x + 2y$ 在这些点是 12，10 和 18，所以最小值是 10，在 $(2, 2)$ 处取得。\n\n检验：更远处的点，比如 $(3, 3)$，成本是 15，比 10 多。\n\n> **注意。** 要取角点值中最小的；最大的在这里没有意义，因为可行域无限延伸。",
        ],
        (rng) => {
          const [c, d] = [rng.int(2, 9), rng.int(2, 9)];
          const corners = [
            [0, rng.int(10, 14)],
            [rng.int(1, 3), rng.int(5, 8)],
            [rng.int(4, 6), rng.int(2, 4)],
            [rng.int(10, 14), 0],
          ] as const;
          const costs = corners.map(([x, y]) => c * x + d * y);
          const best = Math.min(...costs);
          const list = corners.map(([x, y]) => `(${x}, ${y})`).join(", ");
          const at = corners[costs.indexOf(best)] as readonly [number, number];
          return solved(
            [
              `The corners of a feasible region that stretches away from the origin are $${list}$. What is the minimum of $${c}x + ${d}y$?`,
              `一个向远离原点方向延伸的可行域，角点是 $${list}$。$${c}x + ${d}y$ 的最小值是多少？`,
            ],
            best,
            [
              [
                Math.max(...costs),
                "That is the largest corner cost; the region has no largest cost at all.",
                "这是最大的角点成本；可行域根本没有最大成本。",
              ],
              ...corners.map(
                ([x, y], i): Miss => [
                  costs[i] as number,
                  `That is the cost at $(${x}, ${y})$, which is not the smallest.`,
                  `这是 $(${x}, ${y})$ 处的成本，不是最小的。`,
                ],
              ),
            ],
            [
              [
                ["Evaluate every corner", "计算每个角点"],
                [`The costs at the corners are ${costs.join(", ")}.`, `各角点的成本是 ${costs.join("，")}。`],
              ],
              [
                ["Take the smallest", "取最小的"],
                [`The smallest is ${best}, at $(${at[0]}, ${at[1]})$.`, `最小的是 ${best}，在 $(${at[0]}, ${at[1]})$ 处取得。`],
              ],
            ],
            [
              `$${c}(${at[0]}) + ${d}(${at[1]}) = ${best}$, and since both costs are positive, moving farther from the origin only adds cost.`,
              `$${c}(${at[0]}) + ${d}(${at[1]}) = ${best}$；因为两个成本系数都是正的，离原点越远成本只会越高。`,
            ],
          );
        },
      ),
      point(
        "a-minimum-through-a-maximum",
        ["A minimum through a maximum", "通过最大值求最小值"],
        [
          "Minimizing $z$ is the same as maximizing $-z$: the same plan is best, and the optimal values differ only in sign. So a maximizing simplex method solves minimization problems too, as long as the sign of the final value is changed back at the end.\n\nIf the largest value of $w = -z$ is $-40$, the smallest value of $z$ is $40$.\n\nCheck: a plan with $z = 40$ has $w = -40$, and a larger $z$ would give a smaller $w$.\n\n> **Watch out.** Change the sign back at the end: the minimum of $z$ is the negative of the maximum of $w$.",
          "最小化 $z$ 与最大化 $-z$ 是一回事：最优方案相同，最优值只差一个符号。所以求最大值的单纯形法也能解最小化问题，只要最后把结果的符号改回来。\n\n如果 $w = -z$ 的最大值是 $-40$，$z$ 的最小值就是 $40$。\n\n检验：$z = 40$ 的方案有 $w = -40$，而更大的 $z$ 会给出更小的 $w$。\n\n> **注意。** 最后要把符号改回来：$z$ 的最小值是 $w$ 的最大值的相反数。",
        ],
        (rng) => {
          const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
          const v = rng.int(10, 90);
          return solved(
            [
              `To minimize $z = ${a}x + ${b}y$, the simplex method is run on $w = -${a}x - ${b}y$, and it finds the largest value $w = -${v}$. What is the minimum of $z$?`,
              `为了使 $z = ${a}x + ${b}y$ 最小，对 $w = -${a}x - ${b}y$ 运行单纯形法，得到最大值 $w = -${v}$。$z$ 的最小值是多少？`,
            ],
            v,
            [
              [
                -v,
                "That is the largest value of $w$; the minimum of $z$ is its negative.",
                "这是 $w$ 的最大值；$z$ 的最小值是它的相反数。",
              ],
            ],
            [
              [
                ["Relate the two objectives", "联系两个目标"],
                [
                  "For every plan $z = -w$, so the plan with the largest $w$ has the smallest $z$.",
                  "对每个方案都有 $z = -w$，所以 $w$ 最大的方案 $z$ 最小。",
                ],
              ],
              [
                ["Change the sign back", "把符号改回来"],
                [`The minimum of $z$ is $-(-${v}) = ${v}$.`, `$z$ 的最小值是 $-(-${v}) = ${v}$。`],
              ],
            ],
            [
              `A plan with $z = ${v}$ has $w = -${v}$, and any plan with a larger $z$ would have a smaller $w$.`,
              `$z = ${v}$ 的方案有 $w = -${v}$，而 $z$ 更大的方案 $w$ 更小。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Minimize $3x + 2y$ subject to $x + y \\ge 4$, $x, y \\ge 0$. The constraint becomes $x + y - s = 4$ with a surplus $s \\ge 0$. The region stretches away from the origin, so there is no largest cost, but the corners $(4, 0)$ and $(0, 4)$ cost 12 and 8, and the minimum is 8.",
    "在 $x + y \\ge 4$，$x, y \\ge 0$ 的条件下使 $3x + 2y$ 最小。约束变成 $x + y - s = 4$，剩余 $s \\ge 0$。可行域向远离原点的方向延伸，没有最大成本，但角点 $(4, 0)$ 和 $(0, 4)$ 的成本是 12 和 8，最小值是 8。",
  ],
  ["the point $(2, 2)$ on the edge costs 10, between 8 and 12.", "边上的点 $(2, 2)$ 成本是 10，在 8 和 12 之间。"],
  [
    "compute surplus variables, find the cheapest corner of an unbounded region, and solve a minimum through a maximum.",
    "计算剩余变量，求无界可行域中最便宜的角点，并通过最大值求最小值。",
  ],
);

const reducedCosts = lesson(
  topic(
    "reduced-costs",
    ["Reduced Costs", "检验数"],
    ["Measure what one unit of a nonbasic variable would gain or lose.", "衡量一个非基变量增加一单位的得失。"],
    ["the-dual-of-a-linear-program", "pivoting-in-the-simplex-method"],
    [],
    [
      point(
        "computing-a-reduced-cost",
        ["Computing a reduced cost", "计算检验数"],
        [
          "The reduced cost of a variable is its own profit minus the value of the resources it uses: $r_j = c_j - y^T A_j$, where $y$ holds the simplex multipliers. A positive reduced cost in a maximization means that the variable earns more than its resources are worth, so bringing it into the basis helps.\n\nWith $y = (3, 1)$, a variable with column $(2, 4)$ uses resources worth $3(2) + 1(4) = 10$. If its profit is 8, its reduced cost is $8 - 10 = -2$, so entering it would lose 2 per unit.\n\nCheck: $10 - 2 = 8$, the profit.\n\n> **Watch out.** The reduced cost is the profit minus the worth of the resources, in that order; reversing it flips the sign and the decision.",
          "变量的检验数是它自身的利润减去所用资源的价值：$r_j = c_j - y^T A_j$，其中 $y$ 是单纯形乘数。在最大化问题中，检验数为正说明这个变量挣的比所用资源的价值多，让它进基有好处。\n\n取 $y = (3, 1)$，列为 $(2, 4)$ 的变量所用资源价值 $3(2) + 1(4) = 10$。如果它的利润是 8，检验数就是 $8 - 10 = -2$，进基会每单位亏 2。\n\n检验：$10 - 2 = 8$，正是利润。\n\n> **注意。** 检验数是利润减资源价值，顺序不能反；反过来符号就变了，决策也就反了。",
        ],
        (rng) => {
          const [y1, y2] = [rng.int(1, 5), rng.int(1, 5)];
          const [a1, a2] = [rng.int(1, 4), rng.int(1, 4)];
          const c = rng.int(3, 30);
          const used = y1 * a1 + y2 * a2;
          return solved(
            [
              `The simplex multipliers are $y = (${y1}, ${y2})$. A nonbasic variable has profit ${c} and column $${vector2(a1, a2)}$. What is its reduced cost?`,
              `单纯形乘数是 $y = (${y1}, ${y2})$。一个非基变量的利润是 ${c}，列向量是 $${vector2(a1, a2)}$。它的检验数是多少？`,
            ],
            c - used,
            [
              [used, "That is the worth of its resources, not the reduced cost.", "这是它所用资源的价值，不是检验数。"],
              [c + used, "That adds the worth of the resources instead of subtracting it.", "这把资源价值加上了，而不是减去。"],
              [
                used - c,
                "That has the sign reversed: the reduced cost is the profit minus the worth.",
                "这把符号弄反了：检验数是利润减资源价值。",
              ],
              [c - y1 * a2 - y2 * a1, "That pairs each multiplier with the wrong entry of the column.", "这把每个乘数配错了列中的元素。"],
            ],
            [
              [
                ["Value the resources", "给资源计价"],
                [
                  `Its resources are worth $${y1}(${a1}) + ${y2}(${a2}) = ${used}$.`,
                  `它所用资源的价值是 $${y1}(${a1}) + ${y2}(${a2}) = ${used}$。`,
                ],
              ],
              [
                ["Subtract from the profit", "从利润中减去"],
                [`The reduced cost is $${c} - ${used} = ${c - used}$.`, `检验数是 $${c} - ${used} = ${c - used}$。`],
              ],
            ],
            [
              `Adding the worth back, $${used} ${plus(c - used)} = ${c}$, the profit.`,
              `把资源价值加回去，$${used} ${plus(c - used)} = ${c}$，正是利润。`,
            ],
          );
        },
      ),
      point(
        "reading-reduced-costs",
        ["Reading reduced costs", "读检验数"],
        [
          "In a maximization, a basis is optimal when no nonbasic variable has a positive reduced cost. Otherwise the usual rule brings in the variable with the largest positive reduced cost, the one whose unit gain is highest. A negative reduced cost means that using the variable would lose money at current resource values.\n\nWith reduced costs $4$, $-2$ and $1$, the variable with $4$ enters. With $-3$, $-1$ and $0$, no reduced cost is positive, so the basis is optimal.\n\nCheck: in the first case each unit of the entering variable adds 4, more than the 1 of the other positive one.\n\n> **Watch out.** In a maximization, the entering variable has the largest positive reduced cost; a negative one, however large in size, would lose money.",
          "在最大化问题中，没有非基变量的检验数为正时，当前基就是最优的。否则通常让检验数最大的正值变量进基，它每单位增益最高。检验数为负说明按当前资源价值使用这个变量会亏损。\n\n检验数是 $4$，$-2$ 和 $1$ 时，检验数为 $4$ 的变量进基。检验数是 $-3$，$-1$ 和 $0$ 时，没有正的检验数，当前基是最优的。\n\n检验：第一种情况下，进基变量每单位增加 4，比另一个正检验数的 1 多。\n\n> **注意。** 在最大化问题中，进基变量的检验数是最大的正数；负的检验数不论绝对值多大，都会亏损。",
        ],
        (rng) => {
          const names = ["x_1", "x_2", "x_3"];
          const optimal = rng.bool(0.3);
          const values = optimal
            ? [-rng.int(1, 9), -rng.int(1, 9), -rng.int(0, 9)]
            : rng.shuffle([rng.int(6, 9), rng.int(1, 5), -rng.int(1, 9)]);
          const list = names.map((_n, i) => `r_{${i + 1}} = ${values[i]}`).join(",\\ ");
          const top = values.indexOf(Math.max(...values));
          const largest = values[top] as number;
          const correct: Pair = optimal ? ["The current basis is optimal", "当前基已是最优"] : same(names[top] as string);
          const reasonFor = (i: number): Pair => {
            const v = values[i] as number;
            if (optimal)
              return [
                `Its reduced cost ${v} is not positive, so entering it cannot raise the objective.`,
                `它的检验数 ${v} 不是正的，进基不能提高目标值。`,
              ];
            if (v > 0)
              return [`Its reduced cost ${v} is positive, but ${largest} is larger.`, `它的检验数 ${v} 是正的，但 ${largest} 更大。`];
            return [`Its reduced cost ${v} is negative, so entering it would lose money.`, `它的检验数 ${v} 是负的，进基会亏损。`];
          };
          const options = [["The current basis is optimal", "当前基已是最优"], ...names.map((n) => same(n))].slice(0, 4) as Pair[];
          return chosen(
            rng,
            [
              `In a maximization, the nonbasic variables have reduced costs $${list}$. Which variable should enter, or is the current basis optimal?`,
              `在最大化问题中，非基变量的检验数是 $${list}$。哪个变量应当进基，还是当前基已是最优？`,
            ],
            correct,
            options.map((option, k): Slip => {
              const [en, zh] =
                k === 0
                  ? ([
                      `The reduced cost of $${names[top]}$ is ${largest}, which is positive, so the basis is not yet optimal.`,
                      `$${names[top]}$ 的检验数是 ${largest}，是正的，所以当前基还不是最优的。`,
                    ] as Pair)
                  : reasonFor(k - 1);
              return [option, en, zh];
            }),
            [
              [
                ["Look for positive reduced costs", "找正的检验数"],
                optimal
                  ? ["None of the reduced costs is positive.", "没有一个检验数是正的。"]
                  : [
                      `The positive reduced costs are ${values.filter((v) => v > 0).join(" and ")}.`,
                      `正的检验数是 ${values.filter((v) => v > 0).join(" 和 ")}。`,
                    ],
              ],
              [
                ["Decide", "作出判断"],
                optimal
                  ? [
                      "So no variable can raise the objective, and the current basis is optimal.",
                      "所以没有变量能提高目标值，当前基是最优的。",
                    ]
                  : [`The largest is ${largest}, so $${names[top]}$ enters.`, `最大的是 ${largest}，所以 $${names[top]}$ 进基。`],
              ],
            ],
            optimal
              ? [
                  "Every reduced cost is at most 0, so every pivot would lower the objective or leave it unchanged.",
                  "每个检验数都不超过 0，所以任何主元运算都会降低目标值或使它不变。",
                ]
              : [
                  `Each unit of $${names[top]}$ adds ${largest}, more than any other variable would.`,
                  `$${names[top]}$ 每单位增加 ${largest}，比其他任何变量都多。`,
                ],
          );
        },
      ),
      point(
        "the-change-from-entering",
        ["The change from entering", "进基带来的变化"],
        [
          "If a nonbasic variable enters the basis and rises to the value $\\theta$, the objective changes by its reduced cost times $\\theta$. The ratio test sets $\\theta$. So the gain of a pivot depends on both numbers, and the largest reduced cost does not always bring the largest gain.\n\nA variable with reduced cost 3 that rises to 5 gains $3 \\times 5 = 15$, while one with reduced cost 5 that rises only to 2 gains $10$.\n\nCheck: from an objective of 20, the first pivot reaches $20 + 15 = 35$.\n\n> **Watch out.** Multiply the reduced cost by $\\theta$; adding them mixes a rate per unit with a number of units.",
          "非基变量进基并增加到 $\\theta$ 时，目标值的变化是检验数乘 $\\theta$。比值检验决定 $\\theta$。所以一次主元运算的增益取决于这两个数，检验数最大不一定增益最大。\n\n检验数为 3、增加到 5 的变量增益 $3 \\times 5 = 15$，而检验数为 5、只增加到 2 的变量增益 $10$。\n\n检验：目标值从 20 出发，第一次主元运算后达到 $20 + 15 = 35$。\n\n> **注意。** 要用检验数乘以 $\\theta$；把它们相加，就把每单位的速率和单位个数混在了一起。",
        ],
        (rng) => {
          const r = rng.int(2, 9);
          const theta = rng.int(2, 9);
          const z = rng.int(10, 60);
          return solved(
            [
              `The objective is now ${z}. A variable with reduced cost ${r} enters the basis, and the ratio test gives it the value ${theta}. What is the new objective value?`,
              `目标值现在是 ${z}。一个检验数为 ${r} 的变量进基，比值检验给它的值是 ${theta}。新的目标值是多少？`,
            ],
            z + r * theta,
            [
              [r * theta, `That is only the change; add it to the current ${z}.`, `这只是变化量；还要加上现在的 ${z}。`],
              [z + r, `That counts one unit, but the variable rises to ${theta}.`, `这只算了一个单位，但变量增加到了 ${theta}。`],
              [z + theta, "That adds the value of the variable without its reduced cost.", "这加上了变量的值，却没有乘检验数。"],
              [
                z - r * theta,
                "That subtracts the gain; a positive reduced cost raises a maximum.",
                "这把增益减掉了；正的检验数使最大化的目标值增加。",
              ],
            ],
            [
              [
                ["Find the change", "求变化量"],
                [`The objective rises by $${r} \\times ${theta} = ${r * theta}$.`, `目标值增加 $${r} \\times ${theta} = ${r * theta}$。`],
              ],
              [
                ["Add it on", "加上去"],
                [`The new value is $${z} + ${r * theta} = ${z + r * theta}$.`, `新的值是 $${z} + ${r * theta} = ${z + r * theta}$。`],
              ],
            ],
            [
              `$${z + r * theta} - ${z} = ${r * theta}$, and dividing by the reduced cost ${r} gives back $\\theta = ${theta}$.`,
              `$${z + r * theta} - ${z} = ${r * theta}$，除以检验数 ${r} 又得到 $\\theta = ${theta}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "The simplex multipliers are $y = (2, 1)$, and a nonbasic variable has profit 7 and column $(1, 3)$. Its resources are worth $2(1) + 1(3) = 5$, so its reduced cost is $7 - 5 = 2$: it earns more than it uses, and bringing it in helps.",
    "单纯形乘数是 $y = (2, 1)$，一个非基变量的利润是 7，列是 $(1, 3)$。它所用资源价值 $2(1) + 1(3) = 5$，所以检验数是 $7 - 5 = 2$：它挣的比用的多，让它进基有好处。",
  ],
  ["$5 + 2 = 7$, the profit.", "$5 + 2 = 7$，正是利润。"],
  [
    "compute reduced costs, read them to choose the entering variable or recognize an optimum, and find the change a pivot brings.",
    "计算检验数，读检验数来选择进基变量或判断最优，并求主元运算带来的变化。",
  ],
);

/** inverses are integer two by two matrices used as the inverse of a basis. */
const inverses = [
  [1, 1, 0, 1],
  [1, 0, 2, 1],
  [2, 1, 1, 1],
  [1, 2, 0, 1],
  [3, 1, 2, 1],
  [1, 1, 1, 2],
  [2, 0, 1, 1],
  [1, 0, 3, 1],
] as const;

const revisedSimplex = lesson(
  topic(
    "the-revised-simplex-method",
    ["The Revised Simplex Method", "修正单纯形法"],
    ["Compute only what a pivot needs from the inverse of the basis.", "只用基的逆矩阵算出主元运算需要的量。"],
    ["reduced-costs", "solving-systems-of-equations-using-inverse-matrices"],
    [],
    [
      point(
        "the-basic-values-from-the-inverse",
        ["The basic values from the inverse", "由逆矩阵求基变量的值"],
        [
          "The revised simplex method keeps only the inverse of the basis matrix instead of a full tableau. The values of the basic variables are $x_B = B^{-1} b$. This matters for large sparse programs, where most of a full tableau would be computed and then never used.\n\nWith $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $b = (3, 5)$, the first basic value is $2(3) + 1(5) = 11$ and the second is $1(3) + 1(5) = 8$.\n\nCheck: both values are nonnegative, so this basis is feasible.\n\n> **Watch out.** Each entry of $x_B$ comes from a row of $B^{-1}$ times $b$; multiplying by a column instead gives a different number.",
          "修正单纯形法只保存基矩阵的逆，不保存完整的单纯形表。基变量的值是 $x_B = B^{-1} b$。这对大型稀疏规划很重要，因为完整表的大部分算出来也用不到。\n\n取 $B^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$b = (3, 5)$，第一个基变量的值是 $2(3) + 1(5) = 11$，第二个是 $1(3) + 1(5) = 8$。\n\n检验：两个值都非负，所以这个基可行。\n\n> **注意。** $x_B$ 的每个分量来自 $B^{-1}$ 的一行乘 $b$；改用一列相乘会得到不同的数。",
        ],
        (rng) => {
          const [a, b, c, d] = rng.pick(inverses);
          const [p, q] = [rng.int(2, 12), rng.int(2, 12)];
          const first = rng.bool();
          const [x1, x2] = [a * p + b * q, c * p + d * q];
          const answer = first ? x1 : x2;
          const [r1, r2] = first ? [a, b] : [c, d];
          return solved(
            [
              `The inverse of the basis is $B^{-1} = ${matrix2(a, b, c, d)}$ and $b = ${vector2(p, q)}$. What is the ${first ? "first" : "second"} entry of $x_B$?`,
              `基的逆是 $B^{-1} = ${matrix2(a, b, c, d)}$，$b = ${vector2(p, q)}$。$x_B$ 的第${first ? "一" : "二"}个分量是多少？`,
            ],
            answer,
            [
              [first ? x2 : x1, "That is the other entry of $x_B$.", "这是 $x_B$ 的另一个分量。"],
              [
                first ? a * p + c * q : b * p + d * q,
                "That multiplies a column of the inverse by $b$ instead of a row.",
                "这是用逆矩阵的一列乘 $b$，而不是一行。",
              ],
              [p + q, "That adds the entries of $b$ without using the inverse.", "这把 $b$ 的分量直接相加，没有用逆矩阵。"],
            ],
            [
              [
                ["Take the row", "取出这一行"],
                [
                  `The ${first ? "first" : "second"} row of $B^{-1}$ is $(${r1}, ${r2})$.`,
                  `$B^{-1}$ 的第${first ? "一" : "二"}行是 $(${r1}, ${r2})$。`,
                ],
              ],
              [
                ["Multiply by the right sides", "乘以右端"],
                [`$${r1}(${p}) + ${r2}(${q}) = ${answer}$.`, `$${r1}(${p}) + ${r2}(${q}) = ${answer}$。`],
              ],
            ],
            [
              `The other entry is $${first ? c : a}(${p}) + ${first ? d : b}(${q}) = ${first ? x2 : x1}$, and both values are nonnegative, so the basis is feasible.`,
              `另一个分量是 $${first ? c : a}(${p}) + ${first ? d : b}(${q}) = ${first ? x2 : x1}$，两个值都非负，所以这个基可行。`,
            ],
          );
        },
      ),
      point(
        "the-multipliers-from-the-inverse",
        ["The multipliers from the inverse", "由逆矩阵求乘数"],
        [
          "The simplex multipliers are $y^T = c_B^T B^{-1}$, a row vector built from the costs of the basic variables. They price every resource at once, so each nonbasic column can then be tested with a single product instead of a whole row operation on the tableau.\n\nWith $B^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 2 & 1 \\end{pmatrix}$ and $c_B = (3, 4)$, the multipliers are $3(1) + 4(2) = 11$ and $3(0) + 4(1) = 4$.\n\nCheck: each multiplier uses a column of $B^{-1}$, as a row vector times a matrix requires.\n\n> **Watch out.** $c_B^T$ is a row vector on the left, so it meets the columns of $B^{-1}$, not its rows.",
          "单纯形乘数是 $y^T = c_B^T B^{-1}$，是由基变量成本构成的行向量。它们同时给每种资源定价，所以每个非基列只需一次乘积就能检验，不必对整个表做行运算。\n\n取 $B^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 2 & 1 \\end{pmatrix}$，$c_B = (3, 4)$，乘数是 $3(1) + 4(2) = 11$ 和 $3(0) + 4(1) = 4$。\n\n检验：每个乘数用的是 $B^{-1}$ 的一列，正如行向量乘矩阵所要求的。\n\n> **注意。** $c_B^T$ 是左边的行向量，所以它与 $B^{-1}$ 的列相乘，而不是与行相乘。",
        ],
        (rng) => {
          const [a, b, c, d] = rng.pick(inverses);
          const [p, q] = [rng.int(1, 9), rng.int(1, 9)];
          const first = rng.bool();
          const [y1, y2] = [p * a + q * c, p * b + q * d];
          const answer = first ? y1 : y2;
          const [k1, k2] = first ? [a, c] : [b, d];
          return solved(
            [
              `The inverse of the basis is $B^{-1} = ${matrix2(a, b, c, d)}$ and the basic costs are $c_B = (${p}, ${q})$. What is the ${first ? "first" : "second"} simplex multiplier?`,
              `基的逆是 $B^{-1} = ${matrix2(a, b, c, d)}$，基变量成本是 $c_B = (${p}, ${q})$。第${first ? "一" : "二"}个单纯形乘数是多少？`,
            ],
            answer,
            [
              [first ? y2 : y1, "That is the other multiplier.", "这是另一个乘数。"],
              [
                first ? p * a + q * b : p * c + q * d,
                "That multiplies $c_B$ by a row of the inverse; a row vector times a matrix uses the columns.",
                "这是用 $c_B$ 乘逆矩阵的一行；行向量乘矩阵用的是列。",
              ],
              [p + q, "That adds the basic costs without using the inverse.", "这把基变量成本直接相加，没有用逆矩阵。"],
            ],
            [
              [
                ["Take the column", "取出这一列"],
                [
                  `The ${first ? "first" : "second"} column of $B^{-1}$ is $(${k1}, ${k2})$.`,
                  `$B^{-1}$ 的第${first ? "一" : "二"}列是 $(${k1}, ${k2})$。`,
                ],
              ],
              [
                ["Multiply by the costs", "乘以成本"],
                [`$${p}(${k1}) + ${q}(${k2}) = ${answer}$.`, `$${p}(${k1}) + ${q}(${k2}) = ${answer}$。`],
              ],
            ],
            [
              `The other multiplier is $${p}(${first ? b : a}) + ${q}(${first ? d : c}) = ${first ? y2 : y1}$, from the other column.`,
              `另一个乘数由另一列得到：$${p}(${first ? b : a}) + ${q}(${first ? d : c}) = ${first ? y2 : y1}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "With $B^{-1} = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $b = (3, 4)$, the basic values are $x_B = B^{-1} b = (7, 4)$. With basic costs $c_B = (2, 1)$, the multipliers are $y^T = c_B^T B^{-1} = (2, 3)$. No full tableau is needed.",
    "取 $B^{-1} = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$b = (3, 4)$，基变量的值是 $x_B = B^{-1} b = (7, 4)$。基变量成本 $c_B = (2, 1)$ 时，乘数是 $y^T = c_B^T B^{-1} = (2, 3)$。不需要完整的单纯形表。",
  ],
  [
    "$B = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}$ takes $(7, 4)$ back to $(7 - 4, 4) = (3, 4) = b$.",
    "$B = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}$ 把 $(7, 4)$ 变回 $(7 - 4, 4) = (3, 4) = b$。",
  ],
  ["compute the basic values and the simplex multipliers from the inverse of the basis.", "由基的逆矩阵计算基变量的值和单纯形乘数。"],
);

const bigM = lesson(
  topic(
    "the-big-m-method",
    ["The Big M Method", "大 M 法"],
    ["Penalize artificial variables so heavily that they leave the basis.", "给人工变量极重的惩罚，迫使它们离开基。"],
    ["the-two-phase-method", "minimization-and-surplus-variables"],
    [],
    [
      point(
        "comparing-expressions-in-m",
        ["Comparing expressions in M", "比较含 M 的式子"],
        [
          "The Big M method gives every artificial variable an enormous cost $M$ in a minimization. Costs then have the form $aM + b$, and they are compared as $M$ grows: the coefficient of $M$ decides first, and the constant only matters when those coefficients are equal.\n\nFor a large $M$, $2M + 50$ is smaller than $3M + 1$: their difference $M - 49$ is positive once $M > 49$.\n\nCheck: at $M = 100$, the costs are 250 and 301.\n\n> **Watch out.** A large constant cannot outweigh a larger coefficient of $M$; look at the constants only when the coefficients of $M$ are equal.",
          "大 M 法在最小化问题中给每个人工变量一个极大的成本 $M$。于是成本形如 $aM + b$，比较时考虑 $M$ 很大的情形：先看 $M$ 的系数，系数相等时才看常数。\n\n当 $M$ 很大时，$2M + 50$ 比 $3M + 1$ 小：它们的差 $M - 49$ 在 $M > 49$ 时为正。\n\n检验：$M = 100$ 时，两个成本是 250 和 301。\n\n> **注意。** 大的常数抵不过 $M$ 的较大系数；只有 $M$ 的系数相等时才看常数。",
        ],
        (rng) => {
          const a = rng.int(1, 6);
          const tie = rng.bool(0.4);
          const c = tie ? a : a + rng.int(1, 4);
          const b = tie ? rng.int(1, 40) : rng.int(30, 90);
          const d = tie ? b + rng.int(1, 20) : rng.int(1, 20);
          const write = (u: number, v: number) => `${u === 1 ? "" : u}M + ${v}`;
          const larger = (u: number): Pair => [`Its coefficient of $M$ is ${u}, larger than ${a}.`, `它的 $M$ 系数是 ${u}，比 ${a} 大。`];
          return chosen(
            rng,
            ["For a very large $M$, which cost is smallest?", "当 $M$ 非常大时，哪个成本最小？"],
            same(write(a, b)),
            [
              [
                same(write(c, d)),
                ...(tie
                  ? ([
                      `Its coefficient of $M$ is ${a} too, but its constant ${d} is larger than ${b}.`,
                      `它的 $M$ 系数也是 ${a}，但常数 ${d} 比 ${b} 大。`,
                    ] as Pair)
                  : ([
                      `Its coefficient of $M$ is ${c}, larger than ${a}, and for a large $M$ its smaller constant cannot make up for it.`,
                      `它的 $M$ 系数是 ${c}，比 ${a} 大；$M$ 很大时，较小的常数弥补不了。`,
                    ] as Pair)),
              ],
              [same(write(c + 1, b)), ...larger(c + 1)],
              [same(write(a + 2, d)), ...larger(a + 2)],
            ],
            [
              [
                ["Compare the coefficients first", "先比较系数"],
                [
                  `The coefficients of $M$ are ${a}, ${c}, ${c + 1} and ${a + 2}, and the smallest is ${a}${tie ? ", shared by two costs" : ""}.`,
                  `$M$ 的系数是 ${a}，${c}，${c + 1} 和 ${a + 2}，最小的是 ${a}${tie ? "，有两个成本并列" : ""}。`,
                ],
              ],
              [
                ["Then the constants", "再看常数"],
                tie
                  ? [
                      `Between $${write(a, b)}$ and $${write(a, d)}$, the constant ${b} is smaller.`,
                      `在 $${write(a, b)}$ 和 $${write(a, d)}$ 之间，常数 ${b} 较小。`,
                    ]
                  : [
                      `Only $${write(a, b)}$ has the coefficient ${a}, so its constant does not matter.`,
                      `只有 $${write(a, b)}$ 的系数是 ${a}，所以它的常数无关紧要。`,
                    ],
              ],
            ],
            tie
              ? [
                  `The difference $(${write(a, d)}) - (${write(a, b)}) = ${d - b}$ is positive for every $M$.`,
                  `差 $(${write(a, d)}) - (${write(a, b)}) = ${d - b}$ 对每个 $M$ 都是正的。`,
                ]
              : [
                  `The difference $(${write(c, d)}) - (${write(a, b)}) = ${c - a === 1 ? "" : c - a}M - ${b - d}$ is positive once $M > ${Q.of(b - d, c - a).toLatex()}$.`,
                  `差 $(${write(c, d)}) - (${write(a, b)}) = ${c - a === 1 ? "" : c - a}M - ${b - d}$ 在 $M > ${Q.of(b - d, c - a).toLatex()}$ 时为正。`,
                ],
          );
        },
      ),
      point(
        "the-starting-penalty",
        ["The starting penalty", "初始惩罚"],
        [
          "The Big M method starts with every artificial variable basic at the value of the right side of its row, and all other variables at zero. So the starting cost is $M$ times the sum of those right sides. Pivoting then drives the artificial variables out, and this large penalty falls away.\n\nWith artificial variables in rows with right sides 5 and 7, the starting cost is $(5 + 7)M = 12M$.\n\nCheck: at the start the other variables are 0, so they add nothing to the cost.\n\n> **Watch out.** Add the values of the artificial variables, the right sides, not the number of artificial variables.",
          "大 M 法开始时，每个人工变量都是基变量，取值等于所在行的右端，其他变量都为零。所以初始成本是 $M$ 乘这些右端之和。之后通过主元运算把人工变量换出去，这个大惩罚也就消失了。\n\n人工变量所在行的右端是 5 和 7 时，初始成本是 $(5 + 7)M = 12M$。\n\n检验：开始时其他变量都是 0，对成本没有贡献。\n\n> **注意。** 要加的是人工变量的值，也就是右端，而不是人工变量的个数。",
        ],
        (rng) => {
          const [p, q] = [rng.int(4, 30), rng.int(4, 30)];
          const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
          return solved(
            [
              `Minimize $${a}x + ${b}y + M a_1 + M a_2$ subject to $x + y + a_1 = ${p}$ and $x + 2y + a_2 = ${q}$. At the starting basis $a_1, a_2$, the cost is $kM$. What is $k$?`,
              `在 $x + y + a_1 = ${p}$ 和 $x + 2y + a_2 = ${q}$ 的条件下，最小化 $${a}x + ${b}y + M a_1 + M a_2$。初始基 $a_1, a_2$ 处成本是 $kM$。$k$ 是多少？`,
            ],
            p + q,
            [
              [2, "That counts the artificial variables instead of adding their values.", "这数的是人工变量的个数，而不是把它们的值相加。"],
              [p, "That counts only $a_1$, forgetting $a_2$.", "这只算了 $a_1$，忘了 $a_2$。"],
              [q, "That counts only $a_2$, forgetting $a_1$.", "这只算了 $a_2$，忘了 $a_1$。"],
              [
                a + b,
                "That adds the costs of $x$ and $y$, which are zero at the start.",
                "这把 $x$ 和 $y$ 的成本系数相加了，而开始时它们取零。",
              ],
            ],
            [
              [
                ["Read the starting values", "读出初始值"],
                [`At the start $x = y = 0$, so $a_1 = ${p}$ and $a_2 = ${q}$.`, `开始时 $x = y = 0$，所以 $a_1 = ${p}$，$a_2 = ${q}$。`],
              ],
              [
                ["Add the penalties", "加上惩罚"],
                [
                  `The cost is $${p}M + ${q}M = ${p + q}M$, so $k = ${p + q}$.`,
                  `成本是 $${p}M + ${q}M = ${p + q}M$，所以 $k = ${p + q}$。`,
                ],
              ],
            ],
            [
              `$${a}(0) + ${b}(0) + ${p}M + ${q}M = ${p + q}M$, as the objective gives at the starting basis.`,
              `在初始基处目标给出 $${a}(0) + ${b}(0) + ${p}M + ${q}M = ${p + q}M$。`,
            ],
          );
        },
      ),
      point(
        "an-artificial-variable-at-the-end",
        ["An artificial variable at the end", "最后还有人工变量"],
        [
          "When the Big M method stops with an artificial variable still positive, even that enormous penalty could not remove it. So no plan meets the original constraints, and the program is infeasible. If all artificial variables are zero at the end, the plan found is optimal for the original program.\n\nIf the method stops at an optimal tableau with $a_1 = 2$, the original program is infeasible.\n\nCheck: a feasible plan would cost no $M$ at all, far less than the $2M$ this optimum pays, so the method would have found it.\n\n> **Watch out.** An optimal tableau with a positive artificial variable does not give a plan for the original program; it proves that none exists.",
          "大 M 法结束时如果还有人工变量为正，说明连极大的惩罚也去不掉它。所以没有方案能满足原约束，规划无可行解。如果最后所有人工变量都是零，得到的方案就是原规划的最优解。\n\n如果方法在最优表处停止，而 $a_1 = 2$，原规划就无可行解。\n\n检验：可行方案完全不用付 $M$，远比这个最优解付出的 $2M$ 少，方法本会找到它。\n\n> **注意。** 人工变量为正的最优表并不给出原规划的方案；它证明这样的方案不存在。",
        ],
        (rng) => {
          const positive = rng.bool();
          const v = rng.int(1, 9);
          const [x, y] = [rng.int(0, 9), rng.int(1, 9)];
          const options: [Pair, Pair, Pair] = [
            ["The original program is infeasible", "原规划无可行解"],
            ["The plan is optimal for the original program", "这个方案是原规划的最优解"],
            ["The original program is unbounded", "原规划无界"],
          ];
          return chosen(
            rng,
            [
              `The Big M method stops at an optimal tableau with $x = ${x}$, $y = ${y}$ and artificial variable $a_1 = ${positive ? v : 0}$. What does this show?`,
              `大 M 法在最优表处停止，$x = ${x}$，$y = ${y}$，人工变量 $a_1 = ${positive ? v : 0}$。这说明什么？`,
            ],
            positive ? options[0] : options[1],
            [
              positive
                ? [
                    options[1],
                    `The artificial variable $a_1 = ${v}$ is not part of the original program, so this plan does not satisfy its constraints.`,
                    `人工变量 $a_1 = ${v}$ 不属于原规划，所以这个方案不满足原约束。`,
                  ]
                : [
                    options[0],
                    "Every artificial variable is zero, so the plan satisfies the original constraints.",
                    "所有人工变量都是零，所以方案满足原约束。",
                  ],
              [
                options[2],
                "The method stopped at an optimal tableau, which shows a finite optimum, not an unbounded one.",
                "方法停在最优表处，说明最优值有限，而不是无界。",
              ],
              [
                ["More pivots are needed", "还需要继续主元运算"],
                "The tableau is already optimal, so no pivot can improve it.",
                "单纯形表已经最优，没有主元运算能改进它。",
              ],
            ],
            [
              [
                ["Read the artificial variable", "看人工变量"],
                positive
                  ? [`$a_1 = ${v}$ stays positive although it costs $M$ per unit.`, `$a_1 = ${v}$ 每单位成本是 $M$，却仍然为正。`]
                  : ["$a_1 = 0$, so every artificial variable has left the plan.", "$a_1 = 0$，所以所有人工变量都已离开方案。"],
              ],
              [
                ["Draw the conclusion", "得出结论"],
                positive
                  ? [
                      "Not even an enormous penalty removes it, so no plan satisfies the original constraints.",
                      "连极大的惩罚也去不掉它，所以没有方案满足原约束。",
                    ]
                  : [
                      `The plan $x = ${x}$, $y = ${y}$ satisfies the original constraints, and the tableau shows it is optimal.`,
                      `方案 $x = ${x}$，$y = ${y}$ 满足原约束，单纯形表又说明它最优。`,
                    ],
              ],
            ],
            positive
              ? [
                  `A feasible plan would pay no $M$ at all, far less than the $${v}M$ this optimum pays, so the optimum would not keep $a_1 = ${v}$.`,
                  `可行方案完全不用付 $M$，远比这个最优解付出的 $${v}M$ 少，所以最优解不会保留 $a_1 = ${v}$。`,
                ]
              : [
                  `With $a_1 = 0$ the penalty term is 0, so the cost of the plan is its cost in the original program.`,
                  `$a_1 = 0$ 时惩罚项为 0，所以方案的成本就是它在原规划中的成本。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "Minimize $x + 2y$ subject to $x + y \\ge 3$. Writing $x + y - s + a = 3$ and adding $Ma$ to the cost, the method starts at $a = 3$ with cost $3M$. One pivot brings in $x = 3$, drives $a$ to 0, and lowers the cost to 3.",
    "在 $x + y \\ge 3$ 的条件下使 $x + 2y$ 最小。写成 $x + y - s + a = 3$，并在成本中加上 $Ma$，方法从 $a = 3$ 开始，成本是 $3M$。一次主元运算让 $x = 3$ 进基，使 $a$ 变为 0，成本降到 3。",
  ],
  ["for any large $M$, a cost of 3 is far below $3M$.", "对任何很大的 $M$，成本 3 都远低于 $3M$。"],
  [
    "compare costs that involve $M$, find the starting penalty, and read what a final artificial variable says.",
    "比较含 $M$ 的成本，求初始惩罚，并解读最后剩下的人工变量说明什么。",
  ],
);

const dualSimplex = lesson(
  topic(
    "the-dual-simplex-method",
    ["The Dual Simplex Method", "对偶单纯形法"],
    ["Restore feasibility while keeping the objective row optimal.", "在保持目标行最优的同时恢复可行性。"],
    ["strong-duality-and-complementary-slackness", "pivoting-in-the-simplex-method"],
    [],
    [
      point(
        "the-leaving-row",
        ["The leaving row", "离基行"],
        [
          "The dual simplex method starts from a tableau whose objective row is already optimal but whose right side has negative entries. It therefore chooses the leaving variable first, usually the row with the most negative right side. This is the reverse of the ordinary method, which chooses the entering variable first.\n\nWith right sides 5, $-2$ and $-7$, the most negative is $-7$, so the basic variable of row 3 leaves.\n\nCheck: $-7 < -2 < 5$.\n\n> **Watch out.** The leaving row has the most negative right side, not the largest; a positive right side is already feasible.",
          "对偶单纯形法从目标行已经最优、右端却有负数的表开始。所以它先选离基变量，通常取右端最负的那一行。这与普通单纯形法相反，后者先选进基变量。\n\n右端是 5，$-2$ 和 $-7$ 时，最负的是 $-7$，所以第 3 行的基变量离基。\n\n检验：$-7 < -2 < 5$。\n\n> **注意。** 离基行的右端是最负的，而不是最大的；右端为正的行已经可行。",
        ],
        (rng) => {
          const low = -rng.int(5, 12);
          const rows = rng.shuffle([low, -rng.int(1, 4), rng.int(1, 9)]);
          const row = rows.indexOf(low) + 1;
          const big = rows.indexOf(Math.max(...rows)) + 1;
          const otherNegative = rows.findIndex((v) => v < 0 && v !== low) + 1;
          return solved(
            [
              `In a dual simplex step, the right sides of rows 1, 2 and 3 are $${rows.join(", ")}$. Which row number gives the leaving variable?`,
              `对偶单纯形法的一步中，第 1、2、3 行的右端是 $${rows.join(", ")}$。离基变量在第几行？`,
            ],
            row,
            [
              [
                otherNegative,
                `That row's right side is negative too, but ${low} is more negative.`,
                `这一行的右端也是负的，但 ${low} 更负。`,
              ],
              [big, "That row has the largest right side, which is already feasible.", "这一行的右端最大，它已经可行。"],
            ],
            [
              [
                ["Find the negative right sides", "找负的右端"],
                [
                  `The negative right sides are ${rows.filter((v) => v < 0).join(" and ")}, and they mark infeasible basic values.`,
                  `负的右端是 ${rows.filter((v) => v < 0).join(" 和 ")}，它们表示不可行的基变量值。`,
                ],
              ],
              [
                ["Take the most negative", "取最负的"],
                [
                  `The most negative is ${low}, in row ${row}, so that row's basic variable leaves.`,
                  `最负的是第 ${row} 行的 ${low}，所以这一行的基变量离基。`,
                ],
              ],
            ],
            [`${low} is below every other right side in $${rows.join(", ")}$.`, `${low} 比 $${rows.join(", ")}$ 中其他每个右端都小。`],
          );
        },
      ),
      point(
        "the-dual-ratio-test",
        ["The dual ratio test", "对偶比值检验"],
        [
          "Once the leaving row is chosen, only its negative entries can make its right side rise. Among those columns, take the smallest ratio of the objective row entry to the size of the row entry. That choice keeps every entry of the objective row nonnegative, so the tableau stays dual feasible.\n\nIf the leaving row has entries $-2$, $-4$ and $3$ and the objective row has 6, 8 and 5, the ratios are $\\frac{6}{2} = 3$ and $\\frac{8}{4} = 2$, so the second variable enters.\n\nCheck: the third column has a positive entry, so it cannot raise the right side and is skipped.\n\n> **Watch out.** Divide by the size of the negative entry, and skip positive entries; the smallest ratio, not the most negative entry, decides.",
          "选定离基行后，只有该行的负系数才能使右端增大。在这些列中，取目标行系数与该行系数绝对值之比最小的一列。这样目标行的系数都保持非负，表格仍然对偶可行。\n\n如果离基行的系数是 $-2$，$-4$ 和 $3$，目标行是 6，8 和 5，比值是 $\\frac{6}{2} = 3$ 和 $\\frac{8}{4} = 2$，所以第二个变量进基。\n\n检验：第三列的系数为正，不能使右端增大，所以跳过。\n\n> **注意。** 要除以负系数的绝对值，并跳过正系数；起决定作用的是最小比值，而不是最负的系数。",
        ],
        (rng) => {
          const names = ["x_1", "x_2", "x_3"];
          const entries = rng.shuffle([-rng.int(1, 3), -rng.int(4, 6), rng.int(1, 5)]);
          const costs = entries.map(() => rng.int(1, 6) * 12);
          const ratio = entries.map((e, i) => (e < 0 ? (costs[i] as number) / -e : Number.POSITIVE_INFINITY));
          if (ratio.filter((r) => r === Math.min(...ratio)).length > 1) {
            const k = entries.findIndex((e) => e < 0);
            costs[k] = (costs[k] as number) + 1;
            ratio[k] = (costs[k] as number) / -(entries[k] as number);
          }
          const best = ratio.indexOf(Math.min(...ratio));
          const shown = (i: number) => Q.of(costs[i] as number, -(entries[i] as number)).toLatex();
          const negatives = [0, 1, 2].filter((i) => (entries[i] as number) < 0);
          return chosen(
            rng,
            [
              `The leaving row has entries $${entries.join(", ")}$ under $${names.join(", ")}$, and the objective row has entries $${costs.join(", ")}$. Which variable enters?`,
              `离基行在 $${names.join(", ")}$ 下的系数是 $${entries.join(", ")}$，目标行的系数是 $${costs.join(", ")}$。哪个变量进基？`,
            ],
            same(names[best] as string),
            [0, 1, 2]
              .filter((i) => i !== best)
              .map(
                (i): Slip =>
                  (entries[i] as number) > 0
                    ? [
                        same(names[i] as string),
                        `Its entry ${entries[i]} is positive, so it cannot make the right side rise.`,
                        `它的系数 ${entries[i]} 是正的，不能使右端增大。`,
                      ]
                    : [
                        same(names[i] as string),
                        `Its ratio $${shown(i)}$ is larger than the ratio $${shown(best)}$ of $${names[best]}$.`,
                        `它的比值 $${shown(i)}$ 比 $${names[best]}$ 的比值 $${shown(best)}$ 大。`,
                      ],
              ),
            [
              [
                ["Keep the negative entries", "保留负系数"],
                [
                  `Only $${negatives.map((i) => names[i]).join("$ and $")}$ have negative entries in the leaving row.`,
                  `离基行中只有 $${negatives.map((i) => names[i]).join("$ 和 $")}$ 的系数是负的。`,
                ],
              ],
              [
                ["Compare the ratios", "比较比值"],
                [
                  `Their ratios are ${negatives.map((i) => `$\\frac{${costs[i]}}{${-(entries[i] as number)}} = ${shown(i)}$`).join(" and ")}, and the smallest belongs to $${names[best]}$.`,
                  `它们的比值是 ${negatives.map((i) => `$\\frac{${costs[i]}}{${-(entries[i] as number)}} = ${shown(i)}$`).join(" 和 ")}，最小的属于 $${names[best]}$。`,
                ],
              ],
            ],
            [
              `Entering $${names[best]}$ subtracts $${shown(best)}$ times the size of each entry from the objective row, which leaves every entry nonnegative.`,
              `$${names[best]}$ 进基时，目标行减去 $${shown(best)}$ 乘各系数的绝对值，每个元素都保持非负。`,
            ],
          );
        },
      ),
      point(
        "a-row-with-no-negative-entry",
        ["A row with no negative entry", "没有负系数的行"],
        [
          "If the leaving row has a negative right side but no negative entries, then that row reads as a sum of nonnegative terms equal to a negative number. No choice of nonnegative variables can satisfy it, so the original program is infeasible. In dual terms, the dual program is unbounded.\n\nThe row $x_1 + 2x_3 + x_4 = -3$, with all variables nonnegative, has a left side of at least 0, so it can never equal $-3$, and the program is infeasible.\n\nCheck: any nonnegative values give a left side of at least 0, which is more than $-3$.\n\n> **Watch out.** A negative right side alone is not infeasibility; it needs a row with no negative entry to push it up.",
          "如果离基行右端为负，却没有负系数，那么这一行就是非负项之和等于负数。非负变量怎么取都满足不了，所以原规划无可行解。用对偶的话说，对偶规划无界。\n\n行 $x_1 + 2x_3 + x_4 = -3$ 中所有变量都非负，左边至少是 0，永远不可能等于 $-3$，所以规划无可行解。\n\n检验：任何非负的取值都使左边至少为 0，比 $-3$ 大。\n\n> **注意。** 只有右端为负并不说明无解；还要这一行没有能把它推高的负系数。",
        ],
        (rng) => {
          const hasNegative = rng.bool();
          const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
          const rhs = -rng.int(1, 9);
          const written = hasNegative ? `x_1 + ${a} x_3 - ${b} x_4 = ${rhs}` : `x_1 + ${a} x_3 + ${b} x_4 = ${rhs}`;
          const infeasible_: Pair = ["The program is infeasible", "规划无可行解"];
          const pivot: Pair = [`$x_4$ can enter, and the method continues`, `$x_4$ 可以进基，方法继续`];
          return chosen(
            rng,
            [
              `In a dual simplex step, the leaving row reads $${written}$, with all variables nonnegative. What follows?`,
              `对偶单纯形法的一步中，离基行是 $${written}$，所有变量都非负。接下来会怎样？`,
            ],
            hasNegative ? pivot : infeasible_,
            [
              hasNegative
                ? [
                    infeasible_,
                    `The entry $-${b}$ is negative, so raising $x_4$ can make the row feasible.`,
                    `系数 $-${b}$ 为负，增大 $x_4$ 可以使这一行可行。`,
                  ]
                : [
                    pivot,
                    `The entry of $x_4$ is ${b}, which is positive, so raising $x_4$ cannot lift the right side.`,
                    `$x_4$ 的系数是 ${b}，是正的，增大 $x_4$ 不能使右端增大。`,
                  ],
              [
                ["The current plan is optimal", "当前方案已是最优"],
                `The right side ${rhs} is negative, so the current plan is not even feasible.`,
                `右端 ${rhs} 是负的，所以当前方案连可行都不是。`,
              ],
              [
                ["The objective is unbounded", "目标无界"],
                "The dual simplex method keeps the objective row optimal; this row speaks about feasibility, not an unbounded objective.",
                "对偶单纯形法保持目标行最优；这一行说的是可行性，而不是目标无界。",
              ],
            ],
            [
              [
                ["Look for a negative entry", "找负系数"],
                hasNegative
                  ? [`The entry of $x_4$ is $-${b}$, which is negative.`, `$x_4$ 的系数是 $-${b}$，是负的。`]
                  : ["Every entry of the row is positive.", "这一行的每个系数都是正的。"],
              ],
              [
                ["Draw the conclusion", "得出结论"],
                hasNegative
                  ? [
                      "So $x_4$ can enter and raise the basic variable toward zero, and the method continues.",
                      "所以 $x_4$ 可以进基，把基变量推向零，方法继续。",
                    ]
                  : [
                      `A sum of nonnegative terms cannot equal $${rhs}$, so no feasible plan exists.`,
                      `非负项之和不可能等于 $${rhs}$，所以不存在可行方案。`,
                    ],
              ],
            ],
            hasNegative
              ? [
                  `With $x_3 = 0$, the row gives $x_1 = ${rhs} + ${coef(b)}x_4$, which reaches 0 at $x_4 = ${Q.of(-rhs, b).toLatex()}$.`,
                  `取 $x_3 = 0$，这一行给出 $x_1 = ${rhs} + ${coef(b)}x_4$，在 $x_4 = ${Q.of(-rhs, b).toLatex()}$ 时变为 0。`,
                ]
              : [
                  `For nonnegative values, $x_1 + ${coef(a)}x_3 + ${coef(b)}x_4 \\ge 0 > ${rhs}$.`,
                  `对非负的取值，$x_1 + ${coef(a)}x_3 + ${coef(b)}x_4 \\ge 0 > ${rhs}$。`,
                ],
          );
        },
      ),
    ],
  ),
  [
    "A tableau has an optimal objective row but right sides 4 and $-3$, so the basic variable of the second row leaves. That row has entries $-1$ and $-2$ under $x_3$ and $x_4$, and the objective row has 2 and 6 there. The ratios $\\frac{2}{1} = 2$ and $\\frac{6}{2} = 3$ make $x_3$ enter.",
    "一个表的目标行已经最优，但右端是 4 和 $-3$，所以第二行的基变量离基。这一行在 $x_3$ 和 $x_4$ 下的系数是 $-1$ 和 $-2$，目标行在那里是 2 和 6。比值 $\\frac{2}{1} = 2$ 和 $\\frac{6}{2} = 3$ 使 $x_3$ 进基。",
  ],
  [
    "after the pivot the $x_4$ entry of the objective row is $6 - 2(2) = 2$, still nonnegative.",
    "主元运算后目标行中 $x_4$ 的元素是 $6 - 2(2) = 2$，仍然非负。",
  ],
  [
    "choose the leaving row and the entering variable of a dual simplex step, and recognize a row that proves infeasibility.",
    "选择对偶单纯形法一步中的离基行和进基变量，并识别证明无解的行。",
  ],
);

const ranging = lesson(
  topic(
    "right-hand-side-ranging",
    ["Right-Hand Side Ranging", "右端项的范围"],
    ["Find how far a resource can change before the optimal basis changes.", "求资源变化多少时最优基才会改变。"],
    ["sensitivity-analysis", "the-revised-simplex-method"],
    [],
    [
      point(
        "how-far-a-resource-can-rise",
        ["How far a resource can rise", "资源最多能增加多少"],
        [
          "Changing a right side by $\\Delta$ changes the basic values to $x_B + \\Delta d$, where $d$ is the matching column of $B^{-1}$. The basis stays optimal while these values stay nonnegative. So only the entries of $d$ with the opposite sign limit the change, and the tightest of those ratios sets the range.\n\nWith $x_B = (12, 6)$ and $d = (2, -3)$, a rise of $\\Delta$ gives $(12 + 2\\Delta, 6 - 3\\Delta)$, so the rise can be at most $\\frac{6}{3} = 2$.\n\nCheck: at $\\Delta = 2$ the values are $16$ and $0$, both nonnegative.\n\n> **Watch out.** Only the entry with the opposite sign limits the change; the other value grows and never reaches zero.",
          "右端改变 $\\Delta$ 时，基变量的值变为 $x_B + \\Delta d$，其中 $d$ 是 $B^{-1}$ 对应的列。只要这些值保持非负，当前基就仍然最优。所以只有符号相反的分量才限制变化，其中最紧的比值决定范围。\n\n取 $x_B = (12, 6)$，$d = (2, -3)$，增加 $\\Delta$ 后值为 $(12 + 2\\Delta, 6 - 3\\Delta)$，所以最多能增加 $\\frac{6}{3} = 2$。\n\n检验：$\\Delta = 2$ 时值是 $16$ 和 $0$，都非负。\n\n> **注意。** 只有符号相反的分量才限制变化；另一个值在增大，永远不会变成零。",
        ],
        (rng) => {
          const up = rng.bool();
          const [p, q] = [rng.int(1, 6) * 12, rng.int(1, 6) * 12];
          const [u, v] = [rng.int(1, 4), rng.int(1, 4)];
          const limit = (up ? q : p) / (up ? v : u);
          const col = vector2(u, -v);
          return solved(
            [
              `The optimal basic values are $x_B = ${vector2(p, q)}$, and the column of $B^{-1}$ for a resource is $${col}$. What is the largest ${up ? "increase" : "decrease"} in that resource that keeps the basis feasible?`,
              `最优基变量的值是 $x_B = ${vector2(p, q)}$，某种资源在 $B^{-1}$ 中对应的列是 $${col}$。保持当前基可行时，这种资源最多能${up ? "增加" : "减少"}多少？`,
            ],
            limit,
            [
              [
                (up ? p : q) / (up ? u : v),
                "That uses the value that grows; only the entry with the opposite sign limits the change.",
                "这用的是在增大的那个值；只有符号相反的分量才限制变化。",
              ],
              [
                up ? q : p,
                "That is the basic value alone, without dividing by the entry of the column.",
                "这只是基变量的值，没有除以列中的元素。",
              ],
              [up ? v : u, "That is the entry of the column, not the range.", "这是列中的元素，不是范围。"],
              [
                Q.of(p + q, u + v),
                "That pools both rows, but each value must stay nonnegative on its own.",
                "这把两行合在一起了，但每个值必须各自保持非负。",
              ],
            ],
            [
              [
                ["Write the values", "写出各值"],
                up
                  ? [
                      `A rise of $\\Delta$ gives $${p} + ${coef(u)}\\Delta$ and $${q} - ${coef(v)}\\Delta$; only the second can fall.`,
                      `增加 $\\Delta$ 后值为 $${p} + ${coef(u)}\\Delta$ 和 $${q} - ${coef(v)}\\Delta$；只有第二个会减小。`,
                    ]
                  : [
                      `A fall of $\\Delta$ gives $${p} - ${coef(u)}\\Delta$ and $${q} + ${coef(v)}\\Delta$; only the first can fall.`,
                      `减少 $\\Delta$ 后值为 $${p} - ${coef(u)}\\Delta$ 和 $${q} + ${coef(v)}\\Delta$；只有第一个会减小。`,
                    ],
              ],
              [
                ["Find where it reaches zero", "求它变为零的位置"],
                [
                  `It reaches zero at $\\Delta = \\frac{${up ? q : p}}{${up ? v : u}} = ${limit}$.`,
                  `它在 $\\Delta = \\frac{${up ? q : p}}{${up ? v : u}} = ${limit}$ 时变为零。`,
                ],
              ],
            ],
            up
              ? [
                  `At $\\Delta = ${limit}$ the values are ${p + u * limit} and 0, both nonnegative.`,
                  `$\\Delta = ${limit}$ 时值是 ${p + u * limit} 和 0，都非负。`,
                ]
              : [
                  `At $\\Delta = ${limit}$ the values are 0 and ${q + v * limit}, both nonnegative.`,
                  `$\\Delta = ${limit}$ 时值是 0 和 ${q + v * limit}，都非负。`,
                ],
          );
        },
      ),
      point(
        "the-plan-after-a-small-change",
        ["The plan after a small change", "小变化后的方案"],
        [
          "Inside the allowed range the same variables stay basic, but their values shift in proportion to the change in the resource. There is no need to solve the program again: add $\\Delta$ times the matching column of the inverse to the current basic values, and the new plan is ready.\n\nWith $x_B = (30, 20)$, column $(2, -1)$ and a rise of 3, the new values are $30 + 3(2) = 36$ and $20 + 3(-1) = 17$.\n\nCheck: both values are nonnegative, so the basis stays feasible.\n\n> **Watch out.** Multiply the change by the entry of the column, sign included; a negative entry makes that value fall.",
          "在允许范围内，基变量不变，但它们的值随资源的变化按比例移动。不必重新求解：把逆矩阵对应的列乘 $\\Delta$，加到当前基变量的值上，就得到新方案。\n\n取 $x_B = (30, 20)$，列为 $(2, -1)$，增加 3，新值是 $30 + 3(2) = 36$ 和 $20 + 3(-1) = 17$。\n\n检验：两个值都非负，所以基仍然可行。\n\n> **注意。** 变化量要乘以列中的元素，连同符号；负的元素使那个值减小。",
        ],
        (rng) => {
          const [p, q] = [rng.int(20, 60), rng.int(20, 60)];
          const [u, v] = [rng.int(1, 4), rng.int(1, 4)];
          const delta = rng.int(1, 5);
          const first = rng.bool();
          const [x1, x2] = [p + u * delta, q - v * delta];
          return solved(
            [
              `The optimal basic values are $x_B = ${vector2(p, q)}$, and the column of $B^{-1}$ for a resource is $${vector2(u, -v)}$. The resource rises by ${delta}, and the basis stays optimal. What is the new value of the ${first ? "first" : "second"} basic variable?`,
              `最优基变量的值是 $x_B = ${vector2(p, q)}$，某种资源在 $B^{-1}$ 中对应的列是 $${vector2(u, -v)}$。资源增加 ${delta}，当前基仍然最优。第${first ? "一" : "二"}个基变量的新值是多少？`,
            ],
            first ? x1 : x2,
            [
              [first ? x2 : x1, "That is the new value of the other basic variable.", "这是另一个基变量的新值。"],
              [
                first ? p + delta : q - delta,
                "That shifts the value by the change alone, without the entry of the column.",
                "这只按变化量移动，没有乘列中的元素。",
              ],
              [first ? p - u * delta : q + v * delta, "That moves the value in the wrong direction.", "这让值朝相反的方向移动了。"],
            ],
            [
              [
                ["Scale the column", "列乘以变化量"],
                [
                  `The change adds $${delta}(${first ? u : -v}) = ${first ? u * delta : -v * delta}$ to the ${first ? "first" : "second"} value.`,
                  `变化使第${first ? "一" : "二"}个值加上 $${delta}(${first ? u : -v}) = ${first ? u * delta : -v * delta}$。`,
                ],
              ],
              [
                ["Add it on", "加上去"],
                first
                  ? [`The new value is $${p} + ${u * delta} = ${x1}$.`, `新值是 $${p} + ${u * delta} = ${x1}$。`]
                  : [`The new value is $${q} - ${v * delta} = ${x2}$.`, `新值是 $${q} - ${v * delta} = ${x2}$。`],
              ],
            ],
            [
              `The new values ${x1} and ${x2} are both nonnegative, so the basis stays feasible, as the question says.`,
              `新值 ${x1} 和 ${x2} 都非负，所以基仍然可行，与题意一致。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "The optimal basic values are $x_B = (6, 8)$, and a resource has column $d = (1, -2)$ in $B^{-1}$. A rise of $\\Delta$ gives $(6 + \\Delta, 8 - 2\\Delta)$, which stays nonnegative while $\\Delta \\le 4$; within that range the basis stays optimal.",
    "最优基变量的值是 $x_B = (6, 8)$，某种资源在 $B^{-1}$ 中的列是 $d = (1, -2)$。增加 $\\Delta$ 后值为 $(6 + \\Delta, 8 - 2\\Delta)$，在 $\\Delta \\le 4$ 时保持非负；在这个范围内基仍然最优。",
  ],
  ["at $\\Delta = 4$ the values are $10$ and $0$.", "$\\Delta = 4$ 时值是 $10$ 和 $0$。"],
  [
    "find how far a resource can change before the basis changes, and update the plan for a change inside that range.",
    "求资源在基改变之前能变化多少，并在范围内的变化后更新方案。",
  ],
);

const gomory = lesson(
  topic(
    "gomory-cutting-planes",
    ["Gomory Cutting Planes", "戈莫里割平面"],
    ["Cut off a fractional optimum without losing any integer point.", "切掉分数最优解，同时不丢失任何整点。"],
    ["integer-programming", "the-simplex-tableau"],
    [],
    [
      point(
        "the-fractional-part",
        ["The fractional part", "小数部分"],
        [
          "The fractional part of a number is what remains after subtracting the largest integer not above it, so it always lies from 0 up to but not including 1. For a negative number this is not the digits after the point: the fractional part of $-\\frac{3}{4}$ is $\\frac{1}{4}$, since the integer below it is $-1$.\n\nThe largest integer not above $-\\frac{7}{3}$ is $-3$, so its fractional part is $-\\frac{7}{3} + 3 = \\frac{2}{3}$.\n\nCheck: $-3 + \\frac{2}{3} = -\\frac{7}{3}$.\n\n> **Watch out.** For a negative number, round down to the integer below, which is further from zero; the fractional part is never negative.",
          "一个数的小数部分是减去不超过它的最大整数后剩下的部分，所以总在 0 到 1 之间（不含 1）。对负数来说，它不是小数点后的数字：$-\\frac{3}{4}$ 的小数部分是 $\\frac{1}{4}$，因为不超过它的最大整数是 $-1$。\n\n不超过 $-\\frac{7}{3}$ 的最大整数是 $-3$，所以它的小数部分是 $-\\frac{7}{3} + 3 = \\frac{2}{3}$。\n\n检验：$-3 + \\frac{2}{3} = -\\frac{7}{3}$。\n\n> **注意。** 对负数要向下取整到它下面的整数，也就是离零更远的那个；小数部分从不为负。",
        ],
        (rng) => {
          const d = rng.pick([3, 4, 5, 7, 8]);
          const f = rng.pick(Array.from({ length: d - 1 }, (_, i) => i + 1));
          const whole = rng.int(0, 4);
          const negative = rng.bool();
          const value = Q.of(negative ? -(whole * d + f) : whole * d + f, d);
          const answer = negative ? Q.of(d - f, d) : Q.of(f, d);
          const floor = negative ? -(whole + 1) : whole;
          return solved(
            [`What is the fractional part of $${value.toLatex()}$?`, `$${value.toLatex()}$ 的小数部分是多少？`],
            answer,
            [
              negative
                ? [
                    Q.of(f, d),
                    `That reads the digits after the point, but for a negative number the integer below is ${floor}.`,
                    `这读的是小数点后的部分，但对负数来说下面的整数是 ${floor}。`,
                  ]
                : [
                    Q.of(d - f, d),
                    `That subtracts from 1, but for a positive number the fractional part is what is left above ${whole}.`,
                    `这是用 1 去减，但对正数来说小数部分是超出 ${whole} 的部分。`,
                  ],
              [value, "That is the number itself, not what is left after the integer part.", "这是数本身，而不是去掉整数部分后剩下的。"],
              [Q.of(-f, d), "That is negative, but a fractional part lies from 0 up to 1.", "这是负数，但小数部分在 0 到 1 之间。"],
            ],
            [
              [
                ["Round down", "向下取整"],
                [`The largest integer not above $${value.toLatex()}$ is ${floor}.`, `不超过 $${value.toLatex()}$ 的最大整数是 ${floor}。`],
              ],
              [
                ["Subtract it", "减去它"],
                floor === 0
                  ? [`Subtracting 0 leaves $${answer.toLatex()}$.`, `减去 0 后剩下 $${answer.toLatex()}$。`]
                  : [
                      `$${value.toLatex()} - (${floor}) = ${answer.toLatex()}$.`,
                      `$${value.toLatex()} - (${floor}) = ${answer.toLatex()}$。`,
                    ],
              ],
            ],
            [
              `$${floor} + ${answer.toLatex()} = ${value.toLatex()}$, and $${answer.toLatex()}$ lies from 0 up to 1.`,
              `$${floor} + ${answer.toLatex()} = ${value.toLatex()}$，而 $${answer.toLatex()}$ 在 0 到 1 之间。`,
            ],
          );
        },
      ),
      point(
        "writing-a-gomory-cut",
        ["Writing a Gomory cut", "写出戈莫里割"],
        [
          "Take a tableau row with a fractional right side. Replacing every coefficient and the right side by its fractional part gives the cut: the fractional parts of the nonbasic coefficients, times their variables, add up to at least the fractional part of the right side. The current optimum has those variables at zero, so it violates the cut.\n\nFrom $x_1 + \\frac{5}{4}s_1 - \\frac{1}{4}s_2 = \\frac{7}{4}$, the fractional parts of $\\frac{5}{4}$, $-\\frac{1}{4}$ and $\\frac{7}{4}$ are $\\frac{1}{4}$, $\\frac{3}{4}$ and $\\frac{3}{4}$, so the cut is $\\frac{1}{4}s_1 + \\frac{3}{4}s_2 \\ge \\frac{3}{4}$.\n\nCheck: the current optimum has $s_1 = s_2 = 0$, which gives $0 < \\frac{3}{4}$, so the cut removes it.\n\n> **Watch out.** A negative coefficient has a fractional part of 1 minus its size: the fractional part of $-\\frac{1}{4}$ is $\\frac{3}{4}$, not $\\frac{1}{4}$.",
          "取右端为分数的一行。把每个系数和右端都换成小数部分，就得到割：非基变量系数的小数部分乘相应变量，其和至少是右端的小数部分。当前最优解中这些变量都是零，所以它违反这个割。\n\n由 $x_1 + \\frac{5}{4}s_1 - \\frac{1}{4}s_2 = \\frac{7}{4}$，$\\frac{5}{4}$，$-\\frac{1}{4}$ 和 $\\frac{7}{4}$ 的小数部分是 $\\frac{1}{4}$，$\\frac{3}{4}$ 和 $\\frac{3}{4}$，所以割是 $\\frac{1}{4}s_1 + \\frac{3}{4}s_2 \\ge \\frac{3}{4}$。\n\n检验：当前最优解中 $s_1 = s_2 = 0$，给出 $0 < \\frac{3}{4}$，所以割把它切掉了。\n\n> **注意。** 负系数的小数部分是 1 减去它的绝对值的小数部分：$-\\frac{1}{4}$ 的小数部分是 $\\frac{3}{4}$，不是 $\\frac{1}{4}$。",
        ],
        (rng) => {
          const d = rng.pick([3, 4, 5]);
          const f1 = rng.int(1, d - 1);
          const f2 = rng.int(1, d - 1);
          const f0 = rng.int(1, d - 1);
          const [w1, w2, w0] = [rng.int(0, 2), rng.int(0, 2), rng.int(1, 5)];
          const a = Q.of(w1 * d + f1, d);
          const b = Q.of(-(w2 * d + (d - f2)), d);
          const c = Q.of(w0 * d + f0, d);
          const [p, q, r] = [Q.of(f1, d).toLatex(), Q.of(f2, d).toLatex(), Q.of(f0, d).toLatex()];
          const other = Q.of(d - f2, d).toLatex();
          return chosen(
            rng,
            [
              `A tableau row reads $x_1 + ${a.toLatex()} s_1 - ${b.neg().toLatex()} s_2 = ${c.toLatex()}$, where $x_1$ must be an integer. Which is the Gomory cut from this row?`,
              `单纯形表的一行是 $x_1 + ${a.toLatex()} s_1 - ${b.neg().toLatex()} s_2 = ${c.toLatex()}$，其中 $x_1$ 必须是整数。由这一行得到的戈莫里割是哪个？`,
            ],
            same(`${p} s_1 + ${q} s_2 \\ge ${r}`),
            [
              [
                same(`${p} s_1 + ${other} s_2 \\ge ${r}`),
                `That reads the coefficient of $s_2$ as if it were positive; the fractional part of $${b.toLatex()}$ is $${q}$.`,
                `这把 $s_2$ 的系数当成正的了；$${b.toLatex()}$ 的小数部分是 $${q}$。`,
              ],
              [
                same(`${p} s_1 + ${q} s_2 \\le ${r}`),
                "The cut is a greater-than: the fractional terms must make up at least the fractional part of the right side.",
                "割是大于等于：小数部分各项之和至少是右端的小数部分。",
              ],
              [
                same(`${a.toLatex()} s_1 + ${q} s_2 \\ge ${c.toLatex()}`),
                "That keeps the whole coefficient of $s_1$ and the whole right side instead of their fractional parts.",
                "这保留了 $s_1$ 的整个系数和整个右端，而不是它们的小数部分。",
              ],
            ],
            [
              [
                ["Take fractional parts", "取小数部分"],
                [
                  `The fractional parts of $${a.toLatex()}$, $${b.toLatex()}$ and $${c.toLatex()}$ are $${p}$, $${q}$ and $${r}$.`,
                  `$${a.toLatex()}$、$${b.toLatex()}$ 和 $${c.toLatex()}$ 的小数部分是 $${p}$、$${q}$ 和 $${r}$。`,
                ],
              ],
              [
                ["Write the cut", "写出割"],
                [
                  `The nonbasic terms must add up to at least $${r}$: $${p} s_1 + ${q} s_2 \\ge ${r}$.`,
                  `非基项之和至少是 $${r}$：$${p} s_1 + ${q} s_2 \\ge ${r}$。`,
                ],
              ],
            ],
            [
              `The current optimum has $s_1 = s_2 = 0$, which makes the left side 0, less than $${r}$, so the cut removes it.`,
              `当前最优解中 $s_1 = s_2 = 0$，左边为 0，小于 $${r}$，所以割把它切掉了。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "A tableau row reads $x_1 + \\frac{1}{2}s_1 = \\frac{5}{2}$, with $x_1$ required to be an integer. The fractional parts give the cut $\\frac{1}{2}s_1 \\ge \\frac{1}{2}$, and the current optimum, with $s_1 = 0$ and $x_1 = \\frac{5}{2}$, violates it.",
    "单纯形表的一行是 $x_1 + \\frac{1}{2}s_1 = \\frac{5}{2}$，要求 $x_1$ 是整数。取小数部分得到割 $\\frac{1}{2}s_1 \\ge \\frac{1}{2}$，而当前最优解 $s_1 = 0$、$x_1 = \\frac{5}{2}$ 违反它。",
  ],
  [
    "the integer point with $s_1 = 1$ and $x_1 = 2$ satisfies both the row and the cut.",
    "$s_1 = 1$、$x_1 = 2$ 的整点既满足这一行，也满足割。",
  ],
  [
    "find fractional parts, including those of negative numbers, and write the Gomory cut from a tableau row.",
    "求小数部分，包括负数的小数部分，并由单纯形表的一行写出戈莫里割。",
  ],
);

/** arcsFigure draws a small network on four nodes, each arc labelled with a number. */
export function arcsFigure(arcs: readonly (readonly [string, string, number])[], alt: Pair): Figure {
  const at: Record<string, readonly [number, number]> = { S: [40, 90], A: [160, 30], B: [160, 150], T: [280, 90] };
  const parts = arcs.map(([from, to, w]) => {
    const [x1, y1] = at[from] as readonly [number, number];
    const [x2, y2] = at[to] as readonly [number, number];
    const length = Math.hypot(x2 - x1, y2 - y1);
    const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length];
    const [ax, ay, bx, by] = [x1 + ux * 14, y1 + uy * 14, x2 - ux * 14, y2 - uy * 14].map((v) => Math.round(v * 10) / 10) as [
      number,
      number,
      number,
      number,
    ];
    const head = `${bx},${by} ${Math.round((bx - ux * 8 - uy * 4) * 10) / 10},${Math.round((by - uy * 8 + ux * 4) * 10) / 10} ${Math.round((bx - ux * 8 + uy * 4) * 10) / 10},${Math.round((by - uy * 8 - ux * 4) * 10) / 10}`;
    const [mx, my] = [(x1 + x2) / 2 - uy * 12, (y1 + y2) / 2 + ux * 12 + 4];
    return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/><polygon points="${head}" fill="currentColor" stroke="none"/>${label(mx, my, String(w))}`;
  });
  const nodes = Object.entries(at).map(([name, p]) => node([p[0], p[1]], name));
  return { svg: svgDocument(180, parts.join("") + nodes.join("")), alt: t(alt[0], alt[1]) };
}

const shortestPaths = lesson(
  topic(
    "shortest-paths-as-linear-programs",
    ["Shortest Paths as Linear Programs", "最短路径与线性规划"],
    ["See a shortest path as one unit of flow, with node potentials as its dual.", "把最短路径看作一单位流，结点势就是它的对偶。"],
    ["maximum-flow-and-minimum-cut"],
    [],
    [
      point(
        "the-shortest-route-in-a-network",
        ["The shortest route in a network", "网络中的最短路线"],
        [
          "A shortest path problem sends one unit of flow from the source to the sink at the least total cost. Its constraints say that flow in equals flow out at every other node. Since the matrix is totally unimodular, the optimal flow is a single path even without demanding integer variables.\n\nWith arcs $S \\to A$ of 1, $S \\to B$ of 4, $A \\to T$ of 6, $B \\to T$ of 2 and $A \\to B$ of 2, the routes through $A$, through $B$, and through $A$ then $B$ have lengths 7, 6 and 5, so the shortest is 5.\n\nCheck: $1 + 2 + 2 = 5$, along $S \\to A \\to B \\to T$.\n\n> **Watch out.** Compare every route, including the one through both middle nodes; a route with more arcs can still be shorter.",
          "最短路径问题是以最小的总成本把一单位流从源送到汇。约束是：其他每个结点的流入等于流出。由于矩阵是全单模的，即使不要求变量为整数，最优流也是一条路径。\n\n弧 $S \\to A$ 长 1，$S \\to B$ 长 4，$A \\to T$ 长 6，$B \\to T$ 长 2，$A \\to B$ 长 2，经过 $A$、经过 $B$、先经过 $A$ 再经过 $B$ 的路线长度是 7，6 和 5，所以最短的是 5。\n\n检验：沿 $S \\to A \\to B \\to T$，$1 + 2 + 2 = 5$。\n\n> **注意。** 要比较每条路线，包括经过两个中间结点的那条；弧更多的路线仍可能更短。",
        ],
        (rng) => {
          const [sa, sb, at, bt, ab] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 6)];
          const routes = [sa + at, sb + bt, sa + ab + bt];
          const best = Math.min(...routes);
          const names: readonly Pair[] = [
            ["through $A$", "经过 $A$"],
            ["through $B$", "经过 $B$"],
            ["through $A$ then $B$", "先经过 $A$ 再经过 $B$"],
          ];
          const dB = Math.min(sb, sa + ab);
          return solved(
            [
              "The numbers on the arcs of this network are their lengths. What is the length of the shortest route from $S$ to $T$?",
              "这个网络中弧上的数是弧长。从 $S$ 到 $T$ 的最短路线长度是多少？",
            ],
            best,
            [
              ...routes.map(
                (v, i): Miss => [
                  v,
                  `That is the length of the route ${(names[i] as Pair)[0]}, which is not the shortest.`,
                  `这是${(names[i] as Pair)[1]}的路线长度，不是最短的。`,
                ],
              ),
              [
                sa + sb + at + bt + ab,
                "That adds every arc, but a route uses only some of them.",
                "这把每条弧都加上了，但一条路线只用其中几条。",
              ],
            ],
            [
              [
                ["List the routes", "列出路线"],
                [
                  `Through $A$: $${sa} + ${at} = ${sa + at}$. Through $B$: $${sb} + ${bt} = ${sb + bt}$. Through $A$ then $B$: $${sa} + ${ab} + ${bt} = ${sa + ab + bt}$.`,
                  `经过 $A$：$${sa} + ${at} = ${sa + at}$。经过 $B$：$${sb} + ${bt} = ${sb + bt}$。先经过 $A$ 再经过 $B$：$${sa} + ${ab} + ${bt} = ${sa + ab + bt}$。`,
                ],
              ],
              [
                ["Take the shortest", "取最短的"],
                [`The shortest of ${routes.join(", ")} is ${best}.`, `${routes.join("，")} 中最短的是 ${best}。`],
              ],
            ],
            [
              `Node potentials agree: $d_A = ${sa}$, $d_B = ${dB}$, and $d_T = \\min(${sa} + ${at}, ${dB} + ${bt}) = ${best}$.`,
              `结点势给出同样的结果：$d_A = ${sa}$，$d_B = ${dB}$，$d_T = \\min(${sa} + ${at}, ${dB} + ${bt}) = ${best}$。`,
            ],
            arcsFigure(
              [
                ["S", "A", sa],
                ["S", "B", sb],
                ["A", "T", at],
                ["B", "T", bt],
                ["A", "B", ab],
              ],
              ["A network on nodes S, A, B and T with a length on each arc.", "结点 S、A、B、T 组成的网络，每条弧上标有长度。"],
            ),
          );
        },
      ),
      {
        ...point(
          "the-potential-of-a-node",
          ["The potential of a node", "结点的势"],
          [
            "The dual of a shortest path program assigns a potential $d_v$ to each node, with $d_v \\le d_u + w$ for each arc from $u$ to $v$ of length $w$. Maximizing the potential at the sink gives its true distance from the source, because the tightest of these limits is what holds it down.\n\nIf $d_A = 3$ with an arc of length 5 into $T$, and $d_B = 4$ with an arc of length 2, then $d_T \\le 8$ and $d_T \\le 6$, so the largest allowed value is 6.\n\nCheck: 6 satisfies both limits, and it equals the second, so nothing larger works.\n\n> **Watch out.** Every incoming arc limits the potential, so take the smallest limit, not the largest.",
            "最短路径规划的对偶给每个结点一个势 $d_v$，对每条从 $u$ 到 $v$、长度为 $w$ 的弧有 $d_v \\le d_u + w$。使汇点的势最大，就得到它到源点的真实距离，因为最紧的那个限制把它压住了。\n\n如果 $d_A = 3$，进入 $T$ 的弧长 5；$d_B = 4$，弧长 2，那么 $d_T \\le 8$ 且 $d_T \\le 6$，所以最大只能取 6。\n\n检验：6 满足两个限制，而且等于第二个，所以更大的值都不行。\n\n> **注意。** 每条进入的弧都限制势，所以要取最小的限制，而不是最大的。",
          ],
          (rng) => {
            const [da, db] = [rng.int(1, 12), rng.int(1, 12)];
            const [wa, wb] = [rng.int(1, 12), rng.int(1, 12)];
            const answer = Math.min(da + wa, db + wb);
            return solved(
              [
                `Node $T$ has incoming arcs from $A$ of length ${wa} and from $B$ of length ${wb}. The potentials are $d_A = ${da}$ and $d_B = ${db}$. What is the largest value allowed for $d_T$?`,
                `结点 $T$ 有来自 $A$ 的长度为 ${wa} 的弧，以及来自 $B$ 的长度为 ${wb} 的弧。势是 $d_A = ${da}$，$d_B = ${db}$。$d_T$ 最大可以取多少？`,
              ],
              answer,
              [
                [Math.max(da + wa, db + wb), "That satisfies only one of the two limits.", "这只满足两个限制中的一个。"],
                [da + wa + db + wb, "That adds the two limits instead of taking the smaller.", "这把两个限制相加了，而不是取较小的。"],
                [Math.min(wa, wb), "That uses only the arc lengths, forgetting the potentials.", "这只用了弧长，忘了势。"],
                [Math.min(da, db), "That uses only the potentials, forgetting the arc lengths.", "这只用了势，忘了弧长。"],
              ],
              [
                [
                  ["Write the limits", "写出限制"],
                  [
                    `The arcs require $d_T \\le ${da} + ${wa} = ${da + wa}$ and $d_T \\le ${db} + ${wb} = ${db + wb}$.`,
                    `两条弧要求 $d_T \\le ${da} + ${wa} = ${da + wa}$ 和 $d_T \\le ${db} + ${wb} = ${db + wb}$。`,
                  ],
                ],
                [
                  ["Take the tighter one", "取更紧的那个"],
                  [`Both must hold, so the largest allowed value is ${answer}.`, `两者都要成立，所以最大只能取 ${answer}。`],
                ],
              ],
              [
                `${answer} is at most both ${da + wa} and ${db + wb}, and it equals one of them, so no larger value works.`,
                `${answer} 不超过 ${da + wa} 和 ${db + wb}，并且等于其中一个，所以更大的值都不行。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["shortest-paths-as-linear-programs#the-potential-of-a-node"],
      },
    ],
  ),
  [
    "Arcs $S \\to A$ of length 2, $S \\to B$ of 5, $A \\to T$ of 4, $B \\to T$ of 1 and $A \\to B$ of 1 give routes of lengths $2 + 4 = 6$, $5 + 1 = 6$ and $2 + 1 + 1 = 4$, so the shortest route has length 4 and runs through $A$ and then $B$.",
    "弧 $S \\to A$ 长 2，$S \\to B$ 长 5，$A \\to T$ 长 4，$B \\to T$ 长 1，$A \\to B$ 长 1，路线长度是 $2 + 4 = 6$，$5 + 1 = 6$ 和 $2 + 1 + 1 = 4$，所以最短路线长 4，先经过 $A$ 再经过 $B$。",
  ],
  [
    "the potentials $d_A = 2$, $d_B = \\min(5, 2 + 1) = 3$ and $d_T = \\min(2 + 4, 3 + 1) = 4$ give the same distance.",
    "势 $d_A = 2$，$d_B = \\min(5, 2 + 1) = 3$，$d_T = \\min(2 + 4, 3 + 1) = 4$ 给出同样的距离。",
  ],
  [
    "find the shortest route through a small network, and the largest potential a node allows.",
    "求小网络中的最短路线，以及一个结点允许的最大势。",
  ],
);

const minCostFlow = lesson(
  topic(
    "minimum-cost-flow",
    ["Minimum Cost Flow", "最小费用流"],
    ["Balance supplies and demands across a network at the least cost.", "以最小费用在网络中平衡供应和需求。"],
    ["shortest-paths-as-linear-programs", "the-transportation-problem"],
    [],
    [
      point(
        "balancing-a-node",
        ["Balancing a node", "平衡一个结点"],
        [
          "At each node of a network, flow in minus flow out must equal the demand of the node, and a supply counts as a negative demand. These balance equations are the constraints of a minimum cost flow program, and the transportation problem is the special case with no arcs between the supply nodes.\n\nFlows of 6 and 4 enter a node with demand 3, and one outgoing arc carries 2, so the other outgoing arc carries $10 - 3 - 2 = 5$.\n\nCheck: $10 - (2 + 5) = 3$, the demand.\n\n> **Watch out.** The demand stays at the node, so subtract it from the flow in along with every other outgoing arc.",
          "在网络的每个结点，流入减流出必须等于该结点的需求，供应算作负需求。这些平衡方程就是最小费用流规划的约束，运输问题是供应结点之间没有弧的特例。\n\n流量 6 和 4 流入一个需求为 3 的结点，一条流出的弧载有 2，所以另一条流出的弧载有 $10 - 3 - 2 = 5$。\n\n检验：$10 - (2 + 5) = 3$，正是需求。\n\n> **注意。** 需求留在结点处，所以要和其他流出的弧一起从流入中减去。",
        ],
        (rng) => {
          const [a, b] = [rng.int(5, 12), rng.int(5, 12)];
          const out = rng.int(1, 6);
          const demand = rng.int(1, a + b - out - 1);
          const answer = a + b - out - demand;
          return solved(
            [
              `Flows of ${a} and ${b} enter a node with demand ${demand}. One outgoing arc carries ${out}. How much flow must the only other outgoing arc carry?`,
              `流量 ${a} 和 ${b} 流入一个需求为 ${demand} 的结点。一条流出的弧载有 ${out}。唯一的另一条流出的弧必须载多少？`,
            ],
            answer,
            [
              [a + b - out, `That forgets the demand ${demand} that stays at the node.`, `这忘了留在结点处的需求 ${demand}。`],
              [a + b + demand - out, "That adds the demand instead of subtracting it.", "这把需求加上了，而不是减去。"],
              [a + b - demand, `That forgets the arc that already carries ${out}.`, `这忘了已经载有 ${out} 的那条弧。`],
              [a + b, "That is all the flow in, before anything leaves.", "这是全部流入量，还没有减去任何流出。"],
            ],
            [
              [
                ["Add the flow in", "求流入量"],
                [`Flow in is $${a} + ${b} = ${a + b}$.`, `流入量是 $${a} + ${b} = ${a + b}$。`],
              ],
              [
                ["Subtract what is used", "减去用掉的"],
                [
                  `The demand takes ${demand} and one arc takes ${out}, which leaves $${a + b} - ${demand} - ${out} = ${answer}$.`,
                  `需求用掉 ${demand}，一条弧带走 ${out}，剩下 $${a + b} - ${demand} - ${out} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$${a + b} - (${out} + ${answer}) = ${demand}$, so flow in minus flow out equals the demand.`,
              `$${a + b} - (${out} + ${answer}) = ${demand}$，所以流入减流出等于需求。`,
            ],
          );
        },
      ),
      {
        ...point(
          "the-cost-of-a-flow",
          ["The cost of a flow", "一个流的费用"],
          [
            "The objective of a minimum cost flow program adds, over all arcs, the flow on the arc times its cost per unit. Arcs that carry no flow cost nothing, however expensive they are, so reading a plan means multiplying only along the arcs that are actually in use.\n\nFlows of 2 and 3 on arcs with unit costs 4 and 1 cost $2(4) + 3(1) = 11$, and an empty arc with unit cost 9 adds nothing.\n\nCheck: $8 + 3 = 11$.\n\n> **Watch out.** Multiply each flow by its own arc's cost, then add; an arc with no flow costs nothing, however expensive it is.",
            "最小费用流规划的目标是对所有弧求和：弧上的流量乘单位费用。不载流的弧不产生费用，不管它有多贵，所以读一个方案时只需沿实际使用的弧相乘。\n\n在单位费用为 4 和 1 的弧上送 2 和 3，费用是 $2(4) + 3(1) = 11$，单位费用为 9 的空弧不增加费用。\n\n检验：$8 + 3 = 11$。\n\n> **注意。** 每个流量乘以它自己那条弧的费用，再相加；不载流的弧不论多贵都不产生费用。",
          ],
          (rng) => {
            const arcs = [
              [rng.int(1, 9), rng.int(1, 6)],
              [rng.int(1, 9), rng.int(1, 6)],
              [rng.int(1, 9), rng.int(1, 6)],
            ] as const;
            const unused = rng.int(4, 9);
            const cost = arcs.reduce((s, [f, c]) => s + f * c, 0);
            const flows = arcs.map(([f]) => f).join(", ");
            const costs = arcs.map(([, c]) => c).join(", ");
            const products = arcs.map(([f, c]) => `${f}(${c})`).join(" + ");
            const shares = arcs.map(([f, c]) => f * c).join(" + ");
            return solved(
              [
                `A plan sends flows ${flows} on three arcs with unit costs ${costs}. A fourth arc with unit cost ${unused} carries nothing. What is the total cost?`,
                `一个方案在三条单位费用为 ${costs} 的弧上分别送 ${flows} 的流量。第四条弧单位费用为 ${unused}，不载流。总费用是多少？`,
              ],
              cost,
              [
                [
                  cost + unused,
                  `That charges the empty arc ${unused}, but it carries nothing.`,
                  `这把空弧的 ${unused} 也算了进去，但它不载流。`,
                ],
                [
                  arcs.reduce((s, [f]) => s + f, 0) * arcs.reduce((s, [, c]) => s + c, 0),
                  "That multiplies the total flow by the total of the unit costs, mixing up the arcs.",
                  "这用总流量乘单位费用之和，把各条弧混在了一起。",
                ],
                [
                  arcs.reduce((s, [f, c]) => s + f + c, 0),
                  "That adds the flows and the costs instead of multiplying them.",
                  "这把流量和费用相加了，而不是相乘。",
                ],
              ],
              [
                [
                  ["Multiply along each arc", "沿每条弧相乘"],
                  [`The arcs in use cost $${products} = ${shares}$.`, `使用的弧的费用是 $${products} = ${shares}$。`],
                ],
                [
                  ["Add them", "相加"],
                  [`The total is ${cost}, and the empty arc adds nothing.`, `总费用是 ${cost}，空弧不增加费用。`],
                ],
              ],
              [
                `$${shares} = ${cost}$, with $0(${unused}) = 0$ from the empty arc.`,
                `$${shares} = ${cost}$，空弧贡献 $0(${unused}) = 0$。`,
              ],
            );
          },
        ),
        figure: linearProgrammingDrawings1["minimum-cost-flow#the-cost-of-a-flow"],
      },
      point(
        "pushing-flow-around-a-cycle",
        ["Pushing flow around a cycle", "沿圈推送流量"],
        [
          "Sending more flow around a cycle keeps every node balanced. The cost changes by the amount sent times the costs of the arcs followed forward minus the costs of the arcs followed backward, whose flow goes down. If that total is negative for some cycle, the current flow is not optimal.\n\nWith forward costs 3 and 4 and backward costs 5 and 6, sending 2 units changes the cost by $2(3 + 4 - 5 - 6) = -8$, so the current flow is not optimal.\n\nCheck: $2(7) - 2(11) = 14 - 22 = -8$.\n\n> **Watch out.** Backward arcs carry less flow after the push, so their costs are subtracted, not added.",
          "沿一个圈多送流量，每个结点仍然平衡。费用的变化是送的量乘以（顺向弧的费用减逆向弧的费用），逆向弧的流量会减少。如果某个圈的这个总量为负，当前流就不是最优的。\n\n顺向费用是 3 和 4，逆向费用是 5 和 6，送 2 单位使费用变化 $2(3 + 4 - 5 - 6) = -8$，所以当前流不是最优的。\n\n检验：$2(7) - 2(11) = 14 - 22 = -8$。\n\n> **注意。** 推送后逆向弧上的流量减少，所以它们的费用要减去，而不是加上。",
        ],
        (rng) => {
          const [f1, f2] = [rng.int(2, 9), rng.int(2, 9)];
          const [b1, b2] = [rng.int(2, 9), rng.int(2, 9)];
          const theta = rng.int(1, 6);
          const change = theta * (f1 + f2 - b1 - b2);
          const unit = f1 + f2 - b1 - b2;
          return solved(
            [
              `A cycle has forward arcs with unit costs ${f1} and ${f2}, and backward arcs with unit costs ${b1} and ${b2}. Sending ${theta} more units around the cycle changes the total cost by how much?`,
              `一个圈的顺向弧单位费用是 ${f1} 和 ${f2}，逆向弧单位费用是 ${b1} 和 ${b2}。沿这个圈多送 ${theta} 单位，总费用变化多少？`,
            ],
            change,
            [
              [
                theta * (f1 + f2 + b1 + b2),
                "That adds the backward costs, but their flow goes down, so they are saved.",
                "这把逆向弧的费用加上了，但它们的流量减少，费用是省下的。",
              ],
              [unit, `That is the change per unit; multiply by the ${theta} units sent.`, `这是每单位的变化；还要乘以送的 ${theta} 单位。`],
              [
                -change,
                "That has the sign reversed: forward costs are added and backward costs subtracted.",
                "这把符号弄反了：顺向费用加上，逆向费用减去。",
              ],
            ],
            [
              [
                ["Find the change per unit", "求每单位的变化"],
                [
                  `Each unit changes the cost by $${f1} + ${f2} - ${b1} - ${b2} = ${unit}$.`,
                  `每单位使费用变化 $${f1} + ${f2} - ${b1} - ${b2} = ${unit}$。`,
                ],
              ],
              [
                ["Scale by the amount", "乘以送的量"],
                [
                  `For ${theta} units the change is $${theta}(${unit}) = ${change}$.`,
                  `${theta} 单位的变化是 $${theta}(${unit}) = ${change}$。`,
                ],
              ],
            ],
            [
              `The forward arcs add $${theta}(${f1 + f2}) = ${theta * (f1 + f2)}$ and the backward arcs save $${theta}(${b1 + b2}) = ${theta * (b1 + b2)}$, and $${theta * (f1 + f2)} - ${theta * (b1 + b2)} = ${change}$.`,
              `顺向弧增加 $${theta}(${f1 + f2}) = ${theta * (f1 + f2)}$，逆向弧节省 $${theta}(${b1 + b2}) = ${theta * (b1 + b2)}$，$${theta * (f1 + f2)} - ${theta * (b1 + b2)} = ${change}$。`,
            ],
          );
        },
      ),
    ],
  ),
  [
    "Flows of 7 and 5 enter a node with demand 4, so $12 - 4 = 8$ units must leave it. If they leave on arcs carrying 3 and 5, with unit costs 2 and 1, those arcs cost $3(2) + 5(1) = 11$.",
    "流量 7 和 5 流入一个需求为 4 的结点，所以必须有 $12 - 4 = 8$ 单位流出。如果它们从载有 3 和 5、单位费用为 2 和 1 的弧流出，这两条弧的费用是 $3(2) + 5(1) = 11$。",
  ],
  ["$12 - (3 + 5) = 4$, the demand.", "$12 - (3 + 5) = 4$，正是需求。"],
  [
    "balance the flow at a node, find the cost of a flow, and find how pushing flow around a cycle changes the cost.",
    "平衡结点处的流量，求一个流的费用，并求沿圈推送流量时费用如何变化。",
  ],
);

/** linearProgrammingMoreTopics holds the later topics of the Linear Programming course. */
export const linearProgrammingMoreTopics: readonly TopicDef[] = [
  convexity,
  alternativeOptima,
  infeasible,
  minimization,
  reducedCosts,
  revisedSimplex,
  bigM,
  dualSimplex,
  ranging,
  gomory,
  shortestPaths,
  minCostFlow,
];
