// Further knowledge points for topics of Linear Programming, each a skill the topic's own points
// leave out. See `deeperLinearProgrammingPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { linearProgrammingDrawings1 } from "../explanation-drawings-linear-programming-1.ts";

import { type Pair, point } from "../university-kit.ts";
import { plus, solved } from "./linear-programming.ts";
import { chosen } from "./number-theory-course.ts";

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
    "If a plan makes only one product, each constraint limits it separately. The tightest limit decides, so the largest batch is the smallest of the ratios of supply to use. This is a first feasible corner of the region, on an axis, and an early check on any model.\n\nA table uses 4 hours of cutting and 3 of finishing, with 40 hours of cutting and 24 of finishing. Cutting allows $\\frac{40}{4} = 10$ tables and finishing allows $\\frac{24}{3} = 8$, so at most 8 can be made.\n\nCheck: 8 tables use 32 hours of cutting and 24 of finishing, both within supply, while 9 would need 27 hours of finishing.\n\n> **Watch out.** Every constraint must hold at once, so take the smallest ratio, not the largest.",
    "如果计划只生产一种产品，每个约束都单独限制它。最紧的限制起决定作用，所以最大批量是供应量与用量之比中最小的一个。这是可行域在坐标轴上的一个顶点，也是对模型的初步检查。\n\n一张桌子用 4 小时切割和 3 小时加工，共有 40 小时切割和 24 小时加工。切割允许 $\\frac{40}{4} = 10$ 张，加工允许 $\\frac{24}{3} = 8$ 张，所以最多做 8 张。\n\n检验：8 张桌子用 32 小时切割和 24 小时加工，都不超过供应，而 9 张需要 27 小时加工。\n\n> **注意。** 每个约束必须同时满足，所以要取最小的比值，而不是最大的。",
  ],
  (rng) => {
    const [a, b] = [rng.int(2, 6), rng.int(2, 6)];
    const [c, d] = [a * rng.int(3, 15), b * rng.int(3, 15)];
    const answer = Math.min(c / a, d / b);
    return solved(
      [
        `Each chair uses ${a} hours of cutting and ${b} hours of finishing. There are ${c} hours of cutting and ${d} hours of finishing. What is the most chairs that can be made?`,
        `每把椅子用 ${a} 小时切割和 ${b} 小时加工。共有 ${c} 小时切割和 ${d} 小时加工。最多能做多少把椅子？`,
      ],
      answer,
      [
        [Math.max(c / a, d / b), "That is the looser limit; the other resource runs out first.", "这是较松的限制；另一种资源会先用完。"],
        [
          c + d,
          "That adds the hours of supply without dividing by the hours each chair uses.",
          "这把供应的小时数相加了，没有除以每把椅子的用时。",
        ],
        [
          Math.floor((c + d) / (a + b)) + 1,
          "That pools the two resources, but hours of cutting cannot be used for finishing.",
          "这把两种资源合在一起了，但切割的小时不能用来加工。",
        ],
        [
          answer + 1,
          "One more chair would need more hours than the tighter resource has.",
          "再多一把椅子，所需的时间就超过较紧那种资源的供应。",
        ],
      ],
      [
        [
          ["Divide supply by use", "供应除以用量"],
          [
            `Cutting allows $\\frac{${c}}{${a}} = ${c / a}$ chairs and finishing allows $\\frac{${d}}{${b}} = ${d / b}$.`,
            `切割允许 $\\frac{${c}}{${a}} = ${c / a}$ 把，加工允许 $\\frac{${d}}{${b}} = ${d / b}$ 把。`,
          ],
        ],
        [
          ["Take the smaller limit", "取较小的限制"],
          [`Both must hold, so at most ${answer} chairs can be made.`, `两者都要满足，所以最多能做 ${answer} 把。`],
        ],
      ],
      [
        `${answer} chairs use ${a * answer} hours of cutting and ${b * answer} of finishing, within the ${c} and ${d} available.`,
        `${answer} 把椅子用 ${a * answer} 小时切割和 ${b * answer} 小时加工，不超过现有的 ${c} 和 ${d} 小时。`,
      ],
    );
  },
);

const objectiveSlope = {
  ...point(
    "the-slope-of-the-objective-line",
    ["The slope of the objective line", "目标线的斜率"],
    [
      "All plans with the same value of $c_1 x + c_2 y$ lie on one line, with slope $-\\frac{c_1}{c_2}$. Increasing the value slides this line parallel to itself. Comparing its slope with the edges of the region shows which corner it leaves last, which is the optimal corner.\n\nFor the objective $3x + 4y$, the line $3x + 4y = k$ gives $y = -\\frac{3}{4}x + \\frac{k}{4}$, so the slope is $-\\frac{3}{4}$.\n\nCheck: the points $(0, 3)$ and $(4, 0)$ both give $3x + 4y = 12$, and the slope between them is $\\frac{0 - 3}{4 - 0} = -\\frac{3}{4}$.\n\n> **Watch out.** The slope is minus the coefficient of $x$ over the coefficient of $y$; both the sign and the order matter.",
      "所有使 $c_1 x + c_2 y$ 取同一值的计划都在一条直线上，斜率是 $-\\frac{c_1}{c_2}$。增大这个值就把直线平行移动。比较它的斜率和可行域的边，就能看出它最后离开哪个顶点，那就是最优顶点。\n\n目标 $3x + 4y$ 的等值线 $3x + 4y = k$ 给出 $y = -\\frac{3}{4}x + \\frac{k}{4}$，所以斜率是 $-\\frac{3}{4}$。\n\n检验：点 $(0, 3)$ 和 $(4, 0)$ 都使 $3x + 4y = 12$，它们之间的斜率是 $\\frac{0 - 3}{4 - 0} = -\\frac{3}{4}$。\n\n> **注意。** 斜率是负的 $x$ 的系数除以 $y$ 的系数；符号和顺序都要紧。",
    ],
    (rng) => {
      const [a, b] = [rng.int(1, 9), rng.int(2, 9)];
      const answer = frac(-a, b);
      return solved(
        [
          `What is the slope of the lines of constant value for the objective $${term(a, "x")} + ${term(b, "y")}$?`,
          `目标 $${term(a, "x")} + ${term(b, "y")}$ 的等值线的斜率是多少？`,
        ],
        answer,
        [
          [
            frac(a, b),
            "That drops the minus sign: raising $x$ must lower $y$ to keep the value fixed.",
            "这丢了负号：要保持值不变，增大 $x$ 就必须减小 $y$。",
          ],
          [frac(-b, a), "That divides the coefficients the wrong way round.", "这把两个系数的除法顺序弄反了。"],
          [frac(b, a), "That inverts the ratio and drops the minus sign.", "这把比值颠倒了，还丢了负号。"],
          [Q.of(-a, 1), "That forgets to divide by the coefficient of $y$.", "这忘了除以 $y$ 的系数。"],
        ],
        [
          [
            ["Solve for y", "解出纵坐标"],
            [
              `From $${term(a, "x")} + ${term(b, "y")} = k$, $y = -\\frac{${a}}{${b}} x + \\frac{k}{${b}}$.`,
              `由 $${term(a, "x")} + ${term(b, "y")} = k$ 得 $y = -\\frac{${a}}{${b}} x + \\frac{k}{${b}}$。`,
            ],
          ],
          [
            ["Read the slope", "读出斜率"],
            [`The slope is the coefficient of $x$, $${answer.toLatex()}$.`, `斜率是 $x$ 的系数 $${answer.toLatex()}$。`],
          ],
        ],
        [
          `The points $(0, ${a})$ and $(${b}, 0)$ both give the value ${a * b}, and the slope between them is $\\frac{0 - ${a}}{${b} - 0} = ${answer.toLatex()}$.`,
          `点 $(0, ${a})$ 和 $(${b}, 0)$ 都使目标值为 ${a * b}，它们之间的斜率是 $\\frac{0 - ${a}}{${b} - 0} = ${answer.toLatex()}$。`,
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
    "Standard form needs every variable to be nonnegative. A variable free to take any sign is written as $x = x^+ - x^-$, a difference of two nonnegative variables. So each free variable adds one column, and each inequality adds one slack or surplus column.\n\nA program with 3 variables, 1 of them free, and 4 constraints, 1 of them an equation, gets $3 + 1 = 4$ columns from its variables and 3 slack or surplus columns, so 7 variables in all.\n\nCheck: the free variable becomes two columns, the other 2 variables stay, and each of the 3 inequalities adds one column: $2 + 2 + 3 = 7$.\n\n> **Watch out.** An equation needs no slack variable, so count only the inequalities when adding slack and surplus columns.",
    "标准形要求每个变量都非负。可取任意符号的变量写成 $x = x^+ - x^-$，即两个非负变量之差。所以每个自由变量增加一列，每个不等式增加一个松弛或剩余变量列。\n\n一个规划有 3 个变量，其中 1 个是自由变量；有 4 个约束，其中 1 个是等式。变量给出 $3 + 1 = 4$ 列，再加 3 个松弛或剩余变量列，共 7 个变量。\n\n检验：自由变量变成两列，另外 2 个变量不变，3 个不等式各加一列：$2 + 2 + 3 = 7$。\n\n> **注意。** 等式不需要松弛变量，所以加松弛和剩余变量列时只数不等式。",
  ],
  (rng) => {
    const [n, m] = [rng.int(2, 7), rng.int(2, 7)];
    const k = rng.int(1, n);
    const e = rng.int(0, m - 1);
    const answer = n + k + (m - e);
    return solved(
      [
        `A program has ${n} variables, with ${k} free, and ${m} constraints, with ${e} ${e === 1 ? "equation" : "equations"}. How many variables does its standard form have?`,
        `一个规划有 ${n} 个变量，其中 ${k} 个是自由变量；有 ${m} 个约束，其中 ${e} 个是等式。它的标准形有多少个变量？`,
      ],
      answer,
      [
        [
          n + m,
          "That forgets to split the free variables, and it gives the equations slack variables.",
          "这忘了拆分自由变量，还给等式加了松弛变量。",
        ],
        [n + k + m, "That gives the equations slack variables too, but an equation needs none.", "这也给等式加了松弛变量，但等式不需要。"],
        [n + m - e, "That forgets the extra column for each free variable.", "这忘了每个自由变量多出的一列。"],
        [2 * n + m, "That splits every variable, but only the free ones need splitting.", "这把每个变量都拆分了，但只有自由变量需要拆分。"],
      ],
      [
        [
          ["Split the free variables", "拆分自由变量"],
          [
            `Each of the ${k} free variables becomes two, so the variables give $${n} + ${k} = ${n + k}$ columns.`,
            `${k} 个自由变量各变成两个，所以变量给出 $${n} + ${k} = ${n + k}$ 列。`,
          ],
        ],
        [
          ["Add slack and surplus", "加松弛和剩余变量"],
          [
            `The ${m - e} inequalities add one column each, for $${n + k} + ${m - e} = ${answer}$.`,
            `${m - e} 个不等式各加一列，共 $${n + k} + ${m - e} = ${answer}$ 个。`,
          ],
        ],
      ],
      [
        `$2(${k}) + ${n - k} + ${m - e} = ${answer}$: two columns per free variable, one per other variable and one per inequality.`,
        `$2(${k}) + ${n - k} + ${m - e} = ${answer}$：每个自由变量两列，其他每个变量一列，每个不等式一列。`,
      ],
    );
  },
);

const basicFeasibility = point(
  "testing-a-basic-solution-for-feasibility",
  ["Testing a basic solution for feasibility", "检验基本解的可行性"],
  [
    "A basic solution comes from setting the nonbasic variables to 0 and solving for the rest. It is feasible only when every basic variable turns out nonnegative. So a negative slack means that the point lies outside the region, where the corresponding constraint is violated.\n\nIn $2x + y + s_1 = 8$ and $3x + y + s_2 = 10$, setting $y = s_1 = 0$ gives $x = 4$ and $s_2 = 10 - 3(4) = -2$. The slack is negative, so this basic solution is not feasible.\n\nCheck: at $(4, 0)$ the second constraint needs $3x + y \\le 10$, but $3(4) = 12$.\n\n> **Watch out.** A basic solution can be infeasible; it must be tested by the signs of its basic variables.",
    "基本解是令非基变量为 0 再解出其余变量得到的。只有当每个基变量都非负时，它才可行。所以松弛变量为负说明这个点在可行域之外，相应的约束被违反。\n\n在 $2x + y + s_1 = 8$ 和 $3x + y + s_2 = 10$ 中令 $y = s_1 = 0$，得 $x = 4$，$s_2 = 10 - 3(4) = -2$。松弛变量为负，所以这个基本解不可行。\n\n检验：在 $(4, 0)$ 处第二个约束要求 $3x + y \\le 10$，但 $3(4) = 12$。\n\n> **注意。** 基本解可能不可行；要看它的基变量的符号来检验。",
  ],
  (rng) => {
    const [a, c] = [rng.int(1, 5), rng.int(1, 5)];
    const b = a * rng.int(2, 9);
    const d = rng.int(4, 40);
    const x = b / a;
    const answer = d - c * x;
    return solved(
      [
        `In $${term(a, "x")} + y + s_1 = ${b}$ and $${term(c, "x")} + y + s_2 = ${d}$, set $y = 0$ and $s_1 = 0$. What is $s_2$?`,
        `在 $${term(a, "x")} + y + s_1 = ${b}$ 和 $${term(c, "x")} + y + s_2 = ${d}$ 中，令 $y = 0$，$s_1 = 0$。$s_2$ 是多少？`,
      ],
      answer,
      [
        [d - x, `That forgets the coefficient ${c} of $x$ in the second equation.`, `这忘了第二个方程中 $x$ 的系数 ${c}。`],
        [d + c * x, "That adds the term in $x$ instead of moving it across with a minus sign.", "这把含 $x$ 的项加上了，而不是移项变号。"],
        [c * x - d, "That has the sign reversed.", "这把符号弄反了。"],
        [d, "That forgets that $x$ is no longer 0.", "这忘了 $x$ 已经不是 0。"],
      ],
      [
        [
          ["Solve the first equation", "解第一个方程"],
          [`With $y = s_1 = 0$, $${term(a, "x")} = ${b}$, so $x = ${x}$.`, `令 $y = s_1 = 0$，$${term(a, "x")} = ${b}$，所以 $x = ${x}$。`],
        ],
        [
          ["Substitute into the second", "代入第二个方程"],
          [
            `$s_2 = ${d} - ${c}(${x}) = ${answer}$. ${answer < 0 ? "This is negative, so the solution is not feasible." : "This is not negative, so the solution is feasible."}`,
            `$s_2 = ${d} - ${c}(${x}) = ${answer}$。${answer < 0 ? "它是负数，所以这个解不可行。" : "它不是负数，所以这个解可行。"}`,
          ],
        ],
      ],
      [
        `$${c}(${x}) + 0 + (${answer}) = ${d}$, as the second equation requires.`,
        `$${c}(${x}) + 0 + (${answer}) = ${d}$，满足第二个方程。`,
      ],
    );
  },
);

const optimalTableau: KnowledgePointDef = point(
  "whether-a-tableau-is-optimal",
  ["Whether a tableau is optimal", "单纯形表是否最优"],
  [
    "Write the objective row of a maximization as $z + \\sum c_j x_j = v$. A negative coefficient means that raising its variable raises $z$, so the tableau is not yet optimal. When all the coefficients are nonnegative, no single change helps, and the current value is the maximum.\n\nThe row $z - 3x_1 + 2s_1 = 40$ gives $z = 40 + 3x_1 - 2s_1$, so raising $x_1$ raises $z$, and $x_1$ should enter. The row $z + 3x_1 + 2s_1 = 40$ is optimal, with maximum 40.\n\nCheck: in the second row, $z = 40 - 3x_1 - 2s_1$, which is at most 40 for nonnegative variables.\n\n> **Watch out.** In this form a negative coefficient is the sign of improvement, because moving it across makes it positive.",
    "把最大化问题的目标行写成 $z + \\sum c_j x_j = v$。系数为负说明增大相应变量会增大 $z$，所以单纯形表还不是最优。当所有系数都非负时，任何单个变化都没有帮助，当前值就是最大值。\n\n目标行 $z - 3x_1 + 2s_1 = 40$ 给出 $z = 40 + 3x_1 - 2s_1$，所以增大 $x_1$ 会使 $z$ 增大，$x_1$ 应当进基。目标行 $z + 3x_1 + 2s_1 = 40$ 是最优的，最大值是 40。\n\n检验：第二行给出 $z = 40 - 3x_1 - 2s_1$，对非负变量至多是 40。\n\n> **注意。** 在这种写法中，负系数才表示可以改进，因为移到右边后它变成正的。",
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
    const correct = negative === 0 ? optimal : negative === 1 ? notOptimalA : notOptimalB;
    const solvedFor = `z = ${v} ${first < 0 ? "+" : "-"} ${term(Math.abs(first), "x_1")} ${second < 0 ? "+" : "-"} ${term(Math.abs(second), "s_1")}`;
    return chosen(
      rng,
      [
        `A maximization tableau has objective row $${row}$. What does it tell you?`,
        `一个最大化单纯形表的目标行是 $${row}$。它说明了什么？`,
      ],
      correct,
      (
        [
          [
            optimal,
            `The coefficient of $${entering}$ is negative, so raising it raises $z$ above ${v}.`,
            `$${entering}$ 的系数是负的，增大它会使 $z$ 超过 ${v}。`,
          ],
          [
            notOptimalA,
            negative === 0
              ? "The coefficient of $x_1$ is positive, so raising $x_1$ would lower $z$."
              : "The coefficient of $x_1$ is positive, so raising $x_1$ would lower $z$; the negative coefficient belongs to $s_1$.",
            negative === 0
              ? "$x_1$ 的系数是正的，增大 $x_1$ 会使 $z$ 减小。"
              : "$x_1$ 的系数是正的，增大 $x_1$ 会使 $z$ 减小；负系数属于 $s_1$。",
          ],
          [
            notOptimalB,
            negative === 0
              ? "The coefficient of $s_1$ is positive, so raising $s_1$ would lower $z$."
              : "The coefficient of $s_1$ is positive, so raising $s_1$ would lower $z$; the negative coefficient belongs to $x_1$.",
            negative === 0
              ? "$s_1$ 的系数是正的，增大 $s_1$ 会使 $z$ 减小。"
              : "$s_1$ 的系数是正的，增大 $s_1$ 会使 $z$ 减小；负系数属于 $x_1$。",
          ],
          [
            ["The program is unbounded", "这个规划无界"],
            "The objective row alone cannot show unboundedness; that needs an entering column with no positive entry.",
            "单看目标行无法说明无界；那需要进基列中没有正元素。",
          ],
        ] as const
      ).filter(([option]) => option[0] !== correct[0]),
      [
        [
          ["Solve for z", "解出目标值"],
          [`The row says $${solvedFor}$.`, `这一行就是 $${solvedFor}$。`],
        ],
        [
          ["Read the signs", "看符号"],
          negative === 0
            ? [
                "Both coefficients are positive, so raising either variable would lower $z$.",
                "两个系数都是正的，所以增大任一变量都会使 $z$ 减小。",
              ]
            : [
                `The coefficient of $${entering}$ is negative, so raising $${entering}$ raises $z$.`,
                `$${entering}$ 的系数是负的，所以增大 $${entering}$ 会使 $z$ 增大。`,
              ],
        ],
      ],
      negative === 0
        ? [
            `With $x_1 = s_1 = 0$, $z = ${v}$, and any other nonnegative values give less.`,
            `取 $x_1 = s_1 = 0$ 时 $z = ${v}$，其他非负取值都更小。`,
          ]
        : [
            `Raising $${entering}$ to 1 with the other at 0 gives $z = ${v} + ${negative === 1 ? a : b} = ${v + (negative === 1 ? a : b)}$, more than ${v}.`,
            `令 $${entering}$ 为 1、另一个为 0，得 $z = ${v} + ${negative === 1 ? a : b} = ${v + (negative === 1 ? a : b)}$，比 ${v} 大。`,
          ],
    );
  },
);

const phaseOneStart = point(
  "the-starting-value-of-phase-one",
  ["The starting value of phase one", "第一阶段的初始值"],
  [
    "Phase one minimizes the sum of the artificial variables. At the start, each artificial variable equals the right side of its row, because the other variables are 0. So the first value is the sum of those right sides, and it must fall to 0 for the program to be feasible.\n\nWith $x + y \\le 6$, $x + 2y \\ge 4$ and $3x + y = 9$, the first row has a slack variable and needs no artificial one, while the other two rows start with artificial variables 4 and 9. So phase one starts at $4 + 9 = 13$.\n\nCheck: at $x = y = 0$ the slack is 6, the surplus is 0, and the artificial variables carry the right sides 4 and 9.\n\n> **Watch out.** A $\\le$ row starts with its slack variable basic and needs no artificial variable, so its right side is not counted.",
    "第一阶段最小化人工变量之和。开始时每个人工变量都等于所在行的右端，因为其他变量都是 0。所以初始值是这些右端之和，它必须降到 0，规划才可行。\n\n对 $x + y \\le 6$，$x + 2y \\ge 4$ 和 $3x + y = 9$，第一行有松弛变量，不需要人工变量；另外两行的人工变量开始时是 4 和 9。所以第一阶段从 $4 + 9 = 13$ 开始。\n\n检验：$x = y = 0$ 时松弛变量是 6，剩余变量是 0，人工变量承担右端 4 和 9。\n\n> **注意。** $\\le$ 行开始时松弛变量是基变量，不需要人工变量，所以不计它的右端。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(2, 30), rng.int(2, 30), rng.int(2, 30)];
    const answer = b + c;
    return solved(
      [
        `A program has the constraints $x + y \\le ${a}$, $2x + y \\ge ${b}$ and $x + 3y = ${c}$. What is the phase one objective at the initial basis?`,
        `一个规划有约束 $x + y \\le ${a}$，$2x + y \\ge ${b}$ 和 $x + 3y = ${c}$。第一阶段目标在初始基处的值是多少？`,
      ],
      answer,
      [
        [
          a + b + c,
          `That counts the $\\le$ row, but its slack variable starts basic and it needs no artificial variable.`,
          `这把 $\\le$ 行也算了，但它的松弛变量开始时就是基变量，不需要人工变量。`,
        ],
        [b, `That forgets the artificial variable of the equation, which starts at ${c}.`, `这忘了等式的人工变量，它开始时是 ${c}。`],
        [
          c,
          `That forgets the artificial variable of the $\\ge$ row, which starts at ${b}.`,
          `这忘了 $\\ge$ 行的人工变量，它开始时是 ${b}。`,
        ],
        [
          a + c,
          "That gives the $\\le$ row an artificial variable instead of the $\\ge$ row.",
          "这给 $\\le$ 行而不是 $\\ge$ 行加了人工变量。",
        ],
      ],
      [
        [
          ["Find the artificial variables", "找出人工变量"],
          [
            "The $\\le$ row has a slack variable, while the $\\ge$ row and the equation need artificial variables.",
            "$\\le$ 行有松弛变量，而 $\\ge$ 行和等式需要人工变量。",
          ],
        ],
        [
          ["Add their starting values", "把初始值相加"],
          [
            `At $x = y = 0$ they equal ${b} and ${c}, so the sum is $${b} + ${c} = ${answer}$.`,
            `$x = y = 0$ 时它们等于 ${b} 和 ${c}，所以和是 $${b} + ${c} = ${answer}$。`,
          ],
        ],
      ],
      [
        `At $x = y = 0$ the rows read $s_1 = ${a}$, $-s_2 + a_2 = ${b}$ and $a_3 = ${c}$, with $s_2 = 0$, so $a_2 + a_3 = ${answer}$.`,
        `$x = y = 0$ 时各行为 $s_1 = ${a}$，$-s_2 + a_2 = ${b}$ 和 $a_3 = ${c}$，其中 $s_2 = 0$，所以 $a_2 + a_3 = ${answer}$。`,
      ],
    );
  },
);

const rateAlongRay = point(
  "the-rate-along-an-unbounded-ray",
  ["The rate along an unbounded ray", "无界射线上的增长率"],
  [
    "An unbounded program has a ray of feasible points $p + t d$ for $t \\ge 0$. Along it, the objective $c \\cdot x$ changes at the constant rate $c \\cdot d$ per unit of $t$. A positive rate in a maximization makes the value grow without limit, and proves that no optimum exists.\n\nAlong the direction $(2, 1)$, the objective $3x + 4y$ grows at the rate $3(2) + 4(1) = 10$ per unit of $t$.\n\nCheck: from $(0, 0)$ to $(2, 1)$, one unit of $t$, the objective goes from 0 to $6 + 4 = 10$.\n\n> **Watch out.** Pair each coefficient with the matching entry of the direction, $c_1$ with $d_1$ and $c_2$ with $d_2$, before adding.",
    "无界规划有一条可行射线 $p + t d$（$t \\ge 0$）。沿着它，目标 $c \\cdot x$ 以常数速率 $c \\cdot d$ 随 $t$ 变化。在最大化问题中，正的速率使值无限增长，这证明了不存在最优解。\n\n沿方向 $(2, 1)$，目标 $3x + 4y$ 以每单位 $t$ 增长 $3(2) + 4(1) = 10$ 的速率变化。\n\n检验：从 $(0, 0)$ 到 $(2, 1)$，即一个单位的 $t$，目标从 0 变为 $6 + 4 = 10$。\n\n> **注意。** 相加之前要把每个系数与方向中对应的分量配对，$c_1$ 配 $d_1$，$c_2$ 配 $d_2$。",
  ],
  (rng) => {
    const [c1, c2, d1, d2] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 5), rng.int(1, 5)];
    const answer = c1 * d1 + c2 * d2;
    return solved(
      [
        `Along the feasible ray with direction $(${d1}, ${d2})$, how fast does the objective $${term(c1, "x")} + ${term(c2, "y")}$ grow per unit of $t$?`,
        `沿方向为 $(${d1}, ${d2})$ 的可行射线，目标 $${term(c1, "x")} + ${term(c2, "y")}$ 随 $t$ 每单位增长多少？`,
      ],
      answer,
      [
        [c1 + c2, "That adds the coefficients without using the direction.", "这把系数直接相加，没有用到方向。"],
        [d1 + d2, "That adds the entries of the direction without using the coefficients.", "这把方向的分量直接相加，没有用到系数。"],
        [c1 * d2 + c2 * d1, "That pairs each coefficient with the wrong entry of the direction.", "这把每个系数配错了方向中的分量。"],
        [answer + 1, "The rate is exactly the dot product, with nothing added.", "速率正好是点积，不需要再加什么。"],
      ],
      [
        [
          ["Pair the entries", "配对分量"],
          [
            `The coefficients $(${c1}, ${c2})$ meet the direction $(${d1}, ${d2})$.`,
            `系数 $(${c1}, ${c2})$ 与方向 $(${d1}, ${d2})$ 配对。`,
          ],
        ],
        [
          ["Take the dot product", "求点积"],
          [`$${c1}(${d1}) + ${c2}(${d2}) = ${answer}$.`, `$${c1}(${d1}) + ${c2}(${d2}) = ${answer}$。`],
        ],
      ],
      [
        `Moving from $(0, 0)$ to $(${d1}, ${d2})$, one unit of $t$, raises the objective from 0 to $${c1 * d1} + ${c2 * d2} = ${answer}$.`,
        `从 $(0, 0)$ 移到 $(${d1}, ${d2})$，即一个单位的 $t$，目标从 0 增加到 $${c1 * d1} + ${c2 * d2} = ${answer}$。`,
      ],
    );
  },
);

const dualSize = point(
  "the-size-of-the-dual",
  ["The size of the dual", "对偶规划的规模"],
  [
    "Each constraint of the primal gives one variable of the dual, and each variable of the primal gives one constraint of the dual. So the dual of a program with $m$ constraints and $n$ variables has $n$ constraints and $m$ variables. This makes the dual attractive when a program has many more rows than columns.\n\nA primal with 5 constraints and 3 variables has a dual with 5 variables, one price per constraint, and 3 constraints, one per primal variable.\n\nCheck: the matrix of the primal is 5 by 3, and the dual uses its transpose, which is 3 by 5.\n\n> **Watch out.** The counts swap: the dual has as many variables as the primal has constraints, not as many as the primal has variables.",
    "原规划的每个约束给出对偶规划的一个变量，每个变量给出对偶规划的一个约束。所以有 $m$ 个约束和 $n$ 个变量的规划，其对偶有 $n$ 个约束和 $m$ 个变量。当规划的行数远多于列数时，对偶就很有吸引力。\n\n有 5 个约束和 3 个变量的原规划，其对偶有 5 个变量（每个约束一个价格）和 3 个约束（每个原变量一个）。\n\n检验：原规划的矩阵是 5 行 3 列，对偶用它的转置，是 3 行 5 列。\n\n> **注意。** 个数要互换：对偶变量的个数等于原约束的个数，而不是原变量的个数。",
  ],
  (rng) => {
    const [m, n] = [rng.int(2, 15), rng.int(2, 15)];
    const askVariables = rng.bool();
    const answer = askVariables ? m : n;
    return solved(
      [
        `A primal program has ${m} constraints and ${n} variables. How many ${askVariables ? "variables" : "constraints"} does its dual have, not counting signs?`,
        `原规划有 ${m} 个约束和 ${n} 个变量。不计符号约束，它的对偶有多少个${askVariables ? "变量" : "约束"}？`,
      ],
      answer,
      [
        [askVariables ? n : m, "That keeps the counts as they are; the dual swaps them.", "这保留了原来的个数；对偶会把它们互换。"],
        [
          m + n,
          "That adds the two counts, but each dual count comes from just one of them.",
          "这把两个个数相加了，但对偶的每个个数只来自其中一个。",
        ],
        [m * n, "That counts the entries of the matrix, not its rows or columns.", "这数的是矩阵的元素个数，而不是行数或列数。"],
        [answer + 1, "Signs are not counted, so nothing is added.", "不计符号约束，所以不必再加。"],
      ],
      [
        [
          ["Match rows and columns", "对应行与列"],
          askVariables
            ? ["Each primal constraint gives one dual variable.", "原规划的每个约束给出一个对偶变量。"]
            : ["Each primal variable gives one dual constraint.", "原规划的每个变量给出一个对偶约束。"],
        ],
        [
          ["Count", "计数"],
          askVariables
            ? [`So the dual has ${m} variables.`, `所以对偶有 ${m} 个变量。`]
            : [`So the dual has ${n} constraints.`, `所以对偶有 ${n} 个约束。`],
        ],
      ],
      [
        `The primal matrix is ${m} by ${n}, and the dual uses its transpose, ${n} by ${m}: ${n} constraints and ${m} variables.`,
        `原规划的矩阵是 ${m} 行 ${n} 列，对偶用它的转置，${n} 行 ${m} 列：${n} 个约束，${m} 个变量。`,
      ],
    );
  },
);

const primalFromDual = point(
  "recovering-the-primal-from-the-dual",
  ["Recovering the primal from the dual", "由对偶解恢复原解"],
  [
    "Complementary slackness says that a positive dual variable forces its primal constraint to hold with equality. If both dual variables are positive in a program with two constraints and two variables, both constraints are tight. Then the primal solution comes from solving two linear equations.\n\nWith constraints $x + 2y \\le 8$ and $3x + y \\le 9$ and both dual variables positive, the equations $x + 2y = 8$ and $3x + y = 9$ give $x = 2$ and $y = 3$.\n\nCheck: $2 + 2(3) = 8$ and $3(2) + 3 = 9$, so both constraints are tight.\n\n> **Watch out.** A positive dual variable makes its primal constraint tight; it says nothing directly about the size of the primal variables.",
    "互补松弛性说明：正的对偶变量迫使相应的原约束取等号。如果两个约束两个变量的规划中两个对偶变量都是正的，两个约束就都是紧的。这时原问题的解就由解两个线性方程得到。\n\n约束是 $x + 2y \\le 8$ 和 $3x + y \\le 9$，两个对偶变量都是正的，所以 $x + 2y = 8$ 和 $3x + y = 9$，解得 $x = 2$，$y = 3$。\n\n检验：$2 + 2(3) = 8$，$3(2) + 3 = 9$，两个约束都是紧的。\n\n> **注意。** 正的对偶变量使相应的原约束取等号；它并不直接说明原变量的大小。",
  ],
  (rng) => {
    const [x, y] = [rng.int(1, 9), rng.int(1, 9)];
    const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
    let [c, d] = [rng.int(1, 4), rng.int(1, 4)];
    while (a * d === b * c) [c, d] = [rng.int(1, 4), rng.int(1, 4)];
    const [e, f] = [a * x + b * y, c * x + d * y];
    const askX = rng.bool();
    const answer = askX ? x : y;
    const det = a * d - b * c;
    const lead = det === 1 ? "" : det === -1 ? "-" : `${det}`;
    return solved(
      [
        `The optimal dual solution of a program with constraints $${term(a, "x")} + ${term(b, "y")} \\le ${e}$ and $${term(c, "x")} + ${term(d, "y")} \\le ${f}$ has both variables positive. What is the optimal $${askX ? "x" : "y"}$?`,
        `规划的约束是 $${term(a, "x")} + ${term(b, "y")} \\le ${e}$ 和 $${term(c, "x")} + ${term(d, "y")} \\le ${f}$，最优对偶解的两个变量都是正的。最优的 $${askX ? "x" : "y"}$ 是多少？`,
      ],
      answer,
      [
        [askX ? y : x, `That is the value of $${askX ? "y" : "x"}$, the other variable.`, `这是另一个变量 $${askX ? "y" : "x"}$ 的值。`],
        [e, "That is the right side of the first constraint, not a value of the solution.", "这是第一个约束的右端，不是解的值。"],
        [f, "That is the right side of the second constraint, not a value of the solution.", "这是第二个约束的右端，不是解的值。"],
        [answer + 1, "That does not satisfy both equations at once.", "这不能同时满足两个方程。"],
      ],
      [
        [
          ["Make both constraints tight", "两个约束都取等号"],
          [
            `Both dual variables are positive, so $${term(a, "x")} + ${term(b, "y")} = ${e}$ and $${term(c, "x")} + ${term(d, "y")} = ${f}$.`,
            `两个对偶变量都是正的，所以 $${term(a, "x")} + ${term(b, "y")} = ${e}$，$${term(c, "x")} + ${term(d, "y")} = ${f}$。`,
          ],
        ],
        [
          ["Solve the equations", "解方程组"],
          askX
            ? [
                `Eliminating $y$ gives $${lead}x = ${d}(${e}) - ${b}(${f}) = ${det * x}$, so $x = ${x}$.`,
                `消去 $y$ 得 $${lead}x = ${d}(${e}) - ${b}(${f}) = ${det * x}$，所以 $x = ${x}$。`,
              ]
            : [
                `Eliminating $x$ gives $${lead}y = ${a}(${f}) - ${c}(${e}) = ${det * y}$, so $y = ${y}$.`,
                `消去 $x$ 得 $${lead}y = ${a}(${f}) - ${c}(${e}) = ${det * y}$，所以 $y = ${y}$。`,
              ],
        ],
      ],
      [
        `With $x = ${x}$ and $y = ${y}$, $${a}(${x}) + ${b}(${y}) = ${e}$ and $${c}(${x}) + ${d}(${y}) = ${f}$.`,
        `取 $x = ${x}$，$y = ${y}$，$${a}(${x}) + ${b}(${y}) = ${e}$，$${c}(${x}) + ${d}(${y}) = ${f}$。`,
      ],
    );
  },
);

const twoShadowPrices = point(
  "combining-two-shadow-prices",
  ["Combining two shadow prices", "合并两个影子价格"],
  [
    "Within the range where the basis stays optimal, the optimal value changes linearly with the right sides. A change $\\Delta b$ alters the value by $y \\cdot \\Delta b$, where $y$ is the vector of shadow prices. So several small changes can be priced one at a time and added.\n\nWith shadow prices 4 and 3, a rise of 2 in the first resource and a fall of 1 in the second change the value by $4(2) + 3(-1) = 5$. An optimal value of 100 becomes 105.\n\nCheck: the first change alone adds 8 and the second alone takes away 3, and $100 + 8 - 3 = 105$.\n\n> **Watch out.** A fall in a resource enters with a minus sign, so its shadow price lowers the value.",
    "在基保持最优的范围内，最优值随右端线性变化。变化 $\\Delta b$ 使值改变 $y \\cdot \\Delta b$，其中 $y$ 是影子价格向量。所以几个小变化可以逐个定价再相加。\n\n影子价格是 4 和 3，第一种资源增加 2，第二种减少 1，值的变化是 $4(2) + 3(-1) = 5$。最优值 100 变为 105。\n\n检验：第一个变化单独增加 8，第二个单独减少 3，$100 + 8 - 3 = 105$。\n\n> **注意。** 资源减少时要带负号，所以它的影子价格使值降低。",
  ],
  (rng) => {
    const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
    const [d1, d2] = [rng.int(1, 6), rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4])];
    const v = rng.int(50, 200);
    const answer = v + y1 * d1 + y2 * d2;
    return solved(
      [
        `The optimal value is ${v}, and the shadow prices are ${y1} and ${y2}. Within the valid range, the first resource rises by ${d1} and the second ${d2 < 0 ? `falls by ${-d2}` : `rises by ${d2}`}. What is the new optimal value?`,
        `最优值是 ${v}，影子价格是 ${y1} 和 ${y2}。在有效范围内，第一种资源增加 ${d1}，第二种${d2 < 0 ? `减少 ${-d2}` : `增加 ${d2}`}。新的最优值是多少？`,
      ],
      answer,
      [
        [v + y1 * d1, "That prices only the first change and forgets the second.", "这只给第一个变化定了价，忘了第二个。"],
        [v + y2 * d2, "That prices only the second change and forgets the first.", "这只给第二个变化定了价，忘了第一个。"],
        [
          v + y1 * d1 + y2 * Math.abs(d2) + 1,
          "That treats both changes as rises and adds one more; only the shadow prices times the changes count.",
          "这把两个变化都当成增加，还多加了一；只算影子价格乘变化量。",
        ],
        [
          v + y1 * d2 + y2 * d1,
          "That pairs each shadow price with the other resource's change.",
          "这把每个影子价格配上了另一种资源的变化。",
        ],
      ],
      [
        [
          ["Price each change", "给每个变化定价"],
          [
            `The changes are worth $${y1}(${d1}) = ${y1 * d1}$ and $${y2}(${d2}) = ${y2 * d2}$.`,
            `两个变化的价值是 $${y1}(${d1}) = ${y1 * d1}$ 和 $${y2}(${d2}) = ${y2 * d2}$。`,
          ],
        ],
        [
          ["Add to the value", "加到最优值上"],
          [
            `The new value is $${v} + ${y1 * d1} ${plus(y2 * d2)} = ${answer}$.`,
            `新值是 $${v} + ${y1 * d1} ${plus(y2 * d2)} = ${answer}$。`,
          ],
        ],
      ],
      [
        `The total change $${answer} - ${v} = ${answer - v}$ equals $${y1 * d1} ${plus(y2 * d2)}$, the two prices added.`,
        `总变化 $${answer} - ${v} = ${answer - v}$ 等于 $${y1 * d1} ${plus(y2 * d2)}$，即两个价格之和。`,
      ],
    );
  },
);

const columnInBasis = point(
  "a-column-in-the-current-basis",
  ["A column in the current basis", "当前基下的列"],
  [
    "The revised simplex method does not store the whole tableau. When a column is needed, it computes $B^{-1} A_j$ from the original column $A_j$. The result gives the rates at which the basic variables change as the entering variable grows, and so supplies the numbers for the ratio test.\n\nWith $B^{-1} = \\begin{pmatrix} 2 & -1 \\\\ 0 & 1 \\end{pmatrix}$ and $A_j = (3, 4)$, the first entry is $2(3) - 1(4) = 2$ and the second is $0(3) + 1(4) = 4$.\n\nCheck: $B^{-1} A_j = (2, 4)$, a row of $B^{-1}$ against the column each time.\n\n> **Watch out.** Each entry uses a row of $B^{-1}$, and a negative entry of that row subtracts.",
    "修正单纯形法不保存整个单纯形表。需要某一列时，它由原始列 $A_j$ 计算 $B^{-1} A_j$。结果给出进基变量增大时各基变量的变化率，从而提供比值检验所需的数。\n\n取 $B^{-1} = \\begin{pmatrix} 2 & -1 \\\\ 0 & 1 \\end{pmatrix}$，$A_j = (3, 4)$，第一个分量是 $2(3) - 1(4) = 2$，第二个是 $0(3) + 1(4) = 4$。\n\n检验：$B^{-1} A_j = (2, 4)$，每次都是 $B^{-1}$ 的一行与这一列相乘。\n\n> **注意。** 每个分量用的是 $B^{-1}$ 的一行，行中的负数要减去。",
  ],
  (rng) => {
    const [a, b, c, d] = [rng.int(1, 5), rng.pick([-3, -2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2]), rng.int(1, 5)];
    const [p, q] = [rng.int(1, 6), rng.int(1, 6)];
    const row = rng.bool();
    const answer = row ? a * p + b * q : c * p + d * q;
    const signedTimes = (k: number, v: number) => `${k < 0 ? "-" : "+"} ${Math.abs(k)}(${v})`;
    const [r1, r2] = row ? [a, b] : [c, d];
    const shown = `${r1}(${p}) ${signedTimes(r2, q)}`;
    return solved(
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
      [
        [row ? c * p + d * q : a * p + b * q, "That is the other entry of $B^{-1} A_j$.", "这是 $B^{-1} A_j$ 的另一个分量。"],
        [a * p + c * q, "That uses the first column of $B^{-1}$ instead of a row.", "这用的是 $B^{-1}$ 的第一列，而不是一行。"],
        [b * p + d * q, "That uses the second column of $B^{-1}$ instead of a row.", "这用的是 $B^{-1}$ 的第二列，而不是一行。"],
        [answer + 1, "The entry is exactly the row times the column, with nothing added.", "这个分量正好是行乘列，不需要再加什么。"],
      ],
      [
        [
          ["Take the row", "取出这一行"],
          [
            `The ${row ? "first" : "second"} row of $B^{-1}$ is $(${r1}, ${r2})$.`,
            `$B^{-1}$ 的第${row ? "一" : "二"}行是 $(${r1}, ${r2})$。`,
          ],
        ],
        [
          ["Multiply by the column", "乘以这一列"],
          [`$${shown} = ${answer}$.`, `$${shown} = ${answer}$。`],
        ],
      ],
      [
        `The products are ${r1 * p} and ${r2 * q}, and $${r1 * p} ${plus(r2 * q)} = ${answer}$.`,
        `两个乘积是 ${r1 * p} 和 ${r2 * q}，$${r1 * p} ${plus(r2 * q)} = ${answer}$。`,
      ],
    );
  },
);

const shippingCost = point(
  "the-cost-of-a-shipping-plan",
  ["The cost of a shipping plan", "运输方案的成本"],
  [
    "A transportation plan assigns an amount to each route, and the total cost adds each amount times the unit cost of that route. Comparing a plan with an alternative by this total is the basis of every improvement step. Empty routes contribute nothing, however expensive they would be.\n\nWith unit costs $\\begin{pmatrix} 2 & 5 \\\\ 4 & 1 \\end{pmatrix}$ and shipments $\\begin{pmatrix} 10 & 0 \\\\ 3 & 7 \\end{pmatrix}$, the cost is $2(10) + 4(3) + 1(7) = 39$; the empty route costing 5 adds nothing.\n\nCheck: $20 + 12 + 7 = 39$.\n\n> **Watch out.** Multiply entries in the same position, cost by shipment on the same route, and do not charge empty routes.",
    "运输方案给每条路线分配一个运量，总成本是各运量乘以该路线单位成本之和。用这个总成本比较方案是每一步改进的基础。空路线没有贡献，不管它多贵。\n\n单位成本是 $\\begin{pmatrix} 2 & 5 \\\\ 4 & 1 \\end{pmatrix}$，运量是 $\\begin{pmatrix} 10 & 0 \\\\ 3 & 7 \\end{pmatrix}$，成本是 $2(10) + 4(3) + 1(7) = 39$；单位成本为 5 的空路线不增加成本。\n\n检验：$20 + 12 + 7 = 39$。\n\n> **注意。** 位置相同的元素相乘，即同一条路线的成本乘运量，空路线不计费用。",
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
    const used = [costs[0][0] * plan[0][0], costs[0][1] * plan[0][1], costs[1][0] * plan[1][0], costs[1][1] * plan[1][1]];
    const products = [
      [costs[0][0], plan[0][0]],
      [costs[0][1], plan[0][1]],
      [costs[1][0], plan[1][0]],
      [costs[1][1], plan[1][1]],
    ]
      .filter(([, s]) => s !== 0)
      .map(([k, s]) => `${k}(${s})`)
      .join(" + ");
    return solved(
      [
        `The unit costs are $${matrix(costs)}$ and the plan ships $${matrix(plan)}$, route by route. What is the total cost?`,
        `单位成本是 $${matrix(costs)}$，方案按路线运送 $${matrix(plan)}$。总成本是多少？`,
      ],
      answer,
      [
        [
          (costs[0][0] + costs[0][1] + costs[1][0] + costs[1][1]) * 2,
          "That works with the costs alone and ignores the shipments.",
          "这只用了成本，没有考虑运量。",
        ],
        [
          costs[0][0] * plan[1][1] + costs[1][1] * plan[0][0] + costs[0][1] * plan[1][0] + costs[1][0] * plan[0][1],
          "That multiplies each cost by the shipment on a different route.",
          "这把每个成本乘上了另一条路线的运量。",
        ],
        [plan[0][0] + plan[0][1] + plan[1][0] + plan[1][1], "That is the total amount shipped, not its cost.", "这是总运量，不是成本。"],
        [answer + 1, "The cost is exactly the sum of the products, with nothing added.", "成本正好是各乘积之和，不需要再加什么。"],
      ],
      [
        [
          ["Multiply route by route", "逐条路线相乘"],
          [`The routes in use cost $${products}$.`, `使用的路线成本是 $${products}$。`],
        ],
        [
          ["Add the products", "把乘积相加"],
          [`The total is ${answer}, and the empty route adds nothing.`, `总成本是 ${answer}，空路线不增加成本。`],
        ],
      ],
      [`$${used.filter((u) => u !== 0).join(" + ")} = ${answer}$.`, `$${used.filter((u) => u !== 0).join(" + ")} = ${answer}$。`],
    );
  },
);

const loopStep = point(
  "the-saving-from-a-loop",
  ["The saving from a loop", "沿回路的节省"],
  [
    "To bring an empty cell into a plan, ship $\\theta$ around a closed loop, adding and subtracting in turn. The largest possible $\\theta$ is the smallest amount on a cell that loses shipments. The total cost then falls by $\\theta$ times the amount saved per unit around that loop.\n\nIf the losing cells hold 8 and 5 and each unit saves 3, then $\\theta = 5$, and a plan costing 400 falls to $400 - 5(3) = 385$.\n\nCheck: after the step the losing cells hold $8 - 5 = 3$ and $5 - 5 = 0$, so nothing goes negative.\n\n> **Watch out.** $\\theta$ is the smaller of the losing amounts; the larger would drive the other cell below zero.",
    "要让空格进入方案，就沿闭合回路运送 $\\theta$，交替增减。$\\theta$ 最大是减少运量的格子中的最小运量。总成本于是减少 $\\theta$ 乘以回路上每单位的节省。\n\n如果减少运量的格子分别有 8 和 5，每单位节省 3，那么 $\\theta = 5$，成本为 400 的方案降到 $400 - 5(3) = 385$。\n\n检验：调整后减少运量的格子是 $8 - 5 = 3$ 和 $5 - 5 = 0$，没有变成负数。\n\n> **注意。** $\\theta$ 取减少运量的格子中较小的那个；取较大的会使另一个格子变成负数。",
  ],
  (rng) => {
    const [x, y] = [rng.int(3, 30), rng.int(3, 30)];
    const saving = rng.int(1, 9);
    const cost = rng.int(300, 900);
    const theta = Math.min(x, y);
    const answer = cost - theta * saving;
    return solved(
      [
        `A plan costs ${cost}. An empty cell saves ${saving} per unit around a loop whose losing cells hold ${x} and ${y}. What is the cost after shipping as much as possible around the loop?`,
        `一个方案的成本是 ${cost}。某空格沿回路每单位节省 ${saving}，回路上减少运量的格子分别有 ${x} 和 ${y}。沿回路尽量多运之后，成本是多少？`,
      ],
      answer,
      [
        [
          cost - Math.max(x, y) * saving,
          "That ships the larger amount, which would drive the other losing cell below zero.",
          "这运了较大的量，会使另一个减少运量的格子变成负数。",
        ],
        [cost - saving, "That ships only one unit, not as much as possible.", "这只运了一个单位，而不是尽量多运。"],
        [
          cost - (x + y) * saving,
          "That ships the two amounts added, but each losing cell can give only what it holds.",
          "这运了两个量之和，但每个减少运量的格子只能让出它自己的运量。",
        ],
        [cost + theta * saving, "That adds the saving instead of subtracting it.", "这把节省加上了，而不是减去。"],
      ],
      [
        [
          ["Find the step", "求步长"],
          [
            `$\\theta$ is the smaller losing amount, $\\min(${x}, ${y}) = ${theta}$.`,
            `$\\theta$ 取减少运量中较小的，$\\min(${x}, ${y}) = ${theta}$。`,
          ],
        ],
        [
          ["Lower the cost", "降低成本"],
          [`The cost becomes $${cost} - ${theta}(${saving}) = ${answer}$.`, `成本变为 $${cost} - ${theta}(${saving}) = ${answer}$。`],
        ],
      ],
      [
        `The losing cells end at $${x} - ${theta} = ${x - theta}$ and $${y} - ${theta} = ${y - theta}$, neither negative.`,
        `减少运量的格子最后是 $${x} - ${theta} = ${x - theta}$ 和 $${y} - ${theta} = ${y - theta}$，都不是负数。`,
      ],
    );
  },
);

const reductionBound = point(
  "a-lower-bound-from-reductions",
  ["A lower bound from reductions", "由化简得到的下界"],
  [
    "Every assignment uses one entry from each row. So subtracting a row's minimum lowers every assignment's cost by that amount, and the same goes for columns. The total subtracted is therefore a lower bound on the optimal cost, and it is the optimal cost when zeros allow a full assignment.\n\nFor $\\begin{pmatrix} 4 & 2 \\\\ 3 & 6 \\end{pmatrix}$ the row minima are 2 and 3, leaving $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$, whose column minima are 0 and 0. The bound is $2 + 3 = 5$.\n\nCheck: the assignment along the zeros costs $2 + 3 = 5$, and the other costs $4 + 6 = 10$, so 5 is the optimum.\n\n> **Watch out.** Reduce the columns of the matrix left after the row reduction, not of the original matrix.",
    "每个分配都从每行取一个元素。所以从一行减去它的最小值，会使每个分配的成本减少同样的量，列也一样。因此减去的总量是最优成本的下界；当零元素能构成完整分配时，它就是最优成本。\n\n对 $\\begin{pmatrix} 4 & 2 \\\\ 3 & 6 \\end{pmatrix}$，各行最小值是 2 和 3，剩下 $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$，其各列最小值是 0 和 0。下界是 $2 + 3 = 5$。\n\n检验：沿零元素的分配成本是 $2 + 3 = 5$，另一个分配成本是 $4 + 6 = 10$，所以 5 就是最优值。\n\n> **注意。** 按列化简的是按行化简之后剩下的矩阵，而不是原矩阵。",
  ],
  (rng) => {
    const rows = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(1, 12)));
    const rowMins = rows.map((r) => Math.min(...r));
    const reduced = rows.map((r, i) => r.map((v) => v - (rowMins[i] as number)));
    const colMins = [0, 1, 2].map((j) => Math.min(...reduced.map((r) => r[j] as number)));
    const rowSum = rowMins.reduce((x, y) => x + y, 0);
    const colSum = colMins.reduce((x, y) => x + y, 0);
    const answer = rowSum + colSum;
    return solved(
      [
        `Reduce the cost matrix $${matrix(rows)}$ by rows and then by columns. What total was subtracted, the lower bound on the optimal cost?`,
        `先按行再按列化简成本矩阵 $${matrix(rows)}$。减去的总量（最优成本的下界）是多少？`,
      ],
      answer,
      [
        rowSum === answer
          ? [
              answer + 1,
              "The column reduction subtracts nothing here, so the total is the row minima alone.",
              "这里按列化简没有减去任何量，所以总量就是各行最小值之和。",
            ]
          : [
              rowSum,
              `That stops after the rows; the columns still subtract ${colSum}.`,
              `这在按行化简后就停了；按列化简还要减去 ${colSum}。`,
            ],
        [answer + 2, "The bound is exactly what was subtracted, with nothing added.", "下界正好是减去的量，不需要再加什么。"],
        [
          rows.flat().reduce((x, y) => x + y, 0),
          "That adds every entry, but an assignment uses only one entry from each row.",
          "这把每个元素都加上了，但一个分配每行只用一个元素。",
        ],
        Math.min(...rows.flat()) * 3 === answer
          ? [answer + 3, "The bound is exactly what was subtracted, with nothing added.", "下界正好是减去的量，不需要再加什么。"]
          : [
              Math.min(...rows.flat()) * 3,
              "That subtracts the smallest entry of the whole matrix from every row, not each row's own minimum.",
              "这从每行都减去整个矩阵的最小元素，而不是各行自己的最小值。",
            ],
      ],
      [
        [
          ["Reduce the rows", "按行化简"],
          [`The row minima are ${rowMins.join(", ")}, which add up to ${rowSum}.`, `各行最小值是 ${rowMins.join("、")}，和为 ${rowSum}。`],
        ],
        [
          ["Reduce the columns", "按列化简"],
          [
            `The reduced matrix $${matrix(reduced)}$ has column minima ${colMins.join(", ")}, which add up to ${colSum}.`,
            `化简后的矩阵 $${matrix(reduced)}$ 各列最小值是 ${colMins.join("、")}，和为 ${colSum}。`,
          ],
        ],
      ],
      [
        `The total subtracted is $${rowSum} + ${colSum} = ${answer}$, and every assignment costs at least that much.`,
        `减去的总量是 $${rowSum} + ${colSum} = ${answer}$，每个分配的成本都至少是这么多。`,
      ],
    );
  },
);

const residualCapacity = point(
  "residual-capacities",
  ["Residual capacities", "残量容量"],
  [
    "An edge with capacity $c$ carrying flow $f$ can take $c - f$ more in its own direction. It can also give back up to $f$ in the opposite direction, by cancelling flow. The residual network records both, and any path through it from source to sink can increase the flow.\n\nAn edge from $u$ to $v$ with capacity 10 and flow 7 has residual capacity $10 - 7 = 3$ from $u$ to $v$, and 7 from $v$ to $u$.\n\nCheck: the two residual capacities add up to $3 + 7 = 10$, the capacity.\n\n> **Watch out.** Against the edge, the residual capacity is the flow that can be cancelled, not the room left.",
    "容量为 $c$、流量为 $f$ 的边在正方向还能增加 $c - f$。它在反方向也能退回至多 $f$，即取消已有流量。残量网络记录这两者，其中从源到汇的任何路径都能增大流量。\n\n从 $u$ 到 $v$、容量 10、流量 7 的边，从 $u$ 到 $v$ 的残量容量是 $10 - 7 = 3$，从 $v$ 到 $u$ 的是 7。\n\n检验：两个残量容量之和是 $3 + 7 = 10$，正是容量。\n\n> **注意。** 逆着边的方向，残量容量是可以取消的流量，而不是剩余空间。",
  ],
  (rng) => {
    const c = rng.int(5, 30);
    const f = rng.int(1, c - 1);
    const forward = rng.bool();
    const answer = forward ? c - f : f;
    return solved(
      [
        `The edge from $u$ to $v$ has capacity ${c} and carries a flow of ${f}. What is the residual capacity from $${forward ? "u" : "v"}$ to $${forward ? "v" : "u"}$?`,
        `从 $u$ 到 $v$ 的边容量是 ${c}，流量是 ${f}。从 $${forward ? "u" : "v"}$ 到 $${forward ? "v" : "u"}$ 的残量容量是多少？`,
      ],
      answer,
      [
        forward
          ? [
              f,
              "That is the residual capacity against the edge, the flow that can be cancelled.",
              "这是逆着边方向的残量容量，即可以取消的流量。",
            ]
          : [
              c - f,
              "That is the room left along the edge, not the flow that can be sent back.",
              "这是沿边方向的剩余空间，不是可以退回的流量。",
            ],
        [c, "That is the capacity, which ignores the flow already on the edge.", "这是容量，没有考虑边上已有的流量。"],
        [
          c + f,
          "That adds the flow to the capacity, but no direction can take more than the capacity.",
          "这把流量加到容量上了，但任何方向都不能超过容量。",
        ],
        [0, `The edge is neither full nor empty, so there is room both ways.`, `这条边既不满也不空，两个方向都有余量。`],
      ],
      [
        [
          ["Pick the direction", "确定方向"],
          forward
            ? ["From $u$ to $v$ runs along the edge, so more flow can be added.", "从 $u$ 到 $v$ 是沿边方向，所以可以增加流量。"]
            : ["From $v$ to $u$ runs against the edge, so flow can only be cancelled.", "从 $v$ 到 $u$ 是逆着边的方向，所以只能取消流量。"],
        ],
        [
          ["Measure the room", "求余量"],
          forward
            ? [`The room left is $${c} - ${f} = ${answer}$.`, `剩余空间是 $${c} - ${f} = ${answer}$。`]
            : [
                `The existing flow of ${f} can be cancelled, so the residual capacity is ${f}.`,
                `已有的流量 ${f} 可以取消，所以残量容量是 ${f}。`,
              ],
        ],
      ],
      [
        `The two residual capacities, ${c - f} along the edge and ${f} against it, add up to $${c - f} + ${f} = ${c}$, the capacity.`,
        `两个残量容量，沿边 ${c - f}，逆边 ${f}，之和是 $${c - f} + ${f} = ${c}$，正是容量。`,
      ],
    );
  },
);

const relaxing = point(
  "relaxing-an-edge",
  ["Relaxing an edge", "松弛一条边"],
  [
    "Shortest path methods keep a tentative distance for each node. Relaxing the edge from $u$ to $v$ replaces $d(v)$ by $\\min(d(v), d(u) + w)$, since this edge offers a route of that length. At the optimum, no edge can improve any distance, which is exactly feasibility of the dual potentials.\n\nWith $d(u) = 5$, $d(v) = 12$ and an edge of length 4, the edge offers $5 + 4 = 9$, so $d(v)$ drops to 9. With an edge of length 8 it offers 13, and $d(v)$ stays 12.\n\nCheck: after relaxing, $d(v) \\le d(u) + w$ holds in both cases: $9 \\le 9$ and $12 \\le 13$.\n\n> **Watch out.** Relaxing never raises a distance; keep the current value when the edge offers a longer route.",
    "最短路方法为每个结点保留一个暂定距离。松弛从 $u$ 到 $v$ 的边，就是把 $d(v)$ 换成 $\\min(d(v), d(u) + w)$，因为这条边提供了这样长的路线。最优时任何边都不能再改进距离，这正是对偶势的可行性。\n\n取 $d(u) = 5$，$d(v) = 12$，边长 4，这条边提供 $5 + 4 = 9$，所以 $d(v)$ 降到 9。边长为 8 时它提供 13，$d(v)$ 仍是 12。\n\n检验：松弛后两种情况都满足 $d(v) \\le d(u) + w$：$9 \\le 9$，$12 \\le 13$。\n\n> **注意。** 松弛从不增大距离；边提供的路线更长时，保留当前值。",
  ],
  (rng) => {
    const [du, w, dv] = [rng.int(2, 30), rng.int(1, 20), rng.int(5, 45)];
    const answer = Math.min(dv, du + w);
    return solved(
      [
        `Tentative distances are $d(u) = ${du}$ and $d(v) = ${dv}$. The edge from $u$ to $v$ has length ${w}. What is $d(v)$ after relaxing it?`,
        `暂定距离是 $d(u) = ${du}$，$d(v) = ${dv}$。从 $u$ 到 $v$ 的边长是 ${w}。松弛后 $d(v)$ 是多少？`,
      ],
      answer,
      [
        [Math.max(dv, du + w), "That keeps the longer route; relaxing keeps the shorter.", "这保留了较长的路线；松弛保留较短的。"],
        [du, "That is the distance of $u$, without the edge to $v$.", "这是 $u$ 的距离，没有加上到 $v$ 的边。"],
        [
          dv + w,
          "That adds the edge to the distance of $v$, but the edge starts at $u$.",
          "这把边长加到了 $v$ 的距离上，但边是从 $u$ 出发的。",
        ],
        [du + w + 1, "The route through $u$ has length exactly $d(u) + w$.", "经过 $u$ 的路线长度正好是 $d(u) + w$。"],
      ],
      [
        [
          ["Find the offer", "求这条边提供的路线"],
          [`The edge offers a route of length $${du} + ${w} = ${du + w}$.`, `这条边提供的路线长 $${du} + ${w} = ${du + w}$。`],
        ],
        [
          ["Keep the smaller", "保留较小的"],
          [`$\\min(${dv}, ${du + w}) = ${answer}$.`, `$\\min(${dv}, ${du + w}) = ${answer}$。`],
        ],
      ],
      [
        `Now $d(v) = ${answer}$ satisfies $d(v) \\le d(u) + w = ${du + w}$, and it is no larger than the old ${dv}.`,
        `现在 $d(v) = ${answer}$ 满足 $d(v) \\le d(u) + w = ${du + w}$，而且不超过原来的 ${dv}。`,
      ],
    );
  },
);

const integerBound = point(
  "the-bound-from-the-relaxation",
  ["The bound from the relaxation", "松弛问题给出的界"],
  [
    "Dropping the integer requirement can only enlarge the feasible set, so the relaxation's maximum bounds the integer maximum from above. When all objective coefficients and variables are whole numbers, the objective is a whole number too. So the bound can be rounded down.\n\nA relaxation value of $\\frac{47}{3} = 15\\frac{2}{3}$ shows that the integer optimum is at most 15, since it is a whole number no larger than $15\\frac{2}{3}$.\n\nCheck: $15 \\le \\frac{47}{3} < 16$.\n\n> **Watch out.** Round down, not up or to the nearest: the integer optimum can never exceed the relaxation.",
    "去掉整数要求只会扩大可行集，所以松弛问题的最大值是整数最大值的上界。当目标系数和变量都是整数时，目标值也是整数。所以这个界可以向下取整。\n\n松弛值 $\\frac{47}{3} = 15\\frac{2}{3}$ 说明整数最优值至多是 15，因为它是不超过 $15\\frac{2}{3}$ 的整数。\n\n检验：$15 \\le \\frac{47}{3} < 16$。\n\n> **注意。** 要向下取整，不能向上取整或四舍五入：整数最优值不可能超过松弛值。",
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6, 7]);
    const whole = rng.int(5, 40);
    const r = rng.int(1, d - 1);
    const value = frac(whole * d + r, d);
    return solved(
      [
        `A maximization with whole coefficients has relaxation value $${value.toLatex()}$. What is the best upper bound on its integer optimum?`,
        `一个整数系数的最大化问题，松弛值是 $${value.toLatex()}$。它的整数最优值的最好上界是多少？`,
      ],
      whole,
      [
        [
          whole + 1,
          `That rounds up, but the integer optimum cannot exceed $${value.toLatex()}$.`,
          `这是向上取整，但整数最优值不能超过 $${value.toLatex()}$。`,
        ],
        [
          whole - 1,
          `That is a valid bound but not the best one, since ${whole} is no larger than $${value.toLatex()}$.`,
          `这是一个界，但不是最好的，因为 ${whole} 也不超过 $${value.toLatex()}$。`,
        ],
        [whole * d + r, "That is the numerator of the relaxation value, not the value itself.", "这是松弛值的分子，不是松弛值本身。"],
        [
          whole + r,
          "That adds the numerator of the remainder instead of dropping the fraction.",
          "这把余数的分子加了上去，而不是舍去分数部分。",
        ],
      ],
      [
        [
          ["Write the value as a mixed number", "写成带分数"],
          [`$${value.toLatex()} = ${whole} + ${frac(r, d).toLatex()}$.`, `$${value.toLatex()} = ${whole} + ${frac(r, d).toLatex()}$。`],
        ],
        [
          ["Round down", "向下取整"],
          [
            `The integer optimum is a whole number at most $${value.toLatex()}$, so it is at most ${whole}.`,
            `整数最优值是不超过 $${value.toLatex()}$ 的整数，所以至多是 ${whole}。`,
          ],
        ],
      ],
      [`$${whole} \\le ${value.toLatex()} < ${whole + 1}$.`, `$${whole} \\le ${value.toLatex()} < ${whole + 1}$。`],
    );
  },
);

const maximin = point(
  "the-lower-and-upper-values-of-a-game",
  ["The lower and upper values of a game", "博弈的下值与上值"],
  [
    "The row player can guarantee the maximin, the largest of the row minima. The column player can hold the row player to the minimax, the smallest of the column maxima. The first never exceeds the second, and the gap between them is what mixed strategies close.\n\nIn the game $\\begin{pmatrix} 3 & -1 & 4 \\\\ 0 & 2 & 1 \\end{pmatrix}$ the row minima are $-1$ and 0, so the maximin is 0. The column maxima are 3, 2 and 4, so the minimax is 2.\n\nCheck: $0 \\le 2$, as the maximin never exceeds the minimax.\n\n> **Watch out.** The maximin takes minima across the rows first, and the minimax takes maxima down the columns first; mixing the two orders gives neither.",
    "行参与者能保证最大最小值，即各行最小值中的最大者。列参与者能把行参与者限制在最小最大值，即各列最大值中的最小者。前者从不超过后者，它们之间的差距正是混合策略所要弥合的。\n\n在博弈 $\\begin{pmatrix} 3 & -1 & 4 \\\\ 0 & 2 & 1 \\end{pmatrix}$ 中，各行最小值是 $-1$ 和 0，所以最大最小值是 0。各列最大值是 3、2 和 4，所以最小最大值是 2。\n\n检验：$0 \\le 2$，最大最小值从不超过最小最大值。\n\n> **注意。** 最大最小值先在每行取最小，最小最大值先在每列取最大；把两种顺序混在一起，两者都得不到。",
  ],
  (rng) => {
    const rows = [0, 1].map(() => [0, 1, 2].map(() => rng.int(-5, 9)));
    const lower = Math.max(...rows.map((r) => Math.min(...r)));
    const upper = Math.min(...[0, 1, 2].map((j) => Math.max(...rows.map((r) => r[j] as number))));
    const askLower = rng.bool();
    const answer = askLower ? lower : upper;
    const rowMins = rows.map((r) => Math.min(...r));
    const colMaxes = [0, 1, 2].map((j) => Math.max(...rows.map((r) => r[j] as number)));
    return solved(
      [
        `In the matrix game $${matrix(rows)}$, with entries paid to the row player, what is the ${askLower ? "maximin, the largest row minimum" : "minimax, the smallest column maximum"}?`,
        `在矩阵博弈 $${matrix(rows)}$ 中（数值付给行参与者），${askLower ? "最大最小值（各行最小值中的最大者）" : "最小最大值（各列最大值中的最小者）"}是多少？`,
      ],
      answer,
      [
        askLower
          ? [upper, "That is the minimax, the smallest column maximum.", "这是最小最大值，即各列最大值中的最小者。"]
          : [lower, "That is the maximin, the largest row minimum.", "这是最大最小值，即各行最小值中的最大者。"],
        [
          answer + 1,
          askLower ? "No row minimum is that large." : "A smaller column maximum is available.",
          askLower ? "没有哪一行的最小值这么大。" : "还有更小的列最大值。",
        ],
        [
          answer - 1,
          askLower ? "A larger row minimum is available." : "Every column maximum is larger than that.",
          askLower ? "还有更大的行最小值。" : "每一列的最大值都比它大。",
        ],
        [
          Math.max(...rows.flat()),
          "That is the largest entry, which neither player can count on.",
          "这是最大的元素，两个参与者都不能指望它。",
        ],
      ],
      askLower
        ? [
            [
              ["Find each row minimum", "求各行最小值"],
              [`The row minima are ${rowMins.join(" and ")}.`, `各行最小值是 ${rowMins.join(" 和 ")}。`],
            ],
            [
              ["Take the largest", "取最大的"],
              [`The larger of them is ${answer}.`, `其中较大的是 ${answer}。`],
            ],
          ]
        : [
            [
              ["Find each column maximum", "求各列最大值"],
              [`The column maxima are ${colMaxes.join(", ")}.`, `各列最大值是 ${colMaxes.join("、")}。`],
            ],
            [
              ["Take the smallest", "取最小的"],
              [`The smallest of them is ${answer}.`, `其中最小的是 ${answer}。`],
            ],
          ],
      [`The maximin ${lower} is at most the minimax ${upper}, as it must be.`, `最大最小值 ${lower} 不超过最小最大值 ${upper}，本应如此。`],
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
