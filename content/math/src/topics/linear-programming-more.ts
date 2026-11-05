// More of Linear Programming: convexity, alternative optima, infeasibility certificates,
// minimization, reduced costs, the revised and dual simplex methods, the Big M method,
// ranging, cutting planes and network programs.

import type { Figure, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";
import { label, node } from "./figure-reading-more.ts";

/** vector2 writes a column vector with two entries in LaTeX. */
const vector2 = (a: number, b: number) => `\\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}`;

/** matrix2 writes a two by two matrix in LaTeX. */
const matrix2 = (a: number, b: number, c: number, d: number) => `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

const convexity = topic(
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
        "A convex combination of two points $A$ and $B$ is $\\lambda A + (1 - \\lambda) B$ with $\\lambda$ between 0 and 1. It lies on the segment joining them, and the larger $\\lambda$ is, the closer it lies to $A$. A set is convex when it contains every such point for every pair of its points.",
        "两点 $A$ 和 $B$ 的凸组合是 $\\lambda A + (1 - \\lambda) B$，其中 $\\lambda$ 在 0 和 1 之间。它在连接两点的线段上，$\\lambda$ 越大越靠近 $A$。如果一个集合中任意两点的这类点都还在集合里，这个集合就是凸集。",
      ],
      (rng) => {
        const lambda = rng.pick([1, 3]);
        const [x1, x2] = [rng.int(-3, 6) * 4, rng.int(-3, 6) * 4];
        const [y1, y2] = [rng.int(0, 9), rng.int(0, 9)];
        const value = (lambda * x1 + (4 - lambda) * x2) / 4;
        return ask(
          [
            `Let $A = (${x1}, ${y1})$ and $B = (${x2}, ${y2})$. What is the $x$-coordinate of $\\frac{${lambda}}{4} A + \\frac{${4 - lambda}}{4} B$?`,
            `设 $A = (${x1}, ${y1})$，$B = (${x2}, ${y2})$。$\\frac{${lambda}}{4} A + \\frac{${4 - lambda}}{4} B$ 的 $x$ 坐标是多少？`,
          ],
          value,
          [((4 - lambda) * x1 + lambda * x2) / 4, (x1 + x2) / 2, x1 + x2],
          [
            `Take the same mixture of the two $x$-coordinates: $\\frac{${lambda}}{4} \\cdot ${x1} + \\frac{${4 - lambda}}{4} \\cdot ${x2} = ${value}$.`,
            `对两个 $x$ 坐标做同样的混合：$\\frac{${lambda}}{4} \\cdot ${x1} + \\frac{${4 - lambda}}{4} \\cdot ${x2} = ${value}$。`,
          ],
        );
      },
    ),
    point(
      "the-objective-at-a-mixture",
      ["The objective at a mixture", "混合点的目标值"],
      [
        "A linear objective at a convex combination of two points equals the same combination of its two values. So the value at a mixture always lies between the values at the ends, and it can never beat both. This is why some corner of a bounded feasible region is always optimal.",
        "线性目标在两点凸组合处的值，等于两个目标值的同样组合。所以混合点的值总在两端的值之间，不可能同时胜过两端。这就是有界可行域总有一个角点最优的原因。",
      ],
      (rng) => {
        const [c, d] = [rng.int(1, 6), rng.int(1, 6)];
        const [p, q] = rng.sample([0, 2, 4, 6, 8, 10], 2) as [number, number];
        const [r, s] = rng.sample([0, 2, 4, 6, 8, 10], 2) as [number, number];
        const [za, zb] = [c * p + d * r, c * q + d * s];
        const mid = (za + zb) / 2;
        return ask(
          [
            `For $z = ${c}x + ${d}y$, what is the value of $z$ at the midpoint of $(${p}, ${r})$ and $(${q}, ${s})$?`,
            `对 $z = ${c}x + ${d}y$，$(${p}, ${r})$ 和 $(${q}, ${s})$ 的中点处 $z$ 的值是多少？`,
          ],
          mid,
          [za, zb, za + zb, Math.max(za, zb) + 1],
          [
            `$z$ is $${za}$ at the first point and $${zb}$ at the second. Since $z$ is linear, its value at the midpoint is the average, $${mid}$.`,
            `$z$ 在第一点是 $${za}$，在第二点是 $${zb}$。因为 $z$ 是线性的，中点处的值就是平均值 $${mid}$。`,
          ],
        );
      },
    ),
    point(
      "recognizing-a-set-that-is-not-convex",
      ["Recognizing a set that is not convex", "识别非凸集"],
      [
        "Every half-plane is convex, and an intersection of convex sets is convex, so the feasible region of a linear program is always convex. A set that is the outside of a disc, or two separate pieces, is not convex: some segment between two of its points leaves the set. One such segment is enough to show it.",
        "每个半平面都是凸集，凸集的交还是凸集，所以线性规划的可行域总是凸的。圆盘的外部或分开的两块都不是凸集：其中两点之间的某条线段会离开集合。只要找到一条这样的线段就够了。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
        const r = rng.int(2, 9);
        const h = rng.int(3, 12);
        const bad: Pair = rng.bool()
          ? same(`\\{(x, y) : x^2 + y^2 \\ge ${r * r}\\}`)
          : same(`\\{(x, y) : x \\le -${a} \\text{ or } x \\ge ${b}\\}`);
        return choose(
          rng,
          ["Which of these sets is not convex?", "下面哪个集合不是凸集？"],
          bad,
          [
            same(`\\{(x, y) : ${a === 1 ? "" : a}x + ${b === 1 ? "" : b}y \\le ${h}\\}`),
            same(`\\{(x, y) : x^2 + y^2 \\le ${r * r}\\}`),
            same(`\\{(x, y) : x \\ge ${a},\\ y \\ge ${b},\\ x + y \\le ${h + a + b}\\}`),
          ],
          [
            "In the chosen set, two points on opposite sides of the gap have a segment that passes through the gap. The others are half-planes, a disc, or an intersection of half-planes, all of which are convex.",
            "在所选集合中，缺口两侧的两点之间的线段会穿过缺口。其他选项是半平面、圆盘或半平面的交，都是凸集。",
          ],
        );
      },
    ),
  ],
);

const alternativeOptima = topic(
  "alternative-optimal-solutions",
  ["Alternative Optimal Solutions", "多重最优解"],
  [
    "When a whole edge of the feasible region is optimal, and how the tableau shows it.",
    "可行域的整条边都最优时的情形，以及单纯形表如何显示它。",
  ],
  ["the-simplex-tableau", "convex-sets-and-convex-combinations"],
  [],
  [
    point(
      "an-objective-parallel-to-an-edge",
      ["An objective parallel to an edge", "目标平行于一条边"],
      [
        "The level lines of $cx + dy$ are parallel to the edge $ax + by = h$ exactly when $(c, d)$ is a multiple of $(a, b)$. If that edge is the last one the level lines reach, every point on the edge is optimal, not only its two corners.",
        "当 $(c, d)$ 是 $(a, b)$ 的倍数时，$cx + dy$ 的等值线平行于边 $ax + by = h$。如果等值线最后碰到的就是这条边，那么边上每一点都是最优解，不只是两个角点。",
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
        return ask(
          [
            `The edge of a feasible region lies on $${a}x + ${b}y = ${h}$. For what value of $c$ is the objective $z = cx + ${m * b}y$ parallel to that edge?`,
            `可行域的一条边在 $${a}x + ${b}y = ${h}$ 上。$c$ 取何值时，目标 $z = cx + ${m * b}y$ 平行于这条边？`,
          ],
          m * a,
          [a, m * b, m, h],
          [
            `The coefficient of $y$ is ${m} times ${b}, so the coefficient of $x$ must be ${m} times ${a}, which is ${m * a}.`,
            `$y$ 的系数是 ${b} 的 ${m} 倍，所以 $x$ 的系数也必须是 ${a} 的 ${m} 倍，即 ${m * a}。`,
          ],
        );
      },
    ),
    point(
      "the-value-along-an-optimal-edge",
      ["The value along an optimal edge", "最优边上的值"],
      [
        "If two corners of a feasible region are both optimal, then every convex combination of them is optimal too, with the same objective value. Testing any one point of the edge therefore gives the optimal value, and all points in between are equally good plans.",
        "如果可行域的两个角点都最优，那么它们的每个凸组合也都最优，目标值相同。所以检验边上任何一点都能得到最优值，中间的点都是同样好的方案。",
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
        return ask(
          [
            `For $z = ${k * a}x + ${k * b}y$, both $(${x1}, ${y1})$ and $(${x2}, ${y2})$ are optimal corners. What is the value of $z$ at $(${x1 + b}, ${y1 - a})$?`,
            `对 $z = ${k * a}x + ${k * b}y$，$(${x1}, ${y1})$ 和 $(${x2}, ${y2})$ 都是最优角点。$z$ 在 $(${x1 + b}, ${y1 - a})$ 处的值是多少？`,
          ],
          value,
          [2 * value, value / k, value + k, 0],
          [
            `The point is the midpoint of the two optimal corners, so it is optimal too, and $z = ${k * a} \\cdot ${x1} + ${k * b} \\cdot ${y1} = ${value}$ at the first corner gives the common value.`,
            `这一点是两个最优角点的中点，所以也最优。第一个角点处 $z = ${k * a} \\cdot ${x1} + ${k * b} \\cdot ${y1} = ${value}$，这就是共同的值。`,
          ],
        );
      },
    ),
    point(
      "a-zero-in-the-objective-row",
      ["A zero in the objective row", "目标行中的零"],
      [
        "At an optimal tableau every basic variable has a zero in the objective row. If a nonbasic variable also has a zero there, bringing it into the basis leaves the objective unchanged. That pivot reaches another optimal corner, so the program has alternative optimal solutions.",
        "在最优单纯形表中，每个基变量在目标行的系数都是零。如果某个非基变量的系数也是零，让它进基不会改变目标值。这次主元运算到达另一个最优角点，所以规划有多重最优解。",
      ],
      (rng) => {
        const names = ["x_1", "x_2", "s_1", "s_2"];
        const basic = rng.sample(names, 2);
        const others = names.filter((n) => !basic.includes(n));
        const [zero, positive] = rng.shuffle(others) as [string, string];
        const value = rng.int(2, 9);
        const row = names.map((n) => (n === positive ? value : 0));
        return choose(
          rng,
          [
            `This optimal tableau has basic variables $${basic[0]}$ and $${basic[1]}$. Its objective row has entries $${row.join(", ")}$ under $${names.join(", ")}$. Which variable can enter the basis without changing the objective?`,
            `这个最优单纯形表的基变量是 $${basic[0]}$ 和 $${basic[1]}$。目标行在 $${names.join(", ")}$ 下的系数是 $${row.join(", ")}$。哪个变量进基不会改变目标值？`,
          ],
          same(zero),
          [same(positive), same(basic[0] as string), same(basic[1] as string)],
          [
            `$${basic[0]}$ and $${basic[1]}$ are already basic. Of the nonbasic variables, $${zero}$ has a zero in the objective row, so it can enter at no cost, while $${positive}$ would lower the objective.`,
            `$${basic[0]}$ 和 $${basic[1]}$ 已经是基变量。非基变量中，$${zero}$ 在目标行的系数是零，进基没有代价，而 $${positive}$ 会降低目标值。`,
          ],
        );
      },
    ),
  ],
);

const infeasible = topic(
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
        "Two constraints on the same combination of variables can contradict each other. Scale them to the same left side and compare the right sides. If one demands at least more than the other allows at most, the feasible region is empty, whatever the objective is, and no corner exists to test.",
        "对同一个变量组合的两个约束可能互相矛盾。把它们化成相同的左边，再比较右边。如果一个要求的下限超过另一个允许的上限，可行域就是空的，与目标无关，也没有角点可检验。",
      ],
      (rng) => {
        const [p, q] = [rng.int(1, 3), rng.int(1, 3)];
        const m = rng.int(2, 5);
        const low = rng.int(3, 12);
        const c = m * low;
        return ask(
          [
            `The constraints are $${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y \\le a$ and $${m * p}x + ${m * q}y \\ge ${c}$. What is the smallest value of $a$ for which the program is feasible?`,
            `约束是 $${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y \\le a$ 和 $${m * p}x + ${m * q}y \\ge ${c}$。$a$ 最小取何值时规划有可行解？`,
          ],
          low,
          [c, low + m, low - 1, m],
          [
            `Divide the second constraint by ${m}: the same combination must be at least ${low}. It must also be at most $a$, so we need $a \\ge ${low}$.`,
            `第二个约束除以 ${m}：同一个组合至少是 ${low}。它又不能超过 $a$，所以需要 $a \\ge ${low}$。`,
          ],
        );
      },
    ),
    point(
      "a-certificate-of-infeasibility",
      ["A certificate of infeasibility", "无解的证书"],
      [
        "Farkas' Lemma says that a system $Ax \\le b$ has no solution exactly when some nonnegative multipliers combine the rows so that the left side vanishes and the right side is negative. That combination reads $0 \\le$ a negative number, a contradiction that anyone can check without searching for a solution.",
        "法卡斯引理说：$Ax \\le b$ 无解，当且仅当存在非负乘数，使各行组合后左边为零、右边为负。这个组合就是 $0 \\le$ 一个负数，是矛盾，任何人都能检验，而不必去找解。",
      ],
      (rng) => {
        const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
        const m = rng.int(2, 4);
        const p = rng.int(1, 9);
        const q = -(m * p + rng.int(1, 9));
        const value = m * p + q;
        return ask(
          [
            `Multiply $${a}x + ${b}y \\le ${p}$ by ${m} and add $-${m * a}x - ${m * b}y \\le ${q}$. The left side vanishes. What number is on the right side?`,
            `把 $${a}x + ${b}y \\le ${p}$ 乘 ${m}，再加上 $-${m * a}x - ${m * b}y \\le ${q}$。左边消去。右边是什么数？`,
          ],
          value,
          [p + q, m * p - q, -value, q],
          [
            `The right side is $${m} \\cdot ${p} + (${q}) = ${value}$. The result reads $0 \\le ${value}$, which is false, so these two constraints have no common solution.`,
            `右边是 $${m} \\cdot ${p} + (${q}) = ${value}$。结果是 $0 \\le ${value}$，这不成立，所以这两个约束没有公共解。`,
          ],
        );
      },
    ),
  ],
);

const minimization = topic(
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
        "A constraint $ax + by \\ge h$ becomes an equation by subtracting a nonnegative surplus variable: $ax + by - s = h$. The surplus measures how far a plan goes beyond the requirement. A surplus of zero means the plan meets the requirement exactly, and a negative value would mean the plan is not feasible.",
        "约束 $ax + by \\ge h$ 减去一个非负的剩余变量就成为等式：$ax + by - s = h$。剩余变量衡量方案超出要求多少。剩余为零说明方案恰好满足要求，负值则说明方案不可行。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 7), rng.int(2, 7)];
        const [x, y] = [rng.int(1, 9), rng.int(1, 9)];
        const surplus = rng.int(1, 12);
        const h = a * x + b * y - surplus;
        return ask(
          [
            `A diet must provide $${a}x + ${b}y \\ge ${h}$ units of protein. For the plan $x = ${x}$, $y = ${y}$, what is the value of the surplus variable?`,
            `饮食必须提供 $${a}x + ${b}y \\ge ${h}$ 单位蛋白质。方案 $x = ${x}$，$y = ${y}$ 的剩余变量是多少？`,
          ],
          surplus,
          [a * x + b * y, -surplus, h, surplus + 1],
          [
            `The plan provides $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x + b * y}$ units, and the surplus is the excess over ${h}, which is ${surplus}.`,
            `方案提供 $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x + b * y}$ 单位，剩余是超出 ${h} 的部分，即 ${surplus}。`,
          ],
        );
      },
    ),
    point(
      "the-cheapest-corner",
      ["The cheapest corner", "最便宜的角点"],
      [
        "In a covering problem the feasible region is usually unbounded, stretching away from the origin, so there is no largest cost. A smallest cost still exists when the costs are nonnegative, and it occurs at a corner. Evaluate the cost at every corner of the boundary and take the smallest value.",
        "覆盖问题的可行域通常是无界的，向远离原点的方向延伸，所以没有最大成本。成本非负时最小成本仍然存在，并且出现在角点。计算边界上每个角点的成本，取最小值。",
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
        return ask(
          [
            `The corners of a feasible region that stretches away from the origin are $${list}$. What is the minimum of $${c}x + ${d}y$?`,
            `一个向远离原点方向延伸的可行域，角点是 $${list}$。$${c}x + ${d}y$ 的最小值是多少？`,
          ],
          best,
          [Math.max(...costs), ...costs.filter((v) => v !== best)],
          [
            `The costs at the corners are ${costs.join(", ")}, and the smallest of them is ${best}. There is no largest cost, because the region is unbounded.`,
            `各角点的成本是 ${costs.join("、")}，其中最小的是 ${best}。成本没有最大值，因为可行域是无界的。`,
          ],
        );
      },
    ),
    point(
      "a-minimum-through-a-maximum",
      ["A minimum through a maximum", "通过最大值求最小值"],
      [
        "Minimizing $z$ is the same as maximizing $-z$: the same plan is best, and the optimal values differ only in sign. So a maximizing simplex method solves minimization problems too, as long as the sign of the final value is changed back at the end.",
        "最小化 $z$ 与最大化 $-z$ 是一回事：最优方案相同，最优值只差一个符号。所以求最大值的单纯形法也能解最小化问题，只要最后把结果的符号改回来。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const v = rng.int(10, 90);
        return ask(
          [
            `To minimize $z = ${a}x + ${b}y$, the simplex method is run on $w = -${a}x - ${b}y$, and it finds the largest value $w = -${v}$. What is the minimum of $z$?`,
            `为了使 $z = ${a}x + ${b}y$ 最小，对 $w = -${a}x - ${b}y$ 运行单纯形法，得到最大值 $w = -${v}$。$z$ 的最小值是多少？`,
          ],
          v,
          [-v, v + a, v - b],
          [
            `Here $z = -w$ for every plan, so the largest $w$ gives the smallest $z$, and the minimum of $z$ is $-(-${v}) = ${v}$.`,
            `对每个方案都有 $z = -w$，所以 $w$ 最大时 $z$ 最小，$z$ 的最小值是 $-(-${v}) = ${v}$。`,
          ],
        );
      },
    ),
  ],
);

const reducedCosts = topic(
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
        "The reduced cost of a variable is its own profit minus the value of the resources it uses: $r_j = c_j - y^T A_j$, where $y$ holds the simplex multipliers. A positive reduced cost in a maximization means that the variable earns more than its resources are worth, so bringing it into the basis helps.",
        "变量的检验数是它自身的利润减去所用资源的价值：$r_j = c_j - y^T A_j$，其中 $y$ 是单纯形乘数。在最大化问题中，检验数为正说明这个变量挣的比所用资源的价值多，让它进基有好处。",
      ],
      (rng) => {
        const [y1, y2] = [rng.int(1, 5), rng.int(1, 5)];
        const [a1, a2] = [rng.int(1, 4), rng.int(1, 4)];
        const c = rng.int(3, 30);
        const used = y1 * a1 + y2 * a2;
        return ask(
          [
            `The simplex multipliers are $y = (${y1}, ${y2})$. A nonbasic variable has profit ${c} and column $${vector2(a1, a2)}$. What is its reduced cost?`,
            `单纯形乘数是 $y = (${y1}, ${y2})$。一个非基变量的利润是 ${c}，列向量是 $${vector2(a1, a2)}$。它的检验数是多少？`,
          ],
          c - used,
          [used, c + used, used - c, c - y1 * a2 - y2 * a1],
          [
            `Its resources are worth $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2} = ${used}$, so the reduced cost is $${c} - ${used} = ${c - used}$.`,
            `它所用资源的价值是 $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2} = ${used}$，所以检验数是 $${c} - ${used} = ${c - used}$。`,
          ],
        );
      },
    ),
    point(
      "reading-reduced-costs",
      ["Reading reduced costs", "读检验数"],
      [
        "In a maximization, a basis is optimal when no nonbasic variable has a positive reduced cost. Otherwise the usual rule brings in the variable with the largest positive reduced cost, the one whose unit gain is highest. A negative reduced cost means that using the variable would lose money at current resource values.",
        "在最大化问题中，没有非基变量的检验数为正时，当前基就是最优的。否则通常让检验数最大的正值变量进基，它每单位增益最高。检验数为负说明按当前资源价值使用这个变量会亏损。",
      ],
      (rng) => {
        const names = ["x_1", "x_2", "x_3"];
        const optimal = rng.bool(0.3);
        const values = optimal
          ? [-rng.int(1, 9), -rng.int(1, 9), -rng.int(0, 9)]
          : rng.shuffle([rng.int(6, 9), rng.int(1, 5), -rng.int(1, 9)]);
        const list = names.map((n, i) => `r_{${i + 1}} = ${values[i]}`).join(",\\ ");
        const top = values.indexOf(Math.max(...values));
        const correct: Pair = optimal ? ["The current basis is optimal", "当前基已是最优"] : same(names[top] as string);
        return choose(
          rng,
          [
            `In a maximization, the nonbasic variables have reduced costs $${list}$. Which variable should enter, or is the current basis optimal?`,
            `在最大化问题中，非基变量的检验数是 $${list}$。哪个变量应当进基，还是当前基已是最优？`,
          ],
          correct,
          [["The current basis is optimal", "当前基已是最优"], ...names.map((n) => same(n))].slice(0, 4) as Pair[],
          optimal
            ? [
                "No reduced cost is positive, so no entering variable can raise the objective.",
                "没有正的检验数，任何变量进基都不能提高目标值。",
              ]
            : [
                `The largest positive reduced cost belongs to $${names[top]}$, so it has the highest gain per unit.`,
                `最大的正检验数属于 $${names[top]}$，所以它每单位增益最高。`,
              ],
        );
      },
    ),
    point(
      "the-change-from-entering",
      ["The change from entering", "进基带来的变化"],
      [
        "If a nonbasic variable enters the basis and rises to the value $\\theta$, the objective changes by its reduced cost times $\\theta$. The ratio test sets $\\theta$. So the gain of a pivot depends on both numbers, and the largest reduced cost does not always bring the largest gain.",
        "非基变量进基并增加到 $\\theta$ 时，目标值的变化是检验数乘 $\\theta$。比值检验决定 $\\theta$。所以一次主元运算的增益取决于这两个数，检验数最大不一定增益最大。",
      ],
      (rng) => {
        const r = rng.int(2, 9);
        const theta = rng.int(2, 9);
        const z = rng.int(10, 60);
        return ask(
          [
            `The objective is now ${z}. A variable with reduced cost ${r} enters the basis, and the ratio test gives it the value ${theta}. What is the new objective value?`,
            `目标值现在是 ${z}。一个检验数为 ${r} 的变量进基，比值检验给它的值是 ${theta}。新的目标值是多少？`,
          ],
          z + r * theta,
          [r * theta, z + r, z + theta, z - r * theta],
          [
            `The objective rises by $${r} \\cdot ${theta} = ${r * theta}$, from ${z} to ${z + r * theta}.`,
            `目标值增加 $${r} \\cdot ${theta} = ${r * theta}$，从 ${z} 变为 ${z + r * theta}。`,
          ],
        );
      },
    ),
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

const revisedSimplex = topic(
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
        "The revised simplex method keeps only the inverse of the basis matrix instead of a full tableau. The values of the basic variables are $x_B = B^{-1} b$. This matters for large sparse programs, where most of a full tableau would be computed and then never used.",
        "修正单纯形法只保存基矩阵的逆，不保存完整的单纯形表。基变量的值是 $x_B = B^{-1} b$。这对大型稀疏规划很重要，因为完整表的大部分算出来也用不到。",
      ],
      (rng) => {
        const [a, b, c, d] = rng.pick(inverses);
        const [p, q] = [rng.int(2, 12), rng.int(2, 12)];
        const first = rng.bool();
        const [x1, x2] = [a * p + b * q, c * p + d * q];
        const answer = first ? x1 : x2;
        return ask(
          [
            `The inverse of the basis is $B^{-1} = ${matrix2(a, b, c, d)}$ and $b = ${vector2(p, q)}$. What is the ${first ? "first" : "second"} entry of $x_B$?`,
            `基的逆是 $B^{-1} = ${matrix2(a, b, c, d)}$，$b = ${vector2(p, q)}$。$x_B$ 的第${first ? "一" : "二"}个分量是多少？`,
          ],
          answer,
          [first ? x2 : x1, first ? a * p + c * q : b * p + d * q, p + q],
          [
            first
              ? `Multiply the first row of the inverse by $b$: $${a} \\cdot ${p} + ${b} \\cdot ${q} = ${x1}$.`
              : `Multiply the second row of the inverse by $b$: $${c} \\cdot ${p} + ${d} \\cdot ${q} = ${x2}$.`,
            first
              ? `用逆矩阵的第一行乘 $b$：$${a} \\cdot ${p} + ${b} \\cdot ${q} = ${x1}$。`
              : `用逆矩阵的第二行乘 $b$：$${c} \\cdot ${p} + ${d} \\cdot ${q} = ${x2}$。`,
          ],
        );
      },
    ),
    point(
      "the-multipliers-from-the-inverse",
      ["The multipliers from the inverse", "由逆矩阵求乘数"],
      [
        "The simplex multipliers are $y^T = c_B^T B^{-1}$, a row vector built from the costs of the basic variables. They price every resource at once, so each nonbasic column can then be tested with a single product instead of a whole row operation on the tableau.",
        "单纯形乘数是 $y^T = c_B^T B^{-1}$，是由基变量成本构成的行向量。它们同时给每种资源定价，所以每个非基列只需一次乘积就能检验，不必对整个表做行运算。",
      ],
      (rng) => {
        const [a, b, c, d] = rng.pick(inverses);
        const [p, q] = [rng.int(1, 9), rng.int(1, 9)];
        const first = rng.bool();
        const [y1, y2] = [p * a + q * c, p * b + q * d];
        const answer = first ? y1 : y2;
        return ask(
          [
            `The inverse of the basis is $B^{-1} = ${matrix2(a, b, c, d)}$ and the basic costs are $c_B = (${p}, ${q})$. What is the ${first ? "first" : "second"} simplex multiplier?`,
            `基的逆是 $B^{-1} = ${matrix2(a, b, c, d)}$，基变量成本是 $c_B = (${p}, ${q})$。第${first ? "一" : "二"}个单纯形乘数是多少？`,
          ],
          answer,
          [first ? y2 : y1, first ? p * a + q * b : p * c + q * d, p + q],
          [
            first
              ? `$c_B$ multiplies the first column of the inverse: $${p} \\cdot ${a} + ${q} \\cdot ${c} = ${y1}$.`
              : `$c_B$ multiplies the second column of the inverse: $${p} \\cdot ${b} + ${q} \\cdot ${d} = ${y2}$.`,
            first
              ? `$c_B$ 乘逆矩阵的第一列：$${p} \\cdot ${a} + ${q} \\cdot ${c} = ${y1}$。`
              : `$c_B$ 乘逆矩阵的第二列：$${p} \\cdot ${b} + ${q} \\cdot ${d} = ${y2}$。`,
          ],
        );
      },
    ),
  ],
);

const bigM = topic(
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
        "The Big M method gives every artificial variable an enormous cost $M$ in a minimization. Costs then have the form $aM + b$, and they are compared as $M$ grows: the coefficient of $M$ decides first, and the constant only matters when those coefficients are equal.",
        "大 M 法在最小化问题中给每个人工变量一个极大的成本 $M$。于是成本形如 $aM + b$，比较时考虑 $M$ 很大的情形：先看 $M$ 的系数，系数相等时才看常数。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const tie = rng.bool(0.4);
        const c = tie ? a : a + rng.int(1, 4);
        const b = tie ? rng.int(1, 40) : rng.int(30, 90);
        const d = tie ? b + rng.int(1, 20) : rng.int(1, 20);
        const write = (u: number, v: number) => `${u === 1 ? "" : u}M + ${v}`;
        return choose(
          rng,
          ["For a very large $M$, which cost is smallest?", "当 $M$ 非常大时，哪个成本最小？"],
          same(write(a, b)),
          [same(write(c, d)), same(write(c + 1, b)), same(write(a + 2, d))],
          tie
            ? [
                `The two costs with the smallest coefficient of $M$ are compared by their constants, and $${b}$ is less than $${d}$.`,
                `$M$ 的系数最小的两个成本再比较常数，$${b}$ 小于 $${d}$。`,
              ]
            : [
                `The coefficient of $M$ decides first, and ${a} is the smallest. For a large enough $M$, no constant can make up for it.`,
                `先看 $M$ 的系数，${a} 最小。$M$ 足够大时，常数无法弥补这一差距。`,
              ],
        );
      },
    ),
    point(
      "the-starting-penalty",
      ["The starting penalty", "初始惩罚"],
      [
        "The Big M method starts with every artificial variable basic at the value of the right side of its row, and all other variables at zero. So the starting cost is $M$ times the sum of those right sides. Pivoting then drives the artificial variables out, and this large penalty falls away.",
        "大 M 法开始时，每个人工变量都是基变量，取值等于所在行的右端，其他变量都为零。所以初始成本是 $M$ 乘这些右端之和。之后通过主元运算把人工变量换出去，这个大惩罚也就消失了。",
      ],
      (rng) => {
        const [p, q] = [rng.int(4, 30), rng.int(4, 30)];
        const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
        return ask(
          [
            `Minimize $${a}x + ${b}y + M a_1 + M a_2$ subject to $x + y + a_1 = ${p}$ and $x + 2y + a_2 = ${q}$. At the starting basis $a_1, a_2$, the cost is $kM$. What is $k$?`,
            `在 $x + y + a_1 = ${p}$ 和 $x + 2y + a_2 = ${q}$ 的条件下，最小化 $${a}x + ${b}y + M a_1 + M a_2$。初始基 $a_1, a_2$ 处成本是 $kM$。$k$ 是多少？`,
          ],
          p + q,
          [2, p, q, a + b],
          [
            `At the start $x = y = 0$, so $a_1 = ${p}$ and $a_2 = ${q}$. The cost is $(${p} + ${q})M$, so $k = ${p + q}$.`,
            `开始时 $x = y = 0$，所以 $a_1 = ${p}$，$a_2 = ${q}$。成本是 $(${p} + ${q})M$，所以 $k = ${p + q}$。`,
          ],
        );
      },
    ),
    point(
      "an-artificial-variable-at-the-end",
      ["An artificial variable at the end", "最后还有人工变量"],
      [
        "When the Big M method stops with an artificial variable still positive, even that enormous penalty could not remove it. So no plan meets the original constraints, and the program is infeasible. If all artificial variables are zero at the end, the plan found is optimal for the original program.",
        "大 M 法结束时如果还有人工变量为正，说明连极大的惩罚也去不掉它。所以没有方案能满足原约束，规划无可行解。如果最后所有人工变量都是零，得到的方案就是原规划的最优解。",
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
        return choose(
          rng,
          [
            `The Big M method stops at an optimal tableau with $x = ${x}$, $y = ${y}$ and artificial variable $a_1 = ${positive ? v : 0}$. What does this show?`,
            `大 M 法在最优表处停止，$x = ${x}$，$y = ${y}$，人工变量 $a_1 = ${positive ? v : 0}$。这说明什么？`,
          ],
          positive ? options[0] : options[1],
          [positive ? options[1] : options[0], options[2], ["More pivots are needed", "还需要继续主元运算"]],
          positive
            ? [
                `The artificial variable stays at ${v} although it costs $M$ per unit, so no plan satisfies the constraints without it.`,
                `人工变量每单位成本是 $M$，却仍然等于 ${v}，所以没有它就没有方案能满足约束。`,
              ]
            : [
                "Every artificial variable is zero, so the plan satisfies the original constraints, and the tableau shows that it is optimal.",
                "所有人工变量都是零，所以方案满足原约束，单纯形表又说明它最优。",
              ],
        );
      },
    ),
  ],
);

const dualSimplex = topic(
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
        "The dual simplex method starts from a tableau whose objective row is already optimal but whose right side has negative entries. It therefore chooses the leaving variable first, usually the row with the most negative right side. This is the reverse of the ordinary method, which chooses the entering variable first.",
        "对偶单纯形法从目标行已经最优、右端却有负数的表开始。所以它先选离基变量，通常取右端最负的那一行。这与普通单纯形法相反，后者先选进基变量。",
      ],
      (rng) => {
        const low = -rng.int(5, 12);
        const rows = rng.shuffle([low, -rng.int(1, 4), rng.int(1, 9)]);
        const row = rows.indexOf(low) + 1;
        const big = rows.indexOf(Math.max(...rows)) + 1;
        return ask(
          [
            `In a dual simplex step, the right sides of rows 1, 2 and 3 are $${rows.join(", ")}$. Which row number gives the leaving variable?`,
            `对偶单纯形法的一步中，第 1、2、3 行的右端是 $${rows.join(", ")}$。离基变量在第几行？`,
          ],
          row,
          [big, (row % 3) + 1, 0],
          [
            `A negative right side shows an infeasible basic value, and the most negative one is ${low}, in row ${row}. That row's basic variable leaves.`,
            `右端为负说明基变量的值不可行，最负的是 ${low}，在第 ${row} 行。这一行的基变量离基。`,
          ],
        );
      },
    ),
    point(
      "the-dual-ratio-test",
      ["The dual ratio test", "对偶比值检验"],
      [
        "Once the leaving row is chosen, only its negative entries can make its right side rise. Among those columns, take the smallest ratio of the objective row entry to the size of the row entry. That choice keeps every entry of the objective row nonnegative, so the tableau stays dual feasible.",
        "选定离基行后，只有该行的负系数才能使右端增大。在这些列中，取目标行系数与该行系数绝对值之比最小的一列。这样目标行的系数都保持非负，表格仍然对偶可行。",
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
        return choose(
          rng,
          [
            `The leaving row has entries $${entries.join(", ")}$ under $${names.join(", ")}$, and the objective row has entries $${costs.join(", ")}$. Which variable enters?`,
            `离基行在 $${names.join(", ")}$ 下的系数是 $${entries.join(", ")}$，目标行的系数是 $${costs.join(", ")}$。哪个变量进基？`,
          ],
          same(names[best] as string),
          names.filter((_, i) => i !== best).map((n) => same(n)),
          [
            `Only negative entries qualify. The ratios of the objective entry to the size of the row entry are smallest for $${names[best]}$, so it enters.`,
            `只有负系数才符合条件。目标行系数与该行系数绝对值之比，以 $${names[best]}$ 最小，所以它进基。`,
          ],
        );
      },
    ),
    point(
      "a-row-with-no-negative-entry",
      ["A row with no negative entry", "没有负系数的行"],
      [
        "If the leaving row has a negative right side but no negative entries, then that row reads as a sum of nonnegative terms equal to a negative number. No choice of nonnegative variables can satisfy it, so the original program is infeasible. In dual terms, the dual program is unbounded.",
        "如果离基行右端为负，却没有负系数，那么这一行就是非负项之和等于负数。非负变量怎么取都满足不了，所以原规划无可行解。用对偶的话说，对偶规划无界。",
      ],
      (rng) => {
        const hasNegative = rng.bool();
        const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
        const rhs = -rng.int(1, 9);
        const written = hasNegative ? `x_1 + ${a} x_3 - ${b} x_4 = ${rhs}` : `x_1 + ${a} x_3 + ${b} x_4 = ${rhs}`;
        const infeasible_: Pair = ["The program is infeasible", "规划无可行解"];
        const pivot: Pair = [`$x_4$ can enter, and the method continues`, `$x_4$ 可以进基，方法继续`];
        return choose(
          rng,
          [
            `In a dual simplex step, the leaving row reads $${written}$, with all variables nonnegative. What follows?`,
            `对偶单纯形法的一步中，离基行是 $${written}$，所有变量都非负。接下来会怎样？`,
          ],
          hasNegative ? pivot : infeasible_,
          [
            hasNegative ? infeasible_ : pivot,
            ["The current plan is optimal", "当前方案已是最优"],
            ["The objective is unbounded", "目标无界"],
          ],
          hasNegative
            ? [
                `The entry $-${b}$ is negative, so raising $x_4$ can raise the right side up to zero. The method continues with that pivot.`,
                `系数 $-${b}$ 为负，增大 $x_4$ 可以使这一行恢复可行。方法继续做这次主元运算。`,
              ]
            : [
                `The left side is a sum of nonnegative terms, and it cannot equal $${rhs}$. So no feasible plan exists.`,
                `左边是非负项之和，不可能等于 $${rhs}$。所以不存在可行方案。`,
              ],
        );
      },
    ),
  ],
);

const ranging = topic(
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
        "Changing a right side by $\\Delta$ changes the basic values to $x_B + \\Delta d$, where $d$ is the matching column of $B^{-1}$. The basis stays optimal while these values stay nonnegative. So only the entries of $d$ with the opposite sign limit the change, and the tightest of those ratios sets the range.",
        "右端改变 $\\Delta$ 时，基变量的值变为 $x_B + \\Delta d$，其中 $d$ 是 $B^{-1}$ 对应的列。只要这些值保持非负，当前基就仍然最优。所以只有符号相反的分量才限制变化，其中最紧的比值决定范围。",
      ],
      (rng) => {
        const up = rng.bool();
        const [p, q] = [rng.int(1, 6) * 12, rng.int(1, 6) * 12];
        const [u, v] = [rng.int(1, 4), rng.int(1, 4)];
        const limit = (up ? q : p) / (up ? v : u);
        const col = vector2(u, -v);
        return ask(
          [
            `The optimal basic values are $x_B = ${vector2(p, q)}$, and the column of $B^{-1}$ for a resource is $${col}$. What is the largest ${up ? "increase" : "decrease"} in that resource that keeps the basis feasible?`,
            `最优基变量的值是 $x_B = ${vector2(p, q)}$，某种资源在 $B^{-1}$ 中对应的列是 $${col}$。保持当前基可行时，这种资源最多能${up ? "增加" : "减少"}多少？`,
          ],
          limit,
          [(up ? p : q) / (up ? u : v), up ? q : p, up ? v : u, Q.of(p + q, u + v)],
          [
            up
              ? `As the resource rises by $\\Delta$, the second value is $${q} - ${v}\\Delta$, which reaches zero at $\\Delta = ${limit}$. The first value only grows.`
              : `As the resource falls by $\\Delta$, the first value is $${p} - ${u}\\Delta$, which reaches zero at $\\Delta = ${limit}$. The second value only grows.`,
            up
              ? `资源增加 $\\Delta$ 时，第二个值是 $${q} - ${v}\\Delta$，在 $\\Delta = ${limit}$ 时变为零。第一个值只会增大。`
              : `资源减少 $\\Delta$ 时，第一个值是 $${p} - ${u}\\Delta$，在 $\\Delta = ${limit}$ 时变为零。第二个值只会增大。`,
          ],
        );
      },
    ),
    point(
      "the-plan-after-a-small-change",
      ["The plan after a small change", "小变化后的方案"],
      [
        "Inside the allowed range the same variables stay basic, but their values shift in proportion to the change in the resource. There is no need to solve the program again: add $\\Delta$ times the matching column of the inverse to the current basic values, and the new plan is ready.",
        "在允许范围内，基变量不变，但它们的值随资源的变化按比例移动。不必重新求解：把逆矩阵对应的列乘 $\\Delta$，加到当前基变量的值上，就得到新方案。",
      ],
      (rng) => {
        const [p, q] = [rng.int(20, 60), rng.int(20, 60)];
        const [u, v] = [rng.int(1, 4), rng.int(1, 4)];
        const delta = rng.int(1, 5);
        const first = rng.bool();
        const [x1, x2] = [p + u * delta, q - v * delta];
        return ask(
          [
            `The optimal basic values are $x_B = ${vector2(p, q)}$, and the column of $B^{-1}$ for a resource is $${vector2(u, -v)}$. The resource rises by ${delta}, and the basis stays optimal. What is the new value of the ${first ? "first" : "second"} basic variable?`,
            `最优基变量的值是 $x_B = ${vector2(p, q)}$，某种资源在 $B^{-1}$ 中对应的列是 $${vector2(u, -v)}$。资源增加 ${delta}，当前基仍然最优。第${first ? "一" : "二"}个基变量的新值是多少？`,
          ],
          first ? x1 : x2,
          [first ? x2 : x1, first ? p + delta : q - delta, first ? p - u * delta : q + v * delta],
          [
            first
              ? `The new value is $${p} + ${delta} \\cdot ${u} = ${x1}$.`
              : `The new value is $${q} + ${delta} \\cdot (-${v}) = ${x2}$.`,
            first ? `新值是 $${p} + ${delta} \\cdot ${u} = ${x1}$。` : `新值是 $${q} + ${delta} \\cdot (-${v}) = ${x2}$。`,
          ],
        );
      },
    ),
  ],
);

const gomory = topic(
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
        "The fractional part of a number is what remains after subtracting the largest integer not above it, so it always lies from 0 up to but not including 1. For a negative number this is not the digits after the point: the fractional part of $-\\frac{3}{4}$ is $\\frac{1}{4}$, since the integer below it is $-1$.",
        "一个数的小数部分是减去不超过它的最大整数后剩下的部分，所以总在 0 到 1 之间（不含 1）。对负数来说，它不是小数点后的数字：$-\\frac{3}{4}$ 的小数部分是 $\\frac{1}{4}$，因为不超过它的最大整数是 $-1$。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 5, 7, 8]);
        const f = rng.pick(Array.from({ length: d - 1 }, (_, i) => i + 1));
        const whole = rng.int(0, 4);
        const negative = rng.bool();
        const value = Q.of(negative ? -(whole * d + f) : whole * d + f, d);
        const answer = negative ? Q.of(d - f, d) : Q.of(f, d);
        return ask(
          [`What is the fractional part of $${value.toLatex()}$?`, `$${value.toLatex()}$ 的小数部分是多少？`],
          answer,
          [negative ? Q.of(f, d) : Q.of(d - f, d), value, Q.of(-f, d)],
          [
            `The largest integer not above $${value.toLatex()}$ is ${negative ? -(whole + 1) : whole}, and subtracting it leaves $${answer.toLatex()}$.`,
            `不超过 $${value.toLatex()}$ 的最大整数是 ${negative ? -(whole + 1) : whole}，减去它得 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "writing-a-gomory-cut",
      ["Writing a Gomory cut", "写出戈莫里割"],
      [
        "Take a tableau row with a fractional right side. Replacing every coefficient and the right side by its fractional part gives the cut: the fractional parts of the nonbasic coefficients, times their variables, add up to at least the fractional part of the right side. The current optimum has those variables at zero, so it violates the cut.",
        "取右端为分数的一行。把每个系数和右端都换成小数部分，就得到割：非基变量系数的小数部分乘相应变量，其和至少是右端的小数部分。当前最优解中这些变量都是零，所以它违反这个割。",
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
        return choose(
          rng,
          [
            `A tableau row reads $x_1 + ${a.toLatex()} s_1 - ${b.neg().toLatex()} s_2 = ${c.toLatex()}$, where $x_1$ must be an integer. Which is the Gomory cut from this row?`,
            `单纯形表的一行是 $x_1 + ${a.toLatex()} s_1 - ${b.neg().toLatex()} s_2 = ${c.toLatex()}$，其中 $x_1$ 必须是整数。由这一行得到的戈莫里割是哪个？`,
          ],
          same(`${p} s_1 + ${q} s_2 \\ge ${r}`),
          [
            same(`${p} s_1 + ${other} s_2 \\ge ${r}`),
            same(`${p} s_1 + ${q} s_2 \\le ${r}`),
            same(`${a.toLatex()} s_1 + ${q} s_2 \\ge ${c.toLatex()}`),
          ],
          [
            `The fractional parts of $${a.toLatex()}$, $${b.toLatex()}$ and $${c.toLatex()}$ are $${p}$, $${q}$ and $${r}$. The cut says that the nonbasic terms add up to at least $${r}$.`,
            `$${a.toLatex()}$、$${b.toLatex()}$ 和 $${c.toLatex()}$ 的小数部分是 $${p}$、$${q}$ 和 $${r}$。割的意思是非基项之和至少是 $${r}$。`,
          ],
        );
      },
    ),
  ],
);

/** arcsFigure draws a small network on four nodes, each arc labelled with a number. */
function arcsFigure(arcs: readonly (readonly [string, string, number])[], alt: Pair): Figure {
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

const shortestPaths = topic(
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
        "A shortest path problem sends one unit of flow from the source to the sink at the least total cost. Its constraints say that flow in equals flow out at every other node. Since the matrix is totally unimodular, the optimal flow is a single path even without demanding integer variables.",
        "最短路径问题是以最小的总成本把一单位流从源送到汇。约束是：其他每个结点的流入等于流出。由于矩阵是全单模的，即使不要求变量为整数，最优流也是一条路径。",
      ],
      (rng) => {
        const [sa, sb, at, bt, ab] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 6)];
        const routes = [sa + at, sb + bt, sa + ab + bt];
        const best = Math.min(...routes);
        return ask(
          [
            "The numbers on the arcs of this network are their lengths. What is the length of the shortest route from $S$ to $T$?",
            "这个网络中弧上的数是弧长。从 $S$ 到 $T$ 的最短路线长度是多少？",
          ],
          best,
          [...routes.filter((v) => v !== best), sa + sb + at + bt + ab],
          [
            `The three routes have lengths ${routes.join(", ")}: through $A$, through $B$, and through $A$ then $B$. The shortest is ${best}.`,
            `三条路线的长度是 ${routes.join("、")}：经过 $A$，经过 $B$，以及先经过 $A$ 再经过 $B$。最短的是 ${best}。`,
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
    point(
      "the-potential-of-a-node",
      ["The potential of a node", "结点的势"],
      [
        "The dual of a shortest path program assigns a potential $d_v$ to each node, with $d_v \\le d_u + w$ for each arc from $u$ to $v$ of length $w$. Maximizing the potential at the sink gives its true distance from the source, because the tightest of these limits is what holds it down.",
        "最短路径规划的对偶给每个结点一个势 $d_v$，对每条从 $u$ 到 $v$、长度为 $w$ 的弧有 $d_v \\le d_u + w$。使汇点的势最大，就得到它到源点的真实距离，因为最紧的那个限制把它压住了。",
      ],
      (rng) => {
        const [da, db] = [rng.int(1, 12), rng.int(1, 12)];
        const [wa, wb] = [rng.int(1, 12), rng.int(1, 12)];
        const answer = Math.min(da + wa, db + wb);
        return ask(
          [
            `Node $T$ has incoming arcs from $A$ of length ${wa} and from $B$ of length ${wb}. The potentials are $d_A = ${da}$ and $d_B = ${db}$. What is the largest value allowed for $d_T$?`,
            `结点 $T$ 有来自 $A$ 的长度为 ${wa} 的弧，以及来自 $B$ 的长度为 ${wb} 的弧。势是 $d_A = ${da}$，$d_B = ${db}$。$d_T$ 最大可以取多少？`,
          ],
          answer,
          [Math.max(da + wa, db + wb), da + wa + db + wb, Math.min(wa, wb), Math.min(da, db)],
          [
            `The two arcs require $d_T \\le ${da + wa}$ and $d_T \\le ${db + wb}$. Both must hold, so the largest allowed value is ${answer}.`,
            `两条弧要求 $d_T \\le ${da + wa}$ 和 $d_T \\le ${db + wb}$。两者都要成立，所以最大只能取 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const minCostFlow = topic(
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
        "At each node of a network, flow in minus flow out must equal the demand of the node, and a supply counts as a negative demand. These balance equations are the constraints of a minimum cost flow program, and the transportation problem is the special case with no arcs between the supply nodes.",
        "在网络的每个结点，流入减流出必须等于该结点的需求，供应算作负需求。这些平衡方程就是最小费用流规划的约束，运输问题是供应结点之间没有弧的特例。",
      ],
      (rng) => {
        const [a, b] = [rng.int(5, 12), rng.int(5, 12)];
        const out = rng.int(1, 6);
        const demand = rng.int(1, a + b - out - 1);
        const answer = a + b - out - demand;
        return ask(
          [
            `Flows of ${a} and ${b} enter a node with demand ${demand}. One outgoing arc carries ${out}. How much flow must the only other outgoing arc carry?`,
            `流量 ${a} 和 ${b} 流入一个需求为 ${demand} 的结点。一条流出的弧载有 ${out}。唯一的另一条流出的弧必须载多少？`,
          ],
          answer,
          [a + b - out, a + b + demand - out, a + b - demand, a + b],
          [
            `Flow in is ${a + b}. The demand takes ${demand} and one arc takes ${out}, which leaves $${a + b} - ${demand} - ${out} = ${answer}$.`,
            `流入是 ${a + b}。需求用掉 ${demand}，一条弧带走 ${out}，剩下 $${a + b} - ${demand} - ${out} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-cost-of-a-flow",
      ["The cost of a flow", "一个流的费用"],
      [
        "The objective of a minimum cost flow program adds, over all arcs, the flow on the arc times its cost per unit. Arcs that carry no flow cost nothing, however expensive they are, so reading a plan means multiplying only along the arcs that are actually in use.",
        "最小费用流规划的目标是对所有弧求和：弧上的流量乘单位费用。不载流的弧不产生费用，不管它有多贵，所以读一个方案时只需沿实际使用的弧相乘。",
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
        return ask(
          [
            `A plan sends flows ${flows} on three arcs with unit costs ${costs}. A fourth arc with unit cost ${unused} carries nothing. What is the total cost?`,
            `一个方案在三条单位费用为 ${costs} 的弧上分别送 ${flows} 的流量。第四条弧单位费用为 ${unused}，不载流。总费用是多少？`,
          ],
          cost,
          [
            cost + unused,
            arcs.reduce((s, [f]) => s + f, 0) * arcs.reduce((s, [, c]) => s + c, 0),
            arcs.reduce((s, [f, c]) => s + f + c, 0),
          ],
          [
            `Multiply along the arcs in use: ${arcs.map(([f, c]) => `$${f} \\cdot ${c}$`).join(" + ")} $= ${cost}$. The empty arc adds nothing.`,
            `沿使用的弧相乘：${arcs.map(([f, c]) => `$${f} \\cdot ${c}$`).join(" + ")} $= ${cost}$。空弧不增加费用。`,
          ],
        );
      },
    ),
    point(
      "pushing-flow-around-a-cycle",
      ["Pushing flow around a cycle", "沿圈推送流量"],
      [
        "Sending more flow around a cycle keeps every node balanced. The cost changes by the amount sent times the costs of the arcs followed forward minus the costs of the arcs followed backward, whose flow goes down. If that total is negative for some cycle, the current flow is not optimal.",
        "沿一个圈多送流量，每个结点仍然平衡。费用的变化是送的量乘以（顺向弧的费用减逆向弧的费用），逆向弧的流量会减少。如果某个圈的这个总量为负，当前流就不是最优的。",
      ],
      (rng) => {
        const [f1, f2] = [rng.int(2, 9), rng.int(2, 9)];
        const [b1, b2] = [rng.int(2, 9), rng.int(2, 9)];
        const theta = rng.int(1, 6);
        const change = theta * (f1 + f2 - b1 - b2);
        return ask(
          [
            `A cycle has forward arcs with unit costs ${f1} and ${f2}, and backward arcs with unit costs ${b1} and ${b2}. Sending ${theta} more units around the cycle changes the total cost by how much?`,
            `一个圈的顺向弧单位费用是 ${f1} 和 ${f2}，逆向弧单位费用是 ${b1} 和 ${b2}。沿这个圈多送 ${theta} 单位，总费用变化多少？`,
          ],
          change,
          [theta * (f1 + f2 + b1 + b2), f1 + f2 - b1 - b2, -change],
          [
            `Forward arcs add $${f1 + f2}$ per unit and backward arcs save $${b1 + b2}$ per unit, so each unit changes the cost by ${f1 + f2 - b1 - b2}. For ${theta} units that is ${change}.`,
            `顺向弧每单位增加 $${f1 + f2}$，逆向弧每单位节省 $${b1 + b2}$，所以每单位费用变化 ${f1 + f2 - b1 - b2}。${theta} 单位就是 ${change}。`,
          ],
        );
      },
    ),
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
