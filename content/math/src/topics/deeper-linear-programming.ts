// Further knowledge points for topics of Linear Programming, each a skill the topic's own points
// leave out. See `deeperLinearProgrammingPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { linearProgrammingDrawings1 } from "../explanation-drawings-linear-programming-1.ts";

import { ask, choose, type Pair, point } from "../university-kit.ts";

/** frac builds a rational number with a positive denominator. */
const frac = (n: number, d: number) => (d < 0 ? Q.of(-n, -d) : Q.of(n, d));

/** term writes a coefficient before a variable, leaving out 1. */
const term = (c: number, name: string) => (c === 1 ? name : `${c}${name}`);

/** matrix writes a matrix by its rows. */
const matrix = (rows: readonly (readonly number[])[]) => `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

const largestBatch = point(
  "the-largest-batch-of-one-product",
  ["The largest batch of one product", "单一产品的最大批量"],
  [
    "If a plan makes only one product, each constraint limits it separately. The tightest limit decides, so the largest batch is the smallest of the ratios of supply to use. This is a first feasible corner of the region, on an axis, and an early check on any model.",
    "如果计划只生产一种产品，每个约束都单独限制它。最紧的限制起决定作用，所以最大批量是供应量与用量之比中最小的一个。这是可行域在坐标轴上的一个顶点，也是对模型的初步检查。",
  ],
  (rng) => {
    const [a, b] = [rng.int(2, 6), rng.int(2, 6)];
    const [c, d] = [a * rng.int(3, 15), b * rng.int(3, 15)];
    const answer = Math.min(c / a, d / b);
    return ask(
      [
        `Each chair uses ${a} hours of cutting and ${b} hours of finishing. There are ${c} hours of cutting and ${d} hours of finishing. What is the most chairs that can be made?`,
        `每把椅子用 ${a} 小时切割和 ${b} 小时加工。共有 ${c} 小时切割和 ${d} 小时加工。最多能做多少把椅子？`,
      ],
      answer,
      [Math.max(c / a, d / b), c + d, Math.floor((c + d) / (a + b)) + 1, answer + 1].filter((v) => v !== answer),
      [
        `Cutting allows ${c / a} chairs and finishing allows ${d / b}. The smaller limit decides, so the answer is ${answer}.`,
        `切割允许 ${c / a} 把，加工允许 ${d / b} 把。较小的限制起决定作用，所以答案是 ${answer}。`,
      ],
    );
  },
);

const objectiveSlope = {
  ...point(
    "the-slope-of-the-objective-line",
    ["The slope of the objective line", "目标线的斜率"],
    [
      "All plans with the same value of $c_1 x + c_2 y$ lie on one line, with slope $-\\frac{c_1}{c_2}$. Increasing the value slides this line parallel to itself. Comparing its slope with the edges of the region shows which corner it leaves last, which is the optimal corner.",
      "所有使 $c_1 x + c_2 y$ 取同一值的计划都在一条直线上，斜率是 $-\\frac{c_1}{c_2}$。增大这个值就把直线平行移动。比较它的斜率和可行域的边，就能看出它最后离开哪个顶点，那就是最优顶点。",
    ],
    (rng) => {
      const [a, b] = [rng.int(1, 9), rng.int(2, 9)];
      const answer = frac(-a, b);
      return ask(
        [
          `What is the slope of the lines of constant value for the objective $${term(a, "x")} + ${term(b, "y")}$?`,
          `目标 $${term(a, "x")} + ${term(b, "y")}$ 的等值线的斜率是多少？`,
        ],
        answer,
        [frac(a, b), frac(-b, a), frac(b, a), Q.of(-a, 1)],
        [
          `Solving for $y$ gives $y = -\\frac{${a}}{${b}} x + \\text{constant}$, so the slope is $${answer.toLatex()}$.`,
          `解出 $y$ 得 $y = -\\frac{${a}}{${b}} x + \\text{常数}$，所以斜率是 $${answer.toLatex()}$。`,
        ],
      );
    },
  ),
  figure: linearProgrammingDrawings1["the-graphical-method-for-linear-programs#the-slope-of-the-objective-line"],
};

const freeVariables = point(
  "splitting-a-free-variable",
  ["Splitting a free variable", "拆分自由变量"],
  [
    "Standard form needs every variable to be nonnegative. A variable free to take any sign is written as $x = x^+ - x^-$, a difference of two nonnegative variables. So each free variable adds one column, and each inequality adds one slack or surplus column.",
    "标准形要求每个变量都非负。可取任意符号的变量写成 $x = x^+ - x^-$，即两个非负变量之差。所以每个自由变量增加一列，每个不等式增加一个松弛或剩余变量列。",
  ],
  (rng) => {
    const [n, m] = [rng.int(2, 7), rng.int(2, 7)];
    const k = rng.int(1, n);
    const e = rng.int(0, m - 1);
    const answer = n + k + (m - e);
    return ask(
      [
        `A program has ${n} variables, with ${k} free, and ${m} constraints, with ${e} ${e === 1 ? "equation" : "equations"}. How many variables does its standard form have?`,
        `一个规划有 ${n} 个变量，其中 ${k} 个是自由变量；有 ${m} 个约束，其中 ${e} 个是等式。它的标准形有多少个变量？`,
      ],
      answer,
      [n + m, n + k + m, n + m - e, 2 * n + m].filter((v) => v !== answer),
      [
        `Start with ${n}, add ${k} for the free variables, and add ${m - e} slack or surplus variables for the inequalities, to get ${answer}.`,
        `从 ${n} 开始，自由变量增加 ${k} 个，不等式增加 ${m - e} 个松弛或剩余变量，共 ${answer} 个。`,
      ],
    );
  },
);

const basicFeasibility = point(
  "testing-a-basic-solution-for-feasibility",
  ["Testing a basic solution for feasibility", "检验基本解的可行性"],
  [
    "A basic solution comes from setting the nonbasic variables to 0 and solving for the rest. It is feasible only when every basic variable turns out nonnegative. So a negative slack means that the point lies outside the region, where the corresponding constraint is violated.",
    "基本解是令非基变量为 0 再解出其余变量得到的。只有当每个基变量都非负时，它才可行。所以松弛变量为负说明这个点在可行域之外，相应的约束被违反。",
  ],
  (rng) => {
    const [a, c] = [rng.int(1, 5), rng.int(1, 5)];
    const b = a * rng.int(2, 9);
    const d = rng.int(4, 40);
    const x = b / a;
    const answer = d - c * x;
    return ask(
      [
        `In $${term(a, "x")} + y + s_1 = ${b}$ and $${term(c, "x")} + y + s_2 = ${d}$, set $y = 0$ and $s_1 = 0$. What is $s_2$?`,
        `在 $${term(a, "x")} + y + s_1 = ${b}$ 和 $${term(c, "x")} + y + s_2 = ${d}$ 中，令 $y = 0$，$s_1 = 0$。$s_2$ 是多少？`,
      ],
      answer,
      [d - x, d + c * x, c * x - d, d].filter((v) => v !== answer),
      [
        `The first equation gives $x = ${x}$, and the second gives $s_2 = ${d} - ${c} \\cdot ${x} = ${answer}$. ${answer < 0 ? "This is negative, so the solution is not feasible." : "This is not negative, so the solution is feasible."}`,
        `第一个方程给出 $x = ${x}$，第二个给出 $s_2 = ${d} - ${c} \\cdot ${x} = ${answer}$。${answer < 0 ? "它是负数，所以这个解不可行。" : "它不是负数，所以这个解可行。"}`,
      ],
    );
  },
);

const optimalTableau: KnowledgePointDef = point(
  "whether-a-tableau-is-optimal",
  ["Whether a tableau is optimal", "单纯形表是否最优"],
  [
    "Write the objective row of a maximization as $z + \\sum c_j x_j = v$. A negative coefficient means that raising its variable raises $z$, so the tableau is not yet optimal. When all the coefficients are nonnegative, no single change helps, and the current value is the maximum.",
    "把最大化问题的目标行写成 $z + \\sum c_j x_j = v$。系数为负说明增大相应变量会增大 $z$，所以单纯形表还不是最优。当所有系数都非负时，任何单个变化都没有帮助，当前值就是最大值。",
  ],
  (rng) => {
    const [a, b, v] = [rng.int(1, 9), rng.int(1, 9), rng.int(10, 60)];
    const negative = rng.int(0, 2);
    const first = negative === 1 ? -a : a;
    const second = negative === 2 ? -b : b;
    const row = `z ${first < 0 ? "-" : "+"} ${term(Math.abs(first), "x_1")} ${second < 0 ? "-" : "+"} ${term(Math.abs(second), "s_1")} = ${v}`;
    const entering = negative === 1 ? "x_1" : "s_1";
    const optimal: Pair = [`It is optimal, with maximum ${v}`, `最优，最大值是 ${v}`];
    const notOptimalA: Pair = ["Not optimal: $x_1$ should enter", "不是最优：$x_1$ 应当进基"];
    const notOptimalB: Pair = ["Not optimal: $s_1$ should enter", "不是最优：$s_1$ 应当进基"];
    return choose(
      rng,
      [
        `A maximization tableau has objective row $${row}$. What does it tell you?`,
        `一个最大化单纯形表的目标行是 $${row}$。它说明了什么？`,
      ],
      negative === 0 ? optimal : negative === 1 ? notOptimalA : notOptimalB,
      [optimal, notOptimalA, notOptimalB, ["The program is unbounded", "这个规划无界"]],
      [
        negative === 0
          ? "Both coefficients are positive, so raising either variable would lower $z$."
          : `The coefficient of $${entering}$ is negative, so raising $${entering}$ raises $z$.`,
        negative === 0
          ? "两个系数都是正的，所以增大任一变量都会使 $z$ 减小。"
          : `$${entering}$ 的系数是负的，所以增大 $${entering}$ 会使 $z$ 增大。`,
      ],
    );
  },
);

const phaseOneStart = point(
  "the-starting-value-of-phase-one",
  ["The starting value of phase one", "第一阶段的初始值"],
  [
    "Phase one minimizes the sum of the artificial variables. At the start, each artificial variable equals the right side of its row, because the other variables are 0. So the first value is the sum of those right sides, and it must fall to 0 for the program to be feasible.",
    "第一阶段最小化人工变量之和。开始时每个人工变量都等于所在行的右端，因为其他变量都是 0。所以初始值是这些右端之和，它必须降到 0，规划才可行。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(2, 30), rng.int(2, 30), rng.int(2, 30)];
    const answer = b + c;
    return ask(
      [
        `A program has the constraints $x + y \\le ${a}$, $2x + y \\ge ${b}$ and $x + 3y = ${c}$. What is the phase one objective at the initial basis?`,
        `一个规划有约束 $x + y \\le ${a}$，$2x + y \\ge ${b}$ 和 $x + 3y = ${c}$。第一阶段目标在初始基处的值是多少？`,
      ],
      answer,
      [a + b + c, b, c, a + c].filter((v) => v !== answer),
      [
        `The $\\le$ row has a slack variable, while the other two rows need artificial variables, equal to ${b} and ${c}. So the sum is ${answer}.`,
        `$\\le$ 行有松弛变量，另外两行需要人工变量，它们等于 ${b} 和 ${c}。所以和是 ${answer}。`,
      ],
    );
  },
);

const rateAlongRay = point(
  "the-rate-along-an-unbounded-ray",
  ["The rate along an unbounded ray", "无界射线上的增长率"],
  [
    "An unbounded program has a ray of feasible points $p + t d$ for $t \\ge 0$. Along it, the objective $c \\cdot x$ changes at the constant rate $c \\cdot d$ per unit of $t$. A positive rate in a maximization makes the value grow without limit, and proves that no optimum exists.",
    "无界规划有一条可行射线 $p + t d$（$t \\ge 0$）。沿着它，目标 $c \\cdot x$ 以常数速率 $c \\cdot d$ 随 $t$ 变化。在最大化问题中，正的速率使值无限增长，这证明了不存在最优解。",
  ],
  (rng) => {
    const [c1, c2, d1, d2] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 5), rng.int(1, 5)];
    const answer = c1 * d1 + c2 * d2;
    return ask(
      [
        `Along the feasible ray with direction $(${d1}, ${d2})$, how fast does the objective $${term(c1, "x")} + ${term(c2, "y")}$ grow per unit of $t$?`,
        `沿方向为 $(${d1}, ${d2})$ 的可行射线，目标 $${term(c1, "x")} + ${term(c2, "y")}$ 随 $t$ 每单位增长多少？`,
      ],
      answer,
      [c1 + c2, d1 + d2, c1 * d2 + c2 * d1, answer + 1].filter((v) => v !== answer),
      [
        `The rate is the dot product: $${c1} \\cdot ${d1} + ${c2} \\cdot ${d2} = ${answer}$.`,
        `速率是点积：$${c1} \\cdot ${d1} + ${c2} \\cdot ${d2} = ${answer}$。`,
      ],
    );
  },
);

const dualSize = point(
  "the-size-of-the-dual",
  ["The size of the dual", "对偶规划的规模"],
  [
    "Each constraint of the primal gives one variable of the dual, and each variable of the primal gives one constraint of the dual. So the dual of a program with $m$ constraints and $n$ variables has $n$ constraints and $m$ variables. This makes the dual attractive when a program has many more rows than columns.",
    "原规划的每个约束给出对偶规划的一个变量，每个变量给出对偶规划的一个约束。所以有 $m$ 个约束和 $n$ 个变量的规划，其对偶有 $n$ 个约束和 $m$ 个变量。当规划的行数远多于列数时，对偶就很有吸引力。",
  ],
  (rng) => {
    const [m, n] = [rng.int(2, 15), rng.int(2, 15)];
    const askVariables = rng.bool();
    const answer = askVariables ? m : n;
    return ask(
      [
        `A primal program has ${m} constraints and ${n} variables. How many ${askVariables ? "variables" : "constraints"} does its dual have, not counting signs?`,
        `原规划有 ${m} 个约束和 ${n} 个变量。不计符号约束，它的对偶有多少个${askVariables ? "变量" : "约束"}？`,
      ],
      answer,
      [askVariables ? n : m, m + n, m * n, answer + 1].filter((v) => v !== answer),
      [
        askVariables
          ? `Each primal constraint gives a dual variable, so there are ${m}.`
          : `Each primal variable gives a dual constraint, so there are ${n}.`,
        askVariables ? `原规划的每个约束给出一个对偶变量，所以有 ${m} 个。` : `原规划的每个变量给出一个对偶约束，所以有 ${n} 个。`,
      ],
    );
  },
);

const primalFromDual = point(
  "recovering-the-primal-from-the-dual",
  ["Recovering the primal from the dual", "由对偶解恢复原解"],
  [
    "Complementary slackness says that a positive dual variable forces its primal constraint to hold with equality. If both dual variables are positive in a program with two constraints and two variables, both constraints are tight. Then the primal solution comes from solving two linear equations.",
    "互补松弛性说明：正的对偶变量迫使相应的原约束取等号。如果两个约束两个变量的规划中两个对偶变量都是正的，两个约束就都是紧的。这时原问题的解就由解两个线性方程得到。",
  ],
  (rng) => {
    const [x, y] = [rng.int(1, 9), rng.int(1, 9)];
    const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
    let [c, d] = [rng.int(1, 4), rng.int(1, 4)];
    while (a * d === b * c) [c, d] = [rng.int(1, 4), rng.int(1, 4)];
    const [e, f] = [a * x + b * y, c * x + d * y];
    const askX = rng.bool();
    const answer = askX ? x : y;
    return ask(
      [
        `The optimal dual solution of a program with constraints $${term(a, "x")} + ${term(b, "y")} \\le ${e}$ and $${term(c, "x")} + ${term(d, "y")} \\le ${f}$ has both variables positive. What is the optimal $${askX ? "x" : "y"}$?`,
        `规划的约束是 $${term(a, "x")} + ${term(b, "y")} \\le ${e}$ 和 $${term(c, "x")} + ${term(d, "y")} \\le ${f}$，最优对偶解的两个变量都是正的。最优的 $${askX ? "x" : "y"}$ 是多少？`,
      ],
      answer,
      [askX ? y : x, e, f, answer + 1].filter((v) => v !== answer),
      [
        `Positive dual variables make both constraints equations, and these have the solution $x = ${x}$, $y = ${y}$.`,
        `正的对偶变量使两个约束都成为等式，它们的解是 $x = ${x}$，$y = ${y}$。`,
      ],
    );
  },
);

const twoShadowPrices = point(
  "combining-two-shadow-prices",
  ["Combining two shadow prices", "合并两个影子价格"],
  [
    "Within the range where the basis stays optimal, the optimal value changes linearly with the right sides. A change $\\Delta b$ alters the value by $y \\cdot \\Delta b$, where $y$ is the vector of shadow prices. So several small changes can be priced one at a time and added.",
    "在基保持最优的范围内，最优值随右端线性变化。变化 $\\Delta b$ 使值改变 $y \\cdot \\Delta b$，其中 $y$ 是影子价格向量。所以几个小变化可以逐个定价再相加。",
  ],
  (rng) => {
    const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
    const [d1, d2] = [rng.int(1, 6), rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4])];
    const v = rng.int(50, 200);
    const answer = v + y1 * d1 + y2 * d2;
    return ask(
      [
        `The optimal value is ${v}, and the shadow prices are ${y1} and ${y2}. Within the valid range, the first resource rises by ${d1} and the second ${d2 < 0 ? `falls by ${-d2}` : `rises by ${d2}`}. What is the new optimal value?`,
        `最优值是 ${v}，影子价格是 ${y1} 和 ${y2}。在有效范围内，第一种资源增加 ${d1}，第二种${d2 < 0 ? `减少 ${-d2}` : `增加 ${d2}`}。新的最优值是多少？`,
      ],
      answer,
      [v + y1 * d1, v + y2 * d2, v + y1 * d1 + y2 * Math.abs(d2) + 1, v + y1 * d2 + y2 * d1].filter((w) => w !== answer),
      [
        `The change is $${y1} \\cdot ${d1} + ${y2} \\cdot (${d2}) = ${answer - v}$, so the new value is ${answer}.`,
        `变化量是 $${y1} \\cdot ${d1} + ${y2} \\cdot (${d2}) = ${answer - v}$，所以新值是 ${answer}。`,
      ],
    );
  },
);

const columnInBasis = point(
  "a-column-in-the-current-basis",
  ["A column in the current basis", "当前基下的列"],
  [
    "The revised simplex method does not store the whole tableau. When a column is needed, it computes $B^{-1} A_j$ from the original column $A_j$. The result gives the rates at which the basic variables change as the entering variable grows, and so supplies the numbers for the ratio test.",
    "修正单纯形法不保存整个单纯形表。需要某一列时，它由原始列 $A_j$ 计算 $B^{-1} A_j$。结果给出进基变量增大时各基变量的变化率，从而提供比值检验所需的数。",
  ],
  (rng) => {
    const [a, b, c, d] = [rng.int(1, 5), rng.pick([-3, -2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2]), rng.int(1, 5)];
    const [p, q] = [rng.int(1, 6), rng.int(1, 6)];
    const row = rng.bool();
    const answer = row ? a * p + b * q : c * p + d * q;
    return ask(
      [
        `$B^{-1} = ${matrix([
          [a, b],
          [c, d],
        ])}$ and $A_j = ${matrix([[p], [q]])}$. What is the ${row ? "first" : "second"} entry of $B^{-1} A_j$?`,
        `$B^{-1} = ${matrix([
          [a, b],
          [c, d],
        ])}$，$A_j = ${matrix([[p], [q]])}$。$B^{-1} A_j$ 的第${row ? "一" : "二"}个分量是多少？`,
      ],
      answer,
      [row ? c * p + d * q : a * p + b * q, a * p + c * q, b * p + d * q, answer + 1].filter((v) => v !== answer),
      [
        row
          ? `The first row gives $${a} \\cdot ${p} + (${b}) \\cdot ${q} = ${answer}$.`
          : `The second row gives $(${c}) \\cdot ${p} + ${d} \\cdot ${q} = ${answer}$.`,
        row
          ? `第一行给出 $${a} \\cdot ${p} + (${b}) \\cdot ${q} = ${answer}$。`
          : `第二行给出 $(${c}) \\cdot ${p} + ${d} \\cdot ${q} = ${answer}$。`,
      ],
    );
  },
);

const shippingCost = point(
  "the-cost-of-a-shipping-plan",
  ["The cost of a shipping plan", "运输方案的成本"],
  [
    "A transportation plan assigns an amount to each route, and the total cost adds each amount times the unit cost of that route. Comparing a plan with an alternative by this total is the basis of every improvement step. Empty routes contribute nothing, however expensive they would be.",
    "运输方案给每条路线分配一个运量，总成本是各运量乘以该路线单位成本之和。用这个总成本比较方案是每一步改进的基础。空路线没有贡献，不管它多贵。",
  ],
  (rng) => {
    const costs = [
      [rng.int(1, 9), rng.int(1, 9)],
      [rng.int(1, 9), rng.int(1, 9)],
    ] as const;
    const empty = rng.int(0, 3);
    const plan = [
      [empty === 0 ? 0 : rng.int(1, 20), empty === 1 ? 0 : rng.int(1, 20)],
      [empty === 2 ? 0 : rng.int(1, 20), empty === 3 ? 0 : rng.int(1, 20)],
    ] as const;
    const answer = costs[0][0] * plan[0][0] + costs[0][1] * plan[0][1] + costs[1][0] * plan[1][0] + costs[1][1] * plan[1][1];
    return ask(
      [
        `The unit costs are $${matrix(costs)}$ and the plan ships $${matrix(plan)}$, route by route. What is the total cost?`,
        `单位成本是 $${matrix(costs)}$，方案按路线运送 $${matrix(plan)}$。总成本是多少？`,
      ],
      answer,
      [
        (costs[0][0] + costs[0][1] + costs[1][0] + costs[1][1]) * 2,
        costs[0][0] * plan[1][1] + costs[1][1] * plan[0][0] + costs[0][1] * plan[1][0] + costs[1][0] * plan[0][1],
        plan[0][0] + plan[0][1] + plan[1][0] + plan[1][1],
        answer + 1,
      ].filter((v) => v !== answer),
      [`Multiply matching entries and add them: the total is ${answer}.`, `对应项相乘再相加：总成本是 ${answer}。`],
    );
  },
);

const loopStep = point(
  "the-saving-from-a-loop",
  ["The saving from a loop", "沿回路的节省"],
  [
    "To bring an empty cell into a plan, ship $\\theta$ around a closed loop, adding and subtracting in turn. The largest possible $\\theta$ is the smallest amount on a cell that loses shipments. The total cost then falls by $\\theta$ times the amount saved per unit around that loop.",
    "要让空格进入方案，就沿闭合回路运送 $\\theta$，交替增减。$\\theta$ 最大是减少运量的格子中的最小运量。总成本于是减少 $\\theta$ 乘以回路上每单位的节省。",
  ],
  (rng) => {
    const [x, y] = [rng.int(3, 30), rng.int(3, 30)];
    const saving = rng.int(1, 9);
    const cost = rng.int(300, 900);
    const theta = Math.min(x, y);
    const answer = cost - theta * saving;
    return ask(
      [
        `A plan costs ${cost}. An empty cell saves ${saving} per unit around a loop whose losing cells hold ${x} and ${y}. What is the cost after shipping as much as possible around the loop?`,
        `一个方案的成本是 ${cost}。某空格沿回路每单位节省 ${saving}，回路上减少运量的格子分别有 ${x} 和 ${y}。沿回路尽量多运之后，成本是多少？`,
      ],
      answer,
      [cost - Math.max(x, y) * saving, cost - saving, cost - (x + y) * saving, cost + theta * saving].filter((v) => v !== answer),
      [
        `The step is $\\theta = ${theta}$, the smaller holding, so the cost is $${cost} - ${theta} \\cdot ${saving} = ${answer}$.`,
        `步长 $\\theta = ${theta}$，即较小的运量，所以成本是 $${cost} - ${theta} \\cdot ${saving} = ${answer}$。`,
      ],
    );
  },
);

const reductionBound = point(
  "a-lower-bound-from-reductions",
  ["A lower bound from reductions", "由化简得到的下界"],
  [
    "Every assignment uses one entry from each row. So subtracting a row's minimum lowers every assignment's cost by that amount, and the same goes for columns. The total subtracted is therefore a lower bound on the optimal cost, and it is the optimal cost when zeros allow a full assignment.",
    "每个分配都从每行取一个元素。所以从一行减去它的最小值，会使每个分配的成本减少同样的量，列也一样。因此减去的总量是最优成本的下界；当零元素能构成完整分配时，它就是最优成本。",
  ],
  (rng) => {
    const rows = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(1, 12)));
    const rowMins = rows.map((r) => Math.min(...r));
    const reduced = rows.map((r, i) => r.map((v) => v - (rowMins[i] as number)));
    const colMins = [0, 1, 2].map((j) => Math.min(...reduced.map((r) => r[j] as number)));
    const rowSum = rowMins.reduce((x, y) => x + y, 0);
    const colSum = colMins.reduce((x, y) => x + y, 0);
    const answer = rowSum + colSum;
    return ask(
      [
        `Reduce the cost matrix $${matrix(rows)}$ by rows and then by columns. What total was subtracted, the lower bound on the optimal cost?`,
        `先按行再按列化简成本矩阵 $${matrix(rows)}$。减去的总量（最优成本的下界）是多少？`,
      ],
      answer,
      [
        rowSum === answer ? answer + 1 : rowSum,
        answer + 2,
        rows.flat().reduce((x, y) => x + y, 0),
        Math.min(...rows.flat()) * 3 === answer ? answer + 3 : Math.min(...rows.flat()) * 3,
      ],
      [
        `The row minima add up to ${rowSum}, and the column minima of the result add up to ${colSum}, for a total of ${answer}.`,
        `各行最小值之和是 ${rowSum}，化简后各列最小值之和是 ${colSum}，合计 ${answer}。`,
      ],
    );
  },
);

const residualCapacity = point(
  "residual-capacities",
  ["Residual capacities", "残量容量"],
  [
    "An edge with capacity $c$ carrying flow $f$ can take $c - f$ more in its own direction. It can also give back up to $f$ in the opposite direction, by cancelling flow. The residual network records both, and any path through it from source to sink can increase the flow.",
    "容量为 $c$、流量为 $f$ 的边在正方向还能增加 $c - f$。它在反方向也能退回至多 $f$，即取消已有流量。残量网络记录这两者，其中从源到汇的任何路径都能增大流量。",
  ],
  (rng) => {
    const c = rng.int(5, 30);
    const f = rng.int(1, c - 1);
    const forward = rng.bool();
    const answer = forward ? c - f : f;
    return ask(
      [
        `The edge from $u$ to $v$ has capacity ${c} and carries a flow of ${f}. What is the residual capacity from $${forward ? "u" : "v"}$ to $${forward ? "v" : "u"}$?`,
        `从 $u$ 到 $v$ 的边容量是 ${c}，流量是 ${f}。从 $${forward ? "u" : "v"}$ 到 $${forward ? "v" : "u"}$ 的残量容量是多少？`,
      ],
      answer,
      [forward ? f : c - f, c, c + f, 0].filter((v) => v !== answer),
      [
        forward
          ? `Along the edge, the room left is $${c} - ${f} = ${answer}$.`
          : `Against the edge, the existing flow of ${f} can be cancelled.`,
        forward ? `沿边方向，剩余空间是 $${c} - ${f} = ${answer}$。` : `逆着边的方向，可以取消已有的流量 ${f}。`,
      ],
    );
  },
);

const relaxing = point(
  "relaxing-an-edge",
  ["Relaxing an edge", "松弛一条边"],
  [
    "Shortest path methods keep a tentative distance for each node. Relaxing the edge from $u$ to $v$ replaces $d(v)$ by $\\min(d(v), d(u) + w)$, since this edge offers a route of that length. At the optimum, no edge can improve any distance, which is exactly feasibility of the dual potentials.",
    "最短路方法为每个结点保留一个暂定距离。松弛从 $u$ 到 $v$ 的边，就是把 $d(v)$ 换成 $\\min(d(v), d(u) + w)$，因为这条边提供了这样长的路线。最优时任何边都不能再改进距离，这正是对偶势的可行性。",
  ],
  (rng) => {
    const [du, w, dv] = [rng.int(2, 30), rng.int(1, 20), rng.int(5, 45)];
    const answer = Math.min(dv, du + w);
    return ask(
      [
        `Tentative distances are $d(u) = ${du}$ and $d(v) = ${dv}$. The edge from $u$ to $v$ has length ${w}. What is $d(v)$ after relaxing it?`,
        `暂定距离是 $d(u) = ${du}$，$d(v) = ${dv}$。从 $u$ 到 $v$ 的边长是 ${w}。松弛后 $d(v)$ 是多少？`,
      ],
      answer,
      [Math.max(dv, du + w), du, dv + w, du + w + 1].filter((v) => v !== answer),
      [
        `The edge offers $${du} + ${w} = ${du + w}$, against the current ${dv}. The smaller value, ${answer}, stays.`,
        `这条边提供 $${du} + ${w} = ${du + w}$，当前是 ${dv}。留下较小的值 ${answer}。`,
      ],
    );
  },
);

const integerBound = point(
  "the-bound-from-the-relaxation",
  ["The bound from the relaxation", "松弛问题给出的界"],
  [
    "Dropping the integer requirement can only enlarge the feasible set, so the relaxation's maximum bounds the integer maximum from above. When all objective coefficients and variables are whole numbers, the objective is a whole number too. So the bound can be rounded down.",
    "去掉整数要求只会扩大可行集，所以松弛问题的最大值是整数最大值的上界。当目标系数和变量都是整数时，目标值也是整数。所以这个界可以向下取整。",
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6, 7]);
    const whole = rng.int(5, 40);
    const r = rng.int(1, d - 1);
    const value = frac(whole * d + r, d);
    return ask(
      [
        `A maximization with whole coefficients has relaxation value $${value.toLatex()}$. What is the best upper bound on its integer optimum?`,
        `一个整数系数的最大化问题，松弛值是 $${value.toLatex()}$。它的整数最优值的最好上界是多少？`,
      ],
      whole,
      [whole + 1, whole - 1, whole * d + r, whole + r],
      [
        `The integer optimum is a whole number no larger than $${value.toLatex()}$, so it is at most ${whole}.`,
        `整数最优值是不超过 $${value.toLatex()}$ 的整数，所以至多是 ${whole}。`,
      ],
    );
  },
);

const maximin = point(
  "the-lower-and-upper-values-of-a-game",
  ["The lower and upper values of a game", "博弈的下值与上值"],
  [
    "The row player can guarantee the maximin, the largest of the row minima. The column player can hold the row player to the minimax, the smallest of the column maxima. The first never exceeds the second, and the gap between them is what mixed strategies close.",
    "行参与者能保证最大最小值，即各行最小值中的最大者。列参与者能把行参与者限制在最小最大值，即各列最大值中的最小者。前者从不超过后者，它们之间的差距正是混合策略所要弥合的。",
  ],
  (rng) => {
    const rows = [0, 1].map(() => [0, 1, 2].map(() => rng.int(-5, 9)));
    const lower = Math.max(...rows.map((r) => Math.min(...r)));
    const upper = Math.min(...[0, 1, 2].map((j) => Math.max(...rows.map((r) => r[j] as number))));
    const askLower = rng.bool();
    const answer = askLower ? lower : upper;
    return ask(
      [
        `In the matrix game $${matrix(rows)}$, with entries paid to the row player, what is the ${askLower ? "maximin, the largest row minimum" : "minimax, the smallest column maximum"}?`,
        `在矩阵博弈 $${matrix(rows)}$ 中（数值付给行参与者），${askLower ? "最大最小值（各行最小值中的最大者）" : "最小最大值（各列最大值中的最小者）"}是多少？`,
      ],
      answer,
      [askLower ? upper : lower, answer + 1, answer - 1, Math.max(...rows.flat())].filter((v) => v !== answer),
      [
        askLower
          ? `The row minima are ${rows.map((r) => Math.min(...r)).join(" and ")}, and the larger is ${answer}.`
          : `The column maxima are ${[0, 1, 2].map((j) => Math.max(...rows.map((r) => r[j] as number))).join(", ")}, and the smallest is ${answer}.`,
        askLower
          ? `各行最小值是 ${rows.map((r) => Math.min(...r)).join(" 和 ")}，较大的是 ${answer}。`
          : `各列最大值是 ${[0, 1, 2].map((j) => Math.max(...rows.map((r) => r[j] as number))).join("、")}，最小的是 ${answer}。`,
      ],
    );
  },
);

/** deeperLinearProgrammingPoints maps topics of Linear Programming to their further knowledge points. */
export const deeperLinearProgrammingPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "formulating-linear-programs": [largestBatch],
  "the-graphical-method-for-linear-programs": [objectiveSlope],
  "standard-form-and-slack-variables": [freeVariables],
  "basic-feasible-solutions": [basicFeasibility],
  "the-simplex-tableau": [optimalTableau],
  "the-two-phase-method": [phaseOneStart],
  "unboundedness-and-degeneracy": [rateAlongRay],
  "the-dual-of-a-linear-program": [dualSize],
  "strong-duality-and-complementary-slackness": [primalFromDual],
  "sensitivity-analysis": [twoShadowPrices],
  "the-revised-simplex-method": [columnInBasis],
  "the-transportation-problem": [shippingCost],
  "improving-a-transportation-plan": [loopStep],
  "the-assignment-problem": [reductionBound],
  "maximum-flow-and-minimum-cut": [residualCapacity],
  "shortest-paths-as-linear-programs": [relaxing],
  "integer-programming": [integerBound],
  "matrix-games": [maximin],
};
