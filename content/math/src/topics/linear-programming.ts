// Linear Programming: formulation, the graphical method, the simplex method, duality,
// sensitivity, transportation and assignment, network flows, integer programs and matrix games.

import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { plane, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

/** listed writes a list of numbers in TeX, separated by commas. */
const listed = (values: readonly number[]) => `$${values.join(", ")}$`;

/** term writes a coefficient times a variable, leaving out a coefficient of one. */
const term = (c: number, v: string) => (c === 1 ? v : `${c}${v}`);

/** matrix writes a table of numbers in LaTeX. */
const matrix = (rows: readonly (readonly number[])[]) =>
  `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

const formulating = topic(
  "formulating-linear-programs",
  ["Formulating Linear Programs", "建立线性规划"],
  ["Turn a story about limited resources into variables, constraints and an objective.", "把资源有限的情境转化为变量、约束和目标。"],
  ["systems-of-linear-inequalities"],
  [],
  [
    point(
      "writing-a-resource-constraint",
      ["Writing a resource constraint", "写出资源约束"],
      [
        "A linear program chooses values of some variables to make a linear objective as large or as small as possible, subject to linear constraints. Each scarce resource gives one inequality: the amount used by every activity, added up, cannot exceed what is available. Each coefficient says how much of that resource one unit of the activity consumes, so getting the units right matters most.",
        "线性规划选择一些变量的值，使线性目标尽可能大或尽可能小，同时满足线性约束。每种稀缺资源给出一个不等式：各项活动使用的量加起来，不能超过可用的量。每个系数表示一单位活动消耗多少这种资源，所以弄清单位最重要。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const h = rng.int(30, 120);
        return choose(
          rng,
          [
            `A table takes ${a} hours and a chair takes ${b} hours, with ${h} hours available. With $x$ tables and $y$ chairs, which constraint describes the hours?`,
            `一张桌子用 ${a} 小时，一把椅子用 ${b} 小时，共有 ${h} 小时可用。做 $x$ 张桌子和 $y$ 把椅子时，哪个约束描述了工时？`,
          ],
          same(`${a}x + ${b}y \\le ${h}`),
          [same(`${b}x + ${a}y \\le ${h}`), same(`${a}x + ${b}y \\ge ${h}`), same(`x + y \\le ${h}`)],
          [
            `The tables use $${a}x$ hours and the chairs use $${b}y$ hours, and together they cannot exceed ${h}.`,
            `桌子用 $${a}x$ 小时，椅子用 $${b}y$ 小时，合起来不能超过 ${h}。`,
          ],
        );
      },
    ),
    point(
      "what-a-plan-leaves-room-for",
      ["What a plan leaves room for", "计划还能容纳多少"],
      [
        "A plan is feasible when it satisfies every constraint at once. Fixing some of the variables shows what room remains for the others: subtract what the fixed activities use, then divide the rest by the amount that one more unit needs. With whole units only, the result rounds down, because rounding up would break the constraint even though it looks closer to the limit.",
        "满足所有约束的计划是可行的。固定一部分变量，就能看出其他变量还有多少余地：减去固定活动使用的量，再用剩余量除以每增加一单位所需的量。只能取整数单位时，结果向下取整，因为向上取整看似更接近上限，却会违反约束。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(3, 9);
        const x = rng.int(2, 8);
        const left = b * rng.int(2, 9) + rng.int(1, b - 1);
        const h = a * x + left;
        const answer = Math.floor(left / b);
        return ask(
          [
            `A table takes ${a} hours and a chair takes ${b} hours, with ${h} hours available. If ${x} tables are made, how many whole chairs can be made at most?`,
            `一张桌子用 ${a} 小时，一把椅子用 ${b} 小时，共有 ${h} 小时可用。如果做 ${x} 张桌子，最多还能做多少把完整的椅子？`,
          ],
          answer,
          [answer + 1, Math.floor(h / b), left, answer - 1],
          [
            `The tables use ${a * x} hours, which leaves ${left}. Dividing by ${b} and rounding down gives ${answer}.`,
            `桌子用 ${a * x} 小时，还剩 ${left} 小时。除以 ${b} 并向下取整，得 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const graphical = topic(
  "the-graphical-method-for-linear-programs",
  ["The Graphical Method for Linear Programs", "线性规划的图解法"],
  ["Find corner points of a feasible region, and locate the optimum among them.", "求可行域的顶点，并在其中找到最优解。"],
  ["formulating-linear-programs"],
  [["formulating-linear-programs", 0.3]],
  [
    point(
      "finding-a-corner-point",
      ["Finding a corner point", "求顶点"],
      [
        "With two variables, the constraints cut out a polygon called the feasible region. Its corners are where two boundary lines meet, so each corner comes from solving two equations together. Corners matter because of the central fact of linear programming: when an optimum exists, some corner attains it. The interior never needs a separate search, since a linear objective keeps improving until the boundary stops it.",
        "两个变量时，约束围成一个称为可行域的多边形。它的顶点是两条边界线的交点，所以每个顶点都来自联立两个方程。顶点重要，是因为线性规划的核心事实：最优解存在时，总有某个顶点能达到它。内部不必单独搜索，因为线性目标会一直改进，直到被边界挡住。",
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const y = rng.int(2, 12);
        const asksX = rng.bool();
        const [A, B] = [x + 2 * y, 3 * x + y];
        return ask(
          [
            `The boundary lines $x + 2y = ${A}$ and $3x + y = ${B}$ meet at a corner of a feasible region. What is its ${asksX ? "$x$" : "$y$"} coordinate?`,
            `边界线 $x + 2y = ${A}$ 和 $3x + y = ${B}$ 相交于可行域的一个顶点。它的${asksX ? "$x$" : "$y$"}坐标是多少？`,
          ],
          asksX ? x : y,
          [asksX ? y : x, x + y, asksX ? x + 1 : y + 1, asksX ? A : B],
          [
            `Subtracting the first equation from twice the second gives $5x = ${2 * B - A}$, so $x = ${x}$ and then $y = ${y}$.`,
            `用第二个方程的两倍减去第一个方程，得 $5x = ${2 * B - A}$，所以 $x = ${x}$，进而 $y = ${y}$。`,
          ],
        );
      },
    ),
    point(
      "the-best-corner",
      ["The best corner", "最好的顶点"],
      [
        "To solve a two-variable program by hand, list the corners of the feasible region, evaluate the objective at each, and take the best. Parallel lines of equal objective value slide across the region, and the last point they touch is the optimum, which explains why a corner always suffices. If two neighbouring corners tie, every point on the edge between them is optimal too.",
        "手工求解两个变量的规划时，列出可行域的顶点，在每个顶点计算目标值，再取最好的。目标值相等的平行线滑过可行域，最后碰到的点就是最优解，这解释了为什么只看顶点就够了。如果两个相邻顶点的值相等，它们之间那条边上的每个点也都是最优的。",
      ],
      (rng) => {
        const a = rng.int(8, 16);
        const b = rng.int(Math.ceil(a / 2) + 1, a - 2);
        const c = rng.int(a - b + 1, a - 2);
        const p = rng.int(1, 9);
        const q = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== p));
        const corners: readonly (readonly [number, number])[] = [
          [b, 0],
          [b, a - b],
          [a - c, c],
          [0, c],
        ];
        const values = corners.map(([x, y]) => p * x + q * y);
        const answer = Math.max(...values);
        const best = corners[values.indexOf(answer)] as readonly [number, number];
        const objective = `${term(p, "x")} + ${term(q, "y")}`;
        const svg = plane({ xMin: -1, xMax: a + 1, yMin: -1, yMax: a + 1, labelEvery: 2 }, [
          { kind: "polygon", points: [[0, 0], ...corners] },
        ]);
        const figure = {
          svg,
          alt: t(
            `The feasible region, a polygon with corners at the origin, (${b}, 0), (${b}, ${a - b}), (${a - c}, ${c}) and (0, ${c}).`,
            `可行域是一个多边形，顶点是原点，(${b}, 0)，(${b}, ${a - b})，(${a - c}, ${c}) 和 (0, ${c})。`,
          ),
        };
        return ask(
          [
            `Maximize $${objective}$ subject to $x + y \\le ${a}$, $x \\le ${b}$, $y \\le ${c}$, $x, y \\ge 0$. What is the maximum value?`,
            `在 $x + y \\le ${a}$，$x \\le ${b}$，$y \\le ${c}$，$x, y \\ge 0$ 的条件下，使 $${objective}$ 最大。最大值是多少？`,
          ],
          answer,
          [...values.filter((v) => v !== answer), p * b + q * c, answer + 1],
          [
            `The corners other than the origin are $(${b}, 0)$, $(${b}, ${a - b})$, $(${a - c}, ${c})$ and $(0, ${c})$. The largest value, ${answer}, occurs at $(${best[0]}, ${best[1]})$.`,
            `除原点外，顶点是 $(${b}, 0)$，$(${b}, ${a - b})$，$(${a - c}, ${c})$ 和 $(0, ${c})$。最大值 ${answer} 在 $(${best[0]}, ${best[1]})$ 处取得。`,
          ],
          figure,
        );
      },
    ),
  ],
);

const standardForm = topic(
  "standard-form-and-slack-variables",
  ["Standard Form and Slack Variables", "标准形式和松弛变量"],
  ["Rewrite inequalities as equations with slack and surplus variables.", "用松弛变量和剩余变量把不等式写成等式。"],
  ["the-graphical-method-for-linear-programs", "gaussian-elimination-for-nxm-systems-of-equations"],
  [],
  [
    point(
      "the-value-of-a-slack-variable",
      ["The value of a slack variable", "松弛变量的值"],
      [
        "The simplex method works with equations, so each inequality is rewritten first. A less-than constraint gains a slack variable, which measures the unused part of the resource and must be nonnegative. A point is feasible exactly when all its slack values are nonnegative, and a slack of zero means that the constraint is tight at that point, so the point lies on that boundary.",
        "单纯形法处理等式，所以先要把每个不等式改写。小于等于约束加上一个松弛变量，它度量资源未用的部分，必须非负。一个点可行，当且仅当它所有的松弛值都非负；松弛为零表示约束在这一点是紧的，这个点位于那条边界上。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const x = rng.int(1, 9);
        const y = rng.int(1, 9);
        const s = rng.int(0, 15);
        const c = a * x + b * y + s;
        return ask(
          [
            `The constraint $${a}x + ${b}y \\le ${c}$ becomes $${a}x + ${b}y + s = ${c}$. What is $s$ at the point $(${x}, ${y})$?`,
            `约束 $${a}x + ${b}y \\le ${c}$ 变成 $${a}x + ${b}y + s = ${c}$。在点 $(${x}, ${y})$ 处，$s$ 是多少？`,
          ],
          s,
          [a * x + b * y, s + a, s + b, c],
          [
            `The point uses ${a * x + b * y} of the ${c} available, so $s = ${s}$.`,
            `这个点用了可用的 ${c} 中的 ${a * x + b * y}，所以 $s = ${s}$。`,
          ],
        );
      },
    ),
    point(
      "counting-variables-in-standard-form",
      ["Counting variables in standard form", "数标准形式中的变量"],
      [
        "In standard form, every constraint is an equation and every variable is nonnegative. Each less-than constraint adds a slack variable and each greater-than constraint subtracts a surplus variable, whereas an equality constraint needs neither. So the total number of variables is the number of original ones plus one for each inequality. The number of equations stays equal to the number of constraints.",
        "在标准形式中，每个约束都是等式，每个变量都非负。每个小于等于约束加一个松弛变量，每个大于等于约束减一个剩余变量，而等式约束都不需要。所以变量总数是原变量的个数加上不等式的个数。方程的个数仍然等于约束的个数。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const le = rng.int(2, 6);
        const ge = rng.int(2, 5);
        const eq = rng.int(2, 4);
        const answer = n + le + ge;
        return ask(
          [
            `A program has ${n} variables, with ${le} less-than constraints, ${ge} greater-than constraints and ${eq} equality constraints. How many variables does its standard form have, counting slack and surplus?`,
            `一个规划有 ${n} 个变量，${le} 个小于等于约束，${ge} 个大于等于约束和 ${eq} 个等式约束。算上松弛变量和剩余变量，它的标准形式有多少个变量？`,
          ],
          answer,
          [n + le, answer + eq, n, n + ge],
          [
            `Each of the ${le + ge} inequalities adds one variable and the equalities add none, so the total is ${n} + ${le + ge} = ${answer}.`,
            `这 ${le + ge} 个不等式各增加一个变量，等式不增加，所以总数是 ${n} + ${le + ge} = ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const basicSolutions = topic(
  "basic-feasible-solutions",
  ["Basic Feasible Solutions", "基本可行解"],
  ["Compute basic solutions, and connect them with corners of the region.", "计算基本解，并把它们与可行域的顶点联系起来。"],
  ["standard-form-and-slack-variables"],
  [["standard-form-and-slack-variables", 0.4]],
  [
    point(
      "counting-basic-solutions",
      ["Counting basic solutions", "数基本解"],
      [
        "With m independent equations in n variables, a basic solution sets all but m variables to zero and solves for the rest. The m chosen variables form the basis. So there are at most n choose m basic solutions, which is finite, and only those with nonnegative values are basic feasible solutions. These are exactly the corners of the feasible region, written in algebra rather than geometry.",
        "n 个变量的 m 个独立方程中，基本解把除 m 个以外的变量都设为零，再解出其余的变量。选出的 m 个变量构成基。所以基本解至多有 n 选 m 个，数目有限，其中取值都非负的才是基本可行解。它们恰好是可行域的顶点，只是用代数而不是几何来写。",
      ],
      (rng) => {
        const n = rng.int(5, 13);
        const m = rng.int(2, 4);
        let answer = 1;
        for (let i = 0; i < m; i += 1) answer = (answer * (n - i)) / (i + 1);
        return ask(
          [
            `A system has ${m} independent equations in ${n} variables. At most how many basic solutions can it have?`,
            `一个方程组有 ${n} 个变量和 ${m} 个独立方程。它至多有多少个基本解？`,
          ],
          answer,
          [n * m, answer * 2, n - m, n ** 2],
          [
            `A basis is a choice of ${m} variables from ${n}, and there are $\\binom{${n}}{${m}} = ${answer}$ choices.`,
            `基是从 ${n} 个变量中选 ${m} 个，共有 $\\binom{${n}}{${m}} = ${answer}$ 种选法。`,
          ],
        );
      },
    ),
    point(
      "computing-a-basic-solution",
      ["Computing a basic solution", "计算基本解"],
      [
        "To find a basic solution, set the nonbasic variables to zero and solve what remains. If every basic variable comes out nonnegative, the solution is feasible and it is a corner. If some value is negative, it is still a basic solution, but it lies outside the feasible region, at a place where two boundary lines cross beyond the polygon. The sign is what tells these two cases apart.",
        "求基本解时，把非基变量设为零，再解剩下的方程。如果每个基变量都非负，这个解就是可行的，它是一个顶点。如果某个值是负的，它仍然是基本解，但位于可行域外，是两条边界线在多边形外的交点。正负号正是区分这两种情况的依据。",
      ],
      (rng) => {
        const b = rng.int(2, 6);
        const c = rng.int(2, 7);
        const d = rng.int(2, 6);
        const A = rng.int(2, 12);
        const B = rng.int(4, 60);
        const answer = B - c * A;
        return ask(
          [
            `Take the equations $x_1 + ${b}x_2 + s_1 = ${A}$ and $${c}x_1 + ${d}x_2 + s_2 = ${B}$. In the basic solution with $x_2 = s_1 = 0$, what is $s_2$?`,
            `取方程 $x_1 + ${b}x_2 + s_1 = ${A}$ 和 $${c}x_1 + ${d}x_2 + s_2 = ${B}$。在 $x_2 = s_1 = 0$ 的基本解中，$s_2$ 是多少？`,
          ],
          answer,
          [B, B - A, c * A - B, B - d * A],
          [
            `The first equation gives $x_1 = ${A}$, and then $s_2 = ${B} - ${c}(${A}) = ${answer}$.${answer < 0 ? " It is negative, so this basic solution is not feasible." : ""}`,
            `第一个方程给出 $x_1 = ${A}$，于是 $s_2 = ${B} - ${c}(${A}) = ${answer}$。${answer < 0 ? "它是负数，所以这个基本解不可行。" : ""}`,
          ],
        );
      },
    ),
  ],
);

const tableau = topic(
  "the-simplex-tableau",
  ["The Simplex Tableau", "单纯形表"],
  [
    "Choose the entering variable from the objective row, and the leaving row by the ratio test.",
    "由目标行选择进基变量，用比值检验选择离基行。",
  ],
  ["basic-feasible-solutions", "elementary-row-operations"],
  [["basic-feasible-solutions", 0.3]],
  [
    point(
      "choosing-the-entering-variable",
      ["Choosing the entering variable", "选择进基变量"],
      [
        "The simplex method walks from corner to corner, improving the objective at each step. In a maximization tableau, the objective row is written with the coefficients moved across, so a negative entry marks a variable that would raise the objective. The usual rule picks the most negative entry. When no negative entries remain, no neighbouring corner is better, and the current corner is optimal.",
        "单纯形法从一个顶点走到另一个顶点，每一步都改进目标。在最大化的单纯形表中，目标行的系数是移项后写的，所以负数表示这个变量能提高目标。通常的法则选最负的数。当没有负数时，相邻的顶点都不更好，当前顶点就是最优的。",
      ],
      (rng) => {
        const entries = rng.shuffle([-rng.int(6, 12), -rng.int(1, 5), rng.int(1, 9), rng.int(0, 9)]);
        const index = entries.indexOf(Math.min(...entries));
        const names = [0, 1, 2, 3].map((i): Pair => [`$x_{${i + 1}}$`, `$x_{${i + 1}}$`]);
        return choose(
          rng,
          [
            `The objective row of a maximization tableau has entries ${entries.map((e, i) => `$${e}$ under $x_{${i + 1}}$`).join(", ")}. Which variable enters under the most negative rule?`,
            `最大化单纯形表的目标行中，${entries.map((e, i) => `$x_{${i + 1}}$ 下的数是 $${e}$`).join("，")}。按最负法则，哪个变量进基？`,
          ],
          names[index] as Pair,
          names.filter((_, i) => i !== index),
          [
            `The most negative entry is $${entries[index]}$, so $x_{${index + 1}}$ enters.`,
            `最负的数是 $${entries[index]}$，所以 $x_{${index + 1}}$ 进基。`,
          ],
        );
      },
    ),
    point(
      "the-ratio-test",
      ["The ratio test", "比值检验"],
      [
        "Once a variable enters, it grows until some basic variable reaches zero. For each row with a positive entry in the entering column, divide the right side by that entry. The smallest ratio tells how far the variable can go, and that row leaves the basis. Rows with zero or negative entries are skipped, since a growing variable does not push their basic variables down to zero.",
        "变量进基后不断增大，直到某个基变量变成零。对进基列中元素为正的每一行，用右端除以这个元素。最小的比值说明变量能增大多少，这一行离基。元素为零或负的行要跳过，因为变量增大不会把这些行的基变量压到零。",
      ],
      (rng) => {
        const p = rng.int(2, 6);
        const q = rng.int(2, 6);
        const n = -rng.int(1, 5);
        const small = rng.int(2, 6);
        const big = small + rng.int(1, 5);
        const free = rng.int(1, 3) * rng.int(2, 9);
        const rows = rng.shuffle([
          [p, p * small],
          [q, q * big],
          [n, free],
        ]) as [number, number][];
        return ask(
          [
            `The entering column has entries ${listed(rows.map((r) => r[0] as number))}, and the right sides of those rows are ${listed(rows.map((r) => r[1] as number))}. What is the smallest ratio that counts?`,
            `进基列的元素是 ${listed(rows.map((r) => r[0] as number))}，这些行的右端是 ${listed(rows.map((r) => r[1] as number))}。有效的最小比值是多少？`,
          ],
          small,
          [big, Q.of(free, n), Q.of(free, -n), small + 1],
          [
            `The row with the negative entry $${n}$ is skipped. The other ratios are ${small} and ${big}, so the smallest is ${small}.`,
            `元素为负数 $${n}$ 的行要跳过。其余的比值是 ${small} 和 ${big}，所以最小的是 ${small}。`,
          ],
        );
      },
    ),
  ],
);

const pivoting = topic(
  "pivoting-in-the-simplex-method",
  ["Pivoting in the Simplex Method", "单纯形法的主元运算"],
  ["Carry out a pivot, and predict how the objective changes.", "进行主元运算，并预测目标如何变化。"],
  ["the-simplex-tableau"],
  [["the-simplex-tableau", 0.5]],
  [
    point(
      "a-row-after-a-pivot",
      ["A row after a pivot", "主元运算后的一行"],
      [
        "A pivot is a round of row operations that makes the entering column a unit vector. Divide the pivot row by the pivot, then subtract multiples of it from every other row to clear the column. The right sides change along with everything else, and they give the new values of the basic variables. It is just Gaussian elimination, applied one column at a time.",
        "主元运算是一轮行变换，它把进基列变成单位向量。把主元行除以主元，再从其他每一行减去它的倍数，把这一列消去。右端也随之变化，它们给出基变量的新值。这就是高斯消元，一次处理一列。",
      ],
      (rng) => {
        const a = rng.int(2, 5);
        const t = rng.int(2, 8);
        const k = rng.int(1, 5);
        const e = rng.int(2, 6);
        const f = e * k + rng.int(1, 9);
        const h = e * t + rng.int(0, 20);
        const asksRight = rng.bool();
        const answer = asksRight ? h - e * t : f - e * k;
        return ask(
          [
            `Pivoting on the ${a} in the row $${a}x_1 + ${a * k}x_2 + s_1 = ${a * t}$, what does the row $${e}x_1 + ${f}x_2 + s_2 = ${h}$ have as its ${asksRight ? "right side" : "$x_2$ coefficient"} afterwards?`,
            `以行 $${a}x_1 + ${a * k}x_2 + s_1 = ${a * t}$ 中的 ${a} 为主元，运算后行 $${e}x_1 + ${f}x_2 + s_2 = ${h}$ 的${asksRight ? "右端" : "$x_2$ 系数"}是多少？`,
          ],
          answer,
          asksRight ? [h - a * t, h, h - t, answer + e] : [f - a * k, f, f - k, answer + e],
          [
            `Dividing the pivot row by ${a} gives $x_1 + ${term(k, "x_2")} + \\frac{1}{${a}}s_1 = ${t}$. Subtracting ${e} times this leaves ${asksRight ? `$${h} - ${e}(${t}) = ${answer}$` : `$${f} - ${e}(${k}) = ${answer}$`}.`,
            `把主元行除以 ${a}，得 $x_1 + ${term(k, "x_2")} + \\frac{1}{${a}}s_1 = ${t}$。减去它的 ${e} 倍，得 ${asksRight ? `$${h} - ${e}(${t}) = ${answer}$` : `$${f} - ${e}(${k}) = ${answer}$`}。`,
          ],
        );
      },
    ),
    point(
      "the-objective-after-a-pivot",
      ["The objective after a pivot", "主元运算后的目标值"],
      [
        "The gain from a pivot can be predicted before doing it. The entering variable has a reduced profit, the rate at which the objective rises per unit, and the ratio test says how many units it can take. Their product is the increase. So the new objective value is the old one plus the rate times the step, which provides a useful check on the arithmetic of the whole pivot.",
        "主元运算的收益可以预先算出。进基变量有一个检验数，也就是每增加一单位目标上升的速率，而比值检验说明它能增加多少单位。两者的乘积就是增加量。所以新的目标值等于旧值加上速率乘步长，这是检验整个主元运算是否算对的好办法。",
      ],
      (rng) => {
        const z = rng.int(0, 40);
        const c = rng.int(2, 9);
        const step = rng.int(2, 9);
        const answer = z + c * step;
        return ask(
          [
            `The objective is now ${z}. The entering variable raises it by ${c} per unit, and the smallest ratio is ${step}. What is the objective after the pivot?`,
            `目标值现在是 ${z}。进基变量每增加一单位使它增加 ${c}，最小比值是 ${step}。主元运算后目标值是多少？`,
          ],
          answer,
          [c * step, z + c + step, z + c, answer + c],
          [
            `The increase is ${c} × ${step} = ${c * step}, so the new value is ${answer}.`,
            `增加量是 ${c} × ${step} = ${c * step}，所以新值是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const twoPhase = topic(
  "the-two-phase-method",
  ["The Two-Phase Method", "两阶段法"],
  ["Start the simplex method when no obvious basis exists, and detect infeasibility.", "在没有明显基时启动单纯形法，并发现不可行的情况。"],
  ["pivoting-in-the-simplex-method"],
  [],
  [
    point(
      "counting-artificial-variables",
      ["Counting artificial variables", "数人工变量"],
      [
        "A less-than constraint with a nonnegative right side has a slack variable ready to serve in the starting basis. A greater-than constraint does not, because its surplus variable appears with a minus sign, and an equality has no such variable at all. Each of those needs a temporary artificial variable, which exists only to get the method started and must finally be driven to zero.",
        "右端非负的小于等于约束有现成的松弛变量，可以进入初始基。大于等于约束没有，因为它的剩余变量带负号；等式约束则根本没有这样的变量。这些约束各需要一个临时的人工变量，它只用于启动方法，最后必须变成零。",
      ],
      (rng) => {
        const le = rng.int(2, 6);
        const ge = rng.int(2, 5);
        const eq = rng.int(2, 4);
        const answer = ge + eq;
        return ask(
          [
            `A program with nonnegative right sides has ${le} less-than constraints, ${ge} greater-than constraints and ${eq} equality constraints. How many artificial variables does phase one need?`,
            `一个右端非负的规划有 ${le} 个小于等于约束，${ge} 个大于等于约束和 ${eq} 个等式约束。第一阶段需要多少个人工变量？`,
          ],
          answer,
          [le + ge + eq, ge, eq, le + ge],
          [
            `The less-than constraints have slack variables ready, so only the ${ge} + ${eq} others need one, which makes ${answer}.`,
            `小于等于约束有现成的松弛变量，所以只有其余的 ${ge} + ${eq} 个约束需要，共 ${answer} 个。`,
          ],
        );
      },
    ),
    point(
      "reading-the-end-of-phase-one",
      ["Reading the end of phase one", "解读第一阶段的结果"],
      [
        "Phase one minimizes the sum of the artificial variables. If the minimum is zero, all of them have left the solution, so the point reached is feasible for the original problem, and phase two continues from there with the true objective. If the minimum is positive, no choice of variables can satisfy the constraints without help from an artificial variable, so the original program is infeasible.",
        "第一阶段使人工变量之和最小。如果最小值是零，它们都已离开解，得到的点对原问题是可行的，第二阶段用真正的目标从那里继续。如果最小值是正的，没有人工变量的帮助，任何取值都不能满足约束，所以原规划不可行。",
      ],
      (rng) => {
        const k = rng.int(2, 7);
        const zero = rng.bool();
        const v = zero ? 0 : rng.int(1, 30);
        const go: Pair = ["Continue with phase two from this basis", "从这个基开始第二阶段"];
        const no: Pair = ["The original program is infeasible", "原规划不可行"];
        return choose(
          rng,
          [
            `Phase one, with ${k} artificial variables, ends with their sum at its minimum value of ${v}. What follows?`,
            `第一阶段有 ${k} 个人工变量，结束时它们的和取最小值 ${v}。接下来是什么结论？`,
          ],
          zero ? go : no,
          [
            zero ? no : go,
            ["The original program is unbounded", "原规划无界"],
            ["The current point is optimal for the original objective", "当前点对原目标已是最优"],
          ],
          zero
            ? [
                "A minimum of 0 means that all artificial variables are gone, so the point is feasible for the original program.",
                "最小值为 0 表示人工变量都已离开，所以这个点对原规划可行。",
              ]
            : [
                `A minimum of ${v} means that the constraints cannot be met without an artificial variable.`,
                `最小值为 ${v} 表示没有人工变量就无法满足约束。`,
              ],
        );
      },
    ),
  ],
);

const specialCases = topic(
  "unboundedness-and-degeneracy",
  ["Unboundedness and Degeneracy", "无界和退化"],
  ["Recognize unbounded programs and degenerate pivots from the tableau.", "从单纯形表识别无界规划和退化的主元运算。"],
  ["pivoting-in-the-simplex-method"],
  [],
  [
    point(
      "reading-the-entering-column",
      ["Reading the entering column", "解读进基列"],
      [
        "The entering column decides what happens next. If it has no positive entry, the variable can grow forever while staying feasible, so the objective has no upper limit and the program is unbounded. If the smallest ratio is shared by two rows, then one of their basic variables stays in the basis with value zero after the pivot, which makes the next corner degenerate. Otherwise, it is an ordinary pivot.",
        "进基列决定接下来发生什么。如果它没有正元素，变量可以一直增大而保持可行，目标没有上限，规划无界。如果两行的最小比值相同，主元运算后其中一行的基变量留在基中且值为零，下一个顶点就是退化的。否则就是普通的主元运算。",
      ],
      (rng) => {
        const words: Record<string, Pair> = {
          unbounded: ["The program is unbounded", "规划无界"],
          degenerate: ["The next corner is degenerate", "下一个顶点是退化的"],
          ordinary: ["An ordinary pivot, with one row leaving", "普通的主元运算，有一行离基"],
          optimal: ["The current corner is optimal", "当前顶点是最优的"],
        };
        const kind = rng.pick(["unbounded", "degenerate", "ordinary"]);
        const r1 = rng.int(2, 9);
        const r2 = kind === "degenerate" ? r1 : r1 + rng.int(1, 6);
        const p = rng.int(1, 5);
        const q = rng.int(1, 5);
        const column = kind === "unbounded" ? [-p, -q] : [p, q];
        const right = kind === "unbounded" ? [rng.int(2, 30), rng.int(2, 30)] : [p * r1, q * r2];
        return choose(
          rng,
          [
            `In a maximization tableau the entering column has entries ${listed(column)}, and the right sides of those rows are ${listed(right)}. What does this show?`,
            `最大化单纯形表的进基列元素是 ${listed(column)}，这些行的右端是 ${listed(right)}。这说明什么？`,
          ],
          words[kind] as Pair,
          Object.entries(words)
            .filter(([w]) => w !== kind)
            .map(([, w]) => w),
          kind === "unbounded"
            ? ["No entry is positive, so nothing stops the variable from growing.", "没有正元素，所以没有什么能阻止变量增大。"]
            : kind === "degenerate"
              ? [`Both ratios equal ${r1}, so a tie leaves a basic variable at zero.`, `两个比值都等于 ${r1}，并列使一个基变量取零。`]
              : [
                  `The ratios ${r1} and ${r2} differ, so the row with ${r1} leaves.`,
                  `比值 ${r1} 和 ${r2} 不同，所以比值为 ${r1} 的行离基。`,
                ],
        );
      },
    ),
    point(
      "a-degenerate-step",
      ["A degenerate step", "退化的一步"],
      [
        "At a degenerate corner, some basic variable already equals zero. If the entering column has a positive entry in that row, the ratio is zero, so the pivot changes the basis without moving the point, and the objective stays exactly where it was. Such steps are usually harmless, but in rare cases the method can cycle through bases forever, and Bland's rule is a choice of pivots that prevents it.",
        "在退化的顶点，某个基变量已经等于零。如果进基列在这一行有正元素，比值就是零，所以主元运算改变了基却没有移动这个点，目标值完全不变。这样的步骤通常无害，但在极少数情况下方法会在基之间无限循环，布兰德法则是一种防止循环的主元选择。",
      ],
      (rng) => {
        const z = rng.int(5, 60);
        const c = rng.int(2, 9);
        const p = rng.int(2, 6);
        const q = rng.int(1, 6);
        const r = rng.int(2, 20);
        return ask(
          [
            `The objective is ${z}, and the entering variable raises it by ${c} per unit. Its column has entries ${p} and ${q}, with right sides 0 and ${r}. What is the objective after the pivot?`,
            `目标值是 ${z}，进基变量每增加一单位使它增加 ${c}。进基列元素是 ${p} 和 ${q}，右端是 0 和 ${r}。主元运算后目标值是多少？`,
          ],
          z,
          [z + c, z + c * r, z + c * p, z + r],
          [
            `The smallest ratio is $\\frac{0}{${p}} = 0$, so the step has length zero and the objective stays at ${z}.`,
            `最小比值是 $\\frac{0}{${p}} = 0$，步长为零，目标值保持 ${z}。`,
          ],
        );
      },
    ),
  ],
);

const dualProgram = topic(
  "the-dual-of-a-linear-program",
  ["The Dual of a Linear Program", "线性规划的对偶"],
  ["Write the dual of a maximization program.", "写出最大化规划的对偶。"],
  ["basic-feasible-solutions", "multiplying-matrices"],
  [],
  [
    point(
      "the-objective-of-the-dual",
      ["The objective of the dual", "对偶的目标"],
      [
        "Every linear program has a partner called its dual. For a program maximizing $c^T x$ subject to $Ax \\le b$ with $x \\ge 0$, the dual minimizes $b^T y$ subject to $A^T y \\ge c$ with $y \\ge 0$. There is one dual variable for each constraint, so the right sides of the primal become the costs of the dual, and the roles swap.",
        "每个线性规划都有一个称为对偶的伙伴。对于在 $Ax \\le b$、$x \\ge 0$ 的条件下使 $c^T x$ 最大的规划，它的对偶是在 $A^T y \\ge c$、$y \\ge 0$ 的条件下使 $b^T y$ 最小。每个约束对应一个对偶变量，所以原问题的右端变成对偶的系数，两者角色互换。",
      ],
      (rng) => {
        const c1 = rng.int(2, 9);
        const c2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== c1));
        const [a, b, c, d] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
        const b1 = rng.int(10, 40);
        const b2 = b1 + rng.int(1, 12);
        return choose(
          rng,
          [
            `What is the objective of the dual of: maximize $${c1}x_1 + ${c2}x_2$ subject to $${term(a, "x_1")} + ${term(b, "x_2")} \\le ${b1}$, $${term(c, "x_1")} + ${term(d, "x_2")} \\le ${b2}$, $x \\ge 0$?`,
            `规划“在 $${term(a, "x_1")} + ${term(b, "x_2")} \\le ${b1}$，$${term(c, "x_1")} + ${term(d, "x_2")} \\le ${b2}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${c2}x_2$ 最大”的对偶目标是什么？`,
          ],
          [`Minimize $${b1}y_1 + ${b2}y_2$`, `使 $${b1}y_1 + ${b2}y_2$ 最小`],
          [
            [`Maximize $${b1}y_1 + ${b2}y_2$`, `使 $${b1}y_1 + ${b2}y_2$ 最大`],
            [`Minimize $${c1}y_1 + ${c2}y_2$`, `使 $${c1}y_1 + ${c2}y_2$ 最小`],
            [`Minimize $${b2}y_1 + ${b1}y_2$`, `使 $${b2}y_1 + ${b1}y_2$ 最小`],
          ],
          [
            `The dual of a maximum is a minimum, and its costs are the right sides ${b1} and ${b2}, in the order of the constraints.`,
            `最大化的对偶是最小化，它的系数是按约束顺序排列的右端 ${b1} 和 ${b2}。`,
          ],
        );
      },
    ),
    point(
      "a-constraint-of-the-dual",
      ["A constraint of the dual", "对偶的约束"],
      [
        "Each primal variable gives one dual constraint, built by reading down its column. The column of the first variable supplies the coefficients of the first dual constraint, and its objective coefficient supplies the right side. Because the matrix is transposed, reading across a row by mistake gives the wrong constraint. A dual variable can be read as the value of one unit of the resource in its constraint.",
        "每个原变量给出一个对偶约束，由它的列纵向读出。第一个变量的列给出第一个对偶约束的系数，它的目标系数给出右端。因为矩阵被转置了，错误地横向读一行就会得到错误的约束。对偶变量可以理解为相应约束中一单位资源的价值。",
      ],
      (rng) => {
        const c1 = rng.int(2, 12);
        const c2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== c1));
        const a = rng.int(2, 6);
        const b = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== a));
        const c = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== a && v !== b));
        const d = rng.int(2, 7);
        const [b1, b2] = [rng.int(10, 40), rng.int(10, 40)];
        return choose(
          rng,
          [
            `Maximize $${c1}x_1 + ${c2}x_2$ subject to $${a}x_1 + ${b}x_2 \\le ${b1}$, $${c}x_1 + ${d}x_2 \\le ${b2}$, $x \\ge 0$. Which is the dual constraint from $x_1$?`,
            `在 $${a}x_1 + ${b}x_2 \\le ${b1}$，$${c}x_1 + ${d}x_2 \\le ${b2}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${c2}x_2$ 最大。由 $x_1$ 得到的对偶约束是哪个？`,
          ],
          same(`${a}y_1 + ${c}y_2 \\ge ${c1}`),
          [same(`${a}y_1 + ${b}y_2 \\ge ${c1}`), same(`${a}y_1 + ${c}y_2 \\le ${c1}`), same(`${a}y_1 + ${c}y_2 \\ge ${c2}`)],
          [
            `The column of $x_1$ holds ${a} and ${c}, and its objective coefficient is ${c1}. A maximum has a dual with greater-than constraints.`,
            `$x_1$ 的列是 ${a} 和 ${c}，它的目标系数是 ${c1}。最大化问题的对偶约束是大于等于。`,
          ],
        );
      },
    ),
  ],
);

const weakDuality = topic(
  "weak-duality",
  ["Weak Duality", "弱对偶"],
  ["Bound a maximum from a dual feasible point.", "由对偶可行点给出最大值的上界。"],
  ["the-dual-of-a-linear-program"],
  [["the-dual-of-a-linear-program", 0.4]],
  [
    point(
      "a-bound-from-a-dual-point",
      ["A bound from a dual point", "由对偶点得到的界"],
      [
        "Weak duality says that any feasible dual value is at least as large as any feasible primal value, when the primal is a maximum. The proof takes one line: multiply the constraints by the nonnegative dual variables and add them. So every dual feasible point certifies an upper bound on the maximum, without any need to solve the primal program, and this is often valuable in practice.",
        "弱对偶是说，当原问题是最大化时，任何可行的对偶值都不小于任何可行的原问题值。证明只有一行：把约束乘以非负的对偶变量再相加。所以每个对偶可行点都给出最大值的一个上界，完全不用求解原问题，这在实践中常常很有价值。",
      ],
      (rng) => {
        const y1 = rng.int(1, 5);
        const y2 = rng.int(1, 5);
        const c1 = y1 + 2 * y2 - rng.int(0, 1);
        const c2 = y1 + y2 - rng.int(0, 1);
        const A = rng.int(8, 30);
        const B = rng.int(10, 40);
        const answer = A * y1 + B * y2;
        return ask(
          [
            `Maximize $${term(c1, "x_1")} + ${term(c2, "x_2")}$ subject to $x_1 + x_2 \\le ${A}$, $2x_1 + x_2 \\le ${B}$, $x \\ge 0$. What upper bound does the dual point $y = (${y1}, ${y2})$ give?`,
            `在 $x_1 + x_2 \\le ${A}$，$2x_1 + x_2 \\le ${B}$，$x \\ge 0$ 的条件下使 $${term(c1, "x_1")} + ${term(c2, "x_2")}$ 最大。对偶点 $y = (${y1}, ${y2})$ 给出的上界是多少？`,
          ],
          answer,
          [A * y2 + B * y1, A + B, c1 * y1 + c2 * y2, answer + 1],
          [
            `This point is dual feasible, as ${y1 + 2 * y2} is at least ${c1} and ${y1 + y2} is at least ${c2}. Its value is ${A}(${y1}) + ${B}(${y2}) = ${answer}.`,
            `这个点对偶可行，因为 ${y1 + 2 * y2} 不小于 ${c1}，${y1 + y2} 不小于 ${c2}。它的值是 ${A}(${y1}) + ${B}(${y2}) = ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-gap-between-two-points",
      ["The gap between two points", "两点之间的间隙"],
      [
        "A feasible primal point gives a lower bound on the maximum, and a feasible dual point gives an upper bound, so the optimum lies between them. The difference between the two values is the duality gap of that pair of points. It measures how far either point could be from optimal, so an algorithm can stop as soon as the gap is small, and a gap of zero proves both optimal.",
        "可行的原问题点给出最大值的下界，可行的对偶点给出上界，所以最优值在它们之间。这两个值的差就是这对点的对偶间隙。它度量任一点离最优有多远，所以算法在间隙足够小时就可以停止，而间隙为零证明两个点都是最优的。",
      ],
      (rng) => {
        const [c1, c2] = [rng.int(2, 5), rng.int(2, 5)];
        const [x1, x2] = [rng.int(1, 4), rng.int(1, 4)];
        const primal = c1 * x1 + c2 * x2;
        const least = Math.ceil(primal / 2);
        const [b1, b2] = [least + rng.int(1, 8), least + rng.int(1, 8)];
        const [y1, y2] = [rng.int(1, 4), rng.int(1, 4)];
        const dual = b1 * y1 + b2 * y2;
        const answer = dual - primal;
        return ask(
          [
            `For a program maximizing $${c1}x_1 + ${c2}x_2$, the feasible point $x = (${x1}, ${x2})$ is known. The right sides are ${b1} and ${b2}, and $y = (${y1}, ${y2})$ is dual feasible. What is the gap between the two values?`,
            `对于使 $${c1}x_1 + ${c2}x_2$ 最大的规划，已知可行点 $x = (${x1}, ${x2})$。右端是 ${b1} 和 ${b2}，$y = (${y1}, ${y2})$ 对偶可行。两个值的间隙是多少？`,
          ],
          answer,
          [dual, primal, dual + primal, answer + 1],
          [
            `The primal value is ${primal} and the dual value is ${dual}, which differ by ${answer}.`,
            `原问题的值是 ${primal}，对偶的值是 ${dual}，相差 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const strongDuality = topic(
  "strong-duality-and-complementary-slackness",
  ["Strong Duality and Complementary Slackness", "强对偶和互补松弛"],
  ["Use equal optimal values, and deduce dual values from which constraints are tight.", "利用最优值相等，并由哪些约束是紧的推出对偶值。"],
  ["weak-duality"],
  [["weak-duality", 0.5]],
  [
    point(
      "using-equal-optimal-values",
      ["Using equal optimal values", "利用最优值相等"],
      [
        "Strong duality says that when a program has an optimum, its dual has one too, and the two optimal values are equal. No gap remains. This is deep, as the simplex method's last tableau actually displays the optimal dual solution in its objective row. Knowing the optimal value and all but one dual variable, the remaining variable follows from a single linear equation.",
        "强对偶是说，规划有最优解时，它的对偶也有，而且两个最优值相等，没有间隙。这是深刻的结论，单纯形法的最后一张表其实就在目标行中显示了最优的对偶解。知道最优值和除一个以外的所有对偶变量后，剩下的变量由一个线性方程就能求出。",
      ],
      (rng) => {
        const [b1, b2] = [rng.int(5, 30), rng.int(2, 12)];
        const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
        const z = b1 * y1 + b2 * y2;
        return ask(
          [
            `A program with right sides ${b1} and ${b2} has optimal value ${z}. Its optimal dual solution has $y_1 = ${y1}$. What is $y_2$?`,
            `一个规划的右端是 ${b1} 和 ${b2}，最优值是 ${z}。它的最优对偶解中 $y_1 = ${y1}$。$y_2$ 是多少？`,
          ],
          y2,
          [y2 + 1, y1, Q.of(z, b2), Q.of(z - b1, b2)],
          [
            `Strong duality gives $${b1}(${y1}) + ${b2}y_2 = ${z}$, so $y_2 = ${y2}$.`,
            `强对偶给出 $${b1}(${y1}) + ${b2}y_2 = ${z}$，所以 $y_2 = ${y2}$。`,
          ],
        );
      },
    ),
    point(
      "complementary-slackness",
      ["Complementary slackness", "互补松弛"],
      [
        "Complementary slackness links the two optimal solutions. If a primal constraint has slack, its dual variable is zero: a resource left over has no value at the margin. And if a primal variable is positive, its dual constraint is tight. These conditions turn a claimed optimum into a small system of equations for the dual values, which then either confirms the claim or refutes it.",
        "互补松弛把两个最优解联系起来。如果原问题的约束有松弛，它的对偶变量就是零：有剩余的资源在边际上没有价值。如果原变量是正的，它的对偶约束就是紧的。这些条件把声称的最优解变成关于对偶值的小方程组，它要么证实这个说法，要么否定它。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const k = rng.int(2, 8);
        const x0 = rng.int(2, 9);
        const b = rng.int(1, 6);
        const c1 = a * k;
        const c2 = rng.int(1, b * k);
        const A = x0 + rng.int(1, 9);
        const B = a * x0;
        return ask(
          [
            `Maximize $${c1}x_1 + ${term(c2, "x_2")}$ subject to $x_1 + x_2 \\le ${A}$, $${a}x_1 + ${term(b, "x_2")} \\le ${B}$, $x \\ge 0$. The optimum is $x = (${x0}, 0)$. What is the optimal $y_2$?`,
            `在 $x_1 + x_2 \\le ${A}$，$${a}x_1 + ${term(b, "x_2")} \\le ${B}$，$x \\ge 0$ 的条件下使 $${c1}x_1 + ${term(c2, "x_2")}$ 最大。最优解是 $x = (${x0}, 0)$。最优的 $y_2$ 是多少？`,
          ],
          k,
          [c1, 0, x0, Q.of(c2, b)],
          [
            `The first constraint has slack, so $y_1 = 0$. As $x_1 > 0$, its dual constraint is tight: $${a}y_2 = ${c1}$, so $y_2 = ${k}$.`,
            `第一个约束有松弛，所以 $y_1 = 0$。因为 $x_1 > 0$，它的对偶约束是紧的：$${a}y_2 = ${c1}$，所以 $y_2 = ${k}$。`,
          ],
        );
      },
    ),
  ],
);

const sensitivity = topic(
  "sensitivity-analysis",
  ["Sensitivity Analysis", "灵敏度分析"],
  ["Use shadow prices to predict how the optimum responds to changes.", "用影子价格预测最优值如何随变化而变化。"],
  ["strong-duality-and-complementary-slackness"],
  [],
  [
    point(
      "using-a-shadow-price",
      ["Using a shadow price", "使用影子价格"],
      [
        "An optimal dual variable is called a shadow price: it is the rate at which the optimal value changes as that constraint's right side grows. So buying more of a resource is worthwhile only below its shadow price. The rate holds for as long as the same basis stays optimal, and beyond that range it changes, so the prediction is safe only for small changes in the right side.",
        "最优的对偶变量称为影子价格：它是约束右端增大时最优值变化的速率。所以只有价格低于影子价格时，多买这种资源才划算。只要同一个基保持最优，这个速率就成立；超出范围就会改变，所以这个预测只对右端的小变化才可靠。",
      ],
      (rng) => {
        const z = rng.int(40, 200);
        const y = rng.int(2, 9);
        const d = rng.int(2, 9);
        const lower = rng.bool();
        const answer = lower ? z - y * d : z + y * d;
        return ask(
          [
            `A maximum of ${z} has shadow price ${y} on a constraint. If the right side ${lower ? "falls" : "rises"} by ${d}, and the basis stays optimal, what is the new maximum?`,
            `最大值 ${z} 在某个约束上的影子价格是 ${y}。如果右端${lower ? "减少" : "增加"} ${d}，而基保持最优，新的最大值是多少？`,
          ],
          answer,
          [lower ? z + y * d : z - y * d, z + d, z * y, lower ? z - d : z + y],
          [
            `The change is ${y} × ${d} = ${y * d}, so the maximum becomes ${answer}.`,
            `变化量是 ${y} × ${d} = ${y * d}，所以最大值变为 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "pricing-out-a-new-activity",
      ["Pricing out a new activity", "为新活动定价"],
      [
        "Shadow prices also value a new activity. Its resources would cost the amounts used times the shadow prices, and it is worth doing only if its profit is more than that. The difference is called the reduced cost. So a product can be assessed without resolving the whole program, and the shortfall says exactly how much its price must rise before it enters the optimal plan.",
        "影子价格也能评估新活动。它用的资源的成本是用量乘影子价格，只有利润超过这个成本才值得做。这个差称为检验数。所以不用重新求解整个规划就能评估一个产品，而差额恰好说明它的价格必须上涨多少才能进入最优计划。",
      ],
      (rng) => {
        const [y1, y2] = [rng.int(1, 6), rng.int(1, 6)];
        const [a1, a2] = [rng.int(1, 5), rng.int(1, 5)];
        const worth = a1 * y1 + a2 * y2;
        const gap = rng.int(1, worth - 1 > 8 ? 8 : Math.max(1, worth - 1));
        const price = Math.max(1, worth - gap);
        const answer = worth - price;
        return ask(
          [
            `Two resources have shadow prices ${y1} and ${y2}. A new product uses ${a1} and ${a2} units of them, and earns ${price} per unit. By how much must its profit rise before it is worth making?`,
            `两种资源的影子价格是 ${y1} 和 ${y2}。一种新产品每单位用它们 ${a1} 和 ${a2} 单位，利润是 ${price}。它的利润要增加多少才值得生产？`,
          ],
          answer,
          [worth, price, worth + price, answer + 1],
          [
            `Its resources are worth ${a1}(${y1}) + ${a2}(${y2}) = ${worth}, which is ${answer} more than ${price}.`,
            `它用的资源价值 ${a1}(${y1}) + ${a2}(${y2}) = ${worth}，比 ${price} 多 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const transportation = topic(
  "the-transportation-problem",
  ["The Transportation Problem", "运输问题"],
  ["Balance supply and demand, and build a starting plan with the northwest corner rule.", "平衡供需，并用西北角法则建立初始方案。"],
  ["the-dual-of-a-linear-program"],
  [],
  [
    point(
      "balancing-with-a-dummy",
      ["Balancing with a dummy", "用虚拟点平衡"],
      [
        "A transportation problem ships goods from sources with fixed supplies to destinations with fixed demands, at the least total cost. The standard method assumes that total supply equals total demand. When supply exceeds demand, a dummy destination is added with demand equal to the excess and zero cost, and shipments to it simply mean goods that stay behind. A shortage gets a dummy source in the same way.",
        "运输问题把货物从供应量固定的产地运到需求量固定的销地，使总成本最小。标准方法假设总供应等于总需求。供应超过需求时，加一个虚拟销地，需求等于多余的量，成本为零，运到那里就表示货物留在原地。短缺时用同样的方法加一个虚拟产地。",
      ],
      (rng) => {
        const s = [rng.int(30, 60), rng.int(30, 60), rng.int(30, 60)];
        const d = [rng.int(10, 40), rng.int(10, 40)];
        const answer = (s[0] as number) + (s[1] as number) + (s[2] as number) - (d[0] as number) - (d[1] as number);
        return ask(
          [
            `Three factories supply ${listed(s)} units, and two stores demand ${listed(d)} units. What demand must a dummy store have to balance the problem?`,
            `三家工厂分别供应 ${listed(s)} 单位，两家商店分别需要 ${listed(d)} 单位。要平衡这个问题，虚拟商店的需求必须是多少？`,
          ],
          answer,
          [answer + 10, (s[0] as number) + (s[1] as number) + (s[2] as number), (d[0] as number) + (d[1] as number), answer - 1],
          [
            `The supply totals ${answer + (d[0] as number) + (d[1] as number)} and the demand totals ${(d[0] as number) + (d[1] as number)}, so the dummy takes the ${answer} left over.`,
            `总供应是 ${answer + (d[0] as number) + (d[1] as number)}，总需求是 ${(d[0] as number) + (d[1] as number)}，所以虚拟商店接收剩下的 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-northwest-corner-rule",
      ["The northwest corner rule", "西北角法则"],
      [
        "The northwest corner rule builds a feasible starting plan while ignoring costs. Begin at the top left cell and ship as much as supply and demand allow, which finishes either the row or the column. Move right if the column is finished, or down if the row is finished, and repeat until all goods are placed. The plan is rarely cheap, but improvement steps start from it.",
        "西北角法则不考虑成本，建立一个可行的初始方案。从左上角的格子开始，尽量多运，这样会用完一行或一列。如果用完了列就向右移，如果用完了行就向下移，重复直到所有货物都分配完。这个方案很少是便宜的，但改进步骤从它开始。",
      ],
      (rng) => {
        const d1 = rng.int(5, 15);
        const d2 = rng.int(5, 15);
        const d3 = rng.int(5, 15);
        const s1 = d1 + rng.int(1, d2 - 1);
        const s2 = d1 + d2 + d3 - s1;
        const costs = [
          [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)],
          [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)],
        ] as [[number, number, number], [number, number, number]];
        const first = s1 - d1;
        const second = d2 - first;
        const answer = d1 * costs[0][0] + first * costs[0][1] + second * costs[1][1] + d3 * costs[1][2];
        return ask(
          [
            `Supplies are ${s1} and ${s2}, demands are ${d1}, ${d2}, ${d3}, and the unit costs are $${matrix(costs)}$. What is the total cost of the northwest corner plan?`,
            `供应量是 ${s1} 和 ${s2}，需求量是 ${d1}，${d2}，${d3}，单位成本是 $${matrix(costs)}$。西北角方案的总成本是多少？`,
          ],
          answer,
          [d1 * costs[0][0] + d2 * costs[0][1] + d3 * costs[1][2], s1 * costs[0][0] + s2 * costs[1][2], answer + d1, answer + 1],
          [
            `Ship ${d1} and then ${first} in the first row, and ${second} and then ${d3} in the second. The cost is ${d1}(${costs[0][0]}) + ${first}(${costs[0][1]}) + ${second}(${costs[1][1]}) + ${d3}(${costs[1][2]}) = ${answer}.`,
            `第一行运 ${d1} 和 ${first}，第二行运 ${second} 和 ${d3}。成本是 ${d1}(${costs[0][0]}) + ${first}(${costs[0][1]}) + ${second}(${costs[1][1]}) + ${d3}(${costs[1][2]}) = ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const improvingTransport = topic(
  "improving-a-transportation-plan",
  ["Improving a Transportation Plan", "改进运输方案"],
  ["Count basic cells, and evaluate an empty cell by its loop.", "数基本格，并通过闭回路评估空格。"],
  ["the-transportation-problem"],
  [["the-transportation-problem", 0.4]],
  [
    point(
      "counting-basic-cells",
      ["Counting basic cells", "数基本格"],
      [
        "A balanced transportation problem with $m$ sources and $n$ destinations has $m + n - 1$ independent constraints, because one of the row and column totals follows from all the others. So a basic plan uses that many cells, and the northwest corner rule produces exactly that number. A plan using fewer is degenerate, and a zero shipment is written in an extra cell to keep the count correct.",
        "$m$ 个产地、$n$ 个销地的平衡运输问题有 $m + n - 1$ 个独立约束，因为行列总和中有一个可由其他的推出。所以基本方案使用这么多个格子，西北角法则恰好产生这个数目。使用更少格子的方案是退化的，要在一个额外的格子里写上零运量，使数目保持正确。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const n = rng.int(2, 9);
        const answer = m + n - 1;
        return ask(
          [
            `A balanced transportation problem has ${m} sources and ${n} destinations. How many cells does a basic plan use?`,
            `一个平衡运输问题有 ${m} 个产地和 ${n} 个销地。基本方案使用多少个格子？`,
          ],
          answer,
          [m + n, m * n, answer - 1, Math.max(m, n)],
          [
            `The count is $${m} + ${n} - 1 = ${answer}$, since one constraint is redundant.`,
            `数目是 $${m} + ${n} - 1 = ${answer}$，因为有一个约束是多余的。`,
          ],
        );
      },
    ),
    point(
      "evaluating-an-empty-cell",
      ["Evaluating an empty cell", "评估空格"],
      [
        "To judge an empty cell, trace a closed loop from it through used cells, turning only at used cells, and alternately add and subtract one unit around the loop. Row and column totals stay balanced, so the change in total cost is the alternating sum of the unit costs. If this is negative, shipping along the loop saves money. A plan is optimal when no empty cell has a negative sum.",
        "判断空格时，从它出发经过已用的格子画一条闭回路，只在已用的格子转弯，沿回路交替加减一单位。行列总和保持平衡，所以总成本的变化是单位成本的交替和。如果它是负的，沿回路运输就能省钱。当没有空格的和为负时，方案就是最优的。",
      ],
      (rng) => {
        const costs = [
          [rng.int(1, 15), rng.int(1, 15)],
          [rng.int(1, 15), rng.int(1, 15)],
        ] as [[number, number], [number, number]];
        const answer = costs[0][1] - costs[1][1] + costs[1][0] - costs[0][0];
        return ask(
          [
            `The unit costs are $${matrix(costs)}$, and a plan uses every cell except the top right. By how much does the total cost change when one unit moves around the loop through the top right cell?`,
            `单位成本是 $${matrix(costs)}$，方案使用除右上角外的所有格子。一单位沿经过右上角的回路移动时，总成本变化多少？`,
          ],
          answer,
          [costs[0][1] + costs[1][1] - costs[1][0] - costs[0][0], -answer, costs[0][1], answer + 1],
          [
            `Add a unit at the top right and bottom left, and remove one at the bottom right and top left: $${costs[0][1]} - ${costs[1][1]} + ${costs[1][0]} - ${costs[0][0]} = ${answer}$.`,
            `在右上角和左下角加一单位，在右下角和左上角减一单位：$${costs[0][1]} - ${costs[1][1]} + ${costs[1][0]} - ${costs[0][0]} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const assignment = topic(
  "the-assignment-problem",
  ["The Assignment Problem", "指派问题"],
  ["Reduce a cost matrix, and find the cheapest assignment.", "化简成本矩阵，并求最便宜的指派。"],
  ["the-transportation-problem"],
  [],
  [
    point(
      "reducing-a-cost-matrix",
      ["Reducing a cost matrix", "化简成本矩阵"],
      [
        "An assignment problem matches each worker with one job at the least total cost. Subtracting a constant from a whole row or column changes every assignment's cost by the same amount, so the best assignment stays the best. The Hungarian method uses this to produce zeros: subtract each row's minimum from that row, then each column's minimum from that column. An assignment using only zeros is optimal.",
        "指派问题把每个工人匹配到一项工作，使总成本最小。从一整行或一整列减去一个常数，会使每种指派的成本变化相同的量，所以最好的指派仍然最好。匈牙利法用这一点产生零：从每一行减去该行的最小值，再从每一列减去该列的最小值。只用零的指派就是最优的。",
      ],
      (rng) => {
        const rows = [0, 1, 2].map(() => [rng.int(1, 15), rng.int(1, 15), rng.int(1, 15)]) as number[][];
        const afterRows = rows.map((r) => r.map((v) => v - Math.min(...r)));
        const columnMins = [0, 1, 2].map((c) => Math.min(...afterRows.map((r) => r[c] as number)));
        const cells = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => [r, c] as const));
        const remaining = (r: number, c: number) => (afterRows[r]?.[c] as number) - (columnMins[c] as number);
        const shifted = cells.filter(([r, c]) => remaining(r, c) > 0 && (columnMins[c] as number) > 0);
        const nonzero = cells.filter(([r, c]) => remaining(r, c) > 0);
        const [i, j] = rng.pick(shifted.length > 0 ? shifted : nonzero.length > 0 ? nonzero : cells) as readonly [number, number];
        const columnMin = columnMins[j] as number;
        const entry = afterRows[i]?.[j] as number;
        const answer = entry - columnMin;
        return ask(
          [
            `Reduce $${matrix(rows)}$ by subtracting each row's minimum and then each column's minimum. What is the entry in row ${i + 1}, column ${j + 1}?`,
            `化简 $${matrix(rows)}$：先从每行减去该行的最小值，再从每列减去该列的最小值。第 ${i + 1} 行第 ${j + 1} 列的元素是多少？`,
          ],
          answer,
          [rows[i]?.[j] as number, entry + 1, answer + 1, (rows[i]?.[j] as number) - columnMin],
          [
            `After the row step the entry is ${entry}, and the column's smallest entry is then ${columnMin}, which leaves ${answer}.`,
            `行化简后这个元素是 ${entry}，这时该列的最小元素是 ${columnMin}，所以剩下 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-cheapest-assignment",
      ["The cheapest assignment", "最便宜的指派"],
      [
        "A three by three assignment problem has only six possible assignments, one for each ordering of the jobs, so it can be checked by hand. Choosing the cheapest entry in each row is tempting but may give two workers the same job, and the sum of the row minimums is then only a lower bound. The answer must be a real assignment, using one entry from each row and each column.",
        "三乘三的指派问题只有六种可能的指派，每种工作的排列对应一种，所以可以手工检查。在每一行选最便宜的元素很诱人，但可能把同一项工作分给两个工人，这时各行最小值之和只是一个下界。答案必须是真正的指派，每行每列各用一个元素。",
      ],
      (rng) => {
        const rows = [0, 1, 2].map(() => [rng.int(1, 15), rng.int(1, 15), rng.int(1, 15)]) as number[][];
        const at = (i: number, j: number) => rows[i]?.[j] as number;
        const orders = [
          [0, 1, 2],
          [0, 2, 1],
          [1, 0, 2],
          [1, 2, 0],
          [2, 0, 1],
          [2, 1, 0],
        ] as const;
        const totals = orders.map(([p, q, r]) => at(0, p) + at(1, q) + at(2, r));
        const answer = Math.min(...totals);
        const best = orders[totals.indexOf(answer)] as readonly [number, number, number];
        const rowMins = rows.reduce((sum, r) => sum + Math.min(...r), 0);
        return ask(
          [
            `Workers are the rows and jobs are the columns of the cost matrix $${matrix(rows)}$. What is the smallest total cost of an assignment?`,
            `成本矩阵 $${matrix(rows)}$ 的行是工人，列是工作。指派的最小总成本是多少？`,
          ],
          answer,
          [
            Math.max(...totals),
            rowMins === answer ? answer + 1 : rowMins,
            answer + 1,
            at(0, 0) + at(1, 1) + at(2, 2) === answer ? answer + 2 : at(0, 0) + at(1, 1) + at(2, 2),
          ],
          [
            `The best assignment takes columns ${best[0] + 1}, ${best[1] + 1}, ${best[2] + 1} for rows 1, 2, 3, which costs ${answer}. The other orderings cost at least this.`,
            `最好的指派是第 1、2、3 行分别取第 ${best[0] + 1}、${best[1] + 1}、${best[2] + 1} 列，成本是 ${answer}。其他排列的成本都不低于它。`,
          ],
        );
      },
    ),
  ],
);

const maximumFlow = topic(
  "maximum-flow-and-minimum-cut",
  ["Maximum Flow and Minimum Cut", "最大流和最小割"],
  ["Compute cut capacities, and find a maximum flow from the smallest cut.", "计算割的容量，并由最小割求最大流。"],
  ["the-dual-of-a-linear-program"],
  [],
  [
    point(
      "the-capacity-of-a-cut",
      ["The capacity of a cut", "割的容量"],
      [
        "A flow network sends material from a source to a sink along edges with capacities. A cut splits the nodes into a part containing the source and a part containing the sink, and its capacity adds the capacities of edges leading from the first part to the second. Edges running backwards are not counted. Every unit of flow must cross the cut, so a cut's capacity bounds the flow.",
        "流网络沿有容量的边把物质从源点送到汇点。割把节点分成含源点和含汇点的两部分，它的容量是从第一部分指向第二部分的边的容量之和。反向的边不计入。每一单位流都必须穿过割，所以割的容量是流的上界。",
      ],
      (rng) => {
        const [sa, sb, at, bt, ab] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(1, 6)];
        const answer = sb + at + ab;
        return ask(
          [
            `A network has edges $s \\to a$ of capacity ${sa}, $s \\to b$ of capacity ${sb}, $a \\to t$ of capacity ${at}, $b \\to t$ of capacity ${bt} and $a \\to b$ of capacity ${ab}. What is the capacity of the cut with $s$ and $a$ on the source side?`,
            `网络的边有：$s \\to a$ 容量 ${sa}，$s \\to b$ 容量 ${sb}，$a \\to t$ 容量 ${at}，$b \\to t$ 容量 ${bt}，$a \\to b$ 容量 ${ab}。$s$ 和 $a$ 在源点一侧的割的容量是多少？`,
          ],
          answer,
          [sb + at, sa + sb, at + bt, sa + bt],
          [
            `The edges leaving this side are $s \\to b$, $a \\to t$ and $a \\to b$, with total ${sb} + ${at} + ${ab} = ${answer}.`,
            `离开这一侧的边是 $s \\to b$，$a \\to t$ 和 $a \\to b$，总和是 ${sb} + ${at} + ${ab} = ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-maximum-flow",
      ["The maximum flow", "最大流"],
      [
        "The max-flow min-cut theorem says that the largest flow from source to sink equals the smallest capacity of any cut. It is linear programming duality in another form, since the two problems are dual to each other. In a small network, listing every cut and taking the smallest gives the maximum flow directly, and the smallest cut shows exactly which edges form the bottleneck.",
        "最大流最小割定理说，从源点到汇点的最大流等于所有割的最小容量。它是线性规划对偶的另一种形式，因为这两个问题互为对偶。在小网络中，列出所有的割并取最小的，就能直接得到最大流，而最小割恰好显示哪些边构成瓶颈。",
      ],
      (rng) => {
        const [sa, sb, at, bt, ab] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(1, 6)];
        const cuts = [sa + sb, sb + at + ab, sa + bt, at + bt];
        const answer = Math.min(...cuts);
        return ask(
          [
            `A network has edges $s \\to a$ of capacity ${sa}, $s \\to b$ of capacity ${sb}, $a \\to t$ of capacity ${at}, $b \\to t$ of capacity ${bt} and $a \\to b$ of capacity ${ab}. What is the maximum flow from $s$ to $t$?`,
            `网络的边有：$s \\to a$ 容量 ${sa}，$s \\to b$ 容量 ${sb}，$a \\to t$ 容量 ${at}，$b \\to t$ 容量 ${bt}，$a \\to b$ 容量 ${ab}。从 $s$ 到 $t$ 的最大流是多少？`,
          ],
          answer,
          [...cuts.filter((c) => c !== answer), sa + sb + ab, answer + 1],
          [
            `The four cuts have capacities ${cuts.join(", ")}, and the smallest is ${answer}, which equals the maximum flow.`,
            `四个割的容量是 ${cuts.join("，")}，最小的是 ${answer}，它等于最大流。`,
          ],
        );
      },
    ),
  ],
);

const integerPrograms = topic(
  "integer-programming",
  ["Integer Programming", "整数规划"],
  ["Compare a program with its relaxation, and branch on a fractional variable.", "比较规划和它的松弛问题，并按分数变量分支。"],
  ["the-graphical-method-for-linear-programs"],
  [],
  [
    point(
      "an-integer-optimum",
      ["An integer optimum", "整数最优解"],
      [
        "When variables must be whole numbers, the program is much harder, and the corner theorem no longer applies. Dropping the whole-number requirement gives the relaxation, a linear program whose optimum bounds the integer optimum. For a maximum, the relaxed value is an upper bound. Simply rounding its solution may lose feasibility or optimality, so rounding is at best a starting point, not a method.",
        "变量必须是整数时，规划难得多，顶点定理也不再适用。去掉整数要求就得到松弛问题，它是一个线性规划，其最优值是整数最优值的界。对最大化问题，松弛的值是上界。直接把解四舍五入可能失去可行性或最优性，所以取整最多是一个起点，而不是方法。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const c = rng.int(2, 9);
        const q = rng.int(2, 12);
        const r = rng.int(1, a - 1);
        const b = a * q + r;
        const answer = c * q;
        return ask(
          [
            `Maximize $${c}x$ subject to $${a}x \\le ${b}$, with $x$ a nonnegative whole number. What is the maximum?`,
            `在 $${a}x \\le ${b}$，$x$ 为非负整数的条件下使 $${c}x$ 最大。最大值是多少？`,
          ],
          answer,
          [Q.of(c * b, a), c * (q + 1), q, answer + 1],
          [
            `The relaxation has $x = ${Q.of(b, a).toLatex()}$, but a whole number can reach only $x = ${q}$, which gives ${answer}.`,
            `松弛问题有 $x = ${Q.of(b, a).toLatex()}$，但整数最多取 $x = ${q}$，得到 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "branching-on-a-variable",
      ["Branching on a variable", "按变量分支"],
      [
        "Branch and bound splits a problem wherever the relaxation gives a fractional value. If a variable comes out between two whole numbers, no integer solution can lie strictly between them, so one branch adds a constraint that it is at most the lower one, and the other adds that it is at least the upper one. A branch whose bound cannot beat the best known solution is discarded.",
        "分支定界法在松弛问题给出分数值的地方拆分问题。如果一个变量取值在两个整数之间，整数解不可能严格落在它们之间，所以一个分支加上它不超过较小整数的约束，另一个分支加上它不小于较大整数的约束。界不可能超过已知最优解的分支被舍弃。",
      ],
      (rng) => {
        const d = rng.int(2, 7);
        const f = rng.int(1, d - 1);
        const w = rng.int(1, 20);
        const value = Q.of(w * d + f, d);
        return choose(
          rng,
          [
            `The relaxation gives $x_1 = ${value.toLatex()}$, and $x_1$ must be a whole number. Which two branches come next?`,
            `松弛问题给出 $x_1 = ${value.toLatex()}$，而 $x_1$ 必须是整数。接下来是哪两个分支？`,
          ],
          same(`x_1 \\le ${w} \\text{ and } x_1 \\ge ${w + 1}`),
          [
            same(`x_1 \\le ${w + 1} \\text{ and } x_1 \\ge ${w + 2}`),
            same(`x_1 \\le ${w - 1} \\text{ and } x_1 \\ge ${w}`),
            same(`x_1 = ${w} \\text{ and } x_1 = ${w + 1}`),
          ],
          [
            `The value lies between ${w} and ${w + 1}, and the branches exclude only the gap between them.`,
            `这个值在 ${w} 和 ${w + 1} 之间，两个分支只排除它们之间的空隙。`,
          ],
        );
      },
    ),
  ],
);

/** gameWithSaddle builds a payoff matrix with a saddle point of the given value. */
function gameWithSaddle(rng: Rng, v: number): { rows: number[][]; i: number; j: number } {
  const rows: number[][] = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(v - 8, v + 8)));
  const i = rng.int(0, 2);
  const j = rng.int(0, 2);
  for (let k = 0; k < 3; k += 1) {
    (rows[i] as number[])[k] = v + rng.int(1, 8);
    (rows[k] as number[])[j] = v - rng.int(1, 8);
  }
  (rows[i] as number[])[j] = v;
  return { rows, i, j };
}

const matrixGames = topic(
  "matrix-games",
  ["Matrix Games", "矩阵博弈"],
  ["Find saddle points and the value of a two by two game.", "求鞍点和二乘二博弈的值。"],
  ["the-dual-of-a-linear-program"],
  [],
  [
    point(
      "a-saddle-point",
      ["A saddle point", "鞍点"],
      [
        "In a matrix game, the row player chooses a row, the column player chooses a column, and the entry is paid to the row player. The row player guarantees the largest of the row minimums, and the column player limits the loss to the smallest of the column maximums. When these are equal, the entry is a saddle point, the smallest in its row and the largest in its column.",
        "在矩阵博弈中，行方选一行，列方选一列，相应的元素付给行方。行方能保证各行最小值中的最大者，列方能把损失限制在各列最大值中的最小者。这两者相等时，这个元素就是鞍点，它在所在行中最小，在所在列中最大。",
      ],
      (rng) => {
        const v = rng.int(-5, 12);
        const { rows } = gameWithSaddle(rng, v);
        const flat = rows.flat();
        return ask(
          [
            `The payoff matrix $${matrix(rows)}$ pays the row player, and it has a saddle point. What is the value of the game?`,
            `收益矩阵 $${matrix(rows)}$ 付给行方，它有鞍点。这个博弈的值是多少？`,
          ],
          v,
          [Math.max(...flat), Math.min(...flat), v + 1, v - 1],
          [
            `The entry $${v}$ is the smallest in its row and the largest in its column, so the value is $${v}$.`,
            `元素 $${v}$ 在所在行中最小，在所在列中最大，所以值是 $${v}$。`,
          ],
        );
      },
    ),
    point(
      "a-mixed-strategy-value",
      ["The value of a mixed strategy", "混合策略的值"],
      [
        "When no saddle point exists, each player mixes rows or columns at random, and von Neumann's minimax theorem says the guarantees then meet, a fact equal to strong duality for a suitable pair of programs. For a two by two game, the row player makes the opponent indifferent between columns. This gives the formula that the value is $\\frac{ad - bc}{a + d - b - c}$.",
        "没有鞍点时，每一方都随机混合各行或各列，冯·诺伊曼的极小极大定理说，这时双方的保证值相等，这相当于一对相应规划的强对偶。对二乘二博弈，行方使对手在各列之间无差别。这就给出公式：值等于 $\\frac{ad - bc}{a + d - b - c}$。",
      ],
      (rng) => {
        const low1 = rng.int(1, 4);
        const low2 = rng.int(1, 4);
        const a = rng.int(5, 12);
        const d = rng.int(5, 12);
        const denominator = a + d - low1 - low2;
        const asksValue = rng.bool();
        const answer = asksValue ? Q.of(a * d - low1 * low2, denominator) : Q.of(d - low2, denominator);
        return ask(
          [
            `The game $${matrix([
              [a, low1],
              [low2, d],
            ])}$ has no saddle point. ${asksValue ? "What is its value?" : "With what probability does the row player choose the first row?"}`,
            `博弈 $${matrix([
              [a, low1],
              [low2, d],
            ])}$ 没有鞍点。${asksValue ? "它的值是多少？" : "行方选择第一行的概率是多少？"}`,
          ],
          answer,
          asksValue
            ? [Q.of(a * d + low1 * low2, denominator), Q.of(a + d, 2), Q.of(a * d - low1 * low2, a + d), answer.add(Q.of(1))]
            : [Q.of(a - low1, denominator), Q.of(1, 2), Q.of(d, a + d), Q.of(a - low2, denominator)],
          asksValue
            ? [
                `The value is $\\frac{${a}(${d}) - ${low1}(${low2})}{${a} + ${d} - ${low1} - ${low2}} = ${answer.toLatex()}$.`,
                `值是 $\\frac{${a}(${d}) - ${low1}(${low2})}{${a} + ${d} - ${low1} - ${low2}} = ${answer.toLatex()}$。`,
              ]
            : [
                `Equal payoffs against both columns require $${a}p + ${low2}(1 - p) = ${low1}p + ${d}(1 - p)$, so $p = ${answer.toLatex()}$.`,
                `对两列的收益相等要求 $${a}p + ${low2}(1 - p) = ${low1}p + ${d}(1 - p)$，所以 $p = ${answer.toLatex()}$。`,
              ],
        );
      },
    ),
  ],
);

/** linearProgrammingTopics holds the topics written for the Linear Programming course. */
export const linearProgrammingTopics: readonly TopicDef[] = [
  formulating,
  graphical,
  standardForm,
  basicSolutions,
  tableau,
  pivoting,
  twoPhase,
  specialCases,
  dualProgram,
  weakDuality,
  strongDuality,
  sensitivity,
  transportation,
  improvingTransport,
  assignment,
  maximumFlow,
  integerPrograms,
  matrixGames,
];
